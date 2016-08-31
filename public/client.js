// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of index.html

params = {
  list: ["speed", "increment", "rate", "maxsize", "timeout"],
  getValuesFromFields: function(){
    console.log("init params");
    for(var p in this.list) {
      var field = this.list[p];
      this[field] = parseFloat($("#"+field).val());
    }
    if(isNaN(this.maxsize) || this.maxsize === 0) {
      this.maxsize = Math.max(window.innerHeight, window.innerWidth);
    }
    console.log(this);
  }
};
  
updateColor = function(picker) {
  var hex;
  if(typeof(picker.jscolor) == "undefined") {
    hex = "#"+picker.val();
  } else {
    hex = picker.jscolor.toHEXString();
  }
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
$(document).ready(function() {
  
  // register shapes
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
  
  // update colors from saved params
  updateColor($("#bgcolor")[0]);
  updateColor($("#circlecolor")[0]);
  updateColor($("#loomcolor")[0]);
  
  // define behavior
  container.elem.mousemove(function(e){
    if(!point.positionSet) {
      point.setStartingPosition(e.pageX, e.pageY);
	}
  });
  
  container.elem.click(function(){
    if(point.positionSet) {
      params.getValuesFromFields();
  	  point.startLooming();	  
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
  
});