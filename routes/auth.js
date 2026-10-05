'use strict';
const express = require('express');
const router  = express.Router();

// Login sayfası
router.get('/login', (req, res) => {
  if (req.session && req.session.user) return res.redirect('/');
  res.render('auth/login');
});

// Login POST — geçici: şifresiz erişim (geliştirme aşaması)
router.post('/login', (req, res) => {
  const { kullanici } = req.body;
  if (!kullanici || !kullanici.trim()) {
    req.flash('hata', 'Kullanıcı adı boş olamaz.');
    return res.redirect('/login');
  }
  req.session.user = { ad: kullanici.trim(), rol: 'admin', kullanici: kullanici.trim() };
  const returnTo = req.session.returnTo || '/';
  delete req.session.returnTo;
  res.redirect(returnTo);
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

module.exports = router;
