class Endscene extends Phaser.Scene {
    constructor() {
        super('Endscene');
    }

    create() {
        this.cameras.main.fadeIn(800, 0, 0, 0);
        gameState.cursors = this.input.keyboard.createCursorKeys();
        gameState.thunder = this.sound.add('thundersound');
    
        this.add.image(550,320, 'endscene').setScale(0.95).setOrigin(0.5,0.5);    
        gameState.endGameText = this.add.text(550, 300, ' Thanks for playing\nPunk Rock Samurai\n   Alpha v1.0', { fontSize: '60px', fill: '#FFFFFF' }).setOrigin(0.5,0.5);
        
    
        this.time.delayedCall(3500, () => {    
                 gameState.thunder.play( {volume: 0.9, seek: 0.2 } )    
                 this.cameras.main.shake(1500, .0015, false);
                 this.cameras.main.flash(500);
    
                 this.time.delayedCall(500, () => {
                    this.cameras.main.fadeOut(1000);
                }, this);
        })
    
    }; //End of create()
    
} //end of scene "level 1"


/* ---------------------- CREDITS -----------------

Music by xDeviruchi
Punch sounds by @danielsoundsgood (https://danielsoundsgood.itch.io/free-deadly-kombat-sound-effects)
Healing sound: "Healing (Ripple)" by Dylan Kelk (https://freesound.org/people/SilverIllusionist/)
Power up sound by MATRIXXX (https://freesound.org/people/MATRIXXX_/)
Button Sprites by Ian Eborn.
*/
