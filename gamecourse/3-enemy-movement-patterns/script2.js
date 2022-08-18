//Repetitive displacement and veritcal senoidal movement
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
CANVAS_WIDTH = canvas.width = 500;
CANVAS_HEIGHT = canvas.height = 1000;
const numberOfEnemies = 100;
const enemiesArray = [];

let gameFrame = 0;

class Enemy{
	constructor(){
		this.image = new Image();
		this.image.src = 'enemy2.png';
		this.speed = Math.random()*4 + 1; 
		this.spriteWidth = 266; //this must be according to the size of each png image
		this.spriteHeight = 188;
		this.width = this.spriteWidth/2.5; //To keep aspect ratio of enemies.
		this.height = this.spriteHeight/2.5;
		this.x = Math.random() * (canvas.width - this.width); //So that enemies can appear randomly and keep enemies inside canvas
		this.y = Math.random() * (canvas.height - this.height);
		this.frame = 0; //To move through the frames in the png
		this.flapSpeed = Math.floor(Math.random() *3 + 1); //this will set a random flap speed for each enemy
//The interval between 3 and 4 is abitrary.
		this.angle = 0; // Indicates where in the senoidal movement the position begins.
		this.angleSpeed = Math.random()*0.2; //randomize movement of each enemy
		this.curve = Math.random()*10; //changes amplitued of senoidal movement
	}
	update(){ //To update movement
//		this.x += this.speed;
//		this.y += this.speed;
		this.x -= this.speed; //this seems similar to brownian movement
		this.y += this.curve*Math.sin(this.angle); 
		this.angle += this.angleSpeed; //And so we randomize movement and position of each enemy 
		if(this.x + this.width < 0) this.x = canvas.width; //this checks the position of the object so
//that when the enemy leaves the canvas from the left, its position is reseted to the right.
		this.y += Math.random() * 10 - 5; //AND LIMITS THE RANGE OF MOVEMENT
		//animate sprites
		if(gameFrame% this.flapSpeed === 0){ // to reduce animation speed
			this.frame > 4 ? this.frame = 0 : this.frame++; //We have 6 frames going from 0 to 5 so when this.frame is bigger than 4 
//we go back to zero otherwise keep adding 1.
		}
	}
	draw(){
//		ctx.strokeRect(this.x,this.y,this.width,this.height);
		ctx.drawImage(this.image, this.frame*this.spriteWidth, 0, this.spriteWidth, this.spriteHeight,this.x, this.y, this.width, this.height);
	}
};

for(let i = 0; i < numberOfEnemies; i++){
	enemiesArray.push(new Enemy());
}

//console.log(enemiesArray); //to check the data of the enemies created
function animate(){
	ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
	enemiesArray.forEach(enemy => {
		enemy.update();
		enemy.draw();
	})
	gameFrame++;
	requestAnimationFrame(animate);
}

animate();
