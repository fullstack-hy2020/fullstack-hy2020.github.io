---
mainImage: ../../../images/part-13.svg
part: 13
letter: c
lang: zh
---

<div class="content">

### Migrations

<!-- Let's keep expanding the backend. We want to implement support for allowing users with <i>admin status</i> to put users of their choice in disabled mode, preventing them from logging in and creating new notes. In order to implement this, we need to add boolean fields to the users' database table indicating whether the user is an admin and whether the user is disabled.-->
让我们继续扩展后端。我们想实现允许具有<i>管理员状态</i>的用户将其选择的用户置于禁用模式，以防止其登录并创建新笔记。为了实现这一点，我们需要向用户的数据库表中添加布尔字段，以指示用户是否为管理员以及用户是否处于禁用状态。

<!-- We could proceed as before, i.e. change the model that defines the table and rely on Sequelize to synchronize the changes to the database. This is specified by these lines in the file <i>models/index.js</i>-->
我们可以像以前一样继续，即更改定义表的模型并依靠Sequelize将更改同步到数据库。这在文件<i>models/index.js</i>中由以下几行指定。

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

<!-- However, this approach does not make sense in the long run. Let's remove the lines that do the synchronization and move to using a much more robust way, [migrations](https://sequelize.org/master/manual/migrations.html) provided by Sequelize (and many other libraries).-->
但是，从长远来看，这种方法是没有意义的。让我们删除做同步的行，并转而使用更加强大的方式，[迁移](https://sequelize.org/master/manual/migrations.html)，由Sequelize（和许多其他库）提供。

<!-- In practice, a migration is a single JavaScript file that describes some modification to a database. A separate migration file is created for each single or multiple changes at once. Sequelize keeps a record of which migrations have been performed, i.e. which changes caused by the migrations are synchronized to the database schema. When creating new migrations, Sequelize keeps up to date on which changes to the database schema are yet to be made. In this way, changes are made in a controlled manner, with the program code stored in version control.-->
在实践中，迁移是一个描述对数据库的某些修改的单个JavaScript文件。为每个单个或多个更改一次创建一个单独的迁移文件。Sequelize记录已执行的迁移，即迁移引起的哪些更改已同步到数据库模式。在创建新的迁移时，Sequelize会及时更新数据库模式尚未进行的更改。通过这种方式，以程序代码存储在版本控制中的方式进行更改。

<!-- First, let's create a migration that initializes the database. The code for the migration is as follows-->
首先，让我们创建一个初始化数据库的迁移。迁移的代码如下：

```js
const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
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
        type: DataTypes.BOOLEAN,
        allowNull: false
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
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('notes')
    await queryInterface.dropTable('users')
  },
}
```

<!-- The migration file [defines](https://sequelize.org/master/manual/migrations.html#migration-skeleton) the functions <i>up</i> and <i>down</i>, the first of which defines how the database should be modified when the migration is performed. The function <i>down</i> tells you how to undo the migration if there is a need to do so.-->
迁移文件定义了<i>up</i>和<i>down</i>两个函数，其中第一个函数定义了当执行迁移时应该如何修改数据库。函数<i>down</i>告诉您如果需要的话如何撤消迁移。[参考链接](https://sequelize.org/master/manual/migrations.html#migration-skeleton)

<!-- Our migration contains three operations, the first creates a <i>notes</i> table, the second creates a <i>users</i> table and the third adds a foreign key to the <i>notes</i> table referencing the creator of the note. Changes in the schema are defined by calling the [queryInterface](https://sequelize.org/master/manual/query-interface.html) object methods.-->
我们的迁移包含三个操作，第一个创建一个<i>笔记</i>表，第二个创建一个<i>用户</i>表，第三个在<i>笔记</i>表中添加一个外键，引用笔记的创建者。通过调用[queryInterface](https://sequelize.org/master/manual/query-interface.html)对象方法来定义模式的变化。

<!-- When defining migrations, it is essential to remember that unlike models, column and table names are written in snake case form:-->
在定义迁移时，必须记住，与模型不同，列和表名称必须以蛇形形式书写：

```js
await queryInterface.addColumn('notes', 'user_id', { // highlight-line
  type: DataTypes.INTEGER,
  allowNull: false,
  references: { model: 'users', key: 'id' },
})
```

<!-- So in migrations, the names of the tables and columns are written exactly as they appear in the database, while models use Sequelize's default camelCase naming convention.-->
所以在迁移中，表和列的名称与数据库中的名称完全一样，而模型使用Sequelize的默认驼峰命名约定。

<!-- Save the migration code in the file <i>migrations/20211209\_00\_initialize\_notes\_and\_users.js</i>. Migration file names should always be named alphabetically when created so that previous changes are always before newer changes. One good way to achieve this order is to start the migration file name with the date and a sequence number.-->
保存迁移代码到文件<i>migrations/20211209\_00\_initialize\_notes\_and\_users.js</i>中。迁移文件名称创建时应始终按字母顺序命名，以便以前的更改始终在较新的更改之前。一种达到此顺序的好方法是以日期和序列号开头命名迁移文件。

<!-- We could run the migrations from the command line using the [Sequelize command line tool](https://github.com/sequelize/cli). However, we choose to perform the migrations manually from the program code using the [Umzug](https://github.com/sequelize/umzug) library. Let's install the library-->
first.

我们可以使用[Sequelize命令行工具](https://github.com/sequelize/cli)从命令行运行迁移。但是，我们选择从程序代码中手动执行迁移，使用[Umzug](https://github.com/sequelize/umzug)库。让我们先安装该库。

```js
npm install umzug
```

<!-- Let's change the file <i>util/db.js</i> that handles the connection to the database as follows:-->
让我们更改处理与资料库连接的档案 <i>util/db.js</i> 如下：

```js
const Sequelize = require('sequelize')
const { DATABASE_URL } = require('./config')
const { Umzug, SequelizeStorage } = require('umzug') // highlight-line

const sequelize = new Sequelize(DATABASE_URL)

// highlight-start
const runMigrations = async () => {
  const migrator = new Umzug({
    migrations: {
      glob: 'migrations/*.js',
    },
    storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
    context: sequelize.getQueryInterface(),
    logger: console,
  })

  const migrations = await migrator.up()

  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  })
}
// highlight-end

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    /*  highlight-start */
    await runMigrations()
    /* highlight-end */
    console.log('connected to the database')
  } catch (err) {
    console.log('failed to connect to the database')
    console.log(err)
    return process.exit(1)
  }

  return null
}

module.exports = { connectToDatabase, sequelize }
```

<!-- The <i>runMigrations</i> function that performs migrations is now executed every time the application opens a database connection when it starts. Sequelize keeps track of which migrations have already been completed, so if there are no new migrations, running the <i>runMigrations</i> function does nothing.-->
<i>runMigrations</i> 功能现在每次应用程序启动时开启数据库连接时都会执行迁移。Sequelize追踪哪些迁移已经完成，因此如果没有新的迁移，执行<i>runMigrations</i>功能将不会有任何作用。

<!-- Now let's start with a clean slate and remove all existing database tables from the application:-->
现在让我们从一个干净的开始，从应用程序中移除所有现有的资料库表：

```sql
username => drop table notes;
username => drop table users;
username => \d
Did not find any relations.
```

<!-- Let's start up the application. A message about the migrations status is printed on the log-->
.

让我们启动应用程序吧。关于迁移状态的消息已经打印在日志上了。

```bash
INSERT INTO "migrations" ("name") VALUES ($1) RETURNING "name";
Migrations up to date { files: [ '20211209_00_initialize_notes_and_users.js' ] }
database connected
```

<!-- If we restart the application, the log also shows that the migration was not repeated.-->
如果我们重新启动应用程序，日志也显示迁移没有重复。

<!-- The database schema of the application now looks like this-->
数据库架构现在看起来像这样：

```sql
postgres=# \d
                 List of relations
 Schema |     Name     |   Type   |     Owner
--------+--------------+----------+----------------
 public | migrations   | table    | username
 public | notes        | table    | username
 public | notes_id_seq | sequence | username
 public | users        | table    | username
 public | users_id_seq | sequence | username
```

So Sequelize has created a <i>migrations</i> table that allows it to keep track of the migrations that have been performed. The contents of the table look as follows:

```js
postgres=# select * from migrations;
                   name
-------------------------------------------
 20211209_00_initialize_notes_and_users.js
```

<!-- Let's create a few users in the database, as well as a set of notes, and after that we are ready to expand the application.-->
让我们在数据库中创建一些用户，以及一组笔记，然后我们就可以扩展应用程序了。

<!-- The current code for the application is in its entirety on [GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-6), branch <i>part13-6</i>.-->
当前应用程序的代码完整地放在[GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-6)上，分支为<i>part13-6</i>。
### Admin user and user disabling

<!-- So we want to add two boolean fields to the <i>users</i> table-->
所以我们想在<i>用户</i>表中添加两个布尔字段。
<!-- - _admin_ tells you whether the user is an admin-->
_管理员_ 告诉你用户是否是管理员
<!-- - _disabled_ tells you whether the user is disabled from actions-->
disabled：告诉你用户是否被禁止执行操作

<!-- Let's create the migration that modifies the database in the file <i>migrations/20211209\_01\_admin\_and\_disabled\_to\_users.js</i>:-->
让我们创建修改文件<i>migrations/20211209\_01\_admin\_and\_disabled\_to\_users.js</i>中数据库的迁移：

```js
const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('users', 'admin', {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    })
    await queryInterface.addColumn('users', 'disabled', {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('users', 'admin')
    await queryInterface.removeColumn('users', 'disabled')
  },
}
```

<!-- Make corresponding changes to the model corresponding to the <i>users</i> table:-->
**将与<i>用户</i>表对应的模型做出相应的更改：**

将与<i>用户</i>表对应的模型做出相应的更改

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

<!-- When the new migration is performed when the code restarts, the schema is changed as desired:-->
当代码重新启动时，新的迁移被执行，模式按预期改变：

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

Now let's expand the controllers as follows. We prevent logging in if the user field <i>disabled</i> is set to <i>true</i>:

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

Let's disable the user <i>jakousa</i> using his ID:

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

<!-- And make sure that logging in is no longer possible-->
确保登录不再可能。

![](../../images/13/2.png)

<!-- Let's create a route that will allow an admin to change the status of a user's account:-->
让我们创建一条路由，允许管理员更改用户帐户的状态：

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

<!-- There are two middleware used, the first called <i>tokenExtractor</i> is the same as the one used by the note-creation route, i.e. it places the decoded token in the <i>decodedToken</i> field of the request-object. The second middleware <i>isAdmin</i> checks whether the user is an admin and if not, the request status is set to 401 and an appropriate error message is returned.-->
有两个中间件被使用，第一个叫<i>tokenExtractor</i>和笑创建路由使用的一样，也就是把解码的令牌放到请求对象的<i>decodedToken</i>字段。第二个中间件<i>isAdmin</i>检查用户是否为管理员，如果不是，请求状态被设置为401，并返回一个合适的错误消息。

<!-- Note how <i>two middleware</i> are chained to the route, both of which are executed before the actual route handler. It is possible to chain an arbitrary number of middleware to a request.-->
<i>两个中间件</i>被链接到路由上，在实际路由处理器之前都会执行。可以将任意数量的中间件链接到请求上。

<!-- The middleware <i>tokenExtractor</i> is now moved to <i>util/middleware.js</i> as it is used from multiple locations.-->
<i>tokenExtractor</i>现在被移动到<i>util/middleware.js</i>，因为它被多个位置使用。

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
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

module.exports = { tokenExtractor }
```

<!-- An admin can now re-enable the user <i>jakousa</i> by making a PUT request to _/api/users/jakousa_, where the request comes with the following data:-->
管理员现在可以通过发送一个带有以下数据的PUT请求到_/api/users/jakousa_来重新启用用户<i>jakousa</i>：

```js
{
    "disabled": false
}
```

<!-- As noted in [the end of Part 4](/en/part4/token_authentication#problems-of-token-based-authentication), the way we implement disabling users here is problematic. Whether or not the user is disabled is only checked at _login_, if the user has a token at the time the user is disabled, the user may continue to use the same token, since no lifetime has been set for the token and the disabled status of the user is not checked when creating notes.-->
如[第4章节末尾](/en/part4/token_authentication#problems-of-token-based-authentication)所述，我们在这里实现禁用用户的方式是有问题的。仅在_登录_时检查用户是否被禁用，如果用户在被禁用时具有令牌，则用户可能会继续使用相同的令牌，因为令牌没有设置生存期，而且在创建笔记时不检查用户的禁用状态。

<!-- Before we proceed, let's make an npm script for the application, which allows us to undo the previous migration. After all, not everything always goes right the first time when developing migrations.-->
在我们继续之前，让我们为应用程序创建一个npm脚本，它允许我们撤消先前的迁移。毕竟，在开发迁移时，不是每件事都一次就正确的。

<!-- Let's modify the file <i>util/db.js</i> as follows:-->
让我们修改文件<i>util/db.js</i>如下：

```js
const Sequelize = require('sequelize')
const { DATABASE_URL } = require('./config')
const { Umzug, SequelizeStorage } = require('umzug')

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
    console.log('connected to the database')
  } catch (err) {
    console.log('failed to connect to the database')
    return process.exit(1)
  }

  return null
}

// highlight-start
const migrationConf = {
  migrations: {
    glob: 'migrations/*.js',
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console,
}

const runMigrations = async () => {
  const migrator = new Umzug(migrationConf)
  const migrations = await migrator.up()
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  })
}

const rollbackMigration = async () => {
  await sequelize.authenticate()
  const migrator = new Umzug(migrationConf)
  await migrator.down()
}
// highlight-end

/* highlight-start */
module.exports = { connectToDatabase, sequelize, rollbackMigration }
/* highlight-end */
```

<!-- Let's create a file <i>util/rollback.js</i>, which will allow the npm script to execute the specified migration rollback function:-->
让我们创建一个文件<i>util/rollback.js</i>，它将允许npm脚本执行指定的迁移回滚功能：

```js
const { rollbackMigration } = require('./db')

rollbackMigration()
```

<!-- and the script itself:-->
# 生活中的小确幸

生活中有许多小确幸，比如收到一封朋友写的信，和家人一起吃饭，或是和朋友一起出去玩耍。这些小确幸让我们的生活更加丰富，让我们拥有更多的快乐。

# 生活中的小确幸

生活中有许多小确幸，比如收到一封朋友写的信，和家人一起吃饭，或是和朋友一起出去玩耍。这些小确幸让我们的生活更加丰富，让我们拥有更多的快乐。

# 生活中的小确幸

生活中有许多小确幸，比如收到一封朋友写的信，和家人一起吃饭，或是和朋友一起出去玩耍。这些小确幸让我们的生活更加丰富，让我们拥有更多的快乐。

```json
{
  "scripts": {
    "dev": "nodemon index.js",
    "migration:down": "node util/rollback.js" // highlight-line
  },
}
```

<!-- So we can now undo the previous migration by running _npm run migration:down_ from the command line.-->
所以我们现在可以从命令行执行`npm run migration:down`来撤销之前的迁移。

<!-- Migrations are currently executed automatically when the program is started. In the development phase of the program, it might sometimes be more appropriate to disable the automatic execution of migrations and make migrations manually from the command line.-->
程序启动时当前会自动执行迁移操作。在程序的开发阶段，有时可能更合适地禁用自动执行迁移，并从命令行手动执行迁移。

<!-- The current code for the application is in its entirety on [GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-7), branch <i>part13-7</i>.-->
当前应用程序的代码完整地存放在[GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-7)上，分支为<i>part13-7</i>。

</div>

<div class="tasks">

### Tasks 13.17-13.18.

#### Task 13.17.

<!-- Delete all tables from your application's database.-->
从你的应用程序的数据库中删除所有表。

<!-- Make a migration that initializes the database. Add <i>created\_at</i> and <i>updated\_at</i> [timestamps](https://sequelize.org/master/manual/model-basics.html#timestamps) for both tables. Keep in mind that you will have to add them in the migration yourself.-->
创建一个迁移来初始化数据库。为两张表添加<i>created\_at</i>和<i>updated\_at</i> [时间戳](https://sequelize.org/master/manual/model-basics.html#timestamps)。请记住，你必须在迁移中自己添加它们。

<!-- **NOTE:** be sure to remove the commands <i>User.sync()</i> and <i>Blog.sync()</i>, which synchronizes the models'' schemas from your code, otherwise your migrations will fail.-->
**注意：**一定要把命令<i>User.sync()</i>和<i>Blog.sync()</i>从你的代码中移除，否则你的迁移就会失败，这些命令是用来同步模型的架构的。

<!-- **NOTE2:** if you have to delete tables from the command line (i.e. you don''t do the deletion by undoing the migration), you will have to delete the contents of the <i>migrations</i> table if you want your program to perform the migrations again.-->
**注意2：** 如果你不得不从命令行删除表（即你不通过迁移来删除），如果你想让你的程序再次执行迁移，你将不得不删除<i>migrations</i>表中的内容。

#### Task 13.18.

<!-- Expand your application (by migration) so that the blogs have a year written attribute, i.e. a field <i>year</i> which is an integer at least equal to 1991 but not greater than the current year. Make sure the application gives an appropriate error message if an incorrect value is attempted to be given for a year written.-->
(透过迁移)扩展您的应用程序，使博客具有一个年份属性，即<i>年份</i>字段，该字段的整数值至少等于1991，但不大于当前年份。确保应用程序在尝试给出错误的年份值时给出适当的错误信息。

</div>

<div class="content">

### Many-to-many relationships

<!-- We will continue to expand the application so that each user can be added to one or more <i>teams</i>.-->
我们将继续扩展这个应用，以便每个用户可以加入一个或多个<i>团队</i>。

<!-- Since an arbitrary number of users can join one team, and one user can join an arbitrary number of teams, we are dealing with a [many-to-many](https://sequelize.org/master/manual/assocs.html#many-to-many-relationships) relationship, which is traditionally implemented in relational databases using a <i>connection table</i>.-->
由于任意数量的用户可以加入一个团队，而一个用户可以加入任意数量的团队，我们正在处理一种[多对多](https://sequelize.org/master/manual/assocs.html#many-to-many-relationships)关系，传统上使用<i>连接表</i>在关系数据库中实现。

<!-- Let's now create the code needed for the teams table as well as the connection table. The migration (saved in file <i>20211209\_02\_add\_teams\_and\_memberships.js</i>) is as follows:-->
\# 创建teams表和connection表所需的代码
\# 迁移文件（存储在<i>20211209\_02\_add\_teams\_and\_memberships.js</i>中）如下：

```js
const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
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
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('teams')
    await queryInterface.dropTable('memberships')
  },
}
```

<!-- The models contain almost the same code as the migration. The team model in <i>models/team.js</i>:-->
模型几乎包含与迁移相同的代码。<i>models/team.js</i>中的团队模型：

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

<!-- The model for the connection table in <i>models/membership.js</i>:-->
模型在<i>models/membership.js</i>中的连接表：

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
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'membership'
})

module.exports = Membership
```

<!-- So we have given the connection table a name that describes it well, <i>membership</i>. There is not always a relevant name for a connection table, in which case the name of the connection table can be a combination of the names of the tables that are joined, e.g. <i>user\_teams</i> could fit our situation.-->
因此，我们给连接表起了一个描述性的名字<i>membership</i>。有时候连接表没有相关的名字，这种情况下，连接表的名字可以由被连接的表的名字组合而成，例如<i>user\_teams</i>可以适用于我们的情况。

<!-- We make a small addition to the <i>models/index.js</i> file to connect teams and users at the code level using the [belongsToMany](https://sequelize.org/master/manual/assocs.html#implementation-3) method.-->
我们在<i>models/index.js</i>文件中加入一小部分代码，使用[belongsToMany](https://sequelize.org/master/manual/assocs.html#implementation-3)方法在代码层面上连接团队和用户。

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
  Note, User, Team, Membership // highlight-line
}

```

<!-- Note the difference between the migration of the connection table and the model when defining foreign key fields. During the migration, fields are defined in snake case form:-->
在定义外键字段时，注意连接表和模型的迁移之间的区别。 在迁移期间，字段以蛇形格式定义：

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

<!-- in the model, the same fields are defined in camel case:-->
在模型中，同一字段以驼峰式定义：

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

<!-- Now let's create a couple of teams from the psql console, as well as a few memberships:-->
现在让我们从psql控制台创建一些团队以及一些成员：

```js
insert into teams (name) values ('toska');
insert into teams (name) values ('mosa climbers');
insert into memberships (user_id, team_id) values (1, 1);
insert into memberships (user_id, team_id) values (1, 2);
insert into memberships (user_id, team_id) values (2, 1);
insert into memberships (user_id, team_id) values (3, 2);
```

<!-- Information about users'' teams is then added to route for retrieving all users-->
and their teams

用户的团队信息然后被添加到路由，以便检索所有用户及其团队。

```js
router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: [
      {
        model: Note,
        attributes: { exclude: ['userId'] }
      },
      // highlight-start
      {
        model: Team,
        attributes: ['name', 'id'],
      }
      // highlight-end
    ]
  })
  res.json(users)
})
```

<!-- The most observant will notice that the query printed to the console now combines three tables.-->
最细心的人会注意到，现在打印到控制台的查询现在结合了三个表。

<!-- The solution is pretty good, but there's a beautiful flaw in it. The result also comes with the attributes of the corresponding row of the connection table, although we do not want this:-->
解决方案相当不错，但它存在一个漂亮的缺陷。结果也包括连接表的相应行的属性，尽管我们不想要这样：

![](../../images/13/3.png)


<!-- By carefully reading the documentation, you can find a [solution](https://sequelize.org/master/manual/advanced-many-to-many.html#specifying-attributes-from-the-through-table):-->
通过仔细阅读文档，您可以找到[解决方案](https://sequelize.org/master/manual/advanced-many-to-many.html#specifying-attributes-from-the-through-table)：

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

<!-- The current code for the application is in its entirety on [GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-8), branch <i>part13-8</i>.-->
当前应用程序的代码完整地存放在[GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-8)上，分支为<i>part13-8</i>。

### Note on the properties of Sequelize model objects

<!-- The specification of our models is shown by the following lines:-->
以下行显示了我们模型的规格：

```js
User.hasMany(Note)
Note.belongsTo(User)

User.belongsToMany(Team, { through: Membership })
Team.belongsToMany(User, { through: Membership })
```

<!-- These allow Sequelize to make queries that retrieve, for example, all the notes of users, or all members of a team.-->
这些允许Sequelize进行查询，例如，检索所有用户的笔记或所有团队成员。

<!-- Thanks to the definitions, we also have direct access to, for example, the user's notes in the code. In the following code, we will search for a user with id 1 and print the notes associated with the user:-->
感谢这些定义，我们也可以直接访问代码中的用户笔记。在下面的代码中，我们将搜索具有id 1的用户并打印与用户关联的笔记：

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

<!-- The <i>User.hasMany(Note)</i> definition therefore attaches a <i>notes</i> property to the <i>user</i> object, which gives access to the notes made by the user. The <i>User.belongsToMany(Team, { through: Membership }))</i> definition similarly attaches a <i>teams</i> property to the <i>user</i> object, which can also be used in the code:-->
<i>User.hasMany(Note)</i>定义因此将一个<i>notes</i>属性附加到<i>user</i>对象，它可以访问用户创建的笔记。 <i>User.belongsToMany(Team, { through: Membership }))</i>定义同样将一个<i>teams</i>属性附加到<i>user</i>对象，它也可以在代码中使用：

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

<!-- Suppose we would like to return a JSON object from the single user's route containing the user's name, username and number of notes created. We could try the following:-->
假设我们想从单个用户的路由返回一个JSON对象，其中包含用户的姓名，用户名和创建的笔记数量。我们可以尝试以下内容：
```
{
    name: 'John Doe',
    username: 'johndoe',
    notesCreated: 5
}
```
```
{
    name: 'John Doe',
    username: 'johndoe',
    notesCreated: 5
}
```

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

<!-- So, we tried to add the <i>noteCount</i> field on the object returned by Sequelize and remove the <i>notes</i> field from it. However, this approach does not work, as the objects returned by Sequelize are not normal objects where the addition of new fields works as we intend.-->
所以，我们试图在Sequelize返回的对象上添加<i>noteCount</i>字段，并从中删除<i>notes</i>字段。然而，这种方法不起作用，因为Sequelize返回的对象不是普通对象，添加新字段的方式不符合我们的预期。

<!-- A better solution is to create a completely new object based on the data retrieved from the database:-->
一个更好的解决方案是基于从数据库检索的数据创建一个完全新的对象：

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
### Revisiting many-to-many relationships

<!-- Let's make another many-to-many relationship in the application. Each note is associated to the user who created it by a foreign key. It is now decided that the application also supports that the note can be associated with other users, and that a user can be associated with an arbitrary number of notes created by other users. The idea is that these notes are those that the user has <i>marked</i> for himself.-->
让我们在应用程序中再建立一个多对多的关系。每个笔记都通过外键与创建它的用户相关联。现在决定应用程序也支持笔记可以与其他用户相关联，并且一个用户可以与任意数量的其他用户创建的笔记相关联。这个想法是这些笔记是用户<i>标记</i>给自己的。

<!-- Let's make a connection table <i>user\_notes</i> for the situation. The migration, that is saved in file <i>20211209\_03\_add\_user\_notes.js</i> is straightforward:-->
让我们为这种情况创建一个连接表<i>user\_notes</i>。保存在文件<i>20211209\_03\_add\_user\_notes.js</i>中的迁移很简单：

```js
const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
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
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('user_notes')
  },
}
```

<!-- Also, there is nothing special about the model:-->
此外，关于这个模型没有什么特别的。

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
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  noteId: {
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

<!-- The file <i>models/index.js</i>, on the other hand, comes with a slight change to what we saw before:-->
<i>models/index.js</i>，另一方面，有稍微改变了我们之前看到的：

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

<!-- Once again <i>belongsToMany</i> is used, which now links users to notes via the <i>UserNotes</i> model corresponding to the connection table. However, this time we give an <i>alias name</i> for the attribute formed using the keyword [as](https://sequelize.org/master/manual/advanced-many-to-many.html#aliases-and-custom-key-names), the default name (a user's <i>notes</i>) would overlap with its previous meaning, i.e. notes created by the user.-->
再次使用<i>belongsToMany</i>，它现在通过<i>UserNotes</i>模型将用户与笔记链接起来，这是一个连接表。但是，这次我们使用关键字[as]给属性起了一个<i>别名</i>，默认的名字（用户的<i>笔记</i>）与其先前的含义重叠，即用户创建的笔记。

<!-- We extend the route for an individual user to return the user's teams, their own notes, and other notes marked by the user:-->
我们延长了一个个人用户的路由，以返回用户的团队、他们自己的笔记以及用户标记的其他笔记：

```js
router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: [''] } ,
    include:[{
        model: Note,
        attributes: { exclude: ['userId'] }
      },
      {
        model: Note,
        as: 'marked_notes',
        attributes: { exclude: ['userId']},
        through: {
          attributes: []
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

<!-- In the context of the include, we must now use the alias name <i>marked\_notes</i> which we have just defined with the <i>as</i> attribute.-->
在include的上下文中，我们现在必须使用我们刚刚使用<i>as</i>属性定义的别名<i>marked\_notes</i>。

<!-- In order to test the feature, let's create some test data in the database:-->
为了测试这个功能，让我们在数据库中创建一些测试数据：

```sql
insert into user_notes (user_id, note_id) values (1, 4);
insert into user_notes (user_id, note_id) values (1, 5);
```

<!-- The end result is functional:-->
最终结果是实用的：

![](../../images/13/5a.png)

<!-- What if we wanted to include information about the author of the note in the notes marked by the user as well? This can be done by adding an <i>include</i> to the marked notes:-->
如果我们想在用户标记的笔记中也包含有关笔记作者的信息，可以通过在标记的笔记中添加一个<i>include</i>来实现：

```js
router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: [''] } ,
    include:[{
        model: Note,
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


<!-- The end result is as desired:-->
最终结果如期望的那样：

![](../../images/13/4.png)

<!-- The current code for the application is in its entirety on [GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-9), branch <i>part13-9</i>.-->
当前应用程序的代码完整地存放在[GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-9)上，分支为<i>part13-9</i>。


</div>

<div class="tasks">

### Tasks 13.19.-13.23.

#### Task 13.19.

<!-- Give users the ability to add blogs on the system to a <i>reading list</i>. When added to the reading list, the blog should be in the <i>unread</i> state. The blog can later be marked as <i>read</i>. Implement the reading list using a connection table. Make database changes using migrations.-->
给用户在系统上添加博客到<i>阅读列表</i>的能力。当添加到阅读列表时，博客应处于<i>未读</i>状态。稍后可以将博客标记为<i>已读</i>。使用连接表实现阅读列表。使用迁移进行数据库更改。

<!-- In this task, adding to a reading list and displaying the list need not be successful other than directly using the database.-->
在这个任务中，除了直接使用数据库外，对阅读清单进行添加和显示也不一定能成功。

#### Exercise 13.20.

<!-- Now add functionality to the application to support the reading list.-->
现在为应用程序添加功能以支持阅读列表。

<!-- Adding a blog to the reading list is done by making an HTTP POST to the path <i>/api/readinglists</i>, the request will be accompanied with the blog and user id:-->
向阅读列表添加博客是通过向路径<i>/api/readinglists</i>发出HTTP POST请求来完成的，该请求将伴随着博客和用户ID：

```js
{
  "blogId": 10,
  "userId": 3
}
```

<!-- Also modify the individual user route _GET /api/users/:id_ to return not only the user's other information but also the reading list, e.g. in the following format:-->
也修改单个用户路由_GET /api/users/:id_，不仅返回用户的其他信息，还返回阅读列表，例如以下格式：

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

<!-- At this point, information about whether the blog is read or not does not need to be available.-->
此时，不需要提供博客是否被阅读的信息。

#### Task 13.21.

<!-- Expand the single-user route so that each blog in the reading list shows also whether the blog has been read <i>and</i> the id of the corresponding join table row.-->
扩展单用户路由，以便每个博客列表中的博客也显示是否已经阅读<i>和</i>相应的连接表行的id。

<!-- For example, the information could be in the following form:-->
例如，信息可以以以下形式呈现：

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
          id: 3
        }
      ]
    }
  ]
}
```

<!-- Note: there are several ways to implement this functionality. [This](https://sequelize.org/master/manual/advanced-many-to-many.html#the-best-of-both-worlds--the-super-many-to-many-relationship) should help.-->
注意：有几种方法可以实现此功能。[这里](https://sequelize.org/master/manual/advanced-many-to-many.html#the-best-of-both-worlds--the-super-many-to-many-relationship)应该可以帮助。

<!-- Note also that despite having an array field <i>readinglists</i> in the example, it should always just contain exactly one object, the join table entry that connects the book to the particular user's reading list.-->
注意，尽管在示例中有一个数组字段<i>readinglists</i>，但它应始终只包含一个对象，即连接书籍到特定用户的阅读列表的联接表条目。

#### Exercise 13.22.

<!-- Implement functionality in the application to mark a blog in the reading list as read. Marking as read is done by making a request to the _PUT /api/readinglists/:id_ path, and sending the request with-->
a _status_ field set to _read_.

实现在应用中标记博客在阅读列表已读的功能。标记为已读通过发出 _PUT /api/readinglists/:id_ 路径的请求，并将 _status_ 字段设置为 _read_。

```js
{ "read": true }
```

<!-- The user can only mark the blogs in their own reading list as read. The user is identified as usual from the token accompanying the request.-->
用户只能标记自己阅读列表中的博客为已读。通常会通过附带的令牌来识别用户。

#### Exercise 13.23.

<!-- Modify the route that returns a single user's information so that the request can control which of the blogs in the reading list are returned:-->
修改返回单个用户信息的路由，以便请求可以控制哪些博客在阅读列表中被返回：

<!-- - _GET /api/users/:id_ returns the entire reading list-->
for the user

GET /api/users/:id 返回用户的整个阅读列表
<!-- - _GET /api/users/:id?read=true_ returns blogs that have been read-->
GET /api/users/:id?read=true 返回已被阅读的博客
<!-- - _GET /api/users/:id?read=false_ returns blogs that have not been read-->
GET /api/users/:id?read=false 返回尚未阅读的博客

</div>

<div class="content">

### Concluding remarks

<!-- The state of our application is starting to be at least acceptable. However, before the end of the section, let's look at a few more points.-->
我们的应用状态开始至少可以接受了。然而，在本节结束之前，让我们再看一些其他的要点。

#### Eager vs lazy fetch

<!-- When we make queries using the <i>include</i> attribute:-->
当我们使用<i>include</i>属性进行查询时：

```js
User.findOne({
  include: {
    model: note
  }
})
```

<!-- The so-called [eager fetch](https://sequelize.org/master/manual/assocs.html#basics-of-queries-involving-associations) occurs, i.e. all the rows of the tables attached to the user by the join query, in the example the notes made by the user, are fetched from the database at the same time. This is often what we want, but there are also situations where you want to do a so-called _lazy fetch_, e.g. search for user related teams only if they are needed.-->
所谓的[急切抓取](https://sequelize.org/master/manual/assocs.html#basics-of-queries-involving-associations)就发生了，也就是说，用连接查询将用户附加的表的所有行，在本例中是用户制作的笔记，都从数据库中一次性获取。这通常是我们想要的，但也有一些情况下，您希望执行所谓的_懒惰抓取_，例如仅在需要时才搜索与用户相关的团队。

<!-- Let's now modify the route for an individual user so that it fetches the user's teams only if the query parameter <i>teams</i> is set in the request:-->
让我们现在修改个别用户的路由，以便只有在请求中设置了<i>teams</i>查询参数时，才会获取用户的团队：

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

  // highlight-start
  let teams = undefined

  if (req.query.teams) {
    teams = await user.getTeams({
      attributes: ['name'],
      joinTableAttributes: []
    })
  }

  res.json({ ...user.toJSON(), teams })
  // highlight-end
})
```

<!-- So now, the <i>User.findByPk</i> query does not retrieve teams, but they are retrieved if necessary by the <i>user</i> method <i>getTeams</i>, which is automatically generated by Sequelize for the model object. Similar <i>get</i>- and a few other useful methods [are automatically generated](https://sequelize.org/master/manual/assocs.html#special-methods-mixins-added-to-instances) when defining associations for tables at the Sequelize level.-->
现在，<i>User.findByPk</i> 查询不会检索团队，但如果需要，可以通过用户方法 <i>getTeams</i> 检索，该方法是 Sequelize 为模型对象自动生成的。在 Sequelize 层面定义表的关联时，会自动生成类似<i>get</i>的一些有用方法[见此](https://sequelize.org/master/manual/assocs.html#special-methods-mixins-added-to-instances)。

#### Features of models

<!-- There are some situations where, by default, we do not want to handle all the rows of a particular table. One such case could be that we don''t normally want to display users that have been <i>disabled</i> in our application. In such a situation, we could define the default [scopes](https://sequelize.org/master/manual/scopes.html) for the model like this:-->
在某些情况下，我们默认不想处理特定表的所有行。一个例子可能是我们通常不想在应用程序中显示<i>已禁用</i>的用户。在这种情况下，我们可以像这样定义模型的默认[scopes](https://sequelize.org/master/manual/scopes.html)：

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

<!-- Now the query caused by the function call <i>User.findAll()</i> has the following WHERE condition:-->
现在由函数调用<i>User.findAll()</i>引起的查询具有以下WHERE条件：

```
WHERE "user". "disabled" = false;
```

<!-- For models, it is possible to define other scopes as well:-->
对于模型来说，也可以定义其他范围：

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

<!-- Scopes are used as follows:-->
# 以下是使用 Scope 的方法：

```js
// all admins
const adminUsers = await User.scope('admin').findAll()

// all inactive users
const disabledUsers = await User.scope('disabled').findAll()

// users with the string jami in their name
const jamiUsers = User.scope({ method: ['name', '%jami%'] }).findAll()
```

<!-- It is also possible to chain scopes:-->
也可以链接scopes：

```js
// admins with the string jami in their name
const jamiUsers = User.scope('admin', { method: ['name', '%jami%'] }).findAll()
```

<!-- Since Sequelize models are normal [JavaScript classes](https://sequelize.org/master/manual/model-basics.html#taking-advantage-of-models-being-classes), it is possible to add new methods to them.-->
因为Sequelize模型是正常的[JavaScript类](https://sequelize.org/master/manual/model-basics.html#taking-advantage-of-models-being-classes)，所以可以向它们添加新的方法。

<!-- Here are two examples:-->
1. 

**English:** He likes to play basketball.

**Chinese:** 他喜欢打篮球。

```js
const { Model, DataTypes, Op } = require('sequelize') // highlight-line

const Note = require('./note')
const { sequelize } = require('../util/db')

class User extends Model {
  // highlight-start
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
  // highlight-end
}

User.init({
  // ...
})

module.exports = User
```

<!-- The first of the methods <i>numberOfNotes</i> is an <i>instance method</i>, meaning that it can be called on instances of the model:-->
第一种方法<i>numberOfNotes</i> 是一个<i>实例方法</i>，意思是它可以被模型的实例调用：

```js
const jami = await User.findOne({ name: 'Jami Kousa'})
const cnt = await jami.number_of_notes()
console.log(`Jami has created ${cnt} notes`)
```

<!-- Within the instance method, the keyword <i>this</i> therefore refers to the instance itself:-->
在实例方法中，关键字<i>this</i>因此指的是实例本身：

```js
async number_of_notes() {
  return (await this.getNotes()).length
}
```

<!-- The second of the methods, which returns those users who have at least <i>X</i>, the number specified by the parameter, amount of notes is a <i>class method</i>, i.e. it is called directly on the model:-->
第二种方法，它返回拥有至少<i>X</i>，即参数指定的数量的笔记的用户，是一种<i>类方法</i>，即直接在模型上调用：

```js
const users = await User.with_notes(2)
console.log(JSON.stringify(users, null, 2))
users.forEach(u => {
  console.log(u.name)
})
```

#### Repeatability of models and migrations

<!-- We have noticed that the code for models and migrations is very repetitive. For example, the model of teams-->
should have the same code as the model of players.

我们注意到模型和迁移的代码非常重复。例如，团队的模型应该和球员的模型有相同的代码。

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

<!-- and migration contain much of the same code-->
中文：迁移包含大量相同的代码。

```js
const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
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
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('teams')
  },
}
```

<!-- Couldn''t we optimize the code so that, for example, the model exports the shared parts needed for the migration?-->
**难道我们不能优化代码，比如模型导出迁移所需的共享部分吗？**

<!-- However, the problem is that the definition of the model may change over time, for example the <i>name</i> field may change or its data type may change. Migrations must be able to be performed successfully at any time from start to end, and if the migrations are relying on the model to have certain content, it may no longer be true in a month or a year's time. Therefore, despite the "copy paste", the migration code should be completely separate from the model code.-->
然而，问题在于模型的定义可能会随时间变化，例如<i>name</i>字段可能会改变或其数据类型可能会改变。迁移必须能够在任何时候从开始到结束成功执行，如果迁移依赖于模型具有某些内容，则一个月或一年后可能不再成立。因此，尽管有“复制粘贴”，但迁移代码应完全独立于模型代码。

<!-- One solution would be to use Sequelize's [command line tool](https://sequelize.org/master/manual/migrations.html#creating-the-first-model--and-migration-), which generates both models and migration files based on commands given at the command line. For example, the following command would create a <i>User</i> model with <i>name</i>, <i>username</i>, and <i>admin</i> as attributes, as well as the migration that manages the creation of the database table:-->
一种解决方案是使用Sequelize的[命令行工具](https://sequelize.org/master/manual/migrations.html#creating-the-first-model--and-migration-)，它基于命令行给出的命令生成模型和迁移文件。例如，以下命令将创建一个<i>User</i>模型，具有<i>name</i>、<i>username</i>和<i>admin</i>作为属性，以及管理数据库表创建的迁移：

```
npx sequelize-cli model:generate --name User --attributes name:string,username:string,admin:boolean
```

<!-- From the command line, you can also run rollbacks, i.e. undo migrations. The command line documentation is unfortunately incomplete and in this course we decided to do both models and migrations manually. The solution may or may not have been a wise one.-->
从命令行，您还可以运行回滚，即撤消迁移。不幸的是，命令行文档不完整，在本课程中，我们决定手动完成模型和迁移。该解决方案可能是明智的，也可能不是。

</div>

<div class="tasks">

### Task 13.24.

#### Task 13.24.

<!-- Grand finale: [towards the end of part 4](/en/part4/token_authentication#problems-of-token-based-authentication) there was mention of a token-criticality problem: if a user's access to the system is decided to be revoked, the user may still use the token in possession to use the system.-->
最终结局：[在第四章节末尾](/en/part4/token_authentication#problems-of-token-based-authentication)提到了一个令牌关键性问题：如果某用户被决定撤销访问系统的权限，该用户仍可以使用所拥有的令牌来使用系统。

<!-- The usual solution to this is to store a record of each token issued to the client in the backend database, and to check with each request whether access is still valid. In this case, the validity of the token can be removed immediately if necessary. Such a solution is often referred to as a <i>server-side session</i>.-->
通常的解决方案是在后端数据库中存储每个客户端发出的令牌的记录，并在每次请求时检查访问是否仍然有效。在这种情况下，如果有必要，可以立即删除令牌的有效性。这种解决方案通常被称为<i>服务器端会话</i>。

<!-- Now expand the system so that the user who has lost access will not be able to perform any actions that require login.-->
现在扩展系统，使失去访问权限的用户无法执行任何需要登录的操作。

<!-- You will probably need at least the following for the implementation-->
你可能至少需要以下内容来实施
<!-- - a boolean value column in the user table to indicate whether the user is disabled-->
在用户表中添加一个布尔值列来表示用户是否被禁用
<!--   - it is sufficient to disable and enable users directly from the database-->
- 直接从数据库中禁用和启用用户就足够了
<!-- - a table that stores active sessions-->
一张存储活动会话的表
<!--   - a session is stored in the table when a user logs in, i.e. operation _POST /api/login_-->
当用户登录时，会在表中存储一个会话，即操作 _POST /api/login_
<!--   - the existence (and validity) of the session is always checked when the user makes an operation that requires login-->
用户进行需要登录的操作时，总是检查会话的存在（和有效性）。
<!-- - a route that allows the user to "log out" of the system, i.e. to practically remove active sessions from the database, the route can be e.g. _DELETE /api/logout_-->
一条允许用户“注销”系统的路由，即从数据库中删除活动会话，该路由可以是_DELETE /api/logout_

<!-- Keep in mind that actions requiring login should not be successful with an "expired token", i.e. with the same token after logging out.-->
请记住，需要登录的操作在使用"过期令牌"时不应该成功，也就是在登出后使用同一个令牌。

<!-- You may also choose to use some purpose-built npm library to handle sessions.-->
你也可以选择使用一些专门用于处理会话的npm库。

<!-- Make the database changes required for this task using migrations.-->
使用迁移来完成此任务所需的数据库更改。

### Submitting exercises and getting the credits

<!-- Exercises of this part are submitted just like in the previous parts, but unlike parts 0 to 7, the submission goes to an own [course instance](https://studies.cs.helsinki.fi/stats/courses/fs-psql). Remember that you have to finish all the exercises to pass this part!-->
这部分的练习和之前的部分一样提交，但不像第0到7部分，提交的内容放到自己的[课程实例](https://studies.cs.helsinki.fi/stats/courses/fs-psql)上。记住，你必须完成所有练习才能通过这一部分！

<!-- Once you have completed the exercises and want to get the credits, let us know through the exercise submission system that you have completed the course:-->
一旦您完成了练习，并想要获得学分，请通过练习提交系统告知我们您已经完成了课程：

![Submissions](../../images/11/21.png)

<!-- **Note** that you need a registration to the corresponding course part for getting the credits registered, see [here](/en/part0/general_info#parts-and-completion) for more information.-->
**注意**：您需要注册相应的课程部分才能获得学分，有关更多信息，请参阅[这里](/en/part0/general_info#parts-and-completion)。

</div>
