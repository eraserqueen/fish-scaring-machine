/*
* Base class: Circle
*/
Circle = function (params){
	if (!(this instanceof Circle))
        return new Circle(params);
	
	console.log("Registering new circle ", params);
  this.elem = params.elem;	
	this.setOrigin(params.x, params.y);
	this.setRadius(params.r);
	if( typeof(params.color)!="undefined") {
	  this.elem.css("background-color", "#"+params.color);
	}
}
Circle.prototype.setOrigin = function(x,y) {
	this.x = x;
	this.y = y;
	this.elem.css("top", (y-this.radius)+"px");
	this.elem.css("left", (x-this.radius)+"px");
};
Circle.prototype.setRadius = function(r){
	this.radius = r;
	this.elem.css("width", r*2+"px");
	this.elem.css("height", r*2+"px");
	this.setOrigin(this.x, this.y);
};
	
/*
* extended class: LoomingCircle
*/
LoomingCircle = function(params){
	Circle.call(this, params);
	this.positionSet = false;
};
LoomingCircle.prototype = Object.create(Circle.prototype);
LoomingCircle.prototype.constructor = LoomingCircle;
LoomingCircle.prototype.reset = function() {
	this.setOrigin(circle.x, circle.y);
	this.setRadius(10);
	this.positionSet = false;
};
LoomingCircle.prototype.setStartingPosition = function(xMouse, yMouse){
	this.reset();

	var mouse = {};
	mouse.x = xMouse - container.x;
	mouse.y = yMouse - container.y;
	mouse.orientation = mouse.x > circle.x ? 1 : -1;

	//Tangent: tan(?) = Opposite / Adjacent
	//The inverse tangent function tan^-1 takes the ratio opposite/adjacent and gives the angle ?
	var angle = Math.atan((circle.y - mouse.y) / (circle.x - mouse.x));
	// The parametric equation for a circle is
	// x = cx + r * cos(a)
	// y = cy + r * sin(a)
	// Where r is the radius, cx,cy the origin, and a the angle (in radians).
	var x = circle.x + (circle.radius * Math.cos(angle) * mouse.orientation);
	var y = circle.y + (circle.radius * Math.sin(angle) * mouse.orientation);

	this.setOrigin(x,y);
};

LoomingCircle.prototype.startLooming = function(){
	var self = this;
	interval = setInterval(function(){self.loom()}, params.speed);
};
LoomingCircle.prototype.loom = function(){
  if(this.radius < params.maxsize) {
    // accelerate exponentially
    params.increment = params.increment * params.rate ;
	this.setRadius(this.radius + params.increment);
  } else {
	  // stop at max size
    console.log("done");
    clearInterval(interval);
	var self = this;
    setTimeout(function(){self.reset()}, params.timeout);
  }
};

/*
* Base class: Rectangle
*/
Rectangle = function(params){
	if (!(this instanceof Rectangle))
        return new Rectangle(params);
	
	console.log("Registering new rectangle",params);
	
	this.elem = params.elem;
	this.width = params.width;
	this.height = params.height;
	this.diagonal = Math.sqrt(this.width*this.width*2);  
    this.elem.css("width", this.width + "px");
    this.elem.css("height", this.height + "px");
	
	if(!isNaN(params.x) && !isNaN(params.y)) {
		this.x = params.x;
		this.y = params.y;
		this.elem.css("top", this.y + "px");
		this.elem.css("left", this.x + "px");
	} else {
		this.x = 0;
		this.y = 0;
	}
	console.log(this);
};
/*
* extended class: FullscreenRectangle
*/
FullscreenRectangle = function(params) {
	this.elem = params.elem;
	params.width = Math.min(window.innerWidth, window.innerHeight);
	params.height = params.width;
	
	// init Rectangle without x,y params to enable margin:auto centering
	Rectangle.call(this, params);
	
	// set x,y for future lookup
    this.x =(window.innerWidth - params.width) /2;
    this.y =(window.innerHeight - params.height) /2;
};

FullscreenRectangle.prototype = Object.create(Rectangle.prototype);
FullscreenRectangle.prototype.constructor = Rectangle;