---
mainImage: ../../../images/part-8.svg
part: 8
letter: e
lang: zh
---
<div class="content">

<!-- We are approaching the end of this part. Let''s finish by having a look at a few more details of GraphQL.-->
我們快要到達這一部分的結尾了。讓我們來看看 GraphQL 的一些更多細節吧。

### Fragments

<!-- It is pretty common in GraphQL that multiple queries return similar results. For example, the query for the details of a person-->
can also return their address.

在GraphQL中，多个查询返回类似的结果是很常见的。例如，查询一个人的详细信息也可以返回他们的地址。

```js
query {
  findPerson(name: "Pekka Mikkola") {
    name
    phone
    address{
      street
      city
    }
  }
}
```

<!-- and the query for all persons-->
查詢所有人：

SELECT * FROM Persons

```js
query {
  allPersons {
    name
    phone
    address{
      street
      city
    }
  }
}
```

<!-- both return persons. When choosing the fields to return, both queries have to define exactly the same fields.-->
当选择要返回的字段时，两个查询必须完全定义相同的字段。

<!-- These kinds of situations can be simplified with the use of [fragments](https://graphql.org/learn/queries/#fragments). Let''s declare a fragment for selecting all fields of a person:-->
这种情况可以通过使用[片段](https://graphql.org/learn/queries/#fragments)来简化。让我们声明一个用于选择人的所有字段的片段：

```js
fragment PersonDetails on Person {
  name
  phone
  address {
    street
    city
  }
}
```

<!-- With the fragment, we can do the queries in a compact form:-->
随着片段，我们可以用紧凑的形式做查询：

```js
query {
  allPersons {
    ...PersonDetails // highlight-line
  }
}

query {
  findPerson(name: "Pekka Mikkola") {
    ...PersonDetails // highlight-line
  }
}
```

<!-- The fragments <i><strong>are not</strong></i> defined in the GraphQL schema, but in the client. The fragments must be declared when the client uses them for queries.-->
<i><strong>不是</strong></i>在GraphQL架构中定义的片段，而是在客户端中定义的。当客户端使用它们进行查询时，必须声明片段。

<!-- In principle, we could declare the fragment with each query like so:-->
原則上，我們可以像這樣宣告每個查詢的片段：

```js
export const FIND_PERSON = gql`
  query findPersonByName($nameToSearch: String!) {
    findPerson(name: $nameToSearch) {
      ...PersonDetails
    }
  }

  fragment PersonDetails on Person {
    name
    phone
    address {
      street
      city
    }
  }
`
```

<!-- However, it is much better to declare the fragment once and save it to a variable.-->
然而，最好是只声明一次片段，并将其保存到一个变量中。

```js
const PERSON_DETAILS = gql`
  fragment PersonDetails on Person {
    id
    name
    phone
    address {
      street
      city
    }
  }
`
```

<!-- Declared like this, the fragment can be placed to any query or mutation using a [dollar sign and curly braces](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals):-->
声明如此，该片段可以使用[美元符号和大括号]（https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals）放置到任何查询或变异：

```js
export const FIND_PERSON = gql`
  query findPersonByName($nameToSearch: String!) {
    findPerson(name: $nameToSearch) {
      ...PersonDetails
    }
  }
  ${PERSON_DETAILS}
`
```

### Subscriptions

<!-- Along with query and mutation types, GraphQL offers a third operation type: [subscriptions](https://www.apollographql.com/docs/react/data/subscriptions/). With subscriptions, clients can <i>subscribe</i> to updates about changes in the server.-->
随着查询和变更类型，GraphQL提供了第三种操作类型：[订阅](https://www.apollographql.com/docs/react/data/subscriptions/)。 通过订阅，客户端可以<i>订阅</i>有关服务器更改的更新。

<!-- Subscriptions are radically different from anything we have seen in this course so far. Until now, all interaction between browser and server was due to a React application in the browser making HTTP requests to the server. GraphQL queries and mutations have also been done this way.-->
訂閱與我們在本課程中看到的任何東西都大不相同。到目前為止，瀏覽器和伺服器之間的所有交互都是由瀏覽器中的React應用程序向伺服器發出HTTP請求而實現的。 GraphQL查詢和突變也是這樣做的。
<!-- With subscriptions, the situation is the opposite. After an application has made a subscription, it starts to listen to the server.-->
随着订阅，情况恰恰相反。在应用程序已经做出订阅之后，它开始侦听服务器。
<!-- When changes occur on the server, it sends a notification to all of its <i>subscribers</i>.-->
当服务器发生变化时，它会向所有<i>订阅者</i>发送通知。

<!-- Technically speaking, the HTTP protocol is not well-suited for communication from the server to the browser. So, under the hood, Apollo uses [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) for server subscriber communication.-->
技術上來說，HTTP 協定不適合用於從伺服器到瀏覽器的通訊。因此，Apollo 在底層使用[WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)來進行伺服器訂閱通訊。

### Refactoring the backend

<!-- Since version 3.0 Apollo Server does not support subscriptions out of the box so we need to do some changes before we set up subscriptions. Let us also clean the app structure a bit.-->
自 3.0 版本以来，Apollo Server 不再支持预订，因此我们需要做一些更改才能设置订阅。让我们也清理一下应用结构。

<!-- Let us start by extracting the schema definition to file-->
让我们从提取模式定义到文件开始
<i>schema.js</i>

```js
const typeDefs = `
  type User {
    username: String!
    friends: [Person!]!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Address {
    street: String!
    city: String!
  }

  type Person {
    name: String!
    phone: String
    address: Address!
    id: ID!
  }

  enum YesNo {
    YES
    NO
  }

  type Query {
    personCount: Int!
    allPersons(phone: YesNo): [Person!]!
    findPerson(name: String!): Person
    me: User
  }

  type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String!
      city: String!
    ): Person
    editNumber(name: String!, phone: String!): Person
    createUser(username: String!): User
    login(username: String!, password: String!): Token
    addAsFriend(name: String!): User
  }
`
module.exports = typeDefs
```

<!-- The resolvers definition is moved to the file <i>resolvers.js</i>-->
<i>resolvers.js</i> 的定义被移到了文件中。

```js
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const Person = require('./models/person')
const User = require('./models/user')

const resolvers = {
  Query: {
    personCount: async () => Person.collection.countDocuments(),
    allPersons: async (root, args, context) => {
      if (!args.phone) {
        return Person.find({})
      }

      return Person.find({ phone: { $exists: args.phone === 'YES'  }})
    },
    findPerson: async (root, args) => Person.findOne({ name: args.name }),
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Person: {
    address: ({ street, city }) => {
      return {
        street,
        city,
      }
    },
  },
  Mutation: {
    addPerson: async (root, args, context) => {
      const person = new Person({ ...args })
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      try {
        await person.save()
        currentUser.friends = currentUser.friends.concat(person)
        await currentUser.save()
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
    editNumber: async (root, args) => {
      const person = await Person.findOne({ name: args.name })
      person.phone = args.phone

      try {
        await person.save()
      } catch (error) {
        throw new GraphQLError('Editing number failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }

      return person
    },
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
          extensions: { code: 'BAD_USER_INPUT' }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
    addAsFriend: async (root, args, { currentUser }) => {
      const nonFriendAlready = (person) =>
        !currentUser.friends.map(f => f._id.toString()).includes(person._id.toString())

      if (!currentUser) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' }
        })
      }

      const person = await Person.findOne({ name: args.name })
      if ( nonFriendAlready(person) ) {
        currentUser.friends = currentUser.friends.concat(person)
      }

      await currentUser.save()

      return currentUser
    },
  }
}

module.exports = resolvers
```

<!-- So far, we have started the application with the easy-to-use function [startStandaloneServer](https://www.apollographql.com/docs/apollo-server/api/standalone/#startstandaloneserver), thanks to which the application has not had to be configured at much:-->
我们到目前为止已经使用易于使用的函数[startStandaloneServer](https://www.apollographql.com/docs/apollo-server/api/standalone/#startstandaloneserver)开始了应用程序，多亏了它，应用程序没有必要进行太多配置：

```js
const { startStandaloneServer } = require('@apollo/server/standalone')

// ...

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    /// ...
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
```

<!-- Unfortunately startStandaloneServer does not allow adding subscriptions to the application, so let''s switch to the more robust [expressMiddleware](https://www.apollographql.com/docs/apollo-server/api/express-middleware/) function. As the name of the function already suggests, it is an Express middleware, which means that Express must also be configured for the application, with the GraphQL server acting as middleware.-->
不幸的是，startStandaloneServer不允许向应用程序添加订阅，因此让我们切换到更强大的[expressMiddleware]（https://www.apollographql.com/docs/apollo-server/api/express-middleware/）功能。正如函数的名称所暗示的，它是一个Express中间件，这意味着必须为应用程序配置Express，其中GraphQL服务器作为中间件。

<!-- Let us install Express-->
让我们安装Express吧

```bash
npm install express cors
```

<!-- and the file <i>index.js</i> changes to:-->
把下面的文字從英文翻譯成中文，保持markdown格式：以及<i>index.js</i>檔案改為：

```
console.log('Hello World!');
```

```
console.log('你好世界！');
```

```js
const { ApolloServer } = require('@apollo/server')
// highlight-start
const { expressMiddleware } = require('@apollo/server/express4')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const express = require('express')
const cors = require('cors')
const http = require('http')
// highlight-end

const jwt = require('jsonwebtoken')

const JWT_SECRET = 'NEED_HERE_A_SECRET_KEY'

const mongoose = require('mongoose')

const User = require('./models/user')

const typeDefs = require('./schema')
const resolvers = require('./resolvers')

const MONGODB_URI = 'mongodb+srv://databaseurlhere'

console.log('connecting to', MONGODB_URI)

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

// setup is now within a function
const start = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  const server = new ApolloServer({
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  })

  await server.start()

  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null
        if (auth && auth.startsWith('Bearer ')) {
          const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
          const currentUser = await User.findById(decodedToken.id).populate(
            'friends'
          )
          return { currentUser }
        }
      },
    }),
  )

  const PORT = 4000

  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}`)
  )
}

start()
```

<!-- There are several changes to the code. [ApolloServerPluginDrainHttpServer](https://www.apollographql.com/docs/apollo-server/api/plugin/drain-http-server) has now been added to the configuration of the GraphQL server according to the recommendations of the documentation:-->
有几处改动到代码中，现在根据文档建议，[ApolloServerPluginDrainHttpServer](https://www.apollographql.com/docs/apollo-server/api/plugin/drain-http-server)已经添加到GraphQL服务器的配置中。

<!-- > <i>We highly recommend using this plugin to ensure your server shuts down gracefully.</i>-->
> <i>我们强烈推荐使用这个插件，以确保您的服务器优雅地关闭。</i>

<!-- The GraphQL server in the *server* variable is now connected to listen to the root of the server, i.e. to the */* route, using the *expressMiddleware* object. Information about the logged-in user is set in the context using the function we defined earlier. Since it is an Express server, the middlewares express-json and cors are also needed so that the data included in the requests is correctly parsed and so that CORS problems do not appear.-->
在*server*变量中的GraphQL服务器现在已经连接到服务器的根目录，即*/*路由，使用*expressMiddleware*对象。使用我们之前定义的函数将有关已登录用户的信息设置在上下文中。由于它是一个Express服务器，因此还需要express-json和cors中间件，以便正确解析请求中包含的数据，以及避免出现CORS问题。

<!-- Since the GraphQL server must be started before the Express application can start listening to the specified port, the entire initialization has had to be placed in an <i>async function</i>, which allows waiting for the GraphQL server to start:-->
因为GraphQL服务器必须在Express应用程序开始侦听指定端口之前启动，所以整个初始化必须放在<i>异步函数</i>中，这允许等待GraphQL服务器启动：

<!-- The backend code can be found on [GitHub](https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-6), branch <i>part8-6</i>.-->
后端代码可以在[GitHub](https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-6)上找到，分支为<i>part8-6</i>。

### Subscriptions on the server

<!-- Let''s implement subscriptions for subscribing for notifications about new persons added.-->
让我们实施订阅，以订阅有关新增人员的通知。

<!-- The schema changes like so:-->
这个模式变化如下：

```js
type Subscription {
  personAdded: Person!
}
```

<!-- So when a new person is added, all of its details are sent to all subscribers.-->
所以，当一个新人被添加时，所有的细节都会被发送给所有订阅者。

<!-- First, we have to install two packages for adding subscriptions to GraphQL and a Node.js WebSocket library:-->
首先，我们必须安装两个软件包以添加订阅到GraphQL和Node.js WebSocket库：

```bash
npm install graphql-ws ws @graphql-tools/schema
```

<!-- The file <i>index.js</i> is changed to-->
<i>index.html</i>

文件<i>index.js</i>已改为<i>index.html</i>

```js
// highlight-start
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/lib/use/ws')
// highlight-end

// ...

const start = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  // highlight-start
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
  })
  // highlight-end

  // highlight-start
  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const serverCleanup = useServer({ schema }, wsServer)
  // highlight-end

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      // highlight-start
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
      // highlight-end
    ],
  })

  await server.start()

  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null
        if (auth && auth.startsWith('Bearer ')) {
          const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
          const currentUser = await User.findById(decodedToken.id).populate(
            'friends'
          )
          return { currentUser }
        }
      },
    }),
  )

  const PORT = 4000

  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}`)
  )
}

start()
```

<!-- When queries and mutations are used, GraphQL uses the HTTP protocol in the communication. In case of subscriptions, the communication between client and server happens with [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API).-->
当使用查询和变更时，GraphQL使用HTTP协议进行通信。在订阅的情况下，客户端和服务器之间的通信是通过[WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)完成的。

<!-- The above code registers a WebSocketServer object to listen the WebSocket connections, besides the usual HTTP connections that the server listens. The second part of the definition registers a function that closes the WebSocket connection on server shutdown.-->
上面的代码注册了一个WebSocketServer对象来监听WebSocket连接，除了服务器监听的通常的HTTP连接。定义的第二部分注册了一个函数，在服务器关闭时关闭WebSocket连接。
<!-- If you're interested in more details about configurations, Apollo's [documentation](https://www.apollographql.com/docs/apollo-server/data/subscriptions) explains in relative detail what each line of code does.-->
如果你对配置的更多细节感兴趣，Apollo的[文档](https://www.apollographql.com/docs/apollo-server/data/subscriptions)详细解释了每一行代码的作用。

<!-- WebSockets are a perfect match for communication in the case of GraphQL subscriptions since when WebSockets are used, also the server can initiate the communication.-->
WebSocket是GraphQL订阅的完美匹配，因为当使用WebSocket时，服务器也可以发起通信。

<!-- The subscription *personAdded* needs a resolver. The *addPerson* resolver also has to be modified so that it sends a notification to subscribers.-->
訂閱*personAdded*需要一個解析器。 *addPerson*解析器也必須被修改，以便它向訂閱者發送通知。

<!-- The required changes are as follows:-->
以下是所需的更改：

```js
// highlight-start
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()
// highlight-end

// ...

const resolvers = {
  // ...
  Mutation: {
    addPerson: async (root, args, context) => {
      const person = new Person({ ...args })
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      try {
        await person.save()
        currentUser.friends = currentUser.friends.concat(person)
        await currentUser.save()
      } catch (error) {
        throw new GraphQLError('Saving user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }

      pubsub.publish('PERSON_ADDED', { personAdded: person })  // highlight-line

      return person
    },
  },
  // highlight-start
  Subscription: {
    personAdded: {
      subscribe: () => pubsub.asyncIterator('PERSON_ADDED')
    },
  },
  // highlight-end
}
```

<!-- The following library needs to be installed-->
以下库需要安装

```bash
npm install graphql-subscriptions
```

<!-- With subscriptions, the communication happens using the [publish-subscribe](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) principle utilizing the object [PubSub](https://www.apollographql.com/docs/apollo-server/data/subscriptions#the-pubsub-class).-->
使用订阅，通信使用[发布-订阅](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern)原则，利用[PubSub](https://www.apollographql.com/docs/apollo-server/data/subscriptions#the-pubsub-class)对象。

<!-- There is only few lines of code added, but quite much is happening under the hood. The resolver of the *personAdded* subscription registers and saves info about all the clients that do the subscription. The clients are saved to an-->
array and the array is updated when a new client subscribes.

只添加了几行代码，但在幕后发生了很多事情。*personAdded* 订阅的解析器注册并保存有关所有订阅者的信息。客户端被保存到一个数组中，当新客户端订阅时数组会被更新。
<!-- ["iterator object"](https://www.apollographql.com/docs/apollo-server/data/subscriptions/#listening-for-events) called <i>PERSON\_ADDED</i>  thanks to the following code:-->
迭代对象叫做<i>PERSON_ADDED</i>，多亏了以下代码：

```js
Subscription: {
  personAdded: {
    subscribe: () => pubsub.asyncIterator('PERSON_ADDED')
  },
},
```

<!-- The iterator name is an arbitrary string, now the name follows the convention, it is the subscription name written in capital letters.-->
迭代器名称是一个任意的字符串，现在名称遵循约定，它是以大写字母写的订阅名称。

<!-- Adding a new person <i>publishes</i> a notification about the operation to all subscribers with PubSub''s method *publish*:-->
添加新人使用PubSub的*publish*方法向所有订阅者发布有关操作的通知。

```js
pubsub.publish('PERSON_ADDED', { personAdded: person })
```

<!-- Execution of this line sends a WebSocket message about the added person to all the clients registered in the iterator <i>PERSON\_ADDED</i>.-->
执行这一行将发送一条关于添加的人的WebSocket消息给迭代器<i>PERSON\_ADDED</i>中注册的所有客户端。

<!-- It''s possible to test the subscriptions with the Apollo Explorer like this:-->
这样可以用Apollo Explorer来测试订阅：

![apollo explorer showing subscriptions tab and response](../../images/8/31x.png)

<!-- When the blue button <i>PersonAdded</i> is pressed Explorer starts to wait for a new person to be added. On addition (that you need to do from another browser window) the info of the added person appears in the right side of the Explorer.-->
当蓝色按钮<i>PersonAdded</i>被按下，Explorer开始等待一个新的人被添加。添加（你需要从另一个浏览器窗口做）添加的人的信息出现在Explorer的右侧。

<!-- If the subscription does not work, check that you have correct connection settings:-->
如果订阅不起作用，请检查您是否具有正确的连接设置：

![apollo studio showing cog red arrow highlighting](../../images/8/35.png)

<!-- The backend code can be found on [GitHub](https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-7), branch <i>part8-7</i>.-->
后端代码可以在 [GitHub](https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-7) 上找到，分支为<i>part8-7</i>。

<!-- Implementing subscriptions involves a lot of configurations. You will be able to cope with the few exercises of this course without worrying much about the details. If you planning to use subsctiptions in an production use application, you should definitely read carefully Apollo''s [documentation on subscriptions](https://www.apollographql.com/docs/apollo-server/data/subscriptions).-->
实施订阅涉及许多配置。您可以轻松应对本课程的几个练习，而无需太多担心细节。如果您计划在生产使用应用程序中使用subsctiptions，则应该仔细阅读Apollo的[订阅文档](https://www.apollographql.com/docs/apollo-server/data/subscriptions)。

### Subscriptions on the client

<!-- In order to use subscriptions in our React application, we have to do some changes, especially on its [configuration](https://www.apollographql.com/docs/react/data/subscriptions/).-->
为了在我们的React应用中使用订阅，我们必须做一些更改，尤其是在[配置](https://www.apollographql.com/docs/react/data/subscriptions/)上。
<!-- The configuration in <i>index.js</i> has to be modified like so:-->
<i>index.js</i> 配置必须像这样修改：

```js
import {
  ApolloClient, InMemoryCache, ApolloProvider, createHttpLink,
  split  // highlight-line
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

// highlight-start
import { getMainDefinition } from '@apollo/client/utilities'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
// highlight-end

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('phonenumbers-user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    }
  }
})

const httpLink = createHttpLink({ uri: 'http://localhost:4000' })

// highlight-start
const wsLink = new GraphQLWsLink(
  createClient({ url: 'ws://localhost:4000' })
)
// highlight-end

// highlight-start
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  authLink.concat(httpLink)
)
// highlight-end

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink // highlight-line
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)
```

<!-- For this to work, we have to install a dependency:-->
这需要我们安装一个依赖项：

```bash
npm install graphql-ws
```

<!-- The new configuration is due to the fact that the application must have an HTTP connection as well as a WebSocket connection to the GraphQL server.-->
新的配置是由于应用程序必须具有HTTP连接以及到GraphQL服务器的WebSocket连接。

```js
const httpLink = createHttpLink({ uri: 'http://localhost:4000' })

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:4000',
  })
)
```

<!-- The subscriptions are done using the [useSubscription](https://www.apollographql.com/docs/react/api/react/hooks/#usesubscription) hook function.-->
使用[useSubscription](https://www.apollographql.com/docs/react/api/react/hooks/#usesubscription)钩子函数完成订阅。

<!-- Let''s make the following changes to the code. Add the code defining the order to the file <i>queries.js</i>:-->
让我们对代码做出以下更改。 将定义订单的代码添加到文件<i>queries.js</i>中：

```js
// highlight-start
export const PERSON_ADDED = gql`
  subscription {
    personAdded {
      ...PersonDetails
    }
  }
  ${PERSON_DETAILS}
`
```

<!-- and do the subscription in the App component:-->
### 英文

React is a JavaScript library for building user interfaces.

### 中文

React 是一个用于构建用户界面的JavaScript库。

```js
class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      subscribed: false
    }
    this.handleSubscription = this.handleSubscription.bind(this);
  }
  handleSubscription(){
    this.setState({
      subscribed: true
    });
  }
  render(){
    return (
      <div>
        {this.state.subscribed ? <p>You are subscribed!</p> : <button onClick={this.handleSubscription}>Subscribe</button>}
      </div>
    )
  }
}
``

```js

import { useQuery, useMutation, useSubscription } from '@apollo/client' // highlight-line


const App = () => {
  // ...

  useSubscription(PERSON_ADDED, {
    onData: ({ data }) => {
      console.log(data)
    }
  })

  // ...
}
```

<!-- When a new person is now added to the phonebook, no matter where it''s done, the details of the new person are printed to the client’s console:-->
当一个新的人被添加到电话簿时，无论在哪里完成，新人的详细信息都会打印到客户端的控制台：

![dev tools showing data personAdded Object with Mainroad](../../images/8/32e.png)

<!-- When a new person is added, the server sends a notification to the client, and the callback function defined in the *onData* attribute is called and given the details of the new person as parameters.-->
当添加新人员时，服务器会向客户端发送通知，并调用*onData*属性中定义的回调函数，并将新人员的详细信息作为参数给出。

<!-- Let''s extend our solution so that when the details of a new person are received, the person is added to the Apollo cache, so it is rendered to the screen immediately.-->
让我们扩展我们的解决方案，以便当收到新人的细节时，该人被添加到Apollo缓存中，因此立即呈现到屏幕上。

```js
const App = () => {
  // ...

  useSubscription(PERSON_ADDED, {
    onData: ({ data }) => {
      const addedPerson = data.data.personAdded
      notify(`${addedPerson.name} added`)

      // highlight-start
      client.cache.updateQuery({ query: ALL_PERSONS }, ({ allPersons }) => {
        return {
          allPersons: allPersons.concat(addedPerson),
        }
      })
      // highlight-end
    }
  })

  // ...
}
```

<!-- Our solution has a small problem: a person is added to the cache and also rendered twice since the component *PersonForm* is also adding it to the cache.-->
我们的解决方案有一个小问题：由于组件*PersonForm*也将其添加到缓存中，因此一个人被添加到缓存并被渲染两次。

<!-- Let us now fix the problem by ensuring that a person is not added twice in the cache:-->
让我们现在通过确保一个人不会被两次添加到缓存中来解决这个问题：

```js
// highlight-start
// function that takes care of manipulating cache
export const updateCache = (cache, query, addedPerson) => {
  // helper that is used to eliminate saving same person twice
  const uniqByName = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.name
      return seen.has(k) ? false : seen.add(k)
    })
  }
  // highlight-end

  // highlight-start
  cache.updateQuery(query, ({ allPersons }) => {
    return {
      allPersons: uniqByName(allPersons.concat(addedPerson)),
    }
  })
}
// highlight-end

const App = () => {
  const result = useQuery(ALL_PERSONS)
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  useSubscription(PERSON_ADDED, {
    onData: ({ data, client }) => {
      const addedPerson = data.data.personAdded
      notify(`${addedPerson.name} added`)
      updateCache(client.cache, { query: ALL_PERSONS }, addedPerson) // highlight-line
    },
  })

  // ...
}
```

<!-- The function *updateCache* can also be used in *PersonForm* for the cache update:-->
函数*updateCache*也可以用于*PersonForm*中的缓存更新：

```js
import { updateCache } from '../App' // highlight-line

const PersonForm = ({ setError }) => {
  // ...

  const [createPerson] = useMutation(CREATE_PERSON, {
    onError: (error) => {
      setError(error.graphQLErrors[0].message)
    },
    update: (cache, response) => {
      updateCache(cache, { query: ALL_PERSONS }, response.data.addPerson)  // highlight-line
    },
  })

  // ..
}
```

<!-- The final code of the client can be found on [GitHub](https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-9), branch <i>part8-9</i>.-->
最终的客户端代码可以在[GitHub](https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-9)上的<i>part8-9</i>分支找到。

### n+1 problem

<!-- First of all, you''ll need to enable a debugging option via *mongoose* in your backend project directory, by adding a line of code as shown below:-->
首先，您需要通过*mongoose*在后端项目目录中启用调试选项，方法是添加如下所示的一行代码：

```js
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

mongoose.set('debug', true); // highlight-line
```

<!-- Let's add some things to the backend. Let's modify the schema so that a <i>Person</i> type has a *friendOf* field, which tells whose friends list the person is on.-->
让我们在后端添加一些东西。让我们修改模式，使<i>Person</i>类型有一个*friendOf*字段，它告诉谁的朋友列表上有这个人。

```js
type Person {
  name: String!
  phone: String
  address: Address!
  friendOf: [User!]!
  id: ID!
}
```

<!-- The application should support the following query:-->
应用程序应该支持以下查询：

```js
query {
  findPerson(name: "Leevi Hellas") {
    friendOf {
      username
    }
  }
}
```

<!-- Because *friendOf* is not a field of <i>Person</i> objects on the database, we have to create a resolver for it, which can solve this issue. Let''s first create a resolver that returns an empty list:-->
因为<i>Person</i>对象在数据库中没有*friendOf*字段，我们必须为它创建一个解析器来解决这个问题。让我们先创建一个返回空列表的解析器：

```js
Person: {
  address: (root) => {
    return {
      street: root.street,
      city: root.city
    }
  },
  // highlight-start
  friendOf: (root) => {
    // return list of users
    return [
    ]
  }
  // highlight-end
},
```

<!-- The parameter *root* is the person object for which a friends list is being created, so we search from all *User* objects the ones which have root._id in their friends list:-->
参数 *root* 是要创建朋友列表的人对象，因此我们从所有的 *User* 对象中搜索那些在他们的朋友列表中有 root._id 的对象：

```js
  Person: {
    // ...
    friendOf: async (root) => {
      const friends = await User.find({
        friends: {
          $in: [root._id]
        }
      })

      return friends
    }
  },
```

<!-- Now the application works.-->
现在应用程序可以正常工作了。

<!-- We can immediately do even more complicated queries. It is possible for example to find the friends of all users:-->
我们可以立刻做更复杂的查询。例如，可以找到所有用户的朋友：

```js
query {
  allPersons {
    name
    friendOf {
      username
    }
  }
}
```

<!-- There is however one issue with our solution: it does an unreasonable amount of queries to the database. If we log every query to the database, just like this for example,-->
it will become too slow

然而，我们的解决方案存在一个问题：它对数据库做了不合理的查询。如果我们像这样记录每一个数据库查询，它会变得太慢。

```js

Query: {
  allPersons: (root, args) => {
    // highlight-start
    console.log('Person.find')
    if (!args.phone) {
      return Person.find({})
    }

    return Person.find({ phone: { $exists: args.phone === 'YES' } })
    // highlight-end
  }

// ..

},

// ..

friendOf: async (root) => {
  // highlight-start
  const friends = await User.find({ friends: { $in: [root._id] } })
  console.log("User.find")
  // highlight-end
  return friends
},
```

<!-- and considering we have 5 persons saved, and we query *allPersons* without *phone* as argument, we see an absurd amount of queries like below.-->
考虑到我们有5个被保存的人，我们查询*allPersons*没有*phone*作为参数，我们看到下面一个荒谬的查询数量。

<pre>
Person.find
User.find
User.find
User.find
User.find
User.find
</pre>

<!-- So even though we primarily do one query for all persons, every person causes one more query in their resolver.-->
所以，即使我们主要对所有人做一次查询，但每个人在其解析器中都会产生一次额外的查询。

<!-- This is a manifestation of the famous [n+1 problem](https://www.google.com/search?q=n%2B1+problem), which appears every once in a while in different contexts, and sometimes sneaks up on developers without them noticing.-->
这是一种著名的[n+1问题](https://www.google.com/search?q=n%2B1+problem)的表现，它会不时地出现在不同的背景中，有时会让开发者毫无察觉地偷偷摸摸地出现。

<!-- The right solution for the n+1 problem depends on the situation. Often, it requires using some kind of a join query instead of multiple separate queries.-->
正确解决 n+1 问题取决于具体情况。通常需要使用某种连接查询而不是多个独立查询。

<!-- In our situation, the easiest solution would be to save whose friends list they are on each *Person* object:-->
在我们的情况下，最简单的解决方案是在每个*Person*对象上保存他们所在的朋友列表：

```js
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
    minlength: 5
  },
  // highlight-start
  friendOf: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  // highlight-end
})
```

<!-- Then we could do a "join query", or populate the *friendOf* fields of persons when we fetch the *Person* objects:-->
那么我们可以做一个“联接查询”，或者在获取*Person*对象时填充*friendOf*字段：

```js
Query: {
  allPersons: (root, args) => {
    console.log('Person.find')
    if (!args.phone) {
      return Person.find({}).populate('friendOf') // highlight-line
    }

    return Person.find({ phone: { $exists: args.phone === 'YES' } })
      .populate('friendOf') // highlight-line
  },
  // ...
}
```

<!-- After the change, we would not need a separate resolver for the *friendOf* field.-->
在更改之后，我们不再需要单独的解析器来处理*friendOf*字段。

<!-- The allPersons query <i>does not cause</i> an n+1 problem, if we only  fetch the name and the phone number:-->
allPersons 查询<i>不会</i>引发 n+1 问题，只要我们只抓取姓名和电话号码。

```js
query {
  allPersons {
    name
    phone
  }
}
```

<!-- If we modify *allPersons* to do a join query because it sometimes causes an n+1 problem, it becomes heavier when we don't need the information on related persons. By using the [fourth parameter](https://www.apollographql.com/docs/apollo-server/data/resolvers/#resolver-arguments) of resolver functions, we could optimize the query even further. The fourth parameter can be used to inspect the query itself, so we could do the join query only in cases with a predicted threat of n+1 problems. However, we should not jump into this level of optimization before we are sure it's worth it.-->
如果我们修改*allPersons*来做一个联合查询，因为它有时会引起n+1问题，当我们不需要相关人员的信息时，它变得更重。通过使用[第四个参数](https://www.apollographql.com/docs/apollo-server/data/resolvers/#resolver-arguments)的解析器函数，我们可以进一步优化查询。第四个参数可用于检查查询本身，因此我们可以仅在预测出n+1问题的情况下执行联合查询。但是，在确定值得之前，我们不应跳入这个优化水平。

<!-- [In the words of Donald Knuth](https://en.wikiquote.org/wiki/Donald_Knuth):-->
> **"Premature optimization is the root of all evil."**

> **"过早的优化是万恶之源。"**

<!-- > <i>Programmers waste enormous amounts of time thinking about, or worrying about, the speed of noncritical parts of their programs, and these attempts at efficiency actually have a strong negative impact when debugging and maintenance are considered. We should forget about small efficiencies, say about 97% of the time: <strong>premature optimization is the root of all evil.</strong></i>-->
> <i>程序员会浪费大量时间思考或担心程序中不关键的部分的速度，当考虑调试和维护时，这些寻求效率的尝试实际上会产生很强的负面影响。我们应该忘记小效率，大约97％的时间：<strong>过早的优化是万恶之源。</strong></i>

<!-- GraphQL Foundation''s [DataLoader](https://github.com/graphql/dataloader) library offers a good solution for the n+1 problem among other issues. More about using DataLoader with Apollo server [here](https://www.robinwieruch.de/graphql-apollo-server-tutorial/#graphql-server-data-loader-caching-batching) and [here](http://www.petecorey.com/blog/2017/08/14/batching-graphql-queries-with-dataloader/).-->
GraphQL Foundation 的 [DataLoader](https://github.com/graphql/dataloader) 库为 n+1 问题及其他问题提供了一个很好的解决方案。更多关于使用 DataLoader 与 Apollo 服务器的信息可以参考[这里](https://www.robinwieruch.de/graphql-apollo-server-tutorial/#graphql-server-data-loader-caching-batching) 和[这里](http://www.petecorey.com/blog/2017/08/14/batching-graphql-queries-with-dataloader/)。

### Epilogue

<!-- The application we created in this part is not optimally structured: we did some cleanups but much would still need to be done. Examples for better structuring of GraphQL applications can be found on the internet. For example, for the server-->
side, this repo provides a good starting point

我们在这部分创建的应用程序没有得到最佳结构：我们做了一些清理，但仍然需要做很多工作。可以在互联网上找到更好的GraphQL应用程序结构的示例。例如，对于服务器端，这个存储库提供了一个很好的起点。
<!-- [here](https://blog.apollographql.com/modularizing-your-graphql-schema-code-d7f71d5ed5f2) and the client [here](https://medium.com/@peterpme/thoughts-on-structuring-your-apollo-queries-mutations-939ba4746cd8).-->
# 模块化你的GraphQL模式代码

最近，我们一直在考虑如何最好地组织我们的GraphQL模式代码，以便更容易地管理和测试它们。我们已经尝试了几种不同的方法，但我们最终发现了一种可以满足我们的需求的方法，即模块化我们的GraphQL模式代码。

在模块化我们的模式代码之前，我们将所有的模式代码都放在一个文件中，这导致了文件变得越来越大，并且很难管理和测试。因此，我们决定将文件分解为更小的模块，以便更容易管理和测试。

我们的模块化方法是将每个类型的模式放入单独的文件中，并且每个文件只包含一个类型的模式。这样，我们就可以更容易地管理模式，并且可以更容易地测试每个模式。

此外，我们还可以使用Apollo客户端来管理我们的GraphQL查询和变更，以便更容易地管理和测试它们。

# 模块化你的GraphQL模式代码

最近，我们一直在考虑如何最好地组织我们的GraphQL模式代码，以便更容易地管理和测试它们。我们已经尝试了几种不同的方法，但我们最终发现了一种可以满足我们的需求的方法，即模块化我们的GraphQL模式代码。

在模块化我们的模式代码之前，我们将所有的模式代码都放在一个文件中，这导致了文件变得越来越大，并且很难管理和测试。因此，我们决定将文件分解为更小的模块，以便更容易管理和测试。

我们的模块化方法是将每个类型的模式放入单独的文件中，并且每个文件只包含一个类型的模式。这样，我们就可以更容易地管理模式，并且可以更容易地测试每个模式。

此外，我们还可以使用Apollo客户端来管理我们的GraphQL查询和变更，以便更容易地管理和测试它们。

# 模块化你的GraphQL模式代码

最近，我们一直在考虑如何最好地组织我们的GraphQL模式代码，以便更容易地管理和测试它们。我们已经尝试了几种不同的方法，但我们最终发现了一种可以满足我们的需求的方法，即模块化我们的GraphQL模式代码。

在模块化我们的模式代码之前，我们将所有的模式代码都放在一个文件中，这导致了文件变得越来越大，并且很难管理和测试。因此，我们决定将文件分解为更小的模块，以便更容易管理和测试。

我们的模块化方法是将每个类型的模式放入单独的文件中，并且每个文件只包含一个类型的模式。这样，我们就可以更容易地管理模式，并且可以更容易地测试每个模式。

此外，我们还可以使用Apollo客户端来管理我们的GraphQL查询和变更，以便更容易地管理和测试它们。

# 模块化你的GraphQL模式代码

最近，我们一直在考虑如何最好地组织我们的GraphQL模式代码，以便更容易地管理和测试它们。我们已经尝试了几种不同的方法，但我们最终发现了一种可以满足我们的需求的方法，即模块化我们的GraphQL模式代码。

在模块化我们的模式代码之前，我们将所有的模式代码都放在一个文件中，这导致了文件变得越来越大，并且很难管理和测试。因此，我们决定将文件分解为更小的模块，以便更容易管理和测试。

我们的模块化方法是将每个类型的模式放入单独的文件中，并且每个文件只包含一个类型的模式。这样，我们就可以更容易地管理模式，并且可以更容易地测试每个模式。

此外，我们还可以使用Apollo客户端来管理我们的GraphQL查询和变更，以便更容易地管理和测试它们。

# 模块化你的GraphQL模式代码

最近，我们一直在考虑如何最好地组织我们的GraphQL模式代码，以便更容易地管理和测试它们。我们已经尝试了几种不同的方法，但我们最终发现了一种可以满足我们的需求的方法，即模块化我们的GraphQL模式代码。

在模块化我们的模式代码之前，我们将所有的模式代码都放在一个文件中，这导致了文件变得越来越大，并且很难管理和测试。因此，我们决定将文件分

<!-- GraphQL is already a pretty old technology, having been used by Facebook since 2012, so we can see it as "battle-tested" already. Since Facebook published GraphQL in 2015, it has slowly gotten more and more attention, and might in the near future threaten the dominance of REST. The death of REST has also already been [predicted](https://www.stridenyc.com/podcasts/52-is-2018-the-year-graphql-kills-rest). Even though that will not happen quite yet, GraphQL is absolutely worth [learning](https://blog.graphqleditor.com/javascript-predictions-for-2019-by-npm/).-->
GraphQL 已经是一项相当老的技术了，自2012年以来被Facebook使用，因此我们可以将其视为“经过战斗测试”的技术。自2015年Facebook发布GraphQL以来，它逐渐受到了越来越多的关注，并可能在不久的将来威胁REST的统治地位。REST的死亡也已经[预测](https://www.stridenyc.com/podcasts/52-is-2018-the-year-graphql-kills-rest)。尽管这还不会很快发生，但GraphQL绝对[值得学习](https://blog.graphqleditor.com/javascript-predictions-for-2019-by-npm/)。

</div>

<div class="tasks">

### Exercises 8.23.-8.26

#### 8.23: Subscriptions - server

<!-- Do a backend implementation for subscription *bookAdded*, which returns the details of all new books to its subscribers.-->
做一个后端实现 *bookAdded* 的订阅，它将所有新书的详细信息返回给它的订阅者。

#### 8.24: Subscriptions - client, part 1

<!-- Start using subscriptions in the client, and subscribe to *bookAdded*. When new books are added, notify the user. Any method works. For example, you can use the [window.alert](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert) function.-->
开始在客户端使用订阅，订阅*bookAdded*。当新书添加时，通知用户。任何方法都可以。例如，您可以使用[window.alert](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert)函数。

#### 8.25: Subscriptions - client, part 2

<!-- Keep the application''s book view updated when the server notifies about new books (you can ignore the author view!). You can test your implementation by opening the app in two browser tabs and adding a new book in one tab. Adding the new book should update the view in both tabs.-->
保持应用程序的书籍视图在服务器通知有新书籍时得以更新（可以忽略作者视图！）。您可以通过在两个浏览器标签中打开应用程序，在其中一个标签中添加新书籍来测试您的实现。添加新书籍应该更新两个标签中的视图。

#### 8.26: n+1

<!-- Solve the n+1 problem of the following query using any method you like.-->
解决以下查询的 n+1 问题，用你喜欢的任何方法。

```js
query {
  allAuthors {
    name
    bookCount
  }
}
```

### Submitting exercises and getting the credits

<!-- Exercises of this part are submitted via [the submissions system](https://studies.cs.helsinki.fi/stats/courses/fs-graphql) just like in the previous parts, but unlike previous parts, the submission goes to different "course instance". Remember that you have to finish at least 22 exercises to pass this part!-->
本部分的练习也是通过[提交系统](https://studies.cs.helsinki.fi/stats/courses/fs-graphql)提交的，就像之前的部分一样，但不同于以前的部分，提交的内容会发送到不同的“课程实例”。请记住，您必须完成至少22个练习才能通过本部分！

<!-- Once you have completed the exercises and want to get the credits, let us know through the exercise submission system that you have completed the course:-->
一旦您完成了练习，想要获得学分，请通过练习提交系统告知我们您已经完成了课程。

![Submissions](../../images/11/21.png)

<!-- **Note** that you need a registration to the corresponding course part for getting the credits registered, see [here](/en/part0/general_info#parts-and-completion) for more information.-->
**注意**：要获得学分，需要注册相应的课程部分，更多信息请参见[这里](/en/part0/general_info#parts-and-completion)。

<!-- You can download the certificate for completing this part by clicking one of the flag icons. The flag icon corresponds to the certificate''s language.-->
你可以通过点击其中一个旗帜图标来下载完成这一部分的证书。 旗帜图标对应证书的语言。

</div>
