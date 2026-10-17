# HouseEstate — Containerized MERN Real Estate Platform

HouseEstate is a full-stack real estate application built with the MERN stack and extended with a container-based build and deployment workflow. GitHub Actions validates and builds the application, publishes Docker images to GitHub Container Registry (GHCR), and a manually initiated Ansible playbook deploys a selected image to AWS EC2.

## Overview

- **Application:** MongoDB, Express.js, React, Node.js (MERN)
- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Database:** MongoDB Atlas
- **Client integrations:** Firebase and Stripe
- **Containerization:** Docker multi-stage build
- **CI:** GitHub Actions
- **Container registry:** GitHub Container Registry (GHCR)
- **Cloud host:** AWS EC2 running Ubuntu
- **Deployment automation:** Ansible, run inside Docker on Windows
- **Web server:** NGINX reverse proxy

## Architecture

```text
Developer pushes to main
        |
        v
GitHub repository
        |
        v
GitHub Actions CI
  - Install root and frontend dependencies
  - Check API syntax
  - Generate Firebase client configuration
  - Build the Vite frontend
  - Build Docker image
  - Publish image tags to GHCR
        |
        v
ghcr.io/vraj1102/houseestate
  - latest
  - sha-<commit-sha>
        |
        | Deployment is started manually
        v
Ansible inside Docker on Windows
        |
        | SSH
        v
AWS EC2 (Ubuntu)
  NGINX :80
        |
        v
127.0.0.1:3000
  HouseEstate container
        |
        +--> MongoDB Atlas
        +--> Firebase client integration
        +--> Stripe integration
```

**Important:** GitHub Actions automates CI and image publishing. Production deployment is manually initiated by running the Ansible playbook; deployment does not automatically happen on every push.

## Application features

- User authentication and authorization
- Property listing management
- Admin panel for managing users and listings
- Role-based access control
- Payment integration
- Express serves the built frontend in production
- Health endpoint: `GET /health`

## Repository structure

```text
HouseEstate/
├── api/                         # Express backend and API routes
├── client/                      # React/Vite frontend
├── admin/                       # Admin components used by the app
├── scripts/
│   └── generate-firebase.js      # Generates client Firebase configuration
├── ansible/
│   ├── ansible.cfg               # Ansible defaults
│   ├── deploy.yml                # Deployment playbook
│   └── inventory.ini             # Local inventory; ignored by Git
├── .github/
│   └── workflows/
│       └── ci.yml                # CI and GHCR publishing
├── Dockerfile                    # Multi-stage production image
├── .dockerignore
├── .gitignore
└── README.md
```

The Ansible inventory and production environment file are machine-specific and must not be committed. The Ansible Docker build file may exist in the local working copy; verify it is present before following the image-build step.

## Prerequisites

For local development:
- Git
- Node.js and npm (CI uses Node.js 24)
- MongoDB Atlas connection string or another configured MongoDB deployment
- Firebase project configuration
- Stripe keys if using the payment integration

For deployment:
- Docker
- GitHub Actions enabled and access to the repository
- GHCR package permissions
- AWS EC2 Ubuntu instance with Docker and NGINX installed
- SSH access and a protected private key
- GHCR token with `read:packages` permission for deployment
- Ansible running in the configured Docker container

## Local development setup

1. Clone the repository:

   ```bash
   git clone https://github.com/Vraj1102/HouseEstate.git
   cd HouseEstate
   ```

2. Install root and frontend dependencies:

   ```bash
   npm install
   npm install --prefix client
   ```

   For clean installs using lockfiles, use `npm ci` at the root and `npm ci --prefix client`.

3. Create a root `.env` file with the backend values required by your environment. At minimum, the project uses:

   ```dotenv
   MONGO=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>
   ```

   Depending on enabled features, the backend may also require `EMAIL_USER`, `EMAIL_PASS`, `STRIPE_SECRET_KEY`, and `PORT=3000`. Never commit real credentials.

4. Configure the frontend Firebase variables expected by the project. `scripts/generate-firebase.js` generates `client/src/firebase.js`; the generated file is ignored by Git.

5. Start the application:

   **Backend and frontend together**
   ```bash
   npm run dev:all
   ```

   **Backend only**
   ```bash
   npm run dev
   ```

   **Frontend only**
   ```bash
   npm run client
   ```

The Vite development server is normally available at `http://localhost:5173`. Check the local startup output and project configuration for the API URL and port in development mode.

## GitHub Actions CI

The workflow in `.github/workflows/ci.yml` runs for pushes and pull requests targeting `main`. It:

1. Checks out the repository and configures Node.js 24.
2. Installs root and client dependencies using npm lockfiles.
3. Runs `node --check api/index.js`.
4. Generates Firebase client configuration from GitHub Actions secrets.
5. Builds the Vite frontend using the Stripe public-key build setting.
6. Builds the Docker image with Docker Buildx.
7. Authenticates to GHCR and publishes the image.

Published image tags:

```text
ghcr.io/vraj1102/houseestate:latest
ghcr.io/vraj1102/houseestate:sha-<commit-sha>
```

Observed successful GitHub Actions runs typically took **2 minutes 44 seconds to 3 minutes 14 seconds**. Duration can vary with dependency installation, runner load, and build cache.

### GitHub Actions secrets

Configure these repository Actions secrets for the frontend build:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_STRIPE_PUBLIC_KEY`

Frontend `VITE_*` values are bundled into browser assets; do not place private server credentials in them. GHCR publishing uses the workflow's `GITHUB_TOKEN`. Confirm the repository has the required package write access in GHCR settings.

## Docker image

The root `Dockerfile` uses a multi-stage build:

- **Builder stage:** installs root and client dependencies and builds the Vite frontend into `client/dist`.
- **Runtime stage:** installs production root dependencies, copies the API and built frontend, runs as the non-root `node` user, and starts `node api/index.js`.

The container listens on port 3000. Production runtime secrets are supplied on EC2 through an environment file rather than embedded in the image.

## AWS EC2 and NGINX

NGINX listens on HTTP port 80 and reverse-proxies traffic to the container on loopback:

```text
Browser -> EC2 public IP:80 -> NGINX -> 127.0.0.1:3000 -> Docker container
```

The container uses this port binding:

```bash
-p 127.0.0.1:3000:3000
```

Users access the app through NGINX, not directly through public port 3000. The EC2 security group should allow inbound HTTP on port 80 and restrict SSH port 22 to the administrator's IP. Do not expose port 3000 publicly.

The server-side environment file is stored at `/opt/houseestate/.env` on EC2. Restrict its permissions and do not commit it to Git.

## Manual Ansible deployment

The playbook is `ansible/deploy.yml`. It runs inside the configured Ansible Docker container on Windows and connects to EC2 over SSH.

The playbook:
1. Creates `/opt/houseestate`.
2. Ensures Docker and NGINX are running.
3. Logs in to GHCR using environment-provided credentials.
4. Pulls the requested image tag.
5. Replaces the `houseestate` container using `/opt/houseestate/.env`.
6. Checks `http://127.0.0.1:3000/health`, retrying until HTTP 200 is returned or retries are exhausted.

### Run a deployment

Inside the Ansible container, set the username and a dedicated GHCR read-only token:

```bash
export GHCR_USERNAME="<your-github-username>"
export GHCR_READ_TOKEN="<your-read-only-GHCR-token>"

# Optional: select a specific commit image instead of latest
export IMAGE_TAG="sha-<commit-sha>"

ansible-playbook deploy.yml
```

If `IMAGE_TAG` is unset, the playbook uses `latest`. Update the local, Git-ignored `ansible/inventory.ini` with the current EC2 public IP. Test SSH connectivity with:

```bash
ansible web -m ping
```

A successful ping should return `pong`.

**Current limitation:** the playbook removes the old container before validating the replacement. It does not implement automatic rollback or guarantee zero-downtime deployment. Deployment is a manual action separate from GitHub Actions CI.

## Health check and troubleshooting

Run this on EC2:

```bash
curl -i http://127.0.0.1:3000/health
```

Expected response body:

```json
{"status":"ok"}
```

Useful EC2 checks:

```bash
docker ps
docker logs houseestate
sudo systemctl status nginx
sudo nginx -t
```

Common issues:
- **GHCR permission denied:** check package Actions access and grant the repository the required write permission for CI publishing.
- **Ansible SSH failure:** verify the current EC2 public IP, security-group SSH source, Ubuntu username, PEM mount path, and private-key permissions.
- **Container fails to start:** inspect `docker logs houseestate` and verify `/opt/houseestate/.env` contains required server-side variables.
- **NGINX configuration error:** run `sudo nginx -t` and resolve reported errors before reloading.
- **Frontend build fails:** verify Firebase and Stripe public-key build settings and ensure Firebase config generation runs before the Vite build.
- **Site is unreachable:** check inbound port 80, NGINX status, container status, and loopback port binding.

## Security notes

- Never commit `.env` files, PEM keys, GHCR tokens, or generated credentials.
- Use a dedicated GHCR token with only `read:packages` permission for deployment.
- Keep the production environment file on EC2 and restrict its permissions.
- Restrict SSH to trusted IP addresses and keep port 3000 private.
- Frontend `VITE_*` values are public browser configuration, not server-side secrets.
- The current learning configuration disables Ansible host-key checking; verify and pin host keys in a hardened setup.
- Rotate credentials that have been exposed. Removing a secret from the latest commit alone is not sufficient.

## Skills demonstrated

- MERN application deployment
- Docker and multi-stage container builds
- GitHub Actions CI
- GitHub Container Registry (GHCR)
- Ansible playbooks and SSH-based remote automation
- AWS EC2 and Ubuntu administration
- NGINX reverse proxy
- Environment configuration and secrets handling
- Container health checks and deployment troubleshooting

## License

Check the repository's license file before redistributing or reusing this project.
