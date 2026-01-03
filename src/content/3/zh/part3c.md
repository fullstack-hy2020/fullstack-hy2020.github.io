---
mainImage: ../../../images/part-3.svg
part: 3
letter: c
lang: zh
---

<div class="content">

<!-- Before we move into the main topic of persisting data in a database, we will take a look at a few different ways of debugging Node applications. -->
在我们开始主题——在数据库中持久化保存数据之前，我们先来看一下调试 Node 应用的几种不同方法。

<!-- ### Debugging Node applications -->
### 调试 Node 程序

<!-- Debugging Node applications is slightly more difficult than debugging JavaScript running in your browser. Printing to the console is a tried and true method, and it's always worth doing. Some people think that more sophisticated methods should be used instead, but I disagree. Even the world's elite open-source developers [use](https://tenderlovemaking.com/2016/02/05/i-am-a-puts-debuggerer.html) this [method](https://swizec.com/blog/javascript-debugging-slightly-beyond-consolelog/). -->
调试 Node 应用比调试浏览器中运行的 JavaScript 稍微困难一些。打印到控制台是一种经实践检验的方法，永远值得这么做。有些人认为应该使用更优雅的方法，但我不同意。即使是世界上的精英开源开发者也[使用](https://tenderlovemaking.com/2016/02/05/i-am-a-puts-debuggerer.html)这种[方法](https://swizec.com/blog/javascript-debugging-slightly-beyond-consolelog/)。

#### Visual Studio Code

<!-- The Visual Studio Code debugger can be useful in some situations. You can launch the application in debugging mode like this (in this and the next few images, the notes have a field _date_ which has been removed from the current version of the application): -->
在某些情况下，Visual Studio Code 的调试器会很有用。你可以像这样以调试模式启动应用（在这张图片和接下来几张图片中，笔记有一个在当前版本的应用中已删除的 _date_ 字段）：

![截图显示如何在 vscode 中启动调试器](../../images/3/35x.png)

<!-- Note that the application shouldn't be running in another console, otherwise the port will already be in use. -->
注意，不应该在另一个控制台中运行应用，否则会占用端口。

<!-- __NB__ A newer version of Visual Studio Code may have _Run_ instead of _Debug_. Furthermore, you may have to configure your _launch.json_ file to start debugging. This can be done by choosing _Add Configuration..._ on the drop-down menu, which is located next to the green play button and above _VARIABLES_ menu, and select _Run "npm start" in a debug terminal_. For more detailed setup instructions, visit Visual Studio Code's [Debugging documentation](https://code.visualstudio.com/docs/editor/debugging). -->
__注__ 新版的 Visual Studio Code 可能用的是_运行_而非_调试_。此外，你可能需要配置 _launch.json_ 文件来开始调试。你可以通过在绿色播放按钮旁边，_变量_菜单上方的下拉菜单中选择_添加配置…_，然后选择_在调试终端运行“npm start”_来进行配置。更详细的设置说明参见 Visual Studio Code 的[调试文档](https://code.visualstudio.com/docs/editor/debugging)。

<!-- Below you can see a screenshot where the code execution has been paused in the middle of saving a new note: -->
下面的截图显示代码在保存新笔记的中途已暂停执行：

![断点处执行的vscode屏幕截图](../../images/3/36x.png)

<!-- The execution stopped at the <i>breakpoint</i> in line 69. In the console, you can see the value of the <i>note</i> variable. In the top left window, you can see other things related to the state of the application. -->
代码执行在第 69 行的<i>断点</i>处停止。在控制台中，你可以看到 <i>note</i> 变量的值。在左上角的窗口中，你可以看到应用状态的其他相关信息。

<!-- The arrows at the top can be used for controlling the flow of the debugger. -->
顶部的箭头可以用于控制调试器的流程。

<!-- For some reason, I don't use the Visual Studio Code debugger a whole lot. -->
出于某种原因，我并不经常使用 Visual Studio Code 的调试器。

#### Chrome dev tools

<!-- Debugging is also possible with the Chrome developer console by starting your application with the command: -->
通过以下命令启动应用，也可以使用 Chrome 开发者控制台进行调试：

```bash
node --inspect index.js
```

<!-- You can access the debugger by clicking the green icon - the node logo - that appears in the Chrome developer console: -->
你可以通过点击 Chrome 开发者控制台中的绿色图标——Node 的 logo——来访问调试器：

![带有绿色node标志图标的开发者工具](../../images/3/37.png)

<!-- The debugging view works the same way as it did with React applications. The <i>Sources</i> tab can be used for setting breakpoints where the execution of the code will be paused. -->
调试界面的用法与调试 React 应用时的用法相同。可以在<i>源代码</i>选项卡中设置断点，代码将在断点处暂停执行。

![开发者工具的 Sources 选项卡，包含断点和监视变量](../../images/3/38eb.png)

<!-- All of the application's <i>console.log</i> messages will appear in the <i>Console</i> tab of the debugger. You can also inspect values of variables and execute your own JavaScript code. -->
应用所有的 <i>console.log</i> 消息都将出现在调试器的<i>控制台</i>选项卡中。你还可以检查变量的值并执行自己的 JavaScript 代码。

![开发者工具的控制台选项卡显示输入的笔记对象](../../images/3/39ea.png)

<!-- #### Question everything -->
#### 怀疑一切

<!-- Debugging Full Stack applications may seem tricky at first. Soon our application will also have a database in addition to the frontend and backend, and there will be many potential areas for bugs in the application. -->
调试全栈应用一开始可能看起来很棘手。我们的应用除了前端和后端之外，很快还将又有一个数据库，应用中将有许多可能出现问题的地方。

<!-- When the application "does not work", we have to first figure out where the problem actually occurs. It's very common for the problem to exist in a place where you didn't expect it, and it can take minutes, hours, or even days before you find the source of the problem. -->
当应用“无法运行”时，我们首先必须找出问题实际发生在哪里。问题往往存在于你意想不到的地方，并且可能要几分钟、几小时甚至几天才能找到问题的根源。

<!-- The key is to be systematic. Since the problem can exist anywhere, <i>you must question everything</i>, and eliminate all possibilities one by one. Logging to the console, Postman, debuggers, and experience will help. -->
关键是要有条不紊。由于问题可能存在于任何地方，<i>你必须怀疑一切</i>，逐个排除所有可能性。记录到控制台，借助 Postman、调试器和经验都会有所帮助。

<!-- When bugs occur, <i>the worst of all possible strategies</i> is to continue writing code. It will guarantee that your code will soon have even more bugs, and debugging them will be even more difficult. The [Jidoka](https://leanscape.io/principles-of-lean-13-jidoka/) (stop and fix) principle from Toyota Production Systems is very effective in this situation as well. -->
当出现错误时，<i>所有策略中最差的</i>就是继续编写代码。这么做保证会让你的代码很快有更多的错误，并且更难以调试。丰田生产体系的[自动化](https://leanscape.io/principles-of-lean-13-jidoka/)（停止和修复）原则在这种情况下也非常有效。

### MongoDB

<!-- To store our saved notes indefinitely, we need a database. Most of the courses taught at the University of Helsinki use relational databases. In most parts of this course, we will use [MongoDB](https://www.mongodb.com/) which is a [document database](https://en.wikipedia.org/wiki/Document-oriented_database). -->
为了永久存储我们保存的笔记，我们需要一个数据库。赫尔辛基大学教授的大多数课程使用的都是关系数据库。在本课程的大部分章节中，我们将使用 [MongoDB](https://www.mongodb.com/)，这是一种[文档数据库](https://en.wikipedia.org/wiki/Document-oriented_database)。

<!-- The reason for using Mongo as the database is its lower complexity compared to a relational database. [Part 13](/en/part13) of the course shows how to build Node.js backends that use a relational database. -->
使用 Mongo 作为数据库的原因是它相对于关系数据库来说更简单。本课程的[第 13 章节](/zh/part13)展示了如何构建使用关系数据库的 Node.js 后端。

<!-- Document databases differ from relational databases in how they organize data as well as in the query languages they support. Document databases are usually categorized under the [NoSQL](https://en.wikipedia.org/wiki/NoSQL) umbrella term. -->
文档数据库与关系数据库在数据组织方式和支持的查询语言方面有所不同。文档数据库通常被归类为 [NoSQL](https://en.wikipedia.org/wiki/NoSQL) 的范畴。

<!-- You can read more about document databases and NoSQL from the course material for [week 7](https://tikape-s18.mooc.fi/part7/) of the Introduction to Databases course. Unfortunately, the material is currently only available in Finnish. -->
你可以从 Introduction to Databases 课程[第 7 周](https://tikape-s18.mooc.fi/part7/)的教材中了解更多文档数据库和 NoSQL 的信息。不幸的是，该教材目前只有芬兰语。

<!-- Read now the chapters on [collections](https://docs.mongodb.com/manual/core/databases-and-collections/) and [documents](https://docs.mongodb.com/manual/core/document/) from the MongoDB manual to get a basic idea of how a document database stores data. -->
现在阅读 MongoDB 手册中关于[集合](https://docs.mongodb.com/manual/core/databases-and-collections/)和[文档](https://docs.mongodb.com/manual/core/document/)的章节，对文档数据库是如何存储数据的有一个基本概念。

<!-- Naturally, you can install and run MongoDB on your computer. However, the internet is also full of Mongo database services that you can use. Our preferred MongoDB provider in this course will be [MongoDB Atlas](https://www.mongodb.com/atlas/database). -->
当然，你可以在你自己的电脑上安装并运行 MongoDB。然而，互联网上也有许多可以利用的 Mongo 数据库服务。在本课程中，我们首选的 MongoDB 提供商是 [MongoDB Atlas](https://www.mongodb.com/atlas/database)。

<!-- Once you've created and logged into your account, let's create a new cluster using the button visible on the front page. From the view that opens, select the free plan, determine the cloud provider and data center, and create the cluster: -->
创建你的帐户并登录后，让我们用首页上的按钮新建一个集群。在打开的页面中，选择免费计划，决定云服务提供商和数据中心，然后创建集群：

![选择共享、AWS 和区域的 MongoDB](../../images/3/mongo2.png)

<!-- The provider selected is <i>AWS</i> and the region is <i>Stockholm (eu-north-1)</i>. Note that if you choose something else, your database connection string will be slightly different from this example. Wait for the cluster to be ready, which will take a few minutes. -->
这里选择的云服务提供商是 <i>AWS</i>，地区是<i>斯德哥尔摩（eu-north-1）</i>。注意如果你选择了其他选项，你的数据库连接字符串会与本例中的略有不同。等待集群准备就绪。这可能需要几分钟时间。

<!-- **NB** do not continue before the cluster is ready. -->
**注** 在集群准备就绪之前，先不要继续阅读。

<!-- Let's use the <i>security</i> tab for creating user credentials for the database. Please note that these are not the same credentials you use for logging into MongoDB Atlas. These will be used for your application to connect to the database. -->
让我们使用 <i>security</i> 选项卡创建数据库的用户凭据。请注意，这些凭据不同于登录 MongoDB Atlas 的凭据。这些凭据是用来将你的应用连接到数据库的。

![mongodb security quickstart](../../images/3/mongo3.png)

<!-- Next, we have to define the IP addresses that are allowed access to the database. For the sake of simplicity we will allow access from all IP addresses: -->
接下来，我们需要定义允许访问数据库的 IP 地址。为简单起见，我们将允许所有 IP 地址访问：

![MongoDB 网络访问/添加 IP 访问列表](../../images/3/mongo4.png)

<!-- Note: In case the modal menu is different for you, according to MongoDB documentation, adding 0.0.0.0 as an IP allows access from anywhere as well. -->
注：如果你的对话框菜单不同，根据 MongoDB 文档，将 0.0.0.0 添加为 IP 地址也会允许从任何地方访问。

<!-- Finally, we are ready to connect to our database. To do this, we need the database connection string, which can be found by selecting <i>Connect</i> and then <i>Drivers</i> from the view, under the <i>Connect to your application</i> section: -->
终于，我们准备好连接到我们的数据库了。要连接到数据库，我们需要数据库连接字符串，在界面中选择 <i>Connect</i>，然后选择 <i>Drivers</i>，数据库连接字符串就在 <i>Connect to your application</i> 一节中：

![MongoDB 数据库部署连接](../../images/3/mongo5.png)

<!-- The view displays the <i>MongoDB URI</i>, which is the address of the database that we will supply to the MongoDB client library we will add to our application. -->
界面显示了 <i>MongoDB URI</i>，这是我们要在应用中提供给 MongoDB 客户端库的数据库地址：

![MongoDB 连接应用](../../images/3/mongo6new.png)

<!-- The address looks like this: -->
地址类似这样：

```js
mongodb+srv://fullstack:thepasswordishere@cluster0.a5qfl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

<!-- We are now ready to use the database. -->
我们现在已经准备好使用数据库了。

<!-- We could use the database directly from our JavaScript code with the [official MongoDB Node.js driver](https://mongodb.github.io/node-mongodb-native/) library, but it is quite cumbersome to use. We will instead use the [Mongoose](http://mongoosejs.com/index.html) library that offers a higher-level API. -->
我们可以在我们的 JavaScript 代码中用 [MongoDB 官方 Node.js 驱动](https://mongodb.github.io/node-mongodb-native/)来直接使用数据库，但是这个驱动用起来相当麻烦。因此我们将使用 [Mongoose](http://mongoosejs.com/index.html) 库，它提供了一个更高级的 API。

<!-- Mongoose could be described as an <i>object document mapper</i> (ODM), and saving JavaScript objects as Mongo documents is straightforward with this library. -->
Mongoose 可以当作一个<i>对象文档映射器</i>（ODM，Object Document Mapper），使用这个库后，将 JavaScript 对象保存为 Mongo 文档就简单了。

<!-- Let's install Mongoose in our notes project backend: -->
让我们在笔记项目的后端中安装 Mongoose：

```bash
npm install mongoose
```

<!-- Let's not add any code dealing with Mongo to our backend just yet. Instead, let's make a practice application by creating a new file, <i>mongo.js</i> in the root of the notes backend application: -->
暂时先不要在后端添加任何与 Mongo 相关的代码。让我们先在笔记后端应用的根目录下新建一个文件<i>mongo.js</i>来创建一个练习应用：

```js
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.a5qfl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'HTML is easy',
  important: true,
})

note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})
```

<!-- **NB:** Depending on which region you selected when building your cluster, the <i>MongoDB URI</i> may be different from the example provided above. You should verify and use the correct URI that was generated from MongoDB Atlas. -->
**注：**根据你在构建集群时选择的地区，<i>MongoDB URI</i> 可能会与上面提供的示例不同。你应该验证并使用从 MongoDB Atlas 生成的正确 URI。

<!-- The code also assumes that it will be passed the password from the credentials we created in MongoDB Atlas, as a command line parameter. We can access the command line parameter like this: -->
代码还假定我们在 MongoDB Atlas 中创建的凭据的密码将通过命令行参数传入。我们可以像这样访问命令行参数：

```js
const password = process.argv[2]
```

<!-- When the code is run with the command <i>node mongo.js yourPassword</i>, Mongo will add a new document to the database. -->
当使用命令 <i>node mongo.js yourPassword</i> 运行代码时，Mongo 将向数据库添加一个新文档。

<!-- **NB:** Please note the password is the password created for the database user, not your MongoDB Atlas password.  Also, if you created a password with special characters, then you'll need to [URL encode that password](https://docs.atlas.mongodb.com/troubleshoot-connection/#special-characters-in-connection-string-password). -->
**注：**请注意这里的密码是为数据库用户创建的密码，而不是 MongoDB Atlas 的密码。此外，如果你创建的密码带有特殊字符，那么你需要[用 URL 编码该密码](https://docs.atlas.mongodb.com/troubleshoot-connection/#special-characters-in-connection-string-password)。

<!-- We can view the current state of the database from the MongoDB Atlas from <i>Browse collections</i>, in the Database tab. -->
我们可以从 MongoDB Atlas 的 Database 选项卡的 <i>Browse Collections</i> 中查看数据库的当前状态。

![MongoDB 数据库浏览集合按钮](../../images/3/mongo7.png)

<!-- As the view states, the <i>document</i> matching the note has been added to the <i>notes</i> collection in the <i>myFirstDatabase</i> database. -->
正如视图所示，与笔记匹配的<i>文档</i>已添加到 <i>myFirstDatabase</i> 数据库中的 <i>notes</i> 集合中。

![MongoDB 集合选项卡 db myfirst app notes](../../images/3/mongo8new.png)

<!-- Let's destroy the default database <i>test</i> and change the name of the database referenced in our connection string to <i>noteApp</i> instead, by modifying the URI: -->
让我们删除默认的数据库 <i>test</i>，并将连接字符串引用的数据库的名称更改为 <i>noteApp</i>，将 URI 改成：

```js
const url = `mongodb+srv://fullstack:${password}@cluster0.a5qfl.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`
```

<!-- Let's run our code again: -->
让我们再次运行我们的代码：

![mongodb collections tab noteApp notes](../../images/3/mongo9.png)

<!-- The data is now stored in the right database. The view also offers the <i>create database</i> functionality, that can be used to create new databases from the website. Creating a database like this is not necessary, since MongoDB Atlas automatically creates a new database when an application tries to connect to a database that does not exist yet. -->
数据现在存储在正确的数据库中。该界面还提供了 <i>create database</i> 功能，用于从网站新建数据库。没有必要这样新建数据库，因为当应用尝试连接到一个尚不存在的数据库时，MongoDB Atlas 会自动新建一个数据库。

<!-- ### Schema -->
### 模式

<!-- After establishing the connection to the database, we define the [schema](http://mongoosejs.com/docs/guide.html) for a note and the matching [model](http://mongoosejs.com/docs/models.html): -->
在建立数据库的连接后，我们定义了笔记的[模式](http://mongoosejs.com/docs/guide.html)和对应的[模型](http://mongoosejs.com/docs/models.html)：

```js
const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)
```

<!-- First, we define the [schema](http://mongoosejs.com/docs/guide.html) of a note that is stored in the _noteSchema_ variable. The schema tells Mongoose how the note objects are to be stored in the database. -->
首先，我们定义了笔记的[模式](http://mongoosejs.com/docs/guide.html)并存储在 _noteSchema_ 变量中。该模式告诉 Mongoose 笔记对象是怎么存储在数据库中的。

<!-- In the _Note_ model definition, the first <i>"Note"</i> parameter is the singular name of the model. The name of the collection will be the lowercase plural <i>notes</i>, because the [Mongoose convention](http://mongoosejs.com/docs/models.html) is to automatically name collections as the plural (e.g. <i>notes</i>) when the schema refers to them in the singular (e.g. <i>Note</i>). -->
在 _Note_ 模型定义中，第一个<i>“Note”</i>参数是模型单数形式的名称。集合的名称会是小写复数形式的 <i>notes</i>。这是因为 [Mongoose 的习惯](http://mongoosejs.com/docs/models.html)是当模式以单数形式（如 <i>Note</i>）引用集合时，会自动将集合命名为其复数形式（如 <i>notes</i>）。

<!-- Document databases like Mongo are <i>schemaless</i>, meaning that the database itself does not care about the structure of the data that is stored in the database. It is possible to store documents with completely different fields in the same collection. -->
像 Mongo 这样的文档数据库是<i>无模式的</i>，这意味着数据库本身并不关心数据库中存储的数据的结构。可以在同一集合中存储字段完全不同的文档。

<!-- The idea behind Mongoose is that the data stored in the database is given a <i>schema at the level of the application</i> that defines the shape of the documents stored in any given collection. -->
Mongoose 的思想是，<i>在应用层面</i>给定数据库中存储的数据的<i>模式</i>，来定义存储在任何给定集合中的文档的形状。

<!-- ### Creating and saving objects -->
### 创建和保存对象

<!-- Next, the application creates a new note object with the help of the <i>Note</i> [model](https://mongoosejs.com/docs/models.html): -->
接下来，应用借助 <i>Note</i> [模型](https://mongoosejs.com/docs/models.html)创建一个新的笔记对象：

```js
const note = new Note({
  content: 'HTML is Easy',
  important: false,
})
```

<!-- Models are <i>constructor functions</i> that create new JavaScript objects based on the provided parameters. Since the objects are created with the model's constructor function, they have all the properties of the model, which include methods for saving the object to the database. -->
模型是根据提供的参数创建新的 JavaScript 对象的<i>构造函数</i>。由于对象是用模型的构造函数创建的，因此它们具有模型的所有属性，包括将对象保存到数据库的方法。

<!-- Saving the object to the database happens with the appropriately named _save_ method, which can be provided with an event handler with the _then_ method: -->
将对象保存到数据库使用顾名思义的 _save_ 方法，可以通过 _then_ 方法为 _save_ 方法提供一个事件处理函数：

```js
note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})
```

<!-- When the object is saved to the database, the event handler provided to _then_  gets called. The event handler closes the database connection with the command <code>mongoose.connection.close()</code>. If the connection is not closed, the connection remains open until the program terminates. -->
当对象保存到数据库时，会调用提供给 _then_ 的事件处理函数。事件处理函数使用命令 <code>mongoose.connection.close()</code> 关闭数据库连接。如果不关闭连接，那么在程序结束之前，连接将一直打开。

<!-- The result of the save operation is in the _result_ parameter of the event handler. The result is not that interesting when we're storing one object in the database. You can print the object to the console if you want to take a closer look at it while implementing your application or during debugging. -->
保存操作的结果在事件处理函数的 _result_ 参数中。当我们在数据库中存储一个对象时，保存操作的结果没什么有趣的。如果你想在实现应用或在调试时仔细查看它，可以将对象打印到控制台。

<!-- Let's also save a few more notes by modifying the data in the code and by executing the program again. -->
让我们修改代码中的数据并再次执行程序来保存更多的笔记。

<!-- **NB:** Unfortunately the Mongoose documentation is not very consistent, with parts of it using callbacks in its examples and other parts, other styles, so it is not recommended to copy and paste code directly from there. Mixing promises with old-school callbacks in the same code is not recommended. -->
**注：**不幸的是，Mongoose 的文档并不非常一致，部分文档在示例中使用回调函数，其他部分使用其他风格，因此不建议直接从那里复制和粘贴代码。不建议在同一份代码中混合使用 Promise 和传统的回调。

<!-- ### Fetching objects from the database -->
### 从数据库中获取对象

<!-- Let's comment out the code for generating new notes and replace it with the following: -->
让我们注释掉生成新笔记的代码，并用以下内容替换它：

```js
Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})
```

<!-- When the code is executed, the program prints all the notes stored in the database: -->
当代码执行时，程序会打印出数据库中存储的所有笔记：

![node mongo.js outputs notes as JSON](../../images/3/70new.png)

<!-- The objects are retrieved from the database with the [find](https://mongoosejs.com/docs/api/model.html#model_Model-find) method of the _Note_ model. The parameter of the method is an object expressing search conditions. Since the parameter is an empty object<code>{}</code>, we get all of the notes stored in the _notes_ collection. -->
对象是通过 _Note_ 模型的 [find](https://mongoosejs.com/docs/api/model.html#model_Model-find) 方法从数据库中获取的。find 方法的参数是一个表示搜索条件的对象。由于参数是一个空对象<code>{}</code>，我们得到了 _notes_ 集合中存储的所有笔记。

<!-- The search conditions adhere to the Mongo search query [syntax](https://www.mongodb.com/zh-cn/docs/manual/tutorial/query-documents/). -->
搜索条件遵循 Mongo 的搜索查询[语法](https://www.mongodb.com/zh-cn/docs/manual/tutorial/query-documents/)。

<!-- We could restrict our search to only include important notes like this: -->
我们可以这么限制我们的搜索，使其只包含重要的笔记：

```js
Note.find({ important: true }).then(result => {
  // ...
})
```

</div>

<div class="tasks">

<!-- ### Exercise 3.12. -->
### 练习 3.12.

<!-- #### 3.12: Command-line database -->
#### 3.12：命令行数据库

<!-- Create a cloud-based MongoDB database for the phonebook application with MongoDB Atlas. -->
使用 MongoDB Atlas 为电话簿应用创建一个基于云的 MongoDB 数据库。

<!-- Create a <i>mongo.js</i> file in the project directory, that can be used for adding entries to the phonebook, and for listing all of the existing entries in the phonebook. -->
在项目目录中创建一个<i>mongo.js</i>文件，用于向电话簿添加记录，以及列出电话簿中所有已有的记录。

<!-- **NB:** Do not include the password in the file that you commit and push to GitHub! -->
**注意：**不要在你提交和推送到 GitHub 的文件中包含密码！

<!-- The application should work as follows. You use the program by passing three command-line arguments (the first is the password), e.g.: -->
应用应该实现下列功能。你通过传递三个命令行参数（第一个是密码）来使用程序，例如：

```bash
node mongo.js yourpassword Anna 040-1234556
```

<!-- As a result, the application will print: -->
运行后，应用将打印：

```bash
added Anna number 040-1234556 to phonebook
```

<!-- The new entry to the phonebook will be saved to the database. Notice that if the name contains whitespace characters, it must be enclosed in quotes: -->
新的电话簿记录将被保存到数据库中。注意如果名字包含空格字符，就必须用引号引起来：

```bash
node mongo.js yourpassword "Arto Vihavainen" 045-1232456
```

<!-- If the password is the only parameter given to the program, meaning that it is invoked like this: -->
如果密码是给程序的唯一参数，也就是这样调用：

```bash
node mongo.js yourpassword
```

<!-- Then the program should display all of the entries in the phonebook: -->
那么程序应该显示电话簿中的所有记录：

```
phonebook:
Anna 040-1234556
Arto Vihavainen 045-1232456
Ada Lovelace 040-1231236
```

<!-- You can get the command-line parameters from the [process.argv](https://nodejs.org/docs/latest-v18.x/api/process.html#process_process_argv) variable. -->
你可以从 [process.argv](https://nodejs.org/docs/latest-v18.x/api/process.html#process_process_argv) 变量获取命令行参数。

<!-- **NB: do not close the connection in the wrong place**. E.g. the following code will not work: -->
**注意：不要在错误的地方关闭连接**。例如，以下代码将无法正确运行：

```js
Person
  .find({})
  .then(persons=> {
    // ...
  })

mongoose.connection.close()
```

<!-- In the code above the <i>mongoose.connection.close()</i> command will get executed immediately after the <i>Person.find</i> operation is started. This means that the database connection will be closed immediately, and the execution will never get to the point where <i>Person.find</i> operation finishes and the <i>callback</i> function gets called. -->
在上面的代码中，<i>mongoose.connection.close()</i> 命令将在 <i>Person.find</i> 操作开始后立即执行。这会立即关闭数据库连接，从而永远不会执行到 <i>Person.find</i> 操作完成并调用<i>回调</i>函数的地方。

<!-- The correct place for closing the database connection is at the end of the callback function: -->
关闭数据库连接的正确位置是在回调函数的末尾：

```js
Person
  .find({})
  .then(persons=> {
    // ...
    mongoose.connection.close()
  })
```

<!-- **NB:** If you define a model with the name <i>Person</i>, mongoose will automatically name the associated collection as <i>people</i>. -->
**注意：**如果你将模型的名字定义为 <i>Person</i>，mongoose 会自动将关联的集合命名为 <i>people</i>。

</div>

<div class="content">

<!-- ### Connecting the backend to a database -->
### 将后端连接到数据库

<!-- Now we have enough knowledge to start using Mongo in our notes application backend. -->
现在我们已经有足够的知识来在我们笔记应用的后端开始使用 Mongo。

<!-- Let's get a quick start by copy-pasting the Mongoose definitions to the <i>index.js</i> file: -->
让我们通过将 Mongoose 的定义复制粘贴到 <i>index.js</i> 文件来快速开始：

```js
const mongoose = require('mongoose')

// DO NOT SAVE YOUR PASSWORD TO GITHUB!!
const password = process.argv[2]
const url = `mongodb+srv://fullstack:${password}@cluster0.a5qfl.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)
```

<!-- Let's change the handler for fetching all notes to the following form: -->
让我们将处理获取所有笔记的函数改成：

```js
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})
```

<!-- Let's start the backend with the command <code>node --watch index.js yourpassword</code> so we can verify in the browser that the backend correctly displays all notes saved to the database: -->
让我们用命令 <code>node --watch index.js yourpassword</code> 启动后端，于是我们可以在浏览器中验证后端是否正确显示所有保存到数据库中的笔记：

![api/notes in browser shows notes in JSON](../../images/3/44ea.png)

<!-- The application works almost perfectly. The frontend assumes that every object has a unique id in the <i>id</i> field. We also don't want to return the mongo versioning field <i>\_\_v</i> to the frontend. -->
应用几乎完美地运行。只是前端假定每个对象都有的一个唯一 id 是在 <i>id</i> 字段中。我们也不想将 mongo 的版本控制字段 <i>\_\_v</i> 返回给前端。

<!-- One way to format the objects returned by Mongoose is to [modify](https://stackoverflow.com/questions/7034848/mongodb-output-id-instead-of-id) the _toJSON_ method of the schema, which is used on all instances of the models produced with that schema. Modification can be done as follows: -->
更改 Mongoose 返回对象的格式的一种方法是[修改](https://stackoverflow.com/questions/7034848/mongodb-output-id-instead-of-id)模式的 _toJSON_ 方法，该方法应用于该模式产生的所有模型的所有实例。可以这么修改：
  
```js
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
```

<!-- Even though the <i>\_id</i> property of Mongoose objects looks like a string, it is in fact an object. The _toJSON_ method we defined transforms it into a string just to be safe. If we didn't make this change, it would cause more harm to us in the future once we start writing tests. -->
尽管 Mongoose 对象的 <i>\_id</i> 属性看起来像一个字符串，但它实际上是一个对象。我们定义的 _toJSON_ 方法将其转换成字符串以确保安全。如果我们不这么改的话，一旦将来我们开始编写测试，对象形式的 *\_id* 属性就会给我们带来更大的危害。

<!-- No changes are needed in the handler: -->
处理函数不需要更改：

```js
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})
```

<!-- The code automatically uses the defined _toJSON_ when formatting notes to the response. -->
代码在将笔记格式化为响应的格式时会自动使用定义的 _toJSON_ 方法。

<!-- ### Moving db configuration to its own module -->
### 将数据库配置移到自己的模块

<!-- Before we refactor the rest of the backend to use the database, let's extract the Mongoose-specific code into its own module. -->
在我们将后端的其余部分重构为使用数据库之前，让我们先将 Mongoose 特定的代码提取到它自己的模块中。

<!-- Let's create a new directory for the module called <i>models</i>, and add a file called <i>note.js</i>: -->
让我们为模块新建一个名为 <i>models</i> 的目录，并添加一个名为 <i>note.js</i> 的文件：

```js
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI // highlight-line

console.log('connecting to', url)
mongoose.connect(url)
// highlight-start
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })
// highlight-end

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema) // highlight-line
```

<!-- There are some changes in the code compared to before. The database connection URL is now passed to the application via the MONGODB_URI environment variable, as hardcoding it into the application is not a good idea: -->
代码与之前相比有一些变化。数据库连接 URL 现在通过 MONGODB_URI 环境变量传递给应用，因为将其硬编码到应用中并不明智：

```js
const url = process.env.MONGODB_URI
```

<!-- There are many ways to define the value of an environment variable. For example, we can define it when starting the application as follows: -->
有许多方法定义环境变量的值。例如，我们可以在启动应用时定义：

```bash
MONGODB_URI="your_connection_string_here" npm run dev
```

<!-- We will soon learn a more sophisticated way to define environment variables. -->
我们稍后会学习一种更优雅的定义环境变量的方法。

<!-- The way that the connection is made has changed slightly: -->
建立连接的方式略有变化：

```js
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })
```

<!-- The method for establishing the connection is now given functions for dealing with a successful and unsuccessful connection attempt. Both functions just log a message to the console about the success status: -->
建立连接的方法现在有了处理连接成功和失败的函数。两个函数都只是将连接成功与否的消息记录到控制台：

![node output when wrong username/password](../../images/3/45e.png)

<!-- Defining Node [modules](https://nodejs.org/docs/latest-v18.x/api/modules.html) differs slightly from the way of defining [ES6 modules](/en/part2/rendering_a_collection_modules#refactoring-modules) in part 2. -->
定义 Node [模块](https://nodejs.org/docs/latest-v18.x/api/modules.html)的方式与在第 2 章节中定义 [ES6 模块](/zh/part2/渲染集合与模块#重构模块)的方式略有不同。

<!-- The public interface of the module is defined by setting a value to the _module.exports_ variable. We will set the value to be the <i>Note</i> model. The other things defined inside of the module, like the variables _mongoose_ and _url_ will not be accessible or visible to users of the module. -->
模块的公共接口是通过设定 _module.exports_ 变量的值来定义的。我们将值设置为 <i>Note</i> 模型。在模块内部定义的其他东西，如变量 _mongoose_ 和 _url_，对模块的用户而言将不可访问，也不可见。

<!-- Importing the module happens by adding the following line to <i>index.js</i>: -->
导入模块是通过在 <i>index.js</i> 中添加下面这一行来实现的：

```js
const Note = require('./models/note')
```

<!-- This way the _Note_ variable will be assigned to the same object that the module defines. -->
这样，_Note_ 变量将被赋值为模块定义的同一个对象。

<!-- ### Defining environment variables using the dotenv library -->
### 使用 dotenv 库定义环境变量

<!-- A more sophisticated way to define environment variables is to use the [dotenv](https://github.com/motdotla/dotenv#readme) library. You can install the library with the command: -->
一种更优雅地定义环境变量的方法是使用 [dotenv](https://github.com/motdotla/dotenv#readme) 库。你可以用以下命令安装这个库：

```bash
npm install dotenv
```

<!-- To use the library, we create a <i>.env</i> file at the root of the project. The environment variables are defined inside of the file, and it can look like this: -->
要使用这个库，我们要在项目的根目录下创建一个 <i>.env</i> 文件。环境变量在这个文件内定义，可以类似这样：

```bash
MONGODB_URI=mongodb+srv://fullstack:thepasswordishere@cluster0.a5qfl.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0
PORT=3001
```

<!-- We also added the hardcoded port of the server into the <em>PORT</em> environment variable. -->
我们也将硬编码的服务端端口添加到 <em>PORT</em> 环境变量中。

<!-- **The <i>.env</i> file should be gitignored right away since we do not want to publish any confidential information publicly online!** -->
**应当立即将 <i>.env</i> 文件添加到 .gitignore 中，不要把任何秘密信息发布到网上！**

![.gitignore in vscode with .env line added](../../images/3/45ae.png)

<!-- The environment variables defined in the <i>.env</i> file can be taken into use with the expression <em>require('dotenv').config()</em> and you can reference them in your code just like you would reference normal environment variables, with the <em>process.env.MONGODB_URI</em> syntax. -->
<i>.env</i> 文件中定义的环境变量可以通过表达式 <em>require('dotenv').config()</em> 导入，然后你在代码中就可以像引用普通环境变量一样，用 <em>process.env.MONGODB_URI</em> 语法引用它们。

<!-- Let's load the environment variables at the beginning of the index.js file so that they are available throughout the entire application. Let's change the <i>index.js</i> file in the following way: -->
让我们在 index.js 文件的开头导入环境变量，这样就可以在整个应用中使用环境变量了。让我们将 <i>index.js</i> 文件更改为：

```js
require('dotenv').config() // highlight-line
const express = require('express')
const Note = require('./models/note') // highlight-line

const app = express()
// ..

const PORT = process.env.PORT // highlight-line
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

<!-- It's important that <i>dotenv</i> gets imported before the <i>note</i> model is imported. This ensures that the environment variables from the <i>.env</i> file are available globally before the code from the other modules is imported. -->
重要的是 <i>dotenv</i> 要在 <i>note</i> 模型之前导入。这能确保在导入其他模块的代码之前，<i>.env</i> 文件中的环境变量在全局范围内（译注：包括其他导入的模块内）都可用。

<!-- #### Important note about defining environment variables in Fly.io and Render -->
#### 关于在 Fly.io 和 Render 中定义环境变量的重要注意事项

<!-- **Fly.io users:** Because GitHub is not used with Fly.io, the file .env also gets to the Fly.io servers when the app is deployed. Because of this, the env variables defined in the file will be available there. -->
**Fly.io 用户：**因为 Fly.io 不与 GitHub 一起使用，所以当部署应用时，.env 文件也会传到 Fly.io 服务器上。因此，文件中定义的环境变量在 Fly.io 也可用。

<!-- However, a [better option](https://community.fly.io/t/clarification-on-environment-variables/6309) is to prevent .env from being copied to Fly.io by creating in the project root the file _.dockerignore_, with the following contents -->
然而，[更好的选择](https://community.fly.io/t/clarification-on-environment-variables/6309)是通过在项目根目录创建 _.dockerignore_ 文件来防止 .env 被复制到 Fly.io，*.dockerignore* 的内容如下

```bash
.env
```

<!-- and set the env value from the command line with the command: -->
并在命令行用以下命令设置环境变量的值：

```bash
fly secrets set MONGODB_URI="mongodb+srv://fullstack:thepasswordishere@cluster0.a5qfl.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0"
```

<!-- **Render users:** When using Render, the database url is given by defining the proper env in the dashboard: -->
**Render 用户：**在使用Render时，数据库 URL 通过在仪表板中定义适当的环境变量提供：

![browser showing render environment variables](../../images/3/render-env.png)

<!-- Set just the URL starting with <i>mongodb+srv://...</i> to the _value_ field. -->
只需将 _value_ 字段设为以 <i>mongodb+srv://</i> 开头的 URL。

<!-- ### Using database in route handlers -->
### 在路由处理函数中使用数据库

<!-- Next, let's change the rest of the backend functionality to use the database. -->
接下来，让我们将后端的其余功能更改为使用数据库。

<!-- Creating a new note is accomplished like this: -->
创建新的笔记可以这样完成：

```js
app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })
})
```

<!-- The note objects are created with the _Note_ constructor function. The response is sent inside of the callback function for the _save_ operation. This ensures that the response is sent only if the operation succeeded. We will discuss error handling a little bit later. -->
笔记对象是用 _Note_ 构造函数创建的。响应是在 _save_ 操作的回调函数内发送的。这确保只有在操作成功时才发送响应。我们稍后会讨论如何处理错误。

<!-- The _savedNote_ parameter in the callback function is the saved and newly created note. The data sent back in the response is the formatted version created automatically with the _toJSON_ method: -->
回调函数中的 _savedNote_ 参数是保存的新创建的笔记。响应中发送回来的数据是用 _toJSON_ 方法自动创建的格式化版本：

```js
response.json(savedNote)
```

<!-- Using Mongoose's [findById](https://mongoosejs.com/docs/api/model.html#model_Model-findById) method, fetching an individual note gets changed into the following: -->
通过使用 Mongoose 的 [findById](https://mongoosejs.com/docs/api/model.html#model_Model-findById) 方法，获取单个笔记的操作变为以下形式：

```js
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(note => {
    response.json(note)
  })
})
```

<!-- ### Verifying frontend and backend integration -->
### 验证前后端的整合

<!-- When the backend gets expanded, it's a good idea to test the backend first with **the browser, Postman or the VS Code REST client**. Next, let's try creating a new note after taking the database into use: -->
当后端扩展后，首先使用**浏览器、Postman 或 VS Code REST Client** 测试后端是明智的。接下来，让我们在启用数据库后尝试创建一个新的笔记：

![VS code rest client doing a post](../../images/3/46new.png)

<!-- Only once everything has been verified to work in the backend, is it a good idea to test that the frontend works with the backend. It is highly inefficient to test things exclusively through the frontend. -->
只有在后端的所有内容都经过验证并正确运行后，才是测试前端与后端是否协同工作的时候。仅通过前端进行测试效率极低。

<!-- It's probably a good idea to integrate the frontend and backend one functionality at a time. First, we could implement fetching all of the notes from the database and test it through the backend endpoint in the browser. After this, we could verify that the frontend works with the new backend. Once everything seems to be working, we would move on to the next feature. -->
逐个集成前后端的功能可能是个好主意。首先，我们可以实现从数据库获取所有笔记的功能，然后在浏览器中通过后端端点进行测试。然后，我们可以验证前端是否能与新的后端一起正确运行。一旦所有东西看起来都正确，我们就可以继续下一个功能。

<!-- Once we introduce a database into the mix, it is useful to inspect the state persisted in the database, e.g. from the control panel in MongoDB Atlas. Quite often little Node helper programs like the <i>mongo.js</i> program we wrote earlier can be very helpful during development. -->
一旦我们引入数据库，查看数据库中持久化的状态是非常有用的，比如通过 MongoDB Atlas 的控制面板查看。在开发过程中，小型 Node 辅助程序，比如我们之前写的 <i>mongo.js</i>，往往非常有帮助。

<!-- You can find the code for our current application in its entirety in the <i>part3-4</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-4). -->
你可以在[这个 GitHub 仓库](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-4)的 <i>part3-4</i> 分支中找到我们当前应用的完整代码。

<!-- ### A true full stack developer's oath -->
### 真正的全栈开发者的誓言

<!-- It is again time for the exercises. The complexity of our app has now taken another step since besides frontend and backend we also have a database.  -->
现在又是练习的时候了。我们的应用的复杂性现在又上升了一个阶段，因为除了前端和后端，我们还有一个数据库。
<!-- There are indeed really many potential sources of error. -->
的确有很多可能的错误来源。

<!-- So we should once more extend our oath: -->
所以我们应该再次扩展我们的誓言：

<!-- Full stack development is <i> extremely hard</i>, that is why I will use all the possible means to make it easier -->
全栈开发<i>极其困难</i>，因此我会尽一切可能使其变得更容易

<!-- - I will have my browser developer console open all the time -->
- 我会始终打开浏览器的开发者控制台
<!-- - I will use the network tab of the browser dev tools to ensure that frontend and backend are communicating as I expect -->
- 我会使用浏览器开发者工具的网络标签页，确保前后端按预期通信
<!-- - I will constantly keep an eye on the state of the server to make sure that the data sent there by the frontend is saved there as I expect -->
- 我会持续留意服务端的状态，确保前端发送的数据按预期保存
<!-- - <i>I will keep an eye on the database: does the backend save data there in the right format</i> -->
- <i>我会留意数据库：后端是否以正确的格式保存数据</i>
<!-- - I progress with small steps -->
- 我小步前进
<!-- - I will write lots of _console.log_ statements to make sure I understand how the code behaves and to help pinpoint problems -->
- 我会写大量的 _console.log_ 语句，以确保我理解代码的行为，并借此定位问题
<!-- - If my code does not work, I will not write more code. Instead, I start deleting the code until it works or just return to a state when everything was still working -->
- 如果我的代码不能正确运行，我不会写更多的代码。相反，我会开始删除代码直到它能正确运行，或者直接回到一切都还正常的状态
<!-- - When I ask for help in the course Discord channel or elsewhere I formulate my questions properly, see [here](https://fullstackopen.com/en/part0/general_info#how-to-get-help-in-discord) how to ask for help -->
- 当我在课程的 Discord 频道或其他地方寻求帮助时，我会恰当地陈述我的问题，参见[这里](https://fullstackopen.com/en/part0/general_info#how-to-get-help-in-discord)了解如何寻求帮助

</div>

<div class="tasks">

<!-- ### Exercises 3.13.-3.14. -->
### 练习 3.13.~3.14.

<!-- The following exercises are pretty straightforward, but if your frontend stops working with the backend, then finding and fixing the bugs can be quite interesting. -->
以下练习相当简单，但如果你的前端无法与后端一起运行，那么寻找并修复错误的过程可能会相当有趣。

<!-- #### 3.13: Phonebook database, step 1 -->
#### 3.13：电话簿数据库，第 1 步

<!-- Change the fetching of all phonebook entries so that the data is <i>fetched from the database</i>. -->
将获取所有电话簿记录的方式更改为<i>从数据库中获取</i>数据。

<!-- Verify that the frontend works after the changes have been made. -->
在更改后，验证前端是否依然正确运行。

<!-- In the following exercises, write all Mongoose-specific code into its own module, just like we did in the chapter [Database configuration into its own module](/en/part3/saving_data_to_mongo_db#moving-db-configuration-to-its-own-module). -->
在接下来的练习中，将所有 Mongoose 特定的代码写入其自己的模块，就像我们在[将数据库配置到自己的模块](/zh/part3/将数据存入_mongo_db#将数据库配置移到自己的模块)一章中做的那样。

<!-- #### 3.14: Phonebook database, step 2 -->
#### 3.14：电话簿数据库，第 2 步

<!-- Change the backend so that new numbers are <i>saved to the database</i>. Verify that your frontend still works after the changes. -->
更改后端，使新的号码<i>保存到数据库中</i>。在更改后，验证前端是否依然正确运行。

<!-- At this stage, you can ignore whether there is already a person in the database with the same name as the person you are adding. -->
在这个阶段，你可以先不考虑数据库中是否已经有一个人与你要添加的人同名的情况。

</div>

<div class="content">

<!-- ### Error handling -->
### 错误处理

<!-- If we try to visit the URL of a note with an id that does not exist e.g. <http://localhost:3001/api/notes/5c41c90e84d891c15dfa3431> where <i>5c41c90e84d891c15dfa3431</i> is not an id stored in the database, then the response will be _null_. -->
如果我们尝试访问一个不存在的笔记的 URL，例如 <http://localhost:3001/api/notes/5c41c90e84d891c15dfa3431>，其中 <i>5c41c90e84d891c15dfa3431</i> 不是存储在数据库中的 id，那么响应将为 _null_ 。

<!-- Let's change this behavior so that if a note with the given id doesn't exist, the server will respond to the request with the HTTP status code 404 not found. In addition let's implement a simple <em>catch</em> block to handle cases where the promise returned by the <em>findById</em> method is <i>rejected</i>: -->
让我们改变这种行为，如果给定 id 的笔记不存在，服务器将以 HTTP 状态码 404 not found 来响应请求。此外，让我们实现一个简单的 <em>catch</em> 块来处理 <em>findById</em> 方法返回的 Promise <i>被拒绝</i>的情况：

```js
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id)
    .then(note => {
      // highlight-start
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
      // highlight-end
    })
    // highlight-start
    .catch(error => {
      console.log(error)
      response.status(500).end()
    })
    // highlight-end
})
```

<!-- If no matching object is found in the database, the value of _note_ will be _null_ and the _else_ block is executed. This results in a response with the status code <i>404 not found</i>. If a promise returned by the <em>findById</em> method is rejected, the response will have the status code <i>500 internal server error</i>. The console displays more detailed information about the error. -->
如果数据库中没有找到匹配的对象，_note_ 的值将为 _null_ 并执行 _else_ 块。这将导致响应状态码 <i>404 not found</i>。如果 <em>findById</em> 方法返回的 Promise 被拒绝，响应的状态码将是 <i>500 internal server error</i>。控制台会显示更详细的错误信息。

<!-- On top of the non-existing note, there's one more error situation that needs to be handled. In this situation, we are trying to fetch a note with the wrong kind of _id_, meaning an _id_ that doesn't match the Mongo identifier format. -->
除了不存在的笔记，还有一个需要处理的错误情况。在这种情况下，我们试图获取一个错误类型的 _id_，也就是说，_id_ 与 Mongo 的标识符 *_id* 的格式不匹配。

<!-- If we make the following request, we will get the error message shown below: -->
如果我们发出以下请求，我们将得到下面的错误消息：

```
Method: GET
Path:   /api/notes/someInvalidId
Body:   {}
---
{ CastError: Cast to ObjectId failed for value "someInvalidId" at path "_id"
    at CastError (/Users/mluukkai/opetus/_fullstack/osa3-muisiinpanot/node_modules/mongoose/lib/error/cast.js:27:11)
    at ObjectId.cast (/Users/mluukkai/opetus/_fullstack/osa3-muisiinpanot/node_modules/mongoose/lib/schema/objectid.js:158:13)
    ...
```

<!-- Given a malformed id as an argument, the <em>findById</em> method will throw an error causing the returned promise to be rejected. This will cause the callback function defined in the <em>catch</em> block to be called. -->
如果给出一个格式错误的 id 作为参数，<em>findById</em> 方法将抛出错误，导致返回的 Promise 被拒绝。这会调用 <em>catch</em> 块中定义的回调函数。

<!-- Let's make some small adjustments to the response in the <em>catch</em> block: -->
让我们对 <em>catch</em> 块中的响应做一些小调整：

```js
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end() 
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' }) // highlight-line
    })
})
```

<!-- If the format of the id is incorrect, then we will end up in the error handler defined in the _catch_ block. The appropriate status code for the situation is [400 Bad Request](https://www.rfc-editor.org/rfc/rfc9110.html#name-400-bad-request) because the situation fits the description perfectly: -->
如果 id 的格式不正确，那么我们会以在 _catch_ 块中定义的错误处理程序结束。适合这种情况的状态码是 [400 Bad Request](https://www.rfc-editor.org/rfc/rfc9110.html#name-400-bad-request)，因为这种情况完全符合其描述：

<!-- > <i>The 400 (Bad Request) status code indicates that the server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).</i> -->
> <i>400（Bad Request）状态码表示服务器不能或不会处理请求，因为服务端认为某些东西是客户端错误（例如，请求语法格式错误、请求消息帧格式无效，或请求路由欺骗）。</i>

<!-- We have also added some data to the response to shed some light on the cause of the error. -->
我们还在响应中添加了一些数据，以便解释错误的原因。

<!-- When dealing with Promises, it's almost always a good idea to add error and exception handling. Otherwise, you will find yourself dealing with strange bugs. -->
在处理 Promise 时，添加错误和异常处理几乎总是明智的。否则，你会发现自己在处理奇怪的错误。

<!-- It's never a bad idea to print the object that caused the exception to the console in the error handler: -->
在错误处理程序中打印引发异常的对象永远不会错：

```js
.catch(error => {
  console.log(error)  // highlight-line
  response.status(400).send({ error: 'malformatted id' })
})
```

<!-- The reason the error handler gets called might be something completely different than what you had anticipated. If you log the error to the console, you may save yourself from long and frustrating debugging sessions. Moreover, most modern services where you deploy your application support some form of logging system that you can use to check these logs. As mentioned, Fly.io is one. -->
导致错误处理程序被调用的原因可能完全不同于你所预期的。如果你将错误记录到控制台，你可能会从长时间令人沮丧的调试会话中解救出来。此外，大多数你部署应用的现代服务都支持某种形式的日志系统，你可以借此来检查这些日志。如前所述，Fly.io 就是其中之一。

<!-- Every time you're working on a project with a backend, <i>it is critical to keep an eye on the console output of the backend</i>. If you are working on a small screen, it is enough to just see a tiny slice of the output in the background. Any error messages will catch your attention even when the console is far back in the background: -->
每次你在处理一个有后端的项目时，<i>关注后端的控制台输出至关重要</i>。如果你的屏幕比较小，只需要在背景中看到一小部分输出就足够了。任何错误消息都会引起你的注意，即使控制台在很后面也如此：

![sample screenshot showing tiny slice of output](../../images/3/15b.png)

<!-- ### Moving error handling into middleware -->
### 将错误处理移至中间件

<!-- We have written the code for the error handler among the rest of our code. This can be a reasonable solution at times, but there are cases where it is better to implement all error handling in a single place. This can be particularly useful if we want to report data related to errors to an external error-tracking system like [Sentry](https://sentry.io/welcome/) later on. -->
我们在其他代码中编写了错误处理函数的代码。有些情况下这可能是一个合理的解决方案，但有些情况下，最好在一个地方实现所有的错误处理。如果我们后面想向诸如 [Sentry](https://sentry.io/welcome/) 这样的外部错误跟踪系统报告与错误相关的数据，这可能特别有用。

<!-- Let's change the handler for the <i>/api/notes/:id</i> route so that it passes the error forward with the <em>next</em> function. The next function is passed to the handler as the third parameter: -->
让我们更改 <i>/api/notes/:id</i> 路由的处理函数，使用 <em>next</em> 函数来传递错误。next 函数作为第三个参数传递给处理函数：

```js
app.get('/api/notes/:id', (request, response, next) => { // highlight-line
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error)) // highlight-line
})
```

<!-- The error that is passed forward is given to the <em>next</em> function as a parameter. If <em>next</em> was called without an argument, then the execution would simply move onto the next route or middleware. If the <em>next</em> function is called with an argument, then the execution will continue to the <i>error handler middleware</i>. -->
传递的错误作为参数传给 <em>next</em> 函数。如果调用 <em>next</em> 时没有传递参数，那么就将简单继续执行下一个路由或中间件。如果调用 <em>next</em> 函数时有一个参数，那么将继续执行<i>错误处理中间件</i>。

<!-- Express [error handlers](https://expressjs.com/en/guide/error-handling.html) are middleware that are defined with a function that accepts <i>four parameters</i>. Our error handler looks like this: -->
Express 的[错误处理函数](https://expressjs.com/en/guide/error-handling.html)是一个定义为接受<i>四个参数</i>的函数的中间件。我们的错误处理函数类似这样：

```js
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)
```

<!-- The error handler checks if the error is a <i>CastError</i> exception, in which case we know that the error was caused by an invalid object id for Mongo. In this situation, the error handler will send a response to the browser with the response object passed as a parameter. In all other error situations, the middleware passes the error forward to the default Express error handler. -->
错误处理函数检查错误是否为 <i>CastError</i> 异常，我们知道这个错误是由 Mongo 的无效对象 id 引起的。在这种情况下，错误处理函数将使用作为参数传递的 response 对象向浏览器发送响应。对于其他所有错误情况，中间件将错误传递给默认的 Express 错误处理函数。

<!-- Note that the error-handling middleware has to be the last loaded middleware, also all the routes should be registered before the error-handler! -->
注意，错误处理中间件必须是最后加载的中间件，并且所有的路由都应该在错误处理函数之前注册！

<!-- ### The order of middleware loading -->
### 加载中间件的顺序

<!-- The execution order of middleware is the same as the order that they are loaded into Express with the _app.use_ function. For this reason, it is important to be careful when defining middleware. -->
中间件的执行顺序与它们通过 _app.use_ 函数被加载到 Express 的顺序相同。因此，定义中间件时需要小心。

<!-- The correct order is the following: -->
正确的顺序是：

```js
app.use(express.static('dist'))
app.use(express.json())
app.use(requestLogger)

app.post('/api/notes', (request, response) => {
  const body = request.body
  // ...
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  // ...
}

// handler of requests with result to errors
app.use(errorHandler)
```

<!-- The json-parser middleware should be among the very first middleware loaded into Express. If the order was the following: -->
json-parser 中间件应该是最先加载到 Express 中的中间件。如果顺序是这样的话：

```js
app.use(requestLogger) // request.body is undefined!

app.post('/api/notes', (request, response) => {
  // request.body is undefined!
  const body = request.body
  // ...
})

app.use(express.json())
```

<!-- Then the JSON data sent with the HTTP requests would not be available for the logger middleware or the POST route handler, since the _request.body_ would be _undefined_ at that point. -->
那么，HTTP 请求发送的 JSON 数据在 logger 中间件和 POST 路由处理函数中都将不可用，因为这时 _request.body_ 还是 _undefined_。

<!-- It's also important that the middleware for handling unsupported routes is loaded only after all the endpoints have been defined, just before the error handler. For example, the following loading order would cause an issue: -->
同样重要的是，处理不支持的路由的中间件应当在定义完所有端点之后才加载，只在错误处理函数之前。例如，以下加载顺序会导致问题：

```js
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

app.get('/api/notes', (request, response) => {
  // ...
})
```

<!-- Now the handling of unknown endpoints is ordered <i>before the HTTP request handler</i>. Since the unknown endpoint handler responds to all requests with <i>404 unknown endpoint</i>, no routes or middleware will be called after the response has been sent by unknown endpoint middleware. The only exception to this is the error handler which needs to come at the very end, after the unknown endpoints handler. -->
现在，未知端点的处理是<i>在 HTTP 请求处理函数之前</i>进行的。由于未知端点处理函数对所有请求都以 <i>404 unknown endpoint</i> 响应，所以在未知端点中间件发送响应后，不会调用任何路由或中间件。唯一的例外是错误处理函数需要放在最后，在未知端点处理函数之后。

<!-- ### Other operations -->
### 其他操作

<!-- Let's add some missing functionality to our application, including deleting and updating an individual note. -->
让我们为我们的应用添加一些缺失的功能，包括删除和更新单个笔记。

<!-- The easiest way to delete a note from the database is with the [findByIdAndDelete](https://mongoosejs.com/docs/api/model.html#Model.findByIdAndDelete()) method: -->
从数据库删除笔记最简单的方法是使用 [findByIdAndDelete](https://mongoosejs.com/docs/api/model.html#Model.findByIdAndDelete()) 方法：

```js
app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})
```

<!-- In both of the "successful" cases of deleting a resource, the backend responds with the status code <i>204 no content</i>. The two different cases are deleting a note that exists, and deleting a note that does not exist in the database. The _result_ callback parameter could be used for checking if a resource was actually deleted, and we could use that information for returning different status codes for the two cases if we deem it necessary. Any exception that occurs is passed onto the error handler. -->
对于删除资源的两种“成功”情况，后端都以 <i>204 no content</i> 的状态码响应。这两种不同的情况是删除存在的笔记，和删除数据库中不存在的笔记。_result_ 回调参数可以用于检查是否实际删除了资源，并且如果我们认为有必要的话，我们也可以根据 _result_ 的信息为两种情况返回不同的状态码。任何发生的异常都会传递给错误处理函数。

<!-- Let's implement the functionality to update a single note, allowing the importance of the note to be changed. The note updating is done as follows: -->
让我们实现更新单条笔记的功能，允许更改笔记的重要性。更新笔记的功能实现如下：

```js
app.put('/api/notes/:id', (request, response, next) => {
  const { content, important } = request.body

  Note.findById(request.params.id)
    .then(note => {
      if (!note) {
        return response.status(404).end()
      }

      note.content = content
      note.important = important

      return note.save().then((updatedNote) => {
        response.json(updatedNote)
      })
    })
    .catch(error => next(error))
})
```

<!-- The note to be updated is first fetched from the database using the _findById_ method. If no object is found in the database with the given id, the value of the variable _note_ is _null_, and the query responds with the status code <i>404 Not Found</i>. -->
要更新的笔记首先通过 _findById_ 方法从数据库中获取。如果数据库中没有具有给定 id 的对象，变量 _note_ 的值将为 _null_，会以状态码 <i>404 Not Found</i> 响应查询。

<!-- If an object with the given id is found, its _content_ and _important_ fields are updated with the data provided in the request, and the modified note is saved to the database using the _save()_ method. The HTTP request responds by sending the updated note in the response. -->
如果找到了具有给定 id 的对象，会用请求中提供的数据更新对象的 _content_ 和 _important_ 字段，然后用 _save()_ 方法将修改后的笔记保存到数据库。最后发送更新后的笔记来响应 HTTP 请求。

<!-- One notable point is that the code now has nested promises, meaning that within the outer _.then_ method, another [promise chain](https://javascript.info/promise-chaining) is defined: -->
值得注意的一点是，代码现在包含嵌套的 Promise，在外层的 _.then_ 方法内部又定义了另一个 [Promise 链](https://javascript.info/promise-chaining)：

```js
    .then(note => {
      if (!note) {
        return response.status(404).end()
      }

      note.content = content
      note.important = important

      // highlight-start
      return note.save().then((updatedNote) => {
        response.json(updatedNote)
      })
      // highlight-end
```

<!-- Usually, this is not recommended because it can make the code difficult to read. In this case, however, the solution works because it ensures that the _.then_ block following the _save()_ method is only executed if a note with the given id is found in the database and the _save()_ method is called. In the fourth part of the course, we will explore the async/await syntax, which offers an easier and clearer way to handle such situations. -->
通常不推荐这样做，这会使代码难以阅读。然而这样做至少在本例中能正确运行，因为这样做能确保 _save()_ 方法之后的 _.then_ 块只有在数据库中找到了具有给定 id 的笔记并调用了 _save()_ 方法时才会执行。在本课程的第四章节，我们将学习 async/await 语法，来更简单、更清晰地处理这类情况。

<!-- After testing the backend directly with Postman or the VS Code REST client, we can verify that it seems to work. The frontend also appears to work with the backend using the database. -->
在直接使用 Postman 或 VS Code REST Client 测试后端后，我们可以验证它似乎能正确运行。前端也显示能与使用数据库的后端一起正确运行。

<!-- You can find the code for our current application in its entirety in the <i>part3-5</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-5). -->
你可以在[这个 GitHub 仓库](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-5)的 <i>part3-5</i> 分支中找到我们当前应用的完整代码。

</div>

<div class="tasks">

<!-- ### Exercises 3.15.-3.18. -->
### 练习 3.15.~3.18.

<!-- #### 3.15: Phonebook database, step 3 -->
#### 3.15：电话簿数据库，第 3 步

<!-- Change the backend so that deleting phonebook entries is reflected in the database. -->
更改后端，使得删除电话簿记录能在数据库中显示。

<!-- Verify that the frontend still works after making the changes. -->
在进行更改后，验证前端是否仍然正确运行。

<!-- #### 3.16: Phonebook database, step 4 -->
#### 3.16：电话簿数据库，第 4 步

<!-- Move the error handling of the application to a new error handler middleware. -->
将应用的错误处理移到新的错误处理中间件。

<!-- #### 3.17*: Phonebook database, step 5 -->
#### 3.17*：电话簿数据库，第 5 步

<!-- If the user tries to create a new phonebook entry for a person whose name is already in the phonebook, the frontend will try to update the phone number of the existing entry by making an HTTP PUT request to the entry's unique URL. -->
如果用户试图为姓名已存在于电话簿中的人创建新的电话簿记录，前端将尝试通过向记录的唯一 URL 发送 HTTP PUT 请求来更新现有记录的电话号码。

<!-- Modify the backend to support this request. -->
修改后端以支持这类请求。

<!-- Verify that the frontend works after making your changes. -->
在进行更改后，验证前端是否正确运行。

<!-- #### 3.18*: Phonebook database step 6 -->
#### 3.18*：电话簿数据库 第 6 步

<!-- Also update the handling of the <i>api/persons/:id</i> and <i>info</i> routes to use the database, and verify that they work directly with the browser, Postman, or VS Code REST client. -->
将 <i>api/persons/:id</i> 和 <i>info</i> 路由的处理也更新为使用数据库，并验证它们是否可以直接在浏览器、Postman 或 VS Code REST Client 上正确运行。

<!-- Inspecting an individual phonebook entry from the browser should look like this: -->
从浏览器查看单个电话簿记录应该类似这样：

![screenshot of browser showing one person with api/persons/their_id](../../images/3/49.png)

</div>
