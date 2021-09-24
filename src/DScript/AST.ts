export type Script = Declaration[];

export type Declaration = VarDeclaration | FuncDeclaration | TriggerDeclaration;

export type VarDeclaration = {
  _: "var";
  scope?: Scope;
  type: VarType;
  name: string;
  value: Expression;
};

export type FuncDeclaration = {
  _: "func";
  scope?: Scope;
  type: VarType;
  name: string;
  args: TypeName[];
  code: Statement[];
};

export type TriggerDeclaration = {
  _: "trigger";
  trigger: string;
  name: string;
  mods?: TriggerMod[];
};

export type Statement = Assignment | IfStatement;

export type Assignment = { _: "assign"; name: Expression; value: Expression };

export type IfStatement = {
  _: "if";
  value: Expression;
  positive: Statement[];
  negative?: Statement[];
};

export type Expression = Value | BinaryExpression | UnaryExpression;

export type BinaryExpression = {
  _: "binary";
  op: BinaryOp;
  left: Expression;
  right: Expression;
};

export type UnaryExpression = { _: "unary"; op: UnaryOp; value: Expression };

export type TypeName = { type: VarType; name: string };

export type Value = NumberValue | StringValue | NameValue | CallValue;
export type NumberValue = [type: "number", value: number];
export type StringValue = [type: "string", value: string];
export type NameValue = [type: "name", ...parts: string[]];
export type CallValue = [type: "call", name: string, ...args: Expression[]];

export type BinaryOp = ComparisonOp | ArithmeticOp;

export type ComparisonOp = "==" | "!=" | ">" | ">=" | "<" | "<=";
export type ArithmeticOp = "+" | "-" | "*" | "/" | "^";
export type UnaryOp = "-" | "!";

export type Scope = "world" | "zone";

export type TriggerMod = "once";

export type VarType = "coord" | "flag" | "number" | "string" | "void";
