# Vinayak Enterprises – Client Tracker (Next.js + Supabase)

1. Supabase: create a project > SQL Editor > paste and run `sql/supabase.sql`.
2. Supabase > Authentication > Users > Add user (email + password, tick "Auto Confirm User").
3. Supabase > Project Settings > API: copy Project URL and anon public key.
4. Copy `.env.example` to `.env.local` and paste the two values.
5. `npm install` then `npm run dev` -> http://localhost:3000

Vercel: push to GitHub, import in Vercel, add the same two Environment Variables, deploy.
