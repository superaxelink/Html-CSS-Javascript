export class InputHandler{
  constructor(game){
    this.game = game;
    this.keys = [];
    window.addEventListener('keydown',e => {
      if((  e.key === 'ArrowDown'  ||
            e.key === 'ArrowUp'    ||
            e.key === 'ArrowLeft'  ||
            e.key === 'ArrowRight' ||
            e.key === 'Enter'      ||
            e.key === ' '
          ) && this.keys.indexOf(e.key) === -1){
        this.keys.push(e.key);
        //console.log(this.keys);
      } else if(e.key === 'd') this.game.debug = !this.game.debug;
    });
    window.addEventListener('keyup', e => {
      if( e.key === 'ArrowDown'  ||
          e.key === 'ArrowUp'    ||
          e.key === 'ArrowLeft'  ||
          e.key === 'ArrowRight' ||
          e.key === 'Enter'      ||
          e.key === ' '){
        this.keys.splice(this.keys.indexOf(e.key),1);
        //console.log(this.keys); 
      }
    });
  }
}