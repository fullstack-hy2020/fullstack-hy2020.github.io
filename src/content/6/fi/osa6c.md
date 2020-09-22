---
mainImage: ../../../images/part-6.svg
part: 6
letter: c
lang: fi
---

<div class="content">

Laajennetaan sovellusta siten, että muistiinpanot talletetaan backendiin. Käytetään osasta 2 tuttua [json-serveriä](/osa2/palvelimella_olevan_datan_hakeminen).

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

Asennetaan projektiin json-server

```bash
npm install json-server
```

ja lisätään tiedoston <i>package.json</i> osaan <i>scripts</i> rivi

```js
"scripts": {
  "server": "json-server -p3001 --watch db.json",
  // ...
}
```

Käynnistetään json-server komennolla _npm run server_.

Tehdään sitten tuttuun tapaan <i>axiosia</i> hyödyntävä backendistä dataa hakeva metodi tiedostoon <i>services/notes.js</i>

```js
import axios from 'axios'

const baseUrl = 'http://localhost:3001/notes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

export default { getAll }
```

Asennetaan myös axios projektiin

```bash
npm install axios
```

Muutetaan <i>nodeReducer</i>:issa tapahtuva muistiinpanojen tilan alustusta, siten että oletusarvoisesti muistiinpanoja ei ole:

```js
const noteReducer = (state = [], action) => {
  // ...
};
```

Nopea tapa saada storen tila alustettua palvelimella olevan datan perusteella on hakea muistiinpanot tiedostossa <i>index.js</i> ja dispatchata niille yksitellen action <i>NEW\_NOTE</i>:

```js
// ...
import noteService from './services/notes' // highlight-line

const reducer = combineReducers({
  notes: noteReducer,
  filter: filterReducer,
});

const store = createStore(reducer);

// highlight-start
noteService.getAll().then(notes =>
  notes.forEach(note => {
    store.dispatch({ type: 'NEW_NOTE', data: note })
  })
)
// highlight-end

// ...
```

Lisätään reduceriin tuki actionille <i>INIT\_NOTES</i>, jonka avulla alustus voidaan tehdä dispatchaamalla yksittäinen action. Luodaan myös sitä varten oma action creator -funktio _initializeNotes_:

```js
// ...
const noteReducer = (state = [], action) => {
  console.log('ACTION:', action)
  switch (action.type) {
    case 'NEW_NOTE':
      return [...state, action.data]
    case 'INIT_NOTES':   // highlight-line
      return action.data // highlight-line
    // ...
  }
}

export const initializeNotes = (notes) => {
  return {
    type: 'INIT_NOTES',
    data: notes,
  }
}

// ...
```

<i>index.js</i> yksinkertaistuu:

```js
import noteReducer, { initializeNotes } from './reducers/noteReducer'
// ...

noteService.getAll().then(notes =>
  store.dispatch(initializeNotes(notes))
)
```

> **HUOM:** miksi emme käyttäneet koodissa promisejen ja _then_-metodilla rekisteröidyn tapahtumankäsittelijän sijaan awaitia?
>
> await toimii ainoastaan <i>async</i>-funktioiden sisällä, ja <i>index.js</i>:ssä oleva koodi ei ole funktiossa, joten päädyimme tilanteen yksinkertaisuuden takia tällä kertaa jättämään <i>async</i>:in käyttämättä.

Päätetään kuitenkin siirtää muistiinpanojen alustus <i>App</i>-komponentiin, eli kuten yleensä dataa palvelimelta haettaessa, käytetään <i>effect hookia</i>:

```js
import React, {useEffect} from 'react' // highlight-line
import NewNote from './components/NowNote'
import Notes from './components/Notes'
import VisibilityFilter from './components/VisibilityFilter'
import noteService from './services/notes'
import { initializeNotes } from './reducers/noteReducer' // highlight-line
import { useDispatch } from 'react-redux' // highlight-line

const App = () => {
  const dispatch = useDispatch()
  // highlight-start
  useEffect(() => {
    noteService
      .getAll().then(notes => dispatch(initializeNotes(notes)))
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

Hookin useEffect käyttö aiheuttaa eslint-varoituksen:

![](../../images/6/26ea.png)

Pääsemme varoituksesta eroon seuraavasti:

```js
const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    noteService
      .getAll().then(notes => dispatch(initializeNotes(notes)))
  }, [dispatch]) // highlight-line

  // ...
}
```

Nyt komponentin _App_ sisällä määritelty muuttuja <i>dispatch</i> eli käytännössä redux-storen dispatch-funktio on lisätty useEffectille parametrina annettuun taulukkoon. **Jos** dispatch-muuttujan sisältö muuttuisi ohjelman suoritusaikana, suoritettaisiin efekti uudelleen, näin ei kuitenkaan ole, eli varoitus on tässä tilanteessa oikeastaan aiheeton.

Toinen tapa päästä eroon varoituksesta olisi disabloida se kyseisen rivin kohdalta:

```js
const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    noteService
      .getAll().then(notes => dispatch(initializeNotes(notes)))   
      // highlight-start
  },[]) // eslint-disable-line react-hooks/exhaustive-deps  
  // highlight-end

  // ...
}
```

Yleisesti ottaen eslint-virheiden disabloiminen ei ole hyvä idea, joten vaikka kyseisen eslint-säännön tarpeellisuus onkin aiheuttanut [kiistelyä](https://github.com/facebook/create-react-app/issues/6880), pitäydytään ylemmässä ratkaisussa. 

Lisää hookien riippuvuuksien määrittelyn tarpeesta [reactin dokumentaatiossa](https://reactjs.org/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies).


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
import React from 'react'
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

Koska backend generoi muistiinpanoille id:t, muutetaan action creator _createNote_ muotoon

```js
export const createNote = (data) => {
  return {
    type: 'NEW_NOTE',
    data,
  }
}
```

Muistiinpanojen tärkeyden muuttaminen olisi mahdollista toteuttaa samalla periaatteella, eli tehdä palvelimelle ensin asynkroninen metodikutsu ja sen jälkeen dispatchata sopiva action.

Sovelluksen tämänhetkinen koodi on [githubissa](https://github.com/fullstack-hy2020/redux-notes/tree/part6-3) branchissa <i>part6-3</i>.

</div>

<div class="tasks">

### Tehtävät 6.13.-6.14.

#### 6.13 anekdootit ja backend, step1

Hae sovelluksen käynnistyessä anekdootit json-serverillä toteutetusta backendistä.

Backendin alustavan sisällön saat esim. [täältä](https://github.com/fullstack-hy2020/misc/blob/master/anecdotes.json).

#### 6.14 anekdootit ja backend, step2

Muuta uusien anekdoottien luomista siten, että anekdootit talletetaan backendiin.

</div>

<div class="content">

### Asynkroniset actionit ja redux thunk

Lähestymistapamme on ok, mutta siinä mielessä ikävä, että palvelimen kanssa kommunikointi tapahtuu komponenttien funktioissa. Olisi parempi, jos kommunikointi voitaisiin abstrahoida komponenteilta siten, että niiden ei tarvitsisi kuin kutsua sopivaa <i>action creatoria</i>, esim. <i>App</i> alustaisi sovelluksen tilan seuraavasti:

```js
const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeNotes())
  },[dispatch]) 
  
  // ...
}
```

ja <i>NoteForm</i> loisi uuden muistiinpanon seuraavasti:

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

Molemmat komponentit dispatchaisivat ainoastaan actionin, välittämättä siitä että taustalla tapahtuu todellisuudessa palvelimen kanssa tapahtuvaa kommunikointia.

Asennetaan nyt [redux-thunk](https://github.com/gaearon/redux-thunk)-kirjasto, joka mahdollistaa <i>asynkronisten actionien</i> luomisen. Asennus tapahtuu komennolla:

```bash
npm install redux-thunk
```

redux-thunk-kirjasto on ns. <i>redux-middleware</i> joka täytyy ottaa käyttöön storen alustuksen yhteydessä. Eriytetään samalla storen määrittely omaan tiedostoon <i>src/store.js</i>:

```js
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import noteReducer from './reducers/noteReducer'
import filterReducer from './reducers/filterReducer'

const reducer = combineReducers({
  notes: noteReducer,
  filter: filterReducer,
})

const store = createStore(
  reducer,
  composeWithDevTools(
    applyMiddleware(thunk)
  )
)

export default store
```

Tiedosto <i>src/index.js</i> on muutoksen jälkeen seuraava

```js
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux' 
import store from './store' // highlight-line
import App from './App'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

redux-thunkin ansiosta on mahdollista määritellä <i>action creatoreja</i> siten, että ne palauttavat funktion, jonka parametrina on redux-storen <i>dispatch</i>-metodi. Tämän ansiosta on mahdollista tehdä asynkronisia action creatoreja, jotka ensin odottavat jonkin toimenpiteen valmistumista ja vasta sen jälkeen dispatchaavat varsinaisen actionin.

Voimme nyt määritellä muistiinpanojen alkutilan palvelimelta hakevan action creatorin <i>initializeNotes</i> seuraavasti:

```js
export const initializeNotes = () => {
  return async dispatch => {
    const notes = await noteService.getAll()
    dispatch({
      type: 'INIT_NOTES',
      data: notes,
    })
  }
}
```

Sisemmässä funktiossaan, eli <i>asynkronisessa actionissa</i> operaatio hakee ensin palvelimelta kaikki muistiinpanot ja sen jälkeen <i>dispatchaa</i> muistiinpanot storeen lisäävän actionin.

Komponentti <i>App</i> voidaan nyt määritellä seuraavasti:

```js
const App = () => {
  const dispatch = useDispatch()

  // highlight-start
  useEffect(() => {
    dispatch(initializeNotes()) 
  },[dispatch]) 
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

Ratkaisu on elegantti, muistiinpanojen alustuslogiikka on eriytetty kokonaan React-komponenttien ulkopuolelle.

Uuden muistiinpanon lisäävä action creator _createNote_ on seuraavassa

```js
export const createNote = content => {
  return async dispatch => {
    const newNote = await noteService.createNew(content)
    dispatch({
      type: 'NEW_NOTE',
      data: newNote,
    })
  }
}
```

Periaate on jälleen sama, ensin suoritetaan asynkroninen operaatio, ja sen valmistuttua <i>dispatchataan</i> storen tilaa muuttava action.

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
      <button type="submit">lisää</button>
    </form>
  )
}
```

Sovelluksen tämänhetkinen koodi on [githubissa](https://github.com/fullstack-hy2020/redux-notes/tree/part6-4) branchissa <i>part6-4</i>.

</div>

<div class="tasks">

### Tehtävät 6.15.-6.18.

#### 6.15 anekdootit ja backend, step3

Muuta redux-storen alustus tapahtumaan <i>redux-thunk</i>-kirjaston avulla toteutettuun asynkroniseen actioniin.

#### 6.16 anekdootit ja backend, step4

Muuta myös uuden anekdootin luominen tapahtumaan <i>redux-thunk</i>-kirjaston avulla toteutettuihin asynkronisiin actioneihin.


#### 6.17 anekdootit ja backend, step5

Äänestäminen ei vielä talleta muutoksia backendiin. Korjaa tilanne <i>redux-thunk</i>-kirjastoa hyödyntäen.

#### 6.18 anekdootit ja backend, step6

Notifikaatioiden tekeminen on nyt hieman ikävää, sillä se edellyttää kahden actionin tekemistä ja _setTimeout_-funktion käyttöä:

```js
dispatch(setNotification(`new anecdote '${content}'`))
setTimeout(() => {
  dispatch(clearNotification())
}, 5000)
```

Tee asynkroninen action creator, joka mahdollistaa notifikaation antamisen seuraavasti:

```js
dispatch(setNotification(`you voted '${anecdote.content}'`, 10))
```

eli ensimmäisenä parametrina on renderöitävä teksti ja toisena notifikaation näyttöaika sekunneissa.

Ota paranneltu notifikaatiotapa käyttöön sovelluksessasi.

</div>
