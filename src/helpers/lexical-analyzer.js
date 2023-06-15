const { regStr } = require('../data/conf.js')

function getRegExp() {
  return new RegExp(regStr.replace(/\s+/g, ''), 'g')
}

module.exports = function(str) {
  const regExp = getRegExp()
  const list = []
  while (r = regExp.exec(str)) {
    const groupKeys = Object.keys(r.groups)
    for (const groupKey of groupKeys) {
      if (r.groups[groupKey] === void 0) continue
      list.push({
        type: groupKey === 'Punctuator' || groupKey === 'Keywords' ? r.groups[groupKey] : groupKey,
        value: r.groups[groupKey]
      })
    }
  }
  list.push({
    type: 'EOF'
  })
  return list
}