const express = require('express');
const router  = express.Router();
const Organizasyon = require('../models/Organizasyon');

router.get('/', async (req, res) => {
  try {
    const orgSayisi = await Organizasyon.countDocuments({ aktif: true });
    res.render('dashboard/index', {
      baslik: 'Dashboard',
      istatistikler: { orgSayisi },
    });
  } catch (e) {
    console.error(e);
    res.render('dashboard/index', { baslik: 'Dashboard', istatistikler: { orgSayisi: 0 } });
  }
});

module.exports = router;
