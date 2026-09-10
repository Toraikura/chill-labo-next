# 既存ドメインへの移行手順

GitHub Pagesの確認用公開と、`https://chilllabo.tokyo/` への移行を分けて扱います。今回、お名前.comのDNS・既存WordPress・独自ドメイン設定は変更していません。この文書は本番移行を完了したという報告ではありません。

## 1. 移行先と旧URLの扱いを先に決める

既存TOP、英語 `/sakebar_chilllaboakasaka`、記事 `/archives/129`、`/page/2` 等について、実在・検索流入・被リンクと対応先を確認します。無関係な記事を一律TOPへ送らない方針を保ちます。

**GitHub Pages単体では、任意の旧URLに対する真のHTTP 301転送を設定できません。** 旧英語URLから `/en/` へ301転送する場合は、対応するホスト／CDNで処理します。GitHub Pagesを使い続ける場合は、旧パスに互換用の静的案内を用意する方法もありますが、リンク案内・JavaScript移動・meta refreshをHTTP 301と報告しません。現在の404ページも301転送の代替ではありません。

移行方式と旧URL対応を確定する前にWordPressを停止しません。SAT・PLAYGROUNDから戻る旧URLや、既に配布したQRがあれば同時に確認します。

## 2. 本番向けに生成する

編集元は `scripts/build.mjs`。日英本文・料金・営業時間・住所・電話・予約条件を公開直前に照合します。旧公式に残る4時間プランは復活させず、通常2行と料理付き2時間／3時間を分けます。

```sh
SITE_ORIGIN=https://chilllabo.tokyo SITE_INDEXABLE=true npm run build
npm run check
npm run package
```

この設定で日英HTMLは `index,follow`、canonical・hreflang・OG URL・sitemapは本番ドメインになります。`robots.txt` は検索用のクロールを許可し、GPTBotの学習用クロールは拒否する構成を保ち、本番sitemapのURLを追加します。ロボット設定の実際の適用はドメインルートへの配信後に確認します。

**`.github/workflows/pages.yml` のビルドstepまたはjobの環境変数にも、`SITE_ORIGIN=https://chilllabo.tokyo` と `SITE_INDEXABLE='true'` を設定してください。** ローカルだけを変更すると、Actionsが既定のGitHub確認用設定で再生成します。GitHub確認用originのまま検索許可する指定はビルド側で拒否されます。

## 3. ドメイン切替の前後に照合する

- 画像とフォントはローカル配信へ移行済み。 `_site/` 内の画像を日英ページが参照でき、旧WordPress画像を取得していないことを実際の通信で確認する。
- 本番の `/`・`/en/` が正常表示し、HTTPS・canonical・相互hreflang・robots・sitemap・404・旧URL対応が選択した方式どおりに動くことを確認する。日英本文とBarOrPub構造化データの店舗情報を一致させる。
- お名前.comのDNS、GitHub Pagesの独自ドメイン設定、HTTPSの有効化を選択した構成に合わせる。既存のメール用DNS等を確認し、Web切替と混同して上書きしない。
- 通常予約はInstagram公式プロフィール、料理付きはTableCheckの日本語入口、道順はMaps、電話は `tel:+818087008528`。英語のTableCheck案内は日本語詳細へ移動することを表示する。予約画面を開く操作は予約成立として計測・報告しない。
- メニュー、料理の展開、予約文コピー、言語切替、固定CTA、Maps／Instagramから戻る動作を日英で確認する。Chromeのモバイル幅確認と実機iPhone Safariの確認を分ける。

## 4. 他サイトとの接続

Chill Labo側からSATの酒、PLAYGROUNDの香り・米へ進むリンクは実装済みです。SAT／PLAYGROUND自体はこのリポジトリでは変更しません。PLAYGROUNDからChill Laboへの帰り道、SATの正式ドメインへのリンク統一、将来のFIELD記録の公開と店舗への接続は別途実装・確認します。

1Fは準備中を維持し、開業日・営業時間・販売商品が確認できた時に更新します。田んぼ記録や商品在庫を推測してリンク・販売CTAを有効化しません。

## 5. 公開後の確認と計測

Actionsの成功、実際に配信される日英HTML、各CTA、独自ドメインの状態をそれぞれ確認して報告します。Search Consoleで本番sitemap・取得・インデックス・正規URLを確認し、公開前後の検索流入と英語ページの利用を比較します。インデックス登録、順位、AIの引用は保証しません。

現在、外部解析サービスへの送信はありません。GA4／GTM導入を今回の必須作業とはせず、導入する場合に計測項目・取得情報・プライバシー表示を別途決めます。リンククリックと予約確認・来店を分け、DM本文や私的メモを解析に送らない方針を維持します。

現時点で実機iPhone、検索順位、AIによる引用、予約・売上への効果は未検証です。Chrome QAと静的検査の実施結果を、これらの代わりの証拠にしません。
