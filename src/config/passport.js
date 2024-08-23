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

const proxyAgent = new HttpsProxyAgent(proxyUrl);

passport.use(new AzureOAuth2Strategy({
    clientID: AZURE_AD_CLIENT_ID,
    clientSecret: AZURE_AD_CLIENT_SECRET,
    callbackURL: Azure_callbackURL,
    tenant: AZURE_AD_TENANT_ID,
    resource: '00000002-0000-0000-c000-000000000000',
    prompt: 'login',
    proxy: true,
    customHeaders: { 'User-Agent': 'avis-pp.bib.umontreal.ca' },
    passReqToCallback: true,
    agent: proxyAgent,
}, (req, accessToken, refreshToken, params, profile, done) => {
    try {
        let user = {};
        if (params.id_token) {
            user = jwt.decode(params.id_token, { complete: true });
        }

        const userInfo = {
            accessToken,
            refreshToken,
            profile: profile._json,
            idToken: user ? user.payload : {},
        };

        return done(null, userInfo);
    } catch (error) {
        return done(error);
    }
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

const validateAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/api/auth/login');
};

const handleAuthError = (err, req, res, next) => {

    // Gérer d'autres erreurs d'authentification
    console.error('Authentication error:', err);
    res.redirect('/api/auth/login');
};

module.exports = { passport, validateAuth, handleAuthError };
