const assert = require('assert');
const Tile = require('../lib/tile');
const Board = require('../lib/board');

describe('Tile', function () {
  it('should instantiate with a column', function () {
    let board = new Board();
    let tile = new Tile(1, 2, 3, board);
  	board.tiles.push(tile);
  	assert(tile.column);
    assert.equal(2, tile.column);
  });

  it('should instantiate with a row', function () {
    let board = new Board();
    let tile = new Tile(1, 2, 3, board);
    board.tiles.push(tile);
    assert(tile.row);
    assert.equal(3, tile.row);
  });

  it('should instantiate with a type', function () {
    let board = new Board();
    let tile = new Tile(1, 2, 3, board);
    board.tiles.push(tile);
    assert(tile.type);
    assert.equal(1, tile.type);
  });

  it('is aware of its parent board', function () {
    let board = new Board();
    let tile = new Tile(1, 2, 3, board);
    board.tiles.push(tile);
    assert(tile.board);
    assert.equal(board, tile.board);
  });

  it('can drop', function() {
    let board = new Board();
    let tile = new Tile(1, 2, 3, board);
    board.tiles.push(tile);
    assert(tile.drop);
    let currentRow = tile.row;
    tile.drop();
    assert.equal(currentRow, tile.row-1);
  });
});