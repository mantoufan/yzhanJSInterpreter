const { lex } = require('../../src/index')

describe('Test LR Parser', () => {
  test('let a = null + 1 + "str"', () => {
    expect(JSON.stringify(lex('let a = null + 1 + "str"'))).toEqual(JSON.stringify([{"type": "let", "value": "let"}, {"type": "Identifier", "value": "a"}, {"type": "=", "value": "="}, {"type": "NulLiteral", "value": "null"}, {"type": "+", "value": "+"}, {"type": "NumbericLiteral", "value": "1"}, {"type": "+", "value": "+"}, {"type": "StringLiteral", "value": "\"str\""}, {"type": "EOF"}]))
  })
})