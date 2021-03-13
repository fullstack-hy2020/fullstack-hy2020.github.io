---
mainImage: ../../../images/part-6.svg
part: 6
letter: c
lang: es
---

<div class="content">


Expandamos la aplicación, de modo que las notas se almacenen en el backend. Usaremos [json-server](/es/part2/getting_data_from_server), de la parte 2.


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



Instalaremos json-server para el proyecto...

```js
npm install json-server --save-dev
```



y agregue la siguiente línea a la parte de <i>scripts</i> del archivo <i>package.json</i>

```js
"scripts": {
  "server": "json-server -p3001 --watch db.json",
  // ...
}
```

Ahora iniciemos json-server con el comando _npm run server_.

A continuación, crearemos un método en el archivo  <i>services/notes.js</i>, que usa <i>axios</i> para obtener datos del backend

```js
import axios from 'axios'

const baseUrl = 'http://localhost:3001/notes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

export default { getAll }
```

Agregaremos axios al proyecto

```bash
npm install axios
```

Cambiaremos la inicialización del estado en <i>noteReducer</i>, de modo que por defecto no haya notas:

```js
const noteReducer = (state = [], action) => {
  // ...
}
```

Una forma rápida de inicializar el estado en función de los datos en el servidor es buscar las notas en el archivo <i>index.js</i>  y enviar la acción <i>NEW\_NOTE</i> para cada una de ellas:

```js
// ...
import noteService from './services/notes' // highlight-line

const reducer = combineReducers({
  notes: noteReducer,
  filter: filterReducer,
})

const store = createStore(reducer)

// highlight-start
noteService.getAll().then(notes =>
  notes.forEach(note => {
    store.dispatch({ type: 'NEW_NOTE', data: note })
  })
)
// highlight-end

// ...
```



Agreguemos soporte en el reducer para la acción <i>INIT\_NOTES</i>, con el cual se puede realizar la inicialización enviando una sola acción. Creemos también una función de creador de acciones _initializeNotes_.

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


<i>index.js</i> simplifica:

```js
import noteReducer, { initializeNotes } from './reducers/noteReducer'
// ...

noteService.getAll().then(notes =>
  store.dispatch(initializeNotes(notes))
)
```


> **NB:**  ¿por qué no usamos await en lugar de promesas y controladores de eventos (registrados en _then_ métodos)?
>
>Await solo funciona dentro de funciones <i>async</i>, y el código en <i>index.js</i> no está dentro de una función, por lo que debido a la naturaleza simple de la operación, esta vez nos abstendremos de usar  <i>async</i>.

Sin embargo, decidimos mover la inicialización de las notas al componente <i>App</i> y, como es habitual al obtener datos de un servidor, usaremos <i>effect hook</i>.

```js
import React, {useEffect} from 'react' // highlight-line
import NewNote from './components/NewNote'
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

El uso del hoook useEffect genera una advertencia eslint:

![](../../images/6/26ea.png)

Podemos deshacernos de él haciendo lo siguiente:

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

Ahora, la variable dispatch que definimos en el componente _App_, que prácticamente es la función de dispatch de redux-store, se ha agregado al array que recibe useEffect como parámetro. 
**Si** el valor de la variable dispatch cambiara durante el tiempo de ejecución, el efecto se ejecutaría nuevamente. Sin embargo, esto no puede suceder en nuestra aplicación, por lo que la advertencia es innecesaria.

Otra forma de deshacerse de la advertencia sería deshabilitar eslint en esa línea:

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

Generalmente, deshabilitar eslint cuando genera una advertencia no es una buena idea. Aunque la regla eslint en cuestión ha causado algunos [argumentos](https://github.com/facebook/create-react-app/issues/6880), usaremos la primera solución.

Más sobre la necesidad de definir las dependencias de los hooks en la [documentación de react](https://reactjs.org/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies).

Podemos hacer lo mismo cuando se trata de crear una nueva nota. Expandamos el código comunicándonos con el servidor de la siguiente manera:

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

El método _addNote_ del componente <i>NewNote</i> cambia ligeramente:

```js
import React from 'react'
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

Debido a que el backend genera ids para las notas, cambiaremos el creador de la acción _createNote_

```js
export const createNote = (data) => {
  return {
    type: 'NEW_NOTE',
    data,
  }
}
```

El cambio de importancia de las notas podría implementarse utilizando el mismo principio, lo que significa realizar una llamada de método asincrónico al servidor y luego enviar una acción apropiada.

El estado actual del código para la aplicación se puede encontrar en [github](https://github.com/fullstack-hy2020/redux-notes/tree/part6-3) en la rama <i>part6-3</i>.

</div>

<div class="tasks">

### Ejercicios 6.13.-6.14.

#### 6.13 Anécdotas y el backend, paso 1

Cuando la aplicación se inicie, obtenga las anécdotas del backend implementado usando json-server.

Como datos de backend iniciales, puede usar, por ejemplo, [esto](https://github.com/fullstack-hy2020/misc/blob/master/anecdotes.json).


#### 6.14 Anécdotas y el backend, paso 2

Modificar la creación de nuevas anécdotas, de forma que las anécdotas se almacenen en el backend.

</div>

<div class="content">

### Acciones asincrónicas y redux thunk

Nuestro enfoque está bien, pero no es bueno que la comunicación con el servidor ocurra dentro de las funciones de los componentes. Sería mejor si la comunicación se pudiera abstraer de los componentes, de modo que no tuvieran que hacer nada más que llamar al <i>creador de la acción</i> correspondiente. Como ejemplo, <i>App</i> inicializaría el estado de la aplicación de la siguiente manera:

```js
const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeNotes()))  
  },[dispatch]) 

  // ...
}
```

y <i>NewNote</i> crearía una nueva nota de la siguiente manera:

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

Ambos componentes solo usarían la función que se les proporciona como prop sin importar la comunicación con el servidor que está sucediendo en segundo plano.

Ahora instalemos la librería [redux-thunk](https://github.com/gaearon/redux-thunk), que nos permite crear <i>acciones asincrónicas</i>. La instalación se realiza con el comando:

```bash
npm install redux-thunk
```

La librería redux-thunk es un <i>redux-middleware</i>, que debe inicializarse junto con la inicialización del store. Mientras estamos aquí, extraigamos la definición del store en su propio archivo <i>src/store.js</i>: 

```js
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk' // highlight-line
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
    applyMiddleware(thunk) // highlight-line
  )
)

export default store
```

Después de los cambios, el archivo <i>src/index.js</i> se ve así
After the changes the file <i>src/index.js</i> looks like this

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

Gracias a redux-thunk, es posible definir <i>creadores de acciones</i> para que devuelvan una función que tenga como parámetro el método <i>dispatch</i> de redux-store. Como resultado de esto, se pueden hacer creadores de acciones asincrónicas, que primero esperan a que termine alguna operación, luego de lo cual luego envían la acción real.


Ahora podemos definir el creador de acciones, <i>initializeNotes</i>, que inicializa el estado de las notas de la siguiente manera:

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

En la función interna, es decir, la <i>acción asincrónica</i>, la operación primero obtiene todas las notas del servidor y luego envía las notas a la acción, que las agrega al store.

El componente <i>App</i> ahora se puede definir de la siguiente manera:

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

La solución es elegante. La lógica de inicialización de las notas se ha separado completamente fuera del componente React.

El creador de acciones _createNote_, que agrega una nueva nota tiene este aspecto

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

El principio aquí es el mismo: primero se ejecuta una operación asincrónica, después de lo cual se envía la acción que cambia el estado del store.

El componente <i>NewNote</i> cambia de la siguiente manera:

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

El estado actual del código para la aplicación se puede encontrar en [github](https://github.com/fullstack-hy2020/redux-notes/tree/part6-4) en la rama <i>part6-4</i>.

</div>

<div class="tasks">


### Ejercicios 6.15.-6.18.

#### 6.15 Anécdotas y el backend, paso3

Modifique la inicialización de redux-store para que suceda utilizando creadores de acciones asincrónicas, que son posibles gracias a la librería <i>redux-thunk</i>.

#### 6.16 Anécdotas y el backend, paso 4

También modifique la creación de una nueva anécdota para que suceda usando creadores de acciones asincrónicas, hecho posible por la librería <i>redux-thunk</i>.


#### 6.17 Anécdotas y el backend, paso 5

La votación aún no guarda los cambios en el backend. Arregle la situación con la ayuda de la librería <i>redux-thunk</i>.

#### 6.18 Anécdotas y el backend, paso 6

La creación de notificaciones sigue siendo un poco tediosa, ya que hay que realizar dos acciones y utilizar la función _setTimeout_:

```js
dispatch(setNotification(`new anecdote '${content}'`))
setTimeout(() => {
  dispatch(clearNotification())
}, 5000)
```

Cree un creador de acciones asincrónicas, que le permite a uno proporcionar la notificación de la siguiente manera:

```js
dispatch(setNotification(`you voted '${anecdote.content}'`, 10))
```

el primer parámetro es el texto que se representará y el segundo parámetro es el tiempo para mostrar la notificación dada en segundos.

Implemente el uso de esta notificación mejorada en su aplicación.

</div>
