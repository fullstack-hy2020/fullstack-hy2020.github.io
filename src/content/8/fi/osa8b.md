---
mainImage: ../../../images/part-8.svg
part: 8
letter: b
lang: fi
---

<div class="content">

Toteutetaan seuraavaksi React-sovellus, joka käyttää toteuttamaamme GraphQL-palvelinta. Palvelimen tämänhetkinen koodi on kokonaisuudessaan [GitHubissa](https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-3), branchissa <i>part8-3</i>.

GraphQL:ää on periaatteessa mahdollista käyttää HTTP POST ‑pyyntöjen avulla. Seuraavassa esimerkki Postmanilla tehdystä kyselystä.

![](../../images/8/8x.png)

Kommunikointi tapahtuu siis osoitteeseen http://localhost:4000/graphql kohdistuvina POST-pyyntöinä, ja itse kysely lähetetään pyynnön mukana merkkijonona avaimen <i>query</i> arvona.

Voisimmekin hoitaa React-sovelluksen ja GraphQL:n kommunikoinnin Axiosilla. Tämä ei kuitenkaan ole useimmiten järkevää ja on parempi idea käyttää korkeamman tason kirjastoa, joka pystyy abstrahoimaan kommunikoinnin turhia detaljeja. Tällä hetkellä järkeviä vaihtoehtoja on kaksi: Facebookin [Relay](https://facebook.github.io/relay/) ja [Apollo Client](https://www.apollographql.com/docs/react/). Näistä Apollo on ylivoimaisesti suositumpi ja myös meidän valintamme.

### Apollo client

Luodaan uusi React-sovellus ja asennetaan sovellukseen [Apollo Clientin](https://www.apollographql.com/docs/react/get-started/#installation) vaatimat riippuvuudet.

```bash
npm install @apollo/client graphql
```

Korvataan tiedoston <i>main.jsx</i> oletussisältö seuraavalla ohjelmarungolla:

```js
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import { ApolloClient, gql, HttpLink, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:4000',
  }),
  cache: new InMemoryCache(),
})

const query = gql`
  query {
    allPersons {
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

client.query({ query }).then((response) => {
  console.log(response.data)
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

Koodi aloittaa luomalla [client](https://www.apollographql.com/docs/react/get-started/#create-a-client)-olion, jonka avulla se lähettää kyselyn palvelimelle:

```js
client.query({ query }).then((response) => {
  console.log(response.data)
})
```

Palvelimen palauttama vastaus tulostuu konsoliin:

![](../../images/8/9a.png)

Kyselyn muodostavan template literalin eteen on lisätty _gql_-tagi, joka importataan @apollo/client-paketista:

```js
import { ApolloClient, gql, HttpLink, InMemoryCache } from '@apollo/client' // highlight-line

// ...

const query = gql // highlight-line `
  query {
    allPersons {
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

Tagin ansiosta VS Coden GraphQL-lisäosa ja muut ohjelmistotyökalut tunnistavat määrittelyn GraphQL:ksi, ja esimerkiksi editorin syntaksikorostus alkaa toimia. Palvelinpuolella teimme saman asian lisäämällä template literalin eteen tyypin määrittävän kommentin, koska palvelinpuolella käytettävä @apollo/server-kirjasto ei sisällä vastaavaa _gql_-tagia.

Sovellus pystyy siis kommunikoimaan GraphQL-palvelimen kanssa olion _client_ välityksellä. Client saadaan sovelluksen kaikkien komponenttien saataville käärimällä komponentti <i>App</i> komponentin [ApolloProvider](https://www.apollographql.com/docs/react/get-started/#connect-your-client-to-react) lapseksi:

```js
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import { ApolloClient, gql, HttpLink, InMemoryCache } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react' // highlight-line

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:4000',
  }),
  cache: new InMemoryCache(),
})

// ...

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={client}> // highlight-line
      <App />
    </ApolloProvider> // highlight-line
  </StrictMode>,
)
```

### Kyselyjen tekeminen

Olemme valmiina toteuttamaan sovelluksen päänäkymän, joka listaa kaikkien henkilöiden puhelinnumerot. 

Apollo Client tarjoaa muutaman vaihtoehtoisen tavan [kyselyjen](https://www.apollographql.com/docs/react/data/queries/) tekemiselle. Tämän hetken vallitseva käytäntö on hook-funktion [useQuery](https://www.apollographql.com/docs/react/api/react/hooks/#usequery) käyttäminen.

Tehdään kysely tiedostossa <i>App.jsx</i>. Koodi näyttää seuraavalta:

```js
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'

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

Hook-funktion _useQuery_ kutsuminen suorittaa parametrina annetun kyselyn. Hookin kutsuminen palauttaa olion, jolla on [useita kenttiä](https://www.apollographql.com/docs/react/api/react/hooks/#result). Kenttä <i>loading</i> on arvoltaan tosi, jos kyselyyn ei ole saatu vielä vastausta. Tässä tilanteessa renderöitävä koodi on 

```js
if ( result.loading ) {
  return <div>loading...</div>
}
```

Kun tulos on valmis, otetaan tuloksen kentästä <i>data</i> kyselyn <i>allPersons</i> vastaus ja renderöidään luettelossa olevat nimet ruudulle.

```js
<div>
  {result.data.allPersons.map(p => p.name).join(', ')}
</div>
```

Eriytetään henkilöiden näyttäminen omaan komponenttiinsa tiedostoon <i>src/components/Persons.jsx</i>:

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

export default Persons
```

Komponentti _App_ siis hoitaa edelleen kyselyn ja välittää tuloksen uuden komponentin renderöitäväksi:

```js
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import Persons from './components/Persons' // highlight-line

// ...

const App = () => {
  const result = useQuery(ALL_PERSONS)

  if (result.loading) {
    return <div>loading...</div>
  }

  return <Persons persons={result.data.allPersons} /> // highlight-line
}

```

### Nimetyt kyselyt ja muuttujat

Toteutetaan sovellukseen ominaisuus, jonka avulla on mahdollisuus nähdä yksittäisen henkilön osoitetiedot. Palvelimen tarjoama kysely <i>findPerson</i> sopii hyvin tarkoitukseen. 

Edellisessä luvussa tekemissämme kyselyissä parametri oli kovakoodattuna kyselyyn:

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

Kun teemme kyselyjä ohjelmallisesti, on kyselyn parametrit pystyttävä antamaan dynaamisesti. 

Tähän tarkoitukseen sopivat GraphQL:n [muuttujat](https://graphql.org/learn/queries/#variables). Muuttujia käyttääksemme on kysely myös nimettävä.

Sopiva muoto kyselylle on seuraava:

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

Kyselyn nimenä on <i>findPersonByName</i>, ja se saa yhden merkkijonomuotoisen parametrin <i>$nameToSearch</i>. 

Myös Apollo Explorer mahdollistaa muuttujia sisältävän kyselyjen tekemisen. Tällöin muuttujille on annettava arvot kohdassa <i>Variables</i>:

![](../../images/8/10x.png)

Äsken käyttämämme _useQuery_ toimii hyvin tilanteissa, joissa kysely on tarkoitus suorittaa heti komponentin renderöinnin yhteydessä. Nyt kuitenkin haluamme tehdä kyselyn vasta siinä vaiheessa kun käyttäjä haluaa nähdä jonkin henkilön tiedot, eli kysely tehdään vasta [sitä tarvittaessa](https://www.apollographql.com/docs/react/data/queries/#executing-queries-manually). 

Yksi mahdollisuus olisi käyttää tässä tilanteessa hookia [useLazyQuery](https://www.apollographql.com/docs/react/api/react/hooks/#uselazyquery) jonka avulla on mahdollista muodostaa kysely joka suoritetaan siinä vaiheessa kun käyttäjä haluaa nähdä yksittäisen henkilön tulokset.

Päädymme kuitenkin nyt siistimpään ratkaisuun hyödyntämällä _useQuery_:n optiota [skip](https://www.apollographql.com/docs/react/data/queries/#skip), jonka avulla voidaan määritellä kyselyjä, joita <i>ei suoriteta</i> jos jokin ehto on tosi. 

Muutosten jälkeen tiedosto <i>Persons.jsx</i> näyttää seuraavalta:

```js
import { useState } from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'

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

Koodi on muuttunut paljon, ja kaikki lisäykset eivät ole täysin ilmeisiä.

Jos henkilön yhteydessä olevaa nappia <i>show address</i> painetaan, asetetaan henkilön nimi tilan <i>nameToSearch</i> arvoksi:

```js
<button onClick={() => setNameToSearch(p.name)}>
  show address
</button>
```

Tämä saa aikaan sen, että komponentti renderöidään uudelleen. Renderöinnin yhteydessä suoritetaan kysely <i>FIND_PERSON</i> eli henkilön tarkempien tietojen haku <i>jos muuttujalla nameToSearch</i> on arvo:

```js
const result = useQuery(FIND_PERSON, {
  variables: { nameToSearch },
  skip: !nameToSearch, // highlight-line
})
```

Eli jos yksittäisen henkilön osoitetietoja ei haluta näkyviin on <i>nameToSearch</i> arvo null ja kyselyä ei suoriteta.

Jos tilalla <i>nameToSearch</i> on arvo ja kyselyn suoritus on valmis, renderöidään komponentin <i>Person</i> avulla yksittäisen henkilön tarkemmat tiedot:

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

Yksittäisen henkilön näkymä on seuraavanlainen:

![](../../images/8/11.png)

Yksittäisen henkilön näkymästä palataan kaikkien henkilöiden näkymään sijoittamalla tilan muuttujan _nameToSearch_ arvoksi _null_.

Sovelluksen tämänhetkinen koodi on kokonaisuudessaan [GitHubissa](https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-1), branchissa <i>part8-1</i>.

### Välimuisti ja Devtools

Kun haemme monta kertaa esim. Arto Hellaksen tiedot, huomaamme selaimen developer-konsolin välilehteä Network seuraamalla mielenkiintoisen asian: kysely backendiin tapahtuu ainoastaan tietojen ensimmäisellä katsomiskerralla. Tämän jälkeen, siitäkin huolimatta, että koodi tekee saman kyselyn uudelleen, ei kyselyä lähetetä backendille.

Apollo client tallettaa kyselyjen tulokset cacheen eli [välimuistiin](https://www.apollographql.com/docs/react/caching/overview/) ja optimoi suoritusta siten, että jos kyselyn vastaus on jo välimuistissa, ei kyselyä lähetetä ollenkaan palvelimelle.

Chromeen on mahdollista asentaa lisäosa [Apollo Client Devtools](https://chrome.google.com/webstore/detail/apollo-client-developer-t/jdkknkkbebbapilgoeccciglkfbmbnfm/related), jonka avulla voidaan tarkastella mm. välimuistin tilaa:

![](../../images/8/13x.png)

Välimuisti näyttää Arto Hellaksen osoitetiedot kyselyn <i>findPerson</i> jälkeen:

![](../../images/8/13z.png)
### Mutaatioiden tekeminen

Toteutetaan sovellukseen mahdollisuus uusien henkilöiden lisäämiseen. 

Edellisessä luvussa kovakoodasimme mutaatioiden parametrit. Tarvitsemme nyt [muuttujia](https://graphql.org/learn/queries/#variables) käyttävän version henkilön lisäävästä mutaatiosta:

```js
const CREATE_PERSON = gql`
  mutation createPerson(
    $name: String!
    $street: String!
    $city: String!
    $phone: String
  ) {
    addPerson(name: $name, street: $street, city: $city, phone: $phone) {
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

Mutaatioiden tekemiseen sopivan toiminnallisuuden tarjoaa hook-funktio [useMutation](https://www.apollographql.com/docs/react/api/react/hooks/#usemutation). 

Tehdään sovellukseen uusi komponentti <i>PersonForm</i> uuden henkilön lisämiseen. Tiedoston <i>src/components/PersonForm.jsx</i> sisältö on seuraava:

```js
import { useState } from 'react'
import { gql } from '@apollo/client'
import { useMutation } from '@apollo/client/react'

const CREATE_PERSON = gql`
  mutation createPerson(
    $name: String!
    $street: String!
    $city: String!
    $phone: String
  ) {
    addPerson(name: $name, street: $street, city: $city, phone: $phone) {
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

const PersonForm = () => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')

  const [createPerson] = useMutation(CREATE_PERSON) // highlight-line

  const submit = (event) => {
    event.preventDefault()

    // highlight-start
    createPerson({ variables: { name, phone, street, city } })
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

Lomakkeen koodi on suoraviivainen, mielenkiintoiset rivit on korostettu. Mutaation suorittava funktio saadaan luotua _useMutation_-hookin avulla. Hook palauttaa kyselyfunktion <i>taulukon</i> ensimmäisenä alkiona:

```js
const [createPerson] = useMutation(CREATE_PERSON)
```

Kyselyä tehtäessä määritellään kyselyn muuttujille arvot:

```js
createPerson({ variables: { name, phone, street, city } })
```

Otetaan <i>PersonForm</i>-komponentti käyttöön tiedostossa <i>App.jsx</i>:

```js
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import PersonForm from './components/PersonForm' // highlight-line
import Persons from './components/Persons'

// ...

const App = () => {
  const result = useQuery(ALL_PERSONS)

  if (result.loading) {
    return <div>loading...</div>
  }

  // highlight-start
  return (
    <div>
      <Persons persons={result.data.allPersons} />
      <PersonForm /> 
    </div>
  )
  // highlight-end
}

export default App
```

Lisäys kyllä toimii, mutta sovelluksen näkymä ei päivity. Syynä tälle on se, että Apollo Client ei osaa automaattisesti päivittää sovelluksen välimuistia, se sisältää edelleen ennen lisäystä olevan tilanteen. Saamme kyllä uuden käyttäjän näkyviin uudelleenlataamalla selaimen, sillä Apollon välimuisti nollautuu uudelleenlatauksen yhteydessä. Tilanteeseen on kuitenkin pakko löytää joku järkevämpi ratkaisu.

### Välimuistin päivitys

Ongelma voidaan ratkaista muutamallakin eri tavalla. Eräs tapa on määritellä kaikki henkilöt hakeva kysely [pollaamaan](https://www.apollographql.com/docs/react/data/queries/#polling) palvelinta, eli suorittamaan kysely palvelimelle toistuvasti tietyin väliajoin. 

Muutos on pieni, määritellään pollausväliksi kaksi sekuntia:

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

Yksinkertaisuuden lisäksi ratkaisun hyvä puoli on se, että aina kun joku käyttäjä lisää palvelimelle uuden henkilön, se ilmestyy pollauksen ansiosta heti kaikkien sovelluksen käyttäjien selaimeen.

Ikävänä puolena pollauksessa on tietenkin sen aiheuttama turha verkkoliikenne. Lisäksi sivu voi alkaa välkkyä, sillä komponentti renderöidään uudelleen jokaisen kyselyn päivityksen yhteydessä ja _result.loading_ hetken aikaa tosi eli näytöllä vilahtaa silmänräpäyksen ajan  <i>loading...</i>-teksti.

Toinen helppo tapa välimuistin synkronoimiseen on määritellä _useMutation_-hookin option [refetchQueries](https://www.apollographql.com/docs/react/data/refetching/) avulla, että kaikki henkilöt hakeva kysely tulee suorittaa mutaation yhteydessä uudelleen:

```js
// ...

const ALL_PERSONS = gql // highlight-line `
  query { // highlight-line
    allPersons { // highlight-line
      name // highlight-line
      phone // highlight-line
      id // highlight-line
    } // highlight-line
  } // highlight-line
` // highlight-line


const PersonForm = () => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')

  // highlight-start
  const [createPerson] = useMutation(CREATE_PERSON, {
    refetchQueries: [{ query: ALL_PERSONS }],
  })
  // highlight-end

  // ...
}
```

Edut ja haitat tällä ratkaisulla ovat melkeinpä päinvastaiset pollaukseen. Nyt verkkoliikennettä ei synny kuin tarpeen vaatiessa, eli kyselyjä ei tehdä varalta. Toisaalta jos joku muu käyttäjä päivittää palvelimen tilaa, muutokset eivät nyt siirry kaikille käyttäjille.

Jos haluat tehdä useita kyselyitä, voit välittää useita olioita refetchQueries-taulukkoon. Tällä tavalla voit päivittää sovelluksesi eri osia samanaikaisesti. Esimerkki:

```js
const [createPerson] = useMutation(CREATE_PERSON, {
  refetchQueries: [
    { query: ALL_PERSONS },
    { query: OTHER_QUERY },
    { query: ANOTHER_QUERY },
  ], // lisää niin monta kyselyä kuin tarvitset
})
```

Muitakin tapoja välimuistin tilan päivittämiseksi on, niistä lisää myöhemmin tässä osassa.

Sovellukseen on tällä hetkellä määritelty kyselyjä komponenttien koodin sekaan. Eriytetään kyselyjen määrittely omaan tiedostoonsa <i>src/queries.js</i>:

```js 
import { gql } from '@apollo/client'

export const ALL_PERSONS = gql`
  query {
    allPersons {
      name
      phone
      id
    }
  }
`

export const FIND_PERSON = gql`
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

export const CREATE_PERSON = gql`
  mutation createPerson(
    $name: String!
    $street: String!
    $city: String!
    $phone: String
  ) {
    addPerson(name: $name, street: $street, city: $city, phone: $phone) {
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

Jokainen komponentti importtaa tarvitsemansa kyselyt:

```js 
import { ALL_PERSONS } from './queries'

const App = () => {
  const result = useQuery(ALL_PERSONS)
  // ...
}
```

Sovelluksen tämänhetkinen koodi on kokonaisuudessaan [GitHubissa](https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-2), branchissa <i>part8-2</i>.

### Mutaatioiden virheiden käsittely

Jos yritämme luoda epävalidia henkilöä esimerkiksi käyttäen sovelluksessa jo olemassa olevaa nimeä, ei tapahdu mitään. Henkilöä ei lisätä sovellukseen, mutta toisaalta emme saa myöskään minkäänlaista virheilmoitusta. 

Määrittelimme aiemmin palvelimelle tarkistuksen, joka estää toisen samannimisen henkilön lisäämisen ja heittää virheen tällaisessa tilanteessa. Virhettä ei kuitenkaan käsitellä frontendissä vielä mitenkään. _useMutation_-hookin [option](https://www.apollographql.com/docs/react/api/react/hooks/#params-2) _onError_ avulla on mahdollista rekisteröidä mutaatioille virheenkäsittelijäfunktio.

Rekisteröidään mutaatiolle virheenkäsittelijä. Komponentti <i>PersonForm</i> vastaanottaa propsina funktion _setError_, jota käytetään virheestä kertovan viestin asettamiseen:

```js
const PersonForm = ({ setError }) => { // highlight-line
  // ... 

  const [ createPerson ] = useMutation(CREATE_PERSON, {
    refetchQueries: [  {query: ALL_PERSONS } ],
    onError: (error) => setError(error.message), // highlight-line
  })

  // ...
}
```

Luodaan notifikaatiolle oma komponentti tiedostoon <i>scr/components/Notify.jsx</i>:

```js
const Notify = ({ errorMessage }) => {
  if (!errorMessage) {
    return null
  }
  return (
    <div style={{ color: 'red' }}>
      {errorMessage}
    </div>
  )
}

export default Notify
```

Komponentti saa propsina mahdollisen virheviestin. Jos virheviesti on asetettu, se renderöidään näytölle.

Renderöidään virheviestin näyttävä <i>Notify</i>-komponentti tiedostossa <i>App.jsx</i>:

```js
import Notify from './components/Notify' // highlight-line

// ... 

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
```

Poikkeuksesta tiedotetaan nyt käyttäjälle yksinkertaisella notifikaatiolla.

![](../../images/8/15.png)

Sovelluksen tämänhetkinen koodi on kokonaisuudessaan [GitHubissa](https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-3), branchissa <i>part8-3</i>.

### Puhelinnumeron päivitys

Tehdään sovellukseen mahdollisuus vaihtaa henkilöiden puhelinnumeroita. Ratkaisu on lähes samanlainen kuin uuden henkilön lisäykseen käytetty.

Mutaatio edellyttää jälleen muuttujien käyttöä. Lisätään seuraava kysely tiedostoon <i>queries.js</i>:

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

Luodaan puhelinnumeron päivitystä varten sovellukseen uusi komponentti <i>PhoneForm</i> tiedostoon <i>src/components/PhoneForm.jsx</i>. Komponentti lisää sovellukseen lomakkeen, jolla voi syötää uuden puhelinnumeron haluamalleen henkilölle. Mielenkiintoiset osat koodia ovat korostettuna:

```js
import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
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

Komponentti <i>PhoneForm</i> on suoraviivainen: se kysyy lomakkeen avulla henkilön nimeä ja uutta puhelinnumeroa. Kun lomake lähetetään, kutsutaan numeron päivityksen hoitavaa funktiota _changeNumber_, joka on luotu _useMutation_-hookilla.

Otetaan uusi komponentti käyttöön tiedostossa <i>App.jsx</i>:

```js
import PhoneForm from './components/PhoneForm' // highlight-line

const App = () => {
  // ...

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <Persons persons={result.data.allPersons} />
      <PersonForm setError={notify} />
      <PhoneForm setError={notify} /> // highlight-line
    </div>
  )
}
```

Ulkoasu on karu mutta toimiva:

![](../../images/8/22a.png)

Kun numero muutetaan, päivittyy se hieman yllättäen automaattisesti komponentin <i>Persons</i> renderöimään nimien ja numeroiden listaan. Tämä johtuu siitä, että koska henkilöillä on identifioiva, tyyppiä <i>ID</i> oleva kenttä, päivittyy henkilö välimuistissa uusilla tiedoilla päivitysoperaation yhteydessä. 

Sovelluksessa on  vielä pieni ongelma. Jos yritämme vaihtaa olemattomaan nimeen liittyvän puhelinnumeron, ei mitään näytä tapahtuvan. Syynä tälle on se, että jos nimeä vastaavaa henkilöä ei löydy, vastataan kyselyyn <i>null</i>:

![](../../images/8/23ea.png)

Koska kyseessä ei ole GraphQL:n kannalta virhetilanne, ei _onError_-virheenkäsittelijän rekisteröimisestä olisi tässä tilanteessa hyötyä. Voimme kuitenkin lisätä _useMutation_-hookille _onCompleted_-takaisinkutsufunktion, jossa mahdollinen virheilmoitus voidaan generoida:

```js
const PhoneForm = ({ setError }) => { // highlight-line
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  // highlight-start
  const [changeNumber] = useMutation(EDIT_NUMBER, {
    onCompleted: (data) => {
      if (!data.editNumber) {
        setError('person not found')
      }
    }
  })
  // highlight-end

  // ...
}
```

Takaisinkutsufunktio _onCompleted_ suoritetaan aina, kun mutaatio on onnistuneesti suoritettu. Jos henkilöä ei löytynyt, eli kyselyn tulos _data.editNumber_ on _null_, asettaa komponentti propseina saamansa callback-funktion _setError_ avulla sopivan virheilmoituksen. 

Sovelluksen tämänhetkinen koodi on [GitHubissa](https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-4), branchissa <i>part8-4</i>.

### Apollo Client ja sovelluksen tila

Esimerkissämme sovelluksen tilan käsittely on siirtynyt suurimmaksi osaksi Apollo Clientin vastuulle. Tämä onkin melko tyypillinen ratkaisu GraphQL-sovelluksissa. Esimerkkimme käyttää Reactin komponenttien tilaa ainoastaan lomakkeen tilan hallintaan sekä virhetilanteesta kertovan notifikaation näyttämiseen. GraphQL:ää käytettäessä voikin olla, että ei ole enää kovin perusteltuja syitä siirtää sovelluksen tilaa ollenkaan Reduxiin. 

Apollo mahdollistaa tarvittaessa myös sovelluksen paikallisen tilan tallettamisen [Apollon välimuistiin](https://www.apollographql.com/docs/react/local-state/local-state-management/).

</div>

<div class="tasks">

### Tehtävät 8.8.-8.12.

Tehtävissä toteutetaan edellisen osan tehtävissä tehdylle backendille frontend.

Ota sovelluksesi lähtökohdaksi [tämä projekti](https://github.com/fullstack-hy2020/library-frontend).

**Huom** voit halutessasi käyttää myös [React routeria](/osa7/react_router) sovelluksen navigaation toteuttamiseen!

#### 8.8: Kirjailijoiden näkymä

Toteuta kirjailijoiden näkymä, eli näytä sivulla kaikkien kirjailijoiden tiedot esim. seuraavasti:

![](../../images/8/16.png)

#### 8.9: Kirjojen näkymä

Toteuta kirjojen näkymä, eli näytä sivulla kirjoista muut tiedot paitsi genret.

![](../../images/8/17.png)

#### 8.10: Kirjan lisäys

Toteuta sovellukseen mahdollisuus uusien kirjojen lisäämiseen.

![](../../images/8/18.png)

Huolehdi siitä, että kirjailijoiden ja kirjojen näkymä pysyy ajantasaisena lisäyksen jälkeen.

Huom: jos törmäät ongelmiin kyselyjä tai mutaatioita tehdessä, kannattaa katsoa developer consolesta mitä palvelin vastaa

![](../../images/8/42x.png)

Chromen [Apollo Client Devtools](https://chrome.google.com/webstore/detail/apollo-client-developer-t/jdkknkkbebbapilgoeccciglkfbmbnfm/related)-lisäosa voi olla tilanteen selvittämisessä erittäin hyödyllinen.

#### 8.11: Kirjailijan syntymävuosi

Tee sovellukseen mahdollisuus asettaa kirjailijalle syntymävuosi. Voit tehdä syntymävuoden asettamista varten oman näkymän tai sijoittaa sen kirjailijat näyttävälle sivulle:

![](../../images/8/20.png)

Huolehdi siitä, että kirjailijoiden näkymä pysyy ajantasaisena lisäyksen jälkeen.

#### 8.12: Kirjailijan syntymävuosi advanced

Tee syntymävuoden asetuslomakkeesta sellainen, että syntymävuoden voi asettaa pudotusvalikon avulla ainoastaan olemassaolevalle kirjailijalle. Voit käyttää esimerkiksi [select-elementtiä](https://react.dev/reference/react-dom/components/select) tai jotakin erillistä kirjastoa kuten [react-select](https://github.com/JedWatson/react-select).

Ratkaisu näyttää seuraavalta <i>select</i>-elementtiä käyttäen:

![](../../images/8/21a.png)

</div>
