---
mainImage: ../../images/part-4.svg
part: 4
letter: b
---

<div class="content">


## API:n testaaminen

Joissain tilanteissa voisi olla mielekästä suorittaa ainakin osa backendin testauksesta siten, että oikea tietokanta eristettäisiin testeistä ja korvattaisiin "valekomponentilla" eli mockilla. Eräs tähän sopiva ratkaisu olisi [mongo-mock](https://github.com/williamkapke/mongo-mock).

Koska sovelluksemme backend on koodiltaan kuitenkin suhteellisen yksinkertainen, päätämme testata sitä kokonaisuudessaan, siten että myös testeissä käytetään tietokantaa. Tämän kaltaisia, useita sovelluksen komponentteja yhtäaikaa käyttäviä testejä voi luonnehtia [integraatiotesteiksi](https://en.wikipedia.org/wiki/Integration_testing).

### test-ympäristö

Edellisen osan luvussa [Sovelluksen vieminen tuotantoon](/osa3/#sovelluksen-vieminen-tuotantoon) mainitsimme, että kun sovellusta suoritetaan Herokussa, on se _production_-moodissa.

Noden konventiona on määritellä projektin suoritusmoodi ympäristömuuttujan _NODE_ENV_ avulla. Lataammekin sovelluksen nykyisessä versiossa tiedostossa _.env_ määritellyt ympäristömuuttujat ainoastaan jos sovellus _ei ole_ production moodissa:

```js
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
```

Yleinen käytäntö on määritellä sovelluksille omat moodinsa myös sovelluskehitykseen ja testaukseen.

Määritellään nyt tiedostossa _package.json_, että testejä suorittaessa sovelluksen _NODE_ENV_ saa arvokseen _test_:

```bash
{
  // ...
  "scripts": {
    "start": "NODE_ENV=production node index.js",
    "watch": "NODE_ENV=development nodemon index.js",
    "test": "NODE_ENV=test jest --verbose",
    "lint": "eslint ."
  },
  // ...
}
```

Samalla määriteltiin, että suoritettaessa sovellusta komennolla _npm run watch_ eli nodemonin avulla, on sovelluksen moodi _development_. Jos sovellusta suoritetaan normaalisti Nodella, on moodiksi määritelty _production_.

Määrittelyssämme on kuitenkin pieni ongelma, se ei toimi windowsilla. Tilanne korjautuu asentamalla kirjasto [cross-env](https://www.npmjs.com/package/cross-env) komennolla

```bash
npm install --save-dev cross-env
```

ja muuttamalla _package.js_ kaikilla käyttöjärjestelmillä toimivaan muotoon

```bash
{
  // ...
  "scripts": {
    "start": "cross-env NODE_ENV=production node index.js",
    "watch": "cross-env NODE_ENV=development nodemon index.js",
    "test": "cross-env NODE_ENV=test jest --verbose",
    "lint": "eslint ."
  },
  // ...
}
```

Nyt sovelluksen toimintaa on mahdollista muokata sen suoritusmoodiin perustuen. Eli voimme määritellä, esim. että testejä suoritettaessa ohjelma käyttää erillistä, testejä varten luotua tietokantaa.

Sovelluksen testikanta voidaan luoda tuotantokäytön ja sovelluskehityksen tapaan [mlabiin](https://mlab.com/). Ratkaisu ei ole optimaalinen erityisesti, jos sovellusta on tekemässä yhtä aikaa useita henkilöitä. Testien suoritus nimittäin yleensä edellyttää, että samaa tietokantainstanssia ei ole yhtä aikaa käyttämässä useampia testiajoja.

Testaukseen kannattaakin käyttää verkossa olevaa jaettua tietokantaa mieluummin esim. sovelluskehittäjän paikallisen koneen tietokantaa. Optimiratkaisu olisi tietysti se, että jokaista testiajoa varten olisi käytettävissä oma tietokanta, sekin periaatteessa onnistuu "suhteellisen helposti" mm. [keskusmuistissa toimivan Mongon](https://docs.mongodb.com/manual/core/inmemory/) ja [docker](https://www.docker.com)-kontainereiden avulla. Etenemme kuitenkin nyt lyhyemmän kaavan mukaan ja käytetään testikantana normaalia Mongoa.

Voisimme kirjoittaa ympäristökohtaiset konfiguraatiot, esim. oikean tietokannan valinnan suoraan tiedostoon _index.js_, se kuitenkin tekisi tiedoston koodista sekavan. Eristetään sovelluksen ympäristökohtainen konfigurointi omaan tiedostoon _utils/config.js_ sijoitettavaan moduuliin.

Ideana on, että _index.js_ voi käyttää konfiguraatioita seuraavasti:

```js
const config = require('./utils/config');

// ...

mongoose
  .connect(config.mongoUrl)
  .then(() => {
    console.log('connected to database', config.mongoUrl);
  })
  .catch(err => {
    console.log(err);
  });

// ...

const PORT = config.port;
```

Konfiguraation suorittavan moduulin koodi on seuraavassa:

```js
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

let port = process.env.PORT;
let mongoUrl = process.env.MONGODB_URI;

if (process.env.NODE_ENV === 'test') {
  port = process.env.TEST_PORT;
  mongoUrl = process.env.TEST_MONGODB_URI;
}

module.exports = {
  mongoUrl,
  port,
};
```

Koodi lataa ympäristömuuttujat tiedostosta _.env_ jos se _ei ole_ tuotantomoodissa. Tuotantomoodissa käytetään Herokuun asetettuja ympäristömuuttujia.

Tiedostossa _.env_ on nyt määritelty _erikseen_ sekä sovelluskehitysympäristön että testausympäristön tietokannan osoite (esimerkissä molemmat ovat sovelluskehityskoneen lokaaleja mongo-kantoja) ja portti:

```bash
MONGODB_URI=mongodb://fullstack:sekred@ds111078.mlab.com:11078/fullstact-notes-dev
PORT=3001

TEST_PORT=3002
TEST_MONGODB_URI=mongodb://fullstack:sekred@ds113098.mlab.com:13098/fullstack-notes-test
```

Eri porttien käyttö mahdollistaa sen, että sovellus voi olla käynnissä testien suorituksen aikana.

Omatekemämme eri ympäristöjen konfiguroinnista huolehtiva _config_-moduuli toimii hieman samassa hengessä kuin [node-config](https://github.com/lorenwest/node-config)-kirjasto. Omatekemä konfigurointiympäristö sopii tarkoitukseemme, sillä sovellus on yksinkertainen ja oman konfiguraatio-moduulin tekeminen on myös jossain määrin opettavaista. Isommissa sovelluksissa kannattaa harkita valmiiden kirjastojen, kuten [node-config](https://github.com/lorenwest/node-config):in käyttöä.

Tiedosto _index.js_ muutetaan nyt muotoon:

```js
const http = require('http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const middleware = require('./utils/middleware');
const notesRouter = require('./controllers/notes');
const config = require('./utils/config');

mongoose
  .connect(config.mongoUrl)
  .then(() => {
    console.log('connected to database', config.mongoUrl);
  })
  .catch(err => {
    console.log(err);
  });

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('build'));
app.use(middleware.logger);

app.use('/api/notes', notesRouter);

app.use(middleware.error);

const server = http.createServer(app);

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

server.on('close', () => {
  mongoose.connection.close();
});

module.exports = {
  app,
  server,
};
```

> **HUOM**: koska käytämme useimpia kirjastoja koodissa vain kerran, olisi mahdollista tiivistää koodia hiukan kirjoittamalla esim. <code>app.use(cors())</code> sijaan <code>app.use(require('cors')())</code> ja jättää apumuuttuja _cors_ kokonaan määrittelemättä. On kuitenkin epäselvää kannattaako tälläiseen koodirivien säästelyyn lähteä. Ei ainakaan silloin jos koodin ymmärrettävyys kärsisi.

Tiedoston lopussa on muutama tärkeä muutos.

Sovelluksen käynnistäminen tapahtuu nyt _server_-muuttujassa olevan olion kautta. Serverille määritellään tapahtumankäsitteljäfunktio tapahtumalle _close_ eli tilanteeseen, missä sovellus sammutetaan. Tapahtumankäsittelijä sulkee tietokantayhteyden.

Sekä sovellus _app_ että sitä suorittava _server_-olio määritellään eksportattavaksi tiedostosta. Tämä mahdollistaa sen, että testit voivat käynnistää ja sammuttaa backendin.

Sovelluksen tämänhetkinen koodi on kokonaisuudessaan [githubissa](https://github.com/FullStack-HY/part3-notes-backend/tree/part4-2), tagissa _part4-2_.

### supertest

Käytetään API:n testaamiseen Jestin apuna [supertest](https://github.com/visionmedia/supertest)-kirjastoa.

Kirjasto asennetaan kehitysaikaiseksi riippuvuudeksi komennolla

```bash
npm install --save-dev supertest
```

Luodaan heti ensimmäinen testi tiedostoon _tests/note_api.test.js:_

```js
const supertest = require('supertest');
const { app, server } = require('../index');
const api = supertest(app);

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

afterAll(() => {
  server.close();
});
```

Toisella rivillä testi käynnistää backendin ja käärii sen kolmannella rivillä funktion _supertest_ avulla ns. [superagent](https://github.com/visionmedia/superagent)-olioksi. Tämä olio sijoitetaan muuttujaan _api_ ja sen kautta testit voivat tehdä HTTP-pyyntöjä backendiin.

Testimetodi tekee HTTP GET -pyynnön osoitteeseen _api/notes_ ja varmistaa, että pyyntöön vastataan statuskoodilla 200 ja että data palautetaan oikeassa muodossa, eli että _Content-Type_:n arvo on _application/json_.

Testissä on muutama detalji joihin tutustumme vasta [hieman myöhemmin](#async-await) tässä osassa. Testikoodin määrittelevä nuolifunktio alkaa sanalla _async_ ja _api_-oliolle tehtyä metodikutsua edeltää sama _await_. Teemme ensin muutamia testejä ja tutustumme sen jälkeen async/await-magiaan. Tällä hetkellä niistä ei tarvitse välittää, kaikki toimii kun kirjoitat testimetodit esimerkin mukaan. Async/await-syntaksin käyttö liittyy siihen, että palvelimelle tehtävät pyynnöt ovat _asynkronisia_ operaatioita. [Async/await-kikalla](https://facebook.github.io/jest/docs/en/asynchronous.html) saamme pyynnön näyttämään koodin tasolla synkroonisesti toimivalta.

Huom! Jos eslint herjaa async -syntaksista, niin saat ongelman korjattua lisäämällä seuraavan `.eslintrc.js` tiedostoon ([lisätietoa parserin asetuksista](https://eslint.org/docs/user-guide/configuring#specifying-parser-options)):

```js
module.exports = {
  //...
  parserOptions: {
    ecmaVersion: 2018,
  },
};
```

Kaikkien testien (joita siis tällä kertaa on vain yksi) päätteeksi on vielä lopputoimenpiteenä pyydettävä backendia suorittava _server_-olio sammuttamaan itsensä. Tämä onnistuu helposti metodissa [afterAll](https://facebook.github.io/jest/docs/en/api.html#afterallfn-timeout):

```js
afterAll(() => {
  server.close();
});
```

HTTP-pyyntöjen tiedot loggaava middleware _logger_ häiritsee hiukan testien tulostusta. Jos haluat hiljentää sen testien suorituksen ajaksi, muuta funktiota esim. seuraavasti:

```js
const logger = (request, response, next) => {
  if (process.env.NODE_ENV === 'test') {
    return next();
  }
  console.log('Method:', request.method);
  console.log('Path:  ', request.path);
  console.log('Body:  ', request.body);
  console.log('---');
  next();
};
```

Tehdään pari testiä lisää:

```js
test('there are five notes', async () => {
  const response = await api.get('/api/notes');

  expect(response.body.length).toBe(5);
});

test('the first note is about HTTP methods', async () => {
  const response = await api.get('/api/notes');

  expect(response.body[0].content).toBe('HTML on helppoa');
});
```

Molemmat testit sijoittavat pyynnön vastauksen muuttujaan _response_ ja toisin kuin edellinen testi, joka käytti _supertestin_ mekanismeja statuskoodin ja vastauksen headereiden oikeellisuuden varmistamiseen, tällä kertaa tutkitaan vastauksessa olevan datan, eli _response.body_:n oikeellisuutta Jestin [expect](https://facebook.github.io/jest/docs/en/expect.html#content):in avulla.

Async/await-kikan hyödyt tulevat nyt selkeästi esiin. Normaalisti tarvitsisimme asynkronisten pyyntöjen vastauksiin käsille pääsemiseen promiseja ja takaisinkutsuja, mutta nyt kaikki menee mukavasti:

```js
const res = await api.get('/api/notes');

// tänne tullaan vasta kun edellinen komento eli HTTP-pyyntö on suoritettu
// muuttujassa res on nyt HTTP-pyynnön tulos
expect(res.body.length).toBe(5);
```

Testit menevät läpi. Testit ovat kuitenkin huonoja, niiden läpimeno riippuu tietokannan tilasta (joka sattuu omassa testikannassani olemaan sopiva). Jotta saisimme robustimmat testit, tulee tietokannan tila nollata testien alussa ja sen jälkeen laittaa kantaan hallitusti testien tarvitsema data.

### Error: listen EADDRINUSE :::3002

Jos jotain patologista tapahtuu voi käydä niin, että testien suorittama palvelin jää päälle. Tällöin uusi testiajo aiheuttaa ongelmia, ja seurauksena on virheilmoitus

<pre>
Error: listen EADDRINUSE :::3002
</pre>

Ratkaisu tilanteeseen on tappaa palvelinta suorittava prosessi. Portin 3002 varaava prosessi löytyy OSX:lla ja Linuxilla esim. komennolla <code>lsof -i :3002</code>.

```bash
COMMAND  PID     USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
node    8318 mluukkai   14u  IPv6 0x5428af4833b85e8b      0t0  TCP *:redwood-broker (LISTEN)
```

Windowsissa portin varaavan prosessin näkee resmon.exe:n Verkko-välilehdeltä.

Komennon avulla selviää ikävyyksiä aiheuttavan prosessin PID eli prosessi-id. Prosessin saa tapettua komennolla <code>KILL 8318</code> olettaen että PID on 8318 niin kuin kuvassa. Joskus prosessi on sitkeä eikä kuole ennen kuin se tapetaan komennolla <code>KILL -9 8318</code>.

Windowsissa vastaava komento on <code>taskkill /f /pid 8318</code>.

## Tietokannan alustaminen ennen testejä

Testimme käyttää jo jestin metodia [afterAll](https://facebook.github.io/jest/docs/en/api.html#afterallfn-timeout) sulkemaan backendin testien suoritusten jälkeen. Jest tarjoaa joukon muitakin [funktioita](https://facebook.github.io/jest/docs/en/setup-teardown.html#content), joiden avulla voidaan suorittaa operaatioita ennen yhdenkään testin suorittamista tai ennen jokaisen testin suoritusta.

Päätetään alustaa tietokanta ennen kaikkien testin suoritusta, eli funktiossa [beforeAll](https://facebook.github.io/jest/docs/en/api.html#beforeallfn-timeout):

```js
const supertest = require('supertest');
const { app, server } = require('../index');
const api = supertest(app);
const Note = require('../models/note');

const initialNotes = [
  {
    content: 'HTML on helppoa',
    important: false,
  },
  {
    content: 'HTTP-protokollan tärkeimmät metodit ovat GET ja POST',
    important: true,
  },
];

beforeAll(async () => {
  await Note.remove({});

  let noteObject = new Note(initialNotes[0]);
  await noteObject.save();

  noteObject = new Note(initialNotes[1]);
  await noteObject.save();
});
```

Tietokanta siis tyhjennetään aluksi ja sen jälkeen kantaan lisätään kaksi taulukkoon _initialNotes_ talletettua muistiinpanoa. Näin testien suoritus aloitetaan aina hallitusti samasta tilasta.

Muutetaan kahta jälkimmäistä testiä vielä seuraavasti:

```js
test('all notes are returned', async () => {
  const response = await api.get('/api/notes');

  expect(response.body.length).toBe(initialNotes.length);
});

test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes');

  const contents = response.body.map(r => r.content);

  expect(contents).toContain(
    'HTTP-protokollan tärkeimmät metodit ovat GET ja POST'
  );
});
```

Huomaa jälkimmäisen testin ekspektaatio. Komennolla <code>response.body.map(r => r.content)</code> muodostetaan taulukko API:n palauttamien muistiinpanojen sisällöistä. Jestin [toContain](https://facebook.github.io/jest/docs/en/expect.html#tocontainitem)-ekspektaatiometodilla tarkistetaan että parametrina oleva muistiinpano on kaikkien API:n palauttamien muistiinpanojen joukossa.

Ennen kuin teemme lisää testejä, tarkastellaan tarkemmin mitä _async_ ja _await_ tarkoittavat.

## async-await

Async- ja await ovat ES7:n mukanaan tuoma uusi syntaksi, joka mahdollistaa _promisen palauttavien asynkronisten funktioiden_ kutsumisen siten, että kirjoitettava koodi näyttää synkroniselta.

Esim. muistiinpanojen hakeminen tietokannasta hoidetaan promisejen avulla seuraavasti:

```js
Note.find({}).then(notes => {
  console.log('operaatio palautti seuraavat muistiinpanot', notes);
});
```

Metodikutsu _Note.find()_ palauttaa promisen, ja saamme itse operaation tuloksen rekisteröimällä promiselle tapahtumankäsittelijän metodilla _then_.

Kaikki operaation suorituksen jälkeinen koodi kirjoitetaan tapahtumankäsittelijään. Jos haluaisimme tehdä peräkkäin useita asynkronisia funktiokutsuja, menisi tilanne ikävämmäksi. Joutuisimme tekemään kutsut tapahtumankäsittelijästä. Näin syntyisi potentiaalisesti monimutkaista koodia, pahimmassa tapauksessa jopa niin sanottu [callback-helvetti](http://callbackhell.com/).

[Ketjuttamalla promiseja](https://javascript.info/promise-chaining) tilanne pysyy jollain tavalla hallinnassa, callback-helvetin eli monien sisäkkäisten callbackien sijaan saadaan aikaan siistihkö _then_-kutsujen ketju. Olemmekin nähneet jo kurssin aikana muutaman sellaisen. Seuraavassa vielä erittäin keinotekoinen esimerkki, joka hakee ensin kaikki muistiinpanot ja sitten tuhoaa niistä ensimmäisen:

```js
Note.find({})
  .then(notes => {
    return notes[0].remove();
  })
  .then(response => {
    console.log('the first note is removed');
    // more code here
  });
```

Then-ketju on ok, mutta parempaankin pystytään. Jo ES6:ssa esitellyt [generaattorifunktiot](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) mahdollistivat [ovelan tavan](https://github.com/getify/You-Dont-Know-JS/blob/master/async%20%26%20performance/ch4.md#iterating-generators-asynchronously) määritellä asynkronista koodia siten että se "näyttää synkroniselta". Syntaksi ei kuitenkaan ole täysin luonteva ja sitä ei käytetä kovin yleisesti.

ES7:ssa _async_ ja _await_ tuovat generaattoreiden tarjoaman toiminnallisuuden ymmärrettävästi ja syntaksin puolesta selkeällä tavalla koko Javascript-kansan ulottuville.

Voisimme hakea tietokannasta kaikki muistiinpanot [await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)-operaattoria hyödyntäen seuraavasti:

```js
const notes = await Note.find({});

console.log('operaatio palautti seuraavat muistiinpanot ', notes);
```

Koodi siis näyttää täsmälleen synkroniselta koodilta. Suoritettavan koodinpätkän suhteen tilanne on se, että suoritus pysähtyy komentoon <code>const notes = await Note.find({})</code> ja jatkuu kyselyä vastaavan promisen _fulfillmentin_ eli onnistuneen suorituksen jälkeen seuraavalta riviltä. Kun suoritus jatkuu, promisea vastaavan operaation tulos on muuttujassa _notes_.

Ylempänä oleva monimutkaisempi esimerkki suoritettaisiin awaitin avulla seuraavasti:

```js
const notes = await Note.find({});
const response = await notes[0].remove();

console.log('the first note is removed');
```

Koodi siis yksinkertaistuu huomattavasti verrattuna promiseja käyttävään then-ketjuun.

Awaitin käyttöön liittyy parikin tärkeää seikkaa. Jotta asynkronisia operaatioita voi kutsua awaitin avulla, niiden täytyy olla promiseja. Tämä ei sinänsä ole ongelma, sillä myös "normaaleja" callbackeja käyttävä asynkroninen koodi on helppo kääriä promiseksi.

Mistä tahansa kohtaa Javascript-koodia ei awaitia kuitenkaan pysty käyttämään. Awaitin käyttö onnistuu ainoastaan jos ollaan [async](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)-funktiossa.

Eli jotta edelliset esimerkit toimisivat, on ne suoritettava async-funktioiden sisällä, huomaa funktion määrittelevä rivi:

```js
const main = async () => {
  const notes = await Note.find({});
  console.log('operaatio palautti seuraavat muistiinpanot', notes);

  const notes = await Note.find({});
  const response = await notes[0].remove();

  console.log('the first note is removed');
};

main();
```

Koodi määrittelee ensin asynkronisen funktion, joka sijoitetaan muuttujaan _main_. Määrittelyn jälkeen koodi kutsuu metodia komennolla <code>main()</code>

### testin beforeAll-metodin optimointi

Palataan takaisin testien pariin, ja tarkastellaan määrittelemäämme testit alustavaa funktiota _beforeAll_:

```js
const initialNotes = [
  {
    content: 'HTML on helppoa',
    important: false,
  },
  {
    content: 'HTTP-protokollan tärkeimmät metodit ovat GET ja POST',
    important: true,
  },
];

beforeAll(async () => {
  await Note.remove({});

  let noteObject = new Note(initialNotes[0]);
  await noteObject.save();

  noteObject = new Note(initialNotes[1]);
  await noteObject.save();
});
```

Funktio tallettaa tietokantaan taulukon _initialNotes_ nollannen ja ensimmäisen alkion, kummankin erikseen taulukon alkioita indeksöiden. Ratkaisu on ok, mutta jos haluaisimme tallettaa alustuksen yhteydessä kantaan useampia alkioita, olisi toisto parempi ratkaisu:

```js
beforeAll(async () => {
  await Note.remove({})
  console.log('cleared')

  initialNotes.forEach(async (note) => {
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

Talletamme siis taulukossa _initialNotes_ määritellyt muistiinpanot tietokantaan _forEach_-loopissa. Testeissä kuitenkin ilmenee jotain häikkää, ja sitä varten koodin sisään on lisätty aputulosteita.

Konsoliin tulostuu

<pre>
cleared
done
entered test
saved
saved
</pre>

Yllättäen ratkaisu ei async/awaitista huolimatta toimi niin kuin oletamme, testin suoritus aloitetaan ennen kuin tietokannan tila on saatu alustettua!

Ongelma on siinä, että jokainen forEach-loopin läpikäynti generoi oman asynkronisen operaation ja _beforeAll_ ei odota näiden suoritusta. Eli forEach:in sisällä olevat _await_-komennot eivät ole funktiossa _beforeAll_ vaan erillisissä funktioissa joiden päättymistä _beforeAll_ ei odota.

Koska testien suoritus alkaa heti _beforeAll_ metodin suorituksen jälkeen, testien suoritus ehditään jo aloittaa ennen kuin tietokanta on alustettu toivottuun alkutilaan.

Toimiva ratkaisu tilanteessa on odottaa asynkronisten talletusoperaatioiden valmistumista _beforeAll_-funktiossa, esim. metodin [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) avulla:

```js
beforeAll(async () => {
  await Note.remove({});

  const noteObjects = initialNotes.map(note => new Note(note));
  const promiseArray = noteObjects.map(note => note.save());
  await Promise.all(promiseArray);
});
```

Ratkaisu on varmasti aloittelijalle tiiviydestään huolimatta hieman haastava. Taulukkoon _noteObjects_ talletetaan taulukkoon _initialNotes_ talletettuja Javascript-oliota vastaavat _Note_-konstruktorifunktiolla generoidut Mongoose-oliot. Seuraavalla rivillä luodaan uusi taulukko, joka _muodostuu promiseista_, jotka saadaan kun jokaiselle _noteObjects_ taulukon alkiolle kutsutaan metodia _save_, eli ne talletetaan kantaan.

Metodin [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) avulla saadaan koostettua taulukollinen promiseja yhdeksi promiseksi, joka valmistuu, eli menee tilaan _fulfilled_ kun kaikki sen parametrina olevan taulukon promiset ovat valmistuneet.
Siispä viimeinen rivi, <code>await Promise.all(promiseArray)</code> odottaa, että kaikki tietokantaan talletetusta vastaavat promiset ovat valmiina, eli alkiot on talletettu tietokantaan.

> Promise.all-metodia käyttäessä päästään tarvittaessa käsiksi sen parametrina olevien yksittäisten promisejen arvoihin, eli promiseja vastaavien operaatioiden tuloksiin. Jos odotetaan promisejen valmistumista _await_-syntaksilla <code>const results = await Promise.all(promiseArray)</code> palauttaa operaatio taulukon, jonka alkioina on _promiseArray_:n promiseja vastaavat arvot samassa järjestyksessä kuin promiset ovat taulukossa.

Promise.all suorittaa kaikkia syötteenä saamiaan promiseja rinnakkain. Jos operaatioiden suoritusjärjestyksellä on merkitystä, voi tämä aiheuttaa ongelmia. Tällöin asynkroniset operaatiot on mahdollista määrittää [for...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of) lohkon sisällä, jonka suoritusjärjestys on taattu.

```js
beforeAll(async () => {
  await Note.remove({});

  for (let note of initialNotes) {
    let noteObject = new Note(note);
    await noteObject.save();
  }
});
```

Javascriptin asynkroninen suoritusmalli aiheuttaakin siis helposti yllätyksiä ja myös async/await-syntaksin kanssa pitää olla koko ajan tarkkana. Vaikka async/await peittää monia promisejen käsittelyyn liittyviä seikkoja, promisejen toiminta on syytä tuntea mahdollisimman hyvin!

Sovelluksen tämänhetkinen koodi on kokonaisuudessaan [githubissa](https://github.com/FullStack-HY/part3-notes-backend/tree/part4-3), tagissa _part4-3_.

### async/await backendissä

Muutetaan nyt backend käyttämään asyncia ja awaitia. Koska kaikki asynkroniset operaatiot tehdään joka tapauksessa funktioiden sisällä, awaitin käyttämiseen riittää, että muutamme routejen käsittelijät async-funktioiksi.

Kaikkien muistiinpanojen hakemisesta vastaava route muuttuu seuraavasti:

```js
notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({});
  response.json(notes.map(formatNote));
});
```

Voimme varmistaa refaktoroinnin onnistumisen selaimella, sekä suorittamalla juuri määrittelemämme testit.

### ESlint ja async/await nuolifunktioissa

Ennen testejä tehdään pieni täsmennys ESlint-konfiguraatioon. Tällä hetkellä ESlint saattaa valittaa _async_-määreellä varustetuista nuolifunktioista:

![](../images/4/4b.png)

Kyse on siitä, että ESlint ei vielä osaa tulkita uutta syntaksia kunnolla. Voi hyvin olla, että [aiemmassa luvussa](osa4/#supertest) tehty _parserOptions_ määrittely on jo korjannut ongelman. Muuten pääsemme valituksesta eroon asentamalla _babel-eslint_-pluginin:

```bash
npm install babel-eslint --save-dev
```

Pluginin käyttöönotto tulee määritellä tiedostossa _.eslintrc.js_ :

```bash
module.exports = {
  "env": {
    "node": true,
    "es6": true
  },
  "parser": "babel-eslint",
  // ...
}
```

Aiheeton valitus poistuu.


### Testejä ja backendin refaktorointia

Koodia refaktoroidessa vaanii aina [regression](https://en.wikipedia.org/wiki/Regression_testing) vaara, eli on olemassa riski, että jo toimineet ominaisuudet hajoavat. Tehdäänkin muiden operaatioiden refaktorointi siten, että ennen koodin muutosta tehdään jokaiselle API:n routelle sen toiminnallisuuden varmistavat testit.

Aloitetaan lisäysoperaatiosta. Tehdään testi, joka lisää uuden muistiinpanon ja tarkistaa, että API:n palauttamien muistiinpanojen määrä kasvaa, ja että lisätty muistiinpano on palautettujen joukossa:

```js
test('a valid note can be added ', async () => {
  const newNote = {
    content: 'async/await yksinkertaistaa asynkronisten funktioiden kutsua',
    important: true,
  };

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const response = await api.get('/api/notes');

  const contents = response.body.map(r => r.content);

  expect(response.body.length).toBe(initialNotes.length + 1);
  expect(contents).toContain(
    'async/await yksinkertaistaa asynkronisten funktioiden kutsua'
  );
});
```

Kuten odotimme ja toivoimme, menee testi läpi.

Tehdään myös testi, joka varmistaa, että muistiinpanoa, jolle ei ole asetettu sisältöä, ei talleteta

```js
test('note without content is not added ', async () => {
  const newNote = {
    important: true,
  };

  const initialNotes = await api.get('/api/notes');

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(400);

  const response = await api.get('/api/notes');

  expect(response.body.length).toBe(initialNotes.length);
});
```

Testi ei mene läpi.

Käy ilmi, että myös operaation suoritus postman tai Visual Studio Coden REST clientillä johtaa virhetilanteeseen. Koodissa on siis bugi.

> **Huom:** testejä tehdessä täytyy aina varmistua siitä, että testi testaa oikeaa asiaa, ja usein ensimmäistä kertaa testiä tehdessä se että testi ei mene läpi tarkoittaa sitä, että testi on tehty väärin. Myös päinvastaista tapahtuu, eli testi menee läpi mutta koodissa onkin virhe, eli testi ei testaa sitä mitä sen piti testata. Tämän takia testit kannattaa aina "testata" rikkomalla koodi ja varmistamalla, että testi huomaa koodiin tehdyt virheet.

Kun suoritamme operaation postmanilla konsoli paljastaa, että kyseessä on _Unhandled promise rejection_, eli koodi ei käsittele promisen virhetilannetta:

<pre>
Server running on port 3001
Method: POST
Path:   /api/notes/
Body:   { important: true }
---
(node:28657) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 1): Error: Can't set headers after they are sent.
(node:28657) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
</pre>

Kuten jo edellisessä osassa mainittiin, tämä ei ole hyvä idea. Kannattaakin aloittaa lisäämällä promise-ketjuun metodilla _catch_ virheenkäsittelijä, joka tulostaa konsoliin virheen syyn:

```js
notesRouter.post('/', (request, response) => {
  // ...

  note
    .save()
    .then(note => {
      return formatNote(note)
    })
    .then(formattedNote => {
      response.json(formattedNote)
    })
    .catch(error => {
      console.log(error)
      response.status(500).json({ error: 'something went wrong...' })
    })
```

Konsoliin tulostuu seuraava virheilmoitus

<pre>
Error: Can't set headers after they are sent.
    at validateHeader (_http_outgoing.js:489:11)
    at ServerResponse.setHeader (_http_outgoing.js:496:3)
</pre>

Aloittelijalle virheilmoitus ei välttämättä kerro paljoa, mutta googlaamalla virheilmoituksella, pieni etsiminen tuottaisi jo tuloksen.

Kyse on siitä, että koodi kutsuu _response_-olion metodia _send_ kaksi kertaa, tai oikeastaan koodi kutsuu metodia _json_, joka kutsuu edelleen metodia _send_.

Kaksi kertaa tapahtuva _send_-kutsu johtuu siitä, että koodin alun _if_-lauseessa on ongelma:

```js
notesRouter.post('/', (request, response) => {
  const body = request.body

  if (body.content === undefined) {
    response.status(400).json({ error: 'content missing' })
    // suoritus jatkuu!
  }

  //...
}
```

kun koodi kutsuu <code>response.status(400).json(...)</code> suoritus jatkaa koodin alla olevaa osaan ja se taas aiheuttaa uuden <code>response.json()</code>-kutsun.

Korjataan ongelma lisäämällä _if_-lauseeseen _return_:

```js
notesRouter.post('/', (request, response) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  //...
}
```

Edellisen osan lopussa koodi oli vielä oikein, mutta siirtäessämme osan alussa koodia tiedostosta _index.js_ uuteen paikkaan, on _return_ kadonnut matkalta.

Promiseja käyttävä koodi toimii nyt ja testitkin menevät läpi. Olemme valmiit muuttamaan koodin käyttämään async/await-syntaksia.

Koodi muuttuu seuraavasti (huomaa, että käsittelijän alkuun on laitettava määre _async_):

```js
notesRouter.post('/', async (request, response) => {
  const body = request.body;

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' });
  }

  const note = new Note({
    content: body.content,
    important: body.important === undefined ? false : body.important,
    date: new Date(),
  });

  const savedNote = await note.save();
  response.json(formatNote(savedNote));
});
```

Koodiin jää kuitenkin pieni ongelma: virhetilanteita ei nyt käsitellä ollenkaan. Miten niiden suhteen tulisi toimia?

### virheiden käsittely ja async/await

Jos sovellus POST-pyyntöä käsitellessään aiheuttaa jonkinlaisen ajonaikaisen virheen, syntyy jälleen tuttu tilanne:

<pre>
(node:30644) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 1): TypeError: formattedNote.nonexistingMethod is not a function
</pre>

eli käsittelemätön promisen rejektoituminen. Pyyntöön ei vastata tilanteessa mitenkään.

Async/awaitia käyttäessä kannattaa käyttää vanhaa kunnon _try/catch_-mekanismia virheiden käsittelyyn:

```js
notesRouter.post('/', async (request, response) => {
  try {
    const body = request.body;

    if (body.content === undefined) {
      return response.status(400).json({ error: 'content missing' });
    }

    const note = new Note({
      content: body.content,
      important: body.important === undefined ? false : body.important,
      date: new Date(),
    });

    const savedNote = await note.save();
    response.json(formatNote(note));
  } catch (exception) {
    console.log(exception);
    response.status(500).json({ error: 'something went wrong...' });
  }
});
```

Iso try/catch tuo koodiin hieman ikävän vivahteen, mutta mikään ei ole ilmaista.

Tehdään sitten testit yksittäisen muistiinpanon tietojen katsomiselle ja muistiinpanon poistolle:

```js
test('a specific note can be viewed', async () => {
  const resultAll = await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const aNoteFromAll = resultAll.body[0];

  const resultNote = await api.get(`/api/notes/${aNoteFromAll.id}`);

  const noteObject = resultNote.body;

  expect(noteObject).toEqual(aNoteFromAll);
});

test('a note can be deleted', async () => {
  const newNote = {
    content: 'HTTP DELETE poistaa resurssin',
    important: true,
  };

  const addedNote = await api.post('/api/notes').send(newNote);

  const notesAtBeginningOfOperation = await api.get('/api/notes');

  await api.delete(`/api/notes/${addedNote.body.id}`).expect(204);

  const notesAfterDelete = await api.get('/api/notes');

  const contents = notesAfterDelete.body.map(r => r.content);

  expect(contents).not.toContain('HTTP DELETE poistaa resurssin');
  expect(notesAfterDelete.body.length).toBe(
    notesAtBeginningOfOperation.body.length - 1
  );
});
```

Testit eivät tässä vaiheessa ole optimaaliset, parannetaan niitä kohta. Ensin kuitenkin refaktoroidaan backend käyttämään async/awaitia.

```js
notesRouter.get('/:id', async (request, response) => {
  try {
    const note = await Note.findById(request.params.id);

    if (note) {
      response.json(formatNote(note));
    } else {
      response.status(404).end();
    }
  } catch (exception) {
    console.log(exception);
    response.status(400).send({ error: 'malformatted id' });
  }
});

notesRouter.delete('/:id', async (request, response) => {
  try {
    await Note.findByIdAndRemove(request.params.id);

    response.status(204).end();
  } catch (exception) {
    console.log(exception);
    response.status(400).send({ error: 'malformatted id' });
  }
});
```

Async/await ehkä selkeyttää koodia jossain määrin, mutta saavutettava hyöty ei ole sovelluksessamme vielä niin iso mitä se tulee olemaan jos asynkronisia kutsuja on tehtävä useampia.

Kaikki eivät kuitenkaan ole vakuuttuneita siitä, että async/await on hyvä lisä Javascriptiin, lue esim. [ES7 async functions - a step in the wrong direction](https://spion.github.io/posts/es7-async-await-step-in-the-wrong-direction.html)

Sovelluksen tämänhetkinen koodi on kokonaisuudessaan [githubissa](https://github.com/FullStack-HY/part3-notes-backend/tree/part4-4), tagissa _part4-4_. Samassa on "vahingossa" mukana testeistä seuraavan luvun jälkeinen paranneltu versio.

### Varoitus

Jos huomaat kirjoittavasi sekaisin async/awaitia ja _then_-kutsuja, on 99% varmaa, että teet jotain väärin. Käytä siis jompaa kumpaa tapaa, älä missään tapauksessa "varalta" molempia.

## Tehtäviä

Tee nyt tehtävät [4.8-4.11](/tehtävät/#apin-testaaminen)

## Testien refaktorointi

Testimme sisältävät tällä hetkellä jossain määrin toisteisuutta ja niiden rakenne ei ole optimaalinen. Testit ovat myös osittain epätäydelliset, esim. reittejä GET /api/notes/:id ja DELETE /api/notes/:id ei tällä hetkellä testata epävalidien id:iden osalta.

Testeissä on myös eräs hieman ikävä ja jopa riskialtis piirre. Testit luottavat siihen, että ne suoritetaan siinä järjestyksessä, missä ne on kirjoitettu testitiedostoon. Tämä pitää kyllä paikkansa, vaikkakin se ei ole kovin selkeästi määritelty ominaisuus eli siihen ei ole hyvä luottaa. Testit tuleekin kirjoittaa siten, että yksittäiset testit ovat riippumattomia toistensa suorituksesta.

Parannellaan testejä hiukan.

Tehdään testejä varten muutama apufunktio moduuliin _tests/test_helper.js_

```js
const Note = require('../models/note');

const initialNotes = [
  {
    content: 'HTML on helppoa',
    important: false,
  },
  {
    content: 'HTTP-protokollan tärkeimmät metodit ovat GET ja POST',
    important: true,
  },
];

const format = note => {
  return {
    content: note.content,
    important: note.important,
    id: note._id,
  };
};

const nonExistingId = async () => {
  const note = new Note();
  await note.save();
  await note.remove();

  return note._id.toString();
};

const notesInDb = async () => {
  const notes = await Note.find({});
  return notes.map(format);
};

module.exports = {
  initialNotes,
  format,
  nonExistingId,
  notesInDb,
};
```

Tärkein apufunktioista on _notesInDb_ joka palauttaa kaikki tietokannassa kutsuhetkellä olevat oliot.

Jossain määrin parannellut testit seuraavassa:

```js
const supertest = require('supertest');
const { app, server } = require('../index');
const api = supertest(app);
const Note = require('../models/note');
const {
  format,
  initialNotes,
  nonExistingId,
  notesInDb,
} = require('./test_helper');

describe('when there is initially some notes saved', async () => {
  beforeAll(async () => {
    await Note.remove({});

    const noteObjects = initialNotes.map(n => new Note(n));
    await Promise.all(noteObjects.map(n => n.save()));
  });

  test('all notes are returned as json by GET /api/notes', async () => {
    const notesInDatabase = await notesInDb();

    const response = await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.length).toBe(notesInDatabase.length);

    const returnedContents = response.body.map(n => n.content);
    notesInDatabase.forEach(note => {
      expect(returnedContents).toContain(note.content);
    });
  });

  test('individual notes are returned as json by GET /api/notes/:id', async () => {
    const notesInDatabase = await notesInDb();
    const aNote = notesInDatabase[0];

    const response = await api
      .get(`/api/notes/${aNote.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.content).toBe(aNote.content);
  });

  test('404 returned by GET /api/notes/:id with nonexisting valid id', async () => {
    const validNonexistingId = await nonExistingId();

    const response = await api
      .get(`/api/notes/${validNonexistingId}`)
      .expect(404);
  });

  test('400 is returned by GET /api/notes/:id with invalid id', async () => {
    const invalidId = '5a3d5da59070081a82a3445';

    const response = await api.get(`/api/notes/${invalidId}`).expect(400);
  });

  describe('addition of a new note', async () => {
    test('POST /api/notes succeeds with valid data', async () => {
      const notesAtStart = await notesInDb();

      const newNote = {
        content: 'async/await yksinkertaistaa asynkronisten funktioiden kutsua',
        important: true,
      };

      await api
        .post('/api/notes')
        .send(newNote)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const notesAfterOperation = await notesInDb();

      expect(notesAfterOperation.length).toBe(notesAtStart.length + 1);

      const contents = notesAfterOperation.map(r => r.content);
      expect(contents).toContain(
        'async/await yksinkertaistaa asynkronisten funktioiden kutsua'
      );
    });

    test('POST /api/notes fails with proper statuscode if content is missing', async () => {
      const newNote = {
        important: true,
      };

      const notesAtStart = await notesInDb();

      await api
        .post('/api/notes')
        .send(newNote)
        .expect(400);

      const notesAfterOperation = await notesInDb();

      const contents = notesAfterOperation.map(r => r.content);

      expect(notesAfterOperation.length).toBe(notesAtStart.length);
    });
  });

  describe('deletion of a note', async () => {
    let addedNote;

    beforeAll(async () => {
      addedNote = new Note({
        content: 'poisto pyynnöllä HTTP DELETE',
        important: false,
      });
      await addedNote.save();
    });

    test('DELETE /api/notes/:id succeeds with proper statuscode', async () => {
      const notesAtStart = await notesInDb();

      await api.delete(`/api/notes/${addedNote._id}`).expect(204);

      const notesAfterOperation = await notesInDb();

      const contents = notesAfterOperation.map(r => r.content);

      expect(contents).not.toContain(addedNote.content);
      expect(notesAfterOperation.length).toBe(notesAtStart.length - 1);
    });
  });

  afterAll(() => {
    server.close();
  });
});
```

Muutama huomio testeistä. Olemme jaotelleet testejä [describe](http://facebook.github.io/jest/docs/en/api.html#describename-fn)-lohkojen avulla ja muutamissa lohkoissa on oma [beforeAll](http://facebook.github.io/jest/docs/en/api.html#beforeallfn-timeout)-funktiolla suoritettava alustuskoodi.

Joissain tapauksissa tämä olisi parempi tehdä operaatiolla [beforeEach](https://facebook.github.io/jest/docs/en/api.html#beforeeachfn-timeout), joka suoritetaan _ennen jokaista testiä_, näin testeistä saisi varmemmin toisistaan riippumattomia. Esimerkissä beforeEachia ei kuitenkaan ole käytetty.

Testien raportointi tapahtuu _describe_-lohkojen ryhmittelyn mukaan:

![](../assets/4/5.png)

Backendin tietokannan tilaa muuttavat testit, esim. uuden muistiinpanon lisäämistä testaava testi _'addition of a new note'_, on tehty siten, että ne ensin aluksi selvittävät tietokannan tilan apufunktiolla _notesInDb()_

```js
const notesAtBeginningOfOperation = await notesInDb();
```

suorittavat testattavan operaation:

```js
const newNote = {
  content: 'async/await yksinkertaistaa asynkronisten funktioiden kutsua',
  important: true,
};

await api
  .post('/api/notes')
  .send(newNote)
  .expect(200)
  .expect('Content-Type', /application\/json/);
```

selvittävät tietokannan tilan operaation jälkeen

```js
const notesAfterOperation = await notesInDb();
```

ja varmentavat, että operaation suoritus vaikutti tietokantaan halutulla tavalla

```js
expect(notesAfterOperation.length).toBe(notesAtBeginningOfOperation.length + 1);

const contents = notesAfterOperation.map(r => r.content);
expect(contents).toContain(
  'async/await yksinkertaistaa asynkronisten funktioiden kutsua'
);
```

Testeihin jää vielä paljon parannettavaa mutta on jo aika siirtyä eteenpäin.

Käytetty tapa API:n testaamiseen, eli HTTP-pyyntöinä tehtävät operaatiot ja tietokannan tilan tarkastelu Mongoosen kautta ei ole suinkaan ainoa tai välttämättä edes paras tapa tehdä API-tason integraatiotestausta. Universaalisti parasta tapaa testien tekoon ei ole, vaan kaikki on aina suhteessa käytettäviin resursseihin ja testattavaan ohjelmistoon.

## Tehtäviä

Tee nyt tehtävät [4.12-4.14](/tehtävät#lisää-toiminnallisuutta-ja-testejä)


</div>
