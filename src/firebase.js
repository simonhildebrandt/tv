import { useEffect, useState } from 'react';

import { initializeApp } from "firebase/app";

import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  connectFirestoreEmulator,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore"

import {
  getAuth,
  sendSignInLinkToEmail,
  connectAuthEmulator,
  onAuthStateChanged,
  signOut,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signInWithCustomToken
} from "firebase/auth";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBDQSNaqtYrUzcDEBrHeKwJaQ5wxwqk6uA",
  authDomain: "screenager.firebaseapp.com",
  projectId: "screenager",
  storageBucket: "screenager.appspot.com",
  messagingSenderId: "715235246232",
  appId: "1:715235246232:web:caa58969f3a4a8cb27d0ed"
};


import { navigate } from './router';


// Initialize Firebase
const app = initializeApp(firebaseConfig);


const auth = getAuth();

const db = getFirestore();


export const host = SITE_URL ? SITE_URL : "http://127.0.0.1:9000" ;

if (!SITE_URL) {
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, 'localhost', 8080);
}


function withUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, userData => {
      if (userData) {
        // const uid = user.uid;
        console.log("We got a user!", userData);
        setUser(userData);
      } else {
        console.log("We're userless")
        setUser(false);
      }
    });

    return unsub;
  }, [])

  return user;
}

function sendSignInLink(email) {
  const actionCodeSettings = {
    url: host + '/login',
    handleCodeInApp: true
  };

  sendSignInLinkToEmail(auth, email, actionCodeSettings)
  .then(() => {
    console.log("sent!")
    window.localStorage.setItem('emailForSignIn', email);
  })
}

function handleSigninLink() {
  if (isSignInWithEmailLink(auth, window.location.href)) {
    console.log("signin link!")

    let email = window.localStorage.getItem('emailForSignIn');
    if (!email) {
      // User opened the link on a different device. To prevent session fixation
      // attacks, ask the user to provide the associated email again. For example:
      email = window.prompt('Please provide your email for confirmation');
    }

    signInWithEmailLink(auth, email, window.location.href)
    .then(async (result) => {
      // Clear email from storage.
      window.localStorage.removeItem('emailForSignIn');
      console.log("logged in!", result)

      await setupUser(result.user.uid)
    })
    .catch((error) => {
      // Some error occurred, you can inspect the code: error.code
      // Common errors could be invalid email and invalid or expired OTPs.
      console.error("failed login", error)
    })
    .finally(() => navigate("/"));
  } else {
    console.log("not signing link")
  }

}


export const objectFromDocs = snapshot => {
  const hash = {};
  snapshot.docs.map(doc => hash[doc.id] = doc.data());
  return hash;
}

function useFirestoreCollection(path, clause = null) {
  const [data, setData] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const col = collection(db, path);

    let q = query(
      col,
      ...(clause ? [where(...clause)] : [])
    );

    const unsub = onSnapshot(q, querySnapshot => {
      setData(objectFromDocs(querySnapshot));
      setLoaded(true);
    });

    return () => { unsub() };
  }, [path]);

  return { data, loaded };
}

function setupUser(uid) {
  setDoc(doc(db, 'users', uid), {})
  .then(res => console.log('created!', res))

}


function addRecord(path, data) {
  console.log({path, data})
  return addDoc(collection(db, path), data)
}

function logout() {
  signOut(auth);
}

function updateRecord(path, data) {
  updateDoc(doc(db, path), data);
}

function deleteRecord(path) {
  deleteDoc(doc(db, path));
}


export {
  logout,
  sendSignInLink,
  handleSigninLink,
  withUser,
  addRecord,
  updateRecord,
  deleteRecord,
  useFirestoreCollection
}
