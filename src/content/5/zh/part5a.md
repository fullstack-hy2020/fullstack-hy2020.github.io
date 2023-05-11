---
mainImage: ../../../images/part-5.svg
part: 5
letter: a
lang: zh
---

<div class="content">

<!-- In the last two parts, we have mainly concentrated on the backend. The frontend that we developed in [part 2](/en/part2) does not yet support the user management we implemented to the backend in part 4.-->
在最近的两部分中，我们主要集中在后端。我们在[第二章节](/en/part2)开发的前端尚未支持我们在第四章节实现的用户管理。

<!-- At the moment the frontend shows existing notes and lets users change the state of a note from important to not important and vice versa. New notes cannot be added anymore because of the changes made to the backend in part 4: the backend now expects that a token verifying a user's identity is sent with the new note.-->
目前前端显示现有笔记，并允许用户将笔记从重要更改为不重要，反之亦然。由于第4章节对后端的更改，新笔记不能再添加：后端现在需要发送一个验证用户身份的令牌来添加新的笔记。

<!-- We'll now implement a part of the required user management functionality in the frontend. Let's begin with the user login. Throughout this part, we will assume that new users will not be added from the frontend.-->
我们现在将在前端实现部分所需的用户管理功能。让我们从用户登录开始。在这一部分中，我们假设不会从前端添加新用户。

### Handling login

<!-- A login form has now been added to the top of the page:-->
现在已经在页面顶部添加了登录表单：

![browser showing user login for notes](../../images/5/1new.png)

<!-- The code of the <i>App</i> component now looks as follows:-->
代码<i>App</i>组件现在如下所示：

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

<!-- The current application code can be found on [Github](https://github.com/fullstack-hy2020/part2-notes/tree/part5-1), branch <i>part5-1</i>. If you clone the repo, don''t forget to run _npm install_ before attempting to run the frontend.-->
当前的应用代码可以在[Github](https://github.com/fullstack-hy2020/part2-notes/tree/part5-1)上找到，分支为<i>part5-1</i>。如果你克隆了这个仓库，在尝试运行前端之前不要忘记运行 _npm install_。

<!-- The frontend will not display any notes if it's not connected to the backend. You can start the backend with _npm run dev_ in its folder from Part 4. This will run the backend on port 3001. While that is active, in a separate terminal window you can start the frontend with _npm start_, and now you can see the notes that are saved in your MongoDB database from Part 4.-->
前端如果没有连接到后端，将不会显示任何笔记。你可以在第四章节的文件夹里使用 `npm run dev` 来启动后端，它将在端口 3001 上运行。当后端运行时，在另一个终端窗口里使用 `npm start` 启动前端，现在你可以看到从第四章节保存在 MongoDB 数据库中的笔记了。

<!-- Keep this in mind from now on.-->
请从现在开始牢记这一点。

<!-- The login form is handled the same way we handled forms in-->
the last lesson

登录表单的处理方式和我们在上一课中处理表单的方式是一样的。
<!-- The login form is handled the same way we handled forms in-->
the last lesson

登录表格的处理方式和我们在上一课中处理表格的方式是一样的。
<!-- [part 2](/en/part2/forms). The app state has fields for <i>username</i> and <i>password</i> to store the data from the form. The form fields have event handlers, which synchronize changes in the field to the state of the <i>App</i> component. The event handlers are simple: An object is given to them as a parameter, and they destructure the field <i>target</i> from the object and save its value to the state.-->
应用状态具有<i>用户名</i>和<i>密码</i>字段来存储表单数据。表单字段具有事件处理程序，它们将字段的变化与<i>App</i>组件的状态同步。事件处理程序很简单：它们将一个对象作为参数给出，并从对象中解构出字段<i>target</i>，并将其值保存到状态中。

```js
({ target }) => setUsername(target.value)
```

<!-- The method _handleLogin_, which is responsible for handling the data in the form, is yet to be implemented.-->
方法`handleLogin`，负责处理表单中的数据，尚未实现。

<!-- Logging in is done by sending an HTTP POST request to the server address <i>api/login</i>. Let's separate the code responsible for this request into its own module, to file <i>services/login.js</i>.-->
登录是通过发送HTTP POST请求到服务器地址<i>api/login</i>完成的。让我们把负责此请求的代码分离到它自己的模块中，文件名为<i>services/login.js</i>。

<!-- We''ll use <i>async/await</i> syntax instead of promises for the HTTP request:-->
我们将使用<i>非同步/等待</i>语法而不是承诺为HTTP请求：

```js
import axios from 'axios'
const baseUrl = '/api/login'

const login = async credentials => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { login }
```

<!-- If you have installed the eslint plugin in VS Code, you may now see the following warning:-->
如果你已经在VS Code安装了eslint插件，你现在可能会看到以下警告：

![vs code warning - assign object to a variable before exporting as module default](../../images/5/50new.png)

<!-- We''ll get back to configuring eslint in a moment. You can ignore the error for the time being or suppress it by adding the following to the line before the warning:-->
我们马上回来设置eslint，你可以暂时忽略该警告，或者在警告之前添加以下内容以抑制它：

```js
// eslint-disable-next-line import/no-anonymous-default-export
export default { login }
```

<!-- The method for handling the login can be implemented as follows:-->
方法处理登录可按如下方式实施：

```js
import loginService from './services/login' // highlight-line

const App = () => {
  // ...
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
// highlight-start
  const [user, setUser] = useState(null)
// highlight-end

  // highlight-start
  const handleLogin = async (event) => {
    event.preventDefault()

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

<!-- If the login is successful, the form fields are emptied <i>and</i> the server response (including a <i>token</i> and the user details) is saved to the <i>user</i> field of the application's state.-->
如果登录成功，表单字段将被清空<i>并且</i>服务器响应（包括一个<i>令牌</i>和用户详细信息）将被保存到应用程序状态的<i>用户</i>字段中。

<!-- If the login fails or running the function _loginService.login_ results in an error, the user is notified.-->
如果登录失败或者运行函数 _loginService.login_ 导致错误，用户会收到通知。

<!-- The user is not notified about a successful login in any way. Let's modify the application to show the login form only <i>if the user is not logged-in</i> so when _user === null_. The form for adding new notes is shown only if the <i>user is logged-in</i>, so <i>user</i> contains the user details.-->
用户未以任何方式被通知登录成功。让我们修改应用程序，仅在<i>用户未登录时</i>显示登录表单，因此当_user === null_时。仅在<i>用户已登录时</i>才会显示添加新笔记的表单，因此<i>user</i>包含用户详细信息。

<!-- Let's add two helper functions to the <i>App</i> component for generating the forms:-->
让我们为<i>App</i>组件添加两个辅助函数来生成表单：

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

<!-- and conditionally render them:-->
## 你好

你好！

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

<!-- A slightly odd looking, but commonly used [React trick](https://reactjs.org/docs/conditional-rendering.html#inline-if-with-logical--operator) is used to render the forms conditionally:-->
一个看起来有点奇怪，但常用的[React 技巧](https://reactjs.org/docs/conditional-rendering.html#inline-if-with-logical--operator)用于有条件地渲染表单：

```js
{
  user === null && loginForm()
}
```

<!-- If the first statement evaluates to false or is [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy), the second statement (generating the form) is not executed at all.-->
如果第一个语句的评估结果为[假值](https://developer.mozilla.org/en-US/docs/Glossary/Falsy)或假，那么第二个语句（生成表单）将不会被执行。

<!-- We can make this even more straightforward by using the [conditional operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator):-->
我们可以通过使用[条件运算符](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator)来使这更加简单：

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

<!-- If _user === null_ is [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy), _loginForm()_ is executed. If not, _noteForm()_ is.-->
如果`user === null`是[真值](https://developer.mozilla.org/en-US/docs/Glossary/Truthy)，就执行`loginForm()`，否则执行`noteForm()`。

<!-- Let's do one more modification. If the user is logged in, their name is shown on the screen:-->
让我们做一个更多的修改。如果用户已登录，他们的名字就会显示在屏幕上：

```js
return (
  <div>
    <h1>Notes</h1>

    <Notification message={errorMessage} />

    {!user && loginForm()}
    {user && <div>
       <p>{user.name} logged in</p>
         {noteForm()}
      </div>
    }

    <h2>Notes</h2>

    // ...

  </div>
)
```

<!-- The solution isn't perfect, but we'll leave it for now.-->
解决方案不是完美的，但我们暂时先这样吧。

<!-- Our main component <i>App</i> is at the moment way too large. The changes we did now are a clear sign that the forms should be refactored into their own components. However, we will leave that for an optional exercise.-->
我们的主要组件<i>App</i>目前太大了。我们现在做的改变是一个明确的标志，表明表单应该重构成自己的组件。但是，我们将把这留给一个可选的练习。

<!-- The current application code can be found on [GitHub](https://github.com/fullstack-hy2020/part2-notes/tree/part5-2), branch <i>part5-2</i>.-->
当前应用程序的代码可以在[GitHub](https://github.com/fullstack-hy2020/part2-notes/tree/part5-2)，分支<i>part5-2</i>中找到。

### Creating new notes

<!-- The token returned with a successful login is saved to the application's state - the <i>user</i>'s field <i>token</i>:-->
登录成功后返回的令牌被保存到应用程序的状态 - 用户字段<i>token</i>：

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

<!-- Let's fix creating new notes so it works with the backend. This means adding the token of the logged-in user to the Authorization header of the HTTP request.-->
让我们修复创建新笔记的功能，以便它可以与后端一起工作。这意味着将已登录用户的令牌添加到HTTP请求的Authorization标头中。

<!-- The <i>noteService</i> module changes like so:-->
<i>noteService</i> 模块发生如下变化：

```js
import axios from 'axios'
const baseUrl = '/api/notes'

let token = null // highlight-line

// highlight-start
const setToken = newToken => {
  token = `Bearer ${newToken}`
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
  const request = axios.put(`${ baseUrl }/${id}`, newObject)
  return request.then(response => response.data)
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, create, update, setToken } // highlight-line
```

<!-- The noteService module contains a private variable _token_. Its value can be changed with a function _setToken_, which is exported by the module. _create_, now with async/await syntax, sets the token to the <i>Authorization</i> header. The header is given to axios as the third parameter of the <i>post</i> method.-->
模块noteService包含一个私有变量_token_。它的值可以通过被模块导出的函数_setToken_来改变。_create_现在使用async/await语法，将token设置为<i>Authorization</i>头。该头作为axios的<i>post</i>方法的第三个参数给出。

<!-- The event handler responsible for login must be changed to call the method <code>noteService.setToken(user.token)</code> with a successful login:-->
事件处理程序负责登录必须更改为调用<code>noteService.setToken(user.token)</code>方法，以成功登录：

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

<!-- And now adding new notes works again!-->
现在又可以添加新笔记了！

### Saving the token to the browser's local storage

<!-- Our application has a small flaw: if the browser is refreshed (eg. pressing F5), the user's login information disappears.-->
我们的应用程序有一个小缺陷：如果刷新浏览器（例如按F5），用户的登录信息就会消失。

<!-- This problem is easily solved by saving the login details to [local storage](https://developer.mozilla.org/en-US/docs/Web/API/Storage). Local Storage is a [key-value](https://en.wikipedia.org/wiki/Key-value_database) database in the browser.-->
这个问题很容易通过将登录详情保存到[本地存储](https://developer.mozilla.org/en-US/docs/Web/API/Storage)来解决。本地存储是浏览器中的一个[键值](https://en.wikipedia.org/wiki/Key-value_database)数据库。

<!-- It is very easy to use. A <i>value</i> corresponding to a certain <i>key</i> is saved to the database with the method [setItem](https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem). For example:-->
它非常容易使用。用[setItem](https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem)方法将一个<i>value</i>与某个<i>key</i>保存到数据库中。例如：

```js
window.localStorage.setItem('name', 'juha tauriainen')
```

<!-- saves the string given as the second parameter as the value of the key <i>name</i>.-->
将给定的字符串作为第二个参数保存为键<i>name</i>的值。

<!-- The value of a key can be found with the method [getItem](https://developer.mozilla.org/en-US/docs/Web/API/Storage/getItem):-->
使用[getItem](https://developer.mozilla.org/en-US/docs/Web/API/Storage/getItem)方法可以找到键的值：

```js
window.localStorage.getItem('name')
```

<!-- and [removeItem](https://developer.mozilla.org/en-US/docs/Web/API/Storage/removeItem) removes a key.-->
[removeItem](https://developer.mozilla.org/zh-CN/docs/Web/API/Storage/removeItem) 删除一个键。

<!-- Values in the local storage are persisted even when the page is re-rendered. The storage is [origin](https://developer.mozilla.org/en-US/docs/Glossary/Origin)-specific so each web application has its own storage.-->
本地存储中的值即使在页面重新渲染时也会被持久化。存储是[origin](https://developer.mozilla.org/en-US/docs/Glossary/Origin)特定的，因此每个Web应用程序都有自己的存储。

<!-- Let's extend our application so that it saves the details of a logged-in user to the local storage.-->
让我们扩展我们的应用，将已登录用户的详细信息保存到本地存储中。

<!-- Values saved to the storage are [DOMstrings](https://docs.w3cub.com/dom/domstring), so we cannot save a JavaScript object as it is. The object has to be parsed to JSON first, with the method _JSON.stringify_. Correspondingly, when a JSON object is read from the local storage, it has to be parsed back to JavaScript with _JSON.parse_.-->
存储的值是[DOMstrings](https://docs.w3cub.com/dom/domstring)，因此我们不能将JavaScript对象直接保存。该对象必须首先使用_JSON.stringify_方法解析为JSON。相应地，当从本地存储中读取JSON对象时，必须使用_JSON.parse_将其解析回JavaScript。

<!-- Changes to the login method are as follows:-->
**更改登录方式如下：**

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

<!-- The details of a logged-in user are now saved to the local storage, and they can be viewed on the console (by typing _window.localStorage_ to the console):-->
现在，已登录用户的详细信息已保存到本地存储中，可以在控制台（通过在控制台输入_window.localStorage_来查看）查看：

![browser showing someone logged into notes](../../images/5/3e.png)

<!-- You can also inspect the local storage using the developer tools. On Chrome, go to the <i>Application</i> tab and select <i>Local Storage</i> (more details [here](https://developers.google.com/web/tools/chrome-devtools/storage/localstorage)). On Firefox go to the <i>Storage</i> tab and select <i>Local Storage</i> (details [here](https://developer.mozilla.org/en-US/docs/Tools/Storage_Inspector)).-->
您也可以使用开发人员工具检查本地存储。在Chrome上，转到<i>应用程序</i>选项卡并选择<i>本地存储</i>（更多详细信息[这里](https://developers.google.com/web/tools/chrome-devtools/storage/localstorage)）。在Firefox上，转到<i>存储</i>选项卡并选择<i>本地存储</i>（详细信息[这里](https://developer.mozilla.org/en-US/docs/Tools/Storage_Inspector)）。

<!-- We still have to modify our application so that when we enter the page, the application checks if user details of a logged-in user can already be found on the local storage. If they can, the details are saved to the state of the application and to <i>noteService</i>.-->
我们仍然需要修改我们的应用程序，以便当我们进入页面时，应用程序检查本地存储中是否已经找到已登录用户的用户详细信息。如果可以，这些详细信息将被保存到应用程序的状态和<i>noteService</i>中。

<!-- The right way to do this is with an [effect hook](https://reactjs.org/docs/hooks-effect.html): a mechanism we first encountered in [part 2](/en/part2/getting_data_from_server#effect-hooks), and used to fetch notes from the server.-->
正确的做法是使用[effect hook](https://reactjs.org/docs/hooks-effect.html)：这是我们在[第2章节](/en/part2/getting_data_from_server#effect-hooks)中首次遇到的机制，用于从服务器获取笔记。

<!-- We can have multiple effect hooks, so let's create a second one to handle the first loading of the page:-->
我们可以有多个effect Hooks，所以让我们创建第二个来处理页面的第一次加载：

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

<!-- The empty array as the parameter of the effect ensures that the effect is executed only when the component is rendered [for the first time](https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect).-->
空数组作为效果的参数可以确保只有在组件[首次渲染](https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect)时才执行效果。

<!-- Now a user stays logged in to the application forever. We should probably add a <i>logout</i> functionality, which removes the login details from the local storage. We will however leave it as an exercise.-->
现在用户永久登录到应用程序中。我们可能应该添加一个<i>注销</i>功能，它会从本地存储中删除登录详细信息。不过，我们将把它作为一个练习留给大家。

<!-- It's possible to log out a user using the console, and that is enough for now.-->
可以通过控制台登出用户，这就够了。
<!-- You can log out with the command:-->
你可以用以下指令登出：

```js
window.localStorage.removeItem('loggedNoteappUser')
```

<!-- or with the command which empties <i>localstorage</i> completely:-->
使用命令完全清空<i>本地存储</i>：

```js
window.localStorage.clear()
```

<!-- The current application code can be found on [GitHub](https://github.com/fullstack-hy2020/part2-notes/tree/part5-3), branch <i>part5-3</i>.-->
当前的应用代码可以在[GitHub](https://github.com/fullstack-hy2020/part2-notes/tree/part5-3)上找到，分支为<i>part5-3</i>。

</div>

<div class="tasks">

### Exercises 5.1.-5.4.

<!-- We will now create a frontend for the bloglist backend we created in the last part. You can use [this application](https://github.com/fullstack-hy2020/bloglist-frontend) from GitHub as the base of your solution. The application expects your backend to be running on port 3003.-->
我们现在将为上一部分创建的博客列表后端创建一个前端。您可以使用GitHub上的[此应用程序](https://github.com/fullstack-hy2020/bloglist-frontend)作为您的解决方案的基础。该应用程序期望您的后端运行在端口3003上。

<!-- It is enough to submit your finished solution. You can do a commit after each exercise, but that is not necessary.-->
这已经足够提交你完成的解决方案了。每个练习后都可以做一次提交，但这不是必须的。

<!-- The first few exercises revise everything we have learned about React so far. They can be challenging, especially if your backend is incomplete.-->
第一些练习回顾了我们迄今为止学到的所有关于 React 的知识。它们可能很有挑战性，特别是如果你的后端不完整的时候。
<!-- It might be best to use the backend that we marked as the answer for part 4.-->
可能最好使用我们在第4章节标记为答案的后端。

<!-- While doing the exercises, remember all of the debugging methods we have talked about, especially keeping an eye on the console.-->
在做练习的时候，记住我们讨论过的所有调试方法，尤其是要留意控制台。

<!-- **Warning:** If you notice you are mixing in the functions _async/await_ and _then_ commands, it's 99.9%  certain you are doing something wrong. Use either or, never both.-->
**警告：**如果您注意到您正在混合使用_async / await_和_then_命令，那么99.9％的确定性您正在做错事。要么使用一个，要么不要使用两个。

#### 5.1: bloglist frontend, step1

<!-- Clone the application from [GitHub](https://github.com/fullstack-hy2020/bloglist-frontend) with the command:-->
从[GitHub](https://github.com/fullstack-hy2020/bloglist-frontend)用命令克隆应用：`git clone https://github.com/fullstack-hy2020/bloglist-frontend.git`

```bash
git clone https://github.com/fullstack-hy2020/bloglist-frontend
```

<i>remove the git configuration of the cloned application</i>

```bash
cd bloglist-frontend   // go to cloned repository
rm -rf .git
```

<!-- The application is started the usual way, but you have to install its dependencies first:-->
应用程序以通常的方式启动，但是你必须先安装它的依赖项：

```bash
npm install
npm start
```

<!-- Implement login functionality to the frontend. The token returned with a successful login is saved to the application's state <i>user</i>.-->
实现登录功能到前端。登录成功后返回的令牌被保存到应用程序的<i>用户</i>状态中。

<!-- If a user is not logged in, <i>only</i> the login form is visible.-->
如果用户没有登录，<i>只</i>可以看到登录表单。

![browser showing visible login form only](../../images/5/4e.png)

<!-- If the user is logged-in, the name of the user and a list of blogs is shown.-->
如果用户已登录，则会显示用户的名字和一个博客列表。

![browser showing notes and who is logged in](../../images/5/5e.png)

<!-- User details of the logged-in user do not have to be saved to the local storage yet.-->
用户登录信息尚未需要存储到本地存储中。

<!-- **NB** You can implement the conditional rendering of the login form like this for example:-->
**例如，你可以这样实现登录表单的条件渲染：**

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

#### 5.2: bloglist frontend, step2

<!-- Make the login 'permanent' by using the local storage. Also, implement a way to log out.-->
使用本地存储使登录'永久'。同时，实现一种注销方式。

![browser showing logout button after logging in](../../images/5/6e.png)

<!-- Ensure the browser does not remember the details of the user after logging out.-->
确保登出后浏览器不记住用户的详细资料。

#### 5.3: bloglist frontend, step3

<!-- Expand your application to allow a logged-in user to add new blogs:-->
扩展您的应用程序，允许已登录的用户添加新博客：

![browser showing new blog form](../../images/5/7e.png)

#### 5.4: bloglist frontend, step4

<!-- Implement notifications that inform the user about successful and unsuccessful operations at the top of the page. For example, when a new blog is added, the following notification can be shown:-->
实现在页面顶部通知用户成功和不成功操作的通知。例如，当添加新博客时，可以显示以下通知：

![browser showing successful operation](../../images/5/8e.png)

<!-- Failed login can show the following notification:-->
登录失败时可以显示以下提示：

![browser showing failed login attempt](../../images/5/9e.png)

<!-- The notifications must be visible for a few seconds. It is not compulsory to add colors.-->
通知必须可见几秒钟。添加颜色不是强制性的。

</div>

<div class="content">

### A note on using local storage

<!-- At the [end](/en/part4/token_authentication#problems-of-token-based-authentication) of the last part, we mentioned that the challenge of token-based authentication is how to cope with the situation when the API access of the token holder to the API needs to be revoked.-->
在最后一部分的[末尾](/en/part4/token_authentication#problems-of-token-based-authentication)，我们提到了使用令牌认证的挑战在于如何处理令牌持有者对API的访问需要被撤销的情况。

<!-- There are two solutions to the problem. The first one is to limit the validity period of a token. This forces the user to re-login to the app once the token has expired. The other approach is to save the validity information of each token to the backend database. This solution is often called a <i>server-side session</i>.-->
有两种解决方案。第一种是限制令牌的有效期。这迫使用户一旦令牌过期就必须重新登录应用程序。另一种方法是将每个令牌的有效信息保存到后端数据库。这种解决方案通常称为<i>服务器端会话</i>。

<!-- No matter how the validity of tokens is checked and ensured, saving a token in the local storage might contain a security risk if the application has a security vulnerability that allows [Cross Site Scripting (XSS)](https://owasp.org/www-community/attacks/xss/) attacks. An XSS attack is possible if the application would allow a user to inject arbitrary JavaScript code (e.g. using a form) that the app would then execute. When using React sensibly it should not be possible since [React sanitizes](https://reactjs.org/docs/introducing-jsx.html#jsx-prevents-injection-attacks) all text that it renders, meaning that it is not executing the rendered content as JavaScript.-->
无论如何检查和确保令牌的有效性，如果应用程序具有允许[跨站脚本（XSS）]（https://owasp.org/www-community/attacks/xss/）攻击的安全漏洞，那么将令牌保存在本地存储中可能会带来安全风险。如果应用程序允许用户注入任意JavaScript代码（例如使用表单），然后应用程序将执行该代码，则可能发生XSS攻击。如果合理使用React，则不应该发生，因为[React对所渲染的所有文本进行消毒]（https://reactjs.org/docs/introducing-jsx.html#jsx-prevents-injection-attacks），这意味着它不会将渲染的内容执行为JavaScript。

<!-- If one wants to play safe, the best option is to not store a token in local storage. This might be an option in situations where leaking a token might have tragic consequences.-->
如果一个人想要玩得安全，最好的选择是不要将令牌存储在本地存储装置中。 在泄露令牌可能会造成悲剧性后果的情况下，这可能是一个选择。

<!-- It has been suggested that the identity of a signed-in user should be saved as [httpOnly cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#restrict_access_to_cookies), so that JavaScript code could not have any access to the token. The drawback of this solution is that it would make implementing SPA applications a bit more complex. One would need at least to implement a separate page for logging in.-->
建议将登录用户的身份保存为[httpOnly cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#restrict_access_to_cookies)，以便JavaScript代码无法访问令牌。这种解决方案的缺点是，它会使实现SPA应用程序变得更加复杂。至少需要为登录实现一个单独的页面。

<!-- However, it is good to notice that even the use of httpOnly cookies does not guarantee anything. It has even been suggested that httpOnly cookies are [not any safer than](https://academind.com/tutorials/localstorage-vs-cookies-xss/) the use of local storage.-->
然而，值得注意的是，即使使用httpOnly cookie也无法保证任何事情。甚至有人建议httpOnly cookie [与使用本地存储没有任何安全性](https://academind.com/tutorials/localstorage-vs-cookies-xss/)。

<!-- So no matter the used solution the most important thing is to [minimize the risk](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html) of XSS attacks altogether.-->
所以无论采用哪种解决方案，最重要的是[尽可能地减少XSS攻击的风险](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html)。

</div>
