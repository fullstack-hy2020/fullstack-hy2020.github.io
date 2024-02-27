---
mainImage: ../../../images/part-6.svg
part: 6
letter: c
lang: fr
---

<div class="content">

Étendons l'application afin que les notes soient stockées dans le backend. Nous utiliserons [json-server](/fr/part2/obtenir_des_donnees_du_serveur), déjà connu de la partie 2.

L'état initial de la base de données est stocké dans le fichier <i>db.json</i>, qui est placé à la racine du projet:

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

Nous installerons json-server pour le projet:

```js
npm install json-server --save-dev
```

et ajoutez la ligne suivante à la partie <i>scripts</i> du fichier <i>package.json</i>

```js
"scripts": {
  "server": "json-server -p3001 --watch db.json",
  // ...
}
```

Maintenant, lançons json-server avec la commande _npm run server_.

### Récupération des données depuis le backend

Ensuite, nous allons créer une méthode dans le fichier <i>services/notes.js</i>, qui utilise <i>axios</i> pour récupérer les données depuis le backend

```js
import axios from 'axios'

const baseUrl = 'http://localhost:3001/notes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

export default { getAll }
```

Nous allons ajouter axios au projet

```bash
npm install axios
```

Nous allons modifier l'initialisation de l'état dans <i>noteReducer</i>, de sorte qu'il n'y ait par défaut aucune note:

```js
const noteSlice = createSlice({
  name: 'notes',
  initialState: [], // highlight-line
  // ...
})
```

Ajoutons également une nouvelle action <em>appendNote</em> pour ajouter un objet note:

```js
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

Une manière rapide d'initialiser l'état des notes en fonction des données reçues du serveur consiste à récupérer les notes dans le fichier <i>main.jsx</i> et à dispatcher une action en utilisant le créateur d'action <em>appendNote</em> pour chaque objet note individuel:

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

Dispatcher plusieurs actions peut sembler peu pratique. Ajoutons un créateur d'action <em>setNotes</em> qui peut être utilisé pour remplacer directement le tableau des notes. Nous obtiendrons le créateur d'action de la fonction <em>createSlice</em> en implémentant l'action <em>setNotes</em>:

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

Maintenant, le code dans le fichier <i>main.jsx</i> est beaucoup plus propre:

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

> **NB:** Pourquoi n'avons-nous pas utilisé await à la place des promesses et des gestionnaires d'événements (enregistrés sur les méthodes _then_)?
>
> Await ne fonctionne qu'à l'intérieur des fonctions <i>async</i>, et le code dans <i>main.jsx</i> n'est pas à l'intérieur d'une fonction, donc en raison de la nature simple de l'opération, nous nous abstiendrons d'utiliser <i>async</i> cette fois-ci.

Cependant, nous décidons de déplacer l'initialisation des notes dans le composant <i>App</i>, et, comme d'habitude, lors de la récupération de données depuis un serveur, nous utiliserons le <i>hook d'effet</i>.

```js
import { useEffect } from 'react' // highlight-line
import NewNote from './components/NewNote'
import Notes from './components/Notes'
import VisibilityFilter from './components/VisibilityFilter'
import noteService from './services/notes'  // highlight-line
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

### Envoyer des données vers le backend 

nous pouvons procéder de la même manière que pour la création d'une nouvelle note. Étendons le code communiquant avec le serveur de la manière suivante:

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

La méthode _addNote_ du composant <i>NewNote</i> change légèrement:

```js
import { useDispatch } from 'react-redux'
import { createNote } from '../reducers/noteReducer'
import noteService from '../services/notes' // highlight-line

const NewNote = (props) => {
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

export default NewNote
```

Puisque le backend génère les identifiants pour les notes, nous allons modifier le créateur d'action <em>createNote</em> dans le fichier <i>noteReducer.js</i> en conséquence:

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

Modifier l'importance des notes pourrait être implémenté en utilisant le même principe, en effectuant un appel de méthode asynchrone au serveur puis en dispatchant une action appropriée.

L'état actuel du code pour l'application peut être trouvé sur [GitHub](https://github.com/fullstack-hy2020/redux-notes/tree/part6-3) dans la branche <i>part6-3</i>.

</div>

<div class="tasks">

### Exercices 6.14.-6.15.

#### 6.14 Anecdotes et le backend, étape1

Au lancement de l'application, récupérez les anecdotes depuis le backend implémenté avec json-server.

Comme données initiales du backend, vous pouvez utiliser, par exemple, [celles-ci](https://github.com/fullstack-hy2020/misc/blob/master/anecdotes.json).

#### 6.15 Anecdotes et le backend, étape2

Modifiez la création de nouvelles anecdotes, de sorte que les anecdotes soient stockées dans le backend.

</div>

<div class="content">

### Actions asynchrones et Redux thunk

Notre approche est assez bonne, mais il n'est pas idéal que la communication avec le serveur se fasse à l'intérieur des fonctions des composants. Il serait préférable que cette communication soit abstraite des composants, de sorte qu'ils n'aient rien d'autre à faire que d'appeler le <i>créateur d'action</i> approprié. Par exemple, <i>App</i> initialiserait l'état de l'application comme suit:

```js
const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeNotes())  
  }, []) 

  // ...
}
```

et <i>NewNote</i> créerait une nouvelle note comme suit:

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

Dans cette implémentation, les deux composants enverraient une action sans avoir besoin de connaître la communication avec le serveur qui se passe en coulisse. Ce genre d'<i>actions asynchrones</i> peut être implémenté en utilisant la bibliothèque [Redux Thunk](https://github.com/reduxjs/redux-thunk). L'utilisation de la bibliothèque ne nécessite aucune configuration supplémentaire ni même d'installation lorsque le magasin Redux est créé en utilisant la fonction <em>configureStore</em> de Redux Toolkit.

Avec Redux Thunk, il est possible d'implémenter des <i>créateurs d'action</i> qui retournent une fonction au lieu d'un objet. La fonction reçoit les méthodes <em>dispatch</em> et <em>getState</em> du magasin Redux comme paramètres. Cela permet, par exemple, des implémentations de créateurs d'action asynchrones, qui attendent d'abord la complétion d'une certaine opération asynchrone et après cela envoient une action, qui change l'état du magasin.

Nous pouvons définir un créateur d'action <em>initializeNotes</em> qui initialise les notes basées sur les données reçues du serveur:

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

Dans la fonction interne, c'est-à-dire l'<i>action asynchrone</i>, l'opération commence d'abord par récupérer toutes les notes du serveur, puis <i>envoie</i> l'action <em>setNotes</em>, qui les ajoute au magasin.

Le composant <i>App</i> peut maintenant être défini comme suit:

```js
// ...
import { initializeNotes } from './reducers/noteReducer' // highlight-line

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

La solution est élégante. La logique d'initialisation des notes a été complètement séparée du composant React.

Ensuite, remplaçons le créateur d'action <em>createNote</em> créé par la fonction <em>createSlice</em> par un créateur d'action asynchrone:

```js
// ...
import noteService from '../services/notes'

const noteSlice = createSlice({
  name: 'notes',
  initialState: [],
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

Le principe est le même ici: d'abord, une opération asynchrone est exécutée, après quoi l'action qui change l'état du store est <i>dispatchée</i>.

Le composant <i>NewNote</i> change comme suit:

```js
// ...
import { createNote } from '../reducers/noteReducer' // highlight-line

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

Pour finir, nettoyons un peu le fichier <i>main.jsx</i> en déplaçant le code relatif à la création du store Redux dans son propre fichier, <i>store.js</i>:

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

Après les modifications, le contenu du fichier <i>main.jsx</i> est le suivant:

```js
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux' 
import store from './store' // highlight-line
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
```

L'état actuel du code pour l'application peut être trouvé sur [GitHub](https://github.com/fullstack-hy2020/redux-notes/tree/part6-5) dans la branche <i>part6-5</i>.

Redux Toolkit offre une multitude d'outils pour simplifier la gestion de l'état asynchrone. Des outils adaptés à ce cas d'usage incluent par exemple la fonction [createAsyncThunk](https://redux-toolkit.js.org/api/createAsyncThunk) et l'API [RTK Query](https://redux-toolkit.js.org/rtk-query/overview).

</div>

<div class="tasks">

### Exercices 6.16.-6.19.

#### 6.16 Anecdotes et le backend, étape 3

Modifiez l'initialisation du Redux store pour qu'elle se fasse à l'aide de créateurs d'actions asynchrones, rendus possibles par la bibliothèque Redux Thunk.

#### 6.17 Anecdotes et le backend, étape 4

Modifiez également la création d'une nouvelle anecdote pour qu'elle se fasse à l'aide de créateurs d'actions asynchrones, rendus possibles par la bibliothèque Redux Thunk.

#### 6.18 Anecdotes et le backend, étape 5

Le vote ne sauvegarde pas encore les changements dans le backend. Corrigez la situation avec l'aide de la bibliothèque Redux Thunk.

#### 6.19 Anecdotes et le backend, étape 6

La création de notifications est encore un peu fastidieuse puisqu'il faut faire deux actions et utiliser la fonction _setTimeout_:

```js
dispatch(setNotification(`new anecdote '${content}'`))
setTimeout(() => {
  dispatch(clearNotification())
}, 5000)
```

Créez un créateur d'actions, qui permet de fournir la notification comme suit:

```js
dispatch(setNotification(`you voted '${anecdote.content}'`, 10))
```

Le premier paramètre est le texte à afficher et le deuxième paramètre est le temps d'affichage de la notification donné en secondes.

Implémentez l'utilisation de cette notification améliorée dans votre application.

</div>