const express = require('express');
const router  = express.Router();
const Org     = require('../models/Organization');

const KADEME_LIST   = () => Org.KADEME;
const KADEME_ETIKET = () => Org.KADEME_ETIKET;
const IL_KODLARI    = () => Org.IL_KODLARI;

// ---------- Ağaç yardımcısı ----------
async function buildTree() {
  const all  = await Org.find().sort({ kademe: 1, ad: 1 }).lean();
  const map  = {};
  all.forEach(o => { o.children = []; map[o._id.toString()] = o; });
  const roots = [];
  all.forEach(o => {
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
  const t = res.locals.t;
  try {
    const tree = await buildTree();
    res.render('organization/list', {
      baslik:        t.org_title,
      tree,
      KADEME_ETIKET: KADEME_ETIKET(),
    });
  } catch (err) {
    req.flash('hata', t.org_flash_list_err + err.message);
    res.redirect('/');
  }
});

// ---------- Yeni kayıt formu ----------
router.get('/new', async (req, res) => {
  const t = res.locals.t;
  try {
    const levels = KADEME_LIST();
    let selectedParent = req.query.parent || null;
    let selectedLevel  = req.query.level  || null;

    if (selectedParent && selectedLevel) {
      const idx = levels.indexOf(selectedLevel);
      if (idx >= 0 && idx < levels.length - 1) {
        selectedLevel = levels[idx + 1];
      } else {
        req.flash('hata', t.org_flash_no_sub_possible);
        return res.redirect('/organization/' + selectedParent);
      }
    }

    let parents = [];
    if (selectedLevel) {
      const idx = levels.indexOf(selectedLevel);
      if (idx > 0) {
        const parentLevel = levels[idx - 1];
        parents = await Org.find({ kademe: parentLevel, aktif: true }).sort({ ad: 1 }).lean();
      }
    } else {
      parents = await Org.find({ aktif: true }).sort({ kademe: 1, ad: 1 }).lean();
    }

    res.render('organization/form', {
      baslik:        t.org_new,
      org:           null,
      parents,
      selectedParent,
      selectedLevel,
      KADEME:        KADEME_LIST(),
      KADEME_ETIKET: KADEME_ETIKET(),
      IL_KODLARI:    IL_KODLARI(),
    });
  } catch (err) {
    req.flash('hata', err.message);
    res.redirect('/organization');
  }
});

// ---------- Kaydet ----------
router.post('/', async (req, res) => {
  const t = res.locals.t;
  try {
    const { ad, kademe, ust, merkezIl, adres, telefon, email, aciklama } = req.body;

    if (kademe !== 'bakanlik' && !ust) {
      req.flash('hata', t.org_flash_no_parent);
      return res.redirect('/organization/new');
    }

    const org = new Org({
      ad:       ad.trim(),
      kademe,
      ust:      ust || null,
      merkezIl: merkezIl || undefined,
      adres, telefon, email, aciklama,
    });

    await org.save();
    req.flash('basarili', t.org_flash_created(org.ad, org.slug));
    res.redirect('/organization');
  } catch (err) {
    req.flash('hata', t.org_flash_save_err + err.message);
    res.redirect('/organization/new');
  }
});

// ---------- Detay ----------
router.get('/:id', async (req, res) => {
  const t = res.locals.t;
  try {
    const org = await Org.findById(req.params.id).populate('ust').lean();
    if (!org) { req.flash('hata', t.org_flash_not_found); return res.redirect('/organization'); }

    const children = await Org.find({ ust: org._id }).sort({ kademe: 1, ad: 1 }).lean();

    res.render('organization/detail', {
      baslik:        org.ad,
      org,
      children,
      KADEME_ETIKET: KADEME_ETIKET(),
    });
  } catch (err) {
    req.flash('hata', err.message);
    res.redirect('/organization');
  }
});

// ---------- Düzenleme formu ----------
router.get('/:id/edit', async (req, res) => {
  const t = res.locals.t;
  try {
    const org = await Org.findById(req.params.id).lean();
    if (!org) { req.flash('hata', t.org_flash_not_found); return res.redirect('/organization'); }

    const parents = await Org.find({ aktif: true, _id: { $ne: org._id } }).sort({ kademe: 1, ad: 1 }).lean();

    res.render('organization/form', {
      baslik:        t.org_edit_prefix + org.ad,
      org,
      parents,
      selectedParent: org.ust ? org.ust.toString() : null,
      selectedLevel:  org.kademe,
      KADEME:        KADEME_LIST(),
      KADEME_ETIKET: KADEME_ETIKET(),
      IL_KODLARI:    IL_KODLARI(),
    });
  } catch (err) {
    req.flash('hata', err.message);
    res.redirect('/organization');
  }
});

// ---------- Güncelle ----------
router.put('/:id', async (req, res) => {
  const t = res.locals.t;
  try {
    const { ad, ust, merkezIl, adres, telefon, email, aciklama } = req.body;

    const org = await Org.findById(req.params.id);
    if (!org) { req.flash('hata', t.org_flash_not_found); return res.redirect('/organization'); }

    org.ad       = ad.trim();
    org.ust      = ust || null;
    org.merkezIl = merkezIl || undefined;
    org.adres    = adres;
    org.telefon  = telefon;
    org.email    = email;
    org.aciklama = aciklama;

    await org.save();
    req.flash('basarili', t.org_flash_updated(org.ad));
    res.redirect('/organization/' + org._id);
  } catch (err) {
    req.flash('hata', t.org_flash_update_err + err.message);
    res.redirect('/organization/' + req.params.id + '/edit');
  }
});

// ---------- Aktif / Pasif (cascade) ----------
router.post('/:id/toggle', async (req, res) => {
  const t = res.locals.t;
  try {
    const org = await Org.findById(req.params.id);
    if (!org) { req.flash('hata', t.org_flash_not_found); return res.redirect('/organization'); }

    const newStatus = !org.aktif;
    org.aktif = newStatus;
    await org.save();

    if (!newStatus) {
      await cascadeDeactivate(org._id);
    }

    req.flash('basarili', newStatus ? t.org_flash_activated(org.ad) : t.org_flash_deactivated(org.ad));
    res.redirect('/organization/' + org._id);
  } catch (err) {
    req.flash('hata', err.message);
    res.redirect('/organization');
  }
});

async function cascadeDeactivate(parentId) {
  const children = await Org.find({ ust: parentId, aktif: true });
  for (const child of children) {
    child.aktif = false;
    await child.save();
    await cascadeDeactivate(child._id);
  }
}

// ---------- Sil ----------
router.delete('/:id', async (req, res) => {
  const t = res.locals.t;
  try {
    const org = await Org.findById(req.params.id);
    if (!org) { req.flash('hata', t.org_flash_not_found); return res.redirect('/organization'); }

    if (org.kademe === 'ake') {
      req.flash('hata', t.org_flash_ake_no_delete);
      return res.redirect('/organization/' + org._id);
    }

    const childCount = await Org.countDocuments({ ust: org._id });
    if (childCount > 0) {
      req.flash('hata', t.org_flash_has_children);
      return res.redirect('/organization/' + org._id);
    }

    await Org.deleteOne({ _id: org._id });
    req.flash('basarili', t.org_flash_deleted(org.ad));
    res.redirect('/organization');
  } catch (err) {
    req.flash('hata', err.message);
    res.redirect('/organization');
  }
});

// ---------- API: Kademeye göre üst listesi ----------
router.get('/api/parents/:level', async (req, res) => {
  try {
    const levels = KADEME_LIST();
    const idx    = levels.indexOf(req.params.level);
    if (idx <= 0) return res.json([]);
    const parentLevel = levels[idx - 1];
    const list = await Org.find({ kademe: parentLevel, aktif: true })
      .sort({ ad: 1 })
      .select('ad merkezIl slug _id')
      .lean();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
