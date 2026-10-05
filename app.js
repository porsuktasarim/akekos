require('dotenv').config();
const express      = require('express');
const path         = require('path');
const session      = require('express-session');
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

// Session — memory store (MongoStore opsiyonel, sonra eklenecek)
app.use(session({
  secret: process.env.SESSION_SECRET || 'akekos_dev_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 8 * 60 * 60 * 1000,
    httpOnly: true,
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

// Auth middleware
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
  res.status(404).send('<h1>404</h1><a href="/">Ana Sayfa</a>');
});

// Hata
app.use((err, req, res, next) => {
  console.error('[Hata]', err);
  res.status(500).send('<h1>Hata</h1><pre>' + err.message + '</pre>');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('[AKEKOS] http://localhost:' + PORT);
});

module.exports = app;
