---
mainImage: ../../../images/part-9.svg
part: 9
letter: d
lang: es
---

<div class="content">

Antes de comenzar a profundizar en como puedes usar TypeScript con React, primero deberíamos echar un vistazo a lo que queremos lograr. Cuando todo funcione como debería, TypeScript nos ayudará a detectar los siguientes errores:

- Intentar pasar un prop adicional/no deseado a un componente
- Olvidar pasar un prop requerido a un componente
- Pasar un prop de un tipo incorrecto a un componente

Si cometemos alguno de estos errores, TypeScript puede ayudarnos a detectarlos en nuestro editor de inmediato. Si no usamos TypeScript, tendríamos que detectar estos errores más tarde durante el testing. Podríamos vernos obligados a realizar un debugging tedioso para encontrar la causa de los errores.

Eso es suficiente razonamiento por ahora, ¡comencemos a ensuciarnos las manos!

### Vite con TypeScript

Podemos usar [Vite](https://vitejs.dev/) para crear una aplicación de TypeScript especificando un template *react-ts* en el script de inicialización. Entonces, para crear una aplicación TypeScript, ejecuta el siguiente comando:

```shell
npm create vite@latest my-app-name -- --template react-ts
```

Después de ejecutar el comando, deberías tener una aplicación React básica completa que use TypeScript. Puedes iniciar la aplicación ejecutando *npm start* en la raíz de la aplicación.

Si echas un vistazo a los archivos y directorios, notarás que la aplicación no es tan diferente de una que usa JavaScript puro. Las únicas diferencias son que los archivos *.jsx* ahora son archivos *.tsx*, contienen algunas anotaciones de tipo y el directorio raíz contiene un archivo *tsconfig.json*.

Ahora, echemos un vistazo al archivo *tsconfig.json* que se ha creado para nosotros:

```js
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

Observa que *compilerOptions* ahora tiene la clave [lib](https://www.typescriptlang.org/tsconfig#lib) que incluye "definiciones de tipo para cosas encontradas en ambientes de navegador (como *document*)". Todo lo demás debería estar más o menos bien

En nuestro anterior proyecto, usamos ESlint para ayudarnos a forzar reglas de estilo, y haremos lo mismo con esta app. No necesitamos instalar ninguna dependencia, ya que Vite se ha ocupado de ello.

Cuando miramos al archivo *main.tsx* que Vite ha generado, luce familiar pero hay una pequeña y llamativa diferencia, hay un signo de exclamación luego de la declaración _document.getElementById('root')_:

```js
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

El motivo es que la declaración podría devolver null pero _ReactDOM.createRoot_ no acepta null como parámetro. Con el [operador !](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#non-null-assertion-operator-postfix-), es posible afirmarle al compilador de TypeScript que el valor no es null.

Anteriormente en esta parte [advertimos](/es/part9/primeros_pasos_con_type_script#asercion-de-tipos) acerca de los peligros de las aserciones de tipo, pero en nuestro caso la aserción está bien ya que estamos seguros de que el archivo *index.html* tiene este id y la función siempre devuelve un HTMLElement.

### Componentes de React con TypeScript

Consideremos el siguiente ejemplo de JavaScript React:

```jsx
import ReactDOM from 'react-dom/client'
import PropTypes from "prop-types";

const Welcome = props => {
  return <h1>Hello, {props.name}</h1>;
};

Welcome.propTypes = {
  name: PropTypes.string
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <Welcome name="Sarah" />
)
```

En este ejemplo tenemos un componente llamado *Welcome* al que pasamos un *name* como prop. Luego muestra el nombre en la pantalla. Sabemos que *name* debe ser un string, y usamos el paquete [prop-types](https://www.npmjs.com/package/prop-types) presentado en la [parte 5](/es/part5/props_children_y_proptypes#prop-types) para recibir sugerencias sobre los tipos deseados de props en el componente y advertencias sobre tipos de props no válidos.

Con TypeScript ya no necesitamos el paquete *prop-types*. Podemos definir los tipos con la ayuda de TypeScript, de la misma forma en que definimos los tipos de una función regular, ya que los componentes de React no son más que meras funciones. Utilizaremos una interface para los tipos de los parámetros (p.ej. props) y *JSX.Element* como en valor de retorno para cualquier componente de React:

```jsx
import ReactDOM from 'react-dom/client'

interface WelcomeProps {
  name: string;
}

const Welcome = (props: WelcomeProps): JSX.Element => {
  return <h1>Hello, {props.name}</h1>;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Welcome name="Sarah" />
)
```

Hemos definido un nuevo tipo, *WelcomeProps*, y lo hemos pasado como tipo de los parámetros de la función.

```jsx
const Welcome = (props: WelcomeProps): JSX.Element => {
```

Podrías escribir la misma cosa usando una sintaxis más verbosa:

```jsx
const Welcome = ({ name }: { name: string }): JSX.Element => (
  <h1>Hello, {name}</h1>
);
```

Ahora nuestro editor sabe que el prop *name* es un string.

De hecho, no hay necesidad de definir el tipo de retorno de un componente de React ya que el compilador de TypeScript infiere el tipo de manera automática, por lo que simplemente podríamos escribir:

```jsx
interface WelcomeProps {
  name: string;
}

const Welcome = (props: WelcomeProps) => { // highlight-line
  return <h1>Hello, {props.name}</h1>;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Welcome name="Sarah" />
)
```

</div>

<div class="tasks">

### Ejercicio 9.14.

#### 9.14.

Crea una nueva aplicación Vite con TypeScript.

Este ejercicio es similar al que ya hiciste en la [Parte 1](/es/part1/java_script#ejercicios-1-3-1-5) del curso, pero con TypeScript y algunos ajustes adicionales. Comienza modificando el contenido de *main.tsx* a lo siguiente:

```jsx
import ReactDOM from 'react-dom/client'
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
)
```

y *App.tsx*:

```jsx
const App = () => {
  const courseName = "Half Stack application development";
  const courseParts = [
    {
      name: "Fundamentals",
      exerciseCount: 10
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14
    }
  ];

  const totalExercises = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);

  return (
    <div>
      <h1>{courseName}</h1>
      <p>
        {courseParts[0].name} {courseParts[0].exerciseCount}
      </p>
      <p>
        {courseParts[1].name} {courseParts[1].exerciseCount}
      </p>
      <p>
        {courseParts[2].name} {courseParts[2].exerciseCount}
      </p>
      <p>
        Number of exercises {totalExercises}
      </p>
    </div>
  );
};

export default App;
```

y elimina los archivos innecesarios.

Toda la aplicación ahora está en un componente. Esto no es lo que queremos, así que refactoriza el código para que conste de tres componentes: *Header*, *Content* y *Total*. Todos los datos aún se mantienen en el componente *App*, que pasa todos los datos necesarios a cada componente como props. *¡Asegúrate de agregar declaraciones de tipo para los props de cada componente!*

El componente *Header* debe encargarse de mostrar el nombre del curso. *Content* debe mostrar los nombres de las diferentes partes y la cantidad de ejercicios en cada parte, y *Total* debe mostrar la suma total de ejercicios en todas las partes.

El componente *App* debería verse algo así:

```jsx
const App = () => {
  // const-declarations

  return (
    <div>
      <Header name={courseName} />
      <Content ... />
      <Total ... />
    </div>
  )
};
```

</div>

<div class="content">

### Uso de tipos en profundidad

En el ejercicio anterior teníamos tres partes de un curso, y todas las partes tenían los mismos atributos *name* y *exerciseCount*. Pero, ¿qué pasaría si necesitáramos atributos adicionales para una parte específica? ¿Cómo se vería esto en el código? Consideremos el siguiente ejemplo:

```js
const courseParts = [
  {
    name: "Fundamentals",
    exerciseCount: 10,
    description: "This is an awesome course part"
  },
  {
    name: "Using props to pass data",
    exerciseCount: 7,
    groupProjectCount: 3
  },
  {
    name: "Basics of type Narrowing",
    exerciseCount: 7,
    description: "How to go from unknown to string"
  },
  {
    name: "Deeper type usage",
    exerciseCount: 14,
    description: "Confusing description",
    backgroundMaterial: "https://type-level-typescript.com/template-literal-types"
  },
];
```

En el ejemplo anterior, hemos agregado algunos atributos adicionales a cada parte del curso.
Cada parte tiene los atributos *name* y *exerciseCount*, pero la primera, la tercera y la cuarta también tienen un atributo llamado *description*. La segunda y la cuarta parte también tienen algunos atributos adicionales distintos.

Imaginemos que nuestra aplicación sigue creciendo y necesitamos pasar las diferentes partes del curso en nuestro código. Además de eso, también se agregan atributos adicionales y partes del curso a la mezcla. ¿Cómo podemos saber que nuestro código es capaz de manejar correctamente todos los diferentes tipos de datos y no nos estamos olvidando, por ejemplo, de mostrar una nueva parte del curso en alguna página? ¡Aquí es donde TypeScript es realmente útil!

Comencemos por definir tipos para nuestras diferentes partes del curso. Notamos que la primera y la tercera tienen los mismos atributos. La segunda y la cuarta son un poco diferentes por lo que tenemos tres clases diferentes de elementos de partes del curso.

Entonces, definamos un tipo para cada clase diferente de partes del curso:

```js
interface CoursePartBasic {
  name: string;
  exerciseCount: number;
  description: string;
  kind: "basic"
}

interface CoursePartGroup {
  name: string;
  exerciseCount: number;
  groupProjectCount: number;
  kind: "group"
}

interface CoursePartBackground {
  name: string;
  exerciseCount: number;
  description: string;
  backgroundMaterial: string;
  kind: "background"
}
```

Ademas de los atributos que se encuentran en las diferentes partes del curso, ahora hemos introducido un atributo adicional llamado *kind* que tiene un tipo [literal](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types), es una string "hardcodeada", diferente para cada parte del curso. ¡Pronto veremos donde es utilizado el atributo kind!

A continuación, crearemos una [unión de tipos](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types) de todos estos tipos. Luego podemos usarlo para definir un tipo para nuestro array, que debería aceptar cualquiera de estos tipos de partes del curso:

```js
type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground;
```

Ahora podemos establecer el tipo de nuestra variable *courseParts*:

```js
const App = () => {
  const courseName = "Half Stack application development";
  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is an awesome course part",
      kind: "basic" // highlight-line
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: "group" // highlight-line
    },
    {
      name: "Basics of type Narrowing",
      exerciseCount: 7,
      description: "How to go from unknown to string",
      kind: "basic" // highlight-line
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      backgroundMaterial: "https://type-level-typescript.com/template-literal-types",
      kind: "background" // highlight-line
    },
  ]

  // ...
}
```

Ten en cuenta que ahora hemos añadido el atributo *kind* con un valor apropiado a cada elemento del array.

Ahora nuestro editor nos advertirá automáticamente si usamos un tipo incorrecto para un atributo, usamos un atributo adicional u olvidamos establecer un atributo esperado. Si p.ej. intentamos añadir el siguiente curso al array:

```js
{
  name: "TypeScript in frontend",
  exerciseCount: 10,
  kind: "basic",
},
```

Inmediatamente recibiremos un error en el editor:

![vscode exerciseCount no es asignable a tipo CoursePart - falta la descripción](../../images/9/63new.png)

Ya que nuestra nueva entrada tiene el atributo *kind* con valor *"basic"*, Typescript sabe que la entrada no tiene solo el tipo *CoursePart* pero en realidad está destinado a ser un *CoursePartBasic*. Entonces, aquí el atributo *kind* "estrecha" el tipo de la entrada desde un tipo más general a un tipo más específico que contiene un cierto conjunto de atributos. ¡Pronto veremos esta clase de estrechamiento de tipos en acción en nuestro código!

¡Pero todavía no estamos satisfechos! Todavía hay mucha duplicación en nuestros tipos y queremos evitar eso. Comenzamos identificando los atributos que todas las partes del curso tienen en común y definiendo un tipo base que los contenga. Luego, [extenderemos](https://www.typescriptlang.org/docs/handbook/2/objects.html#extending-types) ese tipo base para crear nuestros tipos específicos:

```js
interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartBasic extends CoursePartBase {
  description: string;
  kind: "basic"
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group"
}

interface CoursePartBackground extends CoursePartBase {
  description: string;
  backgroundMaterial: string;
  kind: "background"
}

type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground;
```

### Más estrechamiento de tipos

¿Cómo deberíamos utilizar ahora estos tipos en nuestros componentes?

Si intentamos acceder a los objetos del array *courseParts: CoursePart[]* notamos que solo es posible acceder a los atributos que son comunes a todos los tipos en la unión:

![vscode showing part.exerciseCou](../../images/9/65new.png)

Y por supuesto, la [documentación de TypeScript](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#working-with-union-types) dice esto:

> *Typescript solo permitirá una operación (o acceso a atributos) si es válida para cada miembro de la unión*

La documentación también menciona lo siguiente:

> *La solución es estrechar la unión con código... El estrechamiento ocurre cuando TypeScript puede deducir un tipo más específico para un valor basado en la estructura del código.*

Entonces, una vez más, ¡el [estrechamiento de tipos](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) viene al rescate!

Una forma práctica de estrechar esta clase de tipos en TypeScript es mediante el uso de expresiones *switch case*. Una vez que TypeScript haya inferido que una variable es de tipo unión y que cada tipo en la unión contiene un determinado atributo literal (en nuestro caso *kind*), podemos usarlo como un identificador de tipo. Luego podemos construir un switch case alrededor de este atributo y TypeScript sabrá qué atributos están disponibles dentro de cada bloque de case.

![vscode mostrando part. y luego los atributos](../../images/9/64new.png)

En el ejemplo anterior, TypeScript sabe que un *part* tiene el tipo *CoursePart* y, entonces puede inferir que *part* es de tipo *CoursePartBasic*, *CoursePartGroup* o *CoursePartBackground* basado en el valor del atributo *kind*.

La técnica específica de estrechamiento de tipos en donde una unión de tipos es estrechada basada en el atributo literal de un valor se llama [unión discriminada](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions).

Ten en cuenta que naturalmente, el estrechamiento puede también hacerse con la cláusula *if*. Podríamos, por ejemplo, hacer lo siguiente:

```js
  courseParts.forEach(part => {
    if (part.kind === 'background') {
      console.log('see the following:', part.backgroundMaterial)
    }

    // can not refer to part.backgroundMaterial here!
  });
```

¿Qué pasa con la adición de nuevos tipos? Si tuviéramos que agregar una nueva parte del curso, ¿no sería bueno saber si ya hemos implementado el manejo de ese tipo en nuestro código? En el ejemplo anterior, un nuevo tipo iría al bloque *default* y no se imprimiría nada para un nuevo tipo. Por ejemplo, si deseas manejar solo casos específicos (pero no todos) de una unión de tipos, tener un default estaría bien. Sin embargo, en la mayoría de los casos, se recomienda manejar todas las variaciones por separado.

Con TypeScript podemos utilizar un método llamado [comprobación exhaustiva de tipos](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking). Su principio básico es que si encontramos un valor inesperado, llamamos a una función que acepta un valor con el tipo [never](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-never-type) y también tiene el tipo de retorno *never*.

Una versión sencilla de la función podría verse así:

```js
/**
 * Helper function for exhaustive type checking
 */
const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};
```

Si ahora reemplazáramos el contenido de nuestro bloque *default* por:

```js
default:
  return assertNever(part);
```

y también removiéramos el case que maneja al tipo *CoursePartBackground*, veríamos el siguiente error:

![error de vscode: Argumento de tipo CoursePart no es asignable al tipo never](../../images/9/66new.png)

El mensaje de error dice que

```text
'CoursePartBackground' no es asignable al parámetro de tipo 'never'.
```

lo que nos dice que estamos usando una variable en algún lugar donde nunca debería usarse. Esto nos dice que hay que arreglar algo.

</div>

<div class="tasks">

### Ejercicio 9.15.

#### 9.15.

Continuemos extendiendo la aplicación creada en el ejercicio 9.14. Primero, agrega la información del tipo y reemplaza la variable *courseParts* con la del ejemplo siguiente.

```js
interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartBasic extends CoursePartBase {
  description: string;
  kind: "basic"
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group"
}

interface CoursePartBackground extends CoursePartBase {
  description: string;
  backgroundMaterial: string;
  kind: "background"
}

type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground;

const courseParts: CoursePart[] = [
  {
    name: "Fundamentals",
    exerciseCount: 10,
    description: "This is an awesome course part",
    kind: "basic"
  },
  {
    name: "Using props to pass data",
    exerciseCount: 7,
    groupProjectCount: 3,
    kind: "group"
  },
  {
    name: "Basics of type Narrowing",
    exerciseCount: 7,
    description: "How to go from unknown to string",
    kind: "basic"
  },
  {
    name: "Deeper type usage",
    exerciseCount: 14,
    description: "Confusing description",
    backgroundMaterial: "https://type-level-typescript.com/template-literal-types",
    kind: "background"
  },
  {
    name: "TypeScript in frontend",
    exerciseCount: 10,
    description: "a hard part",
    kind: "basic",
  },
];
```

Ahora sabemos que ambas interfaces *CoursePartBasic* y *CoursePartBackground* comparten no solo los atributos base, sino también un atributo llamado *description*, que es un string en ambas interfaces.

Tu primera tarea es declarar una nueva interface, que incluya el atributo *description* y extienda la interfaz de *CoursePartBase*. Luego, modifica el código para que puedas eliminar el atributo *description* de *CoursePartBasic* y de *CoursePartBackground* sin obtener ningún error.

A continuación, crea un componente *Part* que muestre todos los atributos de cada tipo de parte del curso. ¡Utiliza un switch case basado en verificación de tipos exhaustiva! Utiliza el nuevo componente en el componente *Content*.

Por último, agrega otra parte del curso con los siguientes atributos: *name*, *exerciseCount*, *description* y *requirements*, el último siendo un array de strings. Los objetos de este tipo se ven de la siguiente manera:

```js
{
  name: "Backend development",
  exerciseCount: 21,
  description: "Typing the backend",
  requirements: ["nodejs", "jest"],
  kind: "special"
}
```

Luego agrega esa interfaz a la unión de tipos *CoursePart* y agrega los datos correspondientes a la variable *courseParts*. Ahora, si no has modificado tu componente *Content* correctamente, deberías recibir un error, porque aún no has agregado soporte para el cuarto tipo de parte del curso. Realiza los cambios necesarios a *Content*, para que todos los atributos de la nueva parte del curso también se muestren y el compilador no produzca ningún error.

El resultado podría verse así:

![navegador mostrando half stack application development](../../images/9/45.png)

</div>

<div class="content">

### Aplicación de React con estado

Hasta ahora, solo hemos mirado a una aplicación que mantiene todos sus datos en una variable tipada pero no tiene ningún estado. Volvamos una vez más a la aplicación de notas, y construyamos una versión tipada.

Comenzamos con el siguiente código:

```js
import { useState } from 'react';

const App = () => {
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState([]);

  return null
}
```

Cuando pasamos el cursor sobre las llamadas a *useState* en el editor, notamos un par de cosas interesantes.

El tipo de el primer llamado *useState('')* se ve de la siguiente manera:

```ts
useState<string>(initialState: string | (() => string)):
  [string, React.Dispatch<React.SetStateAction<string>>]
```

El tipo es un poco difícil de descifrar. Tiene la siguiente "forma":

```ts
functionName(parameters): return_value
```

Entonces notamos que el compilador de TypeScript ha inferido que el estado inicial es, o un string, o una función que devuelve un string:

```ts
initialState: string | (() => string))
```

El tipo del array devuelto es el siguiente:

```ts
[string, React.Dispatch<React.SetStateAction<string>>]
```

Entonces, el primer elemento, asignado a *newNote* es un string y, el segundo elemento que asignamos a *setNewNote* tiene un tipo un poco más complejo. Notamos que allí se menciona a un string, entonces sabemos que debe ser el tipo de una función que establece un valor de datos. Mira [esto](https://codewithstyle.info/Using-React-useState-hook-with-TypeScript/) si quieres aprender más acerca de los tipos de la función useState.

De todo esto, hemos visto que TypeScript ha [inferido](https://www.typescriptlang.org/docs/handbook/type-inference.html#handbook-content) el tipo del primer useState bastante bien, está creando un estado con tipo string.

Cuando miramos al segundo useState que tiene el valor inicial *[]* el tipo se ve bastante diferente.

```ts
useState<never[]>(initialState: never[] | (() => never[])): 
  [never[], React.Dispatch<React.SetStateAction<never[]>>] 
```

TypeScript solo puede inferir que el estado tiene el tipo *never[]*, es un array, pero no tiene ni idea de cuales son los elementos guardados en el array. Entonces, claramente necesitamos ayudar al compilador y proveerle el tipo explícitamente.

Una de las mejores fuentes de información sobre como tipar React es [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/). El capítulo del Cheatsheet sobre el hook [useState](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks#usestate) nos instruye en usar un *parámetro de tipo* en situaciones en las que el compilador no puede inferir el tipo.

Ahora definamos un tipo para notes:

```js
interface Note {
  id: number,
  content: string
}
```

La solución ahora es simple:

```js
const [notes, setNotes] = useState<Note[]>([]);
```

Y de hecho, el tipo es establecido bastante bien:

```ts
useState<Note[]>(initialState: Note[] | (() => Note[])):
  [Note[], React.Dispatch<React.SetStateAction<Note[]>>]
```

Entonces, en términos técnicos, useState es una [función genérica](https://www.typescriptlang.org/docs/handbook/2/generics.html#working-with-generic-type-variables), donde el tipo tiene que ser especificado como un *parámetro de tipo* en esos casos en donde el compilador no puede inferir el tipo.

Mostrar las notas ahora es fácil. Agreguemos solo unos datos al estado para que podamos ver que el código funciona:

```js
interface Note {
  id: number,
  content: string
}

import { useState } from "react";

const App = () => {
  const [notes, setNotes] = useState<Note[]>([
    { id: 1, content: 'testing' } // highlight-line
  ]);
  const [newNote, setNewNote] = useState('');

  return (
    // highlight-start
    <div>
      <ul>
        {notes.map(note =>
          <li key={note.id}>{note.content}</li>
        )}
      </ul>
    </div>
    // highlight-end
  )
}
```

La siguiente tarea es agregar un formulario que haga posible agregar nuevas notas:

```js
const App = () => {
  const [notes, setNotes] = useState<Note[]>([
    { id: 1, content: 'testing' }
  ]);
  const [newNote, setNewNote] = useState('');

  return (
    <div>
      // highlight-start
      <form>
        <input
          value={newNote}
          onChange={(event) => setNewNote(event.target.value)} 
        />
        <button type='submit'>add</button>
      </form>
      // highlight-end
      <ul>
        {notes.map(note =>
          <li key={note.id}>{note.content}</li>
        )}
      </ul>
    </div>
  )
}
```

Simplemente funciona, ¡no hay quejas acerca de los tipos! Cuando pasamos el cursor sobre *event.target.value*, vemos que de hecho es un string, justo lo que es el parámetro esperado de *setNewNote*:

![vscode mostrando variable es un string](../../images/9/67new.png)

Aún necesitamos el event handler para agregar la nueva nota. Intentemos lo siguiente:

```js
const App = () => {
  // ...

   // highlight-start
  const noteCreation = (event) => {
    event.preventDefault()
    // ...
  };
   // highlight-end

  return (
    <div>
      <form onSubmit={noteCreation}> // highlight-line
        <input
          value={newNote}
          onChange={(event) => setNewNote(event.target.value)} 
        />
        <button type='submit'>add</button>
      </form>
      // ...
    </div>
  )
}
```

No funciona del todo bien, hay un error de ESlint quejándose acerca de any implícito:

![error de vscode event implícitamente tiene tipo any](../../images/9/68new.png)

El compilador de TypeScript ahora no tiene ni idea de cual es el tipo del parámetro, por eso el tipo es el famoso any implícito que queremos [evitar](/es/part9/primeros_pasos_con_type_script#los-horrrores-de-any) a toda costa. React TypeScript cheatsheet viene otra vez al rescate, el capítulo sobre
[formularios y eventos](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forms_and_events) revela que el tipo correcto para el event handler es *React.SyntheticEvent*.

El código se vuelve

```js
interface Note {
  id: number,
  content: string
}

const App = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');

// highlight-start
  const noteCreation = (event: React.SyntheticEvent) => {
    event.preventDefault()
    const noteToAdd = {
      content: newNote,
      id: notes.length + 1
    }
    setNotes(notes.concat(noteToAdd));

    setNewNote('')
  };
// highlight-end

  return (
    <div>
      <form onSubmit={noteCreation}>
        <input value={newNote} onChange={(event) => setNewNote(event.target.value)} />
        <button type='submit'>add</button>
      </form>
      <ul>
        {notes.map(note =>
          <li key={note.id}>{note.content}</li>
        )}
      </ul>
    </div>
  )
}
```

Y eso es todo, ¡nuestra aplicación está lista y perfectamente tipada!

### Comunicándose con el servidor

Modifiquemos la aplicación para que las notas se guarden en un backend con JSON server en la url <http://localhost:3001/notes>

Como de costumbre, usaremos Axios y el hook useEffect para obtener el estado inicial desde el servidor.

Intentemos lo siguiente

```js
const App = () => {
  // ...
  useEffect(() => {
    axios.get('http://localhost:3001/notes').then(response => {
      console.log(response.data);
    })
  }, [])
  // ...
}
```

Cuando pasamos el cursor sobre *response.data* vemos que tiene el tipo *any*

![vscode response.data mostrando el tipo any](../../images/9/69new.png)

Para establecer los datos en el estado con la función *setNotes* debemos tiparlo apropiadamente.

Con un poco de [ayuda del internet](https://upmostly.com/typescript/how-to-use-axios-in-your-typescript-apps), encontramos un truco astuto:

```js
  useEffect(() => {
    axios.get<Note[]>('http://localhost:3001/notes').then(response => { // highlight-line
      console.log(response.data);
    })
  }, [])
```

Cuando pasamos el cursor sobre response.data vemos que tiene el tipo correcto:

![vscode mostrando que response.data tiene el tipo Note array](../../images/9/70new.png)

Ahora podemos establecer los datos en el estado *notes* para tener al código funcionando:

```js
  useEffect(() => {
    axios.get<Note[]>('http://localhost:3001/notes').then(response => {
      setNotes(response.data) // highlight-line
    })
  }, [])
```

Entonces, justo como con *useState*, le damos un tipo de parámetro a *axios.get* para instruirle como debe ser hecho el tipado. Al igual que *useState*, *axios.get* es una [función genérica](https://www.typescriptlang.org/docs/handbook/2/generics.html#working-with-generic-type-variables). A diferencia de algunas funciones genéricas, el tipo de parámetro de *axios.get* tiene un valor *any* por defecto, entonces, si la función es usada sin definir el tipo de parámetro, el tipo de los datos de la respuesta será any.

El código funciona, el compilador y ESlint están felices y permanecen quietos. Sin embargo, darle un parámetro de tipo a *axios.get* es una cosa potencialmente peligrosa. El body de la respuesta puede contener datos en una forma arbitraria, y cuando le damos un parámetro de tipo, esencialmente estamos diciéndole al compilador de TypeScript que confié en que los datos tienen el tipo *Note[]*.

Entonces, nuestro código es esencialmente tan seguro como sería si utilizáramos una [aserción de tipo](/es/part9/primeros_pasos_con_type_script#asercion-de-tipos):

```js
  useEffect(() => {
    axios.get('http://localhost:3001/notes').then(response => {
      // response.body is of type any
      setNotes(response.data as Note[]) // highlight-line
    })
  }, [])
```

Ya que los tipos de TypeScript ni siquiera existen durante el tiempo de ejecución, nuestro código no nos ofrece "seguridad" en situaciones en las que el body de la solicitud contenga datos con el formato erróneo.

Darle una variable de tipo a *axios.get* podría estar bien si estamos *absolutamente seguros* de que el backend se comporta correctamente y siempre devuelve los datos en el formato correcto. Si queremos construir un sistema robusto deberíamos prepararnos para sorpresas y procesar los datos de la respuesta en el frontend similarmente a como lo hicimos [en la sección previa](/es/part9/tipando_una_aplicacion_express#solicitudes-de-revision) para las solicitudes al backend.

Concluyamos ahora nuestra aplicación implementando la nueva adición de notas:

```js
  const noteCreation = (event: React.SyntheticEvent) => {
    event.preventDefault()
    // highlight-start
    axios.post<Note>('http://localhost:3001/notes', { content: newNote })
      .then(response => {
        setNotes(notes.concat(response.data))
      })
    // highlight-end

    setNewNote('')
  };
```

Una vez más estamos dándole a *axios.post* un parámetro de tipo. Sabemos que la respuesta del servidor es la nota agregada, por lo que el parámetro apropiado es *Note*

Limpiemos el codigo un poco. Para las definiciones de tipo, creamos un archivo *types.ts* con el siguiente contenido:

```js
export interface Note {
  id: number,
  content: string
}

export type NewNote = Omit<Note, 'id'>
```

Hemos agregado un nuevo tipo para la *nueva nota*, uno que todavía no tiene el campo *id* asignado.

El código que se comunica con el backend también es extraído a un módulo en el archivo llamado *noteService.ts*

```js
import axios from 'axios';
import { Note, NewNote } from "./types";

const baseUrl = 'http://localhost:3001/notes'

export const getAllNotes = () => {
  return axios
    .get<Note[]>(baseUrl)
    .then(response => response.data)
}

export const createNote = (object: NewNote) => {
  return axios
    .post<Note>(baseUrl, object)
    .then(response => response.data)
}
```

El componente *App* ahora es mucho más claro:

```js
import { useState, useEffect } from "react";
import { Note } from "./types"; // highlight-line
import { getAllNotes, createNote } from './noteService'; // highlight-line

const App = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    // highlight-start
    getAllNotes().then(data => {
      setNotes(data)
    })
    // highlight-end
  }, [])

  const noteCreation = (event: React.SyntheticEvent) => {
    event.preventDefault()
    // highlight-start
    createNote({ content: newNote }).then(data => {
      setNotes(notes.concat(data))
    })
    // highlight-end

    setNewNote('')
  };

  return (
    // ...
  )
}
```

¡La aplicación ahora está bien tipada y lista para ser más desarrollada!

El código de las notas tipadas puede ser encontrado [aquí](https://github.com/fullstack-hy2020/typed-notes)

### Una nota sobre la definición de tipos de objetos

Hemos utilizado [interfaces](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces) para definir tipos de objetos, por ejemplo, entradas de diario, en la sección anterior.

```js
interface DiaryEntry {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment?: string;
} 
```
y en la parte del curso en esta sección

```js
interface CoursePartBase {
  name: string;
  exerciseCount: number;
}
```

De hecho, podríamos haber tenido el mismo efecto usando un [alias de tipo](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases)


```js
type DiaryEntry = {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment?: string;
} 
```

En la mayoría de los casos, puedes utilizar la sintaxis que prefieras, *type* or *interface*. Sin embargo, hay algunas cosas a tener en cuenta.
Por ejemplo, si defines varias interfaces con el mismo nombre, darán como resultado una interfaz fusionada, mientras que si intentas definir varios tipos con el mismo nombre, dará como resultado un error que indica que un tipo con el mismo nombre ya está declarado.

La documentación de TypeScript [recomienda el uso de interfaces](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces) en la mayoría de los casos.

</div>

<div class="tasks">

### Ejercicios 9.16-9.19

Ahora construyamos un frontend para la aplicación de diarios de vuelo de Ilari que fue desarrollada [en la sección anterior](/es/part9/tipando_una_aplicacion_express). El código fuente del backend puede encontrarse en [este repositorio de GitHub](https://github.com/fullstack-hy2020/flight-diary).

#### Ejercicio 9.16

Crea una aplicación React con Typescript con configuraciones similares a las de las aplicaciones de esta sección. Obtén los diarios del backend y muéstralos en la pantalla. Haz todo el tipado requerido y asegúrate de que no hay errores de ESlint.

Recuerda mantener abierta la pestaña network. Podría darte una pista importante...

Puedes decidir como las entradas de los diarios son mostradas. Si lo deseas, podrías inspirarte en la figura de abajo. Ten en cuenta que la API del backend no devuelve los comentarios del diario, podrías modificarlo para que también los devuelva en la solicitud GET.

#### Ejercicio 9.17

Haz que sea posible agregar nuevas entradas al diario desde el frontend. En este ejercicio puedes saltarte todas las validaciones y asumir que el usuario entra los datos en el formato correcto.

#### Ejercicio 9.18

Notifica al usuario si la creación de una entrada del diario falla en el backend, muestra también el motivo del fallo.

Por ejemplo, dale un vistazo a [esto](https://dev.to/mdmostafizurrahaman/handle-axios-error-in-typescript-4mf9) para ver como puedes estrechar los errores de Axios para que puedas hacerte con el mensaje de error.

Tu solución podría verse así:

![navegador mostrando error incorrect visibility best ever](../../images/9/71new.png)

#### Ejercicio 9.19

La adición de una entrada de diario ahora es muy susceptible a errores ya que el usuario puede escribir cualquier cosa en los inputs. La situación debe ser mejorada.

Modifica el input del formulario para que la fecha se defina con un elemento de input de tipo [date](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date), y el clima y la visibilidad se definan con [radio buttons](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio). Ya hemos utilizado radio buttons en la [parte 6](/es/part6/muchos_reducers#store-con-estado-complejo), ese material puede ser util o no...

Tu aplicación debería estar bien tipada todo el tiempo, no debería tener ningún error de ESlint y ninguna regla de ESlint debería ser ignorada.

Tu solución podría verse así:

![navegador mostrando el formulario para agregar nuevas entradas a los diarios](../../images/9/72new.png)

</div>
