// Build-time only config for the frontend.
// API_BASE is taken from Vite's env var VITE_API_BASE at build time.
export const API_BASE: string = import.meta.env.PROD
 ? 'https://backend-924203426672.europe-west1.run.app'
 : 'http://localhost:8000';
