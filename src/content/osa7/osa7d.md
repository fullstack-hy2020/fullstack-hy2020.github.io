---
mainImage: ../../images/part-7.svg
part: 7
letter: d
---

<div class="content">

Olemme käyttäneet kurssilla ainoastaan Javascript-funktioina määriteltyjä React-komponentteja. Tämä ei ollut mahdollista ennen Reactiin versiossa 16.8. tullutta [hook](https://reactjs.org/docs/hooks-intro.html)-toiminnallisuutta, tällöin esimerkiksi tilaa käyttävät komponentit oli pakko määritellä käyttäen Javascriptin [Class](https://reactjs.org/docs/state-and-lifecycle.html#converting-a-function-to-a-class)-syntaksia.

Class-, eli luokkakomponentit on syytä tuntea ainakin jossain määrin, sillä maailmassa on suuri määrä vanhaa React-koodia, mitä ei varmaankaan koskaan tulla kokonaisuudessaan uudelleenkirjoittamaan uudella syntaksilla.

### Luokkakomponentit

Tutustutaan nyt luokkakomponenttien tärkeimpiin ominaisuuksiin toteuttamalla jälleen kerran jo niin tuttu anekdoottisovellus. Talletetaan anekdootit <i>json-serveriä</i> hyödyntäen tiedostoon <i>db.json</i>. Tiedoston sisältö otetaan [täältä](https://github.com/fullstack-hy2019/misc/blob/master/anecdotes.json). 

Luokkakomponentin ensimmäinen versio näyttää seuraavalta

```js
import React from 'react'

class App extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <h1>anecdote of the day</h1>
      </div>
    )
  }
}

export default App
```

Komponentilla on nyt [konstruktori](https://reactjs.org/docs/react-component.html#constructor) missä ei toistaiseksi tehdä mitään sekä metodi [render](https://reactjs.org/docs/react-component.html#render). Kuten arvata saattaa, _render_ määrittelee sen miten komponentti piirtyy ruudulle. 

Määritellään komponenttiin tila anekdoottien listalle sekä näkyvissä olevalle anekdootille. Toisin kuin [useState](https://reactjs.org/docs/hooks-state.html)-hookia käytettäessä, luokkakomponenteilla on ainoastaan yksi tila. Eli jos tila koostuu useista "osista", tulee osat tallettaa tilan kenttiin.  Tila alustetaan konstruktoriissa:

```js
class App extends React.Component {
  constructor(props) {
    super(props)

    // highlight-start
    this.state = {
      anecdotes: [],
      current: 0
    }
    // highlight-end
  }

  render() {
    if (this.state.anecdotes.length == 0 ) { // highlight-line
      return <div>no anecdotes...</div>
    }

    return (
      <div>
        <h1>anecdote of the day</h1>
        <div>
          {this.state.anecdotes[this.state.current].content} // highlight-line
        </div> 
        <button>next</button>
      </div>
    )
  }
}
```

Komponentin tila on siis instanssimuuttujassa _this.state_. Tila on olio, jolla on kaksi kenttää. <i>this.state.anecdotes</i> on anekdoottien lista ja <i>this.state.current</i> on näytettävän anekdootin indeksi.

Funktionaalisten komponenteille oikea paikka hakea palvelimella olevaa dataa ovat [effect hookit](https://reactjs.org/docs/hooks-effect.html), jotka suoritetaan aina komponentin renderöitymisen yhteydessä tai tarvittaessa harvemmin, esim. ainoastaan ensimmäisen renderöinnin yhteydessä.

Luokkakomponenttien [elinkaarimetodit](https://reactjs.org/docs/state-and-lifecycle.html#adding-lifecycle-methods-to-a-class) tarjoavat vastaavan toiminnallisuuden. Oikea paikka käynnistää tietojen haku palvelimelta on  elinkaarimetodi [componentDidMount](https://reactjs.org/docs/react-component.html#componentdidmount), joka suoritetaan kertaalleen heti komponentin ensimmäisen renderöitymisen jälkeen:

```js
class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      anecdotes: [],
      current: 0
    }
  }

  // highlight-start
  componentDidMount = () => {
    axios.get('http://localhost:3001/anecdotes').then(response => {
      this.setState({ anecdotes: response.data })
    })
  }
  // highlight-end

  // ...
}
```

HTTP-pyynnön takaisinkutsufunktio päivittää komponentin tilaa metodilla [setState](https://reactjs.org/docs/react-component.html#setstate). Metodi toimii siten, että se koskee tilassa ainoastaan niihin avaimiin, mitä parametrina olevassa oliossa on määritelty. Avain <i>current</i> jää siis entiseen arvoonsa.

Metodin setState kutsuminen aiheuttaa aina luokkakomponentin uudelleenrenderöinnin, eli metodin _render_ kutsun.

Viimeistellään vielä komponentti siten, että näytettävä anekdootti on mahdollista vaihtaa. Seuraavassa koko komponentin koodi, lisäys korostettuna:

```js
class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      anecdotes: [],
      current: 0
    }
  }

  componentDidMount = () => {
    axios.get('http://localhost:3001/anecdotes').then(response => {
      this.setState({ anecdotes: response.data })
    })
  }

  // highlight-start
  handleClick = () => {
    const current = Math.round(
      Math.random() * this.state.anecdotes.length
    )
    this.setState({ current })
  }
  // highlight-end

  render() {
    if (this.state.anecdotes.length === 0 ) {
      return <div>no anecdotes...</div>
    }

    return (
      <div>
        <h1>anecdote of the day</h1>
        <div>{this.state.anecdotes[this.state.current].content}</div>
        <button onClick={this.handleClick}>next</button> // highlight-line
      </div>
    )
  }
}
```

Vertailun vuoksi sama sovellus funktionaalisena komponenttina: 

```js
const App = () => {
  const [anecdotes, setAnecdotes] = useState([])
  const [current, setCurrent] = useState(0)

  useEffect(() =>{
    axios.get('http://localhost:3001/anecdotes').then(response => {
      setAnecdotes(response.data)
    })
  },[])

  const handleClick = () => {
    setCurrent(Math.round(Math.random() * anecdotes.length))
  }

  if (anecdotes.length === 0) {
    return <div>no anecdotes...</div>
  }

  return (
    <div>
      <h1>anecdote of the day</h1>
      <div>{anecdotes[current].content}</div>
      <button onClick={handleClick}>next</button>
    </div>
  )
}
```

Esimerkkimme tapauksessa erot eivät ole suuret. Suurin ero funktionaalisissa ja luokkakompontenteissa lienee se, että luokkakomponentin tila on aina yksittäinen olio, ja tilaa muutetaan metodin _setState_ avulla kun taas funktionaalisessa komponentissa tila voi koostua useista muuttujista, joilla kaikilla on oma päivitysfunktio. 

Hieman edistyneemmissä käyttöskenaarioissa effect hookit tarjoavat huomattavasti paremman mekanismin sivuvaikutusten hallintaan verrattuna luokkaomponenttien elinkaarimetodeihin.

Merkittävä etu funktionaalisille komponenttien käytössä on se, että paljon harmia tuottavaa Javascriptin olioon itseensä viittaavaa _this_-viitettä ei tarvite käsitellä ollenkaan. 

Oman ja suuren enemmistön mielestä luokkakomponenteilla ei ole oikeastaan mitään etuja hookeilla rikastettuihin fuknktionaalisiin komponentteihin verrattuna, poikkeuksen tähän muodostaa ns. [error boundary](https://reactjs.org/docs/error-boundaries.html) -mekanismi, joka ei ole toistaiseksi (7.2.2019) funktionaalisten komponenttien käytössä. 

Kun kirjoitat uutta koodia, [ei siis ole mitään rationaalista syytä käyttää luokkakomponentteja](https://reactjs.org/docs/hooks-faq.html#should-i-use-hooks-classes-or-a-mix-of-both) jos projektissa on käytössä Reactista vähintään versio 16.8. Toisaalta kaikkea vanhaa Reactia [ei ole toistaiseksi mitään syytä uudelleenkirjoittaa](https://reactjs.org/docs/hooks-faq.html#do-i-need-to-rewrite-all-my-class-components) funktionaalisina komponentteina.

### Sovelluksen end to end -testaus

Palataan vielä hetkeksi testauksen pariin. Aiemmissa osissa teimme sovelluksille yksikkötestejä sekä integraatiotestejä. Katsotaan nyt erästä tapaa tehdä [järjestelmää kokonaisuutena](https://en.wikipedia.org/wiki/System_testing) tutkivia _End to End (E2E) -testejä_.

Web-sovellusten E2E-testaus tapahtuu simuloidun selaimen avulla esimerkiksi [Selenium](http://www.seleniumhq.org/)-kirjastoa käyttäen. Toinen vaihtoehto on käyttää ns. [headless browseria](https://en.wikipedia.org/wiki/Headless_browser) eli selainta, jolla ei ole ollenkaan graafista käyttöliittymää.

Chrome-selain on jo hetken sisältänyt [headless](https://developers.google.com/web/updates/2017/04/headless-chrome)-moodin. Käytetään nyt headless chromea sille Node API:n tarjoavan [Puppeteer](https://github.com/GoogleChrome/puppeteer)-kirjaston avulla.

Tehdään muutama testi osan 3 muistiinpanosovelluksen ["Full stack"-versiolle](/osa3#sovellus-internettiin), joka sisältää sekä backendin että frontin samassa projektissa.


```js
```

</div>
