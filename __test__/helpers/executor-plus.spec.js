const { lex, parse, execute, globalEnv } = require('../../src/index')
describe('Test Homework', () => {
  const map = new Map([
    ['Parameters', [
      ['Identifier'], 
      ['Parameters', ',', 'Identifier']
    ]],
    ['FunctionDeclaration', [
      ['function', 'Identifier', '(', ')', '{', 'StatementList', '}'],
      ['function', 'Identifier', '(', 'Parameters', ')', '{', 'StatementList', '}']
    ]],
    ['Declaration', [
      ['FunctionDeclaration'],
      ['var', 'Identifier', '=', 'Expression', ';'], 
      ['let', 'Identifier', '=', 'Expression', ';'], 
      ['const', 'Identifier', '=', 'Expression', ';']
    ]],
    ['Literal', [
      ['NumberLiteral'], 
      ['StringLiteral'], 
      ['BooleanLiteral'], 
      ['NullLiteral']
    ]],
    ['Primary', [
      ['(', 'Expression', ')'], 
      ['Literal'], 
      ['Identifier']
    ]],
    ['MemberExpression', [
      ['Primary'], 
      ['MemberExpression', '.', 'Identifier'], 
      ['MemberExpression', '[', 'Expression', ']']
    ]],
    ['NewExpression', [
      ['MemberExpression'], 
      ['new', 'NewExpression']
    ]],
    ['CallExpression', [
      ['new', 'MemberExpression', '(', ')'],
      ['MemberExpression', '(', ')'],
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

  it('Test EqualityExpression', () => {
    const str = `
    '1' == 1 === (1 != '0');
    `
    const expression = parse(lex(str), map, initialState)
    expect(execute(expression[0])).toEqual({
      "type": "normal",
      "value": true
    })
  })

  it('Test BitwiseExpression', () => {
    const str = `
    1 | 2 ^ 2 & 1;
    `
    const expression = parse(lex(str), map, initialState)
    expect(execute(expression[0])).toEqual({
      "type": "normal",
      "value": 3
    })
  })

  it('Test LogicalExpression', () => {
    const str = `
    (0 ?? 2) || 1 && 2
    `
    const expression = parse(lex(str), map, initialState)
    expect(execute(expression[0])).toEqual({
      "type": "normal",
      "value": 2
    })
  })

  it('Test AssignmentOperator', () => {
    const str = `
    let ans = 0
    ans += 1
    ans *= 2
    ans /= 2
    ans <<= 2
    ans >>= 1
    ans >>>= 1
    `
    const expression = parse(lex(str), map, initialState)
    expect(execute(expression[0])).toEqual({
      "type": "normal",
      "value": 1
    })
  })

  it('Test BreakStatement', () => {
    const str = `
    let ans = 0
    for(let i = 0; i < 10; i++) {
      if (i === 5) break;
      ans++
    }
    ans + 0;
    `
    const expression = parse(lex(str), map, initialState)
    expect(execute(expression[0])).toEqual({
      "type": "normal",
      "value": 5
    })
  })

  it('Test ContinueStatement', () => {
    const str = `
    let ans = 0
    for(let i = 0; i < 10; i++) {
      if (i % 2 === 0) continue;
      ans++;
    }
    ans + 0;
    `
    const expression = parse(lex(str), map, initialState)
    expect(execute(expression[0])).toEqual({
      "type": "normal",
      "value": 5
    })
  })
})