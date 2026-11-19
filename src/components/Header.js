'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Header({ items }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="header">
      <div className="container header__in">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <img src="/images/logo.jpg" alt="Logo Ruang Berani" className="brand__logo" />
          <span className="brand__bar" aria-hidden="true" />
          <span className="brand__name">Ruang Berani</span>
        </Link>
        <button className="burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          <span /><span /><span />
        </button>
        <nav className={`nav ${open ? 'is-open' : ''}`} aria-label="Utama">
          {items.map((i) => (
            <Link key={i.label} href={i.href} onClick={() => setOpen(false)}>{i.label}</Link>
          ))}
          <Link href="/tell-your-story" className="nav__cta" onClick={() => setOpen(false)}>TELL YOUR STORY</Link>
        </nav>
      </div>
    </header>
  );
}
