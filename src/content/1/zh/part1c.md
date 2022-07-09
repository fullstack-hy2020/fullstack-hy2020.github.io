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
 我们从一个新的例子开始。

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

<!-- Let's expand our <i>Hello</i> component so that it guesses the year of birth of the person being greeted:-->
 让我们扩展我们的<i>Hello</i>组件，让它猜测被问候者的出生年份。

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
 猜测出生年份的逻辑被分离到一个自己的函数中，在组件渲染时被调用。

<!-- The person's age does not have to be passed as a parameter to the function, since it can directly access all props that are passed to the component.-->
 这个人的年龄不需要作为参数传给函数，因为它可以直接访问传给组件的所有prop。

<!-- If we examine our current code closely, we'll notice that the helper function is actually defined inside of another function that defines the behavior of our component. In Java programming, defining a function inside another one is complex and cumbersome, so not all that common. In JavaScript, however, defining functions within functions is a commonly-used technique.-->
 如果我们仔细检查我们当前的代码，我们会注意到这个辅助函数实际上是定义在另一个函数里面，这个函数定义了我们组件行为。在Java编程中，在另一个函数中定义一个函数是很复杂和麻烦的，所以不是那么常见。然而，在JavaScript中，在函数中定义函数是一种常规操作。

### Destructuring

<!-- Before we move forward, we will take a look at a small but useful feature of the JavaScript language that was added in the ES6 specification, that allows us to [destructure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) values from objects and arrays upon assignment.-->
 在我们继续前进之前，我们将看一下JavaScript语言的一个小但有用的功能，它是在ES6规范中添加的，它允许我们在赋值时从对象和数组中[destructure解构](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)取值。

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
 我们可以通过将属性值直接分配给两个变量_name_和_age_来简化我们的组件，然后我们可以在代码中使用。

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
 注意，在定义_bornYear_函数时，我们也利用了箭头函数的更紧凑的语法。如前所述，如果一个箭头函数由一个表达式组成，那么函数体就不需要写在大括号里。在这种更紧凑的形式下，函数只是返回单个表达式的结果。

<!-- To recap, the two function definitions shown below are equivalent:-->
 简而言之，下面显示的两个函数定义是等价的。
```js
const bornYear = () => new Date().getFullYear() - age

const bornYear = () => {
  return new Date().getFullYear() - age
}
```

<!-- Destructuring makes the assignment of variables even easier, since we can use it to extract and gather the values of an object's properties into separate variables:-->
 解构使得变量的赋值更加容易，因为我们可以用它来提取和收集一个对象的属性值到单独的变量中。

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
 如果我们要解构的对象有以下值
```js
props = {
  name: 'Arto Hellas',
  age: 35,
}
```

<!-- the expression <em>const { name, age } = props</em> assigns the values 'Arto Hellas' to _name_ and 35 to _age_.-->
表达式<em>const { name, age } = props</em> 将'Arto Hellas'的值赋给_name_，将35岁赋给_age_。

<!-- We can take destructuring a step further:-->
 我们可以把解构再向前推进一步。

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
 传递给组件的prop现在被直接解构为变量_name_和_age_。

<!-- This means that instead of assigning the entire props object into a variable called <i>props</i> and then assigning its properties into the variables _name_ and _age_-->
 这意味着我们不是把整个prop对象分配到一个叫做<i>props</i>的变量中，然后再把它的属性分配到变量_name_和_age_中。

```js
const Hello = (props) => {
  const { name, age } = props
```

<!-- we assign the values of the properties directly to variables by destructuring the props object that is passed to the component function as a parameter:-->
 我们通过对作为参数传递给组件函数的props对象进行重构，直接将属性值分配给变量。

```js
const Hello = ({ name, age }) => {
```

### Page re-rendering

<!-- So far all of our applications have been such that their appearance remains the same after the initial rendering. What if we wanted to create a counter where the value increased as a function of time or at the click of a button?-->
 到目前为止，我们所有的应用都是这样的，在最初的渲染之后，其外观保持不变。如果我们想创建一个计数器，其值随着时间的推移或点击按钮而增加呢？

<!-- Let's start with the following. File <i>App.js</i> becomes:-->
 让我们从下面开始。文件<i>App.js</i>变成。

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
 而文件<i>index.js</i>变成了:

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
 App组件通过_counter_prop得到了计数器的值。这个组件将该值渲染到屏幕上。当 _counter_ 的值改变时，会发生什么？即使我们加入以下内容

```js
counter += 1
```

<!-- the component won't re-render. We can get the component to re-render by calling the _render_ method a second time, e.g. in the following way:-->
，该组件也不会重新渲染。我们可以通过第二次调用_render_方法来让组件重新渲染，例如用以下方式。

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
 重复调用_render_方法并不是重新渲染组件的推荐方式。接下来，我们将介绍一种更好的方法来实现这一效果。

### Stateful component

<!-- All of our components up till now have been simple in the sense that they have not contained any state that could change during the lifecycle of the component.-->
 到目前为止，我们所有的组件都是简单的，即它们不包含任何在组件生命周期中可能发生变化的状态。

<!-- Next, let's add state to our application's <i>App</i> component with the help of React's [state hook](https://reactjs.org/docs/hooks-state.html).-->
接下来，让我们在React的[状态钩子](https://reactjs.org/docs/hooks-state.html)的帮助下，给我们的应用的<i>App</i>组件添加状态。

<!-- We will change the application as follows.  <i>index.js</i> goes back to-->
 我们将改变应用的内容如下。  <i>index.js</i>返回到

```js
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

<!-- and <i>App.js</i> changes to the following:-->
 而<i>App.js</i>则改为如下。

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
 定义该组件的函数体以函数调用开始。

```js
const [ counter, setCounter ] = useState(0)
```

<!-- The function call adds <i>state</i> to the component and renders it initialized with the value of zero. The function returns an array that contains two items. We assign the items to the variables _counter_ and _setCounter_ by using the destructuring assignment syntax shown earlier.-->
 该函数调用将<i>state</i>添加到组件中，并将其初始化为0值。该函数返回一个包含两个项目的数组。我们通过使用前面显示的解构赋值语法将这些项目赋值给变量_counter_和_setCounter_。

<!-- The _counter_ variable is assigned the initial value of <i>state</i> which is zero. The variable _setCounter_ is assigned to a function that will be used to <i>modify the state</i>.-->
 _counter_变量被分配了<i>state</i>的初始值，即0。变量_setCounter_被分配给一个函数，该函数将被用来<i>修改状态</i>。

<!-- The application calls the [setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) function and passes it two parameters: a function to increment the counter state and a timeout of one second:-->
 应用调用[setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout)函数并传递给它两个参数：一个用于增加计数器状态的函数和一个一秒钟的超时。

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
当修改状态的函数_setCounter_被调用时，<i>React重新渲染组件</i>，这意味着组件函数的函数体被重新执行。

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

<!-- The second time the component function is executed it calls the _useState_ function and returns the new value of the state: 1. Executing the function body again also makes a new function call to _setTimeout_, which executes the one second timeout and increments the _counter_ state again. Because the value of the _counter_ variable is 1, incrementing the value by 1 is essentially the same as an expression setting the value of _counter_ to 2.-->
 第二次执行组件函数时，它会调用_useState_函数并返回状态的新值。1.再次执行函数体的时候，也会对_setTimeout_进行新的函数调用，执行一秒钟的超时并再次增加_counter_状态。因为_counter_变量的值是1，增加1的值与将_counter_的值设置为2的表达式本质上是一样的。

```js
() => setCounter(2)
```
<!-- Meanwhile, the old value of _counter_ - "1" - is rendered to the screen.-->
同时，_counter_的旧值--"1"--被渲染在屏幕上。

<!-- Every time the _setCounter_  modifies the state it causes the component to re-render. The value of the state will be incremented again after one second, and this will continue to repeat for as long as the application is running.-->
每次_setCounter_修改状态都会导致组件重新渲染。一秒钟后，状态的值将被再次增加，只要应用在运行，这个过程就会一直重复下去。

<!-- If the component doesn't render when you think it should, or if it renders at the "wrong time", you can debug the application by logging the values of the component's variables to the console. If we make the following additions to our code:-->
 如果组件在你认为应该渲染的时候没有渲染，或者在 "错误的时间 "渲染，你可以通过将组件的变量值记录到控制台来调试应用。如果我们对我们的代码做如下补充。

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
 我们可以很容易地跟踪对<i>App</i>组件的渲染函数的调用。

![](../../images/1/4e.png)

### Event handling

<!-- We have already mentioned <i>event handlers</i> that are registered to be called when specific events occur a few times in [part 0](/en/part0). E.g. a user's interaction with the different elements of a web page can cause a collection of various different kinds of events to be triggered.-->
 我们已经提到了<i>事件处理程序</i>，这些程序在[第0章节](/en/part0)中被注册，以便在特定事件发生时被调用。例如，用户与网页中不同元素的交互会导致一系列不同类型的事件被触发。

<!-- Let's change the application so that increasing the counter happens when a user clicks a button, which is implemented with the [button](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) element.-->
 让我们改变应用，使增加计数器在用户点击按钮时发生，这是用[按钮](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button)元素实现的。

<!-- Button elements support so-called [mouse events](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent), of which [click](https://developer.mozilla.org/en-US/docs/Web/Events/click) is the most common event. The click event on a button can also be triggered with the keyboard or a touch screen despite the name <i>mouse event</i>.-->
 按钮元素支持所谓的[鼠标事件](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent)，其中[点击](https://developer.mozilla.org/en-US/docs/Web/Events/click)是最常见的事件。尽管名字叫 "鼠标事件"，但按钮上的点击事件也可以用键盘或触摸屏来触发<i>鼠标事件</i>。

<!-- In React, [registering an event handler function](https://reactjs.org/docs/handling-events.html) to the <i>click</i> event happens like this:-->
在React中，为<i>点击</i>事件[注册一个事件处理函数](https://reactjs.org/docs/handling-events.html)是这样的：

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
 我们将按钮的<i>onClick</i>属性的值设定为对代码中定义的_handleClick_函数的引用。

<!-- Now every click of the <i>plus</i> button causes the _handleClick_ function to be called, meaning that every click event will log a <i>clicked</i> message to the browser console.-->
 现在每次点击<i>plus</i>按钮都会导致_handleClick_函数被调用，这意味着每次点击事件都会向浏览器控制台记录一个<i>clicked</i>消息。

<!-- The event handler function can also be defined directly in the value assignment of the onClick-attribute:-->
事件处理函数也可以直接在onClick-attribute的赋值中定义。

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
通过改变事件处理程序为以下形式
```js
<button onClick={() => setCounter(counter + 1)}>
  plus
</button>
```

<!-- we achieve the desired behavior, meaning that the value of _counter_ is increased by one <i>and</i> the component gets re-rendered.-->
 我们实现了期望的行为，也就是说，_counter_的值增加了一个<i>，</i>组件被重新渲染了。

<!-- Let's also add a button for resetting the counter:-->
 我们还可以添加一个按钮来重设计数器。

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
我们的应用现在已经准备好了!


<!-- ### Tapahtumankäsittelijä on funktio -->

### Event handler is a function

<!-- Nappien tapahtumankäsittelijät on siis määritelty suoraan <i>onClick</i>-attribuuttien määrittelyn yhteydessä seuraavasti: -->
<!-- We define the event handlers for our buttons where we declare their <i>onClick</i> attributes:-->
 我们为我们的按钮定义事件处理程序，并声明它们的<i>onClick</i>属性。

```js
<button onClick={() => setCounter(counter + 1)}>
  plus
</button>
```

<!-- What if we tried to define the event handlers in a simpler form?-->
 如果我们试图以更简单的形式来定义事件处理程序呢？

```js
<button onClick={setCounter(counter + 1)}>
  plus
</button>
```

<!-- This would completely break our application:-->
这将完全破坏我们的应用。

![](../../images/1/5c.png)

<!-- What's going on? An event handler is supposed to be either a <i>function</i> or a <i>function reference</i>, and when we write:-->
这是怎么回事？一个事件处理程序应该是一个<i>函数</i>或者一个<i>函数引用</i>，而当我们写道：

```js
<button onClick={setCounter(counter + 1)}>
```

<!-- the event handler is actually a <i>function call</i>. In many situations this is ok, but not in this particular situation. In the beginning the value of the <i>counter</i> variable is 0. When React renders the component for the first time, it executes the function call <em>setCounter(0+1)</em>, and changes the value of the component's state to 1.-->
该事件处理程序实际上是一个<i>函数调用</i>。在很多情况下这是可以的，但在这种特殊情况下就不行了。在一开始，<i>counter</i>变量的值是0。当React第一次渲染组件时，它执行了函数调用<em>setCounter(0+1)</em>，并将组件的状态值改为1。
<!-- This will cause the component to be re-rendered, React will execute the setCounter function call again, and the state will change leading to another rerender...-->
 这将导致该组件被重新渲染，React将再次执行setCounter函数调用，并且状态将改变，导致再次重新渲染......

<!-- Palautetaan siis tapahtumankäsittelijä alkuperäiseen muotoonsa -->
<!-- Let's define the event handlers like we did before:-->
 让我们像之前那样定义事件处理程序。

```js
<button onClick={() => setCounter(counter + 1)}>
  plus
</button>
```

<!-- Nyt napin tapahtumankäsittelijän määrittelevä attribuutti <i>onClick</i> saa arvokseen funktion _() => setCounter(counter + 1)_, ja funktiota kutsutaan siinä vaiheessa kun sovelluksen käyttäjä painaa nappia.  -->
<!-- Now the button's attribute which defines what happens when the button is clicked - <i>onClick</i> - has the value _() => setCounter(counter + 1)_.-->
 现在按钮的属性定义了当按钮被点击时会发生 - <i>onClick</i> - 有值 _() => setCounter(counter + 1)_。
<!-- The setCounter function is called only when a user clicks the button.-->
 只有当用户点击按钮时，才会调用setCounter函数。

<!-- Tapahtumankäsittelijöiden määrittely suoraan JSX-templatejen sisällä ei useimmiten ole kovin viisasta. Tässä tapauksessa se tosin on ok, koska tapahtumankäsittelijät ovat niin yksinkertaisia.  -->
<!-- Usually defining event handlers within JSX-templates is not a good idea.-->
 通常在JSX模板中定义事件处理程序并不是一个好主意。
<!-- Here it's ok, because our event handlers are so simple.-->
这里可以，因为我们的事件处理程序非常简单。

<!-- Eriytetään kuitenkin nappien tapahtumankäsittelijät omiksi komponentin sisäisiksi apufunktioikseen: -->
<!-- Let's separate the event handlers into separate functions anyway:-->
无论如何，让我们把事件处理程序分成独立的函数。

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

<!-- Tälläkin kertaa tapahtumankäsittelijät on määritelty oikein, sillä <i>onClick</i>-attribuutit saavat arvokseen muuttujan, joka tallettaa viitteen funktioon: -->
<!-- Here, the event handlers have been defined correctly. The value of the <i>onClick</i> attribute is a variable containing a reference to a function:-->
 在这里，事件处理程序已经被正确定义。<i>onClick</i>属性的值是一个变量，包含对一个函数的引用。

```js
<button onClick={increaseByOne}>
  plus
</button>
```

### Passing state to child components

<!-- It's recommended to write React components that are small and reusable across the application and even across projects. Let's refactor our application so that it's composed of three smaller components, one component for displaying the counter and two components for buttons.-->
 我们建议编写的React组件要小，并且可以在整个应用甚至项目中重用。让我们重构我们的应用，使其由三个小的组件组成，一个组件用于显示计数器，两个组件用于按钮。

<!-- Let's first implement a <i>Display</i> component that's responsible for displaying the value of the counter.-->
 我们首先实现一个<i>Display</i>组件，负责显示计数器的值。

<!-- One best practice in React is to [lift the state up](https://reactjs.org/docs/lifting-state-up.html) in the component hierarchy. The documentation says:-->
 React的一个最佳做法是在组件层次结构中[将状态提升](https://reactjs.org/docs/lifting-state-up.html)。文档中说。

<!-- > <i>Often, several components need to reflect the same changing data. We recommend lifting the shared state up to their closest common ancestor.</i>-->
 > <i>通常，几个组件需要反映相同的变化数据。我们建议将共享状态提升到它们最接近的共同祖先。</i>

<!-- So let's place the application's state in the <i>App</i> component and pass it down to the <i>Display</i> component through <i>props</i>:-->
 所以让我们把应用的状态放在<i>App</i>组件中，并通过<i>props</i>把它传递给<i>Display</i>组件。

```js
const Display = (props) => {
  return (
    <div>{props.counter}</div>
  )
}
```

<!-- Using the component is straightforward, as we only need to pass the state of the _counter_ to it:-->
 使用该组件是直接的，因为我们只需要将 _计数器_ 的状态传递给它。

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
 接下来，让我们为我们应用的按钮制作一个<i>Button</i>组件。我们必须通过组件的props来传递事件处理程序以及按钮的标题。

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
 我们的<i>App</i>组件现在如下所示：

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
 因为我们现在有了一个容易重用的<i>按钮</i>组件，我们也在我们的应用中实现了新的功能，增加了一个可以用来减少计数器的按钮。

<!-- The event handler is passed to the <i>Button</i> component through the _onClick_ prop. The name of the prop itself is not that significant, but our naming choice wasn't completely random. React's own official [tutorial](https://reactjs.org/tutorial/tutorial.html) suggests this convention.-->
 事件处理程序是通过 _onClick_ prop传递给<i>Button</i>组件的。这个prop的名字本身并不重要，但我们的命名选择并不是完全随机的。React的官方 [tutorial](https://reactjs.org/tutorial/tutorial.html)建议采用这种惯例。

### Changes in state cause rerendering

<!-- Let's go over the main principles of how an application works once more.-->
 让我们再一次回顾一下应用工作的主要原则。

<!-- When the application starts, the code in _App_ is executed. This code uses a [useState](https://reactjs.org/docs/hooks-reference.html#usestate) hook to create the application state, setting an initial value of the variable _counter_.-->
 当应用启动时，_App_中的代码被执行。这段代码使用一个[useState](https://reactjs.org/docs/hooks-reference.html#usestate)钩子来创建应用的状态，设置变量_counter_的初始值。
<!-- This component contains the _Display_ component - which displays the counter's value, 0 - and three _Button_ components. The buttons all have event handlers, which are used to change the state of the counter.-->
 这个组件包含_Display_组件--显示计数器的值0--和三个_Button_组件。这些按钮都有事件处理程序，用来改变计数器的状态。

<!-- When one of the buttons is clicked, the event handler is executed. The event handler changes the state of the _App_ component with the _setCounter_ function.-->
当其中一个按钮被点击时，事件处理程序被执行。该事件处理程序通过_setCounter_函数改变_App_组件的状态。
<!-- **Calling a function which changes the state causes the component to rerender.**-->
 **调用一个改变状态的函数会导致组件重新渲染**。

<!-- So, if a user clicks the <i>plus</i> button, the button's event handler changes the value of _counter_ to 1, and the _App_ component is rerendered.-->
 所以，如果用户点击了<i>plus</i>按钮，按钮的事件处理程序将_counter_的值改为1，并且_App_组件被重新渲染。
<!-- This causes its subcomponents _Display_ and _Button_ to also be re-rendered.-->
 这导致其子组件_Display_和_Button_也被重新渲染。
<!-- _Display_ receives the new value of the counter, 1, as props. The _Button_ components receive event handlers which can be used to change the state of the counter.-->
 _Display_接收计数器的新值，1，作为prop。_Button_组件接收事件处理程序，可以用来改变计数器的状态。

### Refactoring the components

<!-- The component displaying the value of the counter is as follows:-->
 显示计数器数值的组件如下。

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
这意味着我们可以通过使用[解构](/en/part1/component_state_event_handlers#destructuring)来简化组件，像这样。

```js
const Display = ({ counter }) => {
  return (
    <div>{counter}</div>
  )
}
```

<!-- Koska komponentin määrittelevä metodi ei sisällä muuta kuin returnin, voimme määritellä sen hyödyntäen nuolifunktioiden tiiviimpää ilmaisumuotoa -->
<!-- The function defining the component contains only the return statement, so-->
 定义该组件的函数只包含返回语句，所以
<!-- we can define the function using the more compact form of arrow functions:-->
我们可以用箭头函数的更简洁的形式来定义这个函数。

```js
const Display = ({ counter }) => <div>{counter}</div>
```

<!-- Vastaava suoraviivaistus voidaan tehdä myös nappia edustavalle komponentille -->
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
 我们可以使用解构来从<i>props</i>中只获得所需的字段，并使用更紧凑的箭头函数形式。

```js
const Button = ({ onClick, text }) => (
  <button onClick={onClick}>
    {text}
  </button>
)
```

</div>
