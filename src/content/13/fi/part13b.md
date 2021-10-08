---
mainImage: ../../../images/part-13.svg
part: 13
letter: b
lang: fi
---

<div class="content">

### Sovelluksen strukturointi

Olemme toistaiseksi kirjottaneet kaiken koodin samaan tiedostoon. Strukturoidaan nyt sovellus hieman paremmin. Luodaan seuraava hakemistorakenne ja tiedostot

```
index.js
util
  config.js
  db.js
models
  index.js
  note.js
controllers
  notes.js
```

Tiedostojen sisältö on seuraava. Tiedosto `util/config.js` huolehtii ympäristömuuttujien käsittelystä:

```js
require('dotenv').config()

module.exports = {
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT || 3001,
}
```

Tiedoston `index.js` rooliksi jää sovelluksen konfigurointi ja käynnistäminen:

```js
const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const notesRouter = require('./controllers/notes')

app.use(express.json())

app.use('/api/notes', notesRouter)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()
```

Sovelluksen käynnistys poikkeaa hieman aiemmin näkemästä, sillä haluamme varmistaa ennen varsinaista käynnistämistä että tietokantayhteys on muodostettu.

Tiedosto `util/db.js` sisältää tietokannan alustukseen liittyvän koodin:

```js
const Sequelize = require('sequelize')
const { DATABASE_URL } = require('./config')

const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log('database connected')
  } catch (err) {
    console.log('connecting database failed')
    return process.exit(1)
  }

  return null
}

module.exports = { connectToDatabase, sequelize }
```

Muistiinpanot tallettavaa taulua vastaava model on talletettu tiedostoon `models/note.js`:

```js
const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Note extends Model {}

Note.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  important: {
    type: DataTypes.BOOLEAN
  },
  date: {
    type: DataTypes.DATE
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'note'
})

module.exports = Note
```

Tiedosto `models/index.js` on tässä vaiheessa lähes turha sillä sovelluksessa on vasta yksi model. Kun lisäämme sovellukseen muitakin modeleja tulee tiedostolle enemmän käyttöä, sillä tiedoston ansiosta muualla ohjelmassa ei tarvitse importata erikseen yksittäisen modelin määritteleviä tiedostoja.

```js
const Note = require('./note')

Note.sync()

module.exports = {
  Note
}
```

Muistiinpanoihin liittyvät routejen käsittelijät löytyvät tiedostosta `controllers/notes.js`

```js
const router = require('express').Router()

const { Note } = require('../models')

router.get('/', async (req, res) => {
  const notes = await Note.findAll()
  res.json(notes)
})

router.post('/', async (req, res) => {
  try {
    const note = await Note.create(req.body)
    res.json(note)
  } catch(error) {
    return res.status(400).json({ error })
  }
})

router.get('/:id', async (req, res) => {
  const note = await Note.findByPk(req.params.id)
  if (note) {
    res.json(note)
  } else {
    res.status(404).end()
  }
})

router.delete('/:id', async (req, res) => {
  const note = await Note.findByPk(req.params.id)
  if (note) {
    await note.destroy()
  }
  res.status(204).end()
})

router.put('/:id', async (req, res) => {
  const note = await Note.findByPk(req.params.id)
  if (note) {
    note.important = req.body.important
    await note.save()
    res.json(note)
  } else {
    res.status(404).end()
  }
})

module.exports = router
```

Sovelluksen rakenne on nyt hyvä. Huomaamme kuitenkin että yksittäistä muistiinpanoa käsittelevät reitinkäsittelijät sisältävät aavistuksen verran toisteista koodia, sillä kaikki niistä alkavat käsiteltävän muistiinpanon etsivällä rivillä:

```js
const note = await Note.findByPk(req.params.id)
```

Refaktoroidaan tämä omaan <i>middlewareen</i> ja otetaan se käyttöön reittienkäsittelijöissä:

```js
const noteFinder = async (req, res, next) => {
  req.note = await Note.findByPk(req.params.id)
  next()
} 

router.get('/:id', noteFinder, async (req, res) => {
  if (req.note) {
    res.json(req.note)
  } else {
    res.status(404).end()
  }
})

router.delete('/:id', noteFinder, async (req, res) => {
  if (req.note) {
    await req.note.destroy()
  }
  res.status(204).end()
})

router.put('/:id', noteFinder, async (req, res) => {
  if (req.note) {
    req.note.important = req.body.important
    await req.note.save()
    res.json(req.note)
  } else {
    res.status(404).end()
  }
})
```

Reitinkäsittelijät saavat nyt <i>kolme</i> parametria, näistä ensimmäinen on reitin märittelevä merkkijono ja toisena on määrittelemämme middleware `noteFinder`, joka hakee muistiinpanon tietokannasta ja sijoittaa sen `req` olion kenttään `note`. Pieni määrä copypastea poistuu ja olemme tyyvytäisiä!

Sovelluksen tämänhetkinen koodi on kokonaisuudessaan [githubissa](https://github.com/fullstack-hy/part122-notes/tree/part12-2), branchissa <i>part12-2</i>.

</div>

<div class="tasks">

### Tehtävät 13.5.-13.7.

#### Tehtävä 13.5.

Muuta sovelluksesi rakenne edellä olevan esimerkin mukaiseksi, tai noudattamaan jotain muuta vastaavaa selkeää konventiota.

#### Tehtävä 13.6.

Toteuta sovellukseen myös tuki blogien like-määrän muuttamiselle, eli operaatio

- PUT api/blogs/:id (blogin like-määrän muokkaus)
#### Tehtävä 13.7.

Keskitä sovelluksen virheidenkäsittely middlewareen [osan 3](/osa3/tietojen_tallettaminen_mongo_db_tietokantaan#virheidenkasittelyn-keskittaminen-middlewareen) tapaan. Voit ottaa käyttöösi myös middlewaren [express-async-errors](https://github.com/davidbanham/express-async-errors) kuten teimme [osassa 4](/osa4/backendin_testaaminen#try-catchin-eliminointi).

Virheilmoituksen yhteydessä palautettavalla datalla ei ole suurta merkitystä. On kuitenkin todennäköistä, että frontend ei osaa tulkita sitä oikein.

Tässä vaiheessa sovelluksen virhekäsittelyä vaativat tilanteet ovat uuden blogin luominen sekä blogin tykkäysmäärän muuttaminen. Varmista, että virheidenkäsittelijä hoitaa molemmat asiankuuluvalla tavalla.

</div>

<div class="content">

### Käyttäjänhallinta

Lisätään seuraavaksi sovellukseen tietokantataulu `users`, johon tallenetaan sovelluksen käyttäjät. Toteutetaan lisäksi mahdollisuus käyttäjien luomiseen sekä token-perustainen kirjautuminen [osan 4](/osa4/token_perustainen_kirjautuminen) tapaan. Yksinkertaisuuden vuoksi teemme toteutuksen nyt niin, että kaikilla käyttjillä on sama salasana `salainen`.

Käyttäjän määrittelevä model tiedostossa `models/user.js` on melko suoraviivainen

```js
const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class User extends Model {}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'user'
})

module.exports = User
```

Käyttäjätunnukseen on asetettu ehdoksi että se on uniikki. Käyttäjätunnusta olisi periaatteessa voitu käyttää taulun pääavaimena. Päätimme kuitenkin luoda pääavaimen erillisenä kenttänä kokonaislukuarvoisena kenttänä <i>id</i>.


Tiedosto <i>models/index.js</i> laajenee hieman

```js
const Note = require('./note')
const User = require('./user') // highlight-line

User.sync() // highlight-line

module.exports = {
  Note, User // highlight-line
}
```

Tiedostoon <i>controllers/users.js</i> sijoitettavat uuden käyttäjä luomisesta sekä kaikkien käyttäjien näyttämisestä huolehtivat reitinkäsittelijät eivät sisällä mitään dramaattista

```js
const router = require('express').Router()

const { User } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll()
  res.json(users)
})

router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch(error) {
    return res.status(400).json({ error })
  }
})

router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

module.exports = router
```

Kirjautumisen hoitava reitinkäsittelijä (tiedosto <i>controllers/login.js</i>) on seuraavassa:

```js
const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const User = require('../models/user')

router.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({ 
    where: { 
      username: body.username
    }
  })
  
const passwordCorrect = body.password === 'salainen'
  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username, 
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET)

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = router
```

Post-pyynnön mukana vastaanotetaan käyttäjätunnus (<i>username</i>) sekä salasana (<i>password</i>). Ensin käyttäjää vastaava olio haetaan tietokannasta modelin `User` metodilla [findOne](https://sequelize.org/master/manual/model-querying-finders.html#-code-findone--code-): 

```js
const user = await User.findOne({ 
  where: { 
    username: body.username
  }
})
```

Konsolista näemme metodikutsua vastaavan SQL-lauseen

```sql
SELECT "id", "username", "name" 
FROM "users" AS "User" 
WHERE "User"."username" = 'mluukkai';
```

Jos käyttäjä löytyy ja salasana on oikein (eli kaikkien käyttäjien tapauksessa _salainen_), palautetaan kutsujalle `jsonwebtoken`, joka sisältää käyttäjän tietot. Tätä varten asennamme 
riippuvuuden

```js
npm install jsonwebtoken
```

Tiedosto `index.js` laajenee hiukan

```js
const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

app.use(express.json())

app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
```

Sovelluksen tämänhetkinen koodi on kokonaisuudessaan [githubissa](https://github.com/fullstack-hy/part12-notes/tree/part12-3), branchissa <i>part12-3</i>.

### Taulujen välinen liitos

Sovellukseen voi nyt lisätä käyttäjiä ja käyttäjät voivat kirjautua, mutta itsessään tämä ei ole vielä kovin hyödyllinen ominaisuus. Ideana on se, että ainoastaan kirjaantunut käyttäjä voi lisätä muistiinpanoja, ja että jokaiseen muistiinpanoon liitetään sen luonut käyttäjä. Tarvitsemme tätä varten <i>viiteavaimen</i> muitiinpanot tallettavaan tauluun `notes`. 

Sequelizeä käyttäessä viiteavaimen märittely onnistuu muuttamalla tiedostoa `models/index.js` seuraavasti

```js
const Note = require('./note')
const User = require('./user')

// hightlight-start
User.hasMany(Note)
Note.belongsTo(User)

Note.sync({ alter: true })
User.sync({ alter: true })
// hightlight-end

module.exports = {
  Note, User
}
```

Näin siis [määritellään](https://sequelize.org/master/manual/assocs.html#one-to-one-relationships) että  `users` ja `notes` rivien välillä on _yhden suhde moneen_ -yhteys. Muutimme myös `sync`-kutsuja siten että ne muuttavat taulut jos taulujen määrittelyyn on tullut muutoksia. Kun nyt katsotaan tietokannan skeemaa konsolista, se näyttää seuraavalta:

```js
username=> \d users
                                     Table "public.users"
  Column  |          Type          | Collation | Nullable |              Default
----------+------------------------+-----------+----------+-----------------------------------
 id       | integer                |           | not null | nextval('users_id_seq'::regclass)
 username | character varying(255) |           | not null |
 name     | character varying(255) |           | not null |
Indexes:
    "users_pkey" PRIMARY KEY, btree (id)
Referenced by:
    TABLE "notes" CONSTRAINT "notes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL

username=> \d notes
                                      Table "public.notes"
  Column   |           Type           | Collation | Nullable |              Default
-----------+--------------------------+-----------+----------+-----------------------------------
 id        | integer                  |           | not null | nextval('notes_id_seq'::regclass)
 content   | text                     |           | not null |
 important | boolean                  |           |          |
 date      | timestamp with time zone |           |          |
 user_id   | integer                  |           |          |
Indexes:
    "notes_pkey" PRIMARY KEY, btree (id)
Foreign-key constraints:
    "notes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL
```

Eli tauluun `notes` on luotu viiteavain `user_id`, joka viittaa taulun `users`-riviin.

Tehdään nyt uuden muistiinpanon lisäämiseen sellainen muutos, että muistiinpano liitetään käyttäjään. Ennen kuin teemme kunnollisen toteutuksen (missä liitos tapahtuu tokenin avulla kirjautumisen osoittavaan käyttäjään), liitetään muistiinpano ensimmäiseen tietokannata löytyvään käyttäjään:

```js

router.post('/', async (req, res) => {
  try {
    // hightlight-start
    const user = await User.findOne()
    const note = await Note.create({...req.body, userId: user.id})
    // hightlight-end
    res.json(note)
  } catch(error) {
    return res.status(400).json({ error })
  }
})
```

Huomioinarvoista koodissa on se, että vaikka tietokannan tasolla muistiinpanoilla on sarake `user\_id`, tietokantariviä vastaavassa oliossa siihen viitataan camel case muodossa `userId`.

Yksinkertaisen liitoskyselyn tekeminen on erittäin helppoa. Muutetaan kaikki käyttäjät näyttävää routea siten, että se näyttää myös jokaisen käyttäjän muistiinpanot:

```js
router.get('/', async (req, res) => {
  // highlight-start
  const users = await User.findAll({ 
    include: {
      model: Note
    }
  })
  // highlight-end
  res.json(users)
})
```

Liitoskysely siis tehdään kyselyn parametrina olevan olioon [include](https://sequelize.org/master/manual/assocs.html#eager-loading-example)-määreen avulla.

Kyselystä muodostuva sql-lause nähdään konsolissa:

```
SELECT "User"."id", "User"."username", "User"."name", "Notes"."id" AS "Notes.id", "Notes"."content" AS "Notes.content", "Notes"."important" AS "Notes.important", "Notes"."date" AS "Notes.date", "Notes"."user_id" AS "Notes.UserId" 
FROM "users" AS "User" LEFT OUTER JOIN "notes" AS "Notes" ON "User"."id" = "Notes"."user_id";
```

Lopputulos on myös sen kaltainen kuin odottaa saattaa

KUVA

_TODO: where include:ssa esimerkki (esim. notet, joissa `important: true`)?_

### Muistiinpanojen kunnollinen lisääminen

Muutenaan muistiinpanojen lisäys toimimaan samoin kuin [osassa 4](/osa4), eli muistiinpanon luominen onnistuu ainoastaan jos luomista vastaavan pyynnön mukana on validi token. Muistiinpano talletetaan tokenin identifioiman käyttäjän tekemien muistiinpanojen listaan:

```js
// highlight-start
const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch{
      res.status(401).json({ error: 'token invalid' })
    }
  } else {
    res.status(401).json({ error: 'token missing' })
  }
  next()
}
// highlight-end

router.post('/', tokenExtractor, async (req, res) => {
  try {
    // highlight-start
    const user = await User.findByPk(req.decodedToken.id)
    const note = await Note.create({...req.body, userId: user.id, date: new Date()})
    // highlight-end
    res.json(note)
  } catch(error) {
    return res.status(400).json({ error })
  }
})
```

Token otetaan ja dekoodataan pyyntöön headereista ja sijoitetaan <i>req</i>-olioon middlewaren <i>tokenExtractor</i> toimesta. Muistiinpanoa luotaessa myös sen luontihetken kertovalle kentälle <i>date</i> annetaan arvo.

### Hienosäätöä

Backendimme toimii tällä hetkellä virheidenkäsittelyä lukuunottamatta lähes samalla tavalla kuin osan 4 versio samasta sovelluksesta. Ennen kun teemme backendiin muutamia laajennuksia, muutetaan kaikkien muistiinpanojen sekä kaikkien käyttäjien routeja hieman.

Lisätään muistiinpanojen yhteyteen tieto sen lisänneestä käyttäjästä:

```js
router.get('/', async (req, res) => {
  const notes = await Note.findAll({ 
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    }
  })
  res.json(notes)
})
```

Olemme myös [rajoittaneet](https://sequelize.org/master/manual/model-querying-basics.html#specifying-attributes-for-select-queries) minkä kenttien arvot haluamme. Muistiinpanoista otetaan kaikki muut kentät paitsi `userId` ja muistiinpanoon liittuvästä käyttäjästä ainoastaan `name` eli nimi.

Tehdään samantapainen muutos kaikkien käyttäjien reittiin, poistetaan käyttäjään liittyvistä muistiinpanoista turha kenttä `userId`: 

```js
router.get('/', async (req, res) => {
  const users = await User.findAll({ 
    include: {
      model: Note,
      attributes: { exclude: ['userId'] } // highlight-line
    }
  })
  res.json(users)
})
```

Sovelluksen tämänhetkinen koodi on kokonaisuudessaan [githubissa](https://github.com/fullstack-hy/part12-notes/tree/part12-4), branchissa <i>part12-4</i>.'

</div>

<div class="tasks">

### Tehtävät 13.8.-13.11.

#### Tehtävä 13.8.

Lisää sovellukseen tuki käyttäjille. Käyttäjillä on tunnisteen lisäksi seuraava kentät:

- name (merkkijono, ei saa olla tyhjä)
- username (merkkijono, ei saa olla tyhjä)

Toisin kuin materiaalissa älä nyt estä Sequelizea luomasta käyttäjille [aikaleimoja](https://sequelize.org/master/manual/model-basics.html#timestamps) <i>created\_at</i> ja <i>updated\_at</i>

Kaikilla käyttäjillä voi olla sama salasana materiaalin tapaan. Voit myös halutessasi toteuttaa salasanan kunnolla [osan 4](/osa4/kayttajien_hallinta) tapaan.

Toteuta seuraavat routet 

- POST api/users (uuden käyttäjän lisäys)
- GET api/users (kaikkien käyttäjien listaus)
- PUT api/users/:username (käyttäjän nimen muutos, huomaa että parametrina ei ole id vaan käyttäjätunnus)

Varmista, että Sequelizen automaattisesti asettamat aikaleimat <i>created_at</i> ja <i>updated_at</i> toimivat oikein kun luot käyttäjän ja muutat käyttäjän nimeä.

#### Tehtävä 13.9.

Sequelize tarjoa joukon valmiiksi määriteltyjä
[validointeja](https://sequelize.org/master/manual/validations-and-constraints.html) modelien kentille, jotka se suorittaa ennen olioiden tallentamista tietokantaan.

Päätetään muuttaa käyttäjätunnuksen luontiperiaatetta siten, että käyttäjätunnukseksi kelpaa ainoastaan validi emailosoite. Tee tunnuksen luomisen yhteyteen validointi, joka tarkastaa asian.

Muuta virheidenkäsittelymiddlewarea siten, että se antaa tilanteessa kuvaavamman virheilmoituksen (hyödyntäen Sequelizen virheeseen liittyvää viestiä), esim.

```js
{
    "error": [
        "Validation isEmail on username failed"
    ]
}
```

#### Tehtävä 13.10.

Laajenna sovellusta siten, että blogi liitetään tokenin perusteella identifioitavalle kirjautuneelle käyttäjälle.

#### Tehtävä 13.11.

Tee blogin poisto mahdolliseksi ainoastaan blogin lisänneelle käyttäjälle.

#### Tehtävä 13.12.

Muokkaa blogien ja käyttäjien routea siten, että blogien yhteydessä näytetään tieto blogin lisänneestä käyttäjästä ja käyttäjän yhteydessä tiedot käyttäjien blogeista.

</div>

<div class="content">

## Lisää kyselyitä

Toistaiseksi sovelluksemme on ollut kyselyiden suhteen hyvin yksinkertainen, kyselyt ovat hakeneet joko yksittäisen rivin pääavaimeen perustuen METODIA [findByPk](https://sequelize.org/master/class/lib/model.js~Model.html#static-method-findByPk) käyttäen tai ne ovat hakeet metodilla [findAll](https://sequelize.org/master/class/lib/model.js~Model.html#static-method-findAll) taulun kaikki rivit. Nämä riittävät sovellukselle osassa 5 tehdylle frontendille, mutta laajennetaan backendia siten, että pääsemme myös harjoittelemaan hieman monimutkaisempien kyselyjen tekemistä.

Toteutetaan ensin mahdollisuus hakea ainoastaan tärkeät tai ei-tärkeät muistiinpanot. Toteutetaan nämä [query-parametrin](http://expressjs.com/en/5x/api.html#req.query) important avulla:

```js
router.get('/', async (req, res) => {
  const notes = await Note.findAll({ 
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    // highlight-start
    where: {
      important: req.query.important === "true"
    }
    // highlight-end
  })
  res.json(notes)
})
```

Nyt backendilta voidaan hakea tärkeät muistiinpanot pyynnöllä http://localhost:3001/api/notes?important=true ja ei-tärkeät pyynnöllä http://localhost:3001/api/notes?important=false

Sequelizen generoima SQL-kysely sisältää luonnollisesti palautettavia rivejä rajaavan where-määreen: 

```sql
SELECT "note"."id", "note"."content", "note"."important", "note"."date", "user"."id" AS "user.id", "user"."name" AS "user.name" 
FROM "notes" AS "note" LEFT OUTER JOIN "users" AS "user" ON "note"."user_id" = "user"."id" 
WHERE "note"."important" = true;
```

Ikävä kyllä tämä toteutus ei toimi jos haettaessa ei olla kiinnostuneita onko muistiinpano tärkeä vai ei eli jos pyyntö tehdään osoitteeseen http://localhost:3001/api/notes. Korjaus voidaan tehdä monella tapaa. Eräs, mutta ei kenties paras tapa tehdä korjaus olisi seuraavassa:

```js
const { Op } = require('sequelize')

router.get('/', async (req, res) => {
  //highlight-line
  let important = {
    [Op.in]: [true, false]
  }
  
  if ( req.query.important ) {
    important = req.query.important === "true"
  }
  //highlight-end
  
  const notes = await Note.findAll({ 
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where: {
      important // highlight-line
    }
  })
  res.json(notes)
})
```

Olio `important` tallettaa nyt kyselyn ehdon. Se on oletusarvoisesti 

```js
where: {
  important: {
    [Op.in]: [true, false]
  }
}
```

eli sarake `important` voi olla arvoltaan `true` tai `false`, käytössä on yksi monista Sequelizen operaatioista [Op.in](https://sequelize.org/master/manual/model-querying-basics.html#operators). Jos query-parametri `req.query.important` on määritelty, muuttuu kysely jompaan kumpaan muotoon

```js
where: {
  important: true
}
```

tai

```js
where: {
  important: true
}
```

riippuen query-parametrin arvosta.

Laajennetaan toiminnallisuutta vielä siten, että muistiinpanoja haettaessa voidaan määritellä vaadittu hakusana, eli esim. tekemällä pyyntö http://localhost:3001/api/notes?search=database saadaan kaikki muistiinpanot, joissa mainitaan `database` tai pyynnöllä http://localhost:3001/api/notes?search=javascript&important=true saadaan kaikki tärkäksi merkityt muistiinpanot, joissa mainitaan `javascript`. Toteutus on seuraavassa

```js
router.get('/', async (req, res) => {
  let important = {
    [Op.in]: [true, false]
  }
  
  if ( req.query.important ) {
    important = req.query.important === "true"
  }

  const notes = await Note.findAll({ 
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where: {
      important,
      // highlight-start
      content: {
        [Op.substring]: req.query.search ? req.query.search : ''
      }
      // highlight-end
    }
  })
  
  res.json(notes)
})
```

Sequelizen [Op.substring](https://sequelize.org/master/manual/model-querying-basics.html#operators) muodostaa haluamme kyselyn SQL:n like-avainsanaa käyttäen. Jos esim. teemme pyynnönö http://localhost:3001/api/notes?search=database&important=true näemme että sen aikaansaama SQL-kysely on juuri olettamamme kaltainen.

```sql
SELECT "note"."id", "note"."content", "note"."important", "note"."date", "user"."id" AS "user.id", "user"."name" AS "user.name" 
FROM "notes" AS "note" LEFT OUTER JOIN "users" AS "user" ON "note"."user_id" = "user"."id" 
WHERE "note"."important" = true AND "note"."content" LIKE '%database%';
```

Sovelluksessamme on vielä sellainen kauneusvirhe, että jos teemme pyynnön http://localhost:3001/api/notes eli haluamme kaikki muistiinpanot toteutuksemme aiheuttaa kyselyyn turhan wheren, joka saattaa (riippuen tietokantamoottorin toteutuksesta) vaikuttaa tarpeettomasti kyselyn suoritusaikaan:

```sql
SELECT "note"."id", "note"."content", "note"."important", "note"."date", "user"."id" AS "user.id", "user"."name" AS "user.name" 
FROM "notes" AS "note" LEFT OUTER JOIN "users" AS "user" ON "note"."user_id" = "user"."id" 
WHERE "note"."important" IN (true, false) AND "note"."content" LIKE '%%';
```

Optimoidaan koodia vielä siten, että where-ehtoja käytetään ainoastaan tarvittaessa:

```js
router.get('/', async (req, res) => {
  const where = {}

  if (req.query.important) {
    where.important = req.query.important === "true"
  } 

  if (req.query.search) {
    where.content = {
      [Op.substring]: req.query.search
    }
  }

  const notes = await Note.findAll({ 
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where
  })

  res.json(notes)
})
```

Jos pyynnössä on hakuehtoja esim. http://localhost:3001/api/notes?search=database&important=true muodostuu wheren sisältävä kysely

```sql
SELECT "note"."id", "note"."content", "note"."important", "note"."date", "user"."id" AS "user.id", "user"."name" AS "user.name" 
FROM "notes" AS "note" LEFT OUTER JOIN "users" AS "user" ON "note"."user_id" = "user"."id"
WHERE "note"."important" = true AND "note"."content" LIKE '%database%';
```

Jos pyyntö on hakuehdoton http://localhost:3001/api/notes ei kyselyssä ole turhaa whereä

```sql
SELECT "note"."id", "note"."content", "note"."important", "note"."date", "user"."id" AS "user.id", "user"."name" AS "user.name" 
FROM "notes" AS "note" LEFT OUTER JOIN "users" AS "user" ON "note"."user_id" = "user"."id";
```

Sovelluksen tämänhetkinen koodi on kokonaisuudessaan [githubissa](https://github.com/fullstack-hy/part12-notes/tree/part12-5), branchissa <i>part12-5</i>.

</div>

<div class="tasks">

### Tehtävät 13.13.-13.16

#### Tehtävä 13.13.

Toteuta sovellukseen kaikki blogit palauttavaan reittiin filtteröinti hakusanan perusteella. Filtteröinti toimii seuraavasti
- GET http://localhost:3003/api/blogs?serch=react palauttaa ne blogit joiden kentässä <i>title</i> esiintyy hakusana <i>react</i>, hakusana on epäcasesensitiivinen
- GET http://localhost:3003/api/blogs palauttaa kaikki blogit


[Tämä](https://sequelize.org/master/manual/model-querying-basics.html#operators) lienee hyödyksi tässä ja seuraavassa tehtävässä.
#### Tehtävä 13.14.

Laajenna filtteriä siten, että se etsii hakusanaa kentistä <i>title</i> ja author <i>author</i>, eli

- GET http://localhost:3003/api/blogs?serch=jami palauttaa ne blogit joiden kentässä <i>title</i> tai kentässä <i>author</i> esiintyy hakusana <i>jami</i>
#### Tehtävä 13.15.

Muokkaa blogien reittiä siten, että se palauttaa blogit tykkäysten perusteella laskevassa järjestyksessä. Etsi [dokumentaatiosta](https://sequelize.org/master/manual/model-querying-basics.html) ohjeet järjestämiselle.

#### Tehtävä 13.16.

Tee sovellukselle reitti http://localhost:3003/api/authors, joka palauttaa kustakin authorista blogien määrän sekä tykkäyaten yhteenlasketun määrän. Toteuta operaatio suoraan tietokannan tasolla. Tarvitset suurella todennäköisyydellä [group by](https://sequelize.org/master/manual/model-querying-basics.html#grouping)-toiminnallisuutta, sekä [sequelize.fn](https://sequelize.org/master/manual/model-querying-basics.html#specifying-attributes-for-select-queries)-aggregaattorifunktiota.

Reitin palauttama JSON voi näyttää esim. seuraavalta:

KUVA

```
[
  {
    author: "Jami Kousa",
    articles: "3",
    likes: "10"
  },
  {
    author: "Kalle Ilves",
    articles: "1",
    likes: "2"
  },
  {
    author: "Dan Abramov",
    articles: "1",
    likes: "4"
  }
]
```

</div>