import React from 'react';
import ReactDOM from 'react-dom/client';

// Components
import App from './js/containers/App';

// Services
import { startCareWatcher } from './js/services/notifications';

// Styles
import './js/scss/globals.scss';

ReactDOM.createRoot(document.querySelector('#root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js');
        startCareWatcher();
    });
}
