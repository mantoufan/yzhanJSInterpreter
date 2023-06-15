function debounce(fn, delay) {
  var timer = null
  return function () {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      timer = null
      fn.apply(this, arguments)
    }, delay)
  }
}

function saveSelection(element) {
  var selection = window.getSelection()
  if (selection.rangeCount === 0) return null
  var range = selection.getRangeAt(0)
  var preSelectionRange = range.cloneRange()
  preSelectionRange.selectNodeContents(element)
  preSelectionRange.setEnd(range.startContainer, range.startOffset)
  var start = preSelectionRange.toString().length

  return {
    start: start + 2,
    end: start + range.toString().length
  }
}

function restoreSelection(element, savedSel) {
  if (savedSel === null) return
  var selection = window.getSelection()
  var charIndex = 0
  var range = document.createRange()
  range.setStart(element, 0)
  range.collapse(true)
  var nodeStack = [element]
  var node
  var foundStart = false
  var stop = false

  while (!stop && (node = nodeStack.pop())) {
    if (node.nodeType == 3) {
      var nextCharIndex = charIndex + node.length
      if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
        range.setStart(node, savedSel.start - charIndex)
        foundStart = true
      }
      if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
        range.setEnd(node, savedSel.end - charIndex)
        stop = true
      }
      charIndex = nextCharIndex
    } else {
      var i = node.childNodes.length
      while (i--) {
        nodeStack.push(node.childNodes[i])
      }
    }
  }

  selection.removeAllRanges()
  selection.addRange(range)
}