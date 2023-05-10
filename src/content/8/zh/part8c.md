---
mainImage: ../../../images/part-8.svg
part: 8
letter: c
lang: zh
---

<div class="content">

<!-- We will now add user management to our application, but let''s first start using a database for storing data.-->
我们现在将为我们的应用程序添加用户管理，但让我们先开始使用数据库来存储数据。

### Mongoose and Apollo

<!-- Install Mongoose and dotenv:-->
安装Mongoose和dotenv：

```bash
npm install mongoose dotenv
```

<!-- We will imitate what we did in parts [3](/en/part3/saving_data_to_mongo_db) and [4](/en/part4/structure_of_backend_application_introduction_to_testing).-->
我们将模仿我们在[3](/en/part3/saving_data_to_mongo_db)和[4](/en/part4/structure_of_backend_application_introduction_to_testing)部分所做的事情。

<!-- The person schema has been defined as follows:-->
人格模式定义如下：

```js
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5
  },
  phone: {
    type: String,
    minlength: 5
  },
  street: {
    type: String,
    required: true,
    minlength: 5
  },
  city: {
    type: String,
    required: true,
    minlength: 3
  },
})

module.exports = mongoose.model('Person', schema)
```

<!-- We also included a few validations. *required: true*, which makes sure that a value exists, is actually redundant: we already ensure that the fields exist with GraphQL. However, it is good to also keep validation in the database.-->
我们还包括了几个验证。*必填：true*，确保一个值存在，实际上是多余的：我们已经通过GraphQL确保学科存在。但是，在数据库中也保留验证是很好的。

<!-- We can get the application to mostly work with the following changes:-->
我们可以通过以下更改让应用程序基本正常工作：

```js
// ...
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Person = require('./models/person')

require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = gql`
  ...
`

const resolvers = {
  Query: {
    personCount: async () => Person.collection.countDocuments(),
    allPersons: async (root, args) => {
      // filters missing
      return Person.find({})
    },
    findPerson: async (root, args) => Person.findOne({ name: args.name }),
  },
  Person: {
    address: (root) => {
      return {
        street: root.street,
        city: root.city,
      }
    },
  },
  Mutation: {
    addPerson: async (root, args) => {
      const person = new Person({ ...args })
      return person.save()
    },
    editNumber: async (root, args) => {
      const person = await Person.findOne({ name: args.name })
      person.phone = args.phone
      return person.save()
    },
  },
}
```

<!-- The changes are pretty straightforward. However, there are a few noteworthy things. As we remember, in Mongo, the identifying field of an object is called <i>_id</i> and we previously had to parse the name of the field to <i>id</i> ourselves. Now GraphQL can do this automatically.-->
这些变化很直接。但是，有几件值得注意的事情。正如我们所记得的，在Mongo中，对象的标识字段被称为<i>_id</i>，我们以前必须将字段的名称解析为<i>id</i>。现在GraphQL可以自动完成这项工作。

<!-- Another noteworthy thing is that the resolver functions now return a <i>promise</i>, when they previously returned normal objects. When a resolver returns a promise, Apollo server [sends back](https://www.apollographql.com/docs/apollo-server/data/data/#resolver-results) the value which the promise resolves to.-->
另一值得注意的事情是，解析器函数现在返回一个<i>promise</i>，而以前返回普通对象。当解析器返回一个promise时，Apollo服务器[发送回]（https://www.apollographql.com/docs/apollo-server/data/data/#resolver-results）promise解析到的值。

<!-- For example, if the following resolver function is executed,-->
例如，如果执行以下解析器函数，

```js
allPersons: async (root, args) => {
  return Person.find({})
},
```

<!-- Apollo server waits for the promise to resolve, and returns the result. So Apollo works roughly like this:-->
Apollo服务器等待promise解析，并返回结果。因此，Apollo的工作原理大致如下：

```js
allPersons: async (root, args) => {
  const result = await Person.find({})
  return result
}
```

<!-- Let''s complete the *allPersons* resolver so it takes the optional parameter *phone* into account:-->
让我们完成*allPersons*解析器，以便它考虑可选参数*phone*：

```js
Query: {
  // ..
  allPersons: async (root, args) => {
    if (!args.phone) {
      return Person.find({})
    }

    return Person.find({ phone: { $exists: args.phone === 'YES' } })
  },
},
```

<!-- So if the query has not been given a parameter *phone*, all persons are returned. If the parameter has the value <i>YES</i>, the result of the query-->
is limited to persons with a phone number.

如果查询没有给定参数*phone*，则返回所有人。如果参数的值为<i>YES</i>，则查询的结果仅限于有电话号码的人。

```js
Person.find({ phone: { $exists: true }})
```

<!-- is returned, so the objects in which the field *phone* has a value. If the parameter has the value <i>NO</i>, the query returns the objects in which the *phone* field has no value:-->
如果参数值为<i>YES</i>，则返回其中*phone*字段有值的对象。如果参数值为<i>NO</i>，则返回其中*phone*字段没有值的对象：

```js
Person.find({ phone: { $exists: false }})
```

### Validation

<!-- As well as in GraphQL, the input is now validated using the validations defined in the mongoose schema. For handling possible validation errors in the schema, we must add an error-handling *try/catch* block to the *save* method. When we end up in the catch, we throw a exception [GraphQLError](https://www.apollographql.com/docs/apollo-server/data/errors/#custom-errors) with error code :-->
正如在GraphQL中一样，输入现在使用mongoose模式定义的验证进行验证。为了处理模式中可能出现的验证错误，我们必须在*save*方法中添加一个错误处理*try/catch*块。当我们最终进入catch时，我们抛出一个带有错误代码的[GraphQLError](https://www.apollographql.com/docs/apollo-server/data/errors/#custom-errors)异常：

```js
Mutation: {
  addPerson: async (root, args) => {
      const person = new Person({ ...args })

// highlight-start
      try {
        await person.save()
      } catch (error) {
        throw new GraphQLError('Saving person failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }
// highlight-end

      return person
  },
    editNumber: async (root, args) => {
      const person = await Person.findOne({ name: args.name })
      person.phone = args.phone

// highlight-start
      try {
        await person.save()
      } catch (error) {
        throw new GraphQLError('Saving number failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }
// highlight-end

      return person
    }
}
```

<!-- We have also added the Mongoose error and the data that caused the error to the <i>extensions</i> object that is used to convey more info about the cause of the error to the caller. The frontend can then display this information to the user, who can try the operation again with a better input.-->
我们还将Mongoose错误及导致该错误的数据添加到<i>extensions</i>对象中，该对象用于向调用者传递有关错误原因的更多信息。前端可以将此信息显示给用户，用户可以使用更好的输入再次尝试操作。

<!-- The code of the backend can be found on [Github](https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-4), branch <i>part8-4</i>.-->
后端代码可以在[Github](https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-4)上找到，分支为<i>part8-4</i>。

### User and log in

<!-- Let's add user management to our application. For simplicity's sake, let''s assume that all users have the same password which is hardcoded to the system. It would be straightforward to save individual passwords for all users following the principles from [part 4](/en/part4/user_administration), but because our focus is on GraphQL, we will leave out all that extra hassle this time.-->
让我们给我们的应用程序添加用户管理。为了简单起见，让我们假设所有用户都有相同的密码，该密码被硬编码到系统中。按照[第4章节](/en/part4/user_administration)的原则，保存所有用户的单独密码是很简单的，但是因为我们的重点是GraphQL，所以这次我们将省略所有额外的麻烦。

<!-- The user schema is as follows:-->
用户模式如下：

```js
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Person'
    }
  ],
})

module.exports = mongoose.model('User', schema)
```

<!-- Every user is connected to a bunch of other persons in the system through the *friends* field. The idea is that when a user, e.g. <i>mluukkai</i>, adds a person, e.g. <i>Arto Hellas</i>, to the list, the person is added to their *friends* list. This way, logged-in users can have their own personalized view in the application.-->
每个用户都通过*朋友*字段与系统中的其他人连接在一起。这个想法是，当用户，例如<i>mluukkai</i>，将一个人，例如<i>Arto Hellas</i>，添加到列表中时，该人将被添加到他们的*朋友*列表中。这样，登录的用户可以在应用程序中拥有自己的个性化视图。

<!-- Logging in and identifying the user are handled the same way we used in [part 4](/en/part4/token_authentication) when we used REST, by using tokens.-->
登录和识别用户的方式与我们在[第四部分](/en/part4/token_authentication)使用REST时使用的方式相同，即使用令牌。

<!-- Let''s extend the schema like so:-->
让我们像这样扩展模式：

```js
type User {
  username: String!
  friends: [Person!]!
  id: ID!
}

type Token {
  value: String!
}

type Query {
  // ..
  me: User
}

type Mutation {
  // ...
  createUser(
    username: String!
  ): User
  login(
    username: String!
    password: String!
  ): Token
}
```

<!-- The query *me* returns the currently logged-in user. New users are created with the *createUser* mutation, and logging in happens with the *login* mutation.-->
查询*me*返回当前登录的用户。新用户可以使用*createUser* mutation创建，登录可以使用*login* mutation完成。

<!-- The resolvers of the mutations are as follows:-->
以下是突变的解决者：

```js
const jwt = require('jsonwebtoken')

Mutation: {
  // ..
  createUser: async (root, args) => {
    const user = new User({ username: args.username })

    return user.save()
      .catch(error => {
        throw new GraphQLError('Creating the user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      })
  },
  login: async (root, args) => {
    const user = await User.findOne({ username: args.username })

    if ( !user || args.password !== 'secret' ) {
      throw new GraphQLError('wrong credentials', {
        extensions: {
          code: 'BAD_USER_INPUT'
        }
      })
    }

    const userForToken = {
      username: user.username,
      id: user._id,
    }

    return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
  },
},
```

<!-- The new user mutation is straightforward. The login mutation checks if the username/password pair is valid. And if it is indeed valid, it returns a jwt token familiar from [part 4](/en/part4/token_authentication). Note that the *JWT\_SECRET* must be defined in the  <i>.env</i> file.-->
新用户变异很直接。登录变异检查用户名/密码对是否有效。如果确实有效，它将返回[第4章节](/en/part4/token_authentication)中熟悉的jwt令牌。请注意，必须在<i>.env</i>文件中定义*JWT\_SECRET*。

<!-- User creation is done now as follows:-->
用户创建现在的步骤如下：

```js
mutation {
  createUser (
    username: "mluukkai"
  ) {
    username
    id
  }
}
```

<!-- The mutation for logging in looks like this:-->
这个登录的变异看起来像这样：

```js
mutation {
  login (
    username: "mluukkai"
    password: "secret"
  ) {
    value
  }
}
```

<!-- Just like in the previous case with REST, the idea now is that a logged-in user adds a token they receive upon login to all of their requests. And just like with REST, the token is added to GraphQL queries using the <i>Authorization</i> header.-->
就像之前在REST中一样，现在的想法是，登录的用户将在登录时收到的令牌添加到所有请求中。就像REST一样，令牌使用<i>授权</i>头添加到GraphQL查询中。

<!-- In the Apollo Explorer, the header is added to a query like so:-->
在Apollo Explorer中，头部被添加到查询中，如下所示：

![apollo explorer highlighting headers with authorization and bearer token](../../images/8/24x.png)

<!-- Modify the startup of the backend by giving the function that handles the startup [startStandaloneServer](https://www.apollographql.com/docs/apollo-server/api/standalone/) another parameter [context](https://www.apollographql.com/docs/apollo-server/data/context/)-->
修改后端的启动，通过给处理启动的[startStandaloneServer](https://www.apollographql.com/docs/apollo-server/api/standalone/)函数另一个参数[context](https://www.apollographql.com/docs/apollo-server/data/context/)。

```js
startStandaloneServer(server, {
  listen: { port: 4000 },
  // highlight-start
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), process.env.JWT_SECRET
      )
      const currentUser = await User
        .findById(decodedToken.id).populate('friends')
      return { currentUser }
    }
  },
  // highlight-end
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
```

<!-- The object returned by context is given to all resolvers as their <i>third parameter</i>. Context is the right place to do things which are shared by multiple resolvers, like [user identification](https://blog.apollographql.com/authorization-in-graphql-452b1c402a9?_ga=2.45656161.474875091.1550613879-1581139173.1549828167).-->
上下文所返回的对象被作为所有解析器的第三个参数提供。上下文是做被多个解析器共享的事情的正确的地方，比如[用户认证](https://blog.apollographql.com/authorization-in-graphql-452b1c402a9?_ga=2.45656161.474875091.1550613879-1581139173.1549828167)。

<!-- So our code sets the object corresponding to the user who made the request to the *currentUser* field of the context. If there is no user connected to the request, the value of the field is undefined.-->
所以我们的代码将与请求者相对应的对象设置为上下文的*currentUser*字段。如果没有用户与请求相连，该字段的值就是未定义的。

<!-- The resolver of the *me* query is very simple: it just returns the logged-in user it receives in the *currentUser* field of the third parameter of the resolver, *context*. It''s worth noting that if there is no logged-in user, i.e. there is no valid token in the header attached to the request, the query returns <i>null</i>:-->
解析*me*查询非常简单：它只返回它在解析器的第三个参数*context*的*currentUser*字段中接收到的已登录用户。值得注意的是，如果没有已登录的用户，即请求附带的头中没有有效的令牌，则查询返回<i>null</i>：

```js
Query: {
  // ...
  me: (root, args, context) => {
    return context.currentUser
  }
},
```

<!-- If the header has the correct value, the query returns the user information identified by the header-->
.

如果header具有正确的值，查询将返回header所标识的用户信息。

![apollo studio showing query response object](../../images/8/50new.png)

### Friends list

<!-- Let's complete the application's backend so that adding and editing persons requires logging in, and added persons are automatically added to the friends list of the user.-->
让我们完成应用程序的后端，以便添加和编辑人员需要登录，并且添加的人员会自动添加到用户的朋友列表中。

<!-- Let's first remove all persons not in anyone's friends list from the database.-->
让我们首先从数据库中移除所有没有在任何人朋友列表中的人。

<!-- *addPerson* mutation changes like so:-->
**`addPerson` 变更如下：**

```js
Mutation: {
    addPerson: async (root, args, context) => { // highlight-line
      const person = new Person({ ...args })
      const currentUser = context.currentUser // highlight-line

      // highlight-start
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }
      // highlight-end

      try {
        await person.save()
        currentUser.friends = currentUser.friends.concat(person) // highlight-line
        await currentUser.save() // highlight-line
      } catch (error) {
        throw new GraphQLError('Saving user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }

      return person
    },
  //...
}
```

<!-- If a logged-in user cannot be found from the context, an *GraphQLError* with a proper message is thrown. Creating new persons is now done with *async/await* syntax, because if the operation is successful, the created person is added to the friends list of the user.-->
如果在上下文中找不到登录用户，就会抛出一个带有适当消息的*GraphQLError*。现在使用*async/await*语法创建新的人物，因为如果操作成功，创建的人物将被添加到用户的朋友列表中。

<!-- Let''s also add functionality for adding an existing user to your friends list. The mutation is as follows:-->
让我们也增加功能，以便将现有用户添加到您的朋友列表中。变异如下：

```js
type Mutation {
  // ...
  addAsFriend(
    name: String!
  ): User
}
```

<!-- And the mutation''s resolver:-->
而突变的解决方案：

```js
  addAsFriend: async (root, args, { currentUser }) => {
    const isFriend = (person) =>
      currentUser.friends.map(f => f._id.toString()).includes(person._id.toString())

    if (!currentUser) {
      throw new GraphQLError('wrong credentials', {
        extensions: { code: 'BAD_USER_INPUT' }
      })
    }

    const person = await Person.findOne({ name: args.name })
    if ( !isFriend(person) ) {
      currentUser.friends = currentUser.friends.concat(person)
    }

    await currentUser.save()

    return currentUser
  },
```

<!-- Note how the resolver <i>destructures</i> the logged-in user from the context. So instead of saving *currentUser* to a separate variable in a function-->
, you can just destructure it from the context.

注意解构器如何从上下文中解构已登录的用户。因此，您无需在函数中将*currentUser*保存到单独的变量中，而只需从上下文中进行解构即可。

```js
addAsFriend: async (root, args, context) => {
  const currentUser = context.currentUser
```

<!-- it is received straight in the parameter definition of the function:-->
它在函数的参数定义中直接接收：

```js
addAsFriend: async (root, args, { currentUser }) => {
```

<!-- The following query now returns the user''s friends list:-->
以下查询现在可以返回用户的朋友列表：

```js
query {
  me {
    username
    friends{
      name
      phone
    }
  }
}
```

<!-- The code of the backend can be found on [Github](https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-5) branch <i>part8-5</i>.-->
后端代码可以在[Github](https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-5) 分支<i>part8-5</i>中找到。

</div>

<div class="tasks">

### Exercises 8.13.-8.16

<!-- The following exercises are quite likely to break your frontend. Do not worry about it yet; the frontend shall be fixed and expanded in the next chapter.-->
以下练习很可能会破坏你的前端。不用担心，前端将在下一章中修复和扩展。

#### 8.13: Database, part 1

<!-- Change the library application so that it saves the data to a database. You can find the <i>mongoose schema</i> for books and authors from [here](https://github.com/fullstack-hy/misc/blob/main/library-schema.md).-->
更改图书馆应用程序，使其将数据保存到数据库中。您可以从[这里](https://github.com/fullstack-hy/misc/blob/main/library-schema.md)找到图书和作者的<i>mongoose模式</i>。

<!-- Let''s change the book graphql schema a little-->
让我们改变一下书籍graphql架构吧！

```js
type Book {
  title: String!
  published: Int!
  author: Author! // highlight-line
  genres: [String!]!
  id: ID!
}
```

<!-- so that instead of just the author''s name, the book object contains all the details of the author.-->
这样，书籍对象就不仅仅包含作者的名字，还包括作者的所有详细信息。

<!-- You can assume that the user will not try to add faulty books or authors, so you don''t have to care about validation errors.-->
你可以假设用户不会试图添加有错误的书籍或作者，所以你不必担心验证错误。

<!-- The following things do <i>not</i> have to work just yet:-->
以下的事情还不用工作：<i>不</i>

<!-- - *allBooks* query with parameters-->
**所有书籍** 查询参数
<!-- - *bookCount* field of an author object-->
作者对象的*bookCount*字段
<!-- - *author* field of a book-->
书籍的*作者*字段
<!-- - *editAuthor* mutation-->
`mutation editAuthor($name: String!, $age: Int!) {
  editAuthor(name: $name, age: $age) {
    name
    age
  }
}`

`mutation 修改作者($name: String!, $age: Int!) {
  修改作者(name: $name, age: $age) {
    名字
    年龄
  }
}`

<!-- **Note**: despite the fact that author is now an <i>object </i>  within a book, the schema for adding a book can remain same, only the <i>name</i> of the author is given as a parameter-->
**注意**：尽管作者现在是书中的一个<i>对象</i>，添加书籍的模式仍然可以保持不变，只是作者的<i>名字</i>作为一个参数给出。

```js
type Mutation {
  addBook(
    title: String!
    author: String! // highlight-line
    published: Int!
    genres: [String!]!
  ): Book!
  editAuthor(name: String!, setBornTo: Int!): Author
}
```

#### 8.14: Database, part 2

<!-- Complete the program so that all queries (to get *allBooks* working with the parameter *author* and *bookCount* field of an author object is not required) and mutations work.-->
完成程序，使所有查询（使用参数* author *和* bookCount *字段获取* allBooks *不需要作者对象）和变异都能正常工作。

<!-- Regarding the <i>genre</i> parameter of the all books query, the situation is a bit more challenging. The solution is simple, but finding it can be a headache. You might benefit from [this](https://www.mongodb.com/docs/manual/tutorial/query-array-of-documents/).-->
关于所有书籍查询的<i>类型</i>参数，情况有点棘手。解决方案很简单，但找到它可能是一个头痛。您可能会受益于[此](https://www.mongodb.com/docs/manual/tutorial/query-array-of-documents/)。

#### 8.15 Database, part 3

<!-- Complete the program so that database validation errors (e.g. book title or author name being too short) are handled sensibly. This means that they cause [GraphQLError](https://www.apollographql.com/docs/apollo-server/data/errors/#custom-errors) with a suitable error message to be thrown.-->
完成程序，以便处理数据库验证错误（例如，书名或作者名称太短）。这意味着它们会引发[GraphQLError](https://www.apollographql.com/docs/apollo-server/data/errors/#custom-errors)，并带有合适的错误消息。

#### 8.16 user and logging in

<!-- Add user management to your application. Expand the schema like so:-->
在您的应用程序中添加用户管理。 像这样扩展模式：

```js
type User {
  username: String!
  favoriteGenre: String!
  id: ID!
}

type Token {
  value: String!
}

type Query {
  // ..
  me: User
}

type Mutation {
  // ...
  createUser(
    username: String!
    favoriteGenre: String!
  ): User
  login(
    username: String!
    password: String!
  ): Token
}
```

<!-- Create resolvers for query *me* and the new mutations *createUser* and-->
*updateUser*.

创建解析器以查询 *me* 和新的变异 *createUser* 和 *updateUser*。
<!-- *login*. Like in the course material, you can assume all users have the same hardcoded password.-->
登录*。就像课程材料中一样，可以假设所有用户都有相同的硬编码密码。

<!-- Make the mutations *addBook* and *editAuthor* possible only if the request includes a valid token.-->
使得*addBook*和*editAuthor*只有在请求包含有效令牌时才可能。

<!-- (Don''t worry about fixing the frontend for the moment.)-->
不用担心现在前端的修复。

</div>
