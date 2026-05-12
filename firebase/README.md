# Firebase (Konum)

## Önce konsolda yapılacaklar

1. [Firebase Console](https://console.firebase.google.com/) → proje **konum-f9191**
2. **Authentication** → Sign-in method → **E-posta / Şifre** etkinleştir
3. **Firestore Database** oluştur (production modda başla, kuralları bu repodan deploy et)
4. **Storage** oluştur (isteğe bağlı; kurallar `uploads/{uid}/...` için hazır)

## Kurallar ve indeksler

Depo kökünden:

```bash
firebase deploy --only firestore:rules,firestore:indexes,storage
```

İlk `collectionGroup` sorgusu hata verirse konsoldaki bağlantıdan eksik indeksi oluştur veya `firestore.indexes.json` deploy et.

## Web sitesi (çalışan link)

Statik web çıktısı `mobile/dist` içine üretilir:

```bash
cd mobile
npm run export:web
cd ..
firebase deploy --only hosting
```

Yayın sonrası varsayılan adres: **https://konum-f9191.web.app** (veya `.firebaseapp.com`).

> Not: `firebase login` ile oturum açman ve projede Hosting’i etkinleştirmen gerekir. Bu adımlar olmadan link oluşmaz.
