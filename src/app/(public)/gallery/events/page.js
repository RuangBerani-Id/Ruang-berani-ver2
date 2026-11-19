import { EventCard, SecHead, Empty } from '@/components/Cards';
import Link from 'next/link';
import { getEvents } from '@/lib/data';
export const metadata = { title: 'Work Documentation' };
export default async function Events() {
  const events = await getEvents();
  return (
    <div className="container section">
      <Link href="/gallery" className="back">← BACK TO GALLERY</Link>
      <SecHead title="Work Documentation" />
      {events.length ? <div className="grid">{events.map((e) => <EventCard key={e.id} e={e} />)}</div> : <Empty>Belum ada dokumentasi yang ditampilkan.</Empty>}
    </div>
  );
}
