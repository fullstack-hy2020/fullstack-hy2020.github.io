---
mainImage: ../../../images/part-6.svg
part: 6
letter: c
lang: fi
---

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
