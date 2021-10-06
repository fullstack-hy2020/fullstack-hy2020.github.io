---
mainImage: ../../../images/part-13.svg
part: 13
letter: a
lang: fi
---

<div class="content">

Tässä osassa tutustutaan relaatiotietokantoja käyttäviin node-sovelluksiin. Osassa rakennetaan osista 3-5 tutulle muistiinpanosovellukselle relaatiotietokantaa käyttävä node-backend. Osan suorittaminen edellyttää kohtuullista relaatiotietokantojen ja SQL:n osaamista.Eräs paikka hankkia riittävä osaaminen on kurssi [Tietokantojen perusteet](https://tikape.mooc.fi/).

### Dokumenttitietokantojen edut ja haitat

Olemme käyttäneet kaikissa kurssin aiemmissa osissa MongoDB-tietokantaa. Mongo on tyypiltään [dokumenttitietokanta](https://en.wikipedia.org/wiki/Document-oriented_database) ja eräs sen ominaisimmista piirteistä on _skeemattomuus_, eli tietokanta ei ole kuin hyvin rajallisesti tietoinen siitä, minkälaista dataa sen kokoelmiin on talletettu. Tietokannan skeema on olemassa ainoastaan ohjelmakoodissa, joka tulkitsee datan tietyllä tavalla, esim. tunnistaen että jotkut kentät ovat viittauksia toisen kokoelman objekteihin.

Osien 3 ja 4 esimerkkisovelluksessa tietokantaan on talletettu muistiinpanoja ja käyttäjiä. 

Muistiinpanoja tallettava kokoelma 'notes' näyttää seuraavanlaiselta

```js
[
  {
    "_id": "600c0e410d10256466898a6c",
    "content": "HTML is easy"
    "date": 2021-01-23T11:53:37.292+00:00,
    "important": false
    "__v": 0
  },
  {
    "_id": "600c0edde86c7264ace9bb78",
    "content": "CSS is hard"
    "date": 2021-01-23T11:56:13.912+00:00,
    "important": true
    "__v": 0
  },
]
```

Käyttäjät tallettava kokoelma 'users' seuraavalta:

```js
[
  {
    "_id": "600c0e410d10256466883a6a",
    "username": "mluukkai",
    "name": "Matti Luukkainen",
    "passwordHash" : "$2b$10$Df1yYJRiQuu3Sr4tUrk.SerVz1JKtBHlBOARfY0PBn/Uo7qr8Ocou",
    "__v": 9,
    notes: [
      600c0edde86c7264ace9bb78,
      600c0e410d10256466898a6c
    ]
  },
]
```

MongoDB tuntee kyllä talletettujen olioiden kenttien tyypit, mutta sillä ei ole mitään tietoa siitä, minkä kokoelman olioihin käyttäjiin liittyvät muistiinpanojen id:t viittaavat. MongoDB ei myöskään välitä siitä, mitä kenttiä kokoelmiin talletettavilla olioilla on. MongoDB jättääkin täysin ohjelmoijan vastuulle sen, että tietokantaan talletetaan oikeanlaista tietoa.

Skeemattomuudesta on sekä etua että haittaa. Eräänä etuna on skeemattomuuden tuoma joustavuus, koska skeemaa ei tarvitse tietokantatasolla määritellä, voi sovelluskehitys olla tietyissä tapauksissa nopeampaa, ja helpompaa, skeeman määrittelyssä ja sen muutoksissa on jokatapauksessa nähtävä pieni määrä vaivaa. Skeemattomuuden ongelmat liittyvät virhealttiuteen, kaikki jää ohjelmoijan vastuulle, tietokannalla ei ole mitään mahdollisuuksia tarkistaa onko siihen talletettu data _eheää_, eli onko kaikilla pakollisilla kentillä arvot, viittaavatko viitetyyppiset kentät olemassaoleviin ja ylipäätään oikean tyyppisiin olioihin jne.

Tämän osan fokuksessa olevat relaatiotietokannat taas nojaavat vahvasti skeeman olemassaoloon, ja skeemallisten tietokantojen edut ja haitat ovat lähes päinvastaiset skeemattomiin verrattuna.

Syy sille miksi kurssin aiemmat osat käyttivät MongoDB:tä liittyvät juuri sen skeemattomuuteen, jonka ansiosta tietokannan käyttö on ollut relaatiotietokantoja käyttämättömälle hieman helpompaa. Useimpiin tämänkin kurssin käyttötapauksiin olisin itse valinnut relaatiotietokannan.

### Sovelluksen tietokanta

Tarvitsemme sovellustamme varten reelaatiotietokannan tietokannan. Vaihtoehtoja on monia, käytämmä tällä kurssilla tämän hetken suosituinta Open Source -ratkaisua [PostgreSQL:ää](https://www.postgresql.org/). Voit halutessasi asentaa Postgresin (kuten tietokantaa usein kutsutaan) koneellesi, helpommalla pääset käyttämällä jotain pilvipalveluna tarjottavaa postgresia, esim. [ElephantSQL:ää](https://www.elephantsql.com/). Voit myös hyödyntää kurssin [osan 12](/en/part12) oppeja ja käyttää Postgresia paikallisesti Dockerin avulla.

Käytämme nyt kuitenkin hyväkseen sitä, että osista 3 ja 4 tuttu pilvipalvelualusta Herokuun on mahdollista luoda sovellukselle Postgres-tietokanta. 

Tämän osan teoriamateriaalissa rakennetaan oissa 3 ja 4 rakennetun muistiinpanoja tallettavan sovelluksen backendendistä Postgresia käyttävä versio.

Luodaan nyt sopivan hakemiston sisällä heroku-sovellus, lisätään sille tietokanta ja katsotaan komennolla `heroku config` mikä on tietokantayhteyden muodostamiseen tarvittava <i>connect string</i>:

```bash
heroku create
heroku addons:create heroku-postgresql:hobby-dev
heroku config
=== cryptic-everglades-76708 Config Vars
DATABASE_URL: postgres://<username>:<password>@ec2-44-199-83-229.compute-1.amazonaws.com:5432/<db-name>
```

Erityisesti relaatiotietokantaa käytettäessä on oleellista päästä tietokantaan käsiksi myös suoraan. Tapoja tähän on monia, on olemasa mm. useita erilaisia graafisia käyttöliittymiä, kuten [pgAdmin](https://www.pgadmin.org/). Käytetään kuitenkin postgresin [pqsl](https://www.postgresql.org/docs/current/app-psql.html)-komentorivityökalua.

Tietokantaan päästään käsiksi suorittamalla `psql` herokun palvelimella seuraavasti (huomaa, että komennon parametrit riippuvat heroku-sovelluksen connect urlista):

```bash
heroku run psql -h ec2-44-199-83-229.compute-1.amazonaws.com -p 5432 -U <username> <dbname>
```

Salasanan antamisen jälkeen kokeillaan pslq:n tärkeintä komentoa `\d`, joka kertoo tietokannan sisällön:

```bash
Password for user <username>:
psql (13.4 (Ubuntu 13.4-1.pgdg20.04+1))
SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, bits: 256, compression: off)
Type "help" for help.

username=> \d
Did not find any relations.
```

Kuten arvata saattaa, tietokannassa ei ole mitään. 

Luodaan taulu muistiinpanoja varten:

```sql
CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    content text NOT NULL,
    important boolean,
    date time
);
```

_TODO: ehkä important kentälle DEFAULT FALSE, niin oletusarvojen määrittely tulee tutuksi_
  
Muutama huomio: sarake id on määritelty <i>pääavaimeksi</i> (engl. primary key), eli sarakkeen arvo tulee olla jokaisella taulun rivillä uniikki ja arvo ei saa olla tyhjä. Tyypiksi sarakkeelle on määritelty [SERIAL](https://www.postgresql.org/docs/9.1/datatype-numeric.html#DATATYPE-SERIAL), joka ei ole todellinen tyyppi vaan lyhennysmerkintä sille, että kyseessä on kokonaislukuarvoinen sarake, jolle Postgres antaa automaattisesti uniikin, kasvavan arvon rivejä luotaessa. Tekstiarvoiselle sarakkeelle <i>content</i> on määritelty siten, että sille on pakko antaa arvo.

Katsotaan tilannetta konsolista käsin. Ensin komento `\d`, joka kertoo mitä tauluja kannasa on:

```sql
username=> \d
                 List of relations
 Schema |     Name     |   Type   |     Owner
--------+--------------+----------+----------------
 public | notes        | table    | username
 public | notes_id_seq | sequence | username
(2 rows)
```

Taulun `notes` lisäksi Postgres loi aputaulun `notes_id_seq`, joka pitää kirjaa siitä, mikä arvo sarakkeelle `id` annetaan seuraavaksi. 

Komennolla `\d notes` näemme miten taulu `notes` on määritelty:

```sql
username=> \d notes;
                                     Table "public.notes"
  Column   |          Type          | Collation | Nullable |              Default
-----------+------------------------+-----------+----------+-----------------------------------
 id        | integer                |           | not null | nextval('notes_id_seq'::regclass)
 content   | text                   |           | not null |
 important | boolean                |           |          |
 date      | time without time zone |           |          |
Indexes:
    "notes_pkey" PRIMARY KEY, btree (id)
```

Sarakkeella `id` on siis oletusarvo (default), joka saadaan kutsumalla postgresin sisäistä funktiota `nextval`. 

Lisätään tauluun hieman sisältöä:

```sql
insert into notes (content, important) values ('Relational databases rule the world', true);
insert into notes (content, important) values ('MongoDB is webscale', false);
```
  
_TODO: kentän lisääminen, joka ei ole skeemassa. Näkyisi selkeesti skeema vs. ei-skeemaa_

Ja katsotaan miltä luotu sisältö näyttää:

```sql
username=> select * from notes;
 id |               content               | important | date
----+-------------------------------------+-----------+------
  1 | relational databases rule the world | t         |
  2 | MongoDB is webscale                 | f         |
(2 rows)
```

Seuraavaksi on aika siirtyä käyttämään tietokantaa sovelluksesta käsin.

### Relaatiotietokantaa käyttävä node-sovellus

Alustetaan sovellus tavalliseen tapaan komennolla <i>npm init</i> ja asennetaan sille kehitysaikaiseksi riippuvuudeksi 'nodemon' seka seuraavat suoritusaikaiset riippuvuudet:

```bash
npm install express dotenv pg sequelize
```

Näistä jälkimmäinen [sequelize](https://sequelize.org/master/) on kirjasto, jonka kautta käytämme Postgresia. Sequelize on niin sanottu [Object relational mapping](https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping) (ORM) -kirjasto, joka mahdollistaa JavaScript-olioiden tallentamisen relaatiotietokantaan ilman SQL-kielen käyttöä, samaan tapaan kuin MongoDB:n yhteydessä käyttämämme Mongoose-kirjasto.

Testataan että yhteyden muodostaminen onnistuu. Luodaan tiedosto `index.js` ja sille seuraava sisältö:

```js
require('dotenv').config()
const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
})

const main = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
    sequelize.close()
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
} 

main()
```

Komennon `heroku config` paljastama tietokannan <i>connect string</i> tulee tallentaa tiedostoon `.env`, jonka sisällön pitää siis olla suunilleen seuraava

```bash
$ cat .env
DATABASE_URL=postgres://<username>:<password>@ec2-54-83-137-206.compute-1.amazonaws.com:5432/<databasename>
```

Kokeillaan muodostuuko yhteys:

```bash
$ node index.js
Executing (default): SELECT 1+1 AS result
Connection has been established successfully.
```
Jos ja kun yhteys toimii, voimme tehdä ensimmäisen kyselyn. Muutetaan ohjelmaa seuraavasti:

```js
require('dotenv').config()
const { Sequelize, QueryTypes } = require('sequelize') // highlight-line

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});

const main = async () => {
  try {
    await sequelize.authenticate()
    // highlight-start
    const notes = await sequelize.query("SELECT * FROM notes", { type: QueryTypes.SELECT })
    console.log(notes)
    sequelize.close()
    // highlight-end
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
} 

main()
```

Sovelluksen suorituksen pitäisi tulostaa seuraavasti:

```js
Executing (default): SELECT * FROM notes
[
  {
    id: 1,
    content: 'Relational databases rule the world',
    important: true,
    date: null
  },
  {
    id: 2,
    content: 'MongoDB is webscale',
    important: false,
    date: null
  }
]
```

Vaikka sequelize on ORM-kirjasto, jota käyttämällä SQL:ää ei juurikaan ole tarvetta itse kirjoittaa, käytimme nyt [suoraan SQL:ää](https://sequelize.org/master/manual/raw-queries.html) sequelizen metodin [query](https://sequelize.org/master/class/lib/sequelize.js~Sequelize.html#instance-method-query) avulla.

Koska kaikki näyttää toimivan, muutetaan sovellus web-sovellukseksi.

```js
require('dotenv').config()
const { Sequelize, QueryTypes } = require('sequelize')
const express = require('express') // highlight-line
const app = express() // highlight-line

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});

// highlight-start
app.get('/api/notes', async (req, res) => {
  const notes = await sequelize.query("SELECT * FROM notes", { type: QueryTypes.SELECT })
  res.json(notes)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
// highlight-end
```

Sovellus näyttää toimivan. Siirrytään kuitenkin nyt käyttämään Sequelizeä SQL:n sijaan siten kuin sitä on tarkoitettu käyttää.

### Model

Sequelizea käytettäessä, jokaista tietokannan taulua edustaa [model](https://sequelize.org/master/manual/model-basics.html), joka on käytännössä oma JavaScript-luokkansa. Määritellän nyt sovellukselle taulua `notes` vastaava model `Note` muuttamalla koodi seuraavaan muotoon:

```js
require('dotenv').config()
const { Sequelize, Model, DataTypes } = require('sequelize') // highlight-line
const express = require('express')
const app = express()

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});

// highlight-start
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
// highlight-end

app.get('/api/notes', async (req, res) => {
  const notes = await Note.findAll() // highlight-line
  res.json(notes)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

Muutama kommentti koodista. Modelin `Note` määrittelyssä ei ole mitään kovin yllättävää, jokaiselle sarakkeelle on määritelty tyyppi, sekä tarvittaessa muut ominaisuudet, kuten se onko kyseessä taulun pääavain. Modelin määrittelyssä oleva toinen parametri sisältää `sequelize`-olion sekä muuta konfiguraatiotietoa. Märittelimme, että taululla ei ole usein käytettykä aikaleimasarakkeita (created\_at ja updated\_at).

_TODO: underscored: true ja sarakkeiden nimet_
  
Määrittelmimme myös, että taulujen nimet päätellään modelien nimistä "underscored"-tekniikalla. Käytännössä tämä tarkoittaa sitä, että jos modelin nimi on kuten tapauksessamme `Note` päätellän siitä, että vastaavan taulun nimi on pienellä alkukirjaimella kirjoitettu nimen monikko eli `notes`. Jos taas modelin nimi olisi "kaksiosainen" esim. `StudyGroup` olisi taulun nimi `study_groups`. Sequelize mahdollistaa automaattisen taulujen nimien päättelun sijaan myös eksplisiittisesti määriteltävät taulujen nimet. 

Olemme myös määritelleet `modelName: 'note'`, oletusarvoinen "modelin nimi" olisi isolla kirjoitettu `Note`, haluamme kuitenkin pienen alkukirjaimen, se tekee muutaman asian jatkossa hieman mukavammaksi.

Tietokantaoperaatio on helppo tehdä modelien tarjoaman [kyselyrajapinnan](https://sequelize.org/master/manual/model-querying-basics.html) avulla, metodi `findAll` toimii juuri kuten sen nimen perusteella olettaa toimivan:

```js
app.get('/api/notes', async (req, res) => {
  const notes = await Note.findAll() // highlight-line
  res.json(notes)
})
```

Konsoli kertoo että metodikutsu <i>Note.findAll()</i> aiheuttaa seuraavan kyselyn:

```js
Executing (default): SELECT "id", "content", "important", "date" FROM "notes" AS "note";
```

Toteutetaan seuraavaksi endpoint uusien muistiinpanojen luomiseen:

```js
app.use(express.json())

// ...

app.post('/api/notes', async (req, res) => {
  console.log(req.body)
  const note = await Note.create(req.body)
  res.json(note)
})
```

Uuden muistiinpanon luominen siis tapahtuu kutsumalla modelin `Note` metodia [create](https://sequelize.org/master/manual/model-querying-basics.html#simple-insert-queries) ja antamalla sille parametriksi sarakkeiden arvot määrittelevän olion.

Metodin <i>create</i> sijaan tietokantaan tallentaminen [olisi mahdollista tehdä](https://sequelize.org/master/manual/model-instances.html#creating-an-instance) käyttäen ensin metodia [build](https://sequelize.org/master/class/lib/model.js~Model.html#static-method-build) luomaan halutusta datasta Model-olio, ja kutsumalla sille metodia [save](https://sequelize.org/master/class/lib/model.js~Model.html#instance-method-save):

```js
const note = Note.build(req.body)
await note.save()
```

Metodin <i>build</i> kutsuminen ei tallenna vielä olioa tietokantaan, joten olioa on vielä mahdollista muokata ennen varsinaista talletustapahtumaa:

```js
const note = Note.build(req.body)
note.important = true // highlight-line
await note.save()
```

Esimerkkikoodin käyttötapaukseen metodi [create](https://sequelize.org/master/manual/model-querying-basics.html#simple-insert-queries) sopii paremmin, joten pidättäydytää siinä.

Jos luotava olio ei ole validi, on seurauksena virheilmoitus. Esim. yritettäessä luoda muistiinpano ilman sisältöä
operaatio epäonnistuu, ja konsoli paljastaa syyn olevan `SequelizeValidationError: notNull Violation Note.content cannot be null`:

```
(node:39109) UnhandledPromiseRejectionWarning: SequelizeValidationError: notNull Violation: Note.content cannot be null
    at InstanceValidator._validate (/Users/mluukkai/opetus/fs-psql/node_modules/sequelize/lib/instance-validator.js:78:13)
    at processTicksAndRejections (internal/process/task_queues.js:93:5)
```

Lisätään uuden muistiinpanon lisäämisen yhteyteen vielä yksinkertainen virheenkäsittely:

```js
app.post('/api/notes', async (req, res) => {
  try {
    const note = await Note.create(req.body)
    return res.json(note)
  } catch(error) {
    return res.status(400).json({ error })
  }
})
```

<div class="tasks">

### Tehtävät 13.1.-13.3.

Teemme tämän osan tehtävissä [osan 4](/osa4) tehtävien kanssa samanlaisen blogi-sovelluksen backendin, jonka pitäisi olla virheenkäsittelyä lukuunottamatta yhteensopiva [osan 5](/osa5) frontendin kanssa. Teemme backendiin myös joukon ominaisuuksia, joita osassa 5 tehty fronend ei osaa hyödyntää.

#### Tehtävä 13.1.

Tee sovellukselle GitHub-repositorio ja luo sen sisällä sovellusta varten heroku-sovellus sekä Postgres-tietokanta. Varmista, että saat luotua yhteyden sovellusken tietokantaan.

#### Tehtävä 13.2.

Luo sovellukselle komentoriviltä taulu <i>blogs</i> jolla on seuraavat sarakkeet
- id (uniikki, kasvava id)
- author (merkkijono)
- url (merkkijono joka ei voi olla tyhjä)
- title (merkkijono joka ei voi olla tyhjä)
- likes (kokonaisluku jolla oletusarvo nolla)

Lisää tietokantaan ainakin kaksi blogia

#### Tehtävä 13.3.

Tee sovellukseen komentoriviltä käytettävä toiminnallisuus, joka tulostaa tietokannassa olevat blogit, esim. seuraavasti:

```bash
$ node cli.js
Executing (default): SELECT * FROM blogs
Dan Abramov: 'On let vs const', 0 likes
Laurenz Albe: 'Gaps in sequences in PostgreSQL', 0 likes
```

</div>

<div class="content">

### Tietokantataulujen automaattinen luominen

Sovelluksessamme on nyt yksi ikävä puoli, se olettaa että täsmälleen oikean skeeman omaava tietokanta on olemassa, eli että taulu `notes` on luotu sopivalla `create table` -komennolla.

Koska ohjelmakoodi säilytetään Githubissa, olisi järkevää säilyttää myös tietokannan luovat komennot ohjelmakoodin yhteydessä, jotta tietokannan skeema on varmasti sama mitä ohjelmakoodi odottaa. Sequelize pystyy itseasiassa generoimaan skeeman automaattisesti modelien määritelmästä modelien metodin [sync](https://sequelize.org/master/manual/model-basics.html#model-synchronization) avulla. 

Tuhotaan nyt tietokanta konsolista käsin antamalla seuraava komento:

```
drop table notes;
```

Koment `\d` paljastaa että taulu on hävinnyt tietokannasta:

```
username=> \d
Did not find any relations.
```

Sovellus ei enää toimi. 

Lisätään sovellukseen seuraava komento heti modelin `Note` määrittelyn jälkeen:

```js
Note.sync()
```

Kun sovellus käynnistyy, tulostuu konsoliin seuraava:

```
Executing (default): CREATE TABLE IF NOT EXISTS "notes" ("id"  SERIAL , "content" TEXT NOT NULL, "important" BOOLEAN, "date" TIMESTAMP WITH TIME ZONE, PRIMARY KEY ("id"));
```

Eli sovelluksen käynnistyessä suoritetaan komento `CREATE TABLE IF NOT EXISTS "notes"...` joka luo taulun `notes` jos se ei jo ole olemassa.

### Muut operaatiot

Täydennetään sovellusta vielä muutamalla operaatiolla. 

Yksittäisen muistiinpanon etsiminen onnistuu metodilla [findByPk](https://sequelize.org/master/manual/model-querying-finders.html) koska se haetaan pääavaimena toimivan id:n perusteella:

```js
app.get('/api/notes/:id', async (req, res) => {
  const note = await Note.findByPk(req.params.id)
  if (note) {
    res.json(note)
  } else {
    res.status(404).end()
  }
})
```

Yksittäisen muistiinpanon hakeminen aiheuttaa seuraavanlaisen SQL-komennon:

```
Executing (default): SELECT "id", "content", "important", "date" FROM "notes" AS "note" WHERE "note"."id" = '1';
```

Jos muistiinpanoa ei löydy, palauttaa operaation `null`, ja tässä tapauksessa annetaan asiaan kuuluva statuskoodi.

Muistiinpanon muuttaminen tapahtuu seuraavasti. Tuetaan ainoastaan kentän `important` muutosta, sillä sovelluksen frontend ei muuta tarvitse:

```js
app.put('/api/notes/:id', async (req, res) => {
  const note = await Note.findByPk(req.params.id)
  if (note) {
    note.important = req.body.important
    await note.save()
    res.json(note)
  } else {
    res.status(404).end()
  }
})
```

Tietokantariviä vastaava olio haetaan kannasta `findByPk`-metodilla, olioon tehdään muutos ja lopputulos tallennetaan kutsumalla tietokantariviä vastaavan olion metodia `save`.

Sovelluksen tämänhetkinen koodi on kokonaisuudessaan [githubissa](https://github.com/fullstack-hy/part122-notes/tree/part12-1), branchissa <i>part12-1</i>.

### Sequelizen palauttamien olioiden tulostaminen konsoliin

JavaScript-ohjelmoijan tärkein apuväline on <i>console.log</i>, jonka aggressiivinen käyttö saa pahimmatkin bugit kuriin. Lisätään yksittäisen muistiinpanon reittiin konsolitulostus:


```js
app.get('/api/notes/:id', async (req, res) => {
  const note = await Note.findByPk(req.params.id)
  if (note) {
    console.log(note) // highlight-line
    res.json(note)
  } else {
    res.status(404).end()
  }
})
```

Huomaamme, että lopputulos ei ole ihan se mitä odotimme:

```js
note {
  dataValues: {
    id: 1,
    content: 'Notes are attached to a user',
    important: true,
    date: 2021-10-03T15:00:24.582Z,
  },
  _previousDataValues: {
    id: 1,
    content: 'Notes are attached to a user',
    important: true,
    date: 2021-10-03T15:00:24.582Z,
  },
  _changed: Set(0) {},
  _options: {
    isNewRecord: false,
    _schema: null,
    _schemaDelimiter: '',
    raw: true,
    attributes: [ 'id', 'content', 'important', 'date' ]
  },
  isNewRecord: false
}
```

Muistiinpanon tietojen lisäksi konsoliin tulostuu kaikenlaista muutakin. Pääsemme toivottuun lopputulokseen kutsumalla model-olion metodia [toJSON](https://sequelize.org/master/class/lib/model.js~Model.html#instance-method-toJSON):


```js
app.get('/api/notes/:id', async (req, res) => {
  const note = await Note.findByPk(req.params.id)
  if (note) {
    console.log(note.toJSON()) // highlight-line
    res.json(note)
  } else {
    res.status(404).end()
  }
})
```

Nyt lopputulos on juuri se mitä haluamme.

```js
{
  id: 1,
  content: 'Notes are attached to a user',
  important: true,
  date: 2021-10-03T15:00:24.582Z,
  userId: 1
}
```

Jos kyse on kokoelmallisesta olioita, ei metodi toJson toimi suoraan, metodia on kutsuttava erikseen jokaiselle kokoelman oliota: 

```js
router.get('/', async (req, res) => {
  const notes = await Note.findAll()

  console.log(notes.map(n=>n.toJSON())) // highlight-line

  res.json(notes)
})
```

Ehkä parempi ratkaisu on kuitenkin muuttaa kokoelma JSON:iksi tulostamista varten: 

```js
router.get('/', async (req, res) => {
  const notes = await Note.findAll()

  console.log(JSON.stringify(notes)) // highlight-line

  res.json(notes)
})
```

Tämä tapa on parempi erityisesti jos kokoelman oliot sisältävät muita olioita. Usein on myös hyödyllistä muotoilla oliot ruudulle hieman lukijaystävällisempään muotoon. Tämä onnistuu komennolla:

```json
console.log(JSON.stringify(notes, null, 2)) 
```

</div>

<div class="tasks">

### Tehtävä 13.4.

#### Tehtävä 13.4.

Muuta sovelluksesi web-sovellukseksi, joka seuraavia operaatioita

- GET api/blogs (kaikkien blogien listaus)
- POST api/blogs (uuden blogin lisäys)
- DELETE api/blogs/:id (blogin poisto)

</div>