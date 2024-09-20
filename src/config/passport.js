const passport = require('passport');
const AzureOAuth2Strategy = require('passport-azure-oauth2');
const jwt = require('jsonwebtoken');
const { HttpsProxyAgent } = require('https-proxy-agent');

const {
    AZURE_AD_CLIENT_ID,
    AZURE_AD_CLIENT_SECRET,
    AZURE_AD_TENANT_ID,
    Azure_callbackURL,
    proxyUrl,
    proxyIp
} = require('./oauthConfig');

passport.use(new AzureOAuth2Strategy({
    clientID: AZURE_AD_CLIENT_ID,
    clientSecret: AZURE_AD_CLIENT_SECRET,
    callbackURL: Azure_callbackURL,
    tenant: AZURE_AD_TENANT_ID,
    resource: '00000002-0000-0000-c000-000000000000',
    prompt: 'select_account',
    state: false
}, async (accessToken, refreshToken, params, profile, done) => {
    try {
        if (!params.id_token) {
            return done(new Error('No ID token received from Azure AD'));
        }
        const user = jwt.decode(params.id_token, { complete: true });
        if (!user || !user.payload) {
            return done(new Error('Invalid ID token received'));
        }
        const userInfo = {
            accessToken,
            refreshToken,
            profile,
            idToken: user.payload,
        };
        return done(null, userInfo);
    }  catch (error) {
        console.error('Error in authentication strategy:', error);
        return done(error);
    }
}));

// Sérialisation utilisateur
passport.serializeUser((user, done) => {
    try {
        done(null, user);
    } catch (err) {
        console.error('Error during user serialization:', err);
        done(err);
    }
});

// Désérialisation utilisateur
passport.deserializeUser((user, done) => {
    try {
        done(null, user);
    } catch (err) {
        console.error('Error during user deserialization:', err);
        done(err);
    }
});


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

module.exports = { passport, validateAuth, handleAuthError, proxyUrl, proxyIp };
