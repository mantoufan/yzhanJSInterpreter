const JSObject = require('./JSObject.js')
module.exports = class extends JSObject {
  constructor(functionBody, executor, env, parameters) {
    super()
    this.functionBody = functionBody
    this.executor = executor
    this.env = env
    this.parameters = parameters
  }

  call(env, ...args) {
    const { executor, functionBody, parameters } = this
    executor.envStack.push(env)
    const res = this.executor[functionBody.type](functionBody)
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