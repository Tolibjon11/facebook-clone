import firebase from 'firebase'
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage'


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCmolfCShJRrgbx4slLjrc9jaugM-Zweoc",
    authDomain: "facebook-clone-1c2e6.firebaseapp.com",
    projectId: "facebook-clone-1c2e6",
    storageBucket: "facebook-clone-1c2e6.appspot.com",
    messagingSenderId: "504933615717",
    appId: "1:504933615717:web:26b2e9e0364af131689e8c",
    measurementId: "G-FH1LH23DRW"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();
  const provider = new firebase.auth.GoogleAuthProvider();

  export { auth, provider, storage }
  export default db;