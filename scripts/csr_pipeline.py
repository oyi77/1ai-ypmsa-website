#!/usr/bin/env python3
"""
CSR Pipeline — research → draft → enrich → export → outreach → discover
Usage:
    python3 scripts/csr_pipeline.py --stage all [--dry-run] [--force] [--company <key>]

Stages:
  research   Auto-discover CSR contact info via web scraping + verification
  draft      Generate proposal markdown from config template (skips existing unless --force)
  enrich     Add budget table, program costs & company-specific personalization
  export     Convert enriched proposals to professional PDFs
  outreach   Send proposals via SMTP (reuses send_csr_proposals.py logic)
  discover   Explore web for potential CSR partners not yet in config
  all        Run all stages in sequence

Config: csr_config.yaml (YPSMA profile + company targets)
"""

import argparse
import json
import re
import os
import smtplib
import subprocess
import sys
import time
import textwrap
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

import yaml
from weasyprint import HTML


BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONFIG_PATH = os.environ.get('CSR_CONFIG', os.path.join(BASE, 'csr_config.yaml'))

# ── SMTP (mirrors send_csr_proposals.py) ──────────────────────────────
SMTP_HOST = os.environ.get('SMTP_HOST', 'smtp.gmail.com')
SMTP_PORT = int(os.environ.get('SMTP_PORT', '587'))
SMTP_USER = os.environ.get('SMTP_USER', 'grahainsanmandiri@gmail.com')
SMTP_PASS = os.environ.get('SMTP_PASS', '')
FROM_ADDR = os.environ.get('FROM_ADDR', 'admin@ypsma.org')
FROM_NAME = os.environ.get('FROM_NAME', "YPSMA - Yayasan Pendidikan dan Sosial Ma'arif")



# ── Sent log — prevent double-send ──────────────────────────────────────
_SENT_LOG_PATH = os.path.join(BASE, 'csr_sent_log.yaml')

def _load_sent_log():
    """Return dict of {key: {email, timestamp, proposal}}."""
    if not os.path.isfile(_SENT_LOG_PATH):
        return {}
    with open(_SENT_LOG_PATH) as f:
        entries = yaml.safe_load(f) or []
    return {e['key']: e for e in entries}

def _update_config_company(key, **updates):
    """Update one company's fields in csr_config.yaml and return updated company dict."""
    cfg = load_config()
    for c in cfg['companies']:
        if c['key'] == key:
            changed = False
            for k, v in updates.items():
                if v is not None and c.get(k) != v:
                    c[k] = v
                    changed = True
            if changed:
                with open(CONFIG_PATH, 'w') as f:
                    yaml.dump(cfg, f, default_flow_style=False, sort_keys=False, allow_unicode=True)
                print(f"         ✓ Config updated: {', '.join(updates.keys())}")
            return c
    return None

def _save_sent_log(entries):
    """Persist list of dicts sorted by key."""
    lst = sorted(entries.values(), key=lambda e: e['key'])
    with open(_SENT_LOG_PATH, 'w') as f:
        yaml.dump(lst, f, default_flow_style=False, sort_keys=False)
    os.chmod(_SENT_LOG_PATH, 0o644)

def _is_sent(key):
    return key in _load_sent_log()

def _mark_sent(key, name, email, proposal_file=''):
    entries = _load_sent_log()
    entries[key] = {'key': key, 'name': name, 'email': email,
                    'proposal': proposal_file,
                    'timestamp': __import__('datetime').datetime.now().isoformat()}
    _save_sent_log(entries)


# ── Web helpers ──────────────────────────────────────────────────────────
_USER_AGENT = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'

def _fetch(url, timeout=10):
    """Fetch URL, return decoded text or None."""
    import urllib.request, urllib.error
    try:
        req = urllib.request.Request(url, headers={'User-Agent': _USER_AGENT})
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.read().decode('utf-8', errors='replace')
    except Exception:
        return None

def _extract_emails(text):
    """Return set of all email addresses found in text."""
    return set(re.findall(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', text or ''))

def _extract_csr_emails(found):
    """Filter emails likely related to CSR."""
    return {e for e in found if any(k in e.lower()
        for k in ('csr', 'tjsl', 'corsec', 'corporate.secretary',
                  'info', 'contact', 'relations', 'comms'))} or found


def _canonical_bumn_name(text):
    """Normalize BUMN name for dedup: strip (Persero)/Tbk/PT/Perum prefixes."""
    n = re.sub(r'\s*\(.*?\)\s*', ' ', text)
    n = re.sub(r'\s+Tbk$', '', n, flags=re.IGNORECASE)
    n = re.sub(r'\s+Ltd\.?$', '', n, flags=re.IGNORECASE)
    n = re.sub(r'\s+Inc\.?$', '', n, flags=re.IGNORECASE)
    n = n.strip()
    for pf in ['PT ', 'Perum ']:
        if n.startswith(pf):
            n = n[len(pf):].strip()
            break
    return re.sub(r'\s+', '', n.lower()).replace('.', '')
def _try_domain_patterns(name):
    """Try common domain patterns for a company, return first that resolves."""
    slug = name.lower().replace(' ', '').replace('(persero)', '').replace('.', '').strip()
    # Truncate slug to DNS safe length (max 63 chars per label)
    slug = slug[:63]
    slugs = [slug]
    # Also try hyphenated
    slug_h = name.lower().replace(' ', '-').replace('(persero)', '').replace('.', '').strip()[:63]
    if slug_h != slug:
        slugs.append(slug_h)
    domains = []
    for s in slugs:
        for tld in ['.co.id', '.com', '.id']:
            domains.append(f'{s}{tld}')
            domains.append(f'www.{s}{tld}')
    seen = set()
    for d in domains:
        if d in seen:
            continue
        seen.add(d)
        try:
            import socket
            socket.getaddrinfo(d, 80, socket.AF_INET, socket.SOCK_STREAM)
            return f'https://{d}'
        except OSError:
            continue
        except UnicodeEncodeError:
            continue
    return None

def _scrape_csr_pages(domain, name):
    """Given a base domain, search for TJSL/CSR pages and extract emails."""
    base = domain.rstrip('/')
    paths = [
        '/tjsl', '/csr', '/tentang-kami/tjsl', '/id/tjsl',
        '/tentang_kami', '/tentang-kami', '/id/tentang-kami',
        '/hubungi-kami', '/contact', '/id/contact',
        '/program-csr', '/program-tjsl',
    ]
    all_emails = set()
    for p in paths:
        text = _fetch(f'{base}{p}')
        if text:
            found = _extract_emails(text)
            if found:
                all_emails.update(found)
    if all_emails:
        csr = _extract_csr_emails(all_emails)
        return csr or all_emails
    # Fallback: scrape homepage
    text = _fetch(base)
    if text:
        found = _extract_emails(text)
        if found:
            return _extract_csr_emails(found)
    return set()
# ── Config ─────────────────────────────────────────────────────────────

def load_config():
    with open(CONFIG_PATH) as f:
        return yaml.safe_load(f)


def get_companies(cfg, key_filter=None):
    """Return list of companies matching key_filter (None = all)."""
    all_c = cfg['companies']
    if not key_filter or key_filter == 'all':
        return all_c
    matches = [c for c in all_c if c['key'] == key_filter]
    if not matches:
        print(f"  ✗ Unknown company key: {key_filter}")
        sys.exit(1)
    return matches


# ── STAGE: research ────────────────────────────────────────────────────

# Customised greeting per company — matches send_csr_proposals.py
_GREETINGS = {
    'Bank Jatim':
        'Sebagai Bank Pembangunan Daerah Jawa Timur, kami percaya Bank Jatim memiliki komitmen '
        'kuat dalam memajukan pendidikan di Jawa Timur melalui program CSR.',
    'Bank Syariah Indonesia':
        'Sebagai bank syariah terbesar di Indonesia, kami percaya BSI memiliki perhatian besar '
        'pada pendidikan dan pemberdayaan umat melalui program CSR dan ZISWAF.',
    'Pertamina':
        'Sebagai perusahaan energi nasional, kami percaya Pertamina memiliki komitmen kuat '
        'terhadap pendidikan dan pemberdayaan masyarakat melalui program CSR.',
    'PLN':
        'Sebagai perusahaan listrik negara, kami percaya PLN memiliki perhatian pada pendidikan '
        'dan pengembangan sumber daya manusia melalui program CSR.',
    'PT Semen Indonesia (SIG)':
        'Sebagai perusahaan semen terkemuka di Indonesia, kami percaya SIG memiliki komitmen '
        'terhadap pendidikan dan pemberdayaan masyarakat melalui program CSR.',
    'Telkom Indonesia':
        'Sebagai perusahaan telekomunikasi nasional, kami percaya Telkom memiliki komitmen kuat '
        'dalam mendorong transformasi digital pendidikan melalui program CSR dan TJSL.',
    'Bank Central Asia (BCA)':
        'Sebagai bank swasta terbesar di Indonesia, kami percaya Bakti BCA memiliki perhatian besar '
        'pada peningkatan kualitas pendidikan melalui program perpustakaan pintar dan renovasi sekolah.',
    'Bank Mandiri':
        'Sebagai bank BUMN terkemuka, kami percaya Mandiri Peduli memiliki komitmen kuat pada '
        'pendidikan melalui program beasiswa dan pengembangan literasi.',
    'Bank Rakyat Indonesia (BRI)':
        'Sebagai bank rakyat Indonesia, kami percaya BRI Peduli dan YBM BRILiaN memiliki perhatian '
        'besar pada pendidikan, khususnya bagi masyarakat kurang mampu.',
    'Bank Negara Indonesia (BNI)':
        'Sebagai bank BUMN yang telah lama berkontribusi pada pendidikan nasional, kami percaya '
        'BNI Peduli memiliki komitmen terhadap peningkatan akses pendidikan berkualitas.',
    'PT Kereta Api Indonesia':
        'Sebagai perusahaan transportasi nasional yang melayani jutaan penumpang, kami percaya KAI '
        'memiliki perhatian pada pendidikan masyarakat di wilayah operasionalnya melalui program TJSL.',
    'Astra International':
        'Sebagai perusahaan swasta nasional terkemuka, kami percaya Astra memiliki kepedulian tinggi '
        'pada pengembangan sumber daya manusia melalui program pendidikan dan kewirausahaan.',
    'Adhi Karya':
        'Sebagai BUMN konstruksi terkemuka, kami percaya Adhi Karya memiliki komitmen terhadap '
        'pembangunan infrastruktur pendidikan dan pemberdayaan masyarakat melalui program TJSL.',
    'Bali TV':
        'Sebagai televisi lokal yang dekat dengan masyarakat Bali, kami percaya Bali TV memiliki '
        'perhatian pada pendidikan dan pelestarian budaya Bali melalui program CSR.',
    'Bank BJB':
        'Sebagai Bank Pembangunan Daerah Jawa Barat, kami percaya BJB memiliki komitmen kuat '
        'dalam memajukan pendidikan di Jawa Barat melalui program CSR dan TJSL.',
    'Barata Indonesia':
        'Sebagai BUMN manufaktur, kami percaya Barata Indonesia memiliki kepedulian pada '
        'pendidikan vokasi dan pemberdayaan masyarakat di sekitar wilayah operasionalnya.',
    'Blue Bird':
        'Sebagai perusahaan transportasi terkemuka, kami percaya Blue Bird Peduli memiliki '
        'perhatian pada pendidikan dan pemberdayaan masyarakat melalui program CSR.',
    'Brantas Abipraya':
        'Sebagai BUMN konstruksi yang telah banyak membangun infrastruktur sosial, kami percaya '
        'Brantas Abipraya memiliki komitmen pada pendidikan dan pemberdayaan masyarakat.',
    'INKA':
        'Sebagai BUMN perkeretaapian satu-satunya di Indonesia, kami percaya INKA memiliki '
        'perhatian pada pendidikan vokasi dan pengembangan SDM industri perkeretaapian.',
    'JTV Surabaya':
        'Sebagai televisi lokal Jawa Timur, kami percaya JTV memiliki perhatian pada pendidikan '
        'dan pengembangan literasi masyarakat Jawa Timur.',
    'Kimia Farma':
        'Sebagai BUMN farmasi terkemuka, kami percaya Kimia Farma Peduli memiliki komitmen '
        'pada pendidikan kesehatan dan peningkatan kualitas kesehatan masyarakat.',
    'Len Industri':
        'Sebagai BUMN elektronik dan telematika nasional, kami percaya Len Industri memiliki '
        'perhatian pada pendidikan teknologi dan inovasi digital melalui program TJSL.',
    'Pelabuhan Indonesia':
        'Sebagai BUMN pelabuhan terbesar di Indonesia, kami percaya Pelindo Peduli memiliki '
        'komitmen pada pendidikan dan pemberdayaan masyarakat pesisir.',
    'Perum Peruri':
        'Sebagai BUMN percetakan uang negara, kami percaya Peruri memiliki perhatian pada '
        'pendidikan dan pemberdayaan masyarakat melalui program TJSL.',
    'Pindad':
        'Sebagai BUMN industri pertahanan nasional, kami percaya Pindad Peduli memiliki '
        'komitmen pada pendidikan vokasi dan pengembangan SDM Indonesia.',
    'Pupuk Indonesia':
        'Sebagai BUMN pupuk terbesar di Indonesia, kami percaya Pupuk Indonesia memiliki '
        'perhatian pada pendidikan dan pemberdayaan petani melalui program TJSL.',
    'Waskita Karya':
        'Sebagai BUMN konstruksi nasional, kami percaya Waskita Karya memiliki komitmen pada '
        'pembangunan infrastruktur pendidikan dan pemberdayaan masyarakat melalui TJSL.',
    'Wijaya Karya':
        'Sebagai BUMN konstruksi terkemuka, kami percaya Wijaya Karya (WIKA) memiliki perhatian '
        'pada pendidikan dan pemberdayaan masyarakat melalui program TJSL.',
}

def _search_query(c):
    return f'CSR {c["name"]} {" ".join(c["csr_focus"][:2])} kontak email'


def _check_domain(email):
    """Basic domain validity check — resolves MX or A record."""
    domain = email.split('@')[-1]
    try:
        import dns.resolver
        try:
            mx = dns.resolver.resolve(domain, 'MX')
            return True
        except (dns.resolver.NoAnswer, dns.resolver.NXDOMAIN):
            try:
                dns.resolver.resolve(domain, 'A')
                return True
            except Exception:
                return False
    except ImportError:
        return None  # dns not available — skip check


def _scrape_tjsl(company):
    """Try to find CSR contact info for a company by scraping its website."""
    name = company['name']
    csr_website = company.get('csr_website', '')

    if csr_website:
        emails = _scrape_csr_pages(csr_website, name)
        if emails:
            print(f"         ✓ Emails from CSR page: {', '.join(sorted(emails)[:3])}")
            return emails

    # Try to find the company's domain
    domain = _try_domain_patterns(name)
    if domain:
        print(f"         ✓ Found domain: {domain}")
        emails = _scrape_csr_pages(domain, name)
        if emails:
            print(f"         ✓ Emails found: {', '.join(sorted(emails)[:3])}")
            return emails
        print(f"         ≈ Domain OK but no CSR email found")
        return None

    print(f"         ✗ Could not find company domain")
    return None


def stage_research(cfg, companies, dry_run):
    """Research CSR contact info via web scraping + domain verification."""
    print(f"\n{'='*60}")
    print("STAGE: research")
    print(f"{'='*60}\n")

    verified = 0
    found_online = 0
    no_verify = 0

    for c in companies:
        name = c['name']
        key = c['key']
        email = c.get('email', '')
        pf = c.get('proposal_file', '')
        has_proposal = os.path.isfile(os.path.join(BASE, pf)) if pf else False
        status = '✓' if has_proposal else ' '

        print(f"  [{status}] {name} ({key})")
        print(f"         Email di config: {email}")
        print(f"         CSR Program: {c['csr_name']}")

        # 1. Validate email domain
        if email and '@' in email:
            if email.endswith('@gmail.com') or email.endswith('@yahoo.com'):
                print(f"         ⚠  Email pakai {email.split('@')[1]} — cari alamat korporat")
                no_verify += 1
            else:
                domain_ok = _check_domain(email)
                if domain_ok is True:
                    print(f"         ✓ Domain {email.split('@')[1]} valid (MX records found)")
                    verified += 1
                elif domain_ok is None:
                    print(f"         ~ Domain check skipped (pip install dnspython utk verifikasi)")
                else:
                    print(f"         ✗ Domain {email.split('@')[1]} tdk ditemukan — email mungkin invalid")
                    no_verify += 1
        else:
            print(f"         ✗ Tdak ada email di config — perlu research manual")
            no_verify += 1

        # 2. Try to scrape TJSL page for better contacts
        if not dry_run:
            result = _scrape_tjsl(c)
            if result:
                found_online += 1
                csr_specific = [e for e in result if 'csr' in e.lower() or 'tjsl' in e.lower()]
                if csr_specific:
                    print(f"         ⚡ CSR-specific email found: {csr_specific[0]}")

        # 3. Auto-discover — find website/email for companies missing them
        if not dry_run:
            old_website = c.get('csr_website', '')
            old_email = c.get('email', '')
            updates = {}

            # Discover website if missing
            if not old_website:
                domain = _try_domain_patterns(name)
                if domain:
                    updates['csr_website'] = domain
                    print(f"         ⚡ Auto-discovered website: {domain}")

            # Save emails found during scrape if we have no email in config
            if not old_email and result:
                best = next((e for e in result if 'csr' in e.lower() or 'tjsl' in e.lower()
                             or 'infocorsec' in e.lower() or 'relations' in e.lower()), None)
                if best:
                    updates['email'] = best
                    print(f"         ⚡ Auto-set email from scrape: {best}")

            if updates:
                _update_config_company(key, **updates)
        else:
            print(f"         Search query: {_search_query(c)}")

        print()

    # Summary
    print(f"  ── Research Summary ──")
    print(f"     Companies: {len(companies)}")
    print(f"     ✓ Domain verified:  {verified}")
    print(f"     ⚡ Online scraped:   {found_online}")
    print(f"     ✗ Needs attention:  {no_verify}")
    if dry_run:
        print("     [dry-run] — tidak ada web scraping.\n")
    else:
        print()




# ── STAGE: draft (base proposal generation) ────────────────────────────

_DRAFT_TEMPLATE = textwrap.dedent("""\
    # PROPOSAL CSR — {company[name]}

    **Pengirim:** {ypsma[name]} ({ypsma[acronym]})
    **Website:** {ypsma[website]}
    **Kontak:** {ypsma[email]} / {ypsma[phone]}

    ---

    ## Ringkasan Eksekutif

    YPSMA mengelola {ypsma[total_students]} siswa/santri di {ypsma_unit_count} unit pendidikan di Mojowarno, Jombang.
    Kami mengajukan kemitraan CSR melalui **{company[csr_name]}** untuk mendukung pendidikan dan pemberdayaan masyarakat.

    ## Profil Yayasan

    | Item | Detail |
    |---|---|
    | Nama | {ypsma[aka]} |
    | Alamat | {ypsma[address]} |
    | Tahun Berdiri | {ypsma[established]} |
    | Legalitas | SK Kemenkumham {ypsma[ahu]} |
    | Unit Pendidikan | {units_summary} |
    | Total | {ypsma[total_students]} jiwa |
    | Guru/Pengurus | {ypsma[total_staff]} orang |

    ## Program yang Diajukan

    _[DRAFT — silakan sesuaikan program dan anggaran dengan prioritas CSR {company[name]}]_

    Program-program yang kami ajukan:

    {programs_desc}

    ## Kesesuaian dengan Program CSR {company[csr_name]}

    {company[csr_name]} memiliki fokus pada:
    {focus_list}

    Program yang kami ajukan sejalan dengan fokus CSR tersebut. Detail lengkap RAB
    dan dokumen pendukung tersedia dan dapat dikirimkan sesuai permintaan.

    ## Donasi Langsung

    Jika program CSR belum memungkinkan, YPSMA menerima donasi langsung melalui:

    - **Sociabuzz:** {ypsma[donation][sociabuzz]}
    - **Bank:** {ypsma[donation][bank_account][bank]} {ypsma[donation][bank_account][number]} a.n. {ypsma[donation][bank_account][name]}
    - **WhatsApp Donasi:** {ypsma[donation][wa_donasi]}
    - **Website:** {ypsma[donation][qris_url]}

    Wassalamu'alaikum warahmatullahi wabarakatuh,

    _Drs. H. Syamsun Huda Amir_
    Ketua YPSMA
""")


def _units_summary(ypsma):
    parts = [f"{u['name']} ({u['students']} siswa)" for u in ypsma['units']]
    return ', '.join(parts)


def _programs_desc(company):
    # Map program keys to descriptions
    desc_map = {
        'renovasi_kelas':
            '### 1. Renovasi Ruang Kelas dan Perpustakaan\n\n'
            'Renovasi 3 ruang kelas dan perpustakaan MI Sulamuddiniyah untuk menciptakan '
            'lingkungan belajar yang layak bagi 178 siswa.\n',
        'renovasi_sekolah':
            '### 1. Renovasi Sarana Sekolah\n\n'
            'Perbaikan infrastruktur sekolah di 4 unit pendidikan: ruang kelas, sanitasi, '
            'dan area belajar.\n',
        'beasiswa':
            '### 2. Beasiswa untuk 50 Siswa Berprestasi\n\n'
            'Beasiswa @Rp 100.000/siswa/bulan selama 12 bulan untuk siswa berprestasi '
            'dari keluarga kurang mampu.\n',
        'taman_bacaan':
            '### 2. Pembangunan Taman Bacaan & Perpustakaan\n\n'
            'Membangun ruang baca dan taman literasi untuk mendukung minat baca siswa.\n',
        'lab_komputer':
            '### 1. Laboratorium Komputer dan Internet\n\n'
            'Pembangunan lab komputer dengan 10 unit PC dan koneksi internet untuk '
            'mendukung literasi digital siswa.\n',
        'literasi_digital':
            '### 2. Program Literasi Digital\n\n'
            'Pelatihan literasi digital untuk guru dan siswa, termasuk pengenalan '
            'teknologi pembelajaran berbasis digital.\n',
        'pondok_pesantren':
            '### 2. Pengembangan Pondok Pesantren\n\n'
            'Dukungan operasional dan sarana prasarana PPTQ Darussalam yang menaungi '
            '233 santri penghafal Al-Qur\'an.\n',
        'pemberdayaan_ekonomi':
            '### 3. Program Pemberdayaan Ekonomi Orang Tua Santri\n\n'
            'Pelatihan keterampilan dan modal usaha untuk orang tua santri guna '
            'meningkatkan kemandirian ekonomi keluarga.\n',
        'kewirausahaan_santri':
            '### 1. Program Kewirausahaan Santri\n\n'
            'Pelatihan kewirausahaan dan pengembangan life skills untuk santri PPTQ '
            'dan siswa SMP agar memiliki bekal kemandirian ekonomi.\n',
    }
    result = []
    for prog in company.get('programs', []):
        desc = desc_map.get(prog)
        if desc:
            result.append(desc)
    if not result:
        result.append("Program kemitraan pendidikan sesuai kebutuhan yayasan.\n")
    return '\n'.join(result)


def _focus_list(company):
    lines = [f"1. **{f}**" for f in company.get('csr_focus', [])]
    return '\n    '.join(lines)


def stage_draft(cfg, companies, dry_run, force):
    """Generate draft proposals from templates for companies without existing files."""
    print(f"\n{'='*60}")
    print("STAGE: draft — generate base proposals")
    print(f"{'='*60}\n")

    ypsma = cfg['ypsma']
    generated = 0
    skipped = 0

    for c in companies:
        pf = c.get('proposal_file', '')
        proposal_path = os.path.join(BASE, pf) if pf else None

        if proposal_path and os.path.isfile(proposal_path) and not force:
            print(f"  [→] {c['name']} — proposal exists, skipping (--force to regenerate)")
            skipped += 1
            continue

        if dry_run:
            print(f"  [☐] {c['name']} — would generate DRAFT proposal")
            generated += 1
            continue

        # Precompute template helpers
        ypsma_unit_count = len(ypsma.get('units', []))
        units_summary = _units_summary(ypsma)
        programs_desc = _programs_desc(c)
        focus_list = _focus_list(c)

        content = _DRAFT_TEMPLATE.format(
            company=c,
            ypsma=ypsma,
            ypsma_unit_count=ypsma_unit_count,
            units_summary=units_summary,
            programs_desc=programs_desc,
            focus_list=focus_list,
        )

        # Write
        if proposal_path:
            os.makedirs(os.path.dirname(proposal_path), exist_ok=True)
            with open(proposal_path, 'w') as f:
                f.write(f"<!-- DRAFT — generated by csr_pipeline.py -->\n")
                f.write(f"<!-- Review and customize before sending! -->\n\n")
                f.write(content)
            print(f"  [✓] {c['name']} → {pf}  [DRAFT — needs review]")
            generated += 1
        else:
            print(f"  [!] {c['name']} — no proposal_file in config, skipping")

    print(f"\n  Summary: {generated} generated, {skipped} skipped\n")


# ── STAGE: enrich (enrich proposals with budget & personalization) ─────

_ENRICH_BUDGET = {
    'renovasi_kelas': ('Renovasi 3 Ruang Kelas + Perpustakaan', 'Rp 185.000.000'),
    'renovasi_sekolah': ('Renovasi Sarana Sekolah (4 unit)', 'Rp 250.000.000'),
    'beasiswa': ('Beasiswa 50 Siswa/Santri × 12 bln', 'Rp 60.000.000'),
    'taman_bacaan': ('Pembangunan Taman Bacaan & Perpustakaan', 'Rp 75.000.000'),
    'lab_komputer': ('Laboratorium Komputer 10 PC + Internet', 'Rp 120.000.000'),
    'literasi_digital': ('Program Literasi Digital (guru + siswa)', 'Rp 35.000.000'),
    'pondok_pesantren': ('Pengembangan PPTQ Darussalam', 'Rp 150.000.000'),
    'pemberdayaan_ekonomi': ('Program Pemberdayaan Ekonomi Orang Tua Santri', 'Rp 100.000.000'),
    'kewirausahaan_santri': ('Program Kewirausahaan Santri', 'Rp 50.000.000'),
    'santunan_anak_yatim': ('Santunan Anak Yatim & Dhuafa (100 jiwa)', 'Rp 36.000.000'),
    'pelatihan_guru': ('Pelatihan Guru & Tenaga Pendidik', 'Rp 45.000.000'),
    'beasiswa_prestasi': ('Beasiswa Prestasi 20 Siswa × 12 bln', 'Rp 48.000.000'),
}


def _enrich_proposal(content, company):
    """Enrich base proposal with budget table and company-specific data."""
    programs_raw = company.get('programs', {})
    # support both list and dict formats
    if isinstance(programs_raw, list):
        programs = {k: k for k in programs_raw}
    else:
        programs = programs_raw
    budget_rows = []
    total = 0
    for prog_key, _prog_name in sorted(programs.items()):
        line = _ENRICH_BUDGET.get(prog_key)
        if line:
            budget_rows.append(f'| {line[0]} | {line[1]} |')
            total += int(line[1].replace('Rp ', '').replace('.', ''))
        else:
            budget_rows.append(f'| {prog_key} | (estimasi menyusul) |')

    summary_total = f'Rp {total:,}'.replace(',', '.') if total > 0 else '(menyusul)'
    budget_table = f"""\
## Rencana Anggaran (RAB)

Berikut estimasi anggaran program yang diajukan:

| Program | Estimasi Biaya |
|---------|--------------|
{chr(10).join(budget_rows)}
| **Total** | **{summary_total}** |
"""

    # Try placeholder with company name first, then crs_name
    for tmpl_name in (company.get('name', ''), company.get('csr_name', '')):
        placeholder = f'_[DRAFT — silakan sesuaikan program dan anggaran dengan prioritas CSR {tmpl_name}]_'
        if placeholder in content:
            content = content.replace(placeholder, budget_table)
            return content

    # Fallback: insert before known donation heading
    for heading in ('## Donasi Langsung', '## Cara Mendukung YPSMA'):
        if heading in content:
            content = content.replace(heading, f'{budget_table}\n\n{heading}')
            return content

    # Last resort: append
    content += f'\n\n{budget_table}'
    return content




def stage_enrich(cfg, companies, dry_run, force):
    """Enrich draft proposals with budget details and company-specific data."""
    print(f"\n{'='*60}")
    print("STAGE: enrich — add budget & personalization to proposals")
    print(f"{'='*60}\n")

    enriched = 0
    skipped = 0

    for c in companies:
        pf = c.get('proposal_file', '')
        proposal_path = os.path.join(BASE, pf) if pf else None

        if not proposal_path or not os.path.isfile(proposal_path):
            print(f"  [!] {c['name']} — no proposal file, run --stage draft first")
            skipped += 1
            continue

        with open(proposal_path) as f:
            content = f.read()

        if 'ENRICHED' in content and not force:
            print(f"  [→] {c['name']} — already enriched, skipping (--force to re-enrich)")
            skipped += 1
            continue

        if dry_run:
            print(f"  [☐] {c['name']} — would enrich proposal")
            enriched += 1
            continue

        enriched_content = _enrich_proposal(content, c)
        with open(proposal_path, 'w') as f:
            f.write(enriched_content)
        print(f"  [✓] {c['name']} — enriched with budget & CSR alignment")
        enriched += 1

    print(f"\n  Summary: {enriched} enriched, {skipped} skipped\n")


def _md_to_pdf_html(proposal_text):
    """Convert proposal markdown to styled HTML for PDF output via weasyprint."""
    from markdown_it import MarkdownIt
    md = MarkdownIt()
    body_html = md.render(proposal_text)

    css = """\
<style>
@page {
    size: A4;
    margin: 2.2cm 2.5cm;
    @bottom-center {
        content: counter(page) " / " counter(pages);
        font-size: 9pt;
        color: #888;
        font-family: 'DejaVu Sans', sans-serif;
    }
}
body {
    font-family: 'DejaVu Serif', Georgia, serif;
    font-size: 11pt;
    line-height: 1.7;
    color: #222;
}
h1 {
    font-size: 17pt;
    color: #1a5276;
    text-align: center;
    border-bottom: 2.5px solid #1a5276;
    padding-bottom: 8pt;
    margin-bottom: 22pt;
    font-family: 'DejaVu Sans', sans-serif;
}
h2 {
    font-size: 13pt;
    color: #1a5276;
    margin-top: 26pt;
    margin-bottom: 10pt;
    font-family: 'DejaVu Sans', sans-serif;
    border-bottom: 1px solid #d4e6f1;
    padding-bottom: 4pt;
}
h3 {
    font-size: 11.5pt;
    color: #2c3e50;
    margin-top: 18pt;
    margin-bottom: 6pt;
    font-family: 'DejaVu Sans', sans-serif;
}
p { margin: 7pt 0; text-align: justify; }
table {
    width: 100%;
    border-collapse: collapse;
    margin: 14pt 0;
    font-size: 10pt;
}
th, td {
    border: 1px solid #bbb;
    padding: 7pt 10pt;
    text-align: left;
}
th {
    background: #1a5276;
    color: #fff;
    font-family: 'DejaVu Sans', sans-serif;
    font-weight: bold;
}
tr:nth-child(even) td { background: #f8f9fa; }
ul, ol { margin: 6pt 0; padding-left: 22pt; }
li { margin: 3pt 0; }
strong { color: #1a5276; }
hr {
    border: none;
    border-top: 1px solid #ddd;
    margin: 22pt 0;
}
.letterhead {
    text-align: center;
    margin-bottom: 22pt;
    border-bottom: 1px solid #ddd;
    padding-bottom: 14pt;
}
.letterhead .org {
    font-size: 16pt;
    font-weight: bold;
    color: #1a5276;
    font-family: 'DejaVu Sans', sans-serif;
}
.letterhead .sub {
    font-size: 9.5pt;
    color: #666;
    margin-top: 3pt;
}
.letterhead .tagline {
    font-size: 8.5pt;
    color: #999;
    margin-top: 2pt;
    font-style: italic;
}
.page-footer {
    text-align: center;
    font-size: 8.5pt;
    color: #aaa;
    margin-top: 30pt;
    border-top: 1px solid #eee;
    padding-top: 6pt;
}
</style>"""

    html = f"""<!DOCTYPE html>
<html><head><meta charset="UTF-8">{css}</head><body>
<div class="letterhead">
    <div class="org">Yayasan Pendidikan dan Sosial Ma'arif (YPSMA)</div>
    <div class="sub">Jl. Diponegoro, Mojowarno, Jombang, Jawa Timur</div>
    <div class="tagline">admin@ypsma.org | 0321 - 493147 | https://ypsma.org</div>
</div>
{body_html}
<div class="page-footer">
    YPSMA — Yayasan Pendidikan dan Sosial Ma'arif | Jl. Diponegoro, Mojowarno, Jombang
</div>
</body></html>"""
    return html


def stage_export(cfg, companies, dry_run, force=False):
    """Generate PDF versions of proposals from enriched markdown."""
    print(f"\n{'='*60}")
    print("STAGE: export — convert proposals to PDF")
    print(f"{'='*60}\n")

    exported = 0
    skipped = 0
    errors = 0

    for c in companies:
        pf = c.get('proposal_file', '')
        if not pf:
            print(f"  [ ] {c['name']} — no proposal_file, skipping")
            skipped += 1
            continue

        md_path = os.path.join(BASE, pf)
        pdf_path = os.path.splitext(md_path)[0] + '.pdf'

        if not os.path.isfile(md_path):
            print(f"  [ ] {c['name']} — {pf} not found, skipping")
            skipped += 1
            continue

        if os.path.isfile(pdf_path) and not force:
            print(f"  [·] {c['name']} — PDF exists, use --force to rebuild")
            skipped += 1
            continue

        with open(md_path) as f:
            proposal_text = f.read()

        if dry_run:
            print(f"  [ ] {c['name']} → {os.path.basename(pdf_path)} (dry-run)")
            exported += 1
            continue

        try:
            html_str = _md_to_pdf_html(proposal_text)
            HTML(string=html_str).write_pdf(pdf_path)
            print(f"  [✓] {c['name']} → {os.path.basename(pdf_path)}")
            exported += 1
        except Exception as e:
            print(f"  [✗] {c['name']}: {e}")
            errors += 1

    print(f"\n  Summary: {exported} exported, {skipped} skipped, {errors} errors\n")


# ── STAGE: outreach (send proposals via SMTP) ────────────────────────────
def _md_to_html(proposal_text):
    """Convert proposal markdown to basic HTML inline (mirrors send_csr_proposals.py)."""
    parts = []

    for line in proposal_text.split('\n'):
        line = line.strip()
        if not line:
            continue
        if line.startswith('## '):
            parts.append(f'<h3 style="color:#1a5276;margin-top:20px">{line[3:]}</h3>')
        elif line.startswith('### '):
            parts.append(f'<h4 style="color:#2c3e50">{line[4:]}</h4>')
        elif line.startswith('- '):
            parts.append(f'<li>{line[2:]}</li>')
        elif line.startswith('|') and '---' not in line:
            continue
        elif line.startswith('**') and line.endswith('**'):
            parts.append(f'<p><strong>{line.strip("*")}</strong></p>')
        elif line:
            parts.append(f'<p>{line}</p>')
    return '\n'.join(parts)


def _build_email(comp_name, proposal_path, to_email, greeting, dry_run=False):
    """Build HTML email body from proposal markdown file."""
    with open(proposal_path) as f:
        proposal_text = f.read()

    # Find the actual title — skip HTML comment lines at top
    title = 'Program CSR'
    for line in proposal_text.split('\n'):
        if line.startswith('# PROPOSAL CSR — '):
            title = line.replace('# PROPOSAL CSR — ', '').strip()
            break
    html_body = _md_to_html(proposal_text)

    html = f"""<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="font-family:Arial,sans-serif;color:#333;margin:0;padding:0;background:#f5f5f5">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 20px">
<table width="640" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden">
<tr><td style="background:#1a5276;padding:25px;text-align:center">
<h1 style="color:#fff;margin:0;font-size:24px">YPSMA</h1>
<p style="color:#aed6f1;margin:4px 0 0;font-size:13px">Yayasan Pendidikan dan Sosial Ma'arif</p>
</td></tr>
<tr><td style="padding:30px">
<p style="font-size:15px;color:#555">Kepada Yth.<br><strong>Tim CSR {comp_name}</strong></p>
<p>Assalamu'alaikum warahmatullahi wabarakatuh,</p>
<p>Dengan hormat,</p>
<p>{greeting}</p>
<p>Kami dari <strong>Yayasan Pendidikan dan Sosial Ma'arif (YPSMA)</strong> — Jl Diponegoro, Mojowarno, Jombang, Jawa Timur — mengajukan proposal kemitraan program CSR untuk mendukung pendidikan 574 siswa/santri di 4 unit pendidikan yang kami kelola.</p>
<p>Berikut ringkasan proposal yang kami ajukan:</p>
<hr style="border:none;border-top:1px solid #eee;margin:20px 0">
{html_body}
<hr style="border:none;border-top:1px solid #eee;margin:20px 0">
<p style="font-size:14px">Proposal lengkap, RAB, dan dokumentasi pendukung tersedia dan dapat dikirimkan sesuai permintaan.</p>
<p style="font-size:14px">Kami sangat berharap {comp_name} dapat berkenan menerima dan mendukung program yang kami ajukan. Besar harapan kami untuk dapat bertemu atau berdiskusi lebih lanjut.</p>
<p>Wassalamu'alaikum warahmatullahi wabarakatuh,</p>
<p style="margin-top:20px"><strong>Drs. H. Syamsun Huda Amir</strong><br>
Ketua YPSMA<br>
<em>Yayasan Pendidikan dan Sosial Ma'arif</em></p>
<p style="font-size:12px;color:#999;border-top:1px solid #eee;padding-top:15px;margin-top:25px">
<strong>Donasi langsung:</strong> {FROM_NAME}<br>
Bank BRI: 0585-01-000742-56-3 | Sociabuzz: https://sociabuzz.com/ypsma/tribe<br>
WA Donasi: 0321-493147 | Web: https://ypsma.org</p>
</td></tr></table></td></tr></table></body></html>"""

    msg = MIMEMultipart('alternative')
    msg['From'] = f'{FROM_NAME} <{FROM_ADDR}>'
    msg['To'] = to_email
    msg['Subject'] = f'Proposal CSR — {title} — YPSMA Jombang'

    msg.attach(MIMEText(proposal_text[:500], 'plain', 'utf-8'))
    msg.attach(MIMEText(html, 'html', 'utf-8'))

    return msg


def stage_outreach(cfg, companies, dry_run, force=False):
    """Send proposals via SMTP. Checks sent-log to avoid resends unless --force."""
    print(f"\n{'='*60}")
    print("STAGE: outreach — send proposals via SMTP")
    print(f"{'='*60}\n")

    smtp_conn = None
    if not SMTP_PASS:
        if dry_run:
            print("  [dry-run] SMTP_PASS not set — showing preview only\n")
        else:
            print("  ✗ SMTP_PASS not set. Set env var to send.\n")
            print("  Use --dry-run to preview without sending.\n")
            return
    if not dry_run:
        try:
            smtp_conn = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
            smtp_conn.starttls()
            smtp_conn.login(SMTP_USER, SMTP_PASS)
            print(f"  ✓ Connected to {SMTP_HOST}:{SMTP_PORT} as {SMTP_USER}\n")
        except Exception as e:

            print(f"  ✗ SMTP connection failed: {e}\n")
            return

    sent = 0
    errors = 0
    skipped = 0

    for c in companies:
        pf = c.get('proposal_file', '')
        proposal_path = os.path.join(BASE, pf) if pf else None
        to_email = c.get('email', '')
        comp_name = c['name']
        key = c['key']
        greeting = _GREETINGS.get(comp_name, 'Kami mengajukan proposal kemitraan CSR untuk mendukung program pendidikan YPSMA.')

        if not proposal_path or not os.path.isfile(proposal_path):
            print(f"  [!] {comp_name} — proposal file not found ({pf})")
            errors += 1
            continue

        if not to_email:
            print(f"  [!] {comp_name} — no email in config")
            errors += 1
            continue

        # Sent-log dedup
        if _is_sent(key):
            entry = _load_sent_log()[key]
            if force:
                print(f"  [→] {comp_name} — already sent {entry.get('timestamp','?')} — FORCE resend")
            else:
                print(f"  [•] {comp_name} — already sent {entry.get('timestamp','?')} — skipping")
                skipped += 1
                continue

        msg = _build_email(comp_name, proposal_path, to_email, greeting, dry_run)

        if dry_run:
            print(f"  [☐] TO: {to_email}")
            print(f"       SUBJECT: {msg['Subject']}")
            sent += 1
            continue

        try:
            smtp_conn.sendmail(FROM_ADDR, [to_email], msg.as_string())
            print(f"  [✓] {comp_name} → {to_email}")
            _mark_sent(key, comp_name, to_email, pf)
            sent += 1
            # Stagger: avoid Gmail spam filter
            if sent % 20 == 0:
                try:
                    smtp_conn.quit()
                except Exception:
                    pass
                smtp_conn = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
                smtp_conn.starttls()
                smtp_conn.login(SMTP_USER, SMTP_PASS)
                print(f"    [reconnect] fresh connection after {sent} sends")
            else:
                time.sleep(30)
        except Exception as e:
            print(f"  [✗] {comp_name} → {to_email}: {e}")
            errors += 1
    if smtp_conn:
        smtp_conn.quit()

    print(f"\n  Summary: {sent} sent, {skipped} skipped (already sent), {errors} errors\n")



def stage_discover(cfg, dry_run):
    """Scrape BUMN directories for new companies, add to config."""
    print(f"\n{'='*60}")
    print("STAGE: discover — search for new BUMN/BUMD targets")
    print(f"{'='*60}\n")

    existing = {c['key'] for c in cfg['companies']}
    sources = [
        'https://id.wikipedia.org/wiki/Daftar_badan_usaha_milik_negara_di_Indonesia',
        'https://en.wikipedia.org/wiki/State-owned_enterprises_of_Indonesia',
    ]
    seen = {}  # canonical_key → display_name, accumulated across sources

    for src in sources:
        print(f"  Scraping: {src}")
        html = _fetch(src)
        if html is None:
            print(f"    ✗ Failed to fetch\n")
            continue

        # Wikipedia Parsoid format with extra attributes e.g. id=, class=
        links = re.findall(
            r'<a\s+rel="mw:WikiLink"\s+href="//\w+\.wikipedia\.org/wiki/[^"]*"[^>]*>'
            r'([^<]{4,})</a>',
            html
        )
        # Collect BUMN entries with canonical-key dedup across sources
        for link_text in links:
            text = link_text.strip()
            # Only match legitimate BUMN entries: (Persero) company, Perum, or Bank
            if not ('(Persero)' in text or text.startswith('Perum ') or text.startswith('Bank ')):
                continue
            ck = _canonical_bumn_name(text)
            if not ck or len(ck) < 4:
                continue
            if ck not in seen:
                seen[ck] = text

    total_found = len(seen)
    print(f"\n  Found {total_found} BUMN names in directories\n")

    new_companies = []
    for ck, name in sorted(seen.items(), key=lambda x: x[1]):
        if ck in existing:
            continue
        is_dup = False
        for ek in existing:
            if (ck in ek or ek in ck) and len(ck) > 3 and len(ek) > 3:
                is_dup = True
                print(f"  ℹ Skipping match '{ek}': {name}")
                break
        if is_dup:
            continue

        new_companies.append(name)
        if dry_run:
            print(f"  [new] {name} → would add to config")
        else:
            print(f"  [+] {name}")

    if not dry_run and new_companies:
        for name in new_companies:
            key = _canonical_bumn_name(name)[:20]
            for prefix in ['pt', 'persero']:
                if key.startswith(prefix):
                    key = key[len(prefix):]
                    break
            cfg['companies'].append({
                'key': key,
                'name': name,
                'csr_website': '',
                'email': '',
                'proposal_file': 'csr_' + key + '.md',
            })
        with open(CONFIG_PATH, 'w') as f:
            yaml.dump(cfg, f, default_flow_style=False, sort_keys=False, allow_unicode=True)
        print(f"\n  ✓ Added {len(new_companies)} new companies to config\n")
    elif not new_companies:
        print("  No new companies found.\n")


# ── CLI ────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description='CSR Pipeline — research → draft → enrich → export → outreach → discover',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=textwrap.dedent("""\
            Examples:
              python3 scripts/csr_pipeline.py --stage all --dry-run
              SMTP_PASS='xxx' python3 scripts/csr_pipeline.py --stage outreach
              python3 scripts/csr_pipeline.py --stage enrich --company bca --force
        """),
    )
    parser.add_argument('--stage', choices=['research', 'draft', 'enrich', 'export', 'outreach', 'discover', 'all'],
                        default='all', help='Pipeline stage to run (default: all)')
    parser.add_argument('--company', default='all',
                        help='Company key from config, or "all" (default: all)')
    parser.add_argument('--dry-run', action='store_true',
                        help='Preview without side effects')
    parser.add_argument('--force', action='store_true',
                        help='Overwrite existing proposal files on draft/enrich; resend already-sent companies')
    parser.add_argument('--verbose', action='store_true',
                        help='Detailed output')
    parser.add_argument('--sent-log', nargs='?', const='view', choices=['view', 'clear'],
                        help='View or clear the sent log')

    args = parser.parse_args()

    # Load config
    cfg = load_config()

    # Handle --sent-log
    if args.sent_log:
        if args.sent_log == 'clear':
            _save_sent_log({})
            print("Sent log cleared.\n")
        else:
            log = _load_sent_log()
            if not log:
                print("Sent log is empty.\n")
            else:
                print(f"Sent log — {len(log)} entries:\n")
                for k, v in sorted(log.items()):
                    print(f"  {k}: {v.get('name','?')} → {v.get('email','?')} at {v.get('timestamp','?')}")
                print()
        return
    companies = get_companies(cfg, args.company)

    print(f"CSR Pipeline — {args.stage} stage")
    if args.dry_run:
        print("  [dry-run mode — no changes made]\n")
    stages = ['research', 'draft', 'enrich', 'export', 'outreach', 'discover'] if args.stage == 'all' else [args.stage]

    for stage in stages:
        if stage == 'research':
            stage_research(cfg, companies, args.dry_run)
        elif stage == 'draft':
            stage_draft(cfg, companies, args.dry_run, args.force)
        elif stage == 'enrich':
            stage_enrich(cfg, companies, args.dry_run, args.force)
        elif stage == 'export':
            stage_export(cfg, companies, args.dry_run, args.force)
        elif stage == 'outreach':
            stage_outreach(cfg, companies, args.dry_run, args.force)
        elif stage == 'discover':
            stage_discover(cfg, args.dry_run)

    print("Pipeline complete.\n")


if __name__ == '__main__':
    main()
