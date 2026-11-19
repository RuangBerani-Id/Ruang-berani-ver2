'use client';
import { useCallback, useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/browser';

export default function UsersAdmin({ me }) {
  const sb = supabaseBrowser();
  const [rows, setRows] = useState([]);
  const [msg, setMsg] = useState('');
  const load = useCallback(async () => {
    const { data, error } = await sb.from('profiles').select('*').order('created_at', { ascending: true });
    if (error) setMsg(error.message); else setRows(data || []);
  }, []); // eslint-disable-line
  useEffect(() => { load(); }, [load]);
  async function patch(id, change) {
    const { error } = await sb.from('profiles').update(change).eq('id', id);
    if (error) setMsg(error.message); else load();
  }
  return (
    <section>
      <h2>Users</h2>
      <p className="note">Pendaftar baru berstatus <b>pending</b> dan belum bisa melihat apa pun. Setujui dengan mengubahnya menjadi staff. Izin membaca cerita diberikan terpisah.</p>
      {msg && <p className="err">{msg}</p>}
      <div className="tablewrap"><table className="table">
        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Can read stories</th></tr></thead>
        <tbody>{rows.map((r) => (
          <tr key={r.id}>
            <td>{r.full_name || '-'}</td><td>{r.email}</td>
            <td><select disabled={r.id === me.id} value={r.role} onChange={(e) => patch(r.id, { role: e.target.value })}>
              {['pending', 'staff', 'admin'].map((x) => <option key={x}>{x}</option>)}</select></td>
            <td><input type="checkbox" disabled={r.id === me.id} checked={r.can_read_stories} onChange={(e) => patch(r.id, { can_read_stories: e.target.checked })} /></td>
          </tr>))}</tbody>
      </table></div>
    </section>
  );
}
