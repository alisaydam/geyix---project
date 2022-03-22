let process;

const p = process?.env ? process.env : import.meta.env;

export const firebase_config = {
  apiKey: p.VITE_FIREBASE_APIKEY,
  authDomain: p.VITE_AUTH_DOMAIN,
  projectId: p.VITE_PROJECT_ID,
  storageBucket: p.VITE_MESSAGING_SENDER_ID,
  messagingSenderId: p.VITE_MESSAGING_SENDER_ID,
  appId: p.VITE_FIREBASE_APP_ID,
  measurementId: p.VITE_FIREBASE_MEASUREMENT_ID,
};
