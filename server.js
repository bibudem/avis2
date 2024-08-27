const express = require('express');
const session = require('express-session');
const passport = require('./src/config/passport').passport;
const authRoutes = require('./src/config/route');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { HttpsProxyAgent } = require('https-proxy-agent');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

// Importer la variable proxyUrl depuis votre fichier de configuration
const { proxyUrl } = require('./src/config/oauthConfig');

nextApp.prepare().then(() => {
    const server = express();

    // Middleware pour gérer les en-têtes X-Forwarded-* si nécessaire
    server.use((req, res, next) => {
        req.headers['x-forwarded-host'] = req.headers['host'] || '';
        req.headers['x-forwarded-proto'] = req.protocol;
        req.headers['x-forwarded-for'] = req.ip;
        next();
    });

    server.set('trust proxy', true);

    // Middleware de session
    server.use(session({
        secret: process.env.SESSION_SECRET || 'Avis2024!!+*',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: !dev, maxAge: 10 * 60 * 3000 } // Durée d'expiration de 30 minutes
    }));

    // Initialisation de Passport
    server.use(passport.initialize());
    server.use(passport.session());

    // Register routes and middleware in appropriate order
    server.use('/api/auth', authRoutes);

    // Middleware de proxy pour les API externes
    server.use('/api/external', createProxyMiddleware({
        target: 'https://avis-pp.bib.umontreal.ca',
        changeOrigin: true,
        pathRewrite: { '^/api/external': '/' },
        secure: false,
        agent: new HttpsProxyAgent(proxyUrl),
        timeout: 30000
    }));

    // Gestion des requêtes Next.js
    server.all('*', (req, res) => handle(req, res));

    // Démarrage du serveur
    const port = process.env.PORT || 8186;
    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`[${new Date().toISOString()}] > Ready on http://localhost:${port}`);
    });
}).catch(err => {
    console.error(`[${new Date().toISOString()}] Error preparing Next.js app:`, err);
});
