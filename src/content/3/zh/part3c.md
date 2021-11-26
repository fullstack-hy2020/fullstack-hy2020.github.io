---
mainImage: ../../../images/part-3.svg
part: 3
letter: c
lang: zh
---

<div class="content">


<!-- Before we move into the main topic of persisting data in a database, we will take a look at a few different ways of debugging Node applications. -->
在讨论在数据库中保存数据的议题之前，我们将看一下调试 Node 应用的几种不同方法。

### Debugging Node applications 
【调试Node应用】
<!-- Debugging Node applications is slightly more difficult than debugging JavaScript running in your browser. Printing to the console is a tried and true method, and it's always worth doing. There are people who think that more sophisticated methods should be used instead, but I disagree. Even the world's elite open source developers [use](https://tenderlovemaking.com/2016/02/05/i-am-a-puts-debuggerer.html) this [method](https://swizec.com/blog/javascript-debugging-slightly-beyond-consolelog/). -->
调试 Node 应用比调试在浏览器中运行的 JavaScript 稍微困难一些。 将数据打印到控制台是一种可靠的方法，而且总是值得一试。 有些人认为应该用更复杂的方法来代替，但我不同意。 即使是世界上最顶尖的开源开发者也会使用 [use](https://tenderlovemaking.com/2016/02/05/i-am-a-puts-debuggerer.html) 这种方法[method](https://swizec.com/blog/javascript-debugging-slightly-beyond-consolelog/)。

#### Visual Studio Code


<!-- The Visual Studio Code debugger can be useful in some situations. You can launch the application in debugging mode like this: -->
 Visual Studio Code代码调试器在某些情况下可能很有用。 你可以像这样在调试模式下启动应用:

![](../../images/3/35.png)

<!-- Note that the application shouldn't be running in another console, otherwise the port will already be in use. -->
注意，应用不应该在另一个控制台中运行，否则该端口将会冲突。

<!-- __NB__ A newer version of Visual Studio Code may have _Run_ instead of _Debug_. Furthermore, you may have to configure your _launch.json_ file to start debugging. This can be done by choosing _Add Configuration..._ on the drop-down menu, which is located next to the green play button and above _VARIABLES_ menu, and select _Run "npm start" in a debug terminal_. For more detailed setup instructions, visit Visual Studio Code's [Debugging documentation](https://code.visualstudio.com/docs/editor/debugging). -->

__注意__ 更新版本的Visual Studio Code可能包含 _Run_ 而不是 _Debug_。进一步说，你可以配置你的 _launch.json_ 文件来开始debug。可以通过在下拉菜单中选择 _Add Configuration..._ ，它位于绿色按钮的旁边，以及 _VARIABLES_ 菜单的上部，选择 _Run "npm start" in a debug terminal_。有关更多的安装步骤，访问isual Studio Code的[Debugging documentation](https://code.visualstudio.com/docs/editor/debugging)。

<!-- Below you can see a screenshot where the code execution has been paused in the middle of saving a new note: -->
下面你可以看到一个屏幕截图，代码执行在保存新便笺的过程中被暂停:

![](../../images/3/36e.png)

<!-- The execution has stopped at the <i>breakpoint</i> in line 63. In the console you can see the value of the <i>note</i> variable. In the top left window you can see other things related to the state of the application. -->
执行在第63行的<i>断点</i> 处停止。 在控制台中，您可以看到<i>note</i> 变量的值。 在左上角的窗口中，您可以看到与应用状态相关的其他内容。

<!-- The arrows at the top can be used for controlling the flow of the debugger. -->
顶部的箭头可用于控制调试器的流。

<!-- For some reason, I don't use the Visual Studio Code debugger a whole lot. -->
出于某种原因，我并不经常使用 Visual Studio Code 调试器。

#### Chrome dev tools
【Chrome开发工具】
<!-- Debugging is also possible with the Chrome developer console by starting your application with the command: -->
利用 Chrome 开发者控制台，通过如下命令启动应用，也可以进行调试:

```bash
node --inspect index.js
```

<!-- You can access the debugger by clicking the green icon that appears in the Chrome developer console: -->
你可以通过点击 Chrome 开发者控制台中的绿色图标——node的logo，来进入调试器:

![](../../images/3/37.png)

<!-- The debugging view works the same way as it did with React applications. The <i>Sources</i> tab can be used for setting breakpoints where the execution of the code will be paused. -->
调试视图的工作方式与 React 应用相同。<i>Sources</i> 选项卡可用于设置中断点，中断点将暂停代码的执行。

![](../../images/3/38eb.png)

<!-- All of the application's console.log messages will appear in the <i>Console</i> tab of the debugger. You can also inspect values of variables and execute your own JavaScript code. -->
应用的所有 <i>console.log</i> 消息都将出现在调试器的<i>Console</i> 选项卡中。 您还可以检查变量的值并执行自己的 JavaScript 代码。

![](../../images/3/39ea.png)


### Question everything
【质疑一切】
<!-- Debugging Full Stack applications may seem tricky at first. Soon our application will also have a database in addition to the frontend and backend, and there will be many potential areas for bugs in the application. -->
调试全栈应用起初可能看起来很棘手。 不久，我们的应用除了前端和后端之外，还将有一个数据库，并且应用中将有许多潜在的 bug。

<!-- When the application "does not work", we have to first figure out where the problem actually occurs. It's very common for the problem to exist in a place where you didn't expect it to, and it can take minutes, hours, or even days before you find the source of the problem. -->
当应用“不工作”时，我们必须首先找出问题实际发生在哪里。 这个问题存在于一个你没有预料到的地方是很常见的，它可能需要几分钟，几个小时，甚至几天，你才能找到问题的根源。

<!-- The key is to be systematic. Since the problem can exist anywhere, <i>you must question everything</i>, and eliminate all possibilities one by one. Logging to the console, Postman, debuggers, and experience will help. -->
关键是要有系统性。 既然问题可以存在于任何地方，你就必须质疑每一件事，并逐一排除所有的可能性。 登录到控制台、Postman、调试器和经验都将有所帮助。

<!-- When bugs occur, <i>the worst of all possible strategies</i> is to continue writing code. It will guarantee that your code will soon have ten more bugs, and debugging them will be even more difficult. The [stop and fix](http://gettingtolean.com/toyota-principle-5-build-culture-stopping-fix/#.Wjv9axP1WCQ) principle from Toyota Production Systems is very effective in this situation as well. -->
当出现 bug 时，所有可能的策略中最糟糕的就是继续编写代码。 这将保证你的代码很快会有更多的bug，并且调试它们将会更加困难。 在这种情况下，丰田生产系统公司(Toyota Production Systems)的 [stop and fix](http://gettingtolean.com/toyota-principle-5-build-culture-stopping-fix/#.Wjv9axP1WCQ) 原则也非常有效。

### MongoDB
<!-- In order to store our saved notes indefinitely, we need a database. Most of the courses taught at the University of Helsinki use relational databases. In this course we will use [MongoDB](https://www.mongodb.com/) which is a so-called [document database](https://en.wikipedia.org/wiki/Document-oriented_database). -->
为了永久地存储我们保存的便笺，我们需要一个数据库。 赫尔辛基大学教授的大多数课程都使用关系数据库。 在本课程中，我们将使用[MongoDB](https://www.MongoDB.com/) 数据库 ，这是一个所谓的[文档数据库](https://en.wikipedia.org/wiki/document-oriented_database)。

<!-- Document databases differ from relational databases in how they organize data as well as the query languages they support. Document databases are usually categorized under the [NoSQL](https://en.wikipedia.org/wiki/NoSQL) umbrella term. -->
文档数据库在组织数据的方式以及它们所支持的查询语言方面不同于关系数据库。 文档数据库通常被归类为[NoSQL](https://en.wikipedia.org/wiki/NoSQL)的术语集。

<!-- You can read more about document databases and NoSQL from the course material for [week 7](https://tikape-s18.mooc.fi/part7/) of the Introduction to Databases course. Unfortunately the material is currently only available in Finnish.  -->
你可以阅读更多关于文档数据库和 NoSQL 的资料，这些资料来自数据库导论课程的[第7周](https://tikape-s18.mooc.fi/part7/)课程。 不幸的是，这些材料目前只有芬兰语版。

<!-- Read now the chapters on [collections](https://docs.mongodb.com/manual/core/databases-and-collections/) and [documents](https://docs.mongodb.com/manual/core/document/) from the MongoDB manual to get a basic idea on how a document database stores the data. -->
现在阅读 MongoDB 手册中关于[集合](https://docs.MongoDB.com/manual/core/databases-and-collections/)和[文档](https://docs.MongoDB.com/manual/core/document/)的章节，了解文档数据库如何存储数据的基本概念。

<!-- Naturally, you can install and run MongoDB on your own computer. However, the internet is also full of Mongo database services that you can use. Our preferred MongoDB provider in this course will be [MongoDB Atlas](https://www.mongodb.com/cloud/atlas). -->
当然，您可以在自己的计算机上安装和运行 MongoDB。 然而，互联网上也充满了你可以使用的 Mongo 数据库服务。 在本课程中，我们首选的 MongoDB 提供者将是[MongoDB Atlas](https://www.MongoDB.com/cloud/Atlas)。

<!-- Once you've created and logged into your account, Atlas will recommend creating a cluster(In later versions of MongoDB Atlas, you may see create a database): -->
一旦你创建并登录到你的账户，Atlas 会建议你创建一个集群(在新版本的MongoDB Atlas 中，你可能看到的是创建一个数据库):

![](../../images/3/57.png)

<!-- Let's choose <i>AWS</i> and <i>Frankfurt</i> and create a cluster. -->
让我们选择<i>AWS</i>作为提供商，并用<i>Frankfurt</i>作为地区，创建一个集群。

![](../../images/3/58.png)

<!-- Let's wait for the cluster to be ready for use. This will take approximately 10 minutes. -->
让我们等待集群准备好可以使用。这大约需要10分钟。

<!-- **NB** do not continue before the cluster is ready. -->
**注意**在集群准备好之前不要继续。

<!-- Let's use the <i>database access</i> tab for creating user credentials for the database. Please note that these are not the same credentials you use for logging into MongoDB Atlas. These will be used for your application to connect to the database. -->
让我们使用<i>database access</i> 选项卡为数据库创建用户凭据。 请注意，这些不是您登录到 MongoDB Atlas 所使用的相同凭据。这是用来让你的应用连接到数据库所用到的。

![](../../images/3/59.png)

<!-- Let's grant the user with permissions to read and write to the databases. -->
让我们授予用户读写数据库的权限。

![](../../images/3/60.png)

<!-- **NB** for some people the new user credentials have not worked immediately after creation. In some cases it has taken minutes before the credentials have worked. -->
**注意** 对于某些人来说，新的用户证书在创建后没有立即生效。 在某些情况下，这些凭证需要几分钟的时间才能生效。

<!-- Next we have to define the IP addresses that are allowed access to the database. -->
接下来，我们必须定义允许访问数据库的 IP 地址。

![](../../images/3/61ea.png)

<!-- For the sake of simplicity we will allow access from all IP addresses: -->
为了简单起见，我们将允许所有访问的 IP 地址:

![](../../images/3/62.png)

<!-- Finally we are ready to connect to our database. Start by clicking <i>connect</i> -->
最后，我们准备连接到我们的数据库：

![](../../images/3/63ea.png)

<!-- and the choose <i>Connect your application</i>: -->
选择<i>Connect your application</i>:

![](../../images/3/64ea.png)

<!-- The view displays the <i>MongoDB URI</i>, which is the address of the database that we will supply to the MongoDB client library we will add to our application. -->
该视图显示<i>MongoDB URI</i>，这是我们将提供给我们将添加到应用的 MongoDB 客户端库的数据库地址。

<!-- The address looks like this: -->
地址是这样的:

```bash
mongodb+srv://fullstack:<PASSWORD>@cluster0-ostce.mongodb.net/test?retryWrites=true
```

<!-- N.B. If later in this section you experience repeated troubles connecting and making requests to MongoDB, it may be necessary to use an older connection string. To configure your connection string in MongoDb Atlas, go to 'Connect', then 'Connect your application.' Under 'Select your driver and application,' change the Node.js version to '2.2.12 or later'. Your connection string will look different from the examples in this course, but replacing the <password> and database name fields will work the same. -->

注意，如果后期在本节中你持续遇到连接MongoDB出错的问题，你可能需要使用一个老一些的连接字符串。在MongoDb Atlas 中配置你的连接字符串，点击 Connect， 然后 Connect your application。在 'selsect your driver and application 中，将Nodejs的版本选择2.2.12 or later。 你的连接信息会与课程中的字符串看起来不同，但是替换掉<password> 以及数据库名就会工作良好。

<!-- We are now ready to use the database. -->
我们现在可以使用数据库了。

<!-- We could use the database directly from our JavaScript code with the [official MongoDb Node.js driver](https://mongodb.github.io/node-mongodb-native/) library, but it is quite cumbersome to use. We will instead use the [Mongoose](http://mongoosejs.com/index.html) library that offers a higher level API. -->
我们可以通过官方的 MongoDb Node.js 驱动程序库直接从 JavaScript 代码中使用这个数据库，但是使用起来相当麻烦。 相反，我们将使用提供更高级别 API 的[Mongoose](http://mongoosejs.com/index.html)库。

<!-- Mongoose could be described as an <i>object document mapper</i> (ODM), and saving JavaScript objects as Mongo documents is straightforward with the library. -->
Mongoose 可以被描述为<i>object document mapper</i> (ODM) ，并且将 JavaScript 对象保存为 Mongo 文档对于Mongoose库来说很简单。 

<!-- Let's install Mongoose: -->
让我们安装 Mongoose:

```bash
npm install mongoose
```

<!-- Let's not add any code dealing with Mongo to our backend just yet. Instead, Instead, let's make a practice application by creating a new file, <i>mongo.js</i>： -->
现在还不要在后端添加任何处理 Mongo 的代码。 相反，让我们创建<i>mongo.js</i> 文件，来创建一个实践应用:

```js
const mongoose = require('mongoose')

if ( process.argv.length<3 ) {
   console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0-ostce.mongodb.net/test?retryWrites=true`

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'HTML is Easy',
  date: new Date(),
  important: true,
})

note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})
```

<!-- **NB:** Depending on which region you selected when building your cluster, the <i>MongoDB URI</i> may be different from the example provided above. You should verify and use the correct URI that was generated from MongoDB Atlas. -->
注意：取决于你选择了什么区域来构建你的集群， <i>MongoDB URI</i> 可能和上例中提供的有些不同。你应当验证并使用 MongoDB Atlas 生成的正确的URI

<!-- The code assumes that it will be passed the password from the credentials we created in MongoDB Atlas as a command line parameter. We can access the command line parameter like this: -->
该代码假定它将作为命令行参数从我们在 MongoDB Atlas 中创建的凭据中传递密码。 我们可以像这样访问命令行参数:

```js
const password = process.argv[2]
```

<!-- When the code is run with the command <i>node mongo.js password</i>, Mongo will add a new document to the database. -->
当使用命令<i>node mongo.js password</i>运行代码时，Mongo 将向数据库添加一个新文档。

<!-- **NB:** Please note the password is the password created for the database user, not your MongoDB Atlas password.  Also, if you created password with special characters, then you'll need to [URL encode that password](https://docs.atlas.mongodb.com/troubleshoot-connection/#special-characters-in-connection-string-password). -->
注意：请注意这里的password 是为数据库用户创建的password，也就是说，如果你的密码是特殊字符，你需要[URL encode that password](https://docs.atlas.mongodb.com/troubleshoot-connection/#special-characters-in-connection-string-password)

<!-- We can view the current state of the database from the MongoDB Atlas from <i>Collections</i> -->
我们可以从<i>Collections</i> 中查看 MongoDB Atlas 中数据库的当前状态
<!-- in the Overview tab. -->
在概览标签页。

![](../../images/3/65.png)

<!-- As the view states, the <i>document</i> matching the note has been added to the <i>notes</i> collection in the <i>test</i> database. -->
正如视图所指出的那样，匹配便笺的<i>document</i> 已经添加到<i>test</i> 数据库中的<i>notes</i> 集合中。

![](../../images/3/66a.png)

<!-- We should give a better name to the database. Like the documentation says, we can change the name of the database from the URI: -->
我们应该给这个数据库起个更好的名字。 正如文档所说，我们可以从 URI 改变数据库的名称:

![](../../images/3/67.png)

<!-- Let's destroy the <i>test</i> database. Let's change the name of database to <i>note-app</i> instead, by modifying the URI: -->
让我们通过修改 URI，将数据库的名称更改为<i>note-app</i>:

```bash
mongodb+srv://fullstack:<PASSWORD>@cluster0-ostce.mongodb.net/note-app?retryWrites=true
```

<!-- Let's run our code again. -->
让我们再次运行代码。

![](../../images/3/68.png)

<!-- The data is now stored in the right database. The view also offers the <i>create database</i> functionality, that can be used to create new databases from the website. Creating the database like this is not necessary, since MongoDB Atlas automatically creates a new database when an application tries to connect to a database that does not exist yet. -->
数据现在存储在正确的数据库中。 该视图还提供了<i>create database</i> 功能，可用于从网站创建新的数据库。 这样创建数据库是没有必要的，因为当应用试图连接到一个尚不存在的数据库时，MongoDB Atlas 会自动创建一个新的数据库。

### Schema
<!-- After establishing the connection to the database, we define the [schema](http://mongoosejs.com/docs/guide.html) for a note and the matching [model](http://mongoosejs.com/docs/models.html): -->
在建立到数据库的连接之后，我们为一个便笺定义[模式schema](http://mongoosejs.com/docs/guide.html)和匹配的[模型](http://mongoosejs.com/docs/models.html) :

```js
const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)
```

<!-- First we define the [schema](http://mongoosejs.com/docs/guide.html) of a note that is stored in the _noteSchema_ variable. The schema tells Mongoose how the note objects are to be stored in the database. -->
首先，我们定义了存储在 noteSchema 变量中的便笺的[模式](http://mongoosejs.com/docs/guide.html)。 模式告诉 Mongoose 如何将 note 对象存储在数据库中。

<!-- In the _Note_ model definition, the first <i>"Note"</i> parameter is the singular name of the model. The name of the collection will be the lowercased plural <i>notes</i>, because the [Mongoose convention](http://mongoosejs.com/docs/models.html) is to automatically name collections as the plural (e.g. <i>notes</i>) when the schema refers to them in the singular (e.g. <i>Note</i>). -->
在 Note 模型定义中，第一个 <i>"Note"</i>参数是模型的单数名。 集合的名称将是小写的复数  <i>notes</i>，因为[Mongoose 约定](http://mongoosejs.com/docs/models.html)是当模式以单数(例如<i>Note</i>)引用集合时自动将其命名为复数(例如<i>notes</i>)。

<!-- Document databases like Mongo are <i>schemaless</i>, meaning that the database itself does not care about the structure of the data that is stored in the database. It is possible to store documents with completely different fields in the same collection. -->
像 Mongo 这样的文档数据库是<i>schemaaless</i>，这意味着数据库本身并不关心存储在数据库中的数据的结构。 可以在同一集合中存储具有完全不同字段的文档。

<!-- The idea behind Mongoose is that the data stored in the database is given a <i>schema at the level of the application</i> that defines the shape of the documents stored in any given collection. -->
Mongoose 背后的思想是，存储在数据库中的数据在<i>application</i>  级别上被赋予一个<i>schema </i>，该模式定义了存储在任何给定集合中的文档的形状。 

### Creating and saving objects
【创建和保存对象】
<!-- Next, the application creates a new note object with the help of the <i>Note</i> [model](http://mongoosejs.com/docs/models.html): -->
接下来，应用在<i>Note</i> [model](http://mongoosejs.com/docs/models.html)的帮助下创建一个新的 Note 对象:

```js
const note = new Note({
  content: 'HTML is Easy',
  date: new Date(),
  important: false,
})
```

<!-- Models are so-called <i>constructor functions</i> that create new JavaScript objects based on the provided parameters. Since the objects are created with the model's constructor function, they have all the properties of the model, which include methods for saving the object to the database. -->
模型是所谓的<i>构造函数constructor function</i>，它根据提供的参数创建新的 JavaScript 对象。 由于对象是使用模型的构造函数创建的，因此它们具有模型的所有属性，其中包括将对象保存到数据库的方法。

<!-- Saving the object to the database happens with the appropriately named _save_ method, that can be provided with an event handler with the _then_ method: -->
将对象保存到数据库是通过恰当命名的 save 方法实现的，可以通过 then 方法提供一个事件处理程序:

```js
note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})
```

<!-- When the object is saved to the database, the event handler provided to _then_  gets called. The event handler closes the database connection with the command <code>mongoose.connection.close()</code>. If the connection is not closed, the program will never finish its execution. -->
当对象保存到数据库时，将调用提供给该对象的事件处理。 事件处理程序使用命令代码 <code>mongoose.connection.close()</code> 关闭数据库连接。 如果连接没有关闭，程序将永远不能完成它的执行。

<!-- The result of the save operation is in the _result_ parameter of the event handler. The result is not that interesting when we're storing one object to the database. You can print the object to the console if you want to take a closer look at it while implementing your application or during debugging. -->
保存操作的结果存在事件处理程序的结果参数中。 当我们将一个对象存储到数据库时，结果并不那么有趣。 如果希望在实现应用或调试过程中仔细查看对象，可以将该对象打印到控制台。

<!-- Let's also save a few more notes by modifying the data in the code and by executing the program again. -->
我们还可以通过修改代码中的数据和再次执行程序来保存更多的便笺。

<!-- **NB:** Unfortunately the Mongoose documentation is not very consistent, with parts of it using callbacks in its examples and other parts, other styles, so it is not recommended to copy paste code directly from there. Mixing promises with old-school callbacks in the same code is not recommended.  -->
遗憾的是 Mongoose 文档并不是非常一致，在其示例中使用了回调函数，而在其其他章节又使用了不同的方式，因此不建议直接从那里复制粘贴代码。 不建议在同一代码中将承诺与老式的回调混合使用。

### Fetching objects from the database
【从数据库中获取对象】

<!-- Let's comment out the code for generating new notes and replace it with the following: -->
让我们注释掉生成新便笺的代码，并用如下代码替换它:

```js
Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})
```

<!-- When the code is executed, the program prints all the notes stored in the database: -->
当代码执行时，程序会输出存储在数据库中的所有便笺:

![](../../images/3/70ea.png)

<!-- The objects are retrieved from the database with the [find](https://mongoosejs.com/docs/api.html#model_Model.find) method of the _Note_ model. The parameter of the method is an object expressing search conditions. Since the parameter is an empty object<code>{}</code>, we get all of the notes stored in the  _notes_ collection. -->
这些对象是通过 Note 模型的[find](https://mongoosejs.com/docs/api.html#model_model.find)方法从数据库中检索的。 该方法的参数是表示搜索条件的对象。 因为参数是一个空的对象<code>{}</code>，所以我们得到了存储在 notes 集合中的所有便笺。

<!-- The search conditions adhere to the Mongo search query [syntax](https://docs.mongodb.com/manual/reference/operator/). -->
搜索条件遵循 Mongo 搜索查询[语法](https://docs.mongodb.com/manual/reference/operator/)。

<!-- We could restrict our search to only include important notes like this: -->
我们可以限制我们的搜索，只包括重要的便笺，如下所示:

```js
Note.find({ important: true }).then(result => {
  // ...
})
```

</div>


<div class="tasks">


### Exercise 3.12.
#### 3.12: Command-line database 命令行数据库
<!-- Create a cloud-based MongoDB database for the phonebook application with MongoDB Atlas.  -->
使用 MongoDB Atlas 为电话簿应用创建基于云的 MongoDB 数据库。

<!-- Create a <i>mongo.js</i> file in the project directory, that can be used for adding entries to the phonebook, and for listing all of the existing entries in the phonebook. -->
在项目目录中创建一个<i>mongo.js</i> 文件，该文件可用于向电话簿添加条目，以及列出电话簿中的所有现有条目。

<!-- **NB** Do not include the password in the file that you commit and push to GitHub!  -->
不要在你提交的文件中包含密码并推送到 GitHub！

<!-- The application should work as follows. You use the program by passing three command-line arguments (the first is the password), e.g.: -->
应用的工作方式如下。 通过传递三个命令行参数(第一个是密码)来使用该程序，例如:

```bash
node mongo.js yourpassword Anna 040-1234556
```

<!-- As a result, the application will print: -->
因此，应用将打印:

```bash
added Anna number 040-1234556 to phonebook
```

<!-- The new entry to the phonebook will be saved to the database. Notice that if the name contains whitespace characters, it must be enclosed in quotes: -->
电话簿的新条目将被保存到数据库中。 请注意，如果名称包含空格字符，则必须用引号括起来:

```bash
node mongo.js yourpassword "Arto Vihavainen" 045-1234556
```

<!-- If the password is the only parameter given to the program, meaning that it is invoked like this: -->
如果密码是程序的唯一参数，这意味着它是这样调用的:

```bash
node mongo.js yourpassword
```

<!-- Then the program should display all of the entries in the phonebook: -->
然后程序应该显示电话簿中的所有条目:

<pre>
phonebook:
Anna 040-1234556
Arto Vihavainen 045-1232456
Ada Lovelace 040-1231236
</pre>


<!-- You can get the command-line parameters from the [process.argv](https://nodejs.org/docs/latest-v8.x/api/process.html#process_process_argv) variable. -->
您可以从[process.argv](https://nodejs.org/docs/latest-v8.x/api/process.html#process_process_argv)变量中获得命令行参数。

<!-- **NB: do not close the connection in the wrong place**. E.g. the following code will not work: -->
**注意: 不要在错误的地方关闭连接 **，例如，如下的代码就无法工作:

```js
Person
  .find({})
  .then(persons=> {
    // ...
  })

mongoose.connection.close()
```

<!-- In the code above the <i>mongoose.connection.close()</i> command will get executed immediately after the <i>Person.find</i> operation is started. This means that the database connection will be closed immediately, and the execution will never get to the point where <i>Person.find</i> operation finishes and the <i>callback</i> function gets called. -->
在上面的代码中，<i>mongoose.connection.close()</i> 命令将在  <i>Person.find</i> 操作启动后立即执行。 这意味着数据库连接将立即关闭，执行将永远不会到达<i>Person.find</i> 操作结束并调用<i>回调</i> 函数的地方。

<!-- The correct place for closing the database connection is at the end of the callback function: -->
关闭数据库连接的正确位置是在回调函数的末尾:

```js
Person
  .find({})
  .then(persons=> {
    // ...
    mongoose.connection.close()
  })
```

<!-- **NB2** if you define a model with the name <i>Person</i>, mongoose will automatically name the associated collection as <i>people</i>. -->
**注意** 如果定义一个名为<i>Person</i> 的模型，mongoose 将自动将相关的集合命名为<i>people</i>。

</div>


<div class="content">


### Backend connected to a database
【后端连接到数据库】
<!-- Now we have enough knowledge to start using Mongo in our application. -->
现在我们有足够的知识，可以在我们的应用中使用 Mongo了。

<!-- Let's get a quick start by copy pasting the Mongoose definitions to the <i>index.js</i> file: -->
让我们通过复制粘贴 Mongoose 定义到<i>index.js</i> 文件来快速开始:

```js
const mongoose = require('mongoose')

// DO NOT SAVE YOUR PASSWORD TO GITHUB!!
const url =
  'mongodb+srv://fullstack:sekred@cluster0-ostce.mongodb.net/note-app?retryWrites=true'

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)
```

<!-- Let's change the handler for fetching all notes into the following form: -->
让我们将获取所有便笺的处理程序更改为如下形式:

```js
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})
```

<!-- We can verify in the browser that the backend works for displaying all of the documents: -->
我们可以在浏览器中验证后端是否可以显示所有文档:

![](../../images/3/44ea.png)

<!-- The application works almost perfectly. The frontend assumes that every object has a unique id in the <i>id</i> field. We also don't want to return the mongo versioning field <i>\_\_v</i> to the frontend. -->
这个应用运行得几乎完美。 前端假设每个对象在<i>id</i> 字段中都有唯一的 id。 我们也不想将 mongo 版本控制字段 <i>\_\_v</i>  返回到前端。

<!-- One way to format the objects returned by Mongoose is to [modify](https://stackoverflow.com/questions/7034848/mongodb-output-id-instead-of-id) the _toJSON_ method of the schema, which is used on all instances of the models produced with that schcema. Modifying the method works like this:-->
格式化 Mongoose 返回的对象的一种方法是[修改](https://stackoverflow.com/questions/7034848/mongodb-output-id-instead-of-id)Schema 的 toJSON 方法，这个schema是作用在所有models实例上的。 修改方法的过程如下:

```js
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
```

<!-- Even though the <i>\_id</i> property of Mongoose objects looks like a string, it is in fact an object. The _toJSON_ method we defined transforms it into a string just to be safe. If we didn't make this change, it would cause more harm for us in the future once we start writing tests. -->
尽管 Mongoose 对象的<i> id</i> 属性看起来像一个字符串，但实际上它是一个对象。 为了安全起见，我们定义的 toJSON 方法将其转换为字符串。 如果我们不进行这个更改，那么一旦我们开始编写测试，它将在未来对我们造成更大的麻烦。

<!-- Let's respond to the HTTP request with a list of objects formatted with the _toJSON_ method: -->
让我们用一个用 toJSON 方法格式化的对象列表来响应 HTTP 请求:

```js
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})
```

<!-- Now the _notes_ variable is assigned to an array of objects returned by Mongo. When the response is sent in the JSON format, the _toJSON_ method of each object in the array is called automatically by the [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) method. -->
现在，notes 变量被分配给 Mongo 返回的对象数组。 当response 以JSON 格式返回，数组中每个对象 _toJSON_ 方法会通过[JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)自动调用

### Database configuration into its own module
【数据库逻辑配置到单独的模块】
<!-- Before we refactor the rest of the backend to use the database, let's extract the Mongoose specific code into its own module. -->
在我们重构后端的其余部分来使用数据库之前，让我们将 Mongoose 特定的代码提取到它自己的模块中。

<!-- Let's create a new directory for the module called <i>models</i>, and add a file called <i>note.js</i>: -->
让我们为模块<i>models</i> 创建一个新目录，并添加一个名为<i>note.js</i> 的文件:

```js
const mongoose = require('mongoose')

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
  date: Date,
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

<!-- Defining Node [modules](https://nodejs.org/docs/latest-v8.x/api/modules.html) differs slightly from the way of defining [ES6 modules](/zh/part2/从渲染集合到模块学习#refactoring- 模块s) in part 2. -->
定义 Node [modules](https://nodejs.org/docs/latest-v8.x/api/modules.html)与第2章节中定义[ES6模块](/zh/part2/从渲染集合到模块学习#refactoring- 模块s)的方式稍有不同。

<!-- The public interface of the module is defined by setting a value to the _module.exports_ variable. We will set the value to be the <i>Note</i> model. The other things defined inside of the module, like the variables _mongoose_ and _url_ will not be accessible or visible to users of the module. -->
模块的公共接口是通过将值设置为 module.exports 变量来定义的。 我们将该值设置为<i>Note</i> 模型。 模块内部定义的其他东西，比如变量 mongoose 和 url 对于模块的用户来说是不可访问的或者不可见的。

<!-- Importing the module happens by adding the following line to <i>index.js</i>: -->
导入模块的方法是在<i>index.js</i> 中添加如下代码行:

```js
const Note = require('./models/note')
```

<!-- This way the _Note_ variable will be assigned to the same object that the module defines. -->
这样，Note 变量将被分配给模块定义的同一个对象。

<!-- The way that the connection is made has changed slightly: -->
建立链接的方式略有改变:

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

<!-- It's not a good idea to hardcode the address of the database into the code, so instead the address of the database is passed to the application via the <em>MONGODB_URI</em> environment variable. -->
将数据库的地址硬编码到代码中并不是一个好主意，因此数据库的地址通过<em>MONGODB_URI</em>  环境变量传递给应用。

<!-- The method for establishing the connection is now given functions for dealing with a successful and unsuccessful connection attempt. Both functions just log a message to the console about the success status: -->
建立连接的方法现在被赋予处理成功和失败的连接尝试的函数。 这两个函数都只是向控制台发送一条关于成功状态的消息:

![](../../images/3/45e.png)

<!-- There are many ways to define the value of an environment variable. One way would be to define it when the application is started: -->
有很多方法可以定义环境变量的值。 一种方法是在应用启动时定义它:

```bash
MONGODB_URI=address_here npm run dev
```

<!-- A more sophisticated way is to use the [dotenv](https://github.com/motdotla/dotenv#readme) library. You can install the library with the command: -->
一个更复杂的方法是使用[dotenv](https://github.com/motdotla/dotenv#readme) ，你可以使用如下命令安装库:

```bash
npm install dotenv
```

<!-- To use the library, we create a <i>.env</i> file at the root of the project. The environment variables are defined inside of the file, and it can look like this: -->
为了使用这个库，我们创建一个 <i>.env</i> 文件在项目的根部。 环境变量是在文件内部定义的，它可以是这样的:

```bash
MONGODB_URI='mongodb+srv://fullstack:sekred@cluster0-ostce.mongodb.net/note-app?retryWrites=true'
PORT=3001
```

<!-- We also added the hardcoded port of the server into the <em>PORT</em> environment variable. -->
我们还将服务器的硬编码端口添加到  <em>PORT</em> 环境变量中。

<!-- **The <i>.env</i> file should be gitignored right away, since we do not want to publish any confidential information publicly online!** -->
** <i>.env</i> 文件应立即放到gitignore中，因为我们不希望在网上公开任何机密信息! **

![](../../images/3/45ae.png)

<!-- The environment variables defined in the dotenv file can be taken into use with the command <em>require('dotenv').config()</em> and you can reference them in your code just like you would reference normal environment variables, with the familiar <em>process.env.MONGODB_URI</em> syntax. -->
可以使用require('dotenv').config()命令来使用 <i>.env</i> 文件中定义的环境变量。您可以在代码中引用它们，就像引用普通环境变量一样，使用熟悉的 <em>process.env.MONGODB_URI</em>语法。

<!-- Let's change the <i>index.js</i> file in the following way: -->
让我们如下面的方式更改<i>index.js</i> 文件:

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

<!-- It's important that <i>dotenv</i> gets imported before the <i>note</i> model is imported. This ensures that the environment variables from the <i>.env</i> file are available globally before the code from the other modules are imported. -->
在导入<i>note</i> 模型之前导入<i>dotenv</i> 非常重要。 这样可以确保在导入其他模块的代码之前，  <i>.env</i> 文件是全局可用的。

### Using database in route handlers
【在路由处理程序中使用数据库】
<!-- Next, let's change the rest of the backend functionality to use the database. -->
接下来，让我们更改后端功能的其余部分来使用数据库。

<!-- Creating a new note is accomplished like this: -->
创建一个新的便笺是这样完成的:

```js
app.post('/api/notes', (request, response) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })
})
```

<!-- The note objects are created with the _Note_ constructor function. The response for the request is sent inside of the callback function for the _save_ operation. This ensures that the response is sent only if the operation succeeded. We will discuss error handling a little bit later. -->
使用 Note 构造函数创建 Note 对象。 请求的响应是在保存操作的回调函数中发送的。 这确保只有在操作成功时才发送响应。 稍后我们将讨论错误处理。

<!-- The _savedNote_ parameter in the callback function is the saved and newly created note. The data sent back in the response is the formatted version created with the _toJSON_ method: -->
回调函数中的 _savedNote_ 参数是保存的和新创建的便笺。 返回的数据是用 toJSON 方法创建的格式化版本:

```js
response.json(savedNote)
```

<!-- Using Mongoose's [findById](https://mongoosejs.com/docs/api.html#model_Model.findById) method, fetching an individual note gets changed into the following: -->
使用Mongoose的[findById](https://mongoosejs.com/docs/api.html#model_Model.findById) 方法，取一个单独的便笺代码改为:

```js
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(note => {
    response.json(note)
  })
})
```

### Verifying frontend and backend integration 
【验证前端和后端的集成】
<!-- When the backend gets expanded, it's a good idea to test the backend first with **the browser, Postman or the VS Code REST client**. Next, let's try creating a new note after taking the database into use: -->
当后端扩展时，最好先用 **浏览器，Postman 或者 VS Code REST 客户端 **来测试后端。 接下来，让我们尝试在使用数据库之后创建一个新的便笺:

![](../../images/3/46e.png)

<!-- Only once everything has been verified to work in the backend, is it a good idea to test that the frontend works with the backend. It is highly inefficient to test things exclusively through the frontend. -->
只有当所有的东西都被验证在后端工作良好时，测试前端是否与后端一起工作才是一个好主意。 仅仅通过前端测试是非常低效的。

<!-- It's probably a good idea to integrate the frontend and backend one functionality at a time. First, we could implement fetching all of the notes from the database and test it through the backend endpoint in the browser. After this, we could verify that the frontend works with the new backend. Once everything seems to work, we would move onto the next feature. -->
一次集成一个前端和后端功能可能是个好主意。 首先，我们可以实现从数据库中获取所有便笺，并通过浏览器中的后端端点对其进行测试。 在此之后，我们可以验证前端是否与新的后端一起工作。 一旦一切看起来正常，我们就会进入下一个特性。

<!-- Once we introduce a database into the mix, it is useful to inspect the state persisted in the database, e.g. from the control panel in MongoDB Atlas. Quite often little Node helper programs like the <i>mongo.js</i> program we wrote earlier can be very helpful during development. -->
一旦我们将数据库混入其中，检查数据库中持久存储的状态就很有用了，例如，通过 MongoDB Atlas 中的控制面板来检查。 很多时候，像我们前面编写的<i>mongo.js</i> 程序这样的小型 Node helper 程序在开发过程中会非常有用。

<!-- You can find the code for our current application in its entirety in the <i>part3-4</i> branch of [this Github repository](https://github.com/fullstack-hy/part3-notes-backend/tree/part3-4). -->
您可以在[this Github repository](https://github.com/fullstack-hy/part3-notes-backend/tree/part3-4)的<i>part3-4</i> 分支中找到我们当前应用的全部代码。

</div>

<div class="tasks">

### Exercises 3.13.-3.14.
<!-- The following exercises are pretty straightforward, but if your frontend stops working with the backend, then finding and fixing the bugs can be quite interesting.  -->
下面的练习非常简单，但是如果前端与后端脱节了，那么查找和修复 bug 将会非常有趣。

#### 3.13: Phonebook database, 步骤1
<!-- Change the fetching of all phonebook entries so that the data is <i>fetched from the database</i>. -->
更改所有电话簿条目的获取，以便从数据库获取数据。

<!-- Verify that the frontend works after the changes have been made. -->
验证前端是否在更改之后仍能正常工作。

<!-- In the following exercises, write all Mongoose-specific code into its own module, just like we did in the chapter [Database configuration into its own module](/zh/part3/将数据存入_mongo_db#database-configuration-into-its-own- 模块). -->
在下面的练习中，将所有特定于 mongoose 的代码写入它自己的模块，就像我们在[Database configuration into its own module](/zh/part3/将数据存入_mongo_db#database-configuration-into-its-own- 模块)一章中所做的那样.

#### 3.14: Phonebook database, 步骤2
3.14: 电话簿数据库，第二步

<!-- Change the backend so that new numbers are <i>saved to the database</i>. Verify that your frontend still works after the changes. -->
更改后端，以便将新号码<i>保存到数据库</i>。 确认您的前端在更改之后仍然可以工作。

<!-- At this point, you can choose to simply allow users to create all phonebook entries. At this stage, the phonebook can have multiple entries for a person with the same name.  -->
此时，您可以选择只允许用户创建所有电话簿条目。 在这个阶段，电话簿可以为同一个名字的人提供多个条目。

</div>


<div class="content">


### Error handling
【错误处理】
<!-- If we try to visit the URL of a note with an id that does not actually exist e.g. <http://localhost:3001/api/notes/5c41c90e84d891c15dfa3431> where <i>5a3b80015b6ec6f1bdf68d</i> is not an id stored in the database, then the browser will simply get "stuck" since the server never responds to the request. -->

<!-- If we try to visit the URL of a note with an id that does not actually exist e.g. <http://localhost:3001/api/notes/5c41c90e84d891c15dfa3431> where <i>5c41c90e84d891c15dfa3431</i> is not an id stored in the database, then the response will be _null_. -->

如果我们试图向数据库访问一个实际上并不存在的 id 的便笺的 URL，比如 http://localhost:3001/api/notes/5c41c90e84d891c15dfa3431 ，其中<i>5c41c90e84d891c15dfa3431</i> 不是一个存储在数据库中的 id，那么返回值将会是 _null_。

<!-- We can see the following error message appear in the logs for the backend: -->

<!-- Let's change this behavior so that if note with the given id doesn't exist, the server will respond to the request with the HTTP status code 404 not found. In addition let's implement a simple <em>catch</em> block to handle cases where the promise returned by the <em>findById</em> method is <i>rejected</i>: -->

我们来改变一下行为，当给定id的note不存在时，服务端会向请求响应404状态。另外我们来实现一个简单的<em>catch</em>代码块，来处理<em>findById</em>方法返回<i>rejected</i>的情况：

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

<!-- Every request that leads to an error will be responded to with the HTTP status code 404 not found. The console displays more detailed information about the error.
每一个导致错误的请求都会在 HTTP状态码404没有找到的情况下被响应。 控制台显示有关错误的详细信息。 -->

<!-- If no matching object is found in the database, the value of _note_ will be _null_ and the _else_ block is executed. This results in a response with the status code <i>404 not found</i>. If promise returned by the <em>findById</em> method is rejected, the response will have the status code <i>500 internal server error</i>. The console displays more detailed information about the error. -->
如果在数据库中没有找到匹配的对象，_note_ 的值会是 _null_， 于是 _else_ 代码块执行。因此返回的状态是<i>404 not found</i>。而如果 <em>findById</em> 方法的promise 状态会是  <i>500 internal server error</i>。 可以在控制台中看到更多的错误打印信息。

<!-- There's actually two different types of error situations. In one of those situations, we are trying to fetch a note with a wrong kind of _id_, meaning an _id_ that doesn't match the mongo identifier format. -->
<!-- 实际上有两种不同类型的错误情况。 在其中一种情况下，我们试图获取一个带有错误类型的 id 的便笺，这意味着一个与 mongo 标识符格式不匹配的 id。 -->

On top of the non-existing note, there's one more error situation needed to be handled. In this situation, we are trying to fetch a note with a wrong kind of _id_, meaning an _id_ that doesn't match the mongo identifier format.
出了note 不存在的错误，还有许多错误是需要处理的。现在，我们尝试获取一个错误的 _id_， 也就是一个与mongo 标识符格式不匹配的 _id_ 。

<!-- If we make the following request, we will get the error message shown below: -->
如果我们提出如下请求，我们将得到如下所示的错误消息:

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
<!-- The other error situation happens when the id is in the correct format, but no note is found in the database for that id. -->
<!-- 另一种错误情况发生在 id 格式正确，但在数据库中没有找到该 id 的便笺时。 -->
<!-- Given malformed id as an argument, the <em>findById</em> method will throw an error causing the returned promise to be rejected. This will cause the callback function defined in the <em>catch</em> block to be called.  -->
当给出了一个奇怪的id作为参数时，<em>findById</em> 方法会抛出一个错误，进而会导致promise返回了rejected，因此也就会触发<em>catch</em>代码块中的函数。


<!-- We should distinguish between these two different types of error situations. The latter is in fact an error caused by our own code. -->
我们应该区分这两种不同类型的错误情况。 后者实际上是由我们自己的代码引起的错误。

<!-- Let's change the code in the following way: -->
让我们如下面的方式修改代码:

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

<!-- If no matching object is found in the database, the value of _note_ will be undefined and the _else_ block is executed. This results in a response with the status code <i>404 not found</i>. -->
<!-- 如果在数据库中没有找到匹配的对象，将不定义 note 的值，并执行 else 块。 这将导致响应状态代码 <i>404 not found</i>. -->

<!-- If the format of the id is incorrect, then we will end up in the error handler defined in the _catch_ block. The appropriate status code for the situation is [400 bad request](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.1), because the situation fits the description perfectly: -->
如果 id 的格式不正确，那么我们将在 catch 块中定义的错误处理程序中结束。 适合这种情况的状态代码是 [400 Bad Request](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.1) ，因为这种情况完全符合描述:

> <i>The request could not be understood by the server due to malformed syntax. The client SHOULD NOT repeat the request without modifications.</i>
由于格式不正确的语法，服务器无法理解请求。 客户端不应该在没有修改的情况下重复请求。 

<!-- We have also added some data to the response to shed some light on the cause of the error. -->
我们还在响应中添加了一些数据，以阐明错误的原因。

<!-- When dealing with Promises, it's almost always a good idea to add error and exception handling, because otherwise you will find yourself dealing with strange bugs. -->
在处理 Promises 时，添加错误和异常处理几乎总是一个好主意，否则您将发现自己正在处理奇怪的 bug。

<!-- It's never a bad idea to print the object that caused the exception to the console in the error handler: -->
打印导致错误处理程序控制台异常的对象绝不是个坏主意:

```js
.catch(error => {
  console.log(error) // highlight-line
  response.status(400).send({ error: 'malformatted id' })
})
```

<!-- The reason the error handler gets called might be something completely different than what you had anticipated. If you log the error to the console, you may save yourself from long and frustrating debugging sessions. Moreover, most modern services to where you deploy your application support some form of logging system that you can use to check these logs. As mentioned, Heroku is one. -->
调用错误处理程序的原因可能与您预期的完全不同。 如果您将错误记录到控制台，您可以避免冗长和令人沮丧的调试会话。此外，更加现代的部署应用的服务支持一些日志系统，你可以去查看这些日志。如前面提到的，Heroku就是一种。

<!-- Every time you're working on a project with a backend, <i>it is critical to keep an eye on the console output of the backend</i>. If you are working on a small screen, it is enough to just see a tiny slice of the output in the background. Any error messages will catch your attention even when the console is far back in the background: -->
每次您使用后端处理项目时，关注后端的控制台输出是至关重要的。 如果你在一个小屏幕上工作，只需要在背景中看到输出的一小部分就足够了。 任何错误消息都会引起你的注意，即使控制台远在后台:

![](../../images/3/15b.png)


### Moving error handling into middleware 
【将错误处理移入中间件】
<!-- We have written the code for the error handler among the rest of our code. This can be a reasonable solution at times, but there are cases where it is better to implement all error handling in a single place. This can be particularly useful if we later on want to report data related to errors to an external error tracking system like [Sentry](https://sentry.io/welcome/). -->
我们在代码的其余部分中编写了错误处理程序的代码。 有时这可能是一个合理的解决方案，但在某些情况下，最好在单个位置实现所有错误处理。 如果我们以后想要将与错误相关的数据报告给外部的错误跟踪系统，比如[Sentry](https://sentry.io/welcome/)，那么这么做就特别有用。

<!-- Let's change the handler for the <i>/api/notes/:id</i> route, so that it passes the error forward with the <em>next</em> function. The next function is passed to the handler as the third parameter: -->
让我们更改 <i>/api/notes/:id</i> 路由的处理程序，以便它使用<em>next</em> 函数向下传递错误。 下一个函数作为第三个参数传递给处理程序:

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

<!-- The error that is passed forwards is given to the <em>next</em> function as a parameter. If <em>next</em> was called without a parameter, then the execution would simply move onto the next route or middleware. If the <em>next</em> function is called with a parameter, then the execution will continue to the <i>error handler middleware</i>. -->
将向前传递的错误作为参数给 <em>next</em> 函数。 如果在没有参数的情况下调用 <em>next</em>，那么执行将简单地转移到下一个路由或中间件上。 如果使用参数调用<em>next</em> 函数，那么执行将继续到<i>error 处理程序中间件</i>。

<!-- Express [error handlers](https://expressjs.com/en/guide/error-handling.html) are middleware that are defined with a function that accepts <i>four parameters</i>. Our error handler looks like this: -->
Express [error handlers](https://expressjs.com/en/guide/error-handling.html)是一种中间件，它定义了一个接受<i>4个参数</i> 的函数。 我们的错误处理程序如下所示: 

```js
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// 这是最后加载的中间件
app.use(errorHandler)
```

<!-- The error handler checks if the error is a <i>CastError</i> exception, in which case we know that the error was caused by an invalid object id for Mongo. In this situation the error handler will send a response to the browser with the response object passed as a parameter. In all other error situations, the middleware passes the error forward to the default Express error handler.  -->
错误处理程序检查错误是否是<i>CastError</i> 异常，在这种情况下，我们知道错误是由 Mongo 的无效对象 id 引起的。 在这种情况下，错误处理程序将向浏览器发送响应，并将response对象作为参数传递。 在所有其他错误情况下，中间件将错误转发给缺省的 Express 错误处理程序。

<!-- Note that the error handling middleware has to be the last loaded middleware! -->
注意处理错误的中间件是最后加载的中间件

### The order of middleware loading 
【中间件加载顺序】
<!-- The execution order of middleware is the same as the order that they are loaded into express with the _app.use_ function. For this reason it is important to be careful when defining middleware. -->
中间件的执行顺序与通过 app.use 函数加载到 express 中的顺序相同。 出于这个原因，在定义中间件时一定要小心。

<!-- The correct order is the following: -->
正确的顺序如下:

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

<!-- The json-parser middleware should be among the very first middleware loaded into Express. If the order was the following: -->
Json-parser 中间件应该是最早加载到 Express 中的中间件之一，如果顺序变成了下面这样: 

```js
app.use(requestLogger) // request.body is undefined!

app.post('/api/notes', (request, response) => {
  // request.body is undefined!
  const body = request.body
  // ...
})

app.use(express.json())
```

<!-- Then the JSON data sent with the HTTP requests would not be available for the logger middleware or the POST route handler, since the _request.body_ would be _undefined_ . -->
那么，由 HTTP 请求发送的 JSON 数据将不能用于日志记录器中间件或 POST 路由处理程序，因为此时 request.body 将是一个_undefined_。

<!-- It's also important that the middleware for handling unsupported routes is next to the last middleware that is loaded into Express, just before the error handler. -->
同样重要的是，用于处理不支持路由的中间件位于加载到 Express 的最后一个中间件的旁边，就在错误处理程序之前。

<!-- For example, the following loading order would cause an issue: -->
例如，下面的加载顺序会导致一个问题:

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
现在，对未知端点的处理先于 HTTP 请求处理程序。 由于未知端点处理程序使用<i>404未知端点</i> 响应所有请求，在未知端点中间件发送响应之后，将不会调用任何路由或中间件。 唯一的例外是错误处理程序，它需要出现在未知的端点处理程序之后的最后一个端点。

### Other operations
【其他操作】

<!-- Let's add some missing functionality to our application, including deleting and updating an individual note. -->
让我们为我们的应用添加一些缺失的功能，包括删除和更新单个便笺。

<!-- The easiest way to delete a note from the database is with the [findByIdAndRemove](https://mongoosejs.com/docs/api.html#model_Model.findByIdAndRemove) method: -->
从数据库中删除便笺最简单的方法是使用[findByIdAndRemove](https://mongoosejs.com/docs/api.html#model_model.findByIdAndRemove)方法:

```js
app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})
```

<!-- In both of the "successful" cases of deleting a resource, the backend responds with the status code <i>204 no content</i>. The two different cases are deleting a note that exists, and deleting a note that does not exist in the database. The _result_ callback parameter could be used for checking if a resource actually was deleted, and we could use that information for returning different status codes for the two cases if we deemed it necessary. Any exception that occurs is passed onto the error handler. -->
在删除资源的两个“成功”案例中，后端都使用状态码 <i>204 no content</i>.进行响应。 两种不同的情况是删除已存在的便笺，以及删除数据库中不存在的便笺。 结果回调参数可用于检查资源是否实际被删除，如果认为有必要，我们可以使用该信息为两种情况返回不同的状态代码。 发生的任何异常都会传递到错误处理程序上。

<!-- The toggling of the importance of a note can be easily accomplished with the [findByIdAndUpdate](https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate) method. -->
通过[findbyidanddupdate](https://mongoosejs.com/docs/api.html#model_model.findByIdAndUpdate)方法可以轻松地切换便笺的重要性。

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

<!-- In the code above, we also allow the content of the note to be edited. However, we will not support changing the creation date for obvious reasons. -->
在上面的代码中，我们也允许编辑便笺的内容。 然而，出于显而易见的原因，我们不支持更改创建日期。

<!-- Notice that the <em>findByIdAndUpdate</em> method receives a regular JavaScript object as its parameter, and not a new note object created with the <em>Note</em> constructor function. -->
注意，<em>findByIdAndUpdate</em> 方法接收一个常规的 JavaScript 对象作为参数，而不是用  <em>Note</em>  构造函数创建的新便笺对象。

<!-- There is one important detail regarding the use of the <em>findByIdAndUpdate</em> method. By default, the <em>updatedNote</em> parameter of the event handler receives the original document [without the modifications](https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate). We added the optional <code>{ new: true }</code> parameter, which will cause our event handler to be called with the new modified document instead of the original. -->
关于 <em>findByIdAndUpdate</em>方法的使用有一个重要的细节。 默认情况下，事件处理程序的 <em>updatedNote</em>  参数接收原始文档[无需修改](https://mongoosejs.com/docs/api.html#model_model.findbyidandupdate)。 我们添加了可选的代码<code>{ new: true }</code>  参数，这将导致使用新修改的文档而不是原始文档调用事件处理程序。

<!-- After testing the backend directly with Postman and the VS Code REST client, we can verify that it seems to work. The frontend also appears to work with the backend using the database.  -->
在使用 Postman 和 VS Code REST 客户端直接测试后端之后，我们可以验证它似乎可以工作。 前端似乎也与使用数据库的后端一起工作。

<!-- You can find the code for our current application in its entirety in the <i>part3-5</i> branch of [this github repository](https://github.com/fullstack-hy/part3-notes-backend/tree/part3-5). -->
您可以在[this github repository](https://github.com/fullstack-hy/part3-notes-backend/tree/part3-5).的<i>part3-5</i> 分支中找到我们当前应用的全部代码。

</div>


<div class="tasks">


### Exercises 3.15.-3.18.
#### 3.15: Phonebook database, 步骤3
<!-- Change the backend so that deleting phonebook entries is reflected in the database. -->
更改后端，以便删除电话簿条目反映在数据库中。

<!-- Verify that the frontend still works after making the changes. -->
验证前端在进行更改后是否仍然可用。

#### 3.16: Phonebook database, 步骤4
<!-- Move the error handling of the application to a new error handler middleware.  -->
将应用的错误处理移动到新的错误处理程序中间件。

#### 3.17*: Phonebook database, 步骤5
<!-- If the user tries to create a new phonebook entry for a person whose name is already in the phonebook, the frontend will try to update the phone number of the existing entry by making an HTTP PUT request to the entry's unique URL. -->
如果用户试图为名字已经在电话簿中的人创建一个新的电话簿条目，前端将通过向条目的唯一 URL 发出 HTTP PUT 请求来更新现有条目的电话号码。

<!-- Modify the backend to support this request. -->
修改后端以支持此请求。

<!-- Verify that the frontend works after making your changes. -->
在进行更改后，验证前端是否工作正常。

#### 3.18*: Phonebook database 步骤6
<!-- Also update the handling of the <i>api/persons/:id</i> and <i>info</i> routes to use the database, and verify that they work directly with the browser, Postman, or VS Code REST client. -->
还要更新使用数据库的 <i>api/persons/:id</i> 和<i>info</i> 路由的处理，并验证它们是否直接与浏览器、Postman或 VS Code REST 客户端一起工作。

<!-- Inspecting an individual phonebook entry from the browser should look like this: -->
通过浏览器查看一个电话簿条目应该是这样的:

![](../../images/3/49.png)


</div>

