---
mainImage: ../../../images/part-13.svg
part: 13
letter: a
lang: en
---

<div class="content">

On this section we will explore the node applications that use relation databases. During section we will build a node-backend using a relational database for a familiar note application from sections 3-5. To complete this part, you will need a reasonable knowledge of relational databases and SQL. One place to acquire sufficient knowledge is the course called [Fundamentals of Databases](https://tikape.mooc.fi/).

### Advantages and disadvantages of document databases

We have used the MongoDB database in all the previous sections of the course. Mongo is a [document database](https://en.wikipedia.org/wiki/Document-oriented_database) and one of its most characteristic features is its <i>skepticity</i>, i.e. the database has only a very limited awareness of what kind of data is stored in its collections. The schema of the database exists only in the program code, which interprets the data in a specific way, e.g. by identifying that some of the fields are references to objects in another collection.

In the example application of parts 3 and 4, the database stores notes and users.

A collection of <i>notes</i> that stores notes looks like the following:

```js
[
  {
    "_id": "600c0e410d10256466898a6c",
    "content": "HTML is easy"
    "date": 2021-01-23T11:53:37.292+00:00,
    "important": false
    "__v": 0
  },
  {
    "_id": "600c0edde86c7264ace9bb78",
    "content": "CSS is hard"
    "date": 2021-01-23T11:56:13.912+00:00,
    "important": true
    "__v": 0
  },
]
```

Users saving collection <i>users</i> looks like the following:

````js
[
  {
    "_id": "600c0e410d10256466883a6a",
    "username": "mluukkai",
    "name": "Matti Luukkainen",
    "passwordHash" : "$2b$10$Df1yYJRiQuu3Sr4tUrk.SerVz1JKtBHlBOARfY0PBn/Uo7qr8Ocou",
    "__v": 9,
    notes: [
      "600c0edde86c7264ace9bb78",
      "600c0e410d10256466898a6c"
    ]
  },
]
```

MongoDB does know the types of the fields of the stored entities, but it has no information about which collection of entities the user record ids are referring to. MongoDB also does not care what fields the entities stored in the collections have. Therefore MongoDB leaves it entirely up to the programmer to ensure that the correct information is being stored in the database.

There are both advantages and disadvantages to not having a schema. One of the advantages is the flexibility that schema agnosticism brings: since schema does not need to be defined at the database level, application development may be faster in a certain cases, and easier, with little of effort must be made in defining the schema and its changes in any case. Problems with not having a schema are related to the error-proneness: everything is left up to the programmer. The database itself has no way of checking whether the data in it is <i>honest</i>, i.e. whether all mandatory fields have values, whether the reference type fields refer to existing entities of the right type in general, etc.

The relational databases that are the focus of this section, on the other hand, lean heavily on the existence of a schema, and the advantages and disadvantages of schema databases are almost the opposite compared of the non-schema databases.

The reason why the the previous sections of the course used MongoDB is precisely because of its schema-less nature, which has made it easier to use the database for someone with little knowledge of relational databases. For most of the use cases of this course, I would have chosen the relational database myself.

### Application database

We need a relational database for our application. There are many options, we will use the currently most popular Open Source solution [PostgreSQL](https://www.postgresql.org/). If you wish, you can install Postgres (as the database is often called) on your machine. An easier way is to use one of the cloud-based Postgres, e.g. [ElephantSQL](https://www.elephantsql.com/). You can also use the lessons learned in the course [part 12](/en/part12) to run Postgres locally using Docker.

However, we will now take advantage of the fact that it is possible to create a Postgres database for your application on the Heroku cloud platform, familiar from parts 3 and 4.

In the theoretical material in this section, we build a Postgres-enabled version of the backend of the notes-storage application built in sections 3 and 4.

Now let's create a Heroku application inside the appropriate directory, add a database to it, and use the _heroku config_ command to see what the <i>connect string:</i> required to connect to the database is.

```bash
heroku create
heroku addons:create heroku-postgresql:hobby-dev
heroku config
=== cryptic-everglades-76708 Config Vars
DATABASE_URL: postgres://<username>:<password>@ec2-44-199-83-229.compute-1.amazonaws.com:5432/<db-name>
```

Especially when using a relational database, it is essential to access the database directly as well. There are many ways to do this, including several different graphical user interfaces, such as [pgAdmin](https://www.pgadmin.org/). However, the [pqsl](https://www.postgresql.org/docs/current/app-psql.html) command-line tool in Postgres will be used.

To access the database, run _psql_ on the Heroku server as follows (note that the command parameters depend on the connect url of the Heroku application):

```bash
heroku run psql -h ec2-44-199-83-229.compute-1.amazonaws.com -p 5432 -U <username> <dbname>
```

After entering the password, try the main pslq command _\d_, which tells you the contents of the database:

```bash
Password for user <username>:
psql (13.4 (Ubuntu 13.4-1.pgdg20.04+1))
SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, bits: 256, compression: off)
Type "help" for help.

username=> \d
Did not find any relations.
```

As you might guess, there is nothing in the database.

Let's create a table for notes:

```sql
CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    content text NOT NULL,
    important boolean,
    date time
);
```

A few notes: the <i>id </i> column is defined as a <i>primary key</i>, i.e. the value of the column must be unique for each row in the table and the value must not be empty. The type of the column is defined as [SERIAL](https://www.postgresql.org/docs/9.1/datatype-numeric.html#DATATYPE-SERIAL), which is not the actual type but an abbreviation for the fact that it is an integer column to which Postgres automatically assigns a unique, incrementing value when creating rows. The textual column <i>content</i> is defined in such a way that it must be assigned a value.

Let's look at the situation from the console. First, the _\d_ command, which tells us what tables are in the deck:

```sql
username=> \d
                 List of relations
 Schema | Name | Type | Owner
--------+--------------+----------+----------------
 public | notes | table | username
 public | notes_id_seq | sequence | username
(2 rows)
```

In addition to the <i>notes</i> table, Postgres created a subtable <i>not\_id\_seq</i> that keeps track of what value is assigned to the <i>id</i> column when the next note is created.

With the _\d notes_ command we can see how the <i>notes</i> table is defined:

```sql
username=> \d notes;
                                     Table "public.notes"
  Column | Type | Collation | Nullable | Default
-----------+------------------------+-----------+----------+-----------------------------------
 id | integer | not null | nextval('notes_id_seq'::regclass)
 content | text | | not null |
 important | boolean | | | |
 date | time without time zone | | | |
Indexes:
    "notes_pkey" PRIMARY KEY, btree (id)
```

The column <i>id</i> thus has a default value, which is obtained by calling the postgres internal function <i>nextval</i>.

Add some content to the table:

```sql
insert into notes (content, important) values ('Relational databases rule the world', true);
insert into notes (content, important) values ('MongoDB is webscale', false);
```

And let's see what the generated content looks like:

```sql
username=> select * from notes;
 id | content | important | date
----+-------------------------------------+-----------+------
  1 | relational databases rule the world | t |
  2 | MongoDB is webscale | f |
(2 rows)
```

If we try to store data in the database that does not conform to the schema, it will fail. The value of the mandatory column cannot be missing.

```sql
username=> insert into notes (important) values (true);
ERROR: null value in column "content" of relation "notes" violates not-null constraint
DETAIL: Failing row contains (9, null, t, null).
```

The column value cannot be of the wrong type:

```sql
username=> insert into notes (content, important) values ('only valid data can be saved', 1);
ERROR: column "important" is of type boolean but expression is of type integer
LINE 1: ...tent, important) values ('only valid data can be saved', 1); ^
```

Non-existent columns are not accepted in the schema:

```sql
username=> insert into notes (content, important, value) values ('only valid data can be saved', true, 10);
ERROR: column "value" of relation "notes" does not exist
LINE 1: insert into notes (content, important, value) values ('only ...
```

Now it's time to move on to accessing the database from within the application.

### A node application using a relational database

Start the application as usual with <i>npm init</i> and install <i>npm init</i> as the development-time dependency <i>nodemon</i> and the following runtime dependencies:

```bash
npm install express dotenv pg sequelize
```

The latter [sequelize](https://sequelize.org/master/) is the library through which we use Postgres. Sequelize is a so-called [Object relational mapping](https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping) (ORM) library that allows you to store JavaScript objects in a relational database without using SQL, similar to the Mongoose we use for MongoDB.

Let's test that the connection is successful. Create the file <i>index.js</i> and the following content:

```js
require('dotenv').config()
const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
})

const main = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
    sequelize.close()
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

main()
```

The database <i>connect string</i> revealed by _heroku config_ should be stored in a file <i>.env</i>, whose contents should be something like the following

```bash
$ cat .env
DATABASE_URL=postgres://<username>:<password>@ec2-54-83-137-206.compute-1.amazonaws.com:5432/<databasename>
```

Let's see if a connection is established:

```bash
$ node index.js
Executing (default): SELECT 1+1 AS result
Connection has been established successfully.
```
If and when the connection works, we can run the first query. Let's modify the program as follows:

```js
require('dotenv').config()
const { Sequelize, QueryTypes } = require('sequelize') // highlight-line

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});

const main = async () => {
  try {
    await sequelize.authenticate()
    // highlight-start
    const notes = await sequelize.query("SELECT * FROM notes", { type: QueryTypes.SELECT })
    console.log(notes)
    sequelize.close()
    // highlight-end
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

main()
```

The application execution should print as follows:

```js
Executing (default): SELECT * FROM notes
[
  {
    id: 1,
    content: 'Relational databases rule the world',
    important: true,
    date: null
  },
  {
    id: 2,
    content: 'MongoDB is webscale',
    important: false,
    date: null
  }
]
```

Although Sequelize is an ORM library, and there is little need to write SQL yourself using it, we now used [direct SQL](https://sequelize.org/master/manual/raw-queries.html) with the sequelize method [query](https://sequelize.org/master/class/lib/sequelize.js~Sequelize.html#instance-method-query).

Since everything seems to work, let's convert the application into a web application.

```js
require('dotenv').config()
const { Sequelize, QueryTypes } = require('sequelize')
const express = require('express') // highlight-line
const app = express() // highlight-line

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});

// highlight-start
app.get('/api/notes', async (req, res) => {
  const notes = await sequelize.query("SELECT * FROM notes", { type: QueryTypes.SELECT })
  res.json(notes)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
// highlight-end
```

The app seems to work. However, let's now switch to using Sequelize instead of SQL as it is intended to be used.

### Model

When using Sequelize, each table in the database is represented by a [model](https://sequelize.org/master/manual/model-basics.html), which is effectively its own JavaScript class. Let's now define the model <i>Note</i> corresponding to the table <i>notes</i> for the application by changing the code to the following format:

```js
require('dotenv').config()
const { Sequelize, Model, DataTypes } = require('sequelize') // highlight-line
const express = require('express')
const app = express()

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});

// highlight-start
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
// highlight-end

app.get('/api/notes', async (req, res) => {
  const notes = await Note.findAll() // highlight-line
  res.json(notes)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

A few comments on the code. There is nothing very surprising about the <i>Note</i> definition of the model, each column has a type defined, plus other properties if needed, such as whether it is the main key of the table. The second parameter in the model definition contains the <i>sequelize</i> attribute and other configuration information. We noted that the table does not have frequently used timestamp columns (created\_at and updated\_at).

We also specified that table names are inferred from model names using the "underscored" technique. In practice, this means that if a model name is <i>Note</i>, as in our case, the name of the corresponding table is inferred from the lowercase plural of <i>notes</i>. If, on the other hand, the name of the model were "two-part", e.g. <i>StudyGroup</i>, the name of the table would be <i>study_groups</i>. Instead of automatically inferring table names, Sequelize also allows explicitly defining table names.

The same naming convention applies to columns. If we had specified that a note is associated with <i>creationYear</i>, i.e. information about the year it was created, we would define it in the model as follows:

```js
Note.init({
  // ...
  creationYear: {
    type: DataTypes.INTEGER,
  },
})
```

The name of the corresponding column in the database would be <i>creation_year</i>. In the code, the reference to the column is always in the same format as in the model, i.e. in "camel case" format.

We have also specified <i>modelName: 'note'</i>, the default "model name" would be capitalized <i>Note</i>, however we want a lower case initial, it will make a few things a bit more convenient in the future.

The database operation is easily done using the [query interface](https://sequelize.org/master/manual/model-querying-basics.html) provided by models, the method [findAll](https://sequelize.org/master/class/lib/model.js~Model.html#static-method-findAll) works exactly as you would expect it to from its name:

```js
app.get('/api/notes', async (req, res) => {
  const notes = await Note.findAll() // highlight-line
  res.json(notes)
})
```

The console tells you that the method call <i>Note.findAll()</i> will cause the following query:

```js
Executing (default): SELECT "id", "content", "important", "date" FROM "notes" AS "note";
```

Next, let's implement an endpoint for creating new notes:

```js
app.use(express.json())

// ...

app.post('/api/notes', async (req, res) => {
  console.log(req.body)
  const note = await Note.create(req.body)
  res.json(note)
})
```

The new note is thus created by calling the model's <i>Note</i> method [create](https://sequelize.org/master/manual/model-querying-basics.html#simple-insert-queries) and passing as a parameter the entity that defines the values of the columns.

Instead of the <i>create</i> method, saving to the database [could be done](https://sequelize.org/master/manual/model-instances.html#creating-an-instance) by first using the [build](https://sequelize.org/master/class/lib/model.js~Model.html#static-method-build) method to create a Model-olio from the desired data, and calling the [save](https://sequelize.org/master/class/lib/model.js~Model.html#instance-method-save) method on it:

```js
const note = Note.build(req.body)
await note.save()
```

Calling the <i>build</i> method does not yet save the object to the database, so it is still possible to edit the object before the actual save event:

```js
const note = Note.build(req.body)
note.important = true // highlight-line
await note.save()
```

For the use case of the example code, the [create](https://sequelize.org/master/manual/model-querying-basics.html#simple-insert-queries) method is more appropriate, so we'll refrain from using it.

If the entity being created is not valid, an error message will result. For example, when trying to create a note without content
the operation will fail, and the console will reveal the reason as `SequelizeValidationError: notNull Violation Note.content cannot be null`:

```
(node:39109) UnhandledPromiseRejectionWarning: SequelizeValidationError: notNull Violation: Note.content cannot be null
    at InstanceValidator._validate (/Users/mluukkai/opetus/fs-psql/node_modules/sequelize/lib/instance-validator.js:78:13)
    at processTicksAndRejections (internal/process/task_queues.js:93:5)
```

Add a simple error handling to the addition of the new note:

```js
app.post('/api/notes', async (req, res) => {
  try {
    const note = await Note.create(req.body)
    return res.json(note)
  } catch(error) {
    return res.status(400).json({ error })
  }
})
```

<div class="tasks">

### Tasks 13.1.-13.3.

In the tasks of this section, we will build a blog application backend similar to the tasks in [section 4](/section 4), which should be compatible with the frontend in [section 5](/section 5), except for error handling. We will also add a set of features to the backend that the frontend in part 5 cannot exploit.

#### Task 13.1.

Create a GitHub repository for the application and create a Heroku application and a Postgres database for the application within it. Make sure to establish a connection to the application database.

#### Task 13.2.

On the command line, create a <i>blogs</i> table for the application with the following columns
- id (unique, incrementing id)
- author (string)
- url (a string that cannot be empty)
- title (non-empty string)
- likes (integer with default value zero)

Add at least two blogs to the database

#### Exercise 13.3.

Create a command-line functionality in your application that prints the blogs in the database, e.g. as follows:

```bash
$ node cli.js
Executing (default): SELECT * FROM blogs
Dan Abramov: 'On let vs const', 0 likes
Laurenz Albe: 'Gaps in sequences in PostgreSQL', 0 likes
```

</div>

<div class="content">

### Automatic creation of database tables

Our application now has one annoying aspect, it assumes that a database with exactly the right schema exists, i.e. that the table `notes` has been created with the appropriate `create table` command.

Since the program code is stored on Github, it would make sense to also store the commands that create the database in the program code, so that the schema of the database is definitely what the program code expects. Sequelize can actually generate the schema automatically from the model definition using the models method [sync](https://sequelize.org/master/manual/model-basics.html#model-synchronization).

Let's now destroy the database from the console by issuing the following command:

```
drop table notes;
```

The `\d` command reveals that the table has been lost from the database:

```
username=> \d
Did not find any relations.
```

The application no longer works.

Add the following command to the application immediately after the model `Note` is defined:

```js
Note.sync()
```

When the application starts, the following is printed to the console:

```
Executing (default): CREATE TABLE IF NOT EXISTS "notes" ("id" SERIAL , "content" TEXT NOT NULL, "important" BOOLEAN, "date" TIMESTAMP WITH TIME ZONE, PRIMARY KEY ("id"));
```

That is, when the application starts, the command `CREATE TABLE IF NOT EXISTS "notes"...` is executed which creates the table `notes` if it does not already exist.

### Other operations

Let's complete the application with a few more operations.

The search for a single note is possible with the method [findByPk](https://sequelize.org/master/manual/model-querying-finders.html) because it is searched by the id of the primary key:

```js
app.get('/api/notes/:id', async (req, res) => {
  const note = await Note.findByPk(req.params.id)
  if (note) {
    res.json(note)
  } else {
    res.status(404).end()
  }
})
```

Retrieving a single note will cause the following SQL command:

```
Executing (default): SELECT "id", "content", "important", "date" FROM "notes" AS "note" WHERE "note". "id" = '1';
```

If no note is found, returns `null`, in which case the relevant status code is given.

The modification of a note is done as follows. Only the modification of the `important` field is supported, since the application frontend does not need anything else:

```js
app.put('/api/notes/:id', async (req, res) => {
  const note = await Note.findByPk(req.params.id)
  if (note) {
    note.important = req.body.important
    await note.save()
    res.json(note)
  } else {
    res.status(404).end()
  }
})
```

The object corresponding to the database row is retrieved from the repository using the `findByPk` method, the object is modified and the result is saved by calling the `save` method of the object corresponding to the database row.

The current code for the application is available in full at [github](https://github.com/fullstack-hy/part122-notes/tree/part12-1), branch <i>part12-1</i>.

### Printing objects returned by Sequelize to the console

The JavaScript programmer's most important tool is <i>console.log</i>, the aggressive use of which will get even the worst bugs under control. Add console printing to the single note path:


```js
app.get('/api/notes/:id', async (req, res) => {
  const note = await Note.findByPk(req.params.id)
  if (note) {
    console.log(note) // highlight-line
    res.json(note)
  } else {
    res.status(404).end()
  }
})
```

We see that the end result is not quite what we expected:

```js
note {
  dataValues: {
    id: 1,
    content: 'Notes are attached to a user',
    important: true,
    date: 2021-10-03T15:00:24.582Z,
  },
  _previousDataValues: {
    id: 1,
    content: 'Notes are attached to a user',
    important: true,
    date: 2021-10-03T15:00:24.582Z,
  },
  _changed: Set(0) {},
  _options: {
    isNewRecord: false,
    _schema: null,
    _schemaDelimiter: '',
    raw: true,
    attributes: [ 'id', 'content', 'important', 'date' ]
  },
  isNewRecord: false
}
```

In addition to the information in the note, all sorts of other things are printed on the console. We can get the desired result by calling the model-olio method [toJSON](https://sequelize.org/master/class/lib/model.js~Model.html#instance-method-toJSON):


```js
app.get('/api/notes/:id', async (req, res) => {
  const note = await Note.findByPk(req.params.id)
  if (note) {
    console.log(note.toJSON()) // highlight-line
    res.json(note)
  } else {
    res.status(404).end()
  }
})
```

Now the end result is exactly what we want.

```js
{
  id: 1,
  content: 'Notes are attached to a user',
  important: true,
  date: 2021-10-03T15:00:24.582Z,
  userId: 1
}
```

In the case of a collection of entities, the method toJson does not work directly, the method must be called separately for each entity in the collection:

```js
router.get('/', async (req, res) => {
  const notes = await Note.findAll()

  console.log(notes.map(n=>n.toJSON())) // highlight-line

  res.json(notes)
})
```

However, perhaps a better solution is to convert the collection to JSON for printing:

```js
router.get('/', async (req, res) => {
  const notes = await Note.findAll()

  console.log(JSON.stringify(notes)) // highlight-line

  res.json(notes)
})
```

This way is better especially if the entities in the collection contain other entities. It is also often useful to format the entities on the screen in a slightly more reader-friendly format. This can be done with the command:

```json
console.log(JSON.stringify(notes, null, 2))
```

</div>

<div class="tasks">

### Task 13.4.

#### Task 13.4.

Transform your application into a web application that performs the following operations

- GET api/blogs (list all blogs)
- POST api/blogs (add a new blog)
- DELETE api/blogs/:id (delete a blog)

</div>
