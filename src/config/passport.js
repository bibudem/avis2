const passport = require('passport');
const AzureOAuth2Strategy = require('passport-azure-oauth2');
const jwt = require('jsonwebtoken');
const { HttpsProxyAgent } = require('https-proxy-agent');

const {
    AZURE_AD_CLIENT_ID,
    AZURE_AD_CLIENT_SECRET,
    AZURE_AD_TENANT_ID,
    Azure_callbackURL,
    proxyUrl
} = require('./oauthConfig');

// Créez l'agent proxy une seule fois pour éviter des créations inutiles
const proxyAgent = new HttpsProxyAgent(proxyUrl);

passport.use(new AzureOAuth2Strategy({
    clientID: AZURE_AD_CLIENT_ID,
    clientSecret: AZURE_AD_CLIENT_SECRET,
    callbackURL: Azure_callbackURL,
    tenant: AZURE_AD_TENANT_ID,
    resource: '00000002-0000-0000-c000-000000000000',
    prompt: 'select_account',
    state: false,
    proxy: true,
    agent: proxyAgent
}, async (accessToken, refreshToken, params, profile, done) => {
    try {
        // Optimisation de la gestion du jeton ID
        const user = params.id_token ? jwt.decode(params.id_token, { complete: true }) : {};

        // Informations utilisateur consolidées
        const userInfo = {
            accessToken,
            refreshToken,
            profile,
            idToken: user?.payload || {},
        };

        // Retour réussi
        return done(null, userInfo);
    } catch (error) {
        console.error('Error in authentication strategy:', error);
        return done(error);
    }
}));

// Sérialisation utilisateur
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Middleware de validation d'authentification
const validateAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    // Rediriger après l'authentification réussie
    req.session.returnTo = req.originalUrl;
    res.redirect('/api/auth/login'); // Redirection en cas d'échec
};

// Gestion des erreurs d'authentification
const handleAuthError = (err, req, res, next) => {
    console.error('Authentication error:', err);
    res.redirect('/api/auth/login');
};

module.exports = { passport, validateAuth, handleAuthError, proxyAgent };
