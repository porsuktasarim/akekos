'use strict';

/**
 * AKEKOS — Türkçe dil dosyası
 * Tüm UI metinleri burada tanımlanır.
 * Erişim: res.locals.t (app.js middleware)
 */
module.exports = {

  // ── Genel ──────────────────────────────────────────────────────────────
  app_name:          'AKEKOS',
  back:              'Geri',
  save:              'Kaydet',
  update:            'Güncelle',
  cancel:            'İptal',
  edit:              'Düzenle',
  delete:            'Sil',
  activate:          'Aktif Et',
  deactivate:        'Pasife Al',
  add_sub_unit:      'Alt Birim Ekle',
  new_record:        'Yeni Kayıt',
  yes:               'Evet',
  no:                'Hayır',
  loading:           'Yükleniyor...',
  select:            '— Seçin —',
  none:              '— Yok —',
  retry:             'Hata — yeniden deneyin',
  active:            'Aktif',
  passive:           'Pasif',
  no_record:         'Kayıt yok.',
  confirm_delete:    'Silmek istediğinizden emin misiniz?',

  // ── Organizasyon — sayfa başlıkları ────────────────────────────────────
  org_title:         'Organizasyon',
  org_new:           'Yeni Organizasyon',
  org_edit_prefix:   'Düzenle: ',

  // ── Organizasyon — form etiketleri ─────────────────────────────────────
  org_field_level:       'Kademe',
  org_field_level_note:  'Kademe değiştirilemez.',
  org_field_parent:      'Üst Birim',
  org_field_name:        'Ad',
  org_field_name_ph:     'Birim adı',
  org_field_center_il:   'Merkez Adres İli',
  org_field_center_note: 'İl plaka kodunu belirler; AKE slug\'ında kullanılır.',
  org_field_phone:       'Telefon',
  org_field_email:       'E-posta',
  org_field_address:     'Adres',
  org_field_desc:        'Açıklama',
  org_field_slug:        'Slug (Otomatik)',
  org_field_slug_note:   'Slug değiştirilemez.',

  // ── Organizasyon — liste ───────────────────────────────────────────────
  org_tree_hint:     'Ağaç görünümü — kademe sırasıyla',
  org_empty:         'Henüz kayıt yok. Önce bir Bakanlık ekleyin.',
  org_sub_units:     'Alt Birimler',
  org_no_sub:        'Alt birim yok.',

  // ── Organizasyon — detay ───────────────────────────────────────────────
  org_det_slug:      'Slug',
  org_det_parent:    'Üst Birim',
  org_det_center:    'Merkez İl',
  org_det_phone:     'Telefon',
  org_det_email:     'E-posta',
  org_det_address:   'Adres',
  org_det_desc:      'Açıklama',

  // ── Organizasyon — flash mesajları (route içinden kullanılır) ──────────
  org_flash_created:         (ad, slug) => `"${ad}" başarıyla oluşturuldu.` + (slug ? ` Slug: <code>${slug}</code>` : ''),
  org_flash_updated:         (ad)       => `"${ad}" güncellendi.`,
  org_flash_activated:       (ad)       => `"${ad}" aktif yapıldı.`,
  org_flash_deactivated:     (ad)       => `"${ad}" pasif yapıldı.`,
  org_flash_deleted:         (ad)       => `"${ad}" silindi.`,
  org_flash_not_found:       'Kayıt bulunamadı.',
  org_flash_list_err:        'Organizasyon listesi alınamadı: ',
  org_flash_save_err:        'Kayıt oluşturulamadı: ',
  org_flash_update_err:      'Güncelleme başarısız: ',
  org_flash_no_parent:       'Üst birim seçilmesi zorunludur.',
  org_flash_no_sub_possible: 'Bu kademede alt birim oluşturulamaz.',
  org_flash_ake_no_delete:   'AKE silinemez. Tüm personel ve ekipmanı devredildikten sonra pasife alınabilir.',
  org_flash_has_children:    'Bu birime bağlı alt kayıtlar var. Önce onları silin veya taşıyın.',
};
