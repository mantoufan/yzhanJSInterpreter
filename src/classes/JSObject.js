module.exports = class {
  constructor() {
    this.properties = new Map()
    this.prototype = null
  }
  #get(property) {
    if (property.value !== void 0) return property.value
    return property.get()
  }
  getProperty(key) {
    let cur = this
    while (cur !== null) {
      const property = cur.properties.get(key)
      if (property !== void 0) return this.#get(property)
      cur = cur.prototype
    }
    return void 0
  }
  setProperty(key, { value, get, set, writable = true, enumerable = true, configurable = true }) {
    this.properties.set(key, {
      value,
      get,
      set,
      writable,
      enumerable,
      configurable
    })
  }
}