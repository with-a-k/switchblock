'use strict';
const Board = require('./board');

var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
var board = new Board(8, 8, 70, context);
board.reset();

requestAnimationFrame(function gameLoop(){
  context.clearRect(0, 0, canvas.width, canvas.height);

  board.render();

  requestAnimationFrame(gameLoop);
});

canvas.addEventListener('click', function(e) {
	debugger;
	var x = e.pageX - this.offsetLeft;
  var y = e.pageY - this.offsetTop;
  board.findObjectAt(x, y);
});