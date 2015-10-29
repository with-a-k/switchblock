function Tile(type, column, row, parent) {
  this.type = type || 0;
  this.column = column;
  this.row = row;
  this.board = parent;
  this.size = this.board.tileSize;
  this.toClear = false;
  this.active = false;
};

Tile.prototype.colorList = [
	"#FFFFFF",
	"#FF0000",
	"#00CC00",
	"#0000FF",
	"#DDDD00",
	"#FF00FF",
	"#00CCCC",
	"#999999",
];

Tile.prototype.activeColorList = [
	"#FFFFFF",
	"#FF6666",
	"#66FF66",
	"#6666FF",
	"#FFFF66",
	"#FF66FF",
	"#66FFFF",
	"#CCCCCC",
];

Tile.prototype.render = function() {
	var canvas = this.board.context;
	var x = (this.column * this.size) + 1;
  var y = (this.row * this.size) + 1;
  var sideLength = this.size;

  canvas.fillStyle = this.colorList[this.type];
  if(this.active) { canvas.fillStyle = this.activeColorList[this.type]; }
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

Tile.prototype.relativeTile =  function (rowOffset, columnOffset) {
	return this.board.findTileAtRowAndColumn(this.row + rowOffset, this.column + columnOffset);
}

Tile.prototype.tileToTheLeft = function() {
	return this.relativeTile(0, -1);
}

Tile.prototype.tileToTheRight = function() {
	return this.relativeTile(0, 1);
}

Tile.prototype.tileBelow = function() {
	return this.relativeTile(1, 0);
}

Tile.prototype.tileAbove = function() {
	return this.relativeTile(-1, 0);
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

Tile.prototype.sameTypeAs = function(tile) {
	return this.type == tile.type;
}

Tile.prototype.possibleMatch = function() {
	if(this.tileBelow() && this.tileBelow().sameTypeAs(this)) {
		if(this.relativeTile(-2, 0) && this.relativeTile(-2, 0).sameTypeAs(this)){return true;}
		if(this.relativeTile(-1, 1) && this.relativeTile(-1, 1).sameTypeAs(this)){return true;}
		if(this.relativeTile(1, 1) && this.relativeTile(1, 1).sameTypeAs(this)){return true;}
	}
	if(this.tileAbove() && this.tileAbove().sameTypeAs(this)) {
		if(this.relativeTile(2, 0) && this.relativeTile(2, 0).sameTypeAs(this)){return true;}
		if(this.relativeTile(1, -1) && this.relativeTile(1, -1).sameTypeAs(this)){return true;}
		if(this.relativeTile(1, 1) && this.relativeTile(1, 1).sameTypeAs(this)){return true;}
	}
	if(this.tileToTheLeft() && this.tileToTheLeft().sameTypeAs(this)) {
		if(this.relativeTile(0, 2) && this.relativeTile(0, 2).sameTypeAs(this)){return true;}
		if(this.relativeTile(1, 1) && this.relativeTile(1, 1).sameTypeAs(this)){return true;}
		if(this.relativeTile(1, -1) && this.relativeTile(1, -1).sameTypeAs(this)){return true;}
	}
	if(this.tileToTheRight() && this.tileToTheRight().sameTypeAs(this)) {
		if(this.relativeTile(0, -2) && this.relativeTile(0, -2).sameTypeAs(this)){return true;}
		if(this.relativeTile(-1, -1) && this.relativeTile(-1, -1).sameTypeAs(this)){return true;}
		if(this.relativeTile(-1, 1) && this.relativeTile(-1, 1).sameTypeAs(this)){return true;}
	}
	return false;
}

Tile.prototype.adjacentTo = function(tile) {
	return ((this.column == tile.column && (this.row == tile.row +1 || this.row +1 == tile.row)) || (this.row == tile.row && (this.column == tile.column +1 || this.column +1 == tile.column)));
}

Tile.prototype.toggleActive = function(tile) {
	this.active = !this.active;
	return this;
}

Tile.prototype.deactivate = function() {
	this.active = false;
	return this;
}

module.exports = Tile;