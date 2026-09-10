# chilllabo.tokyo 本番移行・再開手順

2026-09-11 JST時点。本番切替はユーザー承認済みで、**設定保存とActions配信は完了、DNS反映とPages証明書の発行は確認中**です。[commit 9a829b5](https://github.com/Toraikura/chill-labo-next/commit/9a829b5)の[Actions 34503678380](https://github.com/Toraikura/chill-labo-next/actions/runs/34503678380)は成功しています。本番HTTPS公開の完了は、以下の反映待ちが解消してから記録します。

## 1. 設定済みの内容と、現在の反映状況

Xserverのサーバー管理画面で認証し、サーバー情報 `sv7415.xserver.jp`・IP `202.254.239.96` を確認済みです。確認したダッシュボードのメールアカウント数は0でした。これは画面上の件数で、外部サービスを含むメール利用状況や実際の送受信を検証したという意味ではありません。

次のDNS値を保存し、設定画面で読戻し確認しました。

| 名前 | 種別 | 保存した値 | TTL（秒） |
|---|---|---|---|
| `chilllabo.tokyo` | A | `185.199.108.153` | 300 |
| `chilllabo.tokyo` | A | `185.199.109.153` | 300 |
| `chilllabo.tokyo` | A | `185.199.110.153` | 300 |
| `chilllabo.tokyo` | A | `185.199.111.153` | 300 |
| `www.chilllabo.tokyo` | CNAME | `toraikura.github.io` | 300 |
| `chilllabo.tokyo` | MX | 優先度0、`sv7415.xserver.jp` | 3600 |
| `chilllabo.tokyo` | TXT／SPF | `v=spf1 +a:sv7415.xserver.jp +mx include:spf.sender.xserver.jp ~all` | 3600 |

維持したものは `ns1.xserver.jp`〜`ns5.xserver.jp`、既存のwildcard A（`*.chilllabo.tokyo` → `202.254.239.96`）、他ドメインの設定です。ドメイン登録先はお名前.com、権威DNSはXserverのままで、NS移管は行っていません。

旧MXはapex自体を参照していました。今回はサーバー情報を確認してMXをXserverホストへ切り替え、SPFから `+a:chilllabo.tokyo` を除去しています。

| 配信・反映の項目 | 現在の状態 |
|---|---|
| Actionsリポジトリ変数 | `SITE_ORIGIN=https://chilllabo.tokyo`、`SITE_INDEXABLE=true` 設定済み |
| Pages独自ドメイン | `cname=chilllabo.tokyo` 設定済み |
| DNSの観測 | ns1/ns2へのTCP・非再帰問い合わせで新しいA・MXを確認。Google公開DNSでは新旧が混在し、Cloudflare公開DNSは新しいA・wwwを返す |
| Pages証明書／HTTPS強制 | 証明書 `null`、HTTPS強制 `false`。発行・有効化待ち |

GitHubへの直接HTTPリクエスト（接続先 `185.199.108.153`、Host `chilllabo.tokyo`）では日英・robots・sitemap・4互換ページ・15素材の23 URLが200、本番bundleと全バイト一致しました。廃止記事と架空URLはcustom404本文付きのHTTP404です。DNSを経由した本番HTTPSの完了とは別の確認です。

DNS反映後も発行が始まらなかったため、GitHub公式手順に沿って独自ドメインを一度Remove／再登録しました。以後のDNSチェックには `NotServedByPagesError`、`InvalidDNSError` が現れています。Google公開DNSの新旧応答は末尾ドットの有無で固定されず、応答キャッシュの差が残っています。DNS設定を追加変更する根拠とはせず、伝播とGitHub側検証を継続します。

上表はこの時点の記録です。設定画面で新値が読めることと、すべてのDNSサーバーへ反映されたことは別です。再開時はログインや変数設定からやり直さず、DNSと証明書の状態確認から進めます。

## 2. 本番用ファイルと旧URL対応を確認

```sh
npm run build:production
npm run check
npm run package
```

`build:production` は `SITE_ORIGIN=https://chilllabo.tokyo`、`SITE_INDEXABLE=true` を指定して生成するローカル用入口です。DNSやPages設定は変更しません。日英HTMLの `index,follow`、自己参照canonical・相互hreflang・OG URL、本番sitemap、旧URLの静的検査はPASS済みです。

`robots.txt` は一般の検索クロールを許可し、`GPTBot` は `Disallow: /`、本番sitemapを案内します。sitemapの掲載URLは `/` と `/en/` です。旧URL用ファイルも `scripts/package.mjs` が `_site/` に含めます。

| 旧経路 | 移行先 | 根拠 |
|---|---|---|
| `/sakebar_chilllaboakasaka` | `/en/` | 既存の英語店舗ページ |
| `/archives/129` | `/` | 現在は移転・公式サイトへの案内 |
| `/archives/132` | `/en/` | 現在は英語公式サイトへの案内 |
| `/page/2` | `/` | 日本語店舗TOPの重複ページ |

`scripts/legacy.mjs` はcanonical・可視リンクとJavaScriptによる移動を生成し、JavaScript無効時は即時meta refreshを使います。JavaScript有効時の旧アンカー対応は `prices→pricing`、`nearby-hotels→access`、`experience→experience`、`food→courses`、`hours→access`、`about→discover`、`faq→faq`。未対応のアンカーは引き継ぎません。

**これらは静的互換ページで、HTTP 301ではありません。** GitHub Pages単体では任意の旧URLに真の301転送を設定できません。旧記事 `/archives/689`、`/archives/709`、`/archives/738`、`/archives/428` 等には同等の新記事がないため、通常の404とします。無関係な記事をTOPへ一律転送しません。

画像・フォントは同じサイト内から配信し、旧WordPress画像への依存は解消済みです。旧4時間プランは復活させず、通常1時間3,300円／自動延長1時間1,100円と、料理付き2時間6,600円／3時間8,800円を分けます。価格は各1人税込。公開前に営業時間・住所・電話・コース条件も照合します。

本番用bundleとDNS観測記録はリポジトリ外の作業出力にも準備済みです。別環境では上記コマンドから生成できるため、特定のローカル出力パスを前提にしません。

## 3. DNS反映・証明書発行の確認から再開する

1. Xserverの5つの権威NSと外部DNSで、apex A・www CNAME・MX・SPFを保存値と照合する。旧情報が残る間は伝播状況を記録して再確認する。待機だけを理由にNSやメール設定を変更し直さない。
2. Pagesの独自ドメイン判定・証明書発行を確認し、証明書が利用可能になってからHTTPS強制を有効にする。apex／wwwのHTTPSと実際の遷移先を確認する。
3. 本番 `/`・`/en/` の応答、配信内容と主要操作、旧URL・404を下記の範囲で確認する。
4. 確認時刻・配信コミット・DNS／TLS／HTTPS強制の結果を追記する。未確認の項目を残したまま全項目完了とはしない。

再デプロイが必要な場合も、設定済みの本番用リポジトリ変数を維持します。環境変数なしのローカル `npm run build` は従来のPages確認用origin・noindexになるため、ローカル確認と本番配信を区別してください。

## 4. 公開後の確認

- 本番 `/`・`/en/` の応答と表示、証明書、canonical・相互hreflang・robots・sitemapを配信された内容で確認する。BarOrPub構造化データと日英本文の店舗情報を一致させる。
- 4経路の互換案内、旧アンカー、存在しない記事のHTTP 404を確認する。JavaScript無効時の移動と可視リンクも確認する。
- 画像・フォントが本番配下から取得でき、旧WordPressへの通信が不要なことを確認する。メニュー、料理の展開、予約文コピー、言語切替、固定CTA、外部サイトから戻る操作を日英で確認する。
- 通常予約は[Instagram公式プロフィール](https://www.instagram.com/CHILLLABOTOKYO/)、コースは[TableCheck日本語入口](https://www.tablecheck.com/ja/chilllabo-tokyo)、道順はMaps、電話は `tel:+818087008528`。英語ページはコースの日本語詳細へ進むことを明記する。クリックやDM表示を予約成立とは扱わない。
- メールの実送受信は未検証。利用中のメールがある場合は承認された方法で確認し、Web表示の成功だけでメール維持を完了扱いにしない。
- Search Consoleで本番sitemap・取得・インデックス・正規URLを確認する。検索順位・AIの引用・予約／売上への効果は別途計測する。

Chromeのモバイル幅QAと実機iPhone Safariは別です。実機iPhone、検索順位、AI引用、予約成立・売上への効果は未検証。架空のレビュー・評価点は使わず、口コミはGoogle Mapsへ案内します。GA4/GTM等への送信設定はなく、解析導入を済ませたとは報告しません。

## 5. 他サイトとの接続は別途

Chill LaboからSATトップ、PLAYGROUNDの `/aroma-lab/`・酒米への出発リンクは実装済みです。他サイト側のChill Laboへの帰り道、PLAYGROUNDのSATリンク正式ドメイン統一は、このリポジトリでは変更していません。

1Fは準備中を維持します。開業・在庫・販売価格、第三の酒の未公開FIELD記録は推測して有効化しません。
