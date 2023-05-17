---
mainImage: ../../../images/part-3.svg
part: 3
letter: c
lang: fi
---

<div class="content">

Ennen kuin siirrymme osan varsinaiseen aiheeseen eli tiedon tallettamiseen tietokantaan, tarkastellaan muutamaa tapaa Node-sovellusten debuggaamiseen.

### Node-sovellusten debuggaaminen

Nodella tehtyjen sovellusten debuggaaminen on jossain määrin hankalampaa kuin selaimessa toimivan JavaScriptin. Vanha hyvä keino on tietysti konsoliin tulostelu. Se kannattaa aina. On mielipiteitä, joiden mukaan konsoliin tulostelun sijaan olisi syytä suosia jotain kehittyneempää menetelmää, mutta se ei ole koko totuus. Jopa maailman aivan eliittiin kuuluvat open source ‑kehittäjät [käyttävät](https://tenderlovemaking.com/2016/02/05/i-am-a-puts-debuggerer.html) tätä [menetelmää](https://swizec.com/blog/javascript-debugging-slightly-beyond-consolelog/).

#### Visual Studio Code

Visual Studio Coden debuggeri voi olla hyödyksi joissain tapauksissa. Saat käynnistettyä sovelluksen debuggaustilassa seuraavasti (tässä ja muutamassa seuraavassa kuvassa muistiinpanoilla on kenttä _date_ joka on poistunut sovelluksen nykyisestä versiosta): 

![Avataan run-tabi ja sieltä valinta start debugging](../../images/3/35x.png)

Huomaa, että sovellus ei saa olla samalla käynnissä "normaalisti" konsolista, sillä tällöin sovelluksen käyttämä portti on varattu.

Seuraavassa screenshot, jossa koodi on pysäytetty kesken uuden muistiinpanon lisäyksen:

![Koodiin on lisätty breakpoint, johon suoritus pysähtyy. Vasemman puolen tabissa näkyvät muuttujien arvot, alhaalla Debugging console, jossa on mahdollista evaluoida koodia](../../images/3/36x.png)

Koodi on pysähtynyt rivillä 63 olevan <i>breakpointin</i> kohdalle ja konsoliin on evaluoitu muuttujan <i>note</i> arvo. Vasemmalla olevassa ikkunassa on nähtävillä myös kaikki ohjelman muuttujien arvot.

Ylhäällä olevista nuolista yms. voidaan kontrolloida debuggauksen etenemistä.
  
Itse en jostain syystä juurikaan käytä Visual Studio Coden debuggeria.

#### Chromen DevTools

Debuggaus onnistuu myös Chromen developer-konsolilla käynnistämällä sovellus komennolla:

```bash
node --inspect index.js
```

Debuggeriin pääsee käsiksi klikkaamalla Chromen developer-konsoliin ilmestyneestä vihreästä ikonista:

![Developer-konsolitabille on ilmestynyt uusi valinta, joka on Elements-valinnan vasemmalla puolella oleva tekstitön laatikkosymboli](../../images/3/37.png)

Debuggausnäkymä toimii kuten React-koodia debugattaessa. <i>Sources</i>-välilehdelle voidaan esim. asettaa breakpointeja eli kohtia joihin suoritus pysähtyy:

![Developer-konsolista valittu source-tabi, ja näkyville tulleeseen koodiin on asetettu breakpoint. Suorituksen pysähtyessä aukeaa Watch-näkymä, joka kertoo muuttujien arvot](../../images/3/38eb.png)

Ohjelman muuttujien arvoja voi evaluoida oikealla olevaan <i>watch</i>-ikkunaan.

Kaikki sovelluksen console.log-tulostukset tulevat debuggerin <i>Console</i>-välilehdelle. Voit tutkia siellä myös muuttujien arvoja ja suorittaa mielivaltaista JavaScript-koodia:

![Console-tabille on mahdollista evaluoida mielivaltaista js-koodia, pysäytetyn koodin muuttujat ovat käytettävissä](../../images/3/39ea.png)

#### Epäile kaikkea

Full Stack ‑sovellusten debuggaaminen vaikuttaa alussa erittäin hankalalta. Kun kohta kuvaan tulee myös tietokanta, ja frontend on yhdistetty backendiin, on potentiaalisia virhelähteitä todella paljon.

Kun sovellus "ei toimi", onkin selvitettävä missä vika on. On erittäin yleistä, että vika on sellaisessa paikassa, jota ei osaa ollenkaan epäillä, ja menee minuutti-, tunti- tai jopa päiväkausia ennen kuin oikea ongelmien lähde löytyy.

Avainasemassa onkin systemaattisuus. Koska virhe voi olla melkein missä vain, <i>kaikkea pitää epäillä</i>, ja tulee pyrkiä poissulkemaan ne osat, joissa virhe ei ainakaan ole. Konsoliin kirjoitus, Postman, debuggeri ja kokemus auttavat.

Virheiden ilmaantuessa <i>ylivoimaisesti huonoin strategia</i> on jatkaa koodin kirjoittamista. Se on tae siitä, että koodissa on pian kymmenen ongelmaa lisää ja niiden syyn selvittäminen on entistäkin vaikeampaa. Toyota Production Systemin periaate [Stop and fix](http://gettingtolean.com/toyota-principle-5-build-culture-stopping-fix/) toimii tässäkin yhteydessä paremmin kuin hyvin.

### MongoDB

Jotta saisimme talletettua muistiinpanot pysyvästi, tarvitsemme tietokannan. Useimmilla Tietojenkäsittelytieteen osaston kursseilla on käytetty relaatiotietokantoja. Melkein kaikissa tämän kurssin osissa käytämme [MongoDB](https://www.mongodb.com/):tä, joka on ns. [dokumenttitietokanta](https://en.wikipedia.org/wiki/Document-oriented_database). 

Tärkein syy Mongon käytölle kurssilla on se, että Mongo on tietokantanoviiseille helpompikäyttöinen kuin relaatiotietokannat. Kurssin [osassa 13](https://fullstackopen.com/osa13) tutustutaan relaatiotietokantoja käyttävien Node-sovellusten tekemiseen.

Mongon valinta tämän kurssin alkuun on siis tehty enimmäkseen pedagogisista perusteista. Itse suosittelen useimpiin sovelluksiin lähtökohtaisesti relaatiotietokantaa. Eli suosittelen lämpimästi tekemään myös tämän kurssin [Osan 13](https://fullstackopen.com/osa13). 

Dokumenttitietokannat poikkeavat jossain määrin relaatiotietokannoista niin datan organisointitapansa kuin kyselykielensäkin suhteen. Dokumenttitietokantojen ajatellaan kuuluvan sateenvarjotermin [NoSQL](https://en.wikipedia.org/wiki/NoSQL) alle. Lyhyt johdanto dokumenttitietokantoihin on [täällä](https://github.com/fullstack-hy2020/misc/blob/master/dokumenttitietokannat.MD).

Lue nyt linkitetty [johdanto](https://github.com/fullstack-hy2020/misc/blob/master/dokumenttitietokannat.MD). Jatkossa oletetaan, että hallitset käsitteet <i>dokumentti</i> ja <i>kokoelma</i> (collection).

MongoDB:n voi asentaa paikallisesti omalle koneelle. Internetistä löytyy kuitenkin myös palveluna toimivia Mongoja, joista tämän hetken paras valinta on [MongoDB Atlas](https://www.mongodb.com/atlas/database).

Kun käyttäjätili on luotu ja kirjauduttu, Aloitetaan valitsemalla kokeiluihin sopiva ilmainen vaihtoehto

![Valitaan 'shared', joka on ilmainen](../../images/3/mongo1.png)

Valitaan sopiva pilvipalvelu ja konesali, ja luodaan klusteri:

![Valitaan esim AWS Stockholm ja klikataan Create cluster](../../images/3/mongo2.png)

Odotetaan että klusteri on valmiina, mihin menee noin useita minuutteja.

**HUOM:** Älä jatka eteenpäin ennen kun klusteri on valmis!

Luodaan <i>security</i>-välilehdeltä tietokantakäyttäjätunnus joka on siis eri tunnus kuin se, jonka avulla kirjaudutaan MongoDB Atlasiin:

![Valitaan Security-välilehdeltä 'Username and password' ja luodaan käyttäjätunnus](../../images/3/mongo3.png)

Seuraavaksi tulee määritellä ne IP-osoitteet, joista tietokantaan pääsee käsiksi ja sallitaan yksinkertaisuuden vuoksi yhteydet kaikkialta:

![Valitaan Network access ‑välilehdeltä 'Allow access from anywhere'](../../images/3/mongo4.png)

Lopulta ollaan valmiina ottamaan tietokantayhteys. Valitaan <i>connect</i> ja sen jälkeisestä näkymästä <i>connect your application</i>:

![Valitaan Databases-välilehdeltä 'Connect'](../../images/3/mongo5.png)

Näkymä kertoo <i>MongoDB URI:n</i> eli osoitteen, jonka avulla sovelluksemme käyttämä MongoDB-kirjasto saa yhteyden kantaan:

![näin avautuvasta näkymästä pitäisi löytyä connect-url](../../images/3/mongo6new.png)

Osoite näyttää seuraavalta:

```bash
mongodb+srv://fullstack:<password>@cluster0.o1opl.mongodb.net/?retryWrites=true&w=majority
```

Olemme nyt valmiina kannan käyttöön.

Voisimme käyttää kantaa JavaScript-koodista suoraan Mongon virallisen [MongoDB Node.js driver](https://mongodb.github.io/node-mongodb-native/) ‑kirjaston avulla, mutta se on ikävän työlästä. Käytämmekin hieman korkeammalla tasolla toimivaa [Mongoose](http://mongoosejs.com/index.html)-kirjastoa.

Mongoosesta voisi käyttää luonnehdintaa <i>object document mapper</i> (ODM), ja sen avulla JavaScript-olioiden tallettaminen MongoDB:n dokumenteiksi on suoraviivaista.

Asennetaan Mongoose:

```bash
npm install mongoose
```

Ei lisätä MongoDB:tä käsittelevää koodia heti backendin koodin sekaan, vaan tehdään erillinen kokeilusovellus tiedostoon <i>mongo.js</i>:

```js
const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.o1opl.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'HTML is Easy',
  important: true,
})

note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})
```

Koodi siis olettaa, että sille annetaan parametrina MongoDB Atlasissa luodulle käyttäjälle määritelty salasana. Komentoriviparametriin se pääsee käsiksi seuraavasti:

```js
const password = process.argv[2]
```

Kun koodi suoritetaan komennolla <i>node mongo.js salasana</i> lisää Mongoose tietokantaan uuden dokumentin.

Voimme tarkastella tietokannan tilaa MongoDB Atlasin hallintanäkymän <i>Browse collections</i>-osasta:

![Valitaan Databases-välilehdeltä 'Browse collections'](../../images/3/mongo7.png)

Kuten näkymä kertoo, on muistiinpanoa vastaava <i>dokumentti</i> lisätty tietokannan <i>test</i> kokoelmaan (collection) nimeltään <i>notes</i>:

![Näkymä kertoo luodun tietokannan ja siihen sisältyvän kokoelman](../../images/3/mongo8new.png)

Tuhotaan oletusarvoisen nimen saanut kanta <i>test</i>. Päätetään käyttää tietokannasta nimeä <i>noteApp</i>, joten muutetaan tietokanta-URI muotoon

```js
const url =
  `mongodb+srv://fullstack:${password}@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority`
```

Suoritetaan ohjelma uudelleen:

![Näkymä 'Browse collections' näyttää nyt halutun nimen noteApp sisältävän tietokannan](../../images/3/mongo9.png)

Data on nyt oikeassa kannassa. Hallintanäkymä sisältää myös toiminnon <i>create database</i>, joka mahdollistaa uusien tietokantojen luomisen hallintanäkymän kautta. Kannan luominen etukäteen hallintanäkymässä ei kuitenkaan ole tarpeen, sillä MongoDB Atlas osaa luoda kannan automaattisesti jos sovellus yrittää yhdistää kantaan, jota ei ole vielä olemassa.

### Skeema

Yhteyden avaamisen jälkeen määritellään muistiinpanon [skeema](http://mongoosejs.com/docs/guide.html) ja sitä vastaava [model](http://mongoosejs.com/docs/models.html):

```js
const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)
```

Ensin muuttujaan _noteSchema_ määritellään muistiinpanon [skeema](http://mongoosejs.com/docs/guide.html), joka kertoo Mongooselle, miten muistiinpano-oliot tulee tallettaa tietokantaan.

Modelin _Note_ määrittelyssä ensimmäisenä parametrina oleva merkkijono <i>Note</i> määrittelee, että Mongoose tallettaa muistiinpanoa vastaavat oliot kokoelmaan nimeltään <i>notes</i>, sillä [Mongoosen konventiona](http://mongoosejs.com/docs/models.html) on määritellä kokoelmien nimet monikossa (esim. <i>notes</i>), kun niihin viitataan skeeman määrittelyssä yksikkömuodossa (esim. <i>Note</i>).

Dokumenttikannat, kuten MongoDB ovat <i>skeemattomia</i>, eli tietokanta itsessään ei välitä mitään sinne talletettavan tiedon muodosta. Jopa samaan kokoelmaan on mahdollista tallettaa olioita, joilla on täysin eri kentät.

Mongoosea käytettäessä periaatteena on kuitenkin se, että tietokantaan talletettavalle tiedolle määritellään <i>sovelluksen koodin tasolla skeema</i>, joka määrittelee minkä muotoisia olioita kannan eri kokoelmiin talletetaan.

### Olioiden luominen ja tallettaminen

Seuraavaksi tiedoston <i>mongo.js</i> sovellus luo muistiinpanoa vastaavan [model](http://mongoosejs.com/docs/models.html):in avulla muistiinpano-olion:

```js
const note = new Note({
  content: 'HTML is Easy',
  important: false,
})
```

Modelit ovat ns. <i>konstruktorifunktioita</i>, jotka luovat parametrien perusteella JavaScript-olioita. Koska oliot on luotu modelien konstruktorifunktiolla, niillä on kaikki modelien ominaisuudet eli joukko metodeja, joiden avulla olioita voidaan mm. tallettaa tietokantaan.

Tallettaminen tapahtuu metodilla _save_. Metodi palauttaa <i>promisen</i>, jolle voidaan rekisteröidä _then_-metodin avulla tapahtumankäsittelijä:

```js
note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})
```

Kun olio on tallennettu kantaan, kutsutaan _then_:in parametrina olevaa tapahtumankäsittelijää, joka sulkee tietokantayhteyden komennolla <code>mongoose.connection.close()</code>. Ilman yhteyden sulkemista ohjelman suoritus ei pääty.

Tallennusoperaation tulos on takaisinkutsun parametrissa _result_. Yhtä olioa tallentaessamme tulos ei ole kovin mielenkiintoinen. Olion sisällön voi esim. tulostaa konsoliin, jos haluaa tutkia sitä tarkemmin sovelluslogiikassa tai esim. debugatessa.

Talletetaan kantaan myös pari muuta muistiinpanoa muokkaamalla dataa koodista ja suorittamalla ohjelma uudelleen.

**HUOM:** Valitettavasti Mongoosen dokumentaatiossa käytetään joka paikassa promisejen _then_-metodien sijaan takaisinkutsufunktioita, joten sieltä ei kannata suoraan copy-pasteta koodia, sillä promisejen ja vanhanaikaisten callbackien sotkeminen samaan koodiin ei ole kovin järkevää.

### Olioiden hakeminen tietokannasta

Kommentoidaan koodista uusia muistiinpanoja generoiva osa ja korvataan se seuraavalla:

```js
Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})
```

Kun koodi suoritetaan, kantaan talletetut muistiinpanot tulostuvat:

![Mongoon tallennetut muistiinpanot tulostuvat konsoliin, muistiinpanoilla on myös kenttä _id jonka Mongo on luonut](../../images/3/70new.png)

Oliot haetaan kannasta _Note_-modelin metodilla [find](https://mongoosejs.com/docs/api.html#model_Model.find). Metodin parametrina on hakuehto. Koska hakuehtona on tyhjä olio <code>{}</code>, saimme kannasta kaikki _notes_-kokoelmaan talletetut oliot.

Hakuehdot noudattavat MongoDB:n [syntaksia](https://docs.mongodb.com/manual/reference/operator/).

Voisimme hakea esim. ainoastaan tärkeät muistiinpanot seuraavasti:

```js
Note.find({ important: true }).then(result => {
  // ...
})
```

</div>

<div class="tasks">

### Tehtävä 3.12

#### 3.12: tietokanta komentoriviltä

Luo puhelinluettelosovellukselle pilvessä oleva MongoDB-tietokanta Mongo DB Atlaksen avulla.

Tee projektihakemistoon tiedosto <i>mongo.js</i>, jonka avulla voit lisätä tietokantaan puhelinnumeroja sekä listata kaikki kannassa olevat numerot.

**HUOM:** Jos/kun laitat tiedoston GitHubiin, älä laita tietokannan salasanaa mukaan!

Ohjelma toimii siten, että jos sille annetaan käynnistettäessä kolme komentoriviparametria (joista ensimmäinen on salasana), esim.:

```bash
node mongo.js yourpassword Anna 040-1234556
```

niin ohjelma tulostaa

```bash
added Anna number 040-1234556 to phonebook
```

ja lisää uuden yhteystiedon tietokantaan. Huomaa, että jos nimi sisältää välilyöntejä, on se annettava hipsuissa:

```bash
node mongo.js yourpassword "Arto Vihavainen" 040-1234556
```

Jos komentoriviparametreina ei ole muuta kuin salasana eli ohjelma suoritetaan komennolla

```bash
node mongo.js yourpassword
```

tulostaa ohjelma tietokannassa olevat numerotiedot:

<pre>
phonebook:
Anna 040-1234556
Arto Vihavainen 045-1232456
Ada Lovelace 040-1231236
</pre>

Saat selville ohjelman komentoriviparametrit muuttujasta [process.argv](https://nodejs.org/docs/latest-v8.x/api/process.html#process_process_argv).

**HUOM: Älä sulje tietokantayhteyttä väärässä kohdassa**. Esim. seuraava koodi ei toimi:

```js
Person
  .find({})
  .then(persons => {
    // ...
  })

mongoose.connection.close()
```

Koodin suoritus nimittäin etenee siten, että heti operaation <i>Person.find</i> käynnistymisen jälkeen suoritetaan komento <i>mongoose.connection.close()</i> ja tietokantayhteys katkeaa välittömästi. Näin ei koskaan päästä siihen pisteeseen, että <i>Person.find</i>-operaation valmistumisen käsittelevää <i>takaisinkutsufunktiota</i> kutsuttaisiin.

Oikea paikka tietokantayhteyden sulkemiselle on takaisinkutsufunktion loppu:

```js
Person
  .find({})
  .then(persons => {
    // ...
    mongoose.connection.close()
  })
```

**HUOM:** Jos määrittelet modelin nimeksi <i>Person</i>, muuttaa Mongoose sen monikkomuotoon <i>people</i>, jota se käyttää vastaavan kokoelman nimenä.

</div>

<div class="content">

### Tietokantaa käyttävä backend

Nyt meillä on periaatteessa hallussamme riittävä tietämys ottaa MongoDB käyttöön sovelluksessamme.

Aloitetaan nopean kaavan mukaan, copy-pastetaan tiedostoon <i>index.js</i> Mongoosen määrittelyt eli

```js
const mongoose = require('mongoose')

// ÄLÄ KOSKAAN TALLETA SALASANOJA GitHubiin!
const url =
  `mongodb+srv://fullstack:${fullstack@cluster0.o1opl.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)
```

ja muutetaan kaikkien muistiinpanojen hakemisesta vastaava käsittelijä seuraavaan muotoon:

```js
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})
```

Voimme todeta selaimella, että backend toimii kaikkien dokumenttien näyttämisen osalta:

![Mongoon tallennetut muistiinpanot renderöityvät selaimeen JSON-muodossa](../../images/3/44ea.png)

Toiminnallisuus on muuten kunnossa, mutta frontend olettaa, että olioiden yksikäsitteinen tunniste on kentässä <i>id</i>. Emme myöskään halua näyttää frontendille MongoDB:n versiointiin käyttämää kenttää <i>\_\_v</i>.

Eräs tapa muotoilla Mongoosen palauttamat oliot haluttuun muotoon on [muokata](https://stackoverflow.com/questions/7034848/mongodb-output-id-instead-of-id) kannasta haettavilla olioilla olevan _toJSON_-metodin palauttamaa muotoa. Metodin muokkaus onnistuu seuraavasti:

```js
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
```

Vaikka Mongoose-olioiden kenttä <i>\_id</i> näyttääkin merkkijonolta, se on todellisuudessa olio. Määrittelemämme metodi _toJSON_ muuttaa sen merkkijonoksi kaiken varalta. Jos emme tekisi muutosta, siitä aiheutuisi ylimääräistä harmia testien yhteydessä.

Muistiinpanojen hakemisesta vastaavaan käsittelijään ei tarvitse tehdä muutoksia eli seuraava koodi

```js
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})
```

kutsuu jokaiselle tietokannasta luettavalle muistiinpanolle automaattisesti metodia _toJSON_ muodostaessaan vastausta.

### Tietokantamäärittelyjen eriyttäminen moduuliksi

Ennen kuin täydennämme backendin muutkin osat käyttämään tietokantaa, eriytetään Mongoose-spesifinen koodi omaan moduuliinsa.

Tehdään moduulia varten hakemisto <i>models</i> ja sinne tiedosto <i>note.js</i>:

```js
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI // highlight-line

console.log('connecting to', url) // highlight-line
mongoose.connect(url)
  // highlight-start
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })
// highlight-end

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema) // highlight-line
```

Noden [moduulien](https://nodejs.org/docs/latest-v8.x/api/modules.html) määrittely poikkeaa hiukan osassa 2 määrittelemistämme frontendin käyttämistä [ES6-moduuleista](/osa2/kokoelmien_renderointi_ja_moduulit#refaktorointia-moduulit).

Moduulin ulos näkyvä osa määritellään asettamalla arvo muuttujalle _module.exports_. Asetamme arvoksi modelin <i>Note</i>. Muut moduulin sisällä määritellyt asiat, esim. muuttujat _mongoose_ ja _url_ eivät näy moduulin käyttäjälle.

Moduulin käyttöönotto tapahtuu lisäämällä tiedostoon <i>index.js</i> seuraava rivi:

```js
const Note = require('./models/note')
```

Näin muuttuja _Note_ saa arvokseen saman olion, jonka moduuli määrittelee.

Yhteyden muodostustavassa on pieni muutos aiempaan:

```js
const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })
```

Tietokannan osoitetta ei kannata kirjoittaa koodiin, joten osoite annetaan sovellukselle ympäristömuuttujan <em>MONGODB_URI</em> välityksellä.

Yhteyden muodostavalle metodille on nyt rekisteröity onnistuneen ja epäonnistuneen yhteydenmuodostuksen käsittelevät funktiot, jotka tulostavat konsoliin tiedon siitä, onnistuiko yhteyden muodostaminen:

![Konsoliin tulostuu virheilmoitus 'error connecting to Mongo, bad auth'](../../images/3/45e.png)

On useita tapoja määritellä ympäristömuuttujan arvo. Voimme esim. antaa sen ohjelman käynnistyksen yhteydessä seuraavasti:

```bash
MONGODB_URI=osoite_tahan npm run dev
```

Eräs kehittyneempi tapa on käyttää [dotenv](https://github.com/motdotla/dotenv#readme)-kirjastoa. Asennetaan kirjasto komennolla

```bash
npm install dotenv
```

Sovelluksen juurihakemistoon tehdään sitten tiedosto nimeltään <i>.env</i>, jonne tarvittavien ympäristömuuttujien arvot määritellään. Tiedosto näyttää seuraavalta:

```bash
MONGODB_URI=mongodb+srv://fullstack:<password>@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority
PORT=3001
```

Huomaa, että sinun tulee sisällyttää salasanasi osaksi url:ia, &lt;password&gt; kohtaan.

Määrittelimme samalla aiemmin kovakoodaamamme sovelluksen käyttämän portin eli ympäristömuuttujan <em>PORT</em>.

**Tiedosto <i>.env</i> tulee heti gitignorata, sillä emme halua julkaista tiedoston sisältöä verkkoon!**

![Kuva havainnollistaa sitä että .env on lisätty tiedostoon .gitignore](../../images/3/45ae.png)

dotenvissä määritellyt ympäristömuuttujat otetaan koodissa käyttöön komennolla <em>require('dotenv').config()</em> ja niihin viitataan Nodessa kuten "normaaleihin" ympäristömuuttujiin syntaksilla <em>process.env.MONGODB_URI</em>.

Muutetaan nyt tiedostoa <i>index.js</i> seuraavasti:

```js
require('dotenv').config() // highlight-line
const express = require('express')
const app = express()
const Note = require('./models/note') // highlight-line

// ..

const PORT = process.env.PORT // highlight-line
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

On tärkeää, että <i>dotenv</i> otetaan käyttöön ennen modelin <i>note</i> importtaamista. Tällöin varmistutaan siitä, että tiedostossa <i>.env</i> olevat ympäristömuuttujat ovat alustettuja kun moduulin koodia importoidaan.

### Tärkeä huomio Fly.io:n käyttäjille 

Koska Fly.io ei hyödynnä gitiä, menee myös .env-tiedosto Fly.io:n palvelimelle, ja ympäristömuuttujien arvo välittyy myös sinne.

[Tietoturvallisempi vaihtoehto](https://community.fly.io/t/clarification-on-environment-variables/6309) on kuitenkin estää tiedoston .env siirtyminen Fly.io:n tekemällä hakemiston juureen tiedosto _.dockerignore_, jolla on sisältö

```bash
.env
```

ja asettaa ympäristömuuttujan arvo komennolla:

```
fly secrets set MONGODB_URI='mongodb+srv://fullstack:<password>@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority'
```

Koska .env-tiedosto määrittelee myös ympäristömuuttujan PORT arvon, on .env:in ignorointi oikeastaan välttämätöntä jotta sovellus ei yritä käynnistää itseään väärään portiin.

Renderiä käytettäessä tietokannan osoitteen kertova ympäristömuuttuja määritellään dashboardista käsin:

![](../../images/3/render-env.png)

### Tietokannan käyttö reittien käsittelijöissä

Muutetaan nyt kaikki operaatiot tietokantaa käyttävään muotoon.

Uuden muistiinpanon luominen tapahtuu seuraavasti:

```js
app.post('/api/notes', (request, response) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })
})
```

Muistiinpano-oliot siis luodaan _Note_-konstruktorifunktiolla. Pyyntöön vastataan _save_-operaation takaisinkutsufunktion sisällä. Näin varmistutaan, että operaation vastaus tapahtuu vain, jos operaatio on onnistunut. Palaamme virheiden käsittelyyn myöhemmin.

Takaisinkutsufunktion parametrina oleva _savedNote_ on talletettu muistiinpano. HTTP-pyyntöön palautetaan kuitenkin automaattisesti siitä metodilla _toJSON_ formatoitu muoto:

```js
response.json(savedNote)
```

Yksittäisen muistiinpanon tarkastelu muuttuu muotoon

```js
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(note => {
    response.json(note)
  })
})
```

### Frontendin ja backendin yhteistoiminnallisuuden varmistaminen

Kun backendia laajennetaan, kannattaa sitä testailla aluksi **ehdottomasti selaimella, Postmanilla tai VS Coden REST Clientillä**. Seuraavassa kokeillaan uuden muistiinpanon luomista tietokannan käyttöönoton jälkeen:

![Luotaessa VS coden rest clientillä muistiinpano, avautuva näkymä havainnollistaa HTTP-kutsuun saatua vastausta](../../images/3/46new.png)

Vasta kun kaikki on todettu toimivaksi, kannattaa siirtyä testailemaan, että muutosten jälkeinen backend toimii yhdessä myös frontendin kanssa. Kaikkien kokeilujen tekeminen ainoastaan frontendin kautta on todennäköisesti varsin tehotonta.

Todennäköisesti voi olla kannattavaa edetä frontin ja backin integroinnissa toiminnallisuus kerrallaan, eli ensin voidaan toteuttaa esim. kaikkien muistiinpanojen näyttäminen backendiin ja testata, että toiminnallisuus toimii selaimella. Tämän jälkeen varmistetaan, että frontend toimii yhteen muutetun backendin kanssa. Kun kaiken on todettu olevan kunnossa, siirrytään seuraavan ominaisuuden toteuttamiseen.

Kun kuvioissa on mukana tietokanta, on tietokannan tilan tarkastelu MongoDB Atlasin hallintanäkymästä varsin hyödyllistä. Usein myös suoraan tietokantaa käyttävät Node-apuohjelmat, kuten tiedostoon <i>mongo.js</i> kirjoittamamme koodi auttavat sovelluskehityksen edetessä.

Sovelluksen tämän hetkinen koodi on kokonaisuudessaan [GitHubissa](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-4), branchissa <i>part3-4</i>.

### Todellisen full stack ‑sovelluskehittäjän vala

Sovelluksemme koostuu nyt frontendin ja backendin lisäksi myös tietokannasta. Virhelähteiden määrä siis kasvaa ja päivitämme full stack ‑kehittäjän valaa seuraavasti:

Full stack ‑ohjelmointi on <i>todella</i> hankalaa, ja sen takia lupaan hyödyntää kaikkia ohjelmointia helpottavia keinoja:

- pidän selaimen konsolin koko ajan auki
- tarkkailen säännöllisesti selaimen network-välilehdeltä, että frontendin ja backendin välinen kommunikaatio tapahtuu oletusteni mukaan
- tarkkailen säännöllisesti palvelimella olevan datan tilaa, ja varmistan että frontendin lähettämä data siirtyy sinne kuten oletin
- <i>pidän silmällä tietokannan tilaa: varmistan että backend tallentaa datan sinne oikeaan muotoon</i>
- etenen pienin askelin
- käytän koodissa runsaasti _console.log_-komentoja varmistamaan sen, että varmasti ymmärrän jokaisen kirjoittamani koodirivin, sekä etsiessäni koodista mahdollisia bugin aiheuttajia
- jos koodini ei toimi, en kirjoita enää yhtään lisää koodia, vaan alan poistamaan toiminnan rikkoneita rivejä tai palaan suosiolla tilanteeseen, missä koodi vielä toimi
- kun kysyn apua kurssin Discord- tai Telegram-kanavalla, tai muualla internetissä, muotoilen kysymyksen järkevästi, esim. [täällä](/en/part0/general_info#how-to-ask-help-in-discord-telegam) esiteltyyn tapaan

</div>

<div class="tasks">

### Tehtävät 3.13.-3.14.

Seuraavat tehtävät saattavat olla melko suoraviivaisia, mutta jos frontend-koodissasi sattuu olemaan bugeja tai epäyhteensopivuutta backendin kanssa, voi seurauksena olla myös mielenkiintoisia bugeja.

#### 3.13: puhelinluettelo ja tietokanta, step1

Muuta backendin kaikkien puhelintietojen näyttämistä siten, että backend <i>hakee näytettävät puhelintiedot tietokannasta</i>.

Varmista, että frontend toimii muutosten jälkeen.

Tee tässä ja seuraavissa tehtävissä Mongoose-spesifinen koodi omaan moduuliinsa samaan tapaan kuin kohdassa [Tietokantamäärittelyjen eriyttäminen moduuliksi](/osa3/tietojen_tallettaminen_mongo_db_tietokantaan#tietokantamaarittelyjen-eriyttaminen-moduuliksi).

#### 3.14: puhelinluettelo ja tietokanta, step2

Muuta backendiä siten, että uudet numerot <i>tallennetaan tietokantaan</i>. Varmista, että frontend toimii muutosten jälkeen.

<i>**Tässä vaiheessa voit olla välittämättä siitä, onko tietokannassa jo henkilöä, jolla on sama nimi kuin lisättävällä.**</i>

</div>

<div class="content">

### Virheiden käsittely

Jos yritämme hakea selaimella sellaista yksittäistä muistiinpanoa, jota ei ole olemassa (eli esim. urliin <http://localhost:3001/api/notes/5c41c90e84d891c15dfa3431>, jossa <i>5c41c90e84d891c15dfa3431</i> ei ole minkään tietokannassa olevan muistiinpanon tunniste, on palvelimelta saatu vastaus <em>null</em>.

Muutetaan koodia niin, että tapauksessa, jossa muistiinpanoa ei ole olemassa, lähetään vastauksena HTTP-statuskoodi <i>404 Not Found</i>. Toteutetaan lisäksi yksinkertainen <em>catch</em>-lohko, jossa käsitellään tapaukset, joissa <em>findById</em>-metodin palauttama promise päätyy <i>rejected</i>-tilaan:

```js
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id)
    .then(note => {
      // highlight-start
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
      // highlight-end
    })
    // highlight-start
    .catch(error => {
      console.log(error)
      response.status(500).end()
    })
    // highlight-end
})
```

Jos kannasta ei löydy haettua olioa, muuttujan _note_ arvo on _null_ ja koodi ajautuu _else_-haaraan. Siellä vastataan kyselyyn statuskoodilla <i>404 Not Found</i>. Jos <em>findById</em>-metodin palauttama promise päätyy rejected-tilaan, kyselyyn vastataan statuskoodilla <i>500 Internal Server Error</i>. Konsoliin tulostetaan tarkempi tieto virheestä.

Olemattoman muistiinpanon lisäksi koodista löytyy myös toinen virhetilanne, joka täytyy käsitellä. Tässä virhetilanteessa muistiinpanoa yritetään hakea virheellisen muotoisella _id_:llä eli sellaisella, joka ei vastaa MongoDB:n id:iden muotoa.

Jos teemme näin, tulostuu konsoliin:

<pre>
Method: GET
Path:   /api/notes/5a3b7c3c31d61cb9f8a0343
Body:   {}
---
{ CastError: Cast to ObjectId failed for value "5a3b7c3c31d61cb9f8a0343" at path "_id"
    at CastError (/Users/mluukkai/opetus/_fullstack/osa3-muisiinpanot/node_modules/mongoose/lib/error/cast.js:27:11)
    at ObjectId.cast (/Users/mluukkai/opetus/_fullstack/osa3-muisiinpanot/node_modules/mongoose/lib/schema/objectid.js:158:13)
    ...
</pre>

Kun <em>findById</em>-metodi saa argumentikseen väärässä muodossa olevan id:n, se heittää virheen. Tästä seuraa se, että metodin palauttama promise päätyy rejected-tilaan, jonka seurauksena <em>catch</em>-lohkossa määriteltyä funktiota kutsutaan. 

Tehdään pieniä muutoksia koodin <em>catch</em>-lohkoon:

```js
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' }) // highlight-line
    })
})
```

Jos id ei ole hyväksyttävässä muodossa, ajaudutaan _catch_:in avulla määriteltyyn virheidenkäsittelijään. Sopiva statuskoodi on [400 Bad Request](https://www.rfc-editor.org/rfc/rfc9110.html#name-400-bad-request) koska kyse on juuri siitä:

> <i>The request could not be understood by the server due to malformed syntax. The client SHOULD NOT repeat the request without modifications.</i>

Vastaukseen on lisätty myös hieman dataa kertomaan virheen syystä.

Promisejen yhteydessä kannattaa melkeinpä aina lisätä koodiin myös virhetilanteiden käsittely, muuten seurauksena on usein hämmentäviä vikoja.

Ei ole koskaan huono idea tulostaa poikkeuksen aiheuttanutta olioa konsoliin virheenkäsittelijässä:

```js
.catch(error => {
  console.log(error)  // highlight-line
  response.status(400).send({ error: 'malformatted id' })
})
```

Virheenkäsittelijään joutumisen syy voi olla joku ihan muu kuin mitä on tullut alun perin ajatelleeksi. Jos virheen tulostaa konsoliin, voi säästyä pitkiltä ja turhauttavilta väärää asiaa debuggaavilta sessioilta.

Aina kun ohjelmoit ja projektissa on mukana backend, <i>**tulee ehdottomasti koko ajan pitää silmällä backendin konsolin tulostuksia**</i>. Jos työskentelet pienellä näytöllä, riittää että konsolista on näkyvissä edes pieni kaistale:

![Kuva havainnollistaa sitä miten sovelluskehittäjän tulee pitää koko ajan esillä editorin lisäksi konsolia johon backend on käynnistetty](../../images/3/15b.png)

### Virheidenkäsittelyn keskittäminen middlewareen

Olemme kirjoittaneet poikkeuksen aiheuttavan virhetilanteen käsittelevän koodin muun koodin sekaan. Se on välillä ihan toimiva ratkaisu, mutta on myös tilanteita, joissa on järkevämpää keskittää virheiden käsittely yhteen paikkaan. Tästä on huomattava etu esim. jos virhetilanteiden yhteydessä virheen aiheuttaneen pyynnön tiedot logataan tai lähetetään johonkin virhediagnostiikkajärjestelmään, esim. [Sentryyn](https://sentry.io/welcome/).

Muutetaan routen <i>/api/notes/:id</i> käsittelijää siten, että se <i>siirtää virhetilanteen käsittelyn eteenpäin</i> funktiolla <em>next</em>, jonka se saa <i>kolmantena</i> parametrinaan:

```js
app.get('/api/notes/:id', (request, response, next) => { // highlight-line
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error)) // highlight-line
})
```

Eteenpäin siirrettävä virhe annetaan funktiolle <em>next</em> parametrina. Jos funktiota <em>next</em> kutsuttaisiin ilman parametria, käsittely siirtyisi ainoastaan eteenpäin seuraavaksi määritellylle routelle tai middlewarelle. Jos funktion <em>next</em> kutsussa annetaan parametri, siirtyy käsittely <i>virheidenkäsittelymiddlewarelle</i>.

Expressin [virheidenkäsittelijät](https://expressjs.com/en/guide/error-handling.html) ovat middlewareja, joiden määrittelevällä funktiolla on <i>neljä parametria</i>. Virheidenkäsittelijämme näyttää seuraavalta:

```js
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

// tämä tulee kaikkien muiden middlewarejen rekisteröinnin jälkeen!
app.use(errorHandler)
```

Virheenkäsittelijä tarkastaa, onko kyse <i>CastError</i>-poikkeuksesta eli virheellisestä olio-id:stä. Jos on, käsittelijä lähettää pyynnön tehneelle selaimelle vastauksen käsittelijän parametrina olevan response-olion avulla. Muussa tapauksessa se siirtää funktiolla <em>next</em> virheen käsittelyn Expressin oletusarvoisen virheidenkäsittelijän hoidettavaksi.

Huomaa, että virheidenkäsittelijämiddleware tulee rekisteröidä muiden middlewarejen rekisteröinnin jälkeen.

### Middlewarejen käyttöönottojärjestys

Koska middlewaret suoritetaan siinä järjestyksessä, missä ne on otettu käyttöön funktiolla _app.use_, on niiden määrittelyn kanssa oltava tarkkana.

Oikeaoppinen järjestys on tämä:

```js
app.use(express.static('build'))
app.use(express.json())
app.use(requestLogger)

app.post('/api/notes', (request, response) => {
  const body = request.body
  // ...
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// olemattomien osoitteiden käsittely
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  // ...
}

// virheellisten pyyntöjen käsittely
app.use(errorHandler)
```

JSON-parseri on syytä ottaa käyttöön melkeinpä ensimmäisenä. Jos järjestys olisi seuraava

```js
app.use(requestLogger) // request.body on tyhjä

app.post('/api/notes', (request, response) => {
  // request.body on tyhjä
  const body = request.body
  // ...
})

app.use(express.json())
```

ei HTTP-pyynnön mukana oleva data olisi loggerin eikä POST-pyynnön käsittelyn aikana käytettävissä, vaan kentässä _request.body_ olisi tyhjä olio.

Tärkeää on myös ottaa käyttöön olemattomien osoitteiden käsittely viimeisenä.

Myös seuraava järjestys aiheuttaisi ongelman:

```js
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// olemattomien osoitteiden käsittely
app.use(unknownEndpoint)

app.get('/api/notes', (request, response) => {
  // ...
})
```

Nyt olemattomien osoitteiden käsittely on sijoitettu <i>ennen HTTP GET ‑pyynnön käsittelyä</i>. Koska olemattomien osoitteiden käsittelijä vastaa kaikkiin pyyntöihin <i>404 Unknown Endpoint</i>, ei mihinkään sen jälkeen määriteltyyn reittiin tai middlewareen (poikkeuksena virheenkäsittelijä) enää mennä.

### Muut operaatiot

Toteutetaan vielä jäljellä olevat operaatiot, eli yksittäisen muistiinpanon poisto ja muokkaus.

Poisto onnistuu helpoiten metodilla [findByIdAndRemove](https://mongoosejs.com/docs/api.html#model_Model.findByIdAndRemove):

```js
app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})
```

Vastauksena on molemmissa "onnistuneissa" tapauksissa statuskoodi <i>204 No Content</i> eli jos olio poistettiin tai olioa ei ollut mutta <i>id</i> oli periaatteessa oikea. Takaisinkutsun parametrin _result_ perusteella olisi mahdollisuus haarautua ja palauttaa tilanteissa eri statuskoodi, jos sille on tarvetta. Mahdollinen poikkeus siirretään jälleen virheenkäsittelijälle.

Muistiinpanon tärkeyden muuttamisen mahdollistava olemassa olevan muistiinpanon päivitys onnistuu helposti metodilla [findByIdAndUpdate](https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate):

```js
app.put('/api/notes/:id', (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})
```

Operaatio mahdollistaa myös muistiinpanon sisällön editoinnin.

Huomaa, että metodin <em>findByIdAndUpdate</em> parametrina tulee antaa normaali JavaScript-olio eikä uuden olion luomisessa käytettävä <em>Note</em>-konstruktorifunktiolla luotu olio.

Huomioi operaatioon <em>findByIdAndUpdate</em> liittyen, että oletusarvoisesti tapahtumankäsittelijä saa parametrikseen <em>updatedNote</em> päivitetyn olion [ennen muutosta](https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate) olleen tilan. Lisäsimme operaatioon parametrin <code>{ new: true }</code>, jotta saamme muuttuneen olion palautetuksi kutsujalle.

Backend vaikuttaa toimivan Postmanista ja VS Coden REST Clientistä tehtyjen kokeilujen perusteella. Myös frontend toimii moitteettomasti tietokantaa käyttävän backendin kanssa.

Sovelluksen tämänhetkinen koodi on kokonaisuudessaan [GitHubissa](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-5), branchissa <i>part3-5</i>.

</div>

<div class="tasks">

### Tehtävät 3.15.-3.18.

#### 3.15: puhelinluettelo ja tietokanta, step3

Muuta backendiä siten, että numerotietojen poistaminen päivittyy tietokantaan.

Varmista, että frontend toimii muutosten jälkeen.

#### 3.16: puhelinluettelo ja tietokanta, step4

Keskitä sovelluksen virheidenkäsittely middlewareen.

Muista, että virheitä heittävät routejen metodit tarvitsevat myös kolmannen parametrin <i>next</i>

#### 3.17*: puhelinluettelo ja tietokanta, step5

Jos frontendissä annetaan numero henkilölle, joka on jo olemassa, päivittää frontend tehtävässä 2.18 tehdyn toteutuksen ansiosta tiedot uudella numerolla tekemällä HTTP PUT ‑pyynnön henkilön tietoja vastaavaan url:iin.

Laajenna backendisi käsittelemään tämä tilanne.

Varmista, että frontend toimii muutosten jälkeen.

#### 3.18*: puhelinluettelo ja tietokanta, step6

Päivitä myös polkujen <i>api/persons/:id</i> ja <i>info</i> käsittely ja varmista niiden toimivuus suoraan selaimella, Postmanilla tai VS Coden REST Clientillä.

Selaimella tarkastellen yksittäisen numerotiedon tulisi näyttää seuraavalta:

![Mentäessä yksittäisen henkilön urliin, renderöi selain JSON:in missä kenttinä nimi, puhelinnumero sekä id](../../images/3/49.png)

</div>
