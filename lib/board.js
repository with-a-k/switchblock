'use strict';
const Tile = require('./tile');

function Board(columnCount, rowCount, tileSize, context) {
  this.columnCount = columnCount || 8;
  this.rowCount = rowCount || 8;
  this.tileSize = tileSize || 70;
  this.width = this.tileSize * this.columnCount;
  this.height = this.tileSize * this.rowCount;
  this.tiles = [];
  this.context = context;
  this.inProgress = false;
  this.points = 0;
}

Board.prototype.reset = function() {
  this.tiles = [];
  this.scanLoop();
  this.points = 0;
  this.inProgress = true;
}

Board.prototype.render = function() {
	this.tiles.forEach(function(tile){
		tile.render();
	});
}

Board.prototype.neighborsOf = function(row, column) {
	return [
		this.findTileAtRowAndColumn(row + 1, column), //right neighbor
		this.findTileAtRowAndColumn(row, column + 1), //lower neighbor
		this.findTileAtRowAndColumn(row - 1, column), //left neighbor
		this.findTileAtRowAndColumn(row, column - 1) //upper neighbor
	];
}

Board.prototype.findTileAtRowAndColumn = function(row, column) {
	return this.find(function(tile){
		return (tile.row == row && tile.column == column);
	});
}

Board.prototype.getRow = function(row_number) {
  return this.tiles.filter(function(tile){
    return tile.row == row_number;
  });
}

Board.prototype.getColumn = function(column_number) {
  return this.tiles.filter(function(tile){
    return tile.column == column_number;
  });
}

Board.prototype.findObjectAt = function(x, y) {
  return this.find(function(tile){
    if(tile.containsPoint(x,y)) {
      return tile;
    }
  });
}

Board.prototype.find = function(callback) {
  for (var i = 0; i < this.tiles.length; i++) {
    var tile = this.tiles[i];
    if(callback(tile)) {
      return tile;
    }
  }
};

Board.prototype.cascade = function() {
  var changed = false;
  this.tiles = this.tiles.map(function(tile){
    if(tile.findTileByRowAndColumnOffsets(1,0) || tile.isAtBottom()) {
      return tile;
    } else {
      changed = true;
      return tile.drop();
    }
  }, this);
  if(changed) {
    this.cascade();
  }
}

Board.prototype.fill = function() {
  for (var column=0; column < this.columnCount; column++) {
    for (var row=0; row < this.rowCount; row++) {
      if(!this.findTileAtRowAndColumn(row, column)){
        var type = Math.floor((Math.random() * 7) + 1);
        var tile = new Tile(type, column, row, this);
        this.tiles.push(tile);
      }
    }
  }
}

Board.prototype.scanForMatches = function() {
  this.tiles.forEach(function(tile){
    if(tile.inMatch()){
      tile.setClear();
    }
  });
  return this.tiles.filter(function(tile){
    return tile.toClear;
  }, this)
}

Board.prototype.removeMatches = function() {
  this.tiles = this.tiles.filter(function(tile){
    this.points += 10;
    return !tile.toClear;
  }, this);
}

Board.prototype.scanLoop = function() {
  if(this.scanForMatches().length > 0) {
    this.removeMatches();
    this.cascade();
    this.scanLoop();
  }
  if(this.tiles.length != this.rowCount * this.columnCount) {
    this.fill();
    this.scanLoop();
  }
  if(!this.possibleMatch) {
    this.inProgress = false;
  }
}

Board.prototype.willMatchOnSwap = function(tile1, tile2) {
  var checkBoard = new Board(this.columnCount, this.rowCount, this.tileSize, this.context);
  checkBoard.tiles = this.tiles.map(function(tile){
    if (tile == tile1) {
      return new Tile(tile2.type, tile1.column, tile1.row, checkBoard);
    } else if (tile == tile2) {
      return new Tile(tile1.type, tile2.column, tile2.row, checkBoard);
    } else {
      return new Tile(tile.type, tile.column, tile.row, checkBoard);
    }
  });
  if(checkBoard.scanForMatches().length > 0) {
    return true;
  }
  return false;
}

Board.prototype.possibleMatch = function() {
  return this.tiles.some(function(tile){
    return tile.possibleMatch();
  });
}

Board.prototype.switchTiles = function(tile1, tile2) {
  if(this.tilesAreSwitchable(tile1,tile2)) {
    this.tiles = this.tiles.map(function(tile){
      if (tile == tile1) {
        return new Tile(tile1.type, tile2.column, tile2.row, this);
      } else if (tile == tile2) {
        return new Tile(tile2.type, tile1.column, tile1.row, this);
      } else {
        return tile;
      }
    }, this);
    return true;
  }
  return false;
}

Board.prototype.tilesAreSwitchable = function(tile1, tile2) {
  return (tile1.adjacentTo(tile2) && this.willMatchOnSwap(tile1, tile2));
};

Board.prototype.hasActiveObject = function() {
  return this.find(function(tile){
    return tile.active;
  });
};

Board.prototype.toggleActive = function(tile) {
  return tile.toggleActive();
}

Board.prototype.deactivateAll = function() {
  this.tiles.forEach(function(tile){
    tile.deactivate();
  });
}

module.exports = Board;
