const Reference = require('../classes/Reference')
const Enviroment = require('../classes/Environment')
const Completion = require('../classes/Completion')
const JSObject = require('../classes/JSObject')
const JSFunction = require('../classes/JSFunction')

const globalEnv = new Enviroment()

const getValue = node => {
  const value = execute(node)
  if (value instanceof Reference) return value.get()
  return value
}

const executor = {
  envStack: [globalEnv],
  microTaskQueue: [], // 微任务队列
  runTaskQueue: [], // 宏任务队列
  runTask() {
    
    
    // this.microTaskQueue;
  },
  get currentEnv(){
    return this.envStack[this.envStack.length - 1]
  },
  Identifier(node) {
    return new Reference(this.currentEnv, node.value)
  },
  Parameters(node) {
    if (node.children.length === 1) {
      return execute(node.children[0])
    } else {
      const left = getValue(node.children[0]) ?? []
      const right = getValue(node.children[2])
      return left.concat(right)
    }
  },
  FunctionDeclaration(node) {
    if (node.children.length === 5) {
      const functionName = node.children[1].value
      const functionBody = node.children[4]
      const jsFunction = new JSFunction(functionBody, this, this.currentEnv)
      this.currentEnv.set(functionName, jsFunction)
      return jsFunction
    } else if (node.children.length === 6) {
      const functionName = node.children[1].value
      const parameters = execute(node.children[3])
      const functionBody = node.children[5]
      const jsFunction = new JSFunction(functionBody, this, this.currentEnv, parameters)
      this.currentEnv.set(functionName, jsFunction)
      return jsFunction
    }
  },
  Declaration(node) {
    if (node.children.length === 1) return execute(node.children[0])
    this.currentEnv.set(node.children[1].value, void 0)
    const ref = execute(node.children[1])
    ref.set(execute(node.children[3]))
  },
  NumbericLiteral(node) {
    return node.value * 1
  },
  StringLiteral(node) {
    return node.value.slice(1, -1)
  },
  BooleanLiteral(node) {
    return node.value === 'true'
  },
  NullLiteral() {
    return null
  },
  ObjectLiteral(node) {
    const jsObject = new JSObject()
    if (node.children.length === 3 || node.children.length === 4) {
      const propertyDefinitionList = node.children[1].children
      propertyDefinitionList.forEach(({ children: propertyDefinition }) => {
        const propertyName = execute(propertyDefinition[0])
        const res = execute(propertyDefinition[2])
        const propertyValue = typeof res !== 'object' || res instanceof JSObject ? {
          value: res
        } : res
        jsObject.setProperty(propertyName, propertyValue)
      })
    }
    return jsObject
  },
  Literal(node) {
    return execute(node.children[0])
  },
  Primary(node) {
    if (node.children.length === 1) {
      return execute(node.children[0])
    } else {
      return execute(node.children[1])
    }
  },
  MemberExpression(node) {
    if (node.children.length === 1) {
      return execute(node.children[0])
    } else if (node.children.length === 3) {
      return new Reference(execute(node.children[0]), node.children[2])
    } else {
      return new Reference(execute(node.children[0]), execute(node.children[2]))
    }
  },
  NewExpression(node) {
    if (node.children.length === 1) {
      return execute(node.children[0])
    } else {
      return new execute(node.children[1])
    }
  },
  CallExpression(node) {
    if (node.children.length === 3) {
      const ref = execute(node.children[0])
      const jsFunction = ref.get()
      return jsFunction.call(this.currentEnv)
    }
  },
  LeftHandSideExpression(node) {
    return execute(node.children[0])
  },
  UpdateExpression(node) {
    if (node.children.length === 1) {
      return execute(node.children[0])
    } else {
      let res = void 0
      if (node.children[0].type === '++') { // ++i
        const ref = execute(node.children[1])
        ref.set(res = ref.get() + 1)
      } else if (node.children[0].type === '--') { // --i
        const ref = execute(node.children[1])
        ref.set(res = ref.get() - 1)
      } else if (node.children[1].type === '++') { // i++
        const ref = execute(node.children[0])
        ref.set((res = ref.get()) + 1)
      } else if (node.children[1].type === '--') { // i--
        const ref = execute(node.children[0])
        ref.set((res = ref.get()) - 1)
      }
      return res
    }
  },
  MultiplicativeExpression(node) {
    if (node.children.length === 1) {
      return execute(node.children[0])
    } else {
      const left = getValue(node.children[0])
      const right = getValue(node.children[2])
      if (node.children[1].type === '*') {
        return left * right
      } else if (node.children[1].type === '/') {
        return left / right
      } else {
        return left % right
      }
    }
  },
  AdditiveExpression(node) {
    if (node.children.length === 1) {
      return execute(node.children[0])
    } else {
      const left = getValue(node.children[0])
      const right = getValue(node.children[2])
      if (node.children[1].type === '+') {
        return left + right
      } else {
        return left - right
      }
    }
  },
  RelationalExpression(node) {
    if (node.children.length === 1) {
      return execute(node.children[0])
    } else {
      const left = getValue(node.children[0])
      const right = getValue(node.children[2])
      if (node.children[1].type === '>') {
        return left > right
      } else {
        return left < right
      }
    }
  },
  EqualityExpression(node) {
    if (node.children.length === 1) {
      return execute(node.children[0])
    } else {
      const left = getValue(node.children[0])
      const right = getValue(node.children[2])
      const type = node.children[1].type
      if (type === '==') {
        return left == right
      } else if (type === '!=') {
        return left != right
      } else if (type === '===') {
        return left === right
      }  else if (type === '!==') {
        return left !== right
      }
    }
  },
  BitwiseANDExpression(node) {
    if (node.children.length === 1) {
      return execute(node.children[0])
    } else {
      const left = getValue(node.children[0])
      const right = getValue(node.children[2])
      return left & right
    }
  },
  BitwiseXORExpression(node) {
    if (node.children.length === 1) {
      return execute(node.children[0])
    } else {
      const left = getValue(node.children[0])
      const right = getValue(node.children[2])
      return left ^ right
    }
  },
  BitwiseORExpression(node) {
    if (node.children.length === 1) {
      return execute(node.children[0])
    } else {
      const left = getValue(node.children[0])
      const right = getValue(node.children[2])
      return left | right
    }
  },
  LogicalANDExpression(node) {
    if (node.children.length === 1) {
      return execute(node.children[0])
    } else {
      const left = getValue(node.children[0])
      const right = getValue(node.children[2])
      return left && right
    }
  },
  LogicalORExpression(node) {
    if (node.children.length === 1) {
      return execute(node.children[0])
    } else {
      const left = getValue(node.children[0])
      const right = getValue(node.children[2])
      return left || right
    }
  },
  CoalesceExpression(node) {
    if (node.children.length === 1) {
      return execute(node.children[0])
    } else {
      const left = getValue(node.children[0])
      const right = getValue(node.children[2])
      return left ?? right
    }
  },
  CoalesceExpressionHead(node) {
    if (node.children.length === 1) {
      return execute(node.children[0])
    }
  },
  ShortCircuitExpression(node) {
    if (node.children.length === 1) {
      return execute(node.children[0])
    }
  },
  ConditionalExpression(node) {
    if (node.children.length === 1) {
      return execute(node.children[0])
    } else {
      const flag = execute(node.children[0])
      if (flag) {
        return execute(node.children[2])
      } else {
        return execute(node.children[4])
      }
    }
  },
  AssignmentOperator(node) {
    return node.children[0].type
  },
  AssignmentExpression(node) {
    if (node.children.length === 1) {
      return execute(node.children[0])
    } else {
      const ref = execute(node.children[0])
      const right = getValue(node.children[2])
      let res = void 0
      if (node.children[1].type === '=') {
        ref.set(res = right)
      } else if (node.children[1].type === 'AssignmentOperator') {
        const type = execute(node.children[1])
        if (type === '*=') {
          ref.set(res = ref.get() * right)
        } else if (type === '/=') {
          ref.set(res = ref.get() / right)
        } else if (type === '%=') {
          ref.set(res = ref.get() % right)
        } else if (type === '+=') {
          ref.set(res = ref.get() + right)
        } else if (type === '-=') {
          ref.set(res = ref.get() - right)
        } else if (type === '<<=') {
          ref.set(res = ref.get() << right)
        } else if (type === '>>=') {
          ref.set(res = ref.get() >> right)
        } else if (type === '>>>=') {
          ref.set(res = ref.get() >>> right)
        } else if (type === '&=') {
          ref.set(res = ref.get() & right)
        } else if (type === '^=') {
          ref.set(res = ref.get() ^ right)
        } else if (type === '|=') {
          ref.set(res = ref.get() | right)
        } else if (type === '**=') {
          ref.set(res = ref.get() ** right)
        }
      } else if (node.children[1].type === '&&=') {
        ref.set(res = ref.get() && right)
      } else if (node.children[1].type === '||=') {
        ref.set(res = ref.get() || right)
      } else if (node.children[1].type === '??=') {
        ref.set(res = ref.get() ?? right)
      }
      return res
    }
  },
  Expression(node) {
    if (node.children.length === 1) {
      return execute(node.children[0])
    } else {
      execute(node.children[0])
      return execute(node.children[2])
    }
  },
  ExpressionStatement(node) {
    return new Completion('normal', execute(node.children[0]))
  },
  BlockStatement(node) {
    if (node.children.length === 3) {
      this.envStack.push(new Enviroment(this.currentEnv))
      const ref = execute(node.children[1])
      this.envStack.pop()
      return ref
    }
    return new Completion('normal')
  },
  IfStatement(node) {
    const flag = execute(node.children[2])
    if (node.children.length === 5) {
      if (flag) {
        return execute(node.children[4])
      } else {
        return new Completion('normal')
      }
    } else {
      if (flag) {
        return execute(node.children[4])
      } else {
        return execute(node.children[6])
      }
    }
  },
  ForStatement(node) {
    let start = 2
    if (node.children.length === 10) start++
    const initialExpression = node.children[start]
    const conditionalExpression = node.children[start + 2]
    const finalExpression = node.children[start + 4]
    const cycleBody = node.children[start + 6]
    execute(initialExpression)
    while (execute(conditionalExpression)) {
      const completion = execute(cycleBody)
      if (completion.type === 'break' || completion.type === 'return') {
        return new Completion('normal', completion.value)
      }
      execute(finalExpression)
    }
  },
  BreakableStatement(node) {
    if (node.children.length === 1) {
      return execute(node.children[0])
    }
  },
  BreakStatement(node) {
    return new Completion('break')
  },
  ContinueStatement(node) {
    return new Completion('continue')
  },
  ReturnStatement(node) {
    if (node.children.length === 2) {
      return new Completion('return')
    } else if (node.children.length === 3) {
      const value = execute(node.children[1])
      return new Completion('return', value)
    }
  },
  Statement(node) {
    return execute(node.children[0])
  },
  StatementListItem(node) {
    const res =  execute(node.children[0])
    return res?.type ? res : new Completion('normal', res)
  },
  StatementList(node) {
    if (node.children.length === 1) {
      return execute(node.children[0])
    } else {
      const completion = execute(node.children[0])
      if (completion.type === 'normal') {
        return execute(node.children[1])
      }
      return completion
    }
  },
  Program(node) {
    return execute(node.children[0])
  }
}

const execute = ast => {
  if (executor[ast.type] === void 0) console.log('ast.type', ast.type)
  return executor[ast.type](ast)
}

exports.execute = execute
exports.globalEnv = globalEnv