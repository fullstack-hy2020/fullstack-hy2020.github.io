---
mainImage: ../../../images/part-6.svg
part: 6
letter: b
lang: es
---

<div class="content">

Continuemos nuestro trabajo con la [versión Redux](/es/part6/flux_architecture_y_redux#redux-notas) simplificada de nuestra aplicación de notas.

Para facilitar nuestro desarrollo, cambiemos nuestro reducer para que el store se inicialice con un estado que contenga un par de notas:

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

### Store con estado complejo

Implementemos el filtrado de las notas que se muestran al usuario. La interfaz de usuario para los filtros se implementará con [botones de radio](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio):

![botones de radio con opciones important/not y listado](../../images/6/01e.png)

Comencemos con una implementación muy simple y directa:

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

Dado que el atributo <i>name</i> de todos los botones de radio es el mismo, estos forman un <i>button group</i> (grupo de botones) en el que solo se puede seleccionar una opción.

Los botones tienen un controlador de cambios que actualmente solo imprime el string asociado con el botón en el que se hizo clic en la consola.

Decidimos implementar la funcionalidad del filtro almacenando <i>el valor del filtro</i> en el store redux además de las notas mismas. El estado del store debería verse así después de realizar estos cambios:

```js
{
  notes: [
    { content: 'reducer defines how redux store works', important: true, id: 1},
    { content: 'state of store can contain any data', important: false, id: 2}
  ],
  filter: 'IMPORTANT'
}
```

Solo el array de notas se almacenaba en el estado de la implementación anterior de nuestra aplicación. En la nueva implementación, el objeto de estado tiene dos propiedades, <i>notes</i> que contienen el array de notas y <i>filter</i> que contiene un string que indica qué notas deben mostrarse al usuario.

### Reducers combinados

Podríamos modificar nuestro reducer actual para hacer frente a la nueva forma del estado. Sin embargo, una mejor solución en esta situación es definir un nuevo reducer separado para el estado del filtro:

```js
const filterReducer = (state = 'ALL', action) => {
  switch (action.type) {
    case 'SET_FILTER':
      return action.payload
    default:
      return state
  }
}
```

Las acciones para cambiar el estado del filtro se ven así:

```js
{
  type: 'SET_FILTER',
  payload: 'IMPORTANT'
}
```

Creemos también una nueva función de _action creator_. Escribiremos su código en un nuevo módulo <i>src/reducers/filterReducer.js</i>:

```js
const filterReducer = (state = 'ALL', action) => {
  // ...
}

export const filterChange = filter => {
  return {
    type: 'SET_FILTER',
    payload: filter,
  }
}

export default filterReducer
```

Podemos crear el reducer que nuestra aplicación realmente utilizara al combinar los dos reducers existentes con la función [combineReducers](https://redux.js.org/api/combinereducers).

Definamos el reducer combinado en el archivo <i>main.jsx</i>:

```js
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

const store = createStore(reducer) // highlight-line

console.log(store.getState())

/*
ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)*/

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <div />
  </Provider>
)
```

Dado que nuestra aplicación se rompe por completo en este punto, renderizamos un elemento <i>div</i> vacío en lugar del componente <i>App</i>.

El estado del store se imprime en la consola:

![consola de desarrollo mostrando el array de notas](../../images/6/4e.png)

Como podemos ver en el resultado, ¡el store tiene la forma exacta que queríamos!

Echemos un vistazo más de cerca a cómo se crea el reducer combinado:

```js
const reducer = combineReducers({
  notes: noteReducer,
  filter: filterReducer,
})
```

El estado del store definido por este reducer es un objeto con dos propiedades: <i>notes</i> y <i>filter</i>. El valor de la propiedad <i>notes</i> es definido por <i>noteReducer</i>, que no tiene que lidiar con las otras propiedades del estado. Asimismo, la propiedad <i>filter</i> es administrada por <i>filterReducer</i>.

Antes de realizar más cambios en el código, echemos un vistazo a cómo las diferentes acciones cambian el estado del store definido por el reducer combinado. Agreguemos lo siguiente al archivo <i>main.jsx</i>:

```js
import { createNote } from './reducers/noteReducer'
import { filterChange } from './reducers/filterReducer'
//...
store.subscribe(() => console.log(store.getState()))
store.dispatch(filterChange('IMPORTANT'))
store.dispatch(createNote('combineReducers forms one reducer from many simple reducers'))
```

Al simular la creación de una nota y cambiar el estado del filtro de esta manera, el estado del store se muestra en la consola después de cada cambio que se realiza en el store:

![consola mostrando filtro de notas y nueva nota](../../images/6/5e.png)

En este punto es bueno darse cuenta de un pequeño pero importante detalle. Si agregamos un console log <i>al comienzo de ambos reducers</i>:

```js
const filterReducer = (state = 'ALL', action) => {
  console.log('ACTION: ', action)
  // ...
}
```

Según el resultado de la consola, uno podría tener la impresión de que cada acción se duplica:

![consola mostrando acciones duplicadas en los reducers note y filter](../../images/6/6.png)

¿Hay algún bug en nuestro código? No. El reducer combinado funciona de tal manera que cada <i>acción</i> es controlada en <i>cada</i> parte del reducer combinado, o en otras palabras, cada reducer "escucha" a todas las acciones despachadas y hace algo con ellas si así se lo hemos instruido. Normalmente, solo un reducer está interesado en una acción determinada, pero hay situaciones en las que varios reducers cambian sus respectivas partes del estado en función de la misma acción.

### Terminando los filtros

Terminemos la aplicación para que utilice el reducer combinado. Comenzamos cambiando la renderización de la aplicación y conectando el store a la aplicación en el archivo <i>main.jsx</i>:

```js
ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
```

A continuación, solucionemos un error causado por el código que espera que la store de aplicaciones sea un array de notas:

![error en el navegador, TypeError: notes.map no es una función](../../images/6/7ea.png)

Es una solución fácil. Debido a que las notas están en el campo <i>notes</i> del store, solo tenemos que hacer un pequeño cambio en la función de selector:

```js
const Notes = () => {
  const dispatch = useDispatch()
  const notes = useSelector(state => state.notes) // highlight-line

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
```

Anteriormente, la función de selector devolvía el estado completo del store:

```js
const notes = useSelector(state => state)
```

Y ahora devuelve solo su campo <i>notes</i>

```js
const notes = useSelector(state => state.notes)
```

Extraigamos el filtro de visibilidad en su propio componente <i>src/components/VisibilityFilter.jsx</i>:

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

Con el nuevo componente, <i>App</i> se puede simplificar de la siguiente manera:

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

La implementación es bastante sencilla. Al hacer clic en los diferentes radio buttons, cambia el estado de la propiedad <i>filter</i> del store.

Cambiemos el componente <i>Notes</i> para incorporar el filtro:

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
```

Solo realizamos cambios en la función de selector, que solía ser

```js
useSelector(state => state.notes)
```

Simplifiquemos el selector desestructurando los campos del estado que recibe como parámetro:

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

Hay un pequeño defecto cosmético en nuestra aplicación. Aunque el filtro está configurado en <i>ALL</i> de forma predeterminada, el radio button asociado no está seleccionado. Naturalmente, este problema se puede solucionar, pero como se trata de un error desagradable pero, en última instancia, inofensivo, dejaremos la solución para más adelante.

La versión actual de la aplicación se puede encontrar en [GitHub](https://github.com/fullstack-hy2020/redux-notes/tree/part6-2), en la rama <i>part6-2</i>.

</div>

<div class="tasks">

### Ejercicio 6.9

#### 6.9 Mejores Anécdotas, paso 7

Implementa el filtrado para las anécdotas que se muestran al usuario.

![navegador mostrando filtrado de anécdotas](../../images/6/9ea.png)

Almacena el estado del filtro en el store de Redux. Se recomienda crear un nuevo reducer, action creators y un reducer combinado para el store utilizando la función <i>combineReducers</i>.

Crea un nuevo componente <i>Filter</i> para mostrar los filtros. Puedes utilizar el siguiente código como punto de partida:

```js
const Filter = () => {
  const handleChange = (event) => {
    // input-field value is in variable event.target.value
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

### Redux Toolkit

Como hemos visto hasta ahora, la implementación de la gestión del estado y la configuración de Redux requiere bastante esfuerzo. Esto se manifiesta, por ejemplo, en el código relacionado con el reducer y el action creator, que tiene un código un tanto repetitivo. [Redux Toolkit](https://redux-toolkit.js.org/) es una librería que resuelve estos problemas comunes relacionados con Redux. La librería, por ejemplo, simplifica enormemente la configuración del store de Redux y ofrece una gran variedad de herramientas para facilitar la gestión del estado.

Comencemos a usar Redux Toolkit en nuestra aplicación refactorizando el código existente. Primero, necesitaremos instalar la librería:

```bash
npm install @reduxjs/toolkit
```

A continuación, abre el archivo <i>main.jsx</i> que actualmente crea la store de Redux. En lugar de la función <em>createStore</em> de Redux, creemos el Store usando la función [configureStore](https://redux-toolkit.js.org/api/configureStore) de Redux Toolkit:

```js
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
  </Provider>
)
```

Ya nos deshicimos de algunas líneas de código, ya no necesitamos la función <em>combineReducers</em> para crear el reducer del store. Pronto veremos que la función <em>configureStore</em> tiene muchos beneficios adicionales, como la integración sin esfuerzo de herramientas de desarrollo y muchas librerías de uso común sin necesidad de configuración adicional.

Pasemos a refactorizar los reducers, lo que trae consigo los beneficios de Redux Toolkit. Con Redux Toolkit, podemos crear fácilmente reducers y action creators relacionados utilizando la función [createSlice](https://redux-toolkit.js.org/api/createSlice). Podemos usar la función <em>createSlice</em> para refactorizar el reducer y los action creators en el archivo <i>reducers/noteReducer.js</i> de la siguiente manera:

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

El parámetro <em>name</em> de la función <em>createSlice</em> define el prefijo que se utiliza en los valores de tipo de la acción. Por ejemplo, la acción <em>createNote</em> definida más adelante tendrá el valor de tipo <em>notes/createNote</em>. Es una buena práctica dar al parámetro un valor que sea único entre los reducers. De esta forma no habrá colisiones inesperadas entre los valores de tipo de acción de la aplicación.
El parámetro <em>initialState</em> define el estado inicial del reducer.
El parámetro <em>reducers</em> toma al propio reducer como un objeto, cuyas funciones manejan los cambios de estado causados por ciertas acciones. Ten en cuenta que <em>action.payload</em> en la función contiene el argumento proporcionado al llamar al creador de la acción:

```js
dispatch(createNote('Redux Toolkit is awesome!'))
```

Esta llamada a dispatch equivale a enviar el siguiente objeto:

```js
dispatch({ type: 'notes/createNote', payload: 'Redux Toolkit is awesome!' })
```

Si has prestado atención, es posible que hayas notado que dentro de la acción <em>createNote</em>, parece suceder algo que viola el principio de inmutabilidad de los reducers mencionado anteriormente:

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

Estamos mutando el array del argumento <em>state</em> al llamar al método <em>push</em> en lugar de devolver una nueva instancia del array. ¿De qué se trata todo esto?

Redux Toolkit utiliza la librería [Immer](https://immerjs.github.io/immer/) con reducers creados por la función <em>createSlice</em>, lo que hace posible mutar el argumento <em>state</em> dentro del reducer. Immer usa el estado mutado para producir un nuevo estado inmutable y, por lo tanto, los cambios de estado permanecen inmutables. Ten en cuenta que <em>state</em> se puede cambiar sin "mutarlo", como hemos hecho con la acción <em>toggleImportanceOf</em>. En este caso, la función <i>devuelve</i> el nuevo estado directamente. Sin embargo, mutar el estado a menudo será útil, especialmente cuando se necesita actualizar un estado complejo.

La función <em>createSlice</em> devuelve un objeto que contiene al reducer así como a los action creators definidos por el parámetro <em>reducers</em>. Se puede acceder al reducer mediante la propiedad <em>noteSlice.reducer</em>, mientras que a los action creators mediante la propiedad <em>noteSlice.actions</em>. Podemos producir las exportaciones del archivo de la siguiente manera:

```js
const noteSlice = createSlice(/* ... */)

// highlight-start
export const { createNote, toggleImportanceOf } = noteSlice.actions

export default noteSlice.reducer
// highlight-end
```

Las importaciones en otros archivos funcionarán igual que antes:

```js
import noteReducer, { createNote, toggleImportanceOf } from './reducers/noteReducer'
```

Necesitamos modificar los nombres de los tipos de las acciones en las pruebas debido a las convenciones de ReduxToolkit:

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
    expect(newState.map(s => s.content)).toContainEqual(action.payload)
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
      payload: 2
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

### Redux Toolkit y console.log

Como hemos aprendido, console.log es una herramienta extremadamente poderosa, por lo general siempre nos salva de problemas.

Intentemos imprimir el estado del store de Redux en la consola en medio del reducer creado con la función createSlice:

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

Lo siguiente se imprime en la consola

![consola mostrando Handler y Target como null pero isRevoked como true](../../images/6/40new.png)

Lo que vemos es interesante pero no muy útil. Esto tiene que ver con la librería Immer que mencionamos anteriormente y es utilizada por Redux Toolkit internamente para guardar el estado de la Tienda.

El estado se puede convertir a un formato legible por humanos, por ejemplo, convirtiéndolo primero en un string y luego de nuevo en un objeto JavaScript de la siguiente manera:

```js
console.log(JSON.parse(JSON.stringify(state))) // highlight-line
```

Ahora lo que imprime la consola es legible para humanos

![consola mostrando array de 2 notas](../../images/6/41new.png)

### Redux DevTools

[Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd) es una extension de Chrome, que ofrece útiles herramientas de desarrollo para Redux. Se puede usar, por ejemplo, para inspeccionar el estado del store de Redux y enviar acciones (dispatch) a través de la consola del navegador. Cuando el store se crea usando la función <em>configureStore</em> de Redux Toolkit, no se necesita ninguna configuración adicional para que Redux DevTools funcione.

Una vez instalada la extension, al hacer clic en la pestaña de <i>Redux</i> en las herramientas de desarrollo del navegador, Redux DevTools debería abrirse:

![redux addon en herramientas de desarrollo](../../images/6/42new.png)

Puedes inspeccionar cómo el envío de una determinada acción cambia el estado haciendo clic en la acción:

![devtools inspeccionando el árbol de state en redux](../../images/6/43new.png)

También es posible enviar acciones (dispatch) a la store utilizando las herramientas de desarrollo:

![devtools enviando createNote con payload](../../images/6/44new.png)

El código actual de la aplicación se puede encontrar en [GitHub](https://github.com/fullstack-hy2020/redux-notes/tree/part6-3), en la rama <i>part6-3</i>.

</div>

<div class="tasks">

### Ejercicios 6.10.-6.13.

Continuemos trabajando en la aplicación de anécdotas que comenzamos en el ejercicio 6.3, usando Redux Toolkit.

#### 6.10 Mejores Anécdotas, paso 8

Instala Redux Toolkit en el proyecto. Mueve la creación del store de Redux a su propio archivo <i>store.js</i> y utiliza la función <em>configureStore</em> para crear el store.

Cambia la definición del <i>filter reducer y sus action creators</i> para usar la función <em>createSlice</em> de Redux Toolkit.

También, comienza a utilizar Redux DevTools para depurar el estado de la aplicación fácilmente.

#### 6.11 Mejores Anécdotas, paso 9

Cambia también la definición de <i>anecdote reducer y sus action creators</i> para usar la función <em>createSlice</em> de Redux Toolkit.

#### 6.12 Mejores Anécdotas, paso 10

La aplicación tiene el esqueleto del componente <i>Notification</i> listo para utilizarlo:

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

Extiende el componente para que muestre el mensaje almacenado en el store de redux, haciendo que el componente tome la siguiente forma:

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

Tendrás que realizar cambios en el reducer existente de la aplicación. Crea un reducer separado para la nueva funcionalidad usando la función <em>createSlice</em> de Redux Toolkit.

La aplicación no tiene que utilizar el componente <i>Notification</i> completamente en este punto de los ejercicios. Es suficiente con que la aplicación muestre el valor inicial establecido para el mensaje en el <i>notificationReducer</i>.

#### 6.13 Mejores Anécdotas, paso 11

Extiende la aplicación para que utilice el componente <i>Notification</i> para mostrar un mensaje durante cinco segundos cuando el usuario vote por una anécdota o cree una nueva anécdota:

![navegador mostrando el mensaje de haber votado](../../images/6/8ea.png)

Se recomienda crear [action creators](https://redux-toolkit.js.org/api/createSlice#reducers) independientes para configurar y eliminar notificaciones.

</div>
