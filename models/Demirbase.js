'use strict';
const mongoose = require('mongoose');

// Satın alma fiyatı
const FiyatSchema = new mongoose.Schema({
  tutar:      { type: Number },
  birim:      { type: String, enum: ['TRY', 'EUR', 'USD'], default: 'TRY' },
  tutarTL:    { type: Number },
  tutarEUR:   { type: Number },
  tutarUSD:   { type: Number },
  tcmbKurTarih: { type: Date },
  tcmbUSDTL:  { type: Number },
  tcmbEURTL:  { type: Number },
  faturaNo:   { type: String, default: '' },
  faturaTarih:{ type: Date },
}, { _id: false });

// Dinamik özellikler (tipten gelen şablona göre)
const OzellikSchema = new mongoose.Schema({
  ad:    { type: String },
  deger: { type: mongoose.Schema.Types.Mixed },
  birim: { type: String, default: '' },
}, { _id: false });

const DemirbaseSchema = new mongoose.Schema({
  // Kimlik
  barkod:   { type: String, required: true, unique: true, trim: true },
  nfcId:    { type: String, default: '', trim: true },
  rfidEpc:  { type: String, default: '', trim: true },

  // Tür
  ekipmanTipi: { type: mongoose.Schema.Types.ObjectId, ref: 'EkipmanTipi', required: true },

  // Temel bilgiler
  seriNo:   { type: String, default: '', trim: true },
  marka:    { type: String, default: '', trim: true },
  model:    { type: String, default: '', trim: true },

  // Durum
  durum: {
    type: String,
    enum: ['aktif', 'bakimda', 'hurda', 'kayip', 'gorevde'],
    default: 'aktif',
  },

  // Konum — ya depoda ya grupta
  konumTip: { type: String, enum: ['depo', 'grup'], default: 'depo' },
  konumId:  { type: mongoose.Schema.Types.ObjectId, default: null }, // Depo veya EkipmanGrubu ObjectId
  // Hangi organizasyona ait olduğu (hızlı filtreleme için)
  orgId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },

  // MEL
  melUygun: { type: Boolean, default: true },

  // Dinamik özellikler
  ozellikler: [OzellikSchema],

  // Bakım
  bakimGorevlisi: { type: mongoose.Schema.Types.ObjectId, ref: 'Personel', default: null },
  bakimGrubu:     { type: mongoose.Schema.Types.ObjectId, default: null },
  sonBakimTarihi: { type: Date, default: null },
  sonraBakimTarihi: { type: Date, default: null },

  // Tarihler
  satinaAlimTarihi: { type: Date, default: null },
  garantiBitis:     { type: Date, default: null },

  // Fiyat
  fiyat: { type: FiyatSchema, default: () => ({}) },

  // Dosyalar
  fotograflar: [{
    tip:  { type: String, enum: ['genel', 'teslim_alan', 'teslim_veren', 'hasar'], default: 'genel' },
    yol:  { type: String },
    aciklama: { type: String, default: '' },
  }],
  belgeler: [{
    ad:  { type: String },
    yol: { type: String },
  }],

  // Tedarikçi
  tedarikciler: [{ type: mongoose.Schema.Types.ObjectId }],

  // Notlar
  notlar: { type: String, default: '' },

}, { timestamps: true });

// Bir sonraki bakım tarihini otomatik hesapla
DemirbaseSchema.methods.bakimHesapla = async function () {
  const EkipmanTipi = mongoose.model('EkipmanTipi');
  const tip = await EkipmanTipi.findById(this.ekipmanTipi);
  if (tip && tip.bakimPeriyodu && this.sonBakimTarihi) {
    const sonraki = new Date(this.sonBakimTarihi);
    sonraki.setDate(sonraki.getDate() + tip.bakimPeriyodu);
    this.sonraBakimTarihi = sonraki;
  }
};

module.exports = mongoose.model('Demirbase', DemirbaseSchema);
