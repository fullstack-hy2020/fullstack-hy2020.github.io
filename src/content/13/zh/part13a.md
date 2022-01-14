---
mainImage: ../../../images/part-13.svg
part: 13
letter: a
lang: zh
---

<div class="content">

<!-- On this section we will explore the node applications that use relation databases. During section we will build a node-backend using a relational database for a familiar note application from sections 3-5. To complete this part, you will need a reasonable knowledge of relational databases and SQL. There are many online courses on SQL databases, eg. [SQLbolt](https://sqlbolt.com/) and 
[Intro to SQL by Khan Academy](https://www.khanacademy.org/computing/computer-programming/sql).-->
这一章，我们会探索node 应用如何使用关系型数据库。我们会构建一个node后台，使用关系型数据库，构建一个笔记应用，我们在3-5章学过你应该已经很熟悉了。为了完成这一章，你应该具备一些关系型数据库和SQL的知识。网上有许多在线课程教SQL数据库，比如 [SQLbolt](https://sqlbolt.com/) 和 [Into to SQL by Khan Academy](https://www.khanacademy.org/computing/computer-programming/sql)。

<!-- There are 24 exercises in this part, and you need to complete each exercise for completing the course. Exercises are submitted via the [submissions system](https://studies.cs.helsinki.fi/stats/courses/fs-psql) just like in the previous parts, but unlike parts 0 to 7, the submission goes to a different "course instance". -->

这一章节中有24个联系，你需要完成所有练习来完成课程。课程可以通过 [submissions system](https://studies.cs.helsinki.fi/stats/courses/fs-psql)  提交，和之前的章节一样，但是与0-7章不同，提交的地方是在一个不同的“课程实例”中。

### Advantages and disadvantages of document databases
【文档数据库的优势和劣势】

<!-- We have used the MongoDB database in all the previous sections of the course. Mongo is a [document database](https://en.wikipedia.org/wiki/Document-oriented_database) and one of its most characteristic features is its <i>skepticity</i>, i.e. the database has only a very limited awareness of what kind of data is stored in its collections. The schema of the database exists only in the program code, which interprets the data in a specific way, e.g. by identifying that some of the fields are references to objects in another collection. -->

我们在之前的章节中一直使用的是MongoDB 数据库。 Mongo 是一个 [文档数据库document database](https://en.wikipedia.org/wiki/Document-oriented_database) ，它其中一个典型的特点是它的  <i>不可知性skepticity</i> 。 比如说， 数据库对存入到自己集合中的数据类型是没有感知的。数据库的schema 仅仅存在于程序的代码中，对数据的解释采用了一种特定的方式，比如，通过一些字段所引用的对象来判断。

<!-- In the example application of parts 3 and 4, the database stores notes and users. -->
在第三和第四章的例子中，应用中的数据库存放了 notes  和 users。

<!-- A collection of <i>notes</i> that stores notes looks like the following: -->
 <i>notes</i> 的集合存储的notes 类似这样：

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

<!-- Users saving collection <i>users</i> looks like the following: -->
<i>users</i>集合中存储 Users 的类似这样：

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

<!-- MongoDB does know the types of the fields of the stored entities, but it has no information about which collection of entities the user record ids are referring to. MongoDB also does not care what fields the entities stored in the collections have. Therefore MongoDB leaves it entirely up to the programmer to ensure that the correct information is being stored in the database. -->
MongoDB 知道字段所存储的类型，但无法知道实体集合，例如user 的ids 是什么类型的。Mongo DB 也不关心字段中集合里的实体的是什么类型。因此MongoDB 将其整个实体交给类程序来确保信息是被正确存放到数据库的。

<!-- There are both advantages and disadvantages to not having a schema. One of the advantages is the flexibility that schema agnosticism brings: since schema does not need to be defined at the database level, application development may be faster in a certain cases, and easier, with little of effort must be made in defining the schema and its changes in any case. Problems with not having a schema are related to the error-proneness: everything is left up to the programmer. The database itself has no way of checking whether the data in it is <i>honest</i>, i.e. whether all mandatory fields have values, whether the reference type fields refer to existing entities of the right type in general, etc. -->
这种对schema 无感知的模式有其优势和劣势。其中一个优势是其灵活的schema 不可知性所带来的：由于在数据库层面不需要对数据进行schema 定义，应用开发在某些场景下会加速，而且更简单，只需要很少的努力来定义schema，以及scheme的改变。没有Schema所带来的问题都被延后了：也就是都留给了编程阶段。数据库本身无法判断所存入的数据是否是 <i>合法的</i>。 比如说，是否所有的主键字段都有值，是否引用类型的字段所引用的实体是类型正确的等等。

The relational databases that are the focus of this section, on the other hand, lean heavily on the existence of a schema, and the advantages and disadvantages of schema databases are almost the opposite compared of the non-schema databases.
关系型数据库所关注的就是这一部分，换句话说，严重依赖schema 信息，因此其优势和劣势刚好与non-schema 的数据库所相反了。

<!-- The reason why the the previous sections of the course used MongoDB is precisely because of its schema-less nature, which has made it easier to use the database for someone with little knowledge of relational databases. For most of the use cases of this course, I would have chosen the relational database myself. -->
为什么之前的章节用MongoDB ，就是因为它弱schema 的特性，即使不知道关系型数据库的知识，也能使它用起来更简单。本课程的大多数用例，我自己会选择关系型数据库。

### Application database
【应用数据库】

<!-- For our application we need a relational database. There are many options, but we will be using the currently most popular Open Source solution [PostgreSQL](https://www.postgresql.org/). You can install Postgres (as the database is often called) on your machine, if you wish to do so. An easier option would be using Postgres as a cloud service, e.g. [ElephantSQL](https://www.elephantsql.com/). You could also take advantage of the course [part 12](/en/part12) lessons and use Postgres locally using Docker. -->

对我们的应用来说，我们需要关系型数据库。有许多的选项，但我们会用开源领域最为流行的 [PostgreSQL](https://www.postgresql.org/) 。 你可以安装Postgres（作为数据库通常这么叫） 到你的机器上，如果你希望这么做。一个更简单的选项是使用 Postgres 作为云服务， 例如 [ElephantSQL](https://www.elephantsql.com/) 。 你也可以使用 [part 12](/zh/part12)  课程中学到的Postgres  的Docker。

<!-- However, we will be taking advantage of the fact that it is possible to create a Postgres database for the application on the Heroku cloud service platform, which is familiar from the parts 3 and 4. -->
不过，我们会利用这个优势，我们可以在Heroku 云服务上创建Postgres 数据库 ，这在我们的第3和第4章已经非常熟悉了。

<!-- In the theory material of this section, we will be building a Postgres-enabled version from the backend of the notes-storage application, which was built in sections 3 and 4. -->
在本章的教材中，我们会构建一个 Postgres 开启版本的后台系统，给我们的notes 存储应用，我们在3到4章构建过了。

<!-- Now let's create a suitable directory inside the Heroku application, add a database to it and use the _heroku config_ command to see what is <i>connect string</i>, which is required to connect to the database: -->
现在，让我们在Heroku 应用中创建一个合适的文件夹，给他添加一个数据库，并 使用 _heroku config_ 命令 来看看是否连接上了，这对连接到数据库来说是必须的。

```bash
heroku create
# 此时你可以获得一个App 名称，也就是你刚刚在heroku中创建的。

heroku addons:create heroku-postgresql:hobby-dev -a <app-name>
heroku config -a <app-name>
=== cryptic-everglades-76708 Config Vars
DATABASE_URL: postgres://<username>:<password>@<host-of-postgres-addon>:5432/<db-name>
```

<!-- Particularly when using a relational database, it is essential to access the database directly as well. There are many ways to do this, there are several different graphical user interfaces, such as [pgAdmin](https://www.pgadmin.org/). However, we will be using Postgres [psql](https://www.postgresql.org/docs/current/app-psql.html) command-line tool. -->

尤其是使用关系型数据库的时候，直接连接到数据库是十分 重要的。有许多方式可以做到这点，有许多不同的图形操作界面，类似 [pgAdmin](https://www.pgadmin.org/) 。 我们会使用 [psql](https://www.postgresql.org/docs/current/app-psql.html)  命令行工具


<!-- The database can be accessed by running _psql_ command on the Heroku server as follows (note that the command parameters depend on connect url of the Heroku application): -->
数据库可以通过 _psql_ 命令进行访问，在Heroku 服务器照如下操作（注意命令 的 参数取决于你的Heroku 应用的 url）


```bash
heroku run psql -h <host-of-postgres-addon> -p 5432 -U <username> <dbname> -a <app-name>
```

<!-- After entering the password, let's try the main psql command _\d_, which tells you the contents of the database: -->
输入密码后，我们尝试主要 的psql 命令 _\d_，可以告诉你数据库的 信息：

```bash
Password for user <username>:
psql (13.4 (Ubuntu 13.4-1.pgdg20.04+1))
SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, bits: 256, compression: off)
Type "help" for help.

username=> \d
Did not find any relations.
```

<!-- As you might guess, there is currently nothing in the database. -->
你已经猜到了，数据库中并没有信息

<!-- Let's create a table for notes: -->
让我们为note 创建一个表：

```sql
CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    content text NOT NULL,
    important boolean,
    date time
);
```

<!-- A few points: column <i>id</i> is defined as a <i>primary key</i>, which means the value of the column must be unique for each row in the table and the value must not be empty. The type for column is defined as [SERIAL](https://www.postgresql.org/docs/9.1/datatype-numeric.html#DATATYPE-SERIAL), which is not the actual type but an abbreviation for the fact it is an integer column to which Postgres automatically assigns a unique, increasing value when creating rows. Text-worthy column called <i>content</i> is defined in such a way that it must be assigned a value. -->
一些关键点：
列 <i>id</i> 定义为 <i>primary key</i> ， 也就是说这一列的值对该表每一行来说必须是唯一的，并且不能为空。
列的类型是 [SERIAL](https://www.postgresql.org/docs/9.1/datatype-numeric.html#DATATYPE-SERIAL) ，这并不是一个真实的类型，而是一个缩写，实际上它是一个整数型列，Postgres 自动设置为唯一的 ，当创建 一行时，该值就增加。字符型的列叫做 <i>content</i>  ，如此定义，说明它必须赋予一个值。

<!-- Let's look at the situation from the console. First, the _\d_ command, which tells us what tables are in the deck: -->
让我们从命令行看一下当前的情况，首先  _\d_ 命令，告诉我们当前都有哪些表。

```sql
username=> \d
                 List of relations
 Schema | Name | Type | Owner
--------+--------------+----------+----------------
 public | notes | table | username
 public | notes_id_seq | sequence | username
(2 rows)
```

<!-- In addition to the <i>notes</i> table, Postgres created a subtable called <i>notes\_id\_seq</i>, which keeps track of what value is assigned to the <i>id</i> column when creating the next note. -->
此外， <i>notes</i> 表，Postgres 创建了一个子表叫做 <i>notes\_id\_seq</i> ，用来跟踪当创建新的note时，<i>id</i> 列的值

<!-- With the command _\d notes_, we can see how the <i>notes</i> table is defined: -->
通过命令 _\d notes_ ， 我们可以可看到  <i>notes</i> 是如何定义的

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

<!-- Therefore the column <i>id</i> has a default value, which is obtained by calling the internal function of Postgres <i>nextval</i>. -->
因此， 列  <i>id</i> 有一个默认值，通过调用内部的 函数，即Postgres 的 <i>nextval</i> 来获得

<!-- Let's add little content to the table: -->
让我们向表中添加一些内容：

```sql
insert into notes (content, important) values ('Relational databases rule the world', true);
insert into notes (content, important) values ('MongoDB is webscale', false);
```

<!-- And let's see what the created content looks like: -->
下面让我们来看看添加的内容长什么样：

```sql
username=> select * from notes;
 id | content | important | date
----+-------------------------------------+-----------+------
  1 | relational databases rule the world | t |
  2 | MongoDB is webscale | f |
(2 rows)
```

<!-- If we try to store data in the database that is not according to the schema, it will not succeed. The value of the mandatory column cannot be missing: -->
如果我们尝试将数据存储到数据库，并且不是按照Schema 来的，是不会成功的。主键列的值是不能缺失的：

```sql
username=> insert into notes (important) values (true);
ERROR: null value in column "content" of relation "notes" violates not-null constraint
DETAIL: Failing row contains (9, null, t, null).
```

<!-- The column value cannot be of the wrong type: -->
列的值类型不能错：

```sql
username=> insert into notes (content, important) values ('only valid data can be saved', 1);
ERROR: column "important" is of type boolean but expression is of type integer
LINE 1: ...tent, important) values ('only valid data can be saved', 1); ^
```

<!-- Non-existent columns in the schema are not accepted either: -->
schema中不存在的列也是不允许的：

```sql
username=> insert into notes (content, important, value) values ('only valid data can be saved', true, 10);
ERROR: column "value" of relation "notes" does not exist
LINE 1: insert into notes (content, important, value) values ('only ...
```

<!-- Next it's time to move on to accessing the database from the application. -->
接下来，是时候从应用中访问数据库了。

### Node application using a relational database
【使用关系型数据库的 Node  应用】

<!-- Let's start the application as usual with the <i>npm init</i> and install <i>nodemon</i> as the development-time dependency and also the following runtime dependencies: -->
让我们像原来一样使用 <i>npm init</i> 和 <i>nodemon</i> 作为开发时的依赖，以及如下的运行时依赖：

```bash
npm install express dotenv pg sequelize
```

<!-- Of these, the latter [sequelize](https://sequelize.org/master/) is the library through we use Postgres. Sequelize is a so-called [Object relational mapping](https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping) (ORM) library that allows you to store JavaScript objects in a relational database without using the SQL language itself, similar to the Mongoose we use with MongoDB. -->
这些 依赖当中，最后的  [sequelize](https://sequelize.org/master/) 是我们用来连接Postgres 的库。Sequelize 也叫做 [Object relational mapping](https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping) (ORM) 库，可以让你将JS 对象存储到关系型数据库中，而不是用SQL语言，类似  Mongoose 之于  Mongo DB。

<!-- Let's test that the connection is successful. Create the file <i>index.js</i> and add the following content: -->
让我们测试一下连接是成功的。创建一个 <i>index.js</i> 文件，并添加如下内容 ：

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

<!-- The database <i>connect string</i>, which is revealed by the _heroku config_ command should be stored in <i>.env</i> file, whose contents should be something like the following: -->
数据库中的 <i>connect string</i> ， 与 _heroku config_ 命令相关，内容应该类似下面这样，存储到<i>.env</i>文件中：

```bash
$ cat .env
DATABASE_URL=postgres://<username>:<password>@ec2-54-83-137-206.compute-1.amazonaws.com:5432/<databasename>
```

<!-- Let's try if a connection is successful: -->
让我们尝试是否连接成功：

```bash
$ node index.js
Executing (default): SELECT 1+1 AS result
Connection has been established successfully.
```

<!-- If and when the connection works, we can then run the first query. Let's modify the program as follows: -->
当连接成功，我们可以跑第一个查询。

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

<!-- Executing the application should print as follows: -->
执行应用的输出应当如下所示：

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

<!-- Even though Sequelize is an ORM library, which means there is little need to write SQL yourself when using it, we now directly used [direct SQL](https://sequelize.org/master/manual/raw-queries.html) with the sequelize method [query](https://sequelize.org/master/class/lib/sequelize.js~Sequelize.html#instance-method-query). -->
虽然Sequelize 是一个ORM 库，也就是说使用的时候不需要写太多SQL，我们现在使用直连的方式 [direct SQL](https://sequelize.org/master/manual/raw-queries.html) ，使用sequelize 方法 [query](https://sequelize.org/master/class/lib/sequelize.js~Sequelize.html#instance-method-query)。

<!-- Since everything seems to be working, let's change the application into a web application. -->
既然所有的看起来运行不错，我们改变应用，让他变成web应用 。

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

<!-- The application seems to be working. However, let's now switch to using Sequelize instead of SQL as it is intended to be used. -->
应用看起来运行不错。但是让我们切换到使用Sequelize  而不是SQL，就想它的常规用法那样。

### Model

<!-- When using Sequelize, each table in the database is represented by a [model](https://sequelize.org/master/manual/model-basics.html), which is effectively it's own JavaScript class. Let's now define the model <i>Note</i> corresponding to the table <i>notes</i> for the application by changing the code to the following format: -->
使用Sequelize 时，数据库中的每一个表都代表了一个 [model](https://sequelize.org/master/manual/model-basics.html) ， 也就是一个独立的 JavaScript  类。我们现在定义模型 <i>Note</i>  ，代表应用中的 <i>notes</i> 表，将代码改变成如下格式：

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

<!-- A few comments on the code. There is nothing very surprising about the <i>Note</i> definition of the model, each columm has a type defined, as well as other properties if necessary, such as whether it is the main key of the table. The second parameter in the model definition contains the <i>sequelize</i> attribute as well as other configuration information. We also defined that the table does not have frequently used timestamp columns (created\_at and updated\_at). -->
代码上有一些注释。<i>Note</i> 的模型定义并没有什么神奇的地方，每个列都有一个类型定义，以及其他的属性，例如是否为该表的主键。模型定义中的第二个参数包括 <i>sequelize</i> 属性，和其他的 配置信息。我们同样定义了该表中不常用的时间戳列（created\_at 和 updated\_at）。

<!-- We also defined <i>underscored: true</i>, which means that table names are derived from model names as plural [snake case](https://en.wikipedia.org/wiki/Snake_case) versions. Practically this means that, if the name of the model, as in our case is "Note", then the name of the corresponding table is the plural of the name written in a small initial letter, i.e. <i>notes</i>. If, on the other hand, the name of the model would be "two-part", e.g. <i>StudyGroup</i>, then the name of the table would be <i>study_groups</i>. Instead of automatically inferring table names, Sequelize also allows explicitly defining table names. -->
我们同样定义了 <i>underscored: true</i> ， 表示表名来自于模型名，并且是  [snake case](https://en.wikipedia.org/wiki/Snake_case)  版本的。实际上也就是说，如果模型的名字叫  <i>notes</i> ，我们这里就是 “Note”，那么代表该 表 的模型就写作小写开头的复数形式，例如 <i>notes</i> 。另一种情况，模型名如果是“两部分” ， 例如 <i>StudyGroup</i> ，那么表名就是<i>study_groups</i>。与直接引用表名不同，Sequelize 允许显示地定义表名。

<!-- The same naming policy applies to columns as well. If we had defined that a note is associated with <i>creationYear</i>, i.e. information about the year it was created, we would define it in the model as follows: -->
同样的命名策略对列也是适用的。如果我们定义了note 的列为 <i>creationYear</i> ， 代表信息创建的年份，我们会将其定义的model 如下所示：

```js
Note.init({
  // ...
  creationYear: {
    type: DataTypes.INTEGER,
  },
})
```

<!-- The name of the corresponding column in the database would be <i>creation_year</i>. In code, reference to the column is always in the same format as in the model, i.e. in "camel case" format. -->

数据库中相关列的名字是<i>creation_year</i> 。在代码中，所引用的列与model中的格式相同，比如说是“驼峰式”的。

<!-- We have also defined <i>modelName: 'note'</i>, the default "model name" would be capitalized <i>Note</i>. However we want to have a lowercase initial, it will make a few things a bit more convenient going forward. -->

我们同样定义了 <i>modelName: 'note'</i>，默认“model name”是大写的 <i>Note</i>.但是我们想要小写字母开头，需要更方便的 方法。

<!-- The database operation is easy to do using the [query interface](https://sequelize.org/master/manual/model-querying-basics.html) provided by models, the method [findAll](https://sequelize.org/master/class/lib/model.js~Model.html#static-method-findAll) works exactly as it is assumed by it's name to work: -->

使用模型提供的查询接口 [query interface](https://sequelize.org/master/manual/model-querying-basics.html) ，数据库操作很容易完成， 方法  [findAll](https://sequelize.org/master/class/lib/model.js~Model.html#static-method-findAll) 的工作按照其名称所假定的那样:

```js
app.get('/api/notes', async (req, res) => {
  const notes = await Note.findAll() // highlight-line
  res.json(notes)
})
```

<!-- The console tells you that the method call <i>Note.findAll()</i> causes the following query: -->
命令行告诉你方法 <i>Note.findAll()</i> 的调用会产生如下查询 ：

```js
Executing (default): SELECT "id", "content", "important", "date" FROM "notes" AS "note";
```

<!-- Next, let's implement an endpoint for creating new notes: -->
接下来，让我们实现一个接口，创建一个新的 note：

```js
app.use(express.json())

// ...

app.post('/api/notes', async (req, res) => {
  console.log(req.body)
  const note = await Note.create(req.body)
  res.json(note)
})
```

<!-- Creating a new note is done by calling the model's <i>Note</i> method [create](https://sequelize.org/master/manual/model-querying-basics.html#simple-insert-queries) and passing as a parameter the entity that defines the values of the columns. -->
创建一个 新的Note，是通过调用模型  <i>Note</i> 的方法 [create](https://sequelize.org/master/manual/model-querying-basics.html#simple-insert-queries) 并传递一个实体，定义了各列的值。

<!-- Instead of the <i>create</i> method, it [would be possible](https://sequelize.org/master/manual/model-instances.html#creating-an-instance) to save in a database using first method [build](https://sequelize.org/master/class/lib/model.js~Model.html#static-method-build) to create a Model-object from the desired data, and calling the [save](https://sequelize.org/master/class/lib/model.js~Model.html#instance-method-save) method on it: -->
不同于 <i>create</i> 方法， 可以 [would be possible](https://sequelize.org/master/manual/model-instances.html#creating-an-instance)   使用第一个方法 [build](https://sequelize.org/master/class/lib/model.js~Model.html#static-method-build)  保存想要的数据，并调用  [save](https://sequelize.org/master/class/lib/model.js~Model.html#instance-method-save) 方法：

```js
const note = Note.build(req.body)
await note.save()
```

<!-- Calling the <i>build</i> method does not save the object in the database yet, so it is still possible to edit the object before the actually save event: -->
调用 <i>build</i> 方法并没有将对象存储到数据库中，所以仍 可能在真正执行保存操作前编辑对象：

```js
const note = Note.build(req.body)
note.important = true // highlight-line
await note.save()
```

<!-- For the use case of the example code, the [create](https://sequelize.org/master/manual/model-querying-basics.html#simple-insert-queries) method is better suited, so let's refrain from it. -->
对样例代码的使用用例来说， [create](https://sequelize.org/master/manual/model-querying-basics.html#simple-insert-queries) 方法更合适，让我们来优化一下。

<!-- If the object being created is not valid, there is an error message as a result. For example, when trying to create a note without content, the operation fails, and the console reveals the reason to be <i>SequelizeValidationError: notNull Violation Note.content cannot be null</i>:    -->
如果创建的对象不是合法的 ，结果会有报错信息。例如，当我们尝试创建一个空note 时，操作会失败 ，命令行的报警 信息会是<i>SequelizeValidationError: notNull Violation Note.content cannot be null</i>:

```
(node:39109) UnhandledPromiseRejectionWarning: SequelizeValidationError: notNull Violation: Note.content cannot be null
    at InstanceValidator._validate (/Users/mluukkai/opetus/fs-psql/node_modules/sequelize/lib/instance-validator.js:78:13)
    at processTicksAndRejections (internal/process/task_queues.js:93:5)
```

<!-- Let's add a simple error handling when adding a new note: -->
让我们在添加一个新note 时添加一个简单的错误处理：

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

<!-- In the tasks of this section, we will build a blog application backend similar to the tasks in [section 4](/en/part4), which should be compatible with the frontend in [section 5](/en/part5) except for error handling. We will also add various features to the backend that the frontend in section 5 will not know how to use. -->

在本节的任务中，我们将构建一个博客应用程序后端，类似于第4节中的任务，它应该与第5节中的前端兼容，以便进行错误处理。我们还将为后端制作多种特性，这些特性在第5节中的前端可能不知道如何利用。

#### Task 13.1.

<!-- Create a GitHub repository for the application and create a new Heroku application for it, as well as a Postgres database. Make sure you are able to establish a connection to the application database. -->

为应用程序创建一个 GitHub 仓库，并创建一个 Heroku 应用程序，以及一个 Postgres 数据库。确保您能够建立一个应用程序到数据库的连接。

#### Task 13.2.

<!-- On the command-line, create a <i>blogs</i> table for the application with the following columns -->

在命令行中，为应用程序创建blog 表，使其有如下列

- id (unique, incrementing id)
- author (string)
- url (string that cannot be empty)
- title (string that cannot be empty)
- likes (integer with default value zero)

<!-- Add at least two blogs to the database. -->

向数据库中添加至少两个blog

<!-- Save the SQL-commands you used at the root of the application repository in the file called <i>commands.sql</i> -->

在  <i>commands.sql</i> 文件中将你在根应用使用过的SQL命令保存下来。

#### Exercise 13.3.

<!-- On the command-line, create functionality in your application, which prints the blogs in the database, e.g. as follows: -->

在命令行中，创建一个函数，能打印出数据库中的blog，如下所示：

```bash
$ node cli.js
Executing (default): SELECT * FROM blogs
Dan Abramov: 'On let vs const', 0 likes
Laurenz Albe: 'Gaps in sequences in PostgreSQL', 0 likes
```

</div>

<div class="content">

### Creating database tables automatically

<!-- Our application now has one unpleasant side, it assumes that a database with exactly the right schema exists, i.e. that the table <i>notes</i> has been created with the appropriate <i>create table</i> command. -->

我们的应用现在有一个令人不快的方面，它假设存在具有完全正确的schema的数据库，也就是说，已经使用了适当的 <i>create table</i> 命令创建了 <i>notes</i> 表。

<!-- Since the program code is being stored on GitHub, it would make sense to also store the commands that create the database in the context of the program code, so that the database schema is definitely the same as what the program code is expecting. Sequelize is actually able to generate a schema automatically from the model definition by using the models method [sync](https://sequelize.org/master/manual/model-basics.html#model-synchronization). -->

因为程序代码存储在 GitHub 上，所以把创建数据库的命令也存储在程序代码的上下文中是有意义的，这样数据库schema就肯定和程序代码期望的是一样的。Sequelize 实际上能够通过使用 models 方法  [sync](https://sequelize.org/master/manual/model-basics.html#model-synchronization) 从模型定义自动生成schema。

<!-- Let's now destroy the database from the console by entering the following command: -->
我们现在销毁掉数据库，在命令行执行：

```
drop table notes;
```

<!-- The `\d` command reveals that the table has been lost from the database: -->
利用  `\d` 命令检查，发现表已经从数据库删除了。

```
username=> \d
Did not find any relations.
```

<!-- The application no longer works. -->
应用目前不好使了。

<!-- Let's add the following command to the application immediately after the model <i>Note</i> is defined: -->
在model  <i>Note</i> 定义后，我们添加如下的命令：

```js
Note.sync()
```

<!-- When the application starts, the following is printed on the console: -->
应用启动后，会打印如下信息：

```
Executing (default): CREATE TABLE IF NOT EXISTS "notes" ("id" SERIAL , "content" TEXT NOT NULL, "important" BOOLEAN, "date" TIMESTAMP WITH TIME ZONE, PRIMARY KEY ("id"));
```

<!-- That is, when the application starts, the command <i>CREATE TABLE IF NOT EXISTS "notes"...</i> is executed which creates the table <i>notes</i> if it does not already exist. -->
也就是说，当应用启动时，命令  <i>CREATE TABLE IF NOT EXISTS "notes"...</i> 会被执行，如果 <i>notes</i> 不存在会创建一个表。

### Other operations

<!-- Let's complete the application with a few more operations. -->
让我们为应用完成一些更多的操作。

<!-- Searching for a single note is possible with the method [findByPk](https://sequelize.org/master/manual/model-querying-finders.html), because it is retrieved based on the id of the primary key: -->
查找一个单独的note，可以通过方法 [findByPk](https://sequelize.org/master/manual/model-querying-finders.html) ， 因为它时通过主键来查询的：

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

<!-- Retrieving a single note causes the following SQL command: -->
查询一个单独的note 会产生如下的SQL命令：

```
Executing (default): SELECT "id", "content", "important", "date" FROM "notes" AS "note" WHERE "note". "id" = '1';
```

<!-- If no note is found, return the operation <i>null</i>, and in this case the relevant status code is given. -->
如果找到了note， 会返回 <i>null</i> ，这个用例中相关的状态码就返回了。

<!-- Modifying the note is done as follows. Only the modification of the <i>important</i> field is supported, since the application's frontend does not need anything else: -->
修改note 的动作就完成了。只要修改  <i>important</i>  字段是支持的就行，因为前台并不需要其他的字段：

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

<!-- The object corresponding to the database row is retrieved from the repository using the <i>findByPk</i> method, the object is modified and the result is saved by calling the <i>save</i> method of the object corresponding to the database row. -->
与数据库行相关的对象通过 <i>findByPk</i> 方法获取到了，对象的修改和结果的保存通过 <i>save</i>  方法实现了。

<!-- The current code for the application is in its entirety in [GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-1), branch <i>part13-1</i>. -->
当前应用的所有代码，可以在  [GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-1)  中找到，处于分支  <i>part13-1</i>

### Printing the objects returned by Sequelize to a console

<!-- The JavaScript programmer's most important tool is <i>console.log</i>, whose aggressive use gets even the worst bugs under control. Let's add console printing to the single note path: -->
JavaScript 程序员最重要的工具就是，好好使用可以控制严重的bug。让我们在控制台中打印单个note 的路径：


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

<!-- We can see that the end result is not exactly what we expected: -->
我们可以看到最终结果不是我们想要的：

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

<!-- In addition to the note information, all sorts of other things are printed on the console. We can reach the desired result by calling the model-object method [toJSON](https://sequelize.org/master/class/lib/model.js~Model.html#instance-method-toJSON): -->
除了Note 的信息外，控制台还打印了许多其他内容，我们可以通过调用 model-object 的 [toJSON](https://sequelize.org/master/class/lib/model.js~Model.html#instance-method-toJSON) 方法来获得想要的结果：


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

<!-- Now the result is exactly what we want. -->
现在结果是我们想要的了。

```js
{ id: 1,
  content: 'MongoDB is webscale',
  important: false,
  date: 2021-10-09T13:52:58.693Z }
```

<!-- In the case of a collection of objects, the method toJSON does not work directly, the method must be called separately for each object in the collection: -->
对于对象集合，toJson方法并不能直接工作，必须为集合中每个对象调用该方法：

```js
router.get('/', async (req, res) => {
  const notes = await Note.findAll()

  console.log(notes.map(n=>n.toJSON())) // highlight-line

  res.json(notes)
})
```

<!-- The print looks like the following: -->
打印结果如下图所示：

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

<!-- However, perhaps a better solution is to turn the collection into JSON for printing by using the method [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify): -->
但是，一个更好的解决方案是通过 [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify): 方法将集合转换成JSON 进行打印：

```js
router.get('/', async (req, res) => {
  const notes = await Note.findAll()

  console.log(JSON.stringify(notes)) // highlight-line

  res.json(notes)
})
```

<!-- This way is better especially if the objects in the collection contain other objects. It is also often useful to format the objects on the screen in a slightly more reader-friendly format. This can be done with the following command: -->
这种方式更好，尤其是当集合中的对象包含其他对象的时候。此外，将屏幕上的对象格式化为更易读的格式是十分有用的，可以通过一下命令实现：

```json
console.log(JSON.stringify(notes, null, 2))
```

<!-- The print looks like the following: -->
打印结果如下所示：

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

<!-- Transform your application into a web application that supports the following operations -->
将你的应用转换为支持以下操作的Web应用程序：

- GET api/blogs (list all blogs)
- POST api/blogs (add a new blog)
- DELETE api/blogs/:id (delete a blog)

</div>
