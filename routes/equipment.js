'use strict';
const express    = require('express');
const router     = express.Router();
const AnaKategori  = require('../models/AnaKategori');
const EkipmanTipi  = require('../models/EkipmanTipi');
const Demirbase    = require('../models/Demirbase');
const Organization = require('../models/Organization');
const { generateBarcode } = require('../utils/barcode');

// ─── Yardımcı ─────────────────────────────────────────────────────────────────

async function orgSecenekleri() {
  return Organization.find({ kademe: { $in: ['ake', 'alt_birim'] }, aktif: true })
    .select('ad slug kademe').sort('ad').lean();
}

// ══════════════════════════════════════════════════════════════════════════════
//  ANA KATEGORİ (sadece liste — seed'den gelir, CRUD yok)
// ══════════════════════════════════════════════════════════════════════════════

router.get('/categories', async (req, res) => {
  try {
    const kategoriler = await AnaKategori.find({ aktif: true }).sort('sira').lean();
    res.render('equipment/category_list', { kategoriler });
  } catch (e) {
    req.flash('hata', res.locals.t.equip_flash_list_err + e.message);
    res.redirect('/');
  }
});

// ══════════════════════════════════════════════════════════════════════════════
//  EKİPMAN TİPİ
// ══════════════════════════════════════════════════════════════════════════════

// Liste
router.get('/types', async (req, res) => {
  try {
    const { kategori, aktif } = req.query;
    const filtre = {};
    if (kategori) filtre.anaKategori = kategori;
    if (aktif === '1' || aktif === '0') filtre.aktif = aktif === '1';

    const tipler = await EkipmanTipi.find(filtre)
      .populate('anaKategori', 'ad ikon')
      .sort({ 'anaKategori': 1, altKategori: 1 })
      .lean();
    const kategoriler = await AnaKategori.find({ aktif: true }).sort('sira').lean();
    res.render('equipment/type_list', { tipler, kategoriler, filtre: req.query });
  } catch (e) {
    req.flash('hata', res.locals.t.equip_flash_list_err + e.message);
    res.redirect('/');
  }
});

// Yeni form
router.get('/types/new', async (req, res) => {
  const kategoriler = await AnaKategori.find({ aktif: true }).sort('sira').lean();
  res.render('equipment/type_form', {
    tip: null,
    kategoriler,
    seciliKategori: req.query.kategori || '',
  });
});

// Yeni kaydet
router.post('/types', async (req, res) => {
  const t = res.locals.t;
  try {
    const { anaKategori, altKategori, tipNotu, aciklama,
            slug, melAciklama, bakimPeriyodu, kalibrasyonGerekli,
            ozellikAd, ozellikBirim, ozellikTip, ozellikZorunlu } = req.body;

    const ozellikSablonu = [];
    if (ozellikAd) {
      const adlar = Array.isArray(ozellikAd) ? ozellikAd : [ozellikAd];
      adlar.forEach((ad, i) => {
        if (ad.trim()) {
          ozellikSablonu.push({
            ad: ad.trim(),
            birim: (Array.isArray(ozellikBirim) ? ozellikBirim[i] : ozellikBirim) || '',
            tip:   (Array.isArray(ozellikTip)   ? ozellikTip[i]   : ozellikTip)   || 'text',
            zorunlu: !!(Array.isArray(ozellikZorunlu) ? ozellikZorunlu[i] : ozellikZorunlu),
          });
        }
      });
    }

    await EkipmanTipi.create({
      anaKategori, altKategori: altKategori.trim(), tipNotu: (tipNotu||'').trim(),
      aciklama: aciklama||'', slug: (slug||'').trim(),
      melAciklama: melAciklama||'', ozellikSablonu,
      bakimPeriyodu: parseInt(bakimPeriyodu)||365,
      kalibrasyonGerekli: !!kalibrasyonGerekli,
    });
    req.flash('basarili', t.equip_type_flash_created(altKategori));
    res.redirect('/equipment/types');
  } catch (e) {
    req.flash('hata', t.equip_flash_save_err + e.message);
    res.redirect('/equipment/types/new');
  }
});

// Düzenleme formu
router.get('/types/:id/edit', async (req, res) => {
  try {
    const tip = await EkipmanTipi.findById(req.params.id).lean();
    if (!tip) { req.flash('hata', res.locals.t.equip_flash_not_found); return res.redirect('/equipment/types'); }
    const kategoriler = await AnaKategori.find({ aktif: true }).sort('sira').lean();
    res.render('equipment/type_form', { tip, kategoriler, seciliKategori: tip.anaKategori });
  } catch (e) {
    req.flash('hata', e.message);
    res.redirect('/equipment/types');
  }
});

// Güncelle
router.put('/types/:id', async (req, res) => {
  const t = res.locals.t;
  try {
    const { anaKategori, altKategori, tipNotu, aciklama,
            slug, melAciklama, bakimPeriyodu, kalibrasyonGerekli,
            ozellikAd, ozellikBirim, ozellikTip, ozellikZorunlu } = req.body;

    const ozellikSablonu = [];
    if (ozellikAd) {
      const adlar = Array.isArray(ozellikAd) ? ozellikAd : [ozellikAd];
      adlar.forEach((ad, i) => {
        if (ad.trim()) {
          ozellikSablonu.push({
            ad: ad.trim(),
            birim: (Array.isArray(ozellikBirim) ? ozellikBirim[i] : ozellikBirim) || '',
            tip:   (Array.isArray(ozellikTip)   ? ozellikTip[i]   : ozellikTip)   || 'text',
            zorunlu: !!(Array.isArray(ozellikZorunlu) ? ozellikZorunlu[i] : ozellikZorunlu),
          });
        }
      });
    }

    const tip = await EkipmanTipi.findByIdAndUpdate(req.params.id, {
      anaKategori, altKategori: altKategori.trim(), tipNotu: (tipNotu||'').trim(),
      aciklama: aciklama||'', slug: (slug||'').trim(),
      melAciklama: melAciklama||'', ozellikSablonu,
      bakimPeriyodu: parseInt(bakimPeriyodu)||365,
      kalibrasyonGerekli: !!kalibrasyonGerekli,
    }, { new: true });

    req.flash('basarili', t.equip_type_flash_updated(tip.altKategori));
    res.redirect('/equipment/types');
  } catch (e) {
    req.flash('hata', t.equip_flash_update_err + e.message);
    res.redirect(`/equipment/types/${req.params.id}/edit`);
  }
});

// Aktif/Pasif toggle
router.post('/types/:id/toggle', async (req, res) => {
  const tip = await EkipmanTipi.findById(req.params.id);
  if (!tip) { req.flash('hata', res.locals.t.equip_flash_not_found); return res.redirect('/equipment/types'); }
  tip.aktif = !tip.aktif;
  await tip.save();
  req.flash('basarili', tip.aktif
    ? res.locals.t.equip_type_flash_activated(tip.altKategori)
    : res.locals.t.equip_type_flash_deactivated(tip.altKategori));
  res.redirect('/equipment/types');
});

// API — tipe ait özellik şablonunu döndür (demirbaş formunda kullanılır)
router.get('/api/type/:id/schema', async (req, res) => {
  try {
    const tip = await EkipmanTipi.findById(req.params.id).select('ozellikSablonu altKategori bakimPeriyodu').lean();
    if (!tip) return res.json({ ok: false });
    res.json({ ok: true, ozellikSablonu: tip.ozellikSablonu, altKategori: tip.altKategori, bakimPeriyodu: tip.bakimPeriyodu });
  } catch { res.json({ ok: false }); }
});

// API — yeni barkod üret
router.get('/api/barcode', (req, res) => {
  res.json({ barkod: generateBarcode() });
});

// ══════════════════════════════════════════════════════════════════════════════
//  DEMİRBAŞ
// ══════════════════════════════════════════════════════════════════════════════

// Liste
router.get('/', async (req, res) => {
  try {
    const { org, tip, durum, sayfa = 1 } = req.query;
    const filtre = {};
    if (org)   filtre.orgId = org;
    if (tip)   filtre.ekipmanTipi = tip;
    if (durum) filtre.durum = durum;

    const limit = 25;
    const skip  = (parseInt(sayfa) - 1) * limit;
    const toplam = await Demirbase.countDocuments(filtre);

    const demirbaslar = await Demirbase.find(filtre)
      .populate({ path: 'ekipmanTipi', populate: { path: 'anaKategori', select: 'ad ikon' } })
      .populate('orgId', 'ad slug')
      .sort({ createdAt: -1 })
      .skip(skip).limit(limit)
      .lean();

    const orglar  = await orgSecenekleri();
    const tipler  = await EkipmanTipi.find({ aktif: true }).populate('anaKategori', 'ad').sort('altKategori').lean();

    res.render('equipment/list', {
      demirbaslar, orglar, tipler,
      filtre: req.query,
      sayfa: parseInt(sayfa), limit, toplam,
      toplamSayfa: Math.ceil(toplam / limit),
    });
  } catch (e) {
    req.flash('hata', res.locals.t.equip_flash_list_err + e.message);
    res.redirect('/');
  }
});

// Yeni form
router.get('/new', async (req, res) => {
  const kategoriler = await AnaKategori.find({ aktif: true }).sort('sira').lean();
  const tipler      = await EkipmanTipi.find({ aktif: true }).populate('anaKategori', 'ad').sort('altKategori').lean();
  const orglar      = await orgSecenekleri();
  const barkod      = generateBarcode();
  res.render('equipment/form', {
    demirbase: null, kategoriler, tipler, orglar, barkod,
    seciliTip: req.query.tip || '',
    seciliOrg: req.query.org || '',
  });
});

// Yeni kaydet
router.post('/', async (req, res) => {
  const t = res.locals.t;
  try {
    const {
      barkod, nfcId, rfidEpc, ekipmanTipi, seriNo, marka, model,
      durum, konumTip, orgId, melUygun, notlar,
      garantiBitis, satinaAlimTarihi,
      ozellikAd, ozellikDeger, ozellikBirim,
    } = req.body;

    const ozellikler = [];
    if (ozellikAd) {
      const adlar = Array.isArray(ozellikAd) ? ozellikAd : [ozellikAd];
      adlar.forEach((ad, i) => {
        ozellikler.push({
          ad,
          deger: (Array.isArray(ozellikDeger) ? ozellikDeger[i] : ozellikDeger) || '',
          birim: (Array.isArray(ozellikBirim) ? ozellikBirim[i] : ozellikBirim) || '',
        });
      });
    }

    const fiyat = {};
    const fo = req.body.fiyat || {};
    if (fo.tutar) {
      fiyat.tutar  = parseFloat(fo.tutar);
      fiyat.birim  = fo.birim || 'TRY';
      if (fo.faturaNo) fiyat.faturaNo = fo.faturaNo;
    }

    await Demirbase.create({
      barkod: barkod.trim(), nfcId: nfcId||'', rfidEpc: rfidEpc||'',
      ekipmanTipi, seriNo: seriNo||'', marka: marka||'', model: model||'',
      durum: durum||'aktif', konumTip: konumTip||'depo', orgId,
      melUygun: melUygun !== '0',
      notlar: notlar||'', ozellikler,
      garantiBitis:     garantiBitis     ? new Date(garantiBitis)     : null,
      satinaAlimTarihi: satinaAlimTarihi ? new Date(satinaAlimTarihi) : null,
      fiyat,
    });

    req.flash('basarili', t.equip_flash_created(barkod));
    res.redirect('/equipment');
  } catch (e) {
    req.flash('hata', t.equip_flash_save_err + e.message);
    res.redirect('/equipment/new');
  }
});

// Detay
router.get('/:id', async (req, res) => {
  try {
    const d = await Demirbase.findById(req.params.id)
      .populate({ path: 'ekipmanTipi', populate: { path: 'anaKategori', select: 'ad ikon' } })
      .populate('orgId', 'ad slug')
      .lean();
    if (!d) { req.flash('hata', res.locals.t.equip_flash_not_found); return res.redirect('/equipment'); }
    res.render('equipment/detail', { demirbase: d });
  } catch (e) {
    req.flash('hata', e.message);
    res.redirect('/equipment');
  }
});

// Düzenleme formu
router.get('/:id/edit', async (req, res) => {
  try {
    const d = await Demirbase.findById(req.params.id).lean();
    if (!d) { req.flash('hata', res.locals.t.equip_flash_not_found); return res.redirect('/equipment'); }
    const kategoriler = await AnaKategori.find({ aktif: true }).sort('sira').lean();
    const tipler      = await EkipmanTipi.find({ aktif: true }).populate('anaKategori', 'ad').sort('altKategori').lean();
    const orglar      = await orgSecenekleri();
    res.render('equipment/form', { demirbase: d, kategoriler, tipler, orglar, barkod: d.barkod, seciliTip: d.ekipmanTipi, seciliOrg: d.orgId });
  } catch (e) {
    req.flash('hata', e.message);
    res.redirect('/equipment');
  }
});

// Güncelle
router.put('/:id', async (req, res) => {
  const t = res.locals.t;
  try {
    const {
      nfcId, rfidEpc, ekipmanTipi, seriNo, marka, model,
      durum, konumTip, orgId, melUygun, notlar,
      garantiBitis, satinaAlimTarihi,
      ozellikAd, ozellikDeger, ozellikBirim,
    } = req.body;

    const ozellikler = [];
    if (ozellikAd) {
      const adlar = Array.isArray(ozellikAd) ? ozellikAd : [ozellikAd];
      adlar.forEach((ad, i) => {
        ozellikler.push({
          ad,
          deger: (Array.isArray(ozellikDeger) ? ozellikDeger[i] : ozellikDeger) || '',
          birim: (Array.isArray(ozellikBirim) ? ozellikBirim[i] : ozellikBirim) || '',
        });
      });
    }

    const fiyat = {};
    const fo = req.body.fiyat || {};
    if (fo.tutar) {
      fiyat.tutar  = parseFloat(fo.tutar);
      fiyat.birim  = fo.birim || 'TRY';
      if (fo.faturaNo) fiyat.faturaNo = fo.faturaNo;
    }

    const d = await Demirbase.findByIdAndUpdate(req.params.id, {
      nfcId: nfcId||'', rfidEpc: rfidEpc||'',
      ekipmanTipi, seriNo: seriNo||'', marka: marka||'', model: model||'',
      durum: durum||'aktif', konumTip: konumTip||'depo', orgId,
      melUygun: melUygun !== '0',
      notlar: notlar||'', ozellikler,
      garantiBitis:     garantiBitis     ? new Date(garantiBitis)     : null,
      satinaAlimTarihi: satinaAlimTarihi ? new Date(satinaAlimTarihi) : null,
      fiyat,
    }, { new: true });

    req.flash('basarili', t.equip_flash_updated(d.barkod));
    res.redirect(`/equipment/${req.params.id}`);
  } catch (e) {
    req.flash('hata', t.equip_flash_update_err + e.message);
    res.redirect(`/equipment/${req.params.id}/edit`);
  }
});

// Durum değiştir (AJAX veya form POST)
router.post('/:id/status', async (req, res) => {
  const t = res.locals.t;
  const { durum } = req.body;
  const izin = ['aktif', 'bakimda', 'hurda', 'kayip', 'gorevde'];
  if (!izin.includes(durum)) { req.flash('hata', 'Geçersiz durum.'); return res.redirect('/equipment'); }
  await Demirbase.findByIdAndUpdate(req.params.id, { durum });
  req.flash('basarili', t.equip_flash_status_updated);
  res.redirect(`/equipment/${req.params.id}`);
});

module.exports = router;
