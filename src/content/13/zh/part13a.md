---
mainImage: ../../../images/part-13.svg
part: 13
letter: a
lang: zh
---

<div class="content">

<!-- In this section we will explore node applications that use relational databases. During the section we will build a Node-backend using a relational database for a familiar note application from sections 3-5. To complete this part, you will need a reasonable knowledge of relational databases and SQL. There are many online courses on SQL databases, eg. [SQLbolt](https://sqlbolt.com/) and-->
[Khan Academy](https://www.khanacademy.org/computing/computer-programming/sql).

在本节中，我们将探索使用关系数据库的节点应用程序。在本节中，我们将使用关系数据库为熟悉的笔记应用程序从第3-5节构建Node后端。要完成此部分，您需要具有合理的关系数据库和SQL知识。有许多关于SQL数据库的在线课程，例如[SQLbolt](https://sqlbolt.com/) 和 [Khan Academy](https://www.khanacademy.org/computing/computer-programming/sql)。
<!-- [Intro to SQL by Khan Academy](https://www.khanacademy.org/computing/computer-programming/sql).-->
# 《Khan Academy的SQL入门》
SQL（结构化查询语言）是一种用于访问和处理数据库的标准语言。 这些数据库存储在服务器上，可以被多个用户访问。 一旦你学会了如何使用SQL，就可以从数据库中检索和更新数据，以便更轻松地完成各种任务。

# Khan Academy的SQL入门
SQL（结构化查询语言）是一种标准的数据库访问和处理语言。 它可以让多个用户访问服务器上的数据库。 学习SQL可以让你从数据库中检索和更新数据，以便更轻松地完成各种任务。

<!-- There are 24 exercises in this part, and you need to complete each exercise for completing the course. Exercises are submitted via the [submissions system](https://studies.cs.helsinki.fi/stats/courses/fs-psql) just like in the previous parts, but unlike parts 0 to 7, the submission goes to a different "course instance".-->
在这一部分有24道练习，你需要完成每一道练习来完成课程。练习通过[提交系统](https://studies.cs.helsinki.fi/stats/courses/fs-psql)提交，就像之前的部分一样，但不同于0到7部分，提交到了一个不同的“课程实例”。

### Advantages and disadvantages of document databases

<!-- We have used the MongoDB database in all the previous sections of the course. Mongo is a [document database](https://en.wikipedia.org/wiki/Document-oriented_database) and one of its most characteristic features is that it is <i>schemaless</i>, i.e. the database has only a very limited awareness of what kind of data is stored in its collections. The schema of the database exists only in the program code, which interprets the data in a specific way, e.g. by identifying that some of the fields are references to objects in another collection.-->
我们在本课程的所有前几节中都使用了MongoDB数据库。Mongo是一个[文档数据库](https://en.wikipedia.org/wiki/Document-oriented_database)，其最具特色的一个特征是它是<i>无模式的</i>，也就是说，数据库只有非常有限的了解存储在其集合中的数据类型。数据库的模式只存在于程序代码中，它以特定的方式解释数据，例如通过识别某些字段是指向另一个集合中对象的引用。

<!-- In the example application of parts 3 and 4, the database stores notes and users.-->
在第三和第四部分的示例应用程序中，数据库存储笔记和用户。

<!-- A collection of <i>notes</i> that stores notes looks like the following:-->
一个存储笔记的<i>笔记集</i>如下所示：

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

<!-- Users saved in the <i>users</i> collection looks like the following:-->
用户存储在<i>用户</i>集合中的样子如下：

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

<!-- MongoDB does know the types of the fields of the stored entities, but it has no information about which collection of entities the user record ids are referring to. MongoDB also does not care what fields the entities stored in the collections have. Therefore MongoDB leaves it entirely up to the programmer to ensure that the correct information is being stored in the database.-->
MongoDB不知道存储实体的字段的类型，但是它不知道用户记录id指的是哪个实体集合。MongoDB也不关心集合中存储的实体有哪些字段。因此，MongoDB完全由程序员来确保正确的信息存储在数据库中。

<!-- There are both advantages and disadvantages to not having a schema. One of the advantages is the flexibility that schema agnosticism brings: since the schema does not need to be defined at the database level, application development may be faster in certain cases, and easier, with less effort needed in defining and modifying the schema in any case. Problems with not having a schema are related to error-proneness: everything is left up to the programmer. The database itself has no way of checking whether the data in it is <i>honest</i>, i.e. whether all mandatory fields have values, whether the reference type fields refer to existing entities of the right type in general, etc.-->
有沒有schema都有優點和缺點。其中一個優點是schema無關性帶來的靈活性：由於不需要在資料庫層面定義schema，在某些情況下應用程序開發可以更快，並且更容易，在定義和修改schema時所需的努力更少。沒有schema的問題與容易出錯有關：一切都取決於程序員。資料庫本身沒有辦法檢查其中的資料是否<i>真實</i>，即是否所有必填欄位都有值，參考類型字段是否指向某個類型的現有實體等等。

<!-- The relational databases that are the focus of this section, on the other hand, lean heavily on the existence of a schema, and the advantages and disadvantages of schema databases are almost the opposite compared of the non-schema databases.-->
然而，本节重点关注的关系数据库非常依赖于架构的存在，而架构数据库的优缺点与非架构数据库几乎是相反的。

<!-- The reason why the the previous sections of the course used MongoDB is precisely because of its schema-less nature, which has made it easier to use the database for someone with little knowledge of relational databases. For most of the use cases of this course, I personally would have chosen to use a relational database.-->
因為先前課程的部分使用MongoDB，正是因為它的無架構性，使得對於對關聯資料庫知識不多的人來說，更容易使用該資料庫。對於本課程的大多數用例，我個人會選擇使用關聯資料庫。

### Application database

<!-- For our application we need a relational database. There are many options, but we will be using the currently most popular Open Source solution [PostgreSQL](https://www.postgresql.org/). You can install Postgres (as the database is often called) on your machine, if you wish to do so. An easier option would be using Postgres as a cloud service, e.g. [ElephantSQL](https://www.elephantsql.com/).-->
对于我们的应用程序，我们需要一个关系数据库。有很多选择，但我们将使用目前最流行的开源解决方案[PostgreSQL](https://www.postgresql.org/)。如果你愿意，你可以在你的机器上安装Postgres（数据库通常称为）。一个更简单的选择是使用Postgres作为云服务，例如[ElephantSQL](https://www.elephantsql.com/)。

<!-- However, we will be taking advantage of the fact that it is possible to create a Postgres database for the application on the Fly.io and Heroku cloud service platforms, which are familiar from the parts 3 and 4.-->
但是，我们将利用Fly.io和Heroku云服务平台上可以为应用程序创建Postgres数据库的事实，这些平台在第3部分和第4部分都很熟悉。

<!-- In the theory material of this section, we will be building a Postgres-enabled version from the backend of the notes-storage application, which was built in sections 3 and 4.-->
在本节的理论材料中，我们将从第3和第4节构建的笔记存储应用程序的后端构建一个启用Postgres的版本。

<!-- Since we don''t need any database in the cloud in this part (we only use the application locally), there is a possibility to use the lessons of the course [part 12](/en/part12) and use Postgres locally with Docker. After the Postgres instructions for cloud services, we also give a short instruction on how to easily get Postgres up and running with Docker.-->
由於在這一部分我們不需要在雲端使用任何資料庫（我們只在本地使用應用程式），所以可以使用[第12章节](/en/part12)的課程並在本地使用Postgres和Docker。在Postgres說明雲端服務之後，我們還簡單介紹了如何使用Docker輕鬆啟動Postgres。

#### Fly.io

<!-- Let us create a new Fly.io-app by running the command _fly launch_ in a directory where we shall add the code of the app. Let us also create the Postgres database for the app:-->
让我们在一个我们将添加应用程序代码的目录中运行命令_fly launch_来创建一个新的Fly.io-app。让我们也为应用程序创建Postgres数据库：

![](../../images/13/6.png)

<!-- When creating the app, Fly.io reveals the password of the database that will be needed when connecting the app to the database. <i>This is the only time it is shown in plain text so it is essential to save it somewhere</i> (but not in any public place such as GitHub).-->
当创建应用程序时，Fly.io揭示了连接应用程序到数据库所需的数据库密码。<i>这是唯一一次以明文显示，因此必须将其保存在某处</i>（但不要保存在GitHub等公共场所）。

<!-- Note that if you only need the database, and are not planning to deploy the app to Fly.io, it is also possible to [just create the database to Fly.io](https://fly.io/docs/reference/postgres/#creating-a-postgres-app).-->
如果您只需要数据库，而不打算将应用程序部署到Fly.io，也可以[只在Fly.io上创建数据库](https://fly.io/docs/reference/postgres/#creating-a-postgres-app)。

<!-- A psql console connection to the database can be opened as follows-->
以下是打开psql控制台连接到数据库的方法：

```bash
flyctl postgres connect -a <app_name-db>
```

<!-- in my case the app name is <i>fs-psql-lecture</i> so the command is the following:-->
我的情况下，应用名称为<i>fs-psql-lecture</i>，因此命令如下：

```bash
flyctl postgres connect -a fs-psql-lecture-db
```
#### Heroku

<!-- If Heroku is used, a new Heroku application is created when inside a suitable directory. After that a database is added to to the app:-->
如果使用Heroku，在合适的目录内会创建一个新的Heroku应用程序。之后，将数据库添加到该应用程序：

```bash
heroku create
# Returns an app-name for the app you just created in heroku.

heroku addons:create heroku-postgresql:hobby-dev -a <app-name>
```

<!-- We can use the _heroku config_ command to get the <i>connect string</i>, which is required to connect to the database:-->
我们可以使用`heroku config`命令获取所需的<i>连接字符串</i>，以连接到数据库：

```bash
heroku config -a <app-name>
=== cryptic-everglades-76708 Config Vars
DATABASE_URL: postgres://<username>:<password>@<host-of-postgres-addon>:5432/<db-name>
```

<!-- The database can be accessed by running _psql_ command on the Heroku server as follows (note that the command parameters depend on the connection url of the Heroku database):-->
运行以下命令，可以访问数据库（请注意，命令参数取决于Heroku数据库的连接网址）：`psql` 命令在Heroku服务器上：

```bash
heroku run psql -h <host-of-postgres-addon> -p 5432 -U <username> <dbname> -a <app-name>
```

<!-- The commands asks the password and opens the psql console:-->
`psql -U postgres -W`

`psql -U postgres -W`：要求輸入密碼並打開psql控制台

```bash
Password for user <username>:
psql (13.4 (Ubuntu 13.4-1.pgdg20.04+1))
SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, bits: 256, compression: off)
Type "help" for help.

postgres=#
```

#### Docker

<!-- This instruction assumes that you master the basic use of Docker to the extent taught by e.g. [part 12](/en/part12).-->
这个指令假定你已经掌握了像[第12章节](/en/part12)这样的基本Docker使用。

<!-- Start Postgres [Docker image](https://hub.docker.com/_/postgres) with the command-->
开始Postgres [Docker镜像](https://hub.docker.com/_/postgres) 的命令是：

```bash
docker run -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 postgres
```

<!-- A psql console connection to the database can be opened using the _docker exec_ command. First you need to find out the id of the container:-->
使用_docker exec_ 命令可以打开一个psql控制台连接到数据库。首先你需要找出容器的ID：

```bash
$ docker ps
CONTAINER ID   IMAGE      COMMAND                  CREATED          STATUS          PORTS                    NAMES
ff3f49eadf27   postgres   "docker-entrypoint.s…"   31 minutes ago   Up 31 minutes   0.0.0.0:5432->5432/tcp   great_raman
docker exec -it ff3f49eadf27 psql -U postgres postgres
psql (15.2 (Debian 15.2-1.pgdg110+1))
Type "help" for help.

postgres=#
```

<!-- Defined in this way, the data stored in the database is persisted only as long as the container exists. The data can be preserved by defining a-->
volume and mounting it to the container.

定义如此，存储在数据库中的数据只能在容器存在的时候被保留。可以通过定义一个卷并挂载到容器中来保存数据。
<!-- [volume](/en/part12/building_and_configuring_environments#persisting-data-with-volumes) for the data, see more-->
使用[卷](/zh-hans/part12/building_and_configuring_environments#persisting-data-with-volumes)来持久化数据，查看更多信息。
<!-- [here](https://github.com/docker-library/docs/blob/master/postgres/README.md#pgdata).-->
# pgdata

pgdata 是一个 Postgres 数据库文件夹，用于存储 Postgres 数据库文件。它可以放置在任何位置，但是必须在启动 Postgres 服务器时指定它的位置。

#### Using the psql console

<!-- Particularly when using a relational database, it is essential to access the database directly as well. There are many ways to do this, there are several different graphical user interfaces, such as [pgAdmin](https://www.pgadmin.org/). However, we will be using Postgres [psql](https://www.postgresql.org/docs/current/app-psql.html) command-line tool.-->
特别是在使用关系数据库时，直接访问数据库也是必不可少的。有很多方法可以做到这一点，有几种不同的图形用户界面，例如[pgAdmin](https://www.pgadmin.org/)。但是，我们将使用Postgres [psql](https://www.postgresql.org/docs/current/app-psql.html)命令行工具。

<!-- When the console is opened, let''s try the main psql command _\d_, which tells you the contents of the database:-->
当控制台被打开时，让我们尝试主要的psql命令_\d_，它会告诉你数据库的内容：

```bash
Password for user <username>:
psql (13.4 (Ubuntu 13.4-1.pgdg20.04+1))
SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, bits: 256, compression: off)
Type "help" for help.

postgres=# \d
Did not find any relations.
```

<!-- As you might guess, there is currently nothing in the database.-->
如你所猜，数据库中目前什么都没有。

<!-- Let''s create a table for notes:-->
| 标题 | 内容 |
| :--- | :--- |
| 记录 | 让我们创建一个表格来记录笔记 |

```sql
CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    content text NOT NULL,
    important boolean,
    date time
);
```

<!-- A few points: column <i>id</i> is defined as a <i>primary key</i>, which means that the value in the column id must be unique for each row in the table and the value must not be empty. The type for this column is defined as [SERIAL](https://www.postgresql.org/docs/9.1/datatype-numeric.html#DATATYPE-SERIAL), which is not the actual type but an abbreviation for an integer column to which Postgres automatically assigns a unique, increasing value when creating rows. The column named <i>content</i> with type text is defined in such a way that it must be assigned a value.-->
几点：列<i>id</i>被定义为<i>主键</i>，这意味着表中每一行的id列的值必须是唯一的，并且不能为空。该列的类型被定义为[SERIAL](https://www.postgresql.org/docs/9.1/datatype-numeric.html#DATATYPE-SERIAL)，这不是实际的类型，而是一个整数列的缩写，在创建行时，Postgres会自动分配一个唯一的、递增的值。名为<i>content</i>的列的类型为text，它必须分配一个值。

<!-- Let''s look at the situation from the console. First, the _\d_ command, which tells us what tables are in the database:-->
让我们从控制台来看看这种情况。 首先，_\d_ 命令，它告诉我们数据库中有哪些表：

```sql
postgres=# \d
                 List of relations
 Schema | Name | Type | Owner
--------+--------------+----------+----------------
 public | notes | table | username
 public | notes_id_seq | sequence | username
(2 rows)
```

In addition to the <i>notes</i> table, Postgres created a subtable called <i>notes\_id\_seq</i>, which keeps track of what value is assigned to the <i>id</i> column when creating the next note.

With the command _\d notes_, we can see how the <i>notes</i> table is defined:

```sql
postgres=# \d notes;
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

<!-- Therefore the column <i>id</i> has a default value, which is obtained by calling the internal function of Postgres <i>nextval</i>.-->
因此，该列<i>id</i>具有默认值，该值是通过调用Postgres内部函数<i>nextval</i>获得的。

<!-- Let''s add some content to the table:-->
让我们在表格中添加一些内容：

```sql
insert into notes (content, important) values ('Relational databases rule the world', true);
insert into notes (content, important) values ('MongoDB is webscale', false);
```

<!-- And let''s see what the created content looks like:-->
## 让我们看看创建的内容长什么样：

```sql
postgres=# select * from notes;
 id | content | important | date
----+-------------------------------------+-----------+------
  1 | relational databases rule the world | t |
  2 | MongoDB is webscale | f |
(2 rows)
```

If we try to store data in the database that is not according to the schema, it will not succeed. The value of a mandatory column cannot be missing:

```sql
postgres=# insert into notes (important) values (true);
ERROR: null value in column "content" of relation "notes" violates not-null constraint
DETAIL: Failing row contains (9, null, t, null).
```

The column value cannot be of the wrong type:

```sql
postgres=# insert into notes (content, important) values ('only valid data can be saved', 1);
ERROR: column "important" is of type boolean but expression is of type integer
LINE 1: ...tent, important) values ('only valid data can be saved', 1); ^
```

Columns that don''t exist in the schema are not accepted either:

```sql
postgres=# insert into notes (content, important, value) values ('only valid data can be saved', true, 10);
ERROR: column "value" of relation "notes" does not exist
LINE 1: insert into notes (content, important, value) values (''only ...
```

Next it''s time to move on to accessing the database from the application.

### Node application using a relational database

Let''s start the application as usual with the <i>npm init</i> and install <i>nodemon</i> as a development dependency and also the following runtime dependencies:

```bash
npm install express dotenv pg sequelize
```

Of these, the latter [sequelize](https://sequelize.org/master/) is the library through which we use Postgres. Sequelize is a so-called [Object relational mapping](https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping) (ORM) library that allows you to store JavaScript objects in a relational database without using the SQL language itself, similar to Mongoose that we used with MongoDB.

Let''s test that we can connect successfully. Create the file <i>index.js</i> and add the following content:

```js
require('dotenv').config()
const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL)

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

Note: if you use Heroku, you might need an extra option in connecting the database

```js
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  // highlight-start
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  // highlight-end
})
```

The database <i>connect string</i>, that contains the database address and the credentials must be defined in the file <i>.env</i>

If Heroku is used, the connect string can be seen by using the command _heroku config_. The contents of the file <i>.env</i> should be something like the following:

```bash
$ cat .env
DATABASE_URL=postgres://<username>:<password>@ec2-54-83-137-206.compute-1.amazonaws.com:5432/<databasename>
```

When using Fly.io, the local connection to the database should first be enabled by [tunneling](https://fly.io/docs/reference/postgres/#connecting-to-postgres-from-outside-fly)
the localhost port 5432 to the Fly.io database port using the following command

```bash
flyctl proxy 5432 -a <app-name>-db
```

in my case the command is

```bash
flyctl proxy 5432 -a fs-psql-lecture-db
```

The command must be left running while the database is used. So do not close the console!

The Fly.io connect-string is of the form

```bash
$ cat .env
DATABASE_URL=postgres://postgres:<password>@127.0.0.1:5432/postgres
```

Password was shown when the database was created, so hopefully you have not lost it!

The last part of the connect string, <i>postgres</i> refers to the database name. The name could be any string but we use here <i>postgres</i> since it is the default database that is automatically created within a Postgres database. If needed, new databases can be created with the command [CREATE DATABASE](https://www.postgresql.org/docs/14/sql-createdatabase.html).

If you use Docker, the connect string is:

```bash
DATABASE_URL=postgres://postgres:mysecretpassword@localhost:5432/postgres
```

Once the connect string has been set up in the file <i>.env</i> we can test for a connection:

```bash
$ node index.js
Executing (default): SELECT 1+1 AS result
Connection has been established successfully.
```

If and when the connection works, we can then run the first query. Let''s modify the program as follows:

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

Even though Sequelize is an ORM library, which means there is little need to write SQL yourself when using it, we just used [direct SQL](https://sequelize.org/master/manual/raw-queries.html) with the sequelize method [query](https://sequelize.org/api/v6/class/src/sequelize.js~sequelize#instance-method-query).

Since everything seems to be working, let''s change the application into a web application.

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

The application seems to be working. However, let''s now switch to using Sequelize instead of SQL as it is intended to be used.

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

A few comments on the code: There is nothing very surprising about the <i>Note</i> definition of the model, each column has a type defined, as well as other properties if necessary, such as whether it is the main key of the table. The second parameter in the model definition contains the <i>sequelize</i> attribute as well as other configuration information. We also defined that the table does not have to use the timestamps columns (created\_at and updated\_at).

We also defined <i>underscored: true</i>, which means that table names are derived from model names as plural [snake case](https://en.wikipedia.org/wiki/Snake_case) versions. Practically this means that, if the name of the model, as in our case is "Note", then the name of the corresponding table is its plural version written with a lower case initial letter, i.e. <i>notes</i>. If, on the other hand, the name of the model would be "two-part", e.g. <i>StudyGroup</i>, then the name of the table would be <i>study_groups</i>. Sequelize automatically infers table names, but also allows explicitly defining them.

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

The database operation is easy to do using the [query interface](https://sequelize.org/master/manual/model-querying-basics.html) provided by models, the method [findAll](https://sequelize.org/master/class/lib/model.js~Model.html#static-method-findAll) works exactly as it is assumed by it''s name to work:

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

Next, let''s implement an endpoint for creating new notes:

```js
app.use(express.json())

// ...

app.post('/api/notes', async (req, res) => {
  console.log(req.body)
  const note = await Note.create(req.body)
  res.json(note)
})
```

Creating a new note is done by calling the model''s <i>Note</i> method [create](https://sequelize.org/master/manual/model-querying-basics.html#simple-insert-queries) and passing as a parameter an object that defines the values of the columns.

Instead of the <i>create</i> method, it [is also possible](https://sequelize.org/master/manual/model-instances.html#creating-an-instance) to save to a database using the [build](https://sequelize.org/api/v6/class/src/model.js~model#static-method-build) method first to create a Model-object from the desired data, and then calling the [save](https://sequelize.org/master/class/lib/model.js~Model.html#instance-method-save) method on it:

```js
const note = Note.build(req.body)
await note.save()
```

Calling the <i>build</i> method does not save the object in the database yet, so it is still possible to edit the object before the actual save event:

```js
const note = Note.build(req.body)
note.important = true // highlight-line
await note.save()
```

For the use case of the example code, the [create](https://sequelize.org/master/manual/model-querying-basics.html#simple-insert-queries) method is better suited, so let''s stick to that.

If the object being created is not valid, there is an error message as a result. For example, when trying to create a note without content, the operation fails, and the console reveals the reason to be <i>SequelizeValidationError: notNull Violation Note.content cannot be null</i>:

```
(node:39109) UnhandledPromiseRejectionWarning: SequelizeValidationError: notNull Violation: Note.content cannot be null
    at InstanceValidator._validate (/Users/mluukkai/opetus/fs-psql/node_modules/sequelize/lib/instance-validator.js:78:13)
    at processTicksAndRejections (internal/process/task_queues.js:93:5)
```

Let''s add some simple error handling when adding a new note:

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

In the tasks of this section, we will build a blog application backend similar to the tasks in [section 4](/en/part4), which should be compatible with the frontend in [section 5](/en/part5) except for error handling. We will also add various features to the backend that the frontend in section 5 will not know how to use.

#### Task 13.1.

Create a GitHub repository for the application and create a new Heroku or Fly.io application for it, as well as a Postgres database. Make sure you are able to establish a connection to the application database.

#### Task 13.2.

On the command-line, create a <i>blogs</i> table for the application with the following columns:
- id (unique, incrementing id)
- author (string)
- url (string that cannot be empty)
- title (string that cannot be empty)
- likes (integer with default value zero)

Add at least two blogs to the database.

Save the SQL-commands you used at the root of the application repository in the file called <i>commands.sql</i>

#### Exercise 13.3.

Create functionality in your application, which prints the blogs in the database on the command-line, e.g. as follows:

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

Let''s now destroy the database from the console by entering the following command:

```
drop table notes;
```

The `\d` command reveals that the table has been lost from the database:

```
postgres=# \d
Did not find any relations.
```

The application no longer works.

Let''s add the following command to the application immediately after the model <i>Note</i> is defined:

```js
Note.sync()
```

When the application starts, the following is printed on the console:

```
Executing (default): CREATE TABLE IF NOT EXISTS "notes" ("id" SERIAL , "content" TEXT NOT NULL, "important" BOOLEAN, "date" TIMESTAMP WITH TIME ZONE, PRIMARY KEY ("id"));
```

That is, when the application starts, the command <i>CREATE TABLE IF NOT EXISTS "notes"...</i> is executed which creates the table <i>notes</i> if it does not already exist.

### Other operations

Let''s complete the application with a few more operations.

Searching for a single note is possible with the method [findByPk](https://sequelize.org/docs/v6/core-concepts/model-querying-finders/#findbypk), because it is retrieved based on the id of the primary key:

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

If no note is found, the operation returns <i>null</i>, and in this case the relevant status code is given.

Modifying the note is done as follows. Only the modification of the <i>important</i> field is supported, since the application''s frontend does not need anything else:

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

The object corresponding to the database row is retrieved from the database using the <i>findByPk</i> method, the object is modified and the result is saved by calling the <i>save</i> method of the object corresponding to the database row.

The current code for the application is in its entirety on [GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-1), branch <i>part13-1</i>.

### Printing the objects returned by Sequelize to the console

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

In addition to the note information, all sorts of other things are printed on the console. We can reach the desired result by calling the model-object method [toJSON](https://sequelize.org/api/v6/class/src/model.js~model#instance-method-toJSON):


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

Now the result is exactly what we want:

```js
{ id: 1,
  content: 'MongoDB is webscale',
  important: false,
  date: 2021-10-09T13:52:58.693Z }
```

In the case of a collection of objects, the method toJSON does not work directly, the method must be called separately for each object in the collection:

```js
app.get('/api/notes', async (req, res) => {
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
app.get('/api/notes', async (req, res) => {
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
