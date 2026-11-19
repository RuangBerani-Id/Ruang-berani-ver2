import Link from 'next/link';

export function SecHead({ title, href, cta = 'DISCOVER MORE' }) {
  return (
    <div className="sec-head">
      <span className="sec-head__star" aria-hidden>✦</span>
      <h2>{title}</h2>
      <span className="sec-head__line" aria-hidden />
      {href && <Link href={href} className="btn btn--outline btn--sm">{cta} ›</Link>}
    </div>
  );
}

export function EventCard({ e }) {
  return (
    <Link href={`/gallery/events/${e.id}`} className="ev">
      {e.cover_url && <img src={e.cover_url} alt={e.caption || e.title} loading="lazy" />}
      <span className="ev__cap"><span>{e.caption || e.title}</span></span>
    </Link>
  );
}

export function IdCard({ m, variant = 'mini', as = 'link' }) {
  const body = (
    <>
      <div className="idc__head">
        <img src="/images/logo.jpg" alt="" />
        <div>
          <small>HUMAN RESOURCE DEPARTMENT OF</small>
          <strong>RUANG BERANI INDONESIA</strong>
          <small>JAKARTA</small>
        </div>
      </div>
      <div className="idc__body">
        {m.photo_url ? <img className="idc__photo" src={m.photo_url} alt={m.name} loading="lazy" /> : <div className="idc__photo idc__photo--empty" aria-hidden />}
        <div>
          <h3 className="idc__title">KARTU TANDA ANGGOTA</h3>
          <dl>
            <dt>NAMA</dt><dd>{m.name}</dd>
            <dt>NTA</dt><dd>{m.nta || '-'}</dd>
            <dt>JABATAN</dt><dd>{m.position || '-'}</dd>
            {m.location && (<><dt>ALAMAT DINAS</dt><dd>{m.location}</dd></>)}
          </dl>
        </div>
      </div>
      {variant === 'full' && <img className="idc__mark" src="/images/logo.jpg" alt="" aria-hidden />}
    </>
  );
  return as === 'link' ? (
    <Link href={`/gallery/members/${m.id}`} className={`idc idc--${variant}`}>{body}</Link>
  ) : (
    <div className={`idc idc--${variant}`}>{body}</div>
  );
}

export function Stars({ n = 0 }) {
  return (
    <span className="stars" aria-label={`${n} dari 5`}>
      {[1, 2, 3, 4, 5].map((i) => <i key={i} className={i <= n ? 'on' : ''}>★</i>)}
    </span>
  );
}

export function ReviewCard({ t, quote }) {
  const initials = (t.name || '?').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <article className={`review ${quote ? 'review--quote' : ''}`}>
      {quote && <span className="review__q" aria-hidden>“</span>}
      <header>
        <span className="avatar">{initials}</span>
        <div>
          <strong>{t.name}</strong>
          {t.organization && <small>{t.organization}</small>}
        </div>
      </header>
      <Stars n={t.rating} />
      <p>{t.quote}</p>
    </article>
  );
}

export function Empty({ children }) {
  return <div className="empty">{children}</div>;
}
