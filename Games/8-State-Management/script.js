import Player from './player.js'; /*Import if they're in the same folder*/
import InputHandler from './input.js';
import {drawStatusText} from './utils.js';

window.addEventListener('load',function(){
  const loading = document.getElementById('loading');
  loading.style.display = 'none';
  const canvas = document.getElementById('canvas1');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;//canvas attributes

  const player = new Player(canvas.width,canvas.height);
  //creates player object
  const input = new InputHandler();
  //creates Input handler object

  //function to animate the game calling functions from external
  //classes
  let lastTime = 0;
  function animate(timeStamp){
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0,canvas.width,canvas.height);
    player.update(input.lastKey); //updates what the player attributes
    //and connects them through the "input" object created with
    //new InputHandler() and their attributes(laste key pressed).
    player.draw(ctx, deltaTime);  //draws the player
    drawStatusText(ctx,input, player); //drawStatus when receives context and
    //input object created in.
    requestAnimationFrame(animate);
  }; 
  animate(0);
});