import * as THREE from 'three';
import { ViewMode } from '../types';

export class LightingManager {
  public group: THREE.Group;
  private ambientLight: THREE.AmbientLight;
  private keyLight: THREE.DirectionalLight;
  private rimLight: THREE.DirectionalLight;
  private reactorLight: THREE.PointLight;
  private bridgeLight: THREE.PointLight;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'LightingGroup';

    // 1. Ambient Light
    this.ambientLight = new THREE.AmbientLight(0x0c1b30, 1.8);
    this.group.add(this.ambientLight);

    // 2. Main Key Directional Light (Sun/Orbital Star illumination)
    this.keyLight = new THREE.DirectionalLight(0xdbeafe, 2.5);
    this.keyLight.position.set(20, 35, 25);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 2048;
    this.keyLight.shadow.mapSize.height = 2048;
    this.keyLight.shadow.camera.near = 0.5;
    this.keyLight.shadow.camera.far = 100;
    this.keyLight.shadow.bias = -0.0005;
    this.group.add(this.keyLight);

    // 3. Rim/Back Light (for metallic edge reflection)
    this.rimLight = new THREE.DirectionalLight(0x00f0ff, 1.6);
    this.rimLight.position.set(-25, -15, -30);
    this.group.add(this.rimLight);

    // 4. Reactor core point light (magenta / violet glow)
    this.reactorLight = new THREE.PointLight(0xec4899, 3, 25);
    this.reactorLight.position.set(0, -2, -10);
    this.group.add(this.reactorLight);

    // 5. Bridge top beacon light (cyan)
    this.bridgeLight = new THREE.PointLight(0x00f0ff, 2.5, 20);
    this.bridgeLight.position.set(0, 3, 12);
    this.group.add(this.bridgeLight);
  }

  public updateMode(mode: ViewMode) {
    if (mode === 'blueprint') {
      // In blueprint holographic mode, reduce direct shadows and boost ambient glow
      this.ambientLight.color.setHex(0x002233);
      this.ambientLight.intensity = 2.4;
      this.keyLight.intensity = 0.8;
      this.rimLight.color.setHex(0x00f0ff);
      this.rimLight.intensity = 2.5;
    } else if (mode === 'flux') {
      // In energy flux mode, dark hull with intense reactor points
      this.ambientLight.color.setHex(0x050811);
      this.ambientLight.intensity = 1.0;
      this.keyLight.intensity = 0.5;
      this.rimLight.color.setHex(0xffaa00);
      this.rimLight.intensity = 2.0;
    } else {
      // 3D Realistic PBR
      this.ambientLight.color.setHex(0x0c1b30);
      this.ambientLight.intensity = 1.8;
      this.keyLight.intensity = 2.5;
      this.rimLight.color.setHex(0x38bdf8);
      this.rimLight.intensity = 1.6;
    }
  }

  public update(time: number) {
    // Subtle pulsating glow on reactor and bridge
    this.reactorLight.intensity = 2.5 + Math.sin(time * 3) * 0.8;
    this.bridgeLight.intensity = 2.0 + Math.cos(time * 2.2) * 0.4;
  }
}
