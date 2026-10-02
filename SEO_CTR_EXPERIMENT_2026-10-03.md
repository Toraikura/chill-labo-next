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

### 2026-10-03 価格訴求案は即日中止

一度、以下のtitleを本番公開した。

`赤坂の日本酒バー｜100種飲み比べ・1時間3,300円｜Chill Labo`

ただし「1時間3,300円」だけを検索結果で見ると、2時間なら6,600円の時間課金に見えるという誤認リスクがあるため、測定開始前に撤回した。この案はCTR実験の有効な観測対象として扱わない。

### 顧客価値ベースの本採用案

title:

`赤坂の日本酒バー｜あなたの「好き」を一緒に探す｜Chill Labo`

meta description:

`日本酒に詳しくなくても大丈夫。少しずつ飲み比べながら、あなたの好きな味をスタッフと一緒に探せる赤坂の日本酒バー。赤坂・赤坂見附駅から徒歩約5分。`

変更意図:

- 「赤坂 日本酒バー」を先頭に置き、検索意図との一致を維持
- 「100種類」「価格」など店側のスペックを主語にしない
- 「あなたの好き」を探す体験を、Chill Labo独自の約束として前面に出す
- 初心者の心理障壁をmeta descriptionで下げる
- 「宇宙で一番美味しくて楽しいSAKEコミュニティ」という内部コンセプトを、検索ユーザー側の価値に翻訳する
- 商品説明ではなく「自分に合う酒・時間を一緒に見つけられる店」としてCTRを検証する

## 判定

最低7日、基本14日分のSearch Consoleデータが溜まった後に比較する。

主KPI:

1. `赤坂 日本酒` / MOBILE / TOPページのCTR
2. クリック数
3. 平均順位（順位低下とのトレードオフがないか）
4. `赤坂 日本酒バー` のCTR（既存11.76%を大きく毀損しないか）
5. `赤坂 日本酒 飲み放題` のCTR
6. Google Business Profileのwebsite clicks / direction requests

本採用案がGoogle検索結果に再クロール・反映された日を実験開始日として扱う。それ以降は最低7日、基本14日はtitle / meta descriptionを再変更せず評価する。
