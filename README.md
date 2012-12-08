# Node Fighters

A web-based game where you control a group of fighters in a battle for the control of strategic points in the board called "nodes".

## Basic rules

### Turn-based strategy game

Each player plays at his own turn. At the beginning of a turn you gain a certain amount of action points (AP), you can use APs to give orders to your fighters.

### The board

The board is quite specific: it's not the usual board, but more like a graph! It means some boards can bend the whole rules of space and time, allowing moves that could not be possible in other situations. That gives a new dimension to the term "board-game" ;)

Here is a sample board:

```
   [A]----+-----[B]-----[C]-------[H]
    |     |      |       |         |
    |     |      |       |         |
    |    [G]----[F]      |         |
    |     |      |       |         |
    |     |      |       |         |
    +----[D]-----+------[E]        |
          |                        |
          +------------------------+
```

As I said, it's not your usual board.

In every board, the following rules will be always true:

* Every node is reachable from your current position.
* A "Checkpoint" is a special node. It has no specific property instead it's a checkpoint, a strategic point on the board.
* Usually, every node with 3 or more links is a checkpoint (in our example it will be A, B, C, D, F and G).
* Every board has at least one checkpoint.

A checkpoint is visually identified on the board to distinguish it from standard nodes.

#### Reachable nodes

From a given position, you should be able to reach all directly linked positions. Graphs should never be oriented unless very specific conditions that will be clearly visible.

### Winning the game

The first player who gained control of more than a given number of the checkpoints (usually half of total checkpoints) has won the game.

#### Controlling a checkpoint

To control a checkpoint, you just have to put your flag on it.

Putting a flag on a node can be done by any character with the ability to do it. Those characters are named "leaders", and they usually have other special abilities.

#### Other way of winning

If you kill all the leaders of a player, he can't control anything. He can still player, however he won't be blamed if he gives up. If you kill all leaders of all players, you win.

### Units

Every unit has following characteristics:

* Health [H]: a number which decreases when unit is hit, and when it reaches 0, unit is "dead".
* Defense or Armor [A]: a number which will lower the damages taken from attacks.
* Damages or Force [F]: a number representing the damages unit can deal.

Basically, every unit has two abilities:

* Move: the unit moves from its current node to another, directly linked, and free. A node is "free" until there is no enemy unit on it.
 * Yes, you can have more than one of your units on a given node. If a node is not free, then you have to fight one of the enemy units, if you kill it then your unit will move to this node.
 * Yes, that can be a bad news, prepare your attacks carefully.
* Defend: the unit does not move and will have a bonus of defense
* Attack is available only if [F] is not zero: the unit attacks another reachable unit

#### Abilities

In addition to those basic abilities, you can have some common others:

* Flag: Put a flag on a node. This node is now "controlled" by player. This is how you win the game, when nodes are actually nodes :)
* Heal: Unit gives all ally units some additional health points on the same **controlled** node.
* Jump: Unit can move to a node which is not directly reachable, but two steps away.
* Motivate (passive): Unit gives all ally units on the same **controlled** node a defense and damages bonus.

Some more specific abilites are available for specific units, you'll discover them :)

Each unit is given a role, depending its abilities. Here are some examples:

* Leader: a unit with "Flag" ability (it usually comes with "Motivate" ability too).
* Medic: a unit with "Heal" ability.
* Scout: a unit with "Jump" ability.

A unit can stack roles: you could have a Scout Leader, which would be quite powerful by the way!

#### Fight

A fight is very easy:

* Attacker attacks Defender.
* If Defender has some special passive ability to avoid attack, it tries, and maybe fight ends here.
* Attacker hits Defender: we calculate dealt damages by taking Attacker's [F]orce and substracting Defender's [A]rmor.
* If Attacker or Defender have special passive abilities that can modify dealt damages, let's apply them.
* Defender loses [H]ealth.
* Defender may die.
* If Defender is not dead, and has some kind of "counter-attack" ability, let's apply it now.

#### Death

A dead unit is removed from the board, and is put in the "graveyard". Yes, there may have some units with some kind of "resurrect" ability. You'll discover that later.

### Player's abilities

The player himself has some abilities:

* Recruit a unit: he takes an available unit, and puts it on the board. If player has no unit on the board, he can put the new unit on any free nodes. If he has already put a unit on the board, he must put new ones on a node with a unit of his own. A freshly recruited unit can play right now, that can create a serious suprise effect.
* Destroy a unit: he can kill a unit of his own, once per turn. That may sound strange but you could negociate with an opponent at this cost, or simply remove a unit with an embarassing negative ability. You could also imagine killing your last unit on board, to freely place a new unit wherever you want (oh you're so vicious).
* Give up: he leaves the game, the unite are removed from board. Whenever it was the last opponnents with available leaders, you win.

### Starting the game

When game starts, board is empty. Each player at his turn will recruit a leader on any node of the board. Even a node, why not.
You can imagine being the last player is quite an advantage at the beginning. As attacker has a very big advantage on defender during fights (counter-attack abilities are rare), this advantage is quickly balanced.

### Something more

Nope, you're ready to play. Have fun :)

## Technical information

### Running the project

Requirements:

* node version 0.8.x
* redis version 2.6.x

Clone the project, start your redis server, and start server with `node server.js`. You're all set.
