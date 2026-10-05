/**
 * AKEKOS — Seed verisi
 * Kullanım: npm run seed
 *
 * Bakanlık kaydı yoksa oluşturur; varsa atlar.
 * Güvenle birden fazla kez çalıştırılabilir.
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Org      = require('../models/Organization');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/akekos';

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log('[Seed] MongoDB bağlantısı kuruldu.');

  const exists = await Org.findOne({ kademe: 'bakanlik' });
  if (exists) {
    console.log('[Seed] Bakanlık kaydı zaten var:', exists.ad);
  } else {
    const bakanlik = await Org.create({
      ad:     'Tarım ve Orman Bakanlığı',
      kademe: 'bakanlik',
    });
    console.log('[Seed] Bakanlık oluşturuldu:', bakanlik.ad);
  }

  await mongoose.disconnect();
  console.log('[Seed] Tamamlandı.');
}

run().catch(err => {
  console.error('[Seed] Hata:', err.message);
  process.exit(1);
});
