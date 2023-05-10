---
mainImage: ../../../images/part-1.svg
part: 1
letter: d
lang: zh
---

<div class="content">

### Complex state

<!-- In our previous example, the application state was simple as it was comprised of a single integer. What if our application requires a more complex state?-->
在我们之前的示例中，应用状态很简单，因为它只包含一个整数。如果我们的应用需要一个更复杂的状态呢？

<!-- In most cases, the easiest and best way to accomplish this is by using the _useState_ function multiple times to create separate "pieces" of state.-->
在大多数情况下，最简单、最好的方法是多次使用_useState_函数来创建独立的"状态片段"。

<!-- In the following code we create two pieces of state for the application named _left_ and _right_ that both get the initial value of 0:-->
在下面的代码中，我们为应用程序创建了两个名为 _left_ 和 _right_ 的状态，它们都获得了初始值 0：

```js
const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)

  return (
    <div>
      {left}
      <button onClick={() => setLeft(left + 1)}>
        left
      </button>
      <button onClick={() => setRight(right + 1)}>
        right
      </button>
      {right}
    </div>
  )
}
```

<!-- The component gets access to the functions _setLeft_ and _setRight_ that it can use to update the two pieces of state.-->
这个组件可以访问_setLeft_和_setRight_两个函数来更新两个状态。

<!-- The component''s state or a piece of its state can be of any type. We could implement the same functionality by saving the click count of both the <i>left</i> and <i>right</i> buttons into a single object:-->
组件的状态或其状态的一部分可以是任何类型。我们可以通过将<i>左</i>和<i>右</i>按钮的点击计数保存到单个对象中来实现相同的功能：

```js
{
  left: 0,
  right: 0
}
```

<!-- In this case, the application would look like this:-->
在这种情况下，应用程序看起来像这样：

```js
const App = () => {
  const [clicks, setClicks] = useState({
    left: 0, right: 0
  })

  const handleLeftClick = () => {
    const newClicks = {
      left: clicks.left + 1,
      right: clicks.right
    }
    setClicks(newClicks)
  }

  const handleRightClick = () => {
    const newClicks = {
      left: clicks.left,
      right: clicks.right + 1
    }
    setClicks(newClicks)
  }

  return (
    <div>
      {clicks.left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {clicks.right}
    </div>
  )
}
```

<!-- Now the component only has a single piece of state and the event handlers have to take care of changing the <i>entire application state</i>.-->
现在，组件只有一个状态，事件处理程序必须负责更改<i>整个应用程序状态</i>。

<!-- The event handler looks a bit messy. When the left button is clicked, the following function is called:-->
事件处理程序看起来有点乱。当点击左键时，将调用以下函数：

```js
const handleLeftClick = () => {
  const newClicks = {
    left: clicks.left + 1,
    right: clicks.right
  }
  setClicks(newClicks)
}
```

<!-- The following object is set as the new state of the application:-->
以下对象被设置为应用程序的新状态：

```js
{
  left: clicks.left + 1,
  right: clicks.right
}
```

<!-- The new value of the <i>left</i> property is now the same as the value of <i>left + 1</i> from the previous state, and the value of the <i>right</i> property is the same as the value of the <i>right</i> property from the previous state.-->
新的<i>left</i>属性值现在与先前状态中<i>left + 1</i>的值相同，而<i>right</i>属性的值与先前状态中<i>right</i>属性的值相同。

<!-- We can define the new state object a bit more neatly by using the [object spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) operator.-->


我们可以通过使用 [对象展开](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) 运算符更加整洁地定义新的状态对象。
<!-- syntax that was added to the language specification in the summer of 2018:-->
这是2018年夏天增加到语言规范中的语法：

```js
const handleLeftClick = () => {
  const newClicks = {
    ...clicks,
    left: clicks.left + 1
  }
  setClicks(newClicks)
}

const handleRightClick = () => {
  const newClicks = {
    ...clicks,
    right: clicks.right + 1
  }
  setClicks(newClicks)
}
```

<!-- The syntax may seem a bit strange at first. In practice <em>{ ...clicks }</em> creates a new object that has copies of all of the properties of the _clicks_ object. When we specify a particular property - e.g. <i>right</i> in <em>{ ...clicks, right: 1 }</em>, the value of the _right_ property in the new object will be 1.-->
语法一开始可能会有点奇怪。实践中<em>{ ...clicks }</em>会创建一个新的对象，它拥有_clicks_对象的所有属性的副本。当我们指定一个特定的属性 - 例如<i>right</i>在<em>{ ...clicks, right: 1 }</em>中，新对象中 _right_ 属性的值将为1。

<!-- In the example above, this:-->
在上面的例子中，这个：

```js
{ ...clicks, right: clicks.right + 1 }
```

<!-- creates a copy of the _clicks_ object where the value of the _right_ property is increased by one.-->
创建一个 _clicks_ 对象的副本，其中 _right_ 属性的值增加1。

<!-- Assigning the object to a variable in the event handlers is not necessary and we can simplify the functions to the following form:-->
在事件处理程序中将对象分配给变量是不必要的，我们可以将函数简化为以下形式：

```js
const handleLeftClick = () =>
  setClicks({ ...clicks, left: clicks.left + 1 })

const handleRightClick = () =>
  setClicks({ ...clicks, right: clicks.right + 1 })
```

<!-- Some readers might be wondering why we didn''t just update the state directly, like this:-->
一些读者可能会想知道为什么我们不直接更新状态，就像这样：

```js
const handleLeftClick = () => {
  clicks.left++
  setClicks(clicks)
}
```

<!-- The application appears to work. However, <i>it is forbidden in React to mutate state directly</i>, since [it can result in unexpected side effects](https://stackoverflow.com/a/40309023). Changing state has to always be done by setting the state to a new object. If properties from the previous state object are not changed, they need to simply be copied, which is done by copying those properties into a new object and setting that as the new state.-->
应用似乎可以正常工作。然而，<i>在React中禁止直接改变状态</i>，因为[它可能会导致意想不到的副作用](https://stackoverflow.com/a/40309023)。改变状态必须始终设置新对象来完成。如果没有改变从之前状态对象中的属性，它们需要简单地复制，这是通过将这些属性复制到新对象中，并将其设置为新状态来完成的。

<!-- Storing all of the state in a single state object is a bad choice for this particular application; there''s no apparent benefit and the resulting application is a lot more complex. In this case, storing the click counters into separate pieces of state is a far more suitable choice.-->
在这种特定的应用中，将所有状态都存储在单个状态对象中是一个不好的选择；没有明显的好处，并且会导致的应用程序更加复杂。在这种情况下，将点击计数器存储到单独的状态片段中是一个更合适的选择。

<!-- There are situations where it can be beneficial to store a piece of application state in a more complex data structure. [The official React documentation](https://react.dev/learn/choosing-the-state-structure) contains some helpful guidance on the topic.-->
有时候，将应用状态存储在更复杂的数据结构中可以带来好处。[官方 React 文档](https://react.dev/learn/choosing-the-state-structure) 就这个主题提供了一些有用的指导。

### Handling arrays

<!-- Let''s add a piece of state to our application containing an array _allClicks_ that remembers every click that has occurred in the application.-->
让我们在我们的应用程序中添加一个包含数组 _allClicks_ 的状态，记住应用程序中发生的每一次点击。

```js
const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [allClicks, setAll] = useState([]) // highlight-line

// highlight-start
  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    setLeft(left + 1)
  }
// highlight-end

// highlight-start
  const handleRightClick = () => {
    setAll(allClicks.concat('R'))
    setRight(right + 1)
  }
// highlight-end

  return (
    <div>
      {left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {right}
      <p>{allClicks.join(' ')}</p> // highlight-line
    </div>
  )
}
```

<!-- Every click is stored in a separate piece of state called _allClicks_ that is initialized as an empty array:-->
每次点击都会存储在一个叫做 _allClicks_ 的独立状态中，它初始化为一个空数组：

```js
const [allClicks, setAll] = useState([])
```

<!-- When the <i>left</i> button is clicked, we add the letter <i>L</i> to the _allClicks_ array:-->
当点击<i>左</i>按钮时，我们将字母<i>L</i>添加到 _allClicks_ 数组中：

```js
const handleLeftClick = () => {
  setAll(allClicks.concat('L'))
  setLeft(left + 1)
}
```

<!-- The piece of state stored in _allClicks_ is now set to be an array that contains all of the items of the previous state array plus the letter <i>L</i>. Adding the new item to the array is accomplished with the [concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat) method, which does not mutate the existing array but rather returns a <i>new copy of the array</i> with the item added to it.-->
在 _allClicks_ 中存储的状态片段现在被设置为一个数组，其中包含前一个状态数组中的所有项目以及字母<i>L</i>。使用[concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat)方法将新项添加到数组中，该方法不会改变现有数组，而是返回一个<i>新的数组副本</i>，其中包含添加的项目。

<!-- As mentioned previously, it''s also possible in JavaScript to add items to an array with the [push](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push) method. If we add the item by pushing it to the _allClicks_ array and then updating the state, the application would still appear to work:-->
如前所述，JavaScript 也可以使用[push](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push) 方法向数组中添加项目。如果我们通过将其推入 _allClicks_ 数组并更新状态来添加项目，应用程序仍然会正常工作：

```js
const handleLeftClick = () => {
  allClicks.push('L')
  setAll(allClicks)
  setLeft(left + 1)
}
```

<!-- However, __don''t__ do this. As mentioned previously, the state of React components like _allClicks_ must not be mutated directly. Even if mutating state appears to work in some cases, it can lead to problems that are very hard to debug.-->
但是，__不要__ 这样做。正如之前提到的，像 _allClicks_ 这样的 React 组件的状态不应该直接改变。即使在某些情况下改变状态似乎有效，也可能导致很难调试的问题。

<!-- Let''s take a closer look at how the clicking works-->


让我们来仔细看看点击是如何工作的
<!-- is rendered to the page:-->
这段文本被渲染在页面上：

```js
const App = () => {
  // ...

  return (
    <div>
      {left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {right}
      <p>{allClicks.join(' ')}</p> // highlight-line
    </div>
  )
}
```

<!-- We call the [join](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join) method on the _allClicks_ array that joins all the items into a single string, separated by the string passed as the function parameter, which in our case is an empty space.-->
我们在`allClicks`数组上调用[join](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join)方法，将所有项目拼接成一个单独的字符串，由函数参数指定的字符串分隔，在我们的例子中是一个空格。

### Update of the state is asynchronous

<!-- Let''s expand the application so that it keeps track of the total number of button presses in the state _total_, whose value is always updated when the buttons are pressed:-->
让我们扩展这个应用程序，以便它跟踪状态 _total_ 中按钮按下的总次数，当按钮被按下时，该值总是被更新：

```js
const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [allClicks, setAll] = useState([])
  const [total, setTotal] = useState(0) // highlight-line

  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    setLeft(left + 1)
    setTotal(left + right)  // highlight-line
  }

  const handleRightClick = () => {
    setAll(allClicks.concat('R'))
    setRight(right + 1)
    setTotal(left + right)  // highlight-line
  }

  return (
    <div>
      {left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {right}
      <p>{allClicks.join(' ')}</p>
      <p>total {total}</p>  // highlight-line
    </div>
  )
}
```

<!-- The solution does not quite work:-->
解决方案并不完全有效：

![browser showing 2 left|right 1, RLL total 2](../../images/1/33.png)

<!-- The total number of button presses is consistently one less than the actual amount of presses, for some reason.-->
总按钮次数一直比实际按键次数少一次，不知道为什么。

<!-- Let us add couple of console.log statements to the event handler:-->
让我们在事件处理程序中添加几个`console.log`语句：

```js
const App = () => {
  // ...
  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    console.log('left before', left)  // highlight-line
    setLeft(left + 1)
    console.log('left after', left)  // highlight-line
    setTotal(left + right)
  }

  // ...
}
```

<!-- The console reveals the problem-->
控制台揭示了问题

![devtools console showing left before 4 and left after 4](../../images/1/32.png)

<!-- Even though a new value was set for _left_ by calling _setLeft(left + 1)_, the old value persists despite the update. As a result, the attempt to count button presses produces a result that is too small:-->
尽管通过调用`setLeft(left + 1)`为 _left_ 设置了一个新值，但旧值仍然保持不变，尽管已经更新了。结果，尝试计算按钮按下次数产生的结果太小了：

```js
setTotal(left + right)
```

<!-- The reason for this is that a state update in React happens [asynchronously](https://react.dev/learn/queueing-a-series-of-state-updates), i.e. not immediately but "at some point" before the component is rendered again.-->
原因是，React中的状态更新是[异步的](https://react.dev/learn/queueing-a-series-of-state-updates)，即不是立即的，而是在组件再次渲染之前的“某个时刻”。

<!-- We can fix the app as follows:-->
我们可以按照下列方式修复该应用程序：

```js
const App = () => {
  // ...
  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    const updatedLeft = left + 1
    setLeft(updatedLeft)
    setTotal(updatedLeft + right)
  }

  // ...
}
```

<!-- So now the number of button presses is definitely based on the correct number of left button presses.-->
现在按钮按压的次数肯定是基于正确的左键按压次数。

### Conditional rendering

<!-- Let''s modify our application so that the rendering of the clicking history is handled by a new <i>History</i> component:-->
让我们修改我们的应用程序，以便由新的 <i>History</i> 组件处理点击History的渲染：

```js
// highlight-start
const History = (props) => {
  if (props.allClicks.length === 0) {
    return (
      <div>
        the app is used by pressing the buttons
      </div>
    )
  }

  return (
    <div>
      button press history: {props.allClicks.join(' ')}
    </div>
  )
}
// highlight-end

const App = () => {
  // ...

  return (
    <div>
      {left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {right}
      <History allClicks={allClicks} /> // highlight-line
    </div>
  )
}
```

<!-- Now the behavior of the component depends on whether or not any buttons have been clicked. If not, meaning that the <em>allClicks</em> array is empty, the component renders a div element with some instructions instead:-->
现在组件的行为取决于是否有按钮被点击。如果没有，也就是说<em>allClicks</em>数组是空的，组件会渲染一个div元素，并附上一些指示：

```js
<div>the app is used by pressing the buttons</div>
```

<!-- And in all other cases, the component renders the clicking history:-->
在所有其他情况下，组件呈现点击历史：

```js
<div>
  button press history: {props.allClicks.join(' ')}
</div>
```

<!-- The <i>History</i> component renders completely different React elements depending on the state of the application. This is called <i>conditional rendering</i>.-->
<i>History</i>组件根据应用的状态完全渲染不同的React元素，这被称为<i>条件渲染</i>。

<!-- React also offers many other ways of doing [conditional rendering](https://react.dev/learn/conditional-rendering). We will take a closer look at this in [part 2](/en/part2).-->
React 还提供了许多其他的[条件渲染](https://react.dev/learn/conditional-rendering)方式。我们将在[第二章节](/en/part2)中更加仔细地研究这一点。

<!-- Let''s make one last modification to our application by refactoring it to use the _Button_ component that we defined earlier on:-->
让我们对我们的应用程序做一个最后的修改，将其重构以使用我们之前定义的 _Button_ 组件：

```js
const History = (props) => {
  if (props.allClicks.length === 0) {
    return (
      <div>
        the app is used by pressing the buttons
      </div>
    )
  }

  return (
    <div>
      button press history: {props.allClicks.join(' ')}
    </div>
  )
}

// highlight-start
const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)
// highlight-end

const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [allClicks, setAll] = useState([])

  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    setLeft(left + 1)
  }

  const handleRightClick = () => {
    setAll(allClicks.concat('R'))
    setRight(right + 1)
  }

  return (
    <div>
      {left}
      // highlight-start
      <Button handleClick={handleLeftClick} text='left' />
      <Button handleClick={handleRightClick} text='right' />
      // highlight-end
      {right}
      <History allClicks={allClicks} />
    </div>
  )
}
```

### Old React

<!-- In this course, we use the [state hook](https://react.dev/learn/state-a-components-memory) to add state to our React components, which is part of the newer versions of React and is available from version [16.8.0](https://www.npmjs.com/package/react/v/16.8.0) onwards. Before the addition of hooks, there was no way to add state to functional components. Components that required state had to be defined as [class](https://react.dev/reference/react/Component) components, using the JavaScript class syntax.-->
在本课程中，我们使用[state hook](https://react.dev/learn/state-a-components-memory)来为我们的React组件增加状态，这是React新版本的一部分，从[16.8.0](https://www.npmjs.com/package/react/v/16.8.0)版本开始就可以使用。在添加hooks之前，没有办法将状态添加到功能组件中。需要状态的组件必须使用JavaScript类语法定义为[class](https://react.dev/reference/react/Component)组件。

<!-- In this course, we have made the slightly radical decision to use hooks exclusively from day one, to ensure that we are learning the current and future variations of React. Even though functional components are the future of React, it is still important to learn the class syntax, as there are billions of lines of legacy React code that you might end up maintaining someday. The same applies to documentation and examples of React that you may stumble across on the internet.-->
在本课程中，我们做出了一个略微激进的决定，从一开始就仅仅使用hook，以确保我们正在学习React的当前和未来变化。尽管函数组件是React的未来，学习类语法仍然很重要，因为您可能有数十亿行的React遗留代码需要维护。同样适用于您可能在互联网上遇到的React文档和示例。

<!-- We will learn more about React class components later on in the course.-->
我们稍后在课程中会更多地了解React类组件。

### Debugging React applications

<!-- A large part of a typical developer''s time is spent on debugging and reading existing code. Every now and then we do get to write a line or two of new code, but a large part of our time is spent trying to figure out why something is broken or how something works. Good practices and tools for debugging are extremely important for this reason.-->
大部分开发者的时间都花在调试和阅读现有代码上。我们偶尔会写几行新代码，但大部分时间都花在试图弄清楚为什么某些东西坏了或者如何工作上。出于这个原因，良好的实践和调试工具非常重要。

<!-- Lucky for us, React is an extremely developer-friendly library when it comes to debugging.-->
幸运的是，当涉及到调试时，React 是一个非常友好的开发者库。

<!-- Before we move on, let us remind ourselves of one of the most important rules of web development.-->
在我们继续之前，让我们提醒自己一个最重要的网络开发规则。

<h4>The first rule of web development</h4>

<!-- > **Keep the browser''s developer console open at all times.**-->
> **始终保持浏览器的开发者控制台处于打开状态。**
<!-- >-->

<!-- > The <i>Console</i> tab in particular should always be open, unless there is a specific reason to view another tab.-->
> 尤其是<i>控制台</i>选项卡应该始终打开，除非有特定的原因要查看其他选项卡。

<!-- Keep both your code and the web page open together **at the same time, all the time**.-->
保持你的代码和网页**同时、一直**打开。

<!-- If and when your code fails to compile and your browser lights up like a Christmas tree:-->
如果你的代码编译失败，而且你的浏览器像圣诞树一样亮起来：

![screenshot of code](../../images/1/6x.png)

<!-- don''t write more code but rather find and fix the problem **immediately**. There has yet to be a moment in the history of coding where code that fails to compile would miraculously start working after writing large amounts of additional code. I highly doubt that such an event will transpire during this course either.-->
不要写更多的代码，而是**立即**找出并修复问题。在编码历史上，还没有一个时刻，编译失败的代码会在写入大量额外代码后奇迹般地开始运行。因此这门课程中也不会发生这样的事件。

<!-- Old-school, print-based debugging is always a good idea. If the component you are debugging has a printed manual, you should always consult it first.-->
老派的，用打印方式来调试是一个好主意。如果你正在调试的组件有一个打印手册，你应该总是先参考它。

```js
const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)
```

<!-- is not working as intended, it''s useful to start printing its variables out to the console. In order to do this effectively, we must transform our function into the less compact form and receive the entire props object without destructuring it immediately:-->
如果函数没有按预期工作，最有效的方法是将其变量打印到控制台。为此，我们必须将函数转换为不太紧凑的形式，并立即获取整个props对象而不进行解构：

```js
const Button = (props) => {
  console.log(props) // highlight-line
  const { handleClick, text } = props
  return (
    <button onClick={handleClick}>
      {text}
    </button>
  )
}
```

<!-- This will immediately reveal if, for instance, one of the attributes has been misspelled when using the component.-->
这将立即揭示，例如，当使用组件时，是否有属性拼写错误。

<!-- **NB** When you use _console.log_ for debugging, don''t combine _objects_ in a Java-like fashion by using the plus operator:-->
**注意：** 在使用_console.log_进行调试时，不要像在 Java 中一样使用加号运算符组合_objects_:

```js
console.log('props value is ' + props)
```

<!-- If you do that, you will end up with a rather uninformative log message:-->
如果你这么做，最终你会得到一条毫无意义的日志消息：

```js
props value is [object Object]
```

<!-- Instead, separate the things you want to log to the console with a comma:-->
代替，用逗号分隔你想要记录到控制台的东西：

```js
console.log('props value is', props)
```

<!-- In this way, the separated items will all be available in the browser console for further inspection.-->
在这种方式下，对象中的数据项都可以在浏览器控制台中打印，进行进一步检查。

<!-- Logging output to the console is by no means the only way of debugging our applications. You can pause the execution of your application code in the Chrome developer console''s <i>debugger</i>, by writing the command [debugger](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/debugger) anywhere in your code.-->
在控制台记录输出绝不是调试我们应用程序的唯一方式。您可以在Chrome开发者控制台的<i>调试器</i>中通过在代码中的任何位置写入[debugger](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/debugger)命令来暂停应用程序代码的执行。

<!-- The execution will pause once it arrives at a point where the _debugger_ command gets executed:-->
执行一旦到达 _调试器_ 命令被执行的点，将暂停：

![debugger paused in dev tools](../../images/1/7a.png)

<!-- By going to the <i>Console</i> tab, it is easy to inspect the current state of variables:-->
通过访问<i>控制台</i>选项卡，可以轻松检查变量的当前状态：

![console inspection screenshot](../../images/1/8a.png)

<!-- Once the cause of the bug is discovered you can remove the _debugger_ command and refresh the page.-->
一旦发现了bug的原因，你可以移除 _debugger_ 命令，并刷新页面。

<!-- The debugger also enables us to execute our code line by line with the controls found on the right-hand side of the <i>Sources</i> tab.-->
调试器还使我们能够通过<i>Sources</i>选项卡右侧找到的控件，一行一行地执行我们的代码。

<!-- You can also access the debugger without the _debugger_ command by adding breakpoints in the <i>Sources</i> tab. Inspecting the values of the component''s variables can be done in the _Scope_-section:-->
你也可以不用 `debugger` 命令来访问调试器，而是在<i>Sources</i>标签中添加断点。可以在_Scope_ -section中查看组件变量的值：

![breakpoint example in devtools](../../images/1/9a.png)

<!-- It is highly recommended to add the [React developer tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) extension to Chrome. It adds a new _Components_ tab to the developer tools. The new developer tools tab can be used to inspect the different React elements in the application, along with their state and props:-->
建议将[React开发者工具](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)添加到Chrome中。它会为开发者工具添加一个新的_组件_标签。新的开发者工具标签可用于检查应用程序中不同的React元素及其状态和属性：

![screenshot react developer tools extension](../../images/1/10ea.png)

<!-- The _App_ component''s state is defined like so:-->
_App_ 组件的状态定义如下：

```js
const [left, setLeft] = useState(0)
const [right, setRight] = useState(0)
const [allClicks, setAll] = useState([])
```

<!-- Dev tools show the state of hooks in the order of their definition:-->
开发工具显示钩子的状态按照它们定义的顺序：

![state of hooks in react dev tools](../../images/1/11ea.png)

<!-- The first <i>State</i> contains the value of the <i>left</i> state, the next contains the value of the <i>right</i> state and the last contains the value of the <i>allClicks</i> state.-->
第一个<i>State</i>包含<i>left</i>状态的值，下一个包含<i>right</i>状态的值，最后一个包含<i>allClicks</i>状态的值。

### Rules of Hooks

<!-- There are a few limitations and rules we have to follow to ensure that our application uses hooks-based state functions correctly.-->
有几个限制和规则我们必须遵守，以确保我们的应用程序正确使用基于钩子的状态函数。

<!-- The _useState_ function (as well as the _useEffect_ function introduced later on in the course) <i>must not be called</i> from inside of a loop, a conditional expression, or any place that is not a function defining a component. This must be done to ensure that the hooks are always called in the same order, and if this isn''t the case the application will behave erratically.-->
_useState_ 函数（以及后续课程中介绍的 _useEffect_ 函数）<i>不得从循环、条件表达式或任何不是定义组件的函数中调用</i>。这样做是为了确保 hooks 总是按照相同的顺序调用，如果不是这样，应用程序将会表现不稳定。

<!-- To recap, hooks may only be called from the inside of a function body that defines a React component:-->
总结一下，钩子只能从定义React组件的函数体内部调用：

```js
const App = () => {
  // these are ok
  const [age, setAge] = useState(0)
  const [name, setName] = useState('Juha Tauriainen')

  if ( age > 10 ) {
    // this does not work!
    const [foobar, setFoobar] = useState(null)
  }

  for ( let i = 0; i < age; i++ ) {
    // also this is not good
    const [rightWay, setRightWay] = useState(false)
  }

  const notGood = () => {
    // and this is also illegal
    const [x, setX] = useState(-1000)
  }

  return (
    //...
  )
}
```

### Event Handling Revisited

<!-- Event handling has proven to be a difficult topic in previous iterations of this course.-->
事件处理在这门课程的前几次迭代中已经证明是一个困难的话题。

<!-- For this reason, we will revisit the topic.-->
因此，我们将重新审视这个话题。

<!-- Let's assume that we're developing this simple application with the following component <i>App</i>:-->
假设我们正在开发这个简单的应用程序，其中包含以下组件<i>App</i>：

```js
const App = () => {
  const [value, setValue] = useState(10)

  return (
    <div>
      {value}
      <button>reset to zero</button>
    </div>
  )
}
```

<!-- We want the clicking of the button to reset the state stored in the _value_ variable.-->
我们希望点击按钮能够重置存储在 _value_ 变量中的状态。

<!-- In order to make the button react to a click event, we have to add an <i>event handler</i> to it.-->
为了使按钮对点击事件做出反应，我们必须为它添加一个<i>事件处理程序</i>。

<!-- Event handlers must always be a function or a reference to a function. The button will not work if the event handler is set to a variable of any other type.-->
事件处理程序必须始终是一个函数或对函数的引用。如果将事件处理程序设置为其他类型的变量，按钮将无法工作。

<!-- If we were to define the event handler as a string:-->
如果我们将事件处理程序定义为一个字符串：

```js
<button onClick="crap...">button</button>
```

<!-- React would warn us about this in the console:-->
React会在控制台中警告我们关于这一点：

```js
index.js:2178 Warning: Expected `onClick` listener to be a function, instead got a value of `string` type.
    in button (at index.js:20)
    in div (at index.js:18)
    in App (at index.js:27)
```

<!-- The following attempt would also not work:-->
以下尝试也不会有效：

```js
<button onClick={value + 1}>button</button>
```

<!-- We have attempted to set the event handler to _value + 1_ which simply returns the result of the operation. React will kindly warn us about this in the console:-->
我们试图将事件处理程序设置为_value + 1_，这只是返回操作结果。 React会在控制台友好地警告我们：

```js
index.js:2178 Warning: Expected `onClick` listener to be a function, instead got a value of `number` type.
```

<!-- This attempt would not work either:-->
这次尝试也不会有用：

```js
<button onClick={value = 0}>button</button>
```

<!-- The event handler is not a function but a variable assignment, and React will once again issue a warning to the console. This attempt is also flawed in the sense that we must never mutate state directly in React.-->
事件处理程序不是一个函数，而是一个变量赋值，而且React会再次向控制台发出警告。这种尝试也是有缺陷的，因为我们永远不能在React中直接改变状态。

<!-- What about the following:-->
## 以下怎么样：

```js
<button onClick={console.log('clicked the button')}>
  button
</button>
```

<!-- The message gets printed to the console once when the component is rendered but nothing happens when we click the button. Why does this not work even when our event handler contains a function _console.log_?-->
当组件渲染时，消息会被打印到控制台，但是当我们点击按钮时什么也没有发生。即使我们的事件处理程序包含一个函数_console.log_，为什么这个不起作用？

<!-- The issue here is that our event handler is defined as a <i>function call</i> which means that the event handler is assigned the returned value from the function, which in the case of _console.log_ is <i>undefined</i>.-->
问题在于我们的事件处理程序被定义为一个<i>函数调用</i>，这意味着事件处理程序被赋予从函数返回的值，在_console.log_的情况下是<i>未定义</i>的。

<!-- The _console.log_ function call gets executed when the component is rendered and for this reason, it gets printed once to the console.-->
`console.log` 函数调用在组件渲染时被执行，因此它只会被打印到控制台一次。

<!-- The following attempt is flawed as well:-->
以下尝试也有缺陷：

```js
<button onClick={setValue(0)}>button</button>
```

<!-- We have once again tried to set a function call as the event handler. This does not work. This particular attempt also causes another problem. When the component is rendered the function _setValue(0)_ gets executed which in turn causes the component to be re-rendered. Re-rendering in turn calls _setValue(0)_ again, resulting in an infinite recursion.-->
我们再次尝试将一个函数调用设置为事件处理程序。这不起作用。这次尝试还会引起另一个问题。当组件渲染时，函数_setValue（0）_被执行，这反过来又导致组件被重新渲染。重新渲染又会调用_setValue（0）_，导致无限递归。

<!-- Executing a particular function call when the button is clicked can be accomplished like this:-->
当按钮被点击时执行特定的函数调用可以这样实现：

```js
<button onClick={() => console.log('clicked the button')}>
  button
</button>
```

<!-- Now the event handler is a function defined with the arrow function syntax _() => console.log('clicked the button')_. When the component gets rendered, no function gets called and only the reference to the arrow function is set to the event handler. Calling the function happens only once the button is clicked.-->
现在，事件处理程序是用箭头函数语法定义的函数 _() => console.log('clicked the button')_ 。当组件渲染时，不会调用任何函数，只有对箭头函数的引用被设置为事件处理程序。只有在单击按钮时，才会调用该函数。

<!-- We can implement resetting the state in our application with this same technique:-->
我们可以用同样的技术在我们的应用中实现重置状态：

```js
<button onClick={() => setValue(0)}>button</button>
```

<!-- The event handler is now the function _() => setValue(0)_.-->
事件处理程序现在是函数 _() => setValue(0)_ 。

<!-- Defining event handlers directly in the attribute of the button is not necessarily the best possible idea.-->
这不一定是最好的想法，直接在按钮的属性中定义事件处理程序。

<!-- You will often see event handlers defined in a separate place. In the following version of our application we define a function that then gets assigned to the _handleClick_ variable in the body of the component function:-->
你经常会看到事件处理器在一个单独的地方定义。在下面的应用程序版本中，我们定义了一个函数，然后将其分配给组件函数中的_handleClick_变量：

```js
const App = () => {
  const [value, setValue] = useState(10)

  const handleClick = () =>
    console.log('clicked the button')

  return (
    <div>
      {value}
      <button onClick={handleClick}>button</button>
    </div>
  )
}
```

<!-- The _handleClick_ variable is now assigned to a reference to the function. The reference is passed to the button as the <i>onClick</i> attribute:-->
变量_handleClick_现在被赋予一个对函数的引用。这个引用被作为<i>onClick</i>属性传递给按钮：

```js
<button onClick={handleClick}>button</button>
```

<!-- Naturally, our event handler function can be composed of multiple commands. In these cases we use the longer curly brace syntax for arrow functions:-->
我们的事件处理函数可以由多个命令组成。 在这种情况下，我们使用更长的大括号语法来包含箭头函数的逻辑：

```js
const App = () => {
  const [value, setValue] = useState(10)

  // highlight-start
  const handleClick = () => {
    console.log('clicked the button')
    setValue(0)
  }
   // highlight-end

  return (
    <div>
      {value}
      <button onClick={handleClick}>button</button>
    </div>
  )
}
```

### A function that returns a function

<!-- Another way to define an event handler is to use a <i>function that returns a function</i>.-->
另一种定义事件处理程序的方法是使用<i>返回函数的函数</i>。

<!-- You probably won''t need to use functions that return functions in any of the exercises in this course.  If the topic seems particularly confusing, you may skip over this section for now and return to it later.-->
你可能不需要在本课程中的任何练习中使用返回函数的函数。如果这个主题看起来特别令人困惑，你可以暂时跳过这一部分，稍后再回来复习。

<!-- Let''s make the following changes to our code:-->
让我们对我们的代码做出以下更改：

```js
const App = () => {
  const [value, setValue] = useState(10)

  // highlight-start
  const hello = () => {
    const handler = () => console.log('hello world')

    return handler
  }
  // highlight-end

  return (
    <div>
      {value}
      <button onClick={hello()}>button</button>
    </div>
  )
}
```

<!-- The code functions correctly even though it looks complicated.-->
代码看起来很复杂，但是它仍然能正确运行。

<!-- The event handler is now set to a function call:-->
事件处理程序现在设置为函数调用：

```js
<button onClick={hello()}>button</button>
```

<!-- Earlier on we stated that an event handler may not be a call to a function and that it has to be a function or a reference to a function. Why then does a function call work in this case?-->
早些时候，我们指出事件处理程序可能不是对函数的调用，而是一个函数或对函数的引用。那么为什么函数调用在这种情况下可以正常工作？

<!-- When the component is rendered, the following function gets executed:-->
当组件渲染时，将执行以下函数：

```js
const hello = () => {
  const handler = () => console.log('hello world')

  return handler
}
```

<!-- The <i>return value</i> of the function is another function that is assigned to the _handler_ variable.-->
函数的<i>返回值</i>是另一个被赋值给_handler_变量的函数。

<!-- When React renders the line:-->
当React渲染这一行时：

```js
<button onClick={hello()}>button</button>
```

<!-- It assigns the return value of _hello()_ to the onClick attribute. Essentially the line gets transformed into:`onClick={hello()}`-->
它将_hello()_的返回值分配给onClick属性。本质上，该行被转换为：`onClick={hello()}`

```js
<button onClick={() => console.log('hello world')}>
  button
</button>
```

<!-- Since the _hello_ function returns a function, the event handler is now a function.-->
由于_hello_函数返回一个函数，因此事件处理程序现在是一个函数。

<!-- What''s the point of this concept?-->
**这个概念的意义是什么？**

<!-- Let''s change the code a tiny bit:-->
让我们稍微改变一下代码：

```js
const App = () => {
  const [value, setValue] = useState(10)

  // highlight-start
  const hello = (who) => {
    const handler = () => {
      console.log('hello', who)
    }

    return handler
  }
  // highlight-end

  return (
    <div>
      {value}
  // highlight-start
      <button onClick={hello('world')}>button</button>
      <button onClick={hello('react')}>button</button>
      <button onClick={hello('function')}>button</button>
  // highlight-end
    </div>
  )
}
```

<!-- Now the application has three buttons with event handlers defined by the _hello_ function that accepts a parameter.-->
现在应用程序有三个按钮，事件处理程序由_hello_函数定义，该函数接受一个参数。

<!-- The first button is defined as-->
第一个按钮被定义为

```js
<button onClick={hello('world')}>button</button>
```

<!-- The event handler is created by <i>executing</i> the function call _hello('world')_. The function call returns the function:-->
事件处理程序是通过<i>执行</i>函数调用 _hello('world')_ 创建的。该函数调用返回函数：

```js
() => {
  console.log('hello', 'world')
}
```

<!-- The second button is defined as:-->
第二个按钮定义为：

```js
<button onClick={hello('react')}>button</button>
```

<!-- The function call _hello('react')_ that creates the event handler returns:-->
函数调用 _hello('react')_ 创建的事件处理程序返回：

```js
() => {
  console.log('hello', 'react')
}
```

<!-- Both buttons get their individualized event handlers.-->
两个按钮都有它们各自的事件处理程序。

<!-- Functions returning functions can be utilized in defining generic functionality that can be customized with parameters. The _hello_ function that creates the event handlers can be thought of as a factory that produces customized event handlers meant for greeting users.-->
函数返回函数可以用来定义可以通过参数定制的通用功能。创建事件处理程序的 _hello_ 函数可以被看作是一个工厂，它生产用于问候用户的定制事件处理程序。

<!-- Our current definition is slightly verbose:-->
我们目前的定义略显冗长：

```js
const hello = (who) => {
  const handler = () => {
    console.log('hello', who)
  }

  return handler
}
```

<!-- Let''s eliminate the helper variables and directly return the created function:-->
让我们消除辅助变量，直接返回创建的函数：

```js
const hello = (who) => {
  return () => {
    console.log('hello', who)
  }
}
```

<!-- Since our _hello_ function is composed of a single return command, we can omit the curly braces and use the more compact syntax for arrow functions:-->
自从我们的`hello`函数由单一的返回命令组成，我们可以省略大括号并使用更简洁的箭头函数语法：

```js
const hello = (who) =>
  () => {
    console.log('hello', who)
  }
```

<!-- Lastly, let''s write all of the arrows on the same line:-->
最后，让我们把所有的箭头写在同一行：

```js
const hello = (who) => () => {
  console.log('hello', who)
}
```

<!-- We can use the same trick to define event handlers that set the state of the component to a given value. Let''s make the following changes to our code:-->
我们可以使用相同的技巧来定义事件处理程序，将组件的状态设置为给定值。 让我们对代码做出以下更改：

```js
const App = () => {
  const [value, setValue] = useState(10)

  // highlight-start
  const setToValue = (newValue) => () => {
    console.log('value now', newValue)  // print the new value to console
    setValue(newValue)
  }
  // highlight-end

  return (
    <div>
      {value}
      // highlight-start
      <button onClick={setToValue(1000)}>thousand</button>
      <button onClick={setToValue(0)}>reset</button>
      <button onClick={setToValue(value + 1)}>increment</button>
      // highlight-end
    </div>
  )
}
```

<!-- When the component is rendered, the <i>thousand</i> button is created:-->
当组件被渲染时，会创建<i>thousand</i>按钮：

```js
<button onClick={setToValue(1000)}>thousand</button>
```

<!-- The event handler is set to the return value of _setToValue(1000)_ which is the following function:-->
事件处理程序被设置为_setToValue(1000)_的返回值，该函数如下：

```js
() => {
  console.log('value now', 1000)
  setValue(1000)
}
```

<!-- The increase button is declared as follows:-->
按钮增加如下声明：

```js
<button onClick={setToValue(value + 1)}>increment</button>
```

<!-- The event handler is created by the function call _setToValue(value + 1)_ which receives as its parameter the current value of the state variable _value_ increased by one. If the value of _value_ was 10, then the created event handler would be the function:-->
事件处理程序由函数调用 _setToValue(value + 1)_ 创建，该函数接收状态变量_value_的当前值加一作为参数。如果_value_的值为10，那么创建的事件处理程序将是函数：

```js
() => {
  console.log('value now', 11)
  setValue(11)
}
```

<!-- Using functions that return functions is not required to achieve this functionality. Let''s return the _setToValue_ function which is responsible for updating state into a normal function:-->
不需要使用返回函数的函数来实现这个功能。让我们将负责更新状态的 _setToValue_ 函数改为一个普通函数：

```js
const App = () => {
  const [value, setValue] = useState(10)

  const setToValue = (newValue) => {
    console.log('value now', newValue)
    setValue(newValue)
  }

  return (
    <div>
      {value}
      <button onClick={() => setToValue(1000)}>
        thousand
      </button>
      <button onClick={() => setToValue(0)}>
        reset
      </button>
      <button onClick={() => setToValue(value + 1)}>
        increment
      </button>
    </div>
  )
}
```

<!-- We can now define the event handler as a function that calls the _setToValue_ function with an appropriate parameter. The event handler for resetting the application state would be:-->
我们现在可以将事件处理程序定义为一个函数，该函数使用适当的参数调用 _setToValue_ 函数。用于重置应用程序状态的事件处理程序为：

```js
<button onClick={() => setToValue(0)}>reset</button>
```

<!-- Choosing between the two presented ways of defining your event handlers is mostly a matter of taste.-->
选择两种定义事件处理程序的方式，大多数情况下是出于个人偏好。

### Passing Event Handlers to Child Components

<!-- Let''s extract the button into its own component:-->
让我们把按钮提取到它自己的组件中：

```js
const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)
```

<!-- The component gets the event handler function from the _handleClick_ prop, and the text of the button from the _text_ prop. Lets use the new component:-->
组件从 _handleClick_ prop获取事件处理函数，从 _text_ prop获取按钮文本。让我们使用新组件：

```js
const App = (props) => {
  // ...
  return (
    <div>
      {value}
      <Button handleClick={() => setToValue(1000)} text="thousand" /> // highlight-line
      <Button handleClick={() => setToValue(0)} text="reset" /> // highlight-line
      <Button handleClick={() => setToValue(value + 1)} text="increment" /> // highlight-line
    </div>
  )
}
```

<!-- Using the <i>Button</i> component is simple, although we have to make sure that we use the correct attribute names when passing props to the component.-->
使用 <i>Button</i> 组件很简单，尽管我们必须确保在传递props到组件时使用正确的属性名称。

![using correct attribute names code screenshot](../../images/1/12e.png)

### Do Not Define Components Within Components

<!-- Let''s start displaying the value of the application in its <i>Display</i> component.-->
让我们开始在其 <i>Display</i> 组件中显示应用程序的值。

<!-- We will change the application by defining a new component inside of the <i>App</i> component.-->
我们将通过在 <i>App</i> 组件内部定义一个新组件来改变应用程序。

```js
// This is the right place to define a component
const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const App = () => {
  const [value, setValue] = useState(10)

  const setToValue = newValue => {
    console.log('value now', newValue)
    setValue(newValue)
  }

  // Do not define components inside another component
  const Display = props => <div>{props.value}</div> // highlight-line

  return (
    <div>
      <Display value={value} />
      <Button handleClick={() => setToValue(1000)} text="thousand" />
      <Button handleClick={() => setToValue(0)} text="reset" />
      <Button handleClick={() => setToValue(value + 1)} text="increment" />
    </div>
  )
}
```

<!-- The application still appears to work, but **don''t implement components like this!** Never define components inside of other components. The method provides no benefits and leads to many unpleasant problems. The biggest problems are because React treats a component defined inside of another component as a new component in every render. This makes it impossible for React to optimize the component.-->
应用程序似乎仍在工作，但**不要像这样实现组件！**永远不要在其他组件内定义组件。该方法没有任何好处，并导致许多不愉快的问题。最大的问题是因为React将在另一个组件中定义的组件视为每次渲染中的新组件。这使得React无法优化组件。

<!-- Let''s instead move the <i>Display</i> component function to its correct place, which is outside of the <i>App</i> component function:-->
让我们把 <i>Display</i> 组件函数移动到它正确的位置，也就是 <i>App</i> 组件函数之外：

```js
const Display = props => <div>{props.value}</div>

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const App = () => {
  const [value, setValue] = useState(10)

  const setToValue = newValue => {
    console.log('value now', newValue)
    setValue(newValue)
  }

  return (
    <div>
      <Display value={value} />
      <Button handleClick={() => setToValue(1000)} text="thousand" />
      <Button handleClick={() => setToValue(0)} text="reset" />
      <Button handleClick={() => setToValue(value + 1)} text="increment" />
    </div>
  )
}
```

### Useful Reading

<!-- The internet is full of React-related material. However, we use the new style of React for which a large majority of the material found online is outdated.-->
互联网上充斥着与React相关的材料。然而，我们使用新版本的React，而网上大多数材料已经过时了。

<!-- You may find the following links useful:-->
你可能会发现以下链接有用：

<!-- - The [official React documentation](https://react.dev/learn) is worth checking out at some point, although most of it will become relevant only later on in the course. Also, everything related to class-based components is irrelevant to us;we'll stick to functional components.-->

[官方 React 文档](https://react.dev/learn) 值得查看一次，尽管大部分内容只有在课程晚些时候才会变得相关。此外，与基于类的组件相关的一切都与我们无关；我们将坚持使用函数组件。

<!-- - Some courses on [Egghead.io](https://egghead.io) like [Start learning React](https://egghead.io/courses/start-learning-react) are of high quality, and the recently updated [Beginner''s Guide to React](https://egghead.io/courses/the-beginner-s-guide-to-reactjs) is also relatively good; both courses introduce concepts that will also be introduced later on in this course. **NB** The first one uses class components but the latter uses the new functional ones.-->
[Egghead.io](https://egghead.io) 上的一些课程，如[开始学习 React](https://egghead.io/courses/start-learning-react) 质量很高，最近更新的[React 入门指南](https://egghead.io/courses/the-beginner-s-guide-to-reactjs) 也相对不错；这两门课都介绍了本课程稍后会介绍的概念。**注意**：前者使用的是类组件，而后者使用的是新的函数组件。

### Web programmers oath

<!-- Programming is hard, that is why I will use all the possible means to make it easier-->

- 编程很难，这就是为什么我会用尽一切可能的手段来让它变得更容易。

<!-- - I will have my browser developer console open all the time-->
- 我会一直开著浏览器开发者控制台。

<!-- - I progress with small steps-->
- 我一步一步地前进。

<!-- - I will write lots of _console.log_ statements to make sure I understand how the code behaves and to help pinpointing problems-->
- 我会写很多`console.log`语句来确保我理解代码的行为，并帮助确定问题。
<!-- - If my code does not work, I will not write more code. Instead I start deleting the code until it works or just return to a state when everything was still working-->
- 如果我的代码不起作用，我不会写更多的代码。相反，我会开始删除代码，直到它可以正常工作，或者只是回到一个所有事情仍然正常的状态。
<!-- - When I ask for help in the course Discord or Telegram channel or elsewhere I formulate my questions properly, see [here](http://fullstackopen.com/en/part0/general_info#how-to-get-help-in-discord-telegram) how to ask for help-->
- 当我在课程Discord或Telegram频道或其他地方寻求帮助时，我会正确地提出我的问题，参见[这里](http://fullstackopen.com/en/part0/general_info#how-to-get-help-in-discord-telegram)如何寻求帮助。

</div>

<div class="tasks">

<h3>Exercises 1.6.-1.14.</h3>

<!-- Submit your solutions to the exercises by first pushing your code to GitHub and then marking the completed exercises into the spreadsheet.-->
把你的解答提交到练习上，首先把你的代码推送到GitHub上，然后把完成的练习填写到电子表格中。

<!-- the "my submissions" tab of the [submission application](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).-->
[我的提交] 选项卡，[提交应用程序](https://studies.cs.helsinki.fi/stats/courses/fullstackopen)

<!-- Remember, submit **all** the exercises of one part **in a single submission**. Once you have submitted your solutions for one part, **you cannot submit more exercises to that part anymore**.-->
记住，**一次提交**就把一部分的所有练习提交上去。一旦你把一部分的练习提交完毕，**就不能再提交更多练习给那一部分了**。

<i>Some of the exercises work on the same application. In these cases, it is sufficient to submit just the final version of the application. If you wish, you can make a commit after every finished exercise, but it is not mandatory.</i>

<!-- **WARNING** create-react-app will automatically turn your project into a git-repository unless you create your application inside of an existing git repository. **Most likely you do not want each of your projects to be a separate repository**, so simply run the _rm -rf .git_ command at the root of your application.-->
**警告**：除非您在现有的git存储库中创建应用程序，否则create-react-app将自动将您的项目转换为git存储库。 **您很可能不希望每个项目都是单独的存储库**，因此只需在应用程序的根目录中运行_rm -rf .git_命令即可。

<!-- In some situations you may also have to run the command below from the root of the project:-->
在某些情况下，您也可能需要从项目的根目录运行下面的命令：

```bash
rm -rf node_modules/ && npm i
```

<!-- If and <i>when</i> you encounter an error message, take a screenshot and contact the developer-->
如果<i>当</i>你遇到错误消息，请撷取截图并联系开发者。

<!-- > <i>Objects are not valid as a React child</i>-->
<i>对象无效，不能用作 React 子组件</i>

<!-- keep in mind the things told [here](/en/part1/introduction_to_react#do-not-render-objects).-->
请记住[这里](/en/part1/introduction_to_react#do-not-render-objects)所说的事情。

<h4> 1.6: unicafe step1</h4>

<!-- Like most companies, the student restaurant of the University of Helsinki [Unicafe](https://www.unicafe.fi) collects feedback from its customers. Your task is to implement a web application for collecting customer feedback. There are only three options for feedback: <i>good</i>, <i>neutral</i>, and <i>bad</i>.-->
像大多数公司一样，赫尔辛基大学[Unicafe](https://www.unicafe.fi)的学生餐厅收集客户的反馈。您的任务是为收集客户反馈实现一个Web应用程序。反馈只有三个选项：<i>好</i>、<i>中立</i>和<i>差</i>。

<!-- The application must display the total number of collected feedback for each category. Your final application could look like this:-->
应用程序必须显示每个类别收集到的反馈总数。您的最终应用程序可能看起来像这样：

![screenshot of feedback options](../../images/1/13e.png)

<!-- Note that your application needs to work only during a single browser session. Once you refresh the page, the collected feedback is allowed to disappear.-->
**注意，您的应用程序只需要在单个浏览器会话期间工作。一旦您刷新页面，收集的反馈就被允许消失。**

<!-- It is advisable to use the same structure that is used in the material and previous exercise. File <i>index.js</i> is as follows:-->
它建议使用与材料和以前练习中使用的相同结构。文件<i>index.js</i>如下：

```js
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

<!-- You can use the code below as a starting point for the <i>App.js</i> file:-->
你可以使用下面的代码作为<i>App.js</i>文件的起点：

```js
import { useState } from 'react'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      code here
    </div>
  )
}

export default App
```

<h4>1.7: unicafe step2</h4>

<!-- Expand your application so that it shows more statistics about the gathered feedback: the total number of collected feedback, the average score (good: 1, neutral: 0, bad: -1) and the percentage of positive feedback.-->
扩展您的应用程序，以显示有关收集反馈的更多统计信息：收集的反馈总数，平均分数（好：1，中性：0，坏：-1）和正面反馈百分比。

![average and percentage positive screenshot feedback](../../images/1/14e.png)

<h4>1.8: unicafe step3</h4>

<!-- Refactor your application so that displaying the statistics is extracted into its own <i>Statistics</i> component. The state of the application should remain in the <i>App</i> root component.-->
重构你的应用，以便将显示统计信息提取到自己的<i>统计</i>组件中。应用的状态应该保留在<i>App</i>根组件中。

<!-- Remember that components should not be defined inside other components:-->
**记住：组件不应该在其他组件内定义**

```js
// a proper place to define a component
const Statistics = (props) => {
  // ...
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  // do not define a component within another component
  const Statistics = (props) => {
    // ...
  }

  return (
    // ...
  )
}
```

<h4>1.9: unicafe step4</h4>

<!-- Change your application to display statistics only once feedback has been gathered.-->
收集反馈后，更改您的应用程序以仅显示统计信息。

![no feedback given text screenshot](../../images/1/15e.png)

<h4>1.10: unicafe step5</h4>

<!-- Let''s continue refactoring the application. Extract the following two components:-->
让我们继续重构应用程序。提取以下两个组件：

<!-- - <i>Button</i> for defining the buttons used for submitting feedback-->
<i>提交反馈所使用的按钮</i>
<!-- - <i>StatisticLine</i> for displaying a single statistic, e.g. the average score.-->
<i>统计线</i>，用于显示单个统计数据，如平均分。

<!-- To be clear: the <i>StatisticLine</i> component always displays a single statistic, meaning that the application uses multiple components for rendering all of the statistics:-->
清楚的说：<i>StatisticLine</i> 组件总是显示单个统计量，这意味着应用程序使用多个组件来渲染所有统计量。

```js
const Statistics = (props) => {
  /// ...
  return(
    <div>
      <StatisticLine text="good" value ={...} />
      <StatisticLine text="neutral" value ={...} />
      <StatisticLine text="bad" value ={...} />
      // ...
    </div>
  )
}

```

<!-- The application''s state should still be kept in the root <i>App</i> component.-->
应该仍然将应用程序的状态保存在根<i>App</i>组件中。

<h4>1.11*: unicafe step6</h4>

<!-- Display the statistics in an HTML [table](https://developer.mozilla.org/en-US/docs/Learn/HTML/Tables/Basics), so that your application looks roughly like this:-->
在HTML [表格](https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Tables/Basics)中显示统计数据，使您的应用程序看起来大致如下：

![screenshot of statistics table](../../images/1/16e.png)

<!-- Remember to keep your console open at all times. If you see this warning in your console:-->
记住随时保持控制台开启。如果你在控制台看到这个警告：

![console warning](../../images/1/17a.png)

<!-- Then perform the necessary actions to make the warning disappear. Try pasting the error message into a search engine if you get stuck.-->
然后执行必要的操作以使警告消失。 如果你陷入困境，请尝试将错误消息粘贴到搜索引擎中。

<i>Typical source of an error _Unchecked runtime.lastError: Could not establish connection. Receiving end does not exist._ is Chrome extension. Try going to _chrome://extensions/_ and try disabling them one by one and refreshing React app page; the error should eventually disappear.</i>

<!-- **Make sure that from now on you don''t see any warnings in your console!**-->
确保从现在开始你的控制台不再出现任何警告！

<h4>1.12*: anecdotes step1</h4>

<!-- The world of software engineering is filled with [anecdotes](http://www.comp.nus.edu.sg/~damithch/pages/SE-quotes.htm) that distill timeless truths from our field into short one-liners.-->
世界上的软件工程充满了[轶事](http://www.comp.nus.edu.sg/~damithch/pages/SE-quotes.htm)，把我们领域的永恒真理精炼成简短的一句话。

<!-- Expand the following application by adding a button that can be clicked to display a <i>random</i> anecdote from the field of software engineering:-->
扩展以下应用程序，添加一个可以点击的按钮，以显示软件工程领域的<i>随机</i>轶事：

```js
import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0)

  return (
    <div>
      {anecdotes[selected]}
    </div>
  )
}

export default App
```

<!-- Content of the file <i>index.js</i> is the same as in previous exercises.-->
<i>index.js</i> 的内容与之前的练习相同。

<!-- Find out how to generate random numbers in JavaScript, eg. via a search engine or on [Mozilla Developer Network](https://developer.mozilla.org). Remember that you can test generating random numbers e.g. straight in the console of your browser.-->
通过搜索引擎或[Mozilla开发者网络](https://developer.mozilla.org)，找出如何在JavaScript中生成随机数。请记住，您可以在浏览器的控制台中直接测试生成随机数。

<!-- Your finished application could look something like this:-->
你的完成的申请可能看起来像这样：

![random anecdote with next button](../../images/1/18a.png)

<!-- **WARNING** create-react-app will automatically turn your project into a git-repository unless you create your application inside of an existing git repository. **Most likely you do not want each of your projects to be a separate repository**, so simply run the _rm -rf .git_ command at the root of your application.-->
**警告**：除非你在现有的git仓库中创建应用程序，否则create-react-app会自动将你的项目转换成一个git仓库。**很可能你不想每个项目都是一个单独的仓库**，因此只需在应用程序的根目录下运行_rm -rf .git_命令即可。

<h4>1.13*: anecdotes step2</h4>

<!-- Expand your application so that you can vote for the displayed anecdote.-->
扩展你的应用程序，以便你可以为显示的轶事投票。

![anecdote app with votes button added](../../images/1/19a.png)

<!-- **NB** store the votes of each anecdote into an array or object in the component''s state. Remember that the correct way of updating state stored in complex data structures like objects and arrays is to make a copy of the state.-->
**注意**：将每个轶事的投票存储在组件状态中的数组或对象中。请记住，更新存储在对象和数组等复杂数据结构中的状态的正确方法是制作一个状态的副本。

<!-- You can create a copy of an object like this:-->
你可以像这样创建一个对象的副本：

```js
const points = { 0: 1, 1: 3, 2: 4, 3: 2 }

const copy = { ...points }
// increment the property 2 value by one
copy[2] += 1
```

<!-- OR a copy of an array like this:-->
这是一个示例数组：

[1, 2, 3, 4, 5]

```js
const points = [1, 4, 6, 3]

const copy = [...points]
// increment the value in position 2 by one
copy[2] += 1
```

<!-- Using an array might be the simpler choice in this case. Searching the Internet will provide you with lots of hints on how to [create a zero-filled array of the desired length](https://stackoverflow.com/questions/20222501/how-to-create-a-zero-filled-javascript-array-of-arbitrary-length/22209781).-->
在这种情况下，使用数组可能是更简单的选择。上网搜索将为您提供许多提示，如何[创建所需长度的零填充数组](https://stackoverflow.com/questions/20222501/how-to-create-a-zero-filled-javascript-array-of-arbitrary-length/22209781)。

<h4>1.14*: anecdotes step3</h4>

<!-- Now implement the final version of the application that displays the anecdote with the largest number of votes:-->
现在实现最终版本的应用程序，它显示具有最多投票数的轶事：

![anecdote with largest number of votes](../../images/1/20a.png)

<!-- If multiple anecdotes are tied for first place it is sufficient to just show one of them.-->
如果多个轶事并列第一，只需要展示其中一个就足够了。

<!-- This was the last exercise for this part of the course and it''s time to push your code to GitHub and mark all of your finished exercises to the "my submissions" tab of the [submission application](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).-->
这是本部分课程的最后一个练习，现在是时候将你的代码推送到GitHub，并将所有已完成的练习标记到[提交应用程序](https://studies.cs.helsinki.fi/stats/courses/fullstackopen)的“我的提交”选项卡中。

</div>
