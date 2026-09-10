# Chill Labo Akasaka — OPEN HOUSE

実写を中心にした日英の静的サイト。2Fの飲み比べ・料金・予約を入口に、料理付きコース、準備中の1F Bottle Shop、SAKE ART TOKYO、FERMENTATION PLAYGROUNDへつなぎます。

GitHub Pagesの確認用URLは `https://toraikura.github.io/chill-labo-next/`。コードの実装状態と、Actionsでのデプロイ成功・公開画面の確認は別です。既存ドメイン `chilllabo.tokyo`、WordPress、お名前.comのDNSは今回変更していません。

## 編集とビルド

Node.js 22以上を使用。ビルドはNode標準機能のみで動作します。

```sh
npm run build
npm run check
npm run package
```

- `scripts/build.mjs`：日英共通の本文・リンク・メタ情報の編集元。`index.html`、`en/index.html`、`404.html`、`robots.txt`、`sitemap.xml`を生成します。生成HTMLだけの手修正は次のビルドで失われます。
- `assets/css/styles.css`：レイアウト・配色・レスポンシブ表示。
- `assets/js/site.js`：メニュー、閲覧位置を引き継ぐ言語切替、予約文のコピー、スマホ固定CTA。
- `assets/images/`、`assets/fonts/`：同じサイトから配信する画像・フォント。提供実写とSATラベルをローカルWebPで使用し、WordPressの画像URLへの依存は解消しています。
- `scripts/check.mjs`：日英・H1・価格・構造化データ・アンカー・ローカル素材などの静的検査。
- `scripts/package.mjs`：公開ファイルだけを `_site/` に集約。既存の `_site/` は作り直します。

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

既定ビルドはGitHub Pages確認用です。

| 設定 | 既定値／動作 |
|---|---|
| `SITE_ORIGIN` | `https://toraikura.github.io/chill-labo-next` |
| `SITE_INDEXABLE` | 未指定時は検索対象外。日英HTMLに `noindex,follow` |
| canonical / hreflang | 設定したoriginから日英の自己参照canonicalと相互の言語URLを生成 |
| robots.txt | `GPTBot` は `Disallow: /`、その他は `Allow: /`。本番の検索許可時のみSitemap行を追加 |
| sitemap.xml | 設定したoriginの `/` と `/en/` を生成 |

GitHubのプロジェクト配下の `robots.txt` を、ドメインルートのクローラー制御と同一視しません。確認用公開の検索除外はHTMLの `noindex` で示します。GoogleやAIサービスの到達・掲載・引用を確認したという意味ではありません。

`.github/workflows/pages.yml` はmainへのpush／手動実行で、Node 22によるbuild・check・packageの後に `_site/` をGitHub Pagesへ配信します。現在のworkflowは上記既定値を使用。本番ドメインへ移す際はローカルの環境変数だけでなく、workflowのビルド環境も変更します。[移行手順](GO_LIVE.md)を参照してください。

## 検証の範囲

静的検査はブラウザー・実機の操作確認ではありません。ChromeでのQA・公開URLの確認は実行時の結果を別途記録します。実機iPhone、検索順位、AIによる引用、予約成立・売上への効果は未検証です。

架空のレビューや評価点は載せず、口コミはGoogle Mapsへ案内します。解析SDK・GA4・GTMは読み込んでいません。既存の `window.dataLayer` がある場合だけ外部リンククリックを追加する補助処理があり、現在のサイト自体には解析先への送信設定がありません。
