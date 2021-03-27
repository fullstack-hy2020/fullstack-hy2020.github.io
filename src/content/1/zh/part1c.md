---
mainImage: ../../../images/part-1.svg
part: 1
letter: c
lang: zh
---

<div class="content">
<!-- Let's go back to working with React. -->
让我们回到 React。

<!-- We start with a new example: -->
我们从一个新的例子开始:

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
【组件辅助函数】
<!-- Let's expand our <i>Hello</i> component so that it guesses the year of birth of the person being greeted: -->
让我们扩展一下<i>Hello</i> 组件，让它能猜到被问候(greeted)者的出生年份:

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



<!-- The logic for guessing the year of birth is separated into its own function that is called when the component is rendered. -->
猜测出生年份的逻辑被放到了它自己的函数中，这个函数会在渲染组件时被调用。

<!-- The person's age does not have to be passed as a parameter to the function, since it can directly access all props that are passed to the component. -->
用户的年龄不必单独作为参数传递给函数，因为它可以直接访问传递给组件的所有props。

<!-- If we examine our current code closely, we'll notice that the helper function is actually defined inside of another function that defines the behavior of our component. In Java programming, defining a function inside another one is complex and cumbersome, so not all that common. In JavaScript, however, defining functions within functions is a commonly-used technique. -->

如果仔细观察当前代码，我们会注意到这种辅助函数实际上是在另一个函数中定义的，而这个函数是我们用来定义组件行为的。 在 java 中，在一个函数中定义另一个函数是复杂且笨重的，但在 JavaScript 中，在函数中定义函数是一种常规操作。

### Destructuring 
【解构】
<!-- Before we move forward, we will take a look at a small but useful feature of the JavaScript language that was added in the ES6 specification, that allows us to [destructure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) values from objects and arrays upon assignment. -->

在我们继续之前，我们将看一看 JavaScript 在 ES6规范中添加的的一个很小、但是有用的特性，它允许我们在赋值时从对象和数组中[解构](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)出值。

<!-- In our previous code, we had to reference the data passed to our component as _props.name_ and _props.age_. Of these two expressions we had to repeat _props.age_ twice in our code. -->
在前面的代码中，我们必须将 props.name 和 props.age 传递给组件让组件来引用。 在这两个表达式中，我们必须在代码中重复 props.age 两次。

<!-- Since <i>props</i> is an object -->
因为<i>props</i> 是一个对象

```js
props = {
  name: 'Arto Hellas',
  age: 35,
}
```

<!-- we can streamline our component by assigning the values of the properties directly into two variables _name_ and _age_ which we can then use in our code: -->

我们可以通过将属性值直接赋值为两个变量， name 和 age 来简化我们的组件，然后我们可以在代码中使用这两个变量:

```js
const Hello = (props) => {
  // highlight-start
  const name = props.name
  const age = props.age
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

<!-- Note that we've also utilized the more compact syntax for arrow functions when defining the _bornYear_ function. As mentioned earlier, if an arrow function consists of a single command, then the function body does not need to be written inside of curly braces. In this more compact form, the function simply returns the result of the single command. -->
注意，在定义 bornYear 函数时，我们为箭头函数使用了更紧凑的语法。 如前所述，如果一个箭头函数由单个表达式组成，那么函数体就不需要用花括号括起来。 在这种更紧凑的形式中，函数只返回单个表达式的结果。

<!-- To recap, the two function definitions shown below are equivalent: -->
也就是说，下面的两个函数定义是等价的:
```js
const bornYear = () => new Date().getFullYear() - age

const bornYear = () => {
  return new Date().getFullYear() - age
}
```

<!-- Destructuring makes the assignment of variables even easier, since we can use it to extract and gather the values of an object's properties into separate variables: -->
解构使变量的赋值变得更加容易，因为我们可以使用它来提取和收集对象属性的值，将其提取到单独的变量中:

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



<!-- If the object we are destructuring has the values -->
如果我们要解构的对象具有值

```js
props = {
  name: 'Arto Hellas',
  age: 35,
}
```

<!-- the expression <em>const { name, age } = props</em> assigns the values 'Arto Hellas' to _name_ and 35 to _age_. -->
表达式 <em>const { name, age } = props</em> 会将值 'Arto Hellas' 赋值给 name，35赋值给 age。

<!-- We can take destructuring a step further: -->
我们可以进一步解构:

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

<!-- The props that are passed to the component are now directly destructured into the variables _name_ and _age_. -->
传递给组件的props现在直接解构为变量 name 和 age。

<!-- This means that instead of assigning the entire props object into a variable called <i>props</i> and then assigning its properties into the variables _name_ and _age_ -->
这意味着不需要将整个 props 对象赋值给一个名为<i>props</i> 的变量中，然后再将其属性分配到变量 name 和 age 中：

```js
const Hello = (props) => {
  const { name, age } = props
```

<!-- we assign the values of the properties directly to variables by destructuring the props object that is passed to the component function as a parameter: -->
我们只需将 props 对象作为参数传递给组件函数，通过对 props 对象的解构，能够直接将属性值赋给变量:

```js
const Hello = ({ name, age }) => {
```

### Page re-rendering 
【页面重渲染】
<!-- So far all of our applications have been such that their appearance remains the same after the initial rendering. What if we wanted to create a counter where the value increased as a function of time or at the click of a button? -->
到目前为止，我们的所有应用都是这样的，即在最初的渲染之后，它们的外观一直是相同的。 如果我们想要创建一个计数器，在这个计数器中的值随着时间的变化而增加，或者点通过击一个按钮而增加，会是什么样呢？

<!-- Let's start with the following body: -->
让我们从下面的代码开始, <i>App.js</i> 内容变成了:

```js
import React from 'react'

const App = (props) => {
  const {counter} = props
  return (
    <div>{counter}</div>
  )
}

export default App
```

<i>index.js</i> 变成了:

```js
import ReactDOM from 'react-dom'
import App from './App'

let counter = 1

ReactDOM.render(
  <App counter={counter} />, 
  document.getElementById('root')
)
```

<!-- **Note** when you change file <i>index.js</i> React does not refresh the page automatically so you need to relead the browser page to get the new content shown. -->
注意，当你修改 <i>index.js</i> 文件时， React 并不会自动刷新，所以你需要重新加载浏览器页面，新的内容才会展示出来。

<!-- The root component is given the value of the counter in the _counter_ prop. The root component renders the value to the screen. But what happens when the value of _counter_ changes? Even if we were to add the command -->
App 组件通过counter属性，接收到counter的值。 根组件随即将值渲染到屏幕上。 当计数器的值发生变化时会发生什么呢？ 即，如果我们要添加命令

```js
counter += 1
```

<!-- the component won't re-render. We can get the component to re-render by calling the _ReactDOM.render_ method a second time, e.g. in the following way: -->
部件并不会重新渲染。 我们可以通过再次调用 ReactDOM.render 方法让组件重新渲染，例如:

```js
let counter = 1

const refresh = () => {
  ReactDOM.render(<App counter={counter} />, 
  document.getElementById('root'))
}

refresh()
counter += 1
refresh()
counter += 1
refresh()
```

<!-- The re-rendering command has been wrapped inside of the _refresh_ function to cut down on the amount of copy-pasted code. -->
重新渲染命令被包装在了 _refresh_ 函数中，以减少复制粘贴代码的数量。

<!-- Now the component  <i>renders three times</i>, first with the value 1, then 2, and finally 3. However, the values 1 and 2 are displayed on the screen for such a short amount of time that they can't be witnessed. -->
现在，组件<i>渲染了三次</i>，值由1、2最终变成了3。 但是，值1和2在屏幕上显示的时间非常短，因此无法注意到它们。

<!-- We can implement slightly more interesting functionality by re-rendering and incrementing the counter every second by using [setInterval](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval): -->
我们可以通过使用 [setInterval](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval)，通过每隔一秒来重渲染一次并让计数器+1，来实现这个有趣的功能 :

```js
setInterval(() => {
  refresh()
  counter += 1
}, 1000)
```

<!-- Making repeated calls to the _ReactDOM.render_-method is not the recommended way to re-render components. Next, we'll introduce a better way of accomplishing this effect. -->
重复调用 _ReactDOM.render_-方法并不是重新渲染组件的推荐方法。 接下来，我们将介绍一种更好的，实现相同效果的方法。

### Stateful component
【有状态组件】
<!-- All of our components up till now have been simple in the sense that they have not contained any state that could change during the lifecycle of the component. -->
到目前为止，我们的所有组件都很简单，因为它们没有包含任何组件（生命周期中可能变化）的状态。

<!-- Next, let's add state to our application's <i>App</i> component with the help of React's [state hook](https://reactjs.org/docs/hooks-state.html). -->
接下来，让我们通过 React 的  [state hook](https://reactjs.org/docs/hooks-state.html) 向应用的<i>App</i> 组件中添加状态。

<!-- We will change the application as follows.  <i>index.js</i> goes back to -->
我们会把应用做如下修改， <i>index.js</i> 重新变成了：
```js
import ReactDOM from 'react-dom'
import App from './App'

ReactDOM.render(<App />, 
document.getElementById('root'))
```
<!-- and <i>App.js</i> changes to the following: -->
<i>App.js</i> 变成了：

```js
import React, { useState } from 'react' // highlight-line

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

<!-- In the first row, the application imports the _useState_-function: -->
在第一行中，文件导入了 useState 函数:

```js
import React, { useState } from 'react'
```

<!-- The function body that defines the component begins with the function call: -->
定义组件的函数体以如下函数调用开始:

```js
const [ counter, setCounter ] = useState(0)
```

<!-- The function call adds <i>state</i> to the component and renders it initialized with the value of zero. The function returns an array that contains two items. We assign the items to the variables _counter_ and _setCounter_ by using the destructuring assignment syntax shown earlier. -->
函数调用将<i>state</i> 添加到组件，并将其值用0进行初始化。 该函数返回一个包含两个元素的数组。 我们使用前面所讲的解构赋值语法将元素分配给变量 _counter_ 和 _setCounter_ 。

<!-- The _counter_ variable is assigned the initial value of <i>state</i> which is zero. The variable _setCounter_ is assigned to a function that will be used to <i>modify the state</i>. -->
 _counter_ 变量被赋予的初始值<i>state</i> 为零。 变量 setCounter 被分配给一个函数，该函数将用于<i>修改 state</i>。

<!-- The application calls the [setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) function and passes it two parameters: a function to increment the counter state and a timeout of one second: -->
这个应用调用[setTimeout](https://developer.mozilla.org/en-us/docs/web/api/windoworworkerglobalscope/setTimeout)函数，并传递给它两个参数: 第一个是增加计数器状态的函数，第二个是1秒钟的超时设置:

```js
setTimeout(
  () => setCounter(counter + 1),
  1000
)
```

<!-- The function passed as the first parameter to the _setTimeout_ function is invoked one second after calling the _setTimeout_ function -->
函数作为第一个参数传递给 setTimeout ，并会在调用 setTimeout 函数一秒钟后被调用

```js
() => setCounter(counter + 1)
```

<!-- When the state modifying function _setCounter_ is called, <i>React re-renders the component</i> which means that the function body of the component function gets re-executed: -->
当状态修改函数—— setCounter 被调用时， <i>React 重新渲染了这个组件</i> ，这意味着组件函数的函数体被重新执行:

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

<!-- The second time the component function is executed it calls the _useState_ function and returns the new value of the state: 1. Executing the function body again also makes a new function call to _setTimeout_, which executes the one second timeout and increments the _counter_ state again. Because the value of the _counter_ variable is 1, incrementing the value by 1 is essentially the same as a command setting the state _counter_ value to 2. -->

第二次执行组件函数时，它调用了 useState 函数返回的新状态值: 1。 再次执行函数体还会对 setTimeout 进行一次新的函数调用，它会执行一秒钟的超时并再次递增计数器状态。 由于counter变量的值现在是1，所以将该值增加1本质上等同于将计数器的状态值设置为2。

```js
() => setCounter(2)
```

<!--  Meanwhile, the old value of _counter_,  "1", is rendered to the screen. -->
与此同时，计数器的旧值“1”被渲染到了屏幕上。

<!-- Every time the _setCounter_  modifies the state it causes the component to re-render. The value of the state will be incremented again after one second, and this will continue to repeat for as long as the application is running. -->
每次 setCounter 修改状态时，它都会导致组件重新渲染。 状态的值将在一秒钟后再次递增，并且在应用运行期间循环往复。

<!-- If the component doesn't render when you think it should, or if it renders at the "wrong time", you can debug the application by logging the values of the component's variables to the console. If we make the following additions to our code: -->
如果组件在该渲染时没有渲染，或者在“错误的时间”进行了渲染，您可以通过将组件变量的值打印到控制台来调试应用。 如果我们在代码中添加了如下内容:

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

<!-- It's easy to follow and track the calls made to the  <i>App</i> component's render  function: -->
很容易就能跟踪和捕获到<i>App</i> 组件 render 函数的调用：

![](../../images/1/4e.png)


### Event handling
【事件处理】
<!-- We have already mentioned <i>event handlers</i> a few times in [第0章](/zh/part0), that are registered to be called when specific events occur. E.g. a user's interaction with the different elements of a web page can cause a collection of various different kinds of events to be triggered. -->
我们已经在[第0章](/zh/part0)中多次提到<i>事件处理程序</i>，它们（被注册为）在特定事件发生时进行调用。 例如，用户与一个网页的不同元素的交互可能会触发一系列不同类型的事件。

<!-- Let's change the application so that increasing the counter happens when a user clicks a button, which is implemented with the [button](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button)-element. -->
让我们修改一下应用，这样当用户单击一个按钮时，计数器就会增加，这可以通过[button](https://developer.mozilla.org/en-us/docs/web/html/element/button)-元素实现的。

<!-- Button-elements support so-called [mouse events](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent), of which [click](https://developer.mozilla.org/en-US/docs/Web/Events/click) is the most common event. -->
button-元素支持所谓的[鼠标事件](https://developer.mozilla.org/en-us/docs/web/api/mouseevent 事件) ，其中[点击](https://developer.mozilla.org/en-us/docs/web/events/click 事件)是最常见的事件。

<!-- In React, registering an event handler function to the <i>click</i> event [happens](https://reactjs.org/docs/handling-events.html) like this: -->
在 React 中，将一个事件处理函数注册到<i>click</i> 事件 [发生](https://reactjs.org/docs/handling-events.html) 时，如下：

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

<!-- We set the value of the button's <i>onClick</i>-attribute to be a reference to the _handleClick_ function defined in the code. -->
我们将按钮的<i>onClick</i> 属性 的值设置为 handleClick 函数的引用。

<!-- Now every click of the <i>plus</i> button causes the _handleClick_ function to be called, meaning that every click event will log a <i>clicked</i> message to the browser console. -->
现在，每次单击<i>plus</i> 按钮都会调用 handleClick 函数，这意味着每次单击事件都会将<i>clicked</i> 消息打印到浏览器控制台。

<!-- The event handler function can also be defined directly in the value assignment of the onClick-attribute: -->
事件处理函数也可以在 onClick 属性的值中直接定义:

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

<!-- By changing the event handler to the following form -->
将事件处理程序更改为如下形式：

```js
<button onClick={() => setCounter(counter + 1)}>
  plus
</button>
```

<!-- we achieve the desired behavior, meaning that the value of _counter_ is increased by one <i>and</i> the component gets re-rendered. -->
我们实现了预期，也就是计数器的值增加了1，而且组件被重新渲染。

<!-- Let's also add a button for resetting the counter: -->
让我们再添加一个重置计数器的按钮:

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

<!-- Our application is now ready! -->
现在我们的应用已经准备好了！





### Event handler is a function
【事件处理是一个函数】
<!-- We define the event handlers for our buttons where we declare their <i>onClick</i> attributes: -->
我们为按钮定义事件处理程序，声明它们的 <i>onClick</i> 属性:

```js
<button onClick={() => setCounter(counter + 1)}> 
  plus
</button>
```


<!-- What if we'd try to define the event handlers in a simpler form? -->
如果我们尝试以更简单的形式定义事件处理，应该怎样定义呢？

```js
<button onClick={setCounter(counter + 1)}> 
  plus
</button>
```


<!-- This would completely break our application: -->
我们的应用崩了:

![](../../images/1/5b.png)



<!-- What's going on? An event handler is supposed to be either a <i>function</i> or a <i>function reference</i>, and when we write -->
怎么回事？事件处理程序应该是一个<i>函数</i> 或一个<i>函数引用</i>，当我们编写时:

```js
<button onClick={setCounter(counter + 1)}>
```


<!-- the event handler is actually a <i>function call</i>. In many situations this is ok, but not in this particular situation. In the beginning the value of the <i>counter</i> variable is 0. When React renders the method for the first time, it exectues the function call <em>setCounter(0+1)</em>, and changes the value of the component's state to 1.  -->

事件处理器实际上被定义成了一个<i>函数调用</i>。 在很多情况下这是可行的，但在这种特殊情况下就不行了。 一开始<i>counter</i> 变量的值是0。 当 React 第一次渲染时，它执行函数调用<em>setCounter(0+1)</em>，并将组件状态的值更改为1。

<!-- This will cause the component to be rerendered, react will execute the setCounter function call again, and the state will change leading to another rerender... -->
这将导致组件重新渲染，React 将再次执行 setCounter 函数调用，并且状态将发生变化，从而导致另一个重新运行...

<!-- Let's define the event handlers like we did before -->
让我们像之前那样定义事件处理程序

```js
<button onClick={() => setCounter(counter + 1)}> 
  plus
</button>
```

<!-- Now the button's attribute which defines what happens when the button is clicked, <i>onClick</i>, has the value _() => setCounter(counter +1)_. -->
现在，按钮的属性定义了单击按钮时发生的事情，<i>onClick</i>的值为 _() => setCounter(counter +1)_。

<!-- The setCounter function is called only when a user clicks the button.  -->
只有当用户单击按钮时才会调用 setCounter 函数。



<!-- Usually defining event handlers within JSX-templates is not a good idea.  -->
通常在 JSX-模板 中定义事件处理程序并不是一个好的实践。

<!-- Here it's ok, because our event handlers are so simple.  -->
但这里没问题，因为我们的事件处理程序非常简单。

<!-- Let's separate the event handlers into separate functions anyway:  -->
但无论如何，让我们将事件处理程序分离成单独的函数:

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



<!-- Here, the event handlers have been defined correctly. The value of the <i>onClick</i> attribute is a variable containing a reference to a function: -->
这里就正确定义了事件处理。<i>onClick</i> 属性的值是一个包含函数引用的变量:

```js
<button onClick={increaseByOne}> 
  plus
</button>
```

### Passing state to child components
【将状态传递给子组件】
<!-- It's recommended to write React components that are small and reusable across the application and even across projects. Let's refactor our application so that it's composed of three smaller components, one component for displaying the counter and two components for buttons. -->
十分建议编写跨应用甚至跨项目的、小型且可重用的 React 组件。 让我们重构我们的应用，使它由三个较小的组件组成，一个组件用于显示计数器，两个组件用于显示按钮。

<!-- Let's first implement a <i>Display</i> component that's responsible for displaying the value of the counter. -->
让我们首先实现一个<i>Display</i> 组件，它负责显示计数器的值。

<!-- One best practice in React is to [lift the state up](https://reactjs.org/docs/lifting-state-up.html) high enough in the component hierarchy. The documentation says: -->
在 React 中的一个最佳实践是将 [状态提升](https://reactjs.org/docs/lifting-state-up.html) ，提升到组件层次结构中足够高的位置，文档中是这么说的：

> <i>Often, several components need to reflect the same changing data. We recommend lifting the shared state up to their closest common ancestor.</i>
通常，几个组件需要反映相同的变化数据。 我们建议将共享状态提升到它们最接近的共同祖先。 

<!-- So let's place the application's state in the <i>App</i> component and pass it down to the <i>Display</i> component through <i>props</i>: -->
因此，让我们将应用的状态放在<i>App</i> 组件中，并通过<i>props</i> 将其传递给<i>Display</i> 组件:

```js
const Display = (props) => {
  return (
    <div>{props.counter}</div>
  )
}
```


<!-- Using the component is straightforward, as we only need to pass the state of the _counter_ to component: -->
使用组件很简单，因为我们只需要将计数器的状态传递给组件即可:

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

<!-- Everything still works. When the buttons are clicked and the <i>App</i> gets re-rendered, all of its children including the <i>Display</i> component are also re-rendered. -->
一切仍然正常。 当单击按钮并重新渲染<i>App</i> 时，其所有子元素(包括<i>Display</i> 组件)也将重新渲染。

<!-- Next, let's make a <i>Button</i> component for the buttons of our application. We have to pass the event handler as well as the title of the button through the component's props: -->

接下来，让我们为应用的按钮制作一个<i>Button</i> 组件。 我们必须通过组件的props传递事件处理程序以及按钮的标题:

```js
const Button = (props) => {
  return (
    <button onClick={props.handleClick}>
      {props.text}
    </button>
  )
}
```

<!-- Our <i>App</i> component now looks like this: -->
我们的<i>App</i> 组件现在看起来像这样:

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

<!-- Since we now have an easily reusable <i>Button</i> component, we've also implemented new functionality into our application by adding a button that can be used to decrement the counter. -->

由于我们现在有一个易于重用的<i>Button</i> 组件，我们还可以通过添加一个可用于减法的计数器按钮，为应用实现一个新功能。

<!-- The event handler is passed to the <i>Button</i> component through the _onClick_ prop. The name of the prop itself is not that significant, but our naming choice wasn't completely random, e.g. React's own official [tutorial](https://reactjs.org/tutorial/tutorial.html) suggests this convention. -->
事件处理程序通过_onClick_ 属性传递给<i>Button</i> 组件。 props的名字本身并不重要，但是我们的命名选择并不是完全随机的，例如 React 自己的[官方教程](https://reactjs.org/tutorial/tutorial.html)就建议了这些约定。

### Changes in state cause rerendering
【状态的改变导致重新渲染】

<!-- Let's go over the main principles of how an application works once more. -->
让我们再次回顾一下应用如何工作的主要内容。

<!-- When the application starts, the code in _App_ is executed. This code uses an [useState](https://reactjs.org/docs/hooks-reference.html#usestate) - hook to create the application state - value of the counter _counter_. -->

当应用启动时，执行 App 中的代码。 此代码使用[useState](https://reactjs.org/docs/hooks-reference.html#useState) hook 创建了计数器的应用状态初始值 _counter_。

<!-- This component contains the _Display_ component - which displays the counter's value, 0 - and two _Button_ components. The buttons all have event handlers, which are used to change the state of the counter. -->
该组件包含  _Display_  组件， 显示了当前的计数为0 ， 以及两个  _Button_  组件。button 都包含事件处理，用来改变计数器的状态。

<!-- When one of the buttons is clicked, the event handler is executed. The event handler changes the state of the _App_ component with the _setCounter_ function.  -->
当单击其中一个按钮时，将执行事件处理程序。 事件处理程序使用 setCounter 函数更改 App 组件的状态。

<!-- Calling a function which changes the state causes the component to rerender. -->

调用一个改变状态的函数会导致组件的重新渲染。 



<!-- So, if a user clicks the <i>plus</i> button, the button's event handler changes the value of _counter_ to 1, and the _App_ component is rerendered.  -->
因此，如果用户单击<i>plus</i> 按钮，按钮的事件处理程序将 counter 的值更改为1，并重新渲染 App 组件。

<!-- This causes its subcomponents _Display_ and _Button_ to also be rerendered.  -->
这将导致其子组件 Display 和 Button 也被重新渲染。
<!-- _Display_ receives the new value of the counter, 1, as props. The _Button_ components receive event handlers which can be used to change the state of the counter. -->
_Display_ 接收计数器的新值，1，作为props。 Button 组件接收可用于更改计数器状态的事件处理程序，来改变counter的状态。

### Refactoring the components
【重构组件】
<!-- The component displaying the value of the counter is as follows: -->
显示计数器值的组件如下:

```js
const Display = (props) => {
  return (
    <div>{props.counter}</div>
  )
}
```



<!-- The component only uses the _counter_ field of its <i>props</i>.  -->
该组件只使用其<i>props</i> 的 _counter_ 字段。
<!-- This means we can simplify the component by using [destructuring](/zh/part1/组件状态，事件处理#destructuring) like so: -->
这意味着我们可以使用[解构](/zh/part1/)简化组件，如下所示:

```js
const Display = ({ counter }) => {
  return (
    <div>{counter}</div>
  )
}
```

<!-- The method defining the component contains only the return statement, so -->
定义组件的方法只包含 return 语句，因此

<!-- we can define the method using the more compact form of arrow functions: -->
我们可以使用更紧凑的箭头函数来定义方法:

```js
const Display = ({ counter }) => <div>{counter}</div>
```



<!-- We can simplify the Button component as well. -->
我们也可以简化 Button 组件。

```js
const Button = (props) => {
  return (
    <button onClick={props.handleClick}>
      {props.text}
    </button>
  )
}
```



<!-- We can use destructuring to get only the required fields from <i>props</i>, and use the more compact form of arrow functions: -->
我们可以使用解构，只从<i>props</i> 获取所需的字段，并使用更紧凑的箭头函数:

```js
const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)
```

</div>

