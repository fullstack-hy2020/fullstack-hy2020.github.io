---
mainImage: ../../../images/part-6.svg
part: 6
letter: c
lang: en
---

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
