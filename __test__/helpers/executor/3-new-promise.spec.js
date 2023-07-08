const { globalEnv, evaluate } = require('../../../src/index')
describe('Test Promise', () => {
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
  
  it('Test New Promise', () => {   
    evaluate(`
    function callback (resolve){resolve()}
    const p = new Promise(callback)
    `, map, initialState)
    expect(globalEnv.get('p')).toBeTruthy()
  })
  
  it('Test then function of promise instance using resolve', () => {   
    evaluate(`
    let b = 1
    function fn(resolve){
      resolve(1)
    }
    function then(resolveValue){
      b = b + resolveValue
    }
    const p = new Promise(fn)
    p.then(then)
    `, map, initialState)
    expect(globalEnv.get('b')).toBe(2)
  })
  it('Test then function of promise instance using reject', () => {   
    evaluate(`
    let b = 1
    function fn(resolve, reject){
      reject(1)
    }
    function then(rejectReason){
      b = b + rejectReason
    }
    const p = new Promise(fn)
    p.then(then)
    `, map, initialState)
    expect(globalEnv.get('b')).toBe(2)
  })
})