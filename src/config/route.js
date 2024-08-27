const express = require('express');
const { passport } = require('./passport');

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
router.get('/login', passport.authenticate('azure_oauth2'));

// Route de callback pour Azure
router.get('/callback/azure-ad',
    passport.authenticate('azure_oauth2', { failureRedirect: '/login' }),
    (req, res, next) => {
        if (req.isAuthenticated()) {
            const { email = 'Email not available', family_name: familyName = 'Family name not available', given_name: givenName = 'Given name not available' } = req.user?.idToken || {};
            const sessionData = { email, familyName, givenName };

            req.session.userData = sessionData;
            req.session.save((err) => {
                if (err) {
                    console.error('Session save error:', err);
                    return sendRedirect(res, '/api/auth/login');
                }
                sendRedirect(res, '/', sessionData);
            });
        } else {
            sendRedirect(res, '/api/auth/login');
        }
    }
);

// Route pour la déconnexion
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            console.error('Logout error:', err);
            return sendRedirect(res, '/error');
        }

        req.session.destroy((err) => {
            if (err) {
                console.error('Session destruction error:', err);
            }
            res.clearCookie('connect.sid');
            sendRedirect(res, '/signin', null);
        });
    });
});

module.exports = router;
