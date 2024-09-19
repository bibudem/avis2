const express = require('express');
const session = require('express-session');
const { passport, proxyAgent } = require('./src/config/passport');
const authRoutes = require('./src/config/route');
const { createProxyMiddleware } = require('http-proxy-middleware');
const next = require('next');
const MemoryStore = require('memorystore')(session);

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
    const server = express();

    server.set('trust proxy', 1);

    server.use((req, res, next) => {
        req.headers['x-forwarded-host'] = req.headers['host'] || '';
        req.headers['x-forwarded-proto'] = req.protocol;
        req.headers['x-forwarded-for'] = req.ip;
        next();
    });

    const memoryStore = new MemoryStore({
        checkPeriod: 3600000 // expired entries every 1 h
    });

    server.use(session({
        store: memoryStore,
        secret: process.env.SESSION_SECRET || 'Avis4@b7!Kp$9mZ2^vLx&1Wq*R',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: !dev,
            maxAge: 30 * 60 * 1000 // 30 minutes
        }
    }));

    server.use(passport.initialize());
    server.use(passport.session());

    server.use((req, res, next) => {
        if (req.session.userData) {
            res.cookie('userData', JSON.stringify(req.session.userData), {
                httpOnly: true,
                secure: !dev,
                maxAge: 30 * 60 * 1000 // 30 minutes
            });
        }
        next();
    });

    server.use('/api/auth', authRoutes);

    // Configuration du proxy pour toutes les requêtes API
    server.use('/api/auth', createProxyMiddleware({
        target: 'https://avis-pp.bib.umontreal.ca',
        changeOrigin: true,
        ws: true,
        pathRewrite: { '^/api/': '/' },
        secure: true,
        agent: proxyAgent,
        timeout: 20000, // 20 secondes
        onError: (err, req, res) => {
            console.error('Proxy error:', err);
            res.status(500).send('Proxy request failed');
        }
    }));

    server.all('*', (req, res) => handle(req, res));

    const port = process.env.PORT || 8186;
    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`Server running on port ${port}`);
    });
}).catch(err => {
    console.error(`[${new Date().toISOString()}] Error preparing Next.js app: ${err.message}`);
    process.exit(1);
});
