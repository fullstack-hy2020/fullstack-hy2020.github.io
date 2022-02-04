---
mainImage: ../../../images/part-13.svg
part: 13
letter: b
lang: zh
---

<div class="content">

### Application structuring

<!-- So far, we have written all the code in the same file. Now let's structure the application a little better. Let's create the following directory structure and files: -->
到目前为止，我们已经在同一个文件中编写了所有的代码。现在我们来优化下应用程序的结构。我们创建如下的目录结构和文件：

```
index.js
util
  config.js
  db.js
models
  index.js
  note.js
controllers
  notes.js
```

<!-- The contents of the files are as follows. The file <i>util/config.js</i> takes care of handling the environment variables: -->
文件的内容如下。文件 <i>util/config.js</i>  负责处理环境变量：

```js
require('dotenv').config()

module.exports = {
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT || 3001,
}
```

<!-- The role of the file <i>index.js</i> is to configure and launch the application: -->
文件 <i>index.js</i> i 的角色是配置和启动应用程序：

```js
const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const notesRouter = require('./controllers/notes')

app.use(express.json())

app.use('/api/notes', notesRouter)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()
```

<!-- Starting the application is slightly different from what we have seen before, because we want to make sure that the dabase connection is established successfully before the actual startup. -->
启动应用程序与我们之前看到的稍有不同， 因为我们希望确保在实际启动之前成功地建立数据库连接。

<!-- The file <i>util/db.js</i> contains the code to initialize the database: -->
文件  <i>util/db.js</i> 包含了初始化数据库的代码：

```js
const Sequelize = require('sequelize')
const { DATABASE_URL } = require('./config')

const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log('connected to the database')
  } catch (err) {
    console.log('failed to connect to the database')
    return process.exit(1)
  }

  return null
}

module.exports = { connectToDatabase, sequelize }
```

<!-- The notes in the model corresponding to the table to be stored are saved in the file <i>models/note.js</i> -->
与要存储的表对应的模型中的Note 保存在了文件  <i>models/note.js</i> 中。

```js
const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Note extends Model {}

Note.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  important: {
    type: DataTypes.BOOLEAN
  },
  date: {
    type: DataTypes.DATE
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'note'
})

module.exports = Note
```

<!-- The file <i>models/index.js</i> is almost useless at this point, as there is only one model in the application. When we start adding other models to the application, the file will become more useful because it will eliminate the need to import files defining individual models in the rest of the application. -->
目前，文件 <i>models/index.js</i>  几乎毫无用处，因为应用程序中只有一个模型。当我们开始向应用程序中添加其他模型时，该文件将变得更加有用，因为它将消除从应用程序的其余部分导入单个模型的需要。

```js
const Note = require('./note')

Note.sync()

module.exports = {
  Note
}
```

<!-- The route handling associated with notes can be found in the file <i>controllers/notes.js</i>: -->
与Note 相关的路由可以在 <i>controllers/notes.js</i> 中找到：

```js
const router = require('express').Router()

const { Note } = require('../models')

router.get('/', async (req, res) => {
  const notes = await Note.findAll()
  res.json(notes)
})

router.post('/', async (req, res) => {
  try {
    const note = await Note.create(req.body)
    res.json(note)
  } catch(error) {
    return res.status(400).json({ error })
  }
})

router.get('/:id', async (req, res) => {
  const note = await Note.findByPk(req.params.id)
  if (note) {
    res.json(note)
  } else {
    res.status(404).end()
  }
})

router.delete('/:id', async (req, res) => {
  const note = await Note.findByPk(req.params.id)
  if (note) {
    await note.destroy()
  }
  res.status(204).end()
})

router.put('/:id', async (req, res) => {
  const note = await Note.findByPk(req.params.id)
  if (note) {
    note.important = req.body.important
    await note.save()
    res.json(note)
  } else {
    res.status(404).end()
  }
})

module.exports = router
```

<!-- The structure of the application is good now. However, we note that the route handlers that handle a single note contain a bit of repetitive code, as all of them begin with the line that searches for the note to be handled: -->
目前应用程序的结构是良好的。然而，我们注意到，处理单个note的路由器处理程序包含一些重复的代码，因为所有这些处理程序都以搜索要处理的note的行开始:

```js
const note = await Note.findByPk(req.params.id)
```

<!-- Let's refactor this into our own <i>middleware</i> and implement it in the route handlers: -->
让我们把它重构到我们自己的中间件<i>middleware</i>中，并在路由处理程序中实现它

```js
const noteFinder = async (req, res, next) => {
  req.note = await Note.findByPk(req.params.id)
  next()
}

router.get('/:id', noteFinder, async (req, res) => {
  if (req.note) {
    res.json(req.note)
  } else {
    res.status(404).end()
  }
})

router.delete('/:id', noteFinder, async (req, res) => {
  if (req.note) {
    await req.note.destroy()
  }
  res.status(204).end()
})

router.put('/:id', noteFinder, async (req, res) => {
  if (req.note) {
    req.note.important = req.body.important
    await req.note.save()
    res.json(req.note)
  } else {
    res.status(404).end()
  }
})
```

<!-- The route handlers now receive <i>three</i> parameters, the first being a string defining the route and second being the middleware <i>noteFinder</i> we defined earlier, which retrieves the note from the database and places it in the <i>note</i> property of the <i>req</i> object. A small amount of copypaste is eliminated and we are satisfied! -->
路由处理现在接受三个参数，第一个是一个定义路由的字符串，第二个是我们前面定义的中间件   <i>noteFinder</i>， 它会从数据库中检索note， 并将其放置在 <i>note</i> 中的<i>req</i> 对象中。我们删除了部分冗余代码，看起来不错！

<!-- The current code for the application is in its entirety on [GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-2), branch <i>part13-2</i>. -->
当前的应用可以在  [GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-2) 中找到，处于 <i>part13-2</i> 分支。

</div>

<div class="tasks">

### Tasks 13.5.-13.7.

#### Task 13.5.

<!-- Change the structure of your application to match the example above, or to follow some other similar clear convention. -->
更改应用程序的结构以匹配上面的示例，或遵循其他类似的清晰约定。

#### Task 13.6.

<!-- Also, implement support for changing the number of a blog's likes in the application, i.e. the operation -->
另外，在应用程序支持中实现更改博客喜欢的数量，即操作

<!-- _PUT /api/blogs/:id_ (modifying the like count of a blog) -->
_PUT /api/blogs/:id_ （更改喜欢的数量）

<!-- The updated number of likes will be relayed with the request: -->
更新的点赞数目会随request转递:

```js
{
  likes: 3
}
```

#### Task 13.7.

<!-- Centralize the application error handling in middleware as in [part 3](/en/part3/saving_data_to_mongo_db#moving-error-handling-into-middleware). You can also enable middleware [express-async-errors](https://github.com/davidbanham/express-async-errors) as we did in [part 4](/en/part4/testing_the_backend#eliminating-the-try-catch). -->

在中间件中集中处理应用程序错误，如第3部分[part 3](/en/part3/saving_data_to_mongo_db#moving-error-handling-into-middleware)所示。您还可以启用中间件  [express-async-errors](https://github.com/davidbanham/express-async-errors) ，就像我们在第4部分[part 4](/en/part4/testing_the_backend#eliminating-the-try-catch)中所做的那样。

<!-- The data returned in the context of an error message is not very important. -->
在错误消息的上下文中返回的数据并不十分重要。

<!-- At this point, the situations that require error handling by the application are creating a new blog and changing the number of likes on a blog. Make sure the error handler handles both of these appropriately. -->
此时，需要应用程序进行错误处理的情况是创建一个新博客并更改博客上的赞数。确保错误处理程序适当地处理这两个问题。

</div>

<div class="content">

### User management

<!-- Next, let's add a database table <i>users</i> to the application, where the users of the application will be stored. In addition, we will add the ability to create users and token-based login as we implemented in [part 4](en/part4/token_authentication). For simplicity, we will adjust the implementation so that all users will have the same password <i>secret</i>.-->
接下来，让我们向应用程序添加一个数据库表用户，应用程序的用户将存储在该表中。此外，还实现了在[part 4](en/part4/token_authentication) 中创建用户和基于token的登录的可能性。为了简单起见，我们现在使实现使所有用户都拥有相同的密码<i>secret</i>。

<!-- The model defining users in the file <i>models/user.js</i> is straightforward -->
文件 <i>models/user.js</i> 中的用户定义模型非常简单：

```js
const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class User extends Model {}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'user'
})

module.exports = User
```

<!-- The username field is set to unique. The username could have basically been used as the primary key of the table. However, we decided to create the primary key as a separate field with integer value <i>id</i>. -->
用户名必须是唯一的。用户名基本上可以用作表的主密钥。但是，我们决定将主密钥创建为一个整数值  <i>id</i> ，作为单独字段。

<!-- The file <i>models/index.js</i> expands slightly: -->
文件  <i>models/index.js</i> 稍微扩展为:

```js
const Note = require('./note')
const User = require('./user') // highlight-line

User.sync() // highlight-line

module.exports = {
  Note, User // highlight-line
}
```

<!-- The route handlers that take care of creating a new user in the <i>controllers/users.js</i> file and displaying all users do not contain anything dramatic -->
在 <i>controllers/users.js</i> 文件中创建新用户并显示所有用户的路由处理程序不包含任何惊喜的内容

```js
const router = require('express').Router()

const { User } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll()
  res.json(users)
})

router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch(error) {
    return res.status(400).json({ error })
  }
})

router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

module.exports = router
```

<!-- The router handler that handles the login (file <i>controllers/login.js</i>) is as follows: -->
处理登录的路由器处理程序(文件<i>controllers/login.js</i>)如下:

```js
const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const User = require('../models/user')

router.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({
    where: {
      username: body.username
    }
  })

  const passwordCorrect = body.password === 'secret'

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET)

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = router
```

<!-- The POST request will be accompanied by a username and a password. First, the object corresponding to the username is retrieved from the database using the <i>User</i> model with the [findOne](https://sequelize.org/master/manual/model-querying-finders.html#-code-findone--code-) method: -->
POST 请求将附带一个用户名(<i>username</i>)和用户密码(<i>password</i>)。首先，使用模型 User 的方法  [findOne](https://sequelize.org/master/manual/model-querying-finders.html#-code-findone--code-) 从数据库中检索与用户对应的对象:

```js
const user = await User.findOne({
  where: {
    username: body.username
  }
})
```

<!-- From the console, we can see that the SQL statement corresponds to the method call -->
从控制台，我们可以看到 SQL 语句对应于方法调用

```sql
SELECT "id", "username", "name"
FROM "users" AS "User"
WHERE "User". "username" = 'mluukkai';
```

<!-- If the user is found and the password is correct (i.e. _secret_ for all the users), A <i>jsonwebtoken</i> containing the user's information is returned in the response. To do this, we install the dependency -->
如果找到用户并且密码正确(即所有用户的 _secret_) ，<i>jsonwebtoken</i> 将返回给包含用户信息的被调用者。为此，我们安装了一个依赖

```js
npm install jsonwebtoken
```

<!-- The file <i>index.js</i> expands slightly -->
 <i>index.js</i>  文件稍微扩展为

```js
const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

app.use(express.json())

app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
```

<!-- The current code for the application is in its entirety on [GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-3), branch <i>part13-3</i>. -->
应用程序的当前代码全部在  [GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-3)，分支 part13-3中。

### Connection between the tables

<!-- Users can now be added to the application and users can log in, but this in itself this is not a very useful feature yet. We would like to add the features that only a logged-in user can add notes, and that each note is associated with the user who created it. To do this, we need to add a <i>foreign key</i> to the <i>notes</i> table. -->
用户现在可以添加到应用程序中，用户可以登录，但是这本身并不是一个非常有用的特性。原因是，只有登录的用户才能添加note，并且每个note都与创建它的用户相关联。为此，我们需要note 的 <i>foreign key</i> 来存储表 <i>notes</i>。

<!-- When using Sequelize, a foreign key can be defined by modifying the <i>models/index.js</i> file as follows -->
在使用 Sequelize 时，可以通过如下修改<i>models/index.js</i>文件来定义引用键

```js
const Note = require('./note')
const User = require('./user')

// hightlight-start
User.hasMany(Note)
Note.belongsTo(User)

Note.sync({ alter: true })
User.sync({ alter: true })
// hightlight-end

module.exports = {
  Note, User
}
```

<!-- So this is how we [define](https://sequelize.org/master/manual/assocs.html#one-to-many-relationships) that there is a _one-to-many_ relationship connection between the <i>users</i> and <i>notes</i> entries. We also changed the options of the <i>sync</i> calls so that the tables in the database match changes made to the model definitions. The database schema looks like the following from the console: -->
这就是我们如何定义 [define](https://sequelize.org/master/manual/assocs.html#one-to-many-relationships)，用户<i>users</i> 和 <i>notes</i>  行之间有一对多的关系连接。我们还修改了<i>sync</i> 调用，以便在表定义有任何更改时修改表。现在从控制台查看数据库schema，它看起来如下所示:

```js
username=> \d users
                                     Table "public.users"
  Column | Type | Collation | Nullable | Default
----------+------------------------+-----------+----------+-----------------------------------
 id | integer | not null | nextval('users_id_seq'::regclass)
 username | character varying(255) | | not null |
 name | character varying(255) | | not null |
Indexes:
    "users_pkey" PRIMARY KEY, btree (id)
Referenced by:
    TABLE "notes" CONSTRAINT "notes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL

username=> \d notes
                                      Table "public.notes"
  Column | Type | Collation | Nullable | Default
-----------+--------------------------+-----------+----------+-----------------------------------
 id | integer | not null | nextval('notes_id_seq'::regclass)
 content | text | | not null |
 important | boolean | | | |
 date | timestamp with time zone | | | |
 user_id | integer | | | |
Indexes:
    "notes_pkey" PRIMARY KEY, btree (id)
Foreign-key constraints:
    "notes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL
```

<!-- The foreign key <i>user_id</i> has been created in the <i>notes</i> table, which refers to rows of the <i>users</i> table.-->
也就是说，引用键 <i>user_id</i> 已经在  <i>notes</i> 表中创建，该表引用表中的用户<i>users</i> 的行。

<!-- Now let's make every insertion of a new note be associated to a user. Before we do the proper implementation (where we associate the note with the logged-in user's token), let's hard code the note to be attached to the first user found in the database: -->
现在，让我们更改插入的新note，该note与用户相关联。在我们进行适当的实现之前(在联接发生时，使用 token 将note附加到登录的用户) ，将note附加到数据库中找到的第一个用户:

```js

router.post('/', async (req, res) => {
  try {
    // hightlight-start
    const user = await User.findOne()
    const note = await Note.create({...req.body, userId: user.id})
    // hightlight-end
    res.json(note)
  } catch(error) {
    return res.status(400).json({ error })
  }
})
```

<!-- Pay attention to how there is now a <i>user\_id</i> column in the notes at the database level. The corresponding object in each database row is referred to by Sequelize's naming convention as opposed to camel case (<i>userId</i>) as typed in the source code. -->

注意这里有一个列 <i>user\_id</i> 位于数据库级别的notes中。Sequelize 的命名转换会将数据库中每一行对应的对象转换为驼峰式(<i>userId</i>) ，就像源码里那样。

<!-- Making a join query is very easy. Let's change the route that returns all users so that each user's notes are also shown: -->
制作一个连接查询非常简单。我们改变像所有用户的路由，这样也可以显示每个用户的note:

```js
router.get('/', async (req, res) => {
  // highlight-start
  const users = await User.findAll({
    include: {
      model: Note
    }
  })
  // highlight-end
  res.json(users)
})
```

<!-- So the join query is done using the [include](https://sequelize.org/master/manual/assocs.html#eager-loading-example) option as a query parameter. -->
因此，连接查询是使用查询参数上的 [include](https://sequelize.org/master/manual/assocs.html#eager-loading-example)  包装来完成的。

<!-- The SQL statement generated from the query is seen on the console: -->
查询生成的 sql 语句可以在控制台上看到:

```
SELECT "User". "id", "User". "username", "User". "name", "Notes". "id" AS "Notes.id", "Notes". "content" AS "Notes.content", "Notes". "important" AS "Notes.important", "Notes". "date" AS "Notes.date", "Notes". "user_id" AS "Notes.UserId"
FROM "users" AS "User" LEFT OUTER JOIN "notes" AS "Notes" ON "User". "id" = "Notes". "user_id";
```

<!-- The end result is also as you might expect -->
最终结果也正如你所期望的那样

![](../../images/13/1.png)

### Proper insertion of notes

<!-- Let's change the note insertion by making it work the same as in [part 4](/en/part4), i.e. the creation of a note can only be successful if the request corresponding to the creation is accompanied by a valid token from login. The note is then stored in the list of notes created by the user identified by the token: -->
让我们通过与[section 4](/section4)相同来改变note的插入来使其工作，即note的创建只有在与创建相对应的请求在登录时伴随有有效的令牌时才能成功。这个note被存储在由标记用户创建的note列表中:

```js
// highlight-start
const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch{
      res.status(401).json({ error: 'token invalid' })
    }
  } } else {
    res.status(401).json({ error: 'token missing' })
  }
  next()
}
// highlight-end

router.post('/', tokenExtractor, async (req, res) => {
  try {
    // highlight-start
    const user = await User.findByPk(req.decodedToken.id)
    const note = await Note.create({...req.body, userId: user.id, date: new Date()})
    // highlight-end
    res.json(note)
  } catch(error) {
    return res.status(400).json({ error })
  }
})
```

<!-- The token is retrieved from the request headers, decoded and placed in the <i>req</i> object by the <i>tokenExtractor</i> middleware. When creating a note, a <i>date</i> field is also given indicating the time it was created. -->
令牌由 <i>tokenExtractor</i>  中间件从头部获取并解码到请求，并放置在  <i>req</i>  令牌中。在创建备注时，还会向字段提供一个 <i>date</i> ，指示创建该字段的时间。

### Fine-tuning

<!-- Our backend currently works almost the same way as the Part 4 version of the same application, except for error handling. Before we make a few extensions to backend, let's change the routes for retrieving all notes and all users slightly. -->
除了错误处理之外，我们的后端目前的工作方式几乎与同一应用程序的第4部分版本相同。在对后端进行一些扩展之前，让我们稍微更改一下所有note和所有用户的路由。

<!-- We will add to each note information about the user who added it: -->
我们将添加一个note，说明添加该note的用户的信息:

```js
router.get('/', async (req, res) => {
  const notes = await Note.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: user,
      attributes: ['name']
    }
  })
  res.json(notes)
})
```

<!-- We have also [restricted](https://sequelize.org/master/manual/model-querying-basics.html#specifying-attributes-for-select-queries) the values of which fields we want. For each note, we return all fields including the <i>name</i> of the user associated with the note but excluding the <i>userId</i>. -->
我们还限制了 [restricted](https://sequelize.org/master/manual/model-querying-basics.html#specifying-attributes-for-select-queries)  所需字段的值。从note中，我们获取除 userId 之外的所有字段，对于与note关联的用户，只获取名称。

<!-- Let's make a similar change to the route that retrieves all users, removing the unnecessary field <i>userId</i> from the notes associated with the user: -->
让我们对所有用户的路由进行类似的更改，从与用户相关的note中删除不必要的字段 userId:

```js
router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: note,
      attributes: { exclude: ['userId'] } // highlight-line
    }
  })
  res.json(users)
})
```

<!-- The current code for the application is in its entirety on [GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-4), branch <i>part13-4</i>. -->
应用程序的当前代码全部在 [GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-4)，分支 part13-4中。

### Attention to the definition of the models

<!-- The most perceptive will have noticed that despite the added column <i>user_id</i>, we did not make a change to the model that defines notes, but we can still add a user to note objects: -->
最明显的注意到，尽管添加了列用户 id，我们并没有对定义note的模型进行修改，但是我们可以为 notes 对象添加一个用户:

```js
const user = await User.findByPk(req.decodedToken.id)
const note = await Note.create({ ...req.body, userId: user.id, date: new Date() })
```

<!-- The reason for this is that we specificed in the file <i>models/index.js</i> that there is a one-to-many connection between users and notes: -->
原因是当我们在文件 <i>models/index.js</i> 中定义时，用户和注释之间存在一对多的连接:

```js
const Note = require('./note')
const User = require('./user')

User.hasMany(Note)
Note.belongsTo(User)

// ...
```

<!-- Sequelize will automatically create an attribute called <i>userId</i> on the <i>Note</i> model to which, when referenced gives access to the database column <i>user_id</i>. -->
Sequelize 将在名为 <i>userId</i>  的模块  <i>Note</i>  属性中自动创建，当引用该属性时，我们可以访问数据库列  <i>user_id</i>。

<!-- Keep in mind, that we could also create a note as follows using the [build](https://sequelize.org/master/class/lib/model.js~Model.html#static-method-build) method: -->
请记住，我们也可以使用 method  [build](https://sequelize.org/master/class/lib/model.js~Model.html#static-method-build) 创建如下注释:


```js
const user = await User.findByPk(req.decodedToken.id)

// create a note without saving it yet
const note = Note.build({ ...req.body, date: new Date() })
 // put the user id in the userId property of the created note
note.userId = user.id
// store the note object in the database
await note.save()
```


<!-- This is how we explicitly see that <i>userId</i> is an attribute of the notes object. -->
这就是我们如何明确地看到 <i>userId</i> 是 notes 对象的一个属性这一事实。

<!-- We could define the model as follows to get the same result: -->
我们也可以定义相同的模型:

```js
Note.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  important: {
    type: DataTypes.BOOLEAN
  },
  date: {
    type: DataTypes.DATE
  },
  // highlight-start
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  }
  // highlight-end
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'note'
})

module.exports = Note
```

<!-- Defining at the class level of the model as above is usually unnecessary -->
然而，这是不必要的。定义在模型类的水平

```js
User.hasMany(Note)
Note.belongsTo(User)
```

<!-- Instead we can achieve the same with this. Using one of the two methods is necessary otherwise Sequelize does not know how at the code level to connect the tables to each other. -->
相反是必要的，否则 Sequelize 不知道如何在代码级别相互附加表。

</div>

<div class="tasks">

### Tasks 13.8.-13.11.

#### Task 13.8.

<!-- Add support for users to the application. In addition to ID, users have the following fields: -->
为应用程序添加用户支持。除了 ID 之外，用户还有以下字段:

- name (string, must not be empty)
- username (string, must not be empty)

<!-- Unlike in the material, do not now prevent Sequelize from creating [timestamps](https://sequelize.org/master/manual/model-basics.html#timestamps) <i>created\_at</i> and <i>updated\_at</i> for users -->
与教材不同，现在不要阻止 Sequelize 为用户创建 <i>created\_at</i>  和 <i>updated\_at</i> 的 [timestamps](https://sequelize.org/master/manual/model-basics.html#timestamps)

<!-- All users can have the same password as the material. You can also choose to properly implement passwords as in [part 4](/en/part4/user_administration). -->
所有用户都可以使用与教材中相同的密码。您还可以选择正确地实现第4部分[part 4](/part4/user_management)中的密码。

<!-- Implement the following routes -->
实现如下路由

- _POST api/users_ (adding a new user)
- _GET api/users_ (listing all users)
- _PUT api/users/:username_ (changing a username, keep in mind that the parameter is not id but username)

<!-- Make sure that the timestamps <i>created\_at</i> and <i>updated\_at</i> automatically set by Sequelize work correctly when creating a new user and changing a username. -->
在创建新用户和更改用户名称时，确保 <i>created_at</i> 和 <i>updated_at</i> Sequelize 工作自动创建的正确性。

#### Exercise 13.9.

<!-- Sequelize provides a set of pre-defined [validations](https://sequelize.org/master/manual/validations-and-constraints.html) for the model fields, which it performs before storing the objects in the database. -->
Sequelize 为模型字段提供一组预定义的验证 [validations](https://sequelize.org/master/manual/validations-and-constraints.html)，它在将对象存储到数据库之前执行这些验证。

<!-- It's decided to change the user creation policy so that only a valid email address is valid as a username. Implement validation that verifies this issue during the creation of a user. -->
决定更改用户名创建策略，以便只有有效的电子邮件地址作为用户名是有效的。在创建 ID 时进行验证来检查。

<!-- Modify the error handling middleware to provide a more descriptive error message of the situation (for example, using the Sequelize error message), e.g. -->
修改错误处理中间件，在这种情况下提供更多描述性的错误消息(使用 Sequelize 错误消息) ，例如。

```js
{
    "error": [
        "Validation isEmail on username failed"
    ]
}
```

#### Exercise 13.10.

<!-- Expand the application so that the current logged-in user identified by a token is linked to each blog added. To do this you will also need to implement a login endpoint _POST /api/login_, which returns the token. -->
扩展应用程序，以便将 blog 附加到要通过令牌标识的登录用户。因此，您还需要实现登录端点_POST /api/login_，然后它返回令牌。

#### Exercise 13.11.

<!-- Make deletion of a blog only possible for the user who added the blog. -->
只有添加博客的用户才可以删除博客。

#### Task 13.12.

<!-- Modify the routes for retrieving all blogs and all users so that each blog shows the user who added it and each user shows the blogs they have added. -->
修改博客和用户的路径，以便博客显示添加博客的用户，用户显示用户的博客。

</div>

<div class="content">

### More queries

<!-- So far our application has been very simple in terms of queries, queries have searched for either a single row based on the primary key using the method [findByPk](https://sequelize.org/master/class/lib/model.js~Model.html#static-method-findByPk) or they have searched for all rows in the table using the method [findAll](https://sequelize.org/master/class/lib/model.js~Model.html#static-method-findAll). These are sufficient for the frontend of the application made in Section 5, but let's expand the backend so that we can also practice making slightly more complex queries. -->
到目前为止，我们的应用程序在查询方面非常简单，查询使用 METHOD  [findByPk](https://sequelize.org/master/class/lib/model.js~Model.html#static-method-findByPk)  搜索基于主键的单行，或者使用 [findAll](https://sequelize.org/master/class/lib/model.js~Model.html#static-method-findAll). 方法搜索表中的所有行。这些对于第5节中所做的应用程序的前端已经足够了，但是让我们扩展后端，以便我们还可以练习进行稍微复杂一点的查询。

<!-- Let's first implement the possibility to retrieve only important or non-important notes. Let's implement this using the [query-parameter](http://expressjs.com/en/5x/api.html#req.query) important: -->
让我们首先实现只检索重要的或者不重要的note的可能性，我们利用  [query-parameter](http://expressjs.com/en/5x/api.html#req.query)  来实现重要性搜索:

```js
router.get('/', async (req, res) => {
  const notes = await Note.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: user,
      attributes: ['name']
    },
    // highlight-start
    where: {
      important: req.query.important === "true"
    }
    // highlight-end
  })
  res.json(notes)
})
```

<!-- Now the backend can retrieve important notes with a request to http://localhost:3001/api/notes?important=true and non-important notes with a request to http://localhost:3001/api/notes?important=false -->
现在，后端可以检索重要的note，请求 http://localhost:3001/api/notes?important=true ，请求 http://localhost:3001/api/notes?important=false 获得非重要的note

<!-- The SQL query generated by Sequelize contains a WHERE clause that filters rows that would normally be returned: -->
由 Sequelize 生成的 SQL 查询包含一个 where 子句，用于分隔自然返回的行:

```sql
SELECT "note". "id", "note". "content", "note". "important", "note". "date", "user". "id" AS "user.id", "user". "name" AS "user.name"
FROM "notes" AS "note" LEFT OUTER JOIN "users" AS "user" ON "note". "user_id" = "user". "id"
WHERE "note". "important" = true;
```

<!-- Unfortunately, this implementation will not work if the request is not interested in whether the note is important or not, i.e. if the request is made to http://localhost:3001/api/notes. The correction can be done in several ways. One, but perhaps not the best way to do the correction would be as follows: -->
不幸的是，如果请求对note是否重要不感兴趣，例如请求是否发送给 http://localhost:3001/api/notes ，那么这种实现将不起作用。可以通过几种方式进行修正。其一，但也许不是最好的纠正方式是:

```js
const { Op } = require('sequelize')

router.get('/', async (req, res) => {
  // highlight-start
  let important = {
    [Op.in]: [true, false]
  }

  if ( req.query.important ) {
    important = req.query.important === "true"
  }
  // highlight-end

  const notes = await Note.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: user,
      attributes: ['name']
    },
    where: {
      important // highlight-line
    }
  })
  res.json(notes)
})
```

<!-- The <i>important</i> object now stores the query condition. The default query is -->
 <i>important</i>  的对象现在存储查询条件。它是默认的

```js
where: {
  important: {
    [Op.in]: [true, false]
  }
}
```

<!-- i.e. the <i>important</i> column can be <i>true</i> or <i>false</i>, using one of the many Sequelize operators [Op.in](https://sequelize.org/master/manual/model-querying-basics.html#operators). If the query parameter <i>req.query.important</i> is specified, the query changes to one of the two forms -->
例如，使用许多 Sequelize 操作  [Op.in](https://sequelize.org/master/manual/model-querying-basics.html#operators) 中的一个，列的  <i>important</i>  可以是  <i>true</i>  或  <i>false</i>。如果定义了查询参数 <i>req.query.important</i>，则将查询转换为其中一种形式

```js
where: {
  important: false
}
```

or
或者

```js
where: {
  important: true
}
```

<!-- depending on the value of the query parameter. -->
取决于查询参数的值。

<!-- The functionality can be further expanded by allowing the user to specify a required keyword when retrieving notes, e.g. a request to http://localhost:3001/api/notes?search=database will return all notes mentioning <i>database</i> or a request to http://localhost:3001/api/notes?search=javascript&important=true will return all notes marked as important and mentioning <i>javascript</i>. The implementation is as follows -->
通过允许你在检索note时指定所需的关键字来进一步扩展这个功能，例如向 http://localhost:3001/api/notes?search=database 提出的请求将返回所有提及database的note，或者向 http://localhost:3001/api/notes?search=javascript&important=true 提出的请求将返回所有标记为重要的提及 javascript 的笔记。具体实施情况如下

```js
router.get('/', async (req, res) => {
  let important = {
    [Op.in]: [true, false]
  }

  if ( req.query.important ) {
    important = req.query.important === "true"
  }

  const notes = await Note.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: user,
      attributes: ['name']
    },
    where: {
      important,
      // highlight-start
      content: {
        [Op.substring]: req.query.search ? req.query.search : ''
      }
      // highlight-end
    }
  })

  res.json(notes)
})
```

<!-- Sequelize's [Op.substring](https://sequelize.org/master/manual/model-querying-basics.html#operators) generates the query we want using the LIKE keyword in SQL. For example, if we make a query to http://localhost:3001/api/notes?search=database&important=true we will see that the SQL query it generates is exactly as we expect. -->
Sequelize 的  [Op.substring](https://sequelize.org/master/manual/model-querying-basics.html#operators)  使用 SQL 中的 like 关键字生成我们想要的查询。例如，如果我们向 http://localhost:3001/api/notes?search=database&important=true 查询，我们会看到它生成的 SQL 查询与我们假设的完全一样。

```sql
SELECT "note". "id", "note". "content", "note". "important", "note". "date", "user". "id" AS "user.id", "user". "name" AS "user.name"
FROM "notes" AS "note" LEFT OUTER JOIN "users" AS "user" ON "note". "user_id" = "user". "id"
WHERE "note". "important" = true AND "note". "content" LIKE '%database%';
```

<!-- There is still a beautiful flaw in our application that we see if we make a request to http://localhost:3001/api/notes, i.e. we want all the notes, our implementation will cause an unnecessary WHERE in the query, which may (depending on the implementation of the database engine) unnecessarily affect the query efficiency: -->
在我们的应用程序中仍然存在这样一个美丽的缺陷，如果我们发出一个请求 http://localhost:3001/api/notes，即我们想要所有的notes，我们的实现将导致查询中不必要的位置，这可能（取决于 关于数据库引擎的实现）不必要地影响查询效率：

```sql
SELECT "note". "id", "note". "content", "note". "important", "note". "date", "user". "id" AS "user.id", "user". "name" AS "user.name"
FROM "notes" AS "note" LEFT OUTER JOIN "users" AS "user" ON "note". "user_id" = "user". "id"
WHERE "note". "important" IN (true, false) AND "note". "content" LIKE '%%';
```

<!-- Let's optimize the code so that the WHERE conditions are used only if necessary: -->
让我们优化代码，以便只在必要时使用 where 条件:

```js
router.get('/', async (req, res) => {
  const where = {}

  if (req.query.important) {
    where.important = req.query.important === "true"
  }

  if (req.query.search) {
    where.content = {
      [Op.substring]: req.query.search
    }
  }

  const notes = await Note.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: user,
      attributes: ['name']
    },
    where
  })

  res.json(notes)
})
```

<!-- If the request has search conditions e.g. http://localhost:3001/api/notes?search=database&important=true, a query containing WHERE is formed -->
如果请求具有搜索条件，例如 http://localhost:3001/api/notes?search=database&important=true ，则查询包含形成的位置

```sql
SELECT "note". "id", "note". "content", "note". "important", "note". "date", "user". "id" AS "user.id", "user". "name" AS "user.name"
FROM "notes" AS "note" LEFT OUTER JOIN "users" AS "user" ON "note". "user_id" = "user". "id"
WHERE "note". "important" = true AND "note". "content" LIKE '%database%';
```

<!-- If the request has no search conditions http://localhost:3001/api/notes, then the query does not have an unnecessary WHERE -->
如果请求是无条件的 http://localhost:3001/api/notes ，那么查询就没有不必要的地方

```sql
SELECT "note". "id", "note". "content", "note". "important", "note". "date", "user". "id" AS "user.id", "user". "name" AS "user.name"
FROM "notes" AS "note" LEFT OUTER JOIN "users" AS "user" ON "note". "user_id" = "user". "id";
```

<!-- The current code for the application is in its entirety on [GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-5), branch <i>part13-5</i>. -->
应用程序的当前代码全部在  [GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-5)，分支 part13-5中。

</div>

<div class="tasks">

### Tasks 13.13.-13.16

#### Task 13.13.

<!-- Implement filtering by keyword in the application for the route returning all blogs. The filtering should work as follows -->
在应用程序中为返回所有博客的路由实现按关键字过滤

- _GET /api/blogs?search=react_ returns all blogs with the search word <i>react</i> in the <i>title</i> field, the search word is case-insensitive
- _GET /api/blogs_ returns all blogs


[This](https://sequelize.org/master/manual/model-querying-basics.html#operators) should be useful for this task and the next one.
这[This](https://sequelize.org/master/manual/model-querying-basics.html#operators) 对这个任务和下一个任务都是有用的。

#### Exercise 13.14.

<!-- Expand the filter to search for a keyword in either the <i>title</i> or <i>author</i> fields, i.e. -->
展开过滤器，在  <i>title</i> 和 <i>author</i>  字段中搜索关键字，即。

<!-- _GET /api/blogs?search=jami_ returns blogs with the search word <i>jami</i> in the <i>title</i> field or in the <i>author</i> field -->
_GET /api/blogs?serch=jami_ 返回 <i>title</i> 字段中的搜索词 <i>jami</i> 或  <i>author</i>  字段中的  <i>author</i>  的 blog
#### Exercise 13.15.

<!-- Modify the blogs route so that it returns blogs based on likes in descending order. Search the [documentation](https://sequelize.org/master/manual/model-querying-basics.html) for instructions on ordering, -->
修改博客路由，使其按照喜欢降序返回博客。在文档 [documentation](https://sequelize.org/master/manual/model-querying-basics.html) 中搜索有关排序的说明,

#### Task 13.16.

<!-- Make a route for the application _/api/authors_ that returns the number of blogs for each author and the total number of likes. Implement the operation directly at the database level. You will most likely need the [group by](https://sequelize.org/master/manual/model-querying-basics.html#grouping) functionality, and the [sequelize.fn](https://sequelize.org/master/manual/model-querying-basics.html#specifying-attributes-for-select-queries) aggregator function. -->
为应用程序/api/authors 创建一个路由，该路由返回每个作者的博客数量和喜欢的总数。直接在数据库级别实现操作。您很可能需要 [group by](https://sequelize.org/master/manual/model-querying-basics.html#grouping) ，以及  [sequelize.fn](https://sequelize.org/master/manual/model-querying-basics.html#specifying-attributes-for-select-queries)  聚合器函数。

<!-- The JSON returned by the route might look like the following, for example: -->
路由返回的 JSON 可能看起来像下面这样，例如:

```
[
  {
    author: "Jami Kousa",
    articles: "3",
    likes: "10"
  },
  {
    author: "Kalle Ilves",
    articles: "1",
    likes: "2"
  },
  {
    author: "Dan Abramov",
    articles: "1",
    likes: "4"
  }
]
```

<!-- Bonus task: order the data returned based on the number of likes, do the ordering in the database query. -->
奖励任务: 根据喜好对返回的数据进行排序，在数据库查询中进行排序。

</div>
