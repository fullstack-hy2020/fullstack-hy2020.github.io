---
mainImage: ../../../images/part-6.svg
part: 6
letter: c
lang: fi
---

<div class="content">

Laajennetaan sovellusta siten, että muistiinpanot talletetaan backendiin. Käytetään osasta 2 tuttua [JSON Serveriä](/osa2/palvelimella_olevan_datan_hakeminen).

Tallennetaan projektin juuren tiedostoon <i>db.json</i> tietokannan alkutila:

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
  "server": "json-server -p3001 --watch db.json",
  // ...
}
```

Käynnistetään JSON Server komennolla _npm run server_.

Tehdään sitten tuttuun tapaan <i>axiosia</i> hyödyntävä backendistä dataa hakeva metodi tiedostoon <i>services/notes.js</i>:

```js
import axios from 'axios'

const baseUrl = 'http://localhost:3001/notes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

export default { getAll }
```

Asennetaan myös axios projektiin:

```bash
npm install axios
```

Muutetaan <i>noteReducer</i>:issa tapahtuvaa muistiinpanojen tilan alustusta siten, että oletusarvoisesti muistiinpanoja ei ole:

```js
const noteSlice = createSlice({
  name: 'notes',
  initialState: [], // highlight-line
  // ...
})
```

Lisätään lisäksi uusi action <em>appendNote</em> muistiinpano-objektin lisäämistä varten:

```js
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
    },
    // highlight-start
    appendNote(state, action) {
      state.push(action.payload)
    }
    // highlight-end
  },
})

export const { createNote, toggleImportanceOf, appendNote } = noteSlice.actions // highlight-line

export default noteSlice.reducer
```

Nopea tapa saada storen tila alustettua palvelimella olevan datan perusteella on hakea muistiinpanot tiedostossa <i>index.js</i> ja dispatchata niille yksitellen <em>appendNote</em> -action creatorin avulla:

```js
// ...
import noteService from './services/notes' // highlight-line
import noteReducer, { appendNote } from './reducers/noteReducer' // highlight-line

const store = configureStore({
  reducer: {
    notes: noteReducer,
    filter: filterReducer,
  }
})

// highlight-start
noteService.getAll().then(notes =>
  notes.forEach(note => {
    store.dispatch(appendNote(note))
  })
)
// highlight-end

// ...
```

Monen actionin dispatchaaminen vaikuttaa hieman epäkäytännölliseltä. Lisätään action creator <em>setNotes</em>, jonka avulla muistiinpanojen taulukon voi suoraan korvata. Saamme <em>createSlice</em>-funktion avulla haluamamme action creatorin, kun määrittelemme <em>setNotes</em>-actionin:

```js
// ...

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
    },
    appendNote(state, action) {
      state.push(action.payload)
    },
    // highlight-start
    setNotes(state, action) {
      return action.payload
    }
    // highlight-end
  },
})

export const { createNote, toggleImportanceOf, appendNote, setNotes } = noteSlice.actions // highlight-line

export default noteSlice.reducer
```

Nyt <i>index.js</i> yksinkertaistuu:

```js
// ...
import noteService from './services/notes'
import noteReducer, { setNotes } from './reducers/noteReducer' // highlight-line

const store = configureStore({
  reducer: {
    notes: noteReducer,
    filter: filterReducer,
  }
})

noteService.getAll().then(notes =>
  store.dispatch(setNotes(notes)) // highlight-line
)
```

> **HUOM:** Miksi emme käyttäneet koodissa promisejen ja _then_-metodilla rekisteröidyn tapahtumankäsittelijän sijaan awaitia?
>
> await toimii ainoastaan <i>async</i>-funktioiden sisällä, ja <i>index.js</i>:ssä oleva koodi ei ole funktiossa, joten päädyimme tilanteen yksinkertaisuuden takia tällä kertaa jättämään <i>async</i>:in käyttämättä.

Päätetään kuitenkin siirtää muistiinpanojen alustus <i>App</i>-komponentiin, eli kuten yleensä dataa palvelimelta haettaessa, käytetään <i>effect hookia</i>:

```js
import { useEffect } from 'react' // highlight-line
import NewNote from './components/NewNote'
import Notes from './components/Notes'
import VisibilityFilter from './components/VisibilityFilter'
import noteService from './services/notes' // highlight-line
import { setNotes } from './reducers/noteReducer' // highlight-line
import { useDispatch } from 'react-redux' // highlight-line

const App = () => {
  // highlight-start
  const dispatch = useDispatch()
  useEffect(() => {
    noteService
      .getAll().then(notes => dispatch(setNotes(notes)))
  }, [])
  // highlight-end

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

Hookin useEffect käyttö aiheuttaa ESLint-varoituksen:

![Virheilmoitus React Hook useEffect has missing dependency: 'dispatch'](../../images/6/26ea.png)

Pääsemme varoituksesta eroon seuraavasti:

```js
const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    noteService
      .getAll().then(notes => dispatch(setNotes(notes)))
  }, [dispatch]) // highlight-line

  // ...
}
```

Nyt komponentin _App_ sisällä määritelty muuttuja <i>dispatch</i> eli käytännössä Redux-storen dispatch-funktio on lisätty useEffectille parametrina annettuun taulukkoon. **Jos** dispatch-muuttujan sisältö muuttuisi ohjelman suoritusaikana, suoritettaisiin efekti uudelleen. Näin ei kuitenkaan ole, eli varoitus on tässä tilanteessa oikeastaan aiheeton.

Toinen tapa päästä eroon varoituksesta olisi disabloida se kyseisen rivin kohdalta:

```js
const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    noteService
      .getAll().then(notes => dispatch(setNotes(notes)))   
      // highlight-start
  },[]) // eslint-disable-line react-hooks/exhaustive-deps  
  // highlight-end

  // ...
}
```

Yleisesti ottaen ESLint-virheiden disabloiminen ei ole hyvä idea, joten vaikka kyseisen ESLint-säännön tarpeellisuus onkin aiheuttanut [kiistelyä](https://github.com/facebook/create-react-app/issues/6880), pitäydytään ylemmässä ratkaisussa. 

Lisää hookien riippuvuuksien määrittelyn tarpeesta on [Reactin dokumentaatiossa](https://reactjs.org/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies).

Voimme toimia samoin myös uuden muistiinpanon luomisen suhteen. Laajennetaan palvelimen kanssa kommunikoivaa koodia:

```js
const baseUrl = 'http://localhost:3001/notes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

// highlight-start
const createNew = async (content) => {
  const object = { content, important: false }
  const response = await axios.post(baseUrl, object)
  return response.data
}
// highlight-end

export default {
  getAll,
  createNew,
}
```

Komponentin <i>NewNote</i> metodi _addNote_ muuttuu hiukan:

```js
import { useDispatch } from 'react-redux'
import { createNote } from '../reducers/noteReducer'
import noteService from '../services/notes' // highlight-line

const NewNote = (props) => {
  const dispatch = useDispatch()
  
  const addNote = async (event) => {
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

export default NewNote
```

Koska backend generoi muistiinpanoille id:t, muutetaan action <em>createNote</em> seuraavaan muotoon:

```js
createNote(state, action) {
  state.push(action.payload)
}
```

Muistiinpanojen tärkeyden muuttaminen olisi mahdollista toteuttaa samalla periaatteella, eli tehdä palvelimelle ensin asynkroninen metodikutsu ja sen jälkeen dispatchata sopiva action.

Sovelluksen tämänhetkinen koodi on [GitHubissa](https://github.com/fullstack-hy2020/redux-notes/tree/part6-3) branchissa <i>part6-3</i>.

</div>

<div class="tasks">

### Tehtävät 6.13.-6.14.

#### 6.13 anekdootit ja backend, step1

Hae sovelluksen käynnistyessä anekdootit JSON Serverillä toteutetusta backendistä.

Backendin alustavan sisällön saat esim. [täältä](https://github.com/fullstack-hy2020/misc/blob/master/anecdotes.json).

#### 6.14 anekdootit ja backend, step2

Muuta uusien anekdoottien luomista siten, että anekdootit talletetaan backendiin.

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
const NewNote = () => {
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

Molemmat komponentit dispatchaisivat ainoastaan actionin välittämättä siitä, että taustalla tapahtuu todellisuudessa palvelimen kanssa tapahtuvaa kommunikointia. Tämän kaltaisten <i>asynkronisten actioneiden</i> käyttö onnistuu [Redux Thunk](https://github.com/reduxjs/redux-thunk)-kirjaston avulla. Kirjaston käyttö ei vaadi ylimääräistä konfiguraatiota, kun Redux-store on luotu Redux Toolkitin <em>configureStore</em>-funktiolla.

Asennetaan kirjasto:

```
npm install redux-thunk
```

Redux Thunkin ansiosta on mahdollista määritellä <i>action creatoreja</i>, jotka palauttavat objektin sijaan funktion. Tämän funktion parametreina ovat Redux-storen <em>dispatch</em>- ja <em>getState</em>-metodi. Tämän ansiosta on mahdollista toteuttaa asynkronisia action creatoreja, jotka ensin odottavat jonkin asynkronisen toimenpiteen valmistumista ja vasta sen jälkeen dispatchaavat varsinaisen actionin.

Voimme nyt määritellä muistiinpanojen alkutilan palvelimelta hakevan action creatorin <em>initializeNotes</em> seuraavasti:

```js
// ...
import noteService from '../services/notes' // highlight-line

const noteSlice = createSlice(/* ... */)

export const { createNote, toggleImportanceOf, setNotes, appendNote } = noteSlice.actions

// highlight-start
export const initializeNotes = () => {
  return async dispatch => {
    const notes = await noteService.getAll()
    dispatch(setNotes(notes))
  }
}
// highlight-end

export default noteSlice.reducer
```

Sisemmässä funktiossaan eli <i>asynkronisessa actionissa</i> operaatio hakee ensin palvelimelta kaikki muistiinpanot ja sen jälkeen <i>dispatchaa</i> muistiinpanot storeen lisäävän actionin, <em>setNotes</em>.

Komponentti <i>App</i> voidaan nyt määritellä seuraavasti:

```js
const App = () => {
  const dispatch = useDispatch()

  // highlight-start
  useEffect(() => {
    dispatch(initializeNotes()) 
  }, [dispatch]) 
  // highlight-end

  return (
    <div>
      <NewNote />
      <VisibilityFilter />
      <Notes />
    </div>
  )
}
```

Ratkaisu on elegantti, sillä muistiinpanojen alustuslogiikka on eriytetty kokonaan React-komponenttien ulkopuolelle.

Korvataan seuraavaksi <em>createSlice</em>-funktion avulla toteutettu <em>createNote</em> -action creator saman nimisellä asynkronisella action creatorilla:  

```js
// ...
import noteService from '../services/notes'

const noteSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    // highlight-start
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
    },
    appendNote(state, action) {
      state.push(action.payload)
    },
    setNotes(state, action) {
      return action.payload
    }
    // highlight-end
  },
})

export const { toggleImportanceOf, appendNote, setNotes } = noteSlice.actions // highlight-line

export const initializeNotes = () => {
  return async dispatch => {
    const notes = await noteService.getAll()
    dispatch(setNotes(notes))
  }
}

// highlight-start
export const createNote = content => {
  return async dispatch => {
    const newNote = await noteService.createNew(content)
    dispatch(appendNote(newNote))
  }
}
// highlight-end

export default noteSlice.reducer
```

Periaate on jälleen sama. Ensin suoritetaan asynkroninen operaatio, ja sen valmistuttua <i>dispatchataan</i> storen tilaa muuttava action. Redux Toolkit tarjoaa monia työkaluja asynkronisen tilanhallinnan helpottamiseksi. Tähän käyttötarkoitukseen soveltuvat mm. [createAsyncThunk](https://redux-toolkit.js.org/api/createAsyncThunk)-funktio ja [RTK Query](https://redux-toolkit.js.org/rtk-query/overview) -API.

Komponentti <i>NewNote</i> muuttuu seuraavasti:

```js
const NewNote = () => {
  const dispatch = useDispatch()
  
  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    dispatch(createNote(content)) //highlight-line
  }

  return (
    <form onSubmit={addNote}>
      <input name="note" />
      <button type="submit">add</button>
    </form>
  )
}
```

Siistitään lopuksi vielä hieman <i>index.js</i>-tiedostoa siirtämällä Redux-storen luontiin liittyvä koodi erilliseen <i>store.js</i>-tiedostoon:

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

Muutosten jälkeen <i>index.js</i>-tiedosto näyttää seuraavalta:

```js
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux' 
import store from './store' // highlight-line
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

Sovelluksen tämänhetkinen koodi on [GitHubissa](https://github.com/fullstack-hy2020/redux-notes/tree/part6-4) branchissa <i>part6-4</i>.

</div>

<div class="tasks">

### Tehtävät 6.15.-6.18.

#### 6.15 anekdootit ja backend, step3

Muuta Redux-storen alustus tapahtumaan Redux Thunk -kirjaston avulla toteutettuun asynkroniseen actioniin.

#### 6.16 anekdootit ja backend, step4

Muuta myös uuden anekdootin luominen tapahtumaan Redux Thunk -kirjaston avulla toteutettuihin asynkronisiin actioneihin.

#### 6.17 anekdootit ja backend, step5

Äänestäminen ei vielä talleta muutoksia backendiin. Korjaa tilanne Redux Thunk -kirjastoa hyödyntäen.

#### 6.18 anekdootit ja backend, step6

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
