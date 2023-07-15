gameState = {};

class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }


    preload() {
        
        WebFont.load({
            custom: { families: ['Rock Kapak'] },
            active: () => { this.fontLoaded = true }
        });
        
        // Create progress bar background
        let progressBox = this.add.graphics();
        let progressBar = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 320, 50);

        // Text for progress percentage
        let width = this.cameras.main.width;
        let height = this.cameras.main.height;
        let loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', { font: '20px monospace', fill: '#ffffff' }).setOrigin(0.5, 0.5);

        // Percentage text
        let percentText = this.add.text(width / 2, height / 2 - 5, '0%', { font: '18px monospace', fill: '#ffffff' }).setOrigin(0.5, 0.5);

        // Update progress bar as files are loaded
        this.load.on('progress', function (value) {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
        });

        // Once all assets are loaded
        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
        });

        this.load.image('bgLoadingScreen', 'assets/images/bgLoadingScreen.png');
        this.load.audio('thundersound', 'assets/sounds/thundersound.ogg');
    }; //end of preload

    create() {
        gameState.bgLoadingScreen = this.add.image(550,480, 'bgLoadingScreen').setScale(1.37).setInteractive();
        gameState.startLevel1Text = this.add.text(550, 170, 'Punk Rock Samurai', { fontSize: '100px', fill: '#000000', fontFamily: 'Rock Kapak' }).setOrigin(0.5);
        gameState.startLevel1Text = this.add.text(550, 500, 'Click to start', { fontSize: '45px', fill: '#ff0000', fontWeight: 'bold' }).setOrigin(0.5);
        gameState.thunder = this.sound.add('thundersound');

        gameState.bgLoadingScreen.on('pointerup', () => {
            gameState.thunder.play( {volume: 0.9, seek: 0.2 } )    
            // Flash the screen; start a fade out; switch to the new scene
            this.cameras.main.shake(1300, .0015, false);
            this.cameras.main.flash(500);

            this.time.delayedCall(500, () => {
                this.cameras.main.fadeOut(800);
            }, [], this);

            this.time.delayedCall(1300, () => {
                this.scene.start('Level1');
            }, [], this);
        })
    } //
}

/* ---------------------- CREDITS -----------------

Music by xDeviruchi
Punch sounds by @danielsoundsgood (https://danielsoundsgood.itch.io/free-deadly-kombat-sound-effects)
Healing sound: "Healing (Ripple)" by Dylan Kelk (https://freesound.org/people/SilverIllusionist/)
Power up sound by MATRIXXX (https://freesound.org/people/MATRIXXX_/)
Button Sprites by Ian Eborn.
*/
