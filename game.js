x$(window).on('load',function(){
	this._targets = [];
	this._balls = [];
	this._width = 400;
	this._height = 400;
	/*
	this._objRadius = 10;
	this.x = 200;
	this.y = 10;
	this._xVel = 0;
	this._yVel = 0;
	*/
	
	this._rotation = 1;
	
	// add box targets and balls
	for(var i=0;i<5;i++){
		this._targets[i] = new target('target_'+i,Math.floor(Math.random()*400),Math.floor(Math.random()*400),40);
		this._balls[i] = new ball('ball_'+i,Math.floor(Math.random()*400),Math.floor(Math.random()*100));
		targetHtml = '<div id="target_'+i+'" class ="black"></div><div id="ball_'+i+'" class ="ball"></div>';
		x$('#container')[0].innerHTML += targetHtml;
	}
	
	// add wall targets
	this._targets.push(new target('leftWall',-400,0,400));
	this._targets.push(new target('rightWall',400,0,400));
	this._targets.push(new target('topWall',0,-400,400));
	this._targets.push(new target('bottomWall',0,400,400));
	setInterval(updateGame,1000/25);
	
	var self = this;
	
	x$('body').on('click',function(e){
		if(e.clientX<self._balls[0].x){
			self._balls[0]._xVel += 5;
		}else{
			self._balls[0]._xVel -= 5;
		}
		if(e.clientY>self._balls[0].y){
			self._balls[0]._yVel -= 10;
		}else{
			self._balls[0]._yVel += 10;
		}
	});
	
	drawTargets();
	
});
function target(id,x,y,size,width,height){
	this.id = id;
	this.x = x;
	this.y = y;
	this.height = height || size;
	this.width = width || size;
	this.size = size;
	this.checkCollision = checkCollision;
}
function ball(id,x,y){
	this.id = id;
	this._objRadius = 10;
	this.x = x;
	this.y = y;
	this.height = this._objRadius*2;
	this.width = this._objRadius*2;
	this._xVel = 0;
	this._yVel = 0;	
	this._elastic = 0.5;
	this.checkCollision = checkCollision;
}

function checkCollision(target, ball){
	var left1 = target.x;
	var right1 = target.x + target.width;
	var top1 = target.y;
	var bottom1 = target.y + target.height;
	
	var left2 = ball.x;
	var right2 = ball.x + ball.width;
	var top2 = ball.y;
	var bottom2 = ball.y + ball.height;
	
	if(bottom1 < top2 || top1 > bottom2 || right1 < left2 || left1 > right2){
	
	}else{
		console.log('target id:'+target.id);


		x$('#'+target.id).hasClass('black',function(){
			x$('#'+target.id).removeClass('black');
			x$('#'+target.id).addClass('blue');
		});
		
		var dx = ball.x+(ball.width/2) - target.x-(target.width/2); // diff on x axis
		var dy = ball.y+(ball.height/2) - target.y-(target.height/2);// diff on y axis

		if(dx >= dy) { // point is on top right half from relativeTo
			if(dx >= - dy){
				console.log('EAST');
				ball.x = target.x +target.width;
				ball._xVel = Math.abs(ball._xVel);
				ball._xVel *= ball._elastic;
			}else{
				console.log('NORTH');
				ball.y = target.y-(ball.height);
				ball._yVel = -Math.abs(ball._yVel);
				ball._yVel *= ball._elastic;
			}
		}
		else { // point is on bottom left half from relativeTo
			if(dx >= - dy){
				console.log('SOUTh');
				ball.y = target.y+target.height;
				ball._yVel = Math.abs(ball._yVel);
				ball._yVel *= ball._elastic;
			}else{ 
				console.log('WEST');
				ball.x = target.x - (ball.width);
				ball._xVel = -Math.abs(ball._xVel);
				ball._xVel *= ball._elastic;			
			}
		}
	}
}

function updateGame(){
	updateBalls();
}

function gravity(ball){
	ball._yVel += 0.25;
}

function updateBalls(){
	//scaleX = Math.cos(this._rotation);
	//scaleY = Math.sin(this._rotation);	
	for(var i=0;i<this._balls.length;i++){
		this._balls[i].x += (this._balls[i]._xVel);//*scaleX);
		this._balls[i].y += (this._balls[i]._yVel);//*scaleY);
		this._balls[i]._xVel *= 0.999;
		this._balls[i]._yVel *= 0.999;
		gravity(this._balls[i]);
		collisions(this._balls[i]);
		collisionsBalls(this._balls[i]);
		x$('#'+this._balls[i].id).setStyle("-webkit-transform","translate("+this._balls[i].x+"px, "+this._balls[i].y+"px)");
	}
}

function drawTargets(){
	for(var i=0;i<this._targets.length;i++){
		x$('#target_'+i).setStyle("-webkit-transform","translate("+this._targets[i].x+"px, "+this._targets[i].y+"px)");
	}
}

function collisions(ball){
	for(var j=0;j<this._targets.length;j++){
		this._targets[j].checkCollision(this._targets[j],ball);
	}
}

function collisionsBalls(ball){
	for(var j=0;j<this._balls.length;j++){
		if(ball.id != this._balls[j].id){
			this._balls[j].checkCollision(ball,this._balls[j]);
		}
	}
}