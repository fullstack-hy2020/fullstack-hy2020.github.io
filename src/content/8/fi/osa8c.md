---
mainImage: ../../../images/part-8.svg
part: 8
letter: c
lang: fi
---

<div class="content">

Laajennetaan sovellusta käyttäjänhallinnalla. Siirrytään kuitenkin ensin käyttämään tietokantaa datan tallettamiseen.

### Mongoose ja Apollo

Otetaan käyttöön Mongoose ja asennetaan samalla dotenv:

```bash
npm install mongoose dotenv
```

Tehdään osien [3](/osa3/tietojen_tallettaminen_mongo_db_tietokantaan) ja [4](/osa4/sovelluksen_rakenne_ja_testauksen_alkeet) tapaa imitoiden.

Henkilön skeema on määritelty seuraavasti:

```js
const mongoose = require('mongoose')

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
})

module.exports = mongoose.model('Person', schema)
```

Mukana on myös muutama validointi. Arvon olemassaolon takaava _required: true_ on sikäli turha, että GraphQL:n käyttö takaa sen, että kentät ovat olemassa. Validointi on kuitenkin hyvä pitää myös tietokannan puolella.

Saamme sovelluksen jo suurilta osin toimimaan seuraavilla muutoksilla:

```js
// ...

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Person = require('./models/person')

require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = `
  ...
`

const resolvers = {
  Query: {
    personCount: async () => Person.collection.countDocuments(),
    allPersons: async (root, args) => {
      // filters missing
      return Person.find({})
    },
    findPerson: async (root, args) => Person.findOne({ name: args.name }),
  },
  Person: {
    address: (root) => {
      return {
        street: root.street,
        city: root.city,
      }
    },
  },
  Mutation: {
    addPerson: async (root, args) => {
      const person = new Person({ ...args })
      return person.save()
    },
    editNumber: async (root, args) => {
      const person = await Person.findOne({ name: args.name })
      person.phone = args.phone
      return person.save()
    },
  },
}
```

Muutokset ovat melko suoraviivaisia. Huomio kiinnittyy pariin seikkaan. Kuten muistamme, Mongossa olioiden identifioiva kenttä on nimeltään <i>_id</i> ja jouduimme aiemmin muuttamaan itse kentän nimen alaviivattomaan muotoon <i>id</i>. GraphQL osaa tehdä tämän muutoksen automaattisesti.

Toinen huomionarvoinen seikka on se, että resolverifunktiot palauttavat nyt <i>promisen</i>, aiemminhan ne palauttivat aina normaaleja oliota. Kun resolveri palauttaa promisen, Apollo server [osaa lähettää vastaukseksi](https://www.apollographql.com/docs/apollo-server/data/resolvers/#return-values) sen arvon mihin promise resolvoituu.

Eli esimerkiksi jos seuraava resolverifunktio suoritetaan,

```js
allPersons: async (root, args) => {
  return Person.find({})
}
```

odottaa Apollo server promisen valmistumista ja lähettää promisen vastauksen kyselyn tekijälle. Apollo toimii siis suunnilleen seuraavasti:

```js
allPersons: async (root, args) => {
  const result = await Person.find({})
  return result
}
```

Täydennetään vielä resolveri _allPersons_ ottamaan huomioon optionaalinen filtterinä toimiva parametri _phone_:

```js
Query: {
  // ..
  allPersons: async (root, args) => {
    if (!args.phone) {
      return Person.find({})
    }

    return Person.find({ phone: { $exists: args.phone === 'YES'  }})
  },
},
```

Eli jos kyselylle ei ole annettu parametria _phone_, palautetaan kaikki henkilöt. Jos parametrilla on arvo <i>YES</i>, palautetaan kyselyn

```js
Person.find({ phone: { $exists: true }})
```

palauttamat henkilöt, eli ne joiden kentällä _phone_ on jokin arvo. Jos parametrin arvo on <i>NO</i>, palauttaa kysely ne henkilöt, joilla ei ole arvoa kentällä _phone_:

```js
Person.find({ phone: { $exists: false }})
```

### Validoinnit

GraphQL:n lisäksi syötteet validoidaan nyt Mongoose-skeemassa määriteltyjä validointeja käyttäen. Skeemassa olevien validointivirheiden varalta _save_-metodeille täytyy lisätä virheen käsittelevä _try/catch_-lohko. Heitetään catchiin jouduttaessa vastaukseksi   [virhekoodilla](https://www.apollographql.com/docs/apollo-server/data/errors/#built-in-error-codes) *BAD\_USER\_INPUT* varustetu poikkeus [GraphQLError](https://www.apollographql.com/docs/apollo-server/data/errors/#custom-errors):

```js
Mutation: {
  addPerson: async (root, args) => {
      const person = new Person({ ...args })

// highlight-start
      try {
        await person.save()
      } catch (error) {
        throw new GraphQLError('Saving person failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }
// highlight-end

      return person
  },
    editNumber: async (root, args) => {
      const person = await Person.findOne({ name: args.name })
      person.phone = args.phone

// highlight-start
      try {
        await person.save()
      } catch (error) {
        throw new GraphQLError('Saving number failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }
// highlight-end

      return person
    }
}
```

Mongoosen virheen tiedot ja ongelman aiheuttanut data on nyt liitetty poikkeuksen konfiguraatio-olioon <i>extensions</i>, näin ne saadaan välitettyä kutsujalle. 

Backendin koodi on kokonaisuudessaan [GitHubissa](https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-4), branchissa <i>part8-4</i>.

### Käyttäjä ja kirjautuminen

Lisätään järjestelmään käyttäjänhallinta. Oletetaan nyt yksinkertaisuuden takia, että kaikkien käyttäjien salasana on sama järjestelmään kovakoodattu merkkijono. [Osan 4](/osa4/kayttajien_hallinta) periaatteilla on toki suoraviivaista tallettaa käyttäjille yksilöllinen salasana, mutta koska fokuksemme on GraphQL:ssä, jätämme salasanaan liittyvät rönsyt tällä kertaa pois.

Käyttäjän skeema seuraavassa:

```js
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Person'
    }
  ],
})

module.exports = mongoose.model('User', schema)
```

Käyttäjään siis liittyy kentän _friends_ kautta joukko luettelossa olevia henkilöitä. Ideana on se, että kun käyttäjä, esim. <i>mluukkai</i> lisää henkilön, vaikkapa <i>Arto Hellas</i> luetteloon, liitetään henkilö käyttäjän _friends_-listaan. Näin kirjautuneilla henkilöillä on mahdollista saada sovellukseen oma personoitu näkymänsä.

Kirjautuminen ja käyttäjän tunnistautuminen hoidetaan samoin kuten teimme [osassa 4](/osa4/token_perustainen_kirjautuminen) REST:in yhteydessä, eli käyttämällä tokeneita.

Laajennetaan skeemaa seuraavasti:

```js
type User {
  username: String!
  friends: [Person!]!
  id: ID!
}

type Token {
  value: String!
}

type Query {
  // ..
  me: User
}

type Mutation {
  // ...
  createUser(
    username: String!
  ): User
  login(
    username: String!
    password: String!
  ): Token
}
```

Kysely _me_ palauttaa kirjautuneena olevan käyttäjän. Käyttäjät luodaan mutaatiolla _createUser_ ja kirjautuminen tapahtuu mutaatiolla _login_.

Asennetaan jsonwebtoken-kirjasto:

```bash
npm install jsonwebtoken
```

Mutaatioiden resolverit seuraavassa:

```js
const jwt = require('jsonwebtoken')

Mutation: {
  // ..
  createUser: async (root, args) => {
    const user = new User({ username: args.username })

    return user.save()
      .catch(error => {
        throw new GraphQLError('Creating the user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      })
  },
  login: async (root, args) => {
    const user = await User.findOne({ username: args.username })

    if ( !user || args.password !== 'secret' ) {
      throw new GraphQLError('wrong credentials', {
        extensions: {
          code: 'BAD_USER_INPUT'
        }
      })        
    }

    const userForToken = {
      username: user.username,
      id: user._id,
    }

    return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
  },
},
```

Käyttäjän luova mutaatio on suoraviivainen. Kirjautumisesta vastaava mutaatio tarkastaa onko käyttäjätunnus/salasana-pari validi ja jos on, palautetaan [osasta 4](/osa4/token_perustainen_kirjautuminen) tuttu jwt-token.  Jotta koodi toimisi, täytyy ympäristömuuttujalle *JWT\_SECRET* muistaa antaa arvo  <i>.env</i>-tiedostossa.

Käyttäjän luonti onnistuu nyt seuraavasti:

```js
mutation {
  createUser (
    username: "mluukkai"
  ) {
    username
    id
  }
}
```

Kirjautumisen hoitaa seuraava mutaatio:

```js
mutation {
  login (
    username: "mluukkai"
    password: "secret"
  ) {
    value
  }
}
```

Aivan kuten REST:in tapauksessa myös nyt ideana on, että kirjautunut käyttäjä liittää kirjautumisen yhteydessä saamansa tokenin kaikkiin pyyntöihinsä. REST:in tapaan token liitetään GraphQL-pyyntöihin headerin <i>Authorization</i> avulla. Apollo Explorerissa headerin liittäminen pyyntöön tapahtuu seuraavasti

![](../../images/8/24x.png)

Muutetaan backendin käynnistämistä siten, että annetaan käynnistyksen huolehtivalle funktiolle [startStandaloneServer](https://www.apollographql.com/docs/apollo-server/api/standalone/) toinen parametri [context](https://www.apollographql.com/docs/apollo-server/data/context/):

```js
startStandaloneServer(server, {
  listen: { port: 4000 },
  // highlight-start
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), process.env.JWT_SECRET
      )
      const currentUser = await User
        .findById(decodedToken.id).populate('friends')
      return { currentUser }
    }
  },
  // highlight-end
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
```

Kontekstin avulla voidaan suorittaa jotain kaikille kyselyille ja mutaatioille yhteisiä asioita, esim. pyyntöön liittyvän [käyttäjän tunnistaminen](https://blog.apollographql.com/authorization-in-graphql-452b1c402a9?_ga=2.45656161.474875091.1550613879-1581139173.1549828167).

Contextin palauttama olio annetaan kaikille resolvereille <i>kolmantena parametrina</i>.

Määrittelemämme koodi siis asettaa kontekstin kenttään _currentUser_ pyynnön tehnyttä käyttäjää vastaavan olion. Jos pyyntöön ei liity käyttäjää, on kentän arvo määrittelemätön.

Kyselyn _me_ resolveri on erittäin yksinkertainen, se ainoastaan palauttaa kirjautuneen käyttäjän, jonka se saa resolverin kolmantena olevan parametrin _context_ kentästä _currentUser_. Kannattaa huomata, että jos käyttäjä ei ole kirjautunut, ts. pyynnön headerina ei tule validia tokenia, vastaa kysely <i>null</i>:

```js
Query: {
  // ...
  me: (root, args, context) => {
    return context.currentUser
  }
},
```

Jos headerissa on oikea arvo, palauttaa kysely headerin yksilöimän käyttäjän tiedot

![](../../images/8/50new.png)

### Tuttavalista

Viimeistellään sovelluksen backend siten, että henkilöiden luominen ja editointi edellyttää kirjautumista, ja että luodut henkilöt menevät automaattisesti kirjautuneen käyttäjän tuttavalistalle.

Tyhjennetään ensin kannasta siellä ennestään olevat kenenkään tuttaviin kuulumattomat käyttäjät.

Mutaatio _addPerson_ muuttuu seuraavasti:

```js
Mutation: {
  addPerson: async (root, args, context) => { // highlight-line
    const person = new Person({ ...args })
    const currentUser = context.currentUser // highlight-line

    // highlight-start
    if (!currentUser) {
      throw new GraphQLError('not authenticated', {
        extensions: {
          code: 'BAD_USER_INPUT',
        }
      })
    }
    // highlight-end

    try {
      await person.save()
      currentUser.friends = currentUser.friends.concat(person) // highlight-line
      await currentUser.save() // highlight-line
    } catch (error) {
      throw new GraphQLError('Saving user failed', {
        extensions: {
          code: 'BAD_USER_INPUT',
          invalidArgs: args.name,
          error
        }
      })
    }

    return person
  },
  //...
}
```

Jos kirjautunutta käyttäjää ei löydy kontekstista, heitetään poikkeus _GraphQLError_ asianomaisella virheilmoituksella varustettuna. Henkilön talletus hoidetaan nyt _async/await_-syntaksilla, koska joudumme onnistuneen talletuksen yhteydessä tallettamaan uuden henkilön käyttäjän tuttavalistalle.

Lisätään sovellukseen vielä mahdollisuus liittää jokin henkilö omalle tuttavalistalle. Mutaatio seuraavassa:

```js
type Mutation {
  // ...
  addAsFriend(
    name: String!
  ): User
}
```

Mutaation toteuttava resolveri:

```js
  addAsFriend: async (root, args, { currentUser }) => {
    const nonFriendAlready = (person) => 
      !currentUser.friends.map(f => f._id.toString()).includes(person._id.toString())

    if (!currentUser) {
      throw new GraphQLError('wrong credentials', {
        extensions: { code: 'BAD_USER_INPUT' }
      }) 
    }

    const person = await Person.findOne({ name: args.name })
    if ( nonFriendAlready(person) ) {
      currentUser.friends = currentUser.friends.concat(person)
    }

    await currentUser.save()

    return currentUser
  },
```

Huomaa miten resolveri <i>destrukturoi</i> kirjautuneen käyttäjän kontekstista, eli sen sijaan että _currentUser_ otettaisiin erilliseen muuttujaan funktiossa

```js
addAsFriend: async (root, args, context) => {
  const currentUser = context.currentUser
```

otetaan se vastaan suoraan funktion parametrimäärittelyssä:

```js
addAsFriend: async (root, args, { currentUser }) => {
```

Omien tuttavien puhelinnumerot on mahdollista selvittää seuraavalla kyselyllä

```js
query {
  me {
    username
    friends{
      name
      phone
    }
  }
}
```

Backendin koodi on kokonaisuudessaan [GitHubissa](https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-5), branchissa <i>part8-5</i>.

</div>

<div class="tasks">

### Tehtävät 8.13.-8.16.

Tämän luvun tehtävät todennäköisesti hajottavat frontendin koodin. Tässä luvussa riittääkin keskittyä backendiin. Frontend korjataan ja sitä laajennetaan seuraavan luvun tehtävissä.

#### 8.13: Tietokanta, osa 1

Muuta kirjastosovellusta siten, että se tallettaa tiedot tietokantaan. Kirjojen ja kirjailijoiden <i>Mongoose-skeema</i> löytyy valmiiksi [täältä](https://github.com/fullstack-hy/misc/blob/master/library-schema.md).

Muutetaan myös graphql-skeemaa hiukan kirjan osalta

```js
type Book {
  title: String!
  published: Int!
  author: Author!
  genres: [String!]!
  id: ID!
}
```  

eli kirja sisältää pelkän kirjailijan nimen sijaan kirjailijan kaikki tiedot.

Voit olettaa tässä tehtävässä, että käyttäjä ei yritä luoda virheellisiä kirjoja tai kirjailijoita, eli validointivirheistä ei tarvitse vielä välittää.

Seuraavien asioiden ei vielä tässä tehtävässä tarvitse toimia.

- queryn _allBooks_ parametrilliset versiot
- kirjailijoiden kenttä _bookCount_
- kirjojen kenttä _author_
- mutaatio _editAuthor_

**Huom**: siitä huolimatta että kirjailijan tiedot ovat nyt <i>oliona</i> kirjan sisällä, kirjan lisäämisen skeema kannattaa säilyttää samana, eli operaation parametrina annetaan kirjailijasta ainoastaan nimi:

```js
type Mutation {
  addBook(
    title: String!
    author: String! // highlight-line
    published: Int!
    genres: [String!]!
  ): Book!
  editAuthor(name: String!, setBornTo: Int!): Author
}
```

#### 8.14: Tietokanta, osa 2

Täydennä sovellusta siten, että kaikki kyselyt (kyselyn _allBooks_ parametrin _author_ toimintaansaattaminen on vapaaehtoinen lisätehtävä!) sekä mutaatiot toimivat.

Kirjojen haun parametrin <i>genre</i> suhteen tilanne on hieman haastavampi. Ratkaisu on yksinkertainen, mutta sen löytäminen voi tuottaa päänvaivaa. Saatat hyötyä [tästä](https://www.mongodb.com/docs/manual/tutorial/query-array-of-documents/). 

#### 8.15 Tietokanta, osa 3

Täydennä sovellusta siten, että tietokannan validointivirheet (esim. liian lyhyt kirjan tai kirjailijan nimi) käsitellään järkevästi, eli niiden seurauksena heitetään poikkeus [GraphQLError](https://www.apollographql.com/docs/apollo-server/data/errors/#custom-errors), jolle asetetaan sopiva virheviesti.

#### 8.16 käyttäjä ja kirjautuminen

Lisää järjestelmään käyttäjienhallinta. Laajenna skeemaa seuraavasti:

```js
type User {
  username: String!
  favoriteGenre: String!
  id: ID!
}

type Token {
  value: String!
}

type Query {
  // ..
  me: User
}

type Mutation {
  // ...
  createUser(
    username: String!
    favoriteGenre: String!
  ): User
  login(
    username: String!
    password: String!
  ): Token
}
```

Toteuta uuden queryn _me_ sekä uusien mutaatioiden _createUser_ ja _login_ resolverit. Voit olettaa tämän luvun materiaalin tapaan, että kaikilla käyttäjillä on sama, kovakoodattu salasana.

Tee mutaatiot _addBook_ ja _editAuthor_ mahdollisiksi ainoastaan, jos pyynnön mukana lähetetään validi token. 

</div>
