let gameState = {};

class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    preload() {
        
        // Load font "Rock Kapak"
        WebFont.load({
            custom: { families: ['Rock Kapak'] },
            active: () => { this.fontLoaded = true }
        });
        
        // Create progress bar background
        let width = this.cameras.main.width;
        let height = this.cameras.main.height;
        
        let progressBox = this.add.graphics();
        let progressBar = this.add.graphics();     
        progressBox.fillStyle(0x222222, 0.8)
        progressBox.fillRect(width / 2 - 160, 270, 320, 50);
       
        let loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', { font: '20px monospace', fill: '#ffffff' }).setOrigin(0.5, 0.5);
        let percentText = this.add.text(width / 2, height / 2 - 5, '0%', { font: '18px monospace', fill: '#ffffff' }).setOrigin(0.5, 0.5);

        // Update progress bar as files are loaded
        this.load.on('progress', function (value) {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width / 2 - 150, 280, 300 * value, 30);
        });

        // Once all assets are loaded
        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
        });

        this.load.image('bgLoadingScreen', 'assets/images/bgLoadingScreen.png');
        this.load.image('endscene', 'assets/images/endscene.png')
        this.load.image('player', 'assets/images/sprites/punkrock.png')
        this.load.image('manaSymbol', 'assets/images/manasymbol.png')
        this.load.image('deck', 'assets/images/cardback.jpg')
      
        this.load.image('knucklefist', 'assets/images/cards/knucklefist.jpg')
        this.load.image('fireball', 'assets/images/cards/fireball.jpg')
        this.load.image('battleShield', 'assets/images/cards/battleShield.jpg')
        this.load.image('despo', 'assets/images/cards/despo.jpg')
        this.load.image('healingTouch', 'assets/images/cards/healingTouch.jpg')
        this.load.image('treeOfLife', 'assets/images/cards/treeOfLife.jpg')
        this.load.image('energyEncore', 'assets/images/cards/energyEncore.jpg')
        this.load.image('anthrax', 'assets/images/cards/anthrax.jpg')
        this.load.image('axeOfAnarchy', 'assets/images/cards/axeOfAnarchy.jpg')
        this.load.image('virulentVirtue', 'assets/images/cards/virulentVirtue.jpg')
        this.load.image('voltspike', 'assets/images/cards/voltspike.jpg')
    
        this.load.image('bakgrunn1', 'assets/images/bakgrunn1.png')
        this.load.image('bakgrunn2', 'assets/images/bakgrunn2.png')
        this.load.image('bakgrunn3', 'assets/images/bakgrunn3.png')
        this.load.image('bakgrunn4', 'assets/images/bakgrunn4.png')
        this.load.image('bakgrunn5', 'assets/images/bakgrunn5.png')
                
        this.load.image('enemy1', 'assets/images/sprites/monster1.png')
        this.load.image('enemy2', 'assets/images/sprites/monster2.png')
        this.load.image('enemy3', 'assets/images/sprites/monster3.png')
        this.load.image('enemy4', 'assets/images/sprites/monster4.png')
        this.load.image('enemy5', 'assets/images/sprites/monster5.png')

        this.load.image('rectangularButton', 'assets/images/stoneButtonInsetReady.png')
        this.load.image('rectangularButtonHovered', 'assets/images/stoneButtonInsetHovered.png')
        this.load.image('rectangularButtonPressed', 'assets/images/stoneButtonInsetPressed.png')
        this.load.image('radioButtonRoundOn', 'assets/images/radioButtonRoundOn.png')
        this.load.image('radioButtonRoundOff', 'assets/images/radioButtonRoundOff.png')
    
        this.load.audio('cardsDealtSound', 'assets/sounds/cardsdealt.wav')
        this.load.audio('thundersound', 'assets/sounds/thundersound.ogg');
        this.load.audio('buttonPressedSound', 'assets/sounds/buttonpressed.wav')
        this.load.audio('attackSound', 'assets/sounds/attacksound.wav')
        this.load.audio('powerUpSound', 'assets/sounds/powerupsound.wav')
        this.load.audio('healSound', 'assets/sounds/healsound.wav')
        this.load.audio('victorySound', 'assets/sounds/victorysound.mp3')
        this.load.audio('bossTune', 'assets/sounds/music/DecisiveBattle.mp3')
    };

    create() {

        gameState.bgLoadingScreen = this.add.image(550,480, 'bgLoadingScreen').setScale(1.37).setInteractive();
        gameState.startLevel1Text = this.add.text(550, 170, 'Punk Rock Samurai', { fontSize: '100px', fill: '#000000', fontFamily: 'Rock Kapak' }).setOrigin(0.5);
        gameState.startLevel1Text = this.add.text(550, 500, 'Click to start', { fontSize: '45px', fill: '#ff0000', fontWeight: 'bold' }).setOrigin(0.5);
        gameState.thunder = this.sound.add('thundersound');

        gameState.bgLoadingScreen.on('pointerup', () => {
            gameState.thunder.play( {volume: 0.9, seek: 0.2 } )    
            this.cameras.main.shake(1500, .0015, false);
            this.cameras.main.flash(500);

            this.time.delayedCall(500, () => {
                this.cameras.main.fadeOut(1000);
            }, [], this);

            this.time.delayedCall(1500, () => {
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
