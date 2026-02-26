
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyA7H-Pgm61oiE20evIddNuelwvgugSwdoM",
  authDomain: "taskpilot-d1494.firebaseapp.com",
  projectId: "taskpilot-d1494",
  storageBucket: "taskpilot-d1494.firebasestorage.app",
  messagingSenderId: "230230099099",
  appId: "1:230230099099:web:c1ffaa303724e6447e723e",
  measurementId: "G-J7M6VG98SK"
};


const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);