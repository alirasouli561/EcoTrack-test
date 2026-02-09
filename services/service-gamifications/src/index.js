import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import env, { validateEnv } from './config/env.js';
import pool, { ensureGamificationTables } from './config/database.js';
import actionsRoutes from './routes/actions.js';
import badgesRoutes from './routes/badges.js';
import defisRoutes from './routes/defis.js';
import classementRoutes from './routes/classement.js';
import notificationsRoutes from './routes/notifications.js';
import statsRoutes from './routes/stats.js';

const app = express();

app.set('trust proxy', 1);

if (env.nodeEnv !== 'test') {
  validateEnv();
  await ensureGamificationTables();
}

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    hsts: env.nodeEnv === 'production' ? undefined : false
  })
);

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'gamifications' });
});

app.use('/actions', actionsRoutes);
app.use('/badges', badgesRoutes);
app.use('/defis', defisRoutes);
app.use('/classement', classementRoutes);
app.use('/notifications', notificationsRoutes);
app.use('/', statsRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 404 (si aucune route n'a matché)
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Handler d'erreurs (Zod + autres)
// IMPORTANT: ne pas dépendre uniquement de "instanceof" avec Jest/vm-modules
app.use((err, req, res, next) => {
  const isZodError =
    err &&
    (err.name === 'ZodError' ||
      Array.isArray(err.issues) ||
      Array.isArray(err.errors)); // selon versions/contexts

  if (isZodError) {
    const issues = err.issues || err.errors || [];
    return res.status(400).json({
      error: 'Données invalides',
      details: issues.map((issue) => ({
        champ: Array.isArray(issue.path) ? issue.path.join('.') : '',
        message: issue.message
      }))
    });
  }

  const status = err?.status || 400;
  return res.status(status).json({
    error: err?.message || 'Erreur serveur'
  });
});

let server;
if (env.nodeEnv !== 'test') {
  server = app.listen(env.port, () => {
    console.log(`Service gamification démarré sur le port ${env.port}`);
  });

  process.on('SIGINT', async () => {
    console.log('\n⛔ Arrêt du service...');
    await pool.end();
    server.close(() => {
      console.log('✓ Service arrêté');
      process.exit(0);
    });
  });
}

export default app;
