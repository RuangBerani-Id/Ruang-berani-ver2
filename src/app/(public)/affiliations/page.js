import Link from 'next/link';
import { Empty } from '@/components/Cards';
import { getAffiliations } from '@/lib/data';
export const metadata = { title: 'Affiliations & Networks' };
export default async function Affiliations() {
  const items = await getAffiliations();
  return (
    <div className="container section">
      <p className="eyebrow"><span aria-hidden>✦</span> COMMUNITY &amp; MEMBERSHIP <i /></p>
      <h1 className="h-serif sc big">AFFILIATIONS &amp; NETWORKS</h1>
      <p className="sub">Institutions and communities we are proud to be part of</p>
      {items.length ? (
        <ul className="logos">
          {items.map((a) => (
            <li key={a.id}>
              <Link href={`/affiliations/${a.slug}`} className="logo-card">
                <span className="logo-card__img">{a.logo_url && <img src={a.logo_url} alt={a.name} loading="lazy" />}</span>
                <span className="logo-card__name">{a.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : <Empty>Afiliasi dan jejaring akan tampil di sini.</Empty>}
    </div>
  );
}
