const express = require('express');
const { passport } = require('./passport');
const { adminEmails } = require('./oauthConfig');

const router = express.Router();

// Fonction utilitaire pour la redirection
const sendRedirect = (res, url, data = null) => {
    res.setHeader('Content-Type', 'text/html');
    let script = `
        <script>
            ${data ? `localStorage.setItem('session', JSON.stringify(${JSON.stringify(data)}));` : ''}
            window.location.replace("${url}");
        </script>
    `;
    res.send(script);
};

// Route pour démarrer l'authentification
router.get('/login', (req, res, next) => {
    // Détruire la session en cours
    req.session.destroy((err) => {
        if (err) {
            console.error('Session destruction error:', err);
            return sendRedirect(res, '/api/auth/login', { message: 'Failed to destroy session' });
        }

        // Initialiser l'authentification après la destruction de la session
        passport.authenticate('azure_oauth2', {
            failureRedirect: '/api/auth/login', // Rediriger vers une page d'erreur en cas d'échec
        })(req, res, next);
    });
});

// Route de callback pour Azure
router.get('/callback/azure-ad',
    passport.authenticate('azure_oauth2', { failureRedirect: '/api/auth/login' }),
    (req, res) => {
        if (req.isAuthenticated()) {
            // Déstructuration des informations utilisateur
            const userInfos = req.user?.idToken || {};
            const { email = 'Email not available', family_name: familyName = 'Family name not available', given_name: givenName = 'Given name not available' } = userInfos;

            // Détermination si l'utilisateur est un administrateur
            const isAdmin = adminEmails.includes(email);

            const sessionData = { email, familyName, givenName, isAdmin };

            // Sauvegarde des informations utilisateur dans la session
            req.session.userData = sessionData;

            req.session.save((err) => {
                if (err) {
                    console.error('Session save error:', err);
                    return sendRedirect(res, '/error', { message: 'Failed to save session data' });
                }
                // Rediriger vers la page d'accueil avec les données de session
                sendRedirect(res, '/', sessionData);
            });
        } else {
            // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
            sendRedirect(res, '/api/auth/login');
        }
    }
);

// Route pour la déconnexion
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Logout error:', err);
            return sendRedirect(res, '/api/auth/login', { message: 'Failed to log out' });
        }

        req.session.destroy((err) => {
            if (err) {
                console.error('Session destruction error:', err);
            }
            res.clearCookie('connect.sid');
            res.clearCookie('userData');
            sendRedirect(res, '/signin', null);
        });
    });
});

module.exports = router;
