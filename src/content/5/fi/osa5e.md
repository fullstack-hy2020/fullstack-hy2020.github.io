---
mainImage: ../../../images/part-5.svg
part: 5
letter: e
lang: fi
---

<div class="content">

[Playwright](https://playwright.dev/)... ero Cypressiin

TODO: [Cypress](https://www.cypress.io/)-niminen E2E-testaukseen soveltuva kirjasto on kasvattanut nopeasti suosiotaan viimeisten vuosien aikana. Cypress on poikkeuksellisen helppokäyttöinen, kaikenlaisen säätämisen ja tunkkaamisen määrä esim. Seleniumin käyttöön verrattuna on lähes olematon. Cypressin toimintaperiaate poikkeaa radikaalisti useimmista E2E-testaukseen sopivista kirjastoista, sillä Cypress-testit ajetaan kokonaisuudessaan selaimen sisällä. Muissa lähestymistavoissa testit suoritetaan Node-prosessissa, joka on yhteydessä selaimeen  ohjelmointirajapintojen kautta.


### Testien alustaminen

Toisin kuin React-frontille tehdyt yksikkötestit tai backendin tekstit, nyt tehtävien End to End -testien ei ei tarvitse sijaita samassa npm-projektissa missä koodi on. Tehdään nyt E2E-testeille kokonaan oma projekti komennolla _npm init_.  Asennetaan sitten Playwright suorittamalla suorittamalla uuden projektin hakemisstossa komento

```js
npm init playwright@latest
```

Asennusskripti kysyy muutamaa kysymystä, vastataan niihin seuraavasti:

```
$ npm init playwright@latest
Getting started with writing end-to-end tests with Playwright:
Initializing project in '.'
✔ Do you want to use TypeScript or JavaScript? · JavaScript
✔ Where to put your end-to-end tests? · tests
✔ Add a GitHub Actions workflow? (y/N) · false
✔ Install Playwright browsers (can be done manually via 'npx playwright install')? (Y/n) · true
```

Määritellään npm-skripti testien suorittamista sekä testiraportteja varten
```js
{
  // ...
  "scripts": {
    "test": "playwright test",
    "test:report": "playwright show-report"
  },
  // ...
}
```

Asennuksen yhteydessä konsoliin tulostui

```
And check out the following files:
  - ./tests/example.spec.js - Example end-to-end test
  - ./tests-examples/demo-todo-app.spec.js - Demo Todo App end-to-end tests
  - ./playwright.config.js - Playwright Test configuration
```

eli asennus valmiiksi muutaman esimerkkitestin. Suoritetaan testit:

```
$ npm test

> notes-e2e@1.0.0 test
> playwright test


Running 6 tests using 5 workers
  6 passed (3.9s)

To open last HTML report run:

  npx playwright show-report
```

Testit menevät läpi. Tarkempi testiraportti voidaa avata joko tulostuksen ehdottamalla komennolla, tai äsken määrittelemällämme npm-skriptillä:

```
npm run test:report
```

Testit voidaan myös suorittaa graafisen UI:n kautta komennolla

```
npm run test -- --ui
```

Esimerkkitestit näyttävät seuraavanlaisilta:

```js
const { test, expect } = require('@playwright/test');

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
```

Testit siis testaavat osoitteessa https://playwright.dev/ olevaa sivua.

### Oman koodin testaaminen

Poistetaan nyt esimerkkitestit ja aloitetaan oman sovelluksemme testaaminen.

Playwright-testit olettavat että testattava järjestelmä on käynnissä kun testit suoritetaan, eli toisin kuin esim. backendin integraatiotestit, Playwright-testit <i>eivät käynnistä</i> testattavaa järjestelmää testauksen yhteydessä.

Tehdään <i>backendille</i> npm-skripti, jonka avulla se saadaan käynnistettyä testausmoodissa, eli siten, että <i>NODE\_ENV</i> saa arvon <i>test</i>.

```js
{
  // ...
  "scripts": {
    "start": "NODE_ENV=production node index.js",
    "dev": "NODE_ENV=development nodemon index.js",
    "build:ui": "rm -rf build && cd ../frontend/ && npm run build && cp -r build ../backend",
    "deploy": "fly deploy",
    "deploy:full": "npm run build:ui && npm run deploy",
    "logs:prod": "fly logs",
    "lint": "eslint .",
    "test": "NODE_ENV=test node --test",
    "start:test": "NODE_ENV=test node index.js" // highlight-line
  },
  // ...
}
```

Käynnistetään frontend ja backend, ja luodaan sovellukselle ensimmäinen testi tiedotoon _tests/note_app.spec.js_:

```js
const { test, expect } = require('@playwright/test')

test('front page can be opened', async ({ page }) => {
  await page.goto('http://localhost:5173')

  const locator = await page.getByText('Notes')
  await expect(locator).toBeVisible()
  await expect(await page.getByText('Note app, Department of Computer Science, University of Helsinki 2023')).toBeVisible()
})
```

Ensin testi avaa sovelluksen metodilla [page.goto](https://playwright.dev/docs/writing-tests#navigation).

Tämän jälkeen testi etsii metodilla [page.getByText](https://playwright.dev/docs/api/class-page#page-get-by-text) [lokaattorin](https://playwright.dev/docs/api/class-locator) joka vastaa elementtiä missä esiintyy teksti _Notes_. 

Metodilla [toBeVisible](https://playwright.dev/docs/api/class-locatorassertions#locator-assertions-to-be-visible) varmistetaan, että lokaattoria vastaava elementti on renderöitynä näkyville.

Toinen tarkistus tehdään ilman apumuuttujan käyttöä.

Huomaamme, että vuosi on vaihtunut. Muutetaankin testiä seuraavasti:

```js
const { test, expect } = require('@playwright/test')

test('front page can be opened', async ({ page }) => {
  await page.goto('http://localhost:5173')

  const locator = await page.getByText('Notes')
  await expect(locator).toBeVisible()
  await expect(await page.getByText('Note app, Department of Computer Science, University of Helsinki 2023')).toBeVisible() // highlight-line
})
```

Kuten arvata saattaa, testi ei mene läpi. Playwright avaa testiraportin selaimeen ja siitä käy selväksi, että Playwright on itseasiassa suorittanut testit kolmella eri selaimella Chromella, yhden Firefoxilla sekä Webkitillä eli esim. Safarin käyttämällä selaimoottorilla:

![](../../images/5/play2.png)

Klikkaamalla jonkin selaimen raporttia näemme tarkemman virheilmoituksen:

![](../../images/5/play3.png)

Isossa kuvassa on tietysti oikein hyvä asia että testaus tapahtuu kaikilla kolmella selainmoottorilla, mutta tämä on hidasta, ja testejä kehittäessä kannattaa ehkä suorittaa pääosin vain yhdellä selaimella. Käytettävän selainmoottorin määrittely onnistuu komenentoriviparametrilla:

```js
npm test -- --project chromium
```

Korjataan nyt koodista virheen aiheuttanut vanhentunut vuosiluku.

Ennen kuin jatkamme, lisätään vielä testeihin _describe_-lohko:

```js
const { test, describe, expect } = require('@playwright/test')

describe('Note app', () => {
  test('front page can be opened', async ({ page }) => {
    await page.goto('http://localhost:5173')

    const locator = await page.getByText('Notes')
    await expect(locator).toBeVisible()
    await expect(page.getByText('Note app, Department of Computer Science, University of Helsinki 2024')).toBeVisible()
  })
})
```

Ennen kuin mennään eteenpäin, rikotaan testit vielä kertaalleen. Huomaamme, että testien suoritus on melko nopeaa kuin testit menevät läpi, mutta erittäin hidasta jos testit eivät mene läpi. Syynä tälle on se, että Playwrightin toimintaperiaatteena on odottaa etsittyjä elementtejä kunnes [ne ovat renderöityjä ja toimintaan valmiita](https://playwright.dev/docs/actionability). Jos elementtiä ei löydy, seurauksena on _TimeoutError_ ja testi ei mene läpi. Playwright odottaa elementtejä oletusarvoisesti 30 sekunnin ajan. Testejä kehitettäessä voi olla viisaampaa pienentää odotettavaa aikaa muutamaan sekuntiin. [Dokumentaation](https://playwright.dev/docs/test-timeouts) mukaan tämä onnistuu muuttamalla tiedostoa _playwright.config.js_ seuraavasti:

```js
module.exports = defineConfig({
  timeout: 3000,
  fullyParallel: false, // highlight-line
  // ...
})
```

Teimme tiedostoon toisenkin muutoksen, määrittelimme että testitiedostossa olevat testit [suoritetaan yksi kerrallaan](https://playwright.dev/docs/test-parallel#parallelize-tests-in-a-single-file). Oletusarvoisella konfiguraatiolla suoritus tapahtuu rinnakkain, ja koska testimme käyttävät tietokantaa, rinnakkainen suoritus aiheuttaa ongelmia.

### Lomakkeelle kirjoittaminen

Laajennetaan testejä siten, että testi yrittää kirjautua sovellukseen. Oletetaan että backendin tietokantaan on tallennettu käyttäjä, jonka käyttäjätunnus on <i>mluukkai</i> ja salasana <i>salainen</i>. 

Aloitetaan kirjautumislomakkeen avaamisella.

```js
describe('Note app', () => {
  // ...

  test('login form can be opened', async ({ page }) => {
    await page.goto('http://localhost:5173')

    await page.getByRole('button', { name: 'log in' }).click()
  })
})
```

Testi hakee ensin funktion [getByRole](https://playwright.dev/docs/api/class-page#page-get-by-role) avulla napin sen tekstin perusteella. Funktio palauttaa Button-elemennttiä vastaavan [Locatorin](https://playwright.dev/docs/api/class-locator). Napin painaminen suoritetaan Locatorin metodilla [click](https://playwright.dev/docs/api/class-locator#locator-click)

Testejä kehitettäessä kannattaa käyttää Playwrightin [UI-moodia](https://playwright.dev/docs/test-ui-mode), eli käyttöliittymällistä versiota. Käynnistetään testit UI-moodissa seuraavasti:

```
npm test -- --ui
```

Näeme nyt että testi löytää napin 

![](../../images/5/play4.png)

Klikkauksen jälkeen lomake tulee näkyviin

![](../../images/5/play4.png)

Kun lomake on avattu, testin tulisi etsiä siitä teksikentät ja kirjoittaa niihin käyttäjätunnus sekä salasana. Tehdään ensimmäinen yritys funktiota [page.getByRole](https://playwright.dev/docs/api/class-page#page-get-by-role) käyttäen:

```js
describe('Note app', () => {
  // ...

  test('login form can be opened', async ({ page }) => {
    await page.goto('http://localhost:5173')

    await page.getByRole('button', { name: 'log in' }).click()
    await page.getByRole('textbox').fill('mluukkai')
  })
})
```

Seurauksena on virheilmoitus:

```
Error: locator.fill: Error: strict mode violation: getByRole('textbox') resolved to 2 elements:
  1) <input value=""/> aka locator('div').filter({ hasText: /^username$/ }).getByRole('textbox')
  2) <input value="" type="password"/> aka locator('input[type="password"]')
```

Ongelmana on nyt se, että _getByRole_ löytää kaksi tekstikenttää, ja medotin [fill](https://playwright.dev/docs/api/class-locator#locator-fill) ei onnistu. Eräs tapa kiertää ongelma on käyttää metodjena [first](https://playwright.dev/docs/api/class-locator#locator-first) ja [last](https://playwright.dev/docs/api/class-locator#locator-last) tekstikentät:

```js
describe('Note app', () => {
  // ...

  test('login form can be opened', async ({ page }) => {
    await page.goto('http://localhost:5173')

    await page.getByRole('button', { name: 'log in' }).click()
    await page.getByRole('textbox').first().fill('mluukkai')
    await page.getByRole('textbox').last().fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()
  
    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
  })
})
```

Kirjoitettuaan tekstikenttiin, testi painaa nappia _login_ ja tarkastaa, että sovellus renderöi kirjaantuneen käyttäjän tiedot ruudulle. 

Testi toimii mutta on kuitenkin sikäli ongelmallinen, että jos sovellukseen tulee jossain vaiheessa lisää input-kenttiä, testi saattaa hajota, sillä se luottaa tarvitsemiensa kenttien olevan sivulla ensimmäisenä ja viimeisenä.

Parempi ratkaisu on määritellä kentille yksilöivät testausta varten generoidut id-attribuutit ja hakea kentät testeissä niiden perusteella hyväksikäytten funktiota [getByTestId](https://playwright.dev/docs/api/class-page#page-get-by-test-id).

Eli laajennetaan kirjautumislomaketta seuraavasti

```js
const LoginForm = ({ ... }) => {
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          username
          <input
            data-testid='username'  // highlight-line
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          password
          <input
            data-testid='password' // highlight-line
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button type="submit">
          login
        </button>
      </form>
    </div>
  )
}
```

Testi muuttuu muotoon

```js
describe('Note app', () => {
  // ...

  test('login form can be opened', async ({ page }) => {
    await page.goto('http://localhost:5173')

    await page.getByRole('button', { name: 'log in' }).click()
    await page.getByTestId('username').fill('mluukkai') // highlight-line
    await page.getByTestId('password').fill('salainen')  // highlight-line
  
    await page.getByRole('button', { name: 'login' }).click() 
  
    await expect(await page.getByText('Matti Luukkainen logged in')).toBeVisible()
  })
})
```

Huomaa, että testin läpimeno tässä vaiheessa edellyttää, että backendin ympäristön <i>test</i> tietokannassa on käyttäjä, jonka username on <i>mluukkai</i> ja salasana <i>salainen</i>. Luo käyttäjä tarvittaessa!

### Testien alustus

Koska molemmat testit aloittavat samalla tavalla, eli avaamalla sivun <i>http://localhost:5173</i>, kannattaa yhteinen osa eristää ennen jokaista testiä suoritettavaan <i>beforeEach</i>-lohkoon:

```js
const { test, describe, expect, beforeEach } = require('@playwright/test')

describe('Note app', () => {
  // highlight-start
  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })
  // highlight-end

  test('front page can be opened', async ({ page }) => {
    const locator = await page.getByText('Notes')
    await expect(locator).toBeVisible()
    await expect(await page.getByText('Note app, Department of Computer Science, University of Helsinki 2024')).toBeVisible()
  })

  test('login form can be opened', async ({ page }) => {
    await page.getByRole('button', { name: 'log in' }).click()
    await page.getByTestId('username').fill('mluukkai')
    await page.getByTestId('password').fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()
    await expect(await page.getByText('Matti Luukkainen logged in')).toBeVisible()
  })
})

```

### Muistiinpanojen luomisen testaus

Luodaan seuraavaksi testi, joka lisää sovellukseen uuden muistiinpanon:

```js
const { test, describe, expect, beforeEach } = require('@playwright/test')

describe('Note app', () => {
  // ...

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'log in' }).click()
      await page.getByTestId('username').fill('mluukkai')
      await page.getByTestId('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new note can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new note' }).click()
      await page.getByRole('textbox').fill('a note created by playwright')
      await page.getByRole('button', { name: 'save' }).click()
      await expect(await page.getByText('a note created by playwright')).toBeVisible()
    })
  })  
})

```

Testi on määritelty omana <i>describe</i>-lohkonaan. Muistiinpanon luominen edellyttää että käyttäjä on kirjaantuneena, ja kirjautuminen hoidetaan <i>beforeEach</i>-lohkossa. 

Testi luottaa siihen, että uutta muistiinpanoa luotaessa sivulla on ainoastaan yksi input-kenttä, eli se hakee kentän seuraavasti

```js
page.getByRole('textbox')
```

Jos kenttiä olisi useampia, testi hajoaisi Tämän takia olisi jälleen parempi lisätä lomakkeen kentälle testi-id ja hakea kenttä testissä id:n perusteella.

Testien rakenne näyttää seuraavalta:

```js
const { test, describe, expect, beforeEach } = require('@playwright/test')

describe('Note app', () => {
  // ....

  test('user can log in', async ({ page }) => {
    await page.getByRole('button', { name: 'log in' }).click()
    await page.getByTestId('username').fill('mluukkai')
    await page.getByTestId('password').fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()
    await expect(await page.getByText('Matti Luukkainen logged in')).toBeVisible()
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'log in' }).click()
      await page.getByTestId('username').fill('mluukkai')
      await page.getByTestId('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new note can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new note' }).click()
      await page.getByRole('textbox').fill('a note created by playwright')
      await page.getByRole('button', { name: 'save' }).click()
      await expect(await page.getByText('a note created by playwright')).toBeVisible()
    })
  })  
})

```

Playwright suorittaa testit siinä järjestyksessä, missä ne ovat testikoodissa. Eli ensin suoritetaan testi <i>user can log in</i>, missä käyttäjä kirjautuu sovellukseen, ja tämän jälkeen suoritetaan testi <i>a new note can be created</i>, jonka <i>beforeEach</i>-lohkossa myös suoritetaan kirjautuminen. Miksi näin tehdään, eikö käyttäjä jo ole kirjaantuneena aiemman testin ansiosta? Ei, sillä <i>jokaisen</i> testin suoritus alkaa selaimen kannalta "nollatilanteesta", kaikki edellisten testien selaimen tilaan tekemät muutokset nollaantuvat.

### Tietokannan tilan kontrollointi

Jos testatessa on tarvetta muokata palvelimen tietokantaa, muuttuu tilanne heti haastavammaksi. Ideaalitilanteessa testauksen tulee aina lähteä liikkeelle palvelimen tietokannan suhteen samasta alkutilanteesta, jotta testeistä saadaan luotettavia ja helposti toistettavia.

Kuten yksikkö- integraatiotesteissä, on myös E2E-testeissä paras ratkaisu nollata tietokanta ja mahdollisesti alustaa se sopivasti aina ennen testien suorittamista. E2E-testauksessa lisähaasteen tuo se, että testeistä ei ole mahdollista päästä suoraan käsiksi tietokantaan.

Ratkaistaan ongelma luomalla backendiin testejä varten API-endpoint, jonka avulla testit voivat tarvittaessa nollata kannan. Tehdään testejä varten oma <i>router</i>

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

eli lisäyksen jälkeen HTTP POST ‑operaatio backendin endpointiin <i>/api/testing/reset</i> tyhjentää tietokannan.

Backendin testejä varten muokattu koodi on kokonaisuudessaan [GitHubissa](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part5-1), branchissä <i>part5-1</i>.

Muutetaan nyt testien <i>beforeEach</i>-alustuslohkoa siten, että se nollaa palvelimen tietokannan aina ennen testien suorittamista.

Tällä hetkellä sovelluksen käyttöliittymän kautta ei ole mahdollista luoda käyttäjiä, luodaankin testien alustuksessa testikäyttäjä suoraan backendiin:

```js
describe('Note app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http:localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })
  
  test('front page can be opened',  () => {
    // ...
  })

  test('user can login', () => {
    // ...
  })

  describe('when logged in', () => {
    // ...
  })
})
```

Testi tekee alustuksen aikana HTTP-pyyntöjä backendiin parametrin _request_ metodilla [post](https://playwright.dev/docs/api/class-apirequestcontext#api-request-context-post). 

Toisin kuin aiemmin, nyt testaus alkaa nyt myös backendin suhteen aina hallitusti samasta tilanteesta, eli tietokannassa on yksi käyttäjä ja ei yhtään muistiinpanoa.

Tehdään vielä testi, joka tarkastaa että muistiinpanojen tärkeyttä voi muuttaa.

On useita eri tapoja testata asia. 

Seuraavassa etsitään ensin muistiinpano ja klikataan sen nappia <i>make not important</i>. Tämän jälkeen tarkistetaan että muistiinpano sisältää napin <i>make important</i>.

```js
describe('Note app', () => {
  // ...

  describe('when logged in', () => {
    // ...

    describe('and a note exists', () => {
      beforeEach(async ({ page }) => {
        await page.getByRole('button', { name: 'new note' }).click()
        await page.getByRole('textbox').fill('another note by playwright')
        await page.getByRole('button', { name: 'save' }).click()
        await expect(await page.getByText('another note by playwright')).toBeVisible()
      })
  
      test('it can be made important', async ({ page }) => {
        await page.getByRole('button', { name: 'make not important' }).click()
        await expect(await page.getByText('make important')).toBeVisible()
      })
  })
})
```

Ensimmäinen komento etsii ensin komponentin, missä on teksti <i>another note cypress</i> ja sen sisältä painikkeen <i>make not important</i> ja klikkaa sitä. 

Toinen komento varmistaa, että saman napin teksti on vaihtunut muotoon <i>make important</i>.

Testit ja frontendin tämänhetkinen koodi on kokonaisuudessaan [GitHubissa](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-9), branchissa <i>part5-9</i>.

### Epäonnistuneen kirjautumisen testi

Tehdään nyt testi joka varmistaa, että kirjautumisyritys epäonnistuu jos salasana on väärä.

Cypress suorittaa oletusarvoisesti aina kaikki testit, ja testien määrän kasvaessa se alkaa olla aikaavievää. Uutta testiä kehitellessä tai rikkinäistä testiä debugatessa voidaan määritellä testi komennon <i>it</i> sijaan komennolla <i>it.only</i>, jolloin Cypress suorittaa ainoastaan sen testin. Kun testi on valmiina, voidaan <i>only</i> poistaa.

Testin ensimmäinen versio näyttää seuraavalta:

```js
describe('Note app', function() {
  // ...

  it.only('login fails with wrong password', function() {
    cy.contains('log in').click()
    cy.get('#username').type('mluukkai')
    cy.get('#password').type('wrong')
    cy.get('#login-button').click()

    cy.contains('wrong credentials')
  })

  // ...
)}
```

Testi siis varmistaa komennon [cy.contains](https://docs.cypress.io/api/commands/contains.html#Syntax) avulla, että sovellus tulostaa virheilmoituksen.

Sovellus renderöi virheilmoituksen CSS-luokan <i>error</i> sisältävään elementtiin:

```js
const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error"> // highlight-line
      {message}
    </div>
  )
}
```

Voisimmekin tarkentaa testiä varmistamaan, että virheilmoitus tulostuu nimenomaan oikeaan paikkaan, eli CSS-luokan <i>error</i> sisältävään elementtiin:


```js
it('login fails with wrong password', function() {
  // ...

  cy.get('.error').contains('wrong credentials') // highlight-line
})
```

Eli ensin etsitään komennolla [cy.get](https://docs.cypress.io/api/commands/get.html#Syntax) CSS-luokan <i>error</i> sisältävä komponentti ja sen jälkeen varmistetaan että virheilmoitus löytyy sen sisältä. Huomaa, että [luokan CSS-selektori](https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors) alkaa pisteellä, eli luokan <i>error</i> selektori on <i>.error</i>.

Voisimme tehdä saman myös käyttäen [should](https://docs.cypress.io/api/commands/should.html)-syntaksia:

```js
it('login fails with wrong password', function() {
  // ...

  cy.get('.error').should('contain', 'wrong credentials') // highlight-line
})
```

Shouldin käyttö on jonkin verran "hankalampaa" kuin komennon <i>contains</i>, mutta se mahdollistaa huomattavasti monipuolisemmat testit kuin pelkän tekstisisällön perusteella toimiva <i>contains</i>. 

Lista yleisimmistä shouldin kanssa käytettävistä assertioista on [täällä](https://docs.cypress.io/guides/references/assertions.html#Common-Assertions).

Voimme esim. varmistaa, että virheilmoituksen väri on punainen, ja että sen ympärillä on border:

```js
it('login fails with wrong password', function() {
  // ...

  cy.get('.error').should('contain', 'wrong credentials') 
  cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
  cy.get('.error').should('have.css', 'border-style', 'solid')
})
```

Värit on määriteltävä Cypressille [rgb](https://rgbcolorcode.com/color/red)-koodeina.

Koska kaikki tarkastukset kohdistuvat samaan komennolla [cy.get](https://docs.cypress.io/api/commands/get.html#Syntax) haettuun elementtiin, ne voidaan ketjuttaa komennon [and](https://docs.cypress.io/api/commands/and.html) avulla:

```js
it('login fails with wrong password', function() {
  // ...

  cy.get('.error')
    .should('contain', 'wrong credentials')
    .and('have.css', 'color', 'rgb(255, 0, 0)')
    .and('have.css', 'border-style', 'solid')
})
```
Viimeistellään testi vielä siten, että se varmistaa myös, että sovellus ei renderöi onnistunutta kirjautumista kuvaavaa tekstiä <i>'Matti Luukkainen logged in'</i>:

```js
it('login fails with wrong password', function() {
  cy.contains('log in').click()
  cy.get('#username').type('mluukkai')
  cy.get('#password').type('wrong')
  cy.get('#login-button').click()

  cy.get('.error')
    .should('contain', 'wrong credentials')
    .and('have.css', 'color', 'rgb(255, 0, 0)')
    .and('have.css', 'border-style', 'solid')

  cy.get('html').should('not.contain', 'Matti Luukkainen logged in') // highlight-line
})
```

Komentoa <i>should</i> käytetään useimmiten ketjutettuna komennon <i>get</i> (tai muun vastaavan ketjutettavissa olevan komennon) perään. Testissä käytetty <i>cy.get('html')</i> tarkoittaa käytännössä koko sovelluksen näkyvillä olevaa sisältöä.

Saman asian olisi myös voinut tarkastaa ketjuttamalla komennon <i>contains</i> perään komento <i>should</i> hieman toisenlaisella parametrilla:

```js
cy.contains('Matti Luukkainen logged in').should('not.exist')
```

### Operaatioiden tekeminen käyttöliittymän "ohi"

Sovelluksemme testit näyttävät tällä hetkellä seuraavalta:

```js 
describe('Note app', function() {
  it('user can login', function() {
    cy.contains('log in').click()
    cy.get('#username').type('mluukkai')
    cy.get('#password').type('salainen')
    cy.get('#login-button').click()

    cy.contains('Matti Luukkainen logged in')
  })

  it('login fails with wrong password', function() {
    // ...
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.contains('log in').click()
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()
    })

    it('a new note can be created', function() {
      // ... 
    })
   
  })
})
```

Ensin siis testataan kirjautumistoimintoa. Tämän jälkeen omassa describe-lohkossa on joukko testejä, jotka olettavat että käyttäjä on kirjaantuneena, kirjaantuminen hoidetaan alustuksen tekevän <i>beforeEach</i>-lohkon sisällä. 

Kuten aiemmin jo todettiin, jokainen testi suoritetaan alkutilasta, eli vaikka testi on koodissa alempana, se ei aloita samasta tilasta mihin ylempänä koodissa olevat testit ovat jääneet!  

Cypressin dokumentaatio neuvoo meitä seuraavasti: [Fully test the login flow – but only once](https://docs.cypress.io/guides/getting-started/testing-your-app.html#Logging-in). Eli sen sijaan että tekisimme <i>beforeEach</i>-lohkossa kirjaantumisen lomaketta käyttäen, suosittelee Cypress että kirjaantuminen tehdään [UI:n ohi](https://docs.cypress.io/guides/getting-started/testing-your-app.html#Bypassing-your-UI), tekemällä suoraan backendiin kirjaantumista vastaava HTTP-operaatio. Syynä tälle on se, että suoraan backendiin tehtynä kirjautuminen on huomattavasti nopeampi kuin lomakkeen täyttämällä. 

Tilanteemme on hieman monimutkaisempi kuin Cypressin dokumentaation esimerkissä, sillä kirjautumisen yhteydessä sovelluksemme tallettaa kirjautuneen käyttäjän tiedot localStorageen. Sekin toki onnistuu. Koodi on seuraavassa

```js 
describe('when logged in', function() {
  beforeEach(function() {
    // highlight-start
    cy.request('POST', 'http://localhost:3001/api/login', {
      username: 'mluukkai', password: 'salainen'
    }).then(response => {
      localStorage.setItem('loggedNoteappUser', JSON.stringify(response.body))
      cy.visit('http://localhost:5173')
    })
    // highlight-end
  })

  it('a new note can be created', function() {
    // ...
  })

  // ...
})
```

Komennon [cy.request](https://docs.cypress.io/api/commands/request.html) tulokseen päästään käsiksi _then_-metodin avulla sillä sisäiseltä toteutukseltaan <i>cy.request</i> kuten muutkin Cypressin komennot ovat [eräänlaisia promiseja](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#Commands-Are-Promises). Käsittelijäfunktio tallettaa kirjautuneen käyttäjän tiedot localStorageen ja lataa sivun uudelleen. Tämän jälkeen käyttäjä on kirjautuneena sovellukseen samalla tavalla kuin jos kirjautuminen olisi tapahtunut kirjautumislomakkeen täyttämällä.

Jos ja kun sovellukselle kirjoitetaan lisää testejä, joudutaan kirjautumisen hoitavaa koodia soveltamaan useassa paikassa. Koodi kannattaakin eristää itse määritellyksi [komennoksi](https://docs.cypress.io/api/cypress-api/custom-commands.html).

Komennot määritellään tiedostoon <i>cypress/support/commands.js</i>. Kirjautumisen tekevä komento näyttää seuraavalta:

```js 
Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', 'http://localhost:3001/api/login', {
    username, password
  }).then(({ body }) => {
    localStorage.setItem('loggedNoteappUser', JSON.stringify(body))
    cy.visit('http://localhost:5173')
  })
})
```

Komennon käyttö on helppoa, testi yksinkertaistuu ja selkeytyy:

```js 
describe('when logged in', function() {
  beforeEach(function() {
    // highlight-start
    cy.login({ username: 'mluukkai', password: 'salainen' })
    // highlight-end
  })

  it('a new note can be created', function() {
    // ...
  })

  // ...
})
```

Sama koskee oikeastaan myös uuden muistiinpanon luomista. Sitä varten on olemassa testi, joka luo muistiinpanon lomakkeen avulla. Myös muistiinpanon tärkeyden muuttamista testaavan testin <i>beforeEach</i>-alustuslohkossa luodaan muistiinpano lomakkeen avulla: 

```js
describe('Note app', function() {
  // ...

  describe('when logged in', function() {
    it('a new note can be created', function() {
      cy.contains('new note').click()
      cy.get('input').type('a note created by cypress')
      cy.contains('save').click()

      cy.contains('a note created by cypress')
    })

    describe('and a note exists', function () {
      beforeEach(function () {
        cy.contains('new note').click()
        cy.get('input').type('another note cypress')
        cy.contains('save').click()
      })

      it('it can be made important', function () {
        // ...
      })
    })
  })
})
```

Eristetään myös muistiinpanon lisääminen omaksi komennoksi, joka tekee lisäämisen suoraan HTTP POST:lla:

```js
Cypress.Commands.add('createNote', ({ content, important }) => {
  cy.request({
    url: 'http://localhost:3001/api/notes',
    method: 'POST',
    body: { content, important },
    headers: {
      'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loggedNoteappUser')).token}`
    }
  })

  cy.visit('http://localhost:5173')
})
```

Komennon suoritus edellyttää, että käyttäjä on kirjaantuneena sovelluksessa ja käyttäjän tiedot talletettuna sovelluksen localStorageen.

Testin alustuslohko yksinkertaistuu seuraavasti:

```js
describe('Note app', function() {
  // ...

  describe('when logged in', function() {
    it('a new note can be created', function() {
      // ...
    })

    describe('and a note exists', function () {
      beforeEach(function () {
        // highlight-start
        cy.createNote({
          content: 'another note cypress',
          important: true
        })
        // highlight-end
      })

      it('it can be made important', function () {
        // ...
      })
    })
  })
})
```

Testeissämme on vielä eräs ikävä piirre. Sovelluksen osoite <i>http:localhost:5173</i> on kovakoodattuna moneen kohtaan.

Määritellään sovellukselle <i>baseUrl</i> Cypressin valmiiksi generoimaan [konfiguraatiotiedostoon](https://docs.cypress.io/guides/references/configuration) <i>cypress.config.js</i>:

```js
const { defineConfig } = require("cypress")

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
    },
    baseUrl: 'http://localhost:5173' // highlight-line
  },
})
```

Kaikki testeissä olevat sovelluksen osoitetta käyttävät komennot

```js
cy.visit('http://localhost:5173')
```

voidaan muuttaa muotoon

```js
cy.visit('')
```

Testeihin jää edelleen backendin kovakoodattu osoite <i>http://localhost:3001</i>. Muut testien käyttämät osoitteet Cypressin [dokumentaatio](https://docs.cypress.io/guides/guides/environment-variables) kehoittaa määrittelemään ympäristömuutujina.

Laajennetaan konfiguraatiotiedostoa <i>cypress.config.js</i> seuraavasti:

```js
const { defineConfig } = require("cypress")

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
    },
    baseUrl: 'http://localhost:5173',
  },
  // highlight-start
  env: {
    BACKEND: 'http://localhost:3001/api'
  }
  // highlight-end
})
```

Korvataan testeistä kaikki backendin osoitteet seuraavaan tapaan

```js
describe('Note ', function() {
  beforeEach(function() {
    cy.visit('')
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`) // highlight-line
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user) // highlight-line
  })
  // ...
})
```

Testit ja frontendin koodi on kokonaisuudessaan [GitHubissa](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-10), branchissa <i>part5-10</i>.

### Muistiinpanon tärkeyden muutos

Tarkastellaan vielä aiemmin tekemäämme testiä, joka varmistaa että muistiinpanon tärkeyttä on mahdollista muuttaa. Muutetaan testin alustuslohkoa siten, että se luo yhden sijaan kolme muistiinpanoa:

```js
describe('when logged in', function() {
  describe('and several notes exist', function () {
    beforeEach(function () {
      // highlight-start
      cy.createNote({ content: 'first note', important: false })
      cy.createNote({ content: 'second note', important: false })
      cy.createNote({ content: 'third note', important: false })
      // highlight-end
    })

    it('one of those can be made important', function () {
      cy.contains('second note')
        .contains('make important')
        .click()

      cy.contains('second note')
        .contains('make not important')
    })
  })
})
```

Miten komento [cy.contains](https://docs.cypress.io/api/commands/contains.html) tarkalleen ottaen toimii?

Kun klikkaamme komentoa _cy.contains('second note')_ Cypressin [test runnerista](https://docs.cypress.io/guides/core-concepts/test-runner.html) nähdään, että komento löytää elementin, jonka sisällä on teksti <i>second note</i>:

![Klikatessa vasemmalla olevasta testisteppien listasta komentoa, renderöityy oikealle sovelluksen sen hetkinen tila, missä löydetty elementti on merkattuna korostettuna.](../../images/5/34new.png)

Klikkaamalla seuraavaa riviä _.contains('make important')_, nähdään että löydetään nimenomaan 
<i>second note</i>:a vastaava tärkeyden muutoksen tekevä nappi:

![Klikatessa vasemmalla olevasta testisteppien listasta komentoa, korostuu oikealle valintaa vastaava nappi](../../images/5/35new.png)

Peräkkäin ketjutettuna toisena oleva <i>contains</i>-komento siis <i>jatkaa</i> hakua ensimmäisen komennon löytämän komponentin sisältä.

Jos emme ketjuttaisi komentoja, eli olisimme kirjoittaneet 

```js
cy.contains('second note')
cy.contains('make important').click()
```

tulos olisi ollut aivan erilainen, toinen rivi painaisi väärän muistiinpanon nappia: 

![Renderöityy virhe AssertionError: Timed out retrying after 4000ms: Expected to find content 'make not important'.](../../images/5/36new.png)

Testejä tehdessä kannattaa siis ehdottomasti varmistaa test runnerista, että testit etsivät niitä elementtejä, joita niiden on tarkoitus tutkia!

Muutetaan komponenttia _Note_ siten, että muistiinpanon teksti renderöitään <i>span</i>-komponentin sisälle

```js
const Note = ({ note, toggleImportance }) => {
  const label = note.important
    ? 'make not important' : 'make important'

  return (
    <li className='note'>
      <span>{note.content}</span> // highlight-line
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}
```

Testit hajoavat! Kuten test runner paljastaa, komento _cy.contains('second note')_ palauttaakin nyt ainoastaan tekstin sisältävän komponentin, ja nappi on sen ulkopuolella:

![Oikealle puolelle havainnollistuu, että fokus osuu napin sijaan pelkkään tekstiin](../../images/5/37new.png)

Eräs tapa korjata ongelma on seuraavassa:

```js
it('other of those can be made important', function () {
  cy.contains('second note').parent().find('button').click()
  cy.contains('second note').parent().find('button')
    .should('contain', 'make not important')
})
```

Ensimmäisellä rivillä etsitään komennon [parent](https://docs.cypress.io/api/commands/parent.htm) tekstin <i>second note</i> sisältävän elementin vanhemman alla oleva nappi ja painetaan sitä. Toinen rivi varmistaa, että napin teksti muuttuu.

Huomaa, että napin etsimiseen käytetään komentoa [find](https://docs.cypress.io/api/commands/find.html#Syntax). Komento [cy.get](https://docs.cypress.io/api/commands/get.html) ei sovellu tähän tilanteeseen, sillä se etsii elementtejä aina <i>koko</i> sivulta ja palauttaisi nyt kaikki sovelluksen viisi nappia.

Testissä on ikävästi copypastea, rivien alku eli napin etsivä koodi on sama. 
Tälläisissä tilanteissa on mahdollista hyödyntää komentoa [as](https://docs.cypress.io/api/commands/as.html): 

```js
it('other of those can be made important', function () {
  cy.contains('second note').parent().find('button').as('theButton')
  cy.get('@theButton').click()
  cy.get('@theButton').should('contain', 'make not important')
})
```

Nyt ensimmäinen rivi etsii oikean napin, ja tallentaa sen komennon <i>as</i> avulla nimellä <i>theButton</i>. Seuraavat rivit pääsevät nimettyyn elementtiin käsiksi komennolla <i>cy.get('@theButton')</i>.

### Testien suoritus ja debuggaaminen

Vielä osan lopuksi muutamia huomioita Cypressin toimintaperiaatteesta sekä testien debuggaamisesta.

Cypressissä testien kirjoitusasu antaa vaikutelman, että testit ovat normaalia JavaScript-koodia, ja että voisimme esim. yrittää seuraavaa:

```js
const button = cy.contains('log in')
button.click()
debugger
cy.contains('logout').click()
```

Näin kirjoitettu koodi ei kuitenkaan toimi. Kun Cypress suorittaa testin, se lisää jokaisen _cy_-komennon suoritusjonoon. Kun testimetodin koodi on suoritettu loppuun, suorittaa Cypress yksi kerrallaan suoritusjonoon lisätyt _cy_-komennot.

Cypressin komennot palauttavat aina _undefined_, eli yllä olevassa koodissa komento _button.click()_ aiheuttaisi virheen ja yritys käynnistää debuggeri ei pysäyttäisi koodia Cypress-komentojen suorituksen välissä, vaan jo ennen kuin yhtään Cypress-komentoa olisi suoritettu.

Cypress-komennot ovat <i>promisen kaltaisia</i>, joten jos niiden palauttamia arvoja halutaan käsitellä, se tulee tehdä komennon [then](https://docs.cypress.io/api/commands/then.html) avulla. Esim. seuraava testi tulostaisi sovelluksen <i>kaikkien</i> nappien lukumäärän ja klikkaisi napeista ensimmäistä:

```js
it('then example', function() {
  cy.get('button').then( buttons => {
    console.log('number of buttons', buttons.length)
    cy.wrap(buttons[0]).click()
  })
})
```

Myös testien suorituksen pysäyttäminen debuggeriin on [mahdollista](https://docs.cypress.io/api/commands/debug.html). Debuggeri käynnistyy vain jos Cypress test runnerin developer-konsoli on auki. 

Developer-konsoli on monin tavoin hyödyllinen testejä debugatessa. Network-tabilla näkyvät testattavan sovelluksen tekemät HTTP-pyynnöt, ja console-välilehti kertoo testin komentoihin liittyviä tietoja:

![Console-välilehti havainnollistaa testien löytämiä elementtejä.](../../images/5/38new.png)

Olemme toistaiseksi suorittaneet Cypress-testejä ainoastaan graafisen test runnerin kautta. Testit on luonnollisesti mahdollista suorittaa myös [komentoriviltä](https://docs.cypress.io/guides/guides/command-line.html). Lisätään vielä sovellukselle npm-skripti tätä tarkoitusta varten

```js
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "eslint": "eslint .",
    "cypress:open": "cypress open",
    "test:e2e": "cypress run" // highlight-line
  },
```

Nyt siis voimme suorittaa Cypress-testit komentoriviltä komennolla <i>npm run test:e2e</i>

![Komennon suoritus tulostaa konsoliin tekstuaalisen raportin joka kertoo 5 läpimenneestä testistä.](../../images/5/39new.png)

Huomaa, että testien suorituksesta tallentuu video hakemistoon <i>cypress/videos/</i>, hakemisto lienee syytä gitignoroida. Videoiden teko on myös mahdollista ottaa [pois päältä](https://docs.cypress.io/guides/guides/screenshots-and-videos#Videos).

Testien ja frontendin koodin lopullinen versio on kokonaisuudessaan [GitHubissa](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-11), branchissa <i>part5-11</i>.

</div>

<div class="tasks">

### Tehtävät 5.17.-5.23.

Tehdään osan lopuksi muutamia E2E-testejä blogisovellukseen. Yllä olevan materiaalin pitäisi riittää ainakin suurimmaksi osaksi tehtävien tekemiseen. Cypressin [dokumentaatiota](https://docs.cypress.io/guides/overview/why-cypress.html#In-a-nutshell) kannattaa ehdottomasti myös lueskella, kyseessä on ehkä paras dokumentaatio, mitä olen koskaan open source ‑projektissa nähnyt.

Erityisesti kannattaa lukea luku [Introduction to Cypress](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#Cypress-Can-Be-Simple-Sometimes), joka toteaa

> <i>This is the single most important guide for understanding how to test with Cypress. Read it. Understand it.</i>

#### 5.17: blogilistan end to end ‑testit, step1

Konfiguroi Cypress projektiisi. Tee testi, joka varmistaa, että sovellus näyttää oletusarvoisesti kirjautumislomakkeen.

Testin rungon tulee olla seuraavanlainen

```js 
describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    // ...
  })
})
```

Testin <i>beforeEach</i>-alustuslohkon tulee nollata tietokannan tilanne esim. [materiaalissa](/osa5/end_to_end_testaus#tietokannan-tilan-kontrollointi) näytetyllä tavalla.

#### 5.18: blogilistan end to end ‑testit, step2

Tee testit kirjautumiselle, testaa sekä onnistunut että epäonnistunut kirjautuminen. Luo testejä varten käyttäjä <i>beforeEach</i>-lohkossa. 

Testien runko laajenee seuraavasti

```js 
describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    // create here a user to backend
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    // ...
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      // ...
    })

    it('fails with wrong credentials', function() {
      // ...
    })
  })
})
```

#### 5.19: blogilistan end to end ‑testit, step3

Tee testi, joka varmistaa, että kirjautunut käyttäjä pystyy luomaan blogin. Testin runko voi näyttää seuraavalta

```js 
describe('Blog app', function() {
  // ...

  describe('When logged in', function() {
    beforeEach(function() {
      // log in user here
    })

    it('A blog can be created', function() {
      // ...
    })
  })

})
```

Testin tulee varmistaa, että luotu blogi tulee näkyville blogien listalle.

#### 5.20: blogilistan end to end ‑testit, step4

Tee testi, joka varmistaa, että blogia voi likettää.

#### 5.21: blogilistan end to end ‑testit, step5

Tee testi, joka varmistaa, että blogin lisännyt käyttäjä voi poistaa blogin.

#### 5.22: blogilistan end to end ‑testit, step6

Tee testi, joka varmista, että vain blogin lisännyt käyttäjä näkee blogin poistonapin.

#### 5.23: blogilistan end to end ‑testit, step6

Tee testi, joka varmistaa, että blogit järjestetään likejen mukaiseen järjestykseen, eniten likejä saanut blogi ensin.

<i>Tämä tehtävä on edellisiä huomattavasti haastavampi.</i> Eräs ratkaisutapa on lisätä tietty luokka elementille, joka sisältää blogin sisällön ja käyttää [eq](https://docs.cypress.io/api/commands/eq#Syntax)-metodia tietyssä indeksissä olevan elementin hakemiseen:
  
```js
cy.get('.blog').eq(0).should('contain', 'The title with the most likes')
cy.get('.blog').eq(1).should('contain', 'The title with the second most likes')
``` 
  
Saatat törmätä tässä tehtävässä ongelmaan jos klikkaat monta kertaa peräkkäin <i>like</i>-nappia. Saattaa olla, että näin tehdessä liketykset tehdään samalle oliolle, eli Cypress ei "ehdi" välissä päivittää sovelluksen tilaa. Eräs tapa korjata ongelma on odottaa jokaisen klikkauksen jälkeen että likejen lukumäärä päivittyy ja tehdä uusi liketys vasta tämän jälkeen.

Tämä oli osan viimeinen tehtävä ja on aika pushata koodi GitHubiin sekä merkata tehdyt tehtävät [palautussovellukseen](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

</div>
