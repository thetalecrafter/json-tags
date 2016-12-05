import { patch } from 'incremental-dom'
import element from './dom'

let anonymousIndex = 0

function update (node) {
  patch(node.shadowRoot, element, node.render(node.props))
}

const skipProps = {
  props: 1,
  connectedCallback: 1,
  attributeChangedCallback: 1,
  tagName: 1
}

function makeProp (prop, type) {
  return {
    enumerable: true,
    get () { return this.props[prop] },
    set: makeSetter(prop, type)
  }
}

function makeSetter (prop, type) {
  switch (type) {
    case Boolean:
      return function (value) {
        if (value === this.props[prop]) return
        if (this.props[prop] = Boolean(value)) {
          this.setAttribute(prop, '')
        } else {
          this.removeAttribute(prop)
        }
      }
    case String:
    case Number:
      return function (value) {
        if (value === this.props[prop]) return
        if (value == null) {
          this.props[prop] = null
          this.removeAttribute(prop)
        } else {
          this.setAttribute(prop, this.props[prop] = type(value))
        }
      }
    // case Object:
    // case Array:
    default:
      return function (value) {
        this.props[prop] = value
        update(this)
      }
  }
}

export default function createComponent (description) {
  function CustomElement () {
    const element = (typeof Reflect !== 'undefined')
      ? Reflect.construct(HTMLElement, [], CustomElement)
      : HTMLElement.call(Object.create(CustomElement.prototype))
    Object.defineProperty(element, 'props', { value: {} })
    if (element.initialize) element.initialize()
    return element
  }

  const proto = CustomElement.prototype = Object.create(HTMLElement.prototype)
  for (const prop of Object.keys(description)) {
    if (skipProps[prop]) continue
    Object.defineProperty(proto, prop, Object.getOwnPropertyDescriptor(description, prop))
  }

  const {
    connectedCallback,
    attributeChangedCallback,
    tagName = 'json-tag-' + ++anonymousIndex,
    props = {}
  } = description

  for (const prop of Object.keys(props)) {
    Object.defineProperty(proto, prop, makeProp(prop, props[prop]))
  }

  proto.connectedCallback = function () {
    this.attachShadow({ mode: 'open' })
    update(this)
    if (connectedCallback) connectedCallback.call(this)
  }

  proto.attributeChangedCallback = function (name, oldValue, newValue, ns) {
    update(this)
    if (attributeChangedCallback) attributeChangedCallback.call(this, name, oldValue, newValue, ns)
  }

  const observedAttributes = Object.keys(props)
  Object.defineProperty(CustomElement, 'observedAttributes', {
    get () { return observedAttributes }
  })

  customElements.define(tagName, CustomElement)
  return CustomElement
}
