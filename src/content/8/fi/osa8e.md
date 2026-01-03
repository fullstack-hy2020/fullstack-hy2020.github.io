---
mainImage: ../../../images/part-8.svg
part: 8
letter: e
lang: fi
---

<div class="content">

Osa lähestyy loppuaan. Katsotaan lopuksi vielä muutamaa GraphQL:ään liittyvää asiaa.

### Fragmentit

GraphQL:ssä on suhteellisen yleistä, että eri kyselyt palauttavat samanlaisia vastauksia. Esim. puhelinluettelossa yhden henkilön hakeva kysely

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

ja kaikki henkilöt hakeva kysely

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

palauttavat molemmat henkilöitä. Valitessaan palautettavia kenttiä, molemmat kyselyt joutuvat määrittelemään täsmälleen samat kentät. 

Tällaisia tilanteita voidaan yksinkertaistaa [fragmenttien](https://graphql.org/learn/queries/#fragments) avulla. Kaikki henkilön tiedot valitseva fragmentti näyttää seuraavalta:

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

Kyselyt voidaan nyt tehdä fragmenttien avulla kompaktimmassa muodossa:

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

Fragmentteja <i><strong>ei määritellä</strong></i> GraphQL:n skeemassa, vaan kyselyn tekevän clientin puolella. Fragmenttien tulee olla määriteltynä siinä vaiheessa kun client käyttää kyselyssään niitä. 

Voisimme periaatteessa määritellä fragmentin jokaisen kyselyn yhteydessä seuraavasti:

```js
export const FIND_PERSON = gql`
  query findPersonByName($nameToSearch: String!) {
    findPerson(name: $nameToSearch) {
      ...PersonDetails
    }
  }

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

Huomattavasti järkevämpää on kuitenkin määritellä fragmentti kertaalleen ja sijoittaa se muuttujaan. Lisätään tiedoston <i>queries.js</i> alkuun fragmentin määrittely:

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

Nyt fragmentti voidaan upottaa kaikkiin sitä tarvitseviin kyselyihin ja mutaatioihin "dollariaaltosulku"-operaatiolla:

```js
export const FIND_PERSON = gql`
  query findPersonByName($nameToSearch: String!) {
    findPerson(name: $nameToSearch) {
      ...PersonDetails
    }
  }

  ${PERSON_DETAILS}
`
```

Nyt siis *PERSON_DETAILS*-muuttujassa oleva template literal sijoitetaan osaksi *FIND_PERSON* -template literalia. Lopputulos vastaa käytännössä täysin aiempaa esimerkkiä, jossa fragmentti määriteltiin suoraan kyselyn yhteydessä.

### Subscriptiot eli tilaukset

GraphQL tarjoaa query- ja mutation-tyyppien lisäksi kolmannenkin operaatiotyypin, [subscriptionin](https://www.apollographql.com/docs/react/data/subscriptions/), jonka avulla clientit voivat <i>tilata</i> palvelimelta tiedotuksia palvelimella tapahtuneista muutoksista.

Subscriptionit poikkeavatkin radikaalisti kaikesta, mitä kurssilla on tähän mennessä nähty. Toistaiseksi kaikki interaktio on koostunut selaimessa olevan React-sovelluksen palvelimelle tekemistä HTTP-pyynnöistä. Myös GraphQL:n queryt ja mutaatiot on hoidettu näin. Subscriptionien myötä tilanne kääntyy päinvastaiseksi. Sen jälkeen kun selaimessa oleva sovellus on tehnyt tilauksen muutostiedoista, alkaa selain kuunnella palvelinta. Muutosten tullessa palvelin lähettää muutostiedon <i>kaikille sitä kuunteleville</i> selaimille.

Teknisesti ottaen HTTP-protokolla ei taivu hyvin palvelimelta selaimeen päin tapahtuvaan kommunikaatioon. Konepellin alla Apollo käyttääkin [WebSocketeja](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) hoitamaan tilauksista aiheutuvan kommunikaation.

### expressMiddleware

Apollo Server ei versiosta 3.0 alkaen enää ole tarjonnut suoraa tukea subscriptiolle. Joudummekin tekemään joukon muutoksia backendin koodiin, jotta saamme subscriptionit toimimaan. 

Olemme toistaiseksi käynnistäneet sovelluksen helppokäyttöisellä funktiolla [startStandaloneServer](https://www.apollographql.com/docs/apollo-server/api/standalone/#startstandaloneserver), jonka ansiosta sovellusta ei ole tarvinnut konfiguroida juuri ollenkaan:

```js
const { startStandaloneServer } = require('@apollo/server/standalone')

// ...

const startServer = (port) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  })

  startStandaloneServer(server, {
    listen: { port },
    context: async ({ req }) => {
      // ...
    },
  }).then(({ url }) => {
    console.log(`Server ready at ${url}`)
  })
}
```

startStandaloneServer ei kuitenkaan mahdollista subscriptioiden lisäämistä sovellukseen, joten siirrytään järeämmän [expressMiddleware](https://www.apollographql.com/docs/apollo-server/api/express-middleware/) funktion käyttöön. Kuten funktion nimi jo vihjaa, kyseessä on Expressin middleware, eli sovellukseen on konfiguroitava myös Express jonka middlewarena GraphQL-server tulee toimimaan.

Asennetaan Express ja Apollo Serverin integraatiopaketti:

```bash
npm install express cors @as-integrations/express5
```

ja muutetaan tiedosto <i>server.js</i> seuraavaan muotoon:

```js
const { ApolloServer } = require('@apollo/server')
// highlight-start
const {
  ApolloServerPluginDrainHttpServer,
} = require('@apollo/server/plugin/drainHttpServer')
const { expressMiddleware } = require('@as-integrations/express5')
const cors = require('cors')
const express = require('express')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const http = require('http')
// highlight-end
const jwt = require('jsonwebtoken')

const resolvers = require('./resolvers')
const typeDefs = require('./schema')
const User = require('./models/user')

const getUserFromAuthHeader = async (auth) => {
  if (!auth || !auth.startsWith('Bearer ')) {
    return null
  }

  const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
  return User.findById(decodedToken.id).populate('friends')
}

// highlight-start
const startServer = async (port) => {
  const app = express()
  const httpServer = http.createServer(app)
 
  const server = new ApolloServer({
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  })
 
  await server.start()
 
  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req.headers.authorization
        const currentUser = await getUserFromAuthHeader(auth)
        return { currentUser }
      },
    }),
  )
 
  httpServer.listen(port, () =>
    console.log(`Server is now running on http://localhost:${port}`),
  )
}
// highlight-end

module.exports = startServer
```

Muuttujaan _server_ sijoitettu GraphQL-palvelin on nyt kytketty kuuntelemaan palvelimen juureen, eli reitille _/_ tulevia pyyntöjä _expressMiddleware_-olion avulla. Kontekstiin asetetaan jo aiemmin määrittelemämme funktion avulla tieto kirjautuneesta käyttäjästä. Koska kyse on Express-palvelimesta, tarvitaan myös middlewaret express-json sekä cors, jotta pyynnöissä mukana oleva data parsitaan oikein ja jotta CORS-ongelmia ei ilmaannu.

GraphQL-palvelin on käynnistettävä ennen kuin Express-sovellus voi alkaa kuuntelemaan määriteltyä porttia, joten _startServer_-funktiosta on tehty <i>async-funktio</i>, jotta GraphQL-palvelimen käynnistymisen odottaminen on mahdollista:

```js
await server.start()
```

GraphQL-palvelimen konfiguroinnin yhteyteen on lisätty dokumentaatioiden suositusten mukaan [ApolloServerPluginDrainHttpServer](https://www.apollographql.com/docs/apollo-server/api/plugin/drain-http-server):

```js
  const server = new ApolloServer({
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })], // highlight-line
  })
```

Kyseinen plugin huolehtii siitä, että palvelin ajetaan alas siististi, kun palvelimen suoritus lopetetaan. Esimerkiksi käsittelyssä olevat pyynnöt voidaan sen ansiosta käsitellä loppuun, client-yhteydet suljettaan, jotta ne eivät jää roikkumaan.

Backendin tämänhetkinen koodi on kokonaisuudessaan [GitHubissa](https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-6), branchissa <i>part8-6</i>.

### Tilaukset palvelimella

Toteutetaan nyt sovellukseemme subscriptiot, joiden avulla palvelimelta on mahdollista tilata tieto puhelinluetteloon lisätyistä henkilöistä.

Skeemaan tarvitaan seuraava lisäys:

```js
type Subscription {
  personAdded: Person!
}    
```

Eli kun uusi henkilö luodaan, palautetaan henkilön tiedot kaikille tilaajille.

Asennetaan tarvittavat kirjastot:

```
npm install graphql-ws ws @graphql-tools/schema
```

Tiedosto <i>server.js</i> muuttuu seuraavasti:

```js
// highlight-start
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/use/ws')
// highlight-end

// ...

const startServer = async (port) => {
  const app = express()
  const httpServer = http.createServer(app)

  // highlight-start
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
  })
 
  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const serverCleanup = useServer({ schema }, wsServer)
  // highlight-end

  const server = new ApolloServer({
    // highlight-start
    schema, 
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          }
        },
      },
    ],
    // highlight-end
  })

  await server.start()

  // ...
}
```

GraphQL:n Queryt ja mutaatiot hoidetaan HTTP-protokollaa käyttäen. Tilausten osalta kommunikaatio tapahtuu [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)-yhteydellä.

Yllä oleva konfiguraatio luo palvelimeen HTTP-pyyntöjen kuuntelun rinnalle WebSocketeja kuuntelevan palvelun, jonka se sitoo palvelimen GraphQL-skeemaan. Määrittelyn toinen osa rekisteröi funktion, joka sulkee WebSocket-yhteyden palvelimen sulkemisen yhteydessä. Jos olet kiinnostunut tarkemmin konfiguraatioista, Apollon [dokumentaatio](https://www.apollographql.com/docs/apollo-server/data/subscriptions) selittää suhteellisen tarkasti mitä kukin koodirivi tekee.

Toisin kuin HTTP:n yhteydessä, WebSocketteja käyttäessä myös palvelin voi olla datan lähettämisessä aloitteellinen osapuoli. Näin ollen WebSocketit sopivat hyvin GraphQL:n tilauksiin, missä palvelimen on pystyttävä kertomaan kaikille tietyn tilauksen tehneille tilausta vastaavan tapahtuman (esim. henkilön luominen) tapahtumisesta.


Määritellylle tilaukselle _personAdded_ tarvitaan resolveri. Myös lisäyksen tekevää resolveria _addPerson_ on muutettava siten, että uuden henkilön lisäys aiheuttaa ilmoituksen tilauksen tehneille.

Asennetaan ensin [publish-subscribe](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern)-toiminnallisuuden tarjoava kirjasto:

```
npm install graphql-subscriptions
```

Muutokset tiedostoon <i>resolvers.js</i> ovat seuraavassa:

```js
const { GraphQLError } = require('graphql')
const { PubSub } = require('graphql-subscriptions') // highlight-line
const jwt = require('jsonwebtoken')

const Person = require('./models/person')
const User = require('./models/user')

const pubsub = new PubSub() // highlight-line

const resolvers = {
  // ...
  Mutation: {
    addPerson: async (root, args, context) => {
        const currentUser = context.currentUser

        if (!currentUser) {
          throw new GraphQLError('not authenticated', {
            extensions: {
              code: 'UNAUTHENTICATED',
            },
          })
        }

        const nameExists = await Person.exists({ name: args.name })

        if (nameExists) {
          throw new GraphQLError(`Name must be unique: ${args.name}`, {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
            },
          })
        }

      const person = new Person({ ...args })

      try {
        await person.save()
        currentUser.friends = currentUser.friends.concat(person)
        await currentUser.save()
      } catch (error) {
        throw new GraphQLError(`Saving person failed: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        })
      }


      pubsub.publish('PERSON_ADDED', { personAdded: person })  // highlight-line

      return person
    },
    // ...
  },
  // highlight-start
  Subscription: {
    personAdded: {
      subscribe: () => pubsub.asyncIterableIterator('PERSON_ADDED')
    },
  },
  // highlight-end
}
```

Tilausten yhteydessä kommunikaatio tapahtuu publish-subscribe-periaatteella käyttäen olioa [PubSub](https://www.apollographql.com/docs/apollo-server/data/subscriptions#the-pubsub-class).

Koodia on vähän mutta konepellin alla tapahtuu paljon. Tilauksen _personAdded_ resolverissa palvelin rekisteröi ja tallettaa muistiin tiedon kaikista sille tilauksen tehneistä clienteista. Nämä tallentuvat seuraavan koodinpätkän ansiosta nimellä <i>PERSON\_ADDED</i> varustettuun ["iteraattoriolioon"](https://www.apollographql.com/docs/apollo-server/data/subscriptions/#listening-for-events):

```js
Subscription: {
  personAdded: {
    subscribe: () => pubsub.asyncIterableIterator('PERSON_ADDED')
  },
},
```

Iteraattorin nimi on mielivaltainen merkkijono, joka on nyt valittu kuvaavalla tavalla mutta kirjoitettu konvention mukaan isoin kirjaimin.

Uuden henkilön lisäys <i>julkaisee</i> tiedon lisäyksestä kaikille muutokset tilanneille PubSubin metodilla _publish_:

```js
pubsub.publish('PERSON_ADDED', { personAdded: person }) 
```

Koodirivin suoritus saa siis aikaan sen, että kaikille iteraattoriin <i>PERSON\_ADDED</i> rekisteröidyille clienteille lähtee WebSocketin avulla tieto luodusta käyttäjästä.

Tilauksia on mahdollista testata Apollo Explorerin avulla seuraavasti:

![](../../images/8/31x.png)

Tilaus siis on

```js
subscription Subscription {
  personAdded {
    phone
    name
  }
}
```

Kun tilauksen suorittavaa sinistä PersonAdded-painiketta painetaan, jää Explorer odottamaan tilaukseen tulevia vastauksia. Aina kun sovellukseen lisätään uusia henkilöitä, tulee tieto niistä Explorerin oikeaan reunaan.

Tilausten toteuttamiseen liittyy paljon erilaista konfiguraatiota. Tämän kurssin muutamasta tehtävästä selviät hyvin välittämättä kaikista yksityiskohdista. Jos olet toteuttamassa tilauksia todelliseen käyttöön tulevaan sovellukseen, kannattaa ehdottomasti lukea Apollon
[tilauksia käsittelevä dokumentaatio](https://www.apollographql.com/docs/apollo-server/data/subscriptions).

Backendin koodi on kokonaisuudessaan [GitHubissa](https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-7), branchissa <i>part8-7</i>.

### Tilaukset clientissä

Jotta saamme tilaukset käyttöön React-sovelluksessa, tarvitaan jonkin verran muutoksia erityisesti [konfiguraatioiden osalta](https://www.apollographql.com/docs/react/data/subscriptions/).

Lisätään frontendin riippuvuudeksi kirjasto <i>graphql-ws</i>, joka mahdollistaa <i>WebSocket</i>-yhteydet GraphQL:n tilauksia varten:

```bash
npm install graphql-ws
```

Tiedostossa <i>main.jsx</i> olevat konfiguraatiot on muokattava seuraavaan muotoon:

```js
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import {
  ApolloClient,
  ApolloLink, // highlight-line
  HttpLink,
  InMemoryCache,
} from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'
import { SetContextLink } from '@apollo/client/link/context'
// highlight-start
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'
// highlight-end

const authLink = new SetContextLink(({ headers }) => {
  const token = localStorage.getItem('phonebook-user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    },
  }
})

const httpLink = new HttpLink({ uri: 'http://localhost:4000' })

// highlight-start
const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:4000',
  }),
)
// highlight-end

// highlight-start
const splitLink = ApolloLink.split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  authLink.concat(httpLink),
)
// highlight-end

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink, // highlight-line
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>,
)
```

Uusi konfiguraatio johtuu siitä, että sovelluksella tulee nyt olla HTTP-yhteyden lisäksi websocket-yhteys GraphQL-palvelimelle:

```js
const httpLink = new HttpLink({ uri: 'http://localhost:4000' })

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:4000',
  }),
)
```

Muokataan sitten ohjelmaa siten, että se tilaa tiedon uusista henkilöistä palvelimelta. Lisätään tiedostoon <i>queries.js</i> tilauksen määrittelevä koodi:

```js
export const PERSON_ADDED = gql`
  subscription {
    personAdded {
      ...PersonDetails
    }
  }

  ${PERSON_DETAILS}
`
```

Tilaukset tehdään hook-funktion [useSubscription](https://www.apollographql.com/docs/react/api/react/hooks/#usesubscription) avulla. Tehdään tilaus komponentissa <i>App</i>:

```js
import {
  useApolloClient,
  useQuery,
  useSubscription, // highlight-line
} from '@apollo/client/react'
import { useState } from 'react'
import LoginForm from './components/LoginForm'
import Notify from './components/Notify'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import PhoneForm from './components/PhoneForm'
import { ALL_PERSONS, PERSON_ADDED } from './queries' // highlight-line

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem('phonebook-user-token'),
  )
  const [errorMessage, setErrorMessage] = useState(null)
  const result = useQuery(ALL_PERSONS)
  const client = useApolloClient()

  // highlight-start
  useSubscription(PERSON_ADDED, {
    onData: ({ data }) => {
      console.log(data)
    },
  })
  // highlight-end

  if (result.loading) {
    return <div>loading...</div>
  }

  // ...
}
```

Kun puhelinluetteloon nyt lisätään henkilöitä, tapahtuupa se mistä tahansa, tulostuvat clientin konsoliin lisätyn henkilön tiedot:

![](../../images/8/32e.png)

Kun luetteloon lisätään uusi henkilö, palvelin lähettää siitä tiedot clientille, ja <i>useSubscription</i>-hookin _onData_-attribuutin arvoksi määriteltyä callback-funktiota kutsutaan antaen sille parametriksi palvelimelle lisätty henkilö.

Voimme näyttää käyttäjälle ilmoituksen uuden henkilön lisäämisen yhteydessä seuraavasti:

```js
const App = () => {
  // ...

  useSubscription(PERSON_ADDED, {
    onData: ({ data }) => {
      const addedPerson = data.data.personAdded // highlight-line
      notify(`${addedPerson.name} added`) // highlight-line
    }
  })

  // ...
}
```



Laajennetaan ratkaisua vielä siten, että uuden henkilön tietojen saapuessa henkilö lisätään Apollon välimuistiin, jolloin se renderöityy heti ruudulle:

```js
const App = () => {
  // ...

  useSubscription(PERSON_ADDED, {
    onData: ({ data }) => {
      const addedPerson = data.data.personAdded
      notify(`${addedPerson.name} added`)

// highlight-start
      client.cache.updateQuery({ query: ALL_PERSONS }, ({ allPersons }) => {
        return {
          allPersons: allPersons.concat(addedPerson),
        }
      })
      // highlight-end
    }
  })

  // ...
}
```
Nyt esimerkiksi Apollo Studio Explorerin kautta lisätty henkilö renderöityy saman tien sovelluksen näkymään.  

Ratkaisussa on kuitenkin pieni ongelma. Kun uusi henkilö lisätään sovelluksen lomakkeen kautta, lisätty henkilö päätyy välimuistiin kahdesti, sillä sekä _useSubscription_-hook että komponentti PersonForm lisävät uuden henkilön välimuistiin. Tämän seurauksena lisätty henkilö renderöidään ruudulle kahteen kertaan.

Eräs ratkaisu ongelmaan voisi olla se, että välimuistin päivitys tehtäisiin ainoastaan <i>useSucscription</i>-hookissa. Tämä ei ole kuitenkaan suositeltavaa. On hyvän käytännön mukaista, että käyttäjä näkee sovelluksessa tekemänsä muutokset välittömästi. Subscriptionin tekemä välimuistin päivitys voi tapahtua viiveellä eikä siihen voi luottaa täysin. Pitäydytään siksi ratkaisussa, jossa välimuistia päivitetään sekä _useSucscription_-hookissa että _PersonForm_-komponentissa.

Ratkaistaan ongelma varmistamalla, että henkilö lisätään välimuistiin vain jos sitä ei ole jo lisätty sinne. Eriytetään samalla välimuistin päivitysoperaatio omaan apufunktioonsa tiedostoon <i>utils/apolloCache.js</i>:

```js
import { ALL_PERSONS } from '../queries'

export const addPersonToCache = (cache, personToAdd) => {
  cache.updateQuery({ query: ALL_PERSONS }, ({ allPersons }) => {
    const personExists = allPersons.some(
      (person) => person.id === personToAdd.id,
    )

    if (personExists) {
      return { allPersons }
    }

    return {
      allPersons: allPersons.concat(personToAdd),
    }
  })
}
```

Apufunktio _addPersonToCache_ päivittää välimuistia tutulla _cache.updateQuery_-metodilla. Välimuistin päivityslogiikassa tarkistetaan ensin, onko henkilö jo lisätty välimuistiin. Lisättävää henkilöä etsitään välimuistissa olevien henkilöiden joukosta käyttäen JavaScriptin taulukoiden metodia _some_:

```js
  const personExists = allPersons.some(
    (person) => person.id === personToAdd.id,
  )
```

_some_ on metodi, joka etsii sopivaa oliota kokoelmasta annetun ehdon perusteella. Se palauttaa totuusarvon, joka kertoo, löytyikö sopivaa alkiota vai ei. Tapauksessamme metodi siis palauttaa _True_, jos välimuistista löytyy henkilö kyseisellä <i>id</i>:llä, ja muulloin palautetaan _False_.

Jos henkilö löytyy jo välimuistista, välimuistin sisältö palautetaan sellaisenaan eikä henkilöä lisätä uudestaan. Muussa tapauksessa palautetaan välimuistin sisältö, johon on lisätty _concat_-metodilla uusi henkilö:

```js
  if (personExists) {
    return { allPersons }
  }

  return {
    allPersons: allPersons.concat(personToAdd),
  }
```

Muutetaan _App_-komponentin _useSubscription_-hookia niin, että se hoitaa välimuistin päivityksen tekemällämme _addPersonToCache_-apufunktiolla:

```js
import { addPersonToCache } from './utils/apolloCache' // highlight-line

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem('phonebook-user-token'),
  )
  const [errorMessage, setErrorMessage] = useState(null)
  const result = useQuery(ALL_PERSONS)
  const client = useApolloClient()

  useSubscription(PERSON_ADDED, {
    onData: ({ data }) => {
      const addedPerson = data.data.personAdded
      notify(`${addedPerson.name} added`)
      addPersonToCache(client.cache, addedPerson) // highlight-line
    },
  })

  // ...
}
```

ja hyödynnetään funktiota myös uuden henkilön lisäyksen yhteydessä tapahtuvassa välimuistin päivityksessä:

```js
import { addPersonToCache } from '../utils/apolloCache' // highlight-line

const PersonForm = ({ setError }) => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')

  const [createPerson] = useMutation(CREATE_PERSON, {
    onError: (error) => setError(error.message),
    update: (cache, response) => {
      // highlight-start
      const addedPerson = response.data.addPerson
      addPersonToCache(cache, addedPerson)
      // highlight-end
    },
  })

  // ...
}
```

Nyt välimuistin päivitys toimii oikein kaikissa tilanteissa, eli uusi henkilö lisätään välimuistiin vain jos sitä ei ole jo lisätty sinne.

Clientin lopullinen koodi [GitHubissa](https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-6), branchissa <i>part8-6</i>.

### n+1-ongelma

Laajennetaan vielä backendia hieman. Muutetaan skeemaa siten, että tyypille <i>Person</i> tulee kenttä _friendOf_, joka kertoo kenen kaikkien käyttäjien tuttavalistalla ko henkilö on.

```js
type Person {
  name: String!
  phone: String
  address: Address!
  friendOf: [User!]! // highlight-line
  id: ID!
}
```

Sovellukseen tulisi siis saada tuki esim. seuraavalle kyselylle:

```js
query {
  findPerson(name: "Leevi Hellas") {
    friendOf {
      username
    }
  }
}
```

Koska _friendOf_ ei ole tietokannassa olevien <i>Person</i>-olioiden sarake, on sille tehtävä oma resolveri, joka osaa selvittää asian. Tehdään aluksi tyhjän listan palauttava resolveri:

```js
Person: {
  address: ({ street, city }) => {
    return {
      street,
      city,
    }
  },
  // highlight-start
  friendOf: async (root) => {
    return []
  }
  // highlight-end
},
```

Resolverin parametrina _root_ on se henkilöolio, jonka tuttavalista on selvityksen alla, eli etsimme olioista _User_ ne, joiden _friends_-listalle sisältyy root._id:

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

Sovellus toimii nyt. 

Voimme samantien tehdä monimutkaisempiakin kyselyitä. On mahdollista selvittää esim. kaikkien henkilöiden tuttavat:

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

Sovelluksessa on nyt kuitenkin yksi ongelma, tietokantakyselyjä tehdään kohtuuttoman paljon. Lisätään resolverien tietokantakyselyn tekeviin kohtiin konsolitulostus:

```js
allPersons: async (root, args) => {
  console.log('Person.find') // highlight-line
  if (!args.phone) {
    return Person.find({})
  }

  return Person.find({ phone: { $exists: args.phone === 'YES' } })
}
```

```js
friendOf: async (root) => {
  console.log('User.find') // highlight-line
  const friends = await User.find({
    friends: {
      $in: [root._id],
    },
  })

  return friends
}
```

Huomaamme, että jos tietokannassa on viisi henkilöä, aiemmin mainittu _allPersons_-kysely aiheuttaa seuraavat tietokantakyselyt: 

```
Person.find
User.find
User.find
User.find
User.find
User.find
```

Eli vaikka pääasiallisesti tehdään ainoastaan yksi kysely, joka hakee kaikki henkilöt, aiheuttaa jokainen henkilö yhden kyselyn omassa resolverissaan.

Kyseessä on ilmentymä kuuluisasta [n+1-ongelmasta](https://www.google.com/search?q=n%2B1+problem), joka ilmenee aika ajoin eri yhteyksissä, välillä salakavalastikin sovelluskehittäjän huomaamatta aluksi mitään.

Sopiva ratkaisutapa n+1-ongelmaan riippuu tilanteesta. Usein se edellyttää jonkinlaisen liitoskyselyn tekemistä usean yksittäisen kyselyn sijaan.

Tilanteessamme helpoimman ratkaisun toisi se, että tallettaisimme _Person_-olioihin viitteet niistä käyttäjistä kenen ystävälistalla henkilö on:

```js
const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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
    minlength: 3
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

Tällöin voisimme tehdä "liitoskyselyn", eli hakiessamme _Person_-oliot, voimme populoida niiden _friendOf_-kentät:

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

Muutoksen jälkeen erilliselle _friendOf_-kentän resolverille ei enää olisi tarvetta.

Kaikkien henkilöiden kysely <i>ei aiheuta</i> n+1-ongelmaa, jos kyselyssä pyydetään esim. ainoastaan nimi ja puhelinnumero:

```js
query {
  allPersons {
    name
    phone
  }
}
```

Jos kyselyä _allPersons_ muokattaisiin tekemään liitoskysely sen varalta, että se aiheuttaa välillä n+1-ongelman, tulisi kyselystä hieman raskaampi niissäkin tapauksissa, joissa henkilöihin liittyviä käyttäjiä ei tarvita. 

Käyttämällä resolverifunktioiden [neljättä parametria](https://www.apollographql.com/docs/apollo-server/data/data/#resolver-type-signature) olisi kyselyn toteutusta mahdollista optimoida vieläkin pidemmälle. Neljännen parametrin avulla on mahdollista tarkastella itse kyselyä, ja näin liitoskysely voitaisiin tehdä ainoastaan niissä tapauksissa, joissa on n+1-ongelman uhka. 

Tämänkaltaiseen optimointiin ei toki kannata lähteä ennen kun on varmaa, että se todellakin kannattaa. 

[Donald Knuthin sanoin](https://en.wikiquote.org/wiki/Donald_Knuth):

> <i>Programmers waste enormous amounts of time thinking about, or worrying about, the speed of noncritical parts of their programs, and these attempts at efficiency actually have a strong negative impact when debugging and maintenance are considered. We should forget about small efficiencies, say about 97% of the time: <strong>premature optimization is the root of all evil.</strong></i>

Erään varteenotettavan ratkaisun monien muiden seikkojen lisäksi n+1-ongelmaan tarjoaa 
Facebookin kehittämä [dataloader](https://github.com/facebook/dataloader)-kirjasto, dataloaderin käytöstä Apollo serverin kanssa [täällä](https://www.robinwieruch.de/graphql-apollo-server-tutorial/#graphql-server-data-loader-caching-batching) ja [täällä](http://www.petecorey.com/blog/2017/08/14/batching-graphql-queries-with-dataloader/).

### Loppusanat

Tässä osassa rakentamamme sovellus ei ole optimaalisella tavalla strukturoitu. Teimme pientä siivousta siirtämällä skeeman ja resolverit omiin tiedostoihin, mutta parantamisen varaa jäi edelleen paljon. Esimerkkejä GraphQL-sovellusten parempaan strukturointiin löytyy internetistä, esim. serveriin
[täältä](https://www.apollographql.com/blog/modularizing-your-graphql-schema-code) ja clientiin [täältä](https://medium.com/@peterpme/thoughts-on-structuring-your-apollo-queries-mutations-939ba4746cd8).

GraphQL on jo melko iäkäs teknologia: se on ollut Facebookin sisäisessä käytössä jo vuodesta 2012 lähtien, joten teknologian voi todeta olevan "battle tested". Facebook julkaisi GraphQL:n vuonna 2015 ja se on sittemmin vakiinnuttanut asemansa. REST:in [kuolemaakin](https://www.radiofreerabbit.com/podcast/52-is-2018-the-year-graphql-kills-rest) ennusteltiin ennen 2020-lukua, mutta näin ei ole kuitenkaan käynyt. REST on edelleen laajasti käytetty ja toimii yhä erinomaisesti monissa tapauksissa, ja GraphQL tuskin syrjäyttää koskaan RESTiä. GraphQL:stä on kuitenkin tullut vaihtoehtoinen tapa rakentaa rajapintoja, ja se on ehdottomasti tutustumisen arvoinen vaihtoehto.

</div>

<div class="tasks">

### Tehtävät 8.23.-8.26.

#### 8.23: Subscriptionit palvelin

Tee palvelimelle toteutus subscriptiolle _bookAdded_, joka palauttaa tilaajilleen lisättyjen kirjojen tiedot.

#### 8.24: Subscriptionit client, osa 1

Ota clientillä käyttöön subscriptiot ja tilaa _bookAdded_. Uusien kirjojen tullessa anna ilmoitus käyttäjälle. Mikä tahansa menetelmä käy, voit käyttää esim. funktiota [window.alert](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert).

#### 8.25: Subscriptionit client, osa 2

Pidä sovelluksen käyttöliittymä kirjojen listan osalta ajantasaisena (kirjailijoiden listan ajantasaisena pitäminen on vapaaehtoista), kun palvelin tiedottaa uusista kirjoista.

#### 8.26: n+1

Ratkaise haluamallasi menetelmällä seuraavaa kyselyä vaivaava n+1-ongelma:

```js
query {
  allAuthors {
    name 
    bookCount
  }
}
```

### Tehtävien palautus ja suoritusmerkinnän pyytäminen

Tämän osat palautetaan edellisistä osista poiketen [palautussovelluksessa](https://studies.cs.helsinki.fi/stats/courses/fs-graphql) omaan kurssi-instanssiinsa. Huomaa, että tarviset suoritukseen vähintään 22 tehtävää!

Jos haluat suoritusmerkinnän, merkitse kurssi suoritetuksi:

![Submissions](../../images/11/21.png)

**Huomaa**, että suoritusmerkintää ei voida kirjata, ellet ole ilmoittautunut tätä osaa vastaavaan "kurssiin palaan", katso lisätietoja ilmoittautumisesta [täältä](/osa0/yleista#osat-ja-suorittaminen).

</div>
