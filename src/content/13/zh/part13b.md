---
mainImage: ../../../images/part-13.svg
part: 13
letter: b
lang: zh
---

<div class="content">

### Application structuring

<!-- So far, we have written all the code in the same file. Now let's structure the application a little better. Let's create the following directory structure and files:-->
现在让我们来组织一下应用，我们创建以下的目录结构和文件：

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

<!-- The contents of the files are as follows. The file <i>util/config.js</i> takes care of handling the environment variables:-->
文件内容如下：文件<i>util/config.js</i>负责处理环境变量：

```js
require('dotenv').config()

module.exports = {
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT || 3001,
}
```

<!-- The role of the file <i>index.js</i> is to configure and launch the application:-->
<i>index.js</i> 的作用是配置和启动应用程序：

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

<!-- Starting the application is slightly different from what we have seen before, because we want to make sure that the database connection is established successfully before the actual startup.-->
开始应用程序与我们以前看到的有些不同，因为我们要确保在实际启动之前成功建立数据库连接。

<!-- The file <i>util/db.js</i> contains the code to initialize the database:-->
文件<i>util/db.js</i>包含了初始化数据库的代码：

```js
const Sequelize = require('sequelize')
const { DATABASE_URL } = require('./config')

const sequelize = new Sequelize(DATABASE_URL)

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

<!-- The notes in the model corresponding to the table to be stored are saved in the file <i>models/note.js</i>-->
模型对应表格要存储的笔记保存在文件<i>models/note.js</i>中

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

<!-- The file <i>models/index.js</i> is almost useless at this point, as there is only one model in the application. When we start adding other models to the application, the file will become more useful because it will eliminate the need to import files defining individual models in the rest of the application.-->
文件<i>models/index.js</i>此时几乎没什么用处，因为应用中只有一个模型。当我们开始向应用中添加其他模型时，该文件将变得更有用，因为它将消除在应用程序的其余部分中导入定义单个模型的文件的需要。

```js
const Note = require('./note')

Note.sync()

module.exports = {
  Note
}
```

<!-- The route handling associated with notes can be found in the file <i>controllers/notes.js</i>:-->
跟笔记相关的路由处理可以在文件<i>controllers/notes.js</i>中找到：

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

<!-- The structure of the application is good now. However, we note that the route handlers that handle a single note contain a bit of repetitive code, as all of them begin with the line that searches for the note to be handled:-->
现在应用的结构很好。然而，我们注意到处理单个笔记的路由处理程序中包含一些重复的代码，因为它们都以搜索要处理的笔记的行开始：

```js
const note = await Note.findByPk(req.params.id)
```

<!-- Let's refactor this into our own <i>middleware</i> and implement it in the route handlers:-->
让我们将其重构成我们自己的<i>中间件</i>，并在路由处理程序中实现它：

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

<!-- The route handlers now receive <i>three</i> parameters, the first being a string defining the route and second being the middleware <i>noteFinder</i> we defined earlier, which retrieves the note from the database and places it in the <i>note</i> property of the <i>req</i> object. A small amount of copypaste is eliminated and we are satisfied!-->
路由处理程序现在接收<i>三</i>个参数，第一个是定义路由的字符串，第二个是我们先前定义的中间件<i>noteFinder</i>，它从数据库中检索笔记并将其放入<i>req</i>对象的<i>note</i>属性中。减少了一小部分复制粘贴，我们很满意！

<!-- The current code for the application is in its entirety on [GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-2), branch <i>part13-2</i>.-->
当前应用的代码完整地放在[GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-2)上，分支是<i>part13-2</i>。

</div>

<div class="tasks">

### Tasks 13.5.-13.7.

#### Task 13.5.

<!-- Change the structure of your application to match the example above, or to follow some other similar clear convention.-->
按照上面的示例或者其他类似的清晰的约定，改变你的应用程序的结构。

#### Task 13.6.

<!-- Also, implement support for changing the number of a blog's likes in the application, i.e. the operation-->
should be able to increment or decrement the number of likes

同时，在应用中实现对博客点赞数量的更改支持，即该操作应能够增加或减少点赞数量。

<!-- _PUT /api/blogs/:id_ (modifying the like count of a blog)-->
_PUT /api/blogs/:id_（修改博客的点赞数）

<!-- The updated number of likes will be relayed with the request:-->
更新的喜欢数将随请求一起传达：

```js
{
  likes: 3
}
```

#### Task 13.7.

<!-- Centralize the application error handling in middleware as in [part 3](/en/part3/saving_data_to_mongo_db#moving-error-handling-into-middleware). You can also enable middleware [express-async-errors](https://github.com/davidbanham/express-async-errors) as we did in [part 4](/en/part4/testing_the_backend#eliminating-the-try-catch).-->
在[第3章节](/en/part3/saving_data_to_mongo_db#moving-error-handling-into-middleware)中，将应用程序错误处理集中在中间件中。 您还可以启用中间件[express-async-errors](https://github.com/davidbanham/express-async-errors)，就像我们在[第4章节](/en/part4/testing_the_backend#eliminating-the-try-catch)中所做的一样。

<!-- The data returned in the context of an error message is not very important.-->
错误信息上返回的数据并不是很重要。

<!-- At this point, the situations that require error handling by the application are creating a new blog and changing the number of likes on a blog. Make sure the error handler handles both of these appropriately.-->
此时，应用程序需要处理的错误情况包括创建新博客和更改博客的点赞数。确保错误处理程序都能适当地处理这两种情况。

</div>

<div class="content">

### User management

<!-- Next, let's add a database table <i>users</i> to the application, where the users of the application will be stored. In addition, we will add the ability to create users and token-based login as we implemented in [part 4](/en/part4/token_authentication). For simplicity, we will adjust the implementation so that all users will have the same password <i>secret</i>.-->
接下来，我们给应用程序添加一个数据库表<i>users</i>，用来存储应用程序的用户。此外，我们还将添加创建用户和基于令牌的登录功能，就像我们在[第四章节](/en/part4/token_authentication)中实现的那样。为了简化实现，我们将调整实现，以便所有用户都具有相同的密码<i>secret</i>。

<!-- The model defining users in the file <i>models/user.js</i> is straightforward-->
模型定义在文件<i>models/user.js</i>中的用户很简单

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

<!-- The username field is set to unique. The username could have basically been used as the primary key of the table. However, we decided to create the primary key as a separate field with integer value <i>id</i>.-->
用户名字段被设置为唯一的。用户名本可以被用作表的主键。但是，我们决定将主键作为一个单独的字段，其值为<i>id</i>。

<!-- The file <i>models/index.js</i> expands slightly:-->
<i>模型/index.js</i>略有扩展：

```js
const Note = require('./note')
const User = require('./user') // highlight-line

Note.sync()
User.sync() // highlight-line

module.exports = {
  Note, User // highlight-line
}
```

<!-- The route handlers that take care of creating a new user in the <i>controllers/users.js</i> file and displaying all users do not contain anything dramatic-->
在 <i>controllers/users.js</i> 文件中负责创建新用户和显示所有用户的路由处理程序中没有任何戏剧性的东西。

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

<!-- The router handler that handles the login (file <i>controllers/login.js</i>) is as follows:-->
负责处理登录的路由处理器（文件 <i>controllers/login.js</i>）如下：

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

<!-- The POST request will be accompanied by a username and a password. First, the object corresponding to the username is retrieved from the database using the <i>User</i> model with the [findOne](https://sequelize.org/master/manual/model-querying-finders.html#-code-findone--code-) method:-->
POST 请求将伴随着用户名和密码。首先，使用 <i>User</i> 模型的 [findOne](https://sequelize.org/master/manual/model-querying-finders.html#-code-findone--code-) 方法从数据库中检索与用户名对应的对象：

```js
const user = await User.findOne({
  where: {
    username: body.username
  }
})
```

<!-- From the console, we can see that the SQL statement corresponds to the method call-->
从控制台我们可以看到，SQL 语句对应于方法调用

```sql
SELECT "id", "username", "name"
FROM "users" AS "User"
WHERE "User". "username" = 'mluukkai';
```

<!-- If the user is found and the password is correct (i.e. _secret_ for all the users), A <i>jsonwebtoken</i> containing the user's information is returned in the response. To do this, we install the dependency-->
<i>jsonwebtoken</i>

如果用户被发现，且密码正确（即所有用户的_secret_），在响应中会返回一个包含用户信息的<i>jsonwebtoken</i>。为此，我们安装了依赖<i>jsonwebtoken</i>。

```js
npm install jsonwebtoken
```

<!-- The file <i>index.js</i> expands slightly-->
文件<i>index.js</i>略微扩展

```js
const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

app.use(express.json())

app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
```

<!-- The current code for the application is in its entirety on [GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-3), branch <i>part13-3</i>.-->
当前应用的代码完整地存放在[GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-3)上，分支名为<i>part13-3</i>。

### Connection between the tables

<!-- Users can now be added to the application and users can log in, but this in itself this is not a very useful feature yet. We would like to add the features that only a logged-in user can add notes, and that each note is associated with the user who created it. To do this, we need to add a <i>foreign key</i> to the <i>notes</i> table.-->
现在用户可以被添加到应用程序中，用户可以登录，但这本身还不是一个非常有用的功能。我们想添加的功能是只有登录的用户才能添加笔记，并且每个笔记都与创建它的用户关联。为此，我们需要在<i>笔记</i>表中添加一个<i>外键</i>。

<!-- When using Sequelize, a foreign key can be defined by modifying the <i>models/index.js</i> file as follows-->
:

当使用Sequelize时，可以通过修改<i>models/index.js</i>文件来定义外键，如下所示：

```js
const Note = require('./note')
const User = require('./user')

// highlight-start
User.hasMany(Note)
Note.belongsTo(User)

Note.sync({ alter: true })
User.sync({ alter: true })
// highlight-end

module.exports = {
  Note, User
}
```

<!-- So this is how we [define](https://sequelize.org/master/manual/assocs.html#one-to-many-relationships) that there is a _one-to-many_ relationship connection between the <i>users</i> and <i>notes</i> entries. We also changed the options of the <i>sync</i> calls so that the tables in the database match changes made to the model definitions. The database schema looks like the following from the console:-->
所以，这就是我们如何[定义](https://sequelize.org/master/manual/assocs.html#one-to-many-relationships)<i>用户</i>和<i>笔记</i>条目之间存在_一对多_关系连接的方式。我们还更改了<i>sync</i>调用的选项，以使数据库中的表格与对模型定义所做的更改相匹配。从控制台看，数据库模式如下：

```js
postgres=# \d users
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

postgres=# \d notes
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
<i>notes</i> 表中已创建了外键 <i>user_id</i>，它指向 <i>users</i> 表的行。

<!-- Now let's make every insertion of a new note be associated to a user. Before we do the proper implementation (where we associate the note with the logged-in user's token), let's hard code the note to be attached to the first user found in the database:-->
现在让我们让每次新增笔记都与一个用户关联起来。在我们进行正确的实施（将笔记与登录用户的令牌关联）之前，让我们将笔记硬编码到数据库中的第一个用户：

```js

router.post('/', async (req, res) => {
  try {
    // highlight-start
    const user = await User.findOne()
    const note = await Note.create({...req.body, userId: user.id})
    // highlight-end
    res.json(note)
  } catch(error) {
    return res.status(400).json({ error })
  }
})
```

<!-- Pay attention to how there is now a <i>user\_id</i> column in the notes at the database level. The corresponding object in each database row is referred to by Sequelize's naming convention as opposed to camel case (<i>userId</i>) as typed in the source code.-->
注意，现在数据库层面的注释中有一个<i>user\_id</i>列。每个数据库行中相应的对象称为Sequelize的命名约定，而不是在源代码中输入的驼峰形式（<i>userId</i>）。

<!-- Making a join query is very easy. Let's change the route that returns all users so that each user's notes are also shown:-->
把两个表做一个联合查询非常简单。让我们改变返回所有用户的路由，使每个用户的笔记也能显示出来：

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

<!-- So the join query is done using the [include](https://sequelize.org/master/manual/assocs.html#eager-loading-example) option as a query parameter.-->
因此，使用[include](https://sequelize.org/master/manual/assocs.html#eager-loading-example)选项作为查询参数完成连接查询。

<!-- The SQL statement generated from the query is seen on the console:-->
查询生成的SQL语句可在控制台上看到：

```
SELECT "User". "id", "User". "username", "User". "name", "Notes". "id" AS "Notes.id", "Notes". "content" AS "Notes.content", "Notes". "important" AS "Notes.important", "Notes". "date" AS "Notes.date", "Notes". "user_id" AS "Notes.UserId"
FROM "users" AS "User" LEFT OUTER JOIN "notes" AS "Notes" ON "User". "id" = "Notes". "user_id";
```

<!-- The end result is also as you might expect-->
最终结果也就像你预料的一样。

![](../../images/13/1.png)

### Proper insertion of notes

<!-- Let's change the note insertion by making it work the same as in [part 4](/en/part4), i.e. the creation of a note can only be successful if the request corresponding to the creation is accompanied by a valid token from login. The note is then stored in the list of notes created by the user identified by the token:-->
让我们改变笔记插入，使其与[第4章节](/en/part4)相同，即创建笔记只有在相应的请求伴随有一个有效的登录令牌时才能成功。然后，该笔记将存储在由令牌标识的用户创建的笔记列表中：

```js
// highlight-start
const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch{
      return res.status(401).json({ error: 'token invalid' })
    }
  }  else {
    return res.status(401).json({ error: 'token missing' })
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

<!-- The token is retrieved from the request headers, decoded and placed in the <i>req</i> object by the <i>tokenExtractor</i> middleware. When creating a note, a <i>date</i> field is also given indicating the time it was created.-->
令牌由请求头获取，由<i>tokenExtractor</i>中间件解码并放入<i>req</i>对象中。创建笔记时，还有一个<i>date</i>字段，表示它的创建时间。

### Fine-tuning

<!-- Our backend currently works almost the same way as the Part 4 version of the same application, except for error handling. Before we make a few extensions to backend, let's change the routes for retrieving all notes and all users slightly.-->
我们的后端目前的工作方式几乎与同一应用程序的第4章节版本相同，除了错误处理。在我们对后端做一些扩展之前，让我们稍微改变一下检索所有笔记和所有用户的路由。

<!-- We will add to each note information about the user who added it:-->
我们将为每个笔记添加有关添加它的用户的信息：

```js
router.get('/', async (req, res) => {
  const notes = await Note.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    }
  })
  res.json(notes)
})
```

<!-- We have also [restricted](https://sequelize.org/master/manual/model-querying-basics.html#specifying-attributes-for-select-queries) the values of which fields we want. For each note, we return all fields including the <i>name</i> of the user associated with the note but excluding the <i>userId</i>.-->
我们也限制了我们想要的字段的值。对于每个笔记，我们返回所有字段，包括与笔记关联的用户的<i>名称</i>，但排除<i>userId</i>。

<!-- Let's make a similar change to the route that retrieves all users, removing the unnecessary field <i>userId</i> from the notes associated with the user:-->
让我们对检索所有用户的路由做出类似的改变，从用户相关的笔记中删除不必要的字段<i>userId</i>：

```js
router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Note,
      attributes: { exclude: ['userId'] } // highlight-line
    }
  })
  res.json(users)
})
```

<!-- The current code for the application is in its entirety on [GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-4), branch <i>part13-4</i>.-->
当前应用程序的代码完整地放在[GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-4)上，分支为<i>part13-4</i>。

### Attention to the definition of the models

<!-- The most perceptive will have noticed that despite the added column <i>user_id</i>, we did not make a change to the model that defines notes, but we can still add a user to note objects:-->
最敏锐的人会注意到，尽管增加了<i>user_id</i>列，但我们并没有对定义笔记的模型做出改变，但我们仍然可以为笔记对象添加用户：

```js
const user = await User.findByPk(req.decodedToken.id)
const note = await Note.create({ ...req.body, userId: user.id, date: new Date() })
```

<!-- The reason for this is that we specified in the file <i>models/index.js</i> that there is a one-to-many connection between users and notes:-->
原因是我们在文件<i>models/index.js</i>中指定用户与笔记之间有一对多关系：

```js
const Note = require('./note')
const User = require('./user')

User.hasMany(Note)
Note.belongsTo(User)

// ...
```

<!-- Sequelize will automatically create an attribute called <i>userId</i> on the <i>Note</i> model to which, when referenced gives access to the database column <i>user_id</i>.-->
Sequelize 将会自动在 <i>Note</i> 模型上创建一个名为 <i>userId</i> 的属性，当引用时将访问数据库列 <i>user_id</i>。

<!-- Keep in mind, that we could also create a note as follows using the [build](https://sequelize.org/master/class/lib/model.js~Model.html#static-method-build) method:-->
记住，我们也可以使用[build](https://sequelize.org/master/class/lib/model.js~Model.html#static-method-build)方法创建一个如下所示的注意事项：

```js
const user = await User.findByPk(req.decodedToken.id)

// create a note without saving it yet
const note = Note.build({ ...req.body, date: new Date() })
 // put the user id in the userId property of the created note
note.userId = user.id
// store the note object in the database
await note.save()
```

<!-- This is how we explicitly see that <i>userId</i> is an attribute of the notes object.-->
这就是我们明确地看到<i>userId</i>是notes对象的一个属性。

<!-- We could define the model as follows to get the same result:-->
我们可以按照下面的方式定义模型以获得相同的结果：

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

<!-- Defining at the class level of the model as above is usually unnecessary-->
在模型的类级别上定义如上通常是不必要的。

```js
User.hasMany(Note)
Note.belongsTo(User)
```

<!-- Instead we can achieve the same with this. Using one of the two methods is necessary otherwise Sequelize does not know how at the code level to connect the tables to each other.-->
另外，我们可以使用这种方法实现同样的目的。必须使用其中一种方法，否则Sequelize在代码层面就不知道如何将表连接在一起。

</div>

<div class="tasks">

### Tasks 13.8.-13.12.

#### Task 13.8.

<!-- Add support for users to the application. In addition to ID, users have the following fields:-->
增加对用户的支持到应用中。除了ID之外，用户还有以下字段：

<!-- - name (string, must not be empty)-->
姓名（字符串，不能为空）
<!-- - username (string, must not be empty)-->
用户名（字符串，不能为空）

<!-- Unlike in the material, do not prevent Sequelize from creating [timestamps](https://sequelize.org/master/manual/model-basics.html#timestamps) <i>created\_at</i> and <i>updated\_at</i> for users-->
不像在材料中一样，不要阻止Sequelize为用户创建[timestamps](https://sequelize.org/master/manual/model-basics.html#timestamps) <i>created\_at</i> 和 <i>updated\_at</i>。

<!-- All users can have the same password as the material. You can also choose to properly implement passwords as in [part 4](/en/part4/user_administration).-->
所有用户都可以有相同的密码作为材料。您也可以选择按照[第4章节](/en/part4/user_administration)正确实施密码。

<!-- Implement the following routes-->
实施以下路线

<!-- - _POST api/users_ (adding a new user)-->
`POST api/users`（添加新用户）
<!-- - _GET api/users_ (listing all users)-->
- `GET api/users`（列出所有用户）
<!-- - _PUT api/users/:username_ (changing a username, keep in mind that the parameter is not id but username)-->
PUT api/users/:username

<!-- Make sure that the timestamps <i>created\_at</i> and <i>updated\_at</i> automatically set by Sequelize work correctly when creating a new user and changing a username.-->
确保Sequelize自动设置的时间戳<i>created\_at</i>和<i>updated\_at</i>在创建新用户和更改用户名时正确工作。

#### Exercise 13.9.

<!-- Sequelize provides a set of pre-defined [validations](https://sequelize.org/master/manual/validations-and-constraints.html) for the model fields, which it performs before storing the objects in the database.-->
Sequelize 提供了一组预定义的[验证](https://sequelize.org/master/manual/validations-and-constraints.html)，用于模型字段，它在将对象存储到数据库中之前执行这些验证。

<!-- It's decided to change the user creation policy so that only a valid email address is valid as a username. Implement validation that verifies this issue during the creation of a user.-->
决定更改用户创建策略，以便只有有效的电子邮件地址才能作为用户名有效。 在创建用户时实施验证以验证此问题。

<!-- Modify the error handling middleware to provide a more descriptive error message of the situation (for example, using the Sequelize error message), e.g.-->
修改错误处理中间件以提供更加描述性的错误消息（例如，使用Sequelize错误消息），例如：

```js
{
    "error": [
        "Validation isEmail on username failed"
    ]
}
```

#### Exercise 13.10.

<!-- Expand the application so that the current logged-in user identified by a token is linked to each blog added. To do this you will also need to implement a login endpoint _POST /api/login_, which returns the token.-->
扩展应用程序，使当前登录用户由令牌标识连接到每个添加的博客。为此，您还需要实现登录端点_POST / api/login_，该端点返回令牌。

#### Exercise 13.11.

<!-- Make deletion of a blog only possible for the user who added the blog.-->
只有添加博客的用户才能够进行博客删除。

#### Task 13.12.

<!-- Modify the routes for retrieving all blogs and all users so that each blog shows the user who added it and each user shows the blogs they have added.-->
修改用于检索所有博客和所有用户的路由，以便每个博客显示添加它的用户，每个用户显示它们添加的博客。

</div>

<div class="content">

### More queries

<!-- So far our application has been very simple in terms of queries, queries have searched for either a single row based on the primary key using the method [findByPk](https://sequelize.org/master/class/lib/model.js~Model.html#static-method-findByPk) or they have searched for all rows in the table using the method [findAll](https://sequelize.org/master/class/lib/model.js~Model.html#static-method-findAll). These are sufficient for the frontend of the application made in Section 5, but let's expand the backend so that we can also practice making slightly more complex queries.-->
到目前为止，我们的应用程序在查询方面非常简单，查询可以使用[findByPk](https://sequelize.org/master/class/lib/model.js~Model.html#static-method-findByPk)方法根据主键搜索单个行，或者使用[findAll](https://sequelize.org/master/class/lib/model.js~Model.html#static-method-findAll)方法搜索表中的所有行。 这些对于第5节中制作的前端应用程序来说足够了，但让我们扩展后端，以便我们也可以练习制作稍微复杂一点的查询。

<!-- Let's first implement the possibility to retrieve only important or non-important notes. Let's implement this using the [query-parameter](http://expressjs.com/en/5x/api.html#req.query) important:-->
让我们首先实现只检索重要或非重要笔记的可能性。让我们使用[query-parameter](http://expressjs.com/en/5x/api.html#req.query)重要实现这一点：

```js
router.get('/', async (req, res) => {
  const notes = await Note.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
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

<!-- Now the backend can retrieve important notes with a request to http://localhost:3001/api/notes?important=true and non-important notes with a request to http://localhost:3001/api/notes?important=false-->
现在，后端可以通过请求 `http://localhost:3001/api/notes?important=true` 来检索重要笔记，通过请求 `http://localhost:3001/api/notes?important=false` 来检索非重要笔记。

<!-- The SQL query generated by Sequelize contains a WHERE clause that filters rows that would normally be returned:-->
Sequelize 生成的 SQL 查询中包含一个 WHERE 子句，用于过滤通常会返回的行：

```sql
SELECT "note". "id", "note". "content", "note". "important", "note". "date", "user". "id" AS "user.id", "user". "name" AS "user.name"
FROM "notes" AS "note" LEFT OUTER JOIN "users" AS "user" ON "note". "user_id" = "user". "id"
WHERE "note". "important" = true;
```

<!-- Unfortunately, this implementation will not work if the request is not interested in whether the note is important or not, i.e. if the request is made to http://localhost:3001/api/notes. The correction can be done in several ways. One, but perhaps not the best way to do the correction would be as follows:-->
不幸的是，如果请求不关心笔记是否重要，即如果请求发送到http://localhost:3001/api/notes，此实现将不起作用。可以以几种方式进行纠正。一种，但也许不是最佳方式，可以如下所示：

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
      model: User,
      attributes: ['name']
    },
    where: {
      important // highlight-line
    }
  })
  res.json(notes)
})
```

<!-- The <i>important</i> object now stores the query condition. The default query is-->
<b>all</b>

<i>重要</i> 物件现在储存查询条件。预设查询是 <b>全部</b>

```js
where: {
  important: {
    [Op.in]: [true, false]
  }
}
```

<!-- i.e. the <i>important</i> column can be <i>true</i> or <i>false</i>, using one of the many Sequelize operators [Op.in](https://sequelize.org/master/manual/model-querying-basics.html#operators). If the query parameter <i>req.query.important</i> is specified, the query changes to one of the two forms-->
:

<i>重要</i>列可以是<i>真</i>或<i>假</i>，使用Sequelize的许多操作符之一[Op.in]（https://sequelize.org/master/manual/model-querying-basics.html#operators）。如果指定了查询参数<i>req.query.important</i>，则查询将更改为两种形式之一：

```js
where: {
  important: true
}
```

<!-- or-->
**英文：**

This is an exciting opportunity!

**中文：**

这是一个令人兴奋的机会！

```js
where: {
  important: false
}
```

<!-- depending on the value of the query parameter.-->
根据查询参数的值。

<!-- The database might now contain some note rows that do not have the value for the column-->
数据库可能现在包含一些没有为该列赋值的记录行。
<i>important</i> set. After the above changes, these notes can not be found with the queries. Let us set the missing values in the psql console and change the schema so that the column does not allow a null value:

```js
Note.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    important: {
      type: DataTypes.BOOLEAN,
      allowNull: false, // highlight-line
    },
    date: {
      type: DataTypes.DATE,
    },
  },
  // ...
)
```

<!-- The functionality can be further expanded by allowing the user to specify a required keyword when retrieving notes, e.g. a request to http://localhost:3001/api/notes?search=database will return all notes mentioning <i>database</i> or a request to http://localhost:3001/api/notes?search=javascript&important=true will return all notes marked as important and mentioning <i>javascript</i>. The implementation is as follows-->
:

功能可以通过允许用户在检索笔记时指定必要的关键字来进一步扩展，例如，对`http：//localhost：3001/api/notes？search = database`的请求将返回所有提及<i>database</i>的笔记，或者对`http：//localhost：3001/api/notes？search = javascript＆important = true`的请求将返回所有标记为重要且提及<i>javascript</i>的笔记。实现如下：

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
      model: User,
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

<!-- Sequelize's [Op.substring](https://sequelize.org/master/manual/model-querying-basics.html#operators) generates the query we want using the LIKE keyword in SQL. For example, if we make a query to http://localhost:3001/api/notes?search=database&important=true we will see that the SQL query it generates is exactly as we expect.-->
Sequelize 的 [Op.substring](https://sequelize.org/master/manual/model-querying-basics.html#operators) 使用 SQL 中的 LIKE 关键字生成我们想要的查询。例如，如果我们对 http://localhost:3001/api/notes?search=database&important=true 做一个查询，我们会发现生成的 SQL 查询正是我们所期望的。

```sql
SELECT "note". "id", "note". "content", "note". "important", "note". "date", "user". "id" AS "user.id", "user". "name" AS "user.name"
FROM "notes" AS "note" LEFT OUTER JOIN "users" AS "user" ON "note". "user_id" = "user". "id"
WHERE "note". "important" = true AND "note". "content" LIKE '%database%';
```

<!-- There is still a beautiful flaw in our application that we see if we make a request to http://localhost:3001/api/notes, i.e. we want all the notes, our implementation will cause an unnecessary WHERE in the query, which may (depending on the implementation of the database engine) unnecessarily affect the query efficiency:-->
我们的应用程序中仍然存在一个美丽的缺陷，即如果我们向http://localhost:3001/api/notes发出请求，即我们想要所有的笔记，我们的实现将导致查询中的不必要的WHERE，这可能（取决于数据库引擎的实现）会不必要地影响查询效率：

```sql
SELECT "note". "id", "note". "content", "note". "important", "note". "date", "user". "id" AS "user.id", "user". "name" AS "user.name"
FROM "notes" AS "note" LEFT OUTER JOIN "users" AS "user" ON "note". "user_id" = "user". "id"
WHERE "note". "important" IN (true, false) AND "note". "content" LIKE '%%';
```

<!-- Let's optimize the code so that the WHERE conditions are used only if necessary:-->
让我们优化代码，以便只有在必要时才使用WHERE条件：

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
      model: User,
      attributes: ['name']
    },
    where
  })

  res.json(notes)
})
```

<!-- If the request has search conditions e.g. http://localhost:3001/api/notes?search=database&important=true, a query containing WHERE is formed-->
如果请求有搜索条件，例如http://localhost:3001/api/notes?search=database&important=true，将会形成一个包含WHERE的查询。

```sql
SELECT "note". "id", "note". "content", "note". "important", "note". "date", "user". "id" AS "user.id", "user". "name" AS "user.name"
FROM "notes" AS "note" LEFT OUTER JOIN "users" AS "user" ON "note". "user_id" = "user". "id"
WHERE "note". "important" = true AND "note". "content" LIKE '%database%';
```

<!-- If the request has no search conditions http://localhost:3001/api/notes, then the query does not have an unnecessary WHERE-->
clause

如果请求没有搜索条件http://localhost:3001/api/notes，那么查询就不会有不必要的WHERE子句。

```sql
SELECT "note". "id", "note". "content", "note". "important", "note". "date", "user". "id" AS "user.id", "user". "name" AS "user.name"
FROM "notes" AS "note" LEFT OUTER JOIN "users" AS "user" ON "note". "user_id" = "user". "id";
```

<!-- The current code for the application is in its entirety on [GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-5), branch <i>part13-5</i>.-->
当前应用程序的代码完整地放在[GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-5)，分支<i>part13-5</i>上。

</div>

<div class="tasks">

### Tasks 13.13.-13.16

#### Task 13.13.

<!-- Implement filtering by keyword in the application for the route returning all blogs. The filtering should work as follows-->
:

在应用中实现关键字过滤，用于返回所有博客的路由。 过滤应按以下方式工作：
<!-- - _GET /api/blogs?search=react_ returns all blogs with the search word <i>react</i> in the <i>title</i> field, the search word is case-insensitive-->
GET /api/blogs?search=react 返回标题字段中带有搜索词<i>react</i>的所有博客，搜索词不区分大小写。
<!-- - _GET /api/blogs_ returns all blogs-->
GET /api/blogs 返回所有博客


<!-- [This](https://sequelize.org/master/manual/model-querying-basics.html#operators) should be useful for this task and the next one.-->
[这个](https://sequelize.org/master/manual/model-querying-basics.html#operators)应该对这个任务和下一个任务有用。
#### Exercise 13.14.

<!-- Expand the filter to search for a keyword in either the <i>title</i> or <i>author</i> fields, i.e.-->
search for a keyword in either the title or author

展开过滤器，以在<i>标题</i>或<i>作者</i>字段中搜索关键字，即在标题或作者中搜索关键字。

<!-- _GET /api/blogs?search=jami_ returns blogs with the search word <i>jami</i> in the <i>title</i> field or in the <i>author</i> field-->
.

_GET /api/blogs?search=jami_ 返回标题字段或作者字段中包含搜索词<i>jami</i>的博客。
#### Exercise 13.15.

<!-- Modify the blogs route so that it returns blogs based on likes in descending order. Search the [documentation](https://sequelize.org/master/manual/model-querying-basics.html) for instructions on ordering,-->
offset, and limit.

修改博客路由，以便按照降序返回博客。查看[文档](https://sequelize.org/master/manual/model-querying-basics.html)以获取关于排序、偏移和限制的说明。

#### Task 13.16.

<!-- Make a route for the application _/api/authors_ that returns the number of blogs for each author and the total number of likes. Implement the operation directly at the database level. You will most likely need the [group by](https://sequelize.org/master/manual/model-querying-basics.html#grouping) functionality, and the [sequelize.fn](https://sequelize.org/master/manual/model-querying-basics.html#specifying-attributes-for-select-queries) aggregator function.-->
为应用程序_/api/authors_创建一条路由，返回每个作者的博客数量和总点赞数。直接在数据库层面实现操作。您很可能需要[group by](https://sequelize.org/master/manual/model-querying-basics.html#grouping)功能和[sequelize.fn](https://sequelize.org/master/manual/model-querying-basics.html#specifying-attributes-for-select-queries)聚合函数。

<!-- The JSON returned by the route might look like the following, for example:-->
返回的JSON可能看起来像下面这样，例如：

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

<!-- Bonus task: order the data returned based on the number of likes, do the ordering in the database query.-->
在数据库查询中根据点赞数对数据进行排序。

</div>
