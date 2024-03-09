---
mainImage: ../../../images/part-6.svg
part: 6
letter: a
lang: es
---

<div class="content">

Hasta ahora, hemos seguido las convenciones de gestión de estado recomendadas por React. Hemos colocado el estado y las funciones para manejarlo en el [nivel superior](https://es.react.dev/learn/sharing-state-between-components) de la estructura de componentes de la aplicación. A menudo, la mayoría del estado de la aplicación y los métodos para modificarlo residen directamente en el componente raíz. Luego, el estado y sus métodos de control se han pasado a otros componentes con props. Esto funciona hasta cierto punto, pero cuando las aplicaciones crecen, la gestión del estado se vuelve desafiante.

### Arquitectura de Flux

Facebook desarrolló la arquitectura [Flux](https://facebookarchive.github.io/flux/docs/in-depth-overview/) para facilitar la gestión del estado. En Flux, el estado se separa completamente de los componentes de React en sus propios <i>stores</i>(almacenes).
El estado en el store no se cambia directamente, sino con diferentes <i>actions</i>(acciones).

Cuando una acción cambia el estado de un store, las vistas se vuelven a generar:

![diagrama action->dispatcher->store->view](../../images/6/flux1.png)

Si alguna acción en la aplicación, por ejemplo presionar un botón, provoca la necesidad de cambiar el estado, el cambio se realiza con una acción.
Esto hace que se vuelva a renderizar la vista:

![mismo diagrama que arriba pero con la acción retrocediendo](../../images/6/flux2.png)

Flux ofrece una manera estándar de cómo y dónde se mantiene el estado de la aplicación y cómo se modifica.

### Redux

Facebook tiene una implementación para Flux, pero usaremos la librería [Redux](https://redux.js.org). Funciona con el mismo principio, pero es un poco más sencilla. Facebook también usa Redux ahora en lugar de su Flux original.

Conoceremos Redux implementando una aplicación de contador una vez más:

![aplicación de contador en el navegador](../../images/6/1.png)

Crea una nueva aplicación Vite e instala <i>redux</i> con el comando

```bash
npm install redux
```

Como en Flux, en Redux el estado también se almacena en un [store](https://redux.js.org/tutorials/essentials/part-1-overview-concepts#store).

Todo el estado de la aplicación se almacena en <i>un</i> objeto JavaScript en el store. Debido a que nuestra aplicación solo necesita el valor del contador, lo guardaremos directamente en el store. Si el estado fuera más complicado, diferentes elementos del estado se guardarían como campos separados del objeto.

El estado del store se cambia con [acciones](https://redux.js.org/tutorials/essentials/part-1-overview-concepts#actions). Las acciones son objetos que tienen al menos un campo que determina el <i>tipo</i> de acción.
Nuestra aplicación necesita, por ejemplo, la siguiente acción:

```js
{
  type: 'INCREMENT'
}
```

Si hay datos relacionados con la acción, se pueden declarar otros campos según sea necesario. Sin embargo, nuestra aplicación de contador es tan simple que las acciones están bien con solo el campo de tipo.

El impacto de la acción sobre el estado de la aplicación se define mediante un [reducer](https://redux.js.org/tutorials/essentials/part-1-overview-concepts#reducers). En la práctica, un reducer es una función a la que se le da el estado actual y una acción como parámetros. <i>Devuelve</i> un nuevo estado.

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

El primer parámetro es el <i>estado</i> en el store. El reducer devuelve un <i>nuevo estado</i> basado en el tipo de _acción_. Entonces, por ejemplo, cuando el tipo de acción es <i>INCREMENT</i>, el estado obtiene el valor antiguo más uno. Si el tipo de acción es <i>ZERO</i>, el nuevo valor del estado es cero.

Cambiemos un poco el código. Hemos utilizado declaraciones if-else para responder a una acción y cambiar el estado. Sin embargo, la declaración [switch](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/switch) es el enfoque más común para escribir un reducer.

También definamos un [valor predeterminado](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Functions/Default_parameters) de 0 para el parámetro <i>state</i>. Ahora, el reducer funciona incluso si el estado del store aún no se ha inicializado.

```js
// highlight-start
const counterReducer = (state = 0, action) => {
  // highlight-end
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

El reducer nunca debe ser llamado directamente desde el código de la aplicación. Solo es proporcionado como parámetro a la función _createStore_ que crea el store:

```js
// highlight-start
import { createStore } from 'redux'
// highlight-end

const counterReducer = (state = 0, action) => {
  // ...
}

// highlight-start
const store = createStore(counterReducer)
// highlight-end
```

El store ahora usa el reducer para manejar <i>acciones</i>, que son <i>dispatched</i> o 'enviadas' al store con su método [dispatch](https://redux.js.org/tutorials/essentials/part-1-overview-concepts#dispatch)(envío).

```js
store.dispatch({type: 'INCREMENT'})
```

Puedes averiguar el estado del store utilizando el método [getState](https://redux.js.org/api/store#getstate).

Por ejemplo, el siguiente código:

```js
const store = createStore(counterReducer)
console.log(store.getState())
store.dispatch({ type: 'INCREMENT' })
store.dispatch({ type: 'INCREMENT' })
store.dispatch({ type: 'INCREMENT' })
console.log(store.getState())
store.dispatch({ type: 'ZERO' })
store.dispatch({ type: 'DECREMENT' })
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

Si, por ejemplo, añadiéramos la siguiente función para suscribirnos, <i>todos los cambios en el store</i> se imprimirían en la consola.

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

El código de nuestra aplicación de contador es el siguiente. Todo el código se ha escrito en el mismo archivo, por lo que <i>store</i> está directamente disponible para el código React. Más adelante conoceremos mejores formas de estructurar el código React/Redux.

```js
import React from 'react'
import ReactDOM from 'react-dom/client'

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

const root = ReactDOM.createRoot(document.getElementById('root'))

const renderApp = () => {
  root.render(<App />)
}

renderApp()
store.subscribe(renderApp)
```

Hay algunas cosas notables en el código.
<i>App</i> muestra el valor del contador solicitándolo al store con el método _store.getState()_. Los controladores de acciones de los botones envían (<i>dispatch</i>) las acciones correctas al store.

Cuando se cambia el estado del store, React no puede volver a re-renderizar automáticamente la aplicación. Por lo tanto, hemos registrado una función _renderApp_ , que renderiza toda la aplicación, para escuchar cambios en el store con el método _store.subscribe_. Ten en cuenta que tenemos que invocar inmediatamente al método _renderApp_. Sin la invocación, el primer renderizado de la aplicación nunca se produciría.

### Una nota sobre el uso de createStore

Los más atentos notarán que el nombre de la función createStore está tachado. Si pasas el mouse sobre el nombre, aparecerá una explicación

![mensaje de error de vscode: createStore esta obsoleto, usa configureStore en su lugar](../../images/6/30new.png)

La explicación completa es la siguiente:

><i>Recomendamos utilizar el método configureStore del paquete @reduxjs/toolkit, que reemplaza a createStore.</i>
>
><i>Redux Toolkit es nuestro enfoque recomendado para escribir la lógica de Redux hoy, incluida la configuración de store, reducers, la obtención de datos y más.</i>
>
><i>Para obtener más detalles, lea esta página de documentación de Redux: <https://redux.js.org/introduction/why-rtk-is-redux-today></i>
>
><i>configureStore de Redux Toolkit es una versión mejorada de createStore que simplifica la configuración y ayuda a evitar errores comunes.</i>
>
><i>No deberías usar el paquete principal de redux por sí solo hoy en día, excepto con fines de aprendizaje. El método createStore del paquete core de redux no se eliminará, pero alentamos a todos los usuarios a migrar al uso de Redux Toolkit para todo el código de Redux.</i>

Entonces, en lugar de la función <i>createStore</i>, se recomienda usar la función un poco más "avanzada" <i>configureStore</i>, y también la usaremos cuando nos hayamos hecho cargo de la funcionalidad básica de Redux.

Nota adicional: <i>createStore</i> se define como "obsoleto", lo que generalmente significa que la función se eliminará en alguna versión más nueva de la librería. La explicación anterior y esta [discusión](https://stackoverflow.com/questions/71944111/redux-createstore-is-deprecated-cannot-get-state-from-getstate-in-redux-ac) revelan que <i>createStore</i> no se eliminará y se le ha dado el estado <i>obsoleto</i>, quizás por motivos ligeramente incorrectos. Por lo tanto, la función no está obsoleta, pero hoy en día existe una forma nueva y preferible de hacer casi lo mismo.

### Redux-notas

Nuestro objetivo es modificar nuestra aplicación de notas para utilizar Redux para la gestión del estado. Sin embargo, primero cubramos algunos conceptos clave a través de una aplicación de notas simplificada.

La primera versión de nuestra aplicación es la siguiente

```js
const noteReducer = (state = [], action) => {
  if (action.type === 'NEW_NOTE') {
    state.push(action.payload)
    return state
  }

  return state
}

const store = createStore(noteReducer)

store.dispatch({
  type: 'NEW_NOTE',
  payload: {
    content: 'the app state is in redux store',
    important: true,
    id: 1
  }
})

store.dispatch({
  type: 'NEW_NOTE',
  payload: {
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

Hasta el momento la aplicación no tiene la funcionalidad para agregar nuevas notas, aunque es posible hacerlo enviando acciones <i>NEW\_NOTE</i>.

Ahora las acciones tienen un tipo y un campo <i>payload</i> (carga), que contiene la nota a agregar:

```js
{
  type: 'NEW_NOTE',
  payload: {
    content: 'state changes are made with actions',
    important: false,
    id: 2
  }
}
```

La elección del nombre del campo es arbitraria. La convención es que las acciones tengan exactamente dos campos, <i>type</i> diciendo el tipo y <i>payload</i> conteniendo los datos incluidos en la acción.

### Funciones puras, inmutables

La versión inicial del reducer es muy sencilla:

```js
const noteReducer = (state = [], action) => {
  if (action.type === 'NEW_NOTE') {
    state.push(action.payload)
    return state
  }

  return state
}
```

El estado ahora es un Array. Las acciones de tipo <i>NEW\_NOTE</i> hacen que se agregue una nueva nota al estado con el método [push](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/push).

La aplicación parece estar funcionando, pero el reducer que hemos declarado es malo. Rompe el [supuesto básico](https://redux.js.org/tutorials/essentials/part-1-overview-concepts#reducers) de que los reducers deben ser [funciones puras](https://es.wikipedia.org/wiki/Programaci%C3%B3n_funcional#Funciones_puras).

Las funciones puras son aquellas que <i>no causan ningún efecto secundario</i> y siempre deben devolver la misma respuesta cuando se llaman con los mismos parámetros.

Agregamos una nueva nota al estado con el método _state.push(action.payload)_ que <i>cambia</i> el estado del objeto-estado. Esto no está permitido. El problema se resuelve fácilmente utilizando el método [concat](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/concat), que crea un <i>nuevo array</i>, que contiene todos los elementos del array anterior y el nuevo elemento:
 
```js
const noteReducer = (state = [], action) => {
  if (action.type === 'NEW_NOTE') {
    // highlight-start
    return state.concat(action.payload)
    // highlight-end
  }

  return state
}
```

El estado de un reducer debe estar compuesto por objetos [inmutables](https://es.wikipedia.org/wiki/Objeto_inmutable). Si hay un cambio en el estado, el objeto antiguo no se cambia, sino que se <i>reemplaza por un objeto nuevo modificado</i>. Esto es exactamente lo que hicimos con el nuevo reducer: el array anterior se reemplaza por el nuevo.

Ampliemos nuestro reducer para que pueda manejar el cambio de importancia de una nota:

```js
{
  type: 'TOGGLE_IMPORTANCE',
  payload: {
    id: 2
  }
}
```

Dado que todavía no tenemos ningún código que utilice esta funcionalidad, estamos expandiendo el reducer en la forma 'test driven' (guiada por pruebas). Comencemos creando una prueba para manejar la acción <i>NEW\_NOTE</i>.

Tenemos que configurar primero la biblioteca de pruebas [Jest](https://jestjs.io/) para el proyecto. Vamos a instalar las siguientes dependencias:

```js
npm install --save-dev jest @babel/preset-env @babel/preset-react eslint-plugin-jest
```

A continuación crearemos el archivo <i>.babelrc</i>, con el siguiente contenido:

```json
{
  "presets": [
    "@babel/preset-env",
    ["@babel/preset-react", { "runtime": "automatic" }]
  ]
}
```

Expandamos <i>package.json</i> con un script para ejecutar las pruebas:

```json
{
  // ...
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "test": "jest" // highlight-line
  },
  // ...
}
```

Y finalmente, <i>.eslint.cjs</i> necesita ser modificado de la siguiente manera:

```js
module.exports = {
  root: true,
  env: { 
    browser: true,
    es2020: true,
    "jest/globals": true // highlight-line
  },
  // ...
}
```

Para hacer las pruebas más fáciles, primero trasladaremos el código del reducer a su propio módulo, al archivo <i>src/reducers/noteReducer.js</i>. También agregaremos la librería [deep-freeze](https://www.npmjs.com/package/deep-freeze), que se puede usar para garantizar que el reducer se haya definido correctamente como una función inmutable.
Instalemos la librería como una dependencia de desarrollo:

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
      payload: {
        content: 'the app state is in redux store',
        important: true,
        id: 1
      }
    }

    deepFreeze(state)
    const newState = noteReducer(state, action)

    expect(newState).toHaveLength(1)
    expect(newState).toContainEqual(action.payload)
  })
})
```

El comando <i>deepFreeze(state)</i> asegura que el reducer no cambie el estado del store que se le dio como parámetro. Si el reducer usa el comando _push_ para manipular el estado, la prueba no pasará

![terminal mostrando test fallando y error acerca de no usar array.push](../../images/6/2.png)

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
    payload: {
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
  payload: {
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
      return state.concat(action.payload)
    case 'TOGGLE_IMPORTANCE': {
      const id = action.payload.id
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

Creamos una copia de la nota cuya importancia ha cambiado con la sintaxis [de la parte 2](/es/part2/alterando_datos_en_el_servidor#cambiar-la-importancia-de-las-notas), y reemplazamos el estado con un nuevo estado que contiene todas las notas que no han cambiado y la copia de la nota cambiada <i>changedNote</i>.

Recapitulemos lo que sucede en el código. Primero, buscamos un objeto de nota específico, cuya importancia queremos cambiar:

```js
const noteToChange = state.find(n => n.id === id)
```

luego creamos un nuevo objeto, que es una <i>copia</i> de la nota original, solo el valor del campo <i>important</i> se ha cambiado a lo opuesto de lo que era:

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

Agregar una nueva nota crea el estado devuelto por la función de Arrays _concat_. Echemos un vistazo a cómo podemos lograr lo mismo usando la sintaxis [array spread](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Spread_syntax) de JavaScript:

```js
const noteReducer = (state = [], action) => {
  switch(action.type) {
    case 'NEW_NOTE':
      // highlight-start
      return [...state, action.payload]
      // highlight-end
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

<code>...numbers</code> divide el array en elementos individuales, que se pueden colocar en otro array.

```js
[...numbers, 4, 5]
```

y el resultado es un array <i>[1, 2, 3, 4, 5]</i>.

Si hubiéramos colocado el array en otro array sin el spread

```js
[numbers, 4, 5]
```

el resultado habría sido <i>[ [1, 2, 3], 4, 5]</i>.

Cuando tomamos elementos de un array mediante la [desestructuración](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment), se usa una sintaxis similar para <i>juntar</i> el resto de los elementos:

```js
const numbers = [1, 2, 3, 4, 5, 6]

const [first, second, ...rest] = numbers

console.log(first)     // imprime 1
console.log(second)   // imprime 2
console.log(rest)     // imprime [3, 4, 5, 6]
```

</div>

<div class="tasks">

### Ejercicios 6.1.-6.2.

Hagamos una versión simplificada del ejercicio unicafe de la parte 1. Manejemos la administración del estado con Redux.

Puedes tomar el código de este repositorio https://github.com/fullstack-hy2020/unicafe-redux para la base de tu proyecto.

<i>Comienza eliminando la configuración git del repositorio clonado e instalando dependencias</i>

```bash
cd unicafe-redux   // go to the directory of cloned repository
rm -rf .git
npm install
```

#### 6.1: Unicafe Revisitado, paso 1

Antes de implementar la funcionalidad de la UI(interfaz de usuario), implementemos la funcionalidad requerida por el store.

Tenemos que guardar el número de cada tipo de feedback en el store, por lo que la forma del estado en el store es:

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
    default: return state
  }

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

**Implementa el reducer y sus pruebas.**

En las pruebas, asegúrate de que el reducer sea una <i>función inmutable</i> con la librería <i>deep-freeze</i>.
Asegúrate de que la primera prueba proporcionada pase, porque Redux espera que el reducer devuelva el estado original cuando se llama con un primer parámetro - que representa el <i>estado</i> previo - con el valor <i>undefined</i>.

Comienza expandiendo el reducer para que pasen ambas pruebas. Luego agrega el resto de las pruebas y finalmente la funcionalidad que están probando.

Un buen modelo para el reducer es el ejemplo anterior de [redux-notas](/es/part6/flux_architecture_y_redux#redux-notas).

#### 6.2: Unicafe Revisitado, paso 2

Ahora implementa la funcionalidad real de la aplicación.

Tu aplicación puede tener una apariencia modesta, nada más se necesitan 3 botones y el número de calificaciones para cada tipo:

![botones good bad y ok](../../images/6/50new.png)

</div>

<div class="content">

### Formulario no controlado

Agreguemos la funcionalidad para agregar nuevas notas y cambiar su importancia:

```js
// highlight-start
const generateId = () =>
  Number((Math.random() * 1000000).toFixed(0))
// highlight-end

const App = () => {
  // highlight-start
  const addNote = (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    store.dispatch({
      type: 'NEW_NOTE',
      payload: {
        content,
        important: false,
        id: generateId()
      }
    })
  }
    // highlight-end

  // highlight-start
  const toggleImportance = (id) => {
    store.dispatch({
      type: 'TOGGLE_IMPORTANCE',
      payload: { id }
    })
  }
    // highlight-end

  return (
    <div>
      // highlight-start
      <form onSubmit={addNote}>
        <input name="note" /> 
        <button type="submit">add</button>
      </form>
        // highlight-end
      <ul>
        {store.getState().map(note =>
          <li
            key={note.id} 
            onClick={() => toggleImportance(note.id)}   // highlight-line
          >
            {note.content} <strong>{note.important ? 'important' : ''}</strong>
          </li>
        )}
      </ul>
    </div>
  )
}
```

La implementación de ambas funcionalidades es sencilla. Cabe señalar que <i>no hemos</i> vinculado el estado de los campos del formulario al estado del componente <i>App</i> como lo hicimos anteriormente. React llama a este tipo de formulario [no controlado](https://es.react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable).

>Los formularios no controlados tienen ciertas limitaciones (por ejemplo, no son posibles los mensajes de error dinámicos o la desactivación del botón de envío en función de input). Sin embargo, son adecuados para nuestras necesidades actuales.

Puedes leer más sobre formularios no controlados [aquí](https://goshakkk.name/controlled-vs-uncontrolled-inputs-react/).

El método para agregar nuevas notas es simple, simplemente envía la acción para agregar notas:

```js
addNote = (event) => {
  event.preventDefault()
  const content = event.target.note.value  // highlight-line
  event.target.note.value = ''
  store.dispatch({
    type: 'NEW_NOTE',
    payload: {
      content,
      important: false,
      id: generateId()
    }
  })
}
```

Podemos obtener el contenido de la nueva nota directamente desde el campo del formulario. Debido a que el campo tiene un nombre, podemos acceder al contenido a través del objeto del evento <i>event.target.note.value</i>. 

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
    payload: { id }
  })
}
```

### Action creators

Comenzamos a notar que, incluso en aplicaciones tan simples como la nuestra, usar Redux puede simplificar el código de la interfaz. Sin embargo, podemos hacerlo mucho mejor.

En realidad, no es necesario que los componentes de React conozcan los tipos y formas de acción de Redux.
Separemos la creación de acciones en sus propias funciones:

```js
const createNote = (content) => {
  return {
    type: 'NEW_NOTE',
    payload: {
      content,
      important: false,
      id: generateId()
    }
  }
}

const toggleImportanceOf = (id) => {
  return {
    type: 'TOGGLE_IMPORTANCE',
    payload: { id }
  }
}
```

Las funciones que crean acciones se denominan [action creators](https://redux.js.org/tutorials/essentials/part-1-overview-concepts#action-creators) (creadores de acciones).

El componente <i>App</i> ya no tiene que saber nada sobre la representación interna de las acciones, solo obtiene la acción correcta llamando a la función creadora:

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

### Reenviando Redux-Store a varios componentes

Aparte del reducer, nuestra aplicación está en un solo archivo. Esto, por supuesto, no es sensato, y deberíamos separar <i>App</i> en su propio módulo.

Ahora la pregunta es, ¿cómo puede <i>App</i> acceder al store después de moverlo? Y en términos más generales, cuando un componente está compuesto por muchos componentes más pequeños, debe haber una forma para que todos los componentes accedan al store.
Hay varias formas de compartir el store redux con los componentes. Primero veremos la forma más nueva, y posiblemente la más fácil, usando la api de [hooks](https://react-redux.js.org/api/hooks) de la librería [react-redux](https://react-redux.js.org/).

Primero instalamos react-redux

```bash
npm install react-redux
```

A continuación movemos el componente _App_ en su propio archivo _App.jsx_. Veamos cómo afecta esto al resto de los archivos de la aplicación.

_main.jsx_ se convierte en:

```js
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createStore } from 'redux'
import { Provider } from 'react-redux' // highlight-line

import App from './App'
import noteReducer from './reducers/noteReducer'

const store = createStore(noteReducer)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>  // highlight-line
    <App />
  </Provider>  // highlight-line
)
```

Ten en cuenta que la aplicación ahora se define como un elemento secundario de un componente [Provider](https://react-redux.js.org/api/provider) (proveedor) proporcionado por la librería react-redux.
El store de la aplicación se entrega al Provider como su atributo store.

La definición de los action creators se ha movido al archivo  <i>reducers/noteReducer.js</i> donde se define el reducer. El archivo se ve así:

```js
const noteReducer = (state = [], action) => {
  // ...
}

const generateId = () =>
  Number((Math.random() * 1000000).toFixed(0))

export const createNote = (content) => { // highlight-line
  return {
    type: 'NEW_NOTE',
    payload: {
      content,
      important: false,
      id: generateId()
    }
  }
}

export const toggleImportanceOf = (id) => { // highlight-line
  return {
    type: 'TOGGLE_IMPORTANCE',
    payload: { id }
  }
}

export default noteReducer
```

Si la aplicación tiene muchos componentes que necesitan el store, el componente <i>App</i> debe pasar <i>store</i> como props a todos esos componentes.

El módulo ahora tiene varios comandos de [export](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/export).

La función del reducer todavía se devuelve con el comando de <i>export default</i>, por lo que el reducer se puede importar de la forma habitual:

```js
import noteReducer from './reducers/noteReducer'
```

Un módulo solo puede tener <i>un default export</i>, pero varias exportaciones "normales"

```js
export const createNote = (content) => {
  // ...
}

export const toggleImportanceOf = (id) => { 
  // ...
}
```

Las funciones exportadas normalmente (no como los default) se pueden importar con la sintaxis de llaves:

```js
import { createNote } from '../../reducers/noteReducer'
```

Código para el componente <i>App</i>

```js
import { createNote, toggleImportanceOf } from './reducers/noteReducer' // highlight-line
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
  payload: { id }
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

El hook <i>useDispatch</i> proporciona acceso a cualquier componente de React a la función dispatch de redux-store definida en <i>main.jsx</i>. Esto permite que todos los componentes realicen cambios en el estado de Redux store.

El componente puede acceder a las notas almacenadas en el store con el hook [useSelector](https://react-redux.js.org/api/hooks#useselector) de la librería react-redux.

```js
import { useSelector, useDispatch } from 'react-redux'  // highlight-line

const App = () => {
  // ...
  const notes = useSelector(state => state)  // highlight-line
  // ...
}
```

<i>useSelector</i> recibe una función como parámetro. La función busca o selecciona datos del store de Redux.
Aquí necesitamos todas las notas, por lo que nuestra función de selector devuelve el estado completo:


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

La versión actual de la aplicación se puede encontrar en [GitHub](https://github.com/fullstack-hy2020/redux-notes/tree/part6-0), en la rama <i>part6-0</i>.

### Más componentes

Separemos la creación de una nueva nota en su propio componente.

```js
import { useDispatch } from 'react-redux' // highlight-line
import { createNote } from '../reducers/noteReducer' // highlight-line

const NewNote = () => {
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

A diferencia del código de React que hicimos sin Redux, el controlador de eventos para cambiar el estado de la aplicación (que ahora vive en Redux) se ha movido de <i>App</i> a un componente hijo. La lógica para cambiar el estado en Redux todavía está claramente separada de toda la parte de React de la aplicación.

También separaremos la lista de notas y mostraremos una sola nota en sus propios componentes (que se colocarán en el archivo <i>Notes.jsx</i>):

```js
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
      <Notes />
    </div>
  )
}
```

<i>Note</i>, responsable de representar una sola nota, es muy simple y no es consciente de que el controlador de eventos que obtiene como props despacha una acción. Este tipo de componentes se denominan [presentacionales](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) en la terminología de React.

<i>Notes</i>, por otro lado, es un componente [contenedor](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0), ya que contiene cierta lógica de aplicación: define lo que hacen los controladores de eventos de los componentes <i>Note</i> y coordina la configuración de los componentes <i>presentacionales</i>, es decir, los <i>Note</i>s.

El código de la aplicación Redux se puede encontrar en [GitHub](https://github.com/fullstack-hy2020/redux-notes/tree/part6-1), en la rama <i>part6-1</i>.

</div>

<div class="tasks">

### Ejercicios 6.3.-6.8.

Hagamos una nueva versión de la aplicación de votación de anécdotas de la parte 1. Toma el proyecto de este repositorio https://github.com/fullstack-hy2020/redux-anecdotes como base de tu solución.

Si clonas el proyecto en un repositorio de git existente, <i>elimina la configuración de git de la aplicación clonada:</i>

```bash
cd redux-anecdotes  // go to the cloned repository
rm -rf .git
```

La aplicación se puede iniciar como de costumbre, pero primero debes instalar las dependencias:

```bash
npm install
npm run dev
```

Después de completar estos ejercicios, tu aplicación debería verse así:

![navegador mostrando anécdotas y botones para votarlas](../../images/6/3.png)

#### 6.3: Anécdotas, paso 1

Implementa la funcionalidad para votar anécdotas. La cantidad de votos debe guardarse en una store de Redux.

#### 6.4: Anécdotas, paso 2

Implementa la funcionalidad para agregar nuevas anécdotas.

Puedes mantener el formulario no controlado, como hicimos [antes](/es/part6/flux_architecture_y_redux#formulario-no-controlado).

#### 6.5: Anécdotas, paso 3

Asegúrate de que las anécdotas estén ordenadas por número de votos.

#### 6.6: Anécdotas, paso 4

Si aún no lo haz hecho, separa la creación de objetos de acción en funciones [action creator](https://read.reduxbook.com/markdown/part1/04-action-creators.html) y colócalos en el archivo <i>src/reducers/anecdoteReducer.js</i>, así que haz lo que hemos estado haciendo desde el capítulo [action creators](/es/part6/flux_architecture_y_redux#action-creators).

#### 6.7: Anécdotas, paso 5

Separa la creación de nuevas anécdotas en su propio componente llamado <i>AnecdoteForm</i>. Mueve toda la lógica para crear una nueva anécdota en este nuevo componente.

#### 6.8: Anécdotas, paso 6

Separa el renderizado de la lista de anécdotas en su propio componente llamado <i>AnecdoteList</i>. Mueve toda la lógica relacionada con la votación de una anécdota a este nuevo componente.

Ahora, el componente <i>App</i> debería verse así:

```js
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'

const App = () => {
  return (
    <div>
      <h2>Anecdotes</h2>
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App
```

</div>
