---
mainImage: ../../images/part-5.svg
part: 5
letter: c
---

<div class="content">

## React-sovelluksen testaus

Reactilla tehtyjen frontendien testaamiseen on monia tapoja. Aloitetaan niihin tutustuminen nyt.

Testit tehdään samaan tapaan kuin edellisessä osassa eli Facebookin [Jest](http://jestjs.io/)-kirjastolla. Jest onkin valmiiksi konfiguroitu create-react-app:illa luotuihin projekteihin.

Jestin lisäksi käytetään AirBnB:n kehittämää [enzyme](https://github.com/airbnb/enzyme)-kirjastoa.

Asennetaan enzyme komennolla:

```bash
npm install --save-dev enzyme enzyme-adapter-react-16
```

Testataan aluksi muistiinpanon renderöivää komponenttia:

```html
const Note = ({ note, toggleImportance }) => {
  const label = note.important ? 'make not important' : 'make important'
  return (
    <div className="wrapper">
      <div className="content">
        {note.content}
      </div>
      <div>
        <button onClick={toggleImportance}>{label}</button>
      </div>
    </div>
  )
}
```

Testauksen helpottamiseksi komponenttiin on lisätty sisällön määrittelevälle _div_-elementille [CSS-luokka](https://reactjs.org/docs/dom-elements.html#classname) _content_.

### shallow-renderöinti

Ennen testien tekemistä, tehdään _enzymen_ konfiguraatioita varten tiedosto _src/setupTests.js_ ja sille seuraava sisältö:

```js
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })
```

Nyt olemme valmiina testien tekemiseen.

Koska _Note_ on yksinkertainen komponentti, joka ei käytä yhtään monimutkaista alikomponenttia vaan renderöi suoraan HTML:ää, sopii sen testaamiseen hyvin enzymen [shallow](http://airbnb.io/enzyme/docs/api/shallow.html)-renderöijä.

Tehdään testi tiedostoon _src/components/Note.test.js_, eli samaan hakemistoon, missä komponentti itsekin sijaitsee.

Ensimmäinen testi varmistaa, että komponentti renderöi muistiinpanon sisällön:

```html
import React from 'react'
import { shallow } from 'enzyme'
import Note from './Note'

describe.only('<Note />', () => {
  it('renders content', () => {
    const note = {
      content: 'Komponenttitestaus tapahtuu jestillä ja enzymellä',
      important: true
    }

    const noteComponent = shallow(<Note note={note} />)
    const contentDiv = noteComponent.find('.content')

    expect(contentDiv.text()).toContain(note.content)
  })
})
```

Edellisessä osassa määrittelimme testitapaukset metodin [test](https://facebook.github.io/jest/docs/en/api.html#testname-fn-timeout) avulla. Nyt käytössä oleva _it_ viittaa samaan olioon kuin _test_, eli on sama kumpaa käytät. It on tietyissä piireissä suositumpi ja käytössä mm. Enzymen dokumentaatiossa joten käytämme it-muotoa tässä osassa.

Alun konfiguroinnin jälkeen testi renderöi komponentin metodin _shallow_ avulla:

```html
const noteComponent = shallow(<Note note={note} />)
```

Normaalisti React-komponentit renderöityvät _DOM_:iin. Nyt kuitenkin renderöimme komponentteja [shallowWrapper](http://airbnb.io/enzyme/docs/api/shallow.html)-tyyppisiksi, testaukseen sopiviksi olioiksi.

ShallowWrapper-muotoon renderöidyillä React-komponenteilla on runsaasti metodeja, joiden avulla niiden sisältöä voidaan tutkia. Esimerkiksi [find](http://airbnb.io/enzyme/docs/api/ShallowWrapper/find.html) mahdollistaa komponentin sisällä olevien _elementtien_ etsimisen [enzyme-selektorien](http://airbnb.io/enzyme/docs/api/selector.html) avulla. Eräs tapa elementtien etsimiseen on [CSS-selektorien](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors) käyttö. Liitimme muistiinpanon sisällön kertovaan div-elementtiin luokan _content_, joten voimme etsiä elementin seuraavasti:

```js
const contentDiv = noteComponent.find('.content')
```

ekspektaatiossa varmistamme, että elementtiin on renderöitynyt oikea teksti, eli muistiinpanon sisältö:

```js
expect(contentDiv.text()).toContain(note.content)
```

### Testien suorittaminen

Create-react-app:issa on konfiguroitu testit oletusarvoisesti suoritettavaksi ns. watch-moodissa, eli jos suoritat testit komennolla _npm test_, jää konsoli odottamaan koodissa tapahtuvia muutoksia. Muutosten jälkeen testit suoritetaan automaattisesti ja Jest alkaa taas odottamaan uusia muutoksia koodiin.

Jos haluat ajaa testit "normaalisti", se onnistuu komennolla

```bash
CI=true npm test
```

Konsoli saattaa herjata virhettä, jos sinulla ei ole asennettuna watchmania. Watchman on Facebookin kehittämä tiedoston muutoksia tarkkaileva ohjelma. Ohjelma nopeuttaa testien ajoa ja ainakin osx sierrasta ylöspäin jatkuva testien vahtiminen aiheuttaa käyttäjillä virheilmoituksia. Näistä ilmoituksista pääsee eroon asentamalla Watchmanin.

Ohjeet ohjelman asentamiseen eri käyttöjärjestelmille löydät Watchmanin sivulta:
https://facebook.github.io/watchman/

Mikäli testejä suoritettaessa ei löydetä tiedostossa _src/setupTests.js_ tehtyä adapterin konfigurointia, auttaa seuraavan asetuksen lisääminen tiedostoon package-lock.json:

```
  "jest": {
    ...
    "setupFiles": [
      "<rootDir>/src/setupTests.js"
    ],
    ...
  }
```

### Testien sijainti

Reactissa on (ainakin) [kaksi erilaista](https://medium.com/@JeffLombardJr/organizing-tests-in-jest-17fc431ff850) konventiota testien sijoittamiseen. Sijoitimme testit ehkä vallitsevan tavan mukaan, eli samaan hakemistoon missä testattava komponentti sijaitsee.

Toinen tapa olisi sijoittaa testit "normaaliin" tapaan omaan erilliseen hakemistoon. Valitaanpa kumpi tahansa tapa, on varmaa että se on jonkun mielestä täysin väärä.

Itse en pidä siitä, että testit ja normaali koodi ovat samassa hakemistossa. Noudatamme kuitenkin nyt tätä tapaa, sillä se on oletusarvo create-react-app:illa konfiguroiduissa sovelluksissa.

### Testien debuggaaminen

Testejä tehdessä törmäämme tyypillisesti erittäin moniin ongelmiin. Näissä tilanteissa vanha kunnon _console.log_ on hyödyllinen. Voimme tulostaa _shallow_-metodin avulla renderöityjä komponentteja ja niiden sisällä olevia elementtejä metodin [debug](http://airbnb.io/enzyme/docs/api/ShallowWrapper/debug.html) avulla:

```bash
describe.only('<Note />', () => {
  it('renders content', () => {
    const note = {
      content: 'Komponenttitestaus tapahtuu jestillä ja enzymellä',
      important: true
    }

    const noteComponent = shallow(<Note note={note} />)
    console.log(noteComponent.debug())


    const contentDiv = noteComponent.find('.content')
    console.log(contentDiv.debug())

    // ...
  })
})
```

Konsoliin tulostuu komponentin generoima html:

```bash
console.log src/components/Note.test.js:16
  <div className="wrapper">
    <div className="content">
      Komponenttitestaus tapahtuu jestillä ja enzymellä
    </div>
    <div>
      <button onClick={[undefined]}>
        make not important
      </button>
    </div>
  </div>

console.log src/components/Note.test.js:20
  <div className="content">
    Komponenttitestaus tapahtuu jestillä ja enzymellä
  </div>
```

### Nappien painelu testeissä

Sisällön näyttämisen lisäksi toinen _Note_-komponenttien vastuulla oleva asia on huolehtia siitä, että painettaessa noten yhteydessä olevaa nappia, tulee propsina välitettyä tapahtumankäsittelijäfunktiota _toggleImportance_ kutsua.

Testaus onnistuu seuraavasti:

```bash
it('clicking the button calls event handler once', () => {
  const note = {
    content: 'Komponenttitestaus tapahtuu jestillä ja enzymellä',
    important: true
  }

  const mockHandler = jest.fn()

  const noteComponent = shallow(
    <Note
      note={note}
      toggleImportance={mockHandler}
    />
  )

  const button = noteComponent.find('button')
  button.simulate('click')

  expect(mockHandler.mock.calls.length).toBe(1)
})
```

Testissä on muutama mielenkiintoinen seikka. Tapahtumankäsittelijäksi annetaan Jestin avulla määritelty [mock](https://facebook.github.io/jest/docs/en/mock-functions.html)-funktio:

```js
const mockHandler = jest.fn()
```

Testi hakee renderöidystä komponentista _button_-elementin ja klikkaa sitä. Koska komponentissa on ainoastaan yksi nappi, on sen hakeminen helppoa:

```js
const button = noteComponent.find('button')
button.simulate('click')
```

Klikkaaminen tapahtuu metodin [simulate](http://airbnb.io/enzyme/docs/api/ShallowWrapper/simulate.html) avulla.

Testin ekspektaatio varmistaa, että _mock-funktiota_ on kutsuttu täsmälleen kerran:

```js
expect(mockHandler.mock.calls.length).toBe(1)
```

[Mockoliot ja -funktiot](https://en.wikipedia.org/wiki/Mock_object) ovat testauksessa yleisesti käytettyjä valekomponentteja, joiden avulla korvataan testattavien komponenttien riippuvuuksia, eli niiden tarvitsemia muita komponentteja. Mockit mahdollistavat mm. kovakoodattujen syötteiden palauttamisen sekä niiden metodikutsujen lukumäärän sekä parametrien testauksen aikaisen tarkkailun.

Esimerkissämme mock-funktio sopi tarkoitukseen erinomaisesti, sillä sen avulla on helppo varmistaa, että metodia on kutsuttu täsmälleen kerran.

### Komponentin _Togglable_ testit

Tehdään komponentille _Togglable_ muutama testi. Lisätään komponentin lapset renderöivään div-elementtiin CSS-luokka _togglableContent_:

```react
class Togglable extends React.Component {

  render() {
    const hideWhenVisible = { display: this.state.visible ? 'none' : '' }
    const showWhenVisible = { display: this.state.visible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={this.toggleVisibility}>{this.props.buttonLabel}</button>
        </div>
        <div style={showWhenVisible} className="togglableContent">
          {this.props.children}
          <button onClick={this.toggleVisibility}>cancel</button>
        </div>
      </div>
    )
  }
}
```

Testit ovat seuraavassa

```react
import React from 'react'
import { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Note from './Note'
import Togglable from './Togglable'

describe('<Togglable />', () => {
  let togglableComponent

  beforeEach(() => {
    togglableComponent = shallow(
      <Togglable buttonLabel="show...">
        <div className="testDiv" />
      </Togglable>
    )
  })

  it('renders its children', () => {
    expect(togglableComponent.contains(<div className="testDiv" />)).toEqual(true)
  })

  it('at start the children are not displayed', () => {
    const div = togglableComponent.find('.togglableContent')
    expect(div.getElement().props.style).toEqual({ display: 'none' })
  })

  it('after clicking the button, children are displayed', () => {
    const button = togglableComponent.find('button')

    button.at(0).simulate('click')
    const div = togglableComponent.find('.togglableContent')
    expect(div.getElement().props.style).toEqual({ display: '' })
  })

})
```

Ennen jokaista testiä suoritettava _beforeEach_ alustaa shallow-renderöimällä _Togglable_-komponentin muuttujaan _togglableComponent_.

Ensimmäinen testi tarkastaa, että _Togglable_ renderöi lapsikomponentin _<div className="testDiv" />_. Loput testit varmistavat, että Togglablen sisältämä lapsikomponentti on alussa näkymättömissä, eli sen sisältävään _div_-elementtiin liittyy tyyli _{ display: 'none' }_, ja että nappia painettaessa komponentti näkyy, eli tyyli on _{ display: '' }_. Koska Togglablessa on kaksi nappia, painallusta simuloidessa niistä pitää valita oikea, eli tällä kertaa ensimmäinen.

## Tehtäviä

Tee nyt tehtävät [5.12-14](/tehtävät#komponenttien-testaaminen)

### mount ja full DOM -renderöinti

Käyttämämme _shallow_-renderöijä on useimmista tapauksissa riittävä. Joskus tarvitsemme kuitenkin järeämmän työkalun sillä _shallow_ renderöi ainoastaan "yhden tason", eli sen komponentin, jolle metodia kutsutaan.

Jos yritämme esim. sijoittaa kaksi _Note_-komponenttia _Togglable_-komponentin sisälle ja tulostamme syntyvän _ShallowWrapper_ -olion

```bash
it('shallow renders only one level', () => {
  const note1 = {
    content: 'Komponenttitestaus tapahtuu jestillä ja enzymellä',
    important: true
  }
  const note2 = {
    content: 'shallow ei renderöi alikomponentteja',
    important: true
  }

  const togglableComponent = shallow(
    <Togglable buttonLabel="show...">
      <Note note={note1} />
      <Note note={note2} />
    </Togglable>
  )

  console.log(togglableComponent.debug())
})
```

huomaamme, että _Togglable_ komponentti on renderöitynyt, eli "muuttunut" HTML:ksi, mutta sen sisällä olevat _Note_-komponentit eivät ole HTML:ää vaan React-komponentteja.

```bash
<div>
  <div style={{...}}>
    <button onClick={[Function]}>
      show...
    </button>
  </div>
  <div style={{...}} className="togglableContent">
    <Note note={{...}} />
    <Note note={{...}} />
    <button onClick={[Function]}>
      cancel
    </button>
  </div>
</div>
```

Jos komponentille tehdään edellisten esimerkkien tapaan yksikkötestejä, _shallow_-renderöinti on useimmiten riittävä. Jos haluamme testata isompia kokonaisuuksia, eli tehdä frontendin _integraatiotestausta_, ei _shallow_-renderöinti riitä vaan on turvauduttava komponentit kokonaisuudessaan renderöivään [mount](http://airbnb.io/enzyme/docs/api/mount.html):iin.

Muutetaan testi käyttämään _shallowin_ sijaan _mountia_:

```react
import React from 'react'
import { shallow, mount } from 'enzyme'
import Note from './Note'
import Togglable from './Togglable'

it('mount renders all components', () => {
  const note1 = {
    content: 'Komponenttitestaus tapahtuu jestillä ja enzymellä',
    important: true
  }
  const note2 = {
    content: 'mount renderöi myös alikomponentit',
    important: true
  }

  const noteComponent = mount(
    <Togglable buttonLabel="show...">
      <Note note={note1} />
      <Note note={note2} />
    </Togglable>
  )

  console.log(noteComponent.debug())
})
```

Tuloksena on kokonaisuudessaan HTML:ksi renderöitynyt _Togglable_-komponentti:

```bash
<Togglable buttonLabel="show...">
  <div>
    <div style={{...}}>
      <button onClick={[Function]}>
        show...
      </button>
    </div>
    <div style={{...}} className="togglableContent">
      <Note note={{...}}>
        <div className="wrapper">
          <div className="content">
            Komponenttitestaus tapahtuu jestillä ja enzymellä
          </div>
          <div>
            <button onClick={[undefined]}>
              make not important
            </button>
          </div>
        </div>
      </Note>
      <Note note={{...}}>
        <div className="wrapper">
          <div className="content">
            mount renderöi myös alikomponentit
          </div>
          <div>
            <button onClick={[undefined]}>
              make not important
            </button>
          </div>
        </div>
      </Note>
      <button onClick={[Function]}>
        cancel
      </button>
    </div>
  </div>
</Togglable>
```

Mountin avulla renderöitäessä testi pääsee siis käsiksi periaatteessa samaan HTML-koodiin, joka todellisuudessa renderöidään selaimeen ja tämä luonnollisesti mahdollistaa huomattavasti monipuolisemman testauksen kuin _shallow_-renderöinti. Komennolla _mount_ tapahtuva renderöinti on kuitenkin hitaampaa, joten jos _shallow_ riittää, sitä kannattaa käyttää.

Huomaa, että testin käyttämä metodi [debug](http://airbnb.io/enzyme/docs/api/ReactWrapper/debug.html) ei palauta todellista HTML:ää vaan debuggaustarkoituksiin sopivan tekstuaalisen esitysmuodon komponentista. Todellisessa HTML:ssä ei mm. ole ollenkaan React-komponenttien tageja.

Jos on tarvetta tietää, mikä on testattaessa syntyvä todellinen HTML, sen saa selville metodilla [html](http://airbnb.io/enzyme/docs/api/ReactWrapper/html.html).

Jos muutamme testin viimeisen komennon muotoon

```js
console.log(noteComponent.html())
```
tulostuu todellinen HTML:

```html
<div>
  <div><button>show...</button></div>
  <div style="display: none;">
    <div class="wrapper">
      <div class="content">Komponenttitestaus tapahtuu jestillä ja enzymellä</div>
      <div><button>make not important</button></div>
    </div>
    <div class="wrapper">
      <div class="content">mount renderöi myös alikomponentit</div>
      <div><button>make not important</button></div>
    </div>
    <button>cancel</button></div>
</div>
```

Komento _mount_ palauttaa renderöidyn "komponenttipuun" [ReactWrapper](https://airbnb.io/enzyme/docs/api/mount.html#mountnode-options--reactwrapper)-tyyppisenä oliona, joka tarjoaa hyvin samantyyppisen rajapinnan komponentin sisällön tutkimiseen kuin _ShallowWrapper_.

### Lomakkeiden testaus

Lomakkeiden testaaminen Enzymellä on jossain määrin haasteellista. Enzymen dokumentaatio ei mainitse lomakkeista sanaakaan. [Issueissa](https://github.com/airbnb/enzyme/issues/364) asiasta kuitenkin keskustellaan.

Tehdään testi komponentille _NoteForm_. Lomakkeen koodi näyttää seuraavalta

```react
const NoteForm = ({ onSubmit, handleChange, value }) => {
  return (
    <div>
      <h2>Luo uusi muistiinpano</h2>

      <form onSubmit={onSubmit}>
        <input
          value={value}
          onChange={handleChange}
        />
        <button type="submit">tallenna</button>
      </form>
    </div>
  )
}
```

Lomakkeen toimintaperiaatteena on synkronoida lomakkeen tila sen ulkopuolella olevan React-komponentin tilaan. Lomakettamme on jossain määrin vaikea testata yksistään.

Teemmekin testejä varten apukomponentin _Wrapper_, joka renderöi _NoteForm_:in ja hallitsee lomakkeen tilaa:

```react
class Wrapper extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      formInput: ''
    }
  }
  onChange = (e) => {
    this.setState({ formInput: e.target.value })
  }
  render() {
    return (
      <NoteForm
        value={this.state.formInput}
        onSubmit={this.props.onSubmit}
        handleChange={this.onChange}
      />
  )}
}
```

Testi on seuraavassa:

```react
import React from 'react'
import { mount } from 'enzyme'
import NoteForm from './NoteForm'

it('renders content', () => {
  const onSubmit = jest.fn()

  const wrapper = mount(
    <Wrapper onSubmit={onSubmit} />
  )

  const input = wrapper.find('input')
  const button = wrapper.find('button')

  input.simulate('change', { target: { value: 'lomakkeiden testaus on hankalaa' } })
  button.simulate('submit')

  expect(wrapper.state().formInput).toBe('lomakkeiden testaus on hankalaa')
  expect(onSubmit.mock.calls.length).toBe(1)
})
```

Testi luo _Wrapper_-komponentin, jolle se välittää propseina mockatun funktion _onSubmit_. Wrapper välittää funktion edelleen _NoteFormille_ tapahtuman _onSubmit_ käsittelijäksi.

Syötekenttään _input_ kirjoittamista simuloidaan tekemällä syötekenttään tapahtuma _change_ ja määrittelemällä sopiva olio, joka määrittelee syötekenttään 'kirjoitetun' sisällön.

Lomakkeen nappia tulee painaa simuloimalla tapahtumaa _submit_, tapahtuma _click_ ei lähetä lomaketta.

Testin ensimmäinen ekspektaatio tutkii komponentin _Wrapper_ tilaa metodilla [state](http://airbnb.io/enzyme/docs/api/ReactWrapper/state.html), ja varmistaa, että lomakkeelle kirjoitettu teksti on siirtynyt tilaan. Toinen ekspektaatio varmistaa, että lomakkeen lähetys on aikaansaanut tapahtumankäsittelijän kutsumisen.

## Frontendin integraatiotestaus

Suoritimme edellisessä osassa backendille integraatiotestejä, jotka testasivat backendin tarjoaman API:n läpi backendia ja tietokantaa. Backendin testauksessa tehtiin tietoinen päätös olla kirjoittamatta yksikkötestejä sillä backendin koodi on melko suoraviivaista ja ongelmat tulevatkin esiin todennäköisemmin juuri monimutkaisemmissa skenaarioissa, joita integraatiotestit testaavat hyvin.

Toistaiseksi kaikki frontendiin tekemämme testit ovat olleet yksittäisten komponenttien oikeellisuutta valvovia yksikkötestejä. Yksikkötestaus on toki tärkeää, mutta kattavinkaan yksikkötestaus ei riitä antamaan riittävää luotettavuutta sille, että järjestelmä toimii kokonaisuudessaan.

Tehdään nyt sovellukselle yksi integraatiotesti. Integraatiotestaus on huomattavasti komponenttien yksikkötestausta hankalampaa. Erityisesti sovelluksemme kohdalla ongelmia aiheuttaa kaksi seikkaa: sovellus hakee näytettävät muistiinpanot palvelimelta _ja_ sovellus käyttää local storagea kirjautuneen käyttäjän tietojen tallettamiseen.

Local storage ei ole oletusarvoiseti käytettävissä testejä suorittaessa, sillä kyseessä on selaimen tarjoama toiminnallisuus ja testit ajetaan selaimen ulkopuolella. Ongelma on helppo korjata määrittelemällä testien suorituksen ajaksi _mock_ joka matkii local storagea. Tapoja tähän on [monia](https://stackoverflow.com/questions/32911630/how-do-i-deal-with-localstorage-in-jest-tests).

Koska testimme ei edellytä local storagelta juuri mitään toiminnallisuutta, teemme tiedostoon [src/setupTests.js](https://github.com/facebookincubator/create-react-app/blob/ed5c48c81b2139b4414810e1efe917e04c96ee8d/packages/react-scripts/template/README.md#initializing-test-environment) hyvin yksinkertaisen mockin

```js
let savedItems = {}

const localStorageMock = {
  setItem: (key, item) => {
    savedItems[key] = item
  },
  getItem: (key) => savedItems[key],
  clear: savedItems = {}
}

window.localStorage = localStorageMock
```

Toinen ongelmistamme on se, että sovellus hakee näytettävät muistiinpanot palvelimelta. Muistiinpanojen haku tapahtuu heti komponentin _App_ luomisen jälkeen, kun metodi _componentDidMount_ kutsuu _noteService_:n metodia _getAll_:


```js
componentDidMount() {
  noteService.getAll().then(notes =>
    this.setState({ notes })
  )

  // ...
}
```

Jestin [manual mock](https://facebook.github.io/jest/docs/en/manual-mocks.html#content) -konsepti tarjoaa tilanteeseen hyvän ratkaisun. Manual mockien avulla voidaan kokonainen moduuli, tässä tapauksessa _noteService_ korvata testien ajaksi vaihtoehtoisella esim. kovakoodattua dataa tarjoavalla toiminnallisuudella.

Luodaan Jestin ohjeiden mukaisesti hakemistoon _src/services_ alihakemisto *\_\_mocks\_\_* (alussa ja lopussa kaksi alaviivaa) ja sinne tiedosto _notes.js_ jonka määrittelemä metodi _getAll_ palauttaa kovakoodatun listan muistiinpanoja:

```js
let token = null

const notes = [
  {
    id: "5a451df7571c224a31b5c8ce",
    content: "HTML on helppoa",
    date: "2017-12-28T16:38:15.541Z",
    important: false,
    user: {
      _id: "5a437a9e514ab7f168ddf138",
      username: "mluukkai",
      name: "Matti Luukkainen"
    }
  },
  {
    id: "5a451e21e0b8b04a45638211",
    content: "Selain pystyy suorittamaan vain javascriptiä",
    date: "2017-12-28T16:38:57.694Z",
    important: true,
    user: {
      _id: "5a437a9e514ab7f168ddf138",
      username: "mluukkai",
      name: "Matti Luukkainen"
    }
  },
  {
    id: "5a451e30b5ffd44a58fa79ab",
    content: "HTTP-protokollan tärkeimmät metodit ovat GET ja POST",
    date: "2017-12-28T16:39:12.713Z",
    important: true,
    user: {
      _id: "5a437a9e514ab7f168ddf138",
      username: "mluukkai",
      name: "Matti Luukkainen"
    }
  }
]

const getAll = () => {
  return Promise.resolve(notes)
}

export default { getAll, notes }
```

Määritelty metodi _getAll_ palauttaa muistiinpanojen listan käärittynä promiseksi metodin [Promise.resolve](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve) avulla sillä käytettäessä metodia, oletetaan sen paluuarvon olevan promise:

```js
noteService.getAll().then(notes =>
```

Olemme valmiina määrittelemään testin:

```js
import React from 'react'
import { mount } from 'enzyme'
import App from './App'
import Note from './components/Note'
jest.mock('./services/notes')
import noteService from './services/notes'

describe('<App />', () => {
  let app
  beforeAll(() => {
    app = mount(<App />)
  })

  it('renders all notes it gets from backend', () => {
    app.update()
    const noteComponents = app.find(Note)
    expect(noteComponents.length).toEqual(noteService.notes.length)
  })
})
```

Komennolla _jest.mock('./services/notes')_ otetaan juuri määritelty mock käyttöön. Loogisempi paikka komennolle olisi kenties testien määrittelyt tekevä tiedosto _src/setupTests.js_

Testin toimivuuden kannalta on oleellista metodin [app.update](http://airbnb.io/enzyme/docs/api/ReactWrapper/update.html) kutsuminen, näin pakotetaan sovellus renderöitymään uudelleen siten, että myös mockatun backendin palauttamat muistiinpanot renderöityvät.

## Testauskattavuus

[Testauskattavuus](https://github.com/facebookincubator/create-react-app/blob/ed5c48c81b2139b4414810e1efe917e04c96ee8d/packages/react-scripts/template/README.md#coverage-reporting) saadaan helposti selville suorittamalla testit komennolla

```bash
CI=true npm test -- --coverage
```

![]({{ "/assets/5/8.png" | absolute_url }})

Melko primitiivinen HTML-muotoinen raportti generoituu hakemistoon _coverage/lcov-report_. HTML-muotoinen raportti kertoo mm. yksittäisen komponenttien testaamattomat koodirivit:

![]({{ "/assets/5/9.png" | absolute_url }})

Huomaamme, että parannettavaa jäi vielä runsaasti.

Sovelluksen tämänhetkinen koodi on kokonaisuudessaan [githubissa](https://github.com/fullstack-hy2019part2-notes/tree/part5-5), tagissa _part5-5_.

## Tehtäviä

Tee nyt tehtävät [5.15 ja 5.16](/tehtävät#integraatiotestaus)

## Snapshot-testaus

Jest tarjoaa "perinteisen" testaustavan lisäksi aivan uudenlaisen tavan testaukseen, ns. [snapshot](https://facebook.github.io/jest/docs/en/snapshot-testing.html)-testauksen. Mielenkiintoista snapshot-testauksessa on se, että sovelluskehittäjän ei tarvitse itse määritellä ollenkaan testejä, snapshot-testauksen käyttöönotto riittää.

Periaatteena on verrata komponenttien määrittelemää HTML:ää aina koodin muutoksen jälkeen siihen, minkälaisen HTML:n komponentit määrittelivät ennen muutosta.

Jos snapshot-testi huomaa muutoksen komponenttien määrittelemässä HTML:ssä, voi kyseessä joko olla haluttu muutos tai vahingossa aiheutettu "bugi". Snapshot-testi huomauttaa sovelluskehittäjälle, jos komponentin määrittelemä HTML muuttuu. Sovelluskehittäjä kertoo muutosten yhteydessä, oliko muutos haluttu. Jos muutos tuli yllätyksenä, eli kyseessä oli bugi, sovelluskehittäjä huomaa sen snapshot-testauksen ansiosta nopeasti.

## End to end -testaus

Olemme tehneet sekä backendille että frontendille hieman niitä kokonaisuutena testaavia integraatiotestejä. Eräs tärkeä testauksen kategoria on vielä käsittelemättä, [järjestelmää kokonaisuutena](https://en.wikipedia.org/wiki/System_testing) testaavat "end to end" (eli E2E) -testit.

Web-sovellusten E2E-testaus tapahtuu simuloidun selaimen avulla esimerkiksi [Selenium](http://www.seleniumhq.org)-kirjastoa käyttäen. Toinen vaihtoehto on käyttää ns. [headless browseria](https://en.wikipedia.org/wiki/Headless_browser) eli selainta, jolla ei ole ollenkaan graafista käyttöliittymää. Esim. Chromea on mahdollista suorittaa Headless-moodissa.

E2E testit ovat potentiaalisesti kaikkein hyödyllisin testikategoria, sillä ne tutkivat järjestelmää saman rajapinnan kautta kuin todelliset käyttäjät.

E2E-testeihin liittyy myös ikäviä puolia. Niiden konfigurointi on haastavampaa kuin yksikkö- ja integraatiotestien. E2E-testit ovat tyypillisesti myös melko hitaita ja isommassa ohjelmistossa niiden suoritusaika voi helposti nousta minuutteihin, tai jopa tunteihin. Tämä on ikävää sovelluskehityksen kannalta, sillä sovellusta koodatessa on erittäin hyödyllistä pystyä ajamaan testejä mahdollisimman usein koodin regressioiden varalta.

Palaamme end to end -testeihin kurssin viimeisessä, eli seitsemännessä osassa.

</div>
