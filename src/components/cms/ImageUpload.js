'use client';
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/browser';

export default function ImageUpload({ value, onChange, folder = 'misc', multiple = false }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const list = multiple ? value || [] : value ? [value] : [];

  async function pick(e) {
    setErr('');
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setBusy(true);
    const sb = supabaseBrowser();
    const urls = [];
    for (const file of files) {
      if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) { setErr('Hanya gambar, maksimal 5 MB per file.'); continue; }
      const path = `${folder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const { error } = await sb.storage.from('media').upload(path, file, { upsert: false });
      if (error) { setErr(error.message); continue; }
      urls.push(sb.storage.from('media').getPublicUrl(path).data.publicUrl);
    }
    setBusy(false);
    e.target.value = '';
    if (urls.length) onChange(multiple ? [...list, ...urls] : urls[0]);
  }

  return (
    <div className="upload">
      <div className="upload__thumbs">
        {list.map((u) => (
          <div key={u} className="upload__thumb">
            <img src={u} alt="" />
            <button type="button" onClick={() => onChange(multiple ? list.filter((x) => x !== u) : '')} aria-label="Hapus gambar">×</button>
          </div>
        ))}
      </div>
      <input type="file" accept="image/*" multiple={multiple} onChange={pick} disabled={busy} />
      {busy && <small>Mengunggah...</small>}
      {err && <p className="err">{err}</p>}
    </div>
  );
}
