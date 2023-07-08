const JSFunction = require('../JSFunction.js')
const Task = require('../Task.js')
module.exports = class extends JSFunction {
  constructor(executor, promiseInstance) {
    super(null, executor)
    this.promiseInstance = promiseInstance
    this.then = null // will pass from (then instance).call
  }
  call(currentEnv, args) {
    const rejectReason = args[0]
    const { then, executor, promiseInstance } = this
    if (then !== null) executor.microTaskQueue.push(new Task(currentEnv, then, [rejectReason]))
    promiseInstance.setProperty('state', { value: 'rejected' })
    promiseInstance.setProperty('rejectReason', { value: rejectReason })
  }
}
