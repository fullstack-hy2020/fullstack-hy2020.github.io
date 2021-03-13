---
mainImage: ../../../images/part-0.svg
part: 0
letter: b
lang: zh
---

<div class="content">
<!-- Before we start programming, we will go through some principles of web development by examining an example application at <https://studies.cs.helsinki.fi/exampleapp/>. -->
<!-- A Finnish language version of the application can be found at <https://fullstack-example.now.sh>. You are free to use either one. -->

在我们正式开始编程之前，我们先简单看一个样例应用<https://studies.cs.helsinki.fi/exampleapp/>，了解一些web开发的基本原则。 
<!-- 该应用的芬兰语版本可以在 <https://fullstack-example.now.sh> 网站上找到。 你可以使用任何一种。 -->

<!-- The applications exist only to demonstrate some basic concepts of the course, and are by no means examples of <i>how</i> web applications should be made. -->
<!-- On the contrary, they demonstrate some old techniques of web development, which can even be seen as <i>bad practice</i> nowadays. -->

这些应用只是为了演示本课程需要讲到的一些基本概念，绝不是 web 应用的开发标杆。 相反，它展示了一些陈旧的 web 开发技术，而这些技术在今天甚至可以被视作糟糕的实践。

<!-- Coding in the recommended style begins in [第1章](/zh/part1). -->

我们将在[第1章](/zh/part1)正式讲推荐的编码风格。

<!-- Use the Chrome browser <i>now and for the rest of the course</i>. -->

现在以及接下来的课程都使用 Chrome 浏览器。

<!-- Open the [example application](https://studies.cs.helsinki.fi/exampleapp/) on your browser. Sometimes this takes a while. -->

在浏览器上打开这个[示例应用](https://studies.cs.helsinki.fi/exampleapp)。应用加载通常需要等一会儿。

<!-- **The 1st rule of web development**: Always keep the Developer Console open on your browser. On macOS, open the console by pressing `F12` or `option-cmd-i` simultaneously. -->
<!-- On Windows or Linux, open the console by pressing `F12` or `ctrl-shift-i` simultaneously. -->

Web 开发第一规则: 始终在浏览器上打开你的开发者控制台。 在 macOS 上，按 `F12` 或者 `option-cmd-i` 打开控制台。 
Windows 系统或Linux 系统，可以按 `F12` 或 `ctrl-shift-i`打开控制台。

<!-- Before continuing, find out how to open the Developer Console on your computer (google if necessary) and remember to <i>always</i> keep it open when developing web applications. -->

在继续课程之前，确保搞清楚如何在你的电脑上打开开发者控制台(如果必要的话请谷歌) ，并记得在开发 web 应用时始终保持它是开着的。

<!-- The console looks like this:  -->
开发者控制台长这样：

![](../../images/0/1e.png)

<!-- Make sure that the <i>Network</i> tab is open, and check the <i>Disable cache</i> option as shown. <i>Preserve log</i> can also be useful: it saves the logs printed by the application when the page is reloaded. -->

请确保打开 Network 标签页，如图所示，选中 Disable cache 选项。 保存日志（Preserve log）选项也很有用: 它能够在重新加载页面时保存应用所打出日志。

<!-- **NB:** The most important tab is the <i>Console</i>. However, in the introduction we will be using the <i>Network</i> tab quite a bit. -->

虽然在入门介绍中我们常使用网络（Network）标签，但开发而言最重要的标签是控制台（<i>Console</i>）。

### HTTP GET

<!-- The server and the web browser communicate with each other using the [HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP) protocol. The Network tab shows how the browser and the server communicate. -->

服务器和 web 浏览器使用 [HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP) 协议相互通信。 “网络（Network）”选项卡能够显示浏览器和服务器之间是如何通信的。

<!-- When you reload the page (press the F5 key or the &#8634; symbol on your browser), the console shows that two events have happened: -->

当你重新加载页面(在浏览器中按 F5 键或者 &#8634; 按钮) ，控制台会显示两个事件:
<!-- - The browser fetches the contents of the page <i>studies.cs.helsinki.fi/exampleapp/</i> from the server -->
<!-- - And downloads the image <i>kuva.png</i> -->
- 浏览器会从服务器中获取<i>studies.cs.helsinki.fi/exampleapp</i> 页面的内容
- 然后下载图像 <i>kuva.png</i>

![](../../images/0/2e.png)

<!-- On a small screen you might have to widen the console window to see these. -->

在小屏幕上，您可能需要拉大控制台窗口才能看到这些内容。

<!-- Clicking the first event reveals more information on what's happening: -->

点击第一个事件会显示更多关于本次请求的细节

![](../../images/0/3e.png)

<!-- The upper part, <i>General</i>, shows that the browser did a request to the address <i>https://studies.cs.helsinki.fi/exampleapp/</i> (though the address has changed slightly since this picture was taken) using the [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET) method, and that the request was successful, because the server response had the [Status code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) 200. -->

上半部分，General 中的内容，说明了浏览器使用 [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET) 方法向地址 https://studies.cs.helsinki.fi/exampleapp/ 发送了一个请求（虽然在截图的时候还不是这个地址），并且请求成功，因为服务器响应的状态码为 200。

<!-- The request and the server response have several [headers](https://en.wikipedia.org/wiki/List_of_HTTP_header_fields): -->

浏览器的请求（request）和服务器的响应（response）有一些[Headers头](https://en.wikipedia.org/wiki/List_of_HTTP_header_fields)信息:

![](../../images/0/4e.png)

<!-- The <i>Response headers</i> on top tell us e.g. the size of the response in bytes, and the exact time of the response. An important header [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) tells us that the response is a text file in [utf-8](https://en.wikipedia.org/wiki/UTF-8)-format, contents of which have been formatted with HTML. This way the browser knows the response to be a regular [HTML](https://en.wikipedia.org/wiki/HTML)-page, and to render it to the browser 'like a web page'. -->

上面的 <i>响应头Response headers</i>部分告诉我们一些信息，例如，响应的大小(以字节为单位)和响应的具体时间。 有个重要的 header [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) 告诉我们，响应是[utf-8](https://en.wikipedia.org/wiki/UTF-8) 格式的文本文件，其内容已用 HTML 格式化。 通过这种方式，浏览器知道响应是一个常规的 html 页面，并将它“像一个网页”一样渲染到浏览器中。

<!-- The <i>Response</i> tab shows the response data, a regular HTML-page. The <i>body</i> section determines the structure of the page rendered to the screen: -->

Response 标签页展示了响应数据，这是一个常规的 html 页面。 <i>body</i>部分决定了其渲染在屏幕上的页面结构:

![](../../images/0/5e.png)

<!-- The page contains a [div](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div) element, which in turn contains a heading, a link to the page <i>notes</i>, and an [img](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img) tag, and displays the number of notes created. -->

页面包含一个 [div](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div) 元素，该元素又包含一个标题、一个指向 notes 页面的链接，以及一个 img 标签，并显示了创建 note 的数量。

<!-- Because of the img tag, the browser does a second <i>HTTP-request</i> to fetch the image <i>kuva.png</i> from the server. The details of the request are as follows: -->

由于有一个 img 标签，浏览器会执行第二个 http 请求，从服务器获取图像 kuba.png。 请求的详情如下:

![](../../images/0/6e.png)

<!-- The request was made to the address <https://studies.cs.helsinki.fi/exampleapp/kuva.png> and its type is HTTP GET. The response headers tell us that the response size is 89350 bytes, and its [Content-type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) is <i>image/png</i>, so it is a png image. The browser uses this information to render the image correctly to the screen. -->

这个请求是给地址 https://studies.cs.helsinki.fi/exampleapp/kuva.png 发送的，它的类型是 HTTP GET。 响应头告诉我们，响应大小为 89350 字节，其[Content-type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type)为 image/png，因此它是一个 png 图像。 浏览器使用这些信息将图像正确地渲染到屏幕上。

<!-- The chain of events caused by opening the page https://studies.cs.helsinki.fi/exampleapp/ on a browser form the following [sequence diagram](https://www.geeksforgeeks.org/unified-modeling-language-uml-sequence-diagrams/): -->

在浏览器上打开页面 https://studies.cs.helsinki.fi/exampleapp/ 所产生的整个调用链条如下:

![](../../images/0/7e.png)

<!-- First, the browser does a HTTP GET request to the server to fetch the HTML code of the page. The <i>img</i> tag in the HTML prompts the browser to fetch the image <i>kuva.png</i>. The browser renders the HTML page and the image to the screen. -->

首先，浏览器向服务器发出 HTTP GET 请求，以获取页面的 HTML 代码。 Html 中的 img 标签提示浏览器还要去获取图像 kuba.png。 浏览器将 HTML 页面和图像渲染到屏幕上。

<!-- Even though it is difficult to notice, the HTML page begins to render before the image has been fetched from the server. -->

尽管很难观察到，但 HTML 页面在从服务器获取图像之前就已经开始渲染了。

### Traditional web applications
【传统的网络应用】

<!-- The homepage of the example application works like a <i>traditional web application</i>. When entering the page, the browser fetches the HTML document detailing the structure and the textual content of the page from the server. -->

示例应用的主页运作方式与传统的 web 应用类似。 当进入一个页面时，浏览器会从服务器获取 HTML 文档的详细页面结构，以及文本内容。

<!-- The server has formed this document somehow. The document can be a <i>static</i> text file saved into the server's directory. The server can also form the HTML documents <i>dynamically</i> according to the application code, using, for example, data from a database. -->

服务器以某种方式生成了这个文档。 这个文档可能是保存在服务器目录中的静态文本文件， 也可能是服务器根据应用的代码动态构建的 HTML 文档，比如，数据可能是来自数据库的。

<!-- The HTML code of the example application has been formed dynamically, because it contains information on the number of created notes. -->

示例应用的 HTML 代码是动态的，因为它包含已创建 Note 的数量信息。

<!-- The HTML code of the homepage is as follows: -->

主页的 HTML 代码如下所示:

```js
const getFrontPageHtml = noteCount => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
      </head>
      <body>
        <div class='container'>
          <h1>Full stack example app</h1>
          <p>number of notes created ${noteCount}</p>
          <a href='/notes'>notes</a>
          <img src='kuva.png' width='200' />
        </div>
      </body>
    </html>
`;
};

app.get('/', (req, res) => {
  const page = getFrontPageHtml(notes.length);
  res.send(page);
});
```

<!-- You don't have to understand the code just yet. -->

你目前还不需要去理解这些代码的细节。

<!-- The content of the HTML page has been saved as a template string, or a string which allows for evaluating, for example, variables in the midst of it. The dynamically changing part of the homepage, the number of saved notes (in the code <em>noteCount</em>), is replaced by the current number of notes (in the code <em>notes.length</em>) in the template string. -->

Html 页面的内容被保存为 template 模板字符串，或者说是一个能够运行的字符串，因为它其中包含有变量。 在模板字符串中，页面中动态更改的那部分内容——已保存 Note 的数量（即代码中的 <em>noteCount</em>），被动态地替换为了 Note 的当前数量（即代码中的 <em>notes.length</em>）

<!-- Writing HTML in the midst of the code is of course not smart, but for old-school PHP-programmers it was a normal practice. -->

在代码中间编写 HTML 当然不是明智的做法，但对于老派的 PHP 程序员来说，这是一种常规操作。

<!-- In traditional web applications the browser is "dumb". It only fetches HTML data from the server, and all application logic is on the server. A server can be created, for example, using Java Spring like on the University of Helsinki course [Web-palvelinohjelmointi](https://courses.helsinki.fi/fi/tkt21007/119558639), Python Flask (like on the course [tietokantasovellus](https://materiaalit.github.io/tsoha-18/)) or with [Ruby on Rails](http://rubyonrails.org/). -->

在传统的 web 应用中，浏览器是个“憨憨”。 它只会从服务器获取 HTML 数据，所有应用的逻辑都在服务器上处理。 服务器中的程序可以是，赫尔辛基大学 [Web-palvelinohjelmointi](https://courses.helsinki.fi/fi/tkt21007/119558639)课程中的 Java Spring、也可以是 [tietokantasovellus](https://materiaalit.github.io/tsoha-18/)课程中的 Python Flask ，又或者是 [Ruby on Rails](http://rubyonrails.org/)。

<!-- The example uses [Express](https://expressjs.com/) from Node.js. -->

这个样例使用了 Node.js 中的 [Express](https://expressjs.com/)。

<!-- This course will use Node.js and Express to create web servers. -->

本课程都将会使用 Node.js 和 Express 来创建 Web 服务器。

### Running application logic on the browser
【在浏览器上运行应用逻辑】

<!-- Keep the Developer Console open. Empty the console by clicking the &empty; symbol. -->

保持控制台打开状态。 单击 🚫按钮清空控制台。

<!-- Now when you go to the [notes](https://studies.cs.helsinki.fi/exampleapp/notes) page, the browser does 4 HTTP requests: -->

现在当你进入 [notes](https://studies.cs.helsinki.fi/exampleapp/notes)页面时，浏览器会执行 4 个 HTTP 请求:

![](../../images/0/8e.png)

<!-- All of the requests have <i>different</i> types. The first request's type is <i>document</i>. It is the HTML code of the page, and it looks as follows: -->

所有的请求都请求了不同的类型。 第一个请求的类型是 document。 也就是页面的 HTML 代码，看起来如下:

![](../../images/0/9e.png)

<!-- When we compare the page shown on the browser and the HTML code returned by the server, we notice that the code does not contain the list of notes. -->
<!-- The [head](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head)-section of the HTML contains a [script](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)-tag, which causes the browser to fetch a JavaScript file called <i>main.js</i>. -->

当我们比较浏览器上显示的页面和服务器返回的 HTML 代码时，我们注意到这些代码并不包含 Note 列表的数据。 Html 的 [head](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head)部分 包含一个 [script](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script) 标签，它会让浏览器去 获取一个名为 main.js 的 JavaScript 文件。

<!-- The JavaScript code looks as follows: -->

JavaScript 代码看起来像这样:

```js
var xhttp = new XMLHttpRequest();

xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    const data = JSON.parse(this.responseText);
    console.log(data);

    var ul = document.createElement('ul');
    ul.setAttribute('class', 'notes');

    data.forEach(function(note) {
      var li = document.createElement('li');

      ul.appendChild(li);
      li.appendChild(document.createTextNode(note.content));
    });

    document.getElementById('notes').appendChild(ul);
  }
};

xhttp.open('GET', '/data.json', true);
xhttp.send();
```

<!-- The details of the code are not important right now, but some code has been included to spice up the images and the text. We will properly start coding in [第1章](/zh/part1). The sample code in this part is actually not relevant at all to the coding techniques of this course. -->

代码的细节现在并不重要，穿插一些代码，是为了增加图像与文本的趣味性。我们将在[第1章](/zh/part1)正式地开始编码。 本章节的示例代码实际上与本课程所要讲的编码技术毫无关系。

<!-- > Some might wonder why xhttp-object is used instead of the modern fetch. This is due to not wanting to go into promises at all yet, and the code having a secondary role in this part. We will return to modern ways to make requests to the server in part 2. -->
> 有些人可能想问为什么要使用 xhttp 对象而不是使用现代的获取方法。 这是因为我们不想引入 promise 的概念，而且代码在这一章节只是二等公民。 在第 2 章节中，我们将回过头来用更加现代的方式来向服务器发送请求。

<!-- Immediately after fetching the <i>script</i> tag, the browser begins to execute the code. -->

在获取到 script 标签后，浏览器便立即开始执行 script 的代码。

<!-- The last two lines define that the browser does a HTTP GET request to the server's address <i>/data.json</i>: -->

最后两行定义了让浏览器对服务器地址 /data.json 执行一个 HTTP GET 请求:

```js
xhttp.open('GET', '/data.json', true);
xhttp.send();
```

<!-- This is the down-most request shown on the Network tab. -->

这是“Network”选项卡上显示 request 信息的最低要求。

<!-- We can try going to the address <https://studies.cs.helsinki.fi/exampleapp/data.json> straight from the browser: -->

我们可以试着直接通过浏览器访问 https://studies.cs.helsinki.fi/exampleapp/data.json 地址:

![](../../images/0/10e.png)

<!-- There we find the notes in [JSON](https://en.wikipedia.org/wiki/JSON) "raw data". -->
<!-- By default, the browser is not too good at displaying JSON-data. Plugins can be used to handle the formatting. Install, for example, [JSONView](https://chrome.google.com/webstore/detail/jsonview/chklaanhfefbnpoihckbnefhakgolnmc) to Chrome, and reload the page. The data is now much more nicely formatted: -->

在这里我们找到了以 JSON 格式展示的 Note ，这就是Note的 “原始数据”。 默认配置下，浏览器不太擅长显示 json 格式的数据。 可以使用插件来处理 Json 格式。 例如，将 [JSONView](https://chrome.google.com/webstore/detail/jsonview/chklaanhfefbnpoihckbnefhakgolnmc) 安装到 Chrome，然后重新加载页面。 数据现在可以被更好地格式化展示出来了:

![](../../images/0/11e.png)

<!-- So, the JavaScript code of the notes page above downloads the JSON-data containing the notes, and forms a bullet-point list from the note contents: -->

因此，上面 notes 页面的 JavaScript 代码会下载包含 Note 列表的的 JSON 数据，并利用 Note 的内容构建出一个符号列表:

<!-- This is done by the following code: -->

构建是通过如下代码实现的:

```js
const data = JSON.parse(this.responseText);
console.log(data);

var ul = document.createElement('ul');
ul.setAttribute('class', 'notes');

data.forEach(function(note) {
  var li = document.createElement('li');

  ul.appendChild(li);
  li.appendChild(document.createTextNode(note.content));
});

document.getElementById('notes').appendChild(ul);
```

<!-- The code first creates an unordered list with an [ul](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul)-tag... -->

代码首先创建了一个带有 ul-标签 的无序列表...

```js
var ul = document.createElement('ul');
ul.setAttribute('class', 'notes');
```

<!-- ...and then adds one [li](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li)-tag for each note. Only the <i>content</i> field of each note becomes the contents of the li-tag. The timestamps found in the raw data are not used for anything here. -->

然后再为每个 Note 加上一个 li-标签。仅将每个 Note 的 content 字段变成了 li-标签 的内容，而原始数据的 timestamps 时间戳在这里并没派上用场。

```js
data.forEach(function(note) {
  var li = document.createElement('li');

  ul.appendChild(li);
  li.appendChild(document.createTextNode(note.content));
});
```

<!-- Now open the <i>Console</i>-tab on your Developer Console: -->

现在打开控制台上的 Console 标签:

![](../../images/0/12e.png)

<!-- By clicking the little triangle at the beginning of the line, you can expand the text on the console. -->

通过单击行首的小三角形，可以展开控制台上的文本。

![](../../images/0/13e.png)

<!-- This output on the console is caused by <em>console.log</em> command in the code: -->

控制台上能输出内容是因为代码中的 console.log 命令:

```js
const data = JSON.parse(this.responseText);
console.log(data);
```

<!-- So, after receiving data from the server, the code prints it to the console. -->

因此，在从服务器接收到数据之后，代码将其打印到了控制台。

<!-- The <i>Console</i> tab and the <em>console.log</em> command will become very familiar to you during the course. -->

在整个课程中，你会经常用到 Console 选项卡和 Console.log 命令。

### Event handlers and Callback functions
【事件处理和回调函数】

<!-- The structure of this code is a bit odd: -->

这段代码的结构有点奇怪:

```js
var xhttp = new XMLHttpRequest();

xhttp.onreadystatechange = function() {
  // code that takes care of the server response
};

xhttp.open('GET', '/data.json', true);
xhttp.send();
```

<!-- The request to the server is sent on the last line, but the code to handle the response can be found further up. What's going on? -->

发送到服务器的请求放在了最后一行，但是处理响应的代码却在上面定义了。这是怎么回事？

<!-- On this line, -->

这一行中，

```js
xhttp.onreadystatechange = function () {
```

<!-- an <i>event handler</i> for event <i>onreadystatechange</i> is defined for the <em>xhttp</em> object doing the request. When the state of the object changes, the browser calls the event handler function. The function code checks that the [readyState](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState) equals 4 (which depicts the situation <i>The operation is complete</i>) and that the HTTP status code of the response is 200. -->

onreadystatechange 这个事件处理程序是定义在 xhttp 对象上的，xhttp对象是用于执行请求的。当这个对象的状态发生改变时，浏览器调用了这个事件处理函数。 这个函数代码检查了 [readyState](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState) 是否等于 4(它描述了操作已完成的状态) ，以及响应的 HTTP 状态码是否为 200。

```js
xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    // code that takes care of the server response
  }
};
```

<!-- The mechanism of invoking event handlers is very common in JavaScript. Event handler functions are called [callback](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function) functions. The application code does not invoke the functions itself, but the runtime environment - the browser, invokes the function at an appropriate time, when the <i>event</i> has occurred. -->

这种调用事件处理程序的机制在 JavaScript 中非常常见。 事件处理函数被称为回调函数（[callback](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function) functions）。 应用代码并不直接调用函数本身，而是运行时环境（浏览器）会在事件发生时的适当时间调用函数。

### Document Object Model or DOM 

<!-- We can think of HTML-pages as implicit tree structures. -->

我们可以将 html 页面看作隐式树结构。

<pre>
html
  head
    link
    script
  body
    div
      h1
      div
        ul
          li
          li
          li
      form
        input
        input
</pre>

<!-- The same treelike structure can be seen on the console tab <i>Elements</i>. -->

在控制台Elements选项卡中可以看到相同的树状结构。

![](../../images/0/14e.png)

<!-- The functioning of the browser is based on the idea of depicting HTML elements as a tree. -->

浏览器的功能就是基于这种，把 HTML元素描述成一棵树的想法。

<!-- Document Object Model, or [DOM](https://en.wikipedia.org/wiki/Document_Object_Model) is an Application Programming Interface, (an <i>API</i>), which enables programmatic modification of the <i>element trees</i> corresponding to web-pages. -->

文档对象模型(Document Object Model，[DOM](https://en.wikipedia.org/wiki/Document_Object_Model))是一个应用编程接口(Application Programming Interface，API) ，它支持对 web 页面对应的元素树进行编程修改。

<!-- The JavaScript code introduced in the previous chapter used the DOM-API to add a list of notes to the page. -->

上一部分中介绍的 JavaScript 代码就是使用 DOM-API 向页面添加 Note 列表。

<!-- The following code creates a new node to the variable <em>ul</em>, and adds some child nodes to it: -->

下面的代码为变量 ul 创建了一个新节点，并向其添加一些子节点:

```js
var ul = document.createElement('ul');

data.forEach(function(note) {
  var li = document.createElement('li');

  ul.appendChild(li);
  li.appendChild(document.createTextNode(note.content));
});
```

<!-- Finally, the tree branch of the <em>ul</em> variable is connected to its proper place in the HTML tree of the whole page: -->

最后，ul 变量的树分支被接到了整个页面的 HTML 树中的适当位置:

```js
document.getElementById('notes').appendChild(ul);
```

### Manipulating the document-object from console
【从控制台中操作文档对象】

<!-- The topmost node of the DOM tree of a HTML document is called the <em>document</em> object. We can perform various operations on a web-page using the DOM-API. You can access the <em>document</em> object by typing <em>document</em> into the Console-tab: -->

Html 文档 DOM 树的最顶层节点称为文档<em>document</em>对象。 我们可以使用 DOM-API 在网页上执行各种操作。 您可以通过在控制台中键入 document 来访问文档对象:

![](../../images/0/15e.png)

<!-- Let's add a new note to the page from the console. -->

让我们从控制台向页面添加一个新的 Note。

<!-- First, we'll get the list of notes from the page. The list is in the first ul-element of the page: -->

首先，我们从页面中获得 Note 列表，该列表位于页面的第一个 ul 元素中:

```js
list = document.getElementsByTagName('ul')[0];
```

<!-- Then create a new li-element and add some text content to it: -->

然后创建一个新的 li 元素并添加一些文本内容:

```js
newElement = document.createElement('li');
newElement.textContent = 'Page manipulation from console is easy';
```

<!-- And add the new li-element to the list: -->

并将新的 li 元素添加到列表中:

```js
list.appendChild(newElement);
```

![](../../images/0/16e.png)

<!-- Even though the page updates on your browser, the changes are not permanent. If the page is reloaded, the new note will disappear, because the changes were not pushed to the server. The JavaScript code the browser fetches will always create the list of notes based on JSON-data from address <https://studies.cs.helsinki.fi/exampleapp/data.json>. -->

虽然页面在浏览器上被更新了，这些更改不是永久性的。 如果页面重新加载，新的 Note 就消失了，因为更改并没有推送到服务器。 浏览器获取的 JavaScript 代码会总是基于 https://studies.cs.helsinki.fi/exampleapp/data.json 的 JSON 数据来创建 Note 列表。

### CSS

<!-- The <i>head</i> element of the HTML code of the Notes page contains a [link](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) tag, which determines that the browser must fetch a [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) style sheet from the address [main.css](https://studies.cs.helsinki.fi/exampleapp/main.css). -->

Notes 页面的 HTML 代码中 head 元素包含了一个 [link](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) 标签，该标签确定浏览器必须从地址 [main.css](https://studies.cs.helsinki.fi/exampleapp/main.css)中获取 [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) 样式表。

<!-- Cascading Style Sheets, or CSS, is a markup language used to determine the appearance of web applications. -->

层叠样式表(Cascading Style Sheets, CSS)，是一种用来确定 web 应用外观的标记语言。

<!-- The fetched CSS-file looks as follows: -->

获取的 css 文件如下所示:

```css
.container {
  padding: 10px;
  border: 1px solid;
}

.notes {
  color: blue;
}
```

<!-- The file defines two [class selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors). These are used to select certain parts of the page and to define styling rules to style them. -->

该文件定义了两个类选择器 [class selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors)。 它们用于选择页面的某些部分，并对它们定义样式规则来装饰它们。

<!-- A class selector definition always starts with a period, and contains the name of the class. -->

类选择器的定义始终以句点开头，并包含类的名称。

<!-- The classes are [attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/class), which can be added to HTML elements. -->

这些类是属性[attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/class)，可以添加到 HTML 元素中。

<!-- CSS attributes can be examined on the <i>elements</i> tab on the console: -->

CSS 属性可以在控制台的 element 标签上查看:

![](../../images/0/17e.png)

<!-- The outermost <i>div</i> element has the class <i>container</i>. The <i>ul</i> element containing the list of notes has the class <i>notes</i>. -->

最外面的 div 元素有 class 属性 ，值为 container ，包含 notes 列表的 ul 元素也有 class 属性 ，名为 notes。

<!-- The CSS rule defines that elements with the <i>container</i> class will be outlined with a one pixel wide [border](https://developer.mozilla.org/en-US/docs/Web/CSS/border). It also sets 10 pixel [padding](https://developer.mozilla.org/en-US/docs/Web/CSS/padding) to the element. This sets some empty space between the element content and the border. -->

CSS 规则定义了 container 类的元素，将用一个像素宽的边框 [border](https://developer.mozilla.org/en-US/docs/Web/CSS/border)勾勒出来。 它还为该元素设置了 10 个像素的填充 [padding](https://developer.mozilla.org/en-US/docs/Web/CSS/padding)。 这会在元素内容和边框之间增加一些空白。

<!-- The second CSS rule sets the text color of the notes blue. -->

第二个 CSS 规则将文本颜色设置为蓝色。

<!-- HTML elements can also have other attributes than classes. The <i>div</i> element containing the notes has an [id](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id) attribute. JavaScript code uses the id to find the element. -->

Html 元素也可以有 class 以外的其他属性。 包含 Note 的 div 元素有一个 id 属性。 JavaScript 代码使用 id 来查找元素。

<!-- The <i>Elements</i> tab of the console can be used to change the styles of the elements. -->

控制台的<i>Elements</i>选项卡可用于更改元素的样式。

![](../../images/0/18e.png)

<!-- Changes made on the console will not be permanent. If you want to make lasting changes, they must be saved to the CSS style sheet on the server. -->

在控制台上所做的更改也不是永久性的。 如果要进行持久的更改，必须将更改保存到服务器上的 CSS 样式表中。

### Loading a page containing JavaScript - revised 

【加载一个包含 JavaScript 的页面-复习】

<!-- Let's revise what happens when the page https://studies.cs.helsinki.fi/exampleapp/notes is opened on the browser. -->

让我们复习一下在浏览器上打开页面 https://studies.cs.helsinki.fi/exampleapp/notes 时会发生什么。

![](../../images/0/19e.png)

<!-- - The browser fetches the HTML code defining the content and the structure of the page from the server using an HTTP GET request. -->
- 浏览器使用 HTTP GET 请求从服务器获取定义内容和页面结构的 HTML 代码
<!-- - Links in the HTML code cause the browser to also fetch the CSS style sheet <i>main.css</i>... -->
- Html 代码中的 Links 标签会让浏览器获取 CSS 样式表 main.css
<!-- - ...and a JavaScript code file <i>main.js</i> -->
- 以及 JavaScript 代码文件 main.js
<!-- - The browser executes the JavaScript code. The code makes an HTTP GET request to the address https://studies.cs.helsinki.fi/exampleapp/data.json, which returns the notes as JSON data. -->
- 浏览器执行 JavaScript 代码，代码向地址https://studies.cs.helsinki.fi/exampleapp/data.json 发出 HTTP GET 请求，请求返回了包含 note 的 JSON 数据。
<!-- - When the data has been fetched, the browser executes an <i>event handler</i>, which renders the notes to the page using the DOM-API. -->
- 获取数据后，浏览器执行一个*event handler 事件处理程序*, 使用 DOM-API 将 Note 渲染到页面

### Forms and HTTP POST
【表单与 HTTP POST】

<!-- Next let's examine how adding a new note is done. -->

接下来让我们看看添加 Note 是如何完成的。

<!-- The Notes page contains a [form-element](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Your_first_HTML_form) -->

Notes 页面包含一个 [form 元素](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Your_first_HTML_form)。

![](../../images/0/20e.png)

<!-- When the button on the form is clicked, the browser will send the user input to the server. Let's open the <i>Network</i> tab and see what submitting the form looks like: -->

当单击表单上的按钮时，浏览器将向服务器发送用户的输入。 让我们打开 Network 标签页，看看提交表单时发生了什么:

![](../../images/0/21e.png)

<!-- Surprisingly, submitting the form causes altogether <i>five</i> HTTP requests. -->

很惊奇吧，提交表单总共会导致 5 个 HTTP 请求。

<!-- The first one is the form submit event. Let's zoom into it: -->

第一个是表单提交事件。 让我们放大一下:

![](../../images/0/22e.png)

<!-- It is an [HTTP POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST) request to the server address <i>new_note</i>. The server responds with HTTP status code 302. This is a [URL redirect](https://en.wikipedia.org/wiki/URL_redirection), with which the server asks the browser to do a new HTTP GET request to the address defined in the header's <i>Location</i> - the address <i>notes</i>. -->

它是对服务器 <i>/new\_note</i>地址发送的 [HTTP POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST)请求。 服务器用 HTTP 状态码 302 进行响应。 这是一个[URL 重定向](https://en.wikipedia.org/wiki/URL_redirection)，服务器通过这个 URL 重定向，请求浏览器执行一个新的 HTTP GET 请求，该请求定义在 Header 的 Location (即 /notes 地址)中。

<!-- So, the browser reloads the Notes page. The reload causes three more HTTP requests: fetching the style sheet (main.css), the JavaScript code (main.js), and the raw data of the notes (data.json). -->

因此，浏览器重新加载 Notes 页面。 重新加载会导致另外三个 HTTP 请求: 获取样式表(main.css)、 JavaScript 代码(main.js)和 notes 的原始数据(data.json)。

<!-- The network tab also shows the data submitted with the form: -->

Network选项卡还显示了与表单一起提交的表单数据:

![](../../images/0/23e.png)

<!-- The Form tag has attributes <i>action</i> and <i>method</i>, which define that submitting the form is done as an HTTP POST request to the address <i>new_note</i>. -->

Form 标签具有属性 action 和 method，它们定义了将表单作为一个 HTTP POST 请求提交到地址 <i>/new_note</i>。

![](../../images/0/24e.png)

<!-- The code on the server responsible for the POST request is simple (NB: this code is on the server, and not on the JavaScript code fetched by the browser): -->

服务器上负责 POST 请求的代码很简单(注意: 此代码在服务器上，而不是在浏览器获取的 JavaScript 代码上) :

```js
app.post('/new_note', (req, res) => {
  notes.push({
    content: req.body.note,
    date: new Date(),
  });

  return res.redirect('/notes');
});
```

<!-- Data is sent as the [body](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST) of the POST-request. -->

数据作为 POST-请求的[body](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST)发送到服务器。

<!-- The server can access the data by accessing the <em>req.body</em> field of the request object <em>req</em>. -->

服务器可以通过访问请求对象 req 的 req.body 字段来访问发送来的数据。

<!-- The Server creates a new note object, and adds it to an array called <em>notes</em>. -->

Server 创建一个新的 note 对象，并将其添加到一个名为 notes 的数组中。

```js
notes.push({
  content: req.body.note,
  date: new Date(),
});
```

<!-- The Note objects have two fields: <i>content</i> containing the actual content of the note, and <i>date</i> containing the date and time the note was created. -->
<!-- The server does not save new notes to a database, so new notes disappear when Heroku restarts the service. -->

Note 对象包含两个字段: 包含 Note 实际内容的 content，以及包含创建 Note 的日期和时间的 date。 
服务器不会将新 Note 保存到数据库中，因此当服务器重新启动服务时，新的 Note 就会消失。
<!-- 服务器不会将新 Note 保存到数据库中，因此当 Heroku （Heroku是一个服务器，可以看做Tomcat，译者注）重新启动服务时，新的 Note 就会消失。 -->

### AJAX

<!-- The Notes page of the application follows an early-noughties style of web development and "uses Ajax". As such, it's on the crest of the wave of early 2000's web technology. -->

应用的 Notes 页面遵循本世纪初的 web 开发风格，并且“使用了 Ajax”。 这种技术在当时，2000 年初正处于 web 技术浪潮的顶峰。

<!-- [AJAX](<https://en.wikipedia.org/wiki/Ajax_(programming)>) (Asynchronous JavaScript and XML) is a term introduced in February 2005 on the back of advancements in browser technology to describe a new revolutionary approach that enabled the fetching of content to webpages using JavaScript included within the HTML, without the need to rerender the page. -->

[AJAX](<https://en.wikipedia.org/wiki/Ajax_(programming)>) (Asynchronous JavaScript and XML) 是在浏览器技术进步的基础上于 2005 年 2 月引入的一个术语，它描述了一种新的革命性的方法，这种方法使用包含在 HTML 中的 JavaScript 来获取网页内容，而且不需要重新渲染页面。

<!-- Prior to the AJAX era, all web pages worked like the [traditional web application](/zh/part0/web_应用的基础设施#traditional-web-applications) we saw earlier in this chapter. -->
<!-- All of the data shown on the page was fetched with the HTML-code generated by the server. -->

在 AJAX 之前的年代，所有的 web 页面都像我们在本章前面看到的传统 web 应用一样工作。 页面上显示的所有数据都是从服务器生成的 html 代码获取的。

<!-- The Notes page uses AJAX to fetch the notes data. Submitting the form still uses the traditional mechanism of submitting web-forms. -->

Notes 页面使用了 AJAX 获取 Notes 数据。 提交表单仍然使用传统的 web 表单提交机制。

<!-- The application URLs reflect the old, carefree times. JSON data is fetched from the url <https://studies.cs.helsinki.fi/exampleapp/data.json> and new notes are sent to the url <https://studies.cs.helsinki.fi/exampleapp/new_note>.   -->
<!-- Nowadays urls like these would not be considered acceptable, as they don't follow the generally acknowledged conventions of [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer#Applied_to_Web_services) APIs, which we'll look into more in [第3章](/zh/part3) -->

应用的 url 反映了过去无忧无虑的时光。 数据从 url https://studies.cs.helsinki.fi/exampleapp/data.JSON 中获取，新的 Note 被发送到 url https://studies.cs.helsinki.fi/exampleapp/new_note 。 如今，这样的 url 被认为是不可接受的，因为它们没有遵循公认的 RESTful api 约定，我们将在第三章中进一步研究。

<!-- The thing termed AJAX is now so commonplace that it's taken for granted. The term has faded into oblivion, and the new generation has not even heard of it. -->

现在 AJAX 的存在是如此普遍，以至于人们认为它是理所当然的。 AJAX 这个术语已经逐渐被遗忘，“新时代的我们”甚至没有听说过它。

### Single page app
【单页面应用】

<!-- In our example app, the home page works like a traditional web-page: All of the logic is on the server, and the browser only renders the HTML as instructed. -->

在我们的示例应用中，主页的工作方式类似于传统的网页: 所有的逻辑都在服务器上，浏览器只按照指示渲染 HTML。

<!-- The Notes page gives some of the responsibility, generating the HTML code for existing notes, to the browser. The browser tackles this task by executing the JavaScript code it fetched from the server. The code fetches the notes from the server as JSON-data and adds HTML elements for displaying the notes to the page using the [DOM-API](/zh/part0/web_应用的基础设施#document-object-model-or-dom). -->

Notes 页面为浏览器提供了一些职责，为现有的 Note 生成 HTML 代码。 浏览器通过执行从服务器获取的 JavaScript 代码来处理这个任务。 代码从服务器以Json格式获取 Note，并对其添加 HTML 元素，并利用 DOM-API 将 Note 显示到页面中。

<!-- In recent years, the [Single-page application](https://en.wikipedia.org/wiki/Single-page_application) (SPA) style of creating web-applications has emerged. SPA style websites don't fetch all of their pages separately from the server like our sample application does, but instead comprises of only one HTML page fetched from the server, the contents of which are manipulated with JavaScript that executes in the browser. -->

近年来，创建网络应用的单页应用 [Single-page application](https://en.wikipedia.org/wiki/Single-page_application) (SPA) 风格出现了。SPA 类型的网站不会像我们的示例应用那样从服务器上单独获取所有页面，而是只从服务器获取一个 HTML 页面，其内容由 JavaScript 在浏览器中执行操作。

<!-- The Notes page of our application bears some resemblance to SPA-style apps, but it's not quite there yet. Even though the logic for rendering the notes is run on the browser, the page still uses the traditional way of adding new notes. The data is sent to the server with form submit, and the server instructs the browser to reload the Notes page with a <i>redirect</i>. -->

我们的应用的 Notes 页面与 SPA 风格的应用有一些相似之处，但它还没有完全到位。 尽管显示Note 的逻辑是在浏览器上运行的，但页面仍然使用传统的方式添加新Note 。 数据通过表单提交发送到服务器，服务器指示浏览器重新加载带有重定向的 Notes 页面。

<!-- A single page app version of our example application can be found from <https://studies.cs.helsinki.fi/exampleapp/spa>. -->
<!-- At first glance, the application looks exactly the same as the previous one. -->
<!-- The HTML code is almost identical, but the JavaScript file is different (<i>spa.js</i>) and there is a small change in how the form-tag is defined: -->

我们示例应用的单页应用版本可以在 https://studies.cs.helsinki.fi/exampleapp/spa 中找到。 乍一看，这个应用看起来与前一个应用完全相同。 Html 代码几乎完全相同，但 JavaScript 文件不同(spa.js) ，form 标签的定义方式有一个小小的变化:

![](../../images/0/25e.png)

<!-- The form has no <i>action</i> or <i>method</i> attributes to define how and where to send the input data. -->

表单没有<i>action</i>属性或<i>method</i>属性来定义如何以及往哪里发送输入数据。

<!-- Open the <i>Network</i>-tab and empty it by clicking the &empty; symbol. When you now create a new note, you'll notice that the browser sends only one request to the server. -->

打开 Network-选项卡并通过单击 🚫 按钮清空它。 当您现在创建一个新的便笺时，您会注意到浏览器只向服务器发送了一个请求。

![](../../images/0/26e.png)

<!-- The POST request to the address <i>new_note_spa</i> contains the new note as JSON-data containing both the content of the note (<i>content</i>) and the timestamp (<i>date</i>): -->

Post 请求到地址<i>new\_note\_spa</i>，包含新 Note 的 JSON 数据，其中既包含 Note 的内容(content) ，也包含时间戳(date) :

```js
{
  content: "single page app does not reload the whole page",
  date: "2019-05-25T15:15:59.905Z"
}
```

<!-- The <i>Content-Type</i> header of the request tells the server, that the included data is represented in the JSON format. -->

请求的 Content-Type 头信息告诉服务器，所包含的数据是以 JSON 格式表示的。

![](../../images/0/27e.png)

<!-- Without this header, the server would not know how to correctly parse the data. -->

如果没有这个头，服务器将不知道如何正确地解析数据。

<!-- The server responds with statuscode [201 created](https://httpstatuses.com/201). This time the server does not ask for a redirect, the browser stays on the same page, and it sends no further HTTP-requests. -->

服务器用创建的状态码[201](https://httpstatuses.com/201)进行响应。 这次服务器没有请求重定向，浏览器会保持在同一页面上，并且不再发送 http 请求。

<!-- The SPA version of the app does not send the form data the traditional way, but instead uses the JavaScript code it fetched from the server. -->

<!-- We'll look into this code a bit, even though understanding all the details of it is not important just yet. -->

这个应用的 SPA 版本并不以传统的方式发送表单数据，而是使用从服务器获取的 JavaScript 代码。 我们将稍微研究一下这段代码，虽然还没有必要理解它的所有细节。

```js
var form = document.getElementById('notes_form');
form.onsubmit = function(e) {
  e.preventDefault();

  var note = {
    content: e.target.elements[0].value,
    date: new Date(),
  };

  notes.push(note);
  e.target.elements[0].value = '';
  redrawNotes();
  sendToServer(note);
};
```

<!-- The command <em>document.getElementById('notes_form')</em> instructs the code to fetch the form-element from the page, and to register an <i>event handler</i> to handle the form submit event. The event handler immediately calls the method <em>e.preventDefault()</em> to prevent the default handling of form submit. The default method would send the data to server and cause a redirect, which we don't want to happen. -->

命令  <em>document.getElementById('notes_form')</em> 指示代码从页面中提取 form 元素，并注册一个事件处理函数来处理表单提交事件。 事件处理函数将立即调用方法 e.preventDefault () ，以防止对表单 submit 的默认处理。 默认处理会将数据发送到服务器并导致重定向（一次新的Get请求），这不是我们的初衷。

<!-- Then the event handler creates a new note, adds it to the notes list with the command <em>notes.push(note)</em>, rerenders the note list on the page and sends the new note to the server. -->

然后，事件处理程序创建一个新的 Note，使用命令<em>notes.push(note)</em>将其添加到 Note 列表中，并在页面上重新渲染了 Note 列表，最终向服务器发送了新建 Note 的请求。

<!-- The code for sending the note to the server is as follows: -->

向服务器发送 Note 的代码如下:

```js
var sendToServer = function(note) {
  var xhttpForPost = new XMLHttpRequest();
  // ...

  xhttpForPost.open('POST', '/new_note_spa', true);
  xhttpForPost.setRequestHeader('Content-type', 'application/json');
  xhttpForPost.send(JSON.stringify(note));
};
```

<!-- The code determines that the data is to be sent with an HTTP POST request and the data type is to be JSON. The data type is determined with a <i>Content-type</i> header. Then the data is sent as JSON-string. -->

代码确定数据是通过 HTTP POST 请求发送的，数据类型是 JSON。 数据类型由 Content-type Header 确定。 然后，数据以 json 字符串的形式发送。

<!-- The application code is available at <https://github.com/mluukkai/example_app>. -->
<!-- It's worth remembering that the application is only meant to demonstrate the concepts of the course. The code follows a poor style of development in some measure, and should not be used as an example when creating your own applications. The same is true for the URLs used. The URL <i>new_note_spa</i>, which new notes are sent to, does not adhere to current best practices. -->

应用代码可以在 https://github.com/mluukkai/example_app 上找到。 值得注意的是，这个应用只是用来演示课程的概念。 该代码在某种程度上遵循了糟糕的开发风格，不应该在创建自己的应用时作为示例使用。 使用的 url 也是如此。 发送新Note 的 URL，即新建Note 的<i>new\_note\_spa</i>并不遵循当前的最佳实践。

### JavaScript-libraries
【JavaScript 库】

<!-- The sample app is done with so called [vanilla JavaScript](https://medium.freecodecamp.org/is-vanilla-javascript-worth-learning-absolutely-c2c67140ac34) using only the DOM-API and JavaScript to manipulate the structure of the pages. -->

这个示例应用是通过所谓的[vanilla JavaScript](https://medium.freecodecamp.org/is-vanilla-javascript-worth-learning-absolutely-c2c67140ac34) 来完成的，只使用了 DOM-API 和 JavaScript 来操作页面的结构。

<!-- Instead of using JavaScript and the DOM-API only, different libraries containing tools that are easier to work with compared to the DOM-API are often used to manipulate pages. One of these libraries is the ever-so-popular [jQuery](https://jquery.com/). -->

与仅使用 JavaScript 和 DOM-API 不同，通常会使用比直接操作 DOM-API 更容易的工具库来操作页面。 其中一个非常流行的库就是 [jQuery](https://jquery.com/) 。

<!-- jQuery was developed back when web-pages mainly followed the traditional style of the server generating HTML pages, the functionality of which was enhanced on the browser side using JavaScript written with jQuery. One of the reasons for the success of jQuery was its so-called cross-browser compatibility. The library worked regardless of the browser or the company that made it, so there was no need for browser-specific solutions. Nowadays using jQuery is not as justified given the advancement of VanillaJS, and the most popular browsers generally support basic functionalities well. -->

当时，在 web 应用主要遵循服务器生成 HTML 页面的传统风格，jQuery 当时是在这种情况下发展起来的。这种风格的功能通过在浏览器端使用 JavaScript 搭配使用 jQuery 来增强。 jQuery 成功的原因之一是它所谓的跨浏览器兼容性。 不管是哪家公司的哪个浏览器，这个库都能正常工作，所以不需要特定于浏览器的解决方案。 如今，由于 VanillaJS 的进步，使用 jQuery 已经不那么合理了，而且最流行的浏览器通常都能很好地支持基本功能。

<!-- The rise of the single page app brought several more "modern" ways of web development than jQuery. The favorite of the first wave of developers was [BackboneJS](http://backbonejs.org/). After its [launch](https://github.com/angular/angular.js/blob/master/CHANGELOG.md#100-temporal-domination-2012-06-13) in 2012, Google's [AngularJS](https://angularjs.org/) quickly became almost the de facto standard of modern web development. -->

单页应用的兴起带来了几种比 jQuery 更“现代”的网页开发方式。 第一波开发者的最爱是 [BackboneJS](http://backbonejs.org/).。 自 2012 年 [launch](https://github.com/angular/angular.js/blob/master/CHANGELOG.md#100-temporal-domination-2012-06-13) 以来，谷歌的 [AngularJS](https://angularjs.org/) 几乎快速成为现代网络开发的行业标准。

<!-- However, the popularity of Angular plummeted after the Angular team [announced](https://jaxenter.com/angular-2-0-announcement-backfires-112127.html) in October 2014 that support for version 1 will end, and Angular 2 will not be backwards compatible with the first version. Angular 2 and the newer versions have not gotten too warm of a welcome. -->

然而，自从 Angular 团队在 2014 年 10 月宣布对第 1 版的支持将结束，Angular 2 将不再向后兼容第一版后，Angular 的受欢迎程度直线下降。 Angular 2 和更新的版本没有得到太热烈的欢迎。

<!-- Currently the most popular tool for implementing the browser-side logic of web-applications is Facebook's [React](https://reactjs.org/)-library. -->

<!-- During this course, we will get familiar with React and the [Redux](https://github.com/reactjs/redux)-library, which are frequently used together. -->

目前，实现 web 应用浏览器端逻辑的最流行的工具是 Facebook 的 [React](https://reactjs.org/) 库。 在本课程中，我们将熟悉 React 和 [Redux](https://github.com/reactjs/redux) 库，它们经常一起使用。

<!-- The status of React seems strong, but the world of JavaScript is ever changing. For example, recently a newcomer [VueJS](https://vuejs.org/) has been capturing some interest. -->

React 的势头看起来很猛，但是 JavaScript 的世界是不断变化的。 例如，最近的一个新秀 [VueJS](https://vuejs.org/) 已经引起了一些兴趣。

### Full stack web development
【全栈-web 开发】

<!-- What does the name of the course, <i>Full stack web development</i>, mean? Full stack is a buzzword that everyone talks about, while no one really knows what it means. Or at least, there is no agreed-upon definition for the term. -->

这个课程的名字是什么意思？全栈是一个流行词，每个人都在谈论它，但没有人真正知道它的意思。 或者至少，对于这个术语没有一致的定义。

<!-- Practically all web applications have (at least) two "layers": the browser, being closer to the end user, is the top layer, and the server the bottom one. There is often also a database layer below the server. We can therefore think of the <i>architecture</i> of a web application as a kind of a <i>stack</i> of layers. -->

几乎所有的 web 应用都有(至少)两个“层” : 最接近最终用户的浏览器是最顶层，而服务器是最底层。 在服务器下面通常还有一个数据库层。 因此，我们可以将 web 应用的体系结构看作是一层层的堆栈。

<!-- Often, we also talk about the [frontend](https://en.wikipedia.org/wiki/Front_and_back_ends) and the [backend](https://en.wikipedia.org/wiki/Front_and_back_ends). The browser is the frontend, and JavaScript run on the browser is frontend code. The server on the other hand is the backend. -->

通常，我们也会讨论[前端frontend](https://en.wikipedia.org/wiki/Front_and_back_ends) 和 [后端backend](https://en.wikipedia.org/wiki/Front_and_back_ends)。 浏览器是前端，运行在浏览器上的 JavaScript 是前端代码。 另一方面，服务器是后端。

<!-- In the context of this course, full stack web development means that we focus on all parts of the application: the frontend, the backend, and the database. Sometimes the software on the server and its operating system are seen as parts of the stack, but we won't go into those. -->

在本课程的上下文中，全栈 web 开发意味着我们关注应用的所有部分: 从前端、后端到数据库。 有时候，服务器上的软件及其操作系统会被看作是全栈的一部分，但我们不会深入讨论这部分内容。

<!-- We will code the backend with JavaScript, using [Node.js](https://nodejs.org/en/) runtime environment. Using the same programming language on multiple layers of the stack gives full stack web development a whole new dimension. However, it's not a requirement of full stack web development to use the same programming language (JavaScript) for all layers of the stack. -->

我们将使用 JavaScript 编写后端代码，使用 [Node.js](https://nodejs.org/en/) 运行时环境。 在全栈的多个层次上使用相同的编程语言，给全栈 web 开发提供了一个全新的维度。 然而，对于所有层次的栈，使用相同的编程语言(JavaScript)并不是全栈 web 开发的必要条件。

<!-- It used to be more common for developers to specialize in one layer of the stack, for example the backend. Technologies on the backend and the frontend were quite different. With the Full stack trend, it has become common for developers to be proficient on all layers of the application and the database. Oftentimes, full stack developers must also have enough configuration and administration skills to operate their application, for example, in the cloud. -->

过去，对于开发人员来说，更常见的做法是专注于全栈的某个层，例如后端。 后端和前端的技术栈完全不同。 随着全栈趋势的出现，对于开发人员来说，熟练掌握应用和数据库的全栈内容已经变得非常普遍。 通常情况下，全栈开发人员还必须有足够的配置和管理技能来操作他们的应用，例如，上云。

### JavaScript fatigue
【JavaScript 疲劳】

<!-- Full stack web development is challenging in many ways. Things are happening in many places at once, and debugging is quite a bit harder than with regular desktop applications. JavaScript does not always work as you'd expect it to (compared to many other languages), and the asynchronous way its runtime environments work causes all sorts of challenges. Communicating in the web requires knowledge of the HTTP-protocol. One must also handle databases and server administration and configuration. It would also be good to know enough CSS to make applications at least somewhat presentable. -->

全栈 web 开发在许多方面都具有挑战性。 在许多地方会有突发情况，并且调试起来比普通桌面应用要困难得多。 JavaScript (与许多其他语言相比) 并不总是像你期望的那样工作 ，其运行时环境的异步工作方式带来了各种各样的挑战。 网络中的通信需要对 http 协议的知识储备。 还必须处理数据库、服务器管理和配置。 了解足够的 CSS 至少在一定程度上能够使应用显得好看。

<!-- The world of JavaScript develops fast, which brings its own set of challenges. Tools, libraries and the language itself are under constant development. Some are starting to get tired of the constant change, and have coined a term for it: [JavaScript](https://medium.com/@ericclemmons/javascript-fatigue-48d4011b6fc4) [fatigue](https://auth0.com/blog/how-to-manage-javascript-fatigue/). -->

JavaScript 的世界发展得很快，也带来了一系列的挑战。 工具、库和语言本身都在不断发展。 有些人已经开始厌倦了这种不断的变化，并为此创造了一个新词: JavaScript 疲劳。

<!-- You will suffer from JavaScript fatigue yourself during this course. Fortunately for us, there are a few ways to smooth the learning curve, and we can start with coding instead of configuration. We can't avoid configuration completely, but we can merrily push ahead in the next few weeks while avoiding the worst of configuration hells. -->

在本课程中，您将遭受 JavaScript 疲劳的折磨。 对我们来说幸运的是，有几种方法可以使学习曲线变得平滑，我们可以从编码而不是配置开始。 我们不能完全避免配置，但是我们可以在接下来的几周里愉快地推进，同时避免糟糕的配置地狱。

</div>

<div class="tasks"> 
  <h3>Exercises 0.1.-0.6.</h3>

<!-- The exercises are submitted via GitHub, and by marking the exercises as done in the [submission system](https://studies.cs.helsinki.fi/stats/courses/fullstackopen). -->

这些练习是通过 GitHub 提交的，并在[submission system](https://studies.cs.helsinki.fi/stats/courses/fullstackopen)中将练习标记为已完成。

<!-- You can submit all of the exercises into the same repository, or use multiple different repositories. If you submit exercises from different parts into the same repository, name your directories well. If you use a private repository to submit the exercises, add _mluukkai_ as a collaborator to it. -->

您可以将本课程的所有练习提交到同一个仓库，或者使用多个不同的仓库。 如果您将来自不同章节的练习提交到同一个仓库中，请使用一个合理的目录命名方案。 如果您使用私有库进行提交练习，那么添加 mluukkai 作为 collaborator。

<!-- One good way to name the directories in your submission repository is as follows: -->

提交仓库中，一个好的命名目录的方法如下:

```
part0
part1
  courseinfo
  unicafe
  anecdotes
part2
  phonebook
  countries
```

<!-- So, each part has its own directory, which contains a directory for each exercise set (like the unicafe exercises in part 1). -->

这样，每个章节都有自己的目录，其中包含每个练习集的目录(如第 1 章中的 unicafe 练习)。

<!-- The exercises are submitted **one part at a time**. When you have submitted the exercises for a part, you can no longer submit any missed exercises for that part. -->

练习的上交规则为，一次上交一个章节。 当你已经上交了一个章节的练习，你不能再上交任何那一章节错过的练习。

  <h4>0.1: HTML</h4>

<!-- Review the basics of HTML by reading this tutorial from Mozilla: [HTML tutorial](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics). -->

通过阅读 Mozilla 的[HTML tutorial](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics)来回顾 HTML 的基础知识。

<!-- <i>This exercise is not submitted to GitHub, it's enough to just read the tutorial</i> -->

这个练习并不用提交到 GitHub，只需要阅读教程就足够了

  <h4>0.2: CSS</h4>

<!-- Review the basics of CSS by reading this tutorial from Mozilla: [CSS tutorial](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/CSS_basics). -->

通过阅读 Mozilla 的[CSS tutorial](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/CSS_basics).来回顾 CSS 的基础知识。

<!-- <i>This exercise is not submitted to GitHub, it's enough to just read the tutorial</i> -->

这个练习并不用提交到 GitHub，只需要阅读教程就足够了

  <h4>0.3: HTML forms</h4>

<!-- Learn about the basics of HTML forms by reading Mozilla's tutorial [Your first form](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Your_first_HTML_form). -->

通过阅读 Mozilla 的 [Your first form](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Your_first_HTML_form)教程了解 HTML 表单的基础知识。

<!-- <i>This exercise is not submitted to GitHub, it's enough to just read the tutorial</i> -->

这个练习并不用提交到 GitHub，只需要阅读教程就足够了

  <h4>0.4: new note</h4>

<!-- In chapter [Loading a page containing JavaScript - revised](/zh/part0/web_应用的基础设施#loading-a-page-containing-java-script-revised) the chain of events caused by opening the page <https://studies.cs.helsinki.fi/exampleapp/notes> is depicted as a [sequence diagram](https://www.geeksforgeeks.org/unified-modeling-language-uml-sequence-diagrams/) -->

在  [加载一个包含 JavaScript 的页面 - 复习](/zh/part0/web_应用的基础设施#loading-a-page-containing-java-script-revised)这一章中，页面打开 https://studies.cs.helsinki.fi/exampleapp/notes 时引起的事件链被描述为一个时序图

<!-- The diagram was made using [websequencediagrams](https://www.websequencediagrams.com) service as follows: -->

该图是使用 [websequencediagrams](https://www.websequencediagrams.com) 服务绘制的，如下所示:

```
browser->server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/notes
server-->browser: HTML-code
browser->server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/main.css
server-->browser: main.css
browser->server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/main.js
server-->browser: main.js

note over browser:
browser starts executing js-code
that requests JSON data from server
end note

browser->server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/data.json
server-->browser: [{ content: "HTML is easy", date: "2019-05-23" }, ...]

note over browser:
browser executes the event handler
that renders notes to display
end note
```

<!-- **Create a similar diagram** depicting the situation where the user creates a new note on page <https://studies.cs.helsinki.fi/exampleapp/notes> by writing something into the text field and clicking the <i>submit</i> button. -->

创建一个类似的图表，描述这种情况: 用户在页面上创建一个新的 Note，在文本区域写一些东西，然后点击提交按钮到 https://studies.cs.helsinki.fi/exampleapp/notes 。

<!-- If necessary, show operations on the browser or on the server as comments on the diagram. -->

如有必要，将浏览器或服务器上的操作显示为图表上的注释。

<!-- The diagram does not have to be a sequence diagram. Any sensible way of presenting the events is fine. -->

这个图表不一定要是一个时序图，任何合理的方式来表达这些事件都是可行的。

<!-- All necessary information for doing this, and the next three exercises, can be found from the text of [this part](/zh/part0/web_应用的基础设施#forms-and-http-post). -->
<!-- The idea of these exercises is to read the text through once more, and to think through what is going on where. Reading the application [code](https://github.com/mluukkai/example_app) is not necessary, but it is of course possible. -->

为了做出这张图，以及完成接下来的两个练习，所有必要的信息，可以从[这一章节](/zh/part0/web_应用的基础设施#forms-and-http-post)的文本中找到。 这些练习的目的是再次阅读课文，并思考在哪里发生了什么。 阅读应用代码不是强制的，但是当然是可行的。

  <h4>0.5: Single page app</h4>

<!-- Create a diagram depicting the situation where the user goes to the [single page app](/zh/part0/web_应用的基础设施#single-page-app) version of the notes app at <https://studies.cs.helsinki.fi/exampleapp/spa>. -->

创建一个图表，描述用户在进入 https://studies.cs.helsinki.fi/exampleapp/spa 这个 Note 应用的单页版本的情况。

  <h4>0.6: New note</h4>

<!-- Create a diagram depicting the situation, where user creates a new note using the single page version of the app. -->

创建一个图表描述如下情况，用户使用应用的 SPA 版本创建一个新的Note 。

<!-- This was the last exercise, and it's time to push your answers to GitHub and mark the exercises as done in the [submission application](https://studies.cs.helsinki.fi/stats/courses/fullstackopen). -->

这是最后一个练习，是时候将你的答案推送到 GitHub，并在[提交系统](https://studies.cs.helsinki.fi/stats/courses/fullstackopen)将练习标记为已完成。

</div>
