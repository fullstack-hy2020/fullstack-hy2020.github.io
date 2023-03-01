---
mainImage: ../../../images/part-6.svg
part: 6
letter: c
lang: zh
---

<div class="content">

<!-- Let's expand the application, such that the notes are stored to the backend. We'll use [json-server](/en/part2/getting_data_from_server), familiar from part 2.-->
 让我们扩展应用，使笔记被存储到后台。我们将使用[json-server](/en/part2/getting_data_from_server)，这在第二章节中已经很熟悉。

<!-- The initial state of the database is stored into the file <i>db.json</i>, which is placed in the root of the project:-->
 数据库的初始状态被存储在文件<i>db.json</i>中，它被放置在项目的根部。

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

<!-- We'll install json-server for the project...-->
 我们将为项目安装json-server...

```js
npm install json-server --save-dev
```

<!-- and add the following line to the <i>scripts</i> part of the file <i>package.json</i>-->
 然后在文件<i>package.json</i>的<i>scripts</i>部分添加以下一行

```js
"scripts": {
  "server": "json-server -p3001 --watch db.json",
  // ...
}
```

<!-- Now let's launch json-server with the command _npm run server_.-->
 现在让我们用命令_npm run server_来启动json-server。

<!-- Next we'll create a method into the file <i>services/notes.js</i>, which uses <i>axios</i> to fetch data from the backend-->
 接下来我们将在文件<i>services/notes.js</i>中创建一个方法，使用<i>axios</i>从后端获取数据。

```js
import axios from 'axios'

const baseUrl = 'http://localhost:3001/notes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

export default { getAll }
```

<!-- We'll add axios to the project-->
 我们将axios添加到项目中

```bash
npm install axios
```

<!-- We'll change the initialization of the state in <i>noteReducer</i>, such that by default there are no notes:-->
 我们将改变<i>noteReducer</i>中状态的初始化，这样默认情况下就没有笔记了。

```js
const noteSlice = createSlice({
  name: 'notes',
  initialState: [], // highlight-line
  // ...
})
```

<!-- Let's also add a new action <em>appendNote</em> for adding a note object:-->
 我们还要添加一个新的动作<em>appendNote</em>来添加一个笔记对象。

```js
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
    },
    // highlight-start
    appendNote(state, action) {
      state.push(action.payload)
    }
    // highlight-end
  },
})

export const { createNote, toggleImportanceOf, appendNote } = noteSlice.actions // highlight-line

export default noteSlice.reducer
```

<!-- A quick way to initialize the notes state based on the data received from the server is to fetch the notes in the <i>index.js</i> file and dispatch an action using the <em>appendNote</em> action creator for each individual note object:-->
 基于从服务器收到的数据初始化笔记状态的快速方法是在<i>index.js</i>文件中获取笔记，并使用<em>appendNote</em>动作创建器为每个单独的笔记对象分派一个动作。

```js
// ...
import noteService from './services/notes' // highlight-line
import noteReducer, { appendNote } from './reducers/noteReducer' // highlight-line

const store = configureStore({
  reducer: {
    notes: noteReducer,
    filter: filterReducer,
  }
})

// highlight-start
noteService.getAll().then(notes =>
  notes.forEach(note => {
    store.dispatch(appendNote(note))
  })
)
// highlight-end

// ...
```

<!-- Dispatching multiple actions seems a bit 	impractical. Let's add an action creator <em>setNotes</em> which can be used to directly replace the notes array. We'll get the action creator from the <em>createSlice</em> function by implementing the <em>setNotes</em> action:-->
 派遣多个动作似乎有点不切实际。让我们添加一个动作创建器<em>setNotes</em>，可以用来直接替换笔记数组。我们将通过实现<em>setNotes</em>动作，从<em>createSlice</em>函数中获得动作创建器。

```js
// ...

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
    },
    appendNote(state, action) {
      state.push(action.payload)
    },
    // highlight-start
    setNotes(state, action) {
      return action.payload
    }
    // highlight-end
  },
})

export const { createNote, toggleImportanceOf, appendNote, setNotes } = noteSlice.actions // highlight-line

export default noteSlice.reducer
```

<!-- Now, the code in the <i>index.js</i> file looks a lot better:-->
 现在，<i>index.js</i>文件中的代码看起来好多了。

```js
// ...
import noteService from './services/notes'
import noteReducer, { setNotes } from './reducers/noteReducer' // highlight-line

const store = configureStore({
  reducer: {
    notes: noteReducer,
    filter: filterReducer,
  }
})

noteService.getAll().then(notes =>
  store.dispatch(setNotes(notes)) // highlight-line
)
```

<!-- > **NB:** why didn't we use await in place of promises and event handlers (registered to _then_-methods)?-->
 > **NB:**我们为什么不用await来代替承诺和事件处理程序（注册到_then_-methods）？
<!-- >-->
 >
<!-- > Await only works inside <i>async</i> functions, and the code in <i>index.js</i> is not inside a function, so due to the simple nature of the operation, we'll abstain from using <i>async</i> this time.-->
 > 等待只在<i>async</i>函数中起作用，而<i>index.js</i>中的代码不在函数中，所以由于操作的简单性，我们这次就不使用<i>async</i>了。

<!-- We do, however, decide to move the initialization of the notes into the <i>App</i> component, and, as usual when fetching data from a server, we'll use the <i>effect hook</i>.-->
 然而，我们决定将笔记的初始化移到<i>App</i>组件中，并且，像往常一样，当从服务器获取数据时，我们将使用<i>effect hook</i>。

```js
import { useEffect } from 'react' // highlight-line
import NewNote from './components/NewNote'
import Notes from './components/Notes'
import VisibilityFilter from './components/VisibilityFilter'
import noteService from './services/notes'  // highlight-line
import { setNotes } from './reducers/noteReducer' // highlight-line
import { useDispatch } from 'react-redux' // highlight-line

const App = () => {
    // highlight-start
  const dispatch = useDispatch()
  useEffect(() => {
    noteService
      .getAll().then(notes => dispatch(setNotes(notes)))
  }, [])
  // highlight-end

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

<!-- Hookin useEffect käyttö aiheuttaa eslint-varoituksen: -->
<!-- Using the useEffect hook causes an eslint warning:-->
 使用useEffect钩子会导致一个eslint警告。

![](../../images/6/26ea.png)

<!-- Pääsemme varoituksesta eroon seuraavasti: -->
<!-- We can get rid of it by doing the following:-->
 我们可以通过下面的操作摆脱它。

```js
const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    noteService
      .getAll().then(notes => dispatch(setNotes(notes)))
  }, [dispatch]) // highlight-line

  // ...
}
```

<!-- Nyt komponentin _App_ sisällä määritelty muuttuja <i>dispatch</i> eli käytännössä redux-storen dispatch-funktio on lisätty useEffectille parametrina annettuun taulukkoon. **Jos** dispatch-muuttujan sisältö muuttuisi ohjelman suoritusaikana, suoritettaisiin efekti uudelleen, näin ei kuitenkaan ole, eli varoitus on tässä tilanteessa oikeastaan aiheeton. -->
<!-- Now the variable <i>dispatch</i> we define in the _App_ component, which practically is the dispatch function of the redux-store, has been added to the array useEffect receives as a parameter.-->
 现在我们在_App_组件中定义的变量<i>dispatch</i>，实际上是redux-store的调度函数，已经被添加到useEffect的数组中作为参数接收。
<!-- **If** the value of the dispatch-variable would change during runtime,-->
 **如果**调度变量的值在运行时发生变化。
<!-- the effect would be executed again. This however cannot happen in our application, so the warning is unnecessary.-->
该效果将被再次执行。然而这不会发生在我们的应用中，所以这个警告是不必要的。

<!-- Toinen tapa päästä eroon varoituksesta olisi disabloida se kyseisen rivin kohdalta: -->
<!-- Another way to get rid of the warning would be to disable eslint on that line:-->
 摆脱警告的另一个方法是在这一行禁用eslint。

```js
const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    noteService
      .getAll().then(notes => dispatch(setNotes(notes)))
      // highlight-start
  },[]) // eslint-disable-line react-hooks/exhaustive-deps
  // highlight-end

  // ...
}
```

<!-- Generally disabling eslint when it throws a warning is not a good idea. Even though the eslint rule in question has caused some [arguments](https://github.com/facebook/create-react-app/issues/6880), we will use the first solution.-->
 一般来说，当eslint抛出一个警告时禁用它并不是一个好主意。尽管有关的eslint规则引起了一些[争论](https://github.com/facebook/create-react-app/issues/6880)，我们将使用第一个解决方案。

<!-- More about the need to define the hooks dependencies in [the react documentation](https://reactjs.org/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies).-->
 更多关于需要定义钩子的依赖关系，请看 [React文档](https://reactjs.org/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies)。

<!-- We can do the same thing when it comes to creating a new note. Let's expand the code communicating with the server as follows:-->
当涉及到创建一个新的笔记时，我们可以做同样的事情。让我们扩展一下与服务器通信的代码，如下。

```js
const baseUrl = 'http://localhost:3001/notes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

// highlight-start
const createNew = async (content) => {
  const object = { content, important: false }
  const response = await axios.post(baseUrl, object)
  return response.data
}
// highlight-end

export default {
  getAll,
  createNew,
}
```

<!-- The method _addNote_ of the component <i>NewNote</i> changes slightly:-->
 组件<i>NewNote</i>的_addNote_方法略有变化。

```js
import { useDispatch } from 'react-redux'
import { createNote } from '../reducers/noteReducer'
import noteService from '../services/notes' // highlight-line

const NewNote = (props) => {
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

export default NewNote
```

<!-- Because the backend generates ids for the notes, we'll change the action creator <em>createNote</em> accordingly:-->
因为后台为笔记生成了ID，我们将相应地改变动作创建者<em>createNote</em>。

```js
createNote(state, action) {
  state.push(action.payload)
}
```

<!-- Changing the importance of notes could be implemented using the same principle, by making an asynchronous method call to the server and then dispatching an appropriate action.-->
 改变笔记的重要性可以用同样的原则来实现，通过对服务器进行异步方法调用，然后分派一个适当的动作。

<!-- The current state of the code for the application can be found on [GitHub](https://github.com/fullstack-hy2020/redux-notes/tree/part6-3) in the branch <i>part6-3</i>.-->
 该应用的代码的当前状态可以在[GitHub](https://github.com/fullstack-hy2020/redux-notes/tree/part6-3)的分支<i>part6-3</i>中找到。

</div>

<div class="tasks">

### Exercises 6.13.-6.14.

#### 6.13 Anecdotes and the backend, step1

<!-- When the application launches, fetch the anecdotes from the backend implemented using json-server.-->
当应用启动时，从使用json-server实现的后端获取名言警句。

<!-- As the initial backend data, you can use, e.g. [this](https://github.com/fullstack-hy2020/misc/blob/master/anecdotes.json).-->
 作为初始的后端数据，你可以使用，例如[this](https://github.com/fullstack-hy2020/misc/blob/master/anecdotes.json)。

#### 6.14 Anecdotes and the backend, step2

<!-- Modify the creation of new anecdotes, such that the anecdotes are stored in the backend.-->
 修改创建新的名言警句，使名言警句存储在后端。

</div>

<div class="content">

### Asynchronous actions and redux thunk

<!-- Our approach is quite good, but it is not great that the communication with the server happens inside the functions of the components. It would be better if the communication could be abstracted away from the components, such that they don't have to do anything else but call the appropriate <i>action creator</i>. As an example, <i>App</i> would initialize the state of the application as follows:-->
 我们的方法很好，但与服务器的通信发生在组件的功能中，这不是很好。如果能将通信从组件中抽象出来就更好了，这样它们就不必做任何其他事情，只需调用相应的<i>动作创建器</i>。举个例子，<i>App</i>将初始化应用的状态，如下所示。

```js
const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeNotes())
  },[dispatch])

  // ...
}
```

<!-- and <i>NewNote</i> would create a new note as follows:-->
 而<i>NewNote</i>将创建一个新的笔记，如下所示。

```js
const NewNote = () => {
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

<!-- In this implementation, both components would dispatch an action without the need to know about the communication between the server that happens behind the scenes. These kind of <i>async actions</i> can be implemented using the [Redux Thunk](https://github.com/reduxjs/redux-thunk) library. The use of the library doesn't need any additional configuration when the Redux store is created using the Redux Toolkit's <em>configureStore</em> function.-->
 在这个实现中，两个组件都会派发一个动作，而不需要知道幕后发生的服务器之间的通信。这类<i>async动作</i>可以使用[Redux Thunk](https://github.com/reduxjs/redux-thunk)库来实现。当使用Redux工具包的<em>configureStore</em>函数创建Redux商店时，使用该库不需要任何额外配置。

<!-- Let us now install the library-->
 现在让我们安装该库

```
npm install redux-thunk
```

<!-- With Redux Thunk it is possible to implement <i>action creators</i> which return a function instead of an object. The function receives Redux store's <em>dispatch</em> and <em>getState</em> methods as parameters. This allows for example implementations of asynchronous action creators, which first wait for the completion of a certain asynchronous operation and after that dispatch some action, which changes the store's state.-->
 通过Redux Thunk可以实现<i>action creators</i>，它返回一个函数而不是一个对象。该函数接收Redux存储的<em>dispatch</em>和<em>getState</em>方法作为参数。这允许异步动作创建者的实现，它首先等待某个异步操作的完成，然后分派一些动作，改变商店的状态。

<!-- We can define an action creator <em>initializeNotes</em> which initializes the notes based on the data received from the server:-->
 我们可以定义一个动作创建器<em>initializeNotes</em>，根据从服务器收到的数据初始化笔记。

```js
// ...
import noteService from '../services/notes' // highlight-line

const noteSlice = createSlice(/* ... */)

export const { createNote, toggleImportanceOf, setNotes, appendNote } = noteSlice.actions

// highlight-start
export const initializeNotes = () => {
  return async dispatch => {
    const notes = await noteService.getAll()
    dispatch(setNotes(notes))
  }
}
// highlight-end

export default noteSlice.reducer
```

<!-- In the inner function, meaning the <i>asynchronous action</i>, the operation first fetches all the notes from the server and then <i>dispatches</i> the <em>setNotes</em> action, which adds them to the store.-->
 在内部函数中，指的是<i>异步操作</i>，该操作首先从服务器获取所有笔记，然后<i>分派</i><em>setNotes</em>操作，将它们添加到存储中。

<!-- The component <i>App</i> can now be defined as follows:-->
 组件<i>App</i>现在可以被定义如下。

```js
const App = () => {
  const dispatch = useDispatch()

  // highlight-start
  useEffect(() => {
    dispatch(initializeNotes())
  },[dispatch])
  // highlight-end

  return (
    <div>
      <NewNote />
      <VisibilityFilter />
      <Notes />
    </div>
  )
}
```

<!-- The solution is elegant. The initialization logic for the notes has been completely separated from the React component.-->
 这个解决方案很优雅。笔记的初始化逻辑已经完全从React组件中分离出来。

<!-- Next, let's replace the <em>createNote</em> action creator created by the <em>createSlice</em> function with an asynchronous action creator:-->
 接下来，让我们用一个异步的动作创建器来取代由<em>createSlice</em>函数创建的<em>createNote</em>动作创建器。

```js
// ...
import noteService from '../services/notes'

const noteSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    // highlight-start
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
    },
    appendNote(state, action) {
      state.push(action.payload)
    },
    setNotes(state, action) {
      return action.payload
    }
    // highlight-end
  },
})

export const { toggleImportanceOf, appendNote, setNotes } = noteSlice.actions // highlight-line

export const initializeNotes = () => {
  return async dispatch => {
    const notes = await noteService.getAll()
    dispatch(setNotes(notes))
  }
}

// highlight-start
export const createNote = content => {
  return async dispatch => {
    const newNote = await noteService.createNew(content)
    dispatch(appendNote(newNote))
  }
}
// highlight-end

export default noteSlice.reducer
```

<!-- The principle here is the same: first, an asynchronous operation is executed, after which the action changing the state of the store is <i>dispatched</i>. Redux Toolkit offers a multitude of tools to simplify asynchronous state management. Suitable tools for this use case are for example the [createAsyncThunk](https://redux-toolkit.js.org/api/createAsyncThunk) function and the [RTK Query](https://redux-toolkit.js.org/rtk-query/overview) API.-->
 这里的原理是一样的：首先，执行一个异步操作，之后，改变存储状态的动作被<i>dispatched</i>。Redux工具包提供了大量的工具来简化异步状态管理。适合这个用例的工具有：[createAsyncThunk](https://redux-toolkit.js.org/api/createAsyncThunk)函数和[RTK Query](https://redux-toolkit.js.org/rtk-query/overview) API。

<!-- The component <i>NewNote</i> changes as follows:-->
 组件<i>NewNote</i>的变化如下。

```js
const NewNote = () => {
  const dispatch = useDispatch()

  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    dispatch(createNote(content)) //highlight-line
  }

  return (
    <form onSubmit={addNote}>
      <input name="note" />
      <button type="submit">lisää</button>
    </form>
  )
}
```

<!-- Finally, let's clean up the <i>index.js</i> file a bit by moving the code related to the creation of the Redux store into its own, <i>store.js</i> file:-->
 最后，让我们清理一下<i>index.js</i>文件，把与创建Redux商店有关的代码移到自己的<i>store.js</i>文件中。

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

<!-- After the changes, the content of the <i>index.js</i> is the following:-->
 更改后，<i>index.js</i>的内容如下。

```js
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './store' // highlight-line
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

<!-- The current state of the code for the application can be found on [GitHub](https://github.com/fullstack-hy2020/redux-notes/tree/part6-4) in the branch <i>part6-4</i>.-->
 应用的代码的当前状态可以在[GitHub](https://github.com/fullstack-hy2020/redux-notes/tree/part6-4)的分支<i>part6-4</i>中找到。

</div>

<div class="tasks">


### Exercises 6.15.-6.18.

#### 6.15 Anecdotes and the backend, step3

<!-- Modify the initialization of Redux store to happen using asynchronous action creators, which are made possible by the Redux Thunk library.-->
 修改Redux存储的初始化，使其使用异步动作创建器来发生，这是由Redux Thunk库实现的。

#### 6.16 Anecdotes and the backend, step4

<!-- Also modify the creation of a new anecdote to happen using asynchronous action creators, made possible by the Redux Thunk library.-->
 还修改了创建一个新的名言警句，使其使用异步动作创建器发生，Redux Thunk库使之成为可能。


#### 6.17 Anecdotes and the backend, step5

<!-- Voting does not yet save changes to the backend. Fix the situation with the help of the Redux Thunk library.-->
 投票还不能将变化保存到后端。在Redux Thunk库的帮助下修复了这种情况。

#### 6.18 Anecdotes and the backend, step6

<!-- The creation of notifications is still a bit tedious, since one has to do two actions and use the _setTimeout_ function:-->
 创建通知仍然有点繁琐，因为必须做两个动作并使用_setTimeout_函数。

```js
dispatch(setNotification(`new anecdote '${content}'`))
setTimeout(() => {
  dispatch(clearNotification())
}, 5000)
```

<!-- Make an action creator, which enables one to provide the notification as follows:-->
 做一个动作的创建者，这使得人们能够提供通知，如下。

```js
dispatch(setNotification(`you voted '${anecdote.content}'`, 10))
```

<!-- The first parameter is the text to be rendered and the second parameter is the time to display the notification given in seconds.-->
 第一个参数是要渲染的文本，第二个参数是显示通知的时间，单位是秒。

<!-- Implement the use of this improved notification in your application.-->
在你的应用中实现使用这个改进的通知。

</div>
