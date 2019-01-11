---
mainImage: ../../images/part-1.svg
part: 1
letter: c
---

<div class="content">

Palataan jälleen Reactin pariin.

Sovelluksemme jäi seuraavaan tilaan

```js
const Hello = (props) => {
  return (
    <div>
      <p>Hello {props.name}, you are {props.age} years old</p>
    </div>
  )
}

const App = () => {
  const nimi = 'Pekka'
  const ika = 10

  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="Arto" age={26 + 10} />
      <Hello name={nimi} age={ika} />
    </div>
  )
}
```

### Komponenttien apufunktiot

Laajennetaan komponenttia _Hello_ siten, että se antaa arvion tervehdittävän henkilön syntymävuodesta:

```js
const Hello = props => {
  const bornYear = () => {
    const yearNow = new Date().getFullYear()
    return yearNow - props.age
  }

  return (
    <div>
      <p>
        Hello {props.name}, you are {props.age} years old
      </p>
      <p>So you were probably born {bornYear()}</p>
    </div>
  )
}
```

Syntymävuoden arvauksen tekevä logiikka on erotettu omaksi funktiokseen, jota kutsutaan renderöinnin yhteydessä.

Tervehdittävän henkilön ikää ei metodille tarvitse välittää parametrina, sillä funktio näkee sen sisältävälle komponentille välitettävät propsit.

Teknisesti ajatellen syntymävuoden määrittelevä funktio on määritelty komponentin toiminnan määrittelevän funktion sisällä. Esim. Javalla ohjelmoitaessa metodien määrittely toisen metodin sisällä ei onnistu. Javascriptissa taas funktioiden sisällä määritellyt funktiot on hyvin yleisesti käytetty tekniikka.

### Destrukturointi

Ennen kuin siirrymme eteenpäin, tarkastellaan erästä pientä, mutta käyttökelpoista ES6:n mukanaan tuomaa uutta piirrettä Javascriptissä, eli sijoittamisen yhteydessä tapahtuvaa [destrukturointia](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment).

Jouduimme äskeisessä koodissa viittaamaan propseina välitettyyn dataan hieman ikävästi muodossa _props.name_ ja _props.age_. Näistä _props.age_ pitää toistaa komponentissa kahteen kertaan.

Koska _props_ on nyt olio

```js
props = {
  name: 'Arto Hellas',
  age: 35,
}
```

voimme suoraviivaistaa komponenttia siten, että sijoitamme kenttien arvot muuttujiin _name_ ja _age_ jonka jälkeen niitä on mahdollista käyttää koodissa suoraan:

```js
const Hello = (props) => {
  const name = props.name
  const age = props.age

  const bornYear = () => new Date().getFullYear() - age

  return (
    <div>
      <p>Hello {name}, you are {age} years old</p>
      <p>So you were probably born {bornYear()}</p>
    </div>
  )
}
```

Huomaa, että olemme myös hyödyntäneet nuolifunktion kompaktimpaa kirjoitustapaa metodin _bornYear_ määrittelyssä. Kuten aiemmin totesimme, jos nuolifunktio koostuu ainoastaan yhdestä komennosta, ei funktion runkoa tarvitse kirjoittaa aaltosulkeiden sisään ja funktio palauttaa ainoan komentonsa arvon.

Seuraavat ovat siis vaihtoehtoiset tavat määritellä sama funktio:

```js
const bornYear = () => new Date().getFullYear() - age

const bornYear = () => {
  return new Date().getFullYear() - age
}
```

Destrukturointi tekee apumuuttujien määrittelyn vielä helpommaksi, sen avulla voimme "kerätä" olion oliomuuttujien arvot suoraan omiin yksittäisiin muuttujiin:

```js
const Hello = (props) => {
  const { name, age } = props
  const bornYear = () => new Date().getFullYear() - age

  return (
    <div>
      <p>Hello {name}, you are {props.age} years old</p>
      <p>So you were probably born {bornYear()}</p>
    </div>
  )
}
```

Eli koska

```js
props = {
  name: 'Arto Hellas',
  age: 35,
}
```

saa <code> const { name, age } = props</code> aikaan sen, että muuttuja _name_ saa arvon 'Arto Hellas' ja muuttuja _age_ arvon 35.

Voimme viedä destrukturoinnin vielä askeleen verran pidemmälle

```js
const Hello = ({ name, age }) => {
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

Destrukturointi tehdään nyt suodaan sijoittamalla komponentin saamat propsit muuttujiin _name_ ja _age_.

Eli sensijaan että props-olio otettaisiin vastaan muuttujaan _props_ ja sen kentät sijoitettaisiin tämän jälkeen muuttujiin _name_ ja _age_

```js
const Hello = (props) => {
  const { name, age } = props
```

sijoitamme destrukturoinnin avulla propsin kentät suoraan muuttujiin kun määrittelemme komponettifunktion saaman parametrin:

```js
const Hello = ({ name, age }) => {
```

### Sivun uudelleenrenderöinti

Toistaiseksi tekemämme sovellukset ovat olleet sellaisia, että kun niiden komponentit on kerran renderöity, niiden ulkoasua ei ole enää voinut muuttaa. Entä jos haluaisimme toteuttaa laskurin, jonka arvo kasvaa esim. ajan kuluessa tai nappien painallusten yhteydessä?

Aloitetaan seuraavasta rungosta:

```js
const App = (props) => {
  const {counter} = props
  return (
    <div>{counter}</div>
  )
}

let counter = 1

ReactDOM.render(<App counter={counter} />, document.getElementById('root'))
```

Sovelluksen juurikomponentille siis annetaan viite laskuriin. Juurikomponentti renderöi arvon ruudulle. Entä laskurin arvon muuttuessa? Jos lisäämme ohjelmaan esim. komennon

```js
counter.value += 1
```

ei komponenttia kuitenkaan renderöidä uudelleen. Voimme saada komponentin uudelleenrenderöitymään kutsumalla uudelleen metodia _ReactDOM.render_, esim. seuraavasti

```js
const App = (props) => {
  const { counter } = props
  return (
    <div>{counter}</div>
  )
}

let counter = 1

const renderoi = () => {
  ReactDOM.render(<App counter={counter} />, document.getElementById('root'))
}

renderoi()
counter += 1
renderoi()
counter += 1
renderoi()
```

Copypastea vähentämään on komponentin renderöinti kääritty funktioon _renderoi_.

Nyt komponentti renderöityy kolme kertaa, saaden ensin arvon 1, sitten 2 ja lopulta 3. 1 ja 2 tosin ovat ruudulla niin vähän aikaa, että niitä ei ehdi havaita.

Hieman mielenkiintoisempaan toiminnallisuuteen pääsemme tekemällä renderöinnin ja laskurin kasvatuksen toistuvasti sekunnin välein käyttäen [SetInterval](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval):

```js
setInterval(() => {
  renderoi()
  counter += 1
}, 1000)
```

_ReactDOM.render_-metodin toistuva kutsuminen ei kuitenkaan ole suositeltu tapa päivittää komponentteja. Tutustutaan seuraavaksi järkevämpään tapaan.

### Tilallinen komponentti

Tähänastiset komponenttimme ovat olleet siinä mielessä yksinkertaisia, että niillä ei ole ollut ollenkaan omaa tilaa, joka voisi muuttua komponentin elinaikana.

Määritellään nyt sovelluksemme komonentille _App_ tila Reactin [state hookin](https://reactjs.org/docs/hooks-state.html) avulla.

Muutetaan ohjelmaa seuraavasti

```js
import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const App = (props) => {
  const [ counter, setCounter ] = useState(0)

  setTimeout(
    () => setCounter(counter + 1),
    1000
  )

  return (
    <div>{counter}</div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
```

Sovellus importaa nyt heti ensimmäisellä rivillä _useState_-funktion:

```js
import React, { useState } from 'react'
```

Komponentin määrittelevä funktio alkaa metodikutsulla

```js
const [ counter, setCounter ] = useState(0)
```

Kutsu saa aikaan sen, että komponentille luodaan tila, joka saa alkuarvokseen nollan. Metodi palauttaa taulukon, jolla on kaksi alkiota. Alkiot otetaan taulukon destrukturointisyntaksilla talteen muuttujiin _counter_ ja _setCounter_.

Muuttuja _counter_ pitää sisällään tilan arvon joka on siis aluksi nolla. Muuttuja _setCounter_ taas on viite funktioon, jonka avulla tilaa voidaan muuttaa.

Sovellus määrittelee funktion [setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) avulla, että tilan _counter_ arvoa kasvatetaan yhdellä sekunnin päästä:

```js
setTimeout(
  () => setCounter(counter + 1),
  1000
)
```

Kun tilaa muuttavaa funktiota _setCounter_ kutsutaan, renderöi React komponentin uudelleen, eli käytännössä suorittaa uudelleen komponentin määrittelevän koodin

```js
(props) => {
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

kun koodi suoritetaan toiseen kertaan, funktion _useState_ kutsuminen palauttaa komponentin jo olemassaolevan tilan arvon, joka on nyt 1. Komponentin suoritus määrittelee jälleen laskuria kasvatettavaksi yhdellä sekunnin päästä ja renderöi ruudulle laskurin nykyisen arvon, joka on 1.

Sekunnin päästä siis suoritetaan funktion _setTimeout_ parametrina ollut koodi

```js
() => setCounter(counter + 1)
```

ja koska muuttujan _counter_ arvo on 1, on koodi oleellisesti sama kuin tilan _counter_ arvoon 2 asettava

```js
() => setCounter(2)
```

Ja tämä saa jälleen aikaan sen, että komponentti renderöidään uudelleen. Tilan arvo kasvaa sekunnin päästä yhdellä ja sama jatkuu niin kauan kun sovellus on toiminnassa.

Jos komponentti ei renderöidy vaikka sen omasta mielestä pitäisi, tai se renderöityy "väärään aikaan", debuggaamista auttaa joskus komponentin määrittelevään kunktioon lisätty konsoliin tulostus. Esim. jos lisäämme koodiin seuraavan,

```js
const App = (props) => {
  const [ counter, setCounter ] = useState(0)

  setTimeout(
    () => setCounter(counter + 1),
    1000
  )

  console.log('renderöidään', counter)

  return (
    <div>{counter}</div>
  )
}
```

on konsolista helppo seurata metodin _render_ kutsuja:

![](../images/1/4a.png)

### Tapahtumankäsittely

Mainitsimme jo [osassa 0](/osa0) muutamaan kertaan _tapahtumankäsittelijät_, eli funktiot, jotka on rekisteröity kutsuttavaksi tiettyjen tapahtumien eli eventien yhteydessä. Esim. käyttäjän interaktio sivun elementtien kanssa aiheuttaa joukon erinäisiä tapahtumia.

Muutetaan sovellusta siten, että laskurin kasvaminen tapahtuukin käyttäjän painaessa [button](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button)-elementin avulla toteutettua nappia.

Button-elementit tukevat mm. [hiiritapahtumia](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) (mouse events), joista yleisin on [click](https://developer.mozilla.org/en-US/docs/Web/Events/click).

Reactissa funktion rekisteröiminen tapahtumankäsittelijäksi tapahtumalle _click_ [tapahtuu](https://reactjs.org/docs/handling-events.html) seuraavasti:

```js
const App = (props) => {
  const [ counter, setCounter ] = useState(0)

  const handleClick = () => {
    console.log('klicked')
  }

  return (
    <div>
      <div>{counter}</div>
      <button onClick={handleClick}>
        plus
      </button>
    </div>
  )
}
```

Eli laitetaan _button_:in onClick-attribuutin arvoksi aaltosulkeissa oleva viite koodissa määriteltyyn funktioon _handleClick_.

Nyt jokainen napin _plus_ painallus saa aikaan sen että funktiota _handleClick_ kutsutaan, eli klikatessa konsoliin tulostuu _clicked_.

Tapahtumankäsittelijäfunktio voidaan määritellä myös suoraan onClick-määrittelyn yhteydessä:

```js
const App = (props) => {
  const [ counter, setCounter ] = useState(0)

  return (
    <div>
      <div>{counter}</div>
      <button onClick={() => console.log('klicked')}>
        plus
      </button>
    </div>
  )
}
```

Muuttamalla tapahtumankäsittelijä seuraavaan muotoon

```js
<button onClick={() => setCounter(counter + 1)}>
  plus
</button>
```

saamme halutun toiminnallisuuden, eli tilan _counter_ arvo kasvaa yhdellä _ja_ komponentti renderöityy uudelleen.

Lisätään sovellukseen myös nappi laskurin nollaamiseen:

```js
const App = (props) => {
  const [ counter, setCounter ] = useState(0)

  return (
    <div>
      <div>{counter}</div>
      <button onClick={() => setCounter(counter + 1)}>
        plus
      </button>
      <button onClick={() => setCounter(0)}>
        zero
      </button>
    </div>
  )
}
```

Sovelluksemme on valmis!

Tapahtumankäsittelijöiden määrittely suoraan JSX-templatejen sisällä ei useimmiten ole kovin viisasta. Eriytetään vielä nappien tapahtumankäsittelijät omiksi komponentin sisäisiksi apufunktioikseen:

```js
const App = (props) => {
  const [ counter, setCounter ] = useState(0)

  const increaseByOne = () => setCounter(counter + 1)
  const setToZero = () => setCounter(0)

  return (
    <div>
      <div>{counter}</div>
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

### Tapahtumankäsittelijän on oltava funktio

Metodit _increaseByOne_ ja _setToZero_ toimivat melkein samalla tavalla, ne asettavat uuden arvon laskurille. Tehdään koodiin yksittäinen funktio, joka sopii molempiin käyttötarkoituksiin:

```js
const App = (props) => {
  const [ counter, setCounter ] = useState(0)

  const setToValue = (value) => setCounter(value)

  return (
    <div>
      <div>{counter}</div>
      <button onClick={setToValue(counter + 1)}>
        plus
      </button>
      <button onClick={setToValue(0)}>
        zero
      </button>
    </div>
  )
}

```

Huomaamme kuitenkin että muutos hajottaa sovelluksemme täysin:

![](../images/1/5a.png)

Mistä on kyse? Tapahtumankäsittelijäksi on tarkoitus määritellä viite _funktioon_. Kun koodissa on

```js
<button onClick={setToValue(0)}>
```

tapahtumankäsittelijäksi tulee määriteltyä _funktiokutsu_. Sekin on monissa tilanteissa ok, mutta ei nyt, nimittäin kun React srenderöi metodin, se suorittaa kutsun <code>setToValue(0)</code>. Kutsu aiheuttaa komponentin tilan päivittävän funktion _setCounter_ kutsumisen. Tämä taas aiheuttaa komponentin uudelleenrenderöitymisen. Ja sama toistuu uudelleen...

Tilanteeseen on kaksi ratkaisua. Ratkaisuista yksinkertaisempi on muuttaa tapahtumankäsitteyä seuraavasti

```js
const App = (props) => {
  const [ counter, setCounter ] = useState(0)

  const setToValue = (value) => setCounter(value)

  return (
    <div>
      <div>{counter}</div>
      <button onClick={() => setToValue(counter + 1)}>
        plus
      </button>
      <button onClick={() => setToValue(0)}>
        zero
      </button>
    </div>
  )
}
```

eli tapahtumankäsittelijäki on määritelty _funktio_, joka kutsuu funktiota _setToValue_ sopivalla parametrilla:

```js
<button onClick={() => setToValue(counter + 1)}>
```

Toinen vaihtoehto on käyttää yleistä Javascriptin ja yleisemminkin funktionaalisen ohjelmoinnin kikkaa, eli määritellä _funktio joka palauttaa funktion_:

```js
const App = (props) => {
  const [ counter, setCounter ] = useState(0)

  const setToValue = (value) => {
    return () => {
      setCounter(value)
    }
  }

  return (
    <div>
      <div>{counter}</div>
      <button onClick={setToValue(counter + 1)}>
        plus
      </button>
      <button onClick={setToValue(0)}>
        zero
      </button>
    </div>
  )
}
```

Jos et ole aiemmin törmännyt tekniikkaan, siihen totutteluun voi mennä tovi.

Olemme siis määritelleet tapahtumankäsittelijäfunktion _setToValue_ seuraavasti:

```js
const setToValue = value => {
  return () => {
    setCounter(value)
  }
}
```

Kun komponentissa määritellään tapahtumankäsittelijä kutsumalla <code>setCounter(0)</code> on lopputuloksena funktio

```js
() => {
  setCounter(0)
}
```

eli juuri oikeanlainen tilan nollaamisen aiheuttava funktio!

Plus-napin tapahtumankäsittelijä määritellään kutsumalla <code>setCounter(counter + 1)</code>. Kun komponentti renderöidään ensimmäisen kerran, _counter_ on saanut alkuarvon 0, eli plus-napin tapahtumankäsittelijäksi tulee funktiokutsun <code>setCounter(1)</code> tulos, eli funktio

```js
() => {
  setCounter(1)
}
```

Vastaavasti, kun laskurin tila on esim 41, tulee plus-napin tapahtumakuuntelijaksi

```js
() => {
  setCounter(42)
}
```

Tarkastellaan vielä hieman metodia _asetaArvoon_:

```js
const setToValue = value => {
  return () => {
    setCounter(value)
  }
}
```

Koska metodi itse sisältää ainoastaan yhden komennon, eli _returnin_, joka palauttaa funktion, voidaan hyödyntää nuolifunktion tiiviimpää muotoa:

```js
const setToValue = value => () => {
  setCounter(value)
}
```

Usein tälläisissä tilanteissa kaikki kirjoitetaan samalle riville, jolloin tuloksena on "kaksi nuolta sisältävä funktio":

```js
const setToValue = value => () => setCounter(value)
```

Kaksinuolisen funktion voi ajatella funktiona, jota lopullisen tuloksen saadakseen täytyy kutsua kaksi kertaa.

Ensimmäisellä kutsulla "konfiguroidaan" varsinainen funktio, sijoittamalla osalle parametreista arvo. Eli kutsu <code>setToValue(5)</code> sitoo muuttujaan _value_ arvon 5 ja funktiosta "jää jäljelle" seuraava funktio:

```js
() => setCounter(5)
```

Tässä näytetty tapa soveltaa funktioita palauttavia funktioita on oleellisesti sama asia mistä funktionaalisessa ohjelmoinnissa käytetään termiä [currying](http://www.datchley.name/currying-vs-partial-application/). Termi currying ei ole lähtöisin funktionaalisen ohjelmoinnin piiristä vaan sillä on juuret [syvällä matematiikassa](https://en.wikipedia.org/wiki/Currying).

Jo muutamaan kertaan mainittu termi _funktionaalinen ohjelmointi_ ei ole välttämättä kaikille tässä vaiheessa tuttu. Asiaa avataan hiukan kurssin kuluessa, sillä React tukee ja osin edellyttää funktionaalisen tyylin käyttöä.

**HUOM:** muutos, missä korvasimme metodit _increaseByOne_ ja _setToZero_ metodilla _setToValue_ ei välttämättä ole järkevä, sillä erikoistuneemmat metodit ovat paremmin nimettyjä. Teimme muutoksen oikeastaan ainoastaan demonstroidaksemme _currying_-tekniikan soveltamista.

**HUOM2:** et todennäköisesti tarvitse tämän osan tehtävissä funktioita palauttavia funktioita, joten älä sekoita päätäsi asialla turhaan.

### Tilan vieminen alikomponenttiin

Reactissa suositaan pieniä komponentteja, joita on mahdollista uusiokäyttää monessa osissa sovellusta ja jopa useissa eri sovelluksissa. Refaktoroidaan koodiamme vielä siten, että yhden komponentin sijaan koostamme laskurin näytöstä ja kahdesta painikkeesta.

Tehdään ensin näytöstä vastaava komponentti _Display_.

Reactissa parhaana käytänteenä on sijoittaa tila [mahdollisimman ylös](https://reactjs.org/docs/lifting-state-up.html) komponenttihierarkiassa, mielellään sovelluksen juurikomponenttiin.

Jätetään sovelluksen tila, eli laskimen arvo komponenttiin _App_ ja välitetään tila _props_:ien avulla komponentille _Display_:

```js
const Display = (props) => {
  return (
    <div>{props.counter}</div>
  )
}
```

Voimme hyödyntää aiemmin mainittua [destrukturointia](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) myös metodien parametreissa. Eli koska olemme kiinnostuneita _props_:in kentästä _counter_, on edellinen mahdollista yksinkertaistaa seuraavaan muotoon:

```js
const Display = ({ counter }) => {
  return (
    <div>{counter}</div>
  )
}
```

Koska komponentin määrittelevä metodi ei sisällä muuta kuin returnin, voimme ilmaista sen hyödyntäen nuolifunktioiden tiiviimpää ilmaisumuotoa

```js
const Display = ({ counter }) => <div>{counter}</div>
```

Komponentin käyttö on suoraviivaista, riittää että sille välitetään laskurin tila eli _counter_:

```js
const App = (props) => {
  const [ counter, setCounter ] = useState(0)
  // ...

  return (
    <div>
      <Display counter={counter}/>
      <button onClick={setToValue(counter + 1)}>
        plus
      </button>
      <button onClick={setToValue(0)}>
        zero
      </button>
    </div>
  )
}
```

Kaikki toimii edelleen. Kun nappeja painetaan ja _App_ renderöityy uudelleen, renderöityvät myös kaikki sen alikomponentit, siis myös _Display_ automaattisesti uudelleen.

Tehdään seuraavaksi napeille tarkoitettu komponentti _Button_. Napille on välitettävä propsien avulla tapahtumankäsittelijä sekä napin teksti:

```js
const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)
```

ja hyödynnetään taas destrukturointia ottamaan _props_:in tarpeelliset kentät suoraan:

```js
const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)
```

Komponentti _App_ muuttuu nyt muotoon:

```js
const App = (props) => {
  const [ counter, setCounter ] = useState(0)

  const setToValue = (value) => {
    return () => {
      setCounter(value)
    }
  }

  return (
    <div>
      <Display counter={counter}/>
      <Button
        handleClick={setToValue(counter + 1)}
        text='plus'
      />
      <Button
        handleClick={setToValue(0)}
        text='zero'
      />
    </div>
  )
}
```

Koska meillä on nyt uudelleenkäytettävä nappi, sovellukselle on lisätty uutena toiminnallisuutena nappi, jolla laskurin arvoa voi vähentää.

Tapahtumankäsittelijä välitetään napeille propsin _handleClick_ välityksellä. Propsin nimellä ei ole sinänsä merkitystä, mutta valinta ei ollut täysin sattumanvarainen, esim. Reactin [tutoriaali](https://reactjs.org/tutorial/tutorial.html) suosittelee tätä konventiota.

</div>
