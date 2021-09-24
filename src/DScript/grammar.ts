// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }
declare var name: any;
declare var number: any;
declare var string: any;
declare var ws: any;

import { compile, Token } from "moo";

const lexer = compile({
  ws: { match: /[ \t\n\r]+/, lineBreaks: true },
  string: /".*"/,
  name: /[a-zA-Z][a-zA-Z0-9_]*/,
  number: /[0-9]+/,
  lparen: "(",
  rparen: ")",
  assign: "=",
  colon: ":",
  semic: ";",
  comma: ",",
  lbrac: "{",
  rbrac: "}",
  plus: "+",
  minus: "-",
  mul: "*",
  div: "/",
  exp: "^",
  gte: ">=",
  lte: "<=",
  eq: "==",
  ne: "!=",
  gt: ">",
  lt: "<",
  not: "!",
  dot: ".",
});

const lit = ([token]: Token[]): string => token.value;

interface NearleyToken {
  value: any;
  [key: string]: any;
};

interface NearleyLexer {
  reset: (chunk: string, info: any) => void;
  next: () => NearleyToken | undefined;
  save: () => any;
  formatError: (token: never) => string;
  has: (tokenType: string) => boolean;
};

interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any;
};

type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };

interface Grammar {
  Lexer: NearleyLexer | undefined;
  ParserRules: NearleyRule[];
  ParserStart: string;
};

const grammar: Grammar = {
  Lexer: lexer,
  ParserRules: [
    {"name": "input$ebnf$1", "symbols": []},
    {"name": "input$ebnf$1", "symbols": ["input$ebnf$1", "inputline"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "input", "symbols": ["_", "input$ebnf$1"], "postprocess": ([,lines]) => lines},
    {"name": "inputline", "symbols": ["declaration", "_"], "postprocess": id},
    {"name": "declaration", "symbols": ["vardecl"], "postprocess": id},
    {"name": "declaration", "symbols": ["funcdecl"], "postprocess": id},
    {"name": "declaration", "symbols": ["triggerdecl"], "postprocess": id},
    {"name": "vardecl", "symbols": [{"literal":"worldvar"}, "__", "typename", "_", {"literal":"="}, "_", "expression", "_", {"literal":";"}], "postprocess": ([,,{type,name},,,,value]) => ({ _: "var", scope: "world", type, name, value})},
    {"name": "vardecl", "symbols": [{"literal":"zonevar"}, "__", "typename", "_", {"literal":"="}, "_", "expression", "_", {"literal":";"}], "postprocess": ([,,{type,name},,,,value]) => ({ _: "var", scope: "zone", type, name, value})},
    {"name": "vardecl", "symbols": [{"literal":"var"}, "__", "typename", "_", {"literal":"="}, "_", "expression", "_", {"literal":";"}], "postprocess": ([,,{type,name},,,,value]) => ({ _: "var", type, name, value})},
    {"name": "funcdecl", "symbols": ["scope?", "__", "typename", "_", "funcdeclargs", "_", "codeblock"], "postprocess": ([scope,,{type,name},,args,,code]) => ({ _: "func", scope, type, name, args, code })},
    {"name": "triggerdecl", "symbols": ["rawname", {"literal":":"}, "_", "name", "__", "triggermods", "_", {"literal":";"}], "postprocess": ([trigger,,,name,,mods]) => ({ _: "trigger", trigger, name, mods })},
    {"name": "triggerdecl", "symbols": ["rawname", {"literal":":"}, "_", "rawname", "_", {"literal":";"}], "postprocess": ([trigger,,,name]) => ({ _: "trigger", trigger, name })},
    {"name": "funcdeclargs", "symbols": [{"literal":"("}, "_", "argdecls", "_", {"literal":")"}], "postprocess": ([,,args]) => args},
    {"name": "argdecls", "symbols": [], "postprocess": () => []},
    {"name": "argdecls", "symbols": ["argdecl"]},
    {"name": "argdecls", "symbols": ["argdecls", "_", {"literal":","}, "_", "argdecl"], "postprocess": ([args,,,,arg]) => [...args, arg]},
    {"name": "argdecl", "symbols": ["typename"], "postprocess": id},
    {"name": "funcargs", "symbols": [{"literal":"("}, "_", "args", "_", {"literal":")"}], "postprocess": ([,,args]) => args},
    {"name": "args", "symbols": [], "postprocess": () => []},
    {"name": "args", "symbols": ["arg"]},
    {"name": "args", "symbols": ["args", "_", {"literal":","}, "_", "arg"], "postprocess": ([args,,,,arg]) => [...args, arg]},
    {"name": "arg", "symbols": ["expression"], "postprocess": id},
    {"name": "triggermods", "symbols": ["triggermod"]},
    {"name": "triggermods", "symbols": ["triggermods", "__", "triggermod"], "postprocess": ([mods,,mod]) => [...mods, mod]},
    {"name": "codeblock$ebnf$1", "symbols": []},
    {"name": "codeblock$ebnf$1", "symbols": ["codeblock$ebnf$1", "codeline"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "codeblock", "symbols": [{"literal":"{"}, "_", "codeblock$ebnf$1", {"literal":"}"}], "postprocess": ([,,code]) => code},
    {"name": "codeline", "symbols": ["code", "_"], "postprocess": id},
    {"name": "code", "symbols": ["assignment"], "postprocess": id},
    {"name": "code", "symbols": ["ifstmt"], "postprocess": id},
    {"name": "assignment", "symbols": ["name", "_", {"literal":"="}, "_", "expression", "_", {"literal":";"}], "postprocess": ([name,,,,value]) => ({ _: "assign", name, value })},
    {"name": "ifstmt", "symbols": [{"literal":"if"}, "_", {"literal":"("}, "_", "comparison", "_", {"literal":")"}, "_", "codeblock"], "postprocess": ([,,,,value,,,,positive]) => ({ _: "if", value, positive })},
    {"name": "ifstmt", "symbols": [{"literal":"if"}, "_", {"literal":"("}, "_", "comparison", "_", {"literal":")"}, "_", "codeblock", "_", {"literal":"else"}, "_", "codeblock"], "postprocess": ([,,,,value,,,,positive,,,,negative]) => ({ _: "if", value, positive, negative })},
    {"name": "comparison", "symbols": ["expression"], "postprocess": id},
    {"name": "comparison", "symbols": ["expression", "_", "compop", "_", "expression"], "postprocess": ([left,,op,,right]) => ({ _: "binary", op, left, right })},
    {"name": "expression", "symbols": ["math"], "postprocess": id},
    {"name": "math", "symbols": ["sum"], "postprocess": id},
    {"name": "sum", "symbols": ["sum", "_", "sumop", "_", "product"], "postprocess": ([left,,op,,right]) => ({ _: "binary", op, left, right })},
    {"name": "sum", "symbols": ["product"], "postprocess": id},
    {"name": "product", "symbols": ["product", "_", "mulop", "_", "exp"], "postprocess": ([left,,op,,right]) => ({ _: "binary", op, left, right })},
    {"name": "product", "symbols": ["exp"], "postprocess": id},
    {"name": "exp", "symbols": ["unary", "_", {"literal":"^"}, "_", "exp"], "postprocess": ([left,,op,,right]) => ({ _: "binary", op, left, right })},
    {"name": "exp", "symbols": ["unary"], "postprocess": id},
    {"name": "unary", "symbols": ["unaryop", "primary"], "postprocess": ([op,value]) => ({ _: "unary", op, value })},
    {"name": "unary", "symbols": ["primary"], "postprocess": id},
    {"name": "primary", "symbols": ["value"], "postprocess": id},
    {"name": "primary", "symbols": [{"literal":"("}, "_", "expression", "_", {"literal":")"}], "postprocess": ([,,expr]) => expr},
    {"name": "compop", "symbols": [{"literal":"=="}], "postprocess": lit},
    {"name": "compop", "symbols": [{"literal":"!="}], "postprocess": lit},
    {"name": "compop", "symbols": [{"literal":">"}], "postprocess": lit},
    {"name": "compop", "symbols": [{"literal":">="}], "postprocess": lit},
    {"name": "compop", "symbols": [{"literal":"<"}], "postprocess": lit},
    {"name": "compop", "symbols": [{"literal":"<="}], "postprocess": lit},
    {"name": "sumop", "symbols": [{"literal":"+"}], "postprocess": lit},
    {"name": "sumop", "symbols": [{"literal":"-"}], "postprocess": lit},
    {"name": "mulop", "symbols": [{"literal":"*"}], "postprocess": lit},
    {"name": "mulop", "symbols": [{"literal":"/"}], "postprocess": lit},
    {"name": "unaryop", "symbols": [{"literal":"-"}], "postprocess": lit},
    {"name": "unaryop", "symbols": [{"literal":"!"}], "postprocess": lit},
    {"name": "value", "symbols": ["name"], "postprocess": id},
    {"name": "value", "symbols": ["string"], "postprocess": id},
    {"name": "value", "symbols": ["number"], "postprocess": id},
    {"name": "value", "symbols": ["rawname", "funcargs"], "postprocess": ([name,args]) => ["call", name, ...args]},
    {"name": "typename", "symbols": ["type", "__", "rawname"], "postprocess": ([type,,name]) => ({type, name})},
    {"name": "scope?", "symbols": [], "postprocess": () => undefined},
    {"name": "scope?", "symbols": ["scope"], "postprocess": id},
    {"name": "scope", "symbols": [{"literal":"world"}], "postprocess": lit},
    {"name": "scope", "symbols": [{"literal":"zone"}], "postprocess": lit},
    {"name": "triggermod", "symbols": [{"literal":"once"}], "postprocess": lit},
    {"name": "type", "symbols": [{"literal":"coord"}], "postprocess": lit},
    {"name": "type", "symbols": [{"literal":"flag"}], "postprocess": lit},
    {"name": "type", "symbols": [{"literal":"number"}], "postprocess": lit},
    {"name": "type", "symbols": [{"literal":"string"}], "postprocess": lit},
    {"name": "type", "symbols": [{"literal":"void"}], "postprocess": lit},
    {"name": "rawname", "symbols": [(lexer.has("name") ? {type: "name"} : name)], "postprocess": lit},
    {"name": "name", "symbols": [(lexer.has("name") ? {type: "name"} : name)], "postprocess": ([token]) => ["name", token.value]},
    {"name": "name", "symbols": ["name", {"literal":"."}, (lexer.has("name") ? {type: "name"} : name)], "postprocess": ([left,,right]) => [...left, right.value]},
    {"name": "number", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": ([token]) => ["number", parseInt(token.value, 10)]},
    {"name": "string", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess": ([token]) => ["string", token.value]},
    {"name": "__$ebnf$1", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": () => null},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": () => null}
  ],
  ParserStart: "input",
};

export default grammar;
