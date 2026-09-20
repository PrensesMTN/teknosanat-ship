import * as THREE from 'three';
import { ROOMS_DATA } from '../config/roomsData';
import { DeckLevel, RoomData, ViewMode } from '../types';

export class RoomBuilder {
  public group: THREE.Group;
  public roomMeshes: Map<string, THREE.Mesh> = new Map();
  public roomOutlines: Map<string, THREE.LineSegments> = new Map();
  public conduitsGroup: THREE.Group;
  private floorMaterials: Map<string, THREE.MeshStandardMaterial> = new Map();

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'RoomBuilderGroup';
    this.conduitsGroup = new THREE.Group();
    this.conduitsGroup.name = 'PowerConduits';
    this.group.add(this.conduitsGroup);

    this.buildRooms();
    this.buildConduits();
  }

  private buildRooms() {
    Object.values(ROOMS_DATA).forEach((room: RoomData) => {
      const roomGroup = new THREE.Group();
      roomGroup.name = `Room_${room.id}`;
      roomGroup.position.set(room.position.x, room.position.y, room.position.z);

      // 1. Room Floor Plate
      const floorGeo = new THREE.BoxGeometry(room.size.width, 0.2, room.size.depth);
      const floorMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        emissive: new THREE.Color(room.color),
        emissiveIntensity: 0.15,
        metalness: 0.8,
        roughness: 0.3
      });
      this.floorMaterials.set(room.id, floorMat);

      const floor = new THREE.Mesh(floorGeo, floorMat);
      floor.position.y = 0;
      floor.receiveShadow = true;
      floor.userData = { roomId: room.id, type: 'room' };
      roomGroup.add(floor);
      this.roomMeshes.set(room.id, floor);

      // 2. Blueprint / Hologram Wireframe Perimeter
      const boxWireGeo = new THREE.BoxGeometry(room.size.width, room.size.height, room.size.depth);
      const wireEdges = new THREE.EdgesGeometry(boxWireGeo);
      const wireMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(room.color),
        transparent: true,
        opacity: 0.65
      });
      const wireframe = new THREE.LineSegments(wireEdges, wireMat);
      wireframe.position.y = room.size.height / 2;
      roomGroup.add(wireframe);
      this.roomOutlines.set(room.id, wireframe);

      // 3. Semi-transparent Glass Partition Walls
      const wallMat = new THREE.MeshStandardMaterial({
        color: 0x050c18,
        transparent: true,
        opacity: 0.22,
        roughness: 0.1,
        metalness: 0.5,
        side: THREE.DoubleSide
      });
      const wallGeo = new THREE.BoxGeometry(room.size.width * 0.98, room.size.height * 0.95, room.size.depth * 0.98);
      const walls = new THREE.Mesh(wallGeo, wallMat);
      walls.position.y = room.size.height / 2;
      walls.userData = { roomId: room.id, type: 'room' };
      roomGroup.add(walls);

      this.group.add(roomGroup);
    });
  }

  /**
   * Conduits and corridors connecting rooms based on roomsData.doors
   */
  private buildConduits() {
    const connectedPairs = new Set<string>();

    Object.values(ROOMS_DATA).forEach((room) => {
      room.doors.forEach((targetId) => {
        const targetRoom = ROOMS_DATA[targetId];
        if (!targetRoom) return;

        // Unique pair key to avoid duplicate conduit lines
        const pairKey = [room.id, targetId].sort().join('--');
        if (connectedPairs.has(pairKey)) return;
        connectedPairs.add(pairKey);

        const p1 = new THREE.Vector3(room.position.x, room.position.y + 0.1, room.position.z);
        const p2 = new THREE.Vector3(targetRoom.position.x, targetRoom.position.y + 0.1, targetRoom.position.z);

        // Spline path with right-angled sci-fi pathway
        const midPoint = new THREE.Vector3((p1.x + p2.x) / 2, (p1.y + p2.y) / 2, (p1.z + p2.z) / 2);
        const curve = new THREE.LineCurve3(p1, p2);
        const tubeGeo = new THREE.TubeGeometry(curve, 12, 0.12, 6, false);
        const tubeMat = new THREE.MeshStandardMaterial({
          color: 0x00f0ff,
          emissive: 0x00f0ff,
          emissiveIntensity: 0.8,
          metalness: 0.2,
          roughness: 0.1
        });
        const tube = new THREE.Mesh(tubeGeo, tubeMat);
        this.conduitsGroup.add(tube);
      });
    });
  }

  /**
   * Filter visible rooms by deck
   */
  public filterDeck(deck: DeckLevel) {
    Object.values(ROOMS_DATA).forEach((room) => {
      const roomGroup = this.group.getObjectByName(`Room_${room.id}`);
      if (!roomGroup) return;

      if (deck === 0 || room.deck === deck) {
        roomGroup.visible = true;
      } else {
        roomGroup.visible = false;
      }
    });
  }

  /**
   * Highlight selected or hovered room
   */
  public setHighlight(roomId: string | null, isHover: boolean = false) {
    this.floorMaterials.forEach((mat, id) => {
      const isSelected = id === roomId;
      if (isSelected) {
        mat.emissiveIntensity = isHover ? 0.6 : 0.95;
      } else {
        mat.emissiveIntensity = 0.15;
      }
    });

    this.roomOutlines.forEach((outline, id) => {
      const isSelected = id === roomId;
      const lineMat = outline.material as THREE.LineBasicMaterial;
      if (isSelected) {
        lineMat.opacity = 1.0;
        outline.scale.set(1.02, 1.02, 1.02);
      } else {
        lineMat.opacity = 0.55;
        outline.scale.set(1, 1, 1);
      }
    });
  }

  public updateMode(mode: ViewMode) {
    this.conduitsGroup.visible = mode !== '3d' || true;
    if (mode === 'flux') {
      this.conduitsGroup.children.forEach((child) => {
        const mesh = child as THREE.Mesh;
        (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.5;
      });
    }
  }

  public update(time: number) {
    // Subtle pulsating glow on conduits
    this.conduitsGroup.children.forEach((child, idx) => {
      const mesh = child as THREE.Mesh;
      if (mesh.material && 'emissiveIntensity' in mesh.material) {
        (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.6 + Math.sin(time * 3 + idx) * 0.35;
      }
    });
  }
}
