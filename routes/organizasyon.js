const express = require('express');
const router  = express.Router();
const Org     = require('../models/Organizasyon');

// Liste
router.get('/', async (req, res) => {
  try {
    const liste = await Org.find().sort({ ad: 1 });
    res.render('organizasyon/liste', { baslik: 'Organizasyonlar', liste });
  } catch (e) {
    req.flash('hata', 'Veri alınamadı: ' + e.message);
    res.redirect('/');
  }
});

// Yeni form
router.get('/yeni', (req, res) => {
  res.render('organizasyon/form', { baslik: 'Yeni Organizasyon', kayit: null });
});

// Yeni kaydet
router.post('/', async (req, res) => {
  try {
    await Org.create(req.body);
    req.flash('basarili', 'Organizasyon oluşturuldu.');
    res.redirect('/organizasyon');
  } catch (e) {
    req.flash('hata', 'Kayıt hatası: ' + e.message);
    res.redirect('/organizasyon/yeni');
  }
});

// Detay
router.get('/:id', async (req, res) => {
  try {
    const kayit = await Org.findById(req.params.id);
    if (!kayit) { req.flash('hata', 'Bulunamadı.'); return res.redirect('/organizasyon'); }
    res.render('organizasyon/detay', { baslik: kayit.ad, kayit });
  } catch (e) {
    req.flash('hata', e.message);
    res.redirect('/organizasyon');
  }
});

// Düzenle form
router.get('/:id/duzenle', async (req, res) => {
  try {
    const kayit = await Org.findById(req.params.id);
    if (!kayit) { req.flash('hata', 'Bulunamadı.'); return res.redirect('/organizasyon'); }
    res.render('organizasyon/form', { baslik: 'Düzenle: ' + kayit.ad, kayit });
  } catch (e) {
    req.flash('hata', e.message);
    res.redirect('/organizasyon');
  }
});

// Güncelle
router.put('/:id', async (req, res) => {
  try {
    await Org.findByIdAndUpdate(req.params.id, req.body, { runValidators: true });
    req.flash('basarili', 'Güncellendi.');
    res.redirect('/organizasyon/' + req.params.id);
  } catch (e) {
    req.flash('hata', 'Güncelleme hatası: ' + e.message);
    res.redirect('/organizasyon/' + req.params.id + '/duzenle');
  }
});

// Pasif/Aktif
router.post('/:id/aktif', async (req, res) => {
  try {
    const kayit = await Org.findById(req.params.id);
    if (!kayit) return res.redirect('/organizasyon');
    kayit.aktif = !kayit.aktif;
    await kayit.save();
    req.flash('basarili', `Durum güncellendi: ${kayit.aktif ? 'Aktif' : 'Pasif'}`);
    res.redirect('/organizasyon');
  } catch (e) {
    req.flash('hata', e.message);
    res.redirect('/organizasyon');
  }
});

// Sil
router.delete('/:id', async (req, res) => {
  try {
    await Org.findByIdAndDelete(req.params.id);
    req.flash('basarili', 'Silindi.');
    res.redirect('/organizasyon');
  } catch (e) {
    req.flash('hata', e.message);
    res.redirect('/organizasyon');
  }
});

module.exports = router;
