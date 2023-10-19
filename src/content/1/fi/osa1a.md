---
mainImage: ../../../images/part-1.svg
part: 1
letter: a
lang: fi
---

<div class="content">

Alamme nyt tutustua kurssin ehkä tärkeimpään teemaan, [React](https://react.dev/)-kirjastoon. Tehdään heti yksinkertainen React-sovellus ja tutustutaan samalla Reactin peruskäsitteistöön.

Helpoin tapa päästä alkuun on [Vite](https://vitejs.dev/)-nimisen työkalun käyttö.

Luodaan sovellus nimeltään <i>part1</i>, mennään sovelluksen sisältämään hakemistoon ja asennetaan sovelluksen käyttämät kirjastot:

```bash
npm create vite@latest part1 -- --template react
cd part1
npm install
```

Sovellus käynnistetään seuraavasti:

```bash
npm run dev
```

Konsoli kertoo että sovellus on käynnistynyt localhostin porttiin 5173, eli osoitteeseen <http://localhost:5173/>:

![](../../images/1/1-vite1.png)

Vite käynnistää sovelluksen [oletusarvoisesti](https://vitejs.dev/config/server-options.html#server-port) porttiin 5173. Jos se ei ole vapaana, käyttää Vite seuraavaa vapaata porttinumeroa.

Avataan selain sekä tekstieditori siten, että näet koodin ja web-sivun samaan aikaan ruudulla:

![](../../images/1/1-vite4.png)

Sovelluksen koodi on hakemistossa <i>src</i>. Yksinkertaistetaan valmiina olevaa koodia siten, että tiedoston <i>main.jsx</i> sisällöksi tulee:

```js
import ReactDOM from 'react-dom/client'

import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)

```

ja tiedoston <i>App.jsx</i> sisällöksi

```js
const App = () => (
  <div>
    <p>Hello world</p>
  </div>
)

export default App
```

Tiedostot <i>App.css</i> ja <i>index.css</i> sekä hakemiston <i>assets</i> voi poistaa, sillä emme tarvitse niitä.

### create-react-app

Voit halutessasi käyttä kurssilla Viten sijaan myös [create-react-app](https://github.com/facebookincubator/create-react-app)-nimistä sovellusta. Näkyvin ero Viteen on sovelluksen aloitustiedoston nimi, joka on <i>index.js</i>. Myös sovelluksen käynnistämistapa eroaa, käynnistäminen tapahtuu komennolla 

```
npm start
```

Kurssia ollaan tällä hetkellä (11.8.2023) päivittämässä käyttämään Viteä. Joissain erimerkeissä voi vielä olla käytössä create-react-app:illa luotu sovelluspohja.

### Komponentti

Tiedosto <i>App.jsx</i> määrittelee nyt React-[komponentin](https://react.dev/learn/your-first-component) nimeltään <i>App</i>. Tiedoston <i>main.jsx</i> viimeisen rivin komento

```js
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

renderöi komponentin sisällön tiedoston <i>index.html</i> määrittelemään <i>div</i>-elementtiin, jonka <i>id:n</i> arvona on 'root'.

Tiedosto <i>index.html</i> on headerin määrittelyjä lukuun ottamatta oleellisesti ottaen tyhjä:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

```

Voit kokeilla lisätä tiedostoon HTML:ää. Reactilla ohjelmoitaessa yleensä kuitenkin kaikki renderöitävä sisältö määritellään Reactin komponenttien avulla.

Tarkastellaan vielä tarkemmin komponentin määrittelevää koodia:

```js
const App = () => (
  <div>
    <p>Hello world</p>
  </div>
)
```

Kuten arvata saattaa, komponentti renderöityy <i>div</i>-tagina, jonka sisällä on <i>p</i>-tagin sisällä oleva teksti <i>Hello world</i>.

Teknisesti ottaen komponentti on määritelty JavaScript-funktiona. Seuraava on siis funktio (joka ei saa yhtään parametria):

```js
() => (
  <div>
    <p>Hello world</p>
  </div>
)
```

joka sijoitetaan vakioarvoiseen muuttujaan <i>App</i>

```js
const App = ...
```

JavaScriptissa on muutama tapa määritellä funktioita. Käytämme nyt JavaScriptin hieman uudemman version [ECMAScript 6:n](http://es6-features.org/#Constants) eli ES6:n [nuolifunktiota](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) (arrow functions).

Koska funktio koostuu vain yhdestä lausekkeesta, käytössämme on lyhennysmerkintä, joka vastaa seuraavaa koodia:

```js
const App = () => {
  return (
    <div>
      <p>Hello world</p>
    </div>
  )
}
```

eli funktio palauttaa sisältämänsä lausekkeen arvon.

Komponentin määrittelevä funktio voi sisältää mitä tahansa JavaScript-koodia. Muuta komponenttisi seuraavaan muotoon:

```js
const App = () => {
  console.log('Hello from komponentti')
  return (
    <div>
      <p>Hello world</p>
    </div>
  )
}

export default App
```

ja katso mitä selaimen konsolissa tapahtuu:

![](../../images/1/30.png)

Web-sovelluskehityksen sääntö numero yksi on

> <i>pidä konsoli koko ajan auki</i>

Toistetaan tämä vielä yhdessä: <i>pidän konsolin koko ajan auki</i> tämän kurssin ja koko loppuelämäni ajan tehdessäni web-sovelluskehitystä.

Komponenttien sisällä on mahdollista renderöidä myös dynaamista sisältöä.

Muuta komponentti muotoon:

```js
const App = () => {
  const now = new Date()
  const a = 10
  const b = 20
  console.log(now, a+b)

  return (
    <div>
      <p>Hello world, it is {now.toString()}</p>
      <p>
        {a} plus {b} is {a + b}
      </p>
    </div>
  )
}
```

Aaltosulkeiden sisällä oleva JavaScript-koodi evaluoidaan ja evaluoinnin tulos upotetaan määriteltyyn kohtaan komponentin tuottamaa HTML-koodia.

Huom: älä poista tiedoston lopusta riviä

```js
export default App
```

Kyseistä riviä ei useimmiten näytetä materiaalin esimerkeissä mutta ilman sitä komponentti ja koko ohjelma hajoaa.

Muistitko pitää konsolin auki? Mitä sinne tulostui?

### JSX

Näyttää siltä, että React-komponentti palauttaa HTML-koodia. Näin ei kuitenkaan ole. React-komponenttien ulkoasu kirjoitetaan yleensä [JSX](https://react.dev/learn/writing-markup-with-jsx):ää käyttäen. Vaikka JSX näyttää HTML:ltä, kyseessä on kuitenkin tapa kirjoittaa JavaScriptia. React-komponenttien palauttama JSX käännetään konepellin alla JavaScriptiksi.

Käännösvaiheen jälkeen komponentin määrittelevä koodi näyttää seuraavalta:

```js
const App = () => {
  const now = new Date()
  const a = 10
  const b = 20
  return React.createElement(
    'div',
    null,
    React.createElement(
      'p', null, 'Hello world, it is ', now.toString()
    ),
    React.createElement(
      'p', null, a, ' plus ', b, ' is ', a + b
    )
  )
}
```

Käännöksen hoitaa [Babel](https://babeljs.io/repl/). Create-react-app:illa luoduissa projekteissa käännös on konfiguroitu tapahtumaan automaattisesti. Tulemme tutustumaan aiheeseen tarkemmin kurssin [osassa 7](/osa7).

Reactia olisi mahdollista kirjoittaa myös "suoraan JavaScriptinä" käyttämättä JSX:ää, mutta tämä ei ole järkevää.

Käytännössä JSX on melkein kuin HTML:ää sillä erotuksella, että mukaan voi upottaa helposti dynaamista sisältöä kirjoittamalla sopivaa JavaScriptia aaltosulkeiden sisälle. Idealtaan JSX on melko lähellä monia palvelimella käytettäviä templating-kieliä kuten Java Springin yhteydessä käytettävää Thymeleafia.

JSX on "XML:n kaltainen", eli jokainen tagi tulee sulkea. Esimerkiksi rivinvaihto on tyhjä elementti, joka voidaan kirjoittaa HTML:ssä seuraavasti

```html
<br>
```

mutta JSX:ää kirjoittaessa tagi on pakko sulkea:

```html
<br />
```

### Monta komponenttia

Muutetaan tiedostoa <i>App.jsx</i> seuraavasti (muista, että alimman rivin export jätetään <i>esimerkeistä</i> nyt ja jatkossa pois, niiden on kuitenkin oltava koodissa jotta ohjelma toimisi):

```js
// highlight-start
const Hello = () => {
  return (
    <div>
      <p>Hello world</p>
    </div>
  )
}
// highlight-end

const App = () => {
  return (
    <div>
      <h1>Greetings</h1>
      <Hello /> // highlight-line
    </div>
  )
}
```

Olemme määritelleet uuden komponentin <i>Hello</i>, jota käytetään komponentista <i>App</i>. Komponenttia voidaan luonnollisesti käyttää monta kertaa:

```js
const App = () => {
  return (
    <div>
      <h1>Greetings</h1>
      <Hello />
      // highlight-start
      <Hello />
      <Hello />
      // highlight-end
    </div>
  )
}
```

Komponenttien tekeminen Reactissa on helppoa ja komponentteja yhdistelemällä monimutkaisempikin sovellus on mahdollista pitää kohtuullisesti ylläpidettävänä. Reactissa filosofiana onkin koostaa sovellus useista, pieneen asiaan keskittyvistä uudelleenkäytettävistä komponenteista.

Vahva konventio on myös se, että sovelluksen ylimpänä oleva <i>juurikomponentti</i> on nimeltään <i>App</i>. Tosin kuten [osassa 6](/osa6) tulemme näkemään, on tilanteita, joissa komponentti <i>App</i> ei ole suoraan juuressa, vaan se kääritään sopivan apukomponentin sisään.  

### props: tiedonvälitys komponenttien välillä

Komponenteille on mahdollista välittää dataa [propsien](https://react.dev/learn/passing-props-to-a-component) avulla.

Muutetaan komponenttia <i>Hello</i> seuraavasti:

```js
const Hello = (props) => { // highlight-line
  return (
    <div>
      <p>Hello {props.name}</p> // highlight-line
    </div>
  )
}
```

Komponentin määrittelevällä funktiolla on nyt parametri <i>props</i>. Parametri saa arvokseen olion, jonka kenttinä ovat kaikki eri "propsit", jotka komponentin käyttäjä määrittelee.

Propsit määritellään seuraavasti:

```js
const App = () => {
  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="Maya" /> // highlight-line
      <Hello name="Pekka" /> // highlight-line
    </div>
  )
}
```

Propseja voi olla mielivaltainen määrä ja niiden arvot voivat olla "kovakoodattuja" merkkijonoja tai JavaScript-lausekkeiden tuloksia. Jos propsin arvo muodostetaan JavaScriptillä, sen tulee olla aaltosulkeissa.

Muutetaan koodia siten, että komponentti <i>Hello</i> käyttää kahta propsia:

```js
const Hello = (props) => {
  console.log(props) // highlight-line
  return (
    <div>
      <p>
        Hello {props.name}, you are {props.age} years old // highlight-line
      </p>
    </div>
  )
}

const App = () => {
  const nimi = 'Pekka' // highlight-line
  const ika = 10       // highlight-line

  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="Maya" age={26 + 10} /> // highlight-line
      <Hello name={nimi} age={ika} />     // highlight-line
    </div>
  )
}
```

Komponentti <i>App</i> lähettää propseina muuttujan arvoja, summalausekkeen evaluoinnin tuloksen ja normaalin merkkijonon.

Komponentti <i>Hello</i> myös tulostaa props-olion arvon konsoliin. 

Toivottavasti konsolisi on auki, jos ei ole, muista yhteinen lupauksemme:

> <i>pidän konsolin koko ajan auki tämän kurssin ja koko loppuelämäni ajan tehdessäni web-sovelluskehitystä</i>

Ohjemistokehitys on haastavaa, ja erityisen haastavaksi se muuttuu, jos jokainen mahdollinen apukeino kuten web-konsoli sekä komennolla _console.log_ tehtävät aputulostukset eivät ole käytössä. Ammattilaiset käyttävät näitä <i>aina</i>. Ei ole yhtään syytä miksi aloittelijan pitäisi jättää nämä fantastiset apuvälineet hyödyntämättä.

### Mahdollinen virheilmoitus

Käyttämästäsi editorista riippuen saatat saada tässä vaiheessa seuraavan virheilmoituksen:

![](../../images/1/1-vite5.png)

Kyse ei ole varsinaisesta virheestä vaan [ESLint](https://eslint.org/)-työkalun aiheuttamasta varoituksesta. Saat hiljennettyä varoituksen [react/prop-types](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/prop-types.md) lisäämällä tiedostoon <i>.eslintrc.cjs</i> seuraavan rivin

```js
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/prop-types': false // highlight-line
  },
}
```

Tutustumme ESLintiin tarkemmin [osassa 3](/osa3/validointi_ja_es_lint#lint).


### Muutamia huomioita

React on konfiguroitu antamaan varsin hyviä virheilmoituksia. Kannattaa kuitenkin edetä ainakin alussa **todella pienin askelin** ja varmistaa, että jokainen muutos toimii halutulla tavalla.

<i>**Konsolin tulee olla koko ajan auki**.</i> Jos selain ilmoittaa virheestä, ei kannata kirjoittaa sokeasti lisää koodia ja toivoa ihmettä tapahtuvaksi, vaan tulee yrittää ymmärtää virheen syy ja esim. palata edelliseen toimivaan tilaan:

![](../../images/1/1-vite6.png)

Kuten jo todettiin, myös React-koodissa on mahdollista ja kannattavaa lisätä koodin sekaan sopivia konsoliin tulostavia <em>console.log()</em>-komentoja. Tulemme hieman [myöhemmin](#react-sovellusten-debuggaus) tutustumaan muutamiin muihinkin tapoihin debugata Reactia.

Kannattaa pitää mielessä, että **React-komponenttien nimien tulee alkaa isolla kirjaimella**. Jos yrität määritellä komponentin seuraavasti:

```js
const footer = () => {
  return (
    <div>
      greeting app created by 
      <a href="https://github.com/mluukkai">mluukkai</a>
    </div>
  )
}
```

ja ottaa sen käyttöön

```js
const App = () => {
  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="Maya" age={26 + 10} />
      <footer /> // highlight-line
    </div>
  )
}
```

sivulle ei ilmestykään näkyviin Footer-komponentissa määriteltyä sisältöä, vaan React luo sivulle ainoastaan tyhjän <i>footer</i>-elementin. Jos muutat komponentin nimen alkamaan isolla kirjaimella, React luo sivulle <i>div</i>-elementin, joka määriteltiin Footer-komponentissa.

Kannattaa pitää mielessä myös, että React-komponentin sisällön tulee (yleensä) sisältää **yksi juurielementti**. Eli jos yrittäisimme määritellä komponentin <i>App</i> ilman uloimmaista <i>div</i>-elementtiä

```js
const App = () => {
  return (
    <h1>Greetings</h1>
    <Hello name="Maya" age={26 + 10} />
    <Footer />
  )
}
```

seurauksena on virheilmoitus:

![](../../images/1/1-vite7.png)

Juurielementin käyttö ei ole ainoa toimiva vaihtoehto, myös <i>taulukollinen</i> komponentteja on validi tapa:

```js
const App = () => {
  return [
    <h1>Greetings</h1>,
    <Hello name="Maya" age={26 + 10} />,
    <Footer />
  ]
}
```

Määriteltäessä sovelluksen juurikomponenttia tämä ei kuitenkaan ole järkevää, ja taulukko näyttää koodissakin pahalta.

Juurielementin pakollisesta käytöstä on se seuraus, että sovelluksen DOM-puuhun tulee "ylimääräisiä" div-elementtejä. Tämä on mahdollista välttää käyttämällä [fragmentteja](https://react.dev/reference/react/Fragment), eli ympäröimällä komponentin palauttamat elementit tyhjällä elementillä:

```js
const App = () => {
  const name = 'Pekka'
  const age = 10

  return (
    <>
      <h1>Greetings</h1>
      <Hello name="Maya" age={26 + 10} />
      <Hello name={name} age={age} />
      <Footer />
    </>
  )
}
```

Nyt käännös menee läpi, ja Reactin generoimaan DOM:iin ei tule ylimääräistä div-elementtiä.

### Älä renderöi olioita

Tarkastellaan sovellusta, joka tulostaa ruudulle ystäviemme nimet ja iät:

```js
const App = () => {
  const friends = [
    { name: 'Leevi', age: 4 },
    { name: 'Venla', age: 10 },
  ]

  return (
    <div>
      <p>{friends[0]}</p>
      <p>{friends[1]}</p>
    </div>
  )
}

export default App
```

Mitään ei kuitenkaan tule ruudulle. Yritän etsiä koodista 15 minuutin ajan ongelmaa, mutta en keksi missä vika voisi olla.

Vihdoin mieleeni palaa antamamme lupaus

> <i>pidän konsolin koko ajan auki tämän kurssin ja koko loppuelämäni ajan tehdessäni web-sovelluskehitystä</i>

Konsoli huutaakin punaisena:

![](../../images/1/34new.png)

Ongelman ydin on <i>Objects are not valid as a React child</i> eli sovellus yrittää renderöidä <i>olioita</i> ja se taas ei onnistu.

Koodissa yhden ystävän tiedot yritetään renderöidä seuraavasti

```js
<p>{friends[0]}</p>
```

ja tämä aiheuttaa ongelman sillä aaltosulkeissa oleva renderöitävä asia on olio

```js
{ name: 'Leevi', age: 4 }
```

Yksittäisten aaltosulkeissa renderöitävien asioiden tulee Reactissa olla primitiivisiä arvoja, kuten lukuja tai merkkijonoja.

Korjaus on seuraava

```js
const App = () => {
  const friends = [
    { name: 'Leevi', age: 4 },
    { name: 'Venla', age: 10 },
  ]

  return (
    <div>
      <p>{friends[0].name} {friends[0].age}</p>
      <p>{friends[1].name} {friends[1].age}</p>
    </div>
  )
}

export default App
```

Eli nyt aaltosulkeiden sisällä renderöidään erikseen ystävän nimi

```js
{friends[0].name}
```

ja ikä

```js
{friends[0].age}
```

Virheen korjauksen jälkeen kannattaa konsolin virheilmoitukset tyhjentää painamalla Ø, uudelleenladata tämän jälkeen sivun sisältö ja varmistua että virheilmoituksia ei näy.

Pieni lisähuomio edelliseen. React sallii myös taulukoiden renderöimisen <i>jos</i> taulukko sisältää arvoja, jotka kelpaavat renderöitäviksi (kuten numeroita tai merkkijonoja). Eli seuraava ohjelma kyllä toimisi, vaikka tulos ei ole kenties se mitä haluamme: 

```js
const App = () => {
  const friends = [ 'Leevi', 'Venla']

  return (
    <div>
      <p>{friends}</p>
    </div>
  )
}
```

Tässä osassa ei kannata edes yrittää hyödyntää taulukoiden suoraa renderöintiä. Palaamme siihen seuraavassa osassa.

</div>

<div class="tasks">
  <h3>Tehtävät 1.1-1.2</h3>

Tehtävät palautetaan GitHubin kautta ja merkitsemällä tehdyt tehtävät [palautussovellukseen](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

Voit palauttaa kurssin kaikki tehtävät samaan repositorioon tai käyttää useita repositorioita. Jos palautat eri osien tehtäviä samaan repositorioon, nimeä hakemistot järkevästi. Jos käytät yksityistä (private) repositoriota tehtävien palautukseen, liitä repositoriolle collaboratoriksi <i>mluukkai</i>.

Eräs varsin toimiva hakemistorakenne palautusrepositoriolle on [tässä esimerkkirepositoriossa käytetty tapa](https://github.com/FullStack-HY2020/palauitusrepositorio), jossa kutakin osaa kohti on oma hakemistonsa, joka vielä jakautuu tehtäväsarjat (esim. osan 1 <i>kurssitiedot</i>) sisältäviin hakemistoihin:

```
osa0
osa1
  kurssitiedot
  unicafe
  anekdootit
osa2
  puhelinluettelo
  maiden_tiedot
```

Kunkin tehtäväsarjan ohjelmasta kannattaa palauttaa kaikki sovelluksen sisältämät tiedostot (paitsi hakemisto <i>node\_modules</i>).

Tehtävät palautetaan **yksi osa kerrallaan**. Kun olet palauttanut osan tehtävät, et voi enää palauttaa saman osan tekemättä jättämiäsi tehtäviä.

Huomaa, että tässä osassa on muitakin tehtäviä kuin alla olevat. <i>Älä siis tee palautusta</i> ennen kun olet tehnyt osan tehtävistä kaikki, jotka haluat palauttaa.

**Vinkki:** Kun olet avaamassa tehtävääsi Visual Studio Codella, huomaathan avata koko projektin kansion editoriin. Tämä mahdollistaa editorissa helpomman tiedostojen välillä siirtymisen ja paremmat automaattiset täydennykset. Tämä onnistuu siirtymällä terminaalissa projektin kansioon ja komentamalla:

```bash
code .
```

  <h4>1.1: kurssitiedot, step1</h4>

<i>Tässä tehtävässä aloitettavaa ohjelmaa kehitellään eteenpäin muutamassa seuraavassa tehtävässä. Tässä ja kurssin aikana muissakin vastaan tulevissa tehtäväsarjoissa ohjelman lopullisen version palauttaminen riittää. Voit toki halutessasi tehdä commitin jokaisen tehtävän jälkeisestä tilanteesta, mutta se ei ole välttämätöntä.</i>

Luo Vitellä uusi sovellus. Muuta <i>main.jsx</i> muotoon

```js
import ReactDOM from 'react-dom/client'

import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

ja tiedosto <i>App.jsx</i> muotoon

```js
const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <h1>{course}</h1>
      <p>
        {part1} {exercises1}
      </p>
      <p>
        {part2} {exercises2}
      </p>
      <p>
        {part3} {exercises3}
      </p>
      <p>Number of exercises {exercises1 + exercises2 + exercises3}</p>
    </div>
  )
}

export default App
```

ja poista ylimääräiset tiedostot <i>App.css</i> ja <i>index.css</i> ja hakemisto <i>assets</i>.

Koko sovellus on nyt ikävästi yhdessä komponentissa. Refaktoroi sovelluksen koodi siten, että se koostuu kolmesta uudesta komponentista: <i>Header</i>, <i>Content</i> ja <i>Total</i>. Kaikki data pidetään edelleen komponentissa <i>App</i>, joka välittää tarpeelliset tiedot kullekin komponentille <i>props:ien</i> avulla. <i>Header</i> huolehtii kurssin nimen renderöimisestä, <i>Content</i> osista ja niiden tehtävämääristä ja <i>Total</i> tehtävien yhteismäärästä.

Tee uudet komponentit tiedostoon <i>App.jsx</i>.

Komponentin <i>App</i> runko tulee olemaan suunnilleen seuraavanlainen:

```js
const App = () => {
  // const-määrittelyt

  return (
    <div>
      <Header course={course} />
      <Content ... />
      <Total ... />
    </div>
  )
}
```

**VAROITUS** älä yritä tehdä ohjelmassasi kaikkia komponentteja yhtä aikaa, sillä se johtaa lähes varmasti siihen että ohjelma ei toimi. Etene pieni askel kerrallaan, tee aluksi esim. komponentti <i>Header</i> ja vasta kun se toimii 100% varmasti, kannattaa edetä seuraavaan komponenttiin.

Huolellinen, pienin askelin eteneminen saattaa tuntua hitaalta, mutta se on itse asiassa <i> ylivoimaisesti nopein</i> tapa edetä. Kuuluisa ohjelmistokehittäjä Robert "Uncle Bob" Martin on todennut

> <i>"The only way to go fast, is to go well"</i>

eli Martinin mukaan pienin askelin tapahtuva huolellinen eteneminen on jopa ainoa tapa olla nopea.

<h4>1.2: kurssitiedot, step2</h4>

Refaktoroi vielä komponentti <i>Content</i> siten, että se ei itse renderöi yhdenkään osan nimeä eikä sen tehtävälukumäärää vaan ainoastaan kolme <i>Part</i>-nimistä komponenttia, joista kukin siis renderöi yhden osan nimen ja tehtävämäärän.

```js
const Content = ... {
  return (
    <div>
      <Part .../>
      <Part .../>
      <Part .../>
    </div>
  )
}
```

  Sovelluksemme tiedonvälitys on tällä hetkellä todella <i>arkaaista</i>, sillä se perustuu yksittäisiin muuttujiin. Tilanne paranee pian.

</div>
