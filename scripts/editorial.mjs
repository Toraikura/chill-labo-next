import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const esc = value => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

const sourceLinks = {
  jssTaste: 'https://japansake.or.jp/sake/en/basic/what-does-sake-taste-like/',
  jssLabels: 'https://japansake.or.jp/sake/en/basic/how-to-read-sake-bottle-labels/',
  jssFaq: 'https://japansake.or.jp/sake/en/basic/faq/',
  jssGlossary: 'https://japansake.or.jp/sake/about-sake/glossary-of-sake/',
};

function pageShell({ origin, indexable, analyticsHead, canonicalPath, title, description, schema, heroImage, heroAlt, kicker, h1, deck, body }) {
  const canonical = `${origin}${canonicalPath}`;
  const image = `${origin}/assets/images/${heroImage}-900.webp`;
  return `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="${indexable ? 'index,follow' : 'noindex,follow'}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Chill Labo Akasaka">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:locale" content="ja_JP">
<meta property="og:image" content="${image}">
<meta property="og:image:width" content="900">
<meta property="og:image:height" content="900">
<meta property="og:image:alt" content="${esc(heroAlt)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#f7f0dc">
${analyticsHead}
<link rel="icon" href="${origin}/assets/favicon.svg" type="image/svg+xml">
<link rel="preload" href="${origin}/assets/fonts/Anton-Regular-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${origin}/assets/css/styles.css?v=20261002">
<script type="application/ld+json">${JSON.stringify(schema).replaceAll('<', '\\u003c')}</script>
<script src="${origin}/assets/js/site.js?v=20261002" defer></script>
</head>
<body id="top" class="editorial-page">
<a href="#main" class="skip-link">本文へスキップ</a>
<header class="site-header editorial-site-header">
  <a class="brand" href="${origin}/" aria-label="Chill Labo Akasaka トップへ">
    <span class="wordmark">CHILL LABO</span><span class="brand-place">AKASAKA</span>
  </a>
  <nav class="desktop-nav" aria-label="メインナビゲーション">
    <a href="${origin}/#pricing">飲み比べ・料金</a>
    <a href="${origin}/story/">STORY</a>
    <a href="${origin}/guide/sake-karakuchi/">SAKE GUIDE</a>
    <a href="${origin}/#access">アクセス</a>
  </nav>
  <div class="header-tools">
    <a class="language-link" href="${origin}/en/" lang="en" hreflang="en">EN</a>
    <details class="mobile-menu">
      <summary aria-label="メニュー"><span class="menu-icon" aria-hidden="true"></span></summary>
      <nav aria-label="モバイルナビゲーション">
        <a href="${origin}/">TOP</a>
        <a href="${origin}/story/">STORY</a>
        <a href="${origin}/guide/sake-karakuchi/">SAKE GUIDE</a>
        <a href="${origin}/#access">アクセス</a>
      </nav>
    </details>
  </div>
</header>
<main id="main" class="editorial-main">
<article>
  <header class="editorial-hero wrap">
    <div class="editorial-hero-copy">
      <p class="eyebrow">${esc(kicker)}</p>
      <h1>${h1}</h1>
      <p class="editorial-deck">${deck}</p>
      <p class="editorial-updated">2026.10.02 UPDATE / CHILL LABO AKASAKA</p>
    </div>
    <figure class="editorial-hero-image">
      <img src="${image}" srcset="${origin}/assets/images/${heroImage}-480.webp 480w, ${image} 900w" sizes="(max-width: 700px) 100vw, 44vw" width="900" height="900" alt="${esc(heroAlt)}" fetchpriority="high" decoding="async">
    </figure>
  </header>
  ${body}
</article>
</main>
<footer class="site-footer wrap editorial-footer">
  <div>
    <a class="brand footer-brand" href="${origin}/"><span class="wordmark">CHILL LABO</span><span class="brand-place">AKASAKA</span></a>
    <p class="fine">東京都港区赤坂4-3-27 2F<br><a href="tel:+818087008528" data-track="phone_click">080-8700-8528</a></p>
  </div>
  <nav aria-label="関連記事">
    <a href="${origin}/story/">STORY</a>
    <a href="${origin}/guide/sake-karakuchi/">SAKE GUIDE</a>
    <a href="${origin}/">店舗TOP</a>
    <a href="https://www.instagram.com/CHILLLABOTOKYO/" target="_blank" rel="noopener noreferrer" data-track="instagram_outbound">Instagram↗</a>
  </nav>
  <p class="copyright">© ${new Date().getFullYear()} CHILL LABO AKASAKA</p>
</footer>
</body>
</html>`;
}

function storyPage({ origin, indexable, analyticsHead }) {
  const canonicalPath = '/story/';
  const title = 'なぜChill Laboは飲み比べにこだわるのか｜赤坂の日本酒バー';
  const description = '2019年に吉祥寺で始まり、現在は赤坂へ。Chill Laboが100種類以上の日本酒を少量ずつ飲み比べるスタイルにこだわる理由と、「好きな一杯」を自分で見つける店づくりの原点。';
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${origin}${canonicalPath}#article`,
        headline: 'なぜChill Laboは飲み比べにこだわるのか',
        description,
        datePublished: '2026-10-02',
        dateModified: '2026-10-02',
        inLanguage: 'ja',
        mainEntityOfPage: `${origin}${canonicalPath}`,
        image: `${origin}/assets/images/05-selecting-sake-900.webp`,
        author: { '@type': 'Organization', name: 'Chill Labo Akasaka', url: `${origin}/` },
        publisher: { '@type': 'Organization', name: 'Chill Labo Akasaka', url: `${origin}/` },
        about: ['日本酒', '日本酒飲み比べ', 'Chill Labo Akasaka', '赤坂'],
        keywords: ['赤坂 日本酒', '日本酒 飲み比べ', '日本酒 初心者', '日本酒バー'],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Chill Labo Akasaka', item: `${origin}/` },
          { '@type': 'ListItem', position: 2, name: 'Story', item: `${origin}${canonicalPath}` },
        ],
      },
    ],
  };
  const body = `
  <div class="editorial-body wrap">
    <section class="editorial-summary" aria-labelledby="story-summary">
      <p class="eyebrow">IN SHORT</p>
      <h2 id="story-summary">日本酒を「知ってから飲む」のではなく、<br>飲みながら自分の好みを知れる場所に。</h2>
      <p>Chill Laboが飲み比べにこだわる理由は、たくさん飲むためではありません。銘柄、価格、知名度、専門用語より先に、自分が「好き」と感じる味を見つけてほしいからです。</p>
    </section>

    <section class="editorial-section">
      <p class="eyebrow">01 / THE BEGINNING</p>
      <h2>2019年、吉祥寺から始まった。</h2>
      <p>Chill Labo Tokyoは2019年に吉祥寺でスタートしました。当時の旧ブログには、酒蔵が減っていくことへの危機感と、「日本酒をもっと身近な選択肢にしたい」という思いを書いています。</p>
      <p>現在は赤坂へ移りましたが、店の中心にある考え方は変わっていません。日本酒に詳しい人だけの場所ではなく、ワインやビールは好きだけれど日本酒はまだよく分からない人も、自分の入口を見つけられる場所にすることです。</p>
      <aside class="editorial-note">
        <strong>2019 → 2026</strong>
        <p>このページは、旧記事「僕が32歳で脱サラして日本酒バー『Chill Labo Tokyo』をはじめた理由」を、赤坂で営業する現在の視点から全面的に再構成しています。古い店舗情報や当時時点の統計値は引き継いでいません。</p>
      </aside>
    </section>

    <section class="editorial-section">
      <p class="eyebrow">02 / WHY TASTING</p>
      <h2>一本を決める前に、少しずつ比べる。</h2>
      <p>日本酒は、ラベルを見ただけでは味を想像しにくい飲みものです。しかも一杯ずつ注文していくと、違いを確かめる前に量も金額も積み上がります。</p>
      <p>だからChill Laboでは、気になる酒を少量ずつ比べられる形にしています。香りが華やかなもの、酸が印象的なもの、旨味が太いもの、後味が軽いもの。同じ「日本酒」でも横に並べると差が見え、自分の好みを言葉にしやすくなります。</p>
    </section>

    <section class="editorial-section">
      <p class="eyebrow">03 / NO RIGHT ANSWER</p>
      <h2>「高い」「有名」より、今日の自分に合うか。</h2>
      <p>値段や知名度は、酒を選ぶ手がかりにはなります。でも、それがそのまま自分の好みとは限りません。Chill Laboでは、銘柄を当てることや専門知識を競うことより、「これは好き」「これは違う」を安心して言えることを大切にしています。</p>
      <p>冷酒、常温、燗。料理と合わせる。ときには飲み方を変える。同じ酒でも見え方は変わります。正解を覚えるより、自分の感覚を増やしていく。それが飲み比べの面白さだと考えています。</p>
    </section>

    <section class="editorial-section editorial-section-split">
      <div>
        <p class="eyebrow">04 / TODAY IN AKASAKA</p>
        <h2>赤坂では、100種類以上から。</h2>
        <p>現在のChill Labo Akasakaでは、日本酒100種類以上を用意し、最初の1時間3,300円（税込）で飲み比べを楽しめます。初心者、お一人様、英語で相談したい方も歓迎しています。</p>
        <p>スタッフには「辛口」「フルーティー」といった言葉だけでなく、普段好きな飲みものや、苦手だった味も話してください。そこから次の一杯を一緒に探します。</p>
        <p><a class="text-link" href="${origin}/#pricing">現在の飲み比べ料金を見る →</a></p>
      </div>
      <figure>
        <img src="${origin}/assets/images/01-pouring-900.webp" srcset="${origin}/assets/images/01-pouring-480.webp 480w, ${origin}/assets/images/01-pouring-900.webp 900w" sizes="(max-width: 700px) 100vw, 42vw" width="900" height="900" loading="lazy" decoding="async" alt="Chill Labo Akasakaでグラスに日本酒を注ぐ様子">
      </figure>
    </section>

    <section class="editorial-section">
      <p class="eyebrow">05 / FROM BAR TO BREWING</p>
      <h2>飲む場所から、つくる側へ。</h2>
      <p>店で「この酒はどこで買えるの？」と聞かれることが増えたことから、Chill Laboの外でも日本酒との出会いを持ち帰れる形を考えるようになりました。現在はSAKE ART TOKYOとして、酒蔵と一緒に酒をつくる取り組みも進めています。</p>
      <p>一部の酒では、自分たちで田植えや稲刈りをした米を使うところから関わっています。グラスの中だけで終わらず、米、発酵、つくり手までつながっていく。店の原点が、少しずつ次の形に広がっています。</p>
      <p><a class="text-link" href="https://sakearttokyo.com/" target="_blank" rel="noopener noreferrer" data-track="sat_outbound">SAKE ART TOKYOを見る ↗</a></p>
    </section>

    <section class="editorial-cta" aria-labelledby="story-next">
      <p class="eyebrow">NEXT SIP</p>
      <h2 id="story-next">「辛口が好き」って、どんな味が好き？</h2>
      <p>日本酒の好みを言葉にする最初のテーマとして、「辛口」を分解しました。</p>
      <a class="button button-red" href="${origin}/guide/sake-karakuchi/" data-track="story_to_karakuchi">日本酒の「辛口」を読む →</a>
    </section>
  </div>`;

  return pageShell({
    origin, indexable, analyticsHead, canonicalPath, title, description, schema,
    heroImage: '05-selecting-sake',
    heroAlt: 'Chill Labo Akasakaで冷蔵庫から日本酒を選ぶ様子',
    kicker: 'WHY CHILL LABO / STORY',
    h1: '好きな一本を、<br>自分で見つけられる場所に。',
    deck: 'Chill Laboが「飲み比べ」にこだわる理由。',
    body,
  });
}

function guidePage({ origin, indexable, analyticsHead }) {
  const canonicalPath = '/guide/sake-karakuchi/';
  const title = '日本酒の「辛口」とは？日本酒度だけでは決まらない味の見方｜Chill Labo';
  const description = '日本酒の「辛口」は日本酒度だけでは決まりません。甘味・酸味・旨味・香り・後味・温度の関係を、赤坂の飲み比べ専門店Chill Laboが初心者向けに整理します。';
  const faqs = [
    ['日本酒度がプラスなら辛口ですか？', 'プラスになるほど辛口傾向の目安にはなりますが、日本酒度は比重の指標です。実際の甘辛の感じ方には糖分、酸、旨味、香り、温度なども関わるため、日本酒度だけでは決まりません。'],
    ['辛口なのにフルーティーな日本酒はありますか？', 'あります。香りの華やかさと、口に含んだときの甘味・酸味・後味は別の要素です。果実を思わせる香りがあっても、後味が軽く切れる酒は「辛口」と感じる人がいます。'],
    ['「キレがいい」と「辛口」は同じですか？', '同じではありません。キレは主に後味の残り方や収まり方を表す言葉として使われます。甘味を感じても後味が短く軽ければ、飲み手が「辛口っぽい」と表現することがあります。'],
    ['温度で辛口・甘口の感じ方は変わりますか？', '変わります。日本酒造組合中央会は、温度によって甘味や旨味の感じ方が変わると説明しています。同じ酒でも冷酒・常温・燗で印象が変わるため、温度違いを試すのも有効です。'],
  ];
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${origin}${canonicalPath}#article`,
        headline: '日本酒の「辛口」とは？日本酒度だけでは決まらない味の見方',
        description,
        datePublished: '2026-10-02',
        dateModified: '2026-10-02',
        inLanguage: 'ja',
        mainEntityOfPage: `${origin}${canonicalPath}`,
        image: `${origin}/assets/images/01-pouring-900.webp`,
        author: { '@type': 'Organization', name: 'Chill Labo Akasaka', url: `${origin}/` },
        publisher: { '@type': 'Organization', name: 'Chill Labo Akasaka', url: `${origin}/` },
        about: ['日本酒', '辛口', '日本酒度', '酸度', '飲み比べ'],
        keywords: ['日本酒 辛口', '日本酒度', '辛口とは', '甘口 辛口', '日本酒 初心者'],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map(([question, answer]) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Chill Labo Akasaka', item: `${origin}/` },
          { '@type': 'ListItem', position: 2, name: '日本酒の辛口とは', item: `${origin}${canonicalPath}` },
        ],
      },
    ],
  };

  const body = `
  <div class="editorial-body wrap">
    <section class="editorial-summary" aria-labelledby="dry-summary">
      <p class="eyebrow">THE SHORT ANSWER</p>
      <h2 id="dry-summary">「辛口」は、ひとつの数字では決まらない。</h2>
      <p>日本酒度が高いほど「辛口傾向」という見方はできます。ただ、飲んだときの印象は、甘味、酸味、旨味、香り、後味、温度の組み合わせで変わります。「辛口が好き」と思っている人が、実は“後味が軽い酒”や“酸がきれいな酒”を好んでいることも珍しくありません。</p>
    </section>

    <section class="editorial-section">
      <p class="eyebrow">01 / WHAT DOES DRY MEAN?</p>
      <h2>そもそも、日本酒の「辛口」は定義がむずかしい。</h2>
      <p>日本酒造組合中央会（JSS）も、dry sake は一言では定義しにくく、甘味の少なさだけでなく、酸や後味のきれいさも「辛口」という印象に関わると説明しています。</p>
      <p>だから店で「辛口ください」と伝えるのは間違いではありません。ただ、もう一言「香りは華やかでもいい」「後味が残らない方が好き」「酸がある方が好き」と足すと、好みに近い一本が見つかりやすくなります。</p>
      <p><a class="text-link" href="${sourceLinks.jssFaq}" target="_blank" rel="noopener noreferrer" data-track="reference_outbound">参考：日本酒造組合中央会 FAQ「What type of sake is dry?」↗</a></p>
    </section>

    <section class="editorial-section">
      <p class="eyebrow">02 / SAKE METER VALUE</p>
      <h2>日本酒度は「甘辛そのもの」ではなく、比重の指標。</h2>
      <p>日本酒度は、15℃における清酒の比重をもとにした数値です。一般にはプラスが大きいほど糖分が少なく辛口傾向、マイナス側ほど甘口傾向の目安として使われます。</p>
      <p>ただし、JSSの用語集では、甘辛をより説明する「甘辛度」はブドウ糖濃度と酸度から算出され、日本酒度を使う場合も酸度と組み合わせています。つまり、日本酒度だけを見るより、酸とのバランスまで見た方が実際の味に近づきます。</p>
      <div class="editorial-fact-grid" aria-label="辛口の感じ方を左右する要素">
        <div><strong>日本酒度</strong><span>比重の指標。プラスほど辛口傾向の目安。</span></div>
        <div><strong>酸</strong><span>甘味を引き締め、味に輪郭やボディを与える。</span></div>
        <div><strong>旨味</strong><span>アミノ酸やペプチドなどがふくらみをつくる。</span></div>
        <div><strong>香り</strong><span>果実・花・穀物など。甘辛とは別軸で印象を変える。</span></div>
        <div><strong>後味</strong><span>短くきれいに収まると「辛口」と感じる人もいる。</span></div>
        <div><strong>温度</strong><span>甘味・旨味の感じ方が変わり、同じ酒でも印象が動く。</span></div>
      </div>
      <p class="editorial-source-row">
        <a href="${sourceLinks.jssGlossary}" target="_blank" rel="noopener noreferrer" data-track="reference_outbound">JSS 日本酒用語集↗</a>
        <a href="${sourceLinks.jssLabels}" target="_blank" rel="noopener noreferrer" data-track="reference_outbound">JSS How to Read Sake Bottle Labels↗</a>
      </p>
    </section>

    <section class="editorial-section">
      <p class="eyebrow">03 / TASTE BALANCE</p>
      <h2>甘味・酸味・旨味のバランスで、同じ糖分でも印象は変わる。</h2>
      <p>JSSは、日本酒の主な味わいを甘味・酸味・旨味などのバランスとして説明しています。糖分が比較的多くても酸がしっかりしていれば、単純に甘く感じるのではなく、輪郭のある味やボディとして感じることがあります。</p>
      <p>逆に、糖分や旨味が控えめで軽い酒は、さらりとして「ドライ」に感じやすくなります。「辛口」という一語の中に、実はいくつもの好みが隠れています。</p>
      <p><a class="text-link" href="${sourceLinks.jssTaste}" target="_blank" rel="noopener noreferrer" data-track="reference_outbound">参考：日本酒造組合中央会「What Does Sake Taste Like?」↗</a></p>
    </section>

    <section class="editorial-section">
      <p class="eyebrow">04 / WHAT PEOPLE OFTEN MEAN</p>
      <h2>Chill Laboで「辛口が好き」と聞いたら、もう少しだけ聞きます。</h2>
      <p>旧ブログを書いた2019年から現在まで、接客では「辛口が好き」という言葉をそのまま終点にせず、何が好きだったのかを聞くようにしています。よく分かれるのは、次のような好みです。</p>
      <ul class="editorial-list">
        <li><strong>すっきり・軽い</strong> — 口に残る甘味や旨味が少ない方が好き</li>
        <li><strong>後味が切れる</strong> — 含んだ瞬間に味があっても、最後が短く収まる方が好き</li>
        <li><strong>酸がある</strong> — 甘味があっても酸で締まる方が好き</li>
        <li><strong>香りは控えめ</strong> — 果実香より穀物や落ち着いた香りが好き</li>
        <li><strong>香りは華やかでもOK</strong> — フルーティーでも後味が軽ければ好き</li>
      </ul>
      <p>この違いを2〜3種類並べて飲むと、「自分が言っていた辛口はこれだった」と見つかることがあります。これが、飲み比べをすすめる理由のひとつです。</p>
    </section>

    <section class="editorial-section editorial-section-split">
      <div>
        <p class="eyebrow">05 / TEMPERATURE</p>
        <h2>冷酒・常温・燗でも、感じ方は変わる。</h2>
        <p>JSSは、温度によって甘味や旨味の知覚が変わると説明しています。冷やすと軽くフレッシュに感じやすく、温めると甘味や旨味を感じやすくなる傾向があります。</p>
        <p>「この酒、冷酒だとシャープだけど、燗にすると丸い」ということは普通に起こります。ラベルの数値だけでなく、温度違いも含めて味を見ると、日本酒の幅が一気に広がります。</p>
      </div>
      <figure>
        <img src="${origin}/assets/images/01-pouring-900.webp" srcset="${origin}/assets/images/01-pouring-480.webp 480w, ${origin}/assets/images/01-pouring-900.webp 900w" sizes="(max-width: 700px) 100vw, 42vw" width="900" height="900" loading="lazy" decoding="async" alt="グラスに注がれる日本酒">
      </figure>
    </section>

    <section class="editorial-section" aria-labelledby="how-to-order">
      <p class="eyebrow">HOW TO ASK AT A BAR</p>
      <h2 id="how-to-order">店で伝えるなら、「辛口＋もう一言」。</h2>
      <div class="editorial-phrases">
        <p>「辛口で、<strong>後味が軽い</strong>もの」</p>
        <p>「辛口で、<strong>香りは華やか</strong>でも大丈夫」</p>
        <p>「<strong>酸があって</strong>、甘さが残らないもの」</p>
        <p>「日本酒度より、<strong>すっきり飲める</strong>感じ」</p>
      </div>
      <p>これだけで、選ぶ側がイメージしやすくなります。銘柄名を知らなくても問題ありません。</p>
    </section>

    <section class="editorial-section editorial-faq" aria-labelledby="karakuchi-faq">
      <p class="eyebrow">FAQ</p>
      <h2 id="karakuchi-faq">日本酒の辛口、よくある質問。</h2>
      ${faqs.map(([q, a]) => `<details><summary>${esc(q)}<span class="toggle" aria-hidden="true"></span></summary><div class="details-content"><p>${esc(a)}</p></div></details>`).join('')}
    </section>

    <section class="editorial-cta" aria-labelledby="taste-cta">
      <p class="eyebrow">TASTE IT SIDE BY SIDE</p>
      <h2 id="taste-cta">数字より早いのは、並べて飲むこと。</h2>
      <p>赤坂のChill Laboでは、日本酒100種類以上を少量ずつ比べられます。「辛口が好き」の先にある自分の好みを、一緒に探しましょう。</p>
      <div class="actions">
        <a class="button button-red" href="${origin}/#pricing" data-track="karakuchi_to_pricing">飲み比べ料金を見る →</a>
        <a class="button button-outline" href="${origin}/story/" data-track="karakuchi_to_story">店のストーリー →</a>
      </div>
    </section>
  </div>`;

  return pageShell({
    origin, indexable, analyticsHead, canonicalPath, title, description, schema,
    heroImage: '01-pouring',
    heroAlt: 'Chill Labo Akasakaで日本酒をグラスに注ぐ様子',
    kicker: 'SAKE GUIDE / DRY OR SWEET?',
    h1: '日本酒の「辛口」って、<br>結局なんだろう。',
    deck: '日本酒度だけでは決まらない、味の見方。',
    body,
  });
}

export async function buildEditorialPages({ root, origin, indexable, analyticsHead }) {
  const storyDir = path.join(root, 'story');
  const guideDir = path.join(root, 'guide', 'sake-karakuchi');
  await mkdir(storyDir, { recursive: true });
  await mkdir(guideDir, { recursive: true });
  await writeFile(path.join(storyDir, 'index.html'), storyPage({ origin, indexable, analyticsHead }));
  await writeFile(path.join(guideDir, 'index.html'), guidePage({ origin, indexable, analyticsHead }));
}
