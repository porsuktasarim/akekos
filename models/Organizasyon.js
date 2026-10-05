const mongoose = require('mongoose');

// İl plaka kodları
const IL_KODLARI = {
  'Adana':1,'Adıyaman':2,'Afyonkarahisar':3,'Ağrı':4,'Amasya':5,
  'Ankara':6,'Antalya':7,'Artvin':8,'Aydın':9,'Balıkesir':10,
  'Bilecik':11,'Bingöl':12,'Bitlis':13,'Bolu':14,'Burdur':15,
  'Bursa':16,'Çanakkale':17,'Çankırı':18,'Çorum':19,'Denizli':20,
  'Diyarbakır':21,'Edirne':22,'Elazığ':23,'Erzincan':24,'Erzurum':25,
  'Eskişehir':26,'Gaziantep':27,'Giresun':28,'Gümüşhane':29,'Hakkari':30,
  'Hatay':31,'Isparta':32,'Mersin':33,'İstanbul':34,'İzmir':35,
  'Kars':36,'Kastamonu':37,'Kayseri':38,'Kırklareli':39,'Kırşehir':40,
  'Kocaeli':41,'Konya':42,'Kütahya':43,'Malatya':44,'Manisa':45,
  'Kahramanmaraş':46,'Mardin':47,'Muğla':48,'Muş':49,'Nevşehir':50,
  'Niğde':51,'Ordu':52,'Rize':53,'Sakarya':54,'Samsun':55,
  'Siirt':56,'Sinop':57,'Sivas':58,'Tekirdağ':59,'Tokat':60,
  'Trabzon':61,'Tunceli':62,'Şanlıurfa':63,'Uşak':64,'Van':65,
  'Yozgat':66,'Zonguldak':67,'Aksaray':68,'Bayburt':69,'Karaman':70,
  'Kırıkkale':71,'Batman':72,'Şırnak':73,'Bartın':74,'Ardahan':75,
  'Iğdır':76,'Yalova':77,'Karabük':78,'Kilis':79,'Osmaniye':80,'Düzce':81,
};

// Kademe tanımları
// 0: Bakanlık   — slug yok
// 1: Taşra      — slug yok
// 2: İl/Bölge   — slug yok
// 3: AKE        — slug: [il 2h][ake sira 2h][00]
// 4: Alt Birim  — slug: [il 2h][ake sira 2h][alt sira 2h]
const KADEME = ['bakanlik', 'tasra', 'il_bolge', 'ake', 'alt_birim'];

const KADEME_ETIKET = {
  bakanlik:  'Bakanlık',
  tasra:     'Genel Müdürlük / Taşra',
  il_bolge:  'İl / Bölge',
  ake:       'AKE (Arama Kurtarma Ekibi)',
  alt_birim: 'Alt Birim',
};

const OrgSchema = new mongoose.Schema({
  ad:        { type: String, required: true, trim: true },
  kademe:    { type: String, enum: KADEME, required: true },
  ust:       { type: mongoose.Schema.Types.ObjectId, ref: 'Organizasyon', default: null },

  // Merkez adres ili — il_bolge, ake, alt_birim için zorunlu
  merkezIl:  {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        const zorunlu = ['il_bolge', 'ake', 'alt_birim'];
        if (zorunlu.includes(this.kademe)) return !!v;
        return true;
      },
      message: 'Merkez adres ili seçilmesi zorunludur.',
    },
  },

  // Slug: sadece AKE (kademe 3) ve Alt Birim (kademe 4) için otomatik atanır
  // Format: [il 2h][ake sira 2h][alt sira 2h]
  // Taşra kodu slug'a dahil DEĞİLDİR.
  // AKE'ler il bazında sıralanır (farklı taşra birimine bağlı olsalar bile aynı havuz).
  slug:      { type: String, trim: true, unique: true, sparse: true },

  adres:     { type: String, trim: true },
  telefon:   { type: String, trim: true },
  email:     { type: String, trim: true, lowercase: true },
  aciklama:  { type: String, trim: true },
  aktif:     { type: Boolean, default: true },
}, { timestamps: true });

// ---------- Otomatik slug üretimi ----------
OrgSchema.pre('save', async function(next) {
  // Slug gerektirmeyen kademeler
  if (['bakanlik', 'tasra', 'il_bolge'].includes(this.kademe)) return next();

  // Zaten slug varsa dokunma (elle set edilmiş veya daha önce atanmış)
  if (this.slug) return next();

  const Org = this.constructor;

  if (this.kademe === 'ake') {
    // AKE slug = [il plaka 2h][ake sira 2h][00]
    // Üst zincirinden il bul (il_bolge → il)
    const il = await _ustildenIlBul(Org, this.ust);
    const ilKodu = await _ilKoduBul(Org, il, this.merkezIl);

    // Aynı il altındaki AKE'lerin slug'larına bak, il koduna göre filtrele
    const ilPrefix = String(ilKodu).padStart(2, '0');
    const mevcutlar = await Org.find({
      kademe: 'ake',
      slug:   { $regex: `^${ilPrefix}` },
    }).sort({ slug: 1 });

    // Orta 2 hane (ake sira) bul — 01'den başla
    let sira = 1;
    const kullanilan = mevcutlar.map(o => parseInt(o.slug.slice(2, 4)));
    while (kullanilan.includes(sira)) sira++;

    const akeSira = String(sira).padStart(2, '0');
    this.slug = ilPrefix + akeSira + '00';

  } else if (this.kademe === 'alt_birim') {
    // Alt birim slug = ake slug'unun ilk 4 hanesi + [alt sira 2h]
    const akeOrg = await Org.findById(this.ust);
    if (!akeOrg || akeOrg.kademe !== 'ake') {
      return next(new Error('Alt birimin üstü bir AKE olmalıdır'));
    }
    if (!akeOrg.slug) {
      return next(new Error('Üst AKE henüz slug almamış'));
    }

    const prefix4 = akeOrg.slug.slice(0, 4); // [il 2h][ake sira 2h]
    const kardesler = await Org.find({
      kademe: 'alt_birim',
      slug:   { $regex: `^${prefix4}` },
      _id:    { $ne: this._id },
    }).sort({ slug: 1 });

    let sira = 1;
    const kullanilan = kardesler.map(o => parseInt(o.slug.slice(4, 6)));
    while (kullanilan.includes(sira) || sira === 0) sira++;

    const altSira = String(sira).padStart(2, '0');
    this.slug = prefix4 + altSira;
  }

  next();
});

// Üst zincirini tarayarak il_bolge kademesindeki üstü bul
async function _ustildenIlBul(Org, ustId) {
  if (!ustId) return null;
  const ust = await Org.findById(ustId);
  if (!ust) return null;
  if (ust.kademe === 'il_bolge') return ust;
  return _ustildenIlBul(Org, ust.ust);
}

// İl kodunu belirle: merkezIl > üst il_bolge.merkezIl > 0
async function _ilKoduBul(Org, ilOrg, merkezIl) {
  if (merkezIl && IL_KODLARI[merkezIl]) return IL_KODLARI[merkezIl];
  if (ilOrg && ilOrg.merkezIl && IL_KODLARI[ilOrg.merkezIl]) return IL_KODLARI[ilOrg.merkezIl];
  return 0;
}

OrgSchema.statics.IL_KODLARI    = IL_KODLARI;
OrgSchema.statics.KADEME        = KADEME;
OrgSchema.statics.KADEME_ETIKET = KADEME_ETIKET;

module.exports = mongoose.model('Organizasyon', OrgSchema);
