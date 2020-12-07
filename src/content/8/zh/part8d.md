---
mainImage: ../../../images/part-8.svg
part: 8
letter: d
lang: zh
---

<div class="content">


<!-- The frontend of our application shows the phone directory just fine with the updated server. However if we want to add new persons, we have to add login functionality to the frontend.  -->
应用的前端显示的电话目录与更新后的服务器一致。 然而，如果我们想添加新的人员，我们必须添加前端的登录功能。

### User log in
【用户登录】


<!-- Let's add variable _token_ to the application's state. It will contain user's token when a is logged in. If _token_ is undefined, we render the <i>LoginForm</i>-component responsible for user login. The component receives an error handler and the _setToken_-function as parameters: -->
让我们将变量 token 添加到应用的状态。 当用户登录时，它将包含用户token。 如果_token_未定义，我们将使<i>LoginForm</i>-component 负责用户登录。 组件接收一个错误处理程序和 setToken-function 作为参数:

```js
const App = () => {
  const [token, setToken] = useState(null) // highlight-line

  // ...

  if (!token) {
    return (
      <div>
        <Notify errorMessage={errorMessage} />
        <h2>Login</h2>
        <LoginForm
          setToken={setToken}
          setError={notify}
        />
      </div>
    )
  }

  return (
    // ...
  )
}
```



<!-- Next we define a mutation for logging in -->
接下来我们为登录定义一个Mutation

```js
export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`
```



<!-- The _LoginForm_-component works pretty much just like all other components doing mutations we have previously created.  -->
Loginform 组件的工作原理与我们之前创建的所有其他进行Mutation的组件非常相似。 

<!-- Interesting lines in the code have been highlighted: -->
代码中有趣的行被高亮显示:

```js
import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'

const LoginForm = ({ setError, setToken }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [ login, result ] = useMutation(LOGIN, { // highlight-line
    onError: (error) => {
      setError(error.graphQLErrors[0].message)
    }
  })

// highlight-start
  useEffect(() => {
    if ( result.data ) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('phonenumbers-user-token', token)
    }
  }, [result.data]) // eslint-disable-line
// highlight-end

  const submit = async (event) => {
    event.preventDefault()

    login({ variables: { username, password } })
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password <input
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default LoginForm
```



<!-- We are using an effect hook again. Here it's used to save the token's value to the state of the _App_ component the local storage after the server has responded to the mutation.  -->
我们再次使用effect hook 。 在这里，它用于在服务器响应Mutation之后，将令牌的值保存到本地存储的 _App_ 组件的状态。
<!-- Use of the effect hook is necessary to avoind an endless rendering loop. -->
使用 effect hook 是必要的，以避免无休止的渲染循环。

<!-- Let's also add a button which enables logged in user to log out. The buttons onClick handler sets the _token_ state to null, removes the token from local storage and resets the cache of the Apollo client. The last is [important](https://www.apollographql.com/docs/react/networking/authentication/#reset-store-on-logout), because some queries might have fetched data to cache, which only logged in users should have access to.  -->
我们还要添加一个按钮，使登录用户能够注销。 onClick 处理程序的按钮将令牌状态设置为 null，从本地存储中删除令牌并重置 Apollo 客户端的缓存。 最后一个是[重要的](https://www.apollographql.com/docs/react/networking/authentication/#reset-store-on-logout) ，因为有些查询可能已经将数据提取到缓存，只有登录的用户才能访问。





<!-- We can reset the cache using the [resetStore](https://www.apollographql.com/docs/react/v3.0-beta/api/core/ApolloClient/#ApolloClient.resetStore) method of an Apollo _client_ object.  -->
我们可以使用 Apollo 客户端对象的[resetStore](https://www.apollographql.com/docs/react/v3.0-beta/api/core/apolloclient/#apolloclient.resetStore)方法重置缓存。
<!-- The client can be accessed with the [useApolloClient](https://www.apollographql.com/docs/react/api/react-hooks/#useapolloclient) hook: -->
客户端可以通过[useApolloClient](https://www.apollographql.com/docs/react/api/react-hooks/#useApolloClient)Hook访问:

```js
const App = () => {
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const result = useQuery(ALL_PERSONS)
  const client = useApolloClient() // highlight-line

  if (result.loading)  {
    return <div>loading...</div>
  }

  // highlight-start
  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }
  // highlight-end

}
```

<!-- The current code of the application can be found on [Github](https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-6), branch <i>part8-6</i>. -->
当前应用的代码可以在[Github](https://Github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-6) ，branch<i>part8-6</i> 上找到。

### Adding a token to a header
【在头部添加一个token】
<!-- After the backend changes, creating new persons requires that a valid user token is sent with the request. In order to send the token, we have to change the way we define the _ApolloClient_-object in <i>index.js</i> a little.  -->
在后端更改之后，创建新的人员需要随请求一起发送一个有效的用户令牌。 为了发送令牌，我们必须稍微改变在<i>index.js</i> 中定义 ApolloClient-object 的方式。

```js
import { setContext } from 'apollo-link-context' // highlight-line

// highlight-start
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('phonenumbers-user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}` : null,
    }
  }
})
// highlight-end

const httpLink = new HttpLink({ uri: 'http://localhost:4000' }) // highlight-line

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink) // highlight-line
})
```


<!-- The link parameter given to the _client_-object defines how apollo connects to the server. Here the normal [httpLink](https://www.apollographql.com/docs/link/links/http.htm) connection is modified so that the request's <i>authorization</i> [header](https://www.apollographql.com/docs/react/networking/authentication/#header) contains the token if one has been saved to the localStorage.  -->
给定客户端对象的 link 参数定义了 apollo 如何连接到服务器。 在这里，正常的[httpLink](https://www.apollographql.com/docs/link/links/http.htm)连接被修改，以便请求的<i>authorization</i> [header](https://www.apollographql.com/docs/react/networking/authentication/#header)包含令牌(如果已经保存到 localStorage 的话)。



<!-- We also need to install the library required by this modification -->
我们还需要安装修改所需的库

```bash
npm install apollo-link-context
```

<!-- Creating new persons and changing numbers works again. There is however one remaining problem. If we try to add a person without a phone number, it is not possible.  -->
创造新的人员和更改数字再次起作用。 然而，还有一个问题。 如果我们试图添加一个没有电话号码的人，这是不可能的。

![](../../images/8/25e.png)

<!-- Validation fails, because frontend sends an empty string as the value of _phone_. -->
验证失败，因为前端会发送一个空字符串作为 phone 的值。

<!-- Let's change the function creating new persons so that it sets _phone_ to null if user has not given a value.  -->
让我们更改创建新人的函数，以便在用户没有给出值的情况下将手机设置为 null。

```js
const PersonForm = ({ setError }) => {
  // ...
  const submit = async (event) => {
    event.preventDefault()
    createPerson({
      variables: { 
        name, street, city,  // highlight-line
        phone: phone.length > 0 ? phone : null  // highlight-line
      }
    })

  // ...
  }

  // ...
}
```

<!-- Current application code can be found on [Github](https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-7), branch <i>part8-7</i>. -->
当前的应用代码可以在[Github](https://Github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-7) ，branch<i>part8-7</i> 上找到。

### Updating cache, revisited
【更新缓存，复习】

<!-- We have to [update](/osa8/react_ja_graph_ql#valimuistin-paivitys) the cache of the Apollo client on creating new persons. We can update it using the mutation's _refetchQueries_ option to define that the  -->
我们必须[更新](/zh/part7/练习：扩展你的博客列表act_and_graph_ql#updating-the-cache) Apollo 客户端的缓存，以创建新的人员。 我们可以使用Mutation的 refetchQueries 选项更新它来定义。<em>ALL\_PERSONS</em> 查询再次执行了
<!-- <em>ALL\_PERSONS</em> query is done again.  -->

```js 
const PersonForm = ({ setError }) => {
  // ...

  const [ createPerson ] = useMutation(CREATE_PERSON, {
    refetchQueries: [  {query: ALL_PERSONS} ], // highlight-line
    onError: (error) => {
      setError(error.graphQLErrors[0].message)
    }
  })
```

<!-- This approach is pretty good, the drawback being that the query is always rerun with any updates.  -->
这种方法非常好，缺点是查询总是随着任何更新而重新运行。

<!-- It is possible to optimize the solution by handling updating the cache ourselves. This is done by defining a suitable [update](https://www.apollographql.com/docs/react/v3.0-beta/api/react/hooks/#options-)-callback for the mutation, which Apollo runs after the mutation: -->
通过处理自己更新缓存来优化解决方案是可行的。 这是通过为Mutation定义一个合适的[更新](https://www.apollographql.com/docs/react/v3.0-beta/api/react/hooks/#options-)-回调来完成的，Apollo 在Mutation之后运行:

```js 
const PersonForm = ({ setError }) => {
  // ...

  const [ createPerson ] = useMutation(CREATE_PERSON, {
    onError: (error) => {
      setError(error.graphQLErrors[0].message)
    },
    // highlight-start
    update: (store, response) => {
      const dataInStore = store.readQuery({ query: ALL_PERSONS })
      store.writeQuery({
        query: ALL_PERSONS,
        data:  {...dataInStore,
          allPersons: [ ...dataInStore.allPersons, response.data.addPerson ]
        }
      })
    }
    // highlight-end
  })
 
  // ..
}  
```

<!-- The callback function is given a reference to the cache and the data returned by the mutation as parameters. For example, in our case this would be the created person.  -->
回调函数被给予一个对缓存的引用，以及作为参数由Mutation返回的数据。 例如，在我们的例子中，这将是被创建的人。

<!-- The code reads the cached state of <em>ALL\_PERSONS</em> query using [readQuery](https://www.apollographql.com/docs/react/v3.0-beta/caching/cache-interaction/#readquery) function and updates the cache with [writeQuery]https://www.apollographql.com/docs/react/v3.0-beta/caching/cache-interaction/#writequery-and-writefragment) function adding the new person to the cached data.  -->
该代码使用[readQuery](https://www.apollographql.com/docs/react/v3.0-beta/caching/cache-interaction/#readQuery)函数读取<em>ALL\_PERSONS</em> 查询的缓存状态，并使用[writeQuery](https://www.apollographql.com/docs/react/v3.0-beta/caching/cache-interaction/#writeQuery-and-writefragment) 函数更新缓存，将新人添加到缓存数据中。

Note that readQuery will throw an error if your cache does not contain all of the data necessary to fulfill the specified query. This can be solved using a try-catch block.

注意如果你的缓存并没有包含所有的所需数据来满足特定的查询， readQuery 会抛出一个错误。可以通过try-catch代码块来解决这个问题。

<!-- There are actually some situations where the only good way to keep the cache up to date is using _update_ -callbacks.  -->
<!-- 实际上，在某些情况下，使缓存保持最新的唯一好方法是使用 update-callback。 -->

<!-- In some situations the only sensible way to keep the cache up to date is using the _update_-callback. -->
在某些情况下，使缓存保持最新的唯一合理方法是使用 update-callback。

<!-- When necessary it is possible to disable cache for the whole application or single queries by setting the field managing the use of cache, [fetchPolicy](https://www.apollographql.com/docs/react/api/react-apollo/#optionsfetchpolicy) as <em>no-cache</em>. -->
必要时，可以通过将管理 cache 使用的字段设置为 <em>no-cache</em> 来禁用整个应用或[单个查询](https://www.apollographql.com/docs/react/api/react/hooks/#options)的缓存，[fetchPolicy](https://www.apollographql.com/docs/react/data/queries/#configuring-fetch-logic)。

<!-- Be diligent with the cache. Old data in cache can cause hard to find bugs. As we know, keeping the cache up to date is very challenging. According to a coder proverb: -->
勤于使用缓存。 缓存中的旧数据可能导致难以发现 bug。 众所周知，保持缓存最新是非常具有挑战性的。 根据一个程序员谚语:

> <i>There are only two hard things in Computer Science: cache invalidation and naming things.</i> Read more [here](https://www.google.com/search?q=two+hard+things+in+Computer+Science&oq=two+hard+things+in+Computer+Science).<br>
在计算机科学中只有两个难题: 缓存失效和命名。Read more [here](https://www.google.com/search?q=two+hard+things+in+Computer+Science&oq=two+hard+things+in+Computer+Science)。

<!-- The current code of the application can be found on [Github](https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-8), branch <i>part8-8</i>. -->
当前应用的代码可以在[Github](https://Github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-8) ，branch<i>part8-8</i> 上找到。

</div>


<div class="tasks">


### Exercises 8.17.-8.22.
#### 8.17 Listing books

<!-- After the backend changes the list of books does not work anymore. Fix it.  -->
后端更改后，图书列表不再工作。修复它。

#### 8.18 Log in
<!-- Adding new books and changing the birth year of an author do not work because they require user to be logged in.  -->
添加新书和更改作者的出生年份都不起作用，因为它们要求用户登录。

<!-- Implement login functionality and fix the mutations.  -->
实现登录功能并修复Mutation。

<!-- It is not necessary yet to handle validation errors.  -->
还没有必要处理验证错误。

<!-- You can decide how the log in looks on the user interface. One possible solution is to make the login form into a separate view which can be accessed through a navigation menu:  -->
您可以决定登录在用户界面上的外观。 一个可能的解决方案是使登录表单成为一个单独的视图，可以通过导航菜单访问:

![](../../images/8/26.png)



<!-- The login form: -->
登入表单:

![](../../images/8/27.png)



<!-- When a user is logged in, the navigation changes to show the functionalities which can only be done by a logged in user: -->
当一个用户登录后，导航就会改变，以显示只有登录用户才能完成的功能:

![](../../images/8/28.png)


#### 8.19 Books by genre, 步骤 1

<!-- Complete your application to filter the book list by genre. Your solution might look something like this: -->
完成你的应用，按类型过滤书籍列表。你的解决方案可能是这样的:

![](../../images/8/30.png)

<!-- In this exercise the filtering can be done using just React. -->
在这个练习中，过滤可以只使用 React 来完成。

#### 8.20 Books by genre, 步骤 2
<!-- Implement a view which shows all the books based on the logged in user's favourite genre. -->
实现一个视图，根据登录用户最喜欢的类型显示所有的书籍。

![](../../images/8/29.png)


#### 8.21 books by genre with GraphQL
<!-- In the previous exercise 8.20, the filtering could have been done using just React. To complete this exercise, you should filter the books in the recommendations page using a GraphQL query to the server. The query created in exercise 8.5 could be useful here.  -->
在之前的8.20 练习中，过滤可以仅用 React 来完成。 为了完成这个练习，你应该使用推荐的GraphQL查询，练习8.5中的服务器的GraphQL查询过滤书籍会有所帮助。

<!-- This and the next exercises are quite **challenging** like it should be this late in the course. You might want to complete first the easier ones in [next part](/zh/part8/fragments_and_subscriptions). -->
这个和接下来的练习是相当具有挑战性的。 您可能希望首先完成[下一章节](/zh/part8/fragments_与_subscriptions)中较容易的部分。

<!-- Some tips -->
一些建议

- <!--Instead of using <i>useQuery</i> it is propably better to do the queries with the <i>useLazyQuery</i>-hook-->
- 与使用<i>useQuery</i> 相比，使用<i>useLazyQuery</i>-hook 执行查询可能更好
- <!--It is sometimes useful to save the results of a GraphQL query to the state of a component.--> 
- 将 GraphQL 查询的结果保存到组件的状态有时很有用。
- <!--Note, that you can do GraphQL queries in a <i>useEffect</i>-hook.-->
- 注意，您可以在<i>/ useEffect</i>-hook 中执行 GraphQL 查询。
- <!--The [second parameter](https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect) of a <i>useEffect</i> - hook can become handy depending on your approach. -->
根据您的方法，<i>useEffect</i>  的[第二个参数](https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect)可以变得很方便。

#### 8.22 Up to date cache and book recommendations

<!-- If you fetch the book recommendations with GraphQL, ensure somehow that the books view is kept up to date. So when a new book is added, the books view is updated **at least** when a genre selection button is pressed.  -->
如果您使用 GraphQL 获取图书推荐，请以某种方式确保 books 视图是最新的。 因此，当添加一本新书时，至少当按下类型选择按钮时，图书视图会更新。

<!--<i>When new genre selection is not done, the view does not have to be updated. </i>-->
当新的类型选择没有完成时，视图不需要更新

</div>

