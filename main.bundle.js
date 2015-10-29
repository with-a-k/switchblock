/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Tile = __webpack_require__(1);
	var Board = __webpack_require__(2);
	var Renderer = __webpack_require__(3);

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	function Tile(type, column, row, parent) {
		this.type = type || 0;
		this.column = column;
		this.row = row;
		this.board = parent;
		this.size = this.board.tileSize;
		this.toClear = false;
		this.active = false;
	};

	Tile.prototype.colorList = ["#FFFFFF", "#FF0000", "#00CC00", "#0000FF", "#DDDD00", "#FF00FF", "#00CCCC", "#999999"];

	Tile.prototype.activeColorList = ["#FFFFFF", "#FF6666", "#66FF66", "#6666FF", "#FFFF66", "#FF66FF", "#66FFFF", "#CCCCCC"];

	Tile.prototype.render = function () {
		var canvas = this.board.context;
		var x = this.column * this.size + 1;
		var y = this.row * this.size + 1;
		var sideLength = this.size;

		canvas.fillStyle = this.colorList[this.type];
		if (this.active) {
			canvas.fillStyle = this.activeColorList[this.type];
		}
		canvas.fillRect(x, y, sideLength, sideLength);
	};

	Tile.prototype.leftEdge = function () {
		return this.column * this.size + 1;
	};

	Tile.prototype.rightEdge = function () {
		return this.column * this.size + 1 + this.size;
	};

	Tile.prototype.topEdge = function () {
		return this.row * this.size + 1;
	};

	Tile.prototype.bottomEdge = function () {
		return this.row * this.size + 1 + this.size;
	};

	Tile.prototype.neighbors = function () {
		return this.board.neighborsOf(this.row, this.column);
	};

	Tile.prototype.drop = function () {
		++this.row;
		return this;
	};

	Tile.prototype.horizontalLineLength = function () {
		if (this.tileToTheRight()) {
			if (this.tileToTheRight().type == this.type) {
				return this.tileToTheRight().horizontalLineLength() + 1;
			} else {
				return 1;
			}
		} else {
			return 1;
		}
	};

	Tile.prototype.verticalLineLength = function () {
		if (this.tileBelow()) {
			if (this.tileBelow().type == this.type) {
				return this.tileBelow().verticalLineLength() + 1;
			} else {
				return 1;
			}
		} else {
			return 1;
		}
	};

	Tile.prototype.topmostTileInLine = function () {
		if (this.tileAbove()) {
			if (this.tileAbove().type == this.type) {
				return this.tileAbove().topmostTileInLine();
			} else {
				return this;
			}
		} else {
			return this;
		}
	};

	Tile.prototype.leftmostTileInLine = function () {
		if (this.tileToTheLeft()) {
			if (this.tileToTheLeft().type == this.type) {
				return this.tileToTheLeft().leftmostTileInLine();
			} else {
				return this;
			}
		} else {
			return this;
		}
	};

	Tile.prototype.inMatch = function () {
		var leftTile = this.leftmostTileInLine();
		var topTile = this.topmostTileInLine();
		if (leftTile.horizontalLineLength() >= 3 || topTile.verticalLineLength() >= 3) {
			return true;
		} else {
			return false;
		}
	};

	Tile.prototype.relativeTile = function (rowOffset, columnOffset) {
		return this.board.findTileAtRowAndColumn(this.row + rowOffset, this.column + columnOffset);
	};

	Tile.prototype.tileToTheLeft = function () {
		return this.relativeTile(0, -1);
	};

	Tile.prototype.tileToTheRight = function () {
		return this.relativeTile(0, 1);
	};

	Tile.prototype.tileBelow = function () {
		return this.relativeTile(1, 0);
	};

	Tile.prototype.tileAbove = function () {
		return this.relativeTile(-1, 0);
	};

	Tile.prototype.setClear = function () {
		this.toClear = true;
		return this;
	};

	Tile.prototype.isAtBottom = function () {
		return this.row == this.board.rowCount - 1;
	};

	Tile.prototype.containsPoint = function (x, y) {
		return x >= this.leftEdge() && x <= this.rightEdge() && y >= this.topEdge() && y <= this.bottomEdge();
	};

	Tile.prototype.sameTypeAs = function (tile) {
		return this.type == tile.type;
	};

	Tile.prototype.possibleMatch = function () {
		if (this.tileBelow() && this.tileBelow().sameTypeAs(this)) {
			if (this.relativeTile(-2, 0) && this.relativeTile(-2, 0).sameTypeAs(this)) {
				return true;
			}
			if (this.relativeTile(-1, 1) && this.relativeTile(-1, 1).sameTypeAs(this)) {
				return true;
			}
			if (this.relativeTile(1, 1) && this.relativeTile(1, 1).sameTypeAs(this)) {
				return true;
			}
		}
		if (this.tileAbove() && this.tileAbove().sameTypeAs(this)) {
			if (this.relativeTile(2, 0) && this.relativeTile(2, 0).sameTypeAs(this)) {
				return true;
			}
			if (this.relativeTile(1, -1) && this.relativeTile(1, -1).sameTypeAs(this)) {
				return true;
			}
			if (this.relativeTile(1, 1) && this.relativeTile(1, 1).sameTypeAs(this)) {
				return true;
			}
		}
		if (this.tileToTheLeft() && this.tileToTheLeft().sameTypeAs(this)) {
			if (this.relativeTile(0, 2) && this.relativeTile(0, 2).sameTypeAs(this)) {
				return true;
			}
			if (this.relativeTile(1, 1) && this.relativeTile(1, 1).sameTypeAs(this)) {
				return true;
			}
			if (this.relativeTile(1, -1) && this.relativeTile(1, -1).sameTypeAs(this)) {
				return true;
			}
		}
		if (this.tileToTheRight() && this.tileToTheRight().sameTypeAs(this)) {
			if (this.relativeTile(0, -2) && this.relativeTile(0, -2).sameTypeAs(this)) {
				return true;
			}
			if (this.relativeTile(-1, -1) && this.relativeTile(-1, -1).sameTypeAs(this)) {
				return true;
			}
			if (this.relativeTile(-1, 1) && this.relativeTile(-1, 1).sameTypeAs(this)) {
				return true;
			}
		}
		return false;
	};

	Tile.prototype.adjacentTo = function (tile) {
		return this.column == tile.column && (this.row == tile.row + 1 || this.row + 1 == tile.row) || this.row == tile.row && (this.column == tile.column + 1 || this.column + 1 == tile.column);
	};

	Tile.prototype.toggleActive = function (tile) {
		this.active = !this.active;
		return this;
	};

	Tile.prototype.deactivate = function () {
		this.active = false;
		return this;
	};

	module.exports = Tile;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var Tile = __webpack_require__(1);

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

	Board.prototype.reset = function () {
	  this.tiles = [];
	  this.scanLoop();
	  this.points = 0;
	  this.inProgress = true;
	};

	Board.prototype.render = function () {
	  this.tiles.forEach(function (tile) {
	    tile.render();
	  });
	};

	Board.prototype.neighborsOf = function (row, column) {
	  return [this.findTileAtRowAndColumn(row + 1, column), //right neighbor
	  this.findTileAtRowAndColumn(row, column + 1), //lower neighbor
	  this.findTileAtRowAndColumn(row - 1, column), //left neighbor
	  this.findTileAtRowAndColumn(row, column - 1) //upper neighbor
	  ];
	};

	Board.prototype.findTileAtRowAndColumn = function (row, column) {
	  return this.find(function (tile) {
	    return tile.row == row && tile.column == column;
	  });
	};

	Board.prototype.getRow = function (row_number) {
	  return this.tiles.filter(function (tile) {
	    return tile.row == row_number;
	  });
	};

	Board.prototype.getColumn = function (column_number) {
	  return this.tiles.filter(function (tile) {
	    return tile.column == column_number;
	  });
	};

	Board.prototype.findObjectAt = function (x, y) {
	  return this.find(function (tile) {
	    if (tile.containsPoint(x, y)) {
	      return tile;
	    }
	  });
	};

	Board.prototype.find = function (callback) {
	  for (var i = 0; i < this.tiles.length; i++) {
	    var tile = this.tiles[i];
	    if (callback(tile)) {
	      return tile;
	    }
	  }
	};

	Board.prototype.cascade = function () {
	  var changed = false;
	  this.tiles = this.tiles.map(function (tile) {
	    if (tile.tileBelow() || tile.isAtBottom()) {
	      return tile;
	    } else {
	      changed = true;
	      return tile.drop();
	    }
	  }, this);
	  if (changed) {
	    this.cascade();
	  }
	};

	Board.prototype.fill = function () {
	  for (var column = 0; column < this.columnCount; column++) {
	    for (var row = 0; row < this.rowCount; row++) {
	      if (!this.findTileAtRowAndColumn(row, column)) {
	        var type = Math.floor(Math.random() * 7 + 1);
	        var tile = new Tile(type, column, row, this);

	        this.tiles.push(tile);
	      }
	    }
	  }
	};

	Board.prototype.scanForMatches = function () {
	  this.tiles.forEach(function (tile) {
	    if (tile.inMatch()) {
	      tile.setClear();
	    }
	  });
	  return this.tiles.filter(function (tile) {
	    return tile.toClear;
	  }, this);
	};

	Board.prototype.removeMatches = function () {
	  this.tiles = this.tiles.filter(function (tile) {
	    this.points += 10;
	    return !tile.toClear;
	  }, this);
	};

	Board.prototype.scanLoop = function () {
	  if (this.scanForMatches().length > 0) {
	    this.removeMatches();
	    this.cascade();
	    this.scanLoop();
	  }
	  if (this.tiles.length != this.rowCount * this.columnCount) {
	    this.fill();
	    this.scanLoop();
	  }
	  if (!this.possibleMatch) {
	    this.inProgress = false;
	  }
	};

	Board.prototype.willMatchOnSwap = function (tile1, tile2) {
	  var checkBoard = new Board(this.columnCount, this.rowCount, this.tileSize, this.context);
	  checkBoard.tiles = this.tiles.map(function (tile) {
	    if (tile == tile1) {
	      return new Tile(tile2.type, tile1.column, tile1.row, checkBoard);
	    } else if (tile == tile2) {
	      return new Tile(tile1.type, tile2.column, tile2.row, checkBoard);
	    } else {
	      return new Tile(tile.type, tile.column, tile.row, checkBoard);
	    }
	  });
	  if (checkBoard.scanForMatches().length > 0) {
	    return true;
	  }
	  return false;
	};

	Board.prototype.possibleMatch = function () {
	  return this.tiles.some(function (tile) {
	    return tile.possibleMatch();
	  });
	};

	Board.prototype.switchTiles = function (tile1, tile2) {
	  if (this.tilesAreSwitchable(tile1, tile2)) {
	    this.tiles = this.tiles.map(function (tile) {
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
	};

	Board.prototype.tilesAreSwitchable = function (tile1, tile2) {
	  return tile1.adjacentTo(tile2) && this.willMatchOnSwap(tile1, tile2);
	};

	Board.prototype.hasActiveObject = function () {
	  return this.find(function (tile) {
	    return tile.active;
	  });
	};

	Board.prototype.toggleActive = function (tile) {
	  return tile.toggleActive();
	};

	Board.prototype.deactivateAll = function () {
	  this.tiles.forEach(function (tile) {
	    tile.deactivate();
	  });
	};

	module.exports = Board;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var Board = __webpack_require__(2);
	var numeral = __webpack_require__(4);

	var canvas = document.getElementById('game');
	var context = canvas.getContext('2d');
	var board = new Board(8, 8, 70, context);
	board.reset();

	requestAnimationFrame(function gameLoop() {
	  context.clearRect(0, 0, canvas.width, canvas.height);

	  board.scanLoop();
	  board.render();

	  context.fillStyle = "#000000";
	  context.font = "24px Courier";
	  context.fillText(numeral(board.points).format('0,0'), board.width + 50, 100);

	  if (!board.inProgress) {
	    context.fillStyle = "#660000";
	    context.fillText("Game Over. Click to restart", board.width + 50, 200);
	  }

	  requestAnimationFrame(gameLoop);
	});

	canvas.addEventListener('click', function (e) {
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
	});

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	 * numeral.js
	 * version : 1.5.3
	 * author : Adam Draper
	 * license : MIT
	 * http://adamwdraper.github.com/Numeral-js/
	 */

	'use strict';

	(function () {

	    /************************************
	        Constants
	    ************************************/

	    var numeral,
	        VERSION = '1.5.3',

	    // internal storage for language config files
	    languages = {},
	        currentLanguage = 'en',
	        zeroFormat = null,
	        defaultFormat = '0,0',

	    // check for nodeJS
	    hasModule = typeof module !== 'undefined' && module.exports;

	    /************************************
	        Constructors
	    ************************************/

	    // Numeral prototype object
	    function Numeral(number) {
	        this._value = number;
	    }

	    /**
	     * Implementation of toFixed() that treats floats more like decimals
	     *
	     * Fixes binary rounding issues (eg. (0.615).toFixed(2) === '0.61') that present
	     * problems for accounting- and finance-related software.
	     */
	    function toFixed(value, precision, roundingFunction, optionals) {
	        var power = Math.pow(10, precision),
	            optionalsRegExp,
	            output;

	        //roundingFunction = (roundingFunction !== undefined ? roundingFunction : Math.round);
	        // Multiply up by precision, round accurately, then divide and use native toFixed():
	        output = (roundingFunction(value * power) / power).toFixed(precision);

	        if (optionals) {
	            optionalsRegExp = new RegExp('0{1,' + optionals + '}$');
	            output = output.replace(optionalsRegExp, '');
	        }

	        return output;
	    }

	    /************************************
	        Formatting
	    ************************************/

	    // determine what type of formatting we need to do
	    function formatNumeral(n, format, roundingFunction) {
	        var output;

	        // figure out what kind of format we are dealing with
	        if (format.indexOf('$') > -1) {
	            // currency!!!!!
	            output = formatCurrency(n, format, roundingFunction);
	        } else if (format.indexOf('%') > -1) {
	            // percentage
	            output = formatPercentage(n, format, roundingFunction);
	        } else if (format.indexOf(':') > -1) {
	            // time
	            output = formatTime(n, format);
	        } else {
	            // plain ol' numbers or bytes
	            output = formatNumber(n._value, format, roundingFunction);
	        }

	        // return string
	        return output;
	    }

	    // revert to number
	    function unformatNumeral(n, string) {
	        var stringOriginal = string,
	            thousandRegExp,
	            millionRegExp,
	            billionRegExp,
	            trillionRegExp,
	            suffixes = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
	            bytesMultiplier = false,
	            power;

	        if (string.indexOf(':') > -1) {
	            n._value = unformatTime(string);
	        } else {
	            if (string === zeroFormat) {
	                n._value = 0;
	            } else {
	                if (languages[currentLanguage].delimiters.decimal !== '.') {
	                    string = string.replace(/\./g, '').replace(languages[currentLanguage].delimiters.decimal, '.');
	                }

	                // see if abbreviations are there so that we can multiply to the correct number
	                thousandRegExp = new RegExp('[^a-zA-Z]' + languages[currentLanguage].abbreviations.thousand + '(?:\\)|(\\' + languages[currentLanguage].currency.symbol + ')?(?:\\))?)?$');
	                millionRegExp = new RegExp('[^a-zA-Z]' + languages[currentLanguage].abbreviations.million + '(?:\\)|(\\' + languages[currentLanguage].currency.symbol + ')?(?:\\))?)?$');
	                billionRegExp = new RegExp('[^a-zA-Z]' + languages[currentLanguage].abbreviations.billion + '(?:\\)|(\\' + languages[currentLanguage].currency.symbol + ')?(?:\\))?)?$');
	                trillionRegExp = new RegExp('[^a-zA-Z]' + languages[currentLanguage].abbreviations.trillion + '(?:\\)|(\\' + languages[currentLanguage].currency.symbol + ')?(?:\\))?)?$');

	                // see if bytes are there so that we can multiply to the correct number
	                for (power = 0; power <= suffixes.length; power++) {
	                    bytesMultiplier = string.indexOf(suffixes[power]) > -1 ? Math.pow(1024, power + 1) : false;

	                    if (bytesMultiplier) {
	                        break;
	                    }
	                }

	                // do some math to create our number
	                n._value = (bytesMultiplier ? bytesMultiplier : 1) * (stringOriginal.match(thousandRegExp) ? Math.pow(10, 3) : 1) * (stringOriginal.match(millionRegExp) ? Math.pow(10, 6) : 1) * (stringOriginal.match(billionRegExp) ? Math.pow(10, 9) : 1) * (stringOriginal.match(trillionRegExp) ? Math.pow(10, 12) : 1) * (string.indexOf('%') > -1 ? 0.01 : 1) * ((string.split('-').length + Math.min(string.split('(').length - 1, string.split(')').length - 1)) % 2 ? 1 : -1) * Number(string.replace(/[^0-9\.]+/g, ''));

	                // round if we are talking about bytes
	                n._value = bytesMultiplier ? Math.ceil(n._value) : n._value;
	            }
	        }
	        return n._value;
	    }

	    function formatCurrency(n, format, roundingFunction) {
	        var symbolIndex = format.indexOf('$'),
	            openParenIndex = format.indexOf('('),
	            minusSignIndex = format.indexOf('-'),
	            space = '',
	            spliceIndex,
	            output;

	        // check for space before or after currency
	        if (format.indexOf(' $') > -1) {
	            space = ' ';
	            format = format.replace(' $', '');
	        } else if (format.indexOf('$ ') > -1) {
	            space = ' ';
	            format = format.replace('$ ', '');
	        } else {
	            format = format.replace('$', '');
	        }

	        // format the number
	        output = formatNumber(n._value, format, roundingFunction);

	        // position the symbol
	        if (symbolIndex <= 1) {
	            if (output.indexOf('(') > -1 || output.indexOf('-') > -1) {
	                output = output.split('');
	                spliceIndex = 1;
	                if (symbolIndex < openParenIndex || symbolIndex < minusSignIndex) {
	                    // the symbol appears before the "(" or "-"
	                    spliceIndex = 0;
	                }
	                output.splice(spliceIndex, 0, languages[currentLanguage].currency.symbol + space);
	                output = output.join('');
	            } else {
	                output = languages[currentLanguage].currency.symbol + space + output;
	            }
	        } else {
	            if (output.indexOf(')') > -1) {
	                output = output.split('');
	                output.splice(-1, 0, space + languages[currentLanguage].currency.symbol);
	                output = output.join('');
	            } else {
	                output = output + space + languages[currentLanguage].currency.symbol;
	            }
	        }

	        return output;
	    }

	    function formatPercentage(n, format, roundingFunction) {
	        var space = '',
	            output,
	            value = n._value * 100;

	        // check for space before %
	        if (format.indexOf(' %') > -1) {
	            space = ' ';
	            format = format.replace(' %', '');
	        } else {
	            format = format.replace('%', '');
	        }

	        output = formatNumber(value, format, roundingFunction);

	        if (output.indexOf(')') > -1) {
	            output = output.split('');
	            output.splice(-1, 0, space + '%');
	            output = output.join('');
	        } else {
	            output = output + space + '%';
	        }

	        return output;
	    }

	    function formatTime(n) {
	        var hours = Math.floor(n._value / 60 / 60),
	            minutes = Math.floor((n._value - hours * 60 * 60) / 60),
	            seconds = Math.round(n._value - hours * 60 * 60 - minutes * 60);
	        return hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
	    }

	    function unformatTime(string) {
	        var timeArray = string.split(':'),
	            seconds = 0;
	        // turn hours and minutes into seconds and add them all up
	        if (timeArray.length === 3) {
	            // hours
	            seconds = seconds + Number(timeArray[0]) * 60 * 60;
	            // minutes
	            seconds = seconds + Number(timeArray[1]) * 60;
	            // seconds
	            seconds = seconds + Number(timeArray[2]);
	        } else if (timeArray.length === 2) {
	            // minutes
	            seconds = seconds + Number(timeArray[0]) * 60;
	            // seconds
	            seconds = seconds + Number(timeArray[1]);
	        }
	        return Number(seconds);
	    }

	    function formatNumber(value, format, roundingFunction) {
	        var negP = false,
	            signed = false,
	            optDec = false,
	            abbr = '',
	            abbrK = false,
	            // force abbreviation to thousands
	        abbrM = false,
	            // force abbreviation to millions
	        abbrB = false,
	            // force abbreviation to billions
	        abbrT = false,
	            // force abbreviation to trillions
	        abbrForce = false,
	            // force abbreviation
	        bytes = '',
	            ord = '',
	            abs = Math.abs(value),
	            suffixes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
	            min,
	            max,
	            power,
	            w,
	            precision,
	            thousands,
	            d = '',
	            neg = false;

	        // check if number is zero and a custom zero format has been set
	        if (value === 0 && zeroFormat !== null) {
	            return zeroFormat;
	        } else {
	            // see if we should use parentheses for negative number or if we should prefix with a sign
	            // if both are present we default to parentheses
	            if (format.indexOf('(') > -1) {
	                negP = true;
	                format = format.slice(1, -1);
	            } else if (format.indexOf('+') > -1) {
	                signed = true;
	                format = format.replace(/\+/g, '');
	            }

	            // see if abbreviation is wanted
	            if (format.indexOf('a') > -1) {
	                // check if abbreviation is specified
	                abbrK = format.indexOf('aK') >= 0;
	                abbrM = format.indexOf('aM') >= 0;
	                abbrB = format.indexOf('aB') >= 0;
	                abbrT = format.indexOf('aT') >= 0;
	                abbrForce = abbrK || abbrM || abbrB || abbrT;

	                // check for space before abbreviation
	                if (format.indexOf(' a') > -1) {
	                    abbr = ' ';
	                    format = format.replace(' a', '');
	                } else {
	                    format = format.replace('a', '');
	                }

	                if (abs >= Math.pow(10, 12) && !abbrForce || abbrT) {
	                    // trillion
	                    abbr = abbr + languages[currentLanguage].abbreviations.trillion;
	                    value = value / Math.pow(10, 12);
	                } else if (abs < Math.pow(10, 12) && abs >= Math.pow(10, 9) && !abbrForce || abbrB) {
	                    // billion
	                    abbr = abbr + languages[currentLanguage].abbreviations.billion;
	                    value = value / Math.pow(10, 9);
	                } else if (abs < Math.pow(10, 9) && abs >= Math.pow(10, 6) && !abbrForce || abbrM) {
	                    // million
	                    abbr = abbr + languages[currentLanguage].abbreviations.million;
	                    value = value / Math.pow(10, 6);
	                } else if (abs < Math.pow(10, 6) && abs >= Math.pow(10, 3) && !abbrForce || abbrK) {
	                    // thousand
	                    abbr = abbr + languages[currentLanguage].abbreviations.thousand;
	                    value = value / Math.pow(10, 3);
	                }
	            }

	            // see if we are formatting bytes
	            if (format.indexOf('b') > -1) {
	                // check for space before
	                if (format.indexOf(' b') > -1) {
	                    bytes = ' ';
	                    format = format.replace(' b', '');
	                } else {
	                    format = format.replace('b', '');
	                }

	                for (power = 0; power <= suffixes.length; power++) {
	                    min = Math.pow(1024, power);
	                    max = Math.pow(1024, power + 1);

	                    if (value >= min && value < max) {
	                        bytes = bytes + suffixes[power];
	                        if (min > 0) {
	                            value = value / min;
	                        }
	                        break;
	                    }
	                }
	            }

	            // see if ordinal is wanted
	            if (format.indexOf('o') > -1) {
	                // check for space before
	                if (format.indexOf(' o') > -1) {
	                    ord = ' ';
	                    format = format.replace(' o', '');
	                } else {
	                    format = format.replace('o', '');
	                }

	                ord = ord + languages[currentLanguage].ordinal(value);
	            }

	            if (format.indexOf('[.]') > -1) {
	                optDec = true;
	                format = format.replace('[.]', '.');
	            }

	            w = value.toString().split('.')[0];
	            precision = format.split('.')[1];
	            thousands = format.indexOf(',');

	            if (precision) {
	                if (precision.indexOf('[') > -1) {
	                    precision = precision.replace(']', '');
	                    precision = precision.split('[');
	                    d = toFixed(value, precision[0].length + precision[1].length, roundingFunction, precision[1].length);
	                } else {
	                    d = toFixed(value, precision.length, roundingFunction);
	                }

	                w = d.split('.')[0];

	                if (d.split('.')[1].length) {
	                    d = languages[currentLanguage].delimiters.decimal + d.split('.')[1];
	                } else {
	                    d = '';
	                }

	                if (optDec && Number(d.slice(1)) === 0) {
	                    d = '';
	                }
	            } else {
	                w = toFixed(value, null, roundingFunction);
	            }

	            // format number
	            if (w.indexOf('-') > -1) {
	                w = w.slice(1);
	                neg = true;
	            }

	            if (thousands > -1) {
	                w = w.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + languages[currentLanguage].delimiters.thousands);
	            }

	            if (format.indexOf('.') === 0) {
	                w = '';
	            }

	            return (negP && neg ? '(' : '') + (!negP && neg ? '-' : '') + (!neg && signed ? '+' : '') + w + d + (ord ? ord : '') + (abbr ? abbr : '') + (bytes ? bytes : '') + (negP && neg ? ')' : '');
	        }
	    }

	    /************************************
	        Top Level Functions
	    ************************************/

	    numeral = function (input) {
	        if (numeral.isNumeral(input)) {
	            input = input.value();
	        } else if (input === 0 || typeof input === 'undefined') {
	            input = 0;
	        } else if (!Number(input)) {
	            input = numeral.fn.unformat(input);
	        }

	        return new Numeral(Number(input));
	    };

	    // version number
	    numeral.version = VERSION;

	    // compare numeral object
	    numeral.isNumeral = function (obj) {
	        return obj instanceof Numeral;
	    };

	    // This function will load languages and then set the global language.  If
	    // no arguments are passed in, it will simply return the current global
	    // language key.
	    numeral.language = function (key, values) {
	        if (!key) {
	            return currentLanguage;
	        }

	        if (key && !values) {
	            if (!languages[key]) {
	                throw new Error('Unknown language : ' + key);
	            }
	            currentLanguage = key;
	        }

	        if (values || !languages[key]) {
	            loadLanguage(key, values);
	        }

	        return numeral;
	    };

	    // This function provides access to the loaded language data.  If
	    // no arguments are passed in, it will simply return the current
	    // global language object.
	    numeral.languageData = function (key) {
	        if (!key) {
	            return languages[currentLanguage];
	        }

	        if (!languages[key]) {
	            throw new Error('Unknown language : ' + key);
	        }

	        return languages[key];
	    };

	    numeral.language('en', {
	        delimiters: {
	            thousands: ',',
	            decimal: '.'
	        },
	        abbreviations: {
	            thousand: 'k',
	            million: 'm',
	            billion: 'b',
	            trillion: 't'
	        },
	        ordinal: function ordinal(number) {
	            var b = number % 10;
	            return ~ ~(number % 100 / 10) === 1 ? 'th' : b === 1 ? 'st' : b === 2 ? 'nd' : b === 3 ? 'rd' : 'th';
	        },
	        currency: {
	            symbol: '$'
	        }
	    });

	    numeral.zeroFormat = function (format) {
	        zeroFormat = typeof format === 'string' ? format : null;
	    };

	    numeral.defaultFormat = function (format) {
	        defaultFormat = typeof format === 'string' ? format : '0.0';
	    };

	    /************************************
	        Helpers
	    ************************************/

	    function loadLanguage(key, values) {
	        languages[key] = values;
	    }

	    /************************************
	        Floating-point helpers
	    ************************************/

	    // The floating-point helper functions and implementation
	    // borrows heavily from sinful.js: http://guipn.github.io/sinful.js/

	    /**
	     * Array.prototype.reduce for browsers that don't support it
	     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce#Compatibility
	     */
	    if ('function' !== typeof Array.prototype.reduce) {
	        Array.prototype.reduce = function (callback, opt_initialValue) {
	            'use strict';

	            if (null === this || 'undefined' === typeof this) {
	                // At the moment all modern browsers, that support strict mode, have
	                // native implementation of Array.prototype.reduce. For instance, IE8
	                // does not support strict mode, so this check is actually useless.
	                throw new TypeError('Array.prototype.reduce called on null or undefined');
	            }

	            if ('function' !== typeof callback) {
	                throw new TypeError(callback + ' is not a function');
	            }

	            var index,
	                value,
	                length = this.length >>> 0,
	                isValueSet = false;

	            if (1 < arguments.length) {
	                value = opt_initialValue;
	                isValueSet = true;
	            }

	            for (index = 0; length > index; ++index) {
	                if (this.hasOwnProperty(index)) {
	                    if (isValueSet) {
	                        value = callback(value, this[index], index, this);
	                    } else {
	                        value = this[index];
	                        isValueSet = true;
	                    }
	                }
	            }

	            if (!isValueSet) {
	                throw new TypeError('Reduce of empty array with no initial value');
	            }

	            return value;
	        };
	    }

	    /**
	     * Computes the multiplier necessary to make x >= 1,
	     * effectively eliminating miscalculations caused by
	     * finite precision.
	     */
	    function multiplier(x) {
	        var parts = x.toString().split('.');
	        if (parts.length < 2) {
	            return 1;
	        }
	        return Math.pow(10, parts[1].length);
	    }

	    /**
	     * Given a variable number of arguments, returns the maximum
	     * multiplier that must be used to normalize an operation involving
	     * all of them.
	     */
	    function correctionFactor() {
	        var args = Array.prototype.slice.call(arguments);
	        return args.reduce(function (prev, next) {
	            var mp = multiplier(prev),
	                mn = multiplier(next);
	            return mp > mn ? mp : mn;
	        }, -Infinity);
	    }

	    /************************************
	        Numeral Prototype
	    ************************************/

	    numeral.fn = Numeral.prototype = {

	        clone: function clone() {
	            return numeral(this);
	        },

	        format: function format(inputString, roundingFunction) {
	            return formatNumeral(this, inputString ? inputString : defaultFormat, roundingFunction !== undefined ? roundingFunction : Math.round);
	        },

	        unformat: function unformat(inputString) {
	            if (Object.prototype.toString.call(inputString) === '[object Number]') {
	                return inputString;
	            }
	            return unformatNumeral(this, inputString ? inputString : defaultFormat);
	        },

	        value: function value() {
	            return this._value;
	        },

	        valueOf: function valueOf() {
	            return this._value;
	        },

	        set: function set(value) {
	            this._value = Number(value);
	            return this;
	        },

	        add: function add(value) {
	            var corrFactor = correctionFactor.call(null, this._value, value);
	            function cback(accum, curr, currI, O) {
	                return accum + corrFactor * curr;
	            }
	            this._value = [this._value, value].reduce(cback, 0) / corrFactor;
	            return this;
	        },

	        subtract: function subtract(value) {
	            var corrFactor = correctionFactor.call(null, this._value, value);
	            function cback(accum, curr, currI, O) {
	                return accum - corrFactor * curr;
	            }
	            this._value = [value].reduce(cback, this._value * corrFactor) / corrFactor;
	            return this;
	        },

	        multiply: function multiply(value) {
	            function cback(accum, curr, currI, O) {
	                var corrFactor = correctionFactor(accum, curr);
	                return accum * corrFactor * (curr * corrFactor) / (corrFactor * corrFactor);
	            }
	            this._value = [this._value, value].reduce(cback, 1);
	            return this;
	        },

	        divide: function divide(value) {
	            function cback(accum, curr, currI, O) {
	                var corrFactor = correctionFactor(accum, curr);
	                return accum * corrFactor / (curr * corrFactor);
	            }
	            this._value = [this._value, value].reduce(cback);
	            return this;
	        },

	        difference: function difference(value) {
	            return Math.abs(numeral(this._value).subtract(value).value());
	        }

	    };

	    /************************************
	        Exposing Numeral
	    ************************************/

	    // CommonJS module is defined
	    if (hasModule) {
	        module.exports = numeral;
	    }

	    /*global ender:false */
	    if (typeof ender === 'undefined') {
	        // here, `this` means `window` in the browser, or `global` on the server
	        // add `numeral` as a global object via a string identifier,
	        // for Closure Compiler 'advanced' mode
	        this['numeral'] = numeral;
	    }

	    /*global define:false */
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
	            return numeral;
	        }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    }
	}).call(undefined);

/***/ }
/******/ ]);