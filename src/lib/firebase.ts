import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey:
    "AIzaSyAjD3ZHR8skZ3evfxD3g6Urf_P5Gx-2v6U",

  authDomain:
    "personal-profile-54f0b.firebaseapp.com",

  projectId:
    "personal-profile-54f0b",

  appId:
    "1:874396631869:web:f4ecbfbe6749aa15a3bb54",
};

const firebaseApp =
  getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig);

export const firebaseAuth =
  getAuth(firebaseApp);

export default firebaseApp;