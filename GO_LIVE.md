# chilllabo.tokyo 本番移行・再開手順

2026-09-11時点。本番移行はユーザー許可済み、旧版の復旧用バックアップは不要という指定です。現在は **Xserverへのログイン待ち**。お名前.com Naviにはログイン済みですが、DNS・Pagesの独自ドメイン・HTTPSはまだ変更していません。本番向けローカル生成と静的検査のPASSを、公開完了とは扱いません。

## 1. ログイン後はXserverのDNS・メール確認から再開

公開DNSの確認値は次のとおりです。切替直前にも再照合します。

| 項目 | 確認値 |
|---|---|
| 権威NS | `ns1.xserver.jp`〜`ns5.xserver.jp` |
| `chilllabo.tokyo` A | `202.254.239.96` |
| `www.chilllabo.tokyo` A | `202.254.239.96` |
| MX | 優先度 `0`、宛先 `chilllabo.tokyo` |
| SPF TXT | `v=spf1 +a:sv7415.xserver.jp +a:chilllabo.tokyo +mx include:spf.sender.xserver.jp ~all` |
| `sv7415.xserver.jp` A | `202.254.239.96` |

ドメイン登録先がお名前.comでも、現在の権威DNSはXserverです。今回のWeb移行のためにNSをお名前.comへ変更する必要はありません。未知のメール・認証レコードを欠落させるようなNS移管は行いません。

Xserverのサーバーパネルで `chilllabo.tokyo` を選び、次を確認します。

- DNSレコード一覧とTTL。A/AAAA/CNAMEだけでなく、MX、SPF、DKIM、DMARC、メール用ホスト、認証用TXT、CAA等の既存設定を確認する。
- 実際に利用中のメールアカウント・転送・送受信サーバーと、Xserverで維持するかどうか。公開MXの存在だけでは利用中かどうかは確定できない。
- **現在のMXはapex自体を指すため、そのAをPagesへ変えるとメール配送先も変わる。** メールを維持する場合は、Xserverが案内する有効なメール宛先を確認してMX等を整えてからWeb用Aを切り替える。`sv7415.xserver.jp` が同じIPという理由だけで、新しいMX宛先に採用しない。
- SPFの `+a:chilllabo.tokyo` と `+mx` もWeb切替・MX変更の影響を受ける。利用する送信元に合わせて調整し、SPFを重複作成しない。DKIM/DMARC等の既存設定を保持する。

全面バックアップは作らず、切替対象と保持対象のDNS設定を確認して進めます。認証情報や私的メール本文を作業記録に残しません。

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

## 3. メール維持を確認した後、PagesとDNSを切り替える

1. GitHub Pagesの公開元とActionsの状態を確認し、独自ドメインを `chilllabo.tokyo` に設定する。DNSによる所有確認を求められた場合は、表示されたTXTをXserverへ追加する。
2. リポジトリのActions変数を `SITE_ORIGIN=https://chilllabo.tokyo`、`SITE_INDEXABLE=true` に設定する。workflowは既に `vars.SITE_ORIGIN` / `vars.SITE_INDEXABLE` を参照する構成。**現在は変数未設定なので、未設定のままならGitHub確認用origin・noindexで生成される。**
3. workflowを実行し、本番用 `_site/` が配信されたことを確認する。ローカルの `build:production` だけではActionsの設定は変わらない。
4. Xserver側で、確認したメール設定を保ちながらWeb用のapex／wwwレコードをPagesの案内に合わせて変更する。既存AAAA等が別のWeb配信先を残さないかも確認する。具体的なPages向け値は切替時の設定画面・公式案内で照合する。
5. 権威DNSと外部からの名前解決、Pagesのドメイン判定・証明書発行を確認する。証明書が利用可能になってからHTTPS強制を有効にし、apex／wwwの実際の遷移を検証する。DNS保存直後を伝播・HTTPS完了とは扱わない。

本番ドメイン設定・リポジトリ変数・DNS・HTTPSの各段階を個別に記録します。現在はいずれも切替完了を報告できる段階ではありません。

## 4. 公開後の確認

- 本番 `/`・`/en/` の応答と表示、証明書、canonical・相互hreflang・robots・sitemapを配信された内容で確認する。BarOrPub構造化データと日英本文の店舗情報を一致させる。
- 4経路の互換案内、旧アンカー、存在しない記事のHTTP 404を確認する。JavaScript無効時の移動と可視リンクも確認する。
- 画像・フォントが本番配下から取得でき、旧WordPressへの通信が不要なことを確認する。メニュー、料理の展開、予約文コピー、言語切替、固定CTA、外部サイトから戻る操作を日英で確認する。
- 通常予約は[Instagram公式プロフィール](https://www.instagram.com/CHILLLABOTOKYO/)、コースは[TableCheck日本語入口](https://www.tablecheck.com/ja/chilllabo-tokyo)、道順はMaps、電話は `tel:+818087008528`。英語ページはコースの日本語詳細へ進むことを明記する。クリックやDM表示を予約成立とは扱わない。
- 利用中のメールがある場合は、承認された方法で実際の送受信も確認する。Web表示の成功だけでメール維持を完了扱いにしない。
- Search Consoleで本番sitemap・取得・インデックス・正規URLを確認する。検索順位・AIの引用・予約／売上への効果は別途計測する。

Chromeのモバイル幅QAと実機iPhone Safariは別です。実機iPhone、検索順位、AI引用、予約成立・売上への効果は未検証。架空のレビュー・評価点は使わず、口コミはGoogle Mapsへ案内します。GA4/GTM等への送信設定はなく、解析導入を済ませたとは報告しません。

## 5. 他サイトとの接続は別途

Chill LaboからSATトップ、PLAYGROUNDの香り・米への出発リンクは実装済みです。他サイト側のChill Laboへの帰り道、PLAYGROUNDのSATリンク正式ドメイン統一は、このリポジトリでは変更していません。

1Fは準備中を維持します。開業・在庫・販売価格、第三の酒の未公開FIELD記録は推測して有効化しません。
