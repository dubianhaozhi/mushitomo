# むしとも — 虫嫌い克服アプリ(自分用MVP)

段階的曝露 + 嫌悪対策(名前・役割・屋外背景) + 触覚 + モデリング動画を、1本の物語(クモの世話係見習い)としてつないだスマホWebアプリ。

## 動かす
ビルド不要の静的サイト。カメラ・AR・読み上げは **HTTPS か localhost** が必要。

- Mac でローカル確認: `npx serve .` → http://localhost:3000
- スマホで使う(推奨): Vercel / Netlify Drop / GitHub Pages / Cloudflare Pages にこのフォルダをそのまま置く。
- iPhone は Safari で開き「ホーム画面に追加」するとPWAとして使える。

## 構成
- `index.html` / `app.css` / `app.js` … 画面とフロー(基準値→Lv1〜11→実物→再計測)
- `levels.js` … レベル定義・知識カード・予想クイズ・SVGイラスト
- `spider3d.js` … three.js の手続き的ハエトリグモ、Lv3の静止ビュー、Lv7〜11のAR(WebXR / カメラ透過フォールバック)
- `vendor/three.module.js` … three.js r170 (MIT)
- 実写写真・動画は Wikimedia Commons API から実行時に取得(要通信)。YouTube URL は設定から登録。

## AR の挙動
- Android Chrome: WebXR(immersive-ar + hit-test)。床をタップして配置。
- iOS Safari: WebXR非対応のためカメラ映像 + 傾きセンサーの疑似AR。初回に動作センサーの許可ダイアログが出る。
- カメラ不可の場合は緑背景で代替。

## データ
localStorage(`mushitomo.v1`)。設定からJSON書き出し可。
