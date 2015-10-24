function Tile(type, column, row, parent) {
  this.type = type || 0;
  this.column = column;
  this.row = row;
  this.board = parent;
  this.size = this.board.tileSize;
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
	return (this.column * this.size + 1) + 1;
}

Tile.prototype.topEdge = function() {
	return (this.row * this.size) + 1;
}

Tile.prototype.bottomEdge = function() {
	return (this.row * this.size + 1) + 1;
}

Tile.prototype.neighbors = function() {
	return this.board.neighborsOf(this.row, this.column);
}

Tile.prototype.drop = function() {
	this.row + 1;
}

module.exports = Tile;