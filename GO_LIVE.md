# chilllabo.tokyo 本番公開・運用記録

2026-09-11 08:57 JST、**日英サイトの本番HTTPS公開と、HTTP／wwwからの正規URLへの転送を確認しました。** 通常のDNS解決と証明書検証を使って実測しています。本番HTML・素材の確認対象は[commit 23934ff](https://github.com/Toraikura/chill-labo-next/commit/23934ff)、[Actions 34514025089](https://github.com/Toraikura/chill-labo-next/actions/runs/34514025089)の配信です。最終確認の詳細と、実機・検索等の未検証範囲を以下に記録します。

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
| DNSの観測 | 通常DNSの接続先も新しいGitHub側へ切替済み。以前の新旧混在を最新状態として扱わない |
| GitHubドメイン判定 | 03:00・03:18 JST、apex／wwwとも `is_valid=true`、`is_served_by_pages=true`、`is_https_eligible=true`、`reason=null` |
| Pages証明書／TLS | 08:47 JST、通常DNS＋証明書検証ありのTLSで日英200。SANは `chilllabo.tokyo` と `www.chilllabo.tokyo` に一致 |
| HTTPS強制 | 08:50頃、`https_enforced=true` を保存・読戻し済み |
| 確認済みの転送 | `https://www.chilllabo.tokyo/` → `https://chilllabo.tokyo/` は301。HTTP `/en/` → HTTPSも301 |
| HTTPルート | 08:57:35 JST、`http://chilllabo.tokyo/` は301 → `https://chilllabo.tokyo/` → 200。取得時Age 0 |
| 自動化 `chill-labo` | `PAUSED`。公開確認完了後も停止を維持 |

通常DNSと検証ありTLSで取得した日英HTML・全15素材は本番bundleと全バイト一致しました。robots・sitemap・canonical・hreflang、旧4経路の静的互換、廃止4記事のHTTP 404、SAT・PLAYGROUND・AROMA LABO・RICE LINEAGEへの到達も確認済みです。08:57:35 JSTにはHTTPルートの古い200キャッシュも解消し、HTTPSへの301転送を確認しました。

Remove／再登録は、DNS反映前の01:51頃に1回、DNS判定成功後も18分以上発行が始まらなかった新しい観測を根拠に03:18に1回、通算2回実施しました。03:18の操作後も `cname=chilllabo.tokyo` とworkflowを維持し、DNS・メール設定は変更していません。以前の `NotServedByPagesError`／`InvalidDNSError` は、03:00・03:18の正常判定で解消を確認した過去の状態です。

証明書は03:19頃に `null` から `state:new` へ進み、当時のdescriptionは `This domain was recently added. The certificate request process will begin shortly.` でした。03:18のSAN不一致と03:19の発行要求開始待ちは過去の状態で、08:47のTLS成功により解消を確認しています。Remove／再登録は追加で行わず、ログイン・DNS・本番変数・証明書設定からやり直しません。

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

画像・フォントは同じサイト内から配信し、旧WordPress画像への依存は解消済みです。旧4時間プランは復活させず、通常1時間3,300円／自動延長1時間1,100円と、料理付き2時間6,600円／3時間8,800円を分けています。価格は各1人税込。今後の店舗情報更新でも営業時間・住所・電話・コース条件を日英で揃えます。

本番用bundleとDNS観測記録はリポジトリ外の作業出力にも準備済みです。別環境では上記コマンドから生成できるため、特定のローカル出力パスを前提にしません。

## 3. 公開完了の実測

2026-09-11 08:57:35 JST、通常DNSと有効なTLS検証で次の転送を確認しました。IP固定や証明書検証の無効化は使用していません。

| 入口 | 確認した遷移 |
|---|---|
| `http://chilllabo.tokyo/` | 301 → `https://chilllabo.tokyo/` → 200 |
| `http://chilllabo.tokyo/en/` | 301 → `https://chilllabo.tokyo/en/` → 200 |
| `http://www.chilllabo.tokyo/` | 301 → HTTP apex → 301 → HTTPS apex → 200 |
| `https://www.chilllabo.tokyo/` | 301 → HTTPS apex → 200 |
| `https://www.chilllabo.tokyo/en/` | 301 → HTTPS apex `/en/` → 200 |
| 従来のGitHub PagesプロジェクトURL | 301 → `https://chilllabo.tokyo/` → 200 |

HTTPS強制保存直後はHTTPルートだけ旧200応答が最大600秒の配信キャッシュに残りました。設定の保存だけで完了とせず、実際に301へ切り替わったことを確認しました。証明書は再登録後長時間 `new` のままでしたが、追加のDNS変更や3回目の再登録をせず発行済みに進みました。発行が遅れた原因は未特定です。

ブラウザーで旧英語URL `sakebar_chilllaboakasaka#prices` から `/en/#pricing`、旧案内 `/archives/129/` から日本語トップへの実移動も確認しました。これら旧コンテンツの案内は、HTTPのドメイン正規化転送とは別の静的互換処理です。

自動確認 `chill-labo` は `PAUSED` のまま停止を維持します。証明書発行待ちの自動監視を再開する必要はありません。

再デプロイが必要な場合も、設定済みの本番用リポジトリ変数を維持します。環境変数なしのローカル `npm run build` は従来のPages確認用origin・noindexになるため、ローカル確認と本番配信を区別してください。

## 4. 確認済みの操作と、検証の範囲

実ブラウザーでは390px幅の日英トップ表示、画像5枚の読み込み、閲覧位置を引き継ぐ日英切替、メニュー開閉とアクセスへの移動、2時間コースの料理details展開、英語予約文コピーの成功表示を確認しました。IABの `clipboard.readText` は空だったため、クリップボード内容の読戻し成功までは主張しません。

通常予約は[Instagram公式プロフィール](https://www.instagram.com/CHILLLABOTOKYO/)、コースは[TableCheck日本語入口](https://www.tablecheck.com/ja/chilllabo-tokyo)、道順はMaps、電話は `tel:+818087008528` です。英語ページはコースの日本語詳細へ進むことを明記しています。クリックやDM表示を予約成立とは扱いません。

メールの実送受信は未検証です。Search Consoleでの取得・インデックス・正規URL、検索順位・AIの引用・予約／売上への効果は別途確認・計測します。

Chromeのモバイル幅QAと実機iPhone Safariは別です。実機iPhone、検索順位、AI引用、予約成立・売上への効果は未検証。架空のレビュー・評価点は使わず、口コミはGoogle Mapsへ案内します。GA4/GTM等への送信設定はなく、解析導入を済ませたとは報告しません。

## 5. 他サイトとの接続は別途

Chill LaboからSATトップ、PLAYGROUNDの `/aroma-lab/`・酒米への出発リンクは実装済みで、各遷移先への到達も確認しました。他サイト側のChill Laboへの帰り道、PLAYGROUNDのSATリンク正式ドメイン統一は、このリポジトリでは変更していません。

1Fは準備中を維持します。開業・在庫・販売価格、第三の酒の未公開FIELD記録は推測して有効化しません。
