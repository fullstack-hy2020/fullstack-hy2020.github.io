---
mainImage: ../../../images/part-6.svg
part: 6
letter: b
lang: fi
---

<div class="content">

Jatketaan muistiinpanosovelluksen yksinkertaistetun [Redux-version](/osa6/flux_arkkitehtuuri_ja_redux#redux-muistiinpanot) laajentamista.

Sovelluskehitystä helpottaaksemme laajennetaan reduceria siten, että storelle määritellään alkutila, jossa on pari muistiinpanoa:

```js
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

const noteReducer = (state = initialState, action) => {
  // ...
}

// ...
export default noteReducer
```

### Monimutkaisempi tila storessa

Toteutetaan sovellukseen näytettävien muistiinpanojen filtteröinti, jonka avulla näytettäviä muistiinpanoja voidaan rajata. Filtterin toteutus tapahtuu [radiopainikkeiden](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio) avulla:

![Sivun alussa lomake muistiinpanon lisäämiseen (syötekenttä ja nappi add). Tämän jälkeen radiopainikevalinta mitkä muistiinpanot näytetään, vaihtoehdot all, important ja noimportant. Näiden alle renderöidän kaikki muistiinpanot ja niiden yhteyteen teksti important jos muistiinpano merkattu tärkeäksi. ](../../images/6/01e.png)

Aloitetaan todella suoraviivaisella toteutuksella:

```js
import NewNote from './components/NewNote'
import Notes from './components/Notes'

const App = () => {
//highlight-start
  const filterSelected = (value) => {
    console.log(value)
  }
//highlight-end

  return (
    <div>
      <NewNote />
        //highlight-start
      <div>
        all          <input type="radio" name="filter"
          onChange={() => filterSelected('ALL')} />
        important    <input type="radio" name="filter"
          onChange={() => filterSelected('IMPORTANT')} />
        nonimportant <input type="radio" name="filter"
          onChange={() => filterSelected('NONIMPORTANT')} />
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

Voisimme periaatteessa muokata jo olemassaolevaa reduceria ottamaan huomioon muuttuneen tilanteen. Parempi ratkaisu on kuitenkin määritellä tässä tilanteessa uusi, filtterin arvosta huolehtiva reduceri:

```js
const filterReducer = (state = 'ALL', action) => {
  switch (action.type) {
    case 'SET_FILTER':
      return action.filter
    default:
      return state
  }
}
```

Filtterin arvon asettavat actionit ovat siis muotoa:

```js
{
  type: 'SET_FILTER',
  filter: 'IMPORTANT'
}
```

Määritellään samalla myös sopiva _action creator_ -funktio. Sijoitetaan koodi moduuliin <i>src/reducers/filterReducer.js</i>:

```js
const filterReducer = (state = 'ALL', action) => {
  // ...
}

export const filterChange = filter => {
  return {
    type: 'SET_FILTER',
    filter,
  }
}

export default filterReducer
```

Saamme nyt muodostettua varsinaisen reducerin yhdistämällä kaksi olemassaolevaa reduceria funktion [combineReducers](https://redux.js.org/api/combinereducers) avulla.

Määritellään yhdistetty reducer tiedostossa <i>index.js</i>:

```js
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createStore, combineReducers } from 'redux' // highlight-line
import { Provider } from 'react-redux' 
import App from './App'

import noteReducer from './reducers/noteReducer'
import filterReducer from './reducers/filterReducer' // highlight-line

 // highlight-start
const reducer = combineReducers({
  notes: noteReducer,
  filter: filterReducer
})
 // highlight-end

const store = createStore(reducer)

console.log(store.getState())

ReactDOM.createRoot(document.getElementById('root')).render(
  /*
  <Provider store={store}>
    <App />
  </Provider>,
  */
  <div />,
  document.getElementById('root')
)
```

Koska sovelluksemme hajoaa tässä vaiheessa täysin, komponentin <i>App</i> sijasta renderöidään tyhjä <i>div</i>-elementti.

Konsoliin tulostuu storen tila:

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

Ennen muun koodin muutoksia kokeillaan vielä konsolista, miten actionit muuttavat yhdistetyn reducerin muodostamaa staten tilaa. Lisätään seuraavat tiedostoon <i>index.js</i>:

```js
import { createNote } from './reducers/noteReducer'
import { filterChange } from './reducers/filterReducer'
//...
store.subscribe(() => console.log(store.getState()))
store.dispatch(filterChange('IMPORTANT'))
store.dispatch(createNote('combineReducers forms one reducer from many simple reducers'))
```

Kun simuloimme näin filtterin tilan muutosta ja muistiinpanon luomista, konsoliin tulostuu storen tila jokaisen muutoksen jälkeen:

![Storen filter-arvoksi muuttuu ensin IMPORTANT, tämän jäleen storen notesiin tulee uusi muistiinpano](../../images/6/5e.png)

Jo tässä vaiheessa kannattaa laittaa mieleen eräs tärkeä detalji. Lisätään <i>molempien reducerien alkuun</i> konsoliin tulostus:

```js
const filterReducer = (state = 'ALL', action) => {
  console.log('ACTION: ', action)
  // ...
}
```

Nyt konsolin perusteella näyttää siltä, että jokainen action kahdentuu:

![Konsolin tulostus paljastaa että sekä noteReducer että filterReducer käsittelevät jokaisen actionin](../../images/6/6.png)

Onko koodissa bugi? Ei. Yhdistetty reducer toimii siten, että jokainen <i>action</i> käsitellään <i>kaikissa</i> yhdistetyn reducerin osissa. Usein tietystä actionista on kiinnostunut vain yksi reducer, mutta on kuitenkin tilanteita, joissa useampi reducer muuttaa hallitsemaansa staten tilaa jonkin actionin seurauksena.

### Filtteröinnin viimeistely

Viimeistellään nyt sovellus käyttämään yhdistettyä reduceria, eli palautetaan tiedostossa <i>index.js</i> suoritettava renderöinti seuravaan muotoon:

```js
ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

Korjataan sitten bugi, joka johtuu siitä, että koodi olettaa storen tilan olevan mustiinpanot tallettava taulukko:

![komennon notes.map(note => ...) suoritus aiheuttaa virheen TypeError notes.map is not a function)](../../images/6/7ea.png)

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

Eriytetään näkyvyyden säätelyfiltteri omaksi, tiedostoon <i>src/components/VisibilityFilter.js</i> sijoitettavaksi komponentiksi:

```js
import { filterChange } from '../reducers/filterReducer'
import { useDispatch } from 'react-redux'

const VisibilityFilter = (props) => {
  const dispatch = useDispatch()

  return (
    <div>
      all    
      <input 
        type="radio" 
        name="filter" 
        onChange={() => dispatch(filterChange('ALL'))}
      />
      important   
      <input
        type="radio"
        name="filter"
        onChange={() => dispatch(filterChange('IMPORTANT'))}
      />
      nonimportant 
      <input
        type="radio"
        name="filter"
        onChange={() => dispatch(filterChange('NONIMPORTANT'))}
      />
    </div>
  )
}

export default VisibilityFilter
```

Toteutus on suoraviivainen - radiopainikkeen klikkaaminen muuttaa storen kentän <i>filter</i> tilaa.

Komponentti <i>App</i> yksinkertaisuu nyt seuraavasti:

```js
import Notes from './components/Notes'
import NewNote from './components/NewNote'
import VisibilityFilter from './components/VisibilityFilter'

const App = () => {
  return (
    <div>
      <NewNote />
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
    if ( state.filter === 'ALL' ) {
      return state.notes
    }
    return state.filter  === 'IMPORTANT' 
      ? state.notes.filter(note => note.important)
      : state.notes.filter(note => !note.important)
  })
  // highlight-end

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

### Redux Toolkit

Kuten olemme jo tähän asti huomanneet, Reduxin konfigurointi ja tilanhallinnan toteutus vaativat melko paljon vaivannäköä. Tämä ilmenee esimerkiksi reducereiden ja action creatorien koodista, jossa on jonkin verran toistoa. [Redux Toolkit](https://redux-toolkit.js.org/) on kirjasto, joka soveltuu näiden yleisten Reduxin käyttöön liittyvien ongelmien ratkaisemiseen. Kirjaston käyttö mm. yksinkertaistaa huomattavasti Redux-storen luontia ja tarjoaa suuren määrän tilanhallintaa helpottavia työkaluja.

Otetaan Redux Toolkit käyttöön sovelluksessamme refaktoroimalla nykyistä koodia. Aloitetaan kirjaston asennuksella:

```
npm install @reduxjs/toolkit
```

Avataan sen jälkeen <i>index.js</i>-tiedosto, jossa nykyinen Redux-store luodaan. Käytetään storen luonnissa Reduxin <em>createStore</em>-funktion sijaan Redux Toolkitin [configureStore](https://redux-toolkit.js.org/api/configureStore)-funktiota:

```js
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit' // highlight-line
import App from './App'

import noteReducer from './reducers/noteReducer'
import filterReducer from './reducers/filterReducer'

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
  </Provider>,
  document.getElementById('root')
)
```

Pääsimme eroon jo muutamasta koodirivistä, kun reducerin muodostamiseen ei enää tarvita <em>combineReducers</em>-funktiota. Tulemme pian näkemään, että <em>configureStore</em>-funktion käytöstä on myös monia muita hyötyjä, kuten kehitystyökalujen ja usein käytettyjen kirjastojen vaivaton käyttöönotto ilman erillistä konfiguraatiota.

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
```

<em>createSlice</em>-funktion <em>name</em>-parametri määrittelee etuliitteen, jota käytetään actioneiden type-arvoissa. Esimerkiksi myöhemmin määritelty <em>createNote</em>-action saa type-arvon <em>notes/createNote</em>. Parametrin arvona on hyvä käyttää muiden reducereiden kesken uniikkia nimeä, jotta sovelluksen actioneiden type-arvoissa ei tapahtuisi odottamattomia yhteentörmäyksiä. Parametri <em>initialState</em> määrittelee reducerin alustavan tilan. Parametri <em>reducers</em> määrittelee itse reducerin objektina, jonka funktiot käsittelevät tietyn actionin aiheuttamat tilamuutokset. Huomaa, että funktioissa <em>action.payload</em> sisältää action creatorin kutsussa annetun argumentin:

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

Huomaa, että tilaa voi muuttaa myös "mutatoimatta" kuten esimerkiksi <em>toggleImportanceOf</em> -actionin kohdalla on tehty. Tällöin funktio palauttaa uuden tilan. Mutatointi osoittautuu kuitenkin usein hyödylliseksi etenkin rakenteeltaan monimutkaisen tilan päivittämisessä.

Funktio <em>createSlice</em> palauttaa objektin, joka sisältää sekä reducerin että <em>reducers</em>-parametrin actioneiden mukaiset action creatorit. Reducer on palautetussa objektissa <em>noteSlice.reducer</em>-kentässä kun taas action creatorit ovat <em>noteSlice.actions</em>-kentässä. Voimme muodostaa tiedoston exportit kätevästi:

```js
const noteSlice = createSlice(/* ... */)

// highlight-start
export const { createNote, toggleImportanceOf } = noteSlice.actions

export default noteSlice.reducer
// highlight-end
```

Importit toimivat muissa tiedostoissa tavalliseen tapaan:

```js
import noteReducer, { createNote, toggleImportanceOf } from './reducers/noteReducer'
```

Joudumme hieman muuttamaan testiemme rakennetta Redux Toolkitin nimeämiskäytäntöjen takia:

```js 
import noteReducer from './noteReducer'
import deepFreeze from 'deep-freeze'

describe('noteReducer', () => {
  test('returns new state with action notes/createNote', () => {
    const state = []
    const action = {
      type: 'notes/createNote', // highlight-line
      payload: 'the app state is in redux store', // highlight-line
    }

    deepFreeze(state)
    const newState = noteReducer(state, action)

    expect(newState).toHaveLength(1)
    expect(newState.map(s => s.content)).toContainEqual(action.payload) // highlight-line
  })

  test('returns new state with action notes/toggleImportanceOf', () => {
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
})
```

### Redux DevTools

Chromeen on asennettavissa [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=fi) -lisäosa, jonka avulla Redux-storen tilaa ja sitä muuttavia actioneja on mahdollisuus seurata selaimen konsolista. Redux Toolkitin <em>configureStore</em>-funktion avulla luodussa storessa Redux DevTools on käytössä automaattisesti ilman ylimääräistä konfigurointia.

Kun lisäosa on asennettu Chromeen, konsolin <i>Redux</i>-välilehti pitäisi näyttää seuraavalta:

![Redux DevToolsin oikea puoli "State" näyttää storen alkutilan](../../images/6/11ea.png)

Kunkin actionin storen tilaan aiheuttamaa muutosta on helppo tarkastella:

![edux DevToolsin vasen puoli näyttää suoritetut actionit, muuttunut tila heijastuu oikealle puolelle](../../images/6/12ea.png)

Konsolin avulla on myös mahdollista dispatchata actioneja storeen:

![Mahdollisuus actionien dispatchaamiseen avautuu alalaidan valinnoista](../../images/6/13ea.png)

Sovelluksen tämänhetkinen koodi on [GitHubissa](https://github.com/fullstack-hy2020/redux-notes/tree/part6-2) branchissa </i>part6-2</i>.

</div>

<div class="tasks">

### Tehtävät 6.9-6.12

Jatketaan tehtävässä 6.3 aloitetun Reduxia käyttävän anekdoottisovelluksen parissa.

#### 6.9 anekdootit, step7

Asenna projektiin Redux Toolkit. Siirrä tämän jälkeen Redux-storen määrittely omaan tiedostoon <i>store.js</i> ja hyödynnä sen luonnissa Redux Toolkitin <em>configureStore</em>-funktiota. Ota myös käyttöön Redux DevTools sovelluksen tilan debuggaamisen helpottamiseksi.

#### 6.10 anekdootit, step8

Sovelluksessa on valmiina komponentin <i>Notification</i> runko:

```js
const Notification = () => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  return (
    <div style={style}>
      render here notification...
    </div>
  )
}

export default Notification
```

Laajenna komponenttia siten, että se renderöi Redux-storeen talletetun viestin, eli renderöitävä komponentti muuttuu muotoon:

```js
import { useSelector } from 'react-redux' // highlight-line

const Notification = () => {
  const notification = useSelector(/* something here */) // highlight-line
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  return (
    <div style={style}>
      {notification} // highlight-line
    </div>
  )
}
```

Joudut siis muuttamaan ja laajentamaan sovelluksen olemassaolevaa reduceria. Tee toiminnallisuutta varten oma reduceri. Hyödynnä tässä Redux Toolkitin <em>createSlice</em>-funktiota. Siirry käyttämään sovelluksessa yhdistettyä reduceria tämän osan materiaalin tapaan.

Tässä vaiheessa sovelluksen ei vielä tarvitse osata käyttää <i>Notification</i>-komponenttia järkevällä tavalla, vaan riittää että sovellus toimii ja näyttää <i>notificationReducerin</i> alkuarvoksi asettaman viestin.

#### 6.11 paremmat anekdootit, step9

Laajenna sovellusta siten, että se näyttää <i>Notification</i>-komponentin avulla viiden sekunnin ajan, kun sovelluksessa äänestetään tai luodaan uusia anekdootteja:

![Äänestyksen yhteydessä näytetään notifikaatio: you voted 'if it hurts, do it more often'](../../images/6/8ea.png)

Notifikaation asettamista ja poistamista varten kannattaa toteuttaa [action creatorit](https://redux-toolkit.js.org/api/createSlice#reducers).

#### 6.12* paremmat anekdootit, step10

Toteuta sovellukseen näytettävien muistiinpanojen filtteröiminen:

![Yläosaan lisätään tekstikenttä, johon kirjoittamalla voidaan rajoittaa näytettävät anekdootit niihin joihin sisältyy "filtterikenttään" kirjoitettu merkkijono](../../images/6/9ea.png)

Säilytä filtterin tila Redux-storessa. Käytännössä kannattaa siis jälleen luoda uusi reducer ja action creatorit. Hyödynnä tässä Redux Toolkitin <em>createSlice</em>-funktiota.

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
