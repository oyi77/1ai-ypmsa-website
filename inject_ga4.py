#!/usr/bin/env python3
import os
import re

# Read GA4 tracking code
with open('ga4_tracking.html', 'r', encoding='utf-8') as f:
    ga4_code = f.read()

# HTML files to update
html_files = [
    'public/index.html',
    'public/lp-beasiswa.html',
    'public/lp-ramadan.html'
]

for html_file in html_files:
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if GA4 already exists
    if 'G-7723KTXZBG' in content:
        print(f'✓ {html_file}: GA4 already exists, skipping')
        continue
    
    # Find </head> tag and insert before it
    if '</head>' in content:
        content = content.replace('</head>', f'{ga4_code}\n</head>')
        
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f'✓ {html_file}: GA4 injected successfully')
    else:
        print(f'✗ {html_file}: </head> tag not found')
