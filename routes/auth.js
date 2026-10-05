const express = require('express');
const router  = express.Router();

const SUPERADMIN = { username: 'superadmin', password: '123456', role: 'superadmin', ad: 'Süper Yönetici' };

router.get('/login', (req, res) => {
  if (req.session && req.session.user) return res.redirect('/');
  res.render('auth/login', { baslik: 'Giriş Yap' });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === SUPERADMIN.username && password === SUPERADMIN.password) {
    req.session.user = { username: SUPERADMIN.username, ad: SUPERADMIN.ad, role: SUPERADMIN.role };
    req.session.save(err => {
      if (err) {
        req.flash('hata', 'Oturum başlatılamadı.');
        return res.redirect('/login');
      }
      const returnTo = req.session.returnTo || '/';
      delete req.session.returnTo;
      return res.redirect(returnTo);
    });
  } else {
    req.flash('hata', 'Kullanıcı adı veya şifre hatalı.');
    return res.redirect('/login');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});

module.exports = router;
