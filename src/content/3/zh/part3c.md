---
mainImage: ../../../images/part-3.svg
part: 3
letter: c
lang: zh
---

<div class="content">

<!-- Before we move into the main topic of persisting data in a database, we will take a look at a few different ways of debugging Node applications. -->
在我们进入关于在数据库中持久化数据的主题之前，我们先来看一下调试 Node 应用程序的几种不同方法。

### Debugging Node applications

<!-- Debugging Node applications is slightly more difficult than debugging JavaScript running in your browser. Printing to the console is a tried and true method, and it's always worth doing. Some people think that more sophisticated methods should be used instead, but I disagree. Even the world's elite open-source developers [use](https://tenderlovemaking.com/2016/02/05/i-am-a-puts-debuggerer.html) this [method](https://swizec.com/blog/javascript-debugging-slightly-beyond-consolelog/). -->
调试 Node 应用程序比调试在浏览器中运行的 JavaScript 稍微困难一些。打印到控制台是一种经过验证的方法，值得一试。有些人认为应该使用更复杂的方法，但我不同意。即使是世界上顶级的开源开发人员也会使用这种方法。

#### Visual Studio Code

<!-- The Visual Studio Code debugger can be useful in some situations. You can launch the application in debugging mode like this (in this and the next few images, the notes have a field _date_ which has been removed from the current version of the application): -->
在某些情况下，Visual Studio Code 的调试器可能很有用。您可以像这样以调试模式启动应用程序（在这个和接下来的几个图像中，注释中有一个名为“日期”的字段，在当前版本的应用程序中已被删除）：

![截图显示如何在 vscode 中启动调试器](../../images/3/35x.png)

<!-- Note that the application shouldn't be running in another console, otherwise the port will already be in use. -->
请注意，应用程序不应该在另一个控制台中运行，否则端口将已经被占用。

<!-- __NB__ A newer version of Visual Studio Code may have _Run_ instead of _Debug_. Furthermore, you may have to configure your _launch.json_ file to start debugging. This can be done by choosing _Add Configuration..._ on the drop-down menu, which is located next to the green play button and above _VARIABLES_ menu, and select _Run "npm start" in a debug terminal_. For more detailed setup instructions, visit Visual Studio Code's [Debugging documentation](https://code.visualstudio.com/docs/editor/debugging). -->
__注意__：Visual Studio Code 的较新版本可能会将“Debug”更改为“Run”。此外，您可能需要配置您的 _launch.json_ 文件来开始调试。您可以通过选择下拉菜单上方的绿色播放按钮旁边的 _Add Configuration..._，然后选择 _Run "npm start" in a debug terminal_ 来进行配置。有关更详细的设置说明，请访问 Visual Studio Code 的[调试文档](https://code.visualstudio.com/docs/editor/debugging)。

<!-- Below you can see a screenshot where the code execution has been paused in the middle of saving a new note: -->
下面是一张截图，显示代码执行在保存新笔记的过程中被暂停：

![断点处执行的vscode屏幕截图](../../images/3/36x.png)

<!-- The execution stopped at the <i>breakpoint</i> in line 69. In the console, you can see the value of the <i>note</i> variable. In the top left window, you can see other things related to the state of the application. -->
代码执行在第 69 行的断点处停止。在控制台中，您可以看到 <i>note</i> 变量的值。在左上角的窗口中，您可以看到与应用程序状态相关的其他信息。

<!-- The arrows at the top can be used for controlling the flow of the debugger. -->
顶部的箭头可以用于控制调试器的流程。

<!-- For some reason, I don't use the Visual Studio Code debugger a whole lot. -->
出于某种原因，我并不经常使用 Visual Studio Code 的调试器。

#### Chrome dev tools

<!-- Debugging is also possible with the Chrome developer console by starting your application with the command: -->
您也可以通过在命令中启动应用程序来使用 Chrome 开发者控制台进行调试：

```bash
node --inspect index.js
```

<!-- You can also pass the `--inspect` flag to `nodemon`: -->
您还可以将 `--inspect` 标志传递给 `nodemon`：

```bash
nodemon --inspect index.js
```

<!-- You can access the debugger by clicking the green icon - the node logo - that appears in the Chrome developer console: -->
您可以通过点击 Chrome 开发者控制台中出现的绿色图标（node logo）来访问调试器：

![带有绿色node标志图标的开发者工具](../../images/3/37.png)

<!-- The debugging view works the same way as it did with React applications. The <i>Sources</i> tab can be used for setting breakpoints where the execution of the code will be paused. -->
调试器的界面与在 React 应用程序中的使用方式相同。可以使用<i>Sources</i>选项卡设置断点，代码执行将在断点处暂停。

![开发者工具的 Sources 选项卡，包含断点和监视变量](../../images/3/38eb.png)

<!-- All of the application's <i>console.log</i> messages will appear in the <i>Console</i> tab of the debugger. You can also inspect values of variables and execute your own JavaScript code. -->
应用程序的所有<i>console.log</i>消息都将出现在调试器的<i>Console</i>选项卡中。您还可以检查变量的值并执行自己的 JavaScript 代码。

![开发者工具的控制台选项卡显示输入的笔记对象](../../images/3/39ea.png)

#### Question everything

<!-- Debugging Full Stack applications may seem tricky at first. Soon our application will also have a database in addition to the frontend and backend, and there will be many potential areas for bugs in the application. -->
调试全栈应用程序可能一开始看起来很棘手。很快，我们的应用程序除了前端和后端之外还将有一个数据库，而应用程序中可能存在许多潜在的错误。

<!-- When the application "does not work", we have to first figure out where the problem actually occurs. It's very common for the problem to exist in a place where you didn't expect it, and it can take minutes, hours, or even days before you find the source of the problem. -->
当应用程序"无法工作"时，我们首先必须找出问题实际发生在哪里。问题往往存在于您意想不到的地方，可能需要几分钟、几小时甚至几天才能找到问题的根源。

<!-- The key is to be systematic. Since the problem can exist anywhere, <i>you must question everything</i>, and eliminate all possibilities one by one. Logging to the console, Postman, debuggers, and experience will help. -->
关键是要有系统性。由于问题可能存在于任何地方，<i>您必须对所有事物提出质疑</i>，逐个排除所有可能性。记录到控制台、使用 Postman、调试器和经验都会有所帮助。

<!-- When bugs occur, <i>the worst of all possible strategies</i> is to continue writing code. It will guarantee that your code will soon have even more bugs, and debugging them will be even more difficult. The [Jidoka](https://leanscape.io/principles-of-lean-13-jidoka/) (stop and fix) principle from Toyota Production Systems is very effective in this situation as well. -->
当出现错误时，<i>最糟糕的策略</i>就是继续编写代码。这将确保您的代码很快会有更多的错误，并且调试它们将变得更加困难。丰田生产系统的 [Jidoka](https://leanscape.io/principles-of-lean-13-jidoka/)（停止和修复）原则  在这种情况下也非常有效。

### MongoDB

<!-- To store our saved notes indefinitely, we need a database. Most of the courses taught at the University of Helsinki use relational databases. In most parts of this course, we will use [MongoDB](https://www.mongodb.com/) which is a so-called [document database](https://en.wikipedia.org/wiki/Document-oriented_database). -->
为了永久存储我们保存的笔记，我们需要一个数据库。赫尔辛基大学的大多数课程使用关系数据库。在本课程的大部分内容中，我们将使用 [MongoDB](https://www.mongodb.com/)，这是一种所谓的 [文档数据库](https://en.wikipedia.org/wiki/Document-oriented_database)。

<!-- The reason for using Mongo as the database is its lower complexity compared to a relational database. [Part 13](/en/part13) of the course shows how to build Node.js backends that use a relational database. -->
选择使用 Mongo 作为数据库的原因是它相对于关系数据库来说更简单。本课程的 [第13部分](/zh/part13) 展示了如何构建使用关系数据库的 Node.js 后端。

<!-- Document databases differ from relational databases in how they organize data as well as in the query languages they support. Document databases are usually categorized under the [NoSQL](https://en.wikipedia.org/wiki/NoSQL) umbrella term. -->
文档数据库与关系数据库在数据组织方式和支持的查询语言方面有所不同。文档数据库通常被归类为 [NoSQL](https://en.wikipedia.org/wiki/NoSQL) 的范畴。

<!-- You can read more about document databases and NoSQL from the course material for [week 7](https://tikape-s18.mooc.fi/part7/) of the Introduction to Databases course. Unfortunately, the material is currently only available in Finnish. -->
您可以从 [数据库导论课程](https://tikape-s18.mooc.fi/part7/) 的 [part7](https://tikape-s18.mooc.fi/part7/) 材料中了解有关文档数据库和 NoSQL 的更多信息。不幸的是，该材料目前仅提供芬兰语版本。

<!-- Read now the chapters on [collections](https://docs.mongodb.com/manual/core/databases-and-collections/) and [documents](https://docs.mongodb.com/manual/core/document/) from the MongoDB manual to get a basic idea of how a document database stores data. -->
现在，请阅读 MongoDB 手册中关于 [集合(collections)](https://docs.mongodb.com/manual/core/databases-and-collections/) 和 [文档(documents)](https://docs.mongodb.com/manual/core/document/) 的章节，以了解文档数据库如何存储数据的基本概念。

<!-- Naturally, you can install and run MongoDB on your computer. However, the internet is also full of Mongo database services that you can use. Our preferred MongoDB provider in this course will be [MongoDB Atlas](https://www.mongodb.com/atlas/database). -->
当然，您可以在计算机上安装和运行 MongoDB。然而，互联网上也有许多可用的 Mongo 数据库服务。在本课程中，我们首选的 MongoDB 提供商将是 [MongoDB Atlas](https://www.mongodb.com/atlas/database)。

<!-- Once you've created and logged into your account, let us start by selecting the free option: -->
创建并登录到您的帐户后，让我们首先选择免费选项：

![mongodb部署云数据库免费共享](../../images/3/mongo1.png)

<!-- Pick the cloud provider and location and create the cluster: -->
选择云提供商和位置，并创建集群：

![选择共享、AWS 和区域的 MongoDB](../../images/3/mongo2.png)

<!-- Let's wait for the cluster to be ready for use. This can take some minutes. -->
让我们等待集群准备就绪。这可能需要几分钟时间。

<!-- **NB** do not continue before the cluster is ready. -->
**注意**：在集群准备就绪之前，请不要继续进行。

<!-- Let's use the <i>security</i> tab for creating user credentials for the database. Please note that these are not the same credentials you use for logging into MongoDB Atlas. These will be used for your application to connect to the database. -->
让我们使用<i>security(安全)</i>选项卡为数据库创建用户凭据。请注意，这些凭据与您用于登录 MongoDB Atlas 的凭据不同。这些凭据将用于您的应用程序连接到数据库。

![mongodb security quickstart](../../images/3/mongo3.png)

<!-- Next, we have to define the IP addresses that are allowed access to the database. For the sake of simplicity we will allow access from all IP addresses: -->
接下来，我们需要定义允许访问数据库的 IP 地址。为简单起见，我们将允许所有 IP 地址访问：

![MongoDB 网络访问/添加 IP 访问列表](../../images/3/mongo4.png)

<!-- Note: In case the modal menu is different for you, according to MongoDB documentation, adding 0.0.0.0 as an IP allows access from anywhere as well. -->
注意：如果对话框菜单对您而言不同，根据 MongoDB 文档，将 0.0.0.0 添加为 IP 地址也允许从任何地方访问。

<!-- Finally, we are ready to connect to our database. Start by clicking <i>connect</i>: -->
最后，我们准备好连接到我们的数据库了。首先点击<i>connect</i>：

![MongoDB 数据库部署连接](../../images/3/mongo5.png)

<!-- and choose: <i>Connect to your application</i>: -->
然后选择：<i>Connect to your application</i>

![MongoDB 连接应用程序](../../images/3/mongo6.png)

<!-- The view displays the <i>MongoDB URI</i>, which is the address of the database that we will supply to the MongoDB client library we will add to our application. -->
视图显示了<i>MongoDB URI</i>，这是我们将提供给我们的应用程序的 MongoDB 客户端库的数据库地址。

<!-- The address looks like this: -->
地址看起来是这样子的：

```js
mongodb+srv://fullstack:thepasswordishere@cluster0.o1opl.mongodb.net/?retryWrites=true&w=majority
```

<!-- We are now ready to use the database. -->
我们现在已经准备好使用数据库了。

<!-- We could use the database directly from our JavaScript code with the [official MongoDB Node.js driver](https://mongodb.github.io/node-mongodb-native/) library, but it is quite cumbersome to use. We will instead use the [Mongoose](http://mongoosejs.com/index.html) library that offers a higher-level API. -->
我们可以直接从我们的 JavaScript 代码中使用数据库，使用[官方的 MongoDB Node.js 驱动程序](https://mongodb.github.io/node-mongodb-native/)，但是使用起来相当麻烦。我们将使用[Mongoose](http://mongoosejs.com/index.html)库，它提供了一个更高级的 API。

<!-- Mongoose could be described as an <i>object document mapper</i> (ODM), and saving JavaScript objects as Mongo documents is straightforward with this library. -->
Mongoose可以被描述为一个<i>对象文档映射器</i>（ODM），使用这个库将JavaScript对象保存为Mongo文档非常简单。

<!-- Let's install Mongoose in our notes project backend: -->
让我们在笔记项目的后端中安装Mongoose：

```bash
npm install mongoose
```

<!-- Let's not add any code dealing with Mongo to our backend just yet. Instead, let's make a practice application by creating a new file, <i>mongo.js</i> in the root of the notes backend application: -->
暂时先不要在后端添加任何与Mongo相关的代码。相反，我们可以通过在笔记后端应用程序的根目录下创建一个新文件<i>mongo.js</i>来创建一个练习应用程序：

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
  content: 'HTML is easy',
  important: true,
})

note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})
```

<!-- **NB:** Depending on which region you selected when building your cluster, the <i>MongoDB URI</i> may be different from the example provided above. You should verify and use the correct URI that was generated from MongoDB Atlas. -->
**注意**：根据您在构建集群时选择的区域，<i>MongoDB URI</i>可能与上面提供的示例不同。您应该验证并使用从MongoDB Atlas生成的正确URI。

<!-- The code also assumes that it will be passed the password from the credentials we created in MongoDB Atlas, as a command line parameter. We can access the command line parameter like this: -->
代码还假设它将通过命令行参数传递从我们在MongoDB Atlas中创建的凭据中生成的密码。我们可以像这样访问命令行参数：

```js
const password = process.argv[2]
```

<!-- When the code is run with the command <i>node mongo.js yourPassword</i>, Mongo will add a new document to the database. -->
当使用命令<i>node mongo.js yourPassword</i>运行代码时，Mongo将向数据库添加一个新文档。

<!-- **NB:** Please note the password is the password created for the database user, not your MongoDB Atlas password.  Also, if you created a password with special characters, then you'll need to [URL encode that password](https://docs.atlas.mongodb.com/troubleshoot-connection/#special-characters-in-connection-string-password). -->
**注意**：请注意，密码是为数据库用户创建的密码，而不是您的MongoDB Atlas密码。此外，如果您创建了一个带有特殊字符的密码，那么您需要对该密码进行[URL编码](https://docs.atlas.mongodb.com/troubleshoot-connection/#special-characters-in-connection-string-password)。

<!-- We can view the current state of the database from the MongoDB Atlas from <i>Browse collections</i>, in the Database tab. -->
我们可以从MongoDB Atlas的<i>浏览集合</i>选项卡中查看数据库的当前状态。

![MongoDB 数据库浏览集合按钮](../../images/3/mongo7.png)

<!-- As the view states, the <i>document</i> matching the note has been added to the <i>notes</i> collection in the <i>myFirstDatabase</i> database. -->
正如视图所示，与笔记匹配的<i>文档</i>已添加到<i>myFirstDatabase</i>数据库中的<i>notes</i>集合中。

![MongoDB 集合选项卡 db myfirst app notes](../../images/3/mongo8new.png)

<!-- Let's destroy the default database <i>test</i> and change the name of the database referenced in our connection string to <i>noteApp</i> instead, by modifying the URI: -->
让我们销毁默认数据库<i>test</i>，并通过修改URI中引用的数据库名称将其更改为<i>noteApp</i>：

```js
const url =
  `mongodb+srv://fullstack:${password}@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority`
```

<!-- Let's run our code again: -->
让我们再次运行我们的代码：

![mongodb collections tab noteApp notes](../../images/3/mongo9.png)

<!-- The data is now stored in the right database. The view also offers the <i>create database</i> functionality, that can be used to create new databases from the website. Creating a database like this is not necessary, since MongoDB Atlas automatically creates a new database when an application tries to connect to a database that does not exist yet. -->
数据现在存储在正确的数据库中。该视图还提供了<i>create database(创建数据库)</i>功能，可以用于从网站创建新数据库。这样创建数据库是不必要的，因为当应用程序尝试连接到尚不存在的数据库时，MongoDB Atlas会自动创建一个新数据库。

### Schema

<!-- After establishing the connection to the database, we define the [schema](http://mongoosejs.com/docs/guide.html) for a note and the matching [model](http://mongoosejs.com/docs/models.html): -->
在与数据库建立连接后，我们为笔记定义了[schema](http://mongoosejs.com/docs/guide.html)，并创建了相应的[model](http://mongoosejs.com/docs/models.html)：

```js
const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)
```

<!-- First, we define the [schema](http://mongoosejs.com/docs/guide.html) of a note that is stored in the _noteSchema_ variable. The schema tells Mongoose how the note objects are to be stored in the database. -->
首先，我们定义了存储在 _noteSchema_ 变量中的笔记的[schema](http://mongoosejs.com/docs/guide.html)。该schema告诉 Mongoose 如何将笔记对象存储在数据库中。

<!-- In the _Note_ model definition, the first <i>"Note"</i> parameter is the singular name of the model. The name of the collection will be the lowercase plural <i>notes</i>, because the [Mongoose convention](http://mongoosejs.com/docs/models.html) is to automatically name collections as the plural (e.g. <i>notes</i>) when the schema refers to them in the singular (e.g. <i>Note</i>). -->
在 _Note_ 模型定义中，第一个<i>"Note"</i>参数是模型的单数名称。集合的名称将是小写复数形式的<i>notes</i>，因为[Mongoose的惯例](http://mongoosejs.com/docs/models.html)是自动将集合命名为复数形式（例如<i>notes</i>），当schema以单数形式（例如<i>Note</i>）引用它们时。

<!-- Document databases like Mongo are <i>schemaless</i>, meaning that the database itself does not care about the structure of the data that is stored in the database. It is possible to store documents with completely different fields in the same collection. -->
像Mongo这样的文档数据库是<i>schemaless</i>，这意味着数据库本身并不关心存储在数据库中的数据的结构。可以在同一集合中存储具有完全不同字段的文档。

<!-- The idea behind Mongoose is that the data stored in the database is given a <i>schema at the level of the application</i> that defines the shape of the documents stored in any given collection. -->
Mongoose的思想是，存储在数据库中的数据在应用程序级别被赋予一个<i>schema</i>，该schema定义了存储在任何给定集合中的文档的形状。

### Creating and saving objects

<!-- Next, the application creates a new note object with the help of the <i>Note</i> [model](http://mongoosejs.com/docs/models.html): -->
接下来，应用程序使用<i>Note</i>[model](http://mongoosejs.com/docs/models.html)创建一个新的笔记对象：

```js
const note = new Note({
  content: 'HTML is Easy',
  important: false,
})
```

<!-- Models are so-called <i>constructor functions</i> that create new JavaScript objects based on the provided parameters. Since the objects are created with the model's constructor function, they have all the properties of the model, which include methods for saving the object to the database. -->
模型(Models)是所谓的<i>构造函数</i>，它根据提供的参数创建新的JavaScript对象。由于对象是用模型的构造函数创建的，因此它们具有模型的所有属性，这包括用于将对象保存到数据库的方法。

<!-- Saving the object to the database happens with the appropriately named _save_ method, which can be provided with an event handler with the _then_ method: -->
将对象保存到数据库使用的是适当命名的 _save_ 方法，可以通过 _then_ 方法提供一个事件处理程序：

```js
note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})
```

<!-- When the object is saved to the database, the event handler provided to _then_  gets called. The event handler closes the database connection with the command <code>mongoose.connection.close()</code>. If the connection is not closed, the program will never finish its execution. -->
当对象保存到数据库时，提供给 _then_ 的事件处理程序会被调用。事件处理程序使用命令 <code>mongoose.connection.close()</code> 关闭数据库连接。如果不关闭连接，程序将永远不会结束执行。

<!-- The result of the save operation is in the _result_ parameter of the event handler. The result is not that interesting when we're storing one object in the database. You can print the object to the console if you want to take a closer look at it while implementing your application or during debugging. -->
保存操作的结果在事件处理程序的 _result_ 参数中。当我们在数据库中存储一个对象时，结果并不那么有趣。如果你想在实现应用程序或在调试期间仔细查看它，你可以将对象打印到控制台。

<!-- Let's also save a few more notes by modifying the data in the code and by executing the program again. -->
我们也可以通过修改代码中的数据并再次执行程序来保存更多的笔记。

<!-- **NB:** Unfortunately the Mongoose documentation is not very consistent, with parts of it using callbacks in its examples and other parts, other styles, so it is not recommended to copy and paste code directly from there. Mixing promises with old-school callbacks in the same code is not recommended. -->
**注意：**不幸的是，Mongoose的文档并不非常一致，部分文档在其示例中使用回调，其他部分使用其他样式，因此不建议直接从那里复制和粘贴代码。不建议在同一代码中混合使用promise和旧式的回调。

### Fetching objects from the database

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
通过_Note_模型的[find](https://mongoosejs.com/docs/api/model.html#model_Model-find)方法从数据库中检索对象。该方法的参数是一个表示搜索条件的对象。由于参数是一个空对象<code>{}</code>，我们得到了_notes_集合中存储的所有笔记。

<!-- The search conditions adhere to the Mongo search query [syntax](https://docs.mongodb.com/manual/reference/operator/). -->
搜索条件遵循Mongo搜索查询[syntax](https://docs.mongodb.com/manual/reference/operator/)。

<!-- We could restrict our search to only include important notes like this: -->
我们可以限制我们的搜索只包括重要的笔记，像这样：

```js
Note.find({ important: true }).then(result => {
  // ...
})
```

</div>

<div class="tasks">

### Exercise 3.12.

#### 3.12: Command-line database

<!-- Create a cloud-based MongoDB database for the phonebook application with MongoDB Atlas. -->
使用MongoDB Atlas为电话簿应用程序创建一个基于云的MongoDB数据库。

<!-- Create a <i>mongo.js</i> file in the project directory, that can be used for adding entries to the phonebook, and for listing all of the existing entries in the phonebook. -->
在项目目录中创建一个<i>mongo.js</i>文件，该文件可以用于向电话簿添加条目，以及列出电话簿中所有已有的条目。

<!-- **NB:** Do not include the password in the file that you commit and push to GitHub! -->
**注意：** 不要在你提交和推送到GitHub的文件中包含密码！

<!-- The application should work as follows. You use the program by passing three command-line arguments (the first is the password), e.g.: -->
应用程序应该如下工作。你通过传递三个命令行参数（第一个是密码）来使用程序，例如：

```bash
node mongo.js yourpassword Anna 040-1234556
```

<!-- As a result, the application will print: -->
因此，应用程序将打印：

```bash
added Anna number 040-1234556 to phonebook
```

<!-- The new entry to the phonebook will be saved to the database. Notice that if the name contains whitespace characters, it must be enclosed in quotes: -->
新的电话簿条目将被保存到数据库中。注意，如果名字包含空格字符，它必须被包含在引号中：

```bash
node mongo.js yourpassword "Arto Vihavainen" 045-1232456
```

<!-- If the password is the only parameter given to the program, meaning that it is invoked like this: -->
如果密码是给程序的唯一参数，意味着它像这样被调用：

```bash
node mongo.js yourpassword
```

<!-- Then the program should display all of the entries in the phonebook: -->
那么程序应该显示电话簿中的所有条目：

<pre>
phonebook:
Anna 040-1234556
Arto Vihavainen 045-1232456
Ada Lovelace 040-1231236
</pre>

<!-- You can get the command-line parameters from the [process.argv](https://nodejs.org/docs/latest-v18.x/api/process.html#process_process_argv) variable. -->
你可以从[process.argv](https://nodejs.org/docs/latest-v18.x/api/process.html#process_process_argv)变量获取命令行参数。

<!-- **NB: do not close the connection in the wrong place**. E.g. the following code will not work: -->
**注意：不要在错误的地方关闭连接**。例如，以下代码将无法工作：

```js
Person
  .find({})
  .then(persons=> {
    // ...
  })

mongoose.connection.close()
```

<!-- In the code above the <i>mongoose.connection.close()</i> command will get executed immediately after the <i>Person.find</i> operation is started. This means that the database connection will be closed immediately, and the execution will never get to the point where <i>Person.find</i> operation finishes and the <i>callback</i> function gets called. -->
在上面的代码中，<i>mongoose.connection.close()</i>命令将在<i>Person.find</i>操作开始后立即执行。这意味着数据库连接将立即关闭，执行永远不会到达<i>Person.find</i>操作完成和<i>callback</i>函数被调用的地方。

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
**注意：** 如果你用<i>Person</i>这个名字定义一个模型，mongoose会自动将关联的集合命名为<i>people</i>。

</div>

<div class="content">

### Connecting the backend to a database

<!-- Now we have enough knowledge to start using Mongo in our notes application backend. -->
现在我们已经有足够的知识开始在我们的笔记应用程序后端中使用Mongo。

<!-- Let's get a quick start by copy-pasting the Mongoose definitions to the <i>index.js</i> file: -->
让我们通过复制粘贴Mongoose定义到<i>index.js</i>文件来快速开始：

```js
const mongoose = require('mongoose')

const password = process.argv[2]

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

<!-- Let's change the handler for fetching all notes to the following form: -->
让我们将获取所有笔记的处理器更改为以下形式：

```js
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})
```

<!-- We can verify in the browser that the backend works for displaying all of the documents: -->
我们可以在浏览器中验证后端是否可以显示所有的文档：

![api/notes in browser shows notes in JSON](../../images/3/44ea.png)

<!-- The application works almost perfectly. The frontend assumes that every object has a unique id in the <i>id</i> field. We also don't want to return the mongo versioning field <i>\_\_v</i> to the frontend. -->
应用程序几乎完美地工作。前端假设每个对象在<i>id</i>字段中都有一个唯一的id。我们也不想将mongo版本控制字段<i>\_\_v</i>返回给前端。

<!-- One way to format the objects returned by Mongoose is to [modify](https://stackoverflow.com/questions/7034848/mongodb-output-id-instead-of-id) the _toJSON_ method of the schema, which is used on all instances of the models produced with that schema. -->
格式化Mongoose返回的对象的一种方法是[modify(修改)](https://stackoverflow.com/questions/7034848/mongodb-output-id-instead-of-id)模式的 _toJSON_ 方法，该方法在用该模式产生的模型的所有实例上使用。
  
<!-- To modify the method we need to change the configurable options of the schema, options can be changed using the set method of the schema, see here for more info on this method: https://mongoosejs.com/docs/guide.html#options. See <https://mongoosejs.com/docs/guide.html#toJSON> and <https://mongoosejs.com/docs/api.html#document_Document-toObject> for more info on the _toJSON_ option. -->
要modify(修改)该方法，我们需要更改模式的可配置选项，可以使用模式的set方法更改选项，更多关于此方法的信息请参见：<https://mongoosejs.com/docs/guide.html#options> 。有关 _toJSON_ 选项的更多信息，请参阅 <https://mongoosejs.com/docs/guide.html#toJSON> 和 <https://mongoosejs.com/docs/api.html#document_Document-toObject> 。

  
<!-- see <https://mongoosejs.com/docs/api/document.html#transform> for more info on the _transform_ function. -->
有关 _transform_ 函数的更多信息，请参阅<https://mongoosejs.com/docs/api/document.html#transform> 。

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
尽管Mongoose对象的<i>\_id</i>属性看起来像一个字符串，但实际上它是一个对象。我们定义的 _toJSON_ 方法将其转换为字符串以确保安全。如果我们不做这个改变，一旦我们开始编写测试，它将在未来对我们造成更大的麻烦。

<!-- No changes are needed in the handler: -->
在处理器中不需要做任何改变：

```js
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})
```

<!-- The code automatically uses the defined _toJSON_ when formatting notes to the response. -->
代码在格式化响应的笔记时将自动使用定义的 _toJSON_ 。
### Database configuration into its own module

<!-- Before we refactor the rest of the backend to use the database, let's extract the Mongoose-specific code into its own module. -->
在我们将后端的其余部分重构为使用数据库之前，让我们将Mongoose特定的代码提取到它自己的模块中。

<!-- Let's create a new directory for the module called <i>models</i>, and add a file called <i>note.js</i>: -->
让我们为模块创建一个名为<i>models</i>的新目录，并添加一个名为<i>note.js</i>的文件：

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

<!-- Defining Node [modules](https://nodejs.org/docs/latest-v18.x/api/modules.html) differs slightly from the way of defining [ES6 modules](/en/part2/rendering_a_collection_modules#refactoring-modules) in part 2. -->
定义Node [modules(模块)](https://nodejs.org/docs/latest-v18.x/api/modules.html)的方式与在第2部分中定义[ES6 modules](/zh/part2/从渲染集合到模块学习#refactoring-modules)的方式略有不同。

<!-- The public interface of the module is defined by setting a value to the _module.exports_ variable. We will set the value to be the <i>Note</i> model. The other things defined inside of the module, like the variables _mongoose_ and _url_ will not be accessible or visible to users of the module. -->
modules(模块)的公共接口是通过为 _module.exports_ 变量设置一个值来定义的。我们将值设置为<i>Note</i>模型。在模块内部定义的其他东西，如变量 _mongoose_ 和 _url_ ，对模块的用户来说将不可访问或不可见。

<!-- Importing the module happens by adding the following line to <i>index.js</i>: -->
导入模块是通过在<i>index.js</i>中添加以下行来实现的：

```js
const Note = require('./models/note')
```

<!-- This way the _Note_ variable will be assigned to the same object that the module defines. -->
这样，_Note_ 变量将被赋值为模块定义的同一个对象。

<!-- The way that the connection is made has changed slightly: -->
建立连接的方式有所改变：

```js
const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })
```

<!-- It's not a good idea to hardcode the address of the database into the code, so instead the address of the database is passed to the application via the <em>MONGODB_URI</em> environment variable. -->
将数据库的地址硬编码到代码中并不是一个好主意，所以我们通过<em>MONGODB_URI</em>环境变量将数据库的地址传递给应用程序。

<!-- The method for establishing the connection is now given functions for dealing with a successful and unsuccessful connection attempt. Both functions just log a message to the console about the success status: -->
建立连接的方法现在被赋予了处理成功和失败的连接尝试的函数。两个函数只是将成功状态的消息记录到控制台：

![node output when wrong username/password](../../images/3/45e.png)

<!-- There are many ways to define the value of an environment variable. One way would be to define it when the application is started: -->
有许多方法可以定义环境变量的值。一种方法是在启动应用程序时定义它：

```bash
MONGODB_URI=address_here npm run dev
```

<!-- A more sophisticated way is to use the [dotenv](https://github.com/motdotla/dotenv#readme) library. You can install the library with the command: -->
更聪明的方法是使用[dotenv](https://github.com/motdotla/dotenv#readme)库。你可以用以下命令安装这个库：

```bash
npm install dotenv
```

<!-- To use the library, we create a <i>.env</i> file at the root of the project. The environment variables are defined inside of the file, and it can look like this: -->
要使用这个库，我们在项目的根目录下创建一个<i>.env</i>文件。环境变量在文件内部定义，它可以像这样：

```bash
MONGODB_URI=mongodb+srv://fullstack:thepasswordishere@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority
PORT=3001
```

<!-- We also added the hardcoded port of the server into the <em>PORT</em> environment variable. -->
我们也将服务器的硬编码端口添加到<em>PORT</em>环境变量中。

<!-- **The <i>.env</i> file should be gitignored right away since we do not want to publish any confidential information publicly online!** -->
**我们应该立即将<i>.env</i>文件添加到gitignore中，因为我们不希望公开发布任何机密信息！**

![.gitignore in vscode with .env line added](../../images/3/45ae.png)

<!-- The environment variables defined in the <i>.env</i> file can be taken into use with the expression <em>require('dotenv').config()</em> and you can reference them in your code just like you would reference normal environment variables, with the <em>process.env.MONGODB_URI</em> syntax. -->
在<i>.env</i>文件中定义的环境变量可以通过表达式<em>require('dotenv').config()</em>引入，你可以像引用普通环境变量一样在代码中引用它们，使用<em>process.env.MONGODB_URI</em>语法。

<!-- Let's change the <i>index.js</i> file in the following way: -->
让我们以以下方式更改<i>index.js</i>文件：

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

<!-- It's important that <i>dotenv</i> gets imported before the <i>note</i> model is imported. This ensures that the environment variables from the <i>.env</i> file are available globally before the code from the other modules is imported. -->
在导入<i>note</i>模型之前导入<i>dotenv</i>非常重要。这确保了在导入其他模块的代码之前，<i>.env</i>文件中的环境变量在全局范围内可用。

### Important note to Fly.io users

<!-- Because GitHub is not used with Fly.io, the file .env also gets to the Fly.io servers when the app is deployed. Because of this, the env variables defined in the file will be available there. -->
因为GitHub不是与Fly.io一起使用的，所以当应用程序被部署时，.env文件也会被传到Fly.io服务器。因此，文件中定义的环境变量将在那里可用。

<!-- However, a [better option](https://community.fly.io/t/clarification-on-environment-variables/6309) is to prevent .env from being copied to Fly.io by creating in the project root the file _.dockerignore_, with the following contents -->
然而，[更好的选择](https://community.fly.io/t/clarification-on-environment-variables/6309)是通过在项目根目录创建 _.dockerignore_ 文件，内容如下

```bash
.env
```

<!-- and set the env value from the command line with the command: -->
并使用以下命令从命令行设置环境值：

```bash
fly secrets set MONGODB_URI="mongodb+srv://fullstack:thepasswordishere@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority"
```

<!-- Since the PORT also is defined in our .env it is actually essential to ignore the file in Fly.io since otherwise the app starts in the wrong port. -->
由于PORT也在我们的.env中定义，所以实际上在Fly.io中忽略该文件是至关重要的，否则应用程序将在错误的端口启动。

<!-- When using Render, the database url is given by defining the proper env in the dashboard: -->
在使用Render时，通过在仪表板中定义适当的环境变量给出数据库url：

![browser showing render environment variables](../../images/3/render-env.png)

<!-- Set just the URL starting with <i>mongodb+srv://</i> to the _value_ field. -->
只需将以<i>mongodb+srv://</i>开头的URL设置到_value_字段。

### Using database in route handlers

<!-- Next, let's change the rest of the backend functionality to use the database. -->
接下来，让我们将后端的其余功能更改为使用数据库。

<!-- Creating a new note is accomplished like this: -->
创建新的笔记可以这样完成：

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

<!-- The note objects are created with the _Note_ constructor function. The response is sent inside of the callback function for the _save_ operation. This ensures that the response is sent only if the operation succeeded. We will discuss error handling a little bit later. -->
笔记对象是用 _Note_ 构造函数创建的。响应在 _save_ 操作的回调函数内部发送。这确保只有在操作成功时才发送响应。我们稍后会讨论错误处理。

<!-- The _savedNote_ parameter in the callback function is the saved and newly created note. The data sent back in the response is the formatted version created automatically with the _toJSON_ method: -->
回调函数中的 _savedNote_ 参数是保存的新创建的笔记。响应中发送回来的数据是用 _toJSON_ 方法自动创建的格式化版本：

```js
response.json(savedNote)
```

<!-- Using Mongoose's [findById](https://mongoosejs.com/docs/api/model.html#model_Model-findById) method, fetching an individual note gets changed into the following: -->
使用Mongoose的[findById](https://mongoosejs.com/docs/api/model.html#model_Model-findById)方法，获取单个笔记的操作变为以下形式：

```js
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(note => {
    response.json(note)
  })
})
```

### Verifying frontend and backend integration

<!-- When the backend gets expanded, it's a good idea to test the backend first with **the browser, Postman or the VS Code REST client**. Next, let's try creating a new note after taking the database into use: -->
当后端的功能被扩展时，首先使用**浏览器、Postman或VS Code REST客户端**测试后端是个好主意。接下来，让我们在启用数据库后尝试创建一个新的笔记：

![VS code rest client doing a post](../../images/3/46new.png)

<!-- Only once everything has been verified to work in the backend, is it a good idea to test that the frontend works with the backend. It is highly inefficient to test things exclusively through the frontend. -->
只有在后端的所有内容都经过验证并正常工作后，才是测试前端与后端是否协同工作的好时机。仅通过前端进行测试效率极低。

<!-- It's probably a good idea to integrate the frontend and backend one functionality at a time. First, we could implement fetching all of the notes from the database and test it through the backend endpoint in the browser. After this, we could verify that the frontend works with the new backend. Once everything seems to be working, we would move on to the next feature. -->
逐个集成前端和后端的功能可能是个好主意。首先，我们可以实现从数据库获取所有笔记的功能，并通过浏览器中的后端端点进行测试。然后，我们可以验证前端是否能与新的后端一起工作。一旦所有东西看起来都在工作，我们就会转向下一个功能。

<!-- Once we introduce a database into the mix, it is useful to inspect the state persisted in the database, e.g. from the control panel in MongoDB Atlas. Quite often little Node helper programs like the <i>mongo.js</i> program we wrote earlier can be very helpful during development. -->
一旦我们引入数据库，查看数据库中持久化的状态是非常有用的，例如，从MongoDB Atlas的控制面板中查看。在开发过程中，像我们之前写的<i>mongo.js</i>这样的小型Node助手程序往往非常有帮助。

<!-- You can find the code for our current application in its entirety in the <i>part3-4</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-4). -->
你可以在<i>part3-4</i>分支的[这个GitHub仓库](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-4)中找到我们当前应用程序的完整代码。

</div>

<div class="tasks">

### Exercises 3.13.-3.14.

<!-- The following exercises are pretty straightforward, but if your frontend stops working with the backend, then finding and fixing the bugs can be quite interesting. -->
以下练习相当简单，但如果你的前端停止与后端一起工作，那么找出并修复错误可能会相当有趣。

#### 3.13: Phonebook database, step 1

<!-- Change the fetching of all phonebook entries so that the data is <i>fetched from the database</i>. -->
更改所有电话簿条目的获取方式，使数据从数据库中获取。

<!-- Verify that the frontend works after the changes have been made. -->
在更改后，验证前端是否正常工作。

<!-- In the following exercises, write all Mongoose-specific code into its own module, just like we did in the chapter [Database configuration into its own module](/en/part3/saving_data_to_mongo_db#database-configuration-into-its-own-module). -->
在接下来的练习中，将所有Mongoose特定的代码写入其自己的模块，就像我们在[数据库配置到自己的模块](/zh/part3/将数据存入_mongo_db#database-configuration-into-its-own-module)一章中做的那样。

#### 3.14: Phonebook database, step 2

<!-- Change the backend so that new numbers are <i>saved to the database</i>. Verify that your frontend still works after the changes. -->
更改后端，使新的号码保存到数据库中。验证更改后你的前端是否仍然工作。

<!-- At this stage, you can ignore whether there is already a person in the database with the same name as the person you are adding. -->
在这个阶段，你可以忽略是否已经有一个人在数据库中与你要添加的人同名。

</div>

<div class="content">

### Error handling

<!-- If we try to visit the URL of a note with an id that does not exist e.g. <http://localhost:3001/api/notes/5c41c90e84d891c15dfa3431> where <i>5c41c90e84d891c15dfa3431</i> is not an id stored in the database, then the response will be _null_. -->
如果我们尝试访问一个不存在的笔记的URL，例如<http://localhost:3001/api/notes/5c41c90e84d891c15dfa3431>，其中<i>5c41c90e84d891c15dfa3431</i>不是存储在数据库中的id，那么响应将为 _null_ 。

<!-- Let's change this behavior so that if a note with the given id doesn't exist, the server will respond to the request with the HTTP status code 404 not found. In addition let's implement a simple <em>catch</em> block to handle cases where the promise returned by the <em>findById</em> method is <i>rejected</i>: -->
让我们改变这种行为，如果给定id的笔记不存在，服务器将以HTTP状态码404未找到来响应请求。此外，让我们实现一个简单的<em>catch</em>块来处理<em>findById</em>方法返回的promise被拒绝的情况：

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
如果在数据库中没有找到匹配的对象， _note_ 的值将为 _null_ ，并执行 _else_ 块。这将导致一个带有状态码<i>404 not found</i>的响应。如果 <em>findById</em> 方法返回的 promise 被拒绝，响应将有状态码<i>500内部服务器错误</i>。控制台会显示关于错误的更详细的信息。

<!-- On top of the non-existing note, there's one more error situation that needs to be handled. In this situation, we are trying to fetch a note with the wrong kind of _id_, meaning an _id_ that doesn't match the Mongo identifier format. -->
除了不存在的笔记，还有一个需要处理的错误情况。在这种情况下，我们试图获取一个错误类型的_id_，也就是说，_id_与Mongo标识符格式不匹配。

<!-- If we make the following request, we will get the error message shown below: -->
如果我们发出以下请求，我们将得到下面的错误消息：

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

<!-- Given a malformed id as an argument, the <em>findById</em> method will throw an error causing the returned promise to be rejected. This will cause the callback function defined in the <em>catch</em> block to be called. -->
给出一个格式错误的id作为参数，<em>findById</em>方法将抛出错误，导致返回的promise被拒绝。这将导致在<em>catch</em>块中定义的回调函数被调用。

<!-- Let's make some small adjustments to the response in the <em>catch</em> block: -->
让我们对<em>catch</em>块中的响应做一些小的调整：

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
如果id的格式不正确，那么我们将进入在_catch_块中定义的错误处理程序。适合这种情况的状态码是[400 Bad Request](https://www.rfc-editor.org/rfc/rfc9110.html#name-400-bad-request)，因为这种情况完全符合描述：

<!-- > <i>The 400 (Bad Request) status code indicates that the server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).</i> -->
> <i>400 (Bad Request) 状态码表示服务器不能或不会处理请求，因为有些东西被认为是客户端错误（例如，请求语法格式错误，请求消息帧格式无效，或请求路由欺骗）。</i>

<!-- We have also added some data to the response to shed some light on the cause of the error. -->
我们还在响应中添加了一些数据，以便解释错误的原因。

<!-- When dealing with Promises, it's almost always a good idea to add error and exception handling. Otherwise, you will find yourself dealing with strange bugs. -->
在处理Promises时，几乎总是添加错误和异常处理的好主意。否则，你会发现自己在处理奇怪的错误。

<!-- It's never a bad idea to print the object that caused the exception to the console in the error handler: -->
在错误处理程序中打印引发异常的对象永远不是个坏主意：

```js
.catch(error => {
  console.log(error)  // highlight-line
  response.status(400).send({ error: 'malformatted id' })
})
```

<!-- The reason the error handler gets called might be something completely different than what you had anticipated. If you log the error to the console, you may save yourself from long and frustrating debugging sessions. Moreover, most modern services where you deploy your application support some form of logging system that you can use to check these logs. As mentioned, Fly.io is one. -->
错误处理程序被调用的原因可能完全不同于你预期的。如果你将错误记录到控制台，你可能会从长时间和令人沮丧的调试会话中解救出来。此外，大多数现代服务在你部署应用程序时都支持某种形式的日志系统，你可以用来检查这些日志。如前所述，Fly.io就是其中之一。

<!-- Every time you're working on a project with a backend, <i>it is critical to keep an eye on the console output of the backend</i>. If you are working on a small screen, it is enough to just see a tiny slice of the output in the background. Any error messages will catch your attention even when the console is far back in the background: -->
每次你在一个有后端的项目上工作时，<i>关注后端的控制台输出是至关重要的</i>。如果你在一个小屏幕上工作，只需要在背景中看到一小部分输出就足够了。任何错误消息都会引起你的注意，即使控制台在后端很远：

![sample screenshot showing tiny slice of output](../../images/3/15b.png)

### Moving error handling into middleware

<!-- We have written the code for the error handler among the rest of our code. This can be a reasonable solution at times, but there are cases where it is better to implement all error handling in a single place. This can be particularly useful if we want to report data related to errors to an external error-tracking system like [Sentry](https://sentry.io/welcome/) later on. -->
我们在其他代码中编写了错误处理程序的代码。有时这可能是一个合理的解决方案，但有些情况下，最好在一个地方实现所有的错误处理。如果我们稍后想向像[Sentry](https://sentry.io/welcome/)这样的外部错误跟踪系统报告与错误相关的数据，这可能特别有用。

<!-- Let's change the handler for the <i>/api/notes/:id</i> route so that it passes the error forward with the <em>next</em> function. The next function is passed to the handler as the third parameter: -->
让我们更改<i>/api/notes/:id</i>路由的处理程序，使其使用<em>next</em>函数将错误传递下去。下一个函数作为第三个参数传递给处理程序：

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

<!-- The error that is passed forward is given to the <em>next</em> function as a parameter. If <em>next</em> was called without a parameter, then the execution would simply move onto the next route or middleware. If the <em>next</em> function is called with a parameter, then the execution will continue to the <i>error handler middleware</i>. -->
向前传递的错误作为一个参数给到<em>next</em>函数。如果<em>next</em>没有参数被调用，那么执行将简单地移动到下一个路由或中间件。如果<em>next</em>函数带有参数被调用，那么执行将继续到<i>错误处理中间件</i>。

<!-- Express [error handlers](https://expressjs.com/en/guide/error-handling.html) are middleware that are defined with a function that accepts <i>four parameters</i>. Our error handler looks like this: -->
Express的[(error handlers)错误处理器](https://expressjs.com/en/guide/error-handling.html)是定义了一个接受<i>四个参数</i>的函数的中间件。我们的错误处理器看起来像这样：

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
错误处理器检查错误是否为<i>CastError</i>异常，如果是，我们知道错误是由Mongo的无效对象id引起的。在这种情况下，错误处理器将使用作为参数传递的响应对象向浏览器发送响应。在所有其他错误情况下，中间件将错误传递给默认的Express错误处理器。

<!-- Note that the error-handling middleware has to be the last loaded middleware, also all the routes should be registered before the error-handler! -->
注意，错误处理中间件必须是最后加载的中间件，所有的路由都应该在错误处理器之前注册！

### The order of middleware loading

<!-- The execution order of middleware is the same as the order that they are loaded into express with the _app.use_ function. For this reason, it is important to be careful when defining middleware. -->
中间件的执行顺序与它们被加载到express的app.use函数的顺序相同。因此，定义中间件时需要小心。

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
json-parser中间件应该是加载到Express中的第一个中间件。如果顺序是以下的：
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
那么，HTTP请求发送的JSON数据在logger中间件或POST路由处理器中将不可用，因为在这个点上 _request.body_ 将是 _undefined_。

<!-- It's also important that the middleware for handling unsupported routes is next to the last middleware that is loaded into Express, just before the error handler. -->
同样重要的是，处理不支持的路由的中间件是加载到Express中的最后一个中间件，就在错误处理器之前。

<!-- For example, the following loading order would cause an issue: -->
例如，以下加载顺序会导致问题：

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
现在，未知端点的处理是在HTTP请求处理器之前进行的。由于未知端点处理器对所有请求都以<i>404 unknown endpoint</i>响应，所以在未知端点中间件发送响应后，不会调用任何路由或中间件。唯一的例外是错误处理器，它需要在未知端点处理器之后，放在最后。

### Other operations

<!-- Let's add some missing functionality to our application, including deleting and updating an individual note. -->
让我们为我们的应用程序添加一些缺失的功能，包括删除和更新单个笔记。

<!-- The easiest way to delete a note from the database is with the [findByIdAndDelete](https://mongoosejs.com/docs/api/model.html#Model.findByIdAndDelete()) method: -->
从数据库删除笔记的最简单方法是使用[findByIdAndDelete](https://mongoosejs.com/docs/api/model.html#Model.findByIdAndDelete())方法：

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
在删除资源的两种"成功"情况下，后端都以 <i>204 no content</i> 的状态码响应。这两种不同的情况是删除存在的笔记，和删除数据库中不存在的笔记 _result_ 回调参数可以用于检查是否实际删除了资源，如果我们认为有必要，我们可以使用这个信息为这两种情况返回不同的状态码。任何发生的异常都会传递给错误处理器。

<!-- The toggling of the importance of a note can be easily accomplished with the [findByIdAndUpdate](https://mongoosejs.com/docs/api/model.html#model_Model-findByIdAndUpdate) method. -->
使用[findByIdAndUpdate](https://mongoosejs.com/docs/api/model.html#model_Model-findByIdAndUpdate)方法可以轻松地切换笔记的重要性。

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

<!-- In the code above, we also allow the content of the note to be edited. -->
在上面的代码中，我们还允许编辑笔记的内容。

<!-- Notice that the <em>findByIdAndUpdate</em> method receives a regular JavaScript object as its parameter, and not a new note object created with the <em>Note</em> constructor function. -->
注意，<em>findByIdAndUpdate</em>方法接收的是一个常规的JavaScript对象作为参数，而不是一个用<em>Note</em>构造函数创建的新笔记对象。

<!-- There is one important detail regarding the use of the <em>findByIdAndUpdate</em> method. By default, the <em>updatedNote</em> parameter of the event handler receives the original document [without the modifications](https://mongoosejs.com/docs/api/model.html#model_Model-findByIdAndUpdate). We added the optional <code>{ new: true }</code> parameter, which will cause our event handler to be called with the new modified document instead of the original. -->
关于使用<em>findByIdAndUpdate</em>方法有一个重要的细节。默认情况下，事件处理器的<em>updatedNote</em>参数接收的是[没有修改的](https://mongoosejs.com/docs/api/model.html#model_Model-findByIdAndUpdate)原始文档。我们添加了可选的<code>{ new: true }</code>参数，这将导致我们的事件处理器被调用时，使用新的修改过的文档而不是原始文档。

<!-- After testing the backend directly with Postman or the VS Code REST client, we can verify that it seems to work. The frontend also appears to work with the backend using the database. -->
在直接使用Postman或VS Code REST客户端测试后端后，我们可以验证它似乎是工作的。前端也似乎能够使用数据库与后端一起工作。

<!-- You can find the code for our current application in its entirety in the <i>part3-5</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-5). -->
你可以在<i>part3-5</i>分支的[这个GitHub仓库](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-5)中找到我们当前应用程序的完整代码。
### A true full stack developer's oath

<!-- It is again time for the exercises. The complexity of our app has now taken another step since besides frontend and backend we also have a database.  -->
现在又是练习的时候了。我们的应用程序的复杂性现在又上升了一个阶段，因为除了前端和后端，我们还有一个数据库。

<!-- There are indeed really many potential sources of error. -->
的确，有很多可能的错误来源。

<!-- So we should once more extend our oath: -->
所以我们应该再次扩展我们的誓言：

<!-- Full stack development is <i> extremely hard</i>, that is why I will use all the possible means to make it easier -->
全栈开发是<i>极其困难的</i>，这就是为什么我会使用所有可能的手段来使它变得更容易

<!-- - I will have my browser developer console open all the time
- I will use the network tab of the browser dev tools to ensure that frontend and backend are communicating as I expect
- I will constantly keep an eye on the state of the server to make sure that the data sent there by the frontend is saved there as I expect
- <i>I will keep an eye on the database: does the backend save data there in the right format</i>
- I progress with small steps
- I will write lots of _console.log_ statements to make sure I understand how the code behaves and to help pinpoint problems
- If my code does not work, I will not write more code. Instead, I start deleting the code until it works or just return to a state when everything was still working
- When I ask for help in the course Discord or Telegram channel or elsewhere I formulate my questions properly, see [here](https://fullstackopen.com/en/part0/general_info#how-to-ask-help-in-discord-telegam) how to ask for help -->

- 我会一直打开浏览器开发者控制台
- 我会使用浏览器开发工具的网络标签，确保前端和后端的通信符合我的预期
- 我会不断关注服务器的状态，确保前端发送到那里的数据按我预期的方式保存
- <i>我会关注数据库：后端是否以正确的格式保存数据</i>
- 我会以小步骤前进
- 我会写很多的_console.log_语句，以确保我理解代码的行为，并帮助定位问题
- 如果我的代码不能工作，我不会写更多的代码。相反，我开始删除代码，直到它工作，或者只是返回到一切都还在工作的状态
- 当我在课程的Discord或Telegram频道或其他地方寻求帮助时，我会合适地提出我的问题，看[这里](https://fullstackopen.com/en/part0/general_info#how-to-ask-help-in-discord-telegam)了解如何寻求帮助。

</div>

<div class="tasks">

### Exercises 3.15.-3.18.

#### 3.15: Phonebook database, step 3

<!-- Change the backend so that deleting phonebook entries is reflected in the database. -->
更改后端，使得删除电话簿条目在数据库中得到反映。

<!-- Verify that the frontend still works after making the changes. -->
在进行更改后，验证前端是否仍然工作。

#### 3.16: Phonebook database, step 4

<!-- Move the error handling of the application to a new error handler middleware. -->
将应用程序的错误处理移动到新的错误处理中间件。

#### 3.17*: Phonebook database, step 5

<!-- If the user tries to create a new phonebook entry for a person whose name is already in the phonebook, the frontend will try to update the phone number of the existing entry by making an HTTP PUT request to the entry's unique URL. -->
如果用户试图为电话簿中已有姓名的人创建新的电话簿条目，前端将尝试通过向条目的唯一URL发送HTTP PUT请求来更新现有条目的电话号码。

<!-- Modify the backend to support this request. -->
修改后端以支持这个请求。

<!-- Verify that the frontend works after making your changes. -->
在进行更改后，验证前端是否工作。

#### 3.18*: Phonebook database step 6

<!-- Also update the handling of the <i>api/persons/:id</i> and <i>info</i> routes to use the database, and verify that they work directly with the browser, Postman, or VS Code REST client. -->
也试试更新<i>api/persons/:id</i>和<i>info</i>路由的处理，以使用数据库，并验证它们是否可以直接使用浏览器、Postman或VS Code REST客户端工作。

<!-- Inspecting an individual phonebook entry from the browser should look like this: -->
从浏览器查看单个电话簿条目应该是这样的：

![screenshot of browser showing one person with api/persons/their_id](../../images/3/49.png)

</div>
