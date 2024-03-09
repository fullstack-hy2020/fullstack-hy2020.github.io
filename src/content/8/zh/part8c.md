---
mainImage: ../../../images/part-8.svg
part: 8
letter: c
lang: zh
---

<div class="content">

<!-- We will now add user management to our application, but let's first start using a database for storing data.-->
 我们现在将把用户管理添加到我们的应用中，但让我们首先开始使用数据库来存储数据。

### Mongoose and Apollo

<!-- Install mongoose:-->
 安装mongoose。

```bash
npm install mongoose
```

<!-- We will imitate what we did in parts [3](/en/part3/saving_data_to_mongo_db) and [4](/en/part4/structure_of_backend_application_introduction_to_testing).-->
 我们将模仿我们在[3](/en/part3/saving_data_to_mongo_db)和[4](/en/part4/structure_of_backend_application_introduction_to_testing)部分的做法。


<!-- The person schema has been defined as follows:-->
人的模式已被定义如下。

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

<!-- We also included a few validations. _required: true_, which makes sure that a value exists, is actually redundant: we already ensure that the fields exist with GraphQL. However, it is good to also keep validation in the database.-->
 我们还包括一些验证。_required: true_，确保一个值的存在，实际上是多余的：我们已经用GraphQL确保字段的存在。然而，在数据库中也保留验证是很好的。

<!-- We can get the application to mostly work with the following changes:-->
 我们可以通过以下的改变使应用大部分工作。

```js
const { ApolloServer, UserInputError, gql } = require('apollo-server')
const mongoose = require('mongoose')
const Person = require('./models/person')

const MONGODB_URI = 'mongodb+srv://databaseurlhere'

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
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
 这些变化是非常直接的。然而，有几个值得注意的地方。我们记得，在Mongo中，一个对象的识别字段被称为<i>_id</i>，我们以前必须自己把字段的名称解析为<i>id</i>。现在GraphQL可以自动做到这一点。

<!-- Another noteworthy thing is that the resolver functions now return a <i>promise</i>, when they previously returned normal objects. When a resolver returns a promise, Apollo server [sends back](https://www.apollographql.com/docs/apollo-server/data/data/#resolver-results) the value which the promise resolves to.-->
 另一件值得注意的事情是，解析器函数现在会返回一个<i> promise </i>，而以前它们会返回普通的对象。当一个解析器返回一个 promise 时，Apollo服务器[送回](https://www.apollographql.com/docs/apollo-server/data/data/#resolver-results) promise 所解析的值。

<!-- For example, if the following resolver function is executed,-->
 例如，如果执行了下面的解析器函数。

```js
allPersons: async (root, args) => {
  return Person.find({})
},
```

<!-- Apollo server waits for the promise to resolve, and returns the result. So Apollo works roughly like this:-->
 Apollo服务器等待 promise 的解析，并返回结果。所以Apollo的工作原理大致是这样的。

```js
Person.find({}).then( result => {
  // return the result
})
```

<!-- Let's complete the _allPersons_ resolver so it takes the optional parameter _phone_ into account:-->
 让我们完成_allPersons_解析器，使其考虑到可选参数_phone_。

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

<!-- So if the query has not been given a parameter _phone_, all persons are returned. If the parameter has the value <i>YES</i>, the result of the query-->
 所以，如果查询没有给出参数_phone_，就会返回所有的人。如果该参数的值是<i>YES</i>，则查询的结果为

```js
Person.find({ phone: { $exists: true }})
```

<!-- is returned, so the objects in which the field _phone_ has a value. If the parameter has the value <i>NO</i>, the query returns the objects in which the _phone_ field has no value:-->
 返回的是字段_phone_有值的对象。如果参数的值是<i>NO</i>，则查询返回_phone_字段没有值的对象。

```js
Person.find({ phone: { $exists: false }})
```

### Validation

<!-- As well as in GraphQL, the input is now validated using the validations defined in the mongoose schema. For handling possible validation errors in the schema, we must add an error-handling _try/catch_ block to the _save_ method. When we end up in the catch, we throw a suitable exception:-->
 和GraphQL一样，现在使用mongoose模式中定义的验证对输入进行验证。为了处理模式中可能出现的验证错误，我们必须在_save_方法中添加一个错误处理_try/catch_块。当我们在catch中结束时，我们抛出一个合适的异常。

```js
Mutation: {
  addPerson: async (root, args) => {
      const person = new Person({ ...args })

      try {
        await person.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      return person
  },
    editNumber: async (root, args) => {
      const person = await Person.findOne({ name: args.name })
      person.phone = args.phone

      try {
        await person.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      return person
    }
}
```

<!-- The code of the backend can be found on [Github](https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-4), branch <i>part8-4</i>.-->
 后端的代码可以在[Github](https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-4)找到，分支<i>part8-4</i>。

### User and log in

<!-- Let's add user management to our application. For simplicity's sake, let's assume that all users have the same password which is hardcoded to the system. It would be straightforward to save individual passwords for all users following the principles from [part 4](/en/part4/user_administration), but because our focus is on GraphQL, we will leave out all that extra hassle this time.-->
 让我们把用户管理加入我们的应用。为了简单起见，我们假设所有的用户都有相同的密码，并且是硬编码的。按照[第4章节](/en/part4/user_administration)的原则，为所有用户保存单独的密码是很直接的，但由于我们的重点是GraphQL，这次我们将省去所有这些额外的麻烦。

<!-- The user schema is as follows:-->
 用户模式如下。

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

<!-- Every user is connected to a bunch of other persons in the system through the _friends_ field. The idea is that when a user, e.g. <i>mluukkai</i>, adds a person, e.g. <i>Arto Hellas</i>, to the list, the person is added to their _friends_ list. This way, logged-in users can have their own personalized view in the application.-->
 每个用户都通过_friends_字段与系统中的一堆其他人相联系。我们的想法是，当一个用户，例如<i>mluukkai</i>，把一个人，例如<i>Arto Hellas</i>，添加到列表中时，这个人就被添加到他们的_friends_列表中。这样，登录的用户可以在应用中拥有自己的个性化视图。

<!-- Logging in and identifying the user are handled the same way we used in [part 4](/en/part4/token_authentication) when we used REST, by using tokens.-->
 登录和识别用户的方式与我们在[第四章节](/en/part4/token_authentication)中使用REST时使用的方式相同，都是通过使用令牌。


<!-- Let's extend the schema like so:-->
 让我们这样来扩展模式。

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

<!-- The query _me_ returns the currently logged-in user. New users are created with the _createUser_ mutation, and logging in happens with the _login_ mutation.-->
 查询_me_返回当前登录的用户。新用户是通过_createUser_改变创建的，而登录是通过_login_改变进行的。


<!-- The resolvers of the mutations are as follows:-->
 这些改变的解析器如下。

```js
const jwt = require('jsonwebtoken')

const JWT_SECRET = 'NEED_HERE_A_SECRET_KEY'

Mutation: {
  // ..
  createUser: async (root, args) => {
    const user = new User({ username: args.username })

    return user.save()
      .catch(error => {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      })
  },
  login: async (root, args) => {
    const user = await User.findOne({ username: args.username })

    if ( !user || args.password !== 'secret' ) {
      throw new UserInputError("wrong credentials")
    }

    const userForToken = {
      username: user.username,
      id: user._id,
    }

    return { value: jwt.sign(userForToken, JWT_SECRET) }
  },
},
```

<!-- The new user mutation is straightforward. The login mutation checks if the username/password pair is valid. And if it is indeed valid, it returns a jwt token familiar from [part 4](/en/part4/token_authentication).-->
 新用户的改变是简单的。登录改变检查用户名/密码对是否有效。如果它确实有效，它会返回一个从[第4章节](/en/part4/token_authentication)熟悉的jwt令牌。

<!-- Just like in the previous case with REST, the idea now is that a logged-in user adds a token they receive upon login to all of their requests. And just like with REST, the token is added to GraphQL queries using the <i>Authorization</i> header.-->
 就像之前的REST案例一样，现在的想法是，一个登录的用户将他们在登录时收到的令牌添加到他们的所有请求中。就像REST一样，使用<i>Authorization</i>头将令牌添加到GraphQL查询中。

<!-- In the Apollo Explorer, the header is added to a query like so:-->
 在Apollo资源管理器中，该标头被添加到一个查询中，就像这样。

![](../../images/8/24x.png)

<!-- Let's now expand the definition of the _server_ object by adding a third parameter [context](https://www.apollographql.com/docs/apollo-server/data/data/#context-argument) to the constructor call:-->
 现在让我们通过在构造函数调用中添加第三个参数[context](https://www.apollographql.com/docs/apollo-server/data/data/#context-argument)来扩展_server_对象的定义。

```js
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // highlight-start
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )

      const currentUser = await User.findById(decodedToken.id).populate('friends')
      return { currentUser }
    }
  }
  // highlight-end
})
```

<!-- The object returned by context is given to all resolvers as their <i>third parameter</i>. Context is the right place to do things which are shared by multiple resolvers, like [user identification](https://blog.apollographql.com/authorization-in-graphql-452b1c402a9?_ga=2.45656161.474875091.1550613879-1581139173.1549828167).-->
 由context返回的对象作为他们的<i>第三个参数</i>被提供给所有解析器。上下文是做多个解析器共享的事情的正确位置，比如[用户标识](https://blog.apollographql.com/authorization-in-graphql-452b1c402a9?_ga=2.45656161.474875091.1550613879-1581139173.1549828167)。

<!-- So our code sets the object corresponding to the user who made the request to the _currentUser_ field of the context. If there is no user connected to the request, the value of the field is undefined.-->
 所以我们的代码将与发出请求的用户相对应的对象设置到上下文的_currentUser_字段。如果没有与请求相关的用户，则该字段的值是未定义的。

<!-- The resolver of the _me_ query is very simple: it just returns the logged-in user it receives in the _currentUser_ field of the third parameter of the resolver, _context_. It's worth noting that if there is no logged-in user, i.e. there is no valid token in the header attached to the request, the query returns <i>null</i>:-->
 _me_查询的解析器非常简单：它只是返回它在解析器的第三个参数_context_的_currentUser_字段中收到的已登录用户。值得注意的是，如果没有登录的用户，也就是说，在连接到请求的头中没有有效的令牌，查询就会返回<i>null</i>。

```js
Query: {
  // ...
  me: (root, args, context) => {
    return context.currentUser
  }
},
```

### Friends list

<!-- Let's complete the application's backend so that adding and editing persons requires logging in, and added persons are automatically added to the friends list of the user.-->
 让我们完成应用的后端，使添加和编辑人员需要登录，并且添加的人员会自动添加到用户的好友列表中。

<!-- Let's first remove all persons not in anyone's friends list from the database.-->
 首先让我们从数据库中删除所有不在任何人的好友列表中的人。

<!-- _addPerson_ mutation changes like so:-->
 _addPerson_的改变是这样的。

```js
Mutation: {
  addPerson: async (root, args, context) => {
    const person = new Person({ ...args })
    const currentUser = context.currentUser

    if (!currentUser) {
      throw new AuthenticationError("not authenticated")
    }

    try {
      await person.save()
      currentUser.friends = currentUser.friends.concat(person)
      await currentUser.save()
    } catch (error) {
      throw new UserInputError(error.message, {
        invalidArgs: args,
      })
    }

    return person
  },
  //...
}
```

<!-- If a logged-in user cannot be found from the context, an _AuthenticationError_ is thrown. Creating new persons is now done with _async/await_ syntax, because if the operation is successful, the created person is added to the friends list of the user.-->
 如果不能从上下文中找到一个登录的用户，会抛出一个_AuthenticationError_。现在创建新的人是用_async/await_语法完成的，因为如果操作成功，创建的人将被添加到用户的好友列表中。

<!-- Let's also add functionality for adding an existing user to your friends list. The mutation is as follows:-->
 我们也来增加将现有用户添加到好友列表的功能。改变的情况如下。

```js
type Mutation {
  // ...
  addAsFriend(
    name: String!
  ): User
}
```

<!-- And the mutation's resolver:-->
 还有改变的解析器。

```js
  addAsFriend: async (root, args, { currentUser }) => {
    const nonFriendAlready = (person) =>
      !currentUser.friends.map(f => f._id.toString()).includes(person._id.toString())

    if (!currentUser) {
      throw new AuthenticationError("not authenticated")
    }

    const person = await Person.findOne({ name: args.name })
    if ( nonFriendAlready(person) ) {
      currentUser.friends = currentUser.friends.concat(person)
    }

    await currentUser.save()

    return currentUser
  },
```

<!-- Note how the resolver <i>destructures</i> the logged-in user from the context. So instead of saving _currentUser_ to a separate variable in a function-->
 注意解析器如何从上下文中<i>解构</i>登录的用户。所以不要把_currentUser_保存在一个函数中的单独变量中

```js
addAsFriend: async (root, args, context) => {
  const currentUser = context.currentUser
```

<!-- it is received straight in the parameter definition of the function:-->
它被直接收到函数的参数定义中。

```js
addAsFriend: async (root, args, { currentUser }) => {
```

<!-- The following query now returns the user's friends list:-->
 下面的查询现在返回用户的好友列表。

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
 后端的代码可以在[Github](https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-5)分支<i>part8-5</i>找到。

</div>

<div class="tasks">

### Exercises 8.13.-8.16.

<!-- The following exercises are quite likely to break your frontend. Do not worry about it yet; the frontend shall be fixed and expanded in the next chapter.-->
 下面的练习很可能会破坏你的前端。先不要担心，前端将在下一章进行修复和扩展。
#### 8.13: Database, part 1

<!-- Change the library application so that it saves the data to a database. You can find the <i>mongoose schema</i> for books and authors from [here](https://github.com/fullstack-hy/misc/blob/main/library-schema.md).-->
 改变库中的应用，使其将数据保存到数据库中。你可以从[这里](https://github.com/fullstack-hy/misc/blob/main/library-schema.md)找到书籍和作者的<i>mongoose模式</i>。

<!-- Let's change the book graphql schema a little-->
 让我们稍微改变一下图书graphql模式

```js
type Book {
  title: String!
  published: Int!
  author: Author!
  genres: [String!]!
  id: ID!
}
```

<!-- so that instead of just the author's name, the book object contains all the details of the author.-->
这样一来，书籍对象就不再只有作者的名字，而是包含了作者的所有细节。

<!-- You can assume that the user will not try to add faulty books or authors, so you don't have to care about validation errors.-->
 你可以假设用户不会尝试添加有问题的书籍或作者，所以你不必关心验证错误。

<!-- The following things do <i>not</i> have to work just yet:-->
 下面这些东西还不一定能用。

<!--  - _allBooks_ query with parameters-->
 - 带有参数的_allBooks_查询
<!--  -  _bookCount_ field of an author object-->
 - 作者对象的_bookCount_字段
<!--  -  _author_ field of a book-->
 - 一本书的_作者_字段
<!--  - _editAuthor_ mutation-->
 - _editAuthor_变体

<!-- **Note**: despite the fact that author is now an <i>object </i>  within a book, the schema for adding a book can remain same, only the <i>name</i> of the author is given as a parameter-->
 **注意**：尽管作者现在是一本书中的一个<i>对象</i>，但添加一本书的模式可以保持不变，只是将作者的<i>名称</i>作为一个参数给出。

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

<!-- Complete the program so that all queries (to get _allBooks_ working with the parameter _author_ and _bookCount_ field of an author object is not required) and mutations work.-->
 完成程序，使所有的查询（让_allBooks_与参数_author_和_bookCount_字段的作者对象一起工作是不需要的）和改变工作。

<!-- You might find [this](https://docs.mongodb.com/manual/reference/operator/query/in/) useful.-->
 你可能会发现[这个](https://docs.mongodb.com/manual/reference/operator/query/in/)很有用。

#### 8.15 Database, part 3

<!-- Complete the program so that database validation errors (e.g. book title or author name being too short) are handled sensibly. This means that they cause _UserInputError_ with a suitable error message to be thrown.-->
 完成程序，使数据库验证错误（如书名或作者姓名太短）得到合理的处理。这意味着它们会导致_UserInputError_，并抛出一个合适的错误信息。

#### 8.16 user and logging in

<!-- Add user management to your application. Expand the schema like so:-->
 在你的应用中加入用户管理。像这样扩展模式。

```js
type User {
  username: String!
  favouriteGenre: String!
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
    favouriteGenre: String!
  ): User
  login(
    username: String!
    password: String!
  ): Token
}
```


<!-- Create resolvers for query _me_ and the new mutations _createUser_ and-->
 为查询_me_和新的改变_createUser_和=25784=创建解析器。
<!-- _login_. Like in the course material, you can assume all users have the same hardcoded password.-->
 _login_。像在教材中一样，你可以假设所有用户都有相同的硬编码密码。

<!-- Make the mutations _addBook_ and _editAuthor_ possible only if the request includes a valid token.-->
 只有当请求包括一个有效的令牌时，才能使_addBook_和_editAuthor_的改变成为可能。

<!-- (Don't worry about fixing the frontend for the moment.)-->
 (暂时不要担心修复前端。)

</div>
