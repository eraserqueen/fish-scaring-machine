// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of index.html

$(document).ready(function() {
  
  console.log('hello world :o');
  
  vars.init();
  container.init($("#container"));
  circle.init($("#circle"));
  point.init($("#point"));

  $(".clickable").click(function(e){
    if(corner == null || corner != this.id) {
      console.log("reset position");
      vars.init();
      setStartingPosition(e.pageX, e.pageY);
      corner = this.id;
    } else {
      console.log("start looming");
      startLooming();
      corner = null;
    }
  });
  
  $("#point").click(function(){
    point.reset();
  });
});

corner = null;
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
  absolute: {x:0,y:0}, //relative to window
  relative: {x:0, y:0}, // relative to container
  orientation:0 // relative to circle origin
};
container= {
  elem: $("#container"),
  anchor: {x:0, y:0},
  width:0,
  height:0,
  diagonal: 0,
  init: function(elem) {
    console.log("init container to be as big as possible");
    this.elem = elem;
    this.width = Math.min(window.innerWidth, window.innerHeight);
    this.height = this.width;
    this.diagonal = Math.sqrt(this.width*this.width*2);
    elem.css("width", this.width + "px");
    elem.css("height", this.height + "px");
    console.log("margins", parseInt($("#container").css("margin")));
    this.anchor = {
      x: (window.innerWidth - this.width) /2, 
      y: (window.innerHeight - this.height) /2
    };
    console.log("container", this);
  }
};
circle= {
  elem: $("#circle"),
  origin: { x:0, y:0 }, // relative to container
  anchor: { x:0, y:0 }, // relative to container
  radius:0,
  init: function(elem){
    console.log("init circle to be smaller than container");
    this.elem = elem;
    this.radius = Math.round((container.diagonal*0.55) / 2);
    var offset = container.width/2 - this.radius;
    this.anchor = {x: offset, y:offset};
    this.origin = {x: this.radius + offset, y: this.radius + offset};
    elem.css("width", this.radius*2+"px");
    elem.css("height", this.radius*2+"px");
    elem.css("top", this.anchor.x+"px");
    elem.css("left", this.anchor.y+"px");
    console.log("circle", this);
    
    console.log("init clickable corners");
    $(".clickable").css("width", this.origin.x +"px");
    $(".clickable").css("height", this.origin.y +"px");
    $(".right").css("left", this.origin.x +"px");
    $(".bottom").css("top", this.origin.y +"px");
  }
};
point= {
  elem:null,
  origin: { x:0, y:0 }, // relative to container
  anchor: { x:0, y:0 }, // relative to container
  radius:0,
  init: function(elem){
    console.log("init point");
    this.elem = elem;
    this.radius = parseInt(elem.css("width"))/2; 
    this.anchor.x = parseInt(elem.css("left"));
    this.anchor.y = parseInt(elem.css("top"));
    this.origin.x = this.anchor.x - this.radius;
    this.origin.y = this.anchor.y - this.radius;
  },
  setOrigin: function(x,y){
    this.origin.x = x ;
    this.origin.y = y ;
    this.setAnchor();
  },
  setAnchor: function(){
    this.anchor.x = this.origin.x - this.radius;
    this.anchor.y = this.origin.y - this.radius;
    this.elem.css("left", this.anchor.x + "px");
    this.elem.css("top", this.anchor.y + "px");
  },
  setRadius: function(r){
    this.radius = r;
    this.elem.css("width", this.radius*2 + "px");
    this.elem.css("height", this.radius*2 + "px");
    point.setAnchor();
  },
  reset: function() {
    this.setOrigin(0,0);
    this.setRadius(0);
  }
};


setStartingPosition= function(xMouse, yMouse){
  console.log("set starting position");
  point.reset();
  
  mouse.absolute = {x: xMouse, y:yMouse};
  mouse.relative = {x: xMouse - container.anchor.x, y: yMouse - container.anchor.y};
  mouse.orientation = mouse.relative.x > circle.origin.x ? 1 : -1;
  console.log(mouse, container, circle);
  
  //Tangent: tan(θ) = Opposite / Adjacent
  //The inverse tangent function tan^-1 takes the ratio opposite/adjacent and gives the angle θ
  var angle = Math.atan((circle.origin.y - mouse.relative.y) / (circle.origin.x - mouse.relative.x));
  // The parametric equation for a circle is
  // x = cx + r * cos(a)
  // y = cy + r * sin(a)
  // Where r is the radius, cx,cy the origin, and a the angle (in radians).
  var x = circle.origin.x + (circle.radius * Math.cos(angle) * mouse.orientation);
  var y = circle.origin.y + (circle.radius * Math.sin(angle) * mouse.orientation);
  console.log("placing point at:",x,",",y);
  
  point.setOrigin(x,y);
  point.setRadius(10);
};

loom = function(){
  point.setRadius(point.radius + vars.increment);
  if(point.radius > vars.maxsize) {
    console.log("done");
    clearInterval(interval);
    setTimeout(function(){point.reset()}, vars.timeout);
  } else {
    // accelerate exponentially
    vars.increment = vars.increment * vars.rate ;
  }
};

startLooming = function() {
  interval = setInterval(loom, vars.speed);
};
  
  