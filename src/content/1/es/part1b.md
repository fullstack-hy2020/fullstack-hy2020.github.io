---
mainImage: ../../../images/part-1.svg
part: 1
letter: b
lang: es
---

<div class="content">

Durante el curso, tenemos el objetivo y la necesidad de aprender una cantidad suficiente de JavaScript adicional al desarrollo web.

JavaScript ha avanzado rápidamente en los últimos años y en este curso usamos características de las versiones más nuevas. El nombre oficial del estándar JavaScript es [ECMAScript](https://es.wikipedia.org/wiki/ECMAScript). En este momento, la última versión es la lanzada en junio de 2023 con el nombre [ECMAScript® 2023](https://www.ecma-international.org/ecma-262/), también conocido como ES14.

Los navegadores aún no son compatibles con todas las funciones más nuevas de JavaScript. Debido a este hecho, una gran cantidad de código que se ejecuta en los navegadores ha sido <i>transpilado</i> de una versión más nueva de JavaScript a una versión más antigua y compatible.

Hoy en día, la forma más popular de realizar la transpilación es mediante [Babel](https://babeljs.io/). La transpilación se configura automáticamente en las aplicaciones de React creadas con Vite. Veremos más de cerca la configuración de la transpilación en la [parte 7](/es/part7) de este curso.

[Node.js](https://nodejs.org/en/) es un entorno de ejecución de JavaScript basado en el motor de JavaScript [Chrome V8](https://developers.google.com/v8/) de Google y funciona prácticamente en cualquier lugar, desde servidores hasta teléfonos móviles. Practiquemos escribir algo de JavaScript usando Node. Las últimas versiones de Node ya comprenden las últimas versiones de JavaScript, que no es necesario transpilar el código.

El código se escribe en archivos que terminan en <i>.js</i> que se ejecutan emitiendo el comando <em>node nombre\_del\_archivo.js</em>

También es posible escribir código JavaScript en la consola de Node.js, que se abre escribiendo _node_ en la línea de comandos, así como en la consola de herramientas de desarrollo del navegador. [Las revisiones más recientes de Chrome manejan las características más nuevas de JavaScript bastante bien](https://compat-table.github.io/compat-table/es2016plus/) sin transpilar el código. Alternativamente, puede utilizar una herramienta como [JS Bin](https://jsbin.com/?js,console).

JavaScript recuerda, tanto en nombre como en sintaxis, a Java. Pero cuando se trata del mecanismo central del lenguaje, no podrían ser más diferentes. Viniendo de un entorno de Java, el comportamiento de JavaScript puede parecer un poco extraño, especialmente si uno no hace el esfuerzo de buscar sus características.

En ciertos círculos también ha sido popular intentar "simular" características de Java y patrones de diseño en JavaScript. No recomendamos hacer esto ya que los lenguajes y los ecosistemas respectivos son, en última instancia, muy diferentes.

### Variables

En JavaScript, hay algunas formas de definir las variables:

```js
const x = 1
let y = 5

console.log(x, y)   // se imprime 1, 5
y += 10
console.log(x, y)   // se imprime 1, 15
y = 'sometext'
console.log(x, y)   // se imprime 1, sometext
x = 4               // provoca un error
```

[const](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/const) no define realmente una variable sino una <i>constante</i> para la cual el valor ya no se puede cambiar. Por otra parte [let](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/let) define una variable normal.

En el ejemplo anterior, también vemos que el tipo de datos asignados a la variable puede cambiar durante la ejecución. Al principio _y_ almacena un número entero y al final un string.

También es posible definir variables en JavaScript usando la palabra clave [var](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/var). var fue, durante mucho tiempo, la única forma de definir variables. const y let se agregaron recientemente en la versión ES6. En situaciones específicas, var funciona de una [diferente](https://medium.com/craft-academy/javascript-variables-should-you-use-let-var-or-const-394f7645c88f) [manera](http://www.jstips.co/en/javascript/keyword-var-vs-let/) en comparación con las definiciones de variables en la mayoría de los idiomas. Durante este curso, el uso de var es desaconsejado y debes seguir usando const y let!
Puedes encontrar más sobre este tema en YouTube, por ejemplo, [var, let y const - Qué, por qué y cómo - Características de JavaScript de ES6](https://youtu.be/sjyJBL5fkp8)

### Arrays

Un [array](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array) y un par de ejemplos de su uso: 

```js
const t = [1, -1, 3]

t.push(5)

console.log(t.length) // se imprime 4
console.log(t[1])     // se imprime -1

t.forEach(value => {
  console.log(value)  // se imprimen los números 1, -1, 3, 5 cada uno en su propia línea
})                    
```

En este ejemplo, cabe destacar el hecho de que el contenido de el array se puede modificar aunque esté definido como _const_. Como el array es un objeto, la variable siempre apunta al mismo objeto. Sin embargo, el contenido del array cambia a medida que se le agregan nuevos elementos.

Una forma de iterar a través de los elementos del array es usar _forEach_ como se ve en el ejemplo. _forEach_ recibe una <i>función</i> definida usando la sintaxis de flecha como parámetro.

```js
value => {
  console.log(value)
}
```

forEach llama a la función <i>para cada uno de los elementos del array</i>, siempre pasando el elemento individual como parámetro. La función como parámetro de forEach también puede recibir [otros parámetros](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach).

En el ejemplo anterior, se agregó un nuevo elemento al array usando el método [push](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/push). Cuando se usa React, a menudo se usan técnicas de programación funcional. Una característica del paradigma de programación funcional es el uso de estructuras de datos [inmutables](https://en.wikipedia.org/wiki/Immutable_object). En el código de React, es preferible usar el método [concat](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/concat), que no agrega el elemento al array, pero crea un nuevo array en la que se incluyen el contenido del array anterior y el nuevo elemento.

```js
const t = [1, -1, 3]

const t2 = t.concat(5) // crea un nuevo array

console.log(t)  // se imprime [1, -1, 3]
console.log(t2) // se imprime [1, -1, 3, 5]
```

La llamada al método _t.concat(5)_ no agrega un nuevo elemento al array anterior, pero devuelve un nuevo array que, además de contener los elementos del array anterior, también contiene el elemento nuevo.

Hay muchos métodos útiles definidos para arrays. Veamos un breve ejemplo del uso del método [map](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/map).

```js
const t = [1, 2, 3] 

const m1 = t.map(value => value * 2) 
console.log(m1) // se imprime [2, 4, 6]
```

Basado en el array anterior, map crea un <i>nuevo array</i>, para el cual la función dada como parámetro se usa para crear los elementos. En el caso de este ejemplo, el valor original se multiplica por dos.

Map también puede transformar el array en algo completamente diferente:

```js
const m2 = t.map(value => '<li>' + value + '</li>')
console.log(m2)  
// se imprime [ '<li>1</li>', '<li>2</li>', '<li>3</li>' ]
```

Aquí un array lleno de valores enteros se transforma en un array que contiene cadenas de HTML utilizando el método map. En la [parte 2](/es/part2) de este curso, veremos que map se usa con bastante frecuencia en React.

Los elementos individuales de un array son fáciles de asignar a variables con la ayuda de la [asignación de desestructuración](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment). 

```js
const t = [1, 2, 3, 4, 5]

const [first, second, ...rest] = t

console.log(first, second)  // se imprime 1, 2
console.log(rest)          // se imprime [3, 4 ,5]
```

Gracias a la asignación, las variables _first_ y _second_ recibirán los dos primeros enteros del array como sus valores. Los enteros restantes se "recopilan" en un array propio que luego se asigna a la variable _rest_. 

### Objetos

Hay algunas formas diferentes de definir objetos en JavaScript. Un método muy común es usar [objetos literales](https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Grammar_and_types#Object_literals), que sucede al enumerar sus propiedades entre llaves:

```js
const object1 = {
  name: 'Arto Hellas',
  age: 35,
  education: 'PhD',
}

const object2 = {
  name: 'Full Stack web application development',
  level: 'intermediate studies',
  size: 5,
}

const object3 = {
  name: {
    first: 'Dan',
    last: 'Abramov',
  },
  grades: [2, 3, 5, 3],
  department: 'Stanford University',
}
```

Los valores de las propiedades pueden ser de cualquier tipo, como enteros, strings, arrays, objetos... 

Se hace referencia a las propiedades de un objeto usando la notación "de punto", o usando corchetes:

```js
console.log(object1.name)         // se imprime Arto Hellas
const fieldName = 'age' 
console.log(object1[fieldName])    // se imprime 35
```

También puedes agregar propiedades a un objeto sobre la marcha usando notación de puntos o corchetes:

```js
object1.address = 'Helsinki'
object1['secret number'] = 12341
```

La última de las adiciones debe hacerse usando corchetes, porque cuando se usa la notación de puntos, <i>secret number</i> no es un nombre de propiedad válido debido al carácter de espacio.

Naturalmente, los objetos en JavaScript también pueden tener métodos. Sin embargo, durante este curso no es necesario definir ningún objeto con métodos propios. Es por eso que solo se discuten brevemente durante el curso.

Los objetos también se pueden definir usando las llamadas funciones de constructor, lo que da como resultado un mecanismo que recuerda a muchos otros lenguajes de programación, por ejemplo, las clases de Java. A pesar de esta similitud, JavaScript no tiene clases en el mismo sentido que los lenguajes de programación orientados a objetos. Sin embargo, ha habido una adición de la <i>sintaxis de clase</i> a partir de la versión ES6, que en algunos casos ayuda a estructurar clases orientadas a objetos.

### Funciones

Ya nos hemos familiarizado con la definición de funciones de flecha. El proceso completo, sin tomar atajos, para definir una función de flecha es el siguiente:

```js
const sum = (p1, p2) => { 
  console.log (p1) 
  console.log (p2) 
  return p1 + p2 
} 
```

y la función se llama como se puede esperar:

```js
const result = sum(1, 5)
console.log (result)
```

Si hay un solo parámetro, podemos excluir los paréntesis de la definición: 

```js
const square = p => {
  console.log(p)
  return p * p
}
```

Si la función solo contiene una expresión, entonces las llaves no son necesarias. En este caso, la función solo devuelve el resultado de su única expresión. Ahora, si eliminamos la impresión de la consola, podemos acortar aún más la definición de la función: 

```js
const square = p => p * p
```

Esta forma es particularmente útil cuando se manipulan arrays, por ejemplo, cuando se usa el método map:

```js
const t = [1, 2, 3]
const tSquared = t.map(p => p * p)
// tSquared ahora es [1, 4, 9]
```

La característica de la función de flecha se agregó a JavaScript hace solo un par de años, con la versión [ES6](http://es6-features.org/). Antes de esto, la única forma de definir funciones era usando la palabra clave _function_.

Hay dos formas de hacer referencia a la función; uno está dando un nombre en una [declaración de función](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/function).

```js
function product(a, b) {
  return a * b
}

const result = product(2, 6)
// result ahora es 12
```

La otra forma de definir la función es usando una [expresión de función](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/function). En este caso, no es necesario darle un nombre a la función y la definición puede residir entre el resto del código:

```js
const average = function(a, b) {
  return (a + b) / 2
}

const result = average(2, 5)
// result ahora es 3.5
```

Durante este curso definiremos todas las funciones usando la sintaxis de flecha.

</div> 

<div class="tasks">

  <h3>Ejercicios 1.3.-1.5.</h3>

<i>Seguimos construyendo la aplicación en la que empezamos a trabajar en los ejercicios anteriores. Puedes escribir el código en el mismo proyecto, ya que solo estamos interesados en el estado final de la aplicación enviada.</i>

**Pro-tip:** puedes tener problemas cuando se trata de la estructura de los <i>props</i> que reciben los componentes. Una buena manera de aclarar las cosas es imprimiendo los props en la consola, por ejemplo, de la siguiente manera:

```js
const Header = (props) => {
  console.log(props) // highlight-line
  return <h1>{props.course}</h1>
}
```

Sí y <i>cuando</i> recibas un mensaje de error

> <i>Objects are not valid as a React child</i>

ten en cuenta las cosas dichas [aquí](/en/part1/introduction_to_react#do-not-render-objects).

  <h4>1.3: información del curso, paso 3</h4>

Avancemos para usar objetos en nuestra aplicación. Modifica las definiciones de las variables del componente <i>App</i> de la siguiente manera y también refactoriza la aplicación para que siga funcionando:

```js
const App = () => {
  const course = 'Half Stack application development'
  const part1 = {
    name: 'Fundamentals of React',
    exercises: 10
  }
  const part2 = {
    name: 'Using props to pass data',
    exercises: 7
  }
  const part3 = {
    name: 'State of a component',
    exercises: 14
  }

  return (
    <div>
      ...
    </div>
  )
}
```

  <h4>1.4: información del curso paso 4</h4> 

Y luego coloca los objetos en un array. Modifica las definiciones de las variables de <i>App</i> de la siguiente forma y modifica las otras partes de la aplicación en respectivamente:

```js
const App = () => {
  const course = 'Half Stack application development'
  const parts = [
    {
      name: 'Fundamentals of React',
      exercises: 10
    },
    {
      name: 'Using props to pass data',
      exercises: 7
    },
    {
      name: 'State of a component',
      exercises: 14
    }
  ]

  return (
    <div>
      ...
    </div>
  )
}
```

**Nota:** en este punto <i>puedes asumir que siempre hay tres elementos</i>, por lo que no es necesario pasar por las matrices usando bucles. Volveremos al tema de la representación de componentes basados en elementos dentro de arrays con una exploración más profunda en la [siguiente parte del curso](../part2). 

Sin embargo, no pases diferentes objetos como props separados del componente <i>App</i> a los componentes <i>Content</i> y <i>Total</i>. En su lugar, pásalos directamente como una matriz:

```js
const App = () => {
  // definiciones de const

  return (
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  )
}
```

  <h4>1.5: información del curso paso 5</h4> 

Llevemos los cambios un paso más allá. Cambia el curso y sus partes a un solo objeto JavaScript. Arregla todo lo que se rompa.

```js
const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      ...
    </div>
  )
}
```

</div>

<div class="content">

### Métodos de objeto y "this"

Debido al hecho de que durante este curso estamos usando una versión de React que contiene React Hooks no tenemos necesidad de definir objetos con métodos. **El contenido de este capítulo no es relevante para el curso** pero ciertamente es bueno conocerlo en muchos sentidos. En particular, cuando se utilizan versiones anteriores de React, se deben comprender los temas de este capítulo.

Las funciones de flecha y las funciones definidas usando la palabra clave _function_ varían sustancialmente cuando se trata de cómo se comportan con respecto a la palabra clave [this](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/this), que se refiere al objeto en sí.

Podemos asignar métodos a un objeto definiendo propiedades que son funciones:

```js
const arto = {
  name: 'Arto Hellas',
  age: 35,
  education: 'PhD',
  // highlight-start
  greet: function() {
    console.log('hello, my name is ' + this.name)
  },
  // highlight-end
}

arto.greet()  // se imprime "hello, my name is Arto Hellas"
```

Los métodos se pueden asignar a los objetos incluso después de la creación del objeto:

```js
const arto = {
  name: 'Arto Hellas',
  age: 35,
  education: 'PhD',
  greet: function() {
    console.log('hello, my name is ' + this.name)
  },
}

// highlight-start
arto.growOlder = function() {
  this.age += 1
}
// highlight-end

console.log(arto.age)   // se imprime 35
arto.growOlder()
console.log(arto.age)   // se imprime 36
```

Modifiquemos ligeramente el objeto:

```js
const arto = {
  name: 'Arto Hellas',
  age: 35,
  education: 'PhD',
  greet: function() {
    console.log('hello, my name is ' + this.name)
  },
  // highlight-start
  doAddition: function(a, b) {
    console.log(a + b)
  },
  // highlight-end
}

arto.doAddition(1, 4)        // se imprime 5

const referenceToAddition = arto.doAddition
referenceToAddition(10, 15)   // se imprime 25
```

Ahora el objeto tiene el método _doAddition_ que calcula la suma de números que se le da como parámetros. El método se llama de la forma habitual, utilizando el objeto <em>arto.doAddition(1, 4)</em> o almacenando una <i>referencia de método</i> en una variable y llamando al método a través de la variable: <em>referenceToAddition(10, 15)</em>.

Si intentamos hacer lo mismo con el método _greet_ nos encontramos con un problema: 

```js
arto.greet()       // se imprime "hello, my name is Arto Hellas"

const referenceToGreet = arto.greet
referenceToGreet() // se imprime "hello, my name is undefined"
```

Al llamar al método a través de una referencia, el método pierde el conocimiento de cuál era el _this_ original. A diferencia de otros lenguajes, en JavaScript el valor de [this](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/this) se define en función de <i>cómo el método se llama</i>. Cuando se llama al método a través de una referencia, el valor de _this_ se convierte en el llamado [objeto global](https://developer.mozilla.org/es/docs/Glossary/Global_object) y el resultado final a menudo no es lo que el desarrollador de software había previsto originalmente.

Perder la pista de _this_ al escribir código JavaScript genera algunos problemas potenciales. A menudo surgen situaciones en las que React o Node (o más específicamente el motor JavaScript del navegador web) necesita llamar a algún método en un objeto que el desarrollador ha definido. Sin embargo, en este curso evitamos estos problemas mediante el uso de JavaScript "this-less". 

Una situación que lleva a la "desaparición" de _this_ surge cuando establecemos un tiempo de espera para llamar a la función _greet_ en el objeto _arto_, usando la función [setTimeout](https://developer.mozilla.org/es/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout).

```js
const arto = {
  name: 'Arto Hellas',
  greet: function() {
    console.log('hello, my name is ' + this.name)
  },
}

setTimeout(arto.greet, 1000)  // highlight-line
```

Como se mencionó, el valor de _this_ en JavaScript se define en función de cómo se llama al método. Cuando <em>setTimeout</em> llama al método, es el motor JavaScript el que realmente llama al método y, en ese punto, _this_ se refiere al objeto global. 

Existen varios mecanismos mediante los cuales se puede conservar el _this_ original. Uno de ellos es usar un método llamado [bind](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Function/bind): 

```js
setTimeout(arto.greet.bind(arto), 1000)
```

Al llamar a <em>arto.greet.bind(arto)</em> se crea una nueva función donde _this_ está obligado a apuntar a Arto, independientemente de dónde y cómo se llame al método.

Usando [funciones de flecha](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Functions/Arrow_functions) es posible resolver algunos de los problemas relacionados con _this_. Sin embargo, no deben usarse como métodos para objetos porque entonces _this_ no funciona en absoluto. Más adelante volveremos al comportamiento de _this_ en relación con las funciones de flecha. 

Si deseas obtener una mejor comprensión de cómo funciona _this_ en JavaScript, Internet está lleno de material sobre el tema, por ejemplo, la serie de screencasts [Comprender la palabra clave this de JavaScript en profundidad](https://egghead.io/courses/understand-javascript-s-this-keyword-in-depth) de [egghead.io](https://egghead.io) es muy recomendable.

### Clases

Como se mencionó anteriormente, no existe un mecanismo de clase como los de los lenguajes de programación orientados a objetos. Sin embargo, hay características en JavaScript que hacen posible "simular" [clases](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) orientadas a objetos.

Echemos un vistazo rápido a la <i>sintaxis de clase</i> que se introdujo en JavaScript con ES6, que simplifica sustancialmente la definición de clases (o cosas similares a clases) en JavaScript.

En el siguiente ejemplo definimos una "clase" llamada Person y dos objetos Person:

```js
class Person {
  constructor(name, age) {
    this.name = name
    this.age = age
  }
  greet() {
    console.log('hello, my name is ' + this.name)
  }
}

const adam = new Person('Adam Ondra', 29)
adam.greet()

const janja = new Person('Janja Garnbret', 23)
janja.greet()
```

Cuando se trata de sintaxis, las clases y los objetos creados a partir de ellos recuerdan mucho a las clases y objetos de Java. Su comportamiento también es bastante similar al de los objetos Java. En el núcleo, siguen siendo objetos basados en la [herencia prototípica](https://developer.mozilla.org/es/docs/Learn/JavaScript/Objects/Inheritance) de JavaScript. El tipo de ambos objetos es en realidad _Object_, ya que JavaScript esencialmente solo define los tipos [Boolean, Null, Undefined, Number, String, Symbol, BigInt y Object](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures).

La introducción de la sintaxis de clases fue una adición controvertida. Consulte [No es impresionante: clases de ES6](https://github.com/petsel/not-awesome-es6-classes) o [¿Es la "clase" en ES6 la nueva parte "mala"?](Https://medium.com/@rajaraodv/is-class-in-es6-the-new-bad-part-6c4e6fe1ee65) para obtener más detalles.

La sintaxis de la clase ES6 se usa mucho en React "antiguo" y también en Node.js, por lo que comprenderlo es beneficioso incluso en este curso. Sin embargo, dado que estamos usando la nueva función [Hooks](https://es.legacy.reactjs.org/docs/hooks-intro.html) de React a lo largo de este curso, no tenemos un uso concreto para la sintaxis de clases de JavaScripts.

### Materiales JavaScript

Existen guías buenas y malas para JavaScript en Internet. La mayoría de los enlaces en esta página relacionados con de características de JavaScript se refieren a la [Guía de JavaScript de Mozilla](https://developer.mozilla.org/es/docs/Web/JavaScript).

Te recomendamos leer inmediatamente [Una reintroducción a JavaScript (tutorial de JS)](https://developer.mozilla.org/es/docs/Web/JavaScript/A_re-introduction_to_JavaScript) en el sitio web de Mozilla.

Si deseas conocer JavaScript en profundidad, hay una gran serie de libros gratuitos en Internet llamada [You-Dont-Know-JS](https://github.com/getify/You-Dont-Know-JS).

Otro gran recurso para aprender JavaScript es [javascript.info](https://es.javascript.info/).

El libro gratuito [Eloquent JavaScript](https://eloquentjavascript.net) te lleva desde los conceptos básicos hasta temas interesantes rápidamente. Es una mezcla de teoría, proyectos y ejercicios, y abarca tanto la teoría general de programación como el lenguaje JavaScript.

[Namaste 🙏 JavaScript](https://www.youtube.com/playlist?list=PLlasXeu85E9cQ32gLCvAvr9vNaUccPVNP) es otro excelente y altamente recomendado tutorial gratuito de JavaScript para entender cómo funciona JS bajo el capó. Namaste JavaScript es un curso puro y en profundidad de JavaScript lanzado de forma gratuita en YouTube. Cubrirá en detalle los conceptos fundamentales de JavaScript y todo acerca de cómo JS funciona detrás de escena dentro del motor de JavaScript.

[egghead.io](https://egghead.io) tiene muchos screencasts de calidad sobre JavaScript, React y otros temas interesantes. Desafortunadamente, parte del material está detrás de un muro de pago.

</div>
