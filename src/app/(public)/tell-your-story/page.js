import StoryForm from '@/components/StoryForm';
import QuickExit from '@/components/QuickExit';
import Link from 'next/link';
import { HELP_LINES } from '@/lib/config';
export const metadata = { title: 'Tell Your Story' };

export default function TellYourStory() {
  return (
    <div className="container section narrow">
      <QuickExit />
      <p className="eyebrow"><span aria-hidden>✦</span> RUANG CERITA <i /></p>
      <h1 className="h-serif sc big">Tell Your Story</h1>
      <p className="sub">Ceritamu aman di sini. Kamu yang menentukan apa yang boleh kami lakukan dengannya.</p>
      <div className="card help">
        <strong>Butuh bantuan sekarang?</strong>
        <ul>{HELP_LINES.map((h) => <li key={h.name}>{h.name}: {h.detail}</li>)}</ul>
        <p>Jika kamu atau orang lain dalam bahaya langsung, segera hubungi orang dewasa yang kamu percaya atau layanan darurat setempat.</p>
      </div>
      <StoryForm />
      <p className="note">Dengan mengirim, kamu menyetujui hal-hal yang dicentang di atas. Baca <Link href="/privacy">Kebijakan Privasi</Link>.</p>
    </div>
  );
}
