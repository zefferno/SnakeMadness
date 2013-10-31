/**
 * Game core function contains all the logic for the game.
 * @param {Object} gameConfig Game configuration structure.
 * @param {Object} gameReadyCallback Reference to function callback event after preloading completion.
 */
function Game(gameConfig, gameReadyCallback) {	
	// Contexts to Canvas tags 
	var frontLayer;
	var frontLayerHeight;
	var frontLayerWidth;	
	var backLayer;
	var backLayerHeight;
	var backLayerWidth;
	
	// Sprites Containers
	var backgroundContainer = [];
	var foodContainer = [];
	
	// Snake representation	
	var snakeArray;
	// Snake food
	var food;
	// Score counter
	var score = 0;
	// RequestAnimationFrame handle ID
    var requestAnimationID = undefined;
	// Snake current direction
	var currentDirection = -1;
	// Background screen number
	var screenNumber = -1;
	// Start game trigger
	var startGameTrigger;
	// Enable/disable sound trigger
	var soundEnabled = gameConfig.soundEnabled;
	
	// Audio objects
	var backgroundAudio;
	var eatingAudio;
	var gameOverAudio;
	
	// Sprites load counter
	var spritesLoadCount = 0;
	
	/**
	 * Game start function  
	 */
	this.start = function() {
		// Check Game requirements
	    if (!checkRequirements)
	       throw new Error('Browser does not support Canvas or Audio tags');
	       
	    // Set game start rendering trigger to off
	    startGameTrigger = false;
	    // Dark background screen
	    backLayer.globalAlpha = 0.5;
	    // Select background
	    selectRandomBackground();
	    // Draw background
	    drawBackground();
		// Register start event key handler
		GameUtils.registerEvent('keydown', eventStartHandler);
	    // Display starting text	    	    
	    drawCenterText(gameConfig.gameStartText, gameConfig.gameStartTextSize, frontLayerHeight/2);	    
	    // Start rendering game
	    requestAnimationID = window.requestInterval(renderScene, gameConfig.gameSpeed);	
	};
	
	/**
	 * Set sound to enable/disable sound.
	 * @param {boolean} value Boolean condition for enabling sound (true=enabled, false=disabled). 
	 */	
	this.setSound = function(value) {
	    if (value) {
	        soundEnabled = true;
            // Turn on background sound only if game is already started
            if (currentDirection != -1 && startGameTrigger) {
                backgroundAudio.play();                
            }               	        
	    }
	    else {
	        soundEnabled = false;
	        // Turn off background sound
	        backgroundAudio.pause();
	    }	    
	};
	
	/**
	 * Game keyboard events handler.
	 * @event 
	 * @param {EventObject} event 
	 */		
	var eventGameHandler = function(event) {
		switch(event.keyCode) {
			case constants.KEY_UP:
				if (currentDirection != constants.DIRECTION_DOWN) {
				    currentDirection = constants.DIRECTION_UP;   
				}					
				break;
			case constants.KEY_DOWN:
				if (currentDirection != constants.DIRECTION_UP) {
				    currentDirection = constants.DIRECTION_DOWN;
				} 			
				break;
			case constants.KEY_RIGHT:
				if (currentDirection != constants.DIRECTION_LEFT) {
				    currentDirection = constants.DIRECTION_RIGHT;				    
				} 			
				break;
			case constants.KEY_LEFT:
				if (currentDirection != constants.DIRECTION_RIGHT) {
				    currentDirection = constants.DIRECTION_LEFT;  
				} 			
				break;
			default:
			    break;
		}
	};

	/**
	 * Game start keyboard event handler.
	 * @event 
	 * @param {EventObject} event 
	 */
	var eventStartHandler = function(event) {
		if (event.keyCode == constants.KEY_ENTER) {
			startGameTrigger = true;
		}		
	};
	
	/**
	 * Sprites preloading handler.
	 */    
    var eventSpritesLoadingHandler = function() {
    	var totalNumOfSprites = gameConfig.backgroundSprites.length + gameConfig.foodSprites.length;

    	spritesLoadCount++;
    	
    	// Check if all sprites are loaded
    	if (totalNumOfSprites == spritesLoadCount) {
    		// Call game ready
    		gameReadyCallback();
    	}    	 
    };
    	

	/**
	 * Draw a centred text in a specified Y position.
	 * @param {string} text Text to be drawn.
	 * @param {integer} size Size of the text in pixels.
	 */		
	var drawCenterText = function (text, size, y) {
		frontLayer.font = size.toString() + 'px Pacmania';
		var textDiemensions = frontLayer.measureText(text);
		frontLayer.beginPath();
		frontLayer.fillStyle = 'yellow';
		frontLayer.shadowOffsetX = 2;
        frontLayer.shadowOffsetX = 2;
        frontLayer.shadowOffsetY = 2;
        frontLayer.shadowColor = 'black';                
        frontLayer.fillText(text, (frontLayerWidth - textDiemensions.width)/2, y);
	};	
	
	/**
	 * Renders the screen (runs in every frame of animation).
	 */		
	var renderScene = function() {
		// Check start rendering trigger
		if (startGameTrigger) {
		    // Check for first render loop			
			if (currentDirection == -1) {
				// Play background sound
				if (soundEnabled) {
				    backgroundAudio.play();    
				}
			    // Light background screen
			    backLayer.globalAlpha = 1;
				// Unregister start key event handler
				GameUtils.unRegisterEvent('keydown', eventStartHandler);			    
			    // Set snake head position
			    currentDirection = gameConfig.snakeStartDirection;
			    // Put food at random place
			    addRandomFood();
			    // Register key handler
			    GameUtils.registerEvent('keydown', eventGameHandler);			
			}			
			// Go over screen updates						
			clearScreen();
			drawBackground();		
	        drawScore();
	        drawFood();
	        drawSnakeArray();
	        updateScene();
        }
	};
	
	/**
	 * Clears the contexts of the Canvas layers.
	 */		
	var clearScreen = function() {
		// Clear front and back layers
		frontLayer.clearRect(0, 0, frontLayerWidth, frontLayerHeight);
		backLayer.clearRect(0, 0, backLayerWidth, backLayerHeight);
	}; 
	
	/**
	 * Game over function.
	 */				
	var gameOver = function() {
		// Cancel browser request animation
		window.clearRequestInterval(requestAnimationID);
		// Unregister key event handler
		GameUtils.unRegisterEvent('keydown', eventGameHandler);
		// Draw ending text
		drawCenterText(gameConfig.gameOverText, gameConfig.gameOverTextSize, frontLayerHeight/2);

		if (soundEnabled) {
		    // Play game over sound
		    gameOverAudio.play();
            // Stop background sound
            backgroundAudio.pause();		    
		}
				
		// Set game start rendering trigger to off
		startGameTrigger = false;
	};
	
	/**
	 * Check if specified point coordinates collides with the game wall.
	 * @param {integer} xPos X position.
	 * @param {integer} yPos Y position.
	 * @return {boolean} true=collides, false=not collides.
	 */		
	var isPointCollidesWithWall = function(xPos, yPos)  {
		// Check if X position is greater than the relative wall width (width/snakesize) 
		// or if it's lower than the smallest x value 
		if (xPos >= GameUtils.round(frontLayerWidth / gameConfig.snakeSize)  || xPos < 0) {
		    return true;   
		}
		// Check if Y position is greater than the relative wall height (height/snakesize) 
		// or if it's lower than the smallest Y value 					
		if (yPos >= GameUtils.round(frontLayerHeight / gameConfig.snakeSize) || yPos < 0) {
		    return true;
		}		
			
		return false;
	};
	
	/**
	 * Check if specified point coordinates collides with the snake body.
	 * @param {integer} xPos X position.
	 * @param {integer} yPos Y position.
	 * @return {boolean} true=collides, false=not collides.
	 */			
	var isPointCollidesWithSnakeBody = function(xPos, yPos) {
		// Go over snake array
		for (var i=0; i < snakeArray.length; i++) {
			// Check if point collides with snake coordinates
			if (snakeArray[i].x  == xPos && snakeArray[i].y == yPos)
				return true;
	    }
	     
	    return false;
	};
	
	/**
	 * Check if the current food object collides with the snake body.
	 * @return {boolean} true=collides, false=not collides.
	 */			
	var isFoodCollidesWithSnakeBody = function() {
		// Get food size and positions
        var foodPos = food.getPosition();
        var foodSize = food.getSize();  	    
        var foodTop = foodPos.y; 
        var foodBottom = foodPos.y + foodSize.height;
        var foodRight = foodPos.x + foodSize.width;
        var foodLeft = foodPos.x;
        
        // Snake part
        var partTop;
        var partBottom;
        var partRight;
        var partLeft;
        
        // For each snake part check if food coordinates collides
        for (var i=0; i < snakeArray.length; i++) {
        	// Each point is relative to the snake size on screen 
            partTop = snakeArray[i].y * gameConfig.snakeSize;
            partBottom = snakeArray[i].y * gameConfig.snakeSize + gameConfig.snakeSize;
            partRight = snakeArray[i].x * gameConfig.snakeSize + gameConfig.snakeSize;
            partLeft = snakeArray[i].x * gameConfig.snakeSize;
            // Check the opposite of not collides
            if ( ! (foodBottom < partTop || 
                    foodTop > partBottom || 
                    foodLeft > partRight || 
                    foodRight < partLeft) ) 
                    {
                        return true;
                    }                                                  
        }
        
	    return false;
	};
	
	/**
	 * Check if food coordinates collides with snake head (eating food).
	 * @return {boolean} true=collides, false=not collides.
	 */		
	var isFoodCollidesWithSnakeHead = function() {
		// Get food position and sizes
        var foodPos = food.getPosition();
        var foodSize = food.getSize();  	    
        var foodTop = foodPos.y; 
        var foodBottom = foodPos.y + foodSize.height;
        var foodRight = foodPos.x + foodSize.width;
        var foodLeft = foodPos.x;
        // Get snake head position
        var headTop = snakeArray[0].y * gameConfig.snakeSize;
        var headBottom = snakeArray[0].y * gameConfig.snakeSize + gameConfig.snakeSize;
        var headRight = snakeArray[0].x * gameConfig.snakeSize + gameConfig.snakeSize;
        var headLeft = snakeArray[0].x * gameConfig.snakeSize;
        // Check the opposite of not collides
        if ( ! (foodBottom < headTop || 
                foodTop > headBottom || 
                foodLeft > headRight || 
                foodRight < headLeft) )
                
                return true;
                                                                
	    return false;
	};
	
	/**
	 * Updates the game scene
	 */				
	var updateScene = function() {
		// Save head position
	    var headXPos = snakeArray[0].x;
	    var headYPos = snakeArray[0].y;
	    
	    // Check keyboard event	    	    		    	    
	    switch(currentDirection) {
	    	// If direction is up decrease snake head Y position
	    	case constants.DIRECTION_UP:
	    		headYPos--;
	    		break;
	    	// If direction is down increase snake head Y position
	    	case constants.DIRECTION_DOWN:
	    		headYPos++;
	    		break;
	    	// If direction is right increase snake head X position
	    	case constants.DIRECTION_RIGHT:
	    		headXPos++;
	    		break;
	    	// If direction is right decrease snake head X position	    		
	    	case constants.DIRECTION_LEFT:
	    		headXPos--;
	    		break;
	    	default:
	    	// Default is just for semantics
	    	  break;	    			    			    	
	    }
	    
	    // Snake collision with Snake body
	    if ( isPointCollidesWithSnakeBody(headXPos, headYPos) ) {
	    	gameOver();
	    	return;		    	
	    }
	    
	    // Snake movement:
	    // Remove last element in array and push it as new head element
	    var tail = snakeArray.pop();
	    tail.x = headXPos;
	    tail.y = headYPos;
	    snakeArray.unshift(tail);	    
	    	    	    
	    // Snake wall collision detection 
	    if ( isPointCollidesWithWall(headXPos, headYPos) ) {
	    	gameOver();
	    	return;		    	
	    }
	    
	    // Snake food collision detection
	    if ( isFoodCollidesWithSnakeHead() ) {
	    	// Count food score
	    	score += food.getScore();	    	
	    	// Update snake array with new head
	    	var newHead = {x: headXPos, y: headYPos};	
	    	snakeArray.unshift(newHead);
	    	
	    	if (soundEnabled) {
                eatingAudio.currentTime = 0;
                eatingAudio.play();	    	    
	    	}
	    	
	    	// Place new food
	    	addRandomFood();	    		    	   	    		    	   
	    }	        
	};
	
	/**
	 * Select background from the Background container.
	 */			
	var selectRandomBackground = function() {
		// Select random background
    	screenNumber = GameUtils.getRandom(0, backgroundContainer.length);
	};

	/**
	 * Draw background to screen.
	 */			
    var drawBackground = function() {	
        backgroundContainer[screenNumber].draw();
    };

	/**
	 * Draw food to screen.
	 */			    
    var drawFood = function() {
        food.draw();
    };
    
	/**
	 * Draw snake array to screen.
	 */		    	
	var drawSnakeArray = function() {
		// This will be used to calculate colors
	    var color;
	    
	    // Go over snake array
	    for(var i=0; i < snakeArray.length; i++) {	    	
	    	// Take snake part	    	
	        var snakePart = snakeArray[i];
	        // Calculate brightness for it
	        color = GameUtils.increaseBrightness(gameConfig.snakeColor, 40 * i / snakeArray.length);	        
	        // Set color
			frontLayer.fillStyle = color;
			// Draw snake part
			frontLayer.fillRect(snakePart.x * gameConfig.snakeSize, 
			                    snakePart.y * gameConfig.snakeSize, 
			                    gameConfig.snakeSize, 
			                    gameConfig.snakeSize);			                    
			frontLayer.strokeStyle = 'black';
			frontLayer.strokeRect(snakePart.x * gameConfig.snakeSize, 
			                      snakePart.y * gameConfig.snakeSize, 
			                      gameConfig.snakeSize, 
			                      gameConfig.snakeSize);
		}
		
		// Get position for snake eye (should be almost the the end of snake head)
		var locationX = (snakeArray[0].x * gameConfig.snakeSize) + (gameConfig.snakeSize/1.5);
		var locationY = (snakeArray[0].y * gameConfig.snakeSize) + (gameConfig.snakeSize/2.4);
		
		// Draw snake eyes
		frontLayer.beginPath();
		frontLayer.fillStyle = 'black';
		frontLayer.arc(locationX, locationY, 4, 0, 2 * Math.PI, false);
		frontLayer.fill();
	};

	/**
	 * Draw score to screen.
	 */		
	var drawScore = function() {
		var text = gameConfig.scoreText + score;		       		
		backLayer.font = '50px Typhoon';
		backLayer.shadowOffsetX = 2;
        backLayer.shadowOffsetX = 2;
        backLayer.shadowOffsetY = 2;
        backLayer.shadowColor = 'black';        	
        backLayer.fillStyle = 'yellow';
                
        backLayer.fillText(text, 20, backLayerHeight - 10);                    		
	};

	/**
	 * Adds random food to the scene.
	 */			
    var addRandomFood = function() {
        food = getRandomFood();
        
        // Get random position 
        var foodWidth = food.getSize().width;
        var foodHeight = food.getSize().height;
        var xPos = GameUtils.getRandom(foodWidth, backLayerWidth - foodWidth);
        var yPos = GameUtils.getRandom(foodHeight, backLayerHeight - foodHeight);        
        food.setPosition(xPos, yPos);
        
        // Check collision with snake body
        while ( isFoodCollidesWithSnakeBody() ) { 
            xPos = GameUtils.getRandom(foodWidth, backLayerWidth - foodWidth);
            yPos = GameUtils.getRandom(foodHeight, backLayerHeight - foodHeight);
            // Set random position
            food.setPosition(xPos, yPos);
        }
    };
    
	/**
	 * Helper function for addRandomFood. Gets random food according to food cost.
	 * @return {Object} Food container. 
	 */	        
    var getRandomFood = function() {
        var selectedFood;
        var foodCost = 0;
        var random = -1;
        
        // Check random food cost for each random number (0-10)
        while (foodCost > random) {
        	// Select random number
			random = GameUtils.getRandom(0, 10);  			
			// Select random food			      	
        	selectedFood = GameUtils.getRandom(0, foodContainer.length - 1);
        	// Set random food cost for check
        	// Maximum cost is 10
        	foodCost = (foodContainer[selectedFood].getCost() < 10) ? foodContainer[selectedFood].getCost() : 10;        	        	        	
        }
        
        return foodContainer[selectedFood];
    };

	/**
	 * Builds the snake array.
	 */	    
	var buildSnakeArray = function() {
		snakeArray = [];
		
		for(var i=gameConfig.snakeStartLength; i>0; i--) {
		    snakeArray.push( {x: i, y: gameConfig.snakeStartYPos} );    
		}				
	};
	
	/**
	 * Checks game requirements.
	 */	   	
	var checkRequirements = function () {
		if (!Modernizr.canvas || !Modernizr.audio) {
		    return false;   
		}
		
		return true;
	};    

	/**
	 * Initialization function for Game
	 */	   		
	var init = function () {
		// Acquire Contexts
		if ( !(frontLayer = GameUtils.acquireContext(gameConfig.frontLayerId)) ) {
		    throw new Error('Unable to aquire front canvas context');   
		}
			
		if ( !(backLayer = GameUtils.acquireContext(gameConfig.backLayerId)) ) {
		    throw new Error('Unable to aquire background canvas context');    
		}
		
		// Get canvas sizes		
		var size = GameUtils.getCanvasSize(gameConfig.frontLayerId);
		frontLayerHeight = size.height;
		frontLayerWidth = size.width;
		
		size = GameUtils.getCanvasSize(gameConfig.backLayerId);
		backLayerHeight = size.height;
		backLayerWidth = size.width;
				
		// Load backgrounds	
		for (var i=0, obj; i < gameConfig.backgroundSprites.length; i++) {
		    if (obj = new GameBackground(gameConfig.backgroundSprites[i].src, backLayer, 0, 0, eventSpritesLoadingHandler)) {
		        backgroundContainer.push(obj);		        
		    }
            else {
                throw new Error('Unable to load background object');                
            }                 		 
		}
                
        // Load food
        for (var i=0, obj; i < gameConfig.foodSprites.length; i++) {
            if (obj = new GameFood(gameConfig.foodSprites[i].name, 
            					   gameConfig.foodSprites[i].score,
            					   gameConfig.foodSprites[i].cost, 
            					   gameConfig.foodSprites[i].src, 
            					   frontLayer, 
            					   0, 
            					   0, 
            					   eventSpritesLoadingHandler)) 
         	{
                foodContainer.push(obj);    
            }
            else {
                throw new Error('Unable to load food object');    
            }                
        }
                
        // Load audio objects        
        backgroundAudio = document.getElementById(gameConfig.backgroundSoundId);
        backgroundAudio.load();
        eatingAudio = document.getElementById(gameConfig.eatSoundId);
        eatingAudio.load();
        gameOverAudio = document.getElementById(gameConfig.gameOverSoundId);
        gameOverAudio.load();
        
        // Build snake array structure     
        buildSnakeArray();
	};
	
	// Call the initiailize function
	init();
};
