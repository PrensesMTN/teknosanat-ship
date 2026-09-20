import * as THREE from 'three';
import { ViewMode } from '../types';

export class ShipHull {
  public group: THREE.Group;
  private hullMeshes: THREE.Mesh[] = [];
  private wireframeMeshes: THREE.LineSegments[] = [];
  private thrusterPlumes: THREE.Mesh[] = [];
  private materials: {
    solid: THREE.Material;
    wireframe: THREE.Material;
    accent: THREE.Material;
    flux: THREE.Material;
    thruster: THREE.Material;
  };

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'ShipHullGroup';

    // Materials
    this.materials = {
      solid: new THREE.MeshStandardMaterial({
        color: 0x111928,
        metalness: 0.85,
        roughness: 0.25,
        transparent: true,
        opacity: 0.82,
        side: THREE.DoubleSide
      }),
      wireframe: new THREE.LineBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.6,
        linewidth: 1
      }),
      accent: new THREE.MeshStandardMaterial({
        color: 0x00f0ff,
        emissive: 0x00f0ff,
        emissiveIntensity: 0.8,
        metalness: 0.5,
        roughness: 0.2
      }),
      flux: new THREE.MeshStandardMaterial({
        color: 0x0a1020,
        emissive: 0xec4899,
        emissiveIntensity: 0.5,
        wireframe: true
      }),
      thruster: new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.75,
        side: THREE.DoubleSide
      })
    };

    this.buildHullGeometry();
    this.buildThrusters();
  }

  private buildHullGeometry() {
    // 1. Lower Spine / Keel Structure
    const spineGeo = new THREE.BoxGeometry(2.5, 1.2, 34);
    const spine = new THREE.Mesh(spineGeo, this.materials.solid);
    spine.position.set(0, -3.2, 1);
    this.addHullElement(spine);

    // 2. Port & Starboard Wing Pylons
    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0);
    wingShape.lineTo(14, -8);
    wingShape.lineTo(13, -16);
    wingShape.lineTo(0, -10);
    wingShape.closePath();

    const extrudeSettings = { depth: 0.6, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.2, bevelThickness: 0.2 };
    const wingGeo = new THREE.ExtrudeGeometry(wingShape, extrudeSettings);

    // Starboard Wing
    const rightWing = new THREE.Mesh(wingGeo, this.materials.solid);
    rightWing.rotation.x = Math.PI / 2;
    rightWing.position.set(3, -0.5, 0);
    this.addHullElement(rightWing);

    // Port Wing
    const leftWing = rightWing.clone();
    leftWing.scale.x = -1;
    leftWing.position.set(-3, -0.5, 0);
    this.addHullElement(leftWing);

    // 3. Warp Nacelles (Engines) on wing tips
    const nacelleGeo = new THREE.CylinderGeometry(1.4, 1.6, 16, 8);
    nacelleGeo.rotateX(Math.PI / 2);

    const rightNacelle = new THREE.Mesh(nacelleGeo, this.materials.solid);
    rightNacelle.position.set(13.5, 0.2, -10);
    this.addHullElement(rightNacelle);

    const leftNacelle = rightNacelle.clone();
    leftNacelle.position.set(-13.5, 0.2, -10);
    this.addHullElement(leftNacelle);

    // Nacelle glowing intake rings
    const ringGeo = new THREE.TorusGeometry(1.6, 0.15, 8, 24);
    const rightRing = new THREE.Mesh(ringGeo, this.materials.accent);
    rightRing.position.set(13.5, 0.2, -4);
    this.addHullElement(rightRing);

    const leftRing = rightRing.clone();
    leftRing.position.set(-13.5, 0.2, -4);
    this.addHullElement(leftRing);

    // 4. Forward Bow / Nose Cone Wedge
    const bowGeo = new THREE.ConeGeometry(5.5, 9, 4);
    bowGeo.rotateX(-Math.PI / 2);
    bowGeo.rotateY(Math.PI / 4);
    const bow = new THREE.Mesh(bowGeo, this.materials.solid);
    bow.position.set(0, 1.2, 19.5);
    bow.scale.set(1.4, 0.6, 1);
    this.addHullElement(bow);

    // 5. Structural Outer Rib Frames (Futuristic architectural open lattice)
    for (let z = -12; z <= 12; z += 6) {
      const ribGeo = new THREE.TorusGeometry(8.2, 0.18, 6, 32, Math.PI);
      const rib = new THREE.Mesh(ribGeo, this.materials.accent);
      rib.position.set(0, -0.5, z);
      this.addHullElement(rib);
    }
  }

  private buildThrusters() {
    // Animated glowing exhaust cones behind nacelles and main engine
    const thrusterGeo = new THREE.ConeGeometry(1.3, 4, 12, 1, true);
    thrusterGeo.rotateX(-Math.PI / 2);

    const positions = [
      new THREE.Vector3(13.5, 0.2, -19),
      new THREE.Vector3(-13.5, 0.2, -19),
      new THREE.Vector3(0, -2, -17)
    ];

    positions.forEach((pos) => {
      const plume = new THREE.Mesh(thrusterGeo, this.materials.thruster);
      plume.position.copy(pos);
      this.group.add(plume);
      this.thrusterPlumes.push(plume);
    });
  }

  private addHullElement(mesh: THREE.Mesh) {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.group.add(mesh);
    this.hullMeshes.push(mesh);

    // Generate wireframe overlay for Blueprint mode
    const wireframeGeo = new THREE.WireframeGeometry(mesh.geometry);
    const wireframe = new THREE.LineSegments(wireframeGeo, this.materials.wireframe);
    wireframe.position.copy(mesh.position);
    wireframe.rotation.copy(mesh.rotation);
    wireframe.scale.copy(mesh.scale);
    wireframe.visible = false;
    this.group.add(wireframe);
    this.wireframeMeshes.push(wireframe);
  }

  public updateMode(mode: ViewMode) {
    if (mode === 'blueprint') {
      // Semi-transparent ghost hull with bright cyan wireframe
      this.hullMeshes.forEach((mesh) => {
        (mesh.material as THREE.MeshStandardMaterial).opacity = 0.18;
      });
      this.wireframeMeshes.forEach((wire) => {
        wire.visible = true;
      });
    } else if (mode === 'flux') {
      this.hullMeshes.forEach((mesh) => {
        mesh.material = this.materials.flux;
      });
      this.wireframeMeshes.forEach((wire) => {
        wire.visible = true;
      });
    } else {
      // 3D Realistic
      this.hullMeshes.forEach((mesh) => {
        mesh.material = this.materials.solid;
        (mesh.material as THREE.MeshStandardMaterial).opacity = 0.85;
      });
      this.wireframeMeshes.forEach((wire) => {
        wire.visible = false;
      });
    }
  }

  public update(time: number) {
    // Pulse thruster exhaust
    this.thrusterPlumes.forEach((plume, index) => {
      const scale = 1 + Math.sin(time * 12 + index) * 0.15;
      plume.scale.set(scale, scale, 1 + Math.sin(time * 15 + index) * 0.25);
    });
  }
}
