window.addEventListener('load', function(){
	const canvas = document.getElementById('canvas1');
	const ctx = canvas.getContext('2d');
	canvas.width = 500;
	canvas.height = 800;

	class Game{ //manage of obstacles, background, menus and so on.
		constructor(ctx, width, height){ //it's a good practice not to use global variables inside classes
			this.ctx = ctx;
			this.width = width;
			this.height = height;
			this.enemies = [];
			this.enemyInterval = 500; //It will define number of miliseconds between adding each new enemy into the game. So that appear more or less enemies.
			this.enemyTimer = 0; //this will set counter from 0 to enemyInterval
			this.enemyTypes = ['worm', 'ghost','spider']; // to push randomly worms and ghost into my enemy type
		}
		update(deltaTime){
			this.enemies = this.enemies.filter(object => !object.markedForDeletion); // filter creates a new array with all elements pass the test implemented by the provided function
			if(this.enemyTimer > this.enemyInterval){ //if enemyTimer is bigger than enemyInterval add new enemy and reset the counter
				this.#addNewEnemy();
				this.enemyTimer = 0;
				console.log(this.enemies);
			}else{ //otherwise keep counting
				this.enemyTimer += deltaTime;
			}
			this.enemies.forEach(object => object.update(deltaTime));
		}
		draw(){ 
			this.enemies.forEach(object => object.draw(this.ctx));
		}
		#addNewEnemy(){ //private method
			const randomEnemy = this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)];//this.enemyTypes.length will allow to keep adding enemies and to randomize the adding of each enemy
			if (randomEnemy == 'worm') this.enemies.push(new Worm(this)); //I'll pass this keyword which refers to the game object we are currently inside. The game object will carry all references to it's width height and other properties with it.
			else if(randomEnemy == 'ghost') this.enemies.push(new Ghost(this)); 
			else if(randomEnemy == 'spider') this.enemies.push(new Spider(this));

/* Comented because i dont't need it due to I change how animations align
			this.enemies.sort(function(a,b){ //we sort the elements by vertical position in order to the lowers are drawn latter than the uppers
				return a.y - b.y; //in order to get a sense of depht. Only sort when add new enemy

			});
*/
		}
	}

	class Enemy{ //it will only handle each individual enemy such as their position, movement pattern, sprite animation and so on.
		constructor(game){ //I'm passing this keyword inside my enemy constructor and inside my anime constructor and I will call it game.
			this.game = game; 
			this.markedForDeletion = false;
			this.frameX;
			this.maxFrame = 5;
			this.frameInterval = 100;
			this.frameTimer = 0;
		}
		update(deltaTime){
			this.x -= this.vx * deltaTime;
			if (this.x < 0 - this.width) this.markedForDeletion = true; //remove enemies out of screen
			if(this.frameTimer > this.frameInterval){ //checks if we should go to the next frame of the animation
				if(this.frameX < this.maxFrame) this.frameX++; //check's if we already reach the end of the sprite animation. If not we keep going
				else this.frameX = 0; //if we reach the end of the animation then resets
				this.frameTimer = 0; // and set back the timer in order to start counting again untill we serve the next animation
			} else{
				this.frameTimer += deltaTime;//if we shouldn't go to the next frame keeps counting
			}
		}
		draw(ctx){
			//ctx.fillRect(this.x, this.y, this.width, this.height);
			ctx.drawImage(this.image, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
		}
	}

	class Worm extends Enemy{
		constructor(game){
			super(game); //call parent constructor
			this.spriteWidth = 229;
			this.spriteHeight = 171;
			this.width = this.spriteWidth * 0.5;
			this.height = this.spriteHeight * 0.5;
			this.x = this.game.width;
			this.y = this.game.height - this.height; //in order to worms only move on the ground
			this.image = worm; //from the html source reference
			this.vx = Math.random() * 0.1 + 0.1;
		}
	}

	class Ghost extends Enemy{
		constructor(game){
			super(game); //call parent constructor
			this.spriteWidth = 261;
			this.spriteHeight = 209;
			this.width = this.spriteWidth * 0.5;
			this.height = this.spriteHeight * 0.5;
			this.x = this.game.width;
			this.y = Math.random() * this.game.height * 0.6;//in order to ghosts only appear on a percentage of the area
			this.image = ghost; //from the html source reference
			this.vx = Math.random() * 0.2 + 0.1;
			this.angle = 0;
			this.curve = Math.random() * 3; //randomize amplitude
		}
		update(deltaTime){ //to make ghosts move different
			super.update(deltaTime); //again we first call the parent method
			this.y += Math.sin(this.angle) * this.curve; //we make the move wavy
			this.angle += 0.04;
		}
		draw(){//to make ghosts transpaernt we use another draw class and instead of overriding it completely
			ctx.save();
			ctx.globalAlpha = 0.5; //and set this property that only works for ghosts and sets opacity to 50%
			super.draw(ctx); //we use the draw method that's in the parent class through the super.draw() call and pass it the correct canvas to work
			ctx.restore();// save and restore here it's equivalent to do ctx.globalAlpha = 0.5 then draw my ghosts with super.draw(ctx) and then set again ctx.globalAlpha=1 (it's original value)
		}
	}

	class Spider extends Enemy{
		constructor(game){
			super(game); //call parent constructor
			this.spriteWidth = 310;
			this.spriteHeight = 175;
			this.width = this.spriteWidth * 0.5;
			this.height = this.spriteHeight * 0.5;
			this.x = Math.random() * this.game.width;
			this.y = 0 - this.height; //spiders will start from the top area
			this.image = spider; //from the html source reference
			this.vx = 0; //spiders will only have vertical speed
			this.vy = Math.random()*0.1 + 0.1; //vertical speed
			this.maxLength = Math.random() * this.game.height; //random limit to up and down movement for each spider
		}
		update(deltaTime){
			super.update(deltaTime); //first call the parent method
			if(this.y < 0 - this.height * 2) this.markedForDeletion = true; //special condition to delete spiders which moves vertically. I'm not sure about the 2 though
			this.y += this.vy * deltaTime; //deltaTime in speed allows us to get consitency in different machines
			if(this.y > this.maxLength) this.vy *=-1; //to make spiders move up and down
		}
		draw(){//to draw an spiderweb for each spider
			ctx.beginPath(); //spiderweb will ve a line
			ctx.moveTo(this.x + this.width*0.5, 0); //origin of the line
			ctx.lineTo(this.x + this.width*0.5,this.y + 10); //end of the line
			ctx.stroke(); //type of line is default?
			super.draw(ctx);	
		}
	}

	const game = new Game(ctx, canvas.width, canvas.height); //creates a new game object and pass them the global variables.
	let lastTime = 1;
	function animate(timeStamp){ //this will call what it needs to be called and it loop around to move and animate things in our game.
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		const deltaTime = timeStamp - lastTime;
		lastTime = timeStamp;
		game.update(deltaTime);
		game.draw();
		//some code
 		requestAnimationFrame(animate);
	};
	animate(0);
});
