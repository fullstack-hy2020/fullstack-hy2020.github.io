---
mainImage: ../../../images/part-1.svg
part: 1
letter: a
lang: zh
---

<div class="content">

We will now start getting familiar with probably the most important topic of this course, namely the [React](https://reactjs.org/)-library. Let's start off with making a simple React application as well as getting to know the core concepts of React.
我们现在开始熟悉这门课程中可能最重要的主题，即[反应]( https://reactjs.org/ )-库。 让我们从制作一个简单的 React 应用程序开始，同时了解 React 的核心概念。

The easiest way to get started by far is using a tool called [create-react-app](https://github.com/facebookincubator/create-react-app). It is possible (but not necessary) to install <i>create-react-app</i> on your machine if the <i>npm</i> tool that was installed along with Node has a version number of at least <i>5.3</i>.
到目前为止，最简单的开始方式是使用一个叫做[ create-react-app ]的工具( https://github.com/facebookincubator/create-react-app 应用程序)。 如果与 Node 一起安装的 i npm / i 工具的版本号至少为 i 5.3 / i，则可以(但不必)在机器上安装 i create-react-app / i。

Let's create an application called <i>part1</i> and navigate to its directory.
让我们创建一个名为 i part1 / i 的应用程序，并导航到它的目录。

```bash
$ npx create-react-app part1
$ cd part1
```

Every command, here and in the future, starting with the character <em>$</em> is typed into a terminal prompt, aka the command-line. The character <em>$</em> is not to be typed out because it represents the prompt.
在这里和将来，以 em $/ em 开头的每个命令都会输入到一个终端提示符中，也就是命令行。 不要键入字符 em $/ em，因为它表示提示符。

The application is run as follows
应用程序如下所示运行

```bash
$ npm start
```

By default, the application runs in localhost port 3000 with the address <http://localhost:3000>
默认情况下，应用程序在本地主机端口3000运行，地址为 http://localhost:3000

Chrome should launch automatically. Open the browser console **immediately**. Also open a text editor so that you can view the code as well as the web-page at the same time on the screen:
应该会自动启动。 立即打开浏览器控制台。 还可以打开一个文本编辑器，这样你就可以同时在屏幕上查看代码和网页:

![](../../images/1/1e.png)


The code of the application resides in the <i>src</i> folder. Let's simplify the default code such that the contents of the file <i>index.js</i> look like:
应用程序的代码位于 i src / i 文件夹中。 让我们简化默认代码，使文件 i index.js / i 的内容看起来像:

```js
import React from 'react'
import ReactDOM from 'react-dom'

const App = () => (
  <div>
    <p>Hello world</p>
  </div>
)

ReactDOM.render(<App />, document.getElementById('root'))
```

The files <i>App.js</i>, <i>App.css</i>, <i>App.test.js</i>, <i>logo.svg</i> and <i>serviceWorker.js</i> may be deleted as they are not needed in our application right now.
文件 i App.js / i、 i App.css / i、 i App.test.js / i、 i logo.svg / i 和 i serviceWorker.js / i 可能会被删除，因为它们目前在我们的应用程序中不需要。

### Component
# # 组件

The file <i>index.js</i> now defines a React-[component](https://reactjs.org/docs/components-and-props.html) with the name <i>App</i> and the command on the final line
文件 i index.js / i 现在定义了 React-[ component ]( https://reactjs.org/docs/components-and-props.html 文件) ，其名称为 i App / i，最后一行是命令

```js
ReactDOM.render(<App />, document.getElementById('root'))
```

renders its contents into the <i>div</i>-element, defined in the file <i>public/index.html</i>, having the <i>id</i> value 'root'.
将其内容呈现到 i div / i-element 中，该元素在文件 i public / index.html / i 中定义，其中 i id / i 值为‘ root’。

By default, the file <i>public/index.html</i> is empty. You can try adding some HTML into the file. However, when using React, all content that needs to be rendered is usually defined as React components.
默认情况下，文件 i public / index. html / i 为空。 您可以尝试在文件中添加一些 HTML。 但是，在使用 React 时，需要呈现的所有内容通常定义为 React 组件。

Let's take a closer look at the code defining the component:
让我们仔细看看定义组件的代码:

```js
const App = () => (
  <div>
    <p>Hello world</p>
  </div>
)
```

As you probably guessed, the component will be rendered as a <i>div</i>-tag, which wraps a <i>p</i>-tag containing the text <i>Hello world</i>.
您可能已经猜到，该组件将呈现为 i div / i-tag，该标记包含包含文本 i Hello world / i 的 i p / i-tag。

Technically the component is defined as a JavaScript function. The following is a function (which does not receive any parameters):
从技术上讲，这个组件被定义为一个 JavaScript 函数。下面是一个函数(它没有接收任何参数) :

```js
() => (
  <div>
    <p>Hello world</p>
  </div>
)
```

The function is then assigned to a constant variable <i>App</i>:
然后将该函数赋给一个常量变量 i App / i:

```js
const App = ...
```

There are a few ways to define functions in JavaScript. Here we will use [arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions), which are described in a newer version of JavaScript known as [ECMAScript 6](http://es6-features.org/#Constants), also called ES6.
在 JavaScript 中定义函数有几种方法。 在这里，我们将使用[箭头函数]( https://developer.mozilla.org/en-us/docs/web/JavaScript/reference/functions/arrow_functions ) ，这些函数在新版本的 JavaScript 中被描述为[ ECMAScript 6]( http://ES6-features.org/#constants ) ，也称为 ES6。

Because the function consists of only a single expression we have used a shorthand, which represents this piece of code:
因为这个函数只包含一个表达式，所以我们使用了一个简写，代表这段代码:

```js
const App = () => {
  return (
    <div>
      <p>Hello world</p>
    </div>
  )
}
```

In other words, the function returns the value of the expression.
换句话说，该函数返回表达式的值。

The function defining the component may contain any kind of JavaScript code. Modify your component to be as follows and observe what happens in the console:
定义组件的函数可以包含任何类型的 JavaScript 代码。 修改你的组件如下，观察在控制台中发生了什么:

```js
const App = () => {
  console.log('Hello from component')
  return (
    <div>
      <p>Hello world</p>
    </div>
  )
}
```

It is also possible to render dynamic content inside of a component.
还可以在组件内部呈现动态内容。

Modify the component as follows:
对组成部分进行如下修改:

```js
const App = () => {
  const now = new Date()
  const a = 10
  const b = 20

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

Any JavaScript code within the curly braces is evaluated and the result of this evaluation is embedded into the defined place in the HTML produced by the component.
大括号中的任何 JavaScript 代码都会被计算，并且这个计算的结果将嵌入到组件生成的 HTML 中定义的位置。

### JSX
# # JSX

It seems like React components are returning HTML markup. However, this is not the case. The layout of React components is mostly written using [JSX](https://reactjs.org/docs/introducing-jsx.html). Although JSX looks like HTML, we are actually dealing with a way to write JavaScript. Under the hood, JSX returned by React components is compiled into JavaScript.
看起来 React 组件返回 HTML 标记。 然而，事实并非如此。 React 组件的布局大部分是使用[ JSX ]( https://reactjs.org/docs/introducing-JSX.html )编写的。 尽管 JSX 看起来像 HTML，但我们实际上是在处理一种编写 JavaScript 的方法。 实际上，React 组件返回的 JSX 被编译成 JavaScript。

After compiling, our application looks like this:
编译后，我们的应用程序如下所示:

```js
import React from 'react'
import ReactDOM from 'react-dom'

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

ReactDOM.render(
  React.createElement(App, null),
  document.getElementById('root')
)
```

The compiling is handled by [Babel](https://babeljs.io/repl/). Projects created with *create-react-app* are configured to compile automatically. We will learn more about this topic in [part 7](/en/part7) of this course.
编译由[ Babel ]( https://babeljs.io/repl/ )处理。 使用 * create-react-app * 创建的项目被配置为自动编译。 我们将在本课程的[第7部分](/ 部分 / 第7部分)中学习更多关于这个主题的知识。

It is also possible to write React as "pure JavaScript" without using JSX. Although, nobody with a sound mind would actually do so.
也可以将 React 作为“纯 JavaScript”编写而不使用 JSX。 虽然，没有一个头脑清醒的人会这样做。

In practice, JSX is much like HTML with the distinction that with JSX you can easily embed dynamic content by writing appropriate JavaScript within curly braces. The idea of JSX is quite similar to many templating languages, such as Thymeleaf used along Java Spring, which are used on servers.
在实践中，JSX 与 HTML 非常相似，其区别在于，通过在大括号中编写适当的 JavaScript，您可以轻松地嵌入动态内容。 Jsx 的思想与许多模板语言非常相似，比如在 javaspring 中使用的 Thymeleaf，它们用于服务器。

JSX is "[XML](https://developer.mozilla.org/en-US/docs/Web/XML/XML_introduction)-like", which means that every tag needs to be closed. For example, a newline is an empty element, which in HTML can be written as follows:
Jsx 是“类似于[ XML ]( https://developer.mozilla.org/en-us/docs/web/XML/xml_introduction )”的，这意味着每个标记都需要关闭。 例如，换行符是一个空元素，在 HTML 中可以这样写:

```html
<br>
```

but when writing JSX, the tag needs to be closed:
但是在写 JSX 时，标签需要关闭:

```html
<br />
```

### Multiple components
# # # 多个组件

Let's modify the application as follows (NB: imports at the top of the file are left out in these <i>examples</i>, now and in the future. They are still needed for the code to work):
让我们按照以下方式修改应用程序(NB: 文件顶部的导入在这些 i examples / i 中被省略，现在和将来都是如此。 它们仍然是代码工作所需要的) :

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

ReactDOM.render(<App />, document.getElementById('root'))
```

We have defined a new component <i>Hello</i> and used it inside the component <i>App</i>. Naturally, a component can be used multiple times:
我们已经定义了一个新的组件 i Hello / i，并在组件 i App / i 中使用它。 当然，一个组件可以被多次使用:

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

Writing components with React is easy, and by combining components, even a more complex application can be kept fairly maintainable. Indeed, a core philosophy of React is composing applications from many specialized reusable components.
使用 React 编写组件很容易，通过组合组件，甚至可以使更复杂的应用程序保持相当的可维护性。 实际上，React 的核心理念是将许多专门的可重用组件组合成应用程序。

Another strong convention is the idea of a <i>root component</i> called <i>App</i> at the top of the component tree of the application. Nevertheless, as we will learn in [part 6](/en/part6), there are situations where the component <i>App</i> is not exactly the root, but is wrapped within an appropriate utility component.
另一个强大的约定是在应用程序的组件树顶部有一个 i root 组件 / i 叫做 i App / i。 然而，正如我们将在[ part 6](/ en / part6)中了解到的，在某些情况下，组件 i App / i 并不完全是根，而是包装在适当的实用工具组件中。

### props: passing data to components
道具: 将数据传递给组件

It is possible to pass data to components using so called [props](https://reactjs.org/docs/components-and-props.html).
使用所谓的[道具]( https://reactjs.org/docs/components-and-props.html )将数据传递给组件是可能的。

Let's modify the component <i>Hello</i> as follows
让我们按照以下方式修改组件 i Hello / i

```js
const Hello = (props) => { // highlight-line
  return (
    <div>
      <p>Hello {props.name}</p> // highlight-line
    </div>
  )
}
```

Now the function defining the component has a parameter <i>props</i>. As an argument, the parameter receives an object, which has fields corresponding to all the "props" the user of the component defines.
现在定义组件的函数有一个参数 i props / i。 作为一个参数，参数接收一个对象，该对象具有与组件用户定义的所有“ props”相对应的字段。

The props are defined as follows:
道具的定义如下:

```js
const App = () => {
  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="George" /> // highlight-line
      <Hello name="Daisy" /> // highlight-line
    </div>
  )
}
```

There can be an arbitrary number of props and their values can be "hard coded" strings or results of JavaScript expressions. If the value of the prop is achieved using JavaScript it must be wrapped with curly braces.
可以有任意数量的道具，它们的值可以是“硬编码的”字符串或 JavaScript 表达式的结果。 如果道具的价值是通过 JavaScript 实现的，那么它必须用花括号包裹起来。

Let's modify the code so that the component <i>Hello</i> uses two props:
让我们修改代码，使组件 i Hello / i 使用两个道具:

```js
const Hello = (props) => {
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
      <Hello name="Maya" age={26 + 10} /> // highlight-line
      <Hello name={name} age={age} />     // highlight-line
    </div>
  )
}
```

The props sent by the component <i>App</i> are the values of the variables, the result of the evaluation of the sum expression and a regular string.
组件 i App / i 发送的道具是变量的值、求和表达式的计算结果和一个正则字符串。

### Some notes
一些音符

React has been configured to generate quite clear error messages. Despite this, you should, at least in the beginning, advance in **very small steps** and make sure that every change works as desired.
反应配置为生成非常清晰的错误消息。 尽管如此，你应该，至少在开始的时候，在非常小的步骤上前进，并且确保每一个改变都按照预期的方式工作。

**The console should always be open**. If the browser reports errors, it is not advisable to continue writing more code, hoping for miracles. You should instead try to understand the cause of the error and, for example, go back to the previous working state:
* * 控制台应该始终打开 * * 。 如果浏览器报告错误，那么继续编写更多代码，期待奇迹发生就不明智了。 相反，你应该试着理解错误的原因，例如，回到以前的工作状态:

![](../../images/1/2a.png)


It is good to remember that in React it is possible and worthwhile to write <em>console.log()</em> commands (which print to the console) within your code.
最好记住，在 React 中，在代码中编写 em console.log () / em 命令(打印到控制台)是可能的，也是值得的。

Also keep in mind that **React component names must be capitalized**. If you try defining a component as follows
还要记住 * * React component names 必须大写 * *

```js
const footer = () => {
  return (
    <div>
      greeting app created by 
      <a href="https://github.com/mluukkai">mluukkai</a>
    </div>
  )
}
```

and use it like this
像这样使用它

```js
const App = () => {
  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="Maya" age={26 + 10} />
      <footer /> // highlight-line
    </div>
  )
}
```

the page is not going to display the content defined within the Footer component, and instead React only creates an empty <i>footer</i> element. If you change the first letter of the component name to a capital letter, then React creates a <i>div</i>-element defined in the Footer component, which is rendered on the page.
页面不会显示 Footer 组件中定义的内容，React 只创建一个空的 i Footer / i 元素。 如果您将组件名称的第一个字母更改为大写字母，那么 React 将创建在 Footer 组件中定义的 i div / i-element，该元素将呈现在页面上。

Note that the content of a React component (usually) needs to contain **one root element**. If we, for example, try to define the component <i>App</i> without the outermost <i>div</i>-element:
注意 React 组件的内容(通常)需要包含 * * 一个根元素 * * 。 例如，如果我们尝试定义组件 i App / i 而不使用最外面的 i div / i-element:

```js
const App = () => {
  return (
    <h1>Greetings</h1>
    <Hello name="Maya" age={26 + 10} />
    <Footer />
  )
}
```

the result is an error message.
结果是一个错误信息。

![](../../images/1/3e.png)


Using a root element is not the only working option. An <i>array</i> of components is also a valid solution:
使用根元素并不是唯一可行的选择，组件的 i 数组 / i 也是一个有效的解决方案:

```js
const App = () => {
  return [
    <h1>Greetings</h1>,
    <Hello name="Maya" age={26 + 10} />,
    <Footer />
  ]
}
```

However, when defining the root component of the application this is not a particularly wise thing to do, and it makes the code look a bit ugly.
但是，在定义应用程序的根组件时，这样做并不明智，而且会使代码看起来有点难看。

Because the root element is stipulated, we have "extra" div-elements in the DOM-tree. This can be avoided by using [fragments](https://reactjs.org/docs/fragments.html#short-syntax), i.e. by wrapping the elements to be returned by the component with an empty element:
因为根元素是规定的，所以在 dom- 树中有“额外的” div 元素。 这可以通过使用[ fragments ]( https://reactjs.org/docs/fragments.html#short-syntax )来避免，即用一个空元素包装组件返回的元素:

```js
const App = () => {
  const name = 'Peter'
  const age = 10

  return (
    <>
      <h1>Greetings</h1>
      <Hello name="Maya" age={26 + 10} />
      <Hello name={name} age={age} />
      <Footer />
    </>
  )
}
```

It now compiles successfully, and the DOM generated by React no longer contains the extra div-element.
现在它已经成功地编译了，React 生成的 DOM 不再包含额外的 div-element。

</div>
/ div

<div class="tasks">
  <h3>Exercises 1.1.-1.2.</h3>
H3练习1.1- 1.2. / h3

Exercises are submitted through GitHub and by marking completed exercises in the [submission application](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).
练习通过 GitHub 提交，并在[提交申请] https://studies.cs.helsinki.fi/stats/courses/fullstackopen 中标记完成的练习。

You may submit all the exercises of this course into the same repository, or use multiple repositories. If you submit exercises of different parts into the same repository, please use a sensible naming scheme for the directories.
您可以将本课程的所有练习提交到同一个存储库中，或者使用多个存储库。 如果您将不同部分的练习提交到同一个存储库中，请使用合理的目录命名方案。

One very functional file  structure for the submission repository is as follows:
提交存储库的一个非常实用的文件结构如下:

```
part0
part1
  courseinfo
  unicafe
  anecdotes
part2
  phonebook
  countries
```

For each part of the course there is a directory, which further branches into directories containing a series of exercises, like "unicafe" for part 1.
课程的每一部分都有一个目录，它进一步分支到包含一系列练习的目录中，如第1部分的“ unicafe”。

For each web application for a series of exercises, it is recommended to submit all files relating to that application, except for the directory <i>node\_modules</i>.
对于每个 web 应用程序的一系列练习，建议提交与该应用程序相关的所有文件，但目录 i node  modules / i 除外。

The exercises are submitted **one part at a time**. When you have submitted the exercises for a part of the course you can no longer submit undone exercises for the same part.
练习一次提交一部分。 当你已经提交了部分课程的练习，你就不能再提交同一部分未完成的练习。

Note that in this part, there are more exercises besides those found below. <i>Do not submit your work</i> until you have completed all of the exercises you want to submit for the part.
请注意，在这一部分，除了下面的练习，还有更多的练习。 我不提交你的工作 / 我，直到你完成所有的练习，你想提交的部分。

  <h4>1.1: course information, step1</h4>
H41.1: 课程信息，步骤1 / h4

<i>The application that we will start working on in this exercise will be further developed in a few of the following exercises. In this and other upcoming exercise sets in this course, it is enough to only submit the final state of the application. If desired, you may also create a commit for each exercise of the series, but this is entirely optional.</i>
I 我们将在以下几个演习中进一步开发这次演习中开始处理的应用程序。 在本课程的这个练习集和其他即将进行的练习集中，只需提交应用程序的最终状态即可。 如果需要，还可以为该系列的每个练习创建提交，但这是完全可选的。 我

Use create-react-app to initialize a new application. Modify <i>index.js</i> to match the following
使用 create-react-app 初始化一个新的应用程序

```js
import React from 'react'
import ReactDOM from 'react-dom'

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

ReactDOM.render(<App />, document.getElementById('root'))
```

and remove extra files (App.js, App.css, App.test.js, logo.svg, serviceWorker.js).
并删除额外的文件(App.js、 App.css、 App.test.js、 logo.svg、 serviceWorker.js)。

Unfortunately, the entire application is in the same component. Refactor the code so that it consists of three new components: <i>Header</i>, <i>Content</i>, and <i>Total</i>. All data still resides in the <i>App</i> component, which passes the necessary data to each component using <i>props</i>. <i>Header</i> takes care of rendering the name of the course, <i>Content</i> renders the parts and their number of exercises and <i>Total</i> renders the total number of exercises.
不幸的是，整个应用程序都在同一个组件中。 重构代码，使其由三个新组件组成: i Header / i、 i Content / i 和 i Total / i。 所有数据仍然驻留在 i App / i 组件中，该组件使用 i props / i 将必要的数据传递给每个组件。 I Header / i 负责显示课程的名称，i Content / i 显示课程的部分及其练习的数量，i Total / i 显示练习的总数。

The <i>App</i> component's body will approximately be as follows:
I App / i 组件的主体大致如下:

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

**WARNING** create-react-app automatically makes the project a git repository unless the application is created within an already existing repository. Most likely you **do not want** the project becoming a repository, so run the command _rm -rf .git_ in the root of the project.
* * WARNING * * create-react-app 自动使项目成为 git 仓库，除非应用程序是在已有仓库中创建的。 很可能您不希望项目成为存储库，因此运行命令 rm-rf。 在项目的根目录中。

<h4>1.2: course information, step2</h4>
H41.2: 课程信息，步骤2 / h4

Refactor the <i>Content</i> component so that it does not render any names of parts or their number of exercises by itself. Instead it only renders three <i>Part</i> components of which each renders the name and number of exercises of one part.
重构 i Content / i 组件，以便它本身不会呈现任何部分的名称或它们的练习数量。 相反，它只呈现三个 i Part / i 组件，每个组件呈现一个部分的名称和练习次数。

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

Our application passes on information in quite a primitive way at the moment, since it is based on individual variables. This situation will improve soon.
我们的应用程序目前以相当原始的方式传递信息，因为它是基于单个变量的。 这种情况很快就会好转。

</div>

