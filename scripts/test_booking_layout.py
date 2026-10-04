"""Offline browser regression checks against the exact packaged deployment.

No external navigation or analytics requests are sent. Screenshots and JSON
results are written to QA_OUTPUT (default: /tmp/chill-booking-qa).
"""
import argparse
import base64
import hashlib
import json
import mimetypes
import os
from pathlib import Path
from urllib.parse import urlsplit

from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

WIDTHS = (320, 375, 390, 430, 600, 768, 900, 901, 1024, 1440)
PROVIDERS = {'reservation_outbound', 'tablecheck_outbound', 'tabelog_outbound'}


def fixture(site, route):
    filename = site / route
    soup = BeautifulSoup(filename.read_text(encoding='utf-8'), 'html.parser')
    scripts = []
    for element in soup.select('script'):
        src = element.get('src', '')
        if 'assets/js/site.' in src:
            scripts.append((filename.parent / urlsplit(src).path).resolve().read_text())
        element.decompose()
    for element in soup.select('link[rel=preload], link[rel=icon]'):
        element.decompose()
    for element in soup.select('link[rel=stylesheet]'):
        css_path = (filename.parent / urlsplit(element['href']).path).resolve()
        css = css_path.read_text()
        font = site / 'assets/fonts/Anton-Regular-latin.woff2'
        css = css.replace('../fonts/Anton-Regular-latin.woff2',
                          'data:font/woff2;base64,' + base64.b64encode(font.read_bytes()).decode())
        style = soup.new_tag('style')
        style.string = css
        element.replace_with(style)
    for element in soup.select('img'):
        asset = (filename.parent / urlsplit(element['src']).path).resolve()
        element['src'] = 'data:' + mimetypes.guess_type(str(asset))[0] + ';base64,' + base64.b64encode(asset.read_bytes()).decode()
        element.attrs.pop('srcset', None)
        element.attrs.pop('loading', None)
    script = soup.new_tag('script')
    script.string = "window.qaGA=[];window.qaClarity=[];window.gtag=(...a)=>qaGA.push(a);window.clarity=(...a)=>qaClarity.push(a);\n" + '\n'.join(scripts) + "\ndocument.querySelectorAll('a[target]').forEach(a=>a.addEventListener('click',e=>e.preventDefault()));"
    soup.body.append(script)
    return str(soup)


def panel_check(page, selector, label):
    chooser = page.locator(selector)
    chooser.locator('summary').click()
    panel = chooser.locator('.booking-chooser-panel')
    assert panel.is_visible(), f'{label}: chooser did not open'
    box = panel.bounding_box()
    assert box['x'] >= -1 and box['x'] + box['width'] <= page.viewport_size['width'] + 1, f'{label}: panel exceeds viewport {box}'
    assert set(panel.locator('[data-track]').evaluate_all('(els)=>els.map(e=>e.dataset.track)')) == PROVIDERS, f'{label}: missing provider'
    page.keyboard.press('Escape')
    assert not chooser.evaluate('(el)=>el.open'), f'{label}: Escape did not close chooser'


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--site', default='_site')
    parser.add_argument('--browsers', default='chromium')
    parser.add_argument('--chromium-executable', default=os.getenv('CHROMIUM_EXECUTABLE'))
    args = parser.parse_args()
    site = Path(args.site).resolve()
    output = Path(os.getenv('QA_OUTPUT', '/tmp/chill-booking-qa'))
    output.mkdir(parents=True, exist_ok=True)
    manifest = json.loads((site / 'assets/asset-manifest.json').read_text())
    for source, target in manifest.items():
        data = (site / source).read_bytes()
        digest = hashlib.sha256(data).hexdigest()[:16]
        assert digest in target and (site / target).read_bytes() == data, f'Invalid fingerprint: {source}'
    for route in ('index.html', 'en/index.html', 'story/index.html', 'guide/sake-karakuchi/index.html'):
        html = (site / route).read_text()
        assert 'styles.css?v=' not in html and 'site.js?v=' not in html, f'{route}: stale fixed version'
        assert manifest['assets/css/styles.css'] in html, f'{route}: missing fingerprinted CSS'
        assert manifest['assets/css/booking-layout.css'] in html, f'{route}: missing booking CSS'
    records = []
    with sync_playwright() as playwright:
        for browser_name in args.browsers.split(','):
            options = {'headless': True}
            if browser_name == 'chromium' and args.chromium_executable:
                options.update(executable_path=args.chromium_executable, args=['--no-sandbox'])
            browser = getattr(playwright, browser_name).launch(**options)
            for route in ('index.html', 'en/index.html'):
                html = fixture(site, Path(route))
                for width in WIDTHS:
                    mobile = width <= 900
                    page = browser.new_page(viewport={'width': width, 'height': 844}, is_mobile=mobile, has_touch=mobile, device_scale_factor=1)
                    errors = []
                    page.on('pageerror', lambda error: errors.append(str(error)))
                    page.route('**/*', lambda request: request.abort())
                    page.emulate_media(reduced_motion='reduce')
                    page.set_content(html, wait_until='load')
                    page.evaluate('document.fonts.ready')
                    label = f'{browser_name} {route} {width}px'
                    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), f'{label}: horizontal overflow'
                    for scope in ('.service-strip', '#pricing', '.booking', '#return'):
                        desktop = page.locator(f'{scope} .booking-providers-desktop')
                        compact = page.locator(f'{scope} .booking-providers-mobile')
                        assert desktop.is_visible() == (not mobile), f'{label} {scope}: wrong desktop visibility'
                        assert compact.is_visible() == mobile, f'{label} {scope}: wrong mobile visibility'
                        if mobile:
                            panel_check(page, f'{scope} .booking-chooser', f'{label} {scope}')
                        else:
                            assert set(desktop.locator('[data-track]').evaluate_all('(els)=>els.map(e=>e.dataset.track)')) >= PROVIDERS
                    if mobile:
                        summary = page.locator('.service-strip .booking-chooser>summary')
                        summary.click()
                        page.locator('.service-strip .booking-chooser-panel [data-track=tablecheck_outbound]').click()
                        assert page.evaluate("qaGA.filter(e=>e[0]==='event'&&e[1]==='tablecheck_outbound').length") == 1, f'{label}: GA4 double or missing event'
                        assert page.evaluate("qaClarity.filter(e=>e[1]==='tablecheck_outbound').length") == 1, f'{label}: Clarity double or missing event'
                        assert not page.locator('.service-strip .booking-chooser').evaluate('(el)=>el.open')
                        page.set_viewport_size({'width': width, 'height': 600})
                        page.locator('#food').evaluate("el=>window.scrollTo(0,el.getBoundingClientRect().top+scrollY+16)")
                        page.wait_for_timeout(120)
                        assert page.locator('.sticky-actions').is_visible(), f'{label}: sticky CTA missing between inline CTAs'
                        panel_check(page, '.sticky-actions .booking-chooser', f'{label} sticky')
                        page.locator('.sticky-actions .booking-chooser>summary').click()
                        box = page.locator('.sticky-actions .booking-chooser-panel').bounding_box()
                        assert box['y'] >= 0 and box['y'] + box['height'] <= 600, f'{label}: sticky chooser outside screen'
                        page.keyboard.press('Escape')
                        page.locator('.mobile-menu>summary').click()
                        page.wait_for_timeout(120)
                        assert not page.locator('.sticky-actions').is_visible(), f'{label}: sticky duplicates menu'
                        assert page.locator('.mobile-menu-booking a').count() == 3
                        page.keyboard.press('Escape')
                        page.set_viewport_size({'width': width, 'height': 844})
                    if width == 390 and route == 'index.html':
                        page.locator('.service-strip').scroll_into_view_if_needed()
                        page.wait_for_timeout(120)
                        assert not page.locator('.sticky-actions').is_visible(), f'{label}: sticky duplicates inline CTA'
                        page.evaluate('document.activeElement.blur()')
                        page.screenshot(path=str(output / f'{browser_name}-mobile-closed.png'))
                        page.locator('.service-strip .booking-chooser>summary').click()
                        page.screenshot(path=str(output / f'{browser_name}-mobile-open.png'))
                    assert not errors, f'{label}: JS errors {errors}'
                    records.append({'browser': browser_name, 'page': route, 'width': width, 'result': 'passed'})
                    print(f'PASS {label}')
                    page.close()
            browser.close()
    (output / 'results.json').write_text(json.dumps(records, ensure_ascii=False, indent=2) + '\n')
    print(f'{len(records)} responsive browser cases passed; evidence: {output}')


if __name__ == '__main__':
    main()
