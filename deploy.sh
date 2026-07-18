#!/usr/bin/env bash
# Manual deploy to Cloudflare Pages (GitHub Actions broken due to billing)
set -euo pipefail

cd "$(dirname "$0")"
echo "→ Installing dependencies..."
npm ci --silent
echo "→ Building with npm..."
npm run build
source .cloudflare-creds 2>/dev/null || true
CLOUDFLARE_EMAIL="${CLOUDFLARE_EMAIL:-mbahkoe.pendekar@gmail.com}" \
CLOUDFLARE_API_KEY="${CLOUDFLARE_API_KEY}" \
  wrangler pages deploy --project-name=1ai-ypmsa-website --branch=main ./dist
echo "✅ Live at: https://ypsma.org"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚠️  Pastikan env vars sudah di-set di"
echo "   Cloudflare Dashboard → Pages → 1ai-ypmsa-website"
echo "   → Settings → Environment variables (Production):"
echo "   PAYMENT_API_KEY      = berkahkarya-ecosystem-2026-secure-key"
echo "   PAYMENT_WEBHOOK_SECRET = whsec_... (merchant's webhook_secret)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
