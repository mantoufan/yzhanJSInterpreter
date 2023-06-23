const regStr = `
(?<NumbericLiteral>(?:0[xX][0-9a-fA-F]*|\\.[0-9]+|(?:[1-9]+[0-9]*|0)(?:\\.[0-9]*|\\.)?)(?:[eE][+-]{0,1}[0-9]+)?(?![_$a-zA-Z0-9]))|
(?<NulLiteral>null(?![_$a-zA-Z0-9]))|
(?<BooleanLiteral>(?:true|false)(?![_$a-zA-Z0-9]))|
(?<StringLiteral>"(?:[^"\\n\\\\\\r\\u2028\\u2029]|\\\\(?:['"\\\\bfnrtv\\n\\r\\u2028\\u2029]|\\r\\n)|\\\\x[0-9a-fA-F]{2}|\\\\u[0-9a-fA-F]{4}|\\\\[^0-9ux'"\\\\bfnrtv\\n\\\\\\r\\u2028\\u2029])*"|'(?:[^'\\n\\\\\\r\\u2028\\u2029]|\\\\(?:['"\\\\bfnrtv\\n\\r\\u2028\\u2029]|\\r\\n)|\\\\x[0-9a-fA-F]{2}|\\\\u[0-9a-fA-F]{4}|\\\\[^0-9ux'"\\\\bfnrtv\\n\\\\\\r\\u2028\\u2029])*')|
(?<Punctuator>>>>=|>>=|<<=|===|!==|>>>|<<|%=|\\*=|-=|\\+=|<=|>=|==|!=|/=|\\^=|\\|=|&&=|\\|\\|=|\\?\\?=|\\|\\||&&|\\?\\?|&=|>>|\\+\\+|--|\\:|}|\\*|&|\\||\\^|!|~|-|\\+|\\?|%|=|>|<|,|;|\\.(?![0-9])|\\]|\\[|\\)|\\(|{)|
(?<Keywords>break(?![_$a-zA-Z0-9])|else(?![_$a-zA-Z0-9])|new(?![_$a-zA-Z0-9])|var(?![_$a-zA-Z0-9])|let(?![_$a-zA-Z0-9])|const(?![_$a-zA-Z0-9])|case(?![_$a-zA-Z0-9])|finally(?![_$a-zA-Z0-9])|return(?![_$a-zA-Z0-9])|void(?![_$a-zA-Z0-9])|catch(?![_$a-zA-Z0-9])|for(?![_$a-zA-Z0-9])|switch(?![_$a-zA-Z0-9])|while(?![_$a-zA-Z0-9])|continue(?![_$a-zA-Z0-9])|function(?![_$a-zA-Z0-9])|this(?![_$a-zA-Z0-9])|with(?![_$a-zA-Z0-9])|default(?![_$a-zA-Z0-9])|if(?![_$a-zA-Z0-9])|throw(?![_$a-zA-Z0-9])|delete(?![_$a-zA-Z0-9])|in(?![_$a-zA-Z0-9])|try(?![_$a-zA-Z0-9])|do(?![_$a-zA-Z0-9])|instanceof(?![_$a-zA-Z0-9])|typeof(?![_$a-zA-Z0-9]))|
(?<LineTerminator>(?:\\n))|
(?<Identifier>[_&A-Za-z][_&A-Za-z0-9\\\\u200C\\\\u200D]{0,})
`

const rulesMap = new Map([
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

exports.regStr = regStr
exports.rulesMap = rulesMap
exports.initialState = initialState