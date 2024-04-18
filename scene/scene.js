import kaboom from "kaboom";
import '/css/scene.scss'
import users from './usersystem';


kaboom()
loadSprite("bean", "/sprites/bean.png")

// Add player game object
users.onNew = (user) => {
    user.userData.player = add([
        sprite("bean"),
        pos(rand(0, width()), rand(0, height())),
        area(),
        body(),
    ])
};
users.onRemove = (user) => {
    user.userData.player.destroy();
    delete user.userData.player;
};

onDraw(() => {

    users.list.forEach((user) => {
        const player = user.userData.player;
        player.angle = user.fireData.gyro.x;
    });
})

onKeyDown("space", () => {
    player.destroy();
})