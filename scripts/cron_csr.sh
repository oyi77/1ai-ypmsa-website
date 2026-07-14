#!/bin/bash
# cron_csr.sh — Weekly CSR pipeline runner
# Schedule: 0 9 * * 1 /home/openclaw/projects/1ai-ypsma-website/scripts/cron_csr.sh
#
# Sources .env for SMTP credentials, runs research→enrich→submit.
# Logs to cron_csr.log in project root.

set -euo pipefail

DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$DIR"

LOG="$DIR/cron_csr.log"
TIMESTAMP="$(date '+%Y-%m-%d %H:%M:%S')"

echo "[$TIMESTAMP] CSR pipeline start" >>"$LOG"

# Source SMTP credentials
if [ -f "$DIR/.env" ]; then
    # shellcheck disable=SC1091
    source "$DIR/.env"
fi

if [ -z "${SMTP_PASS:-}" ]; then
    echo "  ERROR: SMTP_PASS not set" >>"$LOG"
    exit 1
fi

# Run pipeline
python3 scripts/csr_pipeline.py --stage all >> "$LOG" 2>&1

echo "  Done: $?" >>"$LOG"
echo >>"$LOG"
