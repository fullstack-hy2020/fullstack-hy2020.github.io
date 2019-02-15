---
mainImage: ../../images/part-8.svg
part: 8
letter: a
---

<div class="content">

Tälläkin kurssilla moneen kertaan käytetty REST on ollut pitkään vallitseva tapa toteuttaa palvelimen selaimelle tarjoama rajapinta ja yleensäkin verkossa toimivien sovellusten välinen integraatio.

RESTin rinnalle selaimessa ja mobiililaitteessa toimivan logiikan ja palvelimien väliseen kommunikointiin on viime vuosina noussut alunperin Facebookin kehittämä [GraphQL](http://graphql.org/).

GraphQL on filosofialtaan todella erilainen RESTiin verrattuna. REST on <i>resurssipohjainen</i>, jokaisella resurssilla, esim. <i>käyttäjällä</i> on oma sen identifioiva osoite, esim. <i>/users/10</i>, ja kaikki resursseille tehtävät operaatiot toteutetaan tekemällä URL:ille kohdistuvia pyyntöjä, joiden toiminta määrittyy käytetyn HTTP-metodin avulla.

RESTin resurssiperustaisuus toimii hyvin useissa tapauksissa, joissain tapauksissa se voi kuitenkin olla hieman kankea.

Oletetaan että blogilistasovelluksemme sisältäisi somemaista toiminnallisuutta ja haluaisimme esim. näyttää sovelluksessa listan, joka sisältää kaikkien seuraamiemme (follow) käyttäjien blogeja kommentoineiden käyttäjien lisäämien blogien nimet.

Jos palvelin toteuttaisi REST API:n, joutuisimme todennäköisesti tekemään monia HTTP-pyyntöjä selaimen koodista, ennen kuin saisimme muodostettua halutun datan. Pyyntöjen vastauksena tulisi myös paljon ylimääräistä dataa ja halutun datan keräävä selaimen koodi olisi todennäköisesti kohtuullisen monimutkainen.

Jos kyseessä olisi usein käytetty toiminnallisuus, voitaisiin sitä varten toteuttaa oma REST-endpoint. Jos vastaavia skeaarioita olisi paljon, esim. kymmeniä, tulisi erittäin työlääksi toteuttaa kaikille toiminnallisuuksille oma REST-endpoint.

GraphQL:n avulla toteutettava palvelin sopii tämänkaltaisiin tilanteisiin hyvin.

GraphQL:ssä periaatteena, on että selaimen koodi muodostaa <i>kyselyn</i>, joka kuvailee halutun datan ja lähettää sen API:lle HTTP POST -pyynnöllä. Toisin kuin REST:issä, GraphQL:ssä kaikki kyselyt kohdistetaan samaan osoitteeseen ja ovat POST-tyyppisiä.

Edellä kuvatun skenaarion data saataisiin haettua (suurinpiirtein) seuraavan kaltaisella kyselyllä:

```bash
query FetchBlogsQuery {
  user(username: 'mluukkai') {
    followedUsers {
      blogs {
        comments {
          user {
            blogs {
              title
            }
          }
        }
      }
    }
  }
}
```


Palvelimen vastaus pyyntöön olisi suunnilleen seuraavanlainen JSON-olio:

```bash
{
  data: {
    followedUsers: {
      blogs: {
        comments: {
          user: {
            blogs: [
              'Goto considered harmful',
              'End to End Testing with Puppeteer and Jest',
              'Navigating your transition to GraphQL',
              'From REST to GraphQL'
            ]
          }
        }
      }
    }
  }
}
```

Sovelluslogiikka säilyy yksinkertaisena ja selaimen koodi saa täsmälleen haluamansa datan yksittäisellä kyselyllä.

### Skeema ja kyselyt

Tutustutaan GraphQL:n peruskäsitteistöön toteuttamalla GraphQL-versio osien 2 ja 3 puhelinluettelosovelluksesta.

Jokaisen GraphQL-sovelluksen ytimessä on [skeema](https://graphql.org/learn/schema/), joka määrittelee minkä muotoista dataa sovelluksessa vaihdetaan clientin ja palvelimen välillä. Puhelinluettelon alustava skeema on seuraavassa:

```js
type Person {
  name: String!
  phone: String
  street: String!
  city: String! 
}

type Query {
  personCount: Int!
  allPersons: [Person!]!
  findPerson(name: String!): Person
}
```

Skeema määrittelee kaksi [tyyppiä](https://graphql.org/learn/schema/#type-system). Tyypeistä ensimmäinen <i>Person</i> määrittelee, että henkilöillä on neljä kenttää. Kentät ovat tyyppiä <i>String</i>, joka on yksi GraphQL:n määrittelemistä [valmiista tyypeistä](https://graphql.org/learn/schema/#scalar-types). Kentistä muilla paitsi puhelinnumerolla (<i>phone</i>) on oltava arvo, tämä on merkitty skeemaan huutomerkillä.

Toinen skeeman määrittelemistä tyypeistä on [Query](https://graphql.org/learn/schema/#the-query-and-mutation-types). Käytännössä jokaisessa GraphQL-skeemassa määritellään tyyppi Query, joka kertoo mitä kyselyjä API:n voidaan tehdä. 

Puhelinluettelo määrittelee kolme erilaista kyselyä ja _personCount_ palauttaa kokonaisluvun. _allPersons_ palauttaa listan <i>Person</i> tyyppisiä olioita. <i>findPerson</i> saa merkkijonomuotoisen parametrin ja palauttaa <i>Person</i>-olion. 

Queryjen paluuarvon ja parametrin määrittelyssä on jälleen käytetty välillä huutomerkkiä merkkaamaan <i>pakollisuutta</i>, eli _personCount_ palauttaa varmasti kokonaisluvun. Kyselylle _findPerson_ on pakko antaa parametriksi merkkijono. Kysely palauttaa <i>Person</i>-olion tai arvon <i>null</i>. _allPersons_ palauttaa listan <i>Person</i>-olioita, listalla ei ole <i>null</i>-arvoja. 

Skeema siis määrittelee mitä kyselyjä client pystyy palvelimelta tekemään, minkälaisia parametreja kyselyillä voi olla sen minkä muotoista kyselyjen palauttama data on.

Kyselyistä yksinkertaisin _personCount_ näyttää seuraavalta

```js
query {
	personCount
}
```

Olettaen että sovellukseen olisi talletettu kolmen henkilön tiedot vastaus kyselyyn näyttäisi seuraavalta:

```js
{
  "data": {
    "personCount": 3
  }
}
```

Kaikkien henkilöiden tiedot hakeva _allPersons_ on hieman monimutkaisempi. Koska kysely palauttaa listan <i>Person</i>-olioita, on kyselyn yhteydessä määriteltävä <i>mitkä kentät</i> kyselyn [halutaan palauttavan](https://graphql.org/learn/queries/#fields): 

```js
query {
	allPersons{
    name
    phone
  }
}
```

Vastaus voisi näyttää seuraavalta:


```js
{
  "data": {
    "allPersons": [
      {
        "name": "Arto Hellas",
        "phone": "040-123543"
      },
      {
        "name": "Matti Luukkainen",
        "phone": "040-432342"
      },
      {
        "name": "Venla Ruuska",
        "phone": null
      }
    ]
  }
}
```

Kysely voi määritellä palautettavaksi mitkä tahansa skeemassa mainitut kentät, esim. seuraava olisi myös mahdollista:

```js
query {
	allPersons{
    name
    city
    street
  }
}
```

Vielä esimerkki parametria edellyttävästä kyselystä, joka hakee yksittäisen henkilön tiedot palauttavasta kyselystä

```js
query {
  findPerson(name: "Arto Hellas") {
		phone 
    city 
    street
  }
}
```

Kyselyn parametri siis annetaan suluissa, ja sen jälkeen määritellään aaltosuluissa paluuarvona tulevan olion halutut kentät. 

Vastaus on muotoa:

```js
{
  "data": {
    "findPerson": {
      "phone": "040-123543",
      "city": "Espoo",
      "street": "Tapiolankatu 5 A"
    }
  }
}
```

Kyselyn paluuarvoa ei oltu merkitty pakolliseksi, eli jos etsitään tuntematonta henkilöä

```js
query {
  findPerson(name: "Donald Trump") {
		phone 
  }
}
```

vastaus on <i>null</i>

```js
{
  "data": {
    "findPerson": null
  }
}
```

Kuten huomaamme, GraphQL kyselyn ja siihen vastauksena tulevan JSON:in muodoilla on vahva yhteys, voidaan ajatella että kysely kuvailee sen minkälaista dataa vastauksena halutaan. Ero REST:issä tehtäviin pyyntöihin on suuri, REST:iä käytettäessä pyynnon tyyppi ei kerro mitään palautettavan datan muodosta. 

GraphQL:n skeema kuvaa ainoastaan palvelimen ja sitä käyttäjien clientien välillä liikkuvan tiedon muodon. Tieto voi olla organisoituna palvelimen tietokantaan ihan missä muodossa tahansa.

Nimestään huolimatta GraphQL:llä ei siis ole mitään tekemistä tietokantojen kanssa, se ei ota mitään kantaa siihen miten data on tallennettu. GraphQL-periaattella toimivan API:n käyttämä data voi siis olla talletettu relaatiotietokantaan, dokumenttitietokantaan tai muille palvelimille, joita GraphQL-palvelin käyttää vaikkapa REST:in välityksellä. 

### Apollo server

Toteuteaan nyt GraphQL-palvelin tämän hetken johtavaa kirjastoa [Apollo serveriä](https://www.apollographql.com/docs/apollo-server/) käyttäen. 

Luodaan uusi npm-projekti komennolla _npm init_ ja asennetaan tarvittavat riippuvuuet

```js
npm install --save apollo-server graphql
```

Alustava toteutus on seuraavassa

```js
const { ApolloServer, gql } = require('apollo-server')

const persons = [
  {
    name: "Arto Hellas",
    phone: "040-123543",
    street: "Tapiolankatu 5 A",
    city: "Espoo"
  },
  {
    name: "Matti Luukkainen",
    phone: "040-432342",
    street: "Malminkaari 10 A",
    city: "Helsinki"
  },
  {
    name: "Venla Ruuska",
    street: "Nallemäentie 22 C",
    city: "Helsinki"
  },
]

const typeDefs = gql`
  type Person {
    name: String!
    phone: String
    street: String!
    city: String! 
  }

  type Query {
    personCount: Int!
    allPersons: [Person!]!
    findPerson(name: String!): Person
  }
`

const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: () => persons,
    findPerson: (root, args) => persons.find(p => p.name === args.name)
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
```

Toteutuksen ytimessä on _ApolloServer_, joka saa kaksi parametria 

```js
const server = new ApolloServer({
  typeDefs,
  resolvers,
})
```

parametreista ensimmäinen _typeDefs_ sisältää sovelluksen käyttämän GraphQL-skeeman. 

Toinen parametri on olio, joka sisältää palvelimen [resolverit](https://www.apollographql.com/docs/apollo-server/essentials/data.html#resolver-map), eli käytännössä koodin, joka määrittelee <i>miten</i> GraphQL-kyselyihin vastataan.

Resolverien koodi on seuraavassa:

```js
const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: () => persons,
    findPerson: (root, args) => persons.find(p => p.name === args.name)
  }
}
```

kuten huomataan vastaavat resolverit rakenteeltaan skeemassa määriteltyjä kyseilyitä:

```js
type Query {
  personCount: Int!
  allPersons: [Person!]!
  findPerson(name: String!): Person
}
```

eli jokaista skeemassa määriteltyä kyselyä kohti om määritelty oma kentän <i>Query</i> alle tuleva kenttänsä.

Kyselyn 

```js
query {
	personCount
}
```

resolveri on funktio

```js
() => persons.length
```

eli kyselyyn palautetaan vastauksena taulukon _persons_ pituus. 

Kaikki luettelossa olevat henkilöt hakevan kyselyn 

```js
query {
  allPersons {
    name
  }
}
```

resolveri on funktio, joka palauttaa <i>kaikki</i> taulukon _persons_ oliot

```js
() => persons
```

### GraphQL-playground

Kun Apollo serveriä suoritetaan sovelluskehitysmoodissa, käynnistää se osoitteeseen [http://localhost:4000/graphql](http://localhost:4000/graphql) sovelluskehittäjälle eritäin hyödyllisen [GraphQL-playground](https://www.apollographql.com/docs/apollo-server/features/graphql-playground.html) näkymän, joka avulla on mahdollista tehdä kyselyjä palvelimelle.

### Triviaaliresolveri

### Olion sisällä olio

### Frontti


GraphQL on jo melko iäkäs teknologia, se on ollut Facebookin sisäisessä käytössä jo vuodesta 2012 lähtien, teknologian voi siis todeta olevan "battle tested". Facebook julkaisi GraphQL:n vuonna 2015 ja se on pikkuhiljaa saanut enenevissä määrin huomiota ja nousee ehkä lähivuosina uhmaamaan REST:in valta-asemaa.

</div>
