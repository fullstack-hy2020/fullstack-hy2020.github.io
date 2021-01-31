---
mainImage: ../../../images/part-2.svg
part: 2
letter: a
lang: en
---

<div class="content">

Antes de comenzar una nueva parte, recapitulemos algunos de los temas que resultaron difíciles el año pasado.

### console.log

***¿Cuál es la diferencia entre un programador de JavaScript experimentado y un novato? El experimentado usa console.log de 10 a 100 veces más.***

Paradójicamente, esto parece ser cierto aunque un programador novato necesitaría console.log (o cualquier método de depuración) más que uno experimentado.

Cuando algo no funciona, no adivine qué está mal. En su lugar, use la consola o utilice alguna otra forma de depuración.

**NB** Como se explicó en la parte 1, cuando use el comando _console.log_ para depurar, no concatene cosas 'al estilo Java' con un plus. En lugar de escribir:

```js
console.log('props value is' + props)
```

separa las cosas que se van a imprimir con una coma:

```js
console.log('props value is', props)
```

Si concatenas un objeto con una cadena y lo registras en la consola (como en nuestro primer ejemplo), el resultado será bastante inútil:

```js
props value is [Object object]
```

Por el contrario, cuando pasa objetos como argumentos distintos separados por comas a _console.log_, como en nuestro segundo ejemplo anterior, el contenido del objeto se imprime en la consola del desarrollador como cadenas que son reveladoras.
Si es necesario, lea más sobre la depuración de aplicaciones React [aquí](/es/part1/depurando-un-estado-mas-complejo-en-react#depuración-de-aplicaciones-React).

### Protip: fragmentos de código de Visual Studio

Con Visual Studio Code es fácil crear 'snippets', es decir, accesos directos para generar rápidamente porciones de código que se reutilizan habitualmente, muy parecido a cómo funciona 'sout' en Netbeans.
Las instrucciones para crear snippets se pueden encontrar [aquí](https://code.visualstudio.com/docs/editor/userdefinedsnippets#_creating-your-own-snippets).

También se pueden encontrar snippets útiles y listos para usar como complementos de VS Code, por ejemplo, [aquí](https://marketplace.visualstudio.com/items?itemName=xabikos.ReactSnippets).

El snippet más importante es el del comando <em>console.log()</em>, por ejemplo <em>clog</em>. Esto se puede crear así:

```js
{
  "console.log": {
    "prefix": "clog",
    "body": [
      "console.log('$1')",
    ],
    "description": "Log output to console"
  }
}
```

Depurar tu código usando _console.log()_ es tan común que Visual Studio Code tiene ese fragmento integrado. Para usarlo, escribe _log_ y presiona tabulador para autocompletar.

### Matrices JavaScript

De aquí en adelante, usaremos los métodos de programación funcional de JavaScript [array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) -como _find_ , _filter_ y _map_-, todo el tiempo. Operan con los mismos principios generales que los streams en Java 8, que se han utilizado durante los últimos años en los cursos 'Ohjelmoinnin perusteet' y 'Ohjelmoinnin jatkokurssi' en el departamento de informática de la universidad, y también en el MOOC de programación.

Si la programación funcional con matrices le parece ajena, vale la pena ver al menos las tres primeras partes de la serie de videos de YouTube [Programación funcional en JavaScript](https://www.youtube.com/playlist?list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84):

- [Higher-order functions](https://www.youtube.com/watch?v=BMUiFMZr7vk&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84) 
- [Map](https://www.youtube.com/watch?v=bCqtb-Z5YGQ&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84&index=2) 
- [Reduce basics](https://www.youtube.com/watch?v=Wl98eZpkp-c&t=31s) 

### Controladores de eventos revisados 

Según el curso del año pasado, el manejo de eventos ha demostrado ser ser dificil.
Vale la pena leer el capítulo de revisión al final de la parte anterior [revisión de los controladores de eventos](es/part1/depurando-un-estado-mas-complejo-en-react#manejo-de-eventos-revisitado), si cree que su propio conocimiento sobre el tema necesita algo de mejora.

Pasar controladores de eventos a los componentes secundarios del componente <i>App</i> ha planteado algunas preguntas. Se puede encontrar una pequeña revisión sobre el tema [aquí](es/part1/depurando-un-estado-mas-complejo-en-react#pasar-controladores-de-eventos-a-elementos-secundarios).

### Renderizando colecciones

Ahora haremos el 'frontend', o la lógica de la aplicación del lado del navegador, en React para una aplicación que es similar a la aplicación de ejemplo de la [parte 0](/es/part0)

Comencemos con lo siguiente:

```js
import React from 'react'
import ReactDOM from 'react-dom'

const notes = [
  {
    id: 1,
    content: 'HTML is easy',
    date: '2019-05-30T17:30:31.098Z',
    important: true
  },
  {
    id: 2,
    content: 'Browser can execute only JavaScript',
    date: '2019-05-30T18:39:34.091Z',
    important: false
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    date: '2019-05-30T19:20:14.298Z',
    important: true
  }
]

const App = (props) => {
  const { notes } = props

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        <li>{notes[0].content}</li>
        <li>{notes[1].content}</li>
        <li>{notes[2].content}</li>
      </ul>
    </div>
  )
}

ReactDOM.render(
  <App notes={notes} />,
  document.getElementById('root')
)
```

Cada nota contiene su contenido textual y una marca de tiempo, así como un valor _booleano_ para marcar si la nota ha sido categorizada como importante o no, y también un <i>id</i> único.

El ejemplo anterior funciona debido al hecho de que hay exactamente tres notas en la matriz.
Se representa una sola nota al acceder a los objetos de la matriz haciendo referencia a un número de índice codificado:

```js
<li>{notes[1].content}</li>
```

Esto, por supuesto, no es práctico. Podemos mejorar esto generando elementos React a partir de los objetos de la matriz usando la función [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map).

```js
notes.map(note => <li>{note.content}</li>)
```

El resultado es una matriz de elementos <i>li</i>.

```js
[
  <li>HTML is easy</li>,
  <li>Browser can execute only JavaScript</li>,
  <li>GET and POST are the most important methods of HTTP protocol</li>,
]
```

Que luego se puede colocar dentro de las etiquetas <i>ul</i>:

```js
const App = (props) => {
  const { notes } = props

  return (
    <div>
      <h1>Notes</h1>
// highlight-start
      <ul>
        {notes.map(note => <li>{note.content}</li>)}
      </ul>
// highlight-end
    </div>
  )
}
```

Debido a que el código que genera las etiquetas <i>li</i> es JavaScript, debe incluirse entre llaves en una plantilla JSX al igual que todos los demás códigos JavaScript.

<!-- Parannetaan koodin luetteloa vielä jakamalla nuolifunktion määrittely useammalle riville: -->
También haremos que el código sea más legible separando la declaración de la función de flecha en varias líneas:

```js
const App = (props) => {
  const { notes } = props

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
        // highlight-start
          <li>
            {note.content}
          </li>
        // highlight-end   
        )}
      </ul>
    </div>
  )
}
```

### Atributo key

Aunque la aplicación parece estar funcionando, hay una advertencia desagradable en la consola 

![](../../images/2/1a.png)

Como la [página](https://reactjs.org/docs/lists-and-keys.html#keys) vinculada en el mensaje de error instruye, los elementos de la lista, es decir, los elementos generados por el método _map_, deben tener cada uno una clave única valor: un atributo llamado <i>key</i>.

Agreguemos las keys (claves):

```js
const App = (props) => {
  const { notes } = props

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
        // highlight-start
          <li key={note.id}>
            {note.content}
          </li>
          // highlight-end
        )}
      </ul>
    </div>
  )
}
```

Y el mensaje de error desaparece.

React utiliza los atributos key de los objetos en una matriz para determinar cómo actualizar la vista generada por un componente cuando el componente se vuelve a renderizar. Más sobre esto [aquí](https://reactjs.org/docs/reconciliation.html#recursing-on-children).

### Map

Comprender cómo funciona el método de matriz [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) es crucial para el resto del curso .

La aplicación contiene una matriz llamada _notes_:

```js
const notes = [
  {
    id: 1,
    content: 'HTML is easy',
    date: '2019-05-30T17:30:31.098Z',
    important: true
  },
  {
    id: 2,
    content: 'Browser can execute only JavaScript',
    date: '2019-05-30T18:39:34.091Z',
    important: false
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    date: '2019-05-30T19:20:14.298Z',
    important: true
  }
]
```

Hagamos una pausa por un momento y examinemos cómo funciona _map_.

Si se agrega el siguiente código, digamos, al final del archivo:

```js
const result = notes.map(note => note.id)
console.log(result)
```

<i>[1, 2, 3]</i> se imprimirá en la consola.
_map_ siempre crea una nueva matriz, cuyos elementos se han creado a partir de los elementos de la matriz original mediante <i>mapeo</i>: utilizando la función dada como parámetro al método _map_.

La función es 

```js
note => note.id
```

que es una función de flecha escrita en forma compacta. La forma completa sería:

```js
(note) => {
  return note.id
}
```

La función obtiene un objeto de nota como parámetro, y <i>devuelve</i> el valor de su campo <i>id</i>.

Cambiar el comando a: 

```js
const result = notes.map(note => note.content)
```

da como resultado una matriz que contiene el contenido de las notas. 

Esto ya está bastante cerca del código de React que usamos:

```js
notes.map(note =>
  <li key={note.id}>{note.content}</li>
)
```

que genera una etiqueta <i>li</i> que contiene el contenido de la nota de cada objeto de nota.

Porque el parámetro de función pasado al método _map_ -

```js
note => <li key={note.id}>{note.content}</li>
```

&nbsp; - se utiliza para crear elementos de vista, el valor de la variable debe representarse dentro de llaves. Trate de ver qué sucede si se quitan las llaves.

El uso de llaves te causará dolor de cabeza al principio, pero pronto te acostumbrarás. La respuesta visual de React es inmediata.

### Anti-patrón: índices de matriz como claves

Podríamos haber hecho desaparecer el mensaje de error en nuestra consola usando los índices de matriz como claves. Los índices se pueden recuperar pasando un segundo parámetro a la función de devolución de llamada del método map:

```js
notes.map((note, i) => ...)
```

Cuando se llama así, a _i_ se le asigna el valor del índice de la posición en la matriz donde reside la nota.

Como tal, una forma de definir la generación de filas sin obtener errores es: 

```js
<ul>
  {notes.map((note, i) => 
    <li key={i}>
      {note.content}
    </li>
  )}
</ul>
```

Sin embargo, **no se recomienda** y puede causar problemas no deseados incluso si parece estar funcionando bien.
Lea más sobre esto [aquí](https://medium.com/@robinpokorny/index-as-a-key-is-an-anti-pattern-e0349aece318).

### Refactorizando módulos

Ordenemos un poco el código. Solo estamos interesados ​​en el campo _notes_ de los props, así que recuperemos eso directamente usando [desestructuración](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment):

```js
const App = ({ notes }) => { //highlight-line
  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <li key={note.id}>
            {note.content}
          </li>
        )}
      </ul>
    </div>
  )
}
```

Si ha olvidado lo que significa la desestructuración y cómo funciona, revise [esto](/es/part1/manejadores-de-eventos-de-componentes#desestructuración).


Separamos la visualización de una sola nota en su propio componente <i>Note</i>:

```js
// highlight-start
const Note = ({ note }) => {
  return (
    <li>{note.content}</li>
  )
}
// highlight-end

const App = ({ notes }) => {
  return (
    <div>
      <h1>Notes</h1>
      <ul>
        // highlight-start
        {notes.map(note => 
          <Note key={note.id} note={note} />
        )}
         // highlight-end
      </ul>
    </div>
  )
}
```

Tenga en cuenta que el atributo <i>key</i> ahora debe definirse para los componentes <i>Note</i>, y no para las etiquetas <i>li</i> como antes.

Se puede escribir una aplicación React completa en un solo archivo. Aunque eso, por supuesto, no es muy práctico. La práctica común es declarar cada componente en su propio archivo como un <i>módulo ES6</i>.

Hemos estado usando módulos todo el tiempo. Las primeras líneas del archivo: 

```js
import React from 'react'
import ReactDOM from 'react-dom'
```

[importan](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) dos módulos, lo que les permite ser utilizados en ese archivo. El módulo <i>React</i> se coloca en una variable llamada _React_ y <i>React-DOM</i> en la variable _ReactDOM_.


Muevamos nuestro componente <i>Note</i> a su propio módulo.

En aplicaciones más pequeñas, los componentes generalmente se colocan en un directorio llamado <i>components</i>, que a su vez se ubica dentro del directorio <i>src</i>. La convención es nombrar el archivo después del componente.

Ahora crearemos un directorio llamado <i>components</i> para nuestra aplicación y colocaremos un archivo llamado <i>Note.js</i> dentro.
El contenido del archivo Note.js es el siguiente:

```js
import React from 'react'

const Note = ({ note }) => {
  return (
    <li>{note.content}</li>
  )
}

export default Note
```

Importamos React en la primera línea del módulo.

La última línea del módulo [exporta](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) el módulo declarado, la variable <i>Note</i>.

Toma en cuenta que en versiones recientes de React ya no es necesario importar React para usar sintaxis JSX, sin embargo sigue siendo importante conocer su uso, ya que hay miles de millones de líneas de código antiguo de React que aún necesitan importar React. Lo mismo se aplica a la documentación y los ejemplos de React con los que puede tropezar en Internet.

Si necesitamos importar React para usar Hooks y otras funciones exportadas que React provee. Lea más sobre esto [aquí](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html).

Ahora el archivo que está usando el componente - <i>index.js</i> - puede [importar](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import ) el módulo:

```js
import React from 'react'
import ReactDOM from 'react-dom'
import Note from './components/Note' // highlight-line

const App = ({ notes }) => {
  // ...
}
```

El componente exportado por el módulo ahora está disponible para su uso en la variable <i>Note</i>, al igual que antes.

Tenga en cuenta que al importar nuestros propios componentes, se debe dar su ubicación <i>en relación con el archivo de importación</i>:

```js
'./components/Note'
```

El punto - <i>.</i> - al principio se refiere al directorio actual, por lo que la ubicación del módulo es un archivo llamado <i>Note.js</i> en el subdirectorio <i>components</i> del directorio actual. La extensión del nombre de archivo - _.js_ - se puede omitir.

<i>App</i> también es un componente, así que vamos a declararlo también en su propio módulo. Dado que es el componente raíz de la aplicación, lo colocaremos en el directorio <i>src</i>. El contenido del archivo es el siguiente:

```js
import React from 'react'
import Note from './components/Note'

const App = ({ notes }) => {
  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map((note) => 
          <Note key={note.id} note={note} />
        )}
      </ul>
    </div>
  )
}

export default App // highlight-line
```

What's left in the <i>index.js</i> file is: 

```js
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'  // highlight-line

const notes = [
  // ...
]

ReactDOM.render(
  <App notes={notes} />,
  document.getElementById('root')
)
```

Los módulos tienen muchos otros usos además de permitir que las declaraciones de componentes se separen en sus propios archivos. Nos pondremos en contacto con ellos más adelante en este curso.


El código actual de la aplicación se puede encontrar en [GitHub](https://github.com/fullstack-hy2020/part2-notes/tree/part2-1).


Tenga en cuenta que la rama <i>master</i> del repositorio contiene el código para una versión posterior de la aplicación. El código actual está en la rama [part2-1](https://github.com/fullstack-hy2020/part2-notes/tree/part2-1):

![](../../images/2/2e.png)

Si clona el proyecto, ejecute el comando _npm install_ antes de iniciar la aplicación con _npm start_.

### Cuando la aplicación se rompe

Al principio de tu carrera como programador (e incluso después de 30 años de codificación como la tuya), lo que sucede a menudo es que la aplicación simplemente se descompone por completo. Este es aún más el caso de los lenguajes tipados dinámicamente, como JavaScript, donde el compilador no verifica el tipo de datos de, por ejemplo, variables de función o valores de retorno.


Una "explosión de React" puede, por ejemplo, verse así:

![](../../images/2/3b.png)


En estas situaciones, la mejor salida es <em>console.log</em>.
El fragmento de código que causa la explosión es este: 

```js
const Course = ({ course }) => (
  <div>
    <Header course={course} />
  </div>
)

const App = () => {
  const course = {
    // ...
  }

  return (
    <div>
      <Course course={course} />
    </div>
  )
}
```


Nos centraremos en el motivo del desglose agregando comandos <em>console.log</em> al código. Como lo primero que se renderiza es el componente <i>App</i>, Vale la pena poner el primer <em>console.log</em> allí:

```js
const App = () => {
  const course = {
    // ...
  }

  console.log('App works...') // highlight-line

  return (
    // ..
  )
}
```

Para ver la impresión en la consola, debemos desplazarnos hacia arriba sobre la larga pared roja de errores. 

![](../../images/2/4b.png)

Cuando se descubre que algo funciona, es hora de profundizar más. Si el componente se ha declarado como una sola declaración o una función sin retorno, hace que la impresión en la consola sea más difícil.

```js
const Course = ({ course }) => (
  <div>
    <Header course={course} />
  </div>
)
```

El componente debe cambiarse a su forma más larga para que agreguemos la impresión: 

```js
const Course = ({ course }) => { 
  console.log(course) // highlight-line
  return (
    <div>
      <Header course={course} />
    </div>
  )
}
```

Muy a menudo, la raíz del problema es que se espera que los props sean de un tipo diferente, o que se llamen con un nombre diferente al que realmente son, y la desestructuración falla como resultado. El problema a menudo comienza a resolverse por sí mismo cuando se elimina la desestructuración y vemos lo que realmente contienen los <em>props</em>.

```js
const Course = (props) => { // highlight-line
  console.log(props)  // highlight-line
  const { course } = props
  return (
    <div>
      <Header course={course} />
    </div>
  )
}
```

Si el problema aún no se ha resuelto, realmente no hay mucho que hacer aparte de continuar la búsqueda de errores esparciendo más declaraciones _console.log_ alrededor de su código.

Agregué este capítulo al material después de que la respuesta del modelo para la siguiente pregunta explotara por completo (debido a que los props eran del tipo incorrecto), y tuve que depurarlo usando <em>console.log</em>.


</div>

<div clas ="tasks">

<h3>Ejercicios 2.1.-2.5.</h3>

Los ejercicios se envían a través de GitHub y marcando los ejercicios como realizados en el [sistema de envío](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

Puede enviar todos los ejercicios al mismo repositorio o utilizar varios repositorios diferentes. Si envía ejercicios de diferentes partes al mismo repositorio, nombre bien sus directorios.

Los ejercicios se envían **una parte a la vez**. Cuando haya enviado los ejercicios de una parte, ya no podrá enviar los ejercicios perdidos de esa parte.

Tenga en cuenta que esta parte tiene más ejercicios que los anteriores, por lo que <i>no envíe</i> antes de haber realizado todos los ejercicios de esta parte que desea enviar.

**ADVERTENCIA** create-react-app convierte el proyecto automáticamente en un repositorio git, si el proyecto no se crea dentro de un repositorio ya existente. Probablemente **no** desea que el proyecto se convierta en un repositorio, así que ejecute el comando _rm -rf .git_ desde su raíz.

<h4>2.1: Información del curso paso6</h4>


Terminemos el código para renderizar los contenidos del curso de los ejercicios 1.1 - 1.5. Puede comenzar con el código de las respuestas del modelo. Las respuestas modelo para la parte 1 se pueden encontrar yendo al [sistema de presentación](https://studies.cs.helsinki.fi/stats/courses/fullstackopen), haga clic en <i>my submissions</i> en el arriba, y en la fila correspondiente a la parte 1 debajo de la columna <i>solutions</i> haga clic en <i>show</i>. Para ver la solución al ejercicio de <i>información del curso</i>, haga clic en _index.js_ debajo de <i>kurssitiedot</i> ("kurssitiedot" significa "información del curso").


**Tenga en cuenta que si copia un proyecto de un lugar a otro, es posible que deba eliminar el directorio <i>node_modules</i> e instalar las dependencias nuevamente con el comando _npm install_ antes de que pueda iniciar la aplicación.**
Por lo general, no se recomienda que copie todo el contenido de un proyecto y/o agregue el directorio <i>node_modules</i> al sistema de control de versiones.

Cambiemos el componente <i>App</i> así:

```js
const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ]
  }

  return <Course course={course} />
}
```

Defina un componente responsable de formatear un solo curso llamado <i>Course</i>.

La estructura de componentes de la aplicación puede ser, por ejemplo, la siguiente:

<pre>
App
  Course
    Header
    Content
      Part
      Part
      ...
</pre>

Por lo tanto, el componente <i>Course</i> contiene los componentes definidos en la parte anterior, que son responsables de representar el nombre del curso y sus partes.

La página renderizada puede, por ejemplo, tener el siguiente aspecto:

![](../../images/teht/8e.png)

Todavía no necesitas la suma de los ejercicios.

La aplicación debe funcionar <i>independientemente del número de partes que tenga un curso</i>, así que asegúrese de que la aplicación funcione si agrega o quita partes de un curso.

¡Asegúrese de que la consola no muestre errores!

<h4>2.2: Información del curso paso 7</h4>

Muestra también la suma de los ejercicios del curso.

![](../../images/teht/9e.png)

<h4>2.3*: Información del curso, paso8</h4>

Si aún no lo ha hecho, calcule la suma de ejercicios con el método de matriz [reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce).

**Consejo profesional:** cuando su código tiene el siguiente aspecto:

```js
const total = 
  parts.reduce((s, p) => someMagicHere)
```

y no funciona, vale la pena usar <i>console.log</i>, que requiere que la función de flecha se escriba en su forma más larga:

```js
const total = parts.reduce((s, p) => {
  console.log('what is happening', s, p)
  return someMagicHere 
})
```

**Consejo profesional 2:** Hay un [complemento para VS Code](https://marketplace.visualstudio.com/items?itemName=cmstead.jsrefactor) que cambia automáticamente las funciones de flecha de forma corta a su forma más larga, y viceversa.

![](../../images/2/5b.png)

<h4>2.4: Información del curso, paso 9</h4>

Extendamos nuestra aplicación para permitir un <i>número arbitrario</i> de cursos:

```js
const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return (
    <div>
      // ...
    </div>
  )
}
```

La aplicación puede, por ejemplo, verse así:

![](../../images/teht/10e.png)

<h4>2.5: módulo separado</h4>

Declare el componente <i>Course</i> como un módulo separado, que es importado por el componente <i>App</i>. Puede incluir todos los subcomponentes del curso en el mismo módulo.

</div>