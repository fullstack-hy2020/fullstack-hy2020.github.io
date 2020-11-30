---
mainImage: ../../../images/part-4.svg
part: 4
letter: a
lang: es
--- 

<div class="content">


Continuemos nuestro trabajo en el backend del aplicación de notas que comenzamos en [parte 3](/es/part3).


### Estructura del proyecto

Antes de pasar al tema de las pruebas, modificaremos la estructura de nuestro proyecto para cumplir con las mejores prácticas de Node.js. 

Después de realizar los cambios en la estructura de directorios de nuestro proyecto, terminamos con la siguiente estructura: 

```bash
├── index.js
├── app.js
├── build
│   └── ...
├── controllers
│   └── notes.js
├── models
│   └── note.js
├── package-lock.json
├── package.json
├── utils
│   ├── config.js
│   ├── logger.js
│   └── middleware.js  
```

<!-- Olemme toistaiseksi tulostelleet koodista erilaista logaustietoa komennoilla <i> consola. log </i> ja <i> consola.error </i>, tämä ei ole kovin järkevä käytäntö. Eristetään kaikki konsoliin tulostelu omaan moduliinsa <i> utils / logger.js </i>: -->
Hasta ahora hemos estado usando <i>console.log</i> y <i>console.error</i> para imprimir información diferente del código.
Sin embargo, esta no es una buena forma de hacer las cosas.
Separemos todas las impresiones a la consola en su propio módulo <i>utils/logger.js</i>:

```js
const info = (...params) => {
  console.log(...params)
}

const error = (...params) => {
  console.error(...params)
}

module.exports = {
  info, error
}
```

<!-- Loggeri tarjoaa kaksi funktiota, normaalien logiviesteihin tarkoitetun funktion _info_ sekä virhetilanteisiin tarkoitetun funktion _error_. -->
El logger tiene dos funciones, __info__ para imprimir mensajes de registro normales y __error__ para todos los mensajes de error.

Extraer registros en su propio módulo es una buena idea en más de un sentido. Si quisiéramos comenzar a escribir registros en un archivo o enviarlos a un servicio de registro externo como [graylog](https://www.graylog.org/) o [papertrail](https://papertrailapp.com) solo tendríamos que hacer cambios en un solo lugar.

El contenido del archivo <i>index.js</i> utilizado para iniciar la aplicación se simplifica de la siguiente manera:

```js
const app = require('./app') // la aplicación Express real
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')

const server = http.createServer(app)

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
```

El archivo <i>index.js</i> solo importa la aplicación real desde el archivo <i>app.js</i> y luego inicia la aplicación. La función _info_ del módulo de registro se utiliza para la impresión de la consola que indica que la aplicación se está ejecutando.

El manejo de las variables de entorno se extrae en un archivo <i>utils/config.js</i> separado:

```js
require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI

module.exports = {
  MONGODB_URI,
  PORT
}
```

Las otras partes de la aplicación pueden acceder a las variables de entorno importando el módulo de configuración:

```js
const config = require('./utils/config')

logger.info(`Server running on port ${config.PORT}`)
```

Los controladores de ruta también se han movido a un módulo dedicado. Los controladores de eventos de las rutas se conocen comúnmente como <i>controladores</i>, y por esta razón hemos creado un nuevo directorio de <i>controllers</i>. Todas las rutas relacionadas con las notas están ahora en el módulo <i>notes.js</i> bajo el directorio <i>controllers</i>.

El contenido del módulo <i>notes.js</i> es el siguiente:

```js
const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

notesRouter.get('/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

notesRouter.post('/', (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date()
  })

  note.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => next(error))
})

notesRouter.delete('/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

notesRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

module.exports = notesRouter
```

Esto es casi una copia y pegado exacta de nuestro archivo <i>index.js</i> anterior.

Sin embargo, hay algunos cambios importantes. Al principio del archivo, creamos un nuevo objeto [router](http://expressjs.com/en/api.html#router):

```js
const notesRouter = require('express').Router()

//...

module.exports = notesRouter
```

El módulo exporta el enrutador para que esté disponible para todos los consumidores del módulo.

Todas las rutas están ahora definidas para el objeto enrutador, de manera similar a lo que habíamos hecho anteriormente con el objeto que representa la aplicación completa.

Vale la pena señalar que los caminos en los controladores de ruta se han acortado. En la versión anterior, teníamos:

```js
app.delete('/api/notes/:id', (request, response) => {
```

Y en la versión actual, tenemos:

```js
notesRouter.delete('/:id', (request, response) => {
```

Entonces , ¿qué son exactamente estos objetos de enrutador? El manual Express proporciona la siguiente explicación:

> <i>Un objeto de enrutador es un instancia aislada de middleware y rutas. Puede pensar en ella como una "mini-aplicación", capaz solo de realizar funciones de middleware y enrutamiento. Cada aplicación Express tiene un enrutador de aplicación incorporado.</i>

El enrutador es de hecho un <i>middleware</i>, que se puede utilizar para definir "rutas relacionadas" en un solo lugar, que normalmente se coloca en su propio módulo.

El archivo <i>app.js</i> que crea la aplicación real , toma el enrutador como se muestra a continuación:

```js
const notesRouter = require('./controllers/notes')
app.use('/api/notes', notesRouter)
```

El enrutador que definimos anteriormente se usa <i>si</i> la URL de la solicitud comienza con <i>/api/notes</i>. Por esta razón, el objeto notesRouter solo debe definir las partes relativas de las rutas, es decir, la ruta vacía <i>/</i> o solo el parámetro <i>/:id</i>.

Después de realizar estos cambios, nuestro archivo <i>app.js</i> se ve así:

```js
const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const notesRouter = require('./controllers/notes')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
```

El archivo utiliza un middleware diferente, y uno de ellos es el <i>notesRouter</i> que se adjunta a la ruta <i>/api/notes</i>.

Nuestro middleware personalizado se ha movido a un nuevo módulo <i>utils/middleware.js</i>:

```js
const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}
```

La responsabilidad de establecer la conexión con la base de datos se ha entregado al módulo <i>app.js</i>. El archivo <i>note.js</i> del directorio <i>models</i> solo define el esquema de Mongoose para las notas.

```js
const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 5
  },
  date: {
    type: Date,
    required: true,
  },
  important: Boolean,
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema)
```

Para recapitular, la estructura del directorio se ve así después de que se hayan realizado los cambios:

```bash
├── index.js
├── app.js
├── build
│   └── ...
├── controllers
│   └── notes.js
├── models
│   └── note.js
├── package-lock.json
├── package.json
├── utils
│   ├── config.js
│   ├── logger.js
│   └── middleware.js  
```

Para aplicaciones más pequeñas, la estructura no importa mucho. Una vez que la aplicación comienza a crecer en tamaño, tendrá que establecer algún tipo de estructura y separar las diferentes responsabilidades de la aplicación en módulos separados. Esto facilitará mucho el desarrollo de la aplicación.

No existe una estructura de directorio estricta o una convención de nomenclatura de archivos que se requiera para las aplicaciones Express. Para contrastar esto, Ruby on Rails requiere una estructura específica. Nuestra estructura actual simplemente sigue algunas de las mejores prácticas que puede encontrar en Internet.

Puede encontrar el código para nuestra aplicación actual en su totalidad en la rama <i>part4-1</i> de [este repositorio de Github](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-1).

Si clona el proyecto usted mismo, ejecute el comando _npm install_ antes de iniciar la aplicación con _npm start_.

</div> 

<div class="tasks">

### Ejercicios 4.1.-4.2.

En los ejercicios de esta parte, crearemos una <i>aplicación de lista de blogs</i>, que permite a los usuarios guardar información sobre blogs interesantes con los que se han encontrado en Internet. Para cada blog listado, guardaremos el autor, el título, la URL y la cantidad de votos positivos de los usuarios de la aplicación.

#### 4.1 Lista de blogs, paso 1

Imaginemos una situación en la que recibe un correo electrónico que contiene el siguiente cuerpo de la aplicación: 

```js
const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

const mongoUrl = 'mongodb://localhost/bloglist'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

app.use(cors())
app.use(express.json())

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

Convierte la aplicación en un proyecto <i>npm</i>. Para mantener su desarrollo productivo, configure la aplicación para que se ejecute con <i>nodemon</i>. Puede crear una nueva base de datos para su aplicación con MongoDB Atlas, o usar la misma base de datos de los ejercicios de la parte anterior.

Verifique que sea posible agregar blogs a la lista con Postman o el cliente REST de VS Code y que la aplicación devuelva los blogs agregados en el endpoint correcto.

#### 4.2 Lista de blogs, paso 2

Refactorice la aplicación en módulos separados como se mostró anteriormente en esta parte del material del curso.


**NB** refactorice su aplicación en pequeños pasos y verifique que la aplicación funcione después de cada cambio que realice. Si intentas tomar un "atajo" refactorizando muchas cosas a la vez, entonces [la ley de Murphy](https://en.wikipedia.org/wiki/Murphy%27s_law) se activará y es casi seguro que algo se romperá. en su aplicación. El "atajo" terminará tomando más tiempo que avanzar lenta y sistemáticamente.

Una de las mejores prácticas es hacer commit de su código cada vez que esté en un estado estable. Esto facilita la reversión a una situación en la que la aplicación aún funciona.

</div>

<div class="content">


### Testing de aplicaciones Node

Hemos descuidado por completo un área esencial del desarrollo de software, y es la prueba automatizada.

Comencemos nuestro viaje de prueba mirando las pruebas unitarias. La lógica de nuestra aplicación es tan simple, que no hay mucho que tenga sentido para probar con pruebas unitarias. Creemos un nuevo archivo <i>utils/for_testing.js</i> y escribamos un par de funciones simples que podamos usar para la práctica de escritura de prueba:

```js
const palindrome = (string) => {
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
  palindrome,
  average,
}
```

> La función _average_ usa el método array [reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce). Si el método aún no le resulta familiar, ahora es un buen momento para ver los primeros tres videos de la serie [Functional Javascript](https://www.youtube.com/watch?v=BMUiFMZr7vk&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84) en Youtube.

Hay muchas bibliotecas de prueba diferentes o <i>ejecutores de prueba</i> disponibles para JavaScript. En este curso utilizaremos una biblioteca de prueba desarrollada y utilizada internamente por Facebook llamada [jest](https://jestjs.io/), que se asemeja al rey anterior de las bibliotecas de prueba de JavaScript [Mocha](https://mochajs.org/). Existen otras alternativas, como [ava](https://github.com/avajs/ava) que ha ganado popularidad en algunos círculos.

Jest es una opción natural para este curso, ya que funciona bien para probar backends y brilla cuando se trata de probar aplicaciones React.

> <i>**Usuarios de Windows:**</i> Jest puede no funcionar si la ruta del directorio del proyecto contiene un directorio que tiene espacios en su nombre.

Dado que las pruebas solo se ejecutan durante el desarrollo de nuestra aplicación, instalaremos <i>jest</i> como una dependencia de desarrollo con el comando:

```bash
npm install --save-dev jest
```

Definamos el <i>npm script _test_</i> para ejecutar pruebas con Jest y para informar sobre la ejecución de la prueba con el estilo <i>detallado</i>:

```bash
{
  //...
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "build:ui": "rm -rf build && cd ../../../2/luento/notes && npm run build && cp -r build ../../../3/luento/notes-backend",
    "deploy": "git push heroku master",
    "deploy:full": "npm run build:ui && git add . && git commit -m uibuild && git push && npm run deploy",
    "logs:prod": "heroku logs --tail",
    "lint": "eslint .",
    "test": "jest --verbose" // highlight-line
  },
  //...
}
```

Jest requiere que uno especifique que el entorno de ejecución es Node. Esto se puede hacer agregando lo siguiente al final de <i>package.json</i>:

```js
{
 //...
 "jest": {
   "testEnvironment": "node"
 }
}
```

Alternativamente, Jest puede buscar un archivo de configuración con el nombre predeterminado <i>jest.config.js</i>, donde podemos definir el entorno de ejecución así:

```js
module.exports = {
  testEnvironment: 'node',
};
```

Creemos un directorio separado para nuestras pruebas llamado <i>tests</i> y creemos un nuevo archivo llamado <i>palindrome.test.js</i> con el siguiente contenido:

```js
const palindrome = require('../utils/for_testing').palindrome

test('palindrome of a', () => {
  const result = palindrome('a')

  expect(result).toBe('a')
})

test('palindrome of react', () => {
  const result = palindrome('react')

  expect(result).toBe('tcaer')
})

test('palindrome of releveler', () => {
  const result = palindrome('releveler')

  expect(result).toBe('releveler')
})
```

La configuración de ESLint que agregamos al proyecto en la parte anterior se queja de los comandos _test_ y _expect_ en nuestro archivo de prueba, ya que la configuración no permite <i>globals</i>. Eliminemos las quejas agregando <i>"jest": true</i> a la propiedad <i>env</i> en el archivo <i>.eslintrc.js</i>.

```js
module.exports = {
  "env": {
    "commonjs": true 
    "es6": true,
    "node": true,
    "jest": true, // highlight-line
  },
  "extends": "eslint:recommended",
  "rules": {
    // ...
  },
};
```

En la primera fila, el archivo de prueba importa la función a ser probada y la asigna a una variable llamada _palindrome_:

```js
const palindrome = require('../utils/for_testing').palindrome
```

Los casos de prueba individual se definen con la función _test_. El primer parámetro de la función es la descripción de la prueba como una cadena. El segundo parámetro es una <i>función</i>, que define la funcionalidad para el caso de prueba. La funcionalidad para el segundo caso de prueba se ve así:

```js
() => {
  const result = palindrome('react')

  expect(result).toBe('tcaer')
}
```

Primero ejecutamos el código a probar, lo que significa que generamos un palíndromo para la cadena <i>react</i>. A continuación, verificamos los resultados con la función [expect](https://facebook.github.io/jest/docs/en/expect.html#content). Expect envuelve el valor resultante en un objeto que ofrece una colección de funciones <i>matcher</i>, que pueden usarse para verificar la exactitud del resultado. Dado que en este caso de prueba estamos comparando dos cadenas, podemos usar el comparador [toBe](https://facebook.github.io/jest/docs/en/expect.html#tobevalue).

Como se esperaba, todas las pruebas pasan:

![](../../images/4/1.png)

Jest espera por defecto que los nombres de los archivos de prueba contengan <i>.test</i>. En este curso, seguiremos la convención de nombrar nuestros archivos de prueba con la extensión <i>.test.js</i>.

Jest tiene excelentes mensajes de error, rompamos la prueba para demostrar esto:

```js
test('palindrom of react', () => {
  const result = palindrome('react')

  expect(result).toBe('tkaer')
})
```

Ejecutar las pruebas anteriores da como resultado el siguiente mensaje de error:

![](../../images/4/2e.png)

Agreguemos algunas pruebas para la función _average_, en un nuevo archivo <i>tests/average.test.js</i>.

```js
const average = require('../utils/for_testing').average

describe('average', () => {
  test('of one value is the value itself', () => {
    expect(average([1])).toBe(1)
  })

  test('of many is calculated right', () => {
    expect(average([1, 2, 3, 4, 5, 6])).toBe(3.5)
  })

  test('of empty array is zero', () => {
    expect(average([])).toBe(0)
  })
})
```

La prueba revela que la función no funciona correctamente con una matriz vacía (esto se debe a que en JavaScript dividir por cero da como resultado <i>NaN</i>)

![](../../images/4/3.png)

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

Si la longitud de la matriz es 0, devolvemos 0, y en todos los demás casos usamos el método _reduce_ para calcular el promedio.

Hay algunas cosas a tener en cuenta sobre las pruebas que acabamos de escribir. Definimos un bloque <i>describe</i> alrededor de las pruebas al que se le dio el nombre _average_:

```js
describe('average', () => {
  // tests
})
```

Se pueden usar bloques de descripción para agrupar pruebas en colecciones lógicas. La salida de prueba de Jest también usa el nombre del bloque describe:

![](../../images/4/4.png)

Como veremos más adelante, los bloques <i>describe</i> son necesarios cuando queremos ejecutar algunas operaciones de instalación o desmontaje compartidas para un grupo de pruebas.

Otra cosa a tener en cuenta es que escribimos las pruebas de una manera bastante compacta, sin asignar la salida de la función que se está probando a una variable:

```js
test('of empty array is zero', () => {
  expect(average([])).toBe(0)
})
```

</div>

<div class="tasks">

### Ejercicios 4.3.-4.7.

Creemos una colección de funciones auxiliares que están destinadas a ayudar a lidiar con la lista de blogs. Cree las funciones en un archivo llamado <i>utils/list_helper.js</i>. Escriba sus pruebas en un archivo de prueba con el nombre apropiado en el directorio <i>tests</i>.

#### 4.3: funciones auxiliares y pruebas unitarias, paso 1

Primero defina una función _dummy_ que reciba una matriz de publicaciones de blog como parámetro y siempre devuelva el valor 1. El contenido del archivo <i>list_helper.js</i> en este punto debe ser el siguiente:

```js
const dummy = (blogs) => {
  // ...
}

module.exports = {
  dummy
}
```

Verifique que su configuración de prueba funcione con la siguiente prueba:

```js
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})
```

#### 4.4: funciones auxiliares y pruebas unitarias, paso 2

Defina una nueva función _totalLikes_ que reciba una lista de publicaciones de blog como parámetro. La función devuelve la suma total de <i>likes</i> en todas las publicaciones del blog.

Escribe pruebas apropiadas para la función. Se recomienda poner las pruebas dentro de un bloque <i>describe</i>, para que la salida del informe de prueba se agrupe bien:

![](../../images/4/5.png)

Definir entradas de prueba para la función se puede hacer así:

```js
describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })
})
```

Si definir su propia lista de entrada de prueba de blogs es demasiado trabajo, puede usar la lista ya hecha [aquí](https://github.com/fullstack-hy2020/misc/blob/master/blogs_for_test.md).

Es probable que tenga problemas al escribir pruebas. Recuerde las cosas que aprendimos sobre [depuración](/es/part3/save_data_to_mongo_db#debugging-node-applications) en la parte 3. Puede imprimir cosas en la consola con _console.log_ incluso durante la ejecución de la prueba. Incluso es posible usar el depurador mientras se ejecutan las pruebas, puede encontrar instrucciones para eso [aquí](https://jestjs.io/docs/en/troubleshooting). 

**NB:** si alguna prueba falla, entonces se recomienda ejecutar solo esa prueba mientras está solucionando el problema. Puede ejecutar una única prueba con el método [only](https://facebook.github.io/jest/docs/en/api.html#testonlyname-fn-timeout).


Otra forma de ejecutar una sola prueba (o bloque de descripción) es especificar el nombre de la prueba que se ejecutará con la marca [-t](https://jestjs.io/docs/en/cli.html):

```js
npm test -- -t 'when list has only one blog, equals the likes of that'
```

#### 4.5*: funciones auxiliares y pruebas unitarias, paso 3

Define una nueva función _favoriteBlog_ que recibe una lista de blogs como parámetro. La función descubre qué blog tiene más likes. Si hay muchos favoritos, basta con devolver uno de ellos.

El valor devuelto por la función podría tener el siguiente formato:

```js
{
  title: "Canonical string reduction",
  author: "Edsger W. Dijkstra",
  likes: 12
}
```

**NB** cuando está comparando objetos, el método [toEqual](https://jestjs.io/docs/en/expect#toequalvalue) es probablemente lo que desea usar, ya que el [toBe](https://jestjs.io/docs/en/expect#tobevalue) intenta verificar que los dos valores sean el mismo valor, y no solo que contengan las mismas propiedades.

Escriba las pruebas para este ejercicio dentro de un nuevo bloque <i>describe</i>. Haz lo mismo con los ejercicios restantes también.

#### 4.6*: funciones auxiliares y pruebas unitarias, paso 4

Este y el siguiente ejercicio son un poco más desafiantes. No es necesario completar estos dos ejercicios para avanzar en el material del curso, por lo que puede ser una buena idea volver a estos una vez que haya terminado de leer el material de esta parte en su totalidad.

Se puede terminar este ejercicio sin el uso de bibliotecas adicionales. Sin embargo, este ejercicio es una gran oportunidad para aprender a usar la biblioteca [Lodash](https://lodash.com/).

Defina una función llamada _mostBlogs_ que reciba una matriz de blogs como parámetro. La función devuelve el <i>author</i> que tiene la mayor cantidad de blogs. El valor de retorno también contiene el número de blogs que tiene el autor principal:

```js
{
  author: "Robert C. Martin",
  blogs: 3
}
```

Si hay muchos blogueros importantes, entonces es suficiente con devolver uno de ellos.

#### 4.7*: funciones auxiliares y pruebas unitarias, paso 5

Defina una función llamada _mostLikes_ que reciba una matriz de blogs como parámetro. La función devuelve el autor, cuyas publicaciones de blog tienen la mayor cantidad de me gusta. El valor de retorno también contiene el número total de likes que el autor ha recibido:

```js
{
  author: "Edsger W. Dijkstra",
  likes: 17
}
```

Si hay muchos bloggers importantes, entonces es suficiente para mostrar cualquiera de ellos.

</div>