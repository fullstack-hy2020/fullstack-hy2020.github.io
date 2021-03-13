---
mainImage: ../../../images/part-6.svg
part: 6
letter: b
lang: es
---

<div class="content">


Continuemos nuestro trabajo con la [versión redux](/es/part6/flux_architecture_and_redux#redux-notes) simplificada de nuestra aplicación de notas.


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


Implementemos el filtrado de las notas que se muestran al usuario. La interfaz de usuario para los filtros se implementará con [radio buttons](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio):

![](../../images/6/01e.png)


Comencemos con una implementación muy simple y directa:

```js
import React from 'react'
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


Dado que el atributo <i>name</i> de todos los botones de opción es el mismo, forman un <i>button group</i> (grupo de botones) en el que solo se puede seleccionar una opción.


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


Solo el array de notas se almacena en el estado de la implementación actual de nuestra aplicación. En la nueva implementación, el objeto de estado tiene dos propiedades, <i>notes</i> que contienen el array de notas y <i>filter</i> que contiene un string que indica qué notas deben mostrarse al usuario.

### Reducers combinados


Podríamos modificar nuestro reducer actual para hacer frente a la nueva forma del estado. Sin embargo, una mejor solución en esta situación es definir un nuevo reducer separado para el estado del filtro:

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


Las acciones para cambiar el estado del filtro se ven así:

```js
{
  type: 'SET_FILTER',
  filter: 'IMPORTANT'
}
```


Creemos también una nueva función de _action creator_ . Escribiremos el código para el creador de la acción en un nuevo módulo <i>src/reducers/filterReducer.js</i>:

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


Podemos crear el reducer real para nuestra aplicación combinando los dos reducers existentes con la función [combineReducers](https://redux.js.org/api/combinereducers).

Definamos el reducer combinado en el archivo <i>index.js</i>:

```js
import React from 'react'
import ReactDOM from 'react-dom'
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

ReactDOM.render(
  /*
  <Provider store={store}>
    <App />
  </Provider>,
  */
  <div />,
  document.getElementById('root')
)
```

Dado que nuestra aplicación se rompe por completo en este punto, representamos un elemento <i>div</i> vacío en lugar del componente <i>App</i>.


El estado del store se imprime en la consola:

![](../../images/6/4e.png)


Como podemos ver en el resultado, ¡el store tiene la forma exacta que queríamos!


Echemos un vistazo más de cerca a cómo se crea el reducer combinado:

```js
const reducer = combineReducers({
  notes: noteReducer,
  filter: filterReducer,
})
```


El estado del store definido por el reducer anterior es un objeto con dos propiedades: <i>notes</i> y <i>filter</i>. El valor de la propiedad <i>notes</i> está definido por el <i>noteReducer</i>, que no tiene que lidiar con las otras propiedades del estado. Asimismo, la propiedad <i>filter</i> es administrada por <i>filterReducer</i>.


Antes de realizar más cambios en el código, echemos un vistazo a cómo las diferentes acciones cambian el estado del store definida por el reducer combinado. Agreguemos lo siguiente al archivo <i>index.js</i>:

```js
import { createNote } from './reducers/noteReducer'
import { filterChange } from './reducers/filterReducer'
//...
store.subscribe(() => console.log(store.getState()))
store.dispatch(filterChange('IMPORTANT'))
store.dispatch(createNote('combineReducers forms one reducer from many simple reducers'))
```


Al simular la creación de una nota y cambiar el estado del filtro de esta manera, el estado del store se registra en la consola después de cada cambio que se realiza en el store:

![](../../images/6/5e.png)


En este punto es bueno darse cuenta de un pequeño pero importante detalle. Si agregamos una declaración de registro de la consola <i>al comienzo de ambos reduceres</i>:

```js
const filterReducer = (state = 'ALL', action) => {
  console.log('ACTION: ', action)
  // ...
}
```


Según el resultado de la consola, uno podría tener la impresión de que cada acción se duplica:

![](../../images/6/6.png)


¿Hay algún error en nuestro código? No. El reducer combinado funciona de tal manera que cada <i>acción</i> se maneja en <i>cada</i> parte del reducer combinado. Normalmente, solo un reducer está interesado en una acción determinada, pero hay situaciones en las que varios reducers cambian sus respectivas partes del estado en función de la misma acción.

### Terminando los filtros


Terminemos la aplicación para que utilice el reducer combinado. Comenzamos cambiando la representación de la aplicación y conectando el store a la aplicación en el archivo <i>index.js</i>:

```js
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

A continuación, solucionemos un error causado por el código que espera que la store de aplicaciones sea un array de notas:

![](../../images/6/7ea.png)


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

Anteriormente, la función de selector retornaba el estado completo del store:

```js
const notes = useSelector(state => state)
```

Y ahora devuelve solo su campo <i>notes</i>

```js
const notes = useSelector(state => state.notes)
```


Extraigamos el filtro de visibilidad en su propio componente <i>src/components/VisibilityFilter.js</i>:

```js
import React from 'react'
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
import React from 'react'
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

Hay un pequeño defecto cosmético en nuestra aplicación. Aunque el filtro está configurado en <i>ALL</i> de forma predeterminada, el radio button asociado no está seleccionado. Naturalmente, este problema se puede solucionar, pero como se trata de un error desagradable pero, en última instancia, inofensivo, guardaremos la solución para más adelante.

### Redux DevTools

Existe una extensión [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd) que se puede instalar en Chrome, en la cual el estado del store Redux y la acción que lo cambia se puede monitorear desde la consola del navegador.


Al debuggear, además de la extensión del navegador también tenemos la librería de software [redux-devtools-extension](https://www.npmjs.com/package/redux-devtools-extension). Instalemos usando el comando:

```js
npm install --save-dev redux-devtools-extension
```

Tendremos que cambiar ligeramente la definición del store para que la librería esté en funcionamiento:

```js
// ...
import { createStore, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension' // highlight-line

import noteReducer from './reducers/noteReducer'
import filterReducer from './reducers/filterReducer'

const reducer = combineReducers({
  notes: noteReducer,
  filter: filterReducer
})

const store = createStore(
  reducer,
  // highlight-start
  composeWithDevTools()
  // highlight-end
)

export default store
```

Ahora, cuando abre la consola, la pestaña <i>redux</i> se ve así:

![](../../images/6/11ea.png)

El efecto de cada acción en el store se puede observar fácilmente.

![](../../images/6/12ea.png)

También es posible enviar acciones al store usando la consola.

![](../../images/6/13ea.png)

Puede encontrar el código para nuestra aplicación actual en su totalidad en la rama <i>part6-2</i> de [este repositorio de Github](https://github.com/fullstack-hy2020/redux-notes/tree/part6-2).

</div>

<div class="tasks">


### Ejercicios 6.9.-6.12.


Continuemos trabajando en la aplicación de anécdotas usando redux que comenzamos en el ejercicio 6.3.


#### 6.9 Mejores anécdotas, paso 7

Comience a utilizar Redux DevTools. Mueva la definición de Redux-store a su propio archivo <i>store.js</i>.


#### 6.10 Mejores anécdotas, paso 8

La aplicación tiene un cuerpo listo para usar para el componente <i>Notification</i>:

```js
import React from 'react'

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


Extienda el componente para que muestre el mensaje almacenado en el store redux, haciendo que el componente tome el formulario:

```js
import React from 'react'
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

Tendrá que realizar cambios en el reducer existente de la aplicación. Cree un reducer separado para la nueva funcionalidad y refactorice la aplicación para que utilice un reducer combinado como se muestra en esta parte del material del curso.

La aplicación no tiene que utilizar el componente <i>Notification</i> de forma inteligente en este punto de los ejercicios. Es suficiente que la aplicación muestre el valor inicial establecido para el mensaje en el <i>notificationReducer</i>.

#### 6.11 Mejores anécdotas, paso 9


Extienda la aplicación para que utilice el componente <i>Notification</i> para mostrar un mensaje durante cinco segundos cuando el usuario vote por una anécdota o cree una nueva anécdota:

![](../../images/6/8ea.png)


Se recomienda crear [creadores de acciones](https://redux.js.org/basics/actions#action-creators) independientes para configurar y eliminar notificaciones.


#### 6.12* Mejores anécdotas, paso 10


Implementar el filtrado de las anécdotas que se le muestran al usuario.

![](../../images/6/9ea.png)


Guarde el estado del filtro en el store redux. Se recomienda crear un nuevo reducer y creadores de acciones para este propósito.


Cree un nuevo componente <i>Filter</i> para mostrar el filtro. Puede utilizar el siguiente código como plantilla para el componente:

```js
import React from 'react'

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
