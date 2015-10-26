const assert = require('assert');
const Board = require('../lib/board');
const Tile = require('../lib/tile');

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
  	assert(board.reset);
  	board.reset();
  	assert.equal(64, board.tiles.length);
  });

  it('can render itself', function(){
  	let board = new Board();
  	assert(board.render);
  });

  it('can get a single tile', function(){
  	let board = new Board();
  	board.reset();
  	assert(board.findTileAtRowAndColumn(3, 5));
  });

  it('can get a tile\'s neighbors as an array', function(){
  	let board = new Board(3, 3, 50);
  	board.reset();
  	assert(board.neighborsOf);
  	assert.equal(4, board.neighborsOf(1,1).length);
  });

  it('can tell tiles to fall with "cascade"', function(){
  	let board = new Board(1, 3, 50);
  	let tile1 = new Tile(3, 0, 0, board);
  	let tile2 = new Tile(2, 0, 1, board);
  	board.tiles.push(tile1);
  	board.tiles.push(tile2);
  	assert(board.cascade);
  	board.cascade();
  	assert.equal(1, tile1.row);
  	assert.equal(2, tile2.row);
  });

  it('fills empty spaces with new tiles', function(){
  	let board = new Board(2, 1, 50);
  	let tile = new Tile(4, 0, 0, board);
  	board.tiles.push(tile);
  	assert(board.fill);
  	board.fill();
  	assert.equal(2, board.tiles.length);
  });

  it('can detect a horizontal match', function(){
  	let board = new Board(3, 1, 50);
  	let tile1 = new Tile(3, 0, 0, board);
  	let tile2 = new Tile(3, 1, 0, board);
  	let tile3 = new Tile(3, 2, 0, board);
  	board.tiles.push(tile1);
  	board.tiles.push(tile2);
  	board.tiles.push(tile3);
  	assert(board.scanForMatches);
  	board.scanForMatches();
  	board.tiles.forEach(function(tile){
  		assert(tile.toClear);
  	});
  });

  it('can detect a vertical match', function(){
  	let board = new Board(1, 2, 50);
  	let tile1 = new Tile(3, 0, 0, board);
  	let tile2 = new Tile(3, 0, 1, board);
  	let tile3 = new Tile(3, 0, 2, board);
  	board.tiles.push(tile1);
  	board.tiles.push(tile2);
  	board.tiles.push(tile3);
  	assert(board.scanForMatches);
  	board.scanForMatches();
  	board.tiles.forEach(function(tile){
  		assert(tile.toClear);
  	});
  });
});