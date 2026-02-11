import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAZS1y1re2lkoHy7xYiokukutsXvgt-J7I",
    authDomain: "fir-41620.firebaseapp.com",
    projectId: "fir-41620",
    storageBucket: "fir-41620.firebasestorage.app",
    messagingSenderId: "864636922103",
    appId: "1:864636922103:web:6050b88de51a09b20b8bf2",
    measurementId: "G-VE6PC9W762"
};


const app = initializeApp(firebaseConfig);

export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const gitProvider = new GithubAuthProvider();

export default app;
