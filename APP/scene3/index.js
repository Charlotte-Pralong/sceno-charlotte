import "./style.scss";
import UsersSystem from "../libs/NewUserSystem";
import Firebase from "../libs/NewFirebase";

export default class Scene3 {
  constructor(kaboom) {
    console.log("Scene3");
    Firebase.send(`charlotte/activeScene`, 3);
    this.kaboom = kaboom;
    this.kaboomSetup();
    this.setupFirebaseListeners();
    this.loadFrames();
  }

  kaboomSetup() {
    // loadSprite
    // Chargement des sprites
    this.allSprites = [];
    this.allSprites.push(loadSprite("maison1", "/scene3/background.png"));
    this.allSprites.push(loadSprite("maison2", "/scene3/top.png"));
    this.allSprites.push(loadSprite("fleur", "/scene3/fleur-maison.png"));
  }

  loadFrames() {
    this.allElements = [];
    this.allElements.push(add([sprite("maison1"), pos(600, 450)]));
    this.allElements.push(add([sprite("maison2"), pos(600, 450)]));
    // // const frameCount = 56; // nombre de frames
    // const animationName = "animation_scene1_";
    // // Charger toutes les frames
    // for (let i = 1; i <= frames.length; i++) {
    //   loadSprite(`${animationName}${i}`, frames[i - 1].src);
    // }
    // // Créer une animation à partir des frames chargées
    // this.frames = Array.from({ length: frames.length }, (_, i) =>
    //   sprite(`${animationName}${i + 1}`)
    // );
    // Ajouter un sprite avec animation manuelle
    // this.myAnimatedSprite = add([pos(0, 0), this.frames[0]]);
    // this.currentFrame = 0;
    // this.frame = 0;
    const fps = 10;
    this.startAnimation(fps);
  }

  animateFrames() {
    this.currentFrame = (this.currentFrame + 1) % this.frames.length;
    this.myAnimatedSprite.use(this.frames[this.currentFrame]);
  }

  startAnimation(fps = 10) {
    onDraw(() => {
      //   console.log("draw");
      // if (this.frame % fps == 0) {
      //   this.animateFrames();
      //   this.frame = 0;
      // }
      // this.frame++;
    });
  }

  createAndAnimateFlower(startX, startY) {
    this.flower = add([
      sprite("fleur"),
      pos(startX, startY),
      {
        angle: 0,
        yPos: startY,
        xOffset: 0,
      },
    ]);

    // flower.action(() => {
    //   flower.angle += 3;
    //   flower.yPos -= 1.5;
    //   flower.xOffset = Math.sin((flower.angle * Math.PI) / 180) * 10;

    //   // Calcul pour ajuster la position x et la rotation sans 'origin'
    //   flower.pos.x = startX + flower.xOffset - flower.width / 2;
    //   flower.pos.y = flower.yPos - flower.height / 2;

    //   // Rotation transformée manuellement
    //   flower.rotate(flower.angle);

    //   // Suppression du sprite s'il sort de l'écran
    //   if (flower.pos.y + flower.height < 0) {
    //     destroy(flower);
    //   }
    // });
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
        // // Pour un nouvel utilisateur, on ajoute un sprite avec une animation
        // const user = add([
        //   sprite("oiseau"),
        //   pos(rand(0, width() - 63), rand(0, height() - 40)), // Position initiale aléatoire
        //   area(),
        // ]);
        const position = data[id];
        this.createAndAnimateFlower(position.x, position.y);
        // user.play("voler");
        // user.id = id;
        // // on ajoute l'utilisateur à la liste des utilisateurs
        // UsersSystem.add(user);
        // // gestion du gyro pour les utilisateurs
        // const path = `gyro/${id}`;
        // Firebase.listenToPath(path, "gyro");
      });
    });

    //
    Firebase.addEventListener("onRemove", (data) => {
      console.log("remove user");
      UsersSystem.removeUser(data);
    });
    // //
    // Firebase.addEventListener("gyro", (data) => {
    //   console.log("gyro", data);
    //   UsersSystem.followGyro(data);
    // });
  }

  destroy() {
    Firebase.removeListeners();
    this.allElements.forEach((element) => destroy(element));
    this.allSprites.forEach((sprite) => {
      sprite = null;
    });
    if (this.flower) this.flower.destroy();
    UsersSystem.clear();
  }
}
