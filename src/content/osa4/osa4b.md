---
mainImage: ../../images/part-4.svg
part: 4
letter: b
---

<div class="content">

Ruvetaan nyt tekemään testejä backendille. Koska backend ei sisällä monimutkaista laskentaa, ei yksittäisiä funktioita testaavia [yksikkötestejä](https://en.wikipedia.org/wiki/Unit_testing) oikeastaan kannata tehdä. Ainoa potentiaalinen yksikkötestattava asia olisi muistiinpanojen metodi _toJSON_. 

Joissain tilanteissa voisi olla mielekästä suorittaa ainakin osa backendin testauksesta siten, että oikea tietokanta eristettäisiin testeistä ja korvattaisiin "valekomponentilla" eli mockilla. Eräs tähän sopiva ratkaisu olisi [mongo-mock](https://github.com/williamkapke/mongo-mock).

Koska sovelluksemme backend on koodiltaan kuitenkin suhteellisen yksinkertainen, päätämme testata sitä kokonaisuudessaan sen tarjoaman REST-apin tasolta, siten että myös testeissä käytetään tietokantaa. Tämän kaltaisia, useita sovelluksen komponentteja yhtäaikaa käyttäviä testejä voi luonnehtia [integraatiotesteiksi](https://en.wikipedia.org/wiki/Integration_testing).

### test-ympäristö

Edellisen osan luvussa [Tietokantaa käyttävän version vieminen tuotantoon](/osa3/validointi_ja_es_lint#tietokantaa-kayttavan-version-vieminen-tuotantoon) mainitsimme, että kun sovellusta suoritetaan Herokussa, on se <i>production</i>-moodissa.

Noden konventiona on määritellä projektin suoritusmoodi ympäristömuuttujan <i>NODE\_ENV</i> avulla. Yleinen käytäntö on määritellä sovelluksille omat moodinsa tuotantokäyttöön,  sovelluskehitykseen ja testaukseen.

Määritellään nyt tiedostossa <i>package.json</i>, että testejä suoritettaessa sovelluksen <i>NODE\_ENV</i> saa arvokseen <i>test</i>:

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

Lisäsimme testit suorittavaan npm-skriptiin myös määreen [runInBand](https://jestjs.io/docs/en/cli.html#runinband), joka estää testien rinnakkaisen suorituksen. Tämä tarkennus on viisainta tehdä sitten, kun testimme tulevat käyttämään tietokantaa.

Samalla määriteltiin, että suoritettaessa sovellusta komennolla _npm run watch_ eli nodemonin avulla, on sovelluksen moodi <i>development</i>. Jos sovellusta suoritetaan normaalisti Nodella, on moodiksi määritelty <i>production</i>.

Määrittelyssämme on kuitenkin pieni ongelma: se ei toimi Windowsilla. Tilanne korjautuu asentamalla kirjasto [cross-env](https://www.npmjs.com/package/cross-env) komennolla

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

Sovelluksen testikanta voidaan luoda tuotantokäytön ja sovelluskehityksen tapaan Mongo DB Atlasiin. Ratkaisu ei ole optimaalinen erityisesti, jos sovellusta on tekemässä yhtä aikaa useita henkilöitä. Testien suoritus nimittäin yleensä edellyttää, että samaa tietokantainstanssia ei ole yhtä aikaa käyttämässä useampia testiajoja.

Testaukseen kannattaisikin käyttää verkossa olevan jaetun tietokannan sijaan mieluummin sovelluskehittäjän paikallisella koneella olevaa tietokantaa. Optimiratkaisu olisi tietysti se, että jokaista testiajoa varten olisi käytettävissä oma tietokanta, sekin periaatteessa onnistuu "suhteellisen helposti" mm. [keskusmuistissa toimivan Mongon](https://docs.mongodb.com/manual/core/inmemory/) ja [docker](https://www.docker.com)-kontainereiden avulla. Etenemme kuitenkin nyt lyhyemmän kaavan mukaan ja käytetään testikantana normaalia Mongoa.

Muutetaan konfiguraatiot suorittavaa moduulia seuraavasti:

```js
require('dotenv').config()

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
MONGODB_URI=mongodb+srv://fullstack:secred@cluster0-ostce.mongodb.net/note-app?retryWrites=true
PORT=3001

// highlight-start
TEST_MONGODB_URI=mongodb+srv://fullstack:fullstack@cluster0-ostce.mongodb.net/note-app-test?retryWrites=true
// highlight-end
```

Oma tekemämme eri ympäristöjen konfiguroinnista huolehtiva _config_-moduuli toimii hieman samassa hengessä kuin [node-config](https://github.com/lorenwest/node-config)-kirjasto. Oma tekemä konfigurointiympäristö sopii tarkoitukseemme, sillä sovellus on yksinkertainen ja oman konfiguraatio-moduulin tekeminen on myös jossain määrin opettavaista. Isommissa sovelluksissa kannattaa harkita valmiiden kirjastojen, kuten [node-config](https://github.com/lorenwest/node-config):in käyttöä.

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

Testissä on muutama detalji joihin tutustumme vasta [hieman myöhemmin](/osa4/backendin_testaaminen#async-await) tässä osassa. Testikoodin määrittelevä nuolifunktio alkaa sanalla <i>async</i> ja <i>api</i>-oliolle tehtyä metodikutsua edeltää sama <i>await</i>. Teemme ensin muutamia testejä ja tutustumme sen jälkeen async/await-magiaan. Tällä hetkellä niistä ei tarvitse välittää, kaikki toimii kun kirjoitat testimetodit esimerkin mukaan. Async/await-syntaksin käyttö liittyy siihen, että palvelimelle tehtävät pyynnöt ovat <i>asynkronisia</i> operaatioita. [Async/await-kikalla](https://facebook.github.io/jest/docs/en/asynchronous.html) saamme pyynnön näyttämään koodin tasolla synkroonisesti toimivalta.

Kaikkien testien (joita siis tällä kertaa on vain yksi) päätteeksi on vielä lopputoimenpiteenä katkaistava Mongoosen käyttämä tietokantayhteys. Tämä onnistuu helposti metodissa [afterAll](https://facebook.github.io/jest/docs/en/api.html#afterallfn-timeout):

```js
afterAll(() => {
  mongoose.connection.close()
})
```

Testejä suorittaessa saattaa tulla seuraava ilmoitus

![](../images/4/8.png)

Jos näin käy, toimitaan [ohjeen](https://mongoosejs.com/docs/jest.html) mukaan ja lisätään projektin hakemiston juureen tiedosto <i>jest.config.js</i> jolla on seuraava sisältö:

```js
module.exports = {
  testEnvironment: 'node'
}
```

Pieni mutta tärkeä huomio: eristimme tämän osan [alussa](/osa4/sovelluksen_rakenne_ja_testauksen_alkeet#sovelluksen-rakenne) Express-sovelluksen tiedostoon <i>app.js</i> ja tiedoston <i>index.js</i> rooliksi jäi sovelluksen käynnistäminen määriteltyyn porttiin Noden <i>http</i>-olion avulla:

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
test('there are three notes', async () => {
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
const response = await api.get('/api/notes')

// tänne tullaan vasta kun edellinen komento eli HTTP-pyyntö on suoritettu
// muuttujassa res on nyt HTTP-pyynnön tulos
expect(response.body.length).toBe(3)
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

Testimme käyttää jo jestin metodia [afterAll](https://facebook.github.io/jest/docs/en/api.html#afterallfn-timeout) sulkemaan tietokannan testien suoritusten jälkeen. Jest tarjoaa joukon muitakin [funktioita](https://facebook.github.io/jest/docs/en/setup-teardown.html#content), joiden avulla voidaan suorittaa operaatioita ennen yhdenkään testin suorittamista tai ennen jokaisen testin suoritusta.

Päätetään alustaa tietokanta ennen <i>jokaisen testin suoritusta,</i> eli funktiossa [beforeEach](https://jestjs.io/docs/en/api.html#aftereachfn-timeout):

```js
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Note = require('../models/note')

const initialNotes = [
  {
    content: 'HTML on helppoa',
    date: '2019-01-01T00:00:00.000+00:00',
    important: false,
  },
  {
    content: 'HTTP-protokollan tärkeimmät metodit ovat GET ja POST',
    date: '2019-01-01T00:00:00.000+00:00',
    important: true,
  },
]

beforeEach(async () => {
  await Note.deleteMany({})

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

Komento _npm test_ suorittaa projektin kaikki testit. Kun olemme vasta tekemässä testejä, on useimmiten järkevämpää suorittaa kerrallaan ainoastaan yhtä tai muutamaa testiä. Jest tarjoaa tähän muutamia vaihtoehtoja. Eräs näistä on komennon [only](https://jestjs.io/docs/en/api#testonlyname-fn-timeout) käyttö. Jos testit on kirjoitettu useaan tiedostoon, ei menetelmä ole kovin hyvä.

Parempi vaihtoehto on käyttää jestiä suoraan, ilman npm:ää. Tällöin on mahdollista määritellä tarkasti mitä testejä jest suorittaa. Seuraava komento suorittaa ainoastaan tiedostossa <i>tests/note_api.test.js</i> olevat testit

```js
npx jest tests/note_api.test.js --runInBand
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

### async/await

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
  await Note.deleteMany({})

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

  expect(notesAtEnd.length).toBe(helper.initialNotes.length) // highlight-line
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

Catch-lohkossa siis ainoastaan kutsutaan funktiota _next_ siirretään poikkeuksen käsittely virheidenkäsittelymiddlewarelle.

Muutoksen jälkeen testit menevät läpi.

Tehdään sitten testit yksittäisen muistiinpanon tietojen katsomiselle ja muistiinpanon poistolle:

```js
test('a specific note can be viewed', async () => {
  const notesAtStart = await helper.notesInDb()

  const noteToView = notesAtStart[0]

// highlight-start
  const resultNote = await api
    .get(`/api/notes/${noteToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)
// highlight-end

  expect(resultNote.body).toEqual(noteToView)
})

test('a note can be deleted', async () => {
  const notesAtStart = await helper.notesInDb()
  const noteToDelete = notesAtStart[0]

// highlight-start
  await api
    .delete(`/api/notes/${noteToDelete.id}`)
    .expect(204)
// highlight-end

  const notesAtEnd = await helper.notesInDb()

  expect(notesAtEnd.length).toBe(
    helper.initialNotes.length - 1
  )

  const contents = notesAtEnd.map(r => r.content)

  expect(contents).not.toContain(noteToDelete.content)
})
```

Molemmat testit ovat rakenteeltaan samankaltaisia. Alustusvaiheessa ne hakevat kannasta yksittäisen muistiinpanon. Tämän jälkeen on itse testattava operaatio, joka on koodissa korostettuna. Lopussa tarkastetaan, että operaation tulos on haluttu. 

Testit menevät läpi, joten voimme turvallisesti refaktoroida testatut routet käyttämään async/awaitia:

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

Sovelluksen tämänhetkinen koodi on kokonaisuudessaan [githubissa](https://github.com/fullstack-hy2019/part3-notes-backend/tree/part4-4), haarassa <i>part4-4</i>. Samassa on "vahingossa" mukana testeistä seuraavan luvun jälkeinen paranneltu versio.


### Testin beforeEach-metodin optimointi

Palataan takaisin testien pariin, ja tarkastellaan määrittelemäämme testit alustavaa funktiota _beforeEach_:

```js
beforeEach(async () => {
  await Note.deleteMany({})

  let noteObject = new Note(helper.initialNotes[0])
  await noteObject.save()

  noteObject = new Note(helper.initialNotes[1])
  await noteObject.save()
})
```

Funktio tallettaa tietokantaan taulukon _helper.initialNotes_ nollannen ja ensimmäisen alkion, kummankin erikseen taulukon alkioita indeksöiden. Ratkaisu on ok, mutta jos haluaisimme tallettaa alustuksen yhteydessä kantaan useampia alkioita, olisi toisto parempi ratkaisu:

```js
beforeEach(async () => {
  await Note.deleteMany({})
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
beforeEach(async () => {
  await Note.remove({})

  const noteObjects = helper.initialNotes
    .map(note => new Note(note))
  const promiseArray = noteObjects.map(note => note.save())
  await Promise.all(promiseArray)
})
```

Ratkaisu on varmasti aloittelijalle tiiviydestään huolimatta hieman haastava. Taulukkoon _noteObjects_ talletetaan taulukkossa _helper.initialNotes_ olevia Javascript-oliota vastaavat _Note_-konstruktorifunktiolla generoidut Mongoose-oliot. Seuraavalla rivillä luodaan uusi taulukko, joka <i>muodostuu promiseista</i>, jotka saadaan kun jokaiselle _noteObjects_ taulukon alkiolle kutsutaan metodia _save_, eli ne talletetaan kantaan.

Metodin [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) avulla saadaan koostettua taulukollinen promiseja yhdeksi promiseksi, joka valmistuu, eli menee tilaan <i>fulfilled</i> kun kaikki sen parametrina olevan taulukon promiset ovat valmistuneet.
Siispä viimeinen rivi, <em>await Promise.all(promiseArray)</em> odottaa, että kaikki tietokantaan talletetusta vastaavat promiset ovat valmiina, eli alkiot on talletettu tietokantaan.

> Promise.all-metodia käyttäessä päästään tarvittaessa käsiksi sen parametrina olevien yksittäisten promisejen arvoihin, eli promiseja vastaavien operaatioiden tuloksiin. Jos odotetaan promisejen valmistumista _await_-syntaksilla <em>const results = await Promise.all(promiseArray)</em> palauttaa operaatio taulukon, jonka alkioina on _promiseArray_:n promiseja vastaavat arvot samassa järjestyksessä kuin promiset ovat taulukossa.

Promise.all suorittaa kaikkia syötteenä saamiaan promiseja rinnakkain. Jos operaatioiden suoritusjärjestyksellä on merkitystä, voi tämä aiheuttaa ongelmia. Tällöin asynkroniset operaatiot on mahdollista määrittää [for...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of) lohkon sisällä, jonka suoritusjärjestys on taattu.

```js
beforeEach(async () => {
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

**Huom:** materiaalissa käytetään muutamaan kertaan matcheria [toContain](https://facebook.github.io/jest/docs/en/expect.html#tocontainitem) tarkastettaessa, että jokin arvo on taulukossa. Kannattaa huomata, että metodi käyttää samuuden vertailuun ===-operaattoria ja olioiden kohdalla tämä ei ole useinkaan se mitä halutaan ja parempi vaihtoehto onkin [toContainEqual](https://facebook.github.io/jest/docs/en/expect.html#tocontainequalitem). Tosin mallivastauksissa ei vertailla kertaakaan olioita matcherien avulla, joten ilmankin selviää varsin hyvin.

**Varoitus:** Jos huomaat kirjoittavasi sekaisin async/awaitia ja <i>then</i>-kutsuja, on 99% varmaa, että teet jotain väärin. Käytä siis jompaa kumpaa tapaa, älä missään tapauksessa "varalta" molempia.

#### 4.8: blogilistan testit, step 1

Tee supertest-kirjastolla testit blogilistan osoitteeseen <i>/api/blogs</i> tapahtuvalle HTTP GET -pyynnölle. Testaa, että sovellus palauttaa oikean määrän JSON-muotoisia blogeja. 

Kun testi on valmis, refaktoroi operaatio käyttämään promisejen sijaan async/awaitia.

Huomaa, että joudut tekemään koodiin [materiaalin tapaan](/osa4/backendin_testaaminen#test-ymparisto) hieman muutoksia (mm. testausympäristön määrittely), jotta saat järkevästi tehtyä omaa tietokantaa käyttäviä API-tason testejä.

**Huom1:** Testejä suorittaessa saatat törmätä seuraavaan varoitukseen

![](../images/4/8a.png)

Jos näin käy, toimi [ohjeen](https://mongoosejs.com/docs/jest.html) mukaan ja lisää projektin hakemiston juureen tiedosto <i>jest.config.js</i> jolla on seuraava sisältö:

```js
module.exports = {
  testEnvironment: 'node'
}
```

**Huom2:** testien kehitysvaiheessa yleensä **<i>ei kannata suorittaa joka kerta kaikkia testejä</i>**, vaan keskittyä yhteen testiin kerrallaan. Katso lisää [täältä](/osa4/backendin_testaaminen#testien-suorittaminen-yksitellen).

#### 4.9*: blogilistan testit, step2

Tee testi, joka varmistaa että palautettujen blogien identifioivan kentän tulee olla nimeltään <i>id</i>,  oletusarvoisestihan tietokantaan talletettujen olioiden tunnistekenttä on <i>_id</i>. Olion kentän olemassaolon tarkastaminen onnistuu jestin matcherillä [toBeDefined](https://jestjs.io/docs/en/expect#tobedefined)

Muuta koodia siten, että testi menee läpi. Osassa 3 käsitelty [toJSON](osa3/tietojen_tallettaminen_mongo_db_tietokantaan#tietokantaa-kayttava-backend) on sopiva paikka parametrin <i>id</i> määrittelyyn. 

#### 4.10: blogilistan testit, step3

Tee testi joka varmistaa että sovellukseen voi lisätä blogeja osoitteeseen <i>/api/blogs</i> tapahtuvalla HTTP POST -pyynnölle. Testaa ainakin, että blogien määrä kasvaa yhdellä. Voit myös varmistaa, että oikeansisältöinen blogi on lisätty järjestelmään.

Kun testi on valmis, refaktoroi operaatio käyttämään promisejen sijaan async/awaitia.

#### 4.11*: blogilistan testit, step4

Tee testi joka varmistaa, että jos kentälle <i>likes</i> ei anneta arvoa, asetetaan sen arvoksi 0. Muiden kenttien sisällöstä ei tässä tehtävässä vielä välitetä.

Laajenna ohjelmaa siten, että testi menee läpi.

#### 4.12*: blogilistan testit, step5

Tee testit blogin lisäämiselle, eli osoitteeseen <i>/api/blogs</i> tapahtuvalle HTTP POST -pyynnölle, joka varmistaa, että jos uusi blogi ei sisällä kenttiä <i>title</i> ja <i>url</i>, pyyntöön vastataan statuskoodilla <i>400 Bad request</i>

Laajenna toteutusta siten, että testit menevät läpi.

</div>

<div class="content">

### Testien refaktorointia

Testit ovat tällä hetkellä osittain epätäydelliset, esim. reittejä <i>GET /api/notes/:id</i> ja <i>DELETE /api/notes/:id</i> ei tällä hetkellä testata epävalidien id:iden osalta. Myös testien organisoinnissa on hieman toivomisen varaa, sillä kaikki on kirjoitettu suoraan testifunktion "päätasolle", parempaan luettavuuteen pääsisimme eritellessä loogisesti toisiinsa liittyvät testit <i>describe</i>-lohkoihin.

Jossain määrin parannellut testit seuraavassa:

```js
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Note = require('../models/note')

describe('when there is initially some notes saved', () => {
  beforeEach(async () => {
    await Note.deleteMany({})

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

  describe('viewing a specifin note', () => {

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

    test('fails with statuscode 400 id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api
        .get(`/api/notes/${invalidId}`)
        .expect(400)
    })
  })

  describe('addition of a new note', () => {
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

    test('fails with status code 400 if data invalid', async () => {
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

  describe('deletion of a note', () => {
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

### Tehtäviä

#### 4.13 blogilistan laajennus, step1

Toteuta sovellukseen mahdollisuus yksittäisen blogin poistoon.

Käytä async/awaitia. Noudata operaation HTTP-rajapinnan suhteen [RESTful](/osa3/node_js_ja_express#rest)-käytänteitä.

Saat toteuttaa ominaisuudelle testit jos haluat. Jos et, varmista ominaisuuden toimivuus esim. Postmanilla.

#### 4.14* blogilistan laajennus, step2

Toteuta sovellukseen mahdollisuus yksittäisen blogin muokkaamiseen.

Käytä async/awaitia.

Tarvitsemme muokkausta lähinnä <i>likejen</i> lukumäärän päivittämiseen. Toiminnallisuuden voi toteuttaa samaan tapaan kuin muistiinpanon päivittäminen toteutettiin [osassa 3](/osa3/tietojen_tallettaminen_mongo_db_tietokantaan#muut-operaatiot).

Saat toteuttaa ominaisuudelle testit jos haluat. Jos et, varmista ominaisuuden toimivuus esim. Postmanilla.

</div>
