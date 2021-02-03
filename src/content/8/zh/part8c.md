---
mainImage: ../../../images/part-8.svg
part: 8
letter: c
lang: zh
---

<div class="content">


<!-- We will now add user management to our application, but let's first start using a database for storing data. -->
现在我们将向应用添加用户管理，但是首先让我们使用一个数据库来存储数据。

### Mongoose and Apollo
<!-- Install mongoose and mongoose-unique-validator: -->
安装 mongoose 和 mongoose-unique-validator:

```bash
npm install mongoose mongoose-unique-validator
```

<!-- We will imitate what we did in parts [3](/zh/part3/将数据存入_mongo_db) and [4](/zh/part4/从后端结构到测试入门). -->
我们将模仿我们 第 [3](/zh/part3/将数据存入_mongo_db) 和 [4](/zh/part4/从后端结构到测试入门)章节中所做的。

<!-- The person schema has been defined as follows: -->
person模式被定义如下: 

```js
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
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

<!-- We also included a few validations. _required: true_, which ensures that value exists, is actually redundant as just using GraphQL ensures that the fields exist. However it is good to also keep validation in the database.  -->
我们还包括了一些验证。 Required: true，它确保值的存在，实际上是冗余的，因为仅使用 GraphQL 就可以确保字段的存在。 不过，最好还是在数据库中保持验证。

<!-- We can get the application to mostly work with the following changes:  -->
我们可以通过如下更改使应用基本可运行:

```js
const { ApolloServer, UserInputError, gql } = require('apollo-server')
const mongoose = require('mongoose')
const Person = require('./models/person')

const MONGODB_URI = 'mongodb+srv://fullstack:halfstack@cluster0-ostce.mongodb.net/graphql?retryWrites=true'

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
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
    personCount: () => Person.collection.countDocuments(),
    allPersons: (root, args) => {
      // filters missing
      return Person.find({})
    },
    findPerson: (root, args) => Person.findOne({ name: args.name })
  },
  Person: {
    address: root => {
      return {
        street: root.street,
        city: root.city
      }
    }
  },
  Mutation: {
    addPerson: (root, args) => {
      const person = new Person({ ...args })
      return person.save()
    },
    editNumber: async (root, args) => {
      const person = await Person.findOne({ name: args.name })
      person.phone = args.phone
      return person.save()
    }
  }
}
```

<!-- The changes are pretty straightforward. However there are a few noteworthy things. As we remember, in Mongo the identifying field of an object is called <i>_id</i> and we previously had to parse the name of the field to <i>id</i> ourselves. Now GraphQL can do this automatically.  -->
这些改变是非常直接的。 然而，还是有一些值得注意的事情。 正如我们所记得的，在 Mongo 中，对象的标识字段称为<i>_id</i>，我们以前必须将字段名解析为<i>id</i> 。 现在，GraphQL 可以自动完成此操作。

<!-- Another noteworthy thing is that the resolver functions now return a <i>promise</i>, when they previously returned normal objects. When a resolver returns a promise, Apollo server [sends back](https://www.apollographql.com/docs/apollo-server/data/data/#resolver-results) the value which the promise resolves to.  -->
另一个值得注意的事情是，解析器函数现在返回<i>promise</i>，当它们以前返回普通对象时。 当解析器返回一个承诺时，Apollo 服务器[发送回](https://www.apollographql.com/docs/apollo-server/data/data/#resolver-results) 该承诺解析好的值。



<!-- For example if the following resolver function is executed,  -->
例如，如果执行如下解析器函数,

```js
allPersons: (root, args) => {
  return Person.find({})
},
```

<!-- Apollo server waits for the promise to resolve, and returns the result. So Apollo works roughly like this: -->
阿波罗服务器等待承诺解决，并返回结果。因此，阿波罗的工作大致如下:

```js
Person.find({}).then( result => {
  // return the result 
})
```

<!-- Let's complete the _allPersons_ resolver so it takes the optional parameter _phone_ into account: -->
让我们来完成 allPersons 解析器，这样它就会考虑到可选参数 phone:

```js
Query: {
  // ..
  allPersons: (root, args) => {
    if (!args.phone) {
      return Person.find({})
    }

    return Person.find({ phone: { $exists: args.phone === 'YES'  }})
  },
},
```

<!-- So if the query has not been given a parameter _phone_, all persons are returned. If the parameter has the value <i>YES</i>, the result of the query -->
因此，如果查询没有给出参数电话，则返回所有人员。 如果参数值为<i>YES</i>，则为查询结果

```js
Person.find({ phone: { $exists: true }})
```

<!-- is returned, so the objects in which the field _phone_ has a value. If the parameter has the value <i>NO</i>, the query returns the objects in which the _phone_ field has no value:  -->
因此字段 _phone_ 在其中具有值的对象。 如果参数值为<i>NO</i>，查询将返回 _phone_ 字段中没有值的对象:

```js
Person.find({ phone: { $exists: false }})
```

### Validation
<!-- As well as in GraphQL, the input is now validated using the validations defined in the mongoose-schema. For handling possible validation errors in the schema, we must add an error handling _try/catch_-block to the _save_-method. When we end up in the catch, we throw a suitable exception:  -->
与在 GraphQL 中一样，现在使用 mongoose 模式中定义的验证来验证输入。 为了处理模式中可能出现的验证错误，我们必须向 save-method 添加错误处理 try/catch-block。 当我们在 catch 中结束时，我们抛出一个合适的异常:

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

<!-- The code of the backend can be found on [Github](https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-4), branch <i>part8-4</i>. -->
后端的代码可以在[Github](https://Github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-4) ，branch<i>part8-4</i> 上找到。


### User and log in
【用户及登录】

<!-- Let's add user management to our application. For simplicity's sake, let's assume that all users have the same password which is hardcoded to the system. It would be straightforward to save individual passwords for all users following the principles from [第4章](/zh/part4/用户管理), but because our focus is on GraphQL, we will leave out all that extra hassle this time.  -->
让我们在应用中添加用户管理。 为了简单起见，让我们假设所有用户都有硬编码到系统的相同密码。 遵循 [第4章](/zh/part4/用户管理)的原则，为所有用户保存个人密码将非常简单，但由于我们的重点是 GraphQL，这次将省去所有额外的麻烦。

<!-- The user schema is as follows:  -->
用户模式如下:

```js
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
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

<!-- Every user is connected to a bunch of other persons in the system through the _friends_ field. The idea is that when a user, e.g. <i>mluukkai</i>, adds a person, e.g. <i>Arto Hellas</i>, to the list, the person is added to their _friends_ list. This way logged in users can have their own, personalized, view in the application.  -->
每个用户都通过 _friends_ 字段连接到系统中的一群其他人。 这个想法是，当一个用户(即<i>mluukkai</i>)将一个人(即<i>Arto Hellas</i>)添加到列表中时，这个人将被添加到他们的好友列表中。 通过这种方式登录的用户可以在应用中拥有自己的、个性化的视图。

<!-- Logging in and identifying the user are handled the same way we used in [第4章](/zh/part4/密钥认证) when we used REST, by using tokens.  -->
登录和识别用户的处理方式与我们使用 REST 时在[第4章](/zh/part4/密钥认证) 中使用的处理方式相同，即使用tokens。

<!-- Let's extend the schema like so:  -->
让我们像这样扩展模式:

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

<!-- The query _me_ returns the currently logged in user. New users are created with the _createUser_ mutation, and logging in happens with _login_ -mutation. -->
查询 _me_ 返回当前登录的用户。 新用户是通过 _createUser_ Mutation创建的，登录是通过登录Mutation发生的。


<!-- The resolvers of the mutations are as follows:  -->
Mutation的解析器如下:

```js
const jwt = require('jsonwebtoken')

const JWT_SECRET = 'NEED_HERE_A_SECRET_KEY'

Mutation: {
  // ..
  createUser: (root, args) => {
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

    if ( !user || args.password !== 'secred' ) {
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

<!-- The new user mutation is straightforward. The log in mutation checks if the username/password pair is valid. And if it is indeed valid, it returns a jwt-token familiar from [第4章](/zh/part4/密钥认证). -->
新用户Mutation很简单。 登录Mutation检查用户名/密码对是否有效。 如果它确实有效，它将返回一个类似于[第4章](/zh/part4/密钥认证)的 jwt-token。

<!-- Just like in the previous case with REST, the idea now is that a logged in user adds a token they receive upon log in to all of their requests. And just like with REST, the token is added to GraphQL queries using the <i>Authorization</i> header. -->
就像以前 REST 的情况一样，现在的想法是登录用户将他们在登录时收到的令牌添加到所有请求中。 就像使用 REST 一样，令牌使用<i>Authorization</i> 头被添加到 GraphQL 查询中。

<!-- In the GraphQL-playground the header is added to a query like so -->
在 graphql playground中，头部被添加到查询中，如下所示

![](../../images/8/24.png)



<!-- Let's now expand the definition of the _server_ object by adding a third parameter [context](https://www.apollographql.com/docs/apollo-server/data/data/#context-argument) to the constructor call: -->
现在，让我们扩展服务器对象的定义，在构造函数调用中添加第三个参数[context](https://www.apollographql.com/docs/apollo-server/data/data/#context-argument) :

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

<!-- The object returned by context is given to all resolvers as their <i>third parameter</i>. Context is the right place to do things which are shared by multiple resolvers, like [user identification](https://blog.apollographql.com/authorization-in-graphql-452b1c402a9?_ga=2.45656161.474875091.1550613879-1581139173.1549828167). -->
上下文返回的对象作为第三个参数给所有解析器。 上下文是处理多个解析器共享的事情的正确地方，比如[用户识别](https://blog.apollographql.com/authorization-in-graphql-452b1c402a9?_ga=2.45656161.474875091.1550613879-1581139173.1549828167)。

<!-- So our code sets the object corresponding to the user who made the request to the _currentUser_ field of the context. If there is no user connected to the request, the value of the field is undefined.  -->
因此，我们的代码设置对应于向上下文的 currentUser 字段发出请求的用户的对象。 如果没有用户连接到请求，则该字段的值是未定义的。

<!-- The resolver of the _me_ query is very simple, it just returns the logged in user it receives in the _currentUser_ field of the third parameter of the resolver, _context_. It's worth noting that if there is no logged in user, i.e. there is no valid token in the header attached to the request, the query returns <i>null</i>: -->
_me_ 查询的解析器非常简单，它只返回它在解析器的第三个参数 context 的 currentUser 字段中接收的登录用户。 值得注意的是，如果没有登录用户，即请求的头部没有有效的令牌，查询返回<i>null</i>: 

```js
Query: {
  // ...
  me: (root, args, context) => {
    return context.currentUser
  }
},
```

### Friends list


<!-- Let's complete the application's backend so that adding and editing persons requires logging in, and added persons are automatically added to the friends list of the user.  -->
让我们完成应用的后端，以便添加和编辑人员需要登录，添加的人员将自动添加到用户的好友列表中。

<!-- Let's first remove all persons not in anyone's friends list from the database.  -->
让我们首先从数据库中删除所有不在任何人的好友列表中的人。

<!-- _addPerson_ mutation changes like so: -->
_addPerson_变化如下:

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

<!-- If a logged in user cannot be found from the context, an _AuthenticationError_ is thrown. Creating new persons is now done with _async/await_ syntax, because if the operation is successful, the created person is added to the friends list of the user.  -->
如果在上下文中找不到登录用户，将引发 AuthenticationError。 现在使用 async/await 语法创建新的 person，因为如果操作成功，创建的 person 将被添加到用户的好友列表中。

<!-- Let's also add functionality for adding an existing user to your friends list. The mutation is as follows:  -->
我们还可以添加一个功能，将现有用户添加到好友列表中:

```js
type Mutation {
  // ...
  addAsFriend(
    name: String!
  ): User
}
```


<!-- And the mutations resolver: -->
Mutation解析器:

```js
  addAsFriend: async (root, args, { currentUser }) => {
    const nonFriendAlready = (person) => 
      !currentUser.friends.map(f => f._id).includes(person._id)

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

<!-- Note how the resolver <i>destructures</i> the logged in user from the context. So instead of saving _currentUser_ to a separate variable in a function -->
注意解析器<i>是如何从上下文中删除</i> 登录用户的。 因此，不要将 currentUser 保存到函数中的一个单独的变量中

```js
addAsFriend: async (root, args, context) => {
  const currentUser = context.currentUser
```

<!-- it is received straight in the parameter definition of the function: -->
它在函数的参数定义中被直接接收:

```js
addAsFriend: async (root, args, { currentUser }) => {
```

<!-- The code of the backend can be found on [Github](https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-5) branch <i>part8-5</i>. -->
后端的代码可以在[Github](https://Github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-5)分支<i>part8-5</i> 上找到。


</div>


<div class="tasks">


### Exercises 8.13.-8.16.
#### 8.13: Database, 步骤 1
<!-- Change the library application so that it saves the data to a database. You can find the <i>mongoose schema</i> for books and authors from [here](https://github.com/fullstack-hy2020/misc/blob/master/library-schema.md). -->
更改库应用，以便将数据保存到数据库中。 你可以在[这里](https://github.com/fullstack-hy2020/misc/blob/master/library-schema.md)找到书籍和作者的<i>mongoose schema</i>。

<!-- Let's change the book graphql schema a little -->
让我们稍微修改一下图书的 graphql 模式

```js
type Book {
  title: String!
  published: Int!
  author: Author!
  genres: [String!]!
  id: ID!
}
```

<!-- so that instead of just the author's name, the book object contains all the details of the author.  -->

因此book对象不仅包含作者的姓名，还包含作者的所有详细信息。

<!-- You can assume that the user will not try to add faulty books or authors, so you don't have to care about validation errors.  -->

您可以假设用户不会尝试添加有缺陷的书籍或作者，因此您不必担心验证错误。

<!-- The following things do <i>not</i> have to work just yet -->

以下事情现在还不需要做

<!--_allBooks_ query with parameters-->
<!--<i>bookCount</i> field of an author object-->
<!--_author_ field of a book-->
<!--_editAuthor_ mutation-->
 - 使用参数进行allBooks查询
- 作者对象的bookCount字段
- 一本书的_author_字段
- editAuthorMutation

#### 8.14: Database, 步骤 2

<!-- Complete the program so that all queries (except _allBooks_ with the parameter _author_ ) and mutations work.  -->

<!-- You might find this [useful](https://docs.mongodb.com/manual/reference/operator/query/in/). -->

完成该程序，以便所有查询（带有参数author的allBooks除外）和Mutation均起作用。

您可能会发现这很有用。

#### 8.15 Database, 步骤 3

<!-- Complete the program so that database validation errors (e.g. too short book title or author name) are handled sensibly. This means that they cause _UserInputError_ with a suitable error message to be thrown.  -->

完成程序，以便合理处理数据库验证错误（例如，书名或作者姓名太短）。 这意味着它们会引发带有适当错误消息的UserInputError。


#### 8.16 user and logging in

<!-- Add user management to your application. Expand the schema like so: -->

将用户管理添加到您的应用程序。 像这样展开模式：

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

<!-- Create resolvers for query _me_ and the new mutations _createUser_ and  -->
为查询 _me_ 创建解析器和新建Mutation解析器 _createUser_ 和 _login_

<!-- _login_. Like in the course material, you can assume all users have the same hardcoded password.  -->
与课程资料中一样，您可以假设所有用户都有相同的硬编码密码。

<!-- Make the mutations _addBook_ and _editAuthor_ possible only if the request includes a valid token.  -->
只有在请求包含有效token的情况下，才能使Mutation addBook 和 editAuthor 成为可能。

<!-- (Don't worry about fixing the frontend for the moment.) -->
（现在不用担心修改前端）


</div>

