//easiest way of moving pattern on an enemy
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
		this.image.src = 'enemy1.png';
		//this.speed = Math.random()*4 -2 ; 
		this.spriteWidth = 293; //this must be according to the size of each png image
		this.spriteHeight = 155;
		this.width = this.spriteWidth/2.5; //To keep aspect ratio of enemies.
		this.height = this.spriteHeight/2.5;
		this.x = Math.random() * (canvas.width - this.width); //So that enemies can appear randomly and keep enemies inside canvas
		this.y = Math.random() * (canvas.height - this.height);
		this.frame = 0; //To move through the frames in the png
		this.flapSpeed = Math.floor(Math.random() *3 + 1); //this will set a random flap speed for each enemy
//The interval between 3 and 4 is abitrary.
	}
	update(){ //To update movement
//		this.x += this.speed;
//		this.y += this.speed;
		this.x += Math.random() * 15 - 7.5; //this seems similar to brownian movement
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
