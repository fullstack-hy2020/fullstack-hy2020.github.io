---
mainImage: ../../../images/part-5.svg
part: 5
letter: c
lang: fi
---

<div class="content">

Reactilla tehtyjen frontendien testaamiseen on monia tapoja. Aloitetaan niihin tutustuminen nyt.

Testit tehdään samaan tapaan kuin edellisessä osassa eli Facebookin [Jest](http://jestjs.io/)-kirjastolla. Jest onkin valmiiksi konfiguroitu create-react-app:illa luotuihin projekteihin.

Tarvitsemme Jestin lisäksi testaamiseen apukirjaston, jonka avulla React-komponentteja voidaan renderöidä testejä varten. 

Tähän tarkoitukseen ehdottomasti paras vaihtoehto on [react-testing-library](https://github.com/testing-library/react-testing-library). Jestin ilmaisuvoimaa kannattaa myös laajentaa kirjastolla [jest-dom](https://github.com/testing-library/jest-dom).

Asennetaan kirjastot komennolla:

```js
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

Testataan aluksi muistiinpanon renderöivää komponenttia:

```js
const Note = ({ note, toggleImportance }) => {
  const label = note.important
    ? 'make not important'
    : 'make important'

  return (
    <li className='note'> // highlight-line
      {note.content}
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}
```

Huomaa, että muistiinpanon sisältävällä <i>li</i>-elementillä on [CSS](https://reactjs.org/docs/dom-elements.html#classname)-luokka <i>note</i>, pääsemme sen avulla muistiinpanoon käsiksi testistä.


### Komponentin renderöinti testiä varten

Tehdään testi tiedostoon <i>src/components/Note.test.js</i>, eli samaan hakemistoon, missä komponentti itsekin sijaitsee.

Ensimmäinen testi varmistaa, että komponentti renderöi muistiinpanon sisällön:

```js
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import Note from './Note'

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  const component = render(
    <Note note={note} />
  )

  expect(component.container).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )
})
```

Alun konfiguroinnin jälkeen testi renderöi komponentin metodin react-testing-library-kirjaston tarjoaman [render](https://testing-library.com/docs/react-testing-library/api#render) avulla:

```js
const component = render(
  <Note note={note} />
)
```

Normaalisti React-komponentit renderöityvät <i>DOM</i>:iin. Nyt kuitenkin renderöimme komponentteja testeille sopivaan muotoon laittamatta niitä DOM:iin. 

_render_ palauttaa olion, jolla on useita [kenttiä](https://testing-library.com/docs/react-testing-library/api#render-result). Yksi kentistä on <i>container</i>, se sisältää koko komponentin renderöimän HTML:n.

Ekspektaatiossa varmistamme, että komponenttiin on renderöitynyt oikea teksti, eli muistiinpanon sisältö:

```js
expect(component.container).toHaveTextContent(
  'Component testing is done with react-testing-library'
)
```

### Testien suorittaminen

Create-react-app:issa on konfiguroitu testit oletusarvoisesti suoritettavaksi ns. watch-moodissa, eli jos suoritat testit komennolla _npm test_, jää konsoli odottamaan koodissa tapahtuvia muutoksia. Muutosten jälkeen testit suoritetaan automaattisesti ja Jest alkaa taas odottamaan uusia muutoksia koodiin.

Jos haluat ajaa testit "normaalisti", se onnistuu komennolla

```js
CI=true npm test
```

**HUOM:** konsoli saattaa herjata virhettä, jos sinulla ei ole asennettuna watchmania. Watchman on Facebookin kehittämä tiedoston muutoksia tarkkaileva ohjelma. Ohjelma nopeuttaa testien ajoa ja ainakin osx sierrasta ylöspäin jatkuva testien vahtiminen aiheuttaa käyttäjillä virheilmoituksia. Näistä ilmoituksista pääsee eroon asentamalla Watchmanin.

Ohjeet ohjelman asentamiseen eri käyttöjärjestelmille löydät Watchmanin sivulta:
https://facebook.github.io/watchman/

### Testien sijainti

Reactissa on (ainakin) [kaksi erilaista](https://medium.com/@JeffLombardJr/organizing-tests-in-jest-17fc431ff850) konventiota testien sijoittamiseen. Sijoitimme testit ehkä vallitsevan tavan mukaan, eli samaan hakemistoon missä testattava komponentti sijaitsee.

Toinen tapa olisi sijoittaa testit "normaaliin" tapaan omaan erilliseen hakemistoon. Valitaanpa kumpi tahansa tapa, on varmaa että se on jonkun mielestä täysin väärä.

Itse en pidä siitä, että testit ja normaali koodi ovat samassa hakemistossa. Noudatamme kuitenkin nyt tätä tapaa, sillä se on oletusarvo create-react-app:illa konfiguroiduissa sovelluksissa.

### Sisällön etsiminen testattavasta komponentista

react-testing-library-kirjasto tarjoaa runsaasti tapoja, miten voimme tutkia testattavan komponentin sisältöä. Laajennetaan testiämme hiukan:

```js
test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  const component = render(
    <Note note={note} />
  )

  // tapa 1
  expect(component.container).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )

  // tapa 2
  const element = component.getByText(
    'Component testing is done with react-testing-library'
  )
  expect(element).toBeDefined()

  // tapa 3
  const div = component.container.querySelector('.note')
  expect(div).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )
})
```

Ensimmäinen tapa eli metodi <i>toHaveTextContent</i> siis etsii tiettyä tekstiä koko komponentin renderöimästä HTML:stä. <i>toHaveTextContent</i> on eräs monista [jest-dom](https://github.com/testing-library/jest-dom#tohavetextcontent)-kirjaston tarjoamista "matcher"-metodeista.

Toisena käytimme render-metodin palauttamaan olioon liittyvää [getByText](https://testing-library.com/docs/dom-testing-library/api-queries#bytext)-metodia, joka palauttaa sen elementin, jolla on parametrina määritelty teksti. Jos elementtiä ei ole, tapahtuu poikkeus. Eli mitään ekspektaatiota ei välttämättä edes tarvittaisi.

Kolmas tapa on etsiä komponentin sisältä tietty elementti metodilla [querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector), joka saa parametrikseen [CSS-selektorin](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors).

Kaksi viimeistä tapaa siis hakevat metodien <i>getByText</i> ja <i>querySelector</i> avulla renderöidystä komponentista jonkin ehdon täyttävän elementin. Vastaavalla periaatteella toimivia "query"-metodeja, on tarjolla [lukuisia](https://testing-library.com/docs/dom-testing-library/api-queries).

### Testien debuggaaminen

Testejä tehdessä törmäämme tyypillisesti erittäin moniin ongelmiin. 

Renderin palauttaman olion metodilla [debug](https://testing-library.com/docs/react-testing-library/api#debug) voimme tulostaa komponentin tuottaman HTML:n konsoliin, eli kun muutamme testiä seuraavasti:

```js
test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  const component = render(
    <Note note={note} />
  )

  component.debug() // highlight-line

  // ...
})
```

konsoliin tulostuu komponentin generoima HTML:

```js
console.log node_modules/@testing-library/react/dist/index.js:90
  <body>
    <div>
      <li
        class="note"
      >
        Component testing is done with react-testing-library
        <button>
          make not important
        </button>
      </li>
    </div>
  </body>
```

On myös mahdollista etsiä komponentista pienempi osa, ja tulostaa sen HTML-koodi, tällöin tarvitsemme metodia _prettyDOM_, joka löytyy react-testing-library:n mukana tulevasta kirjastosta <i>@testing-library/dom</i>:

```js
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom' // highlight-line
import Note from './Note'

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  const component = render(
    <Note note={note} />
  )
  
  // highlight-start
  const li = component.container.querySelector('li')
  console.log(prettyDOM(li))
  // highlight-end
})
```

Eli haimme selektorin avulla komponentin sisältä <i>li</i>-elementin ja tulostimme sen HTML:n konsoliin:

```js
console.log src/components/Note.test.js:21
  <li
    class="note"
  >
    Component testing is done with react-testing-library
    <button>
      make not important
    </button>
  </li>
```

### Nappien painelu testeissä

Sisällön näyttämisen lisäksi toinen <i>Note</i>-komponenttien vastuulla oleva asia on huolehtia siitä, että painettaessa noten yhteydessä olevaa nappia, tulee propsina välitettyä tapahtumankäsittelijäfunktiota _toggleImportance_ kutsua.

Testaus onnistuu seuraavasti:

```js
import React from 'react'
import { render, fireEvent } from '@testing-library/react' // highlight-line
import { prettyDOM } from '@testing-library/dom' 
import Note from './Note'

// ...

test('clicking the button calls event handler once', async () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  const mockHandler = jest.fn()

  const component = render(
    <Note note={note} toggleImportance={mockHandler} />
  )

  const button = component.getByText('make not important')
  fireEvent.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)
})
```

Testissä on muutama mielenkiintoinen seikka. Tapahtumankäsittelijäksi annetaan Jestin avulla määritelty [mock](https://facebook.github.io/jest/docs/en/mock-functions.html)-funktio:

```js
const mockHandler = jest.fn()
```

Testi hakee renderöidystä komponentista napin <i>tekstin perusteella</i> ja klikkaa sitä:

```js
const button = getByText('make not important')
fireEvent.click(button)
```

Klikkaaminen tapahtuu metodin [fireEvent](https://testing-library.com/docs/api-events#fireevent) avulla.

Testin ekspektaatio varmistaa, että <i>mock-funktiota</i> on kutsuttu täsmälleen kerran:

```js
expect(mockHandler.mock.calls).toHaveLength(1)
```

[Mockoliot ja -funktiot](https://en.wikipedia.org/wiki/Mock_object) ovat testauksessa yleisesti käytettyjä valekomponentteja, joiden avulla korvataan testattavien komponenttien riippuvuuksia, eli niiden tarvitsemia muita komponentteja. Mockit mahdollistavat mm. kovakoodattujen syötteiden palauttamisen sekä niiden metodikutsujen lukumäärän sekä parametrien testauksen aikaisen tarkkailun.

Esimerkissämme mock-funktio sopi tarkoitukseen erinomaisesti, sillä sen avulla on helppo varmistaa, että metodia on kutsuttu täsmälleen kerran.

### Komponentin <i>Togglable</i> testit

Tehdään komponentille <i>Togglable</i> muutama testi. Lisätään komponentin lapset renderöivään div-elementtiin CSS-luokka <i>togglableContent</i>:

```js
const Togglable = React.forwardRef((props, ref) => {
  // ...

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>
          {props.buttonLabel}
        </button>
      </div>
      <div style={showWhenVisible} className="togglableContent"> // highlight-line
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
})
```

Testit ovat seuraavassa

```js
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Togglable from './Togglable'

describe('<Togglable />', () => {
  let component

  beforeEach(() => {
    component = render(
      <Togglable buttonLabel="show...">
        <div className="testDiv" />
      </Togglable>
    )
  })

  test('renders its children', () => {
    expect(
      component.container.querySelector('.testDiv')
    ).toBeDefined()
  })

  test('at start the children are not displayed', () => {
    const div = component.container.querySelector('.togglableContent')

    expect(div).toHaveStyle('display: none')
  })

  test('after clicking the button, children are displayed', () => {
    const button = component.getByText('show...')
    fireEvent.click(button)

    const div = component.container.querySelector('.togglableContent')
    expect(div).not.toHaveStyle('display: none')
  })

})
```

Ennen jokaista testiä suoritettava _beforeEach_ renderöi <i>Togglable</i>-komponentin muuttujaan _component_.

Ensimmäinen testi tarkastaa, että <i>Togglable</i> renderöi sen lapsikomponentin `<div className="testDiv" />`. 

Loput testit varmistavat metodia [toHaveStyle](https://www.npmjs.com/package/@testing-library/jest-dom#tohavestyle) käyttäen, että Togglablen sisältämä lapsikomponentti on alussa näkymättömissä, eli sen sisältävään <i>div</i>-elementtiin liittyy tyyli `{ display: 'none' }`, ja että nappia painettaessa komponentti näkyy, eli näkymättömäksi tekevää tyyliä <i>ei</i> enää ole. 

Nappi etsitään jälleen nappiin liittyvän tekstin perusteella. Nappi oltaisiin voitu etsiä myös CSS-selektorin avulla

```js
const button = component.container.querySelector('button')
```

Komponentissa on kaksi nappia, mutta koska [querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector) palauttaa <i>ensimmäisen</i> löytyvän napin, löytyy napeista oikea.

Lisätään vielä mukaan testi, joka varmistaa että auki togglattu sisältö saadaan piilotettua painamalla komponentin toisena olevaa nappia

```js
test('toggled content can be closed', () => {
  const button = component.container.querySelector('button')
  fireEvent.click(button)

  const closeButton = component.container.querySelector(
    'button:nth-child(2)'
  )
  fireEvent.click(closeButton)

  const div = component.container.querySelector('.togglableContent')
  expect(div).toHaveStyle('display: none')
})
```

eli määrittelimme selektorin, joka palauttaa toisena olevan napin `button:nth-child(2)`. Testeissä ei kuitenkaan ole viisasta olla riippuvainen komponentin nappien järjestyksestä, joten parempi onkin hakea napit niiden tekstin perusteella:

```js
test('toggled content can be closed', () => {
  const button = component.getByText('show...')
  fireEvent.click(button)

  const closeButton = component.getByText('cancel')
  fireEvent.click(closeButton)

  const div = component.container.querySelector('.togglableContent')
  expect(div).toHaveStyle('display: none')
})
```

Käyttämämme _getByText_ on vain yksi monista [queryistä](https://testing-library.com/docs/api-queries#queries), joita <i>react-testing-library</i> tarjoaa.

### Lomakkeiden testaus

Käytimme jo edellisissä testeissä [fireEvent](https://testing-library.com/docs/api-events#fireevent)-funktiota nappien klikkaamiseen:

```js
const button = component.getByText('show...')
fireEvent.click(button)
```

Käytännössä siis loimme <i>fireEventin</i> avulla tapahtuman <i>click</i> nappia vastaavalle komponentille. Voimme myös simuloida lomakkeisiin kirjoittamista <i>fireEventin</i> avulla.

Tehdään testi komponentille <i>NoteForm</i>. Lomakkeen koodi näyttää seuraavalta

```js
import React, { useState } from 'react'

const NoteForm = ({ createNote }) => {
  const [newNote, setNewNote] = useState('')

  const handleChange = (event) => {
    setNewNote(event.target.value)
  }

  const addNote = (event) => {
    event.preventDefault()
    createNote({
      content: newNote,
      important: Math.random() > 0.5,
    })

    setNewNote('')
  }

  return (
    <div className="formDiv">
      <h2>Create a new note</h2>

      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleChange}
        />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default NoteForm
```

Lomakkeen toimintaperiaatteena on kutsua sille propsina välitettyä funktiota _createNote_ uuden muistiinpanon tiedot parametrina.

Testi on seuraavassa:

```js
import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import NoteForm from './NoteForm'

test('<NoteForm /> updates parent state and calls onSubmit', () => {
  const createNote = jest.fn()

  const component = render(
    <NoteForm createNote={createNote} />
  )

  const input = component.container.querySelector('input')
  const form = component.container.querySelector('form')

  fireEvent.change(input, { 
    target: { value: 'testing of forms could be easier' } 
  })
  fireEvent.submit(form)

  expect(createNote.mock.calls).toHaveLength(1)
  expect(createNote.mock.calls[0][0].content).toBe('testing of forms could be easier' )
})
```

Syötekenttään <i>input</i> kirjoittamista simuloidaan tekemällä syötekenttään tapahtuma <i>change</i> ja määrittelemällä sopiva olio, joka määrittelee syötekenttään 'kirjoitetun' sisällön.

Lomake lähetetään simuloimalla tapahtuma <i>submit</i> lomakkeelle.

Testin ensimmäinen ekspektaatio varmistaa, että lomakkeen lähetys on aikaansaanut tapahtumankäsittelijän _createNote_ kutsumisen. Toinen ekspektaatio tarkistaa, että tapahtumankäsittelijää kutsutaan oikealla parametrilla, eli että luoduksi tulee saman sisältöinen muistiinpano kuin lomakkeelle kirjoitetaan.

### Testauskattavuus

[Testauskattavuus](https://github.com/facebookincubator/create-react-app/blob/ed5c48c81b2139b4414810e1efe917e04c96ee8d/packages/react-scripts/template/README.md#coverage-reporting) saadaan helposti selville suorittamalla testit komennolla

```js
CI=true npm test -- --coverage
```

![](../../images/5/18ea.png)

Melko primitiivinen HTML-muotoinen raportti generoituu hakemistoon <i>coverage/lcov-report</i>. HTML-muotoinen raportti kertoo mm. yksittäisen komponenttien testaamattomat koodirivit:

![](../../images/5/19ea.png)

Sovelluksen tämänhetkinen koodi on kokonaisuudessaan [githubissa](https://github.com/fullstack-hy2020/part2-notes/tree/part5-8), branchissa <i>part5-8</i>.

</div>

<div class="tasks">

### Tehtävät 5.13.-5.16.

#### 5.13: blogilistan testit, step1

Tee testi, joka varmistaa että blogin näyttävä komponentti renderöi blogin titlen, authorin mutta ei renderöi oletusarvoisesti urlia eikä likejen määrää.

#### 5.14: blogilistan testit, step2

Tee testi, joka varmistaa että myös url ja likejen määrä näytetään kun blogin kaikki tiedot näyttävää nappia on painettu.

#### 5.15: blogilistan testit, step3

Tee testi, joka varmistaa, että jos komponentin <i>like</i>-nappia painetaan kahdesti, komponentin propsina saamaa tapahtumankäsittelijäfunktiota kutsutaan kaksi kertaa.

#### 5.16*: blogilistan testit, step4

Tee uuden blogin luomisesta huolehtivalle lomakkelle testi, joka varmistaa, että lomake kutsuu propseina saamaansa takaisinkutsufunktiota oikeilla tiedoilla siinä vaiheessa kun blogi luodaan.

Lisää komponenttiin tarvittaessa testausta helpottavia CSS-luokkia tai id:itä.

Jos esim. määrittelet <i>input</i>-elementille id:n 'author':

```js
<input
  id='author'
  value={author}
  onChange={() => {}}
/>
```

saat haettua kentän testissä seuraavasti

```js
const author = component.container.querySelector('#author')
```

</div>

<div class="content">

### Frontendin integraatiotestaus

Suoritimme edellisessä osassa backendille integraatiotestejä, jotka testasivat backendin tarjoaman API:n läpi backendia ja tietokantaa. Backendin testauksessa tehtiin tietoinen päätös olla kirjoittamatta yksikkötestejä sillä backendin koodi on melko suoraviivaista ja ongelmat tulevatkin esiin todennäköisemmin juuri monimutkaisemmissa skenaarioissa, joita integraatiotestit testaavat hyvin.

Toistaiseksi kaikki frontendiin tekemämme testit ovat olleet yksittäisten komponenttien oikeellisuutta valvovia yksikkötestejä. Yksikkötestaus on toki välillä hyödyllistä, mutta kattavinkaan yksikkötestaus ei riitä antamaan riittävää luotettavuutta sille, että järjestelmä toimii kokonaisuudessaan.

Voisimme tehdä myös frontendille useiden komponenttien yhteistoiminnallisuutta testaavia integraatiotestejä, mutta se on oleellisesti yksikkötestausta hankalampaa, sillä integraatiotesteissä jouduttaisiin ottamaan kantaa mm. palvelimelta haettavan datan mockaamiseen. Päätämmekin keskittyä koko sovellusta testaavien end to end -testien tekemiseen, jonka parissa jatkamme tämän osan viimeisessä jaksossa.

### Snapshot-testaus

Jest tarjoaa "perinteisen" testaustavan lisäksi aivan uudenlaisen tavan testaukseen, ns. [snapshot](https://facebook.github.io/jest/docs/en/snapshot-testing.html)-testauksen. Mielenkiintoista snapshot-testauksessa on se, että sovelluskehittäjän ei tarvitse itse määritellä ollenkaan testejä, snapshot-testauksen käyttöönotto riittää.

Periaatteena on verrata komponenttien määrittelemää HTML:ää aina koodin muutoksen jälkeen siihen, minkälaisen HTML:n komponentit määrittelivät ennen muutosta.

Jos snapshot-testi huomaa muutoksen komponenttien määrittelemässä HTML:ssä, voi kyseessä joko olla haluttu muutos tai vahingossa aiheutettu "bugi". Snapshot-testi huomauttaa sovelluskehittäjälle, jos komponentin määrittelemä HTML muuttuu. Sovelluskehittäjä kertoo muutosten yhteydessä, oliko muutos haluttu. Jos muutos tuli yllätyksenä, eli kyseessä oli bugi, sovelluskehittäjä huomaa sen snapshot-testauksen ansiosta nopeasti.

Emme kuitenkaan käytä tällä kurssilla snapshot-testausta.

</div>
