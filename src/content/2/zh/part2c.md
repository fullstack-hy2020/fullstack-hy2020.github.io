---
mainImage: ../../../images/part-2.svg
part: 2
letter: c
lang: zh
---

<div class="content">

<!-- For a while now we have only been working on "frontend", i.e. client-side (browser) functionality. We will begin working on "backend", i.e. server-side functionality in the [third part](/en/part3) of this course. Nonetheless, we will now take a step in that direction by familiarizing ourselves with how the code executing in the browser communicates with the backend.-->
近来我们只致力于“前端”，即客户端（浏览器）功能。我们将在本课程的[第三部分](/en/part3)开始进行“后端”，即服务器端功能的工作。尽管如此，我们现在将采取一步行动，熟悉在浏览器中执行的代码如何与后端进行通信。

<!-- Let''s use a tool meant to be used during software development called [JSON Server](https://github.com/typicode/json-server) to act as our server.-->
让我们使用一个旨在在软件开发过程中使用的工具[JSON Server](https://github.com/typicode/json-server)来充当我们的服务器。

<!-- Create a file named <i>db.json</i> in the root directory of the previous <i>notes</i> project with the following content:-->
在以前的<i>notes</i>项目的根目录下创建一个名为<i>db.json</i>的文件，内容如下：

```json
{
  "notes": [
    {
      "id": 1,
      "content": "HTML is easy",
      "important": true
    },
    {
      "id": 2,
      "content": "Browser can execute only JavaScript",
      "important": false
    },
    {
      "id": 3,
      "content": "GET and POST are the most important methods of HTTP protocol",
      "important": true
    }
  ]
}
```

<!-- You can [install](https://github.com/typicode/json-server#getting-started) a JSON server globally on your machine using the command _npm install -g json-server_. A global installation requires administrative privileges, which means that it is not possible on faculty computers or freshman laptops.-->
你可以使用命令`npm install -g json-server`在你的机器上全局[安装](https://github.com/typicode/json-server#getting-started)一个JSON服务器。全局安装需要管理员权限，这意味着在教职工电脑或新生笔记本上不可能安装。

<!-- After installing run the following command to run the json-server. The <i>json-server</i> starts running on port 3000 by default; but since projects created using create-react-app reserve port 3000, we must define an alternate port, such as port 3001, for the json-server. The --watch option automatically looks for any saved changes to db.json-->
and updates the server accordingly.

安装完成后，运行以下命令来运行<i>json-server</i>。<i>json-server</i> 默认会在端口3000上运行；但是，由于使用create-react-app创建的项目会保留端口3000，因此我们必须为json-server定义一个替代端口，比如端口3001。--watch选项会自动查找对db.json所做的任何更改，并相应地更新服务器。

```js
json-server --port 3001 --watch db.json
```

<!-- However, a global installation is not necessary.  From the root directory of your app, we can run the <i>json-server</i> using the command _npx_:-->
然而，不必全局安装。从应用程序的根目录，我们可以使用_npx_命令运行<i>json-server</i>：

```js
npx json-server --port 3001 --watch db.json
```

<!-- Let''s navigate to the address <http://localhost:3001/notes> in the browser. We can see that <i>json-server</i> serves the notes we previously wrote to the file in JSON format:-->
让我们在浏览器中导航到地址<http://localhost:3001/notes>。我们可以看到<i>json-server</i>以JSON格式提供了我们先前写入文件的笔记：

![](../../images/2/14new.png)

<!-- If your browser doesn''t have a way to format the display of JSON-data, then install an appropriate plugin, e.g. [JSONVue](https://chrome.google.com/webstore/detail/jsonview/chklaanhfefbnpoihckbnefhakgolnmc) to make your life easier.-->
如果您的浏览器没有格式化JSON数据的方式，那么请安装适当的插件，例如[JSONVue](https://chrome.google.com/webstore/detail/jsonview/chklaanhfefbnpoihckbnefhakgolnmc)，以简化您的生活。

<!-- Going forward, the idea will be to save the notes to the server, which in this case means saving them to the json-server. The React code fetches the notes from the server and renders them to the screen. Whenever a new note is added to the application, the React code also sends it to the server to make the new note persist in "memory".-->
今后，我们的想法是将笔记保存到服务器，在这种情况下，这意味着将它们保存到json-server中。 React代码从服务器获取笔记并将其渲染到屏幕上。 每当向应用程序添加新笔记时，React代码还会将其发送到服务器以使新笔记永久保存在“内存”中。

<!-- json-server stores all the data in the <i>db.json</i> file, which resides on the server. In the real world, data would be stored in some kind of database. However, json-server is a handy tool that enables the use of server-side functionality in the development phase without the need to program any of it.-->
json-server存储所有数据在<i>db.json</i>文件中，该文件位于服务器上。在现实世界中，数据会存储在某种数据库中。然而，json-server是一个方便的工具，可以在开发阶段使用服务器端功能，而无需编写任何代码。

<!-- We will get familiar with the principles of implementing server-side functionality in more detail in [part 3](/en/part3) of this course.-->
我们将在本课程的[第三部分](/en/part3)详细了解实现服务器端功能的原则。

### The browser as a runtime environment

<!-- Our first task is fetching the already existing notes to our React application from the address <http://localhost:3001/notes>.-->
我们的第一个任务是从地址<http://localhost:3001/notes>中获取已经存在的笔记到我们的React应用程序中。

<!-- In the part0 [example project](/en/part0/fundamentals_of_web_apps#running-application-logic-on-the-browser), we already learned a way to fetch data from a server using JavaScript. The code in the example was fetching the data using [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest), otherwise known as an HTTP request made using an XHR object. This is a technique introduced in 1999, which every browser has supported for a good while now.-->
在第0部分[示例项目](/en/part0/fundamentals_of_web_apps#running-application-logic-on-the-browser)中，我们已经学习了一种使用JavaScript从服务器获取数据的方法。示例中的代码是使用[XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)获取数据，也称为使用XHR对象发出的HTTP请求。这是一种在1999年引入的技术，现在每个浏览器都支持它。

<!-- The use of XHR is no longer recommended, and browsers already widely support the [fetch](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch) method, which is based on so-called [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), instead of the event-driven model used by XHR.-->
不再推荐使用XHR，浏览器已经广泛支持基于所谓[promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)的[fetch](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch)方法，而不是XHR使用的事件驱动模型。

<!-- As a reminder from part0 (which one should <i>remember to not use</i> without a pressing reason), data was fetched using XHR in the following way:-->
作为part0的提醒（应<i>记住不要没有紧急原因而使用</i>），数据以下列方式使用XHR获取：

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

<!-- Right at the beginning, we register an <i>event handler</i> to the <em>xhttp</em> object representing the HTTP request, which will be called by the JavaScript runtime whenever the state of the <em>xhttp</em> object changes. If the change in state means that the response to the request has arrived, then the data is handled accordingly.-->
一开始，我们为代表HTTP请求的<em>xhttp</em>对象注册一个<i>事件处理程序</i>，JavaScript运行时将在<em>xhttp</em>对象的状态发生改变时调用该处理程序。如果状态的改变意味着响应请求已经到达，那么数据将会得到相应的处理。

<!-- It is worth noting that the code in the event handler is defined before the request is sent to the server. Despite this, the code within the event handler will be executed at a later point in time. Therefore, the code does not execute synchronously "from top to bottom", but does so <i>asynchronously</i>. JavaScript calls the event handler that was registered for the request at some point.-->
值得注意的是，事件处理程序中的代码是在请求发送到服务器之前定义的。尽管如此，事件处理程序中的代码将在稍后的时间点执行。因此，代码不是按“自上而下”的方式同步执行，而是<i>异步</i>执行。JavaScript在某个时间点调用为请求注册的事件处理程序。

<!-- A synchronous way of making requests that''s common in Java programming, for instance, would play out as follows (NB, this is not actually working Java code):-->
Java 编程中常见的同步请求方式如下（注意：以下并非实际的 Java 代码）：

```java
HTTPRequest request = new HTTPRequest();

String url = "https://studies.cs.helsinki.fi/exampleapp/data.json";
List<Note> notes = request.get(url);

notes.forEach(m => {
  System.out.println(m.content);
});
```

<!-- In Java, the code executes line by line and stops to wait for the HTTP request, which means waiting for the command _request.get(...)_ to finish. The data returned by the command, in this case the notes, are then stored in a variable, and we begin manipulating the data in the desired manner.-->
在Java中，代码按行执行，并停止等待HTTP请求，这意味着等待命令`request.get(...)`完成。命令返回的数据，在这种情况下是笔记，然后存储在变量中，然后我们开始以所需的方式操纵数据。

<!-- In contrast, JavaScript engines, or runtime environments follow the [asynchronous model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop). In principle, this requires all [IO operations](https://en.wikipedia.org/wiki/Input/output) (with some exceptions) to be executed as non-blocking. This means that code execution continues immediately after calling an IO function, without waiting for it to return.-->
相反，JavaScript引擎或运行环境遵循[异步模型](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop)。原则上，这要求所有[IO操作](https://en.wikipedia.org/wiki/Input/output)（有一些例外）都必须以非阻塞方式执行。这意味着在调用IO函数后，代码立即继续执行，而无需等待其返回。

<!-- When an asynchronous operation is completed, or, more specifically, at some point after its completion, the JavaScript engine calls the event handlers registered to the operation.-->
当一个异步操作完成，或者更具体地说，在它完成之后的某个时刻，JavaScript引擎会调用为此操作注册的事件处理函数。

<!-- Currently, JavaScript engines are <i>single-threaded</i>, which means that they cannot execute code in parallel. As a result, it is a requirement in practice to use a non-blocking model for executing IO operations. Otherwise, the browser would "freeze" during, for instance, the fetching of data from a server.-->
目前，JavaScript 引擎是<i>单线程</i>的，这意味著它们无法平行执行代码。因此，在实践中，需要使用非阻塞模型来执行 IO 操作。否则，在从服务器获取数据时，浏览器将会“冻结”。

<!-- Another consequence of this single-threaded nature of JavaScript engines is that if some code execution takes up a lot of time, the browser will get stuck for the duration of the execution. If we added the following code at the top of our application:-->
另一个JavaScript引擎单线程的后果是，如果某些代码执行需要很长时间，浏览器将在执行期间被卡住。如果我们在应用程序的顶部添加以下代码：

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
当定义为<em>setTimeout</em>参数的函数运行时，一切正常工作5秒钟。但是，在长循环的执行期间，浏览器将被卡住。即使在执行循环期间也不能关闭浏览器标签，至少在Chrome中是如此。

<!-- For the browser to remain <i>responsive</i>, i.e., to be able to continuously react to user operations with sufficient speed, the code logic needs to be such that no single computation can take too long.-->
为了使浏览器保持<i>响应性</i>，即能够以足够的速度持续对用户操作作出反应，代码逻辑需要是这样的，即没有单一计算可以花费太长时间。

<!-- There is a host of additional material on the subject to be found on the internet. One particularly clear presentation of the topic is the keynote by Philip Roberts called [What the heck is the event loop anyway?](https://www.youtube.com/watch?v=8aGhZQkoFbQ)-->
在互联网上可以找到大量有关此主题的附加材料。其中一个特别清晰的介绍是Philip Roberts的主题演讲[到底什么是事件循环？](https://www.youtube.com/watch?v=8aGhZQkoFbQ)

<!-- In today''s browsers, it is possible to run parallelized code with the help of so-called [web workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers). The event loop of an individual browser window is, however, still only handled by a [single thread](https://medium.com/techtrument/multithreading-javascript-46156179cf9a).-->
在今天的浏览器中，可以利用所谓的[网页工作者](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)来运行并行代码。然而，个别浏览器视窗的事件循环仍然仅由[单个线程](https://medium.com/techtrument/multithreading-javascript-46156179cf9a)处理。

### npm

<!-- Let''s get back to the topic of fetching data from the server.-->
让我们回到从服务器获取数据的话题。

<!-- We could use the previously mentioned promise-based function [fetch](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch) to pull the data from the server. Fetch is a great tool. It is standardized and supported by all modern browsers (excluding IE).-->
我们可以使用先前提到的基于promise的函数[fetch](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch)从服务器拉取数据。Fetch是一个很棒的工具，它是标准化的，并且所有现代浏览器（不包括IE）都支持它。

<!-- That being said, we will be using the [axios](https://github.com/axios/axios) library instead for communication between the browser and server. It functions like fetch but is somewhat more pleasant to use. Another good reason to use axios is our getting familiar with adding external libraries, so-called <i>npm packages</i>, to React projects.-->
那么说来，我们将使用[axios](https://github.com/axios/axios)库来代替浏览器和服务器之间的通信。 它的功能类似于fetch，但使用起来更加愉快。 另一个使用axios的好原因是我们熟悉将外部库，即所谓的<i>npm 包</i>添加到React项目中。

<!-- Nowadays, practically all JavaScript projects are defined using the node package manager, aka [npm](https://docs.npmjs.com/getting-started/what-is-npm). The projects created using create-react-app also follow the npm format. A clear indicator that a project uses npm is the <i>package.json</i> file located at the root of the project:-->
现在，几乎所有JavaScript专案都是使用节点套件管理器（也就是[npm](https://docs.npmjs.com/getting-started/what-is-npm)）定义的。 使用create-react-app创建的专案也遵循npm格式。 清楚地表明专案使用npm的指标是位于专案根目录下的<i>package.json</i>文件：

```json
{
  "name": "notes-frontend",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "web-vitals": "^2.1.4"
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

<!-- At this point, the <i>dependencies</i> part is of most interest to us as it defines what <i>dependencies</i>, or external libraries, the project has.-->
此时，最引起我们注意的是<i>依赖</i>部分，因为它定义了该项目的<i>依赖</i>，或外部库。

<!-- We now want to use axios. Theoretically, we could define the library directly in the <i>package.json</i> file, but it is better to install it from the command line.-->
现在我们想要使用axios。理论上，我们可以直接在<i>package.json</i>文件中定义该库，但是最好从命令行安装它。

```js
npm install axios
```

<!-- **NB _npm_-commands should always be run in the project root directory**, which is where the <i>package.json</i> file can be found.-->
**NB _npm_ 命令应该始终在项目根目录下运行**，这里可以找到<i>package.json</i>文件。

<!-- Axios is now included among the other dependencies:-->
Axios现已被包含在其他依赖项中：

```json
{
  "name": "notes-frontend",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "axios": "^1.2.2", // highlight-line
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "web-vitals": "^2.1.4"
  },
  // ...
}
```

<!-- In addition to adding axios to the dependencies, the <em>npm install</em> command also <i>downloaded</i> the library code. As with other dependencies, the code can be found in the <i>node\_modules</i> directory located in the root. As one might have noticed, <i>node\_modules</i> contains a fair amount of interesting stuff.-->
除了添加axios到依赖之外，<em>npm install</em> 命令也<i>下载</i>了库代码。与其他依赖一样，代码可以在根目录中的<i>node\_modules</i>目录中找到。正如人们所注意到的，<i>node\_modules</i>包含了大量有趣的东西。

<!-- Let''s make another addition. Install <i>json-server</i> as a development dependency (only used during development) by executing the command:-->
让我们再做一个添加。通过执行以下命令安装<i>json-server</i>作为开发依赖项（仅在开发期间使用）：

```js
npm install json-server --save-dev
```

<!-- and making a small addition to the <i>scripts</i> part of the <i>package.json</i> file:-->
在<i>package.json</i>文件的<i>scripts</i>部分做一个小的添加：

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
我们现在可以很方便的，在不需要参数定义的情况下，从专案根目录启动 json-server，命令如下：

```js
npm run server
```

<!-- We will get more familiar with the _npm_ tool in the [third part of the course](/en/part3).-->
我们将在[第三部分课程](/en/part3)中更加熟悉_npm_工具。

<!-- **NB** The previously started json-server must be terminated before starting a new one; otherwise, there will be trouble:-->
**注意：** 在启动新的json-server之前，必须先终止之前启动的json-server，否则会出现麻烦。

![cannot bind to port 3001 error](../../images/2/15b.png)

<!-- The red print in the error message informs us about the issue:-->
红色字体在错误消息中通知我们有关问题：

<i>Cannot bind to port 3001. Please specify another port number either through --port argument or through the json-server.json configuration file</i>

<!-- As we can see, the application is not able to bind itself to the [port](https://en.wikipedia.org/wiki/Port_(computer_networking)). The reason being that port 3001 is already occupied by the previously started json-server.-->
可以看到，该应用无法将自身绑定到[端口](https://en.wikipedia.org/wiki/Port_(computer_networking))上。原因是端口3001已经被先前启动的json-server占用了。

<!-- We used the command _npm install_ twice, but with slight differences:-->
我们使用命令`npm install`两次，但是有些许不同：

```js
npm install axios
npm install json-server --save-dev
```

<!-- There is a fine difference in the parameters. <i>axios</i> is installed as a runtime dependency of the application because the execution of the program requires the existence of the library. On the other hand, <i>json-server</i> was installed as a development dependency (_--save-dev_), since the program itself doesn''t require it. It is used for assistance during software development. There will be more on different dependencies in the next part of the course.-->
有一个微小的差别在参数上。因为程序的执行需要库的存在，所以<i>axios</i>被安装为应用程序的运行时依赖项。另一方面，<i>json-server</i>被安装为开发依赖项（_--save-dev_），因为程序本身不需要它。它用于软件开发期间的辅助。课程的下一部分将有更多关于不同依赖项的内容。

### Axios and promises

<!-- Now we are ready to use axios. Going forward, json-server is assumed to be running on port 3001.-->
现在我们准备使用axios了。今后，假定json-server正在端口3001上运行。

<!-- NB: To run json-server and your react app simultaneously, you may need to use two terminal windows. One to keep json-server running and the other to run react-app.-->
NB：要同时运行json-server和您的react应用程序，您可能需要使用两个终端窗口。 一个用于保持json-server运行，另一个用于运行react-app。

<!-- The library can be brought into use the same way other libraries, e.g. React, are, i.e., by using an appropriate <em>import</em> statement.-->
图书馆可以像使用其他库（如 React）一样使用，即通过使用适当的<em>import</em>语句。

<!-- Add the following to the file <i>index.js</i>:-->
在文件<i>index.js</i>中添加以下内容：

```js
import axios from 'axios'

const promise = axios.get('http://localhost:3001/notes')
console.log(promise)

const promise2 = axios.get('http://localhost:3001/foobar')
console.log(promise2)
```

<!-- If you open <http://localhost:3000> in the browser, this should be printed to the console-->
:

如果您在浏览器中打开 <http://localhost:3000>，这应该会被打印到控制台：

![promises printed to console](../../images/2/16new.png)

<!-- Axios'' method _get_ returns a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises).-->
Axios 的方法 _get_ 返回一个[承诺](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)。

<!-- The documentation on Mozilla''s site states the following about promises:-->
Mozilla 的网站上的文件说明如下有关于承诺：

<!-- > <i>A Promise is an object representing the eventual completion or failure of an asynchronous operation.</i>-->
> <i>承诺是一个代表异步操作最终完成或失败的对象。</i>

<!-- In other words, a promise is an object that represents an asynchronous operation. A promise can have three distinct states:-->
所以，承诺是一个代表异步操作的对象。承诺可以有三种不同的状态：

<!-- 1. The promise is <i>pending</i>: It means that the final value (one of the following two) is not available yet.-->
承诺<i>尚未定型</i>：这意味着最终值（其中之一）尚未可用。
<!-- 2. The promise is <i>fulfilled</i>: It means that the operation has been completed and the final value is available, which generally is a successful operation. This state is sometimes also called <i>resolved</i>.-->
承诺已<i>兑现</i>：这意味着操作已经完成，最终值可用，通常表示操作成功。这种状态有时也被称为<i>解决</i>。
<!-- 3. The promise is <i>rejected</i>: It means that an error prevented the final value from being determined, which generally represents a failed operation.-->
3. 承诺被<i>拒绝</i>：这意味着一个错误阻止了最终值被确定，这通常代表一个失败的操作。

<!-- The first promise in our example is <i>fulfilled</i>, representing a successful _axios.get('http://localhost:3001/notes')_ request. The second one, however, is <i>rejected</i>, and the console tells us the reason. It looks like we were trying to make an HTTP GET request to a non-existent address.-->
第一个承诺在我们的例子中是<i>兑现</i>的，代表一个成功的_axios.get('http://localhost:3001/notes')_请求。然而，第二个是<i>拒绝</i>的，控制台告诉我们原因。看起来我们试图向一个不存在的地址发出HTTP GET请求。

<!-- If, and when, we want to access the result of the operation represented by the promise, we must register an event handler to the promise. This is achieved using the method <em>then</em>:-->
如果我们想要访问承诺所表示操作的结果，我们必须向承诺注册一个事件处理程序。这是通过<em>then</em>方法实现的：

```js
const promise = axios.get('http://localhost:3001/notes')

promise.then(response => {
  console.log(response)
})
```

<!-- The following is printed to the console:-->
`Hello World!`

**输出到控制台：**

`你好，世界！`

![json object data printed to console](../../images/2/17new.png)

<!-- The JavaScript runtime environment calls the callback function registered by the <em>then</em> method providing it with a <em>response</em> object as a parameter. The <em>response</em> object contains all the essential data related to the response of an HTTP GET request, which would include the returned <i>data</i>, <i>status code</i>, and <i>headers</i>.-->
JavaScript 运行时环境调用由 <em>then</em> 方法注册的回调函数，并将 <em>response</em> 对象作为参数提供给它。 <em>response</em> 对象包含与 HTTP GET 请求响应相关的所有基本数据，其中包括返回的 <i>数据</i>、<i>状态码</i> 和 <i>标头</i>。

<!-- Storing the promise object in a variable is generally unnecessary, and it''s instead common to chain the <em>then</em> method call to the axios method call, so that it follows it directly:-->
将promise对象存储在变量中通常是不必要的，更常见的是将<em>then</em>方法调用链接到axios方法调用，以便它直接跟随它：

```js
axios.get('http://localhost:3001/notes').then(response => {
  const notes = response.data
  console.log(notes)
})
```

<!-- The callback function now takes the data contained within the response, stores it in a variable, and prints the notes to the console.-->
回调函数现在接收响应中包含的数据，将其存储在变量中，并将注释打印到控制台。

<!-- A more readable way to format <i>chained</i> method calls is to place each call on its own line:-->
更易读的格式化 <i>链式</i> 方法调用的方式是，将每个调用放在它自己的一行中：

```js
axios
  .get('http://localhost:3001/notes')
  .then(response => {
    const notes = response.data
    console.log(notes)
  })
```

<!-- The data returned by the server is plain text, basically just one long string. The axios library is still able to parse the data into a JavaScript array, since the server has specified that the data format is <i>application/json; charset=utf-8</i> (see the previous image) using the <i>content-type</i> header.-->
服务器返回的数据是纯文本，基本上只是一个长字符串。 由于服务器已指定数据格式为<i>application/json; charset=utf-8</i>（请参阅前面的图片），因此axios库仍然可以将数据解析为JavaScript数组，使用<i>content-type</i>头。

<!-- We can finally begin using the data fetched from the server.-->
我们终于可以开始使用从服务器获取的数据了。

<!-- Let's try and request the notes from our local server and render them, initially as the App component. Please note that this approach has many issues, as we're rendering the entire <i>App</i> component only when we successfully retrieve a response:-->
让我们尝试从我们的本地服务器请求笔记，并将它们最初呈现为App组件。请注意，此方法存在许多问题，因为我们仅在成功检索响应时才呈现整个<i>App</i>组件：

```js
import ReactDOM from 'react-dom/client'
import axios from 'axios'
import App from './App'

axios.get('http://localhost:3001/notes').then(response => {
  const notes = response.data
  ReactDOM.createRoot(document.getElementById('root')).render(<App notes={notes} />)
})
```

<!-- This method could be acceptable in some circumstances, but it's somewhat problematic. Let's instead move the fetching of the data into the <i>App</i> component.-->
这种方法在某些情况下可以接受，但有些问题。让我们把数据的获取移动到<i>App</i>组件中吧。

<!-- What''s not immediately obvious, however, is where the command <em>axios.get</em> should be placed within the component.-->
<em>axios.get</em> 然而不是立刻明显的是应该把命令放在组件内部的哪里。

### Effect-hooks

<!-- We have already used [state hooks](https://react.dev/learn/state-a-components-memory) that were introduced along with React version [16.8.0](https://www.npmjs.com/package/react/v/16.8.0), which provide state to React components defined as functions - the so-called <i>functional components</i>. Version 16.8.0 also introduces [effect hooks](https://react.dev/reference/react#effect-hooks) as a new feature. As per the official docs:-->
我们已经使用伴随 React 版本[16.8.0](https://www.npmjs.com/package/react/v/16.8.0)一起引入的[状态钩子](https://react.dev/learn/state-a-components-memory)，它们为定义为函数的 React 组件提供状态 - 所谓的<i>函数组件</i>。版本 16.8.0 也引入了[效果钩子](https://react.dev/reference/react#effect-hooks)作为一项新功能。根据官方文档：

<!-- > <i>The Effect Hook lets you perform side effects on function components.</i>-->
> <i>Effect Hook 可以让你在函数组件上执行副作用。</i>
<!-- > <i>Data fetching, setting up a subscription, and manually changing the DOM in React components are all examples of side effects.</i>-->
> <i>在 React 组件中，数据获取、设置订阅和手动更改 DOM 都是副作用的示例。</i>

<!-- As such, effect hooks are precisely the right tool to use when fetching data from a server.-->
因此，当从服务器获取数据时，effect 钩子正是使用的正确工具。

<!-- Let's remove the fetching of data from <i>index.js</i>. Since we're going to be retrieving the notes from the server, there is no longer a need to pass data as props to the <i>App</i> component. So <i>index.js</i> can be simplified to:-->
让我们从<i>index.js</i>中删除数据获取。由于我们将从服务器检索笔记，因此不再需要将数据作为props传递给<i>App</i>组件。因此，<i>index.js</i>可以简化为：

```js
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

<!-- The <i>App</i> component changes as follows:-->
<i>App</i> 组件的变化如下：

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
我们还添加了几个有用的打印，这些打印澄清了执行的进展。

<!-- This is printed to the console:-->
这被打印到控制台：

<pre>
render 0 notes
effect
promise fulfilled
render 3 notes
</pre>

<!-- First, the body of the function defining the component is executed and the component is rendered for the first time. At this point <i>render 0 notes</i> is printed, meaning data hasn''t been fetched from the server yet.-->
首先，执行定义组件的函数体，并首次渲染组件。此时会打印<i>render 0 notes</i>，意味着尚未从服务器获取数据。

<!-- The following function, or effect in React parlance:-->
下面的函数，或者在 React 语言中称为效果：

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
<i>effect</i> 在渲染之后立即执行。函数的执行结果会将<i>effect</i>打印到控制台，而命令<em>axios.get</em>则会启动从服务器获取数据的操作，同时还会将下面的函数注册为该操作的<i>事件处理器</i>：

```js
response => {
  console.log('promise fulfilled')
  setNotes(response.data)
})
```

<!-- When data arrives from the server, the JavaScript runtime calls the function registered as the event handler, which prints <i>promise fulfilled</i> to the console and stores the notes received from the server into the state using the function <em>setNotes(response.data)</em>.-->
当数据从服务器接收到时，JavaScript运行时会调用注册为事件处理程序的函数，该函数将 <i>promise fulfilled</i> 打印到控制台，并使用函数 <em>setNotes(response.data)</em>将从服务器接收到的笔记存储到状态中。

<!-- As always, a call to a state-updating function triggers the re-rendering of the component. As a result, <i>render 3 notes</i> is printed to the console, and the notes fetched from the server are rendered to the screen.-->
如往常一样，调用状态更新函数就会触发组件的重新渲染。结果，控制台会打印出 <i>渲染3个笔记</i>，并将从服务器获取的笔记渲染到屏幕上。

<!-- Finally, let''s take a look at the definition of the effect hook as a whole:-->
最后，让我们总体看一下 effect hook 的定义：

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

<!-- Let''s rewrite the code a bit differently.-->
让我们以不同的方式重写代码吧。

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

<!-- Now we can see more clearly that the function [useEffect](https://react.dev/reference/react/useEffect) takes <i>two parameters</i>. The first is a function, the <i>effect</i> itself. According to the documentation:-->
现在我们可以更清楚地看到，函数[useEffect](https://react.dev/reference/react/useEffect)接受<i>两个参数</i>。第一个是一个函数，<i>效果</i>本身。根据文档：

<!-- > <i>By default, effects run after every completed render, but you can choose to fire it only when certain values have changed.</i>-->
<i>默认情况下，每次渲染完成后都会运行效果，但您可以选择仅在某些值发生变化时触发它。</i>

<!-- So by default, the effect is <i>always</i> run after the component has been rendered. In our case, however, we only want to execute the effect along with the first render.-->
所以默认情况下，效果<i>总是</i>在组件渲染后运行。但是在我们的情况下，我们只希望在第一次渲染时执行效果。

<!-- The second parameter of <em>useEffect</em> is used to [specify how often the effect is run](https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect). If the second parameter is an empty array <em>[]</em>, then the effect is only run along with the first render of the component.-->
<em>useEffect</em>的第二个参数用于[指定效果运行的频率](https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect)。如果第二个参数是一个空数组<em>[]</em>，那么该效果只会随着组件的第一次渲染而运行。

<!-- There are many possible use cases for an effect hook other than fetching data from the server. However, this use is sufficient for us, for now.-->
有许多可能的使用案例可以使用 Effect Hook，而不仅仅是从服务器获取数据。不过，现在对我们来说，这种用法已经足够了。

<!-- Think back to the sequence of events we just discussed. Which parts of the code are run? In what order? How often? Understanding the order of events is critical!-->
思考刚才我们讨论的事件序列。哪些代码会被执行？按照什么顺序？多久执行一次？理解事件的顺序至关重要！

<!-- Note that we could have also written the code for the effect function this way:-->
注意我们也可以这样编写效果函数的代码：

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

<!-- A reference to an event handler function is assigned to the variable <em>eventHandler</em>. The promise returned by the <em>get</em> method of Axios is stored in the variable <em>promise</em>. The registration of the callback happens by giving the <em>eventHandler</em> variable, referring to the event-handler function, as a parameter to the <em>then</em> method of the promise. It isn''t usually necessary to assign functions and promises to variables, and a more compact way of representing things, as seen further above, is sufficient.-->
变量<em>eventHandler</em>被赋予一个指向事件处理函数的引用。Axios的<em>get</em>方法返回的promise被存储在变量<em>promise</em>中。回调的注册是通过将<em>eventHandler</em>变量，指向事件处理函数，作为promise的<em>then</em>方法的参数来实现的。通常不必将函数和promise分配给变量，更紧凑的表示方式，如上面所示，就足够了。

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

<!-- We still have a problem with our application. When adding new notes, they are not stored on the server.-->
我们在应用程序上仍然有一个问题。当添加新的笔记时，它们不会被存储在服务器上。

<!-- The code for the application, as described so far, can be found in full on [github](https://github.com/fullstack-hy2020/part2-notes/tree/part2-4), on branch <i>part2-4</i>.-->
应用程序的代码，就像迄今为止描述的那样，可以在[github](https://github.com/fullstack-hy2020/part2-notes/tree/part2-4)上的<i>part2-4</i>分支上找到完整的代码。

### The development runtime environment

<!-- The configuration for the whole application has steadily grown more complex. Let''s review what happens and where. The following image describes the makeup of the application-->
.

为整个应用程序的配置不断变得更加复杂。让我们回顾一下发生了什么以及发生在哪里。下图描述了应用程序的组成。

![diagram of composition of react app](../../images/2/18e.png)

<!-- The JavaScript code making up our React application is run in the browser. The browser gets the JavaScript from the <i>React dev server</i>, which is the application that runs after running the command <em>npm start</em>. The dev-server transforms the JavaScript into a format understood by the browser. Among other things, it stitches together JavaScript from different files into one file. We''ll discuss the dev-server in more detail in part 7 of the course.-->
浏览器运行组成我们的React应用的JavaScript代码。浏览器从<i>React开发服务器</i>获取JavaScript，这是在运行命令<em>npm start</em>后运行的应用程序。开发服务器将JavaScript转换为浏览器可以理解的格式。除其他外，它将来自不同文件的JavaScript拼接在一起成为一个文件。我们将在课程的第七部分中更详细地讨论开发服务器。

<!-- The React application running in the browser fetches the JSON formatted data from <i>json-server</i> running on port 3001 on the machine. The server we query the data from - <i>json-server</i> - gets its data from the file <i>db.json</i>.-->
浏览器中运行的React应用程序从运行在机器上端口3001上的<i>json-server</i>获取JSON格式的数据。我们查询数据的服务器-<i>json-server</i>-从文件<i>db.json</i>获取数据。

<!-- At this point in development, all the parts of the application happen to reside on the software developer''s machine, otherwise known as localhost. The situation changes when the application is deployed to the internet. We will do this in part 3.-->
此时在开发中，应用程序的所有部分都发生在软件开发者的机器上，也称为localhost。当应用程序部署到互联网上时，情况就会改变。我们将在第3部分进行此操作。

</div>

<div class="tasks">

<h3>Exercise 2.11.</h3>

<h4>2.11: The Phonebook Step6</h4>

<!-- We continue with developing the phonebook. Store the initial state of the application in the file <i>db.json</i>, which should be placed in the root of the project.-->
我们继续开发电话簿。将应用程序的初始状态存储在文件<i>db.json</i>中，该文件应放置在项目的根目录中。

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
在端口3001上启动json-server，并确保通过浏览器访问<http://localhost:3001/persons>可以返回人员列表。

<!-- If you receive the following error message:-->
**如果您收到以下错误消息：**

```js
events.js:182
      throw er; // Unhandled 'error' event
      ^

Error: listen EADDRINUSE 0.0.0.0:3001
    at Object._errnoException (util.js:1019:11)
    at _exceptionWithHostPort (util.js:1041:20)
```

<!-- it means that port 3001 is already in use by another application, e.g. in use by an already running json-server. Close the other application, or change the port in case that doesn''t work.-->
这意味着端口3001已被另一个应用程序占用，例如已经在运行的json-server。关闭其他应用程序，或者如果不起作用，更改端口。

<!-- Modify the application such that the initial state of the data is fetched from the server using the <i>axios</i>-library. Complete the fetching with an [Effect hook](https://react.dev/reference/react/useEffect).-->
修改应用程序，使数据的初始状态通过使用<i>axios</i>库从服务器获取。 使用[Effect hook](https://react.dev/reference/react/useEffect)完成获取。

</div>
