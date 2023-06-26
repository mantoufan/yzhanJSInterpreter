module.exports = class {
  constructor (parent) {
    this.vars = new Map()
    this.parent = parent
  }
  declare(identifier) {
    this.vars.set(identifier, void 0)
  }
  set(identifier, value) {
    if (this.vars.has(identifier) || !this.parent) {
      this.vars.set(identifier, value)
    } else {
      this.parent.set(identifier, value)
    }
  }
  get(identifier) {
    if (this.vars.has(identifier) || !this.parent) {
      return this.vars.get(identifier)
    } else {
      return this.parent.get(identifier)
    }
  }
}