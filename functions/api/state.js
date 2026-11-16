// Sync endpoint for the Daily app. Lives behind Cloudflare Access.
// Kept deliberately light on CPU (the free plan allows ~10 ms per request):
// the app's data is stored and returned as raw text and is never parsed here.
//   Binding needed: KV namespace bound as DAILY
//   Optional variable: ALLOWED_EMAIL (extra check on the Access identity)

const HEADERS = { 'content-type': 'application/json', 'cache-control': 'no-store' };
const json = (obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: HEADERS });

export async function onRequest({ request, env }) {
  // Only answer on the main address (e.g. daily-dxo.pages.dev), which is behind the login.
  const host = new URL(request.url).hostname;
  if (host.endsWith('.pages.dev') && host.split('.').length !== 3) return json({ error: 'wrong address', host }, 403);
  const email = (request.headers.get('Cf-Access-Authenticated-User-Email') || '').toLowerCase();
  if (env.ALLOWED_EMAIL && email && email !== env.ALLOWED_EMAIL.trim().toLowerCase()) return json({ error: 'wrong email', email }, 403);
  if (!env.DAILY) return json({ error: 'storage not connected' }, 500);

  if (request.method === 'GET') {
    const raw = await env.DAILY.get('state');
    return new Response(raw || '{"updated":0,"data":null}', { headers: HEADERS });
  }

  if (request.method === 'PUT') {
    const updated = Number(request.headers.get('X-Updated'));
    if (!updated) return json({ error: 'bad request' }, 400);
    const current = Number((await env.DAILY.get('updated')) || 0);
    if (current > updated) {                       // another device saved something newer
      const raw = await env.DAILY.get('state');
      return new Response(raw || '{"updated":0,"data":null}', { status: 409, headers: HEADERS });
    }
    const text = await request.text();
    if (text.length < 20) return json({ error: 'bad request' }, 400);
    await env.DAILY.put('state', text);
    await env.DAILY.put('updated', String(updated));
    // One snapshot per day, kept for 30 days.
    const day = new Date().toISOString().slice(0, 10);
    if ((await env.DAILY.get('backupday')) !== day) {
      await env.DAILY.put('backup:' + day, text, { expirationTtl: 60 * 60 * 24 * 30 });
      await env.DAILY.put('backupday', day);
    }
    return json({ ok: true, updated });
  }

  return json({ error: 'method not allowed' }, 405);
}
