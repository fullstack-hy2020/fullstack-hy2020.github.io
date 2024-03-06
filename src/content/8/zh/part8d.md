---
mainImage: ../../../images/part-8.svg
part: 8
letter: d
lang: zh
---

<div class="content">

<!-- The frontend of our application shows the phone directory just fine with the updated server. However, if we want to add new persons, we have to add login functionality to the frontend.-->
 我们的应用的前端在更新了服务器后显示电话目录很好。然而，如果我们想添加新的人员，我们必须在前端添加登录功能。

### User login

<!-- Let's add the variable _token_ to the application's state. When a user is logged in, it will contain a user token. If _token_ is undefined, we render the <i>LoginForm</i> component responsible for user login. The component receives an error handler and the _setToken_ function as parameters:-->
 让我们在应用的状态中加入变量_token_。当一个用户被登录时，它将包含一个用户令牌。如果_token_是未定义的，我们将渲染负责用户登录的<i>LoginForm</i>组件。该组件接收一个错误处理程序和_setToken_函数作为参数。

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

<!-- Next, we define a mutation for logging in:-->
 接下来，我们定义一个用于登录的变体。

```js
export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`
```

<!-- The _LoginForm_ component works pretty much just like all the other components doing mutations that we have previously created.-->
 _LoginForm_组件的工作原理与我们之前创建的所有其他做改变的组件差不多。
<!-- Interesting lines in the code have been highlighted:-->
 代码中有趣的几行已被突出显示。

```js
import { useState, useEffect } from 'react'
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

<!-- We are using an effect hook to save the token's value to the state of the _App_ component and the local storage after the server has responded to the mutation.-->
 我们使用一个效果钩子来保存令牌的值到_App_组件的状态和服务器响应改变后的本地存储。
<!-- Use of the effect hook is necessary to avoid an endless rendering loop.-->
 为了避免无休止的渲染循环，使用效果钩子是必要的。

<!-- Let's also add a button which enables a logged-in user to log out. The button's onClick handler sets the _token_ state to null, removes the token from local storage and resets the cache of the Apollo client. The last step is [important](https://www.apollographql.com/docs/react/networking/authentication/#reset-store-on-logout), because some queries might have fetched data to cache, which only logged-in users should have access to.-->
 让我们也添加一个按钮，使登录的用户可以注销。这个按钮的onClick处理程序将_token_状态设置为null，从本地存储中删除token并重置Apollo客户端的缓存。最后一步是[重要的](https://www.apollographql.com/docs/react/networking/authentication/#reset-store-on-logout)，因为有些查询可能已经获取了数据到缓存中，而这些数据只有登录的用户才有机会访问。

<!-- We can reset the cache using the [resetStore](https://www.apollographql.com/docs/react/api/core/ApolloClient/#ApolloClient.resetStore) method of an Apollo _client_ object.-->
 我们可以使用Apollo _client_对象的[resetStore](https://www.apollographql.com/docs/react/api/core/ApolloClient/#ApolloClient.resetStore)方法重置缓存。
<!-- The client can be accessed with the [useApolloClient](https://www.apollographql.com/docs/react/api/react-hooks/#useapolloclient) hook:-->
客户端可以通过[useApolloClient](https://www.apollographql.com/docs/react/api/react-hooks/#useapolloclient)钩子访问。

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

  // highlight-start
  if (!token) {
    return (
      <>
        <Notify errorMessage={errorMessage} />
        <LoginForm setToken={setToken} setError={notify} />
      </>
    )
  }
  // highlight-end

  return (
    <>
      <Notify errorMessage={errorMessage} />
      <button onClick={logout}>logout</button> // highlight-line
      <Persons persons={result.data.allPersons} />
      <PersonForm setError={notify} />
      <PhoneForm setError={notify} />
    </>
  )
}
```

<!-- The current code of the application can be found on [Github](https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-6), branch <i>part8-6</i>.-->
 该应用的当前代码可以在[Github](https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-6)上找到，分支<i>part8-6</i>。

### Adding a token to a header

<!-- After the backend changes, creating new persons requires that a valid user token is sent with the request. In order to send the token, we have to change the way we define the _ApolloClient_ object in <i>index.js</i> a little.-->
 后端修改后，创建新的人需要在请求中发送一个有效的用户令牌。为了发送令牌，我们必须稍微改变一下<i>index.js</i>中定义_ApolloClient_对象的方式。

```js
import { setContext } from '@apollo/client/link/context' // highlight-line

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

<!-- The link parameter given to the _client_ object defines how apollo connects to the server. Here, the normal [httpLink](https://www.apollographql.com/docs/link/links/http.htm) connection is modified so that the request's <i>authorization</i> [header](https://www.apollographql.com/docs/react/networking/authentication/#header) contains the token if one has been saved to the localStorage.-->
 给予_client_对象的链接参数定义了apollo连接到服务器的方式。这里，正常的[httpLink](https://www.apollographql.com/docs/link/links/http.htm)连接被修改，以便请求的<i>授权</i>[头](https://www.apollographql.com/docs/react/networking/authentication/#header)包含令牌，如果有一个已经被保存到localStorage。

<!-- Creating new persons and changing numbers works again. There is however one remaining problem. If we try to add a person without a phone number, it is not possible.-->
 创建新的人和改变号码又可以了。然而，还有一个问题。如果我们试图添加一个没有电话号码的人，这是不可能的。

![](../../images/8/25e.png)

<!-- Validation fails, because frontend sends an empty string as the value of _phone_.-->
 验证失败，因为前端发送了一个空字符串作为_phone_的值。

<!-- Let's change the function creating new persons so that it sets _phone_ to _undefined_ if user has not given a value.-->
 让我们改变创建新人的函数，如果用户没有给出一个值，它就把_phone_设置为_undefined_。

```js
const PersonForm = ({ setError }) => {
  // ...
  const submit = async (event) => {
    event.preventDefault()
    createPerson({
      variables: {
        name, street, city,  // highlight-line
        phone: phone.length > 0 ? phone : undefined  // highlight-line
      }
    })

  // ...
  }

  // ...
}
```

<!-- Current application code can be found on [Github](https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-7), branch <i>part8-7</i>.-->
 目前的应用代码可以在[Github](https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-7)上找到，分支<i>part8-7</i>。

### Updating cache, revisited

<!-- We have to [update](/en/part8/react_and_graph_ql#updating-the-cache) the cache of the Apollo client on creating new persons. We can update it using the mutation's _refetchQueries_ option to define that the-->
 我们必须在创建新人时[更新](/en/part8/react_and_graph_ql#updating-the-cache)Apollo客户端的缓存。我们可以使用改变的_refetchQueries_选项来更新它，以定义
<em>ALL\_PERSONS</em> query is done again.

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

<!-- This approach is pretty good, the drawback being that the query is always rerun with any updates.-->
 这种方法相当不错，缺点是任何更新都要重新运行查询。

<!-- It is possible to optimize the solution by handling updating the cache ourselves. This is done by defining a suitable [update](https://www.apollographql.com/docs/react/data/mutations/#update) callback for the mutation, which Apollo runs after the mutation:-->
 我们有可能通过自己处理更新缓存来优化解决方案。这可以通过为改变定义一个合适的[update](https://www.apollographql.com/docs/react/data/mutations/#update)回调来实现，Apollo会在改变后运行。

```js
const PersonForm = ({ setError }) => {
  // ...

  const [ createPerson ] = useMutation(CREATE_PERSON, {
    onError: (error) => {
      setError(error.graphQLErrors[0].message)
    },
    // highlight-start
    update: (cache, response) => {
      cache.updateQuery({ query: ALL_PERSONS }, ({ allPersons }) => {
        return {
          allPersons: allPersons.concat(response.data.addPerson),
        }
      })
    },
    // highlight-end
  })

  // ..
}
```

<!-- The callback function is given a reference to the cache and the data returned by the mutation as parameters. For example, in our case, this would be the created person.-->
 该回调函数被赋予一个对缓存的引用和改变返回的数据作为参数。例如，在我们的例子中，这将是创建的人。

<!-- Using the function [updateQuery](https://www.apollographql.com/docs/react/caching/cache-interaction/#using-updatequery-and-updatefragment) the code updates the-->
 使用函数[updateQuery](https://www.apollographql.com/docs/react/caching/cache-interaction/#using-updatequery-and-updatefragment)，代码更新了
<!-- query <em>ALL\_PERSONS</em> in cache by adding the new person to the cached data.-->
 查询<em>ALL\_PERSONS</em>在缓存中，将新的人加入到缓存数据中。

<!-- In some situations, the only sensible way to keep the cache up to date is using the _update_ callback.-->
 在某些情况下，保持缓存更新的唯一合理方式是使用_update_回调。

<!-- When necessary, it is possible to disable cache for the whole application or [single queries](https://www.apollographql.com/docs/react/api/react/hooks/#options) by setting the field managing the use of cache, [fetchPolicy](https://www.apollographql.com/docs/react/data/queries/#configuring-fetch-logic) as <em>no-cache</em>.-->
 必要时，可以通过将管理缓存使用的字段[fetchPolicy](https://www.apollographql.com/docs/react/data/queries/#configuring-fetch-logic)设置为<em>no-cache</em>，来禁用整个应用或[单个查询](https://www.apollographql.com/docs/react/api/react/hooks/#options)的缓存。

<!-- Be diligent with the cache. Old data in cache can cause hard-to-find bugs. As we know, keeping the cache up to date is very challenging. According to a coder proverb:-->
 勤于使用缓存。缓存中的旧数据会导致难以发现的bug。正如我们所知，保持缓存的更新是非常具有挑战性的。根据一个编码员的谚语。

<!-- > <i>There are only two hard things in Computer Science: cache invalidation and naming things.</i> Read more [here](https://www.google.com/search?q=two+hard+things+in+Computer+Science&oq=two+hard+things+in+Computer+Science).-->
 > <i>计算机科学中只有两件难事：缓存失效和命名事物。</i>阅读更多内容[这里](https://www.google.com/search?q=two+hard+things+in+Computer+Science&oq=two+hard+things+in+Computer+Science)。

<!-- The current code of the application can be found on [Github](https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-8), branch <i>part8-8</i>.-->
 目前的应用代码可以在[Github](https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-8)上找到，分支<i>part8-8</i>。

</div>

<div class="tasks">

### Exercises 8.17.-8.22.

#### 8.17 Listing books

<!-- After the backend changes, the list of books does not work anymore. Fix it.-->
 后端修改后，书籍列表不再起作用了。修复它。

#### 8.18 Log in

<!-- Adding new books and changing the birth year of an author do not work because they require a user to be logged in.-->
 添加新书和改变作者的出生年份不能工作，因为它们需要用户登录。

<!-- Implement login functionality and fix the mutations.-->
实现登录功能并修复改变。

<!-- It is not necessary yet to handle validation errors.-->
现在还没有必要处理验证错误。

<!-- You can decide how the login looks on the user interface. One possible solution is to make the login form into a separate view which can be accessed through a navigation menu:-->
你可以决定登录在用户界面上的样子。一个可能的解决方案是将登录表单做成一个单独的视图，可以通过导航菜单访问。

![](../../images/8/26.png)

<!-- The login form:-->
 登录表格。

![](../../images/8/27.png)

<!-- When a user is logged in, the navigation changes to show the functionalities which can only be done by a logged-in user:-->
 当用户登录后，导航会改变，显示只有登录用户才能完成的功能。

![](../../images/8/28.png)

#### 8.19 Books by genre, part 1

<!-- Complete your application to filter the book list by genre. Your solution might look something like this:-->
 完成你的应用，按类型过滤图书列表。你的解决方案可能如下所示：

![](../../images/8/30.png)

<!-- In this exercise, the filtering can be done using just React.-->
 在这个练习中，过滤可以只用React来完成。

#### 8.20 Books by genre, part 2

<!-- Implement a view which shows all the books based on the logged-in user's favourite genre.-->
 实现一个视图，根据登录用户最喜欢的类型来显示所有的书。

![](../../images/8/29.png)

#### 8.21 books by genre with GraphQL

<!-- In the previous two exercises, the filtering could have been done using just React.-->
 在前两个练习中，过滤可以只用React来完成。
<!-- To complete this exercise, you should redo the filtering the books based on a selected genre (that was done in exercise 8.19) using a GraphQL query to the server. If you already did so then you do not have to do anything.-->
 为了完成这个练习，你应该使用GraphQL查询服务器，重新进行基于选定流派的书籍过滤（在练习8.19中完成）。如果你已经这样做了，那么你不需要做任何事情。

<!-- This and the next exercises are quite **challenging** like it should be this late in the course. You might want to complete first the easier ones in the [next part](/en/part8/fragments_and_subscriptions).-->
 这个和下一个练习是相当**挑战的**，在课程的后期应该是这样的。你可能想先完成[下一部分](/en/part8/fragments_and_subscriptions)中比较容易的练习。

#### 8.22 Up-to-date cache and book recommendations

<!-- If you did the previous exercise, that is, fetch the books in a genre with GraphQL, ensure somehow that the books view is kept up to date. So when a new book is added, the books view is updated **at least** when a genre selection button is pressed.-->
 如果你做了前面的练习，即用GraphQL获取一个流派中的书籍，确保书籍视图保持最新。所以当有新书加入时，**至少**在按下流派选择按钮时，书籍视图会被更新。

<i>When new genre selection is not done, the view does not have to be updated. </i>

</div>
