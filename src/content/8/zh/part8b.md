---
mainImage: ../../../images/part-8.svg
part: 8
letter: b
lang: zh
---

<div class="content">


<!-- We will next implement a React-app which uses the GraphQL server we created. -->
接下来我们将实现一个 React-app，它使用我们创建的 GraphQL 服务器。

<!-- The current code of the server can be found on [Github](https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-3), branch <i>part8-3</i>. -->
服务器的当前代码可以在[Github](https://Github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-3) ，branch<i>part8-3</i> 上找到。

<!-- In theory, we could use GraphQL with HTTP POST -requests. The following shows an example of this with Postman.  -->
理论上，我们可以用 HTTP POST 请求使用 GraphQL。如下展示了用Postman请求的一个例子

![](../../images/8/8.png)

<!-- The communication works by sending HTTP POST -requests to http://localhost:4000/graphql. The query itself is a string sent as the value of the key <i>query</i>. -->
通信的工作原理是向 http://localhost:4000/graphql 发送 HTTP POST 请求。 查询本身是一个字符串，作为 键<i>query</i> 的值发送。

<!-- We could take care of the communication between the React-app and GraphQl by using Axios. However most of the time it is not very sensible to do so. It is a better idea to use a higher order library capable of abstracting the unnecessary details of the communication.  -->
我们可以使用 Axios 来处理 React-app 和 GraphQl 之间的通信。 然而，在大多数情况下，这样做是不明智的。 最好使用能够抽象出通信中不必要的细节的高阶库。

<!-- At the moment there are two good options: [Relay](https://facebook.github.io/relay/) by Facebook and [Apollo Client](https://www.apollographql.com/docs/react/). , which is the client side of the same library we used in the previous section. Apollo is absolutely the most popular of the two, and we will use it in this section as well.  -->
目前有两个不错的选择: Facebook 的 [Relay](https://facebook.github.io/relay/) 和 [Apollo Client](https://www.apollographql.com/docs/react/)。 后者是我们之前章节使用的客户端。Appolo 绝对是最流行的客户端，我们本章节也会接着使用它。

### Apollo client
【阿波罗客户端】


<!-- In this course we will use the version [3.0-beta](https://www.apollographql.com/docs/react/) of Apollo Client.  -->
<!-- 在本课程中，我们将使用 Apollo Client 的版本[3.0-beta](https://www.apollographql.com/docs/react/)。 -->
<!-- At the moment (20.2.2020) 2.6 is the latest officially released version, so when you are reading the documentation remember to select the documentation of 3.0 beta: -->
<!-- 目前(2020年2月20日) 2.6是官方发布的最新版本，所以当你阅读文档时记得选择3.0 beta 版的文档: -->

<!-- ![](../../images/8/40ea.png) -->

<!-- Create a new React-app and install the dependencies required by [Apollo client](https://www.apollographql.com/docs/react/get-started/). -->
创建一个新的 React-app 并安装 Apollo 客户端所需的依赖 [Apollo client](https://www.apollographql.com/docs/react/get-started/)。

<!-- We'll create a new React application and install the debendencies required by [Apollo client](https://www.apollographql.com/docs/react/get-started/#installation). -->
<!-- 我们将创建一个新的 React 应用，并按文档要求的那样安装[Apollo 客户端](https://www.apollographql.com/docs/React/get-started/#installation 应用)。 -->

```bash
npm install @apollo/client graphql
```

<!-- We'll start with the following code for our application.  -->
我们将从下面的应用代码开始。

```js
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import { ApolloClient, HttpLink, InMemoryCache, gql } from '@apollo/client'

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:4000',
  })
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

ReactDOM.render(<App />, document.getElementById('root'))
```

<!-- The beginning of the code creates a new [client](https://www.apollographql.com/docs/react/get-started/#create-a-client) - object, which is then used to send a query to the server:  -->
代码的开头创建一个新的[客户端](https://www.apollographql.com/docs/react/get-started/#create-a-client)-对象，然后用它向服务器发送一个查询:


```js
client.query({ query })
  .then((response) => {
    console.log(response.data)
  })
```

<!-- The servers response is printed to the console:  -->
服务器响应被打印到控制台:

![](../../images/8/9a.png)

<!-- The application can communicate with a GraphQL server using the _client_ object. The client can be made accessible for all components of the application by wrapping the <i>App</i> component with [ApolloProvider]https://www.apollographql.com/docs/react/get-started/#connect-your-client-to-react). -->
应用可以使用客户端对象与 GraphQL 服务器通信。 通过用[ApolloProvider](https://www.apollographql.com/docs/react/get-started/#connect-your-client-to-react) 包装<i>App</i> 组件，客户端可以被应用的所有组件访问。

```js
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import { 
  ApolloClient, ApolloProvider, HttpLink, InMemoryCache // highlight-line
} from '@apollo/client' 

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:4000',
  })
})

ReactDOM.render(
  <ApolloProvider client={client}> // highlight-line
    <App />
  </ApolloProvider>, // highlight-line
  document.getElementById('root')
)
```

### Making queries
【查询】

<!-- We are ready to implement the main view of the application, which shows a list of phone numbers.  -->
我们已经准备好实现应用的主视图，它显示了一个电话号码列表。




<!-- Apollo Client offers a few alternatives for making [queries](https://www.apollographql.com/docs/react/data/queries/).  -->
阿波罗客户端提供了一些替代方案来进行[查询](https://www.apollographql.com/docs/react/data/queries/)。
<!-- Currently the use of the hook-function [useQuery](https://www.apollographql.com/docs/react/api/react/hooks/#usequery) is the dominant practice. -->
目前，Hook函数[useQuery](https://www.apollographql.com/docs/react/api/react/hooks/#useQuery)的使用是主要的实践。


<!-- The query is made by the <i>App</i> component, which's code is as follows: -->
该查询由<i>App</i> 组件执行，其代码如下:

```js
import React from 'react'
import { gql, useQuery } from '@apollo/client';

const ALL_PERSONS = gql`
query {
  allPersons  {
    name
    phone
    id
  }
}
`

const App = () => {
  const result = useQuery(ALL_PERSONS)

  if (result.loading)  {
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





<!-- When called, _useQuery_ makes the query it receives as a parameter. -->
调用时，useQuery 将查询作为参数接收。
<!-- It returns an object with multiple [fields](https://www.apollographql.com/docs/react/api/react/hooks/#result). -->
它返回一个具有多个[字段](https://www.apollographql.com/docs/react/api/react/hooks/#result)的对象。
<!-- The field <i>loading</i> is true if the query has not received a response yet.  -->
如果查询尚未收到响应，则字段<i>loading</i> 为 true。
<!-- Then the following code gets rendered: -->
然后渲染下面的代码:

```js
if ( result.loading ) {
  return <div>loading...</div>
}
```



<!-- When response is received, the result of the <i>allPersons</i> query can be found from the <i>data</i> field, and we can render the list of names to the screen. -->
当收到响应时，可以在<i>data</i> 字段中找到<i>allPersons</i> 查询的结果，并将名称列表渲染到屏幕上。

```js
<div>
  {result.data.allPersons.map(p => p.name).join(', ')}
</div>
```



<!-- Let's separate displaying the list of persons into its own component -->
让我们将人员列表分离显示到它自己的组件中

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



<!-- The _App_ component still makes the query, and passes the result to the new component to be rendered: -->
组件仍然进行查询，并将结果传递给要渲染的新组件:

```js
const App = () => {
  const result = useQuery(ALL_PERSONS)

  if (result.loading)  {
    return <div>loading...</div>
  }

  return (
    <Persons persons = {result.data.allPersons}/>
  )
}
```

### Named queries and variables
【命名查询和变量】

<!-- Let's implement functionality for viewing the address details of a person. The <i>findPerson</i> query is well suited for this.  -->
让我们实现查看个人地址详细信息的功能。

<!-- The queries we did in the last chapter had the parameter hardcoded into the query: -->
我们在上一章中的查询将参数硬编码到查询中:

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

<!-- When we do queries programmatically, we must be able to give them parameters dynamically.  -->
当我们以编程方式进行查询时，我们必须能够动态地给它们提供参数。

<!-- GraphQL [variables](https://graphql.org/learn/queries/#variables) are well suited for this. To be able to use variables, we must also name our queries.  -->
Graphql [variables](https://GraphQL.org/learn/queries/#variables)非常适合这一点，为了能够使用变量，我们还必须命名我们的查询。 



<!-- A good format for the query is this: -->
查询的一个好格式是:

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

<!-- The name of the query is <i>findPersonByName</i>, and it is given a string <i>$nameToSearch</i> as a parameter.  -->
查询的名称是<i>findPersonByName</i>，它被赋给一个字符串<i>$nameToSearch</i> 作为参数。

<!-- It is also possible to do queries with parameters with the GraphQL Playground. The parameters are given in <i>Query variables</i>: -->
也可以使用 GraphQL Playground 参数进行查询。参数在<i>Query variables</i> 中给出:

![](../../images/8/10.png)

<!-- The _useQuery_ hook is well suited for situations where the query is done when the component is rendered.  -->
_useQuery_ hook 非常适合在渲染组件时进行查询的情况。 

<!-- However now we want to make the query only when a user wants to see the details of a specific person, so the query is done only [as required](https://www.apollographql.com/docs/react/data/queries/#executing-queries-manually). -->
然而，现在我们只希望在用户想要查看特定人员的详细信息时才进行查询，因此查询只能[根据需要](https://www.apollographql.com/docs/react/data/queries/#executing-queries-manually)完成。



<!-- For this this situation the hook-function [useLazyQuery](https://www.apollographql.com/docs/react/api/react/hooks/#uselazyquery) is a good choice.  -->
在这种情况下，Hook函数[useLazyQuery](https://www.apollographql.com/docs/react/api/react/hooks/#useLazyQuery)是一个不错的选择。
<!-- The <i>Persons</i> component becomes: -->
<i>Persons</i> 组件变为:

```js
// highlight-start
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
// highlight-end

const Persons = ({ persons }) => {
  // highlight-start
  const [getPerson, result] = useLazyQuery(FIND_PERSON) 
  const [person, setPerson] = useState(null)
// highlight-end

// highlight-start
  const showPerson = (name) => {
    getPerson({ variables: { nameToSearch: name } })
  }
  // highlight-end

// highlight-start
  useEffect(() => {
    if (result.data) {
      setPerson(result.data.findPerson)
    }
  }, [result.data])
  // highlight-end

// highlight-start
  if (person) {
    return(
      <div>
        <h2>{person.name}</h2>
        <div>{person.address.street} {person.address.city}</div>
        <div>{person.phone}</div>
        <button onClick={() => setPerson(null)}>close</button>
      </div>
    )
  }
  // highlight-end
  
  return (
    <div>
      <h2>Persons</h2>
      {persons.map(p =>
        <div key={p.name}>
          {p.name} {p.phone}
          // highlight-start
          <button onClick={() => showPerson(p.name)} >
            show address
          </button> 
          // highlight-end
        </div>  
      )}
    </div>
  )
}

export default Persons
```



<!-- The code has changed quite a lot, and all of the changes are not completely apparent.  -->
代码已经改变了很多，并且所有的改变都不是很明显。



<!-- When a person's "show address" button is clicked, its event handler  -->
单击用户的“ show address”按钮时，将单击其事件处理程序
<!-- _showPerson_ is executed, and makes a GraphQL query to fetch the persons details:  -->
执行 showPerson，并使用 GraphQL 查询获取 person 的详细信息:

```js
const [getPerson, result] = useLazyQuery(FIND_PERSON) 

// ...

const showPerson = (name) => {
  getPerson({ variables: { nameToSearch: name } })
}
```



<!-- The query's _nameToSearch_ variable receives a value when the qury is run.  -->
查询的 _nameToSearch_ 变量在查询时接收一个值。



<!-- The query response is saved to the variable _result_, and its value is saved to the component's state _person_ in the _useEffect_ hook.  -->
查询响应保存到变量 _result_ ，其值在 _useEffect_ Hook中保存到组件的状态 _person_。

```js
useEffect(() => {
  if (result.data) {
    setPerson(result.data.findPerson)
  }
}, [result])
```


<!-- The hook's second parameter is _result.data_, so the function given to the hook as its second parameter is executed <i>every time the query fetches the details of a different person</i>.  -->
Hook的第二个参数是 _result.data_ <i>每次查询获取不同人的详细信息时</i>，作为Hook的第二个参数给定的函数都会被执行。 
<!-- Without handling the update in a controlled way in a hook, returning from a single person view to an all persons view would cause problems.   -->
在hook 中如果不以受控的方式处理更新，无论是返回单人视图还是所有人的视图都会产生问题。

<!-- If the state _person_ has a value, instead of showing a list of all persons, only the details of one person are shown.  -->
如果状态 _person_ 有一个值，则不显示所有人员的列表，而只显示一个人的详细信息。

![](../../images/8/11.png)



<!-- If the _person_ state has a value, instead of displaying a list of all persons we render the details of the specified person:  -->
<!-- 如果 _person_ 的状态有一个值，我们不显示所有人的列表，而是渲染指定人的详细信息: -->


<!-- When a user wants to return to the persons list, the _person_ state is set to _null_. -->
当用户希望返回人员列表时，_person_ 状态设置为 null。

<!-- The solution is not the neatest possible, but it is good enough for us.  -->
这个解决方案并不是最好的，但是对我们来说已经足够好了。

<!-- The current code of the application can be found on [Github](https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-1) branch <i>part8-1</i>. -->
当前应用的代码可以在[Github](https://Github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-1)分支<i>part8-1</i> 上找到。

### Cache


<!-- When we do multiple queries for example the address details of Arto Hellas, we notice something interesting: The query to the backend is done only the first time around. After this, despite of the same query being done again by the code, the query is not sent to the backend.  -->
当我们执行多个查询时，例如 Arto Hellas 的地址细节，我们注意到一些有趣的事情: 对后端的查询只在第一次执行。 此后，尽管代码再次执行相同的查询，但查询不会发送到后端。

![](../../images/8/12.png)

<!-- Apollo client saves the responses of queries to [cache](https://www.apollographql.com/docs/react/caching/cache-configuration/). To optimize performance if the response to a query is already in the cache, the query is not sent to the server at all.  -->
Apollo 客户端将查询的响应保存到[缓存](https://www.apollographql.com/docs/react/caching/cache-configuration/)。 为了优化性能，若要在查询的响应已经在缓存中，则根本不将查询发送到服务器。 

<!-- It is possible to install [Apollo Client devtools](https://chrome.google.com/webstore/detail/apollo-client-developer-t/jdkknkkbebbapilgoeccciglkfbmbnfm/related) to Chrome to view the state of the cache.  -->
你可以在 Chrome 中安装[Apollo Client devtools](https://chrome.google.com/webstore/detail/apollo-client-developer-t/jdkknkkbebbapilgoeccciglkfbmbnfm/related) 来查看缓存的状态。

![](../../images/8/13a.png)



<!-- Data in the cache is organized by query. Because <i>Person</i> objects have an identifying field <i>id</i> which is type <i>ID</i>, if the same object is returned by multiple queries, Apollo is able to combine them into one.  -->
缓存中的数据按查询进行组织。 因为<i>Person</i> 对象有一个类型为<i>ID</i> 的标识字段<i>ID</i>，如果多个查询返回同一个对象，Apollo 可以将它们组合成一个。

<!-- Because of this, doing <i>findPerson</i> queries for the address details of Arto Hellas has updated the address details also for the query <i>allPersons</i>. -->
因此，执行<i>findPerson</i> 查询 Arto Hellas 的地址详细信息时，也更新了查询<i>allPersons</i> 的地址详细信息。

### Doing mutations
<!-- Let's implement functionality for adding new persons.  -->
让我们实现添加新人的功能。

 <!--In the previous chapter we hardcoded the parameters for mutations. Now we need a version of the addPerson mutation which uses [variables](https://graphql.org/learn/queries/#variables):-->
在前一章中，我们硬编码了Mutation的参数。 现在我们需要一个 addPerson Mutation的版本，它使用[variables](https://graphql.org/learn/queries/#variables 变量) :

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



<!-- The hook-function [useMutation](https://www.apollographql.com/docs/react/api/react/hooks/#usemutation) provides the functionality for making mutations.  -->
Hook函数[useMutation](https://www.apollographql.com/docs/react/api/react/hooks/#useMutation)提供了进行Mutation的功能。 



<!-- Let's create a new component for adding a new person to the directory: -->
让我们创建一个新的组件来添加一个新用户到目录中:

```js
import React, { useState } from 'react'
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



<!-- The code of the form is straightforward and the interesting lines have been highlighted.  -->
表单的代码非常简单，并突出显示了有趣的行。
<!-- We can define mutation function using the _useMutation_-hook. -->
我们可以使用 useMutation-hook 来定义Mutation函数。
<!-- The hook returns an <i>array</i>, first element of which contains the function to cause the mutation. -->
Hook返回一个<i>数组</i>，其中第一个元素包含产生mutation的函数。 

```js
const [ createPerson ] = useMutation(CREATE_PERSON)
```

<!-- The query variables receive values when the query is made: -->
查询变量在进行查询时接收值:

```js
createPerson({  variables: { name, phone, street, city } })
```

<!-- New persons are added just fine, but the screen is not updated. The reason being that Apollo Client cannot automatically update the cache of an application, so it still contains the state from before the mutation.  -->
新的人员添加正常，但屏幕没有更新。 原因是 Apollo Client 不能自动更新应用的缓存，因此它仍然包含变更前的状态。
<!-- We could update the screen by reloading the page, as the cache is emptied when the page is reloaded. However there must be a better way to do this.  -->
我们可以通过重新加载页面来更新屏幕，因为页面重新加载时缓存空了。 然而，必须有一个更好的方法来做到这一点。


### Updating the cache
【更新缓存】
<!-- There are few different solutions for this. One way is to make the query for all persons [poll]((https://www.apollographql.com/docs/react/data/queries/#polling) the server, or make the query repeatedly.  -->
对此几乎没有不同的解决方案。 一种方法是对所有人进行查询 [poll](https://www.apollographql.com/docs/react/data/queries/#polling)到服务器，或者重复进行查询。


<!-- The change is small. Let's set the query to poll every two seconds:  -->
这个变化很小，让我们设置查询为每两秒轮询一次:

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

<!-- The solution is simple, and every time a user adds a new person, it appears immediately on the screens of all users.  -->
解决方案很简单，每当用户添加一个新用户时，它会立即出现在所有用户的屏幕上。

<!-- The bad side of the solution is all the pointless web traffic.  -->
这个解决方案的缺点是所有的网络流量都是毫无意义的。



<!-- Another easy way to keep the cache in sync is to use the _useMutation_-hook's [refetchQueries](https://www.apollographql.com/docs/react/api/react/hooks/#params-2) parameter to define, that the query fetching all persons is done again whenever a new person is created.  -->
另一种保持缓存同步的简单方法是使用 useMutation-hook 的[refetchQueries](https://www.apollographql.com/docs/react/api/react/hooks/#params-2)参数来定义，即每当创建一个新的人员时，就会再次执行获取所有人员的查询。

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

<!-- The pros and cons of this solution are almost opposite of the previous one. There is no extra web traffic, because queries are not done just in case.  However if one user now updates the state of the server, the changes do not show to other users immediately.  -->
这个解决方案的优点和缺点几乎与前一个相反。 没有额外的网络流量，因为查询不是为了以防万一而进行的。 但是，如果一个用户现在更新服务器的状态，这些更改不会立即显示给其他用户。

<!-- There are other ways to update the cache. More about those later in this part.  -->
还有其他更新缓存的方法。本章节稍后将详细介绍。



<!-- At the moment in our code queries and component are defined in the same place.  -->
目前，在我们的代码查询和组件定义在同一个地方。
<!-- Let's separate the query definitions into their own file <i>queries.js</i>: -->
让我们将查询定义分离到它们自己的文件<i>queries.js</i> 中:

```js 
import { gql  } from '@apollo/client'

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



<!-- Each component then imports the queries it needs: -->
然后每个组件导入它需要的查询:

```js 
import { ALL_PERSONS } from './queries'

const App = () => {
  const result = useQuery(ALL_PERSONS)
  // ...
}
```

<!-- The current code of the application can be found on [Github](https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-2) branch <i>part8-2</i>. -->
当前应用的代码可以在[Github](https://Github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-2)分支<i>part8-2</i> 上找到。

#### Handling mutation errors
【处理Mutation错误】
<!-- Trying to create a person with invalid data causes an error, and the whole application breaks -->
尝试用无效数据创建人员会导致错误，整个应用将中断

![](../../images/8/14ea.png)



<!-- We should handle the exception. We can register an error handler function to the mutation using _useMutation_-hook's _onError_ [option](https://www.apollographql.com/docs/react/api/react/hooks/#params-2). -->
我们应该处理这个异常，我们可以使用 useMutation-hook 的 onError [option](https://www.apollographql.com/docs/react/api/react/hooks/#params-2)将一个错误处理函数注册到Mutation中。

<!-- Let's register the mutation an error handler, which uses the _setError_ -->
<!-- function it receives as a parameter to set an error message: -->
让我们为Mutation注册一个错误处理程序，它使用 setError 函数接收一个参数来设置一个错误消息:

```js
const PersonForm = ({ setError }) => {
  // ... 

  const [ createPerson ] = useMutation(CREATE_PERSON, {
    refetchQueries: [  {query: ALL_PERSONS } ],
    // highlight-start
    onError: (error) => {
      setError(error.graphQLErrors[0].message)
    }
    // highlight-end
  })

  // ...
}
```



<!-- We can then render the error message on the screen as necessary -->
然后，我们可以根据需要在屏幕上渲染错误消息

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
      <Notify errorMessage={errorMessage} />
      <Persons persons = {result.data.allPersons} />
      <PersonForm setError={notify} />
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
<!--Now the user is informed about an error with a simple notification. -->
现在，用户通过一个简单的通知获知一个错误。

![](../../images/8/15.png)

<!-- The current code of the application can be found on [Github](https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-3) branch <i>part8-3</i>. -->
当前应用的代码可以在[Github](https://Github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-3)分支<i>part8-3</i> 上找到。

### Updating a phone number
【更新电话号码】

<!-- Let's add the possibility to change the phone numbers of persons to our application. The solutions is almost identical to the one we used for adding new persons.  -->
让我们在应用中增加更改人员电话号码的可能性。 这些解决方案与我们用来增加新人员的方案几乎完全相同。

<!-- Again, the mutation requires parameters. -->
同样，Mutation需要参数。

```js
export const EDIT_NUMBER = gql`
  mutation editNumber($name: String!, $phone: String!) {
    editNumber(name: $name, phone: $phone)  {
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



<!-- The <i>PhoneForm</i> component responsible for the change is straightforward. The form has fields for the person's name and new phone number, and calls the _changeNumber_ function. The function is done using the _useMutation_-hook.  -->
负责更改的<i>PhoneForm</i> 组件非常简单。 该表单具有用于个人姓名和新电话号码的字段，并调用“更改编号”函数。 该函数是使用 useMutation-hook 完成的。

<!-- Interesting lines on the code have been hihglighed. -->
有趣的代码行被高亮了。

```js
import React, { useState } from 'react'
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

<!-- It looks bleak, but it works:  -->
这看起来有些荒凉，但确实有效:

![](../../images/8/22a.png)




<!-- Surprisingly, when person's number is changed the new number automatically appears on the list of persons rendered by the <i>Persons</i> component.  -->
令人惊讶的是，当人数改变时，新的数字会自动出现在由<i>Persons</i> 组件渲染的人员列表中。
<!-- This happens because each person has an identifying field of type <i>ID</i>, so the person's details saved to the cache update automatically when they are changed with the mutation.  -->
这是因为每个人都有一个<i>ID</i> 类型的标识字段，所以当这个人的详细信息随着Mutation而更改时，会自动保存到缓存更新中。

<!-- The current code of the application can be found on [Github](https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-4) branch <i>part8-4</i> -->
当前应用的代码可以在[Github](https://Github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-4)分支<i>part8-4</i> 上找到



<!-- Our application still has one small flaw. If we try to change the phonenumber for a name which does not exist, nothing seems to happen.  -->
我们的应用还有一个小缺陷。 如果我们试图改变一个不存在的名字的phone number，似乎什么也不会发生。
<!-- This happens because if a person with the given name cannot be found,  -->
这是因为如果一个人的名字找不到,
<!-- the mutation response is <i>null</i>: -->
MutationReact为<i>null</i>:

![](../../images/8/23ea.png)



<!-- For GraphQL this is not an error, so registering an _onError_ error handler is not useful.  -->
对于 GraphQL，这不是一个错误，因此注册 onError 错误处理程序是没有用的。



<!-- We can use the _result_ field returned by the _useMutation_-hook as its second parameter to generate an error message.  -->
我们可以使用 useMutation-hook 返回的 result 字段作为其第二个参数来生成错误消息。

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

  }, [result])
  // highlight-end

  // ...
}
```



<!-- If a person cannot be found, or the _result.data.editNumber_ is _null_, the component uses the callback-function it received as props to set a suitable error message.  -->
如果找不到某个人，或 result.data.editNumber 为空，则组件使用它作为props接收的回调函数来设置合适的错误消息。
<!-- We want to set the error message only when the result of the mutation  -->
我们只希望在Mutation的结果出现时设置错误消息
<!-- _result.data_ changes, so we use the useEffect-hook to control setting the error message.  -->
因此，我们使用 useEffect-hook 来控制错误消息的设置。



<!-- Using useEffect causes an ESLint warning: -->
使用 useEffect 会导致一个 ESLint 警告:

![](../../images/8/41ea.png)



<!-- The warning is pointless, and the easiest solution is to ignore the ESLint rule on the line: -->
这个警告毫无意义，最简单的解决方案就是忽略 ESLint 规则:

```js
useEffect(() => {
  if (result.data && !result.data.editNumber) {
    setError('name not found')
  }
// highlight-start  
}, [result.data])  // eslint-disable-line 
// highlight-end
```


<!-- We could try to get rid of the warning by adding the _notify_ function to useEffect's second parameter array: -->
我们可以通过在 useEffect 的第二个参数数组中添加 _setError_ 函数来消除这个警告:

```js
useEffect(() => {
  if (result.data && !result.data.editNumber) {
    setError('name not found')
  }
// highlight-start  
}, [result.data, setError])
// highlight-end
```



<!-- However this solution does not work is the _notify_-function is not wrapped to a [useCallback](https://reactjs.org/docs/hooks-reference.html#usecallback)-function.  If it's not, this results to an endless loop. When the _App_ component is rerendered after a notification is removed, a <i>new version</i> of _notify_ gets created which causes the effect function to be executed which causes a new notification and so on an so on... -->
但是这个解决方案不起作用，因为 _notify_-function 没有封装到[useCallback](https://reactjs.org/docs/hooks-reference.html#useCallback)-function 中。 如果不是，这将导致一个无限循环。 当 _App_ 组件在通知被删除后重新渲染，会创建一个<i>new version</i> 的 _notify_ ，这会导致 effect 函数被执行，从而导致一个新的通知等等等等

<!-- The current code of the application can be found on [Github](https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-5) branch <i>part8-5</i> -->
当前应用的代码可以在[Github](https://Github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-5)分支<i>part8-5</i> 上找到

### Apollo Client and the applications state

<!-- In our example, management of the applications state has mostly become the responsibility of Apollo Client. This is quite typical solution for GraphQL applications.  -->
在我们的示例中，应用状态的管理主要由 Apollo Client 负责。 这是适用于 graphql 应用的典型解决方案。

<!-- Our example uses the state of the React components only to manage the state of a form and to show error notifications. As a result, it could be that there are no justifiable reasons to use Redux to manage application state when using GraphQL. -->
我们的示例只使用 React 组件中的 state 来管理表单的状态，来显示错误通知。 也就是当使用GraphQL时没有合适的理由来使用Redux 来管理应用状态。

<!-- When necessary Apollo enables saving the applications local state to [Apollo cache](https://www.apollographql.com/docs/react/data/local-state/). -->
必要时，Apollo 允许将应用保存到本地状态[Apollo cache](https://www.apollographql.com/docs/react/local-state/local-state-management/)。


<div class="tasks">


### Exercises 8.8.-8.12.


<!-- Through these exercises we'll implement a frontend for the GraphQL-library.  -->
通过这些练习，我们将实现 graphql 库的前端。

<!-- Take [this project](https://github.com/fullstack-hy2020/library-frontend) for a start of your application.  -->
以[这个项目](https://github.com/fullstack-hy2020/library-frontend)作为你应用的开始。

<!-- You can implement your application either using the render prop -components <i>Query</i> and <i>Mutation</i> of the Apollo Client, or using the hooks provided by Apollo client 3.0.  -->
您可以使用 Apollo Client 的 render prop-components<i>Query</i> 和<i>Mutation</i> 来实现应用，或者使用 Apollo Client 3.0  版本提供的Hook。

#### 8.8: Authors view
<!-- Implement an Authors view to show the details of all authors on a page as follows:  -->
实现作者视图，在一个页面上显示所有作者的详细信息，如下所示:

![](../../images/8/16.png)


#### 8.9: Books view
<!-- Implement a Books view to show on a page all other details of all books except their genres.  -->
实现一个 Books 视图，在一个页面上显示除了类型之外的所有书籍的所有其他细节。

![](../../images/8/17.png)


#### 8.10: Adding a book
<!-- Implement a possibility to add new books to your application. The functionality can look like this:  -->
实现在你的应用中添加新书的可能性，这个功能可以是这样的:

![](../../images/8/18.png)

<!-- Make sure that the Authors and Books views are kept up to date after a new book is added.  -->
确保在添加新书之后，随时更新 Authors 和 Books 视图。

<!-- In case of problems when making queries or mutations, checkfrom  developer console what the server response is: -->
如果在进行查询或Mutation时出现问题，从开发者控制台检查服务器响应是什么:

![](../../images/8/42ea.png)


#### 8.11: Authors birth year

<!-- Implement a possibility to set authors birth year. You can create a new view for setting the birth year, or place it on the Authors view:  -->
实现对作者出生年份设置。 您可以创建一个新视图来设置出生年份，或者将其放在 Authors 视图中:

![](../../images/8/20.png)



<!-- Make sure that the Authors view is kept up to date after setting a birth year.  -->
确保“作者”视图在设定出生年份后是最新的。

#### 8.12: Authors birth year advanced
<!-- Change the birth year form so that a birth year can be set only for an existing author. Use [select-tag](https://reactjs.org/docs/forms.html#the-select-tag), [react-select](https://github.com/JedWatson/react-select) library or some other mechanism.  -->
更改出生年份形式，以便只能为现有作者设置出生年份。 使用[select-tag](https://reactjs.org/docs/forms.html#the-select-tag) ，[react-select](https://github.com/jedwatson/react-select)库或其他机制。

<!-- A solution using the react-select -library looks as follows:  -->
使用 react-select-library 的解决方案如下:

![](../../images/8/21.png)


</div>
