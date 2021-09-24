@{%
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
%}

@preprocessor typescript
@lexer lexer

input -> _ inputline:* {% ([,lines]) => lines %}
inputline -> declaration _ {% id %}
declaration -> vardecl {% id %}
             | funcdecl {% id %}
             | triggerdecl {% id %}

vardecl -> "worldvar" __ typename _ "=" _ expression _ ";" {% ([,,{type,name},,,,value]) => ({ _: "var", scope: "world", type, name, value}) %}
         | "zonevar" __ typename _ "=" _ expression _ ";" {% ([,,{type,name},,,,value]) => ({ _: "var", scope: "zone", type, name, value}) %}
         | "var" __ typename _ "=" _ expression _ ";" {% ([,,{type,name},,,,value]) => ({ _: "var", type, name, value}) %}
funcdecl -> scope? __ typename _ funcdeclargs _ codeblock {% ([scope,,{type,name},,args,,code]) => ({ _: "func", scope, type, name, args, code }) %}
triggerdecl -> rawname ":" _ name __ triggermods _ ";" {% ([trigger,,,name,,mods]) => ({ _: "trigger", trigger, name, mods }) %}
             | rawname ":" _ rawname _ ";" {% ([trigger,,,name]) => ({ _: "trigger", trigger, name }) %}

funcdeclargs -> "(" _ argdecls _ ")" {% ([,,args]) => args %}
argdecls -> null {% () => [] %}
          | argdecl
          | argdecls _ "," _ argdecl {% ([args,,,,arg]) => [...args, arg] %}
argdecl -> typename {% id %}

funcargs -> "(" _ args _ ")" {% ([,,args]) => args %}
args -> null {% () => [] %}
      | arg
      | args _ "," _ arg {% ([args,,,,arg]) => [...args, arg] %}
arg -> expression {% id %}

triggermods -> triggermod
             | triggermods __ triggermod {% ([mods,,mod]) => [...mods, mod] %}

codeblock -> "{" _ codeline:* "}" {% ([,,code]) => code %}
codeline -> code _ {% id %}
code -> assignment {% id %}
      | ifstmt {% id %}

assignment -> name _ "=" _ expression _ ";" {% ([name,,,,value]) => ({ _: "assign", name, value }) %}
ifstmt -> "if" _ "(" _ comparison _ ")" _ codeblock {% ([,,,,value,,,,positive]) => ({ _: "if", value, positive }) %}
        | "if" _ "(" _ comparison _ ")" _ codeblock _ "else" _ codeblock {% ([,,,,value,,,,positive,,,,negative]) => ({ _: "if", value, positive, negative }) %}

comparison -> expression {% id %}
            | expression _ compop _ expression {% ([left,,op,,right]) => ({ _: "binary", op, left, right }) %}

expression -> math {% id %}

math    -> sum {% id %}
sum     -> sum _ sumop _ product {% ([left,,op,,right]) => ({ _: "binary", op, left, right }) %}
         | product {% id %}
product -> product _ mulop _ exp {% ([left,,op,,right]) => ({ _: "binary", op, left, right }) %}
         | exp {% id %}
exp     -> unary _ "^" _ exp {% ([left,,op,,right]) => ({ _: "binary", op, left, right }) %}
         | unary {% id %}
unary   -> unaryop primary {% ([op,value]) => ({ _: "unary", op, value }) %}
         | primary {% id %}

primary -> value {% id %}
         | "(" _ expression _ ")" {% ([,,expr]) => expr %}

compop  -> "==" {% lit %}
         | "!=" {% lit %}
         | ">" {% lit %}
         | ">=" {% lit %}
         | "<" {% lit %}
         | "<=" {% lit %}

sumop   -> "+" {% lit %}
         | "-" {% lit %}
mulop   -> "*" {% lit %}
         | "/" {% lit %}

unaryop -> "-" {% lit %}
         | "!" {% lit %}

value -> name {% id %}
       | string {% id %}
       | number {% id %}
       | rawname funcargs {% ([name,args]) => ["call", name, ...args] %}

typename -> type __ rawname {% ([type,,name]) => ({type, name}) %}

scope? -> null {% () => undefined %}
        | scope {% id %}
scope -> "world" {% lit %}
       | "zone" {% lit %}
triggermod -> "once" {% lit %}
type -> "coord" {% lit %}
      | "flag" {% lit %}
      | "number" {% lit %}
      | "string" {% lit %}
      | "void" {% lit %}
rawname -> %name {% lit %}
name -> %name {% ([token]) => ["name", token.value] %}
      | name "." %name {% ([left,,right]) => [...left, right.value] %}
number -> %number {% ([token]) => ["number", parseInt(token.value, 10)] %}
string -> %string {% ([token]) => ["string", token.value] %}

__ -> %ws:+ {% () => null %}
_ -> %ws:* {% () => null %}
