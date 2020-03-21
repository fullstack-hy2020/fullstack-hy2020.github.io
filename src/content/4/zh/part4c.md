---
mainImage: ../../../images/part-4.svg
part: 4
letter: c
lang: zh
---

<div class="content">



We want to add user authentication and authorization to our application. Users should be stored in the database and every note should be linked to the user who created it. Deleting and editing a note should only be allowed for the user who created it.
我们希望将用户身份验证和授权添加到应用中。 用户应该存储在数据库中，并且每个便笺都应该链接到创建它的用户。 删除和编辑便笺应该只允许创建它的用户使用。


Let's start by adding information about users to the database. There is a one-to-many relationship between the user (<i>User</i>) and notes (<i>Note</i>):
让我们从向数据库添加有关用户的信息开始。 用户(i User / i)和便笺(i Note / i)之间存在一对多的关系:

![](https://yuml.me/a187045b.png)
! [ https://yuml.me/a187045b.png ]


If we were working with a relational database the implementation would be straightforward. Both resources would have their separate database tables, and the id of the user who created a note would be stored in the notes table as a foreign key.
如果我们与关系数据库合作，那么实现起来会很简单。 这两个资源都有各自的数据库表，创建便条的用户的 id 将作为外键存储在便条表中。


When working with document databases the situation is a bit different, as there are many different ways of modeling the situation.
在使用文档数据库时，情况有点不同，因为有许多不同的方法对情况进行建模。


The existing solution saves every note in the <i>notes collection</i> in the database. If we do not want to change this existing collection, then the natural choice is to save users in their own collection,  <i>users</i> for example.
现有的解决方案将<i>notes collection</i> 中的所有便笺保存到数据库中。 如果我们不想更改这个现有的集合，那么自然的选择是将用户保存到他们自己的集合中，例如<i>users</i>。


Like with all document databases, we can use object id's in Mongo to reference documents in other collections. This is similar to using foreign keys in relational databases.
与所有文档数据库一样，我们可以使用 Mongo 中的对象 id 来引用其他集合中的文档。 这类似于在关系数据库中使用外键。


Traditionally document databases like Mongo do not support  <i>join queries</i> that are available in relational databases,  used for aggregating data from multiple tables. However starting from version 3.2. Mongo has supported [lookup aggregation queries](https://docs.mongodb.com/manual/reference/operator/aggregation/lookup/). We will not be taking a look at this functionality in this course.
传统上，像 Mongo 这样的文档数据库不支持在关系数据库中可用的<i>join queries</i>，用于聚合来自多个表的数据。 但是从3.2版本开始。 支持[查找聚合查询]( https://docs.mongodb.com/manual/reference/operator/aggregation/lookup/ )。 在这门课中，我们不会看这个功能。


If we need a functionality similar to join queries, we will implement it in our application code by making multiple queries. In certain situations Mongoose can take care of joining and aggregating data, which gives the appearance of a join query. However, even in these situations Mongoose makes multiple queries to the database in the background.
如果我们需要一个类似于连接查询的功能，我们将通过进行多个查询在应用代码中实现它。 在某些情况下，Mongoose 可以负责连接和聚合数据，从而显示连接查询的外观。 然而，即使在这些情况下，Mongoose 也会在后台对数据库进行多次查询。


### References across collections
# # 跨集合的参考


If we were using a relational database the note would contain a <i>reference key</i> to the user who created it. In document databases we can do the same thing. 
如果我们使用的是关系数据库，那么便笺中就会包含一个<i>reference key</i> 来指向创建它的用户。 在文档数据库中，我们可以做同样的事情。


Let's assume that the <i>users</i> collection contains two users:
假设<i>users</i> 集合包含两个用户:

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
];
```


The <i>notes</i> collection contains three notes that all have a <i>user</i> field that references a user in the <i>users</i> collection:
I notes /<i>集合包含三个便笺，它们都有一个 i user</i> 字段，引用<i>users</i> 集合中的一个用户:

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


Document databases do not demand the foreign key to be stored in the note resources, it could <i>also</i> be stored in the users collection, or even both:
文档数据库不要求外键存储在便笺资源中，也可以 i / i 存储在用户集合中，甚至两者都存储:

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


Since users can have many notes, the related ids are stored in an array in the <i>notes</i> field.
因为用户可以有许多便笺，所以相关的 id 存储在<i>notes</i> 字段中的数组中。


Document databases also offer a radically different way of organizing the data: In some situations it might be beneficial to nest the entire notes array as a part of the documents in the users collection:
文档数据库还提供了一种完全不同的数据组织方式: 在某些情况下，将整个 notes 数组作为文档的一部分嵌套在用户集合中可能是有益的:

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


In this schema notes would be tightly nested under users and the database would not generate ids for them.
在这个模式中，便笺将紧密嵌套在用户之下，数据库不会为它们生成 id。


The structure and schema of the database is not as self-evident as it was with relational databases. The chosen schema must be one which supports the use cases of the application the best. This is not a simple design decision to make, as all use cases of the applications are not known when the design decision is made.
数据库的结构和模式不像关系数据库那样不言而喻。 所选择的模式必须能够最好地支持应用的用例。 这不是一个简单的设计决策，因为在作出设计决策时，不知道应用的所有用例。


Paradoxically, schema-less databases like Mongo require developers to make far more radical design decisions about data organization at the beginning of the project than relational databases with schemas. On average, relational databases offer a more-or-less suitable way of organizing data for many applications.
矛盾的是，像 Mongo 这样的无模式数据库要求开发人员在项目开始时对数据组织做出比有模式的关系数据库更彻底的设计决策。 一般来说，关系数据库为许多应用提供了或多或少合适的数据组织方式。


### Mongoose schema for users
# # # 用户的 Mongoose 模式


In this case, we make the decision to store the ids of the notes created by the user in the user document. Let's define the model for representing a user in the <i>models/user.js</i> file:
在这种情况下，我们决定将用户创建的便笺的 id 存储在用户文档中。 让我们定义在<i>模型 / 用户中表示用户的模型。 Js</i> 文件:

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


The ids of the notes are stored within the user document as an array of Mongo ids. The definition is as follows:
便笺的 id 作为 Mongo id 数组存储在用户文档中。 定义如下:

```js
{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Note'
}
```


The type of the field is <i>ObjectId</i> that references <i>note</i>-style documents. Mongo does not inherently know that this is a field that references notes, the syntax is purely related to and defined by Mongoose.
这个字段的类型是<i>ObjectId</i>，它引用<i>便笺</i> 样式的文档。 本质上并不知道这是一个引用便笺的字段，语法纯粹是与 Mongoose 相关并由 Mongoose 定义的。


Let's expand the schema of the note defined in the <i>model/note.js</i> file so that the note contains information about the user who created it:
让我们展开在<i>模型 / 便笺中定义的便笺的模式。 Js</i> 文件，以便便条包含关于创建它的用户的信息:

```js
const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 5
  },
  date: Date,
  important: Boolean,
  // highlight-start
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
  // highlight-end
})
```


In stark contrast to the conventions of relational databases, <i>references are now stored in both documents</i>: the note references the user who created it, and the user has an array of references to all of the notes created by them.
与关系数据库的惯例形成鲜明对比的是，i 引用现在存储在两个 document / i 中: 便笺引用创建它的用户，用户有一个对它们创建的所有便笺的引用数组。


### Creating users
创建用户


Let's implement a route for creating new users. Users have a unique <i>username</i>, a <i>name</i> and something called a <i>passwordHash</i>. The password hash is the output of a [one-way hash function](https://en.wikipedia.org/wiki/Cryptographic_hash_function) applied to the user's password. It is never wise to store unencrypted plaintext passwords in the database!
让我们实现一个创建新用户的路由。 用户有一个唯一的<i>用户名</i>、一个<i>name</i> 和一个名为<i>passwordHash</i> 的东西。 密码散列是应用于用户密码的[单向散列函数]( https://en.wikipedia.org/wiki/cryptographic_hash_function )的输出。 在数据库中存储未加密的明文密码从来都是不明智的！


Let's install the [bcrypt](https://github.com/kelektiv/node.bcrypt.js) package for generating the password hashes:
让我们安装[ bcrypt ]( https://github.com/kelektiv/node.bcrypt.js 文件夹)包来生成密码哈希:

```bash
npm install bcrypt --save
```


Creating new users happens in compliance with the RESTful conventions discussed in [part 3](/en/part3/node_js_and_express#rest), by making an HTTP POST request to the <i>users</i> path.
通过向<i>users</i> 路径发出 HTTP POST 请求，创建新用户符合[ part 3](/ en / part3 / node js 和 express # rest)中讨论的 RESTful 约定。


Let's define a separate <i>router</i> for dealing with users in a new <i>controllers/users.js</i> file. Let's take the router into use in our application in the <i>app.js</i> file, so that it handles requests made to the <i>/api/users</i> url:
让我们定义一个单独的<i>路由器</i> 来处理新<i>控制器 / 用户中的用户。 Js</i> 文件。 让我们在<i>app.js</i> 文件的应用中使用这个路由器，这样它就能处理对<i>/ api / users</i> url 发出的请求:

```js
const usersRouter = require('./controllers/users')

// ...

app.use('/api/users', usersRouter)
```


The contents of the file that defines the router are as follows:
定义路由器的文件的内容如下:

```js
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const body = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.json(savedUser)
})

module.exports = usersRouter
```


The password sent in the request is <i>not</i> stored in the database. We store the <i>hash</i> of the password that is generated with the _bcrypt.hash_ function.
请求中发送的密码是<i>/ i 不存储在数据库中。 我们存储使用 bcrypt.hash 函数生成的密码的 i hash</i>。


The fundamentals of [storing passwords](https://codahale.com/how-to-safely-store-a-password/) is outside the scope of this course material. We will not discuss what the magic number 10 assigned to the [saltRounds](https://github.com/kelektiv/node.bcrypt.js/#a-note-on-rounds) variable means, but you can read more about it in the linked material.
[储存密码]( https://codahale.com/how-to-safely-store-a-password/ )的基本原理不在本课程教材的范围之内。 我们不会讨论分配给[ saltRounds ]( https://github.com/kelektiv/node.bcrypt.js/#a-note-on-rounds )变量的神奇数字10意味着什么，但是你可以在链接材料中了解更多。


Our current code does not contain any error handling or input validation for verifying that the username and password are in the desired format.
我们的当前代码不包含任何用于验证用户名和密码是否为所需格式的错误处理或输入验证。


The new feature can and should initially be tested manually with a tool like Postman. However testing things manually will quickly become too cumbersome, especially once we implement functionality that enforces usernames to be unique.
新特性可以并且应该首先使用 Postman 这样的工具进行手动测试。 然而，手动测试将很快变得过于繁琐，特别是一旦我们实现了强制用户名保持唯一的功能。


It takes much less effort to write automated tests, and it will make the development of our application much easier.
编写自动化测试所需的工作量要少得多，而且它将使应用的开发更加容易。


Our initial tests could look like this:
我们最初的测试可能是这样的:

```js
const bcrypt = require('bcrypt')
const User = require('../models/user')

//...

describe('when there is initially one user at db', () => {
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
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })
})
```


The tests use the <i>usersInDb()</i> helper function that we implemented in the <i>tests/test_helper.js</i> file. The function is used to help us verify the state of the database after a user is created:
测试使用我们在<i>tests / test helper.js</i> 文件中实现的<i>usersInDb ()</i> helper 函数。 该函数用于帮助我们在创建用户后验证数据库的状态:

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


The <i>beforeEach</i> block adds a user with the username <i>root</i> to the database. We can write a new test that verifies that a new user with the same username can not be created:
Ibeforeeach /<i>块将用户名为 i root</i> 的用户添加到数据库中。 我们可以编写一个新的测试来验证不能创建具有相同用户名的新用户:

```js
describe('when there is initially one user at db', () => {
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

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })
})
```


The test case obviously will not pass at this point. We are essentially practicing [test-driven development (TDD)](https://en.wikipedia.org/wiki/Test-driven_development), where tests for new functionality are written before the functionality is implemented.
测试用例显然不会在这一点上通过。 我们实际上是在实践[测试驱动开发测试驱动程序(TDD)]( https://en.wikipedia.org/wiki/test-driven_development ) ，在实现功能之前编写新功能的测试。


Let's validate the uniqueness of the username with the help of Mongoose validators. As we mentioned in exercise [3.19](/en/part3/validation_and_es_lint#exercises-3-19-3-21), Mongoose does not have a built-in validator for checking the uniqueness of a field. We can find a ready-made solution for this from the [mongoose-unique-validator](https://www.npmjs.com/package/mongoose-unique-validator) npm package. Let's install it:
让我们在 Mongoose 验证器的帮助下验证用户名的唯一性。 正如我们在练习[3.19](/ en / part3 / validation and es lint # exercises-3-19-3-21)中提到的，Mongoose 没有内置的验证器来检查字段的唯一性。 我们可以从[ mongoose-unique-validator ]( https://www.npmjs.com/package/mongoose-unique-validator ) npm 包中找到现成的解决方案。 让我们安装它:

```bash
npm install --save mongoose-unique-validator
```


We must make the following changes to the schema defined in the <i>models/user.js</i> file:
我们必须对<i>models / user. js</i> 文件中定义的模式进行如下更改:

```js
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator') // highlight-line

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true  // highlight-line
  },
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

We could also implement other validations into the user creation. We could check that the username is long enough, that the username only consists of permitted characters, or that the password is strong enough. Implementing these functionalities is left as an optional exercise.
我们还可以在用户创建过程中实现其他验证。 我们可以检查用户名是否足够长，用户名是否只包含允许的字符，或者密码是否足够强大。 实现这些功能是一个可选的练习。


Before we move onward, let's add an initial implementation of a route handler that returns all of the users in the database:
在我们继续之前，让我们添加一个路由处理器的初始实现，它返回数据库中的所有用户:

```js
usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users.map(u => u.toJSON()))
})
```

The list looks like this:
这个列表看起来像这样:

![](../../images/4/9.png)



You can find the code for our current application in its entirety in the <i>part4-7</i> branch of [this github repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-7).
您可以在[ this github repository ]的<i>part4-7</i> 分支中找到我们当前应用的全部代码，该分支位于 https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-7文件库中。

### Creating a new note
创造一个新的便笺

The code for creating a new note has to be updated so that the note is assigned to the user who created it.
创建新便笺的代码必须更新，以便便笺分配给创建它的用户。

Let's expand our current implementation so, that the information about the user who created a note is sent in the <i>userId</i> field of the request body:
让我们展开当前的实现，以便在请求主体的<i>userId</i> 字段中发送关于创建便条的用户的信息:

```js
const User = require('../models/user')

//...

notesRouter.post('/', async (request, response, next) => {
  const body = request.body

  const user = await User.findById(body.userId) //highlight-line

  const note = new Note({
    content: body.content,
    important: body.important === undefined ? false : body.important,
    date: new Date(),
    user: user._id //highlight-line
  })

  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id) //highlight-line
  await user.save()  //highlight-line
  
  response.json(savedNote.toJSON())
})
```

It's worth noting that the <i>user</i> object also changes. The <i>id</i> of the note is stored in the <i>notes</i> field:
值得注意的是，i user / i 对象也会发生变化:

```js
const user = User.findById(userId)

// ...

user.notes = user.notes.concat(savedNote._id)
await user.save()
```

Let's try to create a new note
让我们尝试创建一个新的便笺

![](../../images/4/10e.png)


The operation appears to work. Let's add one more note and then visit the route for fetching all users:
这个操作看起来起作用了。让我们再添加一个便笺，然后访问获取所有用户的路由:

![](../../images/4/11e.png)


We can see that the user has two notes. 
我们可以看到用户有两个便笺。

Likewise, the ids of the users who created the notes can be seen when we visit the route for fetching all notes:
同样，当我们访问获取所有便笺的路径时，可以看到创建便笺的用户的 id:

![](../../images/4/12e.png)


### Populate
填充

We would like our API to work in such a way, that when an HTTP GET request is made to the <i>/api/users</i> route, the user objects would also contain the contents of the user's notes, and not just their id. In a relational database, this functionality would be implemented with a <i>join query</i>.
我们希望我们的 API 以这样的方式工作: 当向<i>/ API / users</i> 路由发出 HTTP GET 请求时，用户对象也将包含用户便笺的内容，而不仅仅是它们的 id。 在一个关系数据库中，这个功能将通过<i>join query</i> 来实现。

As previously mentioned, document databases do not properly support join queries between collections, but the Mongoose library can do some of these joins for us. Mongoose accomplishes the join by doing multiple queries, which is different from join queries in relational databases which are <i>transactional</i>, meaning that the state of the database does not change during the time that the query is made. With join queries in Mongoose, nothing can guarantee that the state between the collections being joined is consistent, meaning that if we make a query that joins the user and notes collections, the state of the collections may change during the query.
正如前面提到的，文档数据库不能正确地支持集合之间的连接查询，但 Mongoose 库可以为我们做一些这样的连接。 Mongoose 通过执行多个查询来完成连接，这与关系数据库中的连接查询不同，后者是<i>transactional</i>，即在执行查询期间数据库的状态不会改变。 使用 Mongoose 中的连接查询，没有什么可以保证正在连接的集合之间的状态是一致的，这意味着如果我们进行连接用户和便笺集合的查询，集合的状态可能在查询期间发生变化。


The Mongoose join is done with the [populate](http://mongoosejs.com/docs/populate.html) method. Let's update the route that returns all users first:
Mongoose 的连接是通过[ populate ]( http://mongoosejs.com/docs/populate.html 地址)方法完成的，让我们首先更新返回所有用户的路由:

```js
usersRouter.get('/', async (request, response) => {
  const users = await User  // highlight-line
    .find({}).populate('notes') // highlight-line

  response.json(users.map(u => u.toJSON()))
})
```


The [populate](http://mongoosejs.com/docs/populate.html) method is chained after the <i>find</i> method making the initial query. The parameter given to the populate method defines that the <i>ids</i> referencing <i>note</i> objects in the <i>notes</i> field of the <i>user</i> document will be replaced by the referenced <i>note</i> documents.
在进行初始查询的<i>find</i> 方法之后，[ populate ]( http://mongoosejs.com/docs/populate.html )方法被链接起来。 为 populate 方法提供的参数定义了<i>user</i> 文档的<i>notes</i> 字段中引用<i>note</i> 对象的<i>id</i> 将被引用的<i>note</i> 文档替换。

The result is almost exactly what we wanted:
结果几乎正是我们想要的:

![](../../images/4/13ea.png)


We can use the populate parameter for choosing the fields we want to include from the documents. The selection of fields is done with the Mongo [syntax](https://docs.mongodb.com/manual/tutorial/project-fields-from-query-results/#return-the-specified-fields-and-the-id-field-only):
我们可以使用 populate 参数从文档中选择我们想要包含的字段。 字段的选择是用 Mongo [语法]( https://docs.mongodb.com/manual/tutorial/project-fields-from-query-results/#return-The-specified-fields-and-The-id-field-only )来完成的:

```js
usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('notes', { content: 1, date: 1 })

  response.json(users.map(u => u.toJSON()))
});
```

The result is now exactly like we want it to be:
现在的结果完全符合我们的期望:

![](../../images/4/14ea.png)


Let's also add a suitable population of user information to notes:
我们还可以在便笺中添加一组合适的用户信息:

```js
notesRouter.get('/', async (request, response) => {
  const notes = await Note
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(notes.map(note => note.toJSON()))
});
```


Now the user's information is added to the <i>user</i> field of note objects.
现在用户的信息被添加到便笺对象的<i>user</i> 字段中。

![](../../images/4/15ea.png)



It's important to understand that the database does not actually know that the ids stored in the <i>user</i> field of notes reference documents in the user collection.
需要理解的是，数据库实际上并不知道存储在用户集合中 notes 引用文档的<i>user</i> 字段中的 id。

The functionality of the <i>populate</i> method of Mongoose is based on the fact that we have defined "types" to the references in the Mongoose schema with the <i>ref</i> option:
的<i>populate</i> 方法的功能基于这样一个事实，即我们已经使用<i>ref</i> 选项为 Mongoose 模式中的引用定义了“类型” :

```js
const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 5
  },
  date: Date,
  important: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})
```

You can find the code for our current application in its entirety in the <i>part4-8</i> branch of [this github repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-8).
您可以在[ this github repository ]的<i>part4-8</i> 分支中找到我们当前应用的全部代码，该分支位于 https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-8。

</div>

