---
mainImage: ../../../images/part-6.svg
part: 6
letter: a
lang: es
---

<div class="content">


Hasta ahora, hemos seguido las convenciones de administración de estado recomendadas por React. Hemos colocado el estado y los métodos para manejarlo en [el componente raíz](https://reactjs.org/docs/lifting-state-up.html) de la aplicación. El estado y sus métodos de manejo se han pasado a otros componentes con props. Esto funciona hasta cierto punto, pero cuando las aplicaciones crecen, la administración del estado se vuelve un desafío. 

### Arquitectura de Flux


Facebook desarrolló la arquitectura [Flux](https://facebook.github.io/flux/docs/in-depth-overview/)- para facilitar la gestión del estado. En Flux, el estado se separa completamente de los componentes de React en sus propios <i>stores</i>(almacenes). El estado en el store no se cambia directamente, sino con diferentes <i>actions</i>(acciones).


Cuando una acción cambia el estado de un store, las vistas se vuelven a generar:

![](https://facebook.github.io/flux/img/overview/flux-simple-f8-diagram-1300w.png)

Si alguna acción en la aplicación, por ejemplo presionar un botón, provoca la necesidad de cambiar el estado, el cambio se realiza con una acción. Esto hace que vuelva a renderizar la vista:

![](https://facebook.github.io/flux/img/overview/flux-simple-f8-diagram-with-client-action-1300w.png)

Flux ofrece una forma estándar de cómo y dónde se mantiene el estado de la aplicación y cómo se modifica.

### Redux

Facebook tiene una implementación para Flux, pero usaremos la librería [Redux](https://redux.js.org). Funciona con el mismo principio, pero es un poco más sencillo. Facebook también usa Redux ahora en lugar de su Flux original.


Conoceremos Redux implementando una aplicación de contador una vez más:

![](../../images/6/1.png)


Cree una nueva aplicación create-react-app-application e instale <i>redux</i> con el comando

```bash
npm install redux
```


Como en Flux, en Redux el estado también se almacena en un [store](https://redux.js.org/basics/store).


Todo el estado de la aplicación se almacena en <i>un</i> objeto JavaScript en el store. Debido a que nuestra aplicación solo necesita el valor del contador, lo guardaremos directamente en el store. Si el estado fuera más complicado, diferentes elementos del estado se guardarían como campos separados del objeto.


El estado del store se cambia con [acciones](https://redux.js.org/basics/actions). Las acciones son objetos que tienen al menos un campo que determina el <i>tipo</i> de acción. Nuestra aplicación necesita, por ejemplo, la siguiente acción:

```js
{
  type: 'INCREMENT'
}
```

Si hay datos relacionados con la acción, se pueden declarar otros campos según sea necesario. Sin embargo, nuestra aplicación de conteo es tan simple que las acciones están bien con solo el campo de tipo.


El impacto de la acción sobre el estado de la aplicación se define mediante un [reducer](https://redux.js.org/basics/reducers). En la práctica, un reducer es una función a la que se le da el estado actual y una acción como parámetros. Se <i>retorna</i> un nuevo estado.


Definamos ahora un reducer para nuestra aplicación:


```js
const counterReducer = (state, action) => {
  if (action.type === 'INCREMENT') {
    return state + 1
  } else if (action.type === 'DECREMENT') {
    return state - 1
  } else if (action.type === 'ZERO') {
    return 0
  }

  return state
}
```


El primer parámetro es el <i>estado</i> del store. Reducer devuelve un <i>nuevo estado</i> según el tipo de acciones.


Cambiemos un poco el código. Es habitual usar el comando [switch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch) en lugar de ifs en un reducer.


Definamos también un [valor predeterminado](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters) de 0 para el <i>estado</i> del parámetro . Ahora el reducer funciona incluso si el estado del store aún no se ha indicado.

```js
const counterReducer = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    case 'ZERO':
      return 0
    default: // if none of the above matches, code comes here
    return state
  }
}
```


No se supone que Reducer se llame directamente desde el código de la aplicación. Reducer solo se proporciona como parámetro a la función _createStore_ que crea el store:

```js
import { createStore } from 'redux'

const counterReducer = (state = 0, action) => {
  // ...
}

const store = createStore(counterReducer)
```


El store ahora usa el reducer para manejar <i>acciones</i>, que son <i>dispatched</i> o 'envían' al store con su método de [dispatch](https://redux.js.org/api/store#dispatchaction)(envío).

```js
store.dispatch({type: 'INCREMENT'})
```


Puede averiguar el estado del store utilizando el método [getState](https://redux.js.org/api/store#getstate).


Por ejemplo, el siguiente código:

```js
const store = createStore(counterReducer)
console.log(store.getState())
store.dispatch({type: 'INCREMENT'})
store.dispatch({type: 'INCREMENT'})
store.dispatch({type: 'INCREMENT'})
console.log(store.getState())
store.dispatch({type: 'ZERO'})
store.dispatch({type: 'DECREMENT'})
console.log(store.getState())
```


imprimiría lo siguiente en la consola

<pre>
0
3
-1
</pre>


porque al principio el estado del store es 0. Después de tres acciones <i>INCREMENT</i> el estado es 3. Al final, después de las acciones <i>ZERO</i> y <i>DECREMENT</i>, el estado es -1.


El tercer método importante que tiene el store es [subscribe](https://redux.js.org/api/store#subscribelistener), que se utiliza para crear funciones callback que el store llama cuando cambia su estado.


Si, por ejemplo, añadiéramos la siguiente función para suscribirse, <i>todos los cambios en el store</i> se imprimirían en la consola.

```js
store.subscribe(() => {
  const storeNow = store.getState()
  console.log(storeNow)
})
```


entonces el código

```js
const store = createStore(counterReducer)

store.subscribe(() => {
  const storeNow = store.getState()
  console.log(storeNow)
})

store.dispatch({ type: 'INCREMENT' })
store.dispatch({ type: 'INCREMENT' })
store.dispatch({ type: 'INCREMENT' })
store.dispatch({ type: 'ZERO' })
store.dispatch({ type: 'DECREMENT' })
```


causaría que se imprima lo siguiente:

<pre>
1
2
3
0
-1
</pre>



El código de nuestra aplicación de contador es el siguiente. Todo el código se ha escrito en el mismo archivo, por lo que <i>store</i> está directamente disponible para el código React. Más adelante conoceremos mejores formas de estructurar el código React / Redux.

```js
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'

const counterReducer = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    case 'ZERO':
      return 0
    default:
      return state
  }
}

const store = createStore(counterReducer)

const App = () => {
  return (
    <div>
      <div>
        {store.getState()}
      </div>
      <button 
        onClick={e => store.dispatch({ type: 'INCREMENT' })}
      >
        plus
      </button>
      <button
        onClick={e => store.dispatch({ type: 'DECREMENT' })}
      >
        minus
      </button>
      <button 
        onClick={e => store.dispatch({ type: 'ZERO' })}
      >
        zero
      </button>
    </div>
  )
}

const renderApp = () => {
  ReactDOM.render(<App />, document.getElementById('root'))
}

renderApp()
store.subscribe(renderApp)
```


Hay algunas cosas notables en el código. <i>App</i> muestra el valor del contador solicitándolo al store con el método _store.getState()_. Los controladores de acciones de los botones envían (<i>dispatch</i>) las acciones correctas al store.


Cuando se cambia el estado del store, React no puede volver a rerenderizar automáticamente la aplicación. Por lo tanto, hemos registrado una función _renderApp_ , que renderiza toda la aplicación, para escuchar cambios en el store con el método _store.subscribe_. Tenga en cuenta que tenemos que invocar inmediatamente al método _renderApp_ . Sin la invocación, la primera representación de la aplicación nunca se produciría.


### Redux-notas


Nuestro objetivo es modificar nuestra aplicación de notas para utilizar Redux para la gestión del estado. Sin embargo, primero cubramos algunos conceptos clave a través de una aplicación de notas simplificada.


La primera versión de nuestra aplicación es la siguiente

```js
const noteReducer = (state = [], action) => {
  if (action.type === 'NEW_NOTE') {
    state.push(action.data)
    return state
  }

  return state
}

const store = createStore(noteReducer)

store.dispatch({
  type: 'NEW_NOTE',
  data: {
    content: 'the app state is in redux store',
    important: true,
    id: 1
  }
})

store.dispatch({
  type: 'NEW_NOTE',
  data: {
    content: 'state changes are made with actions',
    important: false,
    id: 2
  }
})

const App = () => {
  return(
    <div>
      <ul>
        {store.getState().map(note=>
          <li key={note.id}>
            {note.content} <strong>{note.important ? 'important' : ''}</strong>
          </li>
        )}
        </ul>
    </div>
  )
}
```


Hasta el momento la aplicación no tiene la funcionalidad para agregar nuevas notas, aunque es posible hacerlo enviando las acciones <i>NEW\_NOTE</i>.

Ahora las acciones tienen un tipo y un campo <i>data</i>, que contiene la nota a agregar:

```js
{
  type: 'NEW_NOTE',
  data: {
    content: 'state changes are made with actions',
    important: false,
    id: 2
  }
}
```

### Funciones puras, inmutables

La función inicial del reducer es sencilla:

```js
const noteReducer = (state = [], action) => {
  if (action.type === 'NEW_NOTE') {
    state.push(action.data)
    return state
  }

  return state
}
```


El estado ahora es una Array. <i>NEW\_NOTE</i>- las acciones de tipo hacen que se agregue una nueva nota al estado con el método [push](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push).


La aplicación parece estar funcionando, pero el reducer que hemos declarado es malo. Rompe el [supuesto básico](https://github.com/reactjs/redux/blob/master/docs/basics/Reducers.md#handling-actions) del reducer Redux de que los reducers deben ser [funciones puras](https://en.wikipedia.org/wiki/Pure_function).


Las funciones puras son tales que <i>no causan ningún efecto secundario</i>  y siempre deben devolver la misma respuesta cuando se invocan con los mismos parámetros.


Agregamos una nueva nota al estado con el método _state.push(action.data)_ que <i>cambia</i> el estado del objeto de estado. Esto no esta permitido. El problema se resuelve fácilmente utilizando el método [concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat), que crea un <i>nuevo array</i>, que contiene todos los elementos del array anterior y el nuevo elemento:
 
```js
const noteReducer = (state = [], action) => {
  if (action.type === 'NEW_NOTE') {
    return state.concat(action.data)
  }

  return state
}
```


Un estado reducer debe estar compuesto por objetos [inmutables](https://en.wikipedia.org/wiki/Immutable_object). Si hay un cambio en el estado, el objeto antiguo no se cambia, sino que se <i>reemplaza por un objeto nuevo modificado</i>. Esto es exactamente lo que hicimos con el nuevo reducer: el array anterior se reemplaza por la nueva.


Ampliemos nuestro reducer para que pueda manejar el cambio de importancia de una nota:

```js
{
  type: 'TOGGLE_IMPORTANCE',
  data: {
    id: 2
  }
}
```


Dado que todavía no tenemos ningún código que utilice esta funcionalidad, estamos expandiendo el reducer en la forma 'test driven' (guiada por pruebas). Comencemos creando una prueba para manejar la acción <i>NEW\_NOTE</i>.


Para facilitar las pruebas, primero trasladaremos el código del reducer a su propio módulo al archivo <i>src/reducers/noteReducer.js</i>. También agregaremos la librería [deep-freeze](https://github.com/substack/deep-freeze), que se puede usar para garantizar que el reducer se haya definido correctamente como una función inmutable. Instalemos la librería como una dependencia de desarrollo

```js
npm install --save-dev deep-freeze
```


La prueba, que definimos en el archivo <i>src/reducers/noteReducer.test.js</i>, tiene el siguiente contenido:

```js
import noteReducer from './noteReducer'
import deepFreeze from 'deep-freeze'

describe('noteReducer', () => {
  test('returns new state with action NEW_NOTE', () => {
    const state = []
    const action = {
      type: 'NEW_NOTE',
      data: {
        content: 'the app state is in redux store',
        important: true,
        id: 1
      }
    }

    deepFreeze(state)
    const newState = noteReducer(state, action)

    expect(newState).toHaveLength(1)
    expect(newState).toContainEqual(action.data)
  })
})
```


El comando <i>deepFreeze(state)</i> asegura que el reducer no cambie el estado del store que se le dio como parámetro. Si el reducer usa el comando _push_ para manipular el estado, la prueba no pasará

![](../../images/6/2.png)


Ahora crearemos una prueba para la acción <i>TOGGLE\_IMPORTANCE</i>:

```js
test('returns new state with action TOGGLE_IMPORTANCE', () => {
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
    type: 'TOGGLE_IMPORTANCE',
    data: {
      id: 2
    }
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
```


Entonces la siguiente acción

```js
{
  type: 'TOGGLE_IMPORTANCE',
  data: {
    id: 2
  }
}
```


tiene que cambiar la importancia de la nota con el id 2.


El reducer se expande de la siguiente manera

```js
const noteReducer = (state = [], action) => {
  switch(action.type) {
    case 'NEW_NOTE':
      return state.concat(action.data)
    case 'TOGGLE_IMPORTANCE': {
      const id = action.data.id
      const noteToChange = state.find(n => n.id === id)
      const changedNote = { 
        ...noteToChange, 
        important: !noteToChange.important 
      }
      return state.map(note =>
        note.id !== id ? note : changedNote 
      )
     }
    default:
      return state
  }
}
```


Creamos una copia de la nota cuya importancia ha cambiado con la sintaxis [de la parte 2](/es/part2/altering_data_in_server#changing-the-importance-of-notes), y reemplazamos el estado con un nuevo estado que contiene todas las notas que no han cambiado y la copia de la nota cambiada <i>changedNote</i>.


Recapitulemos lo que sucede en el código. Primero, buscamos un objeto de nota específico, cuya importancia queremos cambiar:

```js
const noteToChange = state.find(n => n.id === id)
```


luego creamos un nuevo objeto, que es una <i>copia</i> de la nota original, solo el valor del campo <i>important</i> se ha cambiado al opuesto de lo que era:

```js
const changedNote = { 
  ...noteToChange, 
  important: !noteToChange.important 
}
```


Entonces se devuelve un nuevo estado. Lo creamos tomando todas las notas del estado anterior, excepto la nota deseada, que reemplazamos con su copia ligeramente alterada:

```js
state.map(note =>
  note.id !== id ? note : changedNote 
)
```

### Array spread syntax


Debido a que ahora tenemos pruebas bastante buenas para el reducer, podemos refactorizar el código de forma segura.


Agregar una nueva nota crea el estado que devuelve con la función de Arrays _concat_. Echemos un vistazo a cómo podemos lograr lo mismo usando la sintaxis [array spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator)  de JavaScript:

```js
const noteReducer = (state = [], action) => {
  switch(action.type) {
    case 'NEW_NOTE':
      return [...state, action.data]
    case 'TOGGLE_IMPORTANCE':
      // ...
    default:
    return state
  }
}
```


La sintaxis spread funciona de la siguiente manera. Si declaramos

```js
const numbers = [1, 2, 3]
```


<code>...numbers</code> divide el array en elementos individuales, que se pueden colocar, es decir, en otro array.

```js
[...numbers, 4, 5]
```


y el resultado es un array `[1, 2, 3, 4, 5]`.


Si hubiéramos colocado el array en otro array sin el spread

```js
[numbers, 4, 5]
```


el resultado habría sido `[ [1, 2, 3], 4, 5]`.


Cuando tomamos elementos de un array mediante la [desestructuración](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment), se usa una sintaxis similar para <i>juntar</i> el resto de los elementos:

```js
const numbers = [1, 2, 3, 4, 5, 6]

const [first, second, ...rest] = numbers

console.log(first)     // prints 1
console.log(second)   // prints 2
console.log(rest)     // prints [3, 4, 5, 6]
```

</div>

<div class="tasks">

### Ejercicios 6.1.-6.2.


Hagamos una versión simplificada del ejercicio unicafe de la parte 1. Manejemos la administración del estado con Redux.


Puede tomar el proyecto de este repositorio https://github.com/fullstack-hy2020/unicafe-redux para la base de su proyecto.


<i>Comience eliminando la configuración git del repositorio clonado e instalando dependencias</i>

```bash
cd unicafe-redux   // go to the directory of cloned repository
rm -rf .git
npm install
```

#### 6.1: unicafe revisitado, paso 1


Antes de implementar la funcionalidad de la UI(interfaz de usuario), implementemos la funcionalidad requerida por el store.


Tenemos que guardar el número de cada tipo de retroalimentación en el store, por lo que la forma del estado en el store es:

```js
{
  good: 5,
  ok: 4,
  bad: 2
}
```


El proyecto tiene la siguiente base para un reducer:

```js
const initialState = {
  good: 0,
  ok: 0,
  bad: 0
}

const counterReducer = (state = initialState, action) => {
  console.log(action)
  switch (action.type) {
    case 'GOOD':
      return state
    case 'OK':
      return state
    case 'BAD':
      return state
    case 'ZERO':
      return state
  }
  return state
}

export default counterReducer
```


y una base para sus pruebas

```js
import deepFreeze from 'deep-freeze'
import counterReducer from './reducer'

describe('unicafe reducer', () => {
  const initialState = {
    good: 0,
    ok: 0,
    bad: 0
  }

  test('should return a proper initial state when called with undefined state', () => {
    const state = {}
    const action = {
      type: 'DO_NOTHING'
    }

    const newState = counterReducer(undefined, action)
    expect(newState).toEqual(initialState)
  })

  test('good is incremented', () => {
    const action = {
      type: 'GOOD'
    }
    const state = initialState

    deepFreeze(state)
    const newState = counterReducer(state, action)
    expect(newState).toEqual({
      good: 1,
      ok: 0,
      bad: 0
    })
  })
})
```


**Implementar el reducer y sus pruebas.**



En las pruebas, asegúrese de que el reducer sea una <i>función inmutable</i> con la librería <i>deep-freeze</i>. Asegúrese de que se apruebe la primera prueba proporcionada, porque Redux espera que el reducer devuelva un estado original sensible cuando se invoca, de modo que el primer <i>estado</i> del parámetro, que representa el estado anterior, no esté definido(<i>undefined</i>).


Comience expandiendo el reducer para que pasen ambas pruebas. Luego agregue el resto de las pruebas y finalmente la funcionalidad que están probando.


Un buen modelo para el reducer es el ejemplo anterior de [redux-notas](/es/part6/flux_architecture_and_redux#pure-functions-immutable).


#### 6.2: unicafe revisitado, paso 2
Ahora implemente la funcionalidad real de la aplicación.

</div>

<div class="content">

### Formulario no controlado


Agreguemos la funcionalidad para agregar nuevas notas y cambiar su importancia:

```js
const generateId = () =>
  Number((Math.random() * 1000000).toFixed(0))

const App = () => {
  const addNote = (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    store.dispatch({
      type: 'NEW_NOTE',
      data: {
        content,
        important: false,
        id: generateId()
      }
    })
  }

  const toggleImportance = (id) => {
    store.dispatch({
      type: 'TOGGLE_IMPORTANCE',
      data: { id }
    })
  }

  return (
    <div>
      <form onSubmit={addNote}>
        <input name="note" /> 
        <button type="submit">add</button>
      </form>
      <ul>
        {store.getState().map(note =>
          <li
            key={note.id} 
            onClick={() => toggleImportance(note.id)}
          >
            {note.content} <strong>{note.important ? 'important' : ''}</strong>
          </li>
        )}
      </ul>
    </div>
  )
}
```


La implementación de ambas funcionalidades es sencilla. Cabe señalar que <i>no hemos</i> vinculado el estado de los campos del formulario al estado del componente <i>App</i> como lo hicimos anteriormente. React llama a este tipo de formulario [no controlado](https://reactjs.org/docs/uncontrolled-components.html).


>Los formularios no controlados tienen ciertas limitaciones (por ejemplo, no son posibles los mensajes de error dinámicos o la desactivación del botón de envío en función de input). Sin embargo, son adecuados para nuestras necesidades actuales.

Puede leer más sobre formularios no controlados [aquí](https://goshakkk.name/controlled-vs-uncontrolled-inputs-react/).


El método de manejo de agregar nuevas notas es simple, simplemente envía la acción para agregar notas: 

```js
addNote = (event) => {
  event.preventDefault()
  const content = event.target.note.value  // highlight-line
  event.target.note.value = ''
  store.dispatch({
    type: 'NEW_NOTE',
    data: {
      content,
      important: false,
      id: generateId()
    }
  })
}
```


Podemos obtener el contenido de la nueva nota directamente desde el campo del formulario. Debido a que el campo tiene un nombre, podemos acceder al contenido a través del objeto de evento <i>event.target.note.value</i>. 

```js
<form onSubmit={addNote}>
  <input name="note" /> // highlight-line
  <button type="submit">add</button>
</form>
```


La importancia de una nota se puede cambiar haciendo clic en su nombre. El controlador de eventos es muy simple:

```js
toggleImportance = (id) => {
  store.dispatch({
    type: 'TOGGLE_IMPORTANCE',
    data: { id }
  })
}
```

### Creadores de acciones

Comenzamos a notar que, incluso en aplicaciones tan simples como la nuestra, usar Redux puede simplificar el código de la interfaz. Sin embargo, podemos hacerlo mucho mejor.

En realidad, no es necesario que los componentes de React conozcan los tipos y formas de acción de Redux. Separemos la creación de acciones en sus propias funciones:

```js
const createNote = (content) => {
  return {
    type: 'NEW_NOTE',
    data: {
      content,
      important: false,
      id: generateId()
    }
  }
}

const toggleImportanceOf = (id) => {
  return {
    type: 'TOGGLE_IMPORTANCE',
    data: { id }
  }
}
```

Las funciones que crean acciones se denominan [creadores de acciones](https://redux.js.org/advanced/async-actions#synchronous-action-creators).

El componente <i>App</i> ya no tiene que saber nada sobre la representación interna de las acciones, solo obtiene la acción correcta llamando a la función creator:
Functions that create actions are called [action creators](https://redux.js.org/advanced/async-actions#synchronous-action-creators).

```js
const App = () => {
  const addNote = (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    store.dispatch(createNote(content)) // highlight-line
    
  }
  
  const toggleImportance = (id) => {
    store.dispatch(toggleImportanceOf(id))// highlight-line
  }

  // ...
}
```


### Reenvío de Redux-Store a varios componentes

Aparte del reducer, nuestra aplicación está en un solo archivo. Esto, por supuesto, no es sensato, y deberíamos separar <i>App</i> en su propio módulo.

Ahora la pregunta es, ¿cómo puede <i>App</i> acceder al store después de moverlo? Y en términos más generales, cuando un componente está compuesto por muchos componentes más pequeños, debe haber una forma para que todos los componentes accedan al store.

Hay varias formas de compartir el store redux con componentes. Primero veremos la forma más nueva, y posiblemente la más fácil, usando la api de [hooks](https://react-redux.js.org/api/hooks) de la librería [react-redux](https://react-redux.js.org/).


Primero instalamos react-redux

```bash
npm install react-redux
```

A continuación movemos el componente _App_ en su propio archivo _app.js_. Veamos cómo afecta esto al resto de los archivos de la aplicación.

_Index.js_ se convierte en:

```js
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux' // highlight-line
import App from './App'
import noteReducer from './reducers/noteReducer'

const store = createStore(noteReducer)

ReactDOM.render(
  <Provider store={store}>  // highlight-line
    <App />
  </Provider>,  // highlight-line
  document.getElementById('root')
)
```

Tenga en cuenta que la aplicación ahora se define como un elemento secundario de un componente [Proveedor](https://react-redux.js.org/api/provider) proporcionado por la librería react redux. El store de la aplicación se entrega al Proveedor como su store de atributos.

La definición de los creadores de acciones se ha movido al archivo  <i>reducers/noteReducer.js</i> donde se define el reducer. El archivo se ve así:

```js
const noteReducer = (state = [], action) => {
  // ...
}

const generateId = () =>
  Number((Math.random() * 1000000).toFixed(0))

export const createNote = (content) => { // highlight-line
  return {
    type: 'NEW_NOTE',
    data: {
      content,
      important: false,
      id: generateId()
    }
  }
}

export const toggleImportanceOf = (id) => { // highlight-line
  return {
    type: 'TOGGLE_IMPORTANCE',
    data: { id }
  }
}

export default noteReducer
```

Si la aplicación tiene muchos componentes que necesitan el store, el componente <i>App</i> debe pasar <i>store</i> como props a todos esos componentes.

El módulo ahora tiene varios comandos de [export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export).

La función del reducer todavía se devuelve con el comando de <i>export default</i>, por lo que el reducer se puede importar de la forma habitual:

```js
import noteReducer from './reducers/noteReducer'
```

Un módulo solo puede tener un <i>default export</i>, pero varias exportaciones "normales"

```js
export const createNote = (content) => {
  // ...
}

export const toggleImportanceOf = (id) => { 
  // ...
}
```


Normalmente (no como los default export) las funciones exportadas se pueden importar con la sintaxis de llaves:

```js
import { createNote } from './../reducers/noteReducer'
```

Codigo para el componente <i>App</i>

```js
import React from 'react'
import { 
  createNote, toggleImportanceOf
} from './reducers/noteReducer' 
import { useSelector, useDispatch } from 'react-redux'  // highlight-line


const App = () => {
  const dispatch = useDispatch()  // highlight-line
  const notes = useSelector(state => state)  // highlight-line

  const addNote = (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    dispatch(createNote(content))  // highlight-line
  }

  const toggleImportance = (id) => {
    dispatch(toggleImportanceOf(id)) // highlight-line
  }

  return (
    <div>
      <form onSubmit={addNote}>
        <input name="note" /> 
        <button type="submit">add</button>
      </form>
      <ul>
        {notes.map(note =>  // highlight-line
          <li
            key={note.id} 
            onClick={() => toggleImportance(note.id)}
          >
            {note.content} <strong>{note.important ? 'important' : ''}</strong>
          </li>
        )}
      </ul>
    </div>
  )
}

export default App
```

Hay algunas cosas a tener en cuenta en el código. Anteriormente, el código despachaba acciones invocando al método dispatch de redux-store:

```js
store.dispatch({
  type: 'TOGGLE_IMPORTANCE',
  data: { id }
})
```

Ahora lo hace con la función <i>dispatch</i> del hook [useDispatch](https://react-redux.js.org/api/hooks#usedispatch).

```js
import { useSelector, useDispatch } from 'react-redux'  // highlight-line

const App = () => {
  const dispatch = useDispatch()  // highlight-line
  // ...

  const toggleImportance = (id) => {
    dispatch(toggleImportanceOf(id)) // highlight-line
  }

  // ...
}
```

El hook <i>useDispatch</i> proporciona acceso a cualquier componente de React a la función dispatch de redux-store definida en <i>index.js</i>. Esto permite que todos los componentes realicen cambios en el estado de redux-store.

El componente puede acceder a las notas almacenadas en el store con el hook [useSelector](https://react-redux.js.org/api/hooks#useselector) de la librería react-redux.


```js
import { useSelector, useDispatch } from 'react-redux'  // highlight-line

const App = () => {
  // ...
  const notes = useSelector(state => state)  // highlight-line
  // ...
}
```

<i>useSelector</i> recibe una función como parámetro. La función busca o selecciona datos del store redux. Aquí necesitamos todas las notas, por lo que nuestra función de selector devuelve el estado completo:


```js
state => state
```

que es una abreviatura de

```js
(state) => {
  return state
}
```

Por lo general, las funciones de selector son un poco más interesantes y solo devuelven partes seleccionadas del contenido del store redux. Por ejemplo, podríamos devolver solo notas marcadas como importantes:

```js
const importantNotes = useSelector(state => state.filter(note => note.important))  
```

### Más componentes

Separemos la creación de una nueva nota en su propio componente.

```js
import React from 'react'
import { useDispatch } from 'react-redux' // highlight-line
import { createNote } from '../reducers/noteReducer' // highlight-line

const NewNote = (props) => {
  const dispatch = useDispatch() // highlight-line

  const addNote = (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    dispatch(createNote(content)) // highlight-line
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

A diferencia del código de React que hicimos sin Redux, el controlador de eventos para cambiar el estado de la aplicación (que ahora vive en Redux) se ha movido de <i>App</i> a un componente secundario. La lógica para cambiar el estado en Redux todavía está claramente separada de toda la parte de React de la aplicación.


También separaremos la lista de notas y mostraremos una sola nota en sus propios componentes (que se colocarán en el archivo <i>Notes.js</i>):

```js
import React from 'react'
import { useDispatch, useSelector } from 'react-redux' // highlight-line
import { toggleImportanceOf } from '../reducers/noteReducer' // highlight-line

const Note = ({ note, handleClick }) => {
  return(
    <li onClick={handleClick}>
      {note.content} 
      <strong> {note.important ? 'important' : ''}</strong>
    </li>
  )
}

const Notes = () => {
  const dispatch = useDispatch() // highlight-line
  const notes = useSelector(state => state) // highlight-line

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

export default Notes
```

La lógica para cambiar la importancia de una nota ahora está en el componente que administra la lista de notas.


No queda mucho código en <i>App</i>:

```js
const App = () => {

  return (
    <div>
      <NewNote />
      <Notes  />
    </div>
  )
}
```

<i>Note</i>, responsable de representar una sola nota, es muy simple y no es consciente de que el controlador de eventos que obtiene como props distribuye una acción. Este tipo de componentes se denominan [presentacionales](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) en la terminología de React.


<i>Notes</i>, por otro lado, es un componente [contenedor](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0), ya que contiene cierta lógica de aplicación: define lo que hacen los controladores de eventos de los componentes <i>Note</i> y coordina la configuración de los componentes <i>presentacionales</i>, es decir, los <i>Note</i>s.


Regresaremos a la división de presentacional/contenedor más adelante en esta parte.

El código de la aplicación Redux se puede encontrar en [Github](https://github.com/fullstack-hy2020/redux-notes/tree/part6-1), rama <i>part6-1</i>.

</div>

<div class="tasks">

### Ejercicios 6.3.-6.8.


Hagamos una nueva versión de la aplicación de votación de anécdotas de la parte 1. Tome el proyecto de este repositorio https://github.com/fullstack-hy2020/redux-anecdotes para basar su solución.

Si clona el proyecto en un repositorio de git existente, <i>elimine la configuración de git de la aplicación clonada:</i>

```bash
cd redux-anecdotes  // go to the cloned repository
rm -rf .git
```


La aplicación se puede iniciar como de costumbre, pero primero debe instalar las dependencias:

```bash
npm install
npm start
```


Después de completar estos ejercicios, su aplicación debería verse así:

![](../../images/6/3.png)

#### 6.3: anécdotas, paso 1


Implementar la funcionalidad para votar anécdotas. La cantidad de votos debe guardarse en una Redux-store.

#### 6.4: anécdotas, paso 2


Implementar la funcionalidad para agregar nuevas anécdotas.


Puede mantener el formulario no controlado, como hicimos [antes](es/part6/flux_architecture_and_redux#uncontrolled-form).

#### 6.5*: anécdotas, paso 3


Asegúrese de que las anécdotas estén ordenadas por número de votos.

#### 6.6: anécdotas, paso 4


Si aún no lo ha hecho, separe la creación de objetos de acción en funciones de [creador de acciones](https://redux.js.org/basics/actions#action-creators) y colóquelos en el archivo <i>src/reducers/anecdoteReducer.js</i>, así que haga lo que hemos estado haciendo desde el capítulo [creadores de acciones](/es/part6/flux_architecture_and_redux#action-creators).

#### 6.7: anécdotas, paso 5


Separe la creación de nuevas anécdotas en su propio componente llamado <i>AnecdoteForm</i>. Mueva toda la lógica para crear una nueva anécdota en este nuevo componente.

#### 6.8: anécdotas, paso 6


Separe la representación de la lista de anécdotas en su propio componente llamado <i>AnecdoteList</i>. Mueva toda la lógica relacionada con la votación de una anécdota a este nuevo componente.


Ahora, el componente <i>App</i> debería verse así:

```js
import React from 'react'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'

const App = () => {
  return (
    <div>
      <h2>Anecdotes</h2>
      <AnecdoteForm />
      <AnecdoteList  />
    </div>
  )
}

export default App
```
</div>
