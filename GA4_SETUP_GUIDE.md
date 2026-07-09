# Google Analytics 4 Setup Guide - YPSMA Website

**Created**: 2026-07-09  
**Status**: AWAITING GA4 MEASUREMENT ID  
**Implementation**: Ready to deploy

---

## 1. CREATE GOOGLE ANALYTICS 4 ACCOUNT

### Step 1: Go to Google Analytics
1. Visit: https://analytics.google.com/
2. Sign in with Google account (preferably foundation's official email)
3. Click **"Start measuring"** or **"Admin"** (gear icon bottom left)

### Step 2: Create Account
1. Account name: `YPSMA Jombang` or `Yayasan Pendidikan Dan Sosial Maarif`
2. Check all data sharing settings (recommended)
3. Click **Next**

### Step 3: Create Property
1. Property name: `YPSMA Website` or `ypsma.org`
2. Reporting timezone: `(GMT+07:00) Indonesia Time - Jakarta`
3. Currency: `Indonesian Rupiah (IDR)`
4. Click **Next**

### Step 4: Business Details
1. Industry category: **Education** or **Non-profit**
2. Business size: **Small (1-10 employees)**
3. How you plan to use Google Analytics: Select **All that apply**
4. Click **Create**
5. Accept Terms of Service

### Step 5: Data Collection Setup
1. Platform: **Web**
2. Website URL: `https://ypsma.org`
3. Stream name: `YPSMA Website`
4. Click **Create stream**

### Step 6: GET YOUR MEASUREMENT ID
After creating the stream, you will see:

```
Measurement ID: G-XXXXXXXXXX
```

**⚠️ IMPORTANT**: Copy this Measurement ID and send it to the developer.

---

## 2. WHAT WE WILL TRACK

### Page Views (Automatic)
- Homepage visits
- Landing page visits (lp-beasiswa, lp-ramadan)
- Blog post views

### Custom Events (Goal Tracking)
| Event Name | Trigger | Value |
|---|---|---|
| `donate_click` | User clicks any donation CTA button | Tier amount |
| `whatsapp_click` | User clicks WhatsApp contact link | Campaign source |
| `qris_scan` | User views QRIS code section | - |
| `tier_select` | User interacts with donation tier | Tier level (1/2/3) |
| `blog_read` | User scrolls >50% of blog post | Post title |
| `external_link` | User clicks external link | Destination URL |

### Conversion Goals
1. **Primary Conversion**: WhatsApp message sent (tracked via UTM parameters)
2. **Secondary Conversion**: QRIS code viewed >3 seconds
3. **Micro Conversion**: Blog post read to completion

---

## 3. CODE TO BE INJECTED

Once you provide the **Measurement ID**, we will inject this code into all HTML files:

```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  
  // Initialize GA4
  gtag('config', 'G-XXXXXXXXXX', {
    'send_page_view': true,
    'cookie_flags': 'SameSite=None;Secure'
  });

  // Track donation tier clicks
  document.querySelectorAll('a[href*="wa.me"]').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      var tierText = this.innerText || this.textContent;
      var tierAmount = tierText.match(/\d{2,3}\.?\d{0,3}/);
      
      gtag('event', 'donate_click', {
        'event_category': 'Donation',
        'event_label': tierText,
        'value': tierAmount ? parseInt(tierAmount[0].replace('.', '')) : 0
      });
    });
  });

  // Track QRIS section views
  if (document.querySelector('.qris-section')) {
    var qrisObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          gtag('event', 'qris_scan', {
            'event_category': 'Payment',
            'event_label': 'QRIS Code Viewed'
          });
        }
      });
    }, { threshold: 0.5 });
    
    qrisObserver.observe(document.querySelector('.qris-section'));
  }

  // Track blog engagement (50% scroll)
  var scrollTracked = false;
  window.addEventListener('scroll', function() {
    if (scrollTracked) return;
    
    var scrollPercent = (window.scrollY + window.innerHeight) / document.body.scrollHeight * 100;
    if (scrollPercent > 50 && document.querySelector('.blog-post')) {
      scrollTracked = true;
      
      var postTitle = document.querySelector('h1') ? document.querySelector('h1').textContent : 'Unknown';
      gtag('event', 'blog_read', {
        'event_category': 'Engagement',
        'event_label': postTitle,
        'value': 50
      });
    }
  });
</script>
```

---

## 4. VERIFICATION CHECKLIST

After implementation, verify:

### In Real-Time Reports (First 30 minutes)
1. Go to GA4 → Reports → Realtime
2. Open https://ypsma.org in incognito browser
3. You should see **1 active user**
4. Click a donation button → Event `donate_click` appears
5. Scroll QRIS section → Event `qris_scan` appears

### In Events Reports (After 24 hours)
1. Go to GA4 → Reports → Engagement → Events
2. You should see these events:
   - `page_view` (automatic)
   - `donate_click` (custom)
   - `qris_scan` (custom)
   - `blog_read` (custom)

### In Conversions (After setup)
1. Go to GA4 → Configure → Events
2. Mark these as conversions:
   - `donate_click` → Toggle **"Mark as conversion"**
   - `whatsapp_click` → Toggle **"Mark as conversion"**

---

## 5. NEXT STEPS AFTER GA4 SETUP

Once GA4 is working:

### Week 1 Immediate Actions
1. Set up **conversion goals** (mark donate_click as primary conversion)
2. Create **custom reports** for donation funnel tracking
3. Set up **email alerts** for daily conversion summary

### Week 2 Optimization
1. Analyze which donation tier gets most clicks
2. Identify best-performing blog posts (by `blog_read` events)
3. Test A/B variants based on GA4 data

### Week 3 Integration
1. Connect GA4 to Google Ad Grants (when approved)
2. Set up **ecommerce tracking** for dynamic QRIS (Week 2 Task)
3. Create **monthly dashboard** for foundation reporting

---

## 6. TROUBLESHOOTING

### Problem: No data showing in Realtime
**Solution**:
1. Check Measurement ID is correct (starts with `G-`)
2. Test in incognito browser (disable ad blockers)
3. Wait 5-10 minutes for data to appear

### Problem: Events not firing
**Solution**:
1. Open browser DevTools (F12) → Console tab
2. Look for errors related to `gtag` or `dataLayer`
3. Verify button selectors are correct (`a[href*="wa.me"]`)

### Problem: Multiple pageviews per visit
**Solution**:
1. Ensure GA4 code is only in `<head>` section once
2. Remove any duplicate `gtag('config')` calls
3. Check no old Universal Analytics (UA-XXXXXXX) code exists

---

## 7. PRIVACY & COMPLIANCE

### GDPR Compliance (Recommended)
Although Indonesia is not EU, best practice:

1. Add privacy notice to footer:
```html
<p class="privacy-notice">
  Kami menggunakan Google Analytics untuk memahami bagaimana pengunjung 
  menggunakan situs ini. Data yang dikumpulkan bersifat anonim dan hanya 
  digunakan untuk meningkatkan pengalaman donatur.
  <a href="/privacy-policy">Kebijakan Privasi</a>
</p>
```

2. Enable IP anonymization (already included in code above via `cookie_flags`)

3. Consider cookie consent banner (can be added in Week 3 if requested)

---

## 8. COST

**Google Analytics 4**: **FREE** (unlimited)
- No monthly limits for non-profit websites
- All features included (unlike GA Universal which had paid tiers)
- Data retention: 14 months (can be changed to 2 months if needed)

---

## READY TO DEPLOY

Once you provide the **Measurement ID** (format: `G-XXXXXXXXXX`), reply with:

```
Measurement ID: G-XXXXXXXXXX
```

And I will immediately:
1. Inject GA4 code into all 3 HTML files (`index.html`, `lp-beasiswa.html`, `lp-ramadan.html`)
2. Add event tracking for all donation CTAs and QRIS section
3. Add blog engagement tracking for all blog posts
4. Commit and push to production
5. Provide verification steps for you to test

**Estimated time after receiving ID**: 5 minutes
