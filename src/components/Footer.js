import Link from 'next/link';

const Social = ({ href, label, children }) =>
  href ? (
    <a className="social" href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>{children}</a>
  ) : null;

export default function Footer({ s }) {
  return (
    <footer className="footer" id="contact">
      <div className="container footer__grid">
        <div className="footer__brand">
          <img src="/images/logo.jpg" alt="" className="footer__logo" />
          <div>
            <strong>{s.footer_title}</strong>
            <p>{s.footer_text}</p>
          </div>
        </div>
        <div>
          <h3 className="footer__h">CONTACT</h3>
          <ul className="footer__list">
            {s.contact_email && <li><span aria-hidden>✉</span><a href={`mailto:${s.contact_email}`}>{s.contact_email}</a></li>}
            {s.contact_phone && <li><span aria-hidden>☎</span>{s.contact_phone}</li>}
            {s.contact_address && <li><span aria-hidden>⌖</span>{s.contact_address}</li>}
          </ul>
        </div>
        <div>
          <h3 className="footer__h">FOLLOW</h3>
          <p className="footer__muted">Connect across platforms</p>
          <div className="socials">
            <Social href={s.social_youtube} label="YouTube">
              <svg viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="4" fill="#e31b23" /><path d="M10 9l5 3-5 3z" fill="#fff" /></svg>
            </Social>
            <Social href={s.social_instagram} label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="#c13584" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.3" cy="6.7" r="1" fill="#c13584" /></svg>
            </Social>
            <Social href={s.social_tiktok} label="TikTok"><b>♪</b></Social>
            <Social href={s.social_linkedin} label="LinkedIn"><b style={{ color: '#0a66c2' }}>in</b></Social>
          </div>
          <p className="footer__links">
            <Link href="/trusted">Collaborations</Link> · <Link href="/testimonials">Testimonials</Link> · <Link href="/gallery">Gallery</Link>
          </p>
        </div>
      </div>
      <div className="container footer__bar">
        <span>© {new Date().getFullYear()} Ruang Berani. All rights reserved.</span>
        <span className="footer__rule" aria-hidden><i>✦</i></span>
        <Link href="/privacy" className="btn btn--outline btn--sm">PRIVACY POLICY</Link>
      </div>
    </footer>
  );
}
