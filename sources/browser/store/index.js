/* Store */

var store

function createStore() {
  var currentState = {}
  var subscribers = []
  var currentReducers = {}

  var currentReducer = function(state, action) {
    return state
  }

  function dispatch(action) {
    console.log('dispatch action', action)
    var previousState = currentState
    currentState = currentReducer({ ...currentState }, action)

    subscribers.forEach(function(subscriber) {
      subscriber(currentState, previousState)
    })
  }

  function addReducers(reducers) {
    console.log('addReucers', reducers)

    currentReducers = { ...currentReducers, ...reducers }

    console.log('reducerSet', currentReducers)

    currentReducer = function(state, action) {
      var ret = {}

      Object.keys(currentReducers).forEach(function(key) {
        var reducer = currentReducers[key]

        ret[key] = reducer(state[key], action)
      })

      console.log('ret', ret)

      return ret
    }

    console.log('currentReducer', currentReducer)
  }

  function subscribe(fn) {
    subscribers.push(fn)
  }

  function unsubscribe(fn) {
    subscribers.splice(subscribers.indexOf(fn), 1)
  }

  function getState() {
    return { ...currentState }
  }

  return {
    addReducers: addReducers,
    dispatch: dispatch,
    subscribe: subscribe,
    unsubscribe: unsubscribe,
    getState: getState
  }
}

function getStoreInstance() {
  if (!store) {
    return store = createStore()
  }

  return store
}

var myStore = getStoreInstance()

var myReducerOne = function(state = {}, action) {
  console.log('action for one', action)
  switch (action.type) {
    case 'TEST_ONE':
      return {
        ...state,
        test: 'one'
      }
    default:
      return state
  }
}

var myReducerTwo = function(state = {}, action) {
  console.log('action for two', action)
  switch (action.type) {
    case 'TEST_TWO':
      return {
        ...state,
        test: 'two'
      }
    default:
      return state
  }
}

myStore.addReducers({
  myReducerOne: myReducerOne,
  myReducerTwo: myReducerTwo
})

console.log('before', myStore.getState())


myStore.dispatch({
  type: 'TEST_ONE'
})

myStore.dispatch({
  type: 'TEST_TWO'
})

console.log('after', myStore.getState())
