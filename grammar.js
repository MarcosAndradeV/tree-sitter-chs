/**
 * @file CHS tree sitter
 * @author Marcos V. Andrade Almeida <mastermarcos1212@hotmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "chs",

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => "hello"
  }
});
