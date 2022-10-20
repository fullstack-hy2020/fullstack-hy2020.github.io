---
mainImage: ../../../images/part-8.svg
part: 8
letter: e
lang: zh
---
<div class="content">


<!-- We are approaching the end of this part. Let's finish by having a look at a few more details of GraphQL.-->
 我们已经接近这部分的尾声了。让我们最后再看看GraphQL的一些细节。

### Fragments

<!-- It is pretty common in GraphQL that multiple queries return similar results. For example, the query for the details of a person-->
在GraphQL中，多个查询返回类似的结果是很常见的。例如，对一个人的详细资料的查询

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
 和所有的人的查询

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
都会返回人。当选择要返回的字段时，两个查询必须定义完全相同的字段。

<!-- These kinds of situations can be simplified with the use of [fragments](https://graphql.org/learn/queries/#fragments). Let's declare a fragment for selecting all fields of a person:-->
这种情况可以通过使用[fragments](https://graphql.org/learn/queries/#fragments)来简化。让我们声明一个片段来选择一个人的所有字段。

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
 有了这个片段，我们可以用紧凑的形式进行查询。

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
 片段<i><strong>不是</strong></i>定义在GraphQL模式中，而是在客户端中。当客户端使用这些片段进行查询时，这些片段必须被声明。

<!-- In principle, we could declare the fragment with each query like so:-->
 原则上，我们可以像这样在每个查询中声明片段。

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
 然而，最好是一次性声明片段并将其保存在一个变量中。

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
 这样声明后，该片段可以用[美元符号和大括号](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)放置到任何查询或改变中。

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
 除了查询和改变类型之外，GraphQL还提供了第三种操作类型。[subscriptions](https://www.apollographql.com/docs/react/data/subscriptions/)。通过订阅，客户可以<i>订阅</i>关于服务器中变化的更新。

<!-- Subscriptions are radically different from anything we have seen in this course so far. Until now, all interaction between browser and server was due to a React application in the browser making HTTP requests to the server. GraphQL queries and mutations have also been done this way.-->
 订阅与我们到目前为止在本课程中看到的任何东西都有根本的不同。到目前为止，浏览器和服务器之间的所有交互都是由于浏览器中的React应用向服务器发出HTTP请求。GraphQL查询和改变也是这样做的。
<!-- With subscriptions, the situation is the opposite. After an application has made a subscription, it starts to listen to the server.-->
 有了订阅，情况就相反了。在一个应用进行了订阅后，它开始监听服务器。
<!-- When changes occur on the server, it sends a notification to all of its <i>subscribers</i>.-->
当服务器上发生变化时，它会向所有的<i>订阅者</i>发送一个通知。

<!-- Technically speaking, the HTTP protocol is not well-suited for communication from the server to the browser. So, under the hood, Apollo uses [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) for server subscriber communication.-->
从技术上讲，HTTP协议并不适合于从服务器到浏览器的通信。因此，Apollo使用[WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)进行服务器用户的通信。

### Refactoring the backend

<!-- Since version 3.0 Apollo Server has not provided support for subscriptions out of the box so we need to do some changes to get it set up. Let us also clean the app structure a bit.-->
 自从3.0版本以来，Apollo服务器没有提供对订阅的支持，所以我们需要做一些改变来设置它。让我们也清理一下应用的结构。

<!-- Let us start by extracting the schema definition to file-->
 让我们从提取模式定义到文件开始
<i>schema.js</i>

```js
const { gql } = require('apollo-server')

const typeDefs = gql`
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
解析器的定义被移到文件<i>resolvers.js</i>中。

```js
const { UserInputError, AuthenticationError } = require('apollo-server')
const jwt = require('jsonwebtoken')
const Person = require('./models/person')
const User = require('./models/user')

const JWT_SECRET = 'NEED_HERE_A_SECRET_KEY'

const resolvers = {
  Query: {
    personCount: async () => Person.collection.countDocuments(),
    allPersons: async (root, args) => {
      if (!args.phone) {
        return Person.find({})
      }

      return Person.find({ phone: { $exists: args.phone === 'YES' } })
    },
    findPerson: async (root, args) => Person.findOne({ name: args.name }),
    me: (root, args, context) => {
      return context.currentUser
    },
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
    addPerson: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }

      const person = new Person({ ...args })
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
      return person.save()
    },
    createUser: async (root, args) => {
      const user = new User({ username: args.username })

      return user.save().catch((error) => {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new UserInputError('wrong credentials')
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, JWT_SECRET) }
    },
    addAsFriend: async (root, args, { currentUser }) => {
      const nonFriendAlready = (person) =>
        !currentUser.friends.map(f => f._id.toString()).includes(person._id.toString())

      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }

      const person = await Person.findOne({ name: args.name })
      if (nonFriendAlready(person)) {
        currentUser.friends = currentUser.friends.concat(person)
      }

      await currentUser.save()

      return currentUser
    },
  },
}

module.exports = resolvers
```

<!-- Next we will replace Apollo Server with [Apollo Server Express](https://www.apollographql.com/docs/apollo-server/integrations/middleware/#apollo-server-express). Following libraries are installed-->
 接下来我们将用[Apollo Server Express](https://www.apollographql.com/docs/apollo-server/integrations/middleware/#apollo-server-express)替换Apollo服务器。下面的库被安装

```
npm install apollo-server-express apollo-server-core express @graphql-tools/schema
```
<!-- and the file <i>index.js</i> changes to:-->
并且文件<i>index.js</i>改变为。

```js
const { ApolloServer } = require('apollo-server-express')
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const express = require('express')
const http = require('http')

const jwt = require('jsonwebtoken')

const JWT_SECRET = 'NEED_HERE_A_SECRET_KEY'

const mongoose = require('mongoose')

const User = require('./models/user')

const typeDefs = require('./schema')
const resolvers = require('./resolvers')

const MONGODB_URI =
  'MONGODB_URI'

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

  const schema = makeExecutableSchema({ typeDefs, resolvers })

  const server = new ApolloServer({
    schema,
    context: async ({ req }) => {
      const auth = req ? req.headers.authorization : null
      if (auth && auth.toLowerCase().startsWith('bearer ')) {
        const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET)
        const currentUser = await User.findById(decodedToken.id).populate(
          'friends'
        )
        return { currentUser }
      }
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  })

  await server.start()

  server.applyMiddleware({
    app,
    path: '/',
  })

  const PORT = 4000

  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}`)
  )
}

// call the function that does the setup and starts the server
start()
```

<!-- The backend code can be found on [GitHub](https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-6), branch <i>part8-6</i>.-->
 后台代码可以在[GitHub](https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-6)找到，分支<i>part8-6</i>。

### Subscriptions on the server


<!-- Let's implement subscriptions for subscribing for notifications about new persons added.-->
 让我们实现订阅，以订阅关于新增人员的通知。

<!-- The schema changes like so:-->
模式是这样变化的。

```js
type Subscription {
  personAdded: Person!
}
```

<!-- So when a new person is added, all of its details are sent to all subscribers.-->
 所以当一个新的人被添加时，它的所有细节都会被发送给所有的订阅者。

<!-- First, we have to install two packages for adding subscriptions to GraphQL:-->
 首先，我们要安装两个包，用于在GraphQL中添加订阅。

```
npm install subscriptions-transport-ws graphql-subscriptions
```

<!-- The file <i>index.js</i> is changed to-->
 文件<i>index.js</i>被改为

```js
// highlight-start
const { execute, subscribe } = require('graphql')
const { SubscriptionServer } = require('subscriptions-transport-ws')
// highlight-end

// ...

const start = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  const schema = makeExecutableSchema({ typeDefs, resolvers })

// highlight-start
  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
    },
    {
      server: httpServer,
      path: '',
    }
  )
  // highlight-end

  const server = new ApolloServer({
    schema,
    context: async ({ req }) => {
      const auth = req ? req.headers.authorization : null
      if (auth && auth.toLowerCase().startsWith('bearer ')) {
        const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET)
        const currentUser = await User.findById(decodedToken.id).populate(
          'friends'
        )
        return { currentUser }
      }
    },
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      // highlight-start
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close()
            },
          }
        },
      },
      // highlight-end
    ],
  })

  await server.start()

  server.applyMiddleware({
    app,
    path: '/',
  })

  const PORT = 4000

  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}`)
  )
}

start()

```

<!-- The subscription _personAdded_ needs a resolver. The _addPerson_ resolver also has to be modified so that it sends a notification to subscribers.-->
 订阅_personAdded_需要一个解析器。_addPerson_的解析器也要修改，以便向订阅者发送通知。

<!-- The required changes are as follows:-->
 需要的修改如下。

```js
const { PubSub } = require('graphql-subscriptions') // highlight-line
const pubsub = new PubSub() // highlight-line

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

      pubsub.publish('PERSON_ADDED', { personAdded: person })  // highlight-line

      return person
    },
  },
  // highlight-start
  Subscription: {
    personAdded: {
      subscribe: () => pubsub.asyncIterator(['PERSON_ADDED'])
    },
  },
  // highlight-end
```

<!-- With subscriptions, the communication happens using the [publish-subscribe](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) principle utilizing the object [PubSub](https://www.apollographql.com/docs/apollo-server/data/subscriptions/#the-pubsub-class). Adding a new person <i>publishes</i> a notification about the operation to all subscribers with PubSub's method _publish_.-->
 通过订阅，通信是利用对象[PubSub](https://www.apollographql.com/docs/apollo-server/data/subscriptions/#the-pubsub-class)的[发布-订阅](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern)原则进行的。添加一个新的人<i>发布</i>一个关于该操作的通知给所有使用PubSub's方法_publish_的订阅者。

<!-- _personAdded_ subscriptions resolver registers all of the subscribers by returning them a suitable [iterator object](https://www.apollographql.com/docs/apollo-server/data/subscriptions/#listening-for-events).-->
 _personAdded_订阅解析器通过返回一个合适的[迭代器对象](https://www.apollographql.com/docs/apollo-server/data/subscriptions/#listening-for-events)来注册所有的订阅者。

<!-- It's possible to test the subscriptions with the Apollo Explorer like this:-->
 可以这样用Apollo Explorer来测试订阅。

![](../../images/8/31x.png)

<!-- When the blue button <i>PersonAdded</i> is pressed Explorer starts to wait for a new person to be added. On addition the info of the added person appears in the right side of the Explorer.-->
 当蓝色按钮<i>PersonAdded</i>被按下时，资源管理器开始等待一个新的人被添加。一旦添加，添加的人的信息就会出现在资源管理器的右侧。

<!-- The backend code can be found on [GitHub](https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-7), branch <i>part8-7</i>.-->
 后台代码可以在[GitHub](https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-7)找到，分支<i>part8-7</i>。

### Subscriptions on the client

<!-- In order to use subscriptions in our React application, we have to do some changes, especially on its [configuration](https://www.apollographql.com/docs/react/data/subscriptions/).-->
 为了在我们的React应用中使用订阅，我们必须做一些改变，特别是在其[配置](https://www.apollographql.com/docs/react/data/subscriptions/)上。
<!-- The configuration in <i>index.js</i> has to be modified like so:-->
 <i>index.js</i>中的配置必须这样修改。

```js
import {
  ApolloClient, ApolloProvider, HttpLink, InMemoryCache,
  split  // highlight-line
} from '@apollo/client'
import { setContext } from 'apollo-link-context'

// highlight-start
import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/client/link/ws'
// highlight-end

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('phonenumbers-user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}` : null,
    }
  }
})

const httpLink = new HttpLink({
  uri: 'http://localhost:4000',
})

// highlight-start
const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: {
    reconnect: true
  }
})
// highlight-end

// highlight-start
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink),
)
// highlight-end

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink // highlight-line
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
)
```

<!-- For this to work, we have to install some dependencies:-->
为了让它工作，我们必须安装一些依赖项。

```bash
npm install @apollo/client subscriptions-transport-ws
```

<!-- The new configuration is due to the fact that the application must have an HTTP connection as well as a WebSocket connection to the GraphQL server.-->
 新的配置是由于应用必须有一个HTTP连接，以及一个与GraphQL服务器的WebSocket连接。

```js
const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: { reconnect: true }
})

const httpLink = createHttpLink({
  uri: 'http://localhost:4000',
})
```

<!-- The subscriptions are done using the [useSubscription](https://www.apollographql.com/docs/react/api/react/hooks/#usesubscription) hook function.-->
 订阅是使用[useSubscription](https://www.apollographql.com/docs/react/api/react/hooks/#usesubscription)挂钩函数完成的。

<!-- Let's modify the code like so:-->
 让我们这样修改代码。

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
// highlight-end

import {
  useQuery, useMutation, useSubscription, useApolloClient // highlight-line
} from '@apollo/client'

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


<!-- When a new person is now added to the phonebook, no matter where it's done, the details of the new person are printed to the client’s console:-->
 当一个新的人被添加到电话簿中，无论在哪里完成，新的人的详细信息都会被打印到客户端的控制台。

![](../../images/8/32e.png)


<!-- When a new person is added, the server sends a notification to the client, and the callback function defined in the _onData_ attribute is called and given the details of the new person as parameters.-->
 当一个新的人被添加时，服务器向客户端发送一个通知，在_onData_属性中定义的回调函数被调用，并给出新的人的细节作为参数。

<!-- Let's extend our solution so that when the details of a new person are received, the person is added to the Apollo cache, so it is rendered to the screen immediately.-->
 让我们扩展我们的解决方案，当收到一个新的人的详细资料时，这个人被添加到Apollo缓存中，所以它被立即渲染到屏幕上。

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

<!-- Our solution has a small problem: a person is added to the cache and also rendered twice since the component _PersonForm_ is also adding it to the cache.-->
 我们的解决方案有一个小问题：一个人被添加到缓存中，也被渲染了两次，因为组件_PersonForm_也在将其添加到缓存中。

<!-- Let us now fix the problem by ensuring that a person is not added twice in the cache:-->
 现在让我们通过确保一个人不会被添加到缓存中两次来解决这个问题。

```js
// highlight-start
// function that takes care of manipulating cache
export const updateCache = (cache, query, addedPerson) => {
  const uniqByName = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.name
      return seen.has(k) ? false : seen.add(k)
    })
  }

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

<!-- The function _updateCache_ can also be used in _PersonForm_ for the cache update:-->
 函数_updateCache_也可用于_PersonForm_的缓存更新。

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
 客户端的最终代码可以在[GitHub](https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-9)上找到，分支<i>part8-9</i>。

### n+1 problem

<!-- First of all, you'll need to enable a debugging option via _mongoose_ in your backend project directory, by adding a line of code as shown below:-->
 首先，你需要在你的后台项目目录中通过_mongoose_启用一个调试选项，添加一行代码，如下所示。

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

<!-- Let's add some things to the backend. Let's modify the schema so that a <i>Person</i> type has a _friendOf_ field, which tells whose friends list the person is on.-->
 让我们在后端添加一些东西。让我们修改模式，使<i>Person</i>类型有一个_friendOf_字段，它告诉人们这个人在谁的朋友名单上。

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
该应用应该支持以下查询。

```js
query {
  findPerson(name: "Leevi Hellas") {
    friendOf {
      username
    }
  }
}
```

<!-- Because _friendOf_ is not a field of <i>Person</i> objects on the database, we have to create a resolver for it, which can solve this issue. Let's first create a resolver that returns an empty list:-->
 因为_friendOf_不是数据库中<i>Person</i>对象的字段，我们必须为它创建一个解析器，它可以解决这个问题。让我们首先创建一个返回空列表的解析器。

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

<!-- The parameter _root_ is the person object for which a friends list is being created, so we search from all _User_ objects the ones which have root._id in their friends list:-->
 参数_root_是正在创建朋友列表的人的对象，所以我们从所有的_User_对象中搜索那些在朋友列表中有root._id的对象。

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
 现在应用工作了。


<!-- We can immediately do even more complicated queries. It is possible for example to find the friends of all users:-->
 我们可以立即进行更复杂的查询。例如，有可能找到所有用户的朋友。

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
 然而，我们的解决方案有一个问题：它对数据库的查询量过大。如果我们把每一个查询记录到数据库，就像这样，例如。
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

<!-- and considering we have 5 persons saved, and we query _allPersons_ without _phone_ as argument, we see an absurd amount of queries like below.-->
并且考虑到我们有5个人被保存，并且我们查询_allPersons_，没有_phone_作为参数，我们看到一个荒谬的查询量，如下。

<pre>
Person.find
User.find
User.find
User.find
User.find
User.find
</pre>

<!-- So even though we primarily do one query for all persons, every person causes one more query in their resolver.-->
 所以尽管我们主要对所有的人做一个查询，但每个人都会在他们的解析器中引起一个更多的查询。

<!-- This is a manifestation of the famous [n+1 problem](https://www.google.com/search?q=n%2B1+problem), which appears every once in a while in different contexts, and sometimes sneaks up on developers without them noticing.-->
这是著名的[n+1问题](https://www.google.com/search?q=n%2B1+problem)的一种表现，它在不同的背景下时常出现，有时会在开发者不知不觉中悄悄出现。

<!-- The right solution for the n+1 problem depends on the situation. Often, it requires using some kind of a join query instead of multiple separate queries.-->
 n+1问题的正确解决方案取决于情况。通常，它需要使用某种连接查询，而不是多个单独的查询。

<!-- In our situation, the easiest solution would be to save whose friends list they are on on each _Person_ object:-->
 在我们的情况下，最简单的解决方案是在每个_Person_对象上保存他们的朋友列表。

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

<!-- Then we could do a "join query", or populate the _friendOf_ fields of persons when we fetch the _Person_ objects:-->
 然后我们可以做一个 "连接查询"，或者在我们获取_Person_对象的时候填充_friendOf_字段。

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


<!-- After the change, we would not need a separate resolver for the _friendOf_ field.-->
 改变之后，我们就不需要为_friendOf_字段单独的解析器了。


<!-- The allPersons query <i>does not cause</i> an n+1 problem, if we only  fetch the name and the phone number:-->
 如果我们只获取姓名和电话号码，allPersons查询<i>不会导致</i>n+1的问题。

```js
query {
  allPersons {
    name
    phone
  }
}
```

<!-- If we modify _allPersons_ to do a join query because it sometimes causes an n+1 problem, it becomes heavier when we don't need the information on related persons. By using the [fourth parameter](https://www.apollographql.com/docs/apollo-server/data/resolvers/#resolver-arguments) of resolver functions, we could optimize the query even further. The fourth parameter can be used to inspect the query itself, so we could do the join query only in cases with a predicted threat of n+1 problems. However, we should not jump into this level of optimization before we are sure it's worth it.-->
 如果我们修改_allPersons_做一个连接查询，因为它有时会引起一个n+1的问题，当我们不需要相关人员的信息时，它就会变得更重。通过使用解析器函数的[第四参数](https://www.apollographql.com/docs/apollo-server/data/resolvers/#resolver-arguments)，我们可以进一步优化查询。第四个参数可以用来检查查询本身，所以我们可以只在预测有n+1个问题威胁的情况下进行连接查询。然而，在我们确定值得这样做之前，我们不应该跳到这个级别的优化。

<!-- [In the words of Donald Knuth](https://en.wikiquote.org/wiki/Donald_Knuth):-->
 [用Donald Knuth的话说](https://en.wikiquote.org/wiki/Donald_Knuth)。

<!-- > <i>Programmers waste enormous amounts of time thinking about, or worrying about, the speed of noncritical parts of their programs, and these attempts at efficiency actually have a strong negative impact when debugging and maintenance are considered. We should forget about small efficiencies, say about 97% of the time: <strong>premature optimization is the root of all evil.</strong></i>-->
 > <i>程序员们浪费了大量的时间来考虑或担心他们程序中非关键部分的速度，而当考虑到调试和维护时，这些对效率的尝试实际上有很大的负面影响。我们应该忘记小的效率，比如说大约97%的时间。<strong>过早的优化是万恶之源。</strong></i>。

<!-- Facebook's [DataLoader](https://github.com/facebook/dataloader) library offers a good solution for the n+1 problem among other issues. More about using DataLoader with Apollo server [here](https://www.robinwieruch.de/graphql-apollo-server-tutorial/#graphql-server-data-loader-caching-batching) and [here](http://www.petecorey.com/blog/2017/08/14/batching-graphql-queries-with-dataloader/).-->
 Facebook's [DataLoader](https://github.com/facebook/dataloader) 库为n+1问题以及其他问题提供了一个很好的解决方案。更多关于在Apollo服务器上使用DataLoader的信息[这里](https://www.robinwieruch.de/graphql-apollo-server-tutorial/#graphql-server-data-loader-caching-batching)和[这里](http://www.petecorey.com/blog/2017/08/14/batching-graphql-queries-with-dataloader/)。

### Epilogue

<!-- The application we created in this part is not optimally structured: we did some cleanups but much would still need to be done. Examples for better structuring of GraphQL applications can be found on the internet. For example, for the server-->
 我们在这部分创建的应用的结构并不理想：我们做了一些清理工作，但仍需要做很多事情。在互联网上可以找到更好的GraphQL应用结构的例子。例如，对于服务器
<!-- [here](https://blog.apollographql.com/modularizing-your-graphql-schema-code-d7f71d5ed5f2) and the client [here](https://medium.com/@peterpme/thoughts-on-structuring-your-apollo-queries-mutations-939ba4746cd8).-->
 [这里](https://blog.apollographql.com/modularizing-your-graphql-schema-code-d7f71d5ed5f2)和客户端[这里](https://medium.com/@peterpme/thoughts-onstructuring-your-apollo-queries-mutations-939ba4746cd8) 。

<!-- GraphQL is already a pretty old technology, having been used by Facebook since 2012, so we can see it as "battle-tested" already. Since Facebook published GraphQL in 2015, it has slowly gotten more and more attention, and might in the near future threaten the dominance of REST. The death of REST has also already been [predicted](https://www.stridenyc.com/podcasts/52-is-2018-the-year-graphql-kills-rest). Even though that will not happen quite yet, GraphQL is absolutely worth [learning](https://blog.graphqleditor.com/javascript-predictions-for-2019-by-npm/).-->
 GraphQL已经是一个相当古老的技术，从2012年开始被Facebook使用，所以我们可以看到它已经是 "经过战斗考验的"。自从Facebook在2015年发布GraphQL以来，它慢慢得到了越来越多的关注，并可能在不久的将来威胁到REST的统治地位。REST的死亡也已经被[预测]了（https://www.stridenyc.com/podcasts/52-is-2018-the-year-graphql-kills-rest）。即使这还不会发生，GraphQL也绝对值得[学习](https://blog.graphqleditor.com/javascript-predictions-for-2019-by-npm/)。

</div>

<div class="tasks">

### Exercises 8.23.-8.26.

#### 8.23: Subscriptions - server

<!-- Do a backend implementation for subscription _bookAdded_, which returns the details of all new books to its subscribers.-->
为订阅_bookAdded_做一个后端实现，它将所有新书的细节返回给它的订阅者。

#### 8.24: Subscriptions - client, part 1

<!-- Start using subscriptions in the client, and subscribe to _bookAdded_. When new books are added, notify the user. Any method works. For example, you can use the [window.alert](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert) function.-->
在客户端开始使用订阅，并订阅_bookAdded_。当新书被添加时，通知用户。任何方法都可以。例如，你可以使用[window.alert](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert)函数。

#### 8.25: Subscriptions - client, part 2

<!-- Keep the application's view updated when the server notifies about new books. You can test your implementation by opening the app in two browser tabs and adding a new book in one tab. Adding the new book should update the view in both tabs.-->
当服务器通知新书时，保持应用的视图更新。你可以通过在两个浏览器标签中打开应用，在一个标签中添加新书来测试你的实现。添加新书应该更新两个标签的视图。

#### 8.26: n+1

<!-- Solve the n+1 problem of the following query using any method you like.-->
 用任何你喜欢的方法解决下面查询的n+1问题。

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
 这一部分的练习是通过[提交系统](https://studies.cs.helsinki.fi/stats/courses/fs-graphql)提交的，就像前几部分一样，但与前几部分不同，提交到不同的 "课程实例"。请记住，你必须完成至少22道练习才能通过这一部分!

<!-- Once you have completed the exercises and want to get the credits, let us know through the exercise submission system that you have completed the course:-->
一旦你完成了练习并想获得学分，请通过练习提交系统告诉我们你已经完成了课程。

![Submissions](../../images/11/21.png)

<!-- Note that the "exam done in Moodle" note refers to the [Full Stack Open course's exam](/en/part0/general_info#sign-up-for-the-exam), which has to be completed before you can earn credits from this part.-->
 注意 "在Moodle中完成考试 "的说明是指[全栈开放课程的考试](/en/part0/general_info#sign-up-for-the-exam)，在你从这部分获得学分之前必须完成。

<!-- **Note** that you need a registration to the corresponding course part for getting the credits registered, see [here](/en/part0/general_info#parts-and-completion) for more information.-->
 **注意**你需要注册相应的课程部分以获得注册的学分，更多信息见[这里](/en/part0/general_info#parts-and-completion)。

<!-- You can download the certificate for completing this part by clicking one of the flag icons. The flag icon corresponds to the certificate's language.-->
 你可以通过点击其中一个旗帜图标下载完成这部分的证书。旗帜图标与证书的语言相对应。

</div>
