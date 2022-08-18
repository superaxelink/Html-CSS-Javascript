const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 700;
const explosions = [];
let canvasPosition = canvas.getBoundingClientRect(); //returns an object provided information about the size of an element and its
//position relative to the viewport 
//console.log(canvasPosition);//and with console log canvasPosition we can get information to measure an html element on the page which
//is usefull to offset something

class Explosion{
	constructor(x,y){
		this.spriteWidth = 200; //size of the image
		this.spriteHeight = 179;
		this.width = this.spriteWidth*0.7; //scaling the image
		this.height = this.spriteHeight*0.7;
		this.x=x; //offset to center the animation
		this.y=y;
		this.image = new Image();
		this.image.src = 'boom.png';
		this.frame = 0; //to move through the sprite image
		this.timer = 0; //to slow the animation
		this.angle = Math.random() * 6.2; //angle to rotate randomly each animation  
		this.sound = new Audio(); // add sound to animation
		this.sound.src = 'boom.wav' 
	}
	update(){
		if (this.frame === 0) this.sound.play(); //play the sound once per animation
		this.timer++;
		if(this.timer%10 == 0){
			this.frame++;
		};
	}
	draw(){
		//to rotate anything on canvas
		ctx.save(); //save current state of canvas to be sure the following changes affect only one draw call
		ctx.translate(this.x, this.y); //Translate rotation center point on top of my current object I want to rotate.
//translates from the corner of the canvas to x and y positions so we doesn't need them anymore
//in the drawImage position otherwise we would have an offset.
		ctx.rotate(this.angle); //rotate the entire canvas context by an angle value
		ctx.drawImage(this.image, this.spriteWidth * this.frame, 0,this.spriteWidth,this.spriteHeight, 0 - this.width*0.5, 0 - this.height*0.5, this.width, this.height); //draw our image
		ctx.restore();	//restore canvas context to the original save point to make sure this translate and rotate only affects one drawcall of one 
//object
	}
}

window.addEventListener('click', function(e){
	createAnimation(e);
});
/*window.addEventListener('mousemove', function(e){
	createAnimation(e);
});*/

function createAnimation(e){
	//console.log(e)//this gives us information about current click event so we can now the properties i need to know
	let positionX = e.x - canvasPosition.left;
	let positionY = e.y - canvasPosition.top;
	explosions.push(new Explosion(positionX,positionY));
	//console.log(explosions) //we need that every time we create an object it's stored even if it stopped being animated so we need a way
	//to delete the ones who are stopped being animated.
/*	ctx.fillStyle = 'white';
	ctx.fillRect(e.x - canvasPosition.left - 25, e.y - canvasPosition.top - 25,50,50); //here we offset the viewport and the canvas position in order to*/
//get that the rectangles appear in the position where the mouse clicks. The final offset corresponds of half the length and width of the rectangle in horizontal and vertical positions this way when the mouse clicks rectangle appears exactly in the middle.
}

function animate(){
	ctx.clearRect(0,0,canvas.width,canvas.height);
	for(let i=0; i < explosions.length; i++){
		explosions[i].update();
		explosions[i].draw();
		if(explosions[i].frame>5){ //if frame is bigger than 5 then animation has been completed.
			explosions.splice(i,1); //index of object to remove and number of objects to be removed.
			i--;//Next object needs to be correctly updated and animated after removing it's neighbor we need to adjust index by -1;
		}
	}
	requestAnimationFrame(animate);
};
animate();
