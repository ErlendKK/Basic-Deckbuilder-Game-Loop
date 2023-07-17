class Level1 extends Phaser.Scene {
    constructor() {
        super('Level1');
    }

preload() {
    WebFont.load({
        custom: { families: ['Rock Kapak'] },
        active: () => { this.fontLoaded = true }
    });

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
    this.load.image('player', 'assets/images/sprites/punkrock.png')
    this.load.image('enemy1', 'assets/images/sprites/monster1.png')
    this.load.image('manaSymbol', 'assets/images/manasymbol.png')
    this.load.image('deck', 'assets/images/cardback.jpg')
    this.load.image('rectangularButton', 'assets/images/stoneButtonInsetReady.png')
    this.load.image('rectangularButtonHovered', 'assets/images/stoneButtonInsetHovered.png')
    this.load.image('rectangularButtonPressed', 'assets/images/stoneButtonInsetPressed.png')
    this.load.image('radioButtonRoundOn', 'assets/images/radioButtonRoundOn.png')
    this.load.image('radioButtonRoundOff', 'assets/images/radioButtonRoundOff.png')

    this.load.audio('cardsDealtSound', 'assets/sounds/cardsdealt.wav')
    this.load.audio('buttonPressedSound', 'assets/sounds/buttonpressed.wav')
    this.load.audio('attackSound', 'assets/sounds/attacksound.wav')
    this.load.audio('powerUpSound', 'assets/sounds/powerupsound.wav')
    this.load.audio('healSound', 'assets/sounds/healsound.wav')
    this.load.audio('victorySound', 'assets/sounds/victorysound.mp3')
    this.load.audio('bossTune', 'assets/sounds/music/DecisiveBattle.mp3')
};

create() {
    let self = this;
    this.cameras.main.fadeIn(500, 0, 0, 0);

    function resize() {
            var canvas = game.canvas, width = window.innerWidth, height = window.innerHeight;
            var wratio = width / height, ratio = canvas.width / canvas.height;
            if (wratio < ratio) {
                canvas.style.width = width + "px";
                canvas.style.height = (width / ratio) + "px";
            } else {
                canvas.style.width = (height * ratio) + "px";
                canvas.style.height = height + "px";
            }
        }
    
    window.addEventListener('resize', resize);
    resize();

    this.add.image(0,0, 'bakgrunn1').setScale(0.75).setOrigin(0.02,0); 
    gameState.cursors = this.input.keyboard.createCursorKeys();
    gameState.endOfTurnButton = this.add.sprite(980, 610, 'rectangularButton').setScale(0.45).setInteractive().setOrigin(0.5);
    gameState.endOfTurnText = this.add.text(980, 610, 'End Turn', { fontSize: '20px', fill: '#000000' }).setOrigin(0.5);
    let muteButton = this.add.sprite(1050, 60, 'radioButtonRoundOff').setScale(0.5).setInteractive();
    gameState.muteText = this.add.text(875, 50, 'Mute music', { fontSize: '25px', fill: '#000000' });
    gameState.manaSymbol = this.add.image(550,75, 'manaSymbol').setScale(0.7);
    gameState.currentCards = [];
    gameState.cardImages = [];
    gameState.startText = this.add.text(550, 300, 'Level 1!', { fontSize: '60px', fill: '#ff0000', fontFamily: 'Rock Kapak'  }).setOrigin(0.5);

    gameState.cardsDealtSound = this.sound.add('cardsDealtSound');
    gameState.victorySound = this.sound.add('victorySound')
    gameState.buttonPressedSound = this.sound.add('buttonPressedSound');
    gameState.attackSound = this.sound.add('attackSound');
    gameState.powerUpSound = this.sound.add('powerUpSound');
    gameState.healSound = this.sound.add('healSound');
    gameState.music = this.sound.add('bossTune');
    
    this.time.delayedCall(500, () => {    
        gameState.music.play( { loop: true, volume: 0.35 } );
    })

    this.time.delayedCall(1800, () => {
        gameState.startText.destroy();
        this.time.delayedCall(600, startPlayerTurn());
    });

    // Set up characters
    gameState.player = {
        sprite: this.add.sprite(320, 340, 'player').setScale(0.41).setFlipX(true).setInteractive(),
        mana: 4,
        manaMax: 4,
        health: 90,
        healthMax: 90,
        strengthPerma: 0, 
        strength: 0,
        armor: 0,
        poison: 0
    }

    gameState.enemy1 = {
        sprite: this.add.sprite(760, 340, 'enemy1').setScale(0.24).setFlipX(false).setInteractive(),        
        health: 160,
        healthMax: 160,
        strength: 0, 
        armor: 0,
        poison: 0
    }

    gameState.player.statsText = this.add.text(gameState.player.sprite.x, 470, `Strength: ${gameState.player.strength}\nArmor: ${gameState.player.armor}\nPoison: ${gameState.player.poison}`, { fontSize: '11px', fill: '#000000' }).setOrigin(0.5)
    gameState.enemy1.statsText = this.add.text(gameState.enemy1.sprite.x, 470, `Strength: ${gameState.enemy1.strength}\nArmor: ${gameState.enemy1.armor}\nPoison: ${gameState.enemy1.poison}`, { fontSize: '11px', fill: '#000000' }).setOrigin(0.5)
    
    // Add a health bar to the player
    gameState.player.healthBarBackground = this.add.graphics();
    gameState.player.healthBarBackground.lineStyle(3, 0x000000, 1);
    gameState.player.healthBarBackground.strokeRect(gameState.player.sprite.x - 40, gameState.player.sprite.y - 140, 100, 10);

    gameState.player.healthBar = this.add.graphics();
    gameState.player.healthBar.fillStyle(0x00ff00, 1);
    gameState.player.healthBar.fillRect(gameState.player.sprite.x - 40, gameState.player.sprite.y - 140, 100 * (gameState.player.health / gameState.player.healthMax), 10);
    gameState.player.healthBarText = this.add.text(gameState.player.sprite.x - 21, gameState.player.sprite.y - 135, `${gameState.player.health}/${gameState.player.healthMax}`, { fontSize: '11px', fill: '#000000' }).setOrigin(0.5);

    // Add a health bar to the enemy
    gameState.enemy1.healthBarBackground = this.add.graphics();
    gameState.enemy1.healthBarBackground.lineStyle(3, 0x000000, 1);
    gameState.enemy1.healthBarBackground.strokeRect(gameState.enemy1.sprite.x - 40, gameState.enemy1.sprite.y - 140, 100, 10);

    gameState.enemy1.healthBar = this.add.graphics();
    gameState.enemy1.healthBar.fillStyle(0xff0000, 1);
    gameState.enemy1.healthBar.fillRect(gameState.enemy1.sprite.x - 40, gameState.enemy1.sprite.y - 140, 100 * (gameState.enemy1.health / gameState.enemy1.healthMax), 10);
    gameState.enemy1.healthBarText = this.add.text(gameState.enemy1.sprite.x - 13, gameState.enemy1.sprite.y - 135, `${gameState.enemy1.health}/${gameState.enemy1.healthMax}`, { fontSize: '11px', fill: '#000000' }).setOrigin(0.5);

    gameState.deck = [
        {key: 'knucklefist', type: 'attack', cost: 1, damage: 7, magic: 0, poison: 0, heal: 0, poisonRemove: 0, strength: 0, armor: 0, reduceTargetArmor: 0, text: 'Deals 7 damage'},
        {key: 'knucklefist', type: 'attack', cost: 1, damage: 7, magic: 0, poison: 0, heal: 0, poisonRemove: 0, strength: 0, armor: 0, reduceTargetArmor: 0, text: 'Deals 7 damage'},
        {key: 'knucklefist', type: 'attack', cost: 1, damage: 7, magic: 0, poison: 0,heal: 0, poisonRemove: 0, strength: 0, armor: 0, reduceTargetArmor: 0, text: 'Deals 7 damage'},
        {key: 'fireball', type: 'magic', cost: 2, damage: 0, magic: 12, poison: 0, heal: 0, poisonRemove: 0, strength: 0, reduceTargetArmor: 0, armor: 0, text: 'Deals 12 magic damage'},
        {key: 'fireball', type: 'magic', cost: 2, damage: 0, magic: 12, poison: 0, heal: 0, poisonRemove: 0, strength: 0, armor: 0, reduceTargetArmor: 0, text: 'Deals 12 magic damage'},
        {key: 'battleShield', type: 'buff', cost: 1, damage: 0, magic: 0, poison: 0, heal: 0, poisonRemove: 0, strength: 0, armor: 1, reduceTargetArmor: 0, text: 'Gains 1 armor'},
        {key: 'battleShield', type: 'buff', cost: 1, damage: 0, magic: 0, poison: 0, heal: 0, poisonRemove: 0, strength: 0, armor: 1, reduceTargetArmor: 0, text: 'Gains 1 armor'},
        {key: 'despo', type: 'buff', cost: 1, damage: 0, magic: 0, poison: 0, heal: -7, poisonRemove: 0, strength: 2, armor: 0, reduceTargetArmor: 0, text: 'Gains 2 strength'},
        {key: 'healingTouch', type: 'heal', cost: 2, damage: 0, magic: 0, poison: 0, heal: 10, poisonRemove: 0, strength: 0, armor: 0, reduceTargetArmor: 0, text: 'Heals 10 HP'},
        {key: 'treeOfLife', type: 'heal', cost: 3, damage: 0, magic: 0, poison: 0, heal: 10, poisonRemove: 5, strength: 0, armor: 0, reduceTargetArmor: 0, text: 'Heals 10 HP\nLoses 5 poison'},
        {key: 'treeOfLife', type: 'heal', cost: 3, damage: 0, magic: 0, poison: 0, heal: 10, poisonRemove: 5, strength: 0, armor: 0, reduceTargetArmor: 0, text: 'Heals 10 HP\nLoses 5 poison'},
    ]

    gameState.bonusCards = [
        {key: 'energyEncore', type: 'powerup', cost: -1, damage: 0, magic: 0, poison: 0, heal: 0, poisonRemove: 0, strength: 0, armor: 0, reduceTargetArmor: 0, text: 'Gains 1 mana this turn'},
        {key: 'anthrax', type: 'attack', cost: 2, damage: 0, magic: 0, poison: 4, heal: 0, poisonRemove: 0, strength: 0, armor: 0, reduceTargetArmor: 0, text: 'Deals 4 poison'},
        {key: 'axeOfAnarchy', type: 'attack', cost: 2, damage: 12, magic: 0, poison: 0, heal: 0, poisonRemove: 0, strength: 0, armor: 0, reduceTargetArmor: 2, text: 'Deals 12 damage\nDestroys 2 armor'},
        {key: 'despo', type: 'buff', cost: 1, damage: 0, magic: 0, poison: 0, heal: -7, poisonRemove: 0, strength: 2, armor: 0, reduceTargetArmor: 0, text: 'Gains 2 strength'},
        {key: 'virulentVirtue', type: 'heal', cost: 1, damage: 0, magic: 0, poison: 0, heal: 0, dynamicHeal: () => 2 * gameState.enemy1.poison, poisonRemove: 0, strength: 0, armor: 0, reduceTargetArmor: 0, text: `Gains 0 HP`, dynamicText: () => `Gains ${2 * gameState.enemy1.poison} HP`},
        {key: 'voltspike', type: 'magic', cost: 3, damage: 0, magic: 20, poison: 0, heal: 10, poisonRemove: 5, strength: 0, armor: 0, reduceTargetArmor: 0, text: 'Deals 20 magic damage'},
    ]


    // Enemy Actions are set in the function updateEnemyAction()
    let enemyActions = []
    updateEnemyActions()

    gameState.manaText = this.add.text(530, 60, `${gameState.player.mana}/${gameState.player.manaMax}`, { fontSize: '22px', fill: '#000000', fontWeight: 'bold' }).setDepth(100)    
    gameState.player.deckImage = this.add.image(100,600, 'deck').setScale(0.15).setOrigin(.5,.5).setInteractive();
    gameState.player.numOfCardesText = this.add.text(100, 600, gameState.deck.length, { fontSize: '45px', fill: '#000000', fontWeight: 'bold' }).setDepth(100).setOrigin(.5,.5);

    // When you hover over the deck image
    gameState.player.deckImage.on('pointerover', function() {
        // Constants for grid layout
        const cardsPerRow = 4;
        const cardSpacing = 105;
        const startX = 400;
        const startY = 200;
        
        // Create a card sprite for each card in the deck
        gameState.deck.forEach((card, index) => {
            let cardX = startX + (index % cardsPerRow) * cardSpacing;
            let cardY = startY + Math.floor(index / cardsPerRow) * 1.5 * cardSpacing;

            let cardImage = self.add.image(cardX, cardY, card.key).setScale(0.27);
            gameState.cardImages.push(cardImage);
            
        });
    });

    gameState.player.deckImage.on('pointerout', function() {
        gameState.cardImages.forEach(cardImage => {
            cardImage.destroy();
        });
        gameState.cardImages = []; // Reset the array
    });

// ---------------------------------- PLAYERS TURN -------------------------------------    

    function startPlayerTurn() {
        gameState.player.mana = gameState.player.manaMax;
        drawCards(5);
        updateManaText();
    }

    // Draw card Mechanics
    function drawCards(numCards) {
        gameState.yourTurnText = self.add.text(550, 300, 'Your turn!', { fontSize: '60px', fill: '#ff0000' }).setOrigin(0.5);
        gameState.playerPoisonText = self.add.text(570, 350, '', { fontSize: '25px', fill: '#ff0000' }).setOrigin(0.5);
        
        if (gameState.player.poison > 0) {
            gameState.player.health = Math.max(1, gameState.player.health - gameState.player.poison)
            gameState.playerPoisonText.setText(`-${gameState.player.poison} HP`);
            gameState.player.poison -= 1
        }

        self.time.delayedCall(2000, () => {
            gameState.yourTurnText.destroy();
            gameState.playerPoisonText.destroy();
        });

        self.time.delayedCall(600, () => {
            gameState.endOfTurnButtonPressed = false; // Resets the end of turn button
            gameState.endOfTurnButton.setTexture('rectangularButton');
            shuffleDeck(gameState.deck)
             
            let spacing = 100; // horizontal spacing between cards
            let x = 350; // starting x position
            let y = 600; // starting y position

            for (let i = 0; i < numCards; i++) {
                self.time.delayedCall(i * 70, () => {
                    gameState.cardsDealtSound.play({ volume: 2.2 })
                    let card = gameState.deck.pop();
                    card.sprite = self.add.sprite(x + i * spacing, y, card.key).setScale(0.35).setInteractive();
                    gameState.currentCards.push(card); // Add the card sprite to the array
                
                    
                // Apply a hover effect
                card.sprite.on('pointerover', function() {
                    gameState.cardsDealtSound.play({ volume: 0.6 })
                    self.tweens.add({
                        targets: card.sprite,
                        y: 510, // move up
                        scaleX: 0.50, // scale up
                        scaleY: 0.50, // scale up
                        duration: 400,
                        ease: 'Cubic'
                    });
                    card.sprite.setDepth(1000 +i);
                }, this);

                // When the mouse is no longer over the card
                card.sprite.on('pointerout', function() {
                    if (!card.isBeingPlayed) {
                        self.tweens.add({
                            targets: card.sprite,
                            y: 600, // move back down
                            scaleX: 0.35, // scale back down
                            scaleY: 0.35, // scale back down
                            duration: 400,
                            ease: 'Cubic'
                        });
                    }
                    card.sprite.setDepth(i);
                }, this);
            
                card.sprite.on('pointerdown', function () {
                    gameState.currentCards = gameState.currentCards.filter(c => c !== card.sprite); // Remove the card sprite from the array
                    playCard(card, gameState.enemy1);
                })
                });
            }
        })

        updateHealthBar(gameState.player);
        updateStats(gameState.player);

    };        

    // Play card Mechanics
    function playCard(card, target) {
        console.log('playCard started')
        if (gameState.player.mana >= card.cost) {

            gameState.actionText ? gameState.actionText.destroy(): null;
            card.sprite.destroy();
            
            let healingAmount = card.dynamicHeal ? card.dynamicHeal() : card.heal;          
            gameState.player.health = Math.min(gameState.player.health + healingAmount, gameState.player.healthMax);
            gameState.player.armor += card.armor
            gameState.player.strength += card.strength 
            gameState.player.mana -= card.cost;            
            target.poison += card.poison;
            target.armor = Math.max(0, target.armor - card.reduceTargetArmor)

            if (card.damage > 0 || card.magic > 0) {
                self.cameras.main.shake(100, .003, false);
                gameState.attackSound.play({ volume: 0.8 });
                gameState.player.damage = Math.ceil(Math.max(1, card.magic + card.damage * (1 + 0.1 * gameState.player.strength) * (1 - gameState.enemy1.armor / 20)))
                target.health -= gameState.player.damage;
                gameState.actionText = self.add.text(550, 300, `Deals ${gameState.player.damage} damage`, { fontSize: '32px', fill: '#ff0000' }).setOrigin(0.5);
                
                self.tweens.add({
                    targets: gameState.player.sprite,
                    x: 380,
                    duration: 120,
                    ease: 'Cubic',
                    yoyo: true
                });
            
            } else if (card.poison > 0) {
                self.cameras.main.shake(100, .003, false)
                gameState.powerUpSound.play({ volume: 0.15 })
                gameState.actionText = self.add.text(550, 300, card.text, { fontSize: '32px', fill: '#ff0000' }).setOrigin(0.5);
            
            } else if (healingAmount > 0) {
                gameState.healSound.play({ volume: 0.5 })
                let healingtext = card.dynamicText ? card.dynamicText() : card.text
                gameState.actionText = self.add.text(550, 300, healingtext, { fontSize: '32px', fill: '#ff0000' }).setOrigin(0.5);

            } else if (card.strength > 0 || card.armor > 0) {
                gameState.powerUpSound.play({ volume: 0.15 })
                gameState.actionText = self.add.text(550, 300, card.text, { fontSize: '32px', fill: '#ff0000' }).setOrigin(0.5);
            }

            if (gameState.player.poison > 0) {
                gameState.player.poison = Math.max(0, gameState.player.poison - card.poisonRemove) 
            }    

            updateManaText(); 
            updateHealthBar(gameState.enemy1);
            updateHealthBar(gameState.player);
            updateStats(gameState.player);
            updateStats(gameState.enemy1);

            self.time.delayedCall(1500, () => {   
                gameState.actionText.destroy();
                console.log(`Mana: ${gameState.player.mana}\nEnemy health: ${target.health}`);
            })
            
            if(checkGameOver()) {
                gameState.endOfTurnButton.destroy();
                gameState.currentCards.forEach(cardSprite => {
                cardSprite.sprite.destroy();
                });

                while(gameState.currentCards.length > 0) {
                    let card = gameState.currentCards.pop();
                    card.sprite.destroy(); // remove the card sprite from the screen
                    gameState.deck.unshift(card); // add the card back to the bottom of the deck
                }
            } 
        } else {
            self.cameras.main.shake(70, .002, false)
        } 
    }


// ---------------------------------- ENEMY'S TURN -------------------------------------      
 
    function startEnemyTurn() {
        addHandtoDeck()
        if (gameState.actionText) {gameState.actionText.destroy()};
        if (gameState.player.mana != 0) {
            gameState.player.mana = 0
            updateManaText();
            updateEnemyActions();
        }

        // Enemy actions
        // Calculate the cumulative probabilities
        let cumProb = 0;
        for(let i = 0; i < enemyActions.length; i++) {
            cumProb += enemyActions[i].probability;
            enemyActions[i].cumulativeProbability = cumProb;
        }

        // Generate a random number between 0 and 1 and choose an action based on the random number
        let rand = Math.random();
        let chosenAction = enemyActions.find(action => rand < action.cumulativeProbability);
    
        // Display 'enemy's turn' followed by the action text followed by the enemy's action
        gameState.enemyTurnText = self.add.text(550, 300, 'Enemy turn!', { fontSize: '60px', fill: '#ff0000' }).setOrigin(0.5);
        gameState.enemyPoisonText = self.add.text(570, 350, '', { fontSize: '30px', fill: '#ff0000' }).setOrigin(0.5);

        if (gameState.enemy1.poison > 0) {
            gameState.enemy1.health = Math.max(1, gameState.enemy1.health - gameState.enemy1.poison)
            gameState.enemyPoisonText.setText(`-${gameState.enemy1.poison} HP`);
            gameState.enemy1.poison -= 1
        }

        self.time.delayedCall(2000, () => {
            gameState.enemyTurnText.destroy();
            gameState.enemyPoisonText.destroy();
        
            // Perform the chosen action
            gameState.player.poison += chosenAction.poison
            gameState.enemy1.health = Math.min(gameState.enemy1.health + chosenAction.heal, gameState.enemy1.healthMax);
            gameState.enemy1.strength += chosenAction.strength;
            gameState.enemy1.armor += chosenAction.armor;     

            if (chosenAction.damage > 0 || chosenAction.magic > 0) {
                self.cameras.main.shake(120, .005, false)
                gameState.attackSound.play({ volume: 0.8 })                
                gameState.enemy1.damage = Math.floor( Math.max(1, chosenAction.magic + chosenAction.damage * (1 + 0.1 * gameState.enemy1.strength) * (1 - gameState.player.armor / 20)) )
                gameState.player.health -= gameState.enemy1.damage;
                gameState.actionText = self.add.text(550, 300, `Deals ${gameState.enemy1.damage} damage`, { fontSize: '32px', fill: '#ff0000' }).setOrigin(0.5);
                
                self.tweens.add({
                    targets: gameState.enemy1.sprite,
                    x: 700,
                    duration: 120,
                    ease: 'Cubic',
                    yoyo: true
                });
    
            } else if (chosenAction.heal > 0) {
                gameState.healSound.play({ volume: 0.5 })
                gameState.actionText = self.add.text(550, 300, chosenAction.text, { fontSize: '32px', fill: '#ff0000' }).setOrigin(0.5)

            } else if (chosenAction.strength > 0 || chosenAction.armor > 0 || chosenAction.poison > 0)  {
                gameState.powerUpSound.play({ volume: 0.2 })
                gameState.actionText = self.add.text(550, 300, chosenAction.text, { fontSize: '32px', fill: '#ff0000' }).setOrigin(0.5)
            }

            updateHealthBar(gameState.player);
            updateHealthBar(gameState.enemy1);
            updateStats(gameState.enemy1);  
            
            self.time.delayedCall(1500, () => {
                gameState.actionText.destroy()
                if (!checkGameOver()) {
                startPlayerTurn();
                }
            })
        });
    }


// ---------------------------------- HELPING FUNCTIONS-------------------------------------      

    function updateHealthBar(character) {
        character.health = Phaser.Math.Clamp(character.health, 0, character.healthMax);
        character.healthBar.clear();
        character.healthBar.fillStyle(character === gameState.player ? 0x00ff00 : 0xff0000, 1);
        character.healthBar.fillRect(character.sprite.x - 40, character.sprite.y - 140, 100 * (character.health / character.healthMax), 10);
        character.healthBarText.setText(`${character.health}/${character.healthMax}`)
    }    
    
    function updateStats(character) {    
        character.statsText.setText(`Strength: ${character.strength}\nArmor: ${character.armor}\nPoison: ${character.poison}`)
    }

    function updateManaText() {
        gameState.manaText.setText(`${gameState.player.mana}/${gameState.player.manaMax}`)
    }

    function updateEnemyActions() {
        enemyActions = [ 
            {key: 'damage5', damage: 0, magic: 10, poison: 0, heal: 0, poisonRemove: 0, strength: 0, armor: 0, text: 'Deals 10 magic damage', probability: 0.15 + ((gameState.enemy1.health === gameState.enemy1.healthMax) ? 0.20 : 0) / 6},
            {key: 'damage10', damage: 15, magic: 0, poison: 0, heal: 0, poisonRemove: 0, strength: 0, armor: 0, text: 'Deals 15 damage', probability: 0.225 + ((gameState.enemy1.health === gameState.enemy1.healthMax) ? 0.20 : 0) / 6},
            {key: 'damage15', damage: 20, magic: 0, poison: 0, heal: 0, poisonRemove: 0, strength: 0, armor: 0, text: 'Deals 20 damage', probability: 0.15 + ((gameState.enemy1.health === gameState.enemy1.healthMax) ? 0.20 : 0) / 6},
            {key: 'heal10', damage: 0, magic: 0, poison: 0, heal: 15, poisonRemove: 0, strength: 0, armor: 1, text: 'Heals 15 HP\nGains 1 armor', probability: (gameState.enemy1.health === gameState.enemy1.healthMax) ? 0 : 0.15},
            {key: 'heal20', damage: 0, magic: 0, poison: 0, heal: 25, poisonRemove: 0, strength: 0, armor: 0, text: 'Heals 25 HP', probability: (gameState.enemy1.health === gameState.enemy1.healthMax) ? 0 : 0.05},
            {key: 'strength1', damage: 0, magic: 0, poison: 2, heal: 0, poisonRemove: 0, strength: 3, armor: 0, text: 'Gains 3 strenght\nDeals 2 poison', probability: 0.125 + ((gameState.enemy1.health === gameState.enemy1.healthMax) ? 0.20 : 0) / 6},
            {key: 'armor1', damage: 0, magic: 0, poison: 0, heal: 0, poisonRemove: 0, strength: 0, armor: 3, text: 'Gains 3 armor', probability: 0.1 + ((gameState.enemy1.health === gameState.enemy1.healthMax) ? 0.20 : 0) / 6},
            {key: 'poison1', damage: 0, magic: 0, poison: 5, heal: 0, poisonRemove: 0, strength: 0, armor: 0, text: 'Deals 5 poison', probability: 0.05 + ((gameState.enemy1.health === gameState.enemy1.healthMax) ? 0.20 : 0) / 6}
        ];
    }

    // Initiate endOfturnButton
    gameState.endOfTurnButton.on('pointerover', function () {
        if (!gameState.endOfTurnButtonPressed) {
            this.setTexture('rectangularButtonHovered');
        }
    });
    
    gameState.endOfTurnButton.on('pointerout', function () {
        if (!gameState.endOfTurnButtonPressed) {
            this.setTexture('rectangularButton');
        }
    });
    
    gameState.endOfTurnButton.on('pointerup', function () {
        this.setTexture('rectangularButtonPressed');
        gameState.buttonPressedSound.play();
        gameState.endOfTurnButtonPressed = true;
        startEnemyTurn();
    });

    // Initiate mute button
    muteButton.on('pointerup', () => {
        // If sound is already muted, unmute it
        if (gameState.music.mute) {
            gameState.music.mute = false;
            muteButton.setTexture('radioButtonRoundOff');
        }
        // Otherwise, mute the sound
        else {
            gameState.music.mute = true;
            muteButton.setTexture('radioButtonRoundOn');
        }
    });

    // Game End Conditions
function checkGameOver() {
    let gameOverText;

    if (gameState.player.health <= 0) {
        gameState.player.health = 0 // Avoids negative life
        updateManaText();
        gameState.music.stop();

            if (gameState.actionText) {
                gameState.actionText.destroy()
            };     
        gameOverText = self.add.text(550, 300, '    Defeat!\nClick to Restart', { fontSize: '32px', fill: '#ff0000' }).setOrigin(0.5);
    
    } else if (gameState.enemy1.health <= 0) {
        gameState.enemy1.health = 0 // Avoids negative life
        gameState.music.stop();
        updateManaText();
        
        self.time.delayedCall(600, () => {
            if (gameState.attackSound.isPlaying) {
                gameState.attackSound.stop();
            }
            gameState.victorySound.play( { volume: 0.9, rate: 1 } );
            clearBoard();
            console.log('board cleared')
        })

        gameState.actionText.destroy();
        gameState.victoryText = self.add.text(550, 300, 'Victory!', { fontSize: '50px', fill: '#00ff00' }).setOrigin(0.5);
        addHandtoDeck();
        console.log('hand added to deck');
        
        // Reward for completing the level
        self.time.delayedCall(2000, () => {
            gameState.victoryText.destroy();
            gameOverText = self.add.text(550, 180, 'Choose a reward', { fontSize: '40px', fill: '#000000' }).setOrigin(0.5);
            gameState.rewardAddCardsButton = self.add.image(550, 300, 'rectangularButton').setScale(1.2).setInteractive().setOrigin(0.5);
            gameState.rewardAddCardsText = self.add.text(550, 300, 'Add 1 card\nto your deck', { fontSize: '25px', fill: '#000000' }).setOrigin(0.5);
            
            gameState.rewardGainStrengthButton = self.add.image(550, 450, 'rectangularButton').setScale(1.2).setInteractive().setOrigin(0.5);
            gameState.rewardGainStrengthText = self.add.text(550, 450, 'Permanently gain\n+1 strength', { fontSize: '25px', fill: '#000000' }).setOrigin(0.5);

            gameState.rewardAddCardsButton.on('pointerover', function () {
                this.setTexture('rectangularButtonHovered');
            });
        
            gameState.rewardAddCardsButton.on('pointerout', function () {
                this.setTexture('rectangularButton');
            });

            gameState.rewardGainStrengthButton.on('pointerover', function () {
                this.setTexture('rectangularButtonHovered');
            });
        
            gameState.rewardGainStrengthButton.on('pointerout', function () {
                this.setTexture('rectangularButton');
            });

            gameState.rewardAddCardsButton.on('pointerup', () => {

                gameState.rewardGainStrengthButton.destroy();
                gameState.rewardGainStrengthText.destroy();
                gameState.rewardAddCardsButton.destroy();
                gameState.rewardAddCardsText.destroy()
                gameOverText.destroy()

                const x = 380;  // starting x position for cards
                const y = 300;  // starting y position for cards
                const spacing = 200;  // spacing between cards
            
                let bonusCards = gameState.bonusCards.slice(0, 3);  // Get the first three bonus cards
            
                bonusCards.forEach((bonusCard, index) => {
                    // Create and place the card sprites
                    bonusCard.sprite = self.add.sprite(x + index * spacing, y, bonusCard.key).setScale(0.45).setInteractive();
            
                    bonusCard.sprite.on('pointerup', () => {
                        // Add the selected card to the deck and remove it from the bonus cards array
                        gameState.deck.push(bonusCard);
                        gameState.bonusCards.splice(gameState.bonusCards.indexOf(bonusCard), 1);
            
                        // Remove all bonus card sprites from the screen
                        bonusCards.forEach((card) => {
                            if (card !== bonusCard) {
                                card.sprite.destroy();
                            }
                        });

                        // Move the selected card sprite to the center of the screen
                        self.tweens.add({
                            targets: bonusCard.sprite,
                            x: self.cameras.main.centerX,
                            y: self.cameras.main.centerY + 100,
                            scaleX: 0.6,
                            scaleY: 0.6,
                            duration: 1000,
                            ease: 'Power2',
                            onStart: () => { 
                                bonusCard.sprite.removeInteractive(); 
                            }
                        });
                        
                        self.add.text(550, 180, 'Gained 1 card', { fontSize: '40px', fill: '#000000' }).setOrigin(0.5);
                        
                        self.time.delayedCall(2500, () => {    
                            self.cameras.main.fadeOut(1000);
                            self.time.delayedCall(1000, () => {
                                self.scene.start('Level2');
                            });

                        });

                        self.input.on('pointerdown', () => {
                            self.cameras.main.fadeOut(1000);
                            self.time.delayedCall(1000, () => {
                                self.scene.start('Level2');
                            });
                        });

                    });
                });
            })

            gameState.rewardGainStrengthButton.on('pointerup', () => {
                gameState.player.strengthPerma += 1
                gameState.rewardGainStrengthButton.destroy();
                gameState.rewardGainStrengthText.destroy();
                gameState.rewardAddCardsButton.destroy();
                gameState.rewardAddCardsText.destroy();
                gameOverText.destroy();
                self.add.text(550, 180, 'Gained +1 Strength', { fontSize: '40px', fill: '#000000' }).setOrigin(0.5);

                self.time.delayedCall(3500, () => {
                    self.cameras.main.fadeOut(1000);
                    self.time.delayedCall(1000, () => {
                        self.scene.start('Level2');
                        
                    });    
                })

                self.input.on('pointerdown', () => {
                    self.cameras.main.fadeOut(1000);
                    self.time.delayedCall(1000, () => {
                        self.scene.start('Level2');
                    });
                });

            });
        }); // End of reward code
        console.log(gameState.deck)
    };

    if (gameOverText) {
        gameOverText.setInteractive();
        gameOverText.on('pointerup', () => {
            self.scene.restart(); // Restart the scene
        });
        return true; // game over
    }
   
    return false; // game not over
} //end of checkGameOver()

    // Shuffle deck (Fisher-Yates (aka Knuth) shuffle)
    function shuffleDeck(deck) {
        for(let i = deck.length - 1; i > 0; i--){
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    }

    function addHandtoDeck() {    
        while(gameState.currentCards.length > 0) {
            let card = gameState.currentCards.pop();
            card.sprite.destroy(); // remove the card sprite from the screen
            gameState.deck.unshift(card); // add the card back to the bottom of the deck
        }
    }

    function clearBoard() {
        gameState.player.sprite.destroy()
        gameState.enemy1.sprite.destroy()
        gameState.manaSymbol.destroy()
        gameState.manaText.destroy()
        gameState.endOfTurnButton.destroy()
        gameState.endOfTurnText.destroy()
        gameState.player.statsText.destroy()
        gameState.enemy1.statsText.destroy()
        gameState.player.healthBarBackground.destroy()
        gameState.player.healthBar.destroy()
        gameState.player.healthBarText.destroy()
        gameState.enemy1.healthBarBackground.destroy()
        gameState.enemy1.healthBar.destroy()
        gameState.enemy1.healthBarText.destroy()
        gameState.player.deckImage.destroy()
        gameState.player.numOfCardesText.destroy()
        if (gameState.actionText) {
            gameState.actionText.destroy()
        };
    }

/*    function destroyRewardButtons() {
        rewardGainStrengthButton.destroy();
        gameState.rewardGainStrengthText.destroy();
        gameState.rewardAddCardsButton.destroy();
        gameState.rewardAddCardsText.destroy()
    };*/

}; //End of create()

} //end of scene "level 1"


/* ---------------------- CREDITS -----------------

Music by xDeviruchi
Punch sounds by @danielsoundsgood (https://danielsoundsgood.itch.io/free-deadly-kombat-sound-effects)
Healing sound: "Healing (Ripple)" by Dylan Kelk (https://freesound.org/people/SilverIllusionist/)
Power up sound by MATRIXXX (https://freesound.org/people/MATRIXXX_/)
Button Sprites by Ian Eborn.
*/
