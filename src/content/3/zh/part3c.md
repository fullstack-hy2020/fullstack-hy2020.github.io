---
mainImage: ../../../images/part-3.svg
part: 3
letter: c
lang: zh
---

<div class="content">

<!-- Before we move into the main topic of persisting data in a database, we will take a look at a few different ways of debugging Node applications.-->
在我们进入数据库中持久化数据的主要主题之前，我们将研究一下调试Node应用程序的几种不同方法。

### Debugging Node applications

<!-- Debugging Node applications is slightly more difficult than debugging JavaScript running in your browser. Printing to the console is a tried and true method, and it's always worth doing. Some people think that more sophisticated methods should be used instead, but I disagree. Even the world's elite open-source developers [use](https://tenderlovemaking.com/2016/02/05/i-am-a-puts-debuggerer.html) this [method](https://swizec.com/blog/javascript-debugging-slightly-beyond-consolelog/).-->
调试Node应用比调试在浏览器中运行的JavaScript稍微困难一些。打印到控制台是一种经过考验的方法，总是值得做的。有些人认为应该使用更复杂的方法，但我不同意。即使是世界级的开源开发人员也[使用](https://tenderlovemaking.com/2016/02/05/i-am-a-puts-debuggerer.html)这种[方法](https://swizec.com/blog/javascript-debugging-slightly-beyond-consolelog/)。

#### Visual Studio Code

<!-- The Visual Studio Code debugger can be useful in some situations. You can launch the application in debugging mode like this (in this and the next few images, the notes have a field _date_ which has been removed from the current version of the application):-->
Visual Studio Code 调试器在某些情况下可能很有用。你可以像这样启动应用程序以调试模式运行（在这和接下来的几张图片中，注释中有一个字段_date_，该字段已从当前版本的应用程序中删除）：

![screenshot showing how to launch debugger in vscode](../../images/3/35x.png)

<!-- Note that the application shouldn''t be running in another console, otherwise the port will already be in use.-->
**注意，应用程序不应该在另一个控制台中运行，否则端口将已经被使用。**

<!-- __NB__ A newer version of Visual Studio Code may have _Run_ instead of _Debug_. Furthermore, you may have to configure your _launch.json_ file to start debugging. This can be done by choosing _Add Configuration..._ on the drop-down menu, which is located next to the green play button and above _VARIABLES_ menu, and select _Run "npm start" in a debug terminal_. For more detailed setup instructions, visit Visual Studio Code''s [Debugging documentation](https://code.visualstudio.com/docs/editor/debugging).-->
__NB__ 可能会有比 _Debug_ 更新版本的 Visual Studio Code。此外，您可能需要配置 _launch.json_ 档案才能开始侦错。这可以通过在绿色播放按钮旁的下拉式功能表上选择 _Add Configuration..._，并在 _VARIABLES_ 功能表上方选择 _Run "npm start" in a debug terminal_ 来完成。有关更详细的设定说明，请访问 Visual Studio Code 的[侦错文档](https://code.visualstudio.com/docs/editor/debugging)。

<!-- Below you can see a screenshot where the code execution has been paused in the middle of saving a new note:-->
下面你可以看到一张截图，其中代码执行已经暂停，正在保存一条新笔记：

![vscode screenshot of execution at a breakpoint](../../images/3/36x.png)

<!-- The execution stopped at the <i>breakpoint</i> in line 69. In the console, you can see the value of the <i>note</i> variable. In the top left window, you can see other things related to the state of the application.-->
执行在第69行的<i>断点</i>处停止。在控制台中，你可以看到<i>note</i>变量的值。在左上角的窗口中，你可以看到与应用程序状态相关的其他内容。

<!-- The arrows at the top can be used for controlling the flow of the debugger.-->
顶部的箭头可用于控制调试器的流程。

<!-- For some reason, I don''t use the Visual Studio Code debugger a whole lot.-->
因为某种原因，我不怎么使用Visual Studio Code调试器。

#### Chrome dev tools

<!-- Debugging is also possible with the Chrome developer console by starting your application with the command:-->
使用Chrome开发者控制台也可以调试，通过使用命令启动您的应用程序：

```bash
node --inspect index.js
```

<!-- You can access the debugger by clicking the green icon - the node logo - that appears in the Chrome developer console:-->
你可以通过点击 Chrome 开发者控制台中出现的绿色图标——节点标志——来访问调试器：

![dev tools with green node logo icon](../../images/3/37.png)

<!-- The debugging view works the same way as it did with React applications. The <i>Sources</i> tab can be used for setting breakpoints where the execution of the code will be paused.-->
<i>调试视图</i>与 React 应用程序的使用方式相同。<i>源</i>标签可用于设置断点，其中代码的执行将被暂停。

![dev tools sources tab breakpoint and watch variables](../../images/3/38eb.png)

<!-- All of the application''s <i>console.log</i> messages will appear in the <i>Console</i> tab of the debugger. You can also inspect values of variables and execute your own JavaScript code.-->
所有应用程序的<i>console.log</i>消息都会出现在调试器的<i>控制台</i>选项卡中。您还可以检查变量的值并执行自己的JavaScript代码。

![dev tools console tab showing note object typed in](../../images/3/39ea.png)

#### Question everything

<!-- Debugging Full Stack applications may seem tricky at first. Soon our application will also have a database in addition to the frontend and backend, and there will be many potential areas for bugs in the application.-->
调试全栈应用程序起初可能会有些棘手。不久，我们的应用程序除了前端和后端之外，还将有一个数据库，应用程序中可能会有许多潜在的错误区域。

<!-- When the application "does not work", we have to first figure out where the problem actually occurs. It's very common for the problem to exist in a place where you didn't expect it to, and it can take minutes, hours, or even days before you find the source of the problem.-->
当应用程序“不起作用”时，我们必须首先弄清楚问题实际发生在哪里。问题存在于您意想不到的地方是很常见的，在找到问题的源头之前，可能需要几分钟、几小时甚至几天的时间。

<!-- The key is to be systematic. Since the problem can exist anywhere, <i>you must question everything</i>, and eliminate all possibilities one by one. Logging to the console, Postman, debuggers, and experience will help.-->
钥匙在于要系统化。由于问题可能无处不在，<i>你必须质疑一切</i>，并一个一个排除所有可能性。记录到控制台，Postman，调试器和经验将有所帮助。

<!-- When bugs occur, <i>the worst of all possible strategies</i> is to continue writing code. It will guarantee that your code will soon have even more bugs, and debugging them will be even more difficult. The [stop and fix](http://gettingtolean.com/toyota-principle-5-build-culture-stopping-fix/) principle from Toyota Production Systems is very effective in this situation as well.-->
当发生错误时，<i>最糟糕的策略</i>就是继续编写代码，这样可以确保你的代码很快就会有更多的错误，而调试它们会变得更加困难。来自丰田生产系统的[停止和修复](http://gettingtolean.com/toyota-principle-5-build-culture-stopping-fix/)原则在这种情况下也非常有效。

### MongoDB

<!-- To store our saved notes indefinitely, we need a database. Most of the courses taught at the University of Helsinki use relational databases. In most parts of this course, we will use [MongoDB](https://www.mongodb.com/) which is a so-called [document database](https://en.wikipedia.org/wiki/Document-oriented_database).-->
要永久存储我们保存的笔记，我们需要数据库。赫尔辛基大学教授的大多数课程都使用关系数据库。在本课程的大部分内容中，我们将使用[MongoDB](https://www.mongodb.com/)，这是一种所谓的[文档数据库](https://en.wikipedia.org/wiki/Document-oriented_database)。

<!-- The reason for using Mongo as the database is its lower complexity compared to a relational database. [Part 13](https://fullstackopen.com/en/part13) of the course shows how to build node.js backends that use a relational database.-->
使用Mongo作为数据库的原因是它比关系型数据库的复杂性要低。课程的第13部分展示了如何构建使用关系型数据库的Node.js后端。

<!-- Document databases differ from relational databases in how they organize data as well as in the query languages they support. Document databases are usually categorized under the [NoSQL](https://en.wikipedia.org/wiki/NoSQL) umbrella term.-->
文档数据库与关系数据库在数据组织方式以及支持的查询语言上有所不同。文档数据库通常被归类为[NoSQL](https://en.wikipedia.org/wiki/NoSQL)这一类别。

<!-- You can read more about document databases and NoSQL from the course material for [week 7](https://tikape-s18.mooc.fi/part7/) of the Introduction to Databases course. Unfortunately, the material is currently only available in Finnish.-->
你可以从[第七周](https://tikape-s18.mooc.fi/part7/)的《数据库概论》课程材料中阅读更多关于文档数据库和NoSQL的内容。不幸的是，目前这些材料仅有芬兰语版本。

<!-- Read now the chapters on [collections](https://docs.mongodb.com/manual/core/databases-and-collections/) and [documents](https://docs.mongodb.com/manual/core/document/) from the MongoDB manual to get a basic idea of how a document database stores data.-->
现在请阅读MongoDB手册中关于[集合](https://docs.mongodb.com/manual/core/databases-and-collections/)和[文档](https://docs.mongodb.com/manual/core/document/)章节，以获取文档数据库存储数据的基本概念。

<!-- Naturally, you can install and run MongoDB on your computer. However, the internet is also full of Mongo database services that you can use. Our preferred MongoDB provider in this course will be [MongoDB Atlas](https://www.mongodb.com/atlas/database).-->
自然，您可以在自己的计算机上安装和运行MongoDB。 但是，互联网上也有很多Mongo数据库服务可供您使用。 我们在本课程中推荐的MongoDB提供商是[MongoDB Atlas](https://www.mongodb.com/atlas/database)。

<!-- Once you''ve created and logged into your account, let us start by selecting the free option:-->
一旦您创建并登录账户，让我们从选择免费选项开始：

![mongodb deploy a cloud database free shared](../../images/3/mongo1.png)

<!-- Pick the cloud provider and location and create the cluster:-->
选择云提供商和位置，并创建集群：

![mongodb picking shared, aws and region](../../images/3/mongo2.png)

<!-- Let''s wait for the cluster to be ready for use. This can take some minutes.-->
让我们等待集群准备就绪，这可能需要几分钟。

<!-- **NB** do not continue before the cluster is ready.-->
**注意：**在集群准备就绪之前不要继续。

<!-- Let''s use the <i>security</i> tab for creating user credentials for the database. Please note that these are not the same credentials you use for logging into MongoDB Atlas. These will be used for your application to connect to the database.-->
让我们使用<i>安全性</i>标签来为数据库创建用户凭据。请注意，这些不是您用于登录MongoDB Atlas的凭据。这些将用于您的应用程序连接到数据库。

![mongodb security quickstart](../../images/3/mongo3.png)

<!-- Next, we have to define the IP addresses that are allowed access to the database. For the sake of simplicity we will allow access from all IP addresses:-->
接下来，我们必须定义允许访问数据库的IP地址。为了简单起见，我们将允许所有IP地址访问：

![mongodb network access/add ip access list](../../images/3/mongo4.png)

<!-- Note: In case the modal menu is different for you, according to MongoDB documentation, adding 0.0.0.0 as an IP allows access from anywhere as well.-->
**注意：如果您的模态菜单不同，根据MongoDB文档，添加0.0.0.0作为IP也可以从任何地方访问。**

<!-- Finally, we are ready to connect to our database. Start by clicking <i>connect</i>:-->
最后，我们准备好连接到我们的数据库了。点击<i>连接</i>开始：

![mongodb database deployment connect](../../images/3/mongo5.png)

<!-- and choose: <i>Connect your application</i>:-->
**连接您的应用程序**

![mongodb connect application](../../images/3/mongo6.png)

<!-- The view displays the <i>MongoDB URI</i>, which is the address of the database that we will supply to the MongoDB client library we will add to our application.-->
这个视图显示出<i>MongoDB URI</i>，它是我们将提供给我们应用程序中添加的MongoDB客户端库的数据库地址。

<!-- The address looks like this:-->
地址看起来像这样：

```js
mongodb+srv://fullstack:<password>@cluster0.o1opl.mongodb.net/?retryWrites=true&w=majority
```

<!-- We are now ready to use the database.-->
我们现在已经准备好使用数据库了。

<!-- We could use the database directly from our JavaScript code with the [official MongoDB Node.js driver](https://mongodb.github.io/node-mongodb-native/) library, but it is quite cumbersome to use. We will instead use the [Mongoose](http://mongoosejs.com/index.html) library that offers a higher-level API.-->
我们可以使用[官方MongoDB Node.js驱动程序](https://mongodb.github.io/node-mongodb-native/)库直接从JavaScript代码中使用数据库，但使用起来很麻烦。我们将使用[Mongoose](http://mongoosejs.com/index.html)库，它提供了更高级的API。

<!-- Mongoose could be described as an <i>object document mapper</i> (ODM), and saving JavaScript objects as Mongo documents is straightforward with this library.-->
Mongoose 可以被描述为一个 <i> 对象文档映射器 </i> (ODM)，使用这个库可以很容易地将 JavaScript 对象保存为 Mongo 文档。

<!-- Let''s install Mongoose in our notes project backend:-->
让我们在我们的笔记项目后端安装Mongoose：

```bash
npm install mongoose
```

<!-- Let's not add any code dealing with Mongo to our backend just yet. Instead, let's make a practice application by creating a new file, <i>mongo.js</i>:-->
不要现在就把处理Mongo的代码添加到我们的后端中。相反，让我们先创建一个新文件<i>mongo.js</i>来练习应用程序：

```js
const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.o1opl.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'HTML is Easy',
  important: true,
})

note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})
```

<!-- **NB:** Depending on which region you selected when building your cluster, the <i>MongoDB URI</i> may be different from the example provided above. You should verify and use the correct URI that was generated from MongoDB Atlas.-->
**注意：** 根据您在构建集群时选择的地区，<i>MongoDB URI</i>可能与上面提供的示例不同。您应该验证并使用MongoDB Atlas生成的正确URI。

<!-- The code also assumes that it will be passed the password from the credentials we created in MongoDB Atlas, as a command line parameter. We can access the command line parameter like this:-->
代码还假定它将从我们在MongoDB Atlas中创建的凭据中传递密码，作为命令行参数。我们可以像这样访问命令行参数：

```js
const password = process.argv[2]
```

<!-- When the code is run with the command <i>node mongo.js password</i>, Mongo will add a new document to the database.-->
当使用命令<i>node mongo.js password</i>运行代码时，Mongo将向数据库添加一个新文档。

<!-- **NB:** Please note the password is the password created for the database user, not your MongoDB Atlas password.  Also, if you created a password with special characters, then you''ll need to [URL encode that password](https://docs.atlas.mongodb.com/troubleshoot-connection/#special-characters-in-connection-string-password).-->
**注意：** 请注意，密码是为数据库用户创建的密码，而不是您的MongoDB Atlas密码。此外，如果您使用特殊字符创建了密码，则需要[URL编码该密码](https://docs.atlas.mongodb.com/troubleshoot-connection/#special-characters-in-connection-string-password)。

<!-- We can view the current state of the database from the MongoDB Atlas from <i>Browse collections</i>, in the Database tab.-->
我们可以从MongoDB Atlas的<i>浏览集合</i>，在数据库标签中查看数据库的当前状态。

![mongodb databases browse collections button](../../images/3/mongo7.png)

<!-- As the view states, the <i>document</i> matching the note has been added to the <i>notes</i> collection in the <i>myFirstDatabase</i> database.-->
根据此视图所述，笔记所对应的文件已添加到名为myFirstDatabase的数据库中的notes集合中。

![mongodb collections tab db myfirst app notes](../../images/3/mongo8new.png)

<!-- Let''s destroy the default database <i>test</i> and change the name of the database referenced in our connection string to <i>noteApp</i> instead, by modifying the URI:-->
让我们摧毁默认的数据库<i>test</i>，并将连接字符串中引用的数据库名称改为<i>noteApp</i>，通过修改URI来实现：

```js
const url =
  `mongodb+srv://fullstack:${password}@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority`
```

<!-- Let''s run our code again:-->
让我们再次运行我们的代码：

![mongodb collections tab noteApp notes](../../images/3/mongo9.png)

<!-- The data is now stored in the right database. The view also offers the <i>create database</i> functionality, that can be used to create new databases from the website. Creating a database like this is not necessary, since MongoDB Atlas automatically creates a new database when an application tries to connect to a database that does not exist yet.-->
数据现在存储在正确的数据库中。视图还提供<i>创建数据库</i>功能，可以用来从网站上创建新数据库。这样创建数据库是不必要的，因为MongoDB Atlas在应用程序尝试连接不存在的数据库时会自动创建一个新的数据库。

### Schema

<!-- After establishing the connection to the database, we define the [schema](http://mongoosejs.com/docs/guide.html) for a note and the matching [model](http://mongoosejs.com/docs/models.html):-->
在建立到数据库的连接后，我们为笔记定义[模式](http://mongoosejs.com/docs/guide.html)和匹配的[模型](http://mongoosejs.com/docs/models.html)：

```js
const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)
```

<!-- First, we define the [schema](http://mongoosejs.com/docs/guide.html) of a note that is stored in the _noteSchema_ variable. The schema tells Mongoose how the note objects are to be stored in the database.-->
首先，我们定义存储在_noteSchema_变量中的笔记的[模式](http://mongoosejs.com/docs/guide.html)。模式告诉Mongoose如何将笔记对象存储在数据库中。

<!-- In the _Note_ model definition, the first <i>"Note"</i> parameter is the singular name of the model. The name of the collection will be the lowercase plural <i>notes</i>, because the [Mongoose convention](http://mongoosejs.com/docs/models.html) is to automatically name collections as the plural (e.g. <i>notes</i>) when the schema refers to them in the singular (e.g. <i>Note</i>).-->
在_Note_模型定义中，第一个<i>"Note"</i>参数是模型的单数名称。集合的名称将是小写复数<i>notes</i>，因为[Mongoose约定](http://mongoosejs.com/docs/models.html)是在模式以单数（例如<i>Note</i>）引用它们时自动将集合命名为复数（例如<i>notes</i>）。

<!-- Document databases like Mongo are <i>schemaless</i>, meaning that the database itself does not care about the structure of the data that is stored in the database. It is possible to store documents with completely different fields in the same collection.-->
文档数据库，如Mongo，是<i>无模式的</i>，意味着数据库本身不关心存储在数据库中的数据的结构。可以在同一个集合中存储完全不同字段的文档。

<!-- The idea behind Mongoose is that the data stored in the database is given a <i>schema at the level of the application</i> that defines the shape of the documents stored in any given collection.-->
Mongoose 的理念在于，在应用程序层面给数据库中存储的数据定义一个<i>模式</i>，以定义任何给定集合中存储的文档的形状。

### Creating and saving objects

<!-- Next, the application creates a new note object with the help of the <i>Note</i> [model](http://mongoosejs.com/docs/models.html):-->
接下来，应用程序通过<i>Note</i>[模型](http://mongoosejs.com/docs/models.html)创建一个新的笔记对象：

```js
const note = new Note({
  content: 'HTML is Easy',
  important: false,
})
```

<!-- Models are so-called <i>constructor functions</i> that create new JavaScript objects based on the provided parameters. Since the objects are created with the model''s constructor function, they have all the properties of the model, which include methods for saving the object to the database.-->
模型是所谓的<i>构造函数</i>，根据提供的参数创建新的JavaScript对象。由于对象是使用模型的构造函数创建的，它们具有模型的所有属性，其中包括用于将对象保存到数据库的方法。

<!-- Saving the object to the database happens with the appropriately named _save_ method, which can be provided with an event handler with the _then_ method:-->
保存对象到数据库可以使用名称恰当的`_save_`方法，可以提供一个事件处理器，并使用`_then_`方法：

```js
note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})
```

<!-- When the object is saved to the database, the event handler provided to _then_  gets called. The event handler closes the database connection with the command <code>mongoose.connection.close()</code>. If the connection is not closed, the program will never finish its execution.-->
当对象保存到数据库时，提供的事件处理程序_then_将被调用。事件处理程序使用命令<code>mongoose.connection.close()</code>关闭数据库连接。如果连接没有关闭，程序永远不会完成其执行。

<!-- The result of the save operation is in the _result_ parameter of the event handler. The result is not that interesting when we''re storing one object in the database. You can print the object to the console if you want to take a closer look at it while implementing your application or during debugging.-->
结果保存操作存储在事件处理程序的_result_参数中。当我们在数据库中存储一个对象时，结果并不是很有趣。如果你想在实现应用程序或调试时更仔细地查看它，可以将对象打印到控制台。

<!-- Let''s also save a few more notes by modifying the data in the code and by executing the program again.-->
让我们通过修改代码中的数据以及再次执行程序来保存更多笔记。

<!-- **NB:** Unfortunately the Mongoose documentation is not very consistent, with parts of it using callbacks in its examples and other parts, other styles, so it is not recommended to copy and paste code directly from there. Mixing promises with old-school callbacks in the same code is not recommended.-->
**中文：**不幸的是，Mongoose文档不是很一致，有些部分使用回调在其示例中，其他部分使用其他样式，因此不建议直接复制粘贴代码。不建议在同一代码中混合使用承诺和旧式回调。

### Fetching objects from the database

<!-- Let''s comment out the code for generating new notes and replace it with the following:-->
让我们注释掉用于生成新笔记的代码，并用下面的代码替换它：

```js
Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})
```

<!-- When the code is executed, the program prints all the notes stored in the database:-->
当代码执行时，程序会打印出所有存储在数据库中的笔记：

![node mongo.js outputs notes as JSON](../../images/3/70new.png)

<!-- The objects are retrieved from the database with the [find](https://mongoosejs.com/docs/api/model.html#model_Model-find) method of the _Note_ model. The parameter of the method is an object expressing search conditions. Since the parameter is an empty object<code>{}</code>, we get all of the notes stored in the  _notes_ collection.-->
使用_Note_模型的[find](https://mongoosejs.com/docs/api/model.html#model_Model-find)方法从数据库中检索对象。该方法的参数是表达搜索条件的对象。由于参数是一个空对象<code>{}</code>，我们获得了存储在_notes_集合中的所有笔记。

<!-- The search conditions adhere to the Mongo search query [syntax](https://docs.mongodb.com/manual/reference/operator/).-->
搜索条件遵循 Mongo 搜索查询[语法](https://docs.mongodb.com/manual/reference/operator/)。

<!-- We could restrict our search to only include important notes like this:-->
我们可以限制搜索，只包括像这样的重要说明：

```js
Note.find({ important: true }).then(result => {
  // ...
})
```

</div>

<div class="tasks">

### Exercise 3.12.

#### 3.12: Command-line database

<!-- Create a cloud-based MongoDB database for the phonebook application with MongoDB Atlas.-->
利用MongoDB Atlas为电话簿应用程序创建一个基于云的MongoDB数据库。

<!-- Create a <i>mongo.js</i> file in the project directory, that can be used for adding entries to the phonebook, and for listing all of the existing entries in the phonebook.-->
在项目目录中创建一个<i>mongo.js</i>文件，用于向电话簿添加条目，以及列出电话簿中现有的所有条目。

<!-- **NB:** Do not include the password in the file that you commit and push to GitHub!-->
**不要在提交和推送到GitHub的文件中包含密码！**

<!-- The application should work as follows. You use the program by passing three command-line arguments (the first is the password), e.g.:-->
应用程序应该按照以下方式工作。您可以通过传递三个命令行参数（第一个是密码）来使用该程序，例如：

```bash
node mongo.js yourpassword Anna 040-1234556
```

<!-- As a result, the application will print:-->
结果，应用程序将打印：

```bash
added Anna number 040-1234556 to phonebook
```

<!-- The new entry to the phonebook will be saved to the database. Notice that if the name contains whitespace characters, it must be enclosed in quotes:-->
新的条目将被保存到数据库中。请注意，如果名字包含空格字符，必须用引号括起来：

```bash
node mongo.js yourpassword "Arto Vihavainen" 045-1232456
```

<!-- If the password is the only parameter given to the program, meaning that it is invoked like this:-->
`program_name password`

如果程序只被给予一个参数——密码，就像这样调用：

`程序名称 密码`

```bash
node mongo.js yourpassword
```

<!-- Then the program should display all of the entries in the phonebook:-->
然后程序应该显示电话簿中的所有条目：

<pre>
phonebook:
Anna 040-1234556
Arto Vihavainen 045-1232456
Ada Lovelace 040-1231236
</pre>

<!-- You can get the command-line parameters from the [process.argv](https://nodejs.org/docs/latest-v8.x/api/process.html#process_process_argv) variable.-->
你可以从[process.argv](https://nodejs.org/docs/latest-v8.x/api/process.html#process_process_argv)变量中获取命令行参数。

<!-- **NB: do not close the connection in the wrong place**. E.g. the following code will not work:-->
**不要在错误的地方关闭连接**。例如，以下代码将不起作用：

```js
Person
  .find({})
  .then(persons=> {
    // ...
  })

mongoose.connection.close()
```

<!-- In the code above the <i>mongoose.connection.close()</i> command will get executed immediately after the <i>Person.find</i> operation is started. This means that the database connection will be closed immediately, and the execution will never get to the point where <i>Person.find</i> operation finishes and the <i>callback</i> function gets called.-->
在上面的代码中，<i>mongoose.connection.close()</i> 命令会在<i>Person.find</i> 操作开始后立即执行。这意味着数据库连接将立即关闭，而执行将永远不会到达<i>Person.find</i> 操作完成并调用<i>callback</i> 函数的点。

<!-- The correct place for closing the database connection is at the end of the callback function:-->
正确关闭数据库连接的位置是在回调函数结束时。

```js
Person
  .find({})
  .then(persons=> {
    // ...
    mongoose.connection.close()
  })
```

<!-- **NB:** If you define a model with the name <i>Person</i>, mongoose will automatically name the associated collection as <i>people</i>.-->
如果你定义一个名为<i>Person</i>的模型，mongoose会自动将关联的集合命名为<i>people</i>。

</div>

<div class="content">

### Connecting the backend to a database

<!-- Now we have enough knowledge to start using Mongo in our notes application backend.-->
现在我们有足够的知识开始在我们的笔记应用后端使用Mongo了。

<!-- Let''s get a quick start by copy-pasting the Mongoose definitions to the <i>index.js</i> file:-->
让我们通过将Mongoose定义复制粘贴到<i>index.js</i>文件中来快速开始：

```js
const mongoose = require('mongoose')

// DO NOT SAVE YOUR PASSWORD TO GITHUB!!
const url =
  `mongodb+srv://fullstack:${password}@cluster0.o1opl.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)
```

<!-- Let''s change the handler for fetching all notes to the following form:-->
让我们把获取所有笔记的处理器改成以下形式：

```js
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})
```

<!-- We can verify in the browser that the backend works for displaying all of the documents:-->
我们可以在浏览器中验证后端可以用于显示所有文档：

![api/notes in browser shows notes in JSON](../../images/3/44ea.png)

<!-- The application works almost perfectly. The frontend assumes that every object has a unique id in the <i>id</i> field. We also don''t want to return the mongo versioning field <i>\_\_v</i> to the frontend.-->
应用程序几乎完美地运行。前端假设每个对象都有一个唯一的<i>id</i>字段。我们也不想将Mongo版本控制字段<i>\_\_v</i>返回给前端。

<!-- One way to format the objects returned by Mongoose is to [modify](https://stackoverflow.com/questions/7034848/mongodb-output-id-instead-of-id) the _toJSON_ method of the schema, which is used on all instances of the models produced with that schema.-->
一种格式化Mongoose返回的对象的方法是修改该模式的_toJSON_方法，该方法用于生成该模式的所有模型实例。[参考链接](https://stackoverflow.com/questions/7034848/mongodb-output-id-instead-of-id)

<!-- To modify the method we need to change the configurable options of the schema, options can be changed using the set method of the schema, see here for more info on this method: https://mongoosejs.com/docs/guide.html#options. See <https://mongoosejs.com/docs/guide.html#toJSON> and <https://mongoosejs.com/docs/api.html#document_Document-toObject> for more info on the _toJSON_ option.-->
要修改方法，我们需要更改模式的可配置选项，可以使用模式的set方法更改选项，有关此方法的更多信息，请参阅此处：<https://mongoosejs.com/docs/guide.html#options>。有关_toJSON_选项的更多信息，请参阅<https://mongoosejs.com/docs/guide.html#toJSON>和<https://mongoosejs.com/docs/api.html#document_Document-toObject>。

<!-- see <https://mongoosejs.com/docs/api/document.html#transform> for more info on the _transform_ function.-->
参见<https://mongoosejs.com/docs/api/document.html#transform>了解更多关于_transform_函数的信息。

```js
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
```

<!-- Even though the <i>\_id</i> property of Mongoose objects looks like a string, it is in fact an object. The _toJSON_ method we defined transforms it into a string just to be safe. If we didn''t make this change, it would cause more harm to us in the future once we start writing tests.-->
尽管Mongoose对象的<i>\_id</i>属性看起来像一个字符串，实际上它是一个对象。我们定义的_toJSON_方法将其转换为字符串以确保安全。如果我们不做这个改变，在我们开始编写测试时，将来会给我们带来更多的伤害。

<!-- No changes are needed in the handler:-->
没有需要对处理程序做出更改：

```js
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})
```

<!-- The code automatically uses the defined _toJSON_ when formatting notes to the response.-->
代码在格式化响应中的笔记时自动使用定义的_toJSON_。

### Database configuration into its own module

<!-- Before we refactor the rest of the backend to use the database, let''s extract the Mongoose-specific code into its own module.-->
在我们把后端的其余部分重构使用数据库之前，让我们把Mongoose特定的代码提取到自己的模块中。

<!-- Let''s create a new directory for the module called <i>models</i>, and add a file called <i>note.js</i>:-->
让我们为模块创建一个新的目录叫做<i>models</i>，并添加一个叫做<i>note.js</i>的文件：

```js
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI // highlight-line

console.log('connecting to', url) // highlight-line

mongoose.connect(url)
// highlight-start
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
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

<!-- Defining Node [modules](https://nodejs.org/docs/latest-v8.x/api/modules.html) differs slightly from the way of defining [ES6 modules](/en/part2/rendering_a_collection_modules#refactoring-modules) in part 2.-->
定义Node [模块](https://nodejs.org/docs/latest-v8.x/api/modules.html)与在第2部分定义[ES6模块](/en/part2/rendering_a_collection_modules#refactoring-modules)的方式略有不同。

<!-- The public interface of the module is defined by setting a value to the _module.exports_ variable. We will set the value to be the <i>Note</i> model. The other things defined inside of the module, like the variables _mongoose_ and _url_ will not be accessible or visible to users of the module.-->
模块的公共接口由将一个值设置到`_module.exports_`变量来定义。我们将该值设置为<i>Note</i>模型。模块内部定义的其他东西，比如变量`_mongoose_`和`_url_`，将不可访问或可见给模块的用户。

<!-- Importing the module happens by adding the following line to <i>index.js</i>:-->
在<i>index.js</i>中添加以下行以导入模块：

```js
const Note = require('./models/note')
```

<!-- This way the _Note_ variable will be assigned to the same object that the module defines.-->
这样，`Note`变量就会被分配给模块定义的同一个对象。

<!-- The way that the connection is made has changed slightly:-->
方式有稍微改变，连接被建立起来了：

```js
const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })
```

<!-- It''s not a good idea to hardcode the address of the database into the code, so instead the address of the database is passed to the application via the <em>MONGODB_URI</em> environment variable.-->
这不是一个好主意，将数据库的地址硬编码到代码中，所以把数据库的地址通过<em>MONGODB_URI</em>环境变量传递给应用程序。

<!-- The method for establishing the connection is now given functions for dealing with a successful and unsuccessful connection attempt. Both functions just log a message to the console about the success status:-->
方法用于建立连接现在提供了处理成功和不成功连接尝试的函数。两个函数只是将有关成功状态的消息记录到控制台：

![node output when wrong username/password](../../images/3/45e.png)

<!-- There are many ways to define the value of an environment variable. One way would be to define it when the application is started:-->
一种定义环境变量的方法是在应用程序启动时定义它：

```bash
MONGODB_URI=address_here npm run dev
```

<!-- A more sophisticated way is to use the [dotenv](https://github.com/motdotla/dotenv#readme) library. You can install the library with the command:-->
使用[dotenv](https://github.com/motdotla/dotenv#readme)库是一种更为复杂的方法。你可以使用以下命令安装该库：

```bash
npm install dotenv
```

<!-- To use the library, we create a <i>.env</i> file at the root of the project. The environment variables are defined inside of the file, and it can look like this:-->
在项目根目录下创建一个<i>.env</i>文件来使用库，环境变量定义在文件中，看起来可能像这样：

```bash
MONGODB_URI=mongodb+srv://fullstack:<password>@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority
PORT=3001
```

<!-- We also added the hardcoded port of the server into the <em>PORT</em> environment variable.-->
我们还将服务器的硬编码端口添加到<em>PORT</em>环境变量中。

<!-- **The <i>.env</i> file should be gitignored right away since we do not want to publish any confidential information publicly online!**-->
**立刻把<i>.env</i>文件加入到gitignore中，因为我们不想把任何机密信息公开上网！**

![.gitignore in vscode with .env line added](../../images/3/45ae.png)

<!-- The environment variables defined in the <i>.env</i> file can be taken into use with the expression <em>require('dotenv').config()</em> and you can reference them in your code just like you would reference normal environment variables, with the familiar <em>process.env.MONGODB_URI</em> syntax.-->
`.env` 文件中定义的环境变量可以通过表达式 `require('dotenv').config()` 使用，您可以像引用正常环境变量一样在代码中引用它们，使用熟悉的 `process.env.MONGODB_URI` 语法。

<!-- Let''s change the <i>index.js</i> file in the following way:-->
让我们以下面的方式更改<i>index.js</i>文件：

```js
require('dotenv').config() // highlight-line
const express = require('express')
const app = express()
const Note = require('./models/note') // highlight-line

// ..

const PORT = process.env.PORT // highlight-line
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

<!-- It''s important that <i>dotenv</i> gets imported before the <i>note</i> model is imported. This ensures that the environment variables from the <i>.env</i> file are available globally before the code from the other modules is imported.-->
<i>dotenv</i> 在 <i>note</i> 模型导入之前必须导入，这样可以确保从 <i>.env</i> 文件中获取的环境变量在其他模块的代码导入之前就可以全局访问。

### Important note to Fly.io users

<!-- Because GitHub is not used with Fly.io, the file .env also gets to the Fly.io servers when the app is deployed. Because of this, the env variables defined in the file will be available there.-->
因为GitHub不能与Fly.io一起使用，所以当应用部署时，文件.env也会传输到Fly.io服务器。因此，文件中定义的环境变量将在那里可用。

<!-- However, a [better option](https://community.fly.io/t/clarification-on-environment-variables/6309) is to prevent .env from being copied to Fly.io by creating in the project root the file _.dockerignore_, with the following contents-->
:

然而，[更好的选择](https://community.fly.io/t/clarification-on-environment-variables/6309)是通过在项目根目录创建文件 _.dockerignore_，其内容如下，来防止.env被复制到Fly.io：

```bash
.env
```

<!-- and set the env value from the command line with the command:-->
在命令行中使用以下命令设置env值：
`export ENV_VARIABLE_NAME=value`

在命令行中使用以下命令设置env值：
`export ENV_VARIABLE_NAME=value`

```bash
fly secrets set MONGODB_URI='mongodb+srv://fullstack:<password>@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority'
```

<!-- Since the PORT also is defined in our .env it is actually essential to ignore the file in Fly.io since otherwise the app starts in the wrong port.-->
由于PORT也在我们的.env中定义，因此在Fly.io中忽略该文件实际上是必不可少的，否则应用程序将以错误的端口启动。

<!-- When using Render, the database url is given by defining the proper env in the dashboard:-->
当使用Render时，可以通过在控制面板中定义正确的环境变量来提供数据库URL：

![browser showing render environment variables](../../images/3/render-env.png)

### Using database in route handlers

<!-- Next, let''s change the rest of the backend functionality to use the database.-->
接下来，让我们把后端的其余功能改用数据库。

<!-- Creating a new note is accomplished like this:-->
创建一个新笔记的方法是这样的：

```js
app.post('/api/notes', (request, response) => {
  const body = request.body

  if (body.content === undefined) {
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

<!-- The note objects are created with the _Note_ constructor function. The response is sent inside of the callback function for the _save_ operation. This ensures that the response is sent only if the operation succeeded. We will discuss error handling a little bit later.-->
使用_Note_构造函数创建笔记对象。 对_save_操作的响应被发送到回调函数中。 这确保只有在操作成功时才发送响应。 我们稍后会讨论错误处理。

<!-- The _savedNote_ parameter in the callback function is the saved and newly created note. The data sent back in the response is the formatted version created automatically with the _toJSON_ method:-->
回调函数中的_savedNote_参数是已保存的新创建的笔记。响应中发送的数据是使用_toJSON_方法自动创建的格式化版本。

```js
response.json(savedNote)
```

<!-- Using Mongoose''s [findById](https://mongoosejs.com/docs/api/model.html#model_Model-findById) method, fetching an individual note gets changed into the following:-->
使用Mongoose的[findById](https://mongoosejs.com/docs/api/model.html#model_Model-findById)方法，抓取单个笔记变为以下内容：

```js
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(note => {
    response.json(note)
  })
})
```

### Verifying frontend and backend integration

<!-- When the backend gets expanded, it's a good idea to test the backend first with **the browser, Postman or the VS Code REST client**. Next, let's try creating a new note after taking the database into use:-->
当后端被扩展时，最好先用**浏览器、Postman 或 VS Code REST 客户端**来测试后端。接下来，在使用数据库之后，我们尝试创建一个新笔记：

![VS code rest client doing a post](../../images/3/46new.png)

<!-- Only once everything has been verified to work in the backend, is it a good idea to test that the frontend works with the backend. It is highly inefficient to test things exclusively through the frontend.-->
只有在后端验证所有内容都可以正常工作之后，测试前端与后端的兼容性才是一个好主意。仅仅通过前端来测试是极其低效的。

<!-- It''s probably a good idea to integrate the frontend and backend one functionality at a time. First, we could implement fetching all of the notes from the database and test it through the backend endpoint in the browser. After this, we could verify that the frontend works with the new backend. Once everything seems to be working, we would move on to the next feature.-->
可能最好是一次只整合前端和后端的一个功能。首先，我们可以实现从数据库中获取所有笔记，并在浏览器中通过后端端点进行测试。之后，我们可以验证前端与新的后端是否能够正常工作。一切似乎都正常的时候，我们就可以继续进行下一个功能的实现了。

<!-- Once we introduce a database into the mix, it is useful to inspect the state persisted in the database, e.g. from the control panel in MongoDB Atlas. Quite often little Node helper programs like the <i>mongo.js</i> program we wrote earlier can be very helpful during development.-->
一旦我们将数据库引入，检查在数据库中持久化的状态就很有用，例如从MongoDB Atlas的控制面板中。通常，像我们之前编写的<i>mongo.js</i>程序这样的小型Node辅助程序在开发过程中非常有用。

<!-- You can find the code for our current application in its entirety in the <i>part3-4</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-4).-->
你可以在[这个GitHub仓库](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-4)的<i>part3-4</i>分支找到我们当前应用的完整代码。

</div>

<div class="tasks">

### Exercises 3.13.-3.14.

<!-- The following exercises are pretty straightforward, but if your frontend stops working with the backend, then finding and fixing the bugs can be quite interesting.-->
以下练习很直接，但是如果你的前端停止与后端工作，那么寻找和修复错误可能会很有趣。

#### 3.13: Phonebook database, step1

<!-- Change the fetching of all phonebook entries so that the data is <i>fetched from the database</i>.-->
改变所有电话簿条目的获取方式，使得数据<i>从数据库获取</i>。

<!-- Verify that the frontend works after the changes have been made.-->
验证在更改完成后前端是否正常工作。

<!-- In the following exercises, write all Mongoose-specific code into its own module, just like we did in the chapter [Database configuration into its own module](/en/part3/saving_data_to_mongo_db#database-configuration-into-its-own-module).-->
在下面的练习中，将所有Mongoose特定的代码写入其自己的模块，就像我们在[数据库配置到其自己的模块](/en/part3/saving_data_to_mongo_db#database-configuration-into-its-own-module)章节中所做的那样。

#### 3.14: Phonebook database, step2

<!-- Change the backend so that new numbers are <i>saved to the database</i>. Verify that your frontend still works after the changes.-->
改变后端以便新的数字<i>被保存到数据库</i>中。确认你的前端在改变后仍然有效。

<!-- At this stage, you can ignore whether there is already a person in the database with the same name as the person you are adding.-->
在这个阶段，你可以忽略数据库中是否已经有一个与要添加的人同名的人。

</div>

<div class="content">

### Error handling

<!-- If we try to visit the URL of a note with an id that does not exist e.g. <http://localhost:3001/api/notes/5c41c90e84d891c15dfa3431> where <i>5c41c90e84d891c15dfa3431</i> is not an id stored in the database, then the response will be _null_.-->
如果我们尝试访问一个id不存在的笔记URL，例如<http://localhost:3001/api/notes/5c41c90e84d891c15dfa3431>，其中<i>5c41c90e84d891c15dfa3431</i>不是数据库中存储的id，那么响应将是_null_。

<!-- Let's change this behavior so that if a note with the given id doesn't exist, the server will respond to the request with the HTTP status code 404 not found. In addition let''s implement a simple <em>catch</em> block to handle cases where the promise returned by the <em>findById</em> method is <i>rejected</i>:-->
让我们改变这种行为，以便如果给定ID的笔记不存在，服务器将使用HTTP状态代码404未找到来响应请求。此外，让我们实现一个简单的<em>catch</em>块来处理<em>findById</em>方法返回的promise被<i>拒绝</i>的情况：

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

<!-- If no matching object is found in the database, the value of _note_ will be _null_ and the _else_ block is executed. This results in a response with the status code <i>404 not found</i>. If a promise returned by the <em>findById</em> method is rejected, the response will have the status code <i>500 internal server error</i>. The console displays more detailed information about the error.-->
如果在数据库中未找到匹配的对象，_note_ 的值将为 _null_，并执行 _else_ 块。这将导致响应的状态码为<i>404 not found</i>。如果由<em>findById</em>方法返回的承诺被拒绝，响应的状态码将为<i>500 internal server error</i>。控制台会显示有关错误的更详细信息。

<!-- On top of the non-existing note, there's one more error situation that needs to be handled. In this situation, we are trying to fetch a note with the wrong kind of _id_, meaning an _id_ that doesn't match the mongo identifier format.-->
在不存在的笔记之上，还有一种错误情况需要处理。在这种情况下，我们试图用错误格式的_id_获取笔记，意思是_id_不符合Mongo标识符格式。

<!-- If we make the following request, we will get the error message shown below:-->
如果我们发出以下请求，我们将会得到下面显示的错误消息：

<pre>
Method: GET
Path:   /api/notes/someInvalidId
Body:   {}
---
{ CastError: Cast to ObjectId failed for value "someInvalidId" at path "_id"
    at CastError (/Users/mluukkai/opetus/_fullstack/osa3-muisiinpanot/node_modules/mongoose/lib/error/cast.js:27:11)
    at ObjectId.cast (/Users/mluukkai/opetus/_fullstack/osa3-muisiinpanot/node_modules/mongoose/lib/schema/objectid.js:158:13)
    ...
</pre>

Given a malformed id as an argument, the <em>findById</em> method will throw an error causing the returned promise to be rejected. This will cause the callback function defined in the <em>catch</em> block to be called.

Let''s make some small adjustments to the response in the <em>catch</em> block:

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

If the format of the id is incorrect, then we will end up in the error handler defined in the _catch_ block. The appropriate status code for the situation is [400 Bad Request](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.1) because the situation fits the description perfectly:

> <i>The request could not be understood by the server due to malformed syntax. The client SHOULD NOT repeat the request without modifications.</i>

We have also added some data to the response to shed some light on the cause of the error.

When dealing with Promises, it''s almost always a good idea to add error and exception handling. Otherwise, you will find yourself dealing with strange bugs.

It''s never a bad idea to print the object that caused the exception to the console in the error handler:

```js
.catch(error => {
  console.log(error)  // highlight-line
  response.status(400).send({ error: 'malformatted id' })
})
```

The reason the error handler gets called might be something completely different than what you had anticipated. If you log the error to the console, you may save yourself from long and frustrating debugging sessions. Moreover, most modern services where you deploy your application support some form of logging system that you can use to check these logs. As mentioned, Heroku is one.

Every time you''re working on a project with a backend, <i>it is critical to keep an eye on the console output of the backend</i>. If you are working on a small screen, it is enough to just see a tiny slice of the output in the background. Any error messages will catch your attention even when the console is far back in the background:

![sample screenshot showing tiny slice of output](../../images/3/15b.png)

### Moving error handling into middleware

We have written the code for the error handler among the rest of our code. This can be a reasonable solution at times, but there are cases where it is better to implement all error handling in a single place. This can be particularly useful if we want to report data related to errors to an external error-tracking system like [Sentry](https://sentry.io/welcome/) later on.

Let''s change the handler for the <i>/api/notes/:id</i> route so that it passes the error forward with the <em>next</em> function. The next function is passed to the handler as the third parameter:

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

The error that is passed forwards is given to the <em>next</em> function as a parameter. If <em>next</em> was called without a parameter, then the execution would simply move onto the next route or middleware. If the <em>next</em> function is called with a parameter, then the execution will continue to the <i>error handler middleware</i>.

Express [error handlers](https://expressjs.com/en/guide/error-handling.html) are middleware that are defined with a function that accepts <i>four parameters</i>. Our error handler looks like this:

```js
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)
```

The error handler checks if the error is a <i>CastError</i> exception, in which case we know that the error was caused by an invalid object id for Mongo. In this situation, the error handler will send a response to the browser with the response object passed as a parameter. In all other error situations, the middleware passes the error forward to the default Express error handler.

Note that the error-handling middleware has to be the last loaded middleware!

### The order of middleware loading

The execution order of middleware is the same as the order that they are loaded into express with the _app.use_ function. For this reason, it is important to be careful when defining middleware.

The correct order is the following:

```js
app.use(express.static('build'))
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

The json-parser middleware should be among the very first middleware loaded into Express. If the order was the following:

```js
app.use(requestLogger) // request.body is undefined!

app.post('/api/notes', (request, response) => {
  // request.body is undefined!
  const body = request.body
  // ...
})

app.use(express.json())
```

Then the JSON data sent with the HTTP requests would not be available for the logger middleware or the POST route handler, since the _request.body_ would be _undefined_ at that point.

It''s also important that the middleware for handling unsupported routes is next to the last middleware that is loaded into Express, just before the error handler.

For example, the following loading order would cause an issue:

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

Now the handling of unknown endpoints is ordered <i>before the HTTP request handler</i>. Since the unknown endpoint handler responds to all requests with <i>404 unknown endpoint</i>, no routes or middleware will be called after the response has been sent by unknown endpoint middleware. The only exception to this is the error handler which needs to come at the very end, after the unknown endpoints handler.

### Other operations

Let''s add some missing functionality to our application, including deleting and updating an individual note.

The easiest way to delete a note from the database is with the [findByIdAndRemove](https://mongoosejs.com/docs/api/model.html#model_Model-findByIdAndRemove) method:

```js
app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})
```

In both of the "successful" cases of deleting a resource, the backend responds with the status code <i>204 no content</i>. The two different cases are deleting a note that exists, and deleting a note that does not exist in the database. The _result_ callback parameter could be used for checking if a resource was actually deleted, and we could use that information for returning different status codes for the two cases if we deemed it necessary. Any exception that occurs is passed onto the error handler.

The toggling of the importance of a note can be easily accomplished with the [findByIdAndUpdate](https://mongoosejs.com/docs/api/model.html#model_Model-findByIdAndUpdate) method.

```js
app.put('/api/notes/:id', (request, response, next) => {
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
```

In the code above, we also allow the content of the note to be edited.

Notice that the <em>findByIdAndUpdate</em> method receives a regular JavaScript object as its parameter, and not a new note object created with the <em>Note</em> constructor function.

There is one important detail regarding the use of the <em>findByIdAndUpdate</em> method. By default, the <em>updatedNote</em> parameter of the event handler receives the original document [without the modifications](https://mongoosejs.com/docs/api/model.html#model_Model-findByIdAndUpdate). We added the optional <code>{ new: true }</code> parameter, which will cause our event handler to be called with the new modified document instead of the original.

After testing the backend directly with Postman and the VS Code REST client, we can verify that it seems to work. The frontend also appears to work with the backend using the database.

You can find the code for our current application in its entirety in the <i>part3-5</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-5).

### A true full stack developer''s oath

It is again time for the exercises. The complexity of our app is now taken another step since besides frontend and backend we also have a database.
There are indeed really many potential sources of error.

So we should once more extend our oath:

Full stack development is <i> extremely hard</i>, that is why I will use all the possible means to make it easier

- I will have my browser developer console open all the time
- I will use the network tab of the browser dev tools to ensure that frontend and backend are communicating as I expect
- I will constantly keep an eye on the state of the server to make sure that the data sent there by the frontend is saved there as I expect
- <i>I will keep an eye on the database: does the backend save data there in the right format</i>
- I progress with small steps
- I will write lots of _console.log_ statements to make sure I understand how the code behaves and to help pinpoint problems
- If my code does not work, I will not write more code. Instead, I start deleting the code until it works or just return to a state when everything was still working
- When I ask for help in the course Discord or Telegram channel or elsewhere I formulate my questions properly, see [here](https://fullstackopen.com/en/part0/general_info#how-to-ask-help-in-discord-telegam) how to ask for help

</div>

<div class="tasks">

### Exercises 3.15.-3.18.

#### 3.15: Phonebook database, step3

Change the backend so that deleting phonebook entries is reflected in the database.

Verify that the frontend still works after making the changes.

#### 3.16: Phonebook database, step4

Move the error handling of the application to a new error handler middleware.

#### 3.17*: Phonebook database, step5

If the user tries to create a new phonebook entry for a person whose name is already in the phonebook, the frontend will try to update the phone number of the existing entry by making an HTTP PUT request to the entry''s unique URL.

Modify the backend to support this request.

Verify that the frontend works after making your changes.

#### 3.18*: Phonebook database step6

Also update the handling of the <i>api/persons/:id</i> and <i>info</i> routes to use the database, and verify that they work directly with the browser, Postman, or VS Code REST client.

Inspecting an individual phonebook entry from the browser should look like this:

![screenshot of browser showing one person with api/persons/their_id](../../images/3/49.png)

</div>
