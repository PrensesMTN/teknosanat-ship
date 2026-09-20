import * as THREE from 'three';
import { ROOMS_DATA } from '../config/roomsData';
import { DeckLevel, RoomData } from '../types';

export class MarkersManager {
  public group: THREE.Group;
  public markerMeshes: Map<string, THREE.Mesh> = new Map();
  private rings: THREE.Mesh[] = [];

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'MarkersGroup';
    this.createMarkers();
  }

  private createMarkers() {
    Object.values(ROOMS_DATA).forEach((room: RoomData) => {
      const markerGroup = new THREE.Group();
      markerGroup.name = `Marker_${room.id}`;
      // Hover above top of room
      markerGroup.position.set(
        room.position.x,
        room.position.y + room.size.height + 0.9,
        room.position.z
      );

      // Diamond / Octahedron Beacon
      const beaconGeo = new THREE.OctahedronGeometry(0.55, 0);
      const beaconMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(room.color),
        emissive: new THREE.Color(room.color),
        emissiveIntensity: 0.9,
        metalness: 0.2,
        roughness: 0.1
      });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.userData = { roomId: room.id, type: 'marker' };
      markerGroup.add(beacon);
      this.markerMeshes.set(room.id, beacon);

      // Horizontal pulsating halo ring
      const ringGeo = new THREE.RingGeometry(0.8, 0.95, 24);
      ringGeo.rotateX(Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(room.color),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      markerGroup.add(ring);
      this.rings.push(ring);

      // Vertical holographic beam
      const beamGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.4, 6);
      const beamMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(room.color),
        transparent: true,
        opacity: 0.5
      });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.y = -0.7;
      markerGroup.add(beam);

      this.group.add(markerGroup);
    });
  }

  public filterDeck(deck: DeckLevel) {
    Object.values(ROOMS_DATA).forEach((room) => {
      const markerGroup = this.group.getObjectByName(`Marker_${room.id}`);
      if (!markerGroup) return;

      if (deck === 0 || room.deck === deck) {
        markerGroup.visible = true;
      } else {
        markerGroup.visible = false;
      }
    });
  }

  public setHighlight(roomId: string | null) {
    this.markerMeshes.forEach((mesh, id) => {
      const isSelected = id === roomId;
      if (isSelected) {
        mesh.scale.set(1.4, 1.4, 1.4);
        (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.6;
      } else {
        mesh.scale.set(1.0, 1.0, 1.0);
        (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.9;
      }
    });
  }

  public update(time: number) {
    this.markerMeshes.forEach((mesh, idx) => {
      mesh.rotation.y = time * 1.5;
      mesh.rotation.x = Math.sin(time * 2 + Number(idx)) * 0.2;
    });

    this.rings.forEach((ring, idx) => {
      const scale = 1 + Math.sin(time * 3 + idx) * 0.2;
      ring.scale.set(scale, scale, scale);
    });
  }
}
