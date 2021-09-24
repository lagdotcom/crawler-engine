import {
  BinaryExpression,
  BinaryOp,
  CallValue,
  Declaration,
  Expression,
  FuncDeclaration,
  IfStatement,
  Script,
  Statement,
  TriggerDeclaration,
  TypeName,
  VarDeclaration,
} from "./AST";

const precedences: Record<BinaryOp, number> = {
  "==": 0,
  "!=": 0,
  ">=": 0,
  "<=": 0,
  ">": 0,
  "<": 0,

  "+": 1,
  "-": 1,

  "*": 2,
  "/": 2,

  "^": 3,
};

export default class PrettyPrinter {
  visit(s: Script): string {
    return s.map((d) => this.visitDeclaration(d)).join("\n");
  }

  visitDeclaration(d: Declaration): string {
    switch (d._) {
      case "func":
        return this.visitFunc(d);
      case "trigger":
        return this.visitTrigger(d);
      case "var":
        return this.visitVar(d);
    }
  }

  visitTrigger(t: TriggerDeclaration): string {
    const mods = t.mods ? " " + t.mods.join(" ") : "";
    return `${t.trigger}: ${t.name}${mods};`;
  }

  visitVar(v: VarDeclaration): string {
    return `${v.scope || ""}var ${v.type} ${v.name} = ${this.visitExpression(
      v.value
    )};`;
  }

  visitFunc(f: FuncDeclaration): string {
    const scope = f.scope ? f.scope + " " : "";

    return `${scope}${f.name}(${this.visitFuncArgs(
      f.args
    )}) ${this.visitCodeBlock(f.code)}`;
  }

  visitFuncArgs(as: TypeName[]): string {
    return as.map((a) => this.visitFuncArg(a)).join(", ");
  }

  visitFuncArg(a: TypeName): string {
    return `${a.type} ${a.name}`;
  }

  visitCodeBlock(c: Statement[], indent = ""): string {
    const inner = indent + "  ";

    let code = "{\n";
    code += c.map((s) => inner + this.visitStatement(s, inner)).join("\n");
    code += "\n" + indent + "}";

    return code;
  }

  visitStatement(s: Statement, indent = ""): string {
    switch (s._) {
      case "assign":
        return `${this.visitExpression(s.name)} = ${this.visitExpression(
          s.value
        )};`;
      case "if":
        return this.visitIfStatement(s, indent);
    }
  }

  visitIfStatement(s: IfStatement, indent = ""): string {
    const expr = this.visitExpression(s.value);
    const pos = this.visitCodeBlock(s.positive, indent);
    const neg = s.negative
      ? " else " + this.visitCodeBlock(s.negative, indent)
      : "";
    return `if (${expr}) ${pos}${neg}`;
  }

  visitExpression(x: Expression, parent = -1): string {
    if ("_" in x) {
      switch (x._) {
        case "binary":
          return this.visitBinaryExpression(x, parent);

        case "unary":
          return `${x.op}${this.visitExpression(x.value)}`;
      }
    }

    switch (x[0]) {
      case "number":
        return x[1].toString(10);
      case "string":
        return x[1];
      case "name":
        return x.slice(1).join(".");
      case "call":
        return this.visitCallValue(x);
    }
  }

  visitBinaryExpression(x: BinaryExpression, parent = -1): string {
    const precedence = precedences[x.op];
    const addParens = precedence < parent;

    return `${addParens ? "(" : ""}${this.visitExpression(
      x.left,
      precedence
    )} ${x.op} ${this.visitExpression(x.right, precedence)}${
      addParens ? ")" : ""
    }`;
  }

  visitCallValue(x: CallValue): string {
    const [, name, ...args] = x;
    return `${name}(${args.map((a) => this.visitExpression(a)).join(", ")})`;
  }
}
