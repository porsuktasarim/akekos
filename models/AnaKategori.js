'use strict';
const mongoose = require('mongoose');

const AnaKategoriSchema = new mongoose.Schema({
  kod:       { type: String, required: true, unique: true, trim: true }, // 'iletisim', 'navigasyon' vb.
  ad:        { type: String, required: true, trim: true },
  aciklama:  { type: String, default: '' },
  ikon:      { type: String, default: 'fa-box' }, // Font Awesome class
  sira:      { type: Number, default: 0 },
  aktif:     { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('AnaKategori', AnaKategoriSchema);
