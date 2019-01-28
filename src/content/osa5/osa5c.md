---
mainImage: ../../images/part-5.svg
part: 5
letter: c
---

<div class="content">

Reactilla tehtyjen frontendien testaamiseen on monia tapoja. Aloitetaan niihin tutustuminen nyt.

Testit tehdään samaan tapaan kuin edellisessä osassa eli Facebookin [Jest](http://jestjs.io/)-kirjastolla. Jest onkin valmiiksi konfiguroitu create-react-app:illa luotuihin projekteihin.

Jestin lisäksi käytetään AirBnB:n kehittämää [enzyme](https://github.com/airbnb/enzyme)-kirjastoa.

Asennetaan enzyme komennolla:

```js
npm install --save-dev enzyme enzyme-adapter-react-16
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

Huomaa, että blogin sisältävällä <i>li</i>-edelmentillä on [CSS](https://reactjs.org/docs/dom-elements.html#classname)-luokka <i>note</i>, pääsemme sen avulla blogiin käsiksi testistä.

### shallow-renderöinti

Ennen testien tekemistä, tehdään <i>enzymen</i> konfiguraatioita varten tiedosto <i>src/setupTests.js</i> ja sille seuraava sisältö:

```js
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })
```

Nyt olemme valmiina testien tekemiseen.

Koska <i>Note</i> on yksinkertainen komponentti, joka ei käytä yhtään monimutkaista alikomponenttia vaan renderöi suoraan HTML:ää, sopii sen testaamiseen hyvin enzymen [shallow](http://airbnb.io/enzyme/docs/api/shallow.html)-renderöijä.

Tehdään testi tiedostoon <i>src/components/Note.test.js</i>, eli samaan hakemistoon, missä komponentti itsekin sijaitsee.

Ensimmäinen testi varmistaa, että komponentti renderöi muistiinpanon sisällön:

```js
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
    const contentElement = noteComponent.find('.content')

    expect(contentElement.text()).toContain(note.content)
  })
})
```

Edellisessä osassa määrittelimme testitapaukset metodin [test](https://facebook.github.io/jest/docs/en/api.html#testname-fn-timeout) avulla. Nyt käytössä oleva _it_ viittaa samaan olioon kuin _test_, eli on sama kumpaa käytät. It on tietyissä piireissä suositumpi ja käytössä mm. Enzymen dokumentaatiossa joten käytämme it-muotoa tässä osassa.

Alun konfiguroinnin jälkeen testi renderöi komponentin metodin _shallow_ avulla:

```js
const noteComponent = shallow(<Note note={note} />)
```

Normaalisti React-komponentit renderöityvät <i>DOM</i>:iin. Nyt kuitenkin renderöimme komponentteja [shallowWrapper](http://airbnb.io/enzyme/docs/api/shallow.html)-tyyppisiksi, testaukseen sopiviksi olioiksi.

ShallowWrapper-muotoon renderöidyillä React-komponenteilla on runsaasti metodeja, joiden avulla niiden sisältöä voidaan tutkia. Esimerkiksi [find](http://airbnb.io/enzyme/docs/api/ShallowWrapper/find.html) mahdollistaa komponentin sisällä olevien <i>elementtien</i> etsimisen [enzyme-selektorien](http://airbnb.io/enzyme/docs/api/selector.html) avulla. Eräs tapa elementtien etsimiseen on [CSS-selektorien](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors) käyttö. Muistiinpanon sisältävässä li-elementissä on CSS-luokka <i>note</i>, joten voimme etsiä elementin seuraavasti:

```js
const contentElement = noteComponent.find('.content')
```

ekspektaatiossa varmistamme, että elementtiin on renderöitynyt oikea teksti, eli muistiinpanon sisältö:

```js
expect(contentElement.text()).toContain(note.content)
```

### Testien suorittaminen

Create-react-app:issa on konfiguroitu testit oletusarvoisesti suoritettavaksi ns. watch-moodissa, eli jos suoritat testit komennolla _npm test_, jää konsoli odottamaan koodissa tapahtuvia muutoksia. Muutosten jälkeen testit suoritetaan automaattisesti ja Jest alkaa taas odottamaan uusia muutoksia koodiin.

Jos haluat ajaa testit "normaalisti", se onnistuu komennolla

```js
CI=true npm test
```

Konsoli saattaa herjata virhettä, jos sinulla ei ole asennettuna watchmania. Watchman on Facebookin kehittämä tiedoston muutoksia tarkkaileva ohjelma. Ohjelma nopeuttaa testien ajoa ja ainakin osx sierrasta ylöspäin jatkuva testien vahtiminen aiheuttaa käyttäjillä virheilmoituksia. Näistä ilmoituksista pääsee eroon asentamalla Watchmanin.

Ohjeet ohjelman asentamiseen eri käyttöjärjestelmille löydät Watchmanin sivulta:
https://facebook.github.io/watchman/

Mikäli testejä suoritettaessa ei löydetä tiedostossa <i>src/setupTests.js</i> tehtyä adapterin konfigurointia, auttaa seuraavan asetuksen lisääminen tiedostoon package-lock.json:

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

Testejä tehdessä törmäämme tyypillisesti erittäin moniin ongelmiin. Näissä tilanteissa vanha kunnon <i>console.log</i> on hyödyllinen. Voimme tulostaa _shallow_-metodin avulla renderöityjä komponentteja ja niiden sisällä olevia elementtejä metodin [debug](http://airbnb.io/enzyme/docs/api/ShallowWrapper/debug.html) avulla:

```js
describe.only('<Note />', () => {
  it('renders content', () => {
    const note = {
      content: 'Komponenttitestaus tapahtuu jestillä ja enzymellä',
      important: true
    }

    const noteComponent = shallow(<Note note={note} />)
    console.log(noteComponent.debug())


    const contentElement = noteComponent.find('.note')
    console.log(contentElement.debug())

    // ...
  })
})
```

Konsoliin tulostuu komponentin generoima html:

```js
  console.log src/components/Note.test.js:15
    <li className="note">
      Komponenttitestaus tapahtuu jestillä ja enzymellä
      <button onClick={[undefined]}>
        make not important
      </button>
    </li>
```

### Nappien painelu testeissä

Sisällön näyttämisen lisäksi toinen <i>Note</i>-komponenttien vastuulla oleva asia on huolehtia siitä, että painettaessa noten yhteydessä olevaa nappia, tulee propsina välitettyä tapahtumankäsittelijäfunktiota _toggleImportance_ kutsua.

Testaus onnistuu seuraavasti:

```js
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

Testi hakee renderöidystä komponentista <i>button</i>-elementin ja klikkaa sitä. Koska komponentissa on ainoastaan yksi nappi, on sen hakeminen helppoa:

```js
const button = noteComponent.find('button')
button.simulate('click')
```

Klikkaaminen tapahtuu metodin [simulate](http://airbnb.io/enzyme/docs/api/ShallowWrapper/simulate.html) avulla.

Testin ekspektaatio varmistaa, että <i>mock-funktiota</i> on kutsuttu täsmälleen kerran:

```js
expect(mockHandler.mock.calls.length).toBe(1)
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

**HUOM:** tällä hetkellä (27.1.2019) shallow-renderöinti [ei toimi komponenteille, joissa käytetään hookeja](https://github.com/facebook/react/pull/14567), eli käytä seuraavissa funktion _shallow_ sijaan funktiota _mount_. Tuen pitäisi olla valmiina helmikuun alkupuolella.

Testit ovat seuraavassa

```js
import React from 'react'
import { shallow, mount } from 'enzyme'
import Note from './Note'
import Togglable from './Togglable'

describe('<Togglable />', () => {
  let togglableComponent

  beforeEach(() => {
    // korvaa shallow funktiolla mount jos testit eivät toimi!
    togglableComponent = shallow(
      <Togglable buttonLabel="show...">
        <div className="testDiv" />
      </Togglable>
    )
  })

  it('renders its children', () => {
    expect(togglableComponent.contains(<div className="testDiv" />))
      .toEqual(true)
  })

  it('at start the children are not displayed', () => {
    const div = togglableComponent.find('.togglableContent')
    expect(div.getElement().props.style)
      .toEqual({ display: 'none' })
  })

  it('after clicking the button, children are displayed', () => {
    const button = togglableComponent.find('button')

    button.at(0).simulate('click')
    const div = togglableComponent.find('.togglableContent')
    expect(div.getElement().props.style)
      .toEqual({ display: '' })
  })

})
```

Ennen jokaista testiä suoritettava _beforeEach_ alustaa shallow-renderöimällä <i>Togglable</i>-komponentin muuttujaan _togglableComponent_.

Ensimmäinen testi tarkastaa, että <i>Togglable</i> renderöi sen lapsikomponentin `<div className="testDiv" />`. 

Loput testit varmistavat, että Togglablen sisältämä lapsikomponentti on alussa näkymättömissä, eli sen sisältävään <i>div</i>-elementtiin liittyy tyyli `{ display: 'none' }`, ja että nappia painettaessa komponentti näkyy, eli tyyli on `{ display: '' }`. Koska Togglablessa on kaksi nappia, painallusta simuloidessa niistä pitää valita oikea, eli tällä kertaa ensimmäinen.


Sovelluksen tämänhetkinen koodi on kokonaisuudessaan [githubissa](https://github.com/fullstack-hy2019part2-notes/tree/part5-6), branchissa _part5-6_.

</div>

<div class="tasks">

### Tehtäviä

#### 5.13: blogilistan testit, step1

Lisää sovellukseesi tilapäisesti seuraava komponentti

```js
import React from 'react'

const SimpleBlog = ({ blog, onClick }) => (
  <div>
    <div>
      {blog.title} {blog.author}
    </div>
    <div>
      blog has {blog.likes} likes
      <button onClick={onClick}>like</button>
    </div>
  </div>
)

export default SimpleBlog
```

Tee testi, joka varmistaa, että komponentti renderöi blogin titlen, authorin ja likejen määrän.

Lisää komponenttiin tarvittaessa testausta helpottavia CSS-luokkia.

#### 5.14*: blogilistan testit, step2

Tee testi, joka varmistaa, että jos komponentin <i>like</i>-nappia painetaan kahdesti, komponentin propsina saamaa tapahtumankäsittelijäfunktiota kutsutaan kaksi kertaa.

#### 5.15*: blogilistan testit, step3

Tee oman sovelluksesi komponentille <i>Blog</i> testit, jotka varmistavat, että oletusarvoisesti blogista on näkyvissä ainoastaan nimi ja kirjoittaja, ja että klikkaamalla niitä saadaan näkyviin myös muut osat blogin tiedoista.

**HUOM:** tee testissä klikkaus <i>ennen</i> kuin haet tarkastettavan elementin muuttujaan, eli tee komennot tässä järjestyksessä

```js
it('after clicking name the details are displayed', () => {
  // haetaan klikattava osa komponentista
  const nameDiv = ...
  nameDiv.simulate('click')

  // haetaan tarkastettava, eli detaljit sisältävä osa komponentista
  const contentDiv = ...
  expect(contentDiv...)
})
```

**väärä** järjestys on siis seuraava

```js
it('DOES NOT WORK', () => {
  const nameDiv = ...
  const contentDiv = ...

  // klikataan liian myöhään
  nameDiv.simulate('click')

  expect(contentDiv...)
})
```

**HUOM2:** tällä hetkellä (27.1.2019) shallow-renderöinti [ei toimi komponenteille, joissa käytetään hookeja](https://github.com/facebook/react/pull/14567), eli käytä  funktion _shallow_ sijaan funktiota _mount_ jos testaamasi komponentti käyttää hookeja. Tuen pitäisi olla valmiina helmikuun alkupuolella.

</div>

<div class="content">

### mount ja full DOM -renderöinti

Käyttämämme _shallow_-renderöijä on useimmista tapauksissa riittävä. Joskus tarvitsemme kuitenkin järeämmän työkalun sillä _shallow_ renderöi ainoastaan "yhden tason", eli sen komponentin, jolle metodia kutsutaan.

Jos yritämme esim. sijoittaa kaksi <i>Note</i>-komponenttia <i>Togglable</i>-komponentin sisälle ja tulostamme syntyvän <i>ShallowWrapper</i>-olion

```js
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

huomaamme, että <i>Togglable</i> komponentti on renderöitynyt, eli "muuttunut" HTML:ksi, mutta sen sisällä olevat <i>Note</i>-komponentit eivät ole HTML:ää vaan React-komponentteja.

```js
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

```js
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

Tuloksena on kokonaisuudessaan HTML:ksi renderöitynyt <i>Togglable</i>-komponentti:

```js
<ForwardRef buttonLabel="show...">
  <div>
    <div style={{...}}>
      <button onClick={[Function: toggleVisibility]}>
        show...
      </button>
    </div>
    <div style={{...}} className="togglableContent">
      <Note note={{...}}>
        <li className="note">
          Komponenttitestaus tapahtuu jestillä ja enzymellä
          <button onClick={[undefined]}>
            make not important
          </button>
        </li>
      </Note>
      <Note note={{...}}>
        <li className="note">
          mount renderöi myös alikomponentit
          <button onClick={[undefined]}>
            make not important
          </button>
        </li>
      </Note>
      <button onClick={[Function: toggleVisibility]}>
        cancel
      </button>
    </div>
  </div>
</ForwardRef>
```

Mountin avulla renderöitäessä testi pääsee siis käsiksi periaatteessa samaan HTML-koodiin, joka todellisuudessa renderöidään selaimeen ja tämä luonnollisesti mahdollistaa huomattavasti monipuolisemman testauksen kuin _shallow_-renderöinti. Komennolla _mount_ tapahtuva renderöinti on kuitenkin hitaampaa, joten jos _shallow_ riittää, sitä kannattaa käyttää.

Huomaa, että testin käyttämä metodi [debug](http://airbnb.io/enzyme/docs/api/ReactWrapper/debug.html) ei palauta todellista HTML:ää vaan debuggaustarkoituksiin sopivan tekstuaalisen esitysmuodon komponentista. Todellisessa HTML:ssä ei mm. ole ollenkaan React-komponenttien tageja.

Jos on tarvetta tietää, mikä on testattaessa syntyvä todellinen HTML, sen saa selville metodilla [html](http://airbnb.io/enzyme/docs/api/ReactWrapper/html.html).

Jos muutamme testin viimeisen komennon muotoon

```js
console.log(noteComponent.html())
```
tulostuu todellinen HTML:

```js
<div>
  <div><button>show...</button></div>
  <div style="display: none;" class="togglableContent">
    <li class="note">
      Komponenttitestaus tapahtuu jestillä ja enzymellä
      <button>make not important</button>
    </li>
    <li class="note">
      mount renderöi myös alikomponentit
      <button>make not important</button>
    </li>
    <button>cancel</button>
  </div>
</div>
```

Komento _mount_ palauttaa renderöidyn "komponenttipuun" [ReactWrapper](https://airbnb.io/enzyme/docs/api/mount.html#mountnode-options--reactwrapper)-tyyppisenä oliona, joka tarjoaa hyvin samantyyppisen rajapinnan komponentin sisällön tutkimiseen kuin _ShallowWrapper_.

### Lomakkeiden testaus

Lomakkeiden testaaminen Enzymellä on jossain määrin haasteellista. Enzymen dokumentaatio ei mainitse lomakkeista sanaakaan. [Issueissa](https://github.com/airbnb/enzyme/issues/364) asiasta kuitenkin keskustellaan.

Tehdään testi komponentille <i>NoteForm</i>. Lomakkeen koodi näyttää seuraavalta

```js
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

Teemmekin testejä varten apukomponentin <i>Wrapper</i>, joka renderöi <i>NoteForm</i>:in ja hallitsee lomakkeen tilaa parametrinaan saamansa propsin <i>state</i> avulla:

```js
const Wrapper = (props) => {

  const onChange = (event) => {
    props.state.value = event.target.value
  }

  return(
    <NoteForm
      value={props.state.value}
      onSubmit={props.onSubmit}
      handleChange={onChange}
    />
  )
} 
```

Testi on seuraavassa:

```js
import React from 'react'
import { mount } from 'enzyme'
import NoteForm from './NoteForm'

it('<NoteForm /> updates parent state and calls onSubmit', () => {
  const onSubmit = jest.fn()
  const state = {
    value: ''
  }

  const wrapper = mount(
    <Wrapper onSubmit={onSubmit} state={state} />
  )

  const input = wrapper.find('input')
  const button = wrapper.find('button')

  input.simulate('change', { target: { value: 'lomakkeiden testaus on hankalaa' } })
  button.simulate('submit')

  expect(onSubmit.mock.calls.length).toBe(1)
  expect(state.value).toBe('lomakkeiden testaus on hankalaa')
})
```

Testi luo <i>Wrapper</i>-komponentin, jolle se välittää propseina mockatun funktion _onSubmit_ sekä tilaa edustavan olion _state_.

Wrapper välittää funktion edelleen <i>NoteFormille</i> tapahtuman <i>onSubmit</i> käsittelijäksi ja saamansa propsin _state_ kentän <i>value</i> syötekentän <i>input</i> arvoksi. 

Syötekenttään <i>input</i> kirjoittamista simuloidaan tekemällä syötekenttään tapahtuma <i>change</i> ja määrittelemällä sopiva olio, joka määrittelee syötekenttään 'kirjoitetun' sisällön.

Lomakkeen nappia tulee painaa simuloimalla tapahtumaa <i>submit</i>, tapahtuma <i>click</i> ei lähetä lomaketta.

Tenstin ensimmäinen ekspektaatio varmistaa, että lomakkeen lähetys on aikaansaanut tapahtumankäsittelijän kutsumisen.
Toinen ekspektaatio tutkii komponentille <i>Wrapper</i> propsina välitettyä muuttujaa _state_, ja varmistaa, että lomakkeelle kirjoitettu teksti on siirtynyt tilaan. 

### Frontendin integraatiotestaus

Suoritimme edellisessä osassa backendille integraatiotestejä, jotka testasivat backendin tarjoaman API:n läpi backendia ja tietokantaa. Backendin testauksessa tehtiin tietoinen päätös olla kirjoittamatta yksikkötestejä sillä backendin koodi on melko suoraviivaista ja ongelmat tulevatkin esiin todennäköisemmin juuri monimutkaisemmissa skenaarioissa, joita integraatiotestit testaavat hyvin.

Toistaiseksi kaikki frontendiin tekemämme testit ovat olleet yksittäisten komponenttien oikeellisuutta valvovia yksikkötestejä. Yksikkötestaus on toki välillä hyödyllistä, mutta kattavinkaan yksikkötestaus ei riitä antamaan riittävää luotettavuutta sille, että järjestelmä toimii kokonaisuudessaan.

Tehdään nyt sovellukselle yksi integraatiotesti. Integraatiotestaus on huomattavasti komponenttien yksikkötestausta hankalampaa. Erityisesti sovelluksemme kohdalla ongelmia aiheuttaa kaksi seikkaa: sovellus hakee näytettävät muistiinpanot palvelimelta <i>ja</i> sovellus käyttää local storagea kirjautuneen käyttäjän tietojen tallettamiseen.

Local storage ei ole oletusarvoiseti käytettävissä testejä suorittaessa, sillä kyseessä on selaimen tarjoama toiminnallisuus ja testit ajetaan selaimen ulkopuolella. Ongelma on helppo korjata määrittelemällä testien suorituksen ajaksi <i>mock</i> joka matkii local storagea. Tapoja tähän on [monia](https://stackoverflow.com/questions/32911630/how-do-i-deal-with-localstorage-in-jest-tests).

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

Toinen ongelmistamme on se, että sovellus hakee näytettävät muistiinpanot palvelimelta. Muistiinpanojen haku tapahtuu heti komponentin <i>App</i> luomisen jälkeen suoritettavassa effect hookissa:


```js
const App = () => {
  // ...

  useEffect(() => {
    noteService
      .getAll().then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

// ...
}
```

Jestin [manual mock](https://facebook.github.io/jest/docs/en/manual-mocks.html#content) -konsepti tarjoaa tilanteeseen hyvän ratkaisun. Manual mockien avulla voidaan kokonainen moduuli, tässä tapauksessa _noteService_ korvata testien ajaksi vaihtoehtoisella esim. kovakoodattua dataa tarjoavalla toiminnallisuudella.

Luodaan Jestin ohjeiden mukaisesti hakemistoon <i>src/services</i> alihakemisto <i>\_\_mocks\_\_</i> (alussa ja lopussa kaksi alaviivaa) ja sinne tiedosto <i>notes.js</i> jonka määrittelemä metodi <i>getAll</i> palauttaa kovakoodatun listan muistiinpanoja:

```js
let token = null

const notes = [
  {
    id: "5a451df7571c224a31b5c8ce",
    content: "HTML on helppoa",
    date: "2019-01-28T16:38:15.541Z",
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
    date: "2019-01-28T16:38:57.694Z",
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
    date: "2019-01-28T16:39:12.713Z",
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

### Testauskattavuus

[Testauskattavuus](https://github.com/facebookincubator/create-react-app/blob/ed5c48c81b2139b4414810e1efe917e04c96ee8d/packages/react-scripts/template/README.md#coverage-reporting) saadaan helposti selville suorittamalla testit komennolla

```js
CI=true npm test -- --coverage
```

![]({{ "/assets/5/8.png" | absolute_url }})

Melko primitiivinen HTML-muotoinen raportti generoituu hakemistoon _coverage/lcov-report_. HTML-muotoinen raportti kertoo mm. yksittäisen komponenttien testaamattomat koodirivit:

![]({{ "/assets/5/9.png" | absolute_url }})

Huomaamme, että parannettavaa jäi vielä runsaasti.

Sovelluksen tämänhetkinen koodi on kokonaisuudessaan [githubissa](https://github.com/fullstack-hy2019part2-notes/tree/part5-7), branchissa _part5-7_.

</div>

<div class="tasks">

### Tehtäviä

#### 5.16: blogilistan testit, step4

Tee sovelluksesi integraatiotesti, joka varmistaa, että jos käyttäjä ei ole kirjautunut järjestelmään, näyttää sovellus ainoastaan kirjautumislomakkeen, eli yhtään blogia ei vielä renderöidä.

#### 5.17*: blogilistan testit, step5

Tee myös testi, joka varmistaa, että kun käyttäjä on kirjautuneena, blogit renderöityvät sivulle.

**Vihje 1:**

Kirjautuminen kannattaa toteuttaa manipuloimalla testeissä local storagea. Jos määrittelet testeille mock-localstoragen osan 5 materiaalia seuraten, voit käyttää testikoodissa local storagea seuraavasti:

```js
const user = {
  username: 'tester',
  token: '1231231214',
  name: 'Teuvo Testaaja'
}

localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
```

**Vihje 2:**

Jotta mockin palauttamat blogit renderöityvät, kannattaa komponentti _App_ luoda _describe_-lohkossa. Voit noudattaa tämän ja edellisen tehtävän organisoinnissa esim. seuraavaa tapaa:

```js
describe('<App />', () => {
  let app

  describe('when user is not logged', () => {
    beforeEach(() => {
      // luo sovellus siten, että käyttäjä ei ole kirjautuneena
    })

    it('only login form is rendered', () => {
      app.update()
      // ...
    })
  })

  describe('when user is logged', () => {
    beforeEach(() => {
      // luo sovellus siten, että käyttäjä on kirjautuneena
    })

    it('all notes are rendered', () => {
      app.update()
      // ...
    })
  })
})
```

</div>

<div class="content">

### Snapshot-testaus

Jest tarjoaa "perinteisen" testaustavan lisäksi aivan uudenlaisen tavan testaukseen, ns. [snapshot](https://facebook.github.io/jest/docs/en/snapshot-testing.html)-testauksen. Mielenkiintoista snapshot-testauksessa on se, että sovelluskehittäjän ei tarvitse itse määritellä ollenkaan testejä, snapshot-testauksen käyttöönotto riittää.

Periaatteena on verrata komponenttien määrittelemää HTML:ää aina koodin muutoksen jälkeen siihen, minkälaisen HTML:n komponentit määrittelivät ennen muutosta.

Jos snapshot-testi huomaa muutoksen komponenttien määrittelemässä HTML:ssä, voi kyseessä joko olla haluttu muutos tai vahingossa aiheutettu "bugi". Snapshot-testi huomauttaa sovelluskehittäjälle, jos komponentin määrittelemä HTML muuttuu. Sovelluskehittäjä kertoo muutosten yhteydessä, oliko muutos haluttu. Jos muutos tuli yllätyksenä, eli kyseessä oli bugi, sovelluskehittäjä huomaa sen snapshot-testauksen ansiosta nopeasti.

### End to end -testaus

Olemme tehneet sekä backendille että frontendille hieman niitä kokonaisuutena testaavia integraatiotestejä. Eräs tärkeä testauksen kategoria on vielä käsittelemättä, [järjestelmää kokonaisuutena](https://en.wikipedia.org/wiki/System_testing) testaavat "end to end" (eli E2E) -testit.

Web-sovellusten E2E-testaus tapahtuu simuloidun selaimen avulla esimerkiksi [Selenium](http://www.seleniumhq.org)-kirjastoa käyttäen. Toinen vaihtoehto on käyttää ns. [headless browseria](https://en.wikipedia.org/wiki/Headless_browser) eli selainta, jolla ei ole ollenkaan graafista käyttöliittymää. Esim. Chromea on mahdollista suorittaa Headless-moodissa.

E2E testit ovat potentiaalisesti kaikkein hyödyllisin testikategoria, sillä ne tutkivat järjestelmää saman rajapinnan kautta kuin todelliset käyttäjät.

E2E-testeihin liittyy myös ikäviä puolia. Niiden konfigurointi on haastavampaa kuin yksikkö- ja integraatiotestien. E2E-testit ovat tyypillisesti myös melko hitaita ja isommassa ohjelmistossa niiden suoritusaika voi helposti nousta minuutteihin, tai jopa tunteihin. Tämä on ikävää sovelluskehityksen kannalta, sillä sovellusta koodatessa on erittäin hyödyllistä pystyä ajamaan testejä mahdollisimman usein koodin regressioiden varalta.

Palaamme end to end -testeihin kurssin viimeisessä, eli seitsemännessä osassa.

</div>
