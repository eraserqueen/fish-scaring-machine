// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of index.html

vars = {
  speed:0,
  increment:0,
  rate:0,
  maxsize:0,
  init: function(){
    console.log("init variables");
    this.speed = parseInt($("#speed").val());
    this.increment = parseInt($("#increment").val());
    this.rate = parseFloat($("#rate").val());
    this.maxsize = parseInt($("#maxsize").val());
    this.timeout = parseInt($("#timeout").val());
    if(isNaN(this.maxsize) || this.maxsize === 0) {
      this.maxsize = Math.max(window.innerHeight, window.innerWidth);
    }
    
    console.log(this);
  }
};
mouse= {
  x:0, y:0, // relative to container
  orientation:0 // relative to circle origin
};
container= {
  elem: $("#container"),
  x:0, y:0, // top left corner
  width:0,
  height:0,
  diagonal: 0,
  init: function(elem) {
    console.log("init container");
    this.elem = elem;
    this.width = Math.min(window.innerWidth, window.innerHeight);
    this.height = this.width;
    this.diagonal = Math.sqrt(this.width*this.width*2);
    elem.css("width", this.width + "px");
    elem.css("height", this.height + "px");
    
    this.x =(window.innerWidth - this.width) /2;
    this.y =(window.innerHeight - this.height) /2;
    
    console.log("container", this);
  }
};

Circle = function (params){
	if (!(this instanceof Circle))
        return new Circle(params);
	
	console.log("Registering new circle ", params);
    this.elem = params.elem;	
	this.setOrigin(params.x, params.y);
	this.setRadius(params.r);
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

	mouse.x = xMouse - container.x;
	mouse.y = yMouse - container.y;
	mouse.orientation = mouse.x > circle.x ? 1 : -1;

	//Tangent: tan(θ) = Opposite / Adjacent
	//The inverse tangent function tan^-1 takes the ratio opposite/adjacent and gives the angle θ
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
	interval = setInterval(function(){self.loom()}, vars.speed);
};
LoomingCircle.prototype.loom = function(){
  if(this.radius < vars.maxsize) {
    // accelerate exponentially
    vars.increment = vars.increment * vars.rate ;
	this.setRadius(this.radius + vars.increment);
  } else {
	  // stop at max size
    console.log("done");
    clearInterval(interval);
	var self = this;
    setTimeout(function(){self.reset()}, vars.timeout);
  }
};

  
$(document).ready(function() {
  
  console.log('hello world :o');
  
  container.init($("#container"));
  circle = new Circle({
	  elem: $("#circle"), 
	  x:container.width/2, 
	  y:container.width/2, 
	  r:container.width/2*0.75
	  });
  point = new LoomingCircle({
	  elem:$("#point"), 
	  x:0, 
	  y:0, 
	  r:10
  });
  
  container.elem.mousemove(function(e){
    if(!point.positionSet) {
      point.setStartingPosition(e.pageX, e.pageY);
	}
  });
  
  container.elem.click(function(){
    if(point.positionSet) {
      vars.init();
	  point.startLooming();	  
	  //point.loom();
    } else {
		point.positionSet = true;
	}
  });
  
  window.oncontextmenu = function ()
  {
      if(typeof(interval)!="undefined") {
        clearInterval(interval);
      }
      point.reset();
      return false;     // cancel default menu
  };
  
  updateColor = function(picker) {
    var hex = picker.jscolor.toHEXString();
    switch(picker.id) {
      case "bgcolor":
        $("body").css("background-color", hex);
        container.elem.css("background-color", hex);
        break;
      case "circlecolor":
        circle.elem.css("background-color", hex);
        break;
      case "loomcolor":
        point.elem.css("background-color", hex);
        break;
    }
  };
});