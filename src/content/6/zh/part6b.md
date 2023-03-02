---
mainImage: ../../../images/part-6.svg
part: 6
letter: b
lang: zh
---

<div class="content">

<!-- Let's continue our work with the simplified [redux version](/en/part6/flux_architecture_and_redux#redux-notes) of our notes application.-->
 让我们用简化的[redux版本](/en/part6/flux_architecture_and_redux#redux-notes)来继续我们的笔记应用的工作。

<!-- In order to ease our development, let's change our reducer so that the store gets initialized with a state that contains a couple of notes:-->
 为了简化我们的开发，让我们改变我们的还原器，使存储空间被初始化为一个包含几个笔记的状态。

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
 让我们实现对显示给用户的笔记的过滤。过滤器的用户界面将用[单选按钮](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio)来实现。

![](../../images/6/01e.png)

<!-- Let's start with a very simple and straightforward implementation:-->
 让我们从一个非常简单和直接的实现开始。

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
 由于所有的单选按钮的<i>名称</i>属性是相同的，它们形成一个<i>按钮组</i>，其中只有一个选项可以选择。


<!-- The buttons have a change handler that currently only prints the string associated with the clicked button to the console.-->
 这些按钮有一个变化处理程序，目前只将与被点击的按钮相关的字符串打印到控制台。


<!-- We decide to implement the filter functionality by storing <i>the value of the filter</i> in the redux store in addition to the notes themselves. The state of the store should look like this after making these changes:-->
我们决定通过在redux存储中存储<i>过滤器的值</i>来实现过滤器的功能，除了笔记本身之外。在做了这些改变之后，商店的状态应该是这样的。

```js
{
  notes: [
    { content: 'reducer defines how redux store works', important: true, id: 1},
    { content: 'state of store can contain any data', important: false, id: 2}
  ],
  filter: 'IMPORTANT'
}
```


<!-- Only the array of notes is stored in the state of the current implementation of our application. In the new implementation the state object has two properties, <i>notes</i> that contains the array of notes and <i>filter</i> that contains a string indicating which notes should be displayed to the user.-->
 在我们应用的当前实现中，只有笔记数组被存储在状态中。在新的实现中，状态对象有两个属性，<i>notes</i>包含笔记数组，<i>filter</i>包含一个字符串，表示哪些笔记应该被显示给用户。

### Combined reducers


<!-- We could modify our current reducer to deal with the new shape of the state. However, a better solution in this situation is to define a new separate reducer for the state of the filter:-->
 我们可以修改我们当前的还原器来处理状态的新形状。然而，在这种情况下，一个更好的解决方案是为过滤器的状态定义一个新的单独的还原器。

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


<!-- The actions for changing the state of the filter look like this:-->
 改变过滤器状态的动作如下所示：

```js
{
  type: 'SET_FILTER',
  filter: 'IMPORTANT'
}
```


<!-- Let's also create a new _action creator_ function. We will write the code for the action creator in a new <i>src/reducers/filterReducer.js</i> module:-->
 让我们也创建一个新的_action creator_函数。我们将在一个新的<i>src/reducers/filterReducer.js</i>模块中编写动作创建者的代码。

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


<!-- We can create the actual reducer for our application by combining the two existing reducers with the [combineReducers](https://redux.js.org/api/combinereducers) function.-->
 我们可以通过使用[combinedReducers](https://redux.js.org/api/combinereducers)函数结合两个现有的减速器，为我们的应用创建实际的减速器。

<!-- Let's define the combined reducer in the <i>index.js</i> file:-->
 让我们在<i>index.js</i>文件中定义组合减速器。

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

const store = createStore(reducer)

console.log(store.getState())

ReactDOM.createRoot(document.getElementById('root')).render(
  /*
  <Provider store={store}>
    <App />
  </Provider>,
  */
  <div />
)
```

<!-- Since our application breaks completely at this point, we render an empty <i>div</i> element instead of the <i>App</i> component.-->
 由于我们的应用在此时完全中断，我们渲染一个空的<i>div</i>元素而不是<i>App</i>组件。


<!-- The state of the store gets printed to the console:-->
 商店的状态被打印到控制台。

![](../../images/6/4e.png)


<!-- As we can see from the output, the store has the exact shape we wanted it to!-->
 从输出中我们可以看到，商店的形状正是我们想要的!


<!-- Let's take a closer look at how the combined reducer is created:-->
 让我们仔细看看组合减速器是如何创建的。

```js
const reducer = combineReducers({
  notes: noteReducer,
  filter: filterReducer,
})
```


<!-- The state of the store defined by the reducer above is an object with two properties: <i>notes</i> and <i>filter</i>. The value of the <i>notes</i> property is defined by the <i>noteReducer</i>, which does not have to deal with the other properties of the state. Likewise, the <i>filter</i> property is managed by the <i>filterReducer</i>.-->
 上面的还原器所定义的商店的状态是一个有两个属性的对象。<i>notes</i>和<i>filter</i>。<i>notes</i>属性的值由<i>noteReducer</i>定义，它不需要处理状态的其他属性。同样地，<i>filter</i>属性也由<i>filterReducer</i>管理。


<!-- Before we make more changes to the code, let's take a look at how different actions change the state of the store defined by the combined reducer. Let's add the following to the <i>index.js</i> file:-->
 在我们对代码做更多修改之前，让我们看看不同的动作是如何改变由组合式还原器定义的存储的状态的。让我们在<i>index.js</i>文件中添加以下内容。

```js
import { createNote } from './reducers/noteReducer'
import { filterChange } from './reducers/filterReducer'
//...
store.subscribe(() => console.log(store.getState()))
store.dispatch(filterChange('IMPORTANT'))
store.dispatch(createNote('combineReducers forms one reducer from many simple reducers'))
```


<!-- By simulating the creation of a note and changing the state of the filter in this fashion, the state of the store gets logged to the console after every change that is made to the store:-->
 通过模拟创建一个笔记，并以这种方式改变过滤器的状态，商店的状态会在每次对商店进行改变后被记录到控制台。

![](../../images/6/5e.png)


<!-- At this point it is good to become aware of a tiny but important detail. If we add a console log statement <i>to the beginning of both reducers</i>:-->
 在这一点上，最好能意识到一个微小但重要的细节。如果我们<i>在两个还原器的开头</i>添加一个控制台日志语句，那么。

```js
const filterReducer = (state = 'ALL', action) => {
  console.log('ACTION: ', action)
  // ...
}
```


<!-- Based on the console output one might get the impression that every action gets duplicated:-->
根据控制台的输出，人们可能会得到这样的印象：每个动作都被重复了。

![](../../images/6/6.png)


<!-- Is there a bug in our code? No. The combined reducer works in such a way that every <i>action</i> gets handled in <i>every</i> part of the combined reducer. Typically only one reducer is interested in any given action, but there are situations where multiple reducers change their respective parts of the state based on the same action.-->
我们的代码中存在一个错误吗？不是的。组合式还原器的工作方式是每个<i>动作</i>都在组合式还原器的<i>每个</i>部分得到处理。通常情况下，只有一个还原器对任何给定的动作感兴趣，但也有这样的情况：多个还原器基于同一个动作改变各自的状态部分。


### Finishing the filters


<!-- Let's finish the application so that it uses the combined reducer. We start by changing the rendering of the application and hooking up the store to the application in the <i>index.js</i> file:-->
 让我们完成应用，使其使用组合式还原器。我们首先改变应用的渲染，并在<i>index.js</i>文件中把商店与应用挂起。

```js
ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

<!-- Next, let's fix a bug that is caused by the code expecting the application store to be an array of notes:-->
 接下来，让我们修复一个bug，这个bug是由代码期望应用商店是一个笔记数组所引起的。

![](../../images/6/7ea.png)

<!-- It's an easy fix. Because the notes are in the store's field <i>notes</i>, we only have to make a little change to the selector function:-->
 这是个简单的修正。因为笔记是在商店的字段<i>notes</i>中，我们只需对选择器函数做一点改变。

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
<!-- Previously the selector function returned the whole state of the store:-->
 以前的选择器函数返回整个商店的状态。

```js
const notes = useSelector(state => state)
```

<!-- And now it returns only its field <i>notes</i>-->
 而现在它只返回它的字段<i>notes</i>。

```js
const notes = useSelector(state => state.notes)
```

<!-- Let's extract the visibility filter into its own <i>src/components/VisibilityFilter.js</i> component:-->
 让我们把可见性过滤器提取到自己的<i>src/components/VisibilityFilter.js</i>组件中。

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
 有了这个新的组件，<i>App</i>就可以简化成如下。

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
 实现起来相当简单。点击不同的单选按钮可以改变商店的<i>过滤器</i>属性的状态。

<!-- Let's change the <i>Notes</i> component to incorporate the filter:-->
 让我们改变<i>Notes</i>组件以纳入过滤器。

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
<!-- We only make changes to the selector function, which used to be-->
 我们只对选择器函数做了修改，它以前是

```js
useSelector(state => state.notes)
```

<!-- Yksinkertaistetaan vielä selektoria destrukturoimalla parametrina olevasta tilasta sen kentät erilleen: -->
<!-- Let's simplify the selector by destructuring the fields from the state it receives as a parameter:-->
 让我们简化选择器，从它收到的状态中解构字段作为一个参数。

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

<!-- There is a slight cosmetic flaw in our application. Even though the filter is set to <i>ALL</i> by default, the associated radio button is not selected. Naturally this issue can be fixed, but since this is an unpleasant but ultimately harmless bug we will save the fix for later. To ease these common Redux related problems-->
在我们的应用中存在一个轻微的外观缺陷。即使过滤器被默认设置为<i>ALL</i>，相关的单选按钮也没有被选中。自然，这个问题可以被修复，但由于这是一个令人不快但最终无害的错误，我们将把修复工作留到以后。为了缓解这些常见的Redux相关问题

### Redux Toolkit

<!-- As we have seen so far, Redux's configuration and state management implementation requires quite a lot of effort. This is manifested for example in the reducer and action creator related code which has somewhat repetitive boilerplate code. [Redux Toolkit](https://redux-toolkit.js.org/) is a library that solves these common Redux-related problems. The library for example greatly simplifies the configuration of the Redux store and offers a large variety of tools to ease state management.-->
 正如我们到目前为止所看到的，Redux's的配置和状态管理实现需要相当多的努力。例如，这体现在减速器和动作创建者的相关代码中，这些代码有一些重复的模板。[Redux Toolkit](https://redux-toolkit.js.org/)是一个解决这些常见的Redux相关问题的库。例如，该库大大简化了Redux商店的配置，并提供了大量的工具来简化状态管理。

<!-- Let's start using Redux Toolkit in our application by refactoring the existing code. First, we will need to install the library:-->
 让我们通过重构现有代码开始在我们的应用中使用Redux工具包。首先，我们需要安装该库。

```
npm install @reduxjs/toolkit
```

<!-- Next, open the <i>index.js</i> file which currently creates the Redux store. Instead of Redux's <em>createStore</em> function, let's create the store using Redux Toolkit's [configureStore](https://redux-toolkit.js.org/api/configureStore) function:-->
 接下来，打开目前创建Redux商店的<i>index.js</i>文件。取代Redux的<em>createStore</em>函数，让我们使用Redux工具包的[configureStore](https://redux-toolkit.js.org/api/configureStore)函数创建商店。

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
  </Provider>,
  document.getElementById('root')
)
```

<!-- We already got rid of a few lines codes now that we don't need the <em>combineReducers</em> function to create the reducer for the store. We will soon see that the <em>configureStore</em> function has many additional benefits such as the effortless integration of development tools and many commonly used libraries without the need for additional configuration.-->
 我们已经摆脱了几行代码，现在我们不需要<em>combineReducers</em>函数来创建商店的还原器。我们很快就会看到，<em>configureStore</em>函数有许多额外的好处，比如毫不费力地集成开发工具和许多常用的库，而不需要额外的配置。

<!-- Let's move on to refactoring the reducers, which really brings forth the benefits of Redux Toolkit. With Redux Toolkit, we can easily create reducer and related action creators using the [createSlice](https://redux-toolkit.js.org/api/createSlice) function. We can use the <em>createSlice</em> function to refactor the reducer and action creators in the <i>reducers/noteReducer.js</i> file in the following manner:-->
 让我们继续重构还原器，这才真正体现了Redux Toolkit的好处。通过Redux Toolkit，我们可以使用[createSlice](https://redux-toolkit.js.org/api/createSlice)函数轻松创建还原器和相关的动作创建器。我们可以使用<em>createSlice</em>函数来重构<i>reducers/noteReducer.js</i>文件中的reducer和action creators，方法如下。

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

<!-- The <em>createSlice</em> function's <em>name</em> parameter defines the prefix which is used in the action's type values. For example the <em>createNote</em> action defined later will have the type value of <em>notes/createNote</em>. It is a good practice to give the parameter a value which is unique among the reducers. This way there won't be unexpected collisions between the application's action type values. The <em>initialState</em> parameter defines the reducer's initial state. The <em>reducers</em> parameter takes the reducer itself as an object, of which functions handle state changes caused by certain action. Note that the <em>action.payload</em> in the function contains the argument provided by calling the action creator:-->
 <em>createSlice</em>函数的<em>name</em>参数定义了动作类型值中使用的前缀。例如，稍后定义的<em>createNote</em>动作将有<em>notes/createNote</em>类型值。一个好的做法是给参数一个在还原器中唯一的值。这样就不会出现应用的动作类型值之间的意外冲突。<em>initialState</em>参数定义了还原器的初始状态。<em>reducers</em>参数把reducer本身作为一个对象，其中的函数处理由某些动作引起的状态变化。注意，函数中的<em>action.payload</em>包含调用动作创建者提供的参数。

```js
dispatch(createNote('Redux Toolkit is awesome!'))
```

<!-- This dispatch call responds to dispatching the following object:-->
 这个调度调用响应了调度以下对象。

```js
dispatch({ type: 'notes/createNote', payload: 'Redux Toolkit is awesome!' })
```

<!-- If you followed closely, you might have noticed that inside the <em>createNote</em> action, there seems to happen something that violates the reducers' immutability principle mentioned earlier:-->
 如果你密切关注，你可能已经注意到在<em>createNote</em>动作里面，似乎发生了一些违反前面提到的reducers'' immutability原则的事情。

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
 我们通过调用<em>push</em>方法来改变<em>state</em>参数的数组，而不是返回数组的一个新实例。这到底是怎么回事？

<!-- Redux Toolkit utilizes the [Immer](https://immerjs.github.io/immer/) library with reducers created by <em>createSlice</em> function, which makes it possible to mutate the <em>state</em> argument inside the reducer. Immer uses the mutated state to produce a new, immutable state and thus the state changes remain immutable. Note that state can be changed without "mutating" it, as we have done with the <em>toggleImportanceOf</em> action. In this case function <i>returns</i> the new state. Nevertheless mutating the state will often come in handy especially when a complex state needs to be updated.-->
 Redux Toolkit利用[Immer](https://immerjs.github.io/immer/)库与由<em>createSlice</em>函数创建的还原器，这使得在还原器内部改变<em>state</em>参数成为可能。Immer使用改变的状态来产生一个新的、不可变的状态，因此状态的改变仍然是不可变的。请注意，状态可以在不 "改变 "的情况下被改变，就像我们在<em>toggleImportanceOf</em>动作中做的那样。在这种情况下，函数<i>会返回</i>新的状态。然而，改变状态经常会派上用场，特别是当一个复杂的状态需要被更新时。

<!-- The <em>createSlice</em> function returns an object containing the reducer as well as the action creators defined by the <em>reducers</em> parameter. The reducer can be accessed by the <em>noteSlice.reducer</em> property, whereas the action creators by the <em>noteSlice.actions</em> property. We can produce the file's exports in the following way:-->
 <em>createSlice</em>函数返回一个对象，包含还原器以及由<em>reducers</em>参数定义的动作创建者。可以通过<em>noteSlice.reducer</em>属性访问还原器，而通过<em>noteSlice.actions</em>属性访问动作创建者。我们可以通过以下方式产生文件''的输出。

```js
const noteSlice = createSlice(/* ... */)

// highlight-start
export const { createNote, toggleImportanceOf } = noteSlice.actions

export default noteSlice.reducer
// highlight-end
```

<!-- The imports in other files will work just as they did before:-->
 其他文件中的导入将像以前一样工作。

```js
import noteReducer, { createNote, toggleImportanceOf } from './reducers/noteReducer'
```

<!-- We need to alter the tests a bit due to naming conventions of ReduxToolkit:-->
 由于ReduxToolkit的命名惯例，我们需要改变一下测试。

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
    expect(newState.map(s => s.content)).toContainEqual(action.payload) // highlight-line
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
})
```

### Redux DevTools

<!-- [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd) is a Chrome addon that offers useful development tools for Redux. It can be used for example to inspect the Redux store's state and dispatch actions through the browser's console. When the store is created using Redux Toolkit's <em>configureStore</em> function, no additional configuration is needed for Redux DevTools to work.-->
 [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd) 是一个Chrome插件，为Redux提供有用的开发工具。例如，它可以用来检查Redux商店的状态，并通过浏览器的控制台调度行动。当使用Redux Toolkit的<em>configureStore</em>函数创建存储时，Redux DevTools不需要额外的配置就可以工作。

<!-- Once the addon in installed, clicking the <i>Redux</i> tab in the browser's console should open the development tools:-->
 一旦插件安装完毕，点击浏览器控制台中的<i>Redux</i>标签就可以打开开发工具。

![](../../images/6/11ea.png)

<!-- You can inspect how dispatching a certain action changes the state by clicking the action:-->
 你可以通过点击某个动作来检查调度某个动作如何改变状态。

![](../../images/6/12ea.png)

<!-- It is also possible to dispatch actions to the store using the development tools:-->
 也可以使用开发工具向商店调度动作。

![](../../images/6/13ea.png)

<!-- You can find the code for our current application in its entirety in the <i>part6-2</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/redux-notes/tree/part6-2).-->
 你可以在[这个Github仓库](https://github.com/fullstack-hy2020/redux-notes/tree/part6-2)的<i>part6-2</i>分支中找到我们当前应用的全部代码。

</div>

<div class="tasks">

### Exercises 6.9.-6.12.

<!-- Let's continue working on the anecdote application using Redux that we started in exercise 6.3.-->
 让我们继续研究我们在练习6.3中开始的使用Redux的名言警句应用。

#### 6.9 Better anecdotes, step7

<!-- Install Redux Toolkit for the project. Move the Redux store creation into its own file <i>store.js</i> and use Redux Toolkit's <em>configureStore</em> to create the store. Also, start using Redux DevTools to debug the application's state easier.-->
 为该项目安装Redux工具包。将Redux商店的创建移到自己的文件<i>store.js</i>中，并使用Redux Toolkit's <em>configureStore</em>来创建商店。同时，开始使用Redux DevTools来更容易地调试应用的状态。

#### 6.10 Better anecdotes, step8

<!-- The application has a ready-made body for the <i>Notification</i> component:-->
该应用有一个现成的<i>Notification</i>组件主体。

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
 扩展该组件，使其渲染存储在Redux商店中的消息，使该组件采取以下形式。

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

<!-- You will have to make changes to the application's existing reducer. Create a separate reducer for the new functionality by using the Redux Toolkit's <em>createSlice</em> function. Also, refactor the application so that it uses a combined reducer as shown in this part of the course material.-->
 你将不得不对应用现有的还原器进行修改。通过使用Redux工具包的<em>createSlice</em>函数，为新功能创建一个单独的reducer。同时，重构应用，使其使用一个组合的还原器，如教材中的这一部分所示。

<!-- The application does not have to use the <i>Notification</i> component in an intelligent way at this point in the exercises. It is enough for the application to display the initial value set for the message in the <i>notificationReducer</i>.-->
 在练习的这一点上，应用不需要以智能方式使用<i>Notification</i>组件。应用只需显示在<i>notificationReducer</i>中为消息设置的初始值即可。

#### 6.11 Better anecdotes, step9

<!-- Extend the application so that it uses the <i>Notification</i> component to display a message for five seconds when the user votes for an anecdote or creates a new anecdote:-->
 扩展应用，使其使用<i>Notification</i>组件，在用户为名言警句投票或创建新的名言警句时，显示一条消息五秒钟。

![](../../images/6/8ea.png)

<!-- It's recommended to create separate [action creators](https://redux-toolkit.js.org/api/createSlice#reducers) for setting and removing notifications.-->
 建议创建单独的[动作创建者](https://redux-toolkit.js.org/api/createSlice#reducers)来设置和删除通知。

#### 6.12* Better anecdotes, step10

<!-- Implement filtering for the anecdotes that are displayed to the user.-->
 对显示给用户的名言警句实施过滤。

![](../../images/6/9ea.png)

<!-- Store the state of the filter in the redux store. It is recommended to create a new reducer and action creators for this purpose. Implement the reducer and action creators using the Redux Toolkit's <em>createSlice</em> function.-->
 在redux存储中存储过滤器的状态。建议为此目的创建一个新的还原器和动作创建器。使用Redux工具包的<em>createSlice</em>函数实现还原器和动作创建器。

<!-- Create a new <i>Filter</i> component for displaying the filter. You can use the following code as a template for the component:-->
 创建一个新的<i>Filter</i>组件来显示过滤器。你可以使用下面的代码作为该组件的模板。

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
