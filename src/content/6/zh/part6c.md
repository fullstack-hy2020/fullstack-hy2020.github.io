---
mainImage: ../../../images/part-6.svg
part: 6
letter: c
lang: zh
---

<div class="content">


<!-- Let's expand the application, such that the notes are stored to the backend. We'll use [json-server](/zh/part2/从服务器获取数据), familiar from part 2. -->
让我们扩展应用，将便笺存储到后端，我们将使用 [json-server](/zh/part2/从服务器获取数据)，我们在第二章已经很熟悉了。

<!-- The initial state of the database is stored into the file <i>db.json</i>, which is placed in the root of the project: -->
数据库的初始状态存储在文件<i>db.json</i> 中，该文件位于项目的根目录中:

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



<!-- We'll install json-server for the project... -->
我们将为这个项目安装 json-server...

```bash
npm install json-server --save-dev
```



<!-- and add the following line to the <i>scripts</i> part of the file <i>package.json</i> -->
并将如下行添加到我 package.json <i>文件的  scripts</i> 部分

```js
"scripts": {
  "server": "json-server -p3001 --watch db.json",
  // ...
}
```

<!-- Now let's launch json-server with the command _npm run server_. -->
现在，让我们使用命令 npm run server 启动 json-server。

<!-- Next we'll create a method into the file <i>services/notes.js</i>, which uses <i>axios</i> to fetch data from the backend -->
接下来，我们将在文件 <i>services/notes.js</i> 中创建一个方法，该方法使用<i>axios</i> 从后端获取数据

```js
import axios from 'axios'

const baseUrl = 'http://localhost:3001/notes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

export default { getAll }
```

<!-- We'll add axios to the project -->
我们将在项目中添加 axios

```bash
npm install axios
```

<!-- We'll change the initialization of the state in <i>noteReducer</i>, such that by default there are no notes: -->
我们将在<i>noteReducer</i> 中更改状态的初始化，这样默认情况下不存在便笺:

```js
const noteReducer = (state = [], action) => {
  // ...
}
```

<!-- A quick way to initialize the state based on the data on the server is to fetch the notes in the file <i>index.js</i> and dispatch the action <i>NEW\_NOTE</i> for each of them: -->
根据服务器上的数据初始化状态的一种便捷方法是从文件<i>index.js</i> 中获取便笺，并为每个便笺分派action <i>NEW\_NOTE</i>:

```js
// ...
import noteService from './services/notes' // highlight-line

const reducer = combineReducers({
  notes: noteReducer,
  filter: filterReducer,
})

const store = createStore(reducer)

// highlight-start
noteService.getAll().then(notes =>
  notes.forEach(note => {
    store.dispatch({ type: 'NEW_NOTE', data: note })
  })
)
// highlight-end

// ...
```



<!-- Let's add support in the reducer for the action <i>INIT\_NOTES</i>, using which the initialization can be done by dispatching a single action. Let's also create an action creator function _initializeNotes_. -->
让我们在 reducer 中为action <i>INIT\_NOTES</i> 添加支持，通过调度单个action可以使用它来完成初始化。 我们还要创建一个action创建器函数 _initializeNotes_。

```js
// ...
const noteReducer = (state = [], action) => {
  console.log('ACTION:', action)
  switch (action.type) {
    case 'NEW_NOTE':
      return [...state, action.data]
    case 'INIT_NOTES':   // highlight-line
      return action.data // highlight-line
    // ...
  }
}

export const initializeNotes = (notes) => {
  return {
    type: 'INIT_NOTES',
    data: notes,
  }
}

// ...
```

<!-- <i>index.js</i> simplifies: -->
<i>index.js</i> 简化为:

```js
import noteReducer, { initializeNotes } from './reducers/noteReducer'
// ...

noteService.getAll().then(notes =>
  store.dispatch(initializeNotes(notes))
)
```


<!-- > **NB:** why didn't we use await in place of promises and event handlers (registered to _then_-methods)? -->
>**注意** 为什么我们没有使用 await 来代替 promises 和事件处理程序(注册到 then-methods) ？
>
<!-- >Await only works inside <i>async</i> functions, and the code in <i>index.js</i> is not inside a function, so due to the simple nature of the operation, we'll abstain from using <i>async</i> this time. -->
> Await 只在<i>async</i> 函数中工作，而<i>index.js</i> 中的代码不在函数中，因此由于action的简单性质，这次我们不使用<i>async</i>。

<!-- We do, however, decide to move the initialization of the notes into the <i>App</i> component, and, as usual when fetching data from a server, we'll use the <i>effect hook</i>.  -->
但是，我们确实决定将便笺的初始化移动到<i>App</i> 组件中，并且，像往常一样，在从服务器获取数据时，我们将使用<i>effect hook</i>。

```js
import React, {useEffect} from 'react' // highlight-line
import NewNote from './components/NewNote'
import Notes from './components/Notes'
import VisibilityFilter from './components/VisibilityFilter'
import noteService from './services/notes'
import { initializeNotes } from './reducers/noteReducer' // highlight-line
import { useDispatch } from 'react-redux' // highlight-line

const App = () => {
  const dispatch = useDispatch()
  // highlight-start
  useEffect(() => {
    noteService
      .getAll().then(notes => dispatch(initializeNotes(notes)))
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



<!-- Using the useEffect hook causes an eslint-warning: -->
使用 useEffect hook 会导致一个 eslint-warning:

![](../../images/6/26ea.png)



<!-- We can get rid of it by doing the following: -->
我们可以通过如下方法来摆脱它:

```js
const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    noteService
      .getAll().then(notes => dispatch(initializeNotes(notes)))
  }, [dispatch]) // highlight-line

  // ...
}
```

<!-- Now the variable <i>dispatch</i> we define in the _App_ component, which practically is the dispatch function of the redux-store, has been added to the array useEffect receives as a parameter. -->
现在，我们在 App 组件中定义的变量<i>dispatch</i> (实际上是 redux-store 的 dispatch 函数)已经被添加到作为参数接收的数组 useEffect 中。
<!-- **If** the value of the dispatch-variable would change during runtime,  -->
如果 dispatch-变量的值在运行期间发生变化,
<!-- the effect would be executed again. This however cannot happen in our application, so the warning is unnecessary. -->
该效果将再次执行。但是，这不能在我们的应用中发生，所以警告是不必要的。



<!-- Another way to get rid of the warning would be to disable eslint on that line: -->
另一个消除警告的方法是禁用该行上的 eslint:

```js
const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    noteService
      .getAll().then(notes => dispatch(initializeNotes(notes)))   
      // highlight-start
  },[]) // eslint-disable-line react-hooks/exhaustive-deps  
  // highlight-end

  // ...
}
```



<!-- Generally disabling eslint when it throws a warning is not a good idea. Even though the eslint rule in question has caused some [arguments](https://github.com/facebook/create-react-app/issues/6880), we will use the first solution. -->
通常在 eslint 抛出警告时禁用它不是一个好主意。 尽管所讨论的 eslint 规则引起了一些[争论](https://github.com/facebook/create-react-app/issues/6880) ，我们将使用第一个解决方案。



<!-- More about the need to define the hooks dependencies in [the react documentation](https://reactjs.org/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies). -->
更多关于需要定义Hook依赖关系，可以参考[react documentation](https://reactjs.org/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies)。

<!-- We can do the same thing when it comes to creating a new note. Let's expand the code communicating with the server as follows: -->
当涉及到创建一个新的便笺，我们可以做同样的事情。 让我们将与服务器通信的代码展开如下:

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

<!-- The method _addNote_ of the component <i>NoteForm</i> changes slightly: -->
组件<i>NewNote</i> 的方法 _addNote_ 略有变化:

```js
import React from 'react'
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

<!-- Because the backend generates ids for the notes, we'll change the action creator _createNote_ -->
因为后端为便笺生成 id，所以我们将更改action 创建器  _createNote_ 

```js
export const createNote = (data) => {
  return {
    type: 'NEW_NOTE',
    data,
  }
}
```

<!-- Changing the importance of notes could be implemented using the same principle, meaning making an asynchronous method call to the server and then dispatching an appropriate action. -->
更改便笺的重要性可以使用相同的原则实现，这意味着对服务器进行异步方法调用，然后调度适当的action。

<!-- The current state of the code for the application can be found on [github](https://github.com/fullstack-hy2020/redux-notes/tree/part6-3) in the branch <i>part6-3</i>. -->
应用代码的当前状态可以在分支<i>part6-3</i> 中的 [github](https://github.com/fullstack-hy2020/redux-notes/tree/part6-3)上找到。

</div>


<div class="tasks">


### Exercises 6.13.-6.14.


#### 6.13 Anecdotes and the backend, 步骤1


<!-- When the application launches, fetch the anecdotes from the backend implemented using json-server. -->
当应用启动时，从使用 json-server 实现的后端获取八卦。

<!-- As the initial backend data, you can use, e.g. [this](https://github.com/fullstack-hy2020/misc/blob/master/anecdotes.json). -->
作为初始的后端数据，你可以使用，例如[this](https://github.com/fullstack-hy2020/misc/blob/master/anecdotes.json)。

#### 6.14 Anecdotes and the backend, 步骤2
<!-- Modify the creation of new anecdotes, such that the anecdotes are stored in the backend. -->
修改新八卦的创建，以便将八卦存储在后端。

</div>


<div class="content">


### Asynchronous actions and redux thunk
【异步action和 redux thunk】
<!-- Our approach is OK, but it is not great that the communication with the server happens inside the functions of the components. It would be better if the communication could be abstracted away from the components, such that they don't have to do anything else but call the appropriate <i>action creator</i>. As an example, <i>App</i> would initialize the state of the application as follows: -->
我们的方法是可行的，但是与服务器的通信发生在组件的功能内部并不是很好。 如果能够将通信从组件中抽象出来就更好了，这样它们就不必做任何其他事情，只需调用适当的<i>action creator</i>。 例如，<i>App</i> 将应用的状态初始化如下:

```js
const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeNotes()))  
  },[dispatch]) 

  // ...
}
```

<!-- and <i>NoteForm</i> would create a new note as follows: -->
<i>NoteForm</i> 将创建一个新的便笺如下:

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

<!-- Both components would only use the function provided to them as a prop without caring about the communication with the server that is happening in the background. -->
这两个组件将只使用提供给它们的功能作为一个props，而不考虑与服务器的后台通信。

<!-- Now let's install the [redux-thunk](https://github.com/gaearon/redux-thunk)-library, which enables us to create <i>asynchronous actions</i>. Installation is done with the command: -->
现在让我们安装[redux-thunk](https://github.com/gaearon/redux-thunk)-库，它允许我们创建<i>asynchronous actions</i>:

```bash
npm install redux-thunk
```

<!-- The redux-thunk-library is a so-called <i>redux-middleware</i>, which must be initialized along with the initialization of the store. While we're here, let's extract the definition of the store into its own file <i>src/store.js</i>: -->
Redux-thunk-库 是所谓的<i>redux-中间件</i>，它必须在store的初始化过程中初始化。 在这里，让我们将store的定义提取到它自己的文件 <i>src/store.js</i> 中。: 

```js
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk' // highlight-line
import { composeWithDevTools } from 'redux-devtools-extension'

import noteReducer from './reducers/noteReducer'
import filterReducer from './reducers/filterReducer'

const reducer = combineReducers({
  notes: noteReducer,
  filter: filterReducer,
})

const store = createStore(
  reducer,
  composeWithDevTools(
    applyMiddleware(thunk) // highlight-line
  )
)

export default store
```

<!-- After the changes the file <i>src/index.js</i> looks like this -->
更改之后，文件 <i>src/index.js</i>如下所示

```js
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux' 
import store from './store' // highlight-line
import App from './App'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

<!-- Thanks to redux-thunk, it is possible to define <i>action creators</i> so that they return a function having the <i>dispatch</i>-method of redux-store as its parameter. As a result of this, one can make asynchronous action creators, which first wait for some operation to finish, after which they then dispatch the real action. -->
感谢 redux-thunk，可以定义<i>action creators</i>，这样它们就可以返回一个函数，其参数是 redux-store 的<i>dispatch</i>-method。 因此，可以创建异步action创建器，它们首先等待某个action完成，然后分派真正的action。



<!-- Now we can define the action creator, <i>initializeNotes</i>, that initializes the state of the notes as follows: -->
现在，我们可以定义action创建器<i>initializeNotes</i>，它初始化便笺的状态如下:

```js
export const initializeNotes = () => {
  return async dispatch => {
    const notes = await noteService.getAll()
    dispatch({
      type: 'INIT_NOTES',
      data: notes,
    })
  }
}
```

<!-- In the inner function, meaning the <i>asynchronous action</i>, the operation first fetches all the notes from the server and then <i>dispatches</i> the notes to the action, which adds them to the store. -->
在内部函数(即<i>异步 action</i>)中，操作首先从服务器获取所有便笺，然后<i>将</i> 便笺分发到action中，从而将它们添加到store中。

<!-- The component <i>App</i> can now be defined as follows: -->
组件<i>App</i> 现在可以定义如下:

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

<!-- The solution is elegant. The initialization logic for the notes has been completely separated to outside the React component. -->
这个解决方案非常优雅。便笺的初始化逻辑已经完全分离到 React 组件之外。

<!-- The action creator _createNew_, which adds a new note looks like this -->
action 构造器 _createNote_ 添加了一个新的便笺，看起来像这样

```js
export const createNote = content => {
  return async dispatch => {
    const newNote = await noteService.createNew(content)
    dispatch({
      type: 'NEW_NOTE',
      data: newNote,
    })
  }
}
```

<!-- The principle here is the same: first an asynchronous operation is executed, after which the action changing the state of the store is <i>dispatched</i>. -->
这里的原理是相同的: 首先执行一个异步操作，然后调度改变store态的action。

<!-- The component <i>NewNote</i> changes as follows: -->
<i>NewNote</i>组件更改如下:

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

<!-- The current state of the code for the application can be found on [github](https://github.com/fullstack-hy2020/redux-notes/tree/part6-4) in the branch <i>part6-4</i>. -->
应用代码的当前状态可以在分支<i>part6-4</i> 中的[github](https://github.com/fullstack-hy2020/redux-notes/tree/part6-4)上找到。

</div>


<div class="tasks">



### Exercises 6.15.-6.18.


#### 6.15 Anecdotes and the backend, 步骤3


<!-- Modify the initialization of redux-store to happen using asynchronous action creators, which are made possible by the <i>redux-thunk</i>-library. -->
使用异步action创建器修改 redux-store 的初始化， redux-thunk-库 使异步action创建器成为可能。

#### 6.16 Anecdotes and the backend, 步骤4
<!-- Also modify the creation of a new anecdote to happen using asynchronous action creators, made possible by the <i>redux-thunk</i>-library. -->
还可以使用异步action创建器(由<i>redux-thunk</i>-library 提供)修改新八卦的创建。


#### 6.17 Anecdotes and the backend, 步骤5
<!-- Voting does not yet save changes to the backend. Fix the situation with the help of the <i>redux-thunk</i>-library. -->
投票还不能保存对后端的更改。请在<i>redux-thunk</i>-library 的帮助下修复这种情况。

#### 6.18 Anecdotes and the backend, 步骤6
<!-- The creation of notifications is still a bit tedious, since one has to do two actions and use the _setTimeout_ function: -->
创建通知仍然有点繁琐，因为必须执行两个action并使用 setTimeout 函数:

```js
dispatch(setNotification(`new anecdote '${content}'`))
setTimeout(() => {
  dispatch(clearNotification())
}, 5000)
```

<!-- Make an asynchronous action creator, which enables one to provide the notification as follows: -->
创建一个异步action创建器，它可以提供如下通知:

```js
dispatch(setNotification(`you voted '${anecdote.content}'`, 10))
```

<!-- the first parameter is the text to be rendered and the second parameter is the time to display the notification given in seconds.  -->
第一个参数是要渲染的文本，第二个参数是以秒为单位显示通知的时间。

<!-- Implement the use of this improved notification in your application. -->
在您的应用中实现这个改进的通知的使用。

</div>

