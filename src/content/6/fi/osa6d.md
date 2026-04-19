---
mainImage: ../../../images/part-6.svg
part: 6
letter: d
lang: fi
---

<div class="tasks">

Tämä on kurssin jo käytöstä poistettu Reduxiin liittyvä materiaali. Voit jatkaa tämän matariaalin ja siinä olevien tehtävien tekemistä jos olet jo aloittanut osan tekemisen Reduxilla. Muussa tapauksessa kannattaa seurata uutta materiaalia. Tämä materiaali poistuu näkyvistä kesäkuusa 2026.

</div>

<div class="content">

Olemme noudattaneet sovelluksen tilan hallinnassa Reactin suosittelemaa käytäntöä määritellä useiden komponenttien tarvitsema tila ja sitä käsittelevät funktiot sovelluksen komponenttirakenteen [ylimmissä](https://reactjs.org/docs/lifting-state-up.html) kompontenteissa. Usein suurin osa tilaa ja sitä käsittelevistä funktioista on määritelty suoraan sovelluksen juurikomponentissa ja välitetty propsien avulla niitä tarvitseville komponenteille. Tämä toimii johonkin pisteeseen saakka, mutta sovelluksen kasvaessa tilan hallinta muuttuu haasteelliseksi.

### Flux-arkkitehtuuri

Facebook kehitti jo Reactin historian varhaisvaiheissa tilan hallinnan ongelmia helpottamaan [Flux](https://facebookarchive.github.io/flux/docs/in-depth-overview)-arkkitehtuurin. Fluxissa sovelluksen tilan hallinta erotetaan kokonaan Reactin komponenttien ulkopuolisiin varastoihin eli <i>storeihin</i>. Storessa olevaa tilaa ei muuteta suoraan, vaan tapahtumien eli <i>actionien</i> avulla.

Kun action muuttaa storen tilaa, renderöidään näkymät uudelleen:

![Action -> Dispatcher -> Store -> View](../../images/6/flux1.png)

Jos sovelluksen käyttö (esim. napin painaminen) aiheuttaa tarpeen tilan muutokseen, tehdään muutos actionin avulla. Tämä taas aiheuttaa uuden näytön renderöitymisen:

![Action -> Dispatcher -> Store -> View -> Action -> Dispatcher -> View](../../images/6/flux2.png)

Flux tarjoaa siis standardin tavan sille miten ja missä sovelluksen tila pidetään sekä tavalle tehdä tilaan muutoksia.

### Redux

Facebookilla on olemassa valmis toteutus Fluxille, mutta käytämme kuitenkin saman periaatteen mukaan toimivaa mutta hieman yksinkertaisempaa [Redux](https://redux.js.org)-kirjastoa, jota myös Facebookilla käytetään nykyään alkuperäisen Flux-toteutuksen sijaan.

Tutustutaan Reduxiin tekemällä jälleen kerran laskurin toteuttava sovellus:

![Renderöity kokonaisluku sekä kolme nappia: plus, minus ja zero](../../images/6/1.png)

Tehdään uusi Vite‑sovellus ja asennetaan siihen <i>Redux</i>:

```bash
npm install redux
```

Fluxin tapaan Reduxissa sovelluksen tila talletetaan [storeen](https://redux.js.org/basics/store).

Koko sovelluksen tila talletetaan <i>yhteen</i> storen tallettamaan JavaScript-objektiin. Koska sovelluksemme ei tarvitse mitään muuta tilaa kuin laskurin arvon, talletetaan se storeen sellaisenaan. Jos sovelluksen tila olisi monimutkaisempi, talletettaisiin "eri asiat" storessa olevaan olioon erillisinä kenttinä.

Storen tilaa muutetaan [actionien](https://redux.js.org/basics/actions) avulla. Actionit ovat olioita, joilla on vähintään actionin <i>tyypin</i> määrittelevä kenttä <i>type</i>. Sovelluksessamme tarvitsemme esimerkiksi seuraavaa actionia:

```js
{
  type: 'INCREMENT'
}
```

Jos actioneihin liittyy dataa, määritellään niille tarpeen vaatiessa muitakin kenttiä. Laskurisovelluksemme on kuitenkin niin yksinkertainen, että actioneille riittää pelkkä tyyppikenttä.

Actionien vaikutus sovelluksen tilaan määritellään [reducerin](https://redux.js.org/basics/reducers) avulla. Käytännössä reducer on funktio, joka saa parametrikseen staten nykyisen tilan sekä actionin ja <i>palauttaa</i> staten uuden tilan.

Määritellään nyt sovelluksellemme reducer tiedostoon <i>main.jsx</i>. Tiedosto näyttää aluksi seuraavalta:

```js
const counterReducer = (state, action) => {
  if (action.type === 'INCREMENT') {
    return state + 1
  } else if (action.type === 'DECREMENT') {
    return state - 1
  } else if (action.type === 'ZERO') {
    return 0
  }

  return state
}
```

Ensimmäinen parametri on siis storessa oleva <i>tila</i>. Reducer palauttaa <i>uuden tilan</i> actionin tyypin mukaan. Eli esim. actionin tyypin ollessa <i>INCREMENT</i> tila saa arvokseen vanhan arvon plus yksi. Jos actionin tyyppi on <i>ZERO</i> tilan uusi arvo on nolla.

Muutetaan koodia vielä hiukan. Reducereissa on tapana käyttää if:ien sijaan [switch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch)-komentoa.
Määritellään myös parametrille <i>state</i> [oletusarvoksi](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters) 0. Näin reducer toimii vaikka storen tilaa ei olisi vielä alustettu.

```js
const counterReducer = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    case 'ZERO':
      return 0
    default: // jos ei mikään ylläolevista tullaan tänne
      return state
  }
}
```

Reduceria ei ole tarkoitus kutsua koskaan suoraan sovelluksen koodista. Reducer ainoastaan annetaan parametrina storen luovalle _createStore_-funktiolle:

```js
import { createStore } from 'redux' // highlight-line

const counterReducer = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    case 'ZERO':
      return 0
    default:
      return state
  }
}

const store = createStore(counterReducer) // highlight-line
```

Koodieditori saattaa huomauttaa, että _createStore_ on vanhentunut. Ei välitetä siitä toistaiseksi, alempana on tarkempi selitys asiasta.

Store käyttää nyt reduceria käsitelläkseen <i>actioneja</i>, jotka <i>dispatchataan</i> eli "lähetetään" storelle sen [dispatch](https://redux.js.org/api/store#dispatchaction)-metodilla:

```js
store.dispatch({type: 'INCREMENT'})
```

Storen tilan saa selville metodilla [getState](https://redux.js.org/api/store/#getstate).

Esim. seuraava koodi

```js
// ...

const store = createStore(counterReducer)

// highlight-start
console.log(store.getState())
store.dispatch({type: 'INCREMENT'})
store.dispatch({type: 'INCREMENT'})
store.dispatch({type: 'INCREMENT'})
console.log(store.getState())
store.dispatch({type: 'ZERO'})
store.dispatch({type: 'DECREMENT'})
console.log(store.getState())
// highlight-end
```

tulostaisi konsoliin

```
0
3
-1
```

sillä ensin storen tila on 0. Kolmen <i>INCREMENT</i>-actionin jälkeen tila on 3, ja lopulta actionien <i>ZERO</i> ja <i>DECREMENT</i> jälkeen -1.

Kolmas storen tärkeä metodi on [subscribe](https://redux.js.org/api/store#subscribelistener), jonka avulla voidaan määritellä takaisinkutsufunktioita, joita store kutsuu sen tilan muuttumisen yhteydessä.

Esimerkkinä voisimme tulostaa <i>jokaisen storen muutoksen</i> konsoliin näin:

```js
store.subscribe(() => {
  const storeNow = store.getState()
  console.log(storeNow)
})
```

Tällöin koodi

```js
// ...

const store = createStore(counterReducer)

// highlight-start
store.subscribe(() => {
  const storeNow = store.getState()
  console.log(storeNow)
})
// highlight-end

// highlight-start
store.dispatch({ type: 'INCREMENT' })
store.dispatch({ type: 'INCREMENT' })
store.dispatch({ type: 'INCREMENT' })
store.dispatch({ type: 'ZERO' })
store.dispatch({ type: 'DECREMENT' })
// highlight-end
```

tulostaisi

```
1
2
3
0
-1
```


Laskurisovelluksemme koodi on seuraavassa. Kaikki koodi on kirjoitettu samaan tiedostoon, joten <i>store</i> on suoraan React-koodin käytettävissä. Tutustumme React/Redux-koodin parempiin strukturointitapoihin myöhemmin. Tiedoston <i>main.jsx</i> sisältö näyttää seuraavalta:

```js
import ReactDOM from 'react-dom/client'
import { createStore } from 'redux'

const counterReducer = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    case 'ZERO':
      return 0
    default:
      return state
  }
}

const store = createStore(counterReducer)

const App = () => {
  return (
    <div>
      <div>{store.getState()}</div>
      <button onClick={() => store.dispatch({ type: 'INCREMENT' })}>
        plus
      </button>
      <button onClick={() => store.dispatch({ type: 'DECREMENT' })}>
        minus
      </button>
      <button onClick={() => store.dispatch({ type: 'ZERO' })}>
        zero
      </button>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))

const renderApp = () => {
  root.render(<App />)
}

renderApp()
store.subscribe(renderApp)
```

Koodissa on pari huomionarvoista seikkaa. <i>App</i> renderöi laskurin arvon kysymällä sitä storesta metodilla _store.getState()_. Nappien tapahtumankäsittelijät <i>dispatchaavat</i> suoraan oikean tyyppiset actionit storelle.

Kun storessa olevan tilan arvo muuttuu, ei React osaa automaattisesti renderöidä sovellusta uudelleen. Olemmekin rekisteröineet koko sovelluksen renderöinnin suorittavan funktion _renderApp_ kuuntelemaan storen muutoksia metodilla _store.subscribe_. Huomaa, että joudumme kutsumaan heti alussa metodia _renderApp_, sillä ilman kutsua sovelluksen ensimmäistä renderöintiä ei tapahdu ollenkaan.

### Huomautus funktion createStore käytöstä

Tarkkasilmäisimmät huomaavat, että funktion createStore nimen päällä on viiva. Jos hiiren vie nimen päälle, tulee asialle selitystä 

![](../../images/6/30new.png)

Selitys on kokonaisuudessaan seuraava

><i>We recommend using the configureStore method of the @reduxjs/toolkit package, which replaces createStore.</i>
>
><i>Redux Toolkit is our recommended approach for writing Redux logic today, including store setup, reducers, data fetching, and more.</i>
>
><i>For more details, please read this Redux docs page: https://redux.js.org/introduction/why-rtk-is-redux-today</i>
>
><i>configureStore from Redux Toolkit is an improved version of createStore that simplifies setup and helps avoid common bugs.</i>
>
><i>You should not be using the redux core package by itself today, except for learning purposes. The createStore method from the core redux package will not be removed, but we encourage all users to migrate to using Redux Toolkit for all Redux code.</i>

Funktion <i>createStore</i> sijaan siis suositellaan käytettäväksi hieman "kehittyneempää" funktiota <i>configureStore</i>, ja mekin tulemme ottamaan sen käyttöömme kun olemme ottaneet Reduxin perustoiminnallisuuden haltuun.

Sivuhuomio: <i>createStore</i> on määritelty olevan "deprecated", joka yleensä tarkoittaa sitä, että ominaisuus tulee poistumaan kirjaston jossain uudemmassa versiossa. Yllä oleva selitys ja [tämäkin](https://stackoverflow.com/questions/71944111/redux-createstore-is-deprecated-cannot-get-state-from-getstate-in-redux-ac) keskustelu paljastavat, että <i>createStore</i> ei tule poistumaan, ja sille onkin annettu ehkä hieman virheellisin perustein status <i>deprecated</i>. Funktio ei siis ole vanhentunut, mutta nykyään on olemassa suositeltavampi, uusi tapa tehdä suunnilleen sama asia.

### Redux-muistiinpanot

Tavoitteenamme on muuttaa muistiinpanosovellus käyttämään tilanhallintaan Reduxia. Katsotaan kuitenkin ensin eräitä konsepteja hieman yksinkertaistetun muistiinpanosovelluksen kautta.

Sovelluksen ensimmäinen versio tiedostossa <i>main.jsx</i> on seuraava:

```js
import ReactDOM from 'react-dom/client'
import { createStore } from 'redux'

const noteReducer = (state = [], action) => {
  switch (action.type) {
    case 'NEW_NOTE':
      state.push(action.payload)
      return state
    default:
      return state
  }
}

const store = createStore(noteReducer)

store.dispatch({
  type: 'NEW_NOTE',
  payload: {
    content: 'the app state is in redux store',
    important: true,
    id: 1
  }
})

store.dispatch({
  type: 'NEW_NOTE',
  payload: {
    content: 'state changes are made with actions',
    important: false,
    id: 2
  }
})

const App = () => {
  return (
    <div>
      <ul>
        {store.getState().map(note => (
          <li key={note.id}>
            {note.content} <strong>{note.important ? 'important' : ''}</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))

const renderApp = () => {
  root.render(<App />)
}

renderApp()
store.subscribe(renderApp)
```

Toistaiseksi sovelluksessa ei siis ole toiminnallisuutta uusien muistiinpanojen lisäämiseen, mutta voimme toteuttaa sen dispatchaamalla <i>NEW\_NOTE</i>-tyyppisiä actioneja koodista.

Actioneissa on nyt tyypin lisäksi kenttä <i>payload</i>, joka sisältää lisättävän muistiinpanon:

```js
{
  type: 'NEW_NOTE',
  payload: {
    content: 'state changes are made with actions',
    important: false,
    id: 2
  }
}
```

Kentän nimen valinta ei ole sattumanvarainen. Yleinen konventio on, että actioneilla on juurikin kaksi kenttää, tyypin kertova <i>type</i> ja actionin mukana olevan tiedon sisältävä <i>payload</i>.

### Puhtaat funktiot ja muuttumattomat (immutable) oliot

Reducerimme alustava versio on yksinkertainen:

```js
const noteReducer = (state = [], action) => {
  switch (action.type) {
    case 'NEW_NOTE':
      state.push(action.payload)
      return state
    default:
      return state
  }
}
```

Tila on nyt taulukko. <i>NEW\_NOTE</i>-tyyppisen actionin seurauksena tilaan lisätään uusi muistiinpano metodilla [push](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push).

Sovellus näyttää toimivan, mutta määrittelemämme reduceri on huono, sillä se rikkoo Reduxin reducerien [perusolettamusta](https://redux.js.org/tutorials/essentials/part-1-overview-concepts#reducers) siitä, että reducerien tulee olla [puhtaita funktioita](https://en.wikipedia.org/wiki/Pure_function).

Puhtaat funktiot ovat sellaisia, että ne <i>eivät aiheuta mitään sivuvaikutuksia</i> ja ne palauttavat aina saman vastauksen samoilla parametreilla kutsuttaessa.

Lisäsimme tilaan uuden muistiinpanon metodilla _state.push(action.payload)_, joka <i>muuttaa</i> state-olion tilaa. Tämä ei ole sallittua. Ongelman voi korjata helposti käyttämällä metodia [concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat), joka luo <i>uuden taulukon</i>, jonka sisältönä on vanhan taulukon alkiot sekä lisättävä alkio:

```js
const noteReducer = (state = [], action) => {
  switch (action.type) {
    case 'NEW_NOTE':
      return state.concat(action.payload) // highlight-line
    default:
      return state
  }
}
```

Reducerin tilan tulee koostua muuttumattomista eli [immutable](https://en.wikipedia.org/wiki/Immutable_object)-olioista. Jos tilaan tulee muutos, ei vanhaa oliota muuteta, vaan se <i>korvataan uudella muuttuneella oliolla</i>. Juuri näin toimimme uudistuneessa reducerissa, eli vanha taulukko korvaantuu uudella.

Laajennetaan reduceria siten, että se osaa käsitellä muistiinpanon tärkeyteen liittyvän muutoksen:

```js
{
  type: 'TOGGLE_IMPORTANCE',
  payload: {
    id: 2
  }
}
```

Koska meillä ei ole vielä koodia joka käyttää ominaisuutta, laajennetaan reduceria testivetoisesti.

### Testiympäristön konfigurointi 

Konfiguroidaan sovellukseen [Vitest](https://vitest.dev/). Asennetaan se sovelluksen kehityksenaikaiseksi riippuvuudeksi:

```js
npm install --save-dev vitest
```

Lisätään tiedostoon <i>package.json</i> testit suorittava skripti:

```json
{
  // ...
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "test": "vitest" // highlight-line
  },
  // ...
}
```

Jotta testaus olisi helpompaa, siirretään reducerin koodi ensin omaan moduuliinsa tiedostoon <i>src/reducers/noteReducer.js</i>:

```js
const noteReducer = (state = [], action) => {
  switch (action.type) {
    case 'NEW_NOTE':
      return state.concat(action.payload)
    default:
      return state
  }
}

export default noteReducer
```

Tiedosto <i>main.jsx</i> muuttuu seuraavasti:

```js
import ReactDOM from 'react-dom/client'
import { createStore } from 'redux'
import noteReducer from './reducers/noteReducer' // highlight-line

const store = createStore(noteReducer)

// ...
```

 Otetaan lisäksi käyttöön kirjasto [deep-freeze](https://www.npmjs.com/package/deep-freeze), jonka avulla voimme varmistaa, että reducer on määritelty oikeaoppisesti puhtaana funktiona. Asennetaan kirjasto kehitysaikaiseksi riippuvuudeksi:

```js
npm install --save-dev deep-freeze
```

Olemme nyt valmiita kirjoittamaan testejä. 

### Testit noteReducerille

Aloitetaan tekemällä testi actionin <i>NEW\_NOTE</i> käsittelylle. Määritellään testi tiedostoon <i>src/reducers/noteReducer.test.js</i>:

```js
import deepFreeze from 'deep-freeze'
import { describe, expect, test } from 'vitest'
import noteReducer from './noteReducer'

describe('noteReducer', () => {
  test('returns new state with action NEW_NOTE', () => {
    const state = []
    const action = {
      type: 'NEW_NOTE',
      payload: {
        content: 'the app state is in redux store',
        important: true,
        id: 1
      }
    }

    deepFreeze(state)
    const newState = noteReducer(state, action)

    expect(newState).toHaveLength(1)
    expect(newState).toContainEqual(action.payload)
  })
})
```

Suoritetaan testi komennolla _npm test_. Testi siis varmistaa, että reducerin palauttama uusi tila on taulukko, joka sisältää yhden elementin, joka on sama kun actionin kentän <i>payload</i> sisältävä olio.

Komento <i>deepFreeze(state)</i> varmistaa, että reducer ei muuta parametrina olevaa storen tilaa. Jos reducer käyttäisi tilan manipulointiin komentoa _push_, testi ei menisi läpi:

![Testi aiheuttaa virheilmoituksen TypeError: Can not add property 0, object is not extensible. Syynä komento state.push(action.payload)](../../images/6/2.png)

Tehdään sitten testi actionin <i>TOGGLE\_IMPORTANCE</i> käsittelylle:

```js
test('returns new state with action TOGGLE_IMPORTANCE', () => {
  const state = [
    {
      content: 'the app state is in redux store',
      important: true,
      id: 1
    },
    {
      content: 'state changes are made with actions',
      important: false,
      id: 2
    }
  ]

  const action = {
    type: 'TOGGLE_IMPORTANCE',
    payload: {
      id: 2
    }
  }

  deepFreeze(state)
  const newState = noteReducer(state, action)

  expect(newState).toHaveLength(2)

  expect(newState).toContainEqual(state[0])

  expect(newState).toContainEqual({
    content: 'state changes are made with actions',
    important: true,
    id: 2
  })
})
```

Eli seuraavan actionin

```js
{
  type: 'TOGGLE_IMPORTANCE',
  payload: {
    id: 2
  }
}
```

tulee muuttaa tärkeys muistiinpanolle, jonka id on 2.

Reducer laajenee seuraavasti:

```js
const noteReducer = (state = [], action) => {
  switch(action.type) {
    case 'NEW_NOTE':
      return state.concat(action.payload)
    // highlight-start
    case 'TOGGLE_IMPORTANCE': {
      const id = action.payload.id
      const noteToChange = state.find(n => n.id === id)
      const changedNote = {
        ...noteToChange,
        important: !noteToChange.important
      }
      return state.map(note => (note.id !== id ? note : changedNote))
    }
    // highlight-end
    default:
      return state
  }
}
```

Luomme tärkeyttä muuttaneesta muistiinpanosta kopion osasta 2 [tutulla syntaksilla](/osa2/palvelimella_olevan_datan_muokkaaminen#muistiinpanon-tarkeyden-muutos) ja korvaamme tilan uudella tilalla, johon otetaan muuttumattomat muistiinpanot ja muutettavasta sen muutettu kopio <i>changedNote</i>.

Kerrataan vielä mitä koodissa tapahtuu. Ensin etsitään olio, jonka tärkeys on tarkoitus muuttaa:

```js
const noteToChange = state.find(n => n.id === id)
```

Luodaan sitten uusi olio, joka on muuten <i>kopio</i> muuttuvasta oliosta mutta kentän <i>important</i> arvo on muutettu päinvastaiseksi:

```js
const changedNote = { 
  ...noteToChange, 
  important: !noteToChange.important 
}
```

Lopuksi palautetaan uusi tila. Se saadaan valitsemalla kaikki vanhan tilan muistiinpanot pois lukien etsittävää <i>id</i>:tä vastaava muistiinpano, jonka tilalle valitaan juuri muokattu muistiinpano:

```js
state.map(note => (note.id !== id ? note : changedNote))
```

### Array spread ‑syntaksi

Koska reducerille on nyt suhteellisen hyvät testit, voimme refaktoroida koodia turvallisesti.

Uuden muistiinpanon lisäys luo palautettavan tilan taulukon _concat_-funktiolla. Katsotaan nyt miten voimme toteuttaa saman hyödyntämällä JavaScriptin [array spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator) ‑syntaksia:

```js
const noteReducer = (state = [], action) => {
  switch(action.type) {
    case 'NEW_NOTE':
      return [...state, action.payload] // highlight-line
    case 'TOGGLE_IMPORTANCE': {
      // ...
    }
    default:
    return state
  }
}
```

Spread-syntaksi toimii seuraavasti. Jos määrittelemme

```js
const luvut = [1, 2, 3]
```

niin <code>...luvut</code> hajottaa taulukon yksittäisiksi alkioiksi, eli voimme sijoittaa sen esim. toisen taulukon sisään:

```js
[...luvut, 4, 5]
```

ja lopputuloksena on taulukko, jonka sisältö on <i>[1, 2, 3, 4, 5]</i>.

Jos olisimme sijoittaneet taulukon toisen sisälle ilman spreadia, eli

```js
[luvut, 4, 5]
```

lopputulos olisi ollut <i>[[1, 2, 3], 4, 5]</i>.

Samannäköinen syntaksi toimii taulukosta [destrukturoimalla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) alkioita otettaessa siten, että se <i>kerää</i> loput alkiot:

```js
const luvut = [1, 2, 3, 4, 5, 6]

const [eka, toka, ...loput] = luvut

console.log(eka)    // tulostuu 1
console.log(toka)   // tulostuu 2
console.log(loput)  // tulostuu [3, 4, 5, 6]
```

</div>

<div class="tasks">

### Tehtävät 6.1.-6.2.

Tehdään hieman yksinkertaistettu versio osan 1 Unicafe-tehtävästä. Hoidetaan sovelluksen tilan käsittely Reduxin avulla.

Voit ottaa sovelluksesi pohjaksi repositoriossa https://github.com/fullstack-hy2020/unicafe-redux olevan projektin.

<i>Aloita poistamalla kloonatun sovelluksen Git-konfiguraatio ja asentamalla riippuvuudet:</i>

```bash
cd unicafe-redux   // mene kloonatun repositorion hakemistoon
rm -rf .git
npm install
```

#### 6.1: Unicafe revisited, step1

Ennen sivulla näkyvää toiminnallisuutta toteutetaan storen edellyttämä toiminnallisuus.

Storeen täytyy tallettaa erikseen lukumäärä jokaisentyyppisestä palautteesta. Storen hallitsema tila on siis muotoa:

```js
{
  good: 5,
  ok: 4,
  bad: 2
}
```

Projektissa on seuraava runko reducerille:

```js
const initialState = {
  good: 0,
  ok: 0,
  bad: 0
}

const counterReducer = (state = initialState, action) => {
  console.log(action)
  switch (action.type) {
    case 'GOOD':
      return state
    case 'OK':
      return state
    case 'BAD':
      return state
    case 'RESET':
      return state
    default:
      return state
  }
}

export default counterReducer
```

Testien runko on:

```js
import deepFreeze from 'deep-freeze'
import { describe, expect, test } from 'vitest'
import counterReducer from './reducer'

describe('unicafe reducer', () => {
  const initialState = {
    good: 0,
    ok: 0,
    bad: 0
  }

  test('should return a proper initial state when called with undefined state', () => {
    const action = {
      type: 'DO_NOTHING'
    }

    const newState = counterReducer(undefined, action)
    expect(newState).toEqual(initialState)
  })

  test('good is incremented', () => {
    const action = {
      type: 'GOOD'
    }
    const state = initialState

    deepFreeze(state)
    const newState = counterReducer(state, action)
    expect(newState).toEqual({
      good: 1,
      ok: 0,
      bad: 0
    })
  })
})
```

**Toteuta reducer ja tee sille testit.**

Valmiina olevan ensimmäisen testin pitäisi mennä suoraan läpi ilman muutoksia. Redux olettaa, että reducer palauttaa järkevän alkutilan kun sitä kutsutaan siten että ensimmäinen parametri eli aiempaa tilaa edustava <i>state</i> on <i>undefined</i>.

Aloita laajentamalla reduceria siten, että molemmat testeistä menevät läpi. Lisää tämän jälkeen loput testit reducerin eri actioneille ja toteuta niitä vastaava toiminnallisuus reduceriin.

Varmista testeissä <i>deep-freeze</i>-kirjaston avulla, että kyseessä on <i>puhdas funktio</i>. Reducerin toteutuksessa kannattaa ottaa mallia yllä olevasta [Redux-muistiinpanot](/osa6/flux_arkkitehtuuri_ja_redux#puhtaat-funktiot-immutable)-esimerkistä.

#### 6.2: Unicafe revisited, step2

Toteuta sitten sovellukseen koko sen varsinainen toiminnallisuus. 

Sovelluksesi saa olla ulkoasultaan vaatimaton, muuta ei tarvita kuin napit ja tieto kunkin tyyppisen arvostelun lukumäärästä: 

![](../../images/6/50new.png)

</div>

<div class="content">

### Ei-kontrolloitu lomake

Lisätään sovellukseen mahdollisuus uusien muistiinpanojen tekemiseen sekä tärkeyden muuttamiseen:

```js
// ...

const generateId = () => Number((Math.random() * 1000000).toFixed(0)) // highlight-line

const App = () => {
  // highlight-start
  const addNote = event => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    store.dispatch({
      type: 'NEW_NOTE',
      payload: {
        content,
        important: false,
        id: generateId()
      }
    })
  }
    // highlight-end

  // highlight-start
  const toggleImportance = id => {
    store.dispatch({
      type: 'TOGGLE_IMPORTANCE',
      payload: { id }
    })
  }
    // highlight-end

  return (
    <div>
      // highlight-start
      <form onSubmit={addNote}>
        <input name="note" /> 
        <button type="submit">add</button>
      </form>
        // highlight-end
      <ul>
        {store.getState().map(note => (
          <li key={note.id} onClick={() => toggleImportance(note.id)}> // highlight-line
            {note.content} <strong>{note.important ? 'important' : ''}</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ...
```

Molemmat toiminnallisuudet on toteutettu suoraviivaisesti. Huomionarvoista uuden muistiinpanon lisäämisessä on nyt se, että toisin kuin aiemmat Reactilla toteutetut lomakkeet, <i>emme ole</i> nyt sitoneet lomakkeen kentän arvoa komponentin <i>App</i> tilaan. React kutsuu tällaisia lomakkeita [ei-kontrolloiduiksi](https://reactjs.org/docs/uncontrolled-components.html).

> Ei-kontrolloiduilla lomakkeilla on tiettyjä rajoitteita. Ne eivät mahdollista esim. lennossa annettavia validointiviestejä, lomakkeen lähetysnapin disabloimista sisällön perusteella yms. Meidän käyttötapaukseemme ne kuitenkin tällä kertaa sopivat.
Voit halutessasi lukea aiheesta enemmän [täältä](https://goshakkk.name/controlled-vs-uncontrolled-inputs-react/).

Muistiinpanon lisäämisen käsittelevä metodi on yksinkertainen. Se dispatchaa muistiinpanon lisäävän actionin:

```js
addNote = event => {
  event.preventDefault()
  const content = event.target.note.value
  event.target.note.value = ''
  // highlight-start
  store.dispatch({
    type: 'NEW_NOTE',
    payload: {
      content,
      important: false,
      id: generateId()
    }
  })
  // highlight-end
}
```

Uuden muistiinpanon sisältö saadaan suoraan lomakkeen syötekentästä, johon päästään käsiksi tapahtumaolion kautta:

```js
const content = event.target.note.value
```

Kannattaa huomata, että syötekentällä on oltava nimi, jotta sen arvoon on mahdollista päästä käsiksi:

```js
<form onSubmit={addNote}>
  <input name="note" /> // highlight-line
  <button type="submit">add</button>
</form>
```

Tärkeys muutetaan klikkaamalla muistiinpanon nimeä. Käsittelijä on erittäin yksinkertainen:

```js
toggleImportance = id => {
  store.dispatch({
    type: 'TOGGLE_IMPORTANCE',
    payload: { id }
  })
}
```

### Action creatorit

Alamme huomata, että jo näinkin yksinkertaisessa sovelluksessa Reduxin käyttö yksinkertaistaa sovelluksen ulkoasusta vastaavaa koodia. Pystymme kuitenkin vielä paljon parempaan. 

React-komponenttien on oikeastaan tarpeetonta tuntea Reduxin actionien tyyppejä ja esitysmuotoja. Eristetään actioneiden luominen omiin funktioihinsa:

```js
const createNote = content => {
  return {
    type: 'NEW_NOTE',
    payload: {
      content,
      important: false,
      id: generateId()
    }
  }
}

const toggleImportanceOf = id => {
  return {
    type: 'TOGGLE_IMPORTANCE',
    payload: { id }
  }
}
```

Actioneja luovia funktioita kutsutaan [action creatoreiksi](https://read.reduxbook.com/markdown/part1/04-action-creators.html).

Komponentin <i>App</i> ei tarvitse enää tietää mitään actionien sisäisestä esitystavasta, vaan se saa sopivan actionin kutsumalla creator-funktiota:

```js
const App = () => {
  const addNote = event => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    store.dispatch(createNote(content)) // highlight-line 
  }
  
  const toggleImportance = id => {
    store.dispatch(toggleImportanceOf(id))// highlight-line
  }

  // ...
}
```

### Redux-storen välittäminen eri komponenteille

Koko sovellus on toistaiseksi kirjoitettu reduceria lukuunottamatta yhteen tiedostoon, minkä ansiosta joka puolelta sovellusta on päästy käsiksi Redux-storeen. Entä jos haluamme jakaa sovelluksen useisiin, omiin tiedostoihinsa sijoitettuihin komponentteihin? 

Tapoja välittää Redux-store sovelluksen komponenteille on useita. Tutustutaan ensin ehkä uusimpaan ja helpoimpaan tapaan eli [React Redux](https://react-redux.js.org/)-kirjaston tarjoamaan [hooks](https://react-redux.js.org/api/hooks)-rajapintaan.

Asennetaan react-redux:

```bash
npm install react-redux
```

Jäsennellään samalla sovelluksen koodi järkevämmin useisiin eri tiedostoihin. Tiedosto _main.jsx_ näyttää muutosten jälkeen seuraavalta:

```js
import ReactDOM from 'react-dom/client'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import App from './App'
import noteReducer from './reducers/noteReducer'

const store = createStore(noteReducer)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
```

Uutta tässä on se, että sovellus on määritelty React Redux ‑kirjaston tarjoaman [Provider](https://react-redux.js.org/api/provider)-komponentin lapsena ja että sovelluksen käyttämä store on annettu Provider-komponentin attribuutiksi <i>store</i>:

```js
const store = createStore(noteReducer)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}> // highlight-line
    <App />
  </Provider> // highlight-line
)
```

Tämän ansiosta <i>store</i> on kaikkien ohjelman komponenttien saavutettavissa, kuten tulemme pian näkemään.

Action creator ‑funktioiden määrittely on siirretty reducerin kanssa samaan tiedostoon <i>src/reducers/noteReducer.js</i>, joka näyttää seuraavalta:

```js
const noteReducer = (state = [], action) => {
  switch (action.type) {
    case 'NEW_NOTE':
      return [...state, action.payload]
    case 'TOGGLE_IMPORTANCE': {
      const id = action.payload.id
      const noteToChange = state.find(n => n.id === id)
      const changedNote = {
        ...noteToChange,
        important: !noteToChange.important
      }
      return state.map(note => (note.id !== id ? note : changedNote))
    }
    default:
      return state
  }
}

const generateId = () =>
  Number((Math.random() * 1000000).toFixed(0))

export const createNote = (content) => {
  return {
    type: 'NEW_NOTE',
    payload: {
      content,
      important: false,
      id: generateId()
    }
  }
}

export const toggleImportanceOf = (id) => {
  return {
    type: 'TOGGLE_IMPORTANCE',
    payload: { id }
  }
}

export default noteReducer
```

Moduulissa on nyt useita [export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export)-komentoja. Reducer-funktio palautetaan edelleen komennolla <i>export default</i>. Tämän ansiosta reducer importataan tuttuun tapaan:

```js
import noteReducer from './reducers/noteReducer'
```

Moduulilla voi olla vain <i>yksi default export</i>, mutta useita "normaaleja" exporteja:

```js
export const createNote = (content) => {
  // ...
}

export const toggleImportanceOf = (id) => { 
  // ...
}
```

Normaalisti (eli ei defaultina) exportattujen funktioiden käyttöönotto tapahtuu aaltosulkusyntaksilla:

```js
import { createNote } from './../reducers/noteReducer'
```

Eriytetään seuraavaksi komponentti _App_ tiedostoon _src/App.jsx_. Tiedoston sisältö on seuraava:

```js
import { createNote, toggleImportanceOf } from './reducers/noteReducer'
import { useSelector, useDispatch } from 'react-redux' 


const App = () => {
  const dispatch = useDispatch()
  const notes = useSelector(state => state)

  const addNote = (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    dispatch(createNote(content))
  }

  const toggleImportance = (id) => {
    dispatch(toggleImportanceOf(id))
  }

  return (
    <div>
      <form onSubmit={addNote}>
        <input name="note" /> 
        <button type="submit">add</button>
      </form>
      <ul>
        {notes.map(note => 
          <li
            key={note.id} 
            onClick={() => toggleImportance(note.id)}
          >
            {note.content} <strong>{note.important ? 'important' : ''}</strong>
          </li>
        )}
      </ul>
    </div>
  )
}

export default App
```

Komponentin koodissa on muutama mielenkiintoinen seikka. Aiemmin koodi hoiti actionien dispatchaamisen kutsumalla Redux-storen metodia dispatch:

```js
store.dispatch({
  type: 'TOGGLE_IMPORTANCE',
  payload: { id }
})
```

Nyt sama tapahtuu [useDispatch](https://react-redux.js.org/api/hooks#usedispatch)-hookin avulla saatavan <i>dispatch</i>-funktion avulla:

```js
import { useSelector, useDispatch } from 'react-redux'  // highlight-line

const App = () => {
  const dispatch = useDispatch()  // highlight-line
  // ...

  const toggleImportance = (id) => {
    dispatch(toggleImportanceOf(id)) // highlight-line
  }

  // ...
}
```

React Redux ‑kirjaston tarjoama <i>useDispatch</i>-hook siis tarjoaa mille tahansa React-komponentille pääsyn tiedostossa <i>main.jsx</i> määritellyn Redux-storen dispatch-funktioon, jonka avulla komponentti pääsee tekemään muutoksia Redux-storen tilaan.

Storeen talletettuihin muistiinpanoihin komponentti pääsee käsiksi React Redux ‑kirjaston [useSelector](https://react-redux.js.org/api/hooks#useselector)-hookin kautta:


```js
import { useSelector, useDispatch } from 'react-redux'  // highlight-line

const App = () => {
  // ...
  const notes = useSelector(state => state)  // highlight-line
  // ...
}
```

<i>useSelector</i> saa parametrikseen funktion, joka hakee tai valitsee (engl. select) tarvittavan datan Redux-storesta. Tarvitsemme nyt kaikki muistiinpanot, eli selektorifunktiomme palauttaa koko staten, eli on muotoa:


```js
state => state
```

joka siis tarkoittaa samaa kuin

```js
(state) => {
  return state
}
```

Yleensä selektorifunktiot ovat mielenkiintoisempia ja valitsevat vain osan Redux-storen sisällöstä. Voisimme esimerkiksi hakea storesta ainoastaan tärkeät muistiinpanot seuraavasti:

```js
const importantNotes = useSelector(state => state.filter(note => note.important))  
```

Redux-sovelluksen tämänhetkinen koodi on kokonaisuudessaan [GitHubissa](https://github.com/fullstack-hy2020/redux-notes/tree/part6-0), branchissa <i>part6-0</i>.

### Lisää komponentteja

Eriytetään uuden muistiinpanon luomisesta vastaava lomake omaksi komponentikseen tiedostoon <i>src/components/NoteForm.jsx</i>: 

```js
import { useDispatch } from 'react-redux'
import { createNote } from '../reducers/noteReducer'

const NoteForm = () => {
  const dispatch = useDispatch()

  const addNote = (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    dispatch(createNote(content))
  }

  return (
    <form onSubmit={addNote}>
      <input name="note" />
      <button type="submit">add</button>
    </form>
  )
}

export default NoteForm
```

Toisin kuin aiemmin ilman Reduxia tekemässämme React-koodissa, sovelluksen tilaa (joka on nyt siis Reduxissa) muuttava tapahtumankäsittelijä on siirretty pois <i>App</i>-komponentista, alikomponentin vastuulle. Itse tilaa muuttava logiikka on kuitenkin siististi Reduxissa eristettynä koko sovelluksen React-osuudesta.

Eriytetään vielä muistiinpanojen lista ja yksittäisen muistiinpanon esittäminen omiksi komponenteikseen. Sijoitetaan molemmat tiedostoon <i>src/components/Notes.jsx</i>:

```js
import { useDispatch, useSelector } from 'react-redux'
import { toggleImportanceOf } from '../reducers/noteReducer'

const Note = ({ note, handleClick }) => {
  return (
    <li onClick={handleClick}>
      {note.content}
      <strong> {note.important ? 'important' : ''}</strong>
    </li>
  )
}

const Notes = () => {
  const dispatch = useDispatch()
  const notes = useSelector(state => state)

  return (
    <ul>
      {notes.map(note => (
        <Note
          key={note.id}
          note={note}
          handleClick={() => dispatch(toggleImportanceOf(note.id))}
        />
      ))}
    </ul>
  )
}

export default Notes
```

Muistiinpanon tärkeyttä muuttava logiikka on nyt muistiinpanojen listaa hallinnoivalla komponentilla.

Tiedostoon <i>App.jsx</i> jää vain vähän koodia:

```js
import NoteForm from './components/NoteForm'
import Notes from './components/Notes'

const App = () => {
  return (
    <div>
      <NoteForm />
      <Notes />
    </div>
  )
}

export default App
```

Yksittäisen muistiinpanon renderöinnistä huolehtiva <i>Note</i> on erittäin yksinkertainen, eikä ole tietoinen siitä, että sen propsina saama tapahtumankäsittelijä dispatchaa actionin. Tällaisia komponentteja kutsutaan Reactin terminologiassa [presentational](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)-komponenteiksi.

<i>Notes</i> taas on sellainen komponentti, jota kutsutaan [container](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)-komponentiksi. Se sisältää sovelluslogiikkaa eli määrittelee mitä <i>Note</i>-komponenttien tapahtumankäsittelijät tekevät ja koordinoi <i>presentational</i>-komponenttien eli <i>Notejen</i> konfigurointia.

Palaamme presentational/container-jakoon tarkemmin myöhemmin tässä osassa.

Redux-sovelluksen tämänhetkinen koodi on kokonaisuudessaan [GitHubissa](https://github.com/fullstack-hy2020/redux-notes/tree/part6-1), branchissa <i>part6-1</i>.

</div>

<div class="tasks">

### Tehtävät 6.3.-6.8.

Toteutetaan nyt uusi versio ensimmäisen osan anekdoottien äänestyssovelluksesta. Ota ratkaisusi pohjaksi repositoriossa https://github.com/fullstack-hy2020/redux-anecdotes oleva projekti.

Jos kloonaat projektin olemassaolevan Git-repositorion sisälle, <i>poista kloonatun sovelluksen Git-konfiguraatio:</i>

```bash
cd redux-anecdotes  // mene kloonatun repositorion hakemistoon
rm -rf .git
```

Sovellus käynnistyy normaaliin tapaan, mutta joudut ensin asentamaan sen riippuvuudet:

```bash
npm install
npm run dev
```

Kun teet seuraavat tehtävät, tulisi sovelluksen näyttää seuraavalta:

![Sovellus renderöi anekdootit. Jokaisen anekdootin yhteydessä myös tieto sen saamien äänien määrästä sekä nappi "vote" anekdootin äänestämiselle](../../images/6/3.png)

#### 6.3: anekdootit, step1

Toteuta mahdollisuus anekdoottien äänestämiseen. Äänien määrä tulee tallettaa Redux-storeen.

#### 6.4: anekdootit, step2

Tee sovellukseen mahdollisuus uusien anekdoottien lisäämiselle.

Voit pitää lisäyslomakkeen aiemman esimerkin tapaan [ei-kontrolloituna](/osa6/flux_arkkitehtuuri_ja_redux#ei-kontrolloitu-lomake).

#### 6.5: anekdootit, step3

Huolehdi siitä, että anekdootit pysyvät äänten mukaisessa suuruusjärjestyksessä.

#### 6.6: anekdootit, step4

Jos et jo sitä tehnyt, eriytä action-olioiden luominen [action creator](https://redux.js.org/basics/actions#action-creators) ‑funktioihin ja sijoita ne tiedostoon <i>src/reducers/anecdoteReducer.js</i>. Toimi siis kuten materiaalin esimerkissä on toimittu kohdasta [action creator](/osa6/flux_arkkitehtuuri_ja_redux#action-creatorit) alkaen.

#### 6.7: anekdootit, step5

Eriytä uuden anekdootin luominen omaksi komponentikseen nimeltään <i>AnecdoteForm</i>. Siirrä kaikki anekdootin luomiseen liittyvä logiikka uuteen komponenttiin.

#### 6.8: anekdootit, step6

Eriytä anekdoottilistan näyttäminen omaksi komponentikseen nimeltään <i>AnecdoteList</i>. Siirrä kaikki anekdoottien äänestämiseen liittyvä logiikka uuteen komponenttiin.

Tämän tehtävän jälkeen komponentin <i>App</i> pitäisi näyttää seuraavalta:

```js
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'

const App = () => {
  return (
    <div>
      <h2>Anecdotes</h2>
      <AnecdoteForm />
      <AnecdoteList />
    </div>
  )
}

export default App
```
</div>

<div class="content">

Jatketaan muistiinpanosovelluksen yksinkertaistetun [Redux-version](/osa6/flux_arkkitehtuuri_ja_redux#redux-muistiinpanot) laajentamista.

Sovelluskehitystä helpottaaksemme laajennetaan reduceria siten, että storelle määritellään alkutila, jossa on pari muistiinpanoa:

```js
// highlight-start
const initialState = [
  {
    content: 'reducer defines how redux store works',
    important: true,
    id: 1,
  },
  {
    content: 'state of store can contain any data',
    important: false,
    id: 2,
  },
]
//highlight-end

const noteReducer = (state = initialState, action) => { // highlight-line
  // ...
}

// ...

export default noteReducer
```

### Monimutkaisempi tila storessa

Toteutetaan sovellukseen näytettävien muistiinpanojen filtteröinti, jonka avulla näytettäviä muistiinpanoja voidaan rajata. Filtterin toteutus tapahtuu [radiopainikkeiden](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio) avulla:

![Sivun alussa lomake muistiinpanon lisäämiseen (syötekenttä ja nappi add). Tämän jälkeen radiopainikevalinta mitkä muistiinpanot näytetään, vaihtoehdot all, important ja noimportant. Näiden alle renderöidän kaikki muistiinpanot ja niiden yhteyteen teksti important jos muistiinpano merkattu tärkeäksi. ](../../images/6/01f.png)

Aloitetaan todella suoraviivaisella toteutuksella:

```js
import NoteForm from './components/NoteForm'
import Notes from './components/Notes'

const App = () => {
//highlight-start
  const filterSelected = (value) => {
    console.log(value)
  }
//highlight-end

  return (
    <div>
      <NoteForm />
      //highlight-start
      <div>
        <input
          type="radio"
          name="filter"
          onChange={() => filterSelected('ALL')}
        />
        all
        <input
          type="radio"
          name="filter"
          onChange={() => filterSelected('IMPORTANT')}
        />
        important
        <input
          type="radio"
          name="filter"
          onChange={() => filterSelected('NONIMPORTANT')}
        />
        nonimportant
      </div>
      //highlight-end
      <Notes />
    </div>
  )
}
```

Koska painikkeiden attribuutin <i>name</i> arvo on kaikilla sama, muodostavat ne <i>nappiryhmän</i>, joista ainoastaan yksi voi olla kerrallaan valittuna.

Napeille on määritelty muutoksenkäsittelijä, joka tällä hetkellä ainoastaan tulostaa painettua nappia vastaavan merkkijonon konsoliin.

Päätämme toteuttaa filtteröinnin siten, että talletamme muistiinpanojen lisäksi sovelluksen storeen myös <i>filtterin arvon</i>. Eli muutoksen jälkeen storessa olevan tilan tulisi näyttää seuraavalta:

```js
{
  notes: [
    { content: 'reducer defines how redux store works', important: true, id: 1},
    { content: 'state of store can contain any data', important: false, id: 2}
  ],
  filter: 'IMPORTANT'
}
```

Tällä hetkellähän tilassa on ainoastaan muistiinpanot sisältävä taulukko. Uudessa ratkaisussa tilalla on siis kaksi avainta eli <i>notes</i>, jonka arvona muistiinpanot ovat sekä <i>filter</i>, jonka arvona on merkkijono joka kertoo, mitkä muistiinpanoista tulisi näyttää ruudulla.

### Yhdistetyt reducerit

Voisimme periaatteessa muokata jo olemassaolevaa reduceria ottamaan huomioon muuttuneen tilanteen. Parempi ratkaisu on kuitenkin määritellä tässä tilanteessa uusi, filtterin arvosta huolehtiva reduceri. Määritellään samalla myös sopiva _action creator_ ‑funktio. Sijoitetaan koodi moduuliin <i>src/reducers/filterReducer.js</i>:

```js
const filterReducer = (state = 'ALL', action) => {
  switch (action.type) {
    case 'SET_FILTER':
      return action.payload
    default:
      return state
  }
}

export const filterChange = filter => {
  return {
    type: 'SET_FILTER',
    payload: filter
  }
}

export default filterReducer
```

Filtterin arvon asettavat actionit ovat siis muotoa:

```js
{
  type: 'SET_FILTER',
  payload: 'IMPORTANT'
}
```

Saamme nyt muodostettua varsinaisen reducerin yhdistämällä kaksi olemassaolevaa reduceria funktion [combineReducers](https://redux.js.org/api/combinereducers) avulla.

Määritellään yhdistetty reducer tiedostossa <i>main.jsx</i>. Tiedoston päivitetty sisältö on seuraavanlainen:

```js
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'

import App from './App'
import filterReducer from './reducers/filterReducer'
import noteReducer from './reducers/noteReducer'

const reducer = combineReducers({
  notes: noteReducer,
  filter: filterReducer
})

const store = createStore(reducer)

console.log(store.getState())

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <div />
  </Provider>
)
```

Koska sovelluksemme hajoaa tässä vaiheessa täysin, komponentin <i>App</i> sijasta renderöidään tyhjä <i>div</i>-elementti.

_console.log_-komennon ansiosta konsoliin tulostuu storen tila:

![Konsolista selviää että store on olio jolla kentät filter (teksti, arvona "ALL") ja notes (taulukollinen muistiinpanoja).](../../images/6/4e.png)

Store on siis juuri siinä muodossa jossa haluammekin sen olevan!

Tarkastellaan vielä yhdistetyn reducerin luomista:

```js
const reducer = combineReducers({
  notes: noteReducer,
  filter: filterReducer,
})
```

Näin tehdyn reducerin määrittelemän storen tila on olio, jossa on kaksi kenttää: <i>notes</i> ja <i>filter</i>. Tilan kentän <i>notes</i> arvon määrittelee <i>noteReducer</i>, jonka ei tarvitse välittää mitään tilan muista kentistä. Vastaavasti <i>filter</i> kentän käsittely tapahtuu <i>filterReducer</i>:in avulla.

Ennen muun koodin muutoksia kokeillaan vielä konsolista, miten actionit muuttavat yhdistetyn reducerin muodostamaa staten tilaa. Lisätään seuraavat rivit väliaikaisesti tiedostoon <i>main.jsx</i>:

```js
// ...

const store = createStore(reducer)

console.log(store.getState())

// highlight-start
import { createNote } from './reducers/noteReducer'
import { filterChange } from './reducers/filterReducer'
// highlight-end

// highlight-start
store.subscribe(() => console.log(store.getState()))
store.dispatch(filterChange('IMPORTANT'))
store.dispatch(createNote('combineReducers forms one reducer from many simple reducers'))
// highlight-end

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <div />
  </Provider>
)
```

Kun simuloimme näin filtterin tilan muutosta ja muistiinpanon luomista, konsoliin tulostuu storen tila jokaisen muutoksen jälkeen:

![Storen filter-arvoksi muuttuu ensin IMPORTANT, tämän jäleen storen notesiin tulee uusi muistiinpano](../../images/6/5e.png)

Jo tässä vaiheessa kannattaa laittaa mieleen eräs tärkeä detalji. Jos <i>molempien reducerien alkuun</i> lisätään konsoliin tulostus

```js
const filterReducer = (state = 'ALL', action) => {
  console.log('ACTION: ', action) // highlight-line
  // ...
}
```

niin nyt konsolin perusteella näyttää siltä, että jokainen action kahdentuu:

![Konsolin tulostus paljastaa että sekä noteReducer että filterReducer käsittelevät jokaisen actionin](../../images/6/6.png)

Onko koodissa bugi? Ei. Yhdistetty reducer toimii siten, että jokainen <i>action</i> käsitellään <i>kaikissa</i> yhdistetyn reducerin osissa. Usein tietystä actionista on kiinnostunut vain yksi reducer, mutta on kuitenkin tilanteita, joissa useampi reducer muuttaa hallitsemaansa staten tilaa jonkin actionin seurauksena.

### Filtteröinnin viimeistely

Viimeistellään nyt sovellus käyttämään yhdistettyä reduceria. Poistetaan tiedostosta <i>main.jsx</i> ylimääräiset kokeilut ja palautetaan _App_ renderöitäväksi komponentiksi. Tiedoston päivitetty sisältö on seuraava:

```js
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'

import App from './App'
import filterReducer from './reducers/filterReducer'
import noteReducer from './reducers/noteReducer'

const reducer = combineReducers({
  notes: noteReducer,
  filter: filterReducer
})

const store = createStore(reducer)

console.log(store.getState())

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
```

Korjataan sitten bugi, joka johtuu siitä, että koodi olettaa storen tilan olevan mustiinpanot tallettava taulukko:

![komennon notes.map(note => ...) suoritus aiheuttaa virheen TypeError notes.map is not a function)](../../images/6/7v.png)

Korjaus on helppo. Koska muistiinpanot ovat nyt storen kentässä <i>notes</i>, riittää pieni muutos selektorifunktioon:

```js
const Notes = () => {
  const dispatch = useDispatch()
  const notes = useSelector(state => state.notes) // highlight-line

  return (
    <ul>
      {notes.map(note =>
        <Note
          key={note.id}
          note={note}
          handleClick={() => 
            dispatch(toggleImportanceOf(note.id))
          }
        />
      )}
    </ul>
  )
}
```

Aiemminhan selektorifunktio palautti koko storen tilan:

```js
const notes = useSelector(state => state)
```

Nyt siis palautetaan tilasta ainoastaan sen kenttä <i>notes</i>:

```js
const notes = useSelector(state => state.notes)
```

Eriytetään näkyvyyden säätelyfiltteri omaksi, tiedostoon <i>src/components/VisibilityFilter.jsx</i> sijoitettavaksi komponentiksi:

```js
import { useDispatch } from 'react-redux'
import { filterChange } from '../reducers/filterReducer'

const VisibilityFilter = () => {
  const dispatch = useDispatch()

  return (
    <div>
      <input
        type="radio"
        name="filter"
        onChange={() => dispatch(filterChange('ALL'))}
      />
      all
      <input
        type="radio"
        name="filter"
        onChange={() => dispatch(filterChange('IMPORTANT'))}
      />
      important
      <input
        type="radio"
        name="filter"
        onChange={() => dispatch(filterChange('NONIMPORTANT'))}
      />
      nonimportant
    </div>
  )
}

export default VisibilityFilter
```

Toteutus on suoraviivainen - radiopainikkeen klikkaaminen muuttaa storen kentän <i>filter</i> tilaa.

Komponentti <i>App</i> yksinkertaisuu nyt seuraavasti:

```js
import NoteForm from './components/NoteForm'
import Notes from './components/Notes'
import VisibilityFilter from './components/VisibilityFilter'

const App = () => {
  return (
    <div>
      <NoteForm />
      <VisibilityFilter />
      <Notes />
    </div>
  )
}

export default App
```

Muutetaan vielä komponenttia <i>Notes</i> ottamaan huomioon filtteri:

```js
const Notes = () => {
  const dispatch = useDispatch()
  // highlight-start
  const notes = useSelector(state => {
    if (state.filter === 'ALL') {
      return state.notes
    }
    return state.filter === 'IMPORTANT'
      ? state.notes.filter(note => note.important)
      : state.notes.filter(note => !note.important)
  })
  // highlight-end

  return (
    <ul>
      {notes.map(note => (
        <Note
          key={note.id}
          note={note}
          handleClick={() => dispatch(toggleImportanceOf(note.id))}
        />
      ))}
    </ul>
  )
}
```

Muutos kohdistuu siis ainoastaan selektorifunktioon, joka oli aiemmin muotoa

```js
useSelector(state => state.notes)
```

Yksinkertaistetaan vielä selektoria destrukturoimalla parametrina olevasta tilasta sen kentät erilleen:

```js
const notes = useSelector(({ filter, notes }) => {
  if ( filter === 'ALL' ) {
    return notes
  }
  return filter  === 'IMPORTANT' 
    ? notes.filter(note => note.important)
    : notes.filter(note => !note.important)
})
```

Sovelluksessa on vielä pieni kauneusvirhe, sillä vaikka oletusarvosesti filtterin arvo on <i>ALL</i> eli näytetään kaikki muistiinpanot, ei vastaava radiopainike ole valittuna. Ongelma on luonnollisestikin mahdollista korjata, mutta koska kyseessä on ikävä, mutta harmiton feature, jätämme korjauksen myöhemmäksi.

Redux-sovelluksen tämänhetkinen koodi on kokonaisuudessaan [GitHubissa](https://github.com/fullstack-hy2020/redux-notes/tree/part6-2), branchissa <i>part6-2</i>.

</div>

<div class="tasks">

### Tehtävä 6.9

Jatketaan tehtävässä 6.3 aloitetun Reduxia käyttävän anekdoottisovelluksen parissa.

#### 6.9 anekdootit, step7

Toteuta sovellukseen näytettävien anekdoottien filtteröiminen:

![Yläosaan lisätään tekstikenttä, johon kirjoittamalla voidaan rajoittaa näytettävät anekdootit niihin joihin sisältyy "filtterikenttään" kirjoitettu merkkijono](../../images/6/9ea.png)

Säilytä filtterin tila Redux-storessa. Käytännössä kannattaa tehdä uusi reducer ja action creatorit, ja luoda storea varten yhdistetty reduceri funktion <i>combineReducers</i> avulla.

Tee filtterin ruudulla näyttämistä varten komponentti <i>Filter</i>. Voit ottaa sen pohjaksi seuraavan koodin:

```js
const Filter = () => {
  const handleChange = (event) => {
    // input-kentän arvo muuttujassa event.target.value
  }
  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  )
}

export default Filter
```

</div>

<div class="content">

### Redux Toolkit ja storen konfiguraation refaktorointi

Kuten olemme jo tähän asti huomanneet, Reduxin konfigurointi ja tilanhallinnan toteutus vaativat melko paljon vaivannäköä. Tämä ilmenee esimerkiksi reducereiden ja action creatorien koodista, jossa on jonkin verran toisteisuutta. [Redux Toolkit](https://redux-toolkit.js.org/) on kirjasto, joka soveltuu näiden yleisten Reduxin käyttöön liittyvien ongelmien ratkaisemiseen. Kirjaston käyttö mm. yksinkertaistaa huomattavasti Redux-storen luontia ja tarjoaa suuren määrän tilanhallintaa helpottavia työkaluja.

Otetaan Redux Toolkit käyttöön sovelluksessamme refaktoroimalla nykyistä koodia. Aloitetaan kirjaston asennuksella:

```
npm install @reduxjs/toolkit
```

Avataan sen jälkeen <i>main.jsx</i>-tiedosto, jossa nykyinen Redux-store luodaan. Käytetään storen luonnissa Reduxin <em>createStore</em>-funktion sijaan Redux Toolkitin [configureStore](https://redux-toolkit.js.org/api/configureStore)-funktiota:

```js
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit' // highlight-line

import App from './App'
import filterReducer from './reducers/filterReducer'
import noteReducer from './reducers/noteReducer'

 // highlight-start
const store = configureStore({
  reducer: {
    notes: noteReducer,
    filter: filterReducer
  }
})
// highlight-end

console.log(store.getState())

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
```

Pääsimme eroon jo muutamasta koodirivistä, kun reducerin muodostamiseen ei enää tarvita <em>combineReducers</em>-funktiota. Tulemme pian näkemään, että <em>configureStore</em>-funktion käytöstä on myös monia muita hyötyjä, kuten kehitystyökalujen ja usein käytettyjen kirjastojen vaivaton käyttöönotto ilman erillistä konfiguraatiota.

Siistitään vielä <i>main.jsx</i>-tiedostoa siirtämällä Redux-storen luontiin liittyvä koodi erilliseen tiedostoon. Luodaan uusi tiedosto <i>src/store.js</i>:

```js
import { configureStore } from '@reduxjs/toolkit'

import noteReducer from './reducers/noteReducer'
import filterReducer from './reducers/filterReducer'

const store = configureStore({
  reducer: {
    notes: noteReducer,
    filter: filterReducer
  }
})

export default store
```

Muutosten jälkeen <i>main.jsx</i>-tiedosto näyttää seuraavalta:

```js
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'

import App from './App'
import store from './store'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
```

### Redux Toolkit ja reducereiden refaktorointi

Siirrytään seuraavaksi reducereiden refaktorointiin, jossa Redux Toolkitin edut tulevat parhaiten esiin. Redux Toolkitin avulla reducerin ja siihen liittyvät action creatorit voi luoda kätevästi [createSlice](https://redux-toolkit.js.org/api/createSlice)-funktion avulla. Voimme refaktoroida <i>reducers/noteReducer.js</i>-tiedostossa olevan reducerin ja action creatorit <em>createSlice</em>-funktion avulla seuraavasti:

```js
import { createSlice } from '@reduxjs/toolkit' // highlight-line

const initialState = [
  {
    content: 'reducer defines how redux store works',
    important: true,
    id: 1,
  },
  {
    content: 'state of store can contain any data',
    important: false,
    id: 2,
  },
]

const generateId = () =>
  Number((Math.random() * 1000000).toFixed(0))

// highlight-start
const noteSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    createNote(state, action) {
      const content = action.payload

      state.push({
        content,
        important: false,
        id: generateId(),
      })
    },
    toggleImportanceOf(state, action) {
      const id = action.payload

      const noteToChange = state.find(n => n.id === id)

      const changedNote = { 
        ...noteToChange, 
        important: !noteToChange.important 
      }

      return state.map(note =>
        note.id !== id ? note : changedNote 
      )     
    }
  },
})
// highlight-end

// highlight-start
export const { createNote, toggleImportanceOf } = noteSlice.actions
export default noteSlice.reducer
// highlight-end
```

<em>createSlice</em>-funktion <em>name</em>-parametri määrittelee etuliitteen, jota käytetään actioneiden type-arvoissa. Esimerkiksi myöhemmin määritelty <em>createNote</em>-action saa type-arvon <em>notes/createNote</em>. Parametrin arvona on hyvä käyttää muiden reducereiden kesken uniikkia nimeä, jotta sovelluksen actioneiden type-arvoissa ei tapahtuisi odottamattomia yhteentörmäyksiä. Parametri <em>initialState</em> määrittelee reducerin alustavan tilan. Parametri <em>reducers</em> määrittelee itse reducerin objektina, jonka funktiot käsittelevät tietyn actionin aiheuttamat tilamuutokset. Huomaa, että funktioissa <em>action.payload</em> sisältää action creatorin kutsussa annetun parametrin:

```js
dispatch(createNote('Redux Toolkit is awesome!'))
```

Tämä dispatch-kutsu vastaa seuraavan objektin dispatchaamista:

```js
dispatch({ type: 'notes/createNote', payload: 'Redux Toolkit is awesome!' })
```

Jos olit tarkkana, saatoit huomata, että actionin <em>createNote</em> kohdalla tapahtuu jotain, mikä vaikuttaa rikkovan aiemmin mainittua reducereiden immutabiliteetin periaatetta:

```js
createNote(state, action) {
  const content = action.payload

  state.push({
    content,
    important: false,
    id: generateId(),
  })
}
```

Mutatoimme <em>state</em>-argumentin taulukkoa kutsumalla <em>push</em>-metodia sen sijaan, että palauttaisimme uuden instanssin taulukosta. Mistä on kyse?

Redux Toolkit hyödyntää <em>createSlice</em>-funktion avulla määritellyissä reducereissa [Immer](https://immerjs.github.io/immer/)-kirjastoa, joka mahdollistaa <em>state</em>-argumentin mutatoinnin reducerin sisällä. Immer muodostaa mutatoidun tilan perusteella uuden, immutablen tilan ja näin tilamuutosten immutabiliteetti säilyy.

Huomaa, että tilaa voi muuttaa myös "mutatoimatta" kuten esimerkiksi <em>toggleImportanceOf</em> ‑actionin kohdalla on tehty. Tällöin funktio palauttaa uuden tilan. Mutatointi osoittautuu kuitenkin usein hyödylliseksi etenkin rakenteeltaan monimutkaisen tilan päivittämisessä.

Funktio <em>createSlice</em> palauttaa objektin, joka sisältää sekä reducerin että <em>reducers</em>-parametrin actioneiden mukaiset action creatorit. Reducer on palautetussa objektissa <em>noteSlice.reducer</em>-kentässä kun taas action creatorit ovat <em>noteSlice.actions</em>-kentässä. Voimme muodostaa tiedoston exportit kätevästi:

```js
const noteSlice = createSlice({
  // ...
})

// highlight-start
export const { createNote, toggleImportanceOf } = noteSlice.actions
export default noteSlice.reducer
// highlight-end
```

Importit toimivat muissa tiedostoissa tavalliseen tapaan:

```js
import noteReducer, { createNote, toggleImportanceOf } from './reducers/noteReducer'
```

Joudumme hieman muuttamaan testejämme Redux Toolkitin nimeämiskäytäntöjen takia:

```js 
import deepFreeze from 'deep-freeze'
import { describe, expect, test } from 'vitest'
import noteReducer from './noteReducer'

describe('noteReducer', () => {
  test('returns new state with action notes/createNote', () => { // highlight-line
    const state = []
    const action = {
      type: 'notes/createNote', // highlight-line
      payload: 'the app state is in redux store' // highlight-line
    }

    deepFreeze(state)
    const newState = noteReducer(state, action)

    expect(newState).toHaveLength(1)
    expect(newState.map(note => note.content)).toContainEqual(action.payload) // highlight-line
  })
})

test('returns new state with action notes/toggleImportanceOf', () => { // highlight-line
  const state = [
    {
      content: 'the app state is in redux store',
      important: true,
      id: 1
    },
    {
      content: 'state changes are made with actions',
      important: false,
      id: 2
    }
  ]

  const action = {
    type: 'notes/toggleImportanceOf', // highlight-line
    payload: 2 // highlight-line
  }

  deepFreeze(state)
  const newState = noteReducer(state, action)

  expect(newState).toHaveLength(2)

  expect(newState).toContainEqual(state[0])

  expect(newState).toContainEqual({
    content: 'state changes are made with actions',
    important: true,
    id: 2
  })
})
```

Sovelluksen tämänhetkinen koodi on [GitHubissa](https://github.com/fullstack-hy2020/redux-notes/tree/part6-3) branchissa </i>part6-3</i>.

### Redux Toolkit ja console.log

Kuten olemme oppineet, on _console.log_ äärimmäisen voimakas työkalu, se pelastaa meidät yleensä aina pulasta.

Yritetään kokeeksi tulostaa <i>Redux</i>-storen tila konsoliin kesken funktiolla _createSlice_ luodun reducerin: 

```js
const noteSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    // ...
    toggleImportanceOf(state, action) {
      const id = action.payload

      const noteToChange = state.find(n => n.id === id)

      const changedNote = { 
        ...noteToChange, 
        important: !noteToChange.important 
      }

      console.log(state) // highlight-line

      return state.map(note =>
        note.id !== id ? note : changedNote 
      )     
    }
  },
})
```

Kun nyt muistiinpanon tärkeyttä muuttaa klikkaamalla sen nimeä, konsoliin tulostuu seuraava

![](../../images/6/40new.png)

Tulostus on mielenkiintoinen mutta ei kovin hyödyllinen. Kyse tässä jo edellä mainitusta Redux toolkitin käyttämästä Immer-kirjastosta, mitä käytetään nyt sisäisesti storen tilan tallentamiseen. 

Tilan voi muuntaa ihmisluettavaan muotoon käyttämällä immer-kirjaston [current](https://redux-toolkit.js.org/api/other-exports#current)-funktiota. Funktion voi importata käyttöön komennolla:

```js
import { current } from '@reduxjs/toolkit'
```

ja tämän jälkeen tilan voi tulostaa konsoliin komennolla:

```js
console.log(current(state))
```

Konsolitulostus on nyt ihmisluettava:

![](../../images/6/41new.png)

### Redux DevTools

Chromeen on asennettavissa [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=fi) ‑lisäosa, jonka avulla Redux-storen tilaa ja sitä muuttavia actioneja on mahdollisuus seurata selaimen konsolista. Redux Toolkitin <em>configureStore</em>-funktion avulla luodussa storessa Redux DevTools on käytössä automaattisesti ilman ylimääräistä konfigurointia.

Kun lisäosa on asennettu Chromeen, konsolin <i>Redux</i>-välilehti pitäisi näyttää seuraavalta:

![Redux DevToolsin oikea puoli "State" näyttää storen alkutilan](../../images/6/42new.png)

Kunkin actionin storen tilaan aiheuttamaa muutosta on helppo tarkastella:

![edux DevToolsin vasen puoli näyttää suoritetut actionit, muuttunut tila heijastuu oikealle puolelle](../../images/6/43new.png)

Konsolin avulla on myös mahdollista dispatchata actioneja storeen:

![Mahdollisuus actionien dispatchaamiseen avautuu alalaidan valinnoista](../../images/6/44new.png)

</div>

<div class="tasks">

### Tehtävät 6.10-6.13

#### 6.10 anekdootit, step8

Asenna projektiin Redux Toolkit. Siirrä tämän jälkeen Redux-storen määrittely omaan tiedostoon <i>store.js</i> ja hyödynnä sen luonnissa Redux Toolkitin <em>configureStore</em>-funktiota. 

Muuta <i>filter reduserin ja action creatorien</i> määrittely tapahtumaan Redux Toolkitin <em>createSlice</em>-funktion avulla.

Ota myös käyttöön Redux DevTools sovelluksen tilan debuggaamisen helpottamiseksi.

#### 6.11 anekdootit, step9

Muuta myös <i>anekdoottireduserin ja action creatorien</i> määrittely tapahtumaan Redux Toolkitin <em>createSlice</em>-funktion avulla.

#### 6.12 anekdootit, step10

Sovelluksessa on valmiina komponentin <i>Notification</i> runko:

```js
const Notification = () => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10
  }

  return (
    <div style={style}>
      render here notification...
    </div>
  )
}

export default Notification
```

Laajenna komponenttia siten, että se renderöi Redux-storeen talletetun viestin. Tee toiminnallisuutta varten oma reduceri ja hyödynnä jälleen Redux Toolkitin <em>createSlice</em>-funktiota.

Tässä vaiheessa sovelluksen ei vielä tarvitse osata käyttää <i>Notification</i>-komponenttia järkevällä tavalla, vaan riittää että sovellus toimii ja näyttää <i>notificationReducerin</i> alkuarvoksi asettaman viestin.

#### 6.13 anekdootit, step11

Laajenna sovellusta siten, että se näyttää <i>Notification</i>-komponentin avulla viiden sekunnin ajan, kun sovelluksessa äänestetään tai luodaan uusia anekdootteja:

![Äänestyksen yhteydessä näytetään notifikaatio: you voted 'if it hurts, do it more often'](../../images/6/8eb.png)

Notifikaation asettamista ja poistamista varten kannattaa toteuttaa [action creatorit](https://redux-toolkit.js.org/api/createSlice#reducers).


</div>


<div class="content">

### JSON Serverin käyttöönotto

Laajennetaan sovellusta siten, että muistiinpanot talletetaan backendiin. Käytetään osasta 2 tuttua [JSON Serveriä](/osa2/palvelimella_olevan_datan_hakeminen).

Tallennetaan projektin juureen tiedostoon <i>db.json</i> tietokannan alkutila:

```json
{
  "notes": [
    {
      "content": "the app state is in redux store",
      "important": true,
      "id": 1
    },
    {
      "content": "state changes are made with actions",
      "important": false,
      "id": 2
    }
  ]
}
```

Asennetaan projektiin JSON Server

```bash
npm install json-server --save-dev
```

ja lisätään tiedoston <i>package.json</i> osaan <i>scripts</i> rivi

```js
"scripts": {
  "server": "json-server -p 3001 db.json",
  // ...
}
```

Käynnistetään JSON Server komennolla _npm run server_.

### Fetch API
Ohjelmistokehityksessä joudutaan usein pohtimaan, kannattaako jokin toiminnallisuus toteuttaa käyttämällä ulkoista kirjastoa vai onko parempi hyödyntää ympäristön tarjoamia natiiveja ratkaisuja. Molemmilla lähestymistavoilla on omat etunsa ja haasteensa. 

Käytimme HTTP-pyyntöjen tekemiseen kurssin aiemmissa osissa [Axios](https://axios-http.com/docs/intro)-kirjastoa. Tutustutaan nyt vaihtoehtoiseen tapaan tehdä HTTP-pyyntöjä natiivia [Fetch APIa](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) hyödyntäen.

On tyypillistä, että ulkoinen kirjasto kuten <i>Axios</i> on toteutettu hyödyntäen muita ulkoisia kirjastoja. Esimerkiksi jos Axioksen asentaa projektiin komennolla _npm install axios_, konsoliin tulostuu: 

```bash
$ npm install axios

added 23 packages, and audited 302 packages in 1s

71 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

Komento asentaisi projektiin siis Axios-kirjaston lisäksi yli 20 muuta npm-pakettia, jotka Axios tarvitsisi toimiakseen. 

<i>Fetch API</i> tarjoaa samankaltaisen tavan tehdä HTTP-pyyntöjä kuin Axios, mutta Fetch APIn käyttäminen ei vaadi ulkoisten kirjastojen asentamista. Sovelluksen ylläpito helpottuu, kun päivitettäviä kirjastoja on vähemmän, ja myös tietoturva paranee, koska sovelluksen mahdollinen hyökkäyspinta-ala pienenee. Sovellusten tietoturvaa ja ylläpitoa sivutaan kurssin [osassa 7](https://fullstackopen.com/osa7/luokkakomponentit_sekalaista#react-node-sovellusten-tietoturva).

Pyyntöjen tekeminen tapahtuu käytännössä käyttämällä _fetch()_-funktiota. Käytettävässä syntaksissa on jonkin verran eroja verrattuna Axiokseen. Huomaamme myös pian, että Axios on huolehtinut joistakin asioista puolestamme ja helpottanut elämäämme. Käytämme nyt kuitenkin Fetch APIa, koska se on laajasti käytetty natiiviratkaisu, joka jokaisen Full Stack -kehittäjän on syytä tuntea.

### Datan hakeminen palvelimelta

Tehdään backendistä dataa hakeva metodi tiedostoon <i>src/services/notes.js</i>:

```js
const baseUrl = 'http://localhost:3001/notes'

const getAll = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error('Failed to fetch notes')
  }

  const data = await response.json()
  return data
}

export default { getAll }
```

Tutkitaan _getAll_-metodin toteutusta tarkemmin. Muistiinpanot haetaan backendistä nyt kutsumalla _fetch()_-funktiota, jolle on annettu argumentiksi backendin URL-osoite. Pyynnön tyyppiä ei ole erikseen määritelty, joten _fetch_ toteuttaa oletusarvoisen toiminnon eli GET-pyynnön.

Kun vastaus on saapunut, tarkistetaan pyynnön onnistuminen vastauksen kentästä _response.ok_ ja heitetään tarvittaessa virhe:

```js
if (!response.ok) {
  throw new Error('Failed to fetch notes')
}
```

Attribuutti _response.ok_ saa arvon _true_, jos pyyntö on onnistunut eli jos vastauksen statuskoodi on välillä 200-299. Kaikilla muilla statuskoodeilla, esimerkiksi 404 tai 500, se saa arvon _false_. 

Huomaa, että _fetch_ ei automaattisesti heitä virhettä, vaikka vastauksen statuskoodi olisi esimerkiksi 404. Virheenkäsittely tulee toteuttaa manuaalisesti, kuten olemme nyt tehneet.

Jos pyyntö on onnistunut, vastauksen sisältämä data muunnetaan JSON-muotoon:

```js
const data = await response.json()
```

_fetch_ ei siis automaattisesti muunna vastauksen mukana mahdollisesti olevaa dataa JSON-muotoon, vaan muunnos tulee tehdä manuaalisesti. On myös hyvä huomata, että _response.json()_ on asynkroninen metodi, eli sen kanssa tulee käyttää <i>await</i>-avainsanaa.

Suoraviivaistetaan koodia vielä hieman palauttamalla suoraan metodin _response.json()_ palauttama data:

```js
const getAll = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error('Failed to fetch notes')
  }

  return await response.json() // highlight-line
}
```

### Storen alustaminen palvelimelta haetulla datalla

Muutetaan nyt sovellustamme siten, että sovelluksen tila alustetaan palvelimelta haetuilla muistiinpanoilla. 

Muutetaan tiedostossa <i>noteReducer.js</i> tapahtuvaa muistiinpanojen tilan alustusta siten, että oletusarvoisesti muistiinpanoja ei ole:

```js
const noteSlice = createSlice({
  name: 'notes',
  initialState: [], // highlight-line
  // ...
})
```

Lisätään action creator <em>setNotes</em>, jonka avulla muistiinpanojen taulukon voi suoraan korvata. Saamme <em>createSlice</em>-funktion avulla luotua haluamamme action creatorin seuraavasti:

```js
// ...

const noteSlice = createSlice({
  name: 'notes',
  initialState: [],
  reducers: {
    createNote(state, action) {
      const content = action.payload
      state.push({
        content,
        important: false,
        id: generateId()
      })
    },
    toggleImportanceOf(state, action) {
      const id = action.payload
      const noteToChange = state.find(n => n.id === id)
      const changedNote = {
        ...noteToChange,
        important: !noteToChange.important
      }
      return state.map(note => (note.id !== id ? note : changedNote))
    },
    // highlight-start
    setNotes(state, action) {
      return action.payload
    }
    // highlight-end
  }
})

export const { createNote, toggleImportanceOf, setNotes } = noteSlice.actions // highlight-line
export default noteSlice.reducer
```

Toteutetaan muistiinpanojen alustus <i>App</i>-komponentiin, eli kuten yleensä dataa palvelimelta haettaessa, käytetään <i>useEffect</i>-hookia:

```js
import { useEffect } from 'react' // highlight-line
import { useDispatch } from 'react-redux' // highlight-line

import NoteForm from './components/NoteForm'
import Notes from './components/Notes'
import VisibilityFilter from './components/VisibilityFilter'
import { setNotes } from './reducers/noteReducer' // highlight-line
import noteService from './services/notes' // highlight-line

const App = () => {
  const dispatch = useDispatch() // highlight-line

  // highlight-start
  useEffect(() => {
    noteService.getAll().then(notes => dispatch(setNotes(notes)))
  }, [dispatch])
  // highlight-end

  return (
    <div>
      <NoteForm />
      <VisibilityFilter />
      <Notes />
    </div>
  )
}

export default App
```

Muistiinpanot haetaan palvelimelta siis käyttäen määrittelemäämme _getAll()_-metodia ja tallennetaan sitten Redux-storeen dispatchaamalla _setNotes_ -action creatorin palauttama action. Toiminnot tehdään <i>useEffect</i>-hookissa eli ne suoritetaan App-komponentin ensimmäisen renderoinnin yhteydessä.

Tutkitaan vielä tarkemmin erästä pientä yksityiskohtaa. Olemme lisänneet _dispatch_-muuttujan <i>useEffect</i>-hookin riippuvuustaulukkoon. Jos yritämme käyttää tyhjää riippuvuustaulukkoa, ESLint antaa seuraavan varoituksen: <i>React Hook useEffect has a missing dependency: 'dispatch'</i>. Mistä on kyse?

Koodi toimisi loogisesti täysin samoin, vaikka käyttäisimme tyhjää riippuvuustaulukkoa, koska dispatch viittaa samaan funktioon koko ohjelman suorituksen ajan. On kuitenkin hyvän ohjelmointikäytännön mukaista lisätä _useEffect_-hookin riippuvuuksiksi kaikki sen käyttämät muuttujat ja funktiot, jotka on määritelty kyseisen komponentin sisällä. Näin voidaan välttää yllättäviä bugeja.

### Datan lähettäminen palvelimelle

Toteutetaan seuraavaksi toiminnallisuus uuden muistiinpanon lähettämiseksi palvelimelle. Pääsemme samalla harjoittelemaan, miten POST-pyyntö tehdään _fetch()_-metodia käyttäen.

Laajennetaan tiedostossa <i>src/services/notes.js</i> olevaa palvelimen kanssa kommunikoivaa koodia seuraavasti:

```js
const baseUrl = 'http://localhost:3001/notes'

const getAll = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error('Failed to fetch notes')
  }

  return await response.json()
}

// highlight-start
const createNew = async (content) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, important: false }),
  })
  
  if (!response.ok) {
    throw new Error('Failed to create note')
  }
  
  return await response.json()
}
// highlight-end

export default { getAll, createNew } // highlight-line
```

Tutkitaan _createNew_-metodin toteutusta tarkemmin. _fetch()_-funktion ensimmäinen parametri määrittelee URL-osoitteen, johon pyyntö tehdään. Toinen parametri on olio, joka määrittelee muut pyynnön yksityiskohdat, kuten pyynnön tyypin, otsikot ja pyynnön mukana lähetettävän datan. Voimme selkeyttää koodia vielä hieman tallentamalla pyynnön yksityiskohdat määrittelevän olion erilliseen <i>options</i>-apumuuttujaan:

```js
const createNew = async (content) => {
  // highlight-start
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, important: false }),
  }
  
  const response = await fetch(baseUrl, options)
  // highlight-end

  if (!response.ok) {
    throw new Error('Failed to create note')
  }
  
  return await response.json()
}
```

Tutkitaan <i>options</i>-oliota tarkemmin:

- <i>method</i> määrittelee pyynnön tyypin, joka tässä tapauksessa on <i>POST</i>
- <i>headers</i> määrittelee pyynnön otsikot. Liitämme pyyntöön otsikon _'Content-Type': 'application/json'_, jotta palvelin tietää, että pyynnön mukana oleva data on JSON-muotoista, ja osaa käsitellä pyynnön oikein
- <i>body</i> sisältää pyynnön mukana lähetettävän datan. Kentään ei voi suoraan sijoittaa JavaScript-oliota, vaan se tulee ensin muuntaa JSON-merkkijonoksi kutsumalla funktiota _JSON.stringify()_

Kuten GET-pyynnön kanssa, myös nyt vastauksen statuskoodi tutkitaan virheiden varalta:

```js
if (!response.ok) {
  throw new Error('Failed to create note')
}
```

Jos pyyntö onnistuu, <i>JSON Server</i> palauttaa juuri luodun muistiinpanon, jolle se on generoinut myös yksilöllisen <i>id</i>:n. Vastauksen sisältämä data tulee kuitenkin vielä muuntaa JSON-muotoon metodilla _response.json()_: 

```js
return await response.json()
```

Muutetaan sitten sovelluksemme <i>NoteForm</i>-komponenttia siten, että uusi muistiinpano lähetetään backendiin. Komponentin metodi _addNote_ muuttuu hiukan:

```js
import { useDispatch } from 'react-redux'
import { createNote } from '../reducers/noteReducer'
import noteService from '../services/notes' // highlight-line

const NoteForm = (props) => {
  const dispatch = useDispatch()
  
  const addNote = async (event) => { // highlight-line
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    const newNote = await noteService.createNew(content) // highlight-line
    dispatch(createNote(newNote)) // highlight-line
  }

  return (
    <form onSubmit={addNote}>
      <input name="note" />
      <button type="submit">add</button>
    </form>
  )
}

export default NoteForm
```

Kun uusi muistiinpano luodaan backendiin kutsumalla _createNew()_-metodia, saadaan paluuarvona muistiinpanoa kuvaava olio, jolle backend on generoinut <i>id</i>:n. Muutetaan siksi tiedostossa <i>notesReducer.js</i> määritelty action creator <i>createNote</i> seuraavaan muotoon:

```js
const noteSlice = createSlice({
  name: 'notes',
  initialState: [],
  reducers: {
    createNote(state, action) {
      state.push(action.payload) // highlight-line
    },
    // ..
  },
})
```

Muistiinpanojen tärkeyden muuttaminen olisi mahdollista toteuttaa samalla periaatteella, eli tehdä palvelimelle ensin asynkroninen metodikutsu ja sen jälkeen dispatchata sopiva action.

Sovelluksen tämänhetkinen koodi on [GitHubissa](https://github.com/fullstack-hy2020/redux-notes/tree/part6-4) branchissa <i>part6-4</i>.

</div>

<div class="tasks">

### Tehtävät 6.14.-6.15.

#### 6.14 anekdootit ja backend, step1

Hae sovelluksen käynnistyessä anekdootit JSON Serverillä toteutetusta backendistä. Käytä HTTP-pyynnön tekemiseen Fetch APIa.

Backendin alustavan sisällön saat esim. [täältä](https://github.com/fullstack-hy2020/misc/blob/master/anecdotes.json).

#### 6.15 anekdootit ja backend, step2

Muuta uusien anekdoottien luomista siten, että anekdootit talletetaan backendiin. Hyödynnä toteutuksessasi jälleen Fetch APIa.

</div>

<div class="content">

### Asynkroniset actionit ja Redux Thunk

Lähestymistapamme on melko hyvä, mutta siinä mielessä ikävä, että palvelimen kanssa kommunikointi tapahtuu komponentit määrittelevien funktioiden koodissa. Olisi parempi, jos kommunikointi voitaisiin abstrahoida komponenteilta siten, että niiden ei tarvitsisi kuin kutsua sopivaa <i>action creatoria</i>. Esim. <i>App</i> voisi alustaa sovelluksen tilan seuraavasti:

```js
const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeNotes())
  }, [dispatch]) 
  
  // ...
}
```

<i>NoteForm</i> puolestaan loisi uuden muistiinpanon seuraavasti:

```js
const NoteForm = () => {
  const dispatch = useDispatch()
  
  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    dispatch(createNote(content))
  }

  // ...
}
```

Molemmat komponentit dispatchaisivat ainoastaan actionin välittämättä siitä, että taustalla tapahtuu todellisuudessa palvelimen kanssa tapahtuvaa kommunikointia. Tämän kaltaisten <i>asynkronisten actioneiden</i> käyttö onnistuu [Redux Thunk](https://github.com/reduxjs/redux-thunk)-kirjaston avulla. Kirjaston käyttö ei vaadi ylimääräistä konfiguraatiota eikä asennusta, kun Redux-store on luotu Redux Toolkitin <em>configureStore</em>-funktiolla.

Redux Thunkin ansiosta on mahdollista määritellä <i>action creatoreja</i>, jotka palauttavat objektin sijaan funktion. Tämän ansiosta on mahdollista toteuttaa asynkronisia action creatoreja, jotka ensin odottavat jonkin asynkronisen toimenpiteen valmistumista ja vasta sen jälkeen dispatchaavat varsinaisen actionin. 

Jos action creator palauttaa funktion, Redux välittää palautetulle funktiolle automaattisesti Redux-storen <em>dispatch</em>- ja <em>getState</em>-metodit argumenteiksi. Sen ansiosta voimme määritellä muistiinpanojen alkutilan palvelimelta hakevan action creatorin <em>initializeNotes</em> tiedostossa <i>noteReducer.js</i> seuraavasti:

```js
import { createSlice } from '@reduxjs/toolkit'
import noteService from '../services/notes' // highlight-line

const noteSlice = createSlice({
  name: 'notes',
  initialState: [],
  reducers: {
    createNote(state, action) {
      state.push(action.payload)
    },
    toggleImportanceOf(state, action) {
      const id = action.payload
      const noteToChange = state.find((n) => n.id === id)
      const changedNote = {
        ...noteToChange,
        important: !noteToChange.important,
      }
      return state.map((note) => (note.id !== id ? note : changedNote))
    },
    setNotes(state, action) {
      return action.payload
    },
  },
})

const { setNotes } = noteSlice.actions // highlight-line

// highlight-start
export const initializeNotes = () => {
  return async (dispatch) => {
    const notes = await noteService.getAll()
    dispatch(setNotes(notes))
  }
}
// highlight-end

export const { createNote, toggleImportanceOf } = noteSlice.actions // highlight-line

export default noteSlice.reducer
```

Sisemmässä funktiossaan eli <i>asynkronisessa actionissa</i> operaatio hakee ensin palvelimelta kaikki muistiinpanot ja sen jälkeen <i>dispatchaa</i> muistiinpanot storeen lisäävän actionin. Huomionarvioista on se, että Redux välittää _dispatch_-metodin viitteen automaattisesti funktion argumentiksi, eli action creator _initializeNotes_ ei tarvitse mitään parametreja.

Action creatoria _setNotes_ ei enää exportata moduulin ulkopuolelle, koska muistiinpanojen alkutila on tarkoitus asettaa jatkossa käytämällä tekemäämme asynkronista action creatoria _initialNotes_. Hyödynnämme kuitenkin edelleen _setNotes_ -action creatoria moduulin sisällä.

Komponentti <i>App</i> voidaan nyt määritellä seuraavasti:

```js
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import NoteForm from './components/NoteForm'
import Notes from './components/Notes'
import VisibilityFilter from './components/VisibilityFilter'
import { initializeNotes } from './reducers/noteReducer' // highlight-line

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeNotes()) // highlight-line
  }, [dispatch])

  return (
    <div>
      <NoteForm />
      <VisibilityFilter />
      <Notes />
    </div>
  )
}

export default App
```

Ratkaisu on elegantti, sillä muistiinpanojen alustuslogiikka on eriytetty kokonaan React-komponenttien ulkopuolelle.

Luodaan seuraavaksi _appendNote_-niminen asynkroninen action creator:

```js
import { createSlice } from '@reduxjs/toolkit'
import noteService from '../services/notes'

const noteSlice = createSlice({
  name: 'notes',
  initialState: [],
  reducers: {
    createNote(state, action) {
      state.push(action.payload)
    },
    toggleImportanceOf(state, action) {
      const id = action.payload
      const noteToChange = state.find((n) => n.id === id)
      const changedNote = {
        ...noteToChange,
        important: !noteToChange.important,
      }
      return state.map((note) => (note.id !== id ? note : changedNote))
    },
    setNotes(state, action) {
      return action.payload
    },
  },
})

const { createNote, setNotes } = noteSlice.actions // highlight-line

export const initializeNotes = () => {
  return async (dispatch) => {
    const notes = await noteService.getAll()
    dispatch(setNotes(notes))
  }
}

// highlight-start
export const appendNote = (content) => {
  return async (dispatch) => {
    const newNote = await noteService.createNew(content)
    dispatch(createNote(newNote))
  }
}
// highlight-end

export const { toggleImportanceOf } = noteSlice.actions // highlight-line

export default noteSlice.reducer
```

Periaate on jälleen sama. Ensin suoritetaan asynkroninen operaatio, ja sen valmistuttua <i>dispatchataan</i> storen tilaa muuttava action. _createNote_ -action creatoria ei enää exportata tiedoston ulkopuolelle, vaan sitä käytetään ainoastaan sisäisesti _appendNote_ -funktion toteutuksessa. 

Komponentti <i>NoteForm</i> yksinkertaistuu seuraavasti:

```js
import { useDispatch } from 'react-redux'
import { appendNote } from '../reducers/noteReducer' // highlight-line

const NoteForm = () => {
  const dispatch = useDispatch()

  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    dispatch(appendNote(content)) // highlight-line
  }

  return (
    <form onSubmit={addNote}>
      <input name="note" />
      <button type="submit">add</button>
    </form>
  )
}
```

Sovelluksen tämänhetkinen koodi on [GitHubissa](https://github.com/fullstack-hy2020/redux-notes/tree/part6-5) branchissa <i>part6-5</i>.

Redux Toolkit tarjoaa myös hieman kehittyneempiä työkaluja asynkronisen tilanhallinnan helpottamiseksi, esim mm. [createAsyncThunk](https://redux-toolkit.js.org/api/createAsyncThunk)-funktion ja [RTK Query](https://redux-toolkit.js.org/rtk-query/overview) ‑API:n. Yksinkertaisissa sovelluksissa näiden tuoma hyöty lienee kuitenkin vähäinen.

</div>

<div class="tasks">

### Tehtävät 6.16.-6.19.

#### 6.16 anekdootit ja backend, step3

Muuta Redux-storen alustus tapahtumaan Redux Thunk ‑kirjaston avulla toteutettuun asynkroniseen actioniin.

#### 6.17 anekdootit ja backend, step4

Muuta myös uuden anekdootin luominen tapahtumaan Redux Thunk ‑kirjaston avulla toteutettuihin asynkronisiin actioneihin.

#### 6.18 anekdootit ja backend, step5

Äänestäminen ei vielä talleta muutoksia backendiin. Korjaa tilanne Redux Thunk ‑kirjastoa ja Fetch APIa hyödyntäen.

#### 6.19 anekdootit ja backend, step6

Notifikaatioiden tekeminen on nyt hieman ikävää, sillä se edellyttää kahden actionin tekemistä ja _setTimeout_-funktion käyttöä:

```js
dispatch(setNotification(`new anecdote '${content}'`))
setTimeout(() => {
  dispatch(clearNotification())
}, 5000)
```

Toteuta action creator, joka mahdollistaa notifikaation antamisen seuraavasti:

```js
dispatch(setNotification(`you voted '${anecdote.content}'`, 10))
```

Ensimmäisenä parametrina on renderöitävä teksti ja toisena notifikaation näyttöaika sekunneissa.

Ota paranneltu notifikaatiotapa käyttöön sovelluksessasi.

</div>
