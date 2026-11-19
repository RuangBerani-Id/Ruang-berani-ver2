'use client';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { DEFAULT_SETTINGS, SETTINGS_FIELDS } from '@/lib/defaults';
import ImageUpload from './ImageUpload';

export default function SettingsEditor() {
  const sb = supabaseBrowser();
  const [v, setV] = useState(DEFAULT_SETTINGS);
  const [msg, setMsg] = useState('');
  useEffect(() => {
    sb.from('site_settings').select('value').eq('key', 'site').maybeSingle().then(({ data }) => { if (data) setV({ ...DEFAULT_SETTINGS, ...data.value }); });
  }, []); // eslint-disable-line
  async function save(e) {
    e.preventDefault();
    const { error } = await sb.from('site_settings').upsert({ key: 'site', value: v });
    setMsg(error ? error.message : 'Tersimpan.');
  }
  return (
    <form className="card cms__form" onSubmit={save}>
      <h2>Site settings</h2>
      {SETTINGS_FIELDS.map((f) => (
        <div className="field" key={f.key}>
          <label>{f.label}</label>
          {f.type === 'textarea' ? <textarea rows={3} value={v[f.key] ?? ''} onChange={(e) => setV({ ...v, [f.key]: e.target.value })} />
            : f.type === 'image' ? <ImageUpload value={v[f.key]} onChange={(u) => setV({ ...v, [f.key]: u })} folder={f.folder} />
            : <input value={v[f.key] ?? ''} onChange={(e) => setV({ ...v, [f.key]: e.target.value })} />}
        </div>
      ))}
      <div className="cms__actions"><button className="btn btn--red btn--sm">Save</button> {msg && <span>{msg}</span>}</div>
    </form>
  );
}
