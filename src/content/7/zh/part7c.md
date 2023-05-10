---
mainImage: ../../../images/part-7.svg
part: 7
letter: c
lang: zh
---

<div class="content">

<!-- In part 2, we examined two different ways of adding styles to our application: the old-school [single CSS](/en/part2/adding_styles_to_react_app) file and [inline styles](/en/part2/adding_styles_to_react_app#inline-styles). In this part, we will take a look at a few other ways.-->
在第二部分，我们检查了两种不同的方法为我们的应用程序添加样式：老式的[单个CSS](/en/part2/adding_styles_to_react_app)文件和[内联样式](/en/part2/adding_styles_to_react_app#inline-styles)。在本部分中，我们将看一下其他一些方法。

### Ready-made UI libraries

<!-- One approach to defining styles for an application is to use a ready-made "UI framework".-->
一种定义应用程序样式的方法是使用准备好的“UI框架”。

<!-- One of the first widely popular UI frameworks was the [Bootstrap](https://getbootstrap.com/) toolkit created by Twitter which may still be the most popular framework. Recently, there has been an explosion in the number of new UI frameworks that have entered the arena. The selection is so vast that there is little hope of creating an exhaustive list of options.-->
一个最早广受欢迎的UI框架是由Twitter创建的[Bootstrap](https://getbootstrap.com/)工具包，它可能仍然是最受欢迎的框架。最近，新的UI框架的数量爆炸式增长，已经进入了这个领域。选择如此之多，几乎不可能列出所有的选项。

<!-- Many UI frameworks provide developers of web applications with ready-made themes and "components" like buttons, menus, and tables. We write components in quotes because, in this context, we are not talking about React components. Usually, UI frameworks are used by including the CSS stylesheets and JavaScript code of the framework in the application.-->
许多UI框架为Web应用程序的开发人员提供了现成的主题和“组件”，如按钮，菜单和表格。我们用引号写组件，因为在这种情况下，我们不是在谈论React组件。通常，UI框架是通过在应用程序中包含框架的CSS样式表和JavaScript代码来使用的。

<!-- Many UI frameworks have React-friendly versions where the framework''s "components" have been transformed into React components. There are a few different React versions of Bootstrap like [reactstrap](http://reactstrap.github.io/) and [react-bootstrap](https://react-bootstrap.github.io/).-->
许多UI框架都有针对React的版本，其中框架的“组件”已被转换成React组件。有几个不同的React版本的Bootstrap，如[reactstrap](http://reactstrap.github.io/)和[react-bootstrap](https://react-bootstrap.github.io/)。

<!-- Next, we will take a closer look at two UI frameworks, Bootstrap and [MaterialUI](https://mui.com/). We will use both frameworks to add similar styles to the application we made in the [React Router](/en/part7/react_router) section of the course material.-->
接下来，我们将仔细研究两个UI框架，Bootstrap和[MaterialUI](https://mui.com/)。 我们将使用两个框架来为我们在[React Router](/en/part7/react_router)部分中制作的应用程序添加类似的样式。

### React Bootstrap

<!-- Let''s start by taking a look at Bootstrap with the help of the [react-bootstrap](https://react-bootstrap.github.io/) package.-->
让我们借助[react-bootstrap](https://react-bootstrap.github.io/)包来先看一看Bootstrap吧。

<!-- Let''s install the package with the command:-->
让我们用下面的命令安装这个包：

```bash
npm install react-bootstrap
```

<!-- Then let''s add a [link for loading the CSS stylesheet](https://react-bootstrap.github.io/getting-started/introduction#stylesheets) for Bootstrap inside of the <i>head</i> tag in the <i>public/index.html</i> file of the application:-->
那么，让我们在应用程序的<i>public/index.html</i>文件的<i>head</i>标签中添加一个[加载Bootstrap CSS样式表的链接](https://react-bootstrap.github.io/getting-started/introduction#stylesheets)：

```js
<head>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
    integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
    crossorigin="anonymous"
  />
  // ...
</head>
```

<!-- When we reload the application, we notice that it already looks a bit more stylish:-->
当我们重新加载应用程序时，我们注意到它已经看起来更加时尚了：

![browser notes app with bootstrap](../../images/7/5ea.png)

<!-- In Bootstrap, all of the contents of the application are typically rendered inside a [container](https://getbootstrap.com/docs/4.1/layout/overview/#containers). In practice this is accomplished by giving the root _div_ element of the application the  _container_ class attribute:-->
在Bootstrap中，应用程序的所有内容通常都会渲染在[容器](https://getbootstrap.com/docs/4.1/layout/overview/#containers)中。在实践中，这是通过给应用程序的根_div_元素添加_container_类属性来实现的：

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

<!-- We notice that this already affected the appearance of the application. The content is no longer as close to the edges of the browser as it was earlier:-->
我们注意到这已经影响了应用程序的外观。内容不再像以前那样接近浏览器的边缘了：

![browser notes app with margin spacing](../../images/7/6ea.png)

#### Tables

<!-- Next, let''s make some changes to the <i>Notes</i> component so that it renders the list of notes as a [table](https://getbootstrap.com/docs/4.1/content/tables/). React Bootstrap provides a built-in [Table](https://react-bootstrap.github.io/components/table/) component for this purpose, so there is no need to define CSS classes separately.-->
接下来，让我们对<i>Notes</i>组件做一些更改，以便它将注释列表渲染为[表](https://getbootstrap.com/docs/4.1/content/tables/)。 React Bootstrap提供了一个内置的[表](https://react-bootstrap.github.io/components/table/)组件，因此无需单独定义CSS类。

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
应用的外观相当时尚：

![browser notes tab with built-in table](../../images/7/7e.png)

<!-- Notice that the React Bootstrap components have to be imported separately from the library as shown below:-->
注意，React Bootstrap 组件必须单独从库中导入，如下所示：

```js
import { Table } from 'react-bootstrap'
```

#### Forms

<!-- Let''s improve the form in the <i>Login</i> view with the help of Bootstrap [forms](https://getbootstrap.com/docs/4.1/components/forms/).-->
让我们借助Bootstrap [forms](https://getbootstrap.com/docs/4.1/components/forms/) 来改善<i>Login</i> 视图中的表单。

<!-- React Bootstrap provides built-in [components](https://react-bootstrap.github.io/forms/overview/) for creating forms (although the documentation for them is slightly lacking):-->
React Bootstrap 提供了内置的 [组件](https://react-bootstrap.github.io/forms/overview/) 用于创建表单（尽管它们的文档略显不足）：

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
          <Form.Label>password:</Form.Label>
          <Form.Control
            type="password"
          />
          <Button variant="primary" type="submit">
            login
          </Button>
        </Form.Group>
      </Form>
    </div>
  )
}
```

<!-- The number of components we need to import increases:-->
我们需要进口的零件数量增加了：

```js
import { Table, Form, Button } from 'react-bootstrap'
```

<!-- After switching over to the Bootstrap form, our improved application looks like this:-->
在切换到Bootstrap表单后，我们改进的应用程序看起来像这样：

![browser notes app with bootstrap login](../../images/7/8ea.png)

#### Notification

<!-- Now that the login form is in better shape, let's take a look at improving our application's notifications:-->
现在登录表单已经改善了，让我们来看看如何改进我们应用程序的通知：

![browser notes app with bootstrap notification](../../images/7/9ea.png)

<!-- Let's add a message for the notification when a user logs into the application. We will store it in the _message_ variable in the <i>App</i> component's state:-->
让我们为应用程序登录时添加一条通知消息。我们将把它存储在<i>App</i>组件的state中的_message_变量中：

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

<!-- We will render the message as a Bootstrap [Alert](https://getbootstrap.com/docs/4.1/components/alerts/) component. Once again, the React Bootstrap library provides us with a matching [React component](https://react-bootstrap.github.io/components/alerts/):-->
我们将把这条消息呈现为 Bootstrap [警告](https://getbootstrap.com/docs/4.1/components/alerts/) 组件。再一次，React Bootstrap 库为我们提供了一个匹配的 [React 组件](https://react-bootstrap.github.io/components/alerts/)：

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

<!-- Lastly, let's alter the application's navigation menu to use Bootstrap''s [Navbar](https://getbootstrap.com/docs/4.1/components/navbar/) component. The React Bootstrap library provides us with [matching built-in components](https://react-bootstrap.github.io/components/navbar/#navbars-mobile-friendly). Through trial and error, we end up with a working solution despite the cryptic documentation:-->
最后，让我们改变应用程序的导航菜单以使用Bootstrap的[Navbar](https://getbootstrap.com/docs/4.1/components/navbar/)组件。 React Bootstrap库为我们提供[匹配的内置组件](https://react-bootstrap.github.io/components/navbar/#navbars-mobile-friendly)。 通过试错，我们最终得到了一个可行的解决方案，尽管文档晦涩难懂：

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
结果布局具有非常干净且令人愉悦的外观：

![browser notes app bootstrap black navigation bar](../../images/7/10ea.png)

<!-- If the viewport of the browser is narrowed, we notice that the menu "collapses" and it can be expanded by clicking the "hamburger" button:-->
如果浏览器的视口变窄，我们会注意到菜单“折叠”，并且可以通过点击“汉堡”按钮来展开：

![browser notes app with hamburger menu](../../images/7/11ea.png)

<!-- Bootstrap and a large majority of existing UI frameworks produce [responsive](https://en.wikipedia.org/wiki/Responsive_web_design) designs, meaning that the resulting applications render well on a variety of different screen sizes.-->
Bootstrap和绝大多数现有的UI框架都能产生[响应式](https://en.wikipedia.org/wiki/Responsive_web_design)设计，这意味着所产生的应用程序可以在多种不同的屏幕尺寸上得到很好的呈现。

<!-- Chrome''s developer tools make it possible to simulate using our application in the browser of different mobile clients:-->
Chrome 的开发者工具可以让我们在不同移动客户端的浏览器中模拟使用我们的应用程序：

![chrome devtools with mobile browser preview of notes app](../../images/7/12ea.png)

<!-- You can find the complete code for the application [here](https://github.com/fullstack-hy2020/misc/blob/master/notes-bootstrap.js).-->
你可以在[这里](https://github.com/fullstack-hy2020/misc/blob/master/notes-bootstrap.js)找到应用程序的完整代码。

### Material UI

<!-- As our second example, we will look into the [MaterialUI](https://mui.com/) React library, which implements the [Material Design](https://material.io/) visual language developed by Google.-->
作为我们的第二个例子，我们将研究由Google开发的[Material Design](https://material.io/)视觉语言实现的[MaterialUI](https://mui.com/) React库。

<!-- Install the library with the command-->
安装库使用命令：`npm install library-name`

```bash
npm install @mui/material @emotion/react @emotion/styled
```

<!-- Now let''s use MaterialUI to do the same modifications to the code we did earlier with Bootstrap.-->
现在让我们使用MaterialUI来对我们先前用Bootstrap做的代码做相同的修改。

<!-- Render the contents of the whole application within a [Container](https://mui.com/components/container/):-->
在[容器](https://mui.com/components/container/)中渲染整个应用程序的内容：

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

#### Table

<!-- Let's start with the <i>Notes</i> component. We'll render the list of notes as a [table](https://mui.com/material-ui/react-table/#simple-table):-->
让我们从<i>笔记</i>组件开始。我们将把笔记列表渲染为[表格](https://mui.com/material-ui/react-table/#simple-table)：

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
| Item | Price |
|------|-------|
|Apple | $1.99 |
|Banana| $0.99 |

| 项目 | 价格 |
|------|-------|
|苹果 | $1.99 |
|香蕉 | $0.99 |

![browser notes materialUI table](../../images/7/63eb.png)

<!-- One less pleasant feature of Material UI is that each component has to be imported separately. The import list for the notes page is quite long:-->
一个不太令人愉快的Material UI特性是每个组件都必须单独导入。笔记页面的导入列表相当长：

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

<!-- Next, let''s make the login form in the <i>Login</i> view better using the [TextField](https://mui.com/material-ui/react-text-field/) and [Button](https://mui.com/material-ui/api/button/) components:-->
接下来，让我们使用[文本框](https://mui.com/material-ui/react-text-field/)和[按钮](https://mui.com/material-ui/api/button/)组件来改进<i>登录</i>视图中的登录表单：

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

<!-- The result is:-->
结果是：

![browser notes app materialUI login form](../../images/7/64ea.png)

<!-- MaterialUI, unlike Bootstrap, does not provide a component for the form itself. The form here is an ordinary HTML [form](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) element.-->
MaterialUI 与 Bootstrap 不同，不提供表单本身的组件。这里的表单是普通的[表单](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form)元素。

<!-- Remember to import all the components used in the form.-->
记得导入表单中使用的所有组件。

#### Notification

<!-- The notification displayed on login can be done using the [Alert](https://mui.com/material-ui/react-alert/) component, which is quite similar to Bootstrap''s equivalent component:-->
登录时显示的通知可以使用[警报](https://mui.com/material-ui/react-alert/)组件完成，它与Bootstrap的等效组件非常相似：

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
**警报相当时尚：**

![browser notes app materialUI notifications](../../images/7/65ea.png)

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
我们得到了可用的导航，但是它可以看起来更好。

![browser notes app materialUI blue navbar](../../images/7/66ea.png)

<!-- We can find a better way from the [documentation](https://mui.com/material-ui/guides/composition/#routing-libraries). We can use [component props](https://mui.com/material-ui/guides/composition/#component-prop) to define how the root element of a MaterialUI component is rendered.-->
我们可以从[文档](https://mui.com/material-ui/guides/composition/#routing-libraries)中找到一种更好的方法。我们可以使用[组件属性](https://mui.com/material-ui/guides/composition/#component-prop)来定义MaterialUI组件的根元素如何渲染。

<!-- By defining-->
the problem

通过定义问题

```js
<Button color="inherit" component={Link} to="/">
  home
</Button>
```

<!-- the _Button_ component is rendered so that its root component is react-router-dom''s _Link_ which receives its path as the prop field _to_.-->
_按钮_ 组件被渲染成其根组件是 `react-router-dom` 的 _Link_，它接收 _to_ 属性字段作为路径。

<!-- The code for the navigation bar is the following:-->
以下是导航栏的代码：

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
**英文：**
We have a lot of work to do

**中文：**
我们有很多工作要做

![browser notes app MaterialUI blue nav bar white text](../../images/7/67ea.png)

<!-- The code of the application can be found [here](https://github.com/fullstack-hy2020/misc/blob/master/notes-materialui.js).-->
应用程序的代码可以在[这里](https://github.com/fullstack-hy2020/misc/blob/master/notes-materialui.js)找到。

### Closing thoughts

<!-- The difference between react-bootstrap and MaterialUI is not big. It''s up to you which one you find better looking.-->
**区别在于React-Bootstrap和MaterialUI不大，取决于你觉得哪一个更好看。**
<!-- I have not used MaterialUI a lot, but my first impressions are positive. Its documentation is a bit better than react-bootstrap''s.-->
我没有大量使用MaterialUI，但我的第一印象是正面的。它的文档比react-bootstrap的要好一些。
<!-- According to <https://www.npmtrends.com/> which tracks the popularity of different npm-libraries, MaterialUI passed react-bootstrap in popularity at the end of 2018:-->
根据跟踪不同npm库流行度的<https://www.npmtrends.com/>，2018年底MaterialUI超过了react-bootstrap的流行度：

![npmtrends of materialUI vs bootstrap](../../images/7/68ea.png)

<!-- In the two previous examples, we used the UI frameworks with the help of React-integration libraries.-->
在前两个例子中，我们利用React集成库的帮助使用了UI框架。

<!-- Instead of using the [React Bootstrap](https://react-bootstrap.github.io/) library, we could have just as well used Bootstrap directly by defining CSS classes for our application''s HTML elements. Instead of defining the table with the <i>Table</i> component:-->
代替使用[React Bootstrap](https://react-bootstrap.github.io/)库，我们也可以直接使用Bootstrap，为我们应用的HTML元素定义CSS类。而不是用<i>Table</i>组件定义表格：

```js
<Table striped>
  // ...
</Table>
```

<!-- We could have used a regular HTML <i>table</i> and added the required CSS class:-->
我们可以使用一个普通的HTML <i>表格</i> 并添加所需的CSS类：

```js
<table className="table striped">
  // ...
</table>
```

<!-- The benefit of using the React Bootstrap library is not that evident from this example.-->
使用React Bootstrap库的好处在这个例子中并不是很明显。

<!-- In addition to making the frontend code more compact and readable, another benefit of using React UI framework libraries is that they include the JavaScript that is needed to make specific components work. Some Bootstrap components require a few unpleasant [JavaScript dependencies](https://getbootstrap.com/docs/4.1/getting-started/introduction/#js) that we would prefer not to include in our React applications.-->
另外，使用React UI框架库的另一个好处是它们包含了使特定组件工作所需的JavaScript。一些Bootstrap组件需要一些令人不快的[JavaScript依赖](https://getbootstrap.com/docs/4.1/getting-started/introduction/#js)，我们不希望在我们的React应用中包含它们。

<!-- Some potential downsides to using UI frameworks through integration libraries instead of using them "directly" are that integration libraries may have unstable APIs and poor documentation. The situation with [Semantic UI React](https://react.semantic-ui.com) is a lot better than with many other UI frameworks, as it is an official React integration library.-->
使用集成库而不是直接使用UI框架的潜在缺点是集成库可能具有不稳定的API和糟糕的文档。[Semantic UI React](https://react.semantic-ui.com)的情况比许多其他UI框架要好得多，因为它是官方的React集成库。

<!-- There is also the question of whether or not UI framework libraries should be used in the first place. It is up to everyone to form their own opinion, but for people lacking knowledge in CSS and web design, they are very useful tools.-->
也有一个问题是，UI框架库是否应该首先被使用。每个人都可以形成自己的意见，但对于缺乏CSS和网页设计知识的人来说，它们是非常有用的工具。

### Other UI frameworks

<!-- Here are some other UI frameworks for your consideration. If you do not see your favorite UI framework in the list, please make a pull request to the course material.-->
这里有一些其他的UI框架供您参考。如果您没有在列表中看到您喜欢的UI框架，请提交一个拉取请求到课程资料中。

<!-- - <https://bulma.io/>-->
[Bulma](https://bulma.io/)
<!-- - <https://ant.design/>-->
- <https://ant.design/zh-CN/>
<!-- - <https://get.foundation/>-->
<https://get.foundation/zh-cn/>
<!-- - <https://chakra-ui.com/>-->
# [Chakra UI](https://chakra-ui.com/)

[Chakra UI](https://chakra-ui.com/)是一个基于React的组件库，旨在提高开发者的生产力，并提供一个实现访问性和可定制性的简单方法。

# [Chakra UI](https://chakra-ui.com/)
[Chakra UI](https://chakra-ui.com/)是一个基于React的组件库，旨在提高开发者的生产力，并提供一个实现访问性和可定制性的简单方法。
<!-- - <https://tailwindcss.com/>-->
[Tailwind CSS](https://tailwindcss.com/)
<!-- - <https://semantic-ui.com/>-->
- [Semantic UI](https://semantic-ui.com/)
<!-- - <https://mantine.dev/>-->
<https://mantine.dev/> 中文版：<https://mantine.dev/zh-cn/>
<!-- - <https://react.fluentui.dev/>-->
[React Fluent UI](https://react.fluentui.dev/)
<!-- - <https://storybook.js.org>-->
[Storybook.js官网](https://storybook.js.org)
<!-- - <https://www.primefaces.org/primereact/>-->
# [PrimeReact](https://www.primefaces.org/primereact/)
PrimeReact 是一个由 PrimeTek 开发的 React 组件库，它被设计用于建立丰富而又强大的 React 应用程序。
<!-- - <https://v2.grommet.io>-->
<https://v2.grommet.io> 

[网址：https://v2.grommet.io](https://v2.grommet.io)
<!-- - <https://blueprintjs.com>-->
<https://blueprintjs.com>

[蓝图JS](https://blueprintjs.com)
<!-- - <https://evergreen.segment.com>-->
<https://evergreen.segment.com> 中文版：<https://evergreen.segment.com>
<!-- - <https://www.radix-ui.com/>-->
<https://www.radix-ui.com/> 的中文翻译： 

<https://www.radix-ui.com/>
<!-- - <https://react-spectrum.adobe.com/react-aria/index.html>-->
[React-Spectrum.Adobe.com React-Aria 索引](https://react-spectrum.adobe.com/react-aria/index.html)
<!-- - <https://master.co/>-->
<https://master.co/>

<https://master.co/>中文版
<!-- - <https://www.radix-ui.com/>-->
<https://www.radix-ui.com/>：Radix UI - 快速构建响应式用户界面
<!-- - <https://nextui.org/>-->
- <https://nextui.org/> 中文版：<https://nextui.org/zh/>

### Styled components

<!-- There are also [other ways](https://blog.bitsrc.io/5-ways-to-style-react-components-in-2019-30f1ccc2b5b) of styling React applications that we have not yet taken a look at.-->
也有[其他方法](https://blog.bitsrc.io/5-ways-to-style-react-components-in-2019-30f1ccc2b5b)来样式化React应用，我们还没有看过。

<!-- The [styled components](https://www.styled-components.com/) library offers an interesting approach for defining styles through [tagged template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates) that were introduced in ES6.-->
[Styled Components](https://www.styled-components.com/) 库提供了一种有趣的方法，通过在ES6中引入的 [标记模板文字](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates) 来定义样式。

<!-- Let''s make a few changes to the styles of our application with the help of styled components. First, install the package with the command:-->
让我们借助 styled components 来对我们应用的样式做几处修改。首先，使用以下命令安装该包：

```bash
npm install styled-components
```

<!-- Then let''s define two components with styles:-->
那么我们来定义两个有样式的组件：

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
上面的代码创建了 <i>按钮</i> 和 <i>输入</i> HTML 元素的样式版本，然后将它们分别赋值给 <i>按钮</i> 和 <i>输入</i> 变量。

<!-- The syntax for defining the styles is quite interesting, as the CSS rules are defined inside of backticks.-->
`定义样式的语法相当有趣，因为CSS规则定义在反引号内。`

<!-- The styled components that we defined work exactly like regular <i>button</i> and <i>input</i> elements, and they can be used in the same way:-->
我们定义的样式组件的工作方式与普通的<i>button</i>和<i>input</i>元素完全相同，它们可以以相同的方式使用：

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

<!-- Let''s create a few more components for styling this application which will be styled versions of <i>div</i> elements:-->
让我们为这个应用程序创建一些更多的组件来进行样式设计，这些将是<i>div</i>元素的样式版本：

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

<!-- Let''s use the components in our application:-->
让我们在我们的应用程序中使用组件吧：

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
以下是所得应用程序的外观：

![browser notes app styled components](../../images/7/18ea.png)

<!-- Styled components have seen consistent growth in popularity in recent times, and quite a lot of people consider it to be the best way of defining styles in React applications.-->
最近，受欢迎程度不断上升的受欢迎的样式组件，很多人认为它是在React应用程序中定义样式的最佳方式。

</div>

<div class="tasks">

### Exercises

<!-- The exercises related to the topics presented here can be found at the end of this course material section in the exercise set [for extending the blog list application](/en/part7/exercises_extending_the_bloglist).-->
这里提到的话题相关的练习可以在本课程材料部分末尾找到[扩展Blog列表应用程序](/en/part7/exercises_extending_the_bloglist)的练习集。

</div>
