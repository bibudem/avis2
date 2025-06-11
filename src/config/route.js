const express = require('express');
const session = require('express-session');
const { passport } = require('./passport');
const { adminEmails } = require('./oauthConfig');

const router = express.Router();

// Fonction utilitaire pour détruire la session et effacer les cookies
const clearSessionAndCookies = (req, res, next) => {
    res.clearCookie('connect.sid');  // Supprimer le cookie de session
    res.clearCookie('userData');     // Supprimer le cookie utilisateur, s'il existe

    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Session destruction error:', err);
                return res.status(500).send('Erreur lors de la destruction de la session');
            }
            next();
        });
    } else {
        next();
    }
};

// Fonction utilitaire pour la redirection
const sendRedirect = (res, url, sessionId = null) => {
    if (sessionId) {
        res.cookie('sessionId', sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 60 * 1000 // 30 minutes
        });
    }
    res.redirect(url);
};

// Route pour démarrer l'authentification et nettoyer les sessions et cookies
router.get('/login', clearSessionAndCookies, async (req, res, next) => {
    try {
        // Vérifiez si req.session existe avant de l'utiliser
        if (req.session) {
            await new Promise((resolve, reject) => {
                req.session.save((err) => err ? reject(err) : resolve());
            });
        } else {
            console.warn('Session not available on login route');
        }

        // Démarrer l'authentification Azure
        passport.authenticate('azure_oauth2', {
            failureRedirect: '/api/auth/auth-error',
            failureFlash: true
        })(req, res, next);
    } catch (error) {
        console.error('Session save error:', error);
        res.status(500).send('Erreur lors de la sauvegarde de la session');
    }
});


// Route de callback pour Azure
router.get('/callback/azure-ad', passport.authenticate('azure_oauth2', { failureRedirect: '/api/auth/login' }), (req, res) => {
    if (!req.user || !req.isAuthenticated()) {
        console.error('Authentication successful but no valid user session');
        return sendRedirect(res, '/api/auth/auth-error');
    }

    const userInfos = req.user?.idToken || {};
    if (!userInfos.email) {
        console.error('Missing email from Azure ID token');
        return sendRedirect(res, '/api/auth/auth-error');
    }
    const sessionData = {
        email: userInfos.email,
        familyName: userInfos.family_name || 'Family name not available',
        givenName: userInfos.given_name || 'Given name not available',
        isAdmin: adminEmails.includes(userInfos.email)
    };

    req.session.userData = sessionData;

    req.session.save((err) => {
        if (err) {
            console.error('Session save error:', err);
            return sendRedirect(res, '/api/auth/auth-error');
        }
        sendRedirect(res, '/', req.sessionID);
    });
});

// Route pour la déconnexion
router.get('/logout', (req, res, next) => {
    if (req.isAuthenticated()) {
        req.logout((err) => {
            if (err) {
                console.error('Logout error:', err);
                return res.status(500).send('Erreur lors de la déconnexion');
            }
            clearSessionAndCookies(req, res, () => {
                sendRedirect(res, '/signin');
            });
        });
    } else {
        clearSessionAndCookies(req, res, () => {
            sendRedirect(res, '/signin');
        });
    }
});


// Route pour gérer les erreurs d'authentification
router.get('/auth-error', (req, res) => {
    console.log('Authentication failed. Please try again.');
    res.redirect('/signin');
});

// Route pour récupérer les informations utilisateur
router.get('/user', (req, res) => {
    if (req.session && req.session.userData) {
        res.json(req.session.userData);
    } else {
        res.status(401).json({ error: 'No session found, please login.' });
    }
});

module.exports = router;
