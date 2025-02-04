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
] @keyword
(type_identifier) @type
(integer_literal) @number
[
  (string_literal)
  (char_literal)
] @string
(fn_decl name: (ident) @function)
(call_expression arguments: (arguments) @call.inner)
