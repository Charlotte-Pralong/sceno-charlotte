// generate a unique id for the user
import { v4 as uuidv4 } from "uuid";
import Firebase from "./NewFirebase.js";
import EventEmitter from "@onemorestudio/eventemitterjs";
export default class InterfaceTest extends EventEmitter {
  constructor() {
    super();
    // exemple ajout d'un utilisateur au clic
    let id;
    document.addEventListener("click", (e) => {
      id = uuidv4();
      Firebase.send(`charlotte/users/ids/${id}`, { x: e.x, y: e.y });
    });
    // exemple suppression du dernier utilisateur avec  backspace
    document.addEventListener("keydown", (e) => {
      // remove user
      if (e.key === "Backspace") {
        Firebase.send(`charlotte/users/ids/${id}`, null, true);
      }
    });
    // exemple de modification de la position de l'utilisateur avec up, down
    document.addEventListener("keydown", (e) => {
      // move user
      if (e.key === "ArrowUp") {
        Firebase.send(`charlotte/gyro/${id}`, {
          x: 0,
          y: -10,
          time: Date.now(),
          id: id,
        });
      }
      if (e.key === "ArrowDown") {
        Firebase.send(`charlotte/gyro/${id}`, {
          x: 0,
          y: 10,
          time: Date.now(),
          id: id,
        });
      }
      this.emit("keydown", [e]);
    });
  }
}
