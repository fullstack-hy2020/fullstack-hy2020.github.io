---
mainImage: ../../../images/part-1.svg
part: 1
letter: a
lang: zh
---

<div class="content">
<!-- We will now start getting familiar with probably the most important topic of this course, namely the [React](https://react.dev/) library. Let''s start by making a simple React application as well as getting to know the core concepts of React.-->
我们现在进入本门课最重要的主题，[React](https://react.dev/) 库。让我们从制作一个简单的React应用入手，来了解React的核心概念。



<!-- The easiest way to get started by far is by using a tool called [create-react-app](https://github.com/facebook/create-react-app). It is possible (but not necessary) to install <i>create-react-app</i> on your machine if the <i>npm</i> tool that was installed along with Node has a version number of at least <i>5.3</i>.-->
最简单的方法无疑是使用一个叫[create-react-app](https://github.com/facebook/create-react-app)的工具。如果安装了Node的<i>npm</i>的版本号大于等于<i>5.3</i>，可以（但不是必须的）在机器上安装<i>create-react-app</i>。



<!-- > <i>You may also use the new generation frontend tool [Vite](https://vitejs.dev/) in this course if you wish. The create-react-app is still the tool recommended by the React team and that is why it remains the default tool to set up a React project in this course. Read [here](https://github.com/reactjs/reactjs.org/pull/5487#issuecomment-1409720741) how the React team sees the future of React tooling.</i>-->

> 如果您愿意，您也可以在本课程中使用新一代前端工具[Vite](https://vitejs.dev/)。Create-react-app仍然是React团队推荐的工具，这也是为什么它仍然是本课程中设置React项目的默认工具。请参阅[此处](https://github.com/reactjs/reactjs.org/pull/5487#issuecomment-1409720741)了解React团队对React工具未来的看法。

<!-- Let's create an application called <i>part1</i> and navigate to its directory.-->
让我们创建一个叫做<i>part1</i>的应用程序，并导航到它的目录。

```bash
npx create-react-app part1
cd part1
```

<!-- The application runs as follows-->
应用程序的运行如下：

```bash
npm start
```

<!-- By default, the application runs on localhost port 3000 with the address <http://localhost:3000>-->
默认情况下，该应用程序在本地主机端口3000上运行，地址为<http://localhost:3000>

<!-- Your default browser should launch automatically. Open the browser console **immediately**. Also, open a text editor so that you can view the code as well as the webpage at the same time on the screen:-->
你的默认浏览器应该会自动启动。**立即**打开浏览器控制台。同时，打开一个文本编辑器，这样你就可以同时在屏幕上同时查看代码以及网页。

![code and browser side by side](../../images/1/1e.png)

<!-- The code of the application resides in the <i>src</i> folder. Let's simplify the default code such that the contents of the file index.js looks like this:-->
代码位于<i>src</i>文件夹中。让我们简化默认代码，使index.js文件的内容如下：

```js
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

<!-- and file <i>App.js</i> looks like this-->
文件<i>App.js</i>看起来像这样：

```js
const App = () => (
  <div>
    <p>Hello world</p>
  </div>
)

export default App
```

<!-- The files <i>App.css</i>, <i>App.test.js</i>, <i>index.css</i>, <i>logo.svg</i>, <i>setupTests.js</i> and <i>reportWebVitals.js</i> may be deleted as they are not needed in our application right now.-->
文件<i>App.css</i>、<i>App.test.js</i>、<i>index.css</i>、<i>logo.svg</i>、<i>setupTests.js</i> 和 <i>reportWebVitals.js</i>可以被删除，因为它们现在在我们的应用中不需要。

### Component

<!-- The file <i>App.js</i> now defines a [React component](https://react.dev/learn/your-first-component) with the name <i>App</i>. The command on the final line of file <i>index.js</i> uses ReactDOM to render the component <i>App</i>.-->

文件<i>App.js</i>现在定义了一个名为<i>App</i>的[React组件](https://react.dev/learn/your-first-component)。文件<i>index.js</i>的最后一行命令使用ReactDOM来渲染组件<i>App</i>。

```js
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

<!-- renders its contents into the <i>div</i>-element, defined in the file <i>public/index.html</i>, having the <i>id</i> value 'root'.-->
将其内容呈现到文件<i>public/index.html</i>中定义的<i>div</i>元素中，其<i>id</i>值为'root'。

<!-- By default, the file <i>public/index.html</i> doesn't contain any HTML markup that is visible to us in the browser:-->
默认情况下，文件<i>public/index.html</i>不包含任何我们在浏览器中可见的HTML标记：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
      content not shown ...
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
```

<!-- You can try adding there some HTML to the file. However, when using React, all content that needs to be rendered is usually defined as React components.-->
你可以试着在那里添加一些HTML到文件中。但是，当使用React时，所有需要渲染的内容通常被定义为React组件。

<!-- Let's take a closer look at the code defining the component:-->
让我们仔细看一下定义组件的代码：

```js
const App = () => (
  <div>
    <p>Hello world</p>
  </div>
)
```

<!-- As you probably guessed, the component will be rendered as a <i>div</i>-tag, which wraps a <i>p</i>-tag containing the text <i>Hello world</i>.-->
<i>div</i>标签将会渲染组件，其中包裹着一个<i>p</i>标签，其中包含文本<i>Hello world</i>。

<!-- Technically the component is defined as a JavaScript function. The following is a function (which does not receive any parameters):-->
技术上，该组件被定义为一个JavaScript函数。以下是一个不接受任何参数的函数：

```js
() => (
  <div>
    <p>Hello world</p>
  </div>
)
```

<!-- The function is then assigned to a constant variable <i>App</i>:-->
然后将函数赋值给常量变量 <i>App</i>：

```js
const App = ...
```

<!-- There are a few ways to define functions in JavaScript. Here we will use [arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions), which are described in a newer version of JavaScript known as [ECMAScript 6](http://es6-features.org/#Constants), also called ES6.-->
在JavaScript中有几种定义函数的方式。这里我们将使用[箭头函数](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)，它们在一个较新版本的JavaScript中被引入，称为[ECMAScript 6](http://es6-features.org/#Constants)，也称为ES6。

<!-- Because the function consists of only a single expression we have used a shorthand, which represents this piece of code:-->
因为这个函数只包含一个表达式，我们使用了简写，代表这段代码：

```js
const App = () => {
  return (
    <div>
      <p>Hello world</p>
    </div>
  )
}
```

<!-- In other words, the function returns the value of the expression.-->
换句话说，该函数返回了表达式的值。

<!-- The function defining the component may contain any kind of JavaScript code. Modify your component to be as follows:-->
函数定义组件可以包含任何类型的JavaScript代码。将您的组件修改如下：

```js
const App = () => {
  console.log('Hello from component')
  return (
    <div>
      <p>Hello world</p>
    </div>
  )
}

export default App
```

<!-- and observe what happens in the browser console-->
在浏览器控制台中看看效果：

![browser console showing console log with arrow to "Hello from component"](../../images/1/30.png)

<!-- The first rule of frontend web development:-->

网页前端开发的第一条军规：

<!-- > <i>keep the console open all the time</i>-->
> <i>保持控制台一直开启</i>

<!-- Let us repeat this together: <i>I promise to keep the console open all the time</i> during this course, and for the rest of my life when I'm doing web development.-->
<i>请举起右手，跟我宣誓：我承诺，在这门课程期间以及我终生的网页开发时，将一直保持控制台打开的状态。</i>

<!-- It is also possible to render dynamic content inside of a component.-->
也可以在组件内部渲染动态内容。

<!-- Modify the component as follows:-->
修改组件如下：

```js
const App = () => {
  const now = new Date()
  const a = 10
  const b = 20
  console.log(now, a+b)

  return (
    <div>
      <p>Hello world, it is {now.toString()}</p>
      <p>
        {a} plus {b} is {a + b}
      </p>
    </div>
  )
}
```

<!-- Any JavaScript code within the curly braces is evaluated and the result of this evaluation is embedded into the defined place in the HTML produced by the component.-->
任何在大括号中的JavaScript代码都会被计算，并且计算的结果会被嵌入到由组件生成的HTML定义的位置中。

<!-- Note that you should not remove the line at the bottom of the component-->

请注意，不要删除组件的最后一行

```js
export default App
```

<!-- The export is not shown in most of the examples of the course material. Without the export the component and the whole app breaks down.-->
在教学材料的大多数例子中都不会展示export那行。但如果你不写export，组件和整个应用程序就会崩溃。

<!-- Did you remember your promise to keep the console open? What was printed out there?-->
还记得你的誓言，要保持控制台开启吗？那里打印出了什么？

### JSX

<!-- It seems like React components are returning HTML markup. However, this is not the case. The layout of React components is mostly written using [JSX](https://react.dev/learn/writing-markup-with-jsx). Although JSX looks like HTML, we are dealing with a way to write JavaScript. Under the hood, JSX returned by React components is compiled into JavaScript.-->
似乎React组件返回的是HTML标记。然而，并不是这样。React组件的布局大多使用[JSX](https://react.dev/learn/writing-markup-with-jsx)编写。虽然JSX看起来像HTML，但我们正在处理的是一种编写JavaScript的方法。在底层，React组件返回的JSX会被编译成JavaScript。

<!-- After compiling, our application looks like this:-->
编译后，我们的应用程序看起来像这样：

```js
const App = () => {
  const now = new Date()
  const a = 10
  const b = 20
  return React.createElement(
    'div',
    null,
    React.createElement(
      'p', null, 'Hello world, it is ', now.toString()
    ),
    React.createElement(
      'p', null, a, ' plus ', b, ' is ', a + b
    )
  )
}
```

<!-- The compilation is handled by [Babel](https://babeljs.io/repl/). Projects created with *create-react-app* are configured to compile automatically. We will learn more about this topic in [part 7](/en/part7) of this course.-->
编译是由[Babel](https://babeljs.io/repl/)处理的。使用*create-react-app*创建的项目配置为自动编译。我们将在本课程的[第7章](/en/part7)中学习更多关于这个主题的内容。

<!-- It is also possible to write React as "pure JavaScript" without using JSX. Although, nobody with a sound mind would do so.-->
你也可以不使用 JSX，用"纯 JavaScript"来编写 React。不过，脑子不秀逗的人是不会这么做的。

<!-- In practice, JSX is much like HTML with the distinction that with JSX you can easily embed dynamic content by writing appropriate JavaScript within curly braces. The idea of JSX is quite similar to many templating languages, such as Thymeleaf used along with Java Spring, which are used on servers.-->
在实践中，JSX 就像 HTML 一样，不同之处在于，通过在花括号中编写适当的 JavaScript，可以轻松地嵌入动态内容。JSX 的想法与许多模板语言（如与 Java Spring 一起使用的 Thymeleaf）非常相似，这些模板语言在服务器上使用。

<!-- JSX is "[XML](https://developer.mozilla.org/en-US/docs/Web/XML/XML_introduction)-like", which means that every tag needs to be closed. For example, a newline is an empty element, which in HTML can be written as follows:-->
JSX 是“[XML](https://developer.mozilla.org/en-US/docs/Web/XML/XML_introduction)样式的”，这意味着每个标签都需要关闭。例如，换行是一个空元素，可以用HTML如下方式编写：

```html
<br>
```

<!-- but when writing JSX, the tag needs to be closed:-->
但是，在编写JSX时，标签需要关闭：

```html
<br />
```

### Multiple components

<!-- Let's modify the file <i>App.js</i> as follows (NB: export at the bottom is left out in these <i>examples</i>, now and in the future. It is still needed for the code to work):-->
让我们按照以下代码修改文件<i>App.js</i>（注意：在这些<i>例子</i>中，现在和将来都没有展示export，它仍然是代码运行所必须的）：

```js
// highlight-start
const Hello = () => {
  return (
    <div>
      <p>Hello world</p>
    </div>
  )
}
// highlight-end

const App = () => {
  return (
    <div>
      <h1>Greetings</h1>
      <Hello /> // highlight-line
    </div>
  )
}
```

<!-- We have defined a new component <i>Hello</i> and used it inside the component <i>App</i>. Naturally, a component can be used multiple times:-->
我们定义了一个新的组件<i>Hello</i>，并在组件<i>App</i>内部使用它。当然，一个组件可以被多次使用：

```js
const App = () => {
  return (
    <div>
      <h1>Greetings</h1>
      <Hello />
      // highlight-start
      <Hello />
      <Hello />
      // highlight-end
    </div>
  )
}
```

<!-- Writing components with React is easy, and by combining components, even a more complex application can be kept fairly maintainable. Indeed, a core philosophy of React is composing applications from many specialized reusable components.-->
写React组件很容易，通过组合组件，即使是更复杂的应用也可以保持相当的可维护性。事实上，React的核心理念就是用许多专门的可重用组件构建应用程序。

<!-- Another strong convention is the idea of a <i>root component</i> called <i>App</i> at the top of the component tree of the application. Nevertheless, as we will learn in [part 6](/en/part6), there are situations where the component <i>App</i> is not exactly the root, but is wrapped within an appropriate utility component.-->

另一个强大的规则是在应用的组件树顶部有一个叫做App 的根组件的设计。不过我们将在[第六章](/en/part6) 学到，有时候组件<i>App</i>不是真正的根组件，而是包裹在一个合适的工具组件中。

### props: passing data to components

<!-- It is possible to pass data to components using so-called [props](https://react.dev/learn/passing-props-to-a-component).-->
可以使用所谓的[props](https://react.dev/learn/passing-props-to-a-component)将数据传递给组件。

<!-- Let's modify the component <i>Hello</i> as follows:-->
让我们修改<i>Hello</i>组件如下：

```js
const Hello = (props) => { // highlight-line
  return (
    <div>
      <p>Hello {props.name}</p> // highlight-line
    </div>
  )
}
```

<!-- Now the function defining the component has a parameter props. As an argument, the parameter receives an object, which has fields corresponding to all the "props" the user of the component defines.-->
现在定义组件的函数有一个参数props。作为参数，该参数接收一个对象，该对象具有与用户定义的所有“props”对应的字段。

<!-- The props are defined as follows:-->
**以下是定义的props ：**

```js
const App = () => {
  return (
    <div>
      <h1>Greetings</h1>
      <Hello name='George' /> // highlight-line
      <Hello name='Daisy' /> // highlight-line
    </div>
  )
}
```

<!-- There can be an arbitrary number of props and their values can be "hard-coded" strings or the results of JavaScript expressions. If the value of the prop is achieved using JavaScript it must be wrapped with curly braces.-->
有可能有任意数量的prop，它们的值可以是“硬编码”的字符串或者JavaScript表达式的结果。如果prop的值是使用JavaScript实现的，它必须被大括号包裹起来。

<!-- Let's modify the code so that the component <i>Hello</i> uses two props:-->
让我们修改代码，使<i>Hello</i>组件使用两个props：

```js
const Hello = (props) => {
  console.log(props) // highlight-line
  return (
    <div>
      <p>
        Hello {props.name}, you are {props.age} years old // highlight-line
      </p>
    </div>
  )
}

const App = () => {
  const name = 'Peter' // highlight-line
  const age = 10       // highlight-line

  return (
    <div>
      <h1>Greetings</h1>
      <Hello name='Maya' age={26 + 10} /> // highlight-line
      <Hello name={name} age={age} />     // highlight-line
    </div>
  )
}
```

<!-- The props sent by the component <i>App</i> are the values of the variables, the result of the evaluation of the sum expression and a regular string.-->
组件<i>App</i>发送的props是变量的值，求和表达式的求值结果以及一个普通字符串。

<!-- Component <i>Hello</i> also logs the value of the object props to the console.-->
 <i>Hello</i> 组件也会将对象props的值记录到控制台。

<!-- I really hope your console was open. If it was not, remember what you promised:-->
我希望你的控制台是打开的。如果不是，记住你所承诺的：

<!-- > <i>I promise to keep the console open all the time during this course, and for the rest of my life when I'm doing web development</i>-->
> <i>我承诺，在这门课程期间以及我终生的网页开发时，将一直保持控制台打开的状态。</i>

<!-- Software development is hard. It gets even harder if one is not using all the possible available tools such as the web-console and debug printing with _console.log_. Professionals use both <i>all the time</i> and there is no single reason why a beginner should not adopt the use of these wonderful helper methods that will make life so much easier.-->
软件开发很难。如果不使用好用的工具，比如web控制台和_console.log_调试打印，就会变得更加困难。专业人士总是会使用这些工具，没有任何理由让初学者不采用这些美妙的辅助方法，它们会让你的生活变得容易，远离996。

### Some notes

<!-- React has been configured to generate quite clear error messages. Despite this, you should, at least in the beginning, advance in **very small steps** and make sure that every change works as desired.-->
React 已经配置好了生成非常清晰的错误消息。尽管如此，你至少在开始时应该**慢慢来**，确保每一次改动都能够按照预期的方式运行。

<!-- **The console should always be open**. If the browser reports errors, it is not advisable to continue writing more code, hoping for miracles. You should instead try to understand the cause of the error and, for example, go back to the previous working state:-->
控制台应该总是保持打开的状态。如果浏览器报告了错误，不建议继续编写更多的代码，以期望奇迹发生。你应该尝试去理解错误的原因，例如，回到之前的工作状态：

![screenshot of undefined prop error](../../images/1/2a.png)

<!-- As we already mentioned, when programming with React, it is possible and worthwhile to write <em>console.log()</em> commands (which print to the console) within your code.-->
当用React编程时，我们已经提到，可以在代码中写入<em>console.log()</em>命令（打印到控制台），这是值得的。

<!-- Also, keep in mind that **React component names must be capitalized**. If you try defining a component as follows:-->
同时要记住，**React 组件名必须大写**。如果你尝试按照下面的方式定义一个组件：

```js
const footer = () => {
  return (
    <div>
      greeting app created by <a href='https://github.com/mluukkai'>mluukkai</a>
    </div>
  )
}
```

<!-- and use it like this-->

并如下使用它：

```js
const App = () => {
  return (
    <div>
      <h1>Greetings</h1>
      <Hello name='Maya' age={26 + 10} />
      <footer /> // highlight-line
    </div>
  )
}
```

<!-- the page is not going to display the content defined within the Footer component, and instead React only creates an empty [footer](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/footer) element, i.e. the built-in HTML element instead of the custom React element of the same name. If you change the first letter of the component name to a capital letter, then React creates a <i>div</i>-element defined in the Footer component, which is rendered on the page.-->
页面不会显示Footer组件中定义的内容，React只会创建一个空的[footer](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/footer)元素，即内置的HTML元素而不是同名的自定义React元素。如果把组件名的第一个字母改成大写，那么React会创建一个Footer组件中定义的<i>div</i>元素，这个元素会被渲染在页面上。

<!-- Note that the content of a React component (usually) needs to contain **one root element**. If we, for example, try to define the component <i>App</i> without the outermost <i>div</i>-element:-->
注意，React组件的内容（通常）需要包含**一个根元素**。例如，如果我们试图在没有最外层<i>div</i>元素的情况下定义组件<i>App</i>：

```js
const App = () => {
  return (
    <h1>Greetings</h1>
    <Hello name='Maya' age={26 + 10} />
    <Footer />
  )
}
```

<!-- the result is an error message.-->
**会报错**

![multiple root elements error screenshot](../../images/1/3c.png)

<!-- Using a root element is not the only working option. An <i>array</i> of components is also a valid solution:-->
使用根元素也不是唯一的可行方案。<i>数组</i>也是一种有效的解决方案：

```js
const App = () => {
  return [
    <h1>Greetings</h1>,
    <Hello name='Maya' age={26 + 10} />,
    <Footer />
  ]
}
```

<!-- However, when defining the root component of the application this is not a particularly wise thing to do, and it makes the code look a bit ugly.-->
然而，当定义应用程序的根组件时，这不是一件特别明智的事情，而且使代码看起来有点难看。

<!-- Because the root element is stipulated, we have "extra" div elements in the DOM tree. This can be avoided by using [fragments](https://react.dev/reference/react/Fragment), i.e. by wrapping the elements to be returned by the component with an empty element:-->
因为根元素是必须的，我们要在DOM树中有“额外”的div元素。可以通过使用[fragments](https://react.dev/reference/react/Fragment)来避免这种情况，即通过用一个空元素包裹要由组件返回的元素：

```js
const App = () => {
  const name = 'Peter'
  const age = 10

  return (
    <>
      <h1>Greetings</h1>
      <Hello name='Maya' age={26 + 10} />
      <Hello name={name} age={age} />
      <Footer />
    </>
  )
}
```

<!-- It now compiles successfully, and the DOM generated by React no longer contains the extra div element.-->
现在编译成功了，由React生成的DOM不再包含额外的div元素。

### Do not render objects

<!-- Consider an application that prints the names and ages of our friends on the screen:-->
考虑一个应用程序，在屏幕上打印我们朋友的姓名和年龄：

```js
const App = () => {
  const friends = [
    { name: 'Peter', age: 4 },
    { name: 'Maya', age: 10 },
  ]

  return (
    <div>
      <p>{friends[0]}</p>
      <p>{friends[1]}</p>
    </div>
  )
}

export default App
```

<!-- However, nothing appears on the screen. I've been trying to find a problem in the code for 15 minutes, but I can't figure out where the problem could be.-->
然而，屏幕上什么也没有输出。我一直在试图找出代码中的问题，但我找不出问题可能出在哪里。

<!-- I finally remember the promise we made-->
我最终想起了我们的承诺。

<!-- > <i>I promise to keep the console open all the time during this course, and for the rest of my life when I'm doing web development</i>-->
> <i>我承诺，在这门课程期间以及我终生的网页开发时，将一直保持控制台打开的状态。</i>

<!-- The console screams in red:-->
控制台以红色尖叫：

![devtools showing error with highlight around "Objects are not valid as a React child"](../../images/1/34new.png)

<!-- The core of the problem is <i>Objects are not valid as a React child</i>, i.e. the application tries to render <i>objects</i> and it fails again.-->
<i>问题的核心是，对象不能作为 React 子组件，也就是说，应用程序试图渲染对象，结果失败了。</i>

<!-- The code tries to render the information of one friend as follows-->
代码试图渲染一位朋友的信息如下：

```js
<p>{friends[0]}</p>
```

<!-- and this causes a problem because the item to be rendered in the braces is an object.-->
因为被放在大括号里的物件是一个对象，所以这就造成了这个问题。

```js
{ name: 'Peter', age: 4 }
```

<!-- In React, the individual things rendered in braces must be primitive values, such as numbers or strings.-->
在React中，括号中渲染的各个东西必须是原始类型，如数字或字符串。

<!-- The fix is ​​as follows-->
修复方法如下：

```js
const App = () => {
  const friends = [
    { name: 'Peter', age: 4 },
    { name: 'Maya', age: 10 },
  ]

  return (
    <div>
      <p>{friends[0].name} {friends[0].age}</p>
      <p>{friends[1].name} {friends[1].age}</p>
    </div>
  )
}

export default App
```

<!-- So now the friend's name is rendered separately inside the curly braces-->
现在朋友的名字被独立放在大括号里{}

```js
{friends[0].name}
```

<!-- and age-->

以及年龄

```js
{friends[0].age}
```

<!-- After correcting the error, you should clear the console error messages by pressing 🚫 and then reload the page content and make sure that no error messages are displayed.-->
在纠正错误后，您应该按🚫清除控制台错误消息，然后重新加载页面内容，并确保不显示任何错误消息。

<!-- A small additional note to the previous one. React also allows arrays to be rendered <i>if</i> the array contains values ​​that are eligible for rendering (such as numbers or strings). So the following program would work, although the result might not be what we want:-->
一个小小的补充，React也允许渲染数组，<i>如果</i> 数组包含可渲染的值（比如数字或字符串）。因此，下面的程序也可以正常运行，但结果可能不是我们想要的。

```js
const App = () => {
  const friends = [ 'Peter', 'Maya']

  return (
    <div>
      <p>{friends}</p>
    </div>
  )
}
```

<!-- In this part, it is not even worth trying to use the direct rendering of the tables, we will come back to it in the next part.-->
在这一章，甚至不值得尝试直接渲染表格，我们将在下一章再来讨论。

</div>

<div class="tasks">
<!--   <h3>Exercises 1.1.-1.2.</h3>-->
<h3>练习1.1.-1.2.</h3>

<!-- The exercises are submitted via GitHub, and by marking the exercises as done in the "my submissions" tab of the [submission application](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).-->
通过GitHub提交练习，并在[提交应用](https://studies.cs.helsinki.fi/stats/courses/fullstackopen)的“我的提交”选项卡中标记为完成。

<!-- The exercises are submitted **one part at a time**. When you have submitted the exercises for a part of the course you can no longer submit undone exercises for the same part.-->
练习**一次只能**提交一部分。当你提交了课程的一部分练习后，你就不能再提交该部分的未完成练习了。

<!-- Note that in this part, there are [more exercises](/en/part1/a_more_complex_state_debugging_react_apps#exercises-1-6-1-14) besides those found below. <i>Do not submit your work</i> until you have completed all of the exercises you want to submit for the part.-->
**注意，在这一部分，除了下面找到的题目以外，还有[更多练习](/en/part1/a_more_complex_state_debugging_react_apps#exercises-1-6-1-14)。<i>在你完成你想提交的所有练习之前，不要提交你的代码。</i>

<!-- You may submit all the exercises of this course into the same repository, or use multiple repositories. If you submit exercises of different parts into the same repository, please use a sensible naming scheme for the directories.-->
你可以把本课程的所有练习提交到同一个仓库，也可以使用多个仓库。如果你把不同部分的练习提交到同一个仓库，请为目录使用一个明智的命名方案。

<!-- One very functional file  structure for the submission repository is as follows:-->
一个非常功能性的提交仓库文件结构如下：

```text
part0
part1
  courseinfo
  unicafe
  anecdotes
part2
  phonebook
  countries
```

<!-- See this [example submission repository](https://github.com/fullstack-hy2020/example-submission-repository)!-->
看看这个[示例提交仓库](https://github.com/fullstack-hy2020/example-submission-repository)!

<!-- For each part of the course, there is a directory, which further branches into directories containing a series of exercises, like "unicafe" for part 1.-->
每一章节的课程都有一个目录，该目录可以进一步分支到包含一系列练习的目录，例如第一部分的「unicafe」。

<!-- Most of the exercises of the course build a larger application, eg. courseinfo, unicafe and anecdotes in this part, bit by bit. It is enough to submit the completed application. You can make a commit after each exercise, but that is not compulsory. For example the course info app is built in exercises 1.1.-1.5. It is just the end result after 1.5 that you need to submit!-->
大部分的课程练习都会构建一个更大的应用，比如课程信息，Uni Cafe和轶事，一点一点地。只要提交完成的应用就够了。每个练习后你可以做一个提交，但不是必须的。比如课程信息应用是在1.1-1.5练习中构建的，只有1.5后的最终结果你需要提交！

<!-- For each web application for a series of exercises, it is recommended to submit all files relating to that application, except for the directory <i>node\_modules</i>.-->
对于每个网络应用程序的一系列练习，建议提交与该应用程序相关的所有文件，除了目录<i>node\_modules</i>之外。

<!--   <h4>1.1: course information, step1</h4>-->
<h4>1.1：课程信息，第一步</h4>

<i>The application that we will start working on in this exercise will be further developed in a few of the following exercises. In this and other upcoming exercise sets in this course, it is enough to only submit the final state of the application. If desired, you may also create a commit for each exercise of the series, but this is entirely optional.</i>

<!-- Use create-react-app to initialize a new application. Modify <i>index.js</i> to match the following-->
structure:

使用create-react-app初始化一个新的应用程序。修改<i>index.js</i>以匹配以下结构：

```js
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

<!-- and <i>App.js</i> to match the following-->
App.js：

```
import React from 'react';

const App = () => {
  return <div>Hello World!</div>;
};

export default App;
```

```
import React from 'react';

const App = () => {
  return <div>你好，世界！</div>;
};

export default App;
```

```js
const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <h1>{course}</h1>
      <p>
        {part1} {exercises1}
      </p>
      <p>
        {part2} {exercises2}
      </p>
      <p>
        {part3} {exercises3}
      </p>
      <p>Number of exercises {exercises1 + exercises2 + exercises3}</p>
    </div>
  )
}

export default App
```

<!-- and remove extra files (App.css, App.test.js, index.css, logo.svg, setupTests.js, reportWebVitals.js)).-->
删除额外文件（App.css、App.test.js、index.css、logo.svg、setupTests.js、reportWebVitals.js）。

<!-- Unfortunately, the entire application is in the same component. Refactor the code so that it consists of three new components: <i>Header</i>, <i>Content</i>, and <i>Total</i>. All data still resides in the <i>App</i> component, which passes the necessary data to each component using <i>props</i>. <i>Header</i> takes care of rendering the name of the course, <i>Content</i> renders the parts and their number of exercises and <i>Total</i> renders the total number of exercises.-->
不幸的是，整个应用程序都在同一个组件中。重构代码，使其由三个新组件组成：<i>Header</i>，<i>Content</i>和<i>Total</i>。所有数据仍然存储在<i>App</i>组件中，它使用<i>props</i>将必要的数据传递给每个组件。<i>Header</i>负责渲染课程的名称，<i>Content</i>渲染部分及其练习的数量，<i>Total</i>渲染总练习数量。

<!-- Define the new components in the file <i>App.js</i>.-->
在文件<i>App.js</i>中定义新组件。

<!-- The <i>App</i> component's body will approximately be as follows:-->
<i>App</i> 组件的主体大致如下：

```js
const App = () => {
  // const-definitions

  return (
    <div>
      <Header course={course} />
      <Content ... />
      <Total ... />
    </div>
  )
}
```

<!-- **WARNING** Don't try to program all the components concurrently, because that will almost certainly break down the whole app. Proceed in small steps, first make e.g. the component <i>Header</i> and only when it works for sure, you could proceed to the next component.-->
**警告** 不要试图同时编程所有组件，因为这几乎肯定会破坏整个应用程序。以小步骤进行，首先制作例如<i>Header</i>组件，只有当它确实有效时，你才能继续下一个组件。

<!-- Careful, small-step progress may seem slow, but it is actually <i> by far the fastest</i> way to progress. Famous software developer Robert "Uncle Bob" Martin has stated this is true for software development as well.-->

<i>小心，小步的进展可能看起来很慢，但实际上<i>远比其他方式更快</i>。著名的软件开发人员Robert "Uncle Bob" Martin也曾表示，这在软件开发中也是如此。

<!-- > <i>"The only way to go fast, is to go well"</i>-->
> <i>「唯一能够快速前进的方式，就是做得更好」</i>

<!-- that is, according to Martin, careful progress with small steps is even the only way to be fast.-->
据马丁所说，谨慎前进，一步一个脚印，是唯一能够快速前进的方式。

<!-- **WARNING2** create-react-app automatically makes the project a git repository unless the application is created within an already existing repository. Most likely you **do not want** the project to become a repository, so run the command _rm -rf .git_ in the root of the project.-->
**警告2**：除非应用程序已经在现有的仓库中创建，否则create-react-app会自动将项目设置为git仓库。很可能你**不希望**项目成为仓库，因此在项目的根目录下运行命令_rm -rf .git_。

<h4>1.2: course information, step2</h4>

<!-- Refactor the <i>Content</i> component so that it does not render any names of parts or their number of exercises by itself. Instead, it only renders three <i>Part</i> components of which each renders the name and number of exercises of one part.-->
重构<i>内容</i>组件，使其不自行渲染任何部分的名称或其练习数量。相反，它只渲染三个<i>部分</i>组件，每个组件渲染一个部分的名称和练习数量。

```js
const Content = ... {
  return (
    <div>
      <Part .../>
      <Part .../>
      <Part .../>
    </div>
  )
}
```

<!-- Our application passes on information in quite a primitive way at the moment, since it is based on individual variables. We shall fix that in [part 2](/en/part2), but before that, let's go to part1b to learn about JavaScript.-->
我们目前的应用程序以非常原始的方式传递信息，因为它基于单个变量。我们将在[第二部分](/en/part2)中修复它，但在此之前，让我们去part1b学习JavaScript。

</div>
