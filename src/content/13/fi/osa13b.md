---
mainImage: ../../../images/part-13.svg
part: 13
letter: b
lang: fi
---

<div class="content">

### Sovelluksen strukturointi

Olemme toistaiseksi kirjoittaneet kaiken koodin samaan tiedostoon. Strukturoidaan nyt sovellus hieman paremmin. Luodaan seuraava hakemistorakenne ja tiedostot:

```bash
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

Tiedostojen sisältö on seuraava. Tiedosto <i>util/config.js</i> huolehtii ympäristömuuttujien käsittelystä:

```js
require('dotenv').config()

module.exports = {
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT || 3001,
}
```

Tiedoston <i>index.js</i> rooliksi jää sovelluksen konfigurointi ja käynnistäminen:

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

Tiedosto <i>util/db.js</i> sisältää tietokannan alustukseen liittyvän koodin:

```js
const Sequelize = require('sequelize')
const { DATABASE_URL } = require('./config')

const sequelize = new Sequelize(DATABASE_URL)

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

Muistiinpanot tallettavaa taulua vastaava model on talletettu tiedostoon <i>models/note.js</i>:

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

Tiedosto <i>models/index.js</i> on tässä vaiheessa lähes turha, sillä sovelluksessa on vasta yksi model. Kun lisäämme sovellukseen muitakin modeleja tulee tiedostolle enemmän käyttöä, sillä tiedoston ansiosta muualla ohjelmassa ei tarvitse importata erikseen yksittäisen modelin määritteleviä tiedostoja.

```js
const Note = require('./note')

Note.sync()

module.exports = {
  Note
}
```

Muistiinpanoihin liittyvät routejen käsittelijät löytyvät tiedostosta <i>controllers/notes.js</i>:

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
// highlight-start
const noteFinder = async (req, res, next) => {
  req.note = await Note.findByPk(req.params.id)
  next()
}
// highlight-end

router.get('/:id', noteFinder, async (req, res) => { // highlight-line
  if (req.note) {
    res.json(req.note)
  } else {
    res.status(404).end()
  }
})

router.delete('/:id', noteFinder, async (req, res) => { // highlight-line
  if (req.note) {
    await req.note.destroy()
  }
  res.status(204).end()
})

router.put('/:id', noteFinder, async (req, res) => { // highlight-line
  if (req.note) {
    req.note.important = req.body.important
    await req.note.save()
    res.json(req.note)
  } else {
    res.status(404).end()
  }
})
```

Reitinkäsittelijät saavat nyt <i>kolme</i> parametria, näistä ensimmäinen on reitin määrittelevä merkkijono ja toisena on määrittelemämme middleware <i>noteFinder</i>, joka hakee muistiinpanon tietokannasta ja sijoittaa sen <i>req</i> olion kenttään <i>note</i>. Pieni määrä copypastea poistuu ja olemme tyytyväisiä!

Sovelluksen tämänhetkinen koodi on kokonaisuudessaan [GitHubissa](https://github.com/fullstack-hy/part13-notes/tree/part13-2), branchissa <i>part13-2</i>.

</div>

<div class="tasks">

### Tehtävät 13.5.-13.7.

#### Tehtävä 13.5.

Muuta sovelluksesi rakenne edellä olevan esimerkin mukaiseksi, tai noudattamaan jotain muuta vastaavaa selkeää konventiota.

#### Tehtävä 13.6.

Toteuta sovellukseen myös tuki blogien like-määrän muuttamiselle, eli operaatio

_PUT /api/blogs/:id_ (blogin like-määrän muokkaus)

Likejen päivitetty määrä välitetään pyynnön mukana:

```js
{
  likes: 3
}
```

#### Tehtävä 13.7.

Keskitä sovelluksen virheidenkäsittely middlewareen [osan 3](/osa3/tietojen_tallettaminen_mongo_db_tietokantaan#virheidenkasittelyn-keskittaminen-middlewareen) tapaan. Voit ottaa käyttöösi myös middlewaren [express-async-errors](https://github.com/davidbanham/express-async-errors) kuten [osassa 4](/osa4/backendin_testaaminen#try-catchin-eliminointi) tehtiin.

Virheilmoituksen yhteydessä palautettavalla datalla ei ole suurta merkitystä.

Tässä vaiheessa sovelluksen virhekäsittelyä vaativat tilanteet ovat uuden blogin luominen sekä blogin tykkäysmäärän muuttaminen. Varmista, että virheidenkäsittelijä hoitaa molemmat asiaankuuluvalla tavalla.

</div>

<div class="content">

### Käyttäjänhallinta

Lisätään seuraavaksi sovellukseen tietokantataulu <i>users</i>, johon tallennetaan sovelluksen käyttäjät. Toteutetaan lisäksi mahdollisuus käyttäjien luomiseen sekä token-perustainen kirjautuminen [osan 4](/osa4/token_perustainen_kirjautuminen) tapaan. Yksinkertaisuuden vuoksi teemme toteutuksen nyt niin, että kaikilla käyttäjillä on sama salasana <i>salainen</i>.

Käyttäjän määrittelevä model tiedostossa <i>models/user.js</i> on melko suoraviivainen

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

Käyttäjätunnukseen on asetettu ehdoksi että se on uniikki. Käyttäjätunnusta olisi periaatteessa voitu käyttää taulun pääavaimena. Päätimme kuitenkin luoda pääavaimen erillisenä kokonaislukuarvoisena kenttänä <i>id</i>.


Tiedosto <i>models/index.js</i> laajenee hieman:

```js
const Note = require('./note')
const User = require('./user') // highlight-line

Note.sync()
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

Post-pyynnön mukana vastaanotetaan käyttäjätunnus (<i>username</i>) sekä salasana (<i>password</i>). Ensin käyttäjää vastaava olio haetaan tietokannasta modelin <i>User</i> metodilla [findOne](https://sequelize.org/master/manual/model-querying-finders.html#-code-findone--code-):

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

Jos käyttäjä löytyy ja salasana on oikein (eli kaikkien käyttäjien tapauksessa _salainen_), palautetaan kutsujalle <i>jsonwebtoken</i>, joka sisältää käyttäjän tietot. Tätä varten asennamme riippuvuuden

```js
npm install jsonwebtoken
```

Tiedosto <i>index.js</i> laajenee hiukan

```js
const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users') // highlight-line
const loginRouter = require('./controllers/login') // highlight-line

app.use(express.json())

app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter) // highlight-line
app.use('/api/login', loginRouter) // highlight-line
```

Sovelluksen tämänhetkinen koodi on kokonaisuudessaan [GitHubissa](https://github.com/fullstack-hy/part13-notes/tree/part13-3), branchissa <i>part13-3</i>.

### Taulujen välinen liitos

Sovellukseen voi nyt lisätä käyttäjiä ja käyttäjät voivat kirjautua, mutta itsessään tämä ei ole vielä kovin hyödyllinen ominaisuus. Ideana on se, että ainoastaan kirjautunut käyttäjä voi lisätä muistiinpanoja, ja että jokaiseen muistiinpanoon liitetään sen luonut käyttäjä. Tarvitsemme tätä varten <i>viiteavaimen</i> muistiinpanot tallettavaan tauluun <i>notes</i>.

Sequelizeä käytettäessä viiteavaimen määrittely onnistuu muuttamalla tiedostoa <i>models/index.js</i> seuraavasti

```js
const Note = require('./note')
const User = require('./user')

// highlight-start
User.hasMany(Note)
Note.belongsTo(User)
// highlight-end

// highlight-start
Note.sync({ alter: true })
User.sync({ alter: true })
// highlight-end

module.exports = {
  Note, User
}
```

Näin siis [määritellään](https://sequelize.org/master/manual/assocs.html#one-to-one-relationships) että <i>users</i> ja <i>notes</i> rivien välillä on <i>yhden suhde moneen</i> -yhteys. Muutimme myös <i>sync</i>-kutsuja siten että ne muuttavat taulut, jos taulujen määrittelyyn on tullut muutoksia. Kun nyt katsotaan tietokannan skeemaa konsolista, se näyttää seuraavalta:

```js
postgres=# \d users
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

postgres=# \d notes
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

Eli tauluun <i>notes</i> on luotu viiteavain <i>user_id</i>, joka viittaa taulun <i>users</i>-riviin.

Tehdään nyt uuden muistiinpanon lisäämiseen sellainen muutos, että muistiinpano liitetään käyttäjään. Ennen kuin teemme kunnollisen toteutuksen (missä liitos tapahtuu tokenin avulla kirjautumisen osoittavaan käyttäjään), liitetään muistiinpano ensimmäiseen tietokannasta löytyvään käyttäjään:

```js

router.post('/', async (req, res) => {
  try {
    // highlight-start
    const user = await User.findOne()
    const note = await Note.create({ ...req.body, userId: user.id })
    // highlight-end
    res.json(note)
  } catch(error) {
    return res.status(400).json({ error })
  }
})
```

Huomionarvoista koodissa on se, että vaikka tietokannan tasolla muistiinpanoilla on sarake <i>user_id</i>, tietokantariviä vastaavassa oliossa siihen viitataan Sequelizen nimentäkonvention takia camel case muodossa <i>userId</i>.

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

Liitoskysely siis tehdään kyselyn parametrina olevaan olioon [include](https://sequelize.org/master/manual/assocs.html#eager-loading-example)-määreen avulla.

Kyselystä muodostuva sql-lause nähdään konsolissa:

```
SELECT "User"."id", "User"."username", "User"."name", "Notes"."id" AS "Notes.id", "Notes"."content" AS "Notes.content", "Notes"."important" AS "Notes.important", "Notes"."date" AS "Notes.date", "Notes"."user_id" AS "Notes.UserId"
FROM "users" AS "User" LEFT OUTER JOIN "notes" AS "Notes" ON "User"."id" = "Notes"."user_id";
```

Lopputulos on myös sen kaltainen kuin odottaa saattaa

![](../../images/13/1.png)

### Muistiinpanojen kunnollinen lisääminen

Muutetaan muistiinpanojen lisäys toimimaan samoin kuin [osassa 4](/osa4), eli muistiinpanon luominen onnistuu ainoastaan jos luomista vastaavan pyynnön mukana on validi, kirjautumisen yhteydessä saatava token. Muistiinpano talletetaan tokenin identifioiman käyttäjän tekemien muistiinpanojen listaan:

```js
const jwt = require('jsonwebtoken') // highlight-line
const { SECRET } = require('../util/config') // highlight-line

// highlight-start
const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      console.log(authorization.substring(7))
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch (error){
      console.log(error)
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }

  next()
}
// highlight-end

router.post('/', tokenExtractor, async (req, res) => { // highlight-line
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

Backendimme toimii tällä hetkellä virheidenkäsittelyä lukuun ottamatta lähes samalla tavalla kuin osan 4 versio samasta sovelluksesta. Ennen kun teemme backendiin muutamia laajennuksia, muutetaan kaikkien muistiinpanojen sekä kaikkien käyttäjien routeja hieman.

Lisätään muistiinpanojen yhteyteen tieto sen lisänneestä käyttäjästä:

```js
router.get('/', async (req, res) => {
  // highlight-start
  const notes = await Note.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    }
  })
  // highlight-end
  res.json(notes)
})
```

Olemme myös [rajoittaneet](https://sequelize.org/master/manual/model-querying-basics.html#specifying-attributes-for-select-queries) minkä kenttien arvot haluamme. Muistiinpanoista otetaan kaikki muut kentät paitsi <i>userId</i> ja muistiinpanoon liittyvästä käyttäjästä ainoastaan <i>name</i> eli nimi.

Tehdään samantapainen muutos kaikkien käyttäjien reittiin, poistetaan käyttäjään liittyvistä muistiinpanoista turha kenttä <i>userId</i>:

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

Sovelluksen tämänhetkinen koodi on kokonaisuudessaan [GitHubissa](https://github.com/fullstack-hy/part13-notes/tree/part13-4), branchissa <i>part13-4</i>.

### Huomio modelien määrittelystä

Tarkkasilmäisimmät huomasivat, että sarakkeen <i>user_id</i> lisäämisestä huolimatta emme tehneet muutosta muistiinpanot määrittelevään modeliin, mutta voimme lisätä muistinpano-olioille käyttäjän:

```js
const user = await User.findByPk(req.decodedToken.id)
const note = await Note.create({ ...req.body, userId: user.id, date: new Date() })
```

Syynä tälle on se, että kun määrittelimme tiedostossa <i>models/index.js</i>, että käyttäjien ja muistiinpanojen välillä on yhdestä moneen -yhteys:

```js
const Note = require('./note')
const User = require('./user')

User.hasMany(Note)
Note.belongsTo(User)

// ...
```

luo Sequelize automaattisesti modeliin <i>Note</i> attribuutin <i>userId</i>, johon viittaamalla päästään käsiksi tietokannan sarakkeeseen <i>user_id</i>.

Huomaa, että voisimme luoda muistiinpanon myös seuraavasti metodin [build](https://sequelize.org/master/class/lib/model.js~Model.html#static-method-build) avulla:

```js
const user = await User.findByPk(req.decodedToken.id)

// luodaan muistiinpano tallettamatta sitä vielä
const note = Note.build({ ...req.body, date: new Date() })
 // sijoitetaan käyttäjän id mustiinpanolle
note.userId = user.id
// talletetaan muistiinpano-olio tietokantaan
await note.save()
```

Näin näemme eksplisiittisesti sen, että <i>userId</i> on muistiinpano-olion attribuutti.


Voisimme määritellä saman <i>myös</i> modeliin:

```js
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
  },
  // highlight-start
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  }
  // highlight-end
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'note'
})

module.exports = Note
```

tämä ei kuitenkaan ole välttämätöntä. Model-luokkien tasolla tapahtuva määrittely

```js
User.hasMany(Note)
Note.belongsTo(User)
```

sen sijaan on välttämätön, muuten Sequelize ei osaa koodin tasolla liittää tauluja toisiinsa.

</div>

<div class="tasks">

### Tehtävät 13.8.-13.12.

#### Tehtävä 13.8.

Lisää sovellukseen tuki käyttäjille. Käyttäjillä on tunnisteen lisäksi seuraavat kentät:

- name (merkkijono, ei saa olla tyhjä)
- username (merkkijono, ei saa olla tyhjä)

Toisin kuin materiaalissa älä nyt estä Sequelizea luomasta käyttäjille [aikaleimoja](https://sequelize.org/master/manual/model-basics.html#timestamps) <i>created\_at</i> ja <i>updated\_at</i>

Kaikilla käyttäjillä voi olla sama salasana materiaalin tapaan. Voit myös halutessasi toteuttaa salasanan kunnolla [osan 4](/osa4/kayttajien_hallinta) tapaan.

Toteuta seuraavat routet

- _POST api/users_ (uuden käyttäjän lisäys)
- _GET api/users_ (kaikkien käyttäjien listaus)
- _PUT api/users/:username_ (käyttäjän nimen muutos, huomaa että parametrina ei ole id vaan käyttäjätunnus)

Varmista, että Sequelizen automaattisesti asettamat aikaleimat <i>created\_at</i> ja <i>updated\_at</i> toimivat oikein kun luot käyttäjän ja muutat käyttäjän nimeä.

#### Tehtävä 13.9.

Sequelize tarjoaa joukon valmiiksi määriteltyjä [validointeja](https://sequelize.org/master/manual/validations-and-constraints.html) modelien kentille, jotka se suorittaa ennen olioiden tallentamista tietokantaan.

Päätetään muuttaa käyttäjätunnuksen luontiperiaatetta siten, että käyttäjätunnukseksi kelpaa ainoastaan validi emailosoite. Tee tunnuksen luomisen yhteyteen validointi, joka tarkastaa asian.

Muuta virheidenkäsittelymiddlewarea siten, että se antaa tilanteessa kuvaavamman virheilmoituksen (esim. hyödyntäen Sequelizen virheeseen liittyvää viestiä):

```js
{
    "error": [
        "Validation isEmail on username failed"
    ]
}
```

#### Tehtävä 13.10.

Laajenna sovellusta siten, että blogi liitetään tokenin perusteella identifioitavalle kirjautuneelle käyttäjälle. Joudut siis toteuttamaan myös tokenin palauttavan kirjautumisesta huolehtivan endpointin _POST /api/login_

#### Tehtävä 13.11.

Tee blogin poisto mahdolliseksi ainoastaan blogin lisänneelle käyttäjälle.

#### Tehtävä 13.12.

Muokkaa blogien ja käyttäjien routea siten, että blogien yhteydessä näytetään tieto blogin lisänneestä käyttäjästä, ja käyttäjän yhteydessä tiedot käyttäjien blogeista.

</div>

<div class="content">

### Lisää kyselyitä

Toistaiseksi sovelluksemme on ollut kyselyiden suhteen hyvin yksinkertainen, kyselyt ovat hakeneet joko yksittäisen rivin pääavaimeen perustuen metodia [findByPk](https://sequelize.org/master/class/lib/model.js~Model.html#static-method-findByPk) käyttäen tai ne ovat hakeneet metodilla [findAll](https://sequelize.org/master/class/lib/model.js~Model.html#static-method-findAll) taulun kaikki rivit. Nämä riittävät sovellukselle osassa 5 tehdylle frontendille, mutta laajennetaan backendia siten, että pääsemme myös harjoittelemaan hieman monimutkaisempien kyselyjen tekemistä.

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

Nyt backendilta voidaan hakea tärkeät muistiinpanot reitiltä /api/notes?important=true ja ei-tärkeät reitiltä /api/notes?important=false

Sequelizen generoima SQL-kysely sisältää luonnollisesti palautettavia rivejä rajaavan where-määreen:

```sql
SELECT "note"."id", "note"."content", "note"."important", "note"."date", "user"."id" AS "user.id", "user"."name" AS "user.name"
FROM "notes" AS "note" LEFT OUTER JOIN "users" AS "user" ON "note"."user_id" = "user"."id"
WHERE "note"."important" = true;
```

Ikävä kyllä tämä toteutus ei toimi jos haettaessa ei olla kiinnostuneita onko muistiinpano tärkeä vai ei, eli jos pyyntö tehdään osoitteeseen http://localhost:3001/api/notes. Korjaus voidaan tehdä monella tapaa. Eräs, mutta ei kenties paras tapa tehdä korjaus olisi seuraavassa:

```js
const { Op } = require('sequelize') // highlight-line

router.get('/', async (req, res) => {
  // highlight-start
  let important = {
    [Op.in]: [true, false]
  }

  if ( req.query.important ) {
    important = req.query.important === "true"
  }
  // highlight-end

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

Olio <i>important</i> tallettaa nyt kyselyn ehdon. Se on oletusarvoisesti

```js
where: {
  important: {
    [Op.in]: [true, false]
  }
}
```

eli sarake <i>important</i> voi olla arvoltaan <i>true</i> tai <i>false</i>. Käytössä on yksi monista Sequelizen operaatioista [Op.in](https://sequelize.org/master/manual/model-querying-basics.html#operators). Jos query-parametri <i>req.query.important</i> on määritelty, muuttuu kysely jompaankumpaan muotoon

```js
where: {
  important: true
}
```

tai

```js
where: {
  important: false
}
```

riippuen query-parametrin arvosta.

Tietokantaan on saattanut päästä note-rivejä joiden kentällä <i>important</i> ei ole arvoa. Näitä eivät ylläolevien muutosten jälkeen enää pysty kannasta hakemaan. Annetaan tietokantakonsolista puuttuville tärkeyksille jotkut arvot, ja muutetaan skeemaa siten, että tärkeys tulee pakolliseksi:

```js
Note.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    important: {
      type: DataTypes.BOOLEAN,
      allowNull: false, // highlight-line
    },
    date: {
      type: DataTypes.DATE,
    },
  },
  // ...
)
```

Laajennetaan toiminnallisuutta vielä siten, että muistiinpanoja haettaessa voidaan määritellä vaadittu hakusana, eli esim. tekemällä pyyntö http://localhost:3001/api/notes?search=database saadaan kaikki muistiinpanot, joissa mainitaan <i>database</i> tai pyynnöllä http://localhost:3001/api/notes?search=javascript&important=true saadaan kaikki tärkeäksi merkityt muistiinpanot, joissa mainitaan <i>javascript</i>. Toteutus on seuraavassa

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

Sequelizen [Op.substring](https://sequelize.org/master/manual/model-querying-basics.html#operators) muodostaa haluamamme kyselyn SQL:n like-avainsanaa käyttäen. Jos esim. teemme pyynnön http://localhost:3001/api/notes?search=database&important=true näemme että sen aikaansaama SQL-kysely on juuri olettamamme kaltainen.

```sql
SELECT "note"."id", "note"."content", "note"."important", "note"."date", "user"."id" AS "user.id", "user"."name" AS "user.name"
FROM "notes" AS "note" LEFT OUTER JOIN "users" AS "user" ON "note"."user_id" = "user"."id"
WHERE "note"."important" = true AND "note"."content" LIKE '%database%';
```

Sovelluksessamme on vielä sellainen kauneusvirhe, että jos teemme pyynnön http://localhost:3001/api/notes eli haluamme kaikki muistiinpanot, toteutuksemme aiheuttaa kyselyyn turhan wheren, joka saattaa (riippuen tietokantamoottorin toteutuksesta) vaikuttaa tarpeettomasti kyselyn tehokkuuteen:

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

Sovelluksen tämänhetkinen koodi on kokonaisuudessaan [GitHubissa](https://github.com/fullstack-hy/part13-notes/tree/part13-5), branchissa <i>part13-5</i>.

</div>

<div class="tasks">

### Tehtävät 13.13.-13.16

#### Tehtävä 13.13.

Toteuta sovellukseen kaikki blogit palauttavaan reittiin filtteröinti hakusanan perusteella. Filtteröinti toimii seuraavasti
- _GET /api/blogs?serch=react_ palauttaa ne blogit joiden kentässä <i>title</i> esiintyy hakusana <i>react</i>, hakusana on epäcasesensitiivinen
- _GET /api/blogs_ palauttaa kaikki blogit


[Tämä](https://sequelize.org/master/manual/model-querying-basics.html#operators) lienee hyödyksi tässä ja seuraavassa tehtävässä.
#### Tehtävä 13.14.

Laajenna filtteriä siten, että se etsii hakusanaa kentistä <i>title</i> ja <i>author</i>, eli

_GET /api/blogs?serch=jami_ palauttaa ne blogit joiden kentässä <i>title</i> tai kentässä <i>author</i> esiintyy hakusana <i>jami</i>
#### Tehtävä 13.15.

Muokkaa blogien reittiä siten, että se palauttaa blogit tykkäysten perusteella laskevassa järjestyksessä. Etsi [dokumentaatiosta](https://sequelize.org/master/manual/model-querying-basics.html) ohjeet järjestämiselle.

#### Tehtävä 13.16.

Tee sovellukselle reitti /api/authors, joka palauttaa kustakin authorista blogien lukumäärän sekä tykkäysten yhteenlasketun määrän. Toteuta operaatio suoraan tietokannan tasolla. Tarvitset suurella todennäköisyydellä [group by](https://sequelize.org/master/manual/model-querying-basics.html#grouping)-toiminnallisuutta, sekä [sequelize.fn](https://sequelize.org/master/manual/model-querying-basics.html#specifying-attributes-for-select-queries)-aggregaattorifunktiota.

Reitin palauttama JSON voi näyttää esim. seuraavalta:

```js
[
  {
    author: "Martin Fowler",
    blogs: "2",
    likes: "10"
  },
  {
    author: "Robert C. Martin",
    blogs: "1",
    likes: "0"
  },
  {
    author: "Cam Jackson",
    blogs: "1",
    likes: "2"
  },
  {
    author: "Dan Abramov",
    blogs: "3",
    likes: "7"
  }
]
```

Bonustehtävä: järjestä palautettava data tykkäysten perusteella, tee järjestäminen tietokantakyselyssä.

</div>
