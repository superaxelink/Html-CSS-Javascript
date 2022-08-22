window.addEventListener('load',function(){
	const canvas = document.getElementById('canvas1');
	const ctx = canvas.getContext('2d');
	canvas.width = 1500;
	canvas.height	= 720;
	let enemies = [];
	let score = 0;
	let gameOver = false;

	class InputHandler{ //Will apply event listeners to keyboard events and it will hold an array of all currently active keys
		constructor(){
			this.keys = [];//to add and remove keys	from it as they are being pressed and released
//We use arrow function because event listener is called from window 	object and by the time event listener is called javascript forgot that "this.keyword" refers to "this.InputHandler" object and it's "this.key property". To make sure "this.keyword" points to the current object javascript bind method can be used or we can use es6ro function. Arrow function don't bind their own "this" but they inherit the one from their parent scope. This is called lexical scoping. Doing that will make sure javascript doesn't forget which object "this.keyword" stands for.
			window.addEventListener('keydown', e => {
				if((e.key === 'ArrowDown' ||
					 e.key === 'ArrowUp'   ||
					 e.key === 'ArrowLeft' ||
					 e.key === 'ArrowRight')
					 && this.keys.indexOf(e.key) === -1){ //this.keys.indexOf(thing) === -1 means that the object it's not into the array.
					this.keys.push(e.key);//add it
				}
			});
			window.addEventListener('keyup',e => {
				if(e.key === 'ArrowDown' ||
					 e.key === 'ArrowUp'   ||
					 e.key === 'ArrowLeft' ||
					 e.key === 'ArrowRight'){
					this.keys.splice(this.keys.indexOf(e.key),1); 
				}
			});
		}
	}

	class Player{ //Will react to these keys as they are being pressed drawing and updating the player
		constructor(gameWidth,gameHeight){
			this.gameWidth = gameWidth;
			this.gameHeight = gameHeight;
			this.width = 200;
			this.height = 200;
			this.x = 0;
			this.y = this.gameHeight - this.height;
			this.image = document.getElementById('playerImage');
			this.frameX = 0;
			this.maxFrame = 8;
			this.frameY = 0;
			this.fps = 20; //frames per second of player(how fast we swap between animation frames)
			this.frameTimer = 0;//counter from 0 to frame interval over and over
			this.frameInterval = 1000/this.fps; //how many miliseconds each frame lasts
			this.speed = 0;
			this.vy = 0;
			this.weight = 1;//how fast it will fall
		}
		draw(context){
			context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
		}
		update(input, deltaTime,enemies){//to connect keyboard inputs to player movement update method will expect input as an argument 
			//collision detection
			enemies.forEach(enemy => { //check's circular collision detection with pythagorean theorem between circles
				const dx = (enemy.x + enemy.width/2) - (this.x + this.width/2);
				const dy = (enemy.y + enemy.height/2) - (this.y + this.height/2);
				const distance = Math.sqrt(dx*dx + dy*dy);
				if(distance < enemy.width/2 + this.width/2){ //if distances is less than the sum of radius then collision produces
					gameOver = true; //and the game is over
				}
			});
			//sprite animation
			if(this.frameTimer > this.frameInterval){ //if we reached the threshold to do the next animation
				if(this.frameX >= this.maxFrame) this.frameX = 0; //(To complete the running animation)If the number of frames of the animation has been reached then reset counting
				else this.frameX++; //Otherwise keep running animation counter
				this.frameTimer = 0; //restart counter of animation
			}else {
				this.frameTimer += deltaTime;
			}
			//controls
			if(input.keys.indexOf('ArrowRight') >-1){
				this.speed = 5; 
			} else if(input.keys.indexOf('ArrowLeft') >-1){
				this.speed = -5;
			}else if(input.keys.indexOf('ArrowUp') > -1 && this.onGround()){// apply vertical speed only if arrowup is pressed and if player is on ground
				this.vy -= 32; //vertical jump speed
			}else{
				this.speed = 0;
			}
			//horizontal movement
			this.x += this.speed;
			if(this.x < 0) this.x=0;
			else if(this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width;
			//vertical movement
			this.y += this.vy;	
			if(!this.onGround()){ //apply force vertical down speed only when player is not on ground
				this.vy += this.weight; //falling speed
				this.maxFrame = 5; //swap to jumping animation
				this.frameY = 1; //Frame of animation on air 
			} else {
				this.vy = 0; //if it's on ground set vertical speed back to zero
				this.maxFrame = 8; //swap to running animation
				this.frameY = 0; //frame of animation on ground
			}
			if(this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height;
		}
		onGround(){
			return this.y >= this.gameHeight - this.height; //condition to check if player is on ground or not 
		}
	}

	class Background{//To handle endless scrolling backgrounds
		constructor(gameWidth, gameHeight){
			this.gameWidth = gameWidth;
			this.gameHeight = gameHeight;
			this.image = document.getElementById('backgroundImage');
			this.x = 0;
			this.y = 0;
			this.width = 2400;
			this.height = 720; //number of pixels of width and height of the image
			this.speed = 7; //horizontal coordinate of the background
		}
		draw(context){//context as an argument to specify on which canvas I want to draw on
			context.drawImage(this.image,this.x, this.y, this.width, this.height); //first scrooling background
			context.drawImage(this.image,this.x + this.width - this.speed , this.y, this.width, this.height); //second scrooling background to fill the gap as the first image reset
			//accounting for horizontal speed in the second image help us to avoid little gaps between images
		}
		update(){
			this.x -= this.speed;
			if(this.x < 0 - this.width) this.x = 0; //condition to reestart image
		}		
	}

	class Enemy{//to generate enemies
		constructor(gameWidth,gameHeight){
			this.gameWidth = gameWidth; 
			this.gameHeight = gameHeight; //width and height of canvas context 
			this.width = 160; 
			this.height = 119; //width and height of enemy
			this.image = document.getElementById('enemyImage'); //enemy source
			this.x = this.gameWidth; 
			this.y = this.gameHeight - this.height; //horizontal and vertical coordinates of enemy
			this.frameX = 0; //to account which frame are we animating
			this.maxFrame = 5;
			this.frameY = 0;
			this.fps = 20; //frames per second of each individual enemy(how fast we swap between animation frames)
			this.frameTimer = 0;//counter from 0 to frame interval over and over
			this.frameInterval = 1000/this.fps; //how many miliseconds each frame lasts
			this.speed = 8;
			this.markedForDeletion = false;
		}
		draw(context){
			context.drawImage(this.image, this.frameX*this.width, 0, this.width, this.height,this.x, this.y, this.width, this.height);
		}
		update(deltaTime){ //deltaTime will help us to keep track of hwo many miliseconds passed between individual calls
			if(this.frameTimer > this.frameInterval){// limits the frame animation speed for each enemy
				if(this.frameX >= this.maxFrame) this.frameX = 0;
				else this.frameX++;
				this.frameTimer = 0;
			}else{
				this.frameTimer += deltaTime;//keeps counting unitl it reaches the threshold
			}
			this.x -= this.speed;
			if(this.x < 0 - this.width){
				this.markedForDeletion = true;
				score++; // counts score each we avoid an enemy and goes out of screen
			}
		}
	}
//	enemies.push(new Enemy(canvas.width,canvas.height));
	function handleEnemies(deltaTime){//to handle, add, animate and remove enemies
		if(enemyTimer > enemyInterval + randomEnemyInterval){//if we passed the threshold
			enemies.push(new Enemy(canvas.width, canvas.height)); 
			console.log(enemies);
			enemyTimer = 0; //add new enemy and restart counting
		}else{
			enemyTimer += deltaTime; //otherwise keep counting
		}
		enemies.forEach(enemy => { //draw and update each enemy from the enemies array
			enemy.draw(ctx);
			enemy.update(deltaTime);
		});
		enemies = enemies.filter(enemy => !enemy.markedForDeletion); //create new array which removes element's who haven't passed the test
	}

	function displayStatusText(context){//to handle things like displaying score or game over message
		context.font = '40px Helvetica';
		context.fillStyle = 'black';
		context.fillText('Score: ' + score, 20, 50); 
		context.fillStyle = 'white';
		context.fillText('Score: ' + score, 22, 52); 
		if(gameOver){
			context.textAlign = 'center';
			context.fillStyle = 'black';
			context.fillText('GAME OVER, try again', canvas.width/2, 200); 
			context.fillStyle = 'white';
			context.fillText('GAME OVER, try again', canvas.width/2 + 2, 202);
		}
	}

	function restartGame(){
		
	}

	const input = new InputHandler();	
	const player = new Player(canvas.width, canvas.height);
	const background = new Background(canvas.width,canvas.height);

	let lastTime = 0;
	let enemyTimer = 0; //counter to add a new enemy
	let enemyInterval = 1000; //threshold to be reached before adding a new enemy(in miliseconds)
	let randomEnemyInterval = Math.random() * 1000 + 500; //to randomize interval in which add a new enemy

	function animate(timeStamp){//main animation loop to update and draw our game over and over.
		const deltaTime = timeStamp - lastTime; //we create a characteristic time gap for each pc(because timeStamp is characteristic of each pc)
		lastTime = timeStamp;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		background.draw(ctx); //background is drawn first
//		background.update();
		player.draw(ctx); //draw player 
		player.update(input,deltaTime,enemies); //update player properties, use deltaTime for animation and check collisions
		handleEnemies(deltaTime); //handle every enemy in game
		displayStatusText(ctx);
		if(!gameOver) requestAnimationFrame(animate);//timeStamp generated here and it's current time for when requestAnimationFrame starts to fire callbacks.
	}
	animate(0); //pass it zero to initialize timestamp
});

//				console.log(e.key, this.keys);//to get the correct property we can do first console.log(e) and seek for our relevant property
//				console.log(e.key, this.keys);//to get the correct property we can do first console.log(e) and seek for our relevant property
