'use strict';
const mongoose = require('mongoose');

async function connectDB() {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/akekos';
    await mongoose.connect(uri);
    console.log('[DB] MongoDB bağlantısı kuruldu:', uri);
  } catch (err) {
    console.error('[DB] Bağlantı hatası:', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
