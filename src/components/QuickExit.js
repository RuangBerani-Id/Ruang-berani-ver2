'use client';
export default function QuickExit() {
  return (
    <button className="quick-exit" onClick={() => window.location.replace('https://www.google.com')} aria-label="Keluar cepat dari halaman ini">
      Keluar cepat
    </button>
  );
}
