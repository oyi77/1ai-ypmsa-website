#!/bin/bash
# send_scheduled.sh — Staggered CSR proposal sends, one every ~4.3 min
# Called by `at` at 08:00 WIB, finishes by ~10:00 WIB
set -euo pipefail

DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$DIR"

# Source SMTP creds
if [ -f "$DIR/.env" ]; then
    # shellcheck disable=SC1091
    source "$DIR/.env"
fi

LOG="$DIR/send_scheduled.log"
: > "$LOG"

# 28 companies, sorted by key
COMPANIES=(
    adhikarya astra balitv bankbjb bankjatim barata bca bluebird bni
    brantasabipraya bri bsi inka jtv kai kimiafarma lenindustri mandiri
    pelindo pertamina peruri pindad pln pupukindonesia sig telkom waskita wijayakarya
)

TOTAL=${#COMPANIES[@]}
INTERVAL=$(( (10*60 - 8*60) * 60 / TOTAL ))  # ~257 seconds per company
echo "[$(date '+%H:%M:%S')] Starting staggered send: $TOTAL companies, ~${INTERVAL}s interval" | tee "$LOG"

for i in "${!COMPANIES[@]}"; do
    KEY="${COMPANIES[$i]}"
    START=$SECONDS

    echo "[$(date '+%H:%M:%S')] [$((i+1))/$TOTAL] Sending $KEY..." | tee -a "$LOG"

    python3 scripts/csr_pipeline.py --stage outreach --company "$KEY" >> "$LOG" 2>&1

    ELAPSED=$((SECONDS - START))

    # Don't sleep after the last one
    if [ "$i" -lt $((TOTAL - 1)) ]; then
        SLEEP=$(( INTERVAL - ELAPSED ))
        if [ "$SLEEP" -gt 0 ]; then
            echo "  Wait ${SLEEP}s before next..." | tee -a "$LOG"
            sleep "$SLEEP"
        fi
    fi
done

echo "[$(date '+%H:%M:%S')] All done." | tee -a "$LOG"
