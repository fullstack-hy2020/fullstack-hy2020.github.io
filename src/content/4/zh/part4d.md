---
mainImage: ../../../images/part-4.svg
part: 4
letter: d
lang: zh
---

<div class="content">

<!-- Users must be able to log into our application, and when a user is logged in, their user information must automatically be attached to any new notes they create.-->
用户必须能够登录我们的应用程序，当用户登录后，他们的用户信息必须自动附加到他们创建的任何新笔记上。

<!-- We will now implement support for [token-based authentication](https://www.digitalocean.com/community/tutorials/the-ins-and-outs-of-token-based-authentication#how-token-based-works) to the backend.-->
我们现在将在后端实施[令牌身份验证](https://www.digitalocean.com/community/tutorials/the-ins-and-outs-of-token-based-authentication#how-token-based-works)的支持。

<!-- The principles of token-based authentication are depicted in the following sequence diagram:-->
以下序列图描述了基于令牌认证的原则：

![sequence diagram of token-based authentication](../../images/4/16new.png)

<!-- - User starts by logging in using a login form implemented with React-->
用户开始使用React实现的登录表单登录。
<!--     - We will add the login form to the frontend in [part 5](/en/part5)-->
我们将在[第5章节](/en/part5)中添加登录表单到前端。
<!-- - This causes the React code to send the username and the password to the server address <i>/api/login</i> as a HTTP POST request.-->
这就导致React代码将用户名和密码作为HTTP POST请求发送到服务器地址<i>/api/login</i>。
<!-- - If the username and the password are correct, the server generates a <i>token</i> that somehow identifies the logged-in user.-->
如果用户名和密码正确，服务器会生成一个<i>令牌</i>来识别已登录的用户。
<!--     - The token is signed digitally, making it impossible to falsify (with cryptographic means)-->
- 令牌经过数字签名，使其不可能通过密码学方法被伪造（篡改）。
<!-- - The backend responds with a status code indicating the operation was successful and returns the token with the response.-->
服务器后端响应一个状态码，表明操作成功，并在响应中返回令牌。
<!-- - The browser saves the token, for example to the state of a React application.-->
浏览器会保存令牌，例如保存到 React 应用程序的状态中。
<!-- - When the user creates a new note (or does some other operation requiring identification), the React code sends the token to the server with the request.-->
当用户创建一个新笔记（或者做一些其他需要身份验证的操作）时，React 代码会把 token 与请求一起发送给服务器。
<!-- - The server uses the token to identify the user-->
服务器使用令牌来识别用户

<!-- Let''s first implement the functionality for logging in. Install the [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) library, which allows us to generate [JSON web tokens](https://jwt.io/).-->
让我们首先实现登录功能。安装[jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)库，它允许我们生成[JSON web tokens](https://jwt.io/)。

```bash
npm install jsonwebtoken
```

<!-- The code for login functionality goes to the file controllers/login.js.-->
文件`controllers/login.js`中有登录功能的代码。

```js
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
```

<!-- The code starts by searching for the user from the database by the <i>username</i> attached to the request.-->
代码从数据库中搜索用户，以请求附带的<i>用户名</i>开始。
<!-- Next, it checks the <i>password</i>, also attached to the request.-->
接下来，它检查也附加到请求的<i>密码</i>。
<!-- Because the passwords themselves are not saved to the database, but <i>hashes</i> calculated from the passwords, the _bcrypt.compare_ method is used to check if the password is correct:-->
因为密码本身没有存储到数据库中，而是从密码计算出的<i>哈希值</i>，所以使用_bcrypt.compare_方法来检查密码是否正确：

```js
await bcrypt.compare(body.password, user.passwordHash)
```

<!-- If the user is not found, or the password is incorrect, the request is responded to with the status code [401 unauthorized](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.2). The reason for the failure is explained in the response body.-->
如果找不到用户或密码不正确，则会用[401未授权](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.2)的状态码响应请求。失败的原因在响应体中解释。

<!-- If the password is correct, a token is created with the method _jwt.sign_. The token contains the username and the user id in a digitally signed form.-->
如果密码正确，就会使用 _jwt.sign_ 方法创建一个令牌，该令牌以数字签名的形式包含用户名和用户ID。

```js
const userForToken = {
  username: user.username,
  id: user._id,
}

const token = jwt.sign(userForToken, process.env.SECRET)
```

<!-- The token has been digitally signed using a string from the environment variable <i>SECRET</i> as the <i>secret</i>.-->
用环境变量<i>SECRET</i>中的字符串作为<i>secret</i>对令牌进行了数字签名。
<!-- The digital signature ensures that only parties who know the secret can generate a valid token.-->
数字签名确保只有拥有秘密的各方才能生成有效的令牌。
<!-- The value for the environment variable must be set in the <i>.env</i> file.-->
环境变量的值必须在<i>.env</i>文件中设置。

<!-- A successful request is responded to with the status code <i>200 OK</i>. The generated token and the username of the user are sent back in the response body.-->
一个成功的请求会返回状态码<i>200 OK</i>。在响应体中会返回生成的令牌和用户的用户名。

<!-- Now the code for login just has to be added to the application by adding the new router to <i>app.js</i>.-->
现在，只需要通过添加新路由到<i>app.js</i>来添加登录代码到应用程序中。

```js
const loginRouter = require('./controllers/login')

//...

app.use('/api/login', loginRouter)
```

<!-- Let''s try logging in using VS Code REST-client:-->
让我们尝试使用VS Code REST-client登录：

![vscode rest post with username/password](../../images/4/17e.png)

<!-- It does not work. The following is printed to the console:-->
它不起作用。 以下被打印到控制台：

```bash
(node:32911) UnhandledPromiseRejectionWarning: Error: secretOrPrivateKey must have a value
    at Object.module.exports [as sign] (/Users/mluukkai/opetus/_2019fullstack-koodit/osa3/notes-backend/node_modules/jsonwebtoken/sign.js:101:20)
    at loginRouter.post (/Users/mluukkai/opetus/_2019fullstack-koodit/osa3/notes-backend/controllers/login.js:26:21)
(node:32911) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). (rejection id: 2)
```

<!-- The command _jwt.sign(userForToken, process.env.SECRET)_ fails. We forgot to set a value to the environment variable <i>SECRET</i>. It can be any string. When we set the value in file <i>.env</i> (and restart the server), the login works.-->
命令_jwt.sign(userForToken, process.env.SECRET)_失败了。我们忘记为环境变量<i>SECRET</i>设置一个值。它可以是任何字符串。当我们在文件<i>.env</i>中设置值（并重新启动服务器），登录就可以工作了。

<!-- A successful login returns the user details and the token:-->
登录成功后返回用户详细信息和令牌：

![vs code rest response showing details and token](../../images/4/18ea.png)

<!-- A wrong username or password returns an error message and the proper status code:-->
一个错误的用户名或密码会返回一条错误消息和正确的状态码：

![vs code rest response for incorrect login details](../../images/4/19ea.png)

### Limiting creating new notes to logged-in users

<!-- Let''s change creating new notes so that it is only possible if the post request has a valid token attached. The note is then saved to the notes list of the user identified by the token.-->
让我们改变创建新笔记的方式，只有在提交请求中附带有效令牌时才可以。笔记然后被保存到由令牌标识的用户的笔记列表中。

<!-- There are several ways of sending the token from the browser to the server. We will use the [Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization) header. The header also tells which [authentication scheme](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#Authentication_schemes) is used. This can be necessary if the server offers multiple ways to authenticate.-->
有几种方法可以从浏览器发送令牌到服务器。我们将使用[授权](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization)标头。该标头还指出使用了[身份验证方案](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#Authentication_schemes)。如果服务器提供多种身份验证方式，这可能是必要的。
<!-- Identifying the scheme tells the server how the attached credentials should be interpreted.-->
识别该方案告诉服务器应该如何解释附加的凭据。

<!-- The <i>Bearer</i> scheme is suitable for our needs.-->
<i>持有人</i>方案适合我们的需求。

<!-- In practice, this means that if the token is, for example, the string <i>eyJhbGciOiJIUzI1NiIsInR5c2VybmFtZSI6Im1sdXVra2FpIiwiaW</i>, the Authorization header will have the value:-->
在實踐中，這意味著如果標記是例如字符串<i>eyJhbGciOiJIUzI1NiIsInR5c2VybmFtZSI6Im1sdXVra2FpIiwiaW</i>，授權標頭將具有值：

<pre>
Bearer eyJhbGciOiJIUzI1NiIsInR5c2VybmFtZSI6Im1sdXVra2FpIiwiaW
</pre>

<!-- Creating new notes will change like so:-->
创建新笔记将会改变如下：

```js
const jwt = require('jsonwebtoken') //highlight-line

// ...
  //highlight-start
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}
  //highlight-end

notesRouter.post('/', async (request, response) => {
  const body = request.body
//highlight-start
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)
//highlight-end

  const note = new Note({
    content: body.content,
    important: body.important === undefined ? false : body.important,
    user: user._id
  })

  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()

  response.json(savedNote)
})
```

<!-- The helper function _getTokenFrom_ isolates the token from the <i>authorization</i> header. The validity of the token is checked with _jwt.verify_. The method also decodes the token, or returns the Object which the token was based on.-->
helper 函数 _getTokenFrom_ 从 <i>authorization</i> 头部分离出 token。使用 _jwt.verify_ 检查 token 的有效性。该方法还可以解码 token，或返回 token 所基于的对象。

```js
const decodedToken = jwt.verify(token, process.env.SECRET)
```

<!-- If the token is missing or it is invalid, the exception <i>JsonWebTokenError</i> is raised. We need to extend the error handling middleware to take care of this particular case:-->
如果token缺失或者无效，就会抛出<i>JsonWebTokenError</i>异常。我们需要扩展错误处理中间件来处理这种特殊情况：

```js
const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name ===  'JsonWebTokenError') { // highlight-line
    return response.status(400).json({ error: error.message }) // highlight-line
  }

  next(error)
}
```

<!-- The object decoded from the token contains the <i>username</i> and <i>id</i> fields, which tell the server who made the request.-->
从令牌解码出来的对象包含<i>用户名</i>和<i>ID</i>字段，这些字段告诉服务器是谁发出了请求。

<!-- If the object decoded from the token does not contain the user''s identity (_decodedToken.id_ is undefined), error status code [401 unauthorized](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.2) is returned and the reason for the failure is explained in the response body.-->
如果从令牌解码出的对象不包含用户的身份（_decodedToken.id_未定义），则返回错误状态码[401未授权](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.2)，并在响应体中解释失败的原因。

```js
if (!decodedToken.id) {
  return response.status(401).json({
    error: 'token invalid'
  })
}
```

<!-- When the identity of the maker of the request is resolved, the execution continues as before.-->
当请求者的身份解析出来之后，执行就会像之前一样继续下去。

<!-- A new note can now be created using Postman if the <i>authorization</i> header is given the correct value, the string <i>Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ</i>, where the second value is the token returned by the <i>login</i> operation.-->
现在，如果给<i>授权</i>头赋予正确的值，即字符串<i>Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ</i>（其中第二个值是<i>登录</i>操作返回的令牌），就可以使用Postman创建新笔记。

<!-- Using Postman this looks as follows:-->
使用Postman看起来如下：

![postman adding bearer token](../../images/4/20e.png)

<!-- and with Visual Studio Code REST client-->
使用Visual Studio Code的REST客户端

![vscode adding bearer token example](../../images/4/21e.png)

<!-- Current application code can be found on [Github](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-9), branch <i>part4-9</i>.-->
当前应用程序的代码可以在[Github](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-9)上找到，分支为<i>part4-9</i>。

<!-- If the application has multiple interfaces requiring identification, JWT''s validation should be separated into its own middleware. An existing library like [express-jwt](https://www.npmjs.com/package/express-jwt) could also be used.-->
如果应用程序有多个需要身份验证的接口，则JWT的验证应该分离到其自己的中间件中。也可以使用类似[express-jwt](https://www.npmjs.com/package/express-jwt)的现有库。

### Problems of Token-based authentication

<!-- Token authentication is pretty easy to implement, but it contains one problem. Once the API user, eg. a React app gets a token, the API has a blind trust to the token holder. What if the access rights of the token holder should be revoked?-->
令牌认证很容易实现，但它存在一个问题。一旦API用户（例如React应用程序）获得令牌，API对令牌持有者有着盲目的信任。如果令牌持有者的访问权限应该被撤销怎么办？

<!-- There are two solutions to the problem. The easier one is to limit the validity period of a token:-->
有两个解决方案。更容易的一个是限制令牌的有效期：

```js
loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  // token expires in 60*60 seconds, that is, in one hour
  // highlight-start
  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    { expiresIn: 60*60 }
  )
  // highlight-end

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})
```

<!-- Once the token expires, the client app needs to get a new token. Usually, this happens by forcing the user to re-login to the app.-->
一旦令牌过期，客户端应用程序需要获取新的令牌。通常，这是通过强制用户重新登录应用程序来实现的。

<!-- The error handling middleware should be extended to give a proper error in the case of an expired token:-->
错误处理中间件应该扩展以在令牌过期的情况下给出适当的错误：

```js
const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token'
    })
  // highlight-start
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }
  // highlight-end

  next(error)
}
```

<!-- The shorter the expiration time, the more safe the solution is. So if the token gets into the wrong hands or user access to the system needs to be revoked, the token is only usable for a limited amount of time. On the other hand, a short expiration time forces a potential pain to a user, one must login to the system more frequently.-->
越短的过期时间，解决方案就越安全。因此，如果令牌落入错误的手中，或者需要撤销用户访问系统，令牌只能在有限的时间内使用。另一方面，短期过期时间会给用户带来潜在的痛苦，他们必须更频繁地登录系统。

<!-- The other solution is to save info about each token to backend database and to check for each API request if the access right corresponding to the token is still valid. With this scheme, access rights can be revoked at any time. This kind of solution is often called a <i>server-side session</i>.-->
另一种解决方案是将每个令牌的信息保存到后端数据库，并在每个API请求时检查与该令牌对应的访问权限是否仍然有效。使用这种方案，可以随时撤销访问权限。这种解决方案通常称为<i>服务器端会话</i>。

<!-- The negative aspect of server-side sessions is the increased complexity in the backend and also the effect on performance since the token validity needs to be checked for each API request to the database. A database access is considerably slower compared to checking the validity of the token itself. That is why it is quite common to save the session corresponding to a token to a <i>key-value database</i> such as [Redis](https://redis.io/) that is limited in functionality compared to eg. MongoDB or relational database but extremely fast in some usage scenarios.-->
服务器端会话的负面方面是后端复杂性的增加，以及对性能的影响，因为每个API请求都需要检查令牌的有效性。与检查令牌本身相比，数据库访问要慢得多。这就是为什么将会话相关令牌保存到<i>键值数据库</i>（如[Redis](https://redis.io/)）中是很常见的，这种数据库的功能比MongoDB或关系数据库有限，但在某些使用场景中非常快。

<!-- When server-side sessions are used, the token is quite often just a random string, that does not include any information about the user as it is quite often the case when jwt-tokens are used. For each API request, the server fetches the relevant information about the identity of the user from the database. It is also quite usual that instead of using Authorization-header, <i>cookies</i> are used as the mechanism for transferring the token between the client and the server.-->
当使用服务器端会话时，令牌通常只是一个随机字符串，不包含有关用户的任何信息，这通常是使用jwt令牌时的情况。对于每个API请求，服务器从数据库中获取有关用户身份的相关信息。也很常见的是，使用<i>cookies</i>作为在客户端和服务器之间传输令牌的机制，而不是使用Authorization-header。

### End notes

<!-- There have been many changes to the code which have caused a typical problem for a fast-paced software project: most of the tests have broken. Because this part of the course is already jammed with new information, we will leave fixing the tests to a non-compulsory exercise.-->
本次代码已经做出了许多更改，这给快节奏的软件项目带来了典型的问题：大多数测试都已经失效。由于本部分课程中已经充满了新的信息，我们将把修复测试留给非强制性练习。

<!-- Usernames, passwords and applications using token authentication must always be used over [HTTPS](https://en.wikipedia.org/wiki/HTTPS). We could use a Node [HTTPS](https://nodejs.org/api/https.html) server in our application instead of the [HTTP](https://nodejs.org/docs/latest-v8.x/api/http.html) server (it requires more configuration). On the other hand, the production version of our application is in Fly.io, so our application stays secure: Fly.io routes all traffic between a browser and the Fly.io server over HTTPS.-->
用户名、密码和使用令牌认证的应用程序必须始终使用[HTTPS](https://en.wikipedia.org/wiki/HTTPS)。 我们可以在应用程序中使用Node [HTTPS](https://nodejs.org/api/https.html)服务器而不是[HTTP](https://nodejs.org/docs/latest-v8.x/api/http.html)服务器（它需要更多的配置）。 另一方面，我们应用程序的生产版本在Fly.io中，因此我们的应用程序保持安全：Fly.io将浏览器和Fly.io服务器之间的所有流量都通过HTTPS路由。

<!-- We will implement login to the frontend in the [next part](/en/part5).-->
我们将在[下一部分](/en/part5)对前端实现登录。

</div>

<div class="tasks">

### Exercises 4.15.-4.23.

<!-- In the next exercises, the basics of user management will be implemented for the Bloglist application. The safest way is to follow the story from part 4 chapter [User administration](/en/part4/user_administration) to the chapter [Token authentication](/en/part4/token_authentication). You can of course also use your creativity.-->
在接下来的练习中，将为Bloglist应用程序实施用户管理的基础知识。最安全的方式是从第4章[用户管理]（/en/part4/user_administration）开始，到[令牌身份验证]（/en/part4/token_authentication）章节。当然，您也可以发挥自己的创造力。

<!-- **One more warning:** If you notice you are mixing async/await and _then_ calls, it is 99% certain you are doing something wrong. Use either or, never both.-->
**再次警告：**如果你注意到你正在混合使用async/await和_then_调用，那么99％的可能性你做错了。 仅使用其中一种，永远不要两者同时使用。

#### 4.15: bloglist expansion, step3

<!-- Implement a way to create new users by doing an HTTP POST request to address <i>api/users</i>. Users have a <i>username, password and name</i>.-->
通过发送HTTP POST请求到<i>api/users</i>地址来实现创建新用户的方法。用户拥有<i>用户名、密码和姓名</i>。

<!-- Do not save passwords to the database as clear text, but use the <i>bcrypt</i> library like we did in part 4 chapter [Creating new users](/en/part4/user_administration#creating-users).-->
不要将密码以明文形式保存到数据库中，而是像我们在第4部分第[创建新用户](/en/part4/user_administration#creating-users)章节中所做的那样，使用<i>bcrypt</i>库。

<!-- **NB** Some Windows users have had problems with <i>bcrypt</i>. If you run into problems, remove the library with command-->
`gem uninstall bcrypt`

**NB** 有些 Windows 用户在使用 <i>bcrypt</i> 时出现了问题。如果遇到问题，可以使用命令 `gem uninstall bcrypt` 来移除该库。

```bash
npm uninstall bcrypt
```

<!-- and install [bcryptjs](https://www.npmjs.com/package/bcryptjs) instead.-->
并安装[bcryptjs](https://www.npmjs.com/package/bcryptjs)来替代。

<!-- Implement a way to see the details of all users by doing a suitable HTTP request.-->
实现一种通过进行适当的HTTP请求来查看所有用户详细信息的方法。

<!-- The list of users can, for example, look as follows:-->
以下是用户列表的例子：

![browser api/users shows JSON data of two users](../../images/4/22.png)

#### 4.16*: bloglist expansion, step4

<!-- Add a feature which adds the following restrictions to creating new users: Both username and password must be given. Both username and password must be at least 3 characters long. The username must be unique.-->
增加一个功能，对创建新用户施加以下限制：

- 用户名和密码都必须给出。
- 用户名和密码必须至少3个字符长。
- 用户名必须是唯一的。

<!-- The operation must respond with a suitable status code and some kind of an error message if an invalid user is created.-->
操作必须响应适当的状态码以及某种形式的错误消息，如果创建了无效的用户。

<!-- **NB** Do not test password restrictions with Mongoose validations. It is not a good idea because the password received by the backend and the password hash saved to the database are not the same thing. The password length should be validated in the controller as we did in [part 3](/en/part3/node_js_and_express) before using Mongoose validation.-->
**注意**：不要用Mongoose验证来测试密码限制。这不是个好主意，因为后端收到的密码和保存到数据库的密码哈希值不是同一回事。在使用Mongoose验证之前，应该在控制器中验证密码长度，就像我们在[第3章节](/en/part3/node_js_and_express)中所做的那样。

<!-- Also, implement tests that ensure invalid users are not created and that an invalid add user operation returns a suitable status code and error message.-->
也要实施测试，以确保无效用户无法被创建，而无效的添加用户操作返回合适的状态码和错误消息。

#### 4.17: bloglist expansion, step5

<!-- Expand blogs so that each blog contains information on the creator of the blog.-->
扩展博客，使每个博客都包含有关博客创建者的信息。

<!-- Modify adding new blogs so that when a new blog is created,  <i>any</i> user from the database is designated as its creator (for example the one found first). Implement this according to part 4 chapter [populate](/en/part4/user_administration#populate).-->
修改添加新博客，以便在创建新博客时，从数据库中指定 <i>任何</i> 用户为其创建者（例如先找到的用户）。根据第4章[填充](/en/part4/user_administration#populate)来实施此操作。
<!-- Which user is designated as the creator does not matter just yet. The functionality is finished in exercise 4.19.-->
哪位用户被指定为创建者还不重要。功能在练习4.19中已完成。

<!-- Modify listing all blogs so that the creator''s user information is displayed with the blog:-->
修改列出所有博客的功能，以便在博客中显示创建者的用户信息：

![api/blogs embeds creators user information in JSON data](../../images/4/23e.png)

<!-- and listing all users also displays the blogs created by each user:-->
罗列所有用户并显示每个用户创建的博客：

列出所有用户，并显示每个用户创建的博客：

![api/users embeds blogs in JSON data](../../images/4/24e.png)

#### 4.18: bloglist expansion, step6

<!-- Implement token-based authentication according to part 4 chapter [Token authentication](/en/part4/token_authentication).-->
根据第4章[令牌认证](/en/part4/token_authentication)实施令牌认证。

#### 4.19: bloglist expansion, step7

<!-- Modify adding new blogs so that it is only possible if a valid token is sent with the HTTP POST request. The user identified by the token is designated as the creator of the blog.-->
修改添加新博客，以便只有通过HTTP POST请求发送有效令牌时才可能。通过令牌标识的用户被指定为博客的创建者。

#### 4.20*: bloglist expansion, step8

<!-- [This example](/en/part4/token_authentication) from part 4 shows taking the token from the header with the _getTokenFrom_ helper function.-->
[这个例子](/en/part4/token_authentication) 来自第4部分，展示了如何使用_getTokenFrom_辅助函数从头中获取令牌。

<!-- If you used the same solution, refactor taking the token to a [middleware](/en/part3/node_js_and_express#middleware). The middleware should take the token from the <i>Authorization</i> header and place it into the <i>token</i> field of the <i>request</i> object.-->
如果您使用相同的解决方案，请将令牌重构为[中间件](/en/part3/node_js_and_express#middleware)。该中间件应从<i>Authorization</i>标头中获取令牌，并将其放入<i>request</i>对象的<i>token</i>字段中。

<!-- In other words, if you register this middleware in the <i>app.js</i> file before all routes-->
, it will be called on every request

如果你在<i>app.js</i>文件中把这个中间件注册在所有路由之前，那么它就会在每次请求时被调用。

```js
app.use(middleware.tokenExtractor)
```

<!-- Routes can access the token with _request.token_:-->
路由可以通过\_request.token\_访问令牌：

```js
blogsRouter.post('/', async (request, response) => {
  // ..
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  // ..
})
```

<!-- Remember that a normal [middleware function](/en/part3/node_js_and_express#middleware) is a function with three parameters, that at the end calls the last parameter <i>next</i> to move the control to the next middleware:-->
记住，一个正常的[中间件函数](/en/part3/node_js_and_express#middleware)是一个有三个参数的函数，最后调用最后一个参数<i>next</i>来将控制权移交给下一个中间件：

```js
const tokenExtractor = (request, response, next) => {
  // code that extracts the token

  next()
}
```

#### 4.21*: bloglist expansion, step9

<!-- Change the delete blog operation so that a blog can be deleted only by the user who added the blog. Therefore, deleting a blog is possible only if the token sent with the request is the same as that of the blog''s creator.-->
改变删除博客操作，只有添加博客的用户才能删除该博客。因此，只有当发送的请求的令牌与博客创建者的令牌相同时，才可以删除博客。

<!-- If deleting a blog is attempted without a token or by an invalid user, the operation should return a suitable status code.-->
如果没有令牌或由无效用户尝试删除博客，操作应返回适当的状态码。

<!-- Note that if you fetch a blog from the database,-->
the author's name should be included

注意：如果从数据库获取博客，应包括作者的名字。

```js
const blog = await Blog.findById(...)
```

<!-- the field <i>blog.user</i> does not contain a string, but an Object. So if you want to compare the id of the object fetched from the database and a string id, a normal comparison operation does not work. The id fetched from the database must be parsed into a string first.-->
字段<i>blog.user</i>中不包含一个字符串，而是一个对象。因此，如果要比较从数据库获取的对象的id和字符串id，则无法使用正常的比较操作。必须首先将从数据库获取的id解析为字符串。

```js
if ( blog.user.toString() === userid.toString() ) ...
```

#### 4.22*:  bloglist expansion, step10

<!-- Both the new blog creation and blog deletion need to find out the identity of the user who is doing the operation. The middleware _tokenExtractor_ that we did in exercise 4.20 helps but still both the handlers of <i>post</i> and <i>delete</i> operations need to find out who the user holding a specific token is.-->
两种新建博客和删除博客操作都需要找出执行操作的用户的身份。我们在练习4.20中做的中间件_tokenExtractor_有所帮助，但是<i>post</i>和<i>delete</i>操作的处理程序仍然需要找出持有特定令牌的用户是谁。

<!-- Now create a new middleware _userExtractor_, that finds out the user and sets it to the request object. When you register the middleware in <i>app.js</i>-->
现在创建一个新的中间件_userExtractor_，它可以找到用户并将其设置到请求对象中。当你在<i>app.js</i>中注册中间件时

```js
app.use(middleware.userExtractor)
```

<!-- the user will be set in the field _request.user_:-->
用户将被设置在字段`_request.user_`中：

```js
blogsRouter.post('/', async (request, response) => {
  // get user from request object
  const user = request.user
  // ..
})

blogsRouter.delete('/:id', async (request, response) => {
  // get user from request object
  const user = request.user
  // ..
})
```

<!-- Note that it is possible to register a middleware only for a specific set of routes. So instead of using _userExtractor_ with all the routes,-->
you can register it only for the routes that require user information.

注意，可以只为特定的路由集注册中间件。因此，您可以只为需要用户信息的路由注册_userExtractor_，而不是对所有路由使用它。

```js
// use the middleware in all routes
app.use(userExtractor) // highlight-line

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
```

<!-- we could register it to be only executed with path <i>/api/blogs</i> routes:-->
我們可以將它註冊為只能用路徑<i>/api/blogs</i>路由執行：

```js
// use the middleware only in /api/blogs routes
app.use('/api/blogs', userExtractor, blogsRouter) // highlight-line
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
```

<!-- As can be seen, this happens by chaining multiple middlewares as the parameter of function <i>use</i>. It would also be possible to register a middleware only for a specific operation:-->
如可以看到，这是通过把多个中间件作为函数<i>use</i>的参数来实现的。也可以只为特定操作注册一个中间件：

```js
router.post('/', userExtractor, async (request, response) => {
  // ...
}
```

#### 4.23*:  bloglist expansion, step11

<!-- After adding token-based authentication the tests for adding a new blog broke down. Fix the tests. Also, write a new test to ensure adding a blog fails with the proper status code <i>401 Unauthorized</i> if a token is not provided.-->
在添加基于令牌的认证后，添加新博客的测试崩溃了。修复测试。另外，编写一个新的测试，以确保如果没有提供令牌，添加博客将以<i>401 Unauthorized</i>的状态码失败。

<!-- [This](https://github.com/visionmedia/supertest/issues/398) is most likely useful when doing the fix.-->
[这](https://github.com/visionmedia/supertest/issues/398)很可能在修复时很有用。

<!-- This is the last exercise for this part of the course and it''s time to push your code to GitHub and mark all of your finished exercises to the [exercise submission system](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).-->
这是本课程的最后一个练习，是时候把你的代码推送到GitHub上，并将所有已完成的练习提交到[练习提交系统](https://studies.cs.helsinki.fi/stats/courses/fullstackopen)。

</div>
