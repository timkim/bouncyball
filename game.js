x$(window).on('load',function(){
	this._targets = [];
	this._width = 400;
	this._height = 400;
	this._objRadius = 10;
	this.x = 200;
	this.y = 10;
	this._accel = 0;
	this._xVel = 0;
	this._yVel = 0;
	this._elastic = 0.5;
	this._rotation = 1;
	
	for(var i=0;i<5;i++){
		this._targets[i] = new target('target_'+i,Math.floor(Math.random()*400),Math.floor(Math.random()*400),40);
		targetHtml = '<div id="target_'+i+'" class ="black"></div>';
		x$('#container')[0].innerHTML += targetHtml;
	}
	setInterval(updateGame,1000/25);
	
	var self = this;
	x$('body').on('click',function(e){
		if(e.clientX<self.x){
			self._xVel += 5;
		}else{
			self._xVel -= 5;
		}
		if(e.clientY>self.y){
			self._yVel -= 10;
		}else{
			self._yVel += 10;
		}
	});
	
	drawTargets();
	
});
function target(id,x,y,size){
	this.id = id;
	this.x = x;
	this.y = y;
	this.size = size;
	this.checkCollision = checkCollision;
}

function checkCollision(that) {
	var left1 = this.x;
	var right1 = this.x + this.size;
	var top1 = this.y;
	var bottom1 = this.y + this.size;
	
	var left2 = that.x;
	var right2 = that.x + that._objRadius*2;
	var top2 = that.y;
	var bottom2 = that.y + that._objRadius*2;
	
	if(bottom1 < top2 || top1 > bottom2 || right1 < left2 || left1 > right2){
	
	}else{
		console.log('target id:'+this.id);
		var self = this;
		x$('#'+self.id).hasClass('black',function(){
			x$('#'+self.id).removeClass('black');
			x$('#'+self.id).addClass('blue');
		});
		
		var dx = that.x - this.x; // diff on x axis
		var dy = that.y - this.y; // diff on y axis

		if(dx >= dy) { // point is on top right half from relativeTo
			if(dx >= - dy){
				console.log('EAST');
				that.x = this.x +this.size;
				that._xVel = Math.abs(that._xVel);
				that._xVel *= that._elastic;
			}else{
				console.log('NORTH');
				that.y = this.y-(that._objRadius*2);
				that._yVel = -Math.abs(that._yVel);
				that._yVel *= that._elastic;
			}
		}
		else { // point is on bottom left half from relativeTo
			if(dx >= - dy){
				console.log('SOUTh');
				that.y = this.y+this.size+(that._objRadius);
				that._yVel = Math.abs(that._yVel);
				that._yVel *= that._elastic;
			}else{ 
				console.log('WEST');
				that.x = this.x - (that._objRadius*2);
				that._xVel = -Math.abs(that._xVel);
				that._xVel *= that._elastic;			
			}
		}
	}

}

function updateGame(){
	updateBall();
}

function gravity(){
	this._yVel += 0.25;
}

function collisions(){
	wallCollisions();
	targetCollision();
}

function wallCollisions(){
	// top edge
	if(this.y - this._objRadius < 0){
		this.y = 0 + this._objRadius;
		this._yVel = Math.abs(this._yVel);
		this._yVel *= this._elastic;
	}	
	// bottom edge
	if(this.y + this._objRadius > this._height){
		this.y = this._height - this._objRadius;
		this._yVel = -Math.abs(this._yVel);
		this._yVel *= this._elastic;
	}
	
	//left edge
	if(this.x - this._objRadius < 0){
		this.x = 0 + this._objRadius;
		this._xVel = Math.abs(this._xVel);
		this._xVel *= this._elastic;
	}
	
	// right edge
	if(this.x + this._objRadius > this._width){
		this.x = this._width - this._objRadius;
		this._xVel = -Math.abs(this._xVel);
		this._xVel *= this._elastic;
	}
}
function updateBall(){
	scaleX = Math.cos(this._rotation);
	scaleY = Math.sin(this._rotation);	
	this.x += (this._xVel*scaleX);
	this.y += (this._yVel*scaleY);
	this._xVel *= 0.99;
	this._yVel *= 0.99;
	gravity();
	collisions();
	x$('#ball').setStyle("-webkit-transform","translate("+this.x+"px, "+this.y+"px)");
}

function drawTargets(){
	for(var i=0;i<this._targets.length;i++){
		x$('#target_'+i).setStyle("-webkit-transform","translate("+this._targets[i].x+"px, "+this._targets[i].y+"px)");
	}
}

function targetCollision(){
	for(var i=0;i<this._targets.length;i++){
		var self = this;
		this._targets[i].checkCollision(self);
	}
}