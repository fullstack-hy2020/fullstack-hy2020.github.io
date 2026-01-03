---
mainImage: ../../../images/part-8.svg
part: 8
letter: e
lang: en
---
<div class="content">

We are approaching the end of this part. Let's finish by having a look at a few more details about GraphQL.

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

Such situations can be simplified by using [fragments](https://graphql.org/learn/queries/#fragments). A fragment that selects all of a person’s details looks like this:

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

However, it is much more sensible to define the fragment once and store it in a variable. Let’s add the fragment definition to the beginning of the <i>queries.js</i> file:

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

The fragment can now be embedded into all queries and mutations that need it using the [dollar curly braces](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) operation:

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

So the template literal in the *PERSON_DETAILS* variable is now inserted as part of the *FIND_PERSON* template literal. In practice, the end result is exactly the same as in the earlier example, where the fragment was defined directly alongside the query.

### Subscriptions
  
Along with query and mutation types, GraphQL offers a third operation type: [subscriptions](https://www.apollographql.com/docs/react/data/subscriptions/). With subscriptions, clients can <i>subscribe</i> to updates about changes in the server.

Subscriptions are radically different from anything we have seen in this course so far. Until now, all interaction between browser and server was due to a React application in the browser making HTTP requests to the server. GraphQL queries and mutations have also been done this way.
With subscriptions, the situation is the opposite. After an application has made a subscription, it starts to listen to the server.
When changes occur on the server, it sends a notification to all of its <i>subscribers</i>.

Technically speaking, the HTTP protocol is not well-suited for communication from the server to the browser. So, under the hood, Apollo uses [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) for server subscriber communication.

### expressMiddleware

Starting from version 3.0, Apollo Server no longer provides direct support for subscriptions. We therefore need to make a number of changes to the backend code in order to get subscriptions working.


So far, we have started the application with the easy-to-use function [startStandaloneServer](https://www.apollographql.com/docs/apollo-server/api/standalone/#startstandaloneserver), thanks to which the application has not had to be configured that much:

```js
const { startStandaloneServer } = require('@apollo/server/standalone')

// ...

const startServer = (port) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  })

  startStandaloneServer(server, {
    listen: { port },
    context: async ({ req }) => {
      // ...
    },
  }).then(({ url }) => {
    console.log(`Server ready at ${url}`)
  })
}
```

Unfortunately, startStandaloneServer does not allow adding subscriptions to the application, so let's switch to the more robust [expressMiddleware](https://www.apollographql.com/docs/apollo-server/api/express-middleware/) function. As the name of the function already suggests, it is an Express middleware, which means that Express must also be configured for the application, with the GraphQL server acting as middleware.

Let’s install Express and the Apollo Server integration package:

```bash
npm install express cors @as-integrations/express5
```

and change the <i>server.js</i> file to the following form:

```js
const { ApolloServer } = require('@apollo/server')
// highlight-start
const {
  ApolloServerPluginDrainHttpServer,
} = require('@apollo/server/plugin/drainHttpServer')
const { expressMiddleware } = require('@as-integrations/express5')
const cors = require('cors')
const express = require('express')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const http = require('http')
// highlight-end
const jwt = require('jsonwebtoken')

const resolvers = require('./resolvers')
const typeDefs = require('./schema')
const User = require('./models/user')

const getUserFromAuthHeader = async (auth) => {
  if (!auth || !auth.startsWith('Bearer ')) {
    return null
  }

  const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
  return User.findById(decodedToken.id).populate('friends')
}

// highlight-start
const startServer = async (port) => {
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
        const auth = req.headers.authorization
        const currentUser = await getUserFromAuthHeader(auth)
        return { currentUser }
      },
    }),
  )
 
  httpServer.listen(port, () =>
    console.log(`Server is now running on http://localhost:${port}`),
  )
}
// highlight-end

module.exports = startServer
```

The GraphQL server in the *server* variable is now connected to listen to the root of the server, i.e. to the */* route, using the *expressMiddleware* object. Information about the logged-in user is set in the context using the function we defined earlier. Since it is an Express server, the middlewares express-json and cors are also needed so that the data included in the requests is correctly parsed and so that CORS problems do not appear.

The GraphQL server must be started before the Express application can begin listening on the specified port, so the _startServer_ function has been made an <i>async function</i> in order to be able to wait for the GraphQL server to start:

```js
await server.start()
```

Following the recommendations in the documentation, [ApolloServerPluginDrainHttpServer](https://www.apollographql.com/docs/apollo-server/api/plugin/drain-http-server) has been added to the GraphQL server configuration:

```js
  const server = new ApolloServer({
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })], // highlight-line
  })
```

This plugin ensures that the server is shut down cleanly when the server process is stopped. For example, it makes it possible to finish processing in-flight requests and close client connections so that they don’t get left hanging. 

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

First, we have to install packages for adding subscriptions to GraphQL and a Node.js WebSocket library:

```bash
npm install graphql-ws ws @graphql-tools/schema
```

The file <i>server.js</i> is changed to:

```js
// highlight-start
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/use/ws')
// highlight-end

// ...

const startServer = async (port) => {
  const app = express()
  const httpServer = http.createServer(app)

  // highlight-start
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
  })
 
  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const serverCleanup = useServer({ schema }, wsServer)
  // highlight-end

  const server = new ApolloServer({
    // highlight-start
    schema, 
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          }
        },
      },
    ],
    // highlight-end
  })

  await server.start()

  // ...
}
```

When queries and mutations are used, GraphQL uses the HTTP protocol in the communication. In case of subscriptions, the communication between client and server happens with [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API).

The configuration above creates, alongside the HTTP request listener, a service that listens for WebSockets and binds it to the server’s GraphQL schema. The second part of the setup registers a function that closes the WebSocket connection when the server is shut down. If you’re interested in the configurations in more detail, Apollo’s [documentation](https://www.apollographql.com/docs/apollo-server/data/subscriptions) explains fairly precisely what each line of code does.

Unlike with HTTP, when using WebSockets the server can also take the initiative in sending data. Therefore, WebSockets are well suited for GraphQL subscriptions, where the server must be able to notify all clients that have made a particular subscription when the corresponding event (e.g. creating a person) occurs.

The subscription *personAdded* needs a resolver. The *addPerson* resolver also has to be modified so that it sends a notification to subscribers.

Let’s first install a library that provides [publish–subscribe](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) functionality:

```
npm install graphql-subscriptions
```

The changes to the <i>resolvers.js</i> file are as follows:

```js
const { GraphQLError } = require('graphql')
const { PubSub } = require('graphql-subscriptions') // highlight-line
const jwt = require('jsonwebtoken')

const Person = require('./models/person')
const User = require('./models/user')

const pubsub = new PubSub() // highlight-line

const resolvers = {
  // ...
  Mutation: {
    addPerson: async (root, args, context) => {
        const currentUser = context.currentUser

        if (!currentUser) {
          throw new GraphQLError('not authenticated', {
            extensions: {
              code: 'UNAUTHENTICATED',
            },
          })
        }

        const nameExists = await Person.exists({ name: args.name })

        if (nameExists) {
          throw new GraphQLError(`Name must be unique: ${args.name}`, {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
            },
          })
        }

      const person = new Person({ ...args })

      try {
        await person.save()
        currentUser.friends = currentUser.friends.concat(person)
        await currentUser.save()
      } catch (error) {
        throw new GraphQLError(`Saving person failed: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        })
      }


      pubsub.publish('PERSON_ADDED', { personAdded: person })  // highlight-line

      return person
    },
    // ...
  },
  // highlight-start
  Subscription: {
    personAdded: {
      subscribe: () => pubsub.asyncIterableIterator('PERSON_ADDED')
    },
  },
  // highlight-end
}
```

With subscriptions, communication follows the publish–subscribe pattern using the [PubSub](https://www.apollographql.com/docs/apollo-server/data/subscriptions#the-pubsub-class) object.

There are only a few lines of code added, but quite a lot is happening under the hood. The resolver of the *personAdded* subscription registers and saves info about all the clients that do the subscription. The clients are saved to an
["iterator object"](https://www.apollographql.com/docs/apollo-server/data/subscriptions/#listening-for-events) called <i>PERSON\_ADDED</i>  thanks to the following code:

```js
Subscription: {
  personAdded: {
    subscribe: () => pubsub.asyncIterableIterator('PERSON_ADDED')
  },
},
```

The iterator name is an arbitrary string, but to follow the convention, it is the subscription name written in capital letters.

Adding a new person <i>publishes</i> a notification about the operation to all subscribers with PubSub's method *publish*:

```js
pubsub.publish('PERSON_ADDED', { personAdded: person }) 
```

Execution of this line sends a WebSocket message about the added person to all the clients registered in the iterator <i>PERSON\_ADDED</i>.

It's possible to test the subscriptions with the Apollo Explorer like this:

![apollo explorer showing subscriptions tab and response](../../images/8/31x.png)

So the subscription is

```js
subscription Subscription {
  personAdded {
    phone
    name
  }
}
```

When the blue button <i>PersonAdded</i> is pressed, Explorer starts to wait for a new person to be added. On addition, the info of the added person appears on the right side of the Explorer.

Implementing subscriptions involves a lot of different configuration. For the few exercises in this course, you’ll do fine without worrying about all the details. However, if you are implementing subscriptions in an application intended for real-world use, you should definitely read Apollo’s
[documentation on subscriptions](https://www.apollographql.com/docs/apollo-server/data/subscriptions).

The backend code can be found on [GitHub](https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-7), branch <i>part8-7</i>.

### Subscriptions on the client

In order to use subscriptions in our React application, we have to do some changes, especially to its [configuration](https://www.apollographql.com/docs/react/data/subscriptions/).

Let’s add the <i>graphql-ws</i> library as a frontend dependency. It enables <i>WebSocket</i> connections for GraphQL subscriptions:

```bash
npm install graphql-ws
```

The configuration in <i>main.jsx</i> has to be modified like so:

```js
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import {
  ApolloClient,
  ApolloLink, // highlight-line
  HttpLink,
  InMemoryCache,
} from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'
import { SetContextLink } from '@apollo/client/link/context'
// highlight-start
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'
// highlight-end

const authLink = new SetContextLink(({ headers }) => {
  const token = localStorage.getItem('phonebook-user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    },
  }
})

const httpLink = new HttpLink({ uri: 'http://localhost:4000' })

// highlight-start
const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:4000',
  }),
)
// highlight-end

// highlight-start
const splitLink = ApolloLink.split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  authLink.concat(httpLink),
)
// highlight-end

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink, // highlight-line
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>,
)
```

The new configuration is due to the fact that the application must have an HTTP connection as well as a WebSocket connection to the GraphQL server:

```js
const httpLink = new HttpLink({ uri: 'http://localhost:4000' })

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:4000',
  }),
)
```

Let’s then modify the application so that it subscribes to information about new people from the server. Add the code that defines the subscription to the <i>queries.js</i> file:

```js
export const PERSON_ADDED = gql`
  subscription {
    personAdded {
      ...PersonDetails
    }
  }

  ${PERSON_DETAILS}
`
```

Subscriptions are created using the [useSubscription](https://www.apollographql.com/docs/react/api/react/hooks/#usesubscription) hook function. Let’s create a subscription in the <i>App</i> component:

```js
import {
  useApolloClient,
  useQuery,
  useSubscription, // highlight-line
} from '@apollo/client/react'
import { useState } from 'react'
import LoginForm from './components/LoginForm'
import Notify from './components/Notify'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import PhoneForm from './components/PhoneForm'
import { ALL_PERSONS, PERSON_ADDED } from './queries' // highlight-line

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem('phonebook-user-token'),
  )
  const [errorMessage, setErrorMessage] = useState(null)
  const result = useQuery(ALL_PERSONS)
  const client = useApolloClient()

  // highlight-start
  useSubscription(PERSON_ADDED, {
    onData: ({ data }) => {
      console.log(data)
    },
  })
  // highlight-end

  if (result.loading) {
    return <div>loading...</div>
  }

  // ...
}
```

When a new person is now added to the phonebook, no matter where it's done, the details of the new person are printed to the client’s console:

![dev tools showing data personAdded Object with Mainroad](../../images/8/32e.png)

When a new person is added to the list, the server sends the details to the client, and the callback function defined as the value of the <i>useSubscription</i> hook’s _onData_ attribute is called, with the person added on the server passed to it as a parameter.

We can show the user a notification when a new person is added as follows:

```js
const App = () => {
  // ...

  useSubscription(PERSON_ADDED, {
    onData: ({ data }) => {
      const addedPerson = data.data.personAdded // highlight-line
      notify(`${addedPerson.name} added`) // highlight-line
    }
  })

  // ...
}
```

Now, for example, a person added via Apollo Studio Explorer is rendered immediately in the application view.  

However, there is a small problem with the solution. When a new person is added through the application’s form, the added person ends up in the cache twice, because both the _useSubscription_ hook and the _PersonForm_ component add the new person to the cache. As a result, the added person is rendered on the screen twice.

One possible solution would be to update the cache only in the <i>useSubscription</i> hook. However, this is not recommended. As a good practice, the user should see the changes they make in the application immediately. The cache update performed by the subscription may happen with a delay and cannot be fully relied upon. Therefore, we will stick with a solution where the cache is updated both in the _useSubscription_ hook and in the _PersonForm_ component.

Let’s solve the problem by ensuring that a person is added to the cache only if they haven’t already been added there. At the same time, we’ll extract the cache update operation into its own helper function in the <i>utils/apolloCache.js</i> file:

```js
import { ALL_PERSONS } from '../queries'

export const addPersonToCache = (cache, personToAdd) => {
  cache.updateQuery({ query: ALL_PERSONS }, ({ allPersons }) => {
    const personExists = allPersons.some(
      (person) => person.id === personToAdd.id,
    )

    if (personExists) {
      return { allPersons }
    }

    return {
      allPersons: allPersons.concat(personToAdd),
    }
  })
}
```

The helper function _addPersonToCache_ updates the cache using the familiar _cache.updateQuery_ method. In the cache update logic, we first check whether the person has already been added to the cache. We look for the person to be added among the people currently in the cache using JavaScript array’s _some_ method:

```js
  const personExists = allPersons.some(
    (person) => person.id === personToAdd.id,
  )
```

_some_ is a method that searches a collection for an element that matches the given condition. It returns a boolean indicating whether a matching element was found. In our case, the method returns _True_ if the cache already contains a person with that <i>id</i>, and otherwise it returns _False_.

If the person is already in the cache, we return the cache contents as-is and do not add the person again. Otherwise, we return the cache contents with the new person appended using the _concat_ method:

```js
  if (personExists) {
    return { allPersons }
  }

  return {
    allPersons: allPersons.concat(personToAdd),
  }
```

Let’s modify the _useSubscription_ hook in the _App_ component so that it updates the cache using the _addPersonToCache_ helper function we created:

```js
import { addPersonToCache } from './utils/apolloCache' // highlight-line

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem('phonebook-user-token'),
  )
  const [errorMessage, setErrorMessage] = useState(null)
  const result = useQuery(ALL_PERSONS)
  const client = useApolloClient()

  useSubscription(PERSON_ADDED, {
    onData: ({ data }) => {
      const addedPerson = data.data.personAdded
      notify(`${addedPerson.name} added`)
      addPersonToCache(client.cache, addedPerson) // highlight-line
    },
  })

  // ...
}
```

and we will also use the function when updating the cache in connection with adding a new person:

```js
import { addPersonToCache } from '../utils/apolloCache' // highlight-line

const PersonForm = ({ setError }) => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')

  const [createPerson] = useMutation(CREATE_PERSON, {
    onError: (error) => setError(error.message),
    update: (cache, response) => {
      // highlight-start
      const addedPerson = response.data.addPerson
      addPersonToCache(cache, addedPerson)
      // highlight-end
    },
  })

  // ...
}
```

Now the cache update works correctly in all situations, meaning that a new person is added to the cache only if they haven’t already been added there.

The final code of the client can be found on [GitHub](https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-6), branch <i>part8-6</i>.

### n+1 problem


Let's add some things to the backend. Let's modify the schema so that a <i>Person</i> type has a *friendOf* field, which tells whose friends list the person is on.

```js
type Person {
  name: String!
  phone: String
  address: Address!
  friendOf: [User!]! // highlight-line
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

Because *friendOf* is not a field of <i>Person</i> objects on the database, we have to create a resolver for it, which can solve this issue. Let's first create a resolver that returns an empty list:

```js
Person: {
  address: ({ street, city }) => {
    return {
      street,
      city,
    }
  },
  // highlight-start
  friendOf: async (root) => {
    return []
  }
  // highlight-end
},
```

The parameter *root* is the person object for which a friends list is being created, so we search from all *User* objects the ones which have root._id in their friends list:

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

However, the application now has one problem: an unreasonably large number of database queries are being made. Let’s add console logging to the parts of the resolvers that perform database queries:

```js
allPersons: async (root, args) => {
  console.log('Person.find') // highlight-line
  if (!args.phone) {
    return Person.find({})
  }

  return Person.find({ phone: { $exists: args.phone === 'YES' } })
}
```

```js
friendOf: async (root) => {
  console.log('User.find') // highlight-line
  const friends = await User.find({
    friends: {
      $in: [root._id],
    },
  })

  return friends
}
```

We notice that if there are five people in the database, the previously mentioned _allPersons_ query causes the following database queries:
```
Person.find
User.find
User.find
User.find
User.find
User.find
```

So even though we primarily do one query for all persons, every person causes one more query in their resolver.

This is a manifestation of the famous [n+1 problem](https://www.google.com/search?q=n%2B1+problem), which appears every once in a while in different contexts, and sometimes sneaks up on developers without them noticing.

The right solution for the n+1 problem depends on the situation. Often, it requires using some kind of a join query instead of multiple separate queries.

In our situation, the easiest solution would be to save whose friends list they are on each *Person* object:

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
    minlength: 3
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

Then we could do a "join query", or populate the *friendOf* fields of persons when we fetch the *Person* objects:

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

After the change, we would not need a separate resolver for the *friendOf* field.

The allPersons query <i>does not cause</i> an n+1 problem, if we only  fetch the name and the phone number:

```js
query {
  allPersons {
    name
    phone
  }
}
```

If we modify *allPersons* to do a join query because it sometimes causes an n+1 problem, it becomes heavier when we don't need the information on related persons. By using the [fourth parameter](https://www.apollographql.com/docs/apollo-server/data/resolvers/#resolver-arguments) of resolver functions, we could optimize the query even further. The fourth parameter can be used to inspect the query itself, so we could do the join query only in cases with a predicted threat of n+1 problems. However, we should not jump into this level of optimization before we are sure it's worth it.

[In the words of Donald Knuth](https://en.wikiquote.org/wiki/Donald_Knuth):

> <i>Programmers waste enormous amounts of time thinking about, or worrying about, the speed of noncritical parts of their programs, and these attempts at efficiency actually have a strong negative impact when debugging and maintenance are considered. We should forget about small efficiencies, say about 97% of the time: <strong>premature optimization is the root of all evil.</strong></i>

GraphQL Foundation's [DataLoader](https://github.com/graphql/dataloader) library offers a good solution for the n+1 problem among other issues. More about using DataLoader with Apollo server [here](https://www.robinwieruch.de/graphql-apollo-server-tutorial/#graphql-server-data-loader-caching-batching) and [here](http://www.petecorey.com/blog/2017/08/14/batching-graphql-queries-with-dataloader/).

### Epilogue

The application we built in this part is not structured in the most optimal way. We did a bit of cleanup by moving the schema and resolvers into their own files, but there is still plenty of room for improvement. Examples of better ways to structure GraphQL applications can be found online, for example for the server [here](https://www.apollographql.com/blog/modularizing-your-graphql-schema-code) and for the client [here](https://medium.com/@peterpme/thoughts-on-structuring-your-apollo-queries-mutations-939ba4746cd8).

GraphQL is already quite an old technology: it has been in internal use at Facebook since 2012, so it can be said to be battle tested. Facebook released GraphQL in 2015, and it has since become established. Even the “death” of REST was predicted [here](https://www.radiofreerabbit.com/podcast/52-is-2018-the-year-graphql-kills-rest) before the 2020s, but that has not happened. REST is still widely used and still works excellently in many cases, and GraphQL is unlikely to ever replace REST. However, GraphQL has become an alternative way to build APIs, and it is definitely worth getting familiar with.
</div>

<div class="tasks">

### Exercises 8.23.-8.26

#### 8.23: Subscriptions - server

Do a backend implementation for subscription *bookAdded*, which returns the details of all new books to its subscribers.

#### 8.24: Subscriptions - client, part 1

Start using subscriptions in the client, and subscribe to *bookAdded*. When new books are added, notify the user. Any method works. For example, you can use the [window.alert](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert) function.

#### 8.25: Subscriptions - client, part 2

Keep the application's book view updated when the server notifies about new books (you can ignore the author view!). You can test your implementation by opening the app in two browser tabs and adding a new book in one tab. Adding the new book should update the view in both tabs.

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
