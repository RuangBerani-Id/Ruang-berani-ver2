import './globals.css';
import { Playfair_Display, DM_Sans } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', weight: ['600', '700', '800'], style: ['normal', 'italic'] });
const dm = DM_Sans({ subsets: ['latin'], variable: '--font-dm', weight: ['400', '500', '700'] });

export const metadata = {
  title: { default: 'Ruang Berani', template: '%s | Ruang Berani' },
  description: 'Ruang aman untuk semua. Komunitas pelajar untuk edukasi, pencegahan kekerasan, dan ruang bersuara.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" data-scroll-behavior="smooth" className={`${playfair.variable} ${dm.variable}`}>
      <body>{children}</body>
    </html>
  );
}
