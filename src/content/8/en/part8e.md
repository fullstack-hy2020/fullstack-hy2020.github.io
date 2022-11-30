---
mainImage: ../../../images/part-8.svg
part: 8
letter: e
lang: en
---
<div class="content">


We are approaching the end of this part. Let's finish by having a look at a few more details of GraphQL. 

### Fragments

It is pretty common in GraphQL that multiple queries return similar results. For example, the query for the details of a person

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

and the query for all persons

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

both return persons. When choosing the fields to return, both queries have to define exactly the same fields. 

These kinds of situations can be simplified with the use of [fragments](https://graphql.org/learn/queries/#fragments). Let's declare a fragment for selecting all fields of a person: 

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

With the fragment, we can do the queries in a compact form:

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

The fragments <i><strong>are not</strong></i> defined in the GraphQL schema, but in the client. The fragments must be declared when the client uses them for queries. 

In principle, we could declare the fragment with each query like so:

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

However, it is much better to declare the fragment once and save it to a variable. 

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

Declared like this, the fragment can be placed to any query or mutation using a [dollar sign and curly braces](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals):

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
  
Along with query and mutation types, GraphQL offers a third operation type: [subscriptions](https://www.apollographql.com/docs/react/data/subscriptions/). With subscriptions, clients can <i>subscribe</i> to updates about changes in the server. 

Subscriptions are radically different from anything we have seen in this course so far. Until now, all interaction between browser and server was due to a React application in the browser making HTTP requests to the server. GraphQL queries and mutations have also been done this way. 
With subscriptions, the situation is the opposite. After an application has made a subscription, it starts to listen to the server. 
When changes occur on the server, it sends a notification to all of its <i>subscribers</i>.

Technically speaking, the HTTP protocol is not well-suited for communication from the server to the browser. So, under the hood, Apollo uses [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) for server subscriber communication. 

### Refactoring the backend

Since version 3.0 Apollo Server does not support subscriptions out of the box so we need to do some changes before we set up subscriptions. Let us also clean the app structure a bit.

Let us start by extracting the schema definition to file
<i>schema.js</i>

```js
const { gql } = require('@apollo/server')

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

The resolvers definition is moved to the file <i>resolvers.js</i>

```js
const { UserInputError, AuthenticationError } = require('@apollo/server')
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

Next we will replace Apollo Server with [Apollo Server Express](https://www.apollographql.com/docs/apollo-server/integrations/middleware/#apollo-server-express). Following libraries are installed

```
npm install express cors body-parser @graphql-tools/schema
```
and the file <i>index.js</i> changes to:

```js
const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@apollo/server/express4')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const http = require('http')

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
  
  app.use(
    '/',
    cors(),
    bodyParser.json(),
    expressMiddleware(server, {
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
    }),
  );

  await server.start()

  const PORT = 4000

  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}`)
  )
}

// call the function that does the setup and starts the server
start()
```

The backend code can be found on [GitHub](https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-6), branch <i>part8-6</i>.

### Subscriptions on the server


Let's implement subscriptions for subscribing for notifications about new persons added. 

The schema changes like so:

```js
type Subscription {
  personAdded: Person!
}    
```

So when a new person is added, all of its details are sent to all subscribers.

First, we have to install two packages for adding subscriptions to GraphQL and a Node.js WebSocket library:

```
npm install graphql-subscriptions ws graphql-ws
```

The file <i>index.js</i> is changed to

```js
// highlight-start
const { execute, subscribe } = require('graphql')
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/lib/use/ws')
// highlight-end

// ...

const start = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  const schema = makeExecutableSchema({ typeDefs, resolvers })

// highlight-start
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
  })

  const serverCleanup = useServer({ schema }, wsServer)
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
              await serverCleanup.dispose()
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


When queries and mutations are used, GraphQL uses the HTTP protocol in the communication. In case of subscriptions, the communication between client and server happens with [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API).

The above code registers a WebSocketServer object to listen the WebSocket connections, besides the usual HTTP connections that the server listens. The second part of the definition registers a function that closes the WebSocket connection on server shutdown.

WebSockets are a perfect match for communication in the case of GraphQL subscriptions since when WebSockets are used, also the server can initiate the communication.

The subscription _personAdded_ needs a resolver. The _addPerson_ resolver also has to be modified so that it sends a notification to subscribers. 

The required changes are as follows:


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
      subscribe: () => pubsub.asyncIterator('PERSON_ADDED')
    },
  },
  // highlight-end
}
```



With subscriptions, the communication happens using the [publish-subscribe](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) principle utilizing the object [PubSub](https://www.apollographql.com/docs/apollo-server/data/subscriptions/#the-pubsub-class).

There is only few lines of code added, but quite much is happening under the hood. The resolver of the _personAdded_ subscription registers and saves info about all the clients that do the subscription. The clients are saved to an 
["iterator object"](https://www.apollographql.com/docs/apollo-server/data/subscriptions/#listening-for-events) called <i>PERSON\_ADDED</i>  thanks to the following code:

```js
Subscription: {
  personAdded: {
    subscribe: () => pubsub.asyncIterator('PERSON_ADDED')
  },
},
```

The iterator name is an arbitrary string, now the name follows the convention, it is the subscription name written in capital letters.

Adding a new person <i>publishes</i> a notification about the operation to all subscribers with PubSub's method _publish_:

```js
pubsub.publish('PERSON_ADDED', { personAdded: person }) 
```

Execution of this line sends a WebSocket message about the added person to all the clients registered in the iterator <i>PERSON\_ADDED</i>.

It's possible to test the subscriptions with the Apollo Explorer like this:

![](../../images/8/31x.png)

When the blue button <i>PersonAdded</i> is pressed Explorer starts to wait for a new person to be added. On addition (that you need to do from another browser window) the info of the added person appears in the right side of the Explorer.

If the subscription does not work, check that you have correct connection settings:

![](../../images/8/35.png)

The backend code can be found on [GitHub](https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-7), branch <i>part8-7</i>.

### Subscriptions on the client

In order to use subscriptions in our React application, we have to do some changes, especially on its [configuration](https://www.apollographql.com/docs/react/data/subscriptions/).
The configuration in <i>index.js</i> has to be modified like so: 

```js
import { 
  ApolloClient, ApolloProvider, HttpLink, InMemoryCache, 
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
      authorization: token ? `bearer ${token}` : null,
    }
  }
})

const httpLink = new HttpLink({
  uri: 'http://localhost:4000',
})

// highlight-start
const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:4000',
  })
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

For this to work, we have to install some dependencies:

```bash
npm install @apollo/client graphql-ws
```

The new configuration is due to the fact that the application must have an HTTP connection as well as a WebSocket connection to the GraphQL server.

```js
const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: { reconnect: true }
})

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:4000',
  })
)
```

The subscriptions are done using the [useSubscription](https://www.apollographql.com/docs/react/api/react/hooks/#usesubscription) hook function.

Let's modify the code like so:

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


When a new person is now added to the phonebook, no matter where it's done, the details of the new person are printed to the client’s console: 

![](../../images/8/32e.png)


When a new person is added, the server sends a notification to the client, and the callback function defined in the _onData_ attribute is called and given the details of the new person as parameters. 

Let's extend our solution so that when the details of a new person are received, the person is added to the Apollo cache, so it is rendered to the screen immediately. 

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

Our solution has a small problem: a person is added to the cache and also rendered twice since the component _PersonForm_ is also adding it to the cache.

Let us now fix the problem by ensuring that a person is not added twice in the cache:

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

The function _updateCache_ can also be used in _PersonForm_ for the cache update:

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

The final code of the client can be found on [GitHub](https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-9), branch <i>part8-9</i>.

### n+1 problem

First of all, you'll need to enable a debugging option via _mongoose_ in your backend project directory, by adding a line of code as shown below:

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

Let's add some things to the backend. Let's modify the schema so that a <i>Person</i> type has a _friendOf_ field, which tells whose friends list the person is on. 

```js
type Person {
  name: String!
  phone: String
  address: Address!
  friendOf: [User!]!
  id: ID!
}
```

The application should support the following query: 

```js
query {
  findPerson(name: "Leevi Hellas") {
    friendOf {
      username
    }
  }
}
```

Because _friendOf_ is not a field of <i>Person</i> objects on the database, we have to create a resolver for it, which can solve this issue. Let's first create a resolver that returns an empty list: 

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

The parameter _root_ is the person object for which a friends list is being created, so we search from all _User_ objects the ones which have root._id in their friends list: 

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


Now the application works. 


We can immediately do even more complicated queries. It is possible for example to find the friends of all users:

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

There is however one issue with our solution: it does an unreasonable amount of queries to the database. If we log every query to the database, just like this for example,
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

and considering we have 5 persons saved, and we query _allPersons_ without _phone_ as argument, we see an absurd amount of queries like below.

<pre>
Person.find
User.find
User.find
User.find
User.find
User.find
</pre>

So even though we primarily do one query for all persons, every person causes one more query in their resolver.

This is a manifestation of the famous [n+1 problem](https://www.google.com/search?q=n%2B1+problem), which appears every once in a while in different contexts, and sometimes sneaks up on developers without them noticing. 

The right solution for the n+1 problem depends on the situation. Often, it requires using some kind of a join query instead of multiple separate queries. 

In our situation, the easiest solution would be to save whose friends list they are on each _Person_ object:

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

Then we could do a "join query", or populate the _friendOf_ fields of persons when we fetch the _Person_ objects:

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


After the change, we would not need a separate resolver for the _friendOf_ field. 


The allPersons query <i>does not cause</i> an n+1 problem, if we only  fetch the name and the phone number: 

```js
query {
  allPersons {
    name
    phone
  }
}
```

If we modify _allPersons_ to do a join query because it sometimes causes an n+1 problem, it becomes heavier when we don't need the information on related persons. By using the [fourth parameter](https://www.apollographql.com/docs/apollo-server/data/resolvers/#resolver-arguments) of resolver functions, we could optimize the query even further. The fourth parameter can be used to inspect the query itself, so we could do the join query only in cases with a predicted threat of n+1 problems. However, we should not jump into this level of optimization before we are sure it's worth it. 

[In the words of Donald Knuth](https://en.wikiquote.org/wiki/Donald_Knuth):

> <i>Programmers waste enormous amounts of time thinking about, or worrying about, the speed of noncritical parts of their programs, and these attempts at efficiency actually have a strong negative impact when debugging and maintenance are considered. We should forget about small efficiencies, say about 97% of the time: <strong>premature optimization is the root of all evil.</strong></i>

GraphQL Foundation's [DataLoader](https://github.com/graphql/dataloader) library offers a good solution for the n+1 problem among other issues. More about using DataLoader with Apollo server [here](https://www.robinwieruch.de/graphql-apollo-server-tutorial/#graphql-server-data-loader-caching-batching) and [here](http://www.petecorey.com/blog/2017/08/14/batching-graphql-queries-with-dataloader/).

### Epilogue

The application we created in this part is not optimally structured: we did some cleanups but much would still need to be done. Examples for better structuring of GraphQL applications can be found on the internet. For example, for the server
[here](https://blog.apollographql.com/modularizing-your-graphql-schema-code-d7f71d5ed5f2) and the client [here](https://medium.com/@peterpme/thoughts-on-structuring-your-apollo-queries-mutations-939ba4746cd8).

GraphQL is already a pretty old technology, having been used by Facebook since 2012, so we can see it as "battle-tested" already. Since Facebook published GraphQL in 2015, it has slowly gotten more and more attention, and might in the near future threaten the dominance of REST. The death of REST has also already been [predicted](https://www.stridenyc.com/podcasts/52-is-2018-the-year-graphql-kills-rest). Even though that will not happen quite yet, GraphQL is absolutely worth [learning](https://blog.graphqleditor.com/javascript-predictions-for-2019-by-npm/).

</div>

<div class="tasks">

### Exercises 8.23.-8.26.

#### 8.23: Subscriptions - server

Do a backend implementation for subscription _bookAdded_, which returns the details of all new books to its subscribers. 

#### 8.24: Subscriptions - client, part 1

Start using subscriptions in the client, and subscribe to _bookAdded_. When new books are added, notify the user. Any method works. For example, you can use the [window.alert](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert) function. 

#### 8.25: Subscriptions - client, part 2

Keep the application's view updated when the server notifies about new books. You can test your implementation by opening the app in two browser tabs and adding a new book in one tab. Adding the new book should update the view in both tabs.

#### 8.26: n+1

Solve the n+1 problem of the following query using any method you like.

```js
query {
  allAuthors {
    name 
    bookCount
  }
}
```

### Submitting exercises and getting the credits

Exercises of this part are submitted via [the submissions system](https://studies.cs.helsinki.fi/stats/courses/fs-graphql) just like in the previous parts, but unlike previous parts, the submission goes to different "course instance". Remember that you have to finish at least 22 exercises to pass this part!

Once you have completed the exercises and want to get the credits, let us know through the exercise submission system that you have completed the course:

![Submissions](../../images/11/21.png)

**Note** that you need a registration to the corresponding course part for getting the credits registered, see [here](/en/part0/general_info#parts-and-completion) for more information.

You can download the certificate for completing this part by clicking one of the flag icons. The flag icon corresponds to the certificate's language. 

</div>
