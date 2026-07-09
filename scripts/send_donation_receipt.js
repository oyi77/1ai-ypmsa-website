/**
 * WAHA Donation Receipt Automation Script
 * Sends automated WhatsApp receipts to donors after payment confirmation
 * 
 * Prerequisites:
 * - WAHA server running (via 1ai-hub MCP)
 * - Session authenticated: default
 * - Donor phone numbers in E.164 format (628xxxxxxxxxx)
 * 
 * Usage:
 * node send_donation_receipt.js <phone> <amount> <tier> <transaction_id>
 * 
 * Example:
 * node send_donation_receipt.js 6282234551160 250000 "Adopsi Santri" TRX20260709001
 */

const https = require('https');

// WAHA Configuration
const WAHA_CONFIG = {
  host: process.env.WAHA_HOST || 'localhost',
  port: process.env.WAHA_PORT || 3000,
  session: process.env.WAHA_SESSION || 'default'
};

/**
 * Send WhatsApp message via WAHA
 * @param {string} phone - Recipient phone (E.164 format)
 * @param {string} text - Message text
 * @returns {Promise<Object>} Response data
 */
function sendWhatsAppMessage(phone, text) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      chatId: `${phone}@c.us`,
      text: text,
      session: WAHA_CONFIG.session
    });

    const options = {
      hostname: WAHA_CONFIG.host,
      port: WAHA_CONFIG.port,
      path: '/api/sendText',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`WAHA API error: ${res.statusCode} ${data}`));
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(postData);
    req.end();
  });
}

/**
 * Format rupiah currency
 * @param {number} amount - Amount in rupiah
 * @returns {string} Formatted currency string
 */
function formatRupiah(amount) {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

/**
 * Generate receipt message template
 * @param {Object} donation - Donation details
 * @returns {string} Receipt message
 */
function generateReceiptMessage(donation) {
  const { amount, tier, transactionId, donorName, timestamp } = donation;
  
  const date = new Date(timestamp).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `🌟 *BUKTI DONASI - YPSMA JOMBANG*

Terima kasih atas kepercayaan ${donorName || 'Anda'} untuk menjadi Jembatan Mimpi bagi santri kami! 🙏

━━━━━━━━━━━━━━━━━
📋 *Detail Donasi*
━━━━━━━━━━━━━━━━━

💰 Nominal: *${formatRupiah(amount)}*
📦 Program: *${tier}*
🔖 ID Transaksi: ${transactionId}
📅 Tanggal: ${date}

━━━━━━━━━━━━━━━━━
✅ *Status: BERHASIL*
━━━━━━━━━━━━━━━━━

${getTierBenefits(tier)}

📊 *Laporan Rutin*
Anda akan menerima update perkembangan program setiap bulan melalui WhatsApp ini.

📞 *Hubungi Kami*
• WhatsApp: 0822-3455-1160
• Website: https://ypsma.org

Semoga Allah membalas kebaikan Anda dengan pahala berlipat ganda. Aamiin 🤲

_Yayasan Pendidikan Dan Sosial Maarif_
_Jl. Diponegoro No.34, Mojowarno, Jombang_
_AHU-0003327.AH.01.04.TAHUN 2017_`;
}

/**
 * Get tier-specific benefit text
 * @param {string} tier - Donation tier
 * @returns {string} Benefit description
 */
function getTierBenefits(tier) {
  const benefits = {
    'Sahabat Pendidikan': `📚 *Impact Donasi Anda:*
• ATK untuk 1 santri selama 1 bulan
• Membantu kelancaran belajar mengajar
• Melengkapi kebutuhan administrasi sekolah`,

    'Adopsi Santri': `🎓 *Impact Donasi Anda:*
• Beasiswa penuh 1 santri selama 1 bulan
• Biaya makan, seragam, dan pendidikan
• Update khusus anak asuh via WhatsApp
• Laporan nilai dan foto kegiatan bulanan`,

    'Wakaf Produktif': `🏪 *Impact Donasi Anda:*
• Modal usaha koperasi santri
• Pendapatan berkelanjutan untuk operasional
• Membantu kemandirian ekonomi yayasan
• Manfaat berlipat untuk 237+ santri`
  };

  return benefits[tier] || `✨ *Impact Donasi Anda:*
• Mendukung operasional 4 lembaga pendidikan
• Membantu 237+ santri dari keluarga petani
• Menjaga kualitas pendidikan dan fasilitas`;
}

/**
 * Main execution
 */
async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  
  if (args.length < 4) {
    console.error('Usage: node send_donation_receipt.js <phone> <amount> <tier> <transaction_id> [donor_name]');
    console.error('Example: node send_donation_receipt.js 6282234551160 250000 "Adopsi Santri" TRX20260709001 "Ahmad"');
    process.exit(1);
  }

  const [phone, amountStr, tier, transactionId, donorName] = args;
  const amount = parseInt(amountStr);

  // Validate inputs
  if (!phone.match(/^628\d{9,12}$/)) {
    console.error('Error: Phone must be in E.164 format (628xxxxxxxxxx)');
    process.exit(1);
  }

  if (isNaN(amount) || amount <= 0) {
    console.error('Error: Amount must be a positive number');
    process.exit(1);
  }

  // Generate receipt
  const donation = {
    amount,
    tier,
    transactionId,
    donorName: donorName || 'Donatur',
    timestamp: Date.now()
  };

  const receiptMessage = generateReceiptMessage(donation);

  // Send via WAHA
  try {
    console.log('Sending receipt to:', phone);
    console.log('Amount:', formatRupiah(amount));
    console.log('Tier:', tier);
    console.log('Transaction ID:', transactionId);
    console.log('---');

    const response = await sendWhatsAppMessage(phone, receiptMessage);
    
    console.log('✅ Receipt sent successfully!');
    console.log('Response:', JSON.stringify(response, null, 2));
    
    // Log to file for tracking
    const logEntry = {
      timestamp: new Date().toISOString(),
      phone,
      amount,
      tier,
      transactionId,
      donorName,
      status: 'sent',
      wahaResponse: response
    };
    
    console.log('\nLog entry:', JSON.stringify(logEntry, null, 2));
    
  } catch (error) {
    console.error('❌ Failed to send receipt:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

// Export for use as module
module.exports = {
  sendWhatsAppMessage,
  generateReceiptMessage,
  formatRupiah
};
