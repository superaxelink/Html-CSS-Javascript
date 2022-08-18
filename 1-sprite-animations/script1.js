//create game square?
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 600;

const playerImage = new Image(); //constructor of image object
playerImage.src = 'shadow_dog.png';
const spriteWidth = 575; //spreadsheet "shadow_dog.png" is 6876px width with 12 columns so 6876/12 = 575
const spriteHeight = 523; //5230px and 10 rows so 5230/10=523
let frameX = 0;
let frameY = 0; 
let gameFrame = 0;
const staggerFrames = 5; //to limit speed of animation 

function animate(){
	ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
	//ctx.fillRect(50,50,100,100);
	//ctx.drawImage(image,sx,sy,sw,sh,dx,dy,dw,dh); (sx,sy,sw,sh) = determine cut out area from the original sprite.
	//                                            	(dx,dx,dw,dh) = determine where on the canvas we want to place that cut out piece of image on to.

	ctx.drawImage(playerImage,frameX*spriteWidth,frameY*spriteHeight,spriteWidth,spriteHeight,0,0,spriteWidth,spriteHeight);
	if(gameFrame % staggerFrames == 0){ //Image change will only succeed on multiples of staggerFrames.
		if(frameX < 6) frameX++;
		else frameX = 0;
	}
  //Easiest method to animate
	gameFrame++;
	requestAnimationFrame(animate); //creates an animation loop with recursion
}
animate(); 

//console.log(ctx);
