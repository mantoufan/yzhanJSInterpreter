const { lex, parse, execute, globalEnv } = require('../../src/index')
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
    const expression = parse(lex("1 + 1"), map, initialState)
    expect(execute(expression[0])).toEqual({"type": "normal", "value": 2})
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
  const getInitialState = () => ({
    Program: {
      EOF: {
        $end: true
      }
    }
  })
  it('DelcarationStatement', () => {
    const expression = parse(lex("let a = 1;"), map, getInitialState())
    execute(expression[0])
    expect(globalEnv.vars.get('a')).toBe(1)
  })

  it('AdditiveStatement', () => {
    const expression = parse(lex("let b = 1;b = b + 1"), map, getInitialState())
    execute(expression[0])
    expect(globalEnv.vars.get('b')).toBe(2)
  })
  it('Nested Blocks', () => {
    const expression = parse(lex(`{
      let a= 1
      {
        let b = a + 1
        b + 1
      }
    }`), map, getInitialState())
    const res = execute(expression[0])
    expect(res).toEqual({"type": "normal", "value": 3})
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
      const expression = parse(lex("if (ture) {const a = 1;}"), map, initialState)
      expect(execute(expression[0])).toEqual({ type: 'normal', value: undefined })
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
      const str = `
      for(let i = 1; i < 10; i++) {
      }
      `
      const expression = parse(lex(str), map, initialState)
      execute(expression[0])
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
      const str = `
      for(let i = 1; i < 10; i++) {
        if (i < 10) break;
      }
      `
      const expression = parse(lex(str), map, initialState)
      execute(expression[0])
    })
  })
})