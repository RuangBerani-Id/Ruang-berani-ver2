import Header from '@/components/Header';
import Marquee from '@/components/Marquee';
import Footer from '@/components/Footer';
import Decor from '@/components/Decor';
import { NAV } from '@/lib/config';
import { getSettings } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function PublicLayout({ children }) {
  const s = await getSettings();
  return (
    <div className="page">
      <Decor />
      <Header items={NAV} />
      <Marquee text={s.marquee_text} />
      <main className="page__main">{children}</main>
      <Footer s={s} />
    </div>
  );
}
