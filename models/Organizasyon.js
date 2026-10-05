const mongoose = require('mongoose');

const OrgSchema = new mongoose.Schema({
  ad:       { type: String, required: true, trim: true },
  kod:      { type: String, trim: true, uppercase: true },
  tur:      { type: String, enum: ['AKUT', 'AFAD', 'UMKE', 'Belediye', 'STK', 'Diğer'], default: 'Diğer' },
  il:       { type: String, trim: true },
  ilce:     { type: String, trim: true },
  adres:    { type: String, trim: true },
  telefon:  { type: String, trim: true },
  email:    { type: String, trim: true, lowercase: true },
  aciklama: { type: String, trim: true },
  aktif:    { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Organizasyon', OrgSchema);
