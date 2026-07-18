/**
 * CF Pages Function — POST /api/payment/callback
 * Receives forwarded payment events from 1ai-payment service.
 *
 * The forwarder signs the JSON payload with HMAC-SHA256 using
 * the merchant's webhook_secret stored in the payments database.
 *
 * Env vars:
 *   PAYMENT_WEBHOOK_SECRET  = merchant webhook_secret for HMAC verification
 *   PAYMENT_API_KEY         = API key for 1ai-payment (optional, debug)
 */

const CORS_ORIGINS = [
  'https://ypsma.org',
  'https://www.ypsma.org',
];

export async function onRequestPost(ctx) {
  const { request, env } = ctx;
  const origin = request.headers.get('Origin') || '';
  const corsOrigin = CORS_ORIGINS.includes(origin) ? origin : 'https://ypsma.org';
  const cors = { 'Access-Control-Allow-Origin': corsOrigin };

  try {
    const bodyText = await request.text();
    const signature = request.headers.get('X-Payment-Signature');
    const secret = env.PAYMENT_WEBHOOK_SECRET || 'berkahkarya-ecosystem-2026-secure-key';

    if (!signature) {
      return Response.json({ error: 'Missing X-Payment-Signature' }, { status: 401, headers: cors });
    }

    // Verify HMAC-SHA256 signature
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign'],
    );
    const expected = await crypto.subtle.sign('HMAC', key, encoder.encode(bodyText));
    const expectedHex = Array.from(new Uint8Array(expected))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    if (signature !== expectedHex) {
      console.error('[Payment Callback] Invalid signature:', signature, 'expected:', expectedHex);
      return Response.json({ error: 'Invalid signature' }, { status: 401, headers: cors });
    }

    // Parse event
    const event = JSON.parse(bodyText);
    console.log('[Payment Callback] Received:', JSON.stringify({
      order_id: event.order_id,
      transaction_id: event.transaction_id,
      status: event.status,
      gateway: event.gateway,
      amount: event.amount,
    }));

    // Acknowledge receipt — forwarder stops retrying
    return Response.json({ ok: true }, { status: 200, headers: cors });
  } catch (err) {
    console.error('[Payment Callback] Error:', err);
    return Response.json({ error: 'Internal error' }, { status: 500, headers: cors });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' },
  });
}
