// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import {
    getDatabase,
    ref,
    set,
    update,
    onValue,
    onDisconnect,
} from "firebase/database";


export default function useFirebase(firebaseConfig) {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth();
    const database = getDatabase();


    const api = {
        onLogin: (id, user) => { },
        onLogout: () => { },
        send: (path, value, remove) => {
            const pathRef = ref(database, path);
            // console.log(path, value);
            const promise = update(pathRef, value);
            if (remove) onDisconnect(pathRef).remove();

            return { promise, ref: pathRef }
        },
    }

    onAuthStateChanged(auth, (user) => {
        if (!user) return;
        const uid = user.uid;
        api.onLogin(uid, user);
    });
    signInAnonymously(auth)
        .then((event) => {
            // console.log(event);
            // console.log("signed in");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        });


    return api;
}


// // Initialize Firebase

// send(_path, _val) {
//   const path = ref(this.DATABASE, _path);
//   set(path, _val);
// }