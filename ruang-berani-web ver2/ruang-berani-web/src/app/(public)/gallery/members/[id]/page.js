import Link from 'next/link';
import { notFound } from 'next/navigation';
import { IdCard } from '@/components/Cards';
import { getMember, getMembers } from '@/lib/data';

export async function generateMetadata({ params }) {
  const m = await getMember(params.id);
  return { title: m ? m.name : 'Member' };
}

export default async function MemberDetail({ params }) {
  const [m, all] = await Promise.all([getMember(params.id), getMembers()]);
  if (!m) notFound();
  const i = all.findIndex((x) => x.id === m.id);
  const prev = all[i - 1], next = all[i + 1];
  const pad = (n) => String(n).padStart(2, '0');
  return (
    <div className="container section">
      <Link href="/gallery" className="back">← BACK TO GALLERY</Link>
      <div className="detail-card"><IdCard m={m} variant="full" as="div" /></div>
      <div className="detail-info">
        <div>
          <h1 className="h-serif sc">{m.name}</h1>
          <p className="lead">{m.bio || `${m.position || 'Member'} of Ruang Berani Indonesia.`}</p>
        </div>
        <dl className="meta">
          <dt>NTA</dt><dd>{m.nta || '-'}</dd>
          <dt>JABATAN</dt><dd>{m.position || '-'}</dd>
          {m.location && (<><dt>ALAMAT DINAS</dt><dd>{m.location}</dd></>)}
        </dl>
      </div>
      <nav className="pager" aria-label="Anggota lain">
        {prev ? <Link href={`/gallery/members/${prev.id}`}>‹ Sebelumnya</Link> : <span />}
        <span>{pad(i + 1)} / {pad(all.length)}</span>
        {next ? <Link href={`/gallery/members/${next.id}`}>Berikutnya ›</Link> : <span />}
      </nav>
    </div>
  );
}
