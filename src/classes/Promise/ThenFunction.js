const JSFunction = require('../JSFunction.js')
const Task = require('../Task.js')
module.exports = class extends JSFunction {
  constructor(executor, promiseInstance, resolve, reject) {
    super(null, executor)
    this.promiseInstance = promiseInstance
    this.resolve = resolve
    this.reject = reject
  }
  call(currentEnv, args) {
    const callback = args[0]
    const { executor, promiseInstance, resolve, reject } = this
    if (promiseInstance.getProperty('state') === 'fulfilled') {
      const resolvedValue = promiseInstance.getProperty('resolvedValue')
      executor.microTaskQueue.push(new Task(currentEnv, callback, [resolvedValue]))
    } else if (promiseInstance.getProperty('state') === 'rejected') {
      const rejectReason = promiseInstance.getProperty('rejectReason')
      executor.microTaskQueue.push(new Task(currentEnv, callback, [rejectReason]))
    } else {
      resolve.then = callback
      reject.then = callback
    }
  }
}