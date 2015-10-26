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
}

Board.prototype.reset = function() {
  this.tiles = [];
  this.fill();
  this.removeMatches();
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
    if (x >= tile.leftEdge && x <= tile.rightEdge) {
      if (y >= tile.topEdge && y <= tile.bottomEdge) {
        return tile;
      }
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
    if((this.findTileAtRowAndColumn(tile.row + 1, tile.column)) || (tile.row == this.rowCount - 1)) {
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
    var leftTile = tile.leftmostTileInLine();
    var topTile = tile.topmostTileInLine();
    if(leftTile.horizontalLineLength() >= 3 || topTile.verticalLineLength() >= 3){
      tile.toClear = true;
    }
  });
  return this.tiles.filter(function(tile){
    return tile.toClear;
  })
}

Board.prototype.removeMatches = function() {

}

module.exports = Board;