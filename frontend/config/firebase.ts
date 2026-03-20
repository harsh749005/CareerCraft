import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB3nRQZx6HchLHWBCxg-cg6zGG9pvRQ1DM",
  authDomain: "careercraft-4c3ad.firebaseapp.com",
  projectId: "careercraft-4c3ad",
  storageBucket: "careercraft-4c3ad.firebasestorage.app",
  messagingSenderId: "267881864443",
  appId: "1:267881864443:web:c585bf5bcbbd545416645e"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;