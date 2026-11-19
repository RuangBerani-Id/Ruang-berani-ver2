-- Starter content from the supplied assets. Run AFTER schema.sql.
-- consent_confirmed = true was assumed for assets you supplied: confirm real permissions, then edit in the CMS.
insert into public.site_settings (key, value) values ('site', '{}'::jsonb) on conflict (key) do nothing;

insert into public.members (name, nta, position, location, photo_url, bio, sort_order, consent_confirmed, published) values
('Muhammad Habib Mirwan', '003', 'Co-Founder', 'Bekasi', '/images/members/habib.jpg',
 'Co-Founder of Ruang Berani Indonesia, dedicated to creating a safer, more empathetic, and more supportive community for everyone, especially the youth.', 1, true, true),
('Co-Founder (HESA): complete name and details in CMS', null, 'Co-Founder', null, '/images/members/hesa.jpg', null, 2, false, false);

insert into public.events (title, caption, date_label, location, description, cover_url, sort_order, consent_confirmed, published) values
('Indonesia Youth Summit 2026: Booth GAK', 'Semangat Terus Pemuda-Pemudi Indonesia', '29-30 Oktober 2026', 'Gedung Teater Jakarta, Taman Ismail Marzuki',
 'Dokumentasi Ruang Berani di booth Generasi Anti Kekerasan Indonesia pada Indonesia Youth Summit 2026.', '/images/events/summit-2.jpg', 1, true, true),
('Indonesia Youth Summit 2026: Tim Ruang Berani', 'Bersama, Kita Berani!', '29-30 Oktober 2026', 'Gedung Teater Jakarta, Taman Ismail Marzuki',
 'Tim di booth Generasi Anti Kekerasan Indonesia pada Indonesia Youth Summit 2026.', '/images/events/summit-3.jpg', 2, true, true),
('Indonesia Youth Summit 2026: Malam hari', 'Ruang Berani Untuk Indonesia', '29-30 Oktober 2026', 'Gedung Teater Jakarta, Taman Ismail Marzuki',
 'Tim di depan booth Generasi Anti Kekerasan Indonesia pada malam hari.', '/images/events/summit-5.jpg', 3, true, true),
('Indonesia Youth Summit 2026: Kebersamaan tim', 'Satu Tim, Satu Semangat', '29-30 Oktober 2026', 'Gedung Teater Jakarta, Taman Ismail Marzuki',
 'Dokumentasi kebersamaan tim di booth Generasi Anti Kekerasan Indonesia.', '/images/events/summit-4.jpg', 4, true, true);

insert into public.affiliations (name, slug, logo_url, description, status, since_label, until_label, sort_order, consent_confirmed, published) values
('GAK', 'gak', '/images/affiliations/gak.png', 'Generasi Anti Kekerasan Indonesia.', 'Network', null, 'Undecided time', 1, true, true),
('FOSI', 'fosi', '/images/affiliations/fosi.png', 'Ruang Berani is directly affiliated with Forum Osis Se-Indonesia.', 'Affiliation', '8 November 2026', 'Undecided time', 2, true, true),
('FUSTAGEN', 'fustagen', '/images/affiliations/fustagen.png', 'FUSTAGEN is the studio partner that builds and supports the Ruang Berani website.', 'Partner', null, 'Undecided time', 3, true, true);
