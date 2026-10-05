const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/akekos';
    await mongoose.connect(uri);
    console.log('[DB] MongoDB bağlantısı kuruldu');
  } catch (err) {
    console.error('[DB] Bağlantı hatası:', err.message);
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB;
