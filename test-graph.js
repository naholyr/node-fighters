var Board = require('./lib/board').Board;
var config = require('./board.json');

/*
   [A]----+-----[B]-----[C]-------[H]
    |     |      |       |         |
    |     |      |       |         |
    |    [G]----[F]      |         |
    |     |      |       |         |
    |     |      |       |         |
    +----[D]-----+------[E]        |
          |                        |
          +------------------------+
*/

var board = new Board(config);

console.log(board.nodesReaching('B'));
