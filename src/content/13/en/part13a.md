---
mainImage: ../../../images/part-13.svg
part: 13
letter: a
lang: en
---

<div class="content">

On this section we will explore the node applications that use relation databases. During section we will build a node-backend using a relational database for a familiar note application from sections 3-5. To complete this part, you should have a reasonable knowledge of relational databases and SQL. There are many oneline courses on SQL databases, eg. [SQLbolt](https://sqlbolt.com/) and [Into to SQL by Khan Academy](https://www.khanacademy.org/computing/computer-programming/sql).

There are 24 exercises in this part, and you need to complete each exercise for completing the course. Exercises are submitted via the [submissions system](https://studies.cs.helsinki.fi/stats/courses/fs-psql) just like in the previous parts, but unlike parts 0 to 7, the submission goes to a different "course instance".

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

```js
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

For our application we need a relational database. There are many options, but we will be using the currently most popular Open Source solution [PostgreSQL](https://www.postgresql.org/). You can install Postgres (as the database is often called) on your machine, if you wish to do so. An easier option would be using Postgres as a cloud service, e.g. [ElephantSQL](https://www.elephantsql.com/). You could also take advantage of the course [part 12](/en/part12) lessons and use Postgres locally using Docker.

However, we will be taking advantage of the fact that it is possible to create a Postgres database for the application on the Heroku cloud service platform, which is familiar from the parts 3 and 4.

In the theory material of this section, we will be building a Postgres-enabled version from the backend of the notes-storage application, which was built in sections 3 and 4.

Now let's create a suitable directory inside the Heroku application, add a database to it and use the _heroku config_ command to see what is <i>connect string</i>, which is required to connect to the database:

```bash
heroku create
heroku addons:create heroku-postgresql:hobby-dev
heroku config
=== cryptic-everglades-76708 Config Vars
DATABASE_URL: postgres://<username>:<password>@ec2-44-199-83-229.compute-1.amazonaws.com:5432/<db-name>
```

Particularly when using a relational database, it is essential to access the database directly as well. There are many ways to do this, there are several different graphical user interfaces, such as [pgAdmin](https://www.pgadmin.org/). However, we will be using Postgres [pqsl](https://www.postgresql.org/docs/current/app-psql.html) command-line tool.

The database can be accessed by running _psql_ command on the Heroku server as follows (note that the command parameters depend on connect url of the Heroku application):

```bash
heroku run psql -h ec2-44-199-83-229.compute-1.amazonaws.com -p 5432 -U <username> <dbname>
```

After entering the password, let's try the main psql command _\d_, which tells you the contents of the database:

```bash
Password for user <username>:
psql (13.4 (Ubuntu 13.4-1.pgdg20.04+1))
SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, bits: 256, compression: off)
Type "help" for help.

username=> \d
Did not find any relations.
```

As you might guess, there is currently nothing in the database.

Let's create a table for notes:

```sql
CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    content text NOT NULL,
    important boolean,
    date time
);
```

A few points: column <i>id</i> is defined as a <i>primary key</i>, which means the value of the column must be unique for each row in the table and the value must not be empty. The type for column is defined as [SERIAL](https://www.postgresql.org/docs/9.1/datatype-numeric.html#DATATYPE-SERIAL), which is not the actual type but an abbreviation for the fact it is an integer column to which Postgres automatically assigns a unique, increasing value when creating rows. Text-worthy column called <i>content</i> is defined in such a way that it must be assigned a value.

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

In addition to the <i>notes</i> table, Postgres created a subtable called <i>not\_id\_seq</i>, which keeps track of what value is assigned to the <i>id</i> column when creating the next note.

With the command _\d notes_, we can see how the <i>notes</i> table is defined:

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

Therefore the column <i>id</i> has a default value, which is obtained by calling the internal function of Postgres <i>nextval</i>.

Let's add little content to the table:

```sql
insert into notes (content, important) values ('Relational databases rule the world', true);
insert into notes (content, important) values ('MongoDB is webscale', false);
```

And let's see what the created content looks like:

```sql
username=> select * from notes;
 id | content | important | date
----+-------------------------------------+-----------+------
  1 | relational databases rule the world | t |
  2 | MongoDB is webscale | f |
(2 rows)
```

If we try to store data in the database that is not according to the schema, it will not succeed. The value of the mandatory column cannot be missing:

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

Non-existent columns in the schema are not accepted either:

```sql
username=> insert into notes (content, important, value) values ('only valid data can be saved', true, 10);
ERROR: column "value" of relation "notes" does not exist
LINE 1: insert into notes (content, important, value) values ('only ...
```

Next it's time to move on to accessing the database from the application.

### Node application using a relational database

Let's start the application as usual with the <i>npm init</i> and install <i>nodemon</i> as the development-time dependency and also the following runtime dependencies:

```bash
npm install express dotenv pg sequelize
```

Of these, the latter [sequelize](https://sequelize.org/master/) is the library through we use Postgres. Sequelize is a so-called [Object relational mapping](https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping) (ORM) library that allows you to store JavaScript objects in a relational database without using the SQL language itself, similar to the Mongoose we use with MongoDB.

Let's test that the connection is successful. Create the file <i>index.js</i> and add the following content:

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

The database <i>connect string</i>, which is revealed by the _heroku config_ command should be stored in <i>.env</i> file, whose contents should be something like the following:

```bash
$ cat .env
DATABASE_URL=postgres://<username>:<password>@ec2-54-83-137-206.compute-1.amazonaws.com:5432/<databasename>
```

Let's try if a connection is successful:

```bash
$ node index.js
Executing (default): SELECT 1+1 AS result
Connection has been established successfully.
```

If and when the connection works, we can then run the first query. Let's modify the program as follows:

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

Executing the application should print as follows:

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

Even though Sequelize is an ORM library, which means there is little need to write SQL yourself when using it, we now directly used [direct SQL](https://sequelize.org/master/manual/raw-queries.html) with the sequelize method [query](https://sequelize.org/master/class/lib/sequelize.js~Sequelize.html#instance-method-query).

Since everything seems to be working, let's change the application into a web application.

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

The application seems to be working. However, let's now switch to using Sequelize instead of SQL as it is intended to be used.

### Model

When using Sequelize, each table in the database is represented by a [model](https://sequelize.org/master/manual/model-basics.html), which is effectively it's own JavaScript class. Let's now define the model <i>Note</i> corresponding to the table <i>notes</i> for the application by changing the code to the following format:

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

A few comments on the code. There is nothing very surprising about the <i>Note</i> definition of the model, each columm has a type defined, as well as other properties if necessary, such as whether it is the main key of the table. The second parameter in the model definition contains the <i>sequelize</i> attribute as well as other configuration information. We also defined that the table does not have frequently used timestamp columns (created\_at and updated\_at).

We also defined <i>underscored: true</i>, which means that table names are derived from model names as plural [snake case](https://en.wikipedia.org/wiki/Snake_case) versions. Practically this means that, if the name of the model, as in our case is "Note", then the name of the corresponding table is the plural of the name written in a small initial letter, i.e. <i>notes</i>. If, on the other hand, the name of the model would be "two-part", e.g. <i>StudyGroup</i>, then the name of the table would be <i>study_groups</i>. Instead of automatically inferring table names, Sequelize also allows explicitly defining table names.

The same naming policy applies to columns as well. If we had defined that a note is associated with <i>creationYear</i>, i.e. information about the year it was created, we would define it in the model as follows:

```js
Note.init({
  // ...
  creationYear: {
    type: DataTypes.INTEGER,
  },
})
```

The name of the corresponding column in the database would be <i>creation_year</i>. In code, reference to the column is always in the same format as in the model, i.e. in "camel case" format.

We have also defined <i>modelName: 'note'</i>, the default "model name" would be capitalized <i>Note</i>. However we want to have a lowercase initial, it will make a few things a bit more convenient going forward.

The database operation is easy to do using the [query interface](https://sequelize.org/master/manual/model-querying-basics.html) provided by models, the method [findAll](https://sequelize.org/master/class/lib/model.js~Model.html#static-method-findAll) works exactly as it is assumed by it's name to work:

```js
app.get('/api/notes', async (req, res) => {
  const notes = await Note.findAll() // highlight-line
  res.json(notes)
})
```

The console tells you that the method call <i>Note.findAll()</i> causes the following query:

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

Creating a new note is done by calling the model's <i>Note</i> method [create](https://sequelize.org/master/manual/model-querying-basics.html#simple-insert-queries) and passing as a parameter the entity that defines the values of the columns.

Instead of the <i>create</i> method, it [would be possible](https://sequelize.org/master/manual/model-instances.html#creating-an-instance) to save in a database using first method [build](https://sequelize.org/master/class/lib/model.js~Model.html#static-method-build) to create a Model-object from the desired data, and calling the [save](https://sequelize.org/master/class/lib/model.js~Model.html#instance-method-save) method on it:

```js
const note = Note.build(req.body)
await note.save()
```

Calling the <i>build</i> method does not save the object in the database yet, so it is still possible to edit the object before the actually save event:

```js
const note = Note.build(req.body)
note.important = true // highlight-line
await note.save()
```

For the use case of the example code, the [create](https://sequelize.org/master/manual/model-querying-basics.html#simple-insert-queries) method is better suited, so let's refrain from it.

If the object being created is not valid, there is an error message as a result. For example, when trying to create a note without content, the operation fails, and the console reveals the reason to be <i>SequelizeValidationError: notNull Violation Note.content cannot be null</i>:   

```
(node:39109) UnhandledPromiseRejectionWarning: SequelizeValidationError: notNull Violation: Note.content cannot be null
    at InstanceValidator._validate (/Users/mluukkai/opetus/fs-psql/node_modules/sequelize/lib/instance-validator.js:78:13)
    at processTicksAndRejections (internal/process/task_queues.js:93:5)
```

Let's add a simple error handling when adding a new note:

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

</div>

<div class="tasks">

### Tasks 13.1.-13.3.

In the tasks of this section, we will build a blog application backend similar to the tasks in [section 4](/section 4), which should be compatible with the frontend in [section 5](/section 5) expect for error handling. We will also make a set of features to the backend that the frontend in section 5 does not know how to exploit.

#### Task 13.1.

Create a GitHub repository for the application and create a Heroku application within in, as well as a Postgres database. Make sure you are able to establish a connection to the application database.

#### Task 13.2.

On the command-line, create a <i>blogs</i> table for the application with the following columns
- id (unique, incrementing id)
- author (string)
- url (string that cannot be empty)
- title (string that cannot be empty)
- likes (integer with default value zero)

Add at least two blogs to the database.

Save the SQL-commands you used at the root of the application repository in the file called <i>commands.sql</i>

#### Exercise 13.3.

On the command-line, create functionality in your application, which prints the blogs in the database, e.g. as follows:

```bash
$ node cli.js
Executing (default): SELECT * FROM blogs
Dan Abramov: 'On let vs const', 0 likes
Laurenz Albe: 'Gaps in sequences in PostgreSQL', 0 likes
```

</div>

<div class="content">

### Creating database tables automatically

Our application now has one unpleasant side, it assumes that a database with exactly the right schema exists, i.e. that the table <i>notes</i> has been created with the appropriate <i>create table</i> command.

Since the program code is being stored on GitHub, it would make sense to also store the commands that create the database in the context of the program code, so that the database schema is definitely the same as what the program code is expecting. Sequelize is actually able to generate a schema automatically from the model definition by using the models method [sync](https://sequelize.org/master/manual/model-basics.html#model-synchronization).

Let's now destroy the database from the console by entering the following command:

```
drop table notes;
```

The `\d` command reveals that the table has been lost from the database:

```
username=> \d
Did not find any relations.
```

The application no longer works.

Let's add the following command to the application immediately after the model <i>Note</i> is defined:

```js
Note.sync()
```

When the application starts, the following is printed on the console:

```
Executing (default): CREATE TABLE IF NOT EXISTS "notes" ("id" SERIAL , "content" TEXT NOT NULL, "important" BOOLEAN, "date" TIMESTAMP WITH TIME ZONE, PRIMARY KEY ("id"));
```

That is, when the application starts, the command <i>CREATE TABLE IF NOT EXISTS "notes"...</i> is executed which creates the table <i>notes</i> if it does not already exist.

### Other operations

Let's complete the application with a few more operations.

Searching for a single note is possible with the method [findByPk](https://sequelize.org/master/manual/model-querying-finders.html), because it is retrieved based on the id of the primary key:

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

Retrieving a single note causes the following SQL command:

```
Executing (default): SELECT "id", "content", "important", "date" FROM "notes" AS "note" WHERE "note". "id" = '1';
```

If no note is found, return the operation <i>null</i>, and in this case the relevant status code is given.

Modifying the note is done as follows. Only the modification of the <i>important</i> field is supported, since the application's frontend does not need anything else:

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

The object corresponding to the database row is retrieved from the repository using the <i>findByPk</i> method, the object is modified and the result is saved by calling the <i>save</i> method of the object corresponding to the database row.

The current code for the application is in its entirety in [GitHub](https://github.com/fullstack-hy/part122-notes/tree/part13-1), branch <i>part13-1</i>.

### Printing the objects returned by Sequelize to a console

The JavaScript programmer's most important tool is <i>console.log</i>, whose aggressive use gets even the worst bugs under control. Let's add console printing to the single note path:


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

We can see that the end result is not exactly what we expected:

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

In addition to the note information, all sorts of other things are printed on the console. We can reach the desired result by calling the model-object method [toJSON](https://sequelize.org/master/class/lib/model.js~Model.html#instance-method-toJSON):


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

Now the result is exactly what we want.

```js
{ id: 1,
  content: 'MongoDB is webscale',
  important: false,
  date: 2021-10-09T13:52:58.693Z }
```

In the case of a collection of objects, the method toJSON does not work directly, the method must be called separately for each object in the collection:

```js
router.get('/', async (req, res) => {
  const notes = await Note.findAll()

  console.log(notes.map(n=>n.toJSON())) // highlight-line

  res.json(notes)
})
```

The print looks like the following:

```js
[ { id: 1,
    content: 'MongoDB is webscale',
    important: false,
    date: 2021-10-09T13:52:58.693Z },
  { id: 2,
    content: 'Relational databases rule the world',
    important: true,
    date: 2021-10-09T13:53:10.710Z } ]
```

However, perhaps a better solution is to turn the collection into JSON for printing by using the method [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify):

```js
router.get('/', async (req, res) => {
  const notes = await Note.findAll()

  console.log(JSON.stringify(notes)) // highlight-line

  res.json(notes)
})
```

This way is better especially if the objects in the collection contain other objects. It is also often useful to format the objects on the screen in a slightly more reader-friendly format. This can be done with the following command:

```json
console.log(JSON.stringify(notes, null, 2))
```

The print looks like the following:

```js
[
  {
    "id": 1,
    "content": "MongoDB is webscale",
    "important": false,
    "date": "2021-10-09T13:52:58.693Z"
  },
  {
    "id": 2,
    "content": "Relational databases rule the world",
    "important": true,
    "date": "2021-10-09T13:53:10.710Z"
  }
]
```

</div>

<div class="tasks">

### Task 13.4.

#### Task 13.4.

Transform your application into a web application that supports the following operations

- GET api/blogs (list all blogs)
- POST api/blogs (add a new blog)
- DELETE api/blogs/:id (delete a blog)

</div>
