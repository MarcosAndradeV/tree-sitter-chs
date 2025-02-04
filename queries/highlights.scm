[
  "fn"
  "end"
  "use"
  "type"
  "syscall"
  "distinct"
  "if"
  "else"
  "while"
  "set"
  "cast"
] @keyword

(type_identifier) @type

(integer_literal) @number

(boolean_literal) @boolean

(ident) @variable

["(" ")" "{" "}"] @punctuation.bracket
[";" "," ":"] @punctuation.delimiter

[
  (string_literal)
  (char_literal)
] @string

(fn_decl name: (ident) @function)
(call_expression function: (ident) @function)
(call_expression arguments: (arguments) @call.inner)

(fn_decl body: (_) @indent)
