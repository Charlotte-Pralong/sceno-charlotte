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


// Chargement des sprites
loadSprite("maison1", "/MAISON/background.png");
loadSprite("maison2", "/MAISON/top.png");
loadSprite("fleur", "/MAISON/fleur-maison.png");


add([
    sprite("maison1"),
  pos(600,450),

  
]);

add([
    sprite("maison2"),
    pos(600,450),

  
]);

function createAndAnimateFlower(startX, startY) {
    const flower = add([
        sprite("fleur"),
        pos(startX, startY),
        { 
            angle: 0, 
            yPos: startY,
            xOffset: 0
        }
    ]);

    flower.action(() => {
        flower.angle += 3;
        flower.yPos -= 1.5;
        flower.xOffset = Math.sin(flower.angle * Math.PI / 180) * 10;
        
        // Calcul pour ajuster la position x et la rotation sans 'origin'
        flower.pos.x = startX + flower.xOffset - flower.width / 2;
        flower.pos.y = flower.yPos - flower.height / 2;
        
        // Rotation transformée manuellement
        flower.rotate(flower.angle);

        // Suppression du sprite s'il sort de l'écran
        if (flower.pos.y + flower.height < 0) {
            destroy(flower);
        }
    });
}




users.onNew = (user) => {
    const database = getDatabase();  
    const clickRef = ref(database, `users/${user.id}/click`);

    onValue(clickRef, (snapshot) => {
        const position = snapshot.val();
        if (position && position.x !== undefined && position.y !== undefined) {
            createAndAnimateFlower(position.x, position.y);
        }
    });
};

users.onRemove = (user) => {
    if (user.userData.player && user.userData.player.exists()) {
        user.userData.player.destroy();
    }
};