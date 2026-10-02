# SEO CTR Experiment — 赤坂 日本酒

開始日: 2026-10-03  
対象ページ: https://chilllabo.tokyo/  
主対象クエリ: `赤坂 日本酒`

## 目的

Google Search Consoleで高順位なのに極端に低いCTRとなっている「赤坂 日本酒」の検索結果クリック率を改善する。

## 変更前ベースライン

Windsor.ai / Google Search Console、直近28日取得値（2026-10-03取得）。

### 主対象

| Query | Page | Device | Clicks | Impressions | CTR | Avg position |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| 赤坂 日本酒 | / | MOBILE | 0 | 130 | 0.00% | 1.5385 |
| 赤坂 日本酒 | / | DESKTOP | 0 | 16 | 0.00% | 8.875 |
| 赤坂 日本酒 | 旧 /sakebar_chilllaboakasaka | MOBILE | 1 | 13 | 7.69% | 1.0 |
| 赤坂 日本酒 | 旧 /sakebar_chilllaboakasaka | DESKTOP | 0 | 3 | 0.00% | 1.0 |

旧英語URLは2026-10-02にCloudflare HTTP 301で /en/ へ統合済み。

### コントロールクエリ

| Query | Page | Device | Clicks | Impressions | CTR | Avg position |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| 赤坂 日本酒バー | / | MOBILE | 2 | 17 | 11.76% | 2.1176 |
| 赤坂 日本酒 飲み放題 | / | MOBILE | 1 | 12 | 8.33% | 1.75 |
| 赤坂 日本酒 飲み放題 | / | DESKTOP | 2 | 6 | 33.33% | 6.8333 |

## ローカル検索の参考値

Google Business Profile、2026-09-01〜2026-09-28:

- Mobile Search impressions: 2,055
- Mobile Maps impressions: 6,534
- Desktop Search impressions: 519
- Desktop Maps impressions: 502
- Website clicks: 94
- Direction requests: 233
- Call clicks: 34

「赤坂 日本酒」はローカル意図が強く、通常の自然検索CTRだけでなくGoogle Business Profile / Maps側の行動も同時に追う。

## 検出したGBP整合性問題

2026-10-03時点でGoogle Business Profileの `url_menu` が旧URL
`https://chilllabo.tokyo/sakebar_chilllaboakasaka`
を参照している。

旧URLは現在 /en/ へ301するため、日本語検索ユーザー向けメニュー導線として不適切。
別途、GBPの書き込み承認後に現行料金セクションへ更新する。

## 今回の実験

### 変更前 title

`赤坂の日本酒バー｜100種類以上を飲み比べ｜Chill Labo Akasaka`

### 変更後 title

`赤坂の日本酒バー｜100種飲み比べ・1時間3,300円｜Chill Labo`

変更意図:

- 「赤坂 日本酒バー」を先頭維持
- 100種類という差別化要因を維持
- 検索結果上で価格を即提示
- 店名より検索者の判断材料を前に置く
- meta descriptionは変更せず、タイトル変更の影響を見やすくする

## 判定

最低7日、基本14日分のSearch Consoleデータが溜まった後に比較する。

主KPI:

1. `赤坂 日本酒` / MOBILE / TOPページのCTR
2. クリック数
3. 平均順位（順位低下とのトレードオフがないか）
4. `赤坂 日本酒バー` のCTR（既存11.76%を大きく毀損しないか）
5. `赤坂 日本酒 飲み放題` のCTR
6. Google Business Profileのwebsite clicks / direction requests

同日にタイトルを再変更しない。Googleの再クロール後の表示を確認してから評価する。
