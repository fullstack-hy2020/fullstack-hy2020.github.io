---
mainImage: ../../../images/part-4.svg
part: 4
letter: b
lang: fi
---

<div class="content">

Ruvetaan nyt tekemään testejä backendille. Koska backend ei sisällä monimutkaista laskentaa, ei yksittäisiä funktioita testaavia [yksikkötestejä](https://en.wikipedia.org/wiki/Unit_testing) oikeastaan kannata tehdä. Ainoa potentiaalinen yksikkötestattava asia olisi muistiinpanojen metodi _toJSON_. 

Joissain tilanteissa voisi olla mielekästä suorittaa ainakin osa backendin testauksesta siten, että oikea tietokanta eristettäisiin testeistä ja korvattaisiin "valekomponentilla" eli mockilla. Eräs tähän sopiva ratkaisu olisi [mongodb-memory-server](https://github.com/nodkz/mongodb-memory-server).

Koska sovelluksemme backend on koodiltaan kuitenkin suhteellisen yksinkertainen, päätämme testata sitä kokonaisuudessaan sen tarjoaman REST API:n tasolta ja siten, että myös testeissä käytetään tietokantaa. Tämän kaltaisia, useita sovelluksen komponentteja yhtä aikaa käyttäviä testejä voi luonnehtia [integraatiotesteiksi](https://en.wikipedia.org/wiki/Integration_testing).

### test-ympäristö

Edellisen osan luvussa [Tietokantaa käyttävän version vieminen tuotantoon](/osa3/validointi_ja_es_lint#tietokantaa-kayttavan-version-vieminen-tuotantoon) mainitsimme, että kun sovellusta suoritetaan tuotantopalvelimella eli esim. Fly.io:ssa tai Renderissä, on se <i>production</i>-moodissa.

Noden konventiona on määritellä projektin suoritusmoodi ympäristömuuttujan <i>NODE\_ENV</i> avulla. Yleinen käytäntö on määritellä sovelluksille omat moodinsa tuotantokäyttöön, sovelluskehitykseen ja testaukseen.

Määritellään nyt tiedostossa <i>package.json</i>, että testejä suoritettaessa sovelluksen <i>NODE\_ENV</i> saa arvokseen <i>test</i>:

```json
{
  // ...
  "scripts": {
    "start": "NODE_ENV=production node index.js",// highlight-line
    "dev": "NODE_ENV=development nodemon index.js",// highlight-line
    "build:ui": "rm -rf build && cd ../frontend/ && npm run build && cp -r build ../backend",
    "deploy": "fly deploy",
    "deploy:full": "npm run build:ui && npm run deploy",
    "logs:prod": "fly logs",
    "lint": "eslint .",
    "lint": "eslint .",
    "test": "NODE_ENV=test jest --verbose --runInBand"// highlight-line
  },
  // ...
}
```

Lisäsimme testit suorittavaan npm-skriptiin myös määreen [runInBand](https://jestjs.io/docs/en/cli.html#runinband), joka estää testien rinnakkaisen suorituksen. Tämä tarkennus on viisainta tehdä sitten, kun testimme tulevat käyttämään tietokantaa.

Samalla määriteltiin, että suoritettaessa sovellusta komennolla _npm run dev_ eli nodemonin avulla, on sovelluksen moodi <i>development</i>. Jos sovellusta suoritetaan normaalisti Nodella, on moodiksi määritelty <i>production</i>.

Määrittelyssämme on kuitenkin pieni ongelma: se ei toimi Windowsilla. Tilanne korjautuu asentamalla kirjasto [cross-env](https://www.npmjs.com/package/cross-env) kehitysaikaiseksi riippuvuudeksi komennolla

```bash
npm install --save-dev cross-env
```

ja muuttamalla <i>package.json</i> kaikilla käyttöjärjestelmillä toimivaan muotoon:

```json
{
  // ...
  "scripts": {
    "start": "cross-env NODE_ENV=production node index.js",
    "dev": "cross-env NODE_ENV=development nodemon index.js",
    // ...
    "test": "cross-env NODE_ENV=test jest --verbose --runInBand",
  },
  // ...
}
```

Nyt sovelluksen toimintaa on mahdollista muokata sen suoritusmoodiin perustuen. Eli voimme määritellä vaikkapa, että testejä suoritettaessa ohjelma käyttää erillistä, testejä varten luotua tietokantaa.

Sovelluksen testikanta voidaan luoda tuotantokäytön ja sovelluskehityksen tapaan Mongo DB Atlasiin. Ratkaisu ei ole optimaalinen, erityisesti jos sovellusta on tekemässä yhtä aikaa useita henkilöitä. Testien suoritus nimittäin yleensä edellyttää, että samaa tietokantainstanssia ei ole yhtä aikaa käyttämässä useampia testiajoja.

Testaukseen kannattaisikin käyttää verkossa olevan jaetun tietokannan sijaan mieluummin sovelluskehittäjän paikallisella koneella olevaa tietokantaa. Optimiratkaisu olisi tietysti se, että jokaista testiajoa varten olisi käytettävissä oma tietokanta, sekin periaatteessa onnistuu "suhteellisen helposti" mm. [keskusmuistissa toimivan Mongon](https://docs.mongodb.com/manual/core/inmemory/) ja [Docker](https://www.docker.com)-kontainereiden avulla. Etenemme kuitenkin nyt lyhyemmän kaavan mukaan ja käytämme testikantana normaalia Mongoa.

Muutetaan konfiguraatiot suorittavaa moduulia seuraavasti:

```js
require('dotenv').config()

const PORT = process.env.PORT

// highlight-start
const MONGODB_URI = process.env.NODE_ENV === 'test' 
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI
// highlight-end

module.exports = {
  MONGODB_URI,
  PORT
}
```

Tiedostossa <i>.env</i> on nyt määritelty <i>erikseen</i> sekä sovelluskehitysympäristön että testausympäristön tietokannan osoite:

```bash
MONGODB_URI=mongodb+srv://fullstack:<password>@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority
PORT=3001

// highlight-start
TEST_MONGODB_URI=mongodb+srv://fullstack:<password>@cluster0.o1opl.mongodb.net/testNoteApp?retryWrites=true&w=majority
// highlight-end
```

Itse tekemämme eri ympäristöjen konfiguroinnista huolehtiva _config_-moduuli toimii hieman samassa hengessä kuin [node-config](https://github.com/lorenwest/node-config)-kirjasto. Itse tekemämme konfigurointiympäristö sopii tarkoitukseemme, sillä sovellus on yksinkertainen ja oman konfiguraatiomoduulin tekeminen on myös jossain määrin opettavaista. Isommissa sovelluksissa kannattaa harkita valmiiden kirjastojen, kuten [node-config](https://github.com/lorenwest/node-config):in käyttöä.

Muualle koodiin ei muutoksia tarvita.

Sovelluksen tämänhetkinen koodi on kokonaisuudessaan [GitHubissa](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-2), branchissä <i>part4-2</i>.

### SuperTest

Käytetään API:n testaamiseen Jestin apuna [SuperTest](https://github.com/visionmedia/supertest)-kirjastoa.

Kirjasto asennetaan kehitysaikaiseksi riippuvuudeksi komennolla

```bash
npm install --save-dev supertest
```

Luodaan heti ensimmäinen testi tiedostoon <i>tests/note_api.test.js</i>:

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

afterAll(async () => {
  await mongoose.connection.close()
})
```

Testi importtaa tiedostoon <i>app.js</i> määritellyn Express-sovelluksen ja käärii sen funktion <i>supertest</i> avulla ns. [superagent](https://github.com/visionmedia/superagent)-olioksi. Tämä olio sijoitetaan muuttujaan <i>api</i> ja sen kautta testit voivat tehdä HTTP-pyyntöjä backendiin.

Testimetodi tekee HTTP GET ‑pyynnön osoitteeseen <i>api/notes</i> ja varmistaa, että pyyntöön vastataan statuskoodilla 200 ja että data palautetaan oikeassa muodossa, eli että <i>Content-Type</i>:n arvo on <i>application/json</i>.

Headerin arvon tarkastaminen näyttää syntaksiltaan hieman kummalliselta:

```js
.expect('Content-Type', /application\/json/)
```

Haluttu arvo on nyt määritelty [regexinä](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) eli suomeksi säännöllisenä lausekkeena. Regex alkaa ja loppuu vinoviivaan /, koska haluttu merkkijono <i>application/json</i> myös sisältää saman vinoviivan, on sen eteen laitettu \ jotta sitä ei tulkita regexin lopetusmerkiksi.

Periaatteessa testi olisi voitu määritellä myös normaalina merkkijonona

```js
.expect('Content-Type', 'application/json')
```

Tässä ongelmana on kuitenkin se, että käytettäessä merkkijonoa, tulee headerin arvon olla täsmälleen sama. Määrittelemällemme regexille kelpaa että header <i>sisältää</i> kyseisen merkkijonon. Headerin todellinen arvo on <i>application/json; charset=utf-8</i>, eli se sisältää myös tiedon merkistökoodauksesta. Testimme ei kuitenkaan ole tästä kiinnostunut ja siksi testi on parempi määritellä tarkan merkkijonon sijaan regexinä.

Testissä on muutama detalji joihin tutustumme vasta [hieman myöhemmin](/osa4/backendin_testaaminen#async-await) tässä osassa. Testikoodin määrittelevä nuolifunktio alkaa sanalla <i>async</i>, ja <i>api</i>-oliolle tehtyä metodikutsua edeltää sana <i>await</i>. Teemme ensin muutamia testejä ja tutustumme sen jälkeen async/await-magiaan. Tällä hetkellä niistä ei tarvitse välittää, sillä kaikki toimii kunhan kirjoitat testimetodit esimerkin mukaan. Async/await-syntaksin käyttö liittyy siihen, että palvelimelle tehtävät pyynnöt ovat <i>asynkronisia</i> operaatioita. [Async/await-kikalla](https://jestjs.io/docs/asynchronous) saamme pyynnön näyttämään koodin tasolla synkronisesti toimivalta.

Kaikkien testien (joita siis tällä kertaa on vain yksi) päätteeksi on vielä lopputoimenpiteenä katkaistava Mongoosen käyttämä tietokantayhteys. Tämä onnistuu helposti metodissa [afterAll](https://jestjs.io/docs/api#afterallfn-timeout):

```js
afterAll(async () => {
  await mongoose.connection.close()
})
```

Testejä suorittaessa tulee seuraava ilmoitus:

![Virheilmoitus Jest did not exit one second after the test run has completed](../../images/4/8.png)

Kyse lienee Mongoosen version 6.x aiheuttamasta ongelmasta, versiossa 5.x ei samaa virhettä esiinny. Itseasiassa [Mongoosen dokumentaatio](https://mongoosejs.com/docs/jest.html) ei välttämättä suosittele Mongoosea käyttävien sovellusten testaamista Jestillä.

Virheilmoituksesta pääsee eroon muutamallakin tavalla. [Esimerkiksi](https://stackoverflow.com/questions/50687592/jest-and-mongoose-jest-has-detected-opened-handles) lisäämällä hakemistoon <i>tests</i> tiedosto <i>teardown.js</i> jolla on seuraava sisältö

```js
module.exports = () => {
  process.exit(0)
}
```

ja lajentamalla tiedoston <i>package.json</i> Jestiä koskevaa määrittelyä seuraavasti

```js
{
 //...
 "jest": {
   "testEnvironment": "node"
   "globalTeardown": "./tests/teardown.js" // highlight-line
 }
}
```

Pieni mutta tärkeä huomio: eristimme tämän osan [alussa](/osa4/sovelluksen_rakenne_ja_testauksen_alkeet#sovelluksen-rakenne) Express-sovelluksen tiedostoon <i>app.js</i>, ja tiedoston <i>index.js</i> rooliksi jäi sovelluksen käynnistäminen määriteltyyn porttiin <i>http</i>-olion avulla:

```js
const app = require('./app') // varsinainen Express-sovellus
const config = require('./utils/config')
const logger = require('./utils/logger')



app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
```

Testit käyttävät ainoastaan tiedostossa <i>app.js</i> määriteltyä Express-sovellusta:

```js
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app') // highlight-line

const api = supertest(app) // highlight-line

// ...
```

SuperTestin dokumentaatio toteaa seuraavaa:

> <i>if the server is not already listening for connections then it is bound to an ephemeral port for you so there is no need to keep track of ports.</i>

SuperTest siis huolehtii testattavan sovelluksen käynnistämisestä sisäisesti käyttämäänsä porttiin.

Lisätään tiedoston _mongo.js_ ohjelmaa käyttämällä testitietokantaan kaksi muistiinpanoa (tässä kohtaa on muistettava vaihtaa käyttöön oikea tietokantaurl).

Tehdään pari testiä lisää:

```js
test('there are two notes', async () => {
  const response = await api.get('/api/notes')

  expect(response.body).toHaveLength(2)
})

test('the first note is about HTTP methods', async () => {
  const response = await api.get('/api/notes')

  expect(response.body[0].content).toBe('HTML is easy')
})
```

Molemmat testit sijoittavat pyynnön vastauksen muuttujaan _response_. Toisin kuin edellisessä testissä (joka käytti SuperTestin mekanismeja statuskoodin ja vastauksen headereiden oikeellisuuden varmistamiseen), tällä kertaa tutkitaan vastauksessa olevan datan eli <i>response.body</i>:n oikeellisuutta Jestin [expect](https://jestjs.io/docs/expect#expectvalue):in avulla.

Async/await-kikan hyödyt tulevat nyt selkeästi esiin. Normaalisti tarvitsisimme asynkronisten pyyntöjen vastauksiin käsille pääsemiseen promiseja ja takaisinkutsuja, mutta nyt kaikki menee mukavasti:

```js
const response = await api.get('/api/notes')

// tänne tullaan vasta kun edellinen komento eli HTTP-pyyntö on suoritettu
// muuttujassa response on nyt HTTP-pyynnön tulos
expect(response.body).toHaveLength(2)
```

HTTP-pyyntöjen tiedot konsoliin kirjoittava middleware häiritsee hiukan testien tulostusta. Muutetaan loggeria siten, että testausmoodissa lokiviestit eivät tulostu konsoliin:

```js
const info = (...params) => {
  // highlight-start
  if (process.env.NODE_ENV !== 'test') { 
    console.log(...params)
  }
  // highlight-end
}

const error = (...params) => {
  // highlight-start
  if (process.env.NODE_ENV !== 'test') { 
    console.error(...params)
  }
  // highlight-end  
}

module.exports = {
  info, error
}
```

### Tietokannan alustaminen ennen testejä

Testaus vaikuttaa helpolta ja testit menevät läpi. Testimme ovat kuitenkin huonoja, sillä niiden läpimeno riippuu tietokannan tilasta, jossa nyt sattuu olemaan kaksi muistiinpanoa. Jotta saisimme robustimmat testit, tulee tietokannan tila nollata testien alussa ja sen jälkeen laittaa kantaan hallitusti testien tarvitsema data.

Testimme käyttää jo nyt Jestin metodia [afterAll](https://jestjs.io/docs/api#afterallfn-timeout) sulkemaan tietokannan testien suoritusten jälkeen. Jest tarjoaa joukon muitakin [funktioita](https://jestjs.io/docs/setup-teardown), joiden avulla voidaan suorittaa operaatioita ennen yhdenkään testin suorittamista tai ennen jokaisen testin suoritusta.

Päätetään alustaa tietokanta ennen <i>jokaisen testin suoritusta</i>, eli funktiossa [beforeEach](https://jestjs.io/docs/en/api.html#beforeeachfn-timeout):

```js
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
// highlight-start
const Note = require('../models/note')
// highlight-end

// highlight-start
const initialNotes = [
  {
    content: 'HTML is easy',
    important: false,
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true,
  },
]
// highlight-end

// highlight-start
beforeEach(async () => {
  await Note.deleteMany({})

  let noteObject = new Note(initialNotes[0])
  await noteObject.save()

  noteObject = new Note(initialNotes[1])
  await noteObject.save()
})
// highlight-end
// ...
```

Tietokanta siis tyhjennetään aluksi, ja sen jälkeen kantaan lisätään kaksi taulukkoon _initialNotes_ talletettua muistiinpanoa. Näin testien suoritus aloitetaan aina hallitusti samasta tilasta.

Muutetaan kahta jälkimmäistä testiä vielä seuraavasti:

```js
test('all notes are returned', async () => {
  const response = await api.get('/api/notes')

  expect(response.body).toHaveLength(initialNotes.length) // highlight-line
})

test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes')

  const contents = response.body.map(r => r.content) // highlight-line

  expect(contents).toContain(
    'Browser can execute only JavaScript' // highlight-line
  )
})
```

Huomaa jälkimmäisen testin ekspektaatio. Komennolla <code>response.body.map(r => r.content)</code> muodostetaan taulukko API:n palauttamien muistiinpanojen sisällöistä. Jestin [toContain](https://jestjs.io/docs/expect#tocontainitem)-ekspektaatiometodilla tarkistetaan, että parametrina oleva muistiinpano on kaikkien API:n palauttamien muistiinpanojen joukossa.

### Testien suorittaminen yksitellen

Komento _npm test_ suorittaa projektin kaikki testit. Kun olemme vasta tekemässä testejä, on useimmiten järkevämpää suorittaa kerrallaan ainoastaan yhtä tai muutamaa testiä. Jest tarjoaa tähän muutamia vaihtoehtoja. Eräs näistä on komennon [only](https://jestjs.io/docs/en/api#testonlyname-fn-timeout) käyttö. Jos testit on kirjoitettu useaan tiedostoon, ei menetelmä ole kovin hyvä.

Parempi vaihtoehto on määritellä komennon <i>npm test</i> yhteydessä minkä tiedoston testit halutaan suorittaa. Seuraava komento suorittaa ainoastaan tiedostossa <i>tests/note_api.test.js</i> olevat testit:

```js
npm test -- tests/note_api.test.js
```

Parametrin <i>-t</i> avulla voidaan suorittaa testejä nimen perusteella:

```js
npm test -- -t 'a specific note is within the returned notes'
```

Parametri voi viitata testin tai describe-lohkon nimeen. Parametrina voidaan antaa myös nimen osa. Seuraava komento suorittaisi kaikki testit, joiden nimessä on sana <i>notes</i>:

```js
npm test -- -t 'notes'
```

**HUOM**: yksittäisiä testejä suoritettaessa saattaa Mongoose-yhteys jäädä auki, mikäli yhtään yhteyttä hyödyntävää testiä ei ajeta. Ongelma seurannee siitä, että SuperTest alustaa yhteyden, mutta Jest ei suorita afterAll-osiota.

### async/await

Ennen kuin teemme lisää testejä, tarkastellaan tarkemmin mitä _async_ ja _await_ tarkoittavat.

Async- ja await ovat ES7:n mukanaan tuoma uusi syntaksi, joka mahdollistaa <i>promisen palauttavien asynkronisten funktioiden</i> kutsumisen siten, että kirjoitettava koodi näyttää synkroniselta.

Esim. muistiinpanojen hakeminen tietokannasta hoidetaan promisejen avulla seuraavasti:

```js
Note.find({}).then(notes => {
  console.log('operation returned the following notes', notes)
})
```

Metodikutsu _Note.find()_ palauttaa promisen, ja saamme itse operaation tuloksen rekisteröimällä promiselle tapahtumankäsittelijän metodilla _then_.

Kaikki operaation suorituksen jälkeinen koodi kirjoitetaan tapahtumankäsittelijään. Jos haluaisimme tehdä peräkkäin useita asynkronisia funktiokutsuja, menisi tilanne ikävämmäksi. Joutuisimme tekemään kutsut tapahtumankäsittelijästä. Näin syntyisi potentiaalisesti monimutkaista koodia, pahimmassa tapauksessa jopa niin sanottu [callback-helvetti](http://callbackhell.com/).

[Ketjuttamalla promiseja](https://javascript.info/promise-chaining) tilanne pysyy jollain tavalla hallinnassa. Callback-helvetin eli monien sisäkkäisten callbackien sijaan saadaan aikaan siistihkö _then_-kutsujen ketju. Olemmekin nähneet jo kurssin aikana muutaman sellaisen. Seuraavassa vielä erittäin keinotekoinen esimerkki, joka hakee ensin kaikki muistiinpanot ja sitten tuhoaa niistä ensimmäisen:

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

Then-ketju on ok, mutta parempaankin pystytään. Jo ES6:ssa esitellyt [generaattorifunktiot](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) mahdollistivat [ovelan tavan](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/async%20%26%20performance/ch4.md#iterating-generators-asynchronously) määritellä asynkronista koodia siten että se "näyttää synkroniselta". Syntaksi ei kuitenkaan ole täysin luonteva ja sitä ei käytetä kovin yleisesti.

ES7:ssa _async_ ja _await_ tuovat generaattoreiden tarjoaman toiminnallisuuden ymmärrettävästi ja syntaksin puolesta selkeällä tavalla koko JavaScript-kansan ulottuville.

Voisimme hakea tietokannasta kaikki muistiinpanot [await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)-operaattoria hyödyntäen seuraavasti:

```js
const notes = await Note.find({})

console.log('operation returned the following notes', notes)
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

Mistä tahansa kohtaa JavaScript-koodia ei awaitia kuitenkaan pysty käyttämään. Awaitin käyttö onnistuu ainoastaan jos ollaan [async](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)-funktiossa.

Eli jotta edelliset esimerkit toimisivat, on ne suoritettava async-funktioiden sisällä (huomaa funktion määrittelevä rivi):

```js
const main = async () => { // highlight-line
  const notes = await Note.find({})
  console.log('operaatio palautti seuraavat muistiinpanot', notes)

  const response = await notes[0].remove()
  console.log('the first note is removed')
}

main() // highlight-line
```

Koodi määrittelee ensin asynkronisen funktion, joka sijoitetaan muuttujaan _main_. Määrittelyn jälkeen koodi kutsuu metodia komennolla <code>main()</code>.

### async/await backendissä

Muutetaan seuraavaksi backend käyttämään asyncia ja awaitia. Koska kaikki asynkroniset operaatiot tehdään joka tapauksessa funktioiden sisällä, awaitin käyttämiseen riittää, että muutamme routejen käsittelijät async-funktioiksi.

Kaikkien muistiinpanojen hakemisesta vastaava route muuttuu seuraavasti:

```js
notesRouter.get('/', async (request, response) => { 
  const notes = await Note.find({})
  response.json(notes)
})
```

Voimme varmistaa refaktoroinnin onnistumisen selaimella sekä suorittamalla juuri määrittelemämme testit.

Sovelluksen tämänhetkinen koodi on kokonaisuudessaan [GitHubissa](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-3), branchissa <i>part4-3</i>.

### Lisää testejä ja backendin refaktorointia

Koodia refaktoroidessa vaanii aina [regression](https://en.wikipedia.org/wiki/Regression_testing) vaara. On olemassa riski, että jo toimineet ominaisuudet hajoavat. Tehdäänkin muiden operaatioiden refaktorointi siten, että ennen koodin muutosta tehdään jokaiselle API:n routelle sen toiminnallisuuden varmistavat testit.

Aloitetaan lisäysoperaatiosta. Tehdään testi, joka lisää uuden muistiinpanon ja tarkastaa, että API:n palauttamien muistiinpanojen määrä kasvaa, ja että lisätty muistiinpano on palautettujen joukossa:

```js
test('a valid note can be added ', async () => {
  const newNote = {
    content: 'async/await simplifies making async calls',
    important: true,
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/notes')

  const contents = response.body.map(r => r.content)

  expect(response.body).toHaveLength(initialNotes.length + 1)
  expect(contents).toContain(
    'async/await simplifies making async calls'
  )
})
```

Testi ei itse asiassa mene läpi, sillä olemme vahingossa palauttaneet statuskoodin <i>200 OK</i> uuden muistiinpanon luomisen yhteydessä, parempi statuskoodi on <i>201 CREATED</i>. Muutetaan koodia siten että testi menee läpi:

```js
notesRouter.post('/', (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save()
    .then(savedNote => {
      response.status(201).json(savedNote) // highlight-line
    })
    .catch(error => next(error))
})
```

Tehdään myös testi, joka varmistaa, että muistiinpanoa, jolle ei ole asetettu sisältöä, ei talleteta:

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

  expect(response.body).toHaveLength(initialNotes.length)
})
```

Molemmat testit tarkastavat lisäyksen jälkeen mihin tilaan tietokanta on päätynyt hakemalla kaikki sovelluksen muistiinpanot:

```js
const response = await api.get('/api/notes')
```

Sama tulee toistumaan myöhemminkin monissa testeissä ja operaatio kannattaakin eristää apufunktioon. Sijoitetaan se testien yhteyteen tiedostoon <i>tests/test_helper.js</i>:

```js
const Note = require('../models/note')

const initialNotes = [
  {
    content: 'HTML is easy',
    important: false
  },
  {
    content: 'Browser can execute only JavaScript',
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

Moduuli määrittelee funktion _notesInDb_, jonka avulla voidaan tarkastaa sovelluksen tietokannassa olevat muistiinpanot. Tietokantaan alustettava sisältö _initialNotes_ on siirretty samaan tiedostoon. Määrittelimme myös tulevan varalta funktion _nonExistingId_, jonka avulla on mahdollista luoda tietokanta-id, joka ei kuulu millekään kannassa olevalle oliolle.

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

  expect(response.body).toHaveLength(helper.initialNotes.length) // highlight-line
})

test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes')

  const contents = response.body.map(r => r.content)
  expect(contents).toContain(
    'Browser can execute only JavaScript'
  )
})

test('a valid note can be added ', async () => {
  const newNote = {
    content: 'async/await simplifies making async calls',
    important: true,
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)


  const notesAtEnd = await helper.notesInDb() // highlight-line
  expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1) // highlight-line

  const contents = notesAtEnd.map(n => n.content) // highlight-line
  expect(contents).toContain(
    'async/await simplifies making async calls'
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

  expect(notesAtEnd).toHaveLength(helper.initialNotes.length) // highlight-line
})

afterAll(async () => {
  await mongoose.connection.close()
})
```

Promiseja käyttävä koodi toimii nyt ja testitkin menevät läpi. Olemme valmiit muuttamaan koodin käyttämään async/await-syntaksia.

Uuden muistiinpanon lisäämisestä huolehtiva koodi muuttuu seuraavasti (huomaa, että käsittelijän alkuun on laitettava määre _async_):

```js
notesRouter.post('/', async (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  const savedNote = await note.save()
  response.status(201).json(savedNote)
})
```

Koodiin jää kuitenkin pieni ongelma: virhetilanteita ei nyt käsitellä ollenkaan. Miten niiden suhteen tulisi toimia?

### Virheiden käsittely ja async/await

Jos sovellus POST-pyyntöä käsitellessään aiheuttaa jonkinlaisen ajonaikaisen virheen, syntyy jälleen tuttu tilanne:

![Konsolissa näkyy virheilmoitus ValidationError joka johtuu siitä että content puuttuu vastaanotetusta datasta](../../images/4/6.png)

Kyseessä on siis käsittelemätön promisen rejektoituminen. Pyyntöön ei vastata tilanteessa mitenkään.

Async/awaitia käyttäessä kannattaa käyttää vanhaa kunnon _try/catch_-mekanismia virheiden käsittelyyn:

```js
notesRouter.post('/', async (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })
  // highlight-start
  try {
    const savedNote = await note.save()
    response.status(201).json(savedNote)
  } catch(exception) {
    next(exception)
  }
  // highlight-end
})
```

Catch-lohkossa siis ainoastaan kutsutaan funktiota _next_, joka siirtää poikkeuksen käsittelyn virheidenkäsittelymiddlewarelle.

Muutoksen jälkeen testit menevät läpi.

Tehdään sitten testit yksittäisen muistiinpanon tietojen katsomiselle ja muistiinpanon poistolle. Koodissa on korostettu varsinainen API:in suoritettava operaatio:

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

  expect(notesAtEnd).toHaveLength(
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
  try {
    const note = await Note.findById(request.params.id)
    if (note) {
      response.json(note)
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

Sovelluksen tämänhetkinen koodi on kokonaisuudessaan [GitHubissa](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-4), haarassa <i>part4-4</i>. 

### Try-catchin eliminointi

Async/await selkeyttää koodia jossain määrin, mutta sen "hinta" on poikkeusten käsittelyn edellyttämä <i>try/catch</i>-rakenne. Kaikki routejen käsittelijät noudattavat samaa kaavaa:

```js
try {
  // do the async operations here
} catch(exception) {
  next(exception)
}
```

Mieleen herää kysymys, olisiko koodia mahdollista refaktoroida siten, että <i>catch</i> saataisiin refaktoroitua ulos metodeista? 

Kirjasto [express-async-errors](https://github.com/davidbanham/express-async-errors) tuo tilanteeseen helpotuksen.

Asennetaan kirjasto:

```bash
npm install express-async-errors
```

Kirjaston käyttö on <i>todella</i> helppoa. Kirjaston koodi otetaan käyttöön tiedostossa <i>app.js</i>:

```js
const config = require('./utils/config')
const express = require('express')
require('express-async-errors') // highlight-line
const app = express()
const cors = require('cors')
const notesRouter = require('./controllers/notes')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

// ...

module.exports = app
```

Kirjaston koodiin sisällyttämän "magian" ansiosta pääsemme kokonaan eroon try-catch-lauseista. Muistiinpanon poistamisesta huolehtiva route

```js
notesRouter.delete('/:id', async (request, response, next) => {
  try {
    await Note.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})
```

muuttuu muotoon

```js
notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndRemove(request.params.id)
  response.status(204).end()
})
```

Kirjaston ansiosta kutsua _next(exception)_ ei siis enää tarvita. Kirjasto hoitaa asian konepellin alla, eli jos <i>async</i>-funktiona määritellyn routen sisällä syntyy poikkeus, siirtyy suoritus automaattisesti virheenkäsittelijämiddlewareen.

Muut routet yksinkertaistuvat seuraavasti:

```js
notesRouter.post('/', async (request, response) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  const savedNote = await note.save()
  response.json(savedNote)
})

notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).json(savedNote)
  }
})
```

### Testin beforeEach-metodin optimointi

Palataan takaisin testien pariin ja tarkastellaan määrittelemäämme testit alustavaa funktiota _beforeEach_:

```js
beforeEach(async () => {
  await Note.deleteMany({})

  let noteObject = new Note(helper.initialNotes[0])
  await noteObject.save()

  noteObject = new Note(helper.initialNotes[1])
  await noteObject.save()
})
```

Funktio tallettaa tietokantaan taulukon _helper.initialNotes_ nollannen ja ensimmäisen alkion, kummankin erikseen taulukon alkioita indeksoiden. Ratkaisu on ok, mutta jos haluaisimme tallettaa alustuksen yhteydessä kantaan useampia alkioita, olisi toisto parempi ratkaisu:

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

Konsoliin tulostuu:

<pre>
cleared
done
entered test
saved
saved
</pre>

Yllättäen ratkaisu ei async/awaitista huolimatta toimi niin kuin oletamme, vaan testin suoritus aloitetaan ennen kuin tietokannan tila on saatu alustettua!

Ongelma on siinä, että jokainen forEach-loopin läpikäynti generoi oman asynkronisen operaation ja _beforeEach_ ei odota näiden suoritusta. Eli forEach:in sisällä olevat _await_-komennot eivät ole funktiossa _beforeEach_ vaan erillisissä funktioissa, joiden päättymistä _beforeEach_ ei odota.

Koska testien suoritus alkaa heti _beforeEach_ metodin suorituksen jälkeen, testien suoritus ehditään aloittamaan ennen kuin tietokanta on alustettu toivottuun alkutilaan.

Toimiva ratkaisu tilanteessa on odottaa asynkronisten talletusoperaatioiden valmistumista _beforeEach_-funktiossa esim. metodin [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) avulla:

```js
beforeEach(async () => {
  await Note.deleteMany({})

  const noteObjects = helper.initialNotes
    .map(note => new Note(note))
  const promiseArray = noteObjects.map(note => note.save())
  await Promise.all(promiseArray)
})
```

Ratkaisu on varmasti aloittelijalle tiiviydestään huolimatta hieman haastava. Taulukkoon _noteObjects_ talletetaan taulukossa _helper.initialNotes_ olevia JavaScript-olioita vastaavat _Note_-konstruktorifunktiolla generoidut Mongoose-oliot. Seuraavalla rivillä luodaan uusi taulukko, joka <i>muodostuu promiseista</i>, jotka saadaan kun jokaiselle _noteObjects_-taulukon alkiolle kutsutaan metodia _save_, eli kun ne talletetaan kantaan.

Metodin [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) avulla saadaan koostettua taulukollinen promiseja yhdeksi promiseksi, joka valmistuu, eli menee tilaan <i>fulfilled</i> kun kaikki sen parametrina olevan taulukon promiset ovat valmistuneet.
Siispä viimeinen rivi, <em>await Promise.all(promiseArray)</em> odottaa, että kaikki tietokantaan talletusta vastaavat promiset ovat valmiina, eli alkiot on talletettu tietokantaan.

> Promise.all-metodia käyttäessä päästään tarvittaessa käsiksi sen parametrina olevien yksittäisten promisejen arvoihin eli promiseja vastaavien operaatioiden tuloksiin. Jos odotetaan promisejen valmistumista _await_-syntaksilla <em>const results = await Promise.all(promiseArray)</em> palauttaa operaatio taulukon, jonka alkioina on _promiseArray_:n promiseja vastaavat arvot samassa järjestyksessä kuin promiset ovat taulukossa.

Promise.all suorittaa kaikkia syötteenä saamiaan promiseja rinnakkain. Jos operaatioiden suoritusjärjestyksellä on merkitystä, voi tämä aiheuttaa ongelmia. Tällöin asynkroniset operaatiot on mahdollista määrittää [for...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of)-lohkon sisällä, jolloin suoritusjärjestys on taattu.

```js
beforeEach(async () => {
  await Note.deleteMany({})

  for (let note of initialNotes) {
    let noteObject = new Note(note)
    await noteObject.save()
  }
})
```

JavaScriptin asynkroninen suoritusmalli aiheuttaakin siis helposti yllätyksiä, ja myös async/await-syntaksin kanssa pitää olla koko ajan tarkkana. Vaikka async/await peittää monia promisejen käsittelyyn liittyviä seikkoja, promisejen toiminta on syytä tuntea mahdollisimman hyvin!

Kaikkein helpoimmalla tilanteesta selvitään hyödyntämällä Mongoosen valmista metodia _insertMany_:

```js
beforeEach(async () => {
  await Note.deleteMany({})
  await Note.insertMany(helper.initialNotes) // highlight-line
})
```

Sovelluksen tämänhetkinen koodi on kokonaisuudessaan [GitHubissa](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-5), haarassa <i>part4-5</i>. 

### Testejä tekevän full stack ‑sovelluskehittäjän vala

Testien tekeminen tuo ohjelmointiin jälleen uuden kerroksen haasteellisuutta. Joudumme päivittämään full stack ‑kehittäjän valaamme muistuttamaan siitä että systemaattisuus on myös testejä kehitettäessä avainasemassa.

Full stack ‑ohjelmointi on <i>todella</i> hankalaa, ja sen takia lupaan hyödyntää kaikkia ohjelmointia helpottavia keinoja:

- pidän selaimen konsolin koko ajan auki
- tarkkailen säännöllisesti selaimen network-välilehdeltä, että frontendin ja backendin välinen kommunikaatio tapahtuu oletusteni mukaan
- tarkkailen säännöllisesti palvelimella olevan datan tilaa, ja varmistan että frontendin lähettämä data siirtyy sinne kuten oletin
- pidän silmällä tietokannan tilaa: varmistan että backend tallentaa datan sinne oikeaan muotoon
- etenen pienin askelin
- <i>käytän koodissa ja testeissä runsaasti _console.log_-komentoja varmistamaan sen, että varmasti ymmärrän jokaisen kirjoittamani rivin, sekä etsiessäni koodista tai testeistä mahdollisia ongelman aiheuttajia</i>
- jos koodini ei toimi, en kirjoita enää yhtään lisää koodia, vaan alan poistamaan toiminnan rikkoneita rivejä tai palaan suosiolla tilanteeseen, missä koodi vielä toimi
- <i>jos testit eivät mene läpi, varmistan että testien testaama toiminnallisuus varmasti toimii sovelluksessa</i>
- kun kysyn apua kurssin Discord- tai Telegram-kanavalla, tai muualla internetissä, muotoilen kysymyksen järkevästi, esim. [täällä](/en/part0/general_info#how-to-ask-help-in-discord-telegam) esiteltyyn tapaan

</div>

<div class="tasks">

### Tehtävät 4.8.-4.12.

**HUOM:** Materiaalissa käytetään muutamaan kertaan matcheria [toContain](https://jestjs.io/docs/expect#tocontainitem) kun tarkastetaan, onko jokin arvo taulukossa. Kannattaa huomata, että metodi käyttää samuuden vertailuun ===-operaattoria ja olioiden kohdalla tämä ei ole useinkaan se mitä halutaan. Parempi vaihtoehto onkin [toContainEqual](https://jestjs.io/docs/expect#tocontainequalitem). Tosin mallivastauksissa ei vertailla kertaakaan olioita matcherien avulla, joten ilmankin selviää varsin hyvin.

**Varoitus:** Jos huomaat kirjoittavasi sekaisin async/awaitia ja <i>then</i>-kutsuja, on 99-prosenttisen varmaa, että teet jotain väärin. Käytä siis jompaakumpaa tapaa, älä missään tapauksessa "varalta" molempia.

#### 4.8: blogilistan testit, step 1

Tee SuperTest-kirjastolla testit blogilistan osoitteeseen <i>/api/blogs</i> tapahtuvalle HTTP GET ‑pyynnölle. Testaa, että sovellus palauttaa oikean määrän JSON-muotoisia blogeja. 

Kun testi on valmis, refaktoroi operaatio käyttämään promisejen sijaan async/awaitia.

Huomaa, että joudut tekemään koodiin [materiaalin tapaan](/osa4/backendin_testaaminen#test-ymparisto) hieman muutoksia (mm. testausympäristön määrittely), jotta saat järkevästi tehtyä omaa tietokantaa käyttäviä API-tason testejä.

**HUOM 1:** Testejä suorittaessa törmäät ehkä seuraavaan varoitukseen:

![Virheilmotus Mongoose: looks like you're trying to test Mongoose app with Jest's default jsdomain environment.](../../images/4/8a.png)

Virheilmoituksesta pääsee eroon muutamallakin tavalla. [Esimerkiksi](https://stackoverflow.com/questions/50687592/jest-and-mongoose-jest-has-detected-opened-handles) lisäämällä hakemistoon <i>tests</i> tiedosto <i>teardown.js</i> jolla on seuraava sisältö

```js
module.exports = () => {
  process.exit(0)
}
```

ja lajentamalla tiedoston <i>package.json</i> Jestiä koskevaa määrittelyä seuraavasti

```js
{
 //...
 "jest": {
   "testEnvironment": "node"
   "globalTeardown": ".test/teardown.js" // highlight-line
 }
}
```

**HUOM 2:** Testien kehitysvaiheessa yleensä **<i>ei kannata suorittaa joka kerta kaikkia testejä</i>**, vaan keskittyä yhteen testiin kerrallaan. Katso lisää [täältä](/osa4/backendin_testaaminen#testien-suorittaminen-yksitellen).

#### 4.9: blogilistan testit, step2

Tee testi, joka varmistaa että palautettujen blogien identifioivan kentän tulee olla nimeltään <i>id</i>. Oletusarvoisestihan tietokantaan talletettujen olioiden tunnistekenttä on <i>_id</i>. Olion kentän olemassaolon tarkastaminen onnistuu Jestin matcherillä [toBeDefined](https://jestjs.io/docs/en/expect#tobedefined).

Muuta koodia siten, että testi menee läpi. Osassa 3 käsitelty [toJSON](/osa3/tietojen_tallettaminen_mongo_db_tietokantaan#tietokantaa-kayttava-backend) on sopiva paikka parametrin <i>id</i> määrittelyyn. 

#### 4.10: blogilistan testit, step3

Tee testi, joka varmistaa, että sovellukseen voi lisätä blogeja osoitteeseen <i>/api/blogs</i> tapahtuvalla HTTP POST ‑pyynnöllä. Testaa ainakin, että blogien määrä kasvaa yhdellä. Voit myös varmistaa, että oikeansisältöinen blogi on lisätty järjestelmään.

Kun testi on valmis, refaktoroi operaatio käyttämään promisejen sijaan async/awaitia.

#### 4.11*: blogilistan testit, step4

Tee testi, joka varmistaa, että jos kentälle <i>likes</i> ei anneta arvoa, asetetaan sen arvoksi 0. Muiden kenttien sisällöstä ei tässä tehtävässä vielä välitetä.

Laajenna ohjelmaa siten, että testi menee läpi.

#### 4.12*: blogilistan testit, step5

Tee testit blogin lisäämiselle eli osoitteeseen <i>/api/blogs</i> tapahtuvalle HTTP POST ‑pyynnölle jotka varmistavat, että jos uusi blogi ei sisällä kenttää <i>title</i> tai kenttää <i>url</i>, pyyntöön vastataan statuskoodilla <i>400 Bad Request</i>.

Laajenna toteutusta siten, että testit menevät läpi.

</div>

<div class="content">

### Testien refaktorointia

Testit ovat tällä hetkellä osittain epätäydelliset, sillä esim. reittejä <i>GET /api/notes/:id</i> ja <i>DELETE /api/notes/:id</i> ei tällä hetkellä testata epävalidien id:iden osalta. Myös testien organisoinnissa on hieman toivomisen varaa, sillä kaikki on kirjoitettu suoraan testifunktion "päätasolle". Parempaan luettavuuteen pääsisimme eritellessä loogisesti toisiinsa liittyvät testit <i>describe</i>-lohkoihin.

Jossain määrin parannellut testit ovat seuraavassa:

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
    await Note.insertMany(helper.initialNotes)
  })

  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all notes are returned', async () => {
    const response = await api.get('/api/notes')

    expect(response.body).toHaveLength(helper.initialNotes.length)
  })

  test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes')

    const contents = response.body.map(r => r.content)
    expect(contents).toContain(
      'Browser can execute only JavaScript'
    )
  })

  describe('viewing a specific note', () => {

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
        content: 'async/await simplifies making async calls',
        important: true,
      }

      await api
        .post('/api/notes')
        .send(newNote)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const notesAtEnd = await helper.notesInDb()
      expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)

      const contents = notesAtEnd.map(n => n.content)
      expect(contents).toContain(
        'async/await simplifies making async calls'
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

      expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
    })
  })

  describe('deletion of a note', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const notesAtStart = await helper.notesInDb()
      const noteToDelete = notesAtStart[0]

      await api
        .delete(`/api/notes/${noteToDelete.id}`)
        .expect(204)

      const notesAtEnd = await helper.notesInDb()

      expect(notesAtEnd).toHaveLength(
        helper.initialNotes.length - 1
      )

      const contents = notesAtEnd.map(r => r.content)

      expect(contents).not.toContain(noteToDelete.content)
    })
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
```

Testien raportointi tapahtuu <i>describe</i>-lohkojen ryhmittelyn mukaan:

![Jest ryhmittelee testitulokset describe-lohkoittain](../../images/4/7.png)

Testeihin jää vielä parannettavaa, mutta on jo aika siirtyä eteenpäin.

Käytetty tapa API:n testaamiseen, eli HTTP-pyyntöinä tehtävät operaatiot ja tietokannan tilan tarkastelu Mongoosen kautta ei ole suinkaan ainoa tai välttämättä edes paras tapa tehdä API-tason integraatiotestausta. Universaalisti parasta tapaa testien tekoon ei ole, vaan kaikki on aina suhteessa käytettäviin resursseihin ja testattavaan ohjelmistoon.

Sovelluksen tämänhetkinen koodi on kokonaisuudessaan [GitHubissa](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-6), branchissa <i>part4-6</i>

</div>

<div class="tasks">

### Tehtävät 4.13.-4.14.

#### 4.13 blogilistan laajennus, step1

Toteuta sovellukseen mahdollisuus yksittäisen blogin poistoon.

Käytä async/awaitia. Noudata operaation HTTP-rajapinnan suhteen [RESTful](/osa3/node_js_ja_express#rest)-käytänteitä.

Toteuta ominaisuudelle myös testit.

#### 4.14* blogilistan laajennus, step2

Toteuta sovellukseen mahdollisuus yksittäisen blogin muokkaamiseen.

Käytä async/awaitia.

Tarvitsemme muokkausta lähinnä <i>likejen</i> lukumäärän päivittämiseen. Toiminnallisuuden voi toteuttaa samaan tapaan kuin muistiinpanon päivittäminen toteutettiin [osassa 3](/osa3/tietojen_tallettaminen_mongo_db_tietokantaan#muut-operaatiot).

Toteuta ominaisuudelle myös testit.

</div>
