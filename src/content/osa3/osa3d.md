---
mainImage: ../../images/part-3.svg
part: 3
letter: d
---

<div class="content">

Sovelluksen tietokantaan tallettamalle datan muodolle on usein tarve asettaa joitain ehtoja. Sovelluksemme ei esim. hyväksy muistiinpanoja, joiden sisältö eli <i>content</i> kenttä puuttuu. Muistiinpanon oikeellisuus tallennetaan sen luovassa metodissa:

```js
app.post('/api/notes', (request, response) => {
  const body = request.body
  // highlight-start
  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }
  // highlight-end

  // ...
})
```

Eli jos muistiinpanolla ei ole kenttää <i>content</i>, vastataan pyyntöön statuskoodilla <i>400 bad request</i>. 

Routejen tapahtumakäsittelijöissä tehtävää tarkastusta järkevämpi tapa tietokantaan talletettavan tiedon oikean muodon määrittelylle ja tarkastamiselle on Mongoosen [validointitoiminnallisuuden](https://mongoosejs.com/docs/validation.html) käyttö.

Kullekin talletettavan datan kentälle voidaan määritellä validointisääntöjä skeemassa:

```js
const noteSchema = new mongoose.Schema({
  // highlight-start
  content: {
    type: String,
    minlength: 5,
    required: true
  },
  date: { 
    type: Date,
    required: true
  }
    // highlight-end
  important: Boolean
})
```

Kentän <i>content</i> pituuden vaaditaan nyt olevan vähintään 5 merkkiä. Kentälle <i>data</i> taas on asetettu ehdoksi että sillä on oltava joku arvo, eli kenttä ei voi olla tyhjä. Sama ehto on asetettu myös kentälle <i>content</i>, sillä minimipituuden tarkistava ehto ei huomioi tilannetta, missä kentällä ei ole mitään arvoa. Kentälle <i>important</i> ei ole asetettu mitään ehtoa, joten se on määritelty edelleen yksinkertaisemmassa muodossa.

Esimerkissä käytetyt validaattorit <i>minlength</i> ja <i>required</i> ovat Mongooseen [sisäänrakennettuja](https://mongoosejs.com/docs/validation.html#built-in-validators) validointisääntöjä. Mongoosen [custom validator](https://mongoosejs.com/docs/validation.html#custom-validators) -ominaisuus mahdollistaa mielivaltaisten validaattorien toteuttamisen jos valmiiden joukosta ei löydy tarkoitukseen sopivaa.

Jos tietokantaan yritetään tallettaa validointisäännön rikkova olio, heittää tallennusoperaatio poikkeuksen. Muutetaan uuden muistiinpanon luomisesta huolehtivaa käsittelijää siten, että se välittää mahdollisen poikkeuksen virheenkäsittelijämiddlewaren huolehdittavaksi:  

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
    .catch(error => next(error)) // highlight-line
})
```

Laajennetaan virheenkäsittelijää huomioimaan validointivirheet:

```js
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') { // highlight-line
    return response.status(400).json({ error: error.message }) // highlight-line
  }

  next(error)
}
```

Validoinnin epäonnistuessa palautetaan validaattorin oletusarvoinen virheviesti:

![](../images/3/50.png)

### Promisejen ketjutus

Useat routejen tapahtumankäsittelijöistä muuttivat palautettavan datan oikeaan formaattiin kutsumalla palautetuille olioille niiden metodia _toJSON_. Esimimerkiksi uuden muistiinpanon luomisessa metodia kutsutaan _then_:in parametrina palauttamalle oliolle:

```js
app.post('/api/notes', (request, response, next) => {
  // ...

  note.save()
    .then(savedNote => {
      response.json(savedNote.toJSON())
    })
    .catch(error => next(error)) 
})
```

Voisimme tehdä saman myös hieman tyylikkäämmin [promiseja ketjuttamalla](https://javascript.info/promise-chaining):

```js
app.post('/api/notes', (request, response) => {
  // ...

  note
    .save()
    // highlight-start
    .then(savedNote => {
      return savedNote.toJSON()
    })
    .then(savedAndFormattedNote => {
      response.json(savedAndFormattedNote)
    }) 
    // highlight-end
    .catch(error => next(error)) 
})
```

Eli ensimmäisen _then_:in takaisinkutsussa otamme Mongoosen palauttaman olion _savedNote_ ja formatoimme sen. Operaation tulos palautetaan returnilla. Kuten osassa 2 [todettiin](/osa2/palvelimella_olevan_datan_muokkaaminen#palvelimen-kanssa-tapahtuvan-kommunikoinnin-eristaminen-omaan-moduuliin), promisen then-metodi palauttaa myös promisen. Eli kun palautamme _savedNote.toJSON()_:n takaisinkutsufunktiosta, syntyy promise, jonka arvona on formatoitu muistiinpano. Pääsemme käsiksi arvoon rekisteröimällä _then_-kutsulla uuden tapahtumankäsittelijän.

Selviämme vieläkin tiiviimmällä koodilla käyttämällä nuolifunktion lyhempää muotoa:

```js
app.post('/api/notes', (request, response) => {
  // ...

  note
    .save()
    .then(savedNote => savedNote.toJSON()) // highlight-line
    .then(savedAndFormattedNote => {
      response.json(savedAndFormattedNote)
    }) 
    .catch(error => next(error)) 
})
```

Esimerkkimme tapauksessa promisejen ketjutuksesta ei ole suurta hyötyä. Tilanne alkaa muuttua jos joudumme tekemään useita peräkkäisiä asynkronisia operaatiota. Emme kuitenkaan mene asiaan sen tarkemmin. Tutustumme seuraavassa osassa Javascriptin <i>async/await</i>-syntaksiin, jota käyttämällä peräkkäisten asynkronisten operaatioiden tekeminen helpottuu olellisesti.

### Tietokantaa käyttävän version vieminen tuotantoon

Sovelluksen pitäisi toimia tuotannossa, eli Herokussa lähes sellaisenaan. Frontendin muutosten takia on tehtävä siitä uusi tuotantoversio ja kopioitava se backendiin. 

Huomaa, että vaikka määrittelimme sovelluskehitystä varten ympäristömuuttujille arvot tiedostossa <i>.env</i>, tietokantaurlin kertovan ympäristömuuttujan arvo asetetaan Herokuun komentorivillä komennolla _heroku config:set_

```bash
heroku config:set MONGODB_URI=mongodb+srv://fullstack:secred@cluster0-ostce.mongodb.net/note-app?retryWrites=true
```

Sovelluksen pitäisi nyt toimia. Aina kaikki ei kuitenkaan mene suunnitelmien mukaan. Jos ongelmia ilmenee, <i>heroku logs</i> auttaa. Oma sovellukseni ei toiminut muutoksen jälkeen. Loki kertoi seuraavaa

![](../images/3/51a.png)

eli tietokannan osoite olikin jostain syystä määrittelemätön. Komento <i>heroku config</i> paljasti että olin vahingossa määritellyt ympäristömuuttujan <em>MONGO\_URL</em> kun koodi oletti sen olevan nimeltään <em>MONGODB\_URI</em>.

Sovelluksen tämän hetkinen koodi on kokonaisuudessaan [githubissa](https://github.com/fullstack-hy2019/part3-notes-backend/tree/part3-5), branchissä <i>part3-5</i>.

</div>

<div class="tasks">

### Tehtäviä

#### 3.19: puhelinluettelo ja tietokanta, step7

Toteuta sovelluksellesi validaatio, joka huolehtii, että backendiin ei voi lisätä nimeä joka on jo puhelinluettelossa. Frontendin nykyisestä versiosta ei duplikaatteja voi luoda, mutta suoraan Postmanilla tai VS Coden REST clientillä se onnistuu.

Mongoose ei tarjoa tilanteeseen sopivaa valmista validaattoria. Käytä npm:llä asennettavaa pakettia
[mongoose-unique-validator](https://github.com/blakehaswell/mongoose-unique-validator#readme).

Jos HTTP POST -pyyntö yrittää lisätä nimeä, joka on jo puhelinluettelossa, tulee vastata sopivalla statuskoodilla ja lisätä vastaukseen asianmukainen virheilmoitus.

#### 3.20*: puhelinluettelo ja tietokanta, step8

Laajenna validaatiota siten, että tietokantaan talletettavan nimen on oltava pituudeltaan vähintään 3 merkkiä ja puhelinnumeron vähitään 8 merkkiä. 

Laajenna sovelluksen frontendia siten, että se antaa jonkinlaisen virheilmoituksen validoinnin epäonnistuessa. Virheidenkäsittely hoidetaan lisäämällä <em>catch</em>-lohko uuden henkilön lisäämisen yhteyteen:

```js
personService
    .create({ ... })
    .then(createdPerson => {
      // ...
    })
    .catch(error => {
      // pääset käsiksi palvelimen palauttamaan virheilmoitusolioon näin
      console.log(error.response.data)
    })
```

Voit näyttää frontendissa käyttäjälle Mongoosen validoinnin oletusarvoisen virheilmoituksen vaikka ne eivät olekaan luettavuudeltaan parhaat mahdolliset:

![](../images/3/56.png)

#### 3.21 tietokantaa käyttävä versio internettiin

Generoi päivitetystä sovelluksesta "full stack"-versio, eli tee frontendista uusi production build ja kopioi se backendin repositorioon. Varmista että kaikki toimii paikallisesti käyttämällä koko sovellusta backendin osoitteesta <https://localhost:3001>.

Pushaa uusi versio Herokuun ja varmista, että kaikki toimii myös siellä.

</div>

<div class="content">

### Lint

Ennen osan lopetusta katsomme vielä nopeasti paitsioon jäänyttä tärkeää työkalua [lintiä](<https://en.wikipedia.org/wiki/Lint_(software)>). Wikipedian sanoin:

> <i>Generically, lint or a linter is any tool that detects and flags errors in programming languages, including stylistic errors. The term lint-like behavior is sometimes applied to the process of flagging suspicious language usage. Lint-like tools generally perform static analysis of source code.</i>

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

![](../images/3/52.png)

Konfiguraatiot tallentuvat tiedostoon _.eslintrc.js_:

```js
module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 2018
    },
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


```js
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

```json
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

Myös hakemistossa <em>build</em> oleva frontendin tuotantoversio tulee näin tarkastettua. Sitä emme kuitenkaan halua, eli tehdään projektin juureen tiedosto [.eslintignore](https://eslint.org/docs/user-guide/configuring#ignoring-files-and-directories) ja sille seuraava sisältö

```bash
build
```

Näin koko hakemiston <em>build</em> sisältö jätetään huomioimatta linttauksessa.

Lintillä on jonkin verran huomautettavaa koodistamme:

![](../images/3/53.png)

Ei kuitenkaan korjata ongelmia vielä.

Parempi vaihtoehto kuin linttauksen suorittaminen komentoriviltä on konfiguroida editorille _lint-plugin_, joka suorittaa linttausta koko ajan. Näin pääset korjaamaan pienet virheet välittömästi. Tietoja esim. Visual Studion ESlint-pluginsta [täällä](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint).

VS Coden ESlint-plugin alleviivaa tyylisääntöjä rikkovat kohdat punaisella:

![](../images/3/54a.png)

Näin ongelmat on helppo korjata koodiin heti.

ESlintille on määritelty suuri määrä [sääntöjä](https://eslint.org/docs/rules/), joita on helppo ottaa käyttöön muokkaamalla tiedostoa <i>.eslintrc.js</i>.

Otetaan käyttöön sääntö [eqeqeq](https://eslint.org/docs/rules/eqeqeq) joka varoittaa, jos koodissa yhtäsuuruutta verrataan muuten kuin käyttämällä kolmea = -merkkiä. Sääntö lisätään konfiguraatiotiedostoon kentän <i>rules</i> alle.

```json
{
  // ...
  "rules": {
    // ...
    "eqeqeq": "error"
  },
}
```

Tehdään samalla muutama muukin muutos tarkastettaviin sääntöihin.

Estetään rivien lopussa olevat [turhat välilyönnit](https://eslint.org/docs/rules/no-trailing-spaces), vaaditaan että [aaltosulkeiden edessä/jälkeen on aina välilyönti](https://eslint.org/docs/rules/object-curly-spacing) ja vaaditaan myös konsistenttia välilyöntien käyttöä [nuolifunktioiden parametrien suhteen](https://eslint.org/docs/rules/arrow-spacing):

```json
{
  // ...
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
}
```

Oletusarvoinen konfiguraatiomme ottaa käyttöön joukon valmiiksi määriteltyjä sääntöjä <i>eslint:recommended</i>

```bash
"extends": "eslint:recommended",
```

Mukana on myös _console.log_-komennoista varoittava sääntö.
Yksittäisen sääntö on helppo kytkeä [pois päältä](https://eslint.org/docs/user-guide/configuring#configuring-rules) määrittelemällä sen "arvoksi" konfiguraatiossa 0. Tehdään toistaiseksi näin säännölle <i>no-console</i>.

```json
{
  // ...
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
    "no-console": 0 // highlight-line
  },
}
```

**HUOM** kun teet muutoksia tiedostoon <i>.eslintrc.js</i>, kannattaa muutosten jälkeen suorittaa linttaus komentoriviltä ja varmistaa että konfiguraatio ei ole viallinen:

![](../images/3/55.png)

Jos konfiguraatiossa on jotain vikaa, voi editorin lint-plugin näyttää mitä sattuu.

Monissa yrityksissä on tapana määritellä yrityksen laajuiset koodausstandardit ja näiden käyttöä valvova ESlint-konfiguraatio. Pyörää ei kannata välttämättä keksiä uudelleen ja voi olla hyvä idea ottaa omaan projektiin käyttöön joku jossain muualla hyväksi havaittu konfiguraatio. Viime aikoina monissa projekteissa on omaksuttu AirBnB:n [Javascript](https://github.com/airbnb/javascript)-tyyliohjeet ottamalla käyttöön firman määrittelemä [ESLint](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb)-konfiguraatio.

Sovelluksen tämän hetkinen koodi on kokonaisuudessaan [githubissa](https://github.com/fullstack-hy2019/part3-notes-backend/tree/part3-6), branchissa <i>part3-6</i>.

</div>

<div class="tasks">

### Tehtäviä

#### 3.22: lint-konfiguraatio

Ota sovellukseesi käyttöön ESlint.

</div>
