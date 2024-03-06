---
mainImage: ../../../images/part-7.svg
part: 7
letter: e
lang: zh
---

<div class="content">

### Class Components

<!-- During the course, we have only used React components having been defined as Javascript functions. This was not possible without the [hook](https://reactjs.org/docs/hooks-intro.html) functionality that came with version 16.8 of React. Before, when defining a component that uses state, one had to define it using Javascript's [Class](https://reactjs.org/docs/state-and-lifecycle.html#converting-a-function-to-a-class) syntax.-->
 在这个课程中，我们只使用了被定义为Javascript函数的React组件。如果没有React 16.8版本中的[hook](https://reactjs.org/docs/hooks-intro.html)功能，这是不可能的。以前，当定义一个使用状态的组件时，我们必须使用Javascript的[Class](https://reactjs.org/docs/state-and-lifecycle.html#converting-a-function-to-a-class)语法来定义它。

<!-- It is beneficial to at least be familiar with Class Components to some extent, since the world contains a lot of old React code, which will probably never be completely rewritten using the updated syntax.-->
 至少在某种程度上熟悉类组件是有好处的，因为世界上有很多旧的React代码，这些代码可能永远不会被完全用更新的语法重写。

<!-- Let's get to know the main features of Class Components by producing yet another very familiar anecdote application. We store the anecdotes in the file <i>db.json</i> using <i>json-server</i>. The contents of the file are lifted from [here](https://github.com/fullstack-hy/misc/blob/master/anecdotes.json).-->
 让我们通过制作另一个非常熟悉的名言警句应用来了解类组件的主要功能。我们使用<i>json-server</i>将名言警句存储在<i>db.json</i>文件中。该文件的内容是从[这里](https://github.com/fullstack-hy/misc/blob/master/anecdotes.json)摘取的。

<!-- The initial version of the Class Component look like this-->
 类组件的初始版本看起来是这样的

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
 该组件现在有一个[构造函数](https://reactjs.org/docs/react-component.html#constructor)，其中暂时没有发生任何事情，并包含方法[渲染](https://reactjs.org/docs/react-component.html#render)。正如人们所猜测的那样，render定义了如何和什么被渲染到屏幕上。

<!-- Let's define a state for the list of anecdotes and the currently-visible anecdote. In contrast to when using the [useState](https://reactjs.org/docs/hooks-state.html) hook, Class Components only contain one state. So if the state is made up of multiple "parts", they should be stored as properties of the state. The state is initialized in the constructor:-->
 让我们为名言警句列表和当前可见的名言警句定义一个状态。与使用[useState](https://reactjs.org/docs/hooks-state.html)钩子时不同的是，类组件只包含一个状态。因此，如果状态是由多个 "部分 "组成的，它们应该被存储为状态的属性。状态在构造函数中被初始化。

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
    if (this.state.anecdotes.length === 0) { // highlight-line
      return <div>no anecdotes...</div>
    }

    return (
      <div>
        <h1>anecdote of the day</h1>
        <div>
          {this.state.anecdotes[this.state.current].content} // highlight-line
        </div>
        <button>next</button>
      </div>
    )
  }
}
```

<!-- The component state is in the instance variable _this.state_. The state is an object having two properties. <i>this.state.anecdotes</i> is the list of anecdotes and <i>this.state.current</i> is the index of the currently-shown anecdote.-->
 组件的状态在实例变量_this.state_中。状态是一个有两个属性的对象。<i>this.state.anecdotes</i>是名言警句的列表，<i>this.state.current</i>是当前显示的名言警句的索引。

<!-- In Functional components, the right place for fetching data from a server is inside an [effect hook](https://reactjs.org/docs/hooks-effect.html), which is executed when a component renders or less frequently if necessary, e.g. only in combination with the first render.-->
 在功能组件中，从服务器获取数据的正确位置是在[效果钩子](https://reactjs.org/docs/hooks-effect.html)中，它在组件渲染时被执行，或者在必要时不那么频繁，例如，只在第一次渲染时被执行。

<!-- The [lifecycle methods](https://reactjs.org/docs/state-and-lifecycle.html#adding-lifecycle-methods-to-a-class) of Class Components offer corresponding functionality. The correct place to trigger the fetching of data from a server is inside the lifecycle method [componentDidMount](https://reactjs.org/docs/react-component.html#componentdidmount), which is executed once right after the first time a component renders:-->
类组件的[生命周期方法](https://reactjs.org/docs/state-and-lifecycle.html#adding-lifecycle-methods-to-a-class)提供相应的功能。触发从服务器获取数据的正确位置是在生命周期方法[componentDidMount](https://reactjs.org/docs/react-component.html#componentdidmount)中，该方法在一个组件第一次渲染后执行一次。

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
 HTTP请求的回调函数使用方法[setState](https://reactjs.org/docs/react-component.html#setstate)更新组件的状态。该方法只触及作为参数传递给该方法的对象中定义的键。键<i>current</i>的值保持不变。

<!-- Calling the method setState always triggers the rerender of the Class Component, i.e. calling the method _render_.-->
 调用setState方法总是会触发类组件的重新渲染，也就是调用_render_方法。

<!-- We'll finish off the component with the ability to change the shown anecdote. The following is the code for the entire component with the addition highlighted:-->
 我们将以改变所显示的名言警句的能力来结束这个组件。下面是整个组件的代码，其中突出强调了添加的内容。

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
 为便于比较，这里是同样的应用，作为一个功能组件。

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
 在我们的例子中，差异很小。功能性组件和类组件之间最大的区别主要是，类组件的状态是一个单一的对象，而且状态是通过_setState_方法来更新的，而在功能性组件中，状态可以由多个不同的变量组成，所有的变量都有自己的更新函数。

<!-- In some more advanced use cases, the effect hook offers a considerably better mechanism for controlling side effects compared to the lifecycle methods of Class Components.-->
 在一些更高级的用例中，与类组件的生命周期方法相比，效果钩提供了一个相当好的机制来控制副作用。

<!-- A notable benefit of using Functional components is not having to deal with the self-referencing _this_ reference of the Javascript class.-->
 使用功能组件的一个明显的好处是不必处理Javascript类的自我引用_this_。

<!-- In my opinion, and the opinion of many others, Class Components offer basically no benefits over Functional components enhanced with hooks, with the exception of the so-called [error boundary](https://reactjs.org/docs/error-boundaries.html) mechanism, which currently (15th February 2021) isn't yet in use by functional components.-->
在我和其他许多人看来，类组件基本上没有提供比用钩子增强的功能组件更多的好处，除了所谓的[错误边界](https://reactjs.org/docs/error-boundaries.html)机制，目前（2021年2月15日）还没有被功能组件使用。

<!-- When writing fresh code, [there is no rational reason to use Class Components](https://reactjs.org/docs/hooks-faq.html#should-i-use-hooks-classes-or-a-mix-of-both) if the project is using React with a version number 16.8 or greater. On the other hand, [there is currently no need to rewrite all old React code](https://reactjs.org/docs/hooks-faq.html#do-i-need-to-rewrite-all-my-class-components) as Functional components.-->
 在编写新的代码时，[如果项目使用的是版本号为16.8或更高的React，就没有合理的理由使用类组件](https://reactjs.org/docs/hooks-faq.html#should-i-use-hooks-classes-or-a-mix-of-both)。另一方面，[目前没有必要将所有旧的React代码重写](https://reactjs.org/docs/hooks-faq.html#do-i-need-to-rewrite-all-my-class-components)为功能组件。

### Organization of code in React application

<!-- In most applications, we followed the principle by which components were placed in the directory <i>components</i>, reducers were placed in the directory <i>reducers</i>, and the code responsible for communicating with the server was placed in the directory <i>services</i>. This way of organizing fits a smaller application just fine, but as the amount of components increase, better solutions are needed. There is no one correct way to organize a project. The article [The 100% correct way to structure a React app (or why there’s no such thing)](https://medium.com/hackernoon/the-100-correct-way-to-structure-a-react-app-or-why-theres-no-such-thing-3ede534ef1ed) provides some perspective on the issue.-->
 在大多数应用中，我们遵循的原则是：组件放在<i>components</i>目录中，reducers放在<i>reducers</i>目录中，而负责与服务器通信的代码放在<i>services</i>目录中。这种组织方式适合小型应用，但随着组件数量的增加，需要更好的解决方案。没有一种正确的方式来组织项目。这篇文章[The 100% correct way to structure a React app (or why there's no such thing)](https://medium.com/hackernoon/the-100-correct-way-to-structure-a-react-app-or-why-theres-no-such-thing-3ede534ef1ed)对这个问题提供了一些看法。

### Frontend and backend in the same repository

<!-- During the course, we have created the frontend and backend into separate repositories. This is a very typical approach. However, we did the deployment by [copying](/en/part3/deploying_app_to_internet#serving-static-files-from-the-backend) the bundled frontend code into the backend repository. A possibly better approach would have been to deploy the frontend code separately. Especially with applications created using Create React App it is very straightforward thanks to the included [buildpack](https://github.com/mars/create-react-app-buildpack).-->
 在课程中，我们将前端和后端创建为不同的存储库。这是一个非常典型的方法。然而，我们通过[复制](/en/part3/deploying_app_to_internet#serving-static-files-from-the-backend)将捆绑的前端代码复制到后端仓库来进行部署。一个可能更好的方法是将前端代码单独部署。特别是对于使用Create React App创建的应用，由于包含了[buildpack](https://github.com/mars/create-react-app-buildpack)，它是非常直接的。

<!-- Sometimes, there may be a situation where the entire application is to be put into a single repository. In this case, a common approach is to put the <i>package.json</i> and <i>webpack.config.js</i> in the root directory, as well as place the frontend and backend code into their own directories, e.g. <i>client</i> and <i>server</i>.-->
 有时，可能会出现整个应用要放到一个仓库中的情况。在这种情况下，常见的做法是将<i>package.json</i>和<i>webpack.config.js</i>放在根目录下，同时将前端和后端代码放在各自的目录下，例如<i>client</i>和<i>server</i>。

<!-- [This repository](https://github.com/fullstack-hy2020/create-app) provides one possible starting point for the organization of "single repository code".-->
 [这个仓库](https://github.com/fullstack-hy2020/create-app)为 "单一仓库代码 "的组织提供了一个可能的起点。

### Changes on the server

<!-- If there are changes in the state on the server, e.g. when new blogs are added by other users to the bloglist service, the React frontend we implemented during this course will not notice these changes until the page reloads. A similar situation arises when the frontend triggers a time-consuming computation in the backend. How do we reflect the results of the computation to the frontend?-->
 如果服务器上的状态有变化，例如，当其他用户向博客列表服务添加新的博客时，我们在本课程中实现的React前端将不会注意到这些变化，直到页面重新加载。当前端触发了后端的一个耗时的计算时，也会出现类似的情况。我们如何将计算的结果反映到前端？

<!-- One way is to execute [polling](<https://en.wikipedia.org/wiki/Polling_(computer_science)>) on the frontend, meaning repeated requests to the backend API e.g. using the [setInterval](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval) command.-->
 一种方法是在前端执行[轮询](<https://en.wikipedia.org/wiki/Polling_(computer_science)>)，也就是重复请求后端API，比如使用[setInterval](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval)命令。

<!-- A more sophisticated way is to use [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) which allow establishing a two-way communication channel between the browser and the server. In this case, the browser does not need to poll the backend, and instead only has to define callback functions for situations when the server sends data about updating state using a WebSocket.-->
更复杂的方法是使用[WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)，它允许在浏览器和服务器之间建立一个双向的通信通道。在这种情况下，浏览器不需要轮询后端，而只需要为服务器使用WebSocket发送更新状态数据的情况定义回调函数。

<!-- WebSockets are an API provided by the browser, which is not yet fully supported on all browsers:-->
 WebSockets是由浏览器提供的一个API，它还没有被所有的浏览器完全支持。

![](../../images/7/31ea.png)

<!-- Instead of directly using the WebSocket API, it is advisable to use the [Socket.io](https://socket.io/) library, which provides various <i>fallback</i> options in case the browser does not have the full support for WebSockets.-->
与其直接使用WebSocket API，不如使用[Socket.io](https://socket.io/)库，它提供了各种<i>回落</i>选项，以防浏览器不完全支持WebSocket。

<!-- In [part 8](/en/part8), our topic is GraphQL, which provides a nice mechanism for notifying clients when there are changes in the backend data.-->
 在[第8章节](/en/part8)中，我们的主题是GraphQL，它提供了一个很好的机制，当后端数据有变化时，可以通知客户端。

### Virtual DOM

<!-- The concept of the Virtual DOM often comes up when discussing React. What is it all about? As mentioned in [part 0](/en/part0/fundamentals_of_web_apps#document-object-model-or-dom), browsers provide a [DOM API](https://developer.mozilla.org/fi/docs/DOM) through which the JavaScript running in the browser can modify the elements defining the appearance of the page.-->
 在讨论React的时候，经常会出现虚拟DOM的概念。它到底是什么？正如在[第0章节](/en/part0/fundamentals_of_web_apps#document-object-model-or-dom)中提到的，浏览器提供了一个[DOM API](https://developer.mozilla.org/fi/docs/DOM)，通过它，在浏览器中运行的JavaScript可以修改定义页面外观的元素。

<!-- When a software developer uses React, they rarely or never directly manipulate the DOM. The function defining the React component returns a set of [React elements](https://reactjs.org/docs/glossary.html#elements). Although some of the elements look like normal HTML elements-->
当软件开发者使用React时，他们很少或从不直接操作DOM。定义React组件的函数返回一组[React元素](https://reactjs.org/docs/glossary.html#elements)。虽然其中一些元素如下所示：普通的HTML元素

```js
const element = <h1>Hello, world</h1>
```

<!-- they are also just JavaScript-based React elements at their core.-->
它们的核心也只是基于JavaScript的React元素。

<!-- The React elements defining the appearance of the components of the application make up the [Virtual DOM](https://reactjs.org/docs/faq-internals.html#what-is-the-virtual-dom), which is stored in system memory during runtime.-->
 定义应用组件外观的React元素构成了[虚拟DOM](https://reactjs.org/docs/faq-internals.html#what-is-the-virtual-dom)，它在运行时被存储在系统内存中。

<!-- With the help of the [ReactDOM](https://reactjs.org/docs/react-dom.html) library, the virtual DOM defined by the components is rendered to a real DOM that can be shown by the browser using the DOM API:-->
在[ReactDOM](https://reactjs.org/docs/react-dom.html)库的帮助下，由组件定义的虚拟DOM被渲染成一个真实的DOM，可以由浏览器使用DOM API显示。

```js
ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
  )
```

<!-- When the state of the application changes, a <i>new virtual DOM</i> gets defined by the components. React has the previous version of the virtual DOM in memory and instead of directly rendering the new virtual DOM using the DOM API, React computes the optimal way to update the DOM (remove, add or modify elements in the DOM) such that the DOM reflects the new virtual DOM.-->
 当应用的状态改变时，一个新的虚拟DOM</i>会被组件定义。React在内存中拥有先前版本的虚拟DOM，而不是使用DOM API直接渲染新的虚拟DOM，React计算出更新DOM的最佳方式（删除、添加或修改DOM中的元素），从而使DOM反映出新的虚拟DOM。

### On the role of React in applications

<!-- In the material, we may not have put enough emphasis on the fact that React is primarily a library for managing the creation of views for an application. If we look at the traditional [Model View Controller](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) pattern, then the domain of React would be <i>View</i>. React has a more narrow area of application than e.g. [Angular](https://angular.io/), which is an all-encompassing Frontend MVC framework. Therefore, React is not being called a <i>framework</i>, but a <i>library</i>.-->
 在材料中，我们可能没有充分强调React主要是一个管理应用创建视图的库。如果我们看一下传统的[Model View Controller](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)模式，那么React的领域应该是<i>View</i>。React的应用范围比[Angular](https://angular.io/)更窄，后者是一个包罗万象的前端MVC框架。因此，React不被称为一个<i>框架</i>，而是一个<i>库</i>。

<!-- In small applications, data handled by the application is being stored in the state of the React components, so in this scenario the state of the components can be thought of as <i>models</i> of an MVC architecture.-->
在小型应用中，应用所处理的数据被存储在React组件的状态中，所以在这种情况下，组件的状态可以被认为是MVC架构的<i>模型</i>。

<!-- However, MVC architecture is not usually mentioned when talking about React applications. Furthermore, if we are using Redux, then the applications follow the [Flux](https://facebook.github.io/flux/docs/in-depth-overview) architecture and the role of React is even more focused on creating the views. The business logic of the application is handled using the Redux state and action creators. If we're using [redux thunk](/en/part6/communicating_with_server_in_a_redux_application#asynchronous-actions-and-redux-thunk) familiar from part 6, then the business logic can be almost completely separated from the React code.-->
 然而，在谈论React应用时，通常不会提到MVC架构。此外，如果我们使用Redux，那么应用遵循[Flux](https://facebook.github.io/flux/docs/in-depth-overview)架构，React的作用甚至更侧重于创建视图。应用的业务逻辑是使用Redux的状态和动作创建器来处理的。如果我们使用第六章节中熟悉的[redux thunk](/en/part6/communicating_with_server_in_a_redux_application#asynchronous-actions-and-redux-thunk)，那么业务逻辑几乎可以与React代码完全分离。

<!-- Because both React and [Flux](https://facebook.github.io/flux/docs/in-depth-overview) were created at Facebook, one could say that using React only as a UI library is the intended use case. Following the Flux architecture adds some overhead to the application, and if we're talking about a small application or prototype, it might be a good idea to use React "wrong", since [over-engineering](https://en.wikipedia.org/wiki/Overengineering) rarely yields an optimal result.-->
 因为React和[Flux](https://facebook.github.io/flux/docs/in-depth-overview)都是在Facebook创建的，可以说只把React作为一个UI库来使用是预期的使用情况。遵循Flux架构会给应用增加一些开销，如果我们谈论的是一个小的应用或原型，那么 "错误 "地使用React可能是一个好主意，因为[过度工程](https://en.wikipedia.org/wiki/Overengineering)很少会产生一个最佳结果。

<!-- As I mentioned at the end of [part 6](/en/part6/connect#redux-and-the-component-state), the React [Context api](https://reactjs.org/docs/context.html) offers one alternative solution for centralized state management without the need for third-party libraries such as redux. You can read more about this [here](https://www.simplethread.com/cant-replace-redux-with-hooks/) and [here](https://hswolff.com/blog/how-to-usecontext-with-usereducer/).-->
 正如我在[第六章节](/en/part6/connect#redux-and-the-component-state)的结尾提到的，React的[Context api](https://reactjs.org/docs/context.html)为集中式状态管理提供了一种替代解决方案，而不需要redux之类的第三方库。你可以阅读更多关于这个[这里](https://www.simplethread.com/cant-replace-redux-with-hooks/)和[这里](https://hswolff.com/blog/how-to-usecontext-with-usereducer/)。

### React/node-application security

<!-- So far during the course, we have not touched on information security much. We do not have much time for this now either, but fortunately the department has the MOOC course [Securing Software](https://cybersecuritybase.mooc.fi/module-2.1) for this important topic.-->
 到目前为止，在课程中，我们还没有过多地涉及到信息安全。我们现在也没有太多的时间，但幸运的是，系里有MOOC课程[Securing Software](https://cybersecuritybase.mooc.fi/module-2.1)来讨论这个重要话题。

<!-- We will, however, take a look at some things specific to this course.-->
不过，我们会看一下这个课程的一些具体内容。

<!-- The Open Web Application Security Project, otherwise known as [OWASP](https://www.owasp.org), publishes an annual list of the most common security risks in Web applications. The most recent list can be found [here](https://owasp.org/www-project-top-ten/). The same risks can be found from one year to another.-->
开放网络应用安全项目，又称[OWASP](https://www.owasp.org)，每年发布一份网络应用中最常见的安全风险清单。最新的列表可以在[这里](https://owasp.org/www-project-top-ten/)找到。同样的风险可以从一年到另一年中找到。

<!-- At the top of the list we find <i>injection</i>, which means that e.g. text sent using a form in an application is interpreted completely differently than the software developer had intended. The most famous type of injection is probably the [SQL injection](https://stackoverflow.com/questions/332365/how-does-the-sql-injection-from-the-bobby-tables-xkcd-comic-work).-->
在列表的顶部，我们发现<i>注入</i>，这意味着例如在应用中使用表格发送的文本被解释为与软件开发人员的意图完全不同。最有名的注入类型可能是[SQL注入](https://stackoverflow.com/questions/332365/how-does-the-sql-injection-from-the-bobby-tables-xkcd-comic-work)。

<!-- For example, imagine that the following SQL query is executed in a vulnerable application:-->
例如，想象一下，在一个有漏洞的应用中执行以下SQL查询。

```js
let query = "SELECT * FROM Users WHERE name = '" + userName + "';"
```

<!-- Now let's assume that a malicious user <i>Arto Hellas</i> would define their name as-->
 现在我们假设一个恶意的用户<i>Arto Hellas</i>将他们的名字定义为

<pre>
Arto Hell-as'; DROP TABLE Users; --
</pre>

<!-- so that the name would contain a single quote <code>'</code>, which is the beginning- and end-character of a SQL-string. As a result of this, two SQL operations would be executed, the second of which would  destroy the database table <i>Users</i>:-->
 这样名字就包含一个单引号<code>''</code>，这是一个SQL字符串的开始和结束字符。这样做的结果是，两个SQL操作将被执行，其中第二个操作将破坏数据库表<i>Users</i>。

```sql
SELECT * FROM Users WHERE name = 'Arto Hell-as'; DROP TABLE Users; --'
```

<!-- SQL injections are prevented using [parameterized queries](https://security.stackexchange.com/questions/230211/why-are-stored-procedures-and-prepared-statements-the-preferred-modern-methods-f). With them, user input isn't mixed with the SQL query, but the database itself inserts the input values at placeholders in the query (usually <code>?</code>).-->
 使用[参数化查询](https://security.stackexchange.com/questions/230211/why-are-stored-procedures-and-prepared-statements-the-preferred-modern-methods-f)可以防止SQL注入。使用它们，用户的输入不会与SQL查询混合，而是数据库本身在查询的占位符处插入输入值（通常是<code>?</code>）。

```js
execute("SELECT * FROM Users WHERE name = ?", [userName])
```

<!-- Injection attacks are also possible in NoSQL databases. However, mongoose prevents them by [sanitizing](https://zanon.io/posts/nosql-injection-in-mongodb) the queries. More on the topic can be found e.g. [here](https://web.archive.org/web/20220901024441/https://blog.websecurify.com/2014/08/hacking-nodejs-and-mongodb.html).-->
 注入攻击在NoSQL数据库中也是可行的。然而，mongoose通过[sanitizing](https://zanon.io/posts/nosql-injection-in-mongodb)查询来防止它们。关于这个主题的更多信息可以找到，例如[这里](https://web.archive.org/web/20220901024441/https://blog.websecurify.com/2014/08/hacking-nodejs-and-mongodb.html)。

<i>Cross-site scripting (XSS)</i> is an attack where it is possible to inject malicious JavaScript code into a legitimate web application. The malicious code would then be executed in the browser of the victim. If we try to inject the following into e.g. the notes application:

```html
<script>
  alert('Evil XSS attack')
</script>
```

<!-- the code is not executed, but is only rendered as 'text' on the page:-->
代码不被执行，只是在页面上渲染为"文本"。

![](../../images/7/32e.png)

<!-- since React [takes care of sanitizing data in variables](https://reactjs.org/docs/introducing-jsx.html#jsx-prevents-injection-attacks). Some versions of React [have been vulnerable](https://medium.com/dailyjs/exploiting-script-injection-flaws-in-reactjs-883fb1fe36c1) to XSS attacks. The security holes have of course been patched, but there is no guarantee that there couldn't be any more.-->
因为React[负责对变量中的数据进行消毒](https://reactjs.org/docs/introducing-jsx.html#jsx-prevents-injection-attacks)。一些版本的React[已经容易受到XSS攻击](https://medium.com/dailyjs/exploiting-script-injection-flaws-in-reactjs-883fb1fe36c1)。当然，这些安全漏洞已经被修补了，但不能保证不会有更多的漏洞。

<!-- One needs to remain vigilant when using libraries; if there are security updates to those libraries, it is advisable to update those libraries in one's own applications. Security updates for Express are found in the [library's documentation](https://expressjs.com/en/advanced/security-updates.html) and the ones for Node are found in [this blog](https://nodejs.org/en/blog/).-->
 在使用库的时候，人们需要保持警惕；如果这些库有安全更新，建议在自己的应用中更新这些库。Express的安全更新可以在[库的文档](https://expressjs.com/en/advanced/security-updates.html)找到，Node的安全更新可以在[这个博客](https://nodejs.org/en/blog/)找到。

<!-- You can check how up to date your dependencies are using the command-->
 你可以使用以下命令检查你的依赖关系的最新情况

```bash
npm outdated --depth 0
```

<!-- One year old project that is used by the [part 9](/en/part9) of his course already have quite a few outdated dependencies:-->
 他的课程的[第9章节](/en/part9)使用的一年前的项目已经有很多过时的依赖关系。

![](../../images/7/33x.png)

<!-- The dependencies can be brought up to date by updating the file <i>package.json</i>. The best way to do that is by using a tool called _npm-check-updates_. It can be installed globally by running the command-->
 可以通过更新文件<i>package.json</i>来使依赖关系更新。最好的方法是使用一个叫做_npm-check-updates_的工具来做到这一点。它可以通过运行以下命令全局安装
```bash
npm install -g npm-check-updates
```
<!-- Using this tool, the up-to-dateness of dependencies is checked in the following way:-->
 使用这个工具，将以如下方式检查依赖关系的最新情况。
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
 文件<i>package.json</i>通过运行命令_ncu -u_被更新。
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
 然后是通过运行命令_npm install_来更新依赖项。然而，旧版本的依赖关系不一定有安全风险。

<!-- The npm [audit](https://docs.npmjs.com/cli/audit) command can be used to check the security of dependencies. It compares the version numbers of the dependencies in your application to a list of the version numbers of dependencies containing known security threats in a centralized error database.-->
 npm [audit](https://docs.npmjs.com/cli/audit) 命令可以用来检查依赖关系的安全性。它将你的应用中的依赖关系的版本号与一个集中的错误数据库中包含已知安全威胁的依赖关系的版本号列表进行比较。

<!-- Running _npm audit_ on the same project prints a long list of complaints and suggested fixes.-->
 在同一个项目上运行_npm audit_，会打印出一长串的投诉和建议修复的清单。
<!-- Below is a part of the report:-->
下面是报告的一部分。

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

<!-- After only one year, the code is full of small security threats. Luckily, there are only 2 critical threats.  Let's run _npm audit fix_ as the report suggests:-->
 仅仅一年之后，代码就充满了小的安全威胁。幸运的是，只有2个关键威胁。  让我们按照报告的建议运行_npm audit fix_。

```js
$ npm audit fix

+ mongoose@5.9.1
added 19 packages from 8 contributors, removed 8 packages and updated 15 packages in 7.325s
fixed 354 of 416 vulnerabilities in 20047 scanned packages
  1 package update for 62 vulns involved breaking changes
  (use `npm audit fix --force` to install breaking changes; or refer to `npm audit` for steps to fix these manually)
```

<!-- 62 threats remain because, by default, _audit fix_  does not update dependencies if their <i>major</i> version number has increased.  Updating these dependencies could lead to the whole application breaking down.-->
 62个威胁仍然存在，因为在默认情况下，_audit fix_不更新依赖关系，如果它们的<i>主要</i>版本号已经增加。  更新这些依赖关系可能导致整个应用崩溃。

<!-- The source for critical bug is the library [immer](https://github.com/immerjs/immer)-->
 关键错误的来源是库[immer](https://github.com/immerjs/immer)

```js
immer  <9.0.6
Severity: critical
Prototype Pollution in immer - https://github.com/advisories/GHSA-33f9-j839-rf8h
fix available via `npm audit fix --force`
Will install react-scripts@5.0.0, which is a breaking change
```

<!-- Running _npm audit fix --force_ would upgrade the library version but would also upgrade the library _react-scripts_ and that would potentially break down the development environment. So we will leave the library upgrades for later...-->
 运行_npm audit fix --force_会升级库的版本，但也会升级库_react-scripts_，这有可能会破坏开发环境。所以我们会把库的升级留到以后...

<!-- One of the threats mentioned in the list from OWASP is <i>Broken Authentication</i> and the related <i>Broken Access Control</i>. The token-based authentication we have been using is fairly robust, if the application is being used on the traffic-encrypting HTTPS protocol. When implementing access control, one should e.g. remember to not only check a user's identity in the browser but also on the server. Bad security would be to prevent some actions to be taken only by hiding the execution options in the code of the browser.-->
 OWASP的列表中提到的威胁之一是<i>破坏性认证</i>和相关的<i>破坏性访问控制</i>。如果应用是在流量加密的HTTPS协议上使用，我们一直使用的基于令牌的认证是相当强大的。在实现访问控制时，我们应该记住不仅要在浏览器中检查用户的身份，还要在服务器上检查。糟糕的安全问题是仅仅通过在浏览器的代码中隐藏执行选项来阻止一些行动的进行。

<!-- On Mozilla's MDN, there is a very good [Website security guide](https://developer.mozilla.org/en-US/docs/Learn/Server-side/First_steps/Website_security), which brings up this very important topic:-->
 在Mozilla's MDN上，有一个非常好的[网站安全指南](https://developer.mozilla.org/en-US/docs/Learn/Server-side/First_steps/Website_security)，它提出了这个非常重要的话题。

![](../../images/7/34.png)

<!-- The documentation for Express includes a section on security: [Production Best Practices: Security](https://expressjs.com/en/advanced/best-practice-security.html), which is worth a read through. It is also recommended to add a library called [Helmet](https://helmetjs.github.io/) to the backend. It includes a set of middlewares that eliminate some security vulnerabilities in Express applications.-->
 Express的文档包括一个关于安全的章节：[生产最佳实践：安全](https://expressjs.com/en/advanced/best-practice-security.html)，值得一读。我们还建议在后端添加一个叫做[Helmet](https://helmetjs.github.io/)的库。它包括一组中间件，可以消除Express应用中的一些安全漏洞。

<!-- Using the ESlint [security-plugin](https://github.com/nodesecurity/eslint-plugin-security) is also worth doing.-->
 使用ESlint [security-plugin](https://github.com/nodesecurity/eslint-plugin-security)也是值得做的。

### Current trends

<!-- Finally, let's take a look at some technology of tomorrow (or, actually, already today), and directions in which Web development is heading.-->
 最后，让我们来看看一些未来的技术（或者，实际上，今天已经有了），以及网络开发的方向。

#### Typed versions of JavaScript

<!-- Sometimes, the [dynamic typing](https://developer.mozilla.org/en-US/docs/Glossary/Dynamic_typing) of JavaScript variables creates annoying bugs. In part 5, we talked briefly about [PropTypes](/en/part5/props_children_and_proptypes#prop-types): a mechanism which enables one to enforce type checking for props passed to React components.-->
 有时，JavaScript变量的[动态类型](https://developer.mozilla.org/en-US/docs/Glossary/Dynamic_typing)会产生恼人的错误。在第五章节，我们简要地谈到了[PropTypes](/en/part5/props_children_and_proptypes#prop-types)：一种能够对传递给React组件的props实施类型检查的机制。

<!-- Lately, there has been a notable uplift in the interest in [static type checking](https://en.wikipedia.org/wiki/Type_system#Static_type_checking). At the moment, the most popular typed version of Javascript is [Typescript](https://www.typescriptlang.org/) which has been developed by Microsoft. Typescript is covered in [part 9](/en/part9).-->
 最近，人们对[静态类型检查](https://en.wikipedia.org/wiki/Type_system#Static_type_checking)的兴趣有了明显的提升。目前，最流行的Javascript类型化版本是[Typescript](https://www.typescriptlang.org/)，它由微软开发。Typescript在[第9章节](/en/part9)中有所介绍。

#### Server-side rendering, isomorphic applications and universal code

<!-- The browser is not the only domain where components defined using React can be rendered. The rendering can also be done on the [server](https://reactjs.org/docs/react-dom-server.html). This kind of approach is increasingly being used, such that, when accessing the application for the first time, the server serves a pre-rendered page made with React. From here onwards, the operation of the application continues as usual, meaning the browser executes React, which manipulates the DOM shown by the browser. The rendering that is done on the server goes by the name: <i>server-side rendering</i>.-->
 浏览器不是唯一可以渲染使用React定义的组件的领域。渲染也可以在[服务器](https://reactjs.org/docs/react-dom-server.html)上完成。这种方法正被越来越多地使用，例如，当第一次访问应用时，服务器会提供一个用React制作的预渲染的页面。从这里开始，应用的操作照常进行，也就是说，浏览器执行React，它操纵浏览器显示的DOM。在服务器上进行的渲染有一个名字。<i>服务器端渲染</i>。

<!-- One motivation for server-side rendering is Search Engine Optimization (SEO). Search engines have traditionally been very bad at recognizing JavaScript-rendered content. However, the tide might be turning, e.g. take a look at [this](https://www.javascriptstuff.com/react-seo/) and [this](https://medium.freecodecamp.org/seo-vs-react-is-it-neccessary-to-render-react-pages-in-the-backend-74ce5015c0c9).-->
 服务器端渲染的一个动机是搜索引擎优化（SEO）。传统上，搜索引擎在识别JavaScript渲染的内容方面一直很糟糕。然而，潮流可能正在转向，例如，看看[this](https://www.javascriptstuff.com/react-seo/)和[this](https://medium.freecodecamp.org/seo-vs-react-is-it-neccessary-to-render-react-pages-in-the-backend-74ce5015c0c9)。

<!-- Of course, server-side rendering is not anything specific to React or even JavaScript. Using the same programming language throughout the stack in theory simplifies the execution of the concept, because the same code can be run on both the front- and backend.-->
 当然，服务器端渲染并不是React甚至JavaScript特有的东西。在整个堆栈中使用相同的编程语言在理论上简化了概念的执行，因为相同的代码可以在前端和后端运行。

<!-- Along with server-side rendering, there has been talk of so-called <i>isomorphic applications</i> and <i>universal code</i>, although there has been some debate about their definitions. According to some [definitions](https://medium.com/@ghengeveld/isomorphism-vs-universal-javascript-4b47fb481beb), an isomorphic web application is one that performs rendering on both the front- and backend. On the other hand, universal code is code that can be executed in most environments, meaning both the frontend and the backend.-->
 伴随着服务器端渲染，人们一直在谈论所谓的<i>同构应用</i>和<i>通用代码</i>，尽管对它们的定义存在一些争论。根据一些[定义](https://medium.com/@ghengeveld/isomorphism-vs-universal-javascript-4b47fb481beb)，一个同构的网络应用是一个在前端和后端都进行渲染的应用。另一方面，通用代码是可以在大多数环境中执行的代码，指的是在前端和后端都可以执行。

<!-- React and Node provide a desirable option for implementing an isomorphic application as universal code.-->
 React和Node提供了一个理想的选择，可以将一个同构的应用实现为通用代码。

<!-- Writing universal code directly using React is currently still pretty cumbersome. Lately, a library called [Next.js](https://github.com/vercel/next.js), which is implemented on top of React, has garnered much attention and is a good option for making universal applications.-->
 直接使用React编写通用代码，目前还是相当麻烦的。最近，一个名为[Next.js](https://github.com/vercel/next.js)的库，在React的基础上实现，获得了很多关注，是制作通用应用的一个不错的选择。

#### Progressive web apps

<!-- Lately, people have started using the term [progressive web app](https://developers.google.com/web/progressive-web-apps/) (PWA) launched by Google.-->
 最近，人们开始使用谷歌推出的[渐进式网络应用](https://developers.google.com/web/progressive-web-apps/)(PWA)这一术语。

<!-- In short, we are talking about web applications working as well as possible on every platform taking advantage of the best parts of those platforms. The smaller screen of mobile devices must not hamper the usability of the application. PWAs should also work flawlessly in offline-mode or with a slow internet connection. On mobile devices, they must be installable just like any other application. All the network traffic in a PWA should be encrypted.-->
 简而言之，我们谈论的是网络应用在每个平台上尽可能地工作，利用这些平台的最佳部分。移动设备的小屏幕不能妨碍应用的可用性。PWA还应该在离线模式或网络连接缓慢的情况下完美地工作。在移动设备上，它们必须像其他应用一样可以安装。PWA中的所有网络流量都应该是加密的。

<!-- Applications created using Create React App are [progressive](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#making-a-progressive-web-app) by default. If the application uses data from a server, making it progressive takes work. The offline functionality is usually implemented with the help of [service workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API).-->
 使用Create React App创建的应用默认为[渐进式](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#making-a-progressive-web-app)。如果应用使用来自服务器的数据，使其渐进式需要工作。离线功能通常是在[服务工作者](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)的帮助下实现的。

#### Microservice architecture

<!-- During this course, we have only scratched the surface of the server end of things. In our applications, we had a <i>monolithic</i> backend, meaning one application making up a whole and running on a single server, serving only a few API endpoints.-->
在这一课程中，我们只触及了服务器端的表面。在我们的应用中，我们有一个<i>monolithic</i>后端，意味着一个应用构成一个整体，并在一个服务器上运行，只为几个API端点服务。

<!-- As the application grows, the monolithic backend approach starts turning problematic both in terms of performance and maintainability.-->
随着应用的增长，单体后端方法在性能和可维护性方面开始变得有问题。

<!-- A [microservice architecture](https://martinfowler.com/articles/microservices.html) (microservices) is a way of composing the backend of an application from many separate, independent services, which communicate with each other over the network. An individual microservice's purpose is to take care of a particular logical functional whole. In a pure microservice architecture, the services do not use a shared database.-->
 [微服务架构](https://martinfowler.com/articles/microservices.html) (microservices)是一种将应用的后端由许多独立的服务组成的方式，这些服务通过网络相互通信。一个单独的微服务的目的是照顾到一个特定的逻辑功能整体。在一个纯粹的微服务架构中，这些服务不使用共享数据库。

<!-- For example, the bloglist application could consist of two services: one handling user and another taking care of the blogs. The responsibility of the user service would be user registration and user authentication, while the blog service would take care of operations related to the blogs.-->
 例如，博客列表应用可以由两个服务组成：一个处理用户，另一个照顾博客。用户服务的职责是用户注册和用户认证，而博客服务将负责与博客相关的操作。

<!-- The image below visualizes the difference between the structure of an application based on a microservice architecture and one based on a more traditional monolithic structure:-->
 下面的图片直观地显示了基于微服务架构的应用的结构与基于更传统的单体结构的应用的区别。

![](../../images/7/36.png)

<!-- The role of the frontend (enclosed by a square in the picture) does not differ much between the two models. There is often a so-called [API gateway](http://microservices.io/patterns/apigateway) between the microservices and the frontend, which provides an illusion of a more traditional "everything on the same server" API. [Netflix](https://medium.com/netflix-techblog/optimizing-the-netflix-api-5c9ac715cf19), among others, uses this type of approach.-->
 前端的作用（图片中用方块围起来）在这两种模式中没有太大的区别。在微服务和前端之间通常有一个所谓的[API网关](http://microservices.io/patterns/apigateway)，它提供了一个更传统的 "一切都在同一个服务器上 "的API的假象。[Netflix](https://medium.com/netflix-techblog/optimizing-the-netflix-api-5c9ac715cf19)，除其他外，采用了这种类型的方法。

<!-- Microservice architectures emerged and evolved for the needs of large internet-scale applications. The trend was set by Amazon far before the appearance of the term microservice. The critical starting point was an email sent to all employees in 2002 by Amazon CEO Jeff Bezos:-->
 微服务架构的出现和发展是为了满足大型互联网规模应用的需要。在微服务这个词出现之前，亚马逊就已经确定了这个趋势。关键的起点是亚马逊CEO Jeff Bezos在2002年发给所有员工的一封电子邮件。

<!-- > All teams will henceforth expose their data and functionality through service interfaces.-->
 > 所有的团队今后都将通过服务接口暴露他们的数据和功能。
<!-- >-->
 >
<!-- > Teams must communicate with each other through these interfaces.-->
 > 团队之间必须通过这些接口进行交流。
<!-- >-->
 >
<!-- > There will be no other form of inter-process communication allowed: no direct linking, no direct reads of another team’s data store, no shared-memory model, no back-doors whatsoever. The only communication allowed is via service interface calls over the network.-->
 > 没有其他形式的进程间通信是允许的：没有直接链接，没有直接读取另一个团队的数据存储，没有共享内存模型，没有任何后门。唯一允许的通信是通过网络的服务接口调用。
<!-- >-->
 >
<!-- > It doesn’t matter what technology you use.-->
 > 你使用什么技术并不重要。
<!-- >-->
 >
<!-- > All service interfaces, without exception, must be designed from the ground up to be externalize-able. That is to say, the team must plan and design to be able to expose the interface to developers in the outside world.-->
 > 所有的服务接口，无一例外，都必须从头开始设计为可外化的。也就是说，团队必须计划和设计能够将接口暴露给外部世界的开发者。
<!-- >-->
 >
<!-- > No exceptions.-->
 > 没有例外。
<!-- >-->
 >
<!-- > Anyone who doesn’t do this will be fired. Thank you; have a nice day!-->
 > 任何不这样做的人都会被解雇。谢谢你；祝你有个愉快的一天!

<!-- Nowadays, one of the biggest forerunners in the use of microservices is [Netflix](https://www.infoq.com/presentations/netflix-chaos-microservices).-->
 现在，使用微服务的最大先行者之一是[Netflix](https://www.infoq.com/presentations/netflix-chaos-microservices)。

<!-- The use of microservices has steadily been gaining hype to be kind of a [silver bullet](https://en.wikipedia.org/wiki/No_Silver_Bullet) of today, which is being offered as a solution to almost every kind of problem. However, there are a number of challenges when it comes to applying a microservice architecture, and it might make sense to go [monolith first](https://martinfowler.com/bliki/MonolithFirst.html) by initially making a traditional all-encompassing backend. Or maybe [not](https://martinfowler.com/articles/dont-start-monolith.html). There are a bunch of different opinions on the subject. Both links lead to Martin Fowler's site; as we can see, even the wise are not entirely sure which one of the right ways is more right.-->
微服务的使用已经逐渐被炒作成了今天的[银弹](https://en.wikipedia.org/wiki/No_Silver_Bullet)，它被作为几乎所有问题的解决方案而提出。然而，当涉及到应用微服务架构时，有一些挑战，通过最初制作一个传统的全方位的后端，走[单片机优先](https://martinfowler.com/bliki/MonolithFirst.html)可能是合理的。或者也许[不](https://martinfowler.com/articles/dont-start-monolith.html)。在这个问题上有一堆不同的意见。这两个链接都指向Martin Fowler's网站；我们可以看到，即使是智者也不能完全确定哪一种正确的方式更正确。

<!-- Unfortunately, we cannot dive deeper into this important topic during this course. Even a cursory look at the topic would require at least 5 more weeks.-->
不幸的是，在这个课程中，我们无法深入研究这个重要的话题。即使粗略地看一下这个话题，也需要至少5周的时间。

#### Serverless

<!-- After the release of Amazon's [lambda](https://aws.amazon.com/lambda/) service at the end of 2014, a new trend started to emerge in web application development: [serverless](https://serverless.com/).-->
在2014年底亚马逊的[lambda](https://aws.amazon.com/lambda/)服务发布后，网络应用开发中开始出现一个新的趋势。[无服务器](https://serverless.com/)。

<!-- The main thing about lambda, and nowadays also Google's [Cloud functions](https://cloud.google.com/functions/) as well as [similar functionality in Azure](https://azure.microsoft.com/en-us/services/functions/), is that it enables <i>the execution of individual functions</i> in the cloud. Before, the smallest executable unit in the cloud was a single <i>process</i>, e.g. a runtime environment running a Node backend.-->
 关于lambda，以及现在谷歌的[云功能](https://cloud.google.com/functions/)和[Azure的类似功能](https://azure.microsoft.com/en-us/services/functions/)的主要内容是，它能够在云中执行单个功能</i>。之前，云中最小的可执行单元是单个<i>进程</i>，例如，运行Node后端的运行环境。

<!-- E.g. Using Amazon's [API gateway](https://aws.amazon.com/api-gateway/) it is possible to make serverless applications where the requests to the defined HTTP API get responses directly from cloud functions. Usually the functions already operate using stored data in the databases of the cloud service.-->
 例如，使用亚马逊的[API网关](https://aws.amazon.com/api-gateway/)，可以制作无服务器应用，其中对定义的HTTP API的请求直接从云功能中获得响应。通常，这些功能已经使用云服务数据库中的存储数据进行操作。

<!-- Serverless is not about there not being a server in applications, but about how the server is defined. Software developers can shift their programming efforts to a higher level of abstraction as there is no longer a need to programmatically define the routing of HTTP requests, database relations, etc., since the cloud infrastructure provides all of this. Cloud functions also lend themselves to creating well-scaling system, e.g. Amazon's Lambda can execute a massive amount of cloud functions per second. All of this happens automatically through the infrastructure and there is no need to initiate new servers, etc.-->
 无服务器并不是指应用中没有服务器，而是指服务器的定义方式。软件开发者可以将他们的编程工作转移到一个更高的抽象层次，因为不再需要以编程方式定义HTTP请求的路由、数据库关系等，因为云基础设施提供了所有这些。云功能也适合创建良好的扩展系统，例如，亚马逊的Lambda可以每秒执行大量的云功能。所有这些都是通过基础设施自动发生的，不需要启动新的服务器，等等。

### Useful libraries and interesting links

<!-- Javasciptin kehittäjäyhteisö on tuottanut valtavan määrän erilaisia hyödyllisiä kirjastoja ja jos olet koodaamassa jotain vähänkin isompaa, kannattaa etsiä mitä valmista kalustoa on jo tarjolla. Seuraavassa listataan muutamia luotettavien tahojen hyväksi havaitsemia kirjastoja. -->
<!-- The JavaScript developer community has produced a large variety of useful libraries. If you are developing anything more substantial, it is worth it to check if existing solutions are already available.-->
 JavaScript开发者社区已经产生了大量的有用的库。如果你正在开发更多的东西，值得检查一下是否已经有了现有的解决方案。
<!-- Below are listed some libraries recommended by trustworthy parties.-->
 下面列出了一些由值得信赖的各方推荐的库。

<!-- If your application has to handle complicated data, [lodash](https://www.npmjs.com/package/lodash), which we recommended in [part 4](/en/part4/structure_of_backend_application_introduction_to_testing#exercises-4-3-4-7), is a good library to use. If you prefer functional programming style, you might consider using [ramda](https://ramdajs.com/).-->
 如果你的应用需要处理复杂的数据，我们在[第四章节](/en/part4/structure_of_backend_application_introduction_to_testing#exercises-4-3-4-7)中推荐的[lodash](https://www.npmjs.com/package/lodash)是一个值得使用的库。如果你喜欢函数式编程风格，你可以考虑使用[ramda](https://ramdajs.com/)。

<!-- Jos sovelluksessa käsitellään aikaa, tarjoavat [moment](https://momentjs.com/) ja hieman uudempi [date-fns](https://github.com/date-fns/date-fns) siihen hyvän välineistön. -->
<!-- If you are handling times and dates, [date-fns](https://github.com/date-fns/date-fns) offers good tools for that.-->
 如果你要处理时间和日期，[date-fns](https://github.com/date-fns/date-fns)为此提供了良好的工具。

<!-- Lomakkeiden käyttöä helpottavia kirjastoja ovat [Formik](https://www.npmjs.com/package/formik) ja [redux-form](https://redux-form.com/8.3.0/). Jos sovelluksessa tulee piirtää graafeja, on vaihtoehtoja lukuisia, sekä [recharts](http://recharts.org/en-US/) että [highcharts](https://github.com/highcharts/highcharts-react) ovat hyviksi havaittuja. -->
<!-- [Formik](https://www.npmjs.com/package/formik) and [final-form](https://final-form.org/react/) can be used to handle forms more easily.-->
 [Formik](https://www.npmjs.com/package/formik)和[final-form](https://final-form.org/react/)可以用来更容易地处理表单。
<!-- If your application displays graphs, there are multiple options to choose from. Both [recharts](http://recharts.org/en-US/) and [highcharts](https://github.com/highcharts/highcharts-react) are well-recommended.-->
 如果你的应用显示图形，有多个选项可供选择。[recharts](http://recharts.org/en-US/)和[highcharts](https://github.com/highcharts/highcharts-react)都是很值得推荐的。

<!-- The [immutable.js](https://github.com/facebook/immutable-js/) library maintained by Facebook provides, as the name suggests, immutable implementations of some data structures. The library could be of use when using Redux, since as we [remember](/en/part6/flux_architecture_and_redux#pure-functions-immutable) in part 6, reducers must be pure functions, meaning they must not modify the store's state but instead have to replace it with a new one when a change occurs. Over the past year, some of the popularity of Immutable.js has been taken over by [Immer](https://github.com/mweststrate/immer), which provides similar functionality but in a somewhat easier package.-->
 Facebook维护的[immutable.js](https://github.com/facebook/immutable-js/)库，顾名思义，提供了一些数据结构的不可改变的实现。这个库可以在使用Redux时使用，因为正如我们在第六章节[记得](/en/part6/flux_architecture_and_redux#pure-functions-immutable)，还原器必须是纯函数，这意味着它们不能修改存储的状态，而是要在发生变化时用一个新的状态来替换它。在过去的一年中，Immutable.js的一些人气被[Immer](https://github.com/mweststrate/immer)所取代，它提供了类似的功能，但在某种程度上更容易打包。

<!-- [Redux-saga](https://redux-saga.js.org/) provides an alternative way to make asynchronous actions for [redux thunk](/en/part6/communicating_with_server_in_a_redux_application#asynchronous-actions-and-redux-thunk) familiar from part 6. Some embrace the hype and like it. I don't.-->
 [Redux-saga](https://redux-saga.js.org/)提供了另一种方法，为第六章节中熟悉的[redux thunk](/en/part6/communicating_with_server_in_a_redux_application#asynchronous-actions and-redux-thunk)做异步操作。有些人接受了这种炒作，并喜欢它。我不喜欢。

<!-- For single-page applications, the gathering of analytics data on the interaction between the users and the page is [more challenging](https://developers.google.com/analytics/devguides/collection/gtagjs/single-page-applications) than for traditional web applications where the entire page is loaded. The [React Google Analytics](https://github.com/react-ga/react-ga) library offers a solution.-->
 对于单页应用，收集用户和页面之间的互动的分析数据比传统的网页应用（整个页面被加载）[更具挑战性](https://developers.google.com/analytics/devguides/collection/gtagjs/single-page-applications)。[React Google Analytics](https://github.com/react-ga/react-ga)库提供了一个解决方案。

<!-- You can take advantage of your React know-how when developing mobile applications using Facebook's extremely popular [React Native](https://facebook.github.io/react-native/) library, which is the topic of [part 10](/en/part10) of the course.-->
 在使用Facebook's极受欢迎的[React Native](https://facebook.github.io/react-native/)库开发移动应用时，你可以利用你的React知识，这也是本课程[第10部分](/en/part10)的主题。

<!-- When it comes to the tools used for the management and bundling of JavaScript projects, the community has been very fickle. Best practices have changed rapidly (the years are approximations, nobody remembers that far back in the past):-->
当谈到用于管理和捆绑JavaScript项目的工具时，社区一直非常善变。最佳实践变化很快（年份是近似的，没有人记得过去那么久的事情）。

<!-- - 2011 [Bower](https://www.npmjs.com/package/bower)-->
 - 2011 [Bower](https://www.npmjs.com/package/bower)
<!-- - 2012 [Grunt](https://www.npmjs.com/package/grunt)-->
 - 2012 [Grunt](https://www.npmjs.com/package/grunt)
<!-- - 2013-14 [Gulp](https://www.npmjs.com/package/gulp)-->
 - 2013-14 [Gulp](https://www.npmjs.com/package/gulp)
<!-- - 2012-14 [Browserify](https://www.npmjs.com/package/browserify)-->
 - 2012-14 [Browserify](https://www.npmjs.com/package/browserify)
<!-- - 2015- [Webpack](https://www.npmjs.com/package/webpack)-->
 - 2015- [Webpack](https://www.npmjs.com/package/webpack)

<!-- Hipsters seem to have lost their interest in tool development after webpack started to dominate the markets. A few years ago, [Parcel](https://parceljs.org) started to make the rounds marketing itself as simple (which Webpack absolutely is not) and faster than Webpack. However, after a promising start, Parcel has not gathered any steam, and it's beginning to look like it will not be the end of Webpack.-->
 在webpack开始主宰市场后，潮人似乎对工具开发失去了兴趣。几年前，[Parcel](https://parceljs.org)开始大肆宣传自己的简单（Webpack绝对不是这样的）和比Webpack更快。然而，在一个充满希望的开始之后，Parcel并没有聚集起任何力量，而且它开始看起来不会是Webpack的终点。

<!-- Another notable mention is the [Rome](https://rome.tools/) library, which aspires to be an all-encompassing toolchain to unify linter, compiler, bundler, and more. It is currently under heavy development since the initial commit earlier this year on Feb 27, but the outlook sure seems promising.-->
 另一个值得一提的是[Rome](https://rome.tools/)库，它希望成为一个包罗万象的工具链，将linter、编译器、bundler等统一起来。自今年早些时候2月27日首次提交以来，它目前正在大力开发中，但前景似乎很好。

<!-- The site <https://reactpatterns.com/> provides a concise list of best practices for React, some of which are already familiar from this course. Another similar list is [react bits](https://vasanthk.gitbooks.io/react-bits/).-->
 该网站<https://reactpatterns.com/>提供了一个简洁的React最佳实践列表，其中一些已经在本课程中熟悉。另一个类似的列表是[react bits](https://vasanthk.gitbooks.io/react-bits/)。

<!-- [Reactiflux](https://www.reactiflux.com/) is a big chat community of React developers on Discord. It could be one possible place to get support after the course has concluded. For example, numerous libraries have their own channels.-->
 [Reactiflux](https://www.reactiflux.com/)是Discord上的一个大型React开发者聊天社区。它可能是课程结束后获得支持的一个可能的地方。例如，许多库都有自己的频道。

<!-- If you know some recommendable links or libraries, make a pull request!-->
 如果你知道一些值得推荐的链接或库，请提出一个拉动请求!

</div>
