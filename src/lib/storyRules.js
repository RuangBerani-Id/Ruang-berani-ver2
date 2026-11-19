// Shared by the form (client) and /api/stories (server) so rules cannot drift apart.
export const CATEGORIES = [
  ['bullying', 'Perundungan (bullying)'],
  ['physical', 'Kekerasan fisik'],
  ['sexual', 'Pelecehan / kekerasan seksual'],
  ['psychological', 'Kekerasan psikologis'],
  ['digital', 'Kekerasan digital / cyberbullying'],
  ['discrimination', 'Diskriminasi'],
  ['other', 'Lainnya'],
];

const t = (v) => (typeof v === 'string' ? v.trim() : '');

export function validateStory(f) {
  const e = {};
  if (!['anonymous', 'identified'].includes(f.mode)) e.mode = 'Pilih salah satu mode.';
  if (!CATEGORIES.some(([v]) => v === f.category)) e.category = 'Pilih kategori cerita.';
  const len = t(f.story_body).length;
  if (len < 20) e.story_body = 'Ceritamu terlalu pendek (minimal 20 karakter).';
  if (len > 8000) e.story_body = 'Cerita maksimal 8.000 karakter.';
  if (!f.consent_storage) e.consent_storage = 'Tanpa persetujuan penyimpanan, ceritamu tidak dapat kami terima.';
  if (f.mode === 'identified') {
    if (!t(f.reporter_name)) e.reporter_name = 'Nama wajib diisi pada mode tidak anonim.';
    if (!t(f.reporter_contact)) e.reporter_contact = 'Kontak wajib diisi pada mode tidak anonim.';
  }
  if (f.consent_school_forward) {
    if (f.mode !== 'identified') e.consent_school_forward = 'Penerusan ke sekolah hanya tersedia pada mode tidak anonim.';
    else if (!t(f.school_name)) e.school_name = 'Isi nama sekolah agar bisa diteruskan.';
  }
  if (f.is_minor && !f.guardian_permission && (f.mode === 'identified' || f.consent_publication)) {
    e.guardian_permission =
      'Untuk usia di bawah 18 tahun, izin orang tua/wali diperlukan jika identitasmu disimpan atau ceritamu dipublikasikan. Pilih mode anonim tanpa publikasi bila belum bisa meminta izin.';
  }
  if (t(f.reporter_name).length > 120) e.reporter_name = 'Maksimal 120 karakter.';
  if (t(f.reporter_contact).length > 160) e.reporter_contact = 'Maksimal 160 karakter.';
  if (t(f.school_name).length > 160) e.school_name = 'Maksimal 160 karakter.';
  return { ok: Object.keys(e).length === 0, errors: e };
}

export function cleanStory(f) {
  const anon = f.mode === 'anonymous';
  return {
    mode: f.mode,
    is_minor: !!f.is_minor,
    category: f.category,
    story_body: t(f.story_body),
    reporter_name: anon ? null : t(f.reporter_name) || null,
    reporter_contact: t(f.reporter_contact) || null,
    school_name: anon ? null : t(f.school_name) || null,
    consent_storage: !!f.consent_storage,
    consent_adaptation: !!f.consent_adaptation,
    consent_publication: !!f.consent_publication,
    consent_school_forward: anon ? false : !!f.consent_school_forward,
    guardian_permission: !!f.guardian_permission,
    consent_version: 'v1',
  };
}
