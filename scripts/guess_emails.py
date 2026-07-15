#!/usr/bin/env python3
"""Smart email address guesser for Indonesian BUMN companies.

Uses known patterns from already-verified emails in the config
plus domain-based heuristics. Updates csr_config.yaml in place.
"""
import yaml, re, sys
from urllib.parse import urlparse

CONFIG_PATH = 'csr_config.yaml'

# Known working patterns collected from all 74 verified BUMN emails
# Each entry: (pattern_name, template_fn) where template_fn(domain) -> email
KNOWN_PATTERNS = [
    # CSR-specific patterns (highest priority)
    ('csr', lambda d: f'csr@{d}'),                  # csr@kai.id, csr@sig.id
    ('plnpeduli', lambda d: f'plnpeduli@{d}'),       # plnpeduli@pln.co.id
    ('sustainability', lambda d: f'sustainability@{d}'), # sustainability@telkom.co.id

    # Corporate communication / secretary
    ('corpcs', lambda d: f'corpcs@{d}'),            # corpcs@pertamina.com
    ('corsec', lambda d: f'corsec@{d}'),             # corsec@kimiafarma.co.id
    ('corporate.secretary', lambda d: f'corporate.secretary@{d}'), # corpsec@pelni, waskita
    ('sekretariat', lambda d: f'sekretariat@{d}'),   # sekretariat@inka.co.id

    # Customer service / info (will forward to right dept)
    ('info', lambda d: f'info@{d}'),                 # info@barata.com, info@peruri.co.id
    ('contact', lambda d: f'contact@{d}'),           # contact@peruri.co.id
    ('customercare', lambda d: f'customercare@{d}'), # customercare@bluebirdgroup.com

    # Public relations
    ('humas', lambda d: f'humas@{d}'),               # humas@airnavindonesia.co.id
    ('pemirsa', lambda d: f'pemirsa@{d}'),           # pemirsa@balitv.tv
    ('komunikasi.korporasi', lambda d: f'komunikasi.korporasi@{d}'), # len.co.id

    # Consumer
    ('konsumen', lambda d: f'konsumen@{d}'),         # konsumen@pupuk-indonesia.com
    ('pengaduan', lambda d: f'pengaduan@{d}'),

    # Backups - broad corporate
    ('corporate.communication', lambda d: f'corporate.communication@{d}'),
    ('corcom', lambda d: f'corcom@{d}'),

    # General
    ('adm', lambda d: f'adm@{d}'),
    ('admin', lambda d: f'admin@{d}'),
]

# Sector-specific preferred patterns
SECTOR_PATTERNS = {
    'Perbankan':  ['csr', 'customercare', 'info', 'corporate.secretary'],
    'Perbankan BPD': ['csr', 'customercare', 'info'],
    'Perbankan Syariah': ['csr', 'info', 'customercare'],
    'Perbankan Swasta': ['csr', 'customercare', 'info'],
    'Energi': ['corpcs', 'csr', 'info', 'humas'],
    'Energi & Migas': ['corpcs', 'csr', 'info', 'humas'],
    'Konstruksi': ['corporate.secretary', 'info', 'sekretariat', 'csr'],
    'Infrastruktur': ['corporate.secretary', 'info', 'humas'],
    'Telekomunikasi': ['sustainability', 'csr', 'info'],
    'Media & Penyiaran': ['pemirsa', 'info', 'humas'],
    'Transportasi': ['csr', 'sekretariat', 'info', 'corporate.secretary'],
    'Material Bangunan': ['csr', 'info', 'corsec'],
    'Pertanian & Perkebunan': ['info', 'sekretariat', 'csr'],
    'Pupuk': ['konsumen', 'info', 'csr'],
    'Farmasi & Kesehatan': ['corsec', 'info', 'csr'],
    'Logistik & Pergudangan': ['info', 'customercare', 'csr'],
    'Asuransi': ['customercare', 'info', 'csr'],
    'Penerbangan': ['customercare', 'info', 'csr'],
    'Perhotelan & Pariwisata': ['info', 'csr'],
    'Industri': ['info', 'corsec', 'sekretariat', 'csr'],
    'BUMN': ['info', 'csr', 'sekretariat', 'humas'],
}

def extract_domain(website_url):
    """Extract the clean domain (e.g., 'pln.co.id') from a URL."""
    if not website_url:
        return None
    parsed = urlparse(website_url if '://' in website_url else f'https://{website_url}')
    hostname = parsed.hostname
    if not hostname:
        return None
    # Remove www. prefix
    hostname = re.sub(r'^www\d?\.', '', hostname)
    return hostname

def canonical_domain(website_url):
    """Get the second-level domain (e.g., 'pln.co.id' from 'www.pln.co.id')."""
    domain = extract_domain(website_url)
    if not domain:
        return None
    return domain


def guess_email(company):
    """Try to guess the best email for a company using known patterns."""
    website = company.get('csr_website')
    if not website:
        return None

    domain = canonical_domain(website)
    if not domain:
        return None

    sector = company.get('sector', 'BUMN')
    company_name = company.get('name', '').lower()

    # Try sector-specific patterns first
    preferred = []
    for s, patterns in SECTOR_PATTERNS.items():
        if s.lower() in sector.lower() or sector.lower() in s.lower():
            preferred = patterns
            break
    if not preferred:
        preferred = ['csr', 'info', 'humas', 'sekretariat', 'corporate.secretary']

    # Special cases
    special = {
        'pertamina': 'corpcs@pertamina.com',
        'pln': 'plnpeduli@pln.co.id',
        'telkom': 'sustainability@telkom.co.id',
        'pelni': 'corporate.secretary@pelni.co.id',
        'waskita': 'corporate.secretary@waskita.co.id',
        'pupuk': 'konsumen@pupuk-indonesia.com',
        'len': 'komunikasi.korporasi@len.co.id',
        'kimiafarma': 'corsec@kimiafarma.co.id',
        'inka': 'sekretariat@inka.co.id',
        'balitv': 'pemirsa@balitv.tv',
        'airnav': 'humas@airnavindonesia.co.id',
        'bluebird': 'customercare@bluebirdgroup.com',
    }
    for keyword, special_email in special.items():
        if keyword in company_name:
            return special_email

    # Try patterns in preferred order
    pattern_map = dict(KNOWN_PATTERNS)
    for pattern_name in preferred:
        if pattern_name in pattern_map:
            email = pattern_map[pattern_name](domain)
            if email:
                return email

    # Fallback: try all patterns, return first match
    for pname, pfn in KNOWN_PATTERNS:
        email = pfn(domain)
        if email:
            return email

    return None


def main():
    with open(CONFIG_PATH) as f:
        config = yaml.safe_load(f)

    companies = config['companies']
    updated = 0
    still_missing = 0

    for c in companies:
        if c.get('email'):
            continue
        guessed = guess_email(c)
        if guessed:
            c['email'] = guessed
            updated += 1
            print(f"  {c['key']:30s} -> {guessed}")
        else:
            still_missing += 1

    with open(CONFIG_PATH, 'w') as f:
        yaml.dump(config, f, default_flow_style=False, allow_unicode=True, sort_keys=False)

    print(f"\nUpdated {updated} companies with guessed emails.")
    print(f"Still missing: {still_missing}")

if __name__ == '__main__':
    main()
