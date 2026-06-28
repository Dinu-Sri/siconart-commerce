# Sicon Art Deployment Guide

This mirrors the Sinours deployment pattern with separate ports so both projects can run on the same VPS.

## Ports

| Service | Host Port | Container Port |
| --- | ---: | ---: |
| siconart-app | 3224 | 3225 |
| siconart-postgres | internal | 5432 |
| local dev postgres | 5434 | 5432 |

## Production Stack

Required Portainer environment variables:

- `DB_PASSWORD` - strong Postgres password
- `NEXT_PUBLIC_BASE_URL` - for IP testing, use `http://<VPS-IP>:3224`
- `APP_URL` - same as above for now
- `ADMIN_EMAIL` - admin login email
- `ADMIN_PASSWORD` - admin login password
- `ADMIN_SESSION_SECRET` - long random secret used to sign the admin cookie
- `ADMIN_COOKIE_SECURE=false` - keep this for direct IP/http testing. Change to `true` only after HTTPS is active through Cloudflare.
- `PAYHERE_MERCHANT_ID` - PayHere merchant/store ID
- `PAYHERE_MERCHANT_SECRET` - PayHere merchant secret
- `PAYHERE_CURRENCY=USD`
- `PAYHERE_SANDBOX=false` for live checkout on the approved `https://siconart.com/` domain

Optional later:

- `CF_TUNNEL_TOKEN` - Cloudflare Tunnel token
- `COMPOSE_PROFILES=tunnel` - enables the tunnel service in `docker-compose.yml`

For now, the app can run directly on the VPS IP through host port `3224`.

## GitHub Actions

Pushes to `master` build and publish:

- `ghcr.io/dinu-sri/siconart-app:latest`
- `ghcr.io/dinu-sri/siconart-app:<commit-sha>`

Set GitHub Actions variable:

- `NEXT_PUBLIC_BASE_URL=http://<VPS-IP>:3224` during IP testing
- Later change it to the final tunneled/domain URL

## Local Development

```powershell
docker compose -f docker-compose.dev.yml up -d
Copy-Item .env.example .env
# Ensure DATABASE_URL points to localhost:5434
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

## Cloudflare Tunnel Later

When the tunnel is ready:

1. Create Cloudflare tunnel public hostname.
2. Point it to `http://app:3225`.
3. Add `CF_TUNNEL_TOKEN` in Portainer.
4. Add `COMPOSE_PROFILES=tunnel`.
5. Update `NEXT_PUBLIC_BASE_URL` and `APP_URL` to the tunnel/domain URL.
6. Redeploy the stack.
