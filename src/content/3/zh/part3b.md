---
mainImage: ../../../images/part-3.svg
part: 3
letter: b
lang: zh
---

<div class="content">


<!-- Yhdistetään seuraavaksi [osassa 2](/osa2) tekemämme frontend omaan backendiimme.  -->

Next let's connect the frontend we made in [part 2](/part2) to our own backend.
接下来，让我们将[第2章节](/zh/part2)中制作的前端连接到我们自己的后端。

<!-- Edellisessä osassa backendinä toiminut json-server tarjosi muistiinpanojen listan osoitteessa http://localhost:3001/notes fronendin käyttöön. Backendimme urlien rakenne on hieman erilainen, muistiinpanot löytyvät osoitteesta http://localhost:3001/api/notes, eli muutetaan frontendin tiedostossa <i>src/services/notes.js</i> määriteltyä muuttujaa _baseUrl_ seuraavasti: -->

In the previous part, the frontend could ask for the list of notes from the json-server we had as a backend at from the address http://localhost:3001/notes.
在前面的部分中，前端可以从作为后端的 json 服务器向地址 http://localhost:3001/notes 索取笔记列表。
Our backend has a bit different url structure, and the notes can be found from http//localhost:3001/api/notes. 
我们的后端有一个稍微不同的 url 结构，注释可以从 http / / localhost: 3001 / api / notes 中找到。
Let's change the attribute __baseUrl__ in the <i>src/services/notes.js</i> like so:
让我们像下面这样修改<i>src / services / notes. js</i> 中的属性 baseUrl:

```js
import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/notes' //highlight-line

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

// ...

export default { getAll, create, update }
```

<!-- Frontendin tekemä GET-pyyntö osoitteeseen <http://localhost:3001/api/notes> ei jostain syystä toimi: -->

Now frontend's GET request to <http://localhost:3001/api/notes> does not work for some reason:
现在前端的 GET 请求由于某些原因不能工作:  http://localhost:3001/api/notes:

![](../../images/3/3ae.png)


<!-- Mistä on kyse? Backend toimii kuitenkin selaimesta ja postmanista käytettäessä ilman ongelmaa. -->

What's going on here? We can access the backend from a browser and from postman without any problems.
这是怎么回事? 我们可以从浏览器和邮递员访问后端，没有任何问题。

### Same origin policy and CORS
# # # 同源政策和 CORS

The issue lies with a thing called CORS, or Cross-Origin Resource Sharing. 
问题出在一个叫 CORS 的东西上，或者叫跨来源资源共享。

According to [Wikipedia](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing):
根据[维基百科]( https://en.Wikipedia.org/wiki/cross-origin_resource_sharing ) :

> <i>Cross-origin resource sharing (CORS) is a mechanism that allows restricted resources (e.g. fonts) on a web page to be requested from another domain outside the domain from which the first resource was served. A web page may freely embed cross-origin images, stylesheets, scripts, iframes, and videos. Certain "cross-domain" requests, notably Ajax requests, are forbidden by default by the same-origin security policy.</i>
Icors (CORS)是一种机制，它允许一个网页上受限制的资源(例如字体)从提供第一个资源的域名以外的另一个域名请求跨来源资源共享。 一个网页可以自由地嵌入跨来源的图片、样式表、脚本、 iframe 和视频。 默认情况下，同源安全策略禁止某些“跨域”请求，特别是 Ajax 请求。 我

In our context the problem is that, by default, the JavaScript code of an application that runs in a browser can only communicate with a server in the same [origin](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy). 
在我们的上下文中，问题在于，默认情况下，运行在浏览器中的应用的 JavaScript 代码只能与同一[原点]的服务器通信( https://developer.mozilla.org/en-us/docs/web/security/same-origin_policy )。
Because our server is in localhost port 3001, and our frontend in localhost port 3000, they do not have the same origin.
因为我们的服务器位于本地主机端口3001，而我们的前端位于本地主机端口3000，所以它们不具有相同的起源。

Keep in mind, that [same origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy) and CORS are not specific to React or Node. They are in fact universal principles of the operation of web applications. 
请记住，[同源策略]( https://developer.mozilla.org/en-us/docs/web/security/same-origin_policy )和 CORS 并不是特定于 React 或 Node 的。 它们实际上是 web 应用操作的通用原则。

We can allow requests from other <i>origins</i> by using Node's [cors](https://github.com/expressjs/cors) middleware.
我们可以通过使用 Node 的[ cors ]( https://github.com/expressjs/cors )中间件来允许来自其他 i / i 源的请求。

Install <i>cors</i> with the command
使用命令安装<i>cors</i>

```bash
npm install cors --save
```

take the middleware to use and allow for requests from all origins: 
使用中间件并允许来自所有来源的请求:

```js
const cors = require('cors')

app.use(cors())
```

And the frontend works! However, the functionality for changing the importance of notes has not yet been implemented to the backend. 
而且前端工作！ 但是，在后端还没有实现更改注释重要性的功能。

You can read more about CORS from [Mozillas page](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).
你可以阅读更多关于 CORS 从[ Mozillas 页面]( https://developer.mozilla.org/en-us/docs/web/http/CORS )。

### Application to the Internet
# # # 网上申请

Now that the whole stack is ready, let's move our application to the internet. We'll use good old [Heroku](https://www.heroku.com) for this.
现在整个堆栈已经准备就绪，让我们将应用移动到互联网上。 我们将使用古老的 Heroku  https://www.Heroku.com。

>If you have never used Heroku before, you can find instructions from [Heroku documentation](https://devcenter.heroku.com/articles/getting-started-with-nodejs) or by Googling.
如果您以前从未使用过 Heroku，您可以从[ Heroku 文档](Heroku  https://devcenter.Heroku.com/articles/getting-started-with-nodejs 文档)或通过谷歌搜索找到指令。

Add a file called  <i>Procfile</i> to the project's root to tell Heroku how to start the application. 
向项目的根目录添加一个名为<i>Procfile</i> 的文件，告诉 Heroku 如何启动应用。

```bash
web: node index.js
```

Change the definition of the port our application uses at the bottom of the <i>index.js</i> file like so: 
更改应用在<i>index.js</i> 文件底部使用的端口的定义，如下所示:

```js
const PORT = process.env.PORT || 3001  // highlight-line
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

Now we are using the port defined in [environment variable](https://en.wikipedia.org/wiki/Environment_variable) _PORT_ or port 3001 if the environment variable _PORT_ is undefined. 
现在我们使用的端口定义在[环境变量]( https://en.wikipedia.org/wiki/environment_variable )端口或端口3001，如果环境变量端口是未定义的。
Heroku configures application port based on the environment variable. 
Heroku 在环境变量的基础上配置应用端口。

Create a Git repository in the project directory, and add <i>.gitignore</i> with the following contents
在项目目录中创建一个 Git 存储库，并使用如下内容添加 i. gidignore / i

```bash
node_modules
```

Create a Heroku application with the command <i>heroku create</i>, create a Git repository in the application directory, commit the code and move it to Heroku with command <i>git push heroku master</i>.
使用命令<i>Heroku Create</i> 创建一个 Heroku 应用，在 application 目录中创建一个 Git 仓库，提交代码并将其移动到 Heroku，命令<i>Git push Heroku master</i>。

If everything went well, the application works:
如果一切顺利，应用就能正常工作:

![](../../images/3/25ea.png)


If not, the issue can be found by reading heroku logs with command <i>heroku logs</i>.
如果没有，可以通过使用命令<i>heroku logs</i> 读取 heroku logs 来发现这个问题。

>**NB** At least in the beginning it's good to keep an eye on the heroku logs at all times. The best way to do this is with command <i>heroku logs -t</i> which prints the logs to console whenever something happens on the server. 
至少在开始的时候，随时关注 heroku 日志是有好处的。 实现这一点的最佳方法是使用命令<i>heroku logs-t</i>，该命令在服务器上发生任何事情时将日志打印到控制台。

The frontend also works with the backend on Heroku. You can check this by changing the backend's address on the frontend to be the backend's address in Heroku instead of <i>http://localhost:3001</i>.
前端也与 Heroku 的后端一起工作。 你可以通过更改前端的后端地址作为后端在 Heroku 的地址来检查这个 http://localhost:3001。

The next question is, how do we deploy the frontend to the Internet? We have multiple options. Let's go through one of them next. 
下一个问题是，我们如何将前端部署到互联网？ 我们有多种选择。 接下来我们来看看其中的一个。

### Frontend production build
# # # 前端生产构建

So far we have been running React code in <i>development mode</i>. In development mode the application is configured to give clear error messages, immediately render code changes to the browser, and so on. 
到目前为止，我们一直在<i>开发模式</i> 中运行 React code。 在开发模式下，应用被配置为提供清晰的错误消息，立即向浏览器渲染代码更改，等等。

When the application is deployed, we must create a [production build](https://reactjs.org/docs/optimizing-performance.html#use-the-production-build) or a version of the application which is optimized for production. 
当应用被部署时，我们必须创建一个[生产构建]( https://reactjs.org/docs/optimizing-performance.html#use-the-production-build )或一个为生产而优化的应用版本。

A production build of applications created with <i>create-react-app</i> can be created with command [npm run build](https://github.com/facebookincubator/create-react-app#npm-run-build-or-yarn-build).
使用<i>create-react-app</i> 创建的应用的生产构建可以使用命令[ npm run build ]( https://github.com/facebookincubator/create-react-app#npm-run-build-or-yarn-build )创建。

Let's run this command from the <i>root of the frontend project</i>.
让我们从前端项目 / i 的 i 根目录运行这个命令。

This creates a directory called <i>build</i> (which contains the only HTML file of our application, <i>index.html</i> ) which contains the directory <i>static</i>. [Minified](<https://en.wikipedia.org/wiki/Minification_(programming)>) version of our application's JavaScript code will be generated to the <i>static</i>  directory. Even though the application code is in multiple files, all of the JavaScript will be minified into one file. Actually all of the code from all of the application's dependencies will also be minified into this single file. 
这将创建一个名为<i>build</i> 的目录(其中包含应用中唯一的 HTML 文件<i>index. HTML</i>) ，其中包含目录<i>static</i>。 我们应用的 JavaScript 代码的[ Minified ]( https://en.wikipedia.org/wiki/minification_(programming))版本将生成到<i>static</i> 目录。 即使应用代码位于多个文件中，所有的 JavaScript 都将被缩小到一个文件中。 实际上，来自所有应用依赖项的所有代码也将缩小到这个单一文件中。

The minified code is not very readable. The beginning of the code looks like this: 
缩小后的代码可读性不是很好，代码的开头是这样的:

```js
!function(e){function r(r){for(var n,f,i=r[0],l=r[1],a=r[2],c=0,s=[];c<i.length;c++)f=i[c],o[f]&&s.push(o[f][0]),o[f]=0;for(n in l)Object.prototype.hasOwnProperty.call(l,n)&&(e[n]=l[n]);for(p&&p(r);s.length;)s.shift()();return u.push.apply(u,a||[]),t()}function t(){for(var e,r=0;r<u.length;r++){for(var t=u[r],n=!0,i=1;i<t.length;i++){var l=t[i];0!==o[l]&&(n=!1)}n&&(u.splice(r--,1),e=f(f.s=t[0]))}return e}var n={},o={2:0},u=[];function f(r){if(n[r])return n[r].exports;var t=n[r]={i:r,l:!1,exports:{}};return e[r].call(t.exports,t,t.exports,f),t.l=!0,t.exports}f.m=e,f.c=n,f.d=function(e,r,t){f.o(e,r)||Object.defineProperty(e,r,{enumerable:!0,get:t})},f.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})
```

### Serving static files from the backend
从后端服务静态文件

One option for deploying the frontend is to copy the production build (the <i>build</i> directory) to the root of the backend repository and configure the backend to show the frontend's <i>main page</i> (the file <i>build/index.html</i>) as its main page. 
部署前端的一个选择是将生产构建(i build /<i>目录)复制到后端存储库的根目录，并配置后端以显示前端的 i main page</i> (文件<i>build</i>ndex.html / i)作为其主页。

We begin by copying the production build of the frontend to the root of the backend. With my computer the copying can be done from the frontend directory with the command
我们从将前端的生产构建复制到后端的根开始。 使用我的计算机，可以通过命令从前端目录进行复制

```bash
cp -r build ../../../osa3/notes-backend
```

The backend directory should now look as follows:
后端目录现在应该如下所示:

![](../../images/3/27ea.png)


To make express show <i>static content</i>, the page <i>index.html</i> and the JavaScript etc. it fetches, we need a built-in middleware from express called [static](http://expressjs.com/en/starter/static-files.html).
为了让 express show<i>static content</i>、 page<i>index.html</i> 和它所获取的 JavaScript 等等，我们需要一个来自 express 的内置中间件，称为[ static ]( http://expressjs.com/en/starter/static-files.html )。

When we add the following amidst the declarations of middlewares
当我们在中间件声明中添加如下内容时
```js
app.use(express.static('build'))
```

whenever express gets an HTTP GET request it will first check if the <i>build</i> directory contains a file corresponding to the request's address. If a correct file is found, express will return it. 
每当 express 收到一个 HTTP GET 请求时，它都会首先检查<i>build</i> 目录是否包含与请求地址对应的文件。 如果找到正确的文件，express 将返回该文件。

Now HTTP GET requests to the address <i>www.serversaddress.com/index.html</i> or <i>www.serversaddress.com</i> will show the React frontend. GET requests to the address <i>www.serversaddress.com/notes</i> will be handled by the backend's code.
现在 HTTP GET request to the address<i>/  www.serversaddress.com/index.html </i> 或<i>/  www.serversaddress.com </i> 将显示 React frontend。 Get 请求到地址 i / i 的 www.serversaddress.com/notes 将由后端代码处理。

Because on our situation, both the frontend and the backend are at the same address, we can declare _baseUrl_ as a [relative](https://www.w3.org/TR/WD-html40-970917/htmlweb.html#h-5.1.2) URL. This means we can leave out the part declaring the server. 
因为在我们的情况下，前端和后端都在同一个地址，所以我们可以声明 baseUrl 为[ relative ]( https://www.w3.org/tr/wd-html40-970917/htmlweb.html#h-5.1.2) URL。 这意味着我们可以省略声明服务器的部分。

```js
import axios from 'axios'
const baseUrl = '/api/notes' // highlight-line

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

// ...
```

After the change, we have to create a new production build and copy it to the root of the backend repository. 
更改之后，我们必须创建一个新的生产构建，并将其复制到后端存储库的根。

The application can now be used from the <i>backend</i> address <http://localhost:3001>:
该应用现在可以从<i>后端</i> 地址 http://localhost:3001中使用:

![](../../images/3/28e.png)


Our application now works exactly like the [single-page app](/en/part0/fundamentals_of_web_apps#single-page-app) example application we studied in part 0. 
我们的应用现在的工作方式与我们在第0章节中研究的[单页应用](/ en / part0 / web 应用的基本原理 # single-page-app)示例应用完全一样。

When we use a browser to go to the address <http://localhost:3001>, the server returns the <i>index.html</i> file from the <i>build</i> repository. Summarized contents of the file are as follows: 
当我们使用浏览器访问地址 http://localhost:3001时，服务器从<i>build</i> 存储库返回<i>index. html</i> 文件。 档案的摘要内容如下:

```html
<head>
  <meta charset="utf-8"/>
  <title>React App</title>
  <link href="/static/css/main.f9a47af2.chunk.css" rel="stylesheet">
</head>
<body>
  <div id="root"></div>
  <script src="/static/js/1.578f4ea1.chunk.js"></script>
  <script src="/static/js/main.104ca08d.chunk.js"></script>
</body>
</html>
```

The file contains instructions to fetch a CSS stylesheet defining the styles of the application, and two <i>script</i> tags which instruct the browser to fetch the JavaScript code of the application - the actual React application. 
该文件包含一些指令，用于获取定义应用样式的 CSS 样式表，以及两个<i>script</i> 标记，这些标记指示浏览器获取应用的 JavaScript 代码——实际的 React 应用。

The React code fetches notes from the server address <http://localhost:3001/notes> and renders them to the screen. The communications between the server and the browser can be seen in the <i>Network</i> tab of the developer console:
React代码从服务器地址 http://localhost:3001/notes 获取笔记并将它们渲染到屏幕上。 服务器和浏览器之间的通信可以在开发控制台的<i>Network</i> 选项卡中看到:

![](../../images/3/29ea.png)


After ensuring that the production version of the application works locally, commit the production build of the frontend to the backend repository, and push the code to Heroku again. 
确保应用的生产版本在本地工作之后，将前端的生产构建提交到后端存储库，并将代码再次推送到 Heroku。

[The application](https://vast-oasis-81447.herokuapp.com/) works perfectly, except we haven't added the functionality for changing the importance of a note to the backend yet. 
除了我们还没有添加改变后端注释重要性的功能之外，[应用]( https://vast-oasis-81447.herokuapp.com/ )运行得非常好。

![](../../images/3/30ea.png)


Our application saves the notes to a variable. If the application crashes or is restarted, all of the data will disappear. 
我们的应用将笔记保存到一个变量中。 如果应用崩溃或重新启动，所有数据都将消失。

The application needs a database. Before we introduce one, let's go through a few things. 
应用需要一个数据库。

###  Streamlining deploying of the frontend 
# # # 简化前端部署

To create a new production build of the frontend without extra manual work, let's add some npm-scripts to the <i>package.json</i> of the backend repository: 
为了在没有额外手工工作的情况下创建前端的新的生产构建，我们在后端存储库的<i>package.json</i> 中添加一些 npm-scripts:

```json
{
  "scripts": {
    "build:ui": "rm -rf build && cd ../../osa2/materiaali/notes-new && npm run build --prod && cp -r build ../../../osa3/notes-backend/",
    "deploy": "git push heroku master",
    "deploy:full": "npm run build:ui && git add . && git commit -m uibuild && npm run deploy",    
    "logs:prod": "heroku logs --tail"
  }
}
```

The script _npm run build:ui_ builds the frontend and copies the production version under the backend repository.  _npm run deploy_ releases the current backend to heroku. 
脚本 npm run build: ui 构建前端，并在后端存储库下复制生产版本。 Npm run deploy releases the current backend to heroku.

_npm run deploy:full_ combines these two and contains the necessary <i>git</i> commands to update the backend repository. 
Npm run deploy: full 将这两者结合起来，并包含更新后端存储库所需的<i>git</i> 命令。

There is also a script _npm run logs:prod_ to show the heroku logs.
还有一个脚本 npm 运行日志: prod 显示 heroku 日志。

Note that the directory paths in the script <i>build:ui</i> depend on the location of repositories in the file system.
注意，我构建的脚本中的目录路径: ui / i 依赖于文件系统中存储库的位置。

>**NB**  <i>build:ui</i> does not work on Windows, go to [Solution](https://github.com/fullstackopen-2019/fullstackopen-2019.github.io/issues/420)  
* * NB * *<i>build: ui</i> 不能在 Windows 上工作，请转到[ Solution ]( https://github.com/fullstackopen-2019/fullstackopen-2019.github.io/issues/420)

### Proxy
代理人

Changes on the frontend have caused it to no longer work in development mode (when started with command _npm start_), as the connection to the backend does not work. 
前端上的更改导致它不再在开发模式下工作(当使用命令 npm start 启动时) ，因为到后端的连接不工作。

![](../../images/3/32ea.png)


This is due to changing the backend address to a relative URL: 
这是由于将后端地址更改为一个相对 URL:

```js
const baseUrl = '/api/notes'
```

Because in development mode the frontend is at the address <i>localhost:3000</i>, the requests to the backend go to the wrong address <i>localhost:3000/api/notes</i>. The backend is at <i>localhost:3001</i>. 
因为在开发模式下，前端位于地址<i>localhost: 3000</i>，所以对后端的请求会发送到错误的地址<i>localhost: 3000 / api / notes</i>。 后端位于<i>localhost: 3001</i>。

If the project was created with create-react-app, this problem is easy to solve. It is enough to add the following declaration to the <i>package.json</i> file of the frontend repository. 
如果这个项目是用 create-react-app 创建的，那么这个问题很容易解决。 将如下声明添加到前端存储库的<i>package.json</i> 文件中就足够了。

```bash
{
  "dependencies": {
    // ...
  },
  "scripts": {
    // ...
  },
  "proxy": "http://localhost:3001"  // highlight-line
}
```

After a restart, the React development environment will work as a [proxy](https://create-react-app.dev/docs/proxying-api-requests-in-development/). If the React code does an HTTP request to a server address at <i>http://localhost:3000</i> not managed by the React application itself (i.e when requests are not about fetching the CSS or JavaScript of the application), the request will be redirected to the server at <i>http://localhost:3001</i>. 
在重新启动之后，React 开发环境将作为一个[代理]( https://create-React-app.dev/docs/proxying-api-requests-in-development/ )工作。 如果 React 代码对服务器地址发出了一个 HTTP 请求，该地址位于<i> HTTP://localhost:3000</i>，而不是 React 应用本身管理的地址(即当请求不是为了获取应用的 CSS 或 JavaScript) ，那么该请求将被重定向到<i> HTTP://localhost:3001</i> 的服务器。

Now the frontend is also fine, working with the server both in development- and production mode. 
现在前端也很好，可以在开发和生产模式下与服务器一起工作。

A negative aspect of our approach is how complicated it is to deploy the frontend. Deploying a new version requires generating new production build of the frontend and copying it to the backend repository. This makes creating an automated [deployment pipeline](https://martinfowler.com/bliki/DeploymentPipeline.html) more difficult. Deployment pipeline means an automated and controlled way to move the code from the computer of the developer through different tests and quality checks to the production environment. 
我们方法的一个消极方面是前端部署的复杂程度。 部署新版本需要生成新的前端生产构建并将其复制到后端存储库。 这使得创建一个自动化的[部署管道]( https://martinfowler.com/bliki/deploymentpipeline.html 管道)变得更加困难。 部署管道意味着通过不同的测试和质量检查将代码从开发人员的计算机转移到生产环境的自动化和受控的方法。

There are multiple ways to achieve this (for example placing both backend and frontend code [to the same repository](https://github.com/mars/heroku-cra-node) ) but we will not go into those now. 
有多种方法可以实现这一点(例如将后端和前端代码[放到同一存储库中]( https://github.com/mars/heroku-cra-node )) ，但我们现在不讨论这些。

In some situations it may be sensible to deploy the frontend code as it's own application. With apps created with create-react-app it is [straightforward](https://github.com/mars/create-react-app-buildpack).
在某些情况下，将前端代码部署为它自己的应用可能是明智的。 通过创建-React-应用创建的应用是[简单的]( https://github.com/mars/create-react-app-buildpack )。

Current code of the backend can be found on [Github](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-3), in the branch <i>part3-3</i>. The changes in frontend code are in <i>part3-1</i> branch of the [frontend repository](https://github.com/fullstack-hy2020/part2-notes/tree/part3-1).
后端的当前代码可以在分支<i>/ part3-3</i> 中的[ Github ]( https://Github.com/fullstack-hy2020/part3-notes-backend/tree/part3-3)上找到。 前端代码的更改位于[前端存储库]的<i>/ part3-1</i> 分支(前端 https://github.com/fullstack-hy2020/part2-notes/tree/part3-1)。

</div>


<div class="tasks">


### Exercises 3.9.-3.11.
练习3.9-3.11。

The following exercises don't require many lines of code. They can however be challenging, because you must understand exactly what is happening and where, and the configurations must be just right. 
下面的练习不需要很多行代码。 然而，它们可能是具有挑战性的，因为您必须准确地理解正在发生什么、在哪里发生，而且配置必须恰到好处。

#### 3.9 phonebook backend step9
3.9电话簿后台，第九步

Make the backend work with the frontend from the previous part. Do not implement the functionality for making changes to the phone numbers yet, that will be implemented in exercise 3.17. 
使后端工作的前端从上一部分。 不要实现更改电话号码的功能，这将在练习3.17中实现。

You will probably have to do some small changes to the frontend, at least to the URLs for the backend. Remember to keep the developer console open in your browser. If some HTTP requests fail, you should check from the <i>Network</i>-tab what is going on. Keep an eye on the backend's console as well. If you did not do the previous exercise, it is worth it to print the request data or <i>request.body</i> to the console in the event handler responsible for POST requests. 
您可能需要对前端做一些小的更改，至少对后端的 url 做一些更改。 记住，在浏览器中保持开发者控制台的打开状态。 如果一些 HTTP 请求失败，您应该从<i>Network</i>-tab 检查发生了什么。 同时也要注意后端的控制台。 如果您没有执行前面的练习，那么将请求数据或<i>request.body</i> 打印到负责 POST 请求的事件处理程序中的控制台是值得的。

#### 3.10 phonebook backend step10
3.10电话簿后台10

Deploy the backend to the internet, for example to Heroku. 
将后端部署到互联网，例如 Heroku。

**NB** the command _heroku_ works on the department's computers and the freshman laptops. If for some reason you cannot [install](https://devcenter.heroku.com/articles/heroku-cli) Heroku to your computer, you can use the command [npx heroku-cli](https://www.npmjs.com/package/heroku-cli).
命令 heroku 在部门的电脑和新生的笔记本电脑上工作。 如果由于某种原因你不能[安装]( https://devcenter.Heroku.com/articles/Heroku-cli ) Heroku 到你的计算机，你可以使用命令[ npx Heroku-cli ]( https://www.npmjs.com/package/Heroku-cli )。

Test the deployed backend with a browser and Postman or VS Code REST client to ensure it works. 
使用浏览器和邮递员或 VS Code REST 客户端测试已部署的后端，以确保其工作正常。

**PRO TIP:** When you deploy your application to Heroku, it is worth it to at least in the beginning keep an eye on the logs of the heroku application **AT ALL TIMES** with the command <em>heroku logs -t</em>.
专业提示: 当你将应用部署到 Heroku 时，至少在开始的时候使用命令 em herlogs-t / em 关注 Heroku 应用的日志是值得的。

The following is a log about one typical problem. Heroku cannot find application dependency <i>express</i>:
下面是一个典型问题的日志。 Heroku 找不到<i>express</i> 表示的应用依赖项:

![](../../images/3/33.png)


The reason is that the option <i>--save</i> was forgotten when <i>express</i> was installed, so information about the dependency was not saved to the file <i>package.json</i>.
原因是当我表示 /<i>时，选项 i -- save</i> 被忘记了，因此关于依赖项的信息没有保存到我 package.json / i 文件中。

Another typical problem is that the application is not configured to use the port set to environment variable <em>PORT</em>: 
另一个典型的问题是，应用没有配置为使用设置为环境变量 em PORT / em 的端口:

![](../../images/3/34.png)


Create a README.md at the root of your repository, and add a link to your online application to it. 
在存储库的根部创建 README.md，并向其中添加一个指向在线应用的链接。

#### 3.11 phonebook full stack
3.11电话簿

Generate a production build of your frontend, and add it to the internet application using the method introduced in this part. 
生成前端的生产构建，并使用本部分介绍的方法将其添加到 internet 应用中。

**NB** Make sure the directory <i>build</i> is not gitignored
* * NB * * 确保我构建的 / i 目录不会显示

Also make sure that the frontend still works locally. 
还要确保前端仍然可以在本地工作。

</div>

