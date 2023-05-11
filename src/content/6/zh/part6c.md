---
mainImage: ../../../images/part-6.svg
part: 6
letter: c
lang: zh
---

<div class="content">

<!-- Let's expand the application so that the notes are stored in the backend. We'll use [json-server](/en/part2/getting_data_from_server), familiar from part 2.-->
让我们扩展应用，使笔记存储在后端。 我们将使用[json-server](/en/part2/getting_data_from_server)，从第2章节熟悉。

<!-- The initial state of the database is stored in the file <i>db.json</i>, which is placed in the root of the project:-->
数据库的初始状态存储在文件<i>db.json</i>中，该文件放置在项目根目录中：

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

<!-- We''ll install json-server for the project...-->
我们将为项目安装json-server...

```js
npm install json-server --save-dev
```

<!-- and add the following line to the <i>scripts</i> part of the file <i>package.json</i>-->
"scripts": {
    "start": "node index.js"
}

"scripts": {
    "start": "node index.js"
}

```js
"scripts": {
  "server": "json-server -p3001 --watch db.json",
  // ...
}
```

<!-- Now let's launch json-server with the command _npm run server_.-->
现在让我们用命令_npm run server_启动json-server。

### Getting data from the backend

<!-- Next, we''ll create a method into the file <i>services/notes.js</i>, which uses <i>axios</i> to fetch data from the backend-->
.

接下来，我们将在文件<i>services/notes.js</i>中创建一个方法，该方法使用<i>axios</i>从后端获取数据。

```js
import axios from 'axios'

const baseUrl = 'http://localhost:3001/notes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

export default { getAll }
```

<!-- We''ll add axios to the project-->
我们将把axios加入到这个项目中。

```bash
npm install axios
```

<!-- We''ll change the initialization of the state in <i>noteReducer</i>, so that by default there are no notes:-->
我们将会改变<i>noteReducer</i>的状态初始化，这样预设就没有笔记了：

```js
const noteSlice = createSlice({
  name: 'notes',
  initialState: [], // highlight-line
  // ...
})
```

<!-- Let's also add a new action <em>appendNote</em> for adding a note object:-->
让我们也为添加一个新的动作<em>appendNote</em>来添加一个笔记对象：

```js
const noteSlice = createSlice({
  name: 'notes',
  initialState: [],
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
在 <i>index.js</i> 文件中获取笔记，并使用 <em>appendNote</em> 动作创建者为每个单独的笔记对象分发动作，是根据从服务器接收到的数据快速初始化笔记状态的一种方法：

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

<!-- Dispatching multiple actions seems a bit impractical. Let's add an action creator <em>setNotes</em> which can be used to directly replace the notes array. We'll get the action creator from the <em>createSlice</em> function by implementing the <em>setNotes</em> action:-->
分发多个动作似乎有点不切实际。让我们添加一个动作创建者<em>setNotes</em>，可以用来直接替换notes数组。我们将通过实现<em>setNotes</em>动作从<em>createSlice</em>函数获取动作创建者：

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
现在，<i>index.js</i>文件中的代码看起来要好得多：

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

<!-- > **NB:** Why didn''t we use await in place of promises and event handlers (registered to _then_-methods)?-->
> **注意：**我们为什么不用`await`代替`promise`和注册到`then`方法的事件处理程序？
<!-- >-->
You are my sunshine

>你是我的阳光
<!-- > Await only works inside <i>async</i> functions, and the code in <i>index.js</i> is not inside a function, so due to the simple nature of the operation, we''ll abstain from using <i>async</i> this time.-->
> <i>Await</i> 只能在<i>async</i>函数内使用，而<i>index.js</i>中的代码不在函数内，因此由于操作的简单性，我们这次不使用<i>async</i>。

<!-- We do, however, decide to move the initialization of the notes into the <i>App</i> component, and, as usual, when fetching data from a server, we''ll use the <i>effect hook</i>.-->
我们确实决定将笔记的初始化移入<i>App</i>组件，并且，像往常一样，当从服务器获取数据时，我们将使用<i>effect hook</i>。

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

<!-- Using the useEffect hook causes an eslint warning:-->
使用`useEffect`钩子会导致一个eslint警告：

![vscode warning useEffect missing dispatch dependency](../../images/6/26ea.png)

<!-- We can get rid of it by doing the following:-->
我们可以通过以下方式摆脱它：

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

<!-- Now the variable <i>dispatch</i> we define in the _App_ component, which practically is the dispatch function of the redux store, has been added to the array useEffect receives as a parameter.-->
现在我们在_App_组件中定义的变量<i>dispatch</i>，实际上就是redux store的dispatch函数，已经添加到了useEffect接收作为参数的数组中。
<!-- **If** the value of the dispatch variable would change during runtime,-->
如果在运行期间调度变量的值发生变化，
<!-- the effect would be executed again. This however cannot happen in our application, so the warning is unnecessary.-->
这种情况不会发生在我们的应用程序中，因此警告是不必要的。

<!-- Another way to get rid of the warning would be to disable ESlint on that line:-->
另一种消除警告的方法是在该行上禁用ESlint：

```js
const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    noteService
      .getAll().then(notes => dispatch(setNotes(notes)))
      // highlight-start
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  // highlight-end

  // ...
}
```

<!-- Generally disabling ESlint when it throws a warning is not a good idea. Even though the ESlint rule in question has caused some [arguments](https://github.com/facebook/create-react-app/issues/6880), we will use the first solution.-->
一般来说，当ESlint抛出警告时禁用它是不是个好主意。尽管ESlint规则引发了一些[争议](https://github.com/facebook/create-react-app/issues/6880)，我们将使用第一种解决方案。

<!-- More about the need to define the hooks dependencies in [the react documentation](https://reactjs.org/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies).-->
[在 React 文档中](https://reactjs.org/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies)有关定义 Hooks 依赖性的更多信息。

### Sending data to the backend

<!-- We can do the same thing when it comes to creating a new note. Let's expand the code communicating with the server as follows:-->
当涉及到创建新笔记时，我们也可以做同样的事情。让我们把与服务器通信的代码扩展如下：

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
  createNew, // highlight-line
}
```

<!-- The method _addNote_ of the component <i>NewNote</i> changes slightly:-->
组件<i>NewNote</i>的_addNote_方法有些许变化：

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

<!-- Because the backend generates ids for the notes, we''ll change the action creator <em>createNote</em> in the file <i>noteReducer.js</i> accordingly:-->
因为后端为笔记生成id，我们将根据<em>createNote</em>在<i>noteReducer.js</i>文件中进行相应的更改：

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

<!-- Changing the importance of notes could be implemented using the same principle, by making an asynchronous method call to the server and then dispatching an appropriate action.-->
通过使用相同的原理，可以通过异步方法调用服务器并调度适当的操作来实现更改笔记的重要性。

<!-- The current state of the code for the application can be found on [GitHub](https://github.com/fullstack-hy2020/redux-notes/tree/part6-3) in the branch <i>part6-3</i>.-->
当前应用程序的代码状态可以在[GitHub](https://github.com/fullstack-hy2020/redux-notes/tree/part6-3)的<i>part6-3</i>分支中找到。

</div>

<div class="tasks">

### Exercises 6.14.-6.15.

#### 6.14 Anecdotes and the backend, step1

<!-- When the application launches, fetch the anecdotes from the backend implemented using json-server.-->
当应用程序启动时，使用json-server实现的后端获取轶事。

<!-- As the initial backend data, you can use, e.g. [this](https://github.com/fullstack-hy2020/misc/blob/master/anecdotes.json).-->
作为最初的后端数据，您可以使用例如[这个](https://github.com/fullstack-hy2020/misc/blob/master/anecdotes.json)。

#### 6.15 Anecdotes and the backend, step2

<!-- Modify the creation of new anecdotes, so that the anecdotes are stored in the backend.-->
修改新的轶事的创建，以便将轶事存储在后端。

</div>

<div class="content">

### Asynchronous actions and Redux thunk

<!-- Our approach is quite good, but it is not great that the communication with the server happens inside the functions of the components. It would be better if the communication could be abstracted away from the components so that they don''t have to do anything else but call the appropriate <i>action creator</i>. As an example, <i>App</i> would initialize the state of the application as follows:-->
我们的方法很不错，但是服务器与组件的通信发生在组件的函数内部并不太好。如果能将通信抽象出来，组件只需要调用适当的<i>action creator</i>，那就更好了。例如，<i>App</i> 将应用程序的状态初始化如下：

```js
const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeNotes())
  }, [dispatch])

  // ...
}
```

<!-- and <i>NewNote</i> would create a new note as follows:-->
<i>新笔记</i>会创建如下新笔记：

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

<!-- In this implementation, both components would dispatch an action without the need to know about the communication between the server that happens behind the scenes. These kinds of <i>async actions</i> can be implemented using the [Redux Thunk](https://github.com/reduxjs/redux-thunk) library. The use of the library doesn't need any additional configuration or even installation when the Redux store is created using the Redux Toolkit's <em>configureStore</em> function.-->
在这个实现中，两个组件都可以在不需要了解服务器之间的通信的情况下调度动作。可以使用 [Redux Thunk](https://github.com/reduxjs/redux-thunk) 库来实现这种<i>异步动作</i>。当使用 Redux Toolkit 的 <em>configureStore</em> 函数创建 Redux store 时，使用该库不需要任何额外的配置或安装。

<!-- With Redux Thunk it is possible to implement <i>action creators</i> which return a function instead of an object. The function receives Redux store's <em>dispatch</em> and <em>getState</em> methods as parameters. This allows for example implementations of asynchronous action creators, which first wait for the completion of a certain asynchronous operation and after that dispatch some action, which changes the store's state.-->
用 Redux Thunk，可以实现返回函数而不是对象的<i>action creators</i>。该函数接收 Redux store 的<em>dispatch</em> 和 <em>getState</em> 方法作为参数。这样可以实现异步 action creators，先等待某个异步操作完成，然后 dispatch 一些改变 store 状态的 action。

<!-- We can define an action creator <em>initializeNotes</em> which initializes the notes based on the data received from the server:-->
我们可以定义一个动作创造者<em>initializeNotes</em>，它根据从服务器接收到的数据初始化笔记：

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
在内部函数，也就是<i>异步动作</i>中，操作首先从服务器获取所有笔记，然后<i>分发</i> <em>setNotes</em> 动作，将它们添加到存储中。

<!-- The component <i>App</i> can now be defined as follows:-->
<i>App</i> 现在可以定义如下：

```js
// ...
import { initializeNotes } from './reducers/noteReducer' // highlight-line

const App = () => {
  const dispatch = useDispatch()

  // highlight-start
  useEffect(() => {
    dispatch(initializeNotes())
  }, [dispatch])
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
解决方案很优雅。笔记的初始化逻辑已经完全从 React 组件中分离出来。

<!-- Next, let's replace the <em>createNote</em> action creator created by the <em>createSlice</em> function with an asynchronous action creator:-->
接下来，让我们用一个异步的action creator替换<em>createSlice</em>函数创建的<em>createNote</em> action creator：

```js
// ...
import noteService from '../services/notes'

const noteSlice = createSlice({
  name: 'notes',
  initialState: [],
  reducers: {
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
    // createNote definition removed from here!
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

<!-- The principle here is the same: first, an asynchronous operation is executed, after which the action changing the state of the store is <i>dispatched</i>.-->
这里的原则是相同的：首先，执行一个异步操作，然后<i>调度</i>改变存储状态的操作。

<!-- The component <i>NewNote</i> changes as follows:-->
<i>NewNote</i> 的组件发生了如下变化：

```js
// ...
import { createNote } from '../reducers/noteReducer' // highlight-line

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
      <button type="submit">add</button>
    </form>
  )
}
```

<!-- Finally, let's clean up the <i>index.js</i> file a bit by moving the code related to the creation of the Redux store into its own, <i>store.js</i> file:-->
最后，让我们把与创建Redux存储相关的代码清理一下<i>index.js</i>文件，把它们移动到自己的<i>store.js</i>文件中：

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
在更改之后，<i>index.js</i> 的内容如下：

```js
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './store' // highlight-line
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
```

<!-- The current state of the code for the application can be found on [GitHub](https://github.com/fullstack-hy2020/redux-notes/tree/part6-5) in the branch <i>part6-5</i>.-->
当前应用程序代码的状态可以在[GitHub](https://github.com/fullstack-hy2020/redux-notes/tree/part6-5)的<i>part6-5</i>分支上找到。

<!-- Redux Toolkit offers a multitude of tools to simplify asynchronous state management. Suitable tools for this use case are for example the [createAsyncThunk](https://redux-toolkit.js.org/api/createAsyncThunk) function and the [RTK Query](https://redux-toolkit.js.org/rtk-query/overview) API.-->
Redux Toolkit 提供了多种工具来简化异步状态管理。适用于此用例的工具例如[createAsyncThunk](https://redux-toolkit.js.org/api/createAsyncThunk)函数和[RTK Query](https://redux-toolkit.js.org/rtk-query/overview) API。

</div>

<div class="tasks">

### Exercises 6.16.-6.19.

#### 6.16 Anecdotes and the backend, step3

<!-- Modify the initialization of the Redux store to happen using asynchronous action creators, which are made possible by the Redux Thunk library.-->
修改Redux存储库的初始化，使用由Redux Thunk库提供的异步操作创建者来完成。

#### 6.17 Anecdotes and the backend, step4

<!-- Also modify the creation of a new anecdote to happen using asynchronous action creators, made possible by the Redux Thunk library.-->
也修改使用Redux Thunk库提供的异步action creators创建新的轶事。

#### 6.18 Anecdotes and the backend, step5

<!-- Voting does not yet save changes to the backend. Fix the situation with the help of the Redux Thunk library.-->
投票尚未将更改储存到后端。使用 Redux Thunk 库来修复这个情况。

#### 6.19 Anecdotes and the backend, step6

<!-- The creation of notifications is still a bit tedious since one has to do two actions and use the _setTimeout_ function:-->
创建通知仍然有点繁琐，因为要执行两个操作并使用_setTimeout_函数：

```js
dispatch(setNotification(`new anecdote '${content}'`))
setTimeout(() => {
  dispatch(clearNotification())
}, 5000)
```

<!-- Make an action creator, which enables one to provide the notification as follows:-->
创建一个动作创建者，使其能够提供如下通知：

```js
dispatch(setNotification(`you voted '${anecdote.content}'`, 10))
```

<!-- The first parameter is the text to be rendered and the second parameter is the time to display the notification given in seconds.-->
第一个参数是要呈现的文本，第二个参数是以秒为单位指定的显示通知的时间。

<!-- Implement the use of this improved notification in your application.-->
实施这种改进的通知在你的应用程序中的使用。

</div>
