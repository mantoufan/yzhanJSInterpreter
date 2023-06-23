const JSObject = require('../../src/classes/JSObject')
describe('Test JSObject', () => {
  it('Test getProperty with value on itself', () => {
    const self = new JSObject()
    self.setProperty('a', {
      value: 1
    })
    expect(self.getProperty('a')).toBe(1)
  })
  it('Test getProperty with value on prototype', () => {
    const parent = new JSObject()
    parent.setProperty('a', {
      value: 1
    })
    const child = new JSObject()
    child.prototype = parent
    expect(child.getProperty('a')).toBe(1)
  })
  it('Test getProperty with getter on itself', () => {
    const self = new JSObject()
    self.setProperty('a', {
      get() {
        return 1
      }
    })
    expect(self.getProperty('a')).toBe(1)
  })
  it('Test getProperty with getter on prototype', () => {
    const parent = new JSObject()
    parent.setProperty('a', {
      get() {
        return 1
      }
    })
    const child = new JSObject()
    child.prototype = parent
    expect(child.getProperty('a')).toBe(1)
  })
})