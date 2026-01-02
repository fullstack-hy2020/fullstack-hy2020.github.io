---
mainImage: ../../../images/part-8.svg
part: 8
letter: d
lang: fi
---

<div class="content">

Sovelluksen frontend toimii puhelinluettelon näyttämisen osalta päivitetyn palvelimen kanssa. Jotta luetteloon voitaisiin lisätä henkilöitä, tulee frontendiin toteuttaa kirjautuminen.

### Käyttäjän kirjautuminen

Määritellään ensin kirjautumisen suorittava mutaatio tiedostossa <i>src/queries.js</i>:

```js
export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`
```

Määritellään kirjautumisesta huolehtiva komponentti _LoginForm_ tiedostossa <i>src/components/LoginForm.jsx</i>. Se toimii melko samalla tavalla kuin aiemmat mutaatioista huolehtivat komponentit. Mielenkiintoiset rivit on korostettu koodissa:

```js
import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { LOGIN } from '../queries'

const LoginForm = ({ setError, setToken }) => { // highlight-line
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // highlight-start
  const [ login ] = useMutation(LOGIN, {
    onCompleted: (data) => {
      const token = data.login.value
      setToken(token)
      localStorage.setItem('phonebook-user-token', token)
    },
    onError: (error) => {
      setError(error.message)
    }
  })
  // highlight-end

  // highlight-start
  const submit = (event) => {
    event.preventDefault()
    login({ variables: { username, password } })
  }
  // highlight-end

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

Komponentti saa propsina funktiot _setError_ ja _setToken_, joilla voidaan muuttaa ohjelman tilaa. Tilanhallinnan määrittely on jätetty komponentin _App_ vastuulle.

Kirjautumisen toteuttavalle _useMutation_-funktiolle on määritelty takaisinkutsufunktio _onCompleted_, jota kutsutaan, kun mutaatio on suoritettu onnistuneesti. Takaisinkutsufunktiossa tokenin arvo haetaan vastauksen datasta, ja tallennetaan sen jälkeen ohjelman tilaan ja selaimen localStorageen.

Otetaan uusi <i>LoginForm</i>-komponentti käyttöön tiedostossa <i>App.jsx</i>. Lisätään sovelluksen tilaan muuttuja _token_, joka tallettaa tokenin siinä vaiheessa kun käyttäjä on kirjautunut. Jos _token_ ei ole määritelty, näytetään ainoastaan kirjautumislomake:

```js
import LoginForm from './components/LoginForm' // highlight-line
// ...

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('phonebook-user-token')) // highlight-line
  const [errorMessage, setErrorMessage] = useState(null)
  const result = useQuery(ALL_PERSONS)

  if (result.loading) {
    return <div>loading...</div>
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  // highlight-start
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
  // highlight-end

  return (
    // ...
  )
}
```

Token alustetaan nyt localStoragesta mahdollisesti löytyvällä tokenin arvolla:

```js
const [token, setToken] = useState(localStorage.getItem('phonebook-user-token'))
```

Näin token haetaan sovellukseen myös sivun uudelleenlatauksen yhteydessä, ja käyttäjä pysyy kirjautuneena. Jos localStoragesta ei löydy arvoa avaimelle <i>phonebook-user-token</i>, tokenin arvoksi tulee _null_.

Lisätään sovellukselle myös nappi, jonka avulla kirjautunut käyttäjä voi kirjautua ulos. Napin klikkauskäsittelijässä asetetaan  _token_ tilaan _null_, poistetaan token local storagesta ja resetoidaan Apollo clientin välimuisti:

```js
import { useApolloClient, useQuery } from '@apollo/client/react' // highlight-line
//...

const App = () => {
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const result = useQuery(ALL_PERSONS)
  const client = useApolloClient() // highlight-line
  
  if (result.loading)  {
    return <div>loading...</div>
  }

  // highlight-start
  const onLogout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }
  // highlight-end

  // ...

  return (
    <>
      <Notify errorMessage={errorMessage} />
      <button onClick={onLogout}>logout</button> // highlight-line
      <Persons persons={result.data.allPersons} />
      <PersonForm setError={notify} />
      <PhoneForm setError={notify} />
    </>
  )
}
```

Välimuistin nollaaminen tapahtuu Apollon _client_-objektin metodilla [resetStore](https://www.apollographql.com/docs/react/api/core/ApolloClient#resetstore), clientiin taas päästään käsiksi hookilla [useApolloClient](https://www.apollographql.com/docs/react/api/react/useApolloClient). Välimuistin tyhjentäminen on [tärkeää](https://www.apollographql.com/docs/react/networking/authentication/#reset-store-on-logout), sillä joissain kyselyissä välimuistiin on saatettu hakea dataa, johon vain kirjaantuneella käyttäjällä on oikeus päästä käsiksi.


### Tokenin lisääminen headeriin

Backendin muutosten jälkeen uusien henkilöiden lisäys puhelinluetteloon vaatii sen, että käyttäjän token lähetetään pyynnön mukana. Tämä edellyttää muutoksia tiedostossa <i>main.jsx</i> olevaan ApolloClient-olion konfiguraatioon:

```js
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'
import { SetContextLink } from '@apollo/client/link/context' // highlight-line

// highlight-start
const authLink  = new SetContextLink(({ headers }) => {
  const token = localStorage.getItem('phonebook-user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    }
  }
})
// highlight-end

const httpLink = new HttpLink({ uri: 'http://localhost:4000' }) // highlight-line

// highlight-start
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink)
})
// highlight-end

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>,
)
```

Palvelimen URL kääritään [HttpLink](https://www.apollographql.com/docs/react/api/link/apollo-link-http)-konstruktorin avulla sopivaksi _httpLink_-olioksi kuten aiemminkin. Nyt sitä muokataan kuitenkin _authLink_-olion määrittelemän [kontekstin](https://www.apollographql.com/docs/react/api/link/apollo-link-context/#overview) avulla siten, että pyyntöjen mukaan [asetetaan headerille](https://www.apollographql.com/docs/react/networking/authentication/#header) <i>authorization</i> arvoksi localStoragessa mahdollisesti oleva token.

Uusien henkilöiden lisäys ja numeroiden muuttaminen toimii taas. 

### Validaatioiden korjaaminen

Sovelluksessa pitäisi pystyä lisäämään henkilö, jolla ei ole puhelinnumeroa. Nyt kuitenkin jos yritämme lisätä puhelinnumerotonta henkilöä, se ei onnistu:

![](../../images/8/25e.png)

Validointi epäonnistuu, sillä frontend lähettää kentän _phone_ arvona tyhjän merkkijonon. 

Muutetaan uuden henkilön luovaa funktiota siten, että se asettaa kentälle _phone_  arvon _undefined_, jos käyttäjä ei ole syöttänyt kenttään mitään:

```js
const PersonForm = ({ setError }) => {
  // ...
  const submit = async (event) => {
    event.preventDefault()

    // highlight-start
    createPerson({
      variables: {
        name,
        street,
        city,
        phone: phone.length > 0 ? phone : undefined,
      },
    })
    // highlight-end

    setName('')
    setPhone('')
    setStreet('')
    setCity('')
  }

  // ...
}
```

Nyt backendin ja tietokannan näkökulmasta <i>phone</i>-attribuutilla ei ole arvoa, jos käyttäjä jättää kentän tyhjäksi. Henkilön lisääminen ilman puhelinnumeroa onnistuu jälleen.

Myös numeron muuttamistoiminnallisuudessa on eräs ongelma. Tietokannan validaatiot vaativat, että puhelinnumeron tulee olla vähintään 5 merkkiä pitkä, mutta jos yritämme päivittää olemassa olevan henkilön puhelinnumeroksi liian lyhyen numeron, mitään ei näytä tapahtuvan. Henkilön puhelinnumero ei päivity, mutta toisaalta myöskään mitään virheilmoitusta ei näytetä. 

Konsolin <i>Network</i>-välilehdeltä näemme, että pyyntöön vastataan virheilmoituksella:

![Konsolin Networks-välilehti näyttää pyynnön vastauksen mukana tulleen virheilmoituksen](../../images/8/43.png)

Muokataan sovellusta siten, että validaatiovirheistä näytetään virheilmoitus myös puhelinnumeroa muutettaessa:

```js
const PhoneForm = ({ setError }) => {
  // ...

  const submit = async (event) => {
    event.preventDefault()

    // highlight-start
    try {
      await changeNumber({ variables: { name, phone } })
    } catch (error) {
      setError(error.message)
    }
    // highlight-end

    setName('')
    setPhone('')
  }

  // ...
}
```

Numeron päivittävä pyyntö _changeNumber_ tehdään nyt <i>try</i>-lohkon sisällä. Jos tietokannan validaatiot eivät mene läpi, päädytään <i>catch</i>-lohkoon, jossa asetetaan sovellukseen asianmukainen virheilmoitus käyttäen _setError_-funktiota:

![Sovellus näyttää virheilmoituksen, jos puhelinnumeron pituus on pienempi kuin 5](../../images/8/44.png)



### Välimuistin päivitys revisited

Uusien henkilöiden lisäyksen yhteydessä on siis 
[päivitettävä](/osa8/react_ja_graph_ql#valimuistin-paivitys) Apollo clientin välimuisti. Päivitys tapahtuu määrittelemällä mutaation yhteydessä option _refetchQueries_ avulla, että kysely <em>ALL\_PERSONS</em> on suoritettava uudelleen:

```js 
const PersonForm = ({ setError }) => {
  // ...

  const [createPerson] = useMutation(CREATE_PERSON, {
    onError: (error) => setError(error.message),
    refetchQueries: [{ query: ALL_PERSONS }], // highlight-line
  })

// ...
}
```

Lähestymistapa on kohtuullisen toimiva, ikävänä puolena on toki se, että päivityksen yhteydessä suoritetaan aina myös kysely. 

Ratkaisua on mahdollista optimoida hoitamalla välimuistin päivitys itse. Tämä tapahtuu määrittelemällä mutaatiolle _refetchQueries_-attribuutin sijaan sopiva [update](https://www.apollographql.com/docs/react/data/mutations/#the-update-function)-callback, jonka Apollo suorittaa mutaation päätteeksi: 


```js
const PersonForm = ({ setError }) => {
  // ...

  const [createPerson] = useMutation(CREATE_PERSON, {
    onError: (error) => setError(error.message),
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

Callback-funktio saa parametriksi viitteen välimuistiin sekä mutaation mukana palautetun datan, eli esimerkkimme tapauksessa lisätyn käyttäjän.

Koodi päivittää funktion [updateQuery](https://www.apollographql.com/docs/react/caching/cache-interaction/#using-updatequery-and-updatefragment) avulla kyselyn <em>ALL\_PERSONS</em> välimuistiin talletetun tilan lisäämällä henkilöiden joukkoon (jonka se saa parametrinsa välityksellä) mutaation lisäämän henkilön.

On myös olemassa tilanteita, joissa ainoa järkevä tapa saada välimuisti pidettyä ajantasaisena on _update_-callbackillä tehtävä päivitys. 

Tarvittaessa välimuisti on mahdollista kytkeä pois päältä joko koko sovelluksesta tai yksittäisiltä kyselyiltä määrittelemällä välimuistin käyttöä kontrolloivalle [fetchPolicy](https://www.apollographql.com/docs/react/data/queries#setting-a-fetch-policy):lle arvo <em>no-cache</em>. 

Välimuistin kanssa kannattaa olla tarkkana. Välimuistissa oleva epäajantasainen data voi aiheuttaa vaikeasti havaittavia bugeja. Kuten tunnettua, välimuistin ajantasalla pitäminen on erittäin haastavaa. Koodareiden joukossa kulkevan kansanviisauden mukaan 

> <i>There are only two hard things in Computer Science: cache invalidation and naming things.</i> Katso lisää [täältä](https://www.google.com/search?q=two+hard+things+in+Computer+Science&oq=two+hard+things+in+Computer+Science).


Sovelluksen tämän vaiheen koodi [GitHubissa](https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-5), branchissa <i>part8-5</i>.

</div>

<div class="tasks">

### Tehtävät 8.17.-8.22.

#### 8.17 Kirjojen lista

Backendin muutosten jälkeen kirjojen lista ei enää toimi. Korjaa se.

#### 8.18 Kirjautuminen

Kirjojen lisäys ja kirjailijan syntymävuoden muutos eivät toimi, sillä ne edellyttävät kirjautumista. 

Toteuta sovellukseesi kirjautuminen ja korjaa mutaatiot.

Sovelluksesi ei ole pakko käsitellä validointivirheitä järkevästi.

Voit päättää itse miltä kirjautuminen näyttää käyttöliittymässä. Eräs mahdollinen ratkaisu on tehdä kirjautumislomakkeesta erillinen näkymä jonne pääsee sovelluksen navigaatiomenusta:

![](../../images/8/26.png)

Kirjatumislomake

![](../../images/8/27.png)

Kun käyttäjä on kirjautuneena, muutetaan navigaatio näyttämään ne toiminnot, jotka ovat vain kirjautuneen käytettävissä

![](../../images/8/28.png)

#### 8.19 Genren kirjat

Laajenna sovellustasi siten, että kirjojen näkymästä voidaan rajata näytettävä kirjalista ainoastaan niihin, jotka kuuluvat valittuun genreen. Toteutuksesi voi näyttää seuraavalta:

![](../../images/8/30.png)

#### 8.20 Lempigenren kirjat

Tee sovellukseen näkymä, joka näyttää kirjautuneelle käyttäjälle käyttäjän lempigenreen kuuluvat kirjat.

![](../../images/8/29.png)

#### 8.21 Genren kirjat GraphQL:llä

Tehtävässä 8.19 toteutetun tietyn genren kirjoihin rajoittaminen oli mahdollista tehdä kokonaan React-sovelluksen puolella. Jos toteutit rajauksen frontendin koodissa, muuta toteutustasi siten, että haet näytettävät kirjat GraphQL-kyselyillä. Jos teit jo rajauksen GraphQL:llä, ei sinun tarvitse tehdä mitään.

Tämä **tehtävä on haastava** ja niin kurssin tässä vaiheessa jo kuuluukin olla.

#### 8.22 Välimuistin ajantasaisuus

Jos haet tietyn genren kirjat GraphQL:llä eli teit edellisen tehtävän, varmista jollain tavalla se, että kirjojen näkymä säilyy ajantasaisena. Eli kun lisäät uuden kirjan, päivittyy se kirjalistalle **viimeistään** siinä vaiheessa kun painat jotain genrevalintanappia. Ilman uuden genrevalinnan tekemistä, ei näkymän ole pakko päivittyä. 

</div>
