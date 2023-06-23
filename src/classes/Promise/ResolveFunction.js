const JSFunction = require('../JSFunction.js')
module.exports = class extends JSFunction {
  constructor(then) {
    this.then = then
  }
  call(resolvedValue) {
    this.executor.microTaskQueue.push(new Task(resolvedValue, this.then))
  }
}
