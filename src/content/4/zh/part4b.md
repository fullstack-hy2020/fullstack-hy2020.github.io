---
mainImage: ../../../images/part-4.svg
part: 4
letter: b
lang: zh
---

<div class="content">

<!-- We will now start writing tests for the backend. Since the backend does not contain any complicated logic, it doesn't make sense to write [unit tests](https://en.wikipedia.org/wiki/Unit_testing) for it. The only potential thing we could unit test is the _toJSON_ method that is used for formatting notes.-->
 我们现在将开始为后端编写测试。因为后端不包含任何复杂的逻辑，所以为它写[单元测试](https://en.wikipedia.org/wiki/Unit_testing)没有意义。我们唯一可能进行单元测试的是用于格式化笔记的_toJSON_方法。

<!-- In some situations, it can be beneficial to implement some of the backend tests by mocking the database instead of using a real database. One library that could be used for this is [mongodb-memory-server](https://github.com/nodkz/mongodb-memory-server).-->
 在某些情况下，通过模拟数据库而不是使用真正的数据库来实现一些后端测试是有益的。一个可以用于此的库是[mongodb-memory-server](https://github.com/nodkz/mongodb-memory-server)。

<!-- Since our application's backend is still relatively simple, we will make the decision to test the entire application through its REST API, so that the database is also included. This kind of testing where multiple components of the system are being tested as a group, is called [integration testing](https://en.wikipedia.org/wiki/Integration_testing).-->
 由于我们的应用的后端仍然相对简单，我们将决定通过其REST API测试整个应用，这样数据库也包括在内。这种将系统的多个组件作为一个整体进行测试的测试，被称为[集成测试](https://en.wikipedia.org/wiki/Integration_testing)。

### Test environment

<!-- In one of the previous chapters of the course material, we mentioned that when your backend server is running in Heroku, it is in <i>production</i> mode.-->
 在教材的前一章中，我们提到当你的后端服务器在Heroku中运行时，它处于<i>生产</i>模式。

<!-- The convention in Node is to define the execution mode of the application with the <i>NODE\_ENV</i> environment variable. In our current application, we only load the environment variables defined in the <i>.env</i> file if the application is <i>not</i> in production mode.-->
Node中的惯例是用<i>NODE\_ENV</i>环境变量来定义应用的执行模式。在我们当前的应用中，如果应用<i>不是</i>在生产模式下，我们只加载<i>.env</i>文件中定义的环境变量。

<!-- It is common practice to define separate modes for development and testing.-->
通常的做法是为开发和测试定义不同的模式。

<!-- Next, let's change the scripts in our <i>package.json</i> so that when tests are run, <i>NODE\_ENV</i> gets the value <i>test</i>:-->
 接下来，让我们改变<i>package.json</i>中的脚本，以便当测试运行时，<i>NODE\_ENV</i>获得<i>test</i>值。

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

<!-- We also added the [runInBand](https://jestjs.io/docs/cli#--runinband) option to the npm script that executes the tests. This option will prevent Jest from running tests in parallel; we will discuss its significance once our tests start using the database.-->
 我们还在执行测试的npm脚本中加入了[runInBand](https://jestjs.io/docs/cli#--runinband)选项。这个选项将阻止Jest并行运行测试；一旦我们的测试开始使用数据库，我们将讨论其意义。


<!-- We specified the mode of the application to be <i>development</i> in the _npm run dev_ script that uses nodemon. We also specified that the default _npm start_ command will define the mode as <i>production</i>.-->
 我们在使用nodemon的_npm run dev_脚本中指定应用的模式为<i>development</i>。我们还指定默认的_npm start_命令将定义模式为<i>production</i>。


<!-- There is a slight issue in the way that we have specified the mode of the application in our scripts: it will not work on Windows. We can correct this by installing the [cross-env](https://www.npmjs.com/package/cross-env) package as a development dependency with the command:-->
 我们在脚本中指定应用模式的方式有一个小问题：它在Windows上将无法工作。我们可以通过安装[cross-env](https://www.npmjs.com/package/cross-env)包作为开发依赖的命令来纠正这个问题。

```bash
npm install --save-dev cross-env
```

<!-- We can then achieve cross-platform compatibility by using the cross-env library in our npm scripts defined in <i>package.json</i>:-->
 然后我们可以通过在<i>package.json</i>中定义的npm脚本中使用cross-env库来实现跨平台兼容。

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
<!-- **NB**: If you are deploying this application to heroku, keep in mind that if cross-env is saved as a development dependency, it would cause an application error on your web server. To fix this, change cross-env to a production dependency by running this in the command line:-->
 **nb*:如果你要把这个应用部署到heroku，请记住，如果cross-env被保存为开发依赖项，它将在你的Web服务器上引起应用错误。为了解决这个问题，通过在命令行中运行这个命令，将cross-env改为生产依赖关系。

```bash
npm i cross-env -P
```

<!-- Now we can modify the way that our application runs in different modes. As an example of this, we could define the application to use a separate test database when it is running tests.-->
 现在我们可以修改我们的应用在不同模式下的运行方式。作为一个例子，我们可以定义应用在运行测试时使用一个单独的测试数据库。


<!-- We can create our separate test database in Mongo DB Atlas. This is not an optimal solution in situations where there are many people developing the same application. Test execution in particular typically requires that a single database instance is not used by tests that are running concurrently.-->
 我们可以在Mongo DB Atlas中创建我们单独的测试数据库。在有很多人开发同一个应用的情况下，这不是一个最佳解决方案。特别是测试执行，通常需要一个数据库实例不被同时运行的测试所使用。


<!-- It would be better to run our tests using a database that is installed and running in the developer's local machine. The optimal solution would be to have every test execution use its own separate database. This is "relatively simple" to achieve by [running Mongo in-memory](https://docs.mongodb.com/manual/core/inmemory/) or by using [Docker](https://www.docker.com) containers. We will not complicate things and will instead continue to use the MongoDB Atlas database.-->
 最好是使用安装在开发者本地机器上运行的数据库来运行我们的测试。最佳的解决方案是让每个测试执行都使用它自己的独立数据库。通过[在内存中运行Mongo](https://docs.mongodb.com/manual/core/inmemory/)或使用[Docker](https://www.docker.com)容器，这是 "相对简单 "的实现。我们不会将事情复杂化，而是继续使用MongoDB Atlas数据库。


<!-- Let's make some changes to the module that defines the application's configuration:-->
 让我们对定义应用配置的模块做一些修改。

```js
require('dotenv').config()

const PORT = process.env.PORT

// highlight-start
const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI
// highlight-end

module.exports = {
  MONGODB_URI,
  PORT
}
```

<!-- The <i>.env</i> file has <i>separate variables</i> for the database addresses of the development and test databases:-->
 <i>.env</i> 文件中有<i>独立的变量</i>，用于开发和测试数据库的数据库地址。

```bash
MONGODB_URI=mongodb+srv://fullstack:<password>@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority
PORT=3001

// highlight-start
TEST_MONGODB_URI=mongodb+srv://fullstack:<password>@cluster0.o1opl.mongodb.net/testNoteApp?retryWrites=true&w=majority
// highlight-end
```

<!-- The _config_ module that we have implemented slightly resembles the [node-config](https://github.com/lorenwest/node-config) package. Writing our own implementation is justified since our application is simple, and also because it teaches us valuable lessons.-->
 我们实现的_config_模块与[node-config](https://github.com/lorenwest/node-config)包略有相似。编写我们自己的实现是合理的，因为我们的应用很简单，同时也因为它给我们带来了宝贵的经验。

<!-- These are the only changes we need to make to our application's code.-->
 这些是我们需要对我们的应用的代码进行的唯一修改。

<!-- You can find the code for our current application in its entirety in the <i>part4-2</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-2).-->
 你可以在[这个github仓库](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-2)的<i>part4-2</i>分支中找到我们当前应用的全部代码。


### supertest

<!-- Let's use the [supertest](https://github.com/visionmedia/supertest) package to help us write our tests for testing the API.-->
 让我们使用[supertest](https://github.com/visionmedia/supertest)包来帮助我们编写测试API的测试。

<!-- We will install the package as a development dependency:-->
 我们将把这个包作为开发依赖项来安装。

```bash
npm install --save-dev supertest
```

<!-- Let's write our first test in the <i>tests/note_api.test.js</i> file:-->
 让我们在<i>tests/note_api.test.js</i>文件中编写第一个测试。

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

<!-- The test imports the Express application from the <i>app.js</i> module and wraps it with the <i>supertest</i> function into a so-called [superagent](https://github.com/visionmedia/superagent) object. This object is assigned to the <i>api</i> variable and tests can use it for making HTTP requests to the backend.-->
 该测试从<i>app.js</i>模块中导入Express应用，并将其与<i>supertest</i>函数包装成一个所谓的[superagent](https://github.com/visionmedia/superagent)对象。这个对象被分配给<i>api</i>变量，测试可以使用它来向后端发出HTTP请求。

<!-- Our test makes an HTTP GET request to the <i>api/notes</i> url and verifies that the request is responded to with the status code 200. The test also verifies that the <i>Content-Type</i> header is set to <i>application/json</i>, indicating that the data is in the desired format. (If you're not familiar with the RegEx syntax of <i>/application\/json/</i>, you can learn more [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions).)-->
 我们的测试向<i>api/notes</i>网址发出HTTP GET请求，并验证该请求被响应，状态代码为200。该测试还验证了<i>Content-Type</i>头被设置为<i>application/json</i>，表明数据为所需格式。(如果你不熟悉<i>/application/json/</i>的RegEx语法，你可以了解更多[这里](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)。)

<!-- The test contains some details that we will explore [a bit later on](/en/part4/testing_the_backend#async-await). The arrow function that defines the test is preceded by the <i>async</i> keyword and the method call for the <i>api</i> object is preceded by the <i>await</i> keyword. We will write a few tests and then take a closer look at this async/await magic. Do not concern yourself with them for now, just be assured that the example tests work correctly. The async/await syntax is related to the fact that making a request to the API is an <i>asynchronous</i> operation. The [Async/await syntax](https://jestjs.io/docs/asynchronous) can be used for writing asynchronous code with the appearance of synchronous code.-->
 该测试包含了一些细节，我们将[稍后](/en/part4/testing_the_backend#async-await)进行探讨。定义测试的箭头函数前面有<i>async</i>关键字，对<i>api</i>对象的方法调用前面有<i>await</i>关键字。我们将写一些测试，然后仔细看看这个async/await的魔法。暂时不要关注它们，只需保证示例测试的正常工作。async/await语法与向API发出请求是一个<i>异步</i>操作的事实有关。[Async/await语法](https://jestjs.io/docs/asynchronous)可用于编写具有同步代码外观的异步代码。

<!-- Once all the tests (there is currently only one) have finished running we have to close the database connection used by Mongoose. This can be easily achieved with the [afterAll](https://jestjs.io/docs/api#afterallfn-timeout) method:-->
 一旦所有的测试（目前只有一个）都运行完毕，我们必须关闭Mongoose使用的数据库连接。这可以通过[afterAll](https://jestjs.io/docs/api#afterallfn-timeout)方法轻松实现。

```js
afterAll(() => {
  mongoose.connection.close()
})
```

<!-- When running your tests you may run across the following console warning:-->
 当运行你的测试时，你可能会遇到以下控制台警告。

![](../../images/4/8.png)

<!-- The problem is quite likely caused by the Mongoose version 6.x, the problem does not appear when the version 5.x is used. Actually [Mongoose documentation](https://mongoosejs.com/docs/jest.html) does not recommend testing Mongoose applications with Jest.-->
 这个问题很可能是由Mongoose 6.x版本引起的，当使用5.x版本时，这个问题不会出现。实际上[Mongoose文档](https://mongoosejs.com/docs/jest.html)并不推荐用Jest测试Mongoose应用。

<!-- One way to get rid of this is to run tests with option <i>--forceExit</i>:-->
 摆脱这个问题的一个方法是用选项<i>--forceExit</i>运行测试。

```json
{
  // ..
  "scripts": {
    "start": "cross-env NODE_ENV=production node index.js",
    "dev": "cross-env NODE_ENV=development nodemon index.js",
    "lint": "eslint .",
    "test": "cross-env NODE_ENV=test jest --verbose --runInBand --forceExit" // highlight-line
  },
  // ...
}
```

<!-- Another error you may come across is your test takes longer than the default Jest test timeout of 5000 ms. This can be solved by adding a third parameter to the test function:-->
 你可能遇到的另一个错误是你的测试时间超过了Jest默认的5000ms的测试超时。这可以通过在测试函数中添加第三个参数来解决。

```js
test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 100000)
```

<!-- This third parameter sets the timeout to be 100000 ms. A long timeout ensures that our test won't fail due to the time it takes to run. (A long timeout may not be what you want for tests based on performance or speed, but this is fine for our example tests).-->
 这第三个参数将超时设置为100000毫秒。一个长的超时确保我们的测试不会因为运行时间而失败。(对于基于性能或速度的测试来说，一个长的超时可能不是你想要的，但对于我们的测试例子来说，这很好）。

<!-- One tiny but important detail: at the [beginning](/en/part4/structure_of_backend_application_introduction_to_testing#project-structure) of this part we extracted the Express application into the <i>app.js</i> file, and the role of the <i>index.js</i> file was changed to launch the application at the specified port with Node's built-in <i>http</i> object:-->
 一个微小但重要的细节：在这部分的[开头](/en/part4/structure_of_backend_application_introduction_to_testing#project-structure)，我们将Express应用提取到<i>app.js</i>文件中，<i>index.js</i>文件的作用被改变为在指定端口用Node的内置<i>http</i>对象启动该应用。

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

<!-- The tests only use the express application defined in the <i>app.js</i> file:-->
 测试只使用<i>app.js</i>文件中定义的Express应用。

```js
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app') // highlight-line

const api = supertest(app) // highlight-line

// ...
```


<!-- The documentation for supertest says the following:-->
 supertest的文档说如下。

<!-- > <i>if the server is not already listening for connections then it is bound to an ephemeral port for you so there is no need to keep track of ports.</i>-->
 > <i>如果服务器还没有监听连接，那么它就会为你绑定一个短暂的端口，所以不需要跟踪端口。</i>


<!-- In other words, supertest takes care that the application being tested is started at the port that it uses internally.-->
 换句话说，supertest注意到被测试的应用是在它内部使用的端口启动的。


<!-- Let's write a few more tests:-->
 让我们再写几个测试。

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

<!-- Both tests store the response of the request to the _response_ variable, and unlike the previous test that used the methods provided by _supertest_ for verifying the status code and headers, this time we are inspecting the response data stored in <i>response.body</i> property. Our tests verify the format and content of the response data with the [expect](https://jestjs.io/docs/expect#expectvalue) method of Jest.-->
 两个测试都将请求的响应存储到_response_变量中，与之前使用_supertest_提供的方法来验证状态代码和头信息的测试不同，这次我们要检查存储在<i>response.body</i>属性中的响应数据。我们的测试用Jest的[expect](https://jestjs.io/docs/expect#expectvalue)方法验证响应数据的格式和内容。


<!-- The benefit of using the async/await syntax is starting to become evident. Normally we would have to use callback functions to access the data returned by promises, but with the new syntax things are a lot more comfortable:-->
 使用async/await语法的好处开始变得明显了。通常情况下，我们必须使用回调函数来访问由承诺返回的数据，但有了新的语法，事情就好办多了。

```js
const response = await api.get('/api/notes')

// execution gets here only after the HTTP request is complete
// the result of HTTP request is saved in variable response
expect(response.body).toHaveLength(2)
```

<!-- The middleware that outputs information about the HTTP requests is obstructing the test execution output. Let us modify the logger so that it does not print to console in test mode:-->
 输出HTTP请求信息的中间件阻碍了测试执行的输出。让我们修改记录器，使其在测试模式下不打印到控制台。

```js
const info = (...params) => {
  // highlight-start
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params)
  }
  // highlight-end
}

const error = (...params) => {
  // highlight-start
  if (process.env.NODE_ENV !== 'test') {
    console.error(...params)
  }
  // highlight-end
}

module.exports = {
  info, error
}
```

### Initializing the database before tests

<!-- Testing appears to be easy and our tests are currently passing. However, our tests are bad as they are dependent on the state of the database (that happens to be correct in my test database). In order to make our tests more robust, we have to reset the database and generate the needed test data in a controlled manner before we run the tests.-->
 测试似乎很容易，我们的测试目前正在通过。然而，我们的测试是糟糕的，因为它们依赖于数据库的状态（在我的测试数据库中刚好是正确的）。为了使我们的测试更加稳健，我们必须在运行测试之前以一种可控的方式重置数据库并生成所需的测试数据。

<!-- Our tests are already using the [afterAll](https://jestjs.io/docs/api#afterallfn-timeout) function of Jest to close the connection to the database after the tests are finished executing. Jest offers many other [functions](https://jestjs.io/docs/setup-teardown) that can be used for executing operations once before any test is run, or every time before a test is run.-->
 我们的测试已经在使用Jest的[afterAll](https://jestjs.io/docs/api#afterallfn-timeout)函数，在测试执行完毕后关闭与数据库的连接。Jest提供了许多其他的[函数](https://jestjs.io/docs/setup-teardown)，可用于在任何测试运行前执行一次操作，或在每次测试运行前执行一次操作。

<!-- Let's initialize the database <i>before every test</i> with the [beforeEach](https://jestjs.io/docs/en/api.html#beforeeachfn-timeout) function:-->
 让我们在每次测试之前用[beforeEach](https://jestjs.io/docs/en/api.html#beforeeachfn-timeout)函数初始化数据库<i></i>。

```js
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
// highlight-start
const Note = require('../models/note')
// highlight-end

// highlight-start
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
// highlight-end

// highlight-start
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

<!-- The database is cleared out at the beginning, and after that we save the two notes stored in the _initialNotes_ array to the database. Doing this, we ensure that the database is in the same state before every test is run.-->
 数据库在开始时被清空，之后我们将存储在_initialNotes_数组中的两个笔记保存到数据库中。这样做，我们确保数据库在每次测试运行前处于相同的状态。

<!-- Let's also make the following changes to the last two tests:-->
 让我们也对最后两个测试做如下修改。

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

<!-- Pay special attention to the expect in the latter test. The <code>response.body.map(r => r.content)</code> command is used to create an array containing the content of every note returned by the API. The [toContain](https://jestjs.io/docs/expect#tocontainitem) method is used for checking that the note given to it as a parameter is in the list of notes returned by the API.-->
 特别注意后一个测试中的期望。<code>response.body.map(r => r.content)</code>命令被用来创建一个包含API返回的每个笔记内容的数组。toContain](https://jestjs.io/docs/expect#tocontainitem)方法用于检查作为参数给它的笔记是否在API返回的笔记列表中。

### Running tests one by one

<!-- The _npm test_ command executes all of the tests of the application. When we are writing tests, it is usually wise to only execute one or two tests. Jest offers a few different ways of accomplishing this, one of which is the [only](https://jestjs.io/docs/en/api#testonlyname-fn-timeout) method. If tests are written across many files, this method is not great.-->
 _npm test_命令执行了应用的所有测试。当我们编写测试时，通常只执行一到两个测试是明智的。Jest提供了一些不同的方法来实现这一点，其中之一是[only](https://jestjs.io/docs/en/api#testonlyname-fn-timeout)方法。如果测试是在许多文件中写的，这种方法不是很好。

<!-- A better option is to specify the tests that need to be run as parameter of the  <i>npm test</i> command.-->
 一个更好的选择是指定需要运行的测试，作为<i>npm test</i>命令的参数。

<!-- The following command only runs the tests found in the <i>tests/note_api.test.js</i> file:-->
 下面的命令只运行在<i>tests/note_api.test.js</i>文件中的测试。

```js
npm test -- tests/note_api.test.js
```

<!-- The <i>-t</i> option can be used for running tests with a specific name:-->
 <i>-t</i>选项可用于运行具有特定名称的测试。

```js
npm test -- -t "a specific note is within the returned notes"
```

<!-- The provided parameter can refer to the name of the test or the describe block. The parameter can also contain just a part of the name. The following command will run all of the tests that contain <i>notes</i> in their name:-->
 提供的参数可以指测试的名称或描述块。该参数也可以只包含名称的一部分。下面的命令将运行所有名称中包含<i>notes</i>的测试。

```js
npm test -- -t 'notes'
```

<!-- **NB**: When running a single test, the mongoose connection might stay open if no tests using the connection are run.-->
 **nb*:当运行一个测试时，如果没有使用该连接的测试被运行，mongoose的连接可能会保持开放。
<!-- The problem might be due to the fact that supertest primes the connection, but Jest does not run the afterAll portion of the code.-->
 这个问题可能是由于supertest对连接进行了预处理，但是Jest并没有运行代码的afterAll部分。

### async/await

<!-- Before we write more tests let's take a look at the _async_ and _await_ keywords.-->
 在我们写更多的测试之前，让我们看一下_async_和_await_关键字。

<!-- The async/await syntax that was introduced in ES7 makes it possible to use <i>asynchronous functions that return a promise</i> in a way that makes the code look synchronous.-->
 ES7中引入的async/await语法使得使用返回承诺的<i>异步函数</i>的方式可以使代码看起来是同步的。

<!-- As an example, the fetching of notes from the database with promises looks like this:-->
 作为一个例子，用承诺从数据库中获取笔记的过程看起来是这样的。

```js
Note.find({}).then(notes => {
  console.log('operation returned the following notes', notes)
})
```

<!-- The _Note.find()_ method returns a promise and we can access the result of the operation by registering a callback function with the _then_ method.-->
 _Note.find()_方法返回一个承诺，我们可以通过用_then_方法注册一个回调函数来访问操作的结果。

<!-- All of the code we want to execute once the operation finishes is written in the callback function. If we wanted to make several asynchronous function calls in sequence, the situation would soon become painful. The asynchronous calls would have to be made in the callback. This would likely lead to complicated code and could potentially give birth to a so-called [callback hell](http://callbackhell.com/).-->
 一旦操作完成，我们想要执行的所有代码都写在回调函数中。如果我们想依次进行几个异步函数的调用，情况很快就会变得很痛苦。异步调用将不得不在回调中进行。这将可能导致复杂的代码，并有可能诞生所谓的[回调地狱](http://callbackhell.com/)。

<!-- By [chaining promises](https://javascript.info/promise-chaining) we could keep the situation somewhat under control, and avoid callback hell by creating a fairly clean chain of _then_ method calls. We have seen a few of these during the course. To illustrate this, you can view an artificial example of a function that fetches all notes and then deletes the first one:-->
 通过[链式承诺](https://javascript.info/promise-chaining)，我们可以在一定程度上控制局面，并通过创建一个相当干净的_then_方法调用链来避免回调地狱。我们在课程中已经看到了一些这样的情况。为了说明这一点，你可以查看一个人为的例子，这个函数获取了所有的笔记，然后删除了第一条。

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

<!-- The then-chain is alright, but we can do better. The [generator functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) introduced in ES6 provided a [clever way](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/async%20%26%20performance/ch4.md#iterating-generators-asynchronously) of writing asynchronous code in a way that "looks synchronous". The syntax is a bit clunky and not widely used.-->
 然后链是好的，但我们可以做得更好。ES6中引入的[生成器函数](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator)提供了一种[聪明的方法](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/async%20%26%20performance/ch4.md#iterating-generators-asynchronously)，将异步代码写得 "看起来是同步的"。该语法有点笨重，没有得到广泛使用。

<!-- The _async_ and _await_ keywords introduced in ES7 bring the same functionality as the generators, but in an understandable and syntactically cleaner way to the hands of all citizens of the JavaScript world.-->
 ES7中引入的_async_和_await_关键字带来了与生成器相同的功能，但以一种可理解的、语法上更简洁的方式送到了JavaScript世界所有公民的手中。

<!-- We could fetch all of the notes in the database by utilizing the [await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) operator like this:-->
 我们可以通过利用[await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)操作符来获取数据库中的所有笔记，像这样。

```js
const notes = await Note.find({})

console.log('operation returned the following notes', notes)
```

<!-- The code looks exactly like synchronous code. The execution of code pauses at <em>const notes = await Note.find({})</em> and waits until the related promise is <i>fulfilled</i>, and then continues its execution to the next line. When the execution continues, the result of the operation that returned a promise is assigned to the _notes_ variable.-->
 这段代码看起来和同步代码完全一样。代码的执行在<em>const notes = await Note.find({})</em>处暂停，等待相关的承诺被<i>满足</i>，然后继续执行到下一行。当继续执行时，返回承诺的操作结果被分配给_notes_变量。

<!-- The slightly complicated example presented above could be implemented by using await like this:-->
 上面介绍的稍微复杂的例子可以通过使用await这样来实现。

```js
const notes = await Note.find({})
const response = await notes[0].remove()

console.log('the first note is removed')
```

<!-- Thanks to the new syntax, the code is a lot simpler than the previous then-chain.-->
 由于新的语法，代码比以前的then-chain简单多了。

<!-- There are a few important details to pay attention to when using async/await syntax. In order to use the await operator with asynchronous operations, they have to return a promise. This is not a problem as such, as regular asynchronous functions using callbacks are easy to wrap around promises.-->
 使用async/await语法时，有几个重要的细节需要注意。为了在异步操作中使用await操作符，它们必须返回一个承诺。这并不是一个问题，因为使用回调的常规异步函数很容易被承诺所包裹。

<!-- The await keyword can't be used just anywhere in JavaScript code. Using await is possible only inside of an [async](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) function.-->
 await关键字不能在JavaScript代码中随便使用。只有在[async](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)函数中才能使用await。

<!-- This means that in order for the previous examples to work, they have to be using async functions. Notice the first line in the arrow function definition:-->
这意味着，为了使前面的例子能够工作，它们必须使用异步函数。注意箭头函数定义中的第一行。

```js
const main = async () => { // highlight-line
  const notes = await Note.find({})
  console.log('operation returned the following notes', notes)

  const response = await notes[0].remove()
  console.log('the first note is removed')
}

main() // highlight-line
```

<!-- The code declares that the function assigned to _main_ is asynchronous. After this the code calls the function with <code>main()</code>.-->
 该代码声明分配给_main_的函数是异步的。在这之后，代码用<code>main()</code>调用该函数。

### async/await in the backend

<!-- Let's start to change the backend to async and await. As all of the asynchronous operations are currently done inside of a function, it is enough to change the route handler functions into async functions.-->
 让我们开始把后端改成异步和await。由于目前所有的异步操作都是在一个函数内完成的，所以只需将路由处理函数改为异步函数即可。

<!-- The route for fetching all notes gets changed to the following:-->
 获取所有笔记的路由被改成如下。

```js
notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({})
  response.json(notes)
})
```

<!-- We can verify that our refactoring was successful by testing the endpoint through the browser and by running the tests that we wrote earlier.-->
 我们可以通过浏览器测试端点和运行我们之前写的测试来验证我们的重构是否成功。

<!-- You can find the code for our current application in its entirety in the <i>part4-3</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-3).-->
 你可以在[这个Github仓库](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-3)的<i>part4-3</i>分支中找到我们当前应用的全部代码。

### More tests and refactoring the backend

<!-- When code gets refactored, there is always the risk of [regression](https://en.wikipedia.org/wiki/Regression_testing), meaning that existing functionality may break. Let's refactor the remaining operations by first writing a test for each route of the API.-->
当代码被重构时，总是有[回归](https://en.wikipedia.org/wiki/Regression_testing)的风险，这意味着现有的功能可能被破坏。让我们先为API的每条路线写一个测试，来重构剩下的操作。

<!-- Let's start with the operation for adding a new note. Let's write a test that adds a new note and verifies that the amount of notes returned by the API increases, and that the newly added note is in the list.-->
 让我们从添加一个新笔记的操作开始。让我们写一个测试，添加一个新的笔记，并验证API返回的笔记数量是否增加，以及新添加的笔记是否在列表中。

```js
test('a valid note can be added', async () => {
  const newNote = {
    content: 'async/await simplifies making async calls',
    important: true,
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/notes')

  const contents = response.body.map(r => r.content)

  expect(response.body).toHaveLength(initialNotes.length + 1)
  expect(contents).toContain(
    'async/await simplifies making async calls'
  )
})
```

<!-- Test actually fails since we are by accident returning the status code <i>200 OK</i> when a new note is created. Let us change that to <i>201 CREATED</i>:-->
 测试实际上是失败的，因为当一个新的笔记被创建时，我们意外地返回状态代码<i>200 OK</i>。让我们把它改为<i>201 CREATED</i>。

```js
notesRouter.post('/', (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

  note.save()
    .then(savedNote => {
      response.status(201).json(savedNote) // highlight-line
    })
    .catch(error => next(error))
})
```

<!-- Let's also write a test that verifies that a note without content will not be saved into the database.-->
 我们也写一个测试，验证一个没有内容的笔记不会被保存到数据库。

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

<!-- Both tests check the state stored in the database after the saving operation, by fetching all the notes of the application.-->
 这两个测试都是通过获取应用的所有笔记，来检查保存操作后存储在数据库的状态。

```js
const response = await api.get('/api/notes')
```

<!-- The same verification steps will repeat in other tests later on, and it is a good idea to extract these steps into helper functions. Let's add the function into a new file called <i>tests/test_helper.js</i> that is in the same directory as the test file.-->
 同样的验证步骤将在以后的其他测试中重复出现，将这些步骤提取到辅助函数中是个好主意。让我们把这个函数添加到一个新的文件中，叫做<i>tests/test_helper.js</i>，与测试文件在同一目录下。

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
  const note = new Note({ content: 'willremovethissoon', date: new Date() })
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

<!-- The module defines the _notesInDb_ function that can be used for checking the notes stored in the database. The _initialNotes_ array containing the initial database state is also in the module. We also define the _nonExistingId_ function ahead of time, that can be used for creating a database object ID that does not belong to any note object in the database.-->
 该模块定义了_notesInDb_函数，可用于检查存储在数据库中的笔记。包含初始数据库状态的_initialNotes_数组也在该模块中。我们还提前定义了_nonExistingId_函数，它可以用来创建一个不属于数据库中任何笔记对象的数据库对象ID。

<!-- Our tests can now use helper module and be changed like this:-->
 我们的测试现在可以使用辅助模块，并像这样改变。

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
    .expect(201)
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

<!-- The code using promises works and the tests pass. We are ready to refactor our code to use the async/await syntax.-->
 使用承诺的代码工作了，测试通过了。我们准备重构我们的代码以使用async/await语法。

<!-- We make the following changes to the code that takes care of adding a new note(notice that the route handler definition is preceded by the _async_ keyword):-->
 我们对处理添加新注释的代码做如下修改（注意路由处理程序的定义前面有_async_关键字）。

```js
notesRouter.post('/', async (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

  const savedNote = await note.save()
  response.status(201).json(savedNote)
})
```

<!-- There's a slight problem with our code: we don't handle error situations. How should we deal with them?-->
 我们的代码有一个小问题：我们没有处理错误情况。我们应该如何处理它们呢？

### Error handling and async/await

<!-- If there's an exception while handling the POST request we end up in a familiar situation:-->
 如果在处理POST请求时出现了异常，我们就会陷入一个熟悉的情况。

![](../../images/4/6.png)

<!-- In other words we end up with an unhandled promise rejection, and the request never receives a response.-->
 换句话说，我们最终会出现一个未处理的拒绝承诺，而且请求永远不会收到响应。

<!-- With async/await the recommended way of dealing with exceptions is the old and familiar _try/catch_ mechanism:-->
 在async/await中，处理异常的推荐方式是古老而熟悉的_try/catch_机制。

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
    response.status(201).json(savedNote)
  } catch(exception) {
    next(exception)
  }
  // highlight-end
})
```

<!-- The catch block simply calls the _next_ function, which passes the request handling to the error handling middleware.-->
 catch块简单地调用_next_函数，它将请求处理传递给错误处理中间件。

<!-- After making the change, all of our tests will pass once again.-->
 在做了这个改变之后，我们所有的测试将再次通过。

<!-- Next, let's write tests for fetching and removing an individual note:-->
 接下来，让我们编写获取和删除一个单独笔记的测试。

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

<!-- Both tests share a similar structure. In the initialization phase they fetch a note from the database. After this, the tests call the actual operation being tested, which is highlighted in the code block. Lastly, the tests verify that the outcome of the operation is as expected.-->
 两个测试都有一个类似的结构。在初始化阶段，它们从数据库中获取一个笔记。之后，测试调用被测试的实际操作，这在代码块中被强调。最后，测试验证操作的结果是否符合预期。

<!-- In the first test, the note object we receive as the response body goes through JSON serialization and parsing. This processing will turn the note object's <em>date</em> property value's type from <em>Date</em> object into a string. Because of this we can't directly compare equality of the <em>resultNote.body</em> and <em>noteToView</em> that is read from the database. Instead, we must first perform similar JSON serialization and parsing for the <em>noteToView</em> as the server is performing for the note object.-->
 在第一个测试中，我们收到的笔记对象作为响应体要经过JSON序列化和解析。这个处理过程将把笔记对象的<em>date</em>属性值的类型从<em>Date</em>对象变成一个字符串。正因为如此，我们不能直接比较<em>resultNote.body</em>和<em>noteToView</em>从数据库中读取的平等性。相反，我们必须首先对<em>noteToView</em>进行类似的JSON序列化和解析，就像服务器对note对象所做的那样。

<!-- The tests pass and we can safely refactor the tested routes to use async/await:-->
 测试通过了，我们可以安全地重构已测试的路由以使用async/await。

```js
notesRouter.get('/:id', async (request, response, next) => {
  try {
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

<!-- You can find the code for our current application in its entirety in the <i>part4-4</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-4).-->
 你可以在[这个Github仓库](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-4)的<i>part4-4</i>分支中找到我们当前应用的全部代码。

### Eliminating the try-catch

<!-- Async/await selkeyttää koodia jossain määrin, mutta sen 'hinta' on poikkeusten käsittelyn edellyttämä <i>try/catch</i>-rakenne. Kaikki routejen käsittelijät noudattavat samaa kaavaa -->
<!-- Async/await unclutters the code a bit, but the 'price' is the <i>try/catch</i> structure required for catching exceptions.-->
 Async/await使代码更加简洁，但其代价是捕捉异常所需的<i>try/catch</i>结构。
<!-- All of the route handlers follow the same structure-->
所有的路由处理程序都遵循相同的结构

```js
try {
  // do the async operations here
} catch(exception) {
  next(exception)
}
```

<!-- Mieleen herää kysymys, olisiko koodia mahdollista refaktoroida siten, että <i>catch</i> saataisiin refaktoroitua ulos metodeista?  -->
<!-- One starts to wonder, if it would be possible to refactor the code to eliminate the <i>catch</i> from the methods?-->
人们开始怀疑，是否有可能重构代码以消除方法中的<i>catch</i>？

<!-- Kirjasto [express-async-errors](https://github.com/davidbanham/express-async-errors) tuo tilanteeseen helpotuksen. -->
<!-- The [express-async-errors](https://github.com/davidbanham/express-async-errors) library has a solution for this.-->
 [express-async-errors](https://github.com/davidbanham/express-async-errors)库对此有一个解决方案。

<!-- Asennetaan kirjasto -->
<!-- Let's install the library-->
 我们来安装这个库吧

```bash
npm install express-async-errors
```

<!-- Kirjaston käyttö on <i>todella</i> helppoa.
<!--  Kirjaston koodi otetaan käyttöön tiedostossa <i>src/app.js</i>: -->-->
我们来安装这个库吧！<i>src/app.js</i>: -->
<!-- Using the library is <i>very</i> easy.-->
使用这个库是<i>非常</i>容易的。
<!-- You introduce the library in <i>app.js</i>:-->
你在<i>app.js</i>中引入该库。

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

<!-- Kirjaston koodiin sisällyttämän "magian" ansiosta pääsemme kokonaan eroon try-catch-lauseista. Muistiinpanon poistamisesta huolehtiva route -->
<!-- The 'magic' of the library allows us to eliminate the try-catch blocks completely.-->
 该库的"魔力"使我们可以完全消除try-catch块。
<!-- For example the route for deleting a note-->
 例如，删除一个笔记的路线

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

<!-- muuttuu muotoon -->
<!-- becomes-->
变成

```js
notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndRemove(request.params.id)
  response.status(204).end()
})
```

<!-- Kirjaston ansiosta kutsua _next(exception)_ ei siis enää tarvita, kirjasto hoitaa asian konepellin alla, eli jos <i>async</i>-funktiona määritellyn routen sisällä syntyy poikkeus, siirtyy suoritus automaattisesti virheenkäsittelijämiddlewareen. -->
<!-- Because of the library, we do not need the _next(exception)_ call anymore.-->
 因为有了这个库，我们不再需要_next(exception)_的调用。
<!-- The library handles everything under the hood. If an exception occurs in an <i>async</i> route, the execution is automatically passed to the error handling middleware.-->
 库处理了引擎盖下的一切。如果在<i>async</i>路由中发生异常，执行会自动传递给错误处理中间件。

<!-- Muut routet yksinkertaistuvat seuraavasti: -->
<!-- The other routes become:-->
其他路由成为。

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

### Optimizing the beforeEach function

<!-- Let's return to writing our tests and take a closer look at the _beforeEach_ function that sets up the tests:-->
 让我们回到编写我们的测试，仔细看看设置测试的_beforeEach_函数。

```js
beforeEach(async () => {
  await Note.deleteMany({})

  let noteObject = new Note(helper.initialNotes[0])
  await noteObject.save()

  noteObject = new Note(helper.initialNotes[1])
  await noteObject.save()
})
```

<!-- The function saves the first two notes from the   _helper.initialNotes_ array into the database with two separate operations. The solution is alright, but there's a better way of saving multiple objects to the database:-->
 该函数通过两个独立的操作将_helper.initialNotes_数组中的前两个笔记保存到数据库中。这个方案还不错，但有一个更好的方法来保存多个对象到数据库。

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

<!-- We save the notes stored in the array into the database inside of a _forEach_ loop. The tests don't quite seem to work however, so we have added some console logs to help us find the problem.-->
 我们在一个_forEach_循环中把存储在数组中的笔记保存到数据库中。然而，这些测试似乎并不奏效，所以我们添加了一些控制台日志来帮助我们找到问题所在。

<!-- The console displays the following output:-->
 控制台显示以下输出。

<pre>
cleared
done
entered test
saved
saved
</pre>

<!-- Despite our use of the async/await syntax, our solution does not work like we expected it to. The test execution begins before the database is initialized!-->
 尽管我们使用了async/await语法，我们的解决方案并没有像我们预期的那样工作。测试执行在数据库初始化之前就开始了!

<!-- The problem is that every iteration of the forEach loop generates its own asynchronous operation, and _beforeEach_ won't wait for them to finish executing. In other words, the _await_ commands defined inside of the _forEach_ loop are not in the _beforeEach_ function, but in separate functions that _beforeEach_ will not wait for.-->
 问题是forEach循环的每个迭代都会产生自己的异步操作，而_beforeEach_不会等待它们执行完毕。换句话说，在_forEach_循环内部定义的_await_命令不在_beforeEach_函数中，而是在_beforeEach_不会等待的独立函数中。

<!-- Since the execution of tests begins immediately after _beforeEach_ has finished executing, the execution of tests begins before the database state is initialized.-->
 由于测试的执行是在_beforeEach_执行完毕后立即开始的，所以测试的执行是在数据库状态被初始化之前开始的。

<!-- One way of fixing this is to wait for all of the asynchronous operations to finish executing with the [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) method:-->
 解决这个问题的一个方法是用[Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)方法来等待所有的异步操作执行完毕。

```js
beforeEach(async () => {
  await Note.deleteMany({})

  const noteObjects = helper.initialNotes
    .map(note => new Note(note))
  const promiseArray = noteObjects.map(note => note.save())
  await Promise.all(promiseArray)
})
```

<!-- The solution is quite advanced despite its compact appearance. The _noteObjects_ variable is assigned to an array of Mongoose objects that are created with the _Note_ constructor for each of the notes in the _helper.initialNotes_ array. The next line of code creates a new array that <i>consists of promises</i>, that are created by calling the _save_ method of each item in the _noteObjects_ array. In other words, it is an array of promises for saving each of the items to the database.-->
 这个解决方案尽管看起来很紧凑，但却相当先进。_noteObjects_变量被分配给一个Mongoose对象数组，这些对象是用_Note_构造函数为_helper.initialNotes_数组中的每个笔记创建的。下一行代码创建了一个新的数组，<i>由承诺组成</i>，这些承诺是通过调用_noteObjects_数组中每个项目的_save_方法创建的。换句话说，它是一个承诺数组，用于将每个项目保存到数据库中。

<!-- The [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) method can be used for transforming an array of promises into a single promise, that will be <i>fulfilled</i> once every promise in the array passed to it as a parameter is resolved. The last line of code <em>await Promise.all(promiseArray)</em> waits that every promise for saving a note is finished, meaning that the database has been initialized.-->
 [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)方法可用于将一个承诺数组转化为一个承诺，一旦作为参数传递给它的数组中的每个承诺被解决，这个承诺就会被<i>履行</i>。最后一行代码<em>await Promise.all(promiseArray)</em>等待每个保存笔记的承诺完成，这意味着数据库已经被初始化了。

<!-- > The returned values of each promise in the array can still be accessed when using the Promise.all method. If we wait for the promises to be resolved with the _await_ syntax <em>const results = await Promise.all(promiseArray)</em>, the operation will return an array that contains the resolved values for each promise in the _promiseArray_, and they appear in the same order as the promises in the array.-->
 > 使用Promise.all方法时，数组中每个承诺的返回值仍然可以被访问。如果我们用_await_语法<em>const results = await Promise.all(promiseArray)</em>来等待承诺的解析，该操作将返回一个数组，其中包含_promiseArray_中每个承诺的解析值，并且它们的出现顺序与数组中的承诺相同。

<!-- Promise.all executes the promises it receives in parallel. If the promises need to be executed in a particular order, this will be problematic. In situations like this, the operations can be executed inside of a [for...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of) block, that guarantees a specific execution order.-->
 Promise.all以并行方式执行它收到的承诺。如果这些承诺需要以特定的顺序执行，这将是有问题的。在这样的情况下，可以在[for...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of)块内执行操作，这样可以保证一个特定的执行顺序。

```js
beforeEach(async () => {
  await Note.deleteMany({})

  for (let note of helper.initialNotes) {
    let noteObject = new Note(note)
    await noteObject.save()
  }
})
```

<!-- The asynchronous nature of JavaScript can lead to surprising behavior, and for this reason, it is important to pay careful attention when using the async/await syntax. Even though the syntax makes it easier to deal with promises, it is still necessary to understand how promises work!-->
 JavaScript的异步性可能会导致令人惊讶的行为，为此，在使用async/await语法时，一定要仔细注意。即使该语法使处理承诺变得更容易，但仍然有必要了解承诺是如何工作的!

<!-- The code for our application can be found from [github](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-5), branch <i>part4-5</i>.-->
 我们应用的代码可以从[github](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-5)，分支<i>part4-5</i>找到。

</div>

<div class="tasks">

### Exercises 4.8.-4.12.

<!-- **NB:** the material uses the [toContain](https://jestjs.io/docs/expect#tocontainitem) matcher in several places to verify that an array contains a specific element. It's worth noting that the method uses the === operator for comparing and matching elements, which means that it is often not well-suited for matching objects. In most cases, the appropriate method for verifying objects in arrays is the [toContainEqual](https://jestjs.io/docs/expect#tocontainequalitem) matcher. However, the model solutions don't check for objects in arrays with matchers, so using the method is not required for solving the exercises.-->
 **NB:**该材料在多个地方使用了[toContain](https://jestjs.io/docs/expect#tocontainitem)匹配器来验证一个数组是否包含特定元素。值得注意的是，该方法使用===操作符来比较和匹配元素，这意味着它通常不适合于匹配对象。在大多数情况下，验证数组中对象的合适方法是[toContainEqual](https://jestjs.io/docs/expect#tocontainequalitem)匹配器。然而，模型的解决方案并没有用匹配器来检查数组中的对象，所以使用该方法并不是解决练习的必要条件。

<!-- **Warning:** If you find yourself using async/await and <i>then</i> methods in the same code, it is almost guaranteed that you are doing something wrong. Use one or the other and don't mix the two.-->
 **警告：**如果你发现自己在同一段代码中使用async/await和<i>then</i>方法，几乎可以肯定你做错了什么。请使用其中之一，不要将两者混用。

#### 4.8: Blog list tests, step1

<!-- Use the supertest package for writing a test that makes an HTTP GET request to the <i>/api/blogs</i> url. Verify that the blog list application returns the correct amount of blog posts in the JSON format.-->
 使用supertest包编写一个测试，向<i>/api/blogs</i>网址发出HTTP GET请求。验证博客列表应用以JSON格式返回正确数量的博客文章。

<!-- Once the test is finished, refactor the route handler to use the async/await syntax instead of promises.-->
 一旦测试完成，重构路由处理程序，使用async/await语法而不是promises。

<!-- Notice that you will have to make similar changes to the code that were made [in the material](/en/part4/testing_the_backend#test-environment), like defining the test environment so that you can write tests that use their own separate database.-->
 注意，你将不得不对[材料中](/en/part4/testing_the_backend#test-environment)的代码进行类似的修改，比如定义测试环境，以便你可以编写使用自己独立数据库的测试。

<!-- **NB:** When running the tests, you may run into the following warning:-->
 **NB:** 当运行测试时，你可能会遇到以下警告。

![](../../images/4/8a.png)

<!-- The problem is quite likely caused by the Mongoose version 6.x, the problem does not appear when the version 5.x is used. Actually [Mongoose documentation](https://mongoosejs.com/docs/jest.html) does not recommend testing Mongoose applications with Jest.-->
 这个问题很可能是由Mongoose 6.x版本引起的，当使用5.x版本时，这个问题不会出现。实际上[Mongoose文档](https://mongoosejs.com/docs/jest.html)并不推荐用Jest测试Mongoose应用。

<!-- One way to get rid of this is to run tests with option <i>--forceExit</i>:-->
 摆脱这个问题的一个方法是用选项<i>--forceExit</i>来运行测试。

```json
{
  // ..
  "scripts": {
    "start": "cross-env NODE_ENV=production node index.js",
    "dev": "cross-env NODE_ENV=development nodemon index.js",
    "lint": "eslint .",
    "test": "cross-env NODE_ENV=test jest --verbose --runInBand --forceExit" // highlight-line
  },
  // ...
}
```

<!-- **NB:** when you are writing your tests **<i>it is better to not execute all of your tests</i>**, only execute the ones you are working on. Read more about this [here](/en/part4/testing_the_backend#running-tests-one-by-one).-->
 **NB:**当你写你的测试时，**<i>最好不要执行你所有的测试</i>**，只执行你正在进行的测试。阅读更多关于这个的信息[这里](/en/part4/testing_the_backend#running-tests one-by-one)。

#### 4.9*: Blog list tests, step2

<!-- Write a test that verifies that the unique identifier property of the blog posts is named <i>id</i>, by default the database names the property <i>_id</i>. Verifying the existence of a property is easily done with Jest's [toBeDefined](https://jestjs.io/docs/en/expect#tobedefined) matcher.-->
 编写一个测试，验证博客文章的唯一标识符属性是否被命名为<i>id</i>，默认情况下，数据库将该属性命名为<i>_id</i>。使用Jest's [toBeDefined](https://jestjs.io/docs/en/expect#tobedefined)匹配器可以很容易地验证一个属性的存在。

<!-- Make the required changes to the code so that it passes the test. The [toJSON](/en/part3/saving_data_to_mongo_db#backend-connected-to-a-database) method discussed in part 3 is an appropriate place for defining the <i>id</i> parameter.-->
 对代码进行必要的修改，使其通过测试。第3章节中讨论的[toJSON](/en/part3/saving_data_to_mongo_db#backend-connected-to-a-database)方法是定义<i>id</i>参数的一个合适位置。
#### 4.10: Blog list tests, step3

<!-- Write a test that verifies that making an HTTP POST request to the <i>/api/blogs</i> url successfully creates a new blog post. At the very least, verify that the total number of blogs in the system is increased by one. You can also verify that the content of the blog post is saved correctly to the database.-->
 编写一个测试，验证向<i>/api/blogs</i>网址发出的HTTP POST请求是否成功创建了一个新的博客文章。至少要验证系统中的博客总数是否增加了一个。你也可以验证博文的内容是否被正确地保存到数据库中。

<!-- Once the test is finished, refactor the operation to use async/await instead of promises.-->
 一旦测试完成，重构操作，使用async/await而不是promises。
#### 4.11*: Blog list tests, step4

<!-- Write a test that verifies that if the <i>likes</i> property is missing from the request, it will default to the value 0. Do not test the other properties of the created blogs yet.-->
 写一个测试，验证如果请求中缺少<i>likes</i>属性，它将默认为0值。先不要测试创建的博客的其他属性。

<!-- Make the required changes to the code so that it passes the test.-->
 对代码进行必要的修改，使其通过测试。
#### 4.12*: Blog list tests, step5

<!-- Write a test related to creating new blogs via the <i>/api/blogs</i> endpoint, that verifies that if the <i>title</i> and <i>url</i> properties are missing from the request data, the backend responds to the request with the status code <i>400 Bad Request</i>.-->
 写一个与通过<i>/api/blogs</i>端点创建新博客有关的测试，验证如果请求数据中缺少<i>title</i>和<i>url</i>属性，后端会以状态代码<i>400 Bad Request</i>响应请求。


<!-- Make the required changes to the code so that it passes the test.-->
 对代码进行必要的修改，使其通过测试。

</div>

<div class="content">

### Refactoring tests

<!-- Our test coverage is currently lacking. Some requests like <i>GET /api/notes/:id</i> and <i>DELETE /api/notes/:id</i> aren't tested when the request is sent with an invalid id. The grouping and organization of tests could also use some improvement, as all tests exist on the same "top level" in the test file. The readability of the test would improve if we group related tests with <i>describe</i> blocks.-->
我们的测试覆盖率目前还很欠缺。一些请求，如<i>GET /api/notes/:id</i>和<i>DELETE /api/notes/:id</i>在请求被发送时，没有测试无效的id。测试的分组和组织也可以使用一些改进，因为所有的测试都存在于测试文件的同一个 "顶层"。如果我们用<i>describe</i>块来分组相关的测试，测试的可读性会得到改善。


<!-- Below is an example of the test file after making some minor improvements:-->
 下面是做了一些小改进后的测试文件的例子。

```js
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Note = require('../models/note')

beforeEach(async () => {
  await Note.deleteMany({})
  await Note.insertMany(helper.initialNotes)
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
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const notesAtEnd = await helper.notesInDb()
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)

    const contents = notesAtEnd.map(n => n.content)
    expect(contents).toContain(
      'async/await simplifies making async calls'
    )
  })

  test('fails with status code 400 if data invalid', async () => {
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


<!-- The test output is grouped according to the <i>describe</i> blocks:-->
 测试输出根据<i>describe</i>块进行分组。

![](../../images/4/7.png)

<!-- There is still room for improvement, but it is time to move forward.-->
 仍有改进的余地，但现在是向前推进的时候了。

<!-- This way of testing the API, by making HTTP requests and inspecting the database with Mongoose, is by no means the only nor the best way of conducting API-level integration tests for server applications. There is no universal best way of writing tests, as it all depends on the application being tested and available resources.-->
 这种测试API的方式，即通过HTTP请求和用Mongoose检查数据库，决不是对服务器应用进行API级集成测试的唯一或最佳方式。编写测试没有通用的最佳方式，因为它完全取决于被测试的应用和可用的资源。


<!-- You can find the code for our current application in its entirety in the <i>part4-6</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-6).-->
 你可以在[这个Github仓库](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-6)的<i>part4-6</i>分支中找到我们当前应用的全部代码。

</div>

<div class="tasks">

### Exercises 4.13.-4.14.

#### 4.13 Blog list expansions, step1

<!-- Implement functionality for deleting a single blog post resource.-->
 实现删除单个博客文章资源的功能。

<!-- Use the async/await syntax. Follow [RESTful](/en/part3/node_js_and_express#rest) conventions when defining the HTTP API.-->
 使用async/await语法。在定义HTTP API时遵循[RESTful](/en/part3/node_js_and_express#rest)惯例。

<!-- Implement tests for the functionality.-->
 实现功能的测试。

#### 4.14 Blog list expansions, step2

<!-- Implement functionality for updating the information of an individual blog post.-->
 实现更新单个博客文章信息的功能。

<!-- Use async/await.-->
 使用async/await。

<!-- The application mostly needs to update the amount of <i>likes</i> for a blog post. You can implement this functionality the same way that we implemented updating notes in [part 3](/en/part3/saving_data_to_mongo_db#other-operations).-->
 应用主要需要更新一篇博客文章的<i>喜欢</i>的数量。你可以用我们在[第三章节](/en/part3/saving_data_to_mongo_db#other-operations)中实现更新笔记的方法来实现这一功能。

<!-- Implement tests for the functionality.-->
 实现该功能的测试。

</div>
