---
mainImage: ../../../images/part-3.svg
part: 3
letter: a
lang: zh
---

<div class="content">


<!-- In this part our focus shifts towards the backend: that is, towards implementing functionality on the server side of the stack. -->
在这一章中，我们的重点转向后端，也就是转向服务器端的功能实现。

<!-- We will be building our backend on top of [NodeJS](https://nodejs.org/en/), which is a JavaScript runtime based on Google's [Chrome V8](https://developers.google.com/v8/) JavaScript engine. -->
我们将在[NodeJS](https://nodejs.org/en/)的基础上构建我们的后端，这是一个基于 Google 的 [Chrome V8](https://developers.google.com/v8/) 引擎的 JavaScript 运行时环境。

<!-- This course material was written with the version <i>v10.18.0</i> of Node.js. Please make sure that your version of Node is at least as new as the version used in the material (you can check the version by running _node -v_ in the command line). -->
本课程材料是使用 Node.js 的<i>v10.18.0</i> 版本编写的。 请确保您的 Node 版本不低于材料中使用的版本(您可以通过在命令行中运行 _node -v_ 来检查版本)。

<!-- As mentioned in [第1章](/zh/part1/javascript), browsers don't yet support the newest features of JavaScript, and that is why the code running in the browser must be <i>transpiled</i> with e.g. [babel](https://babeljs.io/). The situation with JavaScript running in the backend is different. The newest version of Node supports a large majority of the latest features of JavaScript, so we can use the latest features without having to transpile our code. -->
正如在 [第1章](/zh/part1/javascript)中提到的，浏览器还不支持 JavaScript 的最新特性，这就是为什么在浏览器中运行的代码必须是[babel](https://babeljs.io/)转译过的。而在后端运行 JavaScript 的情况是不同的。 最新版本的 Node 支持大部分最新的 JavaScript 特性，因此我们可以使用最新的特性而不必转译我们的代码。

<!-- Our goal is to implement a backend that will work with the notes application from [第2章](/zh/part2/). However, let's start with the basics by implementing a classic "hello world" application. -->
我们的目标是实现一个后端，它将与 [第2章](/zh/part2/)中的 notes 应用一起工作。 但还是让我们从实现经典的“ hello world”应用的基础开始。

<!-- **Notice** that the applications and exercises in this part are not all React applications, and we will not use the <i>create-react-app</i> utility for initializing the project for this application. -->

注意：本章中的应用和练习并不都是 React 应用，我们不会使用<i>create-react-app</i>工具程序为此应用初始化项目。


<!-- We had already mentioned [npm](/zh/part2/从服务器获取数据#npm) back in part 2, which is a tool used for managing JavaScript packages. In fact, npm originates from the Node ecosystem. -->
在第2章节中，我们已经提到了[npm](/zh/part2/从服务器获取数据#npm) ，这是一个用于管理 JavaScript 包的工具。 事实上，npm 来源于 Node 生态系统。

<!-- Let's navigate to an appropriate directory, and create a new template for our application with the _npm init_ command. We will answer the questions presented by the utility, and the result will be an automatically generated <i>package.json</i> file at the root of the project, that contains information about the project. -->
让我们进入到一个合适的目录，并使用_npm init_命令为应用创建一个新模板。 我们将回答该工具提出的问题，结果会在项目根目录下自动生成的<i>package.json</i> 文件，其中包含有关项目的信息。

```json
{
  "name": "backend",
  "version": "0.0.1",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Matti Luukkainen",
  "license": "MIT"
}
```

<!-- The file defines, for instance, that the entry point of the application is the <i>index.js</i> file. -->
例如，该文件定义应用的入口点是<i>index.js</i> 文件。


<!-- Let's make a small change to the <i>scripts</i> object: -->
让我们对<i>scripts</i> 对象做一个小小的修改:

```bash
{
  // ...
  "scripts": {
    "start": "node index.js", // highlight-line
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  // ...
}
```


<!-- Next, let's create the first version of our application by adding an <i>index.js</i> file to the root of the project with the following code: -->
接下来，我们创建应用的第一个版本，在项目的根目录中添加一个<i>index.js</i> 文件，代码如下:

```js
console.log('hello world')
```


<!-- We can run the program directly with Node from the command line: -->
我们可以通过命令行直接用 Node 运行程序:

```bash
node index.js
```

<!-- Or we can run it as an [npm script](https://docs.npmjs.com/misc/scripts): -->
或者我们可以将它作为一个 [npm 脚本](https://docs.npmjs.com/misc/scripts)运行:

```bash
npm start
```

<!-- The <i>start</i> npm script works because we defined it in the <i>package.json</i> file: -->
<i>start</i> 这个npm 脚本之所以有效，是因为我们在  <i>package.json</i> 文件中定义了它:

```bash
{
  // ...
  "scripts": {
    "start": "node index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  // ...
}
```

<!-- Even though the execution of the project works when it is started by calling _node index.js_ from the command line, it's customary for npm projects to execute such tasks as npm scripts. -->
尽管通过从命令行调用 _node index.js_ 来启动项目是可以工作的，但 npm 项目通常执行 npm 脚本之类的任务。

<!-- By default the <i>package.json</i> file also defines another commonly used npm script called <i>npm test</i>. Since our project does not yet have a testing library, the _npm test_ command simply executes the following command: -->
默认情况下，<i>package.json</i> 文件还定义了另一个常用的 npm 脚本，称为<i>npm test</i>。 由于我们的项目还没有测试库，npm test 命令只是执行如下命令:

```bash
echo "Error: no test specified" && exit 1
```


### Simple web server 
【简单的 web 服务器】

<!-- Let's change the application into a web server: -->
让我们把这个应用改成一个 web 服务器:

```js
const http = require('http')

const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('Hello World')
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
```

<!-- Once the application is running, the following message is printed in the console: -->
一旦运行应用，控制台中就会输出如下消息:

```bash
Server running on port 3001
```

<!-- We can open our humble application in the browser by visiting the address <http://localhost:3001>: -->
我们可以在浏览器中通过访问地址 http://localhost:3001 打开我们的应用:

![](../../images/3/1.png)

<!-- In fact, the server works the same way regardless of the latter part of the URL. Also the address <http://localhost:3001/foo/bar> will display the same content. -->
事实上，无论 URL 的后半部分是什么，服务器的工作方式都是相同的。 地址http://localhost:3001/foo/bar 也会显示相同的内容。

<!-- **NB** if the port 3001 is already in use by some other application, then starting the server will result in the following error message: -->

注意：如果端口3001已经被其他应用使用，那么启动服务器将产生如下错误消息:

```bash
➜  hello npm start

> hello@1.0.0 start /Users/mluukkai/opetus/_2019fullstack-code/part3/hello
> node index.js

Server running on port 3001
events.js:167
      throw er; // Unhandled 'error' event
      ^

Error: listen EADDRINUSE :::3001
    at Server.setupListenHandle [as _listen2] (net.js:1330:14)
    at listenInCluster (net.js:1378:12)
```

<!-- You have two options. Either shutdown the application using the port 3001 (the json-server in the last part of the material was using the port 3001), or use a different port for this application. -->
你有两个选择。 要么关闭使用3001端口应用(教材上一章最后一章节的 json-server 使用的就是3001端口) ，要么为此应用使用不同的端口。

<!-- Let's take a closer look at the first line of the code: -->
让我们仔细看看代码的第一行:

```js
const http = require('http')
```

<!-- In the first row, the application imports Node's built-in [web server](https://nodejs.org/docs/latest-v8.x/api/http.html) module. This is practically what we have already been doing in our browser-side code, but with a slightly different syntax: -->
在第一行中，应用导入 Node 的内置 [web server](https://nodejs.org/docs/latest-v8.x/api/http.html)模块。 这实际上是我们在浏览器端代码中已经做过的事情，只是语法稍有不同:

```js
import http from 'http'
```

<!-- These days, code that runs in the browser uses ES6 modules. Modules are defined with an [export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) and taken into use with an [import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import). -->
如今，在浏览器中运行的代码使用 ES6模块。 模块定义为[export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) ，并与[import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)一起使用。

<!-- However, Node.js uses so-called [CommonJS](https://en.wikipedia.org/wiki/CommonJS) modules. The reason for this is that the Node ecosystem had a need for modules long before JavaScript supported them in the language specification. At the time of writing this material, Node does not support ES6 modules, but support for them [is coming](https://nodejs.org/api/esm.html) somewhere down the road. -->
然而，Node.js 使用了所谓的 [CommonJS](https://en.wikipedia.org/wiki/CommonJS)。 原因在于，早在 JavaScript 在语言规范中支持模块之前，Node 生态系统就有对模块需求。 在撰写本文的时候，Node 还不支持 ES6模块，但是支持 ES6 [只是时间问题](https://nodejs.org/api/esm.html) 。

<!-- CommonJS modules function almost exactly like ES6 modules, at least as far as our needs in this course are concerned. -->
Commonjs 模块的功能几乎完全类似于 ES6模块，至少就我们在本课程中的需求而言是这样。 

<!-- The next chunk in our code looks like this: -->
我们代码中的下一块代码如下所示:

```js
const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('Hello World')
})
```

<!-- The code uses the _createServer_ method of the [http](https://nodejs.org/docs/latest-v8.x/api/http.html) module to create a new web server. An <i>event handler</i> is registered to the server, that is called <i>every time</i>  an HTTP request is made to the server's address . -->
该代码使用了 [http](https://nodejs.org/docs/latest-v8.x/api/http.html) 模块的 createServer 方法来创建一个新的 web 服务器。 一个<i>事件处理</i> 被注册到服务器，<i>每次</i> 向服务器的地址http://localhost:3001 发出 HTTP 请求时，它就被调用。

<!-- The request is responded to with the status code 200, with the <i>Content-Type</i> header set to <i>text/plain</i>, and the content of the site to be returned set to <i>Hello World</i>. -->
响应请求的状态代码为200，<i>Content-Type</i> 头文件设置为 <i>text/plain</i>，将返回站点的内容设置为<i>Hello World</i>。

<!-- The last rows bind the http server assigned to the _app_ variable, to listen to HTTP requests sent to the port 3001: -->
最后一行将绑定的HTTP 服务器分配给 app 变量 ，并监听发送到端口3001的 HTTP 请求:

```js
const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
```

<!-- The primary purpose of the backend server in this course is to offer raw data in the JSON format to the frontend. For this reason, let's immediately change our server to return a hardcoded list of notes in the JSON format: -->
本课程中后端服务器的主要用途是向前端提供 JSON 格式的原始数据。 基于这个原因，让我们立即更改我们的服务器，返回 JSON 格式的“硬编码”便笺列表:

```js
const http = require('http')

// highlight-start
let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2019-05-30T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2019-05-30T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true
  }
]

const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify(notes))
})
// highlight-end

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
```

<!-- Let's restart the server (you can shut the server down by pressing _Ctrl+C_ in the console) and let's refresh the browser. -->
让我们重新启动服务器(可以通过在控制台中按 Ctrl + c 关闭服务器) ，并刷新浏览器。

<!-- The <i>application/json</i> value in the <i>Content-Type</i> header informs the receiver that the data is in the JSON format. The _notes_ array gets transformed into JSON with the <em>JSON.stringify(notes)</em> method. -->
 <i>Content-Type</i> 头中的 <i>application/json</i> 值通知接收方数据为 JSON 格式。 使用  <em>JSON.stringify(notes)</em>  方法将 _notes_ 数组转换为 JSON。

<!-- When we open the browser, the displayed format is exactly the same as in [第2章](/zh/part2/从服务器获取数据/) where we used [json-server](https://github.com/typicode/json-server) to serve the list of notes: -->
当我们打开浏览器的时候，显示的格式和第2章节 [第2章](/zh/part2/从服务器获取数据/) 完全一样，在那里我们使用 [json-server](https://github.com/typicode/json-server) 来提供便笺列表:

![](../../images/3/2e.png)


### Express
<!-- Implementing our server code directly with Node's built-in [http](https://nodejs.org/docs/latest-v8.x/api/http.html) web server is possible. However, it is cumbersome, especially once the application grows in size. -->
直接使用 Node 内置的[http](https://nodejs.org/docs/latest-v8.x/api/http.html) web 服务器实现我们的服务器代码是可行的。 但是，它很麻烦，特别是当应用规模“变大变长”时。

<!-- Many libraries have been developed to ease server side development with Node, by offering a more pleasing interface to work with the built-in http module. These libraries aim to provide a better abstraction for general use cases we usually require to build a backend server. By far the most popular library intended for this purpose is [express](http://expressjs.com). -->
为了提供一个比内置的 http 模块更友好的界面，许多库已经开发出来，以简化使用 Node 作为服务器端开发。这些库致力于为构建后台服务器的一般的用例提供一个更好的抽象，到目前为止，最受欢迎的库是[express](http://expressjs.com)。

<!-- Let's take express into use by defining it as a project dependency with the command: -->
让我们通过下面的命令将它定义为一个项目依赖，来开始使用 express:

```bash
npm install express
```

<!-- The dependency is also added to our <i>package.json</i> file: -->
该依赖项也被添加到了我们的<i>package.json</i> 文件中:

```json
{
  // ...
  "dependencies": {
    "express": "^4.17.1"
  }
}

```

<!-- The source code for the dependency is installed to the <i>node\_modules</i> directory located in the root of the project. In addition to express, you can find a great amount of other dependencies in the directory: -->
依赖的源代码安装在项目根目录中的 <i>node\_modules</i> 目录中。 除了express，你还可以在目录中找到大量的其他依赖项:

![](../../images/3/4.png)



<!-- These are in fact the dependencies of the express library, and the dependencies of all of its dependencies, and so forth. These are called the [transitive dependencies](https://lexi-lambda.github.io/blog/2016/08/24/understanding-the-npm-dependency-model/) of our project. -->
这些实际上是express的依赖项，以及它所有依赖项的依赖项，等等。 这些被称为我们项目的 [传递依赖transitive dependencies](https://lexi-lambda.github.io/blog/2016/08/24/understanding-the-npm-dependency-model/) 。

<!-- The version 4.17.1. of express was installed in our project. What does the caret in front of the version number in <i>package.json</i> mean? -->
我们的项目中安装了4.17.1版本的express。 在<i>package.json</i> 中，版本号前面的插入符号是什么意思？

```json
"express": "^4.17.1"
```

<!-- The versioning model used in npm is called [semantic versioning](https://docs.npmjs.com/getting-started/semantic-versioning). -->
npm 中使用的版本控制模型称为 [语义版本semantic versioning](https://docs.npmjs.com/getting-started/semantic-versioning). 

<!-- The caret in the front of <i>^4.17.1</i> means, that if and when the dependencies of a project are updated, the version of express that is installed will be at least <i>4.17.1</i>. However, the installed version of express can also be one that has a larger <i>patch</i> number (the last number), or a larger <i>minor</i> number (the middle number). The major version of the library indicated by the first <i>major</i> number must be the same. -->
<i>^4.17.1</i> 前面的插入符号表示，当项目的依赖项更新时，安装的 express 版本至少为 <i>4.17.1</i>。 但是，所安装的 express 版本也可以具有较大的<i>patch</i> 号(最后一个数字)或较大的<i>minor</i> 号(中间的数字)的版本。 第一个<i>major</i> 号表示库的主版本必须相同。

<!-- We can update the dependencies of the project with the command: -->
我们可以使用如下命令更新项目的依赖:

```bash
npm update
```

<!-- Likewise, if we start working on the project on another computer, we can install all up-to-date dependencies of the project defined in <i>package.json</i> with the command: -->
同样，如果我们在另一台计算机上开始工作，我们可以使用如下命令安装<i>package.json</i> 中定义的项目的所有最新依赖项:

```bash
npm install
```

<!-- If the <i>major</i> number of a dependency does not change, then the newer versions should be [backwards compatible](https://en.wikipedia.org/wiki/Backward_compatibility). This means that if our application happened to use version 4.99.175 of express in the future, then all the code implemented in this part would still have to work without making changes to the code. In contrast, the future 5.0.0. version of express [may contain](https://expressjs.com/en/guide/migrating-5.html) changes, that would cause our application to no longer work. -->
如果依赖项的<i>major</i>值没有改变，那么新版本应该是[向后兼容backwards compatible](https://en.wikipedia.org/wiki/Backward_compatibility)。 这意味着，如果我们的应用在将来碰巧使用了 express 的版本4.99.175，那么在这个部分中实现的所有代码仍然必须在不对代码进行更改的情况下正常工作。 相比之下，未来的5.0.0。 Express版本 [可能包含may contain](https://expressjs.com/en/guide/migrating-5.html)更改，将导致我们的应用不能正常工作。

### Web and express

<!-- Let's get back to our application and make the following changes: -->
让我们回到我们的应用，并进行如下更改:

```js
const express = require('express')
const app = express()

let notes = [
  ...
]

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```


<!-- In order to get the new version of our application into use, we have to restart the application. -->
为了使应用的新版本投入使用，我们必须重新启动应用。

<!-- The application did not change a whole lot. Right at the beginning of our code we're importing _express_, which this time is a <i>function</i> that is used to create an express application stored in the _app_ variable: -->
这个应用没有太大的改变。 在代码的开头我们导入了 _express_，这次是一个<i>function</i> ，用于创建一个存储在 app 变量中的 express 应用:

```js
const express = require('express')
const app = express()
```

<!-- Next, we define two <i>routes</i> to the application. The first one defines an event handler, that is used to handle HTTP GET requests made to the application's <i>/</i> root: -->
接下来，我们定义了应用的两个<i>路由</i>。 第一个定义了一个事件处理，用于处理对应用的 <i>/</i>  根发出的 HTTP GET 请求:

```js
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})
```

<!-- The event handler function accepts two parameters. The first [request](http://expressjs.com/en/4x/api.html#req) parameter contains all of the information of the HTTP request, and the second [response](http://expressjs.com/en/4x/api.html#res) parameter is used to define how the request is responded to. -->
事件处理接受两个参数。 第一个[request](http://expressjs.com/en/4x/api.html#req) 参数包含 HTTP 请求的所有信息，第二个 [response](http://expressjs.com/en/4x/api.html#res) 参数用于定义请求的响应方式。

<!-- In our code, the request is answered by using the [send](http://expressjs.com/en/4x/api.html#res.send) method of the _response_ object. Calling the method makes the server respond to the HTTP request by sending a response containing the string <code>\<h1>Hello World!\</h1></code>, that was passed to the _send_ method. Since the parameter is a string, express automatically sets the value of the <i>Content-Type</i> header to be <i>text/html</i>. The status code of the response defaults to 200. -->
在我们的代码中，请求是通过使用 _response_ 对象的[send](http://expressjs.com/en/4x/api.html#res.send) 方法来应答的。 调用该方法，使服务器通过发送 <code>\<h1>Hello World!\</h1></code>字符串，以response响应 HTTP 请求！ 这些会被传递给 _send_ 方法。 由于参数是一个字符串，所以 express 会自动将<i>Content-Type</i> 头的值设置为 <i>text/html</i>.。 响应的状态代码默认为200。


<!-- We can verify this from the <i>Network</i> tab in developer tools: -->
我们可以通过开发工具中的<i>Network</i> 选项卡来验证这一点:

![](../../images/3/5.png)



<!-- The second route defines an event handler, that handles HTTP GET requests made to the <i>notes</i> path of the application: -->
第二个路由定义了一个事件处理，它处理对应用的<i>notes</i> 路径发出的 HTTP GET 请求:

```js
app.get('/api/notes', (request, response) => {
  response.json(notes)
})
```

<!-- The request is responded to with the [json](http://expressjs.com/en/4x/api.html#res.json) method of the _response_ object. Calling the method will send the __notes__ array that was passed to it as a JSON formatted string. Express automatically sets the <i>Content-Type</i> header with the appropriate value of <i>application/json</i>. -->
请求用response对象的[json](http://expressjs.com/en/4x/api.html#res.json)方法进行响应。 调用该方法会将notes 数组作为 JSON 格式的字符串进行传递。 Express 自动设置<i>Content-Type</i> 头文件，其值为 <i>application/json</i>。

![](../../images/3/6ea.png)

<!-- Next, let's take a quick look at the data sent in the JSON format. -->
接下来，让我们快速看一下以 JSON 格式发送的数据。

<!-- In the earlier version where we were only using Node, we had to transform the data into the JSON format with the _JSON.stringify_ method: -->
在我们只使用 Node 的早期版本中，我们必须使用 _JSON.stringify_  方法将数据转换为 JSON 格式:

```js
response.end(JSON.stringify(notes))
```

<!-- With express, this is no longer required, because this transformation happens automatically. -->
对于 express，不再需要这样做，因为这种转换是自动的。

<!-- It's worth noting, that [JSON](https://en.wikipedia.org/wiki/JSON) is a string, and not a JavaScript object like the value assigned to _notes_. -->
值得注意的是，[JSON](https://en.wikipedia.org/wiki/JSON)是一个字符串，而不是像分配给 notes 的值那样的 JavaScript 对象。

<!-- The experiment shown below illustrates this point: -->
下面的实验可以说明这一点:

![](../../assets/3/5.png)



<!-- The experiment above was done in the interactive [node-repl](https://nodejs.org/docs/latest-v8.x/api/repl.html). You can start the interactive node-repl by typing in _node_ in the command line. The repl is particularly useful for testing how commands work while you're writing application code. I highly recommend this! -->
上面的实验是在交互式的[node-repl](https://nodejs.org/docs/latest-v8.x/api/repl.html)中完成的。 您可以通过在命令行中键入 node 来启动交互式 node-repl。 在编写应用代码时，对于测试命令的工作方式，repl 特别有用。 我强烈推荐！

### nodemon
<!-- If we make changes to the application's code we have to restart the application in order to see the changes. We restart the application by first shutting it down by typing _Ctrl+C_ and then restarting the application. Compared to the convenient workflow in React where the browser automatically reloaded after changes were made, this feels slightly cumbersome. -->
如果我们对应用的代码进行更改，我们必须重新启动应用以查看更改。 我们通过键入 _⌃+C_ 首先关闭应用，然后重新启动应用。 与 React 中方便的工作流程相比，Node就有点麻烦，在 React 中，浏览器会在进行更改后自动重新加载。

<!-- The solution to this problem is [nodemon](https://github.com/remy/nodemon):  -->
解决这个问题的方法是使用[nodemon](https://github.com/remy/nodemon) :

> <!--<i>nodemon will watch the files in the directory in which nodemon was started, and if any files change, nodemon will automatically restart your node application.</i>-->
nodemon 将监视启动 nodemon 的目录中的文件，如果任何文件发生更改，nodemon 将自动重启node应用。  

<!-- Let's install nodemon by defining it as a <i>development dependency</i> with the command: -->
让我们通过下面的命令将 nodemon 定义为<i>开发依赖development dependency</i>:

```bash
npm install --save-dev nodemon
```

<!-- The contents of <i>package.json</i> have also changed: -->
 <i>package.json</i> 的内容也发生了变化:

```json
{
  //...
  "dependencies": {
    "express": "^4.17.1",
  },
  "devDependencies": {
    "nodemon": "^2.0.2"
  }
}
```

<!-- If you accidentally used the wrong command and the nodemon dependency was added under "dependencies" instead of "devDependencies", then manually change the contents of <i>package.json</i> to match what is shown above. -->
如果您不小心敲错了命令，并且 nodemon 依赖项被添加到“ dependencies”而不是“ devDependencies” ，那么手动更改<i>package.json</i> 的内容以匹配上面显示的内容也是可以的。

<!-- By development dependencies, we are referring to tools that are needed only during the development of the application, e.g. for testing or automatically restarting the application, like <i>nodemon</i>. -->
通过开发依赖，我们会指向仅在应用开发过程中需要的工具，例如用于测试或自动重启应用的工具，就像<i>nodemon</i>。

<!-- These development dependencies are not needed when the application is run in production mode on the production server (e.g. Heroku). -->
当应用在生产服务器(例如 Heroku)的生产模式下运行时，并不需要这些开发依赖项。

<!-- We can start our application with <i>nodemon</i> like this: -->
我们可以用<i>nodemon</i> 这样来启动我们的应用:

```bash
node_modules/.bin/nodemon index.js
```

<!-- Changes to the application code now causes the server to restart automatically. It's worth noting, that even though the backend server restarts automatically, the browser still has to be manually refreshed. This is because unlike when working in React, we could not even have the [hot reload](https://gaearon.github.io/react-hot-loader/getstarted/) functionality needed to automatically reload the browser. -->
对应用代码的更改现在会导致服务器自动重新启动。 值得注意的是，即使后端服务器自动重启，浏览器仍然需要手动刷新。 这是因为不像在 React 中工作，我们甚至没有自动重新加载浏览器所需的[热加载hot reload](https://gaearon.github.io/react-hot-loader/getstarted/) 方法。

<!-- The command is long and quite unpleasant, so let's define a dedicated <i>npm script</i> for it in the <i>package.json</i> file: -->
这个命令很长，而且相当烦人，所以让我们在<i>package.json</i> 文件中为它定义一个专用的<i>npm 脚本</i>:

```bash
{
  // ..
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  // ..
}
```

<!-- In the script there is no need to specify the <i>node\_modules/.bin/nodemon</i> path to nodemon, because _npm_ automatically knows to search for the file from that directory.  -->
在脚本中，不需要指定<i>node\_modules/.bin/nodemon</i>  到 nodemon ，因为 npm 自己知道从该目录搜索文件。


<!-- We can now start the server in the development mode with the command: -->
我们现在可以在开发模式下使用如下命令启动服务器:

```bash
npm run dev
```


<!-- Unlike with the <i>start</i> and <i>test</i> scripts, we also have to add <i>run</i> to the command. -->
与<i>start</i> 和<i>test</i> 脚本不同，我们还必须将<i>run</i> 添加到命令中。


### REST
<!-- Let's expand our application so that it provides the RESTful HTTP API as [json-server](https://github.com/typicode/json-server#routes). -->
让我们扩展我们的应用，使它提供像[json-server](https://github.com/typicode/json-server#routes 服务器)那样的 RESTful HTTP API 。

<!-- Representational State Transfer, aka. REST was introduced in 2000 in Roy Fielding's [dissertation](https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm). REST is an architectural style meant for building scalable web applications. -->
Representational State Transfer，又名REST， 是在2000年 Roy Fielding 的[论文](https://www.ics.uci.edu/~Fielding/pubs/dissertation/rest_arch_style.htm)中引入的。 Rest 是一种架构风格，用于构建可伸缩的 web 应用。 

<!-- We are not going to dig into Fielding's definition of REST or spend time pondering about what is and isn't RESTful. Instead, we take a more [narrow view](https://en.wikipedia.org/wiki/Representational_state_transfer#Applied_to_Web_services) by only concerning ourselves with how RESTful API's are typically understood in web applications. The original definition of REST is in fact not even limited to web applications. -->
我们不会深入探究 Fielding 对 REST 的定义，也不会花时间思考什么是 RESTful，什么不是 RESTful。 相反，我们只关注web应用对 RESTful API 的典型理解，从而采取了一种更为狭隘的视角 [narrow view](https://en.wikipedia.org/wiki/Representational_state_transfer#Applied_to_web_services)。 Rest 的最初定义实际上并不局限于 web 应用。

<!-- We mentioned in the [previous part](/zh/part2/在服务端将数据_alert出来#rest) that singular things, like notes in the case of our application, are called <i>resources</i> in RESTful thinking. Every resource has an associated URL which is the resource's unique address. -->
我们在 [上一章节](/zh/part2/在服务端将数据_alert出来#rest) 中提到过，在我们的应用中，像便笺这样的单数实体，在 RESTful thinking 中称为<i>resource</i>。 每个resource都有一个相关联的 URL，这个 URL 是资源的唯一地址。

<!-- One convention is to create the unique address for resources by combining the name of the resource type with the resource's unique identifier. -->
一个约定是结合resource 类型名称和resource的唯一标识符来创建resource唯一的地址。

<!-- Let's assume that the root URL of our service is <i>www.example.com/api</i>. -->
假设我们的服务的根 URL 是<i> www.example.com/api </i>。

<!-- If we define the resource type of notes to be <i>note</i>, then the address of a note resource with the identifier 10, has the unique address <i>www.example.com/api/notes/10</i>. -->
如果我们将便笺的资源类型定义为<i>note</i>，那么标识为10的便笺资源的地址就是唯一的地址<i>www.example.com/api/notes/10</i>。

<!-- The URL for the entire collection of all note resources is <i>www.example.com/api/notes</i>. -->
所有便笺资源的整个集合的 URL 是<i> www.example.com/api/notes </i>。

<!-- We can execute different operations on resources. The operation to be executed is defined by the HTTP <i>verb</i>: -->
我们可以对资源执行不同的操作。要执行的操作由 HTTP<i>动词verb</i> 定义:

| URL                   | verb                | functionality                                                    |
| --------------------- | ------------------- | -----------------------------------------------------------------|
| notes/10              | GET                 | fetches a single resource                                        |
| notes                 | GET                 | fetches all resources in the collection                          |
| notes                 | POST                | creates a new resource based on the request data                 |
| notes/10              | DELETE              | removes the identified resource                                  |
| notes/10              | PUT                 | replaces the entire identified resource with the request data    |
| notes/10              | PATCH               | replaces a part of the identified resource with the request data |
|                       |                     |                                                                  |

<!-- This is how we manage to roughly define what REST refers to as a [uniform interface](https://en.wikipedia.org/wiki/Representational_state_transfer#Architectural_constraints), which means a consistent way of defining interfaces that makes it possible for systems to co-operate. -->
这就是我们如何粗略地定义 REST 所指的 [统一接口 uniform interface](https://en.wikipedia.org/wiki/Representational_state_transfer#Architectural_constraints) ，这意味着一种一致的定义接口的方式，使系统能够进行合作。

<!-- This way of interpreting REST falls under the [second level of RESTful maturity](https://martinfowler.com/articles/richardsonMaturityModel.html) in the Richardson Maturity Model. According to the definition provided by Roy Fielding, we have not actually defined a [REST API](http://roy.gbiv.com/untangled/2008/rest-apis-must-be-hypertext-driven). In fact, a large majority of the world's purported "REST" API's do not meet Fielding's original criteria outlined in his dissertation. -->
这种解释 REST 的方式在 Richardson Maturity Model 属于[RESTful 成熟度的第二个层次](https://martinfowler.com/articles/richardsonmaturitymodel.html)。 根据 Roy Fielding 提供的定义，我们实际上并没有定义一个[REST API](http://Roy.gbiv.com/untangled/2008/REST-apis-must-be-hypertext-driven)。 事实上，世界上大多数所谓的“REST” API都不符合 Fielding 在其论文中概述的原始标准。

<!-- In some places (see e.g. [Richardson, Ruby: RESTful Web Services](http://shop.oreilly.com/product/9780596529260.do)) you will see our model for a straightforward [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) API, being referred to as an example of [resource oriented architecture](https://en.wikipedia.org/wiki/Resource-oriented_architecture) instead of REST. We will avoid getting stuck arguing semantics and instead return to working on our application. -->
在某些地方(例如[Richardson，Ruby: RESTful Web Services](http://shop.oreilly.com/product/9780596529260.do)) ，你会看到我们为一个简单的[CRUD](https://en.wikipedia.org/wiki/create,_read,_update_and_delete) API 建立的模型，这被称为[面向资源架构resource oriented architecture](https://en.wikipedia.org/wiki/resource-oriented_architecture)的例子，而不是 REST。 我们将避免陷入语义学的争论，而是回到应用的工作中。


### Fetching a single resource
【获取一个单一资源】
<!-- Let's expand our application so that it offers a REST interface for operating on individual notes. First let's create a [route](http://expressjs.com/en/guide/routing.html) for fetching a single resource. -->
让我们扩展我们的应用，以便它提供一个 REST 接口，用于操作单个便笺。 首先，让我们创建一个[路由](http://expressjs.com/en/guide/routing.html)来获取单个资源。

<!-- The unique address we will use for an individual note is of the form <i>notes/10</i>, where the number at the end refers to the note's unique id number. -->
我们将为单个便笺使用的唯一地址是 <i>notes/10</i>，其中末尾的数字指的是便笺的唯一 id 号。

<!-- We can define [parameters](http://expressjs.com/en/guide/routing.html#route-parameters) for routes in express by using the colon syntax: -->
我们可以使用冒号语法为express路由定义[参数](http://expressjs.com/en/guide/routing.html#route-parameters) :

```js
app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => note.id === id)
  response.json(note)
})
```

<!-- Now <code>app.get('/api/notes/:id', ...)</code> will handle all HTTP GET requests, that are of the form <i>/api/notes/SOMETHING</i>, where <i>SOMETHING</i> is an arbitrary string. -->

现在， <code>app.get('/api/notes/:id', ...)</code>将处理所有的 HTTP GET 请求，这些请求的格式是<i>/api/notes/SOMETHING</i>，其中<i>SOMETHING</i> 是任意的字符串。

<!-- The <i>id</i> parameter in the route of a request, can be accessed through the [request](http://expressjs.com/en/api.html#req) object: -->
请求路由中的<i>id</i> 参数可以通过[request](http://expressjs.com/en/api.html#req)对象访问:

```js
const id = request.params.id
```

<!-- The now familiar _find_ method of arrays is used to find the note with an id that matches the parameter. The note is then returned to the sender of the request. -->
现在使用熟悉的 _find_ 方法查找与 id 参数匹配的的便笺。 然后，便笺被返回给request的发送者。

<!-- When we test our application by going to <http://localhost:3001/api/notes/1> in our browser, we notice that it does not appear to work, as the browser displays an empty page. This comes as no surprise to us as software developers, and it's time to debug. -->
当我们通过在浏览器中键入 http://localhost:3001/api/notes/1 来测试我们的应用时，我们注意到它似乎不能正常工作，因为浏览器显示一个空白页面。 这对于我们软件开发人员来说并不奇怪，现在是调试的时候了。

<!-- Adding _console.log_ commands into our code is a time-proven trick: -->
在我们的代码中添加  _console.log_ 命令是一个久经验证的技巧:

```js
app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  console.log(id)
  const note = notes.find(note => note.id === id)
  console.log(note)
  response.json(note)
})
```

<!-- When we visit <http://localhost:3001/api/notes/1> again in the browser, the console which is the terminal in this case, will display the following: -->
当我们在浏览器中再次访问 http://localhost:3001/api/notes/1 时，终端控制台将显示如下内容:

![](../../images/3/8.png)



<!-- The id parameter from the route is passed to our application but the _find_ method does not find a matching note. -->
来自 route 的 id 参数被传递给我们的应用，但是 find 方法没有找到匹配的便笺。

<!-- To further our investigation, we also add a console log inside the comparison function passed to the _find_ method. In order to do this, we have to get rid of the compact arrow function syntax <em>note => note.id === id</em>, and use the syntax with an explicit return statement: -->
为了进一步研究，我们还在传递给 find 方法的比较函数中添加了console log。 为了做到这一点，我们必须去掉紧凑箭头函数语法<em>note => note.id === id</em>，并使用显式的 return 语句这种语法:

```js
app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => {
    console.log(note.id, typeof note.id, id, typeof id, note.id === id)
    return note.id === id
  })
  console.log(note)
  response.json(note)
})
```

<!-- When we visit the URL again in the browser, each call to the comparison function prints a few different things to the console. The console output is the following: -->
当我们在浏览器中再次访问 URL 时，对比较函数的每次调用都会向控制台打印一些不同的内容。 控制台输出如下:

<pre>
1 'number' '1' 'string' false
1‘ number’’1’‘ string’ false
2 'number' '1' 'string' false
2‘ number’’1’‘ string’ false
3 'number' '1' 'string' false
3‘ number’’1’‘ string’ false
</pre>
<!-- The cause of the bug becomes clear. The _id_ variable contains a string '1', whereas the id's of notes are integers. In JavaScript, the "triple equals" comparison === considers all values of different types to not be equal by default, meaning that 1 is not '1'.  -->
这个错误的原因很清楚了。 _id_  变量包含一个字符串“1” ，而便笺的 id 是整数。 在 JavaScript 中，“三个等号 triple equals”比较默认认为不同类型的所有值都不相等，这意味着1不等于“1”。


<!-- Let's fix the issue by changing the id parameter from a string into a [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number): -->
让我们通过将 id 参数从一个字符串更改为一个[number](https://developer.mozilla.org/en-us/docs/web/javascript/reference/global_objects/number)来解决这个问题:

```js
app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  response.json(note)
})
```

<!-- Now fetching an individual resource works. -->
现在获取单个资源可以正常工作了。

![](../../images/3/9ea.png)



<!-- However, there's another problem with our application. -->
然而，我们的应用还有另一个问题。


<!-- If we search for a note with an id that does not exist, the server responds with: -->
如果我们搜索一个 id 不存在的便笺，服务器会响应:

![](../../images/3/10ea.png)



<!-- The HTTP status code that is returned is 200, which means that the response succeeded. There is no data sent back with the response, since the value of the <i>content-length</i> header is 0, and the same can be verified from the browser.  -->
返回的 HTTP状态码还是200，这意味着响应成功了。 <i>content-length</i> 标头的值为0，因为没有将数据与响应一起发送回来，可以从浏览器验证这一点。

<!-- The reason for this behavior is that the _note_ variable is set to _undefined_ if no matching note is found. The situation needs to be handled on the server in a better way. If no note is found, the server should respond with the status code [404 not found](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.5) instead of 200. -->
出现此行为的原因是，如果没有找到匹配的便笺，则将note变量设置为了_undefined_。 需要在服务器上以更好的方式处理这种情况。 如果没有发现任何提示，服务器应该用状态码[404 not found](https://www.w3.org/protocols/rfc2616/rfc2616-sec10.html#sec10.4.5)响应，而不是200。


<!-- Let's make the following change to our code: -->
让我们对我们的代码进行如下更改:

```js
app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  
  // highlight-start
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
  // highlight-end
})
```

<!-- Since no data is attached to the response, we use the [status](http://expressjs.com/en/4x/api.html#res.status) method for setting the status, and the [end](http://expressjs.com/en/4x/api.html#res.end) method for responding to the request without sending any data. -->
由于响应没有附加任何数据，我们使用[status](http://expressjs.com/en/4x/api.html#res.status)方法来设置状态，并使用[end](http://expressjs.com/en/4x/api.html#res.end)方法来响应request而不发送任何数据。

<!-- The if-condition leverages the fact that all JavaScript objects are [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy), meaning that they evaluate to true in a comparison operation. However, _undefined_ is [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) meaning that it will evaluate to false. -->
If-condition 基于了这样一个事实，即所有的 JavaScript 对象都是[truthy](https://developer.mozilla.org/en-us/docs/glossary/truthy) ，这意味着它们在比较操作中被当作 true。 然而，undefined 是 [falsy](https://developer.mozilla.org/en-us/docs/glossary/falsy)，意思是它将评估为 false。 

<!-- Our application works and sends the error status code if no note is found. However, the application doesn't return anything to show to the user, like web applications normally do when we visit a page that does not exist. We do not actually need to display anything in the browser because REST API's are interfaces that are intended for programmatic use, and the error status code is all that is needed. -->
我们的应用正常工作，如果没有找到便笺，则发送错误状态代码。 然而，应用不会返回任何东西显示给用户，就像我们 在web 应用访问一个不存在的页面时所做的那样。 我们实际上不需要在浏览器中显示任何内容，因为 REST API 是用于编程使用的接口，只需要错误状态代码就行了。


### Deleting resources
【删除资源】

<!-- Next let's implement a route for deleting resources. Deletion happens by making an HTTP DELETE request to the url of the resource: -->
接下来，让我们实现一个删除资源的路由。 通过向资源的 url 发出 HTTP DELETE 请求来删除:

```js
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})
```

<!-- If deleting the resource is successful, meaning that the note exists and it is removed, we respond to the request with the status code [204 no content](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.2.5) and return no data with the response. -->
如果删除资源成功，这意味着便笺存在并被删除，我们用状态码[204 no content](https://www.w3.org/protocols/rfc2616/rfc2616-sec10.html#sec10.2.5)响应请求，并返回没有数据的响应。

<!-- There's no consensus on what status code should be returned to a DELETE request if the resource does not exist. Really, the only two options are 204 and 404. For the sake of simplicity our application will respond with 204 in both cases. -->
如果资源不存在，对于应该向 DELETE 请求返回什么状态代码并没有共识。 实际上，只有204和404两个可选项。 为了简单起见，我们的应用在这两种情况下都将响应204。

### Postman

<!-- So how do we test the delete operation? HTTP GET requests are easy to make from the browser. We could write some JavaScript for testing deletion, but writing test code is not always the best solution in every situation. -->
那么我们如何测试删除操作呢？ 通过浏览器进行 HTTP GET 请求很容易。 我们可以编写一些 JavaScript 来测试删除，但是编写测试代码并不总是最好的解决方案。

<!-- Many tools exist for making the testing of backends easier. One of these is a command line program [curl](https://curl.haxx.se). However, instead of curl, we will take a look at using [Postman](https://www.getpostman.com/) for testing the application. -->
为了让后端的测试变得更加容易，我们可以使用工具。 其中之一就是命令行程序[curl](https://curl.haxx.se) ，这个命令行程序在本文前面的部分中已经简要地提到过。用来替代 curl，我们将使用 [Postman](https://www.getpostman.com/)  来测试应用。

<!-- Let's install Postman and try it out: -->
让我们安装 Postman 并尝试一下:

![](../../images/3/11ea.png)

<!-- Using Postman is quite easy in this situation. It's enough to define the url and then select the correct request type. -->
使用Postman在这种情况下是相当容易的。 定义 url 然后选择正确的请求类型就足够了。

<!-- The backend server appears to respond correctly. By making an HTTP GET request to <http://localhost:3001/api/notes> we see that the note with the id 2 is no longer in the list, which indicates that the deletion was successful.  -->
后端服务器似乎响应正确。 通过向<http://localhost:3001/api/notes> 发出 HTTP GET 请求，我们可以看到 id 为2的便笺已经不在列表中，这表明删除是成功的。

<!-- Because the notes in the application are only saved to memory, the list of notes will return to its original state when we restart the application. -->
因为应用中的便笺只保存到了内存中，所以当我们重新启动应用时，便笺列表将返回到原始状态。

### The Visual Studio Code REST client

<!-- If you use Visual Studio Code, you can use the VS Code [REST client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) plugin instead of Postman. -->
如果你使用 Visual Studio Code，你可以使用 VS Code [REST client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) 插件来代替Postman。

<!-- Once the plugin is installed, using it is very simple. We make a directory at the root of application named <i>requests</i>. We save all the REST client requests in the directory as files that end with the <i>.rest</i> extension. -->
一旦插件安装完毕，使用起来非常简单。 我们在应用的根目录创建一个文件夹，名为<i>requests</i>。 我们将目录中的所有 REST 客户端请求保存为以 <i>.rest</i>结尾的文件。 

<!-- Let's create a new <i>get\_all\_notes.rest</i> file and define the request that fetches all notes. -->
让我们创建一个新的<i>get\_all\_notes.rest</i> 文件，并定义获取所有便笺的请求。

![](../../images/3/12ea.png)

<!-- By clicking the <i>Send Request</i> text, the REST client will execute the HTTP request and response from the server is opened in the editor. -->
通过单击<i>Send Request</i> 文本，REST 客户端将执行 HTTP 请求，并在编辑器中打开来自服务器的响应。

![](../../images/3/13ea.png)


### Receiving data
【接受数据】
<!-- Next, let's make it possible to add new notes to the server. Adding a note happens by making an HTTP POST request to the address http://localhost:3001/api/notes, and by sending all the information for the new note in the request [body](https://www.w3.org/Protocols/rfc2616/rfc2616-sec7.html#sec7) in the JSON format. -->
接下来，让我们使向服务器添加新便笺。 通过向地址 HTTP://localhost:3001/api/notes 发送一个 HTTP POST 请求，并以 JSON 格式在请求[body](https://www.w3.org/protocols/rfc2616/rfc2616-sec7.html#sec7)中发送新便笺的所有信息，就可以添加一个便笺。

<!-- In order to access the data easily, we need the help of the express [json-parser](https://expressjs.com/en/api.html), that is taken to use with command _app.use(express.json())_. -->
为了方便地访问数据，我们需要 express [json-parser](https://expressjs.com/en/api.html)的帮助，它与命令_app.use(express.json())_一起使用。

<!-- Let's activate the json-parser and implement an initial handler for dealing with the HTTP POST requests: -->
让我们激活 json-parser 并实现一个处理 HTTP POST 请求的初始处理程序:

```js
const express = require('express')
const app = express()

app.use(express.json())

//...

app.post('/api/notes', (request, response) => {
  const note = request.body
  console.log(note)

  response.json(note)
})
```

<!-- The event handler function can access the data from the <i>body</i> property of the _request_ object. -->
事件处理函数可以从request 对象的<i>body</i> 属性访问数据。

<!-- Without a the json-parser, the <i>body</i> property would be undefined. The json-parser functions so that it takes the JSON data of a request, transforms it into a JavaScript object and then attaches it to the <i>body</i> property of the _request_ object before the route handler is called. -->
如果没有 json-parser，<i>body</i> 属性将是undefined的。 Json-parser 的功能是获取请求的 JSON 数据，将其转换为 JavaScript 对象，然后在调用路由处理程序之前将其附加到请求对象的 <i>body</i> 属性。

<!-- For the time being, the application does not do anything with the received data besides printing it to the console and sending it back in the response. -->
目前，除了将接收到的数据打印到控制台并在响应中将其发送回来之外，应用并不对其执行任何操作。

<!-- Before we implement the rest of the application logic, let's verify with Postman that the data is actually received by the server. In addition to defining the URL and request type in Postman, we also have to define the data sent in the <i>body</i>: -->
在实现应用逻辑的剩余部分之前，让我们先用 Postman 验证服务器实际接收到的数据。 除了在 Postman 中定义 URL 和请求类型外，我们还必须定义<i>body</i> 中发送的数据:

![](../../images/3/14ea.png)



<!-- The application prints the data that we sent in the request to the console: -->
该应用将我们在请求中发送到控制台的数据打印出来:

![](../../images/3/15e.png)



<!-- **NB** <i>Keep the terminal running the application visible at all times</i> when you are working on the backend. Thanks to Nodemon any changes we make to the code will restart the application. If you pay attention to the console, you will immediately be able to pick up on errors that occur in the application: -->

注意：当你在后端工作时，应该让运行应用的终端始终可见。 受益于 Nodemon，我们对代码所做的任何更改都将重新启动应用。 如果你注意控制台，你会立即发现应用中出现的错误:

![](../../images/3/16.png)



<!-- Similarly, it is useful to check the console for making sure that the backend behaves like we expect it to in different situations, like when we send data with an HTTP POST request. Naturally, it's a good idea to add lots of <em>console.log</em> commands to the code while the application is still being developed. -->
类似地，检查控制台以确保后端在不同情况下的行为与我们期望的一样，比如在使用 HTTP POST 请求发送数据时。 当然，在开发应用时向代码中添加一些 <em>console.log</em> 命令是一个不错的主意。

<!-- A potential cause for issues is an incorrectly set <i>Content-Type</i> header in requests. This can happen with Postman if the type of body is not defined correctly: -->
导致问题的一个潜在原因是在请求中错误地设置了<i>Content-Type</i> 头。 如果body类型没有正确定义，这种情况可能发生在 Postman 身上:

![](../../images/3/17e.png)



<!-- The <i>Content-Type</i> header is set to <i>text/plain</i>: -->
 <i>Content-Type</i> 的header设置为了 <i>text/plain</i>：

![](../../images/3/18e.png)



<!-- The server appears to only receive an empty object: -->
服务器似乎只接收到一个空对象:

![](../../images/3/19.png)



<!-- The server will not be able to parse the data correctly without the correct value in the header. It won't even try to guess the format of the data, since there's a [massive amount](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types) of potential <i>Content-Types</i>. -->
如果头部没有设置正确的值，服务器将无法正确解析数据。 它甚至不会去猜测数据的格式，因为有大量 [massive amount](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types) 的<i>Content-Types</i> 可能性。


<!-- If you are using VS Code, then you should install the REST client from the previous chapter <i>now, if you haven't already</i>. The POST request can be sent with the REST client like this: -->
如果您正在使用 VS Code，那么您应该安装上一节<i>中提到的 REST 客户端</i>（如果您还没有安装的话）。 Post 请求可以像这样通过 REST 客户端发送:

![](../../images/3/20eb.png)



<!-- We created a new <i>create\_note.rest</i> file for the request. The request is formatted according to the [instructions in the documentation](https://github.com/Huachao/vscode-restclient/blob/master/README.md#usage). -->
我们为这个请求创建了一个新的<i>create\_note.rest</i>文件，这个请求是根据[文档中的说明](https://github.com/huachao/vscode-restclient/blob/master/readme.md#usage)格式化的。

<!-- One benefit that the REST client has over Postman is that the requests are handily available at the root of the project repository, and they can be distributed to everyone in the development team. Postman also allows users to save requests, but the situation can get quite chaotic especially when you're working on multiple unrelated projects. -->
Rest 客户端相对于 Postman 的一个好处是，请求可以在项目仓库的根部轻松获得，并且可以分发给开发团队中的每个人。 Postman也允许用户保存请求，但是当你在处理多个不相关的项目时，情况会变得非常混乱。 

<!-- One benefit that the REST client has over Postman is that the requests are handily available at the root of the project repository, and they can be distributed to everyone in the development team. You can also add multiple requests in the same file using `###` separators: -->
Rest 客户端相对于 Postman 的一个好处是，请求可以在项目仓库的根目录轻松获得，并且可以分发给开发团队中的每个人。也可以添加利用 `###` 分割符向相同文件中添加多个请求：

```
GET http://localhost:3001/api/notes/

###
POST http://localhost:3001/api/notes/ HTTP/1.1
content-type: application/json

{
    "name": "sample",
    "time": "Wed, 21 Oct 2015 18:27:50 GMT"
}
```

<!-- Postman also allows users to save requests, but the situation can get quite chaotic especially when you're working on multiple unrelated projects. -->
Postman 也允许用户保存请求，但环境会变得越来越混乱，尤其是当你在一些好不相关的项目间切换的时候。


> **Important sidenote**
重要旁注
>
><!--Sometimes when you're debugging, you may want to find out what headers have been set in the HTTP request. One way of accomplishing this is through the [get](http://expressjs.com/en/4x/api.html#req.get) method of the _request_ object, that can be used for getting the value of a single header. The _request_ object also has the <i>headers</i> property, that contains all of the headers of a specific request.-->
> 有时在进行调试时，您可能希望了解 HTTP 请求中设置了哪些头。 实现这一点的一种方法是通过请求对象的[get](http://expressjs.com/en/4x/api.html#req.get)方法，该方法可用于获取单个头的值。 Request 对象还具有<i>headers</i> 属性，该属性包含特定请求的所有头信息。

> <!--Problems can occur with the VS REST client if you accidentally add an empty line between the top row and the row specifying the HTTP headers. In this situation, the REST client interprets this to mean that all headers are left empty, which leads to the backend server not knowing that the data it has received is in the JSON format.-->
如果您不小心在指定 HTTP 头的顶行和行之间添加了一个空行，那么 VS REST 客户端可能会出现问题。 在这种情况下，REST 客户端将其解释为所有头都是空的，这导致后端服务器不知道它接收的数据是 JSON 格式的。

<!-- You will be able to spot this missing <i>Content-Type</i> header if at some point in your code you print all of the request headers with the _console.log(request.headers)_ command. -->
如果您在代码中的某个位置使用 _console.log(request.headers)_ 命令打印所有请求头，那么您将能够发现缺少了<i>Content-Type</i> 头。

<!-- Let's return to the application. Once we know that the application receives data correctly, it's time to finalize the handling of the request: -->
让我们回到应用。 一旦我们知道应用正确地接收了数据，就是时候处理最终请求了:

```js
app.post('/api/notes', (request, response) => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id)) 
    : 0

  const note = request.body
  note.id = maxId + 1

  notes = notes.concat(note)

  response.json(note)
})
```

<!-- We need a unique id for the note. First, we find out the largest id number in the current list and assign it to the _maxId_ variable. The id of the new note is then defined as _maxId + 1_. This method is in fact not recommended, but we will live with it for now as we will replace it soon enough. -->
我们需要一个唯一的 id。 首先，找出当前列表中最大的 id 号，并将其赋值给 maxId 变量。 然后将新通知的 id 定义为 maxId + 1。 这种方法实际上是不被推荐的，但是我们暂时接受它，因为我们很快就会替换掉它。

<!-- The current version still has the problem that the HTTP POST request can be used to add objects with arbitrary properties. Let's improve the application by defining that the <i>content</i> property may not be empty. The <i>important</i> and <i>date</i> properties will be given default values. All other properties are discarded: -->
当前版本仍然存在 HTTP POST 请求可添加任意属性的问题。 让我们通过定义<i>content</i> 属性不能为空来改进应用。<i>important</i> 和<i>date</i> 属性将被赋予默认值。 所有其他属性都被丢弃:

```js
const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
})
```

<!-- The logic for generating the new id number for notes has been extracted into a separate _generateId_ function. -->
为便笺生成新 id 号的逻辑已经提取到一个单独的 generateId 函数中。


<!-- If the received data is missing a value for the <i>content</i> property, the server will respond to the request with the status code [400 bad request](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.1): -->
如果接收到的数据缺少<i>content</i> 属性的值，服务器将使用状态码[400 bad request](https://www.w3.org/protocols/rfc2616/rfc2616-sec10.html#sec10.4.1)响应请求:

```js
if (!body.content) {
  return response.status(400).json({ 
    error: 'content missing' 
  })
}
```

<!-- Notice that calling return is crucial, because otherwise the code will execute to the very end and the malformed note gets saved to the application. -->
请注意，调用 return 是至关重要的，否则代码将执行到最后才能将格式不正确的通知保存到应用中。

<!-- If the content property has a value, the note will be based on the received data. As mentioned previously, it is better to generate timestamps on the server than in the browser, since we can't trust that host machine running the browser has its clock set correctly. The generation of the <i>date</i> property is now done by the server. -->
如果 content 属性具有值，则说明便笺内容将基于接收到的数据。 正如前面提到的，在服务器上生成时间戳比在浏览器上生成更好，因为我们不能确保运行浏览器的主机的时钟设置是正确的。 现在由服务器生成<i>date</i> 属性。


<!-- If the <i>important</i> property is missing, we will default the value to <i>false</i>. The default value is currently generated in a rather odd-looking way: -->
如果缺少<i>important</i> 属性，则将该值默认为<i>false</i>。 当前生成默认值的方式相当奇怪:

```js
important: body.important || false,
```

<!-- If the data saved in the _body_ variable has the <i>important</i> property, the expression will evaluate to its value. If the property does not exist, then the expression will evaluate to false which is defined on the right-hand side of the vertical lines. -->
如果保存在 body 变量中的数据具有<i>important</i> 属性，则表达式将计算它作为值。 如果该属性不存在，那么表达式将默认为 false，该表达式在双竖线的右侧定义。


> <!--To be exact, when the <i>important</i> property is <i>false</i>, then the <em>body.important || false</em> expression will in fact return the <i>false</i> from the right-hand side...-->
确切地说，当<i>important</i> 属性为<i>false</i> 时，那么<em>body.important || false</em> 表达式实际上将从右侧返回<i>false</i>..。

<!-- You can find the code for our current application in its entirety in the <i>part3-1</i> branch of [this github repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-1). -->
您可以在[this github repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-1)的<i>part3-1</i> 分支中找到我们当前应用的全部代码。

<!-- Notice that the master branch of the repository contains the code from a later version of the application. The code for the current state of the application is specifically in branch [part3-1](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-1). -->
注意，仓库的主分支包含应用的后一个版本的代码。 应用当前状态的代码单独在 branch [part3-1](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-1)中。

![](../../images/3/21.png)



<!-- If you clone the project, run the _npm install_ command before starting the application with _npm start_ or _npm run dev_. -->
如果您克隆了项目，在启动应用之前运行 npm install 命令，使用 npm start 或 npm run dev运行项目。


<!-- One more thing before we move onto the exercises. The function for generating IDs looks currently like this: -->
在我们开始练习之前还有一件事，生成 id 的函数现在是这样的:

```js
const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}
```

<!-- The function body contains a row that looks a bit intriguing: -->
函数体包含一行看起来很有趣的内容:

```js
Math.max(...notes.map(n => n.id))
```

<!-- What exactly is happening in that line of code? <em>notes.map(n => n.id)</em> creates a new array that contains all the id's of the notes. [Math.max](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max) returns the maximum value of the numbers that are passed to it. However, <em>notes.map(n => n.id)</em> is an <i>array</i> so it can't directly be given as a parameter to _Math.max_. The array can be transformed into individual numbers by using the "three dot" [spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) syntax <em>...</em>. -->
这行代码中到底发生了什么？  <em>notes.map(n => n.id)</em> 创建一个包含所有便笺 id 的新数组。 [Math.max](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max)返回传递给它的数的最大值。 然而，<em>notes.map(n => n.id)</em>  是一个<i>数组</i>，因此它不能直接作为 Math.max 的参数。 数组可以通过使用“ 三个点<em>...</em>”[展开](https://developer.mozilla.org/en-us/docs/web/javascript/reference/operators/spread_syntax)语法 转换为单独的数字。

</div>


<div class="tasks">



### Exercises 3.1.-3.6.


<!-- **NB:** It's recommended to do all of the exercises from this part into a new dedicated git repository, and place your source code right at the root of the repository. Otherwise you will run into problems in exercise 3.10. -->
注意: 建议将本章节的所有练习放到一个新的专用 git 仓库中，并将源代码放在仓库的根部。 否则你会在 练习3.10 中遇到麻烦。

<!-- **NB:** Because this is not a frontend project and we are not working with React, the application <strong>is not created</strong> with create-react-app. You initialize this project with the <em>npm init</em> command that was demonstrated earlier in this part of the material. -->

注意： 因为这不是一个前端项目，我们没有使用 React，所以应用没有用 create-react-app创建。 您可以使用 <em>npm init</em> 命令初始化这个项目，该命令在本章节的前面已经演示过了。

<!-- **Strong recommendation:** When you are working on backend code, always keep an eye on what's going on in the terminal that is running your application. -->

强烈建议: 当你在处理后端代码时，始终关注运行应用的终端中发生了什么。


#### 3.1: Phonebook backend 步骤1
<!-- Implement a Node application that returns a hardcoded list of phonebook entries from the address <http://localhost:3001/api/persons>: -->
实现一个 Node 应用，从地址 http://localhost:3001/api/persons 返回一个硬编码的电话簿条目列表:

![](../../images/3/22e.png)



<!-- Notice that the forward slash in the route <i>api/persons</i> is not a special character, and is just like any other character in the string.  -->
请注意，路由 <i>api/persons</i> 中的正斜杠不是特殊字符，它与字符串中的任何其他字符一样。


<!-- The application must be started with the command _npm start_. -->
应用必须以命令 npm start 启动。

<!-- The application must also offer an _npm run dev_ command that will run the application and restart the server whenever changes are made and saved to a file in the source code. -->
应用还必须提供 npm run dev命令，该命令将运行应用，并在进行更改并将更改保存到源代码中的文件时重新启动服务器。


#### 3.2: Phonebook backend 步骤2
<!-- Implement a page at the address <http://localhost:3001/info> that looks roughly like this: -->
在地址http://localhost:3001/info 实现一个页面，大致如下:

![](../../images/3/23ea.png)

<!-- The page has to show the time that the request was received and how many entries are in the phonebook at the time of processing the request. -->
该页面必须显示接收请求的时间，以及在处理请求时展示电话簿中有多少条目。


#### 3.3: Phonebook backend 步骤3
<!-- Implement the functionality for displaying the information for a single phonebook entry. The url for getting the data for a person with the id 5 should be <http://localhost:3001/api/persons/5> -->
实现显示单个电话簿条目信息的功能。 用于获取 id 为5的用户数据的 url 应该是 http://localhost:3001/api/persons/5


<!-- If an entry for the given id is not found, the server has to respond with the appropriate status code. -->
如果没有找到给定 id 的条目，服务器必须使用适当的状态代码进行响应。


#### 3.4: Phonebook backend 步骤4

<!-- Implement functionality that makes it possible to delete a single phonebook entry by making an HTTP DELETE request to the unique URL of that phonebook entry. -->
通过向电话簿条目的唯一 URL 发出 HTTP DELETE 请求，实现可以删除单个电话簿条目的功能。

<!-- Test that your functionality works with either Postman or the Visual Studio Code REST client. -->
测试您的功能是否能与Postman 或  Visual Studio Code REST client一起工作。


#### 3.5: Phonebook backend 步骤5
<!-- Expand the backend so that new phonebook entries can be added by making HTTP POST requests to the address <http://localhost:3001/api/persons>. -->
扩展后端，以便通过向地址<http://localhost:3001/api/persons> 发送 HTTP POST 请求来添加新的电话簿条目。

<!-- Generate a new id for the phonebook entry with the [Math.random](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random) function. Use a big enough range for your random values so that the likelihood of creating duplicate id's is small. -->
使用[Math.random](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random)函数为电话簿条目生成一个新 id。 使用一个足够大的范围作为您的随机值，以便创建重复 id 的可能性是很小的。


#### 3.6: Phonebook backend 步骤6
<!-- Implement error handling for creating new entries. The request is not allowed to succeed, if: -->
为创建新条目实现错误处理。以下情况，请求不允许成功，如:

- <!--The name or number is missing--> 
- 姓名或电话号码遗失
- <!--The name already exists in the phonebook-->
- 电话簿里已经有这个名字了


<!-- Respond to requests like these with the appropriate status code, and also send back information that explains the reason for the error, e.g.: -->
使用适当的状态代码响应这些请求，并发回解释错误原因的信息，例如:

```js
{ error: 'name must be unique' }
```

</div>


<div class="content">



### About HTTP request types 
【关于 HTTP 请求类型】

<!-- [The HTTP standard](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html) talks about two properties related to request types, **safety** and **idempotence**. -->
[HTTP 标准](https://www.w3.org/protocols/rfc2616/rfc2616-sec9.html)讨论了与请求类型相关的两个属性，**安全**  和 **幂等性** 。

<!-- The HTTP GET request should be <i>safe</i>: -->
Http GET 请求应该是<i>满足安全性的</i>: 

> <i>In particular, the convention has been established that the GET and HEAD methods SHOULD NOT have the significance of taking an action other than retrieval. These methods ought to be considered "safe".</i>
特别是，已经建立了一个约定，即 GET 和 HEAD 方法除了检索之外不应该有其他行动的含义。 这些方法应该被认为是“安全的”。

<!-- Safety means that the executing request must not cause any <i>side effects</i> in the server. By side-effects we mean that the state of the database must not change as a result of the request, and the response must only return data that already exists on the server. -->
安全性意味着执行请求不能在服务器中引起任何<i>副作用</i>。 副作用是指数据库的状态不能因请求而改变，响应只能返回服务器上已经存在的数据。

<!-- Nothing can ever guarantee that a GET request is actually <i>safe</i>, this is in fact just a recommendation that is defined in the HTTP standard. By adhering to RESTful principles in our API, GET requests are in fact always used in a way that they are <i>safe</i>. -->
没有什么能够保证 GET 请求实际上是<i>安全的</i>，这实际上只是 HTTP 标准中定义的一个建议。 通过遵守我们的 API 中的 RESTful 原则，GET 请求实际上总是以一种<i>安全safe</i> 的方式使用。


<!-- The HTTP standard also defines the request type [HEAD](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9.4), that ought to be safe. In practice HEAD should work exactly like GET but it does not return anything but the status code and response headers. The response body will not be returned when you make a HEAD request. -->
Http 标准还定义了应该是安全的请求类型[HEAD](https://www.w3.org/protocols/rfc2616/rfc2616-sec9.html#sec9.4)。 实际上，HEAD 应该像 GET 一样工作，但是它只返回状态码和响应头。 当您发出 HEAD 请求时，不会返回响应主体。 


<!-- All HTTP requests except POST should be <i>idempotent</i>: -->
除了 POST 之外的所有 HTTP 请求都应该是<i>幂等</i>:

> <i>Methods can also have the property of "idempotence" in that (aside from error or expiration issues) the side-effects of N > 0 identical requests is the same as for a single request. The methods GET, HEAD, PUT and DELETE share this property</i>
方法也可以具有“幂等”属性，即(除了错误或过期问题) N > 0 相同请求的副作用与单个请求相同。 方法 GET、 HEAD、 PUT 和 DELETE 都具有此属性


<!-- This means that if a request has side-effects, then the result should be same regardless of how many times the request is sent. -->
这意味着，如果一个请求有副作用，那么无论发送多少次请求，结果都应该是相同的。

<!-- If we make an HTTP PUT request to the url <i>/api/notes/10</i> and with the request we send the data <em>{ content: "no side effects!", important: true }</em>, the result is the same regardless of many times the request is sent. -->
如果我们对  <i>/api/notes/10</i>  发出 HTTP PUT 请求，并且在发出请求时发送数据<em>{ content: "no side effects!", important: true }</em>，结果是相同的，不管请求被发送多少次。

<!-- Like <i>safety</i> for the GET request, <i>idempotence</i> is also just a recommendation in the HTTP standard and not something that can be guaranteed simply based on the request type. However, when our API adheres to RESTful principles, then GET, HEAD, PUT, and DELETE requests are used in such a way that they are idempotent. -->
就像 GET 请求的<i>安全性</i> 一样，幂等也只是 HTTP 标准中的一个推荐，而不是仅仅基于请求类型就可以保证的东西。 但是，当我们的 API 遵循 RESTful 原则时，GET、 HEAD、 PUT 和 DELETE 请求的使用方式是等幂的。

<!-- POST is the only HTTP request type that is neither <i>safe</i> nor <i>idempotent</i>. If we send 5 different HTTP POST requests to <i>/api/notes</i> with a body of <em>{content: "many same", important: true}</em>, the resulting 5 notes on the server will all have the same content. -->
Post 是唯一既不是<i>安全性</i> 也不是<i>幂等</i> 的 HTTP 请求类型。 如果我们向 <i>/api/notes</i> 发送5个不同的 HTTP POST 请求，其中包含 <em>{content: "many same", important: true}</em>，那么服务器上得到的5个便笺将具有相同的内容。 


### Middleware
【中间件】
<!-- The express [json-parser](https://expressjs.com/en/api.html) we took into use earlier is a so-called [middleware](http://expressjs.com/en/guide/using-middleware.html). -->
我们之前使用的 express [json-parser](https://expressjs.com/en/api.html)是所谓的[中间件](http://expressjs.com/en/guide/using-middleware.html)。

<!-- Middleware are functions that can be used for handling _request_ and _response_ objects. -->
中间件是可用于处理请求和响应对象的函数。

<!-- The json-parser we used earlier takes the raw data from the requests that's stored in the _request_ object, parses it into a JavaScript object and assigns it to the _request_ object as a new property <i>body</i>. -->
我们前面使用的 json-parser 从请求对象中存储的请求中获取原始数据，将其解析为一个 JavaScript 对象，并将其作为一个新的属性、<i>body</i> 分配给请求对象。

<!-- In practice, you can use several middleware at the same time. When you have more than one, they're executed one by one in the order that they were taken into use in express. -->
在实践中，您可以同时使用多个中间件。 当你有多于一个的时候，将按照他们被使用的顺序，一个接一个地执行。

<!-- Let's implement our own middleware that prints information about every request that is sent to the server. -->
让我们实现我们自己的中间件，打印有关发送到服务器的每个请求的信息。


<!-- Middleware is a function that receives three parameters: -->
中间件是一个接收三个参数的函数:

```js
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
```

<!-- At the end of the function body the _next_ function that was passed as a parameter is called. The _next_ function yields control to the next middleware. -->
在函数体的末尾，调用作为参数传递的下一个函数。 函数将控制权交给下一个中间件。

<!-- Middleware are taken into use like this: -->
中间件是这样使用的:

```js
app.use(requestLogger)
```

<!-- Middleware functions are called in the order that they're taken into use with the express server object's _use_ method. Notice that json-parser is taken into use before the _requestLogger_ middleware, because otherwise <i>request.body</i> will not be initialized when the logger is executed! -->
中间件函数按照与express服务器对象的使用方法一起使用的顺序调用。 请注意，json-parser 是在 requestLogger 中间件之前使用的，否则在执行日志记录器时，不会初始化我们的 <i>request.body</i> ！

<!-- Middleware functions have to be taken into use before routes if we want them to be executed before the route event handlers are called. There are also situations where we want to define middleware functions after routes. In practice, this means that we are defining middleware functions that are only called if no route handles the HTTP request. -->
如果我们希望在调用路由事件处理程序之前执行中间件函数，则必须在路由之前使用中间件函数。 还有一些情况，我们希望在路由之后定义中间件函数。 实际上，这意味着我们定义的中间件函数只有在没有路由处理 HTTP 请求的情况下才被调用。


<!-- Let's add the following middleware after our routes, that is used for catching requests made to non-existent routes. For these requests, the middleware will return an error message in the JSON format. -->
让我们在路由之后添加如下中间件，它用于捕获对不存在的路由发出的请求。 对于这些请求，中间件将返回 JSON 格式的错误消息。

```js
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
```

<!-- You can find the code for our current application in its entirety in the <i>part3-2</i> branch of [this github repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-2). -->
您可以在[this github repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-2).的<i>part3-2</i> 分支中找到我们当前应用的全部代码。

</div>


<div class="tasks">


### Exercises 3.7.-3.8.
#### 3.7: Phonebook backend 步骤7
<!-- Add the [morgan](https://github.com/expressjs/morgan) middleware to your application for logging. Configure it to log messages to your console based on the <i>tiny</i> configuration. -->
在你的日志应用中添加[morgan](https://github.com/expressjs/morgan) 中间件。 将其配置为基于<i>tiny</i> 配置，将消息记录到控制台。

<!-- The documentation for Morgan is not the best, and you may have to spend some time figuring out how to configure it correctly. However, most documentation in the world falls under the same category, so it's good to learn to decipher and interpret cryptic documentation in any case. -->
Morgan 的文档不是最好的，您可能需要花费一些时间来弄清楚如何正确地配置它。 然而，世界上大多数文档都属于同一级别，因此无论如何，学习解释和解释神秘的文档都是有益的。 

<!-- Morgan is installed just like all other libraries with the _npm install_ command. Taking morgan into use happens the same as configuring any other middleware by using the _app.use_ command. -->
Morgan 的安装方式与使用 _npm install_ 命令的所有其他库一样。 使用 morgan 与使用 _app.use_ 命令配置任何其他中间件一样。 


#### 3.8*: Phonebook backend 步骤8

<!-- Configure morgan so that it also shows the data sent in HTTP POST requests: -->
配置 morgan，让它同时显示 HTTP POST 请求中发送的数据:

![](../../images/3/24.png)

<!-- Note that logging data even in the console can be dangerous since it can contain sensitive data and may violate local privacy law (e.g. GDPR in EU) or business-standard. In this exercise, you don't have to worry about privacy issues, but in practice, try not to log any sensitive data. -->
注意，在打印日志的时候，即使是通过console来记录，依然存在一定的风险，因为可能包含敏感数据而且可能违反某地的法律（例如欧洲的GDPR） 或者商业标准。在本练习中，不必担心隐私的问题，但在实际中，不要去记录任何敏感数据。

<!-- This exercise can be quite challenging, even though the solution does not require a lot of code. -->
尽管解决方案不需要很多代码，但这个练习可能相当具有挑战性。

<!-- This exercise can be completed in a few different ways. One of the possible solutions utilizes these two techniques: -->
这个练习可以通过几种不同的方式来完成。其中一种可能的解决方案利用了如下两种技巧:

- [创建新的令牌](https://github.com/expressjs/morgan#creating-new-tokens)
- [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)

</div>

