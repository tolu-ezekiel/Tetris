var Game = require('./game');
var game = Game();

process.stdin.setEncoding('utf8');
process.stdin.setRawMode(true);

process.stdin.addListener('data', function (value) {
  if (game.noValidMove()) {
    process.stdout.write("\n-----Game Over!----\n");
    process.exit();
  }
  if (value === '\u0003') {
    process.exit();
  }
  if ("adws".includes(value)) {
    var nextBoard = game.play(value);
    if (nextBoard) {
      game.printBoard(nextBoard);
    } else {
      process.stdout.write(`\n ${value} is an invalid move, the piece will overlap\n`);
    }
  } else {
    process.stdout.write(`\n ${value} is an invalid key\n`);
  }
  process.stdout.write("\n (w => rotate piece counter clockwise) \n (s => rotate piece clockwise) \n (a => move piece left) \n (d => move piece right) \n");
});


game.init();
