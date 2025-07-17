/**
 * Firebase와 Messaging 인스턴스를 초기화
 */

import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCUR_f_oRrIQZF36ZRzgIfzqahOUuYWVKU",
  authDomain: "ttttest-a2690.firebaseapp.com",
  projectId: "ttttest-a2690",
  storageBucket: "ttttest-a2690.firebasestorage.app",
  messagingSenderId: "1045101555450",
  appId: "1:1045101555450:web:0426deeb4f6cbdb11d6343",
  measurementId: "G-3XEFFD5VPK",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
