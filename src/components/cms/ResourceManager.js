'use client';
import { useCallback, useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/browser';
import ImageUpload from './ImageUpload';

export default function ResourceManager({ schema }) {
  const { table, title, fields, columns } = schema;
  const sb = supabaseBrowser();
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(null);
  const [msg, setMsg] = useState('');

  const load = useCallback(async () => {
    const { data, error } = await sb.from(table).select('*').order('sort_order', { ascending: true });
    if (error) setMsg(error.message); else setRows(data || []);
  }, [table]); // eslint-disable-line
  useEffect(() => { load(); }, [load]);

  const blank = () => Object.fromEntries(fields.map((f) => [f.key, f.type === 'bool' ? false : f.type === 'images' ? [] : f.type === 'number' ? (f.key === 'rating' ? 5 : 0) : f.default ?? '']));

  async function save(e) {
    e.preventDefault();
    setMsg('');
    const p = { ...form };
    delete p.id; delete p.created_at;
    fields.forEach((f) => {
      if (f.type === 'number') p[f.key] = Number(p[f.key]) || 0;
      else if (p[f.key] === '') p[f.key] = null;
    });
    if (p.published && !p.consent_confirmed) { setMsg('Untuk menerbitkan, centang konfirmasi izin terlebih dahulu.'); return; }
    const { error } = form.id ? await sb.from(table).update(p).eq('id', form.id) : await sb.from(table).insert(p);
    if (error) { setMsg(error.message); return; }
    setForm(null); load();
  }
  async function remove(r) {
    if (!confirm('Hapus item ini?')) return;
    const { error } = await sb.from(table).delete().eq('id', r.id);
    if (error) setMsg(error.message); else load();
  }

  const input = (f) => {
    const v = form[f.key];
    const set = (val) => setForm((p) => ({ ...p, [f.key]: val }));
    if (f.type === 'textarea') return <textarea rows={4} value={v ?? ''} onChange={(e) => set(e.target.value)} required={f.required} />;
    if (f.type === 'number') return <input type="number" value={v} onChange={(e) => set(e.target.value)} />;
    if (f.type === 'bool') return null;
    if (f.type === 'select') return <select value={v} onChange={(e) => set(e.target.value)}>{f.options.map(([val, l]) => <option key={val} value={val}>{l}</option>)}</select>;
    if (f.type === 'image') return <ImageUpload value={v} onChange={set} folder={f.folder} />;
    if (f.type === 'images') return <ImageUpload value={v} onChange={set} folder={f.folder} multiple />;
    return <input value={v ?? ''} onChange={(e) => set(e.target.value)} required={f.required} />;
  };

  return (
    <section>
      <div className="cms__bar">
        <h2>{title}</h2>
        <button className="btn btn--red btn--sm" onClick={() => setForm(blank())}>+ Add</button>
      </div>
      {msg && <p className="err">{msg}</p>}
      {form && (
        <form className="card cms__form" onSubmit={save}>
          {fields.map((f) => f.type === 'bool' ? (
            <label key={f.key} className="check"><input type="checkbox" checked={!!form[f.key]} onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.checked }))} /><span>{f.label}</span></label>
          ) : (
            <div className="field" key={f.key}><label>{f.label}</label>{input(f)}</div>
          ))}
          <div className="cms__actions">
            <button className="btn btn--red btn--sm">Save</button>
            <button type="button" className="btn btn--outline btn--sm" onClick={() => setForm(null)}>Cancel</button>
          </div>
        </form>
      )}
      <div className="tablewrap">
        <table className="table">
          <thead><tr>{columns.map((c) => <th key={c}>{c}</th>)}<th /></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                {columns.map((c) => <td key={c}>{typeof r[c] === 'boolean' ? (r[c] ? '✓' : '–') : String(r[c] ?? '')}</td>)}
                <td className="table__act">
                  <button className="link" onClick={() => setForm({ ...r })}>Edit</button>
                  <button className="link link--danger" onClick={() => remove(r)}>Delete</button>
                </td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan={columns.length + 1}>Belum ada data.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}
