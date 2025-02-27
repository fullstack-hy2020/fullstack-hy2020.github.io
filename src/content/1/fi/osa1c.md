---
mainImage: ../../../images/part-1.svg
part: 1
letter: c
lang: fi
---

<div class="content">

Palataan jälleen Reactin pariin.

Sovelluksemme jäi seuraavaan tilaan

```js
const Hello = (props) => {
  return (
    <div>
      <p>
        Hello {props.name}, you are {props.age} years old
      </p>
    </div>
  )
}

const App = () => {
  const nimi = 'Pekka'
  const ika = 10

  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="Maya" age={26 + 10} />
      <Hello name={nimi} age={ika} />
    </div>
  )
}
```

### Komponenttien apufunktiot

Laajennetaan komponenttia <i>Hello</i> siten, että se antaa arvion tervehdittävän henkilön syntymävuodesta:

```js
const Hello = (props) => {
  // highlight-start
  const bornYear = () => {
    const yearNow = new Date().getFullYear()
    return yearNow - props.age
  }
  // highlight-end

  return (
    <div>
      <p>
        Hello {props.name}, you are {props.age} years old
      </p>
      <p>So you were probably born {bornYear()}</p> // highlight-line
    </div>
  )
}
```

Syntymävuoden arvauksen tekevä logiikka on erotettu omaksi funktiokseen, jota kutsutaan komponentin renderöinnin yhteydessä.

Tervehdittävän henkilön ikää ei tarvitse välittää funktiolle parametrina, sillä funktio näkee sen sisältävälle komponentille välitettävät propsit.

Syntymävuoden selvittävä funktio on määritelty komponentin toiminnan määrittelevän funktion sisällä. Esim. Javalla ohjelmoitaessa metodien määrittely toisen metodin sisällä ei onnistu. JavaScriptissa taas funktioiden sisällä määritellyt funktiot on hyvin yleisesti käytetty tekniikka.

### Destrukturointi

Tarkastellaan erästä pientä mutta käyttökelpoista ES6:n mukanaan tuomaa uutta piirrettä JavaScriptissa, eli muuttujaan sijoittamisen yhteydessä tapahtuvaa [destrukturointia](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment).

Jouduimme äskeisessä koodissa viittaamaan propseina välitettyyn dataan hieman ikävästi muodossa _props.name_ ja _props.age_. Näistä _props.age_ pitää toistaa komponentissa kahteen kertaan.

Koska <i>props</i> on nyt olio

```js
props = {
  name: 'Maya',
  age: 36,
}
```

voimme suoraviivaistaa komponenttia siten, että sijoitamme kenttien arvot muuttujiin _name_ ja _age_, jonka jälkeen niitä on mahdollista käyttää koodissa suoraan:

```js
const Hello = (props) => {
  // highlight-start
  const name = props.name
  const age = props.age
  // highlight-end

  const bornYear = () => new Date().getFullYear() - age // highlight-line

  return (
    <div>
      <p>Hello {name}, you are {age} years old</p> // highlight-line
      <p>So you were probably born {bornYear()}</p>
    </div>
  )
}
```

Huomaa, että olemme hyödyntäneet myös nuolifunktion kompaktimpaa kirjoitustapaa funktion _bornYear_ määrittelyssä. Kuten aiemmin totesimme, jos nuolifunktio koostuu ainoastaan yhdestä komennosta, ei funktion runkoa tarvitse kirjoittaa aaltosulkeiden sisään ja funktio palauttaa ainoan komentonsa arvon.

Seuraavat ovat siis vaihtoehtoisia tapoja määritellä sama funktio:

```js
const bornYear = () => new Date().getFullYear() - age

const bornYear = () => {
  return new Date().getFullYear() - age
}
```

[Destrukturointi](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) tekee apumuuttujien määrittelyn vielä helpommaksi. Sen avulla voimme "kerätä" olion oliomuuttujien arvot suoraan omiin yksittäisiin muuttujiin:

```js
const Hello = (props) => {
    // highlight-start
  const { name, age } = props
    // highlight-end
  const bornYear = () => new Date().getFullYear() - age

  return (
    <div>
      <p>Hello {name}, you are {age} years old</p>
      <p>So you were probably born {bornYear()}</p>
    </div>
  )
}
```

Eli koska

```js
props = {
  name: 'Maya',
  age: 36,
}
```

saa <em>const { name, age } = props</em> aikaan sen, että muuttuja _name_ saa arvon 'Maya' ja muuttuja _age_ arvon 36.

Voimme viedä destrukturoinnin vielä askeleen verran pidemmälle:

```js
const Hello = ({ name, age }) => { // highlight-line
  const bornYear = () => new Date().getFullYear() - age

  return (
    <div>
      <p>
        Hello {name}, you are {age} years old
      </p>
      <p>So you were probably born {bornYear()}</p>
    </div>
  )
}
```

Destrukturointi tehdään nyt suoraan sijoittamalla komponentin saamat propsit muuttujiin _name_ ja _age_.

Eli sen sijaan, että props-olio otettaisiin vastaan muuttujaan <i>props</i> ja sen kentät sijoitettaisiin tämän jälkeen muuttujiin _name_ ja _age_

```js
const Hello = (props) => {
  const { name, age } = props
```

sijoitamme destrukturoinnin avulla propsin kentät suoraan muuttujiin kun määrittelemme komponenttifunktion saaman parametrin:

```js
const Hello = ({ name, age }) => {
```

### Sivun uudelleenrenderöinti

Toistaiseksi tekemämme sovellukset ovat olleet sellaisia, että kun niiden komponentit on kerran renderöity, niiden ulkoasua ei ole enää voinut muuttaa. Entä jos haluaisimme toteuttaa laskurin, jonka arvo kasvaa ajan kuluessa tai nappeja painettaessa?

Aloitetaan seuraavasta rungosta. Tiedostoon <i>App.jsx</i> tulee:

```js
const App = (props) => {
  const {counter} = props
  return (
    <div>{counter}</div>
  )
}

export default App
```

Tiedoston <i>main.jsx</i> sisältö on:

```js
import ReactDOM from 'react-dom/client'

import App from './App'

let counter = 1

ReactDOM.createRoot(document.getElementById('root')).render(
  <App counter={counter} />
)
```

Sovelluksen juurikomponentille siis annetaan propsiksi laskurin _counter_ arvo. Juurikomponentti renderöi arvon ruudulle. Entä laskurin arvon muuttuessa? Jos lisäämme ohjelmaan esim. komennon

```js
counter += 1
```

ei komponenttia kuitenkaan renderöidä uudelleen. Voimme saada komponentin renderöitymään uudelleen kutsumalla funktiota _render_ uudelleen esim. seuraavasti

```js
let counter = 1

const root = ReactDOM.createRoot(document.getElementById("root"))

const refresh = () => {
  root.render(<App counter={counter} />)
}

refresh()
counter += 1
refresh()
counter += 1
refresh()
```

Copy-pasten vähentämiseksi komponentin renderöinti on refaktoroitu funktioon _refresh_.

Nyt komponentti <i>renderöityy kolme kertaa</i>, saaden ensin arvon 1, sitten 2 ja lopulta 3. Luvut 1 ja 2 tosin ovat ruudulla niin vähän aikaa, että niitä ei ehdi havaita.

Hieman mielenkiintoisempaan toiminnallisuuteen pääsemme tekemällä renderöinnin ja laskurin kasvatuksen toistuvasti sekunnin välein käyttäen [SetInterval](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval)-metodia:

```js
setInterval(() => {
  refresh()
  counter += 1
}, 1000)
```

_render_-funktion toistuva kutsuminen ei kuitenkaan ole hyvä tapa päivittää komponentteja, joten tutustutaan seuraavaksi järkevämpään tapaan.

### Tilallinen komponentti

Tähänastiset komponenttimme ovat olleet siinä mielessä yksinkertaisia, että niillä ei ole ollut ollenkaan omaa tilaa, joka voisi muuttua komponentin elinaikana.

Määritellään nyt sovelluksemme komponentille <i>App</i> tila Reactin [state hookin](https://react.dev/learn/state-a-components-memory#meet-your-first-hook) avulla.

Palautetaan <i>main.jsx</i> muotoon

```js
import ReactDOM from 'react-dom/client'

import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

ja muutetaan <i>App.jsx</i> muotoon:

```js
import { useState } from 'react' // highlight-line

const App = () => {
  const [ counter, setCounter ] = useState(0) // highlight-line

// highlight-start
  setTimeout(
    () => setCounter(counter + 1),
    1000
  )
  // highlight-end

  return (
    <div>{counter}</div>
  )
}

export default App
```

Tiedosto importtaa nyt heti ensimmäisellä rivillä _useState_-funktion:

```js
import { useState } from 'react'
```

Komponentin määrittelevä funktio alkaa funktiokutsulla:

```js
const [ counter, setCounter ] = useState(0)
```

Kutsu saa aikaan sen, että komponentille luodaan <i>tila</i>, joka saa alkuarvokseen nollan. Funktio palauttaa taulukon, jossa on kaksi alkiota. Alkiot otetaan taulukon destrukturointisyntaksilla talteen muuttujiin _counter_ ja _setCounter_.

Muuttuja _counter_ pitää sisällään <i>tilan arvon</i> joka on siis aluksi nolla. Muuttuja _setCounter_ taas on viite funktioon, jonka avulla <i>tilaa voidaan muuttaa</i>.

Sovellus määrittelee funktion [setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) avulla, että tilan _counter_ arvoa kasvatetaan yhdellä sekunnin päästä:

```js
setTimeout(
  () => setCounter(counter + 1),
  1000
)
```

Kun tilaa muuttavaa funktiota _setCounter_ kutsutaan, <i>renderöi React komponentin uudelleen</i>, eli käytännössä suorittaa uudelleen komponentin määrittelevän koodin

```js
() => {
  const [ counter, setCounter ] = useState(0)

  setTimeout(
    () => setCounter(counter + 1),
    1000
  )

  return (
    <div>{counter}</div>
  )
}
```

kun koodi suoritetaan toista kertaa, funktion _useState_ kutsuminen palauttaa komponentin <i>jo olemassaolevan tilan arvon</i>, joka on nyt 1. Komponentin suoritus määrittelee jälleen laskuria kasvatettavaksi yhdellä sekunnin päästä ja renderöi ruudulle laskurin nykyisen arvon, joka on 1.

Sekunnin päästä siis suoritetaan funktion _setTimeout_ parametrina ollut koodi

```js
() => setCounter(counter + 1)
```

ja koska muuttujan _counter_ arvo on 1, on koodi oleellisesti sama kuin tilan _counter_ arvoon 2 asettava

```js
() => setCounter(2)
```

Ja tämä saa jälleen aikaan sen, että komponentti renderöidään uudelleen. Tilan arvo kasvaa sekunnin päästä yhdellä ja sama jatkuu niin kauan kun sovellus on toiminnassa.

Jos komponenttia ei saa renderöitymään tai komponentti renderöityy "väärään" aikaan, debuggaamista saattaa auttaa komponentin määrittelevään funktioon lisätty konsoliin tulostus. Esim. näin

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  setTimeout(
    () => setCounter(counter + 1),
    1000
  )

  console.log('rendering...', counter) // highlight-line

  return (
    <div>{counter}</div>
  )
}
```

voidaan konsolista seurata komponentin renderöitymistä:

![](../../images/1/4e.png)

Olihan selaimesi konsoli auki? Jos ei ollut, niin lupaa että tämä oli viimeinen kerta kun asiasta pitää muistuttaa.

### Tapahtumankäsittely

Jo [osassa 0](/osa0) mainitsimme <i>tapahtumankäsittelijät</i> eli funktiot, jotka on rekisteröity kutsuttavaksi tiettyjen tapahtumien eli eventien yhteydessä. Esim. käyttäjän interaktio sivun elementtien kanssa voi aiheuttaa joukon erilaisia tapahtumia.

Muutetaan sovellusta siten, että laskurin kasvaminen tapahtuukin käyttäjän painaessa [button](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button)-elementin avulla toteutettua nappia.

Button-elementit tukevat mm. [hiiritapahtumia](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) (mouse events), joista yleisin on [click](https://developer.mozilla.org/en-US/docs/Web/Events/click).

Reactissa funktion rekisteröiminen tapahtumankäsittelijäksi tapahtumalle <i>click</i> [tapahtuu](https://react.dev/learn/responding-to-events) seuraavasti:

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  // highlight-start
  const handleClick = () => {
    console.log('clicked')
  }
  // highlight-end

  return (
    <div>
      <div>{counter}</div>
      // highlight-start
      <button onClick={handleClick}>
        plus
      </button>
      // highlight-end
    </div>
  )
}
```

Yllä asetetaan buttonin <i>onClick</i>-attribuutin arvoksi aaltosulkeissa oleva viite koodissa määriteltyyn funktioon _handleClick_.

Nyt jokainen napin <i>plus</i> painallus saa aikaan sen, että funktiota _handleClick_ kutsutaan, eli klikatessa konsoliin tulostuu <i>clicked</i>.

Tapahtumankäsittelijäfunktio voidaan määritellä myös suoraan onClick-määrittelyn yhteydessä:

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  return (
    <div>
      <div>{counter}</div>
      <button onClick={() => console.log('clicked')}> // highlight-line
        plus
      </button>
    </div>
  )
}
```

Muuttamalla tapahtumankäsittelijä muotoon

```js
<button onClick={() => setCounter(counter + 1)}>
  plus
</button>
```

saamme aikaan halutun toiminnallisuuden, eli nappia painettaessa tilan _counter_ arvo kasvaa yhdellä <i>ja</i> komponentti renderöityy uudelleen.

Lisätään sovellukseen myös nappi laskurin nollaamiseen:

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  return (
    <div>
      <div>{counter}</div>
      <button onClick={() => setCounter(counter + 1)}>
        plus
      </button>
      // highlight-start
      <button onClick={() => setCounter(0)}> 
        zero
      </button>
      // highlight-end
    </div>
  )
}
```

Sovelluksemme on valmis!

### Tapahtumankäsittelijä on funktio

Nappien tapahtumankäsittelijät on siis määritelty suoraan <i>onClick</i>-attribuuttien määrittelyn yhteydessä seuraavasti:

```js
<button onClick={() => setCounter(counter + 1)}> 
  plus
</button>
```

Entä jos yritämme määritellä tapahtumankäsittelijän yksinkertaisemmin:

```js
<button onClick={setCounter(counter + 1)}> 
  plus
</button>
```

Tämä ei kuitenkaan toimi:

![](../../images/1/5c.png)

Mistä on kyse? Tapahtumankäsittelijäksi on tarkoitus määritellä joko <i>funktio</i> tai <i>viite funktioon</i>. Kun koodissa on

```js
<button onClick={setCounter(counter + 1)}>
```

tapahtumankäsittelijäksi tulee määriteltyä <i>funktiokutsu</i>. Sekin on monissa tilanteissa ok, mutta ei nyt. Kun React renderöi komponentin ensimmäistä kertaa ja muuttujan <i>counter</i> arvo on 0, se suorittaa kutsun <em>setCounter(0 + 1)</em>, eli muuttaa komponentin tilan arvoksi 1. Tämä taas aiheuttaa komponentin uudelleenrenderöitymisen. Ja sama toistuu uudelleen...

Palautetaan siis tapahtumankäsittelijä alkuperäiseen muotoonsa:

```js
<button onClick={() => setCounter(counter + 1)}> 
  plus
</button>
```

Nyt napin tapahtumankäsittelijän määrittelevä attribuutti <i>onClick</i> saa arvokseen funktion _() => setCounter(counter + 1)_, ja funktiota kutsutaan siinä vaiheessa kun sovelluksen käyttäjä painaa nappia.

Tapahtumankäsittelijöiden määrittely suoraan JSX-templatejen sisällä ei useimmiten ole kovin viisasta. Tässä tapauksessa se tosin on ok, koska tapahtumankäsittelijät ovat niin yksinkertaisia.

Eriytetään kuitenkin nappien tapahtumankäsittelijät omiksi komponentin sisäisiksi apufunktioiksi:

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

// highlight-start
  const increaseByOne = () => setCounter(counter + 1)
  
  const setToZero = () => setCounter(0)
  // highlight-end

  return (
    <div>
      <div>{counter}</div>
      <button onClick={increaseByOne}> // highlight-line
        plus
      </button>
      <button onClick={setToZero}> // highlight-line
        zero
      </button>
    </div>
  )
}
```

Nytkin tapahtumankäsittelijät on määritelty oikein, sillä <i>onClick</i>-attribuutit saavat arvokseen muuttujan, joka tallettaa viitteen funktioon:

```js
<button onClick={increaseByOne}> 
  plus
</button>
```

### Tilan vieminen alikomponenttiin

Reactissa suositaan pieniä komponentteja, joita on mahdollista uusiokäyttää monissa osissa sovellusta ja jopa eri sovelluksissa. Refaktoroidaan koodiamme vielä siten, että yhden komponentin sijaan koostamme laskurin näytöstä ja kahdesta painikkeesta.

Tehdään ensin laskurin tilan näyttämisestä vastaava komponentti <i>Display</i>.

Tilan sijoittaminen [riittävän ylös](https://react.dev/learn/sharing-state-between-components) komponenttihierarkiassa on hyvä käytäntö. Reactin dokumentaatio toteaa seuraavasti:

> <i>Sometimes, you want the state of two components to always change together. To do it, remove state from both of them, move it to their closest common parent, and then pass it down to them via props. This is known as lifting state up, and it’s one of the most common things you will do writing React code.</i> 

Jätetään tätä neuvoa seuraten sovelluksen tila eli laskimen arvo komponenttiin <i>App</i> ja välitetään tila eli laskurin arvo <i>propsien</i> avulla komponentille <i>Display</i>:

```js
const Display = (props) => {
  return (
    <div>{props.counter}</div>
  )
}
```

Nyt riittää, että komponentille välitetään laskurin tila eli _counter_:

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  const increaseByOne = () => setCounter(counter + 1)
  const setToZero = () => setCounter(0)

  return (
    <div>
      <Display counter={counter}/> // highlight-line
      <button onClick={increaseByOne}>
        plus
      </button>
      <button onClick={setToZero}> 
        zero
      </button>
    </div>
  )
}
```

Kaikki toimii edelleen. Kun nappeja painetaan ja <i>App</i> renderöityy uudelleen, renderöityvät myös kaikki sen alikomponentit, siis myös <i>Display</i> automaattisesti uudelleen.

Tehdään seuraavaksi napeille tarkoitettu komponentti <i>Button</i>. Napille on välitettävä propsien avulla tapahtumankäsittelijä sekä napin teksti:

```js
const Button = (props) => {
  return (
    <button onClick={props.onClick}>
      {props.text}
    </button>
  )
}
```

Komponentti <i>App</i> muuttuu nyt muotoon:

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  const increaseByOne = () => setCounter(counter + 1)
  const decreaseByOne = () => setCounter(counter - 1)  // highlight-line
  const setToZero = () => setCounter(0)

  return (
    <div>
      <Display counter={counter}/>
      // highlight-start
      <Button
        onClick={increaseByOne}
        text='plus'
      />
      <Button
        onClick={setToZero}
        text='zero'
      />     
      <Button
        onClick={decreaseByOne}
        text='minus'
      />           
      // highlight-end
    </div>
  )
}
```

Koska meillä on nyt uudelleenkäytettävä komponentti <i>Button</i>, sovellukselle on lisätty uutena toiminnallisuutena nappi, jolla laskurin arvoa voi vähentää.

Tapahtumankäsittelijä välitetään napeille propsin _onClick_ välityksellä. Omia komponentteja luotaessa propsin nimen voi periaatteessa valita täysin vapaasti, mutta esim. Reactin [tutoriaali](https://react.dev/learn/responding-to-events#naming-event-handler-props) suosittelee, että tapahtumankäsittelijän sisältävän propsin nimi alkaa etuliitteellä _on_ ja jatkuu isolla kirjaimella eli on muotoa _onSomething_.

### Tilan muutos aiheuttaa uudelleenrenderöitymisen

Kerrataan vielä sovelluksen toiminnan pääperiaatteet.

Kun sovellus käynnistyy, suoritetaan komponentin _App_ koodi, joka luo [useState](https://react.dev/reference/react/useState)-hookin avulla sovellukselle laskurin tilan _counter_. Komponentti renderöi laskimen alkuarvon 0 näyttävän komponentin _Display_ sekä kolme _Button_-komponenttia, joille se asettaa laskurin tilaa muuttavat tapahtumankäsittelijät.

Kun jotain napeista painetaan, suoritetaan vastaava tapahtumankäsittelijä. Tapahtumankäsittelijä muuttaa komponentin _App_ tilaa funktion _setCounter_ avulla. **Tilaa muuttavan funktion kutsuminen aiheuttaa komponentin uudelleenrenderöitymisen.** 

Eli jos painetaan nappia <i>plus</i>, muuttaa napin tapahtumankäsittelijä tilan _counter_ arvoksi 1 ja komponentti _App_ renderöidään uudelleen. Komponentin uudelleenrenderöinti aiheuttaa sen "alikomponentteina" olevien _Display_- ja _Button_-komponenttien uudelleenrenderöitymisen. _Display_ saa propsin arvoksi laskurin uuden arvon 1 ja _Button_-komponentit saavat propseina tilaa sopivasti muuttavat tapahtumankäsittelijät.

Jotta varmasti ymmärtäisimme, miten ohjelma toimii, lisätään koodiin muutama _console.log_

```js
const App = () => {
  const [counter, setCounter] = useState(0)
  console.log('rendering with counter value', counter) // highlight-line

  const increaseByOne = () => {
    console.log('increasing, value before', counter) // highlight-line
    setCounter(counter + 1)
  }

  const decreaseByOne = () => { 
    console.log('decreasing, value before', counter) // highlight-line
    setCounter(counter - 1)
  }

  const setToZero = () => {
    console.log('resetting to zero, value before', counter) // highlight-line
    setCounter(0)
  }

  return (
    <div>
      <Display counter={counter} />
      <Button onClick={increaseByOne} text="plus" />
      <Button onClick={setToZero} text="zero" />
      <Button onClick={decreaseByOne} text="minus" />
    </div>
  )
} 
```

Katsotaan nyt mitä konsoliin tulostuu kun painetaan nappeja plus, plus, zero ja minus:

![](../../images/1/31.png)

Ei kannata yrittää arvailla mitä koodisi tekee, parempi on varmistaa toiminnallisuus omin silmin esim. lisäilemällä koodiin sopivasti _console.log_-komentoja.

### Komponenttien refaktorointi

Laskimen arvon näyttävä komponentti on siis seuraava:

```js
const Display = (props) => {
  return (
    <div>{props.counter}</div>
  )
}
```

Komponentti tarvitsee ainoastaan <i>propsin</i> kenttää _counter_, joten se voidaan yksinkertaistaa [destrukturoinnin](/osa1/komponentin_tila_ja_tapahtumankasittely#destrukturointi) avulla seuraavaan muotoon:

```js
const Display = ({ counter }) => {
  return (
    <div>{counter}</div>
  )
}
```

Koska komponentin määrittelevä funktio ei sisällä muuta kuin returnin, voimme määritellä sen hyödyntäen nuolifunktioiden tiiviimpää ilmaisumuotoa:

```js
const Display = ({ counter }) => <div>{counter}</div>
```

Vastaava suoraviivaistus voidaan tehdä myös nappikomponentille:

```js
const Button = (props) => {
  return (
    <button onClick={props.onClick}>
      {props.text}
    </button>
  )
}
```

Destrukturoidaan <i>props</i>:ista tarpeelliset kentät ja käytetään nuolifunktioiden tiiviimpää muotoa:

```js
const Button = ({ onClick, text }) => (
  <button onClick={onClick}>
    {text}
  </button>
)
```

</div>
