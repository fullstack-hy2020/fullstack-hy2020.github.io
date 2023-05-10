---
mainImage: ../../../images/part-4.svg
part: 4
letter: c
lang: zh
---

<div class="content">

<!-- We want to add user authentication and authorization to our application. Users should be stored in the database and every note should be linked to the user who created it. Deleting and editing a note should only be allowed for the user who created it.-->
我們想要為我們的應用程序添加用戶身份驗證和授權。用戶應該存儲在數據庫中，每個筆記應該與創建它的用戶相關聯。只有創建它的用戶才能刪除和編輯筆記。

<!-- Let''s start by adding information about users to the database. There is a one-to-many relationship between the user (<i>User</i>) and notes (<i>Note</i>):-->
让我们从向数据库添加用户信息开始。用户（<i>User</i>）与笔记（<i>Note</i>）之间存在一对多的关系：

![diagram linking user and notes](https://yuml.me/a187045b.png)

<!-- If we were working with a relational database the implementation would be straightforward. Both resources would have their separate database tables, and the id of the user who created a note would be stored in the notes table as a foreign key.-->
如果我们使用关系数据库，实现将会很简单。两个资源将会拥有它们各自的数据库表，并且创建笔记的用户的id将会存储在笔记表中作为一个外键。

<!-- When working with document databases the situation is a bit different, as there are many different ways of modeling the situation.-->
当使用文档数据库时，情况有点不同，因为有许多不同的建模方式。

<!-- The existing solution saves every note in the <i>notes collection</i> in the database. If we do not want to change this existing collection, then the natural choice is to save users in their own collection,  <i>users</i> for example.-->
现有的解决方案将数据库中的<i>笔记集合</i>中的每一条笔记都保存下来。如果我们不想改变这个现有的集合，那么自然的选择就是将用户保存在他们自己的集合中，比如<i>用户</i>。

<!-- Like with all document databases, we can use object IDs in Mongo to reference documents in other collections. This is similar to using foreign keys in relational databases.-->
就像所有文档数据库一样，我们可以在Mongo中使用对象ID来引用其他集合中的文档。这类似于在关系数据库中使用外键。

<!-- Traditionally document databases like Mongo do not support <i>join queries</i> that are available in relational databases,  used for aggregating data from multiple tables. However, starting from version 3.2. Mongo has supported [lookup aggregation queries](https://docs.mongodb.com/manual/reference/operator/aggregation/lookup/). We will not be taking a look at this functionality in this course.-->
传统的文档数据库，如Mongo，不支持在关系数据库中可用的<i>join查询</i>，用于聚合来自多个表的数据。然而，从3.2版本开始，Mongo支持[lookup聚合查询](https://docs.mongodb.com/manual/reference/operator/aggregation/lookup/)。我们不会在此课程中查看此功能。

<!-- If we need functionality similar to join queries, we will implement it in our application code by making multiple queries. In certain situations, Mongoose can take care of joining and aggregating data, which gives the appearance of a join query. However, even in these situations, Mongoose makes multiple queries to the database in the background.-->
如果我们需要类似于联接查询的功能，我们将通过多次查询在应用程序代码中实现它。 在某些情况下，Mongoose可以处理联接和聚合数据，这给人一种联接查询的外观。 但是，即使在这些情况下，Mongoose也会在后台对数据库进行多次查询。

### References across collections

<!-- If we were using a relational database the note would contain a <i>reference key</i> to the user who created it. In document databases, we can do the same thing.-->
如果我们使用关系型数据库，该笔记将包含一个<i>参考键</i>来指向创建它的用户。在文档数据库中，我们也可以做同样的事情。

<!-- Let''s assume that the <i>users</i> collection contains two users:-->
假设<i>用户</i>集合包含两个用户：

```js
[
  {
    username: 'mluukkai',
    _id: 123456,
  },
  {
    username: 'hellas',
    _id: 141414,
  },
]
```

<!-- The <i>notes</i> collection contains three notes that all have a <i>user</i> field that references a user in the <i>users</i> collection:-->
<i>笔记</i> 集合包含三个笔记，它们都有一个<i>用户</i>字段，引用<i>用户</i>集合中的一个用户：

```js
[
  {
    content: 'HTML is easy',
    important: false,
    _id: 221212,
    user: 123456,
  },
  {
    content: 'The most important operations of HTTP protocol are GET and POST',
    important: true,
    _id: 221255,
    user: 123456,
  },
  {
    content: 'A proper dinosaur codes with Java',
    important: false,
    _id: 221244,
    user: 141414,
  },
]
```

<!-- Document databases do not demand the foreign key to be stored in the note resources, it could <i>also</i> be stored in the users collection, or even both:-->
文档数据库不需要外键存储在节点资源中，它也可以存储在用户集合中，甚至两者都可以：

```js
[
  {
    username: 'mluukkai',
    _id: 123456,
    notes: [221212, 221255],
  },
  {
    username: 'hellas',
    _id: 141414,
    notes: [221244],
  },
]
```

<!-- Since users can have many notes, the related ids are stored in an array in the <i>notes</i> field.-->
因为用户可以有许多笔记，相关的ID存储在<i>notes</i>字段的数组中。

<!-- Document databases also offer a radically different way of organizing the data: In some situations, it might be beneficial to nest the entire notes array as a part of the documents in the users collection:-->
文档数据库还提供了一种完全不同的数据组织方式：在某些情况下，将整个notes数组作为users集合中的文档的一部分可能会有益：

```js
[
  {
    username: 'mluukkai',
    _id: 123456,
    notes: [
      {
        content: 'HTML is easy',
        important: false,
      },
      {
        content: 'The most important operations of HTTP protocol are GET and POST',
        important: true,
      },
    ],
  },
  {
    username: 'hellas',
    _id: 141414,
    notes: [
      {
        content:
          'A proper dinosaur codes with Java',
        important: false,
      },
    ],
  },
]
```

<!-- In this schema, notes would be tightly nested under users and the database would not generate ids for them.-->
在这个架构中，笔记将紧密嵌套在用户下，数据库不会为它们生成ID。

<!-- The structure and schema of the database are not as self-evident as it was with relational databases. The chosen schema must support the use cases of the application the best. This is not a simple design decision to make, as all use cases of the applications are not known when the design decision is made.-->
数据库的结构和模式不像关系数据库那样自明显。所选择的模式必须最好地支持应用程序的用例。这不是一个简单的设计决定，因为在做出设计决定时，应用程序的所有用例都不是已知的。

<!-- Paradoxically, schema-less databases like Mongo require developers to make far more radical design decisions about data organization at the beginning of the project than relational databases with schemas. On average, relational databases offer a more or less suitable way of organizing data for many applications.-->
反常的是，像Mongo这样的无模式数据库要求开发人员在项目开始时就对数据组织做出更加激进的设计决策，而关系数据库的模式则为许多应用提供了更多或更少合适的数据组织方式。

### Mongoose schema for users

<!-- In this case, we decide to store the ids of the notes created by the user in the user document. Let''s define the model for representing a user in the <i>models/user.js</i> file:-->
在这种情况下，我们决定将用户创建的笔记的id存储在用户文档中。让我们在<i>models/user.js</i>文件中定义表示用户的模型：

```js
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  passwordHash: String,
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ],
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User
```

<!-- The ids of the notes are stored within the user document as an array of Mongo ids. The definition is as follows:-->
用户文档中存储着笔记的id，以Mongo id数组的形式。定义如下：

```js
{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Note'
}
```

<!-- The type of the field is <i>ObjectId</i> that references <i>note</i>-style documents. Mongo does not inherently know that this is a field that references notes, the syntax is purely related to and defined by Mongoose.-->
字段的类型是<i>ObjectId</i>，它引用<i>note</i>风格的文档。 Mongo本身不知道这是一个引用笔记的字段，语法完全与Mongoose定义有关。

<!-- Let''s expand the schema of the note defined in the <i>models/note.js</i> file so that the note contains information about the user who created it:-->
让我们扩展<i>models/note.js</i>文件中定义的笔记的架构，以便笔记包含有关创建它的用户的信息：

```js
const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 5
  },
  important: Boolean,
  // highlight-start
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
  // highlight-end
})
```

<!-- In stark contrast to the conventions of relational databases, <i>references are now stored in both documents</i>: the note references the user who created it, and the user has an array of references to all of the notes created by them.-->
<i>相比关系数据库的惯例，现在在文档中存储了引用：笔记引用了创建它的用户，而用户有一个引用数组，指向他们创建的所有笔记。</i>

### Creating users

<!-- Let's implement a route for creating new users. Users have a unique <i>username</i>, a <i>name</i> and something called a <i>passwordHash</i>. The password hash is the output of a [one-way hash function](https://en.wikipedia.org/wiki/Cryptographic_hash_function) applied to the user's password. It is never wise to store unencrypted plain text passwords in the database!-->
让我们来实现一条用于创建新用户的路由。用户有一个唯一的<i>用户名</i>，一个<i>姓名</i>和一个叫做<i>passwordHash</i>的东西。passwordHash是应用于用户密码的[单向哈希函数](https://en.wikipedia.org/wiki/Cryptographic_hash_function)的输出。永远不要在数据库中存储未加密的纯文本密码！

<!-- Let''s install the [bcrypt](https://github.com/kelektiv/node.bcrypt.js) package for generating the password hashes:-->
让我们安装[bcrypt](https://github.com/kelektiv/node.bcrypt.js) 包来生成密码哈希：

```bash
npm install bcrypt
```

<!-- Creating new users happens in compliance with the RESTful conventions discussed in [part 3](/en/part3/node_js_and_express#rest), by making an HTTP POST request to the <i>users</i> path.-->
遵循[第三部分](/en/part3/node_js_and_express#rest)討論的RESTful規範，通過向<i>用戶</i>路徑發出HTTP POST請求來創建新用戶。

<!-- Let's define a separate <i>router</i> for dealing with users in a new <i>controllers/users.js</i> file. Let's take the router into use in our application in the <i>app.js</i> file, so that it handles requests made to the <i>/api/users</i> url:-->
让我们为处理新的<i>controllers/users.js</i>文件中的用户定义一个单独的<i>路由器</i>。 让我们在我们的应用程序中的<i>app.js</i>文件中使用该路由器，以便它处理发送到<i>/api/users</i> url的请求：

```js
const usersRouter = require('./controllers/users')

// ...

app.use('/api/users', usersRouter)
```

<!-- The contents of the file that defines the router are as follows:-->
文件定义路由器的内容如下：

```js
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter
```

<!-- The password sent in the request is <i>not</i> stored in the database. We store the <i>hash</i> of the password that is generated with the _bcrypt.hash_ function.-->
请求中发送的密码<i>不会</i>存储在数据库中，我们存储用_bcrypt.hash_函数生成的密码<i>哈希值</i>。

<!-- The fundamentals of [storing passwords](https://codahale.com/how-to-safely-store-a-password/) are outside the scope of this course material. We will not discuss what the magic number 10 assigned to the [saltRounds](https://github.com/kelektiv/node.bcrypt.js/#a-note-on-rounds) variable means, but you can read more about it in the linked material.-->
# 由于本课程教材范围之外，[存储密码](https://codahale.com/how-to-safely-store-a-password/)的基本原理不在此讨论范围内。我们不会讨论分配给[saltRounds](https://github.com/kelektiv/node.bcrypt.js/#a-note-on-rounds)变量的神奇数字10的意义，但您可以在链接材料中阅读更多信息。

<!-- Our current code does not contain any error handling or input validation for verifying that the username and password are in the desired format.-->
我們目前的代碼沒有對用戶名和密碼是否符合所需格式進行任何錯誤處理或輸入驗證。

<!-- The new feature can and should initially be tested manually with a tool like Postman. However testing things manually will quickly become too cumbersome, especially once we implement functionality that enforces usernames to be unique.-->
新功能可以且应该最初用像Postman这样的工具进行手动测试。然而，手动测试事物很快就会变得太麻烦，特别是当我们实施强制用户名唯一的功能时。

<!-- It takes much less effort to write automated tests, and it will make the development of our application much easier.-->
实现自动化测试需要投入的精力要少得多，而且这会使我们应用程序的开发变得更加容易。

<!-- Our initial tests could look like this:-->
我们的初步测试可能是这样的：

```js
const bcrypt = require('bcrypt')
const User = require('../models/user')

//...

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })
})
```

<!-- The tests use the <i>usersInDb()</i> helper function that we implemented in the <i>tests/test_helper.js</i> file. The function is used to help us verify the state of the database after a user is created:-->
测试使用我们在`tests/test_helper.js`文件中实现的<i>usersInDb()</i>帮助函数。 该函数用于帮助我们验证用户创建后数据库的状态：

```js
const User = require('../models/user')

// ...

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialNotes,
  nonExistingId,
  notesInDb,
  usersInDb,
}
```

<!-- The <i>beforeEach</i> block adds a user with the username <i>root</i> to the database. We can write a new test that verifies that a new user with the same username can not be created:-->
<i>beforeEach</i> 块会向数据库中添加一个用户名为<i>root</i>的用户。我们可以编写一个新的测试来验证不能创建具有相同用户名的新用户：

```js
describe('when there is initially one user in db', () => {
  // ...

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})
```

<!-- The test case obviously will not pass at this point. We are essentially practicing [test-driven development (TDD)](https://en.wikipedia.org/wiki/Test-driven_development), where tests for new functionality are written before the functionality is implemented.-->
测试用例显然在此刻不会通过。我们实质上是在练习[测试驱动开发(TDD)](https://en.wikipedia.org/wiki/Test-driven_development)，在实现新功能之前先写测试。

<!-- Mongoose does not have a built-in validator for checking the uniqueness of a field. Fortunately there is a ready-made solution for this, the [mongoose-unique-validator](https://www.npmjs.com/package/mongoose-unique-validator) library. Let us install the library:-->
Mongoose沒有內建的驗證器來檢查欄位的唯一性。幸運的是，有一個現成的解決方案，即[mongoose-unique-validator](https://www.npmjs.com/package/mongoose-unique-validator)庫。讓我們安裝該庫：

```bash
npm install mongoose-unique-validator
```

<!-- and extend the code by following the library documentation:-->
**英文**

This library provides an easy way to access data from a database.

**中文**

这个库提供了一种简单的方式来访问数据库中的数据。

```js
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator') // highlight-line

const userSchema = mongoose.Schema({
  // highlight-start
  username: {
    type: String,
    required: true,
    unique: true
  },
  // highlight-end
  name: String,
  passwordHash: String,
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ],
})

userSchema.plugin(uniqueValidator) // highlight-line

// ...
```

<!-- We could also implement other validations into the user creation. We could check that the username is long enough, that the username only consists of permitted characters, or that the password is strong enough. Implementing these functionalities is left as an optional exercise.-->
我们也可以在用户创建过程中实施其他有效的验证。我们可以检查用户名是否足够长，用户名是否只由允许的字符组成，或者密码是否足够强大。实施这些功能是一个可选的练习。

<!-- Before we move onward, let''s add an initial implementation of a route handler that returns all of the users in the database:-->
在我們繼續前進之前，讓我們增加一個初始的路由處理程序，它會返回資料庫中的所有使用者：

```js
usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})
```

<!-- For making new users in a production or development environment, you may send a POST request to ```/api/users/``` via Postman or REST Client in the following format:-->
发送POST请求到```/api/users/```，可以在生产或开发环境中创建新用户，可以使用Postman或REST Client，格式如下：

```js
{
    "username": "root",
    "name": "Superuser",
    "password": "salainen"
}

```

<!-- The list looks like this:-->
* Item 1
* Item 2
* Item 3

列表如下：
* 项目1
* 项目2
* 项目3

![browser api/users shows JSON data with notes array](../../images/4/9.png)

<!-- You can find the code for our current application in its entirety in the <i>part4-7</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-7).-->
你可以在[这个GitHub仓库](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-7)的<i>part4-7</i>分支中找到我们当前应用程序的完整代码。

### Creating a new note

<!-- The code for creating a new note has to be updated so that the note is assigned to the user who created it.-->
代码需要更新以便将新建笔记分配给创建它的用户。

<!-- Let''s expand our current implementation so that the information about the user who created a note is sent in the <i>userId</i> field of the request body:-->
让我们扩展我们当前的实现，以便将创建笔记的用户的信息发送到请求体的<i>userId</i>字段中：

```js
const User = require('../models/user') //highlight-line

//...

notesRouter.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findById(body.userId) //highlight-line

  const note = new Note({
    content: body.content,
    important: body.important === undefined ? false : body.important,
    user: user.id //highlight-line
  })

  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id) //highlight-line
  await user.save()  //highlight-line

  response.json(savedNote)
})
```
<!-- The note scheme will also need to change as follows in our models/note.js file:-->
在我們的模型/note.js文件中，筆記方案也需要按照以下方式進行變更：

```js
const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required: true,
  },
  important: Boolean,
  user: String, //highlight-line
})
```

<!-- It''s worth noting that the <i>user</i> object also changes. The <i>id</i> of the note is stored in the <i>notes</i> field:-->
注意，<i>用户</i> 对象也会发生变化。笔记的<i>id</i>存储在<i>notes</i>字段中：

```js
const user = await User.findById(body.userId)

// ...

user.notes = user.notes.concat(savedNote._id)
await user.save()
```

<!-- Let''s try to create a new note-->
让我们尝试创建一个新笔记

![Postman creating a new note](../../images/4/10e.png)

<!-- The operation appears to work. Let''s add one more note and then visit the route for fetching all users:-->
操作似乎可以正常工作。让我们再加上一个注释，然后访问用于获取所有用户的路由：

![api/users returns JSON with users and their array of notes](../../images/4/11e.png)

<!-- We can see that the user has two notes.-->
我们可以看到用户有两条笔记。

<!-- Likewise, the ids of the users who created the notes can be seen when we visit the route for fetching all notes:-->
同样，当我们访问获取所有笔记的路由时，可以看到创建笔记的用户的id：

![api/notes shows ids of numbers in JSON](../../images/4/12e.png)

### Populate

<!-- We would like our API to work in such a way, that when an HTTP GET request is made to the <i>/api/users</i> route, the user objects would also contain the contents of the user''s notes and not just their id. In a relational database, this functionality would be implemented with a <i>join query</i>.-->
我们希望我们的API的工作方式是这样的：当向<i>/api/users</i>路由发出HTTP GET请求时，用户对象也将包含用户笔记的内容，而不仅仅是他们的ID。在关系数据库中，这种功能将通过<i>join query</i>实现。

<!-- As previously mentioned, document databases do not properly support join queries between collections, but the Mongoose library can do some of these joins for us. Mongoose accomplishes the join by doing multiple queries, which is different from join queries in relational databases which are <i>transactional</i>, meaning that the state of the database does not change during the time that the query is made. With join queries in Mongoose, nothing can guarantee that the state between the collections being joined is consistent, meaning that if we make a query that joins the user and notes collections, the state of the collections may change during the query.-->
正如先前提到的，文档数据库不能很好地支持集合之间的联接查询，但是Mongoose库可以为我们做一些这样的联接。Mongoose实现联接的方式是多次查询，这与关系数据库中的联接查询<i>事务性</i>不同，意味着在查询期间数据库的状态不会改变。使用Mongoose的联接查询，没有任何能够保证联接的集合之间的状态是一致的，这意味着如果我们做一个连接用户和笔记集合的查询，在查询期间这些集合的状态可能会改变。

<!-- The Mongoose join is done with the [populate](http://mongoosejs.com/docs/populate.html) method. Let''s update the route that returns all users first:-->
Mongoose 的联接是通过 [populate](http://mongoosejs.com/docs/populate.html) 方法完成的。让我们先更新一下返回所有用户的路由：

```js
usersRouter.get('/', async (request, response) => {
  const users = await User  // highlight-line
    .find({}).populate('notes') // highlight-line

  response.json(users)
})
```

<!-- The [populate](http://mongoosejs.com/docs/populate.html) method is chained after the <i>find</i> method making the initial query. The parameter given to the populate method defines that the <i>ids</i> referencing <i>note</i> objects in the <i>notes</i> field of the <i>user</i> document will be replaced by the referenced <i>note</i> documents.-->
[populate](http://mongoosejs.com/docs/populate.html) 方法链接在<i>find</i>方法之后，进行初始查询。给populate方法的参数定义了在<i>user</i>文档的<i>notes</i>字段中引用<i>note</i>对象的<i>ids</i>将被引用的<i>note</i>文档替换。

<!-- The result is almost exactly what we wanted:-->
结果几乎完全符合我们的预期：

![JSON data showing populated notes and users data with repetition](../../images/4/13new.png)

<!-- We can use the populate parameter for choosing the fields we want to include from the documents. In addition to the field id:n we are now only interested in <i>content</i> and <i>important</i>.-->
我们可以使用populate参数来选择我们希望从文档中包含的字段。除了id:n之外，我们现在只对<i>content</i>和<i>important</i>感兴趣。

<!-- The selection of fields is done with the Mongo [syntax](https://docs.mongodb.com/manual/tutorial/project-fields-from-query-results/#return-the-specified-fields-and-the-id-field-only):-->
Mongo 语法用于选择字段：[语法](https://docs.mongodb.com/manual/tutorial/project-fields-from-query-results/#return-the-specified-fields-and-the-id-field-only)

```js
usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('notes', { content: 1, important: 1 })

  response.json(users)
})
```

<!-- The result is now exactly like we want it to be:-->
结果现在正如我们所想的那样：

![combined data showing no repetition](../../images/4/14new.png)

<!-- Let''s also add a suitable population of user information to notes:-->
# 让我们也添加一组合适的用户信息到笔记中：

```js
notesRouter.get('/', async (request, response) => {
  const notes = await Note
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(notes)
})
```

<!-- Now the user''s information is added to the <i>user</i> field of note objects.-->
现在用户信息已添加到笔记对象的<i>用户</i>字段中。

![notes JSON now has user info embedded too](../../images/4/15new.png)

<!-- It''s important to understand that the database does not know that the ids stored in the <i>user</i> field of notes reference documents in the user collection.-->
它很重要要明白，数据库不知道笔记字段中存储的ID引用用户集合中的文档。

<!-- The functionality of the <i>populate</i> method of Mongoose is based on the fact that we have defined "types" to the references in the Mongoose schema with the <i>ref</i> option:-->
<i>Mongoose</i> 的 <i>populate</i> 方法的功能基于我们在 Mongoose 架构中使用 <i>ref</i> 选项为引用定义了“类型”：

```js
const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 5
  },
  important: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})
```

<!-- You can find the code for our current application in its entirety in the <i>part4-8</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-8).-->
你可以在[这个GitHub存储库](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-8)的<i>part4-8</i>分支中找到我们当前应用程序的完整代码。

</div>
