var Move = function(elem, range){
	this.elem = elem;
	this.range = range;

	this.toLeft = function(){ this.elem.scrollLeft -= this.range; };
	this.toRight = function(){ this.elem.scrollLeft += this.range; };
	this.toUp = function(){ this.elem.scrollTop -= this.range; };
	this.toDown = function(){ this.elem.scrollTop += this.range; };
};

var m = null;

m = new Move(document.getElementById('preview_area'), 200);
	
document.getElementById('toLeft').onclick = function(){ m.toLeft(); }
document.getElementById('toRight').onclick = function(){ m.toRight(); }	