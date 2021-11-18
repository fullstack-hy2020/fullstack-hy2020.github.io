---
mainImage: ../../../images/part-13.svg
part: 13
letter: c
lang: en
---

<div class="content">

### Migrations

Let's keep expanding the backend. We want to implement support for allowing users with <i>admin status</i> to put users of their choice in inactive mode, preventing them from logging in and creating new notes. In order to implement these, we need to add a boolean value to the users' database table indicating whether the user is admin and whether the username is inactive.

We could proceed as before, i.e. change the model that defines the table and rely on Sequelize to synchronize the changes to the database. This is what causes the lines in the file <i>models/index.js</i>

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

However, this approach does not make sense in the long run. Let's remove the lines that do the synchronization and move to using a much more robussive way, [migrations](https://sequelize.org/master/manual/migrations.html) provided by Sequelize (and many other libraries).

In practice, a migration is a single JavaScript file that describes some modification to a database. A separate migration file is created for each single or multiple changes at once. Sequelize keeps a record of which migrations have been performed, i.e. which change caused by the migrations is synchronized to the database schema. With the creation of new migrations, Sequelize keeps up to date on which changes to the database schema are yet to be made. In this way, changes are made in a controlled manner, with the program code stored in the version control.

First, a migration is created that takes the database to its current state. The code for the migration is as follows

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

The migration file [defines](https://sequelize.org/master/manual/migrations.html#migration-skeleton) functions <i>up</i> and <i>down</i>, the first of which defines how the database should be modified when the migration is performed. The function <i>down</i> again tells you how to cancel the migration if there is a need to do so.

Our migration contains three operations, the first creates a table <i>notes</i>, the second creates a table <i>users</i> and the third adds a reference key to the table <i>notes</i> for the creator of the note. Changes in the schema are defined by calling the [queryInterface](https://sequelize.org/master/manual/query-interface.html) object methods.

In defining migrations, it is essential to remember that unlike models, column and table names are written in snake case form:

```js
await queryInterface.addColumn('notes', 'user_id', { // highlight-line
  type: DataTypes.INTEGER,
  allowNull: false,
  references: { model: 'users', key: 'id' },
})
```

So in migrations, the names of the tables and columns are written exactly as they enter the database, while models use Sequelize's default camelCase name.

Save the migration code in the file <i>migrations/20211209_00_initialize_notes_and_users.js</i>. Migration file names should be in alphabetical order so that the previous change is always ahead of a newer change in the alphabet. One good way to achieve this order is to start the migration file name with a data and a sequence number.

We could run the migrations from the command line using the [Sequelize command line tool](https://github.com/sequelize/cli). However, we choose to perform the migrations manually from the program code using the [Umzug](https://github.com/sequelize/umzug) library. Let's install the library

```js
npm install umzug
```

Let's change the file <i>utils/db.js</i> that handles the connection to the database as follows:

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

The <i>runMigrations</i> function that performs migrations is now executed every time the application opens a database connection when it starts. Sequelize keeps track of which migrations have already been completed, so if there are no new migrations, running the <i>runMigrations</i> function does nothing.

Now let's start with a clean slate and remove all existing database tables from the application:

```sql
username => drop table notes;
username => drop table users;
username => \d
Did not find any relations.
```

Let's start up the application. A message about migrations status is printed on the log

```bash
INSERT INTO "migrations" ("name") VALUES ($1) RETURNING "name";
Migrations up to date { files: [ '20211209_00_initialize_notes_and_users.js' ] }
database connected
```

If we restart the application, the log also shows that the migration is not being performed.

The database schema of the application now looks like this

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

So Sequelize has created a table <i>migrations</i> that allows it to keep track of the migrations that have been performed. The contents of the table look as follows:

```js
username=> select * from migrations;
                   name
-------------------------------------------
 20211209_00_initialize_notes_and_users.js
```

Let's create a few users in the database, as well as a set of notes, and after that we are ready to expand the application.

The current code for the application is in its entirety in [GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-6), branch <i>part13-6</i>.
### Admin user and user disabling

So we want to add two boolean fields to the <i>users</i> table
- _admin_ tells you whether the user is admin
- _disabled_ again tells you whether the username is set to be banned

Let's create the migration that makes the database instance in the file <i>migrations/20211209_01_admin_and_disabled_to_users.js</i>:

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

Make corresponding changes to the model corresponding to the table <i>users</i>:

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

When a new migration is performed when code restarts, the schema is changed as desired:

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

Now let's expand the controllers as follows. Prevent logging if the user field <i>disabled</i> is already set to <i>true</i>:

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

Let's disable the user's <i>jakousa</i> ID:

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

And make sure that the login is no longer successful

![](../../images/13/2.png)

Let's create a route that will allow admin to change the status of the user's account:

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

There are two middleware used, the first called <i>tokenExtractor</i> is the same as the one used by the note-generating route, i.e. it places the decoded token in the request-object field <i>decodedToken</i>. As the second middleware <i>isAdmin</i> checks whether the user is admin and if not, the request is set to 401 and an appropriate error message is returned.

Note how <i>two middlewares</i> is chained together to the router, both of which are executed before the actual route handler. It is possible to chain middleware to the connection of requests an arbitrary number.

The middleware <i>tokenExtractor</i> is now moved to <i>util/middleware.js</i> as it is used from multiple locations.

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

Admin can now enable the <i>jakousa</i> ID by making a PUT request to /api/users, where the request comes with the following data:

```js
{
    "disabled": false
}
```

As noted in [the end of Part 4](/part4/token_based_login#token-based_login_problems), the way we implement disabling usernames here is problematic. Whether or not the token is disabled is only checked at _login_, if the user is in possession of a token at the time the token is disabled, the user may continue to use the same token, since no lifetime has been set for the token and the fact that the user ID has been disabled is not checked when the notes are being created.

Before we proceed, let's make an npm script for the application, which allows us to cancel the previous migration. Not everything always goes right at the first time when developing migrations.

Let's modify the file <i>util/db.js</i> as follows:

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

Let's create a file <i>util/rollback.js</i>, which will allow the npm script to execute the specified migration rollback function:

```js
const { rollbackMigrations } = require('./db')

rollbackMigrations()
```

and the script itself:

```json
{
    "scripts": {
    "dev": "nodemon index.js",
    "migration:down": "node util/rollback.js" // highlight-line
  },
}
```

So we can now undo the previous migration by running _npm run migration:down_ from the command line.

Migrations are executed automatically when the program is started. In the development phase of the program, it might sometimes be more appropriate to disable the automatic execution of migrations and make migrations manually from the command line.

The current code for the application is in its entirety in [GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-7), branch <i>part13-7</i>.

</div>

<div class="tasks">

### Tasks 13.17-13.18.

#### Task 13.17.

Delete all tables from the application database.

Perform a migration that sets the database to its current state. Create <i>created\_at</i> and <i>updated\_at</i> [timestamps](https://sequelize.org/master/manual/model-basics.html#timestamps) for both tables. Note that you will have to create them yourself in the migration.

**NOTE:** if you have to delete tables from the command line (i.e. you don't do the deletion by undoing the migration), you will have to delete the contents of the <i>migrations</i> table if you want your program to be able to run the migrations again.

#### Task 13.18.

Extend your application (via migration) so that the blogs have a writing year, i.e., a field <i>year</i> which is an integer at least equal to 1991 but not greater than the current year. Make sure the application gives the appropriate error message if an attempt is made to assign an invalid value to the year of writing.

</div>

<div class="content">

### Many to many connections

Continue to extend the application so that each user can be added to one or more <i>tribes</i>.

Since an arbitrary number of users can join one team, and one user can join an arbitrary number of teams, we are dealing with [many-to-many](https://sequelize.org/master/manual/assocs.html#many-to-many-relationships), a many-to-many type of connection, which is traditionally implemented in relational databases using a <i>connection table</i>.

Let's now generate the code required by the team and the connection table. The migration is as follows

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

The models contain almost the same code as the migration. The team model `models/team.js`

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

Dashboard model `models/membership.js`:

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

So we have given the dashboard a descriptive name, <i>membership</i>. There is not always an apt name for a join table, in which case the name of the join table can be a combination of the names of the tables to be joined, e.g. <i>user_\teamas</i> might suit our situation.

A small addition to the file <i>models/index.js</i> will be made to link teams and users with the method [belongsToMany](https://sequelize.org/master/manual/assocs.html#implementation-3) also at code level.

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

Now let's create a couple of teams and a couple of memberships in the console:

```js
insert into teams (name) values ('toska');
insert into teams (name) values ('mosa climbers');
insert into memberships (user_id, team_id) values (1, 1);
insert into memberships (user_id, team_id) values (1, 2);
insert into memberships (user_id, team_id) values (2, 1);
```

Then insert in the route of all users the information about the user's teams

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

The most observant will notice that the query that comes to the console now combines three tables.

The solution is pretty good, but there is one flaw. The result also includes the attributes of the join table row even though we don't want them:

IMAGE HERE

````js
teams: [
  {
  name: "toska",
  id: 2,
  membership: {
      id: 2,
      user_id: 1,
      team_id: 2,
      userId: 1,
      teamId: 2
    }
  },
  {
    name: "mosa climbers",
    id: 3,
    membership: {
      id: 3,
      user_id: 1,
      team_id: 3,
      userId: 1,
      teamId: 3
    }
  }
]
```

A careful reading of the documentation will find [solution](https://sequelize.org/master/manual/advanced-many-to-many.html#specifying-attributes-from-the-through-table):

````js
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

The current code for the application is available in its entirety on [github](https://github.com/fullstack-hy/part12-notes/tree/part12-8), in branch <i>part12-8</i>.

### Note on the properties of Sequelize model objects

The specification of our models included the following lines:

```js
User.hasMany(Note)
User.hasMany(Note)

User.belongsToMany(Team, { through: Membership })
Team.belongsToMany(User, { through: Membership })
```

These allow Sequelize to make queries that retrieve, for example, all notes of a user, or all members of a team.

The definitions also allow us to directly access the user's notes, for example, in code. In the following, we will retrieve a user with id 1 and print the notes associated with that user:

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

The definition <i>User.hasMany(Note)</i> thus associates an attribute <i>notes</i> with <i>user</i>, which gives access to the notes made by the user. The definition <i>User.belongsToMany(Team, { through: Membership }))</i> similarly associates the <i>teams</i> attribute to users, which is also accessible in code:

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

Suppose we wanted to return a json from a single user route containing the user name, username, and the number of notes created. We could try the following

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

So, we tried to include the <i>note_\count</i> field in the returned object by Sequelize and remove the <i>notes</i> field from it. However, this approach does not work, because the objects returned by Sequelize are not normal objects, and adding new fields to them works the way we want.

A better solution is to create a completely new entity based on the data retrieved from the database:

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
### Many to many again

Let's make another many-to-many relation in the application. Each black mark is associated with the user who created it via a reference key. It is decided that the application also supports that a note can be associated with other users, and that a user can be associated with an arbitrary number of notes created by another user. It is assumed that these notes are those that the user has <i>marked</i> for himself.

Let's make a chalkboard `user_notes` for this situation. The migration is straightforward:

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

There is nothing special about the model either:

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

The `models/index.js` file, on the other hand, is a slight change from what we saw earlier:

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

In use again is <i>belongsToMany</i> which links to the user notes via the model <i>UserNotes</i> corresponding to the dashboard. However, this time we give the attribute formed using the keyword [as](https://sequelize.org/master/manual/advanced-many-to-many.html#aliases-and-custom-key-names) an <i>aliasname</i>, the default name (for users <i>notes</i>) would overlap with its previous meaning, i.e. user-generated notes.

Extend the route for an individual user to return the user's teams, his own notes, and any other notes associated with the user:

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

The include must now mention the `as` parameter using the alias we just defined <i>marked\_notes</i>.

In order to test the property, let's create some test data in the database:

```sql
insert into user_notes (user_id, note_id) values (1, 4);
insert into user_notes (user_id, note_id) values (1, 5);
```

The end result is functional:

IMAGE

What if we wanted the notes entered by the user to also contain information about the note author? This can be done by adding an `include` to the appendix kernel for notes.

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


The end result is as desired:

IMAGE

The current code of the application is available in full at [github](https://github.com/fullstack-hy/part12-notes/tree/part12-9), branch <i>part12-9</i>.


</div>

<div class="tasks">

### Tasks 13.19.-13.23.

#### Task 13.19.

Enable users to add blogs in the system to the <i>reading list</i>. When added to the reading list, the blog is in the state <i>unread</i>. The blog can later be marked as <i>read</i>. Implement a reading list using a chalkboard.

In this task, adding to the reading list and displaying the list need not be done other than directly using the database.

#### Exercise 13.20.

Now add functionality to the application to support the reading list.

Adding a blog to the reading list is done by making an HTTP POST to the path <i>/api/readinglists</i>, the request is accompanied by the blog and user id:

```js
{
  blog_id: 10,
  user_id: 3
}
```

Implement a single-user return path <i>/api/users/:id</i> that returns not only the user's other information but also a reading list, e.g. in the following format:

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

At this point, information about whether the book has been read or not need not be available.

#### Task 13.21.

Extend the single-user view so that for each blog in the reading list, it also tells you whether the blog has been read <i>and</i> the id of the corresponding chalkboard row.

For example, the information could be in the following format:

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

Note: there are several ways to implement this functionality. [This](https://sequelize.org/master/manual/advanced-many-to-many.html#the-best-of-both-worlds--the-super-many-to-many-relationship) should help.

#### Exercise 13.22.

Make it possible for the application to mark a blog on the reading list as read. To mark it as read, make a HTTP PUT request to the /api/readinglists/:id path, and send the request with

```js
{ read: true }
```

A user can only mark as read blogs in their own reading list. The user is identified by the token that accompanies the request, as usual.

#### Exercise 13.23.

Modify the route for returning single user information, so that the request can be accompanied by a control of which blogs in the reading list are returned

- GET /api/users/:id returns the entire reading list
- GET /api/users/:id?read=true returns those blogs from the reading list that have been read
- GET /api/users/:id?read=false returns the blogs in the reading list that have not been read

</div>

<div class="content">

### Final remarks

Our application is starting to be in at least decent shape. However, before the end of the section, let's look at a few more points.

#### Eager vs lazy fetch

When doing queries using the `include` attribute:

```js
User.findOne({
  include: {
    model: note
  }
})
```

A so-called [eager fetch](https://sequelize.org/master/manual/assocs.html#basics-of-queries-involving-associations) takes place, i.e. all rows of the tables to be joined to the row, in the example the notes related to the user, are fetched from the database at the same time. This is often what we want, but there are also situations where we want to do a _lazy fetch_, i.e. fetch, say, the user's associated teams only if they are needed.

Let's now modify the route for an individual user so that it will fetch the user's teams from the database only if the query parameter `teams` is set for the request:

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

So now the <i>User.findByPk</i> query does not retrieve teams, but they are retrieved as needed by the <i>getTeams</i> method of the <i>user</i> object corresponding to the database row, which is automatically generated by Sequelize for the model object. The corresponding <i>get</i> and a few other useful methods [are automatically generated](https://sequelize.org/master/manual/assocs.html#special-methods-mixins-added-to-instances) when defining associations for tables at the Sequelize level.

#### Model properties

There are some situations where by default we don't want to handle all rows in a given table. One such case could be that we don't normally want to display in our application those users whose ID is disabled (<i>disabled</i>). In this situation, we could specify a default [scopen](https://sequelize.org/master/manual/scopes.html) for the model:

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

Now the query raised by the function call <i>User.findAll()</i> has the following where-condition

```
WHERE "user". "disabled" = false;
```

It is also possible to define other scopes for models:

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

Scopes are used as follows

```js
// all admins
const adminUsers = await User.scope('admin').findAll()

// all inactive users
const disabledUsers = await User.scope('disabled').findAll()

// users with the string jami in their name
const jamiUsers = User.scope({ method: ['name', '%jami%'] }).findAll()
```

It is also possible to chain scopes

```js
// admins with the string jami in their name
const jamiUsers = User.scope('admin', { method: ['name', '%jami%'] }).findAll()
```

Since Sequelize models are normal [JavaScript classes](https://sequelize.org/master/manual/model-basics.html#taking-advantage-of-models-being-classes), it is possible to add new methods to them.

Here are two examples:

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

The first of the methods <i>note_count</i> is an <i>instance method</i>, meaning that it can be called on instances of the model:

_TODO: camelCase?_

```js
const jami = await User.findOne({ name: 'Jami Kousa'})
const cnt = await jami.number_of_notes()
console.log(`Jami has created ${cnt} notes`)
```

Thus, within an instance method, the keyword <i>this</i> refers to the instance itself:

```js
async number_of_notes() {
  return (await this.getNotes()).length
}
```

The second of the methods, which returns those users with at least a parameter's worth of notes, is again the <i>class method</i>, i.e. it is called directly on the model:

```js
const users = await User.with_notes(2)
console.log(JSON.stringify(users, null, 2))
users.forEach(u => {
  console.log(u.name)
})
```

#### Repetition of models and migrations

We have noticed that the code for models and migrations is very repetitive. For example, the model

````js
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

and migration contain much the same

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

Couldn't we optimize the code so that e.g. the model exports the shared parts for migration?

However, the problem is that the definition of the model may change over time, for example the field `name` may change its name or its data type may change. Migrations must be able to be performed successfully from start to finish at any time, and if migrations rely on the model having a certain content, this may no longer be the case after a month or a year. Therefore, the code for migrations should be completely separate from the code for models, despite the "copy paste".

One solution would be to use Sequelize [command line tool](https://sequelize.org/master/manual/migrations.html#creating-the-first-model--and-migration-), which creates both models and migration files based on commands given on the command line. For example, the following command would create a model `User` with attributes `name`, `username` and `admin` and a migration file to create the database table:

```
npx sequelize-cli model:generate --name User --attributes name:string,username:string,admin:boolean
```

From the command line, you can also perform and rollback migrations. Command line documentation is unfortunately thin and in this course we decided to do both models and migrations manually. The decision may or may not have been a wise one.

</div>

<div class="tasks">

### Task 13.24.

#### Task 13.24.

Grande finale: [towards the end of part 4](/part4/token_based_login#token_based_login_problems) there was mention of a token-criticality problem: if a user's access to the system is decided to be revoked, the user can still use the token he or she holds to access the system.

The usual solution to this is to store a record of each token issued to a customer in the backend database, and check with each request whether the access is still valid. In this case, the validity of the token can be removed immediately if necessary. This solution is often called a <i>server-side session</i>.

Extend the system now so that a user who has lost access cannot perform any action requiring logon.

You will probably need at least the following
- a boolean value column in the user table to indicate whether the ID is disabled
  - it is sufficient to disable and unenable IDs directly from the database
- a table that remembers active sessions
  - the session is stored in the table when the user logs in, i.e. when the POST /api/login operation is performed
  - the existence (and validity) of the session is checked each time the user performs an operation requiring logon
- a path that allows the user to "log out" of the system, i.e. in practice to delete active sessions from the database, e.g. DELETE /api/logout

Note that logging out should not be possible with an "expired token", i.e. the same token after logging out.

You may also want to use a purpose-built npm library to handle sessions.

</div>
