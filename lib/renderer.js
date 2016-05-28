'use strict';
const Board = require('./board');
const numeral = require('numeral');

var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
var board = new Board(8, 8, 70, context);
board.reset();

requestAnimationFrame(function gameLoop(){
  context.clearRect(0, 0, canvas.width, canvas.height);

  board.scanLoop();
  board.render();

  context.fillStyle = "#000";
  context.font = "24px Courier";
  context.fillText(numeral(board.points).format('0,0'), board.width + 50, 100);

  if(!board.inProgress){
  	context.fillStyle = "#660000";
  	context.fillText("Game Over. Click to restart", board.width + 50, 200);
  	canvas.addEventListener('click', restarter);
  }

  requestAnimationFrame(gameLoop);
});

function restarter(e) {
	e.target.removeEventListener(e.type, arguments.callee);
}

function toggleTile(e) {
	var x = e.pageX - this.offsetLeft;
  var y = e.pageY - this.offsetTop;
  if (board.hasActiveObject()) {
  	var activeTile = board.hasActiveObject();
  	var clickedTile = board.findObjectAt(x, y);
  	board.findObjectAt(x, y).toggleActive();
  	board.switchTiles(clickedTile, activeTile);
  	board.deactivateAll();
  } else {
  	board.findObjectAt(x, y).toggleActive();
  }
};

canvas.addEventListener('click', toggleTile);
