---
mainImage: ../../../images/part-3.svg
part: 3
letter: a
lang: zh
---

<div class="content">

<!-- In this part, our focus shifts towards the backend: that is, towards implementing functionality on the server side of the stack.-->
在这一部分，我们的重点转移到后端：也就是在堆栈的伺服器端实现功能。

<!-- We will be building our backend on top of [NodeJS](https://nodejs.org/en/), which is a JavaScript runtime based on Google's [Chrome V8](https://developers.google.com/v8/) JavaScript engine.-->
我们将在[NodeJS](https://nodejs.org/en/)的基础上构建我们的后端，它是基于Google的[Chrome V8](https://developers.google.com/v8/)JavaScript引擎的JavaScript运行时环境。

<!-- This course material was written with version <i>v18.13.0</i> of Node.js. Please make sure that your version of Node is at least as new as the version used in the material (you can check the version by running _node -v_ in the command line).-->
本门课程材料使用的是Node.js的<i>v18.13.0</i>版本编写的，请确保您的Node版本不早于本材料中使用的版本（您可以在命令行中运行 _node -v_ 来检查版本）。

<!-- As mentioned in [part 1](/en/part1/java_script), browsers don''t yet support the newest features of JavaScript, and that is why the code running in the browser must be <i>transpiled</i> with e.g. [babel](https://babeljs.io/). The situation with JavaScript running in the backend is different. The newest version of Node supports a large majority of the latest features of JavaScript, so we can use the latest features without having to transpile our code.-->
正如[部分1](/en/part1/java_script)中提到的，浏览器尚不支持JavaScript的最新功能，这就是为什么在浏览器中运行的代码必须使用例如[babel](https://babeljs.io/)进行<i>转译</i>。而JavaScript在后端运行的情况则不同。最新版本的Node支持大部分JavaScript的最新功能，因此我们可以使用最新的功能而无需转译我们的代码。

<!-- Our goal is to implement a backend that will work with the notes application from [part 2](/en/part2/). However, let's start with the basics by implementing a classic "hello world" application.-->
我们的目标是实现一个与[第二章节](/en/part2/)中的笔记应用程序配合使用的后端。不过，让我们先从实现一个经典的“Hello World”应用程序开始。

<!-- **Notice** that the applications and exercises in this part are not all React applications, and we will not use the <i>create-react-app</i> utility for initializing the project for this application.-->
**注意**：本部分的应用程序和练习并非全部是React应用程序，我们不会使用<i>create-react-app</i>工具来初始化该应用程序的项目。

<!-- We had already mentioned [npm](/en/part2/getting_data_from_server#npm) back in part 2, which is a tool used for managing JavaScript packages. In fact, npm originates from the Node ecosystem.-->
我们在第2章节已经提到[npm](/en/part2/getting_data_from_server#npm)，它是一个用于管理JavaScript包的工具。事实上，npm源自Node生态系统。

<!-- Let's navigate to an appropriate directory, and create a new template for our application with the _npm init_ command. We will answer the questions presented by the utility, and the result will be an automatically generated <i>package.json</i> file at the root of the project that contains information about the project.-->
让我们导航到一个合适的目录，然后使用`npm init`命令创建一个新的模板给我们的应用程序。我们将回答实用程序提出的问题，结果将是一个自动生成的<i>package.json</i>文件在项目的根目录，其中包含有关该项目的信息。

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

<!-- The file defines, for instance, that the entry point of the application is the <i>index.js</i> file.-->
文件定义，例如，应用程序的入口点是<i>index.js</i>文件。

<!-- Let's make a small change to the <i>scripts</i> object:-->
让我们对<i>脚本</i>对象做一个小的改变：

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

<!-- Next, let's create the first version of our application by adding an <i>index.js</i> file to the root of the project with the following code:-->
接下来，我们可以通过在项目根目录添加一个 <i>index.js</i> 文件来创建我们应用程序的第一个版本，文件内容如下：

```js
console.log('hello world')
```

<!-- We can run the program directly with Node from the command line:-->
我们可以从命令行直接用Node运行程序：

```bash
node index.js
```

<!-- Or we can run it as an [npm script](https://docs.npmjs.com/misc/scripts):-->
我们也可以把它作为一个 [npm 脚本](https://docs.npmjs.com/misc/scripts)运行：

```bash
npm start
```

<!-- The <i>start</i> npm script works because we defined it in the <i>package.json</i> file:-->
<i>开始</i> npm 脚本之所以能够工作是因为我们在 <i>package.json</i> 文件中定义了它:

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

<!-- Even though the execution of the project works when it is started by calling _node index.js_ from the command line, it's customary for npm projects to execute such tasks as npm scripts.-->
即使当从命令行调用_node index.js_启动项目时，执行也可以正常工作，但是通常npm项目会执行诸如npm脚本之类的任务。

<!-- By default, the <i>package.json</i> file also defines another commonly used npm script called <i>npm test</i>. Since our project does not yet have a testing library, the _npm test_ command simply executes the following command:-->
默认情况下，<i>package.json</i> 文件也定义了另一个常用的 npm 脚本，即 <i>npm test</i>。由于我们的项目还没有测试库，所以 _npm test_ 命令只执行以下命令：

```bash
echo "Error: no test specified" && exit 1
```

### Simple web server

<!-- Let's change the application into a web server by editing the _index.js_ files as follow:-->
让我们通过编辑 _index.js_ 文件将应用程序更改为 web 服务器，如下所示：

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

<!-- Once the application is running, the following message is printed in the console:-->
一旦应用程序启动，控制台就会打印以下消息：

```bash
Server running on port 3001
```

<!-- We can open our humble application in the browser by visiting the address <http://localhost:3001>:-->
我们可以通过访问<http://localhost:3001>在浏览器中打开我们的简单应用程序。

![hello world screen capture](../../images/3/1.png)

<!-- The server works the same way regardless of the latter part of the URL. Also the address <http://localhost:3001/foo/bar> will display the same content.-->
服务器不管URL的后半部分如何，都以相同的方式工作。另外，<http://localhost:3001/foo/bar>地址也会显示相同的内容。

<!-- **NB** if port 3001 is already in use by some other application, then starting the server will result in the following error message:-->
如果端口3001已被其他应用程序占用，那么启动服务器将导致以下错误消息：

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

<!-- You have two options. Either shut down the application using port 3001 (the json-server in the last part of the material was using port 3001), or use a different port for this application.-->
你有两个选择。要么关闭使用端口3001的应用程序（材料的最后一部分使用的是端口3001的json-server），要么为这个应用程序使用不同的端口。

<!-- Let's take a closer look at the first line of the code:-->
让我们仔细看看代码的第一行：

```js
const http = require('http')
```

<!-- In the first row, the application imports Node's built-in [web server](https://nodejs.org/docs/latest-v8.x/api/http.html) module. This is practically what we have already been doing in our browser-side code, but with a slightly different syntax:-->
在第一行，应用程序引入了Node的内置[web服务器](https://nodejs.org/docs/latest-v8.x/api/http.html)模块。 这实际上是我们已经在浏览器端代码中所做的，但语法略有不同：

```js
import http from 'http'
```

<!-- These days, code that runs in the browser uses ES6 modules. Modules are defined with an [export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) and taken into use with an [import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import).-->
这些天，在浏览器中运行的代码使用ES6模块。模块使用[export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export)定义，并使用[import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)进行使用。

<!-- However, Node.js uses so-called [CommonJS](https://en.wikipedia.org/wiki/CommonJS) modules. The reason for this is that the Node ecosystem had a need for modules long before JavaScript supported them in the language specification. Node supports now also the use of ES6 modules, but since the support is yet [not quite perfect](https://nodejs.org/api/esm.html#modules-ecmascript-modules) we''ll stick to CommonJS modules.-->
然而，Node.js使用所谓的[CommonJS](https://en.wikipedia.org/wiki/CommonJS)模块。之所以如此，是因为Node生态系统在JavaScript在语言规范中支持它们之前就需要模块了。Node现在也支持使用ES6模块，但由于支持[还不太完善](https://nodejs.org/api/esm.html#modules-ecmascript-modules)，我们将坚持使用CommonJS模块。

<!-- CommonJS modules function almost exactly like ES6 modules, at least as far as our needs in this course are concerned.-->
CommonJS 模块几乎与 ES6 模块完全一样，至少在我们本课程的需求方面是这样。

<!-- The next chunk in our code looks like this:-->
```
#include <stdio.h>

int main(void)
{
  printf("Hello World!");
  return 0;
}
```

```
#include <stdio.h>

int main(void)
{
  printf("你好世界！");
  return 0;
}
```

```js
const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('Hello World')
})
```

<!-- The code uses the _createServer_ method of the [http](https://nodejs.org/docs/latest-v8.x/api/http.html) module to create a new web server. An <i>event handler</i> is registered to the server that is called <i>every time</i> an HTTP request is made to the server's address <http://localhost:3001>.-->
代码使用[http](https://nodejs.org/docs/latest-v8.x/api/http.html)模块的_createServer_方法创建一个新的Web服务器。注册到服务器上的<i>事件处理程序</i>每当向服务器地址<http://localhost:3001>发出HTTP请求时都会被调用。

<!-- The request is responded to with the status code 200, with the <i>Content-Type</i> header set to <i>text/plain</i>, and the content of the site to be returned set to <i>Hello World</i>.-->
请求被响应状态码为200，<i>Content-Type</i>头设置为<i>text/plain</i>，要返回的站点内容设置为<i>Hello World</i>。

<!-- The last rows bind the http server assigned to the _app_ variable, to listen to HTTP requests sent to port 3001:-->
最后一行将HTTP服务器绑定到_app_变量上，以便监听发送到端口3001的HTTP请求：

```js
const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
```

<!-- The primary purpose of the backend server in this course is to offer raw data in JSON format to the frontend. For this reason, let's immediately change our server to return a hardcoded list of notes in the JSON format:-->
在本课程中，后端伺服器的主要目的是以JSON格式提供原始资料给前端。因此，让我们立刻更改我们的伺服器，以JSON格式返回一个硬编码的笔记列表：

```js
const http = require('http')

// highlight-start
let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
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

<!-- Let's restart the server (you can shut the server down by pressing _Ctrl+C_ in the console) and let's refresh the browser.-->
让我们重新启动服务器（你可以在控制台按下_Ctrl+C_来关闭服务器），然后让我们刷新浏览器。

<!-- The <i>application/json</i> value in the <i>Content-Type</i> header informs the receiver that the data is in the JSON format. The _notes_ array gets transformed into JSON with the <em>JSON.stringify(notes)</em> method.-->
<i>Content-Type</i> 标头中的 <i>application/json</i> 值通知接收者数据以JSON格式提供。 使用 <em>JSON.stringify(notes)</em> 方法将 _notes_ 数组转换为JSON。

<!-- When we open the browser, the displayed format is exactly the same as in [part 2](/en/part2/getting_data_from_server/) where we used [json-server](https://github.com/typicode/json-server) to serve the list of notes:-->
当我们打开浏览器时，显示的格式与[第二章节](/en/part2/getting_data_from_server/)中我们使用[json-server](https://github.com/typicode/json-server)提供笔记列表时完全相同：

![formatted JSON notes data](../../images/3/2new.png)

### Express

<!-- Implementing our server code directly with Node's built-in [http](https://nodejs.org/docs/latest-v8.x/api/http.html) web server is possible. However, it is cumbersome, especially once the application grows in size.-->
实施我们的服务器代码直接使用Node内置的[http](https://nodejs.org/docs/latest-v8.x/api/http.html)网络服务器是可能的。但是，一旦应用程序规模增大，这将是非常繁琐的。

<!-- Many libraries have been developed to ease server-side development with Node, by offering a more pleasing interface to work with the built-in http module. These libraries aim to provide a better abstraction for general use cases we usually require to build a backend server. By far the most popular library intended for this purpose is [express](http://expressjs.com).-->
许多库已经开发出来，以简化使用Node进行服务器端开发，通过提供一个更好的界面来处理内置的http模块。这些库的目的是为我们通常需要构建后端服务器的一般用例提供更好的抽象。到目前为止，最受欢迎的用于此目的的库是[express](http://expressjs.com)。

<!-- Let's take express into use by defining it as a project dependency with the command:-->
让我们通过使用以下命令将Express作为项目依赖项来使用：`npm install express --save`

```bash
npm install express
```

<!-- The dependency is also added to our <i>package.json</i> file:-->
我们的<i>package.json</i>文件中也添加了依赖：

```json
{
  // ...
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

<!-- The source code for the dependency is installed in the <i>node\_modules</i> directory located at the root of the project. In addition to express, you can find a great number of other dependencies in the directory:-->
源代码安装在位于项目根目录的<i>node\_modules</i>目录中。除了express，您还可以在该目录中找到大量其他依赖项。

![ls listing of dependencies in directory](../../images/3/4.png)

<!-- These are the dependencies of the express library and the dependencies of all of its dependencies, and so forth. These are called the [transitive dependencies](https://lexi-lambda.github.io/blog/2016/08/24/understanding-the-npm-dependency-model/) of our project.-->
这些是express库的依赖项以及所有依赖项的依赖项，以此类推。这些被称为我们项目的[传递依赖项](https://lexi-lambda.github.io/blog/2016/08/24/understanding-the-npm-dependency-model/)。

<!-- The version 4.18.2 of express was installed in our project. What does the caret in front of the version number in <i>package.json</i> mean?-->
版本4.18.2的express被安装到我们的项目中。<i>package.json</i>中版本号前面的尖角号是什么意思？

```json
"express": "^4.18.2"
```

<!-- The versioning model used in npm is called [semantic versioning](https://docs.npmjs.com/getting-started/semantic-versioning).-->
npm 使用的版本模型称为[语义版本](https://docs.npmjs.com/getting-started/semantic-versioning)。

<!-- The caret in the front of <i>^4.18.2</i> means that if and when the dependencies of a project are updated, the version of express that is installed will be at least <i>4.18.2</i>. However, the installed version of express can also have a larger <i>patch</i> number (the last number), or a larger <i>minor</i> number (the middle number). The major version of the library indicated by the first <i>major</i> number must be the same.-->
在<i>^4.18.2</i>前面的插入符表示，如果项目的依赖项被更新，安装的 express 版本至少会是<i>4.18.2</i>。但是，安装的 express 版本也可以有更大的<i>补丁</i>号（最后一个数字）或更大的<i>次要</i>号（中间数字）。由第一个<i>主要</i>号表示的库的主要版本必须相同。

<!-- We can update the dependencies of the project with the command:-->
我们可以使用命令`更新项目的依赖项`：

```bash
npm update
```

<!-- Likewise, if we start working on the project on another computer, we can install all up-to-date dependencies of the project defined in <i>package.json</i> by running this next command in the project's root directory:-->
同样地，如果我们在另一台电脑上开始这个项目，我们可以在项目的根目录下执行下一个指令来安装<i>package.json</i>中定义的所有最新的依赖：

```bash
npm install
```

<!-- If the <i>major</i> number of a dependency does not change, then the newer versions should be [backwards compatible](https://en.wikipedia.org/wiki/Backward_compatibility). This means that if our application happened to use version 4.99.175 of express in the future, then all the code implemented in this part would still have to work without making changes to the code. In contrast, the future 5.0.0 version of express [may contain](https://expressjs.com/en/guide/migrating-5.html) changes that would cause our application to no longer work.-->
如果依赖的主要版本号没有变化，那么新版本应该[向后兼容](https://en.wikipedia.org/wiki/Backward_compatibility)。这意味着如果我们的应用程序将来使用express的4.99.175版本，那么这部分实现的所有代码仍然可以在不改变代码的情况下工作。相反，express的5.0.0版本[可能会包含](https://expressjs.com/en/guide/migrating-5.html)会导致我们的应用程序不再工作的变化。

### Web and express

<!-- Let's get back to our application and make the following changes:-->
让我们回到我们的应用程序，并做出以下更改：

```js
const express = require('express')
const app = express()

let notes = [
  ...
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

<!-- To get the new version of our application into use, we have to restart the application.-->
要使用新版本的应用程序，我们必须重新启动应用程序。

<!-- The application did not change a whole lot. Right at the beginning of our code, we''re importing _express_, which this time is a <i>function</i> that is used to create an express application stored in the _app_ variable:-->
在我们的代码开头，我们正在导入_express_，这次是一个<i>函数</i>，用于创建存储在_app_变量中的express应用程序：应用程序没有发生太大变化。

```js
const express = require('express')
const app = express()
```

<!-- Next, we define two <i>routes</i> to the application. The first one defines an event handler that is used to handle HTTP GET requests made to the application's <i>/</i> root:-->
接下来，我们定义两个<i>路由</i>到应用程序。第一个定义了一个事件处理程序，用于处理应用程序<i>/</i>根目录发出的HTTP GET请求：

```js
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})
```

<!-- The event handler function accepts two parameters. The first [request](http://expressjs.com/en/4x/api.html#req) parameter contains all of the information of the HTTP request, and the second [response](http://expressjs.com/en/4x/api.html#res) parameter is used to define how the request is responded to.-->
事件处理函数接受两个参数。第一个[请求](http://expressjs.com/en/4x/api.html#req)参数包含所有的HTTP请求信息，第二个[响应](http://expressjs.com/en/4x/api.html#res)参数用于定义如何响应请求。

<!-- In our code, the request is answered by using the [send](http://expressjs.com/en/4x/api.html#res.send) method of the _response_ object. Calling the method makes the server respond to the HTTP request by sending a response containing the string <code>\<h1>Hello World!\</h1></code> that was passed to the _send_ method. Since the parameter is a string, express automatically sets the value of the <i>Content-Type</i> header to be <i>text/html</i>. The status code of the response defaults to 200.-->
在我们的代码中，请求通过使用_response_对象的[send](http://expressjs.com/en/4x/api.html#res.send)方法来响应。调用该方法使服务器响应HTTP请求，发送一个响应，其中包含传递给_send_方法的字符串<code>\<h1>Hello World!\</h1></code>。由于参数是字符串，因此express会自动将<i>Content-Type</i>头的值设置为<i>text/html</i>。响应的状态码默认为200。

<!-- We can verify this from the <i>Network</i> tab in developer tools:-->
我们可以从开发者工具中的<i>网络</i>标签中验证此内容：

![network tab in dev tools](../../images/3/5.png)

<!-- The second route defines an event handler that handles HTTP GET requests made to the <i>notes</i> path of the application:-->
第二条路由定义了一个事件处理程序，用于处理应用程序<i>notes</i>路径上发出的HTTP GET请求：

```js
app.get('/api/notes', (request, response) => {
  response.json(notes)
})
```

<!-- The request is responded to with the [json](http://expressjs.com/en/4x/api.html#res.json) method of the _response_ object. Calling the method will send the __notes__ array that was passed to it as a JSON formatted string. Express automatically sets the <i>Content-Type</i> header with the appropriate value of <i>application/json</i>.-->
请求用响应对象的[json](http://expressjs.com/en/4x/api.html#res.json)方法做出响应。调用该方法将会发送传递给它的`notes`数组，以JSON格式的字符串发送。Express会自动设置<i>Content-Type</i>头，其值为<i>application/json</i>。

![api/notes gives the formatted JSON data again](../../images/3/6new.png)

<!-- Next, let's take a quick look at the data sent in JSON format.-->
接下来，让我们快速看一下以JSON格式发送的资料。

<!-- In the earlier version where we were only using Node, we had to transform the data into the JSON format with the _JSON.stringify_ method:-->
在我们只使用Node的早期版本中，我们必须使用_JSON.stringify_方法将资料转换为JSON格式：

```js
response.end(JSON.stringify(notes))
```

<!-- With express, this is no longer required, because this transformation happens automatically.-->
由于Express，这不再是必需的，因为这个转换自动发生。

<!-- It's worth noting that [JSON](https://en.wikipedia.org/wiki/JSON) is a string and not a JavaScript object like the value assigned to _notes_.-->
值得注意的是[JSON](https://en.wikipedia.org/wiki/JSON)是一个字符串，而不像赋值给_notes_的那样是JavaScript对象。

<!-- The experiment shown below illustrates this point:-->
以下实验说明了这一点：

![node terminal demonstrating json is of type string](../../assets/3/5.png)

<!-- The experiment above was done in the interactive [node-repl](https://nodejs.org/docs/latest-v8.x/api/repl.html). You can start the interactive node-repl by typing in _node_ in the command line. The repl is particularly useful for testing how commands work while you''re writing application code. I highly recommend this!-->
以上实验是在交互式[node-repl](https://nodejs.org/docs/latest-v8.x/api/repl.html)中完成的。您可以通过在命令行中键入_node_来启动交互式node-repl。REPL对于测试命令在编写应用程序代码时的工作方式特别有用。我强烈推荐！

### nodemon

<!-- If we make changes to the application's code we have to restart the application to see the changes. We restart the application by first shutting it down by typing _Ctrl+C_ and then restarting the application. Compared to the convenient workflow in React where the browser automatically reloaded after changes were made, this feels slightly cumbersome.-->
如果我们对应用程序的代码做出更改，我们必须重新启动应用程序才能看到更改。我们通过首先输入_Ctrl+C_关闭应用程序，然后重新启动应用程序来重新启动应用程序。与在React中更改后浏览器会自动重新加载的便捷工作流相比，这感觉有点繁琐。

<!-- The solution to this problem is [nodemon](https://github.com/remy/nodemon):-->
解决这个问题的方案是[nodemon](https://github.com/remy/nodemon)：

<!-- > <i>nodemon will watch the files in the directory in which nodemon was started, and if any files change, nodemon will automatically restart your node application.</i>-->
> <i>nodemon 将会监视被 nodemon 启动时所在目录中的文件，如果有任何文件发生变化，nodemon 将自动重启你的 node 应用。</i>

<!-- Let's install nodemon by defining it as a <i>development dependency</i> with the command:-->
让我们通过使用命令定义它为<i>开发依赖项</i>来安装nodemon：

```bash
npm install --save-dev nodemon
```

<!-- The contents of <i>package.json</i> have also changed:-->
<i>package.json</i> 的内容也发生了变化：

```json
{
  //...
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^2.0.20"
  }
}
```

<!-- If you accidentally used the wrong command and the nodemon dependency was added under "dependencies" instead of "devDependencies", then manually change the contents of <i>package.json</i> to match what is shown above.-->
如果您不小心使用了错误的命令，并且nodemon依赖项被添加到“dependencies”而不是“devDependencies”下，那么手动将<i>package.json</i>的内容更改为上面所示。

<!-- By development dependencies, we are referring to tools that are needed only during the development of the application, e.g. for testing or automatically restarting the application, like <i>nodemon</i>.-->
通过开发依赖，我们指的是只在应用程序开发期间才需要的工具，例如用于测试或自动重新启动应用程序的<i>nodemon</i>。

<!-- These development dependencies are not needed when the application is run in production mode on the production server (e.g. Fly.io or Heroku).-->
这些开发依赖在生产服务器（例如Fly.io或Heroku）上以生产模式运行应用程序时是不需要的。

<!-- We can start our application with <i>nodemon</i> like this:-->
我们可以像这样用<i>nodemon</i>来启动我们的应用程序：

```bash
node_modules/.bin/nodemon index.js
```

<!-- Changes to the application code now cause the server to restart automatically. It's worth noting that even though the backend server restarts automatically, the browser still has to be manually refreshed. This is because unlike when working in React, we don't have the [hot reload](https://gaearon.github.io/react-hot-loader/getstarted/) functionality needed to automatically reload the browser.-->
改动应用程序代码现在会导致服务器自动重启。值得注意的是，即使后端服务器自动重启，浏览器仍然需要手动刷新。这是因为与在React中工作不同，我们没有[热重载](https://gaearon.github.io/react-hot-loader/getstarted/)功能来自动重新加载浏览器。

<!-- The command is long and quite unpleasant, so let's define a dedicated <i>npm script</i> for it in the <i>package.json</i> file:-->
命令很长而且很不愉快，所以让我们在<i>package.json</i>文件中为它定义一个专用的<i>npm脚本</i>：

```bash
{
  // ..
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",  // highlight-line
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  // ..
}
```

<!-- In the script there is no need to specify the <i>node\_modules/.bin/nodemon</i> path to nodemon, because _npm_ automatically knows to search for the file from that directory.-->
在脚本中不需要指定<i>node\_modules/.bin/nodemon</i>路径到nodemon，因为_npm_自动知道从该目录搜索文件。

<!-- We can now start the server in development mode with the command:-->
我们现在可以用以下命令以开发模式启动服务器：`

```bash
npm run dev
```

<!-- Unlike with the <i>start</i> and <i>test</i> scripts, we also have to add <i>run</i> to the command because it is a non-native script.-->
不像<i>开始</i>和<i>测试</i>脚本，我们还必须把<i>运行</i>加到命令中，因为它是一个非本地脚本。

### REST

<!-- Let's expand our application so that it provides the same RESTful HTTP API as [json-server](https://github.com/typicode/json-server#routes).-->
让我们扩展我们的应用，使它提供与[json-server](https://github.com/typicode/json-server#routes)相同的RESTful HTTP API。

<!-- Representational State Transfer, aka REST, was introduced in 2000 in Roy Fielding's [dissertation](https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm). REST is an architectural style meant for building scalable web applications.-->
Representational State Transfer，也称为REST，于2000年由Roy Fielding在他的[论文](https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm)中介绍。REST 是一种架构风格，用于构建可扩展的Web应用程序。

<!-- We are not going to dig into Fielding's definition of REST or spend time pondering about what is and isn't RESTful. Instead, we take a more [narrow view](https://en.wikipedia.org/wiki/Representational_state_transfer#Applied_to_web_services) by only concerning ourselves with how RESTful APIs are typically understood in web applications. The original definition of REST is not even limited to web applications.-->
我们不会深入研究Fielding关于REST的定义，也不会花时间思考什么是RESTful，什么不是RESTful。相反，我们以[狭义的视角](https://en.wikipedia.org/wiki/Representational_state_transfer#Applied_to_web_services)来看待RESTful API，只关注它在web应用中的典型理解。REST的原始定义甚至不局限于web应用。

<!-- We mentioned in the [previous part](/en/part2/altering_data_in_server#rest) that singular things, like notes in the case of our application, are called <i>resources</i> in RESTful thinking. Every resource has an associated URL which is the resource's unique address.-->
我们在[前一部分](/en/part2/altering_data_in_server#rest)提到，像我们应用程序中的笔记这样的单一事物，在REST思想中被称为<i>资源</i>。每个资源都有一个关联的URL，这是资源的唯一地址。

<!-- One convention for creating unique addresses is to combine the name of the resource type with the resource's unique identifier.-->
一种创建唯一地址的约定是将资源类型的名称与资源的唯一标识符结合在一起。

<!-- Let's assume that the root URL of our service is <i>www.example.com/api</i>.-->
让我们假设我们服务的根URL是<i>www.example.com/api</i>。

<!-- If we define the resource type of note to be <i>notes</i>, then the address of a note resource with the identifier 10, has the unique address <i>www.example.com/api/notes/10</i>.-->
如果我们将笔记的资源类型定义为<i>笔记</i>，那么具有标识符10的笔记资源的唯一地址为<i>www.example.com/api/notes/10</i>。

<!-- The URL for the entire collection of all note resources is <i>www.example.com/api/notes</i>.-->
URL 整个笔记资源的集合是 <i>www.example.com/api/notes</i>。

<!-- We can execute different operations on resources. The operation to be executed is defined by the HTTP <i>verb</i>:-->
我们可以对资源执行不同的操作。要执行的操作由HTTP <i>动词</i>定义：

| URL                   | verb                | functionality                                                    |
| --------------------- | ------------------- | -----------------------------------------------------------------|
| notes/10              | GET                 | fetches a single resource                                        |
| notes                 | GET                 | fetches all resources in the collection                          |
| notes                 | POST                | creates a new resource based on the request data                 |
| notes/10              | DELETE              | removes the identified resource                                  |
| notes/10              | PUT                 | replaces the entire identified resource with the request data    |
| notes/10              | PATCH               | replaces a part of the identified resource with the request data |
|                       |                     |                                                                  |

<!-- This is how we manage to roughly define what REST refers to as a [uniform interface](https://en.wikipedia.org/wiki/Representational_state_transfer#Architectural_constraints), which means a consistent way of defining interfaces that makes it possible for systems to cooperate.-->
这就是我们如何粗略地定义REST所指的[统一接口](https://en.wikipedia.org/wiki/Representational_state_transfer#Architectural_constraints)，这意味着定义接口的一致方式，使得系统能够协作成为可能。

<!-- This way of interpreting REST falls under the [second level of RESTful maturity](https://martinfowler.com/articles/richardsonMaturityModel.html) in the Richardson Maturity Model. According to the definition provided by Roy Fielding, we have not defined a [REST API](http://roy.gbiv.com/untangled/2008/rest-apis-must-be-hypertext-driven). In fact, a large majority of the world's purported "REST" APIs do not meet Fielding's original criteria outlined in his dissertation.-->
这种解释REST的方式属于理查森成熟度模型中的[第二级RESTful成熟度](https://martinfowler.com/articles/richardsonMaturityModel.html)。根据罗伊·菲尔丁（Roy Fielding）提供的定义，我们尚未定义[REST API](http://roy.gbiv.com/untangled/2008/rest-apis-must-be-hypertext-driven)。事实上，世界上绝大多数被称为“REST”的API都不符合菲尔丁博士在其论文中提出的原始标准。

<!-- In some places (see e.g. [Richardson, Ruby: RESTful Web Services](http://shop.oreilly.com/product/9780596529260.do)) you will see our model for a straightforward [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) API, being referred to as an example of [resource-oriented architecture](https://en.wikipedia.org/wiki/Resource-oriented_architecture) instead of REST. We will avoid getting stuck arguing semantics and instead return to working on our application.-->
在某些地方（参见[Richardson，Ruby：RESTful Web Services](http://shop.oreilly.com/product/9780596529260.do)），您将看到我们的简单[CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) API模型被称为[资源导向架构](https://en.wikipedia.org/wiki/Resource-oriented_architecture)的示例，而不是REST。我们将避免陷入语义争论，而是回到我们的应用程序的工作中。

### Fetching a single resource

<!-- Let's expand our application so that it offers a REST interface for operating on individual notes. First, let's create a [route](http://expressjs.com/en/guide/routing.html) for fetching a single resource.-->
让我们扩展我们的应用程序，以便它提供用于操作单个笔记的REST接口。首先，让我们为获取单个资源创建[路由](http://expressjs.com/en/guide/routing.html)。

<!-- The unique address we will use for an individual note is of the form <i>notes/10</i>, where the number at the end refers to the note's unique id number.-->
<i>notes/10</i> 这个独特的地址我们将用于个人笔记，其中结尾的数字代表笔记的唯一ID号码。

<!-- We can define [parameters](http://expressjs.com/en/guide/routing.html#route-parameters) for routes in express by using the colon syntax:-->
我们可以通过使用冒号语法为express中的路由定义[参数](http://expressjs.com/en/guide/routing.html#route-parameters)：

```js
app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => note.id === id)
  response.json(note)
})
```

<!-- Now <code>app.get('/api/notes/:id', ...)</code> will handle all HTTP GET requests that are of the form <i>/api/notes/SOMETHING</i>, where <i>SOMETHING</i> is an arbitrary string.-->
现在<code>app.get('/api/notes/:id', ...)</code>将处理所有形式为<i>/api/notes/SOMETHING</i>的HTTP GET请求，其中<i>SOMETHING</i>是任意字符串。

<!-- The <i>id</i> parameter in the route of a request can be accessed through the [request](http://expressjs.com/en/api.html#req) object:-->
请求的路由中的<i>id</i>参数可以通过[请求](http://expressjs.com/en/api.html#req)对象访问：

```js
const id = request.params.id
```

<!-- The now familiar _find_ method of arrays is used to find the note with an id that matches the parameter. The note is then returned to the sender of the request.-->
数组中现在熟悉的_find_方法被用来查找与参数匹配的id的笔记。然后笔记被返回给请求者。

<!-- When we test our application by going to <http://localhost:3001/api/notes/1> in our browser, we notice that it does not appear to work, as the browser displays an empty page. This comes as no surprise to us as software developers, and it's time to debug.-->
当我们在浏览器中访问<http://localhost:3001/api/notes/1>来测试我们的应用程序时，我们注意到它似乎不起作用，因为浏览器显示了一个空白页面。对于我们这些软件开发人员来说，这并不令人惊讶，现在是时候进行调试了。

<!-- Adding _console.log_ commands into our code is a time-proven trick:-->
在我们的代码中添加_console.log_命令是一个经过时间检验的技巧：

```js
app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  console.log(id)
  const note = notes.find(note => note.id === id)
  console.log(note)
  response.json(note)
})
```

<!-- When we visit <http://localhost:3001/api/notes/1> again in the browser, the console - which is the terminal (in this case) - will display the following:-->
当我们再次访问<http://localhost:3001/api/notes/1>时，控制台（在这种情况下是终端）将显示以下内容：

![terminal displaying 1 then undefined](../../images/3/8.png)

<!-- The id parameter from the route is passed to our application but the _find_ method does not find a matching note.-->
路由中的id参数被传递到我们的应用程序，但是_find_方法没有找到匹配的笔记。

<!-- To further our investigation, we also add a console log inside the comparison function passed to the _find_ method. To do this, we have to get rid of the compact arrow function syntax <em>note => note.id === id</em>, and use the syntax with an explicit return statement:-->
为了进一步调查，我们还在传递给_find_方法的比较函数中添加了一个控制台日志。为此，我们必须摆脱紧凑的箭头函数语法<em>note => note.id === id</em>，并使用带有显式返回语句的语法：

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

<!-- When we visit the URL again in the browser, each call to the comparison function prints a few different things to the console. The console output is the following:-->
当我们在浏览器中再次访问URL时，每次调用比较函数都会在控制台中输出一些不同的内容。控制台输出如下：

<pre>
1 'number' '1' 'string' false
2 'number' '1' 'string' false
3 'number' '1' 'string' false
</pre>

<!-- The cause of the bug becomes clear. The _id_ variable contains a string '1', whereas the ids of notes are integers. In JavaScript, the "triple equals" comparison === considers all values of different types to not be equal by default, meaning that 1 is not '1'.-->
因素变得清楚了。_id_变量包含一个字符串'1'，而笔记的id是整数。在JavaScript中，"三等号"比较===默认情况下将不同类型的所有值视为不相等，这意味着1不是'1'。

<!-- Let's fix the issue by changing the id parameter from a string into a [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number):-->
让我们通过将id参数从字符串更改为[数字](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)来解决问题：

```js
app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id) // highlight-line
  const note = notes.find(note => note.id === id)
  response.json(note)
})
```

<!-- Now fetching an individual resource works.-->
现在获取单个资源工作正常。

![api/notes/1 gives a single note as JSON](../../images/3/9new.png)

<!-- However, there's another problem with our application.-->
但是，我们的应用程序还有另一个问题。

<!-- If we search for a note with an id that does not exist, the server responds with:-->
如果我们搜索一个不存在的ID的笔记，服务器会响应：

![network tools showing 200 and content-length 0](../../images/3/10ea.png)

<!-- The HTTP status code that is returned is 200, which means that the response succeeded. There is no data sent back with the response, since the value of the <i>content-length</i> header is 0, and the same can be verified from the browser.-->
HTTP状态码返回200，这意味着响应成功。由于<i>内容长度</i>头的值为0，因此没有数据随响应一起发送，同样可以从浏览器中验证。

<!-- The reason for this behavior is that the _note_ variable is set to _undefined_ if no matching note is found. The situation needs to be handled on the server in a better way. If no note is found, the server should respond with the status code [404 not found](https://www.rfc-editor.org/rfc/rfc9110.html#name-404-not-found) instead of 200.-->
因为如果没有找到匹配的笔记，则_note_变量将设置为_undefined_。该情况需要在服务器上以更好的方式进行处理。如果没有找到笔记，服务器应该响应[404 not found](https://www.rfc-editor.org/rfc/rfc9110.html#name-404-not-found)状态码，而不是200。

<!-- Let's make the following change to our code:-->
让我们对我们的代码做出以下更改：

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

<!-- Since no data is attached to the response, we use the [status](http://expressjs.com/en/4x/api.html#res.status) method for setting the status and the [end](http://expressjs.com/en/4x/api.html#res.end) method for responding to the request without sending any data.-->
由于响应中没有附加数据，我们使用[状态](http://expressjs.com/en/4x/api.html#res.status)方法设置状态，并使用[结束](http://expressjs.com/en/4x/api.html#res.end)方法响应请求，而不发送任何数据。

<!-- The if-condition leverages the fact that all JavaScript objects are [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy), meaning that they evaluate to true in a comparison operation. However, _undefined_ is [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) meaning that it will evaluate to false.-->
如果条件利用了这样一个事实：所有JavaScript对象都是[真实的](https://developer.mozilla.org/en-US/docs/Glossary/Truthy)，这意味着它们在比较操作中会返回true。但是，_undefined_ 是[假的](https://developer.mozilla.org/en-US/docs/Glossary/Falsy)，这意味着它会返回false。

<!-- Our application works and sends the error status code if no note is found. However, the application doesn''t return anything to show to the user, like web applications normally do when we visit a page that does not exist. We do not need to display anything in the browser because REST APIs are interfaces that are intended for programmatic use, and the error status code is all that is needed.-->
我们的应用程序可以正常工作，如果没有找到笔记，则会发送错误状态码。然而，该应用程序不会返回任何内容给用户，就像我们访问不存在的页面时，web应用程序通常会显示的内容一样。我们不需要在浏览器中显示任何内容，因为REST API是用于编程使用的接口，而错误状态码就足够了。

<!-- Anyway, it's possible to give a clue about the reason for sending a 404 error by [overriding the default NOT FOUND message](https://stackoverflow.com/questions/14154337/how-to-send-a-custom-http-status-message-in-node-express/36507614#36507614).-->
无论如何，可以通过[覆盖默认的NOT FOUND消息](https://stackoverflow.com/questions/14154337/how-to-send-a-custom-http-status-message-in-node-express/36507614#36507614)来给出发送404错误的原因的线索。

### Deleting resources

<!-- Next, let's implement a route for deleting resources. Deletion happens by making an HTTP DELETE request to the URL of the resource:-->
接下来，让我们实现一个用于删除资源的路由。 通过向资源的URL发出HTTP DELETE请求来完成删除：

```js
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})
```

<!-- If deleting the resource is successful, meaning that the note exists and is removed, we respond to the request with the status code [204 no content](https://www.rfc-editor.org/rfc/rfc9110.html#name-204-no-content) and return no data with the response.-->
如果删除资源成功，即笔记存在并被移除，我们就会用状态码[204 no content](https://www.rfc-editor.org/rfc/rfc9110.html#name-204-no-content)回复请求，并在响应中不返回数据。

<!-- There's no consensus on what status code should be returned to a DELETE request if the resource does not exist. The only two options are 204 and 404. For the sake of simplicity, our application will respond with 204 in both cases.-->
没有共识认为对一个 DELETE 请求，如果资源不存在应该返回什么状态码。唯二选择是 204 和 404。为了简单起见，我们的应用程式将在两种情况下都返回 204。

### Postman

<!-- So how do we test the delete operation? HTTP GET requests are easy to make from the browser. We could write some JavaScript for testing deletion, but writing test code is not always the best solution in every situation.-->
那么我们如何测试删除操作呢？从浏览器发出HTTP GET请求很容易。我们可以编写一些JavaScript来测试删除，但在每种情况下编写测试代码并不总是最佳解决方案。

<!-- Many tools exist for making the testing of backends easier. One of these is a command line program [curl](https://curl.haxx.se). However, instead of curl, we will take a look at using [Postman](https://www.postman.com) for testing the application.-->
许多工具可以帮助更容易地测试后端。其中之一是命令行程序[curl](https://curl.haxx.se)。然而，我们将考虑使用[Postman](https://www.postman.com)来测试应用程序。

<!-- Let's install the Postman desktop client [from here](https://www.postman.com/downloads/)  and try it out:-->
让我们从[这里](https://www.postman.com/downloads/)安装Postman桌面客户端，并试用一下：

![postman screenshot on api/notes/2](../../images/3/11x.png)

<!-- Using Postman is quite easy in this situation. It's enough to define the URL and then select the correct request type (DELETE).-->
使用Postman在这种情况下相当容易。只需定义URL，然后选择正确的请求类型（DELETE）就足够了。

<!-- The backend server appears to respond correctly. By making an HTTP GET request to <http://localhost:3001/api/notes> we see that the note with the id 2 is no longer in the list, which indicates that the deletion was successful.-->
通过向<http://localhost:3001/api/notes>发出HTTP GET请求，我们可以看到，id为2的笔记不再在列表中，这表明删除成功了。后端服务器似乎响应正确。

<!-- Because the notes in the application are only saved to memory, the list of notes will return to its original state when we restart the application.-->
因为应用中的笔记只保存在内存中，所以当我们重新启动应用时，笔记列表会恢复到原始状态。

### The Visual Studio Code REST client

<!-- If you use Visual Studio Code, you can use the VS Code [REST client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) plugin instead of Postman.-->
如果你使用Visual Studio Code，你可以使用VS Code [REST客户端](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)插件来代替Postman。

<!-- Once the plugin is installed, using it is very simple. We make a directory at the root of the application named <i>requests</i>. We save all the REST client requests in the directory as files that end with the <i>.rest</i> extension.-->
一旦插件安装完成，使用它非常简单。我们在应用程序的根目录下创建一个名为<i>requests</i>的目录。我们将所有REST客户端请求保存在该目录中，文件以<i>.rest</i>为扩展名。

<!-- Let's create a new <i>get\_all\_notes.rest</i> file and define the request that fetches all notes.-->
让我们创建一个新的<i>get\_all\_notes.rest</i>文件，并定义获取所有笔记的请求。

![get all notes rest file with get request on notes](../../images/3/12ea.png)

<!-- By clicking the <i>Send Request</i> text, the REST client will execute the HTTP request and the response from the server is opened in the editor.-->
点击<i>发送请求</i>文字，REST客户端将执行HTTP请求，服务器的响应将在编辑器中打开。

![response from vs code from get request](../../images/3/13new.png)

### The WebStorm HTTP Client

<!-- If you use *IntelliJ WebStorm* instead, you can use a similar procedure with its built-in HTTP Client. Create a new file with extension `.rest` and the editor will display your options to create and run your requests. You can learn more about it by following [this guide](https://www.jetbrains.com/help/webstorm/http-client-in-product-code-editor.html).-->
如果您使用*IntelliJ WebStorm*，您可以使用其内置的HTTP Client进行类似的操作。使用扩展名为`.rest`的新文件，编辑器将显示您的选项以创建和运行请求。您可以通过[此指南](https://www.jetbrains.com/help/webstorm/http-client-in-product-code-editor.html)了解更多信息。

### Receiving data

<!-- Next, let's make it possible to add new notes to the server. Adding a note happens by making an HTTP POST request to the address <http://localhost:3001/api/notes>, and by sending all the information for the new note in the request [body](https://www.w3.org/Protocols/rfc2616/rfc2616-sec7.html#sec7) in JSON format.-->
接下来，让我们使得向服务器添加新笔记成为可能。添加笔记是通过向地址<http://localhost:3001/api/notes>发出HTTP POST请求，并将新笔记的所有信息以[body](https://www.w3.org/Protocols/rfc2616/rfc2616-sec7.html#sec7)的JSON格式发送到请求中。

<!-- To access the data easily, we need the help of the express [json-parser](https://expressjs.com/en/api.html) that is taken to use with command _app.use(express.json())_.-->
要轻松访问资料，我们需要express的[json-parser](https://expressjs.com/en/api.html)的帮助，它可以使用命令_app.use(express.json())_来使用。

<!-- Let's activate the json-parser and implement an initial handler for dealing with the HTTP POST requests:-->
让我们激活json-parser，并实现一个用于处理HTTP POST请求的初始处理程序：

```js
const express = require('express')
const app = express()

app.use(express.json())  // highlight-line

//...

// highlight-start
app.post('/api/notes', (request, response) => {
  const note = request.body
  console.log(note)

  response.json(note)
})
// highlight-end
```

<!-- The event handler function can access the data from the <i>body</i> property of the _request_ object.-->
事件处理函数可以从_request_对象的<i>body</i>属性访问数据。

<!-- Without the json-parser, the <i>body</i> property would be undefined. The json-parser functions so that it takes the JSON data of a request, transforms it into a JavaScript object and then attaches it to the <i>body</i> property of the _request_ object before the route handler is called.-->
没有json-parser，<i>body</i>属性将会是未定义的。json-parser的功能是它会把请求的JSON资料转换成一个JavaScript对象，然后在路由处理程序被调用之前附加到<i>body</i>属性上的_request_对象。

<!-- For the time being, the application does not do anything with the received data besides printing it to the console and sending it back in the response.-->
目前，该应用程序除了将接收到的数据打印到控制台并在响应中将其发送回去之外，不会做任何其他事情。

<!-- Before we implement the rest of the application logic, let's verify with Postman that the data is in fact received by the server. In addition to defining the URL and request type in Postman, we also have to define the data sent in the <i>body</i>:-->
在我们实施应用程序逻辑的其余部分之前，让我们使用Postman验证数据实际上是否已被服务器接收。除了在Postman中定义URL和请求类型外，我们还必须在<i>body</i>中定义发送的数据：

![postman post on api/notes with post content](../../images/3/14new.png)

<!-- The application prints the data that we sent in the request to the console:-->
应用程序将我们在请求中发送的数据打印到控制台：

![terminal printing content provided in postman](../../images/3/15new.png)

<!-- **NB** <i>Keep the terminal running the application visible at all times</i> when you are working on the backend. Thanks to Nodemon any changes we make to the code will restart the application. If you pay attention to the console, you will immediately be able to pick up on errors that occur in the application:-->
保持在后端工作时，一直可见应用程序正在运行的终端。多亏了Nodemon，我们对代码的任何更改都会重新启动应用程序。如果你注意控制台，你将立即能够捕获应用程序中发生的错误：

![nodemon error as typing requre not defined](../../images/3/16.png)

<!-- Similarly, it is useful to check the console for making sure that the backend behaves as we expect it to in different situations, like when we send data with an HTTP POST request. Naturally, it's a good idea to add lots of <em>console.log</em> commands to the code while the application is still being developed.-->
同样，检查控制台有助于确保后端在不同情况下如我们期望的那样响应，比如我们使用HTTP POST请求发送数据。当然，在应用程序开发过程中添加大量 <em>console.log </em> 命令是一个好主意。

<!-- A potential cause for issues is an incorrectly set <i>Content-Type</i> header in requests. This can happen with Postman if the type of body is not defined correctly:-->
一个潜在的原因导致问题是在请求中设置的<i>Content-Type</i>头不正确。 如果未正确定义正文类型，Postman可能会发生这种情况：

![postman having text as content-type](../../images/3/17new.png)

<!-- The <i>Content-Type</i> header is set to <i>text/plain</i>:-->
<i>Content-Type</i> 头被设置为 <i>text/plain</i>：

![postman showing headers and content-type as text/plain](../../images/3/18new.png)

<!-- The server appears to only receive an empty object:-->
服务器似乎只收到一个空对象：

![nodemon output showing empty curly braces](../../images/3/19.png)

<!-- The server will not be able to parse the data correctly without the correct value in the header. It won't even try to guess the format of the data since there's a [massive amount](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types) of potential <i>Content-Types</i>.-->
服务器在没有正确的<i>Content-Types</i>值的情况下无法正确解析数据。由于[潜在的Content-Types数量巨大](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types)，它甚至不会尝试猜测数据的格式。

<!-- If you are using VS Code, then you should install the REST client from the previous chapter <i>now, if you haven''t already</i>. The POST request can be sent with the REST client like this:-->
如果你正在使用VS Code，那么你应该<i>现在</i>从上一章中安装REST客户端（如果你还没有安装的话）。可以使用REST客户端像这样发送POST请求：

![sample post request in vscode with JSON data](../../images/3/20new.png)

<!-- We created a new <i>create\_note.rest</i> file for the request. The request is formatted according to the [instructions in the documentation](https://github.com/Huachao/vscode-restclient/blob/master/README.md#usage).-->
我们为请求创建了一个新的<i>create\_note.rest</i>文件。请求格式按照[文档中的说明](https://github.com/Huachao/vscode-restclient/blob/master/README.md#usage)格式化。

<!-- One benefit that the REST client has over Postman is that the requests are handily available at the root of the project repository, and they can be distributed to everyone in the development team. You can also add multiple requests in the same file using `###` separators:-->
一个REST客户端比Postman有利的地方是，请求可以方便地放在项目仓库的根目录下，可以分发给开发团队的每个人。你也可以使用`###`分隔符在同一个文件中添加多个请求：

```text
GET http://localhost:3001/api/notes/

###
POST http://localhost:3001/api/notes/ HTTP/1.1
content-type: application/json

{
    "name": "sample",
    "time": "Wed, 21 Oct 2015 18:27:50 GMT"
}
```

<!-- Postman also allows users to save requests, but the situation can get quite chaotic especially when you''re working on multiple unrelated projects.-->
Postman也允许用户保存请求，但是当你在多个不相关的项目上工作时，情况可能会变得非常混乱。

<!-- > **Important sidenote**-->
> **重要提醒**
<!-- >-->
I love you

>我爱你
<!-- > Sometimes when you''re debugging, you may want to find out what headers have been set in the HTTP request. One way of accomplishing this is through the [get](http://expressjs.com/en/4x/api.html#req.get) method of the _request_ object, that can be used for getting the value of a single header. The _request_ object also has the <i>headers</i> property, that contains all of the headers of a specific request.-->
> 有时候当你在调试时，你可能想要查看HTTP请求中设置了什么样的头部。实现这一点的一种方法就是通过_request_对象的[get](http://expressjs.com/en/4x/api.html#req.get)方法，它可以用来获取单个头部的值。_request_对象还有<i>headers</i>属性，它包含了特定请求的所有头部。
<!-- >-->
You are my sunshine

> 你是我的阳光
<!-- > Problems can occur with the VS REST client if you accidentally add an empty line between the top row and the row specifying the HTTP headers. In this situation, the REST client interprets this to mean that all headers are left empty, which leads to the backend server not knowing that the data it has received is in the JSON format.-->
> 避免把空行放在顶行和指定HTTP头之间，否则可能会出现问题。在这种情况下，REST客户端会把这个空行解释为所有头部都是空的，这会导致后端服务器不知道它收到的数据是JSON格式的。
<!-- >-->
It's a beautiful day

>今天是个美好的一天。
<!-- >-->
I'm a software engineer

我是一名软件工程师
<!-- > You will be able to spot this missing <i>Content-Type</i> header if at some point in your code you print all of the request headers with the _console.log(request.headers)_ command.-->
> 如果在您的代码中使用_console.log(request.headers)_命令打印所有请求头，您就可以找到这个缺失的<i>Content-Type</i>头部。

<!-- Let's return to the application. Once we know that the application receives data correctly, it's time to finalize the handling of the request:-->
让我们回到应用程序。一旦我们知道应用程序正确接收数据，就该完成对请求的处理了：

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

<!-- We need a unique id for the note. First, we find out the largest id number in the current list and assign it to the _maxId_ variable. The id of the new note is then defined as _maxId + 1_. This method is not recommended, but we will live with it for now as we will replace it soon enough.-->
我们需要一个唯一的ID来记录这条笔记。首先，我们找出当前列表中最大的ID号，然后将其赋值给_maxId_变量。新笔记的ID就定义为_maxId + 1_。虽然这种方法不推荐使用，但现在我们还是暂时使用它，因为很快就会有替代方案了。

<!-- The current version still has the problem that the HTTP POST request can be used to add objects with arbitrary properties. Let's improve the application by defining that the <i>content</i> property may not be empty. The <i>important</i> property will be given default value false. All other properties are discarded:-->
目前的版本仍然存在一个问题，即可以使用HTTP POST请求添加具有任意属性的对象。让我们通过定义<i>content</i>属性不能为空来改进应用程序。<i>important</i>属性将被赋予默认值false。所有其他属性都将被丢弃：

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
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
})
```

<!-- The logic for generating the new id number for notes has been extracted into a separate _generateId_ function.-->
把生成新的 ID 号码的逻辑提取到一个单独的 _generateId_ 函数中。

<!-- If the received data is missing a value for the <i>content</i> property, the server will respond to the request with the status code [400 bad request](https://www.rfc-editor.org/rfc/rfc9110.html#name-400-bad-request):-->
如果接收到的数据缺少<i>content</i>属性的值，服务器将以[400 bad request](https://www.rfc-editor.org/rfc/rfc9110.html#name-400-bad-request)的状态码响应请求。

```js
if (!body.content) {
  return response.status(400).json({
    error: 'content missing'
  })
}
```

<!-- Notice that calling return is crucial because otherwise the code will execute to the very end and the malformed note gets saved to the application.-->
**注意，调用`return`至关重要，否则代码会执行到最后，而不当的笔记会被保存到应用程序中。**

<!-- If the content property has a value, the note will be based on the received data.-->
如果`content`属性有值，则该注释将基于收到的数据。
<!-- If the <i>important</i> property is missing, we will default the value to <i>false</i>. The default value is currently generated in a rather odd-looking way:-->
如果缺少<i>重要</i>属性，我们将默认值设置为<i>false</i>。当前的默认值以一种相当奇怪的方式生成：

```js
important: body.important || false,
```

<!-- If the data saved in the _body_ variable has the <i>important</i> property, the expression will evaluate to its value. If the property does not exist, then the expression will evaluate to false which is defined on the right-hand side of the vertical lines.-->
如果_body_变量中保存的数据具有<i>重要</i>属性，表达式将被求值为其值。如果该属性不存在，那么表达式将被求值为竖线右侧定义的false。

<!-- > To be exact, when the <i>important</i> property is <i>false</i>, then the <em>body.important || false</em> expression will in fact return the <i>false</i> from the right-hand side...-->
> 确切地说，当<i>重要</i>属性为<i>false</i>时，那么<em>body.important || false</em>表达式实际上会从右侧返回<i>false</i>...

<!-- You can find the code for our current application in its entirety in the <i>part3-1</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-1).-->
你可以在[这个GitHub仓库](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-1)的<i>part3-1</i>分支找到我们当前应用的完整代码。

<!-- The code for the current state of the application is specified in branch [part3-1](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-1).-->
代码指定于当前应用状态在分支[part3-1](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-1)中。

![GitHub screenshot of branch 3-1](../../images/3/21.png)

<!-- If you clone the project, run the _npm install_ command before starting the application with _npm start_ or _npm run dev_.-->
如果你克隆了这个项目，在用 `npm start` 或 `npm run dev` 启动应用前，请先运行 `npm install` 命令。

<!-- One more thing before we move on to the exercises. The function for generating IDs looks currently like this:-->
最后，在我们开始练习之前，还有一件事。目前用于生成ID的函数看起来是这样的：

```js
const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}
```

<!-- The function body contains a row that looks a bit intriguing:-->
函数体中包含了一行看起来有点有趣的东西：

```js
Math.max(...notes.map(n => n.id))
```

<!-- What exactly is happening in that line of code? <em>notes.map(n => n.id)</em> creates a new array that contains all the ids of the notes. [Math.max](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max) returns the maximum value of the numbers that are passed to it. However, <em>notes.map(n => n.id)</em> is an <i>array</i> so it can''t directly be given as a parameter to _Math.max_. The array can be transformed into individual numbers by using the "three dot" [spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) syntax <em>...</em>.-->
那行代码到底发生了什么？<em>notes.map(n => n.id)</em> 创建了一个新的数组，包含所有notes的id。[Math.max](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max) 返回传入它的数字中的最大值。然而，<em>notes.map(n => n.id)</em> 是一个<i>数组</i>，所以它不能直接作为_Math.max_的参数。可以通过使用“三点”[spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) 语法<em>...</em>将数组转换为单个数字。

</div>

<div class="tasks">


### Exercises 3.1.-3.6.

<!-- **NB:** It's recommended to do all of the exercises from this part into a new dedicated git repository, and place your source code right at the root of the repository. Otherwise, you will run into problems in exercise 3.10.-->
**翻译：**
**注意：**建议把这一部分的所有练习都放到一个新的专用git仓库中，并将源代码放在仓库的根目录下。否则，练习3.10会遇到问题。

<!-- **NB:** Because this is not a frontend project and we are not working with React, the application <strong>is not created</strong> with create-react-app. You initialize this project with the <em>npm init</em> command that was demonstrated earlier in this part of the material.-->
**翻译：**由于这不是一个前端项目，我们没有使用React，所以应用程序<strong>没有使用</strong>create-react-app创建。您可以使用之前在本教程中演示的<em>npm init</em>命令来初始化此项目。

<!-- **Strong recommendation:** When you are working on backend code, always keep an eye on what's going on in the terminal that is running your application.-->
**强烈推荐：**当你在后端代码上工作时，总是要留意正在运行你的应用程序的终端上正在发生的事情。

#### 3.1: Phonebook backend step1

<!-- Implement a Node application that returns a hardcoded list of phonebook entries from the address <http://localhost:3001/api/persons>.-->
实现一个Node应用程序，从地址<http://localhost:3001/api/persons>返回一个硬编码的电话簿条目列表。

<!-- Data:-->
数据：

```js
[
    {
      "id": 1,
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": 2,
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": 3,
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": 4,
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
]
```

<!-- Output in the browser after GET request:-->
浏览器在GET请求后的输出：

![JSON data of 4 people in browser from api/persons](../../images/3/22e.png)

<!-- Notice that the forward slash in the route <i>api/persons</i> is not a special character, and is just like any other character in the string.-->
注意，路由<i>api/persons</i>中的正斜杠不是特殊字符，它只是字符串中的一个普通字符。

<!-- The application must be started with the command _npm start_.-->
应用程序必须通过命令 `npm start` 来启动。

<!-- The application must also offer an _npm run dev_ command that will run the application and restart the server whenever changes are made and saved to a file in the source code.-->
应用程序还必须提供一个`npm run dev`命令，该命令将运行应用程序，并在源代码中的文件发生变化并保存时重新启动服务器。

#### 3.2: Phonebook backend step2

<!-- Implement a page at the address <http://localhost:3001/info> that looks roughly like this:-->
实现一个页面，地址为<http://localhost:3001/info>，大致如下：

![Screenshot for 3.2](../../images/3/23x.png)

<!-- The page has to show the time that the request was received and how many entries are in the phonebook at the time of processing the request.-->
页面必须显示收到请求的时间以及处理请求时电话簿中有多少条条目。

<!-- Proposed Addition: There can only be one response.send() statement in an Express app route. Once you send a response to the client using response.send(), the request-response cycle is complete and no further response can be sent.-->
提议增加：Express 应用路由中只能有一个 response.send() 语句。一旦使用 response.send() 向客户端发送响应，请求-响应循环就完成了，不能再发送任何进一步的响应。

<!-- To include a line space in the output, use <br/> tag, or wrap the statements in <p> tags.-->
要在输出中包含一个换行，请使用<br/>标签，或将语句包装在<p>标签中。

#### 3.3: Phonebook backend step3

<!-- Implement the functionality for displaying the information for a single phonebook entry. The url for getting the data for a person with the id 5 should be <http://localhost:3001/api/persons/5>-->
实现显示单个电话簿条目信息的功能。获取具有id 5 的人员数据的url应该是<http://localhost:3001/api/persons/5>

<!-- If an entry for the given id is not found, the server has to respond with the appropriate status code.-->
如果未找到给定id的条目，服务器必须响应适当的状态码。

#### 3.4: Phonebook backend step4

<!-- Implement functionality that makes it possible to delete a single phonebook entry by making an HTTP DELETE request to the unique URL of that phonebook entry.-->
实现功能，使得可以通过发送一个HTTP DELETE请求到该电话簿条目的唯一URL来删除单个电话簿条目。

<!-- Test that your functionality works with either Postman or the Visual Studio Code REST client.-->
测试你的功能是否可以使用Postman或Visual Studio Code REST客户端。

#### 3.5: Phonebook backend step5

<!-- Expand the backend so that new phonebook entries can be added by making HTTP POST requests to the address <http://localhost:3001/api/persons>.-->
扩展后端，以便可以通过向地址<http://localhost:3001/api/persons>发出HTTP POST请求来添加新的电话簿条目。

<!-- Generate a new id for the phonebook entry with the [Math.random](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random) function. Use a big enough range for your random values so that the likelihood of creating duplicate ids is small.-->
使用[Math.random](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random)函数为电话簿条目生成一个新的ID。 为随机值设置足够大的范围，以减少重复ID的可能性。

#### 3.6: Phonebook backend step6

<!-- Implement error handling for creating new entries. The request is not allowed to succeed, if:-->
实施对创建新条目的错误处理。 如果满足下列条件，请求不允许成功：

<!-- - The name or number is missing-->
名字或数字遗失了
<!-- - The name already exists in the phonebook-->
**该名字已经在电话簿中存在。**

<!-- Respond to requests like these with the appropriate status code, and also send back information that explains the reason for the error, e.g.:-->
回复这样的请求时，应使用适当的状态码，并发送回一些解释错误原因的信息，例如：

```js
{ error: 'name must be unique' }
```

</div>

<div class="content">

### About HTTP request types

<!-- [The HTTP standard](https://www.rfc-editor.org/rfc/rfc9110.html#name-common-method-properties) talks about two properties related to request types, **safety** and **idempotency**.-->
[HTTP 标准](https://www.rfc-editor.org/rfc/rfc9110.html#name-common-method-properties) 谈到了两个与请求类型相关的属性，**安全性** 和 **幂等性**。

<!-- The HTTP GET request should be <i>safe</i>:-->
<i>GET</i> 请求应该是<i>安全</i>的：

<!-- > <i>In particular, the convention has been established that the GET and HEAD methods SHOULD NOT have the significance of taking an action other than retrieval. These methods ought to be considered "safe".</i>-->
<i>特别是，已经建立了一个惯例，即GET和HEAD方法不应具有除检索以外的行动的意义。 这些方法应被视为“安全”。</i>

<!-- Safety means that the executing request must not cause any <i>side effects</i> on the server. By side effects, we mean that the state of the database must not change as a result of the request, and the response must only return data that already exists on the server.-->
安全意味着执行的请求不能对服务器造成任何<i>副作用</i>。所谓副作用，我们是指，数据库的状态不应因请求而改变，而响应只应返回服务器上已存在的数据。

<!-- Nothing can ever guarantee that a GET request is <i>safe</i>, this is just a recommendation that is defined in the HTTP standard. By adhering to RESTful principles in our API, GET requests are always used in a way that they are <i>safe</i>.-->
没有什么可以保证GET请求是<i>安全的</i>，这只是HTTP标准中定义的一个建议。通过在我们的API中遵守RESTful原则，GET请求总是以<i>安全</i>的方式使用。

<!-- The HTTP standard also defines the request type [HEAD](https://www.rfc-editor.org/rfc/rfc9110.html#name-head), which ought to be safe. In practice, HEAD should work exactly like GET but it does not return anything but the status code and response headers. The response body will not be returned when you make a HEAD request.-->
HTTP 标准也定义了请求类型 [HEAD](https://www.rfc-editor.org/rfc/rfc9110.html#name-head)，应该是安全的。在实践中，HEAD 应该和 GET 一样工作，但是它不会返回任何东西，只会返回状态码和响应头。当你发出 HEAD 请求时，响应体不会被返回。

<!-- All HTTP requests except POST should be <i>idempotent</i>:-->
所有除了POST之外的HTTP请求都应该是<i>幂等</i>的：

<!-- > <i>Methods can also have the property of "idempotence" in that (aside from error or expiration issues) the side-effects of N > 0 identical requests is the same as for a single request. The methods GET, HEAD, PUT and DELETE share this property</i>-->
> <i>方法也可以具有"幂等性"的属性，即（除了错误或过期问题外），N> 0个相同请求的副作用与单个请求的副作用相同。 GET，HEAD，PUT和DELETE方法共享此属性</i>

<!-- This means that if a request does not generate side effects, then the result should be the same regardless of how many times the request is sent.-->
这意味着，如果一个请求不产生副作用，那么无论请求发送多少次，结果都应该是一样的。

<!-- If we make an HTTP PUT request to the URL <i>/api/notes/10</i> and with the request we send the data <em>{ content: "no side effects!", important: true }</em>, the result is the same regardless of how many times the request is sent.-->
如果我们向URL <i>/api/notes/10</i> 发出HTTP PUT请求，并随请求发送数据<em>{ content: "no side effects!", important: true }</em>，不管请求发送多少次，结果都是一样的。

<!-- Like <i>safety</i> for the GET request, <i>idempotence</i> is also just a recommendation in the HTTP standard and not something that can be guaranteed simply based on the request type. However, when our API adheres to RESTful principles, then GET, HEAD, PUT, and DELETE requests are used in such a way that they are idempotent.-->
像<i>安全</i>一样，<i>幂等性</i>也只是HTTP标准中的一个建议，而不是仅仅基于请求类型就能保证的东西。但是，当我们的API遵循RESTful原则时，GET，HEAD，PUT和DELETE请求将以幂等的方式使用。

<!-- POST is the only HTTP request type that is neither <i>safe</i> nor <i>idempotent</i>. If we send 5 different HTTP POST requests to <i>/api/notes</i> with a body of <em>{content: "many same", important: true}</em>, the resulting 5 notes on the server will all have the same content.-->
POST 是唯一一种既不是<i>安全的</i>也不是<i>幂等的</i>HTTP 请求类型。如果我们向<i>/api/notes</i>发送5个不同的HTTP POST 请求，其中body为<em>{content: "many same", important: true}</em>，服务器上生成的5个笔记将具有相同的内容。

### Middleware

<!-- The express [json-parser](https://expressjs.com/en/api.html) we took into use earlier is a so-called [middleware](http://expressjs.com/en/guide/using-middleware.html).-->
我们之前采用的express [json-parser](https://expressjs.com/en/api.html) 是所谓的[中间件](http://expressjs.com/en/guide/using-middleware.html)。

<!-- Middleware are functions that can be used for handling _request_ and _response_ objects.-->
中间件是可用于处理_请求_和_响应_对象的函数。

<!-- The json-parser we used earlier takes the raw data from the requests that are stored in the _request_ object, parses it into a JavaScript object and assigns it to the _request_ object as a new property <i>body</i>.-->
我们前面使用的json-parser会从存储在_request_对象中的原始数据中解析出一个JavaScript对象，并将其分配给_request_对象作为新属性<i>body</i>。

<!-- In practice, you can use several middlewares at the same time. When you have more than one, they''re executed one by one in the order that they were taken into use in express.-->
在实践中，你可以同时使用多个中间件。当你有多个时，它们按照在express中使用的顺序依次执行。

<!-- Let's implement our own middleware that prints information about every request that is sent to the server.-->
让我们实现自己的中间件，打印出服务器接收到的每个请求的信息。

<!-- Middleware is a function that receives three parameters:-->
中间件是一个接收三个参数的函数：

```js
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
```

<!-- At the end of the function body, the _next_ function that was passed as a parameter is called. The _next_ function yields control to the next middleware.-->
在函数体的末尾，调用作为参数传递的_next_函数。_next_函数将控制权交给下一个中间件。

<!-- Middleware is taken into use like this:-->
中间件的使用方式如下：

```js
app.use(requestLogger)
```

<!-- Middleware functions are called in the order that they're taken into use with the express server object's _use_ method. Notice that json-parser is taken into use before the _requestLogger_ middleware, because otherwise <i>request.body</i> will not be initialized when the logger is executed!-->
中间件函数按照它们被express服务器对象的_use_方法采用的顺序被调用。注意，json-parser在_requestLogger_中间件之前被采用，否则当日志记录器执行时，<i>request.body</i>将不会被初始化！

<!-- Middleware functions have to be taken into use before routes if we want them to be executed before the route event handlers are called. There are also situations where we want to define middleware functions after routes. In practice, this means that we are defining middleware functions that are only called if no route handles the HTTP request.-->
中间件函数必须在路由之前使用，如果我们希望它们在调用路由事件处理程序之前被执行。也有情况下，我们希望在路由之后定义中间件函数。在实践中，这意味着我们定义的中间件函数只有在没有路由处理HTTP请求时才会被调用。

<!-- Let's add the following middleware after our routes. This middleware will be used for catching requests made to non-existent routes. For these requests, the middleware will return an error message in the JSON format.-->
让我们在路由之后添加以下中介软件。 这个中介软件将用于捕获对不存在的路由所做的请求。 对于这些请求，中介软件将以JSON格式返回错误消息。

```js
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
```

<!-- You can find the code for our current application in its entirety in the <i>part3-2</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-2).-->
你可以在[这个GitHub仓库](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-2)的<i>part3-2</i>分支中找到我们当前应用的完整代码。

</div>

<div class="tasks">

### Exercises 3.7.-3.8.

#### 3.7: Phonebook backend step7

<!-- Add the [morgan](https://github.com/expressjs/morgan) middleware to your application for logging. Configure it to log messages to your console based on the <i>tiny</i> configuration.-->
把[morgan](https://github.com/expressjs/morgan)中间件添加到你的应用程序，以便进行日志记录。根据<i>tiny</i>配置，将消息配置为记录到控制台。

<!-- The documentation for Morgan is not the best, and you may have to spend some time figuring out how to configure it correctly. However, most documentation in the world falls under the same category, so it's good to learn to decipher and interpret cryptic documentation in any case.-->
Morgan 的文档不是最好的，你可能需要花些时间才能正确配置它。但是，世界上大多数文档都属于同一类，因此学会解读和解释晦涩的文档也是很有用的。

<!-- Morgan is installed just like all other libraries with the _npm install_ command. Taking morgan into use happens the same way as configuring any other middleware by using the _app.use_ command.-->
Morgan就像其他库一样，使用`npm install`命令安装。使用`app.use`命令，和配置其他中间件一样，来使用Morgan。

#### 3.8*: Phonebook backend step8

<!-- Configure morgan so that it also shows the data sent in HTTP POST requests:-->
配置Morgan以使其也显示HTTP POST请求中发送的数据：

![terminal showing post data being sent](../../images/3/24.png)

<!-- Note that logging data even in the console can be dangerous since it can contain sensitive data and may violate local privacy law (e.g. GDPR in EU) or business-standard. In this exercise, you don''t have to worry about privacy issues, but in practice, try not to log any sensitive data.-->
**注意，即使是在控制台记录数据也可能很危险，因为它可能包含敏感数据，并可能违反当地的隐私法（例如欧盟的GDPR）或业务标准。在本次练习中，您不必担心隐私问题，但在实践中，尽量不要记录任何敏感数据。**

<!-- This exercise can be quite challenging, even though the solution does not require a lot of code.-->
这个练习可能相当具有挑战性，即使解决方案不需要很多代码。

<!-- This exercise can be completed in a few different ways. One of the possible solutions utilizes these two techniques:-->
这个练习可以有几种不同的方式来完成。其中一种可能的解决方案利用了以下两种技术：

<!-- - [creating new tokens](https://github.com/expressjs/morgan#creating-new-tokens)-->
# 创建新令牌
Morgan 支持创建自定义令牌，以便在日志中记录额外的信息。

要创建新令牌，只需定义一个函数，该函数接受 req、res 和日志记录器作为参数，并返回要记录的字符串：

```js
morgan.token('custom-token', function (req, res, logToken) {
  return req.customField;
});
```

# 创建新令牌
Morgan 支持创建自定义令牌，以便在日志中记录额外的信息。

要创建新令牌，只需定义一个函数，该函数接受 req、res 和日志记录器作为参数，并返回要记录的字符串：

```js
morgan.token('custom-token', function (req, res, logToken) {
  return req.customField;
});
```

# 创建新令牌
Morgan 支持创建自定义令牌，以便在日志中记录额外的信息。

要创建新令牌，只需定义一个函数，该函数接受 req、res 和日志记录器作为参数，并返回要记录的字符串：

```js
morgan.token('custom-token', function (req, res, logToken) {
  return req.customField;
});
```
<!-- - [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)-->
[JSON.stringify](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)

</div>
