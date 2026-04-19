---
mainImage: ../../../images/part-6.svg
part: 6
letter: d
lang: en
---

<div class="tasks">

This is the Redux-related material that has been removed from the course. You can continue with this material and its exercises if you have already started the part using Redux. Otherwise, it is recommended to follow the new material. This material will be removed in June 2026.

</div>

<div class="content">

So far, we have followed the state management conventions recommended by React. We have placed the state and the functions for handling it in the [higher level](https://react.dev/learn/sharing-state-between-components) of the component structure of the application. Quite often most of the app state and state altering functions reside directly in the root component. The state and its handler methods have then been passed to other components with props. This works up to a certain point, but when applications grow larger, state management becomes challenging.

### Flux-architecture

Already years ago Facebook developed the [Flux](https://facebookarchive.github.io/flux/docs/in-depth-overview)-architecture to make state management of React apps easier. In Flux, the state is separated from the React components and into its own <i>stores</i>.
State in the store is not changed directly, but with different <i>actions</i>.

When an action changes the state of the store, the views are rerendered:

![diagram action->dispatcher->store->view](../../images/6/flux1.png)

If some action on the application, for example pushing a button, causes the need to change the state, the change is made with an action.
This causes re-rendering the view again:

![same diagram as above but with action looping back](../../images/6/flux2.png)

Flux offers a standard way for how and where the application's state is kept and how it is modified.

### Redux

Facebook has an implementation for Flux, but we will be using the [Redux](https://redux.js.org) library. It works with the same principle but is a bit simpler. Facebook also uses Redux now instead of their original Flux.

We will get to know Redux by implementing a counter application yet again:

![browser counter application](../../images/6/1.png)

Create a new Vite application and install </i>redux</i> with the command

```bash
npm install redux
```

As in Flux, in Redux the state is also stored in a [store](https://redux.js.org/tutorials/essentials/part-1-overview-concepts#store).

The whole state of the application is stored in <i>one</i> JavaScript object in the store. Because our application only needs the value of the counter, we will save it straight to the store. If the state was more complicated, different things in the state would be saved as separate fields of the object.

The state of the store is changed with [actions](https://redux.js.org/tutorials/essentials/part-1-overview-concepts#actions). Actions are objects, which have at least a field determining the <i>type</i> of the action.
Our application needs for example the following action:

```js
{
  type: 'INCREMENT'
}
```

If there is data involved with the action, other fields can be declared as needed.  However, our counting app is so simple that the actions are fine with just the type field.

The impact of the action to the state of the application is defined using a [reducer](https://redux.js.org/tutorials/essentials/part-1-overview-concepts#reducers). In practice, a reducer is a function that is given the current state and an action as parameters. It <i>returns</i> a new state.

Let's now define a reducer for our application at <i>main.jsx</i>. The file initially looks like this:

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

The first parameter is the <i>state</i> in the store. The reducer returns a <i>new state</i> based on the _action_ type. So, e.g. when the type of Action is <i>INCREMENT</i>, the state gets the old value plus one. If the type of Action is <i>ZERO</i> the new value of state is zero.

Let's change the code a bit. We have used if-else statements to respond to an action and change the state. However, the [switch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch) statement is the most common approach to writing a reducer.

Let's also define a [default value](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters) of 0 for the parameter <i>state</i>. Now the reducer works even if the store state has not been primed yet.

```js
// highlight-start
const counterReducer = (state = 0, action) => {
  // highlight-end
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

The reducer is never supposed to be called directly from the application's code. It is only given as a parameter to the _createStore_ function which creates the store:

```js
import { createStore } from 'redux' // highlight-line

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

const store = createStore(counterReducer) // highlight-line
```

The code editor may warn that _createStore_ is deprecated. Let's ignore this for now; there is a more detailed explanation about this further below.

The store now uses the reducer to handle <i>actions</i>, which are <i>dispatched</i> or 'sent' to the store with its [dispatch](https://redux.js.org/tutorials/essentials/part-1-overview-concepts#dispatch) method.

```js
store.dispatch({ type: 'INCREMENT' })
```

You can find out the state of the store using the method [getState](https://redux.js.org/api/store#getstate).

For example the following code:

```js
// ...

const store = createStore(counterReducer)

// highlight-start
console.log(store.getState())
store.dispatch({type: 'INCREMENT'})
store.dispatch({type: 'INCREMENT'})
store.dispatch({type: 'INCREMENT'})
console.log(store.getState())
store.dispatch({type: 'ZERO'})
store.dispatch({type: 'DECREMENT'})
console.log(store.getState())
// highlight-end
```

would print the following to the console

```
0
3
-1
```

because at first, the state of the store is 0. After three <i>INCREMENT</i> actions the state is 3. In the end, after the <i>ZERO</i> and <i>DECREMENT</i> actions, the state is -1.

The third important method that the store has is [subscribe](https://redux.js.org/api/store#subscribelistener), which is used to create callback functions that the store calls whenever an action is dispatched to the store.

If, for example, we would add the following function to subscribe, <i>every change in the store</i> would be printed to the console.

```js
store.subscribe(() => {
  const storeNow = store.getState()
  console.log(storeNow)
})
```

so the code

```js
// ...

const store = createStore(counterReducer)

// highlight-start
store.subscribe(() => {
  const storeNow = store.getState()
  console.log(storeNow)
})
// highlight-end

// highlight-start
store.dispatch({ type: 'INCREMENT' })
store.dispatch({ type: 'INCREMENT' })
store.dispatch({ type: 'INCREMENT' })
store.dispatch({ type: 'ZERO' })
store.dispatch({ type: 'DECREMENT' })
// highlight-end
```

would cause the following to be printed

```
1
2
3
0
-1
```

The code of our counter application is the following. All of the code has been written in the same file, so <i>store</i> is directly available for the React code. We will get to know better ways to structure React/Redux code later. The file <i>main.jsx</i> looks as follows:

```js
import ReactDOM from 'react-dom/client'
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
      <div>{store.getState()}</div>
      <button onClick={() => store.dispatch({ type: 'INCREMENT' })}>
        plus
      </button>
      <button onClick={() => store.dispatch({ type: 'DECREMENT' })}>
        minus
      </button>
      <button onClick={() => store.dispatch({ type: 'ZERO' })}>
        zero
      </button>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))

const renderApp = () => {
  root.render(<App />)
}

renderApp()
store.subscribe(renderApp)
```

There are a few notable things in the code.
<i>App</i> renders the value of the counter by asking it from the store with the method _store.getState()_. The action handlers of the buttons <i>dispatch</i> the right actions to the store.

When the state in the store is changed, React is not able to automatically re-render the application. Thus we have registered a function _renderApp_, which renders the whole app, to listen for changes in the store with the _store.subscribe_ method. Note that we have to immediately call the _renderApp_ method. Without the call, the first rendering of the app would never happen.

### A note about the use of createStore

The most observant will notice that the name of the function createStore is overlined. If you move the mouse over the name, an explanation will appear

![vscode error showing createStore deprecated, use configureStore instead](../../images/6/30new.png)

The full explanation is as follows

><i>We recommend using the configureStore method of the @reduxjs/toolkit package, which replaces createStore.</i>
>
><i>Redux Toolkit is our recommended approach for writing Redux logic today, including store setup, reducers, data fetching, and more.</i>
>
><i>For more details, please read this Redux docs page: <https://redux.js.org/introduction/why-rtk-is-redux-today></i>
>
><i>configureStore from Redux Toolkit is an improved version of createStore that simplifies setup and helps avoid common bugs.</i>
>
><i>You should not be using the redux core package by itself today, except for learning purposes. The createStore method from the core redux package will not be removed, but we encourage all users to migrate to using Redux Toolkit for all Redux code.</i>

So, instead of the function <i>createStore</i>, it is recommended to use the slightly more "advanced" function <i>configureStore</i>, and we will also use it when we have achieved the basic functionality of Redux.

Side note: <i>createStore</i> is defined as "deprecated", which usually means that the feature will be removed in some newer version of the library. The explanation above and this [discussion](https://stackoverflow.com/questions/71944111/redux-createstore-is-deprecated-cannot-get-state-from-getstate-in-redux-ac) reveal that <i>createStore</i> will not be removed, and it has been given the status <i>deprecated</i>, perhaps with slightly incorrect reasons. So the function is not obsolete, but today there is a more preferable, new way to do almost the same thing.

### Redux-notes

We aim to modify our note application to use Redux for state management. However, let's first cover a few key concepts through a simplified note application.

The first version of our application, written in the file <i>main.jsx</i>, looks as follows:

```js
import ReactDOM from 'react-dom/client'
import { createStore } from 'redux'

const noteReducer = (state = [], action) => {
  switch (action.type) {
    case 'NEW_NOTE':
      state.push(action.payload)
      return state
    default:
      return state
  }
}

const store = createStore(noteReducer)

store.dispatch({
  type: 'NEW_NOTE',
  payload: {
    content: 'the app state is in redux store',
    important: true,
    id: 1
  }
})

store.dispatch({
  type: 'NEW_NOTE',
  payload: {
    content: 'state changes are made with actions',
    important: false,
    id: 2
  }
})

const App = () => {
  return (
    <div>
      <ul>
        {store.getState().map(note => (
          <li key={note.id}>
            {note.content} <strong>{note.important ? 'important' : ''}</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))

const renderApp = () => {
  root.render(<App />)
}

renderApp()
store.subscribe(renderApp)
```

So far the application does not have the functionality for adding new notes, although it is possible to do so by dispatching <i>NEW\_NOTE</i> actions.

Now the actions have a type and a field <i>payload</i>, which contains the note to be added:

```js
{
  type: 'NEW_NOTE',
  payload: {
    content: 'state changes are made with actions',
    important: false,
    id: 2
  }
}
```

The choice of the field name is not random. The general convention is that actions have exactly two fields, <i>type</i> telling the type and <i>payload</i> containing the data included with the Action.

### Pure functions, immutable

The initial version of the reducer is very simple:

```js
const noteReducer = (state = [], action) => {
  switch (action.type) {
    case 'NEW_NOTE':
      state.push(action.payload)
      return state
    default:
      return state
  }
}
```

The state is now an Array. <i>NEW\_NOTE</i>-type actions cause a new note to be added to the state with the [push](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push) method.

The application seems to be working, but the reducer we have declared is bad. It breaks the [basic assumption](https://redux.js.org/tutorials/essentials/part-1-overview-concepts#reducers) that reducers must be [pure functions](https://en.wikipedia.org/wiki/Pure_function).

Pure functions are such, that they <i>do not cause any side effects</i> and they must always return the same response when called with the same parameters.

We added a new note to the state with the method _state.push(action.payload)_ which <i>changes</i> the state of the state-object. This is not allowed. The problem is easily solved by using the [concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat) method, which creates a <i>new array</i>, which contains all the elements of the old array and the new element:

```js
const noteReducer = (state = [], action) => {
  switch (action.type) {
    case 'NEW_NOTE':
      return state.concat(action.payload) // highlight-line
    default:
      return state
  }
}
```

A reducer state must be composed of [immutable](https://en.wikipedia.org/wiki/Immutable_object) objects. If there is a change in the state, the old object is not changed, but it is <i>replaced with a new, changed, object</i>. This is exactly what we did with the new reducer: the old array is replaced with the new one.

Let's expand our reducer so that it can handle the change of a note's importance:

```js
{
  type: 'TOGGLE_IMPORTANCE',
  payload: {
    id: 2
  }
}
```

Since we do not have any code which uses this functionality yet, we are expanding the reducer in the 'test-driven' way. 

### Configuring the test environment

We have to first configure the [Vitest](https://vitest.dev/) testing library for the project. Let's install it as a development dependency for the application:

```js
npm install --save-dev vitest
```

Let us expand <i>package.json</i> with a script for running the tests:

```json
{
  // ...
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "test": "vitest" // highlight-line
  },
  // ...
}
```

To make testing easier, let's move the reducer's code to its own module, to the file <i>src/reducers/noteReducer.js</i>:

```js
const noteReducer = (state = [], action) => {
  switch (action.type) {
    case 'NEW_NOTE':
      return state.concat(action.payload)
    default:
      return state
  }
}

export default noteReducer
```

The file <i>main.jsx</i> changes as follows:

```js
import ReactDOM from 'react-dom/client'
import { createStore } from 'redux'
import noteReducer from './reducers/noteReducer' // highlight-line

const store = createStore(noteReducer)

// ...
```

We'll also add the library [deep-freeze](https://www.npmjs.com/package/deep-freeze), which can be used to ensure that the reducer has been correctly defined as an immutable function.
Let's install the library as a development dependency:

```js
npm install --save-dev deep-freeze
```

We are now ready to write tests.

### Tests for noteReducer

Let's start by creating a test for handling the action <i>NEW\_NOTE</i>. The test, which we define in file <i>src/reducers/noteReducer.test.js</i>, has the following content:

```js
import deepFreeze from 'deep-freeze'
import { describe, expect, test } from 'vitest'
import noteReducer from './noteReducer'

describe('noteReducer', () => {
  test('returns new state with action NEW_NOTE', () => {
    const state = []
    const action = {
      type: 'NEW_NOTE',
      payload: {
        content: 'the app state is in redux store',
        important: true,
        id: 1
      }
    }

    deepFreeze(state)
    const newState = noteReducer(state, action)

    expect(newState).toHaveLength(1)
    expect(newState).toContainEqual(action.payload)
  })
})
```

Run the test with <i>npm test</i>. The test ensures that the new state returned by the reducer is an array containing a single element, which is the same object as the one in the action’s <i>payload</i> field.

The <i>deepFreeze(state)</i> command ensures that the reducer does not change the state of the store given to it as a parameter. If the reducer used the _push_ command to manipulate the state, the test would fail:

![terminal showing test failure and error about not using array.push](../../images/6/2.png)

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
    }
  ]

  const action = {
    type: 'TOGGLE_IMPORTANCE',
    payload: {
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
  payload: {
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
      return state.concat(action.payload)
    // highlight-start
    case 'TOGGLE_IMPORTANCE': {
      const id = action.payload.id
      const noteToChange = state.find(n => n.id === id)
      const changedNote = {
        ...noteToChange,
        important: !noteToChange.important
      }
      return state.map(note => (note.id !== id ? note : changedNote))
    }
    // highlight-end
    default:
      return state
  }
}
```

We create a copy of the note whose importance has changed with the syntax [familiar from part 2](/en/part2/altering_data_in_server#changing-the-importance-of-notes), and replace the state with a new state containing all the notes which have not changed and the copy of the changed note <i>changedNote</i>.

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
state.map(note => (note.id !== id ? note : changedNote))
```

### Array spread syntax

Because we now have quite good tests for the reducer, we can refactor the code safely.

Adding a new note creates the state returned from the Array's _concat_ function. Let's take a look at how we can achieve the same by using the JavaScript [array spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator) syntax:

```js
const noteReducer = (state = [], action) => {
  switch(action.type) {
    case 'NEW_NOTE':
      return [...state, action.payload] // highlight-line
    case 'TOGGLE_IMPORTANCE': {
      // ...
    }
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

and the result is an array <i>[1, 2, 3, 4, 5]</i>.

If we would have placed the array to another array without the spread

```js
[numbers, 4, 5]
```

the result would have been <i>[ [1, 2, 3], 4, 5]</i>.

When we take elements from an array by [destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment), a similar-looking syntax is used to <i>gather</i> the rest of the elements:

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

Let's make a simplified version of the unicafe exercise from part 1. Let's handle the state management with Redux.

You can take the code from this repository <https://github.com/fullstack-hy2020/unicafe-redux> for the base of your project.

<i>Start by removing the git configuration of the cloned repository, and by installing dependencies</i>

```bash
cd unicafe-redux   // go to the directory of cloned repository
rm -rf .git
npm install
```

#### 6.1: Unicafe Revisited, step 1

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
    case 'RESET':
      return state
    default:
      return state
  }
}

export default counterReducer
```

and a base for its tests

```js
import deepFreeze from 'deep-freeze'
import { describe, expect, test } from 'vitest'
import counterReducer from './reducer'

describe('unicafe reducer', () => {
  const initialState = {
    good: 0,
    ok: 0,
    bad: 0
  }

  test('should return a proper initial state when called with undefined state', () => {
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

The provided first test should pass without any changes. Redux expects that the reducer returns the original state when it is called with a first parameter - which represents the previous <i>state</i> - with the value <i>undefined</i>.

Start by expanding the reducer so that both tests pass. After that, add the remaining tests for the different actions of the reducer and implement the corresponding functionality in the reducer.

In the tests, make sure that the reducer is an <i>immutable function</i> with the <i>deep-freeze</i> library. A good model for the reducer is the [redux-notes](/en/part6/flux_architecture_and_redux#pure-functions-immutable) example above.

#### 6.2: Unicafe Revisited, step2

Now implement the actual functionality of the application.

Your application can have a modest appearance, nothing else is needed but buttons and the number of reviews for each type:

![browser showing good bad ok buttons](../../images/6/50new.png)

</div>

<div class="content">

### Uncontrolled form

Let's add the functionality for adding new notes and changing their importance:

```js
// ...

const generateId = () => Number((Math.random() * 1000000).toFixed(0)) // highlight-line

const App = () => {
  // highlight-start
  const addNote = event => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    store.dispatch({
      type: 'NEW_NOTE',
      payload: {
        content,
        important: false,
        id: generateId()
      }
    })
  }
    // highlight-end

  // highlight-start
  const toggleImportance = id => {
    store.dispatch({
      type: 'TOGGLE_IMPORTANCE',
      payload: { id }
    })
  }
    // highlight-end

  return (
    <div>
      // highlight-start
      <form onSubmit={addNote}>
        <input name="note" /> 
        <button type="submit">add</button>
      </form>
        // highlight-end
      <ul>
        {store.getState().map(note => (
          <li key={note.id} onClick={() => toggleImportance(note.id)}> // highlight-line
            {note.content} <strong>{note.important ? 'important' : ''}</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ...
```

The implementation of both functionalities is straightforward. It is noteworthy that we <i>have not</i> bound the state of the form fields to the state of the <i>App</i> component like we have previously done. React calls this kind of form [uncontrolled](https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable).

>Uncontrolled forms have certain limitations (for example, dynamic error messages or disabling the submit button based on input are not possible). However they are suitable for our current needs.

You can read more about uncontrolled forms [here](https://goshakkk.name/controlled-vs-uncontrolled-inputs-react/).

The method for adding new notes is simple, it dispatches the action for adding notes:

```js
addNote = event => {
  event.preventDefault()
  const content = event.target.note.value
  event.target.note.value = ''
  store.dispatch({
    type: 'NEW_NOTE',
    payload: {
      content,
      important: false,
      id: generateId()
    }
  })
}
```

The content of the new note is obtained directly from the form’s input field, which can be accessed through the event object:

```js
const content = event.target.note.value
```

Please note that the input field must have a name in order to access its value:  

```js
<form onSubmit={addNote}>
  <input name="note" /> // highlight-line
  <button type="submit">add</button>
</form>
```

A note's importance can be changed by clicking its name. The event handler is very simple:

```js
toggleImportance = id => {
  store.dispatch({
    type: 'TOGGLE_IMPORTANCE',
    payload: { id }
  })
}
```

### Action creators

We begin to notice that, even in applications as simple as ours, using Redux can simplify the frontend code. However, we can do a lot better.

React components don't need to know the Redux action types and forms.
Let's separate creating actions into separate functions:

```js
const createNote = content => {
  return {
    type: 'NEW_NOTE',
    payload: {
      content,
      important: false,
      id: generateId()
    }
  }
}

const toggleImportanceOf = id => {
  return {
    type: 'TOGGLE_IMPORTANCE',
    payload: { id }
  }
}
```

Functions that create actions are called [action creators](https://redux.js.org/tutorials/essentials/part-1-overview-concepts#action-creators).

The <i>App</i> component does not have to know anything about the inner representation of the actions anymore, it just gets the right action by calling the creator function:

```js
const App = () => {
  const addNote = event => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    store.dispatch(createNote(content)) // highlight-line
    
  }
  
  const toggleImportance = id => {
    store.dispatch(toggleImportanceOf(id))// highlight-line
  }

  // ...
}
```

### Forwarding Redux Store to various components

Aside from the reducer, our application is in one file. This is of course not sensible, and we should separate <i>App</i> into its module.

Now the question is, how can the <i>App</i> access the store after the move? And more broadly, when a component is composed of many smaller components, there must be a way for all of the components to access the store.

There are multiple ways to share the Redux store with the components. First, we will look into the newest, and possibly the easiest way, which is using the [hooks](https://react-redux.js.org/api/hooks) API of the [react-redux](https://react-redux.js.org/) library.

First, we install react-redux

```bash
npm install react-redux
```


Let's organize the application code more sensibly into several different files. The file _main.jsx_ looks as follows after the changes:

```js
import ReactDOM from 'react-dom/client'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import App from './App'
import noteReducer from './reducers/noteReducer'

const store = createStore(noteReducer)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
```

Note, that the application is now defined as a child of a [Provider](https://react-redux.js.org/api/provider) component provided by the react-redux library. The application's store is given to the Provider as its attribute <i>store</i>:

```js
const store = createStore(noteReducer)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}> // highlight-line
    <App />
  </Provider> // highlight-line
)
```

This makes the store accessible to all components in the application, as we will soon see.

Defining the action creators has been moved to the file <i>src/reducers/noteReducer.js</i> where the reducer is defined. That file looks like this:

```js
const noteReducer = (state = [], action) => {
  switch (action.type) {
    case 'NEW_NOTE':
      return [...state, action.payload]
    case 'TOGGLE_IMPORTANCE': {
      const id = action.payload.id
      const noteToChange = state.find(n => n.id === id)
      const changedNote = {
        ...noteToChange,
        important: !noteToChange.important
      }
      return state.map(note => (note.id !== id ? note : changedNote))
    }
    default:
      return state
  }
}

const generateId = () =>
  Number((Math.random() * 1000000).toFixed(0))

export const createNote = (content) => {
  return {
    type: 'NEW_NOTE',
    payload: {
      content,
      important: false,
      id: generateId()
    }
  }
}

export const toggleImportanceOf = (id) => {
  return {
    type: 'TOGGLE_IMPORTANCE',
    payload: { id }
  }
}

export default noteReducer
```

The module now has multiple [export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) commands. The reducer function is still returned with the <i>export default</i> command, so the reducer can be imported the usual way:

```js
import noteReducer from './reducers/noteReducer'
```

A module can have only <i>one default export</i>, but multiple "normal" exports:

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
import { createNote } from '../../reducers/noteReducer'
```

Next, we move the _App_ component into its own file _src/App.jsx_. The content of the file is as follows:

```js
import { createNote, toggleImportanceOf } from './reducers/noteReducer'
import { useSelector, useDispatch } from 'react-redux' 


const App = () => {
  const dispatch = useDispatch()
  const notes = useSelector(state => state)

  const addNote = (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    dispatch(createNote(content))
  }

  const toggleImportance = (id) => {
    dispatch(toggleImportanceOf(id))
  }

  return (
    <div>
      <form onSubmit={addNote}>
        <input name="note" /> 
        <button type="submit">add</button>
      </form>
      <ul>
        {notes.map(note => 
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

There are a few things to note in the code. Previously the code dispatched actions by calling the dispatch method of the Redux store:

```js
store.dispatch({
  type: 'TOGGLE_IMPORTANCE',
  payload: { id }
})
```

Now it does it with the <i>dispatch</i> function from the [useDispatch](https://react-redux.js.org/api/hooks#usedispatch) hook.

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

The <i>useDispatch</i> hook provides any React component access to the dispatch function of the Redux store defined in <i>main.jsx</i>. This allows all components to make changes to the state of the Redux store.

The component can access the notes stored in the store with the [useSelector](https://react-redux.js.org/api/hooks#useselector)-hook of the react-redux library.

```js
import { useSelector, useDispatch } from 'react-redux'  // highlight-line

const App = () => {
  // ...
  const notes = useSelector(state => state)  // highlight-line
  // ...
}
```

<i>useSelector</i> receives a function as a parameter. The function either searches for or selects data from the Redux store.
Here we need all of the notes, so our selector function returns the whole state:

```js
state => state
```

which is a shorthand for:

```js
(state) => {
  return state
}
```

Usually, selector functions are a bit more interesting and return only selected parts of the contents of the Redux store.
We could for example return only notes marked as important:

```js
const importantNotes = useSelector(state => state.filter(note => note.important))  
```

The current version of the application can be found on [GitHub](https://github.com/fullstack-hy2020/redux-notes/tree/part6-0), branch <i>part6-0</i>.

### More components

Let's separate the form responsible for creating a new note into its own component in the file <i>src/components/NoteForm.jsx</i>:

```js
import { useDispatch } from 'react-redux'
import { createNote } from '../reducers/noteReducer'

const NoteForm = () => {
  const dispatch = useDispatch()

  const addNote = (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    dispatch(createNote(content))
  }

  return (
    <form onSubmit={addNote}>
      <input name="note" />
      <button type="submit">add</button>
    </form>
  )
}

export default NoteForm
```

Unlike in the React code we did without Redux, the event handler for changing the state of the app (which now lives in Redux) has been moved away from the <i>App</i> to a child component. The logic for changing the state in Redux is still neatly separated from the whole React part of the application.

We'll also separate the list of notes and displaying a single note into their own components Let's place both in the file <i>src/components/Notes.jsx</i>:

```js
import { useDispatch, useSelector } from 'react-redux'
import { toggleImportanceOf } from '../reducers/noteReducer'

const Note = ({ note, handleClick }) => {
  return (
    <li onClick={handleClick}>
      {note.content}
      <strong> {note.important ? 'important' : ''}</strong>
    </li>
  )
}

const Notes = () => {
  const dispatch = useDispatch()
  const notes = useSelector(state => state)

  return (
    <ul>
      {notes.map(note => (
        <Note
          key={note.id}
          note={note}
          handleClick={() => dispatch(toggleImportanceOf(note.id))}
        />
      ))}
    </ul>
  )
}

export default Notes
```

The logic for changing the importance of a note is now in the component managing the list of notes.

Only a small amount of code remains in the file <i>App.jsx</i>:

```js
import NoteForm from './components/NoteForm'
import Notes from './components/Notes'

const App = () => {
  return (
    <div>
      <NoteForm />
      <Notes />
    </div>
  )
}

export default App
```

<i>Note</i>, responsible for rendering a single note, is very simple and is not aware that the event handler it gets as props dispatches an action. These kinds of components are called [presentational](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) in React terminology.

<i>Notes</i>, on the other hand, is a [container](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) component, as it contains some application logic: it defines what the event handlers of the <i>Note</i> components do and coordinates the configuration of <i>presentational</i> components, that is, the <i>Note</i>s.

The code of the Redux application can be found on [GitHub](https://github.com/fullstack-hy2020/redux-notes/tree/part6-1), on the branch <i>part6-1</i>.

</div>

<div class="tasks">

### Exercises 6.3.-6.8.

Let's make a new version of the anecdote voting application from part 1. Take the project from this repository <https://github.com/fullstack-hy2020/redux-anecdotes> as the base of your solution.

If you clone the project into an existing git repository, <i>remove the git configuration of the cloned application:</i>

```bash
cd redux-anecdotes  // go to the cloned repository
rm -rf .git
```

The application can be started as usual, but you have to install the dependencies first:

```bash
npm install
npm run dev
```

After completing these exercises, your application should look like this:

![browser showing anecdotes and vote buttons](../../images/6/3.png)

#### 6.3: Anecdotes, step 1

Implement the functionality for voting anecdotes. The number of votes must be saved to a Redux store.

#### 6.4: Anecdotes, step 2

Implement the functionality for adding new anecdotes.

You can keep the form uncontrolled like we did [earlier](/en/part6/flux_architecture_and_redux#uncontrolled-form).

#### 6.5: Anecdotes, step 3

Make sure that the anecdotes are ordered by the number of votes.

#### 6.6: Anecdotes, step 4

If you haven't done so already, separate the creation of action-objects to [action creator](https://read.reduxbook.com/markdown/part1/04-action-creators.html)-functions and place them in the <i>src/reducers/anecdoteReducer.js</i> file, so do what we have been doing since the chapter [action creators](/en/part6/flux_architecture_and_redux#action-creators).

#### 6.7: Anecdotes, step 5

Separate the creation of new anecdotes into a component called <i>AnecdoteForm</i>. Move all logic for creating a new anecdote into this new component.

#### 6.8: Anecdotes, step 6

Separate the rendering of the anecdote list into a component called <i>AnecdoteList</i>. Move all logic related to voting for an anecdote to this new component.

Now the <i>App</i> component should look like this:

```js
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'

const App = () => {
  return (
    <div>
      <h2>Anecdotes</h2>
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App
```

</div>


<div class="content">

Let's continue our work with the simplified [Redux version](/en/part6/flux_architecture_and_redux#redux-notes) of our notes application.

To ease our development, let's change our reducer so that the store gets initialized with a state that contains a couple of notes:

```js
// highlight-start
const initialState = [
  {
    content: 'reducer defines how redux store works',
    important: true,
    id: 1,
  },
  {
    content: 'state of store can contain any data',
    important: false,
    id: 2,
  },
]
//highlight-end

const noteReducer = (state = initialState, action) => { // highlight-line
  // ...
}

// ...

export default noteReducer
```

### Store with complex state

Let's implement filtering for the notes that are displayed to the user. The user interface for the filters will be implemented with [radio buttons](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio):

![browser with important/not radio buttons and list](../../images/6/01f.png)

Let's start with a very simple and straightforward implementation:

```js
import NoteForm from './components/NoteForm'
import Notes from './components/Notes'

const App = () => {
//highlight-start
  const filterSelected = (value) => {
    console.log(value)
  }
//highlight-end

  return (
    <div>
      <NoteForm />
      //highlight-start
      <div>
        <input
          type="radio"
          name="filter"
          onChange={() => filterSelected('ALL')}
        />
        all
        <input
          type="radio"
          name="filter"
          onChange={() => filterSelected('IMPORTANT')}
        />
        important
        <input
          type="radio"
          name="filter"
          onChange={() => filterSelected('NONIMPORTANT')}
        />
        nonimportant
      </div>
      //highlight-end
      <Notes />
    </div>
  )
}
```

Since the <i>name</i> attribute of all the radio buttons is the same, they form a <i>button group</i> where only one option can be selected.

The buttons have a change handler that currently only prints the string associated with the clicked button to the console.

In the following section, we will implement filtering by storing both the notes as well as <i>the value of the filter</i> in the redux store. When we are finished, we would like the state of the store to look like this:

```js
{
  notes: [
    { content: 'reducer defines how redux store works', important: true, id: 1},
    { content: 'state of store can contain any data', important: false, id: 2}
  ],
  filter: 'IMPORTANT'
}
```

Only the array of notes was stored in the state of the previous implementation of our application. In the new implementation, the state object has two properties, <i>notes</i> that contains the array of notes and <i>filter</i> that contains a string indicating which notes should be displayed to the user.

### Combined reducers

We could modify our current reducer to deal with the new shape of the state. However, a better solution in this situation is to define a new separate reducer for the state of the filter. Let's also create a new _action creator_ function and place the code in the module <i>src/reducers/filterReducer.js</i>:

```js
const filterReducer = (state = 'ALL', action) => {
  switch (action.type) {
    case 'SET_FILTER':
      return action.payload
    default:
      return state
  }
}

export const filterChange = filter => {
  return {
    type: 'SET_FILTER',
    payload: filter
  }
}

export default filterReducer
```

The actions for changing the state of the filter look like this:

```js
{
  type: 'SET_FILTER',
  payload: 'IMPORTANT'
}
```

We can create the actual reducer for our application by combining the two existing reducers with the [combineReducers](https://redux.js.org/api/combinereducers) function.

Let's define the combined reducer in the <i>main.jsx</i> file. The updated content of the file is as follows:

```js
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'

import App from './App'
import filterReducer from './reducers/filterReducer'
import noteReducer from './reducers/noteReducer'

const reducer = combineReducers({
  notes: noteReducer,
  filter: filterReducer
})

const store = createStore(reducer)

console.log(store.getState())

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <div />
  </Provider>
)
```

Since our application breaks completely at this point, we render an empty <i>div</i> element instead of the <i>App</i> component.

Thanks to the console.log command, the state of the store is printed to the console:

![devtools console showing notes array data](../../images/6/4e.png)

As we can see from the output, the store has the exact shape we wanted it to!

Let's take a closer look at how the combined reducer is created:

```js
const reducer = combineReducers({
  notes: noteReducer,
  filter: filterReducer,
})
```

The state of the store defined by the reducer above is an object with two properties: <i>notes</i> and <i>filter</i>. The value of the <i>notes</i> property is defined by the <i>noteReducer</i>, which does not have to deal with the other properties of the state. Likewise, the <i>filter</i> property is managed by the <i>filterReducer</i>.

Before we make more changes to the code, let's take a look at how different actions change the state of the store defined by the combined reducer. Let's temporarily add the following lines to the file <i>main.jsx</i>:

```js
// ...

const store = createStore(reducer)

console.log(store.getState())

// highlight-start
import { createNote } from './reducers/noteReducer'
import { filterChange } from './reducers/filterReducer'
// highlight-end

// highlight-start
store.subscribe(() => console.log(store.getState()))
store.dispatch(filterChange('IMPORTANT'))
store.dispatch(createNote('combineReducers forms one reducer from many simple reducers'))
// highlight-end

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <div />
  </Provider>
)
```

By simulating the creation of a note and changing the state of the filter in this fashion, the state of the store gets logged to the console after every change that is made to the store:

![devtools console output showing notes filter and new note](../../images/6/5e.png)

At this point, it is good to become aware of a tiny but important detail. If we add a console log statement <i>to the beginning of both reducers</i>:

```js
const filterReducer = (state = 'ALL', action) => {
  console.log('ACTION: ', action) // highlight-line
  // ...
}
```

Based on the console output one might get the impression that every action gets duplicated:

![devtools console output showing duplicated actions in note and filter reducers](../../images/6/6.png)

Is there a bug in our code? No. The combined reducer works in such a way that every <i>action</i> gets handled in <i>every</i> part of the combined reducer, or in other words, every reducer "listens" to all of the dispatched actions and does something with them if it has been instructed to do so. Typically only one reducer is interested in any given action, but there are situations where multiple reducers change their respective parts of the state based on the same action.

### Finishing the filters

Let's finish the application so that it uses the combined reducer. Let's remove the extra test code from the file <i>main.jsx</i> and restore _App_ as the rendered component. The updated content of the file is as follows:

```js
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'

import App from './App'
import filterReducer from './reducers/filterReducer'
import noteReducer from './reducers/noteReducer'

const reducer = combineReducers({
  notes: noteReducer,
  filter: filterReducer
})

const store = createStore(reducer)

console.log(store.getState())

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
```

Next, let's fix a bug that is caused by the code expecting the application store to be an array of notes:

![browser TypeError: notes.map is not a function](../../images/6/7v.png)

It's an easy fix. Because the notes are in the store's field <i>notes</i>, we only have to make a little change to the selector function:

```js
const Notes = () => {
  const dispatch = useDispatch()
  const notes = useSelector(state => state.notes) // highlight-line

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
```

Previously the selector function returned the whole state of the store:

```js
const notes = useSelector(state => state)
```

And now it returns only its field <i>notes</i>

```js
const notes = useSelector(state => state.notes)
```

Let's extract the visibility filter into its own <i>src/components/VisibilityFilter.jsx</i> component:

```js
import { useDispatch } from 'react-redux'
import { filterChange } from '../reducers/filterReducer'

const VisibilityFilter = () => {
  const dispatch = useDispatch()

  return (
    <div>
      <input
        type="radio"
        name="filter"
        onChange={() => dispatch(filterChange('ALL'))}
      />
      all
      <input
        type="radio"
        name="filter"
        onChange={() => dispatch(filterChange('IMPORTANT'))}
      />
      important
      <input
        type="radio"
        name="filter"
        onChange={() => dispatch(filterChange('NONIMPORTANT'))}
      />
      nonimportant
    </div>
  )
}

export default VisibilityFilter
```

With the new component, <i>App</i> can be simplified as follows:

```js
import NoteForm from './components/NoteForm'
import Notes from './components/Notes'
import VisibilityFilter from './components/VisibilityFilter'

const App = () => {
  return (
    <div>
      <NoteForm />
      <VisibilityFilter />
      <Notes />
    </div>
  )
}

export default App
```

The implementation is rather straightforward. Clicking the different radio buttons changes the state of the store's <i>filter</i> property.

Let's change the <i>Notes</i> component to incorporate the filter:

```js
const Notes = () => {
  const dispatch = useDispatch()
  // highlight-start
  const notes = useSelector(state => {
    if (state.filter === 'ALL') {
      return state.notes
    }
    return state.filter === 'IMPORTANT'
      ? state.notes.filter(note => note.important)
      : state.notes.filter(note => !note.important)
  })
  // highlight-end

  return (
    <ul>
      {notes.map(note => (
        <Note
          key={note.id}
          note={note}
          handleClick={() => dispatch(toggleImportanceOf(note.id))}
        />
      ))}
    </ul>
  )
}
```

We only make changes to the selector function, which used to be

```js
useSelector(state => state.notes)
```

Let's simplify the selector by destructuring the fields from the state it receives as a parameter:

```js
const notes = useSelector(({ filter, notes }) => {
  if ( filter === 'ALL' ) {
    return notes
  }
  return filter  === 'IMPORTANT' 
    ? notes.filter(note => note.important)
    : notes.filter(note => !note.important)
})
```

There is a slight cosmetic flaw in our application. Even though the filter is set to <i>ALL</i> by default, the associated radio button is not selected. Naturally, this issue can be fixed, but since this is an unpleasant but ultimately harmless bug we will save the fix for later.

The current version of the application can be found on [GitHub](https://github.com/fullstack-hy2020/redux-notes/tree/part6-2), branch <i>part6-2</i>.

</div>

<div class="tasks">

### Exercise 6.9

#### 6.9 Anecdotes, step 7

Implement filtering for the anecdotes that are displayed to the user.

![browser showing filtering of anecdotes](../../images/6/9ea.png)

Store the state of the filter in the redux store. It is recommended to create a new reducer, action creators, and a combined reducer for the store using the <i>combineReducers</i> function.

Create a new <i>Filter</i> component for displaying the filter. You can use the following code as a template for the component:

```js
const Filter = () => {
  const handleChange = (event) => {
    // input-field value is in variable event.target.value
  }
  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  )
}

export default Filter
```

</div>

<div class="content">

### Redux Toolkit and Refactoring the Store Configuration

As we have seen so far, Redux's configuration and state management implementation requires quite a lot of effort. This is manifested for example in the reducer and action creator-related code which has somewhat repetitive boilerplate code. [Redux Toolkit](https://redux-toolkit.js.org/) is a library that solves these common Redux-related problems. The library for example greatly simplifies the configuration of the Redux store and offers a large variety of tools to ease state management.

Let's start using Redux Toolkit in our application by refactoring the existing code. First, we will need to install the library:

```bash
npm install @reduxjs/toolkit
```

Next, open the <i>main.jsx</i> file which currently creates the Redux store. Instead of Redux's <em>createStore</em> function, let's create the store using Redux Toolkit's [configureStore](https://redux-toolkit.js.org/api/configureStore) function:

```js
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit' // highlight-line

import App from './App'
import filterReducer from './reducers/filterReducer'
import noteReducer from './reducers/noteReducer'

 // highlight-start
const store = configureStore({
  reducer: {
    notes: noteReducer,
    filter: filterReducer
  }
})
// highlight-end

console.log(store.getState())

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
```

We already got rid of a few lines of code, now we don't need the <em>combineReducers</em> function to create the store's reducer. We will soon see that the <em>configureStore</em> function has many additional benefits such as the effortless integration of development tools and many commonly used libraries without the need for additional configuration.

Let's further clean up the <i>main.jsx</i> file by moving the code related to the creation of the Redux store into a separate file. Let's create a new file <i>src/store.js</i>:
```js
import { configureStore } from '@reduxjs/toolkit'

import noteReducer from './reducers/noteReducer'
import filterReducer from './reducers/filterReducer'

const store = configureStore({
  reducer: {
    notes: noteReducer,
    filter: filterReducer
  }
})

export default store
```

After the changes, the content of the <i>main.jsx</i> is the following:

```js
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'

import App from './App'
import store from './store'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
```

### Redux Toolkit and Refactoring Reducers

Let's move on to refactoring the reducers, which brings forth the benefits of the Redux Toolkit. With Redux Toolkit, we can easily create reducer and related action creators using the [createSlice](https://redux-toolkit.js.org/api/createSlice) function. We can use the <em>createSlice</em> function to refactor the reducer and action creators in the <i>reducers/noteReducer.js</i> file in the following manner:

```js
import { createSlice } from '@reduxjs/toolkit' // highlight-line

const initialState = [
  {
    content: 'reducer defines how redux store works',
    important: true,
    id: 1,
  },
  {
    content: 'state of store can contain any data',
    important: false,
    id: 2,
  },
]

const generateId = () =>
  Number((Math.random() * 1000000).toFixed(0))

// highlight-start
const noteSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    createNote(state, action) {
      const content = action.payload

      state.push({
        content,
        important: false,
        id: generateId(),
      })
    },
    toggleImportanceOf(state, action) {
      const id = action.payload

      const noteToChange = state.find(n => n.id === id)

      const changedNote = { 
        ...noteToChange, 
        important: !noteToChange.important 
      }

      return state.map(note =>
        note.id !== id ? note : changedNote 
      )     
    }
  },
})
// highlight-end

// highlight-start
export const { createNote, toggleImportanceOf } = noteSlice.actions
export default noteSlice.reducer
// highlight-end
```

The <em>createSlice</em> function's <em>name</em> parameter defines the prefix which is used in the action's type values. For example, the <em>createNote</em> action defined later will have the type value of <em>notes/createNote</em>. It is a good practice to give the parameter a value which is unique among the reducers. This way there won't be unexpected collisions between the application's action type values.
The <em>initialState</em> parameter defines the reducer's initial state.
The <em>reducers</em> parameter takes the reducer itself as an object, of which functions handle state changes caused by certain actions. Note that the <em>action.payload</em> in the function contains the argument provided by calling the action creator:

```js
dispatch(createNote('Redux Toolkit is awesome!'))
```

This dispatch call is equivalent to dispatching the following object:

```js
dispatch({ type: 'notes/createNote', payload: 'Redux Toolkit is awesome!' })
```

If you followed closely, you might have noticed that inside the <em>createNote</em> action, there seems to happen something that violates the reducers' immutability principle mentioned earlier:

```js
createNote(state, action) {
  const content = action.payload

  state.push({
    content,
    important: false,
    id: generateId(),
  })
}
```

We are mutating <em>state</em> argument's array by calling the <em>push</em> method instead of returning a new instance of the array. What's this all about?

Redux Toolkit utilizes the [Immer](https://immerjs.github.io/immer/) library with reducers created by <em>createSlice</em> function, which makes it possible to mutate the <em>state</em> argument inside the reducer. Immer uses the mutated state to produce a new, immutable state and thus the state changes remain immutable. Note that <em>state</em> can be changed without "mutating" it, as we have done with the <em>toggleImportanceOf</em> action. In this case, the function directly <i>returns</i> the new state. Nevertheless mutating the state will often come in handy especially when a complex state needs to be updated.

The <em>createSlice</em> function returns an object containing the reducer as well as the action creators defined by the <em>reducers</em> parameter. The reducer can be accessed by the <em>noteSlice.reducer</em> property, whereas the action creators by the <em>noteSlice.actions</em> property. We can produce the file's exports in the following way:

```js
const noteSlice = createSlice({
  // ...
})

// highlight-start
export const { createNote, toggleImportanceOf } = noteSlice.actions
export default noteSlice.reducer
// highlight-end
```

The imports in other files will work just as they did before:

```js
import noteReducer, { createNote, toggleImportanceOf } from './reducers/noteReducer'
```

We need to alter the action type names in the tests due to the conventions of ReduxToolkit:

```js 
import deepFreeze from 'deep-freeze'
import { describe, expect, test } from 'vitest'
import noteReducer from './noteReducer'

describe('noteReducer', () => {
  test('returns new state with action notes/createNote', () => { // highlight-line
    const state = []
    const action = {
      type: 'notes/createNote', // highlight-line
      payload: 'the app state is in redux store' // highlight-line
    }

    deepFreeze(state)
    const newState = noteReducer(state, action)

    expect(newState).toHaveLength(1)
    expect(newState.map(note => note.content)).toContainEqual(action.payload) // highlight-line
  })
})

test('returns new state with action notes/toggleImportanceOf', () => { // highlight-line
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
    }
  ]

  const action = {
    type: 'notes/toggleImportanceOf', // highlight-line
    payload: 2 // highlight-line
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

You can find the code for our current application in its entirety in the <i>part6-3</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/redux-notes/tree/part6-3).

### Redux Toolkit and console.log

As we have learned, console.log is an extremely powerful tool; it often saves us from trouble.

Let's try to print the state of the Redux Store to the console in the middle of the reducer created with the function createSlice:

```js
const noteSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    // ...
    toggleImportanceOf(state, action) {
      const id = action.payload

      const noteToChange = state.find(n => n.id === id)

      const changedNote = { 
        ...noteToChange, 
        important: !noteToChange.important 
      }

      console.log(state) // highlight-line

      return state.map(note =>
        note.id !== id ? note : changedNote 
      )     
    }
  },
})
```

When we now change the importance of a note by clicking its name, the following is printed to the console

![devtools console showing Handler,Target as null but IsRevoked as true](../../images/6/40new.png)

The output is interesting but not very useful. This is about the previously mentioned Immer library used by the Redux Toolkit internally to save the state of the Store.

The state can be converted to a human-readable format by using the [current](https://redux-toolkit.js.org/api/other-exports#current) function from the immer library. The function can be imported with the following command:

```js
import { current } from '@reduxjs/toolkit'
```

and after this, the state can be printed to the console with the following command:

```js
console.log(current(state))
```

Console output is now human readable

![dev tools showing array of 2 notes](../../images/6/41new.png)

### Redux DevTools

[Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd) is a Chrome addon that offers useful development tools for Redux. It can be used for example to inspect the Redux store's state and dispatch actions through the browser's console. When the store is created using Redux Toolkit's <em>configureStore</em> function, no additional configuration is needed for Redux DevTools to work.

Once the addon is installed, clicking the <i>Redux</i> tab in the browser's developer tools, the Redux DevTools should open:

![browser with redux addon in devtools](../../images/6/42new.png)

You can inspect how dispatching a certain action changes the state by clicking the action:

![devtools inspecting state tree in redux](../../images/6/43new.png)

It is also possible to dispatch actions to the store using the development tools:

![devtools redux dispatching createNote with payload](../../images/6/44new.png)

</div>

<div class="tasks">

### Exercises 6.10.-6.13.

Let's continue working on the anecdote application using Redux that we started in exercise 6.3.

#### 6.10 Anecdotes, step 8

Install Redux Toolkit for the project. Move the Redux store creation into the file <i>store.js</i> and use Redux Toolkit's <em>configureStore</em> to create the store.

Change the definition of the <i>filter reducer and action creators</i> to use the Redux Toolkit's <em>createSlice</em> function.

Also, start using Redux DevTools to debug the application's state easier.

#### 6.11 Anecdotes, step 9

Change also the definition of the <i>anecdote reducer and action creators</i> to use the Redux Toolkit's <em>createSlice</em> function.

#### 6.12 Anecdotes, step 10

The application has a ready-made body for the <i>Notification</i> component:

```js
const Notification = () => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10
  }

  return (
    <div style={style}>
      render here notification...
    </div>
  )
}

export default Notification
```

Extend the component so that it renders the message stored in the Redux store. Create a separate reducer for the new functionality by using the Redux Toolkit's <em>createSlice</em> function.

The application does not have to use the <i>Notification</i> component intelligently at this point in the exercises. It is enough for the application to display the initial value set for the message in the <i>notificationReducer</i>.

#### 6.13 Anecdotes, step 11

Extend the application so that it uses the <i>Notification</i> component to display a message for five seconds when the user votes for an anecdote or creates a new anecdote:

![browser showing message of having voted](../../images/6/8eb.png)

It's recommended to create separate [action creators](https://redux-toolkit.js.org/api/createSlice#reducers) for setting and removing notifications.

</div>


<div class="content">

### Setting up JSON Server

Let's expand the application so that the notes are stored in the backend. We'll use [json-server](/en/part2/getting_data_from_server), familiar from part 2.

The initial state of the database is stored in the file <i>db.json</i>, which is placed in the root of the project:

```json
{
  "notes": [
    {
      "content": "the app state is in redux store",
      "important": true,
      "id": 1
    },
    {
      "content": "state changes are made with actions",
      "important": false,
      "id": 2
    }
  ]
}
```

We'll install json-server for the project:

```js
npm install json-server --save-dev
```

and add the following line to the <i>scripts</i> part of the file <i>package.json</i>

```js
"scripts": {
  "server": "json-server -p 3001 db.json",
  // ...
}
```

Now let's launch json-server with the command _npm run server_.

### Fetch API

In software development, it is often necessary to consider whether a certain functionality should be implemented using an external library or whether it is better to utilize the native solutions provided by the environment. Both approaches have their own advantages and challenges.

In the earlier parts of this course, we used the [Axios](https://axios-http.com/docs/intro) library to make HTTP requests. Now, let's explore an alternative way to make HTTP requests using the native [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

It is typical for an external library like <i>Axios</i> to be implemented using other external libraries. For example, if you install Axios in your project with the command _npm install axios_, the console output will be:

```bash
$ npm install axios

added 23 packages, and audited 302 packages in 1s

71 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

So, in addition to the Axios library, the command would install over 20 other npm packages that Axios needs to function.

The <i>Fetch API</i> provides a similar way to make HTTP requests as Axios, but using the Fetch API does not require installing any external libraries. Maintaining the application becomes easier when there are fewer libraries to update, and security is also improved because the potential attack surface of the application is reduced. The security and maintainability of applications is discussed further in [part 7](https://fullstackopen.com/en/part7/class_components_miscellaneous#react-node-application-security) of the course.

In practice, requests are made using the _fetch()_ function. The syntax used differs somewhat from Axios. We will also soon notice that Axios has taken care of some things for us and made our lives easier. However, we will now use the Fetch API, as it is a widely used native solution that every Full Stack developer should be familiar with.

### Getting data from the backend

Let's create a method for fetching data from the backend in the file <i>src/services/notes.js</i>:

```js
const baseUrl = 'http://localhost:3001/notes'

const getAll = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error('Failed to fetch notes')
  }

  const data = await response.json()
  return data
}

export default { getAll }
```

Let's take a closer look at the implementation of the _getAll_ method. The notes are now fetched from the backend by calling the _fetch()_ function, which is given the backend's URL as an argument. The request type is not explicitly defined, so _fetch_ performs its default action, which is a GET request.

Once the response has arrived, the success of the request is checked using the _response.ok_ property, and an error is thrown if necessary:

```js
if (!response.ok) {
  throw new Error('Failed to fetch notes')
}
```

The _response.ok_ attribute is set to _true_ if the request was successful, meaning the response status code is between 200 and 299. For all other status codes, such as 404 or 500, it is set to _false_.

Note that _fetch_ does not automatically throw an error even if the response status code is, for example, 404. Error handling must be implemented manually, as we have done here.

If the request is successful, the data contained in the response is converted to JSON format:

```js
const data = await response.json()
```

_fetch_ does not automatically convert any data included in the response to JSON format; the conversion must be done manually. It is also important to note that _response.json()_ is an asynchronous method, so the <i>await</i> keyword is required.

Let's further simplify the code by directly returning the data returned by the _response.json()_ method:

```js
const getAll = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error('Failed to fetch notes')
  }

  return await response.json() // highlight-line
}
```

### Initializing the store with data fetched from the server

Let's now modify our application so that the application state is initialized with notes fetched from the server.

In the file <i>noteReducer.js</i>, change the initialization of the notes state so that by default there are no notes:

```js
const noteSlice = createSlice({
  name: 'notes',
  initialState: [], // highlight-line
  // ...
})
```

Let's add an action creator called <em>setNotes</em>, which allows us to directly replace the array of notes. We can create the desired action creator using the <em>createSlice</em> function as follows:

```js
// ...

const noteSlice = createSlice({
  name: 'notes',
  initialState: [],
  reducers: {
    createNote(state, action) {
      const content = action.payload
      state.push({
        content,
        important: false,
        id: generateId()
      })
    },
    toggleImportanceOf(state, action) {
      const id = action.payload
      const noteToChange = state.find(n => n.id === id)
      const changedNote = {
        ...noteToChange,
        important: !noteToChange.important
      }
      return state.map(note => (note.id !== id ? note : changedNote))
    },
    // highlight-start
    setNotes(state, action) {
      return action.payload
    }
    // highlight-end
  }
})

export const { createNote, toggleImportanceOf, setNotes } = noteSlice.actions // highlight-line
export default noteSlice.reducer
```

Let's implement the initialization of notes in the <i>App</i> component. As is usually the case when fetching data from a server, we will use the <i>useEffect</i> hook:

```js
import { useEffect } from 'react' // highlight-line
import { useDispatch } from 'react-redux' // highlight-line

import NoteForm from './components/NoteForm'
import Notes from './components/Notes'
import VisibilityFilter from './components/VisibilityFilter'
import { setNotes } from './reducers/noteReducer' // highlight-line
import noteService from './services/notes' // highlight-line

const App = () => {
  const dispatch = useDispatch() // highlight-line

  // highlight-start
  useEffect(() => {
    noteService.getAll().then(notes => dispatch(setNotes(notes)))
  }, [dispatch])
  // highlight-end

  return (
    <div>
      <NoteForm />
      <VisibilityFilter />
      <Notes />
    </div>
  )
}

export default App
```

The notes are fetched from the server using the _getAll()_ method we defined, and then stored in the Redux store by dispatching the action returned by the _setNotes_ action creator. These operations are performed inside the <i>useEffect</i> hook, meaning they are executed when the App component is rendered for the first time.

Let's take a closer look at a small detail. We have added the _dispatch_ variable to the dependency array of the <i>useEffect</i> hook. If we try to use an empty dependency array, ESLint gives the following warning: <i>React Hook useEffect has a missing dependency: 'dispatch'</i>. What does this mean?

Logically, the code would work exactly the same even if we used an empty dependency array, because dispatch refers to the same function throughout the execution of the program. However, it is considered good programming practice to add all variables and functions used inside the _useEffect_ hook that are defined within the component to the dependency array. This helps to avoid unexpected bugs.

### Sending data to the backend

Next, let's implement the functionality for sending a new note to the server. This will also give us an opportunity to practice how to make a POST request using the _fetch()_ method.

Let's extend the code in <i>src/services/notes.js</i> that handles communication with the server as follows:

```js
const baseUrl = 'http://localhost:3001/notes'

const getAll = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error('Failed to fetch notes')
  }

  return await response.json()
}

// highlight-start
const createNew = async (content) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, important: false }),
  })
  
  if (!response.ok) {
    throw new Error('Failed to create note')
  }
  
  return await response.json()
}
// highlight-end

export default { getAll, createNew } // highlight-line
```

Let's take a closer look at the implementation of the _createNew_ method. The first parameter of the _fetch()_ function specifies the URL to which the request is made. The second parameter is an object that defines other details of the request, such as the request type, headers, and the data sent with the request. We can further clarify the code by storing the object that defines the request details in a separate <i>options</i> variable:

```js
const createNew = async (content) => {
  // highlight-start
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, important: false }),
  }
  
  const response = await fetch(baseUrl, options)
  // highlight-end

  if (!response.ok) {
    throw new Error('Failed to create note')
  }
  
  return await response.json()
}
```

Let's take a closer look at the <i>options</i> object:

- <i>method</i> defines the type of the request, which in this case is <i>POST</i>
- <i>headers</i> defines the request headers. We add the header _'Content-Type': 'application/json'_ to let the server know that the data sent with the request is in JSON format, so it can handle the request correctly
- <i>body</i> contains the data sent with the request. You cannot directly assign a JavaScript object to this field; it must first be converted to a JSON string by calling the _JSON.stringify()_ function

As with a GET request, the response status code is checked for errors:

```js
if (!response.ok) {
  throw new Error('Failed to create note')
}
```

If the request is successful, <i>JSON Server</i> returns the newly created note, for which it has also generated a unique <i>id</i>. However, the data contained in the response still needs to be converted to JSON format using the _response.json()_ method:

```js
return await response.json()
```

Let's then modify our application's <i>NoteForm</i> component so that a new note is sent to the backend. The component's _addNote_ method will change slightly:

```js
import { useDispatch } from 'react-redux'
import { createNote } from '../reducers/noteReducer'
import noteService from '../services/notes' // highlight-line

const NoteForm = (props) => {
  const dispatch = useDispatch()
  
  const addNote = async (event) => { // highlight-line
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    const newNote = await noteService.createNew(content) // highlight-line
    dispatch(createNote(newNote)) // highlight-line
  }

  return (
    <form onSubmit={addNote}>
      <input name="note" />
      <button type="submit">add</button>
    </form>
  )
}

export default NoteForm
```

When a new note is created in the backend by calling the _createNew()_ method, the return value is an object representing the note, to which the backend has generated a unique <i>id</i>. Therefore, let's modify the action creator <i>createNote</i> defined in <i>notesReducer.js</i> as follows:

```js
const noteSlice = createSlice({
  name: 'notes',
  initialState: [],
  reducers: {
    createNote(state, action) {
      state.push(action.payload) // highlight-line
    },
    // ..
  },
})
```

Changing the importance of notes could be implemented using the same principle, by making an asynchronous method call to the server and then dispatching an appropriate action.

The current state of the code for the application can be found on [GitHub](https://github.com/fullstack-hy2020/redux-notes/tree/part6-4) in the branch <i>part6-4</i>.

</div>

<div class="tasks">

### Exercises 6.14.-6.15.

#### 6.14 Anecdotes and the Backend, step 1

When the application launches, fetch the anecdotes from the backend implemented using json-server. Use the Fetch API to make the HTTP request.

As the initial backend data, you can use, e.g. [this](https://github.com/fullstack-hy2020/misc/blob/master/anecdotes.json).

#### 6.15 Anecdotes and the Backend, step 2

Modify the creation of new anecdotes, so that the anecdotes are stored in the backend. Utilize the Fetch API in your implementation once again.

</div>

<div class="content">

### Asynchronous actions and Redux Thunk

Our approach is quite good, but it is not great that the communication with the server happens inside the functions of the components. It would be better if the communication could be abstracted away from the components so that they don't have to do anything else but call the appropriate <i>action creator</i>. As an example, <i>App</i> would initialize the state of the application as follows:

```js
const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeNotes())
  }, [dispatch]) 
  
  // ...
}
```

and <i>NoteForm</i> would create a new note as follows:

```js
const NoteForm = () => {
  const dispatch = useDispatch()
  
  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    dispatch(createNote(content))
  }

  // ...
}
```

In this implementation, both components would dispatch an action without the need to know about the communication with the server that happens behind the scenes. These kinds of <i>async actions</i> can be implemented using the [Redux Thunk](https://github.com/reduxjs/redux-thunk) library. The use of the library doesn't need any additional configuration or even installation when the Redux store is created using the Redux Toolkit's <em>configureStore</em> function.

Thanks to Redux Thunk, it is possible to define <i>action creators</i> that return a function instead of an object. This makes it possible to implement asynchronous action creators that first wait for some asynchronous operation to complete and only then dispatch the actual action.

If an action creator returns a function, Redux automatically passes the Redux store's <em>dispatch</em> and <em>getState</em> methods as arguments to the returned function. This allows us to define an action creator called <em>initializeNotes</em> in the <i>noteReducer.js</i> file, which fetches the initial notes from the server, as follows:

```js
import { createSlice } from '@reduxjs/toolkit'
import noteService from '../services/notes' // highlight-line

const noteSlice = createSlice({
  name: 'notes',
  initialState: [],
  reducers: {
    createNote(state, action) {
      state.push(action.payload)
    },
    toggleImportanceOf(state, action) {
      const id = action.payload
      const noteToChange = state.find((n) => n.id === id)
      const changedNote = {
        ...noteToChange,
        important: !noteToChange.important,
      }
      return state.map((note) => (note.id !== id ? note : changedNote))
    },
    setNotes(state, action) {
      return action.payload
    },
  },
})

const { setNotes } = noteSlice.actions // highlight-line

// highlight-start
export const initializeNotes = () => {
  return async (dispatch) => {
    const notes = await noteService.getAll()
    dispatch(setNotes(notes))
  }
}
// highlight-end

export const { createNote, toggleImportanceOf } = noteSlice.actions // highlight-line

export default noteSlice.reducer
```

In its inner function, that is, in the <i>asynchronous action</i>, the operation first fetches all notes from the server and then <i>dispatches</i> the action to add the notes to the store. It is noteworthy that Redux automatically passes a reference to the _dispatch_ method as an argument to the function, so the action creator _initializeNotes_ does not require any parameters.

The action creator _setNotes_ is no longer exported outside the module, since the initial state of the notes will now be set using the asynchronous action creator _initializeNotes_ we created. However, we still use the _setNotes_ action creator within the module.

The component <i>App</i> can now be defined as follows:

```js
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import NoteForm from './components/NoteForm'
import Notes from './components/Notes'
import VisibilityFilter from './components/VisibilityFilter'
import { initializeNotes } from './reducers/noteReducer' // highlight-line

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeNotes()) // highlight-line
  }, [dispatch])

  return (
    <div>
      <NoteForm />
      <VisibilityFilter />
      <Notes />
    </div>
  )
}

export default App
```

The solution is elegant. The initialization logic for the notes has been completely separated from the React component.

Next, let's create an asynchronous action creator called _appendNote_:

```js
import { createSlice } from '@reduxjs/toolkit'
import noteService from '../services/notes'

const noteSlice = createSlice({
  name: 'notes',
  initialState: [],
  reducers: {
    createNote(state, action) {
      state.push(action.payload)
    },
    toggleImportanceOf(state, action) {
      const id = action.payload
      const noteToChange = state.find((n) => n.id === id)
      const changedNote = {
        ...noteToChange,
        important: !noteToChange.important,
      }
      return state.map((note) => (note.id !== id ? note : changedNote))
    },
    setNotes(state, action) {
      return action.payload
    },
  },
})

const { createNote, setNotes } = noteSlice.actions // highlight-line

export const initializeNotes = () => {
  return async (dispatch) => {
    const notes = await noteService.getAll()
    dispatch(setNotes(notes))
  }
}

// highlight-start
export const appendNote = (content) => {
  return async (dispatch) => {
    const newNote = await noteService.createNew(content)
    dispatch(createNote(newNote))
  }
}
// highlight-end

export const { toggleImportanceOf } = noteSlice.actions // highlight-line

export default noteSlice.reducer
```

The principle is the same once again. First, an asynchronous operation is performed, and once it is completed, an action that updates the store's state is <i>dispatched</i>. The _createNote_ action creator is no longer exported outside the file; it is used only internally in the implementation of the _appendNote_ function.

The component <i>NoteForm</i> changes as follows:

```js
import { useDispatch } from 'react-redux'
import { appendNote } from '../reducers/noteReducer' // highlight-line

const NoteForm = () => {
  const dispatch = useDispatch()

  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    dispatch(appendNote(content)) // highlight-line
  }

  return (
    <form onSubmit={addNote}>
      <input name="note" />
      <button type="submit">add</button>
    </form>
  )
}
```

The current state of the code for the application can be found on [GitHub](https://github.com/fullstack-hy2020/redux-notes/tree/part6-5) in the branch <i>part6-5</i>.

Redux Toolkit offers a multitude of tools to simplify asynchronous state management. Suitable tools for this use case are for example the [createAsyncThunk](https://redux-toolkit.js.org/api/createAsyncThunk) function and the [RTK Query](https://redux-toolkit.js.org/rtk-query/overview) API.

</div>

<div class="tasks">

### Exercises 6.16.-6.19.

#### 6.16 Anecdotes and the Backend, step 3

Modify the initialization of the Redux store to happen using asynchronous action creators, which are made possible by the Redux Thunk library.

#### 6.17 Anecdotes and the Backend, step 4

Also modify the creation of a new anecdote to happen using asynchronous action creators, made possible by the Redux Thunk library.

#### 6.18 Anecdotes and the Backend, step 5

Voting does not yet save changes to the backend. Fix the situation with the help of the Redux Thunk library and the Fetch API.

#### 6.19 Anecdotes and the Backend, step 6

The creation of notifications is still a bit tedious since one has to do two actions and use the _setTimeout_ function:

```js
dispatch(setNotification(`new anecdote '${content}'`))
setTimeout(() => {
  dispatch(clearNotification())
}, 5000)
```

Make an action creator, which enables one to provide the notification as follows:

```js
dispatch(setNotification(`you voted '${anecdote.content}'`, 10))
```

The first parameter is the text to be rendered and the second parameter is the time to display the notification given in seconds.

Implement the use of this improved notification in your application.

</div>
