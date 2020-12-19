---
mainImage: ../../../images/part-7.svg
part: 7
letter: e
lang: zh
---

<div class="content">


### Class Components
【类组件】
<!-- During the course we have only used React components having been defined as Javascript functions. This was not possible without the [hook](https://reactjs.org/docs/hooks-intro.html)-functionality that came with version 16.8 of React. Before, when defining a component that uses state one had to define it using Javascript's [Class](https://reactjs.org/docs/state-and-lifecycle.html#converting-a-function-to-a-class)-syntax. -->
在本课程中，我们只使用了被定义为 Javascript 函数的 React 组件。 如果没有 React 16.8版本的 [hook](https://reactjs.org/docs/hooks-intro.html) 功能，这是不可能的。 以前，在定义一个使用状态的组件时，必须使用 Javascript 的[Class](https://reactjs.org/docs/state-and-lifecycle.html#converting-a-function-to-a-Class)语法来定义它。

<!-- It is beneficial to at least be familiar with Class Components to some extent, since the world contains a lot of old React code, which will probably never be completely rewritten using the updated syntax. -->
至少在一定程度上熟悉类组件是有益的，因为这个世界包含了很多旧的 React 代码，这些代码可能永远不会使用更新的语法完全重写。

<!-- Let's get to know the main features of Class Components by producing yet another very familiar anecdote application. We store the anecdotes in the file <i>db.json</i> using <i>json-server</i>. The contents of the file are lifted from [here](https://github.com/fullstack-hy2020/misc/blob/master/anecdotes.json). -->
让我们通过生成另一个非常熟悉的八卦应用来了解类组件的主要特性。 我们使用<i>json-server</i> 将八卦存储在文件<i>db.json</i> 中。 文件的内容是从[这里](https://github.com/fullstack-hy2020/misc/blob/master/anecdotes.json)提取的。

<!-- The initial version of the Class Component look like this -->
类组件的初始版本如下所示

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



<!-- The component now has a [constructor](https://reactjs.org/docs/react-component.html#constructor), in which nothing happens at the moment, and contains the method [render](https://reactjs.org/docs/react-component.html#render). As one might guess, render defines how and what is rendered to the screen. -->
这个组件现在有一个[constructor](构造函数 https://reactjs.org/docs/react-component.html#constructor) ，其中目前没有任何事情发生，并且包含方法[render](https://reactjs.org/docs/react-component.html#render)。 正如人们猜测的那样，render 定义了如何以及什么会被渲染到屏幕上。



<!-- Let's define a state for the list of anecdotes and the currently visible anecdote. In contrast to when using the [useState](https://reactjs.org/docs/hooks-state.html)-hook Class Components only contain one state. So if the state is made up of multiple "parts" they should be stored as properties of the state. The state is initialized in the constructor: -->
让我们为八卦列表和当前可见的八卦定义一个状态。 与使用[useState](https://reactjs.org/docs/hooks-state.html)-hook 相反，类组件只包含一个状态。 因此，如果状态是由多个“部分”组成的，那么它们应该作为状态的属性存储。 在构造函数中初始化状态:

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
    if (this.state.anecdotes.length === 0 ) { // highlight-line
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



<!-- The component state is in the instance variable _this.state_. The state is an object having two properties. <i>this.state.anecdotes</i> is the list of anecdotes and <i>this.state.current</i> is the index of the currently shown anecdote. -->
组件状态位于实例变量的 this.state 中。 状态是具有两个属性的对象。<i>this.state.anecdotes</i>  是八卦列表，<i>this.state.current</i> 是当前显示八卦的索引。



<!-- In Functional components the right place for fetching data from a server is inside an [effect hook](https://reactjs.org/docs/hooks-effect.html), which is executed when a component renders or less frequently if necessary, e.g. only in combination with the first render. -->
在 函数化组件中，从服务器中获取数据的正确位置是在[effect hook](https://reactjs.org/docs/hooks-effect.html)中，当一个组件渲染时执行，或者在必要的情况下降低频率，例如只在与第一次渲染结合时执行。



<!-- The [lifecycle-methods](https://reactjs.org/docs/state-and-lifecycle.html#adding-lifecycle-methods-to-a-class) of Class Components offer corresponding functionality. The correct place to trigger the fetching of data from a server is inside the lifecycle-method [componentDidMount](https://reactjs.org/docs/react-component.html#componentdidmount), which is executed once right after the first time a component renders: -->
类组件的[生命周期方法](https://reactjs.org/docs/state-and-lifecycle.html#adding-lifecycle-methods-to-a-Class)提供了相应的功能。 触发从服务器获取数据的正确位置在 声明周期方法 [componentDidMount](https://reactjs.org/docs/react-component.html#componentDidMount)中，该方法在组件第一次渲染之后执行一次:

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



<!-- The callback function of the HTTP request updates the component state using the method [setState](https://reactjs.org/docs/react-component.html#setstate). The method only touches the keys that have been defined in the object passed to the method as an argument. The value for the key <i>current</i> remains unchanged. -->
Http 请求的回调函数使用方法[setState](https://reactjs.org/docs/react-component.html#setState)更新组件状态。 该方法只接触在作为参数传递给该方法的对象中定义的键。 键<i>current</i> 的值保持不变。 



<!-- Calling the method setState always trigger the rerender of the Class Component, i.e. calling the method _render_. -->
调用 setState 方法总是触发类组件的重新运行，即调用方法 render。



<!-- We'll finish off the component with the ability to change the shown anecdote. The following is the code for the entire component with the addition highlighted: -->
我们将用更改所显示的八卦的能力来结束组件。 下面是整个组件的代码，并突出显示了添加部分:

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



<!-- For comparison here is the same application as a Functional component: -->
为了便于比较，这里的应用与一个函数组件是相同的:

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

<!-- In the case of our example the differences were minor. The biggest difference between Functional components and Class components is mainly that the state of a Class component is a single object, and that the state is updated using the method _setState_, while in Functional components the state can consist of multiple different variables, with all of them having their own update function. -->
在我们的例子中，差异是微小的。 函数式组件和类组件最大的区别在于，类组件的状态是一个单独的对象，并且使用 setState 方法更新状态，而在函数式组件中，状态可以由多个不同的变量组成，所有这些变量都有自己的更新函数。

<!-- In some more advanced use cases the effect hook offers a considerably better mechanism for controlling side effects compared to the lifecycle-methods of Class Components. -->
在一些更高级的用例中，与类组件的生命周期方法相比，effect hook 提供了更好的控制副作用的机制。

<!-- A notable benefit of using Functional components is not having to deal with the self referencing _this_-reference of the Javascript class. -->
**使用 函数式组件的一个显著好处是不必处理 Javascript 类的 _this_ 引用的自引用。**

<!-- In my opinion, and the opinion of many others, Class Components offer basically no benefits over Functional components enhanced with hooks, with the exception of the so-called [error boundary](https://reactjs.org/docs/error-boundaries.html) mechanism, which currently (16th February 2020) isn't yet in use by functional components. -->
在我看来，以及其他许多人的看法中，类组件基本上没有比通过Hook增强的函数组件提供任何好处，除了所谓的[错误边界](https://reactjs.org/docs/error-boundaries.html)机制，它目前(2020年2月16日)还没有被函数组件使用。

<!-- When writing fresh code [there is no rational reason to use Class Components](https://reactjs.org/docs/hooks-faq.html#should-i-use-hooks-classes-or-a-mix-of-both) if the project is using React with a version number 16.8 or greater. On the other hand, [there is currently no need to rewrite all old React code](https://reactjs.org/docs/hooks-faq.html#do-i-need-to-rewrite-all-my-class-components) as Functional components. -->
在编写新代码时，如果项目使用的是 React 16.8或更高，那么[没有理由使用类组件](https://reactjs.org/docs/hooks-faq.html#should-i-use-hooks-classes-or-a-mix-of-both)。 另一方面，[目前没有必要重写所有旧的React代码](https://reactjs.org/docs/hooks-faq.html#do-i-need-to-rewrite-all-my-class-components)作为函数组件。

### Organization of code in React application
【在 React application 中代码的组织】
<!-- In most applications we followed the principle, by which components were placed in the directory <i>components</i>, reducers were placed in the directory <i>reducers</i>, and the code responsible for communicating with the server was placed in the directory <i>services</i>. This way of organizing fits a smaller application just fine, but as the amount of components increase, better solutions are needed. There is no one correct way to organize a project. The article [The 100% correct way to structure a React app (or why there’s no such thing)](https://hackernoon.com/the-100-correct-way-to-structure-a-react-app-or-why-theres-no-such-thing-3ede534ef1ed) provides some perspective on the issue. -->
在大多数应用中，我们遵循的原则是，将组件放在目录<i>components</i> 中，reducer程序放在目录<i>reducers</i> 中，负责与服务器通信的代码放在目录<i>services</i> 中。 这种组织方式适合于较小的应用，但是随着组件数量的增加，需要更好的解决方案。 组织一个项目没有一种正确的方法。 这篇文章[100% 正确的方式构建一个 React 应用(或为什么根本没这回事)](https://hackernoon.com/The-100-correct-way-to-structure-a-React-app-or-why-theres-no-such-thing-3ede534ef1ed)提供了一些关于这个问题的观点。


### Frontend and backend in the same repository
【前端和后端在同一个仓库】
<!-- During the course we have created the frontend and backend into separate repositories. This is a very typical approach. However, we did the deployment by [copying](/zh/part3/把应用部署到网上#serving-static-files-from-the-backend) the bundled frontend code into the backend repository. A possibly better approach would have been to deploy the frontend code separately. Especially with applications created using create-react-app it is very straightforward thanks to the included [buildpack](https://github.com/mars/create-react-app-buildpack). -->
在这个过程中，我们已经将前端和后端创建到单独的存储库中。 这是一个非常典型的方法。 然而，我们通过[复制](/zh/part3/把应用部署到网上#serving-static-files-from-the-backend)将绑定的前端代码复制到后端存储库中来完成部署。 一个可能更好的方法是单独部署前端代码。 特别是使用 create-react-app 创建的应用，它非常简单，这要归功于内置的[buildpack](https://github.com/mars/create-react-app-buildpack)。

<!-- Sometimes there may be a situation where the entire application is to be put into a single repository. In this case a common approach is to put the <i>package.json</i> and <i>webpack.config.js</i> in the root directory, as well as place the frontend and backend code into their own directories, e.g. <i>client</i> and <i>server</i>. -->
有时可能会出现将整个应用放入单个存储库的情况。 在这种情况下，一种常见的方法是将<i>package.json</i> 和<i>webpack.config.js</i> 放在根目录中，并将前端和后端代码放到它们自己的目录中，例如<i>client</i> 和<i>server</i>。

<!-- [This repository]((https://github.com/fullstack-hy2020/create-app)) provides one possible starting point for the organization of "single-repository-code". -->
[此存储库](https://github.com/fullstack-hy2020/create-app)为“单一存储库代码”的组织提供了一个可能的起点。

### Changes on the server
【服务器上的更改】

<!-- If there are changes in the state on the server, e.g. when new blogs are added by other users to the bloglist service, the React-frontend we implemented during this course will not notice these changes until the page reloads. A similar situation arises when the frontend triggers a time-consuming computation in the backend. How do we reflect the results of the computation to the frontend? -->
如果服务器上的状态发生了变化，例如当其他用户将新博客添加到博客列表服务时，我们在本课程中实现的 React-frontend 将不会注意到这些变化，直到页面重新加载。 当前端触发后端中耗时的计算时，也会出现类似的情况。 如何将计算结果反映到前端？

<!-- One way is to execute [polling](<https://en.wikipedia.org/wiki/Polling_(computer_science)>) on the frontend, meaning repeated requests to the backend API e.g. using the [setInterval](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval)-command. -->
一种方法是在前端执行[轮询](https://en.wikipedia.org/wiki/polling_(computer_science)) ，这意味着重复对后端 API 的请求，例如使用[setInterval](https://developer.mozilla.org/en-us/docs/web/API/windoworworkerglobalscope/setInterval)-命令。



<!-- A more sophisticated way is to use [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API), using which it is possible to establish a two-way communication channel between the browser and the server. In this case the browser does not need to poll the backend, and instead only has to define callback functions for situations when the server sends data about updating state using a WebSocket. -->
一个更复杂的方法是使用[websocket](https://developer.mozilla.org/en-us/docs/web/api/websockets_api) ，利用它可以在浏览器和服务器之间建立一个双向通信通道。 在这种情况下，浏览器不需要轮询后端，而只需要为服务器使用 WebSocket 发送关于更新状态的数据的情况定义回调函数。

<!-- WebSockets are an API provided by the browser, which is not yet fully supported on all browsers: -->
WebSockets 是由浏览器提供的 API，目前还不是所有的浏览器都支持它: 

![](../../images/7/31ea.png)

<!-- Instead of directly using the WebSocket API it is advisable to use the [Socket.io](https://socket.io/)-library, which provides various <i>fallback</i>-options in case the browser does not have the full support for WebSockets.  -->
与直接使用 WebSocket API 不同，建议使用[Socket.io](https://Socket.io/)-library，该库提供各种<i>fallback</i>-options，以防浏览器不完全支持 WebSocket。

<!-- In [第8章](/em/part8) our topic is GraphQL that provices a nice mechanism for notifying clients when there are changes in the backend data. -->
在[第8章](/zh/part8)中，我们的议题是 GraphQL，它为后端数据发生更改时通知客户端提供了一个很好的机制。

### Virtual DOM
【虚拟 DOM】

<!-- The concept of the Virtual DOM often comes up when discussing React. What is it all about? As mentioned in [第0章](/zh/part0/web_应用的基础设施#document-object-model-or-dom) browsers provide a [DOM API](https://developer.mozilla.org/fi/docs/DOM), using which the JavaScript running in the browser can modify the elements defining the appearance of the page. -->
在讨论 React 时，经常会提到虚拟 DOM 的概念。 这到底是怎么回事？ 正如在[第0章](/zh/part0/web_应用的基础设施#document-object-model-or-dom)中提到的那样，浏览器提供了一个[DOM API](https://developer.mozilla.org/fi/docs/DOM) ，浏览器中运行的 JavaScript 可以修改定义页面外观的元素。

<!-- When a software developer uses React they rarely or never directly manipulate the DOM. The function defining the React component returns a set of [React-elements](https://reactjs.org/docs/glossary.html#elements). Although some of the elements look like normal HTML-elements -->
当软件开发人员使用 React 时，他们很少或从未直接操作 DOM。 定义 React 组件的函数返回一组[React-elements](https://reactjs.org/docs/glossary.html#elements)。 虽然有些元素看起来像普通的 html 元素。

```js
const element = <h1>Hello, world</h1>
```

<!-- they are also just JavaScript based React-elements at their core. -->
它们的核心也只是基于 JavaScript 的 React-elements。

<!-- The React-elements defining the appearance of the components of the application make up the [Virtual DOM](https://reactjs.org/docs/faq-internals.html#what-is-the-virtual-dom), which is stored in system memory during runtime. -->
定义应用组件外观的 React-elements 组成了[Virtual DOM](https://reactjs.org/docs/faq-internals.html#what-is-The-Virtual-DOM) ，它在运行时存储在系统内存中。

<!-- With the help of the [ReactDOM](https://reactjs.org/docs/react-dom.html)-library the virtual DOM defined by the components is rendered to a real DOM that can be shown by the browser using the DOM API: -->
在[ReactDOM](ReactDOM)库的帮助下，这些组件定义的虚拟 DOM 被渲染成一个真实的 DOM，浏览器可以使用 DOM API 显示这个 DOM:

```js
ReactDOM.render(
  <App />,
  document.getElementById('root')
)
```

<!-- When the state of the application changes a <i>new virtual DOM</i> gets defined by the components. React has the previous version of the virtual DOM in memory and instead of directly rendering the new virtual DOM using the DOM API React computes the optimal way to update the DOM (remove, add or modify elements in the DOM) such that the DOM reflects the new virtual DOM. -->
当应用的状态发生更改时，组件将定义一个<i>新的虚拟 DOM</i>。 React 在内存中使用以前版本的虚拟 DOM，而不是使用 DOM API 直接渲染新的虚拟 DOM React 计算更新 DOM 的最佳方式(删除、添加或修改 DOM 中的元素) ，使 DOM 反映新的虚拟 DOM。

### On the role of React in applications
【React在应用中的作用】
<!-- In the material we may not have put enough emphasis on the fact that React is primarily a library for managing the creation of views for an application. If we look at the traditional [Model View Controller](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) -pattern, then the domain of React would be <i>View</i>. React has a more narrow area of application than e.g. [Angular](https://angular.io/), which is an all-encompassing Frontend MVC-framework. Therefore React is not being called a <i>framework</i>, but a <i>library</i>. -->
在这些材料中，我们可能没有充分强调 React 主要是一个管理应用视图创建的库。 如果我们看看传统的[模型视图控制器MVC](https://en.wikipedia.org/wiki/Model%e2%80%93view%e2%80%93controller)-模式，那么 React 的领域将是<i>View</i>. React 的应用范围比较狭窄，例如[Angular](https://Angular.io/) ，它是一个包含所有 Frontend MVN 框架的应用。因此 React 不被称为<i>framework</i>，而是一个库

<!-- In small applications data handled by the application is being stored in the state of the React-components, so in this scenario the state of the components can be thought of as <i>models</i> of an MVC-architecture. -->
在小型应用中，应用处理的数据存储在 React-components 的状态中，因此在这个场景中，组件的状态可以被认为是 mvc 架构的<i>模型</i>。

<!-- However, MVC-architecture is not usually mentioned when talking about React-applications. Furthermore, if we are using Redux, then the applications follow the [Flux](https://facebook.github.io/flux/docs/in-depth-overview.html#content)-architecture and the role of React is even more focused on creating the views. The business logic of the application is handled using the Redux state and action creators. If were using [redux thunk](/zh/part6/在_redux应用中与后端通信#asynchronous-actions-and-redux-thunk) familiar from part 6, then the business logic can be almost completely separated from the React code. -->
但是，在讨论 React-applications 时通常不会提到 mvc 架构。 此外，如果我们正在使用 Redux，那么应用遵循[Flux](https://facebook.github.io/Flux/docs/in-depth-overview)-架构，React 的角色更专注于创建视图。 应用的业务逻辑使用 Redux 状态和操作创建者来处理。 如果在 redux 应用中使用第6章熟悉的[redux thunk](/zh/part6/在_redux应用中与后端通信#asynchronous-actions-and-redux-thunk)，那么业务逻辑几乎可以与 React 代码完全分离。

<!-- Because both React and [Flux](https://facebook.github.io/flux/docs/in-depth-overview.html#content) were created at Facebook one could say that using React only as a UI library is the intended use case. Following the Flux-architecture adds some overhead to the application, and if were talking about a small application or prototype it might be a good idea to use React "wrong", since [over-engineering](https://en.wikipedia.org/wiki/Overengineering) rarely yields an optimal result. -->
因为 React 和[Flux](https://Facebook.github.io/Flux/docs/in-depth-overview)都是在 Facebook 上创建的，可以说只把 React 用作 UI 库是预期的用例。 遵循 flux 架构会给应用增加一些开销，如果我们讨论的是一个小型应用或原型，那么“错误地”使用 React可能是一个好主意，因为[过度设计](https://en.wikipedia.org/wiki/overengineering)很少会产生最佳结果。



<!-- As I mentioned at the end of [第6章](/osa6/connect#redux-ja-komponenttien-tila), the React [Context-api](https://reactjs.org/docs/context.html) offers one alternative solution for centralized state menagement without the need for third party libraries such as redux. You can read more about this  [here](https://www.simplethread.com/cant-replace-redux-with-hooks/) and [here](https://hswolff.com/blog/how-to-usecontext-with-usereducer/). -->
正如我在[第6章](/zh/part6/connect方法#redux-and-the-component-state)的结尾所提到的，React [Context-api](https://reactjs.org/docs/context.html)为集中式状态管理提供了一种替代方案，无需 redux 之类的第三方库。 你可以在[这个网站](https://www.simplethread.com/cant-replace-redux-with-hooks/)  和 [这个网站](https://hswolff.com/blog/how-to-usecontext-with-usereducer/) 阅读更多关于这个主题的内容。

### React/node-application security
<!-- So far during the course we have not touched on information security at all. We do not have much time this for now either, but fortunately the department has a MOOC-course [Securing Software](https://cybersecuritybase.github.io/securing/) for this important topic. -->
到目前为止，我们还没有触及安全。 我们现在也没有太多的时间，但是幸运的是系里有一个 MOOC-course [Securing Software](https://cybersecuritybase.mooc.fi/module-2.1)来处理这个重要的话题。

<!-- We will, however, take a look at some things specific to this course. -->
不过，我们还是要看一下这门课程的一些具体内容。

<!-- The Open Web Application Security Project, otherwise known as [OWASP](https://www.owasp.org), publishes an annual list of the most common security risks in Web-applications. The most recent list can be found [here](https://owasp.org/www-project-top-ten/). The same risks can be found from one year to another. -->
开放 Web 应用安全项目，又称为[OWASP](https://www.OWASP.org) ，每年发布一份 Web 应用中最常见安全风险的清单。 最近的名单可以在这里找到( https://owasp.org/www-project-top-ten/)。 每年都可以发现同样的风险。

<!-- At the top of the list we find <i>injection</i>, which means that e.g. text sent using a form in an application is interpreted completely differently than the software developer had intended. The most famous type of injection is probably the [SQL-injection](https://stackoverflow.com/questions/332365/how-does-the-sql-injection-from-the-bobby-tables-xkcd-comic-work).  -->
在列表的顶部，我们发现<i>injection</i>，这意味着例如，在应用中使用表单发送的文本被解释为与软件开发人员预期的完全不同。 最著名的注射类型可能是[sql 注入](https://stackoverflow.com/questions/332365/how-does-The-SQL-injection-from-The-bobby-tables-xkcd-comic-work)。



<!-- For example, if the following SQL-query would be executed in a vulnerable application: -->
例如，如果下面的 sql 查询将在一个易受攻击的应用中执行:

```js
let query = "SELECT * FROM Users WHERE name = '" + userName + "';"
```



<!-- Now let's assume that a malicious user <i>Arto Hellas</i> would define their name as -->
现在让我们假设一个恶意用户<i>Arto Hellas</i> 将它们的名称定义为

<pre>
Arto Hell-as'; DROP TABLE Users; --
</pre>



<!-- so that the name would contain a single quote <code>'</code>, which is the beginning- and end-character of a SQL-string. As a result of this two SQL-operations would be executed, the second of which would  destroy the database table <i>Users</i> -->
这样名称将包含一个单引号 <code>'</code>，它是一个 sql 字符串的开头和结尾字符。 作为执行这两个 sql 操作的结果，第二个操作将销毁数据库表<i>Users</i>

```sql
SELECT * FROM Users WHERE name = 'Arto Hell-as'; DROP TABLE Users; --'
```



<!-- SQL-injections are prevented by [sanitizing](https://security.stackexchange.com/questions/172297/sanitizing-input-for-parameterized-queries) the input, which would entail checking that the parameters of the query do not contain any forbidden characters, in this case single quotes. If forbidden characters are found they are replaced with safe alternatives by [escaping](https://en.wikipedia.org/wiki/Escape_character#JavaScript) them. -->
Sql-injections 可以通过[sanitizing](https://security.stackexchange.com/questions/172297/sanitizing-input-for-parameterized-queries)输入来阻止，这将需要检查查询的参数不包含任何禁止的字符，在这里是单引号。 如果发现被禁止的字符，它们将被替换为安全的替代字符，即[逃逸](https://en.wikipedia.org/wiki/escape_character#javascript)字符。 



<!-- Injection attacks are also possible in NoSQL-databases. However, mongoose prevents them by [sanitizing](https://zanon.io/posts/nosql-injection-in-mongodb) the queries. More on the topic can be found e.g. [here](https://blog.websecurify.com/2014/08/hacking-nodejs-and-mongodb.html). -->
注射攻击在 NoSQL-databases 也是可行的。 然而，mongoose 通过[sanitizing](https://zanon.io/posts/nosql-injection-in-mongodb)查询来阻止它们。 你可以在[这里](https://blog.websecurify.com/2014/08/hacking-nodejs-and-mongodb.html)找到更多关于这个话题的讨论。



<!-- <i>Cross-site scripting (XSS)</i> is an attack where it is possible to inject malicious JavaScript code into a legitimate web-application. The malicious code would then be executed in the browser of the victim. If we try to inject the following into e.g. the notes application -->
<i>跨网站脚本攻击(XSS)</i> 是一种可以将恶意 JavaScript 代码注入合法 web 应用的攻击。 恶意程式码会在受害者的浏览器中执行。 如果我们尝试将如下内容注入 notes 应用

```html
<script>
  alert('Evil XSS attack')
</script>
```

<!-- the code is not executed, but is only rendered as 'text' on the page: -->
代码不会被执行，只是在页面上渲染为文本:

![](../../images/7/32e.png)

<!-- since React [takes care of sanitizing data in variables](https://reactjs.org/docs/introducing-jsx.html#jsx-prevents-injection-attacks). Some versions of React [have been vulnerable](https://medium.com/dailyjs/exploiting-script-injection-flaws-in-reactjs-883fb1fe36c1) to XSS-attacks. The security-holes have of course been patched, but there is no guarantee that there could be more. -->
因为 React [处理变量中的消毒数据](https://reactjs.org/docs/introducing-jsx.html#jsx-prevents-injection-attacks)。 一些版本的 React [已经很容易受到 xss 攻击的攻击](https://medium.com/dailyjs/exploiting-script-injection-flaws-in-reactjs-883fb1fe36c1)。 当然，安全漏洞已经得到修补，但不能保证还会有更多漏洞。

<!-- One needs to remain vigilant when using libraries; if there are security updates to those libraries, it is advisable to update those libraries in one's own applications. Security updates for Express are found in the [library's documentation](https://expressjs.com/en/advanced/security-updates.html) and the ones for Node are found in [this blog](https://nodejs.org/en/blog/). -->
使用库时需要保持警惕; 如果这些库有安全更新，最好在自己的应用中更新这些库。 Express 的安全更新可以在[库文档](https://expressjs.com/en/advanced/security-updates.html)中找到，Node 的安全更新可以在[本博客](https://nodejs.org/en/blog/)中找到。

<!-- You can check how up to date your dependencies are using the command -->
您可以使用该命令检查依赖项的最新情况

```bash
npm outdated --depth 0
```

<!-- Last year's model answer for the exercises in part 4 already have quite a few outdated dependencies: -->
去年对于第四章节练习的模型答案已经有不少过时的依赖:

![](../../images/7/33ea.png)

<!-- The dependencies can be brought up to date by updating the file <i>package.json</i> and running the command _npm install_. However, old versions of the dependencies are not necessarily a security risk.  -->
可以通过更新文件<i>package.json</i> 并运行命令 npm install 来更新依赖关系。 但是，依赖关系的旧版本不一定是安全风险。



<!-- The npm [audit](https://docs.npmjs.com/cli/audit) command can be used to check the security of debendencies. It compares the version numbers of the debendencies in your application to a list of the version numbers of debendencies containing known security threats in a centralized error database.  -->
Npm [audit](https://docs.npmjs.com/cli/audit)命令可用于检查债务的安全性。 它将应用中的依赖的版本号与集中式错误数据库中包含已知安全威胁的依赖的版本号列表进行比较。 



<!-- Running _npm audit_ on an exercise from part 4 of last year's course print a long list of complaints and suggested fixes.  -->
对去年课程第四章节的练习进行 npm 审计时，打印一个长长的产生警告和修改建议列表。
<!-- Below is a part of the report: -->
下面是报告的一部分:

```js
$ bloglist-backend npm audit

                       === npm audit security report ===

# Run  npm install --save-dev jest@25.1.0  to resolve 62 vulnerabilities
SEMVER WARNING: Recommended action is a potentially breaking change
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ Low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest [dev]                                                   │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-config > babel-jest >                 │
│               │ babel-plugin-istanbul > test-exclude > micromatch > braces   │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://npmjs.com/advisories/786                             │
└───────────────┴──────────────────────────────────────────────────────────────┘


┌───────────────┬──────────────────────────────────────────────────────────────┐
│ Low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest [dev]                                                   │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-runner > jest-config > babel-jest >   │
│               │ babel-plugin-istanbul > test-exclude > micromatch > braces   │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://npmjs.com/advisories/786                             │
└───────────────┴──────────────────────────────────────────────────────────────┘


┌───────────────┬──────────────────────────────────────────────────────────────┐
│ Low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest [dev]                                                   │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-runner > jest-runtime > jest-config > │
│               │ babel-jest > babel-plugin-istanbul > test-exclude >          │
│               │ micromatch > braces                                          │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://npmjs.com/advisories/786                             │
└───────────────┴──────────────────────────────────────────────────────────────┘

...


found 416 vulnerabilities (65 low, 2 moderate, 348 high, 1 critical) in 20047 scanned packages
  run `npm audit fix` to fix 354 of them.
  62 vulnerabilities require semver-major dependency updates.
```



<!-- After only one year the code is full of small security threats. Luckily there is only 1 critical threat.  -->
仅仅一年之后，代码就充满了小的安全威胁。幸运的是，只有一个关键的威胁。
<!-- Let's run _npm audit fix_ as the raport suggests: -->
让我们运行 npm 审计修复程序，就像报告中建议的那样:

```js
$ bloglist-backend npm audit fix

+ mongoose@5.9.1
added 19 packages from 8 contributors, removed 8 packages and updated 15 packages in 7.325s
fixed 354 of 416 vulnerabilities in 20047 scanned packages
  1 package update for 62 vulns involved breaking changes
  (use `npm audit fix --force` to install breaking changes; or refer to `npm audit` for steps to fix these manually)
```



<!--62 threats remain because by default _audit fix_  does not update debendencies if their <i>major</i> version number has increased.--> 
62个威胁仍然存在，因为缺省情况下，如果它们的<i>主</i> 版本号增加，审计修复程序不会更新依赖。
<!-- Updating these debendencies could lead to the whole application breaking down. The remaining threats are caused by the testing debendency jest. Our application has the version 23.6.0 when the secure version is 25.0.1.  -->
更新这些依赖可能导致整个应用崩溃。 剩下的威胁是由试探性的jest造成的。 安全版本为25.0.1，我们的应用是23.6.0版本。
<!-- As jest is a development debendency the threat is actually nonexistent, but let's update it just to be safe: -->
因为jest是一个开发的依赖，所以威胁实际上是不存在的，但是为了安全起见，让我们更新一下:

```js
npm install --save-dev jest@25.1.0 
```



<!-- After the update the situation looks good -->
更新后情况看起来不错

```js
 $ blogs-backend npm audit

                       === npm audit security report ===

found 0 vulnerabilities
 in 1204443 scanned packages
```

<!-- One of the threats mentioned in the list from OWASP is <i>Broken Authentication</i> and the related <i>Broken Access Control</i>. The token based authentication we have been using is fairly robust, if the application is being used on the traffic-encrypting HTTPS-protocol. When implementing access control one should e.g. remember to not only check a user's identity in the browser but also on the server. Bad security would be to prevent some actions to be taken only by hiding the execution options in the code of the browser. -->
在 OWASP 列表中提到的威胁之一是<i>Broken Authentication</i> 和相关的<i>Broken Access Control</i>。 如果应用用于流量加密的 https 协议，那么我们使用的基于令牌的身份验证是相当健壮的。 在实施访问控制时，不仅要检查浏览器中的用户身份，还要检查服务器上的用户身份。 糟糕的安全性是仅通过在浏览器代码中隐藏执行选项来阻止某些操作。

<!-- On Mozilla's MDN there is a very good [Website security -guide](https://developer.mozilla.org/en-US/docs/Learn/Server-side/First_steps/Website_security), which brings up this very important topic: -->
在 Mozilla 的 MDN 上有一个非常好的网站安全指南，这个  [Website security -guide](https://developer.mozilla.org/en-US/docs/Learn/Server-side/First_steps/Website_security),  提出了一个非常重要的话题:

![](../../images/7/34.png)

<!-- The documentation for Express includes a section on security: [Production Best Practices: Security](https://expressjs.com/en/advanced/best-practice-security.html), which is worth a read through. It is also recommended to add a library called [Helmet](https://helmetjs.github.io/) to the backend. It includes a set of middlewares that eliminate some security vulnerabilities in Express applications. -->
Express 的文档包括一个关于安全性的部分: [生产最佳实践: 安全性](https://expressjs.com/en/advanced/Best-practice-Security.html) ，这个部分值得一读。 还建议在后端添加一个名为[Helmet](https://helmetjs.github.io/)的库。 它包括一组中间件，用于消除 Express 应用中的一些安全漏洞。 

<!-- Using the ESlint [security-plugin](https://github.com/nodesecurity/eslint-plugin-security) is also worth doing. -->
使用 ESlint [安全插件](https://github.com/nodesecurity/ESlint-plugin-security 安全插件)也是值得的。

### Current trends
<!-- Finally, let's take a look at some technology of tomorrow (or actually already today), and directions Web development is heading. -->
最后，让我们来看看未来的一些技术(或者实际上已经存在的技术) ，以及 Web 开发的方向。

#### Typed versions of JavaScript
<!-- Sometimes the [dynamic typing](https://developer.mozilla.org/en-US/docs/Glossary/Dynamic_typing) of JavaScript variables creates annoying bugs. In part 5 we talked briefly about [PropTypes](/zh/part5/props_children_与_proptypes#prop-types): a mechanism which enables one to enforce type checking for props passed to React-components. -->
有时候 JavaScript 变量的[动态类型](https://developer.mozilla.org/en-us/docs/glossary/dynamic_typing)会产生令人讨厌的 bug。 在第5章节中，我们简要地讨论了[PropTypes](/zh/part5/props_children_与_proptypes#prop-types) : 这是一种机制，可以对传递给 React-components 的props进行类型检查。

<!-- Lately there has been a notable uplift in the interest in [static type checking](https://en.wikipedia.org/wiki/Type_system#Static_type_checking). At the moment the most popular typed version of Javascript is [Typescript](https://www.typescriptlang.org/) which has been developed by Microsoft. Typescript is covered in [part 9](/en/part9). -->
最近，人们对静态类型检查 [static type checking](https://en.wikipedia.org/wiki/Type_system#Static_type_checking)的兴趣有了明显的提升，这种兴趣可以追溯到20世纪90年代。 目前最流行的 Javascript 类型版本是由 Microsoft 开发的[Typescript](https://www.typescriptlang.org/)。Typesscript 的内容将在[第9章节](/zh/part9)讨论。

#### Server side rendering, isomorphic applications and universal code
【服务器端渲染，同构应用和通用代码】
<!-- The browser is not the only domain where components defined using React can be rendered. The rendering can also be done on the [server](https://reactjs.org/docs/react-dom-server.html). This kind of approach is increasingly being used, such that when accessing the application for the first time the server serves a pre-rendered page made with React. From here onwards the operation of the application continues as usual, meaning the browser executes React, which manipulates the DOM shown by the browser. The rendering that is done on the server goes by the name: <i>server side rendering</i>. -->
浏览器并不是唯一可以渲染使用 React 定义的组件的域。 渲染也可以在[服务器](https://reactjs.org/docs/react-dom-server.html)上完成。 这种方法正在越来越多地被使用，例如，当服务器第一次访问应用时，服务器使用 React 生成的预渲染页面。 从这里开始，应用的操作继续像往常一样进行，这意味着浏览器执行 React，它操纵浏览器显示的 DOM。 在服务器上完成的渲染命名为:<i>server side rendering</i>。

<!-- One motivation for server side rendering is Search Engine Optimization (SEO). Search engines have traditionally been very bad at recognizing JavaScript rendered content, however, the tide might be turning, e.g. take a look at [this](https://www.andrewhfarmer.com/react-seo/) and [this](https://medium.freecodecamp.org/seo-vs-react-is-it-neccessary-to-render-react-pages-in-the-backend-74ce5015c0c9). -->
服务器端渲染的一个动机是搜索引擎优化。 搜索引擎一直以来都不擅长识别 JavaScript 渲染的内容，然而，这种趋势可能正在发生转变，例如，看看[这个](https://www.javascriptstuff.com/react-seo/)和[这个](https://medium.freecodecamp.org/seo-vs-react-is-it-neccessary-to-render-react-pages-in-the-backend-74ce5015c0c9)。

<!-- Of course, server side rendering is not anything specific to React or even JavaScript. Using the same programming language throughout the stack in theory simplifies the execution of the concept, because the same code can be run on both the front- and backend. -->
当然，服务器端渲染并不是 React 或者甚至是 JavaScript 所特有的。 理论上，在整个堆栈中使用相同的编程语言可以简化概念的执行，因为可以在前端和后端运行相同的代码。

<!-- Along with server side rendering there has been talk of so-called <i>isomorphic applications</i> and <i>universal code</i>, although there has been some debate about their definitions. According to some [definitions](https://medium.com/@ghengeveld/isomorphism-vs-universal-javascript-4b47fb481beb) an isomorphic web application is one that performs rendering on both the front- and backend. On the other hand, universal code is code that can be executed in most environments, meaning both the frontend and the backend. -->
除了服务器端渲染之外，还有所谓的<i>同构应用</i> 和<i>通用代码</i> 的讨论，尽管对它们的定义还存在一些争议。 根据一些[定义](https://medium.com/@ghengeveld/isomorphism-vs-universal-javascript-4b47fb481beb)同构的 web 应用是同时在前端和后端执行渲染的应用。 另一方面，通用代码是可以在大多数环境中执行的代码，即前端和后端。

<!-- React and Node provide a desirable option for implementing an isomorphic application as universal code. -->
React 和 Node 为将同构应用实现为通用代码提供了一个理想的选择。 

<!-- Writing universal code directly using React is currently still pretty cumbersome. Lately a library called [Next.js](https://github.com/zeit/next.js/), which is implemented on top of React, has garnered much attention and is a good option for making universal applications. -->
直接使用 React 编写通用代码目前仍然相当繁琐。 最近在 React 上实现了一个名为[Next.js](https://github.com/zeit/Next.js/)的库，这个库吸引了很多关注，是开发通用应用的一个很好的选择。

#### Progressive web apps
【渐进式网络应用】

<!-- Lately people have started using the term [progressive web app](https://developers.google.com/web/progressive-web-apps/) (PWA) launched by Google. -->
最近人们开始使用 Google 推出的术语[渐进式网络应用](https://developers.Google.com/web/progressive-web-apps/)(PWA)。

<!-- In short, we are talking about web-applications, working as well as possible on every platform taking advantage of the best parts of those platforms. The smaller screen of mobile devices must not hamper the usability of the application. PWAs should also work flawlessly in offline-mode or with a slow internet connection. On mobile devices they must be installable just like any other application. All the network traffic in a PWA should be encrypted. -->
简而言之，我们讨论的是 web 应用，尽可能在每个平台上利用这些平台中最好的部分。 移动设备的小屏幕不能妨碍应用的可用性。 PWAs 也应该在脱机模式下或缓慢的互联网连接下完美地工作。 在移动设备上，它们必须像其他应用一样可以安装。 PWA 中的所有网络流量都应该加密。

<!-- Applications created using create-react-app are [progressive](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#making-a-progressive-web-app) by default. If the application uses data from a server, making it progressive takes work. The offline functionality is usually implemented with the help of [service workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API). -->
使用 create-react-app 创建的应用在默认情况下是[渐进的](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/readme.md#making-a-progressive-web-app)。 如果应用使用来自服务器的数据，则使其逐步进行需要工作。 离线功能通常是在[service workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)的帮助下实现的。

#### Microservice architecture
【微服务架构】

<!-- During this course we have only scratched the surface of the server end of things. In our applications we had a <i>monolithic</i> backend, meaning one application making up a whole and running on a single server, serving only a few API-endpoints. -->
在本课程中，我们仅仅触及了服务器端的皮毛。 在我们的应用中，我们有一个<i>单体monolithic</i> 后端，这意味着一个应用组成一个整体并在单个服务器上运行，只服务于几个 api 端点。

<!-- As the application grows the monolithic backend approach starts turning problematic both in terms of performance and maintainability. -->
随着应用的增长，整体后端方法开始在性能和可维护性方面出现问题。

<!-- A [microservice architecture](https://martinfowler.com/articles/microservices.html) (microservices) is a way of composing the backend of an application from many separate, independent services, which communicate with each other over the network. An individual microservice's purpose is to take care of a particular logical functional whole. In a pure microservice architecture the services do not use a shared database. -->
[微服务体系结构](https://martinfowler.com/articles/microservices.html)(microservices)是一种将应用的后端与许多独立的服务组合在一起的方法，这些服务通过网络相互通信。 单独的微服务的目的是照顾一个特定的逻辑功能整体。 在纯微服务体系结构中，服务不使用共享数据库。

<!-- For example, the bloglist application could consist of two services: one handling user and another taking care of the blogs. The responsibility of the user service would be user registration and user authentication, while the blog service would take care of operations related to the blogs. -->
例如，bloglist 应用可以由两个服务组成: 一个处理用户，另一个处理 blog。 用户服务的职责是用户注册和用户身份验证，而博客服务将负责与博客相关的操作。

<!-- The image below visualizes the difference between the structure of an application based on a microservice architecture and one based on a more traditional monolithic structure: -->
下面的图片显示了基于微服务架构的应用和基于更传统单体结构的应用的结构差异:

![](../../images/7/36.png)

<!-- The role of the frontend (enclosed by a square in the picture) does not differ much between the two models. There is often a so-called [API gateway](http://microservices.io/patterns/apigateway) between the microservices and the frontend, which provides an illusion of a more traditional "everything on the same server"-API. [Netflix](https://medium.com/netflix-techblog/optimizing-the-netflix-api-5c9ac715cf19), among others, uses this type of approach. -->
前面的角色(图片中被一个正方形包围)在两个模型之间没有太大的不同。 在微服务和前端之间通常有一个所谓的[API 网关](http://microservices.io/patterns/apigateway) ，它提供了一种更加传统的“同一服务器上的所有东西”的幻觉

<!-- Microservice architectures emerged and evolved for the needs of large internet-scale applications. The trend was set by Amazon far before the appearance of the term microservice. The critical starting point was an email sent to all employees in 2002 by Amazon CEO Jeff Bezos: -->
微服务体系结构的出现和发展是为了满足大规模互联网应用的需要。 这种趋势早在微服务这个词出现之前就由亚马逊设定了。 关键的起点是亚马逊 CEO 杰夫 · 贝索斯在2002年发给所有员工的一封电子邮件:

> All teams will henceforth expose their data and functionality through service interfaces.
今后，所有团队都将通过服务接口公开其数据和功能。
>
>Teams must communicate with each other through these interfaces.
> 团队必须通过这些接口彼此沟通。

>There will be no other form of inter-process communication allowed: no direct linking, no direct reads of another team’s data store, no shared-memory model, no back-doors whatsoever. The only communication allowed is via service interface calls over the network.
>不允许使用其他形式的行程间通讯: 不允许直接链接，不允许直接读取其他团队的数据存储，不允许共享内存模型，不允许任何后门。 只允许通过网络上的服务接口调用进行通信。
> 
<!-- It doesn’t matter what technology you use. -->
>你使用什么技术并不重要。
>
> All service interfaces, without exception, must be designed from the ground up to be externalize-able. That is to say, the team must plan and design to be able to expose the interface to developers in the outside world.
所有的服务接口，无一例外，必须从头开始设计，使其具有可外部化的特性。 也就是说，团队必须进行规划和设计，以便能够将界面暴露给外部世界的开发人员。
>
>
> No exceptions.
没有例外。
>
>Anyone who doesn’t do this will be fired. Thank you; have a nice day!
> 不这样做的人将被解雇。谢谢，祝你今天愉快！

<!-- Nowadays one of the biggest forerunners in the use of microservices is [Netflix](https://www.infoq.com/presentations/netflix-chaos-microservices). -->
如今，微服务使用的最大先驱之一是 [Netflix](https://www.infoq.com/presentations/Netflix-chaos-microservices)。

<!-- The use of microservices has steadily been gaining hype to be kind of a [silver bullet](https://en.wikipedia.org/wiki/No_Silver_Bullet) of today, which is being offered as a solution to almost every kind of problem. However, there are a number of challenges when it comes to applying a microservice architecture, and it might make sense to go [monolith first](https://martinfowler.com/bliki/MonolithFirst.html) by initially making a traditional all encompassing backend. Or maybe [not](https://martinfowler.com/articles/dont-start-monolith.html). There are a bunch of different opinions on the subject. Both links lead to Martin Fowler's site; as we can see, even the wise are not entirely sure which one of the right ways is more right. -->
微型服务的使用已经被大肆宣传成为当今的一种[银弹silver bullet](https://en.wikipedia.org/wiki/No_Silver_Bullet)，它被用来解决几乎所有的问题。 然而，在应用微服务体系结构时会遇到很多挑战，而且通过最初创建一个传统的包含所有内容的后端，首先使用[单体优先monolith first](https://martinfowler.com/bliki/MonolithFirst.html)可能是有意义的。 或者也许[不是](https://martinfowler.com/articles/dont-start-monolith.html)。 关于这个问题有很多不同的意见。 这两个链接都指向马丁 · 福勒的网站; 正如我们所看到的，即使是聪明人也不能完全确定哪一种正确的方式更正确。

<!-- Unfortunately, we cannot dive deeper into this important topic during this course. Even a cursory look at the topic would require at least 5 more weeks. -->
不幸的是，我们不能在本课程中更深入地探讨这个重要的议题。 即使只是粗略地看一下这个问题，也需要至少5个星期的时间。

#### Serverless
<!-- After the release of Amazon's [lambda](https://aws.amazon.com/lambda/)-service at the end of 2014 a new trend started to emerge in web-application development: [serverless](https://serverless.com/). -->
在2014年底 Amazon 发布了[lambda](https://aws.Amazon.com/lambda/)之后，web 应用开发中出现了一个新的趋势: [无服务器](https://serverless.com/)。

<!-- The main thing about lambda, and nowadays also Google's [Cloud functions](https://cloud.google.com/functions/) as well as [similar functionality in Azure](https://azure.microsoft.com/en-us/services/functions/), is that it enables <i>the execution of individual functions</i> in the cloud. Before, the smallest executable unit in the cloud was a single <i>process</i>, e.g. a runtime environment running a Node backend. -->
Lambda 的主要特点是，它支持在云中执行单个函数，如今 Google 的[Cloud函数](https://cloud.google.com/functions/)以及[Azure相似的函数](https://azure.microsoft.com/en-us/services/functions/)也是如此。 以前，云中最小的可执行单元是一个<i>进程</i>，例如一个运行 Node 后端的执行期函式库。 

<!-- E.g. Using Amazon's [API-gateway](https://aws.amazon.com/api-gateway/) it is possible to make serverless applications where the requests to the defined HTTP API get responses directly from cloud functions. Usually the functions already operate using stored data in the databases of the cloud service. -->
例如，使用 Amazon 的[API 网关](https://aws.Amazon.com/API-gateway/) ，可以制作无服务器的应用，其中对定义的 HTTP API 的请求可以直接从云函数中获得响应。 通常，这些函数已经使用云服务数据库中存储的数据进行操作。

<!-- Serverless is not about there not being a server in applications, but about how the server is defined. Software developer can shift their programming efforts to a higher level of abstraction as there is no longer a need to programmatically define the routing of HTTP-requests, database relations, etc., since the cloud infrastructure provides all of this. Cloud functions also lend themselves to creating well scaling system, e.g. Amazon's Lambda can execute a massive amount of cloud functions per second. All of this happens automatically through the infrastructure and there is no need to initiate new servers, etc. -->
无服务器并不是说应用中没有服务器，而是说服务器是如何定义的。 软件开发人员可以将他们的编程工作转移到更高的抽象级别，因为不再需要通过编程方式定义 http 请求的路由、数据库关系等，因为云基础设施提供了所有这些。 云函数也有助于创建良好的扩展系统，例如亚马逊的 Lambda 每秒可以执行大量的云函数。 所有这些都是通过基础设施自动完成的，不需要启动新的服务器等等。

### Useful libraries and interesting links
【有用的库和有趣的链接】

<!-- The JavaScript developer community has produced a large variety of useful libraries. If you are developing anything more substancial, it is worth it to check if existing solutions are already available.  -->
开发者社区已经产生了大量有用的库。 如果你正在开发更实质性的东西，那么检查一下现有的解决方案是否已经可用是值得的。
<!-- One good place to find libraries is https://applibslist.xyz/. -->
找到库的一个好地方是 https://applibslist.xyz/ 。
<!-- Below is listed some libraries recommended by trustworthy parties. -->
下面列出了一些可信任方推荐的库。



<!-- If your application has to handle complicated data [lodash](https://www.npmjs.com/package/lodash), which we recommended in [第4章](/osa4/sovelluksen_rakenne_ja_testauksen_alkeet#tehtavat-4-3-4-7), is a good library to use. If you prefer functional programming style, you might consider using [ramda](https://ramdajs.com/). -->
如果您的应用必须处理复杂的数据[lodash](https://www.npmjs.com/package/lodash) ，这是我们在[第4章](/zh/part4/从后端结构到测试入门#exercises-4-3-4-7)中推荐使用的一个很好的库。 如果您更喜欢函数式编程风格，您可以考虑使用[ramda](https://ramdajs.com/)。



<!-- If you are handling times and dates, [date-fns](https://github.com/date-fns/date-fns) offers good tools for that. -->
如果你正在处理时间和日期，[date-fns](https://github.com/date-fns/date-fns) 提供了很好的处理时间和日期的工具。



<!-- [Formik](https://www.npmjs.com/package/formik) and [redux-form](https://redux-form.com/8.3.0/) can be used to handle forms easier.  -->
[Formik](https://www.npmjs.com/package/Formik)和[redux-form](https://redux-form.com/8.3.0/)可以用来更容易地处理表单。
<!-- If your application displays graphs, there are multiple options to chose from. Both [recharts](http://recharts.org/en-US/) and [highcharts](https://github.com/highcharts/highcharts-react) are well recommended. -->
如果你的应用显示图表，你可以从多个选项中进行选择，推荐使用[recharts](http://recharts.org/en-US/)和[highcharts](https://github.com/highcharts/highcharts-react)。

<!-- The [immutable.js](https://github.com/facebook/immutable-js/)-library maintained by Facebook provides, as the name suggests, immutable implementations of some data structures. The library could be of use when using Redux, since as we [remember](/zh/part6/flux架构与_redux#pure-functions-immutable) from part 6: reducers must be pure functions, meaning they must not modify the store's state but instead have to replace it with a new one when a change occurs. Over the past year some of the popularity of Immutable.js has been taken over by [Immer](https://github.com/mweststrate/immer), which provides similar functionality but in a somewhat easier package. -->
由 Facebook 维护的[immutable.js](https://github.com/Facebook/immutable-js/)-library，顾名思义，提供了一些数据结构的不可变实现。 当我们使用 Redux 时，这个库可能是有用的，因为我们[记得](/zh/part6/flux架构与_redux#pure-functions-immutable) 来自第6章节: reducers 必须是纯函数，这意味着它们不能修改存储的状态，而是必须在发生变化时用一个新的状态替换它。 在过去的一年里，一些不可变的 js 的流行已经被[Immer](https://github.com/mweststrate/immer) 接管了，它提供了类似的功能，但是在一个相对简单的包中。

<!-- [Redux-saga](https://redux-saga.js.org/) provides an alternative way to make asynchronous actions for [redux thunk](/zh/part6/在_redux应用中与后端通信#asynchronous-actions-and-redux-thunk) familiar from part 6. Some embrace the hype and like it. I don't. -->
[Redux-saga](https://redux-saga.js.org/)提供了另一种方法，用于为[redux thunk](/zh/part6/在_redux应用中与后端通信#asynchronous-actions-and-redux-thunk)制作异步操作，类似于第6章节。 有些人欣然接受这种炒作，并且喜欢这种炒作。 我不这么认为。

<!-- For single page applications the gathering of analytics data on the interaction between the users and the page is [more challenging](https://developers.google.com/analytics/devguides/collection/analyticsjs/single-page-applications) than for traditional web-applications where the entire page is loaded. The [React Google Analytics](https://github.com/react-ga/react-ga) -library offers a solution. -->
对于单页应用来说，收集用户和页面交互的分析数据比传统的加载整个页面的网页应用 [更具有挑战性](https://developers.google.com/analytics/devguides/collection/analyticsjs/single-page-applications)。 [React Google Analytics](https://github.com/react-ga/react-ga)  数据库提供了一个解决方案。

<!-- You can take advantage of your React know-how when developing mobile applications using Facebook's extremely popular [React Native](https://facebook.github.io/react-native/) -library. -->
在使用 Facebook 非常流行的 [React Native](https://facebook.github.io/react-native/) 库开发移动应用时，你可以利用你的 React 知道如何开发。

<!-- When it comes to the tools used for the management and bundling of JavaScript projects the community has been very fickle. Best practices have changed rapidly (the years are approximations, nobody remembers that far back in the past): -->
当涉及到用于管理和捆绑 JavaScript 项目的工具时，社区变化很大。 最佳实践发生了迅速的变化(年份是近似值，没有人记得那么久以前) :

- 2011 [Bower](https://www.npmjs.com/package/bower)
- 2012 [Grunt](https://www.npmjs.com/package/grunt)
- 2013-14 [Gulp](https://www.npmjs.com/package/gulp)
- 2012-14 [Browserify](https://www.npmjs.com/package/browserify)
- 2015- [Webpack](https://www.npmjs.com/package/webpack)



<!-- Hipsters seem to have lost their interest in tool development after webpack started to dominate the markets. Few years ago [Parcel](https://parceljs.org) started to make the rounds marketing itself as simpe (which Webpack absolutely is not) and faster than Webpack. However after a promising start Parcel has not gathered any steam, and it's beginning to look like it will not be the end of Webpack.  -->
在 webpack 开始主导市场之后，赶时髦的人似乎对工具开发失去了兴趣。 几年前，[Parcel](https://parceljs.org)开始以简单(Webpack 绝对不是)和快于 Webpack 的方式推销自己。 然而，在一个有希望的开始后，Parcel 并没有聚集任何动力，而且它开始看起来将不会是 Webpack 的终结者。

<!-- Another notable mention is the [Rome](https://rome.tools/) library, which aspires to be an all-encompassing toolchain to unify linter, compiler, bundler, and more. It is currently under heavy development since the initial commit earlier this year on Feb 27, but the outlook sure seems promising. -->
另一个值得注意的是 [Rome](https://rome.tools/)  这个库，它想要将统一规范、编译打包等聚合到一条工具链中，并提供了些其他的特性。它自从今年早期的2月27号首次提交开始，目前一直处在繁重的开发阶段，不过前景是相当看好的。

<!-- The site <https://reactpatterns.com/> provides a concise list of best practices for React, some of which are already familiar from this course. Another similar list is [react bits](https://vasanthk.gitbooks.io/react-bits/). -->
网站 <https://reactpatterns.com/> 提供了一个简明的React最佳实践列表，其中一些已经在本课程中熟悉了。 另一个类似的列表是[react bits](https://vasanthk.gitbooks.io/react-bits/)。

<!-- [Reactiflux](https://www.reactiflux.com/) is a big chat community of React developers on Discord. It could be one possible place to get support after the course has concluded. For example numerous libraries have their own channels. -->
[Reactiflux](https://www.reactiflux.com/)  一个很大的React开发者不和谐的聊天社区。 在课程结束后，它可能是一个可能的获得支持的地方。 例如，许多库都有自己的频道。

<!-- If you know some recommendable links or libraries, make a pull request! -->
如果您知道一些可推荐的链接或库，请提出PR！

</div>

