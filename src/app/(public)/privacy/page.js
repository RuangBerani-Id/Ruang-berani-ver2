import { RETENTION_TEXT } from '@/lib/config';
import { getSettings } from '@/lib/data';
export const metadata = { title: 'Kebijakan Privasi' };

export default async function Privacy() {
  const s = await getSettings();
  return (
    <div className="container section narrow prose">
      <h1 className="h-serif sc big">Kebijakan Privasi</h1>
      <p><em>Versi v1</em></p>

      <h2>1. Apa yang kami kumpulkan</h2>
      <p>Lewat halaman Tell Your Story kami menerima isi ceritamu, jenis kejadian, dan pilihan persetujuanmu. Pada mode tidak anonim kami juga menyimpan nama, kontak, dan (bila kamu isi) sekolahmu. Pada mode anonim, kontak bersifat opsional. Aplikasi kami tidak menyimpan alamat IP atau identitas perangkatmu bersama ceritamu; penyedia hosting dapat mencatat log teknis standar di luar kendali aplikasi.</p>

      <h2>2. Persetujuan terpisah untuk tiap tujuan</h2>
      <p>Setiap tujuan memiliki persetujuan sendiri dan dapat kamu pilih secara terpisah:</p>
      <ul>
        <li><strong>Penyimpanan data</strong> (wajib): ceritamu disimpan dan dibaca staf yang ditugaskan untuk pendampingan.</li>
        <li><strong>Adaptasi cerita</strong>: ceritamu diadaptasi tanpa identitas untuk materi edukasi.</li>
        <li><strong>Publikasi cerita</strong>: ceritamu dipublikasikan.</li>
        <li><strong>Penerusan ke sekolah (BK)</strong>: hanya pada mode tidak anonim dan hanya bila kamu setuju.</li>
      </ul>
      <p>Tanpa persetujuan penyimpanan, ceritamu tidak diterima sama sekali. Kami tidak memakai ceritamu untuk tujuan yang tidak kamu setujui.</p>

      <h2>3. Pengguna di bawah 18 tahun</h2>
      <p>Jika kamu di bawah 18 tahun dan ingin identitasmu disimpan atau ceritamu dipublikasikan, kami memerlukan izin orang tua/wali. Kamu tetap bisa bercerita secara anonim tanpa publikasi.</p>

      <h2>4. Siapa yang dapat mengakses</h2>
      <p>Hanya staf Ruang Berani yang ditugaskan dan diberi izin. Setiap pembukaan cerita oleh staf dicatat. Data disimpan pada layanan basis data dengan kontrol akses berbasis peran.</p>

      <h2>5. Situasi darurat</h2>
      <p>Jika ceritamu menunjukkan bahaya nyata dan kamu menyertakan kontak, kami akan berusaha menghubungimu. Jika kamu menyetujui penerusan ke sekolah, kami akan meneruskannya ke BK atau tim penanganan di sekolahmu. Pada cerita anonim tanpa kontak, kami tidak dapat menghubungimu.</p>

      <h2>6. Lama penyimpanan dan hakmu</h2>
      <p>{RETENTION_TEXT} Kamu dapat meminta akses, perbaikan, penarikan persetujuan, atau penghapusan data pribadimu. Untuk cerita anonim tanpa kontak, kami tidak dapat mengenali ceritamu sehingga permintaan tersebut tidak dapat dipenuhi.</p>

      <h2>7. Foto dan profil anggota</h2>
      <p>Foto dan profil anggota atau peserta kegiatan hanya ditampilkan setelah izin yang bersangkutan (atau orang tua/wali bagi yang di bawah 18 tahun) dikonfirmasi.</p>

      <h2>8. Kontak</h2>
      <p>Pertanyaan tentang privasi: {s.contact_email}.</p>
    </div>
  );
}
