---
mainImage: ../../../images/part-3.svg
part: 3
letter: c
lang: zh
---

<div class="content">

<!-- Before we move into the main topic of persisting data in a database, we will take a look at a few different ways of debugging Node applications.-->
 在我们进入在数据库中持久化数据的主要话题之前，我们将看一下调试Node应用的几种不同方法。

### Debugging Node applications

<!-- Debugging Node applications is slightly more difficult than debugging JavaScript running in your browser. Printing to the console is a tried and true method, and it's always worth doing. There are people who think that more sophisticated methods should be used instead, but I disagree. Even the world's elite open source developers [use](https://tenderlovemaking.com/2016/02/05/i-am-a-puts-debuggerer.html) this [method](https://swizec.com/blog/javascript-debugging-slightly-beyond-consolelog/).-->
 调试Node应用比调试在浏览器中运行的JavaScript要稍微困难一些。打印到控制台是一个屡试不爽的方法，它总是值得一做。有些人认为应该用更复杂的方法来代替，但我不同意。即使是世界上最优秀的开源开发者也[使用](https://tenderlovemaking.com/2016/02/05/i-am-a-puts-debuggerer.html)这种[方法](https://swizec.com/blog/javascript-debugging-slightly-beyond-consolelog/)。


#### Visual Studio Code

<!-- The Visual Studio Code debugger can be useful in some situations. You can launch the application in debugging mode like this:-->
Visual Studio Code调试器在某些情况下是有用的。你可以像这样在调试模式下启动应用。

![](../../images/3/35x.png)

<!-- Note that the application shouldn't be running in another console, otherwise the port will already be in use.-->
 注意，该应用不应该在另一个控制台中运行，否则该端口将已经被使用。

<!-- __NB__ A newer version of Visual Studio Code may have _Run_ instead of _Debug_. Furthermore, you may have to configure your _launch.json_ file to start debugging. This can be done by choosing _Add Configuration..._ on the drop-down menu, which is located next to the green play button and above _VARIABLES_ menu, and select _Run "npm start" in a debug terminal_. For more detailed setup instructions, visit Visual Studio Code's [Debugging documentation](https://code.visualstudio.com/docs/editor/debugging).-->
 __NB__ 较新版本的Visual Studio Code可能有_Run_而不是_Debug_。此外，你可能需要配置你的_launch.json_文件来启动调试。这可以通过在下拉菜单中选择_Add Configuration..._来完成，该菜单位于绿色播放按钮旁边和_VARIABLES_菜单上面，并选择_Run "npm start" in a debug terminal_。关于更详细的设置说明，请访问Visual Studio Code's [调试文档](https://code.visualstudio.com/docs/editor/debugging)。

<!-- Below you can see a screenshot where the code execution has been paused in the middle of saving a new note:-->
下面你可以看到一个截图，在保存新的注释的过程中，代码的执行被暂停了。

![](../../images/3/36x.png)

<!-- The execution has stopped at the <i>breakpoint</i> in line 63. In the console you can see the value of the <i>note</i> variable. In the top left window you can see other things related to the state of the application.-->
 执行在第63行的<i>突破点</i>处停止。在控制台中，你可以看到<i>note</i>变量的值。在左上角的窗口中，你可以看到与应用的状态有关的其他东西。

<!-- The arrows at the top can be used for controlling the flow of the debugger.-->
顶部的箭头可以用来控制调试器的流程。

<!-- For some reason, I don't use the Visual Studio Code debugger a whole lot.-->
由于某些原因，我并不经常使用Visual Studio Code的调试器。

#### Chrome dev tools

<!-- Debugging is also possible with the Chrome developer console by starting your application with the command:-->
 调试也可以通过Chrome浏览器的开发者控制台，用命令启动你的应用。

```bash
node --inspect index.js
```

<!-- You can access the debugger by clicking the green icon - the node logo - that appears in the Chrome developer console:-->
 你可以通过点击Chrome开发者控制台中出现的绿色图标--节点标志--来访问调试器。

![](../../images/3/37.png)

<!-- The debugging view works the same way as it did with React applications. The <i>Sources</i> tab can be used for setting breakpoints where the execution of the code will be paused.-->
 调试视图的工作方式与React应用的工作方式相同。<i>Sources</i>标签可用于设置断点，代码的执行将被暂停。

![](../../images/3/38eb.png)

<!-- All of the application's <i>console.log</i> messages will appear in the <i>Console</i> tab of the debugger. You can also inspect values of variables and execute your own JavaScript code.-->
所有应用的<i>console.log</i>消息将出现在调试器的<i>Console</i>标签中。你也可以检查变量的值和执行你自己的JavaScript代码。

![](../../images/3/39ea.png)

#### Question everything

<!-- Debugging Full Stack applications may seem tricky at first. Soon our application will also have a database in addition to the frontend and backend, and there will be many potential areas for bugs in the application.-->
 调试全堆栈应用起初可能看起来很棘手。很快，我们的应用除了前端和后端之外，还会有一个数据库，应用中会有许多潜在的错误区域。

<!-- When the application "does not work", we have to first figure out where the problem actually occurs. It's very common for the problem to exist in a place where you didn't expect it to, and it can take minutes, hours, or even days before you find the source of the problem.-->
当应用 "不工作 "时，我们首先要弄清楚问题究竟发生在哪里。问题存在于一个你意想不到的地方是很常见的，在你找到问题的源头之前，可能需要几分钟、几小时甚至几天。

<!-- The key is to be systematic. Since the problem can exist anywhere, <i>you must question everything</i>, and eliminate all possibilities one by one. Logging to the console, Postman, debuggers, and experience will help.-->
 关键是要有系统。由于问题可能存在于任何地方，<i>你必须质疑一切</i>，并逐一排除所有可能性。记录到控制台、Postman、调试器和经验会有帮助。

<!-- When bugs occur, <i>the worst of all possible strategies</i> is to continue writing code. It will guarantee that your code will soon have even more bugs, and debugging them will be even more difficult. The [stop and fix](http://gettingtolean.com/toyota-principle-5-build-culture-stopping-fix/) principle from Toyota Production Systems is very effective in this situation as well.-->
当bug发生时，<i>最糟糕的策略</i>是继续写代码。这将保证你的代码很快就会出现更多的bug，而调试它们将更加困难。丰田生产系统中的[停止和修复](http://gettingtolean.com/toyota-principle-5-build-culture-stopping-fix/)原则在这种情况下也是非常有效的。

### MongoDB

<!-- In order to store our saved notes indefinitely, we need a database. Most of the courses taught at the University of Helsinki use relational databases. In most parts of this course we will use [MongoDB](https://www.mongodb.com/) which is a so-called [document database](https://en.wikipedia.org/wiki/Document-oriented_database).-->
为了无限期地存储我们保存的笔记，我们需要一个数据库。在赫尔辛基大学教授的大多数课程都使用关系型数据库。在本课程的大部分内容中，我们将使用[MongoDB](https://www.mongodb.com/)，这是一个所谓的[文档数据库](https://en.wikipedia.org/wiki/Document-oriented_database)。

<!-- The reason for using Mongo as the database is it's lower complexity with respect to a relational database. [The part 13](https://fullstackopen.com/en/part13) of the course shows how to build node.js backends that use a relational database.-->
 使用Mongo作为数据库的原因是它比关系型数据库的复杂度低。[课程的第13部分](https://fullstackopen.com/en/part13)展示了如何构建使用关系型数据库的node.js后端。

<!-- Document databases differ from relational databases in how they organize data as well as the query languages they support. Document databases are usually categorized under the [NoSQL](https://en.wikipedia.org/wiki/NoSQL) umbrella term.-->
 文档数据库与关系型数据库的区别在于它们如何组织数据以及它们支持的查询语言。文档数据库通常被归入[NoSQL](https://en.wikipedia.org/wiki/NoSQL)的伞状术语中。

<!-- You can read more about document databases and NoSQL from the course material for [week 7](https://tikape-s18.mooc.fi/part7/) of the Introduction to Databases course. Unfortunately the material is currently only available in Finnish.-->
你可以从数据库入门课程[第7周](https://tikape-s18.mooc.fi/part7/)的教材中阅读更多关于文档数据库和NoSQL的内容。不幸的是，该材料目前只有芬兰语版本。

<!-- Read now the chapters on [collections](https://docs.mongodb.com/manual/core/databases-and-collections/) and [documents](https://docs.mongodb.com/manual/core/document/) from the MongoDB manual to get a basic idea on how a document database stores data.-->
 现在阅读MongoDB手册中关于[集合](https://docs.mongodb.com/manual/core/databases-and-collections/)和[文档](https://docs.mongodb.com/manual/core/document/)的章节，以获得关于文档数据库如何存储数据的基本概念。

<!-- Naturally, you can install and run MongoDB on your own computer. However, the internet is also full of Mongo database services that you can use. Our preferred MongoDB provider in this course will be [MongoDB Atlas](https://www.mongodb.com/atlas/database).-->
 当然，你可以在自己的计算机上安装和运行MongoDB。然而，互联网上也有很多Mongo数据库服务，你可以使用。在本课程中，我们首选的MongoDB提供商将是[MongoDB Atlas](https://www.mongodb.com/atlas/database)。



<!-- Once you've created and logged into your account, let us start by selecting the free option:-->
 一旦你创建并登录了你的账户，让我们从选择免费选项开始。

![](../../images/3/mongo1.png)

<!-- Pick the cloud provider and location and create the cluster:-->
 选择云提供商和地点，并创建集群。

![](../../images/3/mongo2.png)

<!-- Let's wait for the cluster to be ready for use. This can takes some minutes.-->
 让我们等待集群准备就绪，以供使用。这可能需要几分钟时间。

<!-- **NB** do not continue before the cluster is ready.-->
 **NB** 在集群准备好之前，不要继续。

<!-- Let's use the <i>security</i> tab for creating user credentials for the database. Please note that these are not the same credentials you use for logging into MongoDB Atlas. These will be used for your application to connect to the database.-->
 让我们使用<i>安全</i>标签为数据库创建用户证书。请注意，这些并不是你用来登录MongoDB Atlas的相同凭证。这些将被用于你的应用连接到数据库。

![](../../images/3/mongo3.png)

<!-- Next we have to define the IP addresses that are allowed access to the database. For the sake of simplicity we will allow access from all IP addresses:-->
 接下来我们必须定义允许访问数据库的IP地址。为了简单起见，我们将允许来自所有IP地址的访问。

![](../../images/3/mongo4.png)

<!-- Finally we are ready to connect to our database. Start by clicking <i>connect</i>:-->
 最后我们准备连接到我们的数据库。首先点击<i>连接</i>。

![](../../images/3/mongo5.png)

<!-- and choose <i>Connect your application</i>:-->
 然后选择<i>连接你的应用</i>。

![](../../images/3/mongo6.png)

<!-- The view displays the <i>MongoDB URI</i>, which is the address of the database that we will supply to the MongoDB client library we will add to our application.-->
 视图显示<i>MongoDB URI</i>，这是我们将提供给MongoDB客户端库的数据库地址，我们将把它添加到我们的应用中。

<!-- The address looks like this:-->
这个地址如下所示：

```bash
mongodb+srv://fullstack:$<password>@cluster0.o1opl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
```

<!-- We are now ready to use the database.-->
 我们现在已经准备好使用数据库了。

<!-- We could use the database directly from our JavaScript code with the [official MongoDb Node.js driver](https://mongodb.github.io/node-mongodb-native/) library, but it is quite cumbersome to use. We will instead use the [Mongoose](http://mongoosejs.com/index.html) library that offers a higher level API.-->
 我们可以通过[官方MongoDb Node.js驱动](https://mongodb.github.io/node-mongodb-native/)库从我们的JavaScript代码中直接使用数据库，但它的使用相当麻烦。我们将转而使用[Mongoose](http://mongoosejs.com/index.html)库，它提供了一个更高级别的API。

<!-- Mongoose could be described as an <i>object document mapper</i> (ODM), and saving JavaScript objects as Mongo documents is straightforward with this library.-->
 Mongoose可以被描述为一个<i>对象文档映射器</i>（ODM），使用这个库可以直接将JavaScript对象保存为Mongo文档。

<!-- Let's install Mongoose:-->
 我们来安装Mongoose。

```bash
npm install mongoose
```

<!-- Let's not add any code dealing with Mongo to our backend just yet. Instead, let's make a practice application by creating a new file, <i>mongo.js</i>:-->
 我们先不要在后端添加任何处理Mongo的代码。相反，让我们通过创建一个新的文件，<i>mongo.js</i>来做一个实践应用。

```js
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.o1opl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

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

<!-- **NB:** Depending on which region you selected when building your cluster, the <i>MongoDB URI</i> may be different from the example provided above. You should verify and use the correct URI that was generated from MongoDB Atlas.-->
 **NB:**取决于你在构建集群时选择的地区，<i>MongoDB URI</i>可能与上面提供的例子不同。你应该验证并使用从MongoDB Atlas生成的正确URI。

<!-- The code also assumes that it will be passed the password from the credentials we created in MongoDB Atlas, as a command line parameter. We can access the command line parameter like this:-->
 该代码还假定它将从我们在MongoDB Atlas中创建的凭证中获得密码，作为一个命令行参数。我们可以像这样访问命令行参数。

```js
const password = process.argv[2]
```

<!-- When the code is run with the command <i>node mongo.js password</i>, Mongo will add a new document to the database.-->
 当代码以命令<i>node mongo.js password</i>运行时，Mongo将向数据库添加一个新的文档。

<!-- **NB:** Please note the password is the password created for the database user, not your MongoDB Atlas password.  Also, if you created password with special characters, then you'll need to [URL encode that password](https://docs.atlas.mongodb.com/troubleshoot-connection/#special-characters-in-connection-string-password).-->
 **NB:**请注意密码是为数据库用户创建的密码，而不是你的MongoDB Atlas密码。  另外，如果你创建的密码带有特殊字符，那么你''需要对该密码进行[URL编码](https://docs.atlas.mongodb.com/troubleshoot-connection/#special-characters-in-connection-string-password)。

<!-- We can view the current state of the database from the MongoDB Atlas from <i>Browse collections</i>, in the Database tab.-->
 我们可以从MongoDB Atlas的<i>浏览集合</i>，在数据库标签中查看数据库的当前状态。

![](../../images/3/mongo7.png)

<!-- As the view states, the <i>document</i> matching the note has been added to the <i>notes</i> collection in the <i>myFirstDatabase</i> database.-->
正如该视图所述，与笔记相匹配的<i>文件</i>已经被添加到<i>myFirstDatabase</i>数据库的<i>笔记</i>集合中。

![](../../images/3/mongo8.png)

<!-- Let's destroy the default database <i>myFirstDatabase</i> and change the name of database referenced in our connection string to <i>noteApp</i> instead, by modifying the URI:-->
 让我们销毁默认的数据库<i>myFirstDatabase</i>，通过修改URI，将连接字符串中引用的数据库名称改为<i>noteApp</i>。

```bash
mongodb+srv://fullstack:$<password>@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority
```

<!-- Let's run our code again:-->
 让我们再次运行我们的代码。

![](../../images/3/mongo9.png)

<!-- The data is now stored in the right database. The view also offers the <i>create database</i> functionality, that can be used to create new databases from the website. Creating the database like this is not necessary, since MongoDB Atlas automatically creates a new database when an application tries to connect to a database that does not exist yet.-->
 数据现在被储存在正确的数据库中。视图还提供了<i>创建数据库</i>功能，可以用来从网站上创建新的数据库。像这样创建数据库是没有必要的，因为当一个应用试图连接到一个还不存在的数据库时，MongoDB Atlas会自动创建一个新的数据库。

### Schema

<!-- After establishing the connection to the database, we define the [schema](http://mongoosejs.com/docs/guide.html) for a note and the matching [model](http://mongoosejs.com/docs/models.html):-->
 在建立与数据库的连接后，我们为一个笔记定义[模式](http://mongoosejs.com/docs/guide.html)和匹配的[模型](http://mongoosejs.com/docs/models.html)。

```js
const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)
```

<!-- First we define the [schema](http://mongoosejs.com/docs/guide.html) of a note that is stored in the _noteSchema_ variable. The schema tells Mongoose how the note objects are to be stored in the database.-->
 首先我们定义一个笔记的[模式](http://mongoosejs.com/docs/guide.html)，它被存储在_noteSchema_变量中。该模式告诉Mongoose如何将笔记对象存储在数据库中。

<!-- In the _Note_ model definition, the first <i>"Note"</i> parameter is the singular name of the model. The name of the collection will be the lowercased plural <i>notes</i>, because the [Mongoose convention](http://mongoosejs.com/docs/models.html) is to automatically name collections as the plural (e.g. <i>notes</i>) when the schema refers to them in the singular (e.g. <i>Note</i>).-->
 在_Note_模型定义中，第一个<i>"Note"</i>参数是模型的单数名称。集合的名称将是小写的复数<i>notes</i>，因为[Mongoose惯例](http://mongoosejs.com/docs/models.html)是自动将集合命名为复数(例如：<i>notes</i>)，而模式是以单数指代它们(例如：<i>Note</i>)。

<!-- Document databases like Mongo are <i>schemaless</i>, meaning that the database itself does not care about the structure of the data that is stored in the database. It is possible to store documents with completely different fields in the same collection.-->
 像Mongo这样的文档数据库是<i>无模式</i>，意味着数据库本身并不关心存储在数据库中的数据结构。有可能在同一个集合中存储具有完全不同字段的文档。

<!-- The idea behind Mongoose is that the data stored in the database is given a <i>schema at the level of the application</i> that defines the shape of the documents stored in any given collection.-->
 Mongoose背后的想法是，存储在数据库中的数据在应用层面上被赋予了一个<i>schema</i>，它定义了存储在任何给定集合中的文档的形状。

### Creating and saving objects

<!-- Next, the application creates a new note object with the help of the <i>Note</i> [model](http://mongoosejs.com/docs/models.html):-->
 接下来，应用在<i>Note</i>[模型](http://mongoosejs.com/docs/models.html)的帮助下创建一个新的笔记对象。

```js
const note = new Note({
  content: 'HTML is Easy',
  date: new Date(),
  important: false,
})
```

<!-- Models are so-called <i>constructor functions</i> that create new JavaScript objects based on the provided parameters. Since the objects are created with the model's constructor function, they have all the properties of the model, which include methods for saving the object to the database.-->
 模型是所谓的<i>构造函数</i>，根据提供的参数创建新的JavaScript对象。由于对象是用模型的构造函数创建的，它们具有模型的所有属性，其中包括将对象保存到数据库的方法。

<!-- Saving the object to the database happens with the appropriately named _save_ method, that can be provided with an event handler with the _then_ method:-->
 将对象保存到数据库是通过适当命名的_save_方法发生的，它可以通过_then_方法提供一个事件处理程序。

```js
note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})
```

<!-- When the object is saved to the database, the event handler provided to _then_  gets called. The event handler closes the database connection with the command <code>mongoose.connection.close()</code>. If the connection is not closed, the program will never finish its execution.-->
 当对象被保存到数据库时，提供给_then_的事件处理程序被调用。该事件处理程序通过<code>mongoose.connection.close()</code>命令关闭数据库连接。如果连接没有被关闭，程序将永远无法完成其执行。

<!-- The result of the save operation is in the _result_ parameter of the event handler. The result is not that interesting when we're storing one object to the database. You can print the object to the console if you want to take a closer look at it while implementing your application or during debugging.-->
 保存操作的结果是在事件处理程序的_result_参数中。当我们将一个对象存储到数据库时，结果并不那么有趣。如果你想在实现你的应用时或在调试时仔细观察，你可以把对象打印到控制台。

<!-- Let's also save a few more notes by modifying the data in the code and by executing the program again.-->
 我们还可以通过修改代码中的数据和再次执行程序来保存一些注释。

<!-- **NB:** Unfortunately the Mongoose documentation is not very consistent, with parts of it using callbacks in its examples and other parts, other styles, so it is not recommended to copy paste code directly from there. Mixing promises with old-school callbacks in the same code is not recommended.-->
 **NB:**不幸的是，Mongoose文档不是很一致，它的部分例子中使用了回调，而其他部分则是其他风格，所以不建议直接从那里复制粘贴代码。不建议在同一段代码中混合使用承诺和老式的回调。

### Fetching objects from the database

<!-- Let's comment out the code for generating new notes and replace it with the following:-->
 让我们注释掉生成新注释的代码，用下面的内容来代替它。

```js
Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})
```

<!-- When the code is executed, the program prints all the notes stored in the database:-->
 当代码被执行时，程序打印出所有存储在数据库中的笔记。

![](../../images/3/70ea.png)

<!-- The objects are retrieved from the database with the [find](https://mongoosejs.com/docs/api.html#model_Model.find) method of the _Note_ model. The parameter of the method is an object expressing search conditions. Since the parameter is an empty object<code>{}</code>, we get all of the notes stored in the  _notes_ collection.-->
 对象是用_Note_模型的[find](https://mongoosejs.com/docs/api.html#model_Model.find)方法从数据库中检索出来的。该方法的参数是一个表达搜索条件的对象。由于参数是一个空对象<code>{}</code>，我们得到了存储在_notes_集合中的所有笔记。

<!-- The search conditions adhere to the Mongo search query [syntax](https://docs.mongodb.com/manual/reference/operator/).-->
 搜索条件遵守Mongo的搜索查询[语法](https://docs.mongodb.com/manual/reference/operator/)。

<!-- We could restrict our search to only include important notes like this:-->
 我们可以限制我们的搜索，只包括重要的笔记，像这样。

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
 用MongoDB Atlas为电话簿应用创建一个基于云的MongoDB数据库。

<!-- Create a <i>mongo.js</i> file in the project directory, that can be used for adding entries to the phonebook, and for listing all of the existing entries in the phonebook.-->
 在项目目录下创建一个<i>mongo.js</i>文件，可用于向电话簿添加条目，以及列出电话簿中的所有现有条目。

<!-- **NB:** Do not include the password in the file that you commit and push to GitHub!-->
 **NB:**不要在你提交和推送到GitHub的文件中包含密码!

<!-- The application should work as follows. You use the program by passing three command-line arguments (the first is the password), e.g.:-->
 该应用应按如下方式工作。你通过传递三个命令行参数（第一个参数是密码）来使用该程序，例如。

```bash
node mongo.js yourpassword Anna 040-1234556
```

<!-- As a result, the application will print:-->
 结果是，该程序将打印。

```bash
added Anna number 040-1234556 to phonebook
```

<!-- The new entry to the phonebook will be saved to the database. Notice that if the name contains whitespace characters, it must be enclosed in quotes:-->
 电话簿的新条目将被保存到数据库中。注意，如果名字中含有空白字符，必须用引号括起来。

```bash
node mongo.js yourpassword "Arto Vihavainen" 045-1232456
```

<!-- If the password is the only parameter given to the program, meaning that it is invoked like this:-->
 如果密码是给程序的唯一参数，也就是说，它是像这样被调用的。

```bash
node mongo.js yourpassword
```

<!-- Then the program should display all of the entries in the phonebook:-->
 那么该程序应该显示电话簿中的所有条目。

<pre>
phonebook:
Anna 040-1234556
Arto Vihavainen 045-1232456
Ada Lovelace 040-1231236
</pre>

<!-- You can get the command-line parameters from the [process.argv](https://nodejs.org/docs/latest-v8.x/api/process.html#process_process_argv) variable.-->
 你可以从[process.argv](https://nodejs.org/docs/latest-v8.x/api/process.html#process_process_argv)变量获得命令行参数。

<!-- **NB: do not close the connection in the wrong place**. E.g. the following code will not work:-->
 **NB：不要在错误的地方关闭连接**。例如，下面的代码将无法工作。

```js
Person
  .find({})
  .then(persons=> {
    // ...
  })

mongoose.connection.close()
```

<!-- In the code above the <i>mongoose.connection.close()</i> command will get executed immediately after the <i>Person.find</i> operation is started. This means that the database connection will be closed immediately, and the execution will never get to the point where <i>Person.find</i> operation finishes and the <i>callback</i> function gets called.-->
 在上面的代码中，<i>mongoose.connection.close()</i>命令将在<i>Person.find</i>操作开始后立即被执行。这意味着数据库连接将被立即关闭，而执行将永远不会到达<i>Person.find</i>操作结束和<i>callback</i>函数被调用的位置。

<!-- The correct place for closing the database connection is at the end of the callback function:-->
 关闭数据库连接的正确位置是在回调函数的最后。

```js
Person
  .find({})
  .then(persons=> {
    // ...
    mongoose.connection.close()
  })
```

<!-- **NB:** If you define a model with the name <i>Person</i>, mongoose will automatically name the associated collection as <i>people</i>.-->
 **NB:** 如果你定义了一个名字为<i>Person</i>的模型，mongoose会自动将相关的集合命名为<i>people</i>。

</div>

<div class="content">

### Backend connected to a database

<!-- Now we have enough knowledge to start using Mongo in our application.-->
 现在我们有足够的知识在我们的应用中开始使用Mongo。

<!-- Let's get a quick start by copy pasting the Mongoose definitions to the <i>index.js</i> file:-->
 让我们通过复制粘贴Mongoose的定义到<i>index.js</i>文件来快速开始。

```js
const mongoose = require('mongoose')

// DO NOT SAVE YOUR PASSWORD TO GITHUB!!
const url =
  `mongodb+srv://fullstack:<password>@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)
```

<!-- Let's change the handler for fetching all notes to the following form:-->
 让我们把获取所有笔记的处理程序改为以下形式。

```js
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})
```

<!-- We can verify in the browser that the backend works for displaying all of the documents:-->
 我们可以在浏览器中验证后端是否能显示所有的文件。

![](../../images/3/44ea.png)

<!-- The application works almost perfectly. The frontend assumes that every object has a unique id in the <i>id</i> field. We also don't want to return the mongo versioning field <i>\_\_v</i> to the frontend.-->
 该应用几乎完美地工作。前台假设每个对象在<i>id</i>字段中都有一个唯一的id。我们也不想把mongo的版本字段<i>\_\_v</i>返回给前台。

<!-- One way to format the objects returned by Mongoose is to [modify](https://stackoverflow.com/questions/7034848/mongodb-output-id-instead-of-id) the _toJSON_ method of the schema, which is used on all instances of the models produced with that schema. Modifying the method works like this:-->
 格式化Mongoose返回的对象的一种方法是[修改](https://stackoverflow.com/questions/7034848/mongodb-output-id-instead-of-id)模式的_toJSON_方法，该方法用于用该模式生成的模型的所有实例。修改该方法的工作原理是这样的。

```js
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
```

<!-- Even though the <i>\_id</i> property of Mongoose objects looks like a string, it is in fact an object. The _toJSON_ method we defined transforms it into a string just to be safe. If we didn't make this change, it would cause more harm for us in the future once we start writing tests.-->
 尽管Mongoose对象的<i>_id</i>属性如下所示：一个字符串，但它实际上是一个对象。为了安全起见，我们定义的_toJSON_方法将其转化为一个字符串。如果我们不做这个改变，一旦我们开始写测试，就会对我们造成更大的伤害。

<!-- Let's respond to the HTTP request with a list of objects formatted with the _toJSON_ method:-->
 让我们用一个用_toJSON_方法格式化的对象列表来响应HTTP请求。

```js
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})
```

<!-- Now the _notes_ variable is assigned to an array of objects returned by Mongo. When the response is sent in the JSON format, the _toJSON_ method of each object in the array is called automatically by the [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) method.-->
 现在_notes_变量被分配给Mongo返回的一个对象数组。当响应以JSON格式发送时，数组中每个对象的_toJSON_方法被[JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)方法自动调用。

### Database configuration into its own module

<!-- Before we refactor the rest of the backend to use the database, let's extract the Mongoose specific code into its own module.-->
 在我们重构后端其他部分以使用数据库之前，让我们把Mongoose的具体代码提取到自己的模块中。

<!-- Let's create a new directory for the module called <i>models</i>, and add a file called <i>note.js</i>:-->
 让我们为该模块创建一个名为<i>models</i>的新目录，并添加一个名为<i>note.js</i>的文件。

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

<!-- Defining Node [modules](https://nodejs.org/docs/latest-v8.x/api/modules.html) differs slightly from the way of defining [ES6 modules](/en/part2/rendering_a_collection_modules#refactoring-modules) in part 2.-->
 定义Node的[模块](https://nodejs.org/docs/latest-v8.x/api/modules.html)与第二章节中定义[ES6模块](/en/part2/rendering_a_collection_modules#refactoring-modules)的方式略有不同。

<!-- The public interface of the module is defined by setting a value to the _module.exports_ variable. We will set the value to be the <i>Note</i> model. The other things defined inside of the module, like the variables _mongoose_ and _url_ will not be accessible or visible to users of the module.-->
 模块的公共接口是通过给_module.exports_变量设置一个值来定义的。我们将设置该值为<i>Note</i>模型。其他定义在模块内部的东西，如变量_mongoose_和_url_将不会被模块的用户访问或看到。

<!-- Importing the module happens by adding the following line to <i>index.js</i>:-->
 通过在<i>index.js</i>中添加以下一行来导入该模块。

```js
const Note = require('./models/note')
```

<!-- This way the _Note_ variable will be assigned to the same object that the module defines.-->
这样，_Note_变量将被分配给模块定义的同一个对象。

<!-- The way that the connection is made has changed slightly:-->
连接的方式略有改变。

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

<!-- It's not a good idea to hardcode the address of the database into the code, so instead the address of the database is passed to the application via the <em>MONGODB_URI</em> environment variable.-->
 在代码中硬编码数据库的地址不是一个好主意，所以数据库的地址通过<em>MONGODB_URI</em>环境变量传递给应用。

<!-- The method for establishing the connection is now given functions for dealing with a successful and unsuccessful connection attempt. Both functions just log a message to the console about the success status:-->
 建立连接的方法现在被赋予了处理成功和不成功的连接尝试的函数。这两个函数都只是向控制台记录一条关于成功状态的信息。

![](../../images/3/45e.png)

<!-- There are many ways to define the value of an environment variable. One way would be to define it when the application is started:-->
 定义环境变量的值有很多方法。一种方法是在应用启动时定义它。

```bash
MONGODB_URI=address_here npm run dev
```

<!-- A more sophisticated way is to use the [dotenv](https://github.com/motdotla/dotenv#readme) library. You can install the library with the command:-->
 一种更复杂的方法是使用[dotenv](https://github.com/motdotla/dotenv#readme)库。你可以用命令来安装这个库。

```bash
npm install dotenv
```

<!-- To use the library, we create a <i>.env</i> file at the root of the project. The environment variables are defined inside of the file, and it can look like this:-->
 为了使用这个库，我们在项目的根部创建一个<i>.env</i>文件。环境变量被定义在该文件中，它如下所示：

```bash
MONGODB_URI=mongodb+srv://fullstack:<password>@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority
PORT=3001
```

<!-- We also added the hardcoded port of the server into the <em>PORT</em> environment variable.-->
 我们还在<em>PORT</em>环境变量中加入了服务器的硬编码端口。

<!-- **The <i>.env</i> file should be gitignored right away, since we do not want to publish any confidential information publicly online!**-->
 **这个<i>.env</i>文件应该马上被gitignored，因为我们不想在网上公开发布任何机密信息！**。

![](../../images/3/45ae.png)

<!-- The environment variables defined in the <i>.env</i> file can be taken into use with the expression <em>require('dotenv').config()</em> and you can reference them in your code just like you would reference normal environment variables, with the familiar <em>process.env.MONGODB_URI</em> syntax.-->
 在<i>.env</i>文件中定义的环境变量可以用表达式<em>require(''dotenv').config()</em>来使用，你可以在你的代码中引用它们，就像你引用普通的环境变量一样，用熟悉的<em>process.env.MONGODB_URI</em>语法。

<!-- Let's change the <i>index.js</i> file in the following way:-->
 让我们以如下方式改变<i>index.js</i>文件。

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

<!-- It's important that <i>dotenv</i> gets imported before the <i>note</i> model is imported. This ensures that the environment variables from the <i>.env</i> file are available globally before the code from the other modules is imported.-->
 在导入<i>note</i>模型之前，导入<i>dotenv</i>很重要。这可以确保在其他模块的代码被导入之前，<i>.env</i>文件中的环境变量是全局可用的。

<!-- Once the file .env has been gitignored, Heroku does not get the database url from the repository, so you have to set it yourself. That can be done through the heroku dashboard as follows:-->
 一旦.env文件被gitignored，Heroku就不会从版本库中获得数据库的网址，所以你必须自己设置它。这可以通过heroku仪表板完成，如下所示。

![](../../images/3/herokuConfig.png)

<!-- or from command line with the command:-->
 或者在命令行中使用命令。

```
heroku config:set MONGODB_URI='mongodb+srv://fullstack:<password>@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority'
```

### Using database in route handlers

<!-- Next, let's change the rest of the backend functionality to use the database.-->
 接下来，让我们改变其余的后台功能以使用数据库。

<!-- Creating a new note is accomplished like this:-->
 创建一个新的笔记是这样完成的。

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

<!-- The note objects are created with the _Note_ constructor function. The response is sent inside of the callback function for the _save_ operation. This ensures that the response is sent only if the operation succeeded. We will discuss error handling a little bit later.-->
 笔记对象是用_Note_构造函数创建的。响应是在_save_操作的回调函数中发送的。这确保了只有在操作成功的情况下才会发送响应。我们将在稍后讨论错误处理。

<!-- The _savedNote_ parameter in the callback function is the saved and newly created note. The data sent back in the response is the formatted version created with the _toJSON_ method:-->
 回调函数中的_savedNote_参数是保存的和新创建的笔记。响应中送回的数据是用_toJSON_方法创建的格式化版本。

```js
response.json(savedNote)
```

<!-- Using Mongoose's [findById](https://mongoosejs.com/docs/api.html#model_Model.findById) method, fetching an individual note gets changed into the following:-->
 使用Mongoose's [findById](https://mongoosejs.com/docs/api.html#model_Model.findById)方法，获取一个单独的笔记被改变成以下内容。

```js
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(note => {
    response.json(note)
  })
})
```

### Verifying frontend and backend integration

<!-- When the backend gets expanded, it's a good idea to test the backend first with **the browser, Postman or the VS Code REST client**. Next, let's try creating a new note after taking the database into use:-->
 当后端被扩展时，最好先用**浏览器、Postman或VS Code REST客户端测试后端。接下来，让我们试着在使用数据库后创建一个新的笔记。

![](../../images/3/46e.png)

<!-- Only once everything has been verified to work in the backend, is it a good idea to test that the frontend works with the backend. It is highly inefficient to test things exclusively through the frontend.-->
 只有当所有的东西都在后端得到验证后，测试前端与后端的工作情况才是一个好主意。完全通过前台来测试是非常低效的。

<!-- It's probably a good idea to integrate the frontend and backend one functionality at a time. First, we could implement fetching all of the notes from the database and test it through the backend endpoint in the browser. After this, we could verify that the frontend works with the new backend. Once everything seems to work, we would move onto the next feature.-->
 把前台和后台的功能一次次整合起来可能是个好主意。首先，我们可以实现从数据库中获取所有的笔记，并通过浏览器中的后台端点进行测试。之后，我们可以验证前台是否与新的后台一起工作。一旦一切正常，我们就可以进入下一个功能。

<!-- Once we introduce a database into the mix, it is useful to inspect the state persisted in the database, e.g. from the control panel in MongoDB Atlas. Quite often little Node helper programs like the <i>mongo.js</i> program we wrote earlier can be very helpful during development.-->
 一旦我们引入数据库，检查数据库中持久化的状态是很有用的，例如从MongoDB Atlas的控制面板中。很多时候，像我们之前写的<i>mongo.js</i>程序这样的小Node辅助程序在开发过程中会很有帮助。

<!-- You can find the code for our current application in its entirety in the <i>part3-4</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-4).-->
 你可以在[这个Github仓库](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-4)的<i>part3-4</i>分支中找到我们当前应用的全部代码。

</div>

<div class="tasks">

### Exercises 3.13.-3.14.

<!-- The following exercises are pretty straightforward, but if your frontend stops working with the backend, then finding and fixing the bugs can be quite interesting.-->
 下面的练习是非常直接的，但如果你的前端与后端停止工作，那么寻找和修复错误会相当有趣。

#### 3.13: Phonebook database, step1

<!-- Change the fetching of all phonebook entries so that the data is <i>fetched from the database</i>.-->
 改变所有电话簿条目的获取方式，使数据是从数据库中获取的<i></i>。

<!-- Verify that the frontend works after the changes have been made.-->
 验证前台在修改后是否能工作。

<!-- In the following exercises, write all Mongoose-specific code into its own module, just like we did in the chapter [Database configuration into its own module](/en/part3/saving_data_to_mongo_db#database-configuration-into-its-own-module).-->
 在下面的练习中，把所有Mongoose特定的代码写进自己的模块，就像我们在[数据库配置进自己的模块](/en/part3/saving_data_to_mongo_db#database-configuration-into-its-own-module)一章中做的那样。

#### 3.14: Phonebook database, step2

<!-- Change the backend so that new numbers are <i>saved to the database</i>. Verify that your frontend still works after the changes.-->
 改变后端，使新号码被<i>保存到数据库</i>。验证你的前台在更改后仍然工作。

<!-- At this point, you can choose to simply allow users to create all phonebook entries. At this stage, the phonebook can have multiple entries for a person with the same name.-->
 在这一点上，你可以选择简单地允许用户创建所有的电话簿条目。在这个阶段，电话簿中可以有多个同名的条目。

</div>

<div class="content">

### Error handling

<!-- If we try to visit the URL of a note with an id that does not actually exist e.g. <http://localhost:3001/api/notes/5c41c90e84d891c15dfa3431> where <i>5c41c90e84d891c15dfa3431</i> is not an id stored in the database, then the response will be _null_.-->
 如果我们试图访问一个ID不存在的笔记的URL，例如：<http://localhost:3001/api/notes/5c41c90e84d891c15dfa3431>，其中<i>5c41c90e84d891c15dfa3431</i>不是存储在数据库中的ID，那么响应将是_null_。

<!-- Let's change this behavior so that if note with the given id doesn't exist, the server will respond to the request with the HTTP status code 404 not found. In addition let's implement a simple <em>catch</em> block to handle cases where the promise returned by the <em>findById</em> method is <i>rejected</i>:-->
 让我们改变这个行为，如果给定id的注释不存在，服务器将以HTTP状态代码404未找到来响应请求。此外，让我们实现一个简单的<em>catch</em>块来处理由<em>findById</em>方法返回的承诺被<i>拒绝</i>的情况。

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

<!-- If no matching object is found in the database, the value of _note_ will be _null_ and the _else_ block is executed. This results in a response with the status code <i>404 not found</i>. If promise returned by the <em>findById</em> method is rejected, the response will have the status code <i>500 internal server error</i>. The console displays more detailed information about the error.-->
 如果在数据库中没有找到匹配的对象，_note_的值将是_null_，_else_块被执行。这将导致一个状态代码为<i>404 not found</i>的响应。如果由<em>findById</em>方法返回的承诺被拒绝，那么响应的状态码将是<i>500 internal server error</i>。控制台会显示关于该错误的更详细的信息。

<!-- On top of the non-existing note, there's one more error situation needed to be handled. In this situation, we are trying to fetch a note with a wrong kind of _id_, meaning an _id_ that doesn't match the mongo identifier format.-->
 在不存在的注释之上，还有一个错误情况需要处理。在这种情况下，我们正试图获取一个带有错误的_id_的笔记，也就是说，一个不符合mongo标识符格式的_id_。

<!-- If we make the following request, we will get the error message shown below:-->
 如果我们发出以下请求，我们会得到如下的错误信息。

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

Given malformed id as an argument, the <em>findById</em> method will throw an error causing the returned promise to be rejected. This will cause the callback function defined in the <em>catch</em> block to be called.

Let's make some small adjustments to the response in the <em>catch</em> block:

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

If the format of the id is incorrect, then we will end up in the error handler defined in the _catch_ block. The appropriate status code for the situation is [400 Bad Request](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.1), because the situation fits the description perfectly:

> <i>The request could not be understood by the server due to malformed syntax. The client SHOULD NOT repeat the request without modifications.</i>

We have also added some data to the response to shed some light on the cause of the error.

When dealing with Promises, it's almost always a good idea to add error and exception handling, because otherwise you will find yourself dealing with strange bugs.

It's never a bad idea to print the object that caused the exception to the console in the error handler:

```js
.catch(error => {
  console.log(error)  // highlight-line
  response.status(400).send({ error: 'malformatted id' })
})
```

The reason the error handler gets called might be something completely different than what you had anticipated. If you log the error to the console, you may save yourself from long and frustrating debugging sessions. Moreover, most modern services to where you deploy your application support some form of logging system that you can use to check these logs. As mentioned, Heroku is one.

Every time you're working on a project with a backend, <i>it is critical to keep an eye on the console output of the backend</i>. If you are working on a small screen, it is enough to just see a tiny slice of the output in the background. Any error messages will catch your attention even when the console is far back in the background:

![](../../images/3/15b.png)

### Moving error handling into middleware

We have written the code for the error handler among the rest of our code. This can be a reasonable solution at times, but there are cases where it is better to implement all error handling in a single place. This can be particularly useful if we later on want to report data related to errors to an external error tracking system like [Sentry](https://sentry.io/welcome/).

Let's change the handler for the <i>/api/notes/:id</i> route, so that it passes the error forward with the <em>next</em> function. The next function is passed to the handler as the third parameter:

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

The error handler checks if the error is a <i>CastError</i> exception, in which case we know that the error was caused by an invalid object id for Mongo. In this situation the error handler will send a response to the browser with the response object passed as a parameter. In all other error situations, the middleware passes the error forward to the default Express error handler.

Note that the error handling middleware has to be the last loaded middleware!

### The order of middleware loading

The execution order of middleware is the same as the order that they are loaded into express with the _app.use_ function. For this reason it is important to be careful when defining middleware.

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

It's also important that the middleware for handling unsupported routes is next to the last middleware that is loaded into Express, just before the error handler.

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

Let's add some missing functionality to our application, including deleting and updating an individual note.

The easiest way to delete a note from the database is with the [findByIdAndRemove](https://mongoosejs.com/docs/api.html#model_Model.findByIdAndRemove) method:

```js
app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})
```

In both of the "successful" cases of deleting a resource, the backend responds with the status code <i>204 no content</i>. The two different cases are deleting a note that exists, and deleting a note that does not exist in the database. The _result_ callback parameter could be used for checking if a resource actually was deleted, and we could use that information for returning different status codes for the two cases if we deemed it necessary. Any exception that occurs is passed onto the error handler.

The toggling of the importance of a note can be easily accomplished with the [findByIdAndUpdate](https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate) method.

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

In the code above, we also allow the content of the note to be edited. However, we will not support changing the creation date for obvious reasons.

Notice that the <em>findByIdAndUpdate</em> method receives a regular JavaScript object as its parameter, and not a new note object created with the <em>Note</em> constructor function.

There is one important detail regarding the use of the <em>findByIdAndUpdate</em> method. By default, the <em>updatedNote</em> parameter of the event handler receives the original document [without the modifications](https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate). We added the optional <code>{ new: true }</code> parameter, which will cause our event handler to be called with the new modified document instead of the original.

After testing the backend directly with Postman and the VS Code REST client, we can verify that it seems to work. The frontend also appears to work with the backend using the database.

You can find the code for our current application in its entirety in the <i>part3-5</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-5).

</div>

<div class="tasks">

### Exercises 3.15.-3.18.

#### 3.15: Phonebook database, step3

Change the backend so that deleting phonebook entries is reflected in the database.

Verify that the frontend still works after making the changes.

#### 3.16: Phonebook database, step4

Move the error handling of the application to a new error handler middleware.

#### 3.17*: Phonebook database, step5

If the user tries to create a new phonebook entry for a person whose name is already in the phonebook, the frontend will try to update the phone number of the existing entry by making an HTTP PUT request to the entry's unique URL.

Modify the backend to support this request.

Verify that the frontend works after making your changes.

#### 3.18*: Phonebook database step6

Also update the handling of the <i>api/persons/:id</i> and <i>info</i> routes to use the database, and verify that they work directly with the browser, Postman, or VS Code REST client.

Inspecting an individual phonebook entry from the browser should look like this:

![](../../images/3/49.png)

</div>
