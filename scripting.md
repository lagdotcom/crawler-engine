# DungeonScript

Dungeon interactivity is achieved through scripting. Any Grid Cartographer note beginning with `#DSCRIPT` will be parsed as a script.

## Syntax

- Comments start with `#` and last the whole line.
- Variables, functions, etc. must start with a letter and can only contain letters, numbers and underscores.

## Types

- `coord`: structure with `x` and `y` values
- `flag`: on or off
- `number`
- `string`
- `void`: only used for functions with no return value

## Definitions

### Variables

`var/zonevar/worldvar type name = expression;` creates a scoped variable.

### Functions

`[world|zone] type name(...args) { ... }` creates a function.

### Triggers

`trigger: name [modifier];` sets up an event trigger. Modifier can be:

- `once`: only triggers once, uses a cell-scoped flag called `name__triggered`

Trigger can be:

- `canMove(number dir)`: when party tries to leave this cell
- `entered()`: when party enters this cell
- `left()`: when party leaves this cell
- `turned()`: when party turns in this cell
- `zoneCanMove(number dir)`: when party tries to move in this zone
- `zoneEntered()`: when party enters a cell in this zone
- `zoneLeft()`: when party leaves a cell in this zone
- `zoneTurned()`: when party turns in this zone

## Global Variables

- `Party`
  - `coord position`
  - `Character[] members`
- `Zone`
  - `string name`
  - `number width`
  - `number height`

## Global Functions

- `Cancel()`: tries to cancel the current event (only useful in `canMove`/`zoneCanMove` currently)
- `Roll(number dice, number faces)`: rolls some dice, returns the total
