---
mainImage: ../../../images/part-2.svg
part: 2
letter: c
lang: zh
---

<div class="content">

<!-- For a while now we have only been working on "frontend", i.e. client-side (browser) functionality. We will begin working on "backend", i.e. server-side functionality in the [third part](/en/part3) of this course. Nonetheless, we will now take a step in that direction by familiarizing ourselves with how code executing in the browser communicates with the backend.-->
 一段时间以来，我们只致力于 "前端"，即客户端（浏览器）功能。我们将在本课程的[第三章节](/en/part3)中开始研究 "后端"，即服务器端的功能。尽管如此，我们现在将朝着这个方向迈出一步，熟悉在浏览器中执行的代码是如何与后端通信的。

<!-- Let's use a tool meant to be used during software development called [JSON Server](https://github.com/typicode/json-server) to act as our server.-->
 让我们使用一个在软件开发过程中使用的工具，叫做[JSON服务器](https://github.com/typicode/json-server)来作为我们的服务器。

<!-- Create a file named <i>db.json</i> in the root directory of the project with the following content:-->
 在项目的根目录下创建一个名为<i>db.json</i>的文件，内容如下。

```json
{
  "notes": [
    {
      "id": 1,
      "content": "HTML is easy",
      "date": "2022-1-17T17:30:31.098Z",
      "important": true
    },
    {
      "id": 2,
      "content": "Browser can execute only JavaScript",
      "date": "2022-1-17T18:39:34.091Z",
      "important": false
    },
    {
      "id": 3,
      "content": "GET and POST are the most important methods of HTTP protocol",
      "date": "2022-1-17T19:20:14.298Z",
      "important": true
    }
  ]
}
```

<!-- You can [install](https://github.com/typicode/json-server#getting-started) JSON server globally on your machine using the command _npm install -g json-server_. A global installation requires administrative privileges, which means that it is not possible on faculty computers or freshman laptops.-->
 你可以使用命令_npm install -g json-server_在你的机器上[安装](https://github.com/typicode/json-server#getting-started)JSON服务器。全局安装需要管理权限，这意味着它不可能在教师的电脑或新生的笔记本电脑上实现。

<!-- However, a global installation is not necessary.  From the root directory of your app, we can run the <i>json-server</i> using the command _npx_:-->
 然而，全局安装并不是必须的。  从你的应用的根目录，我们可以使用_npx_命令来运行<i>json-server</i>。

```js
npx json-server --port 3001 --watch db.json
```

<!-- The <i>json-server</i> starts running on port 3000 by default; but since projects created using create-react-app reserve port 3000, we must define an alternate port, such as port 3001, for the json-server.-->
 <i>json-server</i>默认在端口3000上开始运行；但由于使用create-react-app创建的项目保留了端口3000，我们必须为json-server定义一个备用端口，如端口3001。

<!-- Let's navigate to the address <http://localhost:3001/notes> in the browser. We can see that <i>json-server</i> serves the notes we previously wrote to the file in JSON format:-->
 让我们在浏览器中导航到<http://localhost:3001/notes>这个地址。我们可以看到，<i>json-server</i>以JSON格式提供我们之前写到文件中的注释。

![](../../images/2/14e.png)

<!-- If your browser doesn't have a way to format the display of JSON-data, then install an appropriate plugin, e.g. [JSONView](https://chrome.google.com/webstore/detail/jsonview/chklaanhfefbnpoihckbnefhakgolnmc) to make your life easier.-->
 如果你的浏览器没有格式化显示JSON数据的方法，那就安装一个合适的插件，例如[JSONView](https://chrome.google.com/webstore/detail/jsonview/chklaanhfefbnpoihckbnefhakgolnmc)，让你的生活更轻松。

<!-- Going forward, the idea will be to save the notes to the server, which in this case means saving them to the json-server. The React code fetches the notes from the server and renders them to the screen. Whenever a new note is added to the application, the React code also sends it to the server to make the new note persist in "memory".-->
 展望未来，我们的想法是将笔记保存到服务器上，在这种情况下，这意味着将它们保存到json-server。React代码从服务器上获取笔记，并将其渲染到屏幕上。每当一个新的笔记被添加到应用中，React代码也会将其发送到服务器，使新的笔记在 "内存 "中持续存在。

<!-- json-server stores all the data in the <i>db.json</i> file, which resides on the server. In the real world, data would be stored in some kind of database. However, json-server is a handy tool that enables the use of server-side functionality in the development phase without the need to program any of it.-->
 json-server将所有数据存储在<i>db.json</i>文件中，该文件位于服务器上。在现实世界中，数据会被存储在某种数据库中。然而，json-server是一个方便的工具，它能够在开发阶段使用服务器端的功能，而不需要对其进行任何编程。

<!-- We will get familiar with the principles of implementing server-side functionality in more detail in [part 3](/en/part3) of this course.-->
 我们将在本课程的[第三章节](/en/part3)中更详细地熟悉实现服务器端功能的原则。

### The browser as a runtime environment

<!-- Our first task is fetching the already existing notes to our React application from the address <http://localhost:3001/notes>.-->
 我们的第一个任务是从<http://localhost:3001/notes>的地址中获取已经存在的笔记到我们的React应用中。

<!-- In the part0 [example project](/en/part0/fundamentals_of_web_apps#running-application-logic-on-the-browser) we already learned a way to fetch data from a server using JavaScript. The code in the example was fetching the data using [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest), otherwise known as an HTTP request made using an XHR object. This is a technique introduced in 1999, which every browser has supported for a good while now.-->
 在第0章节[示例项目](/en/part0/fundamentals_of_web_apps#running-application-logic-on-the-browser)中，我们已经学习了一种使用JavaScript从服务器获取数据的方法。例子中的代码是使用[XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)来获取数据的，也就是使用XHR对象来进行HTTP请求。这是一种1999年引入的技术，现在每个浏览器都支持了很长时间。

<!-- The use of XHR is no longer recommended, and browsers already widely support the [fetch](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch) method, which is based on so-called [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), instead of the event-driven model used by XHR.-->
不再推荐使用XHR，浏览器已经广泛支持[fetch](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch)方法，该方法基于所谓的[promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)，而不是XHR使用的事件驱动模型。

<!-- As a reminder from part0 (which one should in fact <i>remember to not use</i> without a pressing reason), data was fetched using XHR in the following way:-->
 作为第0章节的提醒（事实上，如果没有迫切的理由，应该记住不要使用</i>），使用XHR获取数据的方式如下。


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

<!-- Right at the beginning we register an <i>event handler</i> to the <em>xhttp</em> object representing the HTTP request, which will be called by the JavaScript runtime whenever the state of the <em>xhttp</em> object changes. If the change in state means that the response to the request has arrived, then the data is handled accordingly.-->
 一开始我们就给代表HTTP请求的<em>xhttp</em>对象注册了一个<i>事件处理程序</i>，每当<em>xhttp</em>对象的状态发生变化时，它就会被JavaScript运行时调用。如果状态的变化意味着对请求的响应已经到来，那么数据就会得到相应的处理。

<!-- It is worth noting that the code in the event handler is defined before the request is sent to the server. Despite this, the code within the event handler will be executed at a later point in time. Therefore, the code does not execute synchronously "from top to bottom", but does so <i>asynchronously</i>. JavaScript calls the event handler that was registered for the request at some point.-->
 值得注意的是，事件处理程序中的代码是在请求被发送到服务器之前定义的。尽管如此，事件处理程序中的代码将在以后的时间点上执行。因此，代码不是 "从上到下 "同步执行的，而是<i>异步</i>执行的。JavaScript调用在某个时间点为请求注册的事件处理程序。

<!-- A synchronous way of making requests that's common in Java programming, for instance, would play out as follows (NB, this is not actually working Java code):-->
 例如，在Java编程中常见的同步请求方式会如下（注意，这并不是实际工作的Java代码）。

```java
HTTPRequest request = new HTTPRequest();

String url = "https://fullstack-exampleapp.herokuapp.com/data.json";
List<Note> notes = request.get(url);

notes.forEach(m => {
  System.out.println(m.content);
});
```

<!-- In Java the code executes line by line and stops to wait for the HTTP request, which means waiting for the command _request.get(...)_ to finish. The data returned by the command, in this case the notes, are then stored in a variable, and we begin manipulating the data in the desired manner.-->
 在Java中，代码逐行执行，然后停下来等待HTTP请求，也就是等待命令_request.get(...)_完成。由命令返回的数据，在本例中是笔记，然后被存储在一个变量中，我们开始以所需的方式操作数据。

<!-- On the other hand, JavaScript engines, or runtime environments, follow the [asynchronous model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop). In principle, this requires all [IO-operations](https://en.wikipedia.org/wiki/Input/output) (with some exceptions) to be executed as non-blocking. This means that code execution continues immediately after calling an IO function, without waiting for it to return.-->
 另一方面，JavaScript引擎或运行时环境遵循[异步模型](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop)。原则上，这要求所有的[IO-操作](https://en.wikipedia.org/wiki/Input/output)（除了一些例外)都以非阻塞方式执行。这意味着在调用一个IO函数后，代码的执行会立即继续，而不需要等待它的返回。

<!-- When an asynchronous operation is completed, or, more specifically, at some point after its completion, the JavaScript engine calls the event handlers registered to the operation.-->
 当一个异步操作完成时，或者更确切地说，在完成后的某个时间点，JavaScript引擎会调用注册在该操作上的事件处理程序。

<!-- Currently, JavaScript engines are <i>single-threaded</i>, which means that they cannot execute code in parallel. As a result, it is a requirement in practice to use a non-blocking model for executing IO operations. Otherwise, the browser would "freeze" during, for instance, the fetching of data from a server.-->
 目前，JavaScript引擎是<i>单线程的</i>，这意味着它们不能并行地执行代码。因此，在实践中需要使用非阻塞模型来执行IO操作。否则，在从服务器获取数据的过程中，浏览器会 "冻结"。

<!-- Another consequence of this single-threaded nature of JavaScript engines is that if some code execution takes up a lot of time, the browser will get stuck for the duration of the execution. If we added the following code at the top of our application:-->
 JavaScript引擎的这种单线程特性的另一个后果是，如果某些代码的执行占用了大量的时间，浏览器就会在执行的过程中卡住。如果我们在应用的顶部添加以下代码。

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

<!-- everything would work normally for 5 seconds. However, when the function defined as the parameter for <em>setTimeout</em> is run, the browser will be stuck for the duration of the execution of the long loop. Even the browser tab cannot be closed during the execution of the loop, at least not in Chrome.-->
一切都会在5秒内正常工作。然而，当定义为<em>setTimeout</em>参数的函数运行时，浏览器将在长循环的执行过程中被卡住。甚至在执行循环的过程中也不能关闭浏览器标签，至少在Chrome中不能。

<!-- For the browser to remain <i>responsive</i>, i.e., to be able to continuously react to user operations with sufficient speed, the code logic needs to be such that no single computation can take too long.-->
为了使浏览器保持<i>响应性</i>，即能够以足够的速度对用户的操作作出连续的反应，代码逻辑需要做到没有一个计算能够花费太长时间。

<!-- There is a host of additional material on the subject to be found on the internet. One particularly clear presentation of the topic is the keynote by Philip Roberts called [What the heck is the event loop anyway?](https://www.youtube.com/watch?v=8aGhZQkoFbQ)-->
在互联网上可以找到大量关于这个主题的额外材料。菲利普-罗伯茨（Philip Roberts）对这一主题的一个特别清晰的介绍是名为[事件循环到底是什么？](https://www.youtube.com/watch?v=8aGhZQkoFbQ)的主题演讲。

<!-- In today's browsers, it is possible to run parallelized code with the help of so-called [web workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers). The event loop of an individual browser window is, however, still only handled by a [single thread](https://medium.com/techtrument/multithreading-javascript-46156179cf9a).-->
在今天的浏览器中，可以借助所谓的[网络工作者](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)来运行并行化的代码。然而，单个浏览器窗口的事件循环仍然只能由一个[单线程]处理(https://medium.com/techtrument/multithreading-javascript-46156179cf9a)。

### npm

<!-- Let's get back to the topic of fetching data from the server.-->
 让我们回到从服务器获取数据的话题上来。

<!-- We could use the previously mentioned promise based function [fetch](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch) to pull the data from the server. Fetch is a great tool. It is standardized and supported by all modern browsers (excluding IE).-->
我们可以使用之前提到的基于承诺的函数[fetch](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch)来从服务器获取数据。Fetch是一个伟大的工具。它是标准化的，被所有现代浏览器支持（不包括IE）。

<!-- That being said, we will be using the [axios](https://github.com/axios/axios) library instead for communication between the browser and server. It functions like fetch, but is somewhat more pleasant to use. Another good reason to use axios is our getting familiar with adding external libraries, so-called <i>npm packages</i>, to React projects.-->
 也就是说，我们将使用[axios](https://github.com/axios/axios)库来代替浏览器和服务器之间的通信。它的功能类似于fetch，但使用起来更顺手一些。使用axios的另一个很好的理由是我们要熟悉在React项目中添加外部库，即所谓的npm包</i>。

<!-- Nowadays, practically all JavaScript projects are defined using the node package manager, aka [npm](https://docs.npmjs.com/getting-started/what-is-npm). The projects created using create-react-app also follow the npm format. A clear indicator that a project uses npm is the <i>package.json</i> file located at the root of the project:-->
 现在，几乎所有的JavaScript项目都是用node包管理器来定义的，也就是[npm](https://docs.npmjs.com/getting-started/what-is-npm)。使用create-react-app创建的项目也遵循npm的格式。一个项目使用npm的明显标志是位于项目根部的<i>package.json</i>文件。

```json
{
  "name": "notes",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.16.1",
    "@testing-library/react": "^12.1.2",
    "@testing-library/user-event": "^13.5.0",
    "react": "^17.0.2",
    "react-dom": "^17.0.2",
    "react-scripts": "5.0.0",
    "web-vitals": "^2.1.3"
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

<!-- At this point the <i>dependencies</i> part is of most interest to us as it defines what <i>dependencies</i>, or external libraries, the project has.-->
 在这一点上，我们最感兴趣的是<i>dependencies</i>部分，因为它定义了项目有哪些<i>dependencies</i>，或外部库。

<!-- We now want to use axios. Theoretically, we could define the library directly in the <i>package.json</i> file, but it is better to install it from the command line.-->
 我们现在想使用axios。理论上，我们可以直接在<i>package.json</i>文件中定义这个库，但最好从命令行中安装它。

```js
npm install axios
```


<!-- **NB _npm_-commands should always be run in the project root directory**, which is where the <i>package.json</i> file can be found.-->
 **NB _npm_-commands应该总是在项目根目录下运行**，也就是可以找到<i>package.json</i>文件的地方。

<!-- Axios is now included among the other dependencies:-->
Axios现在被包含在其他依赖项中。

```json
{
  "name": "notes",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.16.1",
    "@testing-library/react": "^12.1.2",
    "@testing-library/user-event": "^13.5.0",
    "axios": "^0.24.0", // highlight-line
    "react": "^17.0.2",
    "react-dom": "^17.0.2",
    "react-scripts": "5.0.0",
    "web-vitals": "^2.1.3"
  },
  // ...
}
```

<!-- In addition to adding axios to the dependencies, the <em>npm install</em> command also <i>downloaded</i> the library code. As with other dependencies, the code can be found in the <i>node\_modules</i> directory located in the root. As one might have noticed, <i>node\_modules</i> contains a fair amount of interesting stuff.-->
 除了将axios添加到依赖项中，<em>npm install</em>命令还<i>下载了</i>库代码。与其他依赖项一样，代码可以在位于根目录的<i>node/modules</i>目录中找到。人们可能已经注意到，<i>node_modules</i>包含了相当多有趣的东西。

<!-- Let's make another addition. Install <i>json-server</i> as a development dependency (only used during development) by executing the command:-->
 让我们再做一个补充。通过执行以下命令，将<i>json-server</i>安装为开发依赖项（只在开发过程中使用）。

```js
npm install json-server --save-dev
```

<!-- and making a small addition to the <i>scripts</i> part of the <i>package.json</i> file:-->
在<i>package.json</i>文件的<i>scripts</i>部分做一个小小的补充。

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

<!-- We can now conveniently, without parameter definitions, start the json-server from the project root directory with the command:-->
 我们现在可以方便地，在没有参数定义的情况下，用命令从项目根目录下启动json-server。

```js
npm run server
```

<!-- We will get more familiar with the _npm_ tool in the [third part of the course](/en/part3).-->
 我们将在[课程的第三章节](/en/part3)中更加熟悉_npm_工具。

<!-- **NB** The previously started json-server must be terminated before starting a new one; otherwise there will be trouble:-->
 **NB* 在启动新的json-server之前，必须先终止之前启动的json-server；否则会有麻烦。

![](../../images/2/15b.png)

<!-- The red print in the error message informs us about the issue:-->
 错误信息中的红色字体告诉我们这个问题。

<i>Cannot bind to port 3001. Please specify another port number either through --port argument or through the json-server.json configuration file</i>

<!-- As we can see, the application is not able to bind itself to the [port](https://en.wikipedia.org/wiki/Port_(computer_networking)). The reason being that port 3001 is already occupied by the previously started json-server.-->
 我们可以看到，应用无法将自己绑定到[端口](https://en.wikipedia.org/wiki/Port_(computer_networking))。原因是3001端口已经被先前启动的json-server占用。

<!-- We used the command _npm install_ twice, but with slight differences:-->
 我们用了两次_npm install_的命令，但略有不同。

```js
npm install axios
npm install json-server --save-dev
```

<!-- There is a fine difference in the parameters. <i>axios</i> is installed as a runtime dependency of the application, because the execution of the program requires the existence of the library. On the other hand, <i>json-server</i> was installed as a development dependency (_--save-dev_), since the program itself doesn't require it. It is used for assistance during software development. There will be more on different dependencies in the next part of the course.-->
 在参数上有细微差别。<i>axios</i>被安装为应用的运行时依赖，因为程序的执行需要该库的存在。另一方面，<i>json-server</i>被安装为开发依赖项（_--save-dev_），因为程序本身并不需要它。它是用来在软件开发过程中提供帮助的。在课程的下一部分会有更多关于不同依赖关系的内容。

### Axios and promises

<!-- Now we are ready to use axios. Going forward, json-server is assumed to be running on port 3001.-->
 现在我们已经准备好使用axios了。今后，假定json-server在3001端口运行。

<!-- NB: To run json-server and your react app simultaneously, you may need to use two terminal windows. One to keep json-server running and the other to run react-app.-->
 注意：为了同时运行json-server和你的react应用，你可能需要使用两个终端窗口。一个用于保持 json-server 运行，另一个用于运行 react-app。

<!-- The library can be brought into use the same way other libraries, e.g. React, are, i.e., by using an appropriate <em>import</em> statement.-->
 这个库可以像其他库（如React）一样被使用，即通过使用适当的<em>import</em>语句。

<!-- Add the following to the file <i>index.js</i>:-->
 在文件<i>index.js</i>中添加以下内容。

```js
import axios from 'axios'

const promise = axios.get('http://localhost:3001/notes')
console.log(promise)

const promise2 = axios.get('http://localhost:3001/foobar')
console.log(promise2)
```

<!-- If you open <http://localhost:3000> in the browser, this should be printed to the console-->
 如果你在浏览器中打开<http://localhost:3000>，应该会在控制台中打印出以下内容

![](../../images/2/16b.png)

<!-- **Note:** when the content of the file <i>index.js</i> changes, React does not always notice that automatically, so you might need to refresh the browser to see your changes! A simple workaround to make React notice the change automatically, is to create a file named <i>.env</i> in the root directory of the project and add this line <i>FAST_REFRESH=false</i>. Restart the app for the applied changes to take effect.-->
 **注意：**当文件<i>index.js</i>的内容发生变化时，React并不总是自动注意到这一点，所以你可能需要刷新浏览器来看到你的变化!一个简单的解决方法是在项目的根目录下创建一个名为<i>.env</i>的文件，并添加这一行<i>FAST_REFRESH=false</i>，使React自动注意到变化。重新启动应用以使应用的变化生效。

<!-- Axios' method _get_ returns a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises).-->
 'Axios' 方法 _get_ 返回一个[承诺](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)。

<!-- The documentation on Mozilla's site states the following about promises:-->
 Mozilla网站上的文档对承诺有如下说明。

<!-- > <i>A Promise is an object representing the eventual completion or failure of an asynchronous operation.</i>-->
 > <i>A Promise是一个代表异步操作最终完成或失败的对象。

<!-- In other words, a promise is an object that represents an asynchronous operation. A promise can have three distinct states:-->
 换句话说，一个承诺是一个代表异步操作的对象。一个承诺可以有三种不同的状态。

<!-- 1. The promise is <i>pending</i>: It means that the final value (one of the following two) is not available yet.-->
 1.答应是<i>pending</i>：这意味着最终的值（以下两个中的一个）还不能用。
<!-- 2. The promise is <i>fulfilled</i>: It means that the operation has been completed and the final value is available, which generally is a successful operation. This state is sometimes also called <i>resolved</i>.-->
 2.承诺是<i>fulfilled</i>：它意味着操作已经完成，最终值可用，一般来说是一个成功的操作。这种状态有时也被称为<i>resolved</i>。
<!-- 3. The promise is <i>rejected</i>: It means that an error prevented the final value from being determined, which generally represents a failed operation.-->
 3.承诺被<i>拒绝</i>：这意味着一个错误阻止了最终值的确定，这一般代表一个失败的操作。

<!-- The first promise in our example is <i>fulfilled</i>, representing a successful _axios.get('http://localhost:3001/notes')_ request. The second one, however, is <i>rejected</i>, and the console tells us the reason. It looks like we were trying to make an HTTP GET request to a non-existent address.-->
 我们例子中的第一个承诺是<i>fulfilled</i>，代表一个成功的_axios.get('http://localhost:3001/notes')_请求。然而，第二个承诺是<i>拒绝的</i>，并且控制台告诉我们原因。看起来我们试图向一个不存在的地址发出HTTP GET请求。

<!-- If, and when, we want to access the result of the operation represented by the promise, we must register an event handler to the promise. This is achieved using the method <em>then</em>:-->
 如果，以及何时，我们想访问承诺所代表的操作的结果，我们必须为承诺注册一个事件处理程序。这可以通过<em>then</em>方法实现。

```js
const promise = axios.get('http://localhost:3001/notes')

promise.then(response => {
  console.log(response)
})
```
<!-- The following is printed to the console:-->
 以下内容将被打印到控制台。

![](../../images/2/17e.png)

<!-- The JavaScript runtime environment calls the callback function registered by the <em>then</em> method providing it with a <em>response</em> object as a parameter. The <em>response</em> object contains all the essential data related to the response of an HTTP GET request, which would include the returned <i>data</i>, <i>status code</i>, and <i>headers</i>.-->
 JavaScript运行环境调用由<em>then</em>方法注册的回调函数，为其提供一个<em>response</em>对象作为参数。<em>response</em>对象包含与HTTP GET请求的响应相关的所有基本数据，其中包括返回的<i>数据</i>、<i>状态代码</i>和<i>头信息</i>。

<!-- Storing the promise object in a variable is generally unnecessary, and it's instead common to chain the <em>then</em> method call to the axios method call, so that it follows it directly:-->
 将承诺对象存储在一个变量中通常是不必要的，而通常是将<em>then</em>方法调用链到axios方法调用中，这样它就直接跟随它。

```js
axios.get('http://localhost:3001/notes').then(response => {
  const notes = response.data
  console.log(notes)
})
```


<!-- The callback function now takes the data contained within the response, stores it in a variable, and prints the notes to the console.-->
 回调函数现在接收响应中包含的数据，将其存储在一个变量中，并将注释打印到控制台。



<!-- A more readable way to format <i>chained</i> method calls is to place each call on its own line:-->
 格式化<i>链式</i>方法调用的一个更可读的方法是将每个调用放在自己的一行。

```js
axios
  .get('http://localhost:3001/notes')
  .then(response => {
    const notes = response.data
    console.log(notes)
  })
```

<!-- The data returned by the server is plain text, basically just one long string. The axios library is still able to parse the data into a JavaScript array, since the server has specified that the data format is <i>application/json; charset=utf-8</i> (see previous image) using the <i>content-type</i> header.-->
 服务器返回的数据是纯文本，基本上就是一个长字符串。axios库仍然能够将数据解析成一个JavaScript数组，因为服务器使用<i>content-type</i>头指定数据格式为<i>application/json; charset=utf-8</i>（见前一张图片）。

<!-- We can finally begin using the data fetched from the server.-->
 我们终于可以开始使用从服务器上获取的数据了。

<!-- Let's try and request the notes from our local server and render them, initially as the App component. Please note that this approach has many issues, as we're rendering the entire <i>App</i> component only when we successfully retrieve a response:-->
 让我们尝试从本地服务器上请求笔记，并渲染它们，最初作为App组件。请注意，这种方法有很多问题，因为我们只有在成功检索到一个响应时才会渲染整个<i>App</i>组件。

```js
import React from 'react'
import ReactDOM from 'react-dom/client'
import axios from 'axios' // highlight-line

import App from './App'

axios.get('http://localhost:3001/notes').then(response => {
  const notes = response.data
  ReactDOM.createRoot(document.getElementById('root')).render(<App notes={notes} />)
})
```

<!-- This method could be acceptable in some circumstances, but it's somewhat problematic. Let's instead move the fetching of the data into the <i>App</i> component.-->
 这种方法在某些情况下是可以接受的，但它有些问题。让我们把获取数据的过程移到<i>App</i>组件中。

<!-- What's not immediately obvious, however, is where the command <em>axios.get</em> should be placed within the component.-->
 然而，不明显的是，<em>axios.get</em>命令应该放在组件中的什么地方。

### Effect-hooks

<!-- We have already used [state hooks](https://reactjs.org/docs/hooks-state.html) that were introduced along with React version [16.8.0](https://www.npmjs.com/package/react/v/16.8.0), which provide state to React components defined as functions - the so-called <i>functional components</i>. Version 16.8.0 also introduces [effect hooks](https://reactjs.org/docs/hooks-effect.html) as a new feature. As per the official docs:-->
 我们已经使用了与React版本[16.8.0](https://www.npmjs.com/package/react/v/16.8.0)一起引入的[状态钩子](https://reactjs.org/docs/hooks-state.html)，它为定义为函数的React组件--所谓的<i>功能组件</i>提供状态。16.8.0版本还引入了[效果钩子](https://reactjs.org/docs/hooks-effect.html)这个新功能。按照官方文档的说法。

<!-- > <i>The Effect Hook lets you perform side effects on function components.</i>-->
 > <i>效果钩可以让你对函数组件执行副作用。</i>。
<!-- > <i>Data fetching, setting up a subscription, and manually changing the DOM in React components are all examples of side effects.</i>-->
 > <i>获取数据、设置订阅、以及手动改变React组件中的DOM都是副作用的例子。

<!-- As such, effect hooks are precisely the right tool to use when fetching data from a server.-->
 因此，当从服务器获取数据时，效果钩子正是正确的工具。

<!-- Let's remove the fetching of data from <i>index.js</i>. Since we're gonna be retrieving the notes from the server, there is no longer a need to pass data as props to the <i>App</i> component. So <i>index.js</i> can be simplified to:-->
 让我们从<i>index.js</i>中移除数据的获取。既然我们要从服务器上获取笔记，就不再需要将数据作为prop传递给<i>App</i>组件。所以<i>index.js</i>可以简化为。

```js
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

<!-- The <i>App</i> component changes as follows:-->
 <i>App</i>组件的变化如下。

```js
import { useState, useEffect } from 'react' // highlight-line
import axios from 'axios' // highlight-line
import Note from './components/Note'

const App = () => { // highlight-line
  const [notes, setNotes] = useState([]) // highlight-line
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

<!-- We have also added a few helpful prints, which clarify the progression of the execution.-->
 我们还添加了一些有用的打印结果，阐明了执行的进程。

<!-- This is printed to the console:-->
这将被打印到控制台。

<pre>
render 0 notes
effect
promise fulfilled
render 3 notes
</pre>

<!-- First, the body of the function defining the component is executed and the component is rendered for the first time. At this point <i>render 0 notes</i> is printed, meaning data hasn't been fetched from the server yet.-->
 首先，定义该组件的函数主体被执行，该组件被首次渲染。在这一点上，<i>render 0 notes</i>被打印出来，意味着数据还没有从服务器上获取。

<!-- The following function, or effect in React parlance:-->
下面的函数，用React的说法就是效果。
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

<!-- is executed immediately after rendering. The execution of the function results in <i>effect</i> being printed to the console, and the command <em>axios.get</em> initiates the fetching of data from the server as well as registers the following function as an <i>event handler</i> for the operation:-->
在渲染后立即执行。该函数的执行结果是<i>effect</i>被打印到控制台，命令<em>axios.get</em>开始从服务器获取数据，并注册以下函数作为该操作的<i>event handler</i>。

```js
response => {
  console.log('promise fulfilled')
  setNotes(response.data)
})
```

<!-- When data arrives from the server, the JavaScript runtime calls the function registered as the event handler, which prints <i>promise fulfilled</i> to the console and stores the notes received from the server into the state using the function <em>setNotes(response.data)</em>.-->
当数据从服务器到达时，JavaScript运行时调用注册为事件处理程序的函数，该函数将<i>承诺兑现</i>打印到控制台，并使用函数<em>setNotes(response.data)</em>将从服务器收到的注释存储到状态中。

<!-- As always, a call to a state-updating function triggers the re-rendering of the component. As a result, <i>render 3 notes</i> is printed to the console, and the notes fetched from the server are rendered to the screen.-->
 一如既往，对状态更新函数的调用会触发组件的重新渲染。结果，<i>render 3 notes</i>被打印到控制台，而从服务器上获取的笔记被渲染到屏幕上。

<!-- Finally, let's take a look at the definition of the effect hook as a whole:-->
 最后，让我们来看看效果钩子的整体定义。

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

<!-- Let's rewrite the code a bit differently.-->
 让我们以不同的方式重写代码。

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

<!-- Now we can see more clearly that the function [useEffect](https://reactjs.org/docs/hooks-reference.html#useeffect) actually takes <i>two parameters</i>. The first is a function, the <i>effect</i> itself. According to the documentation:-->
 现在我们可以更清楚地看到，函数[useEffect](https://reactjs.org/docs/hooks-reference.html#useeffect)实际上需要<i>两个参数</i>。第一个是一个函数，即<i>effect</i>本身。根据文档的内容。

<!-- > <i>By default, effects run after every completed render, but you can choose to fire it only when certain values have changed.</i>-->
 > <i>默认情况下，效果会在每次完成渲染后运行，但你可以选择只在某些值发生变化时启动它。

<!-- So by default the effect is <i>always</i> run after the component has been rendered. In our case, however, we only want to execute the effect along with the first render.-->
 所以默认情况下，效果是<i>总是</i>在组件被渲染后运行。然而，在我们的例子中，我们只想在第一次渲染时执行效果。

<!-- The second parameter of <em>useEffect</em> is used to [specify how often the effect is run](https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect). If the second parameter is an empty array <em>[]</em>, then the effect is only run along with the first render of the component.-->
 <em>useEffect</em>的第二个参数用于[指定效果的运行频率](https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect)。如果第二个参数是一个空的数组<em>[]<em>，那么效果就只在组件的第一次渲染时运行。

<!-- There are many possible use cases for an effect hook other than fetching data from the server. However, this use is sufficient for us, for now.-->
 除了从服务器上获取数据之外，效果钩子还有许多可能的使用情况。然而，目前这个用途对我们来说已经足够了。

<!-- Think back to the sequence of events we just discussed. Which parts of the code are run? In what order? How often? Understanding the order of events is critical!-->
回想一下我们刚才讨论的事件序列。代码的哪些部分被运行？以什么顺序？多久一次？了解事件的顺序是至关重要的!

<!-- Note that we could have also written the code for the effect function this way:-->
 注意，我们也可以这样写效果函数的代码。

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

<!-- A reference to an event handler function is assigned to the variable <em>eventHandler</em>. The promise returned by the <em>get</em> method of Axios is stored in the variable <em>promise</em>. The registration of the callback happens by giving the <em>eventHandler</em> variable, referring to the event-handler function, as a parameter to the <em>then</em> method of the promise. It isn't usually necessary to assign functions and promises to variables, and a more compact way of representing things, as seen further above, is sufficient.-->
 一个事件处理函数的引用被分配到变量<em>eventHandler</em>。由Axios的<em>get</em>方法返回的承诺被存储在变量<em>promise</em>中。回调的注册是通过给<em>eventHandler</em>变量，指的是事件处理函数，作为承诺的<em>then</em>方法的一个参数。通常没有必要把函数和承诺分配给变量，用更紧凑的方式来表示事情，如上面进一步看到的，就足够了。

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

<!-- We still have a problem in our application. When adding new notes, they are not stored on the server.-->
 在我们的应用中仍然有一个问题。当添加新的笔记时，它们没有被存储在服务器上。

<!-- The code for the application, as described so far, can be found in full on [github](https://github.com/fullstack-hy2020/part2-notes/tree/part2-4), on branch <i>part2-4</i>.-->
 到目前为止，应用的代码可以在[github](https://github.com/fullstack-hy2020/part2-notes/tree/part2-4)的分支<i>part2-4</i>上找到全文。

### The development runtime environment

<!-- The configuration for the whole application has steadily grown more complex. Let's review what happens and where. The following image describes the makeup of the application-->
 整个应用的配置已经逐渐变得复杂。让我们回顾一下发生了什么，在哪里发生。下面的图片描述了应用的构成

![](../../images/2/18e.png)

<!-- The JavaScript code making up our React application is run in the browser. The browser gets the JavaScript from the <i>React dev server</i>, which is the application that runs after running the command <em>npm start</em>. The dev-server transforms the JavaScript into a format understood by the browser. Among other things, it stitches together JavaScript from different files into one file. We'll discuss the dev-server in more detail in part 7 of the course.-->
 构成我们React应用的JavaScript代码在浏览器中运行。浏览器从<i>React开发服务器</i>获得JavaScript，这是运行<em>npm start</em>命令后运行的应用。开发服务器将JavaScript转换为浏览器可以理解的格式。除其他事项外，它还将不同文件的JavaScript拼接成一个文件。我们将在课程的第七章节更详细地讨论dev-server。

<!-- The React application running in the browser fetches the JSON formatted data from <i>json-server</i> running on port 3001 on the machine. The server we query the data from - <i>json-server</i> - gets its data from the file <i>db.json</i>.-->
 浏览器中运行的React应用从机器上运行在3001端口的<i>json-server</i>取回JSON格式的数据。我们查询数据的服务器--<i>json-server</i>-从文件<i>db.json</i>中获取数据。

<!-- At this point in development, all the parts of the application happen to reside on the software developer's machine, otherwise known as localhost. The situation changes when the application is deployed to the internet. We will do this in part 3.-->
 在开发的这一点上，应用的所有部分恰好都在软件开发者的机器上，也就是所谓的localhost。当应用被部署到互联网上时，情况会发生变化。我们将在第3章节做这个。

</div>

<div class="tasks">

<h3>Exercises 2.11.-2.14.</h3>

<h4>2.11: The Phonebook Step6</h4>

<!-- We continue with developing the phonebook. Store the initial state of the application in the file <i>db.json</i>, which should be placed in the root of the project.-->
 我们继续开发电话簿。将应用的初始状态存储在文件<i>db.json</i>中，该文件应放置在项目的根目录下。

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

<!-- Start json-server on port 3001 and make sure that the server returns the list of people by going to the address <http://localhost:3001/persons> in the browser.-->
 在3001端口启动json-server，并确保服务器通过在浏览器中访问<http://localhost:3001/persons>地址来返回人员名单。


<!-- If you receive the following error message:-->
 如果你收到以下错误信息。

```js
events.js:182
      throw er; // Unhandled 'error' event
      ^

Error: listen EADDRINUSE 0.0.0.0:3001
    at Object._errnoException (util.js:1019:11)
    at _exceptionWithHostPort (util.js:1041:20)
```

<!-- it means that port 3001 is already in use by another application, e.g. in use by an already running json-server. Close the other application, or change the port in case that doesn't work.-->
 这意味着3001端口已经被另一个应用使用，例如，被一个已经运行的json-server使用。关闭另一个应用，或者改变端口，如果这不起作用的话。

<!-- Modify the application such that the initial state of the data is fetched from the server using the <i>axios</i>-library. Complete the fetching with an [Effect hook](https://reactjs.org/docs/hooks-effect.html).-->
 修改应用，使数据的初始状态是使用<i>axios</i>-library从服务器获取的。用一个[效果钩子](https://reactjs.org/docs/hooks-effect.html)来完成获取。

<h4>2.12* Data for countries, step1</h4>

<!-- The API [https://restcountries.com](https://restcountries.com) provides data for different countries in a machine-readable format, a so-called REST API.-->
 API [https://restcountries.com](https://restcountries.com)以机器可读的格式提供不同国家的数据，这是所谓的REST API。

<!-- Create an application, in which one can look at data of various countries. The application should probably get the data from the endpoint [all](https://restcountries.com/v3.1/all).-->
 创建一个应用，在其中可以查看不同国家的数据。这个应用可能应该从端点[all](https://restcountries.com/v3.1/all)获取数据。

<!-- The user interface is very simple. The country to be shown is found by typing a search query into the search field.-->
 用户界面非常简单。要显示的国家是通过在搜索栏里输入一个搜索查询来找到的。

<!-- If there are too many (over 10) countries that match the query, then the user is prompted to make their query more specific:-->
 如果有太多(超过10个)国家符合查询条件，则会提示用户使他们的查询更具体。

![](../../images/2/19b1.png)

<!-- If there are ten or fewer countries, but more than one, then all countries matching the query are shown:-->
 如果有10个或更少的国家，但超过1个，那么就会显示所有符合查询的国家。

![](../../images/2/19b2.png)

<!-- When there is only one country matching the query, then the basic data of the country (eg. capital and area), its flag and the languages spoken there, are shown:-->
 如果只有一个国家符合查询条件，则显示该国的基本数据（如首都和面积）、国旗和使用的语言。

![](../../images/2/19c3.png)

<!-- **NB**: It is enough that your application works for most of the countries. Some countries, like <i>Sudan</i>, can be hard to support, since the name of the country is part of the name of another country, <i>South Sudan</i>. You don't need to worry about these edge cases.-->
 **NB*:你的应用对大多数国家都有效就可以了。有些国家，如<i>苏丹</i>，可能很难支持，因为这个国家的名字是另一个国家<i>南苏丹</i>的名字的一部分。你不需要担心这些边缘情况。

<!-- **WARNING** create-react-app will automatically turn your project into a git-repository unless you create your application inside of an existing git repository. **Most likely you do not want each of your projects to be a separate repository**, so simply run the _rm -rf .git_ command at the root of your application.-->
 **警告** create-react-app将自动把你的项目变成一个git-repository，除非你在一个现有的git repository中创建你的应用。**你很可能不希望你的每个项目都是一个独立的仓库**，所以只需在你的应用的根部运行_rm -rf .git_命令即可。

<h4>2.13*: Data for countries, step2</h4>

<!-- **There is still a lot to do in this part, so don't get stuck on this exercise!**-->
 **这部分还有很多事情要做，所以不要在这个练习上卡住！**

<!-- Improve on the application in the previous exercise, such that when the names of multiple countries are shown on the page there is a button next to the name of the country, which when pressed shows the view for that country:-->
 改进前一个练习中的应用，当页面上显示多个国家的名称时，在国家名称旁边有一个按钮，按下后会显示该国家的视图。

![](../../images/2/19b4.png)

<!-- In this exercise it is also enough that your application works for most of the countries. Countries whose name appears in the name of another country, like <i>Sudan</i>, can be ignored.-->
 在这个练习中，你的应用对大多数国家都有效也就足够了。那些名字出现在另一个国家名称中的国家，如<i>苏丹</i>，可以被忽略。

<h4>2.14*: Data for countries, step3</h4>

<!-- **There is still a lot to do in this part, so don't get stuck on this exercise!**-->
 **这部分还有很多事情要做，所以不要卡在这个练习上！**。

<!-- Add to the view showing the data of a single country, the weather report for the capital of that country. There are dozens of providers for weather data. One suggested API is [https://openweathermap.org](https://openweathermap.org). Note that it might take some minutes until a generated api key is valid.-->
 在显示单一国家数据的视图中，添加该国首都的天气报告。有几十个天气数据的提供者。一个建议的API是[https://openweathermap.org](https://openweathermap.org)。请注意，可能需要一些时间，直到生成的api密钥有效。

![](../../images/2/19x.png)

<!-- If you use Open weather map, [here](https://openweathermap.org/weather-conditions#Icon-list) is the description how to get weather icons.-->
 如果你使用Open weather map，[这里](https://openweathermap.org/weather-conditions#Icon-list)是关于如何获得天气图标的描述。

<!-- **NB:** In some browsers (such as Firefox) the chosen API might send an error response, which indicates that HTTPS encryption is not supported, although the request URL starts with _http://_. This issue can be fixed by completing the exercise using Chrome.-->
 **NB:**在某些浏览器（如Firefox）中，所选择的API可能会发送一个错误响应，这表明不支持HTTPS加密，尽管请求的URL以http://_ 开始。这个问题可以通过使用Chrome浏览器完成练习来解决。

<!-- **NB:** You need an api-key to use almost every weather service. Do not save the api-key to source control! Nor hardcode the api-key to your source code. Instead use an [environment variable](https://create-react-app.dev/docs/adding-custom-environment-variables/) to save the key.-->
 **NB:**你需要一个api-key来使用几乎所有的气象服务。不要把api-key保存到源码控制中!也不要在你的源代码中硬编码api-key。而是使用一个[环境变量](https://create-react-app.dev/docs/adding-custom-environment-variables/)来保存该密钥。

<!-- Assuming the api-key is <i>t0p53cr3t4p1k3yv4lu3</i>, when the application is started like so:-->
 假设api-key是<i>t0p53cr3t4p1k3yv4lu3</i>，当应用像这样启动时。

```bash
REACT_APP_API_KEY=t0p53cr3t4p1k3yv4lu3 npm start // For Linux/macOS Bash
($env:REACT_APP_API_KEY=t0p53cr3t4p1k3yv4lu3) -and (npm start) // For Windows PowerShell
set REACT_APP_API_KEY=t0p53cr3t4p1k3yv4lu3 && npm start // For Windows cmd.exe
```

<!-- you can access the value of the key from the _process.env_ object:-->
 你可以从_process.env_对象中访问该键的值。

```js
const api_key = process.env.REACT_APP_API_KEY
// variable api_key has now the value set in startup
```

<!-- Note that if you created the application using `npx create-react-app ...` and you want to use a different name for your environment variable then the environment variable name must still begin with `REACT_APP_`. You can also use a `.env` file rather than defining it on the command line each time by creating a file entitled '.env' in the root of the project and adding the following.-->
 注意，如果你用`npx create-react-app ...`创建了应用，并且你想为你的环境变量使用一个不同的名字，那么环境变量的名字仍然必须以`REACT_APP_`开头。你也可以使用`.env`文件，而不是每次都在命令行上定义它，方法是在项目的根部创建一个名为".env"的文件，并加入以下内容。

```
# .env

REACT_APP_API_KEY=t0p53cr3t4p1k3yv4lu3
```

<!-- Note that you will need to restart the server to apply the changes.-->
 注意你将需要重新启动服务器来应用这些变化。
</div>
