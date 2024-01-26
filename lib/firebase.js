import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD9YnOZhHH0JdN7vtZ4FKqMxGw0g4-CcI8",
  authDomain: "chat-app-13498.firebaseapp.com",
  projectId: "chat-app-13498",
  storageBucket: "chat-app-13498.appspot.com",
  messagingSenderId: "511758640575",
  appId: "1:511758640575:web:874c1ae145714bc515ed0a",
  measurementId: "G-SLHG77Q2GV"
};

const app = initializeApp(firebaseConfig);
let analyticsInstance = null;

if (typeof window !== 'undefined' && isSupported()) {
  analyticsInstance = getAnalytics(app);
}

const firestore = getFirestore(app);
const auth = getAuth(app);

export { firestore, auth, analyticsInstance, app };
