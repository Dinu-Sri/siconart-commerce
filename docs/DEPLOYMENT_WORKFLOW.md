# Sicon Art — Deployment Workflow

How code goes from this repo to the live store. This matches the BookOne VPS/Portainer pattern: **GitHub compiles Next.js, Portainer only pulls the image.**

## Rule

The VPS does **not** run `npm run build` or `docker build`. Next.js compile happens on GitHub Actions (`ubuntu-latest`). Portainer pulls `ghcr.io/dinu-sri/siconart-app:latest` and restarts the container.

If a Portainer Update takes 10–20 minutes, the stack is still building on the VPS. Remove any `build:` key from the stack compose and use the repo `docker-compose.yml` as-is.

```
Developer pushes to GitHub master
    ↓
GitHub Action "Build Docker image" compiles Next.js and pushes
  ghcr.io/dinu-sri/siconart-app:latest
  ghcr.io/dinu-sri/siconart-app:<commit-sha>
    ↓
Wait until that Action is green
    ↓
Portainer → Stacks → siconart → Update
  with "Re-pull image and redeploy" ON
    ↓
App container starts from the pulled image (entrypoint: prisma migrate + seed, then node)
    ↓
http://<VPS-IP>:3224  or  Cloudflare Tunnel → siconart.com
```

## Images

| Service | Image | Where it is built | Portainer pull |
| --- | --- | --- | --- |
| `app` | `ghcr.io/dinu-sri/siconart-app:latest` | GitHub Actions | `pull_policy: always` |
| `postgres` | `postgres:16-alpine` | Docker Hub | `pull_policy: missing` |
| `tunnel` | `cloudflare/cloudflared:latest` | Docker Hub | `pull_policy: missing` |

Never add `build:` to `app`. That is what makes the VPS compile Next.js and slows deploys.

## Portainer stack

1. Stacks → siconart (or Add stack).
2. Build method: **Repository**.
3. Repository URL: `https://github.com/Dinu-Sri/siconart-commerce.git`
4. Reference: `refs/heads/master`
5. Compose path: `docker-compose.yml`
6. Env vars: see `DEPLOY.md`.
7. After the first GHCR publish, GitHub → Packages → **siconart-app** → Package settings → visibility **Public**, or add a Portainer registry for `ghcr.io` with a `read:packages` PAT.

### Update checklist

1. Push to `master`.
2. Open GitHub → Actions → **Build Docker image**. Wait for green (typically a few minutes).
3. Portainer → the siconart stack → **Update the stack**.
4. Enable **Re-pull image and redeploy**.
5. Do not wait for a VPS compile. The new container should start as soon as the image has been pulled.

If Update fails with `pull access denied` / 401 for `ghcr.io/dinu-sri/siconart-app`, the GHCR package is still private and registry credentials are missing.

## Ports

| Service | Host | Container |
| --- | ---: | ---: |
| siconart-app | 3224 | 3225 |
| siconart-postgres | internal | 5432 |

## Rollback

Point the stack at a previous digest or retag a known-good `<commit-sha>` as `latest`, then Re-pull.

```text
ghcr.io/dinu-sri/siconart-app:<commit-sha>
```

## Related

- Env vars and Cloudflare: `DEPLOY.md`
- Agent rules: `Agents.md`
- Compose: `docker-compose.yml`
- Image recipe: `Dockerfile`
- Publisher: `.github/workflows/docker.yml`
