'use strict';
const express      = require('express');
const router       = express.Router();
const Organization = require('../models/Organization');
const Demirbase    = require('../models/Demirbase');

router.get('/', async (req, res) => {
  try {
    const [orgSayisi, demirbasSayisi] = await Promise.all([
      Organization.countDocuments({ aktif: true }),
      Demirbase.countDocuments(),
    ]);
    res.render('dashboard/index', { orgSayisi, demirbasSayisi });
  } catch (e) {
    res.render('dashboard/index', { orgSayisi: 0, demirbasSayisi: 0 });
  }
});

module.exports = router;
