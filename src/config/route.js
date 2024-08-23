const express = require('express');
const { passport, validateAuth } = require('./passport');
const fs = require('fs');
const path = require('path');

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

router.get('/api/auth/session', (req, res) => {
    const session = req.session;

    if (session && session.user) {
        res.json({
            user: {
                id: session.user.id,
                name: session.user.name,
                email: session.user.email,
                givenName: session.user.givenName,
                familyName: session.user.familyName
            },
            expires: session.expires,
            accessToken: session.accessToken,
            refreshToken: session.refreshToken
        });
    } else {
        res.status(401).json({ error: "Unauthorized" });
    }
});

router.post('/_log ', (req, res) => {
    const logDir = path.join(__dirname, '/logs');
    const date = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
    const logFile = path.join(logDir, `logs_${date}.txt`);

    // Assurez-vous que le répertoire /logs existe
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }

    const errorMessage = req.body.error || 'Erreur inconnue';
    const logMessage = `[${new Date().toISOString()}] ERROR: ${errorMessage}\n`;

    // Écrire l'erreur dans le fichier de logs
    fs.appendFile(logFile, logMessage, (err) => {
        if (err) {
            console.error('Erreur lors de l\'écriture du fichier de logs:', err);
            return res.status(500).send('Impossible de créer le fichier de logs.');
        }

        res.status(200).send('Erreur enregistrée avec succès.');
    });
});

module.exports = router;
