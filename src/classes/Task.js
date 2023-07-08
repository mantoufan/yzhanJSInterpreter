module.exports = class {
  constructor(env, func, args) {
    this.env = env
    this.func = func
    this.args = args
  }
  run() {
    this.func.call(this.env, this.args)
  }
}