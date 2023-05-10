---
mainImage: ../../../images/part-6.svg
part: 6
letter: a
lang: zh
---

<div class="content">

<!-- So far, we have followed the state management conventions recommended by React. We have placed the state and the functions for handling it in [higher level](https://reactjs.org/docs/lifting-state-up.html) of the component structure of the application. Quite often most of the app state and state altering functions reside directly in the root component. The state and its handler methods have then been passed to other components with props. This works up to a certain point, but when applications grow larger, state management becomes challenging.-->
到目前为止，我们已经遵循了React推荐的状态管理约定。我们将状态和处理它的函数放在应用组件结构的[更高级别](https://reactjs.org/docs/lifting-state-up.html)中。通常，大部分应用状态和状态改变函数直接位于根组件中。然后将状态及其处理方法传递给其他组件。这在一定程度上可行，但是当应用程序变得越来越大时，状态管理就变得具有挑战性。

### Flux-architecture

<!-- Already years ago Facebook developed the [Flux](https://facebook.github.io/flux/docs/in-depth-overview/)-architecture to make state management of React apps easier. In Flux, the state is separated from the React components and into its own <i>stores</i>.-->
已经有多年，Facebook开发了[Flux](https://facebook.github.io/flux/docs/in-depth-overview/)架构，以便更容易地管理React应用的状态。在Flux中，状态与React组件分离，进入其自己的<i>存储</i>中。
<!-- State in the store is not changed directly, but with different <i>actions</i>.-->
商店的状态不能直接改变，而是要通过不同的<i>行动</i>。

<!-- When an action changes the state of the store, the views are rerendered:-->
当一个动作改变了存储的状态时，视图将被重新渲染：

![diagram action->dispatcher->store->view](../../images/6/flux1.png)

<!-- If some action on the application, for example pushing a button, causes the need to change the state, the change is made with an action.-->
如果应用上的某些操作，比如按下按钮，导致需要改变状态，则需要采取行动来实现这种改变。
<!-- This causes re-rendering the view again:-->
这导致了视图的再次渲染：

![same diagram as above but with action looping back](../../images/6/flux2.png)

<!-- Flux offers a standard way for how and where the application''s state is kept and how it is modified.-->
Flux 提供一种标准的方式来维护应用状态，以及如何修改它。

### Redux

<!-- Facebook has an implementation for Flux, but we will be using the [Redux](https://redux.js.org) - library. It works with the same principle but is a bit simpler. Facebook also uses Redux now instead of their original Flux.-->
Facebook有一个Flux的实现，但我们将使用[Redux](https://redux.js.org)库。它遵循相同的原理，但更简单。Facebook现在也使用Redux而不是他们最初的Flux。

<!-- We will get to know Redux by implementing a counter application yet again:-->
# 我们将再次通过实现计数器应用程序来了解Redux：

![browser counter application](../../images/6/1.png)

<!-- Create a new create-react-app-application and install </i>redux</i> with the command-->
在命令行中使用 `create-react-app` 创建新的 React 应用，并使用 `npm install redux` 命令安装 `redux`。

```bash
npm install redux
```

<!-- As in Flux, in Redux the state is also stored in a [store](https://redux.js.org/basics/store).-->
在Redux中，状态也存储在[存储库](https://redux.js.org/basics/store)中，就像Flux一样。

<!-- The whole state of the application is stored in <i>one</i> JavaScript object in the store. Because our application only needs the value of the counter, we will save it straight to the store. If the state was more complicated, different things in the state would be saved as separate fields of the object.-->
整个应用程序的状态都存储在存储中的<i>一个</i>JavaScript对象中。因为我们的应用程序只需要计数器的值，所以我们会直接保存到存储中。如果状态更复杂，状态中的不同内容将作为对象的单独字段保存。

<!-- The state of the store is changed with [actions](https://redux.js.org/basics/actions). Actions are objects, which have at least a field determining the <i>type</i> of the action.-->
商店的状态随着[行动](https://redux.js.org/basics/actions)而改变。行动是对象，至少有一个字段来确定行动的<i>类型</i>。
<!-- Our application needs for example the following action:-->
我们的应用程序需要以下动作，例如：

```js
{
  type: 'INCREMENT'
}
```

<!-- If there is data involved with the action, other fields can be declared as needed.  However, our counting app is so simple that the actions are fine with just the type field.-->
如果行动涉及数据，可以根据需要声明其他字段。然而，我们的计数应用程序非常简单，只需要类型字段即可完成行动。

<!-- The impact of the action to the state of the application is defined using a [reducer](https://redux.js.org/basics/reducers). In practice, a reducer is a function that is given the current state and an action as parameters. It <i>returns</i> a new state.-->
行动对应用状态的影响是通过[reducer](https://redux.js.org/basics/reducers)来定义的。实际上，reducer是一个函数，它接收当前状态和操作作为参数。它<i>返回</i>一个新的状态。

<!-- Let''s now define a reducer for our application:-->
让我们现在为我们的应用程序定义一个reducer：

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

<!-- The first parameter is the <i>state</i> in the store. The reducer returns a <i>new state</i> based on the _action_ type. So, e.g. when the type of Action is <i>INCREMENT</i>, the state gets the old value plus one. If the type of Action is <i>ZERO</i> the new value of state is zero.-->
第一个参数是存储中的<i>状态</i>。 Reducer根据_action_类型返回<i>新状态</i>。 因此，例如，当Action的类型为<i>INCREMENT</i>时，状态将获得旧值加1。 如果Action的类型为<i>ZERO</i>，则state的新值为零。

<!-- Let''s change the code a bit. We have used if-else statements to respond to an action and change the state. However, the [switch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch) statement is the most common approach to writing a reducer.-->
让我们改变一下代码。我们已经使用 if-else 语句来响应一个动作并改变状态。然而，[switch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch) 语句是编写 reducer 的最常见方法。

<!-- Let''s also define a [default value](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters) of 0 for the parameter <i>state</i>. Now the reducer works even if the store state has not been primed yet.-->
让我们为参数<i>state</i>定义一个[默认值](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters)为0。现在，即使存储状态尚未初始化，也可以正常工作。

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

<!-- Reducer is never supposed to be called directly from the application''s code. Reducer is only given as a parameter to the _createStore_-function which creates the store:-->
Reducer绝不应该直接从应用程序的代码中调用。Reducer只是作为一个参数给_createStore_-函数，该函数创建存储：

```js
import { createStore } from 'redux'

const counterReducer = (state = 0, action) => {
  // ...
}

const store = createStore(counterReducer)
```

<!-- The store now uses the reducer to handle <i>actions</i>, which are <i>dispatched</i> or 'sent' to the store with its [dispatch](https://redux.js.org/api/store#dispatchaction) method.-->
商店现在使用reducer来处理<i>actions</i>，它们被<i>dispatched</i>或者用store的[dispatch](https://redux.js.org/api/store#dispatchaction)方法发送到store。

```js
store.dispatch({ type: 'INCREMENT' })
```

<!-- You can find out the state of the store using the method [getState](https://redux.js.org/api/store#getstate).-->
你可以使用[getState](https://redux.js.org/api/store#getstate)方法来查看商店的状态。

<!-- For example the following code:-->
例如下面的代码：

```js
const store = createStore(counterReducer)
console.log(store.getState())
store.dispatch({ type: 'INCREMENT' })
store.dispatch({ type: 'INCREMENT' })
store.dispatch({ type: 'INCREMENT' })
console.log(store.getState())
store.dispatch({ type: 'ZERO' })
store.dispatch({ type: 'DECREMENT' })
console.log(store.getState())
```

<!-- would print the following to the console-->
输出以下内容到控制台：

<pre>
0
3
-1
</pre>

<!-- because at first, the state of the store is 0. After three <i>INCREMENT</i>-actions the state is 3. In the end, after <i>ZERO</i> and <i>DECREMENT</i> actions, the state is -1.-->
因为一开始，商店的状态是0。经过三次<i>增加</i>操作后，状态为3。最后，经过<i>零</i>和<i>减少</i>操作后，状态为-1。

<!-- The third important method the store has is [subscribe](https://redux.js.org/api/store#subscribelistener), which is used to create callback functions the store calls whenever an action is dispatched to the store.-->
第三种重要的方法是[订阅](https://redux.js.org/api/store#subscribelistener)，它用于创建回调函数，每当发送一个动作到商店时，商店就会调用该函数。

<!-- If, for example, we would add the following function to subscribe, <i>every change in the store</i> would be printed to the console.-->
如果我们为订阅添加以下功能，比如<i>每次商店变化</i>，将会打印到控制台。

```js
store.subscribe(() => {
  const storeNow = store.getState()
  console.log(storeNow)
})
```

<!-- so the code-->
is

所以代码是：

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
这将会导致以下内容被打印出来。

<pre>
1
2
3
0
-1
</pre>

<!-- The code of our counter application is the following. All of the code has been written in the same file (_index.js_), so <i>store</i> is straight available for the React code. We will get to know better ways to structure React/Redux code later.-->
以下是我們計數器應用程式的代碼。所有代碼都寫在同一個文件（_index.js_）中，因此<i>商店</i>對於React代碼直接可用。稍後我們將更好地了解如何結構React/Redux代碼。

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

const root = ReactDOM.createRoot(document.getElementById('root'))

const renderApp = () => {
  root.render(<App />)
}

renderApp()
store.subscribe(renderApp)
```

<!-- There are a few notable things in the code.-->
在代码中有几个值得注意的事情。
<i>App</i> renders the value of the counter by asking it from the store with the method _store.getState()_. The action handlers of the buttons <i>dispatch</i> the right actions to the store.

<!-- When the state in the store is changed, React is not able to automatically rerender the application. Thus we have registered a function _renderApp_, which renders the whole app, to listen for changes in the store with the _store.subscribe_ method. Note that we have to immediately call the _renderApp_ method. Without the call, the first rendering of the app would never happen.-->
当商店中的状态发生改变时，React无法自动重新渲染应用程序。因此，我们已经注册了一个函数_renderApp_，它渲染整个应用程序，以便使用_store.subscribe_方法监听存储中的更改。请注意，我们必须立即调用_renderApp_方法。没有调用，应用程序的第一次渲染将永远不会发生。

### A note about the use of createStore

<!-- The most observant will notice that the name of the function createStore is overlined. If you move the mouse over the name, an explanation will appear-->
.

最细心的人会注意到函数名createStore被加上了下划线。如果你将鼠标移动到函数名上，会出现一个解释。

![vscode error showing createStore deprecated and to use configureStore](../../images/6/30new.png)

<!-- The full explanation is as follows-->
以下是完整的解释：

<!-- ><i>We recommend using the configureStore method of the @reduxjs/toolkit package, which replaces createStore.</i>-->
><i>我们推荐使用@reduxjs/toolkit包的configureStore方法，它取代了createStore。</i>
<!-- >-->
**I like to travel**

**我喜欢旅行**
<!-- ><i>Redux Toolkit is our recommended approach for writing Redux logic today, including store setup, reducers, data fetching, and more.</i>-->
><i>Redux Toolkit 是我们今天推荐的编写 Redux 逻辑的方法，包括存储设置、reducer、数据获取等等。</i>
<!-- >-->
I like to play basketball

>我喜欢打篮球
<!-- ><i>For more details, please read this Redux docs page: <https://redux.js.org/introduction/why-rtk-is-redux-today></i>-->
> <i>要了解更多细节，请阅读本文Redux文档页面：<https://redux.js.org/introduction/why-rtk-is-redux-today></i>
<!-- >-->
I like to travel

我喜欢旅行
<!-- ><i>configureStore from Redux Toolkit is an improved version of createStore that simplifies setup and helps avoid common bugs.</i>-->
>\<i>Redux Toolkit 的 configureStore 是 createStore 的改进版本，可以简化设置并帮助避免常见错误。\</i>
<!-- >-->
I am a student

我是一名学生。
<!-- ><i>You should not be using the redux core package by itself today, except for learning purposes. The createStore method from the core redux package will not be removed, but we encourage all users to migrate to using Redux Toolkit for all Redux code.</i>-->
> <i>你今天不应该单独使用 Redux Core 包，除了用于学习之外。来自 Redux Core 包的 createStore 方法不会被移除，但我们鼓励所有用户迁移到使用 Redux Toolkit 来编写所有的 Redux 代码。</i>

<!-- So, instead of the function <i>createStore</i>, it is recommended to use the slightly more "advanced" function <i>configureStore</i>, and we will also use it when we have taken over the basic functionality of Redux.-->
所以，建议使用稍微更"高级"的函数<i>configureStore</i>，而不是<i>createStore</i>，当我们接管Redux的基本功能时，也将使用它。

<!-- Side note: <i>createStore</i> is defined as "deprecated", which usually means that the feature will be removed in some newer version of the library. The explanation above and the discussion of [this one](https://stackoverflow.com/questions/71944111/redux-createstore-is-deprecated-cannot-get-state-from-getstate-in-redux-ac) reveal that <i> createStore</i> will not be removed, and it has been given the status <i>deprecated</i>, perhaps with slightly incorrect reasons. So the function is not obsolete, but today there is a more preferable, new way to do almost the same thing.-->
注：<i>createStore</i>被定义为“已弃用”，通常意味着该功能将在库的某个更新版本中被移除。上述解释和[此处](https://stackoverflow.com/questions/71944111/redux-createstore-is-deprecated-cannot-get-state-from-getstate-in-redux-ac)的讨论表明，<i>createStore</i>不会被移除，而是被赋予了“已弃用”的状态，也许是出于略微不正确的原因。因此，该函数并非废弃，但如今有一种更可取的新方法可以做几乎相同的事情。

### Redux-notes

<!-- We aim to modify our note application to use Redux for state management. However, let''s first cover a few key concepts through a simplified note application.-->
我们的目标是修改我们的笔记应用程序以使用Redux进行状态管理。但是，让我们首先通过一个简化的笔记应用程序来涵盖一些关键概念。

<!-- The first version of our application is the following-->
第一个版本的我们的应用程序如下。

```js
const noteReducer = (state = [], action) => {
  if (action.type === 'NEW_NOTE') {
    state.push(action.payload)
    return state
  }

  return state
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
迄今为止，应用程序尚不具备添加新笔记的功能，尽管可以通过调度<i>NEW\_NOTE</i>操作来实现这一点。

<!-- Now the actions have a type and a field <i>payload</i>, which contains the note to be added:-->
现在行动有一个类型和一个字段<i>payload</i>，其中包含要添加的笔记：

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

<!-- The choice of the field name is not random. The general convention is that actions have exactly two fields, <i>type</i> telling the type and <i>payload</i> containing the data included with the Action.-->
选择字段名称并非随意。一般惯例是，动作有两个字段，<i>类型</i>告知类型，<i>有效载荷</i>包含与动作一起传递的数据。

### Pure functions, immutable

<!-- The initial version of the reducer is very simple:-->
初始版本的 reducer 非常简单：

```js
const noteReducer = (state = [], action) => {
  if (action.type === 'NEW_NOTE') {
    state.push(action.payload)
    return state
  }

  return state
}
```

<!-- The state is now an Array. <i>NEW\_NOTE</i>-type actions cause a new note to be added to the state with the [push](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push) method.-->
现在，状态是一个数组。<i>NEW\_NOTE</i>-类型的操作会使用[push](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push)方法将新的笔记添加到状态中。

<!-- The application seems to be working, but the reducer we have declared is bad. It breaks the [basic assumption](https://redux.js.org/tutorials/essentials/part-1-overview-concepts#reducers) of Redux reducer that reducers must be [pure functions](https://en.wikipedia.org/wiki/Pure_function).-->
应用似乎正在运行，但我们声明的 reducer 却很糟糕。它打破了 Redux reducer 的[基本假设](https://redux.js.org/tutorials/essentials/part-1-overview-concepts#reducers)，即 reducers 必须是[纯函数](https://en.wikipedia.org/wiki/Pure_function)。

<!-- Pure functions are such, that they <i>do not cause any side effects</i> and they must always return the same response when called with the same parameters.-->
纯函数就是这样，它们<i>不会导致任何副作用</i>，并且在使用相同参数调用时，总是返回相同的响应。

<!-- We added a new note to the state with the method _state.push(action.payload)_ which <i>changes</i> the state of the state-object. This is not allowed. The problem is easily solved by using the [concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat) method, which creates a <i>new array</i>, which contains all the elements of the old array and the new element:-->
我们用_state.push(action.payload)_方法向状态中添加了一个新的注释，这会<i>改变</i>状态对象的状态。这是不允许的。该问题很容易通过使用[concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat)方法来解决，它创建一个<i>新的数组</i>，其中包含旧数组中的所有元素和新元素：

```js
const noteReducer = (state = [], action) => {
  if (action.type === 'NEW_NOTE') {
    return state.concat(action.payload)
  }

  return state
}
```

<!-- A reducer state must be composed of [immutable](https://en.wikipedia.org/wiki/Immutable_object) objects. If there is a change in the state, the old object is not changed, but it is <i>replaced with a new, changed, object</i>. This is exactly what we did with the new reducer: the old array is replaced with the new one.-->
一个 reducer 状态必须由[不可变](https://en.wikipedia.org/wiki/Immutable_object)对象组成。如果状态发生变化，旧对象不会被改变，而是<i>被新的、改变过的对象取代</i>。这正是我们在新 reducer 中所做的：旧数组被新的数组取代了。

<!-- Let's expand our reducer so that it can handle the change of a note's importance:-->
让我们扩展我们的 reducer 以便它能够处理一个笔记重要性的变化：

```js
{
  type: 'TOGGLE_IMPORTANCE',
  payload: {
    id: 2
  }
}
```

<!-- Since we do not have any code which uses this functionality yet, we are expanding the reducer in the 'test-driven' way.-->
由于我们还没有任何使用这个功能的代码，我们正在以'测试驱动'的方式扩展 reducer。
<!-- Let''s start by creating a test for handling the action <i>NEW\_NOTE</i>.-->
让我们从创建一个处理动作<i>NEW\_NOTE</i>的测试开始。

<!-- To make testing easier, we'll first move the reducer's code to its own module to file <i>src/reducers/noteReducer.js</i>. We''ll also add the library [deep-freeze](https://www.npmjs.com/package/deep-freeze), which can be used to ensure that the reducer has been correctly defined as an immutable function.-->
为了使测试更容易，我们首先将reducer的代码移动到自己的模块<i>src/reducers/noteReducer.js</i>中。我们还将添加库[deep-freeze](https://www.npmjs.com/package/deep-freeze)，它可以用来确保reducer已被正确定义为不可变函数。
<!-- Let''s install the library as a development dependency-->
让我们将这个库作为开发依赖安装吧

```js
npm install --save-dev deep-freeze
```

<!-- The test, which we define in file <i>src/reducers/noteReducer.test.js</i>, has the following content:-->
测试，我们在文件<i>src/reducers/noteReducer.test.js</i>中定义，具有以下内容：

```js
import noteReducer from './noteReducer'
import deepFreeze from 'deep-freeze'

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

<!-- The <i>deepFreeze(state)</i> command ensures that the reducer does not change the state of the store given to it as a parameter. If the reducer uses the _push_ command to manipulate the state, the test will not pass-->
.

<i>deepFreeze(state)</i> 命令确保 reducer 不会改变作为参数传入的 store 的状态。如果 reducer 使用 _push_ 命令来操作状态，测试将不会通过。

![terminal showing test failure and error about not using array.push](../../images/6/2.png)

<!-- Now we''ll create a test for the <i>TOGGLE\_IMPORTANCE</i> action:-->
现在我们来为<i>TOGGLE\_IMPORTANCE</i>动作创建一个测试：

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

<!-- So the following action-->
is required

因此，需要采取以下行动。

```js
{
  type: 'TOGGLE_IMPORTANCE',
  payload: {
    id: 2
  }
}
```

<!-- has to change the importance of the note with the id 2.-->
需要更改ID为2的笔记的重要性。

<!-- The reducer is expanded as follows-->
`reducer`被展开如下：

```js
const noteReducer = (state = [], action) => {
  switch(action.type) {
    case 'NEW_NOTE':
      return state.concat(action.payload)
    case 'TOGGLE_IMPORTANCE': {
      const id = action.payload.id
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

<!-- We create a copy of the note whose importance has changed with the syntax [familiar from part 2](/en/part2/altering_data_in_server#changing-the-importance-of-notes), and replace the state with a new state containing all the notes which have not changed and the copy of the changed note <i>changedNote</i>.-->
我们用从第二部分熟悉的语法[familiar from part 2](/en/part2/altering_data_in_server#changing-the-importance-of-notes)创建一个重要性已经改变的笔记的副本，并用一个新的状态替换原来的状态，其中包括所有没有改变的笔记和改变后的笔记副本<i>changedNote</i>。

<!-- Let''s recap what goes on in the code. First, we search for a specific note object, the importance of which we want to change:-->
让我们回顾一下代码中发生了什么。首先，我们搜索一个特定的笔记对象，其重要性我们想要改变：

```js
const noteToChange = state.find(n => n.id === id)
```

<!-- then we create a new object, which is a <i>copy</i> of the original note, only the value of the <i>important</i> field has been changed to the opposite of what it was:-->
然后我们创建一个新的对象，它是原始note的<i>副本</i>，只有<i>重要</i>字段的值被改变为与原来相反的值：

```js
const changedNote = {
  ...noteToChange,
  important: !noteToChange.important
}
```

<!-- A new state is then returned. We create it by taking all of the notes from the old state except for the desired note, which we replace with its slightly altered copy:-->
我们通过从旧状态中取出所有的笔记，除了所需的笔记，用稍微改变的副本替换它们，然后返回一个新的状态：

```js
state.map(note =>
  note.id !== id ? note : changedNote
)
```

### Array spread syntax

<!-- Because we now have quite good tests for the reducer, we can refactor the code safely.-->
因为我们现在有很好的reducer测试，所以我们可以安全地重构代码。

<!-- Adding a new note creates the state it returns with Array's _concat_ function. Let's take a look at how we can achieve the same by using the JavaScript [array spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator) -syntax:-->
加入一个新的笔记，可以使用数组的_concat_函数来创建它返回的状态。让我们看看如何使用JavaScript [数组展开](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator) 语法来实现同样的功能：

```js
const noteReducer = (state = [], action) => {
  switch(action.type) {
    case 'NEW_NOTE':
      return [...state, action.payload]
    case 'TOGGLE_IMPORTANCE':
      // ...
    default:
    return state
  }
}
```

<!-- The spread -syntax works as follows. If we declare-->
a variable

spread-语法如下：如果我们声明一个变量

```js
const numbers = [1, 2, 3]
```

<code>...numbers</code> breaks the array up into individual elements, which can be placed in another array.

```js
[...numbers, 4, 5]
```

<!-- and the result is an array <i>[1, 2, 3, 4, 5]</i>.-->
结果是一个数组<i>[1, 2, 3, 4, 5]</i>。

<!-- If we would have placed the array to another array without the spread-->
syntax, it would have been a difficult task

如果我们没有使用扩展语法将数组放到另一个数组中，那将会是一项困难的任务。

```js
[numbers, 4, 5]
```

<!-- the result would have been <i>[ [1, 2, 3], 4, 5]</i>.-->
<i>[[1, 2, 3], 4, 5]]</i> 的结果是。

<!-- When we take elements from an array by [destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment), a similar-looking syntax is used to <i>gather</i> the rest of the elements:-->
当我们从数组中通过[解构](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)取出元素时，类似的语法也可以用来<i>收集</i>剩余的元素：

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

<!-- Let's make a simplified version of the unicafe exercise from part 1. Let's handle the state management with Redux.-->
让我们从第一部分简化unicafe练习。让我们用Redux来处理状态管理。

<!-- You can take the project from this repository <https://github.com/fullstack-hy2020/unicafe-redux> for the base of your project.-->
你可以从这个仓库<https://github.com/fullstack-hy2020/unicafe-redux>获取项目作为你项目的基础。

<i>Start by removing the git configuration of the cloned repository, and by installing dependencies</i>

```bash
cd unicafe-redux   // go to the directory of cloned repository
rm -rf .git
npm install
```

#### 6.1: unicafe revisited, step1

<!-- Before implementing the functionality of the UI, let''s implement the functionality required by the store.-->
在实现UI的功能之前，让我们先实现商店所需的功能。

<!-- We have to save the number of each kind of feedback to the store, so the form of the state in the store is:-->
我们必须保存每种反馈到商店的数量，因此商店的状态形式为：

```js
{
  good: 5,
  ok: 4,
  bad: 2
}
```

<!-- The project has the following base for a reducer:-->
项目具有以下基础作为减速器：

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
    default: return state
  }

}

export default counterReducer
```

<!-- and a base for its tests-->
苹果公司在全球范围内拥有大量的测试环境，以及它们测试的基础。

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
**实施reducer及其测试。**

<!-- In the tests, make sure that the reducer is an <i>immutable function</i> with the <i>deep-freeze</i> library.-->
在测试中，确保 reducer 是一个用 <i>deep-freeze</i> 库的 <i>不可变函数</i>。
<!-- Ensure that the provided first test passes, because Redux expects that the reducer returns a sensible original state when it is called so that the first parameter <i>state</i>, which represents the previous state, is-->
<i>undefined</i>.

确保提供的第一个测试通过，因为Redux期望当它被调用时，Reducer返回一个合理的原始状态，因此第一个参数<i>state</i>，代表之前的状态，是<i>undefined</i>。
<i>undefined</i>.

<!-- Start by expanding the reducer so that both tests pass. Then add the rest of the tests, and finally the functionality that they are testing.-->
开始先扩展 reducer 以让两个测试都通过，然后添加其余的测试，最后再添加它们正在测试的功能。

<!-- A good model for the reducer is the [redux-notes](/en/part6/flux_architecture_and_redux#pure-functions-immutable)-->
一个好的 reducer 模型是 [redux-notes](/zh-cn/part6/flux_architecture_and_redux#pure-functions-immutable)
<!-- example above.-->
# 这是一个例子

# 这是一个挑战
挑战自我，改变未来。

#### 6.2: unicafe revisited, step2

<!-- Now implement the actual functionality of the application.-->
现在实现应用程序的实际功能。

<!-- Your application can have a modest appearance, nothing else is needed but buttons and the number of reviews for each type:-->
你的应用程序可以有一个适度的外观，除了按钮和每种类型的评论数量之外，不需要其他任何东西：

![browser showing good bad ok buttons](../../images/6/50new.png)

</div>

<div class="content">

### Uncontrolled form

<!-- Let''s add the functionality for adding new notes and changing their importance:-->
让我们添加添加新笔记和更改它们的重要性的功能：

```js
const generateId = () =>
  Number((Math.random() * 1000000).toFixed(0))

const App = () => {
  // highlight-start
  const addNote = (event) => {
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
  const toggleImportance = (id) => {
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
        {store.getState().map(note =>
          <li
            key={note.id}
            onClick={() => toggleImportance(note.id)}   // highlight-line
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
实现这两个功能都很简单。值得注意的是，我们<i>没有</i>像以前那样将表单字段的状态与<i>App</i>组件的状态相绑定。 React称这种表单为[uncontrolled](https://reactjs.org/docs/uncontrolled-components.html)。

<!-- >Uncontrolled forms have certain limitations (for example, dynamic error messages or disabling the submit button based on input are not possible). However they are suitable for our current needs.-->
>未受控制的表单有一定的局限性（例如，动态错误消息或根据输入禁用提交按钮都不可能）。但是它们适合我们目前的需求。

<!-- You can read more about uncontrolled forms [here](https://goshakkk.name/controlled-vs-uncontrolled-inputs-react/).-->
你可以在[这里](https://goshakkk.name/controlled-vs-uncontrolled-inputs-react/)阅读更多关于不受控表单的信息。

<!-- The method handler for adding new notes is simple, it just dispatches the action for adding notes:-->
方法处理程序添加新笔记很简单，只需调度添加笔记的操作：

```js
addNote = (event) => {
  event.preventDefault()
  const content = event.target.note.value  // highlight-line
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

<!-- We can get the content of the new note straight from the form field. Because the field has a name, we can access the content via the event object <i>event.target.note.value</i>.-->
我们可以直接从表单字段获取新笔记的内容。因为字段有一个名称，我们可以通过<i>event.target.note.value</i>事件对象访问内容。

```js
<form onSubmit={addNote}>
  <input name="note" /> // highlight-line
  <button type="submit">add</button>
</form>
```

<!-- A note''s importance can be changed by clicking its name. The event handler is very simple:-->
点击注释的名称可以改变它的重要性。事件处理程序非常简单：

```js
toggleImportance = (id) => {
  store.dispatch({
    type: 'TOGGLE_IMPORTANCE',
    payload: { id }
  })
}
```

### Action creators

<!-- We begin to notice that, even in applications as simple as ours, using Redux can simplify the frontend code. However, we can do a lot better.-->
我们开始注意到，即使是在像我们这样简单的应用程序中，使用Redux也可以简化前端代码。但是，我们可以做得更好。


<!-- React components don''t need to know the Redux action types and forms.-->
React 组件不需要知道 Redux 的 action 类型和形式。
<!-- Let''s separate creating actions into separate functions:-->
让我们把创建行动分解为单独的函数：

```js
const createNote = (content) => {
  return {
    type: 'NEW_NOTE',
    payload: {
      content,
      important: false,
      id: generateId()
    }
  }
}

const toggleImportanceOf = (id) => {
  return {
    type: 'TOGGLE_IMPORTANCE',
    payload: { id }
  }
}
```

<!-- Functions that create actions are called [action creators](https://redux.js.org/advanced/async-actions#synchronous-action-creators).-->
功能创建行为的函数被称为[动作创建者](https://redux.js.org/advanced/async-actions#synchronous-action-creators)。

<!-- The <i>App</i> component does not have to know anything about the inner representation of the actions anymore, it just gets the right action by calling the creator function:-->
<i>App</i> 组件不必再了解动作的内部表示，它只需通过调用创建函数来获取正确的动作：

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

### Forwarding Redux Store to various components

<!-- Aside from the reducer, our application is in one file. This is of course not sensible, and we should separate <i>App</i> into its module.-->
除了Reducer，我們的應用程序都在一個文件中。當然，這是不明智的，我們應該將<i>App</i>拆分為其模塊。

<!-- Now the question is, how can the <i>App</i> access the store after the move? And more broadly, when a component is composed of many smaller components, there must be a way for all of the components to access the store.-->
现在的问题是，<i>App</i>在迁移后如何访问商店？更广泛地说，当一个组件由许多较小的组件组成时，必须有一种方法让所有组件都能访问存储库。
<!-- There are multiple ways to share the Redux store with components. First, we will look into the newest, and possibly the easiest way is using the [hooks](https://react-redux.js.org/api/hooks) API of the [react-redux](https://react-redux.js.org/) library.-->
有多种方式可以与组件共享 Redux store。首先，我们将查看最新的、可能也是最简单的方法，即使用[react-redux](https://react-redux.js.org/)库的[hooks](https://react-redux.js.org/api/hooks) API。

<!-- First, we install react-redux-->
首先，我们安装react-redux

```bash
npm install react-redux
```

<!-- Next, we move the _App_ component into its own file _App.js_. Let''s see how this affects the rest of the application files.-->
接下來，我們將_App_組件移動到自己的文件_App.js_中。讓我們看看這對應用程序的其他文件有什麼影響。

<!-- _index.js_ becomes:-->
_index.js_ 变成：

```js
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createStore } from 'redux'
import { Provider } from 'react-redux' // highlight-line

import App from './App'
import noteReducer from './reducers/noteReducer'

const store = createStore(noteReducer)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>  // highlight-line
    <App />
  </Provider>  // highlight-line
)
```

<!-- Note, that the application is now defined as a child of a [Provider](https://react-redux.js.org/api/provider) component provided by the react-redux library.-->
注意，该应用现在被定义为由react-redux库提供的[提供者](https://react-redux.js.org/api/provider)组件的子组件。
<!-- The application''s store is given to the Provider as its attribute <i>store</i>.-->
应用程序的<i>store</i>被作为Provider的属性提供给它。

<!-- Defining the action creators has been moved to the file <i>reducers/noteReducer.js</i> where the reducer is defined. That file looks like this:-->
定义动作创建者已经移动到文件 <i>reducers/noteReducer.js</i>，其中定义了reducer。该文件看起来像这样：

```js
const noteReducer = (state = [], action) => {
  // ...
}

const generateId = () =>
  Number((Math.random() * 1000000).toFixed(0))

export const createNote = (content) => { // highlight-line
  return {
    type: 'NEW_NOTE',
    payload: {
      content,
      important: false,
      id: generateId()
    }
  }
}

export const toggleImportanceOf = (id) => { // highlight-line
  return {
    type: 'TOGGLE_IMPORTANCE',
    payload: { id }
  }
}

export default noteReducer
```

<!-- If the application has many components which need the store, the <i>App</i> component must pass <i>store</i> as props to all of those components.-->
如果应用有许多需要store的组件，<i>App</i>组件必须将<i>store</i>作为props传递给所有这些组件。

<!-- The module now has multiple [export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) commands.-->
模块现在有多个[export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export)命令。

<!-- The reducer function is still returned with the <i>export default</i> command, so the reducer can be imported the usual way:-->
仍然使用<i>export default</i>命令返回reducer函数，因此可以通常的方式导入reducer：

```js
import noteReducer from './reducers/noteReducer'
```

<!-- A module can have only <i>one default export</i>, but multiple "normal" exports-->
一个模块只能有<i>一个默认导出</i>，但可以有多个“普通”导出。

```js
export const createNote = (content) => {
  // ...
}

export const toggleImportanceOf = (id) => {
  // ...
}
```

<!-- Normally (not as defaults) exported functions can be imported with the curly brace syntax:-->
正常情况下（不是默认情况），导出的函数可以使用大括号语法导入：

```js
import { createNote } from './../reducers/noteReducer'
```

<!-- Code for the <i>App</i> component-->
```
代码用于<i>App</i>组件
```

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

<!-- There are a few things to note in the code. Previously the code dispatched actions by calling the dispatch method of the Redux store:-->
在代码中有几件事需要注意。以前代码通过调用Redux存储的dispatch方法来分派操作：

```js
store.dispatch({
  type: 'TOGGLE_IMPORTANCE',
  payload: { id }
})
```

<!-- Now it does it with the <i>dispatch</i> function from the [useDispatch](https://react-redux.js.org/api/hooks#usedispatch) hook.-->
现在，它使用[useDispatch](https://react-redux.js.org/api/hooks#usedispatch) hook中的<i>dispatch</i> 函数来实现。

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

<!-- The <i>useDispatch</i> hook provides any React component access to the dispatch function of the Redux store defined in <i>index.js</i>.-->
<i>useDispatch</i> 钩子提供了任何 React 组件访问在 <i>index.js</i> 中定义的 Redux 存储的 dispatch 功能。
<!-- This allows all components to make changes to the state of the Redux store.-->
这允许所有组件对Redux存储的状态进行更改。

<!-- The component can access the notes stored in the store with the [useSelector](https://react-redux.js.org/api/hooks#useselector)-hook of the react-redux library.-->
组件可以使用react-redux库的[useSelector](https://react-redux.js.org/api/hooks#useselector)-hook访问存储在store中的笔记。

```js
import { useSelector, useDispatch } from 'react-redux'  // highlight-line

const App = () => {
  // ...
  const notes = useSelector(state => state)  // highlight-line
  // ...
}
```

<i>useSelector</i> receives a function as a parameter. The function either searches for or selects data from the Redux store.
<!-- Here we need all of the notes, so our selector function returns the whole state:-->
在这里，我们需要所有的笔记，因此我们的选择器函数返回整个状态：

```js
state => state
```

<!-- which is a shorthand for:-->
# 什么是快捷格式？

什么是快捷格式？快捷格式是一种简写格式，用于表达文本、标记、格式和其他信息，以节省时间和简化操作。

```js
(state) => {
  return state
}
```

<!-- Usually, selector functions are a bit more interesting and return only selected parts of the contents of the Redux store.-->
通常，选择器函数更有趣一些，只返回 Redux 存储库的部分内容。
<!-- We could for example return only notes marked as important:-->
我們可以例如只回傳標記為重要的筆記：

```js
const importantNotes = useSelector(state => state.filter(note => note.important))
```

<!-- The current version of the application can be found on [GitHub](https://github.com/fullstack-hy2020/redux-notes/tree/part6-0), branch <i>part6-0</i>.-->
当前应用程序的版本可以在[GitHub](https://github.com/fullstack-hy2020/redux-notes/tree/part6-0)，分支<i>part6-0</i>上找到。

### More components

<!-- Let''s separate creating a new note into a component.-->
让我们把创建一个新笔记分解成一个组件。

```js
import { useDispatch } from 'react-redux' // highlight-line
import { createNote } from '../reducers/noteReducer' // highlight-line

const NewNote = () => {
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
不像我们在没有Redux的React代码中一样，改变应用状态的事件处理程序（现在存在于Redux中）已经从<i>App</i>移动到了子组件中。在Redux中改变状态的逻辑仍然与React应用程序的整体部分分离开来。

<!-- We''ll also separate the list of notes and displaying a single note into their own components (which will both be placed in the <i>Notes.js</i> file ):-->
我们还将注意事项列表和显示单个注意事项分开，放到各自的组件中（都放在<i>Notes.js</i>文件中）：

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
现在，更改笔记重要性的逻辑已经在管理笔记列表的组件中了。

<!-- There is not much code left in <i>App</i>:-->
<i>App</i>里没有太多代码了：

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

<i>Note</i>, responsible for rendering a single note, is very simple and is not aware that the event handler it gets as props dispatches an action. These kinds of components are called [presentational](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) in React terminology.

<i>Notes</i>, on the other hand, is a [container](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) component, as it contains some application logic: it defines what the event handlers of the <i>Note</i> components do and coordinates the configuration of <i>presentational</i> components, that is, the <i>Note</i>s.

<!-- We will return to the presentational/container division later in this part.-->
我们稍后会在本节中重新回到presentational/container划分。

<!-- The code of the Redux application can be found on [GitHub](https://github.com/fullstack-hy2020/redux-notes/tree/part6-1), branch <i>part6-1</i>.-->
Redux 应用的代码可以在 [GitHub](https://github.com/fullstack-hy2020/redux-notes/tree/part6-1) 上的 <i>part6-1</i> 分支找到。

</div>

<div class="tasks">

### Exercises 6.3.-6.8.

<!-- Let''s make a new version of the anecdote voting application from part 1. Take the project from this repository <https://github.com/fullstack-hy2020/redux-anecdotes> to base your solution on.-->
让我们从第一部分开始制作一个新版本的轶事投票应用程序。以<https://github.com/fullstack-hy2020/redux-anecdotes>这个仓库中的项目为基础来构建你的解决方案。

<!-- If you clone the project into an existing git repository, <i>remove the git configuration of the cloned application:</i>-->
如果你克隆项目到一个已存在的git仓库，<i>请移除克隆应用的git配置：</i>

```bash
cd redux-anecdotes  // go to the cloned repository
rm -rf .git
```

<!-- The application can be started as usual, but you have to install the dependencies first:-->
应用程序可以像往常一样启动，但是你必须首先安装依赖项：

```bash
npm install
npm start
```

<!-- After completing these exercises, your application should look like this:-->
完成这些练习后，你的应用程序应该如下所示：

![browser showing anecdotes and vote buttons](../../images/6/3.png)

#### 6.3: anecdotes, step1

<!-- Implement the functionality for voting anecdotes. The number of votes must be saved to a Redux store.-->
实施投票轶事的功能。投票数量必须保存到Redux存储中。

#### 6.4: anecdotes, step2

<!-- Implement the functionality for adding new anecdotes.-->
实现添加新轶事的功能。

<!-- You can keep the form uncontrolled like we did [earlier](/en/part6/flux_architecture_and_redux#uncontrolled-form).-->
你可以像我们之前[所做的那样](/en/part6/flux_architecture_and_redux#uncontrolled-form)保持表单不受控制。

#### 6.5: anecdotes, step3

<!-- Make sure that the anecdotes are ordered by the number of votes.-->
确保轶事按投票数量排序。

#### 6.6: anecdotes, step4

<!-- If you haven''t done so already, separate the creation of action-objects to [action creator](https://read.reduxbook.com/markdown/part1/04-action-creators.html)-functions and place them in the <i>src/reducers/anecdoteReducer.js</i> file, so do what we have been doing since the chapter [action creators](/en/part6/flux_architecture_and_redux#action-creators).-->
如果你还没有这么做，将动作对象的创建分离到[动作创建者](https://read.reduxbook.com/markdown/part1/04-action-creators.html)函数中，并将它们放置在<i>src/reducers/anecdoteReducer.js</i>文件中，这样我们就可以像本章[动作创建者](/en/part6/flux_architecture_and_redux#action-creators)中一样做了。

#### 6.7: anecdotes, step5

<!-- Separate the creation of new anecdotes into a component called <i>AnecdoteForm</i>. Move all logic for creating a new anecdote into this new component.-->
将创建新轶事的功能分离到一个名为<i>AnecdoteForm</i>的组件中。将所有创建新轶事的逻辑移动到这个新组件中。

#### 6.8: anecdotes, step6

<!-- Separate the rendering of the anecdote list into a component called <i>AnecdoteList</i>. Move all logic related to voting for an anecdote to this new component.-->
将<i>AnecdoteList</i>的渲染分离成一个组件。将与投票有关的所有逻辑移动到这个新组件中。

<!-- Now the <i>App</i> component should look like this:-->
现在<i>App</i>组件应该看起来像这样：

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
