'use strict';
const express = require('express');
const router  = express.Router();

// Login sayfası
router.get('/login', (req, res) => {
  if (req.session && req.session.user) return res.redirect('/');
  res.render('auth/login');
});

// Login POST — geçici: sabit şifre
router.post('/login', (req, res) => {
  const { kullanici, sifre } = req.body;
  const adminUser = process.env.ADMIN_USER || 'admin';
  const adminPass = process.env.ADMIN_PASS || 'akekos2024';
  if (kullanici === adminUser && sifre === adminPass) {
    req.session.user = { ad: 'Yönetici', rol: 'admin', kullanici };
    const returnTo = req.session.returnTo || '/';
    delete req.session.returnTo;
    return res.redirect(returnTo);
  }
  req.flash('hata', 'Kullanıcı adı veya şifre hatalı.');
  res.redirect('/login');
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

module.exports = router;
