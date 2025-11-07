---
mainImage: ../../../images/part-1.svg
part: 1
letter: c
lang: zh
---

<div class="content">

<!-- Let's go back to working with React.-->
让我们回到使用React的工作上来。

<!-- We start with a new example:-->
我们从一个新的例子开始：

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

<!-- ### Component helper functions -->
### 组件的辅助函数

<!-- Let's expand our <i>Hello</i> component so that it guesses the year of birth of the person being greeted:-->
让我们扩展我们的<i>Hello</i>组件，让它猜测被问候者的出生年份：

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

<!-- The logic for guessing the year of birth is encapsulated within a function of its own, which is invoked when the component is rendered. -->
猜测出生年份的逻辑被包裹在自己的函数中，并在组件渲染时被调用。

<!-- The person's age does not need to be explicitly passed as a parameter to this function because the function can directly access all the props provided to the component. -->
人的年龄无需显式作为参数传给函数，因为函数可以直接访问传给组件的所有props。

<!-- If we examine the current code, we notice that the helper function is defined within another function that determines the component's behavior. In Java programming, defining a function within another function can be complex and is uncommon. However, in JavaScript, defining functions within functions is a common and efficient practice. -->
如果我们仔细检查我们当前的代码，我们会注意到这个辅助函数实际上是定义在另一个定义我们组件行为的函数里面。在Java编程中，在一个函数中定义另一个函数比较复杂，所以不是那么常见。然而，在JavaScript中，在函数中定义函数是一种常规操作。

<!-- ### Destructuring -->
### 解构

<!-- Before we move forward, we will take a look at a small but useful feature of the JavaScript language that was added in the ES6 specification, that allows us to [destructure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) values from objects and arrays upon assignment.-->
在我们继续前进之前，我们将看一下JavaScript语言在ES6规范中添加的一个微小但有用的功能，它允许我们在赋值时从对象和数组中[解构](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)取值。

<!-- In our previous code, we had to reference the data passed to our component as _props.name_ and _props.age_. Of these two expressions we had to repeat _props.age_ twice in our code.-->
在我们之前的代码中，我们必须将传递给我们组件的数据引用为_props.name_和_props.age_。在这两个表达式中，我们不得不在代码中重复_props.age_两次。

<!-- Since <i>props</i> is an object-->
由于<i>props</i>是一个对象

```js
props = {
  name: 'Arto Hellas',
  age: 35,
}
```

<!-- we can streamline our component by assigning the values of the properties directly into two variables _name_ and _age_ which we can then use in our code:-->
我们可以通过将属性值直接赋值给两个变量_name_和_age_来简化我们的组件，从而我们可以在代码中使用这两个变量：

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

<!-- Note that we've also utilized the more compact syntax for arrow functions when defining the _bornYear_ function. As mentioned earlier, if an arrow function consists of a single expression, then the function body does not need to be written inside of curly braces. In this more compact form, the function simply returns the result of the single expression.-->
注意，在定义_bornYear_函数时，我们也利用了箭头函数的更紧凑的语法。如前所述，如果一个箭头函数由单个表达式组成，那么函数体就不需要写在大括号里。在这种更紧凑的形式下，函数只是返回单个表达式的结果。

<!-- To recap, the two function definitions shown below are equivalent:-->
简而言之，下面显示的两个函数定义是等价的。
```js
const bornYear = () => new Date().getFullYear() - age

const bornYear = () => {
  return new Date().getFullYear() - age
}
```

<!-- Destructuring makes the assignment of variables even easier, since we can use it to extract and gather the values of an object's properties into separate variables:-->
解构使得变量的赋值更加容易，因为我们可以用它来提取和收集一个对象的属性值到专门的变量中。

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

<!-- When the object that we are destructuring has the values -->
当我们要解构的对象有以下值时
```js
props = {
  name: 'Arto Hellas',
  age: 35,
}
```

<!-- the expression <em>const { name, age } = props</em> assigns the values 'Arto Hellas' to _name_ and 35 to _age_.-->
表达式<em>const { name, age } = props</em>将值'Arto Hellas'赋给_name_，将35赋给_age_。

<!-- We can take destructuring a step further:-->
我们可以进一步解构：

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

<!-- The props that are passed to the component are now directly destructured into the variables _name_ and _age_.-->
传递给组件的props现在被直接解构为变量_name_和_age_。

<!-- This means that instead of assigning the entire props object into a variable called <i>props</i> and then assigning its properties into the variables _name_ and _age_-->
这意味着我们不是把整个props对象赋值给一个叫做<i>props</i>的变量中，然后再把它的属性赋值给变量_name_和_age_

```js
const Hello = (props) => {
  const { name, age } = props
```

<!-- we assign the values of the properties directly to variables by destructuring the props object that is passed to the component function as a parameter:-->
而是通过对作为参数传递给组件函数的props对象进行解构，直接将属性值赋值给变量：

```js
const Hello = ({ name, age }) => {
```

<!-- ### Page re-rendering -->
### 页面的重新渲染

<!-- Up to this point, our applications have been static — their appearance remains unchanged after the initial rendering. But what if we wanted to create a counter that increases in value, either over time or when a button is clicked? -->
到目前为止，我们所有的应用都是静态的——在最初的渲染之后，其外观保持不变。如果我们想创建一个计数器，其值随着时间的推移或点击按钮而增加呢？

<!-- Let's start with the following. File <i>App.jsx</i> becomes: -->
让我们从将文件<i>App.jsx</i>变成下面的样子开始：

```js
const App = (props) => {
  const {counter} = props
  return (
    <div>{counter}</div>
  )
}

export default App
```

<!-- And file <i>main.jsx</i> becomes: -->
将文件<i>main.jsx</i>改成：

```js
import ReactDOM from 'react-dom/client'

import App from './App'

let counter = 1

ReactDOM.createRoot(document.getElementById('root')).render(
  <App counter={counter} />
)
```

<!-- The App component is given the value of the counter via the _counter_ prop. This component renders the value to the screen. What happens when the value of _counter_ changes? Even if we were to add the following-->
App组件通过_counter_ props得到了计数器的值。这个组件将该值渲染到屏幕上。当_counter_的值改变时，会发生什么？即使我们加入以下内容

```js
counter += 1
```

<!-- the component won't re-render. We can get the component to re-render by calling the _render_ method a second time, e.g. in the following way:-->
组件也不会重新渲染。我们可以通过再次调用_render_方法来重新渲染组件，例如：

```js
let counter = 1

const root = ReactDOM.createRoot(document.getElementById('root'))

const refresh = () => {
  root.render(
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
重新渲染的命令已经被包裹在_refresh_函数中，以减少复制粘贴的代码量。

<!-- Now the component  <i>renders three times</i>, first with the value 1, then 2, and finally 3. However, the values 1 and 2 are displayed on the screen for such a short amount of time that they can't be noticed.-->
现在这个组件<i>渲染了三次</i>，首先是数值1，然后是2，最后是3。 然而，数值1和2在屏幕上显示的时间非常短，以至于它们无法被注意到。

<!-- We can implement slightly more interesting functionality by re-rendering and incrementing the counter every second by using [setInterval](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval):-->
我们可以通过使用[setInterval](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval)来实现更有趣的功能，每秒钟重新渲染并增加计数器。

```js
setInterval(() => {
  refresh()
  counter += 1
}, 1000)
```

<!-- Making repeated calls to the _render_ method is not the recommended way to re-render components. Next, we'll introduce a better way of accomplishing this effect.-->
重复调用_render_方法并不是重新渲染组件的推荐方式。接下来，我们将介绍实现这一效果的更好的方法。

<!-- ### Stateful component -->
### 带状态的组件

<!-- All of our components up till now have been simple in the sense that they have not contained any state that could change during the lifecycle of the component.-->
到目前为止，我们所有的组件都是简单的，它们所有的状态在组件生命周期中都不会发生变化。

<!-- Next, let's add state to our application's <i>App</i> component with the help of React's [state hook](https://react.dev/learn/state-a-components-memory). -->
接下来，让我们借助React的[状态hook](https://react.dev/learn/state-a-components-memory)来给我们的应用的<i>App</i>组件添加状态。

<!-- We will change the application as follows. <i>main.jsx</i> goes back to: -->
我们将改变应用的内容如下。<i>main.jsx</i>回到：

```js
import ReactDOM from 'react-dom/client'

import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

<!-- and <i>App.jsx</i> changes to the following: -->
而<i>App.jsx</i>则改为：

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
在第一行，文件导入了_useState_函数。

```js
import { useState } from 'react'
```

<!-- The function body that defines the component begins with the function call:-->
该组件的函数体以函数调用开始：

```js
const [ counter, setCounter ] = useState(0)
```

<!-- The function call adds <i>state</i> to the component and renders it initialized with the value of zero. The function returns an array that contains two items. We assign the items to the variables _counter_ and _setCounter_ by using the destructuring assignment syntax shown earlier.-->
该函数调用将<i>状态</i>添加到组件中，并将其初始化为0。该函数返回一个包含两个项目的数组。我们通过使用之前提到过的解构赋值语法将这些项赋值给变量_counter_和_setCounter_。

<!-- The _counter_ variable is assigned the initial value of <i>state</i> which is zero. The variable _setCounter_ is assigned to a function that will be used to <i>modify the state</i>.-->
_counter_变量被赋了<i>状态</i>的初始值，即0。变量_setCounter_被赋了一个用来<i>修改状态</i>的函数。

<!-- The application calls the [setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) function and passes it two parameters: a function to increment the counter state and a timeout of one second:-->
应用调用[setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout)函数并传递给它两个参数：一个用于增加计数器的状态的函数，和一个一秒钟的定时。

```js
setTimeout(
  () => setCounter(counter + 1),
  1000
)
```

<!-- The function passed as the first parameter to the _setTimeout_ function is invoked one second after calling the _setTimeout_ function-->
作为第一个参数传递给_setTimeout_函数的函数在调用_setTimeout_函数一秒钟后被调用

```js
() => setCounter(counter + 1)
```

<!-- When the state modifying function _setCounter_ is called, <i>React re-renders the component</i> which means that the function body of the component function gets re-executed:-->
当修改状态的函数_setCounter_被调用时，<i>React重新渲染组件</i>，这意味着重新执行组件函数的函数体：

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

<!-- The second time the component function is executed it calls the _useState_ function and returns the new value of the state: 1. Executing the function body again also makes a new function call to _setTimeout_, which executes the one-second timeout and increments the _counter_ state again. Because the value of the _counter_ variable is 1, incrementing the value by 1 is essentially the same as an expression setting the value of _counter_ to 2. -->
第二次执行组件函数时，它会调用_useState_函数并返回状态的新值：1。再次执行函数体的时候，也会再一次调用_setTimeout_，等待一秒钟后再次增加状态_counter_的值。因为变量_counter_的值是1，将值增加1等价于将_counter_的值设为2。

```js
() => setCounter(2)
```

<!-- Meanwhile, the old value of _counter_ - "1" - is rendered to the screen.-->
同时，_counter_的旧值——“1”——被渲染在屏幕上。

<!-- Every time the _setCounter_  modifies the state it causes the component to re-render. The value of the state will be incremented again after one second, and this will continue to repeat for as long as the application is running.-->
每次_setCounter_修改状态都会导致组件被重新渲染。一秒钟后，状态的值将被再次增加，只要应用在运行，这个过程就会一直重复下去。

<!-- If the component doesn't render when you think it should, or if it renders at the "wrong time", you can debug the application by logging the values of the component's variables to the console. If we make the following additions to our code:-->
如果组件在你认为应该渲染的时候没有渲染，或者在“错误的时间”渲染，你可以通过将组件的变量值记录到控制台来调试应用。如果我们对我们的代码做如下补充：

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
就能轻易跟踪对<i>App</i>组件的渲染函数的调用：

![](../../images/1/4e.png)

<!-- Was your browser console open? If it wasn't, then promise that this was the last time you need to be reminded about it. -->
浏览器的控制台开了吗？如果没开，保证这是你最后一次需要提醒了。

<!-- ### Event handling -->
### 事件处理

<!-- We have already mentioned <i>event handlers</i> that are registered to be called when specific events occur a few times in [part 0](/en/part0). E.g. a user's interaction with the different elements of a web page can cause a collection of various different kinds of events to be triggered.-->
我们在[第0章节](/zh/part0)中已经提到了<i>事件处理函数</i>，也就是注册到程序中，让程序在特定事件发生时调用的函数。例如，用户与网页中不同元素的交互会触发一系列不同类型的事件。

<!-- Let's change the application so that increasing the counter happens when a user clicks a button, which is implemented with the [button](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) element.-->
让我们改变应用，让计数器在用户点击按钮时增加，这是用[button](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button)元素实现的。

<!-- Button elements support so-called [mouse events](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent), of which [click](https://developer.mozilla.org/en-US/docs/Web/Events/click) is the most common event. The click event on a button can also be triggered with the keyboard or a touch screen despite the name <i>mouse event</i>.-->
button元素支持所谓的[鼠标事件](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent)，其中[点击](https://developer.mozilla.org/en-US/docs/Web/Events/click)是最常见的一种。尽管名字叫<i>鼠标事件</i>，它也可以通过键盘或触摸屏来触发。

<!-- In React, [registering an event handler function](https://react.dev/learn/responding-to-events) to the <i>click</i> event happens like this:-->
在React中，为<i>点击</i>事件[注册一个事件处理函数](https://react.dev/learn/responding-to-events)是这样的：

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

<!-- We set the value of the button's <i>onClick</i> attribute to be a reference to the _handleClick_ function defined in the code.-->
我们将按钮的<i>onClick</i>属性的值设为对代码中定义的_handleClick_函数的引用。

<!-- Now every click of the <i>plus</i> button causes the _handleClick_ function to be called, meaning that every click event will log a <i>clicked</i> message to the browser console.-->
现在每次点击<i>plus</i>按钮都会调用_handleClick_函数，这意味着每次点击事件都会向浏览器控制台记录一条<i>clicked</i>消息。

<!-- The event handler function can also be defined directly in the value assignment of the onClick-attribute:-->
事件处理函数也可以直接在onClick属性的赋值中定义：

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
通过改变事件处理函数为以下形式

```js
<button onClick={() => setCounter(counter + 1)}>
  plus
</button>
```

<!-- we achieve the desired behavior, meaning that the value of _counter_ is increased by one <i>and</i> the component gets re-rendered.-->
我们实现了期望的行为，也就是说，_counter_的值增加了1<i>并且</i>组件被重新渲染了。

<!-- Let's also add a button for resetting the counter:-->
我们还可以添加一个按钮来重置计数器：

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
我们的应用现在已经准备好了！

<!-- ### An event handler is a function -->
### 事件处理函数是一个函数

<!-- We define the event handlers for our buttons where we declare their <i>onClick</i> attributes:-->
我们为在声明我们的按钮的<i>onClick</i>属性的地方定义事件处理函数：

```js
<button onClick={() => setCounter(counter + 1)}>
  plus
</button>
```

<!-- What if we tried to define the event handlers in a simpler form?-->
如果我们试图以更简单的形式来定义事件处理函数呢？

```js
<button onClick={setCounter(counter + 1)}>
  plus
</button>
```

<!-- This would completely break our application:-->
这将完全破坏我们的应用：

![](../../images/1/5c.png)

<!-- What's going on? An event handler is supposed to be either a <i>function</i> or a <i>function reference</i>, and when we write:-->
这是怎么回事？一个事件处理函数应该是一个<i>函数</i>或者一个<i>函数引用</i>，而当我们写：

```js
<button onClick={setCounter(counter + 1)}>
```

<!-- the event handler is actually a <i>function call</i>. In many situations this is ok, but not in this particular situation. In the beginning the value of the <i>counter</i> variable is 0. When React renders the component for the first time, it executes the function call <em>setCounter(0+1)</em>, and changes the value of the component's state to 1.-->
事件处理函数实际上是一个<i>函数调用</i>。在很多情况下这是可以的，但在这种特殊情况下就不行了。在一开始，<i>counter</i>变量的值是0。当React第一次渲染组件时，它执行了函数调用<em>setCounter(0+1)</em>，并将组件的状态值改为1。
<!-- This will cause the component to be re-rendered, React will execute the setCounter function call again, and the state will change leading to another rerender...-->
这将导致该组件被重新渲染，React将再次执行setCounter函数调用，然后状态将改变，导致再次重新渲染……

<!-- Let's define the event handlers like we did before:-->
让我们像之前那样定义事件处理函数：

```js
<button onClick={() => setCounter(counter + 1)}>
  plus
</button>
```

<!-- Now the button's attribute which defines what happens when the button is clicked - <i>onClick</i> - has the value _() => setCounter(counter + 1)_.-->
现在按钮的属性定义了当按钮被点击时发生的事情 —— <i>onClick</i> —— 其值为 _() => setCounter(counter + 1)_。
<!-- The setCounter function is called only when a user clicks the button.-->
只有当用户点击按钮时，才会调用setCounter函数。

<!-- Usually defining event handlers within JSX-templates is not a good idea.-->
通常在JSX模板中定义事件处理函数并不是一个好主意。
<!-- Here it's ok, because our event handlers are so simple.-->
这里可以，因为我们的事件处理函数非常简单。

<!-- Let's separate the event handlers into separate functions anyway:-->
无论如何，让我们把事件处理函数分离成专门的函数：

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
在这里，事件处理函数已经被正确定义。<i>onClick</i>属性的值是一个包含对一个函数的引用的变量：

```js
<button onClick={increaseByOne}>
  plus
</button>
```

<!-- ### Passing state - to child components -->
### 向子组件传递状态

<!-- It's recommended to write React components that are small and reusable across the application and even across projects. Let's refactor our application so that it's composed of three smaller components, one component for displaying the counter and two components for buttons.-->
建议编写的React组件要小，并且可以在整个应用甚至项目中重用。让我们重构我们的应用，使其由三个小的组件组成，一个组件用于显示计数器，两个组件用于按钮。

<!-- Let's first implement a <i>Display</i> component that's responsible for displaying the value of the counter.-->
让我们首先实现一个<i>Display</i>组件，负责显示计数器的值。

<!-- One best practice in React is to [lift the state up](https://react.dev/learn/sharing-state-between-components) in the component hierarchy. The documentation says:-->
React的一个最佳做法是在组件结构中[提升状态](https://react.dev/learn/sharing-state-between-components)。文档中说：

<!-- > <i>Often, several components need to reflect the same changing data. We recommend lifting the shared state up to their closest common ancestor.</i>-->
> <i>通常，几个组件需要反映相同的变化数据。我们建议将共享状态提升到它们最接近的共同祖先。</i>

<!-- So let's place the application's state in the <i>App</i> component and pass it down to the <i>Display</i> component through <i>props</i>:-->
所以让我们把应用的状态放在<i>App</i>组件中，并通过<i>props</i>把它传递给<i>Display</i>组件：

```js
const Display = (props) => {
  return (
    <div>{props.counter}</div>
  )
}
```

<!-- Using the component is straightforward, as we only need to pass the state of the _counter_ to it:-->
组件的使用很简单，因为我们只需要将_counter_的状态传递给它：

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
一切仍在运作。当按钮被点击，<i>App</i>被重新渲染时，它所有的子节点包括<i>Display</i>组件也被重新渲染。

<!-- Next, let's make a <i>Button</i> component for the buttons of our application. We have to pass the event handler as well as the title of the button through the component's props:-->
接下来，让我们为我们应用的按钮制作一个<i>Button</i>组件。我们必须通过组件的props来传递事件处理函数以及按钮的标题。

```js
const Button = (props) => {
  return (
    <button onClick={props.onClick}>
      {props.text}
    </button>
  )
}
```

<!-- Our <i>App</i> component now looks like this:-->
我们的<i>App</i>组件现在是这样：

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
        onClick={increaseByOne}
        text='plus'
      />
      <Button
        onClick={setToZero}
        text='zero'
      />
      <Button
        onClick={decreaseByOne}
        text='minus'
      />
      // highlight-end
    </div>
  )
}
```

<!-- Since we now have an easily reusable <i>Button</i> component, we've also implemented new functionality into our application by adding a button that can be used to decrement the counter.-->
既然我们现在有了一个易于重用的<i>按钮</i>组件，我们也在我们的应用中实现了新的功能，增加了一个可以用来减少计数器值的按钮。

<!-- The event handler is passed to the <i>Button</i> component through the _onClick_ prop. When creating your own components, you can theoretically choose the prop name freely. However, our naming choice for the event handler was not entirely arbitrary. -->
事件处理函数是通过_onClick_ props传递给<i>Button</i>组件的。在构建自己的组件时，理论上你可以随意命名props的名称。但我们为事件处理函数的命名并不是随便选的。

<!-- React's own official [tutorial](https://react.dev/learn/tutorial-tic-tac-toe) suggests: -->
React的官方[教程](https://react.dev/learn/tutorial-tic-tac-toe)是这样建议的：
<!-- "In React, it’s conventional to use _onSomething_ names for props which take functions which handle events and _handleSomething_ for the actual function definitions which handle those events." -->
“在React中，通常使用_onSomething_命名代表事件的props，使用_handleSomething_命名处理这些事件的函数。”

<!-- ### Changes in state cause rerendering -->
### 状态的改变会导致重新渲染

<!-- Let's go over the main principles of how an application works once more.-->
让我们再次回顾一下应用运行的主要原理。

<!-- When the application starts, the code in _App_ is executed. This code uses a [useState](https://react.dev/reference/react/useState) hook to create the application state, setting an initial value of the variable _counter_.-->
当应用启动时，_App_中的代码被执行。这段代码使用一个[useState](https://react.dev/reference/react/useState) hook来创建应用的状态，设置变量_counter_的初始值。
<!-- This component contains the _Display_ component - which displays the counter's value, 0 - and three _Button_ components. The buttons all have event handlers, which are used to change the state of the counter.-->
这个组件包含_Display_组件——用来显示计数器的值，0——和三个_Button_组件。所有按钮都有事件处理函数，用来改变计数器的状态。

<!-- When one of the buttons is clicked, the event handler is executed. The event handler changes the state of the _App_ component with the _setCounter_ function.-->
当其中一个按钮被点击时，事件处理函数被执行。该事件处理函数通过_setCounter_函数改变_App_组件的状态。
<!-- **Calling a function which changes the state causes the component to rerender.**-->
**调用一个改变状态的函数会导致组件重新渲染。**

<!-- So, if a user clicks the <i>plus</i> button, the button's event handler changes the value of _counter_ to 1, and the _App_ component is rerendered.-->
所以，如果用户点击了<i>plus</i>按钮，按钮的事件处理函数将_counter_的值改为1，然后_App_组件被重新渲染。
<!-- This causes its subcomponents _Display_ and _Button_ to also be re-rendered.-->
这会导致其子组件_Display_和_Button_也被重新渲染。
<!-- _Display_ receives the new value of the counter, 1, as props. The _Button_ components receive event handlers which can be used to change the state of the counter.-->
_Display_接收计数器的新值，1，作为props。_Button_组件接收事件处理函数，用来改变计数器的状态。

<!-- To be sure to understand how the program works, let us add some _console.log_ statements to it -->
为了更好地理解程序是怎么运行的，让我们向其中添加一些_console.log_语句

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
      <Button onClick={increaseByOne} text="plus" />
      <Button onClick={setToZero} text="zero" />
      <Button onClick={decreaseByOne} text="minus" />
    </div>
  )
} 
```

<!-- Let us now see what gets rendered to the console when the buttons plus, zero and minus are pressed: -->
让我们看看，当按下plus、zero和minus按钮时，控制台里显示了什么：

![](../../images/1/31.png)

<!-- Do not ever try to guess what your code does. It is just better to use _console.log_ and <i>see with your own eyes</i> what it does. -->
永远不要去猜你的代码做了什么。用_console.log_，然后<i>用你自己的眼睛去看</i>它做了些什么总是更好。

<!-- ### Refactoring the components -->
### 重构组件

<!-- The component displaying the value of the counter is as follows:-->
显示计数器值的组件如下：

```js
const Display = (props) => {
  return (
    <div>{props.counter}</div>
  )
}
```

<!-- The component only uses the _counter_ field of its <i>props</i>.-->
该组件只使用其<i>props</i>的_counter_字段。
<!-- This means we can simplify the component by using [destructuring](/en/part1/component_state_event_handlers#destructuring), like so:-->
这意味着我们可以通过使用[解构](/zh/part1/组件状态，事件处理#解构)来简化组件，像这样：

```js
const Display = ({ counter }) => {
  return (
    <div>{counter}</div>
  )
}
```

<!-- The function defining the component contains only the return statement, so we can define the function using the more compact form of arrow functions: -->
定义该组件的函数只包含返回语句，所以我们可以用箭头函数更紧凑的形式来定义这个函数：

```js
const Display = ({ counter }) => <div>{counter}</div>
```

<!-- We can simplify the Button component as well.-->
我们也可以简化Button组件。

```js
const Button = (props) => {
  return (
    <button onClick={props.onClick}>
      {props.text}
    </button>
  )
}
```

<!-- We can use destructuring to get only the required fields from <i>props</i>, and use the more compact form of arrow functions:-->
我们可以使用解构来只取<i>props</i>中所需的字段，并使用更紧凑的箭头函数形式：

```js
const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>
```

<!-- This approach works because the component contains only a single return statement, making it possible to use the concise arrow function syntax. -->
这样处理也能运行，因为组件只包含一条return语句，所以可以使用更简洁的箭头函数语法。

</div>
