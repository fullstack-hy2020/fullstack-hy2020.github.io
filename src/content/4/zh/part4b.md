---
mainImage: ../../../images/part-4.svg
part: 4
letter: b
lang: zh
---

<div class="content">


<!-- We will now start writing tests for the backend. Since the backend does not contain any complicated logic, it doesn't make sense to write [unit tests](https://en.wikipedia.org/wiki/Unit_testing) for it. The only potential thing we could unit test is the _toJSON_ method that is used for formatting notes. -->
我们现在要开始为后端写测试了。由于我们的后端并没有包含任何复杂逻辑，为它编写[单元测试](https://en.wikipedia.org/wiki/Unit_testing)并没有什么意义。唯一一个我们有必要写写单元测试的就是为了格式化 note 的 _toJSON_ 方法了。

<!-- In some situations, it can be beneficial to implement some of the backend tests by mocking the database instead of using a real database. One library that could be used for this is [mongo-mock](https://github.com/williamkapke/mongo-mock). -->
在某些情况下，我们通过模拟数据库数据而非使用真正的数据库来进行后端测试。有一个可以模拟 mongo 的库[mongo-mock](https://github.com/williamkapke/mongo-mock)可以帮助我们达到这个目的。

<!-- Since our application's backend is still relatively simple, we will make the decision to test the entire application through its REST API, so that the database is also included. This kind of testing where multiple components of the system are being tested as a group, is called [integration testing](https://en.wikipedia.org/wiki/Integration_testing). -->
由于我们的后端应用相对简单，我们将会通过它的 REST API 来测试整个应用，当然数据库也包含在内。这种将系统的多个组件联合进行测试的方法称为集成测试。

### Test environment 
【测试环境】
<!-- In one of the previous chapters of the course material, we mentioned that when your backend server is running in Heroku, it is in <i>production</i> mode. -->
在课程教材的前几章中，我们提到当你的后端服务器在 Heroku 运行时，它处于 <i>production</i> 模式。

<!-- The convention in Node is to define the execution mode of the application with the <i>NODE\_ENV</i> environment variable. In our current application, we only load the environment variables defined in the <i>.env</i> file if the application is <i>not</i> in production mode. -->
Node 中的约定是用 <i>NODE\_ENV</i> 环境变量定义应用的执行模式。 在我们当前的应用中，如果应用不是在生产模式下，我们只加载 <i>.env</i>  中定义的环境变量。 

<!-- It is common practice to define separate modes for development and testing. -->
通常的做法是为开发和测试定义不同的模式。

<!-- Next, let's change the scripts in our <i>package.json</i> so that when tests are run, <i>NODE\_ENV</i> gets the value <i>test</i>: -->
接下来，让我们修改<i>package.json</i> 中的脚本，以便在运行测试时，<i>NODE\_ENV</i> 获得值<i>test</i>:

```json
{
  // ...
  "scripts": {
    "start": "NODE_ENV=production node index.js",// highlight-line
    "dev": "NODE_ENV=development nodemon index.js",// highlight-line
    "build:ui": "rm -rf build && cd ../../../2/luento/notes && npm run build && cp -r build ../../../3/luento/notes-backend",
    "deploy": "git push heroku master",
    "deploy:full": "npm run build:ui && git add . && git commit -m uibuild && git push && npm run deploy",
    "logs:prod": "heroku logs --tail",
    "lint": "eslint .",
    "test": "NODE_ENV=test jest --verbose --runInBand"// highlight-line
  },
  // ...
}
```

<!-- We also added the [runInBand](https://jestjs.io/docs/en/cli.html#runinband) option to the npm script that executes the tests. This option will prevent Jest from running tests in parallel; we will discuss its significance once our tests start using the database. -->
我们还在执行测试的 npm 脚本中添加了[runInBand](https://jestjs.io/docs/en/cli.html#--runinband)选项。 这个选项将防止 Jest 并行运行测试; 一旦我们的测试开始使用数据库，我们将讨论它的重要性。

<!-- We specified the mode of the application to be <i>development</i> in the _npm run dev_ script that uses nodemon. We also specified that the default _npm start_ command will define the mode as <i>production</i>. -->
我们在使用 nodemon 的  _npm run dev_ 脚本中指定了应用的模式为 <i>development</i> 。 我们还指定了默认的 npm start 命令将模式定义为<i>production</i>。

<!-- There is a slight issue in the way that we have specified the mode of the application in our scripts: it will not work on Windows. We can correct this by installing the [cross-env](https://www.npmjs.com/package/cross-env) package with the command: -->
我们在脚本中指定应用模式的方式有一个小问题: 它不能在 Windows 上工作。 我们可以通过如下命令安装[cross-env](https://www.npmjs.com/package/cross-env)作为一个开发依赖包，来纠正这个问题:

```bash
npm install --save-dev cross-env
```

<!-- We can then achieve cross-platform compatibility by using the cross-env library in our npm scripts defined in <i>package.json</i>: -->
然后，我们可以通过在<i>package.json</i> 中定义的 npm 脚本中使用跨平台兼容性的 cross-env 库来实现:

```json
{
  // ...
  "scripts": {
    "start": "cross-env NODE_ENV=production node index.js",
    "dev": "cross-env NODE_ENV=development nodemon index.js",
    // ...
    "test": "cross-env NODE_ENV=test jest --verbose --runInBand",
  },
  // ...
}
```

<!-- Now we can modify the way that our application runs in different modes. As an example of this, we could define the application to use a separate test database when it is running tests. -->
现在我们可以修改应用在不同模式下运行的方式。 作为示例，我们可以定义应用在运行测试时使用单独的测试数据库。

<!-- We can create our separate test database in Mongo DB Atlas. This is not an optimal solution in situations where there are many people developing the same application. Test execution in particular typically requires that a single database instance is not used by tests that are running concurrently. -->
我们可以在 Mongo DB Atlas 中创建单独的测试数据库。 在多人开发同一个应用的情况下，这不是一个最佳解决方案。 特别是测试执行时，通常要求并发运行的测试，因此不能使用单个数据库实例。

<!-- It would be better to run our tests using a database that is installed and running in the developer's local machine. The optimal solution would be to have every test execution use its own separate database. This is "relatively simple" to achieve by [running Mongo in-memory](https://docs.mongodb.com/manual/core/inmemory/) or by using [Docker](https://www.docker.com) containers. We will not complicate things and will instead continue to use the MongoDB Atlas database. -->
最好使用安装并跑在开发人员本地机器上的数据库来运行我们的测试。 最佳的解决方案是让每个测试用例执行时使用自己独立的数据库。 通过[运行内存中的 Mongo](https://docs.mongodb.com/manual/core/inmemory/)或使用[Docker](https://www.Docker.com)容器来实现这个“相对简单”。 我们不会把事情复杂化，而是继续使用 MongoDB Atlas 数据库。

<!-- Let's make some changes to the module that defines the application's configuration: -->
让我们对定义应用配置的模块进行一些修改:

```js
require('dotenv').config()

let PORT = process.env.PORT
let MONGODB_URI = process.env.MONGODB_URI

// highlight-start
if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.TEST_MONGODB_URI
}
// highlight-end

module.exports = {
  MONGODB_URI,
  PORT
}
```

<!-- The <i>.env</i> file has <i>separate variables</i> for the database addresses of the development and test databases: -->
在 <i>.env</i> 文件中，为开发和测试数据库的数据库地址分别设置变量:

```bash
MONGODB_URI=mongodb+srv://fullstack:secred@cluster0-ostce.mongodb.net/note-app?retryWrites=true
PORT=3001

// highlight-start
TEST_MONGODB_URI=mongodb+srv://fullstack:secret@cluster0-ostce.mongodb.net/note-app-test?retryWrites=true
// highlight-end
```

<!-- The _config_ module that we have implemented slightly resembles the [node-config](https://github.com/lorenwest/node-config) package. Writing our own implementation is justified since our application is simple, and also because it teaches us valuable lessons. -->
我们实现的配置模块有点类似于[node-config](https://github.com/lorenwest/node-config)包。 但编写我们自己的实现是合理的，因为我们的应用很简单，并且因为它能教会我们宝贵的经验教训。

<!-- These are the only changes we need to make to our application's code. -->
这些是我们需要对应用代码进行的惟一更改。

<!-- You can find the code for our current application in its entirety in the <i>part4-2</i> branch of [this github repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-2). -->
您可以在[this github repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-2)的<i>part4-2</i> 分支中找到我们当前应用的全部代码。


### supertest
<!-- Let's use the [supertest](https://github.com/visionmedia/supertest) package to help us write our tests for testing the API. -->
让我们使用[supertest](https://github.com/visionmedia/supertest)包来帮助我们编写 API 的测试。

<!-- We will install the package as a development dependency: -->
我们将这个软件包作为一个开发依赖项安装:

```bash
npm install --save-dev supertest
```

<!-- Let's write our first test in the <i>tests/note_api.test.js</i> file: -->
让我们在<i>tests/note_api.test.js</i>文件中编写第一个测试:

```js
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

afterAll(() => {
  mongoose.connection.close()
})
```

<!-- The test imports the Express application from the <i>app.js</i> module and wraps it with the <i>supertest</i> function into a so-called [superagent](https://github.com/visionmedia/superagent) object. This object is assigned to the <i>api</i> variable and tests can use it for making HTTP requests to the backend. -->
测试从<i>app.js</i> 模块导入 Express 应用，并用<i>supertest</i> 函数将其包装成一个所谓的[superagent](https://github.com/visionmedia/superagent)对象。 这个对象被分配给<i>api</i> 变量，测试可以使用它向后端发出 HTTP 请求。

<!-- Our test makes an HTTP GET request to the <i>api/notes</i> url and verifies that the request is responded to with the status code 200. The test also verifies that the <i>Content-Type</i> header is set to <i>application/json</i>, indicating that the data is in the desired format. (If you're not familiar with the RegEx syntax of `/application\/json/`, you can learn more [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions).-->
我们的测试向<i>api/notes</i> url 发出 HTTP GET 请求，并验证请求是否用状态码200响应。 测试还验证<i>Content-Type</i> 头是否设置为 <i>application/json</i>，表明数据是所需的格式。(如果你不熟悉正则语法 `/application\/json/` ， 你可以在[这里](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) 进行学习)

<!-- The test contains some details that we will explore [a bit later on](/zh/part4/测试后端应用#async-await). The arrow function that defines the test is preceded by the <i>async</i> keyword and the method call for the <i>api</i> object is preceded by the <i>await</i> keyword. We will write a few tests and then take a closer look at this async/await magic. Do not concern yourself with them for now, just be assured that the example tests work correctly. The async/await syntax is related to the fact that making a request to the API is an <i>asynchronous</i> operation. The [Async/await syntax](https://facebook.github.io/jest/docs/en/asynchronous.html) can be used for writing asynchronous code with the appearance of synchronous code. -->
该测试包含一些细节，我们将在[稍后讨论](/zh/part4/测试后端应用#async-await)。 定义测试的箭头函数的前面是<i>async</i> 关键字，对<i>api</i> 对象的方法调用的前面是<i>await</i> 关键字。 我们将编写一些测试，然后仔细研究这个 async/await 黑魔法。 现在不要关心它们，只要确保示例测试正确工作就可以了。 async/await 语法与向 API 发出的请求是<i>异步</i> 操作这一事实相关。 [Async/await 语法](https://facebook.github.io/jest/docs/en/asynchronous.html)可以用于编写具有同步代码外观的异步代码 。

<!-- Once all the tests (there is currently only one) have finished running we have to close the database connection used by Mongoose. This can be easily achieved with the [afterAll](https://facebook.github.io/jest/docs/en/api.html#afterallfn-timeout) method: -->
一旦所有的测试(目前只有一个)已经完成运行，我们必须使用Mongoose关闭数据库连接的。这可以很容易地通过[afterAll](https://facebook.github.io/jest/docs/en/api.html#afterallfn-timeout)方法来实现:

```js
afterAll(() => {
  mongoose.connection.close()
})
```

<!-- When running your tests you may run across the following console warning: -->
在运行测试时，您可能会遇到如下控制台警告:

![](../../images/4/8.png)



<!-- If this occurs, let's follow the [instructions](https://mongoosejs.com/docs/jest.html) and add a <i>jest.config.js</i> file at the root of the project with the following content: -->
如果发生这种情况，让我们按照[指示](https://mongoosejs.com/docs/jest.html) ，在项目的根目录添加一个<i>jest.config.js</i> 文件，内容如下:

```js
module.exports = {
  testEnvironment: 'node'
}
```

<!-- One tiny but important detail: at the [beginning](/zh/part4/从后端结构到测试入门#project-structure) of this part we extracted the Express application into the <i>app.js</i> file, and the role of the <i>index.js</i> file was changed to launch the application at the specified port with Node's built-in <i>http</i> object: -->
一个很小但很重要的细节是: 在这一章节的 [开始](/zh/part4/从后端结构到测试入门#project-structure) ，我们将 Express 应用提取到<i>app.js</i> 文件中，并且改变了<i>index.js</i> 文件的角色，使用 Node 的内置<i>http</i> 对象在指定端口启动应用:

```js
const app = require('./app') // the actual Express app
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')

const server = http.createServer(app)

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
```

<!-- The tests only use the express application defined in the <i>app.js</i> file: -->
测试只使用<i>app.js</i> 文件中定义的express应用:

```js
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app') // highlight-line

const api = supertest(app) // highlight-line

// ...
```

<!-- The documentation for supertest says the following: -->
supertest的文档说明如下: 

> <i>if the server is not already listening for connections then it is bound to an ephemeral port for you so there is no need to keep track of ports.</i><br>
如果服务器还没有监听连接，那么它就会绑定到一个临时端口，因此没有必要跟踪端口。

<!-- In other words, supertest takes care that the application being tested is started at the port that it uses internally. -->
换句话说，supertest 负责在内部使用端口启动被测试的应用。

<!-- Let's write a few more tests: -->
让我们再写一些测试:

```js
test('there are two notes', async () => {
  const response = await api.get('/api/notes')

  expect(response.body).toHaveLength(2)
})

test('the first note is about HTTP methods', async () => {
  const response = await api.get('/api/notes')

  expect(response.body[0].content).toBe('HTML is easy')
})
```

<!-- Both tests store the response of the request to the _response_ variable, and unlike the previous test that used the methods provided by _supertest_ for verifying the status code and headers, this time we are inspecting the response data stored in <i>response.body</i> property. Our tests verify the format and content of the response data with the [expect](https://facebook.github.io/jest/docs/en/expect.html#content) method of Jest. -->
这两个测试都存储了请求对响应变量的响应，并且与前面的测试不同，前面的测试使用 supertest 提供的方法来验证状态代码和报头，这次我们检查存储在 <i>response.body</i> 属性中的响应数据。 我们的测试使用 Jest 的[expect](https://facebook.github.io/Jest/docs/en/expect.html#content)方法验证响应数据的格式和内容。

<!-- The benefit of using the async/await syntax is starting to become evident. Normally we would have to use callback functions to access the data returned by promises, but with the new syntax things are a lot more comfortable: -->
使用async/await 语法的好处开始变得明显。 通常情况下，我们必须使用回调函数来访问由 promises 返回的数据，但是使用新的语法会更加方便:

```js
const response = await api.get('/api/notes')

// execution gets here only after the HTTP request is complete
// the result of HTTP request is saved in variable response
expect(response.body).toHaveLength(2)
```



<!-- The middleware that outputs information about the HTTP requests is obstructing the test execution output. Let us modify the logger so that it does not print to console in test mode: -->
输出 HTTP 请求信息的中间件阻碍了测试执行输出。 让我们修改日志记录器，使其不会在测试模式下打印到控制台:

```js
const info = (...params) => {
  // highlight-start
  if (process.env.NODE_ENV !== 'test') { 
    console.log(...params)
  }
  // highlight-end
}

const error = (...params) => {
  console.error(...params)
}

module.exports = {
  info, error
}
```

### Initializing the database before tests
【在测试前初始化数据库】
<!-- Testing appears to be easy and our tests are currently passing. However, our tests are bad as they are dependent on the state of the database (that happens to be correct in my test database). In order to make our tests more robust, we have to reset the database and generate the needed test data in a controlled manner before we run the tests. -->
测试看起来很简单，我们的测试目前正在通过。 但是，我们的测试很糟糕，因为它们依赖于数据库的状态(这在我的测试数据库中恰好是正确的)。 为了使我们的测试更加健壮，在运行测试之前，我们必须重置数据库并以可控的方式生成所需的测试数据。

<!-- Our tests are already using the [afterAll](https://facebook.github.io/jest/docs/en/api.html#afterallfn-timeout) function of Jest to close the connection to the database after the tests are finished executing. Jest offers many other [functions](https://facebook.github.io/jest/docs/en/setup-teardown.html#content) that can be used for executing operations once before any test is run, or every time before a test is run. -->
我们的测试已经使用 Jest 的[afterAll](https://facebook.github.io/Jest/docs/en/api.html#afterallfn-timeout)函数在测试执行完成后关闭到数据库的连接。 Jest 提供了许多其他的[函数](https://facebook.github.io/Jest/docs/en/setup-teardown.html#content) ，可以在运行任何测试之前或每次运行测试之前执行一次操作。

<!-- Let's initialize the database <i>before every test</i> with the [beforeEach](https://jestjs.io/docs/en/api.html#beforeeachfn-timeout) function: -->
让我们在<i>每个  test</i> 之前使用[beforeEach](https://jestjs.io/docs/en/api.html#beforeeachfn-timeout)函数初始化数据库 i:

```js
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
// highlight-start
const Note = require('../models/note')

const initialNotes = [
  {
    content: 'HTML is easy',
    date: new Date(),
    important: false,
  },
  {
    content: 'Browser can execute only Javascript',
    date: new Date(),
    important: true,
  },
]

beforeEach(async () => {
  await Note.deleteMany({})

  let noteObject = new Note(initialNotes[0])
  await noteObject.save()

  noteObject = new Note(initialNotes[1])
  await noteObject.save()
})
// highlight-end
// ...
```

<!-- The database is cleared out at the beginning, and after that we save the two notes stored in the _initialNotes_ array to the database. Doing this, we ensure that the database is in the same state before every test is run. -->
在开始时清除数据库，然后将存储在 initialNotes 数组中的两个便笺保存到数据库中。 这样做，我们可以确保在运行每个测试之前，数据库处于相同的状态。

<!-- Let's also make the following changes to the last two tests: -->
让我们对最后两个测试进行如下修改:

```js
test('all notes are returned', async () => {
  const response = await api.get('/api/notes')

  expect(response.body).toHaveLength(initialNotes.length) // highlight-line
})

test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes')

// highlight-start
  const contents = response.body.map(r => r.content) 

  expect(contents).toContain(
    'Browser can execute only Javascript' 
  )
// highlight-end
})
```

<!-- Pay special attention to the expect in the latter test. The <code>response.body.map(r => r.content)</code> command is used to create an array containing the content of every note returned by the API. The [toContain](https://facebook.github.io/jest/docs/en/expect.html#tocontainitem) method is used for checking that the note given to it as a parameter is in the list of notes returned by the API. -->
在后一个测试中要特别注意expect。 代码<code>response.body.map(r => r.content)</code> 命令用于创建一个数组，该数组包含 API 返回的每个便笺的内容。 方法用于检查作为参数传给它的便笺是否在 API 返回的便笺列表中。

### Running tests one by one
【一个接一个的测试】
<!-- The _npm test_ command executes all of the tests of the application. When we are writing tests, it is usually wise to only execute one or two tests. Jest offers a few different ways of accomplishing this, one of which is the [only](https://jestjs.io/docs/en/api#testonlyname-fn-timeout) method. If tests are written across many files, this method is not great. -->
_npm test_ 命令执行应用的所有测试。 在编写测试时，通常明智的做法是一次只执行一个或两个测试。 Jest 提供了几种不同的方法来实现这一点，其中一种就是  [only](https://jestjs.io/docs/en/api#testonlyname-fn-timeout) 方法。 如果测试是跨多个文件编写的，那么这种方法不是很好。

<!-- A better option is to specify the tests that need to be run as parameter of the  <i>npm test</i> command. -->
一个更好的选择是指定需要运行的测试作为<i>npm test</i> 命令的参数。

<!-- The following command only runs the tests found in the <i>tests/note_api.test.js</i> file: -->
下面的命令只运行 <i>tests/note_api.test.js</i>文件中的测试:

```js
npm test -- tests/note_api.test.js
```

<!-- The <i>-t</i> option can be used for running tests with a specific name: -->
 <i>-t</i> 选项可用于运行具有特定名称的测试:

```js
npm test -- -t 'a specific note is within the returned notes'
```

<!-- The provided parameter can refer to the name of the test or the describe block. The parameter can also contain just a part of the name. The following command will run all of the tests that contain <i>notes</i> in their name: -->
提供的参数可以引用测试或描述块的名称。 参数也可以只包含名称的一部分。 下面的命令将运行名称中包含<i>notes</i> 的所有测试:

```js
npm test -- -t 'notes'
```



<!-- **NB**: When running a single test, the mongoose connection might stay open if no tests using the connection are run.  -->
**注意**: 当运行单个测试时，如果运行的测试没有使用该连接，则 mongoose 连接可能保持打开状态。
<!-- The problem might be due to the fact that supertest primes the connection, but jest does not run the afterAll portion of the code.  -->
这个问题可能是因为 supertest 为连接优先，但是 jest 并不运行代码的 afterAll 部分。

### async/await

<!-- Before we write more tests let's take a look at the _async_ and _await_ keywords. -->
在我们写更多测试前，让我们来认真看一下 _async_ 和 _await_ 关键字。

<!-- The async/await syntax that was introduced in ES7 makes it possible to use <i>asynchronous functions that return a promise</i> in a way that makes the code look synchronous. -->
async/await 语法是在 ES7 引入 JS 的，其目的是使用异步调用函数来返回一个 promise，但使代码看起来像是同步调用。 

<!-- As an example, the fetching of notes from the database with promises looks like this: -->
举个例子，我们从数据库中利用 promise 返回 note 的代码如下所示：

```js
Note.find({}).then(notes => {
  console.log('operation returned the following notes', notes)
})
```

<!-- The _Note.find()_ method returns a promise and we can access the result of the operation by registering a callback function with the _then_ method. -->
_Note.find()_ 方法会返回一个 promise， 我们可以通过使用 _then_ 来注册一个回调函数，来访问上一个操作的结果。

<!-- All of the code we want to execute once the operation finishes is written in the callback function. If we wanted to make several asynchronous function calls in sequence, the situation would soon become painful. The asynchronous calls would have to be made in the callback. This would likely lead to complicated code and could potentially give birth to a so-called [callback hell](http://callbackhell.com/). -->
原来，我们所有想在操作完成后处理的逻辑都可以写到回调函数中。但如果我们想要创建多个异步函数，但想要顺序调用，这个过程就会比较痛苦。因为我们必须要在回调函数中写异步调用。这不但会导致代码变得更加复杂，而且可能产生所谓的[回调地狱](http://callbackhell.com/)

<!-- By [chaining promises](https://javascript.info/promise-chaining) we could keep the situation somewhat under control, and avoid callback hell by creating a fairly clean chain of _then_ method calls. We have seen a few of these during the course. To illustrate this, you can view an artificial example of a function that fetches all notes and then deletes the first one: -->
通过[链式 Promise](https://javascript.info/promise-chaining) 可以一定程度上让这种熵增变得可控。并且通过 _then_ 方法的链式调用来避免回调地狱。我们在这门课中已经见到了一些这种场景。为了说明这一点，你可以看如下例子，利用函数来获取所有的 note 并删除第一个：

```js
Note.find({})
  .then(notes => {
    return notes[0].remove()
  })
  .then(response => {
    console.log('the first note is removed')
    // more code here
  })
```

<!-- The then-chain is alright, but we can do better. The [generator functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) introduced in ES6 provided a [clever way](https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/async-performance/ch4.md#iterating-generators-asynchronously) of writing asynchronous code in a way that "looks synchronous". The syntax is a bit clunky and not widely used. -->
这种链式的 then 的确不错，但我们可以做得更好。ES6 引入的[生成器函数](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) 提供了一种更[聪明的方式](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/async%20%26%20performance/ch4.md#iterating-generators-asynchronously) 来写异步代码，使这种代码看起来像同步的。这种语法有点笨拙，因此并没有被广泛使用。

<!-- The _async_ and _await_ keywords introduced in ES7 bring the same functionality as the generators, but in an understandable and syntactically cleaner way to the hands of all citizens of the JavaScript world. -->
ES7 引入的 _async_ 和 _await_ 关键字带来了和生成器相同的功能，但是以一种更容易理解以及看起来更像同步的方式来展现的，使得所有的 Javascript 使用者都更容易理解。 

<!-- We could fetch all of the notes in the database by utilizing the [await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) operator like this: -->
我们使用[await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)操作符来获取所有的 note，代码如下：

```js
const notes = await Note.find({})

console.log('operation returned the following notes', notes)
```

<!-- The code looks exactly like synchronous code. The execution of code pauses at <em>const notes = await Note.find({})</em> and waits until the related promise is <i>fulfilled</i>, and then continues its execution to the next line. When the execution continues, the result of the operation that returned a promise is assigned to the _notes_ variable. -->
代码看起来十分像同步函数。代码的执行会在 <em>const notes = await Note.find({})</em> 处暂停等待，直到相关的 promise 都满足了，然后代码会继续执行到下一行。当继续执行，所有 promise 返回的结果都指向了 _notes_ 这个变量。

<!-- The slightly complicated example presented above could be implemented by using await like this: -->
上面提到的稍微复杂一点的例子，用 await 实现的代码如下所示。

```js
const notes = await Note.find({})
const response = await notes[0].remove()

console.log('the first note is removed')
```

<!-- Thanks to the new syntax, the code is a lot simpler than the previous then-chain. -->
受益于这种新语法，代码比之前的 then 链式调用看起来简单多了。

<!-- There are a few important details to pay attention to when using async/await syntax. In order to use the await operator with asynchronous operations, they have to return a promise. This is not a problem as such, as regular asynchronous functions using callbacks are easy to wrap around promises. -->
在使用 async/await 语法时，有一些重要的细节值得我们注意。为了使用 await 操作符来执行异步操作，它的返回必须是一个 promise。这本身并不是一个问题，因为以前我们使用的回调函数也是打包了一个返回 promise 的异步函数。

<!-- The await keyword can't be used just anywhere in JavaScript code. Using await is possible only inside of an [async](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) function. -->
在 Javascript 中，await 关键字不能随意使用。而只能在[async](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)函数中使用。

<!-- This means that in order for the previous examples to work, they have to be using async functions. Notice the first line in the arrow function definition: -->
这也就是说为了保证之前那个例子能正常运行，就必须使用 async 来声明整个函数。注意第一行箭头函数的定义：

```js
const main = async () => { // highlight-line
  const notes = await Note.find({})
  console.log('operation returned the following notes', notes)

  const response = await notes[0].remove()
  console.log('the first note is removed')
}

main() // highlight-line
```

<!-- The code declares that the function assigned to _main_ is asynchronous. After this the code calls the function with <code>main()</code>. -->
代码声明了 _main_ 是一个异步函数，然后才进行 <code>main()</code>的调用。

### async/await in the backend
【后端中的 async/await】

<!-- Let's change the backend to async and await. As all of the asynchronous operations are currently done inside of a function, it is enough to change the route handler functions into async functions. -->
下面我们来将后端代码改为 async 和 await 的方式。 由于当前所有的异步操作都是在函数那完成的，因此只需要将 route handler 函数更改声明为异步的即可。

<!-- The route for fetching all notes gets changed to the following: -->
获取所有 note 的路由函数更改如下：

```js
notesRouter.get('/', async (request, response) => { 
  const notes = await Note.find({})
  response.json(notes)
})
```

<!-- We can verify that our refactoring was successful by testing the endpoint through the browser and by running the tests that we wrote earlier. -->
我们可以通过在浏览器中执行端测试和运行我们之前写的测试代码来验证我们的重构是否成功。

<!-- You can find the code for our current application in its entirety in the <i>part4-3</i> branch of [this Github repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-3). -->
您可以在[this Github repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-3)的<i>part4-3</i> 分支中找到我们当前应用的全部代码

### More tests and refactoring the backend 
【更多的测试和后端重构】
<!-- When code gets refactored, there is always the risk of [regression](https://en.wikipedia.org/wiki/Regression_testing), meaning that existing functionality may break. Let's refactor the remaining operations by first writing a test for each route of the API. -->
当代码被重构时，总是有[regression](https://en.wikipedia.org/wiki/Regression_testing)的风险，这意味着现有的功能可能会中断。 让我们通过为 API 的每个路由编写测试来重构剩余的操作。

<!-- Let's start with the operation for adding a new note. Let's write a test that adds a new note and verifies that the amount of notes returned by the API increases, and that the newly added note is in the list. -->
让我们从添加新便笺的操作开始。 让我们编写一个测试，添加一个新的便笺，并验证 API 返回的便笺数量是否增加，以及新添加的便笺是否在列表中。

```js
test('a valid note can be added', async () => {
  const newNote = {
    content: 'async/await simplifies making async calls',
    important: true,
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/notes')

  const contents = response.body.map(r => r.content)

  expect(response.body).toHaveLength(initialNotes.length + 1)
  expect(contents).toContain(
    'async/await simplifies making async calls'
  )
})
```

<!-- The test passes just like we hoped and expected it to. -->
这个测试正如我们所希望和期望的那样通过了。

<!-- Let's also write a test that verifies that a note without content will not be saved into the database. -->
我们还要编写一个测试，验证没有内容的便笺不会保存到数据库中。

```js
test('note without content is not added', async () => {
  const newNote = {
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(400)

  const response = await api.get('/api/notes')

  expect(response.body).toHaveLength(initialNotes.length)
})
```

<!-- Both tests check the state stored in the database after the saving operation, by fetching all the notes of the application.   -->
这两个测试都通过获取应用的所有便笺来检查保存操作之后存储在数据库中的状态。

```js
const response = await api.get('/api/notes')
```

<!-- The same verification steps will repeat in other tests later on, and it is a good idea to extract these steps into helper functions. Let's add the function into a new file called <i>tests/test_helper.js</i> that is in the same directory as the test file. -->
相同的测试步骤将在稍后的其他测试中重复，最好将这些步骤提取到 辅助函数中。 让我们将该函数添加到一个名为 <i>tests/test_helper.js</i> 的新文件中，该文件与测试文件位于同一目录中。

```js
const Note = require('../models/note')

const initialNotes = [
  {
    content: 'HTML is easy',
    date: new Date(),
    important: false
  },
  {
    content: 'Browser can execute only Javascript',
    date: new Date(),
    important: true
  }
]

const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon',date: new Date() })
  await note.save()
  await note.remove()

  return note._id.toString()
}

const notesInDb = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}

module.exports = {
  initialNotes, nonExistingId, notesInDb
}
```

<!-- The module defines the _notesInDb_ function that can be used for checking the notes stored in the database. The _initialNotes_ array containing the initial database state is also in the module. We also define the _nonExistingId_ function ahead of time, that can be used for creating a database object ID that does not belong to any note object in the database. -->
该模块定义了_notesInDb_函数，该函数可用于检查数据库中存储的便笺。 包含初始数据库状态的 initialNotes 数组也在模块中。 我们还提前定义了 nonExistingId 函数，该函数可用于创建不属于数据库中任何便笺对象的数据库对象 ID。

<!-- Our tests can now use helper module and be changed like this: -->
我们的测试现在可以使用 helper 模块，并且可以像下面这样修改:

```js
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper') // highlight-line
const app = require('../app')
const api = supertest(app)

const Note = require('../models/note')

beforeEach(async () => {
  await Note.deleteMany({})

  let noteObject = new Note(helper.initialNotes[0]) // highlight-line
  await noteObject.save()

  noteObject = new Note(helper.initialNotes[1]) // highlight-line
  await noteObject.save()
})

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all notes are returned', async () => {
  const response = await api.get('/api/notes')

  expect(response.body).toHaveLength(helper.initialNotes.length) // highlight-line
})

test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes')

  const contents = response.body.map(r => r.content)
  expect(contents).toContain(
    'Browser can execute only Javascript'
  )
})

test('a valid note can be added ', async () => {
  const newNote = {
    content: 'async/await simplifies making async calls',
    important: true,
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const notesAtEnd = await helper.notesInDb() // highlight-line
  expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1) // highlight-line

  const contents = notesAtEnd.map(n => n.content) // highlight-line
  expect(contents).toContain(
    'async/await simplifies making async calls'
  )
})

test('note without content is not added', async () => {
  const newNote = {
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(400)

  const notesAtEnd = await helper.notesInDb() // highlight-line

  expect(notesAtEnd).toHaveLength(helper.initialNotes.length) // highlight-line
})

afterAll(() => {
  mongoose.connection.close()
}) 
```

<!-- The code using promises works and the tests pass. We are ready to refactor our code to use the async/await syntax. -->
使用 promises 的代码可以工作，并且测试通过。 我们已经准备好以使用 async/await 语法重构代码了。

<!-- We make the following changes to the code that takes care of adding a new note(notice that the route handler definition is preceded by the _async_ keyword): -->
我们对负责添加新便笺的代码进行如下更改(注意，路由处理程序的定义前面有 async 关键字) :

```js
notesRouter.post('/', async (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

  const savedNote = await note.save()
  response.json(savedNote)
})
```

<!-- There's a slight problem with our code: we don't handle error situations. How should we deal with them? -->
我们的代码有一个小问题: 我们没有处理错误情况。我们应该如何处理它们呢？

### Error handling and async/await  
【错误处理与async/await】
<!-- If there's an exception while handling the POST request we end up in a familiar situation: -->
如果在处理 POST 请求时出现了异常，我们就会陷入熟悉的情况:

![](../../images/4/6.png)

<!-- In other words we end up with an unhandled promise rejection, and the request never receives a response. -->
换句话说，我们最终得到的是一个未处理的承诺拒绝，而且请求从未收到响应。

<!-- With async/await the recommended way of dealing with exceptions is the old and familiar _try/catch_ mechanism: -->
使用 async/await 处理异常的推荐方法是老套的、熟悉的 try/catch 机制:

```js
notesRouter.post('/', async (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })
  // highlight-start
  try { 
    const savedNote = await note.save()
    response.json(savedNote)
  } catch(exception) {
    next(exception)
  }
  // highlight-end
})
```

<!-- The catch block simply calls the _next_ function, which passes the request handling to the error handling middleware. -->
Catch 块只是简单调用_next_函数，该函数将请求处理传递给错误处理中间件。 

<!-- After making the change, all of our tests will pass once again. -->
做出改变之后，我们所有的测试都将再次通过。

<!-- Next, let's write tests for fetching and removing an individual note: -->
接下来，让我们编写获取和删除单个便笺的测试:

```js
test('a specific note can be viewed', async () => {
  const notesAtStart = await helper.notesInDb()

  const noteToView = notesAtStart[0]

// highlight-start
  const resultNote = await api
    .get(`/api/notes/${noteToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)
// highlight-end

  const processedNoteToView = JSON.parse(JSON.stringify(noteToView))
  expect(resultNote.body).toEqual(processedNoteToView)
})

test('a note can be deleted', async () => {
  const notesAtStart = await helper.notesInDb()
  const noteToDelete = notesAtStart[0]

// highlight-start
  await api
    .delete(`/api/notes/${noteToDelete.id}`)
    .expect(204)
// highlight-end

  const notesAtEnd = await helper.notesInDb()

  expect(notesAtEnd).toHaveLength(
    helper.initialNotes.length - 1
  )

  const contents = notesAtEnd.map(r => r.content)

  expect(contents).not.toContain(noteToDelete.content)
})
```

<!-- In the first test, the note object we receive as the response body goes through JSON serialization and parsing. This processing will turn the note object's <em>date</em> property value's type from <em>Date</em> object into a string. Because of this we can't directly compare equality of the <em>resultNote.body</em> and <em>noteToView</em>. Instead, we must first perform similar JSON serialization and parsing for the <em>noteToView<em> as the server is performing for the note object. -->

在第一个测试中， 我们收到的note对象，作为response body，经过JSON的序列化和格式化处理。这种处理会将note 对象的date 属性的值类型从Date 类型转换成string。正是由于此，我们不能直接比较<em>resultNote.body</em> 和 <em>noteToView</em>的相等性能。 相反，我们必须像服务器对note 对象的操作那样，首先利用类似的方法，用JSON来序列化和格式化<em>noteToView</em> 。

<!-- Both tests share a similar structure. In the initialization phase they fetch a note from the database. After this, the tests call the actual operation being tested, which is highlighted in the code block. Lastly, the tests verify that the outcome of the operation is as expected. -->
这两个测试有着相似的结构。 在初始化阶段，它们从数据库中获取一个便笺。 在此之后，测试调用被测试的实际操作，该操作在代码块中突出显示。 最后，测试验证了操作的结果是符合预期的。

<!-- The tests pass and we can safely refactor the tested routes to use async/await: -->
测试通过了，我们可以安全地重构测试的路由，同样使用 async/await:

```js
notesRouter.get('/:id', async (request, response, next) => {
  try{
    const note = await Note.findById(request.params.id)
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  } catch(exception) {
    next(exception)
  }
})

notesRouter.delete('/:id', async (request, response, next) => {
  try {
    await Note.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})
```

<!-- You can find the code for our current application in its entirety in the <i>part4-4</i> branch of [this Github repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-4). -->
您可以在[this Github repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-4)的<i>part4-4</i> 分支中找到我们当前应用的全部代码。

### Eliminating the try-catch
【消除try-catch】

<!-- Async/await unclutters the code a bit, but the 'price' is the <i>try/catch</i> structure required for catching exceptions.  -->
Async/await  稍微整理了一下代码，但是‘ 代价’是捕获异常所需的<i>try/catch</i> 结构。 
<!-- All of the route handlers follow the same structure -->
所有的路由处理程序遵循相同的结构

```js
try {
  // do the async operations here
} catch(exception) {
  next(exception)
}
```



<!-- One starts to wonder, if it would be possible to refactor the code to eliminate the <i>catch</i> from the methods? -->
人们开始怀疑，是否有可能重构代码以从方法中消除<i>catch</i>？



<!-- The [express-async-errors](https://github.com/davidbanham/express-async-errors) library has a solution for this.  -->
[express-async-errors](https://github.com/davidbanham/express-async-errors)库为此提供了一个解决方案。



<!-- Let's install the library -->
我们来安装这个库吧

```bash
npm install express-async-errors
```


<!-- Using the library is <i>very</i> easy.  -->
使用这个库很容易。
<!-- You introduce the library in <i>src/app.js</i>: -->
在<i>app.js</i> 中引入库:

```js
const config = require('./utils/config')
const express = require('express')
require('express-async-errors') // highlight-line
const app = express()
const cors = require('cors')
const notesRouter = require('./controllers/notes')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

// ...

module.exports = app
```



<!-- The 'magic' of the library allows us to eliminate the try-catch blocks completely.  -->
这个库的“魔法”是允许我们完全消除 try-catch 块。
<!-- For example the route for deleting a note -->
例如，删除便笺的路由

```js
notesRouter.delete('/:id', async (request, response, next) => {
  try {
    await Note.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})
```



<!-- becomes -->
可以变成

```js
notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndRemove(request.params.id)
  response.status(204).end()
})
```



<!-- Because of the library, we do not need the _next(exception)_ call anymore.  -->
由于库的存在，我们不再需要_next(exception)_ 这种调用方式了。
<!-- The library handles everything under the hood. If an exception occurs in a <i>async</i> route, the execution is automatically passed to the error handling middleware. -->
库会处理一切事务。 如果在<i>async</i> 路由中发生异常，执行将自动传递到错误处理中间件。



<!-- The other routes become: -->
其他的路由修改为:

```js
notesRouter.post('/', async (request, response) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

  const savedNote = await note.save()
  response.json(savedNote)
})

notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})
```



<!-- The code for our application can be found from [github](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-5), branch <i>part4-5</i>. -->
我们应用的代码可以在[github](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-5) ，<i>part4-5</i> 中找到。

### Optimizing the beforeEach function
【优化 beforeEach 函数】
<!-- Let's return to writing our tests and take a closer look at the _beforeEach_ function that sets up the tests: -->
让我们回到编写测试的问题上来，仔细研究一下设置测试的 beforeEach 函数:

```js
beforeEach(async () => {
  await Note.deleteMany({})

  let noteObject = new Note(helper.initialNotes[0])
  await noteObject.save()

  noteObject = new Note(helper.initialNotes[1])
  await noteObject.save()
})
```

<!-- The function saves the first two notes from the   _helper.initialNotes_ array into the database with two separate operations. The solution is alright, but there's a better way of saving multiple objects to the database: -->
函数使用两个单独的操作将前两个便笺从   _helper.initialNotes_  数组保存到数据库中。 解决方案是不错的，但是有一个更好的方法可以将多个对象保存到数据库中:

```js
beforeEach(async () => {
  await Note.deleteMany({})
  console.log('cleared')

  helper.initialNotes.forEach(async (note) => {
    let noteObject = new Note(note)
    await noteObject.save()
    console.log('saved')
  })
  console.log('done')
})

test('notes are returned as json', async () => {
  console.log('entered test')
  // ...
}
```

<!-- We save the notes stored in the array into the database inside of a _forEach_ loop. The tests don't quite seem to work however, so we have added some console logs to help us find the problem.  -->
我们将存储在数组中的便笺保存到 forEach 循环中的数据库中。 然而，这些测试似乎并不能正常工作，因此我们添加了一些控制台日志来帮助我们找到问题所在。

<!-- The console displays the following output: -->
控制台显示如下输出:

<pre>
cleared
done
entered test
saved
saved
</pre>


<!-- Despite our use of the async/await syntax, our solution does not work like we expected it to. The test execution begins before the database is initialized! -->
尽管我们使用了 async/await 语法，但是我们的解决方案并不像我们期望的那样工作。 测试在数据库初始化之前就开始了！

<!-- The problem is that every iteration of the forEach loop generates its own asynchronous operation, and _beforeEach_ won't wait for them to finish executing. In other words, the _await_ commands defined inside of the _forEach_ loop are not in the _beforeEach_ function, but in separate functions that _beforeEach_ will not wait for. -->
问题在于 forEach 循环的每次迭代都会生成自己的异步操作，而 beforeEach 不会等待它们完成执行。 换句话说，在 forEach 循环中定义的 await 命令不在 beforeEach 函数中，而是在 beforeEach 不会等待的独立函数中。

<!-- Since the execution of tests begins immediately after _beforeEach_ has finished executing, the execution of tests begins before the database state is initialized. -->
由于测试的执行在 beforeEach 完成执行之后立即开始，因此测试的执行在初始化数据库状态之前开始。

<!-- One way of fixing this is to wait for all of the asynchronous operations to finish executing with the [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) method: -->
解决这个问题的一个方法是等待所有的异步操作，使用 [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) 方法完成:

```js
beforeEach(async () => {
  await Note.deleteMany({})

  const noteObjects = helper.initialNotes
    .map(note => new Note(note))
  const promiseArray = noteObjects.map(note => note.save())
  await Promise.all(promiseArray)
})
```

<!-- The solution is quite advanced despite its compact appearance. The _noteObjects_ variable is assigned to an array of Mongoose objects that are created with the _Note_ constructor for each of the notes in the _helper.initialNotes_ array. The next line of code creates a new array that <i>consists of promises</i>, that are created by calling the _save_ method of each item in the _noteObjects_ array. In other words, it is an array of promises for saving each of the items to the database. -->
解决方案是相当先进的，尽管看起来有点紧凑。_noteObjects_ 变量分配给一个 Mongoose 对象数组，这些对象是用 _helper.initialNotes_ 数组中的每个便笺的 Note 构造函数创建的。 下一行代码创建一个由 <i>consists of promises</i>组成的新数组，这个数组是通过调用 noteObjects 数组中每个项的 save 方法创建的。 换句话说，它是将每个项保存到数据库的Promise数组。

<!-- The [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) method can be used for transforming an array of promises into a single promise, that will be <i>fulfilled</i> once every promise in the array passed to it as a parameter is resolved. The last line of code <em>await Promise.all(promiseArray)</em> waits that every promise for saving a note is finished, meaning that the database has been initialized. -->
 [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) 方法可以用于将一个promises 数组转换为一个单一的promise，一旦数组中的每个promise作为参数被解析传递给它，它就会被实现。 最后一行代码 <em>await Promise.all(promiseArray)</em>  会等待着每个保存便笺的承诺都完成，这意味着数据库已经初始化。


<!-- > The returned values of each promise in the array can still be accessed when using the Promise.all method. If we wait for the promises to be resolved with the _await_ syntax <em>const results = await Promise.all(promiseArray)</em>, the operation will return an array that contains the resolved values for each promise in the _promiseArray_, and they appear in the same order as the promises in the array. -->
> 当使用 Promise.all 方法时，仍然可以访问数组中每个promise的返回值。 如果我们使用  _await_ 语法 <em>const results = await Promise.all(promiseArray)</em> 等待Promises被解析，操作将返回一个数组，该数组包含在 promiseArray 中的每个promise的解析值，并且它们与数组中的promise以相同的顺序出现。

<!-- Promise.all executes the promises it receives in parallel. If the promises need to be executed in a particular order, this will be problematic. In situations like this, the operations can be executed inside of a [for...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of) block, that guarantees a specific execution order. -->
Promise.all 并行执行它所收到的promises。 如果promise需要按照特定顺序执行，这将是个问题。 在这样的情况下，操作可以在一个[for... of](https://developer.mozilla.org/en-us/docs/web/javascript/reference/statements/for...of)块中执行，这样保证一个特定的执行顺序。 

```js
beforeEach(async () => {
  await Note.deleteMany({})

  for (let note of helper.initialNotes) {
    let noteObject = new Note(note)
    await noteObject.save()
  }
})
```

<!-- The asynchronous nature of JavaScript can lead to surprising behavior, and for this reason, it is important to pay careful attention when using the async/await syntax. Even though the syntax makes it easier to deal with promises, it is still necessary to understand how promises work! -->
Javascript 的异步特性可能会导致令人惊讶的行为，因此，在使用  async/await 语法时需要特别注意。 尽管语法使得处理承诺更加容易，但是仍然有必要理解Promise是如何工作的！ 

</div>


<div class="tasks">



### Exercises 4.8.-4.12.
<!-- **NB:** the material uses the [toContain](https://facebook.github.io/jest/docs/en/expect.html#tocontainitem) matcher in several places to verify that an array contains a specific element. It's worth noting that the method uses the === operator for comparing and matching elements, which means that it is often not well-suited for matching objects. In most cases, the appropriate method for verifying objects in arrays is the [toContainEqual](https://facebook.github.io/jest/docs/en/expect.html#tocontainequalitem) matcher. However, the model solutions don't check for objects in arrays with matchers, so using the method is not required for solving the exercises. -->
**注意:** 教材在几个地方使用[toContain](https://facebook.github.io/jest/docs/en/expect.html#tocontainitem)匹配器来验证数组是否包含特定元素。 值得注意的是，该方法使用 === 运算符来比较和匹配元素，这意味着它通常不适合匹配对象。 在大多数情况下，验证数组中对象的合适方法是[toContainEqual](https://facebook.github.io/jest/docs/en/expect.html#tocontainequalitem) 匹配器。 然而，模型解决方案不检查数组中与匹配器有关的对象，因此不需要使用该方法来解决练习。

<!-- **Warning:** If you find yourself using async/await and <i>then</i> methods in the same code, it is almost guaranteed that you are doing something wrong. Use one or the other and don't mix the two. -->
**警告:**如果您发现自己在同一代码中使用 async/await 和<i>then</i> 方法，那么几乎可以肯定您正在做一些错误的事情。 使用其中之一，不要混淆两者。


#### 4.8: Blog list tests, 步骤1
<!-- Use the supertest package for writing a test that makes an HTTP GET request to the <i>/api/blogs</i> url. Verify that the blog list application returns the correct amount of blog posts in the JSON format. -->
使用 supertest 包编写一个测试，该测试向<i>/api/blogs</i> url 发出 HTTP GET 请求。 验证 blog list 应用以 JSON 格式返回的 blog 文章数量是否正确。

<!-- Once the test is finished, refactor the route handler to use the async/await syntax instead of promises. -->
测试完成后，重构路由处理，使用 async/await 语法而不是 promises。

<!-- Notice that you will have to make similar changes to the code that were made [in the material](/zh/part4/测试后端应用#test-environment), like defining the test environment so that you can write tests that use their own separate database. -->
请注意，您必须按照[材料中](/zh/part4/测试后端应用#test-environment)所进行的编码进行类似的更改，比如定义测试环境，这样您就可以编写使用自己独立数据库的测试。

<!-- **NB:** When running the tests, you may run into the following warning: -->
注意: 当运行测试时，你可能会遇到如下警告:

![](../../images/4/8a.png)



<!-- If this happens, follow the [instructions](https://mongoosejs.com/docs/jest.html) and create a new <i>jest.config.js</i> file at the root of the project with the following contents: -->
如果发生这种情况，请按照[说明](https://mongoosejs.com/docs/jest.html)文档 ，在项目的根目录下创建一个新的<i>jest.config.js</i> 文件，内容如下:

```js
module.exports = {
  testEnvironment: 'node'
}
```



<!-- **NB:** when you are writing your tests **<i>it is better to not execute all of your tests</i>**, only execute the ones you are working on. Read more about this [here](/zh/part4/测试后端应用#running-tests-one-by-one). -->
注意: 在编写测试时，最好不要执行所有的测试 ，只执行正在工作的测试。 [在这里](/zh/part4/测试后端应用#running-tests-one-by-one)阅读更多相关内容。


#### 4.9*: Blog list tests, 步骤2
<!-- Write a test that verifies that the unique identifier property of the blog posts is named <i>id</i>, by default the database names the property <i>_id</i>. Verifying the existence of a property is easily done with Jest's [toBeDefined](https://jestjs.io/docs/en/expect#tobedefined) matcher. -->

编写一个测试，验证博客文章的唯一标识符属性是否命名为<i>id</i>，默认情况下，数据库命名为属性<i>_id</i>。 用 Jest 的[toBeDefined](https://jestjs.io/docs/en/expect#toBeDefined) 匹配器可以很容易地验证一个属性的存在性。

<!-- Make the required changes to the code so that it passes the test. The [toJSON](/zh/part3/将数据存入_mongo_db#backend-connected-to-a-database) method discussed in part 3 is an appropriate place for defining the <i>id</i> parameter. -->
对代码进行必要的更改，以便它通过测试。 第3章节中讨论的[toJSON](/zh/part3/将数据存入_mongo_db#backend-connected-to-a-database)方法是定义<i>id</i> 参数的合适位置。


#### 4.10: Blog list tests, 步骤3
<!-- Write a test that verifies that making an HTTP POST request to the <i>/api/blogs</i> url successfully creates a new blog post. At the very least, verify that the total number of blogs in the system is increased by one. You can also verify that the content of the blog post is saved correctly to the database. -->
编写一个测试，验证对<i>/api/blogs</i> url 发出 HTTP POST 请求是否成功地创建了一个新的 blog POST。 至少，验证系统中的博客总数是否增加了一个。 您还可以验证博客文章的内容是否正确地保存到数据库中。

<!-- Once the test is finished, refactor the operation to use async/await instead of promises. -->
一旦测试完成，重构操作，使用 async/await 而不是 promises。


#### 4.11*: Blog list tests, 步骤4

<!-- Write a test that verifies that if the <i>likes</i> property is missing from the request, it will default to the value 0. Do not test the other properties of the created blogs yet. -->
编写一个测试，验证如果请求中缺少<i>like</i> 属性，它将默认为值0。 不要测试已创建博客的其他属性。

<!-- Make the required changes to the code so that it passes the test. -->
对代码进行必要的更改，以便它通过测试。


#### 4.12*: Blog list tests, 步骤5

<!-- Write a test related to creating new blogs via the <i>/api/blogs</i> endpoint, that verifies that if the <i>title</i> and <i>url</i> properties are missing from the request data, the backend responds to the request with the status code <i>400 Bad Request</i>. -->
编写一个与通过 <i>/api/blogs</i>  端创建新博客相关的测试，该测试验证如果请求数据中缺少<i>title</i> 和<i>url</i> 属性，则后端用状态代码<i>400 Bad Request</i> 响应该请求。


<!-- Make the required changes to the code so that it passes the test. -->
对代码进行必要的更改，以便它通过测试。

</div>


<div class="content">



### Refactoring tests
【重构测试】
<!-- Our test coverage is currently lacking. Some requests like <i>GET /api/notes/:id</i> and <i>DELETE /api/notes/:id</i> aren't tested when the request is sent with an invalid id. The grouping and organization of tests could also use some improvement, as all tests exist on the same "top level" in the test file. The readability of the test would improve if we group related tests with <i>describe</i> blocks. -->
我们的测试覆盖率目前还不够。 有些请求，比如<i>GET /api/notes/:id</i> 和<i>DELETE /api/notes/:id</i>，在使用无效 id 发送请求时没有进行测试。 测试的分组和组织也可以使用一些改进，因为所有测试都存在于测试文件的同一“顶层”上。 如果我们将相关的测试与<i>describe</i> 块分组，测试的可读性将得到提高。

<!-- Below is an example of the test file after making some minor improvements: -->
下面是一个在做了一些小改进后的测试文件的例子:

```js
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Note = require('../models/note')

beforeEach(async () => {
  await Note.deleteMany({})

  const noteObjects = helper.initialNotes
    .map(note => new Note(note))
  const promiseArray = noteObjects.map(note => note.save())
  await Promise.all(promiseArray)
})

describe('when there is initially some notes saved', () => {
  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all notes are returned', async () => {
    const response = await api.get('/api/notes')

    expect(response.body).toHaveLength(helper.initialNotes.length)
  })

  test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes')

    const contents = response.body.map(r => r.content)
    expect(contents).toContain(
      'Browser can execute only Javascript'
    )
  })
})

describe('viewing a specific note', () => {
  test('succeeds with a valid id', async () => {
    const notesAtStart = await helper.notesInDb()

    const noteToView = notesAtStart[0]

    const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const processedNoteToView = JSON.parse(JSON.stringify(noteToView))
    expect(resultNote.body).toEqual(processedNoteToView)
  })

  test('fails with statuscode 404 if note does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()

    console.log(validNonexistingId)

    await api
      .get(`/api/notes/${validNonexistingId}`)
      .expect(404)
  })

  test('fails with statuscode 400 id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api
      .get(`/api/notes/${invalidId}`)
      .expect(400)
  })
})

describe('addition of a new note', () => {
  test('succeeds with valid data', async () => {
    const newNote = {
      content: 'async/await simplifies making async calls',
      important: true,
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(200)
      .expect('Content-Type', /application\/json/)


    const notesAtEnd = await helper.notesInDb()
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)

    const contents = notesAtEnd.map(n => n.content)
    expect(contents).toContain(
      'async/await simplifies making async calls'
    )
  })

  test('fails with status code 400 if data invaild', async () => {
    const newNote = {
      important: true
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(400)

    const notesAtEnd = await helper.notesInDb()

    expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
  })
})

describe('deletion of a note', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const notesAtStart = await helper.notesInDb()
    const noteToDelete = notesAtStart[0]

    await api
      .delete(`/api/notes/${noteToDelete.id}`)
      .expect(204)

    const notesAtEnd = await helper.notesInDb()

    expect(notesAtEnd).toHaveLength(
      helper.initialNotes.length - 1
    )

    const contents = notesAtEnd.map(r => r.content)

    expect(contents).not.toContain(noteToDelete.content)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
```

<!-- The test output is grouped according to the <i>describe</i> blocks: -->
测试输出根据<i>describe</i> 块进行分组:

![](../../images/4/7.png)



<!-- There is still room for improvement, but it is time to move forward. -->
仍有改进的余地，但现在是向前迈进的时候了。

<!-- This way of testing the API, by making HTTP requests and inspecting the database with Mongoose, is by no means the only nor the best way of conducting API-level integration tests for server applications. There is no universal best way of writing tests, as it all depends on the application being tested and available resources. -->
这种通过发出 HTTP 请求和用 Mongoose 检查数据库来测试 API 的方法，绝不是对服务器应用进行 API 集成测试的唯一或最佳方法。 没有通用的编写测试的最佳方法，因为这完全取决于被测试的应用和可用资源。

<!-- You can find the code for our current application in its entirety in the <i>part4-6</i> branch of [this Github repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-6). -->
您可以在[this Github repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-6)的<i>part4-6</i> 分支中找到我们当前应用的全部代码。

</div>


<div class="tasks">



### Exercises 4.13.-4.14.



#### 4.13 Blog list expansions, 步骤1
<!-- Implement functionality for deleting a single blog post resource. -->
实现删除单个博客文章资源的功能。

<!-- Use the async/await syntax. Follow [RESTful](/zh/part3/node_js_与_express#rest) conventions when defining the HTTP API. -->
使用async/await  语法。在定义 HTTP API 时遵循[RESTful](/zh/part3/node_js_与_express#rest)约定。

<!-- Feel free to implement tests for the functionality if you want to. Otherwise verify that the functionality works with Postman or some other tool. -->
可以按自己的意愿自由地实现该功能的测试。 否则，请验证该功能是否与 Postman 或其他工具一起工作。


#### 4.14 Blog list expansions, 步骤2

<!-- Implement functionality for updating the information of an individual blog post. -->
实现更新个人博客文章信息的功能。

<!-- Use async/await. -->
使用 async/await。

<!-- The application mostly needs to update the amount of <i>likes</i> for a blog post. You can implement this functionality the same way that we implemented updating notes in [第3章](/zh/part3/将数据存入_mongo_db#other-operations). -->
应用大多数情况下需要更新博客文章的<i>like</i> 数量。 您可以像在[第3章](/zh/part3/将数据存入_mongo_db#other-operations)中实现更新说明那样实现这个功能。


<!-- Feel free to implement tests for the functionality if you want to. Otherwise verify that the functionality works with Postman or some other tool. -->
可以按自己的意愿自由地实现该功能的测试。 否则，请验证该功能是否与 Postman 或其他工具一起工作。

</div>

