export type DeckLevel = 0 | 1 | 2 | 3; // 0 = All Decks, 1 = Deck 1 (Upper), 2 = Deck 2 (Mid), 3 = Deck 3 (Lower)

export type ViewMode = '3d' | 'blueprint' | 'flux';

export type CameraPreset = 'overview' | 'iso' | 'top' | 'front' | 'cockpit' | 'free';

export interface RoomPosition {
  x: number;
  y: number;
  z: number;
}

export interface RoomSize {
  width: number;
  height: number;
  depth: number;
}

export interface RoomSubsystem {
  name: string;
  status: 'optimal' | 'warning' | 'critical' | 'active';
  efficiency: number; // 0 - 100%
}

export interface RoomData {
  id: string;
  title: string;
  subtitle: string;
  deck: 1 | 2 | 3;
  deckName: string;
  position: RoomPosition;
  size: RoomSize;
  color: string; // Hex color for room lighting & marker
  accentColor: string;
  doors: string[]; // Connected room IDs
  description: string;
  crewCount: number;
  maxCrew: number;
  powerDrawMW: number;
  oxygenLevel: number; // Percentage
  temperatureC: number;
  securityClearance: 'Seviye 1' | 'Seviye 2' | 'Seviye 3' | 'Kaptan Yetkisi';
  status: 'Faal' | 'Yüksek Yük' | 'Güvenli Mod' | 'Karantina';
  subsystems: RoomSubsystem[];
  personnel: {
    role: string;
    name: string;
    status: string;
  }[];
  telemetryLogs: string[];
}

export interface ShipTelemetry {
  hullIntegrity: number; // Percentage
  reactorOutputGW: number;
  warpDriveState: 'HAZIR' | 'ŞARJ EDİLİYOR' | 'SOĞUTMA' | 'DEVRE DIŞI';
  shieldStrength: number; // Percentage
  lifeSupportLevel: number;
  totalCrew: number;
  activeDeck: DeckLevel;
  viewMode: ViewMode;
  fps: number;
}
