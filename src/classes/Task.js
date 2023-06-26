module.exports = class {
  constructor(args, func) {
    this.args = args
    this.func = func
  }
  run() {
    this.func.call(null, this.args)
  }
}