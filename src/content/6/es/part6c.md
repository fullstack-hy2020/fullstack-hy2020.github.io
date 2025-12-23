---
mainImage: ../../../images/part-6.svg
part: 6
letter: c
lang: es
---

<div class="content">

Expandamos la aplicación, de modo que las notas se almacenen en el backend. Usaremos [json-server](/es/part2/obteniendo_datos_del_servidor), de la parte 2.

El estado inicial de la base de datos se almacena en el archivo <i>db.json</i>, que se coloca en la raíz del proyecto:

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

Instalaremos json-server en nuestro proyecto...

```js
npm install json-server --save-dev
```

y agregaremos la siguiente línea a la parte de <i>scripts</i> del archivo <i>package.json</i>

```js
"scripts": {
  "server": "json-server -p 3001 db.json",
  // ...
}
```

Ahora iniciemos json-server con el comando _npm run server_.

### Fetch API

En el desarrollo de software, a menudo es necesario considerar si una cierta funcionalidad debe implementarse usando una librería externa o si es mejor utilizar las soluciones nativas proporcionadas por el entorno. Ambos enfoques tienen sus propias ventajas y desafíos.

En las partes anteriores de este curso, usamos la librería [Axios](https://axios-http.com/docs/intro) para hacer peticiones HTTP. Ahora, exploremos una forma alternativa de hacer peticiones HTTP usando la [Fetch API](https://developer.mozilla.org/es/docs/Web/API/Fetch_API) nativa.

Es típico que una librería externa como <i>Axios</i> se implemente usando otras librerías externas. Por ejemplo, si instalas Axios en tu proyecto con el comando _npm install axios_, la salida de la consola será:

```bash
$ npm install axios

added 23 packages, and audited 302 packages in 1s

71 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

Por lo tanto, además de la librería Axios, el comando instalaría más de 20 paquetes npm adicionales que Axios necesita para funcionar.

La <i>Fetch API</i> proporciona una forma similar de hacer peticiones HTTP como Axios, pero usar la Fetch API no requiere instalar ninguna librería externa. El mantenimiento de la aplicación se vuelve más fácil cuando hay menos librerías que actualizar, y la seguridad también mejora porque la superficie de ataque potencial de la aplicación se reduce. La seguridad y el mantenimiento de las aplicaciones se discute más a fondo en la [parte 7](https://fullstackopen.com/es/part7/class_components_miscellaneous#react-node-application-security) del curso.

En la práctica, las peticiones se realizan usando la función _fetch()_. La sintaxis utilizada difiere algo de Axios. También notaremos pronto que Axios se ha encargado de algunas cosas por nosotros y nos ha facilitado la vida. Sin embargo, ahora usaremos la Fetch API, ya que es una solución nativa ampliamente utilizada que todo desarrollador Full Stack debería conocer.

### Obteniendo datos del backend

Creemos un método para obtener datos del backend en el archivo <i>src/services/notes.js</i>:

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

Examinemos más de cerca la implementación del método _getAll_. Las notas ahora se obtienen del backend llamando a la función _fetch()_, a la cual se le da la URL del backend como argumento. El tipo de petición no se define explícitamente, por lo que _fetch_ realiza su acción predeterminada, que es una petición GET.

Una vez que la respuesta ha llegado, se verifica el éxito de la petición usando la propiedad _response.ok_, y se lanza un error si es necesario:

```js
if (!response.ok) {
  throw new Error('Failed to fetch notes')
}
```

El atributo _response.ok_ se establece en _true_ si la petición fue exitosa, es decir, el código de estado de la respuesta está entre 200 y 299. Para todos los demás códigos de estado, como 404 o 500, se establece en _false_.

Ten en cuenta que _fetch_ no lanza automáticamente un error incluso si el código de estado de la respuesta es, por ejemplo, 404. El manejo de errores debe implementarse manualmente, como lo hemos hecho aquí.

Si la petición es exitosa, los datos contenidos en la respuesta se convierten a formato JSON:

```js
const data = await response.json()
```

_fetch_ no convierte automáticamente ningún dato incluido en la respuesta a formato JSON; la conversión debe hacerse manualmente. También es importante notar que _response.json()_ es un método asíncrono, por lo que se requiere la palabra clave <i>await</i>.

Simplifiquemos aún más el código devolviendo directamente los datos devueltos por el método _response.json()_:

```js
const getAll = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error('Failed to fetch notes')
  }

  return await response.json() // highlight-line
}
```

### Inicializando el store con datos obtenidos del servidor

Modifiquemos ahora nuestra aplicación para que el estado de la aplicación se inicialice con las notas obtenidas del servidor.

En el archivo <i>noteReducer.js</i>, cambiemos la inicialización del estado de las notas para que por defecto no haya notas:

```js
const noteSlice = createSlice({
  name: 'notes',
  initialState: [], // highlight-line
  // ...
})
```

Agreguemos un action creator llamado <em>setNotes</em>, que nos permita reemplazar directamente el array de notas. Podemos crear el action creator deseado usando la función <em>createSlice</em> de la siguiente manera:

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

Implementemos la inicialización de las notas en el componente <i>App</i>. Como es habitual al obtener datos de un servidor, usaremos el hook <i>useEffect</i>:


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

### Enviando datos al backend

A continuación, implementemos la funcionalidad para enviar una nueva nota al servidor. Esto también nos dará una oportunidad de practicar cómo hacer una petición POST usando el método _fetch()_.

Expandamos el código en <i>src/services/notes.js</i> que maneja la comunicación con el servidor de la siguiente manera:

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

Examinemos más de cerca la implementación del método _createNew_. El primer parámetro de la función _fetch()_ especifica la URL a la que se realiza la petición. El segundo parámetro es un objeto que define otros detalles de la petición, como el tipo de petición, encabezados y los datos enviados con la petición. Podemos aclarar aún más el código almacenando el objeto que define los detalles de la petición en una variable <i>options</i> separada:

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

Examinemos más de cerca el objeto <i>options</i>:

- <i>method</i> define el tipo de petición, que en este caso es <i>POST</i>
- <i>headers</i> define los encabezados de la petición. Agregamos el encabezado _'Content-Type': 'application/json'_ para informar al servidor que los datos enviados con la petición están en formato JSON, para que pueda manejar la petición correctamente
- <i>body</i> contiene los datos enviados con la petición. No puedes asignar directamente un objeto JavaScript a este campo; primero debe convertirse a una cadena JSON llamando a la función _JSON.stringify()_

Al igual que con una petición GET, el código de estado de la respuesta se verifica para detectar errores:

```js
if (!response.ok) {
  throw new Error('Failed to create note')
}
```

Si la petición es exitosa, <i>JSON Server</i> devuelve la nota recién creada, para la cual también ha generado un <i>id</i> único. Sin embargo, los datos contenidos en la respuesta aún deben convertirse a formato JSON usando el método _response.json()_:

```js
return await response.json()
```

Luego modificaremos el componente de nuestra aplicación <i>NoteForm</i> para que una nueva nota se envíe al backend. El método _addNote_ del componente cambiará ligeramente:

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

Cuando se crea una nueva nota en el backend llamando al método _createNew()_, el valor de retorno es un objeto que representa la nota, al cual el backend ha generado un <i>id</i> único. Por lo tanto, modifiquemos el action creator <i>createNote</i> definido en <i>notesReducer.js</i> de la siguiente manera:

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

El cambio de importancia de las notas podría implementarse utilizando el mismo principio, haciendo una llamada asíncrona al servidor y luego enviando una acción apropiada.

El estado actual del código para la aplicación se puede encontrar en [GitHub](https://github.com/fullstack-hy2020/redux-notes/tree/part6-4) en la rama <i>part6-4</i>.

</div>

<div class="tasks">

### Ejercicios 6.14.-6.15.

#### 6.14 Anécdotas y el Backend, paso 1

Cuando la aplicación se inicie, obtén las anécdotas del backend implementado usando json-server. Usa la Fetch API para hacer la petición HTTP.

Como datos de backend iniciales, puedes usar, por ejemplo, [esto](https://github.com/fullstack-hy2020/misc/blob/master/anecdotes.json).

#### 6.15 Anécdotas y el Backend, paso 2

Modifica la creación de nuevas anécdotas, de forma que las anécdotas se almacenen en el backend. Utiliza la Fetch API en tu implementación una vez más.

</div>

<div class="content">

### Acciones asíncronas y Redux Thunk

Nuestro enfoque es bastante bueno, pero no es muy bueno que la comunicación con el servidor suceda dentro de las funciones de los componentes. Sería mejor si la comunicación pudiera abstraerse de los componentes para que no tengan que hacer nada más que llamar al action creator apropiado. Como ejemplo, <i>App</i> inicializaría el estado de la aplicación de la siguiente manera:

```js
const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeNotes())
  }, [dispatch]) 
  
  // ...
}
```

y <i>NoteForm</i> crearía una nueva nota de la siguiente manera:

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

En esta implementación, ambos componentes enviarían una acción sin necesidad de saber sobre la comunicación con el servidor que sucede detrás de escena. Estos tipos de <i>acciones asíncronas</i> se pueden implementar utilizando la librería [Redux Thunk](https://github.com/reduxjs/redux-thunk). El uso de la librería no requiere ninguna configuración adicional o incluso instalación cuando el store de Redux se ha creado utilizando la función <em>configureStore</em> del kit de herramientas de Redux (Redux Toolkit).

Con Redux Thunk, es posible implementar <i>action creators</i> que devuelven una función en lugar de un objeto. La función recibe los métodos <em>dispatch</em> y <em>getState</em> del store de Redux como parámetros. Esto permite, por ejemplo, implementaciones de action creators asíncronos, que primero esperan la finalización de una cierta operación asíncrona y luego despachan alguna acción, que cambia el estado del store.

Podemos definir un action creator llamado <em>initializeNotes</em> en el archivo <i>noteReducer.js</i>, que obtiene las notas iniciales del servidor, de la siguiente manera:

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

En su función interna, es decir, en la <i>acción asíncrona</i>, la operación primero obtiene todas las notas del servidor y luego <i>despacha</i> la acción para agregarlas al store. Es importante destacar que Redux pasa automáticamente una referencia al método _dispatch_ como argumento a la función, por lo que el action creator _initializeNotes_ no requiere ningún parámetro.

El action creator _setNotes_ ya no se exporta fuera del módulo, ya que el estado inicial de las notas ahora se establecerá usando el action creator asíncrono _initializeNotes_ que creamos. Sin embargo, todavía usamos el action creator _setNotes_ dentro del módulo.

El componente <i>App</i> ahora puede definirse de la siguiente manera:

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

La solución es bastante elegante. La lógica de inicialización de las notas se ha separado completamente del componente React.

A continuación, creemos un action creator asíncrono llamado _appendNote_:

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

El principio es el mismo una vez más. Primero se realiza una operación asíncrona y, una vez completada, se <i>despacha</i> una acción que actualiza el estado del store. El action creator _createNote_ ya no se exporta fuera del archivo; solo se usa internamente en la implementación de la función _appendNote_.

El componente <i>NoteForm</i> cambia de la siguiente manera:

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

Finalmente, limpiemos un poco el archivo <i>main.jsx</i> moviendo el código relacionado con la creación del store de Redux a su propio archivo <i>store.js</i>:

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

Luego de los cambios, el contenido del archivo <i>main.jsx</i> es el siguiente:

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

El estado actual del código de la aplicación se puede encontrar en [GitHub](https://github.com/fullstack-hy2020/redux-notes/tree/part6-5) en la rama <i>part6-5</i>.

Redux Toolkit ofrece una gran cantidad de herramientas para simplificar la administración de estado asíncrono. Las herramientas adecuadas para este caso de uso son, por ejemplo, la función [createAsyncThunk](https://redux-toolkit.js.org/api/createAsyncThunk) y la API [RTK Query](https://redux-toolkit.js.org/rtk-query/overview).

</div>

<div class="tasks">

### Ejercicios 6.16.-6.19.

#### 6.16 Anécdotas y el Backend, paso 3

Modifica la inicialización de la store de Redux para que suceda utilizando action creators asíncronos, los cuales son posibles gracias a la librería Redux Thunk.

#### 6.17 Anécdotas y el Backend, paso 4

También modifica la creación de una nueva anécdota para que suceda usando action creators asíncronos, hecho posible por la librería Redux Thunk.

#### 6.18 Anécdotas y el Backend, paso 5

La votación aún no guarda los cambios en el backend. Arregla la situación con la ayuda de la librería Redux Thunk y la Fetch API.

#### 6.19 Anécdotas y el Backend, paso 6

La creación de notificaciones sigue siendo un poco tediosa, ya que hay que realizar dos acciones y utilizar la función _setTimeout_:

```js
dispatch(setNotification(`new anecdote '${content}'`))
setTimeout(() => {
  dispatch(clearNotification())
}, 5000)
```

Crea un action creator, que te permita proveer la notificación de la siguiente manera:

```js
dispatch(setNotification(`you voted '${anecdote.content}'`, 10))
```

El primer parámetro es el texto que sera renderizado y el segundo parámetro es el tiempo durante el cual se mostrara la notificación en segundos.

Implementa el uso de esta notificación mejorada en tu aplicación.

</div>
