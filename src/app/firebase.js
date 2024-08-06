// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_Firebase_Api_Key,
  authDomain: process.env.NEXT_PUBLIC_AuthDomain,
  projectId: process.env.NEXT_PUBLIC_ProjectID,
  storageBucket: process.env.NEXT_PUBLIC_StoragBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_MessageSenderID,
  appId: process.env.NEXT_PUBLIC_AppID,
  measurementId: process.env.NEXT_PUBLIC_MeasurementID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// const analytics = getAnalytics(app);
export const db = getFirestore(app);

export { auth };
