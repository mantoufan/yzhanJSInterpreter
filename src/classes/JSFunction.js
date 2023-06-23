const JSObject = require('./JSObject.js')
module.exports = class extends JSObject {
  constructor(functionBody, executor, env, parameters) {
    super()
    this.functionBody = functionBody
    this.executor = executor
    this.env = env
    this.parameters = parameters
  }

  call(thisArg, ...args) {
    const { executor, functionBody } = this
    executor.envStack.push(thisArg.env)
    const res = that.executor[functionBody.type](functionBody)
    executor.envStack.pop()
    return res
  }

  construct() {
    const obj = new JSObject()
    const res = this.call(obj)
    if(res instanceof JSObject) return res
    return obj
  }
  
}