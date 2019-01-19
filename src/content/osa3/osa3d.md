---
mainImage: ../../images/part-3.svg
part: 3
letter: d
---

<div class="content">

### Validointi

https://mongoosejs.com/docs/validation.html

```js
const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 5
  },
  date: Date,
  important: Boolean,
})
```

```js
app.post('/api/notes', (request, response, next) => {
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
```

```js
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  }  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
```

### Promisejen ketjutus

Useat routejen tapahtumankäsittelijöistä muuttivat palautettavan datan oikeaan formaattiin kutsumalla metodia _formatNote_:

```js
const formatNote = note => {
  return {
    id: note._id,
    content: note.content,
    date: note.date,
    important: note.important,
  };
};
```

esim uuden muistiinpanon luomisessa metodia kutsutaan _then_:in parametrina palauttama olio parametrina:

```js
app.post('/api/notes', (request, response) => {
  // ...

  note.save().then(savedNote => {
    response.json(formatNote(savedNote));
  });
});
```

Voisimme tehdä saman myös hieman tyylikkäämmin [promiseja ketjuttamalla](https://javascript.info/promise-chaining):

```js
app.post('/api/notes', (request, response) => {
  // ...

  note
    .save()
    .then(savedNote => {
      return formatNote(savedNote);
    })
    .then(savedAndFormattedNote => {
      response.json(savedAndFormattedNote);
    });
});
```

Eli ensimmäisen _then_:in takaisinkutsussa otamme mongoosen palauttaman olion _savedNote_ ja formatoimme sen. Operaation tulos palautetaan returnilla. Kuten osassa 2 [todettiin](/osa2/#palvelimen-kanssa-tapahtuvan-kommunikoinnin-eristäminen-omaan-moduuliin), promisen then-metodi palauttaa myös promisen. Eli kun palautamme _formatNote(savedNote)_:n takaisinkutsufunktiosta, syntyy promise, jonka arvona on formatoitu muistiinpano. Pääsemme käsiksi arvoon rekisteröimällä _then_-kutsulla uuden tapahtumankäsittelijän.

Itseasiassa selviämme vieläkin tiiviimmällä koodilla:

```js
app.post('/api/notes', (request, response) => {
  // ...

  note
    .save()
    .then(formatNote)
    .then(savedAndFormattedNote => {
      response.json(savedAndFormattedNote);
    });
});
```

koska _formatNote_ on viite funktioon, on oleellisesti ottaen kyse samasta kuin kirjoittaisimme:

```js
app.post('/api/notes', (request, response) => {
  // ...

  note
    .save()
    .then(savedNote => {
      return {
        id: savedNote._id,
        content: savedNote.content,
        date: savedNote.date,
        important: savedNote.important,
      };
    })
    .then(savedAndFormattedNote => {
      response.json(savedAndFormattedNote);
    });
});
```

### Sovelluksen vieminen tuotantoon

Sovelluksen pitäisi toimia tuotannossa, eli herokussa sellaisenaan. Frontendin muutosten takia on tehtävä siitä uusi tuotantoversio ja kopioitava se backendiin.

Sovellusta voi käyttää sekä frontendin kautta <https://fullstack-notes.herokuapp.com>, ja myös API:n <https://fullstack-notes.herokuapp.com/api/notes> suora käyttö selaimella ja postmanilla onnistuu.

Sovelluksessamme on tällä hetkellä eräs ikävä piirre. Tietokannan osoite on kovakoodattu backendiin ja samaa tietokantaa käytetään sekä tuotannossa, että sovellusta kehitettäessä.

Tarvitsemme oman kannan sovelluskehitystä varten. Luodaan mlabiin toinen tietokanta ja sille käyttäjä.

Tietokannan osoitetta ei kannata kirjoittaa koodiin. Eräs hyvä tapa tietokannan osoitteen määrittelemiseen on [ympäristömuuttujien](https://en.wikipedia.org/wiki/Environment_variable) käyttö.

Talletetaan kannan osoite ympäristömuuttujaan _MONGODB_URI_.

Ympäristömuuttujiin pääsee Node-sovelluksesta käsiksi seuraavasti:

```js
const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

// ...

module.exports = Note;
```

Tee muutos koodiin ja deployaa uusi versio herokuun. Sovelluksen pitäisi toimia kun asetat ympäristömuuttujan arvo herokuun komennolla _heroku config:set_

```bash
heroku config:set MONGODB_URI=mongodb://fullstack:sekred@ds211088.mlab.com:11088/fullstack-notes
```

Sovelluksen pitäisi toimia muutosten jälkeen. Aina kaikki ei kuitenkaan mene suunnitelmien mukaan. Jos ongelmia ilmenee, _heroku logs_ auttaa. Oma sovellukseni ei toiminut muutoksen jälkeen. Loki kertoi seuraavaa

![](../images/3/21.png)

eli tietokannan osoite olikin jostain syystä määrittelemätön. Komento _heroku config_ paljasti että olin vahingossa määritellyt ympäristömuuttujan _MONGO_URL_ kun koodi oletti sen olevan nimeltään _MONGODB_URI_.

Muutoksen jälkeen sovellus ei toimi paikallisesti, koska ympäristömuuttujalla _MONGODB_URI_ ei ole mitään arvoa. Tapoja määritellä ympäristömuuttujalle arvo on monia, käytetään nyt [dotenv](https://www.npmjs.com/package/dotenv)-kirjastoa.

Asennetaan kirjasto komennolla

```bash
npm install dotenv --save
```

Sovelluksen juurihakemistoon tehdään sitten tiedosto nimeltään _.env_, minne tarvittavien ympäristömuuttujien arvot asetetaan. Määritellään tiedostoon sovelluskehitystä varten luodun tietokannan osoite:

```bash
MONGODB_URI=mongodb://fullstack:sekred@ds111078.mlab.com:11078/fullstact-notes-dev
```

Tiedosto .env **tulee heti gitignorata** sillä emme halua julkaista .env -tiedoston sisältöä verkkoon.

dotenvissä määritellyt ympäristömuuttujat otetaan koodissa käyttöön komennolla

```js
require('dotenv').config();
```

ja niihin viitataan Nodessa kuten "normaaleihin" ympäristömuuttujiin syntaksilla _process.env.MONGODB_URI_

Otetaan dotenv käyttöön seuraavasti:

```js
const mongoose = require('mongoose');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const url = process.env.MONGODB_URI;

// ...

module.exports = Note;
```

Nyt dotenvissä olevat ympäristömuuttujat otetaan käyttöön ainoastaan silloin kun sovellus ei ole _production_- eli tuotantomoodissa (kuten esim. Herokussa).

Uudelleenkäynnistyksen jälkeen sovellus toimii taas paikallisesti.

Node-sovellusten konfigurointiin on olemassa ympäristömuuttujien ja dotenvin lisäksi lukuisia vaihtoehtoja, mm. [node-conf](https://github.com/lorenwest/node-config). Ympäristömuuttujien käyttö riittää meille nyt, joten emme rupea overengineeraamaan. Palaamme aiheeseen kenties myöhemmin.

Sovelluksen tämän hetkinen koodi on kokonaisuudessaan [githubissa](https://github.com/FullStack-HY/part3-notes-backend/tree/part3-4), tagissa _part3-4_.

### Tehtäviä

Tee nyt tehtävät [3.19 - 3.21](/tehtävät#loppuhuipennus)


### Lint

Ennen osan lopetusta katsomme vielä nopeasti paitsioon jäänyttä tärkeää työkalua [lintiä](<https://en.wikipedia.org/wiki/Lint_(software)>). Wikipedian sanoin:

> Generically, lint or a linter is any tool that detects and flags errors in programming languages, including stylistic errors. The term lint-like behavior is sometimes applied to the process of flagging suspicious language usage. Lint-like tools generally perform static analysis of source code.

Staattisesti tyypitetyissä, käännettävissä kielissä esim. Javassa ohjelmointiympäristöt, kuten NetBeans osaavat huomautella monista koodiin liittyvistä asioista, sellaisistakin, jotka eivät ole välttämättä käännösvirheitä. Erilaisten [staattisen analyysin](https://en.wikipedia.org/wiki/Static_program_analysis) lisätyökalujen, kuten [checkstylen](http://checkstyle.sourceforge.net/) avulla voidaan vielä laajentaa Javassa huomautettavien asioiden määrää koskemaan koodin tyylillisiä seikkoja, esim. sisentämistä.

Javascript-maailmassa tämän hetken johtava työkalu staattiseen analyysiin, eli "linttaukseen" on [ESlint](https://eslint.org/).

Asennetaan ESlint backendiin kehitysaikaiseksi riippuvuudeksi komennolla

```bash
npm install eslint --save-dev
```

Tämän jälkeen voidaan muodostaa alustava ESlint-konfiguraatio komennolla

```bash
node_modules/.bin/eslint --init
```

Vastaillaan kysymyksiin:

![](../images/3/24.png)

Konfiguraatiot tallentuvat tiedostoon _.eslintrc.js_:

```js
module.exports = {
    "env": {
        "node": true
        "es6": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "never"
        ]
    }
};
```

Muutetaan heti konfiguraatioista sisennystä määrittelevä sääntö, siten että sisennystaso on 2 välilyöntiä

```
"indent": [
    "error",
    2
],
```

Esim tiedoston _index.js_ tarkastus tapahtuu komennolla

```bash
node_modules/.bin/eslint index.js
```

Kannattaa ehkä tehdä linttaustakin varten _npm-skripti_:

```bash
{
  // ...
  "scripts": {
    "start": "node index.js",
    "watch": "nodemon index.js",
    "lint": "eslint ."
  },
  // ...
}
```

Nyt komennot _npm run lint_ suorittaa tarkastukset koko projektille.

Myös hakemistossa _build_ oleva frontendin tuotantoversio tulee näin tarkastettua. Sitä emme kuitenkaan halua, eli tehdään projektin juureen tiedosto [.eslintignore](https://eslint.org/docs/user-guide/configuring#ignoring-files-and-directories) ja sille seuraava sisältö

```bash
build
```

Näin koko hakemiston _build_ sisältö jätetään huomioimatta linttauksessa.

Lintillä on jonkin verran huomautettavaa koodistamme:

![](../images/3/22.png)

Ei kuitenkaan korjata ongelmia vielä.

Parempi vaihtoehto kuin linttauksen suorittaminen komentoriviltä on konfiguroida editorille _lint-plugin_, joka suorittaa linttausta koko ajan. Näin pääset korjaamaan pienet virheet välittömästi. Tietoja esim. Visual Studion ESlint-pluginsta [täällä](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint).

VS Coden ESlint-plugin alleviivaa tyylisääntöjä rikkovat kohdat punaisella:

![](../images/3/23.png)

Näin ongelmat on helppo korjata koodiin heti.

ESlintille on määritelty suuri määrä [sääntöjä](https://eslint.org/docs/rules/), joita on helppo ottaa käyttöön muokkaamalla tiedostoa _.eslintrc.js_.

Otetaan käyttöön sääntö [eqeqeq](https://eslint.org/docs/rules/eqeqeq) joka varoittaa, jos koodissa yhtäsuuruutta verrataan muuten kuin käyttämällä kolmea = -merkkiä. Sääntö lisätään konfiguraatiotiedostoon kentän _rules_ alle.

```bash
"rules": {
  // ...
  "eqeqeq": "error"
},
```

Tehdään samalla muutama muukin muutos tarkastettaviin sääntöihin.

Estetään rivien lopussa olevat [turhat välilyönnit](https://eslint.org/docs/rules/no-trailing-spaces), vaaditaan että [aaltosulkeiden edessä/jälkeen on aina välilyönti](https://eslint.org/docs/rules/object-curly-spacing) ja vaaditaan myös konsistenttia välilyöntien käyttöä [nuolifunktioiden parametrien suhteen](https://eslint.org/docs/rules/arrow-spacing):

```bash
"rules": {
  // ...
  "eqeqeq": "error",
  "no-trailing-spaces": "error",
  "object-curly-spacing": [
      "error", "always"
  ],
  "arrow-spacing": [
      "error", { "before": true, "after": true }
  ]
},
```

Oletusarvoinen konfiguraatiomme ottaa käyttöön joukon valmiiksi määriteltyjä sääntöjä _eslint:recommended_

```bash
"extends": "eslint:recommended",
```

Mukana on myös _console.log_-komennoista varoittava sääntö-
Yksittäisen sääntö on helppo kytkeä [pois päältä](https://eslint.org/docs/user-guide/configuring#configuring-rules) määrittelemällä sen "arvoksi" konfiguraatiossa 0. Tehdään toistaiseksi näin säännölle _no-console_.

```bash
"rules": {
  // ...
  "eqeqeq": "error",
  "no-trailing-spaces": "error",
  "object-curly-spacing": [
      "error", "always"
  ],
  "arrow-spacing": [
      "error", { "before": true, "after": true }
  ],
  "no-console": 0
},
```

**HUOM** kun teet muutoksia tiedostoon _.eslintrc.js_, kannattaa muutosten jälkeen suorittaa linttaus komentoriviltä ja varmistaa että konfiguraatio ei ole viallinen:

![](../images/3/25.png)

Jos konfiguraatiossa on jotain vikaa, voi editorin lint-plugin näyttää mitä sattuu.

Monissa yrityksissä on tapana määritellä yrityksen laajuiset koodausstandardit ja näiden käyttöä valvova ESlint-konfiguraatio. Pyörää ei kannata välttämättä keksiä uudelleen ja voi olla hyvä idea ottaa omaan projektiin joku käyttöön jossain muualla hyväksi havaittu konfiguraatio. Viime aikoina monissa projekteissa on omaksuttu AirBnB:n [Javascript](https://github.com/airbnb/javascript)-tyyliohjeet ottamalla käyttöön firman määrittelemä [ESLint](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb)-konfiguraatio.

Sovelluksen tämän hetkinen koodi on kokonaisuudessaan [githubissa](https://github.com/FullStack-HY/part3-notes-backend/tree/part3-5), tagissa _part3-5_.

### Tehtäviä

Tee nyt viimeinen tehtävä [3.22](/tehtävät#eslint)

</div>
