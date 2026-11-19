export default function Marquee({ text }) {
  const group = Array.from({ length: 6 });
  const render = (k) => (
    <div className="marquee__group" aria-hidden={k === 1}>
      {group.map((_, i) => (
        <span className="marquee__item" key={i}>{text}<i>✦</i></span>
      ))}
    </div>
  );
  return (
    <div className="marquee" role="marquee" aria-label={text}>
      <svg className="marquee__icon" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M3 10v4h3l5 4V6L6 10H3zm13.5 2a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z" />
      </svg>
      <div className="marquee__track">{render(0)}{render(1)}</div>
    </div>
  );
}
