const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth; 
canvas.height = window.innerHeight; 
const collisionCanvas = document.getElementById('collisionCanvas');//second canvas to avoid tainted canvas error
const collisionCtx = collisionCanvas.getContext('2d');
collisionCanvas.width = window.innerWidth; 
collisionCanvas.height = window.innerHeight; 


let score = 0;
let gameOver = false;
ctx.font = '50px Impact';

let timeToNextRaven = 0; //will acumulate milisecond values between frames until it reaches interval value and trigger next frame
let ravenInterval = 500; //interval value
let lastTime = 0; //this will hold value of the timestamp from the previous loop

let ravens = [];

class Raven{
	constructor(){
		this.spriteWidth = 271; //size of each sprite of the animation png/jpg or whatever the format image it is
		this.spriteHeight = 194;
		this.sizeModifier = Math.random() * 0.6 + 0.4; //to make ravens of a set of random sizes
		this.width = this.spriteWidth * this.sizeModifier;
		this.height = this.spriteHeight * this.sizeModifier;//to keep aspect ratio.
		this.x = canvas.width;
		this.y = Math.random()*(canvas.height - this.height); //offset in order to avoid ravens to be out of the screen
		this.directionX = Math.random()*3 + 2; //speed of movement of the ravens
		this.directionY = Math.random()*5 - 2.5; //random speed of movement of each crow
		this.markedForDeletion = false; //check if a crow should be deleted
		this.image = new Image(); // image for the animation
		this.image.src = 'raven.png';
		this.frame = 0; //frame counter
		this.maxFrame = 4; //mas number of frames for the sprites (depends on how many sprites the animation has)
		this.timeSinceFlap = 0; //counts until a threshold to activate the next animation
		this.flapInterval = Math.random() * 50 + 50; //threshold to activate the next animation. Randomize to make some crows faster than others.
		this.randomColors = [Math.floor(Math.random()*255), Math.floor(Math.random()*255), Math.floor(Math.random()*255)];//to create a color with [r,g,b] property
		this.color = 'rgb(' + this.randomColors[0] + ',' + this.randomColors[1] + ',' + this.randomColors[2] + ')'; //this will store the color created with the rgb property in randomColors. 
		this.hasTrail = Math.random() > 0.5; //because its computationaly expensive to have particles only half of them will have it.
	}
	update(deltatime){
		if(this.y < 0 || this.y > canvas.height - this.height){//so that the ravens bounce when reach top of bottom of the game area(canvas)
			this.directionY = this.directionY*(-1);
		}
		this.x -= this.directionX;
		this.y += this.directionY;
		if(this.x < 0 - this.width) this.markedForDeletion = true;//if raven is out of animation view then delete it
		this.timeSinceFlap += deltatime; //here we update our counter for trigger the next animation. 
		if(this.timeSinceFlap >	this.flapInterval){ //Conditional for trigger the next animation. This unifies animation speed between slow and fast pcs.
			if(this.frame > this.maxFrame) this.frame = 0; //Conditional for counting and reset frames in each animation.
			else this.frame++; 
			this.timeSinceFlap = 0; //we reset timeSinceFlap back to zero so it can start counting again when to serve the next frame.
			if(this.hasTrail){ //here we draw the particles if the condition to draw them it's true.
				for(let i = 0; i<5; i++){ //we draw 5 particles each time instead of just 1
					particles.push(new Particle(this.x, this.y, this.width, this.color));//to draw the circular particles for each particular raven, storing them inside the particles array.
				}
			}
		}		 
		if(this.x<0 - this.width) gameOver = true; //if a crow passes to the left of the screen the game will be over.
	}
	draw(){
		collisionCtx.fillStyle = this.color; //color of the hitbox
		collisionCtx.fillRect(this.x, this.y, this.width, this.height); //creates a hitbox based on the color on randomly chosen in this.color. Colors serves
//as a password for each raven. We use collisionCtx to avoid tainted canvas error when scanning the image color.
		ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);//draws the sprite in each frame
	}
}

let explosions = [];
class Explosion{
	constructor(x,y,size){
		this.image = new Image();
		this.image.src = 'boom.png';
		this.spriteWidth = 200;
		this.spriteHeight = 179;
		this.size = size;
		this.x = x;
		this.y = y;
		this.frame = 0;
		this.sound = new Audio();	
		this.sound.src = 'f-i.wav'
		this.timeSinceLastFrame = 0;
		this.frameInterval = 200;
		this.markedForDeletion = false;
	}
	update(deltatime){
		if(this.frame === 0) this.sound.play();
		this.timeSinceLastFrame += deltatime;
		if(this.timeSinceLastFrame > this.frameInterval){ //this only affects the first frame and the rest of the animation play really fast
			this.frame++;
			this.timeSinceLastFrame = 0;//so we reset this value in order to count to the next time interval over and over again to serve next frames
			if(this.frame>5) this.markedForDeletion = true;
		}
	}
	draw(){
		ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y - this.size/4, this.size, this.size);//offset by size/4 in order to center animation
	}
}

let particles = []; //to store particle objects
class Particle{
	constructor(x, y, size, color){
		this.size = size;//to make radius of particle circles relative of the size of each raven
		this.x = x + this.size*0.5 + Math.random() * 50 - 25;//to randomize a little the position of the particles.
		this.y = y + this.size*0.33333333333 + Math.random() * 50 - 25;
		this.radius = Math.random() * this.size/10;//circles will grow to max radius
		this.maxRadius = Math.random() * 20 + 35;
		this.markedForDeletion = false;
		this.speedX = Math.random() * 1 + 0.5;
		this.color = color;
	}
	update(){
		this.x += this.speedX;
		this.radius += 0.2;
		if(this.radius > this.maxRadius - 5) this.markedForDeletion = true;
	}
	draw(){
		ctx.save();//save() will store previous setting of canvas allowing us to modify only the desired particular particle with the following statements.
		ctx.globalAlpha = 1 - this.radius/this.maxRadius; //maximum value of alpha between quotient between radius and maxradius so as 
// the circles grows it will become more and more transparent until it's zero or fully transparent(invisible).
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();//with restore() we revert canvas settings back to what they were at the previous save() statement.
	}
}

function drawScore(){
	
	ctx.fillStyle = 'black';
	ctx.fillText('Score: ' + score, 50, 75); //two drawns almost overdrawn to make it look as it has a shadow.	
	ctx.fillStyle = 'white';//score color
	ctx.fillText('Score: ' + score, 55, 80); //what will the score size and where the score will be drawn
}

function drawGameOver(){
	ctx.textAlign = 'center'; //to center the text
	ctx.fillStyle = 'black';
	ctx.fillText('GAME OVER, your score is ' + score, canvas.width * 0.5, canvas.height * 0.5); //two drawns almost overdrawn to make it look as it has a shadow.	
	ctx.fillStyle = 'white';//score color
	ctx.fillText('GAME OVER, your score is ' + score, canvas.width * 0.5 + 5, canvas.height * 0.5 + 5); //what will the score size and where the score will be drawn
}


window.addEventListener('click',function(e){
	const detectPixelColor = collisionCtx.getImageData(e.x, e.y,	1, 1);//coordinates of the pixel clicked e.x and e.y and only want 1 pixel so width and height is 1 pixel
	console.log(detectPixelColor);
	const pc = detectPixelColor.data;
	ravens.forEach(object => {//to detect if we've clicked on some raven
		if(object.randomColors[0] === pc[0] && object.randomColors[1] === pc[1] && object.randomColors[2] === pc[2]){
			object.markedForDeletion = true;
			score++;
			explosions.push(new Explosion(object.x, object.y, object.width));
		}
	});
})

function animate(timestamp){ //timestamps will help to compare how many miliseconds elapsed since the last loop and only when we reach certain
//amount of time between frames only then we will draw the next frame. This is done in order to timings in game are consistent and based on time
//in miliseconds rather than on the power of the computer and its hability to serve frames at acertain speed. This way we can create new raves
//preiodically and be sure that periodic event is triggered at the same interval and fast and slow pc's.
//timestamp it's a default javascript behavior when using request animation frame which will pass automatically each time the callback function 
//is called. 
	ctx.clearRect(0,0,canvas.width,canvas.height);
	collisionCtx.clearRect(0,0,canvas.width,canvas.height); //to clear collision rectangle
	let deltatime = timestamp - lastTime;
	lastTime = timestamp;
	timeToNextRaven += deltatime;
	if (timeToNextRaven > ravenInterval){ //slower computers have larger deltatimes than faster computers so ones take longer steps while the others
//take smaller steps more constantly so both will reach the ravenInterval at the same time. (presumably).
		ravens.push(new Raven());
		timeToNextRaven = 0;
		ravens.sort(function(a,b){ //we do this in order to make smalller ravens be behind bigger ravens to give a sense of depht
			return a.width - b.width; //so we sort the elements in the ravens array in ascending order because those will have smaller width.
		}); //The sort will be done in a provided check and call back function (function(a, b)). So it will compare width of every element on the  
	}; //array against the width of every other element in the array to do the sort.
	drawScore();//score behind ravens so it's called before ravens.
	[...particles,...ravens, ...explosions].forEach(object => object.update(deltatime)); //the notation [...array] allows us to spread iterable such as the array could be exapanded into another array.
	[...particles,...ravens, ...explosions].forEach(object => object.draw());
	ravens = ravens.filter(object => !object.markedForDeletion) //filter creates a new array with all elements that passed the test implemented by
//provided function. (if false then the raven should not be deleted and then evaluates to true and this is passed to the new array )
	explosions = explosions.filter(object => !object.markedForDeletion)
	particles = particles.filter(object => !object.markedForDeletion)
	if (!gameOver) requestAnimationFrame(animate); //keep animation until gameOver condition is true	
	else drawGameOver();
}

animate(0); //we need to initialize timestamps because timestamp gets created on the second loop.
console.log("width:",canvas.width,"height:",window.innerHeight);
