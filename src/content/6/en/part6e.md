---
mainImage: ../../../images/part-6.svg
part: 6
letter: e
lang: en
---

<div class="tasks">

**NOTE**: this is the old ending section of the 6 part that has 30th January 2023 been replaced with material about [React Query, useReducer and context](/en/part6/react_query_use_reducer_and_the_context). This section remains here for a couple of weeks.

If you have started with the exercises (6.19-6.21) that use the Redux connect you may continue with those. If you have not yet started, I recommend to proceed with the new section.
</div>

<div class="content">

###

So far we have used our Redux store with the help of the [hook](https://react-redux.js.org/api/hooks) API from react-redux.
Practically this has meant using the [useSelector](https://react-redux.js.org/api/hooks#useselector) and [useDispatch](https://react-redux.js.org/api/hooks#usedispatch) functions.

To finish this part we will look into another older and more complicated way to use Redux, the [connect](https://github.com/reduxjs/react-redux/blob/master/docs/api/connect.md) function provided by react-redux.

<i>**In new applications, use the hook API**</i>. Knowing how to use connect though is useful when maintaining older projects using Redux.

### Using the connect function to share the Redux store to components

Let's modify the <i>Notes</i> component so that instead of using the hook API (the _useDispatch_ and  _useSelector_ functions ) it uses the _connect_ function. 
We have to modify the following parts of the component:

````js
import { useDispatch, useSelector } from 'react-redux' // highlight-line
import { toggleImportanceOf } from '../reducers/noteReducer'

const Notes = () => {
  // highlight-start
  const dispatch = useDispatch() 
  const notes = useSelector(({filter, notes}) => {
    if ( filter === 'ALL' ) {
      return notes
    }
    return filter === 'IMPORTANT'
      ? notes.filter(note => note.important)
      : notes.filter(note => !note.important)
  })
  // highlight-end

  return(
    <ul>
      {notes.map(note =>
        <Note
          key={note.id}
          note={note}
          handleClick={() => 
            dispatch(toggleImportanceOf(note.id)) // highlight-line
          }
        />
      )}
    </ul>
  )
}

export default Notes
````

The _connect_ function can be used for transforming "regular" React components so that the state of the Redux store can be "mapped" into the component's props.

Let's first use the connect function to transform our <i>Notes</i> component into a <i>connected component</i>:

```js
import { connect } from 'react-redux' // highlight-line
import { toggleImportanceOf } from '../reducers/noteReducer'

const Notes = () => {
  // ...
}

const ConnectedNotes = connect()(Notes) // highlight-line
export default ConnectedNotes           // highlight-line
```

The module exports the <i>connected component</i> that works exactly like the previous regular component for now.

The component needs the list of notes and the value of the filter from the Redux store. The _connect_ function accepts a so-called [mapStateToProps](https://github.com/reduxjs/react-redux/blob/master/docs/api/connect.md#mapstatetoprops-state-ownprops--object) function as its first parameter. The function can be used for defining the props of the <i>connected component</i> that are based on the state of the Redux store.

If we define:


```js
const Notes = (props) => { // highlight-line
  const dispatch = useDispatch()

// highlight-start
  const notesToShow = () => {
    if ( props.filter === 'ALL' ) {
      return props.notes
    }
    
    return props.filter  === 'IMPORTANT'
      ? props.notes.filter(note => note.important)
      : props.notes.filter(note => !note.important)
  }
  // highlight-end

  return(
    <ul>
      {notesToShow().map(note => // highlight-line
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

const mapStateToProps = (state) => {
  return {
    notes: state.notes,
    filter: state.filter,
  }
}

const ConnectedNotes = connect(mapStateToProps)(Notes) // highlight-line

export default ConnectedNotes
```

The <i>Notes</i> component can access the state of the store directly, e.g. through <i>props.notes</i> contains the list of notes.  Similarly, <i>props.filter</i> references the value of the filter.

The situation that results from using <i>connect</i> with the <i>mapStateToProps</i> function we defined can be visualized like this:

![diagram notelist and filter connected to redux store](../../images/6/24c.png)


The <i>Notes</i> component has "direct access" via <i>props.notes</i> and <i>props.filter</i> for inspecting the state of the Redux store.

The _NoteList_ component does not need the information about which filter is selected, so we can move the filtering logic elsewhere.
We just have to give it correctly filtered notes in the _notes_ prop:

```js
const Notes = (props) => {
  const dispatch = useDispatch()

  return(
    <ul>
      {props.notes.map(note =>
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

// highlight-start
const mapStateToProps = (state) => {
  if ( state.filter === 'ALL' ) {
    return {
      notes: state.notes
    }
  }

  return {
    notes: (state.filter  === 'IMPORTANT' 
      ? state.notes.filter(note => note.important)
      : state.notes.filter(note => !note.important)
    )
  }
}
// highlight-end

const ConnectedNotes = connect(mapStateToProps)(Notes)
export default ConnectedNotes  
```

### mapDispatchToProps

Now we have gotten rid of _useSelector_, but <i>Notes</i> still uses the _useDispatch_ hook and the _dispatch_ function returning it:

```js
const Notes = (props) => {
  const dispatch = useDispatch() // highlight-line

  return(
    <ul>
      {props.notes.map(note =>
        <Note
          key={note.id}
          note={note}
          handleClick={() => 
            dispatch(toggleImportanceOf(note.id)) // highlight-line
          }
        />
      )}
    </ul>
  )
}
```

The second parameter of the _connect_ function can be used for defining [mapDispatchToProps](https://github.com/reduxjs/react-redux/blob/master/docs/api/connect.md#mapdispatchtoprops-object--dispatch-ownprops--object) which is a group of <i>action creator</i> functions passed to the connected component as props. Let's make the following changes to our existing connect operation:


```js
const mapStateToProps = (state) => {
  return {
    notes: state.notes,
    filter: state.filter,
  }
}

// highlight-start
const mapDispatchToProps = {
  toggleImportanceOf,
}
// highlight-end

const ConnectedNotes = connect(
  mapStateToProps,
  mapDispatchToProps // highlight-line
)(Notes)

export default ConnectedNotes
```

Now the component can directly dispatch the action defined by the _toggleImportanceOf_ action creator by calling the function through its props:

```js
const Notes = (props) => {
  return(
    <ul>
      {props.notes.map(note =>
        <Note
          key={note.id}
          note={note}
          handleClick={() => props.toggleImportanceOf(note.id)}
        />
      )}
    </ul>
  )
}
```

This means that instead of dispatching the action like this:

```js
dispatch(toggleImportanceOf(note.id))
```

When using _connect_ we can simply do this:

```js
props.toggleImportanceOf(note.id)
```

There is no need to call the _dispatch_ function separately since _connect_ has already modified the _toggleImportanceOf_ action creator into a form that contains the dispatch.

It can take some time to wrap your head around how _mapDispatchToProps_ works, especially once we take a look at an [alternative way of using it](/en/part6/connect#alternative-way-of-using-map-dispatch-to-props).

The resulting situation from using _connect_ can be visualized like this:

![diagram showing toggle connecting to state in redux and dispatch inside of redux](../../images/6/25b.png)

In addition to accessing the store's state via <i>props.notes</i> and <i>props.filter</i>, the component also references a function that can be used for dispatching <i>notes/toggleImportanceOf</i>-type actions via its <i>toggleImportanceOf</i> prop.

The code for the newly refactored <i>Notes</i> component looks like this:

```js
import { connect } from 'react-redux' 
import { toggleImportanceOf } from '../reducers/noteReducer'

const Notes = (props) => {
  return(
    <ul>
      {props.notes.map(note =>
        <Note
          key={note.id}
          note={note}
          handleClick={() => props.toggleImportanceOf(note.id)}
        />
      )}
    </ul>
  )
}

const mapStateToProps = (state) => {
  if ( state.filter === 'ALL' ) {
    return {
      notes: state.notes
    }
  }

  return {
    notes: (state.filter  === 'IMPORTANT' 
    ? state.notes.filter(note => note.important)
    : state.notes.filter(note => !note.important)
    )
  }
}

const mapDispatchToProps = {
  toggleImportanceOf
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notes)
```

Let's also use _connect_ to create new notes:

```js
import { connect } from 'react-redux' 
import { createNote } from '../reducers/noteReducer'

const NewNote = (props) => { // highlight-line
  
  const addNote = (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    props.createNote(content) // highlight-line
  }

  return (
    <form onSubmit={addNote}>
      <input name="note" />
      <button type="submit">add</button>
    </form>
  )
}

// highlight-start
export default connect(
  null, 
  { createNote }
)(NewNote)
// highlight-end
```

Since the component does not need to access the store's state, we can simply pass <i>null</i> as the first parameter to _connect_. 


You can find the code for our current application in its entirety in the <i>part6-5</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/redux-notes/tree/part6-5).

### Referencing action creators passed as props

Let's direct our attention to one interesting detail in the <i>NewNote</i> component:

```js
import { connect } from 'react-redux' 
import { createNote } from '../reducers/noteReducer'  // highlight-line

const NewNote = (props) => {
  
  const addNote = (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    props.createNote(content)  // highlight-line
  }

  return (
    <form onSubmit={addNote}>
      <input name="note" />
      <button type="submit">add</button>
    </form>
  )
}

export default connect(
  null, 
  { createNote }  // highlight-line
)(NewNote)
```

Developers who are new to connect may find it puzzling that there are two versions of the <i>createNote</i> action creator in the component.

The function must be referenced as <i>props.createNote</i> through the component's props, as this is the version that <i>contains the automatic dispatch</i> added by _connect_.

Due to the way that the action creator is imported:

```js
import { createNote } from './../reducers/noteReducer'
```
The action creator can also be referenced directly by calling _createNote_. You should not do this, since this is the unmodified version of the action creator that does not contain the added automatic dispatch.

If we print the functions to the console from the code (we have not yet looked at this useful debugging trick): 

```js
const NewNote = (props) => {
  console.log(createNote)
  console.log(props.createNote)

  const addNote = (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    props.createNote(content)
  }

  // ...
}
```

We can see the difference between the two functions:

![devtools console of two functions](../../images/6/10.png)

The first function is a regular <i>action creator</i> whereas the second function contains the additional dispatch to the store that was added by connect.

Connect is an incredibly useful tool although it may seem difficult at first due to its level of abstraction.

### An alternative way of using mapDispatchToProps

We defined the function for dispatching actions from the connected <i>NewNote</i> component in the following way:

```js
const NewNote = () => {
  // ...
}

export default connect(
  null,
  { createNote }
)(NewNote)
```


The connect expression above enables the component to dispatch actions for creating new notes with the <code>props.createNote('a new note')</code> command.


The functions passed in <i>mapDispatchToProps</i> must be <i>action creators</i>, that is, functions that return Redux actions.


It is worth noting that the <i>mapDispatchToProps</i> parameter is a <i>JavaScript object</i>, as the definition:

```js
{
  createNote
}
```

Is just shorthand for defining the object literal:

```js
{
  createNote: createNote
}
```

Which is an object that has a single <i>createNote</i> property with the <i>createNote</i> function as its value.

Alternatively, we could pass the following <i>function</i> definition as the second parameter to _connect_:

```js
const NewNote = (props) => {
  // ...
}

// highlight-start
const mapDispatchToProps = dispatch => {
  return {
    createNote: value => {
      dispatch(createNote(value))
    },
  }
}
// highlight-end

export default connect(
  null,
  mapDispatchToProps
)(NewNote)
```


In this alternative definition, <i>mapDispatchToProps</i> is a function that _connect_ will invoke by passing to it the _dispatch_ function as its parameter. The return value of the function is an object that defines a group of functions that get passed to the connected component as props. Our example defines the function passed as the <i>createNote</i> prop:

```js
value => {
  dispatch(createNote(value))
}
```

Which simply dispatches the action created with the <i>createNote</i> action creator.

The component then references the function through its props by calling <i>props.createNote</i>:

```js
const NewNote = (props) => {
  const addNote = (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    props.createNote(content)
  }

  return (
    <form onSubmit={addNote}>
      <input name="note" />
      <button type="submit">add</button>
    </form>
  )
}
```

The concept is quite complex and describing it through text is challenging. In most cases, it is sufficient to use the simpler form of <i>mapDispatchToProps</i>. However, there are situations where a more complicated definition is necessary, like if the <i>dispatched actions</i> need to reference [the props of the component](https://github.com/gaearon/redux-devtools/issues/250#issuecomment-186429931).

The creator of Redux Dan Abramov has created a wonderful tutorial called [Getting started with Redux](https://egghead.io/courses/getting-started-with-redux) that you can find on Egghead.io. I highly recommend the tutorial to everyone. The last four videos discuss the _connect_ method, particularly the more "complicated" way of using it.

### Presentational/Container revisited

The refactored <i>Notes</i> component is almost entirely focused on rendering notes and is quite close to being a so-called [presentational component](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0). According to the [description](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) provided by Dan Abramov, presentational components:

- Are concerned with how things look.
- May contain both presentational and container components inside, and usually have some DOM markup and styles of their own.
- Often allow containment via props.children.
- Have no dependencies on the rest of the app, such as Redux actions or stores.
- Don’t specify how the data is loaded or mutated.
- Receive data and callbacks exclusively via props.
- Rarely have their own state (when they do, it’s UI state rather than data).
- Are written as functional components unless they need state, lifecycle hooks, or performance optimizations.

The _connected component_ that is created with the _connect_ function:

```js
const mapStateToProps = (state) => {
  if ( state.filter === 'ALL' ) {
    return {
      notes: state.notes
    }
  }

  return {
    notes: (state.filter  === 'IMPORTANT' 
    ? state.notes.filter(note => note.important)
    : state.notes.filter(note => !note.important)
    )
  }
}

const mapDispatchToProps = {
  toggleImportanceOf,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notes)
```

Fits the description of a <i>container</i> component. According to the [description](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) provided by Dan Abramov, container components:

- Are concerned with how things work.
- May contain both presentational and container components inside but usually don’t have any DOM markup of their own except for some wrapping divs, and never have any styles.
- Provide the data and behavior to presentational or other container components.
- Call Redux actions and provide these as callbacks to the presentational components.
- Are often stateful, as they tend to serve as data sources.
- Are usually generated using higher-order components such as connect from React Redux, rather than written by hand.

Dividing the application into presentational and container components is one way of structuring React applications that has been deemed beneficial. The division may be a good design choice or it may not, it depends on the context.

Abramov attributes the following [benefits](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) to the division:

- Better separation of concerns. You understand your app and your UI better by writing components this way.
- Better reusability. You can use the same presentational component with completely different state sources, and turn those into separate container components that can be further reused.
- Presentational components are essentially your app’s “palette”. You can put them on a single page and let the designer tweak all their variations without touching the app’s logic. You can run screenshot regression tests on that page.

Abramov mentions the term [higher-order component](https://reactjs.org/docs/higher-order-components.html). The <i>Notes</i> component is an example of a regular component, whereas the <i>connect</i> method provided by React-Redux is an example of a <i>high-order component</i>. Essentially, a higher-order component is a function that accepts a "regular" component as its parameter, which then returns a new "regular" component as its return value.

Higher-order components, or HOCs, are a way of defining generic functionality that can be applied to components. This is a concept from functional programming that very slightly resembles inheritance in object-oriented programming.

HOCs are a generalization of the [Higher-Order Function](https://en.wikipedia.org/wiki/Higher-order_function) (HOF) concept. HOFs are functions that either accept functions as parameters or return functions. We have been using HOFs throughout the course, e.g. all of the methods used for dealing with arrays like _map, filter and find_ are HOFs. 

<!-- Reactin hook-apin ilmestymisen jälkeen HOC:ien suosio on kääntynyt laskuun, ja melkein kaikki kirjastot, joiden käyttö on aiemmin perustunut HOC:eihin on saanut hook-perustaisen apin. Useimmiten , kuten myös reduxin kohdalla, hook-perustaiset apit ovat HOC-apeja huomattavasti yksinkertaisempia. -->
After the React hook API was published, HOCs have become less and less popular. Almost all libraries which used to be based on HOCs have now been modified to use hooks. Most of the time hook-based APIs are a lot simpler than HOC-based ones, as is the case with Redux as well. 

### Redux and the component state

We have come a long way in this course and, finally, we have come to the point at which we are using React "the right way", meaning React only focuses on generating the views, and the application state is wholly separated from the React components and passed on to Redux, its actions, and its reducers.

What about the _useState_ hook, which provides components with their own state? Does it have any role if an application is using Redux or some other external state management solution? If the application has more complicated forms, it may be beneficial to implement their local state using the state provided by the _useState_ function. One can, of course, have Redux manage the state of the forms, however, if the state of the form is only relevant when filling the form (e.g. for validation) it may be wise to leave the management of state to the component responsible for the form.

Should we always use Redux? Probably not. Dan Abramov, the developer of Redux, discusses this in his article [You Might Not Need Redux](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367).

Nowadays it is possible to implement Redux-like state management without Redux by using the React [context](https://reactjs.org/docs/context.html) api and the [useReducer](https://reactjs.org/docs/hooks-reference.html#usereducer) hook. 
More about this [here](https://www.simplethread.com/cant-replace-redux-with-hooks/) and [here](https://hswolff.com/blog/how-to-usecontext-with-usereducer/). We will also practice this in 
[part 9](/en/part9).

</div>

<div class="tasks">

### Exercises 6.19.-6.21.

**NOTE**: this is the old ending section of the 6 part that has 30th January 2023 been replaced with material about [React Query, useReducer and context](/en/part6/react_query_use_reducer_and_the_contex). This section remains here for a couple of weeks.

If you have started with the exercises that use the Redux connect you may continue with those. If you have not yet started, I recommend to proceed with the new section.

#### 6.19 anecdotes and connect, step1

The <i>redux store</i> is currently being accessed by the components through the <em>useSelector</em> and <em>useDispatch</em> hooks.

Modify the <i>Notification</i> component so that it uses the _connect_ function instead of the hooks. 
#### 6.20 anecdotes and connect, step2

Do the same for the <i>Filter</i> and <i>AnecdoteForm</i> components.
#### 6.21 anecdotes, the grand finale

You (probably) have one nasty bug in your application. If the user clicks the vote button multiple times in a row, the notification is displayed funnily. For example, if a user votes twice in three seconds, 
the last notification is only displayed for two seconds (assuming the notification is normally shown for 5 seconds). This happens because removing the first notification accidentally removes the second notification. 

Fix the bug so that after multiple votes in a row, the notification for the last vote is displayed for five seconds.

The fix can be done by canceling the previous notification when a new notification is displayed, whenever necessary. 
The [documentation](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) for the setTimeout function might also be useful for this.

This was the last exercise for this part of the course and it's time to push your code to GitHub and mark all of your completed exercises to the [exercise submission system](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

</div>
