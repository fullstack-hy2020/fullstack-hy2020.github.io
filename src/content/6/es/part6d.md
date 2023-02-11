---
mainImage: ../../../images/part-6.svg
part: 6
letter: d
lang: es
---

<div class="content">

Al final de esta parte, analizaremos algunas formas más diferentes de administrar el estado de una aplicación.

Continuemos con la aplicación Note. Nos centraremos en la comunicación con el servidor. Comencemos la aplicación desde cero. La primera versión es la siguiente:

```js
const App = () => {
  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    console.log(content)
  }

  const toggleImportance = (note) => {
    console.log('toggle importance of', note.id)
  }

  const notes = []

  return(
    <div>
      <h2>Notes app</h2>
      <form onSubmit={addNote}>
        <input name="note" />
        <button type="submit">add</button>
      </form>
      {notes.map(note =>
        <li key={note.id} onClick={() => toggleImportance(note)}>
          {note.content} 
          <strong> {note.important ? 'important' : ''}</strong>
        </li>
      )}
    </div>
  )
}

export default App
```

El código inicial está en GitHub en el repositorio [https://github.com/fullstack-hy2020/Query-notes](https://github.com/fullstack-hy2020/query-notes/tree/part6-0) en la rama <i> part6-0 </i>.

### Administrar datos en el servidor con la librería React Query

Ahora usaremos la librería [React Query](https://react-query-v3.tanstack.com/) para almacenar y administrar los datos recuperados del servidor.

Instale la biblioteca con el comando

```bash
npm install react-query
```

Se necesitan algunas adiciones al archivo <i>index.js</i> para pasar las funciones de la librería a toda la aplicación:

```js
import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from 'react-query' // highlight-line

import App from './App'

const queryClient = new QueryClient() // highlight-line

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}> // highlight-line
    <App />
  </QueryClientProvider> // highlight-line
)
```

Ahora podemos traer las notas en el componente <i>App</i>. El código se expande de la siguiente manera:

```js
import { useQuery } from 'react-query'  // highlight-line
import axios from 'axios'  // highlight-line

const App = () => {
  // ...

   // highlight-start
  const result = useQuery(
    'notes',
    () => axios.get('http://localhost:3001/notes').then(res => res.data)
  )

  console.log(result)
  // highlight-end

  // highlight-start
  if ( result.isLoading ) {
    return <div>loading data...</div>
  }
  // highlight-end

  const notes = result.data  // highlight-line

  return (
    // ...
  )
}
```

La recuperación de datos del servidor aún se realiza de la forma familiar con el método <i>get</i> de Axios. Sin embargo, la llamada al método Axios ahora está envuelta en una [consulta](https://react-query-v3.tanstack.com/guides/queries) formada con la función[useQuery](https://react-query-v3. tanstack.com/reference/useQuery). El primer parámetro de la llamada a la función es una cadena <i>notas</i> que actúa como una [clave](https://react-query-v3.tanstack.com/guides/query-keys) para la consulta definida , es decir, la lista de notas.

El valor de retorno de la función <i>useQuery</i> es un objeto que indica el estado de la consulta. La salida a la consola ilustra la situación:

![](../../images/6/60new.png)

Es decir, la primera vez que se procesa el componente, la consulta todavía está en estado <i>loading/cargando</i>, es decir, la solicitud HTTP asociada está pendiente. En esta etapa, solo se procesa lo siguiente:

```
<div>loading data...</div>
```

Sin embargo, la solicitud HTTP se completa tan rápido que incluso los más astutos no podrán ver el texto. Cuando se completa la solicitud, el componente se representa de nuevo. La consulta está en el estado <i>success</i> en la segunda representación, y el campo <i>data</i> del objeto de consulta contiene los datos devueltos por la solicitud, es decir, la lista de notas que se presentan en la pantalla.

Entonces, la aplicación recupera datos del servidor y los representa en la pantalla sin usar los Hooks de React <i>useState</i> y <i>useEffect</i> usados en los capítulos 2-5. ¡Los datos en el servidor ahora están completamente bajo la administración de la librería React Query, y la aplicación no necesita el estado definido con el Hook de React <i>useState</i> en absoluto!

Movamos la función que realiza la solicitud HTTP a su propio archivo <i>requests.js</i>

```js
import axios from 'axios'

export const getNotes = () =>
  axios.get('http://localhost:3001/notes').then(res => res.data)
```

El componente <i>App</i> ahora se simplifica ligeramente:

```js
import { useQuery } from 'react-query' 
import { getNotes } from './requests' // highlight-line

const App = () => {
  // ...

  const result = useQuery('notes', getNotes)  // highlight-line

  // ...
}
```

El código actual de la aplicación está en [GitHub](https://github.com/fullstack-hy2020/query-notes/tree/part6-1) en la rama <i>part6-1</i>.

### Sincronización de datos con el servidor usando React Query

Los datos ya se han recuperado correctamente del servidor. A continuación, nos aseguraremos de que los datos agregados y modificados se almacenen en el servidor. Comencemos agregando nuevas notas.

Hagamos una función <i>createNote</i> en el archivo <i>requests.js</i> para guardar nuevas notas:

```js
import axios from 'axios'

const baseUrl = 'http://localhost:3001/notes'

export const getNotes = () =>
  axios.get(baseUrl).then(res => res.data)

export const createNote = newNote => // highlight-line
  axios.post(baseUrl, newNote).then(res => res.data) // highlight-line
```

El componente <i>App</i> cambiará de la siguiente manera:

```js
import { useQuery, useMutation } from 'react-query' // highlight-line
import { getNotes, createNote } from './requests' // highlight-line

const App = () => {
  const newNoteMutation = useMutation(createNote) // highlight-line

  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    newNoteMutation.mutate({ content, important: true }) // highlight-line
  }

  // 

}
```

Para crear una nueva nota, se define una [mutación](https://react-query-v3.tanstack.com/guides/mutations) usando la función [useMutation](https://react-query-v3.tanstack.com/reference/useMutation):

```js
const newNoteMutation = useMutation(createNote)
```

El parámetro es la función que agregamos al archivo <i>requests.js</i>, que usa Axios para enviar una nueva nota al servidor.

El controlador de eventos <i>addNote</i> realiza la mutación llamando a la función <i>mutate</i> del objeto de mutación y pasando la nueva nota como parámetro:

```js
newNoteMutation.mutate({ content, important: true })
```

Nuestra solución es buena. Excepto que no funciona. La nueva nota se guarda en el servidor, pero no se actualiza en la pantalla.

Para renderizar una nueva nota, debemos decirle a React Query que el resultado antiguo de la consulta cuya clave es el sring <i>notes</i> debe ser [invalidado](https://react-query-v3.tanstack.com/guides/invalidations-from-mutations).

Afortunadamente, la invalidación es fácil, se puede hacer definiendo la función de devolución de llamada <i>onSuccess</i> apropiada para la mutación:

```js
import { useQuery, useMutation, useQueryClient } from 'react-query' // highlight-line
import { getNotes, createNote } from './requests'

const App = () => {
  const queryClient = useQueryClient() // highlight-line

  const newNoteMutation = useMutation(createNote, {
    onSuccess: () => {  // highlight-line
      queryClient.invalidateQueries('notes')  // highlight-line
    },
  })

  // ...
}
```

Ahora que la mutación se ha ejecutado con éxito, se realiza una llamada a la función

```js
queryClient.invalidateQueries('notes')
```

Esto en cambio hace que React Query actualice automáticamente la consulta con la clave <i>notes</i>, es decir, recupera/trae las notas del servidor. Como resultado, la aplicación renderiza el estado actualizado en el servidor, es decir, la nota agregada también se representa.

Implementemos también el cambio en la importancia de las notas. Se agrega una función para actualizar notas al archivo <i>requests.js</i>:

```js
export const updateNote = updatedNote =>
  axios.put(`${baseUrl}/${updatedNote.id}`, updatedNote).then(res => res.data)
```

Actualizanr la nota también se hace mediante mutación. El componente <i>App</i> se expande de la siguiente manera:

```js
import { useQuery, useMutation, useQueryClient } from 'react-query' 
import { getNotes, createNote, updateNote } from './requests' // highlight-line

const App = () => {
  // ...

  const updateNoteMutation = useMutation(updateNote, {
    onSuccess: () => {
      queryClient.invalidateQueries('notes')
    },
  })

  const toggleImportance = (note) => {
    updateNoteMutation.mutate({...note, important: !note.important })
  }

  // ...
}
```

De nuevo, se creó una mutación que invalidó la consulta <i>notes</i> para que la nota actualizada se representara correctamente. Usar mutación es fácil, el método <i>mutate</i> recibe una nota como parámetro, la importancia de la cual se ha cambiado a la negación del valor antiguo.

El código actual de la aplicación está en [GitHub](https://github.com/fullstack-hy2020/query-notes/tree/part6-2) en la rama <i>part6-2</i>.

### Optimizando el rendimiento

La aplicación funciona bien y el código es relativamente simple. La facilidad de realizar cambios en la lista de notas es particularmente sorprendente. Por ejemplo, cuando cambiamos la importancia de una nota, invalidar la consulta <i>notes</i> es suficiente para que los datos de la aplicación se actualicen:

```js
  const updateNoteMutation = useMutation(updateNote, {
    onSuccess: () => {
      queryClient.invalidateQueries('notes') // highlight-line
    },
  })
```

La consecuencia de esto, por supuesto, es que después de la solicitud PUT que causa el cambio de nota, la aplicación realiza una nueva solicitud GET para recuperar los datos de la consulta del servidor:

![](../../images/6/61new.png)

Si la cantidad de datos recuperados por la aplicación no es grande, realmente no importa. Después de todo, desde el punto de vista de la funcionalidad del lado del navegador, hacer una solicitud HTTP GET adicional realmente no importa, pero en algunas situaciones podría poner una carga en el servidor.

Si es necesario, también es posible [optimizar el rendimiento manualmente actualizando](https://react-query-v3.tanstack.com/guides/updates-from-mutation-responses) el estado de la consulta mantenido por React Query.

El cambio para la mutación que agrega una nueva nota es el siguiente:

```js
const App = () => {
  const queryClient =  useQueryClient() 

  const newNoteMutation = useMutation(createNote, {
    onSuccess: (newNote) => {
      const notes = queryClient.getQueryData('notes') // highlight-line
      queryClient.setQueryData('notes', notes.concat(newNote)) // highlight-line
    }
  })
  // ...
}
```

Es decir, en el callback de <i>onSuccess</i>, el objeto <i>queryClient</i> primero lee el estado existente de <i>notes</i> de la consulta y lo actualiza agregando una nueva nota, que se obtiene como parámetro de la función de devolución de llamada. El valor del parámetro es el valor devuelto por la función <i>createNote</i>, definida en el archivo <i>requests.js</i> de la siguiente manera:

```js
export const createNote = newNote =>
  axios.post(baseUrl, newNote).then(res => res.data)
```

Seria relativamente fácil hacer un cambio similar a una mutación que cambia la importancia de la nota, pero lo dejamos como un ejercicio opcional.

Si observamos de cerca la pestaña de red del navegador, nos damos cuenta de que React Query recupera todas las notas tan pronto como movemos el cursor al campo de entrada:

![](../../images/6/62new.png)

¿Que es lo que está pasando? Al leer la [documentación](https://react-query-v3.tanstack.com/reference/useQuery), nos damos cuenta de que la funcionalidad predeterminada de las consultas de React Query es que las consultas (cuyo estado es <i>stale</i>) se actualizan cuando <i>window focus</i>, es decir, el elemento activo de la interfaz de usuario de la aplicación, cambia. Si queremos, podemos desactivar la funcionalidad creando una consulta de la siguiente manera:

```js
const App = () => {
  // ...
  const result = useQuery('notes', getNotes, {
    refetchOnWindowFocus: false  // highlight-line
  })

  // ...
}
```

Si colocas una instrucción <i>console.log</i> en el código, puede ver desde la consola del navegador cuántas veces React Query hace que la aplicación se vuelva a renderizar. La regla general es que el renderizado ocurre al menos cada vez que es necesario, es decir, cuando cambia el estado de la consulta. Puede leer más al respecto, por ejemplo, [aquí](https://tkdodo.eu/blog/react-query-render-optimizations).

El código de la aplicación está en [GitHub](https://github.com/fullstack-hy2020/query-notes/tree/part6-3) en la rama <i>part6-3</i>.

React Query es una biblioteca versátil que, basada en lo que ya hemos visto, simplifica la aplicación. ¿Hace React Query soluciones de gestión de estado más complejas como Redux innecesarias? No. React Query puede reemplazar parcialmente el estado de la aplicación en algunos casos, pero como lo indica la [documentación](https://react-query-v3.tanstack.com/guides/does-this-replace-client-state)

- React Query es una <i>librería de estado del servidor</i>, responsable de la gestión de operaciones asíncronas entre el servidor y el cliente
- Redux, etc. son <i>librerías de estado del cliente</i> que se pueden usar para almacenar datos asíncronos, aunque de manera menos eficiente cuando se comparan con una herramienta como React Query

Entonces, React Query es una librería que mantiene el <i>estado del servidor</i> en el frontend, es decir, actúa como una caché para lo que se almacena en el servidor. React Query simplifica el procesamiento de datos en el servidor y, en algunos casos, puede eliminar la necesidad de que los datos en el servidor se guarden en el estado del frontend.

La mayoría de las aplicaciones de React no necesitan solo una forma de almacenar temporalmente los datos servidos, sino también alguna solución para cómo se maneja el resto del estado del frontend (por ejemplo, el estado de los formularios o las notificaciones).

</div>

<div class="tasks">

### Ejercicios 6.20.-6.22.

Ahora hagamos una nueva versión de la aplicación de anécdotas que use la biblioteca React Query. Tome [este proyecto](https://github.com/fullstack-hy2020/query-anecdotes) como punto de partida. El proyecto tiene un servidor JSON instalado, la operación del cual se ha modificado ligeramente. Inicie el servidor con <i>npm run server</i>.

#### Ejercicio 6.20

Implemente la obtencion de anécdotas del servidor usando React Query.

La aplicación debe funcionar de tal manera que si hay problemas para comunicarse con el servidor, solo se mostrará una página de error:

![](../../images/6/65new.png)

Puedes encontrar [aquí](https://react-query-v3.tanstack.com/guides/queries) información sobre cómo detectar posibles errores.

Puedes simular un problema con el servidor, por ejemplo, apagando el servidor JSON. Tenga en cuenta que en una situación problemática, la consulta primero está en el estado <i>isLoading</i> durante un tiempo, porque si una solicitud falla, React Query intenta la solicitud varias veces antes de que indique que la solicitud no es exitosa. Opcionalmente, puede especificar que no se realizan reintentos:

```js
const result = useQuery(
  'anecdotes', getAnecdotes, 
  {
    retry: false
  }
)
```

o que la solicitud se vuelva a intentar, por ejemplo, solo una vez más:

```js
const result = useQuery(
  'anecdotes', getAnecdotes, 
  {
    retry: 1
  }
)
```

#### Ejercicio 6.21

Implemente la adición de nuevas anécdotas al servidor usando React Query. La aplicación debe renderizar una nueva anécdota por defecto. Tenga en cuenta que el contenido de la anécdota debe tener al menos 5 caracteres de longitud, de lo contrario el servidor rechazará la solicitud POST. No tiene que preocuparse por el manejo de errores ahora.

#### Ejercicio 6.22

Implement voting for anecdotes using again the React Query. The application should automatically render the increased number of votes for the voted anecdote
Implemente votar las anécdotas usando nuevamente React Query. La aplicación debe renderizar automáticamente el número aumentado de votos para la anécdota votada.

</div>

<div class="content">

### useReducer

Entonces, incluso si la aplicación usa React Query, generalmente se necesita alguna solución para manejar el resto del estado del frontend (por ejemplo, el estado de los formularios). Con bastante frecuencia, el estado creado con <i>useState</i> es una solución suficiente. Usar Redux es, por supuesto, posible, pero hay otras alternativas.

Veamos una aplicación simple de contador. La aplicación muestra el valor del contador y ofrece tres botones para actualizar el estado del contador:

![](../../images/6/63new.png)

Ahora implementaremos la gestión del estado del contador usando un mecanismo de gestión de estado similar a Redux proporcionado por el gancho de React [useReducer](https://beta.reactjs.org/reference/react/useReducer). El código se ve así:

```js
import { useReducer } from 'react'

const counterReducer = (state, action) => {
  switch (action.type) {
    case "INC":
        return state + 1
    case "DEC":
        return state - 1
    case "ZERO":
        return 0
    default:
        return state
  }
}

const App = () => {
  const [counter, counterDispatch] = useReducer(counterReducer, 0)

  return (
    <div>
      <div>{counter}</div>
      <div>
        <button onClick={() => counterDispatch({ type: "INC"})}>+</button>
        <button onClick={() => counterDispatch({ type: "DEC"})}>-</button>
        <button onClick={() => counterDispatch({ type: "ZERO"})}>0</button>
      </div>
    </div>
  )
}

export default App
```

El hook [useReducer](https://beta.reactjs.org/reference/react/useReducer) proporciona un mecanismo para crear un estado para una aplicación. El parámetro para crear un estado es la función del reducer que maneja los cambios de estado, y el valor inicial del estado:

```js
const [counter, counterDispatch] = useReducer(counterReducer, 0)
```

La función del reducer que maneja los cambios de estado es similar a los reducers de Redux, es decir, la función obtiene como parámetros el estado actual y la acción que cambia el estado. La función devuelve el nuevo estado actualizado en función del tipo y el posible contenido de la acción:

```js
const counterReducer = (state, action) => {
  switch (action.type) {
    case "INC":
        return state + 1
    case "DEC":
        return state - 1
    case "ZERO":
        return 0
    default:
        return state
  }
}
```

En nuestro ejemplo, las acciones no tienen nada más que un tipo. Si el tipo de acción es <i>INC</i>, aumenta el valor del contador en uno, etc. Como los reducers de Redux, las acciones también pueden contener datos arbitrarios, que generalmente se colocan en el campo <i>payload</i> de la acción.

La función <i>useReducer</i> retorna un arreglo que contiene un elemento para acceder al valor actual del estado (primer elemento del arreglo) y una función <i>dispatch</i> (segundo elemento del arreglo) para cambiar el estado:

```js
const App = () => {
  const [counter, counterDispatch] = useReducer(counterReducer, 0)  // highlight-line

  return (
    <div>
      <div>{counter}</div> // highlight-line
      <div>
        <button onClick={() => counterDispatch({ type: "INC" })}>+</button> // highlight-line
        <button onClick={() => counterDispatch({ type: "DEC" })}>-</button>
        <button onClick={() => counterDispatch({ type: "ZERO" })}>0</button>
      </div>
    </div>
  )
}
```

Como se puede ver, el cambio de estado se realiza exactamente como en Redux, la función de despacho se le da la acción apropiada para cambiar el estado como parámetro:

```js
counterDispatch({ type: "INC" })
```

El código actual de la aplicación se encuentra en el repositorio [https://github.com/fullstack-hy2020/hook-counter](https://github.com/fullstack-hy2020/hook-counter/tree/part6-1) en la rama <i>part6-1</i>.

### Using context for passing the state to components

If we want to split the application into several components, the value of the counter and the dispatch function used to manage it must also be passed to the other components. One solution would be to pass these as props in the usual way:

```js
const Display = ({ counter }) => {
  return <div>{counter}</div>
}

const Button = ({ dispatch, type, label }) => {
  return (
    <button onClick={() => dispatch({ type })}>
      {label}
    </button>
  )
}

const App = () => {
  const [counter, counterDispatch] = useReducer(counterReducer, 0)

  return (
    <div>
      <Display counter={counter}/> // highlight-line
      <div>
        // highlight-start
        <Button dispatch={counterDispatch} type='INC' label='+' />
        <Button dispatch={counterDispatch} type='DEC' label='-' />
        <Button dispatch={counterDispatch} type='ZERO' label='0' />
        // highlight-end
      </div>
    </div>
  )
}
```

The solution works, but is not optimal. If the component structure gets complicated, e.g. the dispatcher should be forwarded using props through many components to the components that need it, even though the components in between in the component tree do not need the dispatcher. This phenomenon is called <i>prop drilling</i>.

React's built-in [Context API](https://beta.reactjs.org/learn/passing-data-deeply-with-context) provides a solution for us. React's context is a kind of global state of the application, to which it is possible to give direct access to any component app.

Let us now create a context in the application that stores the state management of the counter.

The context is created with React's hook [createContext](https://beta.reactjs.org/reference/react/createContext). Let's create a context in the file <i>CounterContext.js</i>:

```js
import { createContext } from 'react'

const CounterContext = createContext()

export default CounterContext
```

The <i>App</i> component can now <i>provide</i> a context to its child components as follows:

```js
import CounterContext from './CounterContext' // highlight-line

const App = () => {
  const [counter, counterDispatch] = useReducer(counterReducer, 0)

  return (
    <CounterContext.Provider value={[counter, counterDispatch]}>  // highlight-line
      <Display counter={counter}/>
      <div>
        <Button type='INC' label='+' />
        <Button type='DEC' label='-' />
        <Button type='ZERO' label='0' />
      </div>
    </CounterContext.Provider> // highlight-line
  )
}
```

As can be seen, providing the context is done by wrapping the child components inside the <i>CounterContext.Provider</i> component and setting a suitable value for the context.

The context value is now set to be an array containing the value of the counter, and the <i>dispatch</i> function.

Other components now access the context using the [useContext](https://beta.reactjs.org/reference/react/useContext) hook:

```js
import { useContext } from 'react' // highlight-line
import CounterContext from './CounterContext'

const Display = () => {
  const [counter, dispatch] = useContext(CounterContext) // highlight-line
  return <div>
    {counter}
  </div>
}

const Button = ({ type, label }) => {
  const [counter, dispatch] = useContext(CounterContext) // highlight-line
  return (
    <button onClick={() => dispatch({ type })}>
      {label}
    </button>
  )
}
```

The current code for the application is in [GitHub](https://github.com/fullstack-hy2020/hook-counter/tree/part6-2) in the branch <i>part6-2</i>.

### Defining the counter context in a separate file

Our application has an annoying feature, that the functionality of the counter state management is partly defined in the <i>App</i> component. Now let's move everything related to the counter to <i>CounterContext.js</i>:

```js
import { createContext, useReducer } from 'react'

const counterReducer = (state, action) => {
  switch (action.type) {
    case "INC":
        return state + 1
    case "DEC":
        return state - 1
    case "ZERO":
        return 0
    default:
        return state
  }
}

const CounterContext = createContext()

export const CounterContextProvider = (props) => {
  const [counter, counterDispatch] = useReducer(counterReducer, 0)

  return (
    <CounterContext.Provider value={[counter, counterDispatch] }>
      {props.children}
    </CounterContext.Provider>
  )
}

export default CounterContext
```

The file now exports, in addition to the <i>CounterContext</i> object corresponding to the context, the <i>CounterContextProvider</i> component, which is practically a context provider whose value is a counter and a dispatcher used for its state management.

Let's enable the context provider by making a change in <i>index.js</i>:

```js
import ReactDOM from 'react-dom/client'
import App from './App'
import { CounterContextProvider } from './CounterContext' // highlight-line

ReactDOM.createRoot(document.getElementById('root')).render(
  <CounterContextProvider>  // highlight-line
    <App />
  </CounterContextProvider>  // highlight-line
)
```

Now the context defining the value and functionality of the counter is available to <i>all</i> components of the application.

The <i>App</i> component is simplified to the following form:

```js
import Display from './components/Display'
import Button from './components/Button'

const App = () => {
  return (
    <div>
      <Display />
      <div>
        <Button type='INC' label='+' />
        <Button type='DEC' label='-' />
        <Button type='ZERO' label='0' />
      </div>
    </div>
  )
}

export default App
```

The context is still used in the same way, e.g. the component <i>Button</i> is defined as follows:

```js
import { useContext } from 'react'
import CounterContext from '../CounterContext'

const Button = ({ type, label }) => {
  const [counter, dispatch] = useContext(CounterContext)
  return (
    <button onClick={() => dispatch({ type })}>
      {label}
    </button>
  )
}

export default Button
```

The <i>Button</i> component only needs the <i>dispatch</i> function of the counter, but it also gets the value of the counter from the context using the function <i>useContext</i>:

```js
  const [counter, dispatch] = useContext(CounterContext)
```

This is not a big problem, but it is possible to make the code a bit more pleasant and expressive by defining a couple of helper functions in the <i>CounterContext</i> file:

```js
import { createContext, useReducer, useContext } from 'react' // highlight-line

const CounterContext = createContext()

// ...

export const useCounterValue = () => {
  const counterAndDispatch = useContext(CounterContext)
  return counterAndDispatch[0]
}

export const useCounterDispatch = () => {
  const counterAndDispatch = useContext(CounterContext)
  return counterAndDispatch[1]
}

// ...
```

With the help of these helper functions, it is possible for the components that use the context to get hold of the part of the context that they need. The <i>Display</i> component changes as follows:

```js
import { useCounterValue } from '../CounterContext' // highlight-line

const Display = () => {
  const counter = useCounterValue() // highlight-line
  return <div>
    {counter}
  </div>
}


export default Display
```

Component <i>Button</i> becomes:

```js
import { useCounterDispatch } from '../CounterContext' // highlight-line

const Button = ({ type, label }) => {
  const dispatch = useCounterDispatch() // highlight-line
  return (
    <button onClick={() => dispatch({ type })}>
      {label}
    </button>
  )
}

export default Button
```

The solution is quite elegant. The entire state of the application, i.e. the value of the counter and the code for managing it, is now isolated in the file <i>CounterContext</i>, which provides components with well-named and easy-to-use auxiliary functions for managing the state.

The final code for the application is in [GitHub](https://github.com/fullstack-hy2020/hook-counter/tree/part6-3) in the branch <i>part6-3</i>.

As a technical detail, it should be noted that the helper functions <i>useCounterValue</i> and <i>useCounterDispatch</i> are defined as [custom hooks](https://reactjs.org/docs/hooks-custom.html), because calling the hook function <i>useContext</i> is [possible](https://reactjs.org/docs/hooks -rules.html) only from React components or custom hooks. Custom Hooks, on the other hand, are JavaScript functions whose name must start with the string _use_. We will return to custom hooks in a little more detail in [part 7](/en/part7/custom_hooks) of the course.

</div>

<div class="tasks">

### Exercises 6.23.-6.24.

#### Exercise 6.23.

The application has a <i>Notification</i> component for displaying notifications to the user.

Implement the application's notification state management using the useReducer hook and context. The notification should tell the user when a new anecdote is created or an anecdote is voted on:

![](../../images/6/66new.png)

The notification is displayed for five seconds.

#### Exercise 6.24.

As stated in exercise 6.20, the server requires that the content of the anecdote to be added is at least 5 characters long. Now implement error handling for the insertion. In practice, it is sufficient to display a notification to the user in case of a failed POST request:

![](../../images/6/67new.png)

The error condition should be handled in the callback function registered for it, see
[here](https://react-query-v3.tanstack.com/reference/useMutation) how to register a function.

This was the last exercise for this part of the course and it's time to push your code to GitHub and mark all of your completed exercises to the [exercise submission system](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

</div>

<div class="content">

### Which state management solution to choose?

In chapters 1-5, all state management of the application was done using React's hook <i>useState</i>. Asynchronous calls to the backend required the use of the <i>useEffect</i> hook in some situations. In principle, nothing else is needed.

A subtle problem with a solution based on a state created with the <i>useState</i> hook is that if some part of the application's state is needed by multiple components of the application, the state and the functions for manipulating it must be passed via props to all components that handle the state. Sometimes props need to be passed through multiple components, and the components along the way may not even be interested in the state in any way. This somewhat unpleasant phenomenon is called <i>prop drilling</i>.

Over the years, several alternative solutions have been developed for state management of React applications, which can be used to ease problematic situations (e.g. prop drilling). However, no solution has been "final", all have their own pros and cons, and new solutions are being developed all the time.

The situation may confuse a beginner and even an experienced web developer. Which solution should be used?

For a simple application, <i>useState</i> is certainly a good starting point. If the application is communicating with the server, the communication can be handled in the same way as in chapters 1-5, using the state of the application itself. Recently, however, it has become more common to move the communication and associated state management at least partially under the control of React Query (or some other similar library). If you are concerned about useState and the prop drilling it entails, using context may be a good option. There are also situations where it may make sense to handle some of the state with useState and some with contexts.

The most comprehensive and robust state management solution is Redux, which is a way to implement the so-called [Flux](https://facebook.github.io/flux/) architecture. Redux is slightly older than the solutions presented in this section. The rigidity of Redux has been the motivation for many new state management solutions, such as React's <i>useReducer</i>. Some of the criticisms of Redux's rigidity have already become obsolete thanks to the [Redux Toolkit](https://redux-toolkit.js.org/).

Over the years, there have also been other state management libraries developed that are similar to Redux, such as the newer entrant [Recoil](https://recoiljs.org/) and the slightly older [MobX](https://mobx.js.org/). However, according to [Npm trends](https://npmtrends.com/mobx-vs-recoil-vs-redux), Redux still clearly dominates, and in fact seems to be increasing its lead:

![](../../images/6/64new.png)

Also, Redux does not have to be used in its entirety in an application. It may make sense, for example, to manage the form state outside of Redux, especially in situations where the state of a form does not affect the rest of the application. It is also perfectly possible to use Redux and React Query together in the same application. 

The question of which state management solution should be used is not at all straightforward. It is impossible to give a single correct answer. It is also likely that the selected state management solution may turn out to be suboptimal as the application grows to such an extent that the solution have to be changed even if the application has already been put into production use.

</div>

