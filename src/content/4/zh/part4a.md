---
mainImage: ../../../images/part-4.svg
part: 4
letter: a
lang: zh
---

<div class="content">


<!-- Let's continue our work on the backend of the notes application we started in [part 3](/en/part3).-->
 让我们继续我们在[第三章节](/en/part3)中开始的笔记应用的后端工作。


### Project structure


<!-- Before we move into the topic of testing, we will modify the structure of our project to adhere to Node.js best practices.-->
 在我们进入测试主题之前，我们将修改我们项目的结构以遵守Node.js的最佳实践。

<!-- After making the changes to the directory structure of our project, we end up with the following structure:-->
 在对我们项目的目录结构进行修改后，我们最终得到以下结构。

```bash
├── index.js
├── app.js
├── build
│   └── ...
├── controllers
│   └── notes.js
├── models
│   └── note.js
├── package-lock.json
├── package.json
├── utils
│   ├── config.js
│   ├── logger.js
│   └── middleware.js
```

<!-- So far we have been using <i>console.log</i> and <i>console.error</i> to print different information from the code.-->
 到目前为止，我们一直使用<i>console.log</i>和<i>console.error</i>来打印代码中的不同信息。
<!-- However, this is not a very good way to do things.-->
 然而，这并不是一个很好的方法。
<!-- Let's separate all printing to the console to its own module <i>utils/logger.js</i>:-->
 让我们把所有打印到控制台的工作分离到自己的模块<i>utils/logger.js</i>。

```js
const info = (...params) => {
  console.log(...params)
}

const error = (...params) => {
  console.error(...params)
}

module.exports = {
  info, error
}
```

<!-- The logger has two functions, __info__ for printing normal log messages, and __error__ for all error messages.-->
 记录器有两个函数，__info__用于打印正常的日志信息，__error__用于所有的错误信息。

<!-- Extracting logging into its own module is a good idea in more ways than one. If we wanted to start writing logs to a file or send them to an external logging service like [graylog](https://www.graylog.org/) or [papertrail](https://papertrailapp.com) we would only have to make changes in one place.-->
 将日志提取到自己的模块中是一个好主意，而且不止一个方面。如果我们想开始将日志写入文件或将它们发送到外部日志服务，如 [graylog](https://www.graylog.org/) 或 [papertrail](https://papertrailapp.com) 我们只需要在一个地方进行修改。

<!-- The contents of the <i>index.js</i> file used for starting the application gets simplified as follows:-->
 用于启动应用的<i>index.js</i>文件的内容被简化如下。

```js
const app = require('./app') // the actual Express application
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')

const server = http.createServer(app)

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
```

<!-- The <i>index.js</i> file only imports the actual application from the <i>app.js</i> file and then starts the application. The function _info_ of the logger-module is used for the console printout telling that the application is running.-->
 <i>index.js</i>文件只从<i>app.js</i>文件中导入实际应用，然后启动应用。logger-module的函数_info_用于控制台打印输出，告诉人们应用正在运行。

<!-- The handling of environment variables is extracted into a separate <i>utils/config.js</i> file:-->
 对环境变量的处理被提取到一个单独的<i>utils/config.js</i>文件中。

```js
require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI

module.exports = {
  MONGODB_URI,
  PORT
}
```

<!-- The other parts of the application can access the environment variables by importing the configuration module:-->
 应用的其他部分可以通过导入配置模块访问环境变量。

```js
const config = require('./utils/config')

logger.info(`Server running on port ${config.PORT}`)
```

<!-- The route handlers have also been moved into a dedicated module. The event handlers of routes are commonly referred to as <i>controllers</i>, and for this reason we have created a new <i>controllers</i> directory. All of the routes related to notes are now in the <i>notes.js</i> module under the <i>controllers</i> directory.-->
 路由处理程序也被移到一个专门的模块中。路由的事件处理程序通常被称为<i>controllers</i>，为此我们创建了一个新的<i>controllers</i>目录。所有与notes相关的路由现在都在<i>controllers</i>目录下的<i>notes.js</i>模块中。

<!-- The contents of the <i>notes.js</i> module are the following:-->
 <i>notes.js</i>模块的内容如下。

```js
const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

notesRouter.get('/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

notesRouter.post('/', (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date()
  })

  note.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => next(error))
})

notesRouter.delete('/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

notesRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

module.exports = notesRouter
```

<!-- This is almost an exact copy-paste of our previous <i>index.js</i> file.-->
这几乎是我们之前的<i>index.js</i>文件的完全复制粘贴。

<!-- However, there are a few significant changes. At the very beginning of the file we create a new [router](http://expressjs.com/en/api.html#router) object:-->
 然而，有几个重要的变化。在文件的最开始，我们创建了一个新的[router](http://expressjs.com/en/api.html#router)对象。

```js
const notesRouter = require('express').Router()

//...

module.exports = notesRouter
```

<!-- The module exports the router to be available for all consumers of the module.-->
 该模块导出了路由器，以便对该模块的所有消费者可用。


<!-- All routes are now defined for the router object, in a similar fashion to what we had previously done with the object representing the entire application.-->
现在所有的路由都是为路由器对象定义的，与我们之前对代表整个应用的对象所做的类似。


<!-- It's worth noting that the paths in the route handlers have shortened. In the previous version, we had:-->
 值得注意的是，路由处理程序中的路径已经缩短。在以前的版本中，我们有。

```js
app.delete('/api/notes/:id', (request, response) => {
```

<!-- And in the current version, we have:-->
 而在当前版本中，我们有。

```js
notesRouter.delete('/:id', (request, response) => {
```

<!-- So what are these router objects exactly? The Express manual provides the following explanation:-->
 那么这些路由器对象到底是什么？Express手册提供了以下解释。

<!-- > <i>A router object is an isolated instance of middleware and routes. You can think of it as a “mini-application,” capable only of performing middleware and routing functions. Every Express application has a built-in app router.</i>-->
 > <i>一个路由器对象是一个孤立的中间件和路由实例。你可以把它看作是一个 "小型应用"，只能够执行中间件和路由功能。每个Express应用都有一个内置的应用路由器。</i>

<!-- The router is in fact a <i>middleware</i>, that can be used for defining "related routes" in a single place, that is typically placed in its own module.-->
 路由器实际上是一个<i>中间件</i>，它可以用来在一个地方定义 "相关的路由"，它通常被放在自己的模块中。

<!-- The <i>app.js</i> file that creates the actual application, takes the router into use as shown below:-->
 创建实际应用的<i>app.js</i>文件使用了路由器，如下所示。

```js
const notesRouter = require('./controllers/notes')
app.use('/api/notes', notesRouter)
```

<!-- The router we defined earlier is used <i>if</i> the URL of the request starts with <i>/api/notes</i>. For this reason, the notesRouter object must only define the relative parts of the routes, i.e. the empty path <i>/</i> or just the parameter <i>/:id</i>.-->
 我们之前定义的路由器被使用，<i>如果</i>请求的URL以<i>/api/notes</i>开头。由于这个原因，notesRouter对象必须只定义路由的相对部分，即空的路径<i>/</i>或只定义参数<i>/:id</i>。


<!-- After making these changes, our <i>app.js</i> file looks like this:-->
 做了这些改动后，我们的<i>app.js</i>文件看起来是这样的。

```js
const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const notesRouter = require('./controllers/notes')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
```

<!-- The file takes different middleware into use, and one of these is the <i>notesRouter</i> that is attached to the <i>/api/notes</i> route.-->
该文件使用了不同的中间件，其中一个是连接到<i>/api/notes</i>路线的<i>notesRouter</i>。

<!-- Our custom middleware has been moved to a new <i>utils/middleware.js</i> module:-->
我们的自定义中间件已经被转移到一个新的<i>utils/middleware.js</i>模块。

```js
const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}
```

<!-- The responsibility of establishing the connection to the database has been given to the  <i>app.js</i> module. The <i>note.js</i> file under the <i>models</i> directory only defines the Mongoose schema for notes.-->
与数据库建立连接的责任已经交给了<i>app.js</i>模块。在<i>models</i>目录下的<i>note.js</i>文件只定义了Mongoose模式的笔记。

```js
const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 5
  },
  date: {
    type: Date,
    required: true,
  },
  important: Boolean,
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema)
```

<!-- To recap, the directory structure looks like this after the changes have been made:-->
 概括地说，目录结构在做了修改后看起来是这样的。

```bash
├── index.js
├── app.js
├── build
│   └── ...
├── controllers
│   └── notes.js
├── models
│   └── note.js
├── package-lock.json
├── package.json
├── utils
│   ├── config.js
│   ├── logger.js
│   └── middleware.js
```

<!-- For smaller applications the structure does not matter that much. Once the application starts to grow in size, you are going to have to establish some kind of structure, and separate the different responsibilities of the application into separate modules. This will make developing the application much easier.-->
 对于较小的应用，这个结构并不重要。一旦应用的规模开始扩大，你就必须建立某种结构，并将应用的不同职责分成独立的模块。这将使应用的开发更加容易。

<!-- There is no strict directory structure or file naming convention that is required for Express applications. To contrast this, Ruby on Rails does require a specific structure. Our current structure simply follows some of the best practices you can come across on the internet.-->
 Express应用没有严格的目录结构或文件命名惯例要求。与此相反，Ruby on Rails确实需要一个特定的结构。我们目前的结构只是简单地遵循了一些你可以在网上看到的最佳实践。

<!-- You can find the code for our current application in its entirety in the <i>part4-1</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-1).-->
 你可以在[这个Github仓库](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-1)的<i>part4-1</i>分支中找到我们当前应用的全部代码。

<!-- If you clone the project for yourself, run the _npm install_ command before starting the application with _npm start_.-->
 如果你为自己克隆了这个项目，在用_npm start_启动应用之前，先运行_npm install_命令。

### Note on exports

<!-- We have used two different kinds of exports in this part. Firstly, eg. the file <i>utils/logger.js</i> does the export as follows:-->
 我们在这部分使用了两种不同的导出方式。首先，例如，文件<i>utils/logger.js</i>做了如下的导出。

```js
const info = (...params) => {
  console.log(...params)
}

const error = (...params) => {
  console.error(...params)
}

// highlight-start
module.exports = {
  info, error
}
// highlight-end
```

<!-- The file exports <i>an object</i> that has two fields, both of which are functions. The functions can be used with two different ways. The first option is to require the whole object and refer to functions through the object using the dot notation:-->
该文件导出了<i>一个对象</i>，该对象有两个字段，都是函数。这些函数可以用两种不同的方式来使用。第一个选项是要求整个对象，并通过对象使用点符号来引用函数。

```js
const logger = require('./utils/logger')

logger.info('message')

logger.error('error message')
```
<!-- The other option is to destructure the functions to its own variables in the <i>require</i> statement:-->
 另一种方法是在<i>require</i>语句中把函数分解成它自己的变量。

```js
const { info, error } = require('./utils/logger')

info('message')
error('error message')
```

<!-- The latter may be preferable way if only small portion of exported functions are used in a file.-->
 如果一个文件中只使用了一小部分导出的函数，后者可能是更好的方式。

<!-- Eg. in file <i>controller/notes.js</i> exporting happens as follows:-->
 例如，在文件<i>controller/notes.js</i>中，导出的情况如下。

```js
const notesRouter = require('express').Router()
const Note = require('../models/note')

// ...

module.exports = notesRouter // highlight-line
```

<!-- In this case there is just one "thing" exported, so the only way to use it is the following:-->
 在这种情况下，只有一个 "东西 "被导出，所以使用它的唯一方法是如下。

```js
const notesRouter = require('./controllers/notes')

// ...

app.use('/api/notes', notesRouter)
```

<!-- Now the exported "thing" (in this case a router object) is assigned to a variable and used as such.-->
 现在，导出的 "东西"(在本例中是一个路由器对象)被分配到一个变量中，并按此使用。

</div>

<div class="tasks">

### Exercises 4.1.-4.2.

<!-- In the exercises for this part we will be building a <i>blog list application</i>, that allows users to save information about interesting blogs they have stumbled across on the internet. For each listed blog we will save the author, title, url, and amount of upvotes from users of the application.-->
 在这部分的练习中，我们将建立一个<i>博客列表应用</i>，它允许用户保存他们在互联网上偶然发现的有趣博客的信息。对于每一个列出的博客，我们将保存作者、标题、网址和应用的用户加注的数量。

#### 4.1 Blog list, step1

<!-- Let's imagine a situation, where you receive an email that contains the following application body:-->
 让我们想象一下，你收到一封电子邮件，其中包含以下应用的主体。

```js
const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

const mongoUrl = 'mongodb://localhost/bloglist'
mongoose.connect(mongoUrl)

app.use(cors())
app.use(express.json())

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

<!-- Turn the application into a functioning <i>npm</i> project. In order to keep your development productive, configure the application to be executed with <i>nodemon</i>. You can create a new database for your application with MongoDB Atlas, or use the same database from the previous part's exercises.-->
 把应用变成一个有效的<i>npm</i>项目。为了保持你的开发成果，将应用配置为用<i>nodemon</i>执行。你可以用MongoDB Atlas为你的应用创建一个新的数据库，或者使用前一部分练习中的同一个数据库。

<!-- Verify that it is possible to add blogs to list with Postman or the VS Code REST client and that the application returns the added blogs at the correct endpoint.-->
 验证是否可以用Postman或VS Code REST客户端将博客添加到列表中，并且应用在正确的端点返回添加的博客。

#### 4.2 Blog list, step2

<!-- Refactor the application into separate modules as shown earlier in this part of the course material.-->
 如本章节教材前面所示，将应用重构为独立的模块。


<!-- **NB** refactor your application in baby steps and verify that the application works after every change you make. If you try to take a "shortcut" by refactoring many things at once, then [Murphy's law](https://en.wikipedia.org/wiki/Murphy%27s_law) will kick in and it is almost certain that something will break in your application. The "shortcut" will end up taking more time than moving forward slowly and systematically.-->
 **NB**以小步快跑的方式重构你的应用，并在你的每一次改动后验证应用是否正常工作。如果你试图通过一次重构很多东西来走 "捷径"，那么[Murphy's law](https://en.wikipedia.org/wiki/Murphy%27s_law)就会启动，几乎可以肯定的是，你的应用中会出现一些问题。这种 "捷径 "最终会比缓慢而系统地前进花费更多时间。


<!-- One best practice is to commit your code every time it is in a stable state. This makes it easy to rollback to a situation where the application still works.-->
 一个最好的做法是在你的代码处于稳定状态时提交它。这使得回滚到应用仍然工作的情况变得容易。

</div>

<div class="content">


### Testing Node applications

<!-- We have completely neglected one essential area of software development, and that is automated testing.-->
 我们完全忽视了软件开发的一个重要领域，那就是自动化测试。

<!-- Let's start our testing journey by looking at unit tests. The logic of our application is so simple, that there is not much that makes sense to test with unit tests. Let's create a new file <i>utils/for_testing.js</i> and write a couple of simple functions that we can use for test writing practice:-->
 让我们从单元测试开始我们的测试之旅。我们的应用的逻辑非常简单，所以用单元测试来测试没有什么意义。让我们创建一个新的文件<i>utils/for_testing.js</i>，并写几个简单的函数，我们可以用来进行测试编写练习。

```js
const reverse = (string) => {
  return string
    .split('')
    .reverse()
    .join('')
}

const average = (array) => {
  const reducer = (sum, item) => {
    return sum + item
  }

  return array.reduce(reducer, 0) / array.length
}

module.exports = {
  reverse,
  average,
}
```

<!-- > The _average_ function uses the array [reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) method. If the method is not familiar to you yet, then now is a good time to watch the first three videos from the [Functional Javascript](https://www.youtube.com/watch?v=BMUiFMZr7vk&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84) series on Youtube.-->
 > _average_函数使用数组[reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)方法。如果你对这个方法还不熟悉，那么现在是观看Youtube上[Functional Javascript](https://www.youtube.com/watch?v=BMUiFMZr7vk&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84)系列的前三个视频的好时机。

<!-- There are many different testing libraries or <i>test runners</i> available for JavaScript. In this course we will be using a testing library developed and used internally by Facebook called [jest](https://jestjs.io/), that resembles the previous king of JavaScript testing libraries [Mocha](https://mochajs.org/).-->
 有许多不同的测试库或<i>测试运行器</i>可用于JavaScript。在本课程中，我们将使用一个由Facebook开发并在内部使用的测试库，名为[jest](https://jestjs.io/)，它与之前的JavaScript测试库之王[Mocha](https://mochajs.org/)很相似。

<!-- Jest is a natural choice for this course, as it works well for testing backends, and it shines when it comes to testing React applications.-->
 Jest是本课程的自然选择，因为它在测试后端时效果很好，而在测试React应用时，它又很出色。

<!-- > <i>**Windows users:**</i> Jest may not work if the path of the project directory contains a directory that has spaces in its name.-->
 > <i>**Windows用户：**</i> 如果项目目录的路径包含一个名称中有空格的目录，Jest可能无法工作。


<!-- Since tests are only executed during the development of our application, we will install <i>jest</i> as a development dependency with the command:-->
 由于测试只在我们的应用的开发过程中执行，我们将用命令安装<i>jest</i>作为开发依赖。

```bash
npm install --save-dev jest
```

<!-- Let's define the <i>npm script _test_</i> to execute tests with Jest and to report about the test execution with the <i>verbose</i> style:-->
 让我们定义<i>npm脚本_test_</i>，用Jest执行测试并以<i>verbose</i>风格报告测试的执行情况。

```bash
{
  //...
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "build:ui": "rm -rf build && cd ../../../2/luento/notes && npm run build && cp -r build ../../../3/luento/notes-backend",
    "deploy": "git push heroku master",
    "deploy:full": "npm run build:ui && git add . && git commit -m uibuild && git push && npm run deploy",
    "logs:prod": "heroku logs --tail",
    "lint": "eslint .",
    "test": "jest --verbose" // highlight-line
  },
  //...
}
```

<!-- Jest requires one to specify that the execution environment is Node. This can be done by adding the following to the end of <i>package.json</i>:-->
 Jest要求人们指定执行环境为Node。这可以通过在<i>package.json</i>的末尾添加以下内容来完成。

```js
{
 //...
 "jest": {
   "testEnvironment": "node"
 }
}
```

<!-- Alternatively, Jest can look for a configuration file with the default name <i>jest.config.js</i>, where we can define the execution environment like this:-->
 或者，Jest可以寻找一个默认名为<i>jest.config.js</i>的配置文件，我们可以像这样定义执行环境。

```js
module.exports = {
  testEnvironment: 'node',
}
```

<!-- Let's create a separate directory for our tests called <i>tests</i> and create a new file called <i>reverse.test.js</i> with the following contents:-->
 让我们为我们的测试创建一个单独的目录，叫做<i>tests</i>，并创建一个新文件，叫做<i>reverse.test.js</i>，内容如下。

```js
const reverse = require('../utils/for_testing').reverse

test('reverse of a', () => {
  const result = reverse('a')

  expect(result).toBe('a')
})

test('reverse of react', () => {
  const result = reverse('react')

  expect(result).toBe('tcaer')
})

test('reverse of releveler', () => {
  const result = reverse('releveler')

  expect(result).toBe('releveler')
})
```

<!-- The ESLint configuration we added to the project in the previous part complains about the _test_ and _expect_ commands in our test file, since the configuration does not allow <i>globals</i>. Let's get rid of the complaints by adding <i>"jest": true</i> to the <i>env</i> property in the <i>.eslintrc.js</i> file.-->
 我们在前一部分添加到项目中的ESLint配置产生警告我们测试文件中的_test_和_expect_命令，因为配置不允许<i>globals</i>。让我们通过在<i>.eslintrc.js</i>文件的<i>env</i>属性中添加<i>"jest": true</i>来摆脱这些产生警告。

```js
module.exports = {
  'env': {
    'commonjs': true,
    'es2021': true,
    'node': true,
    'jest': true, // highlight-line
  },
  'extends': 'eslint:recommended',
  'parserOptions': {
    'ecmaVersion': 12
  },
  "rules": {
    // ...
  },
}
```

<!-- In the first row, the test file imports the function to be tested and assigns it to a variable called _reverse_:-->
 在第一行，测试文件导入了要测试的函数，并将其分配给一个叫做_reverse_的变量。

```js
const reverse = require('../utils/for_testing').reverse
```

<!-- Individual test cases are defined with the _test_ function. The first parameter of the function is the test description as a string. The second parameter is a <i>function</i>, that defines the functionality for the test case. The functionality for the second test case looks like this:-->
 个别测试案例是用_test_函数定义的。该函数的第一个参数是测试描述，是一个字符串。第二个参数是一个<i>函数</i>，它定义了测试案例的功能。第二个测试案例的功能如下所示：

```js
() => {
  const result = reverse('react')

  expect(result).toBe('tcaer')
}
```

<!-- First we execute the code to be tested, meaning that we generate a reverse for the string <i>react</i>. Next we verify the results with the [expect](https://jestjs.io/docs/expect#expectvalue) function. Expect wraps the resulting value into an object that offers a collection of <i>matcher</i> functions, that can be used for verifying the correctness of the result. Since in this test case we are comparing two strings, we can use the [toBe](https://jestjs.io/docs/expect#tobevalue) matcher.-->
 首先我们执行要测试的代码，也就是说，我们为字符串<i>react</i>生成一个反向。接下来我们用[expect](https://jestjs.io/docs/expect#expectvalue)函数验证结果。Expect将结果值包装成一个提供<i>matcher</i>函数集合的对象，可用于验证结果的正确性。因为在这个测试案例中，我们要比较两个字符串，我们可以使用[toBe](https://jestjs.io/docs/expect#tobevalue)匹配器。

<!-- As expected, all of the tests pass:-->
 正如预期，所有的测试都通过了。

![](../../images/4/1x.png)

<!-- Jest expects by default that the names of test files contain <i>.test</i>. In this course, we will follow the convention of naming our tests files with the extension <i>.test.js</i>.-->
 Jest默认期望测试文件的名称包含<i>.test</i>。在本课程中，我们将遵循惯例，用扩展名<i>.test.js</i>来命名我们的测试文件。

<!-- Jest has excellent error messages, let's break the test to demonstrate this:-->
 Jest有很好的错误信息，让我们打破测试来证明这一点。

```js
test('palindrome of react', () => {
  const result = reverse('react')

  expect(result).toBe('tkaer')
})
```

<!-- Running the tests above results in the following error message:-->
 运行上面的测试会出现以下错误信息。

![](../../images/4/2x.png)

<!-- Let's add a few tests for the _average_ function, into a new file <i>tests/average.test.js</i>.-->
 让我们为_average_函数添加一些测试，放入一个新文件<i>tests/average.test.js</i>。

```js
const average = require('../utils/for_testing').average

describe('average', () => {
  test('of one value is the value itself', () => {
    expect(average([1])).toBe(1)
  })

  test('of many is calculated right', () => {
    expect(average([1, 2, 3, 4, 5, 6])).toBe(3.5)
  })

  test('of empty array is zero', () => {
    expect(average([])).toBe(0)
  })
})
```

<!-- The test reveals that the function does not work correctly with an empty array (this is because in JavaScript dividing by zero results in <i>NaN</i>):-->
 测试显示，该函数在空数组中不能正常工作（这是因为在JavaScript中，除以0的结果是<i>NaN</i>）。

![](../../images/4/3.png)

<!-- Fixing the function is quite easy:-->
 修复这个函数是很容易的。

```js
const average = array => {
  const reducer = (sum, item) => {
    return sum + item
  }

  return array.length === 0
    ? 0
    : array.reduce(reducer, 0) / array.length
}
```


<!-- If the length of the array is 0 then we return 0, and in all other cases we use the _reduce_ method to calculate the average.-->
 如果数组的长度是0，那么我们返回0，在所有其他情况下，我们使用_reduce_方法来计算平均值。


<!-- There are a few things to notice about the tests that we just wrote. We defined a <i>describe</i> block around the tests that was given the name _average_:-->
 关于我们刚刚写的测试，有几件事需要注意。我们在测试周围定义了一个<i>describe</i>块，它被命名为_average_。

```js
describe('average', () => {
  // tests
})
```

<!-- Describe blocks can be used for grouping tests into logical collections. The test output of Jest also uses the name of the describe block:-->
 描述块可用于将测试分组为逻辑集合。Jest的测试输出也使用描述块的名称。

![](../../images/4/4x.png)

<!-- As we will see later on <i>describe</i> blocks are necessary when we want to run some shared setup or teardown operations for a group of tests.-->
 正如我们稍后将看到的 <i>describe</i> 块是必要的，当我们想为一组测试运行一些共享的设置或拆分操作。

<!-- Another thing to notice is that we wrote the tests in quite a compact way, without assigning the output of the function being tested to a variable:-->
 另一件要注意的事情是，我们以相当紧凑的方式写了测试，没有把被测试的函数的输出分配给一个变量。

```js
test('of empty array is zero', () => {
  expect(average([])).toBe(0)
})
```

</div>

<div class="tasks">


### Exercises 4.3.-4.7.


<!-- Let's create a collection of helper functions that are meant to assist dealing with the blog list. Create the functions into a file called <i>utils/list_helper.js</i>. Write your tests into an appropriately named test file under the <i>tests</i> directory.-->
 让我们创建一个辅助函数的集合，旨在帮助处理博客列表。将这些函数创建为一个名为<i>utils/list_helper.js</i>的文件。把你的测试写进<i>tests</i>目录下一个适当命名的测试文件。


#### 4.3: helper functions and unit tests, step1


<!-- First define a _dummy_ function that receives an array of blog posts as a parameter and always returns the value 1. The contents of the <i>list_helper.js</i> file at this point should be the following:-->
 首先定义一个_dummy_函数，接收一个博客文章的数组作为参数，并总是返回值1。此时<i>list_helper.js</i>文件的内容应该是这样的。

```js
const dummy = (blogs) => {
  // ...
}

module.exports = {
  dummy
}
```


<!-- Verify that your test configuration works with the following test:-->
 通过以下测试验证你的测试配置是否有效。

```js
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})
```


#### 4.4: helper functions and unit tests, step2


<!-- Define a new _totalLikes_ function that receives a list of blog posts as a parameter. The function returns the total sum of <i>likes</i> in all of the blog posts.-->
 定义一个新的_totalLikes_函数，接收一个博客文章的列表作为参数。该函数返回所有博客文章中的<i>likes</i>的总和。


<!-- Write appropriate tests for the function. It's recommended to put the tests inside of a <i>describe</i> block, so that the test report output gets grouped nicely:-->
 为该函数编写适当的测试。建议将测试放在<i>describe</i>块内，这样测试报告的输出就会被很好地分组。

![](../../images/4/5.png)


<!-- Defining test inputs for the function can be done like this:-->
 定义函数的测试输入可以这样做。

```js
describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })
})
```

<!-- If defining your own test input list of blogs is too much work, you can use the ready-made list [here](https://raw.githubusercontent.com/fullstack-hy2020/misc/master/blogs_for_test.md).-->
 如果定义你自己的测试输入列表的博客是太多的工作，你可以使用现成的列表[这里](https://raw.githubusercontent.com/fullstack-hy2020/misc/master/blogs_for_test.md)。

<!-- You are bound to run into problems while writing tests. Remember the things that we learned about [debugging](/en/part3/saving_data_to_mongo_db#debugging-node-applications) in part 3. You can print things to the console with _console.log_ even during test execution. It is even possible to use the debugger while running tests, you can find instructions for that [here](https://jestjs.io/docs/en/troubleshooting).-->
在编写测试时，你一定会遇到问题。记住我们在第三章节学到的关于[调试](/en/part3/saving_data_to_mongo_db#debugging-node-applications)的东西。你可以用_console.log_打印东西到控制台，甚至在测试执行期间。甚至可以在运行测试时使用调试器，你可以找到这方面的说明[这里](https://jestjs.io/docs/en/troubleshooting)。

<!-- **NB:** if some test is failing, then it is recommended to only run that test while you are fixing the issue. You can run a single test with the [only](https://jestjs.io/docs/api#testonlyname-fn-timeout) method.-->
 **NB:** 如果某些测试失败了，那么建议在修复问题的时候只运行该测试。你可以用[only](https://jestjs.io/docs/api#testonlyname-fn-timeout)的方法运行一个测试。

<!-- Another way of running a single test (or describe block) is to specify the name of the test to be run with the [-t](https://jestjs.io/docs/en/cli.html) flag:-->
 运行单个测试（或描述块）的另一种方法是用[-t](https://jestjs.io/docs/en/cli.html)标志指定要运行的测试的名称。

```js
npm test -- -t 'when list has only one blog, equals the likes of that'
```

#### 4.5*: helper functions and unit tests, step3

<!-- Define a new _favoriteBlog_ function that receives a list of blogs as a parameter. The function finds out which blog has most likes. If there are many top favorites, it is enough to return one of them.-->
 定义一个新的_favoriteBlog_函数，接收一个博客列表作为参数。该函数找出哪个博客有最多的喜欢。如果有许多最喜欢的博客，只需返回其中的一个就够了。

<!-- The value returned by the function could be in the following format:-->
 该函数返回的值可以是以下格式。

```js
{
  title: "Canonical string reduction",
  author: "Edsger W. Dijkstra",
  likes: 12
}
```

<!-- **NB** when you are comparing objects, the [toEqual](https://jestjs.io/docs/en/expect#toequalvalue) method is probably what you want to use, since the [toBe](https://jestjs.io/docs/en/expect#tobevalue) tries to verify that the two values are the same value, and not just that they contain the same properties.-->
 **NB*当你比较对象时，[toEqual](https://jestjs.io/docs/en/expect#toequalvalue)方法可能是你想使用的，因为[toBe](https://jestjs.io/docs/en/expect#tobevalue)试图验证两个值是相同的值，而不仅仅是它们包含相同的属性。

<!-- Write the tests for this exercise inside of a new <i>describe</i> block. Do the same for the remaining exercises as well.-->
 把这个练习的测试写在一个新的<i>describe</i>块中。对其余的练习也要这样做。

#### 4.6*: helper functions and unit tests, step4

<!-- This and the next exercise are a little bit more challenging. Finishing these two exercises is not required in order to advance in the course material, so it may be a good idea to return to these once you're done going through the material for this part in its entirety.-->
 这个和下一个练习有点儿难度。完成这两个练习并不要求在课程材料中取得进展，所以当你完成这部分的全部材料后，再回到这两个练习中来可能是一个好主意。

<!-- Finishing this exercise can be done without the use of additional libraries. However, this exercise is a great opportunity to learn how to use the [Lodash](https://lodash.com/) library.-->
完成这个练习可以不使用额外的库。然而，这个练习是一个学习如何使用[Lodash](https://lodash.com/)库的好机会。

<!-- Define a function called _mostBlogs_ that receives an array of blogs as a parameter. The function returns the <i>author</i> who has the largest amount of blogs. The return value also contains the number of blogs the top author has:-->
 定义一个名为_mostBlogs_的函数，接收一个博客数组作为参数。该函数返回拥有最大数量博客的<i>作者</i>。返回值还包含顶级作者拥有的博客数量。

```js
{
  author: "Robert C. Martin",
  blogs: 3
}
```

<!-- If there are many top bloggers, then it is enough to return any one of them.-->
 如果有很多顶级博客，那么返回其中任何一个即可。

#### 4.7*: helper functions and unit tests, step5


<!-- Define a function called _mostLikes_ that receives an array of blogs as its parameter. The function returns the author, whose blog posts have the largest amount of likes. The return value also contains the total number of likes that the author has received:-->
 定义一个名为_mostLikes_的函数，接收一个博客数组作为其参数。该函数返回作者，他的博客文章拥有最大数量的喜欢。返回值也包含了该作者收到的喜欢的总数。

```js
{
  author: "Edsger W. Dijkstra",
  likes: 17
}
```

<!-- If there are many top bloggers, then it is enough to show any one of them.-->
 如果有很多顶级博客，那么显示其中任何一个就足够了。

</div>
