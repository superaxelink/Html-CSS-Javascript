import {StandingLeft, StandingRight, SittingLeft, SittingRight, RunningLeft, RunningRight, JumpingLeft, 
  JumpingRight, FallingLeft, FallingRight} from './state.js';
//class player to handle what the player does and how interacts
//with the game
export default class Player{
  constructor(gameWidth, gameHeight){
    this.gameWidth = gameWidth; 
    this.gameHeight = gameHeight; //Height and width of the game canvas
    this.states = [new StandingLeft(this),new StandingRight(this), new SittingLeft(this),
    new SittingRight(this), new RunningLeft(this), new RunningRight(this), new JumpingLeft(this), 
    new JumpingRight(this), new FallingLeft(this), new FallingRight(this)]; //states that the player will have
    this.currentState = this.states[1];//keep track of the current state
    this.image = document.getElementById('dogImage');//the whole sprite image
    this.width = 200; 
    this.height=181.83; //width and height of each sprite element
    this.x = this.gameWidth*0.5 - this.width*0.5;
    this.y = this.gameHeight - this.height;//positions in which each element of the sprite it's going to appear
    this.vy = 0;
    this.weight = 1;
    this.frameX = 0;//to move horizontally in the sprite image
    this.frameY = 0;//to move vertically in the sprite image
    this.maxFrame = 6;
    this.speed = 0;
    this.maxSpeed = 15;
    this.fps = 30; //max fps per second
    this.frameTimer = 0; //timer
    this.frameInterval = 1000/this.fps; //number of miliseconds i want each frame to be displayed on the screen
    //before we switch to the next one
  }
  draw(context, deltaTime){//draw player
    if(this.frameTimer > this.frameInterval){
      if(this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = 0;
      this.frameTimer = 0;
    } else {
      this.frameTimer += deltaTime;
    }
    context.drawImage(this.image, this.width * this.frameX, this.height * this.frameY, 
      this.width, this.height, this.x, this.y, this.width,this.height);
  }
  update(input){ //connect input of the player with change of state
    this.currentState.handleInput(input);

    //horizontal movement
    this.x += this.speed;
    if (this.x <= 0) this.x = 0; //if horizontal position is less or equal to 0 set position to zero
    else if(this.x >= this.gameWidth - this.width) this.x = this.gameWidth - this.width;
    //if horizontal position is bigger than the right boundary minus the width of the image set position 
    //the right boundary minus the width of the image 

    //vertical movement
    this.y += this.vy;
    if(!this.onGround()){
      this.vy += this.weight;
    } else {
      this.vy = 0;
    }
    if (this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height;
  }
  setState(state){//to tell the state object towards which state 
    //we're going 
    this.currentState = this.states[state];//pass current state
    this.currentState.enter();
  }
  onGround(){ //check if player is standing on the ground
    return this.y >= this.gameHeight - this.height; 
  }
}