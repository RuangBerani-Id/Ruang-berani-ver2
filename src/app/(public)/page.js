import Link from 'next/link';
import HScroller from '@/components/HScroller';
import { EventCard, SecHead, Empty } from '@/components/Cards';
import { getEvents, getSettings } from '@/lib/data';

function Location({ line, city }) {
  if (!city || !line.includes(city)) return <>{line}</>;
  const [a, ...rest] = line.split(city);
  return <>{a}<span className="hl">{city}</span>{rest.join(city)}</>;
}

export default async function Home() {
  const [s, events] = await Promise.all([getSettings(), getEvents()]);
  const stats = [1, 2, 3].map((n) => ({ v: s[`stat${n}_value`], l: s[`stat${n}_label`] })).filter((x) => x.v);
  return (
    <>
      <section className="container hero" id="about">
        <div className="hero__text">
          <div className="hero__title">
            <img src="/images/logo.jpg" alt="" />
            <span aria-hidden className="hero__bar" />
            <h1>Ruang Berani</h1>
          </div>
          <p className="hero__tag">{s.hero_tagline}</p>
          <span className="rule" aria-hidden />
          <p className="hero__body">{s.hero_body}</p>
          <p className="hero__body"><Location line={s.hero_location_line} city={s.hero_city} /></p>
          <div className="hero__cta">
            <Link href="/gallery" className="btn btn--red">View Our Works →</Link>
            <Link href="/tell-your-story" className="btn btn--outline">Tell Your Story! →</Link>
          </div>
        </div>
        <aside className="founder">
          <div className="founder__ring">
            <img src={s.founder_photo_url} alt={s.founder_name} />
          </div>
          <h2 className="founder__name">{s.founder_name}</h2>
          <p className="founder__title"><span>{s.founder_title}</span></p>
          {stats.length > 0 && (
            <div className="stats">
              {stats.map((x) => (<div key={x.l} className="stat"><b>{x.v}</b><span>{x.l}</span></div>))}
            </div>
          )}
        </aside>
      </section>

      <section className="container section">
        <div className="sec-head sec-head--slash">
          <span className="slashes" aria-hidden>//</span>
          <h2 className="sans">FEATURED WORKS</h2>
          <span className="sec-head__line" aria-hidden />
          <Link href="/gallery" className="btn btn--outline btn--sm">DISCOVER MORE ›</Link>
        </div>
        {events.length ? (
          <HScroller label="Featured works">{events.map((e) => <EventCard key={e.id} e={e} />)}</HScroller>
        ) : (
          <Empty>Dokumentasi kegiatan akan tampil di sini.</Empty>
        )}
      </section>
    </>
  );
}
