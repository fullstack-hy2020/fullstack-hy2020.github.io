---
mainImage: ../../images/part-4.svg
part: 4
letter: a
---

<div class="content">

Jatketaan [osassa 3](/osa3) tehdyn muistiinpanosovelluksen backendin kehittämistä.

### Sovelluksen rakenne

Ennen osan ensimmäistä isoa teemaa eli testaamista, muutetaan sovelluksen rakennetta noudattamaan paremmin Noden [parhaita käytänteitä](https://github.com/i0natan/nodebestpractices/tree/master/sections/projectstructre).

Seuraavassa läpikäytävien muutosten jälkeen sovelluksemme hakemistorakenne näyttää seuraavalta

```bash
├── index.js
├── app.js
├── build
│   ├── ...
├── controllers
│   └── notes.js
├── models
│   └── note.js
├── package-lock.json
├── package.json
├── utils
│   ├── config.js
│   └── middleware.js  
```

Sovelluksen käynnistystiedosto <i>index.js</i> pelkistyy seuraavaan muotoon:

```js
const app = require('./app') // varsinainen Express-sovellus
const http = require('http')
const config = require('./utils/config')

const server = http.createServer(app)

server.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})
```

<i>index.js</i> ainoastaan importaa tiedostossa <i>app.js</i> olevan varsinaisen sovelluksen ja käynnistää sen. Sovelluksen käynnistäminen tapahtuu nyt <em>server</em>-muuttujassa olevan olion kautta. 

Ympäristömuuttujien käsittely on eriytetty moduulin <i>utils/config.js</i> vastuulle:

```js
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

let PORT = process.env.PORT
let MONGODB_URI = process.env.MONGODB_URI

module.exports = {
  MONGODB_URI,
  PORT
}
```

Sovelluksen muut osat pääsevät ympäristömuuttujiin käsiksi importtaamalla konfiguraatiomoduulin

```js
const config = require('./utils/config')

console.log(`Server running on port ${config.PORT}`)
```

Routejen määrittely siirretään omaan tiedostoonsa, eli myös siitä tehdään moduuli. Routejen tapahtumankäsittelijöitä kutsutaan usein <i>kontrollereiksi</i>. Sovellukselle onkin luotu hakemisto <i>controllers</i> ja sinne tiedosto <i>notes.js</i>, johon kaikki muistiinpanoihin liittyvien reittien määrittelyt on siirretty.

Tiedoston sisältö on seuraava:

```js
const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes.map(note => note.toJSON()))
  })
})

notesRouter.get('/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note.toJSON())
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

notesRouter.post('/', (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

  note.save()
    .then(savedNote => {
      response.json(savedNote.toJSON())
    })
    .catch(error => next(error))
})

notesRouter.delete('/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

notesRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote.toJSON())
    })
    .catch(error => next(error))
})

module.exports = notesRouter
```

Kyseessä on käytännössä melkein suora copypaste tiedostosta <i>index.js</i>.

Muutoksia on muutama. Tiedoston alussa luodaan [router](http://expressjs.com/en/api.html#router)-olio:

```js
const notesRouter = require('express').Router()

//...

module.exports = notesRouter
```

Tiedosto eksporttaa moduulin käyttäjille määritellyn routerin.

Kaikki määriteltävät routet liitetään router-olioon, samaan tapaan kuin aiemmassa versiossa routet liitettiin sovellusta edustavaan olioon.

Huomioinarvoinen seikka routejen määrittelyssä on se, että polut ovat typistyneet, aiemmin määrittelimme esim.

```js
app.delete('/api/notes/:id', (request, response) => {
```

nyt riittää määritellä

```js
notesRouter.delete('/:id', (request, response) => {
```

Mistä routereissa oikeastaan on kyse? Expressin manuaalin sanoin

> <i>A router object is an isolated instance of middleware and routes. You can think of it as a “mini-application,” capable only of performing middleware and routing functions. Every Express application has a built-in app router.</i>

Router on siis <i>middleware</i>, jonka avulla on mahdollista määritellä joukko "toisiinsa liittyviä" routeja yhdessä paikassa, yleensä omassa moduulissaan.

Varsinaisen sovelluslogiikan määrittelevä tiedosto <i>app.js</i> ottaa määrittelemämme routerin käyttöön seuraavasti:

```js
const notesRouter = require('./controllers/notes')
app.use('/api/notes', notesRouter)
```

Näin määrittelemäämme routeria käytetään <i>jos</i> polun alkuosa on <i>/api/notes</i>. notesRouter-olion sisällä täytyy tämän takia käyttää ainoastaan polun loppuosia, eli tyhjää polkua <i>/</i> tai pelkkää parametria <i>/:id</i>.

Sovelluksen määrittelevä <i>app.js</i> näyttää muutosten jälkeen seuraavalta:

```js
const config = require('./utils/config')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const notesRouter = require('./controllers/notes')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')

console.log('commecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

app.use(express.static('build'))
app.use(bodyParser.json())
app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
```

Tiedostossa siis otetaan käyttöön joukko middlewareja, näistä yksi on polkuun <i>/api/notes</i> kiinnitettävä <i>notesRouter</i> (tai notes-kontrolleri niin kuin jotkut sitä kutsuisivat).

Itse toteutettujen middlewarejen määritelty on siirretty tiedostoon <i>utils/middleware.js</i>:

```js
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}


module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}
```

Koska tietokantayhteyden muodostaminen on siirretty tiedoston <i>app.js</i>:n vastuulle. Hakemistossa <i>models</i> oleva tiedosto <i>note.js</i> sisältää nyt ainoastaan muistiinpanojen skeeman määrittelyn.

```js
const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 5
  },
  date: Date,
  important: Boolean,
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema)
```

Sovelluksen hakemistorakenne siis näyttää refaktoroinnin jälkeen seuraavalta:

```bash
├── index.js
├── app.js
├── build
│   ├── ...
├── controllers
│   └── notes.js
├── models
│   └── note.js
├── package-lock.json
├── package.json
├── utils
│   ├── config.js
│   └── middleware.js  
```

Jos sovellus on pieni, ei rakenteella ole kovin suurta meritystä. Sovelluksen kasvaessa kannattaa sille muodostaa jonkinlainen rakenne eli arkkitehtuuri, ja jakaa erilaisten vastuut omiin moduuleihin. Tämä helpottaa huomattavasti ohjelman jatkokehitystä.

Express-sovelluksien rakenteelle, eli hakemistojen ja tiedostojen nimennälle ei ole olemassa mitään yleismaailmallista standardia samaan tapaan kuin esim. Ruby on Railsissa. Tässä käyttämämme malli noudattaa eräitä internetissä vastaan tulevia hyviä käytäntöjä.

Sovelluksen tämänhetkinen koodi on kokonaisuudessaan [githubissa](https://github.com/fullstack-hy2019/part3-notes-backend/tree/part4-1), branchissa <i>part4-1</i>:

Jos kloonaat projektin itsellesi, suorita komento _npm install_ ennen käynnistämistä eli komentoa _npm start_.

</div>

<div class="tasks">

### Tehtäviä


Rakennamme tämän osan tehtävissä <i>blogilistasovellusta</i>, jonka avulla käyttäjien on mahdollista tallettaa tietoja internetistä löytämistään mielenkiintoisista blogeista. Kustakin blogista talletetaan sen kirjoittaja (author), aihe (title), url sekä blogilistasovelluksen käyttäjien antamien äänien määrä.

</div>

<div class="content">

### Node-sovellusten testaaminen

Olemme laiminlyöneet ikävästi yhtä oleellista ohjelmistokehityksen osa-aluetta, automatisoitua testaamista.

Aloitamme yksikkötestauksesta. Sovelluksemme logiikka on sen verran yksinkertaista, että siinä ei ole juurikaan mielekästä yksikkötestattavaa. Luodaan tiedosto <i>utils/for_testing.js</i> ja määritellään sinne pari yksinkertaista funktiota testattavaksi:

```js
const palindrom = string => {
  return string
    .split('')
    .reverse()
    .join('')
}

const average = array => {
  const reducer = (sum, item) => {
    return sum + item
  }

  return array.reduce(reducer, 0) / array.length
}

module.exports = {
  palindrom,
  average,
}
```

> Metodi _average_ käyttää taulukoiden metodia [reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce). Jos metodi ei ole vieläkään tuttu, on korkea aika katsoa youtubesta [Functional Javascript](https://www.youtube.com/watch?v=BMUiFMZr7vk&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84) -sarjasta ainakin kolme ensimmäistä videoa.

Javascriptiin on tarjolla runsaasti erilaisia testikirjastoja eli <i>test runnereita</i>. Käytämme tällä kurssilla Facebookin kehittämää ja sisäisesti käyttämää [jest](https://jestjs.io/):iä, joka on toiminnaltaan ja syntaksiltaankin hyvin samankaltainen kuin testikirjastojen entinen kuningas [Mocha](https://mochajs.org/). Muitakin mahdollisuuksia olisi, esim. eräissä piireissä suosiota nopeasti saavuttanut [ava](https://github.com/avajs/ava).

Jest on tälle kurssille luonteva valinta, sillä se sopii hyvin backendien testaamiseen, mutta suorastaan loistaa Reactilla tehtyjen frontendien testauksessa.

> <i>**Huomio Windows-käyttäjille:**</i> jest ei välttämättä toimi, jos projektin hakemistopolulla on hakemisto, jonka nimessä on välilyöntejä.

Koska testejä on tarkoitus suorittaa ainoastaan sovellusta kehitettäessä, asennetaan <i>jest</i> kehitysaikaiseksi riippuvuudeksi komennolla

```bash
npm install --save-dev jest
```

määritellään <i>npm skripti _test</i> suorittamaan testaus jestillä ja raportoimaan testien suorituksesta <i>verbose</i>-tyylillä:

```bash
{
  //...
  "scripts": {
    "start": "node index.js",
    "watch": "nodemon index.js",
    "lint": "eslint .",
    "test": "jest --verbose"
  },
  //...
}
```

Jestin uudemmissa versioissa näyttäisi olevan tarve kertoa, että suoritusympäristönä on käytössä Node. Tämä tapahtuu esim. lisäämällä <i>package.json</i> tiedoston loppuun:

```js
{
 //...
 "jest": {
   "testEnvironment": "node"
 }
}
```

Tai vaihtoehtoisesti Jest löytää myös oletuksena asetustiedoston nimellä <i>jest.config.js</i>, jonne suoritusympäristön määrittely tapahtuu seuraavasti:

```js
module.exports = {
  testEnvironment: 'node',
};
```

Tehdään testejä varten hakemisto <i>tests</i> ja sinne tiedosto <i>palindrom.test.js</i>, jonka sisältö on seuraava

```js
const palindrom = require('../utils/for_testing').palindrom

test('palindrom of a', () => {
  const result = palindrom('a')

  expect(result).toBe('a')
})

test('palindrom of react', () => {
  const result = palindrom('react')

  expect(result).toBe('tcaer')
})

test('palindrom of saippuakauppias', () => {
  const result = palindrom('saippuakauppias')

  expect(result).toBe('saippuakauppias')
})
```

Edellisessä osassa käyttöön ottamamme ESlint valittaa testien käyttämistä komennoista _test_ ja _expect_ sillä käyttämämme konfiguraatio kieltää <i>globaalina</i> määriteltyjen asioiden käytön. Poistetaan valitus lisäämällä <i>.eslintrc.js</i>-tiedoston kenttään <i>env</i> arvo <i>"jest": true</i>. Näin kerromme eslintille, että käytämme projektissamme Jestiä ja sen globaaleja muuttujia.

```js
module.exports = {
  "env": {
      "es6": true,
      "node": true,
      "jest": true, 
  },
  "extends": "eslint:recommended",
  "rules": {
    // ...
  },
};
```

Testi ottaa ensimmäisellä rivillä käyttöön testattavan funktion sijoittaen sen muuttujaan _palindrom_:

```js
const palindrom = require('../utils/for_testing').palindrom
```

Yksittäiset testitapaukset määritellään funktion _test_ avulla. Ensimmäisenä parametrina on merkkijonomuotoinen testin kuvaus. Toisena parametrina on <i>funktio</i>, joka määrittelee testitapauksen toiminnallisuuden. Esim. toisen testitapauksen toiminnallisuus näyttää seuraavalta:

```js
() => {
  const result = palindrom('react')

  expect(result).toBe('tcaer')
}
```

Ensin suoritetaan testattava koodi, eli generoidaan merkkijonon <i>react</i> palindromi. Seuraavaksi varmistetaan tulos metodin [expect](https://facebook.github.io/jest/docs/en/expect.html#content) avulla. Expect käärii tuloksena olevan arvon olioon, joka tarjoaa joukon <i>matcher</i>-funktioita, joiden avulla tuloksen oikeellisuutta voidaan tarkastella. Koska kyse on kahden merkkijonon samuuden vertailusta, sopii tilanteeseen matcheri [toBe](https://facebook.github.io/jest/docs/en/expect.html#tobevalue).

Kuten odotettua, testit menevät läpi:

![](../images/4/1.png)

Jest olettaa oletusarvoisesti, että testitiedoston nimessä on merkkijono <i>.test</i>. Käytetään kurssilla konventiota, millä testitiedostojen nimen loppu on <i>.test.js</i>

Jestin antamat virheilmoitukset ovat hyviä, rikotaan testi

```js
test('palindrom of react', () => {
  const result = palindrom('react')

  expect(result).toBe('tkaer')
})
```

seurauksena on seuraava virheilmotus

![](../images/4/2.png)

Lisätään muutama testi metodille _average_, tiedostoon <i>tests/average.test.js</i>.

```js
const average = require('../utils/for_testing').average

describe('average', () => {
  test('of one value is the value itself', () => {
    expect(average([1])).toBe(1)
  })

  test('of many is calculated right', () => {
    expect(average([1, 2, 3, 4, 5, 6])).toBe(3.5)
  })

  test('of empty array is zero', () => {
    expect(average([])).toBe(0)
  })
})
```

Testi paljastaa, että metodi toimii väärin tyhjällä taulukolla (sillä nollallajaon tulos on Javascriptissä <i>NaN</i>):

![](../images/4/3.png)

Metodi on helppo korjata

```js
const average = array => {
  const reducer = (sum, item) => {
    return sum + item
  }
  return array.length === 0
    ? 0 
    : array.reduce(reducer, 0) / array.length
}
```

Eli jos taulukon pituus on 0, palautetaan 0 ja muussa tapauksessa palautetaan metodin _reduce_ avulla laskettu keskiarvo.

Pari huomiota keskiarvon testeistä. Määrittelimme testien ympärille nimellä _average_ varustetun <i>describe</i>-lohkon.

```js
describe('average', () => {
  // testit
})
```

Describejen avulla yksittäisessä tiedostossa olevat testit voidaan jaotella loogisiin kokonaisuuksiin. Testituloste hyödyntää myös describe-lohkon nimeä:

![](../images/4/4.png)

Kuten myöhemmin tulemme näkemään, <i>describe</i>-lohkot ovat tarpeellisia siinä vaiheessa, jos haluamme osalle yksittäisen testitiedoston testitapauksista jotain yhteisiä alustus- tai lopetustoimenpiteitä.

Toisena huomiona se, että kirjoitimme testit aavistuksen tiiviimmässä muodossa, ottamatta testattavan metodin tulosta erikseen apumuuttujaan:

```js
test('of empty array is zero', () => {
  expect(average([])).toBe(0)
})
```

</div>

<div class="tasks">

### Tehtäviä

Tehdään joukko blogilistan käsittelyyn tarkoitettuja apufunktioita. Tee funktiot esim. tiedostoon <i>utils/list_helper.js</i>. Tee testit sopivasti nimettyyn tiedostoon hakemistoon <i>tests</i>.

#### 4.3: apufunktioita ja yksikkötestejä, osa 1

Määrittele ensin funktio _dummy_ joka saa parametrikseen taulukollisen blogeja ja palauttaa aina luvun 1. Tiedoston <i>list_helper.js</i> sisällöksi siis tulee tässä vaiheessa

```js
const dummy = (blogs) => {
  // ...
}

module.exports = {
  dummy
}
```

Varmista testikonfiguraatiosi toimivuus seuraavalla testillä:

```js
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})
```

#### 4.4: apufunktioita ja yksikkötestejä, osa 2

Määrittele funktio _totalLikes_ joka saa parametrikseen taulukollisen blogeja. Funktio palauttaa blogien yhteenlaskettujen tykkäysten eli <i>likejen</i> määrän.

Määrittele funktiolle sopivat testit. Funktion testit kannattaa laittaa <i>describe</i>-lohkoon jolloin testien tulostus ryhmittyy miellyttävästi:

![](../images/4/5.png)

Testisyötteiden määrittely onnistuu esim. seuraavaan tapaan:

```js
describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })
})
```

Jos et viitsi itse määritellä testisyötteenä käytettäviä blogeja, saat valmiin listan [täältä](https://github.com/fullstack-hy2019/misc/blob/master/blogs_for_test.md)

Törmäät varmasti testien tekemisen yhteydessä erinäisiin ongelmiin. Pidä mielessä osassa 3 käsitellyt [debuggaukseen](osa3/tietojen_tallettaminen_mongo_db_tietokantaan#node-sovellusten-debuggaaminen) liittyvät asiat, voit testejäkin suorittaessasi printtailla konsoliin komennolla _console.log_. Myös debuggerin käyttö testejä suorittaessa on mahdollista, ohje [täällä](https://jestjs.io/docs/en/troubleshooting).

**HUOM:** jos jokin testi ei mene läpi, ei ongelmaa korjatessa kannata suorittaa kaikkia testejä, vaan ainoastaan rikkinäistä testiä hyödyntäen [only](https://facebook.github.io/jest/docs/en/api.html#testonlyname-fn-timeout)-metodia. 

Toinen, tapa suorittaa yksittäinen testi (tai describe-lohko) on kutsua jestiä suoraan ja määritellä sille suoritettava testi argumentin [-t](https://jestjs.io/docs/en/cli.html) avulla:

```js
npx jest -t 'when list has only one blog equals the likes of that'
```

#### 4.5*: apufunktioita ja yksikkötestejä, osa 3

Määrittele funktio _favoriteBlog_ joka saa parametrikseen taulukollisen blogeja. Funktio selvittää millä blogilla on eniten likejä. Jos suosikkeja on monta, riittää että funktio palauttaa niistä jonkun.

Paluuarvo voi olla esim. seuraavassa muodossa:

```js
{
  title: "Canonical string reduction",
  author: "Edsger W. Dijkstra",
  likes: 12
}
```

**Huom**, että kun vertailet olioita, metodi [toEqual](https://jestjs.io/docs/en/expect#toequalvalue) on todennäköisesti se mitä haluat käyttää sillä [toBe](https://jestjs.io/docs/en/expect#tobevalue)-vertailu, joka sopii esim. lukujen ja merkkijonojen vertailuun vaatisi olioiden vertailussa, että oliot ovat samat, pelkkä sama sisältöisyys ei riitä.

Tee myös tämän ja seuraavien kohtien testit kukin oman <i>describe</i>-lohkon sisälle.

#### 4.6*: apufunktioita ja yksikkötestejä, osa 4

Tämä ja seuraava tehtävä ovat jo hieman haastavampia. Tehtävien tekeminen ei ole osan jatkon kannalta oleellista, eli voi olla hyvä idea palata näihin vasta kun muu osa on kahlattu läpi.

Tehtävän tekeminen onnistuu hyvin ilman mitään kirjastojakin, mutta tämä saattaa olla hyvä paikka tutustua kokoelmien käsittelyä suuresti helpottavaan [Lodash](https://lodash.com/)-kirjastoon.

Määrittele funktio _mostBlogs_ joka saa parametrikseen taulukollisen blogeja. Funktio selvittää <i>kirjoittajan</i>, kenellä on eniten blogeja. Funktion paluuarvo kertoo myös ennätysblogaajan blogien määrän:

```js
{
  author: "Robert C. Martin",
  blogs: 3
}
```

Jos ennätysblogaajia on monta, riittää että funktio palauttaa niistä jonkun.

#### 4.7*: apufunktioita ja yksikkötestejä, osa 5

Määrittele funktio _mostLikes_ joka saa parametrikseen taulukollisen blogeja. Funktio selvittää kirjoittajan, kenen blogeilla on eniten likejä. Funktion paluuarvo kertoo myös suosikkiblogaajan likejen yhteenlasketun määrän:

```js
{
  author: "Edsger W. Dijkstra",
  likes: 17
}
```

Jos suosikkiblogaajia on monta, riittää että funktio palauttaa niistä jonkun.

</div>

<div class="content">

### Backendin testaaminen

Ruvetaan nyt tekemään testejä backendille. Koska backend ei sisällä monimutkaista laskentaa, ei yksittäisiä funktioita testaavia [yksikkötestejä](https://en.wikipedia.org/wiki/Unit_testing) oikeastaan kannata tehdä. Ainoa potentiaalinen yksikkötestattava asia olisi muistiinpanojen metodi _toJSON_. 

Joissain tilanteissa voisi olla mielekästä suorittaa ainakin osa backendin testauksesta siten, että oikea tietokanta eristettäisiin testeistä ja korvattaisiin "valekomponentilla" eli mockilla. Eräs tähän sopiva ratkaisu olisi [mongo-mock](https://github.com/williamkapke/mongo-mock).

Koska sovelluksemme backend on koodiltaan kuitenkin suhteellisen yksinkertainen, päätämme testata sitä kokonaisuudessaan, siten että myös testeissä käytetään tietokantaa. Tämän kaltaisia, useita sovelluksen komponentteja yhtäaikaa käyttäviä testejä voi luonnehtia [integraatiotesteiksi](https://en.wikipedia.org/wiki/Integration_testing).

### test-ympäristö

Edellisen osan luvussa [Tietokantaa käyttävän version vieminen tuotantoon](/osa3/validointi_ja_es_lint#tietokantaa-kayttavan-version-vieminen-tuotantoon) mainitsimme, että kun sovellusta suoritetaan Herokussa, on se <i>production</i>-moodissa.

Noden konventiona on määritellä projektin suoritusmoodi ympäristömuuttujan <i>NODE\_ENV</i> avulla. Lataammekin sovelluksen nykyisessä versiossa tiedostossa <i>.env</i> määritellyt ympäristömuuttujat ainoastaan jos sovellus <i>ei ole</i> production moodissa:

```js
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
```

Yleinen käytäntö on määritellä sovelluksille omat moodinsa myös sovelluskehitykseen ja testaukseen.

Määritellään nyt tiedostossa <i>package.json</i>, että testejä suorittaessa sovelluksen <i>NODE\_ENV</i> saa arvokseen <i>test</i>:

```json
{
  // ...
  "scripts": {
    "start": "NODE_ENV=production node index.js",
    "watch": "NODE_ENV=development nodemon index.js",
    "test": "NODE_ENV=test jest --verbose --runInBand",
    "lint": "eslint ."
  },
  // ...
}
```

Lisäsimme testit suorittavaan npm-skriptiin myös määreen [runInBand](https://jestjs.io/docs/en/cli.html#runinband) joka estää testien rinnakkaisen suorituksen. Tämä tarkennus on viisainta tehdä kun testimme tulevat käyttämään tietokantaa.

Samalla määriteltiin, että suoritettaessa sovellusta komennolla _npm run watch_ eli nodemonin avulla, on sovelluksen moodi <i>development</i>. Jos sovellusta suoritetaan normaalisti Nodella, on moodiksi määritelty <i>production</i>.

Määrittelyssämme on kuitenkin pieni ongelma, se ei toimi windowsilla. Tilanne korjautuu asentamalla kirjasto [cross-env](https://www.npmjs.com/package/cross-env) komennolla

```bash
npm install --save-dev cross-env
```

ja muuttamalla <i>package.js</i> kaikilla käyttöjärjestelmillä toimivaan muotoon

```json
{
  // ...
  "scripts": {
    "start": "cross-env NODE_ENV=production node index.js",
    "watch": "cross-env NODE_ENV=development nodemon index.js",
    "test": "cross-env NODE_ENV=test jest --verbose --runInBand",
    "lint": "eslint ."
  },
  // ...
}
```

Nyt sovelluksen toimintaa on mahdollista muokata sen suoritusmoodiin perustuen. Eli voimme määritellä, esim. että testejä suoritettaessa ohjelma käyttää erillistä, testejä varten luotua tietokantaa.

Sovelluksen testikanta voidaan luoda tuotantokäytön ja sovelluskehityksen tapaan [mlabiin](https://mlab.com/). Ratkaisu ei ole optimaalinen erityisesti, jos sovellusta on tekemässä yhtä aikaa useita henkilöitä. Testien suoritus nimittäin yleensä edellyttää, että samaa tietokantainstanssia ei ole yhtä aikaa käyttämässä useampia testiajoja.

Testaukseen kannattaakin käyttää verkossa olevaa jaettua tietokantaa mieluummin esim. sovelluskehittäjän paikallisen koneen tietokantaa. Optimiratkaisu olisi tietysti se, että jokaista testiajoa varten olisi käytettävissä oma tietokanta, sekin periaatteessa onnistuu "suhteellisen helposti" mm. [keskusmuistissa toimivan Mongon](https://docs.mongodb.com/manual/core/inmemory/) ja [docker](https://www.docker.com)-kontainereiden avulla. Etenemme kuitenkin nyt lyhyemmän kaavan mukaan ja käytetään testikantana normaalia Mongoa.

Muutetaan konfiguraatiot suorittavaa moduulia seuraavasti:

```js
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

let port = process.env.PORT
let mongoUrl = process.env.MONGODB_URI

// highlight-start
if (process.env.NODE_ENV === 'test') {
  mongoUrl = process.env.TEST_MONGODB_URI
}
// highlight-end

module.exports = {
  mongoUrl,
  port,
}
```

Koodi siis lataa ympäristömuuttujat tiedostosta <i>.env</i> jos se <i>ei ole</i> tuotantomoodissa. Tuotantomoodissa käytetään Herokuun asetettuja ympäristömuuttujia.

Tiedostossa <i>.env</i> on nyt määritelty <i>erikseen</i> sekä sovelluskehitysympäristön että testausympäristön tietokannan osoite (esimerkissä molemmat ovat sovelluskehityskoneen lokaaleja mongo-kantoja):

```bash
MONGODB_URI=mongodb://fullstack:secred@ds161224.mlab.com:61224/fullstack2019-notes
PORT=3001

// highlight-start
TEST_MONGODB_URI=mongodb://fullstack:secred@ds163054.mlab.com:63054/fullstack2019-notes-test
// highlight-end
```

Omatekemämme eri ympäristöjen konfiguroinnista huolehtiva _config_-moduuli toimii hieman samassa hengessä kuin [node-config](https://github.com/lorenwest/node-config)-kirjasto. Omatekemä konfigurointiympäristö sopii tarkoitukseemme, sillä sovellus on yksinkertainen ja oman konfiguraatio-moduulin tekeminen on myös jossain määrin opettavaista. Isommissa sovelluksissa kannattaa harkita valmiiden kirjastojen, kuten [node-config](https://github.com/lorenwest/node-config):in käyttöä.

Muualle koodiin ei muutoksia tarvita.

Sovelluksen tämänhetkinen koodi on kokonaisuudessaan [githubissa](https://github.com/fullstack-hy2019/part3-notes-backend/tree/part4-2), branchissä <i>part4-2</i>.

### supertest

Käytetään API:n testaamiseen Jestin apuna [supertest](https://github.com/visionmedia/supertest)-kirjastoa.

Kirjasto asennetaan kehitysaikaiseksi riippuvuudeksi komennolla

```bash
npm install --save-dev supertest
```

Luodaan heti ensimmäinen testi tiedostoon <i>tests/note_api.test.js</i>

```js
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

afterAll(() => {
  mongoose.connection.close()
})
```

Testi importtaa tiedostoon <i>app.js</i> määritellyn Express-sovelluksen ja käärii sen  funktion <i>supertest</i> avulla ns. [superagent](https://github.com/visionmedia/superagent)-olioksi. Tämä olio sijoitetaan muuttujaan <i>api</i> ja sen kautta testit voivat tehdä HTTP-pyyntöjä backendiin.

Testimetodi tekee HTTP GET -pyynnön osoitteeseen <i>api/notes</i> ja varmistaa, että pyyntöön vastataan statuskoodilla 200 ja että data palautetaan oikeassa muodossa, eli että <i>Content-Type</i>:n arvo on <i>application/json</i>.

Testissä on muutama detalji joihin tutustumme vasta [hieman myöhemmin](#async-await) tässä osassa. Testikoodin määrittelevä nuolifunktio alkaa sanalla <i>async</i> ja <i>api</i>-oliolle tehtyä metodikutsua edeltää sama <i>await</i>. Teemme ensin muutamia testejä ja tutustumme sen jälkeen async/await-magiaan. Tällä hetkellä niistä ei tarvitse välittää, kaikki toimii kun kirjoitat testimetodit esimerkin mukaan. Async/await-syntaksin käyttö liittyy siihen, että palvelimelle tehtävät pyynnöt ovat <i>asynkronisia</i> operaatioita. [Async/await-kikalla](https://facebook.github.io/jest/docs/en/asynchronous.html) saamme pyynnön näyttämään koodin tasolla synkroonisesti toimivalta.

Kaikkien testien (joita siis tällä kertaa on vain yksi) päätteeksi on vielä lopputoimenpiteenä katkaistava mongoosen käyttämä tietokantayhteys. Tämä onnistuu helposti metodissa [afterAll](https://facebook.github.io/jest/docs/en/api.html#afterallfn-timeout):

```js
afterAll(() => {
  mongoose.connection.close()
})
```

Pieni mutta tärkeä huomio: eristimme tämän osan [alussa](http://localhost:8000/osa4/sovelluksen_rakenne_ja_testauksen_alkeet#sovelluksen-rakenne) Express-sovelluksen tiedostoon <i>app.js</i> ja tiedoston <i>index.js</i> rooliksi jäi sovelluksen käynnistäminen määriteltyyn porttiin Noden <i>http</i>-olion avulla:

```js
const app = require('./app') // varsinainen Express-sovellus
const http = require('http')
const config = require('./utils/config')

const server = http.createServer(app)

server.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})
```

Testit käyttävät ainoastaan tiedostossa <i>app.js</i> määriteltyä express-sovellusta:
```js
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app') // highlight-line

const api = supertest(app) // highlight-line

// ...
```

Supertestin dokumentaatio toteaa seuraavasti

> <i>if the server is not already listening for connections then it is bound to an ephemeral port for you so there is no need to keep track of ports.</i>

eli Supertest huolehtii testattavan sovelluksen käynnistämisestä sisäisesti käyttämäänsä porttiin.

Tehdään pari testiä lisää:

```js
test('there are five notes', async () => {
  const response = await api.get('/api/notes')

  expect(response.body.length).toBe(3)
})

test('the first note is about HTTP methods', async () => {
  const response = await api.get('/api/notes')

  expect(response.body[0].content).toBe('HTML on helppoa')
})
```

Molemmat testit sijoittavat pyynnön vastauksen muuttujaan _response_ ja toisin kuin edellinen testi, joka käytti _supertestin_ mekanismeja statuskoodin ja vastauksen headereiden oikeellisuuden varmistamiseen, tällä kertaa tutkitaan vastauksessa olevan datan, eli <i>response.body</i>:n oikeellisuutta Jestin [expect](https://facebook.github.io/jest/docs/en/expect.html#content):in avulla.

Async/await-kikan hyödyt tulevat nyt selkeästi esiin. Normaalisti tarvitsisimme asynkronisten pyyntöjen vastauksiin käsille pääsemiseen promiseja ja takaisinkutsuja, mutta nyt kaikki menee mukavasti:

```js
const res = await api.get('/api/notes')

// tänne tullaan vasta kun edellinen komento eli HTTP-pyyntö on suoritettu
// muuttujassa res on nyt HTTP-pyynnön tulos
expect(res.body.length).toBe(3)
```

### Loggeri

HTTP-pyyntöjen tiedot konsoliin kirjoittava middleware häiritsee hiukan testien tulostusta. Konsoliin tulostaminen onkin viisainta estää silloin kuin sovellus on testausmoodissa. Eristetään samalla kaikki konsoliin tulostelu omaan moduliinsa <i>utils/logger.js</i>:

```js
const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params)
  }
}

const error = (...params) => {
  console.error(...params)
}

module.exports = {
  info, error
}
```

Loggeri tarjoaa kaksi funktiota, joista _info_ ei tulosta mitään sovelluksen ollessa testausmoodissa. Virhetilanteisiin tarkoitettu funktio _error_ tulostaa konsoliin myös testausmoodissa.

Otetaan loggeri käyttöön muualla sovelluksessa. Muutoksia tulee middlewaret määrittelevään tiedostoon

```js
const logger = require('./logger') // highlight-line

const requestLogger = (request, response, next) => {
  // highlight-start
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  // highlight-end
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message) // highlight-line

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}
```

ja express-sovelluksen määrittelevään tiedostoon <i>app.js</i>:

```js 
// ...
const logger = require('./utils/logger') // highlight-line

logger.info('connecting to', config.MONGODB_URI) // highlight-line

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    logger.info('connected to MongoDB') // highlight-line
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message) // highlight-line
  })

// ...
```

Logauksen eristäminen omaan moduulinsa vastuulle on monellakin tapaa järkevää. Jos esim. päätämme ruveta kirjoittamaan logeja tiedostoon tai keräämään ne johonkin ulkoiseen palveuun kuten [graylog](https://www.graylog.org/) tai [papertrail](https://papertrailapp.com), on muutos helppo tehdä yhteen paikkaan.

### Tietokannan alustaminen ennen testejä

Testaus vaikuttaa helpolta ja testit menevät läpi. Testimme ovat kuitenkin huonoja, niiden läpimeno riippuu tietokannan tilasta (joka sattuu omassa testikannassani olemaan sopiva). Jotta saisimme robustimmat testit, tulee tietokannan tila nollata testien alussa ja sen jälkeen laittaa kantaan hallitusti testien tarvitsema data.

Testimme käyttää jo jestin metodia [afterAll](https://facebook.github.io/jest/docs/en/api.html#afterallfn-timeout) sulkemaan backendin testien suoritusten jälkeen. Jest tarjoaa joukon muitakin [funktioita](https://facebook.github.io/jest/docs/en/setup-teardown.html#content), joiden avulla voidaan suorittaa operaatioita ennen yhdenkään testin suorittamista tai ennen jokaisen testin suoritusta.

Päätetään alustaa tietokanta ennen <i>jokaisen testin suoritusta,</i> eli funktiossa [beforeEach](https://jestjs.io/docs/en/api.html#aftereachfn-timeout):

```js
const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Note = require('../models/note')

const initialNotes = [
  {
    content: 'HTML on helppoa',
    important: false,
  },
  {
    content: 'HTTP-protokollan tärkeimmät metodit ovat GET ja POST',
    important: true,
  },
]

beforeEach(async () => {
  await Note.remove({})

  let noteObject = new Note(initialNotes[0])
  await noteObject.save()

  noteObject = new Note(initialNotes[1])
  await noteObject.save()
})
```

Tietokanta siis tyhjennetään aluksi ja sen jälkeen kantaan lisätään kaksi taulukkoon _initialNotes_ talletettua muistiinpanoa. Näin testien suoritus aloitetaan aina hallitusti samasta tilasta.

Muutetaan kahta jälkimmäistä testiä vielä seuraavasti:

```js
test('all notes are returned', async () => {
  const response = await api.get('/api/notes')

  expect(response.body.length).toBe(initialNotes.length) // highlight-line
})

test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes')

  const contents = response.body.map(r => r.content) // highlight-line

  expect(contents).toContain(
    'HTTP-protokollan tärkeimmät metodit ovat GET ja POST' // highlight-line
  )
})
```

Huomaa jälkimmäisen testin ekspektaatio. Komennolla <code>response.body.map(r => r.content)</code> muodostetaan taulukko API:n palauttamien muistiinpanojen sisällöistä. Jestin [toContain](https://facebook.github.io/jest/docs/en/expect.html#tocontainitem)-ekspektaatiometodilla tarkistetaan että parametrina oleva muistiinpano on kaikkien API:n palauttamien muistiinpanojen joukossa.

### Testien suorittaminen yksitellen

Komento _npm test_ suorittaa projektin kaikki testit. Kun olemme vasta tekemässä testejä, on useimmiten järkevämpää suorittaa kerrallaan ainoastaan yhtä tai muutamaa testiä. Jest tarjoaa tähän muutamia vaihtoehtoja. Eräs näistä on komennon [only](https://jestjs.io/docs/en/api#testonlyname-fn-timeout) käyttö. Jos testit on kirjoitettu useaan tiedotoon, ei menetelmä ole kovin hyvä.

Parempi vaihtoehto on käyttää jestiä suoraan, ilman npm:ää. Tällöin on mahdollista määritellä tarkasti mitä testejä jest suorittaa. Seuraava komento suorittaa ainoastaan tiedostossa <i>tests/note_api.test.js</i> olevat testit

```js
npx est tests/note_api.test.js --runInBand
```

Parametrin <i>-t</i> avulla voidaan suorittaa testejä nimen perusteella:

```js
npx jest -t 'a specific note is within the returned notes'
```

Parametri voi viitata testin tai describe-lohkon nimeen. Parametrina voidaan antaa myös nimen osa. Seuraava komento suorittaisi kaikki testit, joiden nimessä on sana <i>notes</i>:

```js
npx jest -t 'notes' --runInBand
```

Jos asennat koneellesi jestin <i>globaalisti</i>, eli komennolla

```js
npm install -g jest
```

testien suoritus onnistuu suoraan komennolla _jest_. Globaaliin asennukseen tarvitset pääkäyttäjän oikeudet.

### async-await

Ennen kuin teemme lisää testejä, tarkastellaan tarkemmin mitä _async_ ja _await_ tarkoittavat.

Async- ja await ovat ES7:n mukanaan tuoma uusi syntaksi, joka mahdollistaa <i>promisen palauttavien asynkronisten funktioiden</i> kutsumisen siten, että kirjoitettava koodi näyttää synkroniselta.

Esim. muistiinpanojen hakeminen tietokannasta hoidetaan promisejen avulla seuraavasti:

```js
Note.find({}).then(notes => {
  console.log('operaatio palautti seuraavat muistiinpanot', notes)
})
```

Metodikutsu _Note.find()_ palauttaa promisen, ja saamme itse operaation tuloksen rekisteröimällä promiselle tapahtumankäsittelijän metodilla _then_.

Kaikki operaation suorituksen jälkeinen koodi kirjoitetaan tapahtumankäsittelijään. Jos haluaisimme tehdä peräkkäin useita asynkronisia funktiokutsuja, menisi tilanne ikävämmäksi. Joutuisimme tekemään kutsut tapahtumankäsittelijästä. Näin syntyisi potentiaalisesti monimutkaista koodia, pahimmassa tapauksessa jopa niin sanottu [callback-helvetti](http://callbackhell.com/).

[Ketjuttamalla promiseja](https://javascript.info/promise-chaining) tilanne pysyy jollain tavalla hallinnassa, callback-helvetin eli monien sisäkkäisten callbackien sijaan saadaan aikaan siistihkö _then_-kutsujen ketju. Olemmekin nähneet jo kurssin aikana muutaman sellaisen. Seuraavassa vielä erittäin keinotekoinen esimerkki, joka hakee ensin kaikki muistiinpanot ja sitten tuhoaa niistä ensimmäisen:

```js
Note.find({})
  .then(notes => {
    return notes[0].remove()
  })
  .then(response => {
    console.log('the first note is removed')
    // more code here
  })
```

Then-ketju on ok, mutta parempaankin pystytään. Jo ES6:ssa esitellyt [generaattorifunktiot](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) mahdollistivat [ovelan tavan](https://github.com/getify/You-Dont-Know-JS/blob/master/async%20%26%20performance/ch4.md#iterating-generators-asynchronously) määritellä asynkronista koodia siten että se "näyttää synkroniselta". Syntaksi ei kuitenkaan ole täysin luonteva ja sitä ei käytetä kovin yleisesti.

ES7:ssa _async_ ja _await_ tuovat generaattoreiden tarjoaman toiminnallisuuden ymmärrettävästi ja syntaksin puolesta selkeällä tavalla koko Javascript-kansan ulottuville.

Voisimme hakea tietokannasta kaikki muistiinpanot [await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)-operaattoria hyödyntäen seuraavasti:

```js
const notes = await Note.find({})

console.log('operaatio palautti seuraavat muistiinpanot ', notes)
```

Koodi siis näyttää täsmälleen synkroniselta koodilta. Suoritettavan koodinpätkän suhteen tilanne on se, että suoritus pysähtyy komentoon <em>const notes = await Note.find({})</em> ja jatkuu kyselyä vastaavan promisen <i>fulfillmentin</i> eli onnistuneen suorituksen jälkeen seuraavalta riviltä. Kun suoritus jatkuu, promisea vastaavan operaation tulos on muuttujassa _notes_.

Ylempänä oleva monimutkaisempi esimerkki suoritettaisiin awaitin avulla seuraavasti:

```js
const notes = await Note.find({})
const response = await notes[0].remove()

console.log('the first note is removed')
```

Koodi siis yksinkertaistuu huomattavasti verrattuna promiseja käyttävään then-ketjuun.

Awaitin käyttöön liittyy parikin tärkeää seikkaa. Jotta asynkronisia operaatioita voi kutsua awaitin avulla, niiden täytyy palauttaa promiseja. Tämä ei sinänsä ole ongelma, sillä myös "normaaleja" callbackeja käyttävä asynkroninen koodi on helppo kääriä promiseksi.

Mistä tahansa kohtaa Javascript-koodia ei awaitia kuitenkaan pysty käyttämään. Awaitin käyttö onnistuu ainoastaan jos ollaan [async](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)-funktiossa.

Eli jotta edelliset esimerkit toimisivat, on ne suoritettava async-funktioiden sisällä, huomaa funktion määrittelevä rivi:

```js
const main = async () => { // highlight-line
  const notes = await Note.find({})
  console.log('operaatio palautti seuraavat muistiinpanot', notes)

  const notes = await Note.find({})
  const response = await notes[0].remove()

  console.log('the first note is removed')
}

main() // highlight-line
```

Koodi määrittelee ensin asynkronisen funktion, joka sijoitetaan muuttujaan _main_. Määrittelyn jälkeen koodi kutsuu metodia komennolla <code>main()</code>

### async/await backendissä

Muutetaan nyt backend käyttämään asyncia ja awaitia. Koska kaikki asynkroniset operaatiot tehdään joka tapauksessa funktioiden sisällä, awaitin käyttämiseen riittää, että muutamme routejen käsittelijät async-funktioiksi.

Kaikkien muistiinpanojen hakemisesta vastaava route muuttuu seuraavasti:

```js
notesRouter.get('/', async (request, response) => { 
  const notes = await Note.find({})
  response.json(notes.map(note => note.toJSON()))
})
```

Voimme varmistaa refaktoroinnin onnistumisen selaimella, sekä suorittamalla juuri määrittelemämme testit.

Sovelluksen tämänhetkinen koodi on kokonaisuudessaan [githubissa](https://github.com/fullstack-hy2019/part3-notes-backend/tree/part4-3), branchissa <i>part4-3</i>.

### Lisää testejä ja backendin refaktorointia

Koodia refaktoroidessa vaanii aina [regression](https://en.wikipedia.org/wiki/Regression_testing) vaara, eli on olemassa riski, että jo toimineet ominaisuudet hajoavat. Tehdäänkin muiden operaatioiden refaktorointi siten, että ennen koodin muutosta tehdään jokaiselle API:n routelle sen toiminnallisuuden varmistavat testit.

Aloitetaan lisäysoperaatiosta. Tehdään testi, joka lisää uuden muistiinpanon ja tarkistaa, että API:n palauttamien muistiinpanojen määrä kasvaa, ja että lisätty muistiinpano on palautettujen joukossa:

```js
test('a valid note can be added ', async () => {
  const newNote = {
    content: 'async/await yksinkertaistaa asynkronisten funktioiden kutsua',
    important: true,
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/notes')

  const contents = response.body.map(r => r.content)

  expect(response.body.length).toBe(initialNotes.length + 1)
  expect(contents).toContain(
    'async/await yksinkertaistaa asynkronisten funktioiden kutsua'
  )
})
```

Kuten odotimme ja toivoimme, menee testi läpi.

Tehdään myös testi, joka varmistaa, että muistiinpanoa, jolle ei ole asetettu sisältöä, ei talleteta

```js
test('note without content is not added', async () => {
  const newNote = {
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(400)

  const response = await api.get('/api/notes')

  expect(response.body.length).toBe(initialNotes.length)
})
```

Molemmat testit tarkastavat lisäyksen jälkeen mihin tilaan tietokanta on päätynyt hakemalla kaikki sovelluksen muistiinpanot

```js
const response = await api.get('/api/notes')
```

Sama tulee toistumaan myöhemminkin monissa testeissä ja operaatio kannattaakin eristää apufunktioon. Sijoitetaan se testien yhteyteen tiedostoon <i>tests/test_helper.js</i> 

```js
const Note = require('../models/note')

const initialNotes = [
  {
    content: 'HTML on helppoa',
    important: false
  },
  {
    content: 'HTTP-protokollan tärkeimmät metodit ovat GET ja POST',
    important: true
  }
]

const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon' })
  await note.save()
  await note.remove()

  return note._id.toString()
}

const notesInDb = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}

module.exports = {
  initialNotes, nonExistingId, notesInDb
}
```

Moduuli määrittelee funktion _notesInDb_, jonka avulla voidaan tarkastaa sovelluksen tietokannassa olevat muistiinpanot. Tietokantaan alustettava sisältö _initialNotes_ on siirretty samaan tiedostoon. Määrittelimme myös tulevan varalta funktion _nonExistingId_, jonka avulla on mahdollista luoda tietokantaid, joka ei kuulu millekään kannassa olevalle oliolle.

Testit muuttuvat muotoon

```js
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper') // highlight-line
const app = require('../app')
const api = supertest(app)

const Note = require('../models/note')

beforeEach(async () => {
  await Note.remove({})

  let noteObject = new Note(helper.initialNotes[0]) // highlight-line
  await noteObject.save()

  noteObject = new Note(helper.initialNotes[1]) // highlight-line
  await noteObject.save()
})

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all notes are returned', async () => {
  const response = await api.get('/api/notes')

  expect(response.body.length).toBe(helper.initialNotes.length) // highlight-line
})

test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes')

  const contents = response.body.map(r => r.content)
  expect(contents).toContain(
    'HTTP-protokollan tärkeimmät metodit ovat GET ja POST'
  )
})

test('a valid note can be added ', async () => {
  const newNote = {
    content: 'async/await yksinkertaistaa asynkronisten funktioiden kutsua',
    important: true,
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(200)
    .expect('Content-Type', /application\/json/)


  const notesAtEnd = await helper.notesInDb() // highlight-line
  expect(notesAtEnd.length).toBe(helper.initialNotes.length + 1) // highlight-line

  const contents = notesAtEnd.map(n => n.content) // highlight-line
  expect(contents).toContain(
    'async/await yksinkertaistaa asynkronisten funktioiden kutsua'
  )
})

test('note without content is not added', async () => {
  const newNote = {
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(400)

  const notesAtEnd = await helper.notesInDb() // highlight-line

  expect(notesAtEnd).toBe(helper.initialNotes.length) // highlight-line
})

afterAll(() => {
  mongoose.connection.close()
}) 
```

Promiseja käyttävä koodi toimii nyt ja testitkin menevät läpi. Olemme valmiit muuttamaan koodin käyttämään async/await-syntaksia.

Koodi muuttuu seuraavasti (huomaa, että käsittelijän alkuun on laitettava määre _async_):

```js
notesRouter.post('/', async (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important === undefined ? false : body.important,
    date: new Date(),
  })

  const savedNote = await note.save()
  response.json(savedNote.toJSON())
})
```

Koodiin jää kuitenkin pieni ongelma: virhetilanteita ei nyt käsitellä ollenkaan. Miten niiden suhteen tulisi toimia?

### virheiden käsittely ja async/await

Jos sovellus POST-pyyntöä käsitellessään aiheuttaa jonkinlaisen ajonaikaisen virheen, syntyy jälleen tuttu tilanne:

![](../images/4/6.png)

eli käsittelemätön promisen rejektoituminen. Pyyntöön ei vastata tilanteessa mitenkään.

Async/awaitia käyttäessä kannattaa käyttää vanhaa kunnon _try/catch_-mekanismia virheiden käsittelyyn:

```js
notesRouter.post('/', async (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important === undefined ? false : body.important,
    date: new Date(),
  })
  // highlight-start
  try { 
    const savedNote = await note.save()
    response.json(savedNote.toJSON())
  } catch(exception) {
    next(exception)
  }
  // highlight-end
})
```

Catch-lohkossa siis ainoastaan kutsutaan funktiota _next_ siirretään poikkeuksen käsittely virheidenkäittelymiddlewarelle.

Muutoksen jälkeen testit menevät läpi.

Tehdään sitten testit yksittäisen muistiinpanon tietojen katsomiselle ja muistiinpanon poistolle:

```js
test('a specific note can be viewed', async () => {
  const notesAtStart = await helper.notesInDb()

  const noteToView = notesAtStart[0]

// hightlight-start
  const resultNote = await api
    .get(`/api/notes/${noteToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)
// hightlight-end

  expect(resultNote.body).toEqual(noteToView)
})

test('a note can be deleted', async () => {
  const notesAtStart = await helper.notesInDb()
  const noteToDelete = notesAtStart[0]

// hightlight-start
  await api
    .delete(`/api/notes/${noteToDelete.id}`)
    .expect(204)
// hightlight-end

  const notesAtEnd = await helper.notesInDb()

  expect(notesAtEnd.length).toBe(
    helper.initialNotes.length - 1
  )

  const contents = notesAtEnd.map(r => r.content)

  expect(contents).not.toContain(noteToDelete.content)
})
```

Molemmat testit ovat rakenteeltaan samankaltaisia. Alustusvaiheessa ne hakevat kannasta yksittäisen muistiinpanon. Tämän jälkeen on itse testattava operaatio, joka on koodissa korostettuna. Lopussa tarkastetaan, että operaation tulos on haluttu. 

Testit menevät läpi, joten voimme turvallisesti refaktoroida testatut toutet käyttämään async/awaitia:

```js
notesRouter.get('/:id', async (request, response, next) => {
  try{
    const note = await Note.findById(request.params.id)
    if (note) {
      response.json(note.toJSON())
    } else {
      response.status(404).end()
    }
  } catch(exception) {
    next(exception)
  }
})

notesRouter.delete('/:id', async (request, response, next) => {
  try {
    await Note.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})
```

Async/await ehkä selkeyttää koodia jossain määrin, mutta saavutettava hyöty ei ole sovelluksessamme vielä niin iso mitä se tulee olemaan jos asynkronisia kutsuja on tehtävä useampia. Async/awaitin 'hinta' on poikkeusten käsittelyn edellyttämä iso <i>try/catch</i>-rakenne. Kaikki routejen käsittelijät noudattavatkin samaa kaavaa

```js
try {
  // do the async operations here
} catch(exception) {
  next(exception)
}
```

Mieleen herää kysymys, olisiko koodia mahdollista refaktoroida siten, että <i>catch</i> saataisiin refaktoroitua ulos metodeista? Siihen on olemassa eräitä ratkaisuja mutta koska ne muuttavat koodia kompleksisemmaksi, jätämme sen ennalleen.

Kaikki eivät ole vakuuttuneita siitä, että async/await on hyvä lisä Javascriptiin, lue esim. [ES7 async functions - a step in the wrong direction](https://spion.github.io/posts/es7-async-await-step-in-the-wrong-direction.html)

Sovelluksen tämänhetkinen koodi on kokonaisuudessaan [githubissa](https://github.com/FullStack-HY/part3-notes-backend/tree/part4-4), haarassa <i>part4-4</i>. Samassa on "vahingossa" mukana testeistä seuraavan luvun jälkeinen paranneltu versio.


### Testin beforeEach-metodin optimointi

Palataan takaisin testien pariin, ja tarkastellaan määrittelemäämme testit alustavaa funktiota _beforeEach_:

```js
beforeEach(async () => {
  await Note.remove({})

  let noteObject = new Note(helper.initialNotes[0])
  await noteObject.save()

  noteObject = new Note(helper.initialNotes[1])
  await noteObject.save()
})
```

Funktio tallettaa tietokantaan taulukon _helper.initialNotes_ nollannen ja ensimmäisen alkion, kummankin erikseen taulukon alkioita indeksöiden. Ratkaisu on ok, mutta jos haluaisimme tallettaa alustuksen yhteydessä kantaan useampia alkioita, olisi toisto parempi ratkaisu:

```js
beforeEach(async () => {
  await Note.remove({})
  console.log('cleared')

  helper.initialNotes.forEach(async (note) => {
    let noteObject = new Note(note)
    await noteObject.save()
    console.log('saved')
  })
  console.log('done')
})

test('notes are returned as json', async () => {
  console.log('entered test')
  // ...
}
```

Talletamme siis taulukossa olevat muistiinpanot tietokantaan _forEach_-loopissa. Testeissä kuitenkin ilmenee jotain häikkää, ja sitä varten koodin sisään on lisätty aputulosteita.

Konsoliin tulostuu

<pre>
cleared
done
entered test
saved
saved
</pre>

Yllättäen ratkaisu ei async/awaitista huolimatta toimi niin kuin oletamme, testin suoritus aloitetaan ennen kuin tietokannan tila on saatu alustettua!

Ongelma on siinä, että jokainen forEach-loopin läpikäynti generoi oman asynkronisen operaation ja _beforeEach_ ei odota näiden suoritusta. Eli forEach:in sisällä olevat _await_-komennot eivät ole funktiossa _beforeEach_ vaan erillisissä funktioissa, joiden päättymistä _beforeEach_ ei odota.

Koska testien suoritus alkaa heti _beforeEach_ metodin suorituksen jälkeen, testien suoritus ehditään aloittamaan ennen kuin tietokanta on alustettu toivottuun alkutilaan.

Toimiva ratkaisu tilanteessa on odottaa asynkronisten talletusoperaatioiden valmistumista _beforeEach_-funktiossa, esim. metodin [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) avulla:

```js
beforeAll(async () => {
  await Note.remove({})

  const helper.noteObjects = initialNotes
    .map(note => new Note(note))
  const promiseArray = noteObjects.map(note => note.save())
  await Promise.all(promiseArray)
})
```

Ratkaisu on varmasti aloittelijalle tiiviydestään huolimatta hieman haastava. Taulukkoon _noteObjects_ talletetaan taulukkossa _helper.initialNotes_ olevaia Javascript-oliota vastaavat _Note_-konstruktorifunktiolla generoidut mongoose-oliot. Seuraavalla rivillä luodaan uusi taulukko, joka _muodostuu promiseista_, jotka saadaan kun jokaiselle _noteObjects_ taulukon alkiolle kutsutaan metodia _save_, eli ne talletetaan kantaan.

Metodin [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) avulla saadaan koostettua taulukollinen promiseja yhdeksi promiseksi, joka valmistuu, eli menee tilaan <i>fulfilled</i> kun kaikki sen parametrina olevan taulukon promiset ovat valmistuneet.
Siispä viimeinen rivi, <em>await Promise.all(promiseArray)</em> odottaa, että kaikki tietokantaan talletetusta vastaavat promiset ovat valmiina, eli alkiot on talletettu tietokantaan.

> Promise.all-metodia käyttäessä päästään tarvittaessa käsiksi sen parametrina olevien yksittäisten promisejen arvoihin, eli promiseja vastaavien operaatioiden tuloksiin. Jos odotetaan promisejen valmistumista _await_-syntaksilla <em>const results = await Promise.all(promiseArray)</em> palauttaa operaatio taulukon, jonka alkioina on _promiseArray_:n promiseja vastaavat arvot samassa järjestyksessä kuin promiset ovat taulukossa.

Promise.all suorittaa kaikkia syötteenä saamiaan promiseja rinnakkain. Jos operaatioiden suoritusjärjestyksellä on merkitystä, voi tämä aiheuttaa ongelmia. Tällöin asynkroniset operaatiot on mahdollista määrittää [for...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of) lohkon sisällä, jonka suoritusjärjestys on taattu.

```js
beforeAll(async () => {
  await Note.remove({})

  for (let note of initialNotes) {
    let noteObject = new Note(note)
    await noteObject.save()
  }
})
```

Javascriptin asynkroninen suoritusmalli aiheuttaakin siis helposti yllätyksiä ja myös async/await-syntaksin kanssa pitää olla koko ajan tarkkana. Vaikka async/await peittää monia promisejen käsittelyyn liittyviä seikkoja, promisejen toiminta on syytä tuntea mahdollisimman hyvin!

</div>

<div class="tasks">

### Tehtäviä

**Huom** materiaalissa käytetään muutamaan kertaan ekspektaatiota [toContain](https://facebook.github.io/jest/docs/en/expect.html#tocontainitem) tarkastettaessa että jokin arvo on taulukossa. Kannattaa huomata, että metodi käyttää samuuden vertailuun ===-operaattoria ja olioiden kohdalla tämä ei ole useinkaan se mitä halutaan ja parempi vaihtoehto onkin [toContainEqual](https://facebook.github.io/jest/docs/en/expect.html#tocontainequalitem).

**Varoitus** Jos huomaat kirjoittavasi sekaisin async/awaitia ja <i>then</i>-kutsuja, on 99% varmaa, että teet jotain väärin. Käytä siis jompaa kumpaa tapaa, älä missään tapauksessa "varalta" molempia.

#### 4.8: blogilistan testit, osa 1

Tee API-tason testit blogilistan osoitteeseen /api/blogs tapahtuvalle HTTP GET -pyynnölle.

Kun testi on valmis, refaktoroi operaatio käyttämään promisejen sijaan async/awaitia.

Huomaa, että joudut tekemään koodiin osan 4 materiaalin tyylin joukon muutoksia (mm. testausympäristön määrittely), jotta saat järkevästi määriteltyä API-tason testejä.

**Huom** testien kehitysvaiheessa ei yleensä kannata suorittaa joka kerta kaikkia testejä, vaan keskittyä yhteen testiin kerrallaan. On useita tapoja, joilla voidaan rajoittaa jestin suorittamia testejä. Esim. komennolla

```bash
npx jest -t 'blogs are returned'
```

voidaan suorittaa ainoastaan ne testit, joiden nimessä esiintyy teksti <i>blogs are returned</i>.

#### 4.9: blogilistan testit, osa 2

Tee testit blogin lisäämiselle, eli osoitteeseen /api/blogs tapahtuvalle HTTP POST -pyynnölle.

Kun testi on valmis, refaktoroi operaatio käyttämään promisejen sijaan async/awaitia.

#### 4.10*: blogilistan testit, osa 3

Tee testi joka varmistaa, että jos kentälle <i>likes</i> ei anneta arvoa, asetetaan sen arvoksi 0. Muiden kenttien sisällöstä ei tässä tehtävässä vielä välitetä.

Laajenna ohjelmaa siten, että testi menee läpi.

#### 4.11*: blogilistan testit, osa 4

Tee testit blogin lisäämiselle, eli osoitteeseen <i>/api/blogs</i> tapahtuvalle HTTP POST -pyynnölle, joka varmistaa, että jos uusi blogi ei sisällä kenttiä <i>title</i> ja <i>url</i>, pyyntöön vastataan statuskoodilla <i>400 Bad request</i>

Laajenna toteutusta siten, että testit menevät läpi.

</div>

<div class="content">

### Testien refaktorintia

Testit ovat tällä hetkellä osittain epätäydelliset, esim. reittejä <i>GET /api/notes/:id</i> ja <i>DELETE /api/notes/:id</i> ei tällä hetkellä testata epävalidien id:iden osalta. Myös testien organisoinnissa on hieman toivomisen varaa, sillä kaikki on kirjoitettu suoraan testifunktion "päätasolle", parempaan luettavuuteen pääsisimme eritellessä loogisesti toisiinsa liittyvät testit <i>describe</i>-lohkoihin.

Jossain määrin parannellut testit seuraavassa:

```js
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Note = require('../models/note')

describe('when there is initially some notes saved', async () => {
  beforeEach(async () => {
    await Note.remove({})

    const noteObjects = helper.initialNotes
      .map(note => new Note(note))
    const promiseArray = noteObjects.map(note => note.save())
    await Promise.all(promiseArray)
  })

  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all notes are returned', async () => {
    const response = await api.get('/api/notes')

    expect(response.body.length).toBe(helper.initialNotes.length)
  })

  test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes')

    const contents = response.body.map(r => r.content)
    expect(contents).toContain(
      'HTTP-protokollan tärkeimmät metodit ovat GET ja POST'
    )
  })

  describe('viewing a specifin note', async () => {

    test('succeeds with a valid id', async () => {
      const notesAtStart = await helper.notesInDb()

      const noteToView = notesAtStart[0]

      const resultNote = await api
        .get(`/api/notes/${noteToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(resultNote.body).toEqual(noteToView)
    })

    test('fails with statuscode 404 if note does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()

      console.log(validNonexistingId)

      await api
        .get(`/api/notes/${validNonexistingId}`)
        .expect(404)
    })

    test('fails with statuscode 400 id is invalid invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api
        .get(`/api/notes/${invalidId}`)
        .expect(400)
    })
  })

  describe('addition of a new note', async () => {
    test('succeeds with valid data', async () => {
      const newNote = {
        content: 'async/await yksinkertaistaa asynkronisten funktioiden kutsua',
        important: true,
      }

      await api
        .post('/api/notes')
        .send(newNote)
        .expect(200)
        .expect('Content-Type', /application\/json/)


      const notesAtEnd = await helper.notesInDb()
      expect(notesAtEnd.length).toBe(helper.initialNotes.length + 1)

      const contents = notesAtEnd.map(n => n.content)
      expect(contents).toContain(
        'async/await yksinkertaistaa asynkronisten funktioiden kutsua'
      )
    })

    test('fails with status code 400 if data invaild', async () => {
      const newNote = {
        important: true
      }

      await api
        .post('/api/notes')
        .send(newNote)
        .expect(400)

      const notesAtEnd = await helper.notesInDb()

      expect(notesAtEnd.length).toBe(helper.initialNotes.length)
    })
  })

  describe('deletion of a note', async () => {
    test('succeeds with status code 200 if id is valid', async () => {
      const notesAtStart = await helper.notesInDb()
      const noteToDelete = notesAtStart[0]

      await api
        .delete(`/api/notes/${noteToDelete.id}`)
        .expect(204)

      const notesAtEnd = await helper.notesInDb()

      expect(notesAtEnd.length).toBe(
        helper.initialNotes.length - 1
      )

      const contents = notesAtEnd.map(r => r.content)

      expect(contents).not.toContain(noteToDelete.content)
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})
```

Testien raportointi tapahtuu <i>describe</i>-lohkojen ryhmittelyn mukaan:

![](../images/4/7.png)

Testeihin jää vielä parannettavaa mutta on jo aika siirtyä eteenpäin.

Käytetty tapa API:n testaamiseen, eli HTTP-pyyntöinä tehtävät operaatiot ja tietokannan tilan tarkastelu Mongoosen kautta ei ole suinkaan ainoa tai välttämättä edes paras tapa tehdä API-tason integraatiotestausta. Universaalisti parasta tapaa testien tekoon ei ole, vaan kaikki on aina suhteessa käytettäviin resursseihin ja testattavaan ohjelmistoon.

Sovelluksen tämänhetkinen koodi on kokonaisuudessaan [githubissa](https://github.com/fullstack-hy2019/part3-notes-backend/tree/part4-5), branchissa <i>part4-5</i>

</div>

<div class="tasks">

## Tehtäviä

#### 4.12* blogilistan laajennus, osa 1

Refaktoroi projektin testit siten, että ne eivät enää ole riippuvaisia siitä, että HTTP GET -operaatioiden testit suoritetaan ennen uusien blogien lisäämisen testaamista. Määrittele myös sopivia apumetodeja, joiden avulla saat poistettua testeistä copypastea:

Testit voivat tämän tehtävän jälkeen noudattaa esim. osan 4 luvun [Testien refaktorointi](/osa4#testien-refaktorointi) tyyliä

```js
const helper = require('./test_helper')

// ...

test('a valid blog can be added', async () => {
  const newBlog = {
    // ....
  }

  const blogsBefore = await helper.blogsInDb()

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAfter = await helper.blogsInDb()

  expect(blogsAfter.length).toBe(blogsBefore.length+1)
  expect(blogsAfter).toContainEqual(newBlog)
})
```

#### 4.13 blogilistan laajennus, osa 2

Toteuta sovellukseen mahdollisuus yksittäisen blogin poistoon.

Käytä async/awaitia. Noudata operaation HTTP-rajapinnan suhteen [RESTful](/osa3#rest)-käytänteitä.

Saat toteuttaa ominaisuudelle testit jos haluat. Jos et, varmista ominaisuuden toimivuus esim. Postmanilla.

#### 4.14* blogilistan laajennus, osa 3

Toteuta sovellukseen mahdollisuus yksittäisen blogin muokkaamiseen.

Käytä async/awaitia.

Tarvitsemme muokkausta lähinnä <i>likejen</i> lukumäärän päivittämiseen. Toiminnallisuuden voi toteuttaa samaan tapaan kuin muistiinpanon päivittäminen toteutettiin [osassa 3](/osa3#loput-operaatiot).

Saat toteuttaa ominaisuudelle testit jos haluat. Jos et, varmista ominaisuuden toimivuus esim. Postmanilla.


</div>