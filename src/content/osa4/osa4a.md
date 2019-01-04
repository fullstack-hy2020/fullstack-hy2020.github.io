---
title: osa 4
subTitle: Node.js / Express
path: /osa4/node-express
mainImage: ../../images/osa5.png
part: 4
letter: a
partColor: yellow
---

<div class="content">

## Sovelluksen rakenteen parantelu

Jatketaan [osassa 3](/osa3) tehdyn muistiinpanosovelluksen backendin kehittämistä.

Muutetaan sovelluksen rakennetta siten, että projektin juuressa oleva _index.js_ ainoastaan konfiguroi sovelluksen tietokannan ja käytettävät middlewaret. Routejen määrittely siirretään omaan tiedostoonsa, eli siitä tehdään [moduuli](/osa3/#tietokantamäärittelyjen-eriyttäminen-omaksi-moduuliksi).

Routejen tapahtumankäsittelijöitä kutsutaan usein _kontrollereiksi_. Luodaankin hakemisto _controllers_ ja sinne tiedosto _notes.js_ johon tulemme siirtämään kaikki muistiinpanoihin liittyvien reittien määrittelyt.

Tiedoston sisältö on seuraava:

```js
const notesRouter = require('express').Router();
const Note = require('../models/note');

const formatNote = note => {
  return {
    id: note._id,
    content: note.content,
    date: note.date,
    important: note.important,
  };
};

notesRouter.get('/', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes.map(formatNote));
  });
});

notesRouter.get('/:id', (request, response) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(formatNote(note));
      } else {
        response.status(404).end();
      }
    })
    .catch(error => {
      response.status(400).send({ error: 'malformatted id' });
    });
});

notesRouter.delete('/:id', (request, response) => {
  Note.findByIdAndRemove(request.params.id)
    .then(result => {
      console.log(result);
      response.status(204).end();
    })
    .catch(error => {
      response.status(400).send({ error: 'malformatted id' });
    });
});

notesRouter.post('/', (request, response) => {
  const body = request.body;

  if (body.content === undefined) {
    response.status(400).json({ error: 'content missing' });
  }

  const note = new Note({
    content: body.content,
    important: body.important === undefined ? false : body.important,
    date: new Date(),
  });

  note
    .save()
    .then(note => {
      return formatNote(note);
    })
    .then(formattedNote => {
      response.json(formattedNote);
    });
});

notesRouter.put('/:id', (request, response) => {
  const body = request.body;

  const note = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(formatNote(updatedNote));
    })
    .catch(error => {
      console.log(error);
      response.status(400).send({ error: 'malformatted id' });
    });
});

module.exports = notesRouter;
```

Kyseessä on käytännössä melkein suora copypaste tiedostosta _index.js_.

Muutoksia on muutama. Tiedoston alussa luodaan [router](http://expressjs.com/en/api.html#router)-olio:

```js
const notesRouter = require('express').Router();

//...

module.exports = notesRouter;
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

> A router object is an isolated instance of middleware and routes. You can think of it as a “mini-application,” capable only of performing middleware and routing functions. Every Express application has a built-in app router.

Router on siis _middleware_, jonka avulla on mahdollista määritellä joukko "toisiinsa liittyviä" routeja yhdessä paikassa, yleensä omassa moduulissaan.

Ohjelman käynnistystiedosto, eli määrittelyt tekevä _index.js_ ottaa määrittelemämme routerin käyttöön seuraavasti:

```js
const notesRouter = require('./controllers/notes');
app.use('/api/notes', notesRouter);
```

Näin määrittelemäämme routeria käytetään _jos_ polun alkuosa on _/api/notes_. notesRouter-olion sisällä täytyy tämän takia käyttää ainoastaan polun loppuosia, eli tyhjää polkua _/_ tai pelkkää parametria _/:id_.

### sovelluksen muut osat

Sovelluksen käynnistyspisteenä toimiva _index.js_ näyttää muutosten jälkeen seuraavalta:

```js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const middleware = require('./utils/middleware');
const notesRouter = require('./controllers/notes');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to database', process.env.MONGODB_URI);
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

Tiedostossa siis otetaan käyttöön joukko middlewareja, näistä yksi on polkuun _/api/notes_ kiinnitettävä _notesRouter_ (tai notes-kontrolleri niin kuin jotkut sitä kutsuisivat).

Tietokannan yhteydenmuodostuksen suorittavaan funktioon on myös lisätty tapahtumankäsittelijä, joka ilmoittaa onko yhteyden muodostus onnistunut vai ei.

Middlewareista kaksi _middleware.logger_ ja _middleware.error_ on määritelty hakemiston _utils_ tiedostossa _middleware.js_:

```js
const logger = (request, response, next) => {
  console.log('Method:', request.method);
  console.log('Path:  ', request.path);
  console.log('Body:  ', request.body);
  console.log('---');
  next();
};

const error = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

module.exports = {
  logger,
  error,
};
```

Tietokantayhteyden muodostaminen on nyt siirretty konfiguraatiot tekevän _index.js_:n vastuulle. Hakemistossa _models_ oleva tiedosto _note.js_ sisältää nyt ainoastaan muistiinpanojen skeeman määrittelyn.

```js
const mongoose = require('mongoose');

const Note = mongoose.model('Note', {
  content: String,
  date: Date,
  important: Boolean,
});

module.exports = Note;
```

Sovelluksen tämänhetkinen koodi on kokonaisuudessaan [githubissa](https://github.com/FullStack-HY/part3-notes-backend/tree/part4-1), tagissa _part4-1_:

Jos kloonaat projektin itsellesi, suorita komento _npm install_ ennen käynnistämistä eli komentoa _npm start_.

Express-sovelluksien rakenteelle, eli hakemistojen ja tiedostojen nimennälle ei ole olemassa mitään yleismaailmallista standardia samaan tapaan kuin esim. Ruby on Railsissa. Tässä käyttämämme malli noudattaa eräitä internetissä vastaan tulevia hyviä käytäntöjä.

## Tehtäviä

Tee nyt tehtävät [4.1 ja 4.2](/tehtävät#sovelluksen-alustus-ja-rakenne)

## node-sovellusten testaaminen

Olemme laiminlyöneet ikävästi yhtä oleellista ohjelmistokehityksen osa-aluetta, automatisoitua testaamista.

Aloitamme yksikkötestauksesta. Sovelluksemme logiikka on sen verran yksinkertaista, että siinä ei ole juurikaan mielekästä yksikkötestattavaa. Luodaan tiedosto _utils/for_testing.js_ ja määritellään sinne pari yksinkertaista funktiota testattavaksi:

```js
const palindrom = string => {
  return string
    .split('')
    .reverse()
    .join('');
};

const average = array => {
  const reducer = (sum, item) => {
    return sum + item;
  };

  return array.reduce(reducer, 0) / array.length;
};

module.exports = {
  palindrom,
  average,
};
```

> Metodi _average_ käyttää taulukoiden metodia [reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce). Jos metodi ei ole vieläkään tuttu, on korkea aika katsoa youtubesta [Functional Javascript](https://www.youtube.com/watch?v=BMUiFMZr7vk&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84) -sarjasta ainakin kolme ensimmäistä videoa.

Javascriptiin on tarjolla runsaasti erilaisia testikirjastoja eli _test runnereita_. Käytämme tällä kurssilla Facebookin kehittämää ja sisäisesti käyttämää [jest](https://jestjs.io/):iä, joka on toiminnaltaan ja syntaksiltaankin hyvin samankaltainen kuin tämän hetken eniten käytetty testikirjasto [Mocha](https://mochajs.org/). Muitakin mahdollisuuksia olisi, esim. eräissä piireissä suosiota nopeasti saavuttanut [ava](https://github.com/avajs/ava).

Jest on tälle kurssille luonteva valinta, sillä se sopii hyvin backendien testaamiseen, mutta suorastaan loistaa Reactilla tehtyjen frontendien testauksessa.

> _Huomio Windows-käyttäjille:_ jest ei välttämättä toimi, jos projektin hakemistopolulla on hakemisto, jonka nimessä on välilyöntejä.

Koska testejä on tarkoitus suorittaa ainoastaan sovellusta kehitettäessä, asennetaan _jest_ kehitysaikaiseksi riippuvuudeksi komennolla

```bash
npm install --save-dev jest
```

määritellään _npm_ skripti _test_ suorittamaan testaus jestillä ja raportoimaan testien suorituksesta _verbose_-tyylillä:

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

Jestin uudemmissa versioissa näyttäisi olevan tarve kertoa, että suoritusympäristönä on käytössä Node. Tämä tapahtuu esim. lisäämällä _package.json_ tiedoston loppuun:

```js
{
 //...
 "jest": {
   "testEnvironment": "node"
 }
}
```

Tai vaihtoehtoisesti Jest löytää myös oletuksena asetustiedoston nimellä _jest.config.js_, jonne suoritusympäristön määrittely tapahtuu seuraavasti:

```js
module.exports = {
  testEnvironment: 'node',
};
```

Tehdään testejä varten hakemisto _tests_ ja sinne tiedosto _palindrom.test.js_, jonka sisältö on seuraava

```js
const palindrom = require('../utils/for_testing').palindrom;

test('palindrom of a', () => {
  const result = palindrom('a');

  expect(result).toBe('a');
});

test('palindrom of react', () => {
  const result = palindrom('react');

  expect(result).toBe('tcaer');
});

test('palindrom of saippuakauppias', () => {
  const result = palindrom('saippuakauppias');

  expect(result).toBe('saippuakauppias');
});
```

Edellisessä osassa käyttöön ottamamme ESlint valittaa testien käyttämistä komennoista _test_ ja _expect_ sillä käyttämämme konfiguraatio kieltää _globaalina_ määriteltyjen asioiden käytön. Poistetaan valitus lisäämällä _.eslintrc.js_-tiedoston kenttään _env_ arvo `"jest": true`. Näin kerromme eslintille, että käytämme projektissamme Jestiä ja sen globaaleja muuttujia.

```js
module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  extends: 'eslint:recommended',
  rules: {
    //...
  },
};
```

Toinen tapa olisi lisätä kenttä _globals_ ja määrittää käytetyt globaalit muuttujat seuraavasti:

```js
module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: 'eslint:recommended',
  rules: {
    //...
  },
  globals: {
    test: true,
    expect: true,
    describe: true,
  },
};
```

Testi ottaa ensimmäisellä rivillä käyttöön testattavan funktion sijoittaen sen muuttujaan _palindrom_:

```js
const palindrom = require('../utils/for_testing').palindrom;
```

Yksittäiset testitapaukset määritellään funktion _test_ avulla. Ensimmäisenä parametrina on merkkijonomuotoinen testin kuvaus. Toisena parametrina on _funktio_, joka määrittelee testitapauksen toiminnallisuuden. Esim. toisen testitapauksen toiminnallisuus näyttää seuraavalta:

```js
() => {
  const result = palindrom('react');

  expect(result).toBe('tcaer');
};
```

Ensin suoritetaan testattava koodi, eli generoidaan merkkijonon _react_ palindromi. Seuraavaksi varmistetaan tulos metodin [expect](https://facebook.github.io/jest/docs/en/expect.html#content) avulla. Expect käärii tuloksena olevan arvon olioon, joka tarjoaa joukon _matcher_-funktioita, joiden avulla tuloksen oikeellisuutta voidaan tarkastella. Koska kyse on kahden merkkijonon samuuden vertailusta, sopii tilanteeseen matcheri [toBe](https://facebook.github.io/jest/docs/en/expect.html#tobevalue).

Kuten odotettua, testit menevät läpi:

![](../assets/4/1.png)

Jest olettaa oletusarvoisesti, että testitiedoston nimessä on merkkijono _.test_. Käytetään kurssilla konventiota, millä testitiedostojen nimen loppu on _.test.js_

Jestin antamat virheilmoitukset ovat hyviä, rikotaan testi

```js
test('palindrom of react', () => {
  const result = palindrom('react');

  expect(result).toBe('tkaer');
});
```

seurauksena on seuraava virheilmotus

![](../assets/4/2.png)

Lisätään muutama testi metodille _average_, tiedostoon _tests/average.test.js_.

```js
const average = require('../utils/for_testing').average;

describe('average', () => {
  test('of one value is the value itself', () => {
    expect(average([1])).toBe(1);
  });

  test('of many is calculated right', () => {
    expect(average([1, 2, 3, 4, 5, 6])).toBe(3.5);
  });

  test('of empty array is zero', () => {
    expect(average([])).toBe(0);
  });
});
```

Testi paljastaa, että metodi toimii väärin tyhjällä taulukolla (sillä nollallajaon tulos on Javascriptissä _NaN_):

![](../assets/4/3.png)

Metodi on helppo korjata

```js
const average = array => {
  const reducer = (sum, item) => {
    return sum + item;
  };
  return array.length === 0 ? 0 : array.reduce(reducer, 0) / array.length;
};
```

Eli jos taulukon pituus on 0, palautetaan 0 ja muussa tapauksessa palautetaan metodin _reduce_ avulla laskettu keskiarvo.

Pari huomiota keskiarvon testeistä. Määrittelimme testien ympärille nimellä _average_ varustetun _describe_-lohkon.

```js
describe('average', () => {
  // testit
});
```

Describejen avulla yksittäisessä tiedostossa olevat testit voidaan jaotella loogisiin kokonaisuuksiin. Testituloste hyödyntää myös describe-lohkon nimeä:

![](../assets/4/4.png)

Kuten myöhemmin tulemme näkemään, _describe_-lohkot ovat tarpeellisia siinä vaiheessa, jos haluamme osalle yksittäisen testitiedoston testitapauksista jotain yhteisiä alustus- tai lopetustoimenpiteitä.

Toisena huomiona se, että kirjoitimme testit aavistuksen tiiviimmässä muodossa, ottamatta testattavan metodin tulosta erikseen apumuuttujaan:

```js
test('of empty array is zero', () => {
  expect(average([])).toBe(0);
});
```

## Tehtäviä

Tee nyt tehtävät [4.3-4.7](/tehtävät#yksikkötestaus)

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

</div>
