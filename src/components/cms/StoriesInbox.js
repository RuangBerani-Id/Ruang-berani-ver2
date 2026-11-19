'use client';
import { useCallback, useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { CATEGORIES } from '@/lib/storyRules';

const STATUSES = ['new', 'in_review', 'referred', 'closed'];
const catLabel = (v) => CATEGORIES.find(([c]) => c === v)?.[1] || v;
const yes = (b) => (b ? 'Ya' : 'Tidak');

export default function StoriesInbox({ isAdmin }) {
  const sb = supabaseBrowser();
  const [rows, setRows] = useState([]);
  const [sel, setSel] = useState(null);
  const [msg, setMsg] = useState('');

  const load = useCallback(async () => {
    // The list deliberately omits the story text; it is only fetched (and logged) when opened.
    const { data, error } = await sb.from('stories').select('id,created_at,mode,category,status,is_minor').order('created_at', { ascending: false });
    if (error) setMsg(error.message); else setRows(data || []);
  }, []); // eslint-disable-line
  useEffect(() => { load(); }, [load]);

  async function open(id) {
    const { data, error } = await sb.from('stories').select('*').eq('id', id).single();
    if (error) { setMsg(error.message); return; }
    setSel(data);
    await sb.from('story_access_log').insert({ story_id: id, action: 'view' });
  }
  async function setStatus(status) {
    const { error } = await sb.from('stories').update({ status }).eq('id', sel.id);
    if (error) { setMsg(error.message); return; }
    await sb.from('story_access_log').insert({ story_id: sel.id, action: `status:${status}` });
    setSel({ ...sel, status }); load();
  }
  async function remove() {
    if (!confirm('Hapus cerita ini secara permanen?')) return;
    const { error } = await sb.from('stories').delete().eq('id', sel.id);
    if (error) setMsg(error.message); else { setSel(null); load(); }
  }

  if (sel) {
    return (
      <section className="card cms__form">
        <button className="link" onClick={() => setSel(null)}>← Kembali</button>
        <h2>{catLabel(sel.category)} · {sel.mode === 'anonymous' ? 'Anonim' : 'Tidak anonim'}</h2>
        <p className="note">Masuk {new Date(sel.created_at).toLocaleString('id-ID')} · Di bawah 18 tahun: {yes(sel.is_minor)}. Pembukaan cerita ini tercatat.</p>
        <p className="story-text">{sel.story_body}</p>
        <dl className="meta">
          <dt>Nama</dt><dd>{sel.reporter_name || '-'}</dd>
          <dt>Kontak</dt><dd>{sel.reporter_contact || '-'}</dd>
          <dt>Sekolah</dt><dd>{sel.school_name || '-'}</dd>
          <dt>Setuju penyimpanan</dt><dd>{yes(sel.consent_storage)}</dd>
          <dt>Setuju adaptasi</dt><dd>{yes(sel.consent_adaptation)}</dd>
          <dt>Setuju publikasi</dt><dd>{yes(sel.consent_publication)}</dd>
          <dt>Setuju diteruskan ke sekolah</dt><dd>{yes(sel.consent_school_forward)}</dd>
          <dt>Izin orang tua/wali</dt><dd>{yes(sel.guardian_permission)}</dd>
        </dl>
        <div className="field"><label>Status</label>
          <select value={sel.status} onChange={(e) => setStatus(e.target.value)}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></div>
        {msg && <p className="err">{msg}</p>}
        {isAdmin && <button className="btn btn--outline btn--sm" onClick={remove}>Delete story</button>}
      </section>
    );
  }
  return (
    <section>
      <h2>Stories</h2>
      {msg && <p className="err">{msg}</p>}
      <div className="tablewrap"><table className="table">
        <thead><tr><th>Received</th><th>Mode</th><th>Category</th><th>Status</th><th /></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{new Date(r.created_at).toLocaleDateString('id-ID')}</td>
              <td>{r.mode}{r.is_minor ? ' · <18' : ''}</td><td>{catLabel(r.category)}</td><td>{r.status}</td>
              <td className="table__act"><button className="link" onClick={() => open(r.id)}>Open</button></td>
            </tr>
          ))}
          {!rows.length && <tr><td colSpan={5}>Belum ada cerita masuk.</td></tr>}
        </tbody>
      </table></div>
    </section>
  );
}
