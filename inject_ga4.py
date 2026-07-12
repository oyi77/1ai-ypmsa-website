#!/usr/bin/env python3
"""Inject GA4 + Meta Pixel into all YPSMA HTML pages."""
import os
import glob

GA4_ID = "G-7723KTXZBG"
PIXEL_ID = "771021905629860"

GA4_SNIPPET = f"""<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id={GA4_ID}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){{dataLayer.push(arguments);}}
  gtag('js', new Date());
  gtag('config', '{GA4_ID}');
</script>"""

PIXEL_SNIPPET = f"""<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s){{if(f.fbq)return;n=f.fbq=function(){{n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)}};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '{PIXEL_ID}');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id={PIXEL_ID}&ev=PageView&noscript=1"/></noscript>
<!-- End Meta Pixel Code -->"""

# Donation event tracking (inject before </body>)
DONATE_TRACKING = """<!-- Donation Event Tracking -->
<script>
(function(){
  // Track Midtrans donate clicks
  document.addEventListener('click', function(e){
    var btn = e.target.closest('[data-midtrans]');
    if(!btn) return;
    var amt = btn.getAttribute('data-midtrans') || 'unknown';
    if(window.gtag) gtag('event','donate_click',{event_category:'Donation',event_label:amt,value:parseInt(amt)||0});
    if(window.fbq) fbq('track','InitiateCheckout',{value:parseInt(amt)/1000||0,currency:'IDR'});
  });
  // Track WhatsApp donate clicks
  document.querySelectorAll('a[href*="wa.me"]').forEach(function(a){
    a.addEventListener('click',function(){
      if(window.gtag) gtag('event','whatsapp_click',{event_category:'Donation',event_label:location.pathname});
      if(window.fbq) fbq('track','Contact');
    });
  });
  // Track QRIS view
  var qris = document.querySelector('.qris-card,[data-qris]');
  if(qris){
    var obs = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(!entry.isIntersecting) return;
        if(window.gtag) gtag('event','qris_view',{event_category:'Donation'});
        obs.unobserve(entry.target);
      });
    },{threshold:.5});
    obs.observe(qris);
  }
})();
</script>"""

# Collect all HTML files
html_files = (
    glob.glob('public/*.html') +
    glob.glob('public/lp-*.html') +
    glob.glob('public/blog/*.html')
)
# Deduplicate
html_files = sorted(set(html_files))

# Skip
SKIP = ['public/googledf043f27a6c232eb.html', 'public/admin.html']

stats = {'ga4': 0, 'pixel': 0, 'track': 0, 'skip': 0, 'nohead': 0}

for path in html_files:
    if any(path.endswith(s.split('/')[-1]) for s in SKIP):
        print(f'  SKIP  {path}')
        stats['skip'] += 1
        continue

    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    changed = False

    # Inject GA4 before </head>
    if GA4_ID not in content:
        if '</head>' in content:
            content = content.replace('</head>', GA4_SNIPPET + '\n</head>', 1)
            stats['ga4'] += 1
            changed = True
        else:
            print(f'  WARN  {path}: no </head>')
            stats['nohead'] += 1

    # Inject Meta Pixel before </head>
    if PIXEL_ID not in content:
        if '</head>' in content:
            content = content.replace('</head>', PIXEL_SNIPPET + '\n</head>', 1)
            stats['pixel'] += 1
            changed = True

    # Inject donation tracking before </body> (only LP pages)
    if '/lp-' in path and 'donate_click' not in content:
        if '</body>' in content:
            content = content.replace('</body>', DONATE_TRACKING + '\n</body>', 1)
            stats['track'] += 1
            changed = True

    if changed:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'  OK    {path}')
    else:
        print(f'  EXIST {path}')

print(f'\nDone — GA4:{stats["ga4"]} Pixel:{stats["pixel"]} Track:{stats["track"]} Skip:{stats["skip"]} Warn:{stats["nohead"]}')
