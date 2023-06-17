---
mainImage: ../../../images/part-6.svg
part: 6
letter: a
lang: zh
---

<div class="content">

<!-- So far, we have followed the state management conventions recommended by React. We have placed the state and the methods for handling it to [the root component](https://reactjs.org/docs/lifting-state-up.html) of the application. The state and its handler methods have then been passed to other components with props. This works up to a certain point, but when applications grow larger, state management becomes challenging.-->
 到目前为止，我们一直遵循React推荐的状态管理约定。我们把状态和处理状态的方法放到了应用的[根组件](https://reactjs.org/docs/lifting-state-up.html)。然后，状态和它的处理方法被用prop传递给其他组件。这在一定程度上是可行的，但当应用越来越大时，状态管理就变得很有挑战性。

### Flux-architecture

<!-- Facebook developed the [Flux](https://facebook.github.io/flux/docs/in-depth-overview/)- architecture to make state management easier. In Flux, the state is separated completely from the React-components into its own <i>stores</i>.-->
 Facebook开发了[Flux](https://facebook.github.io/flux/docs/in-depth-overview/)-架构，使状态管理更容易。在Flux中，状态被完全从React组件中分离出来，进入它自己的<i>存储</i>。
<!-- State in the store is not changed directly, but with different <i>actions</i>.-->
 存储器中的状态不是直接改变的，而是通过不同的<i>动作</i>改变的。

<!-- When an action changes the state of the store, the views are rerendered:-->
当一个动作改变了商店的状态时，视图会被重新渲染。

![](https://facebook.github.io/flux/img/overview/flux-simple-f8-diagram-1300w.png)

<!-- If some action on the application, for example pushing a button, causes the need to change the state, the change is made with an action.-->
 如果应用上的某些动作，例如按下一个按钮，导致需要改变状态，则用一个动作进行改变。
<!-- This causes rerendering the view again:-->
这将导致再次重新渲染视图。

![](https://facebook.github.io/flux/img/overview/flux-simple-f8-diagram-with-client-action-1300w.png)

<!-- Flux offers a standard way for how and where the application's state is kept and how it is modified.-->
 Flux为应用的状态如何保存、在哪里保存以及如何修改提供了一个标准的方法。

### Redux

<!-- Facebook has an implementation for Flux, but we will be using the [Redux](https://redux.js.org) - library. It works with the same principle, but is a bit simpler. Facebook also uses Redux now instead of their original Flux.-->
 Facebook有一个Flux的实现，但我们将使用[Redux](https://redux.js.org) - 库。它的工作原理是一样的，但要简单一些。Facebook现在也使用Redux，而不是他们原来的Flux。

<!-- We will get to know Redux by implementing a counter application yet again:-->
 我们将再次通过实现一个计数器应用来了解Redux。

![](../../images/6/1.png)

<!-- Create a new create-react-app-application and install </i>redux</i> with the command-->
 创建一个新的create-react-app-application并安装<i>redux</i>，命令如下

```bash
npm install redux
```

<!-- As in Flux, in Redux the state is also stored in a [store](https://redux.js.org/basics/store).-->
 和Flux一样，在Redux中，状态也被存储在一个[存储](https://redux.js.org/basics/store)中。

<!-- The whole state of the application is stored into <i>one</i> JavaScript-object in the store. Because our application only needs the value of the counter, we will save it straight to the store. If the state was more complicated, different things in the state would be saved as separate fields of the object.-->
 应用的整个状态被存储在商店的<i>一个</i>JavaScript-object中。因为我们的应用只需要计数器的值，所以我们将直接把它保存到存储区。如果状态更复杂，状态中的不同事物将被保存为对象的独立字段。

<!-- The state of the store is changed with [actions](https://redux.js.org/basics/actions). Actions are objects, which have at least a field determining the <i>type</i> of the action.-->
 存储器的状态是通过[动作](https://redux.js.org/basics/actions)改变的。行动是对象，它至少有一个字段决定行动的<i>类型</i>。
<!-- Our application needs for example the following action:-->
 例如，我们的应用需要以下动作。

```js
{
  type: 'INCREMENT'
}
```

<!-- If there is data involved with the action, other fields can be declared as needed.  However, our counting app is so simple that the actions are fine with just the type field.-->
 如果行动中涉及到数据，可以根据需要声明其他字段。  然而，我们的计数应用非常简单，动作只需要类型字段就可以了。

<!-- The impact of the action to the state of the application is defined using a [reducer](https://redux.js.org/basics/reducers). In practice, a reducer is a function which is given the current state and an action as parameters. It <i>returns</i> a new state.-->
 动作对应用状态的影响是用一个[reducer](https://redux.js.org/basics/reducers)来定义的。在实践中，还原器是一个函数，它被赋予当前状态和一个动作作为参数。它<i>返回</i>一个新的状态。

<!-- Let's now define a reducer for our application:-->
 现在让我们为我们的应用定义一个还原器。

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

<!-- The first parameter is the <i>state</i> in the store. Reducer returns a <i>new state</i> based on the actions type.-->
 第一个参数是商店里的<i>状态</i>。还原器根据动作类型返回一个<i>新状态</i>。

<!-- Let's change the code a bit. It is customary to use the [switch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch) -command instead of ifs in a reducer.-->
 让我们改变一下代码。习惯上，在还原器中使用[switch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch) -命令而不是ifs。

<!-- Let's also define a [default value](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters) of 0 for the parameter <i>state</i>. Now the reducer works even if the store -state has not been primed yet.-->
 我们也为参数<i>state</i>定义一个[默认值](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters)为0。现在，即使商店的状态还没有被引出，还原器也能工作。

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

<!-- Reducer is never supposed to be called directly from the applications code. Reducer is only given as a parameter to the _createStore_-function which creates the store:-->
 Reducer不应该从应用代码中直接调用。还原器只是作为创建存储的_createStore_函数的一个参数。

```js
import { createStore } from 'redux'

const counterReducer = (state = 0, action) => {
  // ...
}

const store = createStore(counterReducer)
```

<!-- The store now uses the reducer to handle <i>actions</i>, which are <i>dispatched</i> or 'sent' to the store with its [dispatch](https://redux.js.org/api/store#dispatchaction)-method.-->
 存储器现在使用还原器来处理<i>操作</i>，这些操作被<i>分派</i>或"发送"到存储器的[dispatch](https://redux.js.org/api/store#dispatchaction)-方法。

```js
store.dispatch({type: 'INCREMENT'})
```


<!-- You can find out the state of the store using the method [getState](https://redux.js.org/api/store#getstate).-->
 你可以用[getState](https://redux.js.org/api/store#getstate)方法找出商店的状态。

<!-- For example the following code:-->
 例如，下面的代码。

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

<!-- would print the following to the console-->
会在控制台中打印以下内容

<pre>
0
3
-1
</pre>

<!-- because at first the state of the store is 0. After three <i>INCREMENT</i>-actions the state is 3. In the end, after <i>ZERO</i> and <i>DECREMENT</i> actions, the state is -1.-->
因为一开始商店的状态是0，经过三个<i>INCREMENT</i>动作后，状态是3。 最后，经过<i>ZERO</i>和<i>DECREMENT</i>动作，状态是-1。

<!-- The third important method the store has is [subscribe](https://redux.js.org/api/store#subscribelistener), which is used to create callback functions the store calls when its state is changed.-->
 存储器的第三个重要方法是[subscribe](https://redux.js.org/api/store#subscribelistener)，它被用来创建存储器在其状态改变时调用的回调函数。

<!-- If, for example, we would add the following function to subscribe, <i>every change in the store</i> would be printed to the console.-->
 例如，如果我们将添加以下函数到subscribe，<i>商店的每一个变化</i>将被打印到控制台。

```js
store.subscribe(() => {
  const storeNow = store.getState()
  console.log(storeNow)
})
```

<!-- so the code-->
所以代码

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

<!-- would cause the following to be printed-->
将导致以下内容被打印出来

<pre>
1
2
3
0
-1
</pre>

<!-- The code of our counter application is the following. All of the code has been written in the same file, so <i>store</i> is straight available for the React-code. We will get to know better ways to structure React/Redux-code later.-->
 我们的计数器应用的代码如下。所有的代码都写在同一个文件中，所以<i>store</i>对React代码来说是直接可用的。我们以后会了解到更好的结构React/Redux代码的方法。

```js
import React from 'react'
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
  ReactDOM.createRoot(document.getElementById('root')).render(<App />)
}

renderApp()
store.subscribe(renderApp)
```

<!-- There are a few notable things in the code.-->
代码中有几个值得注意的地方。
<i>App</i> renders the value of the counter by asking it from the store with the method _store.getState()_. The actionhandlers of the buttons <i>dispatch</i> the right actions to the store.

<!-- When the state in the store is changed, React is not able to automatically rerender the application. Thus we have registered a function _renderApp_, which renders the whole app, to listen for changes in the store with the  _store.subscribe_ method. Note that we have to immediately call the _renderApp_ method. Without the call the first rendering of the app would never happen.-->
当商店里的状态改变时，React不能自动重新渲染应用。因此，我们注册了一个函数_renderApp_，它渲染了整个应用，用_store.subscribe_方法来监听商店的变化。请注意，我们必须立即调用_renderApp_方法。没有这个调用，应用的第一次渲染就不会发生。

### Redux-notes

<!-- Our aim is to modify our note application to use Redux for state management. However, let's first cover a few key concepts through a simplified note application.-->
 我们的目的是修改我们的笔记应用，以使用Redux进行状态管理。然而，让我们先通过一个简化的笔记应用来介绍一些关键的概念。

<!-- The first version of our application is the following-->
 我们应用的第一个版本是这样的

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


<!-- So far the application does not have the functionality for adding new notes, although it is possible to do so by dispatching <i>NEW\_NOTE</i> actions.-->
 到目前为止，这个应用还没有添加新笔记的功能，尽管可以通过调度<i>NEW\_NOTE</i>动作来实现。

<!-- Now the actions have a type and a field <i>data</i>, which contains the note to be added:-->
现在行动有一个类型和一个字段<i>data</i>，它包含要添加的笔记。

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

<!-- The initial version of reducer is very simple:-->
 减速器的初始版本非常简单。

```js
const noteReducer = (state = [], action) => {
  if (action.type === 'NEW_NOTE') {
    state.push(action.data)
    return state
  }

  return state
}
```

<!-- The state is now an Array. <i>NEW\_NOTE</i>- type actions cause a new note to be added to the state with the [push](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push) method.-->
 现在的状态是一个数组。<i>NEW\_NOTE</i>-类型的动作导致一个新的笔记被添加到[push](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push)方法的状态。

<!-- The application seems to be working, but the reducer we have declared is bad. It breaks the [basic assumption](https://redux.js.org/tutorials/essentials/part-1-overview-concepts#reducers) of Redux reducer that reducers must be [pure functions](https://en.wikipedia.org/wiki/Pure_function).-->
 应用似乎在工作，但我们所声明的还原器是坏的。它打破了Redux减速器的[基本假设](https://redux.js.org/tutorials/essentials/part-1-overview-concepts#reducers)，即减速器必须是[纯函数](https://en.wikipedia.org/wiki/Pure_function)。

<!-- Pure functions are such, that they <i>do not cause any side effects</i> and they must always return the same response when called with the same parameters.-->
 纯函数是这样的，它们<i>不会引起任何副作用</i>，而且当用同样的参数调用时，它们必须总是返回同样的响应。

<!-- We added a new note to the state with the method _state.push(action.data)_ which <i>changes</i> the state of the state-object. This is not allowed. The problem is easily solved by using the [concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat) method, which creates a <i>new array</i>, which contains all the elements of the old array and the new element:-->
 我们用_state.push(action.data)_方法给状态添加了一个新的注释，该方法<i>改变了</i>状态对象的状态。这是不允许的。这个问题可以通过使用[concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat)方法轻松解决，该方法会创建一个<i>新数组</i>，其中包含旧数组的所有元素和新元素。

```js
const noteReducer = (state = [], action) => {
  if (action.type === 'NEW_NOTE') {
    return state.concat(action.data)
  }

  return state
}
```


<!-- A reducer state must be composed of [immutable](https://en.wikipedia.org/wiki/Immutable_object) objects. If there is a change in the state, the old object is not changed, but it is <i>replaced with a new, changed, object</i>. This is exactly what we did with the new reducer: the old array is replaced with the new.-->
 一个还原器的状态必须由[immutable](https://en.wikipedia.org/wiki/Immutable_object)对象组成。如果状态有变化，旧的对象不会被改变，但它会被一个新的、改变了的对象所取代</i>。这正是我们对新的还原器所做的：旧的数组被新的数组所取代。


<!-- Let's expand our reducer so that it can handle the change of a notes importance:-->
 让我们扩展我们的还原器，使其能够处理笔记重要性的变化。

```js
{
  type: 'TOGGLE_IMPORTANCE',
  data: {
    id: 2
  }
}
```


<!-- Since we do not have any code which uses this functionality yet, we are expanding the reducer in the 'test driven' way.-->
 由于我们还没有任何使用这个功能的代码，我们以"测试驱动"的方式来扩展减速器。
<!-- Let's start by creating a test for handling the action <i>NEW\_NOTE</i>.-->
 让我们先创建一个测试来处理<i>NEW\_NOTE</i>动作。


<!-- To make testing easier, we'll first move the reducer's code to its own module to file <i>src/reducers/noteReducer.js</i>. We'll also add the library [deep-freeze](https://www.npmjs.com/package/deep-freeze), which can be used to ensure that the reducer has been correctly defined as an immutable function.-->
 为了使测试更容易，我们首先将减速器的代码移到它自己的模块中，即文件<i>src/reducers/noteReducer.js</i>。我们还将添加库[deep-freeze](https://www.npmjs.com/package/deep-freeze)，它可以用来确保减速器被正确地定义为一个不可变的函数。
<!-- Let's install the library as a development dependency-->
 让我们把这个库作为开发依赖项来安装

```js
npm install --save-dev deep-freeze
```

<!-- The test, which we define in file <i>src/reducers/noteReducer.test.js</i>, has the following content:-->
 我们在文件<i>src/reducers/noteReducer.test.js</i>中定义的测试，有以下内容。

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

<!-- The <i>deepFreeze(state)</i> command ensures that the reducer does not change the state of the store given to it as a parameter. If the reducer uses the _push_ command to manipulate the state, the test will not pass-->
 <i>deepFreeze(state)</i> 命令确保了还原器不会改变作为参数给它的存储的状态。如果reducer使用_push_命令来操作状态，测试将不会通过

![](../../images/6/2.png)

<!-- Now we'll create a test for the <i>TOGGLE\_IMPORTANCE</i> action:-->
 现在我们要为<i>TOGGLE\_IMPORTANCE</i>动作创建一个测试。

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

<!-- So the following action-->
 所以下面的动作

```js
{
  type: 'TOGGLE_IMPORTANCE',
  data: {
    id: 2
  }
}
```

<!-- has to change the importance of the note with the id 2.-->
必须改变id为2的笔记的重要性。

<!-- The reducer is expanded as follows-->
 减速器的扩展如下

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

<!-- We create a copy of the note which importance has changed with the syntax [familiar from part 2](/en/part2/altering_data_in_server#changing-the-importance-of-notes), and replace the state with a new state containing all the notes which have not changed and the copy of the changed note <i>changedNote</i>.-->
 我们用[熟悉的第二章节](/en/part2/altering_data_in_server#changing-the-importance-of-notes)的语法创建一个重要性已经改变的笔记的副本，并用一个包含所有没有改变的笔记和改变的笔记<i>changedNote</i>的副本的新状态取代该状态。

<!-- Let's recap what goes on in the code. First, we search for a specific note object, the importance of which we want to change:-->
 让我们回顾一下代码中的内容。首先，我们搜索一个特定的笔记对象，我们想改变它的重要性。

```js
const noteToChange = state.find(n => n.id === id)
```

<!-- then we create a new object, which is a <i>copy</i> of the original note, only the value of the <i>important</i> field has been changed to the opposite of what it was:-->
 然后我们创建一个新的对象，它是原始笔记的<i>拷贝</i>，只是<i>重要</i>字段的值被改成了与原来相反的。

```js
const changedNote = {
  ...noteToChange,
  important: !noteToChange.important
}
```

<!-- A new state is then returned. We create it by taking all of the notes from the old state except for the desired note, which we replace with its slightly altered copy:-->
 然后一个新的状态被返回。我们通过从旧状态中提取所有的笔记来创建它，除了所需的笔记，我们用它的略微改动的副本来替换它。

```js
state.map(note =>
  note.id !== id ? note : changedNote
)
```

### Array spread syntax

<!-- Because we now have quite good tests for the reducer, we can refactor the code safely.-->
 因为我们现在对还原器有很好的测试，我们可以安全地重构代码。

<!-- Adding a new note creates the state it returns with Arrays _concat_-function. Let's take a look at how we can achieve the same by using the JavaScript [array spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator) -syntax:-->
 添加一个新的注释，用Arrays _concat_-function创建它返回的状态。让我们来看看我们如何通过使用JavaScript [array spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator) -语法来实现同样的效果。

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

<!-- The spread -syntax works as follows. If we declare-->
 传播-语法的工作原理如下。如果我们声明

```js
const numbers = [1, 2, 3]
```

<code>...numbers</code> breaks the array up into individual elements, which can be placed in another array.

```js
[...numbers, 4, 5]
```

<!-- and the result is an array `[1, 2, 3, 4, 5]`.-->
 结果是一个数组`[1, 2, 3, 4, 5]'。

<!-- If we would have placed the array to another array without the spread-->
 如果我们将这个数组放置在另一个数组中，而不使用spread

```js
[numbers, 4, 5]
```

<!-- the result would have been `[ [1, 2, 3], 4, 5]`.-->
结果会是`[[1, 2, 3], 4, 5]`。

<!-- When we take elements from an array by [destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment), a similar looking syntax is used to <i>gather</i> the rest of the elements:-->
 当我们通过[解构](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)从一个数组中取出元素时，一个看起来类似的语法被用来<i>收集</i>其余的元素。

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

<!-- Let's make a simplified version of the unicafe-exercise from part 1. Let's handle the state management with Redux.-->
 让我们做一个第一章节的unicafe练习的简化版。让我们用Redux来处理状态管理。

<!-- You can take the project from this repository https://github.com/fullstack-hy2020/unicafe-redux for the base of your project.-->
 你可以把这个仓库的项目 https://github.com/fullstack-hy2020/unicafe-redux ，作为你项目的基础。

<i>Start by removing the git-configuration of the cloned repository, and by installing dependencies</i>

```bash
cd unicafe-redux   // go to the directory of cloned repository
rm -rf .git
npm install
```

#### 6.1: unicafe revisited, step1

<!-- Before implementing the functionality of the UI, let's implement the functionality required by the store.-->
在实现用户界面的功能之前，让我们先实现商店所需的功能。

<!-- We have to save the number of each kind of feedback to the store, so the form of the state in the store is:-->
我们要把每种反馈的数量保存到商店里，所以商店里的状态的形式是。

```js
{
  good: 5,
  ok: 4,
  bad: 2
}
```

<!-- The project has the following base for a reducer:-->
 该项目有以下的还原器基础。

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

<!-- and a base for its tests-->
 及其测试的基础

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

<!-- **Implement the reducer and its tests.**-->
 **实现减速器和其测试**。

<!-- In the tests, make sure that the reducer is an <i>immutable function</i> with the <i>deep-freeze</i>-library.-->
 在测试中，确保减速器是一个使用<i>deep-freeze</i>-library的<i>immutable function</i>。
<!-- Ensure that the provided first test passes, because Redux expects that the reducer returns a sensible original state when it is called so that the first parameter <i>state</i>, which represents the previous state, is-->
 确保所提供的第一个测试通过，因为Redux期望还原器在被调用时返回一个合理的原始状态，这样代表先前状态的第一个参数<i>state</i>就是
<i>undefined</i>.

<!-- Start by expanding the reducer so that both tests pass. Then add the rest of the tests, and finally the functionality which they are testing.-->
 从扩展还原器开始，使两个测试都能通过。然后加入其余的测试，最后加入它们所测试的功能。

<!-- A good model for the reducer is the [redux-notes](/en/part6/flux_architecture_and_redux#pure-functions-immutable)-->
 一个好的还原器模型是[redux-notes](/en/part6/flux_architecture_and_redux#pure-function-immutable)
<!-- example above.-->
 上面的例子。

#### 6.2: unicafe revisited, step2

<!-- Now implement the actual functionality of the application.-->
 现在实现应用的实际功能。

<!-- Note that since all the code is in the file <i>index.js</i> and you might need to manually reload the page after each change since the automatic reloading of the browser content does not always work for that file!-->
 注意，由于所有的代码都在文件<i>index.js</i>中，而且你可能需要在每次改变后手动重新加载页面，因为浏览器内容的自动重载并不总是对该文件起作用!

</div>

<div class="content">

### Uncontrolled form

<!-- Let's add the functionality for adding new notes and changing their importance:-->
 让我们添加添加新笔记和改变其重要性的功能。

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

<!-- The implementation of both functionalities is straightforward. It is noteworthy that we <i>have not</i> bound the state of the form fields to the state of the <i>App</i> component like we have previously done. React calls this kind of form [uncontrolled](https://reactjs.org/docs/uncontrolled-components.html).-->
 这两个功能的实现都很简单。值得注意的是，我们没有像之前那样将表单字段的状态与<i>App</i>组件的状态绑定。React称这种表单为[uncontrolled](https://reactjs.org/docs/uncontrolled-components.html)。

<!-- >Uncontrolled forms have certain limitations (for example, dynamic error messages or disabling the submit button based on input are not possible). However they are suitable for our current needs.-->
 >不受控制的表单有一定的限制（例如，动态错误信息或根据输入禁用提交按钮是不可能的）。但是它们适合我们目前的需要。

<!-- You can read more about uncontrolled forms [here](https://goshakkk.name/controlled-vs-uncontrolled-inputs-react/).-->
 你可以阅读更多关于不受控制的表单[这里](https://goshakkk.name/controlled-vs-uncontrolled-inputs-react/)。


<!-- The method handling adding new notes is simple, it just dispatches the action for adding notes:-->
 处理添加新笔记的方法很简单，它只是分派添加笔记的动作。

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

<!-- We can get the content of the new note straight from the form field. Because the field has a name, we can access the content via the event object <i>event.target.note.value</i>.-->
 我们可以直接从表单字段中获取新注释的内容。因为这个字段有一个名字，我们可以通过事件对象<i>event.target.note.value</i>来访问其内容。

```js
<form onSubmit={addNote}>
  <input name="note" /> // highlight-line
  <button type="submit">add</button>
</form>
```


<!-- A note's importance can be changed by clicking its name. The event handler is very simple:-->
 一个笔记的重要性可以通过点击它的名字来改变。该事件处理程序非常简单。

```js
toggleImportance = (id) => {
  store.dispatch({
    type: 'TOGGLE_IMPORTANCE',
    data: { id }
  })
}
```
### Action creators

<!-- We begin to notice that, even in applications as simple as ours, using Redux can simplify the frontend code. However, we can do a lot better.-->
 我们开始注意到，即使在像我们这样简单的应用中，使用Redux可以简化前端的代码。然而，我们可以做得更好。

<!-- It is actually not necessary for React-components to know the Redux action types and forms.-->
 实际上，React组件没有必要知道Redux的动作类型和形式。
<!-- Let's separate creating actions into their own functions:-->
 让我们把创建动作分离到他们自己的函数中。

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

<!-- Functions that create actions are called [action creators](https://redux.js.org/advanced/async-actions#synchronous-action-creators).-->
 创建动作的函数被称为[动作创建者](https://redux.js.org/advanced/async-actions#synchronous-action-creators)。

<!-- The <i>App</i> component does not have to know anything about the inner representation of the actions anymore, it just gets the right action by calling the creator-function:-->
 <i>App</i>组件不必再知道任何关于动作的内部表示，它只是通过调用创建者函数来获得正确的动作。

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

<!-- Aside from the reducer, our application is in one file. This is of course not sensible, and we should separate <i>App</i> into its own module.-->
 除了还原器之外，我们的应用是在一个文件中。这当然是不理智的，我们应该把<i>App</i>分成自己的模块。

<!-- Now the question is, how can the <i>App</i> access the store after the move? And more broadly, when a component is composed of many smaller components, there must be a way for all of the components to access the store.-->
 现在的问题是，移动之后，<i>App</i>如何访问存储空间？而且更广泛地说，当一个组件由许多小的组件组成时，必须有一种方法让所有的组件都能访问存储空间。
<!-- There are multiple ways to share the redux-store with components. First we will look into the newest, and possibly the easiest way using the [hooks](https://react-redux.js.org/api/hooks)-api of the [react-redux](https://react-redux.js.org/) library.-->
有多种方法可以与组件共享redux-store。首先我们将研究最新的，也可能是最简单的方法，使用[react-redux](https://react-redux.js.org/)库的[hooks](https://react-redux.js.org/api/hooks)-api。

<!-- First we install react-redux-->
 首先我们安装 react-redux

```bash
npm install react-redux
```

<!-- Next we move the _App_ component into its own file _App.js_. Let's see how this affects the rest of the application files.-->
 接下来我们把_App_组件移到它自己的文件_App.js_中。让我们看看这对其他的应用文件有什么影响。

<!-- _index.js_ becomes:-->
 _index.js_变成。

```js
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'


import { createStore } from 'redux'
import { Provider } from 'react-redux' // highlight-line
import App from './App'
import noteReducer from './reducers/noteReducer'

const store = createStore(noteReducer)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>  // highlight-line
    <App />
  </Provider>,  // highlight-line
  document.getElementById('root')
)
```

<!-- Note, that the application is now defined as a child of a [Provider](https://react-redux.js.org/api/provider) -component provided by the react redux library.-->
 注意，应用现在被定义为由react redux库提供的[Provider](https://react-redux.js.org/api/provider)-组件的一个子组件。
<!-- The application's store is given to the Provider as its attribute <i>-->
 应用的存储被赋予给Provider，作为其属性<i></i>。
<!-- store</i>.-->
 store</i>。

<!-- Defining the action creators has been moved to the file <i>reducers/noteReducer.js</i> where the reducer is defined. File looks like this:-->
 定义动作创建者已被移到文件<i>reducers/noteReducer.js</i>，其中定义了还原器。文件如下所示：

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

<!-- If the application has many components which need the store, the <i>App</i>-component must pass <i>store</i> as props to all of those components.-->
 如果应用有许多需要存储的组件，<i>App</i>-组件必须将<i>store</i>作为prop传递给所有这些组件。

<!-- The module now has multiple [export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) commands.-->
 该模块现在有多个[export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export)命令。

<!-- The reducer function is still returned with the <i>export default</i> command, so the reducer can be imported the usual way:-->
 减速器函数仍然用<i>export default</i>命令返回，所以减速器可以用通常的方式被导入。

```js
import noteReducer from './reducers/noteReducer'
```

<!-- A module can have only <i>one default export</i>, but multiple "normal" exports-->
 一个模块只能有<i>一个默认导出</i>，但有多个 "正常 "导出

```js
export const createNote = (content) => {
  // ...
}

export const toggleImportanceOf = (id) => {
  // ...
}
```

<!-- Normally (not as defaults) exported functions can be imported with the curly brace syntax:-->
 通常（不是作为默认）导出的函数可以用大括号语法导入。

```js
import { createNote } from './../reducers/noteReducer'
```

<!-- Code for the <i>App</i> component-->
 <i>App</i>组件的代码</i>组件的代码

```js
import { createNote, toggleImportanceOf } from './reducers/noteReducer' // highlight-line
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

<!-- There are a few things to note in the code. Previously the code dispatched actions by calling the dispatch method of the redux-store:-->
 在代码中，有几件事需要注意。以前，代码通过调用redux-store的dispatch方法来分配动作。

```js
store.dispatch({
  type: 'TOGGLE_IMPORTANCE',
  data: { id }
})
```

<!-- Now it does it with the <i>dispatch</i>-function from the [useDispatch](https://react-redux.js.org/api/hooks#usedispatch) -hook.-->
 现在它通过[useDispatch](https://react-redux.js.org/api/hooks#usedispatch) -hook的<i>dispatch</i>-函数来做。

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

<!-- The <i>useDispatch</i>-hook provides any React component access to the dispatch-function of the redux-store defined in <i>index.js</i>.-->
 <i>useDispatch</i>-hook为任何React组件提供了对<i>index.js</i>中定义的redux-store的dispatch-function的访问。
<!-- This allows all components to make changes to the state of the redux-store.-->
 这允许所有组件对redux-store的状态进行更改。

<!-- The component can access the notes stored in the store with the [useSelector](https://react-redux.js.org/api/hooks#useselector)-hook of the react-redux library.-->
 组件可以通过react-redux库的[useSelector](https://react-redux.js.org/api/hooks#useselector)-hook访问存储在商店中的笔记。


```js
import { useSelector, useDispatch } from 'react-redux'  // highlight-line

const App = () => {
  // ...
  const notes = useSelector(state => state)  // highlight-line
  // ...
}
```

<i>useSelector</i> receives a function as a parameter. The function either searches for or selects data from the redux-store.
<!-- Here we need all of the notes, so our selector function returns the whole state:-->
 这里我们需要所有的笔记，所以我们的选择器函数返回整个状态。


```js
state => state
```

<!-- which is a shorthand for-->
这是对以下内容的简写

```js
(state) => {
  return state
}
```

<!-- Usually selector functions are a bit more interesting, and return only selected parts of the contents of the redux-store.-->
 通常选择器函数会更有趣一些，它只返回redux-store内容中的选定部分。
<!-- We could for example return only notes marked as important:-->
 例如，我们可以只返回标记为重要的笔记。

```js
const importantNotes = useSelector(state => state.filter(note => note.important))
```

### More components

<!-- Let's separate creating a new note into its own component.-->
 让我们把创建一个新的笔记分离成自己的组件。

```js
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

<!-- Unlike in the React code we did without Redux, the event handler for changing the state of the app (which now lives in Redux) has been moved away from the <i>App</i> to a child component. The logic for changing the state in Redux is still neatly separated from the whole React part of the application.-->
 与我们不使用Redux的React代码不同，改变应用状态的事件处理程序（现在住在Redux中）已经从<i>App</i>移到了一个子组件。Redux中改变状态的逻辑仍然与整个应用的React部分整齐地分开。

<!-- We'll also separate the list of notes and displaying a single note into their own components (which will both be placed in the <i>Notes.js</i> file ):-->
 我们还将把笔记列表和显示单个笔记分离成各自的组件（这两个组件都将被放在<i>Notes.js</i>文件中）。

```js
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

<!-- The logic for changing the importance of a note is now in the component managing the list of notes.-->
 改变一个笔记的重要性的逻辑现在在管理笔记列表的组件中。

<!-- There is not much code left in <i>App</i>:-->
在<i>App</i>中已经没有多少代码了。

```js
const App = () => {

  return (
    <div>
      <NewNote />
      <Notes />
    </div>
  )
}
```

<i>Note</i>, responsible for rendering a single note, is very simple, and is not aware that the event handler it gets as props dispatches an action. These kind of components are called [presentational](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) in React terminology.

<i>Notes</i>, on the other hand, is a [container](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) component, as it contains some application logic: it defines what the event handlers of the <i>Note</i> components do and coordinates the configuration of <i>presentational</i> components, that is, the <i>Note</i>s.

<!-- We will return to the presentational/container division later in this part.-->
 我们将在本章节的后面回到渲染/容器的划分。

<!-- The code of the Redux application can be found on [Github](https://github.com/fullstack-hy2020/redux-notes/tree/part6-1), branch <i>part6-1</i>.-->
 Redux应用的代码可以在[Github](https://github.com/fullstack-hy2020/redux-notes/tree/part6-1)找到，分支<i>part6-1</i>。

</div>

<div class="tasks">

### Exercises 6.3.-6.8.

<!-- Let's make a new version of the anecdote voting application from part 1. Take the project from this repository https://github.com/fullstack-hy2020/redux-anecdotes to base your solution on.-->
 让我们为第一章节中的名言警句投票应用制作一个新版本。从这个仓库中获取项目 https://github.com/fullstack-hy2020/redux-anecdotes ，作为你的解决方案的基础。

<!-- If you clone the project into an existing git-repository, <i>remove the git-configuration of the cloned application:</i>-->
 如果你把项目克隆到一个现有的git-repository中，<i>删除克隆的应用的git-configuration：</i>。

```bash
cd redux-anecdotes  // go to the cloned repository
rm -rf .git
```

<!-- The application can be started as usual, but you have to install the dependencies first:-->
 应用可以像往常一样启动，但你必须先安装依赖性。

```bash
npm install
npm start
```

<!-- After completing these exercises, your application should look like this:-->
 完成这些练习后，你的应用应该是这样的。

![](../../images/6/3.png)

#### 6.3: anecdotes, step1

<!-- Implement the functionality for voting anecdotes. The amount of votes must be saved to a Redux-store.-->
 实现投票名言警句的功能。投票的数量必须被保存到Redux-store中。

#### 6.4: anecdotes, step2

<!-- Implement the functionality for adding new anecdotes.-->
 实现添加新名言警句的功能。

<!-- You can keep the form uncontrolled, like we did [earlier](/en/part6/flux_architecture_and_redux#uncontrolled-form).-->
 你可以保持表单不受控制，就像我们[之前]做的那样(/en/part6/flux_architecture_and_redux#uncontrolled-form)。

#### 6.5: anecdotes, step3

<!-- Make sure that the anecdotes are ordered by the number of votes.-->
 确保名言警句是按投票数排序的。

#### 6.6: anecdotes, step4

<!-- If you haven't done so already, separate the creation of action-objects to [action creator](https://read.reduxbook.com/markdown/part1/04-action-creators.html)-functions and place them in the <i>src/reducers/anecdoteReducer.js</i> file, so do like we have been doing since the chapter [action creators](/en/part6/flux_architecture_and_redux#action-creators).-->
 如果你还没有这样做，把行动对象的创建分离到[行动创造者](https://read.reduxbook.com/markdown/part1/04-action-creators.html)函数中，并把它们放在<i>src/reducers/anecdoteReducer.js</i>文件中，这样做就像我们从[行动创造者](/en/part6/flux_architecture_and_redux#action-creators)这一章中一直做的。

#### 6.7: anecdotes, step5

<!-- Separate the creation of new anecdotes into its own component called <i>AnecdoteForm</i>. Move all logic for creating a new anecdote into this new component.-->
 将创建新的名言警句分离到自己的组件中，称为<i>AnecdoteForm</i>。将所有创建新名言警句的逻辑移到这个新组件中。

#### 6.8: anecdotes, step6

<!-- Separate the rendering of the anecdote list into its own component called <i>AnecdoteList</i>. Move all logic related to voting for an anecdote to this new component.-->
 将名言警句列表的渲染分离到自己的组件中，称为<i>AnecdoteList</i>。将所有与投票给名言警句有关的逻辑移到这个新组件中。

<!-- Now the <i>App</i> component should look like this:-->
 现在，<i>App</i>组件应该如下所示：

```js
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'

const App = () => {
  return (
    <div>
      <h2>Anecdotes</h2>
      <AnecdoteForm />
      <AnecdoteList />
    </div>
  )
}

export default App
```
</div>
