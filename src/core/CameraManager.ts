import * as THREE from 'three';
import gsap from 'gsap';
import { CameraPreset, RoomPosition, RoomSize } from '../types';

export class CameraManager {
  public camera: THREE.PerspectiveCamera;
  public target: THREE.Vector3;
  private domElement: HTMLElement;
  private isUserInteracting: boolean = false;
  private isDragging: boolean = false;
  private isPanning: boolean = false;
  private previousMousePosition = { x: 0, y: 0 };
  private spherical: THREE.Spherical;
  private minDistance: number = 8;
  private maxDistance: number = 75;

  constructor(domElement: HTMLElement, width: number, height: number) {
    this.domElement = domElement;
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.target = new THREE.Vector3(0, 0, 0);

    // Initial isometric perspective
    this.camera.position.set(24, 20, 24);
    this.camera.lookAt(this.target);

    // Initialize spherical coordinates for smooth manual orbiting
    const offset = new THREE.Vector3().subVectors(this.camera.position, this.target);
    this.spherical = new THREE.Spherical().setFromVector3(offset);

    this.bindEvents();
  }

  public resize(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  private bindEvents() {
    this.domElement.addEventListener('pointerdown', this.onPointerDown.bind(this));
    window.addEventListener('pointermove', this.onPointerMove.bind(this));
    window.addEventListener('pointerup', this.onPointerUp.bind(this));
    this.domElement.addEventListener('wheel', this.onWheel.bind(this), { passive: false });
    this.domElement.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  public destroy() {
    this.domElement.removeEventListener('pointerdown', this.onPointerDown.bind(this));
    window.removeEventListener('pointermove', this.onPointerMove.bind(this));
    window.removeEventListener('pointerup', this.onPointerUp.bind(this));
    this.domElement.removeEventListener('wheel', this.onWheel.bind(this));
  }

  private onPointerDown(e: PointerEvent) {
    if (e.button === 2) {
      this.isPanning = true;
    } else if (e.button === 0) {
      this.isDragging = true;
    }
    this.isUserInteracting = true;
    this.previousMousePosition = { x: e.clientX, y: e.clientY };
    gsap.killTweensOf(this.camera.position);
    gsap.killTweensOf(this.target);
  }

  private onPointerMove(e: PointerEvent) {
    if (!this.isUserInteracting) return;

    const deltaX = e.clientX - this.previousMousePosition.x;
    const deltaY = e.clientY - this.previousMousePosition.y;
    this.previousMousePosition = { x: e.clientX, y: e.clientY };

    if (this.isPanning) {
      // Pan camera and target together
      const panSpeed = 0.035 * (this.spherical.radius / 30);
      const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.camera.quaternion);
      const up = new THREE.Vector3(0, 1, 0).applyQuaternion(this.camera.quaternion);

      this.camera.position.addScaledVector(right, -deltaX * panSpeed);
      this.camera.position.addScaledVector(up, deltaY * panSpeed);
      this.target.addScaledVector(right, -deltaX * panSpeed);
      this.target.addScaledVector(up, deltaY * panSpeed);
      return;
    }

    if (this.isDragging) {
      // Orbit camera around target
      const rotateSpeed = 0.0055;
      this.spherical.theta -= deltaX * rotateSpeed;
      this.spherical.phi -= deltaY * rotateSpeed;

      // Constrain vertical rotation to prevent flipping
      this.spherical.phi = Math.max(0.08, Math.min(Math.PI / 2 + 0.35, this.spherical.phi));

      const offset = new THREE.Vector3().setFromSpherical(this.spherical);
      this.camera.position.copy(this.target).add(offset);
      this.camera.lookAt(this.target);
    }
  }

  private onPointerUp() {
    this.isDragging = false;
    this.isPanning = false;
    this.isUserInteracting = false;
    this.updateSphericalFromCurrent();
  }

  private onWheel(e: WheelEvent) {
    e.preventDefault();
    gsap.killTweensOf(this.camera.position);

    const zoomSpeed = 0.002;
    const factor = 1 + e.deltaY * zoomSpeed;
    this.spherical.radius = Math.max(this.minDistance, Math.min(this.maxDistance, this.spherical.radius * factor));

    const offset = new THREE.Vector3().setFromSpherical(this.spherical);
    this.camera.position.copy(this.target).add(offset);
    this.camera.lookAt(this.target);
  }

  private updateSphericalFromCurrent() {
    const offset = new THREE.Vector3().subVectors(this.camera.position, this.target);
    this.spherical.setFromVector3(offset);
  }

  /**
   * Smooth fly-to animation with GSAP to focus on a specific room
   */
  public flyToRoom(position: RoomPosition, size: RoomSize, onComplete?: () => void) {
    gsap.killTweensOf(this.camera.position);
    gsap.killTweensOf(this.target);

    // Calculate optimal view distance and angle
    const maxDim = Math.max(size.width, size.depth, size.height);
    const distance = Math.max(12, maxDim * 2.4);

    // Slight angle from the front-right of the room
    const targetLookAt = new THREE.Vector3(position.x, position.y + 0.5, position.z);
    const targetCamPos = new THREE.Vector3(
      position.x + (position.x > 0 ? 8 : -8),
      position.y + distance * 0.75,
      position.z + distance * 0.95
    );

    const tl = gsap.timeline({
      onUpdate: () => {
        this.camera.lookAt(this.target);
      },
      onComplete: () => {
        this.updateSphericalFromCurrent();
        if (onComplete) onComplete();
      }
    });

    tl.to(this.target, {
      x: targetLookAt.x,
      y: targetLookAt.y,
      z: targetLookAt.z,
      duration: 1.2,
      ease: 'power3.inOut'
    }, 0);

    tl.to(this.camera.position, {
      x: targetCamPos.x,
      y: targetCamPos.y,
      z: targetCamPos.z,
      duration: 1.4,
      ease: 'power3.out'
    }, 0);
  }

  /**
   * Preset Camera Positions
   */
  public setPreset(preset: CameraPreset, duration: number = 1.3) {
    gsap.killTweensOf(this.camera.position);
    gsap.killTweensOf(this.target);

    let targetCamPos: THREE.Vector3;
    let targetLookAt = new THREE.Vector3(0, 0, 0);

    switch (preset) {
      case 'top':
        // Pure top-down blueprint view
        targetCamPos = new THREE.Vector3(0, 44, 0.05);
        targetLookAt = new THREE.Vector3(0, 0, 0);
        break;
      case 'front':
        // Front bow / bridge elevation
        targetCamPos = new THREE.Vector3(0, 6, 32);
        targetLookAt = new THREE.Vector3(0, 0.5, 4);
        break;
      case 'cockpit':
        // Command deck vantage
        targetCamPos = new THREE.Vector3(0, 5, 20);
        targetLookAt = new THREE.Vector3(0, 1.8, 12);
        break;
      case 'overview':
      case 'iso':
      default:
        // Classic sci-fi isometric orthographic perspective
        targetCamPos = new THREE.Vector3(26, 22, 26);
        targetLookAt = new THREE.Vector3(0, 0, 0);
        break;
    }

    gsap.to(this.target, {
      x: targetLookAt.x,
      y: targetLookAt.y,
      z: targetLookAt.z,
      duration: duration * 0.9,
      ease: 'power3.inOut'
    });

    gsap.to(this.camera.position, {
      x: targetCamPos.x,
      y: targetCamPos.y,
      z: targetCamPos.z,
      duration: duration,
      ease: 'power3.out',
      onUpdate: () => {
        this.camera.lookAt(this.target);
      },
      onComplete: () => {
        this.updateSphericalFromCurrent();
      }
    });
  }

  /**
   * Slowly rotate in idle mode for dramatic presentation
   */
  public idleRotate(speed: number = 0.0008) {
    if (this.isUserInteracting) return;
    this.spherical.theta += speed;
    const offset = new THREE.Vector3().setFromSpherical(this.spherical);
    this.camera.position.copy(this.target).add(offset);
    this.camera.lookAt(this.target);
  }
}
