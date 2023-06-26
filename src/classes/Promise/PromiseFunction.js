const JSObject = require('../JSObject.js')
const JSFunction = require('../JSFunction.js')
const ResolveFunction = require('./ResolveFunction.js')
const RejectFunction = require('./RejectFunction.js')
const ThenFunction = require('./ThenFunction.js')
module.exports = class PromiseFunction extends JSFunction {
  call () {
    throw Error('Uncaught TypeError: Promise constructor cannot be invoked without \'new\'')
  }
  static construct(currentEnv, func) {
    const jsObject = new JSObject()
    const resolve =new ResolveFunction()
    const reject = new RejectFunction()
    try {
      func.call(currentEnv, resolve, reject)
    } catch(error) {
      reject.call(currentEnv, error)
    }
    const then = new ThenFunction()
    jsObject.setProperty('then', then)
    return jsObject
  }
}

