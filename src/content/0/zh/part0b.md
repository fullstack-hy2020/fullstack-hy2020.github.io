---
mainImage: ../../../images/part-0.svg
part: 0
letter: b
lang: zh
---

<div class="content">
<!-- Before we start programming, we will go through some principles of web development by examining an example application at <https://studies.cs.helsinki.fi/exampleapp>.-->
在我们开始编程之前，我们将通过拆解 <https://studies.cs.helsinki.fi/exampleapp> 上的一个示例应用来探寻网页开发的一些原则。

<!-- The application exists only to demonstrate some basic concepts of the course, and is, by no means, an example of <i>how</i> a modern web application should be made. On the contrary, it demonstrates some old techniques of web development, which could even be considered <i>bad practices</i> nowadays.-->
该应用程序仅用于演示课程的一些基本概念，绝不是一个<i>如何</i>制作现代Web应用程序的示例。相反，它展示了一些Web开发中的古老技术，如今甚至可以被认为是<i>不良实践</i>。

<!-- Code will conform to contemporary best practices from [part 1](/en/part1) onwards.-->
从[第一章](/zh/part1)开始，我们的代码将符合现代最佳实践。

<!-- Open the [example application](https://studies.cs.helsinki.fi/exampleapp) in your browser. Sometimes this takes a while.-->
利用浏览器打开[示例应用程序](https://studies.cs.helsinki.fi/exampleapp)。有时需要等待一段时间。

<!-- The course material is done with the Chrome browser.-->
该教学材料是用Chrome浏览器完成的。

<!-- **The 1st rule of web development**: Always keep the Developer Console open on your web browser. On macOS, open the console by pressing _fn_-_F12_ or _option-cmd-i_ simultaneously. On Windows or Linux, open the console by pressing _Fn_-_F12_ or _ctrl-shift-i_ simultaneously. The console can also be opened via the [context menu](https://en.wikipedia.org/wiki/Menu_key).-->
**网页开发第1军规**：始终在浏览器中打开开发者控制台。在macOS上，同时按下_fn_-_F12_或_option-cmd-i_打开控制台。在Windows或Linux上，同时按下_Fn_-_F12_或_ctrl-shift-i_打开控制台。控制台也可以通过[上下文菜单](https://en.wikipedia.org/wiki/Menu_key)打开。

<!-- Remember to <i>always</i> keep the Developer Console open when developing web applications.-->
牢记，<i>永远</i>在开发网页应用时始终保持开发者控制台打开。

<!-- The console looks like this:-->
控制台看起来像这样：

![A screenshot of the developer tools open in a browser](../../images/0/1e.png)

<!-- Make sure that the <i>Network</i> tab is open, and check the <i>Disable cache</i> option as shown. <i>Preserve log</i> can also be useful: it saves the logs printed by the application when the page is reloaded.-->
确保<i>网络（Network)</i>标签页是打开的，并检查<i>禁用缓存（Disable cache）</i>选项如图所示。<i>保留日志（Preserve log）</i>也可能很有用：当页面重新加载时，它会保存应用程序打印的日志。

<!-- **NB:** The most important tab is the <i>Console</i> tab. However, in this introduction, we will be using the <i>Network</i> tab quite a bit.-->
**注意：**最重要的标签是<i>控制台</i>标签。但是，在本介绍中，我们将经常使用的是<i>网络</i>标签。

### HTTP GET

<!-- The server and the web browser communicate with each other using the [HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP) protocol. The <i>Network</i> tab shows how the browser and the server communicate.-->
服务器和浏览器之间使用[HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP)协议相互通信。<i>网络</i>选项卡显示了浏览器和服务器之间的通信情况。

<!-- When you reload the page (To refresh a webpage, on windows, press the _Fn_-_F5_ keys. On macOS, press _command_-_R_. Or press the &#8635; symbol on your browser), the console will show that two events have happened:-->
当你重新载入页面（在Windows上，按 _Fn_-_F5_ 键。 在macOS上，按 _command_-_R_。 或者按浏览器上的 &#8635; 符号），控制台将显示发生了两个事件：

<!-- - The browser has fetched the contents of the page <i>studies.cs.helsinki.fi/exampleapp</i> from the server-->

- 浏览器从服务器上获取了<i>studies.cs.helsinki.fi/exampleapp</i>页面的内容。
  <!-- - And has downloaded the image <i>kuva.png</i>-->
- 并下载了图像<i>kuva.png</i>

![Screenshot of the developer console showing these two events](../../images/0/2e.png)

<!-- On a small screen, you might have to widen the console window to see these.-->
在小屏幕上，你可能需要把控制台窗口拉宽来看到这些内容。

<!-- Clicking the first event reveals more information on what's happening:-->
点击第一个事件可以查看更多关于正在发生的信息：

![Detailed view of a single event](../../images/0/3e.png)

<!-- The upper part, <i>General</i>, shows that the browser requested the address <i><https://studies.cs.helsinki.fi/exampleapp></i> (though the address has changed slightly since this picture was taken) using the [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET) method, and that the request was successful, because the server response had the [Status code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) 200.-->
上面的<i>General</i>部分表明浏览器使用了[GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET)方法请求了地址<i><https://studies.cs.helsinki.fi/exampleapp></i>（虽然自从这张图片拍摄以来地址有了细微变化），而且请求成功，因为服务器响应的[状态码](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) 为200。

<!-- The request and the server response have several [headers](https://en.wikipedia.org/wiki/List_of_HTTP_header_fields):-->
请求和服务器的响应有几个[头信息](https://en.wikipedia.org/wiki/List_of_HTTP_header_fields)：

![Screenshot of response headers](../../images/0/4e.png)

<!-- The <i>Response headers</i> on top tell us e.g. the size of the response in bytes and the exact time of the response. An important header [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) tells us that the response is a text file in [utf-8](https://en.wikipedia.org/wiki/UTF-8) format and the contents of which have been formatted with HTML. This way the browser knows the response to be a regular [HTML](https://en.wikipedia.org/wiki/HTML) page and to render it to the browser ''like a web page''.-->
<i>响应头信息</i>顶部告诉我们例如响应的字节大小和确切的响应时间。一个重要的头信息[Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type)告诉我们响应是一个[utf-8](https://en.wikipedia.org/wiki/UTF-8)格式的文本文件，其内容已经使用HTML进行了格式化。这样，浏览器就知道响应是一个普通的[HTML](https://en.wikipedia.org/wiki/HTML)页面，并''像一个网页一样''将其渲染到浏览器。

<!-- The <i>Response</i> tab shows the response data, a regular HTML page. The <i>body</i> section determines the structure of the page rendered to the screen:-->
<i>响应</i>选项卡显示响应数据，这是一个常规的HTML页面。<i>body</i>部分决定了页面渲染到屏幕上的结构：

![Screenshot of the response tab](../../images/0/5e.png)

<!-- The page contains a [div](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div) element, which in turn contains a heading, a link to the page <i>notes</i>, and an [img](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img) tag, and displays the number of notes created.-->
页面包含一个[div](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div)元素，其中包含一个标题，一个链接到页面的链接<i>notes</i>，以及一个[img](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img)标签，并显示已创建的笔记数量。

<!-- Because of the img tag, the browser does a second <i>HTTP request</i> to fetch the image <i>kuva.png</i> from the server. The details of the request are as follows:-->
因为img标签，浏览器会发起第二次 <i>HTTP请求</i> 从服务器获取图片<i>kuva.png</i>。请求的细节如下：

![Detailed view of the second event](../../images/0/6e.png)

<!-- The request was made to the address <https://studies.cs.helsinki.fi/exampleapp/kuva.png> and its type is HTTP GET. The response headers tell us that the response size is 89350 bytes, and its [Content-type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) is <i>image/png</i>, so it is a png image. The browser uses this information to render the image correctly to the screen.-->
请求是发送到地址 <https://studies.cs.helsinki.fi/exampleapp/kuva.png> ，类型是HTTP GET。响应头告诉我们响应大小是89350字节，其[Content-type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type)是<i>image/png</i>，所以它是一张png图片。浏览器使用这些信息正确地将图像呈现到屏幕上。

<!-- The chain of events caused by opening the page <https://studies.cs.helsinki.fi/exampleapp> on a browser forms the following [sequence diagram](https://www.geeksforgeeks.org/unified-modeling-language-uml-sequence-diagrams/):-->
打开浏览器访问<https://studies.cs.helsinki.fi/exampleapp>页面将引发的事件链[流程图](https://www.geeksforgeeks.org/unified-modeling-language-uml-sequence-diagrams/)如下：

![Sequence diagram of the flow covered above](../../images/0/7m.png)

<!-- The sequence diagram visualizes how the browser and server are communicating over the time. The time flows in the diagram from top to bottom, so the diagram starts with the first request that the browser sends to server, followed by the response.-->
流程图展示了浏览器和服务器沟通的时间线。时间在图表中从上到下流动，因此图表以浏览器发送给服务器的第一个请求开始，然后是响应。

<!-- First, the browser sends an HTTP GET request to the server to fetch the HTML code of the page. The <i>img</i> tag in the HTML prompts the browser to fetch the image <i>kuva.png</i>. The browser renders the HTML page and the image to the screen.-->
首先，浏览器向服务器发送HTTP GET请求以获取页面的HTML代码。HTML中的<i>img</i>标签提示浏览器获取图像<i>kuva.png</i>。浏览器将HTML页面和图像渲染到屏幕上。

<!-- Even though it is difficult to notice, the HTML page begins to render before the image has been fetched from the server.-->
虽然很难察觉，HTML 页面在从服务器获取图像之前就开始渲染了。

### Traditional web applications

<!-- The homepage of the example application works like a <i>traditional web application</i>. When entering the page, the browser fetches the HTML document detailing the structure and the textual content of the page from the server.-->
该示例应用的页面就像一个<i>传统的Web应用程序</i>一样。当进入页面时，浏览器从服务器获取描述页面结构和文本内容的HTML文档。

<!-- The server has formed this document somehow. The document can be a <i>static</i> text file saved into the server's directory. The server can also form the HTML documents <i>dynamically</i> according to the application code, using, for example, data from a database.-->
服务器以某种方式生成了这个文档。文档可以是一个保存到服务器的目录中的静态</i>文本文件。服务器也可以根据应用程序代码<i>动态</i>地生成HTML文档，例如使用数据库中的数据。
<!-- The HTML code of the example application has been formed dynamically because it contains information on the number of created notes.-->
示例应用程序的HTML代码是动态生成的，因为它包含有关已创建笔记数量的信息。

<!-- The HTML code of the homepage is as follows:-->
HTML代码如下：

```js
const getFrontPageHtml = noteCount => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
      </head>
      <body>
        <div class=''container''>
          <h1>Full stack example app</h1>
          <p>number of notes created ${noteCount}</p>
          <a href=''/notes''>notes</a>
          <img src=''kuva.png'' width=''200'' />
        </div>
      </body>
    </html>
`
}

app.get(''/'', (req, res) => {
  const page = getFrontPageHtml(notes.length)
  res.send(page)
})
```

<!-- You don''t have to understand the code just yet.-->
你不必现在就去理解这段代码。

<!-- The content of the HTML page has been saved as a template string or a string that allows for evaluating, for example, variables, like <em>noteCount</em>, in the midst of it. The dynamically changing part of the homepage, the number of saved notes (in the code <em>noteCount</em>), is replaced by the current number of notes (in the code <em>notes.length</em>) in the template string.-->
HTML 页面的内容已经被保存为一个模板字符串，或者一个用于计算变量（例如<em>noteCount</em>）的字符串。主页的动态变化部分，模板字符串中的内容，即已保存的笔记的数量（在代码<em>noteCount</em>中），被当前笔记的数量（代码中的<em>notes.length</em>）替换掉。

<!-- Writing HTML amid the code is of course not smart, but for old-school PHP programmers, it was a normal practice.-->
直接写HTML代码当然不是明智之举，但对于世界上最优秀的老派PHP程序员来说，这是一种常规操作。

<!-- In traditional web applications, the browser is "dumb". It only fetches HTML data from the server, and all application logic is on the server. A server can be created using [Java Spring](https://spring.io/projects/spring-framework) , [Python Flask](https://flask.palletsprojects.com/en/2.2.x/) or [Ruby on Rails](http://rubyonrails.org/) to name just a few examples.-->
在传统的Web应用程序中，浏览器就是个憨憨。它只会从服务器获取HTML数据，所有的应用程序逻辑都在服务器上。可以使用[Java Spring](https://spring.io/projects/spring-framework)，[Python Flask](https://flask.palletsprojects.com/en/2.2.x/)或[Ruby on Rails](http://rubyonrails.org/)等等来构建服务器。

<!-- The example uses [Express](https://expressjs.com/) library with Node.js. This course will use Node.js and Express to create web servers.-->
本例使用的是[Express](https://expressjs.com/)库和Node.js。本课程将使用Node.js和Express来创建Web服务器。

### Running application logic in the browser

<!-- Keep the Developer Console open. Empty the console by clicking the 🚫 symbol, or by typing clear() in the console.-->
保持开发者控制台打开。点击🚫符号，或者在控制台中输入clear()来清空控制台。
<!-- Now when you go to the [notes](https://studies.cs.helsinki.fi/exampleapp/notes) page, the browser does 4 HTTP requests:-->
现在当你访问[notes](https://studies.cs.helsinki.fi/exampleapp/notes)页面时，浏览器会发出4个HTTP请求：

![Screenshot of the developer console with the 4 requests visible](../../images/0/8e.png)

<!-- All of the requests have <i>different</i> types. The first request's type is <i>document</i>. It is the HTML code of the page, and it looks as follows:-->
所有的请求都有<i>不同</i>的类型。第一个请求的类型是<i>文档</i>。它是页面的HTML代码，看起来如下：

![Detailed view of the first request](../../images/0/9e.png)

<!-- When we compare the page shown on the browser and the HTML code returned by the server, we notice that the code does not contain the list of notes.-->
当我们比较浏览器上显示的页面和服务器返回的HTML代码时，我们会注意到代码中不包含笔记列表。
<!-- The [head](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head) section of the HTML contains a [script](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script) tag, which causes the browser to fetch a JavaScript file called <i>main.js</i>.-->
HTML 的[head](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head) 部分包含一个[script](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script) 标签，它会导致浏览器去获取一个名为<i>main.js</i>的JavaScript文件。

<!-- The JavaScript code looks as follows:-->

JavaScript 代码如下：

```
var x = 5;
var y = 10;
var z = x + y;
```

```
var x = 5;
var y = 10;
var z = x + y;
```

```js
var xhttp = new XMLHttpRequest()

xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    const data = JSON.parse(this.responseText)
    console.log(data)

    var ul = document.createElement(''ul'')
    ul.setAttribute(''class'', ''notes'')

    data.forEach(function(note) {
      var li = document.createElement(''li'')

      ul.appendChild(li)
      li.appendChild(document.createTextNode(note.content))
    })

    document.getElementsByClassName(''notes'').appendChild(ul)
  }
}

xhttp.open(''GET'', ''/data.json'', true)
xhttp.send()
```

<!-- The details of the code are not important right now, but some code has been included to spice up the images and the text. We will properly start coding in [part 1](/en/part1). The sample code in this part is actually not relevant at all to the coding techniques of this course.-->
目前代码的细节并不重要，但是已经包含了一些代码来提升图片和文字的质量。我们将在[第一章](/en/part1)正式开始编码。这章节的示例代码实际上与本课程所涉及的编码技术没有任何关联。

<!-- > Some might wonder why xhttp-object is used instead of the modern fetch. This is due to not wanting to go into promises at all yet, and the code having a secondary role in this part. We will return to modern ways to make requests to the server in [part 2](/en/part2).-->

> 有些人可能想知道为什么使用xhttp-object而不是更现代的fetch。这是因为不想在这一章节涉及任何promises，而且这段代码在这一章节扮演着次要的角色。我们将在[第二章](/en/part2)回归到现代的方式来向服务器发起请求。

<!-- Immediately after fetching the <i>script</i> tag, the browser begins to execute the code.-->
在取回<i>脚本</i>标签后，浏览器就立即开始执行代码。

<!-- The last two lines instruct the browser to do an HTTP GET request to the server's address <i>/data.json</i>:-->
最后两行指示浏览器向服务器地址<i>/data.json</i>发出HTTP GET请求：

```js
xhttp.open(''GET'', ''/data.json'', true)
xhttp.send()
```

<!-- This is the bottom-most request shown on the Network tab.-->
这是网络标签上显示的最底部的请求。

<!-- We can try going to the address <https://studies.cs.helsinki.fi/exampleapp/data.json> straight from the browser:-->
我们可以尝试从浏览器直接访问<https://studies.cs.helsinki.fi/exampleapp/data.json>。

![Raw JSON Data](../../images/0/10e.png)

<!-- There we find the notes in [JSON](https://en.wikipedia.org/wiki/JSON) "raw data". By default, Chromium-based browsers are not too good at displaying JSON data. Plugins can be used to handle the formatting. Install, for example, [JSONVue](https://chrome.google.com/webstore/detail/jsonview/chklaanhfefbnpoihckbnefhakgolnmc) on Chrome, and reload the page. The data is now nicely formatted:-->
我们可以在[JSON](https://en.wikipedia.org/wiki/JSON) "原始数据"中找到笔记。默认情况下，基于Chromium的浏览器不太擅长显示JSON数据。可以使用插件来处理格式。例如，在Chrome上安装[JSONVue](https://chrome.google.com/webstore/detail/jsonview/chklaanhfefbnpoihckbnefhakgolnmc)，然后重新加载页面。现在数据格式化就很漂亮了：

![Formatted JSON output](../../images/0/11e.png)

<!-- So, the JavaScript code of the notes page above downloads the JSON data containing the notes, and forms a bullet-point list from the note contents:-->
所以，上面的笔记页面的JavaScript代码下载了包含笔记的JSON数据，并根据笔记内容中形成了一个项目列表：

<!-- This is done by the following code:-->
这是通过以下代码完成的：

```js
const data = JSON.parse(this.responseText)
console.log(data)

var ul = document.createElement(''ul'')
ul.setAttribute(''class'', ''notes'')

data.forEach(function(note) {
  var li = document.createElement(''li'')

  ul.appendChild(li)
  li.appendChild(document.createTextNode(note.content))
})

document.getElementById(''notes'').appendChild(ul)
```

<!-- The code first creates an unordered list with a [ul](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul)-tag...-->
代码首先使用一个[ul](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul)-标签创建一个无序列表...

```js
var ul = document.createElement(''ul'')
ul.setAttribute(''class'', ''notes'')
```

<!-- ...and then adds one [li](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li)-tag for each note. Only the <i>content</i> field of each note becomes the contents of the li-tag. The timestamps found in the raw data are not used for anything here.-->
然后为每条笔记添加一个[li](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li)标签。只有每条笔记的<i>content</i>字段才作为li标签的内容。原始数据中的时间戳不会用于任何地方。

```js
data.forEach(function(note) {
  var li = document.createElement(''li'')

  ul.appendChild(li)
  li.appendChild(document.createTextNode(note.content))
})
```

<!-- Now open the <i>Console</i> tab on your Developer Console:-->
现在在您的开发者控制台上打开<i>控制台</i>选项卡：

![Screenshot of the console tab on the developer console](../../images/0/12e.png)

<!-- By clicking the little triangle at the beginning of the line, you can expand the text on the console.-->
点击行首的小三角形，你可以展开控制台上的文本。

![Screenshot of one of the previously collapsed entries expanded](../../images/0/13e.png)

<!-- This output on the console is caused by the <em>console.log</em> command in the code:-->
这个控制台的输出是由代码中的<em>console.log</em>命令发起的：

```js
const data = JSON.parse(this.responseText)
console.log(data)
```

<!-- So, after receiving data from the server, the code prints it to the console.-->
所以，在收到服务器的数据之后，代码将其打印到控制台。

<!-- The <i>Console</i> tab and the <em>console.log</em> command will become very familiar to you during the course.-->
<i>控制台</i> 选项卡和 <em>console.log</em> 命令是本课程的常客。

### Event handlers and Callback functions

<!-- The structure of this code is a bit odd:-->
这段代码的结构有点奇怪：

```js
var xhttp = new XMLHttpRequest()

xhttp.onreadystatechange = function() {
  // code that takes care of the server response
}

xhttp.open(''GET'', ''/data.json'', true)
xhttp.send()
```

<!-- The request to the server is sent on the last line, but the code to handle the response can be found further up. What's going on?-->
最后一行发送了服务器的请求，但是处理响应的代码却在上面，这是怎么回事？

```js
xhttp.onreadystatechange = function () {
```

<!-- On this line, an <i>event handler</i> for the event <i>onreadystatechange</i> is defined for the <em>xhttp</em> object doing the request. When the state of the object changes, the browser calls the event handler function. The function code checks that the [readyState](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState) equals 4 (which depicts the situation <i>The operation is complete</i>) and that the HTTP status code of the response is 200.-->
在这一行，为<em>xhttp</em>对象发出的请求定义了一个<i>事件处理程序</i>事件<i>onreadystatechange</i>。当对象的状态改变时，浏览器会调用事件处理程序函数。函数代码检查[readyState](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState)等于4（描述<i>操作完成</i>的情况），以及响应的HTTP状态码为200。

```js
xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    // code that takes care of the server response
  }
}
```

<!-- The mechanism of invoking event handlers is very common in JavaScript. Event handler functions are called [callback](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function) functions. The application code does not invoke the functions itself, but the runtime environment - the browser, invokes the function at an appropriate time when the <i>event</i> has occurred.-->
事件调用处理程序的机制在JavaScript中非常常见。事件处理函数被称为[回调](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function)函数。应用程序代码本身不调用该函数，而是在<i>事件</i>发生时，即运行时环境——浏览器，调用该函数。

### Document Object Model or DOM

<!-- We can think of HTML pages as implicit tree structures.-->
我们可以把HTML页面想象成隐式的树结构。

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
<!-- The same treelike structure can be seen on the console tab <i>Elements</i>.-->
<i>元素（Elements)</i>控制台选项卡上也可以看到类似树状结构。

![A screenshot of the Elements tab of the developer console](../../images/0/14e.png)

<!-- The functioning of the browser is based on the idea of depicting HTML elements as a tree.-->
浏览器的功能基于将HTML元素描述为树的想法。

<!-- Document Object Model, or [DOM](https://en.wikipedia.org/wiki/Document_Object_Model), is an Application Programming Interface (<i>API</i>) that enables programmatic modification of the <i>element trees</i> corresponding to web pages.-->
文档对象模型，或[DOM](https://en.wikipedia.org/wiki/Document_Object_Model)，是一种应用程序编程接口（<i>API</i>），可以使程序化地修改与网页相对应的<i>元素树</i>。

<!-- The JavaScript code introduced in the previous chapter used the DOM-API to add a list of notes to the page.-->
上一章中介绍的JavaScript代码使用DOM-API将一系列笔记添加到页面上。

<!-- The following code creates a new node to the variable <em>ul</em>, and adds some child nodes to it:-->
以下代码创建一个新节点到变量<em>ul</em>，并且为它添加一些子节点：

```js
var ul = document.createElement(''ul'')

data.forEach(function(note) {
  var li = document.createElement(''li'')

  ul.appendChild(li)
  li.appendChild(document.createTextNode(note.content))
})
```

<!-- Finally, the tree branch of the <em>ul</em> variable is connected to its proper place in the HTML tree of the whole page:-->
最后，<em>ul</em>变量的树枝被连接到整个页面的HTML树的适当位置：

```js
document.getElementsByClassName(''notes'').appendChild(ul)
```

### Manipulating the document object from console

<!-- The topmost node of the DOM tree of an HTML document is called the <em>document</em> object. We can perform various operations on a webpage using the DOM-API. You can access the <em>document</em> object by typing <em>document</em> into the Console tab:-->
HTML文档的DOM树的顶部节点称为<em>文档(document)</em>对象。我们可以使用DOM-API对网页执行各种操作。您可以在控制台选项卡中键入<em>文档</em>来访问<em>文档</em>对象：

![document in console tab of developer tools](../../images/0/15e.png)

<!-- Let's add a new note to the page from the console.-->
让我们从控制台向页面添加一条新的笔记。

<!-- First, we''ll get the list of notes from the page. The list is in the first ul-element of the page:-->
首先，我们将从页面获取笔记列表。该列表位于页面的第一个ul元素中：

```js
list = document.getElementsByTagName(''ul'')[0]
```

<!-- Then create a new li-element and add some text content to it:-->
然后创建一个新的li元素，并添加一些文本内容：

```js
newElement = document.createElement(''li'')
newElement.textContent = ''Page manipulation from console is easy''
```

<!-- And add the new li-element to the list:-->
- 添加新的列表项

```js
list.appendChild(newElement)
```

![Screenshot of the page with the new note added to the list](../../images/0/16e.png)

<!-- Even though the page updates on your browser, the changes are not permanent. If the page is reloaded, the new note will disappear, because the changes were not pushed to the server. The JavaScript code the browser fetches will always create the list of notes based on JSON data from the address <https://studies.cs.helsinki.fi/exampleapp/data.json>.-->
虽然浏览器上的页面更新了，但更改并不是永久性的。如果重新加载页面，新的笔记将会消失，因为这些更改没有被推送到服务器。浏览器获取的JavaScript代码将总是根据来自<https://studies.cs.helsinki.fi/exampleapp/data.json>地址的JSON数据创建笔记列表。

### CSS

<!-- The <i>head</i> element of the HTML code of the Notes page contains a [link](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) tag, which determines that the browser must fetch a [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) style sheet from the address [main.css](https://studies.cs.helsinki.fi/exampleapp/main.css).-->
<i>head</i> 元素的HTML代码中的Notes页面包含了一个[链接（Link)](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link)标签，它决定浏览器必须从地址[main.css](https://studies.cs.helsinki.fi/exampleapp/main.css)获取一个[CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)样式表。

<!-- Cascading Style Sheets, or CSS, is a style sheet language used to determine the appearance of web pages.-->
Cascading Style Sheets（CSS），或称为CSS，是一种样式表语言，用于决定网页的外观。

<!-- The fetched CSS file looks as follows:-->

以下是取回的CSS文件：

```css
.container {
  padding: 10px;
  border: 1px solid;
}

.notes {
  color: blue;
}
```

<!-- The file defines two [class selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors). These are used to select certain parts of the page and to define styling rules to style them.-->
文件定义了两个[类选择器](https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors)。它们用于选择页面的某些部分，并定义样式规则来对其进行样式设置。

<!-- A class selector definition always starts with a period and contains the name of the class.-->
类选择器`.classname`的定义总是以句号开头，并包含类的名称。

<!-- Classes are [attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/class), which can be added to HTML elements.-->
类是[属性](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/class)，可以添加到HTML元素中。

<!-- CSS attributes can be examined on the <i>elements</i> tab of the console:-->
在控制台的<i>元素</i>标签中可以检查CSS属性：

![Screenshot of the Elements tab on the developer console](../../images/0/17e.png)

<!-- The outermost <i>div</i> element has the class <i>container</i>. The <i>ul</i> element containing the list of notes has the class <i>notes</i>.-->
外层<i>div</i>元素拥有类<i>container</i>。包含笔记列表的<i>ul</i>元素拥有的类<i>notes</i>。

<!-- The CSS rule defines that elements with the <i>container</i> class will be outlined with a one-pixel wide [border](https://developer.mozilla.org/en-US/docs/Web/CSS/border). It also sets 10-pixel [padding](https://developer.mozilla.org/en-US/docs/Web/CSS/padding) on the element. This adds some empty space between the element's content and the border.-->
CSS 规则定义了带有<i>container</i>类的元素将用一像素宽的[边框](https://developer.mozilla.org/en-US/docs/Web/CSS/border)绘制出轮廓。它还为元素设置了 10 像素的[填充](https://developer.mozilla.org/en-US/docs/Web/CSS/padding)。这样就在元素的内容和边框之间添加了一些空白空间。

<!-- The second CSS rule sets the text color of the <i>notes</i> class as blue.-->
第二个CSS规则将<i>notes</i>类的文本颜色设置为蓝色。

<!-- HTML elements can also have other attributes apart from classes. The <i>div</i> element containing the notes has an [id](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id) attribute. JavaScript code uses the id to find the element.-->
HTML 元素除了类之外还可以有其他属性。包含笔记的 <i>div</i> 元素有一个[id](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id)属性。JavaScript 代码使用 id 来查找元素。

<!-- The <i>Elements</i> tab of the console can be used to change the styles of the elements.-->
<i>元素</i> 标签页可以用来更改元素的样式。

![developer tools elements tab](../../images/0/18e.png)

<!-- Changes made on the console will not be permanent. If you want to make lasting changes, they must be saved to the CSS style sheet on the server.-->
如果想要永久生效，必须把它们保存到服务器上的CSS样式表中，控制台上做出的改变不是永久性的。

### Loading a page containing JavaScript - review

<!-- Let's review what happens when the page <https://studies.cs.helsinki.fi/exampleapp/notes> is opened on the browser.-->
让我们复习一下，当在浏览器中打开<https://studies.cs.helsinki.fi/exampleapp/notes>页面时会发生什么。

![sequence diagram of browser/server interaction](../../images/0/19m.png)

<!-- - The browser fetches the HTML code defining the content and the structure of the page from the server using an HTTP GET request.-->
浏览器使用HTTP GET请求从服务器获取定义页面内容和结构的HTML代码。
<!-- - Links in the HTML code cause the browser to also fetch the CSS style sheet <i>main.css</i>...-->
HTML代码中的Links会导致浏览器也获取<i>main.css</i>样式表...
<!-- - ...and the JavaScript code file <i>main.js</i>-->
...以及JavaScript代码文件<i>main.js</i>
<!-- - The browser executes the JavaScript code. The code makes an HTTP GET request to the address <https://studies.cs.helsinki.fi/exampleapp/data.json>, which returns a JSON-formatted response.-->

浏览器执行JavaScript代码。该代码向<https://studies.cs.helsinki.fi/exampleapp/data.json>地址发出HTTP GET请求，返回一个JSON格式的响应。
<!--   returns the notes as JSON data.-->
以JSON数据格式返回笔记。
<!-- - When the data has been fetched, the browser executes an <i>event handler</i>, which renders the notes to the page using the DOM-API.-->
当数据被获取时，浏览器执行一个<i>事件处理程序</i>，它使用DOM-API将笔记渲染到页面上。

### Forms and HTTP POST

<!-- Next, let's examine how adding a new note is done.-->
接下来，让我们来看看如何添加新笔记。

<!-- The Notes page contains a [form element](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Your_first_HTML_form).-->
`页面中包含一个 [表单元素](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Your_first_HTML_form)。`

![form element highlight in webpage and developer tools](../../images/0/20e.png)

<!-- When the button on the form is clicked, the browser will send the user input to the server. Let's open the <i>Network</i> tab and see what submitting the form looks like:-->
当表单上的按钮被点击时，浏览器会将用户输入发送到服务器。让我们打开<i>网络</i>选项卡，看看提交表单的样子：

![Screenshot of the Network tab where the events for submitting the form are shown](../../images/0/21e.png)

<!-- Surprisingly, submitting the form causes no fewer than <i>five</i> HTTP requests.-->
出乎意料的是，提交表单会产生不少于<i>五</i>个HTTP请求。
<!-- The first one is the form submit event. Let's zoom into it:-->
第一个是表单提交事件。让我们放大它：

![Detailed view of the first request](../../images/0/22e.png)

<!-- It is an [HTTP POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST) request to the server address <i>new\_note</i>. The server responds with HTTP status code 302. This is a [URL redirect](https://en.wikipedia.org/wiki/URL\_redirection), with which the server asks the browser to do a new HTTP GET request to the address defined in the header's <i>Location</i> - the address <i>notes</i>.-->
它是一个发送到服务器地址<i>new\_note</i>的HTTP POST请求。服务器回复HTTP状态码302。这是一个[URL重定向](https://en.wikipedia.org/wiki/URL\_redirection)，服务器要求浏览器执行一个新的HTTP GET请求到头信息<i>Location</i>中定义的地址-即地址<i>notes</i>。

<!-- So, the browser reloads the Notes page. The reload causes three more HTTP requests: fetching the style sheet (main.css), the JavaScript code (main.js), and the raw data of the notes (data.json).-->
所以，浏览器重新加载了Notes页面。重新加载引起了三个更多的HTTP请求：获取样式表（main.css），JavaScript代码（main.js）和笔记的原始数据（data.json）。

<!-- The network tab also shows the data submitted with the form:-->
网络选项卡也显示了随表单提交的数据：

<!-- NB: On newer Chrome, the Form Data dropdown is within the new Payload tab, located to the right of the Headers tab.-->
注意：在较新的Chrome中，表单数据下拉菜单位于新的Payload标签内，位于标题Header标签右侧。

![form data dropdown in developer tools](../../images/0/23e.png)

<!-- The Form tag has attributes <i>action</i> and <i>method</i>, which define that submitting the form is done as an HTTP POST request to the address <i>new_note</i>.-->
<i>form</i> 标签具有属性 <i>action</i> 和 <i>method</i>，它们定义了将表单提交作为一个 HTTP POST 请求发送到地址 <i>new_note</i>。

![action and method highlight](../../images/0/24e.png)

<!-- The code on the server responsible for the POST request is quite simple (NB: this code is on the server, and not on the JavaScript code fetched by the browser):-->
服务器上负责POST请求的代码相当简单（注：这段代码在服务器上，而不是浏览器获取的JavaScript代码）：

```js
app.post(''/new_note'', (req, res) => {
  notes.push({
    content: req.body.note,
    date: new Date(),
  })

  return res.redirect(''/notes'')
})
```

<!-- Data is sent as the [body](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST) of the POST request.-->
数据作为POST请求的[body](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST)发送。

<!-- The server can access the data by accessing the <em>req.body</em> field of the request object <em>req</em>.-->
服务器可以通过访问请求对象<em>req</em>的<em>req.body</em>字段来访问数据。

<!-- The server creates a new note object, and adds it to an array called <em>notes</em>.-->
服务器创建了一个新的笔记对象，并将其添加到一个叫做<em>notes</em>的数组中。

```js
notes.push({
  content: req.body.note,
  date: new Date(),
})
```

<!-- Each note object has two fields: <i>content</i> containing the actual content of the note, and <i>date</i> containing the date and time the note was created.-->
每个笔记对象有两个字段：<i>内容</i>包含笔记的实际内容，<i>日期</i>包含创建笔记的日期和时间。

<!-- The server does not save new notes to a database, so new notes disappear when the server is restarted.-->
服务器不会将新笔记保存到数据库，因此当服务器重新启动时，新笔记会消失。

### AJAX

<!-- The Notes page of the application follows an early-nineties style of web development and uses "Ajax". As such, it's on the crest of the wave of early 2000s web technology.-->
应用程序的Notes页面遵循了90年代初的网页开发风格，并使用“Ajax”。即使是这样，它在2000年初网络技术也是最fashion 的。

<!-- [AJAX](<https://en.wikipedia.org/wiki/Ajax_(programming)>) (Asynchronous JavaScript and XML) is a term introduced in February 2005 on the back of advancements in browser technology to describe a new revolutionary approach that enabled the fetching of content to web pages using JavaScript included within the HTML, without the need to rerender the page.-->
[AJAX](<https://zh.wikipedia.org/wiki/Ajax_(%E7%A8%8B%E5%BC%8F%E8%A8%AD%E8%A8%88)>)（异步的JavaScript和XML）是2005年2月在浏览器技术的进步的背景下提出的一个术语，用于描述一种新的革命性方法，该方法可以使用HTML中包含的JavaScript获取内容到Web页面，重点是无需重新渲染页面。

<!-- Before the AJAX era, all web pages worked like the [traditional web application](/en/part0/fundamentals_of_web_apps#traditional-web-applications) we saw earlier in this chapter.-->
在AJAX时代之前，所有的网页都像我们在本章早些时候看到的[传统的网络应用](/en/part0/fundamentals_of_web_apps#traditional-web-applications)那样工作。
<!-- All of the data shown on the page was fetched with the HTML code generated by the server.-->
所有在页面上显示的数据都是由服务器生成的HTML代码获取的。

<!-- The Notes page uses AJAX to fetch the notes data. Submitting the form still uses the traditional mechanism of submitting web forms.-->
Notes 页面使用 AJAX 来获取笔记数据。提交表单仍然使用传统的 Web 表单提交机制。

<!-- The application URLs reflect the old, carefree times. JSON data is fetched from the URL <https://studies.cs.helsinki.fi/exampleapp/data.json> and new notes are sent to the URL <https://studies.cs.helsinki.fi/exampleapp/new_note>.-->
应用程序的URL折射了那个过去的、无忧无虑的时光。从URL <https://studies.cs.helsinki.fi/exampleapp/data.json> 获取JSON数据，并将新笔记发送到URL <https://studies.cs.helsinki.fi/exampleapp/new_note>。
<!-- Nowadays URLs like these would not be considered acceptable, as they don''t follow the generally acknowledged conventions of [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer#Applied_to_web_services) APIs, which we''ll look into more in [part 3](/en/part3).-->
如今，像这样的URL已经钉在了历史的耻辱柱上，因为它们不遵循如今公认的[RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer#Applied_to_web_services) APIs的约定，我们将在[第3章](/en/part3)中进一步研究。

<!-- The thing termed AJAX is now so commonplace that it's taken for granted. The term has faded into oblivion, and the new generation has not even heard of it.-->
AJAX现在是如此普遍，以至于人们认为它是理所当然的。这个术语已经渐渐消失，新生代甚至连听都没有听说过。

### Single page app

<!-- In our example app, the home page works like a traditional webpage: All of the logic is on the server, and the browser only renders the HTML as instructed.-->
在我们的示例应用程序中，主页的工作原理就像传统的网页一样：所有的逻辑都在伺服器上，浏览器只按照指令渲染HTML。

<!-- The Notes page gives some of the responsibility, generating the HTML code for existing notes, to the browser. The browser tackles this task by executing the JavaScript code it fetched from the server. The code fetches the notes from the server as JSON data and adds HTML elements for displaying the notes to the page using the [DOM-API](/en/part0/fundamentals_of_web_apps#document-object-model-or-dom).-->
Notes页面将一部分责任分配给浏览器，即为现有的notes生成HTML代码。浏览器通过执行从服务器获取的JavaScript代码来完成这一任务。该代码从服务器获取notes数据，并使用[DOM-API](/en/part0/fundamentals_of_web_apps#document-object-model-or-dom)添加HTML元素来显示这些notes。

<!-- In recent years, the [Single-page application](https://en.wikipedia.org/wiki/Single-page_application) (SPA) style of creating web applications has emerged. SPA-style websites don''t fetch all of their pages separately from the server like our sample application does, but instead comprise only one HTML page fetched from the server, the contents of which are manipulated with JavaScript that executes in the browser.-->
近年来，[单页应用](https://en.wikipedia.org/wiki/Single-page_application) (SPA) 式的网络应用已经出现。 SPA 风格的网站不像我们的示例应用程序那样从服务器单独获取所有页面，而是仅包含从服务器获取的一个 HTML 页面，其内容由在浏览器中执行的 JavaScript 进行操作。

<!-- The Notes page of our application bears some resemblance to SPA-style apps, but it's not quite there yet. Even though the logic for rendering the notes is run on the browser, the page still uses the traditional way of adding new notes. The data is sent to the server via the form's submit, and the server instructs the browser to reload the Notes page with a <i>redirect</i>.-->
我们应用程序的Notes页面与SPA风格的应用程序有一些相似之处，但尚不够完善。尽管渲染笔记的逻辑是在浏览器上运行的，但该页面仍然使用传统的方式添加新笔记。数据通过表单的提交发送到服务器，服务器指示浏览器使用<i>重定向</i>重新加载Notes页面。

<!-- A single-page app version of our example application can be found at <https://studies.cs.helsinki.fi/exampleapp/spa>.-->
我们示例应用的单页应用版本可以在<https://studies.cs.helsinki.fi/exampleapp/spa>找到。
<!-- At first glance, the application looks exactly the same as the previous one.-->
乍一看，这个应用程序和之前的完全一样。
<!-- The HTML code is almost identical, but the JavaScript file is different (<i>spa.js</i>) and there is a small change in how the form-tag is defined:-->
HTML 代码几乎相同，但是 JavaScript 文件（<i>spa.js</i>）不同，并且 form-tag 的定义有一个小改变：

![form with missing action and method](../../images/0/25e.png)

<!-- The form has no <i>action</i> or <i>method</i> attributes to define how and where to send the input data.-->
表单没有<i>action</i>或<i>method</i>属性来定义如何以及向何处发送输入数据。

<!-- Open the <i>Network</i> tab and empty it. When you now create a new note, you''ll notice that the browser sends only one request to the server.-->
打开<i>网络</i>标签，清空它。当您现在创建一个新笔记时，您会注意到浏览器只向服务器发送了一个请求。

![Network tab in developer tools](../../images/0/26e.png)

<!-- The POST request to the address <i>new\_note\_spa</i> contains the new note as JSON data containing both the content of the note (<i>content</i>) and the timestamp (<i>date</i>):-->
POST请求到地址<i>new\_note\_spa</i>包含新笔记的JSON数据，其中包含笔记的内容（<i>content</i>）和时间戳（<i>date</i>）：

```js
{
  content: "single page app does not reload the whole page",
  date: "2019-05-25T15:15:59.905Z"
}
```

<!-- The <i>Content-Type</i> header of the request tells the server that the included data is represented in JSON format.-->
<i>内容类型</i>请求头告诉服务器，所包含的数据以JSON格式表示。

![Content-type header in developer tools](../../images/0/27e.png)

<!-- Without this header, the server would not know how to correctly parse the data.-->
没有这个头部，服务器就不知道如何正确解析数据。

<!-- The server responds with status code [201 created](https://httpstatuses.com/201). This time the server does not ask for a redirect, the browser stays on the same page, and it sends no further HTTP requests.-->
服务器回复状态码[201 已创建](https://httpstatuses.com/201)。这次服务器不要求重定向，浏览器保持在同一页面，并且不进一步发送HTTP请求。

<!-- The SPA version of the app does not traditionally send the form data, but instead uses the JavaScript code it fetched from the server.-->
SPA版本的应用程序不会传递表单数据，而是使用从服务器获取的JavaScript代码。
<!-- We''ll look into this code a bit, even though understanding all the details of it is not important just yet.-->
我们稍微看一下这段代码，尽管你现在并不用了解它的所有细节。

```js
var form = document.getElementById(''notes_form'')
form.onsubmit = function(e) {
  e.preventDefault()

  var note = {
    content: e.target.elements[0].value,
    date: new Date(),
  }

  notes.push(note)
  e.target.elements[0].value = ''''
  redrawNotes()
  sendToServer(note)
}
```

<!-- The command <em>document.getElementById(''notes_form'')</em> instructs the code to fetch the form element from the page and to register an <i>event handler</i> to handle the form's submit event. The event handler immediately calls the method <em>e.preventDefault()</em> to prevent the default handling of form's submit. The default method would send the data to the server and cause a new GET request, which we don''t want to happen.-->
<em>document.getElementById(''notes_form'')</em> 指令会指示代码从页面中获取表单元素，并注册一个<i>事件处理程序</i>来处理表单的提交事件。事件处理程序立即调用方法<em>e.preventDefault()</em>来阻止表单的默认处理。默认方法会将数据发送到服务器，并导致一个新的GET请求，这不是我们希望发生的。

<!-- Then the event handler creates a new note, adds it to the notes list with the command <em>notes.push(note)</em>, rerenders the note list on the page and sends the new note to the server.-->
然后，事件处理程序使用命令<em>notes.push(note)</em>创建一个新笔记，将其添加到笔记列表中，在页面上重新呈现笔记列表，并将新笔记发送到服务器。

<!-- The code for sending the note to the server is as follows:-->
代码如下，用于发送笔记到服务器：

```js
var sendToServer = function(note) {
  var xhttpForPost = new XMLHttpRequest()
  // ...

  xhttpForPost.open(''POST'', ''/new_note_spa'', true)
  xhttpForPost.setRequestHeader(''Content-type'', ''application/json'')
  xhttpForPost.send(JSON.stringify(note))
}
```

<!-- The code determines that the data is to be sent with an HTTP POST request and the data type is to be JSON. The data type is determined with a <i>Content-type</i> header. Then the data is sent as JSON string.-->
代码确定数据要以HTTP POST请求发送，数据类型是JSON。数据类型由<i>Content-type</i>头确定。然后数据以JSON字符串发送。

<!-- The application code is available at <https://github.com/mluukkai/example_app>.-->
应用代码可在<https://github.com/mluukkai/example_app>获取。
<!-- It's worth remembering that the application is only meant to demonstrate the concepts of the course. The code follows a poor style of development in some measures, and should not be used as an example when creating your applications. The same is true for the URLs used. The URL <i>new\_note\_spa</i> that new notes are sent to, does not adhere to current best practices.-->
记住，这个应用程序只是为了展示课程的概念。在某些方面，该代码遵循了不好的开发风格，不应该用作创建应用程序的示例。使用的URL也是如此。新笔记发送到的URL<i>new\_note\_spa</i>不符合当前的最佳实践。

### JavaScript-libraries

<!-- The sample app is done with so-called [vanilla JavaScript](https://www.freecodecamp.org/news/is-vanilla-javascript-worth-learning-absolutely-c2c67140ac34/), using only the DOM-API and JavaScript to manipulate the structure of the pages.-->
示例应用程序是用所谓的[vanilla JavaScript](https://www.freecodecamp.org/news/is-vanilla-javascript-worth-learning-absolutely-c2c67140ac34/)完成的，只使用DOM-API和JavaScript来操纵页面的结构。

<!-- Instead of using JavaScript and the DOM-API only, different libraries containing tools that are easier to work with compared to the DOM-API are often used to manipulate pages. One of these libraries is the ever-so-popular [jQuery](https://jquery.com/).-->
与只使用JavaScript和DOM-API不同，常用的来操纵页面的工具库比直接操作DOM-API更容易。其中最受欢迎（之一）的库是[jQuery](https://jquery.com/)。

<!-- jQuery was developed back when web applications mainly followed the traditional style of the server generating HTML pages, the functionality of which was enhanced on the browser side using JavaScript written with jQuery. One of the reasons for the success of jQuery was its so-called cross-browser compatibility. The library worked regardless of the browser or the company that made it, so there was no need for browser-specific solutions. Nowadays using jQuery is not as justified given the advancement of JavaScript, and the most popular browsers generally support basic functionalities well.-->
jQuery 在网络应用中主要遵循服务器生成HTML页面的传统风格开发的，其功能是通过使用jQuery编写的JavaScript在浏览器端进行增强。 jQuery成功的一个原因是其所谓的跨浏览器兼容性。 该库无论使用哪种浏览器或制造商，都可以正常工作，因此无需特定浏览器的解决方案。 现在，由于JavaScript的进步，使用jQuery并不合理，而且最流行的浏览器通常都能很好地支持基本功能。

<!-- The rise of the single-page app brought several more "modern" ways of web development than jQuery. The favorite of the first wave of developers was [BackboneJS](http://backbonejs.org/). After its [launch](https://github.com/angular/angular.js/blob/master/CHANGELOG.md#100-temporal-domination-2012-06-13) in 2012, Google's [AngularJS](https://angularjs.org/) quickly became almost the de facto standard of modern web development.-->
随着单页应用的兴起，比jQuery更多的"现代"网页开发方式应运而生。第一波开发者最喜欢的是[BackboneJS](http://backbonejs.org/)。在2012年[发布](https://github.com/angular/angular.js/blob/master/CHANGELOG.md#100-temporal-domination-2012-06-13)后，谷歌的[AngularJS](https://angularjs.org/)很快就成为现代网页开发的几乎默认的标准。

<!-- However, the popularity of Angular plummeted in October 2014 after the [Angular team announced that support for version 1 will end](https://web.archive.org/web/20151208002550/https://jaxenter.com/angular-2-0-announcement-backfires-112127.html), and Angular 2 will not be backwards compatible with the first version. Angular 2 and the newer versions have not gotten too warm of a welcome.-->
然而，在2014年10月，Angular的流行度在[Angular团队宣布将停止对第一版本的支持](https://web.archive.org/web/20151208002550/https://jaxenter.com/angular-2-0-announcement-backfires-112127.html)后迅速下降，而Angular 2与第一版本不兼容。Angular 2及更新版本并未受到太热烈的欢迎。

<!-- Currently, the most popular tool for implementing the browser-side logic of web applications is Facebook's [React](https://reactjs.org/) library.-->
目前，用于实现Web应用浏览器端逻辑的最受欢迎的框架是是Facebook的[React](https://reactjs.org/)库。
<!-- During this course, we will get familiar with React and the [Redux](https://github.com/reactjs/redux) library, which are frequently used together.-->
在本课程中，我们将熟悉[Redux](https://github.com/reactjs/redux)库和React，它们经常被一起使用。

<!-- The status of React seems strong, but the world of JavaScript is ever-changing. For example, recently a newcomer - [VueJS](https://vuejs.org/) - has been capturing some interest.-->
React 的状态似乎很强势，但 JavaScript 世界变化无常。例如，最新的闯入者——[VueJS](https://vuejs.org/)——也引起了许多兴趣。

### Full-stack web development

<!-- What does the name of the course, <i>Full stack web development</i>, mean? Full stack is a buzzword that everyone talks about, but no one knows what it means. Or at least, there is no agreed-upon definition for the term.-->
**什么是课程名称——<i>全栈Web开发</i>的意思？全栈是一个口号，每个人都在谈论，但没有人知道它的意思。或者至少，没有一个公认的定义来定义这个术语。**

<!-- Practically all web applications have (at least) two "layers": the browser, being closer to the end-user, is the top layer, and the server the bottom one. There is often also a database layer below the server. We can therefore think of the <i>architecture</i> of a web application as a <i>stack</i> of layers.-->
几乎所有的网络应用都有（至少）两个“层”：浏览器更靠近最终用户，是顶层，而服务器是底层。通常还有一个数据库层在服务器下面。因此，我们可以把网络应用的<i>架构</i>想象成一个<i>层叠</i>的层次结构。

<!-- Often, we also talk about the [frontend and the backend](https://en.wikipedia.org/wiki/Front_and_back_ends). The browser is the frontend, and JavaScript that runs on the browser is frontend code. The server on the other hand is the backend.-->
通常，我们也会说[前端和后端](https://en.wikipedia.org/wiki/Front_and_back_ends)。浏览器是前端，而在浏览器上运行的JavaScript则是前端代码。另一面，服务器端就是后端。

<!-- In the context of this course, full-stack web development means that we focus on all parts of the application: the frontend, the backend, and the database. Sometimes the software on the server and its operating system are seen as parts of the stack, but we won''t go into those.-->
在本课程的背景下，全栈网络开发意味着我们应关注应用程序的所有部分：前端、后端和数据库。有时服务器上的软件及其操作系统被视为堆栈的一部分，但我们不会深入研究这些。

<!-- We will code the backend with JavaScript, using the [Node.js](https://nodejs.org/en/) runtime environment. Using the same programming language on multiple layers of the stack gives full-stack web development a whole new dimension. However, it's not a requirement of full-stack web development to use the same programming language (JavaScript) for all layers of the stack.-->
我们将使用JavaScript编写后端，使用[Node.js](https://nodejs.org/en/)运行时环境。在堆栈的多个层面使用相同的编程语言为全栈Web开发带来了全新的维度。但是，使用相同的编程语言（JavaScript）为堆栈的所有层面不是全栈Web开发的必要条件。

<!-- It used to be more common for developers to specialize in one layer of the stack, for example, the backend. Technologies on the backend and the frontend were quite different. With the Full stack trend, it has become common for developers to be proficient in all layers of the application and the database. Oftentimes, full-stack developers must also have enough configuration and administration skills to operate their applications, for example, in the cloud.-->
以前，开发人员更常见的是专注于堆栈的某一层，例如后端。 后端和前端的技术非常不同。 但随着全栈趋势，开发人员精通应用程序和数据库的所有层面已经变得很常见。 通常，全栈开发人员还必须具备足够的配置和管理技能来操作其应用程序，例如在云中。

### JavaScript fatigue

<!-- Full-stack web development is challenging in many ways. Things are happening in many places at once, and debugging is quite a bit harder than with regular desktop applications. JavaScript does not always work as you''d expect it to (compared to many other languages), and the asynchronous way its runtime environments work causes all sorts of challenges. Communicating on the web requires knowledge of the HTTP protocol. One must also handle databases and server administration and configuration. It would also be good to know enough CSS to make applications at least somewhat presentable.-->
全栈Web开发在许多方面都具有挑战性。事情在很多地方同时发生，而且调试也比普通桌面应用程序要困难得多。JavaScript（与许多其他语言相比）并不总是按照你期望的那样工作，而且它的异步运行环境工作方式会引起各种挑战。在网络上进行通信需要了解HTTP协议。还必须处理数据库和服务器管理和配置。也有必要了解足够的CSS，至少能使应用程序看我不会呕吐。

<!-- The world of JavaScript develops fast, which brings its own set of challenges. Tools, libraries and the language itself are under constant development. Some are starting to get tired of the constant change, and have coined a term for it: <em>JavaScript fatigue</em>. See [How to Manage JavaScript Fatigue on auth0](https://auth0.com/blog/how-to-manage-javascript-fatigue/) or [JavaScript fatigue on Medium](https://medium.com/@ericclemmons/javascript-fatigue-48d4011b6fc4).-->
JavaScript 世界发展迅速，给自己带来了新的挑战。工具、库和语言本身都处于不断发展之中。有些人开始厌倦了不断的变化，并且为此创造了一个术语：<em>JavaScript 疲劳</em>。参见[auth0 上如何管理 JavaScript 疲劳](https://auth0.com/blog/how-to-manage-javascript-fatigue/)或者[Medium 上的 JavaScript 疲劳](https://medium.com/@ericclemmons/javascript-fatigue-48d4011b6fc4)。

<!-- You will suffer from JavaScript fatigue yourself during this course. Fortunately for us, there are a few ways to smooth the learning curve, and we can start with coding instead of configuration. We can''t avoid configuration completely, but we can merrily push ahead in the next few weeks while avoiding the worst of configuration hells.-->
你在这门课程中会自己遭受JavaScript疲劳。幸运的是，我们有几种方法来平滑学习曲线，我们可以从编码开始而不是配置。我们不能完全避免配置，但我们可以在接下来的几周里快乐地推进，同时避免最糟糕的配置地狱。

</div>

<div class="tasks">
<!--   <h3>Exercises 0.1.-0.6.</h3>-->
<h3>练习0.1.-0.6.</h3>
<!-- The exercises are submitted via GitHub, and by marking the exercises as done in the "my submissions" tab of the [submission system](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).-->
通过GitHub提交练习，并在[提交系统](https://studies.cs.helsinki.fi/stats/courses/fullstackopen)的“我的提交”选项卡中标记为完成。

<!-- You can submit all of the exercises into the same repository, or use multiple different repositories. If you submit exercises from different parts into the same repository, name your directories well. If you use a private repository to submit the exercises, add _mluukkai_ as a collaborator to it.-->
你可以把所有的练习提交到同一个仓库中，或者使用多个不同的仓库。如果你把不同部分的练习提交到同一个仓库，请把目录命名清楚。如果你使用一个私有仓库提交练习，请把_mluukkai_添加为合作者。

<!-- One good way to name the directories in your submission repository is as follows:-->
一个不错的命名提交存储库中目录的方式如下：

```text
part0
part1
  courseinfo
  unicafe
  anecdotes
part2
  courseinfo
  phonebook
  countries
```

<!-- So, each part has its own directory, which contains a directory for each exercise set (like the unicafe exercises in part 1).-->
这样，每一章节都有自己的目录，其中包含每个练习集的目录（比如在第一章节的unicafe练习）。

<!-- The exercises are submitted **one part at a time**. When you have submitted the exercises for a part, you can no longer submit any missed exercises for that part.-->
练习**一次提交一章节**。当您提交了一章节练习后，您将不能再提交该章节的任何遗漏的练习了。

<!--   <h4>0.1: HTML</h4>-->

<h4>0.1：HTML</h4>

<!-- Review the basics of HTML by reading this tutorial from Mozilla: [HTML tutorial](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics).-->
通过阅读Mozilla的[HTML教程](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics)来复习HTML的基础知识。

<i>This exercise is not submitted to GitHub, it's enough to just read the tutorial</i>

这个练习不用提交GitHub，只阅读教程即可。

<!--   <h4>0.2: CSS</h4>-->

<h4>0.2：CSS</h4>

<!-- Review the basics of CSS by reading this tutorial from Mozilla: [CSS tutorial](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/CSS_basics).-->
阅读Mozilla的这篇教程来复习CSS的基础知识：[CSS 教程](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/CSS_basics)。

<i>This exercise is not submitted to GitHub, it's enough to just read the tutorial</i>

这个练习不用提交GitHub，只阅读教程即可。

<!--   <h4>0.3: HTML forms</h4>-->

<h4>0.3：HTML 表单</h4>

<!-- Learn about the basics of HTML forms by reading Mozilla's tutorial [Your first form](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Your_first_HTML_form).-->
学习通过阅读Mozilla的教程[你的第一个表单](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Your_first_HTML_form)了解HTML表单的基础知识。

<i>This exercise is not submitted to GitHub, it's enough to just read the tutorial</i>

这个练习不用提交GitHub，只阅读教程即可。

<!--   <h4>0.4: New note diagram</h4>-->

<h4>0.4：新的笔记图表</h4>

<!-- In the section [Loading a page containing JavaScript - review](/en/part0/fundamentals_of_web_apps#loading-a-page-containing-java-script-review), the chain of events caused by opening the page <https://studies.cs.helsinki.fi/exampleapp/notes> is depicted as a [sequence diagram](https://www.geeksforgeeks.org/unified-modeling-language-uml-sequence-diagrams/)-->
在[加载包含JavaScript的页面-复习](/en/part0/fundamentals_of_web_apps#loading-a-page-containing-java-script-review)一节中，打开<https://studies.cs.helsinki.fi/exampleapp/notes>页面所引发的事件被描述为一个[时序图](https://www.geeksforgeeks.org/unified-modeling-language-uml-sequence-diagrams/)。

<!-- The diagram was made as a GitHub Markdown-file using the [Mermaid](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams)-syntax, as follows:-->
图表是使用 [Mermaid](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams)-语法作为GitHub Markdown-文件制作的，如下所示：

```text
sequenceDiagram
    participant browser
    participant server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate server
    server-->>browser: HTML document
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: the css file
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate server
    server-->>browser: the JavaScript file
    deactivate server

    Note right of browser: The browser starts executing the JavaScript code that fetches the JSON from the server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: [{ "content": "HTML is easy", "date": "2023-1-1" }, ... ]
    deactivate server

    Note right of browser: The browser executes the callback function that renders the notes
```

<!-- **Create a similar diagram** depicting the situation where the user creates a new note on the page <https://studies.cs.helsinki.fi/exampleapp/notes> by writing something into the text field and clicking the <i>submit</i> button.-->

**创建一个类似的图表** 来展示当用户在页面 <https://studies.cs.helsinki.fi/exampleapp/notes>  写了一些内容，创建了一个新的笔记，并点击了 <i>提交</i> 按钮发生的情况。

![diagram](https://i.imgur.com/vz1D7n6.png)

![相似图表](https://i.imgur.com/RjU6XfV.png)

<!-- If necessary, show operations on the browser or on the server as comments on the diagram.-->
如果有必要，请在浏览器或服务器上的操作以图表的注释的形式展示。

<!-- The diagram does not have to be a sequence diagram. Any sensible way of presenting the events is fine.-->
图表不一定非得是时序图。任何合理的表示事件的方式都可以。

<!-- All necessary information for doing this, and the next two exercises, can be found in the text of [this part](/en/part0/fundamentals_of_web_apps#forms-and-http-post).-->
所有必要的信息以及接下来的两个练习，都可以在[这章节](/en/part0/fundamentals_of_web_apps#forms-and-http-post)的文本中找到。
<!-- The idea of these exercises is to read the text through once more and to think through what is going on there. Reading the application [code](https://github.com/mluukkai/example_app) is not necessary, but it is of course possible.-->
这些练习的想法是再次阅读文本，思考里面发生了什么。阅读应用[代码](https://github.com/mluukkai/example_app)并不是必选项。

<!-- You can do the diagrams with any program, but perhaps the easiest and the best way to do diagrams is the [Mermaid](https://github.com/mermaid-js/mermaid#sequence-diagram-docs---live-editor) syntax that is now implemented in [GitHub](https://github.blog/2022-02-14-include-diagrams-markdown-files-mermaid/) Markdown pages!-->
你可以用任何程序来做图表，但也许最简单、最好的方式是现在在[GitHub](https://github.blog/2022-02-14-include-diagrams-markdown-files-mermaid/) Markdown 页面中实现的[Mermaid](https://github.com/mermaid-js/mermaid#sequence-diagram-docs---live-editor)语法！

<!--   <h4>0.5: Single page app diagram</h4>-->

<h4>0.5：单页应用程序图</h4>

<!-- Create a diagram depicting the situation where the user goes to the [single-page app](/en/part0/fundamentals_of_web_apps#single-page-app) version of the notes app at <https://studies.cs.helsinki.fi/exampleapp/spa>.-->
创建一个图表描述用户访问[单页应用程序](/en/part0/fundamentals_of_web_apps#single-page-app)版本的笔记应用程序的情况，网址为<https://studies.cs.helsinki.fi/exampleapp/spa>。

<!--   <h4>0.6: New note in Single page app diagram</h4>-->
<h4>0.6：单页应用程序图中的新笔记</h4>

<!-- Create a diagram depicting the situation where the user creates a new note using the single-page version of the app.-->

创建一个图来展示当用户利用单页版本的应用创建一个新笔记所发生的情况。

![图片](https://i.imgur.com/DpvFjgT.png)

<!-- This was the last exercise, and it's time to push your answers to GitHub and mark the exercises as done in the [submission system](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).-->
这是最后一个练习，现在是时候把你的答案推送到GitHub，并在[提交系统](https://studies.cs.helsinki.fi/stats/courses/fullstackopen)中标记为已完成。

</div>
