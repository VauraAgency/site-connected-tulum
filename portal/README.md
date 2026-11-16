# Team log (connectedtulum.com/portal)

Hector's private client log: who he talked to, what they need, what he did, and what to follow up.
The pages live in this repo (`src/routes/portal.tsx`, `src/components/portal/`). Saved data and the login live in a free Supabase project.

## One-time setup (about 5 minutes)

1. Create a free project at supabase.com (any name, pick a region near Mexico, save the database password).
2. **SQL Editor > New query**, paste all of `portal/supabase.sql`, click **Run**. Then run one more line with Hector's real email: `insert into public.team_emails (email) values ('hector@his-email.com');`
   Then run `portal/supabase-reservations.sql` the same way (adds Reservations, commissions and the Actions register, behind the same login).
3. **Authentication > Sign In / Providers > Email**: turn **off** "Allow new users to sign up" (so only invited people can ever log in). Leave "Confirm email" on.
4. **Authentication > Users > Add user > Create new user**: Hector's email and a password. Tick "Auto Confirm User".
5. **Project Settings > API Keys**: copy the **Project URL** and the **publishable** key into `src/lib/portal-config.ts`, commit, push. (Both are public by design. The data is protected by the login and the row rules in the SQL.)

Until step 5 is done the portal runs in **preview mode**: it works, but entries only stay in that browser.

## Notes
- `/portal` is marked noindex and disallowed in robots.txt.
- To add a team member later: Authentication > Users > Add user.
- To change a password: Authentication > Users > the user > Send password recovery, or delete and re-add.
- "Export CSV" downloads whichever tab you are on (Actions, Reservations or Clients) as a spreadsheet file (opens in Excel / Google Sheets).
- Reservations: mark one **Completed** after the night and its commission moves to **To collect**. A "Collect commission" task is added to Actions automatically and closes itself when the commission is fully collected.
- Everything in the portal, including reservations and tasks, is locked to the emails in `team_emails` by the database itself.
