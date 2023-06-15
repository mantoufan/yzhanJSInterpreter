module.exports = class {
  constructor (object, property) {
    this.object = object
    this.property = property
  }
  set(val) {
    this.object.set(this.property, val)
  }
  get() {
    return this.object.get(this.property)
  }
}