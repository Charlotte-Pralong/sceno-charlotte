import kaboom from "kaboom";
import { getDatabase, ref, onValue } from 'firebase/database';
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

loadSprite("fleur", "/sprites/fleur.png", {
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

users.onNew = (user) => {
    const database = getDatabase();  
    const clickRef = ref(database, `users/${user.id}/click`);

    onValue(clickRef, (snapshot) => {
        const position = snapshot.val();
        if (position && position.x !== undefined && position.y !== undefined) {
            const newSprite = add([
                sprite("fleur"),
                pos(position.x, position.y),
                area(),
            ]);
            newSprite.play("fleurir");
            newSprite.on("animEnd", (animName) => {
                if (animName === "fleurir") {
                    destroy(newSprite);
                }
            });
        }
    });
};

users.onRemove = (user) => {
    if (user.userData.player && user.userData.player.exists()) {
        user.userData.player.destroy();
    }
};

const frameCount = 24; 
const animationName = "animationd";

// Charger toutes les frames
for (let i = 1; i <= frameCount; i++) {
    loadSprite(`${animationName}${i}`, `/FLEUR/Fleur-${i}.png`);
}

// Créer une animation à partir des frames chargées
const frames = Array.from({ length: frameCount }, (_, i) => sprite(`${animationName}${i + 1}`));

const myAnimatedSprite = add([
    pos(0, 0),
    frames[0],
]);

let currentFrame = 0;
let frameRate = 150; // Temps en ms entre les frames
let isAnimating = true;  // Utilisez cette variable pour contrôler l'animation

// Fonction pour changer les frames
function animateFrames() {
    if (currentFrame < frames.length - 1) {
        currentFrame++;
    } else {
        isAnimating = false;  // Arrêtez l'animation à la dernière frame
    }
    myAnimatedSprite.use(frames[currentFrame]);
}

// Mise à jour de l'animation à intervalles réguliers
const animationInterval = setInterval(() => {
    if (isAnimating) {
        animateFrames();
    }
}, frameRate);
