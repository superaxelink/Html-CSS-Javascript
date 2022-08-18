document.addEventListener('load', function(){
	const canvas = document.getElementById('canvas1');
	const ctx = canvas.getContext('2d');
	canvas.width = 500;
	canvas.height = 100;

	class Game{ //manage of obstacles, background, menus and so on.
		constructor(){
			this.enemies = []
		}
		update(){
	
		}
		draw(){ 
			
		}
		#addNewEnemy(){ //private method
	
		}
	}

	class Enemy{ //it will only handle each individual enemy such as their position, movement pattern, sprite animation and so on.
		constructor(){
			
		}
		update(){
	
		}
		draw(){
	
		}
	}
	let lastTime = 1;
	function animate(timeStamp){ //this will call what it needs to be called and it loop around to move and animate things in our game.
		ctx.clearRect(0,0, canvas.width,canvas.height);
		const deltaTime = timeStamp - lastTime;
		lastTime = timeStamp;
		console.log(deltaTime);
		console.log("puta madre");
 		requestAnimationFrame(animate);
	};
	animate();
});
