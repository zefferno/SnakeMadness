var soundControlImages = { SOUND_ON:  'img/sound/unmute.png',
                           SOUND_OFF: 'img/sound/mute.png' };
                           
var constants = { DIRECTION_UP:     1,
                  DIRECTION_DOWN:   2,
                  DIRECTION_RIGHT:  3,
                  DIRECTION_LEFT:   4,
                  KEY_UP: 		    38,
                  KEY_DOWN:         40,
                  KEY_RIGHT:        39,
                  KEY_LEFT:         37,
                  KEY_ENTER:        13 };

var FOOD_SPRITES        = [ {name: 'apple',      src: 'img/food/apple.png',      score: 10,  cost: 0},
					        {name: 'orange',     src: 'img/food/orange.png',     score: 10,  cost: 0},
					        {name: 'bananas',    src: 'img/food/bananas.png',    score: 100, cost: 8},
					        {name: 'strawberry', src: 'img/food/strawberry.png', score: 10,  cost: 0} ];
					        
var BACKGROUNDS_SPRITES = [ {src: 'img/background/grass.jpg'},
							{src: 'img/background/grass2.png'} ];

var gameConfiguration   = { foodSprites: FOOD_SPRITES,
						    backgroundSprites: BACKGROUNDS_SPRITES,
						    frontLayerId: 'frontLayer',
						    backLayerId: 'backgroundLayer',
						    backgroundSoundId: 'backgroundSound',
						    eatSoundId: 'eatingSound',
						    gameOverSoundId: 'gameOverSound',
						    gameSpeed: 100,
						    snakeStartLength: 3,
						    snakeStartYPos: 3,
						    snakeStartDirection: constants.DIRECTION_RIGHT,
						    snakeSize : 30,
						    scoreText: 'Score: ',
						    snakeColor: '#8A822E',
						    gameOverText: 'Game Over!',
						    gameOverTextSize: 50,
						    gameStartText: 'Press Enter to start...',
						    gameStartTextSize: 50,
						    soundEnabled: true };
						  
// Save Game instance object for access						  
var game;

/**
 * Starts the Game.
 */
function startGame() {
    
    // This function will be called when Game is loaded
    var gameLoaded = function () {
		game.start();
    }; 
    	
    // Initialize the game    
    game = new Game(gameConfiguration, gameLoaded);     
}

/**
 * Sound button control handler.
 */
function soundControl() {
    // Check of Game instance exists
    if (!(game instanceof Game)) {
        return;                
    }
    
    if (document.getElementById('soundButton').title == 'Turn off game sound') {
        game.setSound(false);
        // Change image (to turn on sound)
        changeToUnmute();
    }
    else {
        game.setSound(true);
        // Change image (to turn off sound)
        changeToMute();
    }
}

/**
 * Mutes the sound.
 */
function changeToMute() {
    document.getElementById('soundButton').style.backgroundImage = "url('" + soundControlImages.SOUND_OFF + "')";
    document.getElementById('soundButton').title = 'Turn off game sound';    
}

/**
 * Unmutes the sound.
 */
function changeToUnmute() {
    document.getElementById('soundButton').style.backgroundImage = "url('" + soundControlImages.SOUND_ON + "')";
    document.getElementById('soundButton').title = 'Turn on game sound';
}
					  
/**
 * Main will be called at startup. 
 */
function main() {
    gameConfiguration.soundEnabled ? changeToMute() : changeToUnmute();
    startGame();
}