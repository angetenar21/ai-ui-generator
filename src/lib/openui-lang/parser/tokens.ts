// ─────────────────────────────────────────────────────────────────────────────
// Token types for openui-lang
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Token type discriminant. Uses a const object to be compatible with
 * erasableSyntaxOnly mode while keeping zero-cost numeric values.
 */
export const T = {
  Newline: 0,
  LParen: 1, // (
  RParen: 2, // )
  LBrack: 3, // [
  RBrack: 4, // ]
  LBrace: 5, // {
  RBrace: 6, // }
  Comma: 7, // ,
  Colon: 8, // :
  Equals: 9, // =
  True: 10,
  False: 11,
  Null: 12,
  EOF: 13,
  Str: 14, // carries string value
  Num: 15, // carries numeric value
  Ident: 16, // lowercase identifier — becomes a reference
  Type: 17, // PascalCase identifier — becomes a component name or reference
  // Reactive & expression tokens
  StateVar: 18, // $identifier — reactive state reference
  Dot: 19, // .
  Plus: 20, // +
  Minus: 21, // -
  Star: 22, // *
  Slash: 23, // /
  Percent: 24, // %
  EqEq: 25, // ==
  NotEq: 26, // !=
  Greater: 27, // >
  Less: 28, // <
  GreaterEq: 29, // >=
  LessEq: 30, // <=
  And: 31, // &&
  Or: 32, // ||
  Not: 33, // !
  Question: 34, // ?
  BuiltinCall: 35, // @identifier — builtin function call
} as const;

export type T = (typeof T)[keyof typeof T];

export type Token = {
  t: T;
  v?: string | number;
};
