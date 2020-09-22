---
mainImage: ../../../images/part-6.svg
part: 6
letter: a
lang: fi
---

<div class="content">

Olemme noudattaneet sovelluksen tilan hallinnassa Reactin suosittelemaa käytäntöä määritellä useiden komponenttien tarvitsema tila ja sitä käsittelevät metodit [sovelluksen juurikomponentissa](https://reactjs.org/docs/lifting-state-up.html). Tilaa ja sitä käsitteleviä funktioita on välitetty propsien avulla niitä tarvitseville komponenteille. Tämä toimii johonkin pisteeseen saakka, mutta sovelluksen kasvaessa, muuttuu tilan hallinta haasteelliseksi.

### Flux-arkkitehtuuri

Facebook kehitti tilan hallinnan ongelmia helpottamaan [Flux](https://facebook.github.io/flux/docs/in-depth-overview)-arkkitehtuurin. Fluxissa sovelluksen tilan hallinta erotetaan kokonaan Reactin komponenttien ulkopuolisiin varastoihin eli <i>storeihin</i>. Storessa olevaa tilaa ei muuteta suoraan, vaan tapahtumien eli <i>actionien</i> avulla.

Kun action muuttaa storen tilaa, renderöidään näkymät uudelleen:

![](https://facebook.github.io/flux/img/overview/flux-simple-f8-diagram-1300w.png)

Jos sovelluksen käyttö, esim. napin painaminen aiheuttaa tarpeen tilan muutokseen, tehdään tilanmuutos actionin avulla. Tämä taas aiheuttaa uuden näytön renderöitymisen:

![](https://facebook.github.io/flux/img/overview/flux-simple-f8-diagram-with-client-action-1300w.png)

Flux tarjoaa siis standardin tavan sille miten ja missä sovelluksen tila pidetään sekä tavalle tehdä tilaan muutoksia.

### Redux

Facebookilla on olemassa valmis toteutus Fluxille, käytämme kuitenkin saman periaatteen mukaan toimivaa, mutta hieman yksinkertaisempaa [Redux](https://redux.js.org)-kirjastoa, jota myös Facebookilla käytetään nykyään alkuperäisen Flux-toteutuksen sijaan.

Tutustutaan Reduxiin tekemällä jälleen kerran laskurin toteuttava sovellus:

![](../../images/6/1.png)


Tehdään uusi create-react-app-sovellus ja asennetaan siihen <i></i>redux</i> komennolla

```bash
npm install redux
```

Fluxin tapaan Reduxissa sovelluksen tila talletetaan [storeen](https://redux.js.org/basics/store).

Koko sovelluksen tila talletetaan <i>yhteen</i> storen tallettamaan Javascript-objektiin. Koska sovelluksemme ei tarvitse mitään muuta tilaa kuin laskurin arvon, talletetaan se storeen suoraan. Jos sovelluksen tila olisi monipuolisempi, talletettaisiin "eri asiat" storessa olevaan olioon erillisinä kenttinä.

Storen tilaa muutetaan [actionien](https://redux.js.org/basics/actions) avulla. Actionit ovat olioita, joilla on vähintään actionin <i>tyypin</i> määrittelevä kenttä <i>type</i>. Sovelluksessamme tarvitsemme esimerkiksi seuraavaa actionia:

```js
{
  type: 'INCREMENT'
}
```

Jos actioneihin liittyy dataa, määritellään niille tarpeen vaatiessa muitakin kenttiä. Laskurisovelluksemme on kuitenkin niin yksinkertainen, että actioneille riittää pelkkä tyyppikenttä.

Actionien vaikutus sovelluksen tilaan määritellään [reducerin](https://redux.js.org/basics/reducers) avulla. Käytännössä reducer on funktio, joka saa parametrikseen olemassaolevan staten tilan sekä actionin ja <i>palauttaa</i> staten uuden tilan.

Määritellään nyt sovelluksellemme reduceri:

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

Ensimmäinen parametri on siis storessa oleva <i>tila</i>. Reducer palauttaa <i>uuden tilan</i> actionin tyypin mukaan.

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
import { createStore } from 'redux'

const counterReducer = (state = 0, action) => {
  // ...
}

const store = createStore(counterReducer)
```

Store käyttää nyt reduceria käsitelläkseen <i>actioneja</i>, jotka <i>dispatchataan</i> eli "lähetetään" storelle sen [dispatch](https://redux.js.org/api/store#dispatchaction)-metodilla:

```js
store.dispatch({type: 'INCREMENT'})
```

Storen tilan saa selville metodilla [getState](https://redux.js.org/api/store/#getstate).

Esim. seuraava koodi

```js
const store = createStore(counterReducer)
console.log(store.getState())
store.dispatch({type: 'INCREMENT'})
store.dispatch({type: 'INCREMENT'})
store.dispatch({type: 'INCREMENT'})
console.log(store.getState())
store.dispatch({type: 'ZERO'})
store.dispatch({type: 'DECREMENT'})
console.log(store.getState())
```

tulostaisi konsoliin

<pre>
0
3
-1
</pre>

sillä ensin storen tila on 0. Kolmen <i>INCREMENT</i>-actionin jälkeen tila on 3, ja lopulta actionien <i>ZERO</i> ja <i>DECREMENT</i> jälkeen -1.

Kolmas tärkeä metodi storella on [subscribe](https://redux.js.org/api/store#subscribelistener), jonka avulla voidaan määritellä takaisinkutsufunktioita, joita store kutsuu sen tilan muuttumisen yhteydessä.

Jos esim. lisäisimme seuraavan funktion subscribe:lla, tulostuisi <i>jokainen storen muutos</i> konsoliin.

```js
store.subscribe(() => {
  const storeNow = store.getState()
  console.log(storeNow)
})
```

eli koodi

```js
const store = createStore(counterReducer)

store.subscribe(() => {
  const storeNow = store.getState()
  console.log(storeNow)
})

store.dispatch({ type: 'INCREMENT' })
store.dispatch({ type: 'INCREMENT' })
store.dispatch({ type: 'INCREMENT' })
store.dispatch({ type: 'ZERO' })
store.dispatch({ type: 'DECREMENT' })
```

aiheuttaisi tulostuksen

<pre>
1
2
3
0
-1
</pre>


Laskurisovelluksemme koodi on seuraavassa. Kaikki koodi on kirjoitettu samaan tiedostoon, joten <i>store</i> on suoraan React-koodin käytettävissä. Tutustumme React/Redux-koodin parempiin strukturointitapoihin myöhemmin.

```js
import React from 'react'
import ReactDOM from 'react-dom'
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
      <div>
        {store.getState()}
      </div>
      <button 
        onClick={e => store.dispatch({ type: 'INCREMENT' })}
      >
        plus
      </button>
      <button
        onClick={e => store.dispatch({ type: 'DECREMENT' })}
      >
        minus
      </button>
      <button 
        onClick={e => store.dispatch({ type: 'ZERO' })}
      >
        zero
      </button>
    </div>
  )
}

const renderApp = () => {
  ReactDOM.render(<App />, document.getElementById('root'))
}

renderApp()
store.subscribe(renderApp)
```

Koodissa on pari huomionarvoista seikkaa. <i>App</i> renderöi laskurin arvon kysymällä sitä storesta metodilla _store.getState()_. Nappien tapahtumankäsittelijät <i>dispatchaavat</i> suoraan oikean tyyppiset actionit storelle.

Kun storessa olevan tilan arvo muuttuu, ei React osaa automaattisesti renderöidä sovellusta uudelleen. Olemmekin rekisteröineet koko sovelluksen renderöinnin suorittavan funktion _renderApp_ kuuntelemaan storen muutoksia metodilla _store.subscribe_. Huomaa, että joudumme kutsumaan heti alussa metodia _renderApp_, ilman kutsua sovelluksen ensimmäistä renderöintiä ei koskaan tapahdu.

### Redux-muistiinpanot

Tavoitteenamme on muuttaa muistiinpanosovellus käyttämään tilanhallintaan Reduxia. Katsotaan kuitenkin ensin eräitä konsepteja hieman yksinkertaistetun muistiinpanosovelluksen kautta.

Sovelluksen ensimmäinen versio seuraavassa

```js
const noteReducer = (state = [], action) => {
  if (action.type === 'NEW_NOTE') {
    state.push(action.data)
    return state
  }

  return state
}

const store = createStore(noteReducer)

store.dispatch({
  type: 'NEW_NOTE',
  data: {
    content: 'the app state is in redux store',
    important: true,
    id: 1
  }
})

store.dispatch({
  type: 'NEW_NOTE',
  data: {
    content: 'state changes are made with actions',
    important: false,
    id: 2
  }
})

const App = () => {
  return(
    <div>
      <ul>
        {store.getState().map(note=>
          <li key={note.id}>
            {note.content} <strong>{note.important ? 'important' : ''}</strong>
          </li>
        )}
        </ul>
    </div>
  )
}
```

Toistaiseksi sovelluksessa ei siis ole toiminnallisuutta uusien muistiinpanojen lisäämiseen, voimme kuitenkin tehdä sen dispatchaamalla <i>NEW\_NOTE</i>-tyyppisiä actioneja koodista.

Actioneissa on nyt tyypin lisäksi kenttä <i>data</i>, joka sisältää lisättävän muistiinpanon:

```js
{
  type: 'NEW_NOTE',
  data: {
    content: 'state changes are made with actions',
    important: false,
    id: 2
  }
}
```

### puhtaat funktiot, immutable

Reducerimme alustava versio on yksinkertainen:

```js
const noteReducer = (state = [], action) => {
  if (action.type === 'NEW_NOTE') {
    state.push(action.data)
    return state
  }

  return state
}
```

Tila on nyt taulukko. <i>NEW\_NOTE</i>-tyyppisen actionin seurauksena tilaan lisätään uusi muistiinpano metodilla [push](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push).

Sovellus näyttää toimivan, mutta määrittelemämme reduceri on huono, se rikkoo Reduxin reducerien [perusolettamusta](https://github.com/reactjs/redux/blob/master/docs/basics/Reducers.md#handling-actions) siitä, että reducerien tulee olla [puhtaita funktioita](https://en.wikipedia.org/wiki/Pure_function).

Puhtaat funktiot ovat sellaisia, että ne <i>eivät aiheuta mitään sivuvaikutuksia</i> ja niiden tulee aina palauttaa sama vastaus samoilla parametreilla kutsuttaessa.

Lisäsimme tilaan uuden muistiinpanon metodilla _state.push(action.data)_  joka <i>muuttaa</i> state-olion tilaa. Tämä ei ole sallittua. Ongelma korjautuu helposti käyttämällä metodia [concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat), joka luo <i>uuden taulukon</i>, jonka sisältönä on vanhan taulukon alkiot sekä lisättävä alkio:

```js
const noteReducer = (state = [], action) => {
  if (action.type === 'NEW_NOTE') {
    return state.concat(action.data)
  }

  return state
}
```

Reducen tilan tulee koostua muuttumattomista eli [immutable](https://en.wikipedia.org/wiki/Immutable_object) olioista. Jos tilaan tulee muutos, ei vanhaa oliota muuteta, vaan se <i>korvataan uudella muuttuneella oliolla</i>. Juuri näin toimimme uudistuneessa reducerissa, vanha taulukko korvaantuu uudella.

Laajennetaan reduceria siten, että se osaa käsitellä muistiinpanon tärkeyteen liittyvän muutoksen:

```js
{
  type: 'TOGGLE_IMPORTANCE',
  data: {
    id: 2
  }
}
```

Koska meillä ei ole vielä koodia joka käyttää ominaisuutta, laajennetaan reduceria testivetoisesti. Aloitetaan tekemällä testi actionin <i>NEW\_NOTE</i> käsittelylle.

Jotta testaus olisi helpompaa, siirretään reducerin koodi ensin omaan moduuliinsa tiedostoon <i>src/reducers/noteReducer.js</i>. Otetaan käyttöön myös kirjasto [deep-freeze](https://github.com/substack/deep-freeze), jonka avulla voimme varmistaa, että reducer on määritelty oikeaoppisesti puhtaana funktiona. Asennetaan kirjasto kehitysaikaiseksi riippuvuudeksi

```js
npm install --save-dev deep-freeze
```

Testi, joka määritellään tiedostoon <i>src/reducers/noteReducer.test.js</i> on sisällöltään seuraava:

```js
import noteReducer from './noteReducer'
import deepFreeze from 'deep-freeze'

describe('noteReducer', () => {
  test('returns new state with action NEW_NOTE', () => {
    const state = []
    const action = {
      type: 'NEW_NOTE',
      data: {
        content: 'the app state is in redux store',
        important: true,
        id: 1
      }
    }

    deepFreeze(state)
    const newState = noteReducer(state, action)

    expect(newState).toHaveLength(1)
    expect(newState).toContainEqual(action.data)
  })
})
```

Testi siis varmistaa, että reducerin palauttama uusi tila on taulukko, joka sisältää yhden elementin, joka on sama kun actionin kentän <i>data</i> sisältävä olio.

Komento <i>deepFreeze(state)</i> varmistaa, että reducer ei muuta parametrina olevaa storen tilaa. Jos reduceri käyttää state:n manipulointiin komentoa _push_, testi ei mene läpi

![](../../images/6/2.png)

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
    }]

  const action = {
    type: 'TOGGLE_IMPORTANCE',
    data: {
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
  data: {
    id: 2
}
```

tulee muuttaa id:n 2 omaavan muistiinpanon tärkeyttä.

Reduceri laajenee seuraavasti

```js
const noteReducer = (state = [], action) => {
  switch(action.type) {
    case 'NEW_NOTE':
      return state.concat(action.data)
    case 'TOGGLE_IMPORTANCE':
      const id = action.data.id
      const noteToChange = state.find(n => n.id === id)
      const changedNote = { 
        ...noteToChange, 
        important: !noteToChange.important 
      }
      return state.map(note =>
        note.id !== id ? note : changedNote 
      )
    default:
      return state
  }
}
```

Luomme tärkeyttä muuttaneesta muistiinpanosta kopion osasta 2 [tutulla syntaksilla](/osa2/palvelimella_olevan_datan_muokkaaminen#muistiinpanon-tarkeyden-muutos) ja korvaamme tilan uudella tilalla, mihin otetaan muuttumattomat muistiinpanot ja muutettavasta sen muutettu kopio <i>changedNote</i>.

Kerrataan vielä mitä koodissa tapahtuu. Ensin etsitään olio, jonka tärkeys on tarkoitus muuttaa:

```js
const noteToChange = state.find(n => n.id === id)
```

luodaan sitten uusi olio, joka on muuten <i>kopio</i> muuttuvasta oliosta mutta kentän <i>important</i> arvo on muutettu päinvastaiseksi:

```js
const changedNote = { 
  ...noteToChange, 
  important: !noteToChange.important 
}
```

Palautetaan uusi tila, joka saadaan ottamalla kaikki vanhan tilan muistiinpanot paitsi uusi juuri luotu olio tärkeydeltään muuttavasta muistiinpanosta:

```js
state.map(note =>
  note.id !== id ? note : changedNote 
)
```

### array spread -syntaksi

Koska reducerilla on nyt suhteellisen hyvät testit, voimme refaktoroida koodia turvallisesti.

Uuden muistiinpanon lisäys luo palautettavan tilan taulukon _concat_-funktiolla. Katsotaan nyt miten voimme toteuttaa saman hyödyntämällä Javascriptin [array spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator) -syntaksia:

```js
const noteReducer = (state = [], action) => {
  switch(action.type) {
    case 'NEW_NOTE':
      return [...state, action.data]
    case 'TOGGLE_IMPORTANCE':
      // ...
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

ja lopputuloksena on taulukko, jonka sisältö on `[1, 2, 3, 4, 5]`.

Jos olisimme sijoittaneet taulukon toisen sisälle ilman spreadia, eli

```js
[luvut, 4, 5]
```

lopputulos olisi ollut `[ [1, 2, 3], 4, 5]`.

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

Tehdään hieman yksinkertaistettu versio osan 1 unicafe-tehtävästä. Hoidetaan sovelluksen tilan käsittely Reduxin avulla.

Voit ottaa sovelluksesi pohjaksi repositoriossa https://github.com/fullstack-hy2020/unicafe-redux  olevan projektin.

<i>Aloita poistamalla kloonatun sovelluksen git-konfiguraatio ja asentamalla riippuvuudet</i>

```bash
cd unicafe-redux   // mene kloonatun repositorion hakemistoon
rm -rf .git
npm install
```

#### 6.1: unicafe revisited, step1

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
    case 'ZERO':
      return state
  }
  return state
}

export default counterReducer
```

ja sen testien runko

```js
import deepFreeze from 'deep-freeze'
import counterReducer from './reducer'

describe('unicafe reducer', () => {
  const initialState = {
    good: 0,
    ok: 0,
    bad: 0
  }

  test('should return a proper initial state when called with undefined state', () => {
    const state = {}
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

Varmista testeissä <i>deep-freeze</i>-kirjaston avulla, että kyseessä on <i>puhdas funktio</i>. Huomaa, että valmiin ensimmäisen testin on syytä mennä läpi koska redux olettaa, että reduceri palauttaa järkevän alkutilan kun sitä kutsutaan siten että ensimmäinen parametri, eli aiempaa tilaa edustava <i>state</i> on <i>undefined</i>.

Aloita laajentamalla reduceria siten, että molemmat testeistä menevät läpi. Lisää tämän jälkeen loput testit ja niiden toteuttava toiminnallisuus.

Reducerin toteutuksessa kannattaa ottaa mallia ylläolevasta [redux-muistiinpanot](/osa6/flux_arkkitehtuuri_ja_redux#puhtaat-funktiot-immutable)-esimerkistä. 

#### 6.2: unicafe revisited, step2

Toteuta sitten sovellukseen koko sen varsinainen toiminnallisuus. 

</div>

<div class="content">

### ei-kontrolloitu lomake

Lisätään sovellukseen mahdollisuus uusien muistiinpanojen tekemiseen sekä tärkeyden muuttamiseen:

```js
const generateId = () =>
  Number((Math.random() * 1000000).toFixed(0))

const App = () => {
  const addNote = (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    store.dispatch({
      type: 'NEW_NOTE',
      data: {
        content,
        important: false,
        id: generateId()
      }
    })
  }

  const toggleImportance = (id) => {
    store.dispatch({
      type: 'TOGGLE_IMPORTANCE',
      data: { id }
    })
  }


  return (
    <div>
      <form onSubmit={addNote}>
        <input name="note" /> 
        <button type="submit">add</button>
      </form>
      <ul>
        {store.getState().map(note =>
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
```

Molemmat toiminnallisuudet on toteutettu suoraviivaisesti. Huomionarvoista uuden muistiinpanon lisäämisessä on nyt se, että toisin kuin aiemmat Reactilla toteutetut lomakkeet, <i>emme ole</i> nyt sitoneet lomakkeen kentän arvoa komponentin <i>App</i> tilaan. React kutsuu tälläisiä lomakkeita [ei-kontrolloiduiksi](https://reactjs.org/docs/uncontrolled-components.html).

> Ei-kontrolloiduilla lomakkeilla on tiettyjä rajoitteita (ne eivät esim. mahdollista lennossa annettavia validointiviestejä, lomakkeen lähetysnapin disabloimista sisällön perusteella ym...), meidän käyttötapaukseemme ne kuitenkin tällä kertaa sopivat.
Voit halutessasi lukea aiheesta enemmän [täältä](https://goshakkk.name/controlled-vs-uncontrolled-inputs-react/).

Muistiinpanon lisäämisen käsittelevä metodi on yksinkertainen, se ainoastaan dispatchaa muistiinpanon lisäävän actionin:

```js
addNote = (event) => {
  event.preventDefault()
  const content = event.target.note.value  // highlight-line
  event.target.note.value = ''
  store.dispatch({
    type: 'NEW_NOTE',
    data: {
      content,
      important: false,
      id: generateId()
    }
  })
}
```

Uuden muistiinpanon sisältö saadaan suoraan lomakkeen syötekentästä, johon kentän nimeämisen ansiosta päästään käsiksi tapahtumaolion kautta <i>event.target.note.value</i>. Kannattaa huomata, että syötekentällä on oltava nimi, jotta sen arvoon on mahdollista päästä käsiksi:

```js
<form onSubmit={addNote}>
  <input name="note" /> // highlight-line
  <button type="submit">add</button>
</form>
```

Tärkeyden muuttaminen tapahtuu klikkaamalla muistiinpanon nimeä. Käsittelijä on erittäin yksinkertainen:

```js
toggleImportance = (id) => {
  store.dispatch({
    type: 'TOGGLE_IMPORTANCE',
    data: { id }
  })
}
```

### action creatorit

Alamme huomata, että jo näinkin yksinkertaisessa sovelluksessa Reduxin käyttö yksinkertaistaa sovelluksen ulkoasusta vastaavaa koodia. Pystymme kuitenkin vielä paljon parempaan. 

React-komponenttien on oikeastaan tarpeetonta tuntea reduxin actionien tyyppejä ja esitysmuotoja. Eristetään actioneiden luominen omiin funktioihinsa:

```js
const createNote = (content) => {
  return {
    type: 'NEW_NOTE',
    data: {
      content,
      important: false,
      id: generateId()
    }
  }
}

const toggleImportanceOf = (id) => {
  return {
    type: 'TOGGLE_IMPORTANCE',
    data: { id }
  }
}
```

Actioneja luovia funktioita kutsutaan [action creatoreiksi](https://redux.js.org/advanced/async-actions#synchronous-action-creators).


Komponentin <i>App</i> ei tarvitse enää tietää mitään actionien sisäisestä esitystavasta, se saa sopivan actionin kutsumalla creator-funktiota:


```js
const App = () => {
  const addNote = (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    store.dispatch(createNote(content)) // highlight-line 
  }
  
  const toggleImportance = (id) => {
    store.dispatch(toggleImportanceOf(id))// highlight-line
  }

  // ...
}
```

### Redux-storen välittäminen eri komponenteille

Koko sovellus on toistaiseksi kirjoitettu yhteen tiedostoon ja sen ansiosta joka puolelta sovellusta on päästy käsiksi redux-storeen. Entä jos haluamme jakaa sovelluksen useisiin, omiin komponentteihin sijoitettuihin tiedostoihin? 

Tapoja välittää redux-store sovelluksen komponenteille on useita, tutustutaan ensin ehkä uusimpaan ja helpoimpaan tapaan [react-redux](https://react-redux.js.org/)-kirjaston tarjoamaan [hooks](https://react-redux.js.org/api/hooks)-rajapintaan.

Asennetaan react-redux

```bash
npm install react-redux
```

Eriytetään komponentti _App_ omaan tiedostoon _App.js_. Tarkastellaan ensin mitä sovelluksen muiden tiedostojen sisällöksi tulee.

Tiedosto _index.js_ näyttää seuraavalta

```js
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux' // highlight-line
import App from './App'
import noteReducer from './reducers/noteReducer'

const store = createStore(noteReducer)

ReactDOM.render(
  <Provider store={store}>  // highlight-line
    <App />
  </Provider>,  // highlight-line
  document.getElementById('root')
)
```

Uutta tässä on se, että sovellus on määritelty react redux -kirjaston tarjoaman [Provider](https://github.com/reactjs/react-redux/blob/master/docs/api.md#provider-store)-komponentin lapsena ja että sovelluksen käyttämä store on annettu Provider-komponentin attribuutiksi <i>store</i>. 

Action creator -funktioiden määrittely on siirretty reducerin kanssa samaan tiedostoon <i>reducers/noteReducer.js</i> joka näyttää seuraavalta

```js
const noteReducer = (state = [], action) => {
  // ...
}

const generateId = () =>
  Number((Math.random() * 1000000).toFixed(0))

export const createNote = (content) => { // highlight-line
  return {
    type: 'NEW_NOTE',
    data: {
      content,
      important: false,
      id: generateId()
    }
  }
}

export const toggleImportanceOf = (id) => { // highlight-line
  return {
    type: 'TOGGLE_IMPORTANCE',
    data: { id }
  }
}

export default noteReducer
```

Moduulissa on nyt useita [export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export)-komentoja.

Reducer-funktio palautetaan edelleen komennolla <i>export default</i>. Tämän ansiosta reducer importataan tuttuun tapaan:

```js
import noteReducer from './reducers/noteReducer'
```

Moduulilla voi olla vain <i>yksi default export</i>, mutta useita "normaaleja" exporteja

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

Komponentin <i>App</i> koodi 

```js
import React from 'react'
import { 
  createNote, toggleImportanceOf
} from './reducers/noteReducer' 
import { useSelector, useDispatch } from 'react-redux'  // highlight-line


const App = () => {
  const dispatch = useDispatch()  // highlight-line
  const notes = useSelector(state => state)  // highlight-line

  const addNote = (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    dispatch(createNote(content))  // highlight-line
  }

  const toggleImportance = (id) => {
    dispatch(toggleImportanceOf(id)) // highlight-line
  }

  return (
    <div>
      <form onSubmit={addNote}>
        <input name="note" /> 
        <button type="submit">add</button>
      </form>
      <ul>
        {notes.map(note =>  // highlight-line
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

Komponentin koodissa on muutama mielenkiintoinen seikka. Aiemmin koodi hoiti actionien dispatchaamisen kutsumalla redux-storen metodia dispatch:

```js
store.dispatch({
  type: 'TOGGLE_IMPORTANCE',
  data: { id }
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

React-redux-kirjaston tarjoama <i>useDispatch</i>-hook siis tarjoaa mille tahansa React-komponentille pääsyn tiedostossa <i>index.js</i> määritellyn redux-storen dispatch-funktioon, jonka avulla komponentti pääsee tekemään muutoksia redux-storen tilaan.

Storeen talletettuihin muistiinpanoihin komponentti pääsee käsiksi react-redux-kirjaston [useSelector](https://react-redux.js.org/api/hooks#useselector)-hookin kautta:


```js
import { useSelector, useDispatch } from 'react-redux'  // highlight-line

const App = () => {
  // ...
  const notes = useSelector(state => state)  // highlight-line
  // ...
}
```

<i>useSelector</i> saa parametrikseen funktion, joka hakee tai valitsee (engl. select) tarvittavan datan redux-storesta. Tarvitsemme nyt kaikki muistiinpanot, eli selektorifunktiomme palauttaa koko staten, eli on muotoa 


```js
state => state
```

joka siis tarkoittaa samaa kuin

```js
(state) => {
  return state
}
```

Yleensä selektorifunktiot ovat mielenkiintoisempia, ja valitsevat vain osan redux-storen sisällöstä. Voisimme esimerkiksi hakea storesta ainoastaan tärkeät muistiinpanot seuraavasti

```js
const importantNotes = useSelector(state => state.filter(note => note.important))  
```

### Lisää komponentteja

Eriytetään uuden muistiinpanon luominen omaksi komponentiksi. 

```js
import React from 'react'
import { useDispatch } from 'react-redux' // highlight-line
import { createNote } from '../reducers/noteReducer' // highlight-line

const NewNote = (props) => {
  const dispatch = useDispatch() // highlight-line

  const addNote = (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    dispatch(createNote(content)) // highlight-line
  }

  return (
    <form onSubmit={addNote}>
      <input name="note" />
      <button type="submit">add</button>
    </form>
  )
}

export default NewNote
```

Toisin kuin aiemmin ilman Reduxia tekemässämme React-koodissa, sovelluksen tilaa (joka on nyt siis reduxissa) muuttava tapahtumankäsittelijä on siirretty pois <i>App</i>-komponentista, alikomponentin vastuulle. Itse tilaa muuttava logiikka on kuitenkin siististi reduxissa eristettynä koko sovelluksen React-osuudesta.

Eriytetään vielä muistiinpanojen lista ja yksittäisen muistiinpanon esittäminen omiksi komponenteikseen (jotka molemmat sijoitetaan tiedostoon <i>Notes.js</i>):

```js
import React from 'react'
import { useDispatch, useSelector } from 'react-redux' // highlight-line
import { toggleImportanceOf } from '../reducers/noteReducer' // highlight-line

const Note = ({ note, handleClick }) => {
  return(
    <li onClick={handleClick}>
      {note.content} 
      <strong> {note.important ? 'important' : ''}</strong>
    </li>
  )
}

const Notes = () => {
  const dispatch = useDispatch() // highlight-line
  const notes = useSelector(state => state) // highlight-line

  return(
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

export default Notes
```

Muistiinpanon tärkeyttä muuttava logiikka on nyt muistiinpanojen listaa hallinnoivalla komponentilla.

Komponenttiin <i>App</i> ei jää enää paljoa koodia:

```js
const App = () => {

  return (
    <div>
      <NewNote />
      <Notes  />
    </div>
  )
}
```

Yksittäisen muistiinpanon renderöinnistä huolehtiva <i>Note</i> on erittäin yksinkertainen, eikä ole tietoinen siitä, että sen propsina saama tapahtumankäsittelijä dispatchaa actionin. Tällaisia komponentteja kutsutaan Reactin terminologiassa [presentational](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)-komponenteiksi.

<i>Notes</i> taas on sellainen mitä kutsutaan [container](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)-komponenteiksi, se sisältää sovelluslogiikkaa, eli määrittelee mitä <i>Note</i>-komponenttien tapahtumankäsittelijät tekevät ja koordinoi <i>presentational</i>-komponenttien, eli <i>Notejen</i> konfigurointia.

Palaamme presentational/container-jakoon tarkemmin myöhemmin tässä osassa.

Redux-sovelluksen tämänhetkinen koodi on kokonaisuudessaan [githubissa](https://github.com/fullstack-hy2020/redux-notes/tree/part6-1), branchissa <i>part6-1</i>.

</div>

<div class="tasks">

### Tehtävät 6.3.-6.8.

Toteutetaan nyt versio toisesta ensimmäisen osan anekdoottien äänestyssovelluksesta. Ota ratkaisusi pohjaksi repositoriossa https://github.com/fullstack-hy2020/redux-anecdotes oleva projekti.

Jos kloonaat projektin olemassaolevan git-repositorion sisälle, <i>poista kloonatun sovelluksen git-konfiguraatio:</i>

```bash
cd redux-anecdotes  // mene kloonatun repositorion hakemistoon
rm -rf .git
```

Sovellus käynnistyy normaaliin tapaan, mutta joudut ensin asentamaan sovelluksen riippuvuudet:

```bash
npm install
npm start
```

Kun teet seuraavat tehtävät, tulisi sovelluksen näyttää seuraavalta

![](../../images/6/3.png)

#### 6.3: anekdootit, step1

Toteuta mahdollisuus anekdoottien äänestämiseen. Äänien määrä tulee tallettaa redux-storeen.

#### 6.4: anekdootit, step2

Tee sovellukseen mahdollisuus uusien anekdoottien lisäämiselle.

Voit pitää lisäyslomakkeen aiemman esimerkin tapaan [ei-kontrolloituna](/osa6/flux_arkkitehtuuri_ja_redux#ei-kontrolloitu-lomake).

#### 6.5*: anekdootit, step3

Huolehdi siitä, että anekdootit pysyvät äänten mukaisessa suuruusjärjestyksessä.

#### 6.6: anekdootit, step4

Jos et jo sitä tehnyt, eriytä action-olioiden luominen [action creator](https://redux.js.org/basics/actions#action-creators) -funktioihin ja sijoita ne tiedostoon <i>src/reducers/anecdoteReducer.js</i>. Eli toimi samalla tavalla kuin materiaali esimerkissä kohdasta [action creator](/osa6/flux_arkkitehtuuri_ja_redux#action-creatorit) alkaen on toimittu.

#### 6.7: anekdootit, step5

Eriytä uuden anekdootin luominen omaksi komponentikseen nimeltään <i>AnecdoteForm</i>. Siirrä kaikki anekdootin luomiseen liittyvä logiikka uuteen komponenttiin.

#### 6.8: anekdootit, step6

Eriytä anekdoottilistan näyttäminen omaksi komponentikseen nimeltään <i>AnecdoteList</i>. Siirrä kaikki anekdoottien äänestämiseen liittyvä logiikka uuteen komponenttiin.

Tämän tehtävän jälkeen komponentin <i>App</i> pitäisi näyttää seuraavalta:

```js
import React from 'react'
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
