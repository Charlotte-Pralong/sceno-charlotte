import kaboom from "kaboom";
import '/css/scene.scss';
import users from './usersystem';

kaboom({
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

loadSprite("oiseau", "/sprites/oiseau.png", {
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



users.onNew = (user) => {
    user.userData.player = add([
        sprite("oiseau"),
        pos(rand(0, width() - 63), rand(0, height() - 40)), // Position initiale aléatoire
        area(),
    ]);
    user.userData.player.play("voler");
};

// Gestion des mouvements sans physique de collision
onDraw(() => {
    users.list.forEach((user) => {
        const player = user.userData.player;
        if (player && player.exists()) {
            const verticalMove = user.fireData.gyro.x * 0.1; 
            const playerHeight = 150; // la hauteur de mon oiseau
            const newY = Math.max(0, Math.min(height() - playerHeight, player.pos.y + verticalMove));
            player.pos.y = newY;
        }
    });
});

users.onRemove = (user) => {
    if (user.userData.player && user.userData.player.exists()) {
        user.userData.player.destroy();
    }
};

const frameCount = 56; // nombre de frames
const animationName = "animationd";

// Charger toutes les frames
for (let i = 1; i <= frameCount; i++) {
    loadSprite(`${animationName}${i}`, `/+OEUF copie/Œuf-${i}.png`);
}

// Créer une animation à partir des frames chargées
const frames = Array.from({ length: frameCount }, (_, i) => sprite(`${animationName}${i + 1}`));




// Ajouter un sprite avec animation manuelle
const myAnimatedSprite = add([
    pos(0, 0),
    frames[0],
]);

let currentFrame = 0;
let frameRate = 150; // Temps en ms entre les frames

// Fonction pour changer les frames
function animateFrames() {
    currentFrame = (currentFrame + 1) % frames.length;
    myAnimatedSprite.use(frames[currentFrame]);
}

// Mise à jour de l'animation à intervalles réguliers
setInterval(animateFrames, frameRate);


onKeyDown("space", () => {
    // Toggle play/pause de l'animation
    if (isAnimating) {
        clearInterval(animationInterval);
        isAnimating = false;
    } else {
        animationInterval = setInterval(animateFrames, frameRate);
        isAnimating = true;
    }
});
