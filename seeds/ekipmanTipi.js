'use strict';
/**
 * Yaygın AK ekipman tipleri için başlangıç seed verisi.
 * AnaKategori kodlarına göre ObjectId'leri bulur ve EkipmanTipi oluşturur.
 * İdempotent: melEtiketi üzerinden kontrol eder.
 */
const AnaKategori  = require('../models/AnaKategori');
const EkipmanTipi  = require('../models/EkipmanTipi');

const TIPLER = [
  // ── İletişim ────────────────────────────────────────────────────────────
  { kat: 'iletisim', altKategori: 'VHF El Telsizi', melEtiketi: 'vhf-handheld',
    tipNotu: 'Su geçirmez, IP67', bakimPeriyodu: 365,
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text', zorunlu: true },
      { ad: 'Frekans Aralığı', birim: 'MHz', tip: 'text' },
      { ad: 'Pil Kapasitesi', birim: 'mAh', tip: 'number' },
    ] },
  { kat: 'iletisim', altKategori: 'Uydu Telefonu', melEtiketi: 'sat-phone',
    tipNotu: 'Iridium / Thuraya', bakimPeriyodu: 180,
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text', zorunlu: true },
      { ad: 'SIM / Abone No', tip: 'text' },
    ] },
  { kat: 'iletisim', altKategori: 'PLB (Kişisel Konum İşareti)', melEtiketi: 'plb',
    tipNotu: '406 MHz COSPAS-SARSAT', bakimPeriyodu: 365, kalibrasyonGerekli: true,
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text', zorunlu: true },
      { ad: '15-Hex Tanımlayıcı', tip: 'text' },
      { ad: 'Pil Son Kullanma Tarihi', tip: 'date' },
    ] },

  // ── Navigasyon ──────────────────────────────────────────────────────────
  { kat: 'navigasyon', altKategori: 'El GPS', melEtiketi: 'hand-gps',
    tipNotu: 'WAAS/GLONASS', bakimPeriyodu: 365,
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text', zorunlu: true },
      { ad: 'Harita Yüklü mü?', tip: 'boolean' },
    ] },
  { kat: 'navigasyon', altKategori: 'Silva Pusula', melEtiketi: 'compass',
    bakimPeriyodu: 730,
    ozellikSablonu: [{ ad: 'Model', tip: 'text' }] },

  // ── Aydınlatma ve Güç ───────────────────────────────────────────────────
  { kat: 'aydinlatma', altKategori: 'Kafa Feneri', melEtiketi: 'headlamp',
    tipNotu: 'Min 300 lm, şarjlı', bakimPeriyodu: 365,
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text', zorunlu: true },
      { ad: 'Lümen', birim: 'lm', tip: 'number' },
      { ad: 'Şarjlı mı?', tip: 'boolean' },
    ] },
  { kat: 'aydinlatma', altKategori: 'Taşınabilir Jeneratör', melEtiketi: 'generator',
    tipNotu: 'Benzinli / Benzinsiz', bakimPeriyodu: 90,
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text', zorunlu: true },
      { ad: 'Güç', birim: 'kVA', tip: 'number' },
      { ad: 'Yakıt Tipi', tip: 'select', secenekler: ['Benzin', 'Dizel', 'LPG'] },
    ] },
  { kat: 'aydinlatma', altKategori: 'Taşınabilir Güç İstasyonu', melEtiketi: 'power-station',
    bakimPeriyodu: 180,
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text', zorunlu: true },
      { ad: 'Kapasite', birim: 'Wh', tip: 'number' },
    ] },

  // ── Tıbbi ve İlk Yardım ─────────────────────────────────────────────────
  { kat: 'tibbiilkyardim', altKategori: 'İlk Yardım Çantası (Takım)', melEtiketi: 'first-aid-bag',
    bakimPeriyodu: 180,
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text' },
      { ad: 'Son Kullanma Tarihi Kontrolü', tip: 'date' },
    ] },
  { kat: 'tibbiilkyardim', altKategori: 'Otomatik Eksternal Defibrilatör (AED)', melEtiketi: 'aed',
    bakimPeriyodu: 180, kalibrasyonGerekli: true,
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text', zorunlu: true },
      { ad: 'Seri Numarası', tip: 'text' },
      { ad: 'Ped Son Kullanma Tarihi', tip: 'date' },
    ] },
  { kat: 'tibbiilkyardim', altKategori: 'Vakumlu Sedye', melEtiketi: 'vacuum-stretcher',
    bakimPeriyodu: 365,
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text' },
      { ad: 'Max Yük Kapasitesi', birim: 'kg', tip: 'number' },
    ] },
  { kat: 'tibbiilkyardim', altKategori: 'Oksijen Seti', melEtiketi: 'oxygen-set',
    bakimPeriyodu: 90, kalibrasyonGerekli: true,
    ozellikSablonu: [
      { ad: 'Tüp Hacmi', birim: 'L', tip: 'number' },
      { ad: 'Son Dolum Tarihi', tip: 'date' },
    ] },

  // ── Teknik Kurtarma ─────────────────────────────────────────────────────
  { kat: 'teknik_kurtarma', altKategori: 'Statik Halat', melEtiketi: 'static-rope',
    tipNotu: 'EN 1891 Tip A, Ø11mm', bakimPeriyodu: 365,
    ozellikSablonu: [
      { ad: 'Çap', birim: 'mm', tip: 'number', zorunlu: true },
      { ad: 'Uzunluk', birim: 'm', tip: 'number', zorunlu: true },
      { ad: 'Üretim Tarihi', tip: 'date' },
      { ad: 'İlk Kullanım Tarihi', tip: 'date' },
    ] },
  { kat: 'teknik_kurtarma', altKategori: 'Dinamik Halat', melEtiketi: 'dynamic-rope',
    tipNotu: 'EN 892, Tek İp', bakimPeriyodu: 365,
    ozellikSablonu: [
      { ad: 'Çap', birim: 'mm', tip: 'number', zorunlu: true },
      { ad: 'Uzunluk', birim: 'm', tip: 'number', zorunlu: true },
      { ad: 'Üretim Tarihi', tip: 'date' },
    ] },
  { kat: 'teknik_kurtarma', altKategori: 'Makara (Kurtarma)', melEtiketi: 'pulley',
    bakimPeriyodu: 365,
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text' },
      { ad: 'MWL', birim: 'kN', tip: 'number' },
    ] },
  { kat: 'teknik_kurtarma', altKategori: 'İnişçi Cihazı (Rack/Pirana)', melEtiketi: 'descender',
    bakimPeriyodu: 365,
    ozellikSablonu: [
      { ad: 'Model', tip: 'text' },
      { ad: 'Uyumlu Halat Çapı', birim: 'mm', tip: 'text' },
    ] },
  { kat: 'teknik_kurtarma', altKategori: 'Hız Kısıtlı Kurtarma Kriko (Tirfor)', melEtiketi: 'tirfor',
    tipNotu: 'T-35 / 3.2t', bakimPeriyodu: 365,
    ozellikSablonu: [
      { ad: 'Kapasite', birim: 'ton', tip: 'number', zorunlu: true },
    ] },

  // ── Arama ve Tespit ─────────────────────────────────────────────────────
  { kat: 'arama_tespit', altKategori: 'Akustik / Titreşim Dedektörü', melEtiketi: 'acoustic-detector',
    bakimPeriyodu: 365, kalibrasyonGerekli: true,
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text', zorunlu: true },
      { ad: 'Seri No', tip: 'text' },
    ] },
  { kat: 'arama_tespit', altKategori: 'Termal Kamera', melEtiketi: 'thermal-camera',
    bakimPeriyodu: 365,
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text', zorunlu: true },
      { ad: 'Çözünürlük', tip: 'text' },
      { ad: 'Dedeksiyon Mesafesi', birim: 'm', tip: 'number' },
    ] },
  { kat: 'arama_tespit', altKategori: 'Enkaz Kamerası (Eğimli Borescope)', melEtiketi: 'debris-camera',
    bakimPeriyodu: 365,
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text' },
      { ad: 'Prob Uzunluğu', birim: 'm', tip: 'number' },
    ] },

  // ── El Aletleri ve Enkaz ────────────────────────────────────────────────
  { kat: 'el_aletleri', altKategori: 'Akülü Açı Taşlama (Flex)', melEtiketi: 'angle-grinder',
    bakimPeriyodu: 180,
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text' },
      { ad: 'Disk Çapı', birim: 'mm', tip: 'number' },
    ] },
  { kat: 'el_aletleri', altKategori: 'Hidrolik Spreader / Kurtarıcı', melEtiketi: 'hydraulic-spreader',
    tipNotu: 'LUKAS / Holmatro', bakimPeriyodu: 180, kalibrasyonGerekli: true,
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text', zorunlu: true },
      { ad: 'Açılma Kuvveti', birim: 'kN', tip: 'number' },
    ] },
  { kat: 'el_aletleri', altKategori: 'Kazma ve Kürek Seti', melEtiketi: 'shovel-set',
    bakimPeriyodu: 730,
    ozellikSablonu: [{ ad: 'Adet', tip: 'number' }] },

  // ── KKD ─────────────────────────────────────────────────────────────────
  { kat: 'kkd', altKategori: 'Kurtarma Kaskı', melEtiketi: 'rescue-helmet',
    tipNotu: 'EN 397 / EN 16471', bakimPeriyodu: 1825, // 5 yıl
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text' },
      { ad: 'Beden', tip: 'select', secenekler: ['S', 'M', 'L', 'XL', 'Üniversal'] },
      { ad: 'Üretim Yılı', tip: 'number' },
    ] },
  { kat: 'kkd', altKategori: 'Tam Vücut Emniyet Kemeri', melEtiketi: 'full-harness',
    tipNotu: 'EN 361', bakimPeriyodu: 365,
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text', zorunlu: true },
      { ad: 'Beden', tip: 'select', secenekler: ['S', 'M', 'L', 'XL', 'XXL'] },
      { ad: 'Üretim Tarihi', tip: 'date' },
    ] },
  { kat: 'kkd', altKategori: 'Kimyasal Koruyucu Tulum (Tip B)', melEtiketi: 'chem-suit',
    tipNotu: 'EN 14605 Tip B', bakimPeriyodu: 365,
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text' },
      { ad: 'Beden', tip: 'select', secenekler: ['S', 'M', 'L', 'XL', 'XXL'] },
    ] },
  { kat: 'kkd', altKategori: 'Gaz Maskesi (Full-face)', melEtiketi: 'gas-mask',
    tipNotu: 'ABEK2-P3', bakimPeriyodu: 365,
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text', zorunlu: true },
      { ad: 'Filtre Son Kullanma', tip: 'date' },
    ] },

  // ── Barınma ve Lojistik ──────────────────────────────────────────────────
  { kat: 'barinma', altKategori: 'Sahra Çadırı (Büyük)', melEtiketi: 'field-tent-large',
    tipNotu: '16-20 kişilik', bakimPeriyodu: 365,
    ozellikSablonu: [
      { ad: 'Kapasite', birim: 'kişi', tip: 'number' },
      { ad: 'Alan', birim: 'm²', tip: 'number' },
    ] },
  { kat: 'barinma', altKategori: 'Uyku Tulumu', melEtiketi: 'sleeping-bag',
    tipNotu: '-15°C kış', bakimPeriyodu: 730,
    ozellikSablonu: [
      { ad: 'Konfor Sıcaklığı', birim: '°C', tip: 'number' },
    ] },

  // ── Bilişim ve Kayıt ─────────────────────────────────────────────────────
  { kat: 'bilisim', altKategori: 'Saha Laptop / Tablet', melEtiketi: 'field-laptop',
    bakimPeriyodu: 365,
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text', zorunlu: true },
      { ad: 'Seri No', tip: 'text' },
      { ad: 'İşletim Sistemi', tip: 'text' },
    ] },
  { kat: 'bilisim', altKategori: 'Aksiyon Kamera', melEtiketi: 'action-camera',
    bakimPeriyodu: 365,
    ozellikSablonu: [
      { ad: 'Marka/Model', tip: 'text' },
      { ad: 'Çözünürlük', tip: 'select', secenekler: ['4K', '1080p', '720p'] },
    ] },
];

async function seedEkipmanTipleri() {
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
    const var_ = await EkipmanTipi.findOne({ melEtiketi: t.melEtiketi });
    if (!var_) {
      await EkipmanTipi.create({
        anaKategori:       katId,
        altKategori:       t.altKategori,
        tipNotu:           t.tipNotu || '',
        melEtiketi:        t.melEtiketi,
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
