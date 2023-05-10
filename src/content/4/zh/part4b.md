---
mainImage: ../../../images/part-4.svg
part: 4
letter: b
lang: zh
---

<div class="content">

<!-- We will now start writing tests for the backend. Since the backend does not contain any complicated logic, it doesn''t make sense to write [unit tests](https://en.wikipedia.org/wiki/Unit_testing) for it. The only potential thing we could unit test is the _toJSON_ method that is used for formatting notes.-->
我们现在开始为后端写测试。由于后端不包含任何复杂的逻辑，因此写[单元测试](https://en.wikipedia.org/wiki/Unit_testing)对它没有意义。我们唯一可以单元测试的东西是用于格式化笔记的_toJSON_方法。

<!-- In some situations, it can be beneficial to implement some of the backend tests by mocking the database instead of using a real database. One library that could be used for this is [mongodb-memory-server](https://github.com/nodkz/mongodb-memory-server).-->
在某些情况下，使用模拟数据库而不是使用真实数据库来实施一些后端测试可能是有益的。可以使用[mongodb-memory-server](https://github.com/nodkz/mongodb-memory-server)库来实现这一点。

<!-- Since our application''s backend is still relatively simple, we will decide to test the entire application through its REST API, so that the database is also included. This kind of testing where multiple components of the system are being tested as a group is called [integration testing](https://en.wikipedia.org/wiki/Integration_testing).-->
由于我们应用程序的后端仍然相对简单，我们将决定通过其REST API来测试整个应用程序，以便包括数据库。这种测试系统的多个组件作为一组进行测试的测试方法称为[集成测试](https://en.wikipedia.org/wiki/Integration_testing)。

### Test environment

<!-- In one of the previous chapters of the course material, we mentioned that when your backend server is running in Fly.io or Render, it is in <i>production</i> mode.-->
在本课程材料的前几章中，我们提到，当您的后端服务器运行在Fly.io或Render上时，它处于<i>生产</i>模式。

<!-- The convention in Node is to define the execution mode of the application with the <i>NODE\_ENV</i> environment variable. In our current application, we only load the environment variables defined in the <i>.env</i> file if the application is <i>not</i> in production mode.-->
在Node中，通常使用<i>NODE\_ENV</i>环境变量来定义应用程序的执行模式。在我们当前的应用程序中，只有在非生产模式下才会加载<i>.env</i>文件中定义的环境变量。

<!-- It is common practice to define separate modes for development and testing.-->
一般情况下，会为开发和测试定义不同的模式。

<!-- Next, let''s change the scripts in our <i>package.json</i> so that when tests are run, <i>NODE\_ENV</i> gets the value <i>test</i>:-->
接下来，让我们更改<i>package.json</i>中的脚本，以便在运行测试时，<i>NODE\_ENV</i>获得<i>test</i>的值：

```json
{
  // ...
  "scripts": {
    "start": "NODE_ENV=production node index.js",// highlight-line
    "dev": "NODE_ENV=development nodemon index.js",// highlight-line
    "build:ui": "rm -rf build && cd ../frontend/ && npm run build && cp -r build ../backend",
    "deploy": "fly deploy",
    "deploy:full": "npm run build:ui && npm run deploy",
    "logs:prod": "fly logs",
    "lint": "eslint .",
    "test": "NODE_ENV=test jest --verbose --runInBand"// highlight-line
  },
  // ...
}
```

<!-- We also added the [runInBand](https://jestjs.io/docs/cli#--runinband) option to the npm script that executes the tests. This option will prevent Jest from running tests in parallel; we will discuss its significance once our tests start using the database.-->
我们还在npm脚本中添加了[runInBand](https://jestjs.io/docs/cli#--runinband)选项来执行测试。此选项将防止Jest并行运行测试；一旦我们的测试开始使用数据库，我们将讨论它的重要性。

<!-- We specified the mode of the application to be <i>development</i> in the _npm run dev_ script that uses nodemon. We also specified that the default _npm start_ command will define the mode as <i>production</i>.-->
我们在使用 nodemon 的 _npm run dev_ 脚本中指定应用的模式为 <i>development</i>。我们还指定了默认的 _npm start_ 命令将模式定义为 <i>production</i>。

<!-- There is a slight issue in the way that we have specified the mode of the application in our scripts: it will not work on Windows. We can correct this by installing the [cross-env](https://www.npmjs.com/package/cross-env) package as a development dependency with the command:-->
我们在脚本中指定应用程序模式有一个轻微的问题：它在Windows上不起作用。我们可以通过使用以下命令将[cross-env](https://www.npmjs.com/package/cross-env) 包安装为开发依赖项来解决这个问题：`npm install --save-dev cross-env`

```bash
npm install --save-dev cross-env
```

<!-- We can then achieve cross-platform compatibility by using the cross-env library in our npm scripts defined in <i>package.json</i>:-->
我们可以通过在<i>package.json</i>中定义的npm脚本中使用cross-env库来实现跨平台兼容：

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

<!-- **NB**: If you are deploying this application to Fly.io/Render, keep in mind that if cross-env is saved as a development dependency, it would cause an application error on your web server. To fix this, change cross-env to a production dependency by running this in the command line:-->
**NB**: 如果您正在将此应用程序部署到Fly.io/Render，请记住，如果将cross-env保存为开发依赖项，则会在Web服务器上引发应用程序错误。 要解决此问题，请通过在命令行中运行以下内容将cross-env更改为生产依赖项：

```bash
npm install cross-env
```

<!-- Now we can modify the way that our application runs in different modes. As an example of this, we could define the application to use a separate test database when it is running tests.-->
现在我们可以修改应用程序在不同模式下运行的方式。例如，我们可以定义应用程序在运行测试时使用单独的测试数据库。

<!-- We can create our separate test database in MongoDB Atlas. This is not an optimal solution in situations where many people are developing the same application. Test execution in particular typically requires a single database instance that is not used by tests that are running concurrently.-->
我们可以在MongoDB Atlas中创建我们自己的独立测试数据库。在许多人开发同一个应用程序的情况下，这不是一个最佳解决方案。特别是测试执行通常需要一个不被同时运行的测试所使用的单个数据库实例。

<!-- It would be better to run our tests using a database that is installed and running on the developer''s local machine. The optimal solution would be to have every test execution use a separate database. This is "relatively simple" to achieve by [running Mongo in-memory](https://docs.mongodb.com/manual/core/inmemory/) or by using [Docker](https://www.docker.com) containers. We will not complicate things and will instead continue to use the MongoDB Atlas database.-->
最好的解决方案是让每次测试执行使用一个单独的数据库，这可以通过[运行Mongo内存](https://docs.mongodb.com/manual/core/inmemory/)或使用[Docker](https://www.docker.com)容器来实现，但我们不会使事情变得复杂，而是继续使用MongoDB Atlas数据库。

<!-- Let's make some changes to the module that defines the application's configuration:-->
让我们对定义应用程序配置的模块做一些更改：

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
<i>.env</i> 文件有 <i>独立的变量</i> 用于开发和测试数据库的数据库地址：

```bash
MONGODB_URI=mongodb+srv://fullstack:<password>@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority
PORT=3001

// highlight-start
TEST_MONGODB_URI=mongodb+srv://fullstack:<password>@cluster0.o1opl.mongodb.net/testNoteApp?retryWrites=true&w=majority
// highlight-end
```

<!-- The _config_ module that we have implemented slightly resembles the [node-config](https://github.com/lorenwest/node-config) package. Writing our implementation is justified since our application is simple, and also because it teaches us valuable lessons.-->
我们实现的_config_模块有点类似[node-config](https://github.com/lorenwest/node-config)包。写出我们的实现是合理的，因为我们的应用很简单，而且还能教会我们宝贵的经验。

<!-- These are the only changes we need to make to our application''s code.-->
这些是我们需要对应用程序代码做出的唯一更改。

<!-- You can find the code for our current application in its entirety in the <i>part4-2</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-2).-->
你可以在[这个GitHub仓库](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-2)的<i>part4-2</i>分支中找到我们当前应用的完整代码。

### supertest

<!-- Let''s use the [supertest](https://github.com/visionmedia/supertest) package to help us write our tests for testing the API.-->
让我们使用[supertest](https://github.com/visionmedia/supertest)包来帮助我们编写测试来测试API。

<!-- We will install the package as a development dependency:-->
我们将把这个包安装为开发依赖：

```bash
npm install --save-dev supertest
```

<!-- Let''s write our first test in the <i>tests/note_api.test.js</i> file:-->
让我们在<i>tests/note_api.test.js</i>文件中编写我们的第一个测试：

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

afterAll(async () => {
  await mongoose.connection.close()
})
```

<!-- The test imports the Express application from the <i>app.js</i> module and wraps it with the <i>supertest</i> function into a so-called [superagent](https://github.com/visionmedia/superagent) object. This object is assigned to the <i>api</i> variable and tests can use it for making HTTP requests to the backend.-->
测试从<i>app.js</i>模块中导入Express应用程序，并使用<i>supertest</i>函数将其包装到所谓的[superagent](https://github.com/visionmedia/superagent)对象中。该对象被分配给<i>api</i>变量，测试可以使用它向后端发出HTTP请求。

<!-- Our test makes an HTTP GET request to the <i>api/notes</i> url and verifies that the request is responded to with the status code 200. The test also verifies that the <i>Content-Type</i> header is set to <i>application/json</i>, indicating that the data is in the desired format.-->
我们的测试向<i>api/notes</i> URL发出HTTP GET请求，并验证请求被响应状态码为200。测试还验证<i>Content-Type</i>头被设置为<i>application/json</i>，表明数据是所需格式。

<!-- Checking the value of the header uses a bit strange looking syntax:-->
检查头值使用一个看起来有点奇怪的语法：

```js
.expect('Content-Type', /application\/json/)
```

<!-- The desired value is now defined as [regular expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) or in short regex. The regex starts and ends with a slash /, because the desired string <i>application/json</i> also contains the same slash, it is preceded by a \ so that it is not interpreted as a regex termination character.-->
所需的值现在定义为[正则表达式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)或简称为regex。正则表达式以斜杠/开头和结尾，因为所需的字符串<i>application/json</i>也包含相同的斜杠，所以它前面有一个\，以便不将其解释为正则表达式终止字符。

<!-- In principle, the test could also have been defined as a string-->
**原则上，试验也可以定义为一个字串**

```js
.expect('Content-Type', 'application/json')
```

<!-- The problem here, however, is that when using a string, the value of the header must be exactly the same. For the regex we defined, it is acceptable that the header <i>contains</i> the string in question. The actual value of the header is <i>application/json; charset=utf-8</i>, i.e. it also contains information about character encoding. However, our test is not interested in this and therefore it is better to define the test as a regex instead of an exact string.-->
这里的问题是，当使用字符串时，头的值必须完全相同。对于我们定义的正则表达式，头包含所查询的字符串是可以接受的。头的实际值是<i>application/json; charset=utf-8</i>，即它还包含有关字符编码的信息。但是，我们的测试不感兴趣，因此最好将测试定义为正则表达式，而不是精确的字符串。

<!-- The test contains some details that we will explore [a bit later on](/en/part4/testing_the_backend#async-await). The arrow function that defines the test is preceded by the <i>async</i> keyword and the method call for the <i>api</i> object is preceded by the <i>await</i> keyword. We will write a few tests and then take a closer look at this async/await magic. Do not concern yourself with them for now, just be assured that the example tests work correctly. The async/await syntax is related to the fact that making a request to the API is an <i>asynchronous</i> operation. The [async/await syntax](https://jestjs.io/docs/asynchronous) can be used for writing asynchronous code with the appearance of synchronous code.-->
测试包含一些我们稍后会探索的[详情](/en/part4/testing_the_backend#async-await)。定义测试的箭头函数之前有<i>async</i>关键字，而对<i>api</i>对象的方法调用之前有<i>await</i>关键字。我们将编写一些测试，然后仔细研究这种异步/等待魔术。现在不要担心它们，只要确保示例测试正确工作即可。async/await语法与向API发出请求是一个<i>异步</i>操作有关。[async/await语法](https://jestjs.io/docs/asynchronous)可用于编写具有同步代码外观的异步代码。

<!-- Once all the tests (there is currently only one) have finished running we have to close the database connection used by Mongoose. This can be easily achieved with the [afterAll](https://jestjs.io/docs/api#afterallfn-timeout) method:-->
一旦所有的测试（目前只有一个）都完成了，我们就必须关闭 Mongoose 所使用的数据库连接。可以很容易地使用[afterAll](https://jestjs.io/docs/api#afterallfn-timeout)方法来实现：

```js
afterAll(async () => {
  await mongoose.connection.close()
})
```

<!-- When running your tests you may run across the following console warning:-->
当运行测试时，您可能会遇到以下控制台警告：

![jest console warning about not exiting](../../images/4/8.png)

<!-- The problem is quite likely caused by the Mongoose version 6.x, the problem does not appear when version 5.x or 7.x is used. [Mongoose documentation](https://mongoosejs.com/docs/jest.html) does not recommend testing Mongoose applications with Jest.-->
问题很可能是由Mongoose版本6.x引起的，而当使用版本5.x或7.x时，问题不会出现。[Mongoose文档](https://mongoosejs.com/docs/jest.html)不建议使用Jest来测试Mongoose应用程序。

<!-- [One way](https://stackoverflow.com/questions/50687592/jest-and-mongoose-jest-has-detected-opened-handles) to get rid of this is to-->
use the `afterAll` function provided by Jest.

一种解决方法是使用Jest提供的`afterAll`函数。
<!-- add to the directory <i>tests</i> a file <i>teardown.js</i> with the following content-->
在目录<i>tests</i>中添加文件<i>teardown.js</i>，内容如下：

```js
module.exports = () => {
  process.exit(0)
}
```

<!-- and by extending the Jest definitions in the <i>package.json</i> as follows-->
在<i>package.json</i>中通过扩展Jest定义如下：

```js
{
 //...
 "jest": {
   "testEnvironment": "node",
   "globalTeardown": "./tests/teardown.js" // highlight-line
 }
}
```

<!-- Another error you may come across is your test takes longer than the default Jest test timeout of 5000 ms. This can be solved by adding a third parameter to the test function:-->
另一个可能遇到的错误是您的测试超过了Jest默认的5000毫秒测试超时。可以通过向测试函数添加第三个参数来解决这个问题：

```js
test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 100000)
```

<!-- This third parameter sets the timeout to 100000 ms. A long timeout ensures that our test won''t fail due to the time it takes to run. (A long timeout may not be what you want for tests based on performance or speed, but this is fine for our example tests).-->
这个第三个参数将超时设置为100000毫秒。长超时确保我们的测试不会因为运行时间而失败。（长超时可能不是您想要的基于性能或速度的测试，但对我们的示例测试来说这是可以的）。

<!-- One tiny but important detail: at the [beginning](/en/part4/structure_of_backend_application_introduction_to_testing#project-structure) of this part we extracted the Express application into the <i>app.js</i> file, and the role of the <i>index.js</i> file was changed to launch the application at the specified port via `app.listen`:-->
一个微小但重要的细节：在本部分的[开头](/en/part4/structure_of_backend_application_introduction_to_testing#project-structure)，我们将Express应用程序提取到<i>app.js</i>文件中，而<i>index.js</i>文件的作用则被改变为通过`app.listen`在指定端口上启动应用程序：

```js
const app = require('./app') // the actual Express app
const config = require('./utils/config')
const logger = require('./utils/logger')

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
```

<!-- The tests only use the Express application defined in the <i>app.js</i> file, which does not listen to any ports:-->
测试只使用<i>app.js</i>文件中定义的Express应用，它不监听任何端口：

```js
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app') // highlight-line

const api = supertest(app) // highlight-line

// ...
```

<!-- The documentation for supertest says the following:-->
> SuperTest 文档说：

<!-- > <i>if the server is not already listening for connections then it is bound to an ephemeral port for you so there is no need to keep track of ports.</i>-->
> 如果服务器尚未监听连接，那么它将为您绑定到一个临时端口，因此无需跟踪端口。

<!-- In other words, supertest takes care that the application being tested is started at the port that it uses internally.-->
换句话说，supertest确保被测试的应用程序在其内部使用的端口上启动。

<!-- Let''s add two notes to the test database using the _mongo.js_ program (here we must remember to switch to the correct database url).-->
使用_mongo.js_程序向测试数据库添加两条笔记（这里我们必须记住切换到正确的数据库url）。

<!-- Let''s write a few more tests:-->
让我们写几个更多的测试：

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
两个测试都将请求的响应存储到`response`变量中，与先前使用_supertest_提供的用于验证状态码和标头的方法不同，这次我们正在检查存储在<i>response.body</i>属性中的响应数据。 我们的测试使用Jest的[expect](https://jestjs.io/docs/expect#expectvalue)方法验证响应数据的格式和内容。

<!-- The benefit of using the async/await syntax is starting to become evident. Normally we would have to use callback functions to access the data returned by promises, but with the new syntax things are a lot more comfortable:-->
使用async/await语法的好处开始变得明显。通常我们必须使用回调函数来访问promise返回的数据，但是使用新语法，事情会变得更加舒适：

```js
const response = await api.get('/api/notes')

// execution gets here only after the HTTP request is complete
// the result of HTTP request is saved in variable response
expect(response.body).toHaveLength(2)
```

<!-- The middleware that outputs information about the HTTP requests is obstructing the test execution output. Let us modify the logger so that it does not print to the console in test mode:-->
测试执行输出被输出有关HTTP请求的中间件所阻塞。让我们修改日志记录器，使其在测试模式下不打印到控制台：

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

<!-- Testing appears to be easy and our tests are currently passing. However, our tests are bad as they are dependent on the state of the database, that now  happens to have two notes. To make our tests more robust, we have to reset the database and generate the needed test data in a controlled manner before we run the tests.-->
测试看起来很容易，我们的测试目前都通过了。但是，我们的测试很差，因为它们取决于数据库的状态，现在有两条注释。为了使我们的测试更加健壮，我们必须重置数据库，在运行测试之前以受控的方式生成所需的测试数据。

<!-- Our tests are already using the [afterAll](https://jestjs.io/docs/api#afterallfn-timeout) function of Jest to close the connection to the database after the tests are finished executing. Jest offers many other [functions](https://jestjs.io/docs/setup-teardown) that can be used for executing operations once before any test is run or every time before a test is run.-->
我们的测试已经使用了Jest的[afterAll](https://jestjs.io/docs/api#afterallfn-timeout)函数，在测试执行完毕后关闭与数据库的连接。 Jest提供了许多其他[功能](https://jestjs.io/docs/setup-teardown)，可用于在运行任何测试之前或每次在运行测试之前执行一次操作。

<!-- Let''s initialize the database <i>before every test</i> with the [beforeEach](https://jestjs.io/docs/en/api.html#beforeeachfn-timeout) function:-->
让我们用[beforeEach](https://jestjs.io/docs/en/api.html#beforeeachfn-timeout)函数在每次测试<i>之前</i>初始化数据库：

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
    important: false,
  },
  {
    content: 'Browser can execute only JavaScript',
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

<!-- The database is cleared out at the beginning, and after that, we save the two notes stored in the _initialNotes_ array to the database. By doing this, we ensure that the database is in the same state before every test is run.-->
数据库一开始就被清空，然后我们把存储在`initialNotes`数组中的两条笔记保存到数据库中。通过这样做，我们确保在每次测试运行前数据库都处于同一状态。

<!-- Let''s also make the following changes to the last two tests:-->
让我们也对最后两次测试做出以下改变：

```js
test('all notes are returned', async () => { // highlight-line
  const response = await api.get('/api/notes')

  expect(response.body).toHaveLength(initialNotes.length) // highlight-line
})

test('a specific note is within the returned notes', async () => { // highlight-line
  const response = await api.get('/api/notes')

  // highlight-start
  const contents = response.body.map(r => r.content)

  expect(contents).toContain(
    'Browser can execute only JavaScript'
  )
  // highlight-end
})
```

<!-- Pay special attention to the expect in the latter test. The <code>response.body.map(r => r.content)</code> command is used to create an array containing the content of every note returned by the API. The [toContain](https://jestjs.io/docs/expect#tocontainitem) method is used for checking that the note given to it as a parameter is in the list of notes returned by the API.-->
**注意后面测试中的预期。<code>response.body.map(r => r.content)</code> 命令用于创建一个包含API返回的每个笔记内容的数组。[toContain](https://jestjs.io/docs/expect#tocontainitem) 方法用于检查给它作为参数的笔记是否在API返回的笔记列表中。

### Running tests one by one

<!-- The _npm test_ command executes all of the tests for the application. When we are writing tests, it is usually wise to only execute one or two tests. Jest offers a few different ways of accomplishing this, one of which is the [only](https://jestjs.io/docs/en/api#testonlyname-fn-timeout) method. If tests are written across many files, this method is not great.-->
`npm test` 命令会执行应用的所有测试。当我们编写测试时，通常最好只执行一到两个测试。Jest提供了几种不同的方法来实现这一点，其中之一就是[only](https://jestjs.io/docs/en/api#testonlyname-fn-timeout) 方法。如果测试跨越多个文件，这种方法就不太好。

<!-- A better option is to specify the tests that need to be run as parameters of the <i>npm test</i> command.-->
一个更好的选择是将需要运行的测试指定为<i>npm test</i>命令的参数。

<!-- The following command only runs the tests found in the <i>tests/note_api.test.js</i> file:-->
`npm test -- tests/note_api.test.js`

以下命令只运行位于<i>tests/note_api.test.js</i>文件中的测试：

`npm test -- tests/note_api.test.js`

```js
npm test -- tests/note_api.test.js
```

<!-- The <i>-t</i> option can be used for running tests with a specific name:-->
<i>-t</i> 选项可用于以特定名称运行测试：

```js
npm test -- -t "a specific note is within the returned notes"
```

<!-- The provided parameter can refer to the name of the test or the describe block. The parameter can also contain just a part of the name. The following command will run all of the tests that contain <i>notes</i> in their name:-->
以下命令将运行所有包含<i>notes</i>在其名称中的测试：`提供的参数可以指测试的名称或描述块。该参数也可以只包含名称的一部分。

```js
npm test -- -t 'notes'
```

<!-- **NB**: When running a single test, the mongoose connection might stay open if no tests using the connection are run.-->
**注意：**当运行单个测试时，如果没有运行使用连接的测试，mongoose连接可能会保持打开状态。
<!-- The problem might be because supertest primes the connection, but Jest does not run the afterAll portion of the code.-->
问题可能是因为supertest会对连接进行预处理，而Jest却不会运行代码的afterAll部分。

### async/await

<!-- Before we write more tests let''s take a look at the _async_ and _await_ keywords.-->
在我们写更多测试之前，让我们来看看_async_和_await_关键字。

<!-- The async/await syntax that was introduced in ES7 makes it possible to use <i>asynchronous functions that return a promise</i> in a way that makes the code look synchronous.-->
ES7 引入的 async/await 语法使得能够以同步代码的方式使用 <i>返回 promise 的异步函数</i>。

<!-- As an example, the fetching of notes from the database with promises looks like this:-->
示例如下：使用承诺从数据库提取笔记的情况如下：

```js
Note.find({}).then(notes => {
  console.log('operation returned the following notes', notes)
})
```

<!-- The _Note.find()_ method returns a promise and we can access the result of the operation by registering a callback function with the _then_ method.-->
`Note.find()` 方法返回一个promise，我们可以通过使用`then`方法注册一个回调函数来访问操作的结果。

<!-- All of the code we want to execute once the operation finishes is written in the callback function. If we wanted to make several asynchronous function calls in sequence, the situation would soon become painful. The asynchronous calls would have to be made in the callback. This would likely lead to complicated code and could potentially give birth to a so-called [callback hell](http://callbackhell.com/).-->
所有我们想在操作完成后执行的代码都写在回调函数中。如果我们想要按顺序进行几次异步函数调用，情况很快就会变得棘手。异步调用必须在回调中进行。这可能会导致复杂的代码，并可能会诞生所谓的[回调地狱](http://callbackhell.com/)。

<!-- By [chaining promises](https://javascript.info/promise-chaining) we could keep the situation somewhat under control, and avoid callback hell by creating a fairly clean chain of _then_ method calls. We have seen a few of these during the course. To illustrate this, you can view an artificial example of a function that fetches all notes and then deletes the first one:-->
通过[承诺链接](https://javascript.info/promise-chaining)，我们可以在一定程度上控制局面，并通过创建一个相当干净的`then`方法调用链来避免回调地狱。在课程中我们已经看到了一些这样的例子。为了说明这一点，您可以查看一个抓取所有笔记并删除第一个笔记的人工示例：

```js
Note.find({})
  .then(notes => {
    return notes[0].deleteOne()
  })
  .then(response => {
    console.log('the first note is removed')
    // more code here
  })
```

<!-- The then-chain is alright, but we can do better. The [generator functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) introduced in ES6 provided a [clever way](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/async%20%26%20performance/ch4.md#iterating-generators-asynchronously) of writing asynchronous code in a way that "looks synchronous". The syntax is a bit clunky and not widely used.-->
当时的链是可以的，但我们可以做得更好。ES6中引入的[生成器函数](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator)提供了一种[巧妙的方式](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/async%20%26%20performance/ch4.md#iterating-generators-asynchronously)来以“看起来同步”的方式编写异步代码。语法有点笨拙，而且没有得到广泛使用。

<!-- The _async_ and _await_ keywords introduced in ES7 bring the same functionality as the generators, but in an understandable and syntactically cleaner way to the hands of all citizens of the JavaScript world.-->
ES7 引入的 _async_ 和 _await_ 关键字为 JavaScript 世界的所有公民带来了与生成器相同的功能，但以更容易理解和语法更清晰的方式。

<!-- We could fetch all of the notes in the database by utilizing the [await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) operator like this:-->
我们可以像这样利用 [await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) 操作符从数据库中获取所有笔记：

```js
const notes = await Note.find({})

console.log('operation returned the following notes', notes)
```

<!-- The code looks exactly like synchronous code. The execution of code pauses at <em>const notes = await Note.find({})</em> and waits until the related promise is <i>fulfilled</i>, and then continues its execution to the next line. When the execution continues, the result of the operation that returned a promise is assigned to the _notes_ variable.-->
代码看起来完全像同步代码。代码在<em>const notes = await Note.find({})</em>处暂停执行，并等待相关的promise被<i>fulfilled</i>，然后继续执行下一行。当执行继续时，返回promise的操作的结果将被分配给_notes_变量。

<!-- The slightly complicated example presented above could be implemented by using await like this:-->
这个略微复杂的例子可以用`await`来实现，就像这样：

```js
const notes = await Note.find({})
const response = await notes[0].deleteOne()

console.log('the first note is removed')
```

<!-- Thanks to the new syntax, the code is a lot simpler than the previous then-chain.-->
感谢新语法，这段代码比之前的 then-chain 简单多了。

<!-- There are a few important details to pay attention to when using async/await syntax. To use the await operator with asynchronous operations, they have to return a promise. This is not a problem as such, as regular asynchronous functions using callbacks are easy to wrap around promises.-->
使用 async/await 语法时有几个重要的细节需要注意。要使用 await 操作符处理异步操作，它们必须返回一个 promise。这不是问题，因为使用回调的常规异步函数很容易封装到 promise 中。

<!-- The await keyword can''t be used just anywhere in JavaScript code. Using await is possible only inside of an [async](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) function.-->
` await` 关键字不能在JavaScript代码中任意使用。只有在[async](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)函数中才可以使用`await`。

<!-- This means that in order for the previous examples to work, they have to be using async functions. Notice the first line in the arrow function definition:-->
这意味着，为了让前面的例子正常工作，它们必须使用异步函数。注意箭头函数定义中的第一行：

```js
const main = async () => { // highlight-line
  const notes = await Note.find({})
  console.log('operation returned the following notes', notes)

  const response = await notes[0].deleteOne()
  console.log('the first note is removed')
}

main() // highlight-line
```

<!-- The code declares that the function assigned to _main_ is asynchronous. After this, the code calls the function with <code>main()</code>.-->
代码声明了分配给_main_的函数是异步的。之后，代码使用<code>main()</code>调用该函数。

### async/await in the backend

<!-- Let''s start to change the backend to async and await. As all of the asynchronous operations are currently done inside of a function, it is enough to change the route handler functions into async functions.-->
让我们开始把后端改为 async 和 await。由于所有的异步操作目前都在函数内部完成，因此只需要把路由处理函数改为 async 函数就足够了。

<!-- The route for fetching all notes gets changed to the following:-->
获取所有笔记的路由已更改为如下：

```js
notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({})
  response.json(notes)
})
```

<!-- We can verify that our refactoring was successful by testing the endpoint through the browser and by running the tests that we wrote earlier.-->
我们可以通过浏览器测试端点以及运行之前编写的测试来验证我们的重构是否成功。

<!-- You can find the code for our current application in its entirety in the <i>part4-3</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-3).-->
您可以在[此GitHub存储库](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-3)的<i>part4-3</i>分支中找到我们当前应用程序的完整代码。

### More tests and refactoring the backend

<!-- When code gets refactored, there is always the risk of [regression](https://en.wikipedia.org/wiki/Regression_testing), meaning that existing functionality may break. Let''s refactor the remaining operations by first writing a test for each route of the API.-->
当代码重构时，总会有[回归](https://en.wikipedia.org/wiki/Regression_testing)的风险，这意味着现有功能可能会出现故障。让我们先为API的每个路由编写一个测试，然后再重构剩余的操作。

<!-- Let's start with the operation for adding a new note. Let's write a test that adds a new note and verifies that the number of notes returned by the API increases and that the newly added note is in the list.-->
让我们从添加新笔记的操作开始。让我们编写一个测试，添加一个新笔记，并验证API返回的笔记数量是否增加，以及新添加的笔记是否在列表中。

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

<!-- Test fails since we are by accident returning the status code <i>200 OK</i> when a new note is created. Let us change that to <i>201 CREATED</i>:-->
测试失败了，因为我们在创建新笔记时意外地返回了状态码<i>200 OK</i>。让我们把它改成<i>201 CREATED</i>：

```js
notesRouter.post('/', (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save()
    .then(savedNote => {
      response.status(201).json(savedNote) // highlight-line
    })
    .catch(error => next(error))
})
```

<!-- Let''s also write a test that verifies that a note without content will not be saved into the database.-->
让我们也写一个测试来验证没有内容的笔记不会被保存到数据库中。

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
两个测试都通过抓取应用程序的所有笔记来检查保存操作后数据库中存储的状态。

```js
const response = await api.get('/api/notes')
```

<!-- The same verification steps will repeat in other tests later on, and it is a good idea to extract these steps into helper functions. Let''s add the function into a new file called <i>tests/test_helper.js</i> which is in the same directory as the test file.-->
同样的验证步骤将在以后的其他测试中重复，把这些步骤抽取到辅助函数中是个好主意。让我们把这个函数添加到一个叫做<i>tests/test_helper.js</i>的新文件中，它和测试文件在同一个目录下。

```js
const Note = require('../models/note')

const initialNotes = [
  {
    content: 'HTML is easy',
    important: false
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true
  }
]

const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon' })
  await note.save()
  await note.deleteOne()

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

<!-- The module defines the _notesInDb_ function that can be used for checking the notes stored in the database. The _initialNotes_ array containing the initial database state is also in the module. We also define the _nonExistingId_ function ahead of time, which can be used for creating a database object ID that does not belong to any note object in the database.-->
模块定义了`_notesInDb_`函数，可用于检查数据库中存储的笔记。模块中还包含了包含初始数据库状态的`_initialNotes_`数组。我们还提前定义了`_nonExistingId_`函数，可用于创建一个不属于任何笔记对象的数据库对象ID。

<!-- Our tests can now use the helper module and be changed like this:-->
我们的测试现在可以使用辅助模块，并且可以像这样改变：

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
    'Browser can execute only JavaScript'
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

afterAll(async () => {
  await mongoose.connection.close()
})
```

<!-- The code using promises works and the tests pass. We are ready to refactor our code to use the async/await syntax.-->
代码使用promises工作并且测试通过。我们准备重构我们的代码以使用async/await语法。

<!-- We make the following changes to the code that takes care of adding a new note (notice that the route handler definition is preceded by the _async_ keyword):-->
我们对用于添加新笔记的代码做出以下更改（请注意，路由处理器定义前面有 _async_ 关键字）：

```js
notesRouter.post('/', async (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  const savedNote = await note.save()
  response.status(201).json(savedNote)
})
```

<!-- There's a slight problem with our code: we don't handle error situations. How should we deal with them?-->
有一个稍微的问题与我们的代码：我们不处理错误情况。我们应该如何处理它们？

### Error handling and async/await

<!-- If there''s an exception while handling the POST request we end up in a familiar situation:-->
如果在处理POST请求时出现异常，我们就会陷入一个熟悉的情境：

![terminal showing unhandled promise rejection warning](../../images/4/6.png)

<!-- In other words, we end up with an unhandled promise rejection, and the request never receives a response.-->
换句话说，我们最终会得到一个未经处理的承诺拒绝，而请求永远不会收到响应。

<!-- With async/await the recommended way of dealing with exceptions is the old and familiar _try/catch_ mechanism:-->
使用async/await处理异常的推荐方式是老式而熟悉的`try/catch`机制：

```js
notesRouter.post('/', async (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
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
catch 块只是简单地调用 _next_ 函数，该函数将请求处理传递给错误处理中间件。

<!-- After making the change, all of our tests will pass once again.-->
在做出改变之后，我们所有的测试都会再次通过。

<!-- Next, let''s write tests for fetching and removing an individual note:-->
接下来，让我们为获取和删除单个笔记编写测试：

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

  expect(resultNote.body).toEqual(noteToView)
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

<!-- Both tests share a similar structure. In the initialization phase, they fetch a note from the database. After this, the tests call the actual operation being tested, which is highlighted in the code block. Lastly, the tests verify that the outcome of the operation is as expected.-->
两个测试共享类似的结构。在初始化阶段，它们从数据库中获取一个注释。之后，测试调用实际测试的操作，该操作用代码块突出显示。最后，测试验证操作的结果是否如预期。

<!-- The tests pass and we can safely refactor the tested routes to use async/await:-->
测试通过了，我们可以安全地重构被测试过的路由以使用 async/await：

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
  } catch(exception) {
    next(exception)
  }
})
```

<!-- You can find the code for our current application in its entirety in the <i>part4-4</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-4).-->
您可以在[此GitHub存储库](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-4)的<i>part4-4</i>分支中找到我们当前应用程序的完整代码。

### Eliminating the try-catch

<!-- Async/await unclutters the code a bit, but the 'price' is the <i>try/catch</i> structure required for catching exceptions.-->
<i>Async/await</i> 可以稍微整理代码，但是这个“代价”就是需要用<i>try/catch</i>结构来捕获异常。
<!-- All of the route handlers follow the same structure-->
所有的路由处理程序都遵循相同的结构

```js
try {
  // do the async operations here
} catch(exception) {
  next(exception)
}
```

<!-- One starts to wonder if it would be possible to refactor the code to eliminate the <i>catch</i> from the methods?-->
一开始就会想知道是否有可能重构代码来消除 <i>catch</i> 中的方法？

<!-- The [express-async-errors](https://github.com/davidbanham/express-async-errors) library has a solution for this.-->
[express-async-errors](https://github.com/davidbanham/express-async-errors) 库为此提供了解决方案。

<!-- Let''s install the library-->
.

让我们安装这个库吧。

```bash
npm install express-async-errors
```

<!-- Using the library is <i>very</i> easy.-->
使用图书馆<i>非常</i>容易。
<!-- You introduce the library in <i>app.js</i>:-->
在`app.js`中介绍库：

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

<!-- The 'magic' of the library allows us to eliminate the try-catch blocks completely.-->
「图书馆的「魔力」让我们完全可以消除try-catch块。」
<!-- For example the route for deleting a note-->
例如，删除笔记的路由

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

<!-- becomes-->
**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床时，我都会有一个新的目标**

**每天起床

```js
notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndRemove(request.params.id)
  response.status(204).end()
})
```

<!-- Because of the library, we do not need the _next(exception)_ call anymore.-->
由于图书馆，我们不再需要_next（异常）_调用了。
<!-- The library handles everything under the hood. If an exception occurs in an <i>async</i> route, the execution is automatically passed to the error handling middleware.-->
图书馆处理所有的后台工作。如果在<i>async</i>路由中发生异常，执行将自动传递到错误处理中间件。

<!-- The other routes become:-->
另外的路线变成：

```js
notesRouter.post('/', async (request, response) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  const savedNote = await note.save()
  response.status(201).json(savedNote)
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

<!-- Let''s return to writing our tests and take a closer look at the _beforeEach_ function that sets up the tests:-->
让我们回到写测试，并仔细看看设置测试的`beforeEach`函数：

```js
beforeEach(async () => {
  await Note.deleteMany({})

  let noteObject = new Note(helper.initialNotes[0])
  await noteObject.save()

  noteObject = new Note(helper.initialNotes[1])
  await noteObject.save()
})
```

<!-- The function saves the first two notes from the _helper.initialNotes_ array into the database with two separate operations. The solution is alright, but there''s a better way of saving multiple objects to the database:-->
函数通过两个单独的操作，将`_helper.initialNotes_`数组中的前两个笔记保存到数据库中，解决方案还可以，但是有一种更好的方式可以一次性将多个对象保存到数据库中。

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

<!-- We save the notes stored in the array into the database inside of a _forEach_ loop. The tests don''t quite seem to work however, so we have added some console logs to help us find the problem.-->
我们在_forEach_ 循环中将存储在数组中的笔记保存到数据库中。但是测试似乎并不能正常工作，因此我们添加了一些控制台日志来帮助我们找到问题。

<!-- The console displays the following output:-->
控制台显示以下输出：

<pre>
cleared
done
entered test
saved
saved
</pre>

<!-- Despite our use of the async/await syntax, our solution does not work as we expected it to. The test execution begins before the database is initialized!-->
尽管我们使用了async/await语法，但我们的解决方案并不按我们预期的那样工作。测试执行在数据库初始化之前就开始了！

<!-- The problem is that every iteration of the forEach loop generates an asynchronous operation, and _beforeEach_ won''t wait for them to finish executing. In other words, the _await_ commands defined inside of the _forEach_ loop are not in the _beforeEach_ function, but in separate functions that _beforeEach_ will not wait for.-->
问题在于每次forEach循环迭代都会产生一个异步操作，而_beforeEach_却不会等待它们完成执行。换句话说，在_forEach_循环中定义的_await_命令不在_beforeEach_函数中，而是在_beforeEach_不会等待的单独函数中。

<!-- Since the execution of tests begins immediately after _beforeEach_ has finished executing, the execution of tests begins before the database state is initialized.-->
自从_beforeEach_执行完成后，测试立即开始执行，因此测试的执行开始时，数据库状态尚未初始化。

<!-- One way of fixing this is to wait for all of the asynchronous operations to finish executing with the [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) method:-->
一种解决方法是使用[Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)方法等待所有异步操作完成：

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
虽然外观紧凑，但解决方案非常先进。`noteObjects`变量被分配给一个由`Note`构造函数创建的`helper.initialNotes`数组中的每个笔记的Mongoose对象数组。下一行代码创建一个新数组，该数组<i>由调用`noteObjects`数组中的每个项的`save`方法而创建的承诺组成</i>。换句话说，它是一个将每个项目保存到数据库的承诺数组。

<!-- The [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) method can be used for transforming an array of promises into a single promise, that will be <i>fulfilled</i> once every promise in the array passed to it as a parameter is resolved. The last line of code <em>await Promise.all(promiseArray)</em> waits until every promise for saving a note is finished, meaning that the database has been initialized.-->
[Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) 方法可用于将一组 promises 转换成一个单独的 promise，一旦传递给它作为参数的数组中的每个 promise 都被解决，它就会<i>满足</i>。最后一行代码<em>await Promise.all(promiseArray)</em>等待每个保存笔记的 promise 都完成，这意味着数据库已经初始化完成。

<!-- > The returned values of each promise in the array can still be accessed when using the Promise.all method. If we wait for the promises to be resolved with the _await_ syntax <em>const results = await Promise.all(promiseArray)</em>, the operation will return an array that contains the resolved values for each promise in the _promiseArray_, and they appear in the same order as the promises in the array.-->
> 使用`Promise.all`方法时，仍可以访问数组中每个promise的返回值。如果我们使用`await`语法等待这些promise被解析<em>const results = await Promise.all(promiseArray)</em>，该操作将返回一个包含`promiseArray`中每个promise解析值的数组，它们的顺序与数组中的promise相同。

<!-- Promise.all executes the promises it receives in parallel. If the promises need to be executed in a particular order, this will be problematic. In situations like this, the operations can be executed inside of a [for...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of) block, that guarantees a specific execution order.-->
承诺。所有并行执行收到的承诺。如果需要按特定顺序执行承诺，这将是有问题的。在这种情况下，操作可以在[for...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of)块中执行，保证特定的执行顺序。

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
JavaScript 的非同步性质可能导致令人惊讶的行为，因此，在使用 async/await 语法时需要仔细注意。尽管语法使得处理 promise 变得更容易，但仍然需要理解 promise 是如何运作的！

<!-- The code for our application can be found on [GitHub](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-5), branch <i>part4-5</i>.-->
我们应用的代码可以在[GitHub](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-5)的<i>part4-5</i>分支上找到。

### A true full stack developer''s oath

<!-- Making tests brings yet another layer of challenge to programming. We have to update our full stack developer oath to remind you that systematicity is also key when developing tests.-->
编写测试给编程带来了另一个层面的挑战。我们必须更新我们的全栈开发者誓言，提醒你在开发测试时系统性也是关键。

<!-- So we should once more extend our oath:-->
因此，我们应该再次宣誓：

<!-- Full stack development is <i> extremely hard</i>, that is why I will use all the possible means to make it easier-->
.

全栈开发<i>非常困难</i>，这就是为什么我要用尽一切可能的方法来使它变得更容易。

<!-- - I will have my browser developer console open all the time-->
我会一直开启我的浏览器开发人员控制台。
<!-- - I will use the network tab of the browser dev tools to ensure that frontend and backend are communicating as I expect-->
我将使用浏览器开发工具的网络选项卡来确保前端和后端正如我所期望的那样进行通信。
<!-- - I will constantly keep an eye on the state of the server to make sure that the data sent there by the frontend is saved there as I expect-->
我会不断关注服务器的状态，确保前端发送到那里的数据按我的预期保存在那里。
<!-- - I will keep an eye on the database: does the backend save data there in the right format-->
?

我会留意数据库：后端是否会以正确的格式在那里保存数据？
<!-- - I will progress in small steps-->
我会一步一步地进步。
<!-- - <i>I will write lots of _console.log_ statements to make sure I understand how the code and the tests behave and to help pinpoint problems</i>-->
我会写很多`console.log`语句来确保我理解代码和测试的行为，以及帮助找出问题。
<!-- - If my code does not work, I will not write more code. Instead, I start deleting the code until it works or just return to a state when everything was still working-->
.

如果我的代码不起作用，我不会再写更多的代码。相反，我会开始删除代码，直到它起作用，或者只是返回到一个一切都还在正常工作的状态。
<!-- - <i>If a test does not pass, I make sure that the tested functionality for sure works in the application</i>-->
如果测试不通过，我会确保应用程序中测试的功能确实可以正常工作。
<!-- - When I ask for help in the course Discord or Telegram channel or elsewhere I formulate my questions properly, see [here](https://fullstackopen.com/en/part0/general_info#how-to-get-help-in-discord-telegram) how to ask for help-->
当我在课程的Discord或Telegram频道或其他地方求助时，我会恰当地提出问题，参见[这里](https://fullstackopen.com/en/part0/general_info#how-to-get-help-in-discord-telegram)如何求助。

</div>

<div class="tasks">

### Exercises 4.8.-4.12.

<!-- **NB:** the material uses the [toContain](https://jestjs.io/docs/expect#tocontainitem) matcher in several places to verify that an array contains a specific element. It's worth noting that the method uses the === operator for comparing and matching elements, which means that it is often not well-suited for matching objects. In most cases, the appropriate method for verifying objects in arrays is the [toContainEqual](https://jestjs.io/docs/expect#tocontainequalitem) matcher. However, the model solutions don't check for objects in arrays with matchers, so using the method is not required for solving the exercises.-->
**翻译：**在几个地方，本文使用了[toContain](https://jestjs.io/docs/expect#tocontainitem)匹配器来验证数组是否包含特定元素。值得注意的是，该方法使用===运算符进行比较和匹配元素，这意味着它通常不适合用于匹配对象。在大多数情况下，验证数组中对象的适当方法是[toContainEqual](https://jestjs.io/docs/expect#tocontainequalitem)匹配器。但是，模型解决方案不使用匹配器来检查数组中的对象，因此解决练习时不需要使用该方法。

<!-- **Warning:** If you find yourself using async/await and <i>then</i> methods in the same code, it is almost guaranteed that you are doing something wrong. Use one or the other and don''t mix the two.-->
**警告：** 如果你发现自己在同一段代码中同时使用 async/await 和 <i>then</i> 方法，几乎可以肯定你在做错事。只用一种方法，不要混用两种。

#### 4.8: Blog list tests, step1

<!-- Use the supertest package for writing a test that makes an HTTP GET request to the <i>/api/blogs</i> URL. Verify that the blog list application returns the correct amount of blog posts in the JSON format.-->
使用supertest包编写一个测试，发出一个HTTP GET请求到<i>/api/blogs</i> URL。验证博客列表应用程序以JSON格式返回正确数量的博客帖子。

<!-- Once the test is finished, refactor the route handler to use the async/await syntax instead of promises.-->
一旦测试完成，就重构路由处理程序，使用 async/await 语法而不是 promises。

<!-- Notice that you will have to make similar changes to the code that were made [in the material](/en/part4/testing_the_backend#test-environment), like defining the test environment so that you can write tests that use separate databases.-->
注意，您必须对代码做出类似[材料中所做的更改](/en/part4/testing_the_backend#test-environment)，例如定义测试环境，以便您可以编写使用单独数据库的测试。

<!-- **NB:** When running the tests, you may run into the following warning:-->
**警告：** 当运行测试时，你可能会遇到以下警告：

![Warning to read docs on connecting mongoose to jest](../../images/4/8a.png)

<!-- [One way](https://stackoverflow.com/questions/50687592/jest-and-mongoose-jest-has-detected-opened-handles) to get rid of this is to-->
add a [teardown](https://jestjs.io/docs/en/configuration#teardown-function) function to your Jest configuration.

一种解决方案是在Jest配置中添加一个[拆卸函数](https://jestjs.io/docs/en/configuration#teardown-function)。
<!-- add to the <i>tests</i> directory a file <i>teardown.js</i> with the following content-->
在<i>测试</i>目录中添加一个名为<i>teardown.js</i>的文件，内容如下：

```js
module.exports = () => {
  process.exit(0)
}
```

<!-- and by extending the Jest definitions in the <i>package.json</i> as follows-->
在<i>package.json</i>中通过延伸Jest定义如下：

```js
{
 //...
 "jest": {
   "testEnvironment": "node",
   "globalTeardown": "./tests/teardown.js" // highlight-line
 }
}
```

<!-- **NB:** when you are writing your tests **<i>it is better to not execute all of your tests</i>**, only execute the ones you are working on. Read more about this [here](/en/part4/testing_the_backend#running-tests-one-by-one).-->
**<i>最好不要执行所有的测试，只执行你正在做的测试。更多关于此的资讯请参阅[这里](/en/part4/testing_the_backend#running-tests-one-by-one)。</i>**

#### 4.9: Blog list tests, step2

<!-- Write a test that verifies that the unique identifier property of the blog posts is named <i>id</i>, by default the database names the property <i>_id</i>. Verifying the existence of a property is easily done with Jest''s [toBeDefined](https://jestjs.io/docs/en/expect#tobedefined) matcher.-->
编写一个测试来验证博客文章的唯一标识符属性默认名称为<i>id</i>，数据库默认命名为<i>_id</i>。使用Jest的[toBeDefined](https://jestjs.io/docs/en/expect#tobedefined)匹配器可以很容易地验证属性的存在。

<!-- Make the required changes to the code so that it passes the test. The [toJSON](/en/part3/saving_data_to_mongo_db#connecting-the-backend-to-a-database) method discussed in part 3 is an appropriate place for defining the <i>id</i> parameter.-->
修改代码，使其通过测试。 第3部分讨论的[toJSON](/en/part3/saving_data_to_mongo_db#connecting-the-backend-to-a-database) 方法是定义<i>id</i>参数的合适位置。

#### 4.10: Blog list tests, step3

<!-- Write a test that verifies that making an HTTP POST request to the <i>/api/blogs</i> URL successfully creates a new blog post. At the very least, verify that the total number of blogs in the system is increased by one. You can also verify that the content of the blog post is saved correctly to the database.-->
写一个测试来验证向<i>/api/blogs</i> URL发送HTTP POST请求成功创建了一篇新的博客文章。至少验证系统中博客的总数增加了一个。你也可以验证博客文章的内容被正确地保存到数据库中。

<!-- Once the test is finished, refactor the operation to use async/await instead of promises.-->
一旦测试完成，就重构操作以使用async/await而不是promises。

#### 4.11*: Blog list tests, step4

<!-- Write a test that verifies that if the <i>likes</i> property is missing from the request, it will default to the value 0. Do not test the other properties of the created blogs yet.-->
编写一个测试，验证如果<i>likes</i>属性缺失于请求中，它将默认为0的值。暂时不测试其他创建博客的属性。

<!-- Make the required changes to the code so that it passes the test.-->
请对代码做出必要的更改，以使其通过测试。

#### 4.12*: Blog list tests, step5

<!-- Write tests related to creating new blogs via the <i>/api/blogs</i> endpoint, that verify that if the <i>title</i> or <i>url</i> properties are missing from the request data, the backend responds to the request with the status code <i>400 Bad Request</i>.-->
写测试相关于通过<i>/api/blogs</i>端点创建新博客，验证如果请求数据中缺少<i>title</i>或<i>url</i>属性，后端会以状态码<i>400 Bad Request</i>响应请求。

<!-- Make the required changes to the code so that it passes the test.-->
把代码做出必要的更改，使它通过测试。

</div>

<div class="content">

### Refactoring tests

<!-- Our test coverage is currently lacking. Some requests like <i>GET /api/notes/:id</i> and <i>DELETE /api/notes/:id</i> aren''t tested when the request is sent with an invalid id. The grouping and organization of tests could also use some improvement, as all tests exist on the same "top level" in the test file. The readability of the test would improve if we group related tests with <i>describe</i> blocks.-->
我们目前的测试覆盖率不足。当请求以无效ID发送时，像<i>GET /api/notes/:id</i>和<i>DELETE /api/notes/:id</i>这样的请求没有被测试。测试的分组和组织也需要一些改进，因为所有测试都存在于测试文件的同一个“顶级”中。如果我们使用<i>describe</i>块组织相关测试，可以提高测试的可读性。

<!-- Below is an example of the test file after making some minor improvements:-->
以下是经过一些小的改进后的测试文件的示例：

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
      'Browser can execute only JavaScript'
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

    expect(resultNote.body).toEqual(noteToView)
  })

  test('fails with statuscode 404 if note does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()

    await api
      .get(`/api/notes/${validNonexistingId}`)
      .expect(404)
  })

  test('fails with statuscode 400 if id is invalid', async () => {
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

afterAll(async () => {
  await mongoose.connection.close()
})
```

<!-- The test output is grouped according to the <i>describe</i> blocks:-->
测试输出按照<i>描述</i>块进行分组：

![jest output showing grouped describe blocks](../../images/4/7.png)

<!-- There is still room for improvement, but it is time to move forward.-->
还有改进的空间，但是是时候前进了。

<!-- This way of testing the API, by making HTTP requests and inspecting the database with Mongoose, is by no means the only nor the best way of conducting API-level integration tests for server applications. There is no universal best way of writing tests, as it all depends on the application being tested and available resources.-->
这种通过发出HTTP请求并使用Mongoose检查数据库的API测试方法绝不是对服务器应用程序进行API级集成测试的唯一也不是最佳方法。 没有一种最佳的编写测试的方法，因为这取决于正在测试的应用程序和可用资源。

<!-- You can find the code for our current application in its entirety in the <i>part4-6</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-6).-->
您可以在[此GitHub存储库](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-6)的<i>part4-6</i>分支中完整找到我们当前应用程序的代码。

</div>

<div class="tasks">

### Exercises 4.13.-4.14.

#### 4.13 Blog list expansions, step1

<!-- Implement functionality for deleting a single blog post resource.-->
实现删除单个博客文章资源的功能。

<!-- Use the async/await syntax. Follow [RESTful](/en/part3/node_js_and_express#rest) conventions when defining the HTTP API.-->
使用 async/await 语法。在定义 HTTP API 时遵循 [RESTful](/en/part3/node_js_and_express#rest) 规范。

<!-- Implement tests for the functionality.-->
实施功能测试。

#### 4.14 Blog list expansions, step2

<!-- Implement functionality for updating the information of an individual blog post.-->
实现更新单个博客文章信息的功能。

<!-- Use async/await.-->
使用 async/await。

<!-- The application mostly needs to update the number of <i>likes</i> for a blog post. You can implement this functionality the same way that we implemented updating notes in [part 3](/en/part3/saving_data_to_mongo_db#other-operations).-->
应用程序主要需要更新博客文章的<i>喜欢</i>数量。您可以以我们在[第3章节](/en/part3/saving_data_to_mongo_db#other-operations)中实现更新笔记的方式来实现此功能。

<!-- Implement tests for the functionality.-->
实施功能测试。

</div>
