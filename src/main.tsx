import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Components
import App from './js/containers/App';

// Services
import { startCareWatcher } from './js/services/notifications';

// Styles
import './js/scss/globals.scss';

const root = document.querySelector('#root');

if (!root) {
    throw new Error('Root element not found');
}

createRoot(root).render(
    <StrictMode>
        <App />
    </StrictMode>
);

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js');
        startCareWatcher();
    });
}
