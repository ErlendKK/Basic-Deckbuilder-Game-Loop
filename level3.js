class Level3 extends Phaser.Scene {
    constructor() {
        super('Level3');
    }

    create() {
        let self = this;
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.add.image(0,0, 'bakgrunn3').setScale(0.75).setOrigin(0.02,0);              
        gameState.cursors = this.input.keyboard.createCursorKeys();
        
        gameState.currentCards = [];
        gameState.cardImages = [];      
        gameState.manaSymbol = this.add.image(550,75, 'manaSymbol').setScale(0.7);
        gameState.startText = this.add.text(550, 300, 'Level 3!', { fontSize: '60px', fill: '#ff0000', fontFamily: 'Rock Kapak'  }).setOrigin(0.5); 
             
        gameState.cardsDealtSound = this.sound.add('cardsDealtSound');
        gameState.victorySound = this.sound.add('victorySound')
        gameState.buttonPressedSound = this.sound.add('buttonPressedSound');
        gameState.attackSound = this.sound.add('attackSound');
        gameState.powerUpSound = this.sound.add('powerUpSound');
        gameState.healSound = this.sound.add('healSound');
        gameState.music = this.sound.add('bossTune');
    
        gameState.endOfTurnButton = this.add.sprite(980, 610, 'rectangularButton').setScale(0.45).setOrigin(0.5);
        gameState.endOfTurnText = this.add.text(980, 610, 'End Turn', { fontSize: '20px', fill: '#000000' }).setOrigin(0.5);
        let muteButton = this.add.sprite(1050, 60, 'radioButtonRoundOff').setScale(0.5).setInteractive();
        gameState.muteText = this.add.text(875, 50, 'Mute music', { fontSize: '25px', fill: '#000000' });        

        // Set up characters
        gameState.player.sprite = this.add.sprite(320, 340, 'player').setScale(0.41).setFlipX(true).setInteractive();
        gameState.player.mana = gameState.player.manaMax;
        gameState.player.health = gameState.player.healthMax;
        gameState.player.strength = gameState.player.strengthPerma;
        gameState.player.armor = 0
        gameState.player.poison = 0
    
        gameState.enemy1 = {
            sprite: this.add.sprite(760, 340, 'enemy3').setScale(0.26).setFlipX(false).setInteractive(),   
            health: 140,
            healthMax: 140,
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
        gameState.player.healthBarText = this.add.text(gameState.player.sprite.x - 40, gameState.player.sprite.y - 140, `${gameState.player.health}/${gameState.player.healthMax}`, { fontSize: '11px', fill: '#000000' }).setOrigin(0);
    
        // Add a health bar to the enemy
        gameState.enemy1.healthBarBackground = this.add.graphics();
        gameState.enemy1.healthBarBackground.lineStyle(3, 0x000000, 1);
        gameState.enemy1.healthBarBackground.strokeRect(gameState.enemy1.sprite.x - 40, gameState.enemy1.sprite.y - 140, 100, 10);
    
        gameState.enemy1.healthBar = this.add.graphics();
        gameState.enemy1.healthBar.fillStyle(0xff0000, 1);
        gameState.enemy1.healthBar.fillRect(gameState.enemy1.sprite.x - 40, gameState.enemy1.sprite.y - 140, 100 * (gameState.enemy1.health / gameState.enemy1.healthMax), 10);
        gameState.enemy1.healthBarText = this.add.text(gameState.enemy1.sprite.x - 40, gameState.enemy1.sprite.y - 140, `${gameState.enemy1.health}/${gameState.enemy1.healthMax}`, { fontSize: '11px', fill: '#000000' }).setOrigin(0);
    
        let enemyActions = []
        updateEnemyActions()
    
        gameState.manaText = this.add.text(530, 60, `${gameState.player.mana}/${gameState.player.manaMax}`, { fontSize: '22px', fill: '#000000', fontWeight: 'bold' }).setDepth(100)    
        gameState.player.deckImage = this.add.image(100,600, 'deck').setScale(0.15).setOrigin(.5,.5).setInteractive();
        gameState.player.numOfCardesText = this.add.text(100, 600, gameState.deck.length, { fontSize: '45px', fill: '#000000', fontWeight: 'bold' }).setDepth(100).setOrigin(.5,.5);     
                
        this.time.delayedCall(500, () => {    
            gameState.music.play( { loop: true, volume: 0.35 } );
        })
    
        this.time.delayedCall(1800, () => {
            gameState.startText.destroy();
            this.time.delayedCall(600, startPlayerTurn());
        });

    
    // ---------------------------------- PLAYERS TURN -------------------------------------    
    
    
        function startPlayerTurn() {
            console.log(`player's turn started`)
            gameState.player.mana = gameState.player.manaMax;
            gameState.yourTurnText = self.add.text(550, 300, 'Your turn!', { fontSize: '60px', fill: '#ff0000' }).setOrigin(0.5);
            gameState.player.poisonText = self.add.text(570, 350, '', { fontSize: '25px', fill: '#ff0000' }).setOrigin(0.5);

            posionMechanic(gameState.player)
            updateHealthBar(gameState.player);
            updateStats(gameState.player);
            updateManaText();
            shuffleDeck(gameState.deck)

            self.time.delayedCall(2000, () => {
                gameState.yourTurnText.destroy();
                gameState.player.poisonText.destroy();
                drawCards(5);    
            });                  
        }

        // Draw card Mechanics
        function drawCards(numCards) {

            self.time.delayedCall(600, () => {
                gameState.endOfTurnButtonPressed = false; // Resets the end of turn button
                gameState.endOfTurnButton.setTexture('rectangularButton');
                gameState.endOfTurnButton.setInteractive()
                
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
    
    function updateEnemyActions() {
        enemyActions = [ 
        {key: 'damage5', damage: 0, magic: 15, poison: 0, heal: 0, poisonRemove: 0, strength: 0, armor: 0, text: 'Deals 15 magic damage', probability: 0.15 + ((gameState.enemy1.health === gameState.enemy1.healthMax) ? 0.20 : 0) / 6},
        {key: 'damage10', damage: 20, magic: 0, poison: 0, heal: 0, poisonRemove: 0, strength: 0, armor: 0, text: 'Deals 20 damage', probability: 0.225 + ((gameState.enemy1.health === gameState.enemy1.healthMax) ? 0.20 : 0) / 6},
        {key: 'damage15', damage: 25, magic: 0, poison: 0, heal: 0, poisonRemove: 0, strength: 0, armor: 0, text: 'Deals 25 damage', probability: 0.15 + ((gameState.enemy1.health === gameState.enemy1.healthMax) ? 0.20 : 0) / 6},
        {key: 'heal10', damage: 0, magic: 0, poison: 0, heal: 17, poisonRemove: 0, strength: 0, armor: 2, text: 'Heals 17 HP\nGains 2 armor', probability: (gameState.enemy1.health === gameState.enemy1.healthMax) ? 0 : 0.15},
        {key: 'heal20', damage: 0, magic: 0, poison: 0, heal: 27, poisonRemove: 0, strength: 0, armor: 0, text: 'Heals 27 HP', probability: (gameState.enemy1.health === gameState.enemy1.healthMax) ? 0 : 0.05},
        {key: 'strength1', damage: 0, magic: 0, poison: 0, heal: 0, poisonRemove: 0, strength: 4, armor: 0, text: 'Gains 4 strenght', probability: 0.125 + ((gameState.enemy1.health === gameState.enemy1.healthMax) ? 0.20 : 0) / 6},
        {key: 'armor1', damage: 0, magic: 0, poison: 0, heal: 0, poisonRemove: 0, strength: 0, armor: 4, text: 'Gains 4 armor', probability: 0.1 + ((gameState.enemy1.health === gameState.enemy1.healthMax) ? 0.20 : 0) / 6},
        {key: 'poison1', damage: 0, magic: 0, poison: 5, heal: 0, poisonRemove: 0, strength: 0, armor: 0, text: 'Deals 5 poison', probability: 0.05 + ((gameState.enemy1.health === gameState.enemy1.healthMax) ? 0.20 : 0) / 6}
        ];
    }

    function enemyTurn() {
        updateEnemyActions();
        addHandtoDeck()

        if (gameState.actionText) {gameState.actionText.destroy()}
        
        if (gameState.player.mana != 0) {
            gameState.player.mana = 0
            updateManaText();
        }

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
        gameState.enemy1.TurnText = self.add.text(550, 300, 'Enemy turn!', { fontSize: '60px', fill: '#ff0000' }).setOrigin(0.5);
        gameState.enemy1.PoisonText = self.add.text(570, 350, '', { fontSize: '30px', fill: '#ff0000' }).setOrigin(0.5);

        posionMechanic(gameState.enemy1)

        self.time.delayedCall(2000, () => {
            gameState.enemy1.TurnText.destroy();
            gameState.enemy1.PoisonText.destroy();
        
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
    

    //-------------------------- END OF GAME ----------------------------


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
            
            self.time.delayedCall(2000, () => {
                gameState.victoryText.destroy();
                grantReward()
            });

    function grantReward() {
        gameOverText = self.add.text(550, 180, 'Choose a reward', { fontSize: '40px', fill: '#000000' }).setOrigin(0.5);
            gameState.rewardGainManaButton = self.add.image(550, 300, 'rectangularButton').setScale(1.2).setInteractive().setOrigin(0.5);
            gameState.rewardGainManaText = self.add.text(550, 300, 'Permanently gain\n+1 max Mana', { fontSize: '25px', fill: '#000000' }).setOrigin(0.5);
            
            gameState.rewardGainHPButton = self.add.image(550, 450, 'rectangularButton').setScale(1.2).setInteractive().setOrigin(0.5);
            gameState.rewardGainHPText = self.add.text(550, 450, 'Permanently gain\n+12 max HP', { fontSize: '25px', fill: '#000000' }).setOrigin(0.5);
    
            gameState.rewardGainManaButton.on('pointerover', function () {
                this.setTexture('rectangularButtonHovered');
            });
        
            gameState.rewardGainManaButton.on('pointerout', function () {
                this.setTexture('rectangularButton');
            });
    
            gameState.rewardGainHPButton.on('pointerover', function () {
                this.setTexture('rectangularButtonHovered');
            });
        
            gameState.rewardGainHPButton.on('pointerout', function () {
                this.setTexture('rectangularButton');
            });
    
            gameState.rewardGainManaButton.on('pointerup', () => {
                gameState.player.manaMax += 1
                gameState.rewardGainManaButton.destroy();
                gameState.rewardGainManaText.destroy();
                gameState.rewardGainHPButton.destroy();
                gameState.rewardGainHPText.destroy()
                gameOverText.destroy()
                self.add.text(550, 180, 'Gained +1 Mana', { fontSize: '40px', fill: '#000000' }).setOrigin(0.5);
                        
                        self.time.delayedCall(2500, () => {    
                            self.cameras.main.fadeOut(1000);
                            self.time.delayedCall(1000, () => {
                                self.scene.start('Level4');
                            });
    
                        });
    
                        self.input.on('pointerdown', () => {
                            self.cameras.main.fadeOut(1000);
                            self.time.delayedCall(1000, () => {
                                self.scene.start('Level4');
                            });
                        });
    
            });
    
            gameState.rewardGainHPButton.on('pointerup', () => {
                gameState.player.healthMax += 12
                gameState.rewardGainManaButton.destroy();
                gameState.rewardGainManaText.destroy();
                gameState.rewardGainHPButton.destroy();
                gameState.rewardGainHPText.destroy()
                gameOverText.destroy()
                self.add.text(550, 180, 'Gained +12 HP', { fontSize: '40px', fill: '#000000' }).setOrigin(0.5);
    
                self.time.delayedCall(3500, () => {
                    self.cameras.main.fadeOut(1000);
                    self.time.delayedCall(1000, () => {
                        self.scene.start('Level4');
                        
                    });    
                })
    
                self.input.on('pointerdown', () => {
                    self.cameras.main.fadeOut(1000);
                    self.time.delayedCall(1000, () => {
                        self.scene.start('Level4');
                    });
                });
    
            });
    
    }; // End of reward code
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

    
    
    // ---------------------------------- INITIATE BUTTONS ------------------------------------- 
    
    
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
            this.removeInteractive()
            gameState.buttonPressedSound.play();
            gameState.endOfTurnButtonPressed = true;
            if (gameState.actionText) {
                gameState.actionText.destroy()
            }
            enemyTurn();
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
    
        // Initiate deck image
        gameState.player.deckImage.on('pointerover', function() {
            // Constants for grid layout
            const cardsPerRow = 4;
            const cardSpacing = 105;
            const startX = 400;
            const startY = 200;
            
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

    
        // Shuffle deck (Fisher-Yates shuffle)
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

        function posionMechanic(character) {
            if (character.poison > 0) {
                updateStats(character);
                character.health = Math.max(1, character.health - character.poison)
                character.poisonText.setText(`-${character.poison} HP`);
                character.poison -= 1
            }
        }
    
    }; //End of create()

} //end of scene


/* ---------------------- CREDITS -----------------

Music by xDeviruchi
Punch sounds by @danielsoundsgood (https://danielsoundsgood.itch.io/free-deadly-kombat-sound-effects)
Healing sound: "Healing (Ripple)" by Dylan Kelk (https://freesound.org/people/SilverIllusionist/)
Power up sound by MATRIXXX (https://freesound.org/people/MATRIXXX_/)
Button Sprites by Ian Eborn.
*/
