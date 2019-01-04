---
title: osa 1
subTitle: React
path: /osa1/react
mainImage: ../../images/osa1.png
part: 1
letter: a
partColor: green
---

<div class="content">

Alamme nyt tutustua kurssin ehkä tärkeimpään teemaan, [React](https://reactjs.org/)-kirjastoon. Tehdään heti yksinkertainen React-sovellus ja tutustutaan samalla Reactin peruskäsitteistöön.

Ehdottomasti helpoin tapa päästä alkuun on [create-react-app](https://github.com/facebookincubator/create-react-app)-nimisen työkalun käyttö. _create-react-app_ on mahdollista asentaa, mutta asennukseen ei ole tarvetta jos Noden mukana asentunut _npm_-työkalu on versioltaan vähintään _5.3_. Tällöin npm:n mukana asentuu komento _npx_, joka mahdollistaa create-react-app:in käytön asentamatta sitä erikseen. Npm:n version saa selville komennolla _npm -v_.

Luodaan sovellus nimeltään _osa1_ ja käynnistetään se:

<pre>
$ npx create-react-app osa1
$ cd osa1
$ npm start
</pre>

Sovellus käynnistyy oletusarvoisesti localhostin porttiin 3000, eli osoitteeseen <http://localhost:3000>

Chromen pitäisi aueta automaattisesti. Avaa konsoli **välittömästi**. Avaa myös tekstieditori siten, että näet koodin ja web-sivun samaan aikaan ruudulla:

![](../images/1/26.png)

Sovelluksen koodi on hakemistossa _src_. Yksinkertaistetaan valmiina olevaa koodia siten, että tiedoston _index.js_ sisällöksi tulee:

```react
import React from 'react'
import ReactDOM from 'react-dom'

const App = () => (
  <div>
    <p>Hello world</p>
  </div>
)

ReactDOM.render(<App />, document.getElementById('root'))
```

Voit poistaa tiedostot _App.js_, _App.css_, _App.test.js_, _logo.svg_ ja _registerServiceWorker.js_

### Komponentti

Tiedosto _index.js_ määrittelee nyt React-[komponentin](https://reactjs.org/docs/components-and-props.html) nimeltään _App_ ja viimeisen rivin komento

```react
ReactDOM.render(<App />, document.getElementById('root'))
```

renderöi komponentin sisällön tiedoston _public/index.html_ määrittelemään _div_-elementtiin, jonka _id:n_ arvona on 'root'

Tiedosto _public/index.html_ on oleellisesti ottaen tyhjä, voit kokeilla lisätä sinne HTML:ää. Reactilla ohjelmoitaessa yleensä kuitenkin kaikki renderöitävä sisältö määritellään Reactin komponenttien avulla.

Tarkastellaan vielä tarkemmin komponentin määrittelevää koodia:

```react
const App = () => (
  <div>
    <p>Hello world</p>
  </div>
)
```

Kuten arvata saattaa, komponentti renderöityy _div_-tagina, jonka sisällä on _p_-tagin sisällä oleva teksti _Hello world_.

Teknisesti ottaen komponentti on määritelty Javascript-funktiona. Seuraava siis on funktio (joka ei saa yhtään parametria):

```react
() => (
  <div>
    <p>Hello world</p>
  </div>
)
```

joka sijoitetaan vakioarvoiseen muuttujaan _App_

```js
const App = ...
```

Javascriptissa on muutama tapa määritellä funktioita. Käytämme nyt Javascriptin hieman uudemman version [EcmaScript 6:n](http://es6-features.org/#Constants) eli ES6:n [nuolifunktiota](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) (arrow functions).

Koska funktio koostuu vain yhdestä lausekkeesta, on käytössämme lyhennysmerkintä, joka vastaa oikeasti seuraavaa koodia:

```react
const App = () => {
  return (
    <div>
      <p>Hello world</p>
    </div>
  )
}
```

eli funktio palauttaa sisältämänsä lausekkeen arvon.

Komponentin määrittelevä funktio voi sisältää mitä tahansa Javascript-koodia. Muuta komponenttisi seuraavaan muotoon ja katso mitä konsolissa tapahtuu:

```react
const App = () => {
  console.log('Hello from komponentti')
  return (
    <div>
      <p>Hello world</p>
    </div>
  )}
```

Komponenttien sisällä on mahdollista renderöidä myös dynaamista sisältöä.

Muuta komponentti muotoon:

```react
const App = () => {
  const now = new Date()
  const a = 10
  const b = 20
  return (
    <div>
      <p>Hello world, it is {now.toString()}</p>
      <p>{a} plus {b} is {a + b}</p>
    </div>
  )
}
```

Aaltosulkeiden sisällä oleva Javascript-koodi evaluoidaan ja evaluoinnin tulos upotetaan määriteltyyn kohtaan komponentin tuottamaa HTML-koodia.

### JSX

Näyttää siltä, että React-komponentti palauttaa HTML-koodia. Näin ei kuitenkaan ole. React-komponenttien ulkoasu kirjoitetaan yleensä [JSX](https://reactjs.org/docs/introducing-jsx.html):ää käyttäen. Vaikka JSX näyttää HTML:ltä, kyseessä on kuitenkin tapa kirjoittaa Javascriptiä. React komponenttien palauttama JSX käännetään konepellin alla Javascriptiksi.

Käännösvaiheen jälkeen ohjelmamme näyttää seuraavalta:

```js
import React from 'react';
import ReactDOM from 'react-dom';

const App = () => {
  const now = new Date();
  const a = 10;
  const b = 20;
  return React.createElement(
    'div',
    null,
    React.createElement('p', null, 'Hello world, it is ', now.toString()),
    React.createElement('p', null, a, ' plus ', b, ' is ', a + b)
  );
};

ReactDOM.render(
  React.createElement(App, null),
  document.getElementById('root')
);
```

Käännöksen hoitaa [Babel](https://babeljs.io/repl/). Create-react-app:illa luoduissa projekteissa käännös on konfiguroitu tapahtumaan automaattisesti. Tulemme tutustumaan aiheeseen tarkemmin kurssin [osassa 7](/osa7).

Reactia olisi myös mahdollista kirjoittaa "suoraan Javascriptinä" käyttämättä JSX:ää. Kukaan täysijärkinen ei kuitenkaan niin tee.

Käytännössä JSX on melkein kuin HTML:ää sillä erotuksella, että mukaan voi upottaa helposti dynaamista sisältöä kirjoittamalla sopivaa Javascriptiä aaltosulkeiden sisälle. Idealtaan JSX on melko lähellä monia palvelimella käytettäviä templating-kieliä kuten Java Springin yhteydessä käytettävää thymeleafia.

JSX on "XML:n kaltainen", eli jokainen tagi tulee sulkea. Esimerkiksi rivinvaihto on tyhjä elementti, joka kirjoitetaan HTML:ssä tyypillisesti

```html
<br />
```

mutta JSX:ää kirjoittaessa tagi on pakko sulkea:

```html
<br />
```

## Monta komponenttia

Muutetaan sovellusta seuraavasti (yläreunan importit jätetään _esimerkeistä_ nyt ja jatkossa pois):

```react
const Hello = () => {
  return (
    <div>
      <p>Hello world</p>
    </div>
  )
}

const App = () => {
  return (
    <div>
      <h1>Greetings</h1>
      <Hello />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
```

Olemme määritelleet uuden komponentin _Hello_, jota käytetään komponentista _App_. Komponenttia voidaan luonnollisesti käyttää monta kertaa:

```react
const App = () => {
  return (
    <div>
      <h1>Greetings</h1>
      <Hello />
      <Hello />
      <Hello />
    </div>
  )
}
```

Komponenttien tekeminen Reactissa on helppoa ja komponentteja yhdistelemällä monimutkaisempikin sovellus on mahdollista pitää kohtuullisesti ylläpidettävänä. Reactissa filosofiana onkin koostaa sovellus useista, pieneen asiaan keskittyvistä uudelleenkäytettävistä komponenteista.

## props: tiedonvälitys komponenttien välillä

Komponenteille on mahdollista välittää dataa [propsien](https://reactjs.org/docs/components-and-props.html) avulla.

Muutetaan komponenttia _Hello_ seuraavasti

```react
const Hello = (props) => {
  return (
    <div>
      <p>Hello {props.name}</p>
    </div>
  )
}
```

komponentin määrittelevällä funktiolla on nyt parametri _props_. Parametri saa arvokseen olion, jonka kenttinä ovat kaikki eri "propsit", jotka komponentin käyttäjä määrittelee.

Propsit määritellään seuraavasti:

```react
const App = () => {
  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="Arto" />
      <Hello name="Pekka" />
    </div>
  )
}
```

Propseja voi olla mielivaltainen määrä ja niiden arvot voivat olla "kovakoodattuja" merkkijonoja tai Javascript-lausekkeiden tuloksia. Jos propsin arvo muodostetaan Javascriptillä, tulee se olla aaltosulkeissa.

Muutetaan koodia siten, että komponentti _Hello_ käyttää kahta propsia:

```react
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

Komponentti _App_ lähettää propseina muuttujan arvoja, summalausekkeen evaluoinnin tuloksen ja normaalin merkkijonon.

### Muutama huomio

React on konfiguroitu antamaan varsin hyviä virheilmoituksia. Kannattaa kuitenkin edetä ainakin alussa **todella pienin askelin** ja varmistaa, että jokainen muutos toimii halutulla tavalla.

**Konsolin tulee olla koko ajan auki**. Jos selain ilmoittaa virheestä, ei kannata kirjoittaa sokeasti lisää koodia ja toivoa ihmettä tapahtuvaksi, vaan tulee yrittää ymmärtää virheen syy ja esim. palata edelliseen toimivaan tilaan:

![](../images/1/27.png)

Kannattaa myös muistaa, että React-koodissakin on mahdollista ja kannattavaa lisätä koodin sekaan sopivia konsoliin tulostavia <code>console.log()</code>-komentoja. Tulemme hieman [myöhemmin](#react-sovellusten-debuggaus) tutustumaan muutamiin muihinkin tapoihin debugata Reactia.

Kannattaa pitää mielessä, että **React-komponenttien nimien tulee alkaa isolla kirjaimella**. Jos yrität määritellä komponentin seuraavasti:

```react
const footer = () => {
  return (
    <div>greeting app created by <a href="https://github.com/mluukkai">mluukkai</a></div>
  )
}
```

ja ottaa se käyttöön

```react
const App = () => {
  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="Arto" age={26 + 10} />
      <footer />
    </div>
  )
}
```

sivulle ei kuitenkaan ilmesty näkyviin Footer-komponentissa määriteltyä sisältöä, vaan React luo sivulle ainoastaan tyhjän _footer_-elementin. Jos muutat komponentin nimen alkamaan isolla kirjaimella, React luo sivulle _div_-elementin, joka määriteltiin Footer-komponentissa.

Kannattaa myös pitää mielessä, että React-komponentin sisällön tulee (yleensä) sisältää **yksi juurielementti**. Eli jos yrittäisimme määritellä komponentin _App_ ilman uloimmaista _div_-elementtiä:

```react
const App = () => {
  return (
    <h1>Greetings</h1>
    <Hello name="Arto" age={26 + 10} />
    <Footer />
  )
}
```

seurauksena on virheilmoitus:

![](../assets/1/27a.png)

Reactin versiosta 0.16 asti juurielementin käyttö ei ole ollut enää ainoa toimiva vaihtoehto, myös _taulukollinen_ komponentteja on validi tapa:

```react
const App = () => {
  return (
    [
      <h1>Greetings</h1>,
      <Hello name="Arto" age={26 + 10} />,
      <Footer />
    ]
  )
}
```

Määritellessä sovelluksen juurikomponenttia, tämä ei kuitenkaan ole järkevää ja näyttää koodissakin pahalta.

</div>

<div class="tasks">
  <h3>Tehtävät 1.1</h3>

  <h4>jako komponenteiksi</h4>

Luo create-react-app:illa uusi sovellus. Muuta <i>index.js</i> muotoon

```react
import React from 'react'
import ReactDOM from 'react-dom'

const App = () => {
  const kurssi = 'Half Stack -sovelluskehitys'
  const osa1 = 'Reactin perusteet'
  const tehtavia1 = 10
  const osa2 = 'Tiedonvälitys propseilla'
  const tehtavia2 = 7
  const osa3 = 'Komponenttien tila'
  const tehtavia3 = 14

  return (
    <div>
      <h1>{kurssi}</h1>
      <p>{osa1} {tehtavia1}</p>
      <p>{osa2} {tehtavia2}</p>
      <p>{osa3} {tehtavia3}</p>
      <p>yhteensä {tehtavia1 + tehtavia2 + tehtavia3} tehtävää</p>
    </div>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
```

ja poista ylimääräiset tiedostot.

Koko sovellus on nyt ikävästi yhdessä komponentissa. Refaktoroi sovelluksen koodi siten, että se koostuu kolmesta komponentista <i>Otsikko</i>, <i>Sisalto</i> ja <i>Yhteensa</i>. Kaikki data pidetään edelleen komponentissa <i>App</i>, joka välittää tarpeelliset tiedot kullekin komponentille <i>props:ien</i> avulla. <i>Otsikko</i> huolehtii kurssin nimen renderöimisestä, <i>Sisalto</i> osista ja niiden tehtävämääristä ja <i>Yhteensa</i> tehtävien yhteismäärästä.

Komponentin <i>App</i> runko tulee olemaan suunnilleen seuraavanlainen:

```react
const App = () => {
  // const-määrittelyt

  return (
    <div>
      <Otsikko kurssi={kurssi} />
      <Sisalto ... />
      <Yhteensa ... />
    </div>
  )
}
```

<h3 class="spacing">Tehtävät 1.2</h3>

<h4>lisää komponentteja</h4>

Refaktoroi vielä komponentti <i>Sisalto</i> siten, että se ei itse renderöi yhdenkään osan nimeä eikä sen tehtävälukumäärää vaan ainoastaan kolme <i>Osa</i>-nimistä komponenttia, joista kukin siis renderöi yhden osan nimen ja tehtävämäärän.

```react
const Sisalto = ... {
  return (
    <div>
      <Osa .../>
      <Osa .../>
      <Osa .../>
    </div>
  )
}
```

Sovelluksemme tiedonvälitys on tällä hetkellä todella alkukantaista, sillä se perustuu yksittäisiin muuttujiin. Tilanne paranee pian.

</div>
