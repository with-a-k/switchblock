function Tile(type, column, row, parent) {
  this.type = type || 0;
  this.column = column;
  this.row = row;
  this.board = parent;
  this.size = this.board.tileSize;
  this.toClear = false;
};

Tile.prototype.colorList = [
	"#FFFFFF",
	"#FF0000",
	"#00FF00",
	"#0000FF",
	"#FFFF00",
	"#FF00FF",
	"#00FFFF",
	"#999999",
];

Tile.prototype.render = function() {
	var canvas = this.board.context;
	var x = (this.column * this.size) + 1;
  var y = (this.row * this.size) + 1;
  var sideLength = this.size;

  canvas.fillStyle = this.colorList[this.type];
  canvas.fillRect(x, y, sideLength, sideLength);
}

Tile.prototype.leftEdge = function() {
	return (this.column * this.size) + 1;
}

Tile.prototype.rightEdge = function() {
	return (this.column * this.size + 1) + this.size;
}

Tile.prototype.topEdge = function() {
	return (this.row * this.size) + 1;
}

Tile.prototype.bottomEdge = function() {
	return (this.row * this.size + 1) + this.size;
}

Tile.prototype.neighbors = function() {
	return this.board.neighborsOf(this.row, this.column);
}

Tile.prototype.drop = function() {
	++this.row;
	return this;
}

Tile.prototype.horizontalLineLength = function() {
	if(this.tileToTheRight()){
		if(this.tileToTheRight().type == this.type) {
			return this.tileToTheRight().horizontalLineLength() + 1;
		} else {
			return 1;
		}
	} else {
		return 1;
	}
}

Tile.prototype.verticalLineLength = function() {
	if(this.tileBelow()){
		if(this.tileBelow().type == this.type) {
			return this.tileBelow().verticalLineLength() + 1;
		} else {
			return 1;
		}
	} else {
		return 1;
	}
}

Tile.prototype.topmostTileInLine = function() {
	if(this.tileAbove()){
		if(this.tileAbove().type == this.type) {
			return this.tileAbove().topmostTileInLine();
		} else {
			return this;
		}
	} else {
		return this;
	}
};

Tile.prototype.leftmostTileInLine = function() {
	if(this.tileToTheLeft()){
		if(this.tileToTheLeft().type == this.type) {
			return this.tileToTheLeft().leftmostTileInLine();
		} else {
			return this;
		}
	} else {
		return this;
	}
};

Tile.prototype.inMatch = function() {
	var leftTile = this.leftmostTileInLine();
  var topTile = this.topmostTileInLine();
  if((leftTile.horizontalLineLength() >= 3) || (topTile.verticalLineLength() >= 3)){
    return true;
  } else {
  	return false;
  }
}

Tile.prototype.adjacentTile =  function (rowOffset, columnOffset) {
	return this.board.findTileAtRowAndColumn(this.row + rowOffset, this.column + columnOffset);
}

Tile.prototype.tileToTheLeft = function() {
	return this.adjacentTile(0, -1);
}

Tile.prototype.tileToTheRight = function() {
	return this.adjacentTile(0, 1);
}

Tile.prototype.tileBelow = function() {
	return this.adjacentTile(1, 0);
}

Tile.prototype.tileAbove = function() {
	return this.adjacentTile(-1, 0);
}

Tile.prototype.setClear = function() {
	this.toClear = true;
	return this;
}

Tile.prototype.isAtBottom = function() {
	return this.row == this.board.rowCount-1;
};

Tile.prototype.containsPoint = function(x,y) {
	return (x >= this.leftEdge() && x <= this.rightEdge() && y >= this.topEdge() && y <= this.bottomEdge());
}

Tile.prototype.possibleMatch = function() {

}

module.exports = Tile;