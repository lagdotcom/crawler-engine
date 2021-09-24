import { Grammar, Parser } from "nearley";

import { Script } from "./AST";
import grammar from "./grammar";
import PrettyPrinter from "./PrettyPrinter";

const parser = new Parser(Grammar.fromCompiled(grammar));
parser.feed(`
worldvar number blah = 0;
zonevar number something = 4;
var number mine = 0;
var flag limit = 0;

void onEnter(flag hello, coord cheese) {
  if (mine < 5) {
    mine = mine + 1;
  } else {
    mine = 999;
    Party.gets.started = (4 + someGlobalCall(limit)) / 8 + strlen("hello there");

    if (!limit) { limit = 1; }
  }
}

entered: onEnter;
`);

if (parser.results.length === 0) throw new Error(`No parsings!`);
if (parser.results.length > 1) throw new Error(`Ambiguous parsing!`);

const tree = parser.results[0] as Script;
console.dir(tree, { depth: null });

console.log(new PrettyPrinter().visit(tree));
