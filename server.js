const express = require('express');
const session = require('express-session');
const { passport, proxyUrl, proxyIp } = require('./src/config/passport');
const authRoutes = require('./src/config/route');
const next = require('next');
const MemoryStore = require('memorystore')(session);
const proxy = require('node-global-proxy').default;

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const port = process.env.PORT || 8186;
const { secretSession} = require('./src/config/oauthConfig');

// Configuration globale du proxy
proxy.setConfig(proxyUrl);
proxy.start();

// Préparer l'application Next.js et démarrer le serveur
nextApp.prepare().then(() => {
    const server = express();

    // Définir le proxy de confiance
    server.set('trust proxy', proxyIp);

    // Middleware pour définir les en-têtes "forwarded" (hôte, protocole, IP)
    server.use((req, res, next) => {
        const { host, protocol, ip } = req;
        req.headers['x-forwarded-host'] = host || '';
        req.headers['x-forwarded-proto'] = protocol;
        req.headers['x-forwarded-for'] = ip;
        next();
    });

     // Middleware personnalisé pour gérer manuellement les en-têtes CORS
    server.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        next();
    });

    // Configuration de la session avec MemoryStore pour stocker les sessions en mémoire
    server.use(session({
        store: new MemoryStore({ checkPeriod: 86400000 }), // Nettoie les entrées expirées toutes les 24h
        secret: process.env.SESSION_SECRET || secretSession,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: !dev,
            maxAge: 30 * 60 * 1000 // Durée de vie des cookies : 30 minutes
        }
    }));

    // Initialisation de Passport pour l'authentification
    server.use(passport.initialize());
    server.use(passport.session());

    // Middleware pour définir le cookie 'userData' si présent dans la session
    server.use((req, res, next) => {
        if (req.session?.userData) {
            res.cookie('userData', JSON.stringify(req.session.userData), {
                httpOnly: true,
                secure: !dev, // Utilise des cookies sécurisés uniquement en production
                maxAge: 30 * 60 * 1000 // 30 minutes
            });
        }
        next();
    });

    // Routes d'authentification
    server.use('/api/auth', authRoutes);

    // Gestionnaire de requêtes pour toutes les autres routes avec Next.js
    server.all('*', (req, res) => handle(req, res));

    // Middleware de gestion des erreurs
    server.use((err, req, res, next) => {
        console.error('Erreur :', err);
        res.status(500).json({ error: 'Une erreur inattendue est survenue' });
    });

    // Démarrage du serveur
    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`Serveur en cours d'exécution sur le port ${port}`);
    });
}).catch(err => {
    console.error(`[${new Date().toISOString()}] Erreur lors de la préparation de l'application Next.js : ${err.message}`);
    process.exit(1);
});
