---
mainImage: ../../../images/part-2.svg
part: 2
letter: c
lang: zh
---

<div class="content">


<!-- For a while now we have only been working on "frontend", i.e. client-side (browser) functionality. We will begin working on "backend", i.e. server-side functionality in the third part of this course. Nonetheless, we will now take a step in that direction by familiarizing ourselves with how code executing in the browser communicates with the backend. -->
到目前为止，我们一直致力于“前端” ，即客户端(浏览器)功能。 我们将在本课程的第三章节开始研究“后端” ，即服务器端功能。 尽管如此，我们现在将向这个方向迈出一步，熟悉在浏览器中执行的代码如何与后端通信。



<!-- Let's use a tool meant to be used during software development called [JSON Server](https://github.com/typicode/json-server) to act as our server. -->
让我们使用一个在开发过程中使用的工具，称为[JSON 服务器](https://github.com/typicode/JSON-Server 服务器) ，作为我们的服务器。

<!-- Create a file named <i>db.json</i> in the root directory of the project with the following content: -->
在项目的根目录中创建一个名为<i>db.json</i> 的文件，其内容如下:

```json
{
  "notes": [
    {
      "id": 1,
      "content": "HTML is easy",
      "date": "2019-05-30T17:30:31.098Z",
      "important": true
    },
    {
      "id": 2,
      "content": "Browser can execute only JavaScript",
      "date": "2019-05-30T18:39:34.091Z",
      "important": false
    },
    {
      "id": 3,
      "content": "GET and POST are the most important methods of HTTP protocol",
      "date": "2019-05-30T19:20:14.298Z",
      "important": true
    }
  ]
}
```



<!-- You can [install](https://github.com/typicode/json-server#install) JSON server globally on your machine using the command _npm install -g json-server_. A global installation requires administrative privileges, which means that it is not possible on the faculty computers or freshman laptops. -->
您可以使用命令 _npm install -g json-server_在您的机器上[安装](https://github.com/typicode/json-server#getting-started) JSON 服务器。 global 安装需要管理员权限，这意味着它不可能在教学电脑或新生的笔记本电脑上安装。

<!-- However, a global installation is not necessary, since we can run the <i>json-server</i> using the command _npx_: -->
但是，全局安装不是必须的。因为我们可以在应用的根目录使用 npx 命令运行<i>json-server</i>:

```js
npx json-server --port 3001 --watch db.json
```

<!-- The <i>json-server</i> starts running on port 3000 by default; but since projects created using create-react-app reserve port 3000, we must define an alternate port, such as port 3001, for the json-server. -->
默认情况下，<i>json-server</i>在端口3000上启动; 但是由于 create-react-app 项目设置了3000端口，因此我们必须为 json-server 定义一个备用端口，比如端口3001。

<!-- Let's navigate to the address <http://localhost:3001/notes> in the browser. We can see that <i>json-server</i> serves the notes we previously wrote to the file in JSON format: -->
让我们在浏览器中输入地址 <http://localhost:3001/notes>。 我们可以看到<i>JSON-server</i> 以 JSON 格式提供了我们之前写到文件的便笺:

![](../../images/2/14e.png)



<!-- If your browser doesn't have a way to format the display of JSON-data, then install an appropriate plugin, e.g. [JSONView](https://chrome.google.com/webstore/detail/jsonview/chklaanhfefbnpoihckbnefhakgolnmc) to make your life easier. -->
如果你的浏览器无法格式化 json 数据的显示，那么安装一个合适的插件，例如[JSONView](https://chrome.google.com/webstore/detail/jsonview/chklaanhfefbnpoihckbnefhakgolnmc) ，这样会让你的生活更加轻松。



<!-- Going forward, the idea will be to save the notes to the server, which in this case means saving to the json-server. The React code fetches the notes from the server and renders them to the screen. Whenever a new note is added to the application the React code also sends it to the server to make the new note persist in "memory". -->
接下来，我们的想法是将便笺保存到服务器，这在本例中意味着将便笺保存到 json-server。 React代码从服务器获取便笺并将其渲染到屏幕上。 无论何时向应用添加新便笺，React 代码都会将其发送到服务器，以使新便笺保存在“内存”中。

<!-- json-server stores all the data in the <i>db.json</i> file, which resides on the server. In the real world, data would be stored in some kind of database. However, json-server is a handy tool that enables the use of server-side functionality in the development phase without the need to program any of it. -->
Json-server 将所有数据存储在服务器上的<i>db.json</i> 文件中。 在现实世界中，数据会存储在某种数据库中。 然而，json-server 是一个方便的工具，可以在开发阶段使用服务器端功能，而不需要编写任何程序。 

<!-- We will get familiar with the principles of implementing server-side functionality in more detail in [第3章](/zh/part3) of this course. -->
在本课程的[第3章节](/zh/part3)中，我们将更详细地了解如何实现服务器端的功能。

### The browser as a runtime environment 
【浏览器作为一个运行时环境】
<!-- Our first task is fetching the already existing notes to our React application from the address <http://localhost:3001/notes>. -->
我们的第一个任务是从地址 http://localhost:3001/notes 获取已经存在的便笺到 React 应用。

<!-- In the part0 [example project](/zh/part0/web_应用的基础设施#running-application-logic-on-the-browser) we already learned a way to fetch data from a server using JavaScript. The code in the example was fetching the data using [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest), otherwise known as an HTTP request made using an XHR object. This is a technique introduced in 1999, which every browser has supported for a good while now. -->
在 part0[示例 project](/zh/part0/web_应用的基础设施#running-application-logic-on-the-browser)中，我们已经学到了一种使用 JavaScript 从服务器获取数据的方法。 示例中的代码使用[XMLHttpRequest](https://developer.mozilla.org/en-us/docs/web/api/XMLHttpRequest)获取数据，也称为使用 XHR 对象发出的 HTTP 请求。 这是1999年引入的一项技术，现在每个浏览器都已经支持很长时间了。

<!-- The use of XHR is no longer recommended, and browsers already widely support the [fetch](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch) method, which is based on so-called [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), instead of the event-driven model used by XHR. -->
使用 XHR已经不再推荐了，而且浏览器已经广泛支持基于所谓的[promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)的[fetch](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch)方法，而不是 XHR 使用的事件驱动模型。

<!-- As a reminder from part0 (which one should in fact <i>remember to not use</i> without a pressing reason), data was fetched using XHR in the following way:  -->
作为第0章的提醒(实际上我应该记住在没有紧迫理由的情况下不要使用) ，使用 XHR 获取数据的方式如下:


```js
const xhttp = new XMLHttpRequest()

xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    const data = JSON.parse(this.responseText)
    // handle the response that is saved in variable data
  }
}

xhttp.open('GET', '/data.json', true)
xhttp.send()
```



<!-- Right at the beginning we register an <i>event handler</i> to the <em>xhttp</em> object representing the HTTP request, which will be called by the JavaScript runtime whenever the state of the <em>xhttp</em> object changes. If the change in state means that the response to the request has arrived, then the data is handled accordingly. -->
在开始时，我们将一个<i>事件处理程序</i> 注册到表示 HTTP 请求的<em>xhttp</em>对象，当 <em>xhttp</em>对象的状态发生变化时，JavaScript 运行时将调用该对象。 如果状态的变化意味着对请求的响应已经到达，那么数据将得到相应的处理。

<!-- It is worth noting that the code in the event handler is defined before the request is sent to the server. Despite this, the code within the event handler will be executed at a later point in time. Therefore, the code does not execute synchronously "from top to bottom", but does so <i>asynchronously</i>. JavaScript calls the event handler that was registered for the request at some point. -->
值得注意的是，事件处理中的代码是在请求发送到服务器之前定义的。 尽管如此，事件处理中的代码将在稍后的时间点执行。 因此，代码并不是“从顶部到底部”同步执行，而是异步执行。 JavaScript 调用了事件处理，而这个事件处理是在之前某个时刻注册的。

<!-- A synchronous way of making requests that's common in Java programming, for instance, would play out as follows (NB this is not actually working Java code): -->
例如，一种在 Java 编程中常见的同步发出请求的方式，如下(注意，这实际上不是可运行的 Java 代码) :

```java
HTTPRequest request = new HTTPRequest();

String url = "https://fullstack-exampleapp.herokuapp.com/data.json";
List<Note> notes = request.get(url);

notes.forEach(m => {
  System.out.println(m.content);
});
```



<!-- In Java the code executes line by line and stops to wait for the HTTP request, which means waiting for the command _request.get(...)_ to finish. The data returned by the command, in this case the notes, are then stored in a variable, and we begin manipulating the data in the desired manner. -->
在 Java 中，代码逐行执行并停止等待 HTTP 请求，这意味着等待_request.get(...)_ 命令完成。 命令返回的数据，在本例中是notes，然后存储在一个变量中，我们开始以所需的方式操作数据。

<!-- On the other hand, JavaScript engines, or runtime environments, follow the [asynchronous model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop). In principle, this requires all [IO-operations](https://en.wikipedia.org/wiki/Input/output) (with some exceptions) to be executed as non-blocking. This means that the code execution continues immediately after calling an IO function, without waiting for it to return. -->
另一方面，JavaScript 引擎，或者运行时环境，遵循[异步模型asynchronous model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop).。 原则上，这要求所有的[IO-操作](https://en.wikipedia.org/wiki/input/output)(除了一些例外)都以非阻塞方式执行。 这意味着代码执行在调用 IO 函数之后立即继续，而不需要等待它返回。

<!-- When an asynchronous operation is completed, or more specifically, at some point after its completion, the JavaScript engine calls the event handlers registered to the operation. -->
当一个异步操作完成时，或者更确切地说，在它完成之后的某个时刻，JavaScript 引擎才调用注册到该操作的事件处理。

<!-- Currently, JavaScript engines are <i>single-threaded</i>, which means that they cannot execute code in parallel. As a result, it is a requirement in practise to use a non-blocking model for executing IO operations. Otherwise, the browser would "freeze" during, for instance, the fetching of data from a server. -->
目前，JavaScript 引擎是<i>单线程</i>的，这意味着它们不能并行执行代码。 因此，在实践中需要使用非阻塞模型来执行 IO 操作。 否则，浏览器将在从服务器获取数据时“冻结（卡住）”。

<!-- Another consequence of this single threaded nature of JavaScript engines is that if some code execution takes up a lot of time, the browser will get stuck for the duration of the execution. If we added the following code at the top of our application: -->
这种单线程的 JavaScript 引擎的另一个后果是，如果某些代码的执行占用了大量的时间，那么浏览器将在执行期间停滞不前。 如果我们在应用顶部添加如下代码:

```js
setTimeout(() => {
  console.log('loop..')
  let i = 0
  while (i < 50000000000) {
    i++
  }
  console.log('end')
}, 5000)
```

<!-- everything would work normally for 5 seconds. However, when the function defined as the parameter for <em>setTimeout</em> is run, the browser will be stuck for the duration of the execution of the long loop. Even the browser tab cannot be closed during the execution of the loop, at least not in Chrome. -->
一切正常运转5秒钟。 但是，当运行定义为 <em>setTimeout</em>  参数的函数时，浏览器将在长循环执行期间停止。 即使是浏览器的标签也不能在循环执行期间关闭，至少在 Chrome 中不能。

<!-- For the browser to remain <i>responsive</i>, i.e. to be able to continuously react to user operations with sufficient speed, the code logic needs to be such that no single computation can take too long. -->
为了让浏览器保持<i>responsive响应性</i>，即能够以足够的速度连续地对用户操作作出反应，代码逻辑需要让任何单一的计算都不会花费太长的时间。

<!-- There is a host of additional material on the subject to be found on the internet. One particularly clear presentation of the topic is the keynote by Philip Roberts called [What the heck is the event loop anyway?](https://www.youtube.com/watch?v=8aGhZQkoFbQ) -->
在互联网上可以找到大量关于这个议题的补充材料。 关于这个话题，一个特别清晰的演讲是 Philip Roberts 的议题演讲[What the heck is the event loop anyway?](https://www.youtube.com/watch?v=8aGhZQkoFbQ)

<!-- In today's browsers, it is possible to run parallelized code with the help of so-called [web workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers). The event loop of an individual browser window is, however, still only handled by a [single thread](https://medium.com/techtrument/multithreading-javascript-46156179cf9a). -->
在当今的浏览器中，可以在所谓的 [web workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) 的帮助下运行并行化的代码。 然而，单个浏览器窗口的事件循环仍然是由一个[单线程](https://medium.com/techtrument/multithreading-javascript-46156179cf9a)处理。

### npm
<!-- Let's get back to the topic of fetching data from the server. -->
让我们回到从服务器获取数据的议题。

<!-- We could use the previously mentioned promise based function [fetch](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch) to pull the data from the server. Fetch is a great tool. It is standardized and supported by all modern browsers (excluding IE). -->
我们可以使用前面提到的基于承诺promise的[fetch](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch)函数从服务器中获取数据。 fetch是一个很好的工具。 它是标准化的，所有现代浏览器(不包括 IE，因为它不是)都支持它。

<!-- That being said, we will be using the [axios](https://github.com/axios/axios) library instead for communication between the browser and server. It functions like fetch, but is somewhat more pleasant to use. Another good reason to use axios is our getting familiar with adding external libraries, so-called <i>npm packages</i>, to React projects. -->
也就是说，我们将使用[axios](https://github.com/axios/axios)库来代替浏览器和服务器之间的通信。 它的功能类似于fetch，但是使用起来更友好。 使用 axios 的另一个很好的理由是，我们已经熟悉了为 React 项目添加外部库，即使用所谓的<i>npm 包</i>。

<!-- Nowadays, practically all JavaScript projects are defined using the node package manager, aka [npm](https://docs.npmjs.com/getting-started/what-is-npm). The projects created using create-react-app also follow the npm format. A clear indicator that a project uses npm is the <i>package.json</i> file located at the root of the project: -->
现在，几乎所有的 JavaScript 项目都是使用node包管理器定义的，也就是[npm](https://docs.npmjs.com/getting-started/what-is-npm)。 使用 create-react-app 创建的项目也遵循 npm 格式。 项目使用 npm 的一个明确的说明是位于项目根目录的<i>package.json</i> 文件:

```json
{
  "name": "part2-notes",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.11.9",
    "@testing-library/react": "^11.2.3",
    "@testing-library/user-event": "^12.6.0",
    "react": "^17.0.1",
    "react-dom": "^17.0.1",
    "react-scripts": "4.0.1",
    "web-vitals": "^0.2.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

<!-- At this point the <i>dependencies</i> part is of most interest to us as it defines what <i>dependencies</i>, or external libraries, the project has. -->
此时，我们对<i>dependencies</i> 部分最感兴趣，因为它定义了项目具有的<i>依赖dependencies</i> 或外部库。

<!-- We now want to use axios. Theoretically, we could define the library directly in the <i>package.json</i> file, but it is better to install it from the command line. -->
我们现在要使用 axios。 理论上，我们可以在<i>package.json</i> 文件中直接定义它，但最好是从命令行安装它。

```js
npm install axios
```


<!-- **NB _npm_-commands should always be run in the project root directory**, which is where the <i>package.json</i> file can be found. -->

注意： npm-commands 应该始终在项目根目录中运行，在这个目录中可以找到<i>package.json</i> 文件。 

<!-- Axios is now included among the other dependencies: -->
Axios 现在被包含在依赖中了: 

```json
{
  "dependencies": {
    "@testing-library/jest-dom": "^5.11.9",
    "@testing-library/react": "^11.2.3",
    "@testing-library/user-event": "^12.6.0",
    "axios": "^0.21.1", // highlight-line
    "react": "^17.0.1",
    "react-dom": "^17.0.1",
    "react-scripts": "4.0.1",
    "web-vitals": "^0.2.4"
  },
  // ...
}
```

<!-- In addition to adding axios to the dependencies, the <em>npm install</em> command also <i>downloaded</i> the library code. As with other dependencies, the code can be found in the <i>node\_modules</i> directory located in the root. As one might have noticed, <i>node\_modules</i> contains a fair amount of interesting stuff. -->
除了将 axios 添加到依赖项之外，<em>npm install</em> 命令还下载了库代码。 与其他依赖项一样，代码可以在根目录中的<i>node\_modules</i> 目录中找到。 人们可能已经注意到，<i>node\_modules</i> 包含了大量有趣的内容。

<!-- Let's make another addition. Install <i>json-server</i> as a development dependency (only used during development) by executing the command: -->
让我们做另一个补充，通过执行如下命令将<i>json-server</i> 安装为开发依赖项(仅在开发过程中使用) :

```js
npm install json-server --save-dev
```

<!-- and making a small addition to the <i>scripts</i> part of the <i>package.json</i> file: -->
在<i>package.json</i> 文件的<i>scripts</i>部分添加一个小的修改:

```json
{
  // ... 
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "server": "json-server -p3001 --watch db.json" // highlight-line
  },
}
```

<!-- We can now conveniently, without parameter definitions, start the json-server from the project root directory with the command: -->
现在，我们可以在没有参数定义的情况下方便地使用如下命令从项目根目录启动 json-server:

```js
npm run server
```

<!-- We will get more familiar with the _npm_ tool in the [third part of the course](/zh/part3). -->
我们将在[课程的第三章节](/zh/part3)中更加熟悉 npm 工具。

<!-- **NB** The previously started json-server must be terminated before starting a new one, otherwise there will be trouble: -->

注意： 在启动新服务器之前，以前启动的 json-server必须终止，否则会出现问题:

![](../../images/2/15b.png)

<!-- The red print in the error message informs us about the issue: -->
错误信息中的红色打印提示我们这个问题的原因:

<i>Cannot bind to the port 3001. Please specify another port number either through --port argument or through the json-server.json configuration file</i> 
不能绑定到3001端口。 请通过 -- port 参数或通过 json-server.json 配置文件指定另一个端口号。

<!-- As we can see, the application is not able to bind itself to the [port](https://en.wikipedia.org/wiki/Port_(computer_networking)). The reason being that port 3001 is already occupied by the previously started json-server. -->
正如我们所看到的，应用不能将自己绑定到[端口](https://en.wikipedia.org/wiki/port_(computer_networking))。 原因是端口3001已经被先前启动的 json-server 占用了。

<!-- We used the command _npm install_ twice, but with slight differences: -->
我们使用了两次 npm 安装命令，但是有一点不同:

```js
npm install axios
npm install json-server --save-dev
```



<!-- There is a fine difference in the parameters. <i>axios</i> is installed as a runtime dependency of the application, because the execution of the program requires the existence of the library. On the other hand, <i>json-server</i> was installed as a development dependency (_--save-dev_), since the program itself doesn't require it. It is used for assistance during software development. There will be more on different dependencies in the next part of the course. -->
参数之间有细微的差别。<i>axios</i>  被安装为应用的运行时依赖项 (_--save_)，因为程序的执行需要库的存在。 而另一个， <i>json-server</i> 是作为开发依赖项(_--save-dev_)安装的，因为程序本身并不需要它。 它用于在软件开发过程中提供帮助。 在课程的下一章节将会有更多关于不同依赖的内容。

### Axios and promises
<!-- Now we are ready to use axios. Going forward, json-server is assumed to be running on port 3001. -->
现在我们可以使用 axios 了。在开始之前，我已经假定你的json-server跑在3001端口了。

<!-- NB: To run json-server and your react app simultaneously, you may need to use two terminal windows. One to keep json-sever running and the other to run react-app. -->

注意，为了同时运行 json-server 和你的react 应用，你可能需要使用两个terminal 窗口。一个用来保持json-server 的运行，另一个来跑你的react应用。

<!-- The library can be brought into use the same way other libraries, e.g. React, are, i.e. by using an appropriate <em>import</em> statement. -->
可以像其他库一样使用这个库，就像 React那样，即使用 <em>import</em> 语句。

<!-- Add the following to the file <i>index.js</i>: -->
将如下内容添加到文件<i>index.js</i> 中:

```js
import axios from 'axios'

const promise = axios.get('http://localhost:3001/notes')
console.log(promise)

const promise2 = axios.get('http://localhost:3001/foobar')
console.log(promise2)
```

<!-- If you open <http://localhost:3000> in the browser,this should be printed to the console -->
如果你打开浏览器访问<http://localhost:3000>， 此时如下信息会打印到控制台

![](../../images/2/16b.png)
<!-- **Note:** when the content of the file <i>index.js</i> changes, React does not notice that automatically so you must refresh the browser to see your changes! A simple workaround to make React notice the change automatically, is to create a file named <i>.env</i> in the root directory of the project and add this line `FAST_REFRESH=false`. Restart the app for the applied changes to take effect.-->
注意，当  <i>index.js</i>  变化时， React 并不会自动感知，因此你必须刷新浏览器来看到变化！一个简单的方式来让React 自动感知到变化，是在项目的根目录创建一个  <i>.env</i> 文件，并加上 `FAST_REFRESH=false` 。重启应用来让变化生效。

<!-- Axios' method _get_ returns a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises). -->
Axios 的 _get_ 方法会返回一个[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)。 

<!-- The documentation on Mozilla's site states the following about promises: -->
Mozilla's 网站上的文档对promises 做了如下解释: 

> <i>A Promise is an object representing the eventual completion or failure of an asynchronous operation.</i>
Promise承诺是一个对象，用来表示异步操作的最终完成或失败 

<!-- In other words, a promise is an object that represents an asynchronous operation. A promise can have three distinct states: -->
换句话说，promise 是一个表示异步操作的对象，它可以有三种不同的状态:

1. <!--The promise is <i>pending</i>: It means that the final value (one of the following two) is not available yet.-->

   The promise is <i>pending提交中</i>: 这意味着最终值(下面两个中的一个)还不可用。
2. <!--The promise is <i>fulfilled</i>: It means that the operation has completed and the final value is available, which generally is a successful operation. This state is sometimes also called <i>resolved</i>.-->
The promise is <i>fulfilled兑现</i>: 这意味着操作已经完成，最终的值是可用的，这通常是一个成功的操作。 这种状态有时也被称为<i>resolve</i>。 
3. <!--The promise is <i>rejected</i>: It means that an error prevented the final value from being determined, which generally represents a failed operation.-->
The promise is <i>rejected拒绝</i>:它意味着一个错误阻止了最终值，这通常表示一个失败操作。 

<!-- The first promise in our example is <i>fulfilled</i>, representing a successful <em>axios.get('http://localhost:3001/notes')</em> request. The second one, however, is <i>rejected</i>, and the console tells us the reason. It looks like we were trying to make an HTTP GET request to a non-existent address. -->
我们示例中的第一个承诺是<i>fulfilled</i>，表示一个成功的<em>axios.get('http://localhost:3001/notes')</em>  请求。 而第二个是<i>rejected</i>，控制台告诉我们原因。 看起来我们试图向一个不存在的地址发出了 HTTP GET 请求。

<!-- If, and when, we want to access the result of the operation represented by the promise, we must register an event handler to the promise. This is achieved using the method <em>then</em>: -->
如果我们想要访问承诺表示的操作的结果，那么必须为承诺注册一个事件处理。 这是通过 <em>then</em>方法实现的:

```js
const promise = axios.get('http://localhost:3001/notes')

promise.then(response => {
  console.log(response)
})
```
The following is printed to the console:
下面的代码打印到控制台:

![](../../images/2/17e.png)



<!-- The JavaScript runtime environment calls the callback function registered by the <em>then</em> method providing it with a <em>response</em> object as a parameter. The <em>response</em> object contains all the essential data related to the response of an HTTP GET request, which would include the returned <i>data</i>, <i>status code</i>, and <i>headers</i>. -->
JavaScript 运行时环境调用由 <em>then</em> 方法注册的回调函数，并提供一个<em>response</em> 对象作为参数。<em>response</em> 对象包含与 HTTP GET 请求响应相关的所有基本数据，也包括返回的<i>data</i>、<i>status code</i> 和<i>headers</i>。 

<!-- Storing the promise object in a variable is generally unnecessary, and it's instead common to chain the <em>then</em> method call to the axios method call, so that it follows it directly: -->
通常没有必要将 promise 对象存储在一个变量中，而将 <em>then</em>方法调用链到 axios 方法调用是很常见的，因此它可以直接跟在 axios 方法调用后面:

```js
axios.get('http://localhost:3001/notes').then(response => {
  const notes = response.data
  console.log(notes)
})
```



<!-- The callback function now takes the data contained within the response, stores it in a variable and prints the notes to the console. -->
回调函数获取了响应中包含的数据，将其存储在一个变量中，并将便笺打印到控制台。



<!-- A more readable way to format <i>chained</i> method calls is to place each call on its own line: -->
要格式化<i>chained</i> 方法调用，以一种更易读的方法是将每个调用放在独立的行上:

```js
axios
  .get('http://localhost:3001/notes')
  .then(response => {
    const notes = response.data
    console.log(notes)
  })
```

<!-- The data returned by the server is plain text, basically just one long string. The axios library is still able to parse the data into a JavaScript array, since the server has specified that the data format is <i>application/json; charset=utf-8</i> (see previous image) using the <i>content-type</i> header. -->
服务器返回的数据是纯文本，基本上只有一个长字符串。 Axios 库仍然能够将数据解析为一个 JavaScript 数组，因为服务器使用<i>content-type</i> 头指定数据格式为<i>application/json; charset=utf-8</i> (参见前面的图片)。

<!-- We can finally begin using the data fetched from the server. -->
我们现在终于可以开始使用从服务器获取的数据了。

<!-- Let's try and request the notes from our local server and render them, initially as the App component. Please note that this approach has many issues, as we're rendering the entire <i>App</i> component only when we successfuly retrieve a response: -->
我们尝试从我们本地服务器请求 Notes 并渲染，就像App 组件开始那样。注意这种方法有许多问题，比如我们只有将整个<i>App</i>  渲染完成后才会得到成功的response :

```js
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import axios from 'axios'

axios.get('http://localhost:3001/notes').then(response => {
  const notes = response.data
  ReactDOM.render(
    <App notes={notes} />,
    document.getElementById('root')
  )
})
```

<!-- This method could be acceptable in some circumstances, but it's somewhat problematic. Let's instead move the fetching of the data into the <i>App</i> component. -->
这种方法在某些情况下是可以接受的，但是有一些问题。 让我们将数据的fetch逻辑转移到<i>App</i> 组件中。

<!-- What's not immediately obvious, however, is where the command <em>axios.get</em> should be placed within the component. -->
但是，命令 <em>axios.get</em> 应该放在组件中的哪个位置，这一点并不明显。


### Effect-hooks
<!-- We have already used [state hooks](https://reactjs.org/docs/hooks-state.html) that were introduced along with React version [16.8.0](https://www.npmjs.com/package/react/v/16.8.0), which provide state to React components defined as functions - the so-called <i>functional components</i>. Version 16.8.0 also introduces the [effect hooks](https://reactjs.org/docs/hooks-effect.html) as a new feature. In the words of the docs: -->
我们已经使用了与 React version  [16.8.0](https://www.npmjs.com/package/react/v/16.8.0)一起引入的 [state hooks](https://reactjs.org/docs/hooks-state.html)，它为 React 组件提供了定义为函数的状态，也就是所谓的 _函数式组件_ 。 16.8.0版本还引入了 [effect hooks](https://reactjs.org/docs/hooks-effect.html) 新特性。 像文档里说的:

> <i>The Effect Hook lets you perform side effects in function components.</i>
 Effect Hook 可以让你在函数组件中执行副作用
> <i>Data fetching, setting up a subscription, and manually changing the DOM in React components are all examples of side effects. </i>
数据获取、设置订阅和手动更改 React 组件中的 DOM 都是副作用的例子。

<!-- As such, effect hooks are precisely the right tool to use when fetching data from a server. -->
因此，effect hooks正是从服务器获取数据时使用的正确工具。

<!-- Let's remove the fetching of data from <i>index.js</i>. Since we're gonna be retrieving the notes from the server, there is no longer a need to pass data as props to the <i>App</i> component. So <i>index.js</i> can be simplified to:-->
让我们从<i>index.js</i> 中删除数据的获取逻辑。由于我们需要从服务端获取notes， 不再需要将数据作为props传递给<i>App</i> 组件。 所以我将 <i>index.js</i> 简化为:

```js
ReactDOM.render(<App />, document.getElementById('root'))
```

<!-- The <i>App</i> component changes as follows: -->
<i>App</i>组件更改如下:

```js
import React, { useState, useEffect } from 'react' // highlight-line
import axios from 'axios' 
import Note from './components/Note'

const App = () => { // highlight-line
  const [notes, setNotes] = useState([])  // highlight-line
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

// highlight-start
  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/notes')
      .then(response => {
        console.log('promise fulfilled')
        setNotes(response.data)
      })
  }, [])

  console.log('render', notes.length, 'notes')
// highlight-end

  // ...
}
```

<!-- We have also added a few helpful prints, which clarify the progression of the execution. -->
我们还添加了一些有用的打印，用来清晰执行的进程。

<!-- This is printed to the console -->
这是打印到控制台的内容

<pre>
render 0 notes
effect
promise fulfilled
render 3 notes
</pre>

<!-- First the body of the function defining the component is executed and the component is rendered for the first time. At this point <i>render 0 notes</i> is printed, meaning data hasn't been fetched from the server yet. -->
首先执行定义组件的函数体，并首次渲染组件。 此时我打印了 <i>render 0 notes</i> ，这意味着还没有从服务器获取数据。

<!-- The following function, or effect in React parlance: -->

下面的函数，或者说React 的 effect：

```js
() => {
  console.log('effect')
  axios
    .get('http://localhost:3001/notes')
    .then(response => {
      console.log('promise fulfilled')
      setNotes(response.data)
    })
}
```

<!-- is executed immediately after rendering. The execution of the function results in <i>effect</i> being printed to the console, and the command <em>axios.get</em> initiates the fetching of data from the server as well as registers the following function as an <i>event handler</i> for the operation: -->
在渲染完成后会立即执行。 函数的执行结果是<i>effect</i> 被打印到控制台，<em>axios.get</em> 命令从服务器获取到数据，并将如下函数注册为<i>事件处理</i>:

```js
response => {
  console.log('promise fulfilled')
  setNotes(response.data)
})
```

<!-- When data arrives from the server, the JavaScript runtime calls the function registered as the event handler, which prints <i>promise fulfilled</i> to the console and stores the notes received from the server into the state using the function <em>setNotes(response.data)</em>. -->
当数据从服务器到达时，JavaScript 运行时会调用注册为事件处理的函数，该函数将<i>promise fulfilled</i> 输出到控制台，并使用函数<em>setNotes(response.data)</em> 将从服务器接收的便笺存储到状态中。

<!-- As always, a call to a state-updating function triggers the re-rendering of the component. As a result, <i>render 3 notes</i> is printed to the console, and the notes fetched from the server are rendered to the screen. -->
通常，对状态更新函数的调用会触发组件的重新渲染。 结果，<i>render 3 notes</i> 被打印到控制台，从服务器获取的便笺被显示到屏幕上。

<!-- Finally, let's take a look at the definition of the effect hook as a whole: -->
最后，让我们来整体看一下 effect hook :

```js
useEffect(() => {
  console.log('effect')
  axios
    .get('http://localhost:3001/notes').then(response => {
      console.log('promise fulfilled')
      setNotes(response.data)
    })
}, [])
```

<!-- Let's rewrite the code a bit differently. -->
让我们用不同的方式重写一下代码。

```js
const hook = () => {
  console.log('effect')
  axios
    .get('http://localhost:3001/notes')
    .then(response => {
      console.log('promise fulfilled')
      setNotes(response.data)
    })
}

useEffect(hook, [])
```

<!-- Now we can see more clearly that the function [useEffect](https://reactjs.org/docs/hooks-reference.html#useeffect) actually takes <i>two parameters</i>. The first is a function, the <i>effect</i> itself. According to the documentation: -->
现在我们可以更清楚地看到函数 [useEffect](https://reactjs.org/docs/hooks-reference.html#useeffect) 实际上需要<i>两个参数</i> 。第一个是函数本身。 根据文档描述:

> <i>By default, effects run after every completed render, but you can choose to fire it only when certain values have changed.</i>
默认情况下，effects 在每次渲染完成后运行，但是你可以选择只在某些值发生变化时才调用。 

<!-- So by default the effect is <i>always</i> run after the component has been rendered. In our case, however, we only want to execute the effect along with the first render. -->
因此，默认情况下，effect是<i>总是</i> 在组件渲染之后才运行。 然而，在我们的例子中，我们只想在第一次渲染的时候执行这个效果。

<!-- The second parameter of <em>useEffect</em> is used to [specify how often the effect is run](https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect). If the second parameter is an empty array <em>[]</em>, then the effect is only run along with the first render of the component. -->
<em>useEffect</em>的第二个参数用于[指定effect运行的频率](https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect)。 如果第二个参数是一个空数组 <em>[]</em>，那么这个effect只在组件的第一次渲染时运行。

<!-- There are many possible use cases for effect hook other than fetching data from the server. This suffices us for now. -->
除了从服务器获取数据之外，Effect-Hook还有许多用例。 但是目前已经足够，我们暂时只了解到这。

<!-- Think back to the sequence of events we just discussed. Which parts of the code are run? In what order? How often? Understanding the order of events is critical! -->
回想一下我们刚才讨论的事件顺序。 代码的哪些部分是运行的？ 按什么顺序？ 多久一次？ 理解事件的顺序是至关重要的！

<!-- Note that we could have also written the code of the effect function this way: -->
注意，我们也可以这样编写 effect 函数的代码:

```js
useEffect(() => {
  console.log('effect')

  const eventHandler = response => {
    console.log('promise fulfilled')
    setNotes(response.data)
  }

  const promise = axios.get('http://localhost:3001/notes')
  promise.then(eventHandler)
}, [])
```

<!-- A reference to an event handler function is assigned to the variable <em>eventHandler</em>. The promise returned by the <em>get</em> method of Axios is stored in the variable <em>promise</em>. The registration of the callback happens by giving the <em>eventHandler</em> variable, referring to the event-handler function, as a parameter to the then method of the promise. It isn't usually necessary to assign functions and promises to variables, and a more compact way of representing things, as seen further above, is sufficient. -->
对事件处理函数的引用被分配给变量<em>eventHandler</em>。 Axios 的<em>get</em>方法返回的promise存储在变量 <em>promise</em> 中。 回调的注册是通过将 <em>eventHandler</em>变量作为参数 (事件处理函数的引用)传递给promise 的  <em>then</em> 方法的来实现的。 通常没有必要为函数和承诺分配变量，而是用更紧凑的表示方式，就像上面那样，就足够了。

```js
useEffect(() => {
  console.log('effect')
  axios
    .get('http://localhost:3001/notes')
    .then(response => {
      console.log('promise fulfilled')
      setNotes(response.data)
    })
}, [])
```

<!-- We still have a problem in our application. When adding new notes, they are not stored on the server. -->
我们的应用仍然有一个问题。当添加新的便笺时，它们不存储在服务器上。

<!-- The code so far for the application can be found in full on [github](https://github.com/fullstack-hy/part2-notes/tree/part2-4) in the branch <i>part2-4</i>. -->
到目前为止，应用的代码可以在分支<i>part2-4</i> 中的[github](https://github.com/fullstack-hy/part2-notes/tree/part2-4)上找到。

### The development runtime environment  
【开发的运行时环境】
<!-- The configuration for the whole application has steadily grown more complex. Let's review what happens and where. The following image describes the makeup of the application -->

整个应用的配置已经逐渐变得更加复杂。 让我们回顾一下发生了什么，在哪里发生的。 下图描述了应用的组成

![](../../images/2/18e.png)

<!-- The JavaScript code making up our React application is run in the browser. The browser gets the JavaScript from the <i>React dev server</i>, which is the application that runs after running the command <em>npm start</em>. The dev-server transforms the JavaScript into a format understood by the browser. Among other things, it stitches together JavaScript from different files into one file. We'll discuss the dev-server in more detail in part 7 of the course. -->

构成我们的 React 应用的 JavaScript 代码在浏览器中运行。 浏览器从<i>React dev server</i> 获取 JavaScript，这是运行  <em>npm start</em> 命令后运行的应用。 dev-server 将 JavaScript 转换成浏览器可以理解的格式。 除此之外，它还将来自不同文件的 JavaScript 整合到一个文件中。 我们将在本课程的第7章节中更详细地讨论开发服务器。

<!-- The React application running in the browser fetches the JSON formatted data from <i>json-server</i> running on port 3001 on the machine. json-server gets its data from the file <i>db.json</i>. -->
在浏览器中运行的 React 应用从计算机3001端口上运行的<i>JSON-server</i> 获取 JSON 格式的数据。 Json-server 从<i>db.json</i> 文件中获取数据。

<!-- At this point in development, all the parts of the application happen to reside on the software developer's machine, otherwise known as localhost. The situation changes when the application is deployed to the internet. We will do this in part 3. -->
在开发的这个阶段，应用的所有部分都放在软件开发人员的机器上，也就是本地主机。 当应用被部署到互联网上时，情况发生了变化。 我们将在第三章节讨论这个。

</div>


<div class="tasks">


<h3>Exercises 2.11.-2.14.</h3>


<h4>2.11: The Phonebook 步骤6</h4>
<!-- We continue with developing the phonebook. Store the initial state of the application in the file <i>db.json</i>, which should be placed in the root of the project. -->
我们继续开发电话簿。 将应用的初始状态存储在文件<i>db.json</i> 中，将该文件应该放在项目的根目录中。

```json
{
  "persons":[
    { 
      "name": "Arto Hellas", 
      "number": "040-123456",
      "id": 1
    },
    { 
      "name": "Ada Lovelace", 
      "number": "39-44-5323523",
      "id": 2
    },
    { 
      "name": "Dan Abramov", 
      "number": "12-43-234345",
      "id": 3
    },
    { 
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122",
      "id": 4
    }
  ]
}
```

<!-- Start json-server on port 3001 and make sure that the server returns the list of people by going to the address <http://localhost:3001/persons> in the browser. -->
在3001端口上启动 json-server，并确保服务器通过访问浏览器中的地址http://localhost:3001/persons 能够返回人员列表。

<!-- If you receive the following error message: -->
如果您收到如下错误消息:

```js
events.js:182
      throw er; // Unhandled 'error' event
      ^

Error: listen EADDRINUSE 0.0.0.0:3001
    at Object._errnoException (util.js:1019:11)
    at _exceptionWithHostPort (util.js:1041:20)
```

<!-- i -->

<!-- t means that port 3001 is already in use by another application, e.g. in use by an already running json-server. Close the other application, or change the port in case that doesn't work. -->
这意味着端口3001已经被另一个应用使用，例如已经运行的 json-server 正在使用。 关闭其他应用，或者更改端口，以防出现不正常的情况。

<!-- Modify the application such that the initial state of the data is fetched from the server using the <i>axios</i>-library. Complete the fetching with an [Effect hook](https://reactjs.org/docs/hooks-effect.html). -->
修改应用，使用<i>axios</i>-库从服务器获取数据的初始状态。 使用[Effect hook](https://reactjs.org/docs/hooks-Effect.html)完成获取操作。

<h4>2.12* Data for countries, 步骤1</h4>
<!-- H42.12 * 国家数据，步骤1 / h4 -->

<!-- The API [https://restcountries.com](https://restcountries.com) provides a lot data for different countries in a machine readable format, a so-called REST API. -->
Api [https://restcountries.com](https://restcountries.com) 以机器可读的格式，提供了不同国家的大量数据。即所谓的 REST API。 

<!-- Create an application, in which one can look at data of various countries. The application should probably get the data from the endpoint [all](https://restcountries.com/#api-endpoints-all). -->
创建一个应用，可以查看不同国家的数据。 应用能从[all](https://restcountries.com/#api-endpoints-all)中获取数据。

<!-- The user interface is very simple. The country to be shown is found by typing a search query into the search field. -->
用户界面非常简单。 通过在搜索字段中键入搜索查询，可以找到要显示的国家。

<!-- If there are too many (over 10) countries that match the query, then the user is prompted to make their query more specific: -->
如果匹配查询的国家太多(超过10个) ，则提示用户使查询更加具体:

![](../../images/2/19b1.png)


<!-- If there are fewer than ten countries, but more than one, then all countries matching the query are shown: -->
如果少于10个国家，但多于1个，则显示所有匹配查询的国家:

![](../../images/2/19b2.png)


<!-- When there is only one country matching the query, then the basic data of the country, its flag and the languages spoken in that country are shown: -->
如果只有一个国家匹配查询，则显示该国的基本数据、国旗和该国使用的语言:

![](../../images/2/19b3.png)

<!-- **NB1**:  As the API has changed recently and no longer contains population of the countries, you may replace that with some other data found in the API.  -->
<!-- **NB2**: it is enough that your application works for most of the countries. Some countries, like <i>Sudan</i>, can cause trouble, since the name of the country is part of the name of another country, <i>South Sudan</i>. You need not worry about these edge cases. -->

注意1: API 最近进行了修改，因此不再包含国家的人口了，你可以使用API中提供的其他数据。

注意2: 你的应用在大多数国家能好用就可以了。 有些国家，如苏丹，可能会很难支持，因为国名是另一个国家名称的一部分，即南苏丹。 你不必担心这些边缘情况edge cases。

<!-- **WARNING** create-react-app will automatically turn your project into a git-repository unless you create your application inside of an existing git repository. **Most likely you do not want each of your projects to be a separate repository**, so simply run the _rm -rf .git_ command at the root of your application. -->

**警告**： create-react-app 会自动使项目成为一个 git 仓库，除非应用是在已有仓库中创建的。 而您很可能不希望项目成为一个存储库，因此可以在项目的根目录中运行命令  *_rm -rf .git_* 。 

<h4>2.13*: Data for countries, 步骤2</h4>
<!-- **There is still a lot to do in this part, so don't get stuck on this exercise!** -->

这章节还有很多事情要做，所以不要卡在这个练习上! 

<!-- Improve on the application in the previous exercise, such that when the names of multiple countries are shown on the page there is a button next to the name of the country, which when pressed shows the view for that country: -->
改进前一项工作中的应用，例如，当页面上显示多个国家的名称时，在国家名称旁边有一个按钮，当按下该按钮时，显示该国的视图:

![](../../images/2/19b4.png)

<!-- In this exercise it is also enough that your application works for most of the countries. Countries whose name appears in the name of another country, like <i>Sudan</i> can be ignored. -->
在这个练习中，您的应用能够在大多数国家好使就足够了。 国家名包含在其他国家的情况，如<i>苏丹</i> 可以被忽略。

<h4>2.14*: Data for countries, 步骤3</h4>


<!-- **There is still a lot to do in this part, so don't get stuck on this exercise!** -->

这章节还有很多事情要做，所以不要卡在这个练习上! 



<!-- Add to the view showing the data of a single country the weather report for the capital of that country. There are dozens of providers for weather data. I used [https://weatherstack.com/](https://weatherstack.com/). -->
在显示单个国家数据的视图中添加该国首都的天气报告。 有几十个天气数据提供商。 我用了[https://weatherstack.com/](https://weatherstack.com/)。

![](../../images/2/19ba.png)


<!-- **NB:** In some browsers (such as Firefox) weatherstack API sends an error response, which indicates that HTTPS encryption is not supported, although the request URL starts with _http://_. This issue can be fixed by completing the exercise using Chrome. -->
** 注意：** 在一些浏览器中（比如火狐） weatherstack API 会返回一个错误响应，说明不支持HTTPS 加密，虽然请求的URL 是 http://_。 这个问题可以通过换做谷歌浏览器来解决


<!-- **NB:** You need an api-key to use almost every weather service. Do not save the api-key to source control! Nor hardcode the api-key to your source code. Instead use an [environment variable](https://create-react-app.dev/docs/adding-custom-environment-variables/) to save the key. -->
注意: 几乎所有气象服务都需要 api-key。 不要将 api-key 保存到源代码管理Git中！ 也不能将 api-key 硬编码到源代码中。 取而代之的是使用[环境变量](https://create-react-app.dev/docs/adding-custom-environment-variables/)来保存密钥。

<!-- Assuming the api-key is <i>t0p53cr3t4p1k3yv4lu3</i>, when the application is started like so: -->
假设 api-key 是<i>t0p53cr3t4p1k3yv4lu3</i>，当应用像下面这样启动时:

```bash
REACT_APP_API_KEY='t0p53cr3t4p1k3yv4lu3' npm start // For Linux/macOS Bash
($env:REACT_APP_API_KEY='t0p53cr3t4p1k3yv4lu3') -and (npm start) // For Windows PowerShell
set REACT_APP_API_KEY='t0p53cr3t4p1k3yv4lu3' && npm start // For Windows cmd.exe
```


<!-- you can access the value of the key from the _process.env_ object: -->
您可以从 process.env 对象访问密钥的值:

```js
const api_key = process.env.REACT_APP_API_KEY
// variable api_key has now the value set in startup
```
<!-- Note that if you created the application using `npx create-react-app ...` and you want to use a different name for your environment variable then the environment variable name must still begin with `REACT_APP_`. You can also use a `.env` file rather than defining it on the command line each time by creating a file entitled '.env' in the root of the project and adding the following.  -->

注意，如果你使用`npx create-react-app ...` 创建了应用，并且想要为环境变量使用其他名称，则环境变量必须以`REACT_APP_`开头。你还可以通过在项目中创建一个名为`.env`的文件并添加以下内容来使用'.env' 文件，而不是每次都在命令行中定义。

```
# .env

REACT_APP_API_KEY=t0p53cr3t4p1k3yv4lu3
```

<!-- Note that you will need to restart the server to apply the changes. -->
注意你需要重启server来启用这些变化。
</div>

