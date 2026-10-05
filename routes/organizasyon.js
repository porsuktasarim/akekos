const express = require('express');
const router  = express.Router();
const Org     = require('../models/Organizasyon');

const KADEME_LIST   = () => Org.KADEME;
const KADEME_ETIKET = () => Org.KADEME_ETIKET;
const IL_KODLARI    = () => Org.IL_KODLARI;

// ---------- Ağaç yardımcısı ----------
async function agacOlustur() {
  const tumü = await Org.find().sort({ kademe: 1, ad: 1 }).lean();
  const map   = {};
  tumü.forEach(o => { o.children = []; map[o._id.toString()] = o; });
  const roots = [];
  tumü.forEach(o => {
    if (o.ust) {
      const parent = map[o.ust.toString()];
      if (parent) parent.children.push(o);
    } else {
      roots.push(o);
    }
  });
  return roots;
}

// ---------- Liste / Ağaç ----------
router.get('/', async (req, res) => {
  try {
    const agac = await agacOlustur();
    res.render('organizasyon/liste', {
      baslik:        'Organizasyon',
      agac,
      KADEME_ETIKET: KADEME_ETIKET(),
    });
  } catch (err) {
    req.flash('hata', 'Organizasyon listesi alınamadı: ' + err.message);
    res.redirect('/');
  }
});

// ---------- Yeni kayıt formu ----------
router.get('/yeni', async (req, res) => {
  try {
    const kademeler = KADEME_LIST();
    let seciliUst    = req.query.ust || null;
    let seciliKademe = req.query.kademe || null;

    // "Alt birim ekle" butonundan gelince: ust=ID, kademe=üstün kademesi
    // → bir alt kademeye otomatik geç, üstü seçili getir
    if (seciliUst && seciliKademe) {
      const ustIdx = kademeler.indexOf(seciliKademe);
      if (ustIdx >= 0 && ustIdx < kademeler.length - 1) {
        seciliKademe = kademeler[ustIdx + 1]; // bir alt kademe
      } else {
        // Son kademe — alt birim eklenemez
        req.flash('hata', 'Bu kademede alt birim oluşturulamaz.');
        return res.redirect('/organizasyon/' + seciliUst);
      }
    }

    // Seçili kademeye göre üst adayları — sadece bir üst kademeden
    let ustlar = [];
    if (seciliKademe) {
      const idx = kademeler.indexOf(seciliKademe);
      if (idx > 0) {
        const ustKademe = kademeler[idx - 1];
        ustlar = await Org.find({ kademe: ustKademe, aktif: true }).sort({ ad: 1 }).lean();
      }
    } else {
      ustlar = await Org.find({ aktif: true }).sort({ kademe: 1, ad: 1 }).lean();
    }

    res.render('organizasyon/form', {
      baslik:        'Yeni Organizasyon',
      org:           null,
      ustlar,
      seciliUst,
      seciliKademe,
      KADEME:        KADEME_LIST(),
      KADEME_ETIKET: KADEME_ETIKET(),
      IL_KODLARI:    IL_KODLARI(),
    });
  } catch (err) {
    req.flash('hata', err.message);
    res.redirect('/organizasyon');
  }
});

// ---------- Kaydet ----------
router.post('/', async (req, res) => {
  try {
    const { ad, kademe, ust, merkezIl, adres, telefon, email, aciklama } = req.body;

    // Bakanlık dışındaki kademeler için üst birim zorunlu
    if (kademe !== 'bakanlik' && !ust) {
      req.flash('hata', 'Üst birim seçilmesi zorunludur.');
      return res.redirect('/organizasyon/yeni');
    }

    const org = new Org({
      ad:       ad.trim(),
      kademe,
      ust:      ust || null,
      merkezIl: merkezIl || undefined,
      adres, telefon, email, aciklama,
    });

    await org.save();
    const slugBilgi = org.slug ? ` Slug: <code>${org.slug}</code>` : '';
    req.flash('basarili', `"${org.ad}" başarıyla oluşturuldu.${slugBilgi}`);
    res.redirect('/organizasyon');
  } catch (err) {
    req.flash('hata', 'Kayıt oluşturulamadı: ' + err.message);
    res.redirect('/organizasyon/yeni');
  }
});

// ---------- Detay ----------
router.get('/:id', async (req, res) => {
  try {
    const org = await Org.findById(req.params.id).populate('ust').lean();
    if (!org) { req.flash('hata', 'Kayıt bulunamadı.'); return res.redirect('/organizasyon'); }

    const children = await Org.find({ ust: org._id }).sort({ kademe: 1, ad: 1 }).lean();

    res.render('organizasyon/detay', {
      baslik:        org.ad,
      org,
      children,
      KADEME_ETIKET: KADEME_ETIKET(),
    });
  } catch (err) {
    req.flash('hata', err.message);
    res.redirect('/organizasyon');
  }
});

// ---------- Düzenleme formu ----------
router.get('/:id/duzenle', async (req, res) => {
  try {
    const org = await Org.findById(req.params.id).lean();
    if (!org) { req.flash('hata', 'Kayıt bulunamadı.'); return res.redirect('/organizasyon'); }

    const ustlar = await Org.find({ aktif: true, _id: { $ne: org._id } }).sort({ kademe: 1, ad: 1 }).lean();

    res.render('organizasyon/form', {
      baslik:        'Düzenle: ' + org.ad,
      org,
      ustlar,
      seciliUst:     org.ust ? org.ust.toString() : null,
      seciliKademe:  org.kademe,
      KADEME:        KADEME_LIST(),
      KADEME_ETIKET: KADEME_ETIKET(),
      IL_KODLARI:    IL_KODLARI(),
    });
  } catch (err) {
    req.flash('hata', err.message);
    res.redirect('/organizasyon');
  }
});

// ---------- Güncelle ----------
router.put('/:id', async (req, res) => {
  try {
    const { ad, ust, merkezIl, adres, telefon, email, aciklama } = req.body;

    const org = await Org.findById(req.params.id);
    if (!org) { req.flash('hata', 'Kayıt bulunamadı.'); return res.redirect('/organizasyon'); }

    org.ad       = ad.trim();
    org.ust      = ust || null;
    org.merkezIl = merkezIl || undefined;
    org.adres    = adres;
    org.telefon  = telefon;
    org.email    = email;
    org.aciklama = aciklama;
    // kademe ve slug değiştirilmez

    await org.save();
    req.flash('basarili', `"${org.ad}" güncellendi.`);
    res.redirect('/organizasyon/' + org._id);
  } catch (err) {
    req.flash('hata', 'Güncelleme başarısız: ' + err.message);
    res.redirect('/organizasyon/' + req.params.id + '/duzenle');
  }
});

// ---------- Aktif / Pasif (cascade) ----------
router.post('/:id/aktif', async (req, res) => {
  try {
    const org = await Org.findById(req.params.id);
    if (!org) { req.flash('hata', 'Kayıt bulunamadı.'); return res.redirect('/organizasyon'); }

    const yeniDurum = !org.aktif;
    org.aktif = yeniDurum;
    await org.save();

    // Pasife alınırsa tüm alt birimleri de pasife al (cascade)
    if (!yeniDurum) {
      await cascadePasif(org._id);
    }

    req.flash('basarili', `"${org.ad}" ${yeniDurum ? 'aktif' : 'pasif'} yapıldı.`);
    res.redirect('/organizasyon/' + org._id);
  } catch (err) {
    req.flash('hata', err.message);
    res.redirect('/organizasyon');
  }
});

async function cascadePasif(ustId) {
  const altlar = await Org.find({ ust: ustId, aktif: true });
  for (const alt of altlar) {
    alt.aktif = false;
    await alt.save();
    await cascadePasif(alt._id); // derine in
  }
}

// ---------- Sil ----------
router.delete('/:id', async (req, res) => {
  try {
    const org = await Org.findById(req.params.id);
    if (!org) { req.flash('hata', 'Kayıt bulunamadı.'); return res.redirect('/organizasyon'); }

    if (org.kademe === 'ake') {
      req.flash('hata', 'AKE silinemez. Tüm personel ve ekipmanı devredildikten sonra pasife alınabilir.');
      return res.redirect('/organizasyon/' + org._id);
    }

    const altVar = await Org.countDocuments({ ust: org._id });
    if (altVar > 0) {
      req.flash('hata', 'Bu birime bağlı alt kayıtlar var. Önce onları silin veya taşıyın.');
      return res.redirect('/organizasyon/' + org._id);
    }

    await Org.deleteOne({ _id: org._id });
    req.flash('basarili', `"${org.ad}" silindi.`);
    res.redirect('/organizasyon');
  } catch (err) {
    req.flash('hata', err.message);
    res.redirect('/organizasyon');
  }
});

// ---------- API: Kademeye göre üst listesi ----------
router.get('/api/ustlar/:kademe', async (req, res) => {
  try {
    const kademeler = KADEME_LIST();
    const idx       = kademeler.indexOf(req.params.kademe);
    if (idx <= 0) return res.json([]);
    const ustKademe = kademeler[idx - 1];
    const list = await Org.find({ kademe: ustKademe, aktif: true })
      .sort({ ad: 1 })
      .select('ad merkezIl slug _id')
      .lean();
    res.json(list);
  } catch (err) {
    res.status(500).json({ hata: err.message });
  }
});

module.exports = router;
