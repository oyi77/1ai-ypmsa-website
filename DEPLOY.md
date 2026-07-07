# Cloudflare Pages — Deployment Checklist

## Project connection
- Repository: `oyi77/1ai-ypmsa-website`
- Branch: `main`
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm ci`

## Domain binding
1. Cloudflare Pages → Project → **Custom domains**
2. Add: `ypsma.org`
3. Add: `www.ypsma.org`
4. DNS should auto-resolve if nameservers already point to Cloudflare

## Post-deploy verification
- [ ] HTTPS active on both domains
- [ ] `ypsma.org` loads final landing page
- [ ] Contact details and donation CTA visible
- [ ] Reciprocal link to `berkahkarya.org` present

## Content approval gate
- [ ] Confirm contact/phone/email with yayasan sekretariat
- [ ] Confirm donation/payment pathway before broad promotion
- [ ] Replace placeholder donation methods with actual channels when ready
