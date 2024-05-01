import "./style.scss";
import UsersSystem from "../libs/NewUserSystem";
import Firebase from "../libs/NewFirebase";

export default class Scene2 {
  constructor(kaboom, frames) {
    console.log("Scene2");
    Firebase.send(`charlotte/activeScene`, 2);
    this.kaboom = kaboom;
    this.kaboomSetup();
    this.setupFirebaseListeners();
    this.loadFrames(frames);
  }

  kaboomSetup() {
    // loadSprite
    this.animation = loadSprite("fleur", "/scene2/fleur.png", {
      sliceX: 15,
      sliceY: 1,
      width: 54,
      height: 50,
      anims: {
        fleurir: {
          from: 0,
          to: 14,
          speed: 8,
          loop: false,
        },
      },
    });
  }

  loadFrames(frames) {
    // const frameCount = 56; // nombre de frames
    const animationName = "animation_scene1_";
    // Charger toutes les frames
    for (let i = 1; i <= frames.length; i++) {
      loadSprite(`${animationName}${i}`, frames[i - 1].src);
    }
    // Créer une animation à partir des frames chargées
    this.frames = Array.from({ length: frames.length }, (_, i) =>
      sprite(`${animationName}${i + 1}`)
    );
    // Ajouter un sprite avec animation manuelle
    this.myAnimatedSprite = add([pos(0, 0), this.frames[0]]);
    this.currentFrame = 0;
    this.frame = 0;
    const fps = 15;
    this.startAnimation(fps);
  }

  animateFrames() {
    this.currentFrame = (this.currentFrame + 1) % this.frames.length;
    this.myAnimatedSprite.use(this.frames[this.currentFrame]);
  }

  startAnimation(fps = 10) {
    onDraw(() => {
      if (this.frame % fps == 0) {
        this.animateFrames();
        this.frame = 0;
      }
      this.frame++;
    });
  }

  setupFirebaseListeners() {
    // Quel chemain de firebase veut-on écouter? Quel événement déclenche-t-on si le chemin est activé?
    Firebase.listenToPath("users/id", "newUser");
    // Que fait-on quand l'événement "newUser" est déclenché ?
    Firebase.addEventListener("newUser", (data) => {
      console.log("new user", data);
      Object.keys(data).forEach((key) => {
        // on vérifie si l'id est nouveau
        const id = UsersSystem.verifyNewId(data);
        // si il n'y a pas de nouvel id, on ne fait rien
        if (!id) return;
        const user = add([]);
        user.id = id;
        // // on ajoute l'utilisateur à la liste des utilisateurs
        UsersSystem.add(user);
        Firebase.listenToPath(`charlotte/clicks/${id}`, "click");
      });
    });
    //
    Firebase.addEventListener("onRemove", (data) => {
      console.log("remove user");
      UsersSystem.removeUser(data);
    });
    //
    Firebase.addEventListener("click", (data) => {
      console.log("click", data);
      const user = UsersSystem.list.find((user) => user.id === data.id);
      if (!user) return;
      const position = data;
      const newSprite = add([
        sprite("fleur"),
        pos(Math.random() * width(), Math.random() * height()),
        area(),
      ]);
      newSprite.play("fleurir");
      newSprite.on("animEnd", (animName) => {
        if (animName === "fleurir") {
          destroy(newSprite);
        }
      });
    });
  }
  destroy() {
    Firebase.removeListeners();
    UsersSystem.clear();
    this.myAnimatedSprite.destroy();
    this.animation = null;
  }
}
