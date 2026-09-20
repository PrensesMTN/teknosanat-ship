import * as THREE from 'three';

export class RoomPropsManager {
  public group: THREE.Group;
  private animatedProps: Array<{
    mesh: THREE.Object3D;
    update: (time: number) => void;
  }> = [];

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'RoomPropsGroup';

    this.createBridgeHoloTable();
    this.createWarpCore();
    this.createHangarShuttle();
    this.createMedicalCryoPods();
    this.createLabQuantumServers();
    this.createShieldDeflector();
    this.createCafeSeating();
    this.createAstronomyDomeOrbits();
  }

  /**
   * 1. Bridge Holographic Table with rotating globe
   */
  private createBridgeHoloTable() {
    const tableGroup = new THREE.Group();
    tableGroup.position.set(0, 2.0, 12);

    // Pedestal
    const baseGeo = new THREE.CylinderGeometry(1.6, 2.0, 0.6, 8);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.2 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.3;
    tableGroup.add(base);

    // Glowing emitter ring
    const emitterGeo = new THREE.TorusGeometry(1.4, 0.08, 6, 24);
    emitterGeo.rotateX(Math.PI / 2);
    const emitterMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const emitter = new THREE.Mesh(emitterGeo, emitterMat);
    emitter.position.y = 0.62;
    tableGroup.add(emitter);

    // Holographic planetary sphere
    const holoGeo = new THREE.SphereGeometry(0.7, 16, 16);
    const holoMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.75
    });
    const holoSphere = new THREE.Mesh(holoGeo, holoMat);
    holoSphere.position.y = 1.35;
    tableGroup.add(holoSphere);

    // Holographic orbital rings
    const ringGeo = new THREE.RingGeometry(0.9, 0.95, 32);
    ringGeo.rotateX(Math.PI / 2.3);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.y = 1.35;
    tableGroup.add(ring);

    this.group.add(tableGroup);

    this.animatedProps.push({
      mesh: tableGroup,
      update: (time) => {
        holoSphere.rotation.y = time * 0.8;
        ring.rotation.z = time * 0.5;
        ring.rotation.x = Math.sin(time) * 0.2;
      }
    });
  }

  /**
   * 2. Warp Core in Reactor Room
   */
  private createWarpCore() {
    const coreGroup = new THREE.Group();
    coreGroup.position.set(0, -1.8, -10);

    // Central Containment Tube
    const tubeGeo = new THREE.CylinderGeometry(1.5, 1.5, 4.2, 16, 1, true);
    const tubeMat = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      transparent: true,
      opacity: 0.35,
      metalness: 0.2,
      roughness: 0.1,
      side: THREE.DoubleSide
    });
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    coreGroup.add(tube);

    // Glowing Plasma Core
    const plasmaGeo = new THREE.CylinderGeometry(0.6, 0.6, 3.8, 12);
    const plasmaMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e });
    const plasma = new THREE.Mesh(plasmaGeo, plasmaMat);
    coreGroup.add(plasma);

    // Magnetic Containment Rings
    const rings: THREE.Mesh[] = [];
    for (let i = -1.5; i <= 1.5; i += 0.8) {
      const ringGeo = new THREE.TorusGeometry(1.65, 0.12, 8, 24);
      ringGeo.rotateX(Math.PI / 2);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0x1e1b4b,
        emissive: 0xec4899,
        emissiveIntensity: 0.6,
        metalness: 0.9,
        roughness: 0.2
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.y = i;
      coreGroup.add(ring);
      rings.push(ring);
    }

    this.group.add(coreGroup);

    this.animatedProps.push({
      mesh: coreGroup,
      update: (time) => {
        plasma.scale.set(
          1 + Math.sin(time * 6) * 0.15,
          1,
          1 + Math.cos(time * 6) * 0.15
        );
        rings.forEach((r, idx) => {
          r.rotation.y = time * (idx % 2 === 0 ? 1.5 : -1.5);
        });
      }
    });
  }

  /**
   * 3. Shuttlecraft in Hangar
   */
  private createHangarShuttle() {
    const shuttleGroup = new THREE.Group();
    shuttleGroup.position.set(-7, 0.3, -5);
    shuttleGroup.rotation.y = Math.PI / 4;

    // Body
    const bodyGeo = new THREE.ConeGeometry(1.6, 4.2, 5);
    bodyGeo.rotateX(-Math.PI / 2);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.8,
      roughness: 0.3
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.scale.set(1.1, 0.6, 1);
    shuttleGroup.add(body);

    // Wings
    const wingGeo = new THREE.BoxGeometry(4.8, 0.1, 1.4);
    const wings = new THREE.Mesh(wingGeo, bodyMat);
    wings.position.set(0, 0, -0.6);
    shuttleGroup.add(wings);

    // Cockpit Canopy (Glowing cyan)
    const canopyGeo = new THREE.BoxGeometry(0.8, 0.4, 1.4);
    const canopyMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    canopy.position.set(0, 0.3, 0.5);
    shuttleGroup.add(canopy);

    this.group.add(shuttleGroup);
  }

  /**
   * 4. Cryo Pods in Medical Bay
   */
  private createMedicalCryoPods() {
    const medGroup = new THREE.Group();
    medGroup.position.set(7, 0.2, -5);

    for (let i = -2; i <= 2; i += 2) {
      const podGroup = new THREE.Group();
      podGroup.position.set(i, 0, 0);

      // Pod Base
      const baseGeo = new THREE.BoxGeometry(1.1, 0.5, 2.2);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.position.y = 0.25;
      podGroup.add(base);

      // Glass Chamber with cyan liquid glow
      const glassGeo = new THREE.CylinderGeometry(0.45, 0.45, 1.8, 12);
      glassGeo.rotateX(Math.PI / 2);
      const glassMat = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        emissive: 0x059669,
        emissiveIntensity: 0.4,
        transparent: true,
        opacity: 0.65
      });
      const glass = new THREE.Mesh(glassGeo, glassMat);
      glass.position.set(0, 0.65, 0);
      podGroup.add(glass);

      medGroup.add(podGroup);
    }

    this.group.add(medGroup);
  }

  /**
   * 5. Quantum Server Stacks in Lab
   */
  private createLabQuantumServers() {
    const labGroup = new THREE.Group();
    labGroup.position.set(-6.5, 2.0, 4);

    for (let x = -1.8; x <= 1.8; x += 1.8) {
      const rackGeo = new THREE.BoxGeometry(1.2, 2.0, 0.8);
      const rackMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.2 });
      const rack = new THREE.Mesh(rackGeo, rackMat);
      rack.position.set(x, 1.0, -1.8);
      labGroup.add(rack);

      // LED Blinking light strips
      const ledGeo = new THREE.PlaneGeometry(0.9, 0.08);
      for (let y = 0.4; y < 1.8; y += 0.3) {
        const ledMat = new THREE.MeshBasicMaterial({ color: Math.random() > 0.5 ? 0xa855f7 : 0x00f0ff });
        const led = new THREE.Mesh(ledGeo, ledMat);
        led.position.set(x, y, -1.39);
        labGroup.add(led);
      }
    }

    this.group.add(labGroup);
  }

  /**
   * 6. Shield Deflector Ring Coils in Defense Room
   */
  private createShieldDeflector() {
    const shieldGroup = new THREE.Group();
    shieldGroup.position.set(5.5, -1.8, -2);

    const ring1Geo = new THREE.TorusGeometry(1.4, 0.12, 8, 24);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x6366f1,
      emissive: 0x4f46e5,
      emissiveIntensity: 0.8
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    shieldGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(1.0, 0.1, 8, 24);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x818cf8, wireframe: true });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    shieldGroup.add(ring2);

    this.group.add(shieldGroup);

    this.animatedProps.push({
      mesh: shieldGroup,
      update: (time) => {
        ring1.rotation.x = time * 2;
        ring1.rotation.y = time * 1.5;
        ring2.rotation.z = -time * 2.2;
        ring2.rotation.x = time * 1.2;
      }
    });
  }

  /**
   * 7. Science Cafe Seating & Hydroponic Plants
   */
  private createCafeSeating() {
    const cafeGroup = new THREE.Group();
    cafeGroup.position.set(0, 0.2, 2);

    // Hydroponic Greenery Glow Box
    const boxGeo = new THREE.BoxGeometry(2.4, 0.6, 0.8);
    const boxMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
    const box = new THREE.Mesh(boxGeo, boxMat);
    box.position.set(0, 0.3, -1.8);
    cafeGroup.add(box);

    const plantGeo = new THREE.BoxGeometry(2.2, 0.4, 0.6);
    const plantMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const plant = new THREE.Mesh(plantGeo, plantMat);
    plant.position.set(0, 0.6, -1.8);
    cafeGroup.add(plant);

    // Cafe Tables
    const tableGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.08, 16);
    const tableMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xb45309, emissiveIntensity: 0.3 });
    const table = new THREE.Mesh(tableGeo, tableMat);
    table.position.set(0, 0.8, 0.5);
    cafeGroup.add(table);

    const legGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.8, 8);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9 });
    const leg = new THREE.Mesh(legGeo, legMat);
    leg.position.set(0, 0.4, 0.5);
    cafeGroup.add(leg);

    this.group.add(cafeGroup);
  }

  /**
   * 8. Astronomy Dome Star Coordinates Projector
   */
  private createAstronomyDomeOrbits() {
    const astroGroup = new THREE.Group();
    astroGroup.position.set(6.5, 2.0, 4);

    const domeGeo = new THREE.SphereGeometry(2.2, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    astroGroup.add(dome);

    this.group.add(astroGroup);

    this.animatedProps.push({
      mesh: astroGroup,
      update: (time) => {
        dome.rotation.y = time * 0.2;
      }
    });
  }

  public update(time: number) {
    this.animatedProps.forEach((prop) => prop.update(time));
  }
}
