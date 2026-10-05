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

  // ── Ekipman — genel ───────────────────────────────────────────────────
  equip_title:              'Ekipman Envanteri',
  equip_cat_title:          'Ana Kategoriler',
  equip_type_title:         'Ekipman Tipleri',
  equip_type_new:           'Yeni Ekipman Tipi',
  equip_show_types:         'Tipleri Gör',

  // Ekipman tipi — alan etiketleri
  equip_type_field_category:    'Ana Kategori',
  equip_type_field_name:        'Alt Kategori / Tip Adı',
  equip_type_field_note:        'Tip Notu',
  equip_type_field_mel:         'MEL Etiketi',
  equip_type_field_mel_tr:      'MEL Açıklaması (TR)',
  equip_type_field_maintenance: 'Bakım Periyodu',
  equip_type_field_calibration: 'Kalibrasyon Gerekli',
  equip_type_section_basic:     'Temel Bilgiler',
  equip_type_section_maintenance: 'Bakım Ayarları',
  equip_type_section_fields:    'Özellik Şablonu',
  equip_type_add_field:         'Alan Ekle',

  // Ekipman tipi — dinamik alan
  equip_field_name:     'Alan Adı',
  equip_field_unit:     'Birim',
  equip_field_required: 'Zorunlu',

  // Demirbaş — alan etiketleri
  equip_field_barcode:          'Barkod',
  equip_field_serial:           'Seri No',
  equip_field_brand:            'Marka',
  equip_field_model:            'Model',
  equip_field_brand_model:      'Marka / Model',
  equip_field_status:           'Durum',
  equip_field_org:              'Bağlı Birim',
  equip_field_location_type:    'Konum Tipi',
  equip_field_mel:              'MEL',
  equip_field_mel_label:        'MEL Uyumlu',
  equip_field_purchase_date:    'Satın Alım Tarihi',
  equip_field_warranty:         'Garanti Bitiş',
  equip_field_price:            'Fiyat',
  equip_field_invoice_no:       'Fatura No',
  equip_field_last_maintenance: 'Son Bakım',
  equip_field_next_maintenance: 'Sonraki Bakım',
  equip_field_notes:            'Notlar',

  // Demirbaş — bölüm başlıkları
  equip_section_basic:       'Temel Bilgiler',
  equip_section_location:    'Konum ve Organizasyon',
  equip_section_purchase:    'Satın Alım',
  equip_section_maintenance: 'Bakım',
  equip_section_props:       'Özellikler',

  // Demirbaş — durum etiketleri
  equip_status_aktif:   'Aktif',
  equip_status_bakimda: 'Bakımda',
  equip_status_hurda:   'Hurda',
  equip_status_kayip:   'Kayıp',
  equip_status_gorevde: 'Görevde',

  // Demirbaş — konum
  equip_location_depo: 'Depoda',
  equip_location_grup: 'Grup/Araçta',

  // Demirbaş — diğer
  equip_change_status:  'Durum Değiştir',
  equip_props_none:     'Bu tip için özellik şablonu tanımlı değil.',

  // Ekipman — flash mesajları
  equip_flash_list_err:    'Ekipman listesi alınamadı: ',
  equip_flash_not_found:   'Ekipman kaydı bulunamadı.',
  equip_flash_save_err:    'Kayıt oluşturulamadı: ',
  equip_flash_update_err:  'Güncelleme başarısız: ',
  equip_flash_created:     (b) => `"${b}" başarıyla oluşturuldu.`,
  equip_flash_updated:     (b) => `"${b}" güncellendi.`,
  equip_flash_status_changed: (b, d) => `"${b}" durumu "${d}" olarak güncellendi.`,
  equip_flash_type_created:     (n) => `"${n}" tipi oluşturuldu.`,
  equip_flash_type_updated:     (n) => `"${n}" tipi güncellendi.`,
  equip_flash_toggled:          (n, a) => `"${n}" ${a ? 'aktif edildi' : 'pasife alındı'}.`,
  // route'lardaki alias'lar (geriye dönük uyumluluk)
  equip_type_flash_created:     (n) => `"${n}" tipi oluşturuldu.`,
  equip_type_flash_updated:     (n) => `"${n}" tipi güncellendi.`,
  equip_type_flash_activated:   (n) => `"${n}" aktif edildi.`,
  equip_type_flash_deactivated: (n) => `"${n}" pasife alındı.`,
  equip_flash_status_updated:   'Durum güncellendi.',

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
