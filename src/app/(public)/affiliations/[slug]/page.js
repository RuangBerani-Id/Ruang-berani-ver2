import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAffiliation } from '@/lib/data';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const a = await getAffiliation(slug);
  return { title: a ? a.name : 'Affiliation' };
}

export default async function AffiliationDetail({ params }) {
  const { slug } = await params;
  const a = await getAffiliation(slug);
  if (!a) notFound();
  return (
    <div className="container section">
      <Link href="/affiliations" className="back">← BACK TO AFFILIATIONS</Link>
      <article className="card aff">
        <div className="aff__top">
          {a.logo_url && <img src={a.logo_url} alt={a.name} />}
          <h1 className="h-serif">{a.name}</h1>
          <p className="lead">Ruang Berani is directly affiliated with {a.name}</p>
        </div>
        <div className="aff__bottom">
          <div>
            <h2 className="h-serif">{a.name}</h2>
            <p>{a.description || `Ruang Berani is directly affiliated with ${a.name}.`}</p>
          </div>
          <dl className="meta">
            <dt>STATUS</dt><dd>{a.status || 'Affiliation'}</dd>
            <dt>AFFILIATED SINCE</dt><dd>{a.since_label || '-'}</dd>
            <dt>AFFILIATED UNTIL</dt><dd>{a.until_label || 'Undecided time'}</dd>
          </dl>
        </div>
      </article>
    </div>
  );
}
