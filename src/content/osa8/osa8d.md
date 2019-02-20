---
mainImage: ../../images/part-8.svg
part: 8
letter: d
---

<div class="content">

Sovelluksen fronend toimii puhelinluettelon näyttämisen osalta päivitetyn palvelimen kanssa. Jotta luetteloon voitaisiin lisätä henkilöitä, tulee backendiin toteuttaa kirjaantuminen.

### Käyttän kirjautuminen

Lisätään sovelluksen tilaan muuttuja _token_ joka tallettaa tokenin siinä vaiheessa kun käyttäjä on kirjaantunut. Jos _token_ ei ole määritelty, näytetään kirjautumisesta huoleviva komponentti <i>LoginForm</i>, joka saa parametriksi mutaation tekevän funktion _login_:

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

  const login = useMutation(LOGIN)

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
          handleError={handleError}
        />
      </div>
    )
  }

  return (
    // ...
  )
}
```

Jos kirjautuminen onnistuu, eli funktio _login_ ei heitä poikkeusta, talletetaan funktion palauttama <i>token</i> komponentin <i>App</i> tilaan. Token talletetaan myös <i>local storageen</i>, näin siihen on helpompi päästä käsiksi siinä vaiheessa kun haluamme asettaa tokenin <i>Authorization</i>-headeriin.

Jos operaatio epäonnistuu, kutsutaan propsina saatua funktiota, joka asettaa komponentin <i>App</i> tilaan käyttäjälle näytettävän virheilmoituksen:

```js
import React, { useState } from 'react'

const LoginForm = (props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const submit = async (event) => {
    event.preventDefault()

    try {
      const result = await props.login({
        variables: { username, password }
      })

      const token = result.data.login.value

      props.setToken(token)
      localStorage.setItem('library-user-token', token)
    } catch(error){
      props.handleError(error)
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

Lisätään sovellukselle myös nappi, jonka avulla kirjautunut käyttäjä voi kirjautua ulos. Napin klikkauskäsittelijässä asetetaan tilaan _token_ null, poistetaan token local storagesta ja resetoidaan Apollo clientin välimuisti. Tämä on [tärkeää](https://www.apollographql.com/docs/react/recipes/authentication.html#login-logout), sillä joissain välimustiin on saatettu hakea dataa, johon vain kirjaantuneella käyttäjällä on oikeus päästä käsiksi:


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

Sovelluksen tämän vaiheen koodi [githubissa](https://github.com/fullstack-hy2019/graphql-phonebook-frontend/tree/part8-6), branchissa <i>part8-6</i>.

### Tokenin lisääminen headeriin

Backendin muutosten jälkeen uusien henkilöiden lisäys puhelinluetteloon vaatii sen, että käyttäjän token lähetetään pyynnon mukana. Jotta saamme tokenin lähetettyä pyyntöjen mukana, joudumme hieman muuttamaan tapaa, jonka avulla määrittelemme _ApolloClient_-olion tiedostossa <i>index.js</i>

```js
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import ApolloClient from 'apollo-boost' // highlight-line
import { ApolloProvider } from 'react-apollo-hooks'

// highlight-start
const client = new ApolloClient({
  uri: "http://localhost:4000/graphql"
})
// highlight-end

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
)
```

Määrittely käyttää apunaan [apollo-boost](https://github.com/apollographql/apollo-client/tree/master/packages/apollo-boost)-kirjastoa, joka dokumentaationsa mukaan

> <i>Apollo Boost is a zero-config way to start using Apollo Client. It includes some sensible defaults, such as our recommended InMemoryCache and HttpLink, which come configured for you with our recommended settings.</i>

Eli apollo-boost tarjoaa helpon tavan konfiguroida _ApolloClient_ useisiin tilanteisiin rittävillä oletusasetuksilla. 

Joudumme nyt luopumaan apollo-boostilla tapahtuvasta konfiguroinnista sillä se ei mahdollista headereiden asettamista pyyntöihin.

Konfiguraatio on seuraavassa

```js
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('library-user-token')
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

Konfiguraatio edellyttää kahden kirjaston asentamista:

```js
npm install --save apollo-link apollo-link-context
```

_client_ muodostetaan nyt kirjaston [apollo-link](https://www.apollographql.com/docs/link/index.html) tarjoaman konstruktorifunktion [ApolloClient](https://www.apollographql.com/docs/react/api/apollo-client.html#apollo-client). Parametreja on kaksi, _link_ ja _cache_. Näistä jälkimmäinen määrittelee, että sovelluksen käyttöön tulee keskusmuistissa toimiva välimuisti [InMemoryCache](https://www.apollographql.com/docs/react/advanced/caching.html#smooth-scroll-top). 

Ensimmäinen parametri _link_ määrittelee miten client ottaa yhteyttä palvelimeen, missä pohjalla on [httpLink](https://www.apollographql.com/docs/link/links/http.htm), eli normaali HTTP:n yli tapahtuva yhteys, jota on höystetty siten että pyyntöjen mukaan [asetetaan headerille](https://www.apollographql.com/docs/react/recipes/authentication.html#Header) <i>authorization</i> arvoksi localStoragessa mahdollisesti oleva token.

Uusien henkilöiden lisäys ja numeroiden muuttaminen toimii taas. Sovellukseen jää kuitenkin yksi ongelma, jos yritämme lisätä puhelinnumerotonta henkilöä se ei onnistu

![](../images/8/25.png)

Validointi epäonnistuu sillä fronend lähettää kentän _phone_ arvona tyhjän merkkijonon. 

Muutetaan uuden henkilön luovaa funktiota siten, että se asettaa kentälle _phone_  arvon _null_ jos käyttäjä ei ole syöttänyt kenttään mitään:

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

Sovelluksen tämän vaiheen koodi [githubissa](https://github.com/fullstack-hy2019/graphql-phonebook-frontend/tree/part8-7), branchissa <i>part8-7</i>.

### Cachen päivitys


Sovelluksen tämän vaiheen koodi [githubissa](https://github.com/fullstack-hy2019/graphql-phonebook-frontend/tree/part8-8), branchissa <i>part8-8</i>.

</div>

<div class="tasks">

### Tehtäviä

#### DEPRECATED: Genren kirjat

Laajenna sovellustasi siten, että kirjojen näkymästä voidaan rajata näytettävä kirjalista ainoastaan niihin jotka kuuluvat valittuun genreen. Toteutuksesi voi näyttää seuraavalta:

![](../images/8/19.png)

#### DEPRECATED: Genren kirjat GraphQL:llä

Tietyn genren kirjoihin rajoittamisen voi tehdä kokonaan React-sovelluksen puolella. Voit merkitä tämän tehtävän, jos rajaat näytettävät kirjat tahtävässä 8.5 palvelimeen toteutetun suoran GraphQ-kyselyn avulla. 

Tämä tehtävä voi olla haastava ja niin kurssin tässä vaiheessa jo kuuluukin olla. Muutama vihje
- komponetin <i>Query</i> tai hookin <i>useQuery</i> käyttö kannattaa kirjalistan osalta sillä kysely on pystyttävä tekemään käyttäjän valitessa haluamansa genren
- GraphQL-kyselyjen tuloksia kannatta joskus tallentaan komponentin tilaan
- huomaa, että voit tehdä GraphQL-kyselyjä <i>useEffect</i>-hookissa
- <i>useEffect</i>-hookin [toisesta parametrista](https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect) voi olla tehtävässä apua, se tosin riippuu käyttämästäsi lähestymistavasta.


</div>