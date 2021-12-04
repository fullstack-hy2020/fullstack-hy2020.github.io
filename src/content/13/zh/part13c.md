---
mainImage: ../../../images/part-13.svg
part: 13
letter: c
lang: zh
---

<div class="content">

### Migrations

<!-- Let's keep expanding the backend. We want to implement support for allowing users with <i>admin status</i> to put users of their choice in inactive mode, preventing them from logging in and creating new notes. In order to implement these, we need to add a boolean value to the users' database table indicating whether the user is admin and whether the username is inactive. -->
让我们继续扩展后端。我们希望实现支持，允许用户与 <i>admin status</i>，把用户的选择在不活跃的模式，防止他们登录和创建新的note。为了实现这些，我们需要向用户数据库表添加一个布尔值，指示用户是否为 admin，用户名是否为 inactive。

<!-- We could proceed as before, i.e. change the model that defines the table and rely on Sequelize to synchronize the changes to the database. This is what causes the lines in the file <i>models/index.js</i> -->
我们可以像以前一样继续，即更改定义表的模型，并依靠 Sequelize 将更改同步到数据库。这就是文件 <i>models/index.js</i> 中的修改

```js
const Note = require('./note')
const User = require('./user')

Note.belongsTo(User)
User.hasMany(Note)

Note.sync({ alter: true }) // highlight-line
User.sync({ alter: true }) // highlight-line

module.exports = {
  Note, User
}
```

<!-- However, this approach does not make sense in the long run. Let's remove the lines that do the synchronization and move to using a much more robussive way, [migrations](https://sequelize.org/master/manual/migrations.html) provided by Sequelize (and many other libraries). -->
然而，从长远来看，这种方法是没有意义的。让我们移除执行同步的代码行，转而使用一种更加繁琐的方式—— Sequelize (以及许多其他库)提供的迁移 [migrations](https://sequelize.org/master/manual/migrations.html) 。

<!-- In practice, a migration is a single JavaScript file that describes some modification to a database. A separate migration file is created for each single or multiple changes at once. Sequelize keeps a record of which migrations have been performed, i.e. which change caused by the migrations is synchronized to the database schema. With the creation of new migrations, Sequelize keeps up to date on which changes to the database schema are yet to be made. In this way, changes are made in a controlled manner, with the program code stored in the version control. -->
实际上，迁移是一个描述对数据库进行某些修改的 JavaScript 文件。一次为每个单个或多个更改创建一个单独的迁移文件。Sequelize 记录哪些迁移已经执行，即迁移引起的哪些更改与数据库模式同步。随着新迁移的创建，Sequelize 将不断更新尚未对数据库模式进行更改的内容。通过这种方式，更改是以受控的方式进行的，程序代码存储在版本控制中。

<!-- First, a migration is created that takes the database to its current state. The code for the migration is as follows -->
首先，创建一个迁移，将数据库带到其当前状态。迁移的代码如下

```js
const { DataTypes } = require('sequelize')

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('notes', {
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
    })
    await queryInterface.createTable('users', {
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
    })
    await queryInterface.addColumn('notes', 'user_id', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    })
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('notes')
    await queryInterface.dropTable('users')
  },
}
```

<!-- The migration file [defines](https://sequelize.org/master/manual/migrations.html#migration-skeleton) functions <i>up</i> and <i>down</i>, the first of which defines how the database should be modified when the migration is performed. The function <i>down</i> again tells you how to cancel the migration if there is a need to do so. -->
迁移文件定义[defines](https://sequelize.org/master/manual/migrations.html#migration-skeleton) 上 <i>up</i>下<i>down</i>函数，其中第一个定义在执行迁移时应该如何修改数据库。<i>down</i>函数再次告诉您如果需要取消迁移，则如何取消迁移。

<!-- Our migration contains three operations, the first creates a table <i>notes</i>, the second creates a table <i>users</i> and the third adds a reference key to the table <i>notes</i> for the creator of the note. Changes in the schema are defined by calling the [queryInterface](https://sequelize.org/master/manual/query-interface.html) object methods. -->
我们的迁移包含三个操作，第一个创建一个表 <i>notes</i>，第二个创建一个表 <i>users</i>，第三个为 <i>notes</i>的创建者添加一个引用键。架构中的更改是通过调用  [queryInterface](https://sequelize.org/master/manual/query-interface.html) 对象方法定义的。

<!-- In defining migrations, it is essential to remember that unlike models, column and table names are written in snake case form: -->
在定义迁移时，必须记住与模型不同的是，列和表名是用snake模式写的:

```js
await queryInterface.addColumn('notes', 'user_id', { // highlight-line
  type: DataTypes.INTEGER,
  allowNull: false,
  references: { model: 'users', key: 'id' },
})
```

<!-- So in migrations, the names of the tables and columns are written exactly as they enter the database, while models use Sequelize's default camelCase name. -->
因此，在迁移中，表和列的名称完全按照它们进入数据库的方式编写，而模型使用 Sequelize 的默认 camelCase 名称。

<!-- Save the migration code in the file <i>migrations/20211209_00_initialize_notes_and_users.js</i>. Migration file names should be in alphabetical order so that the previous change is always ahead of a newer change in the alphabet. One good way to achieve this order is to start the migration file name with a data and a sequence number. -->
在文件  <i>migrations/20211209_00_initialize_notes_and_users.js</i> 中保存迁移代码。Js.迁移文件名应该在字母顺序中，这样以前的更改总是在字母表中新的更改之前。实现这个顺序的一个好方法是用数据和序列号启动迁移文件名。

<!-- We could run the migrations from the command line using the [Sequelize command line tool](https://github.com/sequelize/cli). However, we choose to perform the migrations manually from the program code using the [Umzug](https://github.com/sequelize/umzug) library. Let's install the library -->
我们可以使用 Sequelize 命令行工具 [Sequelize command line tool](https://github.com/sequelize/cli) 从命令行运行迁移。但是，我们选择使用  [Umzug](https://github.com/sequelize/umzug) 库从程序代码手动执行迁移。让我们安装依赖

```js
npm install umzug
```

<!-- Let's change the file <i>utils/db.js</i> that handles the connection to the database as follows: -->
让我们更改文件 <i>utils/db.js</i> 来处理到数据库的连接，如下所示:

```js
const Sequelize = require('sequelize')
const { DATABASE_URL } = require('./config')
const move = require('move') // highlight-line

const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});

// highlight-start
const runMigrations = async () => {
  const migrator = new move({
    storage: 'sequelize',
    storageOptions: {
      sequelize,
      tableName: 'migrations',
    },
    migrations: {
      params: [sequelize.getQueryInterface()],
      path: `${process.cwd()}/migrations`,
      pattern: /\.js$/,
    },
  })
  const migrations = await migrator.up()
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.file),
  })
}
// highlight-end

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    await runMigrations() // highlight-line
    console.log('database connected')
  } catch (err) {
    console.log('connecting database failed')
    console.log(err)
    return process.exit(1)
  }

  return null
}

module.exports = { connectToDatabase, sequelize }
```

<!-- The <i>runMigrations</i> function that performs migrations is now executed every time the application opens a database connection when it starts. Sequelize keeps track of which migrations have already been completed, so if there are no new migrations, running the <i>runMigrations</i> function does nothing. -->
现在，每当应用程序启动时打开一个数据库连接，就会执行执行迁移的 <i>runMigrations</i>  函数。Sequelize 跟踪哪些迁移已经完成，所以如果没有新的迁移， <i>runMigrations</i>  函数什么也不做。

<!-- Now let's start with a clean slate and remove all existing database tables from the application: -->
现在让我们从一张白纸开始，从应用程序中移除所有现有的数据库表:

```sql
username => drop table notes;
username => drop table users;
username => \d
Did not find any relations.
```

<!-- Let's start up the application. A message about migrations status is printed on the log -->
让我们启动应用程序。日志中会打印有关迁移状态的消息

```bash
INSERT INTO "migrations" ("name") VALUES ($1) RETURNING "name";
Migrations up to date { files: [ '20211209_00_initialize_notes_and_users.js' ] }
database connected
```

<!-- If we restart the application, the log also shows that the migration is not being performed. -->
如果我们重新启动应用程序，日志还会显示迁移没有执行。

<!-- The database schema of the application now looks like this -->
现在应用程序的数据库schema如下所示

```sql
username=> \d
                 List of relations
 Schema |     Name     |   Type   |     Owner
--------+--------------+----------+----------------
 public | migrations   | table    | username
 public | notes        | table    | username
 public | notes_id_seq | sequence | username
 public | users        | table    | username
 public | users_id_seq | sequence | username
```

<!-- So Sequelize has created a table <i>migrations</i> that allows it to keep track of the migrations that have been performed. The contents of the table look as follows: -->
因此 Sequelize 创建了一个表 <i>migrations</i>，允许它跟踪已执行的迁移。表格内容如下:

```js
username=> select * from migrations;
                   name
-------------------------------------------
 20211209_00_initialize_notes_and_users.js
```

<!-- Let's create a few users in the database, as well as a set of notes, and after that we are ready to expand the application. -->
让我们在数据库中创建一些用户，以及一组注释，然后我们准备扩展应用程序。

<!-- The current code for the application is in its entirety in [GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-6), branch <i>part13-6</i>. -->
应用程序的当前代码全部在  [GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-6)，分支 part13-6中。

### Admin user and user disabling

<!-- So we want to add two boolean fields to the <i>users</i> table -->
因此，我们要向 <i>users</i> 表添加两个布尔字段

- _admin_ tells you whether the user is admin
- _disabled_ again tells you whether the username is set to be banned

<!-- Let's create the migration that makes the database instance in the file <i>migrations/20211209_01_admin_and_disabled_to_users.js</i>: -->
让我们在文件 <i>migrations/20211209_01_admin_and_disabled_to_users.js</i> 中创建一个迁移，使数据库实例:

```js
const { DataTypes } = require('sequelize')

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.addColumn('users', 'admin', {
      type: DataTypes.BOOLEAN,
      default: false
    })
    await queryInterface.addColumn('users', 'disabled', {
      type: DataTypes.BOOLEAN,
      default: false
    })
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'admin')
    await queryInterface.removeColumn('users', 'disabled')
  },
}
```

<!-- Make corresponding changes to the model corresponding to the table <i>users</i>: -->
对 <i>users</i> 表的模型进行相应的更改:

```js
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
  // highlight-start
  admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  disabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  // highlight-end
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'user'
})
```

<!-- When a new migration is performed when code restarts, the schema is changed as desired: -->
当代码重新启动时执行新的迁移时，模式将按照需要进行更改:

```sql
username-> \d users
                                     Table "public.users"
  Column  |          Type          | Collation | Nullable |              Default
----------+------------------------+-----------+----------+-----------------------------------
 id       | integer                |           | not null | nextval('users_id_seq'::regclass)
 username | character varying(255) |           | not null |
 name     | character varying(255) |           | not null |
 admin    | boolean                |           |          |
 disabled | boolean                |           |          |
Indexes:
    "users_pkey" PRIMARY KEY, btree (id)
    "users_username_key" UNIQUE CONSTRAINT, btree (username)
Referenced by:
    TABLE "notes" CONSTRAINT "notes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id)
```

<!-- Now let's expand the controllers as follows. Prevent logging if the user field <i>disabled</i> is already set to <i>true</i>: -->
现在让我们按照下面的方式展开控制器。如果禁用 <i>disabled</i> 用户字段设置为  <i>true</i> ，则阻止日志记录:

```js
loginRouter.post('/', async (request, response) => {
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

// highlight-start
  if (user.disabled) {
    return response.status(401).json({
      error: 'account disabled, please contact admin'
    })
  }
  // highlight-end

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})
```

<!-- Let's disable the user's <i>jakousa</i> ID: -->
让我们禁用用户的  <i>jakousa</i> ID:

```sql
username => update users set disabled=true where id=3;
UPDATE 1
username => update users set admin=true where id=1;
UPDATE 1
username => select * from users;
 id | username |       name       | admin | disabled
----+----------+------------------+-------+----------
  2 | lynx     | Kalle Ilves      |       |
  3 | jakousa  | Jami Kousa       | f     | t
  1 | mluukkai | Matti Luukkainen | t     |
```

<!-- And make sure that the login is no longer successful -->
并确保登录不再成功

![](../../images/13/2.png)

<!-- Let's create a route that will allow admin to change the status of the user's account: -->
让我们创建一个路由，允许管理员改变用户帐户的状态:

```js
const isAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id)
  if (!user.admin) {
    return res.status(401).json({ error: 'operation not allowed' })
  }
  next()
}

router.put('/:username', tokenExtractor, isAdmin, async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username
    }
  })

  if (user) {
    user.disabled = req.body.disabled
    await user.save()
    res.json(user)
  } else {
    res.status(404).end()
  }
})
```

<!-- There are two middleware used, the first called <i>tokenExtractor</i> is the same as the one used by the note-generating route, i.e. it places the decoded token in the request-object field <i>decodedToken</i>. As the second middleware <i>isAdmin</i> checks whether the user is admin and if not, the request is set to 401 and an appropriate error message is returned. -->
使用了两个中间件，第一个名为  <i>tokenExtractor</i>  的中间件与生成note 的路由使用的中间件相同，即它将解码的令牌放置在请求对象字段  <i>decodedToken</i> 中。当第二个中间件  <i>isAdmin</i>  检查用户是否是 admin 时，请求被设置为401，并返回一个适当的错误消息。

<!-- Note how <i>two middlewares</i> is chained together to the router, both of which are executed before the actual route handler. It is possible to chain middleware to the connection of requests an arbitrary number. -->
请注意两个中间件是如何链接到路由器的，这两个中间件都是在实际路由处理程序之前执行的。将中间件链接到任意数量的请求连接是可能的。

<!-- The middleware <i>tokenExtractor</i> is now moved to <i>util/middleware.js</i> as it is used from multiple locations. -->
中间件 <i>tokenExtractor</i> 现在被移动到  <i>util/middleware.js</i> ，因为它是从多个位置使用的。

```js
const jwt = require('jsonwebtoken')
const { SECRET } = require('./config.js')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch{
      return res.status(401).json({ error: 'token invalid' })
    }
  } } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

module.exports = { tokenExtractor }
```

<!-- Admin can now enable the <i>jakousa</i> ID by making a PUT request to /api/users, where the request comes with the following data: -->
现在，管理员可以通过向  /api/users 发出 PUT 请求来启用  <i>jakousa</i>  ID，这个请求包含以下数据:

```js
{
    "disabled": false
}
```

<!-- As noted in [the end of Part 4](/part4/token_based_login#token-based_login_problems), the way we implement disabling usernames here is problematic. Whether or not the token is disabled is only checked at _login_, if the user is in possession of a token at the time the token is disabled, the user may continue to use the same token, since no lifetime has been set for the token and the fact that the user ID has been disabled is not checked when the notes are being created. -->
正如在第4部分末尾[the end of Part 4](/part4/token_based_login#token-based_login_problems),所指出的，我们在这里实现禁用用户名的方法是有问题的。只有在登录时才检查令牌是否被禁用，如果用户在禁用令牌时拥有令牌，则用户可以继续使用相同的令牌，因为没有为该令牌设置生存期，并且在创建备注时没有检查用户 ID 是否被禁用。

<!-- Before we proceed, let's make an npm script for the application, which allows us to cancel the previous migration. Not everything always goes right at the first time when developing migrations. -->
在继续之前，让我们为应用程序制作一个 npm 脚本，它允许我们取消以前的迁移。在开发迁移时，并不是所有事情在第一时间都是正确的。

<!-- Let's modify the file <i>util/db.js</i> as follows: -->
让我们修改文件 <i>util/db.js</i> 如下:

```js
const Sequelize = require('sequelize')
const { DATABASE_URL } = require('./config')
const move = require('move')

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
    await runMigrations()
    console.log('database connected')
  } catch (err) {
    console.log('connecting database failed')
    return process.exit(1)
  }

  return null
}

// highlight-start
const migrationConf = {
  storage: 'sequelize',
  storageOptions: {
    sequelize,
    tableName: 'migrations',
  },
  migrations: {
    params: [sequelize.getQueryInterface()],
    path: `${process.cwd()}/migrations`,
    pattern: /\.js$/,
  },
}

const runMigrations = async () => {
  const migrator = new migration(migrationConf)
  const migrations = await migrator.up()
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.file),
  })
}

const rollbackMigration = async () => {
  await sequelize.authenticate()
  const migrator = new move(migrationConf)
  await migrator.down()
}
// highlight-end

module.exports = { connectToDatabase, sequelize, rollbackMigrations } // highlight-line
```

<!-- Let's create a file <i>util/rollback.js</i>, which will allow the npm script to execute the specified migration rollback function: -->
让我们创建一个文件  <i>util/rollback.js</i> ，它允许 npm 脚本执行指定的迁移回滚函数:

```js
const { rollbackMigrations } = require('./db')

rollbackMigrations()
```

<!-- and the script itself: -->
还有script本身:

```json
{
    "scripts": {
    "dev": "nodemon index.js",
    "migration:down": "node util/rollback.js" // highlight-line
  },
}
```

<!-- So we can now undo the previous migration by running _npm run migration:down_ from the command line. -->
因此，我们现在可以通过从命令行运行 _npm run migration:down_ 来撤消以前的迁移。

<!-- Migrations are executed automatically when the program is started. In the development phase of the program, it might sometimes be more appropriate to disable the automatic execution of migrations and make migrations manually from the command line. -->
在程序启动时自动执行迁移。在程序的开发阶段，有时禁用自动执行迁移并从命令行手动进行迁移可能更合适。

<!-- The current code for the application is in its entirety in [GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-7), branch <i>part13-7</i>. -->
应用程序的当前代码全部在  [GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-7)，分支 part13-7中。

</div>

<div class="tasks">

### Tasks 13.17-13.18.

#### Task 13.17.

<!-- Delete all tables from your application database. -->
从应用程序数据库中删除所有表。

<!-- Make a migration that sets the database to its current state. Create <i>created\_at</i> and <i>updated\_at</i> [timestamps](https://sequelize.org/master/manual/model-basics.html#timestamps) for both tables. Keep in mind that you will have to create them in migration yourself. -->
进行迁移，将数据库设置为其当前状态。为这两个表创建 <i>created\_at</i> 和  <i>updated\_at</i> [timestamps](https://sequelize.org/master/manual/model-basics.html#timestamps) 。请记住，您必须自己在迁移中创建它们。

<!-- **NOTE:** be sure to remove the commands <i>User.sync()</i> and <i>Blog.sync()</i>, which synchronizes models' schemes from your code otherwise you will not succeed in executing migrations. -->
**注意:** 一定要删除<i>User.sync()</i>和 <i>Blog.sync()</i> 命令，这两个命令可以从代码中同步模型的方案，否则无法成功执行迁移。

<!-- **NOTE2:** if you have to delete tables from the command line (i.e. you don't do the deletion by undoing the migration), you will have to delete the contents of the table <i>migrations</i> if you want your program to be able to perform the migrations again. -->
**注2:** 如果你必须从命令行中删除表(也就是说你不需要通过取消迁移来删除表) ，如果你想让你的程序能够再次执行迁移，你就必须删除表 <i>migrations</i>的内容。

#### Task 13.18.

<!-- Expand your application (by migration) so that the blogs have a year of writing, i.e. a field <i>year</i> which is an integer at least equal to 1991 but not greater than the current year. Make sure the application gives the appropriate error message if an incorrect value is attempted to be given for the year of writing. -->
扩展应用程序(通过迁移) ，使博客有一年的写作时间，即一个字段<i>year</i> ，该字段年至少等于1991，但不大于当前年份。如果在写入年份中尝试给出不正确的值，请确保应用程序给出了适当的错误消息。

</div>

<div class="content">

### Many-to-many connections

<!-- Continue to expand the application so that each user can be added to one or more <i>teams</i>. -->
继续扩展应用程序，以便将每个用户添加到一个或多个团队 <i>teams</i>中。

<!-- Since an arbitrary number of users can join one team, and one user can join an arbitrary number of teams, we are dealing with [many-to-many](https://sequelize.org/master/manual/assocs.html#many-to-many-relationships), a many-to-many type of connection, which is traditionally implemented in relational databases using a <i>connection table</i>. -->
由于任意数量的用户可以加入一个团队，而一个用户可以加入任意数量的团队，因此我们处理的是多对多 [many-to-many](https://sequelize.org/master/manual/assocs.html#many-to-many-relationships)、多对多类型的连接，这种连接通常是在关系数据库中使用连接表<i>connection table</i>实现的。

<!-- Let's now create the code needed for the team as well as the connection table. Migration is as follows: -->
现在让我们创建团队所需的代码以及连接表。迁移如下:

```js
const { DataTypes } = require('sequelize')

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('teams', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
      },
    })
    await queryInterface.createTable('memberships', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
      team_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'teams', key: 'id' },
      },
    })
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('teams')
    await queryInterface.dropTable('memberships')
  },
}
```

<!-- Models contain almost the same code as migration. The team model <i>models/team.js</i> -->
模型包含几乎与迁移相同的代码，team 的模型<i>models/team.js</i> 如下：

```js
const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Team extends Model {}

Team.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'team'
})

module.exports = Team
```

Model for connection table <i>models/membership.js</i>:
连接表<i>models/membership.js</i>的模型如下：

```js
const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Membership extends Model {}

Membership.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  team_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'teams', key: 'id' },
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'membership'
})

module.exports = Membership
```

<!-- So we have given the name that describes the connection table, <i>membership</i>. There is not always an relevant name for a connection table, in which case the name of the connection table can be a combination of the names of the tables to be joined, e.g. <i>user\_teams</i> could fit our situation. -->
因此，我们已经给出了描述连接表的名称——成员<i>membership</i>。连接表并不总是有相关的名称，在这种情况下，连接表的名称可以是要连接的表的名称的组合，例如，用户团队 <i>user\_teams</i> 可以适合我们的情况。

<!-- The file <i>models/index.js</i> comes with a small addition that links the method [belongsToMany](https://sequelize.org/master/manual/assocs.html#implementation-3) to allow teams and users to each other also at the code level. -->
文件 <i>models/index.js</i> 附带了一个小的附加文件，该附加文件将  [belongsToMany](https://sequelize.org/master/manual/assocs.html#implementation-3)  方法链接起来，从而允许团队和用户在代码级别上相互联系。

```js
const Note = require('./note')
const User = require('./user')
// highlight-start
const Team = require('./team')
const Membership = require('./membership')
// highlight-end

Note.belongsTo(User)
User.hasMany(Note)

// highlight-start
User.belongsToMany(Team, { through: Membership })
Team.belongsToMany(User, { through: Membership })
// highlight-end

module.exports = {
  Note, User, Team, Membership
}

```

<!-- Note the difference between the migration of the connection table and the model when defining reference key fields. During the migration, fields are defined in snake case form: -->
请注意，在定义引用键字段时，连接表的迁移与模型的迁移之间存在差异。在迁移过程中，字段以 snake 格式定义:

```js
await queryInterface.createTable('memberships', {
  // ...
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  team_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'teams', key: 'id' },
  }
})
```

<!-- in the model, while the same are defined as camel case: -->
在模型中，同样被定义为驼峰情况:

```js
Membership.init({
  // ...
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  teamId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'teams', key: 'id' },
  },
  // ...
})
```

<!-- Now let's create a couple of teams from the console, as well as a few memberships: -->
现在让我们从控制台创建几个团队，以及几个成员:

```js
insert into teams (name) values ('toska');
insert into teams (name) values ('mosa climbers');
insert into memberships (user_id, team_id) values (1, 1);
insert into memberships (user_id, team_id) values (1, 2);
insert into memberships (user_id, team_id) values (2, 1);
insert into memberships (user_id, team_id) values (3, 2);
```

<!-- Then insert in the route of all users the information about the user's teams -->
然后在所有用户的路由中插入关于用户团队的信息

```js
router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: [
      {
        model: Note,
        attributes: { exclude: ['userId'] }
      },
      // hihhlight-start
      {
        model: team,
        attributes: ['name', 'id'],
      }
      // hihhlight-end
    ]
  })
  res.json(users)
})
```

<!-- The most observant will notice that the query that comes to the console now combines three tables. -->
观察最仔细的人会注意到，现在来到控制台的查询组合了三个表。

<!-- The solution is pretty good, but there's a beauty flaw in it. The result also comes with the attributes of the line of the connection table, although we do not want them: -->
解决方案是相当不错，但有一个美丽的缺陷。结果还包含连接表的行的属性，尽管我们不需要这些属性:

![](../../images/13/3.png)


<!-- By carefully reading the documentation, you can find a [solution](https://sequelize.org/master/manual/advanced-many-to-many.html#specifying-attributes-from-the-through-table): -->
通过仔细阅读文档，你可以找到一个解决方案 [solution](https://sequelize.org/master/manual/advanced-many-to-many.html#specifying-attributes-from-the-through-table) :

```js
router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: [
      {
        model: Note,
        attributes: { exclude: ['userId'] }
      },
      {
        model: Team,
        attributes: ['name', 'id'],
        // highlight-start
        through: {
          attributes: []
        }
      // highlight-end
      }
    ]
  })
  res.json(users)
})
```

<!-- The current code for the application is in its entirety in [GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-8), branch <i>part13-8</i>. -->
应用程序的当前代码全部在  [GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-8)，分支 part13-8中。

### Note on the properties of Sequelize model objects

<!-- The specification of our models included the following lines: -->
我们的模型规格包括以下几行:

```js
User.hasMany(Note)
User.hasMany(Note)

User.belongsToMany(Team, { through: Membership })
Team.belongsToMany(User, { through: Membership })
```

<!-- These allow Sequelize to make queries that retrieve, for example, all the notes of users, or all members of the team. -->
这使得 Sequelize 可以进行查询，例如，检索用户或团队所有成员的所有注释。

<!-- The definitions also allow us to access directly in the code, e.g. user notes. In the following, we will search a user with id 1 and print the the notes associated with the user: -->
这些定义还允许我们直接访问代码，例如用户说明。在下面，我们将搜索 id 为1的用户，并打印与该用户相关的note:

```js
const user = await User.findByPk(1, {
  include: {
    model: Note
  }
})

user.notes.forEach(note => {
  console.log(note.content)
})
```

<!-- The definition <i>User.hasMany(Note)</i> therefore attaches an attribute <i>notes</i> to <i>user</i> object, which gives access to the notes made by the user. Definition <i>User.belongsToMany(Team, { through: Membership }))</i> similarly attaches users attribute <i>teams</i> which also have the ability to exploit in the code: -->
因此，定义<i>User.hasMany(Note)</i> 将一个属性注释附加到用户对象，用于访问 <i>user</i> 所做的 <i>notes</i>。定义  <i>User.belongsToMany(Team, { through: Membership }))</i> 类似地附加了用户属性 <i>teams</i>，这些 <i>teams</i>也能够在代码中利用:

```js
const user = await User.findByPk(1, {
  include: {
    model: team
  }
})

user.teams.forEach(team => {
  console.log(team.name)
})
```

<!-- Suppose we would like to return a json from an single user's route containing the user's name, username and number of notes created. We could try the following: -->
假设我们希望从单个用户的路由返回一个 json，该路由包含用户名、用户名和创建的注释编号。我们可以试试以下方法:

```js
router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    include: {
        model: Note
      }
    }
  )

  if (user) {
    user.note_count = user.notes.length // highlight-line
    delete user.notes // highlight-line
    res.json(user)

  } else {
    res.status(404).end()
  }
})
```

<!-- So, we tried to include the <i>noteCount</i> field in the returned object by Sequelize and remove the <i>notes</i> field from it. However, this approach does not work, as the things returned by Sequelize are not normal things to which the addition of new fields works as we want. -->
因此，我们尝试在 Sequelize 返回的对象中包含  <i>noteCount</i>  字段，并从中删除 <i>notes</i> 字段。但是，这种方法不起作用，因为 Sequelize 返回的内容不是正常的内容，添加新字段可以按照我们希望的方式工作。

A better solution is to create a completely new object based on the data retrieved from the database:
一个更好的解决方案是基于从数据库检索到的数据创建一个全新的对象:

```js
router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    include: {
        model: Note
      }
    }
  )

  if (user) {
    res.json({
      username: user.username, // highlight-line
      name: user.name, // highlight-line
      note_count: user.notes.length // highlight-line
    })

  } else {
    res.status(404).end()
  }
})
```
### Many-to-many again

<!-- Let's make another many-to-many relation in the application. Each note is with the reference key by the user who created it. It is decided that the application also supports that the note can be associated with other users, and that a user can be associated with an arbitrary number of notes created by another user. It is thought that these notes are those that the user has <i>marked</i> for himself. -->
让我们在应用程序中建立另一个多对多关系。每个音符都带有创建它的用户的引用键。决定该应用程序还支持该注释可以与其他用户关联，并且一个用户可以与另一个用户创建的任意数量的注释关联。人们认为这些笔记是用户为自己标记<i>marked</i>的。

<!-- Let's make a connection table <i>user_notes</i> for the situation. Migration is straightforward: -->
让我们为这种情况做一个连接表<i>user_notes</i> ，迁移很简单:

```js
const { DataTypes } = require('sequelize')

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('user_notes', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
      note_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'notes', key: 'id' },
      },
    })
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('user_notes')
  },
}
```

<!-- Also, there is nothing special about the model: -->
此外，这种模式也没有什么特别之处:

```js
const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class UserNotes extends Model {}

UserNotes.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  note_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'notes', key: 'id' },
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'user_notes'
})

module.exports = UserNotes
```

<!-- The file <i>models/index.js</i>, on the other hand, comes with a slight change to what we saw before: -->
另一方面，文件 <i>models/index.js</i> 与我们之前看到的稍有不同:

```js
const Note = require('./note')
const User = require('./user')
const Team = require('./team')
const Membership = require('./membership')
const UserNotes = require('./user_notes') // highlight-line

Note.belongsTo(User)
User.hasMany(Note)

User.belongsToMany(Team, { through: Membership })
Team.belongsToMany(User, { through: Membership })

// highlight-start
User.belongsToMany(Note, { through: UserNotes, as: 'marked_notes' })
Note.belongsToMany(User, { through: UserNotes, as: 'users_marked' })
// highlight-end

module.exports = {
  Note, User, Team, Membership, UserNotes
}
```

<!-- There is again <i>belongsToMany</i> which links to the user notes via the model <i>UserNotes</i> corresponding to the connection table. However, this time we give an <i>alias name</i> for the attribute formed using the keyword [as](https://sequelize.org/master/manual/advanced-many-to-many.html#aliases-and-custom-key-names), the default name (for users <i>notes</i>) would overlap with its previous meaning, i.e. user-generated notes. -->
还有一个 <i>belongsToMany</i>，它通过与连接表对应的模型 <i>UserNotes</i> 链接到用户注释。但是，这次我们为使用关键字 [as](https://sequelize.org/master/manual/advanced-many-to-many.html#aliases-and-custom-key-names) 的属性指定一个别名<i>alias name</i>，因为默认名称(用户 <i>notes</i>)将与其先前的含义重叠，即用户生成的note。

<!-- Extend the route for an individual user to return the user's teams, their own notes, and other notes attached to the user: -->
扩展个人用户返回用户团队、他们自己的笔记和其他附加到用户的笔记的路由

```js
router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: [''] } ,
    include:[{
        model: note,
        attributes: { exclude: ['userId'] }
      },
      {
        model: Note,
        as: 'marked_notes',
        attributes: { exclude: ['userId']},
        through: {
          attributes: []
        },
        include: {
          model: user,
          attributes: ['name']
        }
      },
      {
        model: Team,
        attributes: ['name', 'id'],
        through: {
          attributes: []
        }
      },
    ]
  })

  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})
```

<!-- In the context of the include, you must now mention the alias name <i>marked\_notes</i> which we have just defined by the <i>as</i> attribute. -->
在 include 的上下文中，您现在必须提到  <i>marked\_notes</i> 的别名，我们刚刚通过 <i>as</i> 属性定义了这个别名。

<!-- In order to test the feature, let's create some test data in the database: -->
为了测试这个特性，让我们在数据库中创建一些测试数据:

```sql
insert into user_notes (user_id, note_id) values (1, 4);
insert into user_notes (user_id, note_id) values (1, 5);
```

<!-- The end result is functional: -->
最终的结果的功能如下:

![](../../images/13/5.png)

<!-- What if we wanted to have information about the author of the note in the notes marked by the user as well? This can be done by adding your own <i>include</i> to the attached notes: -->
如果我们希望在用户标记的笔记中也有关于笔记作者的信息，该怎么办？这可以通过在附注中添加你自己的<i>include</i>来实现:

```js
router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: [''] } ,
    include:[{
        model: note,
        attributes: { exclude: ['userId'] }
      },
      {
        model: Note,
        as: 'marked_notes',
        attributes: { exclude: ['userId']},
        through: {
          attributes: []
        },
        // highlight-start
        include: {
          model: User,
          attributes: ['name']
        }
        // highlight-end
      },
      {
        model: team,
        attributes: ['name', 'id'],
        through: {
          attributes: []
        }
      },
    ]
  })

  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})
```


<!-- The end result is as desired: -->
最终结果如愿以偿:

![](../../images/13/4.png)

<!-- The current code for the application is in its entirety in [GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-9), branch <i>part13-9</i>. -->
应用程序的当前代码全部在 [GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-9)，branch part13-9中。

</div>

<div class="tasks">

### Tasks 13.19.-13.23.

#### Task 13.19.

<!-- Enable users the ability to add blogs on the system to the <i>reading list</i>. When added to the reading, the blog is in a state of <i>unread</i>. The blog can later be marked as <i>read</i>. Implement the reading list using a connection table. Make database changes using migrations. -->
使用户能够将系统中的博客添加到阅读列表<i>reading list</i>中。当添加到阅读时，博客处于未读 <i>unread</i>状态。这个博客以后可以标记为已读 <i>read</i>。使用连接表实现阅读列表。使用迁移进行数据库更改。

<!-- In this task, adding to a reading list and displaying the list need not be successful other than directly using the database. -->
在此任务中，除了直接使用数据库之外，添加到阅读列表并显示列表不需要成功。

#### Exercise 13.20.

<!-- Now add functionality to the application to support the reading list. -->
现在向应用程序添加功能以支持阅读列表。

<!-- Adding a blog to the reading list is done by making an HTTP POST to the path <i>/api/readinglists</i>, the request will be accompanied with the blog and user id: -->
将 blog 添加到阅读列表是通过向  <i>/api/readinglists</i> 创建一个 HTTP POST 来完成的，请求将附带 blog 和用户 id:

```js
{
  blog_id: 10,
  user_id: 3
}
```

<!-- Also implement the individual user's return route _GET /api/users/:id_ which returns not only the user's other information but also the reading list, e.g. in the following format: -->
还要实现个别用户的返回路由 _GET /api/users/:id_，该路由不仅返回用户的其他信息，还返回阅读列表，例如以下格式:

```js
{
  name: "Matti Luukkainen",
  username: "mluukkai@iki.fi",
  readings: [
    {
      id: 3,
      url: "https://google.com",
      title: "Clean React",
      author: "Dan Abramov",
      likes: 34,
      year: null,
    },
    {
      id: 4,
      url: "https://google.com",
      title: "Clean Code",
      author: "Bob Martin",
      likes: 5,
      year: null,
    }
  ]
}
```

<!-- At this point, information about whether the blog is read or not does not need to be available. -->
在这一点上，关于博客是否被阅读的信息并不需要可用。

#### Task 13.21.

<!-- Expand the single-user view so that for each blog in the reading list also whether the blog has been read <i>and</i> the id of the corresponding connection table row. -->
展开单用户视图，以便对于阅读列表中的每个 blog，还可以知道 blog 是否已被读取，以及相应连接表行的 id。

<!-- For example, the information can be in the following form: -->
例如，信息可以采用以下形式:

```js
{
  name: "Matti Luukkainen",
  username: "mluukkai@iki.fi",
  readings: [
    {
      id: 3,
      url: "https://google.com",
      title: "Clean React",
      author: "Dan Abramov",
      likes: 34,
      year: null,
      readinglists: [
        {
          read: false,
          id: 2
        }
      ]
    },
    {
      id: 4,
      url: "https://google.com",
      title: "Clean Code",
      author: "Bob Martin",
      likes: 5,
      year: null,
      readinglists: [
        {
          read: false,
          id: 2
        }
      ]
    }
  ]
}
```

<!-- Note: there are several ways to implement this functionality. [This](https://sequelize.org/master/manual/advanced-many-to-many.html#the-best-of-both-worlds--the-super-many-to-many-relationship) should help. -->
注意: 有几种方法可以实现这个功能。[这个](https://sequelize.org/master/manual/advanced-many-to-many.html#the-best-of-both-worlds--the-super-many-to-many-relationship) 链接可以参考。
#### Exercise 13.22.

<!-- Make it possible for the application to mark the blog on the reading list as read. Marking the reading is done by making a request to the _PUT /api/readinglists/:id_ path, and sending the request with -->
使应用程序可以在阅读列表中将博客标记为已读。通过向 _PUT /api/readinglists/:id_ 路径发出请求

```js
{ read: true }
```

<!-- The user can only mark the blogs as read in their own reading list. The user is identified as usual from the token accompanying the request. -->
用户只能在自己的阅读列表中将博客标记为已读。通常从请求附带的令牌标识用户。

#### Exercise 13.23.

<!-- Modify the route that returns single user information, so that the request can be controlled which of the blogs in the reading list are returned: -->
修改返回单个用户信息的路由，以便可以控制请求返回阅读列表中的哪个博客:

returns blogs that have not been read
返回未读过的博客

- _GET /api/users/:id_ returns entire reading list
- _GET /api/users/:id?read=true_ returns blogs that have been read
- _GET /api/users/:id?read=false_ returns blogs that have not been read

</div>

<div class="content">

### Concluding remarks

<!-- Our application is starting to be in at least valid condition. However, before the end of the section, let's look at a few more points. -->
我们的应用程序至少开始处于有效状态。但是，在本节结束之前，让我们再看一些要点。

#### Eager vs lazy fetch

<!-- When we make queries using the <i>include</i> attribute: -->
当我们使用  <i>include</i> 属性进行查询时:

```js
User.findOne({
  include: {
    model: note
  }
})
```

<!-- The so-called [eager fetch](https://sequelize.org/master/manual/assocs.html#basics-of-queries-involving-associations) occurs, i.e. all the rows of table attached to the user by connection query, in the case of example, the notes taken by the user, are fetched from the database at the same time. This is often what we want, but there are also situations where you want to do a so-called _lazy fetch_, i.e. search for user related teams only if they are needed. -->
所谓的即时获取[eager fetch](https://sequelize.org/master/manual/assocs.html#basics-of-queries-involving-associations)，即通过连接查询将表的所有行连接到用户，例如，用户记录的笔记，同时从数据库中获取。这通常是我们所希望的，但是也有一些情况需要执行所谓的延迟获取_lazy fetch_，即只在需要的时候搜索与用户相关的团队。

<!-- Let's now modify the route for an individual user's route so that it fetches the user's teams only if the query parameter <i>teams</i> is set for the request: -->
现在，让我们修改一个用户路由的路由，这样只有在查询参数团队<i>teams</i>为请求设置的情况下，它才能获取用户的团队:

```js
router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: [''] } ,
    include:[{
        model: note,
        attributes: { exclude: ['userId'] }
      },
      {
        model: Note,
        as: 'marked_notes',
        attributes: { exclude: ['userId']},
        through: {
          attributes: []
        },
        include: {
          model: user,
          attributes: ['name']
        }
      },
    ]
  })

  if (!user) {
    return res.status(404).end()
  }

  // hightlight-start
  let teams = undefined

  if (req.query.teams) {
    teams = await user.getTeams({
      attributes: ['name'],
      joinTableAttributes: []  
    })
  }

  res.json({ ...user.toJSON(), teams })
  // hightlight-end
})
```

<!-- So now, the <i>User.findByPk</i> query does not retrieve teams, but they are retrieved if necessary by the <i>user</i> method <i>getTeams</i>, which is automatically generated by Sequelize for the model object. Similar <i>get</i>- and a few other useful methods [are automatically generated](https://sequelize.org/master/manual/assocs.html#special-methods-mixins-added-to-instances) when defining associations for tables at the Sequelize level. -->
现在，<i>User.findByPk</i>  查询不检索团队，但是如果需要，可以通过<i>user</i> 方法 <i>getTeams</i> 检索团队，该方法由 Sequelize 为模型对象自动生成。当在 Sequelize 级别为表定义关联时，会自动生成 [are automatically generated](https://sequelize.org/master/manual/assocs.html#special-methods-mixins-added-to-instances) 类似的 <i>get</i>和其他一些有用的方法。

#### Features of models

<!-- There are some situations where, by default we do not want to handle with all the rows of a particular table. One such case could be that we don't normally want to display users with disabled (<i>disabled</i>) ID in our application. In such situation, we could define the default [scopen](https://sequelize.org/master/manual/scopes.html) for the model: -->
在某些默认情况下，我们不希望处理特定表的所有行。其中一种情况可能是，我们通常不希望在应用程序中显示禁用(<i>disabled</i>) ID 的用户。在这种情况下，我们可以为模型定义默认的 [scopen](https://sequelize.org/master/manual/scopes.html) :

```js
class User extends Model {}

User.init({
  // field definition
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'user',
  // highlight-start
  defaultScope: {
    where: {
      disabled: false
    }
  },
  scopes: {
    admin: {
      where: {
        admin: true
      }
    },
    disabled: {
      where: {
        disabled: true
      }
    }
  }
  // highlight-end
})

module.exports = User
```

<!-- Now the query caused by the function call <i>User.findAll()</i> has the following where-condition: -->
现在，函数调用  <i>User.findAll()</i> 引发的查询具有以下 where-condition:

```
WHERE "user". "disabled" = false;
```

<!-- For models, it is possible to define other scopes as well: -->
对于模型，也可以定义其他范围:

```js
User.init({
  // field definition
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'user',
  defaultScope: {
    where: {
      disabled: false
    }
  },
    // highlight-start
  scopes: {
    admin: {
      where: {
        admin: true
      }
    },
    disabled: {
      where: {
        disabled: true
      }
    },
    name(value) {
      return {
        where: {
          name: {
            [Op.iLike]: value
          }
        }
      }
    },
  }
  // highlight-end
})
```

<!-- Scopes are used as follows: -->
范围用途如下:

```js
// all admins
const adminUsers = await User.scope('admin').findAll()

// all inactive users
const disabledUsers = await User.scope('disabled').findAll()

// users with the string jami in their name
const jamiUsers = User.scope({ method: ['name', '%jami%'] }).findAll()
```

<!-- It is also possible to chain scopes: -->
还可以将范围链接起来:

```js
// admins with the string jami in their name
const jamiUsers = User.scope('admin', { method: ['name', '%jami%'] }).findAll()
```

<!-- Since Sequelize models are normal [JavaScript classes](https://sequelize.org/master/manual/model-basics.html#taking-advantage-of-models-being-classes), it is possible to add new methods to them. -->
因为 Sequelize 模型是普通的 JavaScript 类 [JavaScript classes](https://sequelize.org/master/manual/model-basics.html#taking-advantage-of-models-being-classes)，所以可以向它们添加新的方法。

<!-- Here are two examples: -->
这里有两个例子:

_TODO: should perhaps use camelCase in the names of the methods?_

_TODO: numberOfNotes could be a good example for a count method: https://sequelize.org/master/manual/model-querying-basics.html#-code-count--code-_

```js
const { Model, DataTypes, Op } = require('sequelize') // hightlight-line

const Note = require('./note')
const { sequelize } = require('../util/db')

class User extends Model {
  // hightlight-start
  async number_of_notes() {
    return (await this.getNotes()).length
  }

  static async with_notes(limit){
    return await User.findAll({
      attributes: {
        include: [[ sequelize.fn("COUNT", sequelize.col("notes.id")), "note_count" ]]
      },
      include: [
        {
          model: Note,
          attributes: []
        },
      ],
      group: ['user.id'],
      having: sequelize.literal(`COUNT(notes.id) > ${limit}`)
    })
  }
  // hightlight-end
}

User.init({
  // ...
})

module.exports = User
```

<!-- The first of the methods <i>numberOfNotes</i> is an <i>instance method</i>, meaning that it can be called on instances of the model: -->
第一个方法 <i>numberOfNotes</i> 是一个实例方法 <i>instance method</i>，这意味着可以在模型的实例上调用它:

_TODO: camelCase?_

```js
const jami = await User.findOne({ name: 'Jami Kousa'})
const cnt = await jami.number_of_notes()
console.log(`Jami has created ${cnt} notes`)
```

<!-- Within the instance method, the keyword <i>this</i> therefore refers to the instance itself: -->
因此，在实例方法中，关键字 <i>this</i> 指向实例本身:

```js
async number_of_notes() {
  return (await this.getNotes()).length
}
```

<!-- The second of the methods, which returns those users who have at least a parameter's worth of notes is again the <i>class method</i>, i.e. it is called directly to the model: -->
第二个方法，返回那些至少有一个参数值的注释的用户，也是类方法<i>class method</i>，也就是说，它被直接调用到模型中:

```js
const users = await User.with_notes(2)
console.log(JSON.stringify(users, null, 2))
users.forEach(u => {
  console.log(u.name)
})
```

#### Repeatability of models and migrations

<!-- We have noticed that the code for models and migrations is very repetitive. For example, the model of teams -->
我们已经注意到模型和迁移的代码是非常重复的，例如，team 的模型：

```js
class Team extends Model {}

Team.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'team'
})

module.exports = Team
```

<!-- and migration contain much of the same -->
迁徙也包含了大量相同的操作

```js
const { DataTypes } = require('sequelize')

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('teams', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
      },
    })
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('teams')
  },
}
```

<!-- Couldn't we optimize the code so that, e.g. the model would export shared parts for migration? -->
难道我们不能优化代码，例如，模型可以导出共享的部分用于迁移吗？

<!-- However, the problem is that the definition of the model may change over time, for example a field <i>name</i> may change the name or its data type may change. Migrations must be able to be performed successfully at any time from start to end, and if migrations rely the model has a certain content, it will no longer be true in a month or a year's time. Therefore, despite the "copy paste", the migration code should be completely separate from the model code. -->
然而，问题是模型的定义可能会随着时间的推移而改变，例如字段名称可能会改变名称或者它的数据类型可能会改变。迁移必须能够在从开始到结束的任何时候成功地执行，如果迁移依赖于模型具有某些内容，那么在一个月或一年的时间内它将不再是真实的。因此，尽管有“复制粘贴”，迁移代码应该与模型代码完全分离。

<!-- One solution would be to use Sequelize's [command line tool](https://sequelize.org/master/manual/migrations.html#creating-the-first-model--and-migration-), which generates both models and migration files based on commands given at the command line. For example, the following command would create a model <i>User</i> with <i>name</i>, <i>username</i>, and <i>admin</i> as attributes, as well as the migration that manages the creation of the databse table:   -->
一个解决方案是使用 Sequelize 的命令行工具 [command line tool](https://sequelize.org/master/manual/migrations.html#creating-the-first-model--and-migration-)，该工具根据命令行给出的命令生成模型和迁移文件。例如，下面的命令将创建一个名称、用户名和管理属性的 User 模型，以及管理创建数据库表的迁移:

```
npx sequelize-cli model:generate --name User --attributes name:string,username:string,admin:boolean
```

<!-- From the command line, you can also run as well as rollback, i.e. cancel migrations. The command line documentation is unfortunately thin and in this course we decided to do both models and migrations manually. The solution may or may not have been a wise one. -->
在命令行中，您还可以运行以及回滚，即取消迁移。不幸的是，命令行文档很少，在本课程中，我们决定手动执行模型和迁移。这个解决方案可能是明智的，也可能不是。

</div>

<div class="tasks">

### Task 13.24.

#### Task 13.24.

<!-- Grande finale: [towards the end of part 4](/part4/token_based_login#token_based_login_problems) there was mention of a token-criticality problem: if a user's access to the system is decided to be revoked, the user may still use the token in possession to use the system. -->
Grande finale: 在第4部分的末尾 [towards the end of part 4](/part4/token_based_login#token_based_login_problems) 提到了一个令牌临界问题: 如果一个用户对系统的访问被决定撤销，那么用户仍然可以使用占有的令牌来使用系统。

<!-- The usual solution to this is to store a record of each token issued to the customer in the backend database, and check with each request whether the access is still valid at each request. In this case, if necessary, the validity of the token can be removed immediately. Such a solution is often referred to as <i>server-side session</i>. -->
通常的解决方案是在后端数据库中存储发给客户的每个令牌的记录，并检查每个请求中的访问是否仍然有效。在这种情况下，如果需要，可以立即删除令牌的有效性。这种解决方案通常称为服务器端会话。

<!-- Now expand the system so that the user who has lost access will not be able to perform any actions that require logging. -->
现在扩展系统，以便失去访问权限的用户将不能执行任何需要日志记录的操作。

<!-- You will probably need at least the following for implementation -->
为了实现，您可能至少需要以下内容

<!-- - a boolean value column in the user table to indicate whether the ID is disabled
  - it is sufficient to disable and enable IDs directly from the database
- a table that remembers active sessions
  - session is stored on the table when the user makes a login, i.e. operation POST /api/login
  - the existence (and validity) of the session is always checked when the user makes a login operation
- a route that allows the user to "log out" of the system, i.e. to practically remove active sessions from the database, the route can be e.g. DELETE /api/logout -->

- 用户表中的布尔值列，以指示是否禁用 ID
    - 从数据库直接禁用和启用 id 就足够了
- 一个能记住活跃会话的表
    - 当用户进行登录(即操作 POST/api/login)时，session 存储在表中
    - 当用户进行登录操作时，总是检查会话的存在(和有效性)
- 一个允许用户“注销”系统的路由，即实际上从数据库中删除活动会话，该路由可以是 DELETE/api/logout


<!-- Keep in mind that the login should not be successful with an "expired token", i.e. with the same token after logging out. -->
请记住，登录不应成功与“过期令牌”，即与相同的令牌登出后。

<!-- You may also choose to use some purpose-built npm library to handle sesssions. -->
您还可以选择使用一些特定构建的 npm 库来处理函数。

<!-- Make the database changes required for this task using migrations. -->
使用迁移进行此任务所需的数据库更改。

### Submitting exercises and getting the credits

<!-- Exercises of this part are submitted just like in the previous parts, but unlike parts 0 to 7, the submission goes to an own [course instance](https://studies.cs.helsinki.fi/stats/courses/fs-psql). Remember that you have to finish all the exercises to pass this part! -->
这一部分的练习和前面的部分一样，但是不同于0到7章，提交到一个自己的课程实例 [course instance](https://studies.cs.helsinki.fi/stats/courses/fs-psql)。记住，你必须完成所有的练习才能通过这一章！

<!-- Once you have completed the exercises and want to get the credits, let us know through the exercise submission system that you have completed the course: -->
一旦你完成了练习并且想获得学分，通过练习提交系统让我们知道你已经完成了课程:

![Submissions](../../images/11/21.png)

<!-- Note that the "exam done in Moodle" note refers to the [Full Stack Open course's exam](/en/part0/general_info#sign-up-for-the-exam), which has to be completed before you can earn credits from this part. -->
请注意，“在 Moodle 完成的考试”指的是全堆栈公开课程的考试 [Full Stack Open course's exam](/en/part0/general_info#sign-up-for-the-exam)，必须完成后，你才能从这一部分获得学分。

<!-- **Note** that you need a registration to the corresponding course part for getting the credits registered, see [here](/part0/general_info#parts-and-completion) for more information. -->
请注意，您需要注册到相应的课程部分获得学分注册，更多信息请参见这里[here](/part0/general_info#parts-and-completion) 。

</div>