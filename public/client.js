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
  
$(document).ready(function() {
  
  console.log('hello world :o');
  
  container = new FullscreenRectangle({	elem:$("#container") });
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