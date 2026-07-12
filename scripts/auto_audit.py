#!/usr/bin/env python3
"""
YPSMA Daarul Qolam — Automated Website Audit Tool
Validates HTML, OG tags, SEO, accessibility, images, links, and Cloudflare config.
"""

import os
import re
import sys
import json
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse

# ─── Config ───────────────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent
PUBLIC_DIR = BASE_DIR / "public"
ROOT_DIR = BASE_DIR

REQUIRED_OG_TAGS = [
    "og:title", "og:description", "og:image", "og:url",
    "og:type", "og:site_name", "og:locale"
]
REQUIRED_TWITTER_TAGS = ["twitter:card", "twitter:title", "twitter:description"]
SITE_URL = "https://ypsma-daarulqolam.sch.id"

# ─── Helpers ──────────────────────────────────────────────────────
class Stats:
    def __init__(self):
        self.passed = []
        self.warnings = []
        self.errors = []
        self.fixes = []

    def ok(self, msg):
        self.passed.append(msg)
        print(f"  ✅ {msg}")

    def warn(self, msg):
        self.warnings.append(msg)
        print(f"  ⚠️  {msg}")

    def err(self, msg):
        self.errors.append(msg)
        print(f"  ❌ {msg}")

    def fix(self, msg):
        self.fixes.append(msg)
        print(f"  🔧 FIX: {msg}")

    def summary(self):
        total = len(self.passed) + len(self.warnings) + len(self.errors)
        print(f"\n{'='*60}")
        print(f"AUDIT SUMMARY")
        print(f"{'='*60}")
        print(f"  ✅ Passed:    {len(self.passed)}")
        print(f"  ⚠️  Warnings:  {len(self.warnings)}")
        print(f"  ❌ Errors:    {len(self.errors)}")
        print(f"  🔧 Fixes:     {len(self.fixes)}")
        print(f"  📊 Total:     {total}")
        print(f"{'='*60}")
        if self.errors:
            print("\n❌ CRITICAL ISSUES TO FIX:")
            for e in self.errors:
                print(f"   - {e}")
        if self.fixes:
            print("\n🔧 SUGGESTED FIXES:")
            for f in self.fixes:
                print(f"   - {f}")
        return len(self.errors) == 0


# ─── 1. HTML Structure Validation ────────────────────────────────
def audit_html_structure(stats, html_path):
    print(f"\n📋 1. HTML Structure: {html_path.name}")
    content = html_path.read_text(encoding="utf-8")

    # DOCTYPE
    if "<!DOCTYPE html>" in content:
        stats.ok("DOCTYPE present")
    else:
        stats.err("Missing <!DOCTYPE html>")

    # lang attribute
    if re.search(r'<html[^>]+lang="id"', content):
        stats.ok('lang="id" attribute present')
    else:
        stats.warn('Missing lang="id" on <html>')

    # Meta charset
    if re.search(r'<meta\s+charset="UTF-8"', content):
        stats.ok("UTF-8 charset declared")
    else:
        stats.warn("Missing UTF-8 charset meta tag")

    # Meta viewport
    if re.search(r'<meta\s+name="viewport"', content):
        stats.ok("Viewport meta tag present")
    else:
        stats.err("Missing viewport meta tag (SEO + mobile)")

    # Title
    title_match = re.search(r"<title>(.*?)</title>", content, re.DOTALL)
    if title_match:
        title = title_match.group(1).strip()
        title_len = len(title)
        if title_len < 30:
            stats.warn(f"Title too short ({title_len} chars): '{title}'")
        elif title_len > 60:
            stats.warn(f"Title too long ({title_len} chars): '{title}'")
        else:
            stats.ok(f"Title length OK ({title_len} chars)")
    else:
        stats.err("Missing <title> tag")

    # Meta description
    desc_match = re.search(r'<meta\s+name="description"\s+content="(.*?)"', content)
    if desc_match:
        desc = desc_match.group(1)
        desc_len = len(desc)
        if desc_len < 120:
            stats.warn(f"Meta description too short ({desc_len} chars)")
        elif desc_len > 160:
            stats.warn(f"Meta description too long ({desc_len} chars)")
        else:
            stats.ok(f"Meta description length OK ({desc_len} chars)")
    else:
        stats.err("Missing meta description")

    # Canonical
    if re.search(r'<link\s+rel="canonical"', content):
        stats.ok("Canonical link present")
    else:
        stats.warn("Missing canonical link tag")

    # H1 tag
    h1_count = len(re.findall(r"<h1[\s>]", content))
    if h1_count == 1:
        stats.ok("Exactly one H1 tag")
    elif h1_count == 0:
        stats.err("Missing H1 tag")
    else:
        stats.warn(f"Multiple H1 tags ({h1_count}) — should be exactly 1")

    # H2-H6 hierarchy
    headings = re.findall(r'<(h[1-6])[\s>]', content)
    levels = [int(h[1]) for h in headings]
    skip = False
    for i in range(1, len(levels)):
        if levels[i] > levels[i-1] + 1:
            stats.warn(f"Heading skip: H{levels[i-1]} → H{levels[i]}")
            skip = True
    if not skip:
        stats.ok("Heading hierarchy OK")

    # Image alt attributes
    imgs = re.findall(r'<img([^>]*)>', content)
    no_alt = 0
    for attrs in imgs:
        if 'alt=' not in attrs:
            no_alt += 1
    if no_alt == 0:
        stats.ok(f"All {len(imgs)} images have alt attributes")
    else:
        stats.warn(f"{no_alt}/{len(imgs)} images missing alt attribute")

    # ARIA landmarks
    aria_roles = re.findall(r'role="(banner|navigation|main|contentinfo|complementary|search)"', content)
    if len(aria_roles) >= 2:
        stats.ok(f"ARIA landmarks present: {', '.join(set(aria_roles))}")
    else:
        stats.warn("Few ARIA landmarks — improve accessibility")

    # Semantic HTML5
    semantic = []
    for tag in ["<header", "<nav", "<main", "<footer", "<article", "<section", "<aside"]:
        if tag in content:
            semantic.append(tag[1:])
    if len(semantic) >= 3:
        stats.ok(f"Semantic HTML5 tags: {', '.join(semantic)}")
    else:
        stats.warn(f"Only {len(semantic)} semantic tags found — use more HTML5 elements")

    return content


# ─── 2. Open Graph & Social Tags ─────────────────────────────────
def audit_og_tags(stats, html_content, filename):
    print(f"\n📱 2. Open Graph & Social Tags: {filename}")

    og_found = {}
    for tag in REQUIRED_OG_TAGS:
        pattern = re.compile(rf'<meta\s+property="{tag}"\s+content="(.*?)"', re.DOTALL)
        match = pattern.search(html_content)
        if match:
            og_found[tag] = match.group(1)

    for tag in REQUIRED_OG_TAGS:
        if tag in og_found:
            stats.ok(f"{tag} present")
        else:
            stats.err(f"Missing {tag}")

    # Check og:image is absolute URL
    og_img = og_found.get("og:image", "")
    if og_img and og_img.startswith("http"):
        stats.ok("og:image uses absolute URL")
    elif og_img:
        stats.warn(f"og:image should be absolute URL: {og_img}")

    # Twitter card
    for tag in REQUIRED_TWITTER_TAGS:
        if re.search(rf'<meta\s+name="{tag}"', html_content):
            stats.ok(f"Twitter {tag} present")
        else:
            stats.warn(f"Missing Twitter {tag}")

    # Structured data (JSON-LD)
    jsonld = re.findall(r'<script\s+type="application/ld\+json">(.*?)</script>', html_content, re.DOTALL)
    if jsonld:
        stats.ok(f"JSON-LD structured data present ({len(jsonld)} blocks)")
        for i, block in enumerate(jsonld):
            try:
                data = json.loads(block)
                if "@type" in data:
                    stats.ok(f"JSON-LD block {i+1}: @type={data['@type']}")
                else:
                    stats.warn(f"JSON-LD block {i+1}: missing @type")
            except json.JSONDecodeError:
                stats.warn(f"JSON-LD block {i+1}: invalid JSON")
    else:
        stats.warn("No JSON-LD structured data")


# ─── 3. Image Validation ─────────────────────────────────────────
def audit_images(stats, html_content, page_dir):
    print("\n🖼️  3. Image Validation")
    srcs = re.findall(r'<img[^>]+src="([^"]+)"', html_content)
    if not srcs:
        stats.warn("No images found in HTML")
        return

    seen = set()
    for src in srcs:
        if src.startswith("http") or src.startswith("data:"):
            continue
        if src in seen:
            continue
        seen.add(src)

        img_path = page_dir / src
        if img_path.exists():
            size_kb = img_path.stat().st_size / 1024
            ext = img_path.suffix.lower()
            if size_kb > 500:
                stats.warn(f"Large image ({size_kb:.0f}KB): {src}")
            if ext not in (".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif"):
                stats.warn(f"Non-standard image format ({ext}): {src}")
            stats.ok(f"Image exists: {src} ({size_kb:.0f}KB)")
        else:
            stats.err(f"Missing image: {src}")


# ─── 4. Link Validation ──────────────────────────────────────────
def audit_links(stats, html_content, page_dir):
    print("\n🔗 4. Link Validation")
    hrefs = re.findall(r'href="([^"]+)"', html_content)
    internal = [h for h in hrefs if not h.startswith(("http", "mailto:", "tel:", "#", "javascript:"))]

    for href in internal:
        if href.startswith("/"):
            # Cloudflare Pages — check public_dir
            check_path = PUBLIC_DIR / href.lstrip("/")
        else:
            check_path = page_dir / href
        if check_path.exists():
            stats.ok(f"Link OK: {href}")
        else:
            stats.warn(f"Broken internal link: {href}")


# ─── 5. Performance Indicators ────────────────────────────────────
def audit_performance(stats, html_content, filename):
    print("\n⚡ 5. Performance Indicators")

    # External scripts
    scripts = re.findall(r'<script[^>]+src="([^"]+)"', html_content)
    non_async = [s for s in scripts if "async" not in html_content.split(s)[0].split("<script")[-1]]
    if len(non_async) > 2:
        stats.warn(f"{len(non_async)} blocking scripts — consider async/defer")
    else:
        stats.ok(f"Script loading looks OK ({len(scripts)} scripts)")

    # CSS files
    css_files = re.findall(r'<link[^>]+href="([^"]+\.css)"', html_content)
    stats.ok(f"{len(css_files)} CSS file(s) loaded")

    # Preconnect hints
    preconnects = re.findall(r'rel="preconnect"', html_content)
    if len(preconnects) >= 2:
        stats.ok(f"Preconnect hints: {len(preconnects)}")
    else:
        stats.warn("Consider adding preconnect for external resources")

    # Lazy loading on images
    imgs = re.findall(r'<img([^>]*)>', html_content)
    lazy_count = sum(1 for a in imgs if "loading=" in a)
    if imgs:
        pct = (lazy_count / len(imgs)) * 100
        if pct >= 80:
            stats.ok(f"Lazy loading: {lazy_count}/{len(imgs)} images ({pct:.0f}%)")
        else:
            stats.warn(f"Only {lazy_count}/{len(imgs)} images have loading='lazy'")

    # Inline styles
    inline_styles = len(re.findall(r'style="', html_content))
    if inline_styles > 5:
        stats.warn(f"{inline_styles} inline styles — move to CSS")
    else:
        stats.ok(f"Inline styles minimal ({inline_styles})")


# ─── 6. Security Headers Check ───────────────────────────────────
def audit_security(stats):
    print("\n🔒 6. Security Headers (public/_headers)")
    headers_file = PUBLIC_DIR / "_headers"
    if not headers_file.exists():
        stats.warn("No _headers file for Cloudflare Pages")
        return

    content = headers_file.read_text()
    checks = {
        "X-Frame-Options": "Clickjacking protection",
        "X-Content-Type-Options": "MIME sniffing protection",
        "Referrer-Policy": "Referrer leakage protection",
        "Permissions-Policy": "Feature policy",
        "Content-Security-Policy": "XSS protection (CSP)",
        "Strict-Transport-Security": "HTTPS enforcement (HSTS)",
    }
    for header, desc in checks.items():
        if header in content:
            stats.ok(f"{header} ({desc})")
        else:
            stats.warn(f"Missing {header} — {desc}")


# ─── 7. Cloudflare Pages Config ───────────────────────────────────
def audit_cloudflare(stats):
    print("\n☁️  7. Cloudflare Pages Config")
    wrangler = ROOT_DIR / "wrangler.toml"
    if wrangler.exists():
        content = wrangler.read_text()
        if "pages" in content or "site" in content:
            stats.ok("wrangler.toml present with Pages config")
        else:
            stats.warn("wrangler.toml present but may be missing Pages config")
    else:
        stats.warn("No wrangler.toml found")

    redirects = PUBLIC_DIR / "_redirects"
    if redirects.exists():
        rules = [l for l in redirects.read_text().splitlines() if l.strip() and not l.startswith("#")]
        stats.ok(f"_redirects: {len(rules)} rule(s)")
    else:
        stats.warn("No _redirects file")


# ─── 8. Sitemap & Robots ─────────────────────────────────────────
def audit_seo_files(stats):
    print("\n🗺️  8. Sitemap & Robots")
    sitemap = PUBLIC_DIR / "sitemap.xml"
    if sitemap.exists():
        content = sitemap.read_text()
        urls = re.findall(r"<loc>(.*?)</loc>", content)
        stats.ok(f"sitemap.xml: {len(urls)} URLs")
        for u in urls[:5]:
            stats.ok(f"  Sitemap URL: {u}")
    else:
        stats.err("Missing sitemap.xml")

    robots = PUBLIC_DIR / "robots.txt"
    if robots.exists():
        stats.ok("robots.txt present")
    else:
        stats.warn("Missing robots.txt")


# ─── 9. Multi-page Consistency ────────────────────────────────────
def audit_consistency(stats):
    print("\n🔄 9. Multi-page Consistency Check")

    # Check if all pages share same OG image
    pages = list(PUBLIC_DIR.glob("*.html")) + list((PUBLIC_DIR / "lp").glob("*.html")) if (PUBLIC_DIR / "lp").exists() else list(PUBLIC_DIR.glob("*.html"))
    og_images = {}
    for p in pages:
        try:
            content = p.read_text(encoding="utf-8")
            match = re.search(r'og:image"\s+content="([^"]+)"', content)
            if match:
                og_images[p.name] = match.group(1)
        except Exception:
            pass

    if og_images:
        unique_images = set(og_images.values())
        if len(unique_images) == 1:
            stats.ok("All pages use same OG image (consistent branding)")
        else:
            stats.warn(f"OG images differ across pages: {len(unique_images)} unique")

    # Check if all pages link to same CSS/JS
    css_refs = set()
    for p in pages:
        try:
            content = p.read_text(encoding="utf-8")
            for css in re.findall(r'href="([^"]*\.css)"', content):
                css_refs.add(css)
        except Exception:
            pass
    stats.ok(f"{len(css_refs)} unique CSS references across pages")


# ─── Main ─────────────────────────────────────────────────────────
def main():
    print(f"{'='*60}")
    print("🔍 YPSMA Daarul Qolam — Website Audit")
    print(f"{'='*60}")
    print(f"📂 Base: {BASE_DIR}")
    print(f"📂 Public: {PUBLIC_DIR}")

    stats = Stats()

    # Find all HTML files
    html_files = list(PUBLIC_DIR.glob("*.html"))
    lp_dir = PUBLIC_DIR / "lp"
    if lp_dir.exists():
        html_files += list(lp_dir.glob("*.html"))
    blog_dir = PUBLIC_DIR / "blog"
    if blog_dir.exists():
        html_files += list(blog_dir.glob("*.html"))

    print(f"\n📄 Found {len(html_files)} HTML files")

    # Audit each page
    for html_path in sorted(html_files):
        page_dir = html_path.parent
        content = audit_html_structure(stats, html_path)
        audit_og_tags(stats, content, html_path.name)
        audit_images(stats, content, page_dir)
        audit_links(stats, content, page_dir)
        audit_performance(stats, content, html_path.name)

    # Global checks
    audit_security(stats)
    audit_cloudflare(stats)
    audit_seo_files(stats)
    audit_consistency(stats)

    # Summary
    success = stats.summary()
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
