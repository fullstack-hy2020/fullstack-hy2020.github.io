---
mainImage: ../../../images/part-4.svg
part: 4
letter: d
lang: zh
---

<div class="content">


Users must be able to log into our application, and when a user is logged in, their user information must automatically be attached to any new notes they create. 
用户必须能够登录到我们的应用，当用户登录时，他们的用户信息必须自动附加到他们创建的任何新便笺上。

We will now implement support for [token based authentication](https://scotch.io/tutorials/the-ins-and-outs-of-token-based-authentication#toc-how-token-based-works) to the backend. 
我们现在将在后端实现对[基于令牌的认证]( https://scotch.io/tutorials/the-ins-and-outs-of-token-based-authentication#toc-how-token-based-works 认证)的支持。

The principles of token based authentication are depicted in the following sequence diagram: 
基于令牌的身份验证原理在下面的时序图中进行了描述:

![](../../images/4/16e.png)


- User starts by logging in using a login form implemented with React 
- User 首先使用 React 实现的登录表单登录
    - We will add the login form to the frontend in [part 5](/en/part5) 
- 我们会在[第5章节](/zh/part5)的前端加入登入表格
- This causes the React code to send the username and the password to the server address <i>/api/login</i> as a HTTP POST request. 
- 这导致 React 代码将用户名和密码作为 HTTP POST 请求发送到服务器地址<i>/ api / login</i>。
- If the username and the password are correct, the server generates a <i>token</i> which somehow identifies the logged in user. 
- 如果用户名和密码是正确的，服务器生成一个<i>令牌</i>，它以某种方式识别登录的用户。
    - The token is signed digitally, making it impossible to falsify (with cryptographic means)
- 令牌以数码方式签署，以防伪造(使用加密方法)
- The backend responds with a status code indicating the operation was successful, and returns the token with the response.
- 后端用说明操作成功的状态代码进行响应，并用响应返回令牌。
- The browser saves the token, for example to the state of a React application. 
- 浏览器将令牌保存为 React 应用的状态。
- When the user creates a new note (or does some other operation requiring identification), the React code sends the token to the server with the request.
- 当用户创建一个新的便笺(或者做一些需要标识的其他操作)时，React 代码将该令牌与请求一起发送到服务器。
- The server uses the token to identify the user
- 伺服器使用令牌识别使用者

Let's first implement the functionality for logging in. Install the [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) library, which allows us to generate [JSON web tokens](https://jwt.io/).
让我们首先实现登录的功能，安装[ jsonwebtoken ]( https://github.com/auth0/node-jsonwebtoken )库，它允许我们生成[ JSON web 令牌](https: / / jwt.io /)。

```bash
npm install jsonwebtoken --save
```

The code for login functionality goes to the file controllers/login.js.
登录功能的代码是文件控制器 / login. js。


```js
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({ username: body.username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(body.password, user.passwordHash)

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

The code starts by searching for the user from the database by the <i>username</i> attached to the request. 
代码首先从数据库中搜索该用户，搜索时使用附加在请求上的<i>用户名</i>。
Next, it checks the <i>password</i>, also attached to the request. 
接下来，它检查<i>password</i>，也附加到请求。
Because the passwords themselves are not saved to the database, but <i>hashes</i> calculated from the passwords, the _bcrypt.compare_ method is used to check if the password is correct: 
因为密码本身并没有保存到数据库中，但是<i>哈希</i> 是从密码计算出来的，所以使用 bcrypt. com pare 方法来检查密码是否正确:

```js
await bcrypt.compare(body.password, user.passwordHash)
```

If the user is not found, or the password is incorrect, the request is responded to with the status code [401 unauthorized](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.2). The reason for the failure is explained in the response body. 
如果没有找到用户，或者密码不正确，请求将用状态码[401 unauthorized ]( https://www.w3.org/protocols/rfc2616/rfc2616-sec10.html#sec10.4.2)响应。 在响应体中解释了故障的原因。

If the password is correct, a token is created with the method  _jwt.sign_. The token contains the username and the user id in a digitally signed form. 
如果密码正确，则使用 jwt.sign 方法创建一个令牌。 令牌包含数字签名表单中的用户名和用户 id。

```js
const userForToken = {
  username: user.username,
  id: user._id,
}

const token = jwt.sign(userForToken, process.env.SECRET)
```

The token has been digitally signed using a string from the environment variable <i>SECRET</i> as the <i>secret</i>.
这个令牌已经使用环境变量的<i>SECRET</i> 字符串作为<i>SECRET</i> 进行了数字签名。
The digital signature ensures that only parties who know the secret can generate a valid token. 
数字签名确保只有知道秘密的各方才能生成有效的令牌。
The value for the environment variable must be set in the <i>.env</i> file. 
环境变量的值必须在 i. env / i 文件中设置。

A successful request is responded to with the status code <i>200 OK</i>. The generated token and the username of the user are sent back in the response body. 
成功的请求用状态码 i200 OK / i 响应。 生成的令牌和用户的用户名将被发送回响应体。

Now the code for login just has to be added to the application by adding the new router to <i>app.js</i>. 
现在只需将新路由器添加到<i>app.js</i> 中，就可以将登录代码添加到应用中。

```js
const loginRouter = require('./controllers/login')

//...

app.use('/api/login', loginRouter)
```

Let's try logging in using VS Code REST-client: 
让我们尝试使用 VS Code REST-client 登录:

![](../../images/4/17e.png)


It does not work. The following is printed to console: 
它不工作。如下是打印到控制台的:

```bash
(node:32911) UnhandledPromiseRejectionWarning: Error: secretOrPrivateKey must have a value
    at Object.module.exports [as sign] (/Users/mluukkai/opetus/_2019fullstack-koodit/osa3/notes-backend/node_modules/jsonwebtoken/sign.js:101:20)
    at loginRouter.post (/Users/mluukkai/opetus/_2019fullstack-koodit/osa3/notes-backend/controllers/login.js:26:21)
(node:32911) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). (rejection id: 2)
```

The command _jwt.sign(userForToken, process.env.SECRET)_ fails. We forgot to set a value to the environment variable <i>SECRET</i>. It can be any string. When we set the value in file <i>.env</i>, the login works. 
命令 jwt.sign (userForToken，process.env.SECRET)失败。 我们忘记设置环境变量的值<i>SECRET</i>。 它可以是任何字符串。 当我们设置文件<i>中的值时。 Env</i>，登录工作。

A successful login returns the user details and the token: 
一个成功的登录将返回用户详细信息和令牌:

![](../../images/4/18ea.png)


A wrong username or password returns an error message and the proper status code:
错误的用户名或密码会返回错误消息和正确的状态码:

![](../../images/4/19ea.png)


### Limiting creating new notes to logged in users
# # # 限制登录用户创建新便笺

Let's change creating new notes so that it is only possible if the post request has a valid token attached. 
让我们更改创建新的便笺，这样只有在 post 请求附加了一个有效的令牌时才有可能。
The note is then saved to the notes list of the user identified by the token. 
然后，便笺被保存到由该标记标识的用户的便笺列表中。

There are several ways of sending the token from the browser to the server. We will use the [Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization) header. The header also tells which [authentication schema](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#Authentication_schemes) is used. This can be necessary if the server offers multiple ways to authenticate. 
有几种方法可以将令牌从浏览器发送到服务器。 我们将使用[授权]( https://developer.mozilla.org/en-us/docs/web/http/headers/Authorization )标头。 报头还会告诉用户使用了哪个[身份验证模式]( https://developer.mozilla.org/en-us/docs/web/http/authentication#authentication_schemes )。 如果服务器提供多种身份验证方法，则可能需要这样做。
Identifying the schema tells the server how the attached credentials should be interpreted. 
识别模式告诉服务器应该如何解释附加的凭据。

The <i>Bearer</i> schema is suitable to our needs. 
I / Bearer / i 模式适合我们的需要。

In practice, this means that if the token is for example, the string <i>eyJhbGciOiJIUzI1NiIsInR5c2VybmFtZSI6Im1sdXVra2FpIiwiaW</i>, the Authorization header will have the value: 
实际上，这意味着如果令牌是字符串<i>eyJhbGciOiJIUzI1NiIsInR5c2VybmFtZSI6Im1sdXVra2FpIiwiaW</i>，授权头将具有如下值:

<pre>
预
Bearer eyJhbGciOiJIUzI1NiIsInR5c2VybmFtZSI6Im1sdXVra2FpIiwiaW
载体 eyJhbGciOiJIUzI1NiIsInR5c2VybmFtZSI6Im1sdXVra2FpIiwiaW
</pre>
预备

Creating new notes will change like so: 
创建新的便笺会像这样改变:

```js
const jwt = require('jsonwebtoken') //highlight-line

// ...
  //highlight-start
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}
  //highlight-end

notesRouter.post('/', async (request, response) => {
  const body = request.body
  const token = getTokenFrom(request)

//highlight-start
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)
//highlight-end

  const note = new Note({
    content: body.content,
    important: body.important === undefined ? false : body.important,
    date: new Date(),
    user: user._id
  })

  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()

  response.json(savedNote.toJSON())
})
```

The helper function _getTokenFrom_ isolates the token from the <i>authorization</i> header. The validity of the token is checked with _jwt.verify_. The method also decodes the token, or returns the Object which the token was based on: 
Helper 函数 getTokenFrom 将令牌与<i>authorization</i> 头隔离开来。 使用 jwt.verify 检查令牌的有效性。 该方法还对令牌进行解码，或者返回令牌所基于的 Object:

```js
const decodedToken = jwt.verify(token, process.env.SECRET)
```

The object decoded from the token contains the <i>username</i> and <i>id</i> fields, which tells the server who made the request. 
从令牌解码的对象包含<i>用户名</i> 和<i>id</i> 字段，它告诉服务器谁发出了请求。

If there is no token, or the object decoded from the token does not contain the users identity (_decodedToken.id_ is undefined), error status code [401 unauthorized](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.2) is returned and the reason for the failure is explained in the response body. 
如果没有令牌，或者从令牌解码的对象不包含用户标识(decodedToken.id 未定义) ，则返回错误状态代码[401 unauthorized ]( https://www.w3.org/protocols/rfc2616/rfc2616-sec10.html#sec10.4.2) ，并在响应体中解释失败的原因。

```js
if (!token || !decodedToken.id) {
  return response.status(401).json({
    error: 'token missing or invalid'
  })
}
```

When the identity of the maker of the request is resolved, the execution continues as before. 
当请求的创建者的身份被解析时，执行仍然像以前一样继续。

A new note can now be created using Postman if the <i>authorization</i> header is given the correct value, the string <i>bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ</i>, where the second value is the token returned by the <i>login</i> operation. 
如果<i>authorization</i> 头被赋予了正确的值，那么现在可以使用 Postman 创建一个新的通知，该值是字符串<i>bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ</i>，其中第二个值是<i>login</i> 操作返回的令牌。

Using Postman this looks as follows: 
使用 Postman 这看起来如下:

![](../../images/4/20e.png)


and with Visual Studio Code REST client
和 Visual Studio Code REST 客户端

![](../../images/4/21e.png)


### Error handling
错误处理

Token verification can also cause a <i>JsonWebTokenError</i>. If we for example remove a few characters from the token and try creating a new note, this happens: 
令牌验证还可能导致<i>JsonWebTokenError</i>。 例如，如果我们从标记中删除一些字符并尝试创建一个新的便笺，就会发生如下情况:

```bash
JsonWebTokenError: invalid signature
    at /Users/mluukkai/opetus/_2019fullstack-koodit/osa3/notes-backend/node_modules/jsonwebtoken/verify.js:126:19
    at getSecret (/Users/mluukkai/opetus/_2019fullstack-koodit/osa3/notes-backend/node_modules/jsonwebtoken/verify.js:80:14)
    at Object.module.exports [as verify] (/Users/mluukkai/opetus/_2019fullstack-koodit/osa3/notes-backend/node_modules/jsonwebtoken/verify.js:84:10)
    at notesRouter.post (/Users/mluukkai/opetus/_2019fullstack-koodit/osa3/notes-backend/controllers/notes.js:40:30)
```

There are many possible reasons for a decoding error. The token can be faulty (like in our example), falsified, or expired. Let's extend our errorHandler middleware to take into account the different decoding errors. 
译码错误有很多可能的原因。 令牌可以是错误的(如我们的示例中所示)、伪造的或过期的。 让我们扩展 errorHandler 中间件，以考虑不同的解码错误。

```js
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({
      error: 'malformatted id'
    })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({
      error: error.message 
    })
  } else if (error.name === 'JsonWebTokenError') {  // highlight-line
    return response.status(401).json({ // highlight-line
      error: 'invalid token' // highlight-line
    }) // highlight-line
  }

  logger.error(error.message)

  next(error)
}
```

Current application code can be found on [Github](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-9), branch <i>part4-9</i>.
当前的应用代码可以在[ Github ]( https://Github.com/fullstack-hy2020/part3-notes-backend/tree/part4-9) ，branch<i>part4-9</i> 上找到。

If the application has multiple interfaces requiring identification, JWT's validation should be separated into its own middleware. Some existing library like [express-jwt](https://www.npmjs.com/package/express-jwt) could also be used. 
如果应用有多个需要标识的接口，那么 JWT 的验证应该分离到它自己的中间件中。 还可以使用一些现有的库，如[ express-jwt ]( https://www.npmjs.com/package/express-jwt )。

### End notes
结束便笺

There have been many changes to the code which have caused a typical problem for a fast-paced software project: most of the tests have broken. Because this part of the course is already jammed with new information, we will leave fixing the tests to a non compulsory exercise. 
对于快节奏的软件项目来说，代码有很多变化，这些变化导致了一个典型的问题: 大多数测试都失败了。 因为这一部分的课程已经被新的信息塞满了，我们将把修改测试留给一个非强制性的练习。

Usernames, passwords and applications using token authentication must always be used over [HTTPS](https://en.wikipedia.org/wiki/HTTPS). We could use a Node [HTTPS](https://nodejs.org/api/https.html) server in our application instead of the [HTTP](https://nodejs.org/docs/latest-v8.x/api/http.html) server (it requires more configuration). On the other hand, the production version of our application is in Heroku, so our applications stays secure: Heroku routes all traffic between a browser and the Heroku server over HTTPS. 
使用令牌认证的用户名、密码和应用必须始终在[ HTTPS ]( HTTPS://en.wikipedia.org/wiki/HTTPS )上使用。 我们可以在应用中使用 Node [ HTTPS ]( HTTPS://nodejs.org/api/HTTPS.html )服务器，而不是[ HTTP ]( HTTPS://nodejs.org/docs/latest-v8.x/api/HTTP.html )服务器(它需要更多的配置)。 另一方面，我们的应用的生产版本在 Heroku，所以我们的应用是安全的: Heroku 通过 HTTPS 在浏览器和 Heroku 服务器之间路由所有的流量。

We will implement login to the frontend in the [next part](/en/part5).
我们将在[下一部分](/ en / part5)中实现对前端的登录。

</div>


<div class="tasks">


### Exercises 4.15.-4.22.
练习4.15-4.22。

In the next exercises, basics of user management will be implemented for the Bloglist application. The safest way is to follow the story from part 4 chapter [User administration](/en/part4/user_administration) to the chapter [Token-based authentication](/en/part4/token_authentication). You can of course also use your creativity. 
在接下来的练习中，我们将为 Bloglist 应用实现基本的用户管理。 最安全的方法是遵循第4章[用户管理](/ en / part4 / User administration)到[基于令牌的身份验证](/ en / part4 / token authentication)这一章的内容。 当然，你也可以运用你的创造力。

**One more warning:** If you notice you are mixing async/await and _then_ calls, it is 99% certain you are doing something wrong. Use either or, never both. 
**还有一个警告: **如果你注意到你正在混合 async / await 然后调用，99% 肯定你做错了什么。 要么使用，要么使用，不要两者都使用。

#### 4.15: bloglist expansion, 步骤4
4.15: bloglist expansion，步骤4

Implement a way to create new users by doing a HTTP POST-request to address <i>api/users</i>. Users have <i>username
通过执行 HTTP POST-request 来寻址<i>api / Users</i>，实现创建新用户的方法
, password and name</i>.
、密码及名称 / i。

Do not save passwords to the database as clear text, but use the <i>bcrypt</i> library like we did in part 4 chapter [Creating new users](/en/part4/user_administration#creating-users).
不要将数据库的密码保存为明文，而是使用<i>bcrypt</i> 库，就像我们在第4章[创建新用户](/ en / part4 / user administration # Creating-users)中所做的那样。

**NB** Some Windows users have had problems with <i>bcrypt</i>. If you run into problems, remove the library with command 
有些 Windows 用户在<i>bcrypt</i> 方面有问题。如果遇到问题，请使用命令删除该库

```bash
npm uninstall bcrypt --save 
```

and install [bcryptjs](https://www.npmjs.com/package/bcryptjs) instead. 
并安装[ bcryptjs ]( https://www.npmjs.com/package/bcryptjs )。

Implement a way to see the details of all users by doing a suitable HTTP request. 
通过执行合适的 HTTP 请求，实现查看所有用户详细信息的方法。

List of users can for example, look as follows: 
例如，用户列表可以如下所示:

![](../../images/4/22.png)


#### 4.16*: bloglist expansion, 步骤5
4.16 * : bloglist expansion，步骤5

Add a feature which adds the following restrictions to creating new users: Both username and password must be given. Both username and password must be at least 3 characters long. The username must be unique. 
添加一个添加如下限制来创建新用户的特性: 必须同时给出用户名和密码。 用户名和密码必须至少3个字符长。 用户名必须是唯一的。

The operation must respond with a suitable status code and some kind of an error message if invalid user is created. 
如果创建了无效用户，操作必须使用适当的状态代码和某种错误消息进行响应。

**NB** Do not test password restrictions with Mongoose validations. It is not a good idea because the password received by the backend and the password hash saved to the database are not the same thing. The password length should be validated in the controller like we did in [part 3](/en/part3/validation_and_es_lint) before using Mongoose validation. 
**注意 **不要用 Mongoose 验证测试密码限制。 这不是一个好主意，因为后端接收到的密码和保存到数据库的密码散列不是一回事。 在使用 Mongoose 验证之前，应该像在[ part 3](/ en / part3 / validation 和 es lint)中那样在控制器中验证密码长度。

Also, implement tests which check that invalid users are not created and invalid add user operation returns a suitable status code and error message. 
此外，实现检查无效用户未被创建和无效的添加用户操作返回合适的状态码和错误消息的测试。

#### 4.17: bloglist expansion, 步骤6
4.17: bloglist expansion，步骤6

Expand blogs so that each blog contains information on the creator of the blog. 
扩展博客，使每个博客包含关于博客创建者的信息。

Modify adding new blogs so that when a new blog is created,  <i>any</i> user from the database is designated as its creator (for example the one found first). Implement this according to part 4 chapter [populate](/en/part4/user_administration#populate).
修改添加新博客，以便在创建新博客时，将数据库中的 i / i 用户指定为其创建者(例如首先找到的那个)。 根据第4章[ populate ](/ en / part4 / user administration # populate)实现这一点。
Which user is designated as the creator does not matter just yet. The functionality is finished in exercise 4.19. 
哪个用户被指定为创建者还不重要。这个功能在练习4.19中完成。

Modify listing all blogs so that the creator's user information is displayed with the blog: 
修改所有博客列表，以便创建者的用户信息与博客一起显示:

![](../../images/4/23e.png)


and listing all users also displays the blogs created by each user: 
并列出所有用户，同时显示每个用户创建的博客:

![](../../images/4/24e.png)


#### 4.18: bloglist expansion, 步骤7
4.18: bloglist expansion，步骤7

Implement token-based authentication according to part 4 chapter [Token authentication](/en/part4/token_authentication).
根据第4章节[令牌认证](/ en / part4 / 令牌认证)实现基于令牌的认证。

#### 4.19: bloglist expansion, 步骤8
4.19: bloglist expansion，步骤8

Modify adding new blogs so that it is only possible if a valid token is sent with the HTTP POST request. The user identified by the token is designated as the creator of the blog. 
修改添加新博客的内容，以便只有在使用 HTTP POST 请求发送有效令牌的情况下才可以添加新博客。 该令牌标识的用户被指定为博客的创建者。

#### 4.20*: bloglist expansion, 步骤9
4.20 * : bloglist expansion，步骤9

[This example](/en/part4/token_authentication) from part 4 shows taking the token from the header with the _getTokenFrom_ helper function.
第4章节的[示例](/ en / part4 / token authentication)显示了使用 getTokenFrom helper 函数从头部获取令牌。

If you used the same solution, refactor taking the token to a [middleware](/en/part3/node_js_and_express#middleware). The middleware should take the token from the <i>Authorization</i> header and place it to the <i>token</i> field of the <i>request</i> object. 
如果您使用相同的解决方案，重构将令牌带到[中间件](/ en / part3 / node js 和 express # 中间件)。 中间件应该从<i>Authorization</i> 标头获取令牌，并将其放置到<i>request</i> 对象的<i>token</i> 字段。

In other words, if you register this middleware in the <i>app.js</i> file before all routes
换句话说，如果在所有路由之前在<i>app.js</i> 文件中注册这个中间件

```js
app.use(middleware.tokenExtractor)
```

routes can access the token with _request.token_:
路由可以使用 request.token 访问令牌:
```js
blogsRouter.post('/', async (request, response) => {
  // ..
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  // ..
})
```

Remember that a normal [middleware](/en/part3/node_js_and_express#middleware) is a function with three parameters, that at the end calls the last parameter <i>next</i> in order to move the control to next middleware:
请记住，普通的[中间件](/ en / part3 / node js 和 express # 中间件)是一个带有三个参数的函数，它在最后调用最后一个参数<i>next</i>，以便将控制移动到下一个中间件:

```js
const tokenExtractor = (request, response, next) => {
  // code that extracts the token

  next()
}
```

#### 4.21*: bloglist expansion, 步骤10
4.21 * : bloglist expansion，步骤10

Change the delete blog operation so that a blog can be deleted only by the user who added the blog. Therefore, deleting a blog is possible only if the token sent with the request is the same as that of the blog's creator. 
更改删除博客操作，以便只有添加博客的用户才能删除博客。 因此，只有在请求中发送的令牌与博客创建者的令牌相同时，才可以删除博客。

If deleting a blog is attempted without a token or by a wrong user, the operation should return a suitable status code. 
如果在没有标记的情况下尝试删除博客，或者由错误的用户删除，则该操作应该返回一个合适的状态代码。

Note that if you fetch a blog from the database,
请注意，如果您从数据库中获取博客,

```js
const blog = await Blog.findById(...)
```

the field <i>blog.user</i> does not contain a string, but an Object. So if you want to compare the id of the object fetched from the database and a string id, normal comparison operation does not work. The id fetched from the database must be parsed into a string first. 
字段<i>blog.user</i> 不包含字符串，而是包含一个 Object。 因此，如果要比较从数据库获取的对象的 id 和字符串 id，通常的比较操作是不起作用的。 从数据库获取的 id 必须首先解析为字符串。

```js
if ( blog.user.toString() === userid.toString() ) ...
```

#### 4.22*:  bloglist expansion, 步骤11
4.22 * : bloglist expansion，步骤11

After adding token based authentication the tests for adding a new blog broke. down Fix now the tests. Write also a new test that ensures that adding a blog fails with proper status code <i>401 Unauthorized</i> it token is not provided.
在添加了基于令牌的身份验证之后，添加新博客的测试中断了。 现在修复测试。 还要编写一个新的测试，以确保添加一个博客失败与适当的状态代码<i>401 Unauthorized</i> it 令牌没有提供。

[This](https://github.com/visionmedia/supertest/issues/398) is most likely useful when doing the fix.
在进行修复时，[ This ]( https://github.com/visionmedia/supertest/issues/398)很可能是最有用的。

This is the last exercise for this part of the course and it's time to push your code to GitHub and mark all of your finished exercises to the [exercise submission system](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).
这是本课程这一部分的最后一个练习，是时候将你的代码推送到 GitHub，并将所有完成的练习标记到[练习提交系统]( https://studies.cs.helsinki.fi/stats/courses/fullstackopen )。

<!---
note left of user
  user fills in login form with
  username and password
end note
user -> browser: login button pressed

browser -> backend: HTTP POST /api/login { username, password }
note left of backend
  backend generates TOKEN that identifies user 
end note
backend -> browser: TOKEN returned as message body 
note left of browser
  browser saves TOKEN
end note
note left of user
  user creates a note
end note
user -> browser: create note button pressed
browser -> backend: HTTP POST /api/notes { content } TOKEN in header
note left of backend
  backend identifies userfrom the TOKEN
end note

backend -> browser: 201 created

user -> user:
-->

</div>

