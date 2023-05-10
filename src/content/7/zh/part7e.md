---
mainImage: ../../../images/part-7.svg
part: 7
letter: e
lang: zh
---

<div class="content">

### Class Components

<!-- During the course, we have only used React components having been defined as Javascript functions. This was not possible without the [hook](https://reactjs.org/docs/hooks-intro.html) functionality that came with version 16.8 of React. Before, when defining a component that uses state, one had to define it using Javascript''s [Class](https://reactjs.org/docs/state-and-lifecycle.html#converting-a-function-to-a-class) syntax.-->
在本课程中，我们只使用定义为Javascript函数的React组件。若没有React 16.8版本中提供的[hook](https://reactjs.org/docs/hooks-intro.html)功能，这是不可能的。在此之前，如果要定义使用状态的组件，则必须使用Javascript的[Class](https://reactjs.org/docs/state-and-lifecycle.html#converting-a-function-to-a-class)语法来定义。

<!-- It is beneficial to at least be familiar with Class Components to some extent since the world contains a lot of old React code, which will probably never be completely rewritten using the updated syntax.-->
至少要熟悉类组件，因为世界上有很多旧的 React 代码，这些代码可能永远不会用更新的语法重写，这是有益的。

<!-- Let''s get to know the main features of Class Components by producing yet another very familiar anecdote application. We store the anecdotes in the file <i>db.json</i> using <i>json-server</i>. The contents of the file are lifted from [here](https://github.com/fullstack-hy/misc/blob/master/anecdotes.json).-->
让我们通过创建另一个非常熟悉的轶事应用程序来了解类组件的主要特征。我们使用<i>json-server</i>将轶事存储在文件<i>db.json</i>中。文件的内容来自[here](https://github.com/fullstack-hy/misc/blob/master/anecdotes.json)。

<!-- The initial version of the Class Component looks like this-->
这个类组件的初始版本看起来像这样：

```js
import React from 'react'

class App extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <h1>anecdote of the day</h1>
      </div>
    )
  }
}

export default App
```

<!-- The component now has a [constructor](https://reactjs.org/docs/react-component.html#constructor), in which nothing happens at the moment, and contains the method [render](https://reactjs.org/docs/react-component.html#render). As one might guess, render defines how and what is rendered to the screen.-->
现在，该组件有一个[构造函数](https://reactjs.org/docs/react-component.html#constructor)，目前什么也没有发生，并包含了[render](https://reactjs.org/docs/react-component.html#render)方法。正如人们可以猜测的，render定义了如何以及什么样的内容渲染到屏幕上。

<!-- Let''s define a state for the list of anecdotes and the currently-visible anecdote. In contrast to when using the [useState](https://reactjs.org/docs/hooks-state.html) hook, Class Components only contain one state. So if the state is made up of multiple "parts", they should be stored as properties of the state. The state is initialized in the constructor:-->
让我们为列表中的轶事和当前可见的轶事定义一个状态。与使用[useState](https://reactjs.org/docs/hooks-state.html)钩子不同，类组件只包含一个状态。因此，如果状态由多个“部分”组成，它们应该存储为状态的属性。状态在构造函数中初始化：

```js
class App extends React.Component {
  constructor(props) {
    super(props)

    // highlight-start
    this.state = {
      anecdotes: [],
      current: 0
    }
    // highlight-end
  }

  render() {
  // highlight-start
    if (this.state.anecdotes.length === 0) {
      return <div>no anecdotes...</div>
    }
  // highlight-end

    return (
      <div>
        <h1>anecdote of the day</h1>
        // highlight-start
        <div>
          {this.state.anecdotes[this.state.current].content}
        </div>
        <button>next</button>
        // highlight-end
      </div>
    )
  }
}
```

<!-- The component state is in the instance variable _this.state_. The state is an object having two properties. <i>this.state.anecdotes</i> is the list of anecdotes and <i>this.state.current</i> is the index of the currently-shown anecdote.-->
组件状态存在于实例变量_this.state_中。状态是一个对象，具有两个属性。<i>this.state.anecdotes</i> 是轶事列表，<i>this.state.current</i> 是当前显示的轶事的索引。

<!-- In Functional components, the right place for fetching data from a server is inside an [effect hook](https://reactjs.org/docs/hooks-effect.html), which is executed when a component renders or less frequently if necessary, e.g. only in combination with the first render.-->
在功能组件中，从服务器获取数据的正确位置是在[effect hook](https://reactjs.org/docs/hooks-effect.html)中，它在组件渲染时执行，或者根据需要，只有在第一次渲染时才执行。

<!-- The [lifecycle methods](https://reactjs.org/docs/state-and-lifecycle.html#adding-lifecycle-methods-to-a-class) of Class Components offer corresponding functionality. The correct place to trigger the fetching of data from a server is inside the lifecycle method [componentDidMount](https://reactjs.org/docs/react-component.html#componentdidmount), which is executed once right after the first time a component renders:-->
Class 组件的[生命周期方法](https://reactjs.org/docs/state-and-lifecycle.html#adding-lifecycle-methods-to-a-class) 提供相应的功能。从服务器抓取数据的正确位置是在生命周期方法[componentDidMount](https://reactjs.org/docs/react-component.html#componentdidmount)中，该方法在组件第一次渲染之后立即执行：

```js
class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      anecdotes: [],
      current: 0
    }
  }

  // highlight-start
  componentDidMount = () => {
    axios.get('http://localhost:3001/anecdotes').then(response => {
      this.setState({ anecdotes: response.data })
    })
  }
  // highlight-end

  // ...
}
```

<!-- The callback function of the HTTP request updates the component state using the method [setState](https://reactjs.org/docs/react-component.html#setstate). The method only touches the keys that have been defined in the object passed to the method as an argument. The value for the key <i>current</i> remains unchanged.-->
回调函数的HTTP请求使用[setState](https://reactjs.org/docs/react-component.html#setstate)方法更新组件状态。该方法仅触及传递给该方法作为参数的对象中定义的键。<i>当前</i>键的值保持不变。

<!-- Calling the method setState always triggers the rerender of the Class Component, i.e. calling the method _render_.-->
调用`setState`方法总是会触发类组件的重新渲染，即调用`_render_`方法。

<!-- We''ll finish off the component with the ability to change the shown anecdote. The following is the code for the entire component with the addition highlighted:-->
我们将以更改显示的故事的能力来完成该组件。以下是整个组件的代码，其中显示了增加的部分：

```js
class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      anecdotes: [],
      current: 0
    }
  }

  componentDidMount = () => {
    axios.get('http://localhost:3001/anecdotes').then(response => {
      this.setState({ anecdotes: response.data })
    })
  }

  // highlight-start
  handleClick = () => {
    const current = Math.floor(
      Math.random() * this.state.anecdotes.length
    )
    this.setState({ current })
  }
  // highlight-end

  render() {
    if (this.state.anecdotes.length === 0 ) {
      return <div>no anecdotes...</div>
    }

    return (
      <div>
        <h1>anecdote of the day</h1>
        <div>{this.state.anecdotes[this.state.current].content}</div>
        <button onClick={this.handleClick}>next</button> // highlight-line
      </div>
    )
  }
}
```

<!-- For comparison, here is the same application as a Functional component:-->
为了比较，这是同一个应用程序的功能组件：

```js
const App = () => {
  const [anecdotes, setAnecdotes] = useState([])
  const [current, setCurrent] = useState(0)

  useEffect(() =>{
    axios.get('http://localhost:3001/anecdotes').then(response => {
      setAnecdotes(response.data)
    })
  },[])

  const handleClick = () => {
    setCurrent(Math.round(Math.random() * (anecdotes.length - 1)))
  }

  if (anecdotes.length === 0) {
    return <div>no anecdotes...</div>
  }

  return (
    <div>
      <h1>anecdote of the day</h1>
      <div>{anecdotes[current].content}</div>
      <button onClick={handleClick}>next</button>
    </div>
  )
}
```

<!-- In the case of our example, the differences were minor. The biggest difference between Functional components and Class components is mainly that the state of a Class component is a single object, and that the state is updated using the method _setState_, while in Functional components the state can consist of multiple different variables, with all of them having their own update function.-->
在我们的例子中，差异很小。功能组件和类组件之间最大的区别主要是，类组件的状态是一个单独的对象，并且使用_setState_方法更新状态，而在功能组件中，状态可以由多个不同的变量组成，每个变量都有自己的更新函数。

<!-- In some more advanced use cases, the effect hook offers a considerably better mechanism for controlling side effects compared to the lifecycle methods of Class Components.-->
在一些更高级的用例中，effect hook 提供了一种比类组件的生命周期方法更好的控制副作用的机制。

<!-- A notable benefit of using Functional components is not having to deal with the self-referencing _this_ reference of the Javascript class.-->
使用功能组件的一个显著好处是不必处理Javascript类的自引用_this_引用。

<!-- In my opinion, and the opinion of many others, Class Components offer little benefit over Functional components enhanced with hooks, except for the so-called [error boundary](https://reactjs.org/docs/error-boundaries.html) mechanism, which currently (15th February 2021) isn''t yet in use by functional components.-->
在我和许多其他人看来，除了所谓的[错误边界](https://reactjs.org/docs/error-boundaries.html)机制（目前（2021年2月15日）尚未被函数组件使用）之外，类组件与使用 Hooks 增强的函数组件几乎没有任何好处。

<!-- When writing fresh code, [there is no rational reason to use Class Components](https://reactjs.org/docs/hooks-faq.html#should-i-use-hooks-classes-or-a-mix-of-both) if the project is using React with a version number 16.8 or greater. On the other hand, [there is currently no need to rewrite all old React code](https://reactjs.org/docs/hooks-faq.html#do-i-need-to-rewrite-all-my-class-components) as Functional components.-->
当编写新代码时，如果项目使用的 React 版本号大于或等于 16.8，[没有理性的理由使用类组件](https://reactjs.org/docs/hooks-faq.html#should-i-use-hooks-classes-or-a-mix-of-both)。另一方面，[目前不需要重写所有旧的 React 代码](https://reactjs.org/docs/hooks-faq.html#do-i-need-to-rewrite-all-my-class-components)为功能组件。

### Organization of code in React application

<!-- In most applications, we followed the principle by which components were placed in the directory <i>components</i>, reducers were placed in the directory <i>reducers</i>, and the code responsible for communicating with the server was placed in the directory <i>services</i>. This way of organizing fits a smaller application just fine, but as the amount of components increases, better solutions are needed. There is no one correct way to organize a project. The article [The 100% correct way to structure a React app (or why there’s no such thing)](https://medium.com/hackernoon/the-100-correct-way-to-structure-a-react-app-or-why-theres-no-such-thing-3ede534ef1ed) provides some perspective on the issue.-->
在大多数应用中，我们遵循将组件放入目录<i>components</i>，将reducers放入目录<i>reducers</i>，将负责与服务器通信的代码放入目录<i>services</i>的原则。这种组织方式对较小的应用程序来说就足够了，但随着组件数量的增加，需要更好的解决方案。没有一种正确的方式来组织一个项目。文章[The 100% correct way to structure a React app (or why there’s no such thing)](https://medium.com/hackernoon/the-100-correct-way-to-structure-a-react-app-or-why-theres-no-such-thing-3ede534ef1ed)对这个问题提供了一些观点。

### Frontend and backend in the same repository

<!-- During the course, we have created the frontend and backend into separate repositories. This is a very typical approach. However, we did the deployment by [copying](/en/part3/deploying_app_to_internet#serving-static-files-from-the-backend) the bundled frontend code into the backend repository. A possibly better approach would have been to deploy the frontend code separately. Especially with applications created using Create React App, it is very straightforward thanks to the included [buildpack](https://github.com/mars/create-react-app-buildpack).-->
在课程中，我们将前端和后端分别创建到不同的仓库中，这是一种非常典型的做法。然而，我们通过[复制](/en/part3/deploying_app_to_internet#serving-static-files-from-the-backend) 打包的前端代码到后端仓库进行部署。一种可能更好的做法是将前端代码单独部署。特别是使用Create React App创建的应用，由于包含了[构建包](https://github.com/mars/create-react-app-buildpack)，这是非常直接的。

<!-- Sometimes, there may be a situation where the entire application is to be put into a single repository. In this case, a common approach is to put the <i>package.json</i> and <i>webpack.config.js</i> in the root directory, as well as place the frontend and backend code into their own directories, e.g. <i>client</i> and <i>server</i>.-->
有时，可能会出现一种情况，即将整个应用程序放入单个存储库中。在这种情况下，一种常见的方法是将<i>package.json</i>和<i>webpack.config.js</i>放在根目录中，并将前端和后端代码放入各自的目录中，例如<i>client</i>和<i>server</i>。

<!-- [This repository](https://github.com/fullstack-hy2020/create-app) provides one possible starting point for the organization of "single repository code".-->
[这个存储库](https://github.com/fullstack-hy2020/create-app) 为"单个存储库代码"的组织提供了一个可能的起点。

### Changes on the server

<!-- If there are changes in the state on the server, e.g. when new blogs are added by other users to the bloglist service, the React frontend we implemented during this course will not notice these changes until the page reloads. A similar situation arises when the frontend triggers a time-consuming computation in the backend. How do we reflect the results of the computation to the frontend?-->
如果服务器上的状态发生变化，例如其他用户在博客列表服务中添加了新的博客，那么我们在本课程中实现的React前端将不会注意到这些变化，直到页面重新加载。当前端触发后端耗时计算时，也会出现类似情况。我们如何将计算结果反映到前端？

<!-- One way is to execute [polling](<https://en.wikipedia.org/wiki/Polling_(computer_science)>) on the frontend, meaning repeated requests to the backend API e.g. using the [setInterval](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval) command.-->
一种方法是在前端执行[投票](<https://en.wikipedia.org/wiki/Polling_(computer_science)>)，这意味着对后端API进行重复请求，例如使用[setInterval](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval)命令。

<!-- A more sophisticated way is to use [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) which allow for establishing a two-way communication channel between the browser and the server. In this case, the browser does not need to poll the backend, and instead only has to define callback functions for situations when the server sends data about updating state using a WebSocket.-->
一种更加复杂的方式是使用[WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)，它可以在浏览器和服务器之间建立双向通信通道。在这种情况下，浏览器不需要轮询后端，而只需要为服务器使用WebSocket发送关于更新状态的数据时定义回调函数。

<!-- WebSockets is an API provided by the browser, which is not yet fully supported on all browsers:-->
WebSockets是浏览器提供的一种API，但尚未在所有浏览器中完全支持：

![caniuse chart showing websockets not usable by all yet](../../images/7/31ea.png)

<!-- Instead of directly using the WebSocket API, it is advisable to use the [Socket.io](https://socket.io/) library, which provides various <i>fallback</i> options in case the browser does not have full support for WebSockets.-->
代替直接使用WebSocket API，建议使用[Socket.io](https://socket.io/)库，该库在浏览器不完全支持WebSockets的情况下提供各种<i>回退</i>选项。

<!-- In [part 8](/en/part8), our topic is GraphQL, which provides a nice mechanism for notifying clients when there are changes in the backend data.-->
在[第八部分](/zh/part8)，我们的主题是GraphQL，它提供了一种很好的机制，当后端数据发生变化时，可以通知客户端。

### Virtual DOM

<!-- The concept of the Virtual DOM often comes up when discussing React. What is it all about? As mentioned in [part 0](/en/part0/fundamentals_of_web_apps#document-object-model-or-dom), browsers provide a [DOM API](https://developer.mozilla.org/fi/docs/DOM) through which the JavaScript running in the browser can modify the elements defining the appearance of the page.-->
提到React时，虚拟DOM的概念经常出现。它是什么？正如[第0章节](/en/part0/fundamentals_of_web_apps#document-object-model-or-dom)中所提到的，浏览器通过[DOM API](https://developer.mozilla.org/fi/docs/DOM)提供了一种方式，让在浏览器中运行的JavaScript可以修改定义页面外观的元素。

<!-- When a software developer uses React, they rarely or never directly manipulate the DOM. The function defining the React component returns a set of [React elements](https://reactjs.org/docs/glossary.html#elements). Although some of the elements look like normal HTML elements-->
, they are not.

当一个软件开发者使用 React 时，他们很少或从不直接操作 DOM。定义 React 组件的函数返回一组[React 元素](https://reactjs.org/docs/glossary.html#elements)。尽管其中一些元素看起来像普通的 HTML 元素，但它们并不是。

```js
const element = <h1>Hello, world</h1>
```

<!-- they are also just JavaScript-based React elements at their core.-->
他们在核心也只是基于JavaScript的React元素。

<!-- The React elements defining the appearance of the components of the application make up the [Virtual DOM](https://reactjs.org/docs/faq-internals.html#what-is-the-virtual-dom), which is stored in system memory during runtime.-->
React 组件外观的元素构成了[虚拟DOM](https://reactjs.org/docs/faq-internals.html#what-is-the-virtual-dom)，运行时它会存储在系统内存中。

<!-- With the help of the [ReactDOM](https://reactjs.org/docs/react-dom.html) library, the virtual DOM defined by the components is rendered to a real DOM that can be shown by the browser using the DOM API:-->
通过[ReactDOM](https://reactjs.org/docs/react-dom.html)库的帮助，由组件定义的虚拟DOM被渲染为可以通过DOM API显示在浏览器中的真实DOM:

```js
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

<!-- When the state of the application changes, a <i>new virtual DOM</i> gets defined by the components. React has the previous version of the virtual DOM in memory and instead of directly rendering the new virtual DOM using the DOM API, React computes the optimal way to update the DOM (remove, add or modify elements in the DOM) such that the DOM reflects the new virtual DOM.-->
当应用程序的状态发生变化时，组件会定义一个<i>新的虚拟DOM</i>。React在内存中保存着前一个版本的虚拟DOM，而不是直接使用DOM API来渲染新的虚拟DOM，React计算出最优的方式来更新DOM（删除、添加或修改DOM中的元素），以便使DOM反映新的虚拟DOM。

### On the role of React in applications

<!-- In the material, we may not have put enough emphasis on the fact that React is primarily a library for managing the creation of views for an application. If we look at the traditional [Model View Controller](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) pattern, then the domain of React would be <i>View</i>. React has a more narrow area of application than e.g. [Angular](https://angular.io/), which is an all-encompassing Frontend MVC framework. Therefore, React is not called a <i>framework</i>, but a <i>library</i>.-->
在本材料中，我们可能没有足够强调React首先是一个用于管理应用程序视图创建的库的事实。如果我们看一下传统的[模型视图控制器](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)模式，那么React的领域将是<i>视图</i>。React的应用范围比例如[Angular](https://angular.io/)的全面前端MVC框架要窄得多。因此，React不被称为<i>框架</i>，而是<i>库</i>。

<!-- In small applications, data handled by the application is stored in the state of the React components, so in this scenario, the state of the components can be thought of as <i>models</i> of an MVC architecture.-->
在小型应用中，应用程序处理的数据存储在React组件的状态中，因此在这种情况下，组件的状态可以被认为是MVC架构的<i>模型</i>。

<!-- However, MVC architecture is not usually mentioned when talking about React applications. Furthermore, if we are using Redux, then the applications follow the [Flux](https://facebook.github.io/flux/docs/in-depth-overview) architecture and the role of React is even more focused on creating the views. The business logic of the application is handled using the Redux state and action creators. If we''re using [Redux Thunk](/en/part6/communicating_with_server_in_a_redux_application#asynchronous-actions-and-redux-thunk) familiar from part 6, then the business logic can be almost completely separated from the React code.-->
然而，在谈论 React 应用时，通常不会提及 MVC 架构。此外，如果我们使用 Redux，则应用程序遵循[Flux](https://facebook.github.io/flux/docs/in-depth-overview)架构，而 React 的角色更加专注于创建视图。应用程序的业务逻辑由 Redux 状态和操作创建者处理。如果我们使用熟悉的[Redux Thunk](/en/part6/communicating_with_server_in_a_redux_application#asynchronous-actions-and-redux-thunk)，那么业务逻辑几乎可以完全与 React 代码分离。

<!-- Because both React and [Flux](https://facebook.github.io/flux/docs/in-depth-overview) were created at Facebook, one could say that using React only as a UI library is the intended use case. Following the Flux architecture adds some overhead to the application, and if we''re talking about a small application or prototype, it might be a good idea to use React "wrong", since [over-engineering](https://en.wikipedia.org/wiki/Overengineering) rarely yields an optimal result.-->
因为React和[Flux](https://facebook.github.io/flux/docs/in-depth-overview)都是Facebook创建的，所以可以说只把React当作UI库来使用是预期的用例。遵循Flux架构会给应用增加一些开销，如果我们谈论的是一个小的应用或者原型，那么使用“错误”的React可能是一个好主意，因为[过度设计](https://en.wikipedia.org/wiki/Overengineering)很少会产生最佳结果。

<!-- Part 6 [last chapter](/en/part6/react_query_use_reducer_and_the_context) covers the newer trends of state management in React. React''s hook functions <i>useReducer</i> and <i>useContext</i> provide a kind of lightweight version of Redux. <i>React Query</i>, on the other hand, is a library that solves many of the problems associated with handling state on the server, eliminating the need for a React application to store data retrieved from the server directly in frontend state.-->
Part 6 [最后一章](/en/part6/react_query_use_reducer_and_the_context) 涵盖了 React 中状态管理的新趋势。React 的钩子函数<i>useReducer</i> 和 <i>useContext</i> 提供了一种轻量级的 Redux 版本。<i>React Query</i> 另一方面，是一个解决处理服务器端状态相关问题的库，消除了 React 应用程序直接将从服务器检索到的数据存储在前端状态中的需求。

### React/node-application security

<!-- So far during the course, we have not touched on information security much. We do not have much time for this now either, but fortunately, University of Helsinki has a MOOC course [Securing Software](https://cybersecuritybase.mooc.fi/module-2.1) for this important topic.-->
到目前为止，我们在课程中还没有讨论太多信息安全问题。我们现在也没有太多时间，但幸运的是，赫尔辛基大学有一个[Securing Software](https://cybersecuritybase.mooc.fi/module-2.1) MOOC课程，来讨论这个重要的话题。

<!-- We will, however, take a look at some things specific to this course.-->
然而，我们将会看一些与此课程特定的东西。

<!-- The Open Web Application Security Project, otherwise known as [OWASP](https://www.owasp.org), publishes an annual list of the most common security risks in Web applications. The most recent list can be found [here](https://owasp.org/www-project-top-ten/). The same risks can be found from one year to another.-->
[OWASP](https://www.owasp.org)，即开放式网络应用程序安全项目，发布了一份年度报告，列出了网络应用程序中最常见的安全风险。最新的报告可以在[这里](https://owasp.org/www-project-top-ten/)找到，每年的风险清单都是一样的。

<!-- At the top of the list, we find <i>injection</i>, which means that e.g. text sent using a form in an application is interpreted completely differently than the software developer had intended. The most famous type of injection is probably [SQL injection](https://stackoverflow.com/questions/332365/how-does-the-sql-injection-from-the-bobby-tables-xkcd-comic-work).-->
首排名列，我们发现<i>注入</i>，这意味着例如使用应用程序中的表单发送的文本，与软件开发人员原本打算的完全不同。最著名的注入类型可能是[SQL注入](https://stackoverflow.com/questions/332365/how-does-the-sql-injection-from-the-bobby-tables-xkcd-comic-work)。

<!-- For example, imagine that the following SQL query is executed in a vulnerable application:-->
例如，假设以下SQL查询在一个易受攻击的应用程序中执行：

```js
let query = "SELECT * FROM Users WHERE name = '" + userName + "';"
```

<!-- Now let''s assume that a malicious user <i>Arto Hellas</i> would define their name as-->
`<script>alert("Hacked!")</script>`.

现在假设一个恶意使用者<i>Arto Hellas</i>将他们的名字定义为`<script>alert("Hacked!")</script>`。

<pre>
Arto Hell-as''; DROP TABLE Users; --
</pre>

<!-- so that the name would contain a single quote <code>''</code>, which is the beginning and end character of a SQL string. As a result of this, two SQL operations would be executed, the second of which would  destroy the database table <i>Users</i>:-->
这样，名字就包含了单引号<code>''</code>，这是SQL字符串的开始和结束字符。结果，会执行两个SQL操作，其中第二个会摧毁数据库表<i>Users</i>。

```sql
SELECT * FROM Users WHERE name = 'Arto Hell-as'; DROP TABLE Users; --''
```

<!-- SQL injections are prevented using [parameterized queries](https://security.stackexchange.com/questions/230211/why-are-stored-procedures-and-prepared-statements-the-preferred-modern-methods-f). With them, user input isn''t mixed with the SQL query, but the database itself inserts the input values at placeholders in the query (usually <code>?</code>).-->
使用[参数化查询](https://security.stackexchange.com/questions/230211/why-are-stored-procedures-and-prepared-statements-the-preferred-modern-methods-f)可以防止SQL注入。使用这种方法，用户输入不会与SQL查询混合，而是数据库本身将输入值插入查询中的占位符（通常是<code>?</code>）。

```js
execute("SELECT * FROM Users WHERE name = ?", [userName])
```

<!-- Injection attacks are also possible in NoSQL databases. However, mongoose prevents them by [sanitizing](https://zanon.io/posts/nosql-injection-in-mongodb) the queries. More on the topic can be found e.g. [here](https://web.archive.org/web/20220901024441/https://blog.websecurify.com/2014/08/hacking-nodejs-and-mongodb.html).-->
NoSQL 数据库也有可能受到注入攻击。但是，mongoose 通过[清理](https://zanon.io/posts/nosql-injection-in-mongodb)查询来防止这种攻击。关于这个主题更多的信息可以在[这里](https://web.archive.org/web/20220901024441/https://blog.websecurify.com/2014/08/hacking-nodejs-and-mongodb.html)找到。

<i>Cross-site scripting (XSS)</i> is an attack where it is possible to inject malicious JavaScript code into a legitimate web application. The malicious code would then be executed in the browser of the victim. If we try to inject the following into e.g. the notes application:

```html
<script>
  alert('Evil XSS attack')
</script>
```

<!-- the code is not executed, but is only rendered as 'text' on the page:-->
这段代码不会被执行，只会在页面上以'文字'的形式呈现。

![browser showing notes with XSS attempt](../../images/7/32e.png)

<!-- since React [takes care of sanitizing data in variables](https://reactjs.org/docs/introducing-jsx.html#jsx-prevents-injection-attacks). Some versions of React [have been vulnerable](https://medium.com/dailyjs/exploiting-script-injection-flaws-in-reactjs-883fb1fe36c1) to XSS attacks. The security holes have of course been patched, but there is no guarantee that there couldn''t be any more.-->
由于 React [会负责对变数中的资料进行消毒](https://reactjs.org/docs/introducing-jsx.html#jsx-prevents-injection-attacks)，某些版本的 React [可能会受到 XSS 攻击](https://medium.com/dailyjs/exploiting-script-injection-flaws-in-reactjs-883fb1fe36c1)。当然，安全漏洞已经被修补，但不能保证不会有更多漏洞。

<!-- One needs to remain vigilant when using libraries; if there are security updates to those libraries, it is advisable to update those libraries in one's applications. Security updates for Express are found in the [library's documentation](https://expressjs.com/en/advanced/security-updates.html) and the ones for Node are found in [this blog](https://nodejs.org/en/blog/).-->
一旦使用库时，需要保持警惕；如果这些库有安全更新，建议在应用程序中更新这些库。Express 的安全更新可以在[库文档](https://expressjs.com/en/advanced/security-updates.html)中找到，而 Node 的安全更新可以在[这个博客](https://nodejs.org/en/blog/)中找到。

<!-- You can check how up-to-date your dependencies are using the command-->
你可以使用命令检查你的依赖是否是最新的

```bash
npm outdated --depth 0
```

<!-- The one-year-old project that is used in [part 9](/en/part9) of this course already has quite a few outdated dependencies:-->
这个一岁的项目，用于本课程[第9章节](/en/part9)，已经有相当多过时的依赖项：

![npm outdated output of patientor](../../images/7/33x.png)

<!-- The dependencies can be brought up to date by updating the file <i>package.json</i>. The best way to do that is by using a tool called _npm-check-updates_. It can be installed globally by running the command-->
`npm install -g npm-check-updates`.

可以通过更新文件<i>package.json</i>来更新依赖项。最好的方法是使用一个叫做_npm-check-updates_的工具。可以通过运行命令`npm install -g npm-check-updates`来全局安装它。

```bash
npm install -g npm-check-updates
```

<!-- Using this tool, the up-to-dateness of dependencies is checked in the following way:-->
使用这个工具，以下方式检查依赖项的最新状态：

```bash
$ npm-check-updates
Checking ...\ultimate-hooks\package.json
[====================] 9/9 100%

 @testing-library/react       ^13.0.0  →  ^13.1.1
 @testing-library/user-event  ^14.0.4  →  ^14.1.1
 react-scripts                  5.0.0  →    5.0.1

Run ncu -u to upgrade package.json
```

<!-- The file <i>package.json</i> is brought up to date by running the command _ncu -u_.-->
文件<i>package.json</i>可以通过运行命令_ncu -u_来更新。

```bash
$ ncu -u
Upgrading ...\ultimate-hooks\package.json
[====================] 9/9 100%

 @testing-library/react       ^13.0.0  →  ^13.1.1
 @testing-library/user-event  ^14.0.4  →  ^14.1.1
 react-scripts                  5.0.0  →    5.0.1

Run npm install to install new versions.
```

<!-- Then it is time to update the dependencies by running the command _npm install_. However, old versions of the dependencies are not necessarily a security risk.-->
然后是时候通过运行命令_npm install_更新依赖项了。但是，依赖项的旧版本不一定是安全风险。

<!-- The npm [audit](https://docs.npmjs.com/cli/audit) command can be used to check the security of dependencies. It compares the version numbers of the dependencies in your application to a list of the version numbers of dependencies containing known security threats in a centralized error database.-->
npm [审计](https://docs.npmjs.com/cli/audit) 命令可用于检查依赖关系的安全性。它将应用程序中的依赖关系的版本号与包含已知安全威胁的依赖关系的版本号列表进行比较，这些版本号列表存储在集中的错误数据库中。

<!-- Running _npm audit_ on the same project prints a long list of complaints and suggested fixes.-->
运行`npm audit`在同一个项目上会打印出一长串的抱怨和建议的修复。
<!-- Below is a part of the report:-->
**报告一部分：**

据研究，今年秋季，欧洲汽车销售量将大幅下降。根据行业统计数据，今年第三季度，欧洲汽车销售量比去年同期下降了7.5％。此外，今年前三季度，欧洲汽车销售量比去年同期下降了4.3％。

**根据研究，今年秋季，欧洲汽车销售量将大幅下降。根据行业统计数据，今年第三季度，欧洲汽车销售量比去年同期下降了7.5％，前三季度则下降了4.3％。**

```js
$ patientor npm audit

... many lines removed ...

url-parse  <1.5.2
Severity: moderate
Open redirect in url-parse - https://github.com/advisories/GHSA-hh27-ffr2-f2jc
fix available via `npm audit fix`
node_modules/url-parse

ws  6.0.0 - 6.2.1 || 7.0.0 - 7.4.5
Severity: moderate
ReDoS in Sec-Websocket-Protocol header - https://github.com/advisories/GHSA-6fc8-4gx4-v693
ReDoS in Sec-Websocket-Protocol header - https://github.com/advisories/GHSA-6fc8-4gx4-v693
fix available via `npm audit fix`
node_modules/webpack-dev-server/node_modules/ws
node_modules/ws

120 vulnerabilities (102 moderate, 16 high, 2 critical)

To address issues that do not require attention, run:
  npm audit fix

To address all issues (including breaking changes), run:
  npm audit fix --force
```

<!-- After only one year, the code is full of small security threats. Luckily, there are only 2 critical threats.  Let''s run _npm audit fix_ as the report suggests:-->
一年之后，代码充满了小安全威胁。幸运的是，只有2个关键威胁。让我们按照报告建议运行 _npm audit fix_：

```js
$ npm audit fix

+ mongoose@5.9.1
added 19 packages from 8 contributors, removed 8 packages and updated 15 packages in 7.325s
fixed 354 of 416 vulnerabilities in 20047 scanned packages
  1 package update for 62 vulns involved breaking changes
  (use `npm audit fix --force` to install breaking changes; or refer to `npm audit` for steps to fix these manually)
```

<!-- 62 threats remain because, by default, _audit fix_ does not update dependencies if their <i>major</i> version number has increased.  Updating these dependencies could lead to the whole application breaking down.-->
仍有62个威胁，因为默认情况下，_审计修复_不会更新依赖项，如果它们的<i>主要</i>版本号已经增加。更新这些依赖项可能导致整个应用程序崩溃。

<!-- The source for the critical bug is the library [immer](https://github.com/immerjs/immer)-->
源自关键错误的库[immer](https://github.com/immerjs/immer)

```js
immer  <9.0.6
Severity: critical
Prototype Pollution in immer - https://github.com/advisories/GHSA-33f9-j839-rf8h
fix available via `npm audit fix --force`
Will install react-scripts@5.0.0, which is a breaking change
```

<!-- Running _npm audit fix --force_ would upgrade the library version but would also upgrade the library _react-scripts_ and that would potentially break down the development environment. So we will leave the library upgrades for later...-->
运行`npm audit fix --force`会升级库版本，但也会升级库`react-scripts`，可能会破坏开发环境。所以我们暂时留着库升级...

<!-- One of the threats mentioned in the list from OWASP is <i>Broken Authentication</i> and the related <i>Broken Access Control</i>. The token-based authentication we have been using is fairly robust if the application is being used on the traffic-encrypting HTTPS protocol. When implementing access control, one should e.g. remember to not only check a user''s identity in the browser but also on the server. Bad security would be to prevent some actions to be taken only by hiding the execution options in the code of the browser.-->
<i>破碎的认证</i>和相关的<i>破碎的访问控制</i>是OWASP列出的威胁之一。如果应用程序在加密的HTTPS协议上使用，我们使用的基于令牌的认证相当强大。实施访问控制时，应该记住，不仅要在浏览器中检查用户的身份，还要在服务器上检查。坏的安全性将仅通过在浏览器的代码中隐藏执行选项来阻止某些操作。

<!-- On Mozilla''s MDN, there is a very good [Website security guide](https://developer.mozilla.org/en-US/docs/Learn/Server-side/First_steps/Website_security), which brings up this very important topic:-->
在Mozilla的MDN上，有一个非常好的[网站安全指南](https://developer.mozilla.org/en-US/docs/Learn/Server-side/First_steps/Website_security)，提出了这个非常重要的话题：

![screenshot of website security from MDN](../../images/7/34.png)

<!-- The documentation for Express includes a section on security: [Production Best Practices: Security](https://expressjs.com/en/advanced/best-practice-security.html), which is worth a read. It is also recommended to add a library called [Helmet](https://helmetjs.github.io/) to the backend. It includes a set of middleware that eliminates some security vulnerabilities in Express applications.-->
文档中有一个关于Express安全的部分：[生产最佳实践：安全](https://expressjs.com/en/advanced/best-practice-security.html)，值得一读。同时也推荐添加一个叫做[Helmet](https://helmetjs.github.io/)的库到后端。它包含一组中间件，可以消除Express应用中的一些安全漏洞。

<!-- Using the ESlint [security-plugin](https://github.com/nodesecurity/eslint-plugin-security) is also worth doing.-->
使用ESLint [security-plugin](https://github.com/nodesecurity/eslint-plugin-security)也是值得的。

### Current trends

<!-- Finally, let''s take a look at some technology of tomorrow (or, actually, already today), and the directions in which Web development is heading.-->
最后，让我们来看看明天（或者实际上是现在）的一些技术，以及Web开发正在走向的方向。

#### Typed versions of JavaScript

<!-- Sometimes, the [dynamic typing](https://developer.mozilla.org/en-US/docs/Glossary/Dynamic_typing) of JavaScript variables creates annoying bugs. In part 5, we talked briefly about [PropTypes](/en/part5/props_children_and_proptypes#prop-types): a mechanism which enables one to enforce type-checking for props passed to React components.-->
有时，JavaScript变量的[动态类型](https://developer.mozilla.org/en-US/docs/Glossary/Dynamic_typing)会带来令人恼火的bug。在第5部分，我们简要讨论了[PropTypes](/en/part5/props_children_and_proptypes#prop-types)：一种机制，可以强制对传递给React组件的props进行类型检查。

<!-- Lately, there has been a notable uplift in the interest in [static type checking](https://en.wikipedia.org/wiki/Type_system#Static_type_checking). At the moment, the most popular typed version of Javascript is [Typescript](https://www.typescriptlang.org/) which has been developed by Microsoft. Typescript is covered in [part 9](/en/part9).-->
最近，[静态类型检查](https://en.wikipedia.org/wiki/Type_system#Static_type_checking)的兴趣显著上升。目前，最流行的Javascript类型版本是由Microsoft开发的[Typescript](https://www.typescriptlang.org/)，它在[第9章节](/en/part9)中有所涉及。

#### Server-side rendering, isomorphic applications and universal code

<!-- The browser is not the only domain where components defined using React can be rendered. The rendering can also be done on the [server](https://reactjs.org/docs/react-dom-server.html). This kind of approach is increasingly being used, such that, when accessing the application for the first time, the server serves a pre-rendered page made with React. From here onwards, the operation of the application continues, as usual, meaning the browser executes React, which manipulates the DOM shown by the browser. The rendering that is done on the server goes by the name: <i>server-side rendering</i>.-->
浏览器并不是使用React定义的组件可以渲染的唯一域。渲染还可以在[服务器](https://reactjs.org/docs/react-dom-server.html)上完成。这种方法越来越多地被使用，以至于，当第一次访问应用程序时，服务器会提供使用React制作的预渲染页面。从此，应用程序的操作照常进行，这意味着浏览器执行React，它操纵浏览器显示的DOM。在服务器上执行的渲染被称为：<i>服务器端渲染</i>。

<!-- One motivation for server-side rendering is Search Engine Optimization (SEO). Search engines have traditionally been very bad at recognizing JavaScript-rendered content. However, the tide might be turning, e.g. take a look at [this](https://www.javascriptstuff.com/react-seo/) and [this](https://medium.freecodecamp.org/seo-vs-react-is-it-neccessary-to-render-react-pages-in-the-backend-74ce5015c0c9).-->
服务器端渲染的一个动机是搜索引擎优化（SEO）。传统上，搜索引擎很难识别 JavaScript 渲染的内容。然而，情况可能正在发生变化，例如，看看[这个](https://www.javascriptstuff.com/react-seo/)和[这个](https://medium.freecodecamp.org/seo-vs-react-is-it-neccessary-to-render-react-pages-in-the-backend-74ce5015c0c9)。

<!-- Of course, server-side rendering is not anything specific to React or even JavaScript. Using the same programming language throughout the stack in theory simplifies the execution of the concept because the same code can be run on both the front- and backend.-->
当然，服务器端渲染并不是特定于React或者JavaScript的东西。在理论上，使用相同的编程语言整个堆栈可以简化概念的执行，因为相同的代码可以在前端和后端运行。

<!-- Along with server-side rendering, there has been talk of so-called <i>isomorphic applications</i> and <i>universal code</i>, although there has been some debate about their definitions. According to some [definitions](https://medium.com/@ghengeveld/isomorphism-vs-universal-javascript-4b47fb481beb), an isomorphic web application performs rendering on both frontend and backend. On the other hand, universal code is code that can be executed in most environments, meaning both frontend and backend.-->
随着服务器端渲染的出现，也有所谓的<i>同构应用</i>和<i>通用代码</i>的讨论，尽管关于它们的定义存在一些争议。根据一些[定义](https://medium.com/@ghengeveld/isomorphism-vs-universal-javascript-4b47fb481beb)，同构网络应用既在前端又在后端进行渲染。另一方面，通用代码是可以在大多数环境中执行的代码，意味着前端和后端都可以。

<!-- React and Node provide a desirable option for implementing an isomorphic application as universal code.-->
React 和 Node 提供一个理想的选择来实现一个普遍的代码的同构应用。

<!-- Writing universal code directly using React is currently still pretty cumbersome. Lately, a library called [Next.js](https://github.com/vercel/next.js), which is implemented on top of React, has garnered much attention and is a good option for making universal applications.-->
写直接使用React的通用代码目前仍然相当繁琐。最近，一个叫做[Next.js](https://github.com/vercel/next.js)的库在React之上实现，引起了很多关注，是制作通用应用程序的一个很好的选择。

#### Progressive web apps

<!-- Lately, people have started using the term [progressive web app](https://developers.google.com/web/progressive-web-apps/) (PWA) launched by Google.-->
最近，人们开始使用由谷歌推出的[渐进式网络应用](https://developers.google.com/web/progressive-web-apps/)（PWA）。

<!-- In short, we are talking about web applications working as well as possible on every platform and taking advantage of the best parts of those platforms. The smaller screen of mobile devices must not hamper the usability of the application. PWAs should also work flawlessly in offline mode or with a slow internet connection. On mobile devices, they must be installable just like any other application. All the network traffic in a PWA should be encrypted.-->
简而言之，我们正在讨论在每个平台上尽可能最佳地运行的Web应用程序，并利用这些平台的最佳部分。移动设备的屏幕尺寸不应该妨碍应用程序的可用性。PWA也应该在离线模式或网络连接缓慢的情况下无缝工作。在移动设备上，它们必须像其他应用程序一样可以安装。PWA中的所有网络流量都应该加密。

<!-- Applications created using Create React App are no longer [progressive](https://create-react-app.dev/docs/making-a-progressive-web-app/) by default since Create React App 4. If PWA is desired, you will have to create a new project using a PWA custom template.-->
应用程序使用Create React App创建不再默认为[渐进式](https://create-react-app.dev/docs/making-a-progressive-web-app/)自从Create React App 4。如果需要PWA，您将必须使用PWA自定义模板创建一个新项目。

```js
npx create-react-app my-app --template cra-template-pwa
```

<!-- The offline functionality is usually implemented with the help of [service workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API).-->
离线功能通常是通过[服务工作者](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)来实现的。

#### Microservice architecture

<!-- During this course, we have only scratched the surface of the server end of things. In our applications, we had a <i>monolithic</i> backend, meaning one application making up a whole and running on a single server, serving only a few API endpoints.-->
在本课程中，我们只接触到了服务器端的一面。在我们的应用程序中，我们有一个<i>单体后端</i>，意味著一个应用程序组成了整个系统，并运行在单个服务器上，只提供少量的API端点。

<!-- As the application grows, the monolithic backend approach starts turning problematic both in terms of performance and maintainability.-->
随着应用程序的增长，单体后端方法在性能和可维护性方面开始出现问题。

<!-- A [microservice architecture](https://martinfowler.com/articles/microservices.html) (microservices) is a way of composing the backend of an application from many separate, independent services, which communicate with each other over the network. An individual microservice''s purpose is to take care of a particular logical functional whole. In a pure microservice architecture, the services do not use a shared database.-->
[微服务架构](https://martinfowler.com/articles/microservices.html)（微服务）是一种从许多独立的、相互之间通过网络通信的服务构建应用后端的方式。单个微服务的目的是负责特定的逻辑功能整体。在纯微服务架构中，服务不使用共享数据库。

<!-- For example, the bloglist application could consist of two services: one handling the user and another taking care of the blogs. The responsibility of the user service would be user registration and user authentication, while the blog service would take care of operations related to the blogs.-->
例如，博客列表应用程序可以由两个服务组成：一个处理用户，另一个负责处理博客。用户服务的责任是用户注册和用户认证，而博客服务则负责与博客相关的操作。

<!-- The image below visualizes the difference between the structure of an application based on a microservice architecture and one based on a more traditional monolithic structure:-->
下图可视化展示基于微服务架构的应用程序与基于更传统的单体架构的应用程序之间的差异：

![microservices vs traditional approach diagram](../../images/7/36.png)

<!-- The role of the frontend (enclosed by a square in the picture) does not differ much between the two models. There is often a so-called [API gateway](http://microservices.io/patterns/apigateway) between the microservices and the frontend, which provides an illusion of a more traditional "everything on the same server" API. [Netflix](https://medium.com/netflix-techblog/optimizing-the-netflix-api-5c9ac715cf19), among others, uses this type of approach.-->
图片中用方框括起来的前端的角色在这两种模型之间并没有太大的区别。往往在微服务和前端之间会有一个所谓的[API网关](http://microservices.io/patterns/apigateway)，它提供了一种更具传统意义上“所有服务都在同一台服务器上”的API的错觉。[Netflix](https://medium.com/netflix-techblog/optimizing-the-netflix-api-5c9ac715cf19)等公司就采用了这种方式。

<!-- Microservice architectures emerged and evolved for the needs of large internet-scale applications. The trend was set by Amazon far before the appearance of the term microservice. The critical starting point was an email sent to all employees in 2002 by Amazon CEO Jeff Bezos:-->
2002 年，亚马逊CEO杰夫·贝索斯发送了一封邮件给所有员工，这一趋势就此开启，而这比微服务这一术语出现的时间更早，微服务架构是为大型互联网规模应用程序的需求而出现和演变的。

<!-- > All teams will henceforth expose their data and functionality through service interfaces.-->
> 所有团队今后将通过服务接口公开他们的数据和功能。
<!-- >-->
>The cat is sleeping

>猫正在睡觉
<!-- > Teams must communicate with each other through these interfaces.-->
> 团队必须通过这些接口彼此沟通。
<!-- >-->
The world is a book, and those who do not travel read only one page

> 世界就像一本书，那些不旅行的人只读了其中的一页。
<!-- > There will be no other form of inter-process communication allowed: no direct linking, no direct reads of another team’s data store, no shared-memory model, no back-doors whatsoever. The only communication allowed is via service interface calls over the network.-->
> 不允许其他形式的进程间通信：不允许直接链接，不允许直接读取另一个团队的数据存储，不允许共享内存模型，不允许任何后门。唯一允许的通信方式是通过网络上的服务接口调用。
<!-- >-->
I like to eat ice cream

我喜欢吃冰淇淋。
<!-- > It doesn’t matter what technology you use.-->
> 不管你使用什么技术都没关系。
<!-- >-->
Hello, my name is John

>你好，我的名字叫约翰
<!-- > All service interfaces, without exception, must be designed from the ground up to be externalize-able. That is to say, the team must plan and design to be able to expose the interface to developers in the outside world.-->
> 所有的服务接口，无一例外，必须从零开始设计，以便可以外部化。也就是说，团队必须计划和设计，以便能够向外界的开发人员公开接口。
<!-- >-->
# 生活

生活是一种美妙的体验，它可以让我们感受到每一个瞬间的欢乐。它教会我们如何去面对挑战，如何去面对失败，如何去抓住机会。它也让我们学会了珍惜当下，把握机遇，做出正确的选择。

# 生活

生活是一种美妙的体验，它可以让我们感受到每一个瞬间的欢乐。它教会我们如何去面对挑战，如何去面对失败，如何去抓住机会。它也让我们学会了珍惜当下，把握机遇，做出正确的选择。

# 生活

生活是一种美妙的体验，它可以让我们感受到每一个瞬间的欢乐。它教会我们如何去面对挑战，如何去面对失败，如何去抓住机会。它也让我们学会了珍惜当下，把握机遇，做出正确的选择。

# 生活

生活是一种美妙的体验，它可以让我们感受到每一个瞬间的欢乐。它教会我们如何去面对挑战，如何去面对失败，如何去抓住机会。它也让我们学会了珍惜当下，把握机遇，做出正确的选择。

# 生活

生活是一种美妙的体验，它可以让我们感受到每一个瞬间的欢乐。它教会我们如何去面对挑战，如何去面对失败，如何去抓住机会。它也让我们学会了珍惜当下，把握机遇，做出正确的选择。

# 生活

生活是一种美妙的体验，它可以让我们感受到每一个瞬间的欢乐。它教会我们如何去面对挑战，如何去面对失败，如何去抓住机会。它也让我们学会了珍惜当下，把握机遇，做出正确的选择。

# 生活

生活是一种美妙的体验，它可以让我们感受到每一个瞬间的欢乐。它教会我们如何去面对挑战，如何去面对失败，如何去抓住机会。它也让我们学会了珍惜当下，把握机遇，做出正确的选择。

# 生活

生活是一种美妙的体验，它可以让我们感受到每一个瞬间的欢乐。它教会我们如何去面对挑战，如何去面对失败，如何去抓住机会。它也让我们学会了珍惜当下，把握机遇，做出正确的选择。

# 生活

生活是一种美妙的体验，它可以让我们感受到每一个瞬间的欢乐。它教会我们如何去面对挑战，如何去面对失败，如何去抓住机会。它也让我们学会了珍惜当下，把握机遇，做出正确的选择。

# 生活

生活是一种美妙的体验，它可以让我们感受到每一个瞬间的欢乐。它教会我们如何去面对挑战，如何去面对失败，如何去抓住机会。它也让我们学会了珍惜当下，把握机遇，做出正确的选择。

# 生活

生活是一种美妙的体验，它可以让我们感受到每一个瞬间的欢乐。它教会我们如何去面对挑战，如何去面对失败，如何去抓住机会。它也让我们学会了珍惜当下，把握机遇，做出正确的选择。

# 生活

生活是一种美妙的体验，它可以让我们感受到每一个瞬间的欢乐。它教会我们如何去面对挑战，如何去面对失败，如何去抓住机会。它也让我们学会了珍惜当下，把握机遇，做出正确的选择。

# 生活

生活是一种美妙的体验，它可以让我们感受到每一个瞬间的欢乐。它教会我们如何去面对挑战，如何去面对失败，如何去抓住机会。它也让我们学会了珍惜当下，把握机遇，做出正确的选择。

# 生活

生活是一种美妙的体验，它可以让我们感受到每一个瞬间的欢乐。它教会我们如何去面对挑战，如何去面对失败，如何去抓住机会。它也让我们学会了珍惜当下，把握机遇，做出正确的选择。

# 生活

生活是一种美妙的体验，它可以让我们感受到每一个瞬间的欢乐。它教会我们如何去面对挑战，如何去面对失败，如何去抓住机会。它也让我们学会了珍惜当下，把握机遇，做出正确的选择。

# 生活

生活是一种美妙的体验，它可以让我们感受到每一个瞬间的欢乐。它教会我们如何去面
<!-- > No exceptions.-->
没有例外。
<!-- >-->
I am a student

我是一名学生。
<!-- > Anyone who doesn’t do this will be fired. Thank you; have a nice day!-->
> 任何不这样做的人都会被解雇。谢谢你；祝你今天愉快！

<!-- Nowadays, one of the biggest forerunners in the use of microservices is [Netflix](https://www.infoq.com/presentations/netflix-chaos-microservices).-->
现今，在微服务使用方面最具先驱性的公司之一是[Netflix](https://www.infoq.com/presentations/netflix-chaos-microservices)。

<!-- The use of microservices has steadily been gaining hype to be kind of a [silver bullet](https://en.wikipedia.org/wiki/No_Silver_Bullet) of today, which is being offered as a solution to almost every kind of problem. However, there are several challenges when it comes to applying a microservice architecture, and it might make sense to go [monolith first](https://martinfowler.com/bliki/MonolithFirst.html) by initially making a traditional all-encompassing backend. Or maybe [not](https://martinfowler.com/articles/dont-start-monolith.html). There are a bunch of different opinions on the subject. Both links lead to Martin Fowler''s site; as we can see, even the wise are not entirely sure which one of the right ways is more right.-->
使用微服务逐渐受到热捧，被视为当今的[银弹](https://en.wikipedia.org/wiki/No_Silver_Bullet)，被提供作为几乎所有问题的解决方案。然而，在应用微服务架构时存在一些挑战，最初通过制作传统的全面后端可能是一个明智的选择[先采用单体架构](https://martinfowler.com/bliki/MonolithFirst.html)。或者[不是](https://martinfowler.com/articles/dont-start-monolith.html)。关于这个问题有很多不同的观点。这两个链接都引到了 Martin Fowler 的网站；正如我们所看到的，即使是智者也不能完全确定哪一种正确的方法更正确。

<!-- Unfortunately, we cannot dive deeper into this important topic during this course. Even a cursory look at the topic would require at least 5 more weeks.-->
很遗憾，我们无法在这门课程中更深入地探讨这个重要话题。即使是对这个话题的浅显查看也需要至少5个星期。

#### Serverless

<!-- After the release of Amazon''s [lambda](https://aws.amazon.com/lambda/) service at the end of 2014, a new trend started to emerge in web application development: [serverless](https://serverless.com/).-->
2014年底，Amazon的[lambda](https://aws.amazon.com/lambda/)服务发布后，网络应用开发开始出现一种新的趋势：[无服务器](https://serverless.com/)。

<!-- The main thing about lambda, and nowadays also Google''s [Cloud functions](https://cloud.google.com/functions/) as well as [similar functionality in Azure](https://azure.microsoft.com/en-us/services/functions/), is that it enables <i>the execution of individual functions</i> in the cloud. Before, the smallest executable unit in the cloud was a single <i>process</i>, e.g. a runtime environment running a Node backend.-->
关于lambda，以及如今谷歌的[Cloud Functions](https://cloud.google.com/functions/)以及[Azure中的类似功能](https://azure.microsoft.com/en-us/services/functions/)，最重要的是它使得在云端<i>单个函数的执行</i>成为可能。在此之前，云端最小的可执行单元是单个<i>进程</i>，比如一个运行Node后端的运行时环境。

<!-- E.g. Using Amazon''s [API gateway](https://aws.amazon.com/api-gateway/) it is possible to make serverless applications where the requests to the defined HTTP API get responses directly from cloud functions. Usually, the functions already operate using stored data in the databases of the cloud service.-->
使用Amazon的[API网关](https://aws.amazon.com/api-gateway/)，可以创建无服务器应用程序，其中对定义的HTTP API的请求可以直接从云功能获得响应。 通常，功能已经使用云服务的数据库中的存储数据进行操作。

<!-- Serverless is not about there not being a server in applications, but about how the server is defined. Software developers can shift their programming efforts to a higher level of abstraction as there is no longer a need to programmatically define the routing of HTTP requests, database relations, etc., since the cloud infrastructure provides all of this. Cloud functions also lend themselves to creating a well-scaling system, e.g. Amazon''s Lambda can execute a massive amount of cloud functions per second. All of this happens automatically through the infrastructure and there is no need to initiate new servers, etc.-->
Serverless并不意味着应用程序中没有服务器，而是关于服务器如何定义的。由于不再需要编程定义HTTP请求、数据库关系等的路由，软件开发人员可以将编程工作转移到更高的抽象层次。云基础架构提供了所有这些。云功能也有助于创建一个可以良好扩展的系统，例如亚马逊的Lambda可以每秒执行大量的云功能。所有这一切都是自动通过基础架构完成的，不需要启动新的服务器等。

### Useful libraries and interesting links

<!-- The JavaScript developer community has produced a large variety of useful libraries. If you are developing anything more substantial, it is worth it to check if existing solutions are already available.-->
JavaScript 开发者社区已经生产了大量有用的库。如果你正在开发任何更复杂的东西，值得检查一下是否已经有现成的解决方案可用。
<!-- Below are listed some libraries recommended by trustworthy parties.-->
以下是可靠方面推荐的一些图书馆：

<!-- If your application has to handle complicated data, [lodash](https://www.npmjs.com/package/lodash), which we recommended in [part 4](/en/part4/structure_of_backend_application_introduction_to_testing#exercises-4-3-4-7), is a good library to use. If you prefer the functional programming style, you might consider using [ramda](https://ramdajs.com/).-->
如果你的应用程序处理复杂数据，我们在[第4章节](/en/part4/structure_of_backend_application_introduction_to_testing#exercises-4-3-4-7)中推荐的[lodash](https://www.npmjs.com/package/lodash)是一个很好的库。如果你喜欢函数式编程风格，你可以考虑使用[ramda](https://ramdajs.com/)。

<!-- If you are handling times and dates, [date-fns](https://github.com/date-fns/date-fns) offers good tools for that. If you have complex forms in your apps, have a look at whether [React Hook Form](https://react-hook-form.com/) would be a good fit. If your application displays graphs, there are multiple options to choose from. Both [recharts](http://recharts.org/en-US/) and [highcharts](https://github.com/highcharts/highcharts-react) are well-recommended.-->
如果您正在处理时间和日期，[date-fns](https://github.com/date-fns/date-fns)提供了很好的工具。如果您的应用程序中有复杂的表单，请查看[React Hook Form](https://react-hook-form.com/)是否适合。如果您的应用程序显示图表，可以选择多种选项。[recharts](http://recharts.org/en-US/)和[highcharts](https://github.com/highcharts/highcharts-react)均受到推荐。

<!-- The [Immer](https://github.com/mweststrate/immer) provides immutable implementations of some data structures. The library could be of use when using Redux, since as we [remember](/en/part6/flux_architecture_and_redux#pure-functions-immutable) in part 6, reducers must be pure functions, meaning they must not modify the store''s state but instead have to replace it with a new one when a change occurs.-->
[Immer](https://github.com/mweststrate/immer) 提供不可变的数据结构实现。当使用 Redux 时，该库可能会很有用，因为正如我们在第 6 部分中[记住](/en/part6/flux_architecture_and_redux#pure-functions-immutable)的，reducers 必须是纯函数，这意味着它们不能修改 store 的状态，而必须在发生更改时替换它们。

<!-- [Redux-saga](https://redux-saga.js.org/) provides an alternative way to make asynchronous actions for [Redux Thunk](/en/part6/communicating_with_server_in_a_redux_application#asynchronous-actions-and-redux-thunk) familiar from part 6. Some embrace the hype and like it. I don''t.-->
# Redux-saga
[Redux-saga](https://redux-saga.js.org/) 为[Redux Thunk](/en/part6/communicating_with_server_in_a_redux_application#asynchronous-actions-and-redux-thunk)提供了一种替代方式来实现异步操作，从第六部分开始就熟悉了。有些人热衷于它，而我则不是。

<!-- For single-page applications, the gathering of analytics data on the interaction between the users and the page is [more challenging](https://developers.google.com/analytics/devguides/collection/gtagjs/single-page-applications) than for traditional web applications where the entire page is loaded. The [React Google Analytics](https://github.com/react-ga/react-ga) library offers a solution.-->
对于单页面应用程序，收集用户与页面之间交互的分析数据比传统的Web应用程序（整个页面加载）更具挑战性[更具挑战性](https://developers.google.com/analytics/devguides/collection/gtagjs/single-page-applications)。[React Google Analytics](https://github.com/react-ga/react-ga)库提供了一种解决方案。

<!-- You can take advantage of your React know-how when developing mobile applications using Facebook''s extremely popular [React Native](https://facebook.github.io/react-native/) library, which is the topic of [part 10](/en/part10) of the course.-->
你可以利用你的React知识开发使用Facebook极受欢迎的[React Native](https://facebook.github.io/react-native/)库的移动应用程序，这是本课程的[第10章节](/en/part10)。

<!-- When it comes to the tools used for the management and bundling of JavaScript projects, the community has been very fickle. Best practices have changed rapidly (the years are approximations, nobody remembers that far back in the past):-->
当谈到用于管理和捆绑JavaScript项目的工具时，社区变化很快。最佳实践已经迅速变化（年份是近似值，没有人记得过去那么久）：

<!-- - 2011 [Bower](https://www.npmjs.com/package/bower)-->
发布

2011年[Bower](https://www.npmjs.com/package/bower)发布
<!-- - 2012 [Grunt](https://www.npmjs.com/package/grunt)-->
was released

2012年发布了[Grunt](https://www.npmjs.com/package/grunt)
<!-- - 2013-14 [Gulp](https://www.npmjs.com/package/gulp)-->
2013-14 [Gulp](https://www.npmjs.com/package/gulp) 

2013-14 [Gulp](https://www.npmjs.com/package/gulp)
<!-- - 2012-14 [Browserify](https://www.npmjs.com/package/browserify)-->
2012-14 [Browserify](https://www.npmjs.com/package/browserify)

2012-14 [Browserify](https://www.npmjs.com/package/browserify)
<!-- - 2015- [Webpack](https://www.npmjs.com/package/webpack)-->
是一个模块打包器。

2015年，[Webpack](https://www.npmjs.com/package/webpack) 是一个模块打包器。

<!-- Hipsters seem to have lost their interest in tool development after webpack started to dominate the markets. A few years ago, [Parcel](https://parceljs.org) started to make the rounds marketing itself as simple (which Webpack is not) and faster than Webpack. However, after a promising start, Parcel has not gathered any steam, and it''s beginning to look like it will not be the end of Webpack. Currently, [Vite](https://vitejs.dev) tools, also simpler than Webpack, are gaining popularity - but their success can only be measured in the future.-->
Hipsters似乎在Webpack开始占据市场之后，已经失去了对工具开发的兴趣。几年前，[Parcel](https://parceljs.org)开始推销自己，宣称比Webpack更简单（Webpack并不简单）和更快。然而，在一个许诺的开始之后，Parcel没有获得任何动力，而且看起来它不会成为Webpack的终结。目前，[Vite](https://vitejs.dev)工具，也比Webpack更简单，正在获得流行，但它们的成功只能在未来才能衡量。

<!-- Another notable mention is the [Rome](https://rome.tools/) library, which aspires to be an all-encompassing toolchain to unify linter, compiler, bundler, and more. It is currently under heavy development since the initial commit earlier this year on Feb 27, but the outlook sure seems promising.-->
另一个值得一提的是[罗马](https://rome.tools/)库，它渴望成为一个全面的工具链，以统一静态检查工具、编译器、打包工具等。自今年2月27日初次提交以来，它一直处于紧张的开发之中，但前景似乎很有希望。

<!-- The site <https://reactpatterns.com/> provides a concise list of best practices for React, some of which are already familiar from this course. Another similar list is [react bits](https://vasanthk.gitbooks.io/react-bits/).-->
网站<https://reactpatterns.com/>提供了一份有关React最佳实践的简洁清单，其中一些已经从本课程中熟悉。另一个类似的列表是[react bits](https://vasanthk.gitbooks.io/react-bits/)。

<!-- [Reactiflux](https://www.reactiflux.com/) is a big chat community of React developers on Discord. It could be one possible place to get support after the course has concluded. For example, numerous libraries have their own channels.-->
[Reactiflux](https://www.reactiflux.com/) 是一个Discord上的React开发者大型聊天社区。课程结束后，它可以成为获得支持的可能地点之一。例如，许多库都有自己的频道。

<!-- If you know some recommendable links or libraries, make a pull request!-->
如果你知道一些推荐的链接或库，请提出拉取请求！

</div>
