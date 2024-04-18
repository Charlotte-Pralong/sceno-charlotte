import useFirebase from '/libs/firebase.js'
import config from '/firebaseconfig.js'
import kaboom from "kaboom";
import '/css/scene.scss'

const firebase = useFirebase(config)

firebase.onLogin = async (id, user) => {
    console.log('logged in', id);
};

kaboom()
loadSprite("bean", "/sprites/bean.png")

// Add player game object
const player = add([
    sprite("bean"),
    pos(center()),
    area(),
    // body() component gives the ability to respond to gravity
    body(),
])


onDraw(() => {

    player.moveTo(center())



    // drawSprite({
    //     sprite: "bean",
    //     pos: center(),
    //     angle: 0,
    //     anchor: "center",
    //     scale: 3,
    // })
})

// Accelerate falling when player holding down arrow key
onKeyDown("space", () => {
    player.destroy();
})

// https://kaboomjs.com/play?example=scenes
// avoir une scene par fichier