import Firebase from "./libs/NewFirebase.js";
import config from "./config/firebaseconfigTest.js";
import Utils from "./libs/utils.js";
import kaboom from "kaboom";

import Scene1 from "./scene1/index.js";
import Scene2 from "./scene2/index.js";
import Scene3 from "./scene3/index.js";
import InterfaceTest from "./libs/InterfaceTest.js";

export default class App {
  constructor() {
    Firebase.config = config;
    Firebase.clear(["charlotte"]);
    this.preloadImages();
    this.setupFirebaseListeners();
  }

  async preloadImages() {
    this.frames_scene1 = await Utils.preloadImages("./scene1/Œuf-", 56);
    this.frames_scene2 = await Utils.preloadImages("./scene2/Fleur-", 24);
    this.initApp(); // Initialisation de l'app après le chargement des images
  }

  initApp() {
    this.KABOOM = kaboom({
      width: 1920,
      height: 1080,
      scale: 1,
      font: "monospace",
      background: [0, 0, 0, 1],
      stretch: true,
      letterbox: false,
      crisp: true,
      debug: true,
    });
    const SCENE_ID = 1;
    switch (SCENE_ID) {
      case 1:
        this.removeAllScenes();
        this.SCENE = new Scene1(this.KABOOM, this.frames_scene1);
        break;
      case 2:
        this.removeAllScenes();
        this.SCENE = new Scene2(this.KABOOM, this.frames_scene2);
        break;
      case 3:
        this.removeAllScenes();
        this.SCENE = new Scene3(this.KABOOM);
        break;
    }
  }

  removeAllScenes() {
    if (this.SCENE) this.SCENE.destroy();
  }

  setupFirebaseListeners() {
    const interfaceTest = new InterfaceTest();
    interfaceTest.addEventListener("keydown", (e) => {
      const SCENE_ID = parseInt(e.key);
      switch (SCENE_ID) {
        case 1:
          this.removeAllScenes();
          this.SCENE = new Scene1(this.KABOOM, this.frames_scene1);
          break;
        case 2:
          this.removeAllScenes();
          this.SCENE = new Scene2(this.KABOOM, this.frames_scene2);
          break;
        case 3:
          this.removeAllScenes();
          this.SCENE = new Scene3(this.KABOOM);
          break;
      }
    });
  }
}
