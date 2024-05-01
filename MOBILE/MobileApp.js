import Firebase from "../APP/libs/NewFirebase.js";
import config from "../APP/config/firebaseconfigTest.js";
import useGyro from "../APP/libs/gyro.js";
import { v4 as uuidv4 } from "uuid";
import throttle from "just-throttle";

export default class MobileApp {
  constructor() {
    this.ID = uuidv4();
    this.gyro = useGyro();
    Firebase.config = config;

    //button
    this.button = document.querySelector("#connect");
    this.button.addEventListener("click", this.connect.bind(this));
    //
    this.flowerButton = document.querySelector("#create_flowers");
    this.flowerButton.addEventListener("click", this.createFlower.bind(this));
  }

  async connect() {
    this.button.classList.add("hidden");
    // get the actual scene
    this.scene = await Firebase.getDirect("charlotte/activeScene");

    // add event listener to change scene
    Firebase.listenToPath("charlotte/activeScene", "newScene");
    Firebase.addEventListener("newScene", (newScene) => {
      console.log("newScene", newScene);
      this.changeScene(newScene);
    });
    this.changeScene(this.scene);
  }

  createFlower() {
    Firebase.send(`charlotte/clicks/${this.ID}`, {
      x: 0,
      y: 0,
      time: Date.now(),
      id: this.ID,
    });
  }

  changeScene(newScene) {
    this.stopGyro();
    this.flowerButton.classList.add("hidden");
    // ...effacer tous les éléments d'interface
    switch (newScene) {
      case 1:
        console.log("CHANGE SCENE 1");
        Firebase.send(`charlotte/users/ids/${this.ID}`, {
          x: 0,
          y: 0,
          time: Date.now(),
          id: this.ID,
        });
        // init gyro
        this.initGyro();
        break;
      case 2:
        console.log("CHANGE SCENE 2");
        Firebase.send(`charlotte/users/ids/${this.ID}`, {
          x: 0,
          y: 0,
          time: Date.now(),
          id: this.ID,
        });
        this.flowerButton.classList.remove("hidden");
        break;
      case 3:
        console.log("CHANGE SCENE 3");
        Firebase.send(`charlotte/users/ids/${this.ID}`, {
          x: 0,
          y: 0,
          time: Date.now(),
          id: this.ID,
        });
        break;
    }
  }

  stopGyro() {
    this.gyro.disable();
  }

  initGyro() {
    this.gyro.enable();
    const sendGyro = throttle((event) => {
      Firebase.send(`charlotte/gyro/${this.ID}`, {
        x: event.rotationRate.beta,
        y: -event.rotationRate.alpha,
        z: event.rotationRate.gamma,
        time: Date.now(),
        id: this.ID,
      });
    }, 30);
    this.gyro.onValue = (event) => sendGyro(event);
  }
}
