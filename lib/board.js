
module.exports = {
  Board:  Board,
  Player: Player,
  Unit:   Unit
};


function Board (config) {
  if (!(this instanceof Board)) return new Board(config);

  this.paths = {};
  this.players = {};
  this.nodes = {};

  if (config) this.load(config);
}

Board.RESERVE = '*';
Board.GRAVEYARD = '+';
Board.SPECIAL_NAMES = [Board.GRAVEYARD, Board.RESERVE];

Board.prototype.load = function (config) {
  if (!config) {
    return;
  }

  if (config.paths) {
    for (var node in config.paths) {
      if (config.paths.hasOwnProperty(node)) {
        this.addPath(node, config.paths[node]);
      }
    }
  }

  return this;
};

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
  if (!this.nodes[from]) {
    this.nodes[from] = {
      units: []
    };
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

Board.prototype.checkMoveUnit = function (unit, to) {
  // TODO target = source
  // TODO target = special name
  // Unit is dead: cannot move
  if (unit.health <= 0 || unit.position === Board.GRAVEYARD) {
    throw new Error('Cannot move dead unit');
  }
  // TODO Target is occupied by enemy player
  // TODO Target is unreachable
}

Board.prototype.getUnitsAt = function (node) {
  return this.nodes[node] && this.nodes[node].units;
}

Board.prototype.moveUnit = function (unit, to) {
  this.checkMoveUnit(unit, to);
  this.unit.position = to;
  // TODO update this.nodes[source].units
  // TODO update this.nodes[target].units
}


function Player (board, name) {
  // FIXME UUID
  this.id = String(Math.round(Math.random()*1000));

  this.name = name;
  this.units = {};

  this.board = board;
  this.board.addPlayer(this);
}

Player.prototype.addUnit = function (unit) {
  this.units[unit.id] = unit;
};


function Unit (player, force, armor, health) {
  // FIXME UUID
  this.id = String(Math.round(Math.random()*1000));

  this.force = force;
  this.armor = armor;
  this.health = health;

  this.board = board;
  this.position = BOARD.RESERVE;

  this.player = player;
  this.player.addUnit(this);
}

Unit.prototype.moveTo = function (node) {
  this.board.moveUnit(unit, node);
  this.position = node;
};
