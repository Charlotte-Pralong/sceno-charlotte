import '/css/client.scss'
import useGyro from '/libs/gyro.js'
import useFirebase from '/libs/firebase.js'
import config from '/firebaseconfig.js'
import throttle from 'just-throttle';

const gyro = useGyro();
const firebase = useFirebase(config);

let userPath; // Variable globale pour stocker le chemin de l'utilisateur

// Fonction pour précharger les images
async function preloadImages() {
    const frameCount = 56; // Supposons que vous ayez 56 frames
    const animationName = "animation-oeuf"; // Nom de base des images
    const promises = [];

    for (let i = 1; i <= frameCount; i++) {
        const path = `/+OEUF copie/Œuf-${i}.png`; // Chemin des images
        promises.push(new Promise((resolve) => {
            const img = new Image();
            img.onload = resolve;
            img.src = path;
        }));
    }

    await Promise.all(promises); // Attend que toutes les images soient chargées
    console.log("All frames preloaded successfully!");
    initApp(); // Initialisation de l'app après le chargement des images
}

function initApp() {
    firebase.onLogin = async (id, user) => {
        console.log('logged in', id);
        userPath = `/users/${id}`; // Initialiser userPath ici

        firebase.send(userPath, {
            gyro: { x: 0, y: 0, z: 0 },
        }, true);

        const sendGyro = throttle((event) => {
            firebase.send(userPath + "/gyro", {
                x: event.gamma,
                y: event.beta,
                z: event.alpha,
            });
        }, 500);

        gyro.onValue = (event) => sendGyro(event);
    };

    document.addEventListener('click', (event) => {
        gyro.enable();
        if (userPath) { // Vérifiez si userPath est défini
            firebase.send(userPath + "/click", {
                x: event.clientX,
                y: event.clientY,
            });
        }
    });
}

// Démarrer le préchargement des images
preloadImages();


