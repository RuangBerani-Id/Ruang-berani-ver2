'use client';
import { useEffect, useRef, useState } from 'react';

// Horizontal gallery: mouse wheel scrolls sideways while the pointer is over it (page stays put),
// touch swipes natively, arrows + dots as extra controls. At either end the wheel hands control back to the page.
export default function HScroller({ children, label }) {
  const ref = useRef(null);
  const [st, setSt] = useState({ page: 0, pages: 1, start: true, end: true });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      const pages = max <= 2 ? 1 : Math.ceil(el.scrollWidth / el.clientWidth - 0.05);
      const page = max <= 2 ? 0 : Math.min(pages - 1, Math.round((el.scrollLeft / max) * (pages - 1)));
      setSt({ page, pages, start: el.scrollLeft <= 2, end: el.scrollLeft >= max - 2 });
    };
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // native horizontal gesture
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 2) return;
      if ((e.deltaY > 0 && el.scrollLeft >= max - 1) || (e.deltaY < 0 && el.scrollLeft <= 0)) return;
      e.preventDefault();
      el.scrollLeft = Math.max(0, Math.min(max, el.scrollLeft + e.deltaY));
    };
    update();
    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [children]);

  const go = (dir) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.9, behavior: 'smooth' });

  return (
    <div className="hs" role="region" aria-label={label}>
      <div className="hs__track" ref={ref} tabIndex={0}>
        {(Array.isArray(children) ? children : [children]).map((c, i) => (
          <div className="hs__item" key={i}>{c}</div>
        ))}
      </div>
      {!st.start && <button className="hs__arrow hs__arrow--l" onClick={() => go(-1)} aria-label="Sebelumnya">‹</button>}
      {!st.end && <button className="hs__arrow hs__arrow--r" onClick={() => go(1)} aria-label="Berikutnya">›</button>}
      {st.pages > 1 && (
        <div className="hs__dots" aria-hidden="true">
          {Array.from({ length: st.pages }).map((_, i) => <i key={i} className={i === st.page ? 'on' : ''} />)}
        </div>
      )}
    </div>
  );
}
