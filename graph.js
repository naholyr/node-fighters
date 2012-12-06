
function Board () {
  this.paths = {};
  this.players = {};
}

Board.SPECIAL_NAMES = ['Graveyard', 'Reserve'];

Board.prototype.addPath = function (from, to, oriented) {
  if (~Board.SPECIAL_NAMES.indexOf(from)) {
    throw new Error('Reserved name');
  }
  var self = this;
  if (!Array.isArray(to)) {
    to = [to];
  }
  to = to.map(String);
  from = String(from);
  if (!this.paths[from]) {
    this.paths[from] = [];
  }
  to.forEach(function (to) {
    if (!~self.paths[from].indexOf(to)) {
      self.paths[from].push(to);
    }
  });
  if (!oriented) {
    to.forEach(function (to) {
      self.addPath(to, from, true);
    });
  }

  return this;
};

Board.prototype.reachableNodes = function (from) {
  return this.paths[String(from)] || [];
};

Board.prototype.nodesReaching = function (to) {
  var self = this;
  return Object.keys(self.paths).filter(function (from) {
    return ~self.paths[from].indexOf(to);
  });
};

Board.prototype.addPlayer = function (player) {
  this.players[player.id] = player;

  return this;
}


function Player (board, name) {
  // FIXME UUID
  this.id = String(Math.round(Math.random()*1000));

  this.name = name;
  this.units = [];

  this.board = board;
  this.board.addPlayer(this);
}




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

var board = (new Board)
  .addPath('A', ['B', 'G', 'D'])
  .addPath('B', ['C', 'F'])
  .addPath('C', ['E', 'H'])
  .addPath('G', ['F', 'D'])
  .addPath('F', ['D', 'E'])
  .addPath('D', 'H')
  .addPath('E', 'D')

console.log(board.nodesReaching('B'));
