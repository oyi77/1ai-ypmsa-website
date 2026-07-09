#!/usr/bin/env python3
"""
WAHA Donation Receipt Automation via 1ai-hub MCP
Sends automated WhatsApp receipts using mcp__ai_hub_waha_send_message tool

Prerequisites:
- 1ai-hub MCP server running
- WAHA session authenticated

Usage:
    python3 send_receipt_mcp.py <phone> <amount> <tier> <transaction_id> [donor_name]

Example:
    python3 send_receipt_mcp.py 6282234551160 250000 "Adopsi Santri" TRX20260709001 "Ahmad"
"""

import sys
import json
from datetime import datetime


def format_rupiah(amount: int) -> str:
    """Format rupiah currency with thousand separators"""
    return f"Rp {amount:,}".replace(",", ".")


def get_tier_benefits(tier: str) -> str:
    """Get tier-specific benefit description"""
    benefits = {
        "Sahabat Pendidikan": """📚 *Impact Donasi Anda:*
• ATK untuk 1 santri selama 1 bulan
• Membantu kelancaran belajar mengajar
• Melengkapi kebutuhan administrasi sekolah""",
        
        "Adopsi Santri": """🎓 *Impact Donasi Anda:*
• Beasiswa penuh 1 santri selama 1 bulan
• Biaya makan, seragam, dan pendidikan
• Update khusus anak asuh via WhatsApp
• Laporan nilai dan foto kegiatan bulanan""",
        
        "Wakaf Produktif": """🏪 *Impact Donasi Anda:*
• Modal usaha koperasi santri
• Pendapatan berkelanjutan untuk operasional
• Membantu kemandirian ekonomi yayasan
• Manfaat berlipat untuk 237+ santri"""
    }
    
    return benefits.get(tier, """✨ *Impact Donasi Anda:*
• Mendukung operasional 4 lembaga pendidikan
• Membantu 237+ santri dari keluarga petani
• Menjaga kualitas pendidikan dan fasilitas""")


def generate_receipt_message(donation: dict) -> str:
    """Generate receipt message template"""
    date_str = datetime.fromtimestamp(donation['timestamp']).strftime('%A, %d %B %Y')
    
    return f"""🌟 *BUKTI DONASI - YPSMA JOMBANG*

Terima kasih atas kepercayaan {donation['donor_name']} untuk menjadi Jembatan Mimpi bagi santri kami! 🙏

━━━━━━━━━━━━━━━━━
📋 *Detail Donasi*
━━━━━━━━━━━━━━━━━

💰 Nominal: *{format_rupiah(donation['amount'])}*
📦 Program: *{donation['tier']}*
🔖 ID Transaksi: {donation['transaction_id']}
📅 Tanggal: {date_str}

━━━━━━━━━━━━━━━━━
✅ *Status: BERHASIL*
━━━━━━━━━━━━━━━━━

{get_tier_benefits(donation['tier'])}

📊 *Laporan Rutin*
Anda akan menerima update perkembangan program setiap bulan melalui WhatsApp ini.

📞 *Hubungi Kami*
• WhatsApp: 0822-3455-1160
• Website: https://ypsma.org

Semoga Allah membalas kebaikan Anda dengan pahala berlipat ganda. Aamiin 🤲

_Yayasan Pendidikan Dan Sosial Maarif_
_Jl. Diponegoro No.34, Mojowarno, Jombang_
_AHU-0003327.AH.01.04.TAHUN 2017_"""


def validate_phone(phone: str) -> bool:
    """Validate E.164 phone format"""
    return phone.startswith('628') and len(phone) >= 12 and phone.isdigit()


def main():
    """Main execution"""
    if len(sys.argv) < 5:
        print("Usage: python3 send_receipt_mcp.py <phone> <amount> <tier> <transaction_id> [donor_name]")
        print('Example: python3 send_receipt_mcp.py 6282234551160 250000 "Adopsi Santri" TRX20260709001 "Ahmad"')
        sys.exit(1)
    
    phone = sys.argv[1]
    amount_str = sys.argv[2]
    tier = sys.argv[3]
    transaction_id = sys.argv[4]
    donor_name = sys.argv[5] if len(sys.argv) > 5 else "Donatur"
    
    # Validate inputs
    if not validate_phone(phone):
        print(f"Error: Phone must be in E.164 format (628xxxxxxxxxx)")
        sys.exit(1)
    
    try:
        amount = int(amount_str)
        if amount <= 0:
            raise ValueError("Amount must be positive")
    except ValueError as e:
        print(f"Error: Invalid amount - {e}")
        sys.exit(1)
    
    # Generate receipt
    donation = {
        'amount': amount,
        'tier': tier,
        'transaction_id': transaction_id,
        'donor_name': donor_name,
        'timestamp': datetime.now().timestamp()
    }
    
    receipt_message = generate_receipt_message(donation)
    
    # Print details
    print("Sending receipt via WAHA MCP...")
    print(f"Phone: {phone}")
    print(f"Amount: {format_rupiah(amount)}")
    print(f"Tier: {tier}")
    print(f"Transaction ID: {transaction_id}")
    print(f"Donor Name: {donor_name}")
    print("---")
    
    # MCP tool call structure (for documentation)
    mcp_payload = {
        "tool": "mcp__ai_hub_waha_send_message",
        "parameters": {
            "phone": phone,
            "text": receipt_message,
            "session": "default"
        }
    }
    
    print("\nMCP Tool Call:")
    print(json.dumps(mcp_payload, indent=2, ensure_ascii=False))
    print("\n✅ Script ready. To execute via MCP, use the tool call above in your agent environment.")
    
    # Log entry for tracking
    log_entry = {
        "timestamp": datetime.now().isoformat(),
        "phone": phone,
        "amount": amount,
        "tier": tier,
        "transaction_id": transaction_id,
        "donor_name": donor_name,
        "status": "prepared"
    }
    
    print("\nLog Entry:")
    print(json.dumps(log_entry, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
