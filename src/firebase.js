import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCrEl1SCEhfLe0lUtOOkGnu_Bl0rCx6Rew",
  authDomain: "hydra-node-editor.firebaseapp.com",
  projectId: "hydra-node-editor",
  storageBucket: "hydra-node-editor.appspot.com",
  messagingSenderId: "178368560077",
  appId: "1:178368560077:web:7f95bc4d78a97b67e06284",
};

let firebaseApp;

if (!getApps.length) {
  firebaseApp = initializeApp(firebaseConfig);
}

const fireStore = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);

export { fireStore, auth, storage };
