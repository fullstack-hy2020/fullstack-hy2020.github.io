---
mainImage: ../../../images/part-7.svg
part: 7
letter: b
lang: es
---

<div class="content">


Los ejercicios de esta parte son un poco diferentes a los ejercicios de las partes anteriores. Los ejercicios de la parte anterior y los ejercicios de esta parte [tratan sobre la teoría presentada en esta parte](/es/part7/custom_hooks#exercises-7-4-7-8).


Esta parte también contiene una [serie de ejercicios](/es/part7/exercises_extending_the_bloglist) en los que modificamos la aplicación Bloglist de las partes 4 y 5 para ensayar y aplicar las habilidades que hemos aprendido.

### Hooks

React ofrece 10 [hooks incorporados](https://reactjs.org/docs/hooks-reference.html) diferentes, de los cuales los más populares son los hooks [useState](https://reactjs.org/docs/hooks-reference.html#usestate) y [useEffect](https://reactjs.org/docs/hooks-reference.html#useeffect), que ya hemos estado usando ampliamente.

En la [parte 5](/es/part5/props_children_and_proptypes#references-to-components-with-ref) usamos el hhok [useImperativeHandle](https://reactjs.org/docs/hooks-reference.html#useimperativehandle) que permite que los componentes proporcionen sus funciones a otros componentes.

Durante el último año, muchas librerías React han comenzado a ofrecer apis basadas en hooks. En la [parte 6](/es/part6/flux_architecture_and_redux) usamos los hooks [useSelector](https://react-redux.js.org/api/hooks#useselector) y [useDispatch](https://react-redux.js.org/api/hooks#usedispatch) de la librería react-redux para compartir nuestra función redux-store y dispatch a nuestros componentes. La api basada en hooks de Redux es mucho más fácil de usar que la más antigua, aún disponible, [connect](/es/part6/connect) -api.

La api de [React-router](https://reacttraining.com/react-router/web/guides) que presentamos en la [parte anterior](/es/part7/react_router) también se basa parcialmente en [hooks](https://reacttraining.com/react-router/web/api/Hooks). Sus hooks se pueden usar para acceder a los parámetros de la URL y al objeto history, lo que permite manipular la URL del navegador mediante programación.

Como se mencionó en la [parte 1](/es/part1/a_more_complex_state_debugging_react_apps#rules-of-hooks), los hooks no son funciones normales y cuando los usamos tenemos que cumplir con ciertas [reglas o limitaciones](https://reactjs.org/docs/hooks-rules.html). Recapitulemos las reglas del uso de hooks, copiadas literalmente de la documentación oficial de React:

**No llame a Hooks dentro de bucles, condiciones o funciones anidadas.** En su lugar, utilice siempre Hooks en el nivel superior de su función React. 

**No llame a Hooks desde funciones regulares de JavaScript.** En su lugar, puede:

- Llame a Hooks desde los componentes funcionales de React.
- Llamar a Hooks desde Hooks personalizados

Existe una regla de [ESlint](https://www.npmjs.com/package/eslint-plugin-react-hooks) que se puede usar para verificar que la aplicación usa los hooks correctamente.

Create-react-app ha configurado fácilmente la regla [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks) que se queja si los hooks se utilizan de manera ilegal:

![](../../images/7/60ea.png)

### Hooks personalizados

React ofrece la opción de crear nuestros propios hooks [personalizados](https://reactjs.org/docs/hooks-custom.html). Según React, el propósito principal de los hooks personalizados es facilitar la reutilización de la lógica utilizada en los componentes.

> <i>Crear sus propios Hooks le permite extraer la lógica de los componentes en funciones reutilizables.</i>

Los hooks personalizados son funciones regulares de JavaScript que pueden utilizar cualquier otro hook, siempre que se adhieran a las [reglas de los hooks](/es/part1/a_more_complex_state_debugging_react_apps#rules-of-hooks). Además, el nombre de los hooks personalizados debe comenzar con la palabra _use_.

Implementamos una aplicación de contador en la [parte 1](/es/part1/component_state_event_handlers#event-handling), que puede tener su valor incrementado, decrementado o reiniciado. El código de la aplicación es el siguiente:

```js  
import React, { useState } from 'react'
const App = (props) => {
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


Los componentes de React pueden usar el hook como se muestra a continuación:

```js
const App = (props) => {
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


Al hacer esto, podemos extraer el estado del componente _App_ y su manipulación por completo en el hook _useCounter_ . La gestión del estado y la lógica del contador ahora es responsabilidad del hook personalizado.

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

La aplicación crea <i>dos</i> contadores completamente separados. El primero se asigna a la variable _left_ y el otro a la variable _right_.


Tratar con formularios en React es algo complicado. La siguiente aplicación presenta al usuario un formulario que solicita al usuario que ingrese su nombre, fecha de nacimiento y altura:

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


Cada campo del formulario tiene su propio estado. Para mantener el estado del formulario sincronizado con los datos proporcionados por el usuario, tenemos que registrar un controlador <i>onChange</i> apropiado para cada uno de los elementos <i>input</i>.


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


La función de hook recibe el tipo de campo de entrada como parámetro. La función devuelve todos los atributos requeridos por el <i>input</i>: su tipo, valor y el controlador onChange.


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
    </div>
  )
}
```


### Atributos de propagación

Podríamos simplificar un poco más las cosas. Dado que el objeto _name_ tiene exactamente todos los atributos que el elemento <i>input</i> espera recibir como props, podemos pasar los props al elemento usando la [sintaxis de propagación](https://reactjs.org/docs/jsx-in-depth.html#spread-attributes)(spread syntax) de la siguiente manera:

```js
<input {...name} /> 
```


Como indica el [ejemplo](https://reactjs.org/docs/jsx-in-depth.html#spread-attributes)  en la documentación de React, las siguientes dos formas de pasar props a un componente logran exactamente el mismo resultado:

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


Claramente, los hooks personalizados no son solo una herramienta para reutilizar, sino que también brindan una mejor manera de dividir nuestro código en partes modulares más pequeñas.

### Más sobre hooks

Internet está comenzando a llenarse con más y más material útil relacionado con los hooks. Vale la pena consultar las siguientes fuentes:

* [Awesome React Hooks Resources](https://github.com/rehooks/awesome-react-hooks)
* [Easy to understand React Hook recipes by Gabe Ragland](https://usehooks.com/)
* [Why Do React Hooks Rely on Call Order?](https://overreacted.io/why-do-hooks-rely-on-call-order/)

</div>

<div class="tasks">


### Ejercicios 7.4.-7.8.

Continuaremos con la aplicación de los [ejercicios](/es/part7/react_router#exercises-7-1-7-3) del capítulo [react router](/es/part7/react_router).

#### 7.4: anécdotas y hooks paso 1

Simplifique la forma de creación de anécdotas de su aplicación con el hook personalizado _useField_ que definimos anteriormente.

Un lugar natural para guardar los hooks personalizados de su aplicación es el archivo <i>/src/hooks/index.js</i>.


Si usa la [exportación nombrada](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export#Description) en lugar de la exportación predeterminada:

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


Luego, la [importación](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) ocurre de la siguiente manera:

```js
import  { useField } from './hooks'

const App = () => {
  // ...
  const username = useField('text')
  // ...
}
```


#### 7.5: anécdotas y hooks paso 2

Agregue un botón al formulario que puede usar para borrar todos los campos de entrada:

![](../../images/7/61ea.png)

Amplíe la funcionalidad del hook <i>useField</i> para que ofrezca una nueva operación <i>reset</i> para limpiar el campo.

Dependiendo de su solución, es posible que vea la siguiente advertencia en su consola:

![](../../images/7/62ea.png)

Volveremos a esta advertencia en el próximo ejercicio.

#### 7.6: anécdotas y hooks paso 3

Si su solución no provocó que apareciera una advertencia en la consola, ya ha terminado este ejercicio.

Si ve la advertencia en la consola, realice los cambios necesarios para deshacerse de la advertencia en la consola _Invalid value for prop \`reset\` on \<input\> tag_.

El motivo de esta advertencia es que después de realizar los cambios en su aplicación, aparece la siguiente expresión:

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


El elemento <i>input</i> no debe recibir un atributo de <i>reset</i>.


Una solución simple sería no usar la sintaxis de propagación y escribir todos los formularios de esta manera:

```js
<input
  value={username.value} 
  type={username.type}
  onChange={username.onChange}
/>
```


Si hiciéramos esto, perderíamos gran parte del beneficio proporcionado por el hook <i>useField</i>. En su lugar, busque una solución que solucione el problema, pero que aún sea fácil de usar con la sintaxis de propagación.

### 7.7: hook de campo

Let's return to the exercises [2.12-14](/es/part2/getting_data_from_server#exercises-2-11-2-14).
Volvamos a los ejercicios [2.12-14].

Utilice el código de https://github.com/fullstack-hy2020/country-hook como punto de partida.

La aplicación se puede utilizar para buscar detalles de países desde la interfaz https://restcountries.eu/. Si se encuentra el país, se muestran los detalles del país

![](../../images/7/69ea.png)

Si no se encuentra el país, se muestra un mensaje al usuario

![](../../images/7/70ea.png)

Por lo demás, la aplicación está completa, pero en este ejercicio debe implementar un hook personalizado _useCountry_, que se puede usar para buscar los detalles del país dado al hook como parámetro.

Use el endpoint [full name](https://restcountries.eu/#api-endpoints-full-name) de la api  para obtener los detalles del país en un hook _useEffect_ dentro de su hook personalizado.

Tenga en cuenta que en este ejercicio es esencial utilizar el [segundo parámetro](https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect) de useEffect para controlar cuándo se ejecuta la función de efecto.

### 7.8: hooks definitivos

El código de la aplicación responsable de comunicarse con el backend de la aplicación de notas de las partes anteriores se ve así:

```js
import axios from 'axios'
const baseUrl = '/api/notes'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = (id, newObject) => {
  const request = axios.put(`${ baseUrl } /${id}`, newObject)
  return request.then(response => response.data)
}

export default { getAll, create, update, setToken }
```

Notamos que el código no es específico del hecho de que nuestra aplicación se ocupa de notas. Excluyendo el valor de la variable _baseUrl_, el mismo código podría reutilizarse en la aplicación de publicación de blog para tratar la comunicación con el backend.

Extraiga el código para comunicarse con el backend en su propio hook _useResource_. Es suficiente implementar la búsqueda de todos los recursos y la creación de un nuevo recurso.

Puede hacer el ejercicio para el proyecto que se encuentra en el repositorio https://github.com/fullstack-hy2020/ultimate-hooks. El componente <i>App</i> para el proyecto es el siguiente:

```js
const App = () => {
  const content = useField('text')
  const name = useField('text')
  const number = useField('text')

  const [notes, noteService] = useResource('http://localhost:3005/notes')
  const [persons, personService] = useResource('http://localhost:3005/persons')

  const handleNoteSubmit = (event) => {
    event.preventDefault()
    noteService.create({ content: content.value })
  }
 
  const handlePersonSubmit = (event) => {
    event.preventDefault()
    personService.create({ name: name.value, number: number.value})
  }

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...content} />
        <button>create</button>
      </form>
      {notes.map(n => <p key={n.id}>{n.content}</p>)}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...name} /> <br/>
        number <input {...number} />
        <button>create</button>
      </form>
      {persons.map(n => <p key={n.id}>{n.name} {n.number}</p>)}
    </div>
  )
}
```

El hook personalizado _useResource_ devuelve un array de dos elementos al igual que los hooks de estado. El primer elemento del array contiene todos los recursos individuales y el segundo elemento del array es un objeto que se puede usar para manipular la colección de recursos, como crear nuevos.

Si implementa el hook correctamente, se puede usar tanto para notas como para números de teléfono (inicie el servidor con el comando _npm run server_ en el puerto 3005).

![](../../images/5/21e.png)

</div>
