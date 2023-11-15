import React, { useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import {
  isSignInWithEmailLink,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendSignInLinkToEmail,
  signInWithEmailLink,
} from "firebase/auth";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  function sendEmailLink(email) {
    const actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be in the authorized domains list in the Firebase Console.
      url: "http://192.168.1.1/login",
      // This must be true.
      handleCodeInApp: true,
    };

    return sendSignInLinkToEmail(auth, email, actionCodeSettings);
  }

  function isLoginWithEmailLink(href) {
    return isSignInWithEmailLink(auth, href);
  }

  function loginWithEmailLink(email, href) {
    if (isLoginWithEmailLink(href)) {
      return signInWithEmailLink(auth, email, href);
    }
  }

  function isUserAdmin() {
    if (currentUser) {
      return currentUser.email === "zeus@zeus.com";
    }
    return false;
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    sendEmailLink,
    loginWithEmailLink,
    isLoginWithEmailLink,
    isUserAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
