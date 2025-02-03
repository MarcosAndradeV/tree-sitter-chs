import XCTest
import SwiftTreeSitter
import TreeSitterChs

final class TreeSitterChsTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_chs())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading CHS grammar")
    }
}
