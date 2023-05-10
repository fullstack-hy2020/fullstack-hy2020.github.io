---
mainImage: ../../../images/part-1.svg
part: 1
letter: c
lang: zh
---

<div class="content">
<!-- Let''s go back to working with React.-->
让我们回到使用React的工作中。

<!-- We start with a new example:-->
我們開始一個新的例子：

```js
const Hello = (props) => {
  return (
    <div>
      <p>
        Hello {props.name}, you are {props.age} years old
      </p>
    </div>
  )
}

const App = () => {
  const name = 'Peter'
  const age = 10

  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="Maya" age={26 + 10} />
      <Hello name={name} age={age} />
    </div>
  )
}
```

### Component helper functions

<!-- Let''s expand our <i>Hello</i> component so that it guesses the year of birth of the person being greeted:-->
让我们扩展我们的<i>Hello</i>组件，以便它猜测被问候者的出生年份：

```js
const Hello = (props) => {
  // highlight-start
  const bornYear = () => {
    const yearNow = new Date().getFullYear()
    return yearNow - props.age
  }
  // highlight-end

  return (
    <div>
      <p>
        Hello {props.name}, you are {props.age} years old
      </p>
      <p>So you were probably born in {bornYear()}</p> // highlight-line
    </div>
  )
}
```

<!-- The logic for guessing the year of birth is separated into a function of its own that is called when the component is rendered.-->
将猜测出生年份的逻辑分离到一个独立的函数中，当组件渲染时调用该函数。

<!-- The person''s age does not have to be passed as a parameter to the function, since it can directly access all props that are passed to the component.-->
函数不需要将这个人的年龄作为参数传递，因为它可以直接访问传递给组件的所有属性。

<!-- If we examine our current code closely, we''ll notice that the helper function is defined inside of another function that defines the behavior of our component. In Java programming, defining a function inside another one is complex and cumbersome, so not all that common. In JavaScript, however, defining functions within functions is a commonly-used technique.-->
如果我们仔细检查我们当前的代码，我们会注意到辅助函数是定义在另一个函数内部的，该函数定义了我们组件的行为。在Java编程中，在另一个函数中定义函数是复杂且繁琐的，因此不太常见。然而，在JavaScript中，在函数中定义函数是一种常用技术。

### Destructuring

<!-- Before we move forward, we will take a look at a small but useful feature of the JavaScript language that was added in the ES6 specification, that allows us to [destructure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) values from objects and arrays upon assignment.-->
在我们继续前进之前，我们将看一下ES6规范中添加的JavaScript语言中的一个小但有用的功能，它允许我们在赋值时从对象和数组中 [解构](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) 值。

<!-- In our previous code, we had to reference the data passed to our component as _props.name_ and _props.age_. Of these two expressions, we had to repeat _props.age_ twice in our code.-->
在我们之前的代码中，我们必须引用传递给我们组件的数据作为`props.name`和`props.age`。在这两个表达式中，我们必须在代码中重复`props.age`两次。

<!-- Since <i>props</i> is an object-->
, you can pass any type of data to a component

因为<i>props</i>是一个对象，你可以向组件传递任何类型的数据。

```js
props = {
  name: 'Arto Hellas',
  age: 35,
}
```

<!-- we can streamline our component by assigning the values of the properties directly into two variables _name_ and _age_ which we can then use in our code:-->
我们可以通过将属性值直接分配到两个变量_name_和_age_中来简化我们的组件，然后我们可以在代码中使用这两个变量：

```js
const Hello = (props) => {
  // highlight-start
  const name = props.name
  const age = props.age
  // highlight-end

  const bornYear = () => new Date().getFullYear() - age

  return (
    <div>
      <p>Hello {name}, you are {age} years old</p> // highlight-line
      <p>So you were probably born in {bornYear()}</p>
    </div>
  )
}
```

<!-- Note that we''ve also utilized the more compact syntax for arrow functions when defining the _bornYear_ function. As mentioned earlier, if an arrow function consists of a single expression, then the function body does not need to be written inside of curly braces. In this more compact form, the function simply returns the result of the single expression.-->
注意，我们在定义_bornYear_函数时也使用了更紧凑的箭头函数语法。正如前面提到的，如果箭头函数包含单个表达式，则函数体不需要写在花括号内。在这种更紧凑的形式中，函数只需返回单个表达式的结果。

<!-- To recap, the two function definitions shown below are equivalent:-->
**总结一下，下面两个函数定义是等价的：**

```js
const bornYear = () => new Date().getFullYear() - age

const bornYear = () => {
  return new Date().getFullYear() - age
}
```

<!-- Destructuring makes the assignment of variables even easier since we can use it to extract and gather the values of an object''s properties into separate variables:-->
结构化赋值使变量的赋值更加容易，因为我们可以使用它来提取和收集对象属性的值到单独的变量中：

```js
const Hello = (props) => {
    // highlight-start
  const { name, age } = props
    // highlight-end
  const bornYear = () => new Date().getFullYear() - age

  return (
    <div>
      <p>Hello {name}, you are {age} years old</p>
      <p>So you were probably born in {bornYear()}</p>
    </div>
  )
}
```

<!-- Eli koska -->
<!-- If the object we are destructuring has the values-->
we need, we can assign them to variables

如果被解構的對象具有我們需要的值，我們可以將它們分配給變量。

```js
props = {
  name: 'Arto Hellas',
  age: 35,
}
```

<!-- the expression <em>const { name, age } = props</em> assigns the values 'Arto Hellas' to _name_ and 35 to _age_.-->
<em>const { name, age } = props</em> 将值 'Arto Hellas' 分配给 _name_ ，将值 35 分配给 _age_。

<!-- We can take destructuring a step further:-->
我们可以进一步深入地探讨解构：

```js
const Hello = ({ name, age }) => { // highlight-line
  const bornYear = () => new Date().getFullYear() - age

  return (
    <div>
      <p>
        Hello {name}, you are {age} years old
      </p>
      <p>So you were probably born in {bornYear()}</p>
    </div>
  )
}
```

<!-- The props that are passed to the component are now directly destructured into the variables, _name_ and _age_.-->
现在传递给组件的props被直接解构成变量_name_和_age_。

<!-- This means that instead of assigning the entire props object into a variable called <i>props</i> and then assigning its properties to the variables _name_ and _age_-->
, you can destructure the props object directly into two variables.

这意味着，你不必将整个`props`对象分配给一个叫做<i>props</i>的变量，然后将其属性分配给变量_name_和_age_，而是可以直接将`props`对象解构到两个变量中。

```js
const Hello = (props) => {
  const { name, age } = props
```

<!-- we assign the values of the properties directly to variables by destructuring the props object that is passed to the component function as a parameter:-->
我们通过解构传递给组件函数的props对象直接将属性的值分配给变量：

```js
const Hello = ({ name, age }) => {
```

### Page re-rendering

<!-- So far all of our applications have been such that their appearance remains the same after the initial rendering. What if we wanted to create a counter where the value increased as a function of time or at the click of a button?-->
迄今为止，我们的所有应用程序都是在初次渲染后外观保持不变。如果我们想要创建一个计数器，其值随时间增加或点击按钮而增加呢？

<!-- Let''s start with the following. File <i>App.js</i> becomes:-->
<i>App.js</i> 开始如下：

```js
const App = (props) => {
  const {counter} = props
  return (
    <div>{counter}</div>
  )
}

export default App
```

<!-- And file <i>index.js</i> becomes:-->
而文件<i>index.js</i>变成：

```js
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

let counter = 1

ReactDOM.createRoot(document.getElementById('root')).render(
  <App counter={counter} />
)
```

<!-- The App component is given the value of the counter via the _counter_ prop. This component renders the value to the screen. What happens when the value of _counter_ changes? Even if we were to add the following-->
line to the App component, the value would not change

App组件通过_counter_ prop获得计数器的值。 该组件将值呈现到屏幕上。 当_counter_的值发生变化时会发生什么？ 即使我们在App组件中添加下面的一行，值也不会改变

```js
counter += 1
```

<!-- the component won''t re-render. We can get the component to re-render by calling the _render_ method a second time, e.g. in the following way:-->
这个组件不会重新渲染。我们可以通过第二次调用_render_方法来使组件重新渲染，例如以下方式：

```js
let counter = 1

const refresh = () => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <App counter={counter} />
  )
}

refresh()
counter += 1
refresh()
counter += 1
refresh()
```

<!-- The re-rendering command has been wrapped inside of the _refresh_ function to cut down on the amount of copy-pasted code.-->
将重新渲染命令包裹在\_refresh\_函数中，以减少复制粘贴代码的数量。

<!-- Now the component <i>renders three times</i>, first with the value 1, then 2, and finally 3. However, values 1 and 2 are displayed on the screen for such a short amount of time that they can''t be noticed.-->
现在组件<i>渲染了三次</i>，第一次是值1，第二次是2，最后是3。然而，值1和2在屏幕上显示的时间太短，以至于无法被注意到。

<!-- We can implement slightly more interesting functionality by re-rendering and incrementing the counter every second by using [setInterval](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval):-->
我们可以通过使用[setInterval](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval)每秒重新渲染和增加计数来实现稍微有趣的功能：

```js
setInterval(() => {
  refresh()
  counter += 1
}, 1000)
```

<!-- Making repeated calls to the _render_ method is not the recommended way to re-render components. Next, we''ll introduce a better way of accomplishing this effect.-->
重复调用_render_方法不是重新渲染组件的推荐方式。接下来，我们将介绍一种更好的实现此效果的方法。

### Stateful component

<!-- All of our components up till now have been simple in the sense that they have not contained any state that could change during the lifecycle of the component.-->
所有到目前为止的组件都是简单的，因为它们在组件的生命周期中没有包含任何可能改变的状态。

<!-- Next, let's add state to our application's <i>App</i> component with the help of React''s [state hook](https://react.dev/learn/state-a-components-memory).-->
接下来，让我们借助React的[状态钩子](https://react.dev/learn/state-a-components-memory)向我们应用程序的<i>App</i>组件添加状态。

<!-- We will change the application as follows.  <i>index.js</i> goes back to-->
its original state.

我们将按照以下方式更改应用程序。<i>index.js</i>恢复到原始状态。

```js
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

<!-- and <i>App.js</i> changes to the following:-->
更改后，<i>App.js</i> 变为以下内容：

```js
import { useState } from 'react' // highlight-line

const App = () => {
  const [ counter, setCounter ] = useState(0) // highlight-line

// highlight-start
  setTimeout(
    () => setCounter(counter + 1),
    1000
  )
  // highlight-end

  return (
    <div>{counter}</div>
  )
}

export default App
```

<!-- In the first row, the file imports the _useState_ function:-->
在第一行，文件导入了 _useState_ 函数：

```js
import { useState } from 'react'
```

<!-- The function body that defines the component begins with the function call:-->
函数体定义组件的开头是函数调用：

```js
const [ counter, setCounter ] = useState(0)
```

<!-- The function call adds <i>state</i> to the component and renders it initialized with the value of zero. The function returns an array that contains two items. We assign the items to the variables _counter_ and _setCounter_ by using the destructuring assignment syntax shown earlier.-->
函数调用会向组件添加<i>状态</i>并将其初始化为零。该函数返回一个包含两个项目的数组。我们使用前面介绍的解构赋值语法将这两个项目分别赋值给变量_counter_和_setCounter_。

<!-- The _counter_ variable is assigned the initial value of <i>state</i> which is zero. The variable _setCounter_ is assigned to a function that will be used to <i>modify the state</i>.-->
变量_counter_被分配初始值<i>state</i>，它的值为零。变量_setCounter_被分配给一个函数，用于<i>修改状态</i>。

<!-- The application calls the [setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) function and passes it two parameters: a function to increment the counter state and a timeout of one second:-->
应用程序调用[setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout)函数，并传入两个参数：一个用于增加计数器状态的函数和一个超时时间为一秒的参数：

```js
setTimeout(
  () => setCounter(counter + 1),
  1000
)
```

<!-- The function passed as the first parameter to the _setTimeout_ function is invoked one second after calling the _setTimeout_ function-->
.

_setTimeout_ 函数传入的第一个参数在调用 _setTimeout_ 函数之后一秒后被调用。

```js
() => setCounter(counter + 1)
```

<!-- When the state modifying function _setCounter_ is called, <i>React re-renders the component</i> which means that the function body of the component function gets re-executed:-->
当状态修改函数_setCounter_被调用时，<i>React重新渲染组件</i> ，这意味着组件函数的函数体被重新执行：

```js
() => {
  const [ counter, setCounter ] = useState(0)

  setTimeout(
    () => setCounter(counter + 1),
    1000
  )

  return (
    <div>{counter}</div>
  )
}
```

<!-- The second time the component function is executed it calls the _useState_ function and returns the new value of the state: 1. Executing the function body again also makes a new function call to _setTimeout_, which executes the one-second timeout and increments the _counter_ state again. Because the value of the _counter_ variable is 1, incrementing the value by 1 is essentially the same as an expression setting the value of _counter_ to 2.-->
第二次执行组件功能时，它调用_useState_函数并返回新的状态值：1.再次执行函数体也会调用_setTimeout_函数，执行一秒钟的超时，并再次增加_counter_状态。由于_counter_变量的值为1，将值加1实际上与表达式将_counter_的值设置为2相同。

```js
() => setCounter(2)
```

<!-- Meanwhile, the old value of _counter_ - "1" - is rendered to the screen.-->
同时，旧的_counter_值“1”被渲染到屏幕上。

<!-- Every time the _setCounter_ modifies the state it causes the component to re-render. The value of the state will be incremented again after one second, and this will continue to repeat for as long as the application is running.-->
每次_setCounter_修改状态时，都会导致组件重新渲染。状态的值将在一秒钟后再次增加，只要应用程序正在运行，这种情况就会一直重复下去。

<!-- If the component doesn't render when you think it should, or if it renders at the "wrong time", you can debug the application by logging the values of the component's variables to the console. If we make the following additions to our code:-->
如果组件没有在你认为它应该渲染的时候渲染，或者它在“错误的时间”渲染，你可以通过将组件变量的值输出到控制台来调试应用程序。如果我们对代码做出以下添加：

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  setTimeout(
    () => setCounter(counter + 1),
    1000
  )

  console.log('rendering...', counter) // highlight-line

  return (
    <div>{counter}</div>
  )
}
```

<!-- It's easy to follow and track the calls made to the <i>App</i> component's render function:-->
它很容易跟踪对<i>App</i>组件的render函数所做的调用：

![screenshot of render function with dev tools](../../images/1/4e.png)

<!-- Was your browser console open? If it wasn''t, then promise that this was the last time you need to be reminded about it.-->
你的浏览器控制台打开了吗？如果没有，那么请承诺这是最后一次提醒你了。

### Event handling

<!-- We have already mentioned <i>event handlers</i> that are registered to be called when specific events occur a few times in [part 0](/en/part0). A user''s interaction with the different elements of a web page can cause a collection of various kinds of events to be triggered.-->
我们已经在[第0部分](/en/part0)中多次提到了<i>事件处理程序</i>，它们在特定事件发生时注册以被调用。用户与网页的不同元素的交互可能会触发一系列各种事件。

<!-- Let''s change the application so that increasing the counter happens when a user clicks a button, which is implemented with the [button](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) element.-->
让我们改变应用程序，使得当用户点击[按钮](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button)元素时，计数器增加。

<!-- Button elements support so-called [mouse events](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent), of which [click](https://developer.mozilla.org/en-US/docs/Web/Events/click) is the most common event. The click event on a button can also be triggered with the keyboard or a touch screen despite the name <i>mouse event</i>.-->
按钮元素支持所谓的[鼠标事件](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent)，其中[点击](https://developer.mozilla.org/en-US/docs/Web/Events/click)是最常见的事件。尽管名称为<i>鼠标事件</i>，但按钮上的点击事件也可以用键盘或触摸屏触发。

<!-- In React, [registering an event handler function](https://react.dev/learn/responding-to-events) to the <i>click</i> event happens like this:-->
在React中，注册<i>点击</i>事件的处理函数就像这样：[注册事件处理函数](https://react.dev/learn/responding-to-events)

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  // highlight-start
  const handleClick = () => {
    console.log('clicked')
  }
  // highlight-end

  return (
    <div>
      <div>{counter}</div>
      // highlight-start
      <button onClick={handleClick}>
        plus
      </button>
      // highlight-end
    </div>
  )
}
```

<!-- We set the value of the button''s <i>onClick</i> attribute to be a reference to the _handleClick_ function defined in the code.-->
我们将按钮的<i>onClick</i>属性的值设置为指向代码中定义的_handleClick_函数的引用。

<!-- Now every click of the <i>plus</i> button causes the _handleClick_ function to be called, meaning that every click event will log a <i>clicked</i> message to the browser console.-->
现在，每次点击<i>加号</i>按钮都会调用_handleClick_函数，这意味着每次点击事件都会在浏览器控制台中记录一条<i>点击</i>消息。

<!-- The event handler function can also be defined directly in the value assignment of the onClick-attribute:-->
`onClick="someFunction()"`

`onClick="一些函数()"`

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  return (
    <div>
      <div>{counter}</div>
      <button onClick={() => console.log('clicked')}> // highlight-line
        plus
      </button>
    </div>
  )
}
```

<!-- By changing the event handler to the following form-->
, we can improve the performance of the program

通过将事件处理程序更改为以下形式，我们可以提高程序的性能。

```js
<button onClick={() => setCounter(counter + 1)}>
  plus
</button>
```

<!-- we achieve the desired behavior, meaning that the value of _counter_ is increased by one <i>and</i> the component gets re-rendered.-->
我们实现了所需的行为，意味着_counter_的值增加了1 <i>而且</i> 组件也重新渲染了。

<!-- Let''s also add a button for resetting the counter:-->
让我们也添加一个用于重置计数器的按钮：

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  return (
    <div>
      <div>{counter}</div>
      <button onClick={() => setCounter(counter + 1)}>
        plus
      </button>
      // highlight-start
      <button onClick={() => setCounter(0)}>
        zero
      </button>
      // highlight-end
    </div>
  )
}
```

<!-- Our application is now ready!-->
我们的应用程序现在已经准备就绪！

### An event handler is a function

<!-- We define the event handlers for our buttons where we declare their <i>onClick</i> attributes:-->
我们为我们的按钮定义事件处理程序，其中我们声明它们的<i>onClick</i>属性：

```js
<button onClick={() => setCounter(counter + 1)}>
  plus
</button>
```

<!-- What if we tried to define the event handlers in a simpler form?-->
如果我們嘗試以更簡單的形式定義事件處理程序呢？

```js
<button onClick={setCounter(counter + 1)}>
  plus
</button>
```

<!-- This would completely break our application:-->
这将彻底破坏我们的应用程序：

![screenshot of re-renders error](../../images/1/5c.png)

<!-- What''s going on? An event handler is supposed to be either a <i>function</i> or a <i>function reference</i>, and when we write:-->
**这是怎么回事？事件处理程序应该是一个<i>函数</i>或<i>函数引用</i>，当我们写：**

```js
<button onClick={setCounter(counter + 1)}>
```

<!-- the event handler is actually a <i>function call</i>. In many situations this is ok, but not in this particular situation. In the beginning, the value of the <i>counter</i> variable is 0. When React renders the component for the first time, it executes the function call <em>setCounter(0+1)</em>, and changes the value of the component''s state to 1.-->
事件处理程序实际上是一个<i>函数调用</i>。在许多情况下这是可以的，但是在这种特殊情况下不行。一开始，<i>counter</i>变量的值是0。当React首次渲染组件时，它会执行函数调用<em>setCounter(0+1)</em>，并将组件状态的值改为1。
<!-- This will cause the component to be re-rendered, React will execute the setCounter function call again, and the state will change leading to another rerender...-->
这会导致组件被重新渲染，React会再次执行setCounter函数调用，状态改变会导致另一次重新渲染...

<!-- Let''s define the event handlers like we did before:-->
让我们像以前一样定义事件处理程序：

```js
<button onClick={() => setCounter(counter + 1)}>
  plus
</button>
```

<!-- Now the button''s attribute which defines what happens when the button is clicked - <i>onClick</i> - has the value _() => setCounter(counter + 1)_.-->
现在，定义按钮点击时发生的操作的按钮属性<i>onClick</i>的值为_() => setCounter(counter + 1)_。
<!-- The setCounter function is called only when a user clicks the button.-->
`setCounter` 函数只有在用户点击按钮时才会被调用。

<!-- Usually defining event handlers within JSX-templates is not a good idea.-->
通常，在JSX模板中定义事件处理程序是不是一个好主意。
<!-- Here it''s ok, because our event handlers are so simple.-->
这里没问题，因为我们的事件处理程序很简单。

<!-- Let''s separate the event handlers into separate functions anyway:-->
让我们把事件处理程序放到不同的函数中：

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

// highlight-start
  const increaseByOne = () => setCounter(counter + 1)

  const setToZero = () => setCounter(0)
  // highlight-end

  return (
    <div>
      <div>{counter}</div>
      <button onClick={increaseByOne}> // highlight-line
        plus
      </button>
      <button onClick={setToZero}> // highlight-line
        zero
      </button>
    </div>
  )
}
```

<!-- Here, the event handlers have been defined correctly. The value of the <i>onClick</i> attribute is a variable containing a reference to a function:-->
这里，事件处理程序已经正确定义。<i>onClick</i>属性的值是一个变量，其中包含对函数的引用：

```js
<button onClick={increaseByOne}>
  plus
</button>
```

### Passing state - to child components

<!-- It's recommended to write React components that are small and reusable across the application and even across projects. Let's refactor our application so that it''s composed of three smaller components, one component for displaying the counter and two components for buttons.-->
它建议编写小而可重复使用的 React 组件，甚至可以跨应用程序和项目使用。让我们重构我们的应用程序，使其由三个较小的组件组成，一个组件用于显示计数器，两个组件用于按钮。

<!-- Let's first implement a <i>Display</i> component that's responsible for displaying the value of the counter.-->
让我们首先实现一个<i>显示</i>组件，负责显示计数器的值。

<!-- One best practice in React is to [lift the state up](https://react.dev/learn/sharing-state-between-components) in the component hierarchy. The documentation says:-->
在 React 中最佳实践之一是在组件层次结构中[提升状态](https://react.dev/learn/sharing-state-between-components)。文档中说：

<!-- > <i>Often, several components need to reflect the same changing data. We recommend lifting the shared state up to their closest common ancestor.</i>-->
> <i>通常，若干个组件需要反映相同的变化数据。我们建议将共享状态提升到它们最近的共同祖先。</i>

<!-- So let's place the application's state in the <i>App</i> component and pass it down to the <i>Display</i> component through <i>props</i>:-->
所以让我们把应用状态放在<i>App</i>组件中，并通过<i>props</i>将其传递给<i>Display</i>组件：

```js
const Display = (props) => {
  return (
    <div>{props.counter}</div>
  )
}
```

<!-- Using the component is straightforward, as we only need to pass the state of the _counter_ to it:-->
使用组件很简单，因为我们只需要将_counter_的状态传递给它：

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  const increaseByOne = () => setCounter(counter + 1)
  const setToZero = () => setCounter(0)

  return (
    <div>
      <Display counter={counter}/> // highlight-line
      <button onClick={increaseByOne}>
        plus
      </button>
      <button onClick={setToZero}>
        zero
      </button>
    </div>
  )
}
```

<!-- Everything still works. When the buttons are clicked and the <i>App</i> gets re-rendered, all of its children including the <i>Display</i> component are also re-rendered.-->
一切仍然正常工作。当按钮被点击，<i>应用程序</i>重新渲染时，其所有子组件，包括<i>显示</i>组件也会重新渲染。

<!-- Next, let's make a <i>Button</i> component for the buttons of our application. We have to pass the event handler as well as the title of the button through the component's props:-->
接下來，讓我們為我們應用程序的按鈕製作一個<i>按鈕</i>組件。我們必須通過組件的props傳遞事件處理程序以及按鈕的標題：

```js
const Button = (props) => {
  return (
    <button onClick={props.handleClick}>
      {props.text}
    </button>
  )
}
```

<!-- Our <i>App</i> component now looks like this:-->
我們的<i>應用程式</i>組件現在看起來像這樣：

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  const increaseByOne = () => setCounter(counter + 1)
  //highlight-start
  const decreaseByOne = () => setCounter(counter - 1)
  //highlight-end
  const setToZero = () => setCounter(0)

  return (
    <div>
      <Display counter={counter}/>
      // highlight-start
      <Button
        handleClick={increaseByOne}
        text='plus'
      />
      <Button
        handleClick={setToZero}
        text='zero'
      />
      <Button
        handleClick={decreaseByOne}
        text='minus'
      />
      // highlight-end
    </div>
  )
}
```

<!-- Since we now have an easily reusable <i>Button</i> component, we''ve also implemented new functionality into our application by adding a button that can be used to decrement the counter.-->
由於我們現在有一個容易重複使用的<i>按鈕</i>組件，我們還通過添加一個可用於減少計數器的按鈕來實現新的功能到我們的應用程序中。

<!-- The event handler is passed to the <i>Button</i> component through the _handleClick_ prop. The name of the prop itself is not that significant, but our naming choice wasn't completely random. React's own official [tutorial](https://react.dev/learn/tutorial-tic-tac-toe) suggests this convention.-->
经过_handleClick_ prop传递给<i>Button</i>组件的事件处理器。属性本身的名称并不是很重要，但我们的命名选择并不是完全随机的。 React自己的官方[教程](https://react.dev/learn/tutorial-tic-tac-toe)建议使用这种约定。

### Changes in state cause rerendering

<!-- Let''s go over the main principles of how an application works once more.-->
让我们再次回顾一下应用程序是如何工作的主要原则。

<!-- When the application starts, the code in _App_ is executed. This code uses a [useState](https://react.dev/reference/react/useState) hook to create the application state, setting an initial value of the variable _counter_.-->
当应用程序启动时，会执行_App_中的代码。 该代码使用[useState](https://react.dev/reference/react/useState)钩子来创建应用程序状态，设置变量_counter_的初始值。
<!-- This component contains the _Display_ component - which displays the counter''s value, 0 - and three _Button_ components. The buttons all have event handlers, which are used to change the state of the counter.-->
这个组件包含_显示_组件——显示计数器的值，0——和三个_按钮_组件。这些按钮都有事件处理程序，用于改变计数器的状态。

<!-- When one of the buttons is clicked, the event handler is executed. The event handler changes the state of the _App_ component with the _setCounter_ function.-->
当其中一个按钮被点击时，事件处理程序就会被执行。事件处理程序通过_setCounter_函数来改变_App_组件的状态。
<!-- **Calling a function that changes the state causes the component to rerender.**-->
调用一个改变状态的函数会导致组件重新渲染。

<!-- So, if a user clicks the <i>plus</i> button, the button''s event handler changes the value of _counter_ to 1, and the _App_ component is rerendered.-->
如果用户点击<i>加号</i>按钮，按钮的事件处理程序将_counter_的值改为1，并且_App_组件将被重新渲染。
<!-- This causes its subcomponents _Display_ and _Button_ to also be re-rendered.-->
这导致其子组件_Display_ 和 _Button_也被重新渲染。
<!-- _Display_ receives the new value of the counter, 1, as props. The _Button_ components receive event handlers which can be used to change the state of the counter.-->
_显示_接收新的计数器值1作为props。 _按钮_组件接收事件处理程序，可用于更改计数器的状态。

<!-- To be sure to understand how the program works, let us add some _console.log_ statements to it-->
.

確保理解程序的工作原理，讓我們為它添加一些_console.log_語句。

```js
const App = () => {
  const [counter, setCounter] = useState(0)
  console.log('rendering with counter value', counter) // highlight-line

  const increaseByOne = () => {
    console.log('increasing, value before', counter) // highlight-line
    setCounter(counter + 1)
  }

  const decreaseByOne = () => {
    console.log('decreasing, value before', counter) // highlight-line
    setCounter(counter - 1)
  }

  const setToZero = () => {
    console.log('resetting to zero, value before', counter) // highlight-line
    setCounter(0)
  }

  return (
    <div>
      <Display counter={counter} />
      <Button handleClick={increaseByOne} text="plus" />
      <Button handleClick={setToZero} text="zero" />
      <Button handleClick={decreaseByOne} text="minus" />
    </div>
  )
}
```

<!-- Let us now see what gets rendered to the console when the buttons plus, zero and minus are pressed:-->
现在让我们看一下当按下加号、零和减号按钮时会输出到控制台的内容：

![browser showing console with rendering values highlighted](../../images/1/31.png)

<!-- Do not ever try to guess what your code does. It is just better to use _console.log_ and <i>see with your own eyes</i> what it does.-->
不要尝试猜测你的代码会做什么。最好使用_console.log_ 并且 <i>亲眼看到</i> 它会做什么。

### Refactoring the components

<!-- The component displaying the value of the counter is as follows:-->
以下是显示计数器值的组件：

```js
const Display = (props) => {
  return (
    <div>{props.counter}</div>
  )
}
```

<!-- The component only uses the _counter_ field of its <i>props</i>.-->
该组件只使用它的<i>props</i>中的_counter_字段。
<!-- This means we can simplify the component by using [destructuring](/en/part1/component_state_event_handlers#destructuring), like so:-->
这意味着我们可以通过使用[解构](/en/part1/component_state_event_handlers#destructuring)来简化组件，就像这样：

```js
const Display = ({ counter }) => {
  return (
    <div>{counter}</div>
  )
}
```

<!-- The function defining the component contains only the return statement, so-->
the component is just a function that returns some JSX.

函数定义组件只包含返回语句，因此组件只是一个返回一些JSX的函数。
<!-- we can define the function using the more compact form of arrow functions:-->
我们可以使用箭头函数的更紧凑的形式来定义函数：

```js
const Display = ({ counter }) => <div>{counter}</div>
```

<!-- We can simplify the Button component as well.-->
我们也可以简化按钮组件。

```js
const Button = (props) => {
  return (
    <button onClick={props.handleClick}>
      {props.text}
    </button>
  )
}
```

<!-- We can use destructuring to get only the required fields from <i>props</i>, and use the more compact form of arrow functions:-->
我们可以使用解构来从<i>props</i>中获取所需的字段，并使用更紧凑的箭头函数形式：

```js
const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)
```

<!-- We can simplify the Button component once more by declaring the return statement in just one line:-->
我们可以通过只在一行声明返回语句来进一步简化按钮组件：

```js
const Button = ({ handleClick, text }) => <button onClick={handleClick}>{text}</button>
```

<!-- However, be careful to not oversimplify your components, as this makes adding complexity a more tedious task down the road.-->
但是，要小心不要过度简化你的组件，因为这会使添加复杂性在将来变得更加枯燥乏味。

</div>
