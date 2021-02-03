---
mainImage: ../../../images/part-8.svg
part: 8
letter: e
lang: zh
---
<div class="content">


<!-- We are approaching the end of the course. Let's finish by having a look at a few more details of GraphQL.  -->
我们正在接近课程的终点。 让我们看一下 GraphQL 的更多细节，以此作为结束。

### fragments
【碎片】
<!-- It is pretty common in GraphQL that multiple queries return similar results. For example the query for the details of a person -->
在 GraphQL 中，多个查询返回相似的结果是很常见的。 例如，查询某人的详细信息

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

<!-- and the query for all persons -->
以及对所有人的查询

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

<!-- both return persons. When choosing the fields to return, both queries have to define exactly the same fields.  -->
当选择要返回的字段时，两个查询必须定义完全相同的字段。

<!-- These kinds of situations can be simplified with the use of [fragments](https://graphql.org/learn/queries/#fragments). Let's declare a fragment for selecting all fields of a person:  -->
这种情况可以通过使用[片段](https://graphql.org/learn/queries/#fragments)来简化。 让我们声明一个片段来选择一个人的所有字段:

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

<!-- With the fragment we can do the queries in a compact form: -->
通过这个片段，我们可以以一种简洁的形式来完成查询:

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

<!-- The fragments <i><strong>are not</strong></i> defined in the GraphQL schema, but in the client. The fragments must be declared when the client uses them for queries.  -->
片段不是在 GraphQL 模式中定义的 ，而是在客户端中定义的。 当客户端使用这些片段进行查询时，必须声明它们。

<!-- In principle, we could declare the fragment with each query like so: -->
原则上，我们可以像这样在每个查询中声明片段:

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

<!-- However, it is much better to declare the fragment once and save it to a variable.  -->
但是，最好只声明一次片段并将其保存到变量中。

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

<!-- Declared like this, the fragment can be placed to any query or mutation using a [dollar sign and curly braces](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals): -->
这样声明，片段可以被放置到任何查询或Mutation使用[$符号和大括号](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)  :

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
【订阅】

<!-- Along with query- and mutation types, GraphQL offers a third operation type: [subscriptions](https://www.apollographql.com/docs/react/data/subscriptions/). With subscriptions clients can <i>subscribe to</i> updates about changes in the server.  -->
除了查询和Mutation类型之外，GraphQL 还提供了第三种操作类型: [订阅](https://www.apollographql.com/docs/react/data/subscriptions/)。 通过订阅客户端，我可以订阅/更新服务器中的更改。

<!-- Subscriptions are radically different from anything we have seen in this course so far. Until now all interaction between browser and the server has been React application in the browser making HTTP-requests to the server. GraphQL queries and mutations have also been done this way.  -->
到目前为止，订阅与我们在本课程中看到的任何内容都是截然不同的。 到目前为止，浏览器和服务器之间的所有交互都是在浏览器中的 React 应用向服务器发出 http 请求。 Graphql 查询和Mutation也以这种方式完成。
<!-- With subscriptions the situation is the opposite. After an application has made a subscription, it starts to listen to the server.  -->
订阅的情况恰恰相反。 在应用订阅之后，它开始侦听服务器。
<!-- When changes occur on the server, it sends a notification to all of its <i>subscribers</i>. -->
当服务器上发生更改时，它向其所有<i>订阅者</i> 发送一个通知。



<!-- Technically speaking the HTTP-protocol is not well suited for communication from the server to the browser, so under the hood Apollo uses [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) for server subscriber communication.  -->
严格来说，http 协议并不适合于从服务器到浏览器的通信，因此 Apollo 在内部使用[websocket](https://developer.mozilla.org/en-us/docs/web/api/websockets_api)进行服务器订户通信。

### Subscriptions on the server
【服务器上的订阅】
<!-- Let's implement subscriptions for subscribing for notifications about new persons added. -->
让我们实现订阅，以订阅关于添加的新用户的通知。

<!-- There are not many changes to the server. The schema changes like so: -->
服务器没有太多变化，模式变化如下:

```js
type Subscription {
  personAdded: Person!
}    
```

<!-- So when a new person is added, all of its details are sent to all subscribers.  -->
因此，当一个新用户加入时，所有的详细信息都会发送给所有的订阅者。

<!-- The subscription _personAdded_ needs a resolver. The _addPerson_ resolver also has to be modified so that it sends a notification to subscribers.  -->
订阅 personAdded 需要一个解析器。 还必须修改 addPerson 解析器，以便它向订阅者发送通知。

<!-- The required changes are as follows: -->
所需的修改如下:

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

<!-- With subscriptions, the communication happens using the [publish-subscribe](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) principle utilizing an object using a [PubSub](https://www.apollographql.com/docs/graphql-subscriptions/setup/#setup) interface. Adding a new person <i>publishes</i> a notification about the operation to all subscribers with PubSub's method _publish_. -->
对于订阅，通信是使用[发布-订阅](https://en.wikipedia.org/wiki/publish%e2%80%93subscribe_pattern)原理进行的，该原理使用通过[PubSub](https://www.apollographql.com/docs/graphql-subscriptions/setup/#setup) 接口的对象。添加一个新用户后，通过 PubSub 的方法向所有订阅者<i>发布</i>关于操作的通知

<!-- _personAdded_ subscriptions resolver registers all of the subscribers by returning them a suitable [iterator object](https://www.apollographql.com/docs/graphql-subscriptions/subscriptions-to-schema/). -->
Personadded 订阅解析器通过返回一个合适的[迭代器对象](https://www.apollographql.com/docs/graphql-subscriptions/subscriptions-to-schema/)来注册所有订阅  。 

<!-- Let's do the following changes to the code which starts the server -->
让我们对启动服务器的代码执行如下更改

```js
// ...

server.listen().then(({ url, subscriptionsUrl }) => { // highlight-line
  console.log(`Server ready at ${url}`)
  console.log(`Subscriptions ready at ${subscriptionsUrl}`) // highlight-line
})
```

<!-- We see, that the server listens for subscriptions in the address _ws://localhost:4000/graphql_ -->
我们可以看到，服务器在地址 _ws://localhost:4000/graphql_中侦听订阅

```js
Server ready at http://localhost:4000/
Subscriptions ready at ws://localhost:4000/graphql
```


<!-- No other changes to the server are needed. -->
不需要对服务器进行其他更改。

<!-- It's possible to test the subscriptions with the GraphQL playground like this: -->
可以使用 GraphQL 来测试订阅，如下所示:

![](../../images/8/31.png)



<!-- When you press "play" on a subscription, the playground waits for notifications from the subscription.  -->
当您按下订阅上的“ play”键时，playground就会等待订阅的通知。

<!-- The backend code can be found on [Github](https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-6), branch <i>part8-6</i>. -->
后端代码可以在[Github](https://Github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-6) ，branch<i>part8-6</i> 上找到。

### Subscriptions on the client
【客户端的订阅】

<!-- In order to use subscriptions in our React application, we have to do some changes, especially on its [configuration]((https://www.apollographql.com/docs/react/v3.0-beta/data/subscriptions/). -->
为了在我们的 React 应用中使用订阅，我们必须做一些更改，特别是在它的[配置](https://www.apollographql.com/docs/React/data/subscriptions/)上。
<!-- The configuration in <i>index.js</i> has to be modified like so:  -->
<i>index.js</i> 中的配置必须修改如下:

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

<!-- For this to work, we have to install some dependencies: -->
为了实现这一点，我们必须安装一些依赖项:

```bash
npm install @apollo/client subscriptions-transport-ws
```

<!-- The new configuration is due to the fact that the application must have an HTTP connection as well as a WebSocket connection to the GraphQL server. -->
新的配置是由于应用必须有一个 HTTP 连接以及一个到 GraphQL 服务器的 WebSocket 连接。

```js
const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: { reconnect: true }
})

const httpLink = createHttpLink({
  uri: 'http://localhost:4000',
})
```

<!-- The subscriptions are done using the [useSubscription](https://www.apollographql.com/docs/react/v3.0-beta/api/react/hooks/#usesubscription) hook function. -->
订阅是使用[useSubscription](https://www.apollographql.com/docs/react/api/react/hooks/#useSubscription)Hook函数完成的。

<!-- Let's modify the code like so: -->
让我们像这样修改代码:

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
    onSubscriptionData: ({ subscriptionData }) => {
      console.log(subscriptionData)
    }
  })

  // ...
}
```

<!-- When a new person is now added to the phonebook, no matter where it's done, the details of the new person are printed to the client’s console:  -->
当新用户添加到电话簿时，无论在哪里，新用户的详细信息都会打印到客户端的控制台上:

![](../../images/8/32e.png)



<!-- When a new person is added, the server sends a notification to the client, and the callback-function defined in the _onSubscriptionData_ attribute is called and given the details of the new person as parameters.  -->
添加新人时，服务器向客户端发送通知，并调用 onSubscriptionData 属性中定义的 callback-function，并将新人的详细信息作为参数提供。

<!-- Let's extend our solution so that when the details of a new person are received, the person is added to the Apollo cache, so it is rendered to the screen immediately.  -->
让我们扩展我们的解决方案，这样当接收到一个新用户的详细信息时，该用户将被添加到 Apollo 缓存中，因此它将立即渲染到屏幕上。

<!-- However, we have to keep in mind that when our application creates a new person, it should not be added to the cache twice:  -->
然而，我们必须记住，当我们的应用创建一个新的用户时，它不应该被添加到缓存中两次:


```js
const App = () => {
  // ...

  const updateCacheWith = (addedPerson) => {
    const includedIn = (set, object) => 
      set.map(p => p.id).includes(object.id)  

    const dataInStore = client.readQuery({ query: ALL_PERSONS })
    if (!includedIn(dataInStore.allPersons, addedPerson)) {
      client.writeQuery({
        query: ALL_PERSONS,
        data: { allPersons : dataInStore.allPersons.concat(addedPerson) }
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

  // ...
}
```

<!-- The function _updateCacheWith_ can also be used in _PersonForm_ for the cache update: -->
函数 updateCacheWith 也可以在 PersonForm 中用于缓存更新:

```js
const PersonForm = ({ setError, updateCacheWith }) => { // highlight-line
  // ...

  const [ createPerson ] = useMutation(CREATE_PERSON, {
    onError: (error) => {
      setError(error.graphQLErrors[0].message)
    },
    update: (store, response) => {
      updateCacheWith(response.data.addPerson) // highlight-line
    }
  })
   
  // ..
} 
```

<!-- The final code of the client can be found on [Github](https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-9), branch <i>part8-9</i>. -->
客户端的最终代码可以在[Github](https://Github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-9) ，branch<i>part8-9</i> 上找到。

### n+1-problem
【n + 1-问题】
<!-- Let's add some things to the backend. Let's modify the schema so that a <i>Person</i> type has a _friendOf_ field, which tells whose friends list the person is on.  -->
让我们在后端添加一些东西。 让我们修改模式，使<i>Person</i> 类型有一个 friendOf 字段，该字段告诉该人所在的好友列表。

```js
type Person {
  name: String!
  phone: String
  address: Address!
  friendOf: [User!]!
  id: ID!
}
```

<!-- The application should support the following query:  -->
应用应该支持如下查询:

```js
query {
  findPerson(name: "Leevi Hellas") {
    friendOf{
      username
    }
  }
}
```

<!-- Because _friendOf_ is not a field of <i>Person</i>-objects on the database, we have to create a resolver for it, which can solve this issue. Let's first create a resolver that returns an empty list:  -->
因为 friendOf 不是数据库中的<i>Person</i>-objects 字段，所以我们必须为它创建一个解析器，它可以解决这个问题。 让我们首先创建一个返回空列表的解析器:

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

<!-- The parameter _root_ is the person object for which friends list is being created, so we search from all _User_ objects the ones which have root._id in their friends list:  -->
参数 _root_ 是创建好友列表的人对象，因此我们从所有 _User_ 对象中搜索在好友列表中具有 root._id :

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


<!-- Now the application works.  -->
现在这个应用可以工作了。

<!-- We can immediately do even more complicated queries. It is possible for example to find the friends of all users: -->
我们可以立即进行更复杂的查询，例如找到所有用户的好友:

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

<!-- There is however one issue with our solution, it does an unreasonable amount of queries to the database. If we log every query to the database, and we have 5 persons saved, we see the following: -->
但是，我们的解决方案有一个问题，它对数据库执行的查询数量不合理。 如果我们将每个查询记录到数据库中，并保存了5个人，我们会看到如下结果:

<pre>
Person.find
User.find
User.find
User.find
User.find
User.find
</pre>



<!-- So even though we primarily do one query for all persons, every person causes one more query in their resolver.  -->
因此，即使我们主要对所有人进行一次查询，每个人在他们的解析器中还会导致另一次查询。

<!-- This is a manifestation of the famous [n+1-problem](https://www.google.com/search?q=n%2B1+problem), which appears every once in a while in different contexts, and sometimes sneaks up on developers without them noticing.  -->
这是著名的[n + 1-problem](https://www.google.com/search?q=n%2b1+problem 问题)的一种表现，它每隔一段时间就会在不同的上下文中出现，有时会悄悄出现在开发人员面前，而他们却没有注意到

<!-- Good solution for n+1 problem depends on the situation. Often it requires using some kind of a join query instead of multiple separate queries.  -->
N + 1问题的好解决方案取决于具体情况。 它通常需要使用某种类型的连接查询，而不是多个单独的查询。 

<!-- In our situation the easiest solution would be to save whose friends list they are on on each _Person_-object: -->
在我们的情况下，最简单的解决方案是在每个 Person-object 中保存他们所在的好友列表:

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

<!-- Then we could do a "join query", or populate the _friendOf_-fields of persons when we fetch the _Person_-objects: -->
然后我们可以做一个“连接查询” ，或者在获取 Person-objects 时填充 friendOf-字段:

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


<!-- After the change we would not need a separate resolver for the _friendOf_ field.  -->
更改之后，我们就不需要单独的 friendOf 字段的解析器了。

<!-- The allPersons query <i>does not cause</i> an n+1 problem, if we only  fetch the name and the phone number:  -->
如果我们只获取姓名和电话号码，allPersons 查询<i>不会导致</i> 出现 n + 1问题:

```js
query {
  allPersons {
    name
    phone
  }
}
```

<!-- If we modify _allPersons_ to do a join query because it sometimes causes n+1 problem, it becomes heavier when we don't need the information on related persons. By using the [fourth parameter](https://www.apollographql.com/docs/apollo-server/data/data/#resolver-type-signature) of resolver functions we could optimize the query even further. The fourth parameter can be used to inspect the query itself, so we could do the join query only in cases with predicted threat for n+1 problem. However, we should not jump into this level of optimization before we are sure it's worth it.  -->
如果我们修改 allPersons 来执行连接查询，因为它有时会导致 n + 1问题，当我们不需要相关人员的信息时，它会变得更重。 通过使用解析器函数的[第四个参数](https://www.apollographql.com/docs/apollo-server/data/resolvers/#resolver-arguments) ，我们可以进一步优化查询。 第四个参数可以用来检查查询本身，所以我们在预计会出现n+1问题时可以做join查询。 然而，在我们评估这是否值得，否则不应该进入这个优化级别。

<!-- [In the words of Donald Knuth](https://en.wikiquote.org/wiki/Donald_Knuth): -->
[用 Donald Knuth 的话来说](https://en.wikiquote.org/wiki/donald_knuth) :

> <i>Programmers waste enormous amounts of time thinking about, or worrying about, the speed of noncritical parts of their programs, and these attempts at efficiency actually have a strong negative impact when debugging and maintenance are considered. We should forget about small efficiencies, say about 97% of the time: <strong>premature optimization is the root of all evil.</strong></i><br>
程序员浪费大量的时间去思考或者担心程序中非关键部分的速度，而这些提高效率的尝试，在考虑调试和维护的时候实际上产生了很大的负面影响。 我们大约97% 的时间应该忘记这些小的效率提升，总结一下，过早优化是一切罪恶的根源。



<!-- Facebook's [DataLoader](https://github.com/facebook/dataloader) library offers a good solution for the n+1 problem among other issues. -->
Facebook's[DataLoader](https://github.com/Facebook/DataLoader)库为 n + 1问题以及其他问题提供了一个很好的解决方案。 
<!-- More about using DataLoader with Apollo server [here](https://www.robinwieruch.de/graphql-apollo-server-tutorial/#graphql-server-data-loader-caching-batching) and [here](http://www.petecorey.com/blog/2017/08/14/batching-graphql-queries-with-dataloader/). -->
更多关于使用 DataLoader 和 Apollo 服务器的信息参考[这里](https://www.robinwieruch.de/graphql-Apollo-server-tutorial/#graphql-server-data-loader-caching-batching)和[这里](http://www.petecorey.com/blog/2017/08/14/batching-graphql-queries-with-DataLoader/)。

### Epilogue
【后记】

<!-- The application we created in this part is not optimally structured: the schema, queries and the mutations should at least be moved outside of the application code. Examples for better structuring of GraphQL applications can be found on the internet. For example, for the server -->
<!-- [here](https://blog.apollographql.com/modularizing-your-graphql-schema-code-d7f71d5ed5f2) and the client [here](https://medium.com/@peterpme/thoughts-on-structuring-your-apollo-queries-mutations-939ba4746cd8). -->
我们在这一章节中创建的应用没有优化结构: 模式、查询和Mutation，至少应该移到应用代码之外。 更好地构造 GraphQL 应用的示例可以在互联网上找到。 例如，对于服务器[参考这里](https://blog.apollographql.com/modularizing-your-graphql-schema-code-d7f71d5ed5f2)和客户端[参考这里](https://medium.com/@peterpme/thoughts-on-structuring-your-apollo-queries-mutations-939ba4746cd8)。

<!-- GraphQL is already a pretty old technology, having been used by Facebook since 2012, so we can see it as "battle tested" already. Since Facebook published GraphQL in 2015, it has slowly gotten more and more attention, and might in the near future threaten the dominance of REST. The death of REST has also already been [predicted](https://www.stridenyc.com/podcasts/52-is-2018-the-year-graphql-kills-rest). Even though that will not happen quite yet, GraphQL is absolutely worth [learning](https://blog.graphqleditor.com/javascript-predictions-for-2019-by-npm/). -->
Graphql 已经是一项相当古老的技术了，自2012年以来 Facebook 一直在使用它，所以我们可以把它看作是“经受过战斗考验的”。 自从 Facebook 在2015年发布了 GraphQL 之后，它慢慢地得到了越来越多的关注，并且可能在不久的将来威胁到 REST 的统治地位。 Rest 的死亡也已经被[预测](https://www.stridenyc.com/podcasts/52-is-2018-The-year-graphql-kills-REST)。 尽管这种情况还没有完全发生，但是 GraphQL 绝对值得[学习](https://blog.graphqleditor.com/javascript-predictions-for-2019-by-npm/)的。 

</div>


<div class="tasks">


### Exercises 8.23.-8.26.


#### 8.23: Subscriptions - server

<!-- Do a backend implementation for subscription _bookAdded_, which returns the details of all new books to its subscribers.  -->
为订阅 _bookAdded_ 做一个后端实现，它将所有新书的详细信息返回给订阅者。

#### 8.24: Subscriptions - client, part 1
<!-- Start using subscriptions in the client, and subscribe to _bookAdded_. When new books are added, notify the user. Any method works. For example, you can use the [window.alert](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert) function.  -->
开始在客户端使用订阅，并订阅 _bookAdded_ 添加新书时，通知用户。 任何方法都有效。 例如，您可以使用[window.alert](https://developer.mozilla.org/en-us/docs/web/api/window/alert)函数。

#### 8.25: Subscriptions - client, part 2
<!-- Keep the application's view updated when the server notifies about new books.  You can test your implementation by opening the app in two browser tabs and adding a new book in one tab. Adding the new book should update the view in both tabs.
-->
当服务器通知有关新书时，保持应用视图更新。你可以通过打开浏览器的两个tab 页面来测试，在其中一个tab页新增一本书，另一个tab 页面应当同时更新了这本书。

#### 8.26: n+1
<!-- Solve the n+1 problem of the following query using any method you like -->
使用任何您喜欢的方法解决如下查询的 n + 1问题

```js
query {
  allAuthors {
    name 
    bookCount
  }
}
```

<!-- This was the last exercise for this part of the course and it's time to push your code to GitHub and mark all of your finished exercises to the [exercise submission system](https://studies.cs.helsinki.fi/stats/courses/fullstackopen). -->
这是本课程这一章节的最后一个练习，现在是时候把你的代码推送到 GitHub，并将所有完成的练习标记到[练习提交系统](https://studies.cs.helsinki.fi/stats/courses/fullstackopen)。

</div>

