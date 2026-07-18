/**
 * CF Pages Function — POST /api/donate
 * Creates a payment via 1ai-payment service and returns payment_url for redirect.
 *
 * Env vars required (CF Dashboard → Pages → Settings → Environment variables):
 *   PAYMENT_API_KEY      = API key for pay.berkahkarya.org (defaults to dev key)
 *   PAYMENT_SERVICE_URL  = 1ai-payment base URL (defaults to https://pay.berkahkarya.org)
 */

const CORS_ORIGINS = [
  'https://ypsma.org',
  'https://www.ypsma.org',
  'http://localhost:8788',
  'http://localhost:3000',
];

function corsHeaders(origin) {
  const allowed = CORS_ORIGINS.includes(origin) ? origin : 'https://ypsma.org';
  const cors = {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  return cors;
}

export async function onRequestPost(ctx) {
  const { request, env } = ctx;
  const origin = request.headers.get('Origin') || '';
  const cors = corsHeaders(origin);

  try {
    const body = await request.json();
    const { amount, campaign, name, email, phone, wa_number, payment_method } = body;

    // Validate
    if (!amount || !campaign) {
      return Response.json(
        { error: 'amount dan campaign wajib diisi' },
        { status: 400, headers: cors }
      );
    }
    const amountInt = parseInt(amount, 10);
    if (isNaN(amountInt) || amountInt < 1000) {
      return Response.json(
        { error: 'Minimal donasi Rp 1.000' },
        { status: 400, headers: cors }
      );
    }

    // Unique order ID
    const ts = Date.now();
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    const orderId = `YPSMA-${campaign.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10)}-${ts}-${rand}`;

    // WhatsApp confirmation URL after payment
    const waNum = wa_number || '6285655713100';
    const waText = encodeURIComponent(
      `Assalamualaikum, saya baru selesai donasi ${campaign} sebesar Rp ${amountInt.toLocaleString('id-ID')}. Order ID: ${orderId}. Mohon konfirmasi penerimaan donasi. Jazakallahu khairan 🤲`
    );
    const waUrl = `https://wa.me/${waNum}?text=${waText}`;

    // Finish URL — user lands here after payment
    const finishUrl =
      `https://ypsma.org/donate-success` +
      `?order=${encodeURIComponent(orderId)}` +
      `&campaign=${encodeURIComponent(campaign)}` +
      `&amount=${amountInt}`;

    // Server callback URL — 1ai-payment forwards payment events here
    const callbackUrl =
      `https://ypsma.org/api/payment/callback`;

    // Call 1ai-payment
    const apiKey = env.PAYMENT_API_KEY || 'berkahkarya-ecosystem-2026-secure-key';
    const paymentServiceUrl = env.PAYMENT_SERVICE_URL || 'https://pay.berkahkarya.org';

    // Map the user's selected method to a Snap-compatible payment method.
    // The Snap page shows ALL payment methods regardless — this just guides
    // 1ai-payment's gateway selection (Snap API = we get a redirect URL).
    const pmMap = {
      qris: 'qris',
      transfer: 'gopay',
      va: 'gopay',
      ewallet: 'gopay',
    };
    const gatewayPaymentMethod = pmMap[payment_method] || 'gopay';

    const payRes = await fetch(`${paymentServiceUrl}/api/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify({
        gateway: 'midtrans',
        amount: amountInt,
        currency: 'IDR',
        payment_method: gatewayPaymentMethod,
        customer: {
          name: name || 'Donatur',
          email: email || undefined,
          phone: phone || undefined,
        },
        callback_url: callbackUrl,
        metadata: {
          campaign,
          source: 'ypsma-website',
          order_id: orderId,
        },
      }),
    });

    if (!payRes.ok) {
      const errBody = await payRes.text().catch(() => '');
      console.error('1ai-payment error:', payRes.status, errBody);
      return Response.json(
        { error: 'Gagal membuat sesi pembayaran. Coba lagi atau hubungi admin.' },
        { status: 502, headers: cors }
      );
    }

    const payData = await payRes.json();

    if (!payData.success || !payData.data?.payment_url) {
      console.error('1ai-payment unexpected response:', JSON.stringify(payData));
      return Response.json(
        { error: 'Gagal membuat sesi pembayaran. Coba lagi atau hubungi admin.' },
        { status: 502, headers: cors }
      );
    }

    // Append finish_redirect_url to the Midtrans Snap redirect URL so
    // the user's browser comes back to YPSMA after payment.
    const rawPaymentUrl = payData.data.payment_url;
    const finishRedirect = encodeURIComponent(finishUrl);
    const paymentUrl = `${rawPaymentUrl}?finish_redirect_url=${finishRedirect}`;

    return Response.json(
      {
        payment_url: paymentUrl,
        order_id: orderId,
        finish_url: finishUrl,
        wa_url: waUrl,
      },
      { status: 200, headers: cors }
    );
  } catch (err) {
    console.error('donate error:', err);
    return Response.json(
      { error: 'Terjadi kesalahan internal' },
      { status: 500, headers: cors }
    );
  }
}

export async function onRequestOptions() {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  return new Response(null, { status: 204, headers: cors });
}
