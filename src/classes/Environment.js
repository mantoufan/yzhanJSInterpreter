module.exports = class {
  constructor (parent) {
    this.vars = new Map()
    this.parent = parent
  }
  set(property, value) {
    if (this.vars.has(property) || !this.parent) {
      this.vars.set(property, value)
    } else {
      this.parent.set(property, value)
    }
  }
  get(property) {
    if (this.vars.has(property) || !this.parent) {
      return this.vars.get(property)
    } else {
      return this.parent.get(property)
    }
  }
}