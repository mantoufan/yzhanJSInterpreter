const { evaluate, globalEnv } = require('../../../src/index')
describe('Test Executor', () => {
  const map = new Map([
    ['Literal', [['NumbericLiteral'], ['StringLiteral'], ['BooleanLiteral'], ['NullLiteral']]],
    ['Primary', [['(', 'Expression', ')'], ['Literal'], ['Identifier']]],
    ['MemberExpression', [['Primary'], ['MemberExpression', '.', 'Identifier'], ['MemberExpression', '[', 'Expression', ']']]],
    ['NewExpression', [['MemberExpression'], ['new', 'NewExpression']]],
    ['CallExpression', [
      ['new', 'MemberExpression', '(', ')'],
      ['MemberExpression', '(', ')'],
      ['CallExpression', '.', 'Identifier'],
      ['CallExpression', '[', 'Expression', ']'],
      ['CallExpression', '(', 'Arguments', ')']
    ]],
    ['LeftHandSideExpression', [['MemberExpression'], ['CallExpression'], ['NewExpression']]],
    ['MultiplicativeExpression', [['LeftHandSideExpression'], ['MultiplicativeExpression', '*', 'LeftHandSideExpression'], ['MultiplicativeExpression', '/', 'LeftHandSideExpression'], ['MultiplicativeExpression', '%', 'LeftHandSideExpression']]],
    ['AdditiveExpression', [['MultiplicativeExpression'], ['AdditiveExpression', '+', 'MultiplicativeExpression'], ['AdditiveExpression', '-', 'MultiplicativeExpression']]],
    ['AssignmentExpression', [['AdditiveExpression'], ['LeftHandSideExpression', '=', 'AssignmentExpression']]],
    ['Expression', [['AssignmentExpression']]],
    ['ExpressionStatement', [['Expression', ';']]],
    ['Declaration', [
      ['var', 'Identifier', '=', 'Expression', ';'], 
      ['let', 'Identifier', '=', 'Expression', ';'], 
      ['const', 'Identifier', '=', 'Expression', ';']
    ]],
    /** Added: Start */
    ['Parameters', [['Identifier'], ['Parameters', ',', 'Identifier']]],
    ['FunctionDeclaration', [
      ['function', 'Identifier', '(', ')', '{', 'StatementList', '}'],
      ['function', 'Identifier', '(', 'Parameters', ')', '{', 'StatementList', '}']
    ]],
    /** Added: End */
    ['Statement', [['ExpressionStatement'], ['IfStatement'], ['ForStatement'], ['Declaration']]],
    ['StatementListItem', [['Statement'], ['Declaration']]],
    ['StatementList', [['StatementListItem'], ['StatementList', 'StatementListItem']]],
    /** Added */
    ['Program', [['StatementList']]],
  ])
  const initialState = {
    Program: {
      EOF: {
        $end: true
      }
    }
  }
  it('1 + 1', () => {
    expect(evaluate('1 + 1', map, initialState)).toEqual({"type": "normal", "value": 2})
  })
})

describe('Test Scope', () => {
  const map = new Map([
    ['Literal', [['NumbericLiteral'], ['StringLiteral'], ['BooleanLiteral'], ['NullLiteral']]],
    ['Primary', [['(', 'Expression', ')'], ['Literal'], ['Identifier']]],
    ['MemberExpression', [['Primary'], ['MemberExpression', '.', 'Identifier'], ['MemberExpression', '[', 'Expression', ']']]],
    ['NewExpression', [['MemberExpression'], ['new', 'NewExpression']]],
    ['CallExpression', [
      ['new', 'MemberExpression', '(', ')'],
      ['MemberExpression', '(', ')'],
      ['CallExpression', '.', 'Identifier'],
      ['CallExpression', '[', 'Expression', ']'],
      ['CallExpression', '(', 'Arguments', ')']
    ]],
    ['LeftHandSideExpression', [['MemberExpression'], ['CallExpression'], ['NewExpression']]],
    ['MultiplicativeExpression', [['LeftHandSideExpression'], ['MultiplicativeExpression', '*', 'LeftHandSideExpression'], ['MultiplicativeExpression', '/', 'LeftHandSideExpression'], ['MultiplicativeExpression', '%', 'LeftHandSideExpression']]],
    ['AdditiveExpression', [['MultiplicativeExpression'], ['AdditiveExpression', '+', 'MultiplicativeExpression'], ['AdditiveExpression', '-', 'MultiplicativeExpression']]],
    ['AssignmentExpression', [['AdditiveExpression'], ['LeftHandSideExpression', '=', 'AssignmentExpression']]],
    ['Expression', [['AssignmentExpression'], ['Expression', ',', 'AssignmentExpression']]],
    ['ExpressionStatement', [['Expression', ';']]],
    ['Declaration', [
      ['var', 'Identifier', '=', 'Expression', ';'], 
      ['let', 'Identifier', '=', 'Expression', ';'], 
      ['const', 'Identifier', '=', 'Expression', ';']
    ]],
    ['Parameters', [['Identifier'], ['Parameters', ',', 'Identifier']]],
    ['FunctionDeclaration', [
      ['function', 'Identifier', '(', ')', '{', 'StatementList', '}'],
      ['function', 'Identifier', '(', 'Parameters', ')', '{', 'StatementList', '}']
    ]],
    /** Added: Start */
    ['IfStatement', [
      ['if', '(', 'Expression', ')', 'Statement'], 
      ['if', '(', 'Expression', ')', 'else', 'Statement']
    ]],
    ['BlockStatement', [
      ['{', '}'],
      ['{', 'StatementList', '}'],
    ]],
    ['ForStatement', [
      ['for', '(', 'Expression', ';', 'Expression', ';', 'Expression', ')', 'Statement']
    ]],
    /** Added: End */
    ['Statement', [['ExpressionStatement'], ['IfStatement'], ['ForStatement'], ['Declaration'], ['BlockStatement']]],
    ['StatementListItem', [['Statement'], ['Declaration']]],
    ['StatementList', [['StatementListItem'], ['StatementList', 'StatementListItem']]],
    /** Added */
    ['Program', [['StatementList']]],
  ])
  const initialState = {
    Program: {
      EOF: {
        $end: true
      }
    }
  }
  it('DelcarationStatement', () => {
    evaluate('let a = 1', map, initialState)
    expect(globalEnv.vars.get('a')).toBe(1)
  })

  it('AdditiveStatement', () => {
    evaluate('let b = 1;b = b + 1', map, initialState)
    expect(globalEnv.vars.get('b')).toBe(2)
  })
  it('Nested Blocks', () => {
    expect(evaluate(`{
      let a= 1
      {
        let b = a + 1
        b + 1
      }
    }`, map, initialState)).toEqual({"type": "normal", "value": 3})
  })
})

describe('Test Statement Parser', () => {
  describe('Test IfStatement', () => {
    const map = new Map([
      ['Literal', [['NumbericLiteral'], ['StringLiteral'], ['BooleanLiteral'], ['NullLiteral']]],
      ['Primary', [['(', 'Expression', ')'], ['Literal'], ['Identifier']]],
      ['MemberExpression', [['Primary'], ['MemberExpression', '.', 'Identifier'], ['MemberExpression', '[', 'Expression', ']']]],
      ['NewExpression', [['MemberExpression'], ['new', 'NewExpression']]],
      ['CallExpression', [
        ['new', 'MemberExpression', '(', ')'],
        ['MemberExpression', '(', ')'],
        ['CallExpression', '.', 'Identifier'],
        ['CallExpression', '[', 'Expression', ']'],
        ['CallExpression', '(', 'Arguments', ')']
      ]],
      ['LeftHandSideExpression', [['MemberExpression'], ['CallExpression'], ['NewExpression']]],
      ['MultiplicativeExpression', [['LeftHandSideExpression'], ['MultiplicativeExpression', '*', 'LeftHandSideExpression'], ['MultiplicativeExpression', '/', 'LeftHandSideExpression'], ['MultiplicativeExpression', '%', 'LeftHandSideExpression']]],
      ['AdditiveExpression', [['MultiplicativeExpression'], ['AdditiveExpression', '+', 'MultiplicativeExpression'], ['AdditiveExpression', '-', 'MultiplicativeExpression']]],
      ['AssignmentExpression', [['AdditiveExpression'], ['LeftHandSideExpression', '=', 'AssignmentExpression']]],
      ['Expression', [['AssignmentExpression'], ['Expression', ',', 'AssignmentExpression']]],
      ['ExpressionStatement', [['Expression', ';']]],
      ['Declaration', [
        ['var', 'Identifier', '=', 'Expression', ';'], 
        ['let', 'Identifier', '=', 'Expression', ';'], 
        ['const', 'Identifier', '=', 'Expression', ';']
      ]],
      ['Parameters', [['Identifier'], ['Parameters', ',', 'Identifier']]],
      ['FunctionDeclaration', [
        ['function', 'Identifier', '(', ')', '{', 'StatementList', '}'],
        ['function', 'Identifier', '(', 'Parameters', ')', '{', 'StatementList', '}']
      ]],
      /** Added: Start */
      ['IfStatement', [
        ['if', '(', 'Expression', ')', 'Statement'], 
        ['if', '(', 'Expression', ')', 'else', 'Statement']
      ]],
      ['BlockStatement', [
        ['{', '}'],
        ['{', 'StatementList', '}'],
      ]],
      /** Added: End */
      ['Statement', [['ExpressionStatement'], ['IfStatement'], ['ForStatement'], ['Declaration'], ['BlockStatement']]],
      ['StatementListItem', [['Statement'], ['Declaration']]],
      ['StatementList', [['StatementListItem'], ['StatementList', 'StatementListItem']]],
      /** Added */
      ['Program', [['StatementList']]],
    ])
    const initialState = {
      Program: {
        EOF: {
          $end: true
        }
      }
    }
    it('IfStatement', () => {
      expect(evaluate('if (ture) {const a = 1}', map, initialState)).toEqual({ type: 'normal', value: undefined })
    })
  })
  
  describe('Test ForStatement', () => {
    const map = new Map([
      ['Literal', [['NumbericLiteral'], ['StringLiteral'], ['BooleanLiteral'], ['NullLiteral']]],
      ['Primary', [['(', 'Expression', ')'], ['Literal'], ['Identifier']]],
      ['MemberExpression', [['Primary'], ['MemberExpression', '.', 'Identifier'], ['MemberExpression', '[', 'Expression', ']']]],
      ['NewExpression', [['MemberExpression'], ['new', 'NewExpression']]],
      ['CallExpression', [
        ['new', 'MemberExpression', '(', ')'],
        ['MemberExpression', '(', ')'],
        ['CallExpression', '.', 'Identifier'],
        ['CallExpression', '[', 'Expression', ']'],
        ['CallExpression', '(', 'Arguments', ')']
      ]],
      ['LeftHandSideExpression', [['MemberExpression'], ['CallExpression'], ['NewExpression']]],
      ['MultiplicativeExpression', [['UpdateExpression'], ['MultiplicativeExpression', '*', 'UpdateExpression'], ['MultiplicativeExpression', '/', 'UpdateExpression'], ['MultiplicativeExpression', '%', 'UpdateExpression']]],
      ['AdditiveExpression', [['MultiplicativeExpression'], ['AdditiveExpression', '+', 'MultiplicativeExpression'], ['AdditiveExpression', '-', 'MultiplicativeExpression']]],
      ['RelationalExpression', [['AdditiveExpression'], ['RelationalExpression', '>', 'AdditiveExpression'], ['RelationalExpression', '<', 'AdditiveExpression']]],
      ['AssignmentExpression', [['RelationalExpression'], ['LeftHandSideExpression', '=', 'RelationalExpression']]],
      ['Expression', [
        ['AssignmentExpression'], 
        ['Expression', ',', 'AssignmentExpression'],
      ]],
      ['UpdateExpression', [
        ['LeftHandSideExpression'],
        ['LeftHandSideExpression', '++'],
        ['LeftHandSideExpression', '--'],
        ['++', 'LeftHandSideExpression'],
        ['--', 'LeftHandSideExpression']
      ]],
      ['ExpressionStatement', [['Expression', ';']]],
      ['Declaration', [
        ['var', 'Identifier', '=', 'Expression', ';'], 
        ['let', 'Identifier', '=', 'Expression', ';'], 
        ['const', 'Identifier', '=', 'Expression', ';']
      ]],
      ['Parameters', [['Identifier'], ['Parameters', ',', 'Identifier']]],
      ['FunctionDeclaration', [
        ['function', 'Identifier', '(', ')', '{', 'StatementList', '}'],
        ['function', 'Identifier', '(', 'Parameters', ')', '{', 'StatementList', '}']
      ]],
      /** Added: Start */
      ['IfStatement', [
        ['if', '(', 'Expression', ')', 'Statement'], 
        ['if', '(', 'Expression', ')', 'else', 'Statement']
      ]],
      ['BlockStatement', [
        ['{', '}'],
        ['{', 'StatementList', '}'],
      ]],
      ['ForStatement', [
        ['for', '(', 'let', 'Expression', ';', 'Expression', ';', 'Expression', ')', 'Statement'],
        ['for', '(', 'var', 'Expression', ';', 'Expression', ';', 'Expression', ')', 'Statement'],
        ['for', '(', 'Expression', ';', 'Expression', ';', 'Expression', ')', 'Statement']
      ]],
      /** Added: End */
      ['Statement', [['ExpressionStatement'], ['IfStatement'], ['ForStatement'], ['Declaration'], ['BlockStatement']]],
      ['StatementListItem', [['Statement'], ['Declaration']]],
      ['StatementList', [['StatementListItem'], ['StatementList', 'StatementListItem']]],
      /** Added */
      ['Program', [['StatementList']]],
    ])
    const initialState = {
      Program: {
        EOF: {
          $end: true
        }
      }
    }
  
    it('ForStatement', () => {
      evaluate(`
      let a = 0
      for(let i = 0; i < 10; i++) {a++}
      `, map, initialState)
      expect(globalEnv.get('a')).toBe(10)
    })
  })

  describe('Test BreakStatement', () => {
    const map = new Map([
      ['Literal', [['NumbericLiteral'], ['StringLiteral'], ['BooleanLiteral'], ['NullLiteral']]],
      ['Primary', [['(', 'Expression', ')'], ['Literal'], ['Identifier']]],
      ['MemberExpression', [['Primary'], ['MemberExpression', '.', 'Identifier'], ['MemberExpression', '[', 'Expression', ']']]],
      ['NewExpression', [['MemberExpression'], ['new', 'NewExpression']]],
      ['CallExpression', [
        ['new', 'MemberExpression', '(', ')'],
        ['MemberExpression', '(', ')'],
        ['CallExpression', '.', 'Identifier'],
        ['CallExpression', '[', 'Expression', ']'],
        ['CallExpression', '(', 'Arguments', ')']
      ]],
      ['LeftHandSideExpression', [['MemberExpression'], ['CallExpression'], ['NewExpression']]],
      ['MultiplicativeExpression', [['UpdateExpression'], ['MultiplicativeExpression', '*', 'UpdateExpression'], ['MultiplicativeExpression', '/', 'UpdateExpression'], ['MultiplicativeExpression', '%', 'UpdateExpression']]],
      ['AdditiveExpression', [['MultiplicativeExpression'], ['AdditiveExpression', '+', 'MultiplicativeExpression'], ['AdditiveExpression', '-', 'MultiplicativeExpression']]],
      ['RelationalExpression', [['AdditiveExpression'], ['RelationalExpression', '>', 'AdditiveExpression'], ['RelationalExpression', '<', 'AdditiveExpression']]],
      ['EqualityExpression', [
        ['RelationalExpression'],
        ['EqualityExpression', '==', 'RelationalExpression'],
        ['EqualityExpression', '!=', 'RelationalExpression'],
        ['EqualityExpression', '===', 'RelationalExpression'],
        ['EqualityExpression', '!==', 'RelationalExpression'],
      ]],
      ['AssignmentExpression', [['EqualityExpression'], ['LeftHandSideExpression', '=', 'EqualityExpression']]],
      ['Expression', [
        ['AssignmentExpression'], 
        ['Expression', ',', 'AssignmentExpression'],
      ]],
      ['UpdateExpression', [
        ['LeftHandSideExpression'],
        ['LeftHandSideExpression', '++'],
        ['LeftHandSideExpression', '--'],
        ['++', 'LeftHandSideExpression'],
        ['--', 'LeftHandSideExpression']
      ]],
      ['ExpressionStatement', [['Expression', ';']]],
      ['Declaration', [
        ['var', 'Identifier', '=', 'Expression', ';'], 
        ['let', 'Identifier', '=', 'Expression', ';'], 
        ['const', 'Identifier', '=', 'Expression', ';']
      ]],
      ['Parameters', [['Identifier'], ['Parameters', ',', 'Identifier']]],
      ['FunctionDeclaration', [
        ['function', 'Identifier', '(', ')', '{', 'StatementList', '}'],
        ['function', 'Identifier', '(', 'Parameters', ')', '{', 'StatementList', '}']
      ]],
      /** Added: Start */
      ['IfStatement', [
        ['if', '(', 'Expression', ')', 'Statement'], 
        ['if', '(', 'Expression', ')', 'else', 'Statement']
      ]],
      ['BlockStatement', [
        ['{', '}'],
        ['{', 'StatementList', '}'],
      ]],
      ['ForStatement', [
        ['for', '(', 'let', 'Expression', ';', 'Expression', ';', 'Expression', ')', 'Statement'],
        ['for', '(', 'var', 'Expression', ';', 'Expression', ';', 'Expression', ')', 'Statement'],
        ['for', '(', 'Expression', ';', 'Expression', ';', 'Expression', ')', 'Statement']
      ]],
      ['BreakStatement', [
        ['break', ';']
      ]],
      /** Added: End */
      ['Statement', [['ExpressionStatement'], ['IfStatement'], ['ForStatement'], ['Declaration'], ['BlockStatement'], ['BreakStatement']]],
      ['StatementListItem', [['Statement'], ['Declaration']]],
      ['StatementList', [['StatementListItem'], ['StatementList', 'StatementListItem']]],
      /** Added */
      ['Program', [['StatementList']]],
    ])
    const initialState = {
      Program: {
        EOF: {
          $end: true
        }
      }
    }
  
    it('Test BreakStatement', () => {
      evaluate(`
      for(let i = 1; i < 10; i++) {
        if (i === 5) break;
      }
      `, map, initialState)
      expect(globalEnv.get('i')).toBe(5)
    })
  })
})