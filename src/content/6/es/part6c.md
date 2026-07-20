---
mainImage: ../../../images/part-6.svg
part: 6
letter: c
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
    event.target.reset()
    console.log(content)
  }

  const toggleImportance = (note) => {
    console.log('toggle importance of', note.id)
  }

  const notes = []

  return (
    <div>
      <h2>Notes app</h2>
      <form onSubmit={addNote}>
        <input name="note" />
        <button type="submit">add</button>
      </form>
      {notes.map((note) => (
        <li key={note.id} onClick={() => toggleImportance(note)}>
          {note.important ? <strong>{note.content}</strong> : note.content}
          <button onClick={() => toggleImportance(note.id)}>
            {note.important ? 'make not important' : 'make important'}
          </button>  
        </li>
      ))}
    </div>
  )
}

export default App
```

El código inicial está en GitHub en este [repositorio](https://github.com/fullstack-hy2020/query-notes/tree/part6-0), en la rama <i>part6-0</i>.

### Gestión de datos del servidor con la librería TanStack Query

Ahora utilizaremos la librería [TanStack Query](https://tanstack.com/query/latest) para almacenar y gestionar los datos obtenidos del servidor.

Instala la librería con el comando

```bash
npm install @tanstack/react-query
```

Se necesitan agregar algunas cosas en el archivo <i>main.jsx</i> para pasar las funciones de la librería a toda la aplicación:

```js
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' // highlight-line

import App from './App.jsx'

const queryClient = new QueryClient() // highlight-line

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}> // highlight-line
    <App />
  </QueryClientProvider> // highlight-line
)
```

Usemos [JSON Server](https://github.com/typicode/json-server) como en las partes anteriores para simular el backend. JSON Server está preconfigurado en el proyecto de ejemplo, y la raíz del proyecto contiene un archivo <i>db.json</i> que por defecto tiene dos notas. Puedes iniciar el servidor con:

```js
npm run server
```

Ahora podemos recuperar las notas en el componente <i>App</i>. El código se expande de la siguiente manera:

```js
import { useQuery } from '@tanstack/react-query' // highlight-line

const App = () => {
  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.reset()
    console.log(content)
  }

  const toggleImportance = (note) => {
    console.log('toggle importance of', note.id)
  }

  // highlight-start
  const result = useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3001/notes')
      if (!response.ok) {
        throw new Error('Failed to fetch notes')
      }
      return await response.json()
    }
  })
 
  console.log(JSON.parse(JSON.stringify(result)))
 
  if (result.isPending) {
    return <div>loading data...</div>
  }
 
  const notes = result.data
  // highlight-end

  return (
    // ...
  )
}
```

La obtención de datos del servidor se realiza, como en el capítulo anterior, usando el método <i>fetch</i> de la Fetch API. Sin embargo, la llamada al método ahora está envuelta en una [query](https://tanstack.com/query/latest/docs/react/guides/queries) (consulta) formada con la función [useQuery](https://tanstack.com/query/latest/docs/react/reference/useQuery). La llamada a <i>useQuery</i> toma como parámetro un objeto con los campos <i>queryKey</i> y <i>queryFn</i>. El valor del campo <i>queryKey</i> es un array que contiene el string <i>notes</i>. Actúa como la [clave](https://tanstack.com/query/latest/docs/react/guides/query-keys) para la query definida, es decir, la lista de notas.

El valor devuelto por la función <i>useQuery</i> es un objeto que indica el estado de la query. La salida a la consola ilustra la situación:

![consola del navegador mostrando el estado success](../../images/6/t3.png)

Es decir, la primera vez que se renderiza el componente, la query todavía está en estado <i>loading</i>, es decir, la solicitud HTTP asociada está pendiente. En esta etapa, solo se procesa lo siguiente:

```html
<div>loading data...</div>
```

Sin embargo, la solicitud HTTP se completa tan rápido que ni siquiera Max Verstappen podría ver el texto. Cuando se completa la solicitud, el componente se renderiza de nuevo. La query está en el estado <i>success</i> en la segunda renderización, y el campo <i>data</i> del objeto de la query contiene los datos devueltos por la solicitud, es decir, la lista de notas que se muestran en la pantalla.

Entonces, la aplicación recupera datos del servidor y los renderiza en la pantalla sin usar los Hooks de React <i>useState</i> y <i>useEffect</i> utilizados en los capítulos 2-5. Los datos en el servidor ahora están completamente bajo la administración de la librería TanStack Query, ¡y la aplicación no necesita el estado definido con el Hook de React <i>useState</i> en absoluto!

Movamos la función que realiza la solicitud HTTP a su propio archivo <i>src/requests.js</i>

```js
const baseUrl = 'http://localhost:3001/notes'

export const getNotes = async () => {
  const response = await fetch(baseUrl)
  if (!response.ok) {
    throw new Error('Failed to fetch notes')
  }
  return await response.json()
}
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

### Sincronización de datos con el servidor mediante TanStack Query

Los datos ya se han recuperado correctamente del servidor. A continuación, nos aseguraremos de que los datos agregados y modificados se almacenen en el servidor. Comencemos agregando nuevas notas.

Hagamos una función <i>createNote</i> en el archivo <i>requests.js</i> para guardar nuevas notas:

```js
const baseUrl = 'http://localhost:3001/notes'

export const getNotes = async () => {
  const response = await fetch(baseUrl)
  if (!response.ok) {
    throw new Error('Failed to fetch notes')
  }
  return await response.json()
}

// highlight-start
export const createNote = async (newNote) => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newNote)
  }
 
  const response = await fetch(baseUrl, options)
 
  if (!response.ok) {
    throw new Error('Failed to create note')
  }
 
  return await response.json()
}
// highlight-end
```

El componente <i>App</i> cambiará de la siguiente manera

```js
import { useQuery, useMutation } from '@tanstack/react-query' // highlight-line
import { getNotes, createNote } from './requests' // highlight-line

const App = () => {
  //highlight-start
  const newNoteMutation = useMutation({
    mutationFn: createNote,
  })
  // highlight-end

  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.reset()
    newNoteMutation.mutate({ content, important: true }) // highlight-line
  }

  //

}
```

Para crear una nueva nota, se define una [mutación](https://tanstack.com/query/latest/docs/react/guides/mutations) usando la función [useMutation](https://tanstack.com/query/latest/docs/react/reference/useMutation):

```js
const newNoteMutation = useMutation({
  mutationFn: createNote,
})
```

El parámetro es la función que agregamos al archivo <i>requests.js</i>, que usa la Fetch API para enviar una nueva nota al servidor.

El controlador de eventos <i>addNote</i> realiza la mutación llamando a la función <i>mutate</i> del objeto de mutación y pasando la nueva nota como parámetro:

```js
newNoteMutation.mutate({ content, important: true })
```

Nuestra solución es buena. Excepto que no funciona. La nueva nota se guarda en el servidor, pero no se actualiza en la pantalla.

Para renderizar una nueva nota también, debemos decirle a TanStack Query que el resultado antiguo de la query cuya clave es el string <i>notes</i> debe ser [invalidado](https://tanstack.com/query/latest/docs/react/guides/invalidations-from-mutations).

Afortunadamente, la invalidación es fácil, se puede hacer definiendo la función de callback <i>onSuccess</i> apropiada para la mutación:

```js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query' // highlight-line
import { getNotes, createNote } from './requests'

const App = () => {
  const queryClient = useQueryClient() // highlight-line

  const newNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {  // highlight-line
      queryClient.invalidateQueries({ queryKey: ['notes'] }) // highlight-line
    }, // highlight-line
  })

  // ...
}
```

Ahora que la mutación se ha ejecutado con éxito, se realiza una llamada a la función

```js
queryClient.invalidateQueries({ queryKey: ['notes'] })
```

Esto a su vez hace que TanStack Query actualice automáticamente una query con la clave <i>notes</i>, es decir, obtenga las notas del servidor. Como resultado, la aplicación renderiza el estado actualizado en el servidor, es decir, la nota agregada también se renderiza.

Implementemos también el cambio en la importancia de las notas. Se agrega una función para actualizar notas al archivo <i>requests.js</i>:

```js
export const updateNote = async (updatedNote) => {
  const options = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedNote)
  }

  const response = await fetch(`${baseUrl}/${updatedNote.id}`, options)

  if (!response.ok) {
    throw new Error('Failed to update note')
  }

  return await response.json()
}
```

Actualizar la nota también se hace mediante una mutación. El componente <i>App</i> se expande de la siguiente manera:

```js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getNotes, createNote, updateNote } from './requests' // highlight-line

const App = () => {
  const queryClient = useQueryClient()

  const newNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    }
  })

  // highlight-start
  const updateNoteMutation = useMutation({
    mutationFn: updateNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    }
  })
  // highlight-end

  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.reset()
    newNoteMutation.mutate({ content, important: true })
  }

  const toggleImportance = (note) => {
    updateNoteMutation.mutate({...note, important: !note.important }) // highlight-line
  }

  // ...
}
```

De nuevo, se creó una mutación que invalidó la query <i>notes</i> para que la nota actualizada se renderice correctamente. Usar mutaciones es fácil, el método <i>mutate</i> recibe una nota como parámetro, cuya importancia se cambia a la negación del valor antiguo.

El código actual de la aplicación está en [GitHub](https://github.com/fullstack-hy2020/query-notes/tree/part6-2) en la rama <i>part6-2</i>.

### Optimizando el rendimiento

La aplicación funciona bien y el código es relativamente simple. La facilidad para realizar cambios en la lista de notas es particularmente sorprendente. Por ejemplo, cuando cambiamos la importancia de una nota, invalidar la query <i>notes</i> es suficiente para que los datos de la aplicación se actualicen:

```js
const updateNoteMutation = useMutation({
  mutationFn: updateNote,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['notes'] }) // highlight-line
  }
})
```

La consecuencia de esto, por supuesto, es que después de la solicitud PUT que causa el cambio de nota, la aplicación realiza una nueva solicitud GET para recuperar los datos de la query desde el servidor:

![pestaña de red con las solicitudes 3 y notes resaltadas](../../images/6/t4.png)

Si la cantidad de datos obtenidos por la aplicación no es grande, realmente no importa. Después de todo, desde el punto de vista de la funcionalidad del lado del navegador, hacer una solicitud HTTP GET adicional realmente no importa, pero en algunas situaciones podría generar una carga en el servidor.

Si fuera necesario, es posible también [optimizar el rendimiento manualmente](https://tanstack.com/query/latest/docs/react/guides/updates-from-mutation-responses), actualizando el estado de la query mantenido por TanStack Query.

El cambio para la mutación que agrega una nueva nota es el siguiente:

```js
const App = () => {
  const queryClient = useQueryClient()

  const newNoteMutation = useMutation({
    mutationFn: createNote,
    // highlight-start
    onSuccess: (newNote) => {
      const notes = queryClient.getQueryData(['notes'])
      queryClient.setQueryData(['notes'], notes.concat(newNote))
    // highlight-end
    }
  })

  // ...
}
```

Es decir, en el callback de <i>onSuccess</i>, el objeto <i>queryClient</i> primero lee el estado existente de <i>notes</i> de la query y lo actualiza agregando una nueva nota, que se obtiene como parámetro de la función de callback. El valor del parámetro es el valor devuelto por la función <i>createNote</i>, definida en el archivo <i>requests.js</i> de la siguiente manera:

```js
export const createNote = async (newNote) => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newNote)
  }

  const response = await fetch(baseUrl, options)

  if (!response.ok) {
    throw new Error('Failed to create note')
  }

  return await response.json() // highlight-line
}
```

Sería relativamente fácil hacer un cambio similar a una mutación que cambia la importancia de la nota, pero lo dejamos como un ejercicio opcional.

Finalmente, nota un detalle interesante. TanStack Query vuelve a obtener todas las notas cuando cambiamos a otra pestaña del navegador y luego regresamos a la pestaña de la aplicación. Esto se puede observar en la pestaña de Red de la Consola de Desarrollador:

![aplicación de notas y solicitud notes con estado 200 en la pestaña de red](../../images/6/t5.png)

¿Qué está pasando? Al leer la [documentación](https://tanstack.com/query/latest/docs/react/reference/useQuery), nos damos cuenta de que la funcionalidad predeterminada de las queries de TanStack Query es que las queries (cuyo estado es <i>stale</i>) se actualicen cuando cambia el <i>window focus</i>. Si queremos, podemos desactivar la funcionalidad creando una consulta de la siguiente manera:

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

Si colocas un console.log en el código, podrás ver desde la consola del navegador cuántas veces TanStack Query hace que la aplicación se vuelva a renderizar. La regla general es que el renderizado ocurre al menos cada vez que es necesario, es decir, cuando cambia el estado de la query. Puedes leer más al respecto por ejemplo [aquí](https://tkdodo.eu/blog/react-query-render-optimizations).

### Hook personalizado useNotes

Nuestra solución es bastante buena, pero resulta algo incómodo que muchos detalles de implementación de TanStack Query estén directamente en el componente de React. Extraigámoslos a un hook personalizado:

```js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getNotes, createNote, updateNote } from '../requests'

export const useNotes = () => {
  const queryClient = useQueryClient()

  const result = useQuery({
    queryKey: ['notes'],
    queryFn: getNotes,
    refetchOnWindowFocus: false
  })

  const newNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: (newNote) => {
      const notes = queryClient.getQueryData(['notes'])
      queryClient.setQueryData(['notes'], notes.concat(newNote))
    }
  })

  const updateNoteMutation = useMutation({
    mutationFn: updateNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    }
  })

  return {
    notes: result.data,
    isPending: result.isPending,
    addNote: (content) => newNoteMutation.mutate({ content, important: true }),
    toggleImportance: (note) => updateNoteMutation.mutate({ 
      ...note, important: !note.important 
    }),
  }
}
```

El hook encapsula todo el código relacionado con TanStack Query: la query que obtiene las notas y las dos mutaciones que las crean y actualizan. Estos detalles quedan ocultos para quien utiliza el hook, ya que la función devuelve un objeto sencillo con:

- <i>notes</i>: la lista de notas
- <i>isPending</i>: indica si los datos siguen cargándose
- <i>addNote</i>: una función para añadir una nota a partir de su contenido
- <i>toggleImportance</i>: una función para cambiar la importancia de una nota

El componente <i>App</i> se simplifica considerablemente:

```js
import { useNotes } from './hooks/useNotes'

const App = () => {
  const { notes, isPending, addNote: addNoteToServer, toggleImportance } = useNotes()

  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.reset()
    addNoteToServer(content)
  }

  if (isPending) {
    return <div>loading data...</div>
  }

  return (
    <div>
      <h2>Notes app</h2>
      <form onSubmit={addNote}>
        <input name="note" />
        <button type="submit">add</button>
      </form>
      {notes.map((note) => (
        <li key={note.id}>
          {note.important ? <strong>{note.content}</strong> : note.content}
          <button onClick={() => toggleImportance(note)}>
            {note.important ? 'make not important' : 'make important'}
          </button>
        </li>
      ))}
    </div>
  )
}
```

El código de la aplicación está en [GitHub](https://github.com/fullstack-hy2020/query-notes/tree/part6-3) en la rama <i>part6-3</i>.

TanStack Query es una librería versátil que, basándonos en lo que ya hemos visto, simplifica la aplicación. ¿Hace TanStack Query que soluciones de gestión de estado más complejas como Redux sean innecesarias? No. TanStack Query puede reemplazar parcialmente el estado de la aplicación en algunos casos, pero como lo indica la [documentación](https://tanstack.com/query/latest/docs/react/guides/does-this-replace-client-state):

- TanStack Query es una <i>librería de estado del servidor</i>, responsable de la gestión de operaciones asíncronas entre el servidor y el cliente
- Zustand y otras soluciones similares son <i>librerías de estado del cliente</i> que pueden almacenar datos asíncronos, aunque con menor eficiencia que una herramienta como TanStack Query

Entonces, TanStack Query es una librería que mantiene el <i>estado del servidor</i> en el frontend, es decir, actúa como una caché para lo que se almacena en el servidor. TanStack Query simplifica el procesamiento de datos en el servidor y, en algunos casos, puede eliminar la necesidad de que los datos en el servidor se guarden en el estado del frontend.

La mayoría de las aplicaciones de React no necesitan solo una forma de almacenar temporalmente los datos servidos, sino también alguna solución para cómo se maneja el resto del estado del frontend (por ejemplo, el estado de los formularios o las notificaciones).

</div>

<div class="tasks">

### Ejercicios 6.16.-6.19.

Ahora hagamos una nueva versión de la aplicación de anécdotas que use la librería TanStack Query. Usa [este proyecto](https://github.com/fullstack-hy2020/query-anecdotes) como punto de partida. El proyecto tiene un JSON Server instalado, la operación del cual se ha modificado ligeramente (Revisa el archivo _server.js_ para más detalles. Asegúrate de estar conectándote al _PORT_ correcto). Inicia el servidor con <i>npm run server</i>.

Usa la Fetch API para hacer las peticiones.

#### Ejercicio 6.16

Implementa la obtención de anécdotas del servidor usando TanStack Query.

La aplicación debe funcionar de tal manera que si hay problemas para comunicarse con el servidor, solo se mostrará una página de error:

![navegador diciendo que anecdote service no esta disponible debido a problemas con el servidor en localhost](../../images/6/65new.png)

Puedes encontrar [aquí](https://tanstack.com/query/latest/docs/react/guides/queries) información sobre cómo detectar posibles errores.

Puedes simular un problema con el servidor apagando el JSON Server. Ten en cuenta que en una situación problemática, la consulta primero está en el estado <i>isLoading</i> durante un tiempo, porque si una solicitud falla, TanStack Query intenta la solicitud varias veces antes de que indique que la solicitud no es exitosa. Opcionalmente, puedes especificar que no se realicen reintentos:

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

#### Ejercicio 6.17

Implementa la adición de nuevas anécdotas al servidor usando TanStack Query. La aplicación debe renderizar una nueva anécdota por defecto. Ten en cuenta que el contenido de la anécdota debe tener al menos 5 caracteres de longitud, de lo contrario el servidor rechazará la solicitud POST. No tienes que preocuparte por el control de errores ahora.

#### Ejercicio 6.18

Implementa la votación de anécdotas usando nuevamente TanStack Query. La aplicación debe renderizar automáticamente el número aumentado de votos para la anécdota votada.

#### Ejercicio 6.19

Extrae los detalles de TanStack Query a un hook personalizado.

</div>

<div class="content">

### Context API

Volvamos a la conocida aplicación de contador. La aplicación se define de la siguiente manera:

```js
import { useState } from 'react'
import Display from './components/Display'
import Controls from './components/Controls'

const App = () => {
  const [counter, setCounter] = useState(0)

  return (
    <div>
      <Display counter={counter} />
      <Controls counter={counter} setCounter={setCounter} />
    </div>
  )
}
```

El componente <i>App</i> define el estado de la aplicación y se lo pasa a <i>Display</i>, que renderiza el valor del contador:

```js
const Display = ({ counter }) => {

  return (
    <div>{counter}</div>
  )
}
```

y al componente <i>Controls</i>, que renderiza los botones:

```js
const Controls = ({ counter, setCounter }) => {
  const increment = () => setCounter(counter + 1)
  const decrement = () => setCounter(counter - 1)
  const zero = () => setCounter(0)

  return (
    <div>
      <button onClick={increment}>plus</button>
      <button onClick={decrement}>minus</button>
      <button onClick={zero}>zero</button>
    </div>
  )
}
```

La aplicación crece:

![](../../images/6/t6.png)

El papel de <i>App</i> cambia: sigue conservando el estado, pero ya no renderiza directamente los componentes que lo utilizan:

```js
const App = () => {
  const [counter, setCounter] = useState(0)

  return (
    <div>
      <Navbar />
      <Panel counter={counter} setCounter={setCounter} />
      <Footer />
    </div>
  )
}
```

El nuevo componente <i>Panel</i> renderiza los componentes que muestran el contador y los botones:

```js
import Display from './Display'
import Controls from './Controls'

const Panel = ({ counter, setCounter }) => {
  return (
    <div>
      <Display counter={counter} />
      <Controls counter={counter} setCounter={setCounter} />
    </div>
  )
}
```

La jerarquía de componentes es la siguiente:

```
App (state)
 ├── Panel 
 │    ├── Display
 │    └── Controls
 └── Footer
```

El estado continúa en <i>App</i>. Para que <i>Display</i> y <i>Controls</i> accedan al contador, tanto el estado como su función de actualización deben atravesar <i>Panel</i> como props, aunque <i>Panel</i> no los necesite. Esta situación aparece fácilmente al utilizar estado creado con <i>useState</i> y se denomina [prop drilling](https://kentcdodds.com/blog/prop-drilling).

La [Context API](https://react.dev/learn/passing-data-deeply-with-context) integrada en React ofrece una solución. Un contexto de React es una especie de estado global de la aplicación al que se puede dar acceso directo a cualquier componente.

Creemos un contexto que almacene la gestión del estado del contador.

El contexto se crea con [createContext](https://react.dev/reference/react/createContext). Lo definiremos en el archivo <i>src/CounterContext.jsx</i>:

```js
import { createContext } from 'react'

const CounterContext = createContext()

export default CounterContext
```

El componente <i>App</i> puede <i>proporcionar</i> el contexto a sus componentes hijos así:

```js
// ...
import CounterContext from './components/CounterContext'

const App = () => {
  const [counter, setCounter] = useState(0)

  return (
    <CounterContext.Provider value={{counter, setCounter}}> // highlight-line
      <Panel /> // highlight-line
      <Footer />
    </CounterContext.Provider> // highlight-line
  )
}
```

El contexto se proporciona envolviendo los componentes hijos con <i>CounterContext.Provider</i> y asignándole un valor adecuado.

Su valor es ahora un objeto con los atributos <i>counter</i> y <i>setCounter</i>: el estado del contador y la función que lo actualiza.

Como <i>Panel</i> ya no recibe props relacionadas con el contador, se simplifica:

```js
const Panel = () => {
  return (
    <div>
      <Display />
      <Controls />
    </div>
  )
}
```

Los demás componentes pueden acceder al contexto mediante el hook [useContext](https://react.dev/reference/react/useContext). <i>Display</i> cambia de la siguiente manera:

```js
import { useContext } from 'react' // highlight-line
import CounterContext from './CounterContext' // highlight-line

const Display = () => {  // highlight-line
  const { counter } = useContext(CounterContext) // highlight-line

  return <div>{counter}</div>
}
```

<i>Display</i> ya no necesita props. Obtiene el contador llamando a <i>useContext</i> con el objeto <i>CounterContext</i> como parámetro.

De forma análoga, <i>Controls</i> pasa a ser:

```js
import { useContext } from 'react' // highlight-line
import CounterContext from './CounterContext' // highlight-line

const Controls = () => {
  const { counter, setCounter } = useContext(CounterContext) // highlight-line

  const increment = () => setCounter(counter + 1)
  const decrement = () => setCounter(counter - 1)
  const zero = () => setCounter(0)

  return (
    <div>
      <button onClick={increment}>plus</button>
      <button onClick={decrement}>minus</button>
      <button onClick={zero}>zero</button>
    </div>
  )
}

export default Controls
```

Los componentes ya tienen acceso al contenido establecido por el proveedor: el estado del contador y su función de actualización.

Extraen los atributos que necesitan mediante la desestructuración de JavaScript:

```js
const { counter } = useContext(CounterContext)
```

### Definir el contexto del contador en su propio archivo

La aplicación aún tiene un aspecto poco agradable: la gestión del estado del contador está definida dentro de <i>App</i>. Traslademos todo el código relacionado al archivo <i>CounterContext.jsx</i>:

```js
import { createContext, useState } from 'react'

const CounterContext = createContext()

export default CounterContext

// highlight-start
export const CounterContextProvider = (props) => {
  const [counter, setCounter] = useState(0)

  return (
    <CounterContext.Provider value={{ counter, setCounter }}>
      {props.children}
    </CounterContext.Provider>
  )
}
// highlight-end
```

El archivo exporta tanto <i>CounterContext</i> como <i>CounterContextProvider</i>, que es esencialmente un proveedor cuyo valor contiene el contador y su función de actualización.

Utilicemos el proveedor directamente en <i>main.jsx</i>:

```js
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
import { CounterContextProvider } from './CounterContext' // highlight-line

createRoot(document.getElementById('root')).render(
  <CounterContextProvider> // highlight-line
    <App />
  </CounterContextProvider> // highlight-line
)
```

El contexto que define el valor y la funcionalidad del contador está ahora disponible para <i>todos</i> los componentes.

<i>App</i> se simplifica:

```js
import Panel from './components/Panel'
import Footer from './components/Footer'

const App = () => {

  return (
    <div>
      <Navbar />
      <Panel />
      <Footer />
  </div>
  )
}

export default App
```

El contexto sigue utilizándose igual y los demás componentes no necesitan cambios. Por ejemplo, <i>Controls</i> permanece así:

```js
const Controls = () => {
  const { counter, setCounter } = useContext(CounterContext)
  const increment = () => setCounter(counter + 1)
  const decrement = () => setCounter(counter - 1)
  const zero = () => setCounter(0)

  return (
    <div>
      <button onClick={increment}>plus</button>
      <button onClick={decrement}>minus</button>
      <button onClick={zero}>zero</button>
    </div>
  )
}
```

La solución es bastante buena. Todo el estado de la aplicación —el valor del contador— queda aislado en <i>CounterContext</i>. Cada componente accede exactamente a la parte que necesita mediante <i>useContext</i> y la desestructuración.

Hagamos una pequeña mejora y definamos también las funciones <i>increment</i>, <i>decrement</i> y <i>zero</i> dentro del contexto:

```js
import { createContext, useState } from 'react'

const CounterContext = createContext()

export default CounterContext

export const CounterContextProvider = (props) => {
  const [counter, setCounter] = useState(0)

// highlight-start
  const increment = () => setCounter(counter + 1)
  const decrement = () => setCounter(counter - 1)
  const zero = () => setCounter(0)
// highlight-end

  return (
    <CounterContext.Provider value={{ counter, increment, decrement, zero }}> // highlight-line
      {props.children}
    </CounterContext.Provider>
  )
}
```

Ahora podemos usar las funciones obtenidas del contexto directamente como controladores de eventos:

```js
import { useContext } from 'react'
import CounterContext from '../CounterContext' 

const Controls = () => {
  const { increment, decrement, zero } = useContext(CounterContext) // highlight-line

  return (
    <div>
      <button onClick={increment}>plus</button>
      <button onClick={decrement}>minus</button>
      <button onClick={zero}>zero</button>
    </div>
  )
}
```

Todavía podemos mejorarlo. Al observar el uso del contexto, vemos el mismo código repetitivo en ambos componentes que lo consumen:

```js
import { useContext } from 'react'
import CounterContext from '../CounterContext' 

const Display = () => {
  const { counter } = useContext(CounterContext)
  // ...
}
```

```js
import { useContext } from 'react'
import CounterContext from '../CounterContext' 

const Controls = () => {
  const { increment, decrement, zero } = useContext(CounterContext) // highlight-line
  // ...
}
```

Podemos avanzar un paso más creando un hook personalizado que devuelva directamente el contexto. Añadámoslo al archivo <i>hooks/useCounter.js</i>:

```js
import { useContext } from 'react'
import CounterContext from '../CounterContext'

const useCounter = () => useContext(CounterContext)

export default useCounter

```

El uso del contexto queda aún más sencillo:

```js
import { useCounter } from '../hooks/useCounter'

const Display = () => {
  const { counter } = useCounter()
  // ...
}

import { useCounter } from '../hooks/useCounter'

const Controls = () => {
  const { increment, decrement, zero } = useCounter()
  // ...
}
```

La solución nos satisface. Aísla toda la gestión del estado dentro del contexto. Los componentes que lo usan desconocen cómo se implementa; gracias al hook personalizado, ni siquiera necesitan saber que la solución se basa en la Context API.

El código de la aplicación está en el repositorio de GitHub [https://github.com/fullstack-hy2020/context-counter](https://github.com/fullstack-hy2020/context-counter).
</div>

<div class="tasks">

### Ejercicios 6.20.-6.22.

#### Ejercicio 6.20.

La aplicación tiene un componente <i>Notification</i> para mostrar notificaciones al usuario.

Implementa la gestión del estado de las notificaciones de la aplicación utilizando la Context API. La notificación debe informar al usuario cuando se crea una nueva anécdota o cuando se vota por ella:

![navegador mostrando notificación para anécdota añadida](../../images/6/66new.png)

La notificación se muestra durante cinco segundos.

#### Ejercicio 6.21.

Como se indicó en el ejercicio 6.17, el servidor exige que el contenido de la anécdota que se añade tenga al menos 5 caracteres. Implementa ahora el manejo de errores de la inserción. En la práctica basta con mostrar una notificación cuando falle la solicitud POST:

![navegador mostrando notificación de error por tratar de crear una anécdota muy corta](../../images/6/67new.png)

La condición de error debe manejarse en la función de callback registrada para ello, consulta [aquí](https://tanstack.com/query/latest/docs/react/reference/useMutation) cómo registrar una función.

#### Ejercicio 6.22.

Si aún no lo has hecho, mueve el contexto de las notificaciones a su propio archivo <i>NotificationContext.jsx</i>, del mismo modo que el contexto de la aplicación del contador se trasladó a <i>CounterContext.jsx</i>. Crea también un hook personalizado <i>useNotify</i> que encapsule la lógica de las notificaciones. Simplifica los componentes que las utilizan para que llamen directamente al hook en lugar de llamar a <i>useContext</i> por separado.

Este fue el último ejercicio para esta parte del curso y es hora de enviar tu código a GitHub y marcar todos tus ejercicios completados en el [sistema de envío de ejercicios](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

</div>

<div class="content">

### ¿Qué solución de gestión de estado elegir?

En los capítulos 1-5, toda la gestión de estado de la aplicación se realizó utilizando el hook de React <i>useState</i>. Las llamadas asíncronas al backend requerían el uso del hook <i>useEffect</i> en algunas situaciones. En principio, no se necesita nada más.

Un problema sutil con una solución basada en un estado creado con el hook <i>useState</i> es que si alguna parte del estado de la aplicación se necesita en varios componentes de la aplicación, el estado y las funciones para manipularlo deben pasarse via props a todos los componentes que manejan el estado. A veces, las props deben pasar por varios componentes, y los componentes a lo largo del camino pueden ni siquiera estar interesados en el estado de ninguna manera. Este fenómeno algo desagradable se llama <i>prop drilling</i>.

A lo largo de los años, se han desarrollado varias soluciones alternativas para la gestión de estado de aplicaciones React, que se pueden usar para aliviar situaciones problemáticas (por ejemplo, prop drilling). Sin embargo, ninguna solución ha sido "final", todas tienen sus propias ventajas y desventajas, y se están desarrollando nuevas soluciones todo el tiempo.

La situación puede confundir a un principiante e incluso a un desarrollador web experimentado. ¿Qué solución se debe usar?

Para una aplicación simple, <i>useState</i> es sin duda un buen punto de partida. Si la aplicación está comunicándose con el servidor, la comunicación se puede manejar de la misma manera que en los capítulos 1-5, utilizando el estado de la aplicación misma. Sin embargo, recientemente se ha vuelto más común mover la comunicación y la gestión asociada del estado al menos parcialmente bajo el control de TanStack Query (o alguna otra librería similar). Si estás preocupado por useState y el prop drilling que conlleva, usar context puede ser una buena opción. También hay situaciones donde puede tener sentido manejar parte del estado con useState y parte con contextos.

Durante mucho tiempo, la solución más popular y completa fue Redux, una forma de implementar la arquitectura [Flux](https://facebookarchive.github.io/flux/). Sin embargo, Redux es conocido por su complejidad y la abundancia de código repetitivo, lo que motivó la aparición de alternativas más recientes. En este curso Redux se ha sustituido por [Zustand](https://zustand.docs.pmnd.rs/), que ofrece una funcionalidad equivalente con una API mucho más sencilla. Zustand se ha convertido en una opción popular cuando hace falta algo más que useState, pero toda la maquinaria de Redux resulta excesiva. Parte de las críticas a la rigidez de Redux han quedado obsoletas gracias a [Redux Toolkit](https://redux-toolkit.js.org/), y Redux todavía se usa mucho, especialmente en proyectos grandes.

Ni Zustand ni Redux tienen que utilizarse en toda la aplicación. Por ejemplo, puede ser razonable gestionar fuera de ellos el estado de los formularios cuando no afecta al resto de la aplicación. También es perfectamente posible combinar Zustand o Redux con TanStack Query.

La pregunta de qué solución de gestión de estado se debe usar no es para nada sencilla. Es imposible dar una sola respuesta correcta. También es probable que la solución de gestión de estado seleccionada pueda resultar ser subóptima a medida que la aplicación crece hasta tal punto que la solución tenga que cambiarse incluso si la aplicación ya ha sido puesta en uso de producción.

</div>
