// pages/not-found.tsx (ou not-found.js)
import React from 'react';

const NotFoundPage = () => {
    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1 style={{ fontSize: '4rem', color: '#cd681d' }}>404 - Page Non Trouvée</h1>
            <p style={{ fontSize: '1.5rem' }}>Désolé, la page que vous recherchez n'existe pas.</p>
        </div>
    );
};

export default NotFoundPage;
