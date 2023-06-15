const lex = require('./helpers/lexical-analyzer')
const parse = require('./helpers/syntax-parser')
const { execute, globalEnv } = require('./helpers/executor')

exports.lex = lex
exports.parse = parse
exports.execute = execute
exports.globalEnv = globalEnv
exports.default = {
  lex,
  parse,
  execute
}