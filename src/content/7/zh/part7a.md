---
mainImage: ../../../images/part-7.svg
part: 7
letter: a
lang: zh
---

<div class="content">

<!-- The exercises in this seventh part of the course differ a bit from the ones before. In this and the next chapter, as usual, there are [exercises related to the theory in the chapter](/en/part7/react_router#exercises-7-1-7-3).-->
在本課程的第七部分，練習與之前有些不同。在本章和下一章，和往常一樣，有[與章節理論相關的練習](/en/part7/react_router#exercises-7-1-7-3)。

<!-- In addition to the exercises in this and the next chapter, there are a series of exercises in which we'll be revising what we've learned during the whole course by expanding the Bloglist application which we worked on during parts 4 and 5.-->
此章和下一章的练习之外，我们还有一系列的练习，通过扩展我们在第4和第5部分工作的Bloglist应用程序，我们将复习整个课程中学到的内容。

### Application navigation structure

<!-- Following part 6, we return to React without Redux.-->
# 继第6部分之后，我们回到没有 Redux 的 React 上。

<!-- It is very common for web applications to have a navigation bar, which enables switching the view of the application.-->
它很常见的网络应用有一个导航栏，它可以让应用程序的视图可以切换。

<!-- Our app could have a main page-->
我们的应用程序可以有一个主页

![browser showing notes app with home nav link](../../images/7/1ea.png)

<!-- and separate pages for showing information on notes and users:-->
# 笔记与用户信息

## 笔记

这里显示了有关笔记的信息。

## 用户

这里显示了有关用户的信息。

# 笔记与用户信息

## 笔记

这里显示有关笔记的信息。

## 用户

这里显示有关用户的信息。

![browser showing notes app with notes nav link](../../images/7/2ea.png)

<!-- In an [old school web app](/en/part0/fundamentals_of_web_apps#traditional-web-applications), changing the page shown by the application would be accomplished by the browser making an HTTP GET request to the server and rendering the HTML representing the view that was returned.-->
在一個[舊式的web應用程式](/en/part0/fundamentals_of_web_apps#traditional-web-applications)中，改變應用程式所顯示的頁面可以通過瀏覽器向伺服器發出HTTP GET請求並渲染返回的表示視圖的HTML來完成。

<!-- In single-page apps, we are, in reality, always on the same page. The Javascript code run by the browser creates an illusion of different "pages". If HTTP requests are made when switching views, they are only for fetching JSON-formatted data, which the new view might require for it to be shown.-->
在单页应用中，实际上我们总是在同一页面上。浏览器运行的 Javascript 代码创造出不同的“页面”的错觉。如果在切换视图时发出 HTTP 请求，它们只是用于获取 JSON 格式的数据，新视图可能需要这些数据才能显示。

<!-- The navigation bar and an application containing multiple views are very easy to implement using React.-->
使用React来实现导航栏和包含多个视图的应用程序非常容易。

<!-- Here is one way:-->
这是一种方式：

```js
import { useState }  from 'react'
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

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

<!-- Each view is implemented as its own component. We store the view component information in the application state called <i>page</i>. This information tells us which component, representing a view, should be shown below the menu bar.-->
每个视图都被实现为自己的组件。我们将视图组件信息存储在名为<i>page</i>的应用程序状态中。此信息告诉我们应该在菜单栏下面显示哪个代表视图的组件。

<!-- However, the method is not very optimal. As we can see from the pictures, the address stays the same even though at times we are in different views. Each view should preferably have its own address, e.g. to make bookmarking possible. The <i>back</i> button doesn't work as expected for our application either, meaning that <i>back</i> doesn't move you to the previously displayed view of the application, but somewhere completely different. If the application were to grow even bigger and we wanted to, for example, add separate views for each user and note, then this self-made <i>routing</i>, which means the navigation management of the application, would get overly complicated.-->
然而，该方法并不是很优化。正如我们从图片中所看到的，即使有时我们处于不同的视图中，地址也保持不变。每个视图最好有自己的地址，例如可以进行书签。这个应用的<i>返回</i>按钮也不能按预期工作，也就是说，<i>返回</i>不会将您移动到应用程序的先前显示的视图，而是移动到完全不同的地方。如果应用程序变得更大，我们想要添加每个用户和笔记的独立视图，那么这种自制的<i>路由</i>（即应用程序的导航管理）将变得过于复杂。

### React Router

<!-- Luckily, React has the [React Router](https://reactrouter.com/) library which provides an excellent solution for managing navigation in a React application.-->
幸运的是，React拥有[React Router](https://reactrouter.com/)库，它为React应用程序中的导航提供了出色的解决方案。

<!-- Let''s change the above application to use React Router. First, we install React Router with the command-->
`npm install react-router-dom`.

让我们改变上面的应用来使用React Router。首先，我们使用命令`npm install react-router-dom`安装React Router。

```bash
npm install react-router-dom
```

<!-- The routing provided by React Router is enabled by changing the application as follows:-->
React Router 提供的路由功能可以通过以下方式改变应用程序：

```js
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'

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
        <i>Note app, Department of Computer Science 2023</i>
      </div>
    </Router>
  )
}
```

<!-- Routing, or the conditional rendering of components <i>based on the URL</i> in the browser, is used by placing components as children of the <i>Router</i> component, meaning inside <i>Router</i> tags.-->
路由，或者基于浏览器中的URL条件渲染组件，通过将组件放置在<i>Router</i>组件的子组件中实现，也就是在<i>Router</i>标签内部。

<!-- Notice that, even though the component is referred to by the name <i>Router</i>, we are talking about [BrowserRouter](https://reactrouter.com/en/main/router-components/browser-router), because here the import happens by renaming the imported object:-->
注意，尽管这个组件被称为<i>Router</i>，我们实际上是在谈论[BrowserRouter](https://reactrouter.com/en/main/router-components/browser-router)，因为这里导入的对象是通过重命名实现的：

```js
import {
  BrowserRouter as Router, // highlight-line
  Routes, Route, Link
} from 'react-router-dom'
```

<!-- According to the [v5 docs](https://v5.reactrouter.com/web/api/BrowserRouter):-->
根据 [v5文档](https://v5.reactrouter.com/web/api/BrowserRouter)：

<!-- > <i>BrowserRouter</i> is a <i>Router</i> that uses the HTML5 history API (pushState, replaceState and the popState event) to keep your UI in sync with the URL.-->
<i>BrowserRouter</i> 是一种使用 HTML5 历史 API（pushState、replaceState 和 popState 事件）来保持 UI 与 URL 同步的<i>路由器</i>。

<!-- Normally the browser loads a new page when the URL in the address bar changes. However, with the help of the [HTML5 history API](https://css-tricks.com/using-the-html5-history-api/), <i>BrowserRouter</i> enables us to use the URL in the address bar of the browser for internal "routing" in a React application. So, even if the URL in the address bar changes, the content of the page is only manipulated using Javascript, and the browser will not load new content from the server. Using the back and forward actions, as well as making bookmarks, is still logical like on a traditional web page.-->
通常，當地址欄中的URL改變時，瀏覽器會加載一個新頁面。但是，借助[HTML5歷史API]（https://css-tricks.com/using-the-html5-history-api/），<i>BrowserRouter</i>可以讓我們在React應用程序中使用瀏覽器地址欄中的URL進行內部“路由”。因此，即使地址欄中的URL改變，頁面的內容也只能使用Javascript操作，而瀏覽器也不會從服務器加載新內容。使用后退和前進操作，以及做書簽，仍然像傳統網頁一樣合乎邏輯。

<!-- Inside the router, we define <i>links</i> that modify the address bar with the help of the [Link](https://reactrouter.com/en/main/components/link) component. For example,-->
在路由器中，我们使用[Link](https://reactrouter.com/en/main/components/link)组件定义<i>链接</i>，以修改地址栏。例如，

```js
<Link to="/notes">notes</Link>
```

<!-- creates a link in the application with the text <i>notes</i>, which when clicked changes the URL in the address bar to <i>/notes</i>.-->
创建一个在应用中带有文本<i>notes</i>的链接，点击后会将地址栏中的URL改变为<i>/notes</i>。

<!-- Components rendered based on the URL of the browser are defined with the help of the component [Route](https://reactrouter.com/en/main/route/route). For example,-->
if the URL is `/about`, then the `About` component is rendered.

根据浏览器的URL定义渲染的组件可以通过[Route](https://reactrouter.com/en/main/route/route)来实现。例如，如果URL是`/about`，那么将渲染`About`组件。

```js
<Route path="/notes" element={<Notes />} />
```

<!-- defines that, if the browser address is <i>/notes</i>, we render the <i>Notes</i> component.-->
如果浏览器地址是<i>/notes</i>，我们就渲染<i>Notes</i>组件。

<!-- We wrap the components to be rendered based on the URL with a [Routes](https://reactrouter.com/en/main/components/routes) component-->
.

我们根据URL包装要渲染的组件，使用[路由](https://reactrouter.com/en/main/components/routes)组件。

```js
<Routes>
  <Route path="/notes" element={<Notes />} />
  <Route path="/users" element={<Users />} />
  <Route path="/" element={<Home />} />
</Routes>
```

<!-- The Routes works by rendering the first component whose <i>path</i> matches the URL in the browser''s address bar.-->
Routes 通过渲染与浏览器地址栏中 URL 匹配的第一个 <i>path</i> 组件来工作。

### Parameterized route

<!-- Let''s examine the slightly modified version from the previous example. The complete code for the example can be found [here](https://github.com/fullstack-hy2020/misc/blob/master/router-app-v1.js).-->
让我们来检查一下从前一个例子里稍微修改过的版本。该示例的完整代码可以在[这里](https://github.com/fullstack-hy2020/misc/blob/master/router-app-v1.js)找到。

<!-- The application now contains five different views whose display is controlled by the router. In addition to the components from the previous example (<i>Home</i>, <i>Notes</i> and <i>Users</i>), we have <i>Login</i> representing the login view and <i>Note</i> representing the view of a single note.-->
应用程序现在包含五个不同的视图，其显示由路由器控制。除了以前示例中的组件（<i>主页</i>、<i>笔记</i>和<i>用户</i>），我们还有<i>登录</i>表示登录视图和<i>笔记</i>表示单个笔记的视图。

<i>Home</i> and <i>Users</i> are unchanged from the previous exercise.  <i>Notes</i> is a bit more complicated. It renders the list of notes passed to it as props in such a way that the name of each note is clickable.

![notes app showing notes are clickable](../../images/7/3ea.png)

<!-- The ability to click a name is implemented with the component <i>Link</i>, and clicking the name of a note whose id is 3 would trigger an event that changes the address of the browser into <i>notes/3</i>:-->
能够点击一个名字实现的组件是<i>Link</i>，点击id为3的笔记的名字会触发一个事件，改变浏览器的地址为<i>notes/3</i>：

```js
const Notes = ({notes}) => (
  <div>
    <h2>Notes</h2>
    <ul>
      {notes.map(note =>
        <li key={note.id}>
          <Link to={`/notes/${note.id}`}>{note.content}</Link>  // highlight-line
        </li>
      )}
    </ul>
  </div>
)
```

<!-- We define parameterized URLs in the routing in <i>App</i> component as follows:-->
我们在<i>App</i>组件中的路由中定义参数化URL如下：

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

<!-- We define the route rendering a specific note "express style" by marking the parameter with a colon - <i>:id</i>-->
我们用一个冒号<i>:id</i>来定义一条渲染指定笔记的路由，以"express风格"表示。

```js
<Route path="/notes/:id" element={<Note notes={notes} />} />
```

<!-- When a browser navigates to the URL for a specific note, for example, <i>/notes/3</i>, we render the <i>Note</i> component:-->
当浏览器导航到特定笔记的URL，例如<i>/notes/3</i>时，我们渲染<i>Note</i>组件：

```js
import {
  // ...
  useParams  // highlight-line
} from 'react-router-dom'

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

<!-- The _Note_ component receives all of the notes as props <i>notes</i>, and it can access the URL parameter (the id of the note to be displayed) with the [useParams](https://reactrouter.com/en/main/hooks/use-params) function of the React Router.-->
_笔记_ 组件接收所有笔记作为 <i>notes</i> 的 props，它可以通过 React Router 的 [useParams](https://reactrouter.com/en/main/hooks/use-params) 函数访问 URL 参数（要显示的笔记的 id）。

### useNavigate

<!-- We have also implemented a simple login function in our application. If a user is logged in, information about a logged-in user is saved to the <i>user</i> field of the state of the <i>App</i> component.-->
我们在应用程序中也实现了一个简单的登录功能。如果用户已登录，则会将有关已登录用户的信息保存到<i>App</i>组件的状态的<i>user</i>字段中。

<!-- The option to navigate to the <i>Login</i> view is rendered conditionally in the menu.-->
<i>登录</i>视图的导航选项是有条件渲染在菜单中的。

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
如果用户已经登录，我们不再显示<i>登录</i>的链接，而是显示用户的用户名：

![browser notes app showing username logged in](../../images/7/4a.png)

<!-- The code of the component handling the login functionality is as follows:-->
以下是处理登录功能的组件的代码：

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

<!-- What is interesting about this component is the use of the [useNavigate](https://reactrouter.com/en/main/hooks/use-navigate) function of the React Router. With this function, the browser''s URL can be changed programmatically.-->
这个组件有趣的地方在于使用了 React Router 的[useNavigate](https://reactrouter.com/en/main/hooks/use-navigate)函数。有了这个函数，浏览器的 URL 就可以被编程改变。

<!-- With user login, we call _navigate('/')_ which causes the browser''s URL to change to _/_ and the application renders the corresponding component <i>Home</i>.-->
使用用户登录，我们调用_navigate('/')_，这会导致浏览器的URL更改为_/_，并且应用程序渲染相应的组件<i>Home</i>。

<!-- Both [useParams](https://reactrouter.com/en/main/hooks/use-params) and [useNavigate](https://reactrouter.com/en/main/hooks/use-navigate) are hook functions, just like useState and useEffect which we have used many times now.  As you remember from part 1, there are some [rules](/en/part1/a_more_complex_state_debugging_react_apps/#rules-of-hooks) to using hook functions. Create-react-app has been configured to warn you if you break these rules, for example, by calling a hook function from a conditional statement.-->
两个[useParams](https://reactrouter.com/en/main/hooks/use-params)和[useNavigate](https://reactrouter.com/en/main/hooks/use-navigate)都是钩子函数，就像我们现在已经使用过的useState和useEffect一样。 正如您从第一部分记住的，使用钩子函数有一些[规则](/en/part1/a_more_complex_state_debugging_react_apps/#rules-of-hooks)。 Create-react-app已配置为警告您，如果您违反了这些规则，例如，从条件语句中调用钩子函数。

### redirect

<!-- There is one more interesting detail about the <i>Users</i> route:-->
<i>用户</i>路由还有一个有趣的细节：

```js
<Route path="/users" element={user ? <Users /> : <Navigate replace to="/login" />} />
```

<!-- If a user isn''t logged in, the <i>Users</i> component is not rendered. Instead, the user is <i>redirected</i> using the component [Navigate](https://reactrouter.com/en/main/components/navigate) to the login view:-->
如果用户没有登录，<i>用户</i>组件不会被渲染。相反，用户会被使用[Navigate](https://reactrouter.com/en/main/components/navigate)组件重定向到登录视图：

```js
<Navigate replace to="/login" />
```

<!-- In reality, it would perhaps be better to not even show links in the navigation bar requiring login if the user is not logged into the application.-->
实际上，如果用户没有登录应用程序，最好不要在导航栏中显示需要登录的链接。

<!-- Here is the <i>App</i> component in its entirety:-->
这是整个<i>App</i>组件：

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
      <footer>
        <br />
        <em>Note app, Department of Computer Science 2023</em>
      </footer>
    </div>
  )
}
```

<!-- We define an element common for modern web apps called <i>footer</i>, which defines the part at the bottom of the screen, outside of the <i>Router</i>, so that it is shown regardless of the component shown in the routed part of the application.-->
我们定义了一个现代Web应用程序中的公共元素，称为<i>footer</i>，它定义了屏幕底部的部分，位于<i>Router</i>之外，因此无论应用程序路由部分中显示的是什么组件，它都会显示出来。

### Parameterized route revisited

<!-- Our application has a flaw. The _Note_ component receives all of the notes, even though it only displays the one whose id matches the url parameter:-->
我们的应用程序有一个缺陷。_Note_组件接收所有的笔记，即使它只显示其ID与URL参数匹配的笔记：

```js
const Note = ({ notes }) => {
  const id = useParams().id
  const note = notes.find(n => n.id === Number(id))
  // ...
}
```

<!-- Would it be possible to modify the application so that the _Note_ component receives only the note that it should display?-->
_能否修改应用程序，使 _Note_ 组件仅接收应显示的笔记？_

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

<!-- One way to do this would be to use React Router''s [useMatch](https://reactrouter.com/en/v6.3.0/api#usematch) hook to figure out the id of the note to be displayed in the _App_ component.-->
一种做法是使用React Router的[useMatch](https://reactrouter.com/en/v6.3.0/api#usematch)钩子来确定在_App_组件中显示的笔记的id。

<!-- It is not possible to use the <i>useMatch</i> hook in the component which defines the routed part of the application. Let''s move the use of the _Router_ components from _App_:-->
<i>useMatch</i> 钩子不能在定义应用路由部分的组件中使用。让我们将 _Router_ 组件的使用从 _App_ 中移除：

```js
ReactDOM.createRoot(document.getElementById('root')).render(
  <Router> // highlight-line
    <App />
  </Router> // highlight-line
)
```

<!-- The _App_component becomes:-->
_App_组件变成：

```js
import {
  // ...
  useMatch  // highlight-line
} from 'react-router-dom'

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
        <em>Note app, Department of Computer Science 2023</em>
      </div>
    </div>
  )
}
```

<!-- Every time the component is rendered, so practically every time the browser''s URL changes, the following command is executed:-->
每次组件被渲染，也就是说每次浏览器的URL发生变化时，都会执行以下命令：

```js
const match = useMatch('/notes/:id')
```

<!-- If the URL matches _/notes/:id_, the match variable will contain an object from which we can access the parameterized part of the path, the id of the note to be displayed, and we can then fetch the correct note to display.-->
如果URL匹配_/notes/:id_，那么match变量将包含一个对象，我们可以从中访问路径的参数化部分，即要显示的笔记的id，然后我们可以获取正确的笔记来显示。

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

<!-- Let''s return to working with anecdotes. Use the redux-free anecdote app found in the repository <https://github.com/fullstack-hy2020/routed-anecdotes> as the starting point for the exercises.-->
让我们回到使用轶事的工作。使用存储库<https://github.com/fullstack-hy2020/routed-anecdotes>中的redux-free轶事应用程序作为练习的起点。

<!-- If you clone the project into an existing git repository, remember to <i>delete the git configuration of the cloned application:</i>-->
如果你将该项目克隆到现有的git仓库中，请记住<i>删除克隆应用程序的git配置：</i>

```bash
cd routed-anecdotes   // go first to directory of the cloned repository
rm -rf .git
```

<!-- The application starts the usual way, but first, you need to install the dependencies of the application:-->
应用程序以通常的方式启动，但首先，您需要安装应用程序的依赖项：

```bash
npm install
npm start
```

#### 7.1: routed anecdotes, step1

<!-- Add React Router to the application so that by clicking links in the <i>Menu</i> component the view can be changed.-->
在应用中添加React Router，这样点击<i>Menu</i>组件中的链接就可以改变视图。

<!-- At the root of the application, meaning the path _/_, show the list of anecdotes:-->
在应用程序的根路径 _/_ 下，显示轶事列表：

![browser at baseURL showing anecdotes and footer](../../assets/teht/40.png)

<!-- The <i>Footer</i> component should always be visible at the bottom.-->
<i>页脚</i>组件应始终在底部可见。

<!-- The creation of a new anecdote should happen e.g. in the path <i>create</i>:-->
创建一个新的轶事应该发生在<i>创建</i>路径中，例如：

![browser anecdotes /create shows create form](../../assets/teht/41.png)

#### 7.2: routed anecdotes, step2

<!-- Implement a view for showing a single anecdote:-->
实现一个用于显示单个轶事的视图：

![browser /anecdotes/number showing single anecdote](../../assets/teht/42.png)

<!-- Navigating to the page showing the single anecdote is done by clicking the name of that anecdote:-->
点击那个anecdote的名字可以转到显示这个anecdote的页面：

![browser showing previous link that was clicked](../../assets/teht/43.png)

#### 7.3: routed anecdotes, step3

<!-- The default functionality of the creation form is quite confusing because nothing seems to be happening after creating a new anecdote using the form.-->
默认情况下，创建表单的功能非常令人困惑，因为使用表单创建新的轶事后似乎什么都没有发生。

<!-- Improve the functionality such that after creating a new anecdote the application transitions automatically to showing the view for all anecdotes <i>and</i> the user is shown a notification informing them of this successful creation for the next five seconds:-->
改善功能，使得在创建一个新的轶事后，应用程序自动转换到显示所有轶事的视图<i>并且</i>用户在接下来的五秒钟内会看到一条通知，提示他们创建成功。

![browser anecdotes showing success message for adding anecdote](../../assets/teht/44.png)

</div>
