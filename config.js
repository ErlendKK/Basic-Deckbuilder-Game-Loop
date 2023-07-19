const config = {
    type: Phaser.AUTO,
    width: 1100,
    height: 680,
    scene: [
        PreloadScene, 
        Level1,
        Level2,  
        Level3, 
        Level4, 
        Level5,
        Endscene
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
};


const game = new Phaser.Game(config);


/* ---------------------- CREDITS -----------------

Music by xDeviruchi
Punch sounds by @danielsoundsgood (https://danielsoundsgood.itch.io/free-deadly-kombat-sound-effects)
Healing sound: "Healing (Ripple)" by Dylan Kelk (https://freesound.org/people/SilverIllusionist/)
Power up sound by MATRIXXX (https://freesound.org/people/MATRIXXX_/)
Button Sprites by Ian Eborn.
Thunder sound by Josh74000MC (https://freesound.org/people/Josh74000MC/)
Victory music by  (https://pixabay.com/users/pixabay-1/)

https://raw.githack.com/ErlendKK/Punk-Rock-Samurai/main/index.html
*/

