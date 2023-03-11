---
mainImage: ../../../images/part-13.svg
part: 13
letter: b
lang: zh
---

<div class="content">

### Application structuring

<!-- So far, we have written all the code in the same file. Now let's structure the application a little better. Let's create the following directory structure and files:-->
 到目前为止，我们已经在同一个文件中写了所有的代码。现在让我们把应用的结构设计得更好一些。让我们创建以下目录结构和文件。

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
 这些文件的内容如下。文件<i>util/config.js</i>负责处理环境变量。

```js
require('dotenv').config()

module.exports = {
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT || 3001,
}
```

<!-- The role of the file <i>index.js</i> is to configure and launch the application:-->
 文件<i>index.js</i>的作用是配置和启动应用。

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
 启动应用与我们之前看到的略有不同，因为我们要确保在实际启动前成功建立数据库连接。

<!-- The file <i>util/db.js</i> contains the code to initialize the database:-->
 文件<i>util/db.js</i>包含初始化数据库的代码。

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

<!-- The notes in the model corresponding to the table to be stored are saved in the file <i>models/note.js</i>-->
 与要存储的表相对应的模型中的注释被保存在文件<i>models/note.js</i>中。

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
 文件<i>models/index.js</i>在这一点上几乎是无用的，因为应用中只有一个模型。当我们开始向应用添加其他模型时，该文件将变得更加有用，因为它将消除在应用的其他部分导入定义单个模型的文件的需要。

```js
const Note = require('./note')

Note.sync()

module.exports = {
  Note
}
```

<!-- The route handling associated with notes can be found in the file <i>controllers/notes.js</i>:-->
 与笔记相关的路由处理可以在文件<i>controllers/notes.js</i>中找到。

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
 应用的结构现在很好。然而，我们注意到，处理单个笔记的路由处理程序包含了一些重复的代码，因为它们都是以搜索要处理的笔记的行开始的。

```js
const note = await Note.findByPk(req.params.id)
```

<!-- Let's refactor this into our own <i>middleware</i> and implement it in the route handlers:-->
 让我们把它重构为我们自己的<i>中间件</i>并在路由处理程序中实现它。

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
 路由处理程序现在接收<i>三个</i>参数，第一个是定义路由的字符串，第二个是我们之前定义的中间件<i>noteFinder</i>，它从数据库中检索笔记并把它放在<i>req</i>对象的<i>note</i>属性中。少量的复制粘贴被消除了，我们很满意!

<!-- The current code for the application is in its entirety on [GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-2), branch <i>part13-2</i>.-->
 该应用的当前代码全部在[GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-2)，分支<i>part13-2</i>。

</div>

<div class="tasks">

### Tasks 13.5.-13.7.

#### Task 13.5.

<!-- Change the structure of your application to match the example above, or to follow some other similar clear convention.-->
 改变你的应用的结构，以符合上面的例子，或遵循其他类似的明确约定。

#### Task 13.6.

<!-- Also, implement support for changing the number of a blog's likes in the application, i.e. the operation-->
 另外，在应用中实现对改变博客的喜欢数的支持，即，操作

<!-- _PUT /api/blogs/:id_ (modifying the like count of a blog)-->
 _PUT /api/blogs/:id_ (修改一个博客的喜欢数)

<!-- The updated number of likes will be relayed with the request:-->
 更新的喜欢数将与请求一起被转达。

```js
{
  likes: 3
}
```

#### Task 13.7.

<!-- Centralize the application error handling in middleware as in [part 3](/en/part3/saving_data_to_mongo_db#moving-error-handling-into-middleware). You can also enable middleware [express-async-errors](https://github.com/davidbanham/express-async-errors) as we did in [part 4](/en/part4/testing_the_backend#eliminating-the-try-catch).-->
 在中间件中集中处理应用的错误，如[第3章节](/en/part3/saving_data_to_mongo_db#moving-error-handling-into-middleware)。你也可以像我们在[第4章节](/en/part4/testing_the_backend#eliminating-the-try-catch)中那样，启用中间件[express-async-errors](https://github.com/davidbanham/express-async-errors)。

<!-- The data returned in the context of an error message is not very important.-->
在错误信息的上下文中返回的数据并不十分重要。

<!-- At this point, the situations that require error handling by the application are creating a new blog and changing the number of likes on a blog. Make sure the error handler handles both of these appropriately.-->
 在这一点上，需要应用处理错误的情况是创建一个新的博客和改变一个博客上的喜欢数。确保错误处理程序能适当地处理这两种情况。

</div>

<div class="content">

### User management

<!-- Next, let's add a database table <i>users</i> to the application, where the users of the application will be stored. In addition, we will add the ability to create users and token-based login as we implemented in [part 4](/en/part4/token_authentication). For simplicity, we will adjust the implementation so that all users will have the same password <i>secret</i>.-->
 接下来，让我们为应用添加一个数据库表<i>users</i>，应用的用户将被存储在这里。此外，我们将添加创建用户和基于令牌的登录的功能，正如我们在[第4章节](/en/part4/token_authentication)中实现的那样。为了简单起见，我们将调整实现，使所有用户都有相同的密码<i>secret</i>。

<!-- The model defining users in the file <i>models/user.js</i> is straightforward-->
 在文件<i>models/user.js</i>中定义用户的模型是很简单的

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
 用户名字段被设置为唯一。用户名基本上可以作为表的主键使用。然而，我们决定将主键创建为一个独立的字段，其值为整数<i>id</i>。

<!-- The file <i>models/index.js</i> expands slightly:-->
 文件<i>models/index.js</i>略有扩展。

```js
const Note = require('./note')
const User = require('./user') // highlight-line

User.sync() // highlight-line

module.exports = {
  Note, User // highlight-line
}
```

<!-- The route handlers that take care of creating a new user in the <i>controllers/users.js</i> file and displaying all users do not contain anything dramatic-->
负责在<i>controllers/users.js</i>文件中创建新用户并显示所有用户的路由处理程序并不包含任何戏剧性的内容。

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
 处理登录的路由处理程序（文件<i>controllers/login.js</i>）如下。

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
 POST请求将伴随着一个用户名和一个密码。首先，使用[findOne](https://sequelize.org/master/manual/model-querying-finders.html#-code-findone--code-)方法的<i>User</i>模型从数据库中获取与用户名对应的对象。

```js
const user = await User.findOne({
  where: {
    username: body.username
  }
})
```

<!-- From the console, we can see that the SQL statement corresponds to the method call-->
 从控制台，我们可以看到SQL语句与方法的调用相对应

```sql
SELECT "id", "username", "name"
FROM "users" AS "User"
WHERE "User". "username" = 'mluukkai';
```

<!-- If the user is found and the password is correct (i.e. _secret_ for all the users), A <i>jsonwebtoken</i> containing the user's information is returned in the response. To do this, we install the dependency-->
 如果找到了用户并且密码正确（即所有用户的_secret_），在响应中会返回一个包含用户信息的<i>jsonwebtoken</i>。要做到这一点，我们要安装以下依赖关系

```js
npm install jsonwebtoken
```

<!-- The file <i>index.js</i> expands slightly-->
 文件<i>index.js</i>略有扩展

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
 该应用的当前代码全部在[GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-3)，分支<i>part13-3</i>。

### Connection between the tables

<!-- Users can now be added to the application and users can log in, but this in itself this is not a very useful feature yet. We would like to add the features that only a logged-in user can add notes, and that each note is associated with the user who created it. To do this, we need to add a <i>foreign key</i> to the <i>notes</i> table.-->
 用户现在可以被添加到应用，用户可以登录，但这本身这还不是一个非常有用的功能。我们想增加这样的功能：只有登录的用户才能添加注释，而且每个注释都与创建它的用户相关联。要做到这一点，我们需要在<i>notes</i>表中添加一个<i>foreign key</i>。

<!-- When using Sequelize, a foreign key can be defined by modifying the <i>models/index.js</i> file as follows-->
 当使用Sequelize时，一个外键可以通过修改<i>models/index.js</i>文件来定义，如下所示

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
 所以这就是我们如何[定义](https://sequelize.org/master/manual/assocs.html#one-to-many-relationships)在<i>users</i>和<i>notes</i>条目之间存在一个_一对多_的关系连接。我们还改变了<i>sync</i>调用的选项，以便数据库中的表与模型定义的变化相匹配。从控制台看，数据库模式如下。

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
 外键<i>user_id</i>已经在<i>notes</i>表中创建，它指向<i>users</i>表中的行。

<!-- Now let's make every insertion of a new note be associated to a user. Before we do the proper implementation (where we associate the note with the logged-in user's token), let's hard code the note to be attached to the first user found in the database:-->
 现在让我们把每个插入的新笔记都与一个用户相关联。在我们做适当的实现之前（我们将笔记与登录用户的token联系起来），让我们用硬编码将笔记附在数据库中找到的第一个用户身上。

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
 注意现在在数据库级别的笔记中如何有一个<i>user\_id</i>列。每个数据库行中的相应对象是通过Sequelize's的命名惯例来提及的，而不是源代码中输入的骆驼字母（<i>userId</i>）。

<!-- Making a join query is very easy. Let's change the route that returns all users so that each user's notes are also shown:-->
 制作一个连接查询是非常容易的。让我们改变返回所有用户的路径，以便每个用户的注释也被显示出来。

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
 所以连接查询是使用[include](https://sequelize.org/master/manual/assocs.html#eager-loading-example)选项作为查询参数完成的。

<!-- The SQL statement generated from the query is seen on the console:-->
 从查询产生的SQL语句在控制台中可以看到。

```
SELECT "User". "id", "User". "username", "User". "name", "Notes". "id" AS "Notes.id", "Notes". "content" AS "Notes.content", "Notes". "important" AS "Notes.important", "Notes". "date" AS "Notes.date", "Notes". "user_id" AS "Notes.UserId"
FROM "users" AS "User" LEFT OUTER JOIN "notes" AS "Notes" ON "User". "id" = "Notes". "user_id";
```

<!-- The end result is also as you might expect-->
 最终结果也如你所料

![](../../images/13/1.png)

### Proper insertion of notes

<!-- Let's change the note insertion by making it work the same as in [part 4](/en/part4), i.e. the creation of a note can only be successful if the request corresponding to the creation is accompanied by a valid token from login. The note is then stored in the list of notes created by the user identified by the token:-->
 让我们改变笔记的插入，使其与[第4章节](/en/part4)中的工作相同，即只有当与创建相对应的请求伴随着来自登录的有效令牌时，笔记的创建才能成功。然后，该笔记被存储在由令牌识别的用户创建的笔记列表中。

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
  }  else {
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

<!-- The token is retrieved from the request headers, decoded and placed in the <i>req</i> object by the <i>tokenExtractor</i> middleware. When creating a note, a <i>date</i> field is also given indicating the time it was created.-->
 令牌从请求头信息中获取，经过解码并由<i>tokenExtractor</i>中间件放入<i>req</i>对象。当创建一个注释时，也会给出一个<i>date</i>字段，表明它的创建时间。

### Fine-tuning

<!-- Our backend currently works almost the same way as the Part 4 version of the same application, except for error handling. Before we make a few extensions to backend, let's change the routes for retrieving all notes and all users slightly.-->
 我们的后端目前的工作方式与同一应用的第四章节版本几乎相同，除了错误处理。在我们对后端进行一些扩展之前，让我们稍微改变一下检索所有笔记和所有用户的路线。

<!-- We will add to each note information about the user who added it:-->
 我们将在每个笔记中添加关于添加它的用户的信息。

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
 我们还[限制](https://sequelize.org/master/manual/model-querying-basics.html#specifying-attributes-for-select-queries)了我们想要的字段的值。对于每个笔记，我们返回所有的字段，包括与该笔记相关的用户的<i>名字</i>，但不包括<i>userId</i>。

<!-- Let's make a similar change to the route that retrieves all users, removing the unnecessary field <i>userId</i> from the notes associated with the user:-->
 让我们对检索所有用户的路由做一个类似的改变，从与用户相关的笔记中删除不必要的字段<i>userId</i>。

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
 该应用的当前代码全部在[GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-4)，分支<i>part13-4</i>。

### Attention to the definition of the models

<!-- The most perceptive will have noticed that despite the added column <i>user_id</i>, we did not make a change to the model that defines notes, but we can still add a user to note objects:-->
 最敏锐的人会注意到，尽管增加了<i>user_id</i>列，我们并没有对定义笔记的模型进行修改，但我们仍然可以在笔记对象中添加用户。

```js
const user = await User.findByPk(req.decodedToken.id)
const note = await Note.create({ ...req.body, userId: user.id, date: new Date() })
```

<!-- The reason for this is that we specified in the file <i>models/index.js</i> that there is a one-to-many connection between users and notes:-->
 原因是我们在文件<i>models/index.js</i>中具体说明了用户和笔记之间存在一对多的联系。

```js
const Note = require('./note')
const User = require('./user')

User.hasMany(Note)
Note.belongsTo(User)

// ...
```

<!-- Sequelize will automatically create an attribute called <i>userId</i> on the <i>Note</i> model to which, when referenced gives access to the database column <i>user_id</i>.-->
 Sequelize将自动在<i>Note</i>模型上创建一个名为<i>userId</i>的属性，当被引用时，可以访问数据库的<i>user_id</i>列。

<!-- Keep in mind, that we could also create a note as follows using the [build](https://sequelize.org/master/class/lib/model.js~Model.html#static-method-build) method:-->
 请记住，我们也可以使用[build](https://sequelize.org/master/class/lib/model.js~Model.html#static-method-build)方法创建一个笔记，如下所示。

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
 这就是我们明确看到<i>userId</i>是笔记对象的一个属性。

<!-- We could define the model as follows to get the same result:-->
 我们可以按以下方式定义模型，以得到同样的结果。

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
 像上面那样在模型的类层次上进行定义通常是不必要的

```js
User.hasMany(Note)
Note.belongsTo(User)
```

<!-- Instead we can achieve the same with this. Using one of the two methods is necessary otherwise Sequelize does not know how at the code level to connect the tables to each other.-->
相反，我们可以用这个方法来实现同样的效果。使用这两种方法中的一种是必要的，否则Sequelize不知道如何在代码级别上将表相互连接。

</div>

<div class="tasks">

### Tasks 13.8.-13.11.

#### Task 13.8.

<!-- Add support for users to the application. In addition to ID, users have the following fields:-->
 在应用中添加对用户的支持。除了ID之外，用户还有以下字段。

<!-- - name (string, must not be empty)-->
 - 名称（字符串，不能为空）
<!-- - username (string, must not be empty)-->
 - 用户名(字符串，不能为空)

<!-- Unlike in the material, do not now prevent Sequelize from creating [timestamps](https://sequelize.org/master/manual/model-basics.html#timestamps) <i>created\_at</i> and <i>updated\_at</i> for users-->
 与材料中不同，现在不要阻止Sequelize为用户创建[时间戳](https://sequelize.org/master/manual/model-basics.html#timestamps) <i>created/at</i>和<i>updated/at</i>。

<!-- All users can have the same password as the material. You can also choose to properly implement passwords as in [part 4](/en/part4/user_administration).-->
所有用户都可以拥有与材料相同的密码。你也可以选择像[第4章节](/en/part4/user_administration)那样正确实现密码。

<!-- Implement the following routes-->
 实现以下路线

<!-- - _POST api/users_ (adding a new user)-->
 - _POST api/users_ (添加一个新的用户)
<!-- - _GET api/users_ (listing all users)-->
 - _GET api/users_ (列出所有用户)
<!-- - _PUT api/users/:username_ (changing a username, keep in mind that the parameter is not id but username)-->
 - _PUT api/users/:username_ (改变一个用户名，记住参数不是id而是用户名)

<!-- Make sure that the timestamps <i>created\_at</i> and <i>updated\_at</i> automatically set by Sequelize work correctly when creating a new user and changing a username.-->
 确保在创建新用户和更改用户名时，Sequelize自动设置的时间戳<i>created\_at</i>和<i>updated\_at</i>能正确工作。

#### Exercise 13.9.

<!-- Sequelize provides a set of pre-defined [validations](https://sequelize.org/master/manual/validations-and-constraints.html) for the model fields, which it performs before storing the objects in the database.-->
 Sequelize为模型字段提供了一组预定义的[验证](https://sequelize.org/master/manual/validations-and-constraints.html)，它在将对象存储到数据库之前执行了这些验证。

<!-- It's decided to change the user creation policy so that only a valid email address is valid as a username. Implement validation that verifies this issue during the creation of a user.-->
我们决定改变用户创建策略，以便只有有效的电子邮件地址才能作为用户名有效。实施验证，在创建用户的过程中验证这个问题。

<!-- Modify the error handling middleware to provide a more descriptive error message of the situation (for example, using the Sequelize error message), e.g.-->
 修改错误处理中间件，以提供一个更具描述性的错误信息的情况（例如，使用Sequelize错误信息），例如。

```js
{
    "error": [
        "Validation isEmail on username failed"
    ]
}
```

#### Exercise 13.10.

<!-- Expand the application so that the current logged-in user identified by a token is linked to each blog added. To do this you will also need to implement a login endpoint _POST /api/login_, which returns the token.-->
 扩展应用，以便将由令牌识别的当前登录用户与每个添加的博客相联系。要做到这一点，你还需要实现一个登录端点_POST /api/login_，它返回令牌。

#### Exercise 13.11.

<!-- Make deletion of a blog only possible for the user who added the blog.-->
 让删除博客只对添加博客的用户有效。

#### Task 13.12.

<!-- Modify the routes for retrieving all blogs and all users so that each blog shows the user who added it and each user shows the blogs they have added.-->
 修改检索所有博客和所有用户的路由，使每个博客显示添加它的用户，每个用户显示他们所添加的博客。

</div>

<div class="content">

### More queries

<!-- So far our application has been very simple in terms of queries, queries have searched for either a single row based on the primary key using the method [findByPk](https://sequelize.org/master/class/lib/model.js~Model.html#static-method-findByPk) or they have searched for all rows in the table using the method [findAll](https://sequelize.org/master/class/lib/model.js~Model.html#static-method-findAll). These are sufficient for the frontend of the application made in Section 5, but let's expand the backend so that we can also practice making slightly more complex queries.-->
 到目前为止，我们的应用在查询方面非常简单，查询要么使用[findByPk](https://sequelize.org/master/class/lib/model.js~Model.html#static-method-findByPk)方法根据主键搜索单行，要么使用[findAll](https://sequelize.org/master/class/lib/model.js~Model.html#static-method-findAll)方法搜索表中的所有行。这些对于第5节中的应用的前端来说已经足够了，但是让我们扩展后端，这样我们也可以练习做稍微复杂的查询。

<!-- Let's first implement the possibility to retrieve only important or non-important notes. Let's implement this using the [query-parameter](http://expressjs.com/en/5x/api.html#req.query) important:-->
 我们首先来实现只检索重要或不重要的笔记的可能性。让我们用[查询参数](http://expressjs.com/en/5x/api.html#req.query) important来实现。

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

<!-- Now the backend can retrieve important notes with a request to http://localhost:3001/api/notes?important=true and non-important notes with a request to http://localhost:3001/api/notes?important=false-->
 现在后端可以通过请求http://localhost:3001/api/notes?important=true 来检索重要的笔记，通过请求http://localhost:3001/api/notes?important=false 来检索非重要的笔记。

<!-- The SQL query generated by Sequelize contains a WHERE clause that filters rows that would normally be returned:-->
 由Sequelize生成的SQL查询包含一个WHERE子句，过滤通常会被返回的记录。

```sql
SELECT "note". "id", "note". "content", "note". "important", "note". "date", "user". "id" AS "user.id", "user". "name" AS "user.name"
FROM "notes" AS "note" LEFT OUTER JOIN "users" AS "user" ON "note". "user_id" = "user". "id"
WHERE "note". "important" = true;
```

<!-- Unfortunately, this implementation will not work if the request is not interested in whether the note is important or not, i.e. if the request is made to http://localhost:3001/api/notes. The correction can be done in several ways. One, but perhaps not the best way to do the correction would be as follows:-->
 不幸的是，如果请求对笔记是否重要不感兴趣，也就是说，如果请求是向http://localhost:3001/api/notes，那么这个实现将无法工作。更正可以通过几种方式进行。其中一种，但也许不是最好的方式，修正的方式如下。

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

<!-- The <i>important</i> object now stores the query condition. The default query is-->
 <i>重要</i>对象现在存储了查询条件。默认的查询条件是

```js
where: {
  important: {
    [Op.in]: [true, false]
  }
}
```

<!-- i.e. the <i>important</i> column can be <i>true</i> or <i>false</i>, using one of the many Sequelize operators [Op.in](https://sequelize.org/master/manual/model-querying-basics.html#operators). If the query parameter <i>req.query.important</i> is specified, the query changes to one of the two forms-->
 即<i>important</i>列可以是<i>true</i>或<i>false</i>，使用许多Sequelize操作符之一[Op.in](https://sequelize.org/master/manual/model-querying-basics.html#operators)。如果指定了查询参数<i>req.query.important</i>，则查询会变成两种形式之一

```js
where: {
  important: true
}
```

<!-- or-->
 或

```js
where: {
  important: false
}
```

<!-- depending on the value of the query parameter.-->
取决于查询参数的值。

<!-- The functionality can be further expanded by allowing the user to specify a required keyword when retrieving notes, e.g. a request to http://localhost:3001/api/notes?search=database will return all notes mentioning <i>database</i> or a request to http://localhost:3001/api/notes?search=javascript&important=true will return all notes marked as important and mentioning <i>javascript</i>. The implementation is as follows-->
 该功能可以进一步扩展，允许用户在检索笔记时指定一个必要的关键词，例如，对http://localhost:3001/api/notes?search=database 的请求将返回所有提到<i>database</i>的笔记，或者对http://localhost:3001/api/notes?search=javascript&important=true 的请求将返回所有标记为重要的笔记并提到<i>javascript</i>。实现方法如下

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

<!-- Sequelize's [Op.substring](https://sequelize.org/master/manual/model-querying-basics.html#operators) generates the query we want using the LIKE keyword in SQL. For example, if we make a query to http://localhost:3001/api/notes?search=database&important=true we will see that the SQL query it generates is exactly as we expect.-->
 Sequelize's [Op.substring](https://sequelize.org/master/manual/model-querying-basics.html#operators) 使用SQL中的LIKE关键字生成我们想要的查询。例如，如果我们对http://localhost:3001/api/notes?search=database&important=true，我们会看到它生成的SQL查询与我们期望的完全一样。

```sql
SELECT "note". "id", "note". "content", "note". "important", "note". "date", "user". "id" AS "user.id", "user". "name" AS "user.name"
FROM "notes" AS "note" LEFT OUTER JOIN "users" AS "user" ON "note". "user_id" = "user". "id"
WHERE "note". "important" = true AND "note". "content" LIKE '%database%';
```

<!-- There is still a beautiful flaw in our application that we see if we make a request to http://localhost:3001/api/notes, i.e. we want all the notes, our implementation will cause an unnecessary WHERE in the query, which may (depending on the implementation of the database engine) unnecessarily affect the query efficiency:-->
 在我们的应用中仍然有一个美丽的缺陷，我们看到如果我们向 http://localhost:3001/api/notes 即我们想要所有的笔记，我们的实现将在查询中引起一个不必要的WHERE，这可能（取决于数据库引擎的实现）不必要地影响查询的效率。

```sql
SELECT "note". "id", "note". "content", "note". "important", "note". "date", "user". "id" AS "user.id", "user". "name" AS "user.name"
FROM "notes" AS "note" LEFT OUTER JOIN "users" AS "user" ON "note". "user_id" = "user". "id"
WHERE "note". "important" IN (true, false) AND "note". "content" LIKE '%%';
```

<!-- Let's optimize the code so that the WHERE conditions are used only if necessary:-->
 让我们优化代码，使WHERE条件只在必要时使用。

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

<!-- If the request has search conditions e.g. http://localhost:3001/api/notes?search=database&important=true, a query containing WHERE is formed-->
 如果请求有搜索条件，例如：http://localhost:3001/api/notes?search=database&important=true 就会形成一个包含WHERE的查询

```sql
SELECT "note". "id", "note". "content", "note". "important", "note". "date", "user". "id" AS "user.id", "user". "name" AS "user.name"
FROM "notes" AS "note" LEFT OUTER JOIN "users" AS "user" ON "note". "user_id" = "user". "id"
WHERE "note". "important" = true AND "note". "content" LIKE '%database%';
```

<!-- If the request has no search conditions http://localhost:3001/api/notes, then the query does not have an unnecessary WHERE-->
 如果请求没有搜索条件 http://localhost:3001/api/notes 那么查询就没有不必要的WHERE。

```sql
SELECT "note". "id", "note". "content", "note". "important", "note". "date", "user". "id" AS "user.id", "user". "name" AS "user.name"
FROM "notes" AS "note" LEFT OUTER JOIN "users" AS "user" ON "note". "user_id" = "user". "id";
```

<!-- The current code for the application is in its entirety on [GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-5), branch <i>part13-5</i>.-->
 当前应用的代码全部在[GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-5)，分支<i>part13-5</i>。

</div>

<div class="tasks">

### Tasks 13.13.-13.16

#### Task 13.13.

<!-- Implement filtering by keyword in the application for the route returning all blogs. The filtering should work as follows-->
 在应用中对返回所有博客的路径实施关键字过滤。过滤的工作方式如下
<!-- - _GET /api/blogs?search=react_ returns all blogs with the search word <i>react</i> in the <i>title</i> field, the search word is case-insensitive-->
 - _GET /api/blogs?search=react_ 返回所有在<i>title</i>区域有搜索词<i>react</i>的博客，搜索词不分大小写。
<!-- - _GET /api/blogs_ returns all blogs-->
 - _GET /api/blogs_返回所有博客


<!-- [This](https://sequelize.org/master/manual/model-querying-basics.html#operators) should be useful for this task and the next one.-->
 [这个](https://sequelize.org/master/manual/model-querying-basics.html#operators)应该对这个任务和下一个任务有用。
#### Exercise 13.14.

<!-- Expand the filter to search for a keyword in either the <i>title</i> or <i>author</i> fields, i.e.-->
 扩展过滤器以搜索<i>标题</i>或<i>作者</i>字段中的关键词，即

<!-- _GET /api/blogs?search=jami_ returns blogs with the search word <i>jami</i> in the <i>title</i> field or in the <i>author</i> field-->
 _GET /api/blogs?search=jami_ 返回在<i>title</i>字段或<i>author</i>字段中有搜索词<i>jami</i>的博客。
#### Exercise 13.15.

<!-- Modify the blogs route so that it returns blogs based on likes in descending order. Search the [documentation](https://sequelize.org/master/manual/model-querying-basics.html) for instructions on ordering,-->
 修改博客路径，使其根据喜欢程度按降序返回博客。在[文档](https://sequelize.org/master/manual/model-querying-basics.html)中搜索关于排序的说明。

#### Task 13.16.

<!-- Make a route for the application _/api/authors_ that returns the number of blogs for each author and the total number of likes. Implement the operation directly at the database level. You will most likely need the [group by](https://sequelize.org/master/manual/model-querying-basics.html#grouping) functionality, and the [sequelize.fn](https://sequelize.org/master/manual/model-querying-basics.html#specifying-attributes-for-select-queries) aggregator function.-->
 为应用_/api/authors_制作一个路由，返回每个作者的博客数量和喜欢的总数量。直接在数据库层面上实现这个操作。你很可能需要[group by](https://sequelize.org/master/manual/model-querying-basics.html#grouping)功能，以及[sequelize.fn](https://sequelize.org/master/manual/model-querying-basics.html#specifying-attributes-for-select-queries)聚合器函数。

<!-- The JSON returned by the route might look like the following, for example:-->
 路由返回的JSON可能如下所示：下面这样，例如。

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
 奖励任务：根据喜欢的数量对返回的数据进行排序，在数据库查询中进行排序。

</div>
