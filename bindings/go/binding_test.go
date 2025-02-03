package tree_sitter_chs_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_chs "github.com/marcosandradev/tree-sitter-chs/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_chs.Language())
	if language == nil {
		t.Errorf("Error loading CHS grammar")
	}
}
