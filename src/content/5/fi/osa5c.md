---
mainImage: ../../../images/part-5.svg
part: 5
letter: c
lang: fi
---

<div class="tasks">

Tässä osassa käytetty testikirjasto muutettiin 3.3.2024 Jestistä Vitestiin. Jos ehdit jo aloittaa Jestiä käyttäen, näet [täältä](https://github.com/fullstack-hy2020/fullstack-hy2020.github.io/blob/02d8be28b1c9190f48976fbbd2435b63261282df/src/content/5/fi/osa5c.md) osan vanhan sisällön.

</div>

<div class="content">

Reactilla tehtyjen frontendien testaamiseen on monia tapoja. Aloitetaan niihin tutustuminen nyt.

Kurssilla käytettiin aiemmin React-komponenttien testaamiseen Facebookin kehittämää [Jest](http://jestjs.io/)-kirjastoa. Käytämme kurssilla nyt Viten kehittäjien uuden generaation testikirjastoa [Vitestiä](https://vitest.dev/). Konfigurointia lukuunottamatta kirjastot tarjoavat saman ohjelmointirajapinnan, joten testauskoodissa ei käytännössä ole mitään eroa.

Aloitetaan asentamalla Vitest sekä Web-selainta simuloiva [jsdom](https://github.com/jsdom/jsdom)-kirjasto:

```
npm install --save-vitest vitest jsdom
```

Tarvitsemme Vitestin lisäksi testaamiseen apukirjaston, jonka avulla React-komponentteja voidaan renderöidä testejä varten. 

Tähän tarkoitukseen ehdottomasti paras vaihtoehto on [React Testing Library](https://github.com/testing-library/react-testing-library). Testien ilmaisuvoimaa kannattaa laajentaa myös kirjastolla [jest-dom](https://github.com/testing-library/jest-dom).

Asennetaan tarvittavat kirjastot:

```js
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

Ennen kuin pääsemme tekemään ensimmäistä testiä, tarvitsemme hieman konfiguraatioita.

Lisätään tiedostoon <i>package.json</i> skripti testien suorittamiselle:

```js 
{
  "scripts": {
    // ...
    "test": "vitest run"
  }
  // ...
}
```

Tehdään projektin juureen tiedosto _testSetup.js_ ja sille sisältö

```js
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

afterEach(() => {
  cleanup()
})
```

Nyt jokaisen testin jälkeen suoritetaan toimenpide joka nollaa selainta simuloivan jsdomin.

Laajennetaan tiedostoa _vite.config.js_ seuraavasti

```js
export default defineConfig({
  // ...
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './testSetup.js', 
  }
})
```

Määrittelyn _globals: true_ ansiosta testien käyttämät avainsanoja kuten _describe_, _test_ ja _expect_ ei ole tarvetta importata testeissä.

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

Huomaa, että muistiinpanon sisältävällä <i>li</i>-elementillä on [CSS](https://react.dev/learn#adding-styles)-luokka <i>note</i>. Pääsemme sen avulla halutessamme muistiinpanoon käsiksi testistä. Emme kuitenkaan ensisijaisesti käytä CSS-luokkia testauksessa.

### Komponentin renderöinti testiä varten

Tehdään testi tiedostoon <i>src/components/Note.test.jsx</i> eli samaan hakemistoon, jossa komponentti itsekin sijaitsee.

Ensimmäinen testi varmistaa, että komponentti renderöi muistiinpanon sisällön:

```js
import { render, screen } from '@testing-library/react'
import Note from './Note'

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  render(<Note note={note} />)

  const element = screen.getByText('Component testing is done with react-testing-library')
  expect(element).toBeDefined()
})
```

Alun konfiguroinnin jälkeen testi renderöi komponentin React Testing Library ‑kirjaston tarjoaman funktion [render](https://testing-library.com/docs/react-testing-library/api#render) avulla:

```js
render(<Note note={note} />)
```

Normaalisti React-komponentit renderöityvät <i>DOM</i>:iin. Nyt kuitenkin renderöimme komponentteja testeille sopivaan muotoon laittamatta niitä DOM:iin. 

Testin renderöimään näkymään päästään käsiksi olion [screen](https://testing-library.com/docs/queries/about#screen) kautta. Haetaan screenistä metodin [getByText](https://testing-library.com/docs/queries/bytext) avulla elementtiä, jossa on muistiinpanon sisältö ja varmistetaan että elementti on olemassa:

```js
  const element = screen.getByText('Component testing is done with react-testing-library')
  expect(element).toBeDefined()
```

Elementin olemassaolo tarkastetaan Vitestin [expect](https://vitest.dev/api/expect.html#expect) komennon avulla. Expect muodostaa parametristaan väittämän jonka paikkansapitävyyttä voidaan testata erilaisten ehtofunktioiden avulla. Nyt käytössä oli [toBeDefined](https://vitest.dev/api/expect.html#tobedefined) joka siis testaa, onko expectin parametrina oleva _element_ olemassa.

Suoritetaan testi:

```js
$ npm test

> notes-frontend@0.0.0 test
> vitest


 DEV  v1.3.1 /Users/mluukkai/opetus/2024-fs/part3/notes-frontend

 ✓ src/components/Note.test.jsx (1)
   ✓ renders content

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  17:05:37
   Duration  812ms (transform 31ms, setup 220ms, collect 11ms, tests 14ms, environment 395ms, prepare 70ms)


 PASS  Waiting for file changes...
```

Kuten olettaa saattaa, testi menee läpi.

Eslint valittaa testeissä olevista avainsanoista _test_ ja _expect_. Ongelmasta päästään eroon asentamalla [eslint-plugin-vitest-globals](https://www.npmjs.com/package/eslint-plugin-vitest-globals):

```
npm install --save-dev eslint-plugin-vitest-globals
```

ja ottamalla plugin käyttöön muokkaamalla tiedosstoa _.eslint.cjs_ seuraavasti: 

```js
module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    "vitest-globals/env": true // highlight-line
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:vitest-globals/recommended', // highlight-line
  ],
  // ...
}
  ```

### Testien sijainti

Reactissa on (ainakin) [kaksi erilaista](https://medium.com/@JeffLombardJr/organizing-tests-in-jest-17fc431ff850) konventiota testien sijoittamiseen. Sijoitimme testit ehkä vallitsevan tavan mukaan samaan hakemistoon testattavan komponentin kanssa.

Toinen tapa olisi sijoittaa testit "normaaliin" tapaan omaan erilliseen hakemistoon. Valitaanpa kumpi tapa tahansa, on varmaa että se on jonkun mielestä täysin väärä.

Itse en pidä siitä, että testit ja normaali koodi ovat samassa hakemistossa. Noudatamme kuitenkin nyt tätä tapaa, sillä se on oletusarvo Create React App:lla konfiguroiduissa sovelluksissa.

### Sisällön etsiminen testattavasta komponentista

React Testing Library ‑kirjasto tarjoaa runsaasti tapoja testattavan komponentin sisällön tutkimiseen. Itse asiassa testimme viimeisellä rivillä oleva expect on turha

```js
import { render, screen } from '@testing-library/react'
import Note from './Note'

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  render(<Note note={note} />)

  const element = screen.getByText('Component testing is done with react-testing-library')

  expect(element).toBeDefined() // highlight-line
})
```

Testi ei mene läpi, jos _getByText_ ei löydä halutun tekstin sisältävää elementtiä.

Jos haluamme etsiä testattavia komponentteja [CSS-selektorien](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors) avulla, se onnistuu renderin palauttaman [container](https://testing-library.com/docs/react-testing-library/api/#container)-olion metodilla [querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector):
 
```js
import { render, screen } from '@testing-library/react'
import Note from './Note'

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  const { container } = render(<Note note={note} />) // highlight-line

// highlight-start
  const div = container.querySelector('.note')
  expect(div).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )
  // highlight-end
})
```

Muitakin tapoja on, esim. [getByTestId](https://testing-library.com/docs/queries/bytestid/), joka etsii elementtejä erikseen testejä varten luotujen id-kenttien perusteella.

### Testien debuggaaminen

Testejä tehdessä törmäämme tyypillisesti moniin ongelmiin. 

Olion _screen_ -olion metodilla [debug](https://testing-library.com/docs/queries/about/#screendebug) voimme tulostaa komponentin tuottaman HTML:n konsoliin. Eli kun muutamme testiä seuraavasti:

```js
import { render, screen } from '@testing-library/react'
import Note from './Note'

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  render(<Note note={note} />)

  screen.debug() // highlight-line

  // ...

})
```

konsoliin tulostuu komponentin generoima HTML:

```js
console.log
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

On myös mahdollista etsiä komponentista pienempi osa, ja tulostaa sen HTML-koodi:

```js
import { render, screen } from '@testing-library/react'
import Note from './Note'

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  render(<Note note={note} />)

  const element = screen.getByText('Component testing is done with react-testing-library')

  screen.debug(element)  // highlight-line

  expect(element).toBeDefined()
})
```

Haimme nyt halutun tekstin sisältävän elemementin sisällön tulostettavaksi:

```js
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

Sisällön näyttämisen lisäksi toinen <i>Note</i>-komponenttien vastuulla oleva asia on huolehtia siitä, että propsina välitettyä tapahtumankäsittelijäfunktiota _toggleImportance_ kutsutaan kun noten yhteydessä olevaa nappia painetaan.

Asennetaan testiä varten apukirjasto [user-event](https://testing-library.com/docs/user-event/intro/):

```
npm install --save-dev @testing-library/user-event
```

Testaus onnistuu seuraavasti:

```js
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event' // highlight-line
import Note from './Note'

// ...

test('clicking the button calls event handler once', async () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  const mockHandler = vi.fn()

  render(
    <Note note={note} toggleImportance={mockHandler} />
  )

  const user = userEvent.setup()
  const button = screen.getByText('make not important')
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)
})
```

Testissä on muutama mielenkiintoinen seikka. Tapahtumankäsittelijäksi annetaan Vitestin avulla määritelty [mock](https://vitest.dev/api/mock)-funktio:

```js
const mockHandler = vi.fn()
```
  
Jotta renderöidyn komponentin kanssa voi vuorovaikuttaa tapahtumien avulla, tulee ensin aloittaa uusi sessio. Tämä onnistuu userEvent-olion [setup](https://testing-library.com/docs/user-event/setup/)-metodin avulla:

```js
const user = userEvent.setup()
```

Testi hakee renderöidystä komponentista napin <i>tekstin perusteella</i> ja klikkaa sitä:

```js
const button = screen.getByText('make not important')
await user.click(button)
```

Klikkaaminen tapahtuu userEvent-olion metodin [click](https://testing-library.com/docs/user-event/convenience/#click) avulla.

Testin ekspektaatio varmistaa [toHaveLength](https://vitest.dev/api/expect.html#tohavelength) matcherin avulla, että <i>mock-funktiota</i> on kutsuttu täsmälleen kerran:

```js
expect(mockHandler.mock.calls).toHaveLength(1)
```

Mock-funktion kutsut tallennetaan mockin sisällä olevaan listaan [mock.calls](https://vitest.dev/api/mock#mock-calls).

[Mock-oliot ja ‑funktiot](https://en.wikipedia.org/wiki/Mock_object) ovat testauksessa yleisesti käytettyjä valekomponentteja, joiden avulla korvataan testattavien komponenttien riippuvuuksia eli niiden tarvitsemia muita komponentteja. Mockit mahdollistavat mm. kovakoodattujen syötteiden palauttamisen ja metodikutsujen lukumäärän ja parametrien tarkkailun testauksen aikana.

Esimerkissämme mock-funktio sopi tarkoitukseen erinomaisesti, sillä sen avulla on helppo varmistaa, että metodia on kutsuttu täsmälleen kerran.

### Komponentin Togglable testit

Tehdään komponentille <i>Togglable</i> muutama testi. Lisätään komponentin lapset renderöivään div-elementtiin CSS-luokka <i>togglableContent</i>:

```js
const Togglable = forwardRef((props, ref) => {
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

Testit ovat seuraavassa:

```js

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Togglable from './Togglable'

describe('<Togglable />', () => {
  let container

  beforeEach(() => {
    container = render(
      <Togglable buttonLabel="show...">
        <div className="testDiv" >
          togglable content
        </div>
      </Togglable>
    ).container
  })

  test('renders its children', () => {
    screen.getByText('togglable content')
  })

  test('at start the children are not displayed', () => {
    const div = container.querySelector('.togglableContent')
    expect(div).toHaveStyle('display: none')
  })

  test('after clicking the button, children are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show...')
    await user.click(button)

    const div = container.querySelector('.togglableContent')
    expect(div).not.toHaveStyle('display: none')
  })
})
```

Ennen jokaista testiä suoritettava _beforeEach_ renderöi <i>Togglable</i>-komponentin ja tallettaa paluuarvon kentän _container_ samannimiseen muuttujaan.

Ensimmäinen testi tarkastaa, että <i>Togglable</i> renderöi sen lapsikomponentin

```js
<div className="testDiv">
  togglable content
</div>
```

Loput testit varmistavat metodia [toHaveStyle](https://www.npmjs.com/package/@testing-library/jest-dom#tohavestyle) käyttäen, että Togglablen sisältämä lapsikomponentti on alussa näkymättömissä, eli että sen sisältävään <i>div</i>-elementtiin liittyy tyyli _{ display: 'none' }_, ja että nappia painettaessa komponentti näkyy, eli näkymättömäksi tekevää tyyliä <i>ei</i> enää ole. 

Lisätään vielä mukaan testi, joka varmistaa että auki togglattu sisältö saadaan piilotettua painamalla komponentin nappia <i>cancel</i>:

```js
describe('<Togglable />', () => {

  // ...

  test('toggled content can be closed', async () => {
    const user = userEvent.setup()

    const button = screen.getByText('show...')
    await user.click(button)

    const closeButton = screen.getByText('cancel')
    await user.click(closeButton)

    const div = container.querySelector('.togglableContent')
    expect(div).toHaveStyle('display: none')
  })
})
```

### Lomakkeiden testaus

Käytimme jo edellisissä testeissä [user-event](https://testing-library.com/docs/user-event/intro)-kirjaston _click_-metodia nappien klikkaamiseen:

```js
const button = screen.getByText('show...')
await user.click(button)
```

Käytännössä siis loimme metodin avulla <i>click</i>-tapahtuman metodin argumenttina annetulle komponentille. Voimme simuloida myös lomakkeelle kirjoittamista <i>userEventin</i>-olion avulla.

Tehdään testi komponentille <i>NoteForm</i>. Lomakkeen koodi näyttää seuraavalta:

```js
import { useState } from 'react'

const NoteForm = ({ createNote }) => {
  const [newNote, setNewNote] = useState('')

  const handleChange = (event) => {
    setNewNote(event.target.value)
  }

  const addNote = (event) => {
    event.preventDefault()
    createNote({
      content: newNote,
      important: true,
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
import { render, screen } from '@testing-library/react'
import NoteForm from './NoteForm'
import userEvent from '@testing-library/user-event'

test('<NoteForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const createNote = vi.fn()

  render(<NoteForm createNote={createNote} />)

  const input = screen.getByRole('textbox')
  const sendButton = screen.getByText('save')

  await user.type(input, 'testing a form...')
  await user.click(sendButton)

  expect(createNote.mock.calls).toHaveLength(1)
  expect(createNote.mock.calls[0][0].content).toBe('testing a form...')
})
```

Syötekenttä etsitään metodin [getByRole](https://testing-library.com/docs/queries/byrole) avulla. Syötekenttään kirjoitetaan metodin [type](https://testing-library.com/docs/user-event/utility#type) avulla. Testin ensimmäinen ekspektaatio varmistaa, että lomakkeen lähetys on aikaansaanut tapahtumankäsittelijän _createNote_ kutsumisen. Toinen ekspektaatio tarkistaa, että tapahtumankäsittelijää kutsutaan oikealla parametrilla, eli että luoduksi tulee samansisältöinen muistiinpano kuin lomakkeelle kirjoitetaan.

Kannattaa huomata, että vanha kunnon _console.log_ toimii testeissä normaaliin tapaan. Jos esim. halutaan takastella miltä mock-olion tallettamat kutsut näyttävät, voidaan tehdä seuraavasti

```js
test('<NoteForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const createNote = vi.fn()

  render(<NoteForm createNote={createNote} />)

  const input = screen.getByRole('textbox')
  const sendButton = screen.getByText('save')

  await user.type(input, 'testing a form...')
  await user.click(sendButton)

  console.log(createNote.mock.calls)  // highlight-line
})
```

Testien suorituksen sekaan tulostuu

```
[ [ { content: 'testing a form...', important: true } ] ]
```

### Lisää elementtien etsimisestä

Oletetaan että lomakkeella olisi useita syötekenttiä:

```js
const NoteForm = ({ createNote }) => {
  // ...

  return (
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleChange}
        />
        // highlight-start
        <input
          value={...}
          onChange={...}
        />
        // highlight-end
        <button type="submit">save</button>
      </form>
    </div>
  )
}
```

Nyt testissä käytetty syötekentän etsimistapa:

```js
const input = screen.getByRole('textbox')
```

aiheuttaisi virheen:

![Konsoli kertoo virheestä TestingLibraryElementError: Found multiple elements with the role "textbox"](../../images/5/40.png)

Virheilmoitus ehdottaa käytettäväksi metodia <i>getAllByRole</i> (jos tilanne ylipäätään on se mitä halutaan). Testi korjautuisi seuraavasti:

```js
const inputs = screen.getAllByRole('textbox')

await user.type(inputs[0], 'testing a form...')
```

Metodi <i>getAllByRole</i>  palauttaa taulukon, ja oikea tekstikenttä on taulukossa ensimmäisenä. Testi on kuitenkin hieman epäilyttävä, sillä se luottaa tekstikenttien järjestykseen.

Syötekentille määritellään usein placeholder-teksti, joka ohjaa käyttäjää kirjoittamaan syötekenttään oikean arvon. Lisätään placeholder lomakkeellemme:

```js
const NoteForm = ({ createNote }) => {
  // ...

  return (
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleChange}
          placeholder='write note content here' // highlight-line 
        />
        <input
          value={...}
          onChange={...}
        />    
        <button type="submit">save</button>
      </form>
    </div>
  )
}
```

Nyt oikean syötekentän etsiminen onnistuu metodin [getByPlaceholderText](https://testing-library.com/docs/queries/byplaceholdertext) avulla:

```js
test('<NoteForm /> updates parent state and calls onSubmit', () => {
  const createNote = vi.fn()

  render(<NoteForm createNote={createNote} />) 

  const input = screen.getByPlaceholderText('write note content here') // highlight-line 
  const sendButton = screen.getByText('save')

  userEvent.type(input, 'testing a form...' )
  userEvent.click(sendButton)

  expect(createNote.mock.calls).toHaveLength(1)
  expect(createNote.mock.calls[0][0].content).toBe('testing a form...' )
})
```

Kaikkein joustavimman tavan tarjoaa aiemmin [tässä luvussa](/osa5/react_sovellusten_testaaminen#sisallon-etsiminen-testattavasta-komponentista) esitellyn _render_-metodin palauttaman olion _content_-kentän metodi <i>querySelector</i>, joka mahdollistaa komponenttien etsimisen mielivaltaisten CSS-selektorien avulla. 

Jos esim. määrittelisimme syötekentälle yksilöivän attribuutin _id_:

```js
const NoteForm = ({ createNote }) => {
  // ...

  return (
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleChange}
          id='note-input' // highlight-line 
        />
        <input
          value={...}
          onChange={...}
        />    
        <button type="submit">save</button>
      </form>
    </div>
  )
}
```

Testi löytäisi elementin seuraavasti:

```js
const { container } = render(<NoteForm createNote={createNote} />)

const input = container.querySelector('#note-input')
```

Jätämme koodiin placeholderiin perustuvan ratkaisun.
  
Vielä muutama tärkeä huomio. Oletetaan että komponentti renderöisi samaan HTML-elementtiin tekstiä seuraavasti:

```js
const Note = ({ note, toggleImportance }) => {
  const label = note.important
    ? 'make not important' : 'make important'

  return (
    <li className='note'>
      Your awesome note: {note.content} // highlight-line
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}

export default Note
```

Nyt testissä käyttämämme _getByText_ ei löydä elementtiä:

```js 
test('renders content', () => {
  const note = {
    content: 'Does not work anymore :(',
    important: true
  }

  render(<Note note={note} />)

  const element = screen.getByText('Does not work anymore :(')

  expect(element).toBeDefined()
})
```

Komento _getByText_ nimittäin etsii elementtiä missä on <i>ainoastaan parametrina teksti</i> eikä mitään muuta. Jos halutaan etsiä komponenttia joka <i>sisältää</i> tekstin, voidaan joko lisätä komennolle ekstraoptio:

```js 
const element = screen.getByText(
  'Does not work anymore :(', { exact: false }
)
```

tai käyttää komentoa _findByText_:

```js 
const element = await screen.findByText('Does not work anymore :(')
```

On tärkeä huomata, että toisin kuin muut _ByText_-komennoista, _findByText_ palauttaa promisen!

On myös jotain tilanteita, missä komennon muoto _queryByText_ on käyttökelpoinen. Komento palauttaa elementin mutta <i>ei aiheuta poikkeusta</i> jos etsittävää elementtiä ei löydy. 

Komentoa voidaan hyödyntää esim. varmistamaan, että jokin asia <i>ei renderöidy</i>:

```js 
test('does not render this', () => {
  const note = {
    content: 'This is a reminder',
    important: true
  }

  render(<Note note={note} />)

  const element = screen.queryByText('do not want this thing to be rendered')
  expect(element).toBeNull()
})
```

### Testauskattavuus

[Testauskattavuus](https://vitest.dev/guide/coverage.html#coverage) saadaan helposti selville suorittamalla testit komennolla

```js
npm test -- --coverage
```

Kun suoritat ensimmäistä kertaa komennon, kysyy Vitest haluatko asentaa tarvittavan apukirjaston _@vitest/coverage-v8_. Asenna se, ja suorita komento uudelleen:

![Konsoliin tulostuu taulukko joka näyttää kunkin tiedoston testien kattavuusraportin sekä mahdolliset testien kattamattomat rivit](../../images/5/18new.png)

HTML-muotoinen raportti generoituu hakemistoon <i>coverage</i>. HTML-muotoinen raportti kertoo mm. yksittäisten komponentin testaamattomat koodirivit:

![Selaimeen renderöityy näkymä tiedostoista jossa värein merkattu ne rivit joita testit eivät kattaneet](../../images/5/19newer.png)

Sovelluksen tämänhetkinen koodi on kokonaisuudessaan [GitHubissa](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-8), branchissa <i>part5-8</i>.

</div>

<div class="tasks">

### Tehtävät 5.13.-5.16.

#### 5.13: blogilistan testit, step1

Tee testi, joka varmistaa että blogin näyttävä komponentti renderöi blogin titlen ja authorin mutta ei renderöi oletusarvoisesti urlia eikä likejen määrää. Mikäli toteutit tehtävän 5.7, niin pelkkä titlen renderöinnin testaus riittää.

#### 5.14: blogilistan testit, step2

Tee testi, joka varmistaa että myös url, likejen määrä ja käyttäjä näytetään, kun blogin kaikki tiedot näyttävää nappia on painettu.

#### 5.15: blogilistan testit, step3

Tee testi, joka varmistaa, että jos komponentin <i>like</i>-nappia painetaan kahdesti, komponentin propsina saamaa tapahtumankäsittelijäfunktiota kutsutaan kaksi kertaa.

#### 5.16: blogilistan testit, step4

Tee uuden blogin luomisesta huolehtivalle lomakkeelle testi, joka varmistaa, että lomake kutsuu propsina saamaansa takaisinkutsufunktiota oikeilla tiedoilla siinä vaiheessa kun blogi luodaan.

</div>

<div class="content">

### Frontendin integraatiotestaus

Suoritimme edellisessä osassa backendille integraatiotestejä, jotka testasivat backendin tarjoaman API:n läpi backendia ja tietokantaa. Backendin testauksessa tehtiin tietoinen päätös olla kirjoittamatta yksikkötestejä, sillä backendin koodi on melko suoraviivaista ja ongelmat tulevatkin esiin todennäköisemmin juuri monimutkaisemmissa skenaarioissa, joita integraatiotestit testaavat hyvin.

Toistaiseksi kaikki frontendiin tekemämme testit ovat olleet yksittäisten komponenttien oikeellisuutta valvovia yksikkötestejä. Yksikkötestaus on toki välillä hyödyllistä, mutta kattavinkaan yksikkötestaus ei riitä antamaan riittävää luotettavuutta sille, että järjestelmä toimii kokonaisuudessaan.

Voisimme tehdä myös frontendille useiden komponenttien yhteistoiminnallisuutta testaavia integraatiotestejä, mutta se on oleellisesti yksikkötestausta hankalampaa, sillä integraatiotesteissä jouduttaisiin ottamaan kantaa mm. palvelimelta haettavan datan mockaamiseen. Päätämmekin keskittyä koko sovellusta testaavien <i>end to end ‑testien</i> tekemiseen, jonka parissa jatkamme tämän osan seuraavassa luvussa.

### Snapshot-testaus

Vitest tarjoaa "perinteisen" testaustavan lisäksi aivan uudenlaisen tavan testaukseen, ns. [snapshot](https://vitest.dev/guide/snapshot)-testauksen. Mielenkiintoista snapshot-testauksessa on se, että sovelluskehittäjän ei tarvitse itse määritellä ollenkaan testejä, snapshot-testauksen käyttöönotto riittää.

Periaatteena on verrata aina koodin muutoksen jälkeen komponenttien määrittelemää HTML:ää siihen HTML:ään, jonka komponentit määrittelivät ennen muutosta.

Jos snapshot-testi huomaa muutoksen komponenttien määrittelemässä HTML:ssä, voi kyseessä olla joko haluttu muutos tai vahingossa aiheutettu "bugi". Snapshot-testi huomauttaa sovelluskehittäjälle, jos komponentin määrittelemä HTML muuttuu. Sovelluskehittäjä kertoo muutosten yhteydessä, oliko muutos haluttu. Jos muutos tuli yllätyksenä eli kyseessä oli bugi, sovelluskehittäjä huomaa sen snapshot-testauksen ansiosta nopeasti.

Emme kuitenkaan käytä tällä kurssilla snapshot-testausta.

</div>
