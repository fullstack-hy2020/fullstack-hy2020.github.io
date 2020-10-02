---
mainImage: ../../../images/part-5.svg
part: 5
letter: a
lang: zh
---

<div class="content">


<!-- In the last two parts, we have mainly concentrated on the backend, and the frontend does not yet support the user management we implemented to the backend in part 4. -->
在上两章节中，我们主要关注于后端，但前端目前还不支持我们在第四章节中实现的后端用户管理。

<!-- At the moment the frontend shows existing notes, and lets users change the state of a note from important to not important and vice versa. New notes cannot be added anymore because of the changes made to the backend in part 4: the backend now expects that a token verifying a user's identity is sent with the new note. -->

目前前端能够展示已经存在的 Note，并且允许用户切换 Note 的重要程度。由于我们在第四章节的修改，新的 Note 不能再添加了：因为在新建 Note 前，后端现在需要 token 来验证用户。

<!-- We'll now implement a part of the required user management functionality to the frontend. Let's begin with user login. Throughout this part we will assume that new users will not be added from the frontend. -->

我们现在将实现前台的用户管理功能的一部分。首先从用户登录开始，在这一章节中，我们假设还不会从前端来添加用户。

<!-- A login form has now been added to the top of the page. The form for adding new notes has also been moved to the top of the list of notes. -->

登录表单已经添加到了页面顶端。添加 Note 的表单也已经移到了 Note 列表的顶部。

![](../../images/5/1e.png)

<!-- The code of the <i>App</i> component now looks as follows: -->
<i>App</i> 组件的代码如下：

```js
const App = () => {
  const [notes, setNotes] = useState([]) 
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  // highlight-start
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
// highlight-end

  useEffect(() => {
    noteService
      .getAll().then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  // ...

// highlight-start
  const handleLogin = (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
  }
  // highlight-end

  return (
    <div>
      <h1>Notes</h1>

      <Notification message={errorMessage} />

      // highlight-start
      <form onSubmit={handleLogin}>
        <div>
          username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    // highlight-end

      // ...
    </div>
  )
}

export default App
```

<!-- Current application code can be found on [Github](https://github.com/fullstack-hy2020/part2-notes/tree/part5-1), branch <i>part5-1</i>. -->
当前的应用代码可以在[Github](https://Github.com/fullstack-hy2020/part2-notes/tree/part5-1) ，branch<i>part5-1</i> 上找到。


<!-- The login form is handled the same way we handled forms in -->
<!-- [第2章](/zh/part2/表单). The app state has fields for <i>username</i> and <i>password</i> to store the data from the form. The form fields have event handlers, which synchronizes changes in the field to the state of the <i>App</i> component. The event handlers are simple: An object is given to them as a parameter, and they destructure the field <i>target</i> from the object and save its value to the state. -->

登录表单的处理方式与我们第二章所讲的处理方式相同。当前应用状态有<i>username</i> 和 <i>password</i> 都存储在表单中。表单有事件处理逻辑，与<i>App</i>组件的状态保持同步。事件处理逻辑也很简单：将一个对象作为参数传递给它们，它们将<i>target</i> 字段从对象里解构出来，将它的值保存为状态

```js
({ target }) => setUsername(target.value)
```

<!-- The method _handleLogin_, which is  responsible for handling the data in the form, is yet to be implemented.  -->
_handleLogin_ 方法负责发送表单，还没有被实现。

<!-- Logging in is done by sending an HTTP POST request to server address <i>api/login</i>. Let's separate the code responsible for this request to its own module, to file <i>services/login.js</i>. -->

通过<i>api/login</i>这个 HTTP POST 请求完成登录。让我们将它解耦到自己的 <i>services/login.js</i> 模块中

<!-- We'll use <i>async/await</i> syntax instead of promises for the HTTP request: -->

我们会使用<i>async/await</i> 语法而不再使用 promises，代码如下：

```js
import axios from 'axios'
const baseUrl = '/api/login'

const login = async credentials => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { login }
```

<!-- The method for handling the login can be implemented as follows: -->
处理登录的方法可以按如下方式实现：

```js
import loginService from './services/login' 

const App = () => {
  // ...
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
// highlight-start
  const [user, setUser] = useState(null)
// highlight-end

  const handleLogin = async (event) => {
    event.preventDefault()

    // highlight-start
    try {
      const user = await loginService.login({
        username, password,
      })

      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
     // highlight-end
  }

  // ...
}
```

<!-- If the login is successful, the form fields are emptied <i>and</i> the server response (including a <i>token</i> and the user details) is saved to the <i>user</i> field of the application's state. -->

如果登录成功，表单 字段 被清空，并且服务器响应（包括 token 和用户信息）被存储到
应用状态的<i>user</i> 字段 。

<!-- If the login fails, or running the function _loginService.login_ results in an error, the user is notified. -->
如果登录失败，或者执行 _loginService.login_ 产生了错误，则会通知用户。

<!-- User is not notified about a successful login in any way. Let's modify the application to show the login form only <i>if the user is not logged-in</i> so _user === null_. The form for adding new notes is shown only if <i>user is logged-in</i>, so <i>user</i> contains the user details. -->

总之用户登录成功是不会通知用户的。让我们将应用修改为，只有当用户没有登录时才显示登录表单，即 _user === null_ 。只有当用户登录成功后才会显示添加新的 Note，这样 <i>user</i> 状态才会包含信息

<!-- Let's add two helper functions to the <i>App</i> component for generating the forms: -->
让我们增加两个 辅助函数给 <i>App</i> 组件来生成表单。

```js
const App = () => {
  // ...

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )

  const noteForm = () => (
    <form onSubmit={addNote}>
      <input
        value={newNote}
        onChange={handleNoteChange}
      />
      <button type="submit">save</button>
    </form>  
  )

  return (
    // ...
  )
}
```

<!-- and conditionally render them: -->
并按照条件来渲染它们：

```js
const App = () => {
  // ...

  const loginForm = () => (
    // ...
  )

  const noteForm = () => (
    // ...
  )

  return (
    <div>
      <h1>Notes</h1>

      <Notification message={errorMessage} />

      {user === null && loginForm()} // highlight-line
      {user !== null && noteForm()} // highlight-line

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map((note, i) => 
          <Note
            key={i}
            note={note} 
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        )}
      </ul>

      <Footer />
    </div>
  )
}
```

<!-- A slightly odd looking, but commonly used [React trick](https://reactjs.org/docs/conditional-rendering.html#inline-if-with-logical--operator) is used to render the forms conditionally: -->
虽然看起来有点古怪，但在 React 中十分常见的一个[React trick](https://reactjs.org/docs/conditional-rendering.html#inline-if-with-logical--operator) ，即按条件渲染表单：

```js
{
  user === null && loginForm()
}
```

<!-- If the first statement evaluates false, or is [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy), the second statement ( generating the form) is not executed at all. -->
如果第一个表达式计算为 false 或[falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy)， 则不会执行第二个语句（生成表单）

<!-- We can make this even more straightforward by using the [conditional operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator): -->
我们可以使用条件运算[conditional operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator)来让这个逻辑表达得更直白一些：

```js
return (
  <div>
    <h1>Notes</h1>

    <Notification message={errorMessage}/>

    {user === null ?
      loginForm() :
      noteForm()
    }

    <h2>Notes</h2>

    // ...

  </div>
)
```

<!-- If _user === null_ is [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy), _loginForm()_ is executed. If not, _noteForm()_. -->

如果 _user === null_ 是 [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) _loginForm()_ 就会执行。如果不是，就执行 _noteForm()_.

<!-- Let's do one more modification. If user is logged-in, their name is shown on the screen: -->
让我们再多做一点修改：如果用户登录，它们的名字就会展示在屏幕上：

```js
return (
  <div>
    <h1>Notes</h1>

    <Notification message={errorMessage} />

    {user === null ?
      loginForm() :
      <div>
        <p>{user.name} logged-in</p>
        {noteForm()}
      </div>
    }

    <h2>Notes</h2>

    // ...

  </div>
)
```

<!-- The solution isn't perfect, but we'll leave it for now.  -->
这种解决方案看起来并不完美，但我们先这么放在这。

<!-- Our main component <i>App</i> is at the moment way too large. The changes we did now are a clear sign that the forms should be refactored into their own components. However, we will leave that for an optional excercise. -->
我们的主组件 <i>App</i> 现在看起来十分臃肿。我们现在做的修改意味着，表单应该重构到它自己的组件中。但我们把这个作为可选的练习放到课后。


<!-- Current application code can be found on [Github](https://github.com/fullstack-hy2020/part2-notes/tree/part5-2), branch <i>part5-2</i>. -->
当前的应用代码可以在[Github](https://Github.com/fullstack-hy2020/part2-notes/tree/part5-2) <i>part5-2</i> 分支上找到。

### Creating new notes
【创建新的 Note】

<!-- The token returned with a successful login is saved to the application state <i>user</i> field <i>token</i>: -->
成功登录后，token 被返回并存储到了 <i>user</i> 的 <i>token</i> 状态中

```js
const handleLogin = async (event) => {
  event.preventDefault()
  try {
    const user = await loginService.login({
      username, password,
    })

    setUser(user) // highlight-line
    setUsername('')
    setPassword('')
  } catch (exception) {
    // ...
  }
}
```

<!-- Let's fix creating new notes to work with the backend. This means adding the token of the logged-in user to the Authorization header of the HTTP request. -->
让我们修复创建新 Note 的代码，来和后台对接好。也就是说把登录成功用户的 token 放到 HTTP 请求的认证头中。

<!-- The <i>noteService</i> module changes like so: -->
<i>noteService</i> 模块修改如下：

```js
import axios from 'axios'
const baseUrl = '/api/notes'

let token = null // highlight-line

// highlight-start
const setToken = newToken => {
  token = `bearer ${newToken}`
}
// highlight-end

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  // highlight-start
  const config = {
    headers: { Authorization: token },
  }
// highlight-end

  const response = await axios.post(baseUrl, newObject, config) // highlight-line
  return response.data
}

const update = (id, newObject) => {
  const request = axios.put(`${ baseUrl } /${id}`, newObject)
  return request.then(response => response.data)
}

export default { getAll, create, update, setToken } // highlight-line
```

<!-- The noteService module contains a private variable _token_. Its value can be changed with a function _setToken_, which is exported by the module. _create_, now with async/await syntax, sets the token to the <i>Authorization</i> header. The header is given to axios as the third parameter of the <i>post</i> method. -->

noteService 模块包含一个私有变量 _token_。它的值可以通过 _setToken_ 函数来改变，这个函数通过模块对外开放。 _create_ 方法现在利用 async/await 语法，将 token 塞到了认证头中。头信息作为第三个入参数放到了 axios 的 <i>post</i> 方法中。 

<!-- The event handler responsible for log in must be changed to call the method <code>noteService.setToken(user.token)</code> with a successful log in: -->

登录的事件处理改为，对登录成功的用户必须执行 <code>noteService.setToken(user.token)</code>

```js
const handleLogin = async (event) => {
  event.preventDefault()
  try {
    const user = await loginService.login({
      username, password,
    })

    noteService.setToken(user.token) // highlight-line
    setUser(user)
    setUsername('')
    setPassword('')
  } catch (exception) {
    // ...
  }
}
```

<!-- And now adding new notes works again! -->
现在添加新的 Note 又可以正常工作了

### Saving the token to browsers local storage
【将 token 保存到浏览器的本地存储中】



<!-- Our application has a flaw: When the page is rerendered, information of the user's login dissappears. This also slows down development. For example when we test creating new notes, we have to login again every single time. -->

我们的应用有一个缺陷，就是当页面重新渲染时，user 的登录信息就没了。这同样会降低开发速度。比如当我们想要测试创建一个新的 Note，我们每次都要重新登录。

<!-- This problem is easily solved by saving the login details to [local storage](https://developer.mozilla.org/en-US/docs/Web/API/Storage). Local Storage is a [key-value](https://en.wikipedia.org/wiki/Key-value_database) database in the browser. -->

通过将登录信息存储到一个本地浏览器的 [key-value](https://en.wikipedia.org/wiki/Key-value_database) 数据库中，问题就能够被简单地解决掉了。

<!-- It is very easy to use. A <i>value</i> corresponding to a certain <i>key</i> is saved to the database with method [setItem](https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem). For example: -->

它的使用十分简单。一个值对应一个存储在数据库中的特定的键，通过 [setItem](https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem)方法进行保存，例如：

```js
window.localStorage.setItem('name', 'juha tauriainen')
```

<!-- saves the string given as the second parameter as the value of key <i>name</i>. -->
将字符串作为第二个参数，存储到了以<i>name</i>为键的键值对中。

<!-- The value of a key can be found with method [getItem](https://developer.mozilla.org/en-US/docs/Web/API/Storage/getItem): -->

该键的值可以通过[getItem](https://developer.mozilla.org/en-US/docs/Web/API/Storage/getItem)方法获得。

```js
window.localStorage.getItem('name')
```

<!-- and [removeItem](https://developer.mozilla.org/en-US/docs/Web/API/Storage/removeItem) removes a key. -->

[removeItem](https://developer.mozilla.org/en-US/docs/Web/API/Storage/removeItem) 可以删除一个键

<!-- Values in the storage stay even when the page is rerendered. The storage is [origin](https://developer.mozilla.org/en-US/docs/Glossary/Origin)-specific so each web application has its own storage. -->

即使页面刷新，存储中的值也会保留。这个存储是[原生](https://developer.mozilla.org/en-US/docs/Glossary/Origin)-指定的，所以每个 web 应用都有自己的存储空间。

<!-- Let's extend our application so that it saves the details of a logged-in user to the local storage. -->

让我们将我们的应用扩展来将用户的登录信息存储到本地存储中。

<!-- Values saved to the storage are [DOMstrings](https://developer.mozilla.org/en-US/docs/Web/API/DOMString), so we cannot save a JavaScript object as is. The object has to be first parsed to JSON with the method _JSON.stringify_. Correspondigly, when a JSON object is read from the local storage, it has to be parsed back to JavaScript with _JSON.parse_. -->

存储到本地存储的值称为[DOMstrings](https://developer.mozilla.org/en-US/docs/Web/API/DOMString)，所以我们不能存储一个 Javascript 对象。对象首先要通过
_JSON.stringify_ 方法转换成 JSON。相应的，当从本地存储读取 JSON 对象时，还要使用 _JSON.parse_ 来将其解析回 Javascript。

<!-- Changes to the login method are as follows: -->
我们将登录方法改为如下方式：

```js
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      // highlight-start
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      ) 
      // highlight-end
      noteService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      // ...
    }
  }
```

<!-- The details of a logged-in user are now saved to the local storage, and they can be viewed on the console: -->
现在用户的详细信息被存储到本地存储了，并且能够在控制台看到。

![](../../images/5/3e.png)


<!-- You can also inspect the local storage using the developer tools. On Chrome, go to the <i>Application</i> tab and select <i>Local Storage</i> (more details [here](https://developers.google.com/web/tools/chrome-devtools/storage/localstorage)). On Firefox go to the <i>Storage</i> tab and select <i>Local Storage</i> (details [here](https://developer.mozilla.org/en-US/docs/Tools/Storage_Inspector)). -->

你也可以使用开发者工具来查看本地存储。在Chrome中，到 <i>Application</i> 标签页，选择<i>Local Storage</i> （更多细节可参考[这里](https://developers.google.com/web/tools/chrome-devtools/storage/localstorage)）。在火狐浏览器，到 <i>Storage</i> 标签页并选择<i>Local Storage</i>（细节参考 [这里](https://developer.mozilla.org/en-US/docs/Tools/Storage_Inspector)）

<!-- We still have to modify our application so that when we enter the page, the application checks if user details of a logged-in user can already be found from the local storage. If they can, the details are saved to the state of the application and to <i>noteService</i>. -->
我们仍然需要修改我们的应用，以便当我们进入页面时，应用会检查是否能在本地存储中找到登录用户的详细信息，如果可以，将信息保存到应用的状态中，以及<i>noteService</i>中

<!-- The right way to do this is with an [effect hook](https://reactjs.org/docs/hooks-effect.html): A mechanism we first encountered in [第2章](/zh/part2/从服务器获取数据#effect-hooks), and used to fetch notes from the server to the frontend. -->

正确的方式是用一个[effect hook](https://reactjs.org/docs/hooks-effect.html)： 这种机制我们在第2章节 [第2章](/zh/part2/从服务器获取数据#effect-hooks)分中见到过，当时是用来从服务器中获取所有 Note。

<!-- We can have multiple effect hooks, so let's create a second one to handle the first loading of the page: -->
我们可以有多个effect hook，所以我们来创建一个hook 来处理首次登录页面：

```js
const App = () => {
  const [notes, setNotes] = useState([]) 
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null) 

  useEffect(() => {
    noteService
      .getAll().then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  // highlight-start
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])
  // highlight-end

  // ...
}
```

<!-- The empty array as the parameter of the effect ensures that the effect is executed only when the component is rendered [for the first time](https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect). -->

这个作为事件参数的空数组确保在[第一次](https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect)组件渲染完成后被执行。

<!-- Now a user stays logged-in to the application forever. We should probably add a <i>logout</i> functionality which removes the login details from the local storage. We will however leave it for an exercise. -->

现在用户可以永久地保持登录状态了，我们应该实现一个登出功能来删除登录信息。同样我们把这个作为一个课后作业。

<!-- It's possible to log out a user using the console, and that is enough for now. -->
<!-- You can log out with the command: -->

我们也可以通过控制台来登出用户，现在我们就用这种方法，执行以下命令来登出：

```js
window.localStorage.removeItem('loggedNoteappUser')
```

<!-- or with the command which empties localstorage completely: -->
或者完全清空本地存储：

```js
window.localStorage.clear()
```


<!-- Current application code can be found on [Github](https://github.com/fullstack-hy2020/part2-notes/tree/part5-3), branch <i>part5-3</i>. -->
当前的应用代码可以在[Github](https://Github.com/fullstack-hy2020/part2-notes/tree/part5-3) <i>part5-3</i> 分支上找到。

</div>

<div class="tasks">


### Exercises 5.1.-5.4.
<!-- We will now create a frontend for the bloglist backend we created in the last part. You can use [this application](https://github.com/fullstack-hy2020/bloglist-frontend) from GitHub as the base of your solution. The application expects your backend to be running on port 3001.  -->
现在我们将为上一章节创建的博客列表后端创建一个前端。 你可以使用 GitHub 上的[这个应用](https://GitHub.com/fullstack-hy2020/bloglist-frontend)作为你的解决方案的基础。 应用期望您的后端在3001端口上运行。

<!-- It is enough to submit your finished solution. You can do a commit after each exercise, but that is not necessary.  -->
只要提交完成的解决方案就足够了。 您可以在每次练习之后进行一次提交，但这并不强制。

<!-- The first few exercises revise everything we have learned about React so far. They can be challenging, especially if your backend is incomplete.  -->
开始的几次练习修改了我们已经学到的关于React的所有知识。 他们可能是有挑战性的，特别是如果你的后端内容没有完成。

<!-- It might be best to use the backend from model answers of part 4.  -->
最好使用第4章节的 model answers 作为后端。

<!-- While doing the exercises, remember all of the debugging methods we have talked about, especially keeping an eye on the console.  -->
在做这些练习时，请记住我们讨论过的所有调试方法，尤其要密切关注控制台。

<!-- **Warning:** If you notice you are mixing async/await and _then_ commands, its 99.9%  certain you are doing something wrong. Use either or, never both.  -->
**警告:**如果你注意到你正在混合 async/await 和_then_ 命令，你99.9% 正在做错误的事情。 要么使用其中之一，不要两者都使用。

#### 5.1: bloglist frontend, 步骤1
<!-- Clone the application from [Github](https://github.com/fullstack-hy2020/bloglist-frontend) with the command:  -->
使用如下命令从[Github](https://Github.com/fullstack-hy2020/bloglist-frontend)克隆应用:

```bash
git clone https://github.com/fullstack-hy2020/bloglist-frontend
```

<!-- <i>remove the git configuration of the cloned application</i> -->
删除了克隆应用的 git 配置

```bash
cd bloglist-frontend   // go to cloned repository
rm -rf .git
```

<!-- The application is started the usual way, but you have to install its dependencies first:  -->
应用以常规的方式启动，但是你必须先安装它的依赖项:

```bash
npm install
npm start
```

<!-- Implement login functionality to the frontend. The token returned with a successful login is saved to the application's state <i>user</i>. -->
在前端实现登录功能。成功登录后返回的令牌保存到应用的<i>user</i>状态。

<!-- If a user is not logged-in, <i>only</i> the login form is visible.  -->
如果一个用户没有登录，那么登录表单就是可见的。

![](../../images/5/4e.png)



<!-- If user is logged-in, the name of the user and a list of blogs is shown.  -->
如果用户登录，则显示用户名和博客列表。

![](../../images/5/5e.png)



<!-- User details of the logged-in user do not have to be saved to the local storage yet.  -->
登录用户的用户详细信息不必保存到本地存储中。

<!-- **NB** You can implement the conditional rendering of the login form like this for example:  -->
你可以像这样实现登录表单的条件渲染，例如:

```js
  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <form>
          //...
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}
```

#### 5.2: bloglist frontend, 步骤2
<!-- Make the login 'permanent' by using the local storage. Also implement a way to log out.  -->
使用本地存储使登录成为永久性的。同时实现一种注销的方法。

![](../../images/5/6e.png)

<!-- Ensure the browser does not remember the details of the user after logging out.  -->
确保浏览器在注销后不会记住用户的详细信息。

#### 5.3: bloglist frontend, 步骤3
<!-- Expand your application to allow  a logged-in user to add new blogs:  -->
展开你的应用，允许登录用户添加新的博客:

![](../../images/5/7e.png)



#### 5.4*: bloglist frontend, 步骤4
<!-- Implement notifications which inform the user about successful and unsuccessful operations at the top of the page. For example, when a new blog is added, the following notification can be shown:  -->
在页面顶部实现通知，告知用户成功和不成功的操作结果。 例如，当添加一个新博客时，可以显示如下通知:

![](../../images/5/8e.png)



<!-- Failed login can show the following notification:  -->
登录失败可显示如下通知:

![](../../images/5/9e.png)



<!-- The notifications must be visible for a few seconds. It is not compulsory to add colors.  -->
通知必须可见几秒钟，添加颜色不是强制性的。

</div>

