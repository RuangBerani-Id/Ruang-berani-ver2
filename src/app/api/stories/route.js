import { publicClient } from '@/lib/supabase/public';
import { validateStory, cleanStory } from '@/lib/storyRules';

export const runtime = 'nodejs';

// Never log the request body or headers here: that would break the anonymity promise.
export async function POST(req) {
  let body;
  try { body = await req.json(); } catch { return Response.json({ errors: { form: 'Permintaan tidak valid.' } }, { status: 400 }); }
  if (body?.website) return Response.json({ ok: true }); // honeypot: pretend success
  const { ok, errors } = validateStory(body || {});
  if (!ok) return Response.json({ errors }, { status: 400 });
  const sb = publicClient();
  if (!sb) return Response.json({ errors: { form: 'Layanan belum dikonfigurasi.' } }, { status: 503 });
  const { error } = await sb.from('stories').insert(cleanStory(body)); // anon may INSERT only (RLS)
  if (error) return Response.json({ errors: { form: 'Gagal menyimpan. Coba lagi beberapa saat.' } }, { status: 500 });
  return Response.json({ ok: true });
}
