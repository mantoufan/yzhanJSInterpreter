const Reference = require('../classes/Reference')
const Enviroment = require('../classes/Environment')
const Completion = require('../classes/Completion')
const JSObject = require('../classes/JSObject')
const JSFunction = require('../classes/JSFunction')
const PromiseFunction = require('../classes/Promise/PromiseFunction')

const globalEnv = new Enviroment()
globalEnv.set('Promise', PromiseFunction)

const executor = {
  envStack: [globalEnv],
  microTaskQueue: [], // 微任务队列
  runTaskQueue: [], // 宏任务队列
  async runTask() { // drain
    while (this.microTaskQueue.length > 0) {
      const microTask = this.microTaskQueue.shift()
      microTask.run()
    }
  },
  execute(ast) {
    if (typeof this[ast.type] !== 'function') console.log('ast.type', ast.type, this[ast.type])
    return this[ast.type](ast)
  },
  getValue(node) {
    const value = this.execute(node)
    if (value instanceof Reference) return value.get()
    return value
  },
  preProcesser: {}, // 预解析器：Find VariableDeclaration FuncitonDeclaration
  get currentEnv(){
    return this.envStack[this.envStack.length - 1]
  },
  Identifier(node) {
    return new Reference(this.currentEnv, node.value)
  },
  Parameters(node) {
    if (node.children.length === 1) {
      return [node.children[0].value]
    } else {
      const left = this.execute(node.children[0]) ?? []
      const right = node.children[2].value
      return left.concat(right)
    }
  },
  FunctionDeclaration(node) {
    if (node.children.length === 5) {
      const functionName = node.children[1].value
      const functionBody = node.children[4]
      const jsFunction = new JSFunction(functionBody, this, this.currentEnv)
      this.currentEnv.declare(functionName)
      this.currentEnv.set(functionName, jsFunction)
    } else if (node.children.length === 6) {
      const functionName = node.children[1].value
      const parameters = this.execute(node.children[3])
      const functionBody = node.children[5]
      const jsFunction = new JSFunction(functionBody, this, this.currentEnv, parameters)
      this.currentEnv.declare(functionName)
      this.currentEnv.set(functionName, jsFunction)
    }
    return new Completion('normal')
  },
  Declaration(node) {
    if (node.children.length === 1) return this.execute(node.children[0])
    this.currentEnv.declare(node.children[1].value)
    this.currentEnv.set(node.children[1].value, void 0)
    const ref = this.execute(node.children[1])
    ref.set(this.execute(node.children[3]))
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
        const propertyName = this.execute(propertyDefinition[0])
        const res = this.execute(propertyDefinition[2])
        const propertyValue = typeof res !== 'object' || res instanceof JSObject ? {
          value: res
        } : res
        jsObject.setProperty(propertyName, propertyValue)
      })
    }
    return jsObject
  },
  Literal(node) {
    return this.execute(node.children[0])
  },
  Primary(node) {
    if (node.children.length === 1) {
      return this.execute(node.children[0])
    } else {
      return this.execute(node.children[1])
    }
  },
  Arguments(node) {
    if (node.children.length === 2) return []
    if (node.children.length === 3 || node.children.length === 4) {
      return this.execute(node.children[1])
    }
  },
  ArgumentList(node) {
    if (node.children.length === 1) {
      return [this.getValue(node.children[0])]
    } else {
      const left = this.execute(node.children[0]) ?? []
      const right = this.getValue(node.children[2].value)
      return left.concat(right)
    }
  },
  MemberExpression(node) {
    if (node.children.length === 1) {
      return this.execute(node.children[0])
    } else if (node.children.length === 3) {
      if (node.children[0].value === 'new') {
        const jsFunction = this.getValue(node.children[1])
        const args = this.getValue(node.children[2])
        return jsFunction.construct(this.currentEnv, args[0])
      } else {
        return new Reference(this.execute(node.children[0]), node.children[2])
      }
    } else if (node.children.length === 4) {
      return new Reference(this.execute(node.children[0]), node.children[2])
    }
  },
  NewExpression(node) {
    if (node.children.length === 1) {
      return this.execute(node.children[0])
    } else {
      return this.execute(node.children[1])
    }
  },
  CallExpression(node) {
    if (node.children.length === 1) {
      return this.execute(node.children[0])
    } else if (node.children.length === 2) {
      const jsFunction = this.execute(node.children[0])
      const args = this.execute(node.children[1])
      return jsFunction.call(this.currentEnv, args)
    }
  },
  CoverCallExpressionAndAsyncArrowHead(node) {
    if (node.children.length === 2) {
      const jsFunction = this.getValue(node.children[0])
      const args = this.execute(node.children[1])
      return jsFunction.call(this.currentEnv, args)
    }
  },
  LeftHandSideExpression(node) {
    return this.execute(node.children[0])
  },
  UpdateExpression(node) {
    if (node.children.length === 1) {
      return this.execute(node.children[0])
    } else {
      let res = void 0
      if (node.children[0].type === '++') { // ++i
        const ref = this.execute(node.children[1])
        ref.set(res = ref.get() + 1)
      } else if (node.children[0].type === '--') { // --i
        const ref = this.execute(node.children[1])
        ref.set(res = ref.get() - 1)
      } else if (node.children[1].type === '++') { // i++
        const ref = this.execute(node.children[0])
        ref.set((res = ref.get()) + 1)
      } else if (node.children[1].type === '--') { // i--
        const ref = this.execute(node.children[0])
        ref.set((res = ref.get()) - 1)
      }
      return res
    }
  },
  MultiplicativeExpression(node) {
    if (node.children.length === 1) {
      return this.execute(node.children[0])
    } else {
      const left = this.getValue(node.children[0])
      const right = this.getValue(node.children[2])
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
      return this.execute(node.children[0])
    } else {
      const left = this.getValue(node.children[0])
      const right = this.getValue(node.children[2])
      if (node.children[1].type === '+') {
        return left + right
      } else {
        return left - right
      }
    }
  },
  RelationalExpression(node) {
    if (node.children.length === 1) {
      return this.execute(node.children[0])
    } else {
      const left = this.getValue(node.children[0])
      const right = this.getValue(node.children[2])
      if (node.children[1].type === '>') {
        return left > right
      } else {
        return left < right
      }
    }
  },
  EqualityExpression(node) {
    if (node.children.length === 1) {
      return this.execute(node.children[0])
    } else {
      const left = this.getValue(node.children[0])
      const right = this.getValue(node.children[2])
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
      return this.execute(node.children[0])
    } else {
      const left = this.getValue(node.children[0])
      const right = this.getValue(node.children[2])
      return left & right
    }
  },
  BitwiseXORExpression(node) {
    if (node.children.length === 1) {
      return this.execute(node.children[0])
    } else {
      const left = this.getValue(node.children[0])
      const right = this.getValue(node.children[2])
      return left ^ right
    }
  },
  BitwiseORExpression(node) {
    if (node.children.length === 1) {
      return this.execute(node.children[0])
    } else {
      const left = this.getValue(node.children[0])
      const right = this.getValue(node.children[2])
      return left | right
    }
  },
  LogicalANDExpression(node) {
    if (node.children.length === 1) {
      return this.execute(node.children[0])
    } else {
      const left = this.getValue(node.children[0])
      const right = this.getValue(node.children[2])
      return left && right
    }
  },
  LogicalORExpression(node) {
    if (node.children.length === 1) {
      return this.execute(node.children[0])
    } else {
      const left = this.getValue(node.children[0])
      const right = this.getValue(node.children[2])
      return left || right
    }
  },
  CoalesceExpression(node) {
    if (node.children.length === 1) {
      return this.execute(node.children[0])
    } else {
      const left = this.getValue(node.children[0])
      const right = this.getValue(node.children[2])
      return left ?? right
    }
  },
  CoalesceExpressionHead(node) {
    if (node.children.length === 1) {
      return this.execute(node.children[0])
    }
  },
  ShortCircuitExpression(node) {
    if (node.children.length === 1) {
      return this.execute(node.children[0])
    }
  },
  ConditionalExpression(node) {
    if (node.children.length === 1) {
      return this.execute(node.children[0])
    } else {
      const flag = this.execute(node.children[0])
      if (flag) {
        return this.execute(node.children[2])
      } else {
        return this.execute(node.children[4])
      }
    }
  },
  AssignmentOperator(node) {
    return node.children[0].type
  },
  AssignmentExpression(node) {
    if (node.children.length === 1) {
      return this.execute(node.children[0])
    } else {
      const ref = this.execute(node.children[0])
      const right = this.getValue(node.children[2])
      let res = void 0
      if (node.children[1].type === '=') {
        ref.set(res = right)
      } else if (node.children[1].type === 'AssignmentOperator') {
        const type = this.execute(node.children[1])
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
      return this.execute(node.children[0])
    } else {
      this.execute(node.children[0])
      return this.execute(node.children[2])
    }
  },
  ExpressionStatement(node) {
    return new Completion('normal', this.execute(node.children[0]))
  },
  BlockStatement(node) {
    if (node.children.length === 3) {
      this.envStack.push(new Enviroment(this.currentEnv))
      const ref = this.execute(node.children[1])
      this.envStack.pop()
      return ref
    }
    return new Completion('normal')
  },
  IfStatement(node) {
    const flag = this.execute(node.children[2])
    if (node.children.length === 5) {
      if (flag) {
        return this.execute(node.children[4])
      } else {
        return new Completion('normal')
      }
    } else {
      if (flag) {
        return this.execute(node.children[4])
      } else {
        return this.execute(node.children[6])
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
    this.execute(initialExpression)
    while (this.execute(conditionalExpression)) {
      const completion = this.execute(cycleBody)
      if (completion.type === 'break' || completion.type === 'return') {
        return new Completion('normal', completion.value)
      }
      this.execute(finalExpression)
    }
  },
  BreakableStatement(node) {
    if (node.children.length === 1) {
      return this.execute(node.children[0])
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
      const value = this.getValue(node.children[1])
      return new Completion('return', value)
    }
  },
  Statement(node) {
    return this.execute(node.children[0])
  },
  StatementListItem(node) {
    const res =  this.execute(node.children[0])
    return res?.type ? res : new Completion('normal', res)
  },
  StatementList(node) {
    if (node.children.length === 1) {
      return this.execute(node.children[0])
    } else {
      const completion = this.execute(node.children[0])
      if (completion.type === 'normal') {
        return this.execute(node.children[1])
      }
      return completion
    }
  },
  Program(node) {
    return this.execute(node.children[0])
  }
}

module.exports = {
  executor,
  globalEnv
}