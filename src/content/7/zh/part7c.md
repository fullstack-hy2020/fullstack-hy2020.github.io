---
mainImage: ../../../images/part-7.svg
part: 7
letter: c
lang: zh
---

<div class="content">

<!-- In part 2, we examined two different ways of adding styles to our application: the old-school [single CSS](/en/part2/adding_styles_to_react_app) file and [inline-styles](/en/part2/adding_styles_to_react_app#inline styles). In this part, we will take a look at a few other ways.-->
 在第二章节中，我们研究了向我们的应用添加样式的两种不同方式：老式的[单一CSS](/en/part2/adding_styles_to_react_app)文件和[inline-styles](/en/part2/adding_styles_to_react_app#inline styles)。在这一部分，我们将看一下其他的一些方法。

### Ready-made UI libraries

<!-- One approach to defining styles for an application is to use a ready-made "UI framework".-->
 一种为应用定义样式的方法是使用一个现成的 "UI框架"。

<!-- One of the first widely popular UI frameworks was the [Bootstrap](https://getbootstrap.com/) toolkit created by Twitter which may still be the most popular framework. Recently, there has been an explosion in the number of new UI frameworks that have entered the arena. In fact, the selection is so vast that there is little hope of creating an exhaustive list of options.-->
 最早广泛流行的UI框架之一是由Twitter创建的[Bootstrap](https://getbootstrap.com/)工具包，它可能仍然是最流行的框架。最近，进入这个领域的新的UI框架的数量激增。事实上，选择是如此之多，以至于几乎没有希望创建一个详尽的选项清单。

<!-- Many UI frameworks provide developers of web applications with ready-made themes and "components" like buttons, menus, and tables. We write components in quotes because, in this context, we are not talking about React components. Usually, UI frameworks are used by including the CSS stylesheets and JavaScript code of the framework in the application.-->
 许多UI框架为Web应用的开发者提供了现成的主题和 "组件"，如按钮、菜单和表格。我们用引号来写组件，因为在这种情况下，我们不是在谈论React组件。通常情况下，UI框架的使用是通过在应用中包含框架的CSS样式表和JavaScript代码。

<!-- There are many UI frameworks that have React-friendly versions where the framework's "components" have been transformed into React components. There are a few different React versions of Bootstrap like [reactstrap](http://reactstrap.github.io/) and [react-bootstrap](https://react-bootstrap.github.io/).-->
 有许多UI框架都有React友好版本，其中框架的 "组件 "已经被转化为React组件。Bootstrap有几个不同的React版本，比如[reactstrap](http://reactstrap.github.io/)和[react-bootstrap](https://react-bootstrap.github.io/)。

<!-- Next, we will take a closer look at two UI frameworks, Bootstrap and [MaterialUI](https://mui.com/). We will use both frameworks to add similar styles to the application we made in the [React-router](/en/part7/react_router) section of the course material.-->
 接下来，我们将仔细看看两个UI框架，Bootstrap和[MaterialUI](https://mui.com/)。我们将使用这两个框架为我们在教材的[React-router](/en/part7/react_router)部分制作的应用添加类似的样式。

### React Bootstrap

<!-- Let's start by taking a look at Bootstrap with the help of the [react-bootstrap](https://react-bootstrap.github.io/) package.-->
 让我们首先在[react-bootstrap](https://react-bootstrap.github.io/)软件包的帮助下看看Bootstrap。

<!-- Let's install the package with the command:-->
 让我们用命令来安装这个包。

```bash
npm install react-bootstrap
```

<!-- Then let's add a link for loading the CSS stylesheet for Bootstrap inside of the <i>head</i> tag in the <i>public/index.html</i> file of the application:-->
 然后让我们在应用的<i>public/index.html</i>文件中的<i>head</i>标签内添加一个加载Bootstrap的CSS样式表的链接。

```js
<head>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
    integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
    crossOrigin="anonymous"
  />
  // ...
</head>
```
<!-- When we reload the application, we notice that it already looks a bit more stylish:-->
 当我们重新加载应用时，我们注意到它看起来已经有点时尚了。

![](../../images/7/5ea.png)

<!-- In Bootstrap, all of the contents of the application are typically rendered inside of a [container](https://getbootstrap.com/docs/4.1/layout/overview/#containers). In practice this is accomplished by giving the root _div_ element of the application the  _container_ class attribute:-->
 在Bootstrap中，应用的所有内容通常都是在一个[容器](https://getbootstrap.com/docs/4.1/layout/overview/#containers)中渲染的。在实践中，这是通过给应用的根_div_元素加上_container_类属性来实现的。

```js
const App = () => {
  // ...

  return (
    <div className="container"> // highlight-line
      // ...
    </div>
  )
}
```

<!-- We notice that this already has an effect on the appearance of the application. The content is no longer as close to the edges of the browser as it was earlier:-->
 我们注意到，这已经对应用的外观产生了影响。内容不再像以前那样靠近浏览器的边缘。

![](../../images/7/6ea.png)

<!-- Next, let's make some changes to the <i>Notes</i> component, so that it renders the list of notes as a [table](https://getbootstrap.com/docs/4.1/content/tables/). React Bootstrap provides a built-in [Table](https://react-bootstrap.github.io/docs/components/table/) component for this purpose, so there is no need to define CSS classes separately.-->
 接下来，让我们对<i>Notes</i>组件做一些修改，使其将笔记列表渲染成一个[表格](https://getbootstrap.com/docs/4.1/content/tables/)。React Bootstrap为此提供了一个内置的[Table](https://react-bootstrap.github.io/docs/components/table/)组件，所以不需要再单独定义CSS类。

```js
const Notes = ({ notes }) => (
  <div>
    <h2>Notes</h2>
    <Table striped> // highlight-line
      <tbody>
        {notes.map(note =>
          <tr key={note.id}>
            <td>
              <Link to={`/notes/${note.id}`}>
                {note.content}
              </Link>
            </td>
            <td>
              {note.user}
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  </div>
)
```

<!-- The appearance of the application is quite stylish:-->
 该应用的外观相当时尚。

![](../../images/7/7e.png)

<!-- Notice that the React Bootstrap components have to be imported separately from the library as shown below:-->
 注意，React Bootstrap组件必须从库中单独导入，如下图所示。

```js
import { Table } from 'react-bootstrap'
```

#### Forms

<!-- Let's improve the form in the <i>Login</i> view with the help of Bootstrap [forms](https://getbootstrap.com/docs/4.1/components/forms/).-->
 让我们在Bootstrap[表单](https://getbootstrap.com/docs/4.1/components/forms/)的帮助下改进<i>Login</i>视图中的表单。

<!-- React Bootstrap provides built-in [components](https://react-bootstrap.github.io/docs/forms/overview/) for creating forms (although the documentation for them is slightly lacking):-->
 React Bootstrap为创建表单提供了内置的[组件](https://react-bootstrap.github.io/docs/forms/overview/)(尽管它们的文档略显不足)。

```js
let Login = (props) => {
  // ...
  return (
    <div>
      <h2>login</h2>
      <Form onSubmit={onSubmit}>
        <Form.Group>
          <Form.Label>username:</Form.Label>
          <Form.Control
            type="text"
            name="username"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>password:</Form.Label>
          <Form.Control
            type="password"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          login
        </Button>
      </Form>
    </div>
)}
```

<!-- The number of components we need to import increases:-->
 我们需要导入的组件数量增加了。

```js
import { Table, Form, Button } from 'react-bootstrap'
```

<!-- After switching over to the Bootstrap form, our improved application looks like this:-->
切换到Bootstrap表单后，我们改进后的应用如下所示：

![](../../images/7/8ea.png)

#### Notification

<!-- Now that the login form is in better shape, let's take a look at improving our application's notifications:-->
 现在，登录表单的形状更好了，让我们来看看如何改进我们应用的通知。

![](../../images/7/9ea.png)

<!-- Let's add a message for the notification when a user logs into the application. We will store it in the _message_ variable in the <i>App</i> component's state:-->
 让我们为用户登录应用时的通知添加一条信息。我们将把它存储在<i>App</i>组件的状态中的_message_变量中。

```js
const App = () => {
  const [notes, setNotes] = useState([
    // ...
  ])

  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null) // highlight-line

  const login = (user) => {
    setUser(user)
    // highlight-start
    setMessage(`welcome ${user}`)
    setTimeout(() => {
      setMessage(null)
    }, 10000)
    // highlight-end
  }
  // ...
}
```


<!-- We will render the message as a Bootstrap [Alert](https://getbootstrap.com/docs/4.1/components/alerts/) component. Once again, the React Bootstrap library provides us with a matching [React component](https://react-bootstrap.github.io/docs/components/alerts/):-->
 我们将把消息渲染成一个Bootstrap [Alert](https://getbootstrap.com/docs/4.1/components/alerts/)组件。再一次，React Bootstrap库为我们提供了一个匹配的[React组件](https://react-bootstrap.github.io/docs/components/alerts/)。

```js
<div className="container">
// highlight-start
  {(message &&
    <Alert variant="success">
      {message}
    </Alert>
  )}
// highlight-end
  // ...
</div>
```

#### Navigation structure

<!-- Lastly, let's alter the application's navigation menu to use Bootstrap's [Navbar](https://getbootstrap.com/docs/4.1/components/navbar/) component. The React Bootstrap library provides us with [matching built-in components](https://react-bootstrap.github.io/docs/components/navbar/#responsive-behaviors). Through trial and error, we end up with a working solution in spite of the cryptic documentation:-->
 最后，让我们改变应用的导航菜单，使用Bootstrap的[Navbar](https://getbootstrap.com/docs/4.1/components/navbar/) 组件。React Bootstrap库为我们提供了[匹配的内置组件](https://react-bootstrap.github.io/docs/components/navbar/#responsive-behaviors)。通过试验和错误，我们最终得到了一个可行的解决方案，尽管文档中的内容很隐晦。

```js
<Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
  <Navbar.Collapse id="responsive-navbar-nav">
    <Nav className="me-auto">
      <Nav.Link href="#" as="span">
        <Link style={padding} to="/">home</Link>
      </Nav.Link>
      <Nav.Link href="#" as="span">
        <Link style={padding} to="/notes">notes</Link>
      </Nav.Link>
      <Nav.Link href="#" as="span">
        <Link style={padding} to="/users">users</Link>
      </Nav.Link>
      <Nav.Link href="#" as="span">
        {user
          ? <em style={padding}>{user} logged in</em>
          : <Link style={padding} to="/login">login</Link>
        }
      </Nav.Link>
    </Nav>
  </Navbar.Collapse>
</Navbar>
```

<!-- The resulting layout has a very clean and pleasing appearance:-->
 得到的布局有一个非常干净和悦目的外观。

![](../../images/7/10ea.png)


<!-- If the viewport of the browser is narrowed, we notice that the menu "collapses" and it can be expanded by clicking the "hamburger" button:-->
 如果浏览器的视口变窄，我们注意到菜单会 "折叠"，可以通过点击 "汉堡包 "按钮来扩大它。

![](../../images/7/11ea.png)


<!-- Bootstrap and a large majority of existing UI frameworks produce [responsive](https://en.wikipedia.org/wiki/Responsive_web_design) designs, meaning that the resulting applications render well on a variety of different screen sizes.-->
 Bootstrap和大部分现有的UI框架都能产生[响应式](https://en.wikipedia.org/wiki/Responsive_web_design)设计，这意味着所产生的应用能在各种不同的屏幕尺寸上渲染良好的效果。

<!-- Chrome developer tools makes it possible to simulate using our application in the browser of different mobile clients:-->
Chrome开发者工具使得在不同的移动客户端的浏览器中模拟使用我们的应用成为可能。

![](../../images/7/12ea.png)

<!-- You can find the complete code for the application [here](https://github.com/fullstack-hy2020/misc/blob/master/notes-bootstrap.js).-->
你可以找到该应用的完整代码[这里](https://github.com/fullstack-hy2020/misc/blob/master/notes-bootstrap.js)。

### Material UI

<!-- As our second example we will look into the [MaterialUI](https://mui.com/) React library, which implements the [Material design](https://material.io/) visual language developed by Google.-->
 作为第二个例子，我们将研究[MaterialUI](https://mui.com/) React库，它实现了谷歌开发的[Material design](https://material.io/)视觉语言。

<!-- Install the library with the command-->
 用以下命令安装该库

```bash
npm install @mui/material @emotion/react @emotion/styled
```

<!-- Then add the following line to the <i>head</i> tag in the <i>public/index.html</i> file. The line loads Google's font Roboto.-->
 然后在<i>public/index.html</i>文件的<i>head</i>标签中添加以下一行。这一行会加载谷歌的Roboto字体。

```js
<head>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
  // ...
</head>
```

<!-- Now let's use MaterialUI to do the same modifications to the code we did earlier with bootstrap.-->
 现在让我们用MaterialUI来对我们之前用bootstrap做的代码做同样的修改。

<!-- Render the contents of the whole application within a [Container](https://mui.com/components/container/):-->
 在一个[容器](https://mui.com/components/container/)中渲染整个应用的内容。

```js
import { Container } from '@mui/material'

const App = () => {
  // ...
  return (
    <Container>
      // ...
    </Container>
  )
}
```

<!-- Let's start with the <i>Notes</i> component. We'll render the list of notes as a [table](https://mui.com/material-ui/react-table/#simple-table):-->
 让我们从<i>Notes</i>组件开始。我们将把笔记的列表渲染成一个[表格](https://mui.com/material-ui/react-table/#simple-table)。

```js
const Notes = ({ notes }) => (
  <div>
    <h2>Notes</h2>

    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {notes.map(note => (
            <TableRow key={note.id}>
              <TableCell>
                <Link to={`/notes/${note.id}`}>{note.content}</Link>
              </TableCell>
              <TableCell>
                {note.user}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
)
```

<!-- The table looks like so:-->
 这个表格如下所示：

![](../../images/7/63eb.png)

<!-- One less pleasant feature of Material UI is that each component has to be imported separately. The import list for the notes page is quite long:-->
 Material UI的一个不太令人愉快的特点是，每个组件都必须单独导入。笔记页的导入列表相当长。

```js
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from '@mui/material'
```

#### Form

<!-- Next, let's make the login form in the <i>Login</i> view better using the [TextField](https://mui.com/material-ui/react-text-field/) and [Button](https://mui.com/material-ui/api/button/) components:-->
 接下来，让我们使用[TextField](https://mui.com/material-ui/react-text-field/)和[Button](https://mui.com/material-ui/api/button/)组件使<i>Login</i>视图中的登录表单变得更好。

```js
const Login = (props) => {
  const navigate = useNavigate()

  const onSubmit = (event) => {
    event.preventDefault()
    props.onLogin('mluukkai')
    navigate('/')
  }

  return (
    <div>
      <h2>login</h2>
      <form onSubmit={onSubmit}>
        <div>
          <TextField label="username" />
        </div>
        <div>
          <TextField label="password" type='password' />
        </div>
        <div>
          <Button variant="contained" color="primary" type="submit">
            login
          </Button>
        </div>
      </form>
    </div>
  )
}
```

<!-- The end result is:-->
 最终的结果是。

![](../../images/7/64ea.png)

<!-- MaterialUI, unlike Bootstrap, does not provide a component for the form itself. The form here is an ordinary HTML [form](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) element.-->
 MaterialUI与Bootstrap不同，没有为表单本身提供一个组件。这里的表单是一个普通的HTML [form](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form)元素。

<!-- Remember to import all the components used in the form.-->
 记住要导入表单中使用的所有组件。

#### Notification

<!-- The notification displayed on login can be done using the [Alert](https://mui.com/material-ui/react-alert/) component, which is quite similar to Bootstrap's equivalent component:-->
 登录时显示的通知可以用[Alert](https://mui.com/material-ui/react-alert/)组件来完成，它与Bootstrap's equivalent组件非常相似。

```js
<div>
// highlight-start
  {(message &&
    <Alert severity="success">
      {message}
    </Alert>
  )}
// highlight-end
</div>
```

<!-- Alert is quite stylish:-->
 Alert是相当时尚的。

![](../../images/7/65ea.png)

#### Navigation structure

<!-- We can implement navigation using the [AppBar](https://mui.com/material-ui/react-app-bar/) component.-->
 我们可以使用[AppBar](https://mui.com/material-ui/react-app-bar/)组件实现导航。

<!-- If we use the example code from the documentation-->
 如果我们使用文档中的示例代码

```js
<AppBar position="static">
  <Toolbar>
    <IconButton edge="start" color="inherit" aria-label="menu">
    </IconButton>
    <Button color="inherit">
      <Link to="/">home</Link>
    </Button>
    <Button color="inherit">
      <Link to="/notes">notes</Link>
    </Button>
    <Button color="inherit">
      <Link to="/users">users</Link>
    </Button>
    <Button color="inherit">
      {user
        ? <em>{user} logged in</em>
        : <Link to="/login">login</Link>
      }
    </Button>
  </Toolbar>
</AppBar>
```

<!-- we do get working navigation, but it could look better-->
我们确实得到了有效的导航，但它可以看起来更好一些

![](../../images/7/66ea.png)

<!-- We can find a better way from the [documentation](https://mui.com/material-ui/guides/composition/#routing-libraries). We can use [component props](https://mui.com/material-ui/guides/composition/#component-prop) to define how the root element of a MaterialUI component is rendered.-->
我们可以从[文档](https://mui.com/material-ui/guides/composition/#routing-libraries)中找到一个更好的方法。我们可以使用[组件prop](https://mui.com/material-ui/guides/composition/#component-prop)来定义MaterialUI组件的根元素如何被渲染。

<!-- By defining-->
通过定义

```js
<Button color="inherit" component={Link} to="/">
  home
</Button>
```

<!-- the _Button_ component is rendered so that its root component is react-router-dom's _Link_ which receives its path as prop field _to_.-->
 _Button_组件被渲染，所以它的根元素是react-router-dom's _Link_，它的路径被当作prop字段_to_。

<!-- The code for the navigation bar is the following:-->
 导航栏的代码如下。

```js
<AppBar position="static">
  <Toolbar>
    <Button color="inherit" component={Link} to="/">
      home
    </Button>
    <Button color="inherit" component={Link} to="/notes">
      notes
    </Button>
    <Button color="inherit" component={Link} to="/users">
      users
    </Button>
    {user
      ? <em>{user} logged in</em>
      : <Button color="inherit" component={Link} to="/login">
          login
        </Button>
    }
  </Toolbar>
</AppBar>
```

<!-- and it looks like we want it to:-->
 它如下所示：我们希望的那样。

![](../../images/7/67ea.png)

<!-- The code of the application can be found from [here](https://github.com/fullstack-hy2020/misc/blob/master/notes-materialui.js).-->
 应用的代码可以从[这里](https://github.com/fullstack-hy2020/misc/blob/master/notes-materialui.js)找到。

### Closing thoughts

<!-- The difference between react-bootstrap and MaterialUI is not big. It's up to you which one you find better-looking.-->
 react-bootstrap和MaterialUI之间的区别并不大。这取决于你觉得哪一个更好看。
<!-- I myself have not used MaterialUI a lot, but my first impressions are positive. Its documentation is a bit better than react-bootstrap's.-->
 我自己并没有经常使用MaterialUI，但我的第一印象是积极的。它的文档比 react-bootstrap's 好一点。
<!-- According to https://www.npmtrends.com/ which tracks the popularity of different npm-libraries, MaterialUI passed react-bootstrap in popularity at the end of 2018:-->
 根据追踪不同npm-libraries流行度的 https://www.npmtrends.com/ ，MaterialUI在2018年底的流行度超过了react-bootstrap。

![](../../images/7/68ea.png)

<!-- In the two previous examples, we used the UI frameworks with the help of React-integration libraries.-->
 在之前的两个例子中，我们在React-集成库的帮助下使用了UI框架。

<!-- Instead of using the [React Bootstrap](https://react-bootstrap.github.io/) library, we could have just as well used Bootstrap directly by defining CSS classes to our application's HTML elements. Instead of defining the table with the <i>Table</i> component:-->
我们没有使用[React Bootstrap](https://react-bootstrap.github.io/)库，而是通过给我们的应用''的HTML元素定义CSS类，直接使用Bootstrap。而不是用<i>Table</i>组件来定义表格。

```js
<Table striped>
  // ...
</Table>
```

<!-- We could have used a regular HTML <i>table</i> and added the required CSS class:-->
 我们可以使用一个普通的HTML <i>table</i>，并添加所需的CSS类。

```js
<table className="table striped">
  // ...
</table>
```

<!-- The benefit of using the React Bootstrap library is not that evident from this example.-->
 从这个例子来看，使用React Bootstrap库的好处不是那么明显。

<!-- In addition to making the frontend code more compact and readable, another benefit of using React UI framework libraries is that they include the JavaScript that is needed to make specific components work. Some Bootstrap components require a few unpleasant [JavaScript dependencies](https://getbootstrap.com/docs/4.1/getting-started/introduction/#js) that we would prefer not to include in our React applications.-->
 除了使前端代码更加紧凑和可读之外，使用React UI框架库的另一个好处是，它们包括使特定组件工作所需的JavaScript。一些Bootstrap组件需要一些不愉快的[JavaScript依赖](https://getbootstrap.com/docs/4.1/getting-started/introduction/#js)，我们宁愿不在我们的React应用中包含这些依赖。

<!-- Some potential downsides to using UI frameworks through integration libraries instead of using them "directly" are that integration libraries may have unstable APIs and poor documentation. The situation with [Semantic UI React](https://react.semantic-ui.com) is a lot better than with many other UI frameworks, as it is an official React integration library.-->
 通过集成库使用UI框架而不是 "直接 "使用它们的一些潜在缺点是，集成库可能有不稳定的API，而且文档很差。与其他许多UI框架相比，[Semantic UI React](https://react.semantic-ui.com)的情况要好得多，因为它是一个官方的React集成库。


<!-- There is also the question of whether or not UI framework libraries should be used in the first place. It is up to everyone to form their own opinion, but for people lacking knowledge in CSS and web design, they are very useful tools.-->
 还有一个问题是，首先是否应该使用UI框架库。这取决于每个人形成自己的观点，但对于缺乏CSS和网页设计知识的人来说，它们是非常有用的工具。

### Other UI frameworks

<!-- Here are some other UI frameworks for your consideration. If you do not see your favorite UI framework in the list, please make a pull request to the course material.-->
 这里有一些其他的UI框架供你考虑。如果你在列表中没有看到你喜欢的UI框架，请向教材提出拉动请求。

<!-- - <https://bulma.io/> -->
- <https://bulma.io/>
<!-- - <https://ant.design/> -->
- <https://ant.design/>
<!-- - <https://get.foundation/> -->
- <https://get.foundation/>
<!-- - <https://chakra-ui.com/> -->
- <https://chakra-ui.com/>
<!-- - <https://tailwindcss.com/> -->
- <https://tailwindcss.com/>
<!-- - <https://semantic-ui.com/> -->
- <https://semantic-ui.com/>
<!-- - <https://mantine.dev/> -->
- <https://mantine.dev/>
<!-- - <https://react.fluentui.dev/> -->
- <https://react.fluentui.dev/>
<!-- - <https://storybook.js.org> -->
- <https://storybook.js.org>
<!-- - <https://www.primefaces.org/primereact/> -->
- <https://www.primefaces.org/primereact/>
<!-- - <https://v2.grommet.io> -->
- <https://v2.grommet.io>
<!-- - <https://blueprintjs.com> -->
- <https://blueprintjs.com>
<!-- - <https://evergreen.segment.com> -->
- <https://evergreen.segment.com>
<!-- - <https://www.radix-ui.com/> -->
- <https://www.radix-ui.com/>
<!-- - <https://react-spectrum.adobe.com/react-aria/index.html> -->
- <https://react-spectrum.adobe.com/react-aria/index.html>
<!-- - <https://master.co/> -->
- <https://master.co/>
<!-- - <https://www.radix-ui.com/> -->
- <https://www.radix-ui.com/>

### Styled components

<!-- There are also [other ways](https://blog.bitsrc.io/5-ways-to-style-react-components-in-2019-30f1ccc2b5b) of styling React applications that we have not yet taken a look at.-->
 还有一些我们还没有看过的React应用的[其他方式](https://blog.bitsrc.io/5-ways-to-style-react-components-in-2019-30f1ccc2b5b)。

<!-- The [styled components](https://www.styled-components.com/) library offers an interesting approach for defining styles through [tagged template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates) that were introduced in ES6.-->
 [styled components](https://www.styled-components.com/) 库提供了一种有趣的方法，通过ES6中引入的[标签模板字面](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates)来定义样式。

<!-- Let's make a few changes to the styles of our application with the help of styled components. First, install the package with the command:-->
 让我们在风格化组件的帮助下对我们应用的风格做一些改变。首先，用命令安装该包。

```bash
npm install styled-components
```

<!-- Then let's define two components with styles:-->
 然后让我们定义两个带样式的组件。

```js
import styled from 'styled-components'

const Button = styled.button`
  background: Bisque;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid Chocolate;
  border-radius: 3px;
`

const Input = styled.input`
  margin: 0.25em;
`
```

<!-- The code above creates styled versions of the <i>button</i> and <i>input</i> HTML elements and then assigns them to the <i>Button</i> and <i>Input</i> variables.-->
 上面的代码创建了<i>button</i>和<i>input</i>HTML元素的样式版本，然后将它们分配给<i>Button</i>和<i>Input</i>变量。

<!-- The syntax for defining the styles is quite interesting, as the CSS rules are defined inside of backticks.-->
 定义样式的语法相当有趣，因为CSS规则是在反斜线内定义的。

<!-- The styled components that we defined work exactly like regular <i>button</i> and <i>input</i> elements, and they can be used the same way:-->
我们定义的样式组件与普通的<i>button</i>和<i>input</i>元素完全一样，它们可以以同样的方式使用。

```js
const Login = (props) => {
  // ...
  return (
    <div>
      <h2>login</h2>
      <form onSubmit={onSubmit}>
        <div>
          username:
          <Input /> // highlight-line
        </div>
        <div>
          password:
          <Input type='password' /> // highlight-line
        </div>
        <Button type="submit" primary=''>login</Button> // highlight-line
      </form>
    </div>
  )
}
```

<!-- Let's create a few more components for styling that application which will be styled versions of <i>div</i> elements:-->
 让我们再创建几个组件，为该应用定型，它们将是<i>div</i>元素的定型版本。

```js
const Page = styled.div`
  padding: 1em;
  background: papayawhip;
`

const Navigation = styled.div`
  background: BurlyWood;
  padding: 1em;
`

const Footer = styled.div`
  background: Chocolate;
  padding: 1em;
  margin-top: 1em;
`
```

<!-- Let's use the components in our application:-->
 让我们在我们的应用中使用这些组件。

```js
const App = () => {
  // ...

  return (
     <Page> // highlight-line
      <Navigation> // highlight-line
        <Link style={padding} to="/">home</Link>
        <Link style={padding} to="/notes">notes</Link>
        <Link style={padding} to="/users">users</Link>
        {user
          ? <em>{user} logged in</em>
          : <Link style={padding} to="/login">login</Link>
        }
      </Navigation> // highlight-line

      <Routes>
        <Route path="/notes/:id" element={<Note note={note} />} />
        <Route path="/notes" element={<Notes notes={notes} />} />
        <Route path="/users" element={user ? <Users /> : <Navigate replace to="/login" />} />
        <Route path="/login" element={<Login onLogin={login} />} />
        <Route path="/" element={<Home />} />
      </Routes>

      <Footer> // highlight-line
        <em>Note app, Department of Computer Science 2022</em>
      </Footer> // highlight-line
    </Page> // highlight-line
  )
}
```

<!-- The appearance of the resulting application is shown below:-->
 由此产生的应用的外观如下所示。

![](../../images/7/18ea.png)

<!-- Styled components have seen a consistent growth in popularity in recent times, and quite a lot of people consider it to be the best way of defining styles in React applications.-->
 样式化组件在最近一段时间里持续增长，相当多的人认为它是在React应用中定义样式的最佳方式。

</div>

<div class="tasks">

### Exercises

<!-- The exercises related to the topics presented here, can be found at the end of this course material section in the exercise set [for extending the blog list application](/en/part7/exercises_extending_the_bloglist).-->
 与这里介绍的主题相关的练习，可以在本课程教材部分的末尾找到[扩展博客列表应用](/en/part7/exercises_extending_the_bloglist)的练习集。

</div>
