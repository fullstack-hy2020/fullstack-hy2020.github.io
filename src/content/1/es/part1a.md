--- 
mainImage: ../../../images/part-1.svg 
part: 1 
letter: a 
lang: es
--- 

<div class="content">

Ahora comenzaremos a familiarizarnos con probablemente el tema más importante de este curso, es decir, la librería [React](https://es.react.dev/). Comencemos con la creación de una aplicación React simple y con el conocimiento de los conceptos básicos de React.

La forma más fácil de empezar es utilizando una herramienta llamada [Vite](https://es.vitejs.dev/).

Comencemos creando una aplicación llamada <i>part1</i>, navegar a este directorio e instalando las librerias:

```bash
# npm 6.x (desactualizado, pero aun en uso por algunos):
npm create vite@latest part1 --template react

# npm 7+, el doble guion adicional es necesario:
npm create vite@latest part1 -- --template react
```

```bash
cd part1
npm install
```

La aplicación se inicia de la siguiente manera

```bash
npm run dev
```

La consola indica que la aplicación ha iniciado en localhost, puerto 5173, es decir la dirección <http://localhost:5173/>:

![Captura de pantalla de la consola ejecutando vite en localhost 5173](../../images/1/1-vite1.png)

Vite inicia la aplicación [por defecto](https://es.vitejs.dev/config/server-options.html#server-port) en el puerto 5173. Si este no está libre, Vite utiliza el siguiente numero de puerto libre.

Abre el navegador y un editor de código para que puedas ver el código y el navegador al mismo tiempo en la pantalla:

![Captura de pantalla de la pagina inicial de vite y estructura de archivos en vs code](../../images/1/1-vite4.png)

El código de la aplicación se encuentra en la carpeta <i>src</i>. Simplifiquemos el código predeterminado de tal modo que el archivo main.jsx se vea así:

```js
import ReactDOM from 'react-dom/client'

import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

y el archivo <i>App.jsx</i> se vea así:

```js
const App = () => {
  return (
    <div>
      <p>Hello world</p>
    </div>
  )
}

export default App
```

Los archivos <i>App.css</i> y <i>index.css</i>, y el directorio <i>assets</i> pueden eliminarse ya que nos son necesarios en nuestra aplicación por ahora.

### create-react-app

En lugar de Vite, tu puedes usar la vieja herramienta de generación [create-react-app](https://github.com/facebookincubator/create-react-app) en el curso para inicializar aplicaciones. La diferencia más visible es el nombre del archivo de arranque de la aplicación, el cual es <i>index.js</i>.

La manera de iniciar la aplicación también es diferente en CRA, en esta se inicia con el comando

```bash
npm start
```

en contraste con Vite

```bash
npm run dev
```

El curso actualmente (11 de agosto de 2023) está siendo actualizado para usar Vite. Algunas partes aun usan la aplicación base creada con create-react-app.

### Componente

El archivo <i>App.js</i> ahora define un [componente](https://es.legacy.reactjs.org/docs/components-and-props.html) de React con el nombre <i>App</i>. El comando en la línea final del archivo <i>main.jsx</i>

```js
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

renderiza su contenido dentro del elemento <i>div</i>, definido en el archivo <i>index.html</i>, que tiene el valor 'root' en el atributo <i>id</i>.

De forma predeterminada, el archivo <i>index.html</i> no contiene ningún marcado HTML que sea visible para nosotros en el navegador. 

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

```

Puedes intentar agregar algo de HTML al archivo. Sin embargo, cuando se usa React, todo el contenido que necesita ser renderizado es generalmente definido como componentes de React.

Echemos un vistazo mas de cerca al código que define el componente:

```js
const App = () => (
  <div>
    <p>Hello world</p>
  </div>
)
```

Como probablemente adivinaste, el componente se renderiza como una etiqueta <i>div</i>, que envuelve una etiqueta <i>p</i> que contiene el texto <i>Hello world</i>.

Técnicamente, el componente se define como una función de JavaScript. La siguiente es una función (que no recibe ningún parámetro):

```js
() => (
  <div>
    <p>Hello world</p>
  </div>
)
```

La función luego se asigna a un variable constante <i>App</i>:

```js
const App = ...
```

Hay algunas formas de definir funciones en JavaScript. Aquí utilizaremos [funciones de flecha](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Functions/Arrow_functions), que se describen en una versión más reciente de JavaScript conocida como [ECMAScript 6](http://es6-features.org/#Constants), también llamada ES6.

Debido a que la función consta de una sola expresión, hemos utilizado una abreviatura, que representa este fragmento de código:

```js
const App = () => {
  return (
    <div>
      <p>Hello world</p>
    </div>
  )
}
```

En otras palabras, la función devuelve el valor de la expresión.

La función que define el componente puede contener cualquier tipo de código JavaScript. Modifica tu componente para que sea de la siguiente manera:

```js
const App = () => {
  console.log('Hello from component')
  return (
    <div>
      <p>Hello world</p>
    </div>
  )
}

export default App
```

y observa lo que sucede en la consola:

![Consola del navegador mostrando un registro en consola con flecha a "Hello from component"](../../images/1/30.png)

La primera regla del desarrollo web frontend:

> <i>deja la consola abierta todo el tiempo</i>

Repitamos esto juntos: <i>Prometo dejar la consola abierta todo el tiempo</i> durante este curso, y por el resto de mi vida mientras esté haciendo desarrollo web.

También es posible renderizar contenido dinámico dentro de un componente.

Modifica el componente de la siguiente manera:

```js
const App = () => {
  const now = new Date()
  const a = 10
  const b = 20
  console.log(now, a+b)

  return (
    <div>
      <p>Hello world, it is {now.toString()}</p>
      <p>
        {a} plus {b} is {a + b}
      </p>
    </div>
  )
}
```

Cualquier código de JavaScript entre llaves es evaluado y el resultado de esta evaluación se incrusta en el lugar definido en el HTML producido por el componente.

Recuerda que no deberías eliminar la línea al final del componente

```js
export default App
```

El export no se muestra en la mayoría de los ejemplos del material de este curso. Sin este export el componente y la aplicación completa se romperían.

¿Recuerdas que prometiste dejar la consola abierta? ¿Qué se imprimió allí?

### JSX

Parece que los componentes de React están devolviendo marcado HTML. Sin embargo, éste no es el caso. El diseño de los componentes de React se escribe principalmente usando [JSX](https://es.react.dev/learn/writing-markup-with-jsx). Aunque JSX se parece a HTML, en realidad estamos tratando con una forma de escribir JavaScript. Bajo el capó, el JSX devuelto por los componentes de React se compila en JavaScript. 

Después de compilar, nuestra aplicación se ve así: 

```js
const App = () => {
  const now = new Date()
  const a = 10
  const b = 20
  return React.createElement(
    'div',
    null,
    React.createElement(
      'p', null, 'Hello world, it is ', now.toString()
    ),
    React.createElement(
      'p', null, a, ' plus ', b, ' is ', a + b
    )
  )
}
```

La compilación está a cargo de [Babel](https://babeljs.io/repl/). Los proyectos creados con *create-react-app* o *vite* están configurados para compilarse automáticamente. Aprenderemos más sobre este tema en la [parte 7](/es/part7) de este curso.

También es posible escribir React como "JavaScript puro" sin usar JSX. Aunque, nadie con una mente sana lo haría realmente.

En la práctica, JSX se parece mucho a HTML con la distinción de que con JSX puede incrustar fácilmente contenido dinámico escribiendo JavaScript apropiado entre llaves. La idea de JSX es bastante similar a muchos lenguajes de plantillas, como Thymeleaf, que se utiliza junto con Java Spring, que se utiliza en servidores.

JSX es similar a [XML](https://developer.mozilla.org/es/docs/Web/XML/XML_introduction), lo que significa que todas las etiquetas deben cerrarse. Por ejemplo, una nueva línea es un elemento vacío, que en HTML se puede escribir de la siguiente manera: 

```html
<br>
```

pero al escribir JSX, la etiqueta debe estar cerrada: 

```html
<br />
```

### Componentes múltiples

Modifiquemos el archivo <i>App.jsx</i> de la siguiente manera:

```js
// highlight-start
const Hello = () => {
  return (
    <div>
      <p>Hello world</p>
    </div>
  )
}
// highlight-end

const App = () => {
  return (
    <div>
      <h1>Greetings</h1>
      <Hello /> // highlight-line
    </div>
  )
}
```

Hemos definido un nuevo componente <i>Hello</i> y lo usamos dentro del componente <i>App</i>. Naturalmente, un componente se puede usar múltiples veces:

```js
const App = () => {
  return (
    <div>
      <h1>Greetings</h1>
      <Hello />
      // highlight-start
      <Hello />
      <Hello />
      // highlight-end
    </div>
  )
}
```

**Nota:** El <em>export</em> al final se omite en estos ejemplos ahora y en el futuro. Todavía será necesario para que el código funcione.

Escribir componentes con React es fácil, y al combinar componentes, incluso una aplicación más compleja puede ser bastante fácil de mantener. De hecho, una filosofía central de React es componer aplicaciones a partir de muchos componentes reutilizables especializados.

Otra fuerte convención es la idea de un <i>componente raíz</i> llamado <i>App</i> en la parte superior del árbol de componentes de la aplicación. Sin embargo, como aprenderemos en la [parte 6](/es/part6), hay situaciones en las que el componente <i>App</i> no es exactamente la raíz, sino que está incluido en un componente de utilidad apropiado.

### props: pasar datos a componentes 

Es posible pasar datos a componentes usando los llamados [props](https://es.legacy.reactjs.org/docs/components-and-props.html).

Modifiquemos el componente <i>Hello</i> de la siguiente manera:

```js
const Hello = (props) => { // highlight-line
  return (
    <div>
      <p>Hello {props.name}</p> // highlight-line
    </div>
  )
}
```

Ahora la función que define el componente tiene un parámetro <i>props</i>. Como argumento, el parámetro recibe un objeto, que tiene campos correspondientes a todos los "props" ("accesorios") que el usuario del componente define.

Los props se definen de la siguiente manera:

```js
const App = () => {
  return (
    <div>
      <h1>Greetings</h1>
      <Hello name='George' /> // highlight-line
      <Hello name='Daisy' /> // highlight-line
    </div>
  )
}
```

Puede haber un número arbitrario de props y sus valores pueden ser strings "incrustados en el código" ("hard coded") o resultados de expresiones JavaScript. Si el valor del prop se obtiene usando JavaScript, debe estar envuelto con llaves. 

Modifiquemos el código para que el componente <i>Hello</i> use dos props: 

```js
const Hello = (props) => {
  console.log(props) // highlight-line
  return (
    <div>
      <p>
        Hello {props.name}, you are {props.age} years old // highlight-line
      </p>
    </div>
  )
}

const App = () => {
  const name = 'Peter' // highlight-line
  const age = 10       // highlight-line

  return (
    <div>
      <h1>Greetings</h1>
      <Hello name='Maya' age={26 + 10} /> // highlight-line
      <Hello name={name} age={age} /> // highlight-line
    </div>
  )
}
```

Los props enviados por el componente <i>App</i> son los valores de las variables, el resultado de la evaluación de la expresión de suma y un string regular.

El componente <i>Hello</i> también imprime en consola el valor del objeto props.

Yo realmente espero que tu consola esté abierta. Si no es asi, recuerda tu promesa:

> <i>Prometo dejar la consola abierta todo el tiempo</i> durante este curso, y por el resto de mi vida mientras esté haciendo desarrollo web.

El desarrollo de software es dificil. Este se vuelve aun más dificil si uno no está usando todas las herramientas disponibles como la consola de desarrollo e imprimiendo la depuración con _console.log_. Los profesionales usan ambas <i>todo el tiempo</i> y no hay una sola razón de porque un principiante no debería adoptar estos maravillosos métodos de ayuda que hacen la vida más fácil.

### Posible mensaje de error

Dependiendo del editor que estés usando, podrías recibir un mensaje de error en este punto:

![Captura de pantalla de vs code mostrando un error de eslint: "name is missing in props validation"](../../images/1/1-vite5.png)

Este realmente no es un error, es una advertencia causada por la herramienta [ESLint](https://es.eslint.org/). Tu puedes silenciar la advertencia [react/prop-types](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/prop-types.md) añadiendo la siguiente línea al archivo <i>.eslintrc.cjs</i>

```js
module.exports = {
   root: true,
   env: { browser: true, es2020: true },
   extends: [
     'eslint:recommended',
     'plugin:react/recommended',
     'plugin:react/jsx-runtime',
     'plugin:react-hooks/recommended',
   ],
   ignorePatterns: ['dist', '.eslintrc.cjs'],
   parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
   settings: { react: { version: '18.2' } },
   plugins: ['react-refresh'],
   rules: {
     'react-refresh/only-export-components': [
       'warn',
       { allowConstantExport: true },
     ],
     'react/prop-types': 0 // highlight-line
   },
}
```

Aprenderemos sobre ESLint más en detalle en la [parte 3](/es/part3/validacion_y_es_lint#lint).

### Algunas notas

React se ha configurado para generar mensajes de error bastante claros. A pesar de esto, debes, al menos al principio, avanzar en **pasos muy pequeños** y asegurarte de que cada cambio funcione como se desea.

**La consola siempre debe estar abierta**. Si el navegador reporta errores, no es recomendable seguir escribiendo más código, esperando milagros. En su lugar, debes intentar comprender la causa del error y, por ejemplo, volver al estado funcional anterior:

![Captura de pantalla de error de prop: undefined](../../images/1/2a.png)

Es bueno recordar que en React es posible y vale la pena escribir comandos <em>console.log()</em> (que se imprimen en la consola) dentro de tu código.

También ten en cuenta que **los nombres de los componentes de React deben iniciar con mayúscula**. Si intentas definir un componente de la siguiente manera:

```js
const footer = () => {
  return (
    <div>
      greeting app created by <a href='https://github.com/mluukkai'>mluukkai</a>
    </div>
  )
}
```

y lo usas de esta manera:

```js
const App = () => {
  return (
    <div>
      <h1>Greetings</h1>
      <Hello name='Maya' age={26 + 10} />
      <footer /> // highlight-line
    </div>
  )
}
```

la página no mostrará el contenido definido dentro del componente Footer, y en su lugar React solo crea un elemento <i>footer</i> vacío. Si cambias la primera letra del nombre del componente a una letra mayúscula, React crea el elemento <i>div</i> definido en el componente Footer, que se representa en la página.

Ten en cuenta que el contenido de un componente de React (normalmente) debe contener **un elemento raíz**. Si, por ejemplo, intentamos definir el componente <i>App</i> sin el elemento <i>div</i> más externo:

```js
const App = () => {
  return (
    <h1>Greetings</h1>
    <Hello name='Maya' age={26 + 10} />
    <Footer />
  )
}
```

el resultado es un mensaje de error. 

![Captura de pantalla del error multiples elementos de raíz](../../images/1/1-vite7.png)

Usar un elemento raíz no es la única opción que funciona. Un <i>array</i> de componentes también es una solución válida: 

```js
const App = () => {
  return [
    <h1>Greetings</h1>,
    <Hello name='Maya' age={26 + 10} />,
    <Footer />
  ]
}
```

Sin embargo cuando se define el componente raíz de la aplicación esto no es algo particularmente inteligente de hacer, y hace que el código se vea un poco desagradable.

Debido a que el elemento raíz está estipulado, tenemos elementos div "extra" en el árbol DOM. Esto se puede evitar usando [fragments](https://es.legacy.reactjs.org/docs/fragments.html#short-syntax), es decir, envolviendo los elementos que el componente devolverá con un elemento vacío: 

```js
const App = () => {
  const name = 'Peter'
  const age = 10

  return (
    <>
      <h1>Greetings</h1>
      <Hello name='Maya' age={26 + 10} />
      <Hello name={name} age={age} />
      <Footer />
    </>
  )
}
```

Ahora este se compila con éxito y el DOM generado por React ya no contiene el elemento div adicional.

### No renderizar objetos

Considera una aplicación que imprime en pantalla los nombres y edades de nuestros amigos:

```js
const App = () => {
  const friends = [
    { name: 'Peter', age: 4 },
    { name: 'Maya', age: 10 },
  ]

  return (
    <div>
      <p>{friends[0]}</p>
      <p>{friends[1]}</p>
    </div>
  )
}

export default App
```

Sin embargo, nada aparece en la pantalla. He tratado de buscar el problema en el código por 15 minutos, pero no he podido encontrar cual puede ser el problema.

Finalmente recordé la promesa que hice

> <i>Prometo dejar la consola abierta todo el tiempo</i> durante este curso, y por el resto de mi vida mientras esté haciendo desarrollo web.

La consola grita en rojo:

![Consola mostrando error resaltado acerca de "Objects are not valid as a React child"](../../images/1/34new.png)

La raíz del problema es <i>Objects are not valid as a React child (Los objetos no son válidos como elementos hijos de React)</i>, es decir, la aplicación intentó renderizar <i>objetos</i> y falló nuevamente.

El código trató de renderizar la información de un amigo de la siguiente manera:

```js
<p>{friends[0]}</p>
```

y esto causó un problema porque el item a ser renderizado en las llaves es un objeto.

```js
{ name: 'Peter', age: 4 }
```

En React, las cosas individuales a ser renderizadas dentro de llaves deben ser valores primitivos, como números o cadenas.

La solución es la siguiente:

```js
const App = () => {
  const friends = [
    { name: 'Peter', age: 4 },
    { name: 'Maya', age: 10 },
  ]

  return (
    <div>
      <p>{friends[0].name} {friends[0].age}</p>
      <p>{friends[1].name} {friends[1].age}</p>
    </div>
  )
}

export default App
```

Ahora el nombre del amigo es renderizado dentro de las llaves de manera separada.

```js
{friends[0].name}
```

y la edad

```js
{friends[0].age}
```

Después de corregir el error, tu deberías limpiar los mensajes de la consola presionando el botón 🚫 y luego recargando el contenido de la página, y asegurarte de que no se están mostrando mensajes de error.

Una pequeña nota adicional a la anterior. React también permite renderizar arreglos <i>si</i> el arreglo contiene valores que son elegibles para renderizar (como números y cadenas). Así que el siguiente programa funcionaría, aunque el resultado no ser el que queremos:

```js
const App = () => {
  const friends = [ 'Peter', 'Maya']

  return (
    <div>
      <p>{friends}</p>
    </div>
  )
}
```

En esta parte, ni siquiera vale la pena intentar utilizar la renderización directa de las tablas; volveremos a ello en la siguiente parte.

</div>

<div class="tasks"> 
  <h3>Ejercicios 1.1.-1.2.</h3> 

Los ejercicios se envían a través de GitHub y marcando los ejercicios completados en el [sistema de envío ejercicios](https://studies.cs.helsinki.fi/stats/courses/fullstackopen). 

Los ejercicios se envían **una parte a la vez**. Cuando hayas enviado los ejercicios para una parte del curso, ya no podrás enviar ejercicios incompletos para la misma parte.

Ten en cuenta que en esta parte hay [más ejercicios](/es/part1/un_estado_mas_complejo_depurando_aplicaciones_react#exercises-1-6-1-14) además de los que se encuentran a continuación. <i>No envíes tu trabajo</i> hasta que hayas completado todos los ejercicios que deseas enviar para la parte.

Puedes enviar todos los ejercicios de este curso al mismo repositorio o utilizar varios repositorios. Si envías ejercicios de diferentes partes en el mismo repositorio, utiliza un esquema de nomenclatura razonable para los directorios.

Una estructura de archivos muy funcional para el repositorio de envíos es la siguiente:

```text
part0
part1
  courseinfo
  unicafe
  anecdotes
part2
  phonebook
  countries
```

Mira este [repositorio de ejemplo para el envío de ejercicios](https://github.com/fullstack-hy2020/example-submission-repository)! 

Para cada parte del curso hay un directorio, que se ramifica en directorios que contienen una serie de ejercicios, como "unicafe" para la parte 1.

La mayoría de los ejercicios del curso construyen una aplicación más grande, por ejemplo: courseinfo, unicafe y anecdotes en esta parte, poco a poco. Es suficiente con enviar la aplicación terminada. Puedes hacer un commit después de cada ejercicio, pero no es obligatorio. Por ejemplo, la aplicación de información del curso se construye en los ejercicios 1.1.-1.5. En este caso solo necesitas enviar el resultado final del ejercicio 1.5.

Por cada aplicación web para una serie de ejercicios, se recomienda enviar todos los archivos relacionados con esa aplicación, excepto para el directorio <i>node\_modules</i>.

  <h4>1.1: información del curso, paso 1</h4> 

<i>La aplicación en la que comenzaremos a trabajar en este ejercicio se desarrollará más a fondo en algunos de los siguientes ejercicios. En este y otros conjuntos de ejercicios futuros de este curso, es suficiente enviar solo el estado final de la aplicación. Si lo desea, también puedes crear un commit para cada ejercicio de la serie, pero esto es completamente opcional.</i>

Usa Vite para inicializar una nueva aplicación. Modifica <i>main.jsx</i> para que coincida con lo siguiente

```js
import ReactDOM from 'react-dom/client'

import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

y <i>App.jsx</i> para que coincida con lo siguiente

```js
const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <h1>{course}</h1>
      <p>
        {part1} {exercises1}
      </p>
      <p>
        {part2} {exercises2}
      </p>
      <p>
        {part3} {exercises3}
      </p>
      <p>Number of exercises {exercises1 + exercises2 + exercises3}</p>
    </div>
  )
}

export default App
```

y elimina los archivos adicionales App.css, y index.css, y el directorio assets. 

Desafortunadamente, toda la aplicación está en el mismo componente. Refactoriza el código para que conste de tres componentes nuevos: <i>Header</i>, <i>Content</i> y <i>Total</i>. Todos los datos aún residen en el componente <i>App</i>, que pasa los datos necesarios a cada componente mediante <i>props</i>. <i>Header</i> se encarga de representar el nombre del curso, <i>Content</i> representa las partes y su número de ejercicios y <i>Total</i> representa el número total de ejercicios.

Define los nuevos componentes en el archivo <i>App.jsx</i>.

El cuerpo del componente <i>App</i> será aproximadamente como lo siguiente:

```js
const App = () => {
  // const-definitions

  return (
    <div>
      <Header course={course} />
      <Content ... />
      <Total ... />
    </div>
  )
}
```

**ADVERTENCIA** No trates de programar todos los componentes de corrido, porque esto podría ciertamente romper toda la aplicación. Procede en pequeños pasos, primero haz por ejemplo: el componente <i>Header</i> y solo cuando confirmes que funciona, podrás continuar con el siguiente componente.

El progreso cuidadoso y en pequeños pasos puede parecer lento, pero en realidad es <i>con diferencia la forma más rápida</i> de progresar. El famoso desarrollador de software Robert "Uncle Bob" Martin ha declarado

> <i>"La única manera de ir rápido, es hacerlo bien"</i>

es decir, según Martin, avanzar con cuidado y con pequeños pasos es incluso la única manera de ser rápido.

<h4>1.2: información del curso, paso 2</h4>

Refactoriza el componente <i>Content</i> para que no muestre ningún nombre de partes o su número de ejercicios por sí mismo. En su lugar, solo representa tres componentes <i>Part</i> de los cuales cada uno representa el nombre y el número de ejercicios de una parte.

```js
const Content = ... {
  return (
    <div>
      <Part .../>
      <Part .../>
      <Part .../>
    </div>
  )
}
```

Nuestra aplicación pasa información de una manera bastante primitiva en este momento, ya que se basa en variables individuales. Esta situación mejorará pronto en la [parte 2](/es/part2), pero antes de eso, vamos a la [parte 1b](/es/part1/java_script) para aprender acerca de JavaScript.

</div>
