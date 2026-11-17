import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const policies = {
  ja: {
    title: 'プライバシーポリシー',
    description: 'Chill Labo Growth と Chill Labo Akasaka 公式サイトでのデータの取扱いをご案内します。',
    home: '公式サイト',
    skip: '本文へスキップ',
    nav: 'ページナビゲーション',
    content: `
<section aria-labelledby="growth">
  <h2 id="growth">Chill Labo Growth</h2>
  <p>「Chill Labo Growth - Daily Sync」は、Chill Labo Akasaka の運営者が、店舗運営、売上分析、集客と公式サイトの改善に使う内部ツールです。Google Apps Script でデータを同期し、運営者向けの集計とレポートを作成します。</p>
  <h3>取得するデータと利用目的</h3>
  <ul>
    <li><strong>Google Search Console</strong>：指定サイトの検索語、ページ、デバイス別の表示回数、クリック数、クリック率、平均掲載順位などを取得し、検索流入や SEO の改善に使います。</li>
    <li><strong>Google Analytics 4</strong>：指定プロパティのセッション数、検索経由の流入、閲覧開始ページ、予約先へのリンクのクリック数などの集計を取得し、集客経路とサイトの改善に使います。クリック数は予約成立件数とは別の指標です。</li>
    <li><strong>Google Drive / Google Sheets</strong>：指定した Drive フォルダの店舗売上 CSV と、指定したスプレッドシート内の設定・集計データを読み取ります。取り込んだデータ、同期記録、分析・レポート用の集計を Google Sheets に保存します。</li>
  </ul>
  <h3>保存先・アクセス・共有</h3>
  <p>入力用 CSV は Google Drive に、同期したデータと集計は Google Sheets に保存します。入力用フォルダと Growth のスプレッドシートは一般公開せず、所有者の Google アカウントにアクセスを限定しています。同期処理でのデータの送信先は、読取・保存に用いる Google のサービスです。Google API 経由で取得したユーザーデータを広告配信に使ったり、第三者に販売したりしません。</p>
  <h3>保存期間と削除</h3>
  <p>Growth の同期処理には、一律の保存期限や、期限に基づく自動削除の機能はありません。保存内容の確認や削除をご希望の場合は、下記の窓口にご連絡ください。運営者が対象データと保存先を確認し、削除できる範囲と対応方法をご案内します。Growth 側で削除する場合は、対象の保存データを Google Sheets から、対象の入力用 CSV がある場合は Google Drive から、運営者が手動で削除します。Search Console や GA4 にある取得元データは別に管理されます。</p>
  <h3>Google のユーザーデータポリシー</h3>
  <p>Chill Labo Growth における Google API 経由のユーザーデータの利用と転送は、適用される Limited Use 要件を含め、<a href="https://developers.google.com/terms/api-services-user-data-policy?hl=ja">Google API Services User Data Policy</a> に準拠します。</p>
</section>
<section aria-labelledby="website">
  <h2 id="website">公式サイトのアクセス解析</h2>
  <p>Chill Labo Akasaka 公式サイトでは、閲覧状況、サイトの操作性、予約先への導線を把握し、サイトを改善するために、Google Analytics 4 と Microsoft Clarity を利用しています。</p>
  <ul>
    <li><strong>Google Analytics 4</strong> には、ページ閲覧、参照元、端末・ブラウザの情報、リンクのクリックなどの計測データが送信されます。Google は計測に Cookie などを使用する場合があります。<a href="https://policies.google.com/technologies/partner-sites?hl=ja">Google によるデータの取扱い</a>をご確認ください。</li>
    <li><strong>Microsoft Clarity</strong> には、クリックやスクロールなどのページ操作に関する計測データが送信され、操作の傾向を把握するヒートマップやセッションの再現に使われます。Microsoft は計測に Cookie などを使用する場合があります。詳しくは <a href="https://privacy.microsoft.com/ja-jp/privacystatement">Microsoft のプライバシーに関する声明</a>をご確認ください。</li>
  </ul>
  <p>Cookie の許可や削除はブラウザの設定で管理できます。Instagram、TableCheck、食べログなどの外部サービスに移動した先で入力・送信する情報には、各サービスのプライバシーポリシーが適用されます。</p>
</section>
<section aria-labelledby="contact">
  <h2 id="contact">お問い合わせ</h2>
  <p>データの取扱い、保存内容の確認、削除のご相談は、Chill Labo Akasaka（<a href="tel:+818087008528">080-8700-8528</a>）へお問い合わせください。</p>
</section>`,
  },
  en: {
    title: 'Privacy Policy',
    description: 'How Chill Labo Growth and the Chill Labo Akasaka website handle data.',
    home: 'Home',
    skip: 'Skip to main content',
    nav: 'Page navigation',
    content: `
<section aria-labelledby="growth">
  <h2 id="growth">Chill Labo Growth</h2>
  <p>Chill Labo Growth - Daily Sync is an internal tool used by the operator of Chill Labo Akasaka to run the business, analyze sales, understand how people find the bar, and improve its website. It uses Google Apps Script to sync data and produce summaries and reports for the operator.</p>
  <h3>Data we access and why</h3>
  <ul>
    <li><strong>Google Search Console:</strong> We retrieve search terms and performance metrics such as impressions, clicks, click-through rate, and average search position, including breakdowns by page and device for the configured site. We use them to analyze search traffic and improve search visibility.</li>
    <li><strong>Google Analytics 4:</strong> We retrieve aggregate reports for the configured property, including sessions, organic search traffic, landing pages, and clicks on links to booking services. We use these reports to understand traffic sources and improve the site. Click totals are separate from completed bookings.</li>
    <li><strong>Google Drive / Google Sheets:</strong> We read store sales CSV files from a designated Drive folder and read settings and summary data in a designated spreadsheet. We store imported data, sync records, and summaries for analysis and reporting in Google Sheets.</li>
  </ul>
  <h3>Storage, access, and sharing</h3>
  <p>Input CSV files are stored in Google Drive. Synced data and summaries are stored in Google Sheets. The input folder and Growth spreadsheet are private and access is limited to the owner's Google account. The sync sends data to the Google services it uses to read and store it. We do not use Google user data obtained through Google APIs to serve ads or sell it to third parties.</p>
  <h3>Retention and deletion</h3>
  <p>Growth's sync has no fixed expiration period or automatic deletion based on age. To ask what is stored or request deletion, contact us using the details below. The operator will identify the data and where it is stored, then explain what can be deleted and how. For deletion from Growth, the operator manually removes the relevant data from Google Sheets and any relevant input CSV file from Google Drive. The underlying Search Console and GA4 data is managed separately.</p>
  <h3>Google's user data policy</h3>
  <p>Chill Labo Growth's use and transfer of user data received from Google APIs complies with the <a href="https://developers.google.com/terms/api-services-user-data-policy">Google API Services User Data Policy</a>, including the applicable Limited Use requirements.</p>
</section>
<section aria-labelledby="website">
  <h2 id="website">Website analytics</h2>
  <p>The Chill Labo Akasaka website uses Google Analytics 4 and Microsoft Clarity to understand how visitors browse the site and find booking options, and to improve the site.</p>
  <ul>
    <li><strong>Google Analytics 4</strong> receives measurement data such as page views, referral sources, device and browser information, and link clicks. Google may use cookies and similar tools for measurement. See <a href="https://policies.google.com/technologies/partner-sites?hl=en">how Google handles this data</a>.</li>
    <li><strong>Microsoft Clarity</strong> receives measurement data about interactions such as clicks and scrolling. It uses them for features such as heatmaps and session replay. Microsoft may use cookies and similar tools for measurement. See the <a href="https://privacy.microsoft.com/en-us/privacystatement">Microsoft Privacy Statement</a>.</li>
  </ul>
  <p>You can manage or delete cookies in your browser settings. Information you enter or send after following a link to a service such as Instagram, TableCheck, or Tabelog is subject to that service's privacy policy.</p>
</section>
<section aria-labelledby="contact">
  <h2 id="contact">Contact</h2>
  <p>For questions about data handling, what is stored, or deletion requests, contact Chill Labo Akasaka at <a href="tel:+818087008528">+81 80 8700 8528</a>.</p>
</section>`,
  },
};

export async function buildPrivacyPages({ root, origin, indexable }) {
  const routes = { ja: '/privacy/', en: '/en/privacy/' };
  for (const [lang, policy] of Object.entries(policies)) {
    const en = lang === 'en';
    const base = en ? '../../' : '../';
    const home = en ? '../' : base;
    const otherLanguage = en
      ? '<a class="language-link" href="../../privacy/" lang="ja" hreflang="ja">日本語</a>'
      : '<a class="language-link" href="../en/privacy/" lang="en" hreflang="en">English</a>';
    const directory = path.join(root, routes[lang].slice(1));
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, 'index.html'), `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${policy.title} | Chill Labo Akasaka</title>
<meta name="description" content="${policy.description}">
<meta name="robots" content="${indexable ? 'index,follow' : 'noindex,follow'}">
<link rel="canonical" href="${origin}${routes[lang]}">
<link rel="alternate" hreflang="ja" href="${origin}${routes.ja}">
<link rel="alternate" hreflang="en" href="${origin}${routes.en}">
<link rel="alternate" hreflang="x-default" href="${origin}${routes.ja}">
<link rel="icon" href="${base}assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="${base}assets/css/styles.css">
<style>
.privacy-policy { max-width: 820px; padding-block: clamp(40px, 8vw, 88px); }
.privacy-policy h1 { font-size: clamp(2rem, 6vw, 3.75rem); line-height: 1.2; }
.privacy-policy section { border-top: 1px solid var(--line); margin-top: 32px; padding-top: 24px; }
.privacy-policy h2 { font-size: clamp(1.4rem, 4vw, 2rem); line-height: 1.3; }
.privacy-policy h3 { margin-top: 24px; font-size: 1.1rem; }
.privacy-policy p, .privacy-policy li { margin-top: 12px; line-height: 1.8; }
.privacy-policy ul { padding-inline-start: 1.5em; list-style: disc; }
.privacy-policy a { text-decoration: underline; overflow-wrap: anywhere; }
</style>
</head>
<body class="editorial-page">
<a href="#main" class="skip-link">${policy.skip}</a>
<header class="site-header editorial-site-header">
  <a class="brand" href="${home}"><span class="wordmark">CHILL LABO</span><span class="brand-place">AKASAKA</span></a>
  <div class="header-tools">${otherLanguage}</div>
</header>
<main id="main" class="privacy-policy wrap">
  <h1>${policy.title}</h1>
  ${policy.content}
</main>
<footer class="site-footer wrap editorial-footer">
  <a class="brand footer-brand" href="${home}"><span class="wordmark">CHILL LABO</span><span class="brand-place">AKASAKA</span></a>
  <nav aria-label="${policy.nav}"><a href="${home}">${policy.home}</a>${otherLanguage}</nav>
  <p class="copyright">© ${new Date().getFullYear()} CHILL LABO AKASAKA</p>
</footer>
</body>
</html>
`);
  }
}
