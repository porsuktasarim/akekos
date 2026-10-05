'use strict';
/**
 * Barkod üretici — AKEKOS-YYYYMMDD-RANDOM
 * QR kod olarak da kullanılabilir.
 */
function generateBarcode() {
  const now    = new Date();
  const ymd    = now.getFullYear().toString()
    + String(now.getMonth() + 1).padStart(2, '0')
    + String(now.getDate()).padStart(2, '0');
  const rand   = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `AKE-${ymd}-${rand}`;
}

module.exports = { generateBarcode };
