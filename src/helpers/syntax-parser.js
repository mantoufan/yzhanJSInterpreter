const { rulesMap: defaultRulesMap, initialState: defaultInitialState } = require('../data/conf.js')

function stringify(obj, replacer, space) {
  const cache = new Set()
  
  return JSON.stringify(obj, function(key, value) {
    if (typeof value === 'object' && value !== null) {
      if (cache.has(value)) {
        return '[Circular]'
      }
      cache.add(value)
    }
    if (replacer) {
      return replacer(key, value)
    }
    return value
  }, space)
}

const getClosure = (symbol, rulesMap)  => {
  const rules = []
  const pool = [symbol]
  const visited = new Set()
  while (pool.length !== 0) {
    const current = pool.shift()
    if (rulesMap.has(current) === false) continue
    if (visited.has(current) === true) continue
    const ruleBodys = rulesMap.get(current)
    ruleBodys.forEach(ruleBody => {
      // if (visited.has(ruleBody[0]) === true) return 
      rules.push({ruleBody, $reduce: current})
      pool.push(ruleBody[0])
    })
    visited.add(current)
  }
  return rules
}

const visited = new Map()
const getClosureState = function(state, rulesMap) {
  visited.set(stringify(state), state)
  for (const key of Object.keys(state)) {
    if (key.startsWith('$')) continue
    const closure = getClosure(key, rulesMap)
    closure.forEach(item => {
      const {ruleBody, $reduce: reduce} = item
      let current = state
      ruleBody.forEach(symbol => {
        if (current[symbol] === void 0) current[symbol] = {}
        current = current[symbol]
      })
      current.$reduce = reduce
      current.$count = ruleBody.length
    })
  }
  for (const key of Object.keys(state)) {
    if (key.startsWith('$')) continue
    const id = stringify(state[key])
    if (visited.has(id)) {
      state[key] = visited.get(id)
    } else {
      getClosureState(state[key], rulesMap)
    }
  }
  return state
}

module.exports = function(list, rulesMap = defaultRulesMap, initialState = defaultInitialState) {
  visited.clear()
  getClosureState(initialState, rulesMap)
  const stack = []
  const stateStack = [ initialState ]
  const n = list.length

  const shift = symbol => {
    while (
      (// console.log(stateStack[stateStack.length - 1], symbol), 
      stateStack[stateStack.length - 1][symbol.type] === void 0) &&
      stateStack[stateStack.length - 1].$reduce
    ) {
      reduce()
    }

    // console.log('symbol.type', symbol.type)
    if (stateStack[stateStack.length - 1][symbol.type] === void 0) {
      if (symbol.type === 'EOF' || symbol.type === '}' || hasLineTerminator) {
        shift({
          type: ';',
          value: ';',
        })
        return shift(symbol)
      }
      throw Error('syntax error' + ' type ' + symbol.type)
    }
    stack.push(symbol)
    stateStack.push(stateStack[stateStack.length - 1][symbol.type])
  }

  const reduce = () => {
    const currentState = stateStack[stateStack.length - 1]
    const symbol = {
      type: currentState.$reduce,
      children: []
    }
    for (let i = 0; i < currentState.$count; i++) {
      symbol.children.unshift(stack.pop())
      stateStack.pop()
    }
    shift(symbol)
  }

  let hasLineTerminator = false
  for (let i = 0; i < n; i++) {
    const symbol = list[i]
    if (symbol.type === 'LineTerminator') {
      hasLineTerminator = true
    } else {
      shift(symbol)
      hasLineTerminator = false
    }
  }
  return stack
}