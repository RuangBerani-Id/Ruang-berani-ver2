# Ruang Berani Web (Next.js 14 + Supabase)

## Setup
0. Requires Node.js 20.9 or newer (`node -v`).
1. Create a Supabase project. In **SQL Editor** run `supabase/schema.sql`, then `supabase/seed.sql`.
2. Copy `.env.example` to `.env.local` and fill in the project URL and anon key (Settings > API).
3. `npm install` then `npm run dev` (http://localhost:3000).
4. Make the first admin: open `/staff/register`, sign up, confirm the email, then run in SQL Editor:
   `update public.profiles set role='admin', can_read_stories=true where email='YOUR@EMAIL';`
   Next admins/staff are approved from **Dashboard > Users** (new sign-ups are `pending` and see nothing).

## URLs
Public: `/`, `/gallery`, `/gallery/members/[id]`, `/gallery/events/[id]`, `/trusted`, `/testimonials`, `/affiliations`, `/affiliations/[slug]`, `/tell-your-story`, `/privacy`.
Staff (not linked anywhere public): `/staff/login`, `/staff/register`, `/staff/dashboard`. To change the login URL, rename the `src/app/(staff)/staff` folder and update the paths in `src/proxy.js`, `AuthForm.js` and `Dashboard.js`.

## How the safety rules are enforced (in the database, not just the UI)
- Visitors can only INSERT into `stories` (never read), and only when `consent_storage = true`.
- Only admins, or staff with `can_read_stories`, can read stories; every opening is written to `story_access_log` (admins can read the log). After submission only `status` can change.
- Public content (members, events, testimonials, affiliations) shows only when `published` AND `consent_confirmed`.
- The app never stores IP addresses. Your host (e.g. Vercel) may log them, so do not promise "untraceable" anonymity.

## Before launch checklist
- Have a lawyer review `/privacy` and the guardian-consent logic for minors (UU PDP). Adjust `RETENTION_TEXT` in `src/lib/config.js` to the real retention rule.
- Verify the help line in `src/lib/config.js` (`HELP_LINES`).
- Confirm written permission for FOSI/GAK/FUSTAGEN names and logos. The logos in `public/images/affiliations` are the official files you supplied (cropped round); replace them anytime in the CMS.
- Confirm consent for every person shown in the event photos and member cards (especially minors).
- In Supabase Auth: turn on CAPTCHA/rate limits, and disable public sign-ups once the team is registered.
- Upload the founder/members' final photos and fill social links in **Dashboard > Settings**.
- A new Supabase project needs email confirmation set up (Auth > URL configuration: add your site URL).
