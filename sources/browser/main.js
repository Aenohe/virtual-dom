/* CustomCustom */

var MyComponent = function(props) {
  return (
    <div>{props.content}</div>
  )
}

/* JSX */

function createNode(type, props, children) {
  if (typeof type === 'function') {
    return type(props)
  }

  return {
    type: type,
    props: props || {},
    children: Array.from(arguments).slice(2)
  }
}

var elements = (
  <div class="test">
    <MyComponent content="Yeah !" />
    <input type="checkbox" checked={false} />
    <button onClick={ function() { alert('yeah !')} }>Click me !</button>
    <ul class="list">
      <li>item 1</li>
      <li>item 2</li>
    </ul>
  </div>
)

var elementsUpdated = (
  <div>
    <input type="checkbox" checked={true} />
    <button onClick={ function() { alert('hello !')} }>Click me !</button>
    <ul>
      <li>item 1</li>
      <li>
        <ul class="test">
          <li>item 1</li>
          <li>Test</li>
        </ul>
      </li>
    </ul>
  </div>
)

/* Event Prop */

function isEventProp(name) {
  return /^on/.test(name)
}

function extractEventName(name) {
  return name.slice(2).toLowerCase()
}

/* Prop */

function setProp(element, name, value) {
  if (isEventProp(name)) {
    element.addEventListener(extractEventName(name), value)
  } else {
    element.setAttribute(name, value)

    if (typeof value === 'boolean') {
      element[name] = value
    }
  }
}

function removeProp(element, name, value) {
  if (isEventProp(name)) {
    element.removeEventListener(extractEventName(name), value)
  } else {
    element.removeAttribute(name)

    if (typeof value === 'boolean') {
      element[name] = false
    }
  }
}

function updateProp(element, name, newValue, oldValue) {
  if (!newValue) {
    removeProp(element, name, oldValue)
  } else if (!oldValue || !isEventProp(name) && newValue !== oldValue) {
    setProp(element, name, newValue)
  } else if (isEventProp(name)) {
    removeProp(element, name, oldValue)
    setProp(element, name, newValue)
  }
}

/* Props */

function setProps(element, props) {
  Object.keys(props).forEach(function(name) {
    setProp(element, name, props[name])
  })
}

function updateProps(element, newProps, oldProps) {
  var props = Object.assign({}, newProps, oldProps)

  Object.keys(props).forEach(function(name) {
    updateProp(element, name, newProps[name], oldProps[name])
  })
}

/* Element */

function isDifferentNode(a, b) {
  return (
    typeof a !== typeof b ||
    typeof a === 'string' && a !== b ||
    a.type !== b.type
  )
}

function updateElement(parentElement, newNode, oldNode, index) {
  if (!index) {
    index = 0
  }

  if (!oldNode) {
    parentElement.appendChild(createElement(newNode))
  } else if (!newNode) {
    parentElement.removeChild(parentElement.childNodes[index])
  } else if (isDifferentNode(newNode, oldNode)) {
    parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index]
    )
  } else if (newNode.type) {
    var newNodeChildrenLength = newNode.children.length
    var oldNodeChildrenLength = oldNode.children.length

    updateProps(parentElement.childNodes[index], newNode.props, oldNode.props)

    for (var i = 0; i < newNodeChildrenLength || i < oldNodeChildrenLength; i++) {
      updateElement(
        parentElement.childNodes[index],
        newNode.children[i],
        oldNode.children[i],
        i
      )
    }
  }
}

function createElement(node) {
  if (typeof node === 'string') {
    return document.createTextNode(node)
  }

  var element = document.createElement(node.type)

  setProps(element, node.props)

  node.children.map(createElement).forEach(element.appendChild.bind(element))

  return element
}

/* Main */

var rootElement = document.getElementById('root')

rootElement.appendChild(createElement(elements))

var updateButtonElement = document.getElementById('update')
updateButtonElement.addEventListener('click', function() {
  updateElement(rootElement, elementsUpdated, elements)

  var tmp = elements
  elements = elementsUpdated
  elementsUpdated = tmp
})
