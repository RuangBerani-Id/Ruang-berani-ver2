'use client';
import { useState } from 'react';
import { validateStory, CATEGORIES } from '@/lib/storyRules';
import { HELP_LINES } from '@/lib/config';

const initial = {
  mode: 'anonymous', is_minor: false, reporter_name: '', reporter_contact: '', school_name: '',
  category: '', story_body: '', consent_storage: false, consent_adaptation: false,
  consent_publication: false, guardian_permission: false, consent_school_forward: false, website: '',
};

function Err({ m }) { return m ? <p className="err" role="alert">{m}</p> : null; }

export default function StoryForm() {
  const [f, setF] = useState(initial);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const anon = f.mode === 'anonymous';

  async function submit(e) {
    e.preventDefault();
    const { ok, errors: er } = validateStory(f);
    setErrors(er);
    if (!ok) { document.getElementById('story-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    setStatus('sending');
    try {
      const r = await fetch('/api/stories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) });
      if (!r.ok) { const j = await r.json().catch(() => ({})); setErrors(j.errors || { form: 'Gagal mengirim. Coba lagi.' }); setStatus('idle'); return; }
      setStatus('done');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch { setErrors({ form: 'Koneksi bermasalah. Coba lagi.' }); setStatus('idle'); }
  }

  if (status === 'done') {
    const reachable = !!f.reporter_contact.trim();
    return (
      <div className="card done">
        <h2>Ceritamu sudah kami terima</h2>
        <p>Terima kasih sudah berani bersuara. Hanya staf Ruang Berani yang ditugaskan yang dapat membacanya, dan hanya sesuai persetujuan yang kamu pilih.</p>
        <p>{reachable ? 'Kami akan menghubungimu lewat kontak yang kamu isi.' : 'Karena kamu tidak menyertakan kontak, kami tidak bisa menghubungimu. Jika kamu butuh bantuan segera, hubungi layanan di bawah ini.'}</p>
        <ul>{HELP_LINES.map((h) => <li key={h.name}><strong>{h.name}</strong>: {h.detail}</li>)}</ul>
      </div>
    );
  }

  return (
    <form id="story-form" className="story" onSubmit={submit} noValidate>
      <Err m={errors.form} />
      <fieldset className="card">
        <legend>1. Pilih cara kamu bercerita</legend>
        <div className="choices">
          <label className={`choice ${anon ? 'on' : ''}`}>
            <input type="radio" name="mode" checked={anon} onChange={() => set('mode', 'anonymous')} />
            <strong>Anonim</strong>
            <span>Tanpa nama dan sekolah. Kontak boleh dikosongkan.</span>
          </label>
          <label className={`choice ${!anon ? 'on' : ''}`}>
            <input type="radio" name="mode" checked={!anon} onChange={() => set('mode', 'identified')} />
            <strong>Tidak anonim</strong>
            <span>Nama dan kontak diisi supaya kami bisa mendampingimu.</span>
          </label>
        </div>
        <Err m={errors.mode} />
        {anon && !f.reporter_contact && (
          <p className="note">Tanpa kontak, kami tidak dapat menghubungimu kembali. Tambahkan kontak (opsional) bila kamu ingin ditenangkan atau didampingi.</p>
        )}
      </fieldset>

      <fieldset className="card">
        <legend>2. Tentang kamu</legend>
        <label className="check"><input type="checkbox" checked={f.is_minor} onChange={(e) => set('is_minor', e.target.checked)} /> Saya berusia di bawah 18 tahun</label>
        {!anon && (
          <div className="field"><label htmlFor="name">Nama</label>
            <input id="name" value={f.reporter_name} onChange={(e) => set('reporter_name', e.target.value)} autoComplete="name" /><Err m={errors.reporter_name} /></div>
        )}
        <div className="field"><label htmlFor="contact">{anon ? 'Kontak (opsional): WhatsApp atau email' : 'Kontak: WhatsApp atau email'}</label>
          <input id="contact" value={f.reporter_contact} onChange={(e) => set('reporter_contact', e.target.value)} /><Err m={errors.reporter_contact} /></div>
        {!anon && (
          <div className="field"><label htmlFor="school">Sekolah (opsional, wajib bila ingin diteruskan ke BK)</label>
            <input id="school" value={f.school_name} onChange={(e) => set('school_name', e.target.value)} /><Err m={errors.school_name} /></div>
        )}
      </fieldset>

      <fieldset className="card">
        <legend>3. Ceritamu</legend>
        <div className="field"><label htmlFor="cat">Jenis kejadian</label>
          <select id="cat" value={f.category} onChange={(e) => set('category', e.target.value)}>
            <option value="">Pilih...</option>
            {CATEGORIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select><Err m={errors.category} /></div>
        <div className="field"><label htmlFor="body">Ceritakan dengan caramu sendiri</label>
          <textarea id="body" rows={9} value={f.story_body} onChange={(e) => set('story_body', e.target.value)} maxLength={8000} />
          <small>{f.story_body.length}/8000</small><Err m={errors.story_body} /></div>
        <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" name="website" value={f.website} onChange={(e) => set('website', e.target.value)} />
      </fieldset>

      <fieldset className="card consents">
        <legend>4. Persetujuanmu</legend>
        <p className="note">Setiap persetujuan berdiri sendiri. Hanya persetujuan penyimpanan yang wajib.</p>
        <label className="check"><input type="checkbox" checked={f.consent_storage} onChange={(e) => set('consent_storage', e.target.checked)} /><span><strong>Penyimpanan data (wajib).</strong> Saya setuju ceritaku disimpan dan dibaca staf Ruang Berani yang ditugaskan untuk pendampingan.</span></label><Err m={errors.consent_storage} />
        <label className="check"><input type="checkbox" checked={f.consent_adaptation} onChange={(e) => set('consent_adaptation', e.target.checked)} /><span><strong>Adaptasi cerita.</strong> Saya setuju ceritaku diadaptasi (identitas dihapus) untuk materi edukasi.</span></label>
        <label className="check"><input type="checkbox" checked={f.consent_publication} onChange={(e) => set('consent_publication', e.target.checked)} /><span><strong>Publikasi cerita.</strong> Saya setuju ceritaku dipublikasikan.</span></label>
        {!anon && (
          <label className="check"><input type="checkbox" checked={f.consent_school_forward} onChange={(e) => set('consent_school_forward', e.target.checked)} /><span><strong>Teruskan ke sekolah (BK).</strong> Saya setuju ceritaku diteruskan ke BK / tim penanganan di sekolahku.</span></label>
        )}
        <Err m={errors.consent_school_forward} />
        <label className="check"><input type="checkbox" checked={f.guardian_permission} onChange={(e) => set('guardian_permission', e.target.checked)} /><span><strong>Izin orang tua/wali untuk anak di bawah 18 tahun.</strong> Orang tua/wali saya mengetahui dan mengizinkan.</span></label>
        <Err m={errors.guardian_permission} />
      </fieldset>

      <button className="btn btn--red btn--lg" disabled={status === 'sending'}>{status === 'sending' ? 'Mengirim...' : 'Kirim cerita'}</button>
    </form>
  );
}
