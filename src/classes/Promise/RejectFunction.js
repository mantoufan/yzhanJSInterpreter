const JSFunction = require('../JSFunction.js')
module.exports = class extends JSFunction {
  constructor(then) {
    super()
    this.then = then
  }
  call(rejectReason) {
    // this.executor.microTaskQueue.push(new Task(rejectReason, this.then))
  }
}
