import Link from 'next/link';
export default function NotFound() {
  return (
    <main className="container section" style={{ textAlign: 'center' }}>
      <h1 className="h-serif">Halaman tidak ditemukan</h1>
      <p><Link className="btn btn--red" href="/">Kembali ke beranda</Link></p>
    </main>
  );
}
