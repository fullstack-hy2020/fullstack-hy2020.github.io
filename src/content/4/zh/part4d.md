---
mainImage: ../../../images/part-4.svg
part: 4
letter: d
lang: zh
---

<div class="content">

<!-- Users must be able to log into our application, and when a user is logged in, their user information must automatically be attached to any new notes they create.-->
 用户必须能够登录我们的应用，当用户登录后，他们的用户信息必须自动附加到他们创建的任何新笔记上。

<!-- We will now implement support for [token based authentication](https://scotch.io/tutorials/the-ins-and-outs-of-token-based-authentication#toc-how-token-based-works) to the backend.-->
我们现在将在后台实现对[基于令牌的认证](https://scotch.io/tutorials/the-ins-and-outs-of-token-based-authentication#toc-how-token-based-works)的支持。

<!-- The principles of token based authentication are depicted in the following sequence diagram:-->
 基于令牌的认证的原则在下面的顺序图中得到描述。

![](../../images/4/16e.png)

<!-- - User starts by logging in using a login form implemented with React-->
 - 用户通过使用React实现的登录表单开始登录
<!--     - We will add the login form to the frontend in [part 5](/en/part5)-->
 - 我们将在[第五章节](/en/part5)中把登录表单添加到前端。
<!-- - This causes the React code to send the username and the password to the server address <i>/api/login</i> as a HTTP POST request.-->
 - 这使得React代码将用户名和密码作为HTTP POST请求发送到服务器地址<i>/api/login</i>。
<!-- - If the username and the password are correct, the server generates a <i>token</i> which somehow identifies the logged in user.-->
 - 如果用户名和密码正确，服务器会生成一个<i>token</i>，以某种方式识别登录的用户。
<!--     - The token is signed digitally, making it impossible to falsify (with cryptographic means)-->
 - 令牌经过数字签名，使其不可能被伪造（用密码学手段）。
<!-- - The backend responds with a status code indicating the operation was successful, and returns the token with the response.-->
 - 后台以一个状态代码响应，表明操作成功，并将令牌与响应一起返回。
<!-- - The browser saves the token, for example to the state of a React application.-->
 - 浏览器保存令牌，例如保存到React应用的状态中。
<!-- - When the user creates a new note (or does some other operation requiring identification), the React code sends the token to the server with the request.-->
 - 当用户创建一个新的笔记（或做一些其他需要识别的操作），React代码将令牌与请求一起发送到服务器。
<!-- - The server uses the token to identify the user-->
 - 服务器使用该令牌来识别用户

<!-- Let's first implement the functionality for logging in. Install the [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) library, which allows us to generate [JSON web tokens](https://jwt.io/).-->
 让我们首先实现登录的功能。安装[jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)库，它允许我们生成[JSON web tokens](https://jwt.io/)。

```bash
npm install jsonwebtoken
```

<!-- The code for login functionality goes to the file controllers/login.js.-->
 登录功能的代码在controllers/login.js文件中。


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
 代码开始时，通过请求中附加的<i>用户名</i>从数据库中搜索用户。
<!-- Next, it checks the <i>password</i>, also attached to the request.-->
 接下来，它检查同样附在请求中的<i>密码</i>。
<!-- Because the passwords themselves are not saved to the database, but <i>hashes</i> calculated from the passwords, the _bcrypt.compare_ method is used to check if the password is correct:-->
 因为密码本身没有被保存到数据库中，而是从密码中计算出的<i>哈希</i>，_bcrypt.compare_方法被用来检查密码是否正确。

```js
await bcrypt.compare(body.password, user.passwordHash)
```

<!-- If the user is not found, or the password is incorrect, the request is responded to with the status code [401 unauthorized](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.2). The reason for the failure is explained in the response body.-->
 如果没有找到用户，或者密码不正确，请求将以状态代码[401 unauthorized](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.2)响应。失败的原因将在响应体中解释。

<!-- If the password is correct, a token is created with the method  _jwt.sign_. The token contains the username and the user id in a digitally signed form.-->
 如果密码正确，会用_jwt.sign_方法创建一个令牌。该令牌以数字签名的形式包含用户名和用户ID。

```js
const userForToken = {
  username: user.username,
  id: user._id,
}

const token = jwt.sign(userForToken, process.env.SECRET)
```

<!-- The token has been digitally signed using a string from the environment variable <i>SECRET</i> as the <i>secret</i>.-->
 该令牌已经用环境变量<i>SECRET</i>中的一个字符串作为<i>secret</i>的数字签名。
<!-- The digital signature ensures that only parties who know the secret can generate a valid token.-->
 数字签名确保只有知道秘密的各方才能生成有效的令牌。
<!-- The value for the environment variable must be set in the <i>.env</i> file.-->
环境变量的值必须在<i>.env</i>文件中设置。

<!-- A successful request is responded to with the status code <i>200 OK</i>. The generated token and the username of the user are sent back in the response body.-->
 一个成功的请求会以状态代码<i>200 OK</i>得到响应。生成的令牌和用户的用户名会在响应体中被送回来。

<!-- Now the code for login just has to be added to the application by adding the new router to <i>app.js</i>.-->
 现在登录的代码只需要通过添加新的路由器到<i>app.js</i>来添加到应用中。

```js
const loginRouter = require('./controllers/login')

//...

app.use('/api/login', loginRouter)
```

<!-- Let's try logging in using VS Code REST-client:-->
 让我们试试用VS Code REST-客户端登录。

![](../../images/4/17e.png)

<!-- It does not work. The following is printed to console:-->
 它不工作。下面的内容被打印到控制台。

```bash
(node:32911) UnhandledPromiseRejectionWarning: Error: secretOrPrivateKey must have a value
    at Object.module.exports [as sign] (/Users/mluukkai/opetus/_2019fullstack-koodit/osa3/notes-backend/node_modules/jsonwebtoken/sign.js:101:20)
    at loginRouter.post (/Users/mluukkai/opetus/_2019fullstack-koodit/osa3/notes-backend/controllers/login.js:26:21)
(node:32911) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). (rejection id: 2)
```

<!-- The command _jwt.sign(userForToken, process.env.SECRET)_ fails. We forgot to set a value to the environment variable <i>SECRET</i>. It can be any string. When we set the value in file <i>.env</i>, the login works.-->
 命令_jwt.sign(userForToken, process.env.secret)_失败。我们忘记给环境变量<i>SECRET</i>设置一个值。它可以是任何字符串。当我们在文件<i>.env</i>中设置了这个值，登录就成功了。

<!-- A successful login returns the user details and the token:-->
 一个成功的登录会返回用户的详细资料和令牌。

![](../../images/4/18ea.png)

<!-- A wrong username or password returns an error message and the proper status code:-->
 一个错误的用户名或密码会返回一个错误信息和正确的状态代码。

![](../../images/4/19ea.png)

### Limiting creating new notes to logged in users

<!-- Let's change creating new notes so that it is only possible if the post request has a valid token attached.-->
 让我们改变创建新笔记的方式，以便只有在帖子请求附有有效的令牌时才有可能。
<!-- The note is then saved to the notes list of the user identified by the token.-->
 然后该笔记被保存到由令牌识别的用户的笔记列表中。

<!-- There are several ways of sending the token from the browser to the server. We will use the [Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization) header. The header also tells which [authentication scheme](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#Authentication_schemes) is used. This can be necessary if the server offers multiple ways to authenticate.-->
 有几种方法可以将令牌从浏览器发送到服务器。我们将使用[授权](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization)头。该标头还告诉我们使用哪种[认证方案](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#Authentication_schemes)。如果服务器提供多种认证方式，这可能是必要的。
<!-- Identifying the scheme tells the server how the attached credentials should be interpreted.-->
 识别方案告诉服务器应该如何解释所附凭证。

<!-- The <i>Bearer</i> scheme is suitable to our needs.-->
 <i>Bearer</i>方案适合我们的需要。

<!-- In practice, this means that if the token is for example, the string <i>eyJhbGciOiJIUzI1NiIsInR5c2VybmFtZSI6Im1sdXVra2FpIiwiaW</i>, the Authorization header will have the value:-->
在实践中，这意味着如果令牌是例如字符串<i>eyJhbGciOiJIUzI1NiIsInR5c2VybmFtZSI6Im1sdXVra2FpIwiaW</i>，授权头将有这个值。

<pre>
Bearer eyJhbGciOiJIUzI1NiIsInR5c2VybmFtZSI6Im1sdXVra2FpIiwiaW
</pre>

<!-- Creating new notes will change like so:-->
 创建新的笔记会有这样的变化。

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
//highlight-start
  const token = getTokenFrom(request)

  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) {
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

  response.json(savedNote)
})
```

<!-- The helper function _getTokenFrom_ isolates the token from the <i>authorization</i> header. The validity of the token is checked with _jwt.verify_. The method also decodes the token, or returns the Object which the token was based on. If there is no token passed, it will return error <i>"jwt must be provided"</i>.-->
 辅助函数_getTokenFrom_将令牌从<i>授权</i>头中分离出来。用_jwt.verify_检查令牌的有效性。该方法还对令牌进行解码，或返回令牌所基于的对象。如果没有传递令牌，它将返回错误<i>"必须提供jwt"</i>。

```js
const decodedToken = jwt.verify(token, process.env.SECRET)
```

<!-- The object decoded from the token contains the <i>username</i> and <i>id</i> fields, which tells the server who made the request.-->
 从令牌解码的对象包含<i>用户名</i>和<i>id</i>字段，它告诉服务器谁提出了这个请求。

<!-- If the object decoded from the token does not contain the user's identity (_decodedToken.id_ is undefined), error status code [401 unauthorized](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.2) is returned and the reason for the failure is explained in the response body.-->
 如果从令牌解码出来的对象不包含用户的身份（_decodedToken.id_是未定义的），将返回错误状态代码[401 unauthorized](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.2)，并在响应体中解释失败的原因。

```js
if (!decodedToken.id) {
  return response.status(401).json({
    error: 'token missing or invalid'
  })
}
```

<!-- When the identity of the maker of the request is resolved, the execution continues as before.-->
 当请求者的身份被解决后，执行会像以前一样继续。

<!-- A new note can now be created using Postman if the <i>authorization</i> header is given the correct value, the string <i>bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ</i>, where the second value is the token returned by the <i>login</i> operation.-->
 如果<i>authorization</i>头被赋予正确的值，即字符串<i>bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ</i>，其中第二个值是由<i>login</i>操作返回的令牌，现在可以使用Postman创建一个新的笔记。

<!-- Using Postman this looks as follows:-->
 使用Postman，这看起来如下。

![](../../images/4/20e.png)

<!-- and with Visual Studio Code REST client-->
 而用Visual Studio Code REST客户端

![](../../images/4/21e.png)

### Error handling

<!-- Token verification can also cause a <i>JsonWebTokenError</i>. If we for example remove a few characters from the token and try creating a new note, this happens:-->
令牌验证也会导致<i>JsonWebTokenError</i>。例如，如果我们从令牌中删除几个字符并尝试创建一个新的注释，就会发生这种情况。

```bash
JsonWebTokenError: invalid signature
    at /Users/mluukkai/opetus/_2019fullstack-koodit/osa3/notes-backend/node_modules/jsonwebtoken/verify.js:126:19
    at getSecret (/Users/mluukkai/opetus/_2019fullstack-koodit/osa3/notes-backend/node_modules/jsonwebtoken/verify.js:80:14)
    at Object.module.exports [as verify] (/Users/mluukkai/opetus/_2019fullstack-koodit/osa3/notes-backend/node_modules/jsonwebtoken/verify.js:84:10)
    at notesRouter.post (/Users/mluukkai/opetus/_2019fullstack-koodit/osa3/notes-backend/controllers/notes.js:40:30)
```

<!-- There are many possible reasons for a decoding error. The token can be faulty (like in our example), falsified, or expired. Let's extend our errorHandler middleware to take into account the different decoding errors.-->
 解码错误有很多可能的原因。令牌可以是错误的（就像我们的例子），伪造的，或过期的。让我们扩展我们的errorHandler中间件以考虑到不同的解码错误。

```js
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
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

<!-- Current application code can be found on [Github](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-9), branch <i>part4-9</i>.-->
 目前的应用代码可以在[Github](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-9)上找到，分支<i>part4-9</i>。

<!-- If the application has multiple interfaces requiring identification, JWT's validation should be separated into its own middleware. Some existing library like [express-jwt](https://www.npmjs.com/package/express-jwt) could also be used.-->
 如果应用有多个接口需要识别，JWT's验证应该被分离到自己的中间件中。也可以使用一些现有的库，如[express-jwt](https://www.npmjs.com/package/express-jwt)。

### Problems of Token-based authentication

<!-- Token authentication is pretty easy to implement, but it contains one problem. Once the API user, eg. a React app gets a token, the API has a blind trust to the token holder. What if the access rights of the token holder should be revoked?-->
 Token认证是很容易实现的，但它包含一个问题。一旦API用户，例如React应用得到一个令牌，API就会对令牌持有者产生盲目信任。如果令牌持有者的访问权被撤销了怎么办？

<!-- There are two solutions to the problem. Easier one is to limit the validity period of a token:-->
这个问题有两种解决方案。比较简单的是限制令牌的有效期。

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

<!-- Once the token expires, the client app needs to get a new token. Usually this happens by forcing the user to relogin to the app.-->
 一旦令牌过期，客户端应用需要获得一个新的令牌。通常情况下，这发生在强迫用户重新登录到应用。

<!-- The error handling middleware should be extended to give a proper error in the case of a expired token:-->
 错误处理中间件应该被扩展，以便在令牌过期的情况下给出一个适当的错误。

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

<!-- The shorter the expiration time, the more safe the solution is. So if the token gets into wrong hands, or the user access to the system needs to be revoked, the token is usable only a limited amount of time. On the other hand, a short expiration time forces a potential pain to a user, one must login to the system more frequently.-->
过期时间越短，解决方案就越安全。所以如果令牌落入坏人之手，或者用户对系统的访问需要被撤销，令牌只能在有限的时间内使用。另一方面，过期时间短会给用户带来潜在的痛苦，用户必须更频繁地登录系统。

<!-- The other solution is to save info about each token to backend database and to check for each API request if the access right corresponding to the token is still valid. With this scheme, the access rights can be revoked at any time. This kind of solution is often called a <i>server side session</i>.-->
 另一个解决方案是将每个令牌的信息保存在后端数据库中，并为每个API请求检查该令牌对应的访问权是否仍然有效。通过这种方案，访问权可以在任何时候被撤销。这种方案通常被称为<i>服务器端会话</i>。

<!-- The negative aspect of server side sessions is the increased complexity in the backend and also the effect on performance since the token validity needs to be checked for each API request from database. A database access is considerably slower compared to checking the validity from the token itself. That is why it is a quite common to save the session corresponding to a token to a <i>key-value-database</i> such as [Redis](https://redis.io/) that is limited in functionality compared to eg. MongoDB or relational database but extremely fast in some usage scenarios.-->
 服务器端会话的消极方面是增加了后台的复杂性，也影响了性能，因为每次从数据库请求API时，都需要检查令牌的有效性。与检查令牌本身的有效性相比，数据库访问的速度要慢得多。这就是为什么将令牌对应的会话保存到一个<i>key-value-database</i>的原因，例如[Redis](https://redis.io/)，与MongoDB或关系型数据库相比，其功能有限，但在某些使用场景下速度极快。

<!-- When server side sessions are used, the token is quite often just a random string, that does not include any information about the user as it is quite often the case when jwt-tokens are used. For each API request the server fetches the relevant information about the identity of the user from the database. It is also quite usual that instead of using Authorization-header, <i>cookies</i> are used as the mechanism for transferring the token between the client and the server.-->
 当使用服务器端会话时，令牌通常只是一个随机字符串，不包括关于用户的任何信息，因为在使用jwt令牌时通常是这样的。对于每个API请求，服务器从数据库中获取有关用户身份的相关信息。另外，通常不使用授权头，而是使用<i>cookies</i>作为客户端和服务器之间传输令牌的机制。

### End notes

<!-- There have been many changes to the code which have caused a typical problem for a fast-paced software project: most of the tests have broken. Because this part of the course is already jammed with new information, we will leave fixing the tests to a non compulsory exercise.-->
代码有很多变化，这对一个快节奏的软件项目来说，造成了一个典型的问题：大多数测试都坏了。因为这部分课程已经被新的信息塞满了，我们将把修复测试留给一个非强制性的练习。

<!-- Usernames, passwords and applications using token authentication must always be used over [HTTPS](https://en.wikipedia.org/wiki/HTTPS). We could use a Node [HTTPS](https://nodejs.org/api/https.html) server in our application instead of the [HTTP](https://nodejs.org/docs/latest-v8.x/api/http.html) server (it requires more configuration). On the other hand, the production version of our application is in Heroku, so our application stays secure: Heroku routes all traffic between a browser and the Heroku server over HTTPS.-->
 用户名、密码和使用令牌认证的应用必须始终通过[HTTPS](https://en.wikipedia.org/wiki/HTTPS)使用。我们可以在我们的应用中使用一个Node [HTTPS](https://nodejs.org/api/https.html)服务器，而不是[HTTP](https://nodejs.org/docs/latest-v8.x/api/http.html)服务器（它需要更多的配置）。另一方面，我们的应用的生产版本是在Heroku中，所以我们的应用保持安全。Heroku将浏览器和Heroku服务器之间的所有流量通过HTTPS路由。

<!-- We will implement login to the frontend in the [next part](/en/part5).-->
 我们将在[下一部分](/en/part5)中实现对前端的登录。

</div>

<div class="tasks">

### Exercises 4.15.-4.23.

<!-- In the next exercises, basics of user management will be implemented for the Bloglist application. The safest way is to follow the story from part 4 chapter [User administration](/en/part4/user_administration) to the chapter [Token-based authentication](/en/part4/token_authentication). You can of course also use your creativity.-->
 在接下来的练习中，将为Bloglist应用实现用户管理的基础知识。最安全的方法是从第四章节的[用户管理](/en/part4/user_administration)到[基于令牌的认证](/en/part4/token_authentication)这一章的故事。当然，你也可以发挥你的创造力。

<!-- **One more warning:** If you notice you are mixing async/await and _then_ calls, it is 99% certain you are doing something wrong. Use either or, never both.-->
 **还有一个警告：**如果你注意到你在混合使用async/await和_then_调用，那么99%肯定是你做错了什么。使用其中之一，而不是同时使用。

#### 4.15: bloglist expansion, step3

<!-- Implement a way to create new users by doing a HTTP POST-request to address <i>api/users</i>. Users have <i>username, password and name</i>.-->
 实现一种创建新用户的方法，通过HTTP POST-request来解决<i>api/users</i>。用户有<i>用户名、密码和姓名</i>。

<!-- Do not save passwords to the database as clear text, but use the <i>bcrypt</i> library like we did in part 4 chapter [Creating new users](/en/part4/user_administration#creating-users).-->
 不要将密码以明文形式保存到数据库中，而是使用<i>bcrypt</i>库，就像我们在第四章节[创建新用户](/en/part4/user_administration#creating-users)中所做的那样。

<!-- **NB** Some Windows users have had problems with <i>bcrypt</i>. If you run into problems, remove the library with command-->
 **NB** 一些Windows用户在使用<i>bcrypt</i>时遇到问题。如果你遇到问题，请用命令删除该库

```bash
npm uninstall bcrypt
```

<!-- and install [bcryptjs](https://www.npmjs.com/package/bcryptjs) instead.-->
 并安装 [bcryptjs](https://www.npmjs.com/package/bcryptjs) 来代替。

<!-- Implement a way to see the details of all users by doing a suitable HTTP request.-->
 实现一种方法，通过做一个合适的HTTP请求来查看所有用户的详细信息。

<!-- List of users can for example, look as follows:-->
 例如，用户列表可以如下所示。

![](../../images/4/22.png)

#### 4.16*: bloglist expansion, step4

<!-- Add a feature which adds the following restrictions to creating new users: Both username and password must be given. Both username and password must be at least 3 characters long. The username must be unique.-->
 添加一个功能，在创建新用户时增加以下限制。必须给出用户名和密码。用户名和密码都必须至少有3个字符长。用户名必须是唯一的。

<!-- The operation must respond with a suitable status code and some kind of an error message if invalid user is created.-->
 如果创建了无效的用户，该操作必须以一个合适的状态代码和某种错误信息来回应。

<!-- **NB** Do not test password restrictions with Mongoose validations. It is not a good idea because the password received by the backend and the password hash saved to the database are not the same thing. The password length should be validated in the controller like we did in [part 3](/en/part3/node_js_and_express) before using Mongoose validation.-->
 **NB** 不要用Mongoose验证来测试密码限制。这不是一个好主意，因为后端收到的密码和保存在数据库中的密码哈希值不是一回事。在使用Mongoose验证之前，应该像我们在[第3章节](/en/part3/node_js_and_express)中那样在控制器中验证密码长度。

<!-- Also, implement tests which check that invalid users are not created and invalid add user operation returns a suitable status code and error message.-->
 同时，实施测试，检查无效的用户是否被创建，无效的添加用户操作是否返回合适的状态代码和错误信息。

#### 4.17: bloglist expansion, step5

<!-- Expand blogs so that each blog contains information on the creator of the blog.-->
 扩展博客，使每个博客包含博客创建者的信息。

<!-- Modify adding new blogs so that when a new blog is created,  <i>any</i> user from the database is designated as its creator (for example the one found first). Implement this according to part 4 chapter [populate](/en/part4/user_administration#populate).-->
 修改添加新的博客，以便当一个新的博客被创建时，数据库中的任何<i></i>用户都被指定为它的创建者（例如，首先找到的那个）。根据第4章节章节[populate](/en/part4/user_administration#populate)来实现。
<!-- Which user is designated as the creator does not matter just yet. The functionality is finished in exercise 4.19.-->
哪个用户被指定为创建者还不重要。该功能在练习4.19中完成。

<!-- Modify listing all blogs so that the creator's user information is displayed with the blog:-->
 修改列出所有博客，使创建者的用户信息与博客一起显示。

![](../../images/4/23e.png)

<!-- and listing all users also displays the blogs created by each user:-->
 列出所有用户，同时显示每个用户创建的博客。

![](../../images/4/24e.png)

#### 4.18: bloglist expansion, step6

<!-- Implement token-based authentication according to part 4 chapter [Token authentication](/en/part4/token_authentication).-->
 根据第四章节[令牌认证](/en/part4/token_authentication)实施基于令牌的认证。

#### 4.19: bloglist expansion, step7

<!-- Modify adding new blogs so that it is only possible if a valid token is sent with the HTTP POST request. The user identified by the token is designated as the creator of the blog.-->
 修改添加新的博客，以便只有在HTTP POST请求中发送了有效的令牌才有可能。由令牌识别的用户被指定为博客的创建者。

#### 4.20*: bloglist expansion, step8

<!-- [This example](/en/part4/token_authentication) from part 4 shows taking the token from the header with the _getTokenFrom_ helper function.-->
 [这个例子](/en/part4/token_authentication)来自第四章节，显示了用_getTokenFrom_辅助函数从头文件中获取令牌。

<!-- If you used the same solution, refactor taking the token to a [middleware](/en/part3/node_js_and_express#middleware). The middleware should take the token from the <i>Authorization</i> header and place it to the <i>token</i> field of the <i>request</i> object.-->
 如果你使用了相同的解决方案，请将获取令牌重构为一个[中间件](/en/part3/node_js_and_express#middleware)。中间件应该从<i>Authorization</i>头中获取令牌，并将其放到<i>request</i>对象的<i>token</i>字段中。

<!-- In other words, if you register this middleware in the <i>app.js</i> file before all routes-->
换句话说，如果你在所有路由之前的<i>app.js</i>文件中注册了这个中间件

```js
app.use(middleware.tokenExtractor)
```

<!-- routes can access the token with _request.token_:-->
路由可以用_request.token_来访问令牌。
```js
blogsRouter.post('/', async (request, response) => {
  // ..
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  // ..
})
```

<!-- Remember that a normal [middleware](/en/part3/node_js_and_express#middleware) is a function with three parameters, that at the end calls the last parameter <i>next</i> in order to move the control to next middleware:-->
 记住，一个正常的[中间件](/en/part3/node_js_and_express#middleware)是一个有三个参数的函数，在最后调用最后一个参数<i>next</i>，以便将控制权转移到下一个中间件。

```js
const tokenExtractor = (request, response, next) => {
  // code that extracts the token

  next()
}
```

#### 4.21*: bloglist expansion, step9

<!-- Change the delete blog operation so that a blog can be deleted only by the user who added the blog. Therefore, deleting a blog is possible only if the token sent with the request is the same as that of the blog's creator.-->
 改变删除博客的操作，使一个博客只能由添加该博客的用户删除。因此，只有当与请求一起发送的令牌与博客创建者的令牌相同时，删除博客才有可能。

<!-- If deleting a blog is attempted without a token or by a wrong user, the operation should return a suitable status code.-->
 如果尝试删除一个博客，但没有令牌或由错误的用户删除，该操作应返回一个合适的状态代码。

<!-- Note that if you fetch a blog from the database,-->
 注意，如果你从数据库中获取一个博客。

```js
const blog = await Blog.findById(...)
```

<!-- the field <i>blog.user</i> does not contain a string, but an Object. So if you want to compare the id of the object fetched from the database and a string id, normal comparison operation does not work. The id fetched from the database must be parsed into a string first.-->
字段<i>blog.user</i>并不包含一个字符串，而是一个对象。因此，如果你想比较从数据库中获取的对象的id和一个字符串id，正常的比较操作是不起作用的。从数据库中获取的id必须先被解析成一个字符串。

```js
if ( blog.user.toString() === userid.toString() ) ...
```

#### 4.22*:  bloglist expansion, step10

<!-- Both the new blog creation and blog deletion need to find out the identity of the user who is doing the operation. The middleware _tokenExtractor_ that we did in exercise 4.20 helps but still both the handlers of <i>post</i> and <i>delete</i> operations need to find out who is the user holding a specific token.-->
 新博客的创建和博客的删除都需要找出进行操作的用户的身份。我们在练习4.20中所做的中间件_tokenExtractor_有帮助，但<i>post</i>和<i>delete</i>操作的处理程序仍然需要找出谁是持有特定令牌的用户。

<!-- Now create a new middleware _userExtractor_, that finds out the user and sets it to the request object. When you register the middleware in <i>app.js</i>-->
 现在创建一个新的中间件_userExtractor_，它可以找出用户并将其设置为请求对象。当你在<i>app.js</i>中注册这个中间件时

```js
app.use(middleware.userExtractor)
```

<!-- the user will be set in the field _request.user_:-->
 用户将被设置在_request.user_字段中。

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

<!-- Note that it is possible to register a middleware only for a specific set of routes. So instead of using _userExtractor_ with all the routes-->
 注意，有可能只为一组特定的路由注册一个中间件。因此，与其在所有的路由中使用_userExtractor_，不如在所有的路由中使用_userExtractor_。

```js
// use the middleware in all routes
app.use(userExtractor) // highlight-line

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
```

<!-- we could register it to be only executed with path <i>/api/blogs</i> routes:-->
 我们可以把它注册为只在<i>/api/blogs</i>路径下执行。

```js
// use the middleware only in /api/blogs routes
app.use('/api/blogs', userExtractor, blogsRouter) // highlight-line
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
```

<!-- As can be seen, this happens by chaining multiple middlewares as the parameter of function  <i>use</i>. It would also be possible to register a middleware only for a specific operation:-->
 正如我们所看到的，这可以通过连锁多个中间件作为函数<i>use</i>的参数来实现。也可以只为一个特定的操作注册一个中间件。

```js
router.post('/', userExtractor, async (request, response) => {
  // ...
}
```

#### 4.23*:  bloglist expansion, step11

<!-- After adding token based authentication the tests for adding a new blog broke down. Fix the tests. Also write a new test to ensure adding a blog fails with the proper status code <i>401 Unauthorized</i> if a token is not provided.-->
 在添加了基于令牌的认证后，添加一个新博客的测试出现了问题。修复测试。同时写一个新的测试，以确保在没有提供令牌的情况下，添加一个博客会以适当的状态代码<i>401 Unauthorized</i>失败。

<!-- [This](https://github.com/visionmedia/supertest/issues/398) is most likely useful when doing the fix.-->
 [这个](https://github.com/visionmedia/supertest/issues/398)在做修复时很可能有用。

<!-- This is the last exercise for this part of the course and it's time to push your code to GitHub and mark all of your finished exercises to the [exercise submission system](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).-->
 这是这部分课程的最后一个练习，是时候把你的代码推送到GitHub，并把你所有完成的练习标记到[练习提交系统](https://studies.cs.helsinki.fi/stats/courses/fullstackopen)。

<!---
<!-- note left of user-->
用户左侧的注释
<!--   user fills in login form with-->
用户填写登录表，填写内容为
<!--   username and password-->
用户名和密码
<!-- end note-->
结束说明
<!-- user -> browser: login button pressed-->
用户->浏览器：按了登录按钮

<!-- browser -> backend: HTTP POST /api/login { username, password }-->
浏览器 -> 后台。HTTP POST /api/login { username, password }。
<!-- note left of backend-->
后端左侧注释
<!--   backend generates TOKEN that identifies user-->
后端生成识别用户的TOKEN
<!-- end note-->
结束注释
<!-- backend -> browser: TOKEN returned as message body-->
后端->浏览器。TOKEN作为信息主体返回
<!-- note left of browser-->
浏览器左边的注释
<!--   browser saves TOKEN-->
浏览器保存TOKEN
<!-- end note-->
结束说明
<!-- note left of user-->
用户左边的注释
<!--   user creates a note-->
用户创建一个注释
<!-- end note-->
结束备注
<!-- user -> browser: create note button pressed-->
用户->浏览器：按了创建笔记的按钮
<!-- browser -> backend: HTTP POST /api/notes { content } TOKEN in header-->
 浏览器 -> 后台。HTTP POST /api/notes { content }TOKEN在标题中
<!-- note left of backend-->
后端左侧的注释
<!--   backend identifies userfrom the TOKEN-->
后端从TOKEN中识别用户
<!-- end note-->
结束注释

<!-- backend -> browser: 201 created-->
后端->浏览器。201创建

<!-- user -> user:-->
用户->用户。
 -->

</div>
