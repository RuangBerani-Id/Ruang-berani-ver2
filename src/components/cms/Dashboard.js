'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { SCHEMAS } from './schemas';
import ResourceManager from './ResourceManager';
import SettingsEditor from './SettingsEditor';
import StoriesInbox from './StoriesInbox';
import UsersAdmin from './UsersAdmin';

export default function Dashboard() {
  const sb = supabaseBrowser();
  const router = useRouter();
  const [me, setMe] = useState(null);
  const [tab, setTab] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      const { data: { user } } = await sb.auth.getUser();
      if (!user) { router.replace('/staff/login'); return; }
      const { data, error: e } = await sb.from('profiles').select('*').eq('id', user.id).single();
      if (e) { setError(e.message); return; }
      setMe(data);
    })();
  }, []); // eslint-disable-line

  if (error) return <p className="err">{error}</p>;
  if (!me) return <p>Memuat...</p>;

  const staff = me.role === 'staff' || me.role === 'admin';
  const admin = me.role === 'admin';
  const reader = admin || (staff && me.can_read_stories);
  const tabs = [
    reader && ['stories', 'Stories'],
    staff && ['members', 'Members'], staff && ['events', 'Events'],
    staff && ['testimonials', 'Testimonials'], staff && ['affiliations', 'Affiliations'],
    staff && ['settings', 'Settings'], admin && ['users', 'Users'],
  ].filter(Boolean);
  const current = tab || tabs[0]?.[0];

  async function logout() { await sb.auth.signOut(); router.replace('/staff/login'); }

  return (
    <div className="cms">
      <header className="cms__top">
        <div><strong>Ruang Berani CMS</strong><small> {me.full_name || me.email} · {me.role}</small></div>
        <button className="btn btn--outline btn--sm" onClick={logout}>Log out</button>
      </header>
      {!staff ? (
        <div className="card"><h2>Menunggu persetujuan</h2><p>Akunmu sudah terdaftar, tetapi belum disetujui admin. Hubungi admin Ruang Berani untuk mengaktifkan akses.</p></div>
      ) : (
        <>
          <nav className="cms__tabs">{tabs.map(([k, l]) => <button key={k} className={k === current ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>)}</nav>
          {current === 'stories' && <StoriesInbox isAdmin={admin} />}
          {SCHEMAS[current] && <ResourceManager key={current} schema={SCHEMAS[current]} />}
          {current === 'settings' && <SettingsEditor />}
          {current === 'users' && <UsersAdmin me={me} />}
        </>
      )}
    </div>
  );
}
