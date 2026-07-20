---
mainImage: ../../../images/part-7.svg
part: 7
letter: a
lang: es
---

<div class="content">

Los ejercicios de esta parte del curso difieren un poco de los anteriores. Como de costumbre, hay algunos ejercicios relacionados con la teoría de este capítulo. Los demás capítulos de esta parte no tienen ejercicios separados.

Además, esta parte contiene una serie más amplia de ejercicios que amplía la aplicación BlogList creada en las partes 4 y 5. Puedes encontrar esos ejercicios [aquí](/es/part7/ejercicios_ampliar_la_lista_de_blogs).

### Hooks de React

React ofrece 18 [hooks incorporados](https://es.react.dev/reference/react/hooks) diferentes, de los cuales los más populares son [useState](https://es.react.dev/reference/react/useState) y [useEffect](https://es.react.dev/reference/react/useEffect), que ya hemos utilizado extensivamente.

En la [parte 5](/es/part5/props_children_y_la_ref_del_componente#referencias-a-componentes-con-ref) usamos [useRef](https://es.react.dev/reference/react/useRef) y [useImperativeHandle](https://es.react.dev/reference/react/useImperativeHandle), que permitieron que un componente proporcionara acceso a sus funciones a otros componentes. En la [parte 6](/es/part6/react_query_y_context_api) utilizamos [useContext](https://es.react.dev/reference/react/useContext) para implementar un estado global.

En los últimos años, los hooks se han convertido en la forma estándar en que las librerías exponen sus APIs. A lo largo del curso ya hemos visto varios ejemplos: [Zustand](https://zustand-demo.pmnd.rs/) proporciona <i>useStore</i> para acceder al estado global, [React Router](https://reactrouter.com/) expone <i>useNavigate</i> y <i>useParams</i> para la navegación programática y el acceso a parámetros de la URL, y [React Query](https://tanstack.com/query/latest) ofrece <i>useQuery</i> y <i>useMutation</i> para gestionar el estado del servidor.

Como se mencionó en la [parte 1](/es/part1/un_estado_mas_complejo_depurando_aplicaciones_react#reglas-de-los-hooks), los hooks no son funciones normales y cuando los usamos tenemos que cumplir con ciertas [reglas o limitaciones](https://es.react.dev/warnings/invalid-hook-call-warning#breaking-rules-of-hooks). Recapitulemos las reglas del uso de hooks, copiadas literalmente de la documentación oficial de React:

**Evita utilizar Hooks dentro de loops, condicionales o funciones anidadas.** En su lugar, utiliza los Hooks únicamente en el nivel superior de tu función de React.

**Los Hooks sólo deben ser utilizados durante la renderización de un componente de función en React:**

- Utilízalos en el nivel superior del cuerpo de un componente de función.
- Utilízalos en el nivel superior del cuerpo de un Hook personalizado.

Existe un [plugin de ESLint](https://www.npmjs.com/package/eslint-plugin-react-hooks) que se puede usar para verificar que la aplicación utiliza los hooks correctamente:

![error de vscode al llamar a useState condicionalmente](../../images/7/60ea.png)

Además de los hooks que ya hemos utilizado, React proporciona varios hooks incorporados que merece la pena conocer. En esta sección veremos dos de ellos, <i>useMemo</i> y <i>useCallback</i>, ambos relacionados con la optimización del rendimiento. Después pasaremos a los hooks personalizados, que permiten empaquetar cualquier combinación de hooks en una función reutilizable propia.

### useMemo

Cada vez que un componente de React se vuelve a renderizar, se ejecuta de nuevo todo el cuerpo de la función. Para la mayoría de los componentes esto no supone ningún problema, pero en ocasiones un componente realiza un cálculo costoso —como filtrar una lista grande, ordenar datos u obtener un valor complejo— y repetirlo en cada renderizado desperdicia tiempo.

[useMemo](https://es.react.dev/reference/react/useMemo) permite almacenar en caché el resultado de un cálculo entre renderizados. Recibe una función que realiza el cálculo y un array de dependencias. React solo vuelve a ejecutar la función cuando cambia alguna de las dependencias; en caso contrario, devuelve el resultado almacenado anteriormente.

Consideremos un componente que renderiza una larga lista de elementos filtrados por un término de búsqueda:

```js
import { useState } from 'react'

const expensiveCalculation = () => {
  let sum = 0
  for (let i = 0; i < 100000; i++) sum += i
  return sum
}

const ITEMS = Array.from({ length: 10000 }, (_, i) => `item ${i + 1}`)

const FilteredList = () => {
  const [filter, setFilter] = useState('')
  const [darkMode, setDarkMode] = useState(false)

  console.log('filtering...')
  const filtered = ITEMS.filter(item => {
    expensiveCalculation()
    return item.includes(filter)
  })

  return (
    <div style={{ background: darkMode ? '#333' : '#fff' }}>
      <input
        value={filter}
        onChange={e => setFilter(e.target.value)}
        placeholder="filter items"
      />
      <button onClick={() => setDarkMode(!darkMode)}>toggle dark mode</button>
      <ul>
        {filtered.map(item => <li key={item}>{item}</li>)}
      </ul>
    </div>
  )
}

export default FilteredList
```

Filtrar la lista lleva ahora tiempo, en parte gracias a la ralentización artificial que hemos introducido.

El problema del componente es que al hacer clic en el botón del modo oscuro se vuelven a filtrar los 10 000 elementos aunque el texto del filtro no haya cambiado.

Podemos solucionarlo con <i>useMemo</i>:

```js
import { useState, useMemo } from 'react' // highlight-line

const FilteredList = () => {
  const [filter, setFilter] = useState('')
  const [darkMode, setDarkMode] = useState(false)

  const filtered = useMemo(() => {  // highlight-line
    console.log('filtering...')
    return ITEMS.filter(item => {
      expensiveCalculation()
      return item.includes(filter)
    })
  }, [filter])  // highlight-line

  return (
    <div style={{ background: darkMode ? '#333' : '#fff' }}>
      //...
    </div>
  )
}
```

Con <i>useMemo</i>, el filtrado costoso solo se ejecuta cuando cambia <i>filter</i>. Alternar el modo oscuro únicamente actualiza el color de fondo y la lista filtrada almacenada en caché se devuelve de inmediato.

El array de dependencias funciona exactamente igual que el de <i>useEffect</i>: React compara cada valor con el del renderizado anterior. Si todos los valores son idénticos, se reutiliza el valor memorizado. Si alguno difiere, la función se ejecuta de nuevo y el resultado se almacena para el siguiente renderizado.

<i>useMemo</i> también puede utilizarse para memorizar objetos y arrays que se pasan como props, evitando renderizados innecesarios de componentes hijos que utilizan igualdad por referencia. Por ejemplo:

```js
const App = () => {
  const [filter, setFilter] = useState('')

  // Without useMemo, 'options' is a new object on every render even if filter hasn't changed
  const options = useMemo(() => ({ caseSensitive: false, filter }), [filter]) // highlight-line

  return <SearchResults options={options} />
}
```

<i>useMemo</i> es una optimización del rendimiento; no deberías utilizarlo por defecto. La [memorización prematura](https://wiki.c2.com/?PrematureOptimization) añade complejidad sin aportar beneficios cuando el cálculo es rápido. Mide primero y añade <i>useMemo</i> solo cuando hayas confirmado que un cálculo concreto constituye un cuello de botella.

### React.memo

Mientras que <i>useMemo</i> almacena en caché el resultado de un cálculo dentro de un componente, [React.memo](https://es.react.dev/reference/react/memo) adopta un enfoque diferente: almacena la salida renderizada de un componente completo. <i>React.memo</i> no es un hook, sino un componente de orden superior, y lo tratamos aquí porque complementa bien a <i>useMemo</i>. Cuando un componente está envuelto en <i>React.memo</i>, React omite su nuevo renderizado si sus props no han cambiado desde el renderizado anterior.

```js
const MyComponent = React.memo(({ value }) => {
  console.log('rendered')
  return <div>{value}</div>
})
```

Sin <i>React.memo</i>, <i>MyComponent</i> se vuelve a renderizar cada vez que lo hace su componente padre, aunque <i>value</i> sea el mismo. Con él, React compara las props anteriores y nuevas mediante una igualdad superficial y solo vuelve a renderizar cuando algo ha cambiado realmente.

Ten en cuenta que <i>React.memo</i> solo comprueba las props. Si el componente utiliza un valor del contexto o su propio estado, seguirá renderizándose de nuevo cuando estos cambien.

<i>React.memo</i> se combina de forma natural con <i>useMemo</i>: <i>useMemo</i> evita que se repitan cálculos costosos, mientras que <i>React.memo</i> impide que el propio componente vuelva a renderizarse.

Si un componente memorizado recibe una nueva referencia a una función u objeto en cada renderizado, la memorización queda anulada. Aquí es donde entra en juego <i>useCallback</i>.

### useCallback

Las funciones definidas dentro de un componente se vuelven a crear como objetos nuevos en cada renderizado. Normalmente esto es inofensivo, pero se convierte en un problema en dos situaciones concretas:

- Un componente hijo envuelto en [React.memo](https://es.react.dev/reference/react/memo) recibe la función como prop. Como la función es un objeto nuevo cada vez, el hijo siempre detecta una prop distinta y se vuelve a renderizar, anulando el propósito de la memorización.
- Una función aparece como dependencia de <i>useEffect</i> o <i>useMemo</i>. Si se crea una función nueva en cada renderizado, el efecto o el valor memorizado se vuelven a ejecutar en cada renderizado.

[useCallback](https://es.react.dev/reference/react/useCallback) resuelve este problema almacenando en caché la propia función entre renderizados y devolviendo el mismo objeto función mientras no cambien sus dependencias. Recibe una función y un array de dependencias, con una estructura idéntica a la de <i>useMemo</i>.

Veamos un ejemplo concreto. Tenemos un componente <i>NoteList</i> costoso de renderizar, así que lo envolvemos en <i>React.memo</i>:

```js
// React.memo makes this component skip re-rendering if its props haven't changed
const NoteList = memo(({ onDelete, notes }) => {
  console.log('NoteList rendered')
  return (
    <ul>
      {notes.map(note => (
        <li key={note.id}>
          {note.content}
          <button onClick={() => onDelete(note.id)}>delete</button>
        </li>
      ))}
    </ul>
  )
})

const App = () => {
  const [notes, setNotes] = useState([
    { id: 1, content: 'Learn React' },
    { id: 2, content: 'Learn hooks' },
    { id: 3, content: 'Learn useMemo' },
    { id: 4, content: 'Learn useCallback' },
    { id: 5, content: 'Build something cool' },
  ])
  const [newNote, setNewNote] = useState('')

  const handleDelete = (id) => {
    setNotes(notes => notes.filter(note => note.id !== id))
  }

  const handleAdd = () => {
    setNotes(notes => [...notes, { id: Date.now(), content: newNote }])
    setNewNote('')
  }

  return (
    <div>
      <input value={newNote} onChange={e => setNewNote(e.target.value)} />
      <button onClick={handleAdd}>add</button>
      <NoteList notes={notes} onDelete={handleDelete} />
    </div>
  )
}
```

El problema es que <i>handleDelete</i> está definida como una función normal dentro de <i>App</i>. Cada vez que <i>App</i> se vuelve a renderizar —lo que ocurre con cada pulsación en el campo de la nueva nota— se crea un objeto función completamente nuevo y se pasa a <i>NoteList</i> como prop <i>onDelete</i>.

Desde la perspectiva de <i>React.memo</i>, la prop ha cambiado, por lo que <i>NoteList</i> vuelve a renderizarse aunque la lista no haya cambiado:

![muchos renderizados repetidos](../../images/7/h1.png)

Podemos solucionarlo con <i>useCallback</i>, que devuelve el mismo objeto función entre renderizados mientras sus dependencias no cambien:

```js
import { useState, useCallback, memo } from 'react'


const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')

// highlight-start
  const handleDelete = useCallback((id) => { // highlight-line
    setNotes(notes => notes.filter(note => note.id !== id))
  }, []) // no external dependencies: this function never needs to change
// highlight-end

  // ...
  return (
    // ...
  )
}
```

Ahora <i>handleDelete</i> es estable: React devuelve exactamente el mismo objeto función en cada renderizado, por lo que <i>React.memo</i> no detecta ningún cambio en la prop <i>onDelete</i> y omite por completo el nuevo renderizado de <i>NoteList</i>.

Al igual que <i>useMemo</i>, utiliza <i>useCallback</i> solo cuando tengas un problema concreto, como un componente hijo memorizado que se renderiza innecesariamente o un <i>useEffect</i> que se ejecuta con demasiada frecuencia debido a una dependencia de función. Añadirlo en todas partes hace que el código sea más difícil de leer sin aportar ninguna mejora de rendimiento.

### Hooks personalizados

React ofrece la opción de crear nuestros propios hooks [personalizados](https://es.react.dev/learn/reusing-logic-with-custom-hooks). Según React, el propósito principal de los hooks personalizados es facilitar la reutilización de la lógica utilizada en los componentes.

> <i>Crear tus propios Hooks te permite extraer la lógica de los componentes en funciones reutilizables.</i>

Los hooks personalizados son funciones normales de JavaScript que pueden utilizar cualquier otro hook, siempre que respeten las [reglas de los hooks](/es/part1/un_estado_mas_complejo_depurando_aplicaciones_react#reglas-de-los-hooks). Además, el nombre de los hooks personalizados debe comenzar con la palabra <i>use</i>.

La idea clave es que cualquier lógica con estado que te encuentres duplicando entre componentes es candidata a extraerse a un hook personalizado. Cada llamada al mismo hook crea una porción de estado independiente. Esto es lo que distingue un hook personalizado de una función de utilidad corriente.

Ya hemos implementado varios hooks personalizados en la parte 6. Los hooks <i>useNotes</i> y <i>useNoteActions</i> se crearon en la sección sobre [Zustand](/es/part6/arquitectura_flux_y_zustand#notas-de-zustand), y <i>useCounter</i> se definió en la sección sobre [React Query y Context](/es/part6/react_query_y_context_api#definir-el-contexto-del-contador-en-su-propio-archivo).

#### Hook de contador

Implementamos una aplicación de contador en la [parte 1](/es/part1/estado_del_componente_controladores_de_eventos#control-de-eventos), que puede tener su valor incrementado, reducido o reiniciado. El código de la aplicación es el siguiente:

```js  
import { useState } from 'react'

const App = () => {
  const [counter, setCounter] = useState(0)

  return (
    <div>
      <div>{counter}</div>
      <button onClick={() => setCounter(counter + 1)}>
        plus
      </button>
      <button onClick={() => setCounter(counter - 1)}>
        minus
      </button>      
      <button onClick={() => setCounter(0)}>
        zero
      </button>
    </div>
  )
}
```

Extraigamos la lógica del contador en su propio hook personalizado. El código del hook es el siguiente:

```js
const useCounter = () => {
  const [value, setValue] = useState(0)

  const increase = () => {
    setValue(value + 1)
  }

  const decrease = () => {
    setValue(value - 1)
  }

  const zero = () => {
    setValue(0)
  }

  return {
    value, 
    increase,
    decrease,
    zero
  }
}
```

Nuestro hook personalizado utiliza el hook _useState_ internamente para crear su propio estado. El hook devuelve un objeto, cuyas propiedades incluyen el valor del contador, así como funciones para manipular el valor.

Los componentes de React pueden utilizar el hook como se muestra a continuación:

```js
const App = () => {
  const counter = useCounter()

  return (
    <div>
      <div>{counter.value}</div>
      <button onClick={counter.increase}>
        plus
      </button>
      <button onClick={counter.decrease}>
        minus
      </button>      
      <button onClick={counter.zero}>
        zero
      </button>
    </div>
  )
}
```

Al hacer esto, podemos extraer el estado del componente _App_ y su manipulación por completo en el hook _useCounter_. La gestión del estado y la lógica del contador ahora es responsabilidad del hook personalizado.

El mismo hook podría <i>reutilizarse</i> en la aplicación que realizaba un seguimiento de la cantidad de clics realizados en los botones izquierdo y derecho:

```js

const App = () => {
  const left = useCounter()
  const right = useCounter()

  return (
    <div>
      {left.value}
      <button onClick={left.increase}>
        left
      </button>
      <button onClick={right.increase}>
        right
      </button>
      {right.value}
    </div>
  )
}
```

La aplicación crea <i>dos</i> contadores completamente separados. El primero se asigna a la variable <i>left</i> y el otro a la variable <i>right</i>. Cada llamada a <i>useCounter</i> crea su propia porción de estado independiente.

#### Hooks personalizados y nuevos renderizados de componentes

Una pregunta natural en este punto es: ¿cuándo se vuelve a renderizar realmente un componente que utiliza un hook personalizado?

La respuesta es sencilla cuando se entiende qué es en realidad un hook personalizado. Desde la perspectiva del componente, un hook personalizado no es una entidad separada. Es simplemente una parte de la lógica del propio componente que se ha trasladado a una función independiente. Esto significa que todo el estado y los efectos definidos dentro del hook pertenecen al componente que lo llama, no al propio hook.

En consecuencia, las reglas de renderizado son exactamente las mismas que con los hooks incorporados. El componente vuelve a renderizarse cuando cambia un estado gestionado dentro del hook, cuando cambia un valor de contexto al que el hook está suscrito o cuando cualquier hook al que el hook personalizado llama internamente provoca un nuevo renderizado.

En cambio, acciones como reasignar variables normales dentro del hook o que cambien por sí solos los argumentos pasados al hook no provocan un nuevo renderizado.

Los argumentos merecen un análisis más detallado. Pasar un nuevo valor a un hook no programa por sí mismo un nuevo renderizado, pero si el hook utiliza ese argumento como dependencia de un <i>useEffect</i> o un <i>useMemo</i>, el cambio hará que el efecto o el valor memorizado vuelvan a ejecutarse. Si esto, a su vez, llama a una función actualizadora del estado, el componente se renderizará de nuevo.

Una forma útil de entenderlo es imaginar que copias y pegas todo el código del hook personalizado directamente dentro del componente. El comportamiento de renderizado sería idéntico. El hook solo sirve para organizar ese código; no es un límite que React trate de una manera especial.

```js
const useCounter = () => {
  const [count, setCount] = useState(0) // this state belongs to the calling component
  return { count, increment: () => setCount(c => c + 1) }
}

const MyComponent = () => {
  const { count, increment } = useCounter()
  // re-renders whenever the count state inside the hook is updated
}
```

#### Hook para campos de formulario

Tratar con formularios en React es algo complicado. La siguiente aplicación presenta al usuario un formulario que le solicita que ingrese su nombre, fecha de nacimiento y altura:

```js
const App = () => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  const [height, setHeight] = useState('')

  return (
    <div>
      <form>
        name: 
        <input
          type='text'
          value={name}
          onChange={(event) => setName(event.target.value)} 
        /> 
        <br/> 
        birthdate:
        <input
          type='date'
          value={born}
          onChange={(event) => setBorn(event.target.value)}
        />
        <br /> 
        height:
        <input
          type='number'
          value={height}
          onChange={(event) => setHeight(event.target.value)}
        />
      </form>
      <div>
        {name} {born} {height} 
      </div>
    </div>
  )
}
```

Cada campo del formulario tiene su propio estado. Para mantener el estado del formulario sincronizado con los datos proporcionados por el usuario, tenemos que registrar un controlador <i>onChange</i> apropiado para cada uno de los elementos <i>input</i>. El patrón es idéntico para todos los campos; solo cambia el nombre de la variable de estado. Este es exactamente el tipo de repetición que los hooks personalizados están diseñados para eliminar.

Definamos nuestro propio hook personalizado _useField_, que simplifica la gestión del estado del formulario:

```js
const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}
```

La función de hook recibe el tipo de campo de entrada como parámetro. Devuelve todos los atributos requeridos por el <i>input</i>: su tipo, valor y el controlador onChange.

El hook se puede utilizar de la siguiente manera:

```js
const App = () => {
  const name = useField('text')
  // ...

  return (
    <div>
      <form>
        <input
          type={name.type}
          value={name.value}
          onChange={name.onChange} 
        /> 
        // ...
      </form>
// ...
      <div>
        {name.value} {born} {height}  // highlight-line
      </div>      
    </div>
  )
}
```

### Propagación de atributos con spread

Podríamos simplificar un poco más las cosas. Dado que el objeto _name_ tiene exactamente todos los atributos que el elemento <i>input</i> espera recibir como props, podemos pasar los props al elemento usando la [sintaxis spread](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Spread_syntax)(spread syntax) de la siguiente manera:

```js
<input {...name} /> 
```

Como indica el [ejemplo](https://es.react.dev/learn/updating-objects-in-state#copying-objects-with-the-spread-syntax) en la documentación de React, las siguientes dos formas de pasar props a un componente logran exactamente el mismo resultado:

```js
<Greeting firstName='Arto' lastName='Hellas' />

const person = {
  firstName: 'Arto',
  lastName: 'Hellas'
}

<Greeting {...person} />
```

La aplicación se simplifica en el siguiente formato:

```js
const App = () => {
  const name = useField('text')
  const born = useField('date')
  const height = useField('number')

  return (
    <div>
      <form>
        name: 
        <input  {...name} /> 
        <br/> 
        birthdate:
        <input {...born} />
        <br /> 
        height:
        <input {...height} />
      </form>
      <div>
        {name.value} {born.value} {height.value}
      </div>
    </div>
  )
}
```

Tratar con formularios se simplifica enormemente cuando los desagradables detalles esenciales relacionados con la sincronización del estado del formulario se encapsulan dentro de nuestro hook personalizado.

#### Persistencia del estado con un hook personalizado

Los hooks personalizados pueden combinar varios hooks incorporados para encapsular comportamientos más complejos. Una funcionalidad que se necesita habitualmente es persistir el estado en <i>localStorage</i> para que sobreviva a una recarga de la página. El siguiente hook <i>useLocalStorage</i> envuelve <i>useState</i> y mantiene el valor sincronizado con localStorage:

```js
import { useState } from 'react'

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      setStoredValue(value)
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue]
}
```

El hook recibe una clave de almacenamiento y un valor inicial. En el primer renderizado lee el valor de localStorage y recurre a <i>initialValue</i> si todavía no hay nada almacenado. La función actualizadora que devuelve modifica al mismo tiempo tanto el estado de React como localStorage.

Un componente que lo utiliza tiene exactamente el mismo aspecto que uno que emplea <i>useState</i> directamente:

```js
const App = () => {
  const [name, setName] = useLocalStorage('name', '')

  return (
    <div>
      <input value={name} onChange={e => setName(e.target.value)} />
      <p>Hello, {name}! (your name is stored in localStorage)</p>
    </div>
  )
}
```

El componente no sabe que localStorage está implicado. Esa responsabilidad queda completamente oculta dentro del hook.

### Más sobre hooks

Los hooks personalizados no son solo una herramienta para reutilizar código; también proporcionan una forma mejor de dividirlo en partes modulares más pequeñas.

Internet está comenzando a llenarse con más y más material útil relacionado con los hooks. Vale la pena consultar las siguientes fuentes:

- [Awesome React Hooks Resources](https://github.com/rehooks/awesome-react-hooks)
- [Easy to understand React Hook recipes by Gabe Ragland](https://usehooks.com/)

</div>

<div class="tasks">

### Ejercicios 7.1.-7.6.

Volvamos una vez más a trabajar con anécdotas. Utiliza como punto de partida para los ejercicios la aplicación del repositorio https://github.com/fullstack-hy2020/routed-anecdotes.

Si clonas el proyecto dentro de un repositorio de Git existente, recuerda eliminar la configuración de Git de la aplicación clonada:

```bash
cd routed-anecdotes   // go first to directory of the cloned repository
rm -rf .git
```

La aplicación se inicia de la forma habitual, pero antes debes instalar sus dependencias:

```bash
npm install
npm run dev
```

#### 7.1: Hook useField

Copia el hook personalizado <i>useField</i> en el archivo <i>src/hooks/index.js</i>. El hook debe gestionar el estado de un único campo de formulario y devolver un objeto con las siguientes propiedades: <i>type</i>, <i>value</i> y <i>onChange</i>.

Si utilizas la [exportación nombrada](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/export#descripci%C3%B3n) en lugar de la exportación predeterminada:

```js
import { useState } from 'react'

export const useField = (type) => { // highlight-line
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

// modules can have several named exports
export const useAnotherHook = () => { // highlight-line
  // ...
}
```

Luego, la [importación](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/import) ocurre de la siguiente manera:

```js
import  { useField } from './hooks'

const App = () => {
  // ...
  const username = useField('text')
  // ...
}
```

Utiliza el hook en el formulario de creación de anécdotas.

#### 7.2: useField con reset

Añade al formulario un botón que borre todos los campos de entrada:

![formulario de anécdotas con botón reset](../../images/7/e2.png)

Amplía el hook <i>useField</i> para que exponga una función <i>reset</i> que borre el valor del campo.

Dependiendo de tu solución, es posible que veas la siguiente advertencia en tu consola:

![consola con advertencia: valor invalido para prop reset](../../images/7/62ea.png)

Volveremos a esta advertencia en el próximo ejercicio.

#### 7.3: Corrección del problema con spread

Si tu solución no provocó que apareciera una advertencia en la consola, ya has terminado este ejercicio.

Si ves la advertencia <i>Invalid value for prop \`reset\` on \<input\> tag</i> en la consola, realiza los cambios necesarios para eliminarla.

El motivo de esta advertencia es que después de realizar los cambios en tu aplicación, la siguiente expresión:

```js
<input {...content}/>
```

Esencialmente, es lo mismo que esto:

```js
<input
  value={content.value} 
  type={content.type}
  onChange={content.onChange}
  reset={content.reset} // highlight-line
/>
```

El elemento <i>input</i> no debe recibir un atributo <i>reset</i>.

Una solución simple sería no usar la sintaxis de spread y escribir todos los formularios de esta manera:

```js
<input
  value={username.value} 
  type={username.type}
  onChange={username.onChange}
/>
```

Si hiciéramos esto, perderíamos gran parte del beneficio proporcionado por el hook <i>useField</i>. En su lugar, busca una solución al problema, pero que aún sea fácil de usar con la sintaxis de spread.

#### 7.4: useAnecdotes, paso 1

El proyecto ya tiene configurado un servidor JSON. Puedes iniciarlo con:

```bash
npm run server
```

Esto inicia un backend de JSON Server que expone la colección de anécdotas como un recurso REST en <i>http://localhost:3001/anecdotes</i>.

El archivo existente <i>services/anecdotes.js</i> contiene las funciones necesarias para comunicarse con el backend, excepto la del último ejercicio. Ten en cuenta que el servicio utiliza la [Fetch API](https://developer.mozilla.org/es/docs/Web/API/Fetch_API) en vez de Axios para las peticiones HTTP. Si no conoces Fetch, consulta la [parte 6](/es/part6/estado_complejo_fetch_y_pruebas#fetch-api) antes de continuar.

El patrón habitual para obtener datos de un servidor en React tiene este aspecto:

```js
import { useState, useEffect } from 'react'
import anecdoteService from './services/anecdotes'

const App = () => {
  const [anecdotes, setAnecdotes] = useState([])

  useEffect(() => {
    anecdoteService.getAll().then(data => setAnecdotes(data))
  }, [])

  // ...
}
```

Implementa un hook personalizado <i>useAnecdotes</i> que encapsule esta comunicación con el servidor. Para este ejercicio basta con que el hook obtenga todas las anécdotas. La creación de nuevas anécdotas puede abordarse en el siguiente ejercicio.

El hook debe utilizarse de esta forma:

```js
// ...
import { useAnecdotes } from './hooks' // highlight-line

const App = () => {
  const { anecdotes } = useAnecdotes() // highlight-line

  const addAnecdote = () => {} // a dummy function to keep code from breaking

  return (
    <Router>
      <div>
        <h1>Software anecdotes</h1>
        <Menu />
        <Routes>
          <Route path="/" element={<AnecdoteList anecdotes={anecdotes} />} />
          <Route path="/create" element={<CreateNew addAnecdote={addAnecdote} />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App
```

**Una pista:** antes se mencionó lo siguiente:

> Una forma útil de entenderlo —es decir, de entender cómo funciona un hook— es imaginar que copias y pegas todo el código del hook personalizado directamente dentro del componente.

Ahora debes hacer, en cierto modo, lo contrario: copiar y pegar el código pertinente del componente en el hook. Esto incluye tanto <i>useState</i> como <i>useEffect</i>.

#### 7.5: useAnecdotes, paso 2

Amplía el hook <i>useAnecdotes</i> para que también permita crear nuevas anécdotas. El hook debe exponer una función <i>addAnecdote</i> que envíe la nueva anécdota al servidor y actualice el estado local.

Ahora el hook debe poder utilizarse así:

```js
const { anecdotes, addAnecdote } = useAnecdotes()
```

Actualiza el componente <i>App</i> para pasar <i>addAnecdote</i> al componente <i>CreateNew</i> en lugar de la función provisional.

#### 7.6: useAnecdotes, paso 3

Amplía el hook <i>useAnecdotes</i> con una función <i>deleteAnecdote</i> que elimine una anécdota del servidor y actualice el estado local. Añade un botón para eliminar junto a cada anécdota de la lista.

Además, refactoriza la aplicación para que ni los datos de las anécdotas ni las funciones del hook se pasen como props. En su lugar, los componentes que los necesiten deben llamar directamente a <i>useAnecdotes</i>. Esto significa que <i>App</i> ya no tiene que actuar como intermediario pasando datos y callbacks por el árbol de componentes.

Tras la refactorización, <i>App</i> debe tener este aspecto:

```js
const App = () => {
  return (
    <Router>
      <div>
        <h1>Software anecdotes</h1>
        <Menu />
        <Routes>
          <Route path="/" element={<AnecdoteList />} />
          <Route path="/create" element={<CreateNew />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}
```

</div>
