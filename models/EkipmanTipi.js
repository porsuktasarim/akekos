'use strict';
const mongoose = require('mongoose');

// Dinamik özellik şablonu — her tipe özgü alanlar
const OzellikAlaniSchema = new mongoose.Schema({
  ad:         { type: String, required: true },   // 'Uzunluk', 'Çap', 'Kapasite'
  birim:      { type: String, default: '' },       // 'm', 'mm', 'kg'
  tip:        { type: String, enum: ['text', 'number', 'boolean', 'select', 'date'], default: 'text' },
  secenekler: [String],                            // tip==='select' ise kullanılır
  zorunlu:    { type: Boolean, default: false },
}, { _id: false });

const EkipmanTipiSchema = new mongoose.Schema({
  anaKategori:      { type: mongoose.Schema.Types.ObjectId, ref: 'AnaKategori', required: true },
  altKategori:      { type: String, required: true, trim: true }, // 'Statik Halat', 'VHF Telsiz'
  tipNotu:          { type: String, default: '', trim: true },    // 'Ø10mm, 50m, EN 1891 Tip A'
  aciklama:         { type: String, default: '' },
  slug:             { type: String, default: '', trim: true },    // 'static-rope', 'hand-radio'
  melAciklama:      { type: String, default: '' },                // 'Statik Halat'
  ozellikSablonu:   [OzellikAlaniSchema],
  bakimPeriyodu:    { type: Number, default: 365 },               // gün
  kalibrasyonGerekli: { type: Boolean, default: false },
  belgeler:         [{ ad: String, url: String }],
  aktif:            { type: Boolean, default: true },
}, { timestamps: true });

// Tam ad: "Statik Halat — Ø10mm, 50m, EN 1891 Tip A"
EkipmanTipiSchema.virtual('tamAd').get(function () {
  return this.tipNotu ? `${this.altKategori} — ${this.tipNotu}` : this.altKategori;
});

module.exports = mongoose.model('EkipmanTipi', EkipmanTipiSchema);
