import '/css/client.scss'
import useGyro from '/libs/gyro.js'
import useFirebase from '/libs/firebase.js'
import config from '/firebaseconfig.js'
import throttle from 'just-throttle';
import { ref, set } from 'firebase/database';


const gyro = useGyro()
const firebase = useFirebase(config)

firebase.onLogin = async (id, user) => {
    console.log('logged in', id);
    const userPath = `/users/${id}`;

    firebase.send(userPath, {
        // name: "user.displayName2",
        // email: user.email,
    }, true);

    const sendGyro = throttle((event) => {
        firebase.send(userPath + "/gyro", {
            x: event.gamma,
            y: event.beta,
            z: event.alpha,
        });
    }, 500);

    firebase.send(userPath + "/gyro", {
        x: 0,
        y: 0,
        z: 0,
    });

    gyro.onValue = (event) => sendGyro(event);
};

document.addEventListener('click', () => {
    gyro.enable();
    console.log('adksfjh');
})