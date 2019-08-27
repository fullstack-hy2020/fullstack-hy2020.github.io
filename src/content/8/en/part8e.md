---
mainImage: ../../../images/part-8.svg
part: 8
letter: e
lang: en
---
<div class="content">


We are approaching the end of the course. Let's finish by having a look at few more details of GraphQL. 

### fragments


It is pretty common in GraphQL that multiple queries return similar results. For example the query for the details of a person

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


With the fragment we can do the queries in a compact form:

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


In princible we could declare the fragment with each query like so:

```js
const ALL_PERSONS = gql`
  {
    allPersons  {
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


however it is much better to declare the fragment once and save it to a variable. 

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


Declared like this the fragment can be placed to any query or mutation with the "precentcurlybrace"-operator:

```js
const ALL_PERSONS = gql`
  {
    allPersons  {
      ...PersonDetails
    }
  }
  ${PERSON_DETAILS}  
`
```

### Subscriptions


Along with query- and mutation types, GraphQL offers a third operation type, [subscription](https://www.apollographql.com/docs/react/advanced/subscriptions.html). With subscriptions clients can <i>subscribe to</i> updates about changes in the server. 


Subscriptions are radically different from anything we have seen in this course so far. Until now all interaction between browser and the server has been React application in the browser making HTTP-requests to the server. GraphQL queries and mutations have also been done this way. 
With subscriptions the situation is the opposite. After an application has made a subscription, it starts to listen to the server. 
When changes occur on the server, it sends a notification to all of its <i>subscribers</i>.



Technically speaking the HTTP-protocol is not well suited for communication from the server to the browser, so under the hood Apollo uses [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) for server subscriber communication. 

### Subscriptions on the server


Let's implement subscriptions for subscribing for notifications about new persons added.


There are not many changes to the server. The schema changes like so:

```js
type Subscription {
  personAdded: Person!
}    
```

So when a new person is added, all of it's details are sent to all subscribers. 


The subscription _personAdded_ needs a resolver. The _addPerson_ resolver also has to be modified so, that is sends a notification to subscribers. 


The required changes are as follows:

```js
const { PubSub } = require('apollo-server') // highlight-line
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


With subscriptions the communication happens using the [publish-subscribe](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern)-princible utilizing an object which realizes a [PubSub](https://www.apollographql.com/docs/graphql-subscriptions/setup.html#setup) interface. Adding a new person <i>publishes</i> a notification about the operation to all subscribers with PubSubs method _publish_.


_PersonAdded_ subscriptions resolver registers all of the subscribers by returning them a suitable [iterator object](https://www.apollographql.com/docs/graphql-subscriptions/subscriptions-to-schema.html).


Let's do the following changes to the code which starts the server
```js
// ...

server.listen().then(({ url, subscriptionsUrl }) => { // highlight-line
  console.log(`Server ready at ${url}`)
  console.log(`Subscriptions ready at ${subscriptionsUrl}`) // highlight-line
})
```


We see, that the server listens for subscriptions in the address _ws://localhost:4000/graphql_

```js
Server ready at http://localhost:4000/
Subscriptions ready at ws://localhost:4000/graphql
```


No other changes to the server are needed.


It's possible to test the subscriptions with the GraphQL playground like this:

![](../../images/8/31.png)


When you press "play" on a subscription, the playground waits for notifications to the subscription. 


The backend code can be found from [github](https://github.com/fullstackopen-2019/graphql-phonebook-backend/tree/part8-6), branch <i>part8-6</i>.

### Subscriptions on the client


In order to use subscriptions in our React application, we have to do some changes, especially on its [configurations](https://www.apollographql.com/docs/react/advanced/subscriptions.html#subscriptions-client).
The configurations in <i>index.js</i> have to be modified like so: 

```js
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import { ApolloProvider } from '@apollo/react-hooks'

import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'

import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: { reconnect: true }
})

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('phonenumbers-user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}` : null,
    }
  }
})

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  authLink.concat(httpLink),
)

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
)
```


For this to work, we have to install some dependencies:

```js
npm install --save subscriptions-transport-ws apollo-link-ws
```

The new configurations is due to the fact that the application must have HTTP-connection as well as websocket-connection to the GraphQL server.

```js
const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: { reconnect: true }
})

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
})
```

The subscriptions are done using the [Subscription](https://www.apollographql.com/docs/react/advanced/subscriptions.html#subscription-component) component or _useSubscription_ hook that is available in Apollo Client 3.0. We will use the hook based solution.

Let's modify the code like so:

```js
import { useQuery, useMutation, useSubscription ,useApolloClient } from '@apollo/react-hooks'// highlight-line

// ...

// highlight-start
const PERSON_ADDED = gql`
  subscription {
    personAdded {
      ...PersonDetails
    }
  }
  ${PERSON_DETAILS}
`
// highlight-end

const App = () => {
  // ...

  useSubscription(PERSON_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      console.log(subscriptionData)
    }
  })

  // ...
}
```


When a new person is now added to the phonebook, no matter where it's done, the details of the new person are printed to the clients console: 

![](../../images/8/32e.png)


When a new person is added, the server sends a notification to the client, and the callback-function defined in the _onSubscriptionData_ attribute is called and given the details of the new person as parameters. 

Let's extend our solution so that when the details of a new person are received, the person is added to the Apollo cache, so it is rendered to the screen immediately. 

However we have to keep in mind, that when our application creates a new person, it should not be added to the cache twice: 

```js
const App = () => {
  // ...

  const updateCacheWith = (addedPerson) => {
    const includedIn = (set, object) => 
      set.map(p => p.id).includes(object.id)  

    const dataInStore = client.readQuery({ query: ALL_PERSONS })
    if (!includedIn(dataInStore.allPersons, addedPerson)) {
      dataInStore.allPersons.push(addedPerson)
      client.writeQuery({
        query: ALL_PERSONS,
        data: dataInStore
      })
    }   
  }

  useSubscription(PERSON_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedPerson = subscriptionData.data.personAdded
      notify(`${addedPerson.name} added`)
      updateCacheWith(addedPerson)
    }
  })

  const [addPerson] = useMutation(CREATE_PERSON, {
    onError: handleError,
    update: (store, response) => {
      updateCacheWith(response.data.addPerson)
    }
  })

  // ...
}
```

There is 

The final code of the client can be found from [github](https://github.com/fullstackopen-2019/graphql-phonebook-frontend/tree/part8-9), branch <i>part8-9</i>.

### n+1-problem

Let's add some things to the backend. Let's modify the schema so, that a <i>Person</i> type has a _friendOf_ field, which tells whose firends list the person is on. 

```js
type Person {
  name: String!
  phone: String
  address: Address!
  friendOf: [User!]!
  id: ID!
}
```


The application should support i.e the following query: 

```js
query {
  findPerson(name: "Leevi Hellas") {
    friendOf{
      username
    }
  }
}
```


Because _friendOf_ is not a field of <i>Person</i>-objects on the database, we have to create a resolver for it, which can solve this issue. Let's first create a resolver that returns an empty list: 

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


The parameter _root_ is the person object whichs friends list is being created, so we search from all _User_ objects the ones which have root._id in their friends list: 

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


There is however one issue with our solution, it does an unreasonable amount of queries to the database. If we log every query to the database, and we have 5 persons saved, we see the following:

<pre>
Person.find
User.find
User.find
User.find
User.find
User.find
</pre>


So even though we primarily do one query for all persons, every person causes one more query in their resolver. 


This is a manifestation of the famous [n+1-problem](https://www.google.com/search?q=n%2B1+problem), which appears every once in a while in different contexts, and sometimes sneaks up on developers without them noticing. 


Good solution for n+1 problem depends on the situation. Often it requires using some kind of a join query instead of multiple separate queries. 


In our situation the easiest solution would be to save whose friends list they are on on each _Person_-object:

```js
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


Then we could do a "join query", or populate the _friendOf_-fields of persons when we fetch the _Person_-objects:

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


After the change we would not need a separate resolver for the _friendOf_ field. 


The allPersons query <i>does not cause</i> a n+1 problem, if we i.e only  fetch the name and the phonenumber: 

```js
query {
  allPersons {
    name
    phone
  }
}
```


If we modify _allPersons_ to do a join query because it sometimes causes n+1 problem, it becomes heavier also when we don't need the information on related persons. By using the [fourth parameter](https://www.apollographql.com/docs/apollo-server/essentials/data.html#type-signature) of resolver functions we could optimize the query even further. The fourth parameter can be used to inspect the query itself, so we could do the join query only in cases with predicted threat for n+1 problem. However we should not jump into this level of optimization before we are sure it's worth it. 

[In the words of Donald Knuth](https://en.wikiquote.org/wiki/Donald_Knuth):

> <i>Programmers waste enormous amounts of time thinking about, or worrying about, the speed of noncritical parts of their programs, and these attempts at efficiency actually have a strong negative impact when debugging and maintenance are considered. We should forget about small efficiencies, say about 97% of the time: <strong>premature optimization is the root of all evil.</strong></i>



[Dataloader](https://github.com/facebook/dataloader)-library by Facebook offers a good solution for the n+1 problem among other issues.
More about using dataloader with Apollo server  [here](https://www.robinwieruch.de/graphql-apollo-server-tutorial/#graphql-server-data-loader-caching-batching) and [here](http://www.petecorey.com/blog/2017/08/14/batching-graphql-queries-with-dataloader/).

### Epiloque



The application we created in this part is not optimally structured: the schema, queries and the muatations should at least be moved outside of the application code. Examples for better structuring of GraphQL applications can be found from the internet, for example for the server
[here](https://blog.apollographql.com/modularizing-your-graphql-schema-code-d7f71d5ed5f2) and the client [here](https://medium.com/@peterpme/thoughts-on-structuring-your-apollo-queries-mutations-939ba4746cd8).


GraphQL is already pretty old technology, being used by Facebook since 2012, so we can see it as "battle tested" already. Since Facebook published GraphQL in 2015 it has slowly gotten more and more attention, and might in the near future threaten the dominance of REST. The death of REST has also already been [predicted](https://www.stridenyc.com/podcasts/52-is-2018-the-year-graphql-kills-rest). Even thought that will not happen quite yet, GraphQL is absolutely worth [learning](https://blog.graphqleditor.com/javascript-predictions-for-2019-by-npm/).

</div>

<div class="tasks">

### Exercises

#### 8.23: Subscriptions - server


Do a backend implementation for subscription _bookAdded_, which returns the details of all new books to its subscribers. 

#### 8.24: Subscriptions - client, part 1

Start using subscriptions in the client, and subscribe to _bookAdded_. When new books are added, notify the user. Any method works, you can use for example the [window.alert](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert) function. 

#### 8.25: Subscriptions - client, part 2

Keep the applications view updated, when the server notifies about new books. 

#### 8.26: n+1

Solve the n+1 problem of the following query using any method you like

```js
query {
  allAuthors {
    name 
    bookCount
  }
}
```

</div>
