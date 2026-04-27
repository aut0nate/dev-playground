# Dev Playground

A small service status dashboard for learning Git, GitHub, Docker, GitHub Actions, pull requests, protected branches, container publishing and rollback workflows.

The app includes mock services, incidents, deployment metadata and JSON endpoints so we can evolve it safely through real branches and PRs.

## Local quick start

```bash
npm install
npm run check
npm run dev
```

Open:

```text
http://localhost:3000
http://localhost:3000/api/health
http://localhost:3000/api/status
```

## Docker quick start

```bash
docker compose up --build
```

Test the endpoints:

```bash
curl http://localhost:3000/api/health
curl http://localhost:3000/api/status
```

Stop it:

```bash
docker compose down
```

## Learning path

1. Run locally with Node.js.
2. Run locally with Docker Compose.
3. Create a GitHub repository.
4. Push the app to GitHub.
5. Protect `main`.
6. Open a feature branch.
7. Make a small change.
8. Open a pull request.
9. Watch CI run.
10. Merge safely.
11. Publish a container image to GHCR.
12. Practise rollback using Git and image tags.
