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

### Datan hakeminen palvelimelta

Tehdään sitten tuttuun tapaan [Axiosia](https://axios-http.com/docs/intro) hyödyntävä backendistä dataa hakeva metodi tiedostoon <i>services/notes.js</i>:

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

Nopea tapa saada storen tila alustettua palvelimella olevan datan perusteella on hakea muistiinpanot tiedostossa <i>main.jsx</i> ja dispatchata niille yksitellen <em>appendNote</em>- action creatorin avulla:

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
  initialState: [],
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

Nyt <i>main.jsx</i> yksinkertaistuu:

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
> await toimii ainoastaan <i>async</i>-funktioiden sisällä, ja <i>main.jsx</i>:ssä oleva koodi ei ole funktiossa, joten päädyimme tilanteen yksinkertaisuuden takia tällä kertaa jättämään <i>async</i>:in käyttämättä.

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

### Datan lähettäminen palvelimelle

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
  createNew, // highlight-line
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

Koska backend generoi muistiinpanoille id:t, muutetaan tiedostossa <i>notesReducer.js</i> määritelty action creator <i>createNote</i> seuraavaan muotoon:

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

Hae sovelluksen käynnistyessä anekdootit JSON Serverillä toteutetusta backendistä.

Backendin alustavan sisällön saat esim. [täältä](https://github.com/fullstack-hy2020/misc/blob/master/anecdotes.json).

#### 6.15 anekdootit ja backend, step2

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
  }, []) 
  
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

Molemmat komponentit dispatchaisivat ainoastaan actionin välittämättä siitä, että taustalla tapahtuu todellisuudessa palvelimen kanssa tapahtuvaa kommunikointia. Tämän kaltaisten <i>asynkronisten actioneiden</i> käyttö onnistuu [Redux Thunk](https://github.com/reduxjs/redux-thunk)-kirjaston avulla. Kirjaston käyttö ei vaadi ylimääräistä konfiguraatiota eikä asennusta, kun Redux-store on luotu Redux Toolkitin <em>configureStore</em>-funktiolla.

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
import { initializeNotes } from './reducers/noteReducer' // highlight-line

// ...

const App = () => {
  const dispatch = useDispatch()

  // highlight-start
  useEffect(() => {
    dispatch(initializeNotes()) 
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
```

Ratkaisu on elegantti, sillä muistiinpanojen alustuslogiikka on eriytetty kokonaan React-komponenttien ulkopuolelle.

Korvataan seuraavaksi <em>createSlice</em>-funktion avulla toteutettu <em>createNote</em>- action creator saman nimisellä asynkronisella action creatorilla:  

```js
// ...
import noteService from '../services/notes'

const noteSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
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
    // createNote definition removed from here!
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

Periaate on jälleen sama. Ensin suoritetaan asynkroninen operaatio, ja sen valmistuttua <i>dispatchataan</i> storen tilaa muuttava action.

Komponentti <i>NewNote</i> yksinkertaistuu seuraavasti:

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

Äänestäminen ei vielä talleta muutoksia backendiin. Korjaa tilanne Redux Thunk ‑kirjastoa hyödyntäen.

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
