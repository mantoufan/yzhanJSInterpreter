const JSObject = require('../JSObject.js')
const JSFunction = require('../JSFunction.js')
const ResolveFunction = require('./ResolveFunction.js')
const RejectFunction = require('./RejectFunction.js')
const ThenFunction = require('./ThenFunction.js')
module.exports = class PromiseFunction extends JSFunction {
  constructor(executor) {
    super(null, executor)
  }
  call () {
    throw Error('Uncaught TypeError: Promise constructor cannot be invoked without \'new\'')
  }
  construct(currentEnv, func) {
    const promiseInstance = new JSObject()
    promiseInstance.setProperty('state', { value: 'pending' })
    const resolve = new ResolveFunction(this.executor, promiseInstance)
    const reject = new RejectFunction(this.executor, promiseInstance)
    try {
      func.call(currentEnv, [resolve, reject])
    } catch(error) {
      reject.call(currentEnv, error)
    }
    const then = new ThenFunction(this.executor, promiseInstance, resolve, reject)
    promiseInstance.setProperty('then', { value: then })
    return promiseInstance
  }
}

