---
mainImage: ../../../images/part-8.svg
part: 8
letter: b
lang: zh
---

<div class="content">

<!-- We will next implement a React app which uses the GraphQL server we created.-->
我们接下来将实现一个使用我们创建的GraphQL服务器的React应用程序。

<!-- The current code of the server can be found on [GitHub](https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-3), branch <i>part8-3</i>.-->
当前服务器的代码可以在[GitHub](https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-3)上找到，分支为<i>part8-3</i>。

<!-- In theory, we could use GraphQL with HTTP POST requests. The following shows an example of this with Postman:-->
在理论上，我们可以使用GraphQL与HTTP POST请求。以下是Postman的示例：

![postman showing localhost:4000 graphql with allPersons query](../../images/8/8x.png)

<!-- The communication works by sending HTTP POST requests to <http://localhost:4000/graphql>. The query itself is a string sent as the value of the key <i>query</i>.-->
通信通过向<http://localhost:4000/graphql>发送HTTP POST请求来实现。查询本身是作为<i>query</i>键的值发送的字符串。

<!-- We could take care of the communication between the React app and GraphQL by using Axios. However, most of the time, it is not very sensible to do so. It is a better idea to use a higher-order library capable of abstracting the unnecessary details of the communication.-->
我们可以通过使用Axios来处理React应用程序和GraphQL之间的通信。但是，大多数时候，这样做并不明智。使用一个能够抽象出通信中不必要细节的高阶库是一个更好的想法。

<!-- At the moment, there are two good options: [Relay](https://facebook.github.io/relay/) by Facebook and [Apollo Client](https://www.apollographql.com/docs/react/), which is the client side of the same library we used in the previous section. Apollo is absolutely the most popular of the two, and we will use it in this section as well.-->
目前有两个不错的选择：Facebook 的[Relay](https://facebook.github.io/relay/) 和[Apollo Client](https://www.apollographql.com/docs/react/)，它是我们在前一节中使用的同一个库的客户端。Apollo 绝对是两者中最受欢迎的，我们也将在本节中使用它。

### Apollo client

<!-- Let us create a new React-app, and can continue installing dependencies required by [Apollo client](https://www.apollographql.com/docs/react/get-started/).-->
让我们创建一个新的React-app，并可以继续安装[Apollo客户端](https://www.apollographql.com/docs/react/get-started/)所需的依赖项。

```bash
npm install @apollo/client graphql
```

<!-- We''ll start with the following code for our application:-->
我们将从下面的代码开始我们的应用程序：

```js
import ReactDOM from 'react-dom/client'
import App from './App'

import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache(),
})

const query = gql`
  query {
    allPersons  {
      name,
      phone,
      address {
        street,
        city
      }
      id
    }
  }
`

client.query({ query })
  .then((response) => {
    console.log(response.data)
  })


ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

<!-- The beginning of the code creates a new [client](https://www.apollographql.com/docs/react/get-started/#create-a-client) object, which is then used to send a query to the server:-->
开始的代码创建一个新的[客户端](https://www.apollographql.com/docs/react/get-started/#create-a-client)对象，然后用它来向服务器发送查询：

```js
client.query({ query })
  .then((response) => {
    console.log(response.data)
  })
```

<!-- The server''s response is printed to the console:-->
服务器的响应被打印到控制台：

![devtools shows allPersons array with 3 people](../../images/8/9a.png)

<!-- The application can communicate with a GraphQL server using the *client* object. The client can be made accessible for all components of the application by wrapping the <i>App</i> component with [ApolloProvider](https://www.apollographql.com/docs/react/get-started/#connect-your-client-to-react).-->
应用程序可以使用*客户端*对象与GraphQL服务器进行通信。可以通过将<i>App</i>组件包装在[ApolloProvider](https://www.apollographql.com/docs/react/get-started/#connect-your-client-to-react)中，使客户端对应用程序的所有组件都可用。

```js
import ReactDOM from 'react-dom/client'
import App from './App'

import {
  ApolloClient,
  ApolloProvider, // highlight-line
  InMemoryCache,
} from '@apollo/client'

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache(),
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}> // highlight-line
    <App />
  </ApolloProvider> // highlight-line
)
```

### Making queries

<!-- We are ready to implement the main view of the application, which shows a list of person''s name and phone number.-->
我们准备实施应用程序的主视图，它显示一个人的姓名和电话号码列表。

<!-- Apollo Client offers a few alternatives for making [queries](https://www.apollographql.com/docs/react/data/queries/).-->
Apollo Client 提供了几种查询[查询](https://www.apollographql.com/docs/react/data/queries/)的替代方案。
<!-- Currently, the use of the hook function [useQuery](https://www.apollographql.com/docs/react/api/react/hooks/#usequery) is the dominant practice.-->
目前，使用钩子函数[useQuery](https://www.apollographql.com/docs/react/api/react/hooks/#usequery)是主流实践。

<!-- The query is made by the <i>App</i> component, the code of which is as follows:-->
由<i>App</i>组件提出的查询，其代码如下：

```js
import { gql, useQuery } from '@apollo/client'

const ALL_PERSONS = gql`
query {
  allPersons {
    name
    phone
    id
  }
}
`

const App = () => {
  const result = useQuery(ALL_PERSONS)

  if (result.loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      {result.data.allPersons.map(p => p.name).join(', ')}
    </div>
  )
}

export default App
```

<!-- When called, *useQuery* makes the query it receives as a parameter.-->
当被调用时，*useQuery*会根据所接收的参数执行查询。
<!-- It returns an object with multiple [fields](https://www.apollographql.com/docs/react/api/react/hooks/#result).-->
它返回一个具有多个[字段](https://www.apollographql.com/docs/react/api/react/hooks/#result)的对象。
<!-- The field <i>loading</i> is true if the query has not received a response yet.-->
<i>加载</i>字段为真，如果查询尚未得到回复。
<!-- Then the following code gets rendered:-->
然后渲染以下代码：

```js
if (result.loading) {
  return <div>loading...</div>
}
```

<!-- When a response is received, the result of the <i>allPersons</i> query can be found from the <i>data</i> field, and we can render the list of names to the screen.-->
当收到响应时，可以从<i>data</i>字段中找到<i>allPersons</i>查询的结果，我们可以将名字列表呈现到屏幕上。

```js
<div>
  {result.data.allPersons.map(p => p.name).join(', ')}
</div>
```

<!-- Let''s separate displaying the list of persons into its own component:-->
让我们把显示人员名单分离成自己的组件：

```js
const Persons = ({ persons }) => {
  return (
    <div>
      <h2>Persons</h2>
      {persons.map(p =>
        <div key={p.name}>
          {p.name} {p.phone}
        </div>
      )}
    </div>
  )
}
```

<!-- The *App* component still makes the query, and passes the result to the new component to be rendered:-->
*应用*组件仍然会进行查询，并将结果传递给新组件以进行渲染：

```js
const App = () => {
  const result = useQuery(ALL_PERSONS)

  if (result.loading)  {
    return <div>loading...</div>
  }

  return (
    <Persons persons={result.data.allPersons}/>
  )
}
```

### Named queries and variables

<!-- Let''s implement functionality for viewing the address details of a person. The <i>findPerson</i> query is well-suited for this.-->
让我们实现查看一个人的地址详情的功能。<i>findPerson</i>查询非常适合这个。

<!-- The queries we did in the last chapter had the parameter hardcoded into the query:-->
上一章中我们做的查询把参数固定在查询中：

```js
query {
  findPerson(name: "Arto Hellas") {
    phone
    city
    street
    id
  }
}
```

<!-- When we do queries programmatically, we must be able to give them parameters dynamically.-->
当我们编程地执行查询时，我们必须能够动态地给它们参数。

<!-- GraphQL [variables](https://graphql.org/learn/queries/#variables) are well-suited for this. To be able to use variables, we must also name our queries.-->
GraphQL [变量](https://graphql.org/learn/queries/#variables) 非常适合这种情况。 为了能够使用变量，我们还必须命名我们的查询。

<!-- A good format for the query is this:-->
一个好的查询格式如下：

```js
query findPersonByName($nameToSearch: String!) {
  findPerson(name: $nameToSearch) {
    name
    phone
    address {
      street
      city
    }
  }
}
```

<!-- The name of the query is <i>findPersonByName</i>, and it is given a string <i>$nameToSearch</i> as a parameter.-->
查询的名称是<i>findPersonByName</i>，它被给予一个字符串<i>$nameToSearch</i>作为参数。

<!-- It is also possible to do queries with parameters with the Apollo Explorer. The parameters are given in <i>Variables</i>:-->
也可以使用Apollo探索者带参数进行查询。参数在<i>变量</i>中给出：

![apollostudio findPersonByName highlighting nameToSearch Arto Hellas](../../images/8/10x.png)

<!-- The *useQuery* hook is well-suited for situations where the query is done when the component is rendered.  However, we now want to make the query only when a user wants to see the details of a specific person, so the query is done only [as required](https://www.apollographql.com/docs/react/data/queries/#executing-queries-manually).-->
*useQuery* 钩子非常适合在组件渲染时执行查询的情况。但是，我们现在只有在用户想要查看特定人员的详细信息时才执行查询，因此只有[根据需要](https://www.apollographql.com/docs/react/data/queries/#executing-queries-manually)才会执行查询。

<!-- One possibility for this kind of situations is the hook function [useLazyQuery](https://www.apollographql.com/docs/react/api/react/hooks/#uselazyquery) that would make it possible to define a query which is executed <i>when</i> the user wants to see the detailed information of a person.-->
一种可能的解决方案是使用[useLazyQuery](https://www.apollographql.com/docs/react/api/react/hooks/#uselazyquery)钩子函数，它可以定义一个查询，当用户想查看某个人的详细信息时才会执行。

<!-- However, in our case we can stick to *useQuery* and use the option [skip](https://www.apollographql.com/docs/react/data/queries/#skip), which makes it possible to do the query only if a set condition is true.-->
但是，在我们的情况下，我们可以坚持* useQuery* 并使用[skip]选项（https://www.apollographql.com/docs/react/data/queries/#skip），只有在一组条件为真时才能执行查询。

<!-- The solution is as follows:-->
以下是解决方案：

```js
import { useState } from 'react'
import { gql, useQuery } from '@apollo/client'

const FIND_PERSON = gql`
  query findPersonByName($nameToSearch: String!) {
    findPerson(name: $nameToSearch) {
      name
      phone
      id
      address {
        street
        city
      }
    }
  }
`

const Person = ({ person, onClose }) => {
  return (
    <div>
      <h2>{person.name}</h2>
      <div>
        {person.address.street} {person.address.city}
      </div>
      <div>{person.phone}</div>
      <button onClick={onClose}>close</button>
    </div>
  )
}

const Persons = ({ persons }) => {
  // highlight-start
  const [nameToSearch, setNameToSearch] = useState(null)
  const result = useQuery(FIND_PERSON, {
    variables: { nameToSearch },
    skip: !nameToSearch,
  })
  // highlight-end

  // highlight-start
  if (nameToSearch && result.data) {
    return (
      <Person
        person={result.data.findPerson}
        onClose={() => setNameToSearch(null)}
      />
    )
  }
  // highlight-end

  return (
    <div>
      <h2>Persons</h2>
      {persons.map((p) => (
        <div key={p.name}>
          {p.name} {p.phone}
          <button onClick={() => setNameToSearch(p.name)}> // highlight-line
            show address // highlight-line
          </button> // highlight-line
        </div>
      ))}
    </div>
  )
}

export default Persons
```

<!-- The code has changed quite a lot, and all of the changes are not completely apparent.-->
代码发生了相当大的变化，而且所有的变化并不完全显而易见。

<!-- When the button <i>show address</i> of a person is pressed, the name of the person is set to state <i>nameToSearch</i>:-->
当按下一个人的按钮<i>显示地址</i>时，该人的名字被设置为状态<i>nameToSearch</i>：

```js
<button onClick={() => setNameToSearch(p.name)}>
  show address
</button>
```

<!-- This causes the component to re-render itself. On render the query <i>FIND_PERSON</i> that fetches the detailed information of a user is executed <i>if the variable nameToSearch</i> has a value:-->
这导致组件重新渲染自身。在渲染时，<i>如果变量nameToSearch</i>有值，则会执行查询<i>FIND_PERSON</i>，以获取用户的详细信息：

```js
const result = useQuery(FIND_PERSON, {
  variables: { nameToSearch },
  skip: !nameToSearch, // highlight-line
})
```

<!-- When user is not interested in seeing the detailed info of any person, the state variable <i>nameToSearch</i> is null and the query is not executed.-->
当用户不感兴趣查看任何人的详细信息时，状态变量<i>nameToSearch</i>为空，查询不会执行。

<!-- If the state <i>nameToSearch</i> has a value and the query result is ready, the component <i>Person</i> renders the detailed info of a person:-->
如果状态<i>nameToSearch</i>有值，且查询结果准备就绪，组件<i>Person</i>就会渲染某人的详细信息：

```js
if (nameToSearch && result.data) {
  return (
    <Person
      person={result.data.findPerson}
      onClose={() => setNameToSearch(null)}
    />
  )
}
```

<!-- A single person view looks like this:-->
一个人的视角看起来像这样：

![browser showing single person](../../images/8/11.png)

<!-- When a user wants to return to the persons list, the *nameToSearch* state is set to *null*.-->
当用户想返回到人员列表时，*nameToSearch* 状态被设置为*null*。

<!-- The current code of the application can be found on [GitHub](https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-1) branch <i>part8-1</i>.-->
当前应用的代码可以在[GitHub](https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-1)分支<i>part8-1</i>中找到。

### Cache

<!-- When we do multiple queries, for example with the address details of Arto Hellas, we notice something interesting: the query to the backend is done only the first time around. After this, despite the same query being done again by the code, the query is not sent to the backend.-->
当我们做多个查询时，例如使用Arto Hellas的地址详细信息，我们注意到一些有趣的事情：第一次查询后端时只做一次。在此之后，尽管代码再次执行相同的查询，但不会再发送查询到后端。

![browser showing dev tools response with network tab and graphql](../../images/8/12.png)

<!-- Apollo client saves the responses of queries to [cache](https://www.apollographql.com/docs/react/caching/overview/). To optimize performance if the response to a query is already in the cache, the query is not sent to the server at all.-->
Apollo客户端将查询的响应保存到[缓存](https://www.apollographql.com/docs/react/caching/overview/)中。 为了优化性能，如果查询的响应已经在缓存中，则根本不会将查询发送到服务器。

![apollo dev tools showing root_query allPersons](../../images/8/13x.png)

<!-- Cache shows the detailed info of Arto Hellas after the query <i>findPerson</i>:-->
<i>findPerson</i> 查询后，缓存显示 Arto Hellas 的详细信息：

![apollo dev tools showing first person with information](../../images/8/13z.png)

### Doing mutations

<!-- Let''s implement functionality for adding new persons.-->
让我们实现添加新人的功能。

<!--  In the previous chapter, we hardcoded the parameters for mutations. Now, we need a version of the addPerson mutation which uses [variables](https://graphql.org/learn/queries/#variables):-->
在上一章中，我們對突變硬編碼了參數。現在，我們需要一個使用[變量](https://graphql.org/learn/queries/#variables)的addPerson突變版本：

```js
const CREATE_PERSON = gql`
mutation createPerson($name: String!, $street: String!, $city: String!, $phone: String) {
  addPerson(
    name: $name,
    street: $street,
    city: $city,
    phone: $phone
  ) {
    name
    phone
    id
    address {
      street
      city
    }
  }
}
`
```

<!-- The hook function [useMutation](https://www.apollographql.com/docs/react/api/react/hooks/#usemutation) provides the functionality for making mutations.-->
[useMutation](https://www.apollographql.com/docs/react/api/react/hooks/#usemutation) 钩子函数提供了进行变更的功能。

<!-- Let''s create a new component for adding a new person to the directory:-->
让我们创建一个新组件来添加一个新人到目录中：

```js
import { useState } from 'react'
import { gql, useMutation } from '@apollo/client'

const CREATE_PERSON = gql`
  // ...
`

const PersonForm = () => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')

  const [ createPerson ] = useMutation(CREATE_PERSON) // highlight-line

  const submit = (event) => {
    event.preventDefault()

    // highlight-start
    createPerson({  variables: { name, phone, street, city } })
    // highlight-end

    setName('')
    setPhone('')
    setStreet('')
    setCity('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={submit}>
        <div>
          name <input value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          phone <input value={phone}
            onChange={({ target }) => setPhone(target.value)}
          />
        </div>
        <div>
          street <input value={street}
            onChange={({ target }) => setStreet(target.value)}
          />
        </div>
        <div>
          city <input value={city}
            onChange={({ target }) => setCity(target.value)}
          />
        </div>
        <button type='submit'>add!</button>
      </form>
    </div>
  )
}

export default PersonForm
```

<!-- Lomakkeen koodi on suoraviivainen, mielenkiintoiset rivit on korostettu. Mutaation suorittava funktio saadaan luotua _useMutation_-hookin avulla. Hook palauttaa kyselyfunktion <i>taulukon</i> ensimmäisenä alkiona: -->
<!-- The code of the form is straightforward and the interesting lines have been highlighted.-->
代码表单很简单，有趣的行已经被突出显示。
<!-- We can define mutation functions using the *useMutation* hook.-->
我们可以使用*useMutation*钩子定义变异函数。
<!-- The hook returns an <i>array</i>, the first element of which contains the function to cause the mutation.-->
钩子返回一个<i>数组</i>，第一个元素包含了导致变异的函数。

```js
const [ createPerson ] = useMutation(CREATE_PERSON)
```

<!-- Kyselyä tehtäessä määritellään kyselyn muuttujille arvot: -->
<!-- The query variables receive values when the query is made:-->
查询变量在查询时接收值：

```js
createPerson({  variables: { name, phone, street, city } })
```

<!-- New persons are added just fine, but the screen is not updated. This is because Apollo Client cannot automatically update the cache of an application, so it still contains the state from before the mutation.-->
新人员添加得很好，但屏幕没有更新。这是因为Apollo Client无法自动更新应用程序的缓存，因此它仍然包含变异之前的状态。
<!-- We could update the screen by reloading the page, as the cache is emptied when the page is reloaded. However, there must be a better way to do this.-->
我們可以通過重新加載頁面來更新屏幕，因為當頁面重新加載時緩存將被清空。但是，一定有更好的方法來做到這一點。

### Updating the cache

<!-- There are a few different solutions for this. One way is to make the query for all persons [poll](https://www.apollographql.com/docs/react/data/queries/#polling) the server, or make the query repeatedly.-->
这里有几种不同的解决方案。一种方法是为所有人[poll](https://www.apollographql.com/docs/react/data/queries/#polling)服务器，或者反复进行查询。

<!-- The change is small. Let''s set the query to poll every two seconds:-->
小改變。讓我們將查詢設置為每兩秒投票一次：

```js
const App = () => {
  const result = useQuery(ALL_PERSONS, {
    pollInterval: 2000 // highlight-line
  })

  if (result.loading)  {
    return <div>loading...</div>
  }

  return (
    <div>
      <Persons persons = {result.data.allPersons}/>
      <PersonForm />
    </div>
  )
}

export default App
```

<!-- The solution is simple, and every time a user adds a new person, it appears immediately on the screens of all users.-->
解决方案很简单，每当用户添加新人物时，它立即出现在所有用户的屏幕上。

<!-- The bad side of the solution is all the pointless web traffic.-->
**坏面的解决方案就是所有毫无意义的网络流量。**

<!-- Another easy way to keep the cache in sync is to use the *useMutation* hook''s [refetchQueries](https://www.apollographql.com/docs/react/data/refetching/) parameter to define that the query fetching all persons is done again whenever a new person is created.-->
另一种簡單的保持緩存同步的方法是使用*useMutation*鉤子的[refetchQueries](https://www.apollographql.com/docs/react/data/refetching/)參數定義為每次創建新人時再次執行查詢獲取所有人的查詢。

```js
const ALL_PERSONS = gql`
  query  {
    allPersons  {
      name
      phone
      id
    }
  }
`

const PersonForm = (props) => {
  // ...

  const [ createPerson ] = useMutation(CREATE_PERSON, {
    refetchQueries: [ { query: ALL_PERSONS } ] // highlight-line
  })
```

<!-- The pros and cons of this solution are almost opposite of the previous one''s. There is no extra web traffic, because queries are not done just in case.  However, if one user now updates the state of the server, the changes do not show to other users immediately.-->
这个解决方案的利弊几乎与之前的相反。不会有额外的网络流量，因为查询不是为了什么都做。但是，如果一个用户现在更新服务器的状态，这些变化不会立即显示给其他用户。

<!-- If you want to do multiple queries, you can pass multiple objects inside refetchQueries. This will allow you to update different parts of your app at the same time. Here is an example:-->
如果你想要做多个查询，你可以在refetchQueries中传入多个对象。这将允许您同时更新应用程序的不同部分。下面是一个例子：

```js
    const [ createPerson ] = useMutation(CREATE_PERSON, {
    refetchQueries: [ { query: ALL_PERSONS }, { query: OTHER_QUERY }, { query: ... } ] // pass as many queries as you need
  })
```

<!-- There are other ways to update the cache. More about those later in this part.-->
有其他方式来更新缓存。关于这些，稍后在本部分中会有更多介绍。

<!-- At the moment, queries and components are defined in the same place in our code.-->
目前，我们的代码中查询和组件都定义在同一个地方。
<!-- Let''s separate the query definitions into their own file <i>queries.js</i>:-->
让我们把查询定义放到它们自己的文件<i>queries.js</i>中：

```js
import { gql } from '@apollo/client'

export const ALL_PERSONS = gql`
  query {
    // ...
  }
`
export const FIND_PERSON = gql`
  query findPersonByName($nameToSearch: String!) {
    // ...
  }
`

export const CREATE_PERSON = gql`
  mutation createPerson($name: String!, $street: String!, $city: String!, $phone: String) {
    // ...
  }
`
```

<!-- Each component then imports the queries it needs:-->
每个组件然后导入它所需要的查询：

```js
import { ALL_PERSONS } from './queries'

const App = () => {
  const result = useQuery(ALL_PERSONS)
  // ...
}
```

<!-- The current code of the application can be found on [GitHub](https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-2) branch <i>part8-2</i>.-->
当前应用的代码可以在[GitHub](https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-2)分支<i>part8-2</i>中找到。

### Handling mutation errors

<!-- Trying to create a person with invalid data causes an error:-->
尝试用无效数据创建一个人会导致错误：

![devtools showing error: name must be unique](../../images/8/14x.png)

<!-- We should handle the exception. We can register an error handler function to the mutation using the *useMutation* hook''s *onError* [option](https://www.apollographql.com/docs/react/api/react/hooks/#params-2).-->
我们应该处理异常。我们可以使用*useMutation* hook的*onError* [选项](https://www.apollographql.com/docs/react/api/react/hooks/#params-2)将错误处理函数注册到变异中。

<!-- Let''s register the mutation with an error handler which uses the *setError*-->
function

让我们使用*setError*函数注册一个带有错误处理器的变异
<!-- function it receives as a parameter to set an error message:-->
函数接收一个参数来设置一个错误消息：

```js
const PersonForm = ({ setError }) => {
  // ...

  const [ createPerson ] = useMutation(CREATE_PERSON, {
    refetchQueries: [  {query: ALL_PERSONS } ],
    // highlight-start
    onError: (error) => {
      const errors = error.graphQLErrors[0].extensions.error.errors
      const messages = Object.values(errors).map(e => e.message).join('\n')
      setError(messages)
    }
    // highlight-end
  })

  // ...
}
```

<!-- We have to dig quite deep to the error object until we find the proper error messages...-->
我们必须深入挖掘错误对象，直到找到正确的错误信息...

<!-- We can then render the error message on the screen as necessary:-->
我們可以根據需要將錯誤訊息呈現在螢幕上：

```js
const App = () => {
  const [errorMessage, setErrorMessage] = useState(null) // highlight-line

  const result = useQuery(ALL_PERSONS)

  if (result.loading)  {
    return <div>loading...</div>
  }

// highlight-start
  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }
  // highlight-end

  return (
    <div>
      <Notify errorMessage={errorMessage} />  // highlight-line
      <Persons persons = {result.data.allPersons} />
      <PersonForm setError={notify} />  // highlight-line
    </div>
  )
}

// highlight-start
const Notify = ({errorMessage}) => {
  if ( !errorMessage ) {
    return null
  }

  return (
    <div style={{color: 'red'}}>
    {errorMessage}
    </div>
  )
}
// highlight-end
```

<!-- Now the user is informed about an error with a simple notification.-->
现在，用户通过简单的通知被告知了错误。

![browser showing in red name must be unique](../../images/8/15.png)

<!-- The current code of the application can be found on [GitHub](https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-3) branch <i>part8-3</i>.-->
当前应用的代码可以在[GitHub](https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-3)分支<i>part8-3</i>上找到。

### Updating a phone number

<!-- Let''s add the possibility to change the phone numbers of persons to our application. The solution is almost identical to the one we used for adding new persons.-->
让我们在我们的应用中加入更改人员电话号码的可能性。这个解决方案几乎和我们用来添加新人员的方案是一样的。

<!-- Again, the mutation requires parameters.-->
再一次，突变需要参数。

```js
export const EDIT_NUMBER = gql`
  mutation editNumber($name: String!, $phone: String!) {
    editNumber(name: $name, phone: $phone) {
      name
      phone
      address {
        street
        city
      }
      id
    }
  }
`
```

<!-- The <i>PhoneForm</i> component responsible for the change is straightforward. The form has fields for the person''s name and new phone number, and calls the *changeNumber* function. The function is done using the *useMutation* hook.-->
<i>PhoneForm</i> 组件负责更改是很简单的。 该表格具有人员姓名和新电话号码的字段，并调用*changeNumber*函数。 该函数使用*useMutation*钩子完成。
<!-- Interesting lines on the code have been highlighted.-->
有趣的代码行已经被突出显示。

```js
import { useState } from 'react'
import { useMutation } from '@apollo/client'

import { EDIT_NUMBER } from '../queries'

const PhoneForm = () => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

// highlight-start
  const [ changeNumber ] = useMutation(EDIT_NUMBER)
// highlight-end

  const submit = (event) => {
    event.preventDefault()

// highlight-start
    changeNumber({ variables: { name, phone } })
    // highlight-end

    setName('')
    setPhone('')
  }

  return (
    <div>
      <h2>change number</h2>

      <form onSubmit={submit}>
        <div>
          name <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          phone <input
            value={phone}
            onChange={({ target }) => setPhone(target.value)}
          />
        </div>
        <button type='submit'>change number</button>
      </form>
    </div>
  )
}

export default PhoneForm
```

<!-- It looks bleak, but it works:-->
它看起来很暗淡，但它却有效果：

![browser showing main page with name and phone having information in the input](../../images/8/22a.png)

<!-- Surprisingly, when a person''s number is changed, the new number automatically appears on the list of persons rendered by the <i>Persons</i> component.-->
令人惊讶的是，当一个人的号码被改变时，新号码会自动出现在<i>Persons</i>组件渲染的人员列表中。
<!-- This happens because each person has an identifying field of type <i>ID</i>, so the person''s details saved to the cache update automatically when they are changed with the mutation.-->
因为每个人都有一个类型为<i>ID</i>的识别字段，所以当他们的细节通过变异被更新时，这个人的详细信息也会自动保存到缓存中。

<!-- Our application still has one small flaw. If we try to change the phone number for a name which does not exist, nothing seems to happen.-->
我们的应用程序仍有一个小缺陷。如果我们尝试更改不存在的名字的电话号码，似乎什么也没有发生。
<!-- This happens because if a person with the given name cannot be found,-->
the search will expand to include alternate spellings.

因为如果找不到拥有这个名字的人，搜索将会扩展到包括拼写变体。
<!-- the mutation response is <i>null</i>:-->
突变反应为<i>空</i>：

![dev tools showing network with localhost and response with editNumber being null](../../images/8/23ea.png)

<!-- For GraphQL, this is not an error, so registering an *onError* error handler is not useful.-->
对于GraphQL而言，这不是一个错误，因此注册*onError*错误处理程序没有任何用处。

<!-- We can use the *result* field returned by the *useMutation* hook as its second parameter to generate an error message.-->
我们可以使用*useMutation*钩子返回的*result*字段作为第二个参数来生成错误消息。

```js
const PhoneForm = ({ setError }) => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  const [ changeNumber, result ] = useMutation(EDIT_NUMBER) // highlight-line

  const submit = (event) => {
    // ...
  }

  // highlight-start
  useEffect(() => {
    if (result.data && result.data.editNumber === null) {
      setError('person not found')
    }

  }, [result.data])
  // highlight-end

  // ...
}
```

<!-- If a person cannot be found, or the *result.data.editNumber* is *null*, the component uses the callback function it received as props to set a suitable error message.-->
如果找不到一个人，或者*result.data.editNumber*是*null*，组件就会使用它作为props接收到的回调函数来设置一个合适的错误消息。
<!-- We want to set the error message only when the result of the mutation-->
is false

我們只想在突變的結果為false時設定錯誤訊息。
<!-- *result.data* changes, so we use the useEffect hook to control setting the error message.-->
因为 *result.data* 变化，所以我们使用 useEffect 钩子来控制设置错误消息。

<!-- Using useEffect causes an ESLint warning:-->
使用`useEffect`会引发ESLint警告：

![vscode useEffect has a missing dependency setError](../../images/8/41x.png)

<!-- The warning is pointless, and the easiest solution is to ignore the ESLint rule on the line:-->
警告毫无意义，最简单的解决方案是忽略行上的ESLint规则：

```js
useEffect(() => {
  if (result.data && !result.data.editNumber) {
    setError('name not found')
  }
// highlight-start
}, [result.data])  // eslint-disable-line
// highlight-end
```

<!-- We could try to get rid of the warning by adding the *setError* function to useEffect''s second parameter array:-->
我们可以通过将*setError*函数添加到useEffect的第二个参数数组中来尝试消除警告：

```js
useEffect(() => {
  if (result.data && !result.data.editNumber) {
    setError('name not found')
  }
// highlight-start
}, [result.data, setError])
// highlight-end
```

<!-- However, this solution does not work if the *notify* function is not wrapped to a [useCallback](https://reactjs.org/docs/hooks-reference.html#usecallback) function.  If it''s not, this results in an endless loop. When the *App* component is rerendered after a notification is removed, a <i>new version</i> of *notify* gets created which causes the effect function to be executed, which causes a new notification, and so on, and so on...-->
然而，如果*notify*函数没有被包装到[useCallback](https://reactjs.org/docs/hooks-reference.html#usecallback)函数中，这种解决方案就不起作用了。如果没有包装，就会导致无限循环。当*App*组件在通知被移除后重新渲染时，*notify*会创建一个<i>新版本</i>，这会导致effect函数被执行，从而导致新的通知，如此循环往复......

<!-- The current code of the application can be found on [GitHub](https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-4) branch <i>part8-4</i>.-->
目前的应用程序代码可以在[GitHub](https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-4)的<i>part8-4</i>分支中找到。

### Apollo Client and the applications state

<!-- In our example, management of the applications state has mostly become the responsibility of Apollo Client. This is a quite typical solution for GraphQL applications.-->
在我们的例子中，应用状态的管理主要成为了Apollo Client的责任。这对于GraphQL应用来说是一个相当典型的解决方案。
<!-- Our example uses the state of the React components only to manage the state of a form and to show error notifications. As a result, it could be that there are no justifiable reasons to use Redux to manage application state when using GraphQL.-->
我们的示例只使用React组件的状态来管理表单的状态并显示错误通知。因此，在使用GraphQL时，可能没有合理的理由使用Redux来管理应用程序状态。

<!-- When necessary, Apollo enables saving the application''s local state to [Apollo cache](https://www.apollographql.com/docs/react/local-state/local-state-management/).-->
当有必要时，Apollo可以将应用程序的本地状态保存到[Apollo缓存](https://www.apollographql.com/docs/react/local-state/local-state-management/)中。

</div>

<div class="tasks">

### Exercises 8.8.-8.12

<!-- Through these exercises, we''ll implement a frontend for the GraphQL library.-->
通过这些练习，我们将为GraphQL库实现一个前端。

<!-- Take [this project](https://github.com/fullstack-hy2020/library-frontend) as a start for your application.-->
把[这个项目](https://github.com/fullstack-hy2020/library-frontend)作为你的应用的起点。

<!-- **Note** if you want, you can also use [React router](/en/part7/react_router) to implement the application''s navigation!-->
**注意**：如果你愿意，你也可以使用[React router](/en/part7/react_router)来实现应用程序的导航！

#### 8.8: Authors view

<!-- Implement an Authors view to show the details of all authors on a page as follows:-->
实现一个作者视图，在一个页面上显示所有作者的详细信息，如下所示：

![browser showing 5 authors with the buttons](../../images/8/16.png)

#### 8.9: Books view

<!-- Implement a Books view to show on a page all other details of all books except their genres.-->
实现一个书籍视图，在页面上显示所有书籍的其他详细信息，除了它们的类型。

![browser showing 7 books with the button](../../images/8/17.png)

#### 8.10: Adding a book

<!-- Implement a possibility to add new books to your application. The functionality can look like this:-->
实现一个可能性，将新书添加到你的应用程序中。 该功能可以看起来像这样：

![browser showing the add book form with data fulfilled](../../images/8/18.png)

<!-- Make sure that the Authors and Books views are kept up to date after a new book is added.-->
确保在添加新书籍后，作者和书籍视图保持最新。

<!-- In case of problems when making queries or mutations, check from the developer console what the server response is:-->
在做查詢或者突變時遇到問題時，請檢查開發者控制台服務器的響應是什麼：

![browser unhandled rejection and dev tools network and preview highlighted showing error message](../../images/8/42ea.png)

#### 8.11: Authors birth year

<!-- Implement a possibility to set authors birth year. You can create a new view for setting the birth year, or place it on the Authors view:-->
实现一个设置作者出生年份的可能性。您可以为设置出生年份创建一个新视图，或者将其放在作者视图上：

![browser showing born input text field year](../../images/8/20.png)

<!-- Make sure that the Authors view is kept up to date after setting a birth year.-->
确保在设置出生年份后，作者视图得到更新。

#### 8.12: Authors birth year advanced

<!-- Change the birth year form so that a birth year can be set only for an existing author. Use [select tag](https://reactjs.org/docs/forms.html#the-select-tag), [react select](https://github.com/JedWatson/react-select), or some other mechanism.-->
改变出生年份表单，以便只为现有作者设定出生年份。使用[select 标签](https://reactjs.org/docs/forms.html#the-select-tag)、[react select](https://github.com/JedWatson/react-select)或其他机制。

<!-- A solution using the react select library looks as follows:-->
使用 React Select 库的解决方案如下：

![browser showing set birthyear option for existing name](../../images/8/21.png)

</div>
