var shapes = require('./shapes.js');
var currentPiece;
var tetrisBoard = [];
var tetrisBoardWidth = 20;
var initialPosition = {row: 0, col: (tetrisBoardWidth/2)-1};


// create new tetris board;
function initialBoard() {
  var row;
  var col;
  for (row = 0; row < tetrisBoardWidth; row++) {
    tetrisBoard[row] = [];
    for (col = 0; col < tetrisBoardWidth; col++) {
      tetrisBoard[row][col] = 0;
    }
  }
}

// generate board with current tetris piece
function generateBoard (currentPiece) {
  var newBoard = JSON.parse(JSON.stringify(tetrisBoard));
  var row;
  var col;
  var width = currentPiece.shape[0].length;
  var height = currentPiece.shape.length;
  for (row = 0; row < height; row++) {
    for (col = 0; col < width; col++) {
      if (currentPiece.shape[row][col] > 0)
        newBoard[row + currentPiece.position.row][col + currentPiece.position.col] = 1;
    }
  }
  return newBoard;
}

// get a random tetris shape
function randomTetrisFigure() {
  var figure = shapes[(Math.random() * shapes.length) | 0].slice();
  return {
    shape: figure,
    position: initialPosition
  };
}

// rotate a shape counter-clockwise
function rotateFigureLeft(shape) {
  var rotatedFigure = [];
  var row;
  var col;
  var height = shape[0].length;
  var width = shape.length;
  for (row = 0; row < height; row++) {
    rotatedFigure[row] = [];
    for (col = 0; col < width; col++) {
      rotatedFigure[row][col] = shape[col][height - row - 1];
    }
  }
  return rotatedFigure;
}

// Rotate a shape Clockwise
function rotateFigureRight(shape) {
  var rotatedFigure = [];
  var row;
  var col;
  var height = shape[0].length;
  var width = shape.length;
  for (row = 0; row < height; row++) {
    rotatedFigure[row] = [];
    for (col = 0; col < width; col++) {
      rotatedFigure[row][col] = shape[width - col - 1][row];
    }
  }
  return rotatedFigure;
}

function validateNewMoveLocation(newShapeLocation) {
  var row; 
  var col;
  var width = newShapeLocation.shape[0].length;
  var height = newShapeLocation.shape.length;
  if (newShapeLocation.position.row + height > tetrisBoardWidth)
    return false;
  if (newShapeLocation.position.row < 0 )
    return false;
  if (newShapeLocation.position.col + width > tetrisBoardWidth)
    return false;
  if (newShapeLocation.position.col < 0)
    return false;
  for (row = 0; row < height; row++) {
    for (col = 0; col < width; col++) {
      if (!newShapeLocation.shape[row][col])
        continue;
      if (tetrisBoard[row + newShapeLocation.position.row][col + newShapeLocation.position.col]) {
        return false;
      }
    }
  }
  return true;
}

function moveLeft(piece) {
  return {
    shape: piece.shape,
    position: {
      row: piece.position.row + 1,
      col: piece.position.col - 1
    }
  };
}

function moveRight(piece) {
  return {
    shape: piece.shape,
    position: {
      row: piece.position.row + 1,
      col: piece.position.col + 1
    }
  };
}

function rotateRight(piece) {
  return {
    shape: rotateFigureRight(piece.shape),
    position: {
      row: piece.position.row + 1,
      col: piece.position.col
    }
  };
}

function rotateLeft(piece) {
  return {
    shape: rotateFigureLeft(piece.shape),
    position: {
      row: piece.position.row + 1,
      col: piece.position.col
    }
  };
}

function hasMoreValidMove(piece) {
  var move;
  move = moveLeft(piece);
  if (validateNewMoveLocation(move)) {
    return true;
  }

  move = moveRight(piece);
  if (validateNewMoveLocation(move)) {
    return true;
  }

  move = rotateRight(piece);
  if (validateNewMoveLocation(move)) {
    return true;
  }

  move = rotateLeft(piece);
  if (validateNewMoveLocation(move)) {
    return true;
  }
  return false;
}



module.exports = function() {
  return {
    printBoard: function (board) {
      var row;
      var col;
      process.stdout.write("\n---- TETRIS GAME ----\n\n\n");
      for (row = 0; row < board.length; row++) {
        process.stdout.write('*');
        for (col = 0; col < board.length; col++) {
          process.stdout.write(board[row][col] ? '*' : ' ');
        }
        process.stdout.write('*' + "\n");
      }
      for (row = 0; row <= board.length; row++) {
        process.stdout.write('*');
      }
      process.stdout.write('*' + "\n");
    },

    init: function() {
      initialBoard();
      currentPiece = randomTetrisFigure();
      this.printBoard(generateBoard(currentPiece));
      process.stdout.write("\n (w => rotate piece counter clockwise) \n (s => rotate piece clockwise) \n (a => move piece left) \n (d => move piece right) \n");
    },

    play: function (value) {
      var newShapeLocation;
      if (value === 'a')
        newShapeLocation = moveLeft(currentPiece);
      if ( value === 'd')
        newShapeLocation = moveRight(currentPiece);
      if ( value === 'w')
        newShapeLocation = rotateLeft(currentPiece);
      if ( value === 's')
        newShapeLocation = rotateRight(currentPiece);

      if (validateNewMoveLocation(newShapeLocation)) {
        currentPiece = newShapeLocation;
      }
      else {
        return false;
      }
      if (!hasMoreValidMove(currentPiece)) {
        tetrisBoard = generateBoard(currentPiece);
        currentPiece = randomTetrisFigure();
        return generateBoard(currentPiece);
      }
      else {
        return generateBoard(currentPiece);
      }
    },
    
    noValidMove: function () {
      return !hasMoreValidMove(currentPiece);
    }
  };
};
