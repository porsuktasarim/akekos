'use strict';
/**
 * 10 sabit AnaKategori — sistem genelinde değiştirilemez.
 * seeds/index.js tarafından import edilir.
 */
const AnaKategori = require('../models/AnaKategori');

const KATEGORILER = [
  { kod: 'iletisim',   ad: 'İletişim',                    aciklama: 'Telsiz, telefon, uydu haberleşme ekipmanları',           ikon: 'fa-walkie-talkie', sira: 1 },
  { kod: 'navigasyon', ad: 'Navigasyon',                   aciklama: 'GPS, harita, pusula',                                     ikon: 'fa-map-location-dot', sira: 2 },
  { kod: 'aydinlatma', ad: 'Aydınlatma ve Güç',            aciklama: 'Fenerler, jeneratörler, bataryalar, kablolar',            ikon: 'fa-bolt', sira: 3 },
  { kod: 'tibbiilkyardim', ad: 'Tıbbi ve İlk Yardım',     aciklama: 'Tıbbi çantalar, sedye, ilaç, defibrilatör',               ikon: 'fa-kit-medical', sira: 4 },
  { kod: 'teknik_kurtarma', ad: 'Teknik Kurtarma',         aciklama: 'Halatlar, makara, krikolar, kesme ekipmanı',              ikon: 'fa-life-ring', sira: 5 },
  { kod: 'arama_tespit', ad: 'Arama ve Tespit',            aciklama: 'Akustik dedektörler, kameralar, arama köpeği ekipmanı',   ikon: 'fa-magnifying-glass', sira: 6 },
  { kod: 'el_aletleri', ad: 'El Aletleri ve Enkaz',        aciklama: 'Kazma, kürek, elektrikli aletler',                        ikon: 'fa-screwdriver-wrench', sira: 7 },
  { kod: 'kkd',        ad: 'Kişisel Koruyucu Donanım (KKD)', aciklama: 'Kask, eldiven, gözlük, bot, tulum',                   ikon: 'fa-helmet-safety', sira: 8 },
  { kod: 'barinma',    ad: 'Barınma ve Lojistik',           aciklama: 'Çadır, uyku tulumu, yemek ekipmanı',                     ikon: 'fa-tent', sira: 9 },
  { kod: 'bilisim',    ad: 'Bilişim ve Kayıt',              aciklama: 'Laptop, tablet, yazıcı, kamera',                          ikon: 'fa-laptop', sira: 10 },
];

async function seedAnaKategoriler() {
  let eklenen = 0, guncellenen = 0;
  for (const k of KATEGORILER) {
    const var_ = await AnaKategori.findOne({ kod: k.kod });
    if (!var_) {
      await AnaKategori.create(k);
      eklenen++;
    } else if (var_.ikon !== k.ikon) {
      // ikon güncellendi (ör. fa-rope → fa-life-ring)
      await AnaKategori.updateOne({ kod: k.kod }, { $set: { ikon: k.ikon } });
      guncellenen++;
    }
  }
  if (eklenen)     console.log(`[Seed] ${eklenen} AnaKategori eklendi.`);
  if (guncellenen) console.log(`[Seed] ${guncellenen} AnaKategori ikonu güncellendi.`);
  if (!eklenen && !guncellenen) console.log('[Seed] AnaKategori zaten güncel.');
}

module.exports = seedAnaKategoriler;
