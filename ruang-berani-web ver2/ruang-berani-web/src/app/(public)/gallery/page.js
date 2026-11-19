import HScroller from '@/components/HScroller';
import { EventCard, IdCard, SecHead, Empty } from '@/components/Cards';
import { getEvents, getMembers } from '@/lib/data';
export const metadata = { title: 'Gallery' };

export default async function Gallery() {
  const [members, events] = await Promise.all([getMembers(), getEvents()]);
  return (
    <div className="container section">
      <SecHead title="Our Members" href="/gallery/members" />
      {members.length ? (
        <HScroller label="Our members">{members.map((m) => <IdCard key={m.id} m={m} />)}</HScroller>
      ) : <Empty>Profil anggota akan tampil di sini.</Empty>}
      <div className="gap-lg" />
      <SecHead title="Work Documentation" href="/gallery/events" />
      {events.length ? (
        <HScroller label="Work documentation">{events.map((e) => <EventCard key={e.id} e={e} />)}</HScroller>
      ) : <Empty>Dokumentasi kegiatan akan tampil di sini.</Empty>}
    </div>
  );
}
