// Import the functions you need from the SDKs you need
import EventEmitter from "@onemorestudio/eventemitterjs";
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import {
  getDatabase,
  ref,
  set,
  update,
  onValue,
  onDisconnect,
  get,
} from "firebase/database";

class Firebase extends EventEmitter {
  constructor() {
    super();
    this.resumed = true;
    this.allEvents = [];
  }

  set config(val) {
    const app = initializeApp(val);
    this.database = getDatabase();
  }

  clear(paths) {
    paths.forEach((path) => {
      this.send(path, null, true);
    });
  }

  getDirect(path) {
    const pathRef = ref(this.database, path);
    return get(pathRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          return snapshot.val();
        } else {
          return null;
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  listenToPath(path, eventName) {
    const pathRef = ref(this.database, path);
    // console.log(path);
    onValue(pathRef, (snapshot) => {
      if (!this.resumed) {
        this.resumed = true;
        return;
      }
      const val = snapshot.val();
      //   console.log("listenToVal", val);
      if (val) this.emit(eventName, [val]);
    });
    this.allEvents.push(eventName);
  }

  send(_path, _val, remove = false) {
    const path = ref(this.database, _path);
    // set(path, _val);
    if (!remove) {
      set(path, _val);
    } else {
      set(path, null);
      this.emit("onRemove", [_path]);
    }
  }

  removeListeners() {
    this.allEvents.forEach((eventName) => {
      this.removeEventListener(eventName);
    });
  }
}

export default new Firebase();
