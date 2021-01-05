---
mainImage: ../../../images/part-6.svg
part: 6
letter: a
lang: en
---

<div class="content">


So far, we have followed the state management conventions recommended by React. We have placed the state and the methods for handling it to [the root component](https://reactjs.org/docs/lifting-state-up.html) of the application. The state and its handler methods have then been passed to other components with props. This works up to a certain point, but when applications grow larger, state management becomes challenging. 

### Flux-architecture


Facebook developed the [Flux](https://facebook.github.io/flux/docs/in-depth-overview/)- architecture to make state management easier. In Flux, the state is separated completely from the React-components into its own <i>stores</i>.
State in the store is not changed directly, but with different <i>actions</i>.


When an action changes the state of the store, the views are rerendered: 

![](https://facebook.github.io/flux/img/overview/flux-simple-f8-diagram-1300w.png)

If some action on the application, for example pushing a button, causes the need to change the state, the change is made with an action. 
This causes rerendering the view again: 

![](https://facebook.github.io/flux/img/overview/flux-simple-f8-diagram-with-client-action-1300w.png)

Flux offers a standard way for how and where the application's state is kept and how it is modified. 

### Redux

Facebook has an implementation for Flux, but we will be using the [Redux](https://redux.js.org) - library. It works with the same principle, but is a bit simpler. Facebook also uses Redux now instead of their original Flux. 


We will get to know Redux by implementing a counter application yet again: 

![](../../images/6/1.png)


Create a new create-react-app-application and install </i>redux</i> with the command

```bash
npm install redux
```


As in Flux, in Redux the state is also stored in a [store](https://redux.js.org/basics/store).


The whole state of the application is stored into <i>one</i> JavaScript-object in the store. Because our application only needs the value of the counter, we will save it straight to the store. If the state was more complicated, different things in the state would be saved as separate fields of the object. 


The state of the store is changed with [actions](https://redux.js.org/basics/actions). Actions are objects, which have at least a field determining the <i>type</i> of the action. 
Our application needs for example the following action: 

```js
{
  type: 'INCREMENT'
}
```


If there is data involved with the action, other fields can be declared as needed.  However, our counting app is so simple that the actions are fine with just the type field. 


The impact of the action to the state of the application is defined using a [reducer](https://redux.js.org/basics/reducers). In practice, a reducer is a function which is given the current state and an action as parameters. It <i>returns</i> a new state. 


Let's now define a reducer for our application: 

```js
const counterReducer = (state, action) => {
  if (action.type === 'INCREMENT') {
    return state + 1
  } else if (action.type === 'DECREMENT') {
    return state - 1
  } else if (action.type === 'ZERO') {
    return 0
  }

  return state
}
```


The first parameter is the <i>state</i> in the store. Reducer returns a <i>new state</i> based on the actions type. 


Let's change the code a bit. It is customary to use the [switch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch) -command instead of ifs in a reducer. 


Let's also define a [default value](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters) of 0 for the parameter <i>state</i>. Now the reducer works even if the store -state has not been primed yet. 

```js
const counterReducer = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    case 'ZERO':
      return 0
    default: // if none of the above matches, code comes here
    return state
  }
}
```


Reducer is never supposed to be called directly from the applications code. Reducer is only given as a parameter to the _createStore_-function which creates the store: 

```js
import { createStore } from 'redux'

const counterReducer = (state = 0, action) => {
  // ...
}

const store = createStore(counterReducer)
```


The store now uses the reducer to handle <i>actions</i>, which are <i>dispatched</i> or 'sent' to the store with its [dispatch](https://redux.js.org/api/store#dispatchaction)-method.

```js
store.dispatch({type: 'INCREMENT'})
```


You can find out the state of the store using the method [getState](https://redux.js.org/api/store#getstate).


For example the following code: 

```js
const store = createStore(counterReducer)
console.log(store.getState())
store.dispatch({type: 'INCREMENT'})
store.dispatch({type: 'INCREMENT'})
store.dispatch({type: 'INCREMENT'})
console.log(store.getState())
store.dispatch({type: 'ZERO'})
store.dispatch({type: 'DECREMENT'})
console.log(store.getState())
```


would print the following to the console

<pre>
0
3
-1
</pre>


because at first the state of the store is 0. After three <i>INCREMENT</i>-actions the state is 3. In the end, after <i>ZERO</i> and <i>DECREMENT</i> actions, the state is -1.


The third important method the store has is [subscribe](https://redux.js.org/api/store#subscribelistener), which is used to create callback functions the store calls when its state is changed.


If, for example, we would add the following function to subscribe, <i>every change in the store</i> would be printed to the console.

```js
store.subscribe(() => {
  const storeNow = store.getState()
  console.log(storeNow)
})
```


so the code

```js
const store = createStore(counterReducer)

store.subscribe(() => {
  const storeNow = store.getState()
  console.log(storeNow)
})

store.dispatch({ type: 'INCREMENT' })
store.dispatch({ type: 'INCREMENT' })
store.dispatch({ type: 'INCREMENT' })
store.dispatch({ type: 'ZERO' })
store.dispatch({ type: 'DECREMENT' })
```


would cause the following to be printed

<pre>
1
2
3
0
-1
</pre>



The code of our counter application is the following. All of the code has been written in the same file, so <i>store</i> is straight available for the React-code. We will get to know better ways to structure React/Redux-code later.

```js
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'

const counterReducer = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    case 'ZERO':
      return 0
    default:
      return state
  }
}

const store = createStore(counterReducer)

const App = () => {
  return (
    <div>
      <div>
        {store.getState()}
      </div>
      <button 
        onClick={e => store.dispatch({ type: 'INCREMENT' })}
      >
        plus
      </button>
      <button
        onClick={e => store.dispatch({ type: 'DECREMENT' })}
      >
        minus
      </button>
      <button 
        onClick={e => store.dispatch({ type: 'ZERO' })}
      >
        zero
      </button>
    </div>
  )
}

const renderApp = () => {
  ReactDOM.render(<App />, document.getElementById('root'))
}

renderApp()
store.subscribe(renderApp)
```


There are a few notable things in the code. 
<i>App</i> renders the value of the counter by asking it from the store with the method _store.getState()_. The actionhandlers of the buttons <i>dispatch</i> the right actions to the store. 


When the state in the store is changed, React is not able to automatically rerender the application. Thus we have registered a function _renderApp_, which renders the whole app, to listen for changes in the store with the  _store.subscribe_ method. Note that we have to immediately call the _renderApp_ method. Without the call the first rendering of the app would never happen. 

### Redux-notes


Our aim is to modify our note application to use Redux for state management. However, let's first cover a few key concepts through a simplified note application. 


The first version of our application is the following

```js
const noteReducer = (state = [], action) => {
  if (action.type === 'NEW_NOTE') {
    state.push(action.data)
    return state
  }

  return state
}

const store = createStore(noteReducer)

store.dispatch({
  type: 'NEW_NOTE',
  data: {
    content: 'the app state is in redux store',
    important: true,
    id: 1
  }
})

store.dispatch({
  type: 'NEW_NOTE',
  data: {
    content: 'state changes are made with actions',
    important: false,
    id: 2
  }
})

const App = () => {
  return(
    <div>
      <ul>
        {store.getState().map(note=>
          <li key={note.id}>
            {note.content} <strong>{note.important ? 'important' : ''}</strong>
          </li>
        )}
        </ul>
    </div>
  )
}
```


So far the application does not have the functionality for adding new notes, although it is possible to do so by dispatching <i>NEW\_NOTE</i> actions. 


Now the actions have a type and a field <i>data</i>, which contains the note to be added:

```js
{
  type: 'NEW_NOTE',
  data: {
    content: 'state changes are made with actions',
    important: false,
    id: 2
  }
}
```

### Pure functions, immutable

The initial version of reducer is very simple:

```js
const noteReducer = (state = [], action) => {
  if (action.type === 'NEW_NOTE') {
    state.push(action.data)
    return state
  }

  return state
}
```


The state is now an Array. <i>NEW\_NOTE</i>- type actions cause a new note to be added to the state with the [push](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push) method. 


The application seems to be working, but the reducer we have declared is bad. It breaks the [basic assumption](https://github.com/reactjs/redux/blob/master/docs/basics/Reducers.md#handling-actions) of Redux reducer that reducers must be [pure functions](https://en.wikipedia.org/wiki/Pure_function).


Pure functions are such, that they <i>do not cause any side effects</i> and they must always return the same response when called with the same parameters. 


We added a new note to the state with the method _state.push(action.data)_ which <i>changes</i> the state of the state-object. This is not allowed. The problem is easily solved by using the [concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat) method, which creates a <i>new array</i>, which contains all the elements of the old array and the new element: 

```js
const noteReducer = (state = [], action) => {
  if (action.type === 'NEW_NOTE') {
    return state.concat(action.data)
  }

  return state
}
```


A reducer state must be composed of [immutable](https://en.wikipedia.org/wiki/Immutable_object) objects. If there is a change in the state, the old object is not changed, but it is <i>replaced with a new, changed, object</i>. This is exactly what we did with the new reducer: the old array is replaced with the new. 


Let's expand our reducer so that it can handle the change of a notes importance: 

```js
{
  type: 'TOGGLE_IMPORTANCE',
  data: {
    id: 2
  }
}
```


Since we do not have any code which uses this functionality yet, we are expanding the reducer in the 'test driven' way.
Let's start by creating a test for handling the action <i>NEW\_NOTE</i>.


To make testing easier, we'll first move the reducer's code to its own module to file <i>src/reducers/noteReducer.js</i>. We'll also add the library [deep-freeze](https://github.com/substack/deep-freeze), which can be used to ensure that the reducer has been correctly defined as an immutable function. 
Let's install the library as a development dependency

```js
npm install --save-dev deep-freeze
```


The test, which we define in file <i>src/reducers/noteReducer.test.js</i>, has the following content: 

```js
import noteReducer from './noteReducer'
import deepFreeze from 'deep-freeze'

describe('noteReducer', () => {
  test('returns new state with action NEW_NOTE', () => {
    const state = []
    const action = {
      type: 'NEW_NOTE',
      data: {
        content: 'the app state is in redux store',
        important: true,
        id: 1
      }
    }

    deepFreeze(state)
    const newState = noteReducer(state, action)

    expect(newState).toHaveLength(1)
    expect(newState).toContainEqual(action.data)
  })
})
```


The <i>deepFreeze(state)</i> command ensures that the reducer does not change the state of the store given to it as a parameter. If the reducer uses the _push_ command to manipulate the state, the test will not pass

![](../../images/6/2.png)


Now we'll create a test for the <i>TOGGLE\_IMPORTANCE</i> action:

```js
test('returns new state with action TOGGLE_IMPORTANCE', () => {
  const state = [
    {
      content: 'the app state is in redux store',
      important: true,
      id: 1
    },
    {
      content: 'state changes are made with actions',
      important: false,
      id: 2
    }]

  const action = {
    type: 'TOGGLE_IMPORTANCE',
    data: {
      id: 2
    }
  }

  deepFreeze(state)
  const newState = noteReducer(state, action)

  expect(newState).toHaveLength(2)

  expect(newState).toContainEqual(state[0])

  expect(newState).toContainEqual({
    content: 'state changes are made with actions',
    important: true,
    id: 2
  })
})
```


So the following action

```js
{
  type: 'TOGGLE_IMPORTANCE',
  data: {
    id: 2
  }
}
```


has to change the importance of the note with the id 2.


The reducer is expanded as follows

```js
const noteReducer = (state = [], action) => {
  switch(action.type) {
    case 'NEW_NOTE':
      return state.concat(action.data)
    case 'TOGGLE_IMPORTANCE': {
      const id = action.data.id
      const noteToChange = state.find(n => n.id === id)
      const changedNote = { 
        ...noteToChange, 
        important: !noteToChange.important 
      }
      return state.map(note =>
        note.id !== id ? note : changedNote 
      )
     }
    default:
      return state
  }
}
```


We create a copy of the note which importance has changed with the syntax [familiar from part 2](/en/part2/altering_data_in_server#changing-the-importance-of-notes), and replace the state with a new state containing all the notes which have not changed and the copy of the changed note <i>changedNote</i>.


Let's recap what goes on in the code. First, we search for a specific note object, the importance of which we want to change: 

```js
const noteToChange = state.find(n => n.id === id)
```


then we create a new object, which is a <i>copy</i> of the original note, only the value of the <i>important</i> field has been changed to the opposite of what it was: 

```js
const changedNote = { 
  ...noteToChange, 
  important: !noteToChange.important 
}
```


A new state is then returned. We create it by taking all of the notes from the old state except for the desired note, which we replace with its slightly altered copy: 

```js
state.map(note =>
  note.id !== id ? note : changedNote 
)
```

### Array spread syntax


Because we now have quite good tests for the reducer, we can refactor the code safely. 


Adding a new note creates the state it returns with Arrays _concat_-function. Let's take a look at how we can achieve the same by using the JavaScript [array spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator) -syntax:

```js
const noteReducer = (state = [], action) => {
  switch(action.type) {
    case 'NEW_NOTE':
      return [...state, action.data]
    case 'TOGGLE_IMPORTANCE':
      // ...
    default:
    return state
  }
}
```


The spread -syntax works as follows. If we declare

```js
const numbers = [1, 2, 3]
```


<code>...numbers</code> breaks the array up into individual elements, which can be placed in another array.

```js
[...numbers, 4, 5]
```


and the result is an array `[1, 2, 3, 4, 5]`.


If we would have placed the array to another array without the spread

```js
[numbers, 4, 5]
```


the result would have been `[ [1, 2, 3], 4, 5]`.


When we take elements from an array by [destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment), a similar looking syntax is used to <i>gather</i> the rest of the elements: 

```js
const numbers = [1, 2, 3, 4, 5, 6]

const [first, second, ...rest] = numbers

console.log(first)     // prints 1
console.log(second)   // prints 2
console.log(rest)     // prints [3, 4, 5, 6]
```

</div>

<div class="tasks">

### Exercises 6.1.-6.2.


Let's make a simplified version of the unicafe-exercise from part 1. Let's handle the state management with Redux. 


You can take the project from this repository https://github.com/fullstack-hy2020/unicafe-redux for the base of your project. 


<i>Start by removing the git-configuration of the cloned repository, and by installing dependencies</i>

```bash
cd unicafe-redux   // go to the directory of cloned repository
rm -rf .git
npm install
```

#### 6.1: unicafe revisited, step1


Before implementing the functionality of the UI, let's implement the functionality required by the store. 


We have to save the number of each kind of feedback to the store, so the form of the state in the store is: 

```js
{
  good: 5,
  ok: 4,
  bad: 2
}
```


The project has the following base for a reducer: 

```js
const initialState = {
  good: 0,
  ok: 0,
  bad: 0
}

const counterReducer = (state = initialState, action) => {
  console.log(action)
  switch (action.type) {
    case 'GOOD':
      return state
    case 'OK':
      return state
    case 'BAD':
      return state
    case 'ZERO':
      return state
  }
  return state
}

export default counterReducer
```


and a base for its tests

```js
import deepFreeze from 'deep-freeze'
import counterReducer from './reducer'

describe('unicafe reducer', () => {
  const initialState = {
    good: 0,
    ok: 0,
    bad: 0
  }

  test('should return a proper initial state when called with undefined state', () => {
    const state = {}
    const action = {
      type: 'DO_NOTHING'
    }

    const newState = counterReducer(undefined, action)
    expect(newState).toEqual(initialState)
  })

  test('good is incremented', () => {
    const action = {
      type: 'GOOD'
    }
    const state = initialState

    deepFreeze(state)
    const newState = counterReducer(state, action)
    expect(newState).toEqual({
      good: 1,
      ok: 0,
      bad: 0
    })
  })
})
```


**Implement the reducer and its tests.**


In the tests, make sure that the reducer is an <i>immutable function</i> with the <i>deep-freeze</i>-library. 
Ensure that the provided first test passes, because Redux expects that the reducer returns a sensible original state when it is called so that the first parameter <i>state</i>, which represents the previous state, is 
<i>undefined</i>.


Start by expanding the reducer so that both tests pass. Then add the rest of the tests, and finally the functionality which they are testing. 


A good model for the reducer is the [redux-notes](/en/part6/flux_architecture_and_redux#pure-functions-immutable)
example above. 

#### 6.2: unicafe revisited, step2


Now implement the actual functionality of the application. 

</div>

<div class="content">

### Uncontrolled form


Let's add the functionality for adding new notes and changing their importance: 

```js
const generateId = () =>
  Number((Math.random() * 1000000).toFixed(0))

const App = () => {
  const addNote = (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    store.dispatch({
      type: 'NEW_NOTE',
      data: {
        content,
        important: false,
        id: generateId()
      }
    })
  }

  const toggleImportance = (id) => {
    store.dispatch({
      type: 'TOGGLE_IMPORTANCE',
      data: { id }
    })
  }

  return (
    <div>
      <form onSubmit={addNote}>
        <input name="note" /> 
        <button type="submit">add</button>
      </form>
      <ul>
        {store.getState().map(note =>
          <li
            key={note.id} 
            onClick={() => toggleImportance(note.id)}
          >
            {note.content} <strong>{note.important ? 'important' : ''}</strong>
          </li>
        )}
      </ul>
    </div>
  )
}
```


The implementation of both functionalities is straightforward. It is noteworthy that we <i>have not</i> bound the state of the form fields to the state of the <i>App</i> component like we have previously done. React calls this kind of form [uncontrolled](https://reactjs.org/docs/uncontrolled-components.html).


>Uncontrolled forms have certain limitations (for example, dynamic error messages or disabling the submit button based on input are not possible). However they are suitable for our current needs. 

You can read more about uncontrolled forms [here](https://goshakkk.name/controlled-vs-uncontrolled-inputs-react/).


The method handling adding new notes is simple, it just dispatches the action for adding notes: 

```js
addNote = (event) => {
  event.preventDefault()
  const content = event.target.note.value  // highlight-line
  event.target.note.value = ''
  store.dispatch({
    type: 'NEW_NOTE',
    data: {
      content,
      important: false,
      id: generateId()
    }
  })
}
```


We can get the content of the new note straight from the form field. Because the field has a name, we can access the content via the event object <i>event.target.note.value</i>.  

```js
<form onSubmit={addNote}>
  <input name="note" /> // highlight-line
  <button type="submit">add</button>
</form>
```


A note's importance can be changed by clicking its name. The event handler is very simple: 

```js
toggleImportance = (id) => {
  store.dispatch({
    type: 'TOGGLE_IMPORTANCE',
    data: { id }
  })
}
```

### Action creators

We begin to notice that, even in applications as simple as ours, using Redux can simplify the frontend code. However, we can do a lot better. 

It is actually not necessary for React-components to know the Redux action types and forms. 
Let's separate creating actions into their own functions: 

```js
const createNote = (content) => {
  return {
    type: 'NEW_NOTE',
    data: {
      content,
      important: false,
      id: generateId()
    }
  }
}

const toggleImportanceOf = (id) => {
  return {
    type: 'TOGGLE_IMPORTANCE',
    data: { id }
  }
}
```

Functions that create actions are called [action creators](https://redux.js.org/advanced/async-actions#synchronous-action-creators).

The <i>App</i> component does not have to know anything about the inner representation of the actions anymore, it just gets the right action by calling the creator-function: 

```js
const App = () => {
  const addNote = (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    store.dispatch(createNote(content)) // highlight-line
    
  }
  
  const toggleImportance = (id) => {
    store.dispatch(toggleImportanceOf(id))// highlight-line
  }

  // ...
}
```


### Forwarding Redux-Store to various components

Aside from the reducer, our application is in one file. This is of course not sensible, and we should separate <i>App</i> into its own module. 

Now the question is, how can the <i>App</i> access the store after the move? And more broadly, when a component is composed of many smaller components, there must be a way for all of the components to access the store. 

<!-- Tapoja välittää redux-store sovelluksen komponenteille on useita, tutustutaan ensin ehä uusimpaan ja helpoimpaan tapaan [react-redux](https://react-redux.js.org/)-kirjaston tarjoamaan [hooks](https://react-redux.js.org/api/hooks)-rajapintaan. -->
There are multiple ways to share the redux-store with components. First we will look into the newest, and possibly the easiest way using the [hooks](https://react-redux.js.org/api/hooks)-api of the [react-redux](https://react-redux.js.org/) library.


<!-- Asennetaan react-redux -->
First we install react-redux

```bash
npm install react-redux
```

<!-- Eriytetään komponentti _App_ omaan tiedostoon _App.js_. Tarkastellaan ensin mitä sovelluksen muiden tiedostojen sisällöksi tulee. -->
Next we move the _App_ component into its own file _App.js_. Let's see how this affects the rest of the application files.

<!-- Tiedosto _index.js_ näyttää seuraavalta -->
_Index.js_ becomes:

```js
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux' // highlight-line
import App from './App'
import noteReducer from './reducers/noteReducer'

const store = createStore(noteReducer)

ReactDOM.render(
  <Provider store={store}>  // highlight-line
    <App />
  </Provider>,  // highlight-line
  document.getElementById('root')
)
```

<!-- Uutta tässä on se, että sovellus on määritelty react redux -kirjaston tarjoaman [Provider](https://github.com/reactjs/react-redux/blob/master/docs/api.md#provider-store)-komponentin lapsena ja että sovelluksen käyttämä store on annettu Provider-komponentin attribuutiksi <i>store</i>.  -->
Note, that the application is now defined as a child of a [Provider](https://react-redux.js.org/api/provider) -component provided by the react redux library.
The application's store is given to the Provider as its attribute <i> 
store</i>.

Defining the action creators has been moved to the file <i>reducers/noteReducer.js</i> where the reducer is defined. File looks like this:

```js
const noteReducer = (state = [], action) => {
  // ...
}

const generateId = () =>
  Number((Math.random() * 1000000).toFixed(0))

export const createNote = (content) => { // highlight-line
  return {
    type: 'NEW_NOTE',
    data: {
      content,
      important: false,
      id: generateId()
    }
  }
}

export const toggleImportanceOf = (id) => { // highlight-line
  return {
    type: 'TOGGLE_IMPORTANCE',
    data: { id }
  }
}

export default noteReducer
```

If the application has many components which need the store, the <i>App</i>-component must pass <i>store</i> as props to all of those components.

The module now has multiple [export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) commands. 

The reducer function is still returned with the <i>export default</i> command, so the reducer can be imported the usual way: 

```js
import noteReducer from './reducers/noteReducer'
```

A module can have only <i>one default export</i>, but multiple "normal" exports

```js
export const createNote = (content) => {
  // ...
}

export const toggleImportanceOf = (id) => { 
  // ...
}
```


Normally (not as defaults) exported functions can be imported with the curly brace syntax:

```js
import { createNote } from './../reducers/noteReducer'
```

<!-- Komponentin <i>App</i> koodi  -->
Code for the <i>App</i> component

```js
import React from 'react'
import { 
  createNote, toggleImportanceOf
} from './reducers/noteReducer' 
import { useSelector, useDispatch } from 'react-redux'  // highlight-line


const App = () => {
  const dispatch = useDispatch()  // highlight-line
  const notes = useSelector(state => state)  // highlight-line

  const addNote = (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    dispatch(createNote(content))  // highlight-line
  }

  const toggleImportance = (id) => {
    dispatch(toggleImportanceOf(id)) // highlight-line
  }

  return (
    <div>
      <form onSubmit={addNote}>
        <input name="note" /> 
        <button type="submit">add</button>
      </form>
      <ul>
        {notes.map(note =>  // highlight-line
          <li
            key={note.id} 
            onClick={() => toggleImportance(note.id)}
          >
            {note.content} <strong>{note.important ? 'important' : ''}</strong>
          </li>
        )}
      </ul>
    </div>
  )
}

export default App
```

<!-- Komponentin koodissa on muutama mielenkiintoinen seikka. Aiemmin koodi hoiti actioinen dispatchaamisen kutsumalla redux-storen metodia dispatch: -->
There are a few things to note in the code. Previously the code dispatched actions by calling the dispatch method of the redux-store:

```js
store.dispatch({
  type: 'TOGGLE_IMPORTANCE',
  data: { id }
})
```

<!-- Nyt sama tapahtuu [useDispatch](https://react-redux.js.org/api/hooks#usedispatch)-hookin avulla saatavan <i>dispatch</i>-funktion avulla: -->
Now it does it with the <i>dispatch</i>-function from the [useDispatch](https://react-redux.js.org/api/hooks#usedispatch) -hook.

```js
import { useSelector, useDispatch } from 'react-redux'  // highlight-line

const App = () => {
  const dispatch = useDispatch()  // highlight-line
  // ...

  const toggleImportance = (id) => {
    dispatch(toggleImportanceOf(id)) // highlight-line
  }

  // ...
}
```

<!-- React-redux-kirjaston tarjoama <i>useDispatch</i>-hook siis tarjoaa mille tahansa React-komponentille pääsyn tiedostossa <i>index.js</i> määritellyn redux-storen dispatch-funktioon, jonka avulla komponentti pääsee tekemään muutoksia redux-storen tilaan. -->
The <i>useDispatch</i>-hook provides any React component access to the dispatch-function of the redux-store defined in <i>index.js</i>.
This allows all components to make changes to the state of the redux-store.


<!-- Storeen talletettuihin muistiinpanoihin komponentti pääsee käsiksi react-redux-kirjaston [useSelector](https://react-redux.js.org/api/hooks#useselector)-hookin kautta: -->
The component can access the notes stored in the store with the [useSelector](https://react-redux.js.org/api/hooks#useselector)-hook of the react-redux library.


```js
import { useSelector, useDispatch } from 'react-redux'  // highlight-line

const App = () => {
  // ...
  const notes = useSelector(state => state)  // highlight-line
  // ...
}
```

<!-- <i>useSelector</i> saa parametrikseen funktion, joka hakee tai valitsee (engl. select) tarvittavan datan redux-storesta. Tarvitsemme nyt kaikki muistiinpanot, eli selektorifunktiomme palauttaa koko staten, eli on muotoa  -->
<i>useSelector</i> receives a function as a parameter. The function either searches for or selects data from the redux-store. 
Here we need all of the notes, so our selector function returns the whole state:


```js
state => state
```

<!-- joka siis tarkoittaa samaa kuin -->
which is a shorthand for

```js
(state) => {
  return state
}
```

Usually selector functions are a bit more interesting, and return only selected parts of the contents of the redux-store. 
We could for example return only notes marked as important:

```js
const importantNotes = useSelector(state => state.filter(note => note.important))  
```

### More components

<!-- Eriytetään uuden muistiinpanon luominen omaksi komponentiksi.  -->
Let's separate creating a new note into its own component.

```js
import React from 'react'
import { useDispatch } from 'react-redux' // highlight-line
import { createNote } from '../reducers/noteReducer' // highlight-line

const NewNote = (props) => {
  const dispatch = useDispatch() // highlight-line

  const addNote = (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    dispatch(createNote(content)) // highlight-line
  }

  return (
    <form onSubmit={addNote}>
      <input name="note" />
      <button type="submit">add</button>
    </form>
  )
}

export default NewNote
```

Unlike in the React code we did without Redux, the event handler for changing the state of the app (which now lives in Redux) has been moved away from the <i>App</i> to a child component. The logic for changing the state in Redux is still neatly separated from the whole React part of the application. 

<!-- Eriytetään vielä muistiinpanojen lista ja yksittäisen muistiinpanon esittäminen omiksi komponenteikseen (jotka molemmat sijoitetaan tiedostoon <i>Notes.js</i>): -->
We'll also separate the list of notes and displaying a single note into their own components (which will both be placed in the <i>Notes.js</i> file ):

```js
import React from 'react'
import { useDispatch, useSelector } from 'react-redux' // highlight-line
import { toggleImportanceOf } from '../reducers/noteReducer' // highlight-line

const Note = ({ note, handleClick }) => {
  return(
    <li onClick={handleClick}>
      {note.content} 
      <strong> {note.important ? 'important' : ''}</strong>
    </li>
  )
}

const Notes = () => {
  const dispatch = useDispatch() // highlight-line
  const notes = useSelector(state => state) // highlight-line

  return(
    <ul>
      {notes.map(note =>
        <Note
          key={note.id}
          note={note}
          handleClick={() => 
            dispatch(toggleImportanceOf(note.id))
          }
        />
      )}
    </ul>
  )
}

export default Notes
```

The logic for changing the importance of a note is now in the component managing the list of notes. 


There is not much code left in <i>App</i>:

```js
const App = () => {

  return (
    <div>
      <NewNote />
      <Notes  />
    </div>
  )
}
```

<i>Note</i>, responsible for rendering a single note, is very simple, and is not aware that the event handler it gets as props dispatches an action. These kind of components are called [presentational](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) in React terminology. 


<i>Notes</i>, on the other hand, is a [container](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) component, as it contains some application logic: it defines what the event handlers of the <i>Note</i> components do and coordinates the configuration of <i>presentational</i> components, that is, the <i>Note</i>s.


We will return to the presentational/container division later in this part. 

The code of the Redux application can be found on [Github](https://github.com/fullstack-hy2020/redux-notes/tree/part6-1), branch <i>part6-1</i>.

</div>

<div class="tasks">

### Exercises 6.3.-6.8.


Let's make a new version of the anecdote voting application from part 1. Take the project from this repository https://github.com/fullstack-hy2020/redux-anecdotes to base your solution on.  


If you clone the project into an existing git-repository, <i>remove the git-configuration of the cloned application:</i> 

```bash
cd redux-anecdotes  // go to the cloned repository
rm -rf .git
```


The application can be started as usual, but you have to install the dependencies first: 

```bash
npm install
npm start
```


After completing these exercises, your application should look like this:

![](../../images/6/3.png)

#### 6.3: anecdotes, step1


Implement the functionality for voting anecdotes. The amount of votes must be saved to a Redux-store.

#### 6.4: anecdotes, step2


Implement the functionality for adding new anecdotes. 


You can keep the form uncontrolled, like we did [earlier](/en/part6/flux_architecture_and_redux#uncontrolled-form).

#### 6.5*: anecdotes, step3


Make sure that the anecdotes are ordered by the number of votes. 

#### 6.6: anecdotes, step4


If you haven't done so already, separate the creation of action-objects to [action creator](https://redux.js.org/basics/actions#action-creators)-functions and place them in the <i>src/reducers/anecdoteReducer.js</i> file, so do like we have been doing since the chapter [action creators](/en/part6/flux_architecture_and_redux#action-creators).

#### 6.7: anecdotes, step5


Separate the creation of new anecdotes into its own component called <i>AnecdoteForm</i>. Move all logic for creating a new anecdote into this new component. 

#### 6.8: anecdotes, step6


Separate the rendering of the anecdote list into its own component called <i>AnecdoteList</i>. Move all logic related to voting for an anecdote to this new component. 


Now the <i>App</i> component should look like this: 

```js
import React from 'react'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'

const App = () => {
  return (
    <div>
      <h2>Anecdotes</h2>
      <AnecdoteForm />
      <AnecdoteList  />
    </div>
  )
}

export default App
```
</div>
