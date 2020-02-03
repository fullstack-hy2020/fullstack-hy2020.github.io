---
mainImage: ../../../images/part-5.svg
part: 5
letter: d
lang: fi
---

<div class="content">

### Sovelluksen end to end -testaus

Palataan vielä hetkeksi testauksen pariin. Aiemmissa osissa teimme sovelluksille yksikkötestejä sekä integraatiotestejä. Katsotaan nyt erästä tapaa tehdä [järjestelmää kokonaisuutena](https://en.wikipedia.org/wiki/System_testing) tutkivia <i>End to End (E2E) -testejä</i>.

Web-sovellusten E2E-testaus tapahtuu käyttäen selainta jonkin kirjaston avulla. Ratkaisuja on tarjolla useita, esim. [Selenium](http://www.seleniumhq.org/), joka mahdollistaa testien automatisoinnin lähes mitä tahansa selainta käyttäen.

Tämän kurssin [edellisessä versiossa](https://fullstackopen.github.io/osa7/) E2E-testeihin käytettiin [puppeteer](https://pptr.dev/)-kirjastoa, joka tarjoaa suoran rajapinnan [chrome](https://developers.google.com/web/updates/2017/04/headless-chrome)-selaimen käyttöön ns. [headless](https://en.wikipedia.org/wiki/Headless_browser)-moodissa eli siten että selain ei näytä ollenkaan ollenkaan graafista käyttöliittymää.

Vaikka Websovellusten E2E on ollut teknologioiden puolesta mahdollista jo yli kymmenen vuotta, erityisesti Single Page App(SPA) -periaatteella toteutettujen sovellusten testaaminen on ollut valitettavan hankalaa. SPA-testit ovat usein olleet epäluotettavia eli englanniksi [flaky](https://hackernoon.com/flaky-tests-a-war-that-never-ends-9aa32fdef359): osa testeistä on mennyt välillä läpi ja välillä ei, vaikka koodi olisi ollut muuttumaton.

Vuoden 2018 aikana [Cypress](https://www.cypress.io/)-niminen kirjasto on nopeasti kasvattanut suosiotaan E2E-testauksessa. Cypress on poikkeuksellisen helppokäyttöinen, tunkkauksen määrä esim. Seleniumin käyttöön verrattuna on lähes olematon. Cypressin toimintaperiaate poikkeaa radikaalisti useimmista E2E-testaukseen sopivista kirjastoista, sillä Cypress-testit ajetaan kokonaisuudessaan selaimen sisällä. Muissa lähestymistavoissa testit suoritetaan Node-prosessissa, joka on yhteydessä selaimeen sen tarjoamien ohjelmointirajapintojen kautta.


Tehdään muutamia testejä osissa 2-5 kehitetylle muistiinpanosovellukselle.

Asennetaan cypress

```js
npm install --save-dev cypress
```

ja määritellään npm-skripti käynnistämistä varten.

```js
{
  // ...
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "server": "json-server -p3001 db.json",
    "cypress:open": "cypress open"  // highlight-line
  },
  // ...
}
```

Cypress-testit olettavat että testattava järjestelmä on käynnissä kun testit suoritetaan.

Tehdään backendille npm-skripti jonka avulla se saadaan käynnistettyä siten, että <i>NODE\_ENV</i> saa arvon <i>test</i>

```js
{
  // ...
  "scripts": {
    "start": "cross-env NODE_ENV=production node index.js",
    "watch": "cross-env NODE_ENV=development nodemon index.js",
    "build:ui": "rm -rf build && cd ../../osa2/notes/ && npm run build --prod && cp -r build ../../osa3/backend/",
    "deploy": "git push heroku master",
    "deploy:full": "npm run build:ui && git add . && git commit -m uibuild && git push && npm run deploy",
    "logs:prod": "heroku logs --tail",
    "lint": "eslint .",
    "test": "cross-env NODE_ENV=test jest --verbose --runInBand",
    "start:test": "cross-env NODE_ENV=test node index.js" // highlight-line
  },
  // ...
}
```

Kun backend ja frontend ovat käynnissä, voidaan käynnistää Cypress komennolla


```js
npm run cypress:open
```

Sovellukselle tulee hakemisto <i>cypress</i> jonka alihakemistoon <i>integrations</i> on tarkoitus sijoittaa testit. Cypress luo valmiiksi joukon esimerkkitestejä, poistetaan ne ja luodaan ensimmäinen oma testi tiedostoon <i>note_app_spec.js</i>:

```js
describe('Note ', function() {
  it('front page can be opened', function() {
    cy.visit('http://localhost:3000')
    cy.contains('Notes')
  })
})
```

Testin suoritus avaa selaimen ja näyttää miten sovellus käyttäytyy testin edetessä:

![](../../images/7/37e.png)

Testi näyttää rakenteen puolesta melko tutulta. <i>describe</i>-lohkoja käytetään samaan tapaan kuin Jestissä ryhmittelemään yksittäisiä testitapauksia, jotka on määritelty <i>it</i>-metodin avulla. Nämä osat Cypress on lainannut sisäisesti käyttämältään [Mocha](https://mochajs.org/)-testikirjastolta. Mocha oli testikirjastojen vanha hallitsija, se on edelleen suosittu, mutta Jest on mennyt selvästi edelle. [visit](https://docs.cypress.io/api/commands/visit.html#Syntax) ja[contains](https://docs.cypress.io/api/commands/contains.html#Syntax) taas ovat Cypressin komentoja, joiden merkitys on aika ilmeinen.

Olisimme voineet määritellä testin myös käyttäen nuolifunktioita

```js
describe('Note app', () => { // highlight-line
  it('front page can be opened', () => { // highlight-line
    cy.visit('http://localhost:3000')
    cy.contains('Notes')
  })
})
```

Mochan dokumentaatio kuitenkin [suosittelee](https://mochajs.org/#arrow-functions) että nuolifunktioita ei käytetä, ne saattavat aiheuttaa ongelmia joissain tilanteissa.

Jos contains ei löydä sivulta etsimäänsä tekstiä, testi ei mene läpi. Eli jos lisäämme seuraavan testin

```js
describe('Note app', function() {
  it('front page can be opened',  function() {
    cy.visit('http://localhost:3000')
    cy.contains('Notes')
  })

// highlight-start
  it('front page contains random text', function() {
    cy.visit('http://localhost:3000')
    cy.contains('wtf is this app?')
  })
// highlight-end
})
```

havaitsee Cypress ongelman

![](../../images/7/38e.png)

Laajennetaan testiä siten, että testi yrittää kirjautua sovellukseen. Aloitetaan kirjautumislomakkeen avaamisella.

```js
describe('Note app',  function() {
  // ...

  it('login form can be opened', function() {
    cy.visit('http://localhost:3000')
    cy.contains('log in')
      .click()
  })
})
```

Testi hakee ensin napin sen sisällön perusteella ja klikaa nappia komennolla [click](https://docs.cypress.io/api/commands/click.html#Syntax).

Koska molemmat testit aloittavat samalla tavalla, eli avaamalla sivun <i>http://localhost:3000</i>, kannattaa yhteinen osa eristää ennen jokaista testiä suoritettavaan <i>beforeEach</i>-lohkoon:

```js
describe('Note app', function() {
  // highlight-start
  beforeEach(function() {
    cy.visit('http://localhost:3000')
  })
  // highlight-end

  it('front page can be opened', function() {
    cy.contains('Notes')
  })

  it('login form can be opened', function() {
    cy.contains('log in')
      .click()
  })
})
```

Ilmoittautumislomake sisältää kaksi <i>input</i>-kenttää, joihin testin tulisi kirjoittaa.

Komento [get](https://docs.cypress.io/api/commands/get.html#Syntax) mahdollistaa elementtien etsimisen CSS-selektorien avulla.

Voimme hakea lomakkeen ensimmäisen ja viimeisen input-kentän ja kirjoittaa niihin komennolla [type](https://docs.cypress.io/api/commands/type.html#Syntax) seuraavasti:

```js
it('user can login', function () {
  cy.contains('log in')
    .click()
  cy.get('input:first')
    .type('mluukkai')
  cy.get('input:last')
    .type('salainen')
  cy.contains('login')
    .click()
  cy.contains('Matti Luukkainen logged in')
})  
```

Testi toimii mutta on kuitenkin sikäli ongelmallinen, että jos sovellukseen tulee jossain vaiheessa lisää input-kenttiä testi saattaa hajota, sillä se luottaa tarvitsemiensa kenttien olevan ensimmäisenä ja viimeisenä.

Parempi (mutta ei kuitenkaan dokumentaation mukaan täysin [optimaali](https://docs.cypress.io/guides/references/best-practices.html#Selecting-Elements)) ratkaisu on määritellä kentille yksilöivät <i>id</i>-attribuutit ja hakea kentät testeissä niiden perusteella. Eli laajennetaan kirjautumislomaketta seuraavasti

```js
const LoginForm = ({ ... }) => {
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          username
          <input
            id='username'  // highlight-line
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          password
          <input
            id='password' // highlight-line
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
      </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}
```

Testi muuttuu muotoon

```js
describe('Note app',  function() {
  // ..
  it('user can login', function() {
    cy.contains('log in')
      .click()
    cy.get('#username')  // highlight-line
      .type('mluukkai')
    cy.get('#password')  // highlight-line
      .type('salainen')
    cy.contains('login')
      .click()
    cy.contains('Matti Luukkainen logged in')
  })
})
```

Luodaan vielä testi, joka lisää sovellukseen uuden muistiinpanon:

```js
describe('Note app', function() {
  // ..
  describe('when logged in', function() {
    beforeEach(function() {
      cy.contains('log in')
        .click()
      cy.get('#username')
        .type('mluukkai')
      cy.get('#password')
        .type('salainen')
      cy.contains('login')
        .click()
    })

    it('name of the user is shown', function() {
      cy.contains('Matti Luukkainen logged in')
    })

    // highlight-start
    it('a new note can be created', function() {
      cy.contains('new note')
        .click()
      cy.get('input')
        .type('a note created by cypress')
      cy.contains('save')
        .click()
      cy.contains('a note created by cypress')
    })
    // highlight-end
  })
})
```

Koska kaksi testeistä luottaa siihen että käyttäjä on kirjautunut, on niiden yhteinen osa jälleen eriytetty <i>beforeEach</i> osaan. Testi luottaa siihen, että uutta muistiinpanoa luotaessa sivulla on ainoastaan yksi input-kenttä, eli se hakee kentän seuraavasti

```js
cy.get('input')
```

jos kenttiä on useampia, testi hajoaa

![](../../images/7/39e.png)

Tämän takia olisi jälleen parempi lisätä lomakkeen kentälle <i>id</i> ja hakea kenttä testissä id:n perusteella.

### Tietokannan tilan kontrollointi

Jos testatessa on tarvetta muokata tietokantaa, muuttuu tilanne heti haastavammaksi. Ideaalitilanteessa testauksen tulee aina lähteä liikkeelle samasta alkutilasta, jotta testeistä saadaan luotettavia ja helposti toistettavia.

Yleinen ratkaisu on nollata tietokanta ja mahdollisesti alustaa se sopivasti aina ennen testien suorittamista. E2E-testauksessa lisähaasteen luo se, että testeistä ei ole mahdollista päästä suoraan käsiksi tietokantaan.


Ratkaistaan ongelma luomalla backendiin testejä varten API endpoint, jonka avulla testit voivat tarvittaessa nollata kannan. Tehdään testejä varten oma <i>router</i>

```js
const router = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')

router.post('/reset', async (request, response) => {
  await Note.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = router
```

ja lisätään se backendiin ainoastaan <i>jos sovellusta suoritetaan test-moodissa</i>:

```js
// ...

app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/notes', notesRouter)

// highlight-start
if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}
// highlight-end

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
```

eli lisäyksen jälkeen HTTP POST -operaatio backendin endpointiin <i>/api/testing/reset</i> tyhjentää tietokannan.

Backendin testejä varten muokattu koodi on kokonaisuudessaan [githubissa](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part7-1), branchissä <i>part7-1</i>.

Tällä hetkellä sovelluksen käyttöliittymän ei ole mahdollista luoda käyttäjiä järjestelmään. Testien alustuksessa on siis suoraan luotava testikäyttäjä backendiin.

```js
describe('Note app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset') // highlight-line
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)  // highlight-line
    cy.visit('http://localhost:3000')
  })

  it('front page can be opened', function() {
    cy.contains('Notes')
  })
})
```

Testi tekee alustuksen aikana HTTP-pyyntöjä backendiin komennolla [request](https://docs.cypress.io/api/commands/request.html). Siirretään aiemmin tehty uuden muistiinpanon testi describe-lohkon sisälle:

```js
describe('Note app', function() {
  // ...

  describe('when logged in', function() {
    beforeEach(function() {
      cy.contains('log in')
        .click()
      cy.get('#username')
        .type('mluukkai')
      cy.get('#password')
        .type('salainen')
      cy.contains('login')
        .click()
    })

    it('name of the user is shown', function() {
      cy.contains('Matti Luukkainen logged in')
    })

    it('a new note can be created', function() {
      cy.contains('new note')
        .click()
      cy.get('input')
        .type('a note created by cypress')
      cy.contains('save')
        .click()
      cy.contains('a note created by cypress')
    })
  })
})
```

Toisin kuin aiemmin, nyt testaus alkaa aina samasta tilasta, eli tietokannassa on yksi käyttäjä ja ei yhtään muistinpanoa.

Tehdään vielä testi, joka tarkastaa että muistiinpanojen tärkeyttä voi muuttaa.  Muutetaan ensin sovelluksen frontendia siten, että uusi muistiinpano on oletusarvoisesti epätärkeä, eli kenttä <i>important</i> saa arvon <i>false</i>:

```js
const App = () => {
  // ...
  const addNote = (event) => {
    event.preventDefault()
    noteFormRef.current.toggleVisibility()
    const noteObject = {
      content: newNote,
      important: false  // highlight-line
    }

    noteService
      .create(noteObject).then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }

  // ...
}
```

On useita eri tapoja testata asia. Seuraavassa etsitään ensin muistiinpano ja klikataan sen nappia <i>make important</i>. Tämän jälkeen tarkistetaan että muistiinpano sisältää napin <i>make not important</i>.

```js
describe('Note app', function() {
  // ...

  describe('when logged in', function() {
    // ...

    describe('and a note is created', function () {
      beforeEach(function () {
        cy.contains('new note')
          .click()
        cy.get('input')
          .type('another note cypress')
        cy.contains('tallenna')
          .click()
      })

      it('it can be made important', function () {
        cy.contains('another note cypress')
          .contains('make important')
          .click()

        cy.contains('another note cypress')
          .contains('make not important')
      })
    })
  })
})
```

Testit ja frontendin koodi on kokonaisuudessaan [githubissa](https://github.com/fullstack-hy2020/part2-notes/tree/part7-1), branchissa <i>part7-1</i>.

Cypress tarjoaa melko hyvät mahdollisuudet testien [debuggaamiseen](https://docs.cypress.io/guides/getting-started/writing-your-first-test.html#Debugging). Testin kunkin vaiheen aikaista sovelluksen DOM:in tilaa on erittäin helppo tarkastella:

![](../../images/7/39e.png)

Cypressin dokumentaatio on poikkeuksellisen hyvä. Suosittelenkin lämpimästi Cypressin kokeilemista!

<div class="tasks">

### Tehtävät 5.16.-5.20.

#### 5.16: blogilistan end2end-testit, step1
#### 5.17: blogilistan end2end-testit, step1
#### 5.18: blogilistan end2end-testit, step1
#### 5.19: blogilistan end2end-testit, step1
#### 5.20: blogilistan end2end-testit, step1

Tämä oli osan viimeinen tehtävä ja on aika pushata koodi githubiin sekä merkata tehdyt tehtävät [palautussovellukseen](https://github.com/fullstack-hy2020).
</div>
