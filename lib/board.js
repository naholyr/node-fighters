(function (exports) {


exports.Board = Board;
exports.Player = Player;
exports.Unit = Unit;


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

  if (config.paths && config.nodes) {
    for (var node in config.paths) {
      if (config.paths.hasOwnProperty(node) && config.nodes[node]) {
        this.addPath(node, config.paths[node]);
      }
    }
  }

  if (config.players) {
    for (var name in config.players) {
      if (config.players.hasOwnProperty(name)) {
        var player = new Player(this, name);
        if (config.players[name] && config.players[name].units && config.players[name].units.length) {
          for (var i=0; i<config.players[name].units.length; i++) {
            var unitInfo = config.players[name].units[i];
            if (unitInfo) {
              var unit = new Unit(player, unitInfo.force, unitInfo.armor, unitInfo.health);
              if (unitInfo.position) {
                unit.moveTo(unitInfo.position, true);
              }
            }
          }
        }
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
};

Board.prototype.checkMoveUnit = function (unit, to) {
  // Target = source
  if (unit.position == to) {
    throw new Error('Not moving');
  }
  // Special target
  if (~Board.SPECIAL_NAMES.indexOf(to)) {
    throw new Error('Cannot move to special node "' + to + '"');
  }
  // Unit is dead: cannot move
  if (unit.health <= 0 || unit.position === Board.GRAVEYARD) {
    throw new Error('Cannot move dead unit');
  }
  // Target occupied by enemy unit
  var isEnemyUnit = function (otherUnit) {
    return otherUnit.player.id != unit.player.id;
  };
  if (this.getUnitsAt(to).some(isEnemyUnit)) {
    throw new Error('Cannot move to enemy unit, you must attack');
  }
  // Target is unreachable
  if (!~this.reachableNodes(unit.position).indexOf(to)) {
    throw new Error('Target cannot be reached');
  }
};

Board.prototype.getUnitsAt = function (node) {
  return this.nodes[node] && this.nodes[node].units || [];
};

Board.prototype.moveUnit = function (unit, to, noCheck) {
  if (!noCheck) {
    this.checkMoveUnit(unit, to);
  }
  // Remove unit from old position
  var old = unit.position;
  if (this.nodes[old] && this.nodes[old].units) {
    for (var i=0; i<this.nodes[old].units.length; i++) {
      if (this.nodes[old].units[i].id == unit.id) {
        this.nodes[old].units.splice(i, 1);
        break;
      }
    }
  }
  // Update position
  unit.position = to;
  // Add unit to new position
  this.nodes[to].units.push(unit);

  return this;
};


function Player (board, name) {
  if (!(this instanceof Player)) return new Player(board, name);

  // FIXME UUID
  this.id = String(Math.round(Math.random()*1000));

  this.name = name;
  this.units = {};

  this.board = board;
  this.board.addPlayer(this);
}

Player.prototype.addUnit = function (unit) {
  this.units[unit.id] = unit;

  return this;
};


function Unit (player, force, armor, health) {
  if (!(this instanceof Unit)) return new Unit(player, force, armor, health);

  // FIXME UUID
  this.id = String(Math.round(Math.random()*1000));

  this.force = force;
  this.armor = armor;
  this.health = health;

  this.position = Board.RESERVE;

  this.player = player;
  this.player.addUnit(this);
}

Unit.prototype.moveTo = function (node, noCheck) {
  this.player.board.moveUnit(this, node, noCheck);
  this.position = node;

  return this;
};


})(typeof window === 'undefined' ? exports : window);
