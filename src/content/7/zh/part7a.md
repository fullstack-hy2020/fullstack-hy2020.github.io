---
mainImage: ../../../images/part-7.svg
part: 7
letter: a
lang: zh
---

<div class="content">

<!-- The exercises in this seventh part of the course differ a bit from the ones before. In this and the next chapter, as usual, there are [exercises related to the theory in the chapter](/en/part7/react_router#exercises-7-1-7-3).-->
 本课程第七章节的练习与之前的练习有一些不同。在这一章和下一章，像往常一样，有[与本章理论相关的练习](/en/part7/react_router#exercises-7-1-7-3)。

<!-- In addition to the exercises in this and the next chapter, there are a series of exercises in which we'll be revising what we've learned during the whole course by expanding the Bloglist application which we worked on during parts 4 and 5.-->
 除了这一章和下一章的练习外，还有一系列的练习，在这些练习中，我们将通过扩展我们在第四和第五章节所做的Bloglist应用来复习我们在整个课程中所学到的知识。

### Application navigation structure

<!-- Following part 6, we return to React without Redux.-->
 在第六章节之后，我们将回到没有Redux的React。

<!-- It is very common for web applications to have a navigation bar, which enables switching the view of the application.-->
 对于网络应用来说，有一个导航条是很常见的，它可以切换应用的视图。

<!-- Our app could have a main page-->
 我们的应用可以有一个主页面

![](../../images/7/1ea.png)

<!-- and separate pages for showing information on notes and users:-->
 以及显示笔记和用户信息的独立页面。

![](../../images/7/2ea.png)

<!-- In an [old school web app](/en/part0/fundamentals_of_web_apps#traditional-web-applications), changing the page shown by the application would be accomplished by the browser making an HTTP GET request to the server and rendering the HTML representing the view that was returned.-->
在一个[老式网络应用](/en/part0/fundamentals_of_web_apps#traditional-web-applications)中，改变应用显示的页面将由浏览器向服务器发出HTTP GET请求并渲染代表返回的视图的HTML来完成。

<!-- In single page apps, we are, in reality, always on the same page. The Javascript code run by the browser creates an illusion of different "pages". If HTTP requests are made when switching view, they are only for fetching JSON-formatted data, which the new view might require for it to be shown.-->
 在单页应用中，实际上我们总是在同一个页面上。浏览器运行的Javascript代码创造了一个不同 "页面 "的假象。如果在切换视图时发出HTTP请求，它们只是为了获取JSON格式的数据，而新的视图可能需要它来显示。

<!-- The navigation bar and an application containing multiple views is very easy to implement using React.-->
 导航栏和一个包含多个视图的应用，使用React很容易实现。

<!-- Here is one way:-->
这里是一种方法。

```js
import React, { useState }  from 'react'
import ReactDOM from 'react-dom/client'

const Home = () => (
  <div> <h2>TKTL notes app</h2> </div>
)

const Notes = () => (
  <div> <h2>Notes</h2> </div>
)

const Users = () => (
  <div> <h2>Users</h2> </div>
)

const App = () => {
  const [page, setPage] = useState('home')

 const toPage = (page) => (event) => {
    event.preventDefault()
    setPage(page)
  }

  const content = () => {
    if (page === 'home') {
      return <Home />
    } else if (page === 'notes') {
      return <Notes />
    } else if (page === 'users') {
      return <Users />
    }
  }

  const padding = {
    padding: 5
  }

  return (
    <div>
      <div>
        <a href="" onClick={toPage('home')} style={padding}>
          home
        </a>
        <a href="" onClick={toPage('notes')} style={padding}>
          notes
        </a>
        <a href="" onClick={toPage('users')} style={padding}>
          users
        </a>
      </div>

      {content()}
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />, document.getElementById('root'))
```

<!-- Each view is implemented as its own component. We store the view component information in the application state called <i>page</i>. This information tells us which component, representing a view, should be shown below the menu bar.-->
每个视图都作为自己的组件来实现。我们在名为<i>page</i>的应用状态中存储视图组件信息。这个信息告诉我们应该在菜单栏下面显示哪个代表视图的组件。

<!-- However, the method is not very optimal. As we can see from the pictures, the address stays the same even though at times we are in different views. Each view should preferably have its own address, e.g. to make bookmarking possible. The <i>back</i>-button doesn't work as expected for our application either, meaning that <i>back</i> doesn't move you to the previously displayed view of the application, but somewhere completely different. If the application were to grow even bigger and we wanted to, for example, add separate views for each user and note, then this self-made <i>routing</i>, which means the navigation management of the application, would get overly complicated.-->
 然而，这个方法并不是很理想。正如我们从图片上看到的，即使有时我们在不同的视图中，地址也保持不变。每个视图最好都有自己的地址，比如说，为了使书签成为可能。<i>返回</i>按钮在我们的应用中也没有起到预期的作用，这意味着<i>返回</i>不会把你移到先前显示的应用的视图，而是移到完全不同的地方。如果应用进一步扩大，例如我们想为每个用户和笔记添加单独的视图，那么这种自制的<i>routing</i>，也就是应用的导航管理，就会变得过于复杂。

### React Router

<!-- Luckily, React has the [React Router](https://reactrouter.com/) library which provides an excellent solution for managing navigation in a React application.-->
 幸运的是，React有[React Router](https://reactrouter.com/)库，它为管理React应用中的导航提供了一个很好的解决方案。

<!-- Let's change the above application to use React Router. First, we install React Router with the command-->
 让我们把上面的应用改为使用React Router。首先，我们用以下命令安装React Router

```bash
npm install react-router-dom
```

<!-- The routing provided by React Router is enabled by changing the application as follows:-->
 通过改变应用，启用React Router提供的路由，如下所示。

```js
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from "react-router-dom"

const App = () => {

  const padding = {
    padding: 5
  }

  return (
    <Router>
      <div>
        <Link style={padding} to="/">home</Link>
        <Link style={padding} to="/notes">notes</Link>
        <Link style={padding} to="/users">users</Link>
      </div>

      <Routes>
        <Route path="/notes" element={<Notes />} />
        <Route path="/users" element={<Users />} />
        <Route path="/" element={<Home />} />
      </Routes>

      <div>
        <i>Note app, Department of Computer Science 2022</i>
      </div>
    </Router>
  )
}
```

<!-- Routing, or the conditional rendering of components <i>based on the url</i> in the browser, is used by placing components as children of the <i>Router</i> component, meaning inside <i>Router</i> tags.-->
 路由，或者说在浏览器中基于url</i>的组件的有条件渲染，是通过将组件作为<i>Router</i>组件的子代，也就是在<i>Router</i>标签中使用。

<!-- Notice that, even though the component is referred to by the name <i>Router</i>, we are in fact talking about [BrowserRouter](https://reactrouter.com/en/main/router-components/browser-router), because here the import happens by renaming the imported object:-->
 注意，尽管该组件被称为<i>Router</i>，我们实际上是在谈论[BrowserRouter](https://reactrouter.com/en/main/router-components/browser-router)，因为这里的导入是通过重命名导入的对象发生的。

```js
import {
  BrowserRouter as Router, // highlight-line
  Routes, Route, Link
} from "react-router-dom"
```

<!-- According to the [manual](https://v5.reactrouter.com/web/api/BrowserRouter):-->
 根据[手册](https://v5.reactrouter.com/web/api/BrowserRouter)。

<!-- > <i>BrowserRouter</i> is a <i>Router</i> that uses the HTML5 history API (pushState, replaceState and the popState event) to keep your UI in sync with the URL.-->
 > <i>BrowserRouter</i>是一个<i>Router</i>，使用HTML5历史API（pushState、replaceState和popState事件）来保持你的UI与URL同步。

<!-- Normally the browser loads a new page when the URL in the address bar changes. However, with the help of the [HTML5 history API](https://css-tricks.com/using-the-html5-history-api/), <i>BrowserRouter</i> enables us to use the URL in the address bar of the browser for internal "routing" in a React application. So, even if the URL in the address bar changes, the content of the page is only manipulated using Javascript, and the browser will not load new content from the server. Using the back and forward actions, as well as making bookmarks, is still logical like on a traditional web page.-->
通常情况下，当地址栏中的URL发生变化时，浏览器会加载一个新页面。然而，在[HTML5历史API](https://css-tricks.com/using-the-html5-history-api/)的帮助下，<i>BrowserRouter</i>使我们能够在React应用中使用浏览器地址栏中的URL进行内部 "路由"。因此，即使地址栏中的URL发生变化，页面的内容也只是使用Javascript进行操作，浏览器不会从服务器上加载新的内容。使用后退和前进的动作，以及做书签，仍然像在一个传统的网页上那样合乎逻辑。

<!-- Inside the router, we define <i>links</i> that modify the address bar with the help of the [Link](https://reactrouter.com/en/main/components/link) component. For example,-->
在路由器内部，我们定义了<i>链接</i>，在[链接](https://reactrouter.com/en/main/components/link)组件的帮助下修改地址栏。例如。

```js
<Link to="/notes">notes</Link>
```

<!-- creates a link in the application with the text <i>notes</i>, which when clicked changes the URL in the address bar to <i>/notes</i>.-->
在应用中创建一个文本为<i>notes</i>的链接，当点击时将地址栏中的URL改为<i>/notes</i>。

<!-- Components rendered based on the URL of the browser are defined with the help of the component [Route](https://reactrouter.com/en/main/components/route). For example,-->
基于浏览器的URL渲染的组件是在组件[Route](https://reactrouter.com/en/main/components/route)的帮助下定义的。例如。

```js
<Route path="/notes" element={<Notes />} />
```

<!-- defines that, if the browser address is <i>/notes</i>, we render the <i>Notes</i> component.-->
定义了，如果浏览器的地址是<i>/notes</i>，我们就渲染<i>Notes</i>组件。

<!-- We wrap the components to be rendered based on the url with a [Routes](https://reactrouter.com/en/main/components/routes) component-->
 我们用一个[Routes](https://reactrouter.com/en/main/components/routes)组件来包装要根据网址渲染的组件

```js
<Routes>
  <Route path="/notes" element={<Notes />} />
  <Route path="/users" element={<Users />} />
  <Route path="/" element={<Home />} />
</Routes>
```

<!-- The Routes works by rendering the first component whose <i>path</i> matches the url in the browser's address bar.-->
 Routes的作用是渲染第一个<i>路径</i>与浏览器地址栏中的网址相匹配的组件。

### Parameterized route

<!-- Let's examine the slightly modified version from the previous example. The complete code for the example can be found [here](https://github.com/fullstack-hy2020/misc/blob/master/router-app-v1.js).-->
 让我们来看看前面例子中稍加修改的版本。这个例子的完整代码可以在[这里](https://github.com/fullstack-hy2020/misc/blob/master/router-app-v1.js)找到。

<!-- The application now contains five different views whose display is controlled by the router. In addition to the components from the previous example (<i>Home</i>, <i>Notes</i> and <i>Users</i>), we have <i>Login</i> representing the login view and <i>Note</i> representing the view of a single note.-->
 该应用现在包含五个不同的视图，其显示由路由器控制。除了前面例子中的组件（<i>Home</i>、<i>Notes</i>和<i>Users</i>），我们还有代表登录视图的<i>Login</i>和代表单个笔记视图的<i>Note</i>。

<i>Home</i> and <i>Users</i> are unchanged from the previous exercise.  <i>Notes</i> is a bit more complicated. It renders the list of notes passed to it as props in such a way that the name of each note is clickable.

![](../../images/7/3ea.png)

<!-- The ability to click a name is implemented with the component <i>Link</i>, and clicking the name of a note whose id is 3 would trigger an event that changes the address of the browser into <i>notes/3</i>:-->
点击名字的能力是通过组件<i>Link</i>实现的，点击id为3的笔记的名字会触发一个事件，将浏览器的地址变成<i>notes/3</i>。

```js
const Notes = ({notes}) => (
  <div>
    <h2>Notes</h2>
    <ul>
      {notes.map(note =>
        <li key={note.id}>
          <Link to={`/notes/${note.id}`}>{note.content}</Link>
        </li>
      )}
    </ul>
  </div>
)
```

<!-- We define parameterized urls in the routing in <i>App</i> component as follows:-->
 我们在<i>App</i>组件的路由中定义参数化的UR，如下所示。

```js
<Router>
  // ...

  <Routes>
    <Route path="/notes/:id" element={<Note notes={notes} />} /> // highlight-line
    <Route path="/notes" element={<Notes notes={notes} />} />
    <Route path="/users" element={user ? <Users /> : <Navigate replace to="/login" />} />
    <Route path="/login" element={<Login onLogin={login} />} />
    <Route path="/" element={<Home />} />
  </Routes>
</Router>
```

<!-- We define the route rendering a specific note "express style" by marking the parameter with a colon <i>:id</i>-->
 我们通过用冒号标记参数来定义路由渲染一个特定的笔记 "表达风格"<i>:id</i>。

```js
<Route path="/notes/:id" element={<Note notes={notes} />} />
```

<!-- When a browser navigates to the url for a specific note, for example <i>/notes/3</i>, we render the <i>Note</i> component:-->
 当浏览器导航到一个特定笔记的网址，例如<i>/notes/3</i>，我们渲染<i>Note</i>组件。

```js
import {
  // ...
  useParams  // highlight-line
} from "react-router-dom"

const Note = ({ notes }) => {
  const id = useParams().id // highlight-line
  const note = notes.find(n => n.id === Number(id))
  return (
    <div>
      <h2>{note.content}</h2>
      <div>{note.user}</div>
      <div><strong>{note.important ? 'important' : ''}</strong></div>
    </div>
  )
}
```

<!-- The _Note_ component receives all of the notes as props <i>notes</i>, and it can access the url parameter (the id of the note to be displayed) with the [useParams](https://reactrouter.com/en/main/hooks/use-params) function of the React Router.-->
 _Note_组件接收所有的笔记作为prop<i>notes</i>，它可以通过React Router的[useParams](https://reactrouter.com/en/main/hooks/use-params)函数访问url参数（要显示的笔记的id）。

### useNavigate

<!-- We have also implemented a simple login function in our application. If a user is logged in, information about a logged-in user is saved to the <i>user</i> field of the state of the <i>App</i> component.-->
 我们还在我们的应用中实现了一个简单的登录功能。如果一个用户登录了，关于登录用户的信息就会被保存到<i>App</i>组件的状态的<i>user</i>字段。

<!-- The option to navigate to the <i>Login</i> view is rendered conditionally in the menu.-->
导航到<i>Login</i>视图的选项在菜单中被有条件地渲染。

```js
<Router>
  <div>
    <Link style={padding} to="/">home</Link>
    <Link style={padding} to="/notes">notes</Link>
    <Link style={padding} to="/users">users</Link>
    // highlight-start
    {user
      ? <em>{user} logged in</em>
      : <Link style={padding} to="/login">login</Link>
    }
    // highlight-end
  </div>

  // ...
</Router>
```

<!-- So if the user is already logged in, instead of displaying the link <i>Login</i>, we show the username of the user:-->
 所以如果用户已经登录了，我们不会显示链接<i>Login</i>，而是显示用户的用户名。

![](../../images/7/4a.png)

<!-- The code of the component handling the login functionality is as follows:-->
 处理登录功能的组件的代码如下。

```js
import {
  // ...
  useNavigate // highlight-line
} from 'react-router-dom'

const Login = (props) => {
  const navigate = useNavigate() // highlight-line

  const onSubmit = (event) => {
    event.preventDefault()
    props.onLogin('mluukkai')
    navigate('/') // highlight-line
  }

  return (
    <div>
      <h2>login</h2>
      <form onSubmit={onSubmit}>
        <div>
          username: <input />
        </div>
        <div>
          password: <input type='password' />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}
```

<!-- What is interesting about this component is the use of the [useNavigate](https://reactrouter.com/en/main/hooks/use-navigate) function of the React Router. With this function the browser's url can be changed programmatically.-->
 这个组件的有趣之处在于使用了React Router的[useNavigate](https://reactrouter.com/en/main/hooks/use-navigate)函数。有了这个函数，浏览器的url可以以编程方式改变。

<!-- With user login, we call _navigate('/')_ that causes the browser's url to change to _/_ and the application renders the corresponding component <i>Home</i>.-->
随着用户的登录，我们调用_navigate("/")_，使浏览器的url改变为_/_，应用渲染相应的组件<i>Home</i>。

<!-- Both [useParams](https://reactrouter.com/en/main/hooks/use-params) and [useNavigate](https://reactrouter.com/en/main/hooks/use-navigate)  are hook functions, just like useState and useEffect which we have used many times now.  As you remember from part 1, there are some [rules](/en/part1/a_more_complex_state_debugging_react_apps/#rules-of-hooks) to using hook functions. Create-react-app has been configured to warn you if you break these rules, for example, by calling a hook function from a conditional statement.-->
 [useParams](https://reactrouter.com/en/main/hooks/use-params)和[useNavigate](https://reactrouter.com/en/main/hooks/use-navigate)都是钩子函数，就像我们现在已经多次使用的useState和useEffect。  正如你在第一章节所记得的，使用钩子函数有一些 [规则](/en/part1/a_more_complex_state_debugging_react_apps/#rules-of-hooks) 。Create-react-app已经被配置为在你违反这些规则时发出警告，例如，从条件语句中调用钩子函数。

### redirect

<!-- There is one more interesting detail about the <i>Users</i> route:-->
关于<i>Users</i>路由还有一个有趣的细节。

```js
<Route path="/users" element={user ? <Users /> : <Navigate replace to="/login" />} />
```

<!-- If a user isn't logged in, the <i>Users</i> component is not rendered. Instead, the user is <i>redirected</i> using the component [Navigate](https://reactrouter.com/en/main/components/navigate) to the login view:-->
 如果一个用户没有登录，<i>Users</i>组件就不会被渲染。相反，用户会被使用组件[Navigate](https://reactrouter.com/en/main/components/navigate)重定向</i>到登录视图。

```js
<Navigate replace to="/login" />
```

<!-- In reality, it would perhaps be better to not even show links in the navigation bar requiring login if the user is not logged into the application.-->
 在现实中，如果用户没有登录到应用，也许最好不要在导航栏中显示需要登录的链接。

<!-- Here is the <i>App</i> component in its entirety:-->
 这里是<i>App</i>组件的全部内容。

```js
const App = () => {
  const [notes, setNotes] = useState([
    // ...
  ])

  const [user, setUser] = useState(null)

  const login = (user) => {
    setUser(user)
  }

  const padding = {
    padding: 5
  }

  return (
    <div>
    <Router>
      <div>
        <Link style={padding} to="/">home</Link>
        <Link style={padding} to="/notes">notes</Link>
        <Link style={padding} to="/users">users</Link>
        {user
          ? <em>{user} logged in</em>
          : <Link style={padding} to="/login">login</Link>
        }
      </div>

      <Routes>
        <Route path="/notes/:id" element={<Note notes={notes} />} />
        <Route path="/notes" element={<Notes notes={notes} />} />
        <Route path="/users" element={user ? <Users /> : <Navigate replace to="/login" />} />
        <Route path="/login" element={<Login onLogin={login} />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
      <div>
        <br />
        <em>Note app, Department of Computer Science 2022</em>
      </div>
    </div>
  )
}
```

<!-- We define an element common for modern web apps called <i>footer</i>, which defines the part at the bottom of the screen, outside of the <i>Router</i>, so that it is shown regardless of the component shown in the routed part of the application.-->
我们定义了一个现代网络应用常见的元素，叫做<i>footer</i>，它定义了屏幕底部的部分，在<i>Router</i>之外，所以无论应用的路由部分显示什么组件，它都会显示。

### Parameterized route revisited

<!-- Our application has a flaw. The _Note_ component receives all of the notes, even though it only displays the one whose id matches the url parameter:-->
 我们的应用有一个缺陷。_Note_组件接收所有的笔记，尽管它只显示id与url参数相匹配的那个。


```js
const Note = ({ notes }) => {
  const id = useParams().id
  const note = notes.find(n => n.id === Number(id))
  // ...
}
```

<!-- Would it be possible to modify the application so that _Note_ receives only the component it should display?-->
 是否有可能修改应用，使_Note_只接收它应该显示的组件？

```js
const Note = ({ note }) => {
  return (
    <div>
      <h2>{note.content}</h2>
      <div>{note.user}</div>
      <div><strong>{note.important ? 'important' : ''}</strong></div>
    </div>
  )
}
```

<!-- One way to do this would be to use React Router's [useMatch](https://reactrouter.com/en/main/hooks/use-match) hook to figure out the id of the note to be displayed in the _App_ component.-->
 一种方法是使用React Router's [useMatch](https://reactrouter.com/en/main/hooks/use-match)钩子来计算出要在_App_组件中显示的笔记的id。

<!-- It is not possible to use the <i>useMatch</i> hook in the component which defines the routed part of the application. Let's move the use of the _Router_ components from _App_:-->
 在定义应用的路由部分的组件中不可能使用<i>useMatch</i>钩。让我们把_Router_组件的使用从_App_移开。

```js
ReactDOM.createRoot(document.getElementById('root')).render(
  <Router> // highlight-line
    <App />
  </Router>, // highlight-line
  document.getElementById('root')
)
```

<!-- The _App_component becomes:-->
 _App_组件变成。

```js
import {
  // ...
  useMatch  // highlight-line
} from "react-router-dom"

const App = () => {
  // ...

 // highlight-start
  const match = useMatch('/notes/:id')

  const note = match
    ? notes.find(note => note.id === Number(match.params.id))
    : null
  // highlight-end

  return (
    <div>
      <div>
        <Link style={padding} to="/">home</Link>
        // ...
      </div>

      <Routes>
        <Route path="/notes/:id" element={<Note note={note} />} />   // highlight-line
        <Route path="/notes" element={<Notes notes={notes} />} />
        <Route path="/users" element={user ? <Users /> : <Navigate replace to="/login" />} />
        <Route path="/login" element={<Login onLogin={login} />} />
        <Route path="/" element={<Home />} />
      </Routes>

      <div>
        <em>Note app, Department of Computer Science 2022</em>
      </div>
    </div>
  )
}
```

<!-- Every time the component is rendered, so practically every time the browser's url changes, the following command is executed:-->
 每当该组件被渲染时，所以实际上每当浏览器的网址改变时，就会执行以下命令。

```js
const match = useMatch('/notes/:id')
```

<!-- If the url matches _/notes/:id_, the match variable will contain an object from which we can access the parameterized part of the path, the id of the note to be displayed, and we can then fetch the correct note to display.-->
 如果网址与_/notes/:id_相匹配，匹配变量将包含一个对象，我们可以从中访问路径的参数化部分，即要显示的笔记的id，然后我们可以获取要显示的正确笔记。

```js
const note = match
  ? notes.find(note => note.id === Number(match.params.id))
  : null
```

<!-- The completed code can be found [here](https://github.com/fullstack-hy2020/misc/blob/master/router-app-v2.js).-->
 完成的代码可以在[这里](https://github.com/fullstack-hy2020/misc/blob/master/router-app-v2.js)找到。

</div>
<div class="tasks">

### Exercises 7.1.-7.3.

<!-- Let's return to working with anecdotes. Use the redux-free anecdote app found in the repository <https://github.com/fullstack-hy2020/routed-anecdotes> as the starting point for the exercises.-->
 让我们回到对名言警句的处理上。使用存储库<https://github.com/fullstack-hy2020/routed-anecdotes>中的无冗余名言警句应用作为练习的起点。

<!-- If you clone the project into an existing git repository, remember to <i>delete the git configuration of the cloned application:</i>-->
 如果你把项目克隆到现有的git仓库中，记得要<i>删除克隆的应用的git配置：</i>。

```bash
cd routed-anecdotes   // go first to directory of the cloned repository
rm -rf .git
```

<!-- The application starts the usual way, but first you need to install the dependencies of the application:-->
 应用按常规方式启动，但首先你需要安装应用的依赖项。

```bash
npm install
npm start
```

#### 7.1: routed anecdotes, step1

<!-- Add React Router to the application so that by clicking links in the <i>Menu</i> component the view can be changed.-->
 在应用中添加React Router，这样通过点击<i>Menu</i>组件中的链接，就可以改变视图。

<!-- At the root of the application, meaning the path _/_, show the list of anecdotes:-->
 在应用的根部，指路径_/_，显示名言警句列表。

![](../../assets/teht/40.png)

<!-- The <i>Footer</i> component should always be visible at the bottom.-->
<i>Footer</i>组件应始终在底部可见。

<!-- The creation of a new anecdote should happen e.g. in the path <i>create</i>:-->
 创建一个新的名言警句应该发生在路径<i>create</i>中。

![](../../assets/teht/41.png)

#### 7.2: routed anecdotes, step2

<!-- Implement a view for showing a single anecdote:-->
 实现一个显示单个名言警句的视图。

![](../../assets/teht/42.png)

<!-- Navigating to the page showing the single anecdote is done by clicking the name of that anecdote:-->
 通过点击该名言警句的名称，导航到显示单一名言警句的页面。

![](../../assets/teht/43.png)

#### 7.3: routed anecdotes, step3

<!-- The default functionality of the creation form is quite confusing, because nothing seems to be happening after creating a new anecdote using the form.-->
 创建表格的默认功能相当令人困惑，因为在使用该表格创建一个新的名言警句后，似乎什么都没有发生。

<!-- Improve the functionality such that after creating a new anecdote the application transitions automatically to showing the view for all anecdotes <i>and</i> the user is shown a notification informing them of this successful creation for the next five seconds:-->
 改进功能，在创建一个新的名言警句后，应用会自动过渡到显示所有名言警句的视图，<i>并且</i>用户会在接下来的五秒钟内看到一个通知，告知他们创建成功。

![](../../assets/teht/44.png)

</i>
