/**
 * CF Pages Function — POST /api/donate
 * Generates Midtrans Snap token, returns { token, redirect_url }
 * Secrets required (CF Dashboard → Pages → Settings → Environment variables):
 *   MIDTRANS_SERVER_KEY  = Mid-server-...
 *   MIDTRANS_CLIENT_KEY  = Mid-client-...
 *   MIDTRANS_ENV         = production | sandbox
 */

const SNAP_URL = {
  production: 'https://app.midtrans.com/snap/v1/transactions',
  sandbox: 'https://app.sandbox.midtrans.com/snap/v1/transactions',
};

export async function onRequestPost(ctx) {
  const { request, env } = ctx;

  // CORS headers — allow ypsma.org and localhost dev
  const origin = request.headers.get('Origin') || '';
  const allowed = ['https://ypsma.org', 'https://www.ypsma.org', 'http://localhost:8788', 'http://localhost:3000'];
  const corsOrigin = allowed.includes(origin) ? origin : 'https://ypsma.org';
  const cors = {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors });
  }

  try {
    const body = await request.json();
    const { amount, campaign, name, email, phone, wa_number } = body;

    // Validate
    if (!amount || !campaign) {
      return Response.json({ error: 'amount dan campaign wajib diisi' }, { status: 400, headers: cors });
    }
    const amountInt = parseInt(amount, 10);
    if (isNaN(amountInt) || amountInt < 1000) {
      return Response.json({ error: 'Minimal donasi Rp 1.000' }, { status: 400, headers: cors });
    }

    const serverKey = env.MIDTRANS_SERVER_KEY;
    const midtransEnv = env.MIDTRANS_ENV || 'production';
    if (!serverKey) {
      console.error('MIDTRANS_SERVER_KEY not set');
      return Response.json({ error: 'Konfigurasi payment belum siap' }, { status: 500, headers: cors });
    }

    // Unique order ID: campaign + timestamp + random
    const ts = Date.now();
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    const orderId = `YPSMA-${campaign.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10)}-${ts}-${rand}`;

    // WA redirect URL setelah bayar
    const waNum = wa_number || '6282234551160';
    const waText = encodeURIComponent(
      `Assalamualaikum, saya baru selesai donasi ${campaign} sebesar Rp ${amountInt.toLocaleString('id-ID')} via Midtrans. Order ID: ${orderId}. Mohon konfirmasi penerimaan donasi. Jazakallahu khairan 🤲`
    );
    const waUrl = `https://wa.me/${waNum}?text=${waText}`;

    const finishUrl = `https://ypsma.org/donate-success.html?order=${encodeURIComponent(orderId)}&campaign=${encodeURIComponent(campaign)}&amount=${amountInt}&wa=${encodeURIComponent(waUrl)}`;

    // Build Snap payload
    const snapPayload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amountInt,
      },
      customer_details: {
        first_name: name || 'Donatur',
        email: email || undefined,
        phone: phone || undefined,
      },
      item_details: [
        {
          id: campaign.replace(/[^a-zA-Z0-9]/g, '-').slice(0, 50),
          price: amountInt,
          quantity: 1,
          name: `Donasi ${campaign} YPSMA`.slice(0, 50),
        },
      ],
      callbacks: {
        finish: finishUrl,
        error: finishUrl + '&status=error',
        pending: finishUrl + '&status=pending',
      },
      expiry: {
        unit: 'hours',
        duration: 24,
      },
    };

    // Remove undefined fields from customer_details
    Object.keys(snapPayload.customer_details).forEach(k => {
      if (snapPayload.customer_details[k] === undefined) delete snapPayload.customer_details[k];
    });

    const auth = btoa(`${serverKey}:`);
    const snapEndpoint = SNAP_URL[midtransEnv] || SNAP_URL.production;

    const snapRes = await fetch(snapEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
      },
      body: JSON.stringify(snapPayload),
    });

    const snapData = await snapRes.json();

    if (!snapRes.ok || !snapData.token) {
      console.error('Midtrans error:', JSON.stringify(snapData));
      return Response.json(
        { error: 'Gagal membuat sesi pembayaran. Coba lagi atau hubungi admin.' },
        { status: 502, headers: cors }
      );
    }

    return Response.json(
      {
        token: snapData.token,
        redirect_url: snapData.redirect_url,
        order_id: orderId,
        finish_url: finishUrl,
      },
      { status: 200, headers: cors }
    );
  } catch (err) {
    console.error('donate handler error:', err);
    return Response.json({ error: 'Internal error' }, { status: 500, headers: cors });
  }
}

// Handle OPTIONS preflight
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
