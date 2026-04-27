const express = require('express');
const helmet = require('helmet');

const app = express();
const port = process.env.PORT || 3000;
const appName = process.env.APP_NAME || 'Dev Playground';
const appVersion = process.env.APP_VERSION || '0.2.0';
const environment = process.env.NODE_ENV || 'development';

app.use(helmet());
app.use(express.json());

const services = [
  {
    name: 'Website',
    owner: 'Frontend Platform',
    status: 'operational',
    uptime: '99.99%',
    latency: 42,
    responseTime: '82ms',
    region: 'London',
  },
   {
    name: 'Self Service Portal',
    owner: 'Frontend Platform',
    status: 'operational',
    uptime: '99.98%',
    latency: 42,
    responseTime: '82ms',
    region: 'London',
  },
  {
    name: 'Public API',
    owner: 'Backend Services',
    status: 'operational',
    uptime: '99.95%',
    latency: 88,
    region: 'EU West',
  },
  {
    name: 'Authentication',
    owner: 'Identity Team',
    status: 'degraded',
    uptime: '99.90%',
    latency: 164,
    responseTime: '82ms',
    region: 'Global',
  },
  {
    name: 'Payments',
    owner: 'Commerce',
    status: 'operational',
    uptime: '99.97%',
    latency: 71,
    responseTime: '82ms',
    region: 'EU West',
  },
  {
    name: 'Notifications',
    owner: 'Messaging',
    status: 'maintenance',
    uptime: '99.80%',
    latency: 126,
    responseTime: '82ms',
    region: 'Dublin',
  },
];

const incidents = [
  {
    title: 'Elevated login latency',
    severity: 'minor',
    status: 'monitoring',
    startedAt: '2026-04-27 09:42 UTC',
    service: 'Authentication',
    update: 'Cache pressure reduced after scaling the identity workers.',
  },
  {
    title: 'Scheduled notification maintenance',
    severity: 'maintenance',
    status: 'in progress',
    service: 'Notifications',
    startedAt: '2026-04-27 13:00 UTC',
    update: 'Queue migration is running within the planned maintenance window.',
  },
  {
    title: 'API error spike resolved',
    severity: 'resolved',
    status: 'closed',
    service: 'Public API',
    startedAt: '2026-04-26 18:16 UTC',
    update: 'Rollback completed and error rates returned to baseline.',
  },
];

const deployments = [
  { environment: 'production', version: 'v1.8.4', status: 'healthy', commit: 'a91f3c2' },
  { environment: 'staging', version: 'v1.9.0-rc.2', status: 'testing', commit: 'c44b7de' },
  { environment: 'development', version: appVersion, status: 'active', commit: 'local' },
];

function statusSummary() {
  return services.reduce(
    (summary, service) => {
      summary[service.status] = (summary[service.status] || 0) + 1;
      return summary;
    },
    { operational: 0, degraded: 0, maintenance: 0 }
  );
}

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: appName,
    version: appVersion,
    environment,
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/status', (_req, res) => {
  res.json({
    service: appName,
    environment,
    version: appVersion,
    summary: statusSummary(),
    services,
    incidents,
    deployments,
  });
});

app.get('/', (_req, res) => {
  const summary = statusSummary();
  const overallState = summary.degraded > 0 || summary.maintenance > 0 ? 'Partial service disruption' : 'All systems operational';

  res.type('html').send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${appName}</title>
  <style>
    :root { color-scheme: dark; font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    * { box-sizing: border-box; }
    body { margin: 0; background: radial-gradient(circle at top left, #1e3a8a 0, transparent 32rem), #020617; color: #e5e7eb; }
    main { min-height: 100vh; padding: 2rem; }
    .shell { max-width: 1180px; margin: 0 auto; }
    .hero { background: linear-gradient(145deg, rgba(15,23,42,.96), rgba(30,41,59,.94)); border: 1px solid #334155; border-radius: 28px; padding: 2rem; box-shadow: 0 24px 80px rgba(0,0,0,.35); }
    .topbar { display: flex; justify-content: space-between; gap: 1rem; align-items: center; flex-wrap: wrap; }
    .badge { display: inline-block; border: 1px solid #38bdf8; color: #7dd3fc; border-radius: 999px; padding: .35rem .75rem; font-size: .875rem; }
    .state { background: rgba(22,163,74,.12); color: #bbf7d0; border: 1px solid rgba(34,197,94,.45); border-radius: 999px; padding: .45rem .85rem; }
    h1 { font-size: clamp(2.5rem, 7vw, 5.5rem); line-height: .92; margin: 1rem 0; letter-spacing: -.06em; max-width: 900px; }
    p { color: #cbd5e1; font-size: 1rem; line-height: 1.7; }
    .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 1rem; margin: 1.5rem 0; }
    .metric, .panel, .service { background: rgba(15,23,42,.72); border: 1px solid #334155; border-radius: 20px; padding: 1rem; }
    .metric span { color: #94a3b8; font-size: .85rem; }
    .metric strong { display: block; margin-top: .35rem; font-size: 2rem; }
    .grid { display: grid; grid-template-columns: 1.4fr .9fr; gap: 1rem; margin-top: 1rem; }
    .services { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 1rem; }
    h2, h3 { margin: 0 0 .75rem; }
    .service-header { display: flex; justify-content: space-between; gap: .75rem; align-items: start; }
    .pill { border-radius: 999px; padding: .25rem .55rem; font-size: .75rem; text-transform: uppercase; letter-spacing: .04em; }
    .operational { background: rgba(34,197,94,.12); color: #bbf7d0; border: 1px solid rgba(34,197,94,.35); }
    .degraded { background: rgba(250,204,21,.12); color: #fef08a; border: 1px solid rgba(250,204,21,.35); }
    .maintenance { background: rgba(96,165,250,.12); color: #bfdbfe; border: 1px solid rgba(96,165,250,.35); }
    .incident { border-left: 3px solid #38bdf8; padding-left: .85rem; margin-top: 1rem; }
    .muted { color: #94a3b8; font-size: .9rem; }
    code { background: #020617; border: 1px solid #1e293b; border-radius: 8px; padding: .2rem .4rem; color: #bae6fd; }
    @media (max-width: 820px) { .grid { grid-template-columns: 1fr; } main { padding: 1rem; } }
  </style>
</head>
<body>
  <main>
    <div class="shell">
      <section class="hero">
        <div class="topbar">
          <span class="badge">${environment} · v${appVersion}</span>
          <span class="state">${overallState}</span>
        </div>
        <h1>Service status dashboard.</h1>
        <p>A lightweight DevOps playground for CI/CD practice. You can evolve this through branches and pull requests by adding services, changing mock incidents, improving tests, publishing containers and practising rollbacks.</p>
        <p>Health endpoint: <code>/api/health</code> · Status API: <code>/api/status</code></p>

        <section class="metrics" aria-label="Status summary">
          <article class="metric"><span>Operational</span><strong>${summary.operational}</strong></article>
          <article class="metric"><span>Degraded</span><strong>${summary.degraded}</strong></article>
          <article class="metric"><span>Maintenance</span><strong>${summary.maintenance}</strong></article>
          <article class="metric"><span>Active incidents</span><strong>${incidents.filter((incident) => incident.status !== 'closed').length}</strong></article>
        </section>

        <div class="grid">
          <section class="panel">
            <h2>Services</h2>
            <div class="services">
              ${services.map((service) => `<article class="service"><div class="service-header"><h3>${service.name}</h3><span class="pill ${service.status}">${service.status}</span></div><p class="muted">${service.owner} · ${service.region}</p><p>Uptime: <strong>${service.uptime}</strong><br />Latency: <strong>${service.latency} ms</strong></p></article>`).join('')}
            </div>
          </section>

          <aside class="panel">
            <h2>Incidents</h2>
            ${incidents.map((incident) => `<article class="incident"><h3>${incident.title}</h3><p class="muted">${incident.service} · ${incident.severity} · ${incident.startedAt}</p><p>${incident.update}</p></article>`).join('')}
          </aside>
        </div>
      </section>
    </div>
  </main>
</body>
</html>`);
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`${appName} listening on port ${port}`);
  });
}

module.exports = app;
