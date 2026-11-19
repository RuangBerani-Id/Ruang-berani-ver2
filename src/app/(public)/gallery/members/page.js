import { IdCard, SecHead, Empty } from '@/components/Cards';
import Link from 'next/link';
import { getMembers } from '@/lib/data';
export const metadata = { title: 'Our Members' };
export default async function Members() {
  const members = await getMembers();
  return (
    <div className="container section">
      <Link href="/gallery" className="back">← BACK TO GALLERY</Link>
      <SecHead title="Our Members" />
      {members.length ? <div className="grid">{members.map((m) => <IdCard key={m.id} m={m} />)}</div> : <Empty>Belum ada anggota yang ditampilkan.</Empty>}
    </div>
  );
}
