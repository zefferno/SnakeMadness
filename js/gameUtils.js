/**
 * Game utility functions
 */
var GameUtils = new function()  {
	
	/**
	 * Gets a random number in a specified range.
	 * @param {integer} min Range minimum value.
	 * @param {integer} max Range maximum value.
	 * @return {integer} Random number. 
	 */	
    this.getRandom = function(min, max) {        
        return Math.floor(Math.random() * (max - min) + min);
    };
    
    /**
	 * Gets a round number.
	 * @param {integer} number Number to be rounded.
	 * @return {integer} Rounded number. 
	 */	
    this.round = function(number) {
        return Math.round(number);
    };

    /**
	 * Create Image object
	 * @param {string} filePath Path to file location.
	 * @param {Object} onLoadCallback Callback for onLoad.
	 * @return {Object} Image object. 
	 */		     
    this.getImage = function(filePath, onLoadCallback) {
        var img = new Image();
                    
        // Set error handler
        img.onError = function() {
            callback(null);
        };
        
        // Set onload handler
        img.onload = onLoadCallback;        
        // Set data source
        img.src = filePath; 
            
        return img;        
    };
    
    /**
	 * Register event in the document event handler.
	 * @param {string} eventName Event type to be captured in document.
	 * @param {Object} functionRef Reference function to be called in case event raises. 
	 */	        
    this.registerEvent = function(eventName, functionRef) {
    	document.addEventListener(eventName, functionRef, false);
    };

    /**
	 * Unregister event in the document event handler.
	 * @param {string} eventName Event type to be captured in document.
	 * @param {Object} functionRef Reference function to be called in case event raises. 
	 */    
    this.unRegisterEvent = function(eventName, functionRef) {
    	document.removeEventListener(eventName, functionRef);
    };

    /**
	 * Increase color brightness.
	 * @param {string} hex Hex color. Only numbers! without pound.
	 * @param {integer} percent Percent of brightness.
	 * @return {string} Color in Hex string including pound. 
	 */      
	this.increaseBrightness = function(hex, percent) {
	    var r = parseInt(hex.substr(1, 2), 16),
	        g = parseInt(hex.substr(3, 2), 16),
	        b = parseInt(hex.substr(5, 2), 16);
	        
	    var color = '#' + ((0|(1<<8) + r + (256-r) * percent/100).toString(16)).substr(1) +
	                    + ((0|(1<<8) + g + (256-g) * percent/100).toString(16)).substr(1) +
	                      ((0|(1<<8) + b + (256-b) * percent/100).toString(16)).substr(1);
	    
	    return color;
	};
	
    /**
	 * Acquire context to the specified Canvas element.
	 * @param {string} canvasId ID tag of the Canvas element.
	 * @return {object} Canvas context.
	 */    
	this.acquireContext = function(canvasId) {
		var canvasElement = document.getElementById(canvasId);
		var context;
				
		if ( !(context = canvasElement.getContext('2d')) )
		     return null;
		
		return context;
	};
	
    /**
	 * Get Canvas size
	 * @param {string} canvasId ID tag of the Canvas element.
	 * @return {object} Canvas height and width.
	 */ 	
	this.getCanvasSize = function(canvasId) {
		var canvasElement = document.getElementById(canvasId);
		
		return {height: canvasElement.height, 
				width: canvasElement.width};		
	};			    
};