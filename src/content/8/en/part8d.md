---
mainImage: ../../../images/part-8.svg
part: 8
letter: d
lang: en
---

<div class="content">


The frontend of our application shows the phone directory just fine with the updated server. However if we want to add new persons, we have to add log in functionality to the backend. 

### User log in

Let's add variable _token_ to the applications state. It saves the token when user has logged in. If _token_ is undefined, we show the component responsible for logging in, <i>LoginForm</i>. It is given the function responsible for the mutation, _login_, as a parameter:

```js
const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

const App = () => {
  const [token, setToken] = useState(null)

  // ...

  const [login] = useMutation(LOGIN, {
    onError: handleError
  })

  const errorNotification = () => errorMessage &&
    <div style={{ color: 'red' }}>
      {errorMessage}
    </div>

  if (!token) {
    return (
      <div>
        {errorNotification()}
        <h2>Login</h2>
        <LoginForm
          login={login}
          setToken={(token) => setToken(token)}
        />
      </div>
    )
  }

  return (
    // ...
  )
}
```

If the login operation fails, error message is shown in the <i>App</i> component thanks to the _onError_ handler set to the login mutation.

If login is successfull, the <i>token</i> it returns is saved to the state of the <i>App</i> component. The token is also saved to <i>local storage</i>. This way it is easier to access when we want to add it to the <i>Authorization</i>-header of a request.

```js
import React, { useState } from 'react'

const LoginForm = (props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const submit = async (event) => {
    event.preventDefault()

    const result = await props.login({
      variables: { username, password }
    })

    if (result) {
      const token = result.data.login.value
      props.setToken(token)
      localStorage.setItem('phonenumbers-user-token', token)
    }
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


Let's also add a button which enables logged in user to log out. The buttons onClick handler sets the _token_ state to null, removes the token from local storage and resets the cache of the Apollo client. 

The last is [important](https://www.apollographql.com/docs/react/recipes/authentication.html#login-logout), because some queries might have fetced data to cache, which only logged in users should have access to. 


```js
const App = () => {
  const client = useApolloClient()

  // ...

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  // ...
}
```

The current code of the application can be found from [github](https://github.com/fullstackopen-2019/graphql-phonebook-frontend/tree/part8-6), branch <i>part8-6</i>.

### Adding a token to a header

After the backend changes creating new persons requires, that a valid user token is sent with the request. In order to send the token, we have to change the way we define the _ApolloClient_-object in <i>index.js</i> a little. 

```js
import React from 'react'
import ReactDOM from 'react-dom'
import ApolloClient from 'apollo-boost' // highlight-line
import { ApolloProvider } from "@apollo/react-hooks"
import App from './App'

// highlight-start
const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql'
})
// highlight-end

ReactDOM.render(
  <ApolloProvider client={client} >
    <App />
  </ApolloProvider>, 
  document.getElementById('root')
)
```


The new definition uses [apollo-boost](https://github.com/apollographql/apollo-client/tree/master/packages/apollo-boost)-library. According to its documentation

> <i>Apollo Boost is a zero-config way to start using Apollo Client. It includes some sensible defaults, such as our recommended InMemoryCache and HttpLink, which come configured for you with our recommended settings.</i>


so apollo-boost offers an easy way to configure _ApolloClient_ with settings suitable for most situations. 


Even though it would be possible to also configure the request headers with apollo-boost, we will now abandon it and do the configuration ourselves. 


The configuration is as follows:

```js
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'

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

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})
```

It requires installing two libraries:

```js
npm install --save apollo-link apollo-link-context
```


_client_ is now configured using [ApolloClient](https://www.apollographql.com/docs/react/api/apollo-client.html#apollo-client) constructorfunction of [apollo-link](https://www.apollographql.com/docs/link/index.html). It has two parameters, _link_ and _cache_. The latter defines, that the application now uses a cache operating in the main memory [InMemoryCache](https://www.apollographql.com/docs/react/advanced/caching.html#smooth-scroll-top).


The first parameter _link_ defines how the clients contacts the server. The communication is based on [httpLink](https://www.apollographql.com/docs/link/links/http.htm), a normal connection over HTTP with the addition that a token from localStorage is set as the value of the <i>authorization</i> [header](https://www.apollographql.com/docs/react/recipes/authentication.html#Header) if it exists. 


Creating new persons and changing numbers works again. There is however one remaining problem. If we try to add a person without a phonenumber, it is not possible. 

![](../../images/8/25e.png)


Validation fails, because frontend sends an empty string as the value of _phone_.


Let's change the function creating new persons so, that it sets _phone_ to null if user has not given a value. 

```js
const PersonForm = (props) => {
  // ...
  const submit = async (e) => {
    e.preventDefault()

    await props.addPerson({ 
      variables: { 
        name, street, city, // highlight-line
        phone: phone.length>0 ? phone : null // highlight-line
      } 
    })

  // ...
  }

  // ...
}
```


Current application code can be found from [github](https://github.com/fullstackopen-2019/graphql-phonebook-frontend/tree/part8-7), branch <i>part8-7</i>.

### Updating cache, revisited

When adding new persons, we must declare that the cache of Apollo client has to be [updated](/osa8/react_ja_graph_ql#valimuistin-paivitys). The cache can be updated by using the option _refetchQueries_ on the mutation to force <em>ALL\_PERSONS</em> query to be rerun. 


```js 
const App = () => {
  // ...

  const [addPerson] = useMutation(CREATE_PERSON, {
    onError: handleError,
    refetchQueries: [{ query: ALL_PERSONS }]
  })

  // ..
}
```


This approach is pretty good, the drawback being that the query is always rerun with any updates. 


It is possible to optimize the solution by handling updating the cache ourselves. This is done by defining a suitable [update](https://www.apollographql.com/docs/react/advanced/caching.html#after-mutations)-callback for the mutation, which Apollo runs after the mutation:


```js 
const App = () => {
  // ...

  const [addPerson] = useMutation(CREATE_PERSON, {
    onError: handleError,
    // highlight-start
    update: (store, response) => {
      const dataInStore = store.readQuery({ query: ALL_PERSONS })
      dataInStore.allPersons.push(response.data.addPerson)
      store.writeQuery({
        query: ALL_PERSONS,
        data: dataInStore
      })
    }
    // highlight-end
  })
 
  // ..
}  
```


The callback function is given a reference to the cache and the data returned by the mutation as parameters. For example in our case this would be the created person. 


The code reads the cached state of <em>ALL\_PERSONS</em> query using [readQuery](https://www.apollographql.com/docs/react/advanced/caching.html#readquery) function and updates the cache with [writeQuery](https://www.apollographql.com/docs/react/advanced/caching.html#writequery-and-writefragment) function adding the new person to the cached data. 


There are some situations where the only good way to keep the cache up to date is using _update_ -callbacks. 


When necessary it is possible to disable cache for the whole application or single queries by setting the field managing the use of cache, [fetchPolicy](https://www.apollographql.com/docs/react/api/react-apollo.html#query-props) as <em>no-cache</em>.


We could declare, that the address details of a single person are not saved to cache:

```js 
const Persons = ({ result }) => {
  // ...
  const show = async (name) => {
    const { data } = await client.query({
      query: FIND_PERSON,
      variables: { nameToSearch: name },
      fetchPolicy: 'no-cache' // highlight-line
    })
    setPerson(data.findPerson)
  }

  // ...
}
``` 


We will however leave the code as is. 


Be diligent with the cache. Old data in cache can cause hard to find bugs. As we know, keeping the cache up to date is very challenging. According to a coder proverb

> <i>There are only two hard things in Computer Science: cache invalidation and naming things.</i> Read more [here](https://www.google.com/search?q=two+hard+things+in+Computer+Science&oq=two+hard+things+in+Computer+Science).



The current code of the application can be found from [github](https://github.com/fullstackopen-2019/graphql-phonebook-frontend/tree/part8-8), branch <i>part8-8</i>.

</div>

<div class="tasks">

### Exercises

#### 8.17 Listing books


After the backend changes the list of books does not work anymore. Fix it. 

#### 8.18 Log in


Adding new books and changing the birth year of an author do not work, because they require user to be logged in. 


Implement log in functionality and fix the mutations. 


It is not necessary yet to handle validation errors. 


You can decide how the log in looks on the user interface. One possible solution is to make the log in form into a separate view which can be accessed through a navigation menu: 

![](../../images/8/26.png)


The login form

![](../../images/8/27.png)


When a user is logged in, the navigation changes to show the functionalities which can only be done by a logged in user

![](../../images/8/28.png)

#### 8.19 Books by genre, part 1


Complete your application to filter the book list by genre. Your solution might look something like this:

![](../../images/8/30.png)

In this exercise the filtering can be done using just React.

#### 8.20 Books by genre, part 2


Implement a view, which shows the logged in user all books in their favourite genre.

![](../../images/8/29.png)

#### 8.21 books by genre with GraphQL


The filtering can be done using just React. You can mark this exercise as completed if you filter the books using a GraphQL query to the server in exercise 8.5. 


This and the next exercises are quite **challenging** like it should be this late in the course. You might want to complete first the easier ones in [next part](/en/part8/fragments_and_subscriptions).

Some tips

 - Instead of using the <i>Query</i> component or the <i>useQuery</i> hook it might be better to do the queries with the _client_-object, which can be accessed with the [ApolloConsumer](https://www.apollographql.com/docs/react/essentials/queries.html#manual-query) component or _useApolloClient_ hook. See more [here](/en/part8/react_and_graph_ql#named-queries-and-variables).
 -  It is sometimes useful to save the results of a GraphQL query to the state of a component. 
 -  Note, that you can do GraphQL queries in a <i>useEffect</i>-hook.
 -  The [second parameter](https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect) of a <i>useEffect</i> - hook can become handy depending on your approach. 

#### 8.22 Up to date cache and book recommendations

If you fetch the book recommendations with GraphQL, ensure somehow that the books view is kept up to date. So when a new book is added, the books view is updated **at least** when a genre selection button is pressed. 

<i>iWhen new genre selection is not done, the view does not have to be updated. </>

</div>