import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getEvent, getEvents } from '@/lib/data';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const e = await getEvent(id);
  return { title: e ? e.title : 'Event' };
}

export default async function EventDetail({ params }) {
  const { id } = await params;
  const [e, all] = await Promise.all([getEvent(id), getEvents()]);
  if (!e) notFound();
  const i = all.findIndex((x) => x.id === e.id);
  const prev = all[i - 1], next = all[i + 1];
  const pad = (n) => String(n).padStart(2, '0');
  return (
    <div className="container section">
      <Link href="/gallery" className="back">← BACK TO GALLERY</Link>
      <article className="event-detail card">
        {e.cover_url && <img className="event-detail__cover" src={e.cover_url} alt={e.caption || e.title} />}
        <div className="event-detail__body">
          <h1 className="h-serif sc">{e.title}</h1>
          {e.caption && <p className="pill">{e.caption}</p>}
          <dl className="meta meta--row">
            {e.date_label && (<><dt>TANGGAL</dt><dd>{e.date_label}</dd></>)}
            {e.location && (<><dt>LOKASI</dt><dd>{e.location}</dd></>)}
          </dl>
          {e.description && <p className="lead">{e.description}</p>}
        </div>
        {e.photos?.length > 0 && (
          <div className="photos">{e.photos.map((p) => <img key={p} src={p} alt="" loading="lazy" />)}</div>
        )}
      </article>
      <nav className="pager" aria-label="Dokumentasi lain">
        {prev ? <Link href={`/gallery/events/${prev.id}`}>‹ Sebelumnya</Link> : <span />}
        <span>{pad(i + 1)} / {pad(all.length)}</span>
        {next ? <Link href={`/gallery/events/${next.id}`}>Berikutnya ›</Link> : <span />}
      </nav>
    </div>
  );
}
