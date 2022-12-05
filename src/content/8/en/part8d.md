---
mainImage: ../../../images/part-8.svg
part: 8
letter: d
lang: en
---

<div class="content">

The frontend of our application shows the phone directory just fine with the updated server. However, if we want to add new persons, we have to add login functionality to the frontend. 

### User login

Let's add the variable _token_ to the application's state. When a user is logged in, it will contain a user token. If _token_ is undefined, we render the <i>LoginForm</i> component responsible for user login. The component receives an error handler and the _setToken_ function as parameters:

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

Next, we define a mutation for logging in:

```js
export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`
```

The _LoginForm_ component works pretty much just like all the other components doing mutations that we have previously created. 
Interesting lines in the code have been highlighted:

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

We are using an effect hook to save the token's value to the state of the _App_ component and the local storage after the server has responded to the mutation. 
Use of the effect hook is necessary to avoid an endless rendering loop.

Let's also add a button which enables a logged-in user to log out. The button's onClick handler sets the _token_ state to null, removes the token from local storage and resets the cache of the Apollo client. The last step is [important](https://www.apollographql.com/docs/react/networking/authentication/#reset-store-on-logout), because some queries might have fetched data to cache, which only logged-in users should have access to. 

We can reset the cache using the [resetStore](https://www.apollographql.com/docs/react/api/core/ApolloClient/#ApolloClient.resetStore) method of an Apollo _client_ object. 
The client can be accessed with the [useApolloClient](https://www.apollographql.com/docs/react/api/react-hooks/#useapolloclient) hook:

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

The current code of the application can be found on [Github](https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-6), branch <i>part8-6</i>.

### Adding a token to a header

After the backend changes, creating new persons requires that a valid user token is sent with the request. In order to send the token, we have to change the way we define the _ApolloClient_ object in <i>index.js</i> a little. 

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

The link parameter given to the _client_ object defines how apollo connects to the server. Here, the normal [httpLink](https://www.apollographql.com/docs/link/links/http.htm) connection is modified so that the request's <i>authorization</i> [header](https://www.apollographql.com/docs/react/networking/authentication/#header) contains the token if one has been saved to the localStorage. 

Creating new persons and changing numbers works again. There is however one remaining problem. If we try to add a person without a phone number, it is not possible. 

![](../../images/8/25e.png)

Validation fails, because frontend sends an empty string as the value of _phone_.

Let's change the function creating new persons so that it sets _phone_ to _undefined_ if user has not given a value. 

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

Current application code can be found on [Github](https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-7), branch <i>part8-7</i>.

### Updating cache, revisited

We have to [update](/en/part8/react_and_graph_ql#updating-the-cache) the cache of the Apollo client on creating new persons. We can update it using the mutation's _refetchQueries_ option to define that the 
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

This approach is pretty good, the drawback being that the query is always rerun with any updates. 

It is possible to optimize the solution by handling updating the cache ourselves. This is done by defining a suitable [update](https://www.apollographql.com/docs/react/data/mutations/#update) callback for the mutation, which Apollo runs after the mutation:

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

The callback function is given a reference to the cache and the data returned by the mutation as parameters. For example, in our case, this would be the created person. 

Using the function [updateQuery](https://www.apollographql.com/docs/react/caching/cache-interaction/#using-updatequery-and-updatefragment) the code updates the 
query <em>ALL\_PERSONS</em> in cache by adding the new person to the cached data. 

In some situations, the only sensible way to keep the cache up to date is using the _update_ callback.

When necessary, it is possible to disable cache for the whole application or [single queries](https://www.apollographql.com/docs/react/api/react/hooks/#options) by setting the field managing the use of cache, [fetchPolicy](https://www.apollographql.com/docs/react/data/queries/#configuring-fetch-logic) as <em>no-cache</em>.

Be diligent with the cache. Old data in cache can cause hard-to-find bugs. As we know, keeping the cache up to date is very challenging. According to a coder proverb:

> <i>There are only two hard things in Computer Science: cache invalidation and naming things.</i> Read more [here](https://martinfowler.com/bliki/TwoHardThings.html).

The current code of the application can be found on [Github](https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-8), branch <i>part8-8</i>.

</div>

<div class="tasks">

### Exercises 8.17.-8.22.

#### 8.17 Listing books

After the backend changes, the list of books does not work anymore. Fix it. 

#### 8.18 Log in

Adding new books and changing the birth year of an author do not work because they require a user to be logged in. 

Implement login functionality and fix the mutations. 

It is not necessary yet to handle validation errors. 

You can decide how the login looks on the user interface. One possible solution is to make the login form into a separate view which can be accessed through a navigation menu: 

![](../../images/8/26.png)

The login form:

![](../../images/8/27.png)

When a user is logged in, the navigation changes to show the functionalities which can only be done by a logged-in user:

![](../../images/8/28.png)

#### 8.19 Books by genre, part 1

Complete your application to filter the book list by genre. Your solution might look something like this:

![](../../images/8/30.png)

In this exercise, the filtering can be done using just React.

#### 8.20 Books by genre, part 2

Implement a view which shows all the books based on the logged-in user's favourite genre.

![](../../images/8/29.png)

#### 8.21 books by genre with GraphQL

In the previous two exercises, the filtering could have been done using just React.
To complete this exercise, you should redo the filtering the books based on a selected genre (that was done in exercise 8.19) using a GraphQL query to the server. If you already did so then you do not have to do anything.

This and the next exercises are quite **challenging** like it should be this late in the course. You might want to complete first the easier ones in the [next part](/en/part8/fragments_and_subscriptions).

#### 8.22 Up-to-date cache and book recommendations

If you did the previous exercise, that is, fetch the books in a genre with GraphQL, ensure somehow that the books view is kept up to date. So when a new book is added, the books view is updated **at least** when a genre selection button is pressed. 

<i>When new genre selection is not done, the view does not have to be updated. </i>

</div>
