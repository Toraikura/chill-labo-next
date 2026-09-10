# Chill Labo Akasaka — OPEN HOUSE

実写を中心にした日英の静的サイト。2Fの飲み比べ・料金・予約を入口に、料理付きコース、準備中の1F Bottle Shop、SAKE ART TOKYO、FERMENTATION PLAYGROUNDへつなぎます。

本番の配信先は `https://chilllabo.tokyo/`。2026-09-11 JST時点で、ユーザー承認のもと本番用Actions変数、Pagesの独自ドメイン、XserverのDNS設定を保存・再確認済みです。[commit 9a829b5](https://github.com/Toraikura/chill-labo-next/commit/9a829b5)の[Actions 34503678380](https://github.com/Toraikura/chill-labo-next/actions/runs/34503678380)は成功しています。

**現在はDNS反映とPages証明書の発行待ちです。** 権威NS間で旧情報が残り、Pagesの証明書は未発行、HTTPS強制は未有効です。設定保存・Actions成功を、本番HTTPS公開の完了とは扱いません。次の確認箇所は[GO_LIVE.md](GO_LIVE.md)にまとめています。従来のPages URLは `https://toraikura.github.io/chill-labo-next/` です。

## 編集とビルド

Node.js 22以上を使用。ビルドはNode標準機能のみで動作します。

```sh
npm run build
npm run check
npm run package
```

- `scripts/build.mjs`：日英共通の本文・リンク・メタ情報の編集元。`index.html`、`en/index.html`、`404.html`、`robots.txt`、`sitemap.xml`と旧URLの互換案内を生成します。生成HTMLだけの手修正は次のビルドで失われます。
- `scripts/build-production.mjs`：本番ドメインと検索許可を指定するローカル生成用入口。`npm run build:production` で実行でき、DNSやPagesの設定は変更しません。
- `scripts/legacy.mjs`：旧英語・旧案内ページなど4経路の静的互換ページを生成します。HTTP 301転送ではありません。
- `assets/css/styles.css`：レイアウト・配色・レスポンシブ表示。
- `assets/js/site.js`：メニュー、閲覧位置を引き継ぐ言語切替、予約文のコピー、スマホ固定CTA。
- `assets/images/`、`assets/fonts/`：同じサイトから配信する画像・フォント。提供実写とSATラベルをローカルWebPで使用し、WordPressの画像URLへの依存は解消しています。
- `scripts/check.mjs`：日英・H1・価格・構造化データ・アンカー・ローカル素材・旧URL・本番検索設定などの静的検査。
- `scripts/package.mjs`：互換ページを含む公開ファイルだけを `_site/` に集約。既存の `_site/` は作り直します。

ローカル表示はビルド後に次を実行し、`http://localhost:8080/` と `http://localhost:8080/en/` を開きます。

```sh
python3 -m http.server 8080
```

## 表示内容と予約先

- 通常の飲み比べ：最初の1時間3,300円／自動延長1時間1,100円、各1人税込。旧4時間プランは廃止し、掲載していません。
- 料理付き：2時間6,600円／3時間8,800円、各1人税込。2〜10名、月〜金、2日前までに予約。料理は人数分を大皿で提供し、10名は電話問い合わせ。2時間だけで確認した追加料理の締切・退店案内を3時間へ流用しません。
- 通常予約は[Instagram公式プロフィール](https://www.instagram.com/CHILLLABOTOKYO/)からDMへ。直DMリンクではありません。電話・[Google Maps](https://maps.app.goo.gl/GPKRcTt7F3grPJck7)も併記します。
- コースは[TableCheckの日本語店舗入口](https://www.tablecheck.com/ja/chilllabo-tokyo)へ。英語ページでは日本語のコース詳細へ進むことを明記。クリック・DM表示を予約成立と扱いません。
- 1Fは準備中。営業開始・在庫・商品価格は表示しません。第三の酒は自分たちで田植え・稲刈りをした米を使用するという事実まで。未公開の制作記録へのリンクは作りません。
- SATのトップページとPLAYGROUNDの香り・米への出発リンクを実装。他サイト側からChill Laboへの帰り道の追加・修正は別作業です。

## 検索と配信設定

環境変数なしのローカルビルドはGitHub Pages確認用です。本番のActionsは、設定済みのリポジトリ変数を使用します。

| 設定 | 既定値／動作 |
|---|---|
| `SITE_ORIGIN` | `https://toraikura.github.io/chill-labo-next` |
| `SITE_INDEXABLE` | 未指定時は検索対象外。日英HTMLに `noindex,follow` |
| canonical / hreflang | 設定したoriginから日英の自己参照canonicalと相互の言語URLを生成 |
| robots.txt | `GPTBot` は `Disallow: /`、その他は `Allow: /`。本番の検索許可時のみSitemap行を追加 |
| sitemap.xml | 設定したoriginの `/` と `/en/` を生成 |

GitHubのプロジェクト配下の `robots.txt` を、ドメインルートのクローラー制御と同一視しません。確認用公開の検索除外はHTMLの `noindex` で示します。GoogleやAIサービスの到達・掲載・引用を確認したという意味ではありません。

`.github/workflows/pages.yml` はmainへのpush／手動実行で、Node 22によるbuild・check・packageの後に `_site/` をGitHub Pagesへ配信します。リポジトリ変数は `SITE_ORIGIN=https://chilllabo.tokyo`、`SITE_INDEXABLE=true` に設定済み。Pagesの独自ドメインも `chilllabo.tokyo` に設定済みです。変数が未設定の場合に限り、上記の確認用設定へ戻ります。

本番用のローカル確認は次のとおりです。Actions側の変数設定やドメイン切替とは別の操作です。

```sh
npm run build:production
npm run check
npm run package
```

再デプロイ時も本番用のリポジトリ変数を維持します。GitHub確認用originのまま検索許可する指定はビルド側で拒否します。

## 旧URLとDNS・HTTPSの反映待ち

| 旧経路 | 互換案内先 |
|---|---|
| `/sakebar_chilllaboakasaka` | `/en/` |
| `/archives/129` | `/` |
| `/archives/132` | `/en/` |
| `/page/2` | `/` |

互換ページはcanonical・可視リンク・JavaScriptによる移動を備え、JavaScript無効時は即時meta refreshで移動します。既知の旧アンカーもJavaScriptで対応付けます。その他の旧記事には対応ページを作らず、通常の404を返す方針です。GitHub Pages単体の静的案内をHTTP 301と呼びません。

ドメイン登録はお名前.com、権威DNSは維持した `ns1.xserver.jp`〜`ns5.xserver.jp` です。Xserver認証とサーバー情報の確認後、apexのAをPagesの4アドレス、wwwを `toraikura.github.io` のCNAMEへ変更しました。MXは `sv7415.xserver.jp` へ切り替え、SPFからWeb用apexのA参照を除去しています。設定画面の保存後読戻しは完了し、NS・既存wildcard A・他ドメインは維持しています。

再開時は設定を重ねて変更せず、権威NS／外部DNSの反映、Pagesの証明書発行を確認します。証明書が利用可能になったらHTTPS強制と本番URLを確認してください。DNSの正確な設定値・観測状態・残りの手順は[GO_LIVE.md](GO_LIVE.md)を参照してください。

## 検証の範囲

本番向けローカル生成、indexability・メタ情報・sitemap・旧URLの静的検査はPASS済みで、本番設定のActionsも成功しています。本番ドメインのDNS反映・TLS・配信内容の最終確認は継続中です。ChromeでのQA・公開URLの確認は実行時の結果を別途記録します。実機iPhone、検索順位、AIによる引用、予約成立・売上への効果は未検証です。

架空のレビューや評価点は載せず、口コミはGoogle Mapsへ案内します。解析SDK・GA4・GTMは読み込んでいません。既存の `window.dataLayer` がある場合だけ外部リンククリックを追加する補助処理があり、現在のサイト自体には解析先への送信設定がありません。
