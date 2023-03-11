---
mainImage: ../../../images/part-13.svg
part: 13
letter: c
lang: zh
---

<div class="content">

### Migrations

<!-- Let's keep expanding the backend. We want to implement support for allowing users with <i>admin status</i> to put users of their choice in disabled mode, preventing them from logging in and creating new notes. In order to implement this, we need to add boolean fields to the users' database table indicating whether the user is an admin and whether the user is disabled.-->
 让我们继续扩展后端。我们想实现对允许具有<i>管理员身份</i>的用户将他们选择的用户置于禁用模式的支持，防止他们登录和创建新的笔记。为了实现这一点，我们需要在用户的数据库表中添加布尔字段，表明用户是否是管理员和用户是否被禁用。

<!-- We could proceed as before, i.e. change the model that defines the table and rely on Sequelize to synchronize the changes to the database. This is specified by these lines in the file <i>models/index.js</i>-->
 我们可以像以前那样进行，即改变定义该表的模型，并依靠Sequelize将变化同步到数据库中。这是由文件<i>models/index.js</i>中的这几行指定的。

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
 然而，从长远来看，这种方法是没有意义的。让我们删除这些进行同步的行，转而使用一种更稳健的方式，即Sequelize（和许多其他库）提供的[migrations](https://sequelize.org/master/manual/migrations.html)。

<!-- In practice, a migration is a single JavaScript file that describes some modification to a database. A separate migration file is created for each single or multiple changes at once. Sequelize keeps a record of which migrations have been performed, i.e. which changes caused by the migrations are synchronized to the database schema. When creating new migrations, Sequelize keeps up to date on which changes to the database schema are yet to be made. In this way, changes are made in a controlled manner, with the program code stored in version control.-->
 在实践中，迁移是一个单一的JavaScript文件，描述了对数据库的一些修改。一个单独的迁移文件是为每一个单一的或多个变化一次性创建的。Sequelize会记录哪些迁移已经被执行，也就是说，哪些由迁移引起的变化被同步到了数据库模式中。当创建新的迁移时，Sequelize会及时了解哪些数据库模式的变化还没有进行。通过这种方式，修改是以一种可控的方式进行的，程序代码存储在版本控制中。

<!-- First, let's create a migration that initializes the database. The code for the migration is as follows-->
 首先，让我们创建一个初始化数据库的迁移。迁移的代码如下

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
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('notes')
    await queryInterface.dropTable('users')
  },
}
```

<!-- The migration file [defines](https://sequelize.org/master/manual/migrations.html#migration-skeleton) the functions <i>up</i> and <i>down</i>, the first of which defines how the database should be modified when the migration is performed. The function <i>down</i> tells you how to undo the migration if there is a need to do so.-->
 迁移文件[定义](https://sequelize.org/master/manual/migrations.html#migration-skeleton)了函数<i>up</i>和<i>down</i>，其中第一个函数定义了在执行迁移时应该如何修改数据库。函数<i>down</i>告诉你，如果有必要，如何撤销迁移。

<!-- Our migration contains three operations, the first creates a <i>notes</i> table, the second creates a <i>users</i> table and the third adds a foreign key to the <i>notes</i> table referencing the creator of the note. Changes in the schema are defined by calling the [queryInterface](https://sequelize.org/master/manual/query-interface.html) object methods.-->
 我们的迁移包含三个操作，第一个创建一个<i>notes</i>表，第二个创建一个<i>users</i>表，第三个给<i>notes</i>表添加一个外键，引用笔记的创建者。模式中的变化是通过调用[queryInterface](https://sequelize.org/master/manual/query-interface.html)对象方法来定义的。

<!-- When defining migrations, it is essential to remember that unlike models, column and table names are written in snake case form:-->
 在定义迁移时，一定要记住，与模型不同，列名和表名是以蛇形大小写的形式书写的。

```js
await queryInterface.addColumn('notes', 'user_id', { // highlight-line
  type: DataTypes.INTEGER,
  allowNull: false,
  references: { model: 'users', key: 'id' },
})
```

<!-- So in migrations, the names of the tables and columns are written exactly as they appear in the database, while models use Sequelize's default camelCase naming convention.-->
 所以在迁移中，表和列的名字是按照它们在数据库中出现的样子写的，而模型则使用Sequelize's默认的camelCase命名规则。

<!-- Save the migration code in the file <i>migrations/20211209\_00\_initialize\_notes\_and\_users.js</i>. Migration file names should always be named alphabetically when created so that previous changes are always before newer changes. One good way to achieve this order is to start the migration file name with the date and a sequence number.-->
 将迁移代码保存在文件<i>migrations/20211209\_00\_initialize\_notes\_and\_users.js</i>。迁移文件名在创建时应该总是按字母顺序命名，这样以前的修改总是在新的修改之前。实现这种顺序的一个好方法是在迁移文件名中以日期和序列号开始。

<!-- We could run the migrations from the command line using the [Sequelize command line tool](https://github.com/sequelize/cli). However, we choose to perform the migrations manually from the program code using the [Umzug](https://github.com/sequelize/umzug) library. Let's install the library-->
 我们可以使用[Sequelize命令行工具](https://github.com/sequelize/cli)从命令行中运行迁移。然而，我们选择使用[Umzug](https://github.com/sequelize/umzug)库从程序代码中手动执行迁移。让我们安装这个库

```js
npm install umzug
```

<!-- Let's change the file <i>util/db.js</i> that handles the connection to the database as follows:-->
 让我们修改处理与数据库连接的<i>util/db.js</i>文件，如下所示。

```js
const Sequelize = require('sequelize')
const { DATABASE_URL } = require('./config')
const { Umzug, SequelizeStorage } = require('umzug') // highlight-line

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
    await runMigrations() // highlight-line
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
 执行迁移的<i>runMigrations</i>函数现在会在应用启动时每次打开数据库连接时执行。Sequelize会跟踪哪些迁移已经完成，所以如果没有新的迁移，运行<i>runMigrations</i>函数不会有任何作用。

<!-- Now let's start with a clean slate and remove all existing database tables from the application:-->
 现在让我们从一块干净的石板开始，从应用中删除所有现有的数据库表。

```sql
username => drop table notes;
username => drop table users;
username => \d
Did not find any relations.
```

<!-- Let's start up the application. A message about the migrations status is printed on the log-->
 让我们启动应用。一条关于迁移状态的信息被打印在日志上

```bash
INSERT INTO "migrations" ("name") VALUES ($1) RETURNING "name";
Migrations up to date { files: [ '20211209_00_initialize_notes_and_users.js' ] }
database connected
```

<!-- If we restart the application, the log also shows that the migration was not repeated.-->
 如果我们重新启动应用，日志中也显示迁移没有重复。

<!-- The database schema of the application now looks like this-->
 应用的数据库模式现在看起来是这样的

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
 让我们在数据库中创建几个用户，以及一组笔记，之后我们就可以扩展应用了。

<!-- The current code for the application is in its entirety on [GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-6), branch <i>part13-6</i>.-->
 该应用的当前代码全部在[GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-6)，分支<i>part13-6</i>。
### Admin user and user disabling

<!-- So we want to add two boolean fields to the <i>users</i> table-->
 所以我们想在<i>users</i>表中添加两个布尔字段
<!-- - _admin_ tells you whether the user is an admin-->
 - _admin_告诉你该用户是否是一个管理员
<!-- - _disabled_ tells you whether the user is disabled from actions-->
 - _disabled_告诉你该用户是否被禁止行动

<!-- Let's create the migration that modifies the database in the file <i>migrations/20211209\_01\_admin\_and\_disabled\_to\_users.js</i>:-->
 让我们在文件<i>migrations/20211209/01_admin/and/disabled/to/users.js</i>中创建修改数据库的迁移。

```js
const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('users', 'admin', {
      type: DataTypes.BOOLEAN,
      default: false
    })
    await queryInterface.addColumn('users', 'disabled', {
      type: DataTypes.BOOLEAN,
      default: false
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('users', 'admin')
    await queryInterface.removeColumn('users', 'disabled')
  },
}
```

<!-- Make corresponding changes to the model corresponding to the <i>users</i> table:-->
 对<i>users</i>表对应的模型做相应的修改。

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
当代码重新启动时进行新的迁移，模式会按要求进行改变。

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
 并确保登录不再可能发生

![](../../images/13/2.png)

<!-- Let's create a route that will allow an admin to change the status of a user's account:-->
 让我们创建一个路由，允许管理员改变一个用户的账户状态。

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
 使用了两个中间件，第一个叫做<i>tokenExtractor</i>的中间件与创建笔记的路由所使用的相同，即它将解码的令牌放在请求对象的<i>decodedToken</i>域中。第二个中间件<i>isAdmin</i>检查用户是否是管理员，如果不是，请求状态被设置为401，并返回一个适当的错误信息。

<!-- Note how <i>two middleware</i> are chained to the route, both of which are executed before the actual route handler. It is possible to chain an arbitrary number of middleware to a request.-->
 请注意<i>两个中间件</i>是如何被链入路由的，这两个中间件都在实际的路由处理程序之前执行。有可能将任意数量的中间件链接到一个请求。

<!-- The middleware <i>tokenExtractor</i> is now moved to <i>util/middleware.js</i> as it is used from multiple locations.-->
 中间件<i>tokenExtractor</i>现在被移到<i>util/middleware.js</i>，因为它从多个位置被使用。

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
 管理员现在可以通过向_/api/users/jakousa_发出PUT请求来重新启用用户<i>jakousa</i>，该请求带有以下数据。

```js
{
    "disabled": false
}
```

<!-- As noted in [the end of Part 4](/en/part4/token_authentication#problems-of-token-based-authentication), the way we implement disabling users here is problematic. Whether or not the user is disabled is only checked at _login_, if the user has a token at the time the user is disabled, the user may continue to use the same token, since no lifetime has been set for the token and the disabled status of the user is not checked when creating notes.-->
 正如在[第四章节的结尾](/en/part4/token_authentication#problems-of-token-based-authentication)所指出的，我们在这里实现禁用用户的方式是有问题的。用户是否被禁用只在_登录_时检查，如果用户在被禁用时有一个令牌，那么用户可以继续使用同一个令牌，因为没有为令牌设置寿命，而且在创建笔记时没有检查用户的禁用状态。

<!-- Before we proceed, let's make an npm script for the application, which allows us to undo the previous migration. After all, not everything always goes right the first time when developing migrations.-->
 在我们继续之前，让我们为应用做一个npm脚本，它允许我们撤销之前的迁移。毕竟，在开发迁移时，并不是第一次就能顺利进行的。

<!-- Let's modify the file <i>util/db.js</i> as follows:-->
 让我们修改文件<i>util/db.js</i>如下。

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

module.exports = { connectToDatabase, sequelize, rollbackMigration } // highlight-line
```

<!-- Let's create a file <i>util/rollback.js</i>, which will allow the npm script to execute the specified migration rollback function:-->
 让我们创建一个文件<i>util/rollback.js</i>，它将允许npm脚本执行指定的迁移回滚功能。

```js
const { rollbackMigration } = require('./db')

rollbackMigration()
```

<!-- and the script itself:-->
 和脚本本身。

```json
{
  "scripts": {
    "dev": "nodemon index.js",
    "migration:down": "node util/rollback.js" // highlight-line
  },
}
```

<!-- So we can now undo the previous migration by running _npm run migration:down_ from the command line.-->
 所以我们现在可以通过在命令行中运行_npm run migration:down_来撤销之前的迁移。

<!-- Migrations are currently executed automatically when the program is started. In the development phase of the program, it might sometimes be more appropriate to disable the automatic execution of migrations and make migrations manually from the command line.-->
 迁移目前是在程序启动时自动执行的。在程序的开发阶段，有时禁用迁移的自动执行，从命令行手动进行迁移可能更合适。

<!-- The current code for the application is in its entirety on [GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-7), branch <i>part13-7</i>.-->
 目前该程序的代码全部在[GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-7)，分支<i>part13-7</i>。

</div>

<div class="tasks">

### Tasks 13.17-13.18.

#### Task 13.17.

<!-- Delete all tables from your application's database.-->
从你的应用的数据库中删除所有表。

<!-- Make a migration that initializes the database. Add <i>created\_at</i> and <i>updated\_at</i> [timestamps](https://sequelize.org/master/manual/model-basics.html#timestamps) for both tables. Keep in mind that you will have to add them in the migration yourself.-->
进行迁移，使数据库初始化。为两个表添加<i>created\_at</i>和<i>updated\_at</i> [timestamps](https://sequelize.org/master/manual/model-basics.html#timestamps)。请记住，你将不得不在迁移中自己添加它们。

<!-- **NOTE:** be sure to remove the commands <i>User.sync()</i> and <i>Blog.sync()</i>, which synchronizes the models' schemas from your code, otherwise your migrations will fail.-->
 **注意：**一定要删除<i>User.sync()</i>和<i>Blog.sync()</i>这两个命令，它们可以从你的代码中同步模型的模式，否则你的迁移将会失败。

<!-- **NOTE2:** if you have to delete tables from the command line (i.e. you don't do the deletion by undoing the migration), you will have to delete the contents of the <i>migrations</i> table if you want your program to perform the migrations again.-->
 **注意2：**如果你必须从命令行中删除表（也就是说，你不是通过撤销迁移来进行删除的），如果你想让你的程序再次执行迁移，你就必须删除<i>migrations</i>表中的内容。

#### Task 13.18.

<!-- Expand your application (by migration) so that the blogs have a year written attribute, i.e. a field <i>year</i> which is an integer at least equal to 1991 but not greater than the current year. Make sure the application gives an appropriate error message if an incorrect value is attempted to be given for a year written.-->
 扩展你的应用（通过迁移），使博客有一个写有年份的属性，即一个字段<i>year</i>，它是一个至少等于1991年但不大于当前年份的整数。确保应用在试图给出一个不正确的年份属性值时给出一个适当的错误信息。

</div>

<div class="content">

### Many-to-many relationships

<!-- We will continue to expand the application so that each user can be added to one or more <i>teams</i>.-->
 我们将继续扩展应用，使每个用户可以被加入一个或多个<i>团队</i>。

<!-- Since an arbitrary number of users can join one team, and one user can join an arbitrary number of teams, we are dealing with a [many-to-many](https://sequelize.org/master/manual/assocs.html#many-to-many-relationships) relationship, which is traditionally implemented in relational databases using a <i>connection table</i>.-->
由于任意数量的用户可以加入一个团队，而一个用户可以加入任意数量的团队，我们正在处理一个[多对多](https://sequelize.org/master/manual/assocs.html#many-to-many-relationships)的关系，传统上这是在关系型数据库中使用<i>连接表</i>来实现。

<!-- Let's now create the code needed for the teams table as well as the connection table. The migration is as follows:-->
 现在让我们为团队表以及连接表创建所需的代码。迁移过程如下。

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
 模型包含的代码几乎与迁移相同。团队模型在<i>models/team.js</i>。

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
 连接表的模型在<i>models/membership.js</i>。

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

<!-- So we have given the connection table a name that describes it well, <i>membership</i>. There is not always a relevant name for a connection table, in which case the name of the connection table can be a combination of the names of the tables that are joined, e.g. <i>user\_teams</i> could fit our situation.-->
 所以我们给连接表起了一个能很好描述它的名字，<i>membership</i>。连接表并不总是有一个相关的名字，在这种情况下，连接表的名字可以是被连接的表的名字的组合，例如，<i>user/_teams</i>可以适合我们的情况。

<!-- We make a small addition to the <i>models/index.js</i> file to connect teams and users at the code level using the [belongsToMany](https://sequelize.org/master/manual/assocs.html#implementation-3) method.-->
 我们对<i>models/index.js</i>文件做了一个小小的补充，使用[belongsToMany](https://sequelize.org/master/manual/assocs.html#implementation-3)方法在代码层连接团队和用户。

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
 注意在定义外键字段时，连接表和模型的迁移是不同的。在迁移过程中，字段是以蛇形的形式定义的。

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
 在模型中，同样的字段是以骆驼的形式定义的。

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

<!-- Now let's create a couple of teams from the console, as well as a few memberships:-->
 现在让我们从控制台创建几个团队，以及一些会员资格。

```js
insert into teams (name) values ('toska');
insert into teams (name) values ('mosa climbers');
insert into memberships (user_id, team_id) values (1, 1);
insert into memberships (user_id, team_id) values (1, 2);
insert into memberships (user_id, team_id) values (2, 1);
insert into memberships (user_id, team_id) values (3, 2);
```

<!-- Information about users' teams is then added to route for retrieving all users-->
关于用户团队的信息将被添加到检索所有用户的路径中

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
最善于观察的人会注意到，打印到控制台的查询现在结合了三个表。

<!-- The solution is pretty good, but there's a beautiful flaw in it. The result also comes with the attributes of the corresponding row of the connection table, although we do not want this:-->
 这个解决方案相当不错，但其中有一个美丽的缺陷。结果还带有连接表相应行的属性，尽管我们并不希望这样。

![](../../images/13/3.png)


<!-- By carefully reading the documentation, you can find a [solution](https://sequelize.org/master/manual/advanced-many-to-many.html#specifying-attributes-from-the-through-table):-->
 通过仔细阅读文档，你可以找到一个[解决方案](https://sequelize.org/master/manual/advanced-many-to-many.html#specifying-attributes-from-the-through-table)。

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
 该应用的当前代码全部在[GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-8)，分支<i>part13-8</i>。

### Note on the properties of Sequelize model objects

<!-- The specification of our models is shown by the following lines:-->
 我们模型的规范由以下几行显示。

```js
User.hasMany(Note)
Note.belongsTo(User)

User.belongsToMany(Team, { through: Membership })
Team.belongsToMany(User, { through: Membership })
```

<!-- These allow Sequelize to make queries that retrieve, for example, all the notes of users, or all members of a team.-->
 这些允许Sequelize进行查询，例如，检索用户的所有笔记，或一个团队的所有成员。

<!-- Thanks to the definitions, we also have direct access to, for example, the user's notes in the code. In the following code, we will search for a user with id 1 and print the notes associated with the user:-->
 由于这些定义，我们也可以直接访问，例如，代码中用户的笔记。在下面的代码中，我们将搜索一个id为1的用户，并打印与该用户相关的笔记。

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
 因此，<i>User.hasMany(Note)</i>定义给<i>user</i>对象附加了一个<i>notes</i>属性，它可以访问该用户的笔记。<i>User. belongsToMany(Team, { through: Membership }))</i>定义同样将一个<i>teams</i>属性附加到<i>user</i>对象，这也可以在代码中使用。

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
 假设我们想从单个用户的路由中返回一个JSON对象，包含用户的名字、用户名和创建的笔记数量。我们可以尝试以下方法。

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
 所以，我们尝试在Sequelize返回的对象上添加<i>noteCount</i>字段，并删除其中的<i>notes</i>字段。然而，这种方法并不奏效，因为Sequelize返回的对象并不是正常的对象，在那里添加新的字段会按照我们的意图工作。

<!-- A better solution is to create a completely new object based on the data retrieved from the database:-->
 一个更好的解决方案是根据从数据库中获取的数据创建一个全新的对象。

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
 让我们在应用中建立另一个多对多的关系。每个笔记都通过一个外键与创建它的用户相关联。现在决定，应用还支持笔记可以与其他用户相关联，并且一个用户可以与其他用户创建的任意数量的笔记相关联。我们的想法是，这些笔记是用户为自己<i>标记的</i>。

<!-- Let's make a connection table <i>user_notes</i> for the situation. The migration is straightforward:-->
 让我们为这种情况制作一个连接表<i>user_notes</i>。迁移是直截了当的。

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
 另外，这个模型也没有什么特别之处。

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
 文件<i>models/index.js</i>，另一方面，与我们之前看到的有一点变化。

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
 再次使用了<i>belongsToMany</i>，现在它通过连接表对应的<i>UserNotes</i>模型将用户与笔记联系起来。然而，这一次我们为使用关键字[as](https://sequelize.org/master/manual/advanced-many-to-many.html#aliases-and-custom-key-names)形成的属性给出了一个<i>别名</i>，默认名称（用户的<i>笔记</i>）将与它之前的含义重叠，即由用户创建的笔记。

<!-- We extend the route for an individual user to return the user's teams, their own notes, and other notes marked by the user:-->
 我们为单个用户扩展了路线，以返回用户的团队、他们自己的笔记，以及由用户标记的其他笔记。

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
 在include的上下文中，我们现在必须使用别名<i>marked\_notes</i>，我们刚刚用<i>as</i>属性定义了它。

<!-- In order to test the feature, let's create some test data in the database:-->
 为了测试这个功能，让我们在数据库中创建一些测试数据。

```sql
insert into user_notes (user_id, note_id) values (1, 4);
insert into user_notes (user_id, note_id) values (1, 5);
```

<!-- The end result is functional:-->
 最终的结果是功能性的。

![](../../images/13/5.png)

<!-- What if we wanted to include information about the author of the note in the notes marked by the user as well? This can be done by adding an <i>include</i> to the marked notes:-->
 如果我们想在用户标记的笔记中也包括关于笔记作者的信息呢？这可以通过在标记的笔记中添加一个<i>include</i>来实现。

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
 最后的结果是如愿以偿。

![](../../images/13/4.png)

<!-- The current code for the application is in its entirety on [GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-9), branch <i>part13-9</i>.-->
 该应用的当前代码全部在[GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-9)，分支<i>part13-9</i>。


</div>

<div class="tasks">

### Tasks 13.19.-13.23.

#### Task 13.19.

<!-- Give users the ability to add blogs on the system to a <i>reading list</i>. When added to the reading list, the blog should be in the <i>unread</i> state. The blog can later be marked as <i>read</i>. Implement the reading list using a connection table. Make database changes using migrations.-->
 让用户有能力将系统中的博客添加到<i>阅读列表</i>。当添加到阅读列表时，该博客应处于<i>未读</i>状态。之后，该博客可以被标记为<i>阅读</i>。使用连接表来实现阅读列表。使用迁移实现数据库的改变。

<!-- In this task, adding to a reading list and displaying the list need not be successful other than directly using the database.-->
 在这个任务中，除了直接使用数据库，添加到阅读列表和显示列表不需要成功。

#### Exercise 13.20.

<!-- Now add functionality to the application to support the reading list.-->
现在给应用添加功能以支持阅读列表。

<!-- Adding a blog to the reading list is done by making an HTTP POST to the path <i>/api/readinglists</i>, the request will be accompanied with the blog and user id:-->
 添加博客到阅读列表是通过对路径<i>/api/readinglists</i>进行HTTP POST，该请求将伴随着博客和用户ID。

```js
{
  "blogId": 10,
  "userId": 3
}
```

<!-- Also modify the individual user route _GET /api/users/:id_ to return not only the user's other information but also the reading list, e.g. in the following format:-->
 同时修改单个用户的路由_GET /api/users/:id_，不仅返回用户的其他信息，也返回阅读列表，例如，格式如下。

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
 在这一点上，关于博客是否被阅读的信息不需要提供。

#### Task 13.21.

<!-- Expand the single-user route so that each blog in the reading list shows also whether the blog has been read <i>and</i> the id of the corresponding connection table row.-->
 扩展单用户路线，使阅读列表中的每个博客也显示该博客是否被阅读<i>和</i>相应连接表行的id。

<!-- For example, the information can be in the following form:-->
 例如，这些信息可以是以下形式。

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

<!-- Note: there are several ways to implement this functionality. [This](https://sequelize.org/master/manual/advanced-many-to-many.html#the-best-of-both-worlds--the-super-many-to-many-relationship) should help.-->
 注意：有几种方法来实现这个功能。[这](https://sequelize.org/master/manual/advanced-many-to-many.html#the-best-of-both-worlds--the-super-many-to-many-relationship)应该有帮助。

#### Exercise 13.22.

<!-- Implement functionality in the application to mark a blog in the reading list as read. Marking as read is done by making a request to the _PUT /api/readinglists/:id_ path, and sending the request with-->
 在应用中实现将阅读列表中的博客标记为已读的功能。标记为已读是通过向_PUT /api/readinglists/:id_路径发出请求来完成的，并在请求中加上

```js
{ "read": true }
```

<!-- The user can only mark the blogs in their own reading list as read. The user is identified as usual from the token accompanying the request.-->
 用户只能将他们自己阅读列表中的博客标记为已读。用户照例从请求附带的标记中被识别出来。

#### Exercise 13.23.

<!-- Modify the route that returns a single user's information so that the request can control which of the blogs in the reading list are returned:-->
 修改返回单个用户信息的路由，使请求可以控制阅读列表中的哪些博客被返回。

<!-- - _GET /api/users/:id_ returns the entire reading list-->
 - _GET /api/users/:id_ 返回整个阅读列表
<!-- - _GET /api/users/:id?read=true_ returns blogs that have been read-->
 - _GET /api/users/:id?read=true_ 返回已经阅读过的博客
<!-- - _GET /api/users/:id?read=false_ returns blogs that have not been read-->
 - _GET /api/users/:id?read=false_ 返回未被阅读的博客。

</div>

<div class="content">

### Concluding remarks

<!-- The state of our application is starting to be at least acceptable. However, before the end of the section, let's look at a few more points.-->
 我们的应用的状态开始至少可以接受。然而，在本节结束前，让我们再看几点。

#### Eager vs lazy fetch

<!-- When we make queries using the <i>include</i> attribute:-->
当我们使用<i>include</i>属性进行查询时。

```js
User.findOne({
  include: {
    model: note
  }
})
```

<!-- The so-called [eager fetch](https://sequelize.org/master/manual/assocs.html#basics-of-queries-involving-associations) occurs, i.e. all the rows of the tables attached to the user by the join query, in the example the notes made by the user, are fetched from the database at the same time. This is often what we want, but there are also situations where you want to do a so-called _lazy fetch_, e.g. search for user related teams only if they are needed.-->
 所谓的[急切获取](https://sequelize.org/master/manual/assocs.html#basics-of-queries-involving-associations)会发生，也就是说，所有通过连接查询连接到用户的表的行，在这个例子中是用户做的笔记，都会同时从数据库获取。这通常是我们想要的，但也有一些情况，你想做一个所谓的_lazy fetch_，例如，只有在需要时才搜索用户相关的团队。

<!-- Let's now modify the route for an individual user so that it fetches the user's teams only if the query parameter <i>teams</i> is set in the request:-->
 现在让我们修改单个用户的路由，以便它只在请求中设置查询参数<i>teams</i>时才获取用户的团队。

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
 所以现在，<i>User.findByPk</i>查询不会检索团队，但如果有必要，它们会被<i>user</i>方法<i>getTeams</i>检索，该方法是由Sequelize为模型对象自动生成。类似的<i>get</i>-和其他一些有用的方法[是自动生成的](https://sequelize.org/master/manual/assocs.html#special-methods-mixins-added-to-instances)，当在Sequelize级别定义表的关联时。

#### Features of models

<!-- There are some situations where, by default, we do not want to handle all the rows of a particular table. One such case could be that we don't normally want to display users that have been <i>disabled</i> in our application. In such a situation, we could define the default [scopes](https://sequelize.org/master/manual/scopes.html) for the model like this:-->
 有些情况下，默认情况下，我们不希望处理某个特定表的所有行。其中一种情况是，我们通常不想在我们的应用中显示已被<i>禁用的用户</i>。在这种情况下，我们可以像这样为模型定义默认的[scopes](https://sequelize.org/master/manual/scopes.html)。

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
 现在由函数调用<i>User.findAll()</i>引起的查询有以下WHERE条件。

```
WHERE "user". "disabled" = false;
```

<!-- For models, it is possible to define other scopes as well:-->
 对于模型，也可以定义其他作用域。

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
作用域的使用方法如下。

```js
// all admins
const adminUsers = await User.scope('admin').findAll()

// all inactive users
const disabledUsers = await User.scope('disabled').findAll()

// users with the string jami in their name
const jamiUsers = User.scope({ method: ['name', '%jami%'] }).findAll()
```

<!-- It is also possible to chain scopes:-->
 也可以连锁作用域。

```js
// admins with the string jami in their name
const jamiUsers = User.scope('admin', { method: ['name', '%jami%'] }).findAll()
```

<!-- Since Sequelize models are normal [JavaScript classes](https://sequelize.org/master/manual/model-basics.html#taking-advantage-of-models-being-classes), it is possible to add new methods to them.-->
 由于Sequelize模型是正常的[JavaScript类](https://sequelize.org/master/manual/model-basics.html#taking-advantage-of-models-being-classes)，所以有可能向它们添加新的方法。

<!-- Here are two examples:-->
 这里有两个例子。

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
 第一个方法<i>numberOfNotes</i>是一个<i>实例方法</i>，意味着它可以在模型的实例中被调用。

```js
const jami = await User.findOne({ name: 'Jami Kousa'})
const cnt = await jami.number_of_notes()
console.log(`Jami has created ${cnt} notes`)
```

<!-- Within the instance method, the keyword <i>this</i> therefore refers to the instance itself:-->
 在实例方法中，关键词<i>this</i>因此指的是实例本身。

```js
async number_of_notes() {
  return (await this.getNotes()).length
}
```

<!-- The second of the methods, which returns those users who have at least <i>X</i>, the number specified by the parameter, amount of notes is a <i>class method</i>, i.e. it is called directly on the model:-->
 第二个方法是返回那些至少有<i>X</i>的用户，这个数字是由参数指定的，笔记的数量是一个<i>类方法</i>，也就是说，它是直接在模型上调用的。

```js
const users = await User.with_notes(2)
console.log(JSON.stringify(users, null, 2))
users.forEach(u => {
  console.log(u.name)
})
```

#### Repeatability of models and migrations

<!-- We have noticed that the code for models and migrations is very repetitive. For example, the model of teams-->
 我们注意到，模型和迁移的代码是非常重复的。例如，团队的模型

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
 和迁移包含了很多相同的代码

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

<!-- Couldn't we optimize the code so that, for example, the model exports the shared parts needed for the migration?-->
 难道我们不能优化代码，比如说，模型导出迁移所需的共享部分？

<!-- However, the problem is that the definition of the model may change over time, for example the <i>name</i> field may change or its data type may change. Migrations must be able to be performed successfully at any time from start to end, and if the migrations are relying on the model to have certain content, it may no longer be true in a month or a year's time. Therefore, despite the "copy paste", the migration code should be completely separate from the model code.-->
 然而，问题是，模型的定义可能会随着时间的推移而改变，例如，<i>name</i>字段可能会改变或其数据类型可能会改变。迁移必须能够在任何时候从头到尾成功执行，如果迁移依赖于模型的某些内容，那么在一个月或一年后，它可能不再是真的。因此，尽管有 "复制粘贴"，迁移代码应该与模型代码完全分开。

<!-- One solution would be to use Sequelize's [command line tool](https://sequelize.org/master/manual/migrations.html#creating-the-first-model--and-migration-), which generates both models and migration files based on commands given at the command line. For example, the following command would create a <i>User</i> model with <i>name</i>, <i>username</i>, and <i>admin</i> as attributes, as well as the migration that manages the creation of the database table:-->
 一个解决方案是使用Sequelize's [命令行工具](https://sequelize.org/master/manual/migrations.html#creating-the-first-model--and-migration-)，它可以根据命令行给出的命令来生成模型和迁移文件。例如，下面的命令将创建一个<i>User</i>模型，并将<i>name</i>、<i>username</i>和<i>admin</i>作为属性，以及管理创建数据库表的迁移。

```
npx sequelize-cli model:generate --name User --attributes name:string,username:string,admin:boolean
```

<!-- From the command line, you can also run rollbacks, i.e. undo migrations. The command line documentation is unfortunately incomplete and in this course we decided to do both models and migrations manually. The solution may or may not have been a wise one.-->
 从命令行中，你也可以运行回滚，即撤销迁移。不幸的是，命令行文档并不完整，在这个课程中，我们决定手动完成模型和迁移。这个解决方案可能是明智的，也可能不是。

</div>

<div class="tasks">

### Task 13.24.

#### Task 13.24.

<!-- Grand finale: [towards the end of part 4](/en/part4/token_authentication#problems-of-token-based-authentication) there was mention of a token-criticality problem: if a user's access to the system is decided to be revoked, the user may still use the token in possession to use the system.-->
 大结局：[在第四章节的末尾](/en/part4/token_authentication#problems-of-token-based-authentication)提到了一个token-criticality问题：如果一个用户对系统的访问被决定撤销，该用户仍然可以使用手中的token来使用该系统。

<!-- The usual solution to this is to store a record of each token issued to the client in the backend database, and to check with each request whether access is still valid. In this case, the validity of the token can be removed immediately if necessary. Such a solution is often referred to as a <i>server-side session</i>.-->
 对此，通常的解决方案是在后台数据库中存储发给客户的每个令牌的记录，并在每次请求时检查访问是否仍然有效。在这种情况下，必要时可以立即删除令牌的有效性。这样的解决方案通常被称为<i>服务器端会话</i>。

<!-- Now expand the system so that the user who has lost access will not be able to perform any actions that require login.-->
 现在扩展系统，使失去访问权的用户无法执行任何需要登录的操作。

<!-- You will probably need at least the following for the implementation-->
 你可能至少需要以下内容来实现
<!-- - a boolean value column in the user table to indicate whether the user is disabled-->
 - 在用户表中有一个布尔值列，以表明用户是否被禁用
<!--   - it is sufficient to disable and enable users directly from the database-->
 - 直接从数据库中禁用和启用用户就足够了
<!-- - a table that stores active sessions-->
 - 一个存储活动会话的表
<!--   - a session is stored in the table when a user logs in, i.e. operation _POST /api/login_-->
 - 当用户登录时, 会话被存储在该表中, 即操作 _POST /api/login_
<!--   - the existence (and validity) of the session is always checked when the user makes an operation that requires login-->
 - 当用户进行需要登录的操作时，会话的存在（和有效性）总是被检查。
<!-- - a route that allows the user to "log out" of the system, i.e. to practically remove active sessions from the database, the route can be e.g. _DELETE /api/logout_-->
 - 一个允许用户 "注销 "系统的路由，即实际上是从数据库中删除活动会话，该路由可以是例如_DELETE /api/logout_。

<!-- Keep in mind that actions requiring login should not be successful with an "expired token", i.e. with the same token after logging out.-->
 请记住，需要登录的操作不应该用 "过期的令牌 "成功，也就是说，在注销后用同样的令牌。

<!-- You may also choose to use some purpose-built npm library to handle sessions.-->
 你也可以选择使用一些特制的npm库来处理sessions。

<!-- Make the database changes required for this task using migrations.-->
 使用迁移来进行这项任务所需的数据库修改。

### Submitting exercises and getting the credits

<!-- Exercises of this part are submitted just like in the previous parts, but unlike parts 0 to 7, the submission goes to an own [course instance](https://studies.cs.helsinki.fi/stats/courses/fs-psql). Remember that you have to finish all the exercises to pass this part!-->
 这一部分的练习就像前几部分一样提交，但与0到7部分不同的是，提交到一个自己的[课程实例](https://studies.cs.helsinki.fi/stats/courses/fs-psql)。请记住，你必须完成所有的练习才能通过这部分!

<!-- Once you have completed the exercises and want to get the credits, let us know through the exercise submission system that you have completed the course:-->
一旦你完成了练习并想获得学分，请通过练习提交系统告诉我们你已经完成了课程。

![Submissions](../../images/11/21.png)

<!-- Note that the "exam done in Moodle" note refers to the [Full Stack Open course's exam](/en/part0/general_info#sign-up-for-the-exam), which has to be completed before you can earn credits from this part.-->
 注意 "在Moodle中完成考试 "的说明是指[全栈开放课程的考试](/en/part0/general_info#sign-up-for-the-exam)，在你从这部分获得学分之前必须完成。

<!-- **Note** that you need a registration to the corresponding course part for getting the credits registered, see [here](/part0/general_info#parts-and-completion) for more information.-->
 **注意**，你需要注册相应的课程部分才能获得学分，更多信息请看[这里](/part0/general_info#parts-and-completion)。

</div>
