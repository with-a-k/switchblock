const assert = require('assert');
const Board = require('../lib/board');

describe('Board', function () {
  it('should instantiate with a column count', function () {
  	let board = new Board();
  	assert(board.columnCount);
  });

  it('should have a column count of 8 by default', function () {
  	let board = new Board();
  	assert.equal(8, board.columnCount);
  });

  it('can have a column count other than 8 if provided', function () {
  	let board = new Board(3);
  	assert.equal(3, board.columnCount);
  });

  it('should instantiate with a row count', function () {
  	let board = new Board();
  	assert(board.rowCount);
  });

  it('should have a row count of 8 by default', function () {
  	let board = new Board();
  	assert.equal(8, board.rowCount);
  });

  it('can have a row count other than 8 if provided', function () {
  	let board = new Board(3, 1);
  	assert.equal(1, board.rowCount);
  });

  it('should instantiate with a tileSize', function () {
  	let board = new Board();
  	assert(board.tileSize);
  });

  it('should have a tileSize of 70 by default', function () {
  	let board = new Board();
  	assert.equal(70, board.tileSize);
  });

  it('can have a tileSize other than 70 if provided', function () {
  	let board = new Board(3, 1, 50);
  	assert.equal(50, board.tileSize);
  });

  it('should instantiate with an empty tiles', function () {
  	let board = new Board();
  	assert(board.tiles);
  	assert.equal(0, board.tiles.length);
  });

  it('should be aware of the context it inhabits', function (){
  	let context = "false_context";
  	let board = new Board(8, 8, 70, context);
  	assert(board.context);
  });

  it('can populate itself with tiles', function(){
  	let board = new Board();
  	assert(board.populate);
  	board.populate();
  	assert.equal(64, board.tiles.length);
  });

  it('can render itself', function(){
  	let board = new Board();
  	assert(board.render);
  });

  it('can get a single tile', function(){
  	let board = new Board();
  	board.populate();
  	assert(board.findTileAtRowAndColumn(3, 5));
  });

  it('can get a tile\'s neighbors as an array', function(){
  	let board = new Board(3, 3, 50);
  	board.populate();
  	assert(board.neighborsOf(1,1));
  	assert.equal(4, board.neighborsOf(1,1));
  });
});