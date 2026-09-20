import * as THREE from 'three';

export interface RaycastResult {
  roomId: string;
  type: 'room' | 'marker';
  point: THREE.Vector3;
}

export class RaycastManager {
  private raycaster: THREE.Raycaster;
  private pointer: THREE.Vector2;
  private domElement: HTMLElement;
  private camera: THREE.Camera;
  private interactiveObjects: THREE.Object3D[] = [];

  constructor(domElement: HTMLElement, camera: THREE.Camera) {
    this.domElement = domElement;
    this.camera = camera;
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2(-999, -999);
  }

  public setInteractiveObjects(objects: THREE.Object3D[]) {
    this.interactiveObjects = objects;
  }

  public updatePointer(clientX: number, clientY: number) {
    const rect = this.domElement.getBoundingClientRect();
    this.pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  }

  public checkIntersection(): RaycastResult | null {
    if (this.pointer.x === -999 && this.pointer.y === -999) return null;

    this.raycaster.setFromCamera(this.pointer, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactiveObjects, true);

    for (const hit of intersects) {
      let current: THREE.Object3D | null = hit.object;
      while (current) {
        if (current.userData && current.userData.roomId) {
          return {
            roomId: current.userData.roomId,
            type: current.userData.type || 'room',
            point: hit.point
          };
        }
        current = current.parent;
      }
    }

    return null;
  }
}
