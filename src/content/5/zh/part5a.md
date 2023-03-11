---
mainImage: ../../../images/part-5.svg
part: 5
letter: a
lang: zh
---

<div class="content">


<!-- In the last two parts, we have mainly concentrated on the backend, and the frontend, that we developed in [part 2](/en/part2) does not yet support the user management we implemented to the backend in part 4.-->
 在过去的两部分中，我们主要集中在后端，而我们在[第二章节](/en/part2)中开发的前端还不支持我们在第四章节中对后端实现的用户管理。

<!-- At the moment the frontend shows existing notes, and lets users change the state of a note from important to not important and vice versa. New notes cannot be added anymore because of the changes made to the backend in part 4: the backend now expects that a token verifying a user's identity is sent with the new note.-->
 目前，前台显示现有的笔记，并允许用户将一个笔记的状态从重要改为不重要，反之亦然。由于第四章节中对后台所做的修改，新的笔记不能再被添加：后台现在期望一个验证用户身份的令牌与新的笔记一起被发送。

<!-- We'll now implement a part of the required user management functionality in the frontend. Let's begin with user login. Throughout this part we will assume that new users will not be added from the frontend.-->
 我们现在要在前台实现一部分所需的用户管理功能。让我们从用户登录开始。在这一部分中，我们将假设新用户不会从前端添加。

### Handling login
<!-- A login form has now been added to the top of the page. The form for adding new notes has also been moved to the bottom of the list of notes.-->
 现在，一个登录表格已经被添加到页面的顶部。添加新笔记的表格也被移到了笔记列表的底部。

![](../../images/5/1e.png)


<!-- The code of the <i>App</i> component now looks as follows:-->
 <i>App</i>组件的代码现在看起来如下。

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

<!-- Current application code can be found on [Github](https://github.com/fullstack-hy2020/part2-notes/tree/part5-1), branch <i>part5-1</i>. If you clone the repo, don't forget to run _npm install_ before attempting to run the frontend.-->
 当前的应用代码可以在[Github](https://github.com/fullstack-hy2020/part2-notes/tree/part5-1)上找到，分支<i>part5-1</i>。如果你克隆了这个 repo，在尝试运行前端之前，别忘了运行_npm install_。

<!-- The frontend will not display any notes if it's not connected to the backend. You can start the backend with _npm run dev_ in its folder from Part 4. This will run the backend on port 3001. While that is active, in a separate terminal window you can start the frontend with _npm start_, and now you can see the notes that are saved in your MongoDB database from Part 4.-->
 如果前台没有连接到后台，它将不会显示任何注释。你可以在第四章节的文件夹中用_npm run dev_来启动后端。这将在3001端口运行后端。当它处于激活状态时，在一个单独的终端窗口中，你可以用_npm start_启动前台，现在你可以看到第四章节中保存在MongoDB数据库中的注释。

<!-- Keep this in mind from now on.-->
 从现在开始记住这一点。

<!-- The login form is handled the same way we handled forms in-->
 登录表单的处理方式与我们在以下文章中处理表单的方式相同
<!-- [part 2](/en/part2/forms). The app state has fields for  <i>username</i> and <i>password</i> to store the data from the form. The form fields have event handlers, which synchronize changes in the field to the state of the <i>App</i> component. The event handlers are simple: An object is given to them as a parameter, and they destructure the field <i>target</i> from the object and save its value to the state.-->
 [第二章节](/en/part2/forms)中处理表单的方式。应用状态有<i>用户名</i>和<i>密码</i>的字段来存储表单的数据。表单字段有事件处理程序，它将字段的变化与<i>App</i>组件的状态同步。事件处理程序很简单。一个对象被作为参数给他们，他们从对象中解构字段<i>target</i>并将其值保存到状态中。

```js
({ target }) => setUsername(target.value)
```

<!-- The method _handleLogin_, which is  responsible for handling the data in the form, is yet to be implemented.-->
 负责处理表单中数据的_handleLogin_方法还没有被实现。

<!-- Logging in is done by sending an HTTP POST request to server address <i>api/login</i>. Let's separate the code responsible for this request to its own module, to file <i>services/login.js</i>.-->
 登录是通过向服务器地址<i>api/login</i>发送一个HTTP POST请求来完成。让我们把负责这个请求的代码分离到自己的模块中，放到<i>services/login.js</i>文件中。

<!-- We'll use <i>async/await</i> syntax instead of promises for the HTTP request:-->
 我们将使用<i>async/await</i>语法而不是承诺来处理HTTP请求。

```js
import axios from 'axios'
const baseUrl = '/api/login'

const login = async credentials => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { login }
```

<!-- The method for handling the login can be implemented as follows:-->
 处理登录的方法可以实现如下。

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
 如果登录成功，表单字段被清空，<i>并且</i>服务器响应（包括一个<i>token</i>和用户详细信息）被保存到应用状态的<i>user</i>字段。

<!-- If the login fails, or running the function _loginService.login_ results in an error, the user is notified.-->
如果登录失败，或运行_loginService.login_函数导致错误，用户将被通知。

<!-- The user is not notified about a successful login in any way. Let's modify the application to show the login form only <i>if the user is not logged-in</i> so when _user === null_. The form for adding new notes is shown only if the <i>user is logged-in</i>, so <i>user</i> contains the user details.-->
 用户不会以任何方式得到关于成功登录的通知。让我们修改应用，只有在<i>用户没有登录的情况下才显示登录表单</i>，所以当_user == null_。只有当<i>用户登录</i>时，才会显示添加新笔记的表单，所以<i>用户</i>包含用户的详细信息。

<!-- Let's add two helper functions to the <i>App</i> component for generating the forms:-->
 让我们在<i>App</i>组件中添加两个辅助函数来生成表单。

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
 并有条件地渲染它们。

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
 一个看起来有点奇怪，但常用的[React技巧](https://reactjs.org/docs/conditional-rendering.html#inline-if-with-logical--operator)被用来有条件地渲染表单。

```js
{
  user === null && loginForm()
}
```

<!-- If the first statement evaluates to false, or is [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy), the second statement (generating the form) is not executed at all.-->
 如果第一条语句计算为false，或者是[falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy)，第二条语句(生成表单)根本就不会被执行。

<!-- We can make this even more straightforward by using the [conditional operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator):-->
我们可以通过使用[条件运算符](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator)使之更加简单明了。

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
 如果_user === null_是[truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy)，_loginForm()_被执行。如果不是，则_noteForm()_被执行。

<!-- Let's do one more modification. If the user is logged-in, their name is shown on the screen:-->
 我们再做一个修改。如果用户已经登录，他们的名字就会显示在屏幕上。

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

<!-- The solution isn't perfect, but we'll leave it for now.-->
 这个方案并不完美，但我们现在先把它留下。

<!-- Our main component <i>App</i> is at the moment way too large. The changes we did now are a clear sign that the forms should be refactored into their own components. However, we will leave that for an optional exercise.-->
 我们的主要组件<i>App</i>目前太大。我们现在所做的改变清楚地表明，表单应该被重构为它们自己的组件。然而，我们将把这个问题留给一个可选的练习。

<!-- Current application code can be found on [Github](https://github.com/fullstack-hy2020/part2-notes/tree/part5-2), branch <i>part5-2</i>.-->
 目前的应用代码可以在[Github](https://github.com/fullstack-hy2020/part2-notes/tree/part5-2)上找到，分支<i>part5-2</i>。

### Creating new notes

<!-- The token returned with a successful login is saved to the application's state - the <i>user</i>'s field <i>token</i>:-->
 登录成功后返回的令牌被保存在应用的状态中--<i>用户</i>的字段<i>token</i>。

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
 让我们修复创建新的注释，使其与后端一起工作。这意味着在HTTP请求的授权头中添加登录用户的令牌。

<!-- The <i>noteService</i> module changes like so:-->
 <i>noteService</i>模块的变化是这样的。

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
  const request = axios.put(`${ baseUrl }/${id}`, newObject)
  return request.then(response => response.data)
}

export default { getAll, create, update, setToken } // highlight-line
```

<!-- The noteService module contains a private variable _token_. Its value can be changed with a function _setToken_, which is exported by the module. _create_, now with async/await syntax, sets the token to the <i>Authorization</i> header. The header is given to axios as the third parameter of the <i>post</i> method.-->
 noteService模块包含一个私有变量_token_。它的值可以通过模块导出的函数_setToken_来改变。_create_，现在使用async/await语法，将token设置为<i>Authorization</i>头。这个头被作为<i>post</i>方法的第三个参数交给axios。

<!-- The event handler responsible for login must be changed to call the method <code>noteService.setToken(user.token)</code> with a successful login:-->
 负责登录的事件处理程序必须改变，以便在登录成功后调用<code>noteService.setToken(user.token)</code>方法。

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
 现在添加新的笔记又开始工作了!

### Saving the token to the browser's local storage

<!-- Our application has a flaw: when the page is rerendered, information of the user's login disappears. This also slows down development. For example when we test creating new notes, we have to login again every single time.-->
 我们的应用有一个缺陷：当页面被重新渲染时，用户的登录信息消失了。这也拖慢了开发速度。例如，当我们测试创建新的笔记时，我们每次都要重新登录。

<!-- This problem is easily solved by saving the login details to [local storage](https://developer.mozilla.org/en-US/docs/Web/API/Storage). Local Storage is a [key-value](https://en.wikipedia.org/wiki/Key-value_database) database in the browser.-->
 这个问题可以通过将登录信息保存到[本地存储](https://developer.mozilla.org/en-US/docs/Web/API/Storage)来轻松解决。本地存储是浏览器中的一个[键-值](https://en.wikipedia.org/wiki/Key-value_database)数据库。

<!-- It is very easy to use. A <i>value</i> corresponding to a certain <i>key</i> is saved to the database with method [setItem](https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem). For example:-->
它非常容易使用。通过[setItem](https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem)方法将与某个<i>key</i>对应的<i>value</i>保存到数据库中。例如。

```js
window.localStorage.setItem('name', 'juha tauriainen')
```

<!-- saves the string given as the second parameter as the value of key <i>name</i>.-->
将作为第二个参数的字符串保存为键<i>name</i>的值。

<!-- The value of a key can be found with method [getItem](https://developer.mozilla.org/en-US/docs/Web/API/Storage/getItem):-->
键的值可以通过方法[getItem](https://developer.mozilla.org/en-US/docs/Web/API/Storage/getItem)找到。

```js
window.localStorage.getItem('name')
```

<!-- and [removeItem](https://developer.mozilla.org/en-US/docs/Web/API/Storage/removeItem) removes a key.-->
 和 [removeItem](https://developer.mozilla.org/en-US/docs/Web/API/Storage/removeItem) 删除一个键。

<!-- Values in the local storage are persisted even when the page is rerendered. The storage is [origin](https://developer.mozilla.org/en-US/docs/Glossary/Origin)-specific so each web application has its own storage.-->
 即使页面被重新渲染，本地存储中的值也会持续存在。这个存储是[origin](https://developer.mozilla.org/en-US/docs/Glossary/Origin)特定的，所以每个网络应用都有自己的存储。

<!-- Let's extend our application so that it saves the details of a logged-in user to the local storage.-->
 让我们扩展我们的应用，使其将登录用户的详细信息保存在本地存储中。

<!-- Values saved to the storage are [DOMstrings](https://developer.mozilla.org/en-US/docs/Web/API/DOMString), so we cannot save a JavaScript object as is. The object has to be parsed to JSON first, with the method _JSON.stringify_. Correspondingly, when a JSON object is read from the local storage, it has to be parsed back to JavaScript with _JSON.parse_.-->
 保存到存储空间的值是[DOMstrings](https://developer.mozilla.org/en-US/docs/Web/API/DOMString)，所以我们不能原封不动地保存一个JavaScript对象。该对象必须首先被解析为JSON，使用_JSON.stringify_方法。相应地，当一个JSON对象从本地存储中读取时，必须用_JSON.parse_将其解析为JavaScript。

<!-- Changes to the login method are as follows:-->
 登录方法的变化如下。

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
登录用户的详细信息现在被保存到本地存储中，并且可以在控制台中查看（通过在控制台中输入_window.localStorage_）。

![](../../images/5/3e.png)

<!-- You can also inspect the local storage using the developer tools. On Chrome, go to the <i>Application</i> tab and select <i>Local Storage</i> (more details [here](https://developers.google.com/web/tools/chrome-devtools/storage/localstorage)). On Firefox go to the <i>Storage</i> tab and select <i>Local Storage</i> (details [here](https://developer.mozilla.org/en-US/docs/Tools/Storage_Inspector)).-->
 你也可以使用开发者工具检查本地存储。在Chrome上，进入<i>Application</i>标签，选择<i>Local Storage</i>（更多细节[这里](https://developers.google.com/web/tools/chrome-devtools/storage/localstorage)）。在Firefox上，进入<i>Storage</i>标签，并选择<i>Local Storage</i>（详细信息[here](https://developer.mozilla.org/en-US/docs/Tools/Storage_Inspector)）。

<!-- We still have to modify our application so that when we enter the page, the application checks if user details of a logged-in user can already be found on the local storage. If they can, the details are saved to the state of the application and to <i>noteService</i>.-->
 我们仍然需要修改我们的应用，以便当我们进入页面时，应用检查是否已经在本地存储中找到了登录用户的详细资料。如果可以，这些细节就会被保存到应用的状态和<i>noteService</i>。

<!-- The right way to do this is with an [effect hook](https://reactjs.org/docs/hooks-effect.html): a mechanism we first encountered in [part 2](/en/part2/getting_data_from_server#effect-hooks), and used to fetch notes from the server.-->
正确的方法是使用[效果钩子](https://reactjs.org/docs/hooks-effect.html)：这是我们在[第二章节](/en/part2/getting_data_from_server#effect-hooks)中第一次遇到的机制，用来从服务器上获取笔记。

<!-- We can have multiple effect hooks, so let's create a second one to handle the first loading of the page:-->
 我们可以有多个效果钩子，所以让我们创建第二个效果钩子来处理页面的第一次加载。

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
 空数组作为效果的参数，确保效果只在组件被渲染[首次]时执行(https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect)。

<!-- Now a user stays logged-in in the application forever. We should probably add a <i>logout</i> functionality which removes the login details from the local storage. We will however leave it for an exercise.-->
 现在，一个用户会在应用中永远保持登录状态。我们也许应该添加一个<i>logout</i>功能，从本地存储中删除登录的细节。然而，我们将把它作为一个练习。

<!-- It's possible to log out a user using the console, and that is enough for now.-->
 我们可以使用控制台注销用户，目前这已经足够了。
<!-- You can log out with the command:-->
你可以用命令注销。

```js
window.localStorage.removeItem('loggedNoteappUser')
```
<!-- or with the command which empties <i>localstorage</i> completely:-->
 或者使用完全清空<i>localstorage</i>的命令。

```js
window.localStorage.clear()
```

<!-- Current application code can be found on [Github](https://github.com/fullstack-hy2020/part2-notes/tree/part5-3), branch <i>part5-3</i>.-->
 目前的应用代码可以在[Github](https://github.com/fullstack-hy2020/part2-notes/tree/part5-3)上找到，分支<i>part5-3</i>。

</div>

<div class="tasks">

### Exercises 5.1.-5.4.

<!-- We will now create a frontend for the bloglist backend we created in the last part. You can use [this application](https://github.com/fullstack-hy2020/bloglist-frontend) from GitHub as the base of your solution. The application expects your backend to be running on port 3003.-->
 我们现在将为我们在上一部分创建的博客列表后台创建一个前端。你可以使用GitHub上的[此应用](https://github.com/fullstack-hy2020/bloglist-frontend)作为你的解决方案的基础。该应用希望你的后端运行在3003端口。

<!-- It is enough to submit your finished solution. You can do a commit after each exercise, but that is not necessary.-->
提交你完成的解决方案就可以了。你可以在每次练习后做一次提交，但这不是必须的。

<!-- The first few exercises revise everything we have learned about React so far. They can be challenging, especially if your backend is incomplete.-->
 前几个练习是对我们到目前为止所学的关于React的所有知识的回顾。它们可能很有挑战性，特别是如果你的后台不完整的话。
<!-- It might be best to use the backend from model answers of part 4.-->
 最好是使用第四章节的模型答案中的后台。

<!-- While doing the exercises, remember all of the debugging methods we have talked about, especially keeping an eye on the console.-->
 在做练习的时候，要记住我们说过的所有调试方法，特别是要注意观察控制台。

<!-- **Warning:** If you notice you are mixing in same function async/await and _then_ commands, it's 99.9%  certain you are doing something wrong. Use either or, never both.-->
 **警告：**如果你注意到你在同一函数中混入了async/await和_then_命令，那么99.9%的人肯定是做错了。请使用其中之一，不要同时使用。

#### 5.1: bloglist frontend, step1

<!-- Clone the application from [Github](https://github.com/fullstack-hy2020/bloglist-frontend) with the command:-->
 用命令从[Github](https://github.com/fullstack-hy2020/bloglist-frontend)克隆应用。

```bash
git clone https://github.com/fullstack-hy2020/bloglist-frontend
```

<i>remove the git configuration of the cloned application</i>

```bash
cd bloglist-frontend   // go to cloned repository
rm -rf .git
```

<!-- The application is started the usual way, but you have to install its dependencies first:-->
 应用以常规方式启动，但你必须先安装其依赖关系。

```bash
npm install
npm start
```

<!-- Implement login functionality to the frontend. The token returned with a successful login is saved to the application's state <i>user</i>.-->
 在前台实现登录功能。登录成功后返回的令牌被保存到应用的状态<i>user</i>。

<!-- If a user is not logged-in, <i>only</i> the login form is visible.-->
 如果用户没有登录，<i>只有</i>登录表单是可见的。

![](../../images/5/4e.png)

<!-- If user is logged-in, the name of the user and a list of blogs is shown.-->
如果用户已登录，将显示用户的名字和博客列表。

![](../../images/5/5e.png)

<!-- User details of the logged-in user do not have to be saved to the local storage yet.-->
 登录的用户的详细资料还不需要保存到本地存储。

<!-- **NB** You can implement the conditional rendering of the login form like this for example:-->
 **NB** 你可以像这样实现登录表单的条件渲染，例如。

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

<!-- Make the login 'permanent' by using the local storage. Also implement a way to log out.-->
 通过使用本地存储使登录成为"永久"。同时实现一个注销的方法。

![](../../images/5/6e.png)

<!-- Ensure the browser does not remember the details of the user after logging out.-->
确保浏览器在注销后不会记住用户的详细信息。

#### 5.3: bloglist frontend, step3

<!-- Expand your application to allow  a logged-in user to add new blogs:-->
扩展你的应用，允许登录的用户添加新的博客。

![](../../images/5/7e.png)

#### 5.4: bloglist frontend, step4

<!-- Implement notifications which inform the user about successful and unsuccessful operations at the top of the page. For example, when a new blog is added, the following notification can be shown:-->
 实施通知，在页面顶部告知用户成功和不成功的操作。例如，当一个新博客被添加时，可以显示以下通知。

![](../../images/5/8e.png)


<!-- Failed login can show the following notification:-->
 登录失败可以显示以下通知。

![](../../images/5/9e.png)


<!-- The notifications must be visible for a few seconds. It is not compulsory to add colors.-->
 通知必须在几秒钟内可见。添加颜色并不是强制性的。

</div>

<div class="content">

### A note on using local storage

<!-- At the [end](/en/part4/token_authentication#problems-of-token-based-authentication) of the last part we mentioned that the challenge of the token based authentication is how to cope with the situation when the API access of the token holder to the API needs to be revoked.-->
 在上一部分的[结尾](/en/part4/token_authentication#problems-of-token-based-authentication)我们提到，基于令牌的认证的挑战是如何应对令牌持有者对API的访问需要被撤销的情况。

<!-- There are two solutions to the problem. The first one is to limit the validity period of a token. This forces the user to relogin to the app once the token has expired. The other approach is to save the validity information of each token to the backend database. This solution is often called a <i>server side session</i>.-->
这个问题有两种解决方案。第一个是限制令牌的有效期限。这迫使用户在令牌过期后重新登录到应用。另一种方法是将每个令牌的有效期信息保存到后台数据库中。这种解决方案通常被称为<i>服务器端会话</i>。

<!-- No matter how the validity of tokens is checked and ensured, saving a token in the local storage might contain a security risk if the application has a security vulnerability that allows [Cross Site Scripting (XSS)](https://owasp.org/www-community/attacks/xss/) attacks. A XSS attack is possible if the application would allow a user to inject arbitrary JavaScript code (e.g. using a form) that the app would then execute. When using React in a sensible manner it should not be possible since [React sanitizes](https://reactjs.org/docs/introducing-jsx.html#jsx-prevents-injection-attacks) all text that it renders, meaning that it is not executing the rendered content as JavaScript.-->
 无论如何检查和确保令牌的有效性，如果应用有安全漏洞，允许[跨站脚本（XSS）](https://owasp.org/www-community/attacks/xss/)攻击，将令牌保存在本地存储中可能包含安全风险。如果应用允许用户注入任意的JavaScript代码（例如使用一个表单），然后由应用执行，那么XSS攻击就有可能。当以合理的方式使用React时，这应该是不可能的，因为[React对其渲染的所有文本进行消毒](https://reactjs.org/docs/introducing-jsx.html#jsx-prevents-injection-attacks)，这意味着它不会将渲染的内容作为JavaScript执行。

<!-- If one wants to play safe, the best option is to not store a token to the local storage. This might be an option in situations where leaking a token might have tragic consequences.-->
 如果想安全起见，最好的选择是不将令牌存储到本地存储。在泄漏令牌可能产生悲剧性后果的情况下，这可能是一个选择。

<!-- It has been suggested that  the identity of a signed in user should be saved as [httpOnly cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#restrict_access_to_cookies), so that JavaScript code could not have any access to the token. The drawback of this solution is that it would make implementing SPA-applications a bit more complex. One would need at least to implement a separate page for logging in.-->
有人建议将登录用户的身份保存为[httpOnly cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#restrict_access_to_cookies)，这样JavaScript代码就不能访问令牌了。这个解决方案的缺点是，它将使实施SPA-应用变得更加复杂。人们至少需要实现一个单独的页面来登录。

<!-- However it is good to notice that even the use of a httpOnly cookies does not guarantee anything. It has even been suggested that httpOnly cookies are [not any safer than](https://academind.com/tutorials/localstorage-vs-cookies-xss/) the use of local storage.-->
 然而，注意到即使使用httpOnly cookies也不能保证任何事情是好的。甚至有人建议，只使用httpOnly cookies[并不比](https://academind.com/tutorials/localstorage-vs-cookies-xss/)使用本地存储更安全。

<!-- So no matter the used solution the most important thing is to [minimize the risk](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html) of XSS attacks altogether.-->
 所以不管使用什么解决方案，最重要的是[尽量减少XSS攻击的风险](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html)。

</div>
