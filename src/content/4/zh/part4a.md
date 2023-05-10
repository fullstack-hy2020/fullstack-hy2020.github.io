---
mainImage: ../../../images/part-4.svg
part: 4
letter: a
lang: zh
---

<div class="content">

<!-- Let''s continue our work on the backend of the notes application we started in [part 3](/en/part3).-->
让我们继续我们在[第三部分](/en/part3)开始的笔记应用程序的后端工作。

### Project structure

<!-- Before we move into the topic of testing, we will modify the structure of our project to adhere to Node.js best practices.-->
在我们进入测试主题之前，我们将修改我们项目的结构，以符合Node.js最佳实践。

<!-- After making the changes to the directory structure of our project, we end up with the following structure:-->
在对我们项目的目录结构做出更改之后，我们最终得到了以下结构：

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
所以迄今为止，我们一直在使用<i>console.log</i>和<i>console.error</i>来打印代码中的不同信息。
<!-- However, this is not a very good way to do things.-->
但是，这不是一个很好的做事方式。
<!-- Let''s separate all printing to the console to its own module <i>utils/logger.js</i>:-->
让我们把所有的打印到控制台的内容都放到它自己的模块<i>utils/logger.js</i>中：

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
日志记录器有两个功能，__info__ 用于打印正常的日志消息，__error__ 用于所有错误消息。

<!-- Extracting logging into its own module is a good idea in more ways than one. If we wanted to start writing logs to a file or send them to an external logging service like [graylog](https://www.graylog.org/) or [papertrail](https://papertrailapp.com) we would only have to make changes in one place.-->
把日志提取到单独的模块是一个很好的主意，不止是一个方面。如果我们想开始将日志写入文件或发送到外部日志服务，比如[graylog](https://www.graylog.org/) 或 [papertrail](https://papertrailapp.com)，我们只需要在一个地方做出更改即可。

<!-- The contents of the <i>index.js</i> file used for starting the application gets simplified as follows:-->
<i>index.js</i> 文件用于启动应用程序的内容如下简化：

```js
const app = require('./app') // the actual Express application
const config = require('./utils/config')
const logger = require('./utils/logger')

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
```

<!-- The <i>index.js</i> file only imports the actual application from the <i>app.js</i> file and then starts the application. The function _info_ of the logger-module is used for the console printout telling that the application is running.-->
<i>index.js</i> 文件只是从 <i>app.js</i> 文件中导入实际的应用程序，然后启动应用程序。logger-module 的 _info_ 函数用于控制台打印，提示应用程序正在运行。

<!-- Now the Express app and the code taking care of the web server are separated from each other following the [best](https://dev.to/nermineslimane/always-separate-app-and-server-files--1nc7) [practices](https://nodejsbestpractices.com/sections/projectstructre/separateexpress). One of the advantages of this method is that the application can now be tested at the level of HTTP API calls without actually making calls via HTTP over the network, this makes the execution of tests faster.-->
现在，按照[最佳](https://dev.to/nermineslimane/always-separate-app-and-server-files--1nc7) [实践](https://nodejsbestpractices.com/sections/projectstructre/separateexpress)，Express 应用程序和处理 Web 服务器的代码已经分离开来。这种方法的一个优点是，应用程序现在可以通过 HTTP API 调用进行测试，而无需实际通过网络发出 HTTP 调用，这使得测试的执行更快。

<!-- The handling of environment variables is extracted into a separate <i>utils/config.js</i> file:-->
将环境变量的处理提取到单独的<i>utils/config.js</i>文件中：

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
其他部分的应用程序可以通过导入配置模块来访问环境变量：

```js
const config = require('./utils/config')

logger.info(`Server running on port ${config.PORT}`)
```

<!-- The route handlers have also been moved into a dedicated module. The event handlers of routes are commonly referred to as <i>controllers</i>, and for this reason we have created a new <i>controllers</i> directory. All of the routes related to notes are now in the <i>notes.js</i> module under the <i>controllers</i> directory.-->
路由处理程序也已经移动到一个专用模块中。路由的事件处理程序通常被称为<i>控制器</i>，因此我们创建了一个新的<i>控制器</i>目录。所有与笔记相关的路由现在都在<i>controllers</i>目录下的<i>notes.js</i>模块中。

<!-- The contents of the <i>notes.js</i> module are the following:-->
<i>notes.js</i> 模块的内容如下：

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
这几乎是我们之前的<i>index.js</i>文件的精确复制粘贴。

<!-- However, there are a few significant changes. At the very beginning of the file we create a new [router](http://expressjs.com/en/api.html#router) object:-->
然而，有一些重大变化。在文件的开头，我们创建一个新的[路由器](http://expressjs.com/en/api.html#router)对象：

```js
const notesRouter = require('express').Router()

//...

module.exports = notesRouter
```

<!-- The module exports the router to be available for all consumers of the module.-->
模块导出路由以供模块的所有消费者使用。

<!-- All routes are now defined for the router object, similar to what did before with the object representing the entire application.-->
现在为路由对象定义了所有路由，与之前用来表示整个应用程序的对象类似。

<!-- It''s worth noting that the paths in the route handlers have shortened. In the previous version, we had:-->
在路由处理程序中，值得注意的是路径已经缩短了。在之前的版本中，我们有：

```js
app.delete('/api/notes/:id', (request, response) => {
```

<!-- And in the current version, we have:-->
在目前的版本中，我们有：

```js
notesRouter.delete('/:id', (request, response) => {
```

<!-- So what are these router objects exactly? The Express manual provides the following explanation:-->
那么这些路由对象到底是什么呢？Express 手册提供了以下解释：

<!-- > <i>A router object is an isolated instance of middleware and routes. You can think of it as a “mini-application,” capable only of performing middleware and routing functions. Every Express application has a built-in app router.</i>-->
> <i>路由器对象是中间件和路由的孤立实例。你可以把它想象成一个“小型应用程序”，仅能执行中间件和路由功能。每个Express应用程序都有一个内置的应用程序路由器。</i>

<!-- The router is in fact a <i>middleware</i>, that can be used for defining "related routes" in a single place, which is typically placed in its own module.-->
路由器实际上是一种<i>中间件</i>，可用于在单个位置定义“相关路由”，通常放置在自己的模块中。

<!-- The <i>app.js</i> file that creates the actual application takes the router into use as shown below:-->
<i>app.js</i> 文件创建实际应用程序如下所示使用路由：

```js
const notesRouter = require('./controllers/notes')
app.use('/api/notes', notesRouter)
```

<!-- The router we defined earlier is used <i>if</i> the URL of the request starts with <i>/api/notes</i>. For this reason, the notesRouter object must only define the relative parts of the routes, i.e. the empty path <i>/</i> or just the parameter <i>/:id</i>.-->
我们之前定义的路由器会在请求的URL以<i>/api/notes</i>开头时使用。因此，notesRouter对象必须只定义相对路径的部分，即空路径<i>/</i>或仅参数<i>/:id</i>。

<!-- After making these changes, our <i>app.js</i> file looks like this:-->
在做出這些更改後，我們的<i>app.js</i>檔案會長這樣：

```js
const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const notesRouter = require('./controllers/notes')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

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
文件使用不同的中间件，其中之一是附加到<i>/api/notes</i>路由的<i>notesRouter</i>。

<!-- Our custom middleware has been moved to a new <i>utils/middleware.js</i> module:-->
我们的自定义中间件已经移动到一个新的<i>utils/middleware.js</i>模块：

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
<i>app.js</i> 模块被赋予建立到数据库的连接的责任。<i>models</i> 目录下的 <i>note.js</i> 文件只定义了 Mongoose 的 notes 模式。

```js
const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 5
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
总结一下，在做出更改后，目录结构如下：

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

<!-- For smaller applications, the structure does not matter that much. Once the application starts to grow in size, you are going to have to establish some kind of structure and separate the different responsibilities of the application into separate modules. This will make developing the application much easier.-->
对于较小的应用，结构并不是那么重要。一旦应用开始变大，你就必须建立一些结构，将应用的不同职责分离到不同的模块中。这将使开发应用变得容易得多。

<!-- There is no strict directory structure or file naming convention that is required for Express applications. In contrast, Ruby on Rails does require a specific structure. Our current structure simply follows some of the best practices you can come across on the internet.-->
没有严格的目录结构或文件命名约定是必须的Express应用程序。相反，Ruby on Rails确实需要一个特定的结构。我们目前的结构只是遵循一些你可以在互联网上找到的最佳实践。

<!-- You can find the code for our current application in its entirety in the <i>part4-1</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-1).-->
您可以在[此GitHub存储库](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-1)的<i>part4-1</i>分支中找到我们当前应用程序的完整代码。

<!-- If you clone the project for yourself, run the _npm install_ command before starting the application with _npm start_.-->
如果你为自己克隆了这个项目，在用`npm start`启动应用程序前，请先运行`npm install`命令。

### Note on exports

<!-- We have used two different kinds of exports in this part. Firstly, e.g. the file <i>utils/logger.js</i> does the export as follows:-->
我们在这部分已经使用了两种不同的导出方式。首先，例如文件<i>utils/logger.js</i>的导出如下：

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

<!-- The file exports <i>an object</i> that has two fields, both of which are functions. The functions can be used in two different ways. The first option is to require the whole object and refer to functions through the object using the dot notation:-->
文件輸出<i>一個對象</i>，該對象具有兩個字段，兩個字段均為函數。這些函數可以以兩種不同的方式使用。第一個選項是需要整個對象，並通過對象使用點記法引用函數：

```js
const logger = require('./utils/logger')

logger.info('message')

logger.error('error message')
```

<!-- The other option is to destructure the functions to their own variables in the <i>require</i> statement:-->
另一个选择是在<i>require</i>语句中将函数拆分到自己的变量中：

```js
const { info, error } = require('./utils/logger')

info('message')
error('error message')
```

<!-- The second way of of exporting may be preferable if only a small portion of the exported functions are used in a file.  E.g. in file <i>controller/notes.js</i> exporting happens as follows:-->
第二种导出方式可能更可取，如果只有导出函数的一小部分在文件中使用。例如，在文件<i>controller/notes.js</i>中的导出如下所示：

```js
const notesRouter = require('express').Router()
const Note = require('../models/note')

// ...

module.exports = notesRouter // highlight-line
```

<!-- In this case, there is just one "thing" exported, so the only way to use it is the following:-->
在这种情况下，只有一个“东西”被导出，所以唯一的使用方式是：

```js
const notesRouter = require('./controllers/notes')

// ...

app.use('/api/notes', notesRouter)
```

<!-- Now the exported "thing" (in this case a router object) is assigned to a variable and used as such.-->
现在，已导出的“事物”（在本例中是一个路由器对象）被分配给一个变量，并作为这样使用。

</div>

<div class="tasks">

### Exercises 4.1.-4.2.

<!-- In the exercises for this part, we will be building a <i>blog list application</i>, that allows users to save information about interesting blogs they have stumbled across on the internet. For each listed blog we will save the author, title, URL, and amount of upvotes from users of the application.-->
在本部分的练习中，我们将构建一个<i>博客列表应用程序</i>，允许用户保存有关他们在互联网上偶然发现的有趣博客的信息。对于每个列出的博客，我们将保存作者，标题，URL和应用程序用户的投票数量。

#### 4.1 Blog list, step1

<!-- Let''s imagine a situation, where you receive an email that contains the following application body:-->
让我们想象一个场景，你收到一封电子邮件，其中包含以下申请内容：

```js
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

<!-- Turn the application into a functioning <i>npm</i> project. To keep your development productive, configure the application to be executed with <i>nodemon</i>. You can create a new database for your application with MongoDB Atlas, or use the same database from the previous part''s exercises.-->
将应用程序转换为功能<i>npm</i>项目。为了保持您的开发效率，请配置应用程序以<i>nodemon</i>执行。您可以使用MongoDB Atlas为您的应用程序创建一个新的数据库，或者使用前一部分练习中的相同数据库。

<!-- Verify that it is possible to add blogs to the list with Postman or the VS Code REST client and that the application returns the added blogs at the correct endpoint.-->
验证可以使用Postman或VS Code REST客户端将博客添加到列表中，并且应用程序在正确的端点返回添加的博客。

#### 4.2 Blog list, step2

<!-- Refactor the application into separate modules as shown earlier in this part of the course material.-->
重构应用程序，将其拆分为如本课程材料中所示的独立模块。

<!-- **NB** refactor your application in baby steps and verify that the application works after every change you make. If you try to take a "shortcut" by refactoring many things at once, then [Murphy''s law](https://en.wikipedia.org/wiki/Murphy%27s_law) will kick in and it is almost certain that something will break in your application. The "shortcut" will end up taking more time than moving forward slowly and systematically.-->
**NB** 逐步重构你的应用程序，并在每次更改后验证应用程序是否正常工作。如果你试图采取“捷径”，一次重构很多东西，那么[墨菲定律](https://en.wikipedia.org/wiki/Murphy%27s_law)就会生效，几乎可以肯定应用程序会出现问题。“捷径”最终会比慢慢前进花费更多的时间。

<!-- One best practice is to commit your code every time it is in a stable state. This makes it easy to rollback to a situation where the application still works.-->
一个最佳实践是每次代码处于稳定状态时就提交它。这样可以轻松回滚到应用程序仍然有效的情况。

</div>

<div class="content">

### Testing Node applications

<!-- We have completely neglected one essential area of software development, and that is automated testing.-->
我们完全忽略了软件开发中一个重要领域，那就是自动化测试。

<!-- Let's start our testing journey by looking at unit tests. The logic of our application is so simple, that there is not much that makes sense to test with unit tests. Let's create a new file <i>utils/for_testing.js</i> and write a couple of simple functions that we can use for test writing practice:-->
让我们从单元测试开始我们的测试之旅。我们应用程序的逻辑是如此简单，以至于没有太多东西可以用单元测试来测试。让我们创建一个新文件<i>utils/for_testing.js</i>，并编写一些简单的函数，我们可以用它们来练习写测试：

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

<!-- > The _average_ function uses the array [reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) method. If the method is not familiar to you yet, then now is a good time to watch the first three videos from the [Functional Javascript](https://www.youtube.com/watch?v=BMUiFMZr7vk&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84) series on YouTube.-->
> _平均值_ 函数使用数组 [reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) 方法。如果这种方法对你还不太熟悉，那么现在是一个很好的时间去观看 YouTube 上的 [Functional Javascript](https://www.youtube.com/watch?v=BMUiFMZr7vk&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84) 系列的前三个视频。

<!-- There are many different testing libraries or <i>test runners</i> available for JavaScript. In this course we will be using a testing library developed and used internally by Facebook called [jest](https://jestjs.io/), which resembles the previous king of JavaScript testing libraries [Mocha](https://mochajs.org/).-->
有許多不同的測試庫或<i>測試執行器</i>可用於JavaScript。在本課程中，我們將使用由Facebook內部開發並使用的測試庫[jest](https://jestjs.io/)，它類似於以前的JavaScript測試庫[Mocha](https://mochajs.org/)之王。

<!-- Jest is a natural choice for this course, as it works well for testing backends, and it shines when it comes to testing React applications.-->
Jest是这门课程的自然之选，因为它很适合测试后端，而且在测试React应用程序时表现更出色。

<!-- > <i>**Windows users:**</i> Jest may not work if the path of the project directory contains a directory that has spaces in its name.-->
<i>**Windows 用户：**</i> 如果项目目录路径中包含名称中有空格的目录，Jest 可能无法正常工作。

<!-- Since tests are only executed during the development of our application, we will install <i>jest</i> as a development dependency with the command:-->
自从测试只在我们应用程序的开发过程中执行，我们将使用命令安装 <i>jest</i> 作为开发依赖项：

```bash
npm install --save-dev jest
```

<!-- Let''s define the <i>npm script _test_</i> to execute tests with Jest and to report about the test execution with the <i>verbose</i> style:-->
让我们定义 <i>npm 脚本 _test_</i> 来使用 Jest 执行测试，并以 <i>详细</i> 样式报告测试执行情况：

```bash
{
  //...
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "build:ui": "rm -rf build && cd ../frontend/ && npm run build && cp -r build ../backend",
    "deploy": "fly deploy",
    "deploy:full": "npm run build:ui && npm run deploy",
    "logs:prod": "fly logs",
    "lint": "eslint .",
    "test": "jest --verbose" // highlight-line
  },
  //...
}
```

<!-- Jest requires one to specify that the execution environment is Node. This can be done by adding the following to the end of <i>package.json</i>:-->
在<i>package.json</i>文件末尾添加以下内容可以指定Jest的执行环境是Node：

```js
{
 //...
 "jest": {
   "testEnvironment": "node"
 }
}
```

<!-- Let''s create a separate directory for our tests called <i>tests</i> and create a new file called <i>reverse.test.js</i> with the following contents:-->
让我们为我们的测试创建一个单独的目录叫<i>tests</i>，并创建一个新文件叫<i>reverse.test.js</i>，内容如下：

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

<!-- The ESLint configuration we added to the project in the previous part complains about the _test_ and _expect_ commands in our test file since the configuration does not allow <i>globals</i>. Let''s get rid of the complaints by adding <i>"jest": true</i> to the <i>env</i> property in the <i>.eslintrc.js</i> file.-->
在前一部分中，我们添加到项目中的ESLint配置会对我们测试文件中的_test_和_expect_命令报出警告，因为该配置不允许使用<i>全局变量</i>。让我们通过在<i>.eslintrc.js</i>文件中的<i>env</i>属性中添加<i>"jest": true</i>来消除这些警告。

```js
module.exports = {
  'env': {
    'commonjs': true,
    'es2021': true,
    'node': true,
    'jest': true, // highlight-line
  },
  // ...
}
```

<!-- In the first row, the test file imports the function to be tested and assigns it to a variable called _reverse_:-->
在第一行，测试文件导入要测试的函数，并将其分配给名为_reverse_的变量：

```js
const reverse = require('../utils/for_testing').reverse
```

<!-- Individual test cases are defined with the _test_ function. The first parameter of the function is the test description as a string. The second parameter is a <i>function</i>, that defines the functionality for the test case. The functionality for the second test case looks like this:-->
单独的测试用例用_test_函数定义。函数的第一个参数是作为字符串的测试描述。第二个参数是一个<i>函数</i>，它定义了测试用例的功能。第二个测试用例的功能看起来像这样：

```js
() => {
  const result = reverse('react')

  expect(result).toBe('tcaer')
}
```

<!-- First, we execute the code to be tested, meaning that we generate a reverse for the string <i>react</i>. Next, we verify the results with the [expect](https://jestjs.io/docs/expect#expectvalue) function. Expect wraps the resulting value into an object that offers a collection of <i>matcher</i> functions, that can be used for verifying the correctness of the result. Since in this test case we are comparing two strings, we can use the [toBe](https://jestjs.io/docs/expect#tobevalue) matcher.-->
首先，我们执行要测试的代码，也就是我们为字符串<i>react</i>生成一个反转。接下来，我们用[expect](https://jestjs.io/docs/expect#expectvalue)函数来验证结果。Expect将结果值封装到一个对象中，该对象提供了一系列的<i>matcher</i>函数，可用于验证结果的正确性。由于在这个测试用例中我们正在比较两个字符串，我们可以使用[toBe](https://jestjs.io/docs/expect#tobevalue) matcher。

<!-- As expected, all of the tests pass:-->
按预期，所有的测试都通过了：

![terminal output from npm test](../../images/4/1x.png)

<!-- Jest expects by default that the names of test files contain <i>.test</i>. In this course, we will follow the convention of naming our tests files with the extension <i>.test.js</i>.-->
Jest 默认期望测试文件的名字包含 <i>.test</i>。 在这个课程中，我们将遵循以 <i>.test.js</i> 为扩展名命名我们的测试文件的约定。

<!-- Jest has excellent error messages, let''s break the test to demonstrate this:-->
Jest有出色的错误消息，让我们打破测试来证明这一点：

```js
test('palindrome of react', () => {
  const result = reverse('react')

  expect(result).toBe('tkaer')
})
```

<!-- Running the tests above results in the following error message:-->
运行上述测试会得到以下错误消息：

![terminal output shows failure from npm test](../../images/4/2x.png)

<!-- Let''s add a few tests for the _average_ function, into a new file <i>tests/average.test.js</i>.-->
让我们在一个新的文件<i>tests/average.test.js</i>中为_average_函数添加几个测试。

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
测试表明，对于一个空数组，该函数的工作不正确（这是因为在JavaScript中除以零会导致<i>NaN</i>）：

![terminal output showing empty array fails with jest](../../images/4/3.png)

<!-- Fixing the function is quite easy:-->
修复这个功能相当容易：

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

<!-- If the length of the array is 0 then we return 0, and in all other cases, we use the _reduce_ method to calculate the average.-->
如果数组的长度为0，那么我们返回0，在其他所有情况下，我们使用_reduce_方法来计算平均值。

<!-- There are a few things to notice about the tests that we just wrote. We defined a <i>describe</i> block around the tests that were given the name _average_:-->
有几件事需要注意我们刚刚编写的测试。 我们在给定名称_average_的测试周围定义了一个<i>describe</i>块：

```js
describe('average', () => {
  // tests
})
```

<!-- Describe blocks can be used for grouping tests into logical collections. The test output of Jest also uses the name of the describe block:-->
描述块可用于将测试分组到逻辑集合中。 Jest的测试输出也使用描述块的名称：

![screenshot of npm test showing describe blocks](../../images/4/4x.png)

<!-- As we will see later on <i>describe</i> blocks are necessary when we want to run some shared setup or teardown operations for a group of tests.-->
<i>晚些时候，我们会看到，当我们想要为一组测试运行一些共享的初始化或清理操作时，描述块是必要的。</i>

<!-- Another thing to notice is that we wrote the tests in quite a compact way, without assigning the output of the function being tested to a variable:-->
另一件值得注意的是，我们以相当紧凑的方式编写了测试，而无需将被测函数的输出分配给变量：

```js
test('of empty array is zero', () => {
  expect(average([])).toBe(0)
})
```

</div>

<div class="tasks">

### Exercises 4.3.-4.7.

<!-- Let''s create a collection of helper functions that are meant to assist in dealing with the blog list. Create the functions into a file called <i>utils/list_helper.js</i>. Write your tests into an appropriately named test file under the <i>tests</i> directory.-->
让我们创建一组辅助函数，旨在帮助处理博客列表。将函数创建到一个名为<i>utils/list_helper.js</i>的文件中。将测试写入<i>tests</i>目录下的适当命名的测试文件中。

#### 4.3: helper functions and unit tests, step1

<!-- First, define a _dummy_ function that receives an array of blog posts as a parameter and always returns the value 1. The contents of the <i>list_helper.js</i> file at this point should be the following:-->
首先，定义一个接收一个博客帖子数组作为参数并总是返回值1的_虚拟_函数。此时<i>list_helper.js</i>文件的内容应该如下：
```
function dummy(posts) {
  return 1;
}
```

```js
const dummy = (blogs) => {
  // ...
}

module.exports = {
  dummy
}
```

<!-- Verify that your test configuration works with the following test:-->
确认您的测试配置是否能够通过以下测试：

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
定义一个新的_totalLikes_函数，它接收一个博客帖子列表作为参数。该函数返回所有博客帖子中<i>likes</i>的总和。

<!-- Write appropriate tests for the function. It''s recommended to put the tests inside of a <i>describe</i> block so that the test report output gets grouped nicely:-->
写适当的测试用例来测试该函数，建议将测试用例放在<i>describe</i>块中，以便测试报告输出得到良好的分组：

![npm test passing for list_helper_test](../../images/4/5.png)

<!-- Defining test inputs for the function can be done like this:-->
定义函数的测试输入可以这样做：

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
如果定义自己的测试输入博客列表太费劲了，你可以使用[这里](https://raw.githubusercontent.com/fullstack-hy2020/misc/master/blogs_for_test.md)提供的现成列表。

<!-- You are bound to run into problems while writing tests. Remember the things that we learned about [debugging](/en/part3/saving_data_to_mongo_db#debugging-node-applications) in part 3. You can print things to the console with _console.log_ even during test execution. It is even possible to use the debugger while running tests, you can find instructions for that [here](https://jestjs.io/docs/en/troubleshooting).-->
你在写测试的时候肯定会遇到问题。记住我们在第三部分学到的关于[调试](/en/part3/saving_data_to_mongo_db#debugging-node-applications)的东西。你可以使用_console.log_在测试执行期间打印东西到控制台。甚至可以在运行测试时使用调试器，你可以在[这里](https://jestjs.io/docs/en/troubleshooting)找到相关的指示。

<!-- **NB:** if some test is failing, then it is recommended to only run that test while you are fixing the issue. You can run a single test with the [only](https://jestjs.io/docs/api#testonlyname-fn-timeout) method.-->
如果某些测试失败，建议只在修复问题时运行该测试。您可以使用[only](https://jestjs.io/docs/api#testonlyname-fn-timeout)方法运行单个测试。

<!-- Another way of running a single test (or describe block) is to specify the name of the test to be run with the [-t](https://jestjs.io/docs/en/cli.html) flag:-->
另一种运行单个测试（或描述块）的方法是使用`-t`[标志](https://jestjs.io/docs/en/cli.html)指定要运行的测试的名称：

```js
npm test -- -t 'when list has only one blog, equals the likes of that'
```

#### 4.5*: helper functions and unit tests, step3

<!-- Define a new _favoriteBlog_ function that receives a list of blogs as a parameter. The function finds out which blog has the most likes. If there are many top favorites, it is enough to return one of them.-->
定义一个新的_favoriteBlog_函数，接收一个博客列表作为参数。该函数找出哪个博客最受欢迎。如果有很多最受欢迎的博客，只需返回其中一个即可。

<!-- The value returned by the function could be in the following format:-->
函数返回的值可能以下列格式表示：

```js
{
  title: "Canonical string reduction",
  author: "Edsger W. Dijkstra",
  likes: 12
}
```

<!-- **NB** when you are comparing objects, the [toEqual](https://jestjs.io/docs/en/expect#toequalvalue) method is probably what you want to use, since the [toBe](https://jestjs.io/docs/en/expect#tobevalue) tries to verify that the two values are the same value, and not just that they contain the same properties.-->
**译文** 当你比较对象时，[toEqual](https://jestjs.io/docs/en/expect#toequalvalue) 方法可能是你想使用的，因为[toBe](https://jestjs.io/docs/en/expect#tobevalue) 试图验证两个值是同一个值，而不仅仅是它们包含相同的属性。

<!-- Write the tests for this exercise inside of a new <i>describe</i> block. Do the same for the remaining exercises as well.-->
写在一个新的 <i>describe</i> 块里的测试，对于其他练习也是如此。

#### 4.6*: helper functions and unit tests, step4

<!-- This and the next exercise are a little bit more challenging. Finishing these two exercises is not required in to advance in the course material, so it may be a good idea to return to these once you''re done going through the material for this part in its entirety.-->
这个和下一个练习有点挑战性。完成这两个练习不是必须的才能在课程材料中前进，所以在完成这部分材料后可能回头再做这两个练习是个不错的主意。

<!-- Finishing this exercise can be done without the use of additional libraries. However, this exercise is a great opportunity to learn how to use the [Lodash](https://lodash.com/) library.-->
完成这个练习不需要使用额外的库。但是，这个练习是一个很好的机会，可以学习如何使用[Lodash](https://lodash.com/)库。

<!-- Define a function called _mostBlogs_ that receives an array of blogs as a parameter. The function returns the <i>author</i> who has the largest amount of blogs. The return value also contains the number of blogs the top author has:-->
定义一个名为_mostBlogs_的函数，该函数接收一个博客数组作为参数。该函数返回拥有最多博客的<i>作者</i>。返回值还包含最高作者拥有的博客数量：

```js
{
  author: "Robert C. Martin",
  blogs: 3
}
```

<!-- If there are many top bloggers, then it is enough to return any one of them.-->
如果有很多顶尖的博主，那么只返回其中的任何一个就足够了。

#### 4.7*: helper functions and unit tests, step5

<!-- Define a function called _mostLikes_ that receives an array of blogs as its parameter. The function returns the author, whose blog posts have the largest amount of likes. The return value also contains the total number of likes that the author has received:-->
定义一个名为_mostLikes_的函数，它接收一个博客数组作为参数。该函数返回作者，其博客帖子拥有最多的点赞数。返回值也包含该作者获得的总点赞数：

```js
{
  author: "Edsger W. Dijkstra",
  likes: 17
}
```

<!-- If there are many top bloggers, then it is enough to show any one of them.-->
如果有很多顶尖的博主，那么只展示其中一个就足够了。

</div>
