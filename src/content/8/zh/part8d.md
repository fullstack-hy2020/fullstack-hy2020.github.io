---
mainImage: ../../../images/part-8.svg
part: 8
letter: d
lang: zh
---

<div class="content">

<!-- The frontend of our application shows the phone directory just fine with the updated server. However, if we want to add new persons, we have to add login functionality to the frontend.-->
前端的应用程序很好地显示了更新后的电话簿。但是，如果我们想添加新的人员，我们必须在前端添加登录功能。

### User login

<!-- Let's add the variable *token* to the application's state. When a user is logged in, it will contain a user token. If *token* is undefined, we render the <i>LoginForm</i> component responsible for user login. The component receives an error handler and the *setToken* function as parameters:-->
让我们把变量*token*添加到应用程序的状态中。当用户登录时，它将包含一个用户令牌。如果*token*未定义，我们渲染<i>LoginForm</i>组件负责用户登录。该组件接收错误处理程序和*setToken*函数作为参数：

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
下一步，我们定义一个登录的变异：

```js
export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`
```

<!-- The *LoginForm* component works pretty much just like all the other components doing mutations that we have previously created.-->
**登录表单组件的工作原理和我们之前创建的所有其他组件进行变异几乎一样。**
<!-- Interesting lines in the code have been highlighted:-->
代码中有趣的行被高亮了：

<font color="green">```python
for i in range(10):
    print(i)
```</font>

<font color="green">```python
for i in range(10):
    打印(i)
```</font>

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

<!-- We are using an effect hook to save the token''s value to the state of the *App* component and the local storage after the server has responded to the mutation.-->
我们正在使用一个effect hook来将token值保存到*App*组件的state和服务器响应mutation后的本地存储中。
<!-- Use of the effect hook is necessary to avoid an endless rendering loop.-->
使用effect Hook是必要的，以避免无限渲染循环。

<!-- Let's also add a button which enables a logged-in user to log out. The button's onClick handler sets the *token* state to null, removes the token from local storage and resets the cache of the Apollo client. The last step is [important](https://www.apollographql.com/docs/react/networking/authentication/#reset-store-on-logout), because some queries might have fetched data to cache, which only logged-in users should have access to.-->
让我们还添加一个按钮，使已登录用户可以退出登录。按钮的`onClick`处理程序将*token*状态设置为`null`，从本地存储中删除令牌，并重置Apollo客户端的缓存。最后一步[很重要](https://www.apollographql.com/docs/react/networking/authentication/#reset-store-on-logout)，因为某些查询可能已经获取了数据缓存，只有登录用户才能访问。

让我们还添加一个按钮，使已登录用户可以退出登录。按钮的`onClick`处理程序将*token*状态设置为`null`，从本地存储中删除令牌，并重置Apollo客户端的缓存。最后一步[很重要](https://www.apollographql.com/docs/react/networking/authentication/#reset-store-on-logout)，因为某些查询可能已经获取了数据缓存，只有登录用户才能访问。

<!-- We can reset the cache using the [resetStore](https://www.apollographql.com/docs/react/api/core/ApolloClient/#ApolloClient.resetStore) method of an Apollo *client* object.-->
我们可以使用Apollo *client*对象的[resetStore](https://www.apollographql.com/docs/react/api/core/ApolloClient/#ApolloClient.resetStore)方法来重置缓存。
<!-- The client can be accessed with the [useApolloClient](https://www.apollographql.com/docs/react/api/react-hooks/#useapolloclient) hook:-->
客户端可以使用[useApolloClient](https://www.apollographql.com/docs/react/api/react-hooks/#useapolloclient)钩子访问：

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

### Adding a token to a header

<!-- After the backend changes, creating new persons requires that a valid user token is sent with the request. In order to send the token, we have to change the way we define the *ApolloClient* object in <i>index.js</i> a little.-->
在后端更改之后，创建新的人需要在请求中发送有效的用户令牌。为了发送令牌，我们必须稍微改变一下我们在<i>index.js</i>中定义的*ApolloClient*对象。

```js
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client'  // highlight-line
import { setContext } from '@apollo/client/link/context' // highlight-line

// highlight-start
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('phonenumbers-user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    }
  }
})
// highlight-end

const httpLink = createHttpLink({
  uri: 'http://localhost:4000',
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink) // highlight-line
})
```

<!-- The field *uri* that was previously used when creating the *client* object has been replaced by the field *link*, which defines in a more complicated case how Apollo is connected to the server. The server url is now wrapped using the function [createHttpLink](https://www.apollographql.com/docs/link/links/http.htm) into a suitable httpLink object. The link is modified by the [context](https://www.apollographql.com/docs/react/api/link/apollo-link-context/#overview) defined by the authLink object so that a possible token in localStorage is [set to header](https://www.apollographql.com/docs/react/networking/authentication/#header) <i>authorization</i> for each request to the server.-->
之前在创建 *client* 对象时使用的 *uri* 字段已被字段 *link* 所取代，它在更复杂的情况下定义了 Apollo 与服务器的连接方式。服务器 URL 现在使用 [createHttpLink](https://www.apollographql.com/docs/link/links/http.htm) 函数包装成一个合适的 httpLink 对象。该链接被 [context](https://www.apollographql.com/docs/react/api/link/apollo-link-context/#overview) 定义的 authLink 对象修改，以便在每个对服务器的请求中将本地存储中可能的令牌 [设置为头](https://www.apollographql.com/docs/react/networking/authentication/#header) <i>授权</i> 。

<!-- Creating new persons and changing numbers works again. There is however one remaining problem. If we try to add a person without a phone number, it is not possible.-->
创建新人员和更改数字又可以工作了。然而还有一个剩余的问题。如果我们尝试添加一个没有电话号码的人，是不可能的。

![browser showing person validation failed](../../images/8/25e.png)

<!-- Validation fails, because frontend sends an empty string as the value of *phone*.-->
验证失败，因为前端将一个空字符串作为*手机*的值发送了。

<!-- Let''s change the function creating new persons so that it sets *phone* to *undefined* if user has not given a value.-->
让我们改变创建新人的功能，以便如果用户没有给出值，则将*电话*设置为*未定义*。

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

<!-- Current application code can be found on [Github](https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-6), branch <i>part8-6</i>.-->
当前应用程序代码可以在 [Github](https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-6) 上找到，分支 <i>part8-6</i>。

### Updating cache, revisited

<!-- We have to [update](/en/part8/react_and_graph_ql#updating-the-cache) the cache of the Apollo client on creating new persons. We can update it using the mutation''s *refetchQueries* option to define that the-->
query should be refetched after the mutation.

我们必须[更新](/en/part8/react_and_graph_ql#updating-the-cache) Apollo客户端的缓存，以便在创建新人员时进行更新。 我们可以使用变异* refetchQueries *选项更新它，以定义在变异后应重新获取查询。
<em>ALL\_PERSONS</em> query is done again.

```js
const PersonForm = ({ setError }) => {
  // ...

  const [ createPerson ] = useMutation(CREATE_PERSON, {
    refetchQueries: [  {query: ALL_PERSONS} ], // highlight-line
    onError: (error) => {
      const errors = error.graphQLErrors[0].extensions.error.errors
      const messages = Object.values(errors).map(e => e.message).join('\n')
      setError(messages)
    }
  })
```

<!-- This approach is pretty good, the drawback being that the query is always rerun with any updates.-->
这种方法还是不错的，但缺点是，任何更新都会重新运行查询。

<!-- It is possible to optimize the solution by handling updating the cache ourselves. This is done by defining a suitable [update](https://www.apollographql.com/docs/react/data/mutations/#the-update-function) callback for the mutation, which Apollo runs after the mutation:-->
它可以通过自己处理更新缓存来优化解决方案。这是通过为变异定义合适的[更新](https://www.apollographql.com/docs/react/data/mutations/#the-update-function)回调来完成的，Apollo在变异之后运行该回调。

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
回调函数被给予一个对缓存的引用和由突变返回的数据作为参数。例如，在我们的例子中，这将是创建的人。

<!-- Using the function [updateQuery](https://www.apollographql.com/docs/react/caching/cache-interaction/#using-updatequery-and-updatefragment) the code updates the-->
cache

使用[updateQuery](https://www.apollographql.com/docs/react/caching/cache-interaction/#using-updatequery-and-updatefragment)函数，代码将更新缓存
<!-- query <em>ALL\_PERSONS</em> in cache by adding the new person to the cached data.-->
查询缓存中的<em>ALL\_PERSONS</em>，并将新人员添加到缓存数据中。

<!-- In some situations, the only sensible way to keep the cache up to date is using the *update* callback.-->
在某些情况下，保持缓存最新的唯一明智的方法就是使用*更新*回调。

<!-- When necessary, it is possible to disable cache for the whole application or [single queries](https://www.apollographql.com/docs/react/api/react/hooks/#options) by setting the field managing the use of cache, [fetchPolicy](https://www.apollographql.com/docs/react/data/queries/#configuring-fetch-logic) as <em>no-cache</em>.-->
当必要时，可以通过将管理使用缓存的字段[fetchPolicy](https://www.apollographql.com/docs/react/data/queries/#configuring-fetch-logic)设置为<em>no-cache</em>来禁用整个应用程序或[单个查询](https://www.apollographql.com/docs/react/api/react/hooks/#options)的缓存。

<!-- Be diligent with the cache. Old data in cache can cause hard-to-find bugs. As we know, keeping the cache up to date is very challenging. According to a coder proverb:-->
**要勤勉地管理缓存。缓存中的旧数据会导致难以发现的bug。众所周知，维持缓存的更新是非常具有挑战性的。根据程序员谚语：**

<!-- > <i>There are only two hard things in Computer Science: cache invalidation and naming things.</i> Read more [here](https://martinfowler.com/bliki/TwoHardThings.html).-->
> <i>计算机科学中只有两件困难的事：缓存失效和命名。</i>更多内容请参见[这里](https://martinfowler.com/bliki/TwoHardThings.html)。

<!-- The current code of the application can be found on [Github](https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-7), branch <i>part8-7</i>.-->
当前应用的代码可以在[Github](https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-7)上的<i>part8-7</i>分支找到。

</div>

<div class="tasks">

### Exercises 8.17.-8.22

#### 8.17 Listing books

<!-- After the backend changes, the list of books does not work anymore. Fix it.-->
在后端改变之后，书籍列表不再工作了。修复它。

#### 8.18 Log in

<!-- Adding new books and changing the birth year of an author do not work because they require a user to be logged in.-->
添加新书和更改作者的出生年份不起作用，因为需要用户登录。

<!-- Implement login functionality and fix the mutations.-->
实现登录功能并修复变异。

<!-- It is not necessary yet to handle validation errors.-->
还不必处理验证错误。

<!-- You can decide how the login looks on the user interface. One possible solution is to make the login form into a separate view which can be accessed through a navigation menu:-->
你可以决定用户界面上登录的外观。一个可行的解决方案是将登录表单分成一个单独的视图，可以通过导航菜单访问：

![browser books showing login button highlighted](../../images/8/26.png)

<!-- The login form:-->
登录表单：

![browser showing login form](../../images/8/27.png)

<!-- When a user is logged in, the navigation changes to show the functionalities which can only be done by a logged-in user:-->
当用户登录后，导航会改变以显示只有登录用户才能完成的功能：

![browser showing addbook and logout buttons](../../images/8/28.png)

#### 8.19 Books by genre, part 1

<!-- Complete your application to filter the book list by genre. Your solution might look something like this:-->
完成您的申请，以按照流派筛选图书列表。您的解决方案可能看起来像这样：

![browser showing books buttons down at the bottom](../../images/8/30.png)

<!-- In this exercise, the filtering can be done using just React.-->
在这个练习中，可以仅使用React来完成过滤。

#### 8.20 Books by genre, part 2

<!-- Implement a view which shows all the books based on the logged-in user''s favourite genre.-->
实现一个视图，根据登录用户最喜欢的类型显示所有书籍。

![browser showing two books via patterns](../../images/8/29.png)

#### 8.21 books by genre with GraphQL

<!-- In the previous two exercises, the filtering could have been done using just React.-->
在前两个练习中，可以仅使用React来进行过滤。
<!-- To complete this exercise, you should redo the filtering the books based on a selected genre (that was done in exercise 8.19) using a GraphQL query to the server. If you already did so then you do not have to do anything.-->
要完成这项练习，您应该根据所选择的流派（在练习8.19中已经完成）重新使用GraphQL查询到服务器来过滤书籍。如果您已经完成了，则不必做任何事情。

<!-- This and the next exercises are quite **challenging** like it should be this late in the course. You might want to complete first the easier ones in the [next part](/en/part8/fragments_and_subscriptions).-->
这个和下一个练习很**有挑战性**，正如课程的最后一部分应该有的那样。你可能想先完成[下一部分](/en/part8/fragments_and_subscriptions)中更容易的练习。

#### 8.22 Up-to-date cache and book recommendations

<!-- If you did the previous exercise, that is, fetch the books in a genre with GraphQL, ensure somehow that the books view is kept up to date. So when a new book is added, the books view is updated **at least** when a genre selection button is pressed.-->
如果你做了之前的练习，也就是用GraphQL抓取一类书籍，请确保书籍视图保持最新。因此，当一本新书被添加时，至少在按下类别选择按钮时，书籍视图就会被更新。

<i>When new genre selection is not done, the view does not have to be updated. </i>

</div>
