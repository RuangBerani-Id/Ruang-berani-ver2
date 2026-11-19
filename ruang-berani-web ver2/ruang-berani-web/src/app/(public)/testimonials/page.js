import { ReviewCard, Empty } from '@/components/Cards';
import { getTestimonials } from '@/lib/data';
export const metadata = { title: 'Testimonial Highlights' };
export default async function Testimonials() {
  const items = await getTestimonials('highlight');
  return (
    <div className="container section">
      <p className="eyebrow"><span aria-hidden>✦</span> CLIENT VOICES <i /></p>
      <h1 className="h-serif sc big">Testimonial Highlights</h1>
      <p className="sub">Words from those who have experienced the work firsthand</p>
      <span className="rule" aria-hidden />
      {items.length ? <div className="grid grid--4">{items.map((t) => <ReviewCard key={t.id} t={t} quote />)}</div> : <Empty>Testimoni akan tampil di sini setelah dipublikasikan.</Empty>}
    </div>
  );
}
