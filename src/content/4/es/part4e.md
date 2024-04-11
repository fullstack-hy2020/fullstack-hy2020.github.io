---
mainImage: ../../../images/part-4.svg
part: 4
letter: e
lang: en
---

<div class="tasks">

**Este es el contenido antiguo (anterior al 13 de febrero de 2024) sobre pruebas que utiliza Jest como librería de pruebas.** Puedes continuar utilizando este material si ya has comenzado a escribir pruebas con Jest. En otro caso, deberías ignorar esta página.


</div>

<div class="content">

### Testing de aplicaciones Node

Hemos descuidado por completo un área esencial del desarrollo de software, y es la prueba automatizada.

Comencemos nuestro viaje de prueba mirando las pruebas unitarias. La lógica de nuestra aplicación es tan simple, que no hay mucho que tenga sentido probar con pruebas unitarias. Creemos un nuevo archivo <i>utils/for_testing.js</i> y escribamos un par de funciones simples que podamos usar para practicar escribir pruebas:

```js
const reverse = (string) => {
  return string
    .split('')
    .reverse()
    .join('')
}

const average = (array) => {
  const reducer = (sum, item) => {
    return sum + item
  }

  return array.reduce(reducer, 0) / array.length
}

module.exports = {
  reverse,
  average,
}
```

> La función _average_ usa el método de array [reduce](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce). Si el método aún no te resulta familiar, ahora es un buen momento para ver los primeros tres videos de la serie [Functional Javascript](https://www.youtube.com/watch?v=BMUiFMZr7vk&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84) en Youtube.

Hay un gran número de librerías de pruebas, o <i>test runners</i>, disponibles para JavaScript.
El antiguo rey de las librerías de pruebas es [Mocha](https://mochajs.org/), que fue reemplazado hace unos años por [Jest](https://jestjs.io/). Un recién llegado a las librerías es [Vitest](https://vitest.dev/), que se presenta como una nueva generación de librerías de pruebas.

Hoy en día, Node también tiene una librería de pruebas integrada [node:test](https://nodejs.org/docs/latest/api/test.html), que se adapta bien a las necesidades del curso.

Definamos el <i>script npm _test_</i> para ejecutar pruebas:

```bash
{
  //...
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "build:ui": "rm -rf build && cd ../frontend/ && npm run build && cp -r build ../backend",
    "deploy": "fly deploy",
    "deploy:full": "npm run build:ui && npm run deploy",
    "logs:prod": "fly logs",
    "lint": "eslint .",
    "test": "node --test" // highlight-line
  },
  //...
}
```

Creemos un directorio separado para nuestras pruebas llamado <i>tests</i> y creemos un nuevo archivo llamado <i>reverse.test.js</i> con el siguiente contenido:

```js
const { test } = require('node:test')
const assert = require('node:assert')

const reverse = require('../utils/for_testing').reverse

test('reverse of a', () => {
  const result = reverse('a')

  assert.strictEqual(result, 'a')
})

test('reverse of react', () => {
  const result = reverse('react')

  assert.strictEqual(result, 'tcaer')
})

test('reverse of saippuakauppias', () => {
  const result = reverse('saippuakauppias')

  assert.strictEqual(result, 'saippuakauppias')
})
```

En la primera linea, el archivo de prueba importa la función a ser probada y la asigna a una variable llamada _reverse_:

La prueba define la palabra clave _test_ y la librería [assert](https://nodejs.org/docs/latest/api/assert.html), que es utilizada por las pruebas para verificar los resultados de las funciones bajo prueba.

En la siguiente fila, el archivo de prueba importa la función a ser probada y la asigna a una variable llamada _reverse_:

```js
const reverse = require('../utils/for_testing').reverse
```

Los casos de prueba individual se definen con la función _test_. El primer parámetro de la función es la descripción de la prueba como una cadena. El segundo parámetro es una <i>función</i>, que define la funcionalidad para el caso de prueba. La funcionalidad para el segundo caso de prueba se ve así:

```js
() => {
  const result = reverse('react')

  assert.strictEqual(result, 'tcaer')
}
```

Primero, ejecutamos el código que se va a probar, es decir, generamos un reverso para el string <i>react</i>. Luego, verificamos los resultados con el método [strictEqual](https://nodejs.org/docs/latest/api/assert.html#assertstrictequalactual-expected-message) de la librería [assert](https://nodejs.org/docs/latest/api/assert.html).

Como se esperaba, todas las pruebas pasan:

![salida de terminal para npm test con todas las pruebas pasando](../../images/4/1new.png)

La librería node:test espera por defecto que los nombres de los archivos de prueba contengan <i>.test</i>. En este curso, seguiremos la convención de nombrar nuestros archivos de prueba con la extensión <i>.test.js</i>.

Vamos a romper el test:

```js
test('reverse of react', () => {
  const result = reverse('react')

  assert.strictEqual(result, 'tkaer')
})
```

Ejecutar esta prueba da como resultado el siguiente mensaje de error:

![salida de terminal muestra error de npm test](../../images/4/2new.png)

Pongamos las pruebas para la función _average_, en un nuevo archivo llamado <i>tests/average.test.js</i>.

```js
const { test, describe } = require('node:test')

// ...

const average = require('../utils/for_testing').average

describe('average', () => {
  test('of one value is the value itself', () => {
    assert.strictEqual(average([1]), 1)
  })

  test('of many is calculated right', () => {
    assert.strictEqual(average([1, 2, 3, 4, 5, 6]), 3.5)
  })

  test('of empty array is zero', () => {
    assert.strictEqual(average([]), 0)
  })
})
```

La prueba revela que la función no funciona correctamente con un array vacío (esto se debe a que en JavaScript dividir por cero da como resultado <i>NaN</i>)

![salida de terminal mostrando array vacío falla](../../images/4/3new.png)

Arreglar la función es bastante fácil: 

```js
const average = array => {
  const reducer = (sum, item) => {
    return sum + item
  }

  return array.length === 0
    ? 0
    : array.reduce(reducer, 0) / array.length
}
```

Si la longitud del array es 0, devolvemos 0, y en todos los demás casos usamos el método _reduce_ para calcular el promedio.

Hay algunas cosas a tener en cuenta sobre las pruebas que acabamos de escribir. Definimos un bloque <i>describe</i> alrededor de las pruebas al que se le dio el nombre _average_:

```js
describe('average', () => {
  // tests
})
```

Se pueden usar bloques de descripción para agrupar pruebas en colecciones lógicas. La salida de prueba también usa el nombre del bloque describe:

![npm test mostrando bloques describe](../../images/4/4new.png)

Como veremos más adelante, los bloques <i>describe</i> son necesarios cuando queremos ejecutar algunas operaciones de instalación o desmontaje compartidas para un grupo de pruebas.

Otra cosa a tener en cuenta es que escribimos las pruebas de una manera bastante compacta, sin asignar la salida de la función que se está probando a una variable:

```js
test('of empty array is zero', () => {
  assert.strictEqual(average([]), 0)
})
```

</div>

<div class="tasks">

### Ejercicios 4.3.-4.7.

Creemos una colección de funciones auxiliares que estén destinadas a trabajar con las secciones describe de la lista de blogs. Crea las funciones en un archivo llamado <i>utils/list_helper.js</i>. Escribe tus pruebas en un archivo de prueba con el nombre apropiado en el directorio <i>tests</i>.

#### 4.3: Funciones Auxiliares y Pruebas Unitarias, paso 1

Primero define una función _dummy_ que reciba un array de publicaciones de blog como parámetro y siempre devuelva el valor 1. El contenido del archivo <i>list_helper.js</i> en este punto debe ser el siguiente:

```js
const dummy = (blogs) => {
  // ...
}

module.exports = {
  dummy
}
```

Verifica que tu configuración de prueba funcione con la siguiente prueba:

```js
const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})
```

#### 4.4: Funciones Auxiliares y Pruebas Unitarias, paso 2

Define una nueva función _totalLikes_ que recibe una lista de publicaciones de blogs como parámetro. La función devuelve la suma total de <i>likes</i> en todas las publicaciones del blog.

Escribe pruebas apropiadas para la función. Se recomienda poner las pruebas dentro de un bloque <i>describe</i>, para que la salida del informe de prueba se agrupe bien:

![npm test pasando para list_helper_test](../../images/4/5.png)

Definir datos de prueba para la función se puede hacer así:

```js
describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })
})
```

Si definir tu propia lista de datos de prueba de blogs es demasiado trabajo, puedes usar la lista ya hecha [aquí](https://github.com/fullstack-hy2020/misc/blob/master/blogs_for_test.md).

Es probable que tengas problemas al escribir pruebas. Recuerda las cosas que aprendimos sobre [depuración](/es/part3/guardando_datos_en_mongo_db#depuracion-en-aplicaciones-de-node) en la parte 3. Puedes imprimir cosas en la consola con _console.log_ incluso durante la ejecución de la prueba.

#### 4.5*: Funciones Auxiliares y Pruebas Unitarias, paso 3

Define una nueva función _favoriteBlog_ que recibe una lista de blogs como parámetro. La función descubre qué blog tiene más me gusta. Si hay muchos favoritos, basta con devolver uno de ellos.

El valor devuelto por la función podría tener el siguiente formato:

```js
{
  title: "Canonical string reduction",
  author: "Edsger W. Dijkstra",
  likes: 12
}
```

**NB** cuando estás comparando objetos, el método [deepStrictEqual](https://nodejs.org/api/assert.html#assertdeepstrictequalactual-expected-message) es probablemente lo que debas usar, [strictEqual](https://nodejs.org/api/assert.html#assertstrictequalactual-expected-message) intenta verificar que los dos valores sean el mismo valor, y no solo que contengan las mismas propiedades. Por diferencias entre varios módulos de aserción de funciones, puedes referirte a [esta respuesta Stack Overflow](https://stackoverflow.com/a/73937068/15291501).

Escribe las pruebas para este ejercicio dentro de un nuevo bloque <i>describe</i>. Haz lo mismo con los ejercicios restantes también.

#### 4.6*: Funciones Auxiliares y Pruebas Unitarias, paso 4

Este y el siguiente ejercicio son un poco más desafiantes. No es necesario completar estos dos ejercicios para avanzar en el material del curso, por lo que puede ser una buena idea volver a estos una vez que haya terminado de leer el material de esta parte en su totalidad.

Se puede terminar este ejercicio sin el uso de librerías adicionales. Sin embargo, este ejercicio es una gran oportunidad para aprender a usar la librería [Lodash](https://lodash.com/).

Define una función llamada _mostBlogs_ que reciba una lista de blogs como parámetro. La función devuelve el <i>author</i> que tiene la mayor cantidad de blogs. El valor de retorno también contiene el número de blogs que tiene el autor principal:

```js
{
  author: "Robert C. Martin",
  blogs: 3
}
```

Si hay muchos blogueros importantes, entonces es suficiente con devolver uno de ellos.

#### 4.7*: Funciones Auxiliares y Pruebas Unitarias, paso 5

Define una función llamada _mostLikes_ que reciba una lista de blogs como parámetro. La función devuelve el autor, cuyas publicaciones de blog tienen la mayor cantidad de me gusta. El valor de retorno también contiene el número total de likes que el autor ha recibido:

```js
{
  author: "Edsger W. Dijkstra",
  likes: 17
}
```

Si hay muchos bloggers importantes, entonces es suficiente para mostrar cualquiera de ellos.

</div>


</div>
