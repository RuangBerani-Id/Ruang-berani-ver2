import { ReviewCard, Empty } from '@/components/Cards';
import { getTestimonials } from '@/lib/data';
export const metadata = { title: 'Worked & Trusted By' };
export default async function Trusted() {
  const items = await getTestimonials('trusted');
  return (
    <div className="container section">
      <p className="eyebrow"><span aria-hidden>✦</span> COLLABORATIONS <i /></p>
      <h1 className="h-serif sc big">Worked &amp; Trusted By</h1>
      <p className="sub">Organizations that have placed their confidence in us</p>
      <span className="rule" aria-hidden />
      {items.length ? <div className="grid grid--4">{items.map((t) => <ReviewCard key={t.id} t={t} />)}</div> : <Empty>Ulasan dari mitra akan tampil di sini setelah dipublikasikan.</Empty>}
    </div>
  );
}
