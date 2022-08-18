//
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
CANVAS_WIDTH = canvas.width = 500;
CANVAS_HEIGHT = canvas.height = 1000;
const numberOfEnemies = 30;
const enemiesArray = [];

let gameFrame = 0;

class Enemy{
	constructor(){
		this.image = new Image();
		this.image.src = 'enemy4.png';
		this.speed = Math.random()*4 + 1; 
		this.spriteWidth = 213; //this must be according to the size of each png image
		this.spriteHeight = 213;
		this.width = this.spriteWidth/2.5; //To keep aspect ratio of enemies.
		this.height = this.spriteHeight/2.5;
		this.x = Math.random() * (canvas.width - this.width); //So that enemies can appear randomly and keep enemies inside canvas
		this.y = Math.random() * (canvas.height - this.height);
		this.newX = Math.random() * canvas.width;
		this.newY = Math.random() * canvas.height;
		this.frame = 0; //To move through the frames in the png
		this.flapSpeed = Math.floor(Math.random() *3 + 1); //this will set a random flap speed for each enemy
		this.interval = Math.floor(Math.random()*200 + 50); //So that each enemy to reset at it's own randomized interval
//The interval between 3 and 4 is abitrary.
	}
	update(){ //To update movement
		if(gameFrame % this.interval === 0){ //instant position change when gameFrame is divisible through this.interval
			this.newX = Math.random() * (canvas.width - this.width); 
			this.newY = Math.random() * (canvas.height - this.height);
		}
		let dx = this.x - this.newX;
		let dy = this.y - this.newY;
		this.x -= dx/70; //to make them travel towards that position and the denomiator sets the velocity of moving
		this.y -= dy/70; //the bigger the slower.
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
