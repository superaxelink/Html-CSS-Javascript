let playerState = 'idle';
const dropdown = document.getElementById('animations'); //checks for the element clicked in the html animation selection option menu
dropdown.addEventListener('change',function(e){//I listen for a change event. Every time it's value changes 
//we will take playerState and since we are inside a callback function on event listener we have access to event object (e)
//Event object e has a target property(just refering to an element that was clicked) and it has a
	playerState = e.target.value; //value property which refers to the values I added in the index.html selection option menu element.
})

//create game square?
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 600;

const playerImage = new Image(); //constructor of image object
playerImage.src = 'shadow_dog.png';
const spriteWidth = 575; //spreadsheet "shadow_dog.png" is 6876px width with 12 columns so 6876/12 = 575
const spriteHeight = 523; //5230px and 10 rows so 5230/10=523

let gameFrame = 0;
const staggerFrames = 5; //to limit speed of animation 
const spriteAnimations = [];
const animationStates = [
	{
		name: 'idle',
		frames: 7,
	},
	{
		name: 'jump',
		frames: 7,
	},
	{
		name: 'fall',
		frames: 7,
	},
	{
		name: 'run',
		frames: 9,
	},
	{
		name: 'dizzy',
		frames: 11,
	},
	{
		name: 'sit',
		frames: 5,
	},
	{
		name: 'roll',
		frames: 7,
	},
	{
		name: 'bite',
		frames: 7,
	},
	{
		name: 'ko',
		frames: 12,
	},
	{
		name: 'getHit',
		frames: 4,
	}
];
animationStates.forEach((state,index) => {
		let frames ={
			loc: [],
		}
		for(let j=0; j < state.frames; j++){ //loop through position frames
			let positionX =  j*spriteWidth; //keeps going current animation
			let positionY = index * spriteHeight;	//change of animation
			frames.loc.push({x: positionX, y: positionY}); //object inserted into loc array
		}
		spriteAnimations[state.name] = frames; //This array is filed with the objects that contains x and y properties for each animation(idle, jump, etc.).
});
console.log(spriteAnimations);

function animate(){
	ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
	let position = Math.floor(gameFrame/staggerFrames) % spriteAnimations[playerState].loc.length; // Slows animation because quotient inside floor function only changes each staggerFrames times. And when it reaches the exterior modulus number then reestarts.
	let frameX = spriteWidth * position; 
	let frameY = spriteAnimations[playerState].loc[position].y;
	//ctx.drawImage(image,sx,sy,sw,sh,dx,dy,dw,dh); (sx,sy,sw,sh) = determine cut out area from the original sprite.
	//                                            	(dx,dx,dw,dh) = determine where on the canvas we want to place that cut out piece of image on to.
	ctx.drawImage(playerImage,frameX,frameY,spriteWidth,spriteHeight,0,0,spriteWidth,spriteHeight);
	gameFrame++;
	requestAnimationFrame(animate); //creates an animation loop with recursion
}
animate(); 
