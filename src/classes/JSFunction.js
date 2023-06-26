const JSObject = require('./JSObject.js')
const Environment = require('./Environment.js')
module.exports = class extends JSObject {
  constructor(functionBody, executor, env, parameters) {
    super()
    this.functionBody = functionBody
    this.executor = executor
    this.env = env
    this.parameters = parameters
  }

  call(currentEnv, args) {
    const { executor, functionBody } = this
    const newEnv = new Environment(currentEnv)
    this.parameters?.forEach((parameter, i) => {
      newEnv.set(parameter, args[i])
    })
    executor.envStack.push(newEnv)
    const res = executor[functionBody.type](functionBody)
    executor.envStack.pop()
    return res
  }

  construct(currentEnv, args) {
    const obj = new JSObject()
    const res = this.call(currentEnv, args)
    if(res instanceof JSObject) return res
    return obj
  }
  
}