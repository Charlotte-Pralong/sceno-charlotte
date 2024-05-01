import "./style.scss";
import UsersSystem from "../libs/NewUserSystem";
import Firebase from "../libs/NewFirebase";

export default class Scene1 {
  constructor(kaboom, frames) {
    Firebase.send(`charlotte/activeScene`, 1);
    this.kaboom = kaboom;
    this.kaboomSetup();
    this.setupFirebaseListeners();
    this.loadFrames(frames);
  }

  kaboomSetup() {
    // loadSprite
    this.animation = loadSprite("oiseau", "/scene1/oiseau.png", {
      sliceX: 7,
      sliceY: 1,
      width: 441,
      height: 40,
      anims: {
        voler: {
          from: 0,
          to: 6,
          speed: 10,
          loop: true,
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
    const fps = 10;
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
    Firebase.listenToPath("charlotte/users/ids", "newUser");
    // Que fait-on quand l'événement "newUser" est déclenché ?
    Firebase.addEventListener("newUser", (data) => {
      Object.keys(data).forEach((key) => {
        // on vérifie si l'id est nouveau
        const id = UsersSystem.verifyNewId(data);
        // si il n'y a pas de nouvel id, on ne fait rien
        if (!id) return;
        // Pour un nouvel utilisateur, on ajoute un sprite avec une animation
        const user = add([
          sprite("oiseau"),
          pos(rand(0, width() - 63), rand(0, height() - 40)), // Position initiale aléatoire
          area(),
        ]);
        user.play("voler");
        user.id = id;
        // on ajoute l'utilisateur à la liste des utilisateurs
        UsersSystem.add(user);
        // gestion du gyro pour les utilisateurs
        Firebase.listenToPath(`charlotte/gyro/${id}`, "gyro");
      });
    });

    //
    Firebase.addEventListener("onRemove", (data) => {
      UsersSystem.removeUser(data);
    });

    // gestion du gyro pour les utilisateurs
    Firebase.addEventListener("gyro", (data) => {
      const bird = UsersSystem.list.find((user) => user.id === data.id);
      if (!bird) return;
      bird.pos.y += data.y;
      if (bird.pos.y < 0) bird.pos.y = 0;
      if (bird.pos.y > height() - 100) bird.pos.y = height() - 100;
    });
  }

  destroy() {
    Firebase.removeListeners();
    UsersSystem.clear();
    this.myAnimatedSprite.destroy();
    this.animation = null;
  }
}
