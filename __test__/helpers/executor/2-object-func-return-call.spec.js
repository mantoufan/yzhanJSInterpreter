
const { globalEnv, evaluate } = require('../../../src/index')
describe('Test Object And Function', () => {
  const map = new Map([
    ['PropertyDefinition', [
      ['StringLiteral', ':', 'Expression'],
      ['NumbericLiteral', ':', 'Expression']
    ]],
    ['PropertyDefinitionList', [
      ['PropertyDefinition'],
      ['PropertyDefinitionList', ':', 'PropertyDefinition']
    ]],
    ['ObjectLiteral', [
      ['{', '}'],
      ['{', 'PropertyDefinitionList', '}'],
      ['{', 'PropertyDefinitionList', ',', '}'],
    ]],
    ['Literal', [
      ['NumbericLiteral'], 
      ['StringLiteral'], 
      ['BooleanLiteral'], 
      ['NullLiteral'],
      ['ObjectLiteral'],
    ]],
    ['Primary', [
      ['(', 'Expression', ')'], 
      ['Literal'], 
      ['Identifier']
    ]],
    ['Arguments', [
      ['AssignmentExpression'],
      ['Arguments', ',', 'AssignmentExpression']
    ]],
    ['MemberExpression', [
      ['Primary'], 
      ['MemberExpression', '.', 'Identifier'], 
      ['MemberExpression', '[', 'Expression', ']'],
      ['new', 'MemberExpression', '(', 'Arguments', ')'],
      ['MemberExpression', '(', ')'],
    ]],
    ['NewExpression', [
      ['MemberExpression'], 
      ['new', 'NewExpression']
    ]],
    ['CallExpression', [
      ['CallExpression', '.', 'Identifier'],
      ['CallExpression', '[', 'Expression', ']'],
      ['CallExpression', '(', 'Arguments', ')']
    ]],
    ['LeftHandSideExpression', [
      ['MemberExpression'], 
      ['CallExpression'], 
      ['NewExpression']
    ]],
    ['UpdateExpression', [
      ['LeftHandSideExpression'],
      ['LeftHandSideExpression', '++'],
      ['LeftHandSideExpression', '--'],
      ['++', 'LeftHandSideExpression'],
      ['--', 'LeftHandSideExpression']
    ]],
    ['MultiplicativeExpression', [
      ['UpdateExpression'], 
      ['MultiplicativeExpression', '*', 'UpdateExpression'], 
      ['MultiplicativeExpression', '/', 'UpdateExpression'], 
      ['MultiplicativeExpression', '%', 'UpdateExpression']
    ]],
    ['AdditiveExpression', [
      ['MultiplicativeExpression'], 
      ['AdditiveExpression', '+', 'MultiplicativeExpression'], 
      ['AdditiveExpression', '-', 'MultiplicativeExpression']
    ]],
    ['RelationalExpression', [
      ['AdditiveExpression'], 
      ['RelationalExpression', '>', 'AdditiveExpression'], 
      ['RelationalExpression', '<', 'AdditiveExpression']
    ]],
    ['EqualityExpression', [
      ['RelationalExpression'],
      ['EqualityExpression', '==', 'RelationalExpression'],
      ['EqualityExpression', '!=', 'RelationalExpression'],
      ['EqualityExpression', '===', 'RelationalExpression'],
      ['EqualityExpression', '!==', 'RelationalExpression'],
    ]],
    ['BitwiseANDExpression', [
      ['EqualityExpression'],
      ['BitwiseANDExpression', '&', 'EqualityExpression']
    ]],
    ['BitwiseXORExpression', [
      ['BitwiseANDExpression'],
      ['BitwiseXORExpression', '^', 'BitwiseANDExpression']
    ]],
    ['BitwiseORExpression', [
      ['BitwiseXORExpression'],
      ['BitwiseORExpression', '|', 'BitwiseXORExpression']
    ]],
    ['LogicalANDExpression', [
      ['BitwiseORExpression'],
      ['LogicalANDExpression', '&&', 'BitwiseORExpression']
    ]],
    ['LogicalORExpression', [
      ['LogicalANDExpression'],
      ['LogicalORExpression', '||', 'LogicalANDExpression']
    ]],
    ['CoalesceExpression', [
      ['ShortCircuitExpression', '??', 'BitwiseORExpression']
    ]],
    // ['CoalesceExpressionHead', [
    //   ['CoalesceExpression'],
    //   ['BitwiseORExpression']
    // ]],
    ['ShortCircuitExpression', [
      ['LogicalORExpression'],
      ['CoalesceExpression']
    ]],
    ['ConditionalExpression', [
      ['ShortCircuitExpression'],
      ['ShortCircuitExpression', '?', 'AssignmentExpression', ':', 'AssignmentExpression']
    ]],
    ['AssignmentOperator', [
      ['*='],['/='], ['%='], ['+='], ['-='],
      ['<<='], ['>>='], ['>>>='],
      ['&='], ['^='], ['|='], ['**=']
    ]],
    ['AssignmentExpression', [
      ['ConditionalExpression'],
      ['LeftHandSideExpression', '=', 'AssignmentExpression'],
      ['LeftHandSideExpression', 'AssignmentOperator', 'AssignmentExpression'],
      ['LeftHandSideExpression', '&&=', 'AssignmentExpression'],
      ['LeftHandSideExpression', '||=', 'AssignmentExpression'],
      ['LeftHandSideExpression', '??=', 'AssignmentExpression'],
    ]],
    ['Expression', [
      ['AssignmentExpression'], 
      ['Expression', ',', 'AssignmentExpression'],
    ]],
    ['Parameters', [
      ['Identifier'], 
      ['Parameters', ',', 'Identifier']
    ]],
    ['FunctionDeclaration', [
      ['function', 'Identifier', '(', ')', 'BlockStatement'],
      ['function', 'Identifier', '(', 'Parameters', ')', 'BlockStatement']
    ]],
    ['Declaration', [
      ['FunctionDeclaration'],
      ['var', 'Identifier', '=', 'Expression', ';'], 
      ['let', 'Identifier', '=', 'Expression', ';'], 
      ['const', 'Identifier', '=', 'Expression', ';']
    ]],
    ['ExpressionStatement', [
      ['Expression', ';']
    ]],
    ['BlockStatement', [
      ['{', '}'],
      ['{', 'StatementList', '}'],
    ]],
    ['IfStatement', [
      ['if', '(', 'Expression', ')', 'Statement'], 
      ['if', '(', 'Expression', ')', 'else', 'Statement']
    ]],
    ['ForStatement', [
      ['for', '(', 'let', 'Expression', ';', 'Expression', ';', 'Expression', ')', 'Statement'],
      ['for', '(', 'var', 'Expression', ';', 'Expression', ';', 'Expression', ')', 'Statement'],
      ['for', '(', 'Expression', ';', 'Expression', ';', 'Expression', ')', 'Statement']
    ]],
    ['BreakableStatement', [
      ['ForStatement']
    ]],
    ['BreakStatement', [
      ['break', ';'],
      ['break', 'Identifier', ';']
    ]],
    ['ContinueStatement', [
      ['continue', ';'],
      ['continue', 'Identifier', ';']
    ]],
    ['Statement', [
      ['BlockStatement'],
      ['ExpressionStatement'], 
      ['IfStatement'], 
      ['ForStatement'], 
      ['BreakableStatement'],
      ['BreakStatement'],
      ['ContinueStatement'],
      ['Declaration'], 
    ]],
    ['StatementListItem', [
      ['Statement'], 
      ['Declaration']
    ]],
    ['StatementList', [
      ['StatementListItem'], 
      ['StatementList', 'StatementListItem']
    ]],
    ['Program', [['StatementList']]],
  ])
  const initialState = {
    Program: {
      EOF: {
        $end: true
      }
    }
  }

  it('Test JSObject', () => {
    evaluate(`let a = {'b' : 1}`, map, initialState)
    expect(globalEnv.get('a').getProperty('b')).toBe(1)
  })

  it('Test JSFunction', () => {
    evaluate(`function a() {
      const b = 1;
    }`, map, initialState)
    expect(globalEnv.get('a').functionBody.type).toBe('BlockStatement')
  })
})


describe('Test Return Statement', () => {
  const map = new Map([
    ['PropertyDefinition', [
      ['StringLiteral', ':', 'Expression'],
      ['NumbericLiteral', ':', 'Expression']
    ]],
    ['PropertyDefinitionList', [
      ['PropertyDefinition'],
      ['PropertyDefinitionList', ':', 'PropertyDefinition']
    ]],
    ['ObjectLiteral', [
      ['{', '}'],
      ['{', 'PropertyDefinitionList', '}'],
      ['{', 'PropertyDefinitionList', ',', '}'],
    ]],
    ['Literal', [
      ['NumbericLiteral'], 
      ['StringLiteral'], 
      ['BooleanLiteral'], 
      ['NullLiteral'],
      ['ObjectLiteral'],
    ]],
    ['Primary', [
      ['(', 'Expression', ')'], 
      ['Literal'], 
      ['Identifier']
    ]],
    ['Arguments', [
      ['(', ')'],
      ['(', 'ArgumentList', ')'],
      ['(', 'ArgumentList', ',', ')']
    ]],
    ['ArgumentList', [
      ['AssignmentExpression'],
      ['ArgumentList', ',', 'AssignmentExpression']
    ]],
    ['MemberExpression', [
      ['Primary'], 
      ['MemberExpression', '.', 'Identifier'], 
      ['MemberExpression', '[', 'Expression', ']'],
      ['new', 'MemberExpression', 'Arguments']
    ]],
    ['NewExpression', [
      ['MemberExpression'], 
      ['new', 'NewExpression']
    ]],
    ['CallExpression', [
      ['CoverCallExpressionAndAsyncArrowHead'],
      ['CallExpression', 'Arguments'],
      ['CallExpression', '[', 'Expression', ']'],
      ['CallExpression', '.', 'Identifier'],
    ]],
    ['CoverCallExpressionAndAsyncArrowHead', [
      ['MemberExpression', 'Arguments']
    ]],
    ['LeftHandSideExpression', [
      ['MemberExpression'], 
      ['CallExpression'], 
      ['NewExpression']
    ]],
    ['UpdateExpression', [
      ['LeftHandSideExpression'],
      ['LeftHandSideExpression', '++'],
      ['LeftHandSideExpression', '--'],
      ['++', 'LeftHandSideExpression'],
      ['--', 'LeftHandSideExpression']
    ]],
    ['MultiplicativeExpression', [
      ['UpdateExpression'], 
      ['MultiplicativeExpression', '*', 'UpdateExpression'], 
      ['MultiplicativeExpression', '/', 'UpdateExpression'], 
      ['MultiplicativeExpression', '%', 'UpdateExpression']
    ]],
    ['AdditiveExpression', [
      ['MultiplicativeExpression'], 
      ['AdditiveExpression', '+', 'MultiplicativeExpression'], 
      ['AdditiveExpression', '-', 'MultiplicativeExpression']
    ]],
    ['RelationalExpression', [
      ['AdditiveExpression'], 
      ['RelationalExpression', '>', 'AdditiveExpression'], 
      ['RelationalExpression', '<', 'AdditiveExpression']
    ]],
    ['EqualityExpression', [
      ['RelationalExpression'],
      ['EqualityExpression', '==', 'RelationalExpression'],
      ['EqualityExpression', '!=', 'RelationalExpression'],
      ['EqualityExpression', '===', 'RelationalExpression'],
      ['EqualityExpression', '!==', 'RelationalExpression'],
    ]],
    ['BitwiseANDExpression', [
      ['EqualityExpression'],
      ['BitwiseANDExpression', '&', 'EqualityExpression']
    ]],
    ['BitwiseXORExpression', [
      ['BitwiseANDExpression'],
      ['BitwiseXORExpression', '^', 'BitwiseANDExpression']
    ]],
    ['BitwiseORExpression', [
      ['BitwiseXORExpression'],
      ['BitwiseORExpression', '|', 'BitwiseXORExpression']
    ]],
    ['LogicalANDExpression', [
      ['BitwiseORExpression'],
      ['LogicalANDExpression', '&&', 'BitwiseORExpression']
    ]],
    ['LogicalORExpression', [
      ['LogicalANDExpression'],
      ['LogicalORExpression', '||', 'LogicalANDExpression']
    ]],
    ['CoalesceExpression', [
      ['ShortCircuitExpression', '??', 'BitwiseORExpression']
    ]],
    // ['CoalesceExpressionHead', [
    //   ['CoalesceExpression'],
    //   ['BitwiseORExpression']
    // ]],
    ['ShortCircuitExpression', [
      ['LogicalORExpression'],
      ['CoalesceExpression']
    ]],
    ['ConditionalExpression', [
      ['ShortCircuitExpression'],
      ['ShortCircuitExpression', '?', 'AssignmentExpression', ':', 'AssignmentExpression']
    ]],
    ['AssignmentOperator', [
      ['*='],['/='], ['%='], ['+='], ['-='],
      ['<<='], ['>>='], ['>>>='],
      ['&='], ['^='], ['|='], ['**=']
    ]],
    ['AssignmentExpression', [
      ['ConditionalExpression'],
      ['LeftHandSideExpression', '=', 'AssignmentExpression'],
      ['LeftHandSideExpression', 'AssignmentOperator', 'AssignmentExpression'],
      ['LeftHandSideExpression', '&&=', 'AssignmentExpression'],
      ['LeftHandSideExpression', '||=', 'AssignmentExpression'],
      ['LeftHandSideExpression', '??=', 'AssignmentExpression'],
    ]],
    ['Expression', [
      ['AssignmentExpression'], 
      ['Expression', ',', 'AssignmentExpression'],
    ]],
    ['Parameters', [
      ['Identifier'], 
      ['Parameters', ',', 'Identifier']
    ]],
    ['FunctionDeclaration', [
      ['function', 'Identifier', '(', ')', 'BlockStatement'],
      ['function', 'Identifier', '(', 'Parameters', ')', 'BlockStatement']
    ]],
    ['Declaration', [
      ['FunctionDeclaration'],
      ['var', 'Identifier', '=', 'Expression', ';'], 
      ['let', 'Identifier', '=', 'Expression', ';'], 
      ['const', 'Identifier', '=', 'Expression', ';']
    ]],
    ['ExpressionStatement', [
      ['Expression', ';']
    ]],
    ['BlockStatement', [
      ['{', '}'],
      ['{', 'StatementList', '}'],
    ]],
    ['IfStatement', [
      ['if', '(', 'Expression', ')', 'Statement'], 
      ['if', '(', 'Expression', ')', 'else', 'Statement']
    ]],
    ['ForStatement', [
      ['for', '(', 'let', 'Expression', ';', 'Expression', ';', 'Expression', ')', 'Statement'],
      ['for', '(', 'var', 'Expression', ';', 'Expression', ';', 'Expression', ')', 'Statement'],
      ['for', '(', 'Expression', ';', 'Expression', ';', 'Expression', ')', 'Statement']
    ]],
    ['BreakableStatement', [
      ['ForStatement']
    ]],
    ['BreakStatement', [
      ['break', ';'],
      ['break', 'Identifier', ';']
    ]],
    ['ContinueStatement', [
      ['continue', ';'],
      ['continue', 'Identifier', ';']
    ]],
    ['ReturnStatement', [
      ['return', ';'],
      ['return', 'Expression', ';'],
    ]],
    ['Statement', [
      ['BlockStatement'],
      ['ExpressionStatement'], 
      ['IfStatement'], 
      ['ForStatement'], 
      ['BreakableStatement'],
      ['BreakStatement'],
      ['ContinueStatement'],
      ['ReturnStatement'],
      ['Declaration'], 
    ]],
    ['StatementListItem', [
      ['Statement'], 
      ['Declaration']
    ]],
    ['StatementList', [
      ['StatementListItem'], 
      ['StatementList', 'StatementListItem']
    ]],
    ['Program', [['StatementList']]],
  ])
  const initialState = {
    Program: {
      EOF: {
        $end: true
      }
    }
  }
  it('Test CallExpression With ReturnStatement', () => {
    expect(evaluate(`
    let a = 1
    function f(){
      return ++a
    }
    f()
    `, map, initialState)).toEqual({
      type: 'normal', 
      value: {
        type: 'return',
        value: 2
      }
    })
    expect(globalEnv.get('a')).toBe(2)
  })
  it('Test CallExpression With ReturnStatement And Scope', () => {
    expect(evaluate(`
    let a = 1
    function f() {
      let a = 0
      a += 2
      return a
    }
    f()
    `, map, initialState)).toEqual({
      type: 'normal', 
      value: {
        type: 'return',
        value: 2
      }
    })
    expect(globalEnv.get('a')).toBe(1)
  })
  it('Test CallExpression With ReturnStatement, Scope And Parameters', () => {
    expect(evaluate(`
    let a = 1
    function f(b) {
      a += b
      return a
    }
    f(2)
    `, map, initialState)).toEqual({
      type: 'normal', 
      value: {
        type: 'return',
        value: 3
      }
    })
    expect(globalEnv.get('a')).toBe(3)
  })
})