---
mainImage: ../../../images/part-6.svg
part: 6
letter: b
lang: zh
---

<div class="content">

<!-- Let's continue our work with the simplified [redux version](/en/part6/flux_architecture_and_redux#redux-notes) of our notes application.-->
让我们继续我们的工作，使用我们笔记应用的简化[redux版本](/en/part6/flux_architecture_and_redux#redux-notes)。

<!-- To ease our development, let's change our reducer so that the store gets initialized with a state that contains a couple of notes:-->
为了简化我们的开发，让我们改变我们的 reducer，使 store 以包含几条笔记的状态初始化：

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

<!-- Let's implement filtering for the notes that are displayed to the user. The user interface for the filters will be implemented with [radio buttons](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio):-->
让我们为显示给用户的笔记实现过滤功能。用户界面的过滤器将使用[单选按钮](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio)实现：

![browser with important/not radio buttons and list](../../images/6/01e.png)

<!-- Let's start with a very simple and straightforward implementation:-->
让我们从一个非常简单直接的实现开始：

```js
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

<!-- Since the <i>name</i> attribute of all the radio buttons is the same, they form a <i>button group</i> where only one option can be selected.-->
因为所有单选按钮的<i>name</i>属性是相同的，它们形成了一个<i>按钮组</i>，只能选择一个选项。

<!-- The buttons have a change handler that currently only prints the string associated with the clicked button to the console.-->
按钮具有一个更改处理程序，目前只将与点击的按钮关联的字符串打印到控制台。

<!-- We decide to implement the filter functionality by storing <i>the value of the filter</i> in the redux store in addition to the notes themselves. The state of the store should look like this after making these changes:-->
我们决定通过除了笔记本身之外，还将<i>过滤器的值</i>存储在Redux store中来实现过滤功能。在做出这些更改后，store的状态应该如下所示：

```js
{
  notes: [
    { content: 'reducer defines how redux store works', important: true, id: 1},
    { content: 'state of store can contain any data', important: false, id: 2}
  ],
  filter: 'IMPORTANT'
}
```

<!-- Only the array of notes is stored in the state of the current implementation of our application. In the new implementation, the state object has two properties, <i>notes</i> that contains the array of notes and <i>filter</i> that contains a string indicating which notes should be displayed to the user.-->
在目前的应用程序实现中，只存储音符数组。在新的实现中，状态对象有两个属性，<i>notes</i>包含音符数组，<i>filter</i>包含一个字符串，指示应向用户显示哪些音符。

### Combined reducers

<!-- We could modify our current reducer to deal with the new shape of the state. However, a better solution in this situation is to define a new separate reducer for the state of the filter:-->
我们可以修改我们目前的reducer来处理新状态的形状。然而，在这种情况下，更好的解决方案是为过滤器的状态定义一个新的单独的reducer：

```js
const filterReducer = (state = 'ALL', action) => {
  switch (action.type) {
    case 'SET_FILTER':
      return action.payload
    default:
      return state
  }
}
```

<!-- The actions for changing the state of the filter look like this:-->
这些改变滤波器状态的操作看起来像这样：

```js
{
  type: 'SET_FILTER',
  payload: 'IMPORTANT'
}
```

<!-- Let's also create a new _action creator_ function. We will write the code for the action creator in a new <i>src/reducers/filterReducer.js</i> module:-->
让我们也创建一个新的_action creator_函数。我们将在新的<i>src/reducers/filterReducer.js</i>模块中编写action creator的代码：

```js
const filterReducer = (state = 'ALL', action) => {
  // ...
}

export const filterChange = filter => {
  return {
    type: 'SET_FILTER',
    payload: filter,
  }
}

export default filterReducer
```

<!-- We can create the actual reducer for our application by combining the two existing reducers with the [combineReducers](https://redux.js.org/api/combinereducers) function.-->
我们可以通过使用[combineReducers](https://redux.js.org/api/combinereducers)函数将两个现有的reducer结合起来，来为我们的应用程序创建实际的reducer。

<!-- Let's define the combined reducer in the <i>index.js</i> file:-->
在<i>index.js</i>文件中定义组合reducer：

```js
import React from 'react'
import ReactDOM from 'react-dom/client'
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

const store = createStore(reducer) // highlight-line

console.log(store.getState())

/*
ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)*/

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <div />
  </Provider>
)
```

<!-- Since our application breaks completely at this point, we render an empty <i>div</i> element instead of the <i>App</i> component.-->
因为我们的应用在这一点完全崩溃了，所以我们渲染一个空的<i>div</i>元素而不是<i>App</i>组件。

<!-- The state of the store gets printed to the console:-->
控制台打印出商店的状态：

![devtools console showing notes array data](../../images/6/4e.png)

<!-- As we can see from the output, the store has the exact shape we wanted it to!-->
从输出结果可以看出，商店拥有我们想要的正确形状！

<!-- Let's take a closer look at how the combined reducer is created:-->
让我们仔细看看如何创建组合reducer：

```js
const reducer = combineReducers({
  notes: noteReducer,
  filter: filterReducer,
})
```

<!-- The state of the store defined by the reducer above is an object with two properties: <i>notes</i> and <i>filter</i>. The value of the <i>notes</i> property is defined by the <i>noteReducer</i>, which does not have to deal with the other properties of the state. Likewise, the <i>filter</i> property is managed by the <i>filterReducer</i>.-->
状态由上面的reducer定义，它是一个具有两个属性<i>notes</i>和<i>filter</i>的对象。<i>notes</i>属性的值由<i>noteReducer</i>定义，它不必处理状态的其他属性。 同样，<i>filter</i>属性由<i>filterReducer</i>管理。

<!-- Before we make more changes to the code, let's take a look at how different actions change the state of the store defined by the combined reducer. Let's add the following to the <i>index.js</i> file:-->
在我们对代码做出更多改变之前，让我们看看不同的行为如何改变由组合reducer定义的存储的状态。让我们把下面的内容添加到<i>index.js</i>文件中：

```js
import { createNote } from './reducers/noteReducer'
import { filterChange } from './reducers/filterReducer'
//...
store.subscribe(() => console.log(store.getState()))
store.dispatch(filterChange('IMPORTANT'))
store.dispatch(createNote('combineReducers forms one reducer from many simple reducers'))
```

<!-- By simulating the creation of a note and changing the state of the filter in this fashion, the state of the store gets logged to the console after every change that is made to the store:-->
通过模拟创建一个笔记并改变过滤器的状态，每次对存储状态进行更改后，存储状态都会被记录到控制台：

![devtools console output showing notes filter and new note](../../images/6/5e.png)

<!-- At this point, it is good to become aware of a tiny but important detail. If we add a console log statement <i>to the beginning of both reducers</i>:-->
在这一点上，有必要意识到一个微小但重要的细节。如果我们在两个reducers的开头添加一个console log语句：

```js
const filterReducer = (state = 'ALL', action) => {
  console.log('ACTION: ', action)
  // ...
}
```

<!-- Based on the console output one might get the impression that every action gets duplicated:-->
根据控制台输出，人们可能会得出这样的印象：每个动作都被复制了。

![devtools console output showing dupblicated actions in note and filter reducers](../../images/6/6.png)

<!-- Is there a bug in our code? No. The combined reducer works in such a way that every <i>action</i> gets handled in <i>every</i> part of the combined reducer. Typically only one reducer is interested in any given action, but there are situations where multiple reducers change their respective parts of the state based on the same action.-->
有没有bug在我们的代码里？不。组合reducer的工作方式是每个<i>action</i>都会在<i>每一部分</i>的组合reducer里被处理。通常只有一个reducer对任何给定的action感兴趣，但也有情况多个reducer会根据同一个action改变它们各自的state部分。

### Finishing the filters

<!-- Let's finish the application so that it uses the combined reducer. We start by changing the rendering of the application and hooking up the store to the application in the <i>index.js</i> file:-->
让我们完成应用程序，以便它使用组合的reducer。我们从更改应用程序的渲染并在<i>index.js</i>文件中将存储钩入应用程序开始：

```js
ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
```

<!-- Next, let's fix a bug that is caused by the code expecting the application store to be an array of notes:-->
接下来，让我们修复一个由于代码期望应用商店为一个笔记数组而导致的错误：

![browser TypeError: notes.map is not a function](../../images/6/7ea.png)

<!-- It's an easy fix. Because the notes are in the store's field <i>notes</i>, we only have to make a little change to the selector function:-->
因为笔记在商店的字段<i>notes</i>中，我们只需要对选择器函数做一点小改动就可以轻松解决：

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

<!-- Previously the selector function returned the whole state of the store:-->
之前，选择器函数返回存储的整个状态：

```js
const notes = useSelector(state => state)
```

<!-- And now it returns only its field <i>notes</i>-->
现在它只返回它的字段<i>注释</i>

```js
const notes = useSelector(state => state.notes)
```

<!-- Let's extract the visibility filter into its own <i>src/components/VisibilityFilter.js</i> component:-->
让我们把可见性过滤器提取到它自己的<i>src/components/VisibilityFilter.js</i> 组件中：

```js
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

<!-- With the new component <i>App</i> can be simplified as follows:-->
<i>App</i> 的新组件可以简化如下：

```js
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

<!-- The implementation is rather straightforward. Clicking the different radio buttons changes the state of the store's <i>filter</i> property.-->
实施相当直接。点击不同的单选按钮会改变商店的<i>过滤器</i>属性状态。

<!-- Let's change the <i>Notes</i> component to incorporate the filter:-->
让我们改变<i>笔记</i>组件，以纳入过滤器：

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

<!-- We only make changes to the selector function, which used to be-->
called "getSelector".

我们只对选择器函数做出更改，它曾经被称为“getSelector”。

```js
useSelector(state => state.notes)
```

<!-- Let's simplify the selector by destructuring the fields from the state it receives as a parameter:-->
让我们通过从参数接收的状态中解构字段来简化选择器：

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

<!-- There is a slight cosmetic flaw in our application. Even though the filter is set to <i>ALL</i> by default, the associated radio button is not selected. Naturally, this issue can be fixed, but since this is an unpleasant but ultimately harmless bug we will save the fix for later.-->
本应用有一个轻微的美学缺陷。即使默认设置过滤器为<i>全部</i>，关联的单选按钮也没有被选中。当然，这个问题可以被修复，但由于这是一个令人不快但最终无害的错误，我们将把修复留到以后再做。

<!-- The current version of the application can be found on [GitHub](https://github.com/fullstack-hy2020/redux-notes/tree/part6-2), branch <i>part6-2</i>.-->
当前应用程序的版本可以在[GitHub](https://github.com/fullstack-hy2020/redux-notes/tree/part6-2)，分支<i>part6-2</i>中找到。

</div>

<div class="tasks">

### Exercise 6.9

#### 6.9 Better anecdotes, step7

<!-- Implement filtering for the anecdotes that are displayed to the user.-->
实施对显示给用户的轶事的过滤。

![browser showing filtering of anecdotes](../../images/6/9ea.png)

<!-- Store the state of the filter in the redux store. It is recommended to create a new reducer, action creators, and a combined reducer for the store using the <i>combineReducers</i> function.-->
将过滤器的状态存储在redux存储中。建议使用<i>combineReducers</i>函数为存储创建新的reducer、action创建者和组合reducer。

<!-- Create a new <i>Filter</i> component for displaying the filter. You can use the following code as a template for the component:-->
创建一个新的<i>过滤器</i>组件来显示过滤器。您可以使用以下代码作为组件的模板：

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

### Redux Toolkit

<!-- As we have seen so far, Redux's configuration and state management implementation requires quite a lot of effort. This is manifested for example in the reducer and action creator-related code which has somewhat repetitive boilerplate code. [Redux Toolkit](https://redux-toolkit.js.org/) is a library that solves these common Redux-related problems. The library for example greatly simplifies the configuration of the Redux store and offers a large variety of tools to ease state management.-->
随着我们迄今为止所看到的，Redux的配置和状态管理实施需要相当多的努力。这在reducer和action creator相关的代码中表现出来，这些代码有一定的重复的样板代码。[Redux Toolkit](https://redux-toolkit.js.org/)是一个解决这些常见Redux问题的库。该库可以大大简化Redux store的配置，并提供大量的工具来简化状态管理。

<!-- Let's start using Redux Toolkit in our application by refactoring the existing code. First, we will need to install the library:-->
让我们开始在我们的应用程序中使用Redux Toolkit来重构现有的代码。首先，我们需要安装这个库：

```bash
npm install @reduxjs/toolkit
```

<!-- Next, open the <i>index.js</i> file which currently creates the Redux store. Instead of Redux's <em>createStore</em> function, let's create the store using Redux Toolkit's [configureStore](https://redux-toolkit.js.org/api/configureStore) function:-->
接下来，打开<i>index.js</i>文件，目前它正在创建Redux存储。不要使用Redux的<em>createStore</em>功能，而是使用Redux Toolkit的[configureStore](https://redux-toolkit.js.org/api/configureStore)功能来创建存储：

```js
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit' // highlight-line
import App from './App'

import noteReducer from './reducers/noteReducer'
import filterReducer from './reducers/filterReducer'

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

<!-- We already got rid of a few lines of code now that we don''t need the <em>combineReducers</em> function to create the reducer for the store. We will soon see that the <em>configureStore</em> function has many additional benefits such as the effortless integration of development tools and many commonly used libraries without the need for additional configuration.-->
我们已经摆脱了一些代码，因为我们不需要<em>combineReducers</em>函数来创建store的reducer了。我们很快就会发现<em>configureStore</em>函数有许多额外的好处，比如无需额外配置即可轻松集成开发工具和许多常用库。

<!-- Let's move on to refactoring the reducers, which brings forth the benefits of the Redux Toolkit. With Redux Toolkit, we can easily create reducer and related action creators using the [createSlice](https://redux-toolkit.js.org/api/createSlice) function. We can use the <em>createSlice</em> function to refactor the reducer and action creators in the <i>reducers/noteReducer.js</i> file in the following manner:-->
让我们继续重构 reducer，从而获得 Redux Toolkit 的好处。使用 Redux Toolkit，我们可以使用 [createSlice](https://redux-toolkit.js.org/api/createSlice) 函数轻松创建 reducer 和相关的 action creators。我们可以使用 <em>createSlice</em> 函数以下列方式重构 <i>reducers/noteReducer.js</i> 文件中的 reducer 和 action creators：

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
```

<!-- The <em>createSlice</em> function's <em>name</em> parameter defines the prefix which is used in the action's type values. For example, the <em>createNote</em> action defined later will have the type value of <em>notes/createNote</em>. It is a good practice to give the parameter a value, which is unique among the reducers. This way there won't be unexpected collisions between the application's action type values. The <em>initialState</em> parameter defines the reducer's initial state. The <em>reducers</em> parameter takes the reducer itself as an object, of which functions handle state changes caused by certain actions. Note that the <em>action.payload</em> in the function contains the argument provided by calling the action creator:-->
<em>createSlice</em> 函数的 <em>name</em> 参数定义了用于动作类型值的前缀。例如，稍后定义的 <em>createNote</em> 动作将具有 <em>notes/createNote</em> 的类型值。给参数赋予一个在 reducer 中唯一的值是一种良好的做法，这样就不会有意想不到的动作类型值冲突。<em>initialState</em> 参数定义了 reducer 的初始状态。<em>reducers</em> 参数将 reducer 本身作为一个对象传入，其中的函数处理由某些动作引起的状态变化。请注意，函数中的 <em>action.payload</em> 包含调用动作创建者时提供的参数。

```js
dispatch(createNote('Redux Toolkit is awesome!'))
```

<!-- This dispatch call responds to dispatching the following object:-->
这次调度呼叫回应调度下列物体：

```js
dispatch({ type: 'notes/createNote', payload: 'Redux Toolkit is awesome!' })
```

<!-- If you followed closely, you might have noticed that inside the <em>createNote</em> action, there seems to happen something that violates the reducers'' immutability principle mentioned earlier:-->
如果你仔细跟随，你可能已经注意到在<em>createNote</em>动作中，似乎发生了一些违反前面提到的reducers的不可变原则的事情：

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

<!-- We are mutating <em>state</em> argument's array by calling the <em>push</em> method instead of returning a new instance of the array. What's this all about?-->
我们正在通过调用<em>push</em>方法而不是返回一个新的数组实例来改变<em>state</em>参数的数组。这都是关于什么的？

<!-- Redux Toolkit utilizes the [Immer](https://immerjs.github.io/immer/) library with reducers created by <em>createSlice</em> function, which makes it possible to mutate the <em>state</em> argument inside the reducer. Immer uses the mutated state to produce a new, immutable state and thus the state changes remain immutable. Note that <em>state</em> can be changed without "mutating" it, as we have done with the <em>toggleImportanceOf</em> action. In this case, the function <i>returns</i> the new state. Nevertheless mutating the state will often come in handy especially when a complex state needs to be updated.-->
Redux Toolkit 利用 [Immer](https://immerjs.github.io/immer/) 库以及由 <em>createSlice</em> 函数创建的 reducer，使得可以在 reducer 内部突变 <em>state</em> 参数。Immer 使用突变的 state 来生成一个新的不可变的 state，因此 state 的变化仍然保持不可变。请注意，<em>state</em> 可以在不 "突变" 它的情况下被改变，就像我们对 <em>toggleImportanceOf</em> 动作所做的那样。在这种情况下，函数 <i>returns</i> 新的 state。尽管如此，当需要更新复杂的 state 时，突变 state 往往会派上用场。

<!-- The <em>createSlice</em> function returns an object containing the reducer as well as the action creators defined by the <em>reducers</em> parameter. The reducer can be accessed by the <em>noteSlice.reducer</em> property, whereas the action creators by the <em>noteSlice.actions</em> property. We can produce the file's exports in the following way:-->
<em>createSlice</em> 函数返回一个对象，其中包含由<em>reducers</em>参数定义的reducer以及action creators。可以通过<em>noteSlice.reducer</em>属性访问reducer，而通过<em>noteSlice.actions</em>属性访问action creators。我们可以以下面的方式生成文件的导出：

```js
const noteSlice = createSlice(/* ... */)

// highlight-start
export const { createNote, toggleImportanceOf } = noteSlice.actions

export default noteSlice.reducer
// highlight-end
```

<!-- The imports in other files will work just as they did before:-->
其他文件中的导入就像以前一样有效：

```js
import noteReducer, { createNote, toggleImportanceOf } from './reducers/noteReducer'
```

<!-- We need to alter the action type names in the tests due to the conventions of ReduxToolkit:-->
我们需要由于ReduxToolkit的约定而更改测试中的动作类型名称：

```js
import noteReducer from './noteReducer'
import deepFreeze from 'deep-freeze'

describe('noteReducer', () => {
  test('returns new state with action notes/createNote', () => {
    const state = []
    const action = {
      type: 'notes/createNote', // highlight-line
      payload: 'the app state is in redux store', // highlight-line
    }

    deepFreeze(state)
    const newState = noteReducer(state, action)

    expect(newState).toHaveLength(1)
    expect(newState.map(s => s.content)).toContainEqual(action.payload)
  })

  test('returns new state with action notes/toggleImportanceOf', () => {
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
      type: 'notes/toggleImportanceOf', // highlight-line
      payload: 2
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
})
```

### Redux Toolkit and console.log

<!-- As we have learned, console.log is an extremely powerful tool, it usually always saves us from trouble.-->
我们已经学习到，`console.log` 是一个极其强大的工具，它通常总能拯救我们免遭麻烦。

<!-- Let's try to print the state of the Redux Store to the console in the middle of the reducer created with the function createSlice:-->
让我们试着在用函数createSlice创建的reducer中间，将Redux Store的状态打印到控制台：

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

<!-- The following is printed to the console-->
下面被打印到控制台：

![devtools console showing Handler,Target as null but IsRevoked as true](../../images/6/40new.png)

<!-- The output is interesting but not very useful. This is about the previously mentioned Immer library used by the Redux Toolkit, which is now used internally to save the state of the Store.-->
输出很有趣，但不是很有用。这是关于之前提到的Immer库，它被Redux Toolkit使用，现在被用于内部保存Store的状态。

<!-- The status can be converted to a human-readable format, e.g. by converting it to a string and back to a JavaScript object as follows:-->
可以将状态转换为可读的格式，例如通过将其转换为字符串，然后再转换回JavaScript对象，如下所示：

```js
console.log(JSON.parse(JSON.stringify(state))) // highlight-line
```

<!-- Console output is now human readable-->
控制台输出现在是可读的人类

![dev tools showing array of 2 notes](../../images/6/41new.png)

### Redux DevTools

<!-- [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd) is a Chrome addon that offers useful development tools for Redux. It can be used for example to inspect the Redux store's state and dispatch actions through the browser's console. When the store is created using Redux Toolkit's <em>configureStore</em> function, no additional configuration is needed for Redux DevTools to work.-->
[Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd) 是一款Chrome插件，为Redux提供有用的开发工具。它可以用来检查Redux store的状态，并通过浏览器的控制台调度动作。当使用Redux Toolkit的<em>configureStore</em>函数创建存储库时，无需额外的配置即可使用Redux DevTools。

<!-- Once the addon is installed, clicking the <i>Redux</i> tab in the browser's console should open the development tools:-->
一旦安装了附加组件，在浏览器控制台点击<i>Redux</i>标签就可以打开开发工具：

![browser with redux addon in devtools](../../images/6/42new.png)

<!-- You can inspect how dispatching a certain action changes the state by clicking the action:-->
你可以通过点击该操作来检查派发某个操作如何改变状态：

![devtools inspecting notes tree in redux](../../images/6/43new.png)

<!-- It is also possible to dispatch actions to the store using the development tools:-->
也可以使用开发工具将动作分派到存储：

![devtools redux dispatching createNote with payload](../../images/6/44new.png)

<!-- You can find the code for our current application in its entirety in the <i>part6-3</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/redux-notes/tree/part6-3).-->
您可以在[此GitHub存储库](https://github.com/fullstack-hy2020/redux-notes/tree/part6-3)的<i> part6-3 </i>分支中找到我们当前应用程序的完整代码。

</div>

<div class="tasks">

### Exercises 6.10.-6.13.

<!-- Let's continue working on the anecdote application using Redux that we started in exercise 6.3.-->
让我们继续在练习6.3中开始使用Redux来开发轶事应用程序。

#### 6.10 Better anecdotes, step8

<!-- Install Redux Toolkit for the project. Move the Redux store creation into the file <i>store.js</i> and use Redux Toolkit's <em>configureStore</em> to create the store.-->
安装Redux Toolkit用于该项目。将Redux存储创建移至文件<i>store.js</i>中，并使用Redux Toolkit的<em>configureStore</em>来创建存储。

<!-- Change the definition of the <i>filter reducer and action creators</i> to use the Redux Toolkit's <em>createSlice</em> function.-->
将 <i>filter reducer 和 action creators</i> 的定义更改为使用 Redux Toolkit 的 <em>createSlice</em> 函数。

<!-- Also, start using Redux DevTools to debug the application's state easier.-->
也可以开始使用Redux DevTools来更轻松地调试应用程序的状态。

#### 6.11 Better anecdotes, step9

<!-- Change also the definition of the <i>anecdote reducer and action creators</i> to use the Redux Toolkit's <em>createSlice</em> function.-->
改变<i>anecdote reducer 和 action creators</i>的定义，使用Redux Toolkit的<em>createSlice</em>函数。

#### 6.12 Better anecdotes, step10

<!-- The application has a ready-made body for the <i>Notification</i> component:-->
应用程序为<i>通知</i>组件提供了一个现成的身体：

```js
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

<!-- Extend the component so that it renders the message stored in the Redux store, making the component take the following form:-->
扩展这个组件，使它能够渲染Redux存储中的消息，使组件具有以下形式：

```js
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

<!-- You will have to make changes to the application's existing reducer. Create a separate reducer for the new functionality by using the Redux Toolkit's <em>createSlice</em> function.-->
你必须对应用程序现有的 reducer 做出更改。使用 Redux Toolkit 的 <em>createSlice</em> 函数为新功能创建一个单独的 reducer。

<!-- The application does not have to use the <i>Notification</i> component intelligently at this point in the exercises. It is enough for the application to display the initial value set for the message in the <i>notificationReducer</i>.-->
应用程序在这些练习中不必智能地使用<i>通知</i>组件。 应用程序只需要在<i>notificationReducer</i>中显示为消息设置的初始值即可。

#### 6.13 Better anecdotes, step11

<!-- Extend the application so that it uses the <i>Notification</i> component to display a message for five seconds when the user votes for an anecdote or creates a new anecdote:-->
扩展该应用，让它使用<i>通知</i>组件，当用户为轶事投票或创建一个新的轶事时，显示一条消息五秒钟：

![browser showing message of having voted](../../images/6/8ea.png)

<!-- It's recommended to create separate [action creators](https://redux-toolkit.js.org/api/createSlice#reducers) for setting and removing notifications.-->
建议分别为设置和移除通知创建[动作创建者](https://redux-toolkit.js.org/api/createSlice#reducers)。

</div>
