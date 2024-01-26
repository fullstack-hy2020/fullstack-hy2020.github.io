---
mainImage: ../../../images/part-2.svg
part: 2
letter: b
lang: es
---

<div class="content">

Continuemos expandiendo nuestra aplicación permitiendo a los usuarios agregar nuevas notas. Puedes encontrar el código de nuestra aplicación actual [aquí](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part2-1).

### Guardando las notas en el estado del componente

Para que nuestra página se actualice cuando se agregan nuevas notas, es mejor almacenar las notas en el estado del componente <i>App</i>. Importemos la función [useState](https://es.react.dev/reference/react/useState) y usémosla para definir una parte del estado que se inicializa con la matriz de notas inicial pasada en los props.

```js
import { useState } from 'react' // highlight-line
import Note from './components/Note'

const App = (props) => { // highlight-line
  const [notes, setNotes] = useState(props.notes) // highlight-line

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <Note key={note.id} note={note} />
        )}
      </ul>
    </div>
  )
}

export default App 
```

El componente usa la función <em>useState</em> para inicializar la parte de estado almacenada en <em>notes</em> con la matriz de notas pasadas en los props:

```js
const App = (props) => { 
  const [notes, setNotes] = useState(props.notes) 

  // ...
}
```

También podemos utilizar React Developer Tools para comprobar que esto realmente sucede:

![navegador mostrando la ventana de herramientas de desarrollo de React](../../images/2/30.png)

Si quisiéramos comenzar con una lista vacía de notas, estableceríamos el valor inicial como una matriz vacía, y dado que los props no se usarían, podríamos omitir el parámetro <em>props</em> de la definición de la función:

```js
const App = () => { 
  const [notes, setNotes] = useState([]) 

  // ...
}  
```

Sigamos con el valor inicial pasado en los props por el momento.

A continuación, agreguemos un [formulario](https://developer.mozilla.org/es/docs/Learn/Forms) HTML al componente que se utilizará para agregar nuevas notas.

```js
const App = (props) => {
  const [notes, setNotes] = useState(props.notes)

// highlight-start 
  const addNote = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
  }
  // highlight-end   

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <Note key={note.id} note={note} />
        )}
      </ul>
      // highlight-start 
      <form onSubmit={addNote}>
        <input />
        <button type="submit">save</button>
      </form>   
      // highlight-end   
    </div>
  )
}
```

Hemos agregado la función _addNote_ como un controlador de eventos al elemento del formulario que se llamará cuando se envíe el formulario, haciendo clic en el botón submit.

Usamos el método discutido en la [parte 1](/es/part1/estado_del_componente_controladores_de_eventos#manejo-de-eventos) para definir nuestro controlador de eventos:

```js
const addNote = (event) => {
  event.preventDefault()
  console.log('button clicked', event.target)
}
```

El parámetro <em>event</em> es el [evento](https://es.react.dev/learn/responding-to-events) que activa la llamada a la función del controlador de eventos:

El controlador de eventos llama inmediatamente al método <em>event.preventDefault()</em>, que evita la acción predeterminada de enviar un formulario. La acción predeterminada, [entre otras cosas](https://developer.mozilla.org/es/docs/Web/API/HTMLFormElement/submit_event), haría que la página se recargara.

El objetivo del evento almacenado en _event.target_ se registra en la consola:

![botón clickeado con objeto de formulario en la consola](../../images/2/6e.png)

El objetivo (target) en este caso es el formulario que hemos definido en nuestro componente.

¿Cómo accedemos a los datos contenidos en el elemento <i>input</i> del formulario?

### Componentes controlados

Hay muchas maneras de lograr esto; el primer método que veremos es mediante el uso de los llamados [componentes controlados](https://es.react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable).

Agreguemos un nuevo estado llamado <em>newNote</em> para almacenar la entrada enviada por el usuario **y** configurémoslo como el atributo <i>value</i> del elemento <i>input</i>:

```js
const App = (props) => {
  const [notes, setNotes] = useState(props.notes)
  // highlight-start
  const [newNote, setNewNote] = useState(
    'a new note...'
  ) 
  // highlight-end

  const addNote = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
  }

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <Note key={note.id} note={note} />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} /> //highlight-line
        <button type="submit">save</button>
      </form>   
    </div>
  )
}
```

El texto del placeholder almacenado como valor inicial del estado <em>newNote</em> aparece en el elemento <i>input</i>, pero el input no se puede editar. La consola muestra una advertencia que nos da una pista de lo que podría estar mal:

![error de consola al proporcionar un valor a la propiedad sin onchange](../../images/2/7e.png)

Dado que asignamos una parte del estado del componente <i>App</i> como el atributo <i>value</i> del elemento input, el componente <i>App</i> ahora [controla](https://es.react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable) el comportamiento del input.

Para habilitar la edición del input, tenemos que registrar un <i>controlador de eventos</i> que sincronice los cambios realizados en la entrada con el estado del componente:

```js
const App = (props) => {
  const [notes, setNotes] = useState(props.notes)
  const [newNote, setNewNote] = useState(
    'a new note...'
  ) 

  // ...

// highlight-start
  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }
// highlight-end

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <Note key={note.id} note={note} />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleNoteChange} // highlight-line
        />
        <button type="submit">save</button>
      </form>   
    </div>
  )
}
```

Ahora hemos registrado un controlador de eventos en el atributo <i>onChange</i> del elemento <i>input</i> del formulario:

```js
<input
  value={newNote}
  onChange={handleNoteChange}
/>
```

Se llama al controlador de eventos cada vez que <i>ocurre un cambio en el elemento input</i>. La función del controlador de eventos recibe el objeto de evento como su parámetro <em>event</em>:

```js
const handleNoteChange = (event) => {
  console.log(event.target.value)
  setNewNote(event.target.value)
}
```

La propiedad <em>target</em> del objeto de evento ahora corresponde al elemento <i>input</i> controlado y <em>event.target.value</em> se refiere al valor de entrada de ese elemento.

Ten en cuenta que no necesitamos llamar al método _event.preventDefault()_ como hicimos en el controlador de eventos <i>onSubmit</i>. Esto se debe a que no se produce una acción predeterminada en un cambio de input, a diferencia de lo que ocurre con el envío de un formulario.

Puedes ver en la consola cómo se llama al controlador de eventos:

![multiples llamados en la consola al escribir texto](../../images/2/8e.png)

Has recordado instalar [React devtools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi), ¿verdad? Bien. Puedes ver directamente cómo cambia el estado desde la pestaña React Devtools:!

![cambios en el estado al escribir texto en react devtools](../../images/2/9ea.png)

Ahora el estado del componente <em>newNote</em> de <i>App</i> refleja el valor actual del input, lo que significa que podemos completar la función <em>addNote</em> para crear nuevas notas:

```js
const addNote = (event) => {
  event.preventDefault()
  const noteObject = {
    content: newNote,
    important: Math.random() < 0.5,
    id: notes.length + 1,
  }

  setNotes(notes.concat(noteObject))
  setNewNote('')
}
```

Primero creamos un nuevo objeto para la nota llamado <em>noteObject</em> que recibirá su contenido del estado del componente <em>newNote</em>. El identificador único <i>id</i> se genera en función del número total de notas. Este método funciona para nuestra aplicación ya que las notas nunca se eliminan. Con la ayuda de la función <em>Math.random()</em>, nuestra nota tiene un 50% de posibilidades de ser marcada como importante.

La nueva nota se agrega a la lista de notas usando el método de matriz [concat](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/concat), introducido en la [parte 1](/es/part1/java_script#arrays):

```js
setNotes(notes.concat(noteObject))
```

El método no muta la matriz <em>notes</em> original, sino que crea <i>una nueva copia de la matriz con el nuevo elemento agregado al final</i>. Esto es importante ya que [nunca debemos mutar el estado directamente](https://es.react.dev/learn/updating-objects-in-state#why-is-mutating-state-not-recommended-in-react) en React!

El controlador de eventos también restablece el valor del elemento de entrada controlado llamando a la función <em>setNewNote</em> del estado de <em>newNote</em>:

```js
setNewNote('')
```

Puedes encontrar el código para nuestra aplicación actual en su totalidad en la rama <i>part2-2</i> de [este repositorio de GitHub](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part2-2).

### Filtrado de elementos mostrados

Agreguemos una nueva funcionalidad a nuestra aplicación que nos permita ver solo las notas importantes.

Agreguemos un fragmento de estado al componente <i>App</i> que realiza un seguimiento de las notas que deben mostrarse:

```js
const App = (props) => {
  const [notes, setNotes] = useState(props.notes) 
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true) // highlight-line
  
  // ...
}
```

Cambiemos el componente para que almacene una lista de todas las notas que se mostrarán en la variable <em>notesToShow</em>. Los elementos de la lista dependen del estado del componente:

```js
import React, { useState } from 'react'
import Note from './components/Note'

const App = (props) => {
  const [notes, setNotes] = useState(props.notes)
  const [newNote, setNewNote] = useState('') 
  const [showAll, setShowAll] = useState(true)

  // ...

// highlight-start
  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important === true)
// highlight-end

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notesToShow.map(note => // highlight-line
          <Note key={note.id} note={note} />
        )}
      </ul>
      // ...
    </div>
  )
}
```

La definición de la variable <em>notesToShow</em> es bastante compacta:

```js
const notesToShow = showAll
  ? notes
  : notes.filter(note => note.important === true)
```

La definición usa el operador [condicional](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) que también se encuentra en muchos otros lenguajes de programación.

El operador funciona de la siguiente manera. Si tenemos:

```js
const result = condition ? val1 : val2
```

la variable <em>result</em> se establecerá en el valor de <em>val1</em> si la <em>condición (condition)</em> es verdadera. Si la <em>condition</em> es falsa, la variable <em>result</em> se establecerá en el valor de <em>val2</em>.

Si el valor de <em>showAll</em> es falso, la variable <em>notesToShow</em> se asignará a una lista que solo contiene notas que tienen la propiedad <em>important</em> establecida en true. El filtrado se realiza con la ayuda del método de matriz [filter](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/filter):

```js
notes.filter(note => note.important === true)
```

El operador de comparación es de hecho redundante, ya que el valor de <em>note.important</em> es <i>true</i> o <i>false</i> lo que significa que simplemente podemos escribir:

```js
notes.filter(note => note.important)
```

La razón por la que mostramos el operador de comparación primero fue para enfatizar un detalle importante: en JavaScript <em>val1 == val2</em> no funciona como se esperaba en todas las situaciones y es más seguro utilizar <em>val1 === val2</em> exclusivamente en las comparaciones. Puedes leer más sobre el tema [aquí](https://developer.mozilla.org/es/docs/Web/JavaScript/Equality_comparisons_and_sameness).

Puedes probar la funcionalidad de filtrado cambiando el valor inicial del estado <em>showAll</em>.

A continuación, agreguemos una funcionalidad que permita a los usuarios alternar el estado <em>showAll</em> de la aplicación desde la interfaz de usuario.

Los cambios relevantes se muestran a continuación: 

```js
import React, { useState } from 'react'
import Note from './components/Note'

const App = (props) => {
  const [notes, setNotes] = useState(props.notes) 
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  // ...

  return (
    <div>
      <h1>Notes</h1>
// highlight-start
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>
// highlight-end
      <ul>
        {notesToShow.map(note =>
          <Note key={note.id} note={note} />
        )}
      </ul>
      // ...
    </div>
  )
}
```

Las notas mostradas (todas versus las importantes) se controlan con un botón. El controlador de eventos para el botón es tan simple que se ha definido directamente en el atributo del elemento del botón. El controlador de eventos cambia el valor de _showAll_ de verdadero a falso y viceversa:

```js
() => setShowAll(!showAll)
```

El texto del botón depende del valor del estado de <em>showAll</em>:

```js
show {showAll ? 'important' : 'all'}
```

Puedes encontrar el código para nuestra aplicación actual en su totalidad en la rama <i>part2-3</i> de [este repositorio de GitHub](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part2-3).
</div>

<div class="tasks">

<h3>Ejercicios 2.6.-2.10.</h3> 

En el primer ejercicio, comenzaremos a trabajar en una aplicación que se continuara desarrollando en los ejercicios posteriores. En conjuntos de ejercicios relacionados, es suficiente con presentar la versión final de tu aplicación. También puedes realizar un commit por separado después de haber terminado cada parte del conjunto de ejercicios, pero no es necesario hacerlo.

<h4>2.6: La Agenda Telefónica Paso 1</h4>

Creemos una agenda telefónica sencilla. <i>**En esta parte solo agregaremos nombres a la agenda.**</i>

Comencemos por implementar la adición de una persona a la agenda.

Puedes utilizar el siguiente código como punto de partida para el componente <i>App</i> de tu aplicación:

```js
import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')

  return (
    <div>
      <h2>Phonebook</h2>
      <form>
        <div>
          name: <input />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      ...
    </div>
  )
}

export default App
```

El estado de <em>newName</em> está destinado a controlar el elemento input del formulario.

A veces puede resultar útil representar el estado y otras variables como texto con fines de depuración. Puedes agregar temporalmente el siguiente elemento al componente renderizado:

```html
<div>debug: {newName}</div>
```

También es importante poner lo que aprendimos en el capítulo [depuración de aplicaciones React](/es/part1/un_estado_mas_complejo_depurando_aplicaciones_react) de la parte uno en buen uso. La extensión [React developer tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) especialmente, es increíblemente útil para rastrear los cambios que ocurren en el estado de la aplicación.

Después de terminar este ejercicio, su aplicación debería verse así:

![captura de pantalla de 2.6 finalizado](../../images/2/10e.png)

¡Ten en cuenta el uso de la extensión de herramientas de desarrollo React en la imagen de arriba!

**NB:**

- puedes utilizar el nombre de la persona como valor de la propiedad <i>key</i>
- ¡recuerda evitar la acción predeterminada de enviar formularios HTML!

<h4>2.7: La Agenda Telefónica Paso 2</h4>

Evita que el usuario pueda agregar nombres que ya existen en la agenda telefónica. Los arrays de JavaScript tienen numerosos [métodos](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array) adecuados  para realizar esta tarea.

Emite una advertencia con el comando [alert](https://developer.mozilla.org/es/docs/Web/API/Window/alert) cuando se intente realizar una acción de este tipo:

![alerta del navegador: "usuario ya existe en la agenda telefónica"](../../images/2/11e.png)

**Sugerencia:** cuando estés formando cadenas que contienen valores de variables, se recomienda utilizar una [plantilla de cadena](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Template_literals):

```js
`${newName} is already added to phonebook`
```

Si la variable <em>newName</em> tiene el valor <i>Arto Hellas</i>, la expresión de la plantilla de cadena regresa la cadena

```js
`Arto Hellas is already added to phonebook`
```

Lo mismo se podría hacer en una forma más similar a Java usando el operador de sumar:

```js
newName + ' is already added to phonebook'
```

Usar plantillas de cadenas es la opción más idiomática y el signo de un verdadero profesional de JavaScript.

<h4>2.8: La Agenda Telefónica Paso 3</h4>

Amplía tu aplicación permitiendo a los usuarios agregar números de teléfono a la agenda telefónica. Deberás agregar un segundo elemento <i>input</i> al formulario (junto con su propio controlador de eventos):

```js
<form>
  <div>name: <input /></div>
  <div>number: <input /></div>
  <div><button type="submit">add</button></div>
</form>
```

En este punto, la aplicación podría verse así. La imagen también muestra el estado de la aplicación con la ayuda de [React developer tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi):

![2.8 captura de pantalla de muestra](../../images/2/12e.png)

<h4>2.9*: La Agenda Telefónica Paso 4</h4>

Implemente¡a un campo de búsqueda que pueda usarse para filtrar la lista de personas por nombre:

![2.9 campo de busqueda](../../images/2/13e.png)

Puedes implementar el campo de búsqueda como un elemento <i>input</i> que se coloca fuera del formulario HTML. La lógica de filtrado que se muestra en la imagen <i>no distingue entre mayúsculas y minúsculas</i>, lo que significa que el término de búsqueda <i>arto</i> también devuelve resultados que contienen Arto con una A mayúscula.

**NB:** Cuando trabajes en una nueva funcionalidad, a menudo es útil "codificar" algunos datos ficticios en tu aplicación, por ejemplo

```js
const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])

  // ...
}
```

Esto evita tener que ingresar datos manualmente en tu aplicación para probar tu nueva funcionalidad.

<h4>2.10: La Agenda Telefónica Paso 5</h4>

Si has implementado tu aplicación en un solo componente, refactoriza extrayendo las partes adecuadas en nuevos componentes. Mantén el estado de la aplicación y todos los controladores de eventos en el componente raíz de <i>App</i>.

Es suficiente extraer <i>**tres**</i> componentes de la aplicación. Buenos candidatos para componentes separados son, por ejemplo, el filtro de búsqueda, el formulario para agregar nuevas personas a la agenda telefónica, un componente que muestra a todas las personas de la agenda telefónica y un componente que muestra los detalles de una sola persona.

El componente raíz de la aplicación podría verse similar a esto después de la refactorización. El componente raíz refactorizado a continuación solo representa los títulos y permite que los componentes extraídos se encarguen del resto.

```js
const App = () => {
  // ...

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter ... />

      <h3>Add a new</h3>

      <PersonForm 
        ...
      />

      <h3>Numbers</h3>

      <Persons ... />
    </div>
  )
}
```

**NB**: Es posible que tengas problemas en este ejercicio si defines tus componentes "en el lugar equivocado". Ahora sería un buen momento para recordar el capítulo [no definir componentes dentro de los componentes](/es/part1/un_estado_mas_complejo_depurando_aplicaciones_react#no-definir-componentes-dentro-de-los-componentes) de la última parte.

</div>
