'use strict';
/**
 * AK ekipman tipleri seed verisi.
 * Kaynak: AFAD Akreditasyon Kılavuzları (KAVKAS 2025, Arazide AK 2026,
 *         Selde Akarsuda AK Asgari Malzeme Listesi, IRNAP/ITUAS Kontrol Listesi)
 * İdempotent: slug üzerinden kontrol eder.
 * Akreditasyon seviyeleri — aciklama alanında belirtilmiştir:
 *   H = Hafif (A1) · O = Orta (A2) · A = Ağır (A3/Kentsel Ağır)
 */
const AnaKategori  = require('../models/AnaKategori');
const EkipmanTipi  = require('../models/EkipmanTipi');

const TIPLER = [
  // ══════════════════════════════════════════════════════════════════════════
  // İLETİŞİM
  // ══════════════════════════════════════════════════════════════════════════
  { kat: 'iletisim', altKategori: 'VHF El Telsizi', slug: 'vhf-handheld',
    tipNotu: 'Su geçirmez, IP67', bakimPeriyodu: 365,
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text', zorunlu: true },
      { ad: 'Frekans Aralığı', birim: 'MHz', tip: 'text' },
      { ad: 'Pil Kapasitesi', birim: 'mAh', tip: 'number' },
    ] },
  { kat: 'iletisim', altKategori: 'Uydu Telefonu', slug: 'sat-phone',
    tipNotu: 'Iridium / Thuraya', bakimPeriyodu: 180,
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text', zorunlu: true },
      { ad: 'SIM / Abone No', tip: 'text' },
    ] },
  { kat: 'iletisim', altKategori: 'PLB (Kişisel Konum İşareti)', slug: 'plb',
    tipNotu: '406 MHz COSPAS-SARSAT', bakimPeriyodu: 365, kalibrasyonGerekli: true,
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text', zorunlu: true },
      { ad: '15-Hex Tanımlayıcı', tip: 'text' },
      { ad: 'Pil Son Kullanma Tarihi', tip: 'date' },
    ] },

  { kat: 'iletisim', altKategori: 'Cep Telefonu (Saha)', slug: 'field-mobile',
    tipNotu: 'Su geçirmez, dayanıklı, H/O/A', bakimPeriyodu: 365,
    aciklama: 'H·O·A — KAVKAS ve Arazi tüm seviyeler',
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text', zorunlu: true },
      { ad: 'IMEI', tip: 'text' },
    ] },
  { kat: 'iletisim', altKategori: 'Sabit/Araç Telsizi', slug: 'vehicle-radio',
    tipNotu: 'AFAD frekans uyumlu', bakimPeriyodu: 365,
    aciklama: 'H·O·A — tüm araç ve üslerde',
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text', zorunlu: true },
      { ad: 'Frekans Aralığı', birim: 'MHz', tip: 'text' },
    ] },

  // ══════════════════════════════════════════════════════════════════════════
  // NAVİGASYON
  // ══════════════════════════════════════════════════════════════════════════
  { kat: 'navigasyon', altKategori: 'El GPS', slug: 'hand-gps',
    tipNotu: 'WAAS/GLONASS', bakimPeriyodu: 365,
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text', zorunlu: true },
      { ad: 'Harita Yüklü mü?', tip: 'boolean' },
    ] },
  { kat: 'navigasyon', altKategori: 'Silva Pusula', slug: 'compass',
    bakimPeriyodu: 730,
    aciklama: 'H·O·A — Arazi ve KAVKAS tüm seviyeler',
    ozellikSablonu: [{ ad: 'Model', tip: 'text' }] },
  { kat: 'navigasyon', altKategori: 'Dürbün', slug: 'binoculars',
    tipNotu: 'Min 8×42', bakimPeriyodu: 730,
    aciklama: 'H=2, O=3, A=4 adet — Arazi seviyeleri',
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text' },
      { ad: 'Büyütme', tip: 'text' },
    ] },
  { kat: 'navigasyon', altKategori: 'İnsansız Hava Aracı (İHA/Drone)', slug: 'drone',
    tipNotu: 'Termal + görünür kameralı', bakimPeriyodu: 180, kalibrasyonGerekli: true,
    aciklama: 'A — Arazi ve KAVKAS Ağır seviye zorunlu',
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text', zorunlu: true },
      { ad: 'Seri No / Tescil', tip: 'text' },
      { ad: 'Uçuş Süresi', birim: 'dk', tip: 'number' },
      { ad: 'Termal Kamera var mı?', tip: 'boolean' },
    ] },

  // ══════════════════════════════════════════════════════════════════════════
  // AYDINLATMA VE GÜÇ
  // ══════════════════════════════════════════════════════════════════════════
  { kat: 'aydinlatma', altKategori: 'El Feneri / Projektör', slug: 'hand-torch',
    tipNotu: 'Su geçirmez, yüksek lümen', bakimPeriyodu: 365,
    aciklama: 'H·O·A — Sel kılavuzu: tüm araçlarda zorunlu',
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text' },
      { ad: 'Lümen', birim: 'lm', tip: 'number' },
    ] },
  { kat: 'aydinlatma', altKategori: 'Kafa Feneri', slug: 'headlamp',
    tipNotu: 'Min 300 lm, şarjlı', bakimPeriyodu: 365,
    aciklama: 'H·O·A — Arazi: kişi başı zorunlu',
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text', zorunlu: true },
      { ad: 'Lümen', birim: 'lm', tip: 'number' },
      { ad: 'Şarjlı mı?', tip: 'boolean' },
    ] },
  { kat: 'aydinlatma', altKategori: 'Taşınabilir Jeneratör', slug: 'generator',
    tipNotu: 'Benzinli / Benzinsiz', bakimPeriyodu: 90,
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text', zorunlu: true },
      { ad: 'Güç', birim: 'kVA', tip: 'number' },
      { ad: 'Yakıt Tipi', tip: 'select', secenekler: ['Benzin', 'Dizel', 'LPG'] },
    ] },
  { kat: 'aydinlatma', altKategori: 'Taşınabilir Güç İstasyonu', slug: 'power-station',
    bakimPeriyodu: 180,
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text', zorunlu: true },
      { ad: 'Kapasite', birim: 'Wh', tip: 'number' },
    ] },
  { kat: 'aydinlatma', altKategori: 'Sahil / Saha Aydınlatma Seti (Balon Lamba)', slug: 'balloon-light',
    tipNotu: 'Gece operasyonu, 360° aydınlatma', bakimPeriyodu: 365,
    aciklama: 'O·A — KAVKAS gece operasyon şartı',
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text' },
      { ad: 'Güç', birim: 'W', tip: 'number' },
    ] },
  { kat: 'aydinlatma', altKategori: 'Hava Kompresörü / Basınçlı Hava Sistemi', slug: 'air-compressor',
    tipNotu: 'Pnömatik alet beslemesi', bakimPeriyodu: 180,
    aciklama: 'O·A — KAVKAS: pnömatik kaldırma ekipmanı için',
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text' },
      { ad: 'Çalışma Basıncı', birim: 'bar', tip: 'number' },
      { ad: 'Debi', birim: 'L/dk', tip: 'number' },
    ] },

  // ══════════════════════════════════════════════════════════════════════════
  // TIBBİ VE İLK YARDIM
  // ══════════════════════════════════════════════════════════════════════════
  { kat: 'tibbiilkyardim', altKategori: 'İlk Yardım Çantası (Takım)', slug: 'first-aid-bag',
    bakimPeriyodu: 180,
    aciklama: 'H=3, O=5, A=5+ — Arazi seviyeleri; KAVKAS tüm seviyeler',
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text' },
      { ad: 'Son Kullanma Tarihi Kontrolü', tip: 'date' },
    ] },
  { kat: 'tibbiilkyardim', altKategori: 'Otomatik Eksternal Defibrilatör (AED)', slug: 'aed',
    bakimPeriyodu: 180, kalibrasyonGerekli: true,
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text', zorunlu: true },
      { ad: 'Seri Numarası', tip: 'text' },
      { ad: 'Ped Son Kullanma Tarihi', tip: 'date' },
    ] },
  { kat: 'tibbiilkyardim', altKategori: 'Vakumlu Sedye', slug: 'vacuum-stretcher',
    bakimPeriyodu: 365,
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text' },
      { ad: 'Max Yük Kapasitesi', birim: 'kg', tip: 'number' },
    ] },
  { kat: 'tibbiilkyardim', altKategori: 'Oksijen Seti', slug: 'oxygen-set',
    bakimPeriyodu: 90, kalibrasyonGerekli: true,
    aciklama: 'O·A — KAVKAS ve IRNAP',
    ozellikSablonu: [
      { ad: 'Tüp Hacmi', birim: 'L', tip: 'number' },
      { ad: 'Son Dolum Tarihi', tip: 'date' },
    ] },
  { kat: 'tibbiilkyardim', altKategori: 'Triyaj Seti', slug: 'triage-kit',
    tipNotu: 'START/SALT protokolü', bakimPeriyodu: 180,
    aciklama: 'O·A — KAVKAS ve IRNAP ekipleri',
    ozellikSablonu: [
      { ad: 'Seri/Lot No', tip: 'text' },
      { ad: 'Son Kullanma Tarihi', tip: 'date' },
    ] },
  { kat: 'tibbiilkyardim', altKategori: 'Kurtarma Sedyesi (Yüzme / Nehir)', slug: 'water-rescue-stretcher',
    tipNotu: 'Yüzen, bağlama kayışlı', bakimPeriyodu: 365,
    aciklama: 'H·O·A — Sel/Akarsu Kılavuzu: tüm seviyelerde',
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text' },
      { ad: 'Max Yük', birim: 'kg', tip: 'number' },
    ] },
  { kat: 'tibbiilkyardim', altKategori: 'Sırt Tahtası (Spinal Board)', slug: 'spinal-board',
    tipNotu: 'X-Ray geçirgen, kafa tespit aparatlı', bakimPeriyodu: 730,
    aciklama: 'O·A — KAVKAS ve Arazi',
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text' },
      { ad: 'Kafa Tespit Aparatı var mı?', tip: 'boolean' },
    ] },
  { kat: 'tibbiilkyardim', altKategori: 'Kontrollü İlaç Seti', slug: 'controlled-meds',
    tipNotu: 'Morfin sülfat, analjezik vb. — doktor onaylı', bakimPeriyodu: 90,
    aciklama: 'A — IRNAP/KAVKAS Ağır seviye, doktor eşliğinde',
    ozellikSablonu: [
      { ad: 'İçerik Listesi', tip: 'text' },
      { ad: 'Son Kullanma Tarihi', tip: 'date' },
      { ad: 'Sorumlu Hekim', tip: 'text' },
    ] },

  // ══════════════════════════════════════════════════════════════════════════
  // TEKNİK KURTARMA
  // ══════════════════════════════════════════════════════════════════════════
  { kat: 'teknik_kurtarma', altKategori: 'Statik Halat', slug: 'static-rope',
    tipNotu: 'EN 1891 Tip A, Ø11mm', bakimPeriyodu: 365,
    ozellikSablonu: [
      { ad: 'Çap', birim: 'mm', tip: 'number', zorunlu: true },
      { ad: 'Uzunluk', birim: 'm', tip: 'number', zorunlu: true },
      { ad: 'Üretim Tarihi', tip: 'date' },
      { ad: 'İlk Kullanım Tarihi', tip: 'date' },
    ] },
  { kat: 'teknik_kurtarma', altKategori: 'Dinamik Halat', slug: 'dynamic-rope',
    tipNotu: 'EN 892, Tek İp', bakimPeriyodu: 365,
    ozellikSablonu: [
      { ad: 'Çap', birim: 'mm', tip: 'number', zorunlu: true },
      { ad: 'Uzunluk', birim: 'm', tip: 'number', zorunlu: true },
      { ad: 'Üretim Tarihi', tip: 'date' },
    ] },
  { kat: 'teknik_kurtarma', altKategori: 'Makara (Kurtarma)', slug: 'pulley',
    bakimPeriyodu: 365,
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text' },
      { ad: 'MWL', birim: 'kN', tip: 'number' },
    ] },
  { kat: 'teknik_kurtarma', altKategori: 'İnişçi Cihazı (Rack/Pirana)', slug: 'descender',
    bakimPeriyodu: 365,
    ozellikSablonu: [
      { ad: 'Model', tip: 'text' },
      { ad: 'Uyumlu Halat Çapı', birim: 'mm', tip: 'text' },
    ] },
  { kat: 'teknik_kurtarma', altKategori: 'Hız Kısıtlı Kurtarma Kriko (Tirfor)', slug: 'tirfor',
    tipNotu: 'T-35 / 3.2t', bakimPeriyodu: 365,
    aciklama: 'O·A — KAVKAS ve IRNAP',
    ozellikSablonu: [
      { ad: 'Kapasite', birim: 'ton', tip: 'number', zorunlu: true },
    ] },
  { kat: 'teknik_kurtarma', altKategori: 'Pnömatik Kaldırma Yastığı (Hava Kriko)', slug: 'air-lifting-bag',
    tipNotu: 'Yüksek/düşük basınç set', bakimPeriyodu: 365, kalibrasyonGerekli: true,
    aciklama: 'O=1t, A=2.5t — KAVKAS kontrol listesi',
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text', zorunlu: true },
      { ad: 'Kaldırma Kapasitesi', birim: 'ton', tip: 'number', zorunlu: true },
      { ad: 'Max Basınç', birim: 'bar', tip: 'number' },
    ] },
  { kat: 'teknik_kurtarma', altKategori: 'Karabina (Güvenlik Kilidi)', slug: 'carabiner',
    tipNotu: 'EN 362 / NFPA 1983', bakimPeriyodu: 365,
    aciklama: 'O·A — Arazi ve KAVKAS halat sistemleri',
    ozellikSablonu: [
      { ad: 'Tip', tip: 'select', secenekler: ['HMS/Pear', 'Oval', 'D-Form', 'Directional'] },
      { ad: 'MBS', birim: 'kN', tip: 'number' },
      { ad: 'Kilitleme Tipi', tip: 'select', secenekler: ['Vidalı', 'Otomatik', 'Çift Emniyet'] },
      { ad: 'Üretim Tarihi', tip: 'date' },
    ] },
  { kat: 'teknik_kurtarma', altKategori: 'Jumar / Mekanik Prusik (Tırmanma Aleti)', slug: 'ascender',
    tipNotu: 'EN 567, sol/sağ set', bakimPeriyodu: 365,
    aciklama: 'O·A — Arazi Orta ve Ağır',
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text' },
      { ad: 'El', tip: 'select', secenekler: ['Sol', 'Sağ', 'Merkez/Chest'] },
    ] },
  { kat: 'teknik_kurtarma', altKategori: 'Webbing / Şerit Askı (Sling)', slug: 'webbing-sling',
    tipNotu: 'EN 566, 25mm/60mm', bakimPeriyodu: 365,
    aciklama: 'O·A — Arazi halat sistemi bileşeni',
    ozellikSablonu: [
      { ad: 'Genişlik', birim: 'mm', tip: 'number' },
      { ad: 'Uzunluk', birim: 'cm', tip: 'number' },
      { ad: 'MBS', birim: 'kN', tip: 'number' },
    ] },
  { kat: 'teknik_kurtarma', altKategori: 'Halat Koruyucu / Edge Roller', slug: 'rope-protector',
    tipNotu: 'Keskin kenarlarda halat koruması', bakimPeriyodu: 730,
    aciklama: 'O·A — Arazi halat sistemi bileşeni',
    ozellikSablonu: [
      { ad: 'Tip', tip: 'select', secenekler: ['Köşebent Koruyucu', 'Edge Roller', 'Boru Koruyucu'] },
    ] },
  { kat: 'teknik_kurtarma', altKategori: 'Yüzer Kurtarma İpi (Throw Bag)', slug: 'throw-bag',
    tipNotu: '15m torbalı yüzer ip — su kurtarma', bakimPeriyodu: 365,
    aciklama: 'H·O·A — Sel/Akarsu Kılavuzu: kişi başı zorunlu',
    ozellikSablonu: [
      { ad: 'Uzunluk', birim: 'm', tip: 'number', zorunlu: true },
      { ad: 'Çap', birim: 'mm', tip: 'number' },
    ] },
  { kat: 'teknik_kurtarma', altKategori: 'Şamandra / Bojlu Halat Sistemi', slug: 'buoy-system',
    tipNotu: 'Akarsu geçiş halatı, şamandralı', bakimPeriyodu: 365,
    aciklama: 'O·A — Sel/Akarsu Kılavuzu',
    ozellikSablonu: [
      { ad: 'Uzunluk', birim: 'm', tip: 'number' },
      { ad: 'Şamandra Sayısı', birim: 'adet', tip: 'number' },
    ] },
  { kat: 'teknik_kurtarma', altKategori: 'Vinç (Araç Üstü / Portatif)', slug: 'winch',
    tipNotu: 'Min 5t kapasiteli', bakimPeriyodu: 180, kalibrasyonGerekli: true,
    aciklama: 'O·A — KAVKAS ve IRNAP',
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text', zorunlu: true },
      { ad: 'Kapasite', birim: 'ton', tip: 'number', zorunlu: true },
      { ad: 'Tip', tip: 'select', secenekler: ['Araç Üstü', 'Portatif Elektrikli', 'Manuel'] },
    ] },
  { kat: 'teknik_kurtarma', altKategori: 'Ekzotermik Kesici Seti', slug: 'exothermic-cutter',
    tipNotu: 'Çelik kiriş kesimi — karanlık/kısıtlı ortam', bakimPeriyodu: 180,
    aciklama: 'A — KAVKAS Ağır: çelik H/W/I kiriş kesimi',
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text' },
      { ad: 'Çubuk Sayısı (stok)', birim: 'adet', tip: 'number' },
    ] },
  { kat: 'teknik_kurtarma', altKategori: 'Oksi-Asetilen Kesici Seti', slug: 'oxy-acetylene',
    tipNotu: 'Çelik kesme / kaynak', bakimPeriyodu: 180, kalibrasyonGerekli: true,
    aciklama: 'A — KAVKAS Ağır: alternatif çelik kesme yöntemi',
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text' },
      { ad: 'Oksijen Tüpü Kapasitesi', birim: 'L', tip: 'number' },
      { ad: 'Asetilen Tüpü Kapasitesi', birim: 'L', tip: 'number' },
    ] },
  { kat: 'teknik_kurtarma', altKategori: 'Dalış Takımı (Su Altı Kurtarma)', slug: 'diving-set',
    tipNotu: 'Min 5 tam set — SCUBA veya kapalı devre', bakimPeriyodu: 90, kalibrasyonGerekli: true,
    aciklama: 'A — Sel/Akarsu Kılavuzu Ağır seviye',
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text', zorunlu: true },
      { ad: 'Tüp Kapasitesi', birim: 'L', tip: 'number' },
      { ad: 'Son Hidrostatik Test', tip: 'date' },
    ] },

  // ══════════════════════════════════════════════════════════════════════════
  // ARAMA VE TESPİT
  // ══════════════════════════════════════════════════════════════════════════
  { kat: 'arama_tespit', altKategori: 'Akustik / Titreşim Dedektörü', slug: 'acoustic-detector',
    bakimPeriyodu: 365, kalibrasyonGerekli: true,
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text', zorunlu: true },
      { ad: 'Seri No', tip: 'text' },
    ] },
  { kat: 'arama_tespit', altKategori: 'Termal Kamera', slug: 'thermal-camera',
    bakimPeriyodu: 365,
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text', zorunlu: true },
      { ad: 'Çözünürlük', tip: 'text' },
      { ad: 'Dedeksiyon Mesafesi', birim: 'm', tip: 'number' },
    ] },
  { kat: 'arama_tespit', altKategori: 'Enkaz Kamerası (Eğimli Borescope)', slug: 'debris-camera',
    bakimPeriyodu: 365,
    aciklama: 'O·A — KAVKAS Orta ve Ağır',
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text' },
      { ad: 'Prob Uzunluğu', birim: 'm', tip: 'number' },
    ] },
  { kat: 'arama_tespit', altKategori: 'Çığ Feneri (Çığ Kaytanı / Beacon)', slug: 'avalanche-beacon',
    tipNotu: '3 antenli dijital', bakimPeriyodu: 365, kalibrasyonGerekli: true,
    aciklama: 'O·A — Arazi Orta ve Ağır: çığ alanına giren her personel',
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text', zorunlu: true },
      { ad: 'Seri No', tip: 'text' },
      { ad: 'Son Test Tarihi', tip: 'date' },
    ] },
  { kat: 'arama_tespit', altKategori: 'Çığ Sondası (Probe)', slug: 'avalanche-probe',
    tipNotu: 'Min 240cm, katlanır çelik/karbon', bakimPeriyodu: 730,
    aciklama: 'O·A — Arazi Orta ve Ağır kış/çığ operasyonları',
    ozellikSablonu: [
      { ad: 'Uzunluk', birim: 'cm', tip: 'number' },
      { ad: 'Malzeme', tip: 'select', secenekler: ['Çelik', 'Alüminyum', 'Karbon'] },
    ] },
  { kat: 'arama_tespit', altKategori: 'Arama Köpeği Ekipmanı Seti', slug: 'k9-equipment',
    tipNotu: 'Koşum, uzatma, yelek, köpek çantası', bakimPeriyodu: 365,
    aciklama: 'O·A — KAVKAS: O=3 köpek (2+1), A=4+ köpek; IRNAP A=4+ köpek',
    ozellikSablonu: [
      { ad: 'Köpek Adı', tip: 'text', zorunlu: true },
      { ad: 'Mikroçip No', tip: 'text' },
      { ad: 'Sertifika Geçerlilik', tip: 'date' },
      { ad: 'Son Veteriner Muayene', tip: 'date' },
    ] },
  { kat: 'arama_tespit', altKategori: 'Görüntü Aktarım Sistemi (CCTV/Gerçek Zamanlı)', slug: 'video-transmission',
    tipNotu: 'Kablosuz, şifreli yayın', bakimPeriyodu: 365,
    aciklama: 'O·A — KAVKAS Orta ve Ağır',
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text' },
      { ad: 'Menzil', birim: 'm', tip: 'number' },
    ] },

  // ══════════════════════════════════════════════════════════════════════════
  // EL ALETLERİ VE ENKAZ
  // ══════════════════════════════════════════════════════════════════════════
  { kat: 'el_aletleri', altKategori: 'Akülü Açı Taşlama (Flex)', slug: 'angle-grinder',
    bakimPeriyodu: 180,
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text' },
      { ad: 'Disk Çapı', birim: 'mm', tip: 'number' },
    ] },
  { kat: 'el_aletleri', altKategori: 'Hidrolik Spreader / Kurtarıcı', slug: 'hydraulic-spreader',
    tipNotu: 'LUKAS / Holmatro', bakimPeriyodu: 180, kalibrasyonGerekli: true,
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text', zorunlu: true },
      { ad: 'Açılma Kuvveti', birim: 'kN', tip: 'number' },
    ] },
  { kat: 'el_aletleri', altKategori: 'Kazma ve Kürek Seti', slug: 'shovel-set',
    bakimPeriyodu: 730,
    aciklama: 'H·O·A — Arazi ve KAVKAS, kar küreği de dahil',
    ozellikSablonu: [{ ad: 'Adet', tip: 'number' }] },
  { kat: 'el_aletleri', altKategori: 'Kar Küreği (Katlanır)', slug: 'snow-shovel',
    tipNotu: 'Karbon/alüminyum, katlanır', bakimPeriyodu: 730,
    aciklama: 'O·A — Arazi Orta ve Ağır kış operasyonu',
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text' },
      { ad: 'Malzeme', tip: 'select', secenekler: ['Alüminyum', 'Karbon', 'Plastik'] },
    ] },
  { kat: 'el_aletleri', altKategori: 'Buz Baltası / Kazma (Ice Axe)', slug: 'ice-axe',
    tipNotu: 'UIAA sertifikalı', bakimPeriyodu: 730,
    aciklama: 'O·A — Arazi Orta ve Ağır dağ/buzul operasyonu',
    ozellikSablonu: [
      { ad: 'Uzunluk', birim: 'cm', tip: 'number' },
      { ad: 'Tip', tip: 'select', secenekler: ['Klasik', 'Teknik', 'Kar Kazması'] },
    ] },
  { kat: 'el_aletleri', altKategori: 'Holigan Aleti / Pry Bar Seti', slug: 'halligan-bar',
    tipNotu: 'Kapı/çerçeve zorlamak için', bakimPeriyodu: 365,
    aciklama: 'H·O·A — Sel/Akarsu: testere–holigan–balta–balyoz seti',
    ozellikSablonu: [
      { ad: 'Uzunluk', birim: 'cm', tip: 'number' },
      { ad: 'Set mi?', tip: 'boolean' },
    ] },
  { kat: 'el_aletleri', altKategori: 'Motorlu Testere (Beton/Metal)', slug: 'power-saw-concrete',
    tipNotu: 'Elmas disk, beton/demir', bakimPeriyodu: 180,
    aciklama: 'A — KAVKAS Ağır: beton/donatı kesimi',
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text', zorunlu: true },
      { ad: 'Disk Tipi', tip: 'select', secenekler: ['Elmas', 'Metal', 'Beton'] },
      { ad: 'Güç Kaynağı', tip: 'select', secenekler: ['Benzin', 'Elektrik', 'Akü'] },
    ] },
  { kat: 'el_aletleri', altKategori: 'Motorlu Zincir Testere (Ahşap)', slug: 'chainsaw',
    tipNotu: 'Kereste/ağaç kesimi', bakimPeriyodu: 180,
    aciklama: 'O·A — KAVKAS: ahşap/kereste kesme kapasitesi',
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text' },
      { ad: 'Kılavuz Uzunluğu', birim: 'cm', tip: 'number' },
      { ad: 'Güç Kaynağı', tip: 'select', secenekler: ['Benzin', 'Elektrik', 'Akü'] },
    ] },
  { kat: 'el_aletleri', altKategori: 'Kar Çıkrığı / Kar Kazığı Seti', slug: 'snow-anchor-set',
    tipNotu: 'Kar plakası + kazık + ipi', bakimPeriyodu: 730,
    aciklama: 'A — Arazi Ağır: yapay emniyet noktası',
    ozellikSablonu: [
      { ad: 'Set İçeriği', tip: 'text' },
    ] },

  // ══════════════════════════════════════════════════════════════════════════
  // KİŞİSEL KORUYUCU DONANIM (KKD)
  // ══════════════════════════════════════════════════════════════════════════
  { kat: 'kkd', altKategori: 'Kurtarma Kaskı', slug: 'rescue-helmet',
    tipNotu: 'EN 397 / EN 16471', bakimPeriyodu: 1825, // 5 yıl
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text' },
      { ad: 'Beden', tip: 'select', secenekler: ['S', 'M', 'L', 'XL', 'Üniversal'] },
      { ad: 'Üretim Yılı', tip: 'number' },
    ] },
  { kat: 'kkd', altKategori: 'Tam Vücut Emniyet Kemeri', slug: 'full-harness',
    tipNotu: 'EN 361', bakimPeriyodu: 365,
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text', zorunlu: true },
      { ad: 'Beden', tip: 'select', secenekler: ['S', 'M', 'L', 'XL', 'XXL'] },
      { ad: 'Üretim Tarihi', tip: 'date' },
    ] },
  { kat: 'kkd', altKategori: 'Kimyasal Koruyucu Tulum (Tip B)', slug: 'chem-suit',
    tipNotu: 'EN 14605 Tip B', bakimPeriyodu: 365,
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text' },
      { ad: 'Beden', tip: 'select', secenekler: ['S', 'M', 'L', 'XL', 'XXL'] },
    ] },
  { kat: 'kkd', altKategori: 'Gaz Maskesi (Full-face)', slug: 'gas-mask',
    tipNotu: 'ABEK2-P3', bakimPeriyodu: 365,
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text', zorunlu: true },
      { ad: 'Filtre Son Kullanma', tip: 'date' },
    ] },
  { kat: 'kkd', altKategori: 'Su Elbisesi (Dalgıç/Wetsuit)', slug: 'wetsuit',
    tipNotu: 'Neopren — yarı kuru veya ıslak', bakimPeriyodu: 730,
    aciklama: 'H·O·A — Sel/Akarsu Kılavuzu: kişi başı zorunlu',
    ozellikSablonu: [
      { ad: 'Tip', tip: 'select', secenekler: ['Islak (Wetsuit)', 'Yarı Kuru', 'Tam Kuru (Drysuit)'] },
      { ad: 'Kalınlık', birim: 'mm', tip: 'number' },
      { ad: 'Beden', tip: 'select', secenekler: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
    ] },
  { kat: 'kkd', altKategori: 'Can Yeleği (Kurtarıcı)', slug: 'rescue-pfd',
    tipNotu: 'ISO 12402-5 / EN ISO, kurtarıcı tipi', bakimPeriyodu: 365,
    aciklama: 'H·O·A — Sel/Akarsu: kişi başı zorunlu; Kazazede için de ayrıca',
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text', zorunlu: true },
      { ad: 'Beden', tip: 'select', secenekler: ['Çocuk', 'S/M', 'L/XL', 'Üniversal'] },
      { ad: 'Kalkış Kuvveti', birim: 'N', tip: 'number' },
    ] },
  { kat: 'kkd', altKategori: 'Su Kurtarma Kaskı', slug: 'water-helmet',
    tipNotu: 'Nehir/su kurtarma için yüz koruyuculu', bakimPeriyodu: 365,
    aciklama: 'H·O·A — Sel/Akarsu Kılavuzu: kişi başı zorunlu',
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text' },
      { ad: 'Beden', tip: 'select', secenekler: ['S/M', 'L/XL', 'Üniversal'] },
    ] },
  { kat: 'kkd', altKategori: 'Yağmurluk (Alt-Üst Set)', slug: 'rain-suit',
    tipNotu: 'Su geçirmez, nefes alır', bakimPeriyodu: 730,
    aciklama: 'H·O·A — Sel/Akarsu ve Arazi Kılavuzu',
    ozellikSablonu: [
      { ad: 'Beden', tip: 'select', secenekler: ['S', 'M', 'L', 'XL', 'XXL'] },
    ] },
  { kat: 'kkd', altKategori: 'Termal Battaniye (Kurtarma Folyo)', slug: 'thermal-blanket',
    tipNotu: 'Alüminyum folyo, tek/çift taraf', bakimPeriyodu: 730,
    aciklama: 'H·O·A — Arazi: kişi başı zorunlu',
    ozellikSablonu: [
      { ad: 'Tip', tip: 'select', secenekler: ['Tek Kullanımlık', 'Yeniden Kullanılabilir'] },
    ] },
  { kat: 'kkd', altKategori: 'Sırt Çantası (Saha/60L)', slug: 'field-backpack',
    tipNotu: '60-80L, yağmur kılıflı', bakimPeriyodu: 730,
    aciklama: 'H·O·A — Arazi: kişi başı zorunlu',
    ozellikSablonu: [
      { ad: 'Hacim', birim: 'L', tip: 'number' },
      { ad: 'Yağmur Kılıfı var mı?', tip: 'boolean' },
    ] },

  // ══════════════════════════════════════════════════════════════════════════
  // BARINAMA VE LOJİSTİK
  // ══════════════════════════════════════════════════════════════════════════
  { kat: 'barinma', altKategori: 'Sahra Çadırı (Büyük)', slug: 'field-tent-large',
    tipNotu: '16-20 kişilik', bakimPeriyodu: 365,
    aciklama: 'O·A — tüm kılavuzlar bağımsız lojistik',
    ozellikSablonu: [
      { ad: 'Kapasite', birim: 'kişi', tip: 'number' },
      { ad: 'Alan', birim: 'm²', tip: 'number' },
    ] },
  { kat: 'barinma', altKategori: 'Bireysel Kamp Çadırı', slug: 'personal-tent',
    tipNotu: '2-4 kişilik, 4 mevsim', bakimPeriyodu: 730,
    aciklama: 'H·O·A — Arazi: kişi başı uyku malzemesi',
    ozellikSablonu: [
      { ad: 'Kapasite', birim: 'kişi', tip: 'number' },
      { ad: 'Mevsim', tip: 'select', secenekler: ['3 Mevsim', '4 Mevsim / Kış'] },
    ] },
  { kat: 'barinma', altKategori: 'Uyku Tulumu', slug: 'sleeping-bag',
    tipNotu: '-15°C kış', bakimPeriyodu: 730,
    aciklama: 'H·O·A — Arazi: kişi başı zorunlu',
    ozellikSablonu: [
      { ad: 'Konfor Sıcaklığı', birim: '°C', tip: 'number' },
    ] },
  { kat: 'barinma', altKategori: 'İzoleli Yatak Matı (Uyku Pedi)', slug: 'sleeping-pad',
    bakimPeriyodu: 1825,
    aciklama: 'H·O·A — Arazi: kişi başı zorunlu',
    ozellikSablonu: [
      { ad: 'Tip', tip: 'select', secenekler: ['Şişme', 'Köpük', 'Hibrit'] },
      { ad: 'R-Değeri', tip: 'number' },
    ] },
  { kat: 'barinma', altKategori: 'Portatif Ocak ve Mutfak Seti', slug: 'field-stove',
    tipNotu: 'Gaz/benzin, kamp tipi', bakimPeriyodu: 365,
    aciklama: 'O·A — Arazi ve KAVKAS bağımsız beslenme kapasitesi',
    ozellikSablonu: [
      { ad: 'Yakıt Tipi', tip: 'select', secenekler: ['Gaz (ISO Kartuş)', 'Benzin', 'Alkol', 'Katı Yakıt'] },
    ] },
  { kat: 'barinma', altKategori: 'Su Depolama ve Arıtma Seti', slug: 'water-supply',
    tipNotu: 'Depo, pompa, filtre/klorlama', bakimPeriyodu: 365,
    aciklama: 'H·O·A — tüm kılavuzlar bağımsız operasyon şartı',
    ozellikSablonu: [
      { ad: 'Depo Kapasitesi', birim: 'L', tip: 'number' },
      { ad: 'Arıtma Yöntemi', tip: 'select', secenekler: ['Filtre', 'UV', 'Klorlama', 'Kombine'] },
    ] },
  { kat: 'barinma', altKategori: 'Bivak Çantası / Acil Sığınak', slug: 'bivouac-shelter',
    tipNotu: 'Alüminyum folyo, 2-4 kişilik', bakimPeriyodu: 730,
    aciklama: 'O·A — Arazi Orta ve Ağır acil barınma',
    ozellikSablonu: [
      { ad: 'Kapasite', birim: 'kişi', tip: 'number' },
    ] },
  { kat: 'barinma', altKategori: 'Yakıt Depolama ve Dağıtım Ekipmanı', slug: 'fuel-storage',
    tipNotu: 'Onaylı taşıma bidonları, hortum seti', bakimPeriyodu: 365,
    aciklama: 'O·A — tüm kılavuzlar jeneratör/araç yakıt bağımsızlığı',
    ozellikSablonu: [
      { ad: 'Toplam Kapasite', birim: 'L', tip: 'number' },
      { ad: 'Yakıt Tipi', tip: 'select', secenekler: ['Benzin', 'Dizel', 'LPG', 'Karma'] },
    ] },
  { kat: 'barinma', altKategori: 'Motorlu Bot (Kurtarma)', slug: 'rescue-motorboat',
    tipNotu: 'Şişme-Plastik-Alüminyum, outboard motor', bakimPeriyodu: 180, kalibrasyonGerekli: true,
    aciklama: 'O·A — Sel/Akarsu Kılavuzu Orta ve Ağır seviye',
    ozellikSablonu: [
      { ad: 'Tip', tip: 'select', secenekler: ['Şişme (RIB)', 'Alüminyum Tekne', 'Plastik'] },
      { ad: 'Motor Gücü', birim: 'HP', tip: 'number' },
      { ad: 'Kişi Kapasitesi', birim: 'kişi', tip: 'number' },
    ] },
  { kat: 'barinma', altKategori: 'Şişme Bot (Kürekli)', slug: 'inflatable-raft',
    tipNotu: 'Kürekle veya motorsuz, hızlı su', bakimPeriyodu: 365,
    aciklama: 'O·A — Sel/Akarsu Kılavuzu; hafif seviye için de kullanılabilir',
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text' },
      { ad: 'Kişi Kapasitesi', birim: 'kişi', tip: 'number' },
    ] },
  { kat: 'barinma', altKategori: 'Dekontaminasyon Seti', slug: 'decontamination-kit',
    tipNotu: 'Sırt pompası, dezenfektan, nitril eldiven', bakimPeriyodu: 365,
    aciklama: 'H·O·A — Sel/Akarsu Kılavuzu: zorunlu depo malzemesi',
    ozellikSablonu: [
      { ad: 'Dezenfektan Tipi', tip: 'text' },
      { ad: 'Sırt Pompası Kapasitesi', birim: 'L', tip: 'number' },
    ] },

  // ══════════════════════════════════════════════════════════════════════════
  // BİLİŞİM VE KAYIT
  // ══════════════════════════════════════════════════════════════════════════
  { kat: 'bilisim', altKategori: 'Saha Laptop / Tablet', slug: 'field-laptop',
    bakimPeriyodu: 365,
    aciklama: 'O·A — KAVKAS komuta merkezi',
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text', zorunlu: true },
      { ad: 'Seri No', tip: 'text' },
      { ad: 'İşletim Sistemi', tip: 'text' },
    ] },
  { kat: 'bilisim', altKategori: 'Aksiyon Kamera', slug: 'action-camera',
    bakimPeriyodu: 365,
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text' },
      { ad: 'Çözünürlük', tip: 'select', secenekler: ['4K', '1080p', '720p'] },
    ] },
  { kat: 'bilisim', altKategori: 'Taşınabilir Yazıcı (Saha Barkod/Envanter)', slug: 'field-printer',
    tipNotu: 'Termal, barkod yazıcı', bakimPeriyodu: 365,
    aciklama: 'O·A — KAVKAS/IRNAP malzeme kod ve etiket sistemi',
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text' },
      { ad: 'Baskı Tipi', tip: 'select', secenekler: ['Termal', 'İnkjet', 'Lazer'] },
    ] },

  // ══════════════════════════════════════════════════════════════════════════
  // EL ALETLERİ — Erişim, Kesme/Ayırma, Sabitleme (ek tipler)
  // ══════════════════════════════════════════════════════════════════════════

  // ── Merdiven & Erişim ──
  { kat: 'el_aletleri', altKategori: 'Uzatmalı Merdiven (Alüminyum)', slug: 'extension-ladder',
    tipNotu: '3-6m teleskopik veya çift kanatlı', bakimPeriyodu: 365,
    ozellikSablonu: [
      { ad: 'Uzunluk (açık)', birim: 'm', tip: 'number', zorunlu: true },
      { ad: 'Max Yük', birim: 'kg', tip: 'number' },
      { ad: 'Tip', tip: 'select', secenekler: ['Tek Kanatlı', 'Çift Kanatlı / Uzatmalı', 'Teleskopik', 'Mafsallı (Kombine)'] },
    ] },
  { kat: 'el_aletleri', altKategori: 'Çatı / A-Tip Merdiven', slug: 'step-ladder',
    tipNotu: 'Serbest duran, çift taraflı', bakimPeriyodu: 365,
    ozellikSablonu: [
      { ad: 'Yükseklik', birim: 'm', tip: 'number', zorunlu: true },
      { ad: 'Max Yük', birim: 'kg', tip: 'number' },
    ] },
  { kat: 'el_aletleri', altKategori: 'Atlatma Merdiveni / Kanca Merdiveni', slug: 'hook-ladder',
    tipNotu: 'Bina cephesi tırmanma / kurtarma merdiveni', bakimPeriyodu: 365,
    ozellikSablonu: [
      { ad: 'Uzunluk', birim: 'm', tip: 'number', zorunlu: true },
    ] },

  // ── Sabitleme / Bağlantı ──
  { kat: 'el_aletleri', altKategori: 'Çivi Tabancası (Gaz/Barut Çakma)', slug: 'nail-gun',
    tipNotu: 'Beton/ahşaba ankraj için', bakimPeriyodu: 365,
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text' },
      { ad: 'Güç Tipi', tip: 'select', secenekler: ['Gaz Kartuşlu', 'Barut', 'Pnömatik', 'Elektrikli'] },
      { ad: 'Çivi Çapı', birim: 'mm', tip: 'text' },
    ] },
  { kat: 'el_aletleri', altKategori: 'Çivi / Ankraj Seti (Manuel)', slug: 'nail-anchor-set',
    tipNotu: 'Çelik çivi, dübel, ankraj çubuğu seti', bakimPeriyodu: 730,
    ozellikSablonu: [
      { ad: 'İçerik Açıklaması', tip: 'text' },
    ] },
  { kat: 'el_aletleri', altKategori: 'Çekiç Seti (Kauçuk / Çelik)', slug: 'hammer-set',
    tipNotu: 'Balyoz dahil', bakimPeriyodu: 730,
    ozellikSablonu: [
      { ad: 'Ağırlık', birim: 'kg', tip: 'number' },
      { ad: 'Tip', tip: 'select', secenekler: ['Kauçuk Tokmak', 'Çekiç', 'Balyoz', 'Kama Çekici'] },
    ] },
  { kat: 'el_aletleri', altKategori: 'Somun Anahtarı Seti (Kombine / Tornavidalar)', slug: 'wrench-set',
    tipNotu: 'Metrik+inç, yıldız/düz tornavida dahil', bakimPeriyodu: 730,
    ozellikSablonu: [
      { ad: 'Set İçeriği', tip: 'text' },
    ] },

  // ── Delme / Kesme / Ayırma ──
  { kat: 'el_aletleri', altKategori: 'Akülü Matkap / Vidalama Makinesi', slug: 'cordless-drill',
    tipNotu: 'SDS-plus / darbe matkap', bakimPeriyodu: 365,
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text' },
      { ad: 'Voltaj', birim: 'V', tip: 'number' },
      { ad: 'Tip', tip: 'select', secenekler: ['Darbe Matkap', 'SDS-Plus', 'Çekiçli Matkap', 'Vidalama'] },
    ] },
  { kat: 'el_aletleri', altKategori: 'El Testeresi / Demir Testeresi (Manuel)', slug: 'hand-saw',
    tipNotu: 'Ahşap + metal testere', bakimPeriyodu: 730,
    ozellikSablonu: [
      { ad: 'Tip', tip: 'select', secenekler: ['Ahşap Testeresi', 'Demir Testeresi', 'Kombine'] },
    ] },
  { kat: 'el_aletleri', altKategori: 'Keski / Kama Seti', slug: 'chisel-wedge-set',
    tipNotu: 'Beton ve ahşap keski, çelik kamalar', bakimPeriyodu: 730,
    ozellikSablonu: [
      { ad: 'Set İçeriği', tip: 'text' },
    ] },
  { kat: 'el_aletleri', altKategori: 'Levye Seti (Çelik Demir)', slug: 'crowbar-set',
    tipNotu: 'Düz + eğri levye, farklı boylar', bakimPeriyodu: 730,
    ozellikSablonu: [
      { ad: 'En Uzun Levye', birim: 'cm', tip: 'number' },
    ] },
  { kat: 'el_aletleri', altKategori: 'Pense / Kerpeten Seti', slug: 'pliers-set',
    tipNotu: 'Kablo sıyırıcı dahil', bakimPeriyodu: 730,
    ozellikSablonu: [
      { ad: 'Set İçeriği', tip: 'text' },
    ] },
  { kat: 'el_aletleri', altKategori: 'Akülü Alıcı Testere (Sabre Saw / Jigsaw)', slug: 'reciprocating-saw',
    tipNotu: 'Ahşap+metal bıçak seti', bakimPeriyodu: 365,
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text' },
      { ad: 'Voltaj', birim: 'V', tip: 'number' },
    ] },
  { kat: 'el_aletleri', altKategori: 'Boru / Profil Kesici (El)', slug: 'pipe-cutter',
    tipNotu: 'Metal boru, ince profil', bakimPeriyodu: 730,
    ozellikSablonu: [
      { ad: 'Max Çap', birim: 'mm', tip: 'number' },
    ] },
  { kat: 'el_aletleri', altKategori: 'Tel / Kablo Kesici (Pense Tipi)', slug: 'wire-cutter',
    tipNotu: 'Demir tel, halat, çelik şerit', bakimPeriyodu: 730,
    ozellikSablonu: [
      { ad: 'Max Kesme Çapı', birim: 'mm', tip: 'number' },
    ] },
  { kat: 'el_aletleri', altKategori: 'Hidrolik Kesici (Halka/Piston Tipi)', slug: 'hydraulic-cutter',
    tipNotu: 'Ağır çelik kesimine alternatif, KAVKAS', bakimPeriyodu: 180, kalibrasyonGerekli: true,
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text', zorunlu: true },
      { ad: 'Kesme Kuvveti', birim: 'kN', tip: 'number' },
      { ad: 'Max Çap (Çelik)', birim: 'mm', tip: 'number' },
    ] },
];

async function seedEkipmanTipleri() {
  // ── Migration: melEtiketi → slug (eski kayıtlar için tek seferlik) ──────────
  try {
    const { db } = require('mongoose').connection;
    const col = db.collection('ekipmantipis');
    await col.updateMany(
      { $and: [{ melEtiketi: { $exists: true, $ne: '' } }, { $or: [{ slug: { $exists: false } }, { slug: '' }] }] },
      [{ $set: { slug: '$melEtiketi' } }]
    );
    const all = await col.find({}, { projection: { slug: 1, createdAt: 1 } }).sort({ createdAt: 1 }).toArray();
    const seen = new Set();
    const dupIds = [];
    for (const doc of all) {
      if (!doc.slug) continue;
      if (seen.has(doc.slug)) dupIds.push(doc._id);
      else seen.add(doc.slug);
    }
    if (dupIds.length) {
      await col.deleteMany({ _id: { $in: dupIds } });
      console.log(`[Seed] Migration: ${dupIds.length} duplicate EkipmanTipi silindi.`);
    }
  } catch (e) {
    console.warn('[Seed] Migration uyarısı:', e.message);
  }
  // ────────────────────────────────────────────────────────────────────────────

  // AnaKategori kodlarını bir kere çek
  const kategoriler = await AnaKategori.find({}, 'kod _id').lean();
  const katMap = {};
  for (const k of kategoriler) katMap[k.kod] = k._id;

  let eklenen = 0;
  for (const t of TIPLER) {
    const katId = katMap[t.kat];
    if (!katId) {
      console.warn(`[Seed] Kategori bulunamadı: ${t.kat}`);
      continue;
    }
    const var_ = await EkipmanTipi.findOne({ slug: t.slug });
    if (!var_) {
      await EkipmanTipi.create({
        anaKategori:       katId,
        altKategori:       t.altKategori,
        tipNotu:           t.tipNotu || '',
        slug:        t.slug,
        melAciklama:       t.altKategori,
        ozellikSablonu:    t.ozellikSablonu || [],
        bakimPeriyodu:     t.bakimPeriyodu || 365,
        kalibrasyonGerekli: t.kalibrasyonGerekli || false,
        aktif:             true,
      });
      eklenen++;
    }
  }
  if (eklenen > 0) console.log(`[Seed] ${eklenen} EkipmanTipi eklendi.`);
  else console.log('[Seed] EkipmanTipi zaten mevcut.');
}

module.exports = seedEkipmanTipleri;
