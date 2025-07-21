import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { configureRouter } from './lib/routerConfig';
import './i18n';
import './lib/environmentCheck.ts'; // Auto-run environment check
import './lib/supabaseTest.ts' // Auto-run Supabase connection test
import './lib/quickConnectionTest.ts' // Auto-run quick connection test
import './lib/storageTest.ts' // Auto-run storage configuration test
import './lib/storagePolicyCheck.ts' // Auto-run storage policy check
import './lib/authCheck.ts' // Auto-run authentication check
import './lib/finalStorageTest.ts' // Auto-run final storage test
import './lib/vehicleCatalogueTest.ts' // Auto-run vehicle catalogue data test

// Configure router to handle warnings
configureRouter();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(reg => {
      // Registration successful
    }).catch(err => {
      // Registration failed
      console.error('Service worker registration failed:', err);
    });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
