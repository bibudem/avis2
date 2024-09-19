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
router.get('/login', clearSessionAndCookies, (req, res, next) => {
    // Assurer que la session est détruite avant de procéder à l'authentification
    if (req.session) {
        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return res.status(500).send('Erreur lors de la sauvegarde de la session');
            }
            passport.authenticate('azure_oauth2', {
                failureRedirect: '/api/auth/auth-error',
                failureFlash: true
            })(req, res, next);
        });
    } else {
        passport.authenticate('azure_oauth2', {
            failureRedirect: '/api/auth/auth-error',
            failureFlash: true
        })(req, res, next);
    }
});

// Route de callback pour Azure
router.get('/callback/azure-ad', passport.authenticate('azure_oauth2', { failureRedirect: '/api/auth/login' }), (req, res) => {
    if (!req.user) {
        console.error('Authentication successful but no user data');
        return sendRedirect(res, '/api/auth/auth-error');
    }

    if (req.isAuthenticated()) {
        const userInfos = req.user?.idToken || {};
        const { email = 'Email not available', family_name: familyName = 'Family name not available', given_name: givenName = 'Given name not available' } = userInfos;
        const isAdmin = adminEmails.includes(email);
        const sessionData = { email, familyName, givenName, isAdmin };

        req.session.userData = sessionData;

        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return sendRedirect(res, '/api/auth/auth-error');
            }
            sendRedirect(res, '/', req.sessionID);
        });
    } else {
        sendRedirect(res, '/signin');
    }
});

// Route pour la déconnexion
router.get('/logout', (req, res, next) => {
    if (req.isAuthenticated()) {  // Vérifier si l'utilisateur est authentifié
        req.logout((err) => {
            if (err) {
                console.error('Logout error:', err);
                return res.redirect('/signin');
            }
            clearSessionAndCookies(req, res, () => {
                sendRedirect(res, '/signin');
            });
        });
    } else {
        // Si l'utilisateur n'est pas authentifié, rediriger directement
        console.log('User not authenticated. Redirecting to sign-in.');
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
