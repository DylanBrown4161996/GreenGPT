# Admin dashboard setup

The admin console at `/admin` uses Supabase Email OTP and a server-side email allowlist.

## One-time Supabase configuration

1. **Authentication → Providers → Email** — enable Email (magic link / OTP).
2. **Authentication → URL Configuration**
   - Site URL: `https://greengptadvisory.com` (or `http://localhost:3000` for local dev)
   - Redirect URLs (add both):
     - `https://greengptadvisory.com/admin/auth/callback`
     - `http://localhost:3000/admin/auth/callback`

## Environment variables

Uses existing `SUPABASE_URL` and `SUPABASE_ANON_KEY` for auth sessions, plus `SUPABASE_SERVICE_ROLE_KEY` for dashboard data reads.

Optional override:

```env
ADMIN_EMAILS=dylanbrown416@gmail.com,dylan.brown@bodiibrand.com,dylan.brown@greengptadvisory.com
INTAKE_NOTIFY_EMAIL=dylan.brown@greengptadvisory.com
```

`INTAKE_NOTIFY_EMAIL` controls who receives email when a facility submits `/intake`. Defaults to `ADMIN_EMAILS` when unset. Requires `RESEND_API_KEY` and `RESEND_FROM`.

## Facility intakes

View submissions at `/admin/intakes` (service role reads `facility_intakes` table).

## Access control

Three layers:

1. `src/middleware.ts` — blocks `/admin/*` except `/admin/login` and `/admin/auth/callback`
2. `src/app/admin/(protected)/layout.tsx` — server `requireAdmin()` redirect
3. Data fetched only server-side with service role after admin check

## Sign-in flow

1. Visit `/admin` → redirected to `/admin/login`
2. Enter an allowlisted email → Supabase sends magic link
3. Click link → `/admin/auth/callback` exchanges code → `/admin` dashboard

Non-allowlisted emails are rejected before OTP is sent.
