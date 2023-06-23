const JSObject = require('../JSObject.js')
const JSFunction = require('../JSFunction.js')
module.exports = class extends JSFunction {
  call () {
    throw Error('Uncaught TypeError: Promise constructor cannot be invoked without \'new\'')
  }
  construct(func) {
    const jsObject = new JSObject()
    const resolve =new ResolveFunction()
    func.call(resolve)
    const then = new ThenFunction()
    jsObject.setProperty('then', then)
    return jsObject
  }
}

