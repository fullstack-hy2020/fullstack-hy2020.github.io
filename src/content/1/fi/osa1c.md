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

Tervehdittävän henkilön ikää ei metodille tarvitse välittää parametrina, sillä funktio näkee sen sisältävälle komponentille välitettävät propsit.

Teknisesti ajatellen syntymävuoden selvittävä funktio on määritelty komponentin toiminnan määrittelevän funktion sisällä. Esim. Javalla ohjelmoitaessa metodien määrittely toisen metodin sisällä ei onnistu. Javascriptissa taas funktioiden sisällä määritellyt funktiot on hyvin yleisesti käytetty tekniikka.

### Destrukturointi

Ennen kuin siirrymme eteenpäin, tarkastellaan erästä pientä, mutta käyttökelpoista ES6:n mukanaan tuomaa uutta piirrettä Javascriptissä, eli muuttujaan sijoittamisen yhteydessä tapahtuvaa [destrukturointia](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment).

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

[Destrukturointi](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) tekee apumuuttujien määrittelyn vielä helpommaksi, sen avulla voimme "kerätä" olion oliomuuttujien arvot suoraan omiin yksittäisiin muuttujiin:

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

Voimme viedä destrukturoinnin vielä askeleen verran pidemmälle

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

Eli sensijaan että props-olio otettaisiin vastaan muuttujaan <i>props</i> ja sen kentät sijoitettaisiin tämän jälkeen muuttujiin _name_ ja _age_

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

ReactDOM.render(
  <App counter={counter} />, 
  document.getElementById('root')
)
```

Sovelluksen juurikomponentille siis annetaan propsiksi laskurin _counter_ arvo. Juurikomponentti renderöi arvon ruudulle. Entä laskurin arvon muuttuessa? Jos lisäämme ohjelmaan esim. komennon

```js
counter += 1
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

const refresh = () => {
  ReactDOM.render(<App counter={counter} />, 
  document.getElementById('root'))
}

refresh()
counter += 1
refresh()
counter += 1
refresh()
```

Copypasten vähentämisen takia on komponentin renderöinti kääritty funktioon _refresh_.

Nyt komponentti <i>renderöityy kolme kertaa</i>, saaden ensin arvon 1, sitten 2 ja lopulta 3. Luvut 1 ja 2 tosin ovat ruudulla niin vähän aikaa, että niitä ei ehdi havaita.

Hieman mielenkiintoisempaan toiminnallisuuteen pääsemme tekemällä renderöinnin ja laskurin kasvatuksen toistuvasti sekunnin välein käyttäen [SetInterval](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval):

```js
setInterval(() => {
  refresh()
  counter += 1
}, 1000)
```

_ReactDOM.render_-metodin toistuva kutsuminen ei kuitenkaan ole suositeltu tapa päivittää komponentteja. Tutustutaan seuraavaksi järkevämpään tapaan.

### Tilallinen komponentti

Tähänastiset komponenttimme ovat olleet siinä mielessä yksinkertaisia, että niillä ei ole ollut ollenkaan omaa tilaa, joka voisi muuttua komponentin elinaikana.

Määritellään nyt sovelluksemme komponentille <i>App</i> tila Reactin [state hookin](https://reactjs.org/docs/hooks-state.html) avulla.

Muutetaan ohjelmaa seuraavasti

```js
import React, { useState } from 'react' // highlight-line
import ReactDOM from 'react-dom'

const App = (props) => {
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

ReactDOM.render(
  <App />, 
  document.getElementById('root')
)
```

Sovellus importaa nyt heti ensimmäisellä rivillä _useState_-funktion:

```js
import React, { useState } from 'react'
```

Komponentin määrittelevä funktio alkaa metodikutsulla

```js
const [ counter, setCounter ] = useState(0)
```

Kutsu saa aikaan sen, että komponentille luodaan <i>tila</i>, joka saa alkuarvokseen nollan. Metodi palauttaa taulukon, jossa on kaksi alkiota. Alkiot otetaan taulukon destrukturointisyntaksilla talteen muuttujiin _counter_ ja _setCounter_.

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

Jos komponentti ei renderöidy vaikka sen omasta mielestä pitäisi, tai se renderöityy "väärään aikaan", debuggaamista auttaa joskus komponentin määrittelevään funktioon lisätty konsoliin tulostus. Esim. jos lisäämme koodiin seuraavan tulostuksen

```js
const App = (props) => {
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

voidaan konsolista seurata metodin _render_ kutsuja:

![](../../images/1/4e.png)

### Tapahtumankäsittely

Mainitsimme jo [osassa 0](/osa0) muutamaan kertaan <i>tapahtumankäsittelijät</i>, eli funktiot, jotka on rekisteröity kutsuttavaksi tiettyjen tapahtumien eli eventien yhteydessä. Esim. käyttäjän interaktio sivun elementtien kanssa aiheuttaa joukon erinäisiä tapahtumia.

Muutetaan sovellusta siten, että laskurin kasvaminen tapahtuukin käyttäjän painaessa [button](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button)-elementin avulla toteutettua nappia.

Button-elementit tukevat mm. [hiiritapahtumia](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) (mouse events), joista yleisin on [click](https://developer.mozilla.org/en-US/docs/Web/Events/click).

Reactissa funktion rekisteröiminen tapahtumankäsittelijäksi tapahtumalle <i>click</i> [tapahtuu](https://reactjs.org/docs/handling-events.html) seuraavasti:

```js
const App = (props) => {
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

Eli laitetaan buttonin <i>onClick</i>-attribuutin arvoksi aaltosulkeissa oleva viite koodissa määriteltyyn funktioon _handleClick_.

Nyt jokainen napin <i>plus</i> painallus saa aikaan sen että funktiota _handleClick_ kutsutaan, eli klikatessa konsoliin tulostuu <i>clicked</i>.

Tapahtumankäsittelijäfunktio voidaan määritellä myös suoraan onClick-määrittelyn yhteydessä:

```js
const App = (props) => {
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

Muuttamalla tapahtumankäsittelijä seuraavaan muotoon

```js
<button onClick={() => setCounter(counter + 1)}>
  plus
</button>
```

saamme aikaan halutun toiminnallisuuden, eli nappia painettaessa tilan _counter_ arvo kasvaa yhdellä <i>ja</i> komponentti renderöityy uudelleen.

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

Entä jos yritämme määritellä tapahtumankäsittelijän hieman yksinkertaisemmassa muodossa:

```js
<button onClick={setCounter(counter + 1)}> 
  plus
</button>
```

Tämä muutos kuitenkin hajottaa sovelluksemme täysin:

![](../../images/1/5b.png)

Mistä on kyse? Tapahtumankäsittelijäksi on tarkoitus määritellä joko <i>funktio</i> tai <i>viite funktioon</i>. Kun koodissa on

```js
<button onClick={setCounter(counter + 1)}>
```

tapahtumankäsittelijäksi tulee määriteltyä <i>funktiokutsu</i>. Sekin on monissa tilanteissa ok, mutta ei nyt. Kun React renderöi metodin ensimmäistä kertaa ja muuttujan <i>counter</i> arvo on 0, se suorittaa kutsun <em>setCounter(0 + 1)</em>, eli muuttaa komponentin tilan arvoksi 1. Tämä taas aiheuttaa komponentin uudelleenrenderöitymisen. Ja sama toistuu uudelleen...

Palautetaan siis tapahtumankäsittelijä alkuperäiseen muotoonsa

```js
<button onClick={() => setCounter(counter + 1)}> 
  plus
</button>
```

Nyt napin tapahtumankäsittelijän määrittelevä attribuutti <i>onClick</i> saa arvokseen funktion _() => setCounter(counter + 1)_, ja funktiota kutsutaan siinä vaiheessa kun sovelluksen käyttäjä painaa nappia. 

Tapahtumankäsittelijöiden määrittely suoraan JSX-templatejen sisällä ei useimmiten ole kovin viisasta. Tässä tapauksessa se tosin on ok, koska tapahtumankäsittelijät ovat niin yksinkertaisia. 

Eriytetään kuitenkin nappien tapahtumankäsittelijät omiksi komponentin sisäisiksi apufunktioikseen:

```js
const App = (props) => {
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

Tälläkin kertaa tapahtumankäsittelijät on määritelty oikein, sillä <i>onClick</i>-attribuutit saavat arvokseen muuttujan, joka tallettaa viitteen funktioon:

```js
<button onClick={increaseByOne}> 
  plus
</button>
```

### Tilan vieminen alikomponenttiin

Reactissa suositaan pieniä komponentteja, joita on mahdollista uusiokäyttää monessa osissa sovellusta ja jopa useissa eri sovelluksissa. Refaktoroidaan koodiamme vielä siten, että yhden komponentin sijaan koostamme laskurin näytöstä ja kahdesta painikkeesta.

Tehdään ensin laskurin tilan näyttämisestä vastaava komponentti <i>Display</i>.

Reactissa pidetään hyvänä käytänteenä sijoittaa tila [riittävän ylös](https://reactjs.org/docs/lifting-state-up.html) komponenttihierarkiassa. Reactin dokumentaatio toteaa seuraavasti

> <i>Often, several components need to reflect the same changing data. We recommend lifting the shared state up to their closest common ancestor.</i> 

Jätetään tätä neuvoa seuraten sovelluksen tila, eli laskimen arvo komponenttiin <i>App</i> ja välitetään tila eli laskurin arvo <i>propsien</i> avulla komponentille <i>Display</i>:

```js
const Display = (props) => {
  return (
    <div>{props.counter}</div>
  )
}
```

Komponentin käyttö on suoraviivaista, riittää että sille välitetään laskurin tila eli _counter_:

```js
const App = (props) => {
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
    <button onClick={props.handleClick}>
      {props.text}
    </button>
  )
}
```

Komponentti <i>App</i> muuttuu nyt muotoon:

```js
const App = (props) => {
  const [ counter, setCounter ] = useState(0)

  const increaseByOne = () => setCounter(counter + 1)
  const decreaseByOne = () => setCounter(counter - 1)
  const setToZero = () => setCounter(0)

  return (
    <div>
      <Display counter={counter}/>
      // highlight-start
      <Button
        handleClick={increaseByOne}
        text='plus'
      />
      <Button
        handleClick={setToZero}
        text='zero'
      />     
      <Button
        handleClick={decreaseByOne}
        text='minus'
      />           
      // highlight-end
    </div>
  )
}
```

Koska meillä on nyt uudelleenkäytettävä komponentti <i>Button</i>, sovellukselle on lisätty uutena toiminnallisuutena nappi, jolla laskurin arvoa voi vähentää.

Tapahtumankäsittelijä välitetään napeille propsin _handleClick_ välityksellä. Propsin nimellä ei ole sinänsä merkitystä, mutta valinta ei ollut täysin sattumanvarainen, esim. Reactin [tutoriaali](https://reactjs.org/tutorial/tutorial.html) suosittelee tätä konventiota.

### Tilan muutos aiheuttaa uudelleenrenderöitymisen

Kerrataan vielä sovelluksen toiminnan pääperiaatteet. 

Kun sovellus käynnistyy, suoritetaan komponentin _App_-koodi, joka luo [useState](https://reactjs.org/docs/hooks-reference.html#usestate)-hookin avulla sovellukselle laskurin tilan _counter_. Komponentti renderöi laskimen alkuarvon 0 näyttävän komponentin _Display_ sekä kolme _Button_-komponenttia, joille se asettaa laskurin tilaa muuttavat tapahtumankäsittelijät.

Kun jotain napeista painetaan, suoritetaan vastaava tapahtumankäsittelijä. Tapahtumankäsittelijä muuttaa komponentin _App_ tilaa funktion _setCounter_ avulla. **Tilaa muuttavan funktion kutsuminen aiheuttaa komponentin uudelleenrenderöitymisen.** 

Eli jos painetaan nappia <i>plus</i>, muuttaa napin tapahtumankäsittelijä tilan _counter_ arvoksi 1 ja komponentti _App_ renderöidään uudelleen. Komponentin uudelleenrenderöinti aiheuttaa sen "alikomponentteina" olevien _Display_- ja _Button_-komponenttien uudelleenrenderöitymisen. _Display_ saa propsin arvoksi laskurin uuden arvon 1 ja _Button_-komponentit saavat propseina tilaa sopivasti muuttavat tapahtumankäsittelijät.


### Komponenttien refaktorointi

Laskimen arvon näyttävä komponentti on siis seuraava

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

Koska komponentin määrittelevä metodi ei sisällä muuta kuin returnin, voimme määritellä sen hyödyntäen nuolifunktioiden tiiviimpää ilmaisumuotoa

```js
const Display = ({ counter }) => <div>{counter}</div>
```

Vastaava suoraviivaistus voidaan tehdä myös nappia edustavalle komponentille

```js
const Button = (props) => {
  return (
    <button onClick={props.handleClick}>
      {props.text}
    </button>
  )
}
```

Eli destrukturoidaan <i>props</i>:ista tarpeelliset kentät ja käytetään nuolifunktioiden tiiviimpää muotoa 

```js
const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)
```

</div>
