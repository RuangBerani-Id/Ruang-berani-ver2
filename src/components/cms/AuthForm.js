'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/browser';

export default function AuthForm({ mode }) {
  const router = useRouter();
  const register = mode === 'register';
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setMsg(''); setBusy(true);
    const sb = supabaseBrowser();
    if (register) {
      if (f.password.length < 8) { setMsg('Kata sandi minimal 8 karakter.'); setBusy(false); return; }
      const { error } = await sb.auth.signUp({ email: f.email, password: f.password, options: { data: { full_name: f.name }, emailRedirectTo: `${location.origin}/staff/login` } });
      setMsg(error ? error.message : 'Pendaftaran diterima. Cek email untuk konfirmasi, lalu tunggu persetujuan admin.');
    } else {
      const { error } = await sb.auth.signInWithPassword({ email: f.email, password: f.password });
      if (error) setMsg('Email atau kata sandi salah.'); else router.replace('/staff/dashboard');
    }
    setBusy(false);
  }

  return (
    <form className="card authform" onSubmit={submit}>
      <img src="/images/logo.jpg" alt="" className="authform__logo" />
      <h1>{register ? 'Staff registration' : 'Staff login'}</h1>
      {register && <div className="field"><label>Full name</label><input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required /></div>}
      <div className="field"><label>Email</label><input type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} required autoComplete="email" /></div>
      <div className="field"><label>Password</label><input type="password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} required autoComplete={register ? 'new-password' : 'current-password'} /></div>
      {msg && <p className={msg.startsWith('Pendaftaran') ? 'note' : 'err'}>{msg}</p>}
      <button className="btn btn--red" disabled={busy}>{busy ? '...' : register ? 'Register' : 'Log in'}</button>
      <p className="note">{register ? <>Sudah punya akun? <Link href="/staff/login">Log in</Link></> : <>Belum punya akun? <Link href="/staff/register">Register</Link></>}</p>
    </form>
  );
}
