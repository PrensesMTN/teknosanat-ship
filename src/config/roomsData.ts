import { RoomData } from '../types';

export const ROOMS_DATA: Record<string, RoomData> = {
  kopru: {
    id: 'kopru',
    title: 'KOMUTA KÖPRÜSÜ',
    subtitle: 'Ana Seyrüsefer & Taktik Merkezi',
    deck: 1,
    deckName: 'Güverte 1: Üst Komuta',
    position: { x: 0, y: 1.8, z: 12 },
    size: { width: 7, height: 2.8, depth: 6 },
    color: '#00f0ff',
    accentColor: '#38bdf8',
    doors: ['laboratuvar', 'astronomi'],
    description: 'Uzay gemisinin merkezi sinir sistemi. Kaptan koltuğu, holografik yıldız haritası masası ve kuantum alt-uzay iletişim antenleri burada bulunur.',
    crewCount: 8,
    maxCrew: 12,
    powerDrawMW: 42.5,
    oxygenLevel: 99.4,
    temperatureC: 21.5,
    securityClearance: 'Kaptan Yetkisi',
    status: 'Faal',
    subsystems: [
      { name: 'Kuantum Dümen & Rota', status: 'optimal', efficiency: 99 },
      { name: 'Taktik Lidar & Sensör', status: 'optimal', efficiency: 97 },
      { name: 'Sub-space Komünikasyon', status: 'optimal', efficiency: 100 },
      { name: 'Kaptan Holo-Projeksiyon', status: 'active', efficiency: 95 }
    ],
    personnel: [
      { role: 'Filo Komutanı', name: 'Kpt. Ayla Karahan', status: 'Görevde' },
      { role: 'Baş Seyrüsefer Subayı', name: 'Tğm. Aras Erkin', status: 'Görevde' },
      { role: 'Taktik Konsol Sorumlusu', name: 'Kd. Bçvş. Selin Kaya', status: 'Nöbette' }
    ],
    telemetryLogs: [
      '[11:42:04] Derin uzay rotası Andromeda koridoruna kitlendi.',
      '[11:39:18] Güneş rüzgarı sapma payı %0.02 olarak hesaplandı.',
      '[11:30:00] Köprü hologram projeksiyonu senkronize edildi.'
    ]
  },

  laboratuvar: {
    id: 'laboratuvar',
    title: 'KUANTUM AR-GE LAB',
    subtitle: 'Astrofizik & Egzotik Madde Analizi',
    deck: 1,
    deckName: 'Güverte 1: Üst Komuta & Bilim',
    position: { x: -6.5, y: 1.8, z: 4 },
    size: { width: 6, height: 2.6, depth: 7 },
    color: '#a855f7',
    accentColor: '#c084fc',
    doors: ['kopru', 'astronomi'],
    description: 'Karanlık madde partikülleri, yerçekimsel dalga ölçümleri ve uzay zaman bükülmesi deneylerinin yapıldığı yüksek güvenlikli bilimsel araştırma alanı.',
    crewCount: 6,
    maxCrew: 10,
    powerDrawMW: 65.0,
    oxygenLevel: 98.8,
    temperatureC: 19.8,
    securityClearance: 'Seviye 3',
    status: 'Faal',
    subsystems: [
      { name: 'Egzotik Madde İzolatörü', status: 'optimal', efficiency: 94 },
      { name: 'Kuantum Süper Bilgisayar', status: 'active', efficiency: 98 },
      { name: 'Manyetik Hapsedici Vakum', status: 'optimal', efficiency: 96 }
    ],
    personnel: [
      { role: 'Baş Bilim Danışmanı', name: 'Dr. Zeynep Bilge', status: 'Deneyde' },
      { role: 'Kuantum Fizikçisi', name: 'Uzman Eren Demir', status: 'Aktif' }
    ],
    telemetryLogs: [
      '[11:41:50] Tachyon sensör kalibrasyonu tamamlandı.',
      '[11:35:12] Kriyojenik soğutucu akış hızı dengelendi (4.2 Kelvin).'
    ]
  },

  astronomi: {
    id: 'astronomi',
    title: 'HOLO-GÖZLEM KUBBESİ',
    subtitle: 'Yıldız Atlası & Spektroskopi',
    deck: 1,
    deckName: 'Güverte 1: Üst Komuta & Gözlem',
    position: { x: 6.5, y: 1.8, z: 4 },
    size: { width: 6, height: 2.6, depth: 7 },
    color: '#38bdf8',
    accentColor: '#7dd3fc',
    doors: ['kopru', 'laboratuvar'],
    description: 'Şeffaf meta-cam kubbe altında 360 derece derin uzay gözlemi sunar. Optik tayf ölçer ve nötrino dedektörleri ile yabancı yıldız sistemlerini tarar.',
    crewCount: 4,
    maxCrew: 8,
    powerDrawMW: 28.4,
    oxygenLevel: 99.1,
    temperatureC: 20.5,
    securityClearance: 'Seviye 2',
    status: 'Faal',
    subsystems: [
      { name: 'Spektral Yıldız Tarayıcı', status: 'optimal', efficiency: 99 },
      { name: 'Meta-Kristal Gözlem Kubbesi', status: 'optimal', efficiency: 100 },
      { name: 'Nötrino Akı Sensörleri', status: 'optimal', efficiency: 92 }
    ],
    personnel: [
      { role: 'Baş Astronom', name: 'Yrd. Doç. Kerem Soylu', status: 'Gözlemde' },
      { role: 'Gözlem Teknisyeni', name: 'Elif Vural', status: 'Kayıtta' }
    ],
    telemetryLogs: [
      '[11:40:02] NGC-4412 kuasar sinyali spektrumu çözümlendi.',
      '[11:22:15] Gözlem kubbesi mikro-meteor zırh polarizasyonu aktif.'
    ]
  },

  kafe: {
    id: 'kafe',
    title: 'YAŞAM ALANI & SCIENCE KAFE',
    subtitle: 'Sosyal İstasyon & Biyolojik Yenilenme',
    deck: 2,
    deckName: 'Güverte 2: Mürettebat & Destek',
    position: { x: 0, y: 0, z: 2 },
    size: { width: 7.5, height: 2.6, depth: 6.5 },
    color: '#fbbf24',
    accentColor: '#f59e0b',
    doors: ['hangar', 'revir'],
    description: 'Mürettebatın dinlenme, hidroponik besin tüketimi ve sosyal etkileşim alanı. Sentetik kahve sentezleyicileri ve yapay gün ışığı panelleri ile donatılmıştır.',
    crewCount: 14,
    maxCrew: 30,
    powerDrawMW: 18.2,
    oxygenLevel: 99.8,
    temperatureC: 22.8,
    securityClearance: 'Seviye 1',
    status: 'Faal',
    subsystems: [
      { name: 'Moleküler Besin Sentezleyici', status: 'optimal', efficiency: 98 },
      { name: 'Sirkadiyen Aydınlatma', status: 'active', efficiency: 100 },
      { name: 'Atmosfer Yenileyici Fitoplazma', status: 'optimal', efficiency: 99 }
    ],
    personnel: [
      { role: 'Sosyal Destek Şefi', name: 'Melih Tan', status: 'Görevde' },
      { role: 'Biyolog & Hidroponik Sorumlusu', name: 'Nazlı Acar', status: 'Serviste' }
    ],
    telemetryLogs: [
      '[11:43:00] Hidroponik yeşillik hasadı tamamlandı (Döngü 44).',
      '[11:15:30] Kafe hidro-filtre döngüsü yenilendi.'
    ]
  },

  hangar: {
    id: 'hangar',
    title: 'HANGAR & MEKİK PLATFORMU',
    subtitle: 'Uçuş Güvertesi & İnsansız Dron Hangarı',
    deck: 2,
    deckName: 'Güverte 2: Mürettebat & Destek',
    position: { x: -7, y: 0, z: -5 },
    size: { width: 8.5, height: 3.2, depth: 9 },
    color: '#06b6d4',
    accentColor: '#22d3ee',
    doors: ['kafe', 'reaktor'],
    description: 'Akademiye ana giriş ve kalkış platformu. Taktik keşif mekikleri, bakım dronları, manyetik fırlatma rayları ve atmosferik basınç kilitleri buradadır.',
    crewCount: 9,
    maxCrew: 20,
    powerDrawMW: 72.8,
    oxygenLevel: 97.9,
    temperatureC: 18.2,
    securityClearance: 'Seviye 2',
    status: 'Faal',
    subsystems: [
      { name: 'Manyetik Katapult Rayları', status: 'optimal', efficiency: 96 },
      { name: 'Mekik Bakım Dron Filosu', status: 'active', efficiency: 91 },
      { name: 'Atmosferik Hangar Kalkan Kapısı', status: 'optimal', efficiency: 100 }
    ],
    personnel: [
      { role: 'Hangar Uçuş Şefi', name: 'Bnb. Tarık Güven', status: 'Kontrolde' },
      { role: 'Mekik Baş Teknisyeni', name: 'Usta Can Polat', status: 'Bakımda' }
    ],
    telemetryLogs: [
      '[11:42:12] Keşif Mekiği Falcon-7 rutin bakımdan çıktı.',
      '[11:38:00] Hangar basınç kilit testi %100 başarıyla sonuçlandı.'
    ]
  },

  revir: {
    id: 'revir',
    title: 'MEDİKAL BÖLME & KRİYO-ODASI',
    subtitle: 'Biyo-Medikal Bakım & Acil Kriyosleep',
    deck: 2,
    deckName: 'Güverte 2: Mürettebat & Destek',
    position: { x: 7, y: 0, z: -5 },
    size: { width: 7.5, height: 2.8, depth: 8 },
    color: '#10b981',
    accentColor: '#34d399',
    doors: ['kafe', 'kalkan'],
    description: 'Mürettebatın sağlık takibi, cerrahi biyo-yataklar ve acil durumlarda derin uyku sağlayan 6 adet ileri teknoloji kriyojenik stasis kapsülü içerir.',
    crewCount: 5,
    maxCrew: 15,
    powerDrawMW: 31.6,
    oxygenLevel: 100.0,
    temperatureC: 21.0,
    securityClearance: 'Seviye 2',
    status: 'Faal',
    subsystems: [
      { name: 'Kriyojenik Stasis Kapsülleri', status: 'optimal', efficiency: 99 },
      { name: 'Nanobot Biyo-Yenileyici', status: 'optimal', efficiency: 95 },
      { name: 'Hücresel Doku Yazıcı', status: 'optimal', efficiency: 97 }
    ],
    personnel: [
      { role: 'Baş Tabip', name: 'Yzb. Dr. Banu Yıldız', status: 'Vizitede' },
      { role: 'Kriyo Uzmanı Hemşire', name: 'Seda Çelik', status: 'Nöbette' }
    ],
    telemetryLogs: [
      '[11:40:40] Tüm mürettebatın biyo-ritim vital verileri yeşil.',
      '[11:25:00] Kriyosleep kapsül 3 soğutma gazı basıncı doğrulandı.'
    ]
  },

  reaktor: {
    id: 'reaktor',
    title: 'İYON & WARP ÇEKİRDEĞİ',
    subtitle: 'Ana Plazma Üreteci & Kuantum Reaktörü',
    deck: 3,
    deckName: 'Güverte 3: Mühendislik & İtiş Gücü',
    position: { x: 0, y: -2.0, z: -10 },
    size: { width: 8.5, height: 3.5, depth: 9.5 },
    color: '#ec4899',
    accentColor: '#f43f5e',
    doors: ['hangar', 'kalkan'],
    description: 'Geminin ana enerji kalbi. Antimadde-madde çarpıştırıcısı, manyetik plazma halkaları ve hiper-uzay atlama motorlarına güç dağıtan iyon reaktörü.',
    crewCount: 7,
    maxCrew: 10,
    powerDrawMW: 1210.0,
    oxygenLevel: 96.5,
    temperatureC: 26.4,
    securityClearance: 'Seviye 3',
    status: 'Yüksek Yük',
    subsystems: [
      { name: 'Antimadde Tutma Manyetleri', status: 'optimal', efficiency: 99.8 },
      { name: 'Plazma Soğutma Pompaları', status: 'warning', efficiency: 86.4 },
      { name: 'Warp Bobin Enjektörleri', status: 'active', efficiency: 94.0 },
      { name: 'Nükleer Füzyon Yardımcı Reaktörü', status: 'optimal', efficiency: 99.0 }
    ],
    personnel: [
      { role: 'Başmühendis', name: 'Yrb. Oğuzhan Yalçın', status: 'Konsolda' },
      { role: 'Plazma Reaktör Teknisyeni', name: 'Müh. Burak Sarp', status: 'Devriyede' }
    ],
    telemetryLogs: [
      '[11:43:10] Warp çekirdeği rezonans frekansı 4.88 GHz.',
      '[11:36:44] Soğutucu döngü 2 sıcaklık artışı tespit edildi, kompanse edildi.',
      '[11:10:00] Antimadde tutma bariyeri %100 stabil.'
    ]
  },

  kalkan: {
    id: 'kalkan',
    title: 'DEFANS & KALKAN JENERATÖRÜ',
    subtitle: 'Manyetohidrodinamik Bariyer & Savunma',
    deck: 3,
    deckName: 'Güverte 3: Mühendislik & Güvenlik',
    position: { x: 5.5, y: -2.0, z: -2 },
    size: { width: 6.5, height: 2.8, depth: 7 },
    color: '#6366f1',
    accentColor: '#818cf8',
    doors: ['revir', 'reaktor'],
    description: 'Gövdeyi kozmik radyasyondan, asteroid parçacıklarından ve harici tehditlerden koruyan çok katmanlı yönlendirici enerji kalkan alanı jeneratörleri.',
    crewCount: 4,
    maxCrew: 8,
    powerDrawMW: 110.5,
    oxygenLevel: 98.2,
    temperatureC: 22.0,
    securityClearance: 'Seviye 3',
    status: 'Faal',
    subsystems: [
      { name: 'Deflektör Alanı Jeneratörü', status: 'optimal', efficiency: 98 },
      { name: 'Polarize Gövde Zırhı', status: 'optimal', efficiency: 97 },
      { name: 'Mikro-Meteor Savunma Lazerleri', status: 'active', efficiency: 95 }
    ],
    personnel: [
      { role: 'Savunma Sistemleri Amiri', name: 'Kd. Ütğm. Derya Kurt', status: 'Konsolda' },
      { role: 'Kalkan Güç Uzmanı', name: 'Asb. Murat Özen', status: 'Nöbette' }
    ],
    telemetryLogs: [
      '[11:42:55] Kalkan harmonik modülasyonu 450 MHz fazında kilitlendi.',
      '[11:29:10] Ön sektör deflektör matrisi tam kapasitede devrede.'
    ]
  }
};

export const INITIAL_SHIP_TELEMETRY = {
  hullIntegrity: 99.2,
  reactorOutputGW: 1.21,
  warpDriveState: 'HAZIR' as const,
  shieldStrength: 98.5,
  lifeSupportLevel: 99.4,
  totalCrew: 57,
  activeDeck: 0 as const,
  viewMode: '3d' as const,
  fps: 60
};
