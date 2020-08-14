---
mainImage: ../../../images/part-6.svg
part: 6
letter: b
lang: en
---

<div class="content">


Let's continue our work with the simplified [redux version](/en/part6/flux_architecture_and_redux#redux-notes) of our notes application.


In order to ease our development, let's change our reducer so that the store gets initialized with a state that contains a couple of notes:

```js
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

const noteReducer = (state = initialState, action) => {
  // ...
}

// ...
export default noteReducer
```


### Store with complex state


Let's implement filtering for the notes that are displayed to the user. The user interface for the filters will be implemented with [radio buttons](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio):

![](../../images/6/01e.png)


Let's start with a very simple and straightforward implementation:

```js
import React from 'react'
import NewNote from './components/NewNote'
import Notes from './components/Notes'

const App = () => {
//highlight-start
  const filterSelected = (value) => {
    console.log(value)
  }
//highlight-end

  return (
    <div>
      <NewNote />
        //highlight-start
      <div>
        all          <input type="radio" name="filter"
          onChange={() => filterSelected('ALL')} />
        important    <input type="radio" name="filter"
          onChange={() => filterSelected('IMPORTANT')} />
        nonimportant <input type="radio" name="filter"
          onChange={() => filterSelected('NONIMPORTANT')} />
      </div>
      //highlight-end
      <Notes />
    </div>
  )
}
```


Since the <i>name</i> attribute of all the radio buttons is the same, they form a <i>button group</i> where only one option can be selected.


The buttons have a change handler that currently only prints the string associated with the clicked button to the console.


We decide to implement the filter functionality by storing <i>the value of the filter</i> in the redux store in addition to the notes themselves. The state of the store should look like this after making these changes:

```js
{
  notes: [
    { content: 'reducer defines how redux store works', important: true, id: 1},
    { content: 'state of store can contain any data', important: false, id: 2}
  ],
  filter: 'IMPORTANT'
}
```


Only the array of notes is stored in the state of the current implementation of our application. In the new implementation the state object has two properties, <i>notes</i> that contains the array of notes and <i>filter</i> that contains a string indicating which notes should be displayed to the user.

### Combined reducers


We could modify our current reducer to deal with the new shape of the state. However, a better solution in this situation is to define a new separate reducer for the state of the filter:

```js
const filterReducer = (state = 'ALL', action) => {
  switch (action.type) {
    case 'SET_FILTER':
      return action.filter
    default:
      return state
  }
}
```


The actions for changing the state of the filter look like this:

```js
{
  type: 'SET_FILTER',
  filter: 'IMPORTANT'
}
```


Let's also create a new _action creator_ function. We will write the code for the action creator in a new <i>src/reducers/filterReducer.js</i> module:

```js
const filterReducer = (state = 'ALL', action) => {
  // ...
}

export const filterChange = filter => {
  return {
    type: 'SET_FILTER',
    filter,
  }
}

export default filterReducer
```


We can create the actual reducer for our application by combining the two existing reducers with the [combineReducers](https://redux.js.org/api/combinereducers) function.


Let's define the combined reducer in the <i>index.js</i> file:

```js
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers } from 'redux' // highlight-line
import { Provider } from 'react-redux' 
import App from './App'

import noteReducer from './reducers/noteReducer'
import filterReducer from './reducers/filterReducer' // highlight-line

 // highlight-start
const reducer = combineReducers({
  notes: noteReducer,
  filter: filterReducer
})
 // highlight-end

const store = createStore(reducer)

console.log(store.getState())

ReactDOM.render(
  /*
  <Provider store={store}>
    <App />
  </Provider>,
  */
  <div />,
  document.getElementById('root')
)
```

Since our application breaks completely at this point, we render an empty <i>div</i> element instead of the <i>App</i> component.


The state of the store gets printed to the console:

![](../../images/6/4e.png)


As we can see from the output, the store has the exact shape we wanted it to!


Let's take a closer look at how the combined reducer is created:

```js
const reducer = combineReducers({
  notes: noteReducer,
  filter: filterReducer,
})
```


The state of the store defined by the reducer above is an object with two properties: <i>notes</i> and <i>filter</i>. The value of the <i>notes</i> property is defined by the <i>noteReducer</i>, which does not have to deal with the other properties of the state. Likewise, the <i>filter</i> property is managed by the <i>filterReducer</i>.


Before we make more changes to the code, let's take a look at how different actions change the state of the store defined by the combined reducer. Let's add the following to the <i>index.js</i> file:

```js
import { createNote } from './reducers/noteReducer'
import { filterChange } from './reducers/filterReducer'
//...
store.subscribe(() => console.log(store.getState()))
store.dispatch(filterChange('IMPORTANT'))
store.dispatch(createNote('combineReducers forms one reducer from many simple reducers'))
```


By simulating the creation of a note and changing the state of the filter in this fashion, the state of the store gets logged to the console after every change that is made to the store:

![](../../images/6/5e.png)


At this point it is good to become aware of a tiny but important detail. If we add a console log statement <i>to the beginning of both reducers</i>:

```js
const filterReducer = (state = 'ALL', action) => {
  console.log('ACTION: ', action)
  // ...
}
```


Based on the console output one might get the impression that every action gets duplicated:

![](../../images/6/6.png)


Is there a bug in our code? No. The combined reducer works in such a way that every <i>action</i> gets handled in <i>every</i> part of the combined reducer. Typically only one reducer is interested in any given action, but there are situations where multiple reducers change their respective parts of the state based on the same action.


### Finishing the filters


Let's finish the application so that it uses the combined reducer. We start by changing the rendering of the application and hooking up the store to the application in the <i>index.js</i> file:

```js
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

Next, let's fix a bug that is caused by the code expecting the application store to be an array of notes:

![](../../images/6/7ea.png)


<!-- Korjaus on helppo. Koska muistiinpanot ovat nyt storen kentässä <i>notes</i>, riittää pieni muutos selektorifunktioon: -->
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

<!-- Aiemminhan selektorifunktio palautti koko storen tilan: -->
Previously the selector function returned the whole state of the store:

```js
const notes = useSelector(state => state)
```

<!-- Nyt siis palautetaan tilasta ainoastaan sen kenttä <i>notes</i> -->
And now it returns only its field <i>notes</i>

```js
const notes = useSelector(state => state.notes)
```


Let's extract the visibility filter into its own <i>src/components/VisibilityFilter.js</i> component:

```js
import React from 'react'
import { filterChange } from '../reducers/filterReducer'
import { useDispatch } from 'react-redux'

const VisibilityFilter = (props) => {
  const dispatch = useDispatch()

  return (
    <div>
      all    
      <input 
        type="radio" 
        name="filter" 
        onChange={() => dispatch(filterChange('ALL'))}
      />
      important   
      <input
        type="radio"
        name="filter"
        onChange={() => dispatch(filterChange('IMPORTANT'))}
      />
      nonimportant 
      <input
        type="radio"
        name="filter"
        onChange={() => dispatch(filterChange('NONIMPORTANT'))}
      />
    </div>
  )
}

export default VisibilityFilter
```

With the new component <i>App</i> can be simplified as follows:

```js
import React from 'react'
import Notes from './components/Notes'
import NewNote from './components/NewNote'
import VisibilityFilter from './components/VisibilityFilter'

const App = () => {
  return (
    <div>
      <NewNote />
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
    if ( state.filter === 'ALL' ) {
      return state.notes
    }
    return state.filter  === 'IMPORTANT' 
      ? state.notes.filter(note => note.important)
      : state.notes.filter(note => !note.important)
  })
  // highlight-end

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
```

<!-- Muutos kohdistuu siis ainoastaan selektorifunktioon, joka oli aiemmnin muotoa -->
We only make changes to the selector function, which used to be

```js
useSelector(state => state.notes)
```

<!-- Yksinkertaistetaan vielä selektoria destrukturoimalla parametrina olevasta tilasta sen kentät erilleen: -->
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

There is a slight cosmetic flaw in our application. Even though the filter is set to <i>ALL</i> by default, the associated radio button is not selected. Naturally this issue can be fixed, but since this is an unpleasant but ultimately harmless bug we will save the fix for later. 

### Redux DevTools

There is an extension [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd) that can be installed on Chrome, in which the state of the Redux-store and the action that changes it can be monitored from the console of the browser.

When debugging, in addition to the browser extension we also have the software library [redux-devtools-extension](https://www.npmjs.com/package/redux-devtools-extension). Let's install it using the command:

```js
npm install --save-dev redux-devtools-extension
```

We'll have to slightly change the definition of the store to get the library up and running:

```js
// ...
import { createStore, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension' // highlight-line

import noteReducer from './reducers/noteReducer'
import filterReducer from './reducers/filterReducer'

const reducer = combineReducers({
  notes: noteReducer,
  filter: filterReducer
})

const store = createStore(
  reducer,
  // highlight-start
  composeWithDevTools()
  // highlight-end
)

export default store
```

Now when you open the console, the <i>redux</i> tab looks like this:

![](../../images/6/11ea.png)

The effect of each action to the store can be easily observed 

![](../../images/6/12ea.png)

It's also possible to dispatch actions to the store using the console

![](../../images/6/13ea.png)

You can find the code for our current application in its entirety in the <i>part6-2</i> branch of [this Github repository](https://github.com/fullstack-hy2020/redux-notes/tree/part6-2).

</div>

<div class="tasks">


### Exercises 6.9.-6.12.


Let's continue working on the anecdote application using redux that we started in exercise 6.3. 


#### 6.9 Better anecdotes, step7

<!-- Ota sovelluksessasi käyttöön Redux DevTools. Siirrä Redux-storen määrittely omaan tiedostoon <i>store.js</i>. -->
Start using Redux DevTools. Move defining the Redux-store into its own file <i>store.js</i>.

#### 6.10 Better anecdotes, step8

The application has a ready-made body for the <i>Notification</i> component:

```js
import React from 'react'

const Notification = () => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  return (
    <div style={style}>
      render here notification...
    </div>
  )
}

export default Notification
```


Extend the component so that it renders the message stored in the redux store, making the component to take the form:

```js
import React from 'react'
import { useSelector } from 'react-redux' // highlight-line

const Notification = () => {
  const notification = useSelector(/* something here */) // highlight-line
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  return (
    <div style={style}>
      {notification} // highlight-line
    </div>
  )
}
```

You will have to make changes to the application's existing reducer. Create a separate reducer for the new functionality and refactor the application so that it uses a combined reducer as shown in this part of the course material.

The application does not have to use the <i>Notification</i> component in any intelligent way at this point in the exercises. It is enough for the application to display the initial value set for the message in the <i>notificationReducer</i>.

#### 6.11 Better anecdotes, step9

Extend the application so that it uses the <i>Notification</i> component to display a message for the duration of five seconds when the user votes for an anecdote or creates a new anecdote:

![](../../images/6/8ea.png)


It's recommended to create separate [action creators](https://redux.js.org/basics/actions#action-creators) for setting and removing notifications.


#### 6.12* Better anecdotes, step10


Implement filtering for the anecdotes that are displayed to the user.

![](../../images/6/9ea.png)


Store the state of the filter in the redux store. It is recommended to create a new reducer and action creators for this purpose.


Create a new <i>Filter</i> component for displaying the filter. You can use the following code as a template for the component:

```js
import React from 'react'

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
