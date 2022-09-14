class Particle{
  constructor(game){
    this.game = game;
    this.markedForDeletion = false;
  }
  update(){
    this.x -= this.speedX + this.game.speed;
    this.y -= this.speedY;
    this.size *= 0.95; //each particle will decrease for 5% on every frame. This controls how long is the particle trail
    if(this.size < 0.5) this.markedForDeletion = true;
  }
}

export class Dust extends Particle{
  constructor(game, x, y){
    super(game);
    this.size = Math.random() * 10 + 10;
    this.x = x;
    this.y = y;
    this.speedX = Math.random();
    this.speedY = Math.random();
    this.color = 'rgba(0,0,0,0.2)';
  };
  draw(context){
    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    context.fillStyle = this.color;
    context.fill(); 
  }
}

export class Splash extends Particle{
  constructor(game, x, y){
    super(game);
    this.size = Math.random() * 100 + 100;
    this.x = x - this.size * 0.4;
    this.y = y - this.size * 0.5;
    this.speedX = Math.random() * 6 - 3;
    this.speedY = Math.random() * 2 + 2;
    this.gravity = 0;
    this.image = document.getElementById("fire");
  }
  update(){
    super.update();
    this.gravity += 0.1;
    this.y += this.gravity;
  }
  draw(context){
    context.drawImage(this.image, this.x, this.y, this.size, this.size);
  }
}

export class Fire extends Particle{
  constructor(game, x, y){
    super(game);
    this.image = document.getElementById("fire");
    this.size = Math.random() * 100 + 50; //in pixels
    this.x = x;
    this.y = y;
    this.speedX = 1;
    this.speedY = 1;
    this.angle = 0; //to rotate fire
    this.va = Math.random() * 0.2 - 0.1; //velocity of angle
  }
  update(){
    super.update();
    this.angle += this.va;
    this.x += Math.sin(this.angle * 10);
  }
  draw(context){
    context.save();
    context.translate(this.x, this.y); //rotation centerpoint to the center of the object we want to rotate
    context.rotate(this.angle);//this will rotate image each time by angle
    context.drawImage(this.image, -this.size * 0.5, -this.size * 0.5, this.size, this.size); 
    context.restore();
  }
}