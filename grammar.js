/**
 * @file CHS tree sitter
 * @author Marcos V. Andrade Almeida <mastermarcos1212@hotmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const PREC = {
  call: 15,
  field: 14,
  unary: 12,
  cast: 11,
  multiplicative: 10,
  additive: 9,
  shift: 8,
  bitand: 7,
  bitxor: 6,
  bitor: 5,
  comparative: 4,
  and: 3,
  or: 2,
  assign: 0,
};

module.exports = grammar({
  name: "chs",

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => repeat($._decl),
    _decl: $ => choice(
      $.fn_decl,
      $.extern_fn_decl,
    ),
    fn_decl: $ => seq(
      'fn',
      field("name", $.ident),
      field("parameters", $.parameter_list),
      field("ret_type", optional(seq("->", $.type_identifier))),
      field("body", repeat(seq($._expression, optional(";")))),
      "end"
    ),
    extern_fn_decl: $ => seq(
      'extern',
      'fn',
      field("name", $.ident),
      field("parameters", $.parameter_list),
      field("ret_type", optional(seq("->", $.type_identifier))),
    ),
    parameter_list: $ => seq(
      "(",
      repeat(seq($.ident, ":", $.type_identifier, optional(","))),
      ")",
    ),
    type_identifier: $ => choice(
      "int",
      "void",
      "char",
      "bool",
      "string",
      $.pointer_type,
    ),
    pointer_type: $ => seq(
      "*",
      $.type_identifier
    ),
    ident: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,
    integer_literal: $ => /[0-9][0-9_]*/,

    string_literal: $ => seq(
      '"',
      repeat(choice(
        $.escape_sequence,
        /[^\\']/,
      )),
      '"',
    ),

    char_literal: $ => seq(
      '\'',
      optional(choice(
        seq('\\',
          /[^xu]/,
        ),
        /[^\\']/,
      )),
      '\'',
    ),

    escape_sequence: $ =>
      seq('\\',/[^xu]/,),

    boolean_literal: $ => choice('true', 'false'),

    comment: $ => '//',

    _expression: $ => choice(
      $.ident,
      $.integer_literal,
      $.boolean_literal,
      $.char_literal,
      $.string_literal,
      $.var_decl,
      $.unary_expression,
      $.reference_expression,
      $.if_expression,
      $.while_expression,
      $.call_expression,
      $.binary_expression,
      $.return_expression,
      $.syscall_expression,
      $.cast_expression,
      $.expression_list,
    ),

    expression_list: $ => seq(
      "{",
        seq(repeat($._expression), optional(",")),
      "}",
    ),

    cast_expression: $ => prec(PREC.cast, seq(
      "cast",
      "(",
        $.type_identifier,
      ")",
      $._expression
    )),

    var_decl: $ => seq(
      $.ident,
      ":",
      optional($.type_identifier),
      "=",
      $._expression,
    ),

    unary_expression: $ => prec(PREC.unary, seq(
      choice('-', '*', '!'),
      $._expression,
    )),

    reference_expression: $ => prec(PREC.unary, seq(
      '&',
      field('value', $._expression),
    )),

    while_expression: $ => seq(
      'while',
      field('condition', $._expression),
      field("body", repeat(seq($._expression, optional(";")))),
      "end"
    ),

    if_expression: $ => prec.right(seq(
      'if',
      field('condition', $._expression),
      field("body", repeat(seq($._expression, optional(";")))),
      choice("end",
      optional(
        seq("else", field('alternative', repeat(seq($._expression, optional(";")))), "end")
      ),),
    )),

    call_expression: $ => prec(PREC.call, seq(
      field('function', $._expression),
      field('arguments', $.arguments),
    )),

    syscall_expression: $ => prec(PREC.call, seq(
      "syscall",
      field('arguments', $.arguments),
    )),

    arguments: $ => seq(
      '(',
      sepBy(',', $._expression),
      optional(','),
      ')',
    ),

    binary_expression: $ => {
      const table = [
        [PREC.and, '&&'],
        [PREC.or, '||'],
        [PREC.bitand, '&'],
        [PREC.bitor, '|'],
        // [PREC.bitxor, '^'],
        [PREC.comparative, choice('==', '!=', '<', '<=', '>', '>=')],
        // [PREC.shift, choice('<<', '>>')],
        [PREC.additive, choice('+', '-')],
        [PREC.multiplicative, choice('*', '/', '%')],
      ];

      // @ts-ignore
      return choice(...table.map(([precedence, operator]) => prec.left(precedence, seq(
        field('left', $._expression),
        // @ts-ignore
        field('operator', operator),
        field('right', $._expression),
      ))));
    },


    return_expression: $ => prec.left(PREC.assign, seq(
      "return",
      optional(field('expr', $._expression)),
    )),

  }
});

/**
 * Creates a rule to match one or more of the rules separated by the separator.
 *
 * @param {RuleOrLiteral} sep - The separator to use.
 * @param {RuleOrLiteral} rule
 *
 * @returns {SeqRule}
 */
function sepBy1(sep, rule) {
  return seq(rule, repeat(seq(sep, rule)));
}


/**
 * Creates a rule to optionally match one or more of the rules separated by the separator.
 *
 * @param {RuleOrLiteral} sep - The separator to use.
 * @param {RuleOrLiteral} rule
 *
 * @returns {ChoiceRule}
 */
function sepBy(sep, rule) {
  return optional(sepBy1(sep, rule));
}
