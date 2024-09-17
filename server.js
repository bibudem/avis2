const express = require('express');
const session = require('express-session');
const passport = require('./src/config/passport').passport;
const proxyAgent = require('./src/config/passport').proxyAgent;
const authRoutes = require('./src/config/route');
const { createProxyMiddleware } = require('http-proxy-middleware');
const next = require('next');
const MemoryStore = require('memorystore')(session);

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();


nextApp.prepare().then(() => {
    const server = express();

    // Middleware to handle x-forwarded-* headers properly
    server.use((req, res, next) => {
        if (!req.headers['x-forwarded-host']) {
            req.headers['x-forwarded-host'] = req.headers['host'] || '';
        }
        // Fix pour éviter les doublons
        if (req.headers['x-forwarded-host'].includes(',')) {
            req.headers['x-forwarded-host'] = req.headers['x-forwarded-host'].split(',')[0].trim();
        }

        req.headers['x-forwarded-proto'] = req.protocol;
        req.headers['x-forwarded-for'] = req.ip;

        next();
    });


    server.set('trust proxy', true);

    // Configurez le store en mémoire
    const memoryStore = new MemoryStore();

    server.use(session({
        store: memoryStore,
        secret: process.env.SESSION_SECRET || 'Avis4@b7!Kp$9mZ2^vLx&1Wq*R',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true, maxAge: 10 * 60 * 3000 } // Durée d'expiration de 30 minutes
    }));

    // Ajouter les données essentielles dans le cookie
    server.use((req, res, next) => {
        if (req.session.userData) {
            res.cookie('userData', JSON.stringify(req.session.userData), { httpOnly: true, secure: true });
        }
        next();
    });


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
        agent: proxyAgent,
        timeout: 30000,
        onError: (err, req, res) => {
            console.error('Proxy error:', err);
            res.status(500).send('Proxy request failed');
        }
    }));

    // Gestion des requêtes Next.js
    server.all('*', (req, res) => handle(req, res));

    // Démarrage du serveur
    const port = process.env.PORT || 8186;
    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`Server running on port ${port}`);
    });
}).catch(err => {
    console.error(`[${new Date().toISOString()}] Error preparing Next.js app: ${err.message}`);
});
