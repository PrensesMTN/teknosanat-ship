import * as THREE from 'three';
import { CameraManager } from './CameraManager';
import { LightingManager } from './Lighting';
import { ShipHull } from '../scene/ShipHull';
import { RoomBuilder } from '../scene/RoomBuilder';
import { RoomPropsManager } from '../scene/Props';
import { MarkersManager } from '../scene/Markers';
import { RaycastManager } from '../utils/Raycaster';
import { CameraPreset, DeckLevel, ViewMode } from '../types';
import { ROOMS_DATA } from '../config/roomsData';

export interface EngineCallbacks {
  onRoomSelect?: (roomId: string) => void;
  onRoomHover?: (roomId: string | null) => void;
  onFpsUpdate?: (fps: number) => void;
}

export class Engine {
  public container: HTMLElement;
  public renderer: THREE.WebGLRenderer;
  public scene: THREE.Scene;
  public cameraManager: CameraManager;
  public lighting: LightingManager;
  public hull: ShipHull;
  public roomBuilder: RoomBuilder;
  public propsManager: RoomPropsManager;
  public markersManager: MarkersManager;
  public raycastManager: RaycastManager;

  private isRunning: boolean = true;
  private animationFrameId: number = 0;
  private clock: THREE.Clock;
  private resizeObserver: ResizeObserver | null = null;
  private callbacks: EngineCallbacks;

  // Starfield
  private starfield: THREE.Points | null = null;

  // Floor blueprint grid
  private gridHelper: THREE.GridHelper | null = null;

  // Performance monitoring
  private frameCount: number = 0;
  private lastFpsUpdateTime: number = 0;
  private selectedRoomId: string | null = null;
  private hoveredRoomId: string | null = null;

  constructor(container: HTMLElement, callbacks: EngineCallbacks = {}) {
    this.container = container;
    this.callbacks = callbacks;
    this.clock = new THREE.Clock();

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x050811);
    this.scene.fog = new THREE.FogExp2(0x050811, 0.012);

    // 2. Renderer
    this.renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: true,
      alpha: false
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;

    container.appendChild(this.renderer.domElement);

    // 3. Camera Manager
    this.cameraManager = new CameraManager(this.renderer.domElement, width, height);

    // 4. Lighting
    this.lighting = new LightingManager();
    this.scene.add(this.lighting.group);

    // 5. Starfield & Floor Grid
    this.createStarfield();
    this.createBlueprintGrid();

    // 6. 3D Ship Layers
    this.hull = new ShipHull();
    this.scene.add(this.hull.group);

    this.roomBuilder = new RoomBuilder();
    this.scene.add(this.roomBuilder.group);

    this.propsManager = new RoomPropsManager();
    this.scene.add(this.propsManager.group);

    this.markersManager = new MarkersManager();
    this.scene.add(this.markersManager.group);

    // 7. Raycaster
    this.raycastManager = new RaycastManager(this.renderer.domElement, this.cameraManager.camera);
    this.updateInteractiveObjects();

    // 8. Event Handlers
    this.bindEvents();
    this.setupResizeObserver();

    // Start loop
    this.lastFpsUpdateTime = performance.now();
    this.tick();
  }

  private createStarfield() {
    const starCount = 1200;
    const starGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      // Distribute in a large sphere
      const r = 80 + Math.random() * 250;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i] = r * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = r * Math.cos(phi);

      // Star hues: cyan, white, light violet
      const isCyan = Math.random() > 0.4;
      colors[i] = isCyan ? 0.4 : 0.9;
      colors[i + 1] = isCyan ? 0.9 : 0.9;
      colors[i + 2] = 1.0;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });

    this.starfield = new THREE.Points(starGeo, starMat);
    this.scene.add(this.starfield);
  }

  private createBlueprintGrid() {
    // Holographic ground grid
    this.gridHelper = new THREE.GridHelper(90, 45, 0x00f0ff, 0x0a2540);
    this.gridHelper.position.y = -4.5;
    (this.gridHelper.material as THREE.Material).transparent = true;
    (this.gridHelper.material as THREE.Material).opacity = 0.45;
    this.scene.add(this.gridHelper);
  }

  private updateInteractiveObjects() {
    const targets: THREE.Object3D[] = [];
    this.roomBuilder.roomMeshes.forEach((mesh) => targets.push(mesh));
    this.markersManager.markerMeshes.forEach((mesh) => targets.push(mesh));
    this.raycastManager.setInteractiveObjects(targets);
  }

  private bindEvents() {
    const el = this.renderer.domElement;

    el.addEventListener('pointermove', (e) => {
      this.raycastManager.updatePointer(e.clientX, e.clientY);
      const hit = this.raycastManager.checkIntersection();
      const newHoverId = hit ? hit.roomId : null;

      if (newHoverId !== this.hoveredRoomId) {
        this.hoveredRoomId = newHoverId;
        el.style.cursor = newHoverId ? 'pointer' : 'default';
        this.roomBuilder.setHighlight(this.selectedRoomId || this.hoveredRoomId, !!this.hoveredRoomId && !this.selectedRoomId);
        if (this.callbacks.onRoomHover) {
          this.callbacks.onRoomHover(newHoverId);
        }
      }
    });

    el.addEventListener('click', () => {
      const hit = this.raycastManager.checkIntersection();
      if (hit && hit.roomId) {
        this.selectRoom(hit.roomId);
      }
    });
  }

  private setupResizeObserver() {
    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          this.renderer.setSize(width, height);
          this.cameraManager.resize(width, height);
        }
      }
    });
    this.resizeObserver.observe(this.container);
  }

  public selectRoom(roomId: string | null) {
    this.selectedRoomId = roomId;
    this.roomBuilder.setHighlight(roomId, false);
    this.markersManager.setHighlight(roomId);

    if (roomId && ROOMS_DATA[roomId]) {
      const room = ROOMS_DATA[roomId];
      this.cameraManager.flyToRoom(room.position, room.size);
      if (this.callbacks.onRoomSelect) {
        this.callbacks.onRoomSelect(roomId);
      }
    }
  }

  public setDeck(deck: DeckLevel) {
    this.roomBuilder.filterDeck(deck);
    this.markersManager.filterDeck(deck);
  }

  public setViewMode(mode: ViewMode) {
    this.lighting.updateMode(mode);
    this.hull.updateMode(mode);
    this.roomBuilder.updateMode(mode);

    if (this.gridHelper) {
      if (mode === 'blueprint') {
        (this.gridHelper.material as THREE.Material).opacity = 0.85;
      } else {
        (this.gridHelper.material as THREE.Material).opacity = 0.4;
      }
    }
  }

  public setCameraPreset(preset: CameraPreset) {
    this.cameraManager.setPreset(preset);
  }

  private tick = () => {
    if (!this.isRunning) return;

    const time = this.clock.getElapsedTime();

    // Subtle starfield slow rotation
    if (this.starfield) {
      this.starfield.rotation.y = time * 0.02;
    }

    // Update scene animations
    this.lighting.update(time);
    this.hull.update(time);
    this.roomBuilder.update(time);
    this.propsManager.update(time);
    this.markersManager.update(time);

    // Slow ambient rotation if no room is selected
    if (!this.selectedRoomId) {
      this.cameraManager.idleRotate(0.0006);
    }

    // Render
    this.renderer.render(this.scene, this.cameraManager.camera);

    // FPS Meter
    this.frameCount++;
    const now = performance.now();
    if (now - this.lastFpsUpdateTime >= 1000) {
      const fps = Math.round((this.frameCount * 1000) / (now - this.lastFpsUpdateTime));
      if (this.callbacks.onFpsUpdate) {
        this.callbacks.onFpsUpdate(fps);
      }
      this.frameCount = 0;
      this.lastFpsUpdateTime = now;
    }

    this.animationFrameId = requestAnimationFrame(this.tick);
  };

  public destroy() {
    this.isRunning = false;
    cancelAnimationFrame(this.animationFrameId);

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    this.cameraManager.destroy();
    this.renderer.dispose();

    if (this.renderer.domElement && this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
