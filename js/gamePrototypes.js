/**
 * GameSprite object.
 * @constructor
 * @param {string} src Image source.
 * @param {Object} canvasContext Context Context to the Canvas.
 * @param {integer} x X position.
 * @param {integer} y Y position.
 * @param {Object} loadCompletedCallback Sprite load completed callback.
 */
function GameSprite(src, canvasContext, x, y, loadCompletedCallback) {
	this.context = canvasContext;
	this.x = x;
	this.y = y;
	
	// Create Image() object
    if (!(this.image = GameUtils.getImage(src, loadCompletedCallback)))
        throw new Error('Initiailize error');
};

/**
 * Set X and Y position of GameSprite.
 * @param {integer} x X position.
 * @param {integer} y Y position. 
 */
GameSprite.prototype.setPosition = function(x, y) {
	this.x = x;
	this.y = y;
};

/**
 * Get position of GameSprite.
 * @return {Object} X and Y coordinates. 
 */
GameSprite.prototype.getPosition = function() {
    return {x: this.x, y: this.y};        
};

/**
 * Get the size of Image object.
 * @return {Object} X and Y coordinates. 
 */
GameSprite.prototype.getSize = function() {
    if (this.image)
        return {width: this.image.width, height: this.image.height};        
};

/**
 * Draw image to screen. 
 */
GameSprite.prototype.draw = function() {
    if (this.image)
        this.context.drawImage(this.image, this.x, this.y);        
};

/**
 * GameBackground object.
 * @constructor
 * @param {string} src Image source.
 * @param {Object} canvas Context Context to the Canvas.
 * @param {integer} x X position.
 * @param {integer} y Y position.
 * @param {Object} loadCompletedCallback GameBackground load completed callback.  
 */
function GameBackground(src, context, x, y, loadCompletedCallback) {
    GameSprite.call(this, src, context, x, y, loadCompletedCallback);
};
// Generate instance of GameSprite (hence inheritance in JavaScript)
GameBackground.prototype = new GameSprite();
// Set constructor to GameSprite
GameBackground.prototype.constructor = GameBackground;

/**
 * GameFood object.
 * @constructor
 * @param {string} name Food name.
 * @param {integer} score Food eating score.
 * @param {integer} cost Food cost. 
 * @param {string} src Image source. 
 * @param {Object} canvas Context Context to the Canvas.
 * @param {integer} x X position.
 * @param {integer} y Y position.
 * @param {Object} loadCompletedCallback GameFood load completed callback.    
 */
function GameFood(name, score, cost, src, context, x, y, loadCompletedCallback) {
    this.name = name;
    this.score = score;
    this.cost = cost;
    GameSprite.call(this, src, context, x, y, loadCompletedCallback);	    
};
// Generate instance of GameSprite (hence inheritance in JavaScript)	
GameFood.prototype = new GameSprite();
// Set constructor to GameSprite
GameFood.prototype.constructor = GameFood;

/**
 * Get the score value for the Food object.
 * @return {integer} score value.
 */
GameFood.prototype.getScore = function() {
	return this.score;
};
/**
 * Get the cost value for the Food object.
 * @return {integer} cost value.  
 */
GameFood.prototype.getCost = function() {
    return this.cost;
};	