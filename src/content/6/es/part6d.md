---
mainImage: ../../../images/part-6.svg
part: 6
letter: d
lang: es
---

<div class="content">

Al final de esta parte, analizaremos algunas formas diferentes de administrar el estado de una aplicación.

Continuemos con la aplicación de notas. Nos centraremos en la comunicación con el servidor. Comencemos la aplicación desde cero. La primera versión es la siguiente:

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

El código inicial está en GitHub en este [repositorio](https://github.com/fullstack-hy2020/query-notes/tree/part6-0), en la rama <i> part6-0 </i>.

**Nota**: Por defecto, clonar el repositorio solo te dará la rama principal. Para obtener el código inicial de la rama part6-0, utiliza el siguiente comando:

```
git clone --branch part6-0 https://github.com/fullstack-hy2020/query-notes.git
```

### Administrando datos en el servidor con la librería React Query

Ahora usaremos la librería [React Query](https://tanstack.com/query/latest) para almacenar y administrar los datos obtenidos del servidor. La ultima version también es llamada TanStack Query, pero seguiremos usando su nombre tradicional.

Instala la librería con el comando

```bash
npm install @tanstack/react-query
```

Se necesitan agregar algunas cosas en el archivo <i>main.jsx</i> para pasar las funciones de la librería a toda la aplicación:

```js
import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' // highlight-line

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
import { useQuery } from '@tanstack/react-query'  // highlight-line
import axios from 'axios'  // highlight-line

const App = () => {
  // ...

   // highlight-start
  const result = useQuery({
    queryKey: ['notes'],
    queryFn: () => axios.get('http://localhost:3001/notes').then(res => res.data)
  })

  console.log(JSON.parse(JSON.stringify(result)))
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

La obtención de datos del servidor aún se realiza de una forma familiar con el método <i>get</i> de Axios. Sin embargo, la llamada al método de Axios ahora está envuelta en una [query](https://tanstack.com/query/latest/docs/react/guides/queries) (consulta) formada con la función [useQuery](https://tanstack.com/query/latest/docs/react/reference/useQuery). El primer parámetro de la llamada a la función es un string <i>notes</i> que actúa como la [key](https://tanstack.com/query/latest/docs/react/guides/query-keys) (clave) para la query definida, es decir, la lista de notas.

El valor devuelto por la función <i>useQuery</i> es un objeto que indica el estado de la query. La salida a la consola ilustra la situación:

![consola del navegador mostrando status success](../../images/6/60new.png)

Es decir, la primera vez que se renderiza el componente, la query todavía está en estado <i>loading</i>, es decir, la solicitud HTTP asociada está pendiente. En esta etapa, solo se procesa lo siguiente:

```html
<div>loading data...</div>
```

Sin embargo, la solicitud HTTP se completa tan rápido que ni siquiera Max Verstappen podría ver el texto. Cuando se completa la solicitud, el componente se renderiza de nuevo. La query está en el estado <i>success</i> en la segunda renderización, y el campo <i>data</i> del objeto de la query contiene los datos devueltos por la solicitud, es decir, la lista de notas que se muestran en la pantalla.

Entonces, la aplicación recupera datos del servidor y los renderiza en la pantalla sin usar los Hooks de React <i>useState</i> y <i>useEffect</i> utilizados en los capítulos 2-5. Los datos en el servidor ahora están completamente bajo la administración de la librería React Query, ¡y la aplicación no necesita el estado definido con el Hook de React <i>useState</i> en absoluto!

Movamos la función que realiza la solicitud HTTP a su propio archivo <i>requests.js</i>

```js
import axios from 'axios'

export const getNotes = () =>
  axios.get('http://localhost:3001/notes').then(res => res.data)
```

El componente <i>App</i> ahora se ha simplificado un poco:

```js
import { useQuery } from '@tanstack/react-query' 
import { getNotes } from './requests' // highlight-line

const App = () => {
  // ...

  const result = useQuery({
    queryKey: ['notes'],
    queryFn: getNotes // highlight-line
  })

  // ...
}
```

El código actual de la aplicación está en [GitHub](https://github.com/fullstack-hy2020/query-notes/tree/part6-1) en la rama <i>part6-1</i>.

### Sincronizando datos con el servidor usando React Query

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
import { useQuery, useMutation } from '@tanstack/react-query' // highlight-line
import { getNotes, createNote } from './requests' // highlight-line

const App = () => {
 const newNoteMutation = useMutation({ mutationFn: createNote }) // highlight-line

  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    newNoteMutation.mutate({ content, important: true }) // highlight-line
  }

  // 

}
```

Para crear una nueva nota, se define una [mutación](https://tanstack.com/query/latest/docs/react/guides/mutations) usando la función [useMutation](https://tanstack.com/query/latest/docs/react/reference/useMutation):

```js
const newNoteMutation = useMutation({ mutationFn: createNote })
```

El parámetro es la función que agregamos al archivo <i>requests.js</i>, que usa Axios para enviar una nueva nota al servidor.

El controlador de eventos <i>addNote</i> realiza la mutación llamando a la función <i>mutate</i> del objeto de mutación y pasando la nueva nota como parámetro:

```js
newNoteMutation.mutate({ content, important: true })
```

Nuestra solución es buena. Excepto que no funciona. La nueva nota se guarda en el servidor, pero no se actualiza en la pantalla.

Para renderizar una nueva nota, debemos decirle a React Query que el resultado antiguo de la query cuya clave es el string <i>notes</i> debe ser [invalidado](https://tanstack.com/query/latest/docs/react/guides/invalidations-from-mutations).

Afortunadamente, la invalidación es fácil, se puede hacer definiendo la función de callback <i>onSuccess</i> apropiada para la mutación:

```js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query' // highlight-line
import { getNotes, createNote } from './requests'

const App = () => {
  const queryClient = useQueryClient() // highlight-line

  const newNoteMutation = useMutation({
    mutationFn: createNote, 
    onSuccess: () => {  // highlight-line
      queryClient.invalidateQueries({ queryKey: ['notes'] })  // highlight-line
    },
  })

  // ...
}
```

Ahora que la mutación se ha ejecutado con éxito, se realiza una llamada a la función

```js
queryClient.invalidateQueries('notes')
```

Esto hace que React Query actualice automáticamente la query con la clave <i>notes</i>, es decir que obtiene nuevamente las notas del servidor. Como resultado, la aplicación renderiza el estado actualizado en el servidor, por lo que la nota agregada también se renderiza.

Implementemos también el cambio en la importancia de las notas. Se agrega una función para actualizar notas al archivo <i>requests.js</i>:

```js
export const updateNote = updatedNote =>
  axios.put(`${baseUrl}/${updatedNote.id}`, updatedNote).then(res => res.data)
```

Actualizar la nota también se hace mediante una mutación. El componente <i>App</i> se expande de la siguiente manera:

```js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query' 
import { getNotes, createNote, updateNote } from './requests' // highlight-line

const App = () => {
  // ...

  const updateNoteMutation = useMutation({
    mutationFn: updateNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })

  // highlight-start
  const toggleImportance = (note) => {
    updateNoteMutation.mutate({...note, important: !note.important })
  }
  // highlight-end

  // ...
}
```

De nuevo, se creó una mutación que invalidó la query <i>notes</i> para que la nota actualizada se renderice correctamente. Usar mutaciones es fácil, el método <i>mutate</i> recibe una nota como parámetro, cuya importancia se cambia a la negación del valor antiguo.

El código actual de la aplicación está en [GitHub](https://github.com/fullstack-hy2020/query-notes/tree/part6-2) en la rama <i>part6-2</i>.

### Optimizando el rendimiento

La aplicación funciona bien y el código es relativamente simple. La facilidad para realizar cambios en la lista de notas es particularmente sorprendente. Cuando cambiamos la importancia de una nota, invalidar la query <i>notes</i> es suficiente para que los datos de la aplicación se actualicen:

```js
  const updateNoteMutation = useMutation({
    mutationFn: updateNote,
    onSuccess: () => {
      queryClient.invalidateQueries('notes') // highlight-line
    },
  })
```

La consecuencia de esto, por supuesto, es que después de la solicitud PUT que causa el cambio de nota, la aplicación realiza una nueva solicitud GET para recuperar los datos de la query desde el servidor:

![pestaña network con foco sobre las solicitudes 3 y notes](../../images/6/61new.png)

Si la cantidad de datos obtenidos por la aplicación no es grande, realmente no importa. Después de todo, desde el punto de vista de la funcionalidad del lado del navegador, hacer una solicitud HTTP GET adicional realmente no importa, pero en algunas situaciones podría generar una carga en el servidor.

Si fuera necesario, es posible [optimizar el rendimiento manualmente](https://tanstack.com/query/latest/docs/react/guides/updates-from-mutation-responses), actualizando el estado de la query mantenido por React Query.

El cambio para la mutación que agrega una nueva nota es el siguiente:

```js
const App = () => {
  const queryClient =  useQueryClient() 

  const newNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: (newNote) => {
      const notes = queryClient.getQueryData(['notes']) // highlight-line
      queryClient.setQueryData(['notes'], notes.concat(newNote)) // highlight-line
    }
  })
  // ...
}
```

Es decir, en el callback de <i>onSuccess</i>, el objeto <i>queryClient</i> primero lee el estado existente en <i>notes</i> de la query y lo actualiza agregando una nueva nota, que se obtiene como parámetro de la función de callback. El valor del parámetro es el valor devuelto por la función <i>createNote</i>, definida en el archivo <i>requests.js</i> de la siguiente manera:

```js
export const createNote = newNote =>
  axios.post(baseUrl, newNote).then(res => res.data)
```

Seria relativamente fácil hacer un cambio similar a una mutación que cambia la importancia de la nota, pero lo dejamos como un ejercicio opcional.

Si observamos de cerca la pestaña de red del navegador, nos damos cuenta de que React Query recupera todas las notas tan pronto como movemos el cursor al campo de entrada:

![aplicación de notas con herramientas de desarrollo resaltando el campo de texto de entrada y flecha sobre red en la solicitud de notas con respuesta 200](../../images/6/62new.png)

¿Que es lo que está pasando? Al leer la [documentación](https://tanstack.com/query/latest/docs/react/reference/useQuery), nos damos cuenta de que la funcionalidad predeterminada de las queries de React Query es que estas (cuyo estado es <i>stale</i>) se actualicen con el evento <i>window focus</i>, es decir, cuando cambia el elemento activo de la interfaz de usuario de la aplicación. Si queremos, podemos desactivar la funcionalidad creando una consulta de la siguiente manera:

```js
const App = () => {
  // ...
  const result = useQuery({
    queryKey: ['notes'],
    queryFn: getNotes,
    refetchOnWindowFocus: false // highlight-line
  })

  // ...
}
```

Si colocas un <i>console.log</i> en el código, podrás ver desde la consola del navegador cuántas veces React Query hace que la aplicación se vuelva a renderizar. La regla general es que el renderizado ocurre cada vez que es necesario, es decir, cuando cambia el estado de la query. Puedes leer más al respecto [aquí](https://tkdodo.eu/blog/react-query-render-optimizations).

El código de la aplicación está en [GitHub](https://github.com/fullstack-hy2020/query-notes/tree/part6-3) en la rama <i>part6-3</i>.

React Query es una librería versátil que, basados en lo que ya hemos visto, simplifica la aplicación. ¿Hace React Query que soluciones de gestión de estado más complejas como Redux sean innecesarias? No. React Query puede reemplazar parcialmente el estado de la aplicación en algunos casos, pero como lo indica la [documentación:](https://tanstack.com/query/latest/docs/react/guides/does-this-replace-client-state):

- React Query es una <i>librería de estado del servidor</i>, responsable de la gestión de operaciones asíncronas entre el servidor y el cliente
- Redux, etc. son <i>librerías de estado del cliente</i> que se pueden usar para almacenar datos asíncronos, aunque de manera menos eficiente cuando se comparan con una herramienta como React Query

Entonces, React Query es una librería que mantiene el <i>estado del servidor</i> en el frontend, es decir, actúa como una caché para lo que se almacena en el servidor. React Query simplifica el procesamiento de datos en el servidor y, en algunos casos, puede eliminar la necesidad de que los datos en el servidor se guarden en el estado del frontend.

La mayoría de las aplicaciones de React no necesitan solo una forma de almacenar temporalmente los datos servidos, sino también alguna solución para cómo se maneja el resto del estado del frontend (por ejemplo, el estado de los formularios o las notificaciones).

</div>

<div class="tasks">

### Ejercicios 6.20.-6.22.

Ahora hagamos una nueva versión de la aplicación de anécdotas que use a la librería React Query. Usa [este proyecto](https://github.com/fullstack-hy2020/query-anecdotes) como punto de partida. El proyecto tiene un JSON Server instalado, la operación del cual se ha modificado ligeramente (revisa el archivo _server.js_ para más detalles). Inicia el servidor con <i>npm run server</i>.

#### Ejercicio 6.20

Implementa la obtención de anécdotas del servidor usando React Query.

La aplicación debe funcionar de tal manera que si hay problemas para comunicarse con el servidor, solo se mostrará una página de error:

![navegador diciendo que anecdote service no esta disponible debido a problemas con el servidor en localhost](../../images/6/65new.png)

Puedes encontrar [aquí](https://tanstack.com/query/latest/docs/react/guides/queries) información sobre cómo detectar posibles errores.

Puedes simular un problema con el servidor apagando el JSON Server. Ten en cuenta que en una situación problemática, la consulta primero está en el estado <i>isLoading</i> durante un tiempo, porque si una solicitud falla, React Query intenta la solicitud varias veces antes de que indique que la solicitud no es exitosa. Opcionalmente, puedes especificar que no se realicen reintentos:

```js
const result = useQuery(
  {
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: false
  }
)
```

o que la solicitud se vuelva a intentar solo una vez más:

```js
const result = useQuery(
  {
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1
  }
)
```

#### Ejercicio 6.21

Implementa la adición de nuevas anécdotas al servidor usando React Query. La aplicación debe renderizar una nueva anécdota por defecto. Ten en cuenta que el contenido de la anécdota debe tener al menos 5 caracteres de longitud, de lo contrario el servidor rechazará la solicitud POST. No tienes que preocuparte por el control de errores ahora.

#### Ejercicio 6.22

Implementa la votación de anécdotas usando nuevamente React Query. La aplicación debe renderizar automáticamente el número aumentado de votos para la anécdota votada.

</div>

<div class="content">

### useReducer

Entonces, incluso si la aplicación usa React Query, generalmente se necesita alguna solución para manejar el resto del estado del frontend (por ejemplo, el estado de los formularios). Con bastante frecuencia, el estado creado con <i>useState</i> es una solución suficiente. Usar Redux es, por supuesto, posible, pero hay otras alternativas.

Veamos una aplicación de contador sencilla. La aplicación muestra el valor del contador y ofrece tres botones para actualizar su estado:

![botones + - y 0, con el valor 7 arriba](../../images/6/63new.png)

Ahora implementaremos la gestión del estado del contador usando un mecanismo de gestión de estado similar a Redux proporcionado por el hook de React [useReducer](https://es.react.dev/reference/react/useReducer). El código se ve así:

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

El hook [useReducer](https://es.react.dev/reference/react/useReducer) proporciona un mecanismo para crear un estado para la aplicación. El parámetro para crear un estado es la función del reducer que maneja los cambios de estado y el valor inicial del estado:

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

La función <i>useReducer</i> devuelve un array que contiene un elemento para acceder al valor actual del estado (primer elemento del array) y una función <i>dispatch</i> (segundo elemento del array) para cambiar el estado:

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

Como se puede ver, el cambio de estado se realiza exactamente como en Redux, la función de dispatch recibe la acción apropiada para cambiar el estado como parámetro:

```js
counterDispatch({ type: "INC" })
```

El código actual de la aplicación se encuentra en el repositorio [https://github.com/fullstack-hy2020/hook-counter](https://github.com/fullstack-hy2020/hook-counter/tree/part6-1) en la rama <i>part6-1</i>.

### Usando context para pasar el estado a los componentes

Si queremos dividir la aplicación en varios componentes, el valor del contador y la función de dispatch utilizada para gestionarlo también deben pasarse a los otros componentes. Una solución sería pasar estos como props de la manera habitual:

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

La solución funciona, pero no es óptima. Si la estructura de los componentes se complica, el despachador debe transmitirse usando props a través de muchos componentes para llegar a los componentes que lo necesitan, aunque los componentes intermedios en el árbol de componentes no necesiten al despachador. Este fenómeno se llama <i>prop drilling</i>.

La [API de Contexto](https://es.react.dev/learn/passing-data-deeply-with-context) integrada en React proporciona una solución para nosotros. El contexto de React es un tipo de estado global de la aplicación, al que se puede dar acceso directo a cualquier componente de la aplicación.

Vamos a crear ahora un contexto en la aplicación que almacene la gestión de estado del contador.

El contexto se crea con el hook [createContext](https://es.react.dev/reference/react/createContext) de React. Vamos a crear un contexto en el archivo <i>CounterContext.jsx</i>:

```js
import { createContext } from 'react'

const CounterContext = createContext()

export default CounterContext
```

El componente <i>App</i> ahora puede <i>proveer</i> un contexto a sus componentes hijos de la siguiente manera:

```js
import CounterContext from './CounterContext' // highlight-line

const App = () => {
  const [counter, counterDispatch] = useReducer(counterReducer, 0)

  return (
    <CounterContext.Provider value={[counter, counterDispatch]}>  // highlight-line
      <Display />
      <div>
        <Button type='INC' label='+' />
        <Button type='DEC' label='-' />
        <Button type='ZERO' label='0' />
      </div>
    </CounterContext.Provider> // highlight-line
  )
}
```

Como se puede ver, el proveedor de contexto se realiza envolviendo los componentes hijo dentro del componente <i>CounterContext.Provider</i> y estableciendo un valor adecuado para el contexto.

El valor del contexto ahora se establece en un array que contiene el valor del contador y la función <i>dispatch</i>.

Otros componentes ahora acceden al contexto utilizando el hook [useContext](https://es.react.dev/reference/react/useContext):

```js
import { useContext } from 'react' // highlight-line
import CounterContext from './CounterContext'

const Display = () => {
  const [counter] = useContext(CounterContext) // highlight-line
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

El código actual de la aplicación se encuentra en [GitHub](https://github.com/fullstack-hy2020/hook-counter/tree/part6-2) en la rama <i>part6-2</i>.

### Definiendo el contexto del contador en un archivo separado

Nuestra aplicación tiene una característica molesta, que la funcionalidad de la gestión del estado del contador está parcialmente definida en el componente <i>App</i>. Ahora vamos a mover todo lo relacionado con el contador al archivo <i>CounterContext.jsx</i>:

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

El archivo ahora exporta, además del objeto <i>CounterContext</i> correspondiente al contexto, el componente <i>CounterContextProvider</i>, que es prácticamente un proveedor de contexto cuyo valor es un contador y un despachador utilizado para su gestión de estado.

Habilitemos el proveedor de contexto haciendo un cambio en <i>main.jsx</i>:

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

Ahora el contexto que define el valor y la funcionalidad del contador está disponibles para <i>todos</i> los componentes de la aplicación.

El componente <i>App</i> se simplifica a la siguiente forma:

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

El contexto es usado de la misma forma en el componente <i>Button</i>, como se ve a continuación:

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

El componente <i>Button</i> solo necesita la función <i>dispatch</i> del contador, pero también obtiene el valor del contador del contexto utilizando la función <i>useContext</i>:

```js
  const [counter, dispatch] = useContext(CounterContext)
```

Esto no es un gran problema, pero es posible hacer que el código sea un poco más agradable y expresivo definiendo un par de funciones auxiliares en el archivo <i>CounterContext</i>:

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

Con la ayuda de estas funciones auxiliares, es posible que los componentes que usan el contexto obtengan la parte del contexto que necesitan. El componente <i>Display</i> cambia de la siguiente manera:

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

El componente <i>Button</i> se vuelve:

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

La solución es bastante elegante. Todo el estado de la aplicación, es decir, el valor del contador y el código para gestionarlo, ahora está aislado en el archivo <i>CounterContext</i>, que proporciona a los componentes funciones auxiliares bien nombradas y fáciles de usar para gestionar el estado.

El código de la aplicación final se encuentra en [GitHub](https://github.com/fullstack-hy2020/hook-counter/tree/part6-3) en la rama <i>part6-3</i>.

Como detalle técnico, debe tenerse en cuenta que las funciones auxiliares <i>useCounterValue</i> y <i>useCounterDispatch</i> se definen como [hooks personalizados](https://es.react.dev/learn/reusing-logic-with-custom-hooks), porque llamar a la función de hook <i>useContext</i> es [posible]([https://es.reactjs.org/docs/hooks -reglas.html](https://es.legacy.reactjs.org/docs/hooks-rules.html)) solo desde componentes de React o hooks personalizados. Los hooks personalizados, por otro lado, son funciones JavaScript cuyo nombre debe comenzar con la palabra _use_. Volveremos a los hooks personalizados en un poco más de detalle en la [parte 7](/es/part7/hooks_personalizados) del curso.

</div>

<div class="tasks">

### Ejercicios 6.23.-6.24.

#### Ejercicio 6.23.

La aplicación tiene un componente <i>Notification</i> para mostrar notificaciones al usuario.

Implementa la gestión del estado de las notificaciones para la aplicación utilizando el hook useReducer y el contexto. La notificación debe informar al usuario cuando se crea una nueva anécdota o cuando se vota por ella:

![navegador mostrando notificación para anécdota añadida](../../images/6/66new.png)

La notificación se muestra durante cinco segundos.

#### Ejercicio 6.24.

Como se indicó en el ejercicio 6.21, el servidor requiere que el contenido de la anécdota a agregar tenga al menos 5 caracteres de longitud. Ahora implementa el manejo de errores para la inserción. En la práctica, es suficiente mostrar una notificación al usuario en caso de una solicitud POST fallida:

![navegador mostrando notificación de error por tratar de crear una anécdota muy corta](../../images/6/67new.png)

La condición de error debe manejarse en la función de callback registrada para ello, consulta [aquí](https://tanstack.com/query/latest/docs/framework/react/reference/useMutation) cómo registrar una función.

Este fue el último ejercicio para esta parte del curso y es hora de enviar tu código a GitHub y marcar todos tus ejercicios completados en el [sistema de envío de ejercicios](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

</div>

<div class="content">

#### ¿Qué solución de gestión de estado elegir?

En los capítulos 1-5, toda la gestión de estado de la aplicación se realizó utilizando el hook de React <i>useState</i>. Las llamadas asíncronas al backend requerían el uso del hook <i>useEffect</i> en algunas situaciones. En principio, no se necesita nada más.

Un problema sutil con una solución basada en un estado creado con el hook React <i>useState</i> es que si alguna parte del estado de la aplicación se necesita en varios componentes de la aplicación, el estado y las funciones para manipularlo deben pasarse a través de las props a todos los componentes que manejan el estado. A veces, las props deben pasar por varios componentes, y algunos de los componentes a lo largo del camino ni siquiera están interesados en ese estado. Este fenómeno algo desagradable se llama <i>prop drilling</i>.

A lo largo de los años, se han desarrollado varias soluciones alternativas para la gestión de estado de aplicaciones React, que se pueden usar para aliviar situaciones problemáticas (por ejemplo, prop drilling). Sin embargo, ninguna solución ha sido "final", todas tienen sus propias ventajas y desventajas, y se están desarrollando nuevas soluciones todo el tiempo.

La situación puede confundir a un principiante e incluso a un desarrollador web experimentado. ¿Qué solución se debe usar?

Para una aplicación simple, <i>useState</i> es sin duda un buen punto de partida. Si la aplicación está comunicándose con el servidor, la comunicación se puede manejar de la misma manera que en los capítulos 1-5, utilizando el estado de la aplicación misma. Sin embargo, recientemente se ha vuelto más común mover la comunicación y la gestión asociada del estado al menos parcialmente bajo el control de React Query (o alguna otra biblioteca similar). Si estás preocupado por useState y el prop drilling que conlleva, usar context puede ser una buena opción. También hay situaciones en las que puede tener sentido manejar parte del estado con useState y parte con contextos.

La solución de gestión de estado más completa y robusta es Redux, que es una forma de implementar la llamada arquitectura [Flux](https://facebookarchive.github.io/flux/docs/in-depth-overview/). Redux es ligeramente más antigua que las soluciones presentadas en esta sección. La rigidez de Redux ha sido la motivación para muchas nuevas soluciones de gestión de estado, como el <i>useReducer</i> de React. Algunas de las críticas a la rigidez de Redux ya se han vuelto obsoletas gracias al [Redux Toolkit](https://redux-toolkit.js.org/).

A lo largo de los años, también se han desarrollado otras librería de gestión de estado que son similares a Redux, como el recién llegado [Recoil](https://recoiljs.org/) y el ligeramente más antiguo [MobX](https://mobx.js.org/). Sin embargo, según [Tendencias de Npm](https://npmtrends.com/mobx-vs-recoil-vs-redux), Redux todavía domina claramente, y de hecho parece estar aumentando su ventaja:

![gráfica mostrando a redux creciendo en popularidad en los últimos 5 años](../../images/6/64new.png)

Redux puede no usarse en su totalidad en una aplicación. Por ejemplo, puede tener sentido gestionar el estado de un formulario fuera de Redux, especialmente en situaciones en las que el estado de un formulario no afecta al resto de la aplicación. También es perfectamente posible usar Redux y React Query juntos en la misma aplicación.

La pregunta de qué solución de gestión de estado se debe usar no es para nada sencilla. No es posible dar una sola respuesta correcta. También es probable que la solución de gestión de estado seleccionada pueda resultar ser sub-óptima a medida que la aplicación crece, hasta tal punto que la solución tenga que cambiar incluso si ya se está usando la aplicación en producción.

</div>
