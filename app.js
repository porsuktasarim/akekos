require('dotenv').config();
const express      = require('express');
const path         = require('path');
const session      = require('express-session');
const MongoStore   = require('connect-mongo');
const flash        = require('connect-flash');
const methodOverride = require('method-override');

const connectDB = require('./config/db');

const app = express();

connectDB();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/public',  express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(express.json({ limit: '20mb' }));
app.use(methodOverride('_method'));

app.use(session({
  secret: process.env.SESSION_SECRET || 'akekos_dev_secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    touchAfter: 24 * 3600,
  }),
  cookie: {
    maxAge: 8 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  },
}));

app.use(flash());

// Locals
app.use((req, res, next) => {
  res.locals.hata    = req.flash('hata');
  res.locals.basarili = req.flash('basarili');
  res.locals.user    = req.session.user || null;
  res.locals.appName = 'AKEKOS';
  res.locals.yil     = new Date().getFullYear();
  next();
});

// Auth middleware — hardcoded superadmin/123456
app.use((req, res, next) => {
  const open = ['/login', '/logout', '/public', '/uploads'];
  if (open.some(p => req.path.startsWith(p))) return next();
  if (req.session && req.session.user) return next();
  req.session.returnTo = req.originalUrl;
  return res.redirect('/login');
});

// Routes
app.use('/',             require('./routes/auth'));
app.use('/',             require('./routes/dashboard'));
app.use('/organizasyon', require('./routes/organizasyon'));

// 404
app.use((req, res) => {
  res.status(404).render('404', { baslik: '404 — Sayfa Bulunamadı' });
});

// Hata
app.use((err, req, res, next) => {
  console.error('[Hata]', err);
  res.status(err.status || 500).render('hata', { baslik: 'Hata', mesaj: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('[AKEKOS] http://localhost:' + PORT);
});

module.exports = app;
