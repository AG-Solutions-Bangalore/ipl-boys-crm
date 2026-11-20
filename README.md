# Fantasy World Admin Web

Standalone React 18 + Vite + TypeScript administrator interface. It sends HTTP requests only to the Laravel API; it has no MySQL connection or database credentials.

## Run locally

```powershell
Copy-Item .env.example .env.local
npm install
npm run dev
```

Open the Vite URL printed in the terminal. Set `VITE_API_BASE_URL` in `.env.local` to the Laravel API URL (for example `http://127.0.0.1:8000/api`). Laravel's `CORS_ALLOWED_ORIGINS` must include the React origin, normally `http://localhost:5173`.

Sign-in requires a stored password hash and the `app_admin` or `profile_admin` role. User signups remain pending until approved. The API validates the bearer token and role on every write; the React role check is only a user-interface guard.

The console covers league profile creation and settings, account approvals, manager-to-team assignments, password resets for imported users, IPL franchise/player/fantasy-team creation, auction sales, gameweek controls, scorecard fact entry, point adjustments, trade acceptance/cancellation, and the activity log. The backend validates writes and transactions so browser code cannot bypass those rules.
