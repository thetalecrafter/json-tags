import {
  elementOpenStart,
  elementOpenEnd,
  elementClose,
  currentElement,
  skip,
  attr,
  text
} from 'incremental-dom'

function isObject (value) {
  return value && typeof value === 'object' && !Array.isArray(value)
}

export default function element (array) {
  if (!array) return
  if (Array.isArray(array[0])) return array.forEach(element)

  const tagName = array[0]
  const props = isObject(array[1]) ? array[1] : null
  const children = array.slice(props ? 2 : 1)

  elementOpenStart(tagName, props && props.key)
  if (props) {
    for (const prop of Object.keys(props)) {
      attr(prop, props[prop])
    }
  }
  elementOpenEnd()

  if (props && props.skip) {
    skip()
  } else {
    for (const child of children) {
      if (typeof child === 'string') {
        text(child)
      } else {
        element(child)
      }
    }
  }

  elementClose(tagName)
}
