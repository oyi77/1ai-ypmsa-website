# YPSMA Website - Next Immediate Actions

## ✅ COMPLETED (2026-07-09)

### Phase 1: Quick Wins (Done)
- [x] robots.txt + sitemap.xml created
- [x] JSON-LD structured data with Organization + WebSite schemas
- [x] Contact info updated (082234551160 administrative, BRI 058501000742563)
- [x] WhatsApp pre-filled CTAs for all 3 donation tiers
- [x] QRIS static section added
- [x] Trust signals block (AHU 1966, 237 donors, transparent reports)
- [x] Urgency indicator for Tier 3
- [x] All changes committed to git

**Git commit**: feat: SEO foundations + contact/bank updates + donation optimization


---

### Phase 2: CSR Pipeline Automation (Done)
- [x] csr_config.yaml with 12 companies + YPSMA Profile
- [x] csr_pipeline.py — research → enrich → submit + --dry-run
- [x] cron_csr.sh wrapper for weekly cron job
- [x] 14 proposal files generated (12 companies + pertamina/2 + bankjatim/2)
- [x] Dry-run verified (research→enrich→submit, all 12 emails previewed)

**Git commit**: feat: csr pipeline with research, enrich, submit stages + cron wrapper
---

## 🚀 NEXT: Google Search Console (Week 1)

### Step 1: Domain Verification
1. Go to https://search.google.com/search-console
2. Add property: ypsma.org
3. Choose verification method:
   - **DNS TXT record** (recommended) OR
   - **HTML file upload** to public/
4. Complete verification

### Step 2: Submit Sitemap
1. In GSC, go to Sitemaps section
2. Submit: `https://ypsma.org/sitemap.xml`
3. Wait for Google to crawl (24-48 hours)

### Step 3: Request Indexing
1. Use URL Inspection tool for each page:
   - https://ypsma.org/
   - https://ypsma.org/lp-beasiswa.html
   - https://ypsma.org/lp-ramadan.html
2. Click "Request Indexing" for each

### Step 4: Monitor
- Check "Coverage" report for errors
- Set up email alerts for critical issues
- Monitor "Performance" for impressions/clicks

---

## 💳 NEXT: Payment Gateway Integration (Week 1-2)

### Prerequisites
- 1ai-payment system at ~/projects/1ai-payment
- Midtrans account OR Tripay account
- BRI 058501000742563 a.n. Yayasan Pendidikan Dan Sosial Maarif

### Implementation Steps
1. **Set up 1ai-payment client**
   ```bash
   cd ~/projects/1ai-payment
   # Generate API key for YPSMA
   npm run generate-key -- --client=ypsma --email=cs@ypsma.org
   ```

2. **Configure gateway routing**
   - Add Midtrans credentials (for cards, e-wallets, QRIS)
   - Add Tripay credentials (for bank transfer, convenience store)
   - Set webhook URL: https://ypsma.org/api/webhook/payment

3. **Update YPSMA website**
   - Replace static QRIS with dynamic payment button
   - Add payment form with donor info collection
   - Implement webhook handler to receive payment confirmations
   - Send automated receipt via WhatsApp (using 082234551160)

4. **Test flow**
   - Create test donation (Rp 10,000)
   - Complete payment
   - Verify webhook received
   - Verify WhatsApp receipt sent

---

## 📊 NEXT: Analytics Setup (Week 2)

### Google Analytics 4
1. Create GA4 property at https://analytics.google.com
2. Get measurement ID (G-XXXXXXXXXX)
3. Add to public/index.html:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>
   ```

### Conversion Events
- `donate_button_click` - When user clicks any donation CTA
- `whatsapp_redirect` - When user clicks WhatsApp link
- `qris_view` - When QRIS section scrolls into view
- `donation_complete` - When payment webhook confirms donation

### Facebook Pixel
1. Create pixel at https://business.facebook.com
2. Add pixel code to public/index.html
3. Track `InitiateCheckout`, `Purchase` events

---

## 📈 Expected Results (30 days)

### Traffic
- Organic impressions: 100 → 300/month (+200%)
- Website visits: 500 → 1,500/month (+200%)
- Google Search Console indexed pages: 0 → 3

### Conversions
- Total donations: Rp 5jt → Rp 10jt/month (+100%)
- WhatsApp inquiries: 10 → 25/month (+150%)
- QRIS scans: 0 → 50/month (new)

### SEO
- Position #5-10 for "yayasan pendidikan jombang"
- Position #10-20 for "beasiswa santri jombang"
- Rich snippets visible in search results

---

## 🎯 Quick Reference

### Foundation Contact
- Legal name: Yayasan Pendidikan Dan Sosial Maarif
- AHU: 0026672.AH.01.04.Tahun 2020
- Admin: 082234551160
- Bank: BRI 058501000742563
- Email: cs@ypsma.org
- Address: Jl.Diponegoro No.34 Rt.1 Rw.6 Gondek Mojowarno Jombang 61475

### Website
- Domain: ypsma.org
- Repository: ~/projects/1ai-ypsma-website
- Deployment: Cloudflare Pages
- Sitemap: https://ypsma.org/sitemap.xml

### Budget (Rp 2.17jt/month)
- Google Ads: FREE ($10k Google Ad Grants)
- Facebook Ads: Rp 1,000,000
- Content: Rp 500,000
- Payment fees: Rp 420,000
- Email: Rp 250,000


---

## ✅ CSR PROPOSALS — SENT (2026-07-14)

5 CSR proposals sent from admin@ypsma.org via grahainsanmandiri@gmail.com SMTP:

| Target | Email | Proposal | Status |
|--------|-------|----------|--------|
| Bank Jatim | bankjatim@bankjatim.co.id | csr_bankjatim.md | sent |
| BSI | cs@bsimashlahat.or.id | csr_bsi.md | sent |
| Pertamina | corpcs@pertamina.com | csr_pertamina.md | sent |
| PLN | plnpeduli@pln.co.id | csr_pln.md | sent |
| SIG | csr@sig.id | csr_sig.md | sent |

**Post-send tasks:**
- Check inbox in ~3-5 days for replies
- Follow-up with a phone call to CSR division (0321 - 493147 admin number)
- If no reply in 2 weeks, re-send with "Follow-up" subject
- Track responses in proposals/contact_log.md
- Send proposals as PDF attachment (render from MD) in follow-up batch

**Resend script:** `python3 scripts/send_csr_proposals.py`
