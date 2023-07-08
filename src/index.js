const lex = require('./helpers/lexical-analyzer')
const parse = require('./helpers/syntax-parser')
const { executor, globalEnv } = require('./helpers/executor')

module.exports = {
  lex,
  parse,
  executor,
  globalEnv,
  evaluate(code, map, initialState) {
    const res = executor.execute(parse(lex(code), map, initialState)[0])
    executor.runTask()
    return res
  }
}