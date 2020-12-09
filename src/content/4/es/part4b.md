---
mainImage: ../../../images/part-4.svg
part: 4
letter: b
lang: en
---

<div class="content">

Ahora comenzaremos a escribir pruebas para el backend. Dado que el backend no contiene ninguna lógica complicada, no tiene sentido escribir [pruebas unitarias](https://en.wikipedia.org/wiki/Unit_testing) para él. Lo único que podríamos probar unitariamente es el método _toJSON_ que se utiliza para formatear notas.

En algunas situaciones, puede ser beneficioso implementar algunas de las pruebas de backend simulando la base de datos en lugar de usar una base de datos real. Una biblioteca que podría usarse para esto es [mongo-mock](https://github.com/williamkapke/mongo-mock).


Dado que el backend de nuestra aplicación todavía es relativamente simple, tomaremos la decisión de probar toda la aplicación a través de su API REST, de modo que la base de datos también esté incluida. Este tipo de prueba, en la que se prueban varios componentes del sistema como un grupo, se denomina [prueba de integración](https://en.wikipedia.org/wiki/Integration_testing).

### Entorno de prueba

En uno de los capítulos anteriores del material del curso, mencionamos que cuando su servidor backend se ejecuta en Heroku, está en modo <i>producción</i>.

La convención en Node es definir el modo de ejecución de la aplicación con la variable de entorno <i> NODE_ENV</i>. En nuestra aplicación actual, solo cargamos las variables de entorno definidas en el archivo <i>.env</i> si la aplicación <i>no</i> esta en modo producción.

Es una práctica común definir modos separados para desarrollo y prueba.

A continuación, cambiemos los scripts en nuestro <i>package.json</i> para que cuando se ejecuten las pruebas, <i>NODE_ENV</i> obtenga el valor <i>test</i>:

```json
{
  // ...
  "scripts": {
    "start": "NODE_ENV=production node index.js",// highlight-line
    "dev": "NODE_ENV=development nodemon index.js",// highlight-line
    "build:ui": "rm -rf build && cd ../../../2/luento/notes && npm run build && cp -r build ../../../3/luento/notes-backend",
    "deploy": "git push heroku master",
    "deploy:full": "npm run build:ui && git add . && git commit -m uibuild && git push && npm run deploy",
    "logs:prod": "heroku logs --tail",
    "lint": "eslint .",
    "test": "NODE_ENV=test jest --verbose --runInBand"// highlight-line
  },
  // ...
}
```

También agregamos [runInBand](https://jestjs.io/docs/en/cli.html#--runinband) al script npm que ejecuta las pruebas. Esta opción evitará que Jest ejecute pruebas en paralelo; discutiremos su importancia una vez que nuestras pruebas comiencen a usar la base de datos.

Especificamos el modo de la aplicación para que sea <i>development</i> en el script _npm run dev_ que usa nodemon. También especificamos que el comando predeterminado _npm start_ definirá el modo como <i>production</i>.

Hay un pequeño problema en la forma en que hemos especificado el modo de la aplicación en nuestros scripts: no funcionará en Windows. Podemos corregir esto instalando el paquete [cross-env](https://www.npmjs.com/package/cross-env) como una dependencia de desarrollo con el comando:

```bash
npm install --save-dev cross-env
```

Entonces podemos lograr la compatibilidad multiplataforma utilizando la biblioteca cross-env en nuestros scripts npm definidos en <i>package.json</i>:

```json
{
  // ...
  "scripts": {
    "start": "cross-env NODE_ENV=production node index.js",
    "dev": "cross-env NODE_ENV=development nodemon index.js",
    // ...
    "test": "cross-env NODE_ENV=test jest --verbose --runInBand",
  },
  // ...
}
```

Ahora podemos modificar la forma en que se ejecuta nuestra aplicación en diferentes modos. Como ejemplo de esto, podríamos definir la aplicación para usar una base de datos de prueba separada cuando esté ejecutando pruebas.

Podemos crear nuestra base de datos de prueba separada en Mongo DB Atlas. Esta no es una solución óptima en situaciones en las que muchas personas desarrollan la misma aplicación. La ejecución de pruebas, en particular, generalmente requiere que las pruebas que se ejecutan simultáneamente no utilicen una sola instancia de base de datos.

Sería mejor ejecutar nuestras pruebas usando una base de datos que esté instalada y ejecutándose en la máquina local del desarrollador. La solución óptima sería que cada ejecución de prueba use su propia base de datos separada. Esto es "relativamente simple" de lograr [ejecutando Mongo en memoria](https://docs.mongodb.com/manual/core/inmemory/) o usando contenedores [Docker](https://www.docker.com ). No complicaremos las cosas y en su lugar continuaremos usando la base de datos MongoDB Atlas.

Hagamos algunos cambios en el módulo que define la configuración de la aplicación: 

```js
require('dotenv').config()

const PORT = process.env.PORT
let MONGODB_URI = process.env.MONGODB_URI

// highlight-start
if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.TEST_MONGODB_URI
}
// highlight-end

module.exports = {
  MONGODB_URI,
  PORT
}
```

El archivo <i>.env</i> tiene <i>variables independientes</i> para las direcciones de la base de datos de desarrollo y prueba:

```bash
MONGODB_URI=mongodb+srv://fullstack:secred@cluster0-ostce.mongodb.net/note-app?retryWrites=true
PORT=3001

// highlight-start
TEST_MONGODB_URI=mongodb+srv://fullstack:secret@cluster0-ostce.mongodb.net/note-app-test?retryWrites=true
// highlight-end
```

El módulo _config_ que hemos implementado se parece ligeramente al paquete [node-config](https://github.com/lorenwest/node-config). Escribir nuestra propia implementación está justificado porque nuestra aplicación es simple, y también porque nos enseña lecciones valiosas. 

Estos son los únicos cambios que debemos realizar en el código de nuestra aplicación. 

Puede encontrar el código para nuestra aplicación actual en su totalidad en la rama <i>part4-2</i> de [este repositorio de github](https://github.com/fullstack-hy2020/part3-notes-backend/árbol/part4-2).

### supertest

Usemos el paquete [supertest](https://github.com/visionmedia/supertest) para ayudarnos a escribir nuestras pruebas para probar la API.

Instalaremos el paquete como una dependencia de desarrollo:

```bash
npm install --save-dev supertest
```

Escribamos nuestra primera prueba en el archivo <i>tests/note_api.test.js</i>:

```js
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application/json/)
})

afterAll(() => {
  mongoose.connection.close()
})
```

La prueba importa la aplicación Express del módulo <i>app.js</i> y la envuelve con la función <i>supertest</i> en un objeto llamado [superagent](https://github.com/visionmedia/superagent). Este objeto se asigna a la variable <i>api</i> y las pruebas pueden usarlo para realizar solicitudes HTTP al backend.

Nuestra prueba realiza una solicitud HTTP GET a la URL <i>api/notes</i> y verifica que se responda a la solicitud con el código de estado 200. La prueba también verifica que el encabezado <i>Content-Type</i> se establece en <i>application/json</i>, lo que indica que los datos están en el formato deseado.

La prueba contiene algunos detalles que exploraremos [un poco más adelante](/es/part4/testing_the_backend#async-await). La función de flecha que define la prueba está precedida por la palabra clave <i>async</i> y la llamada al método para el objeto <i>api</i> está precedida por la palabra clave <i>await</i>. Escribiremos algunas pruebas y luego echaremos un vistazo más de cerca a esta magia asyn/await. No se preocupe por ellos por ahora, solo tenga la seguridad de que las pruebas de ejemplo funcionan correctamente. La sintaxis async/await está relacionada con el hecho de que hacer una solicitud a la API es una operación <i>asincrónica</i>. La [sintaxis async/await](https://facebook.github.io/jest/docs/en/asynchronous.html) se puede utilizar para escribir código asincrónico con la apariencia de código síncrono.

Una vez que todas las pruebas (actualmente solo hay una) hayan terminado de ejecutarse, tenemos que cerrar la conexión a la base de datos utilizada por Mongoose. Esto se puede lograr fácilmente con el método [afterAll](https://facebook.github.io/jest/docs/en/api.html#afterallfn-timeout):

```js
afterAll(() => {
  mongoose.connection.close()
})
```

Al ejecutar las pruebas, es posible que se encuentre con la siguiente advertencia de consola:

![](../../images/4/8.png)

Si esto ocurre, sigamos las [instrucciones](https://mongoosejs.com/docs/jest.html) y agregue un archivo <i>jest.config.js</i> en la raíz del proyecto con el siguiente contenido:

```js
module.exports = {
  testEnvironment: 'node'
}
```

Un pequeño pero importante detalle: al [principio](/es/part4/structure_of_backend_application_introduction_to_testing#project-structure) de esta parte extrajimos la aplicación Express en el archivo <i>app.js</i>, y el rol del archivo <i>index.js</i> se cambió para iniciar la aplicación en el puerto especificado con el objeto <i>http</i> incorporado de Node:

```js
const app = require('./app') // the actual Express app
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')

const server = http.createServer(app)

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
```

Las pruebas solo usan la aplicación express definida en el archivo <i>app.js</i>:

```js
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app') // highlight-line

const api = supertest(app) // highlight-line

// ...
```

La documentación de supertest dice lo siguiente:

> <i>si el servidor no está escuchando para las conexiones, entonces está vinculado a un puerto efímero para usted, por lo que no es necesario realizar un seguimiento de los puertos.</i>

En otras palabras, supertest se encarga de que la aplicación que se está probando se inicie en el puerto que utiliza internamente.

Escribamos algunas pruebas más:

```js
test('there are two notes', async () => {
  const response = await api.get('/api/notes')

  expect(response.body).toHaveLength(2)
})

test('the first note is about HTTP methods', async () => {
  const response = await api.get('/api/notes')

  expect(response.body[0].content).toBe('HTML is easy')
})
```

Ambas pruebas almacenan la respuesta de la solicitud a la variable _response_, y a diferencia de la prueba anterior que utilizó los métodos proporcionados por _supertest_ para verificar el código de estado y los encabezados, esta vez estamos inspeccionando los datos de respuesta almacenados en la propiedad <i>response.body</i>. Nuestras pruebas verifican el formato y el contenido de los datos de respuesta con el método [expect](https://facebook.github.io/jest/docs/en/expect.html#content) de Jest.

El beneficio de usar la sintaxis async/await está comenzando a ser evidente. Normalmente tendríamos que usar funciones de devolución de llamada para acceder a los datos devueltos por las promesas, pero con la nueva sintaxis las cosas son mucho más cómodas:

```js
const response = await api.get('/api/notes')

// la ejecución llega aquí solo después de que se completa la solicitud HTTP
// el resultado de la solicitud HTTP se guarda en respuesta variable
expect(response.body).toHaveLength(2)
```

<!-- HTTP-pyyntöjen tiedot konsoliin kirjoittava middleware häiritsee hiukan testien tulostusta . Muutetaan loggeria siten, että testausmoodissa lokiviestit eivät tulostu konsoliin: -->

El middleware que genera información sobre las solicitudes HTTP está obstruyendo la salida de ejecución de la prueba. Modifiquemos el logger para que no imprima en la consola en modo de prueba:

```js
const info = (...params) => {
  // highlight-start
  if (process.env.NODE_ENV !== 'test') { 
    console.log(...params)
  }
  // highlight-end
}

const error = (...params) => {
  console.error(...params)
}

module.exports = {
  info, error
}
```

### Inicializando la base de datos antes de las pruebas

Las pruebas parecen ser fáciles y nuestras pruebas están pasando. Sin embargo, nuestras pruebas son malas, ya que dependen del estado de la base de datos (que resulta ser correcto en mi base de datos de prueba). Para hacer nuestras pruebas más robustas, tenemos que restablecer la base de datos y generar los datos de prueba necesarios de manera controlada antes de ejecutar las pruebas.

Nuestras pruebas ya están usando la función [afterAll](https://facebook.github.io/jest/docs/en/api.html#afterallfn-timeout) de Jest para cerrar la conexión a la base de datos después de que las pruebas hayan terminado de ejecutarse . Jest ofrece muchas otras [funciones](https://facebook.github.io/jest/docs/en/setup-teardown.html#content) que se pueden usar para ejecutar operaciones una vez antes de que se ejecute cualquier prueba, o cada vez antes de que se ejecuta una prueba.

Inicialicemos la base de datos <i>antes de cada prueba</i> con la función [beforeEach](https://jestjs.io/docs/en/api.html#beforeeachfn-timeout):

```js
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
// highlight-start
const Note = require('../models/note')

const initialNotes = [
  {
    content: 'HTML is easy',
    date: new Date(),
    important: false,
  },
  {
    content: 'Browser can execute only Javascript',
    date: new Date(),
    important: true,
  },
]

beforeEach(async () => {
  await Note.deleteMany({})

  let noteObject = new Note(initialNotes[0])
  await noteObject.save()

  noteObject = new Note(initialNotes[1])
  await noteObject.save()
})
// highlight-end
// ...
```

La base de datos se borra al principio, y luego guardamos las dos notas almacenadas en la matriz _initialNotes_ en la base de datos. Al hacer esto, nos aseguramos de que la base de datos esté en el mismo estado antes de ejecutar cada prueba.

También hagamos los siguientes cambios en las dos últimas pruebas:

```js
test('all notes are returned', async () => {
  const response = await api.get('/api/notes')

  expect(response.body).toHaveLength(initialNotes.length) // highlight-line
})

test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes')

  // highlight-start
  const contents = response.body.map(r => r.content)

  expect(contents).toContain(
    'Browser can execute only Javascript'
  )
  // highlight-end
})
```

Preste especial atención al expect en la última prueba. El comando <code>response.body.map (r => r.content)</code> se usa para crear una matriz que contiene el contenido de cada nota devuelta por la API. El método [toContain](https://facebook.github.io/jest/docs/en/expect.html#tocontainitem) se utiliza para comprobar que la nota que se le ha asignado como parámetro está en la lista de notas devueltas por la API.

### Ejecución de pruebas una por una

El comando _npm test_ ejecuta todas las pruebas de la aplicación. Cuando escribimos pruebas, generalmente es aconsejable ejecutar solo una o dos pruebas. Jest ofrece algunas formas diferentes de lograr esto, una de las cuales es el método [only](https://jestjs.io/docs/en/api#testonlyname-fn-timeout). Si las pruebas se escriben en muchos archivos, este método no es excelente.

Una mejor opción es especificar las pruebas que deben ejecutarse como parámetro del comando <i>npm test</i>.

El siguiente comando solo ejecuta las pruebas que se encuentran en el archivo <i>tests/ note_api.test.js</i>:

```js
npm test -- tests/note_api.test.js
```

La opción <i>-t</i> se puede utilizar para ejecutar pruebas con un nombre específico:

```js
npm test -- -t 'a specific note is within the returned notes'
```

El parámetro proporcionado puede hacer referencia al nombre de la prueba o al bloque de descripción. El parámetro también puede contener solo una parte del nombre. El siguiente comando ejecutará todas las pruebas que contengan <i>notes</i> en su nombre:

```js
npm test -- -t 'notes'
```

<!-- * HUOM *: yksittäisiä testejä suoritettaessa saattaa mangosta-yhteys jäädä auki, mikäli yhtään yhteyttä hyödyntävää testiä ei ajeta. Ongelma seurannee siitä, että supertest alustaa yhteyden, mutta jest ei suorita afterAll-osiota. -->
**NB**: Cuando se ejecuta una sola prueba, la conexión de mongoose puede permanecer abierta si no se ejecuta ninguna prueba con la conexión.
El problema puede deberse al hecho de que supertest prepara la conexión, pero jest no ejecuta la parte afterAll del código.

### async/await

Antes de escribir más pruebas, echemos un vistazo a las palabras clave _async_ y _await_.

La sintaxis async/await que se introdujo en ES7 hace posible el uso de <i>funciones asincrónicas que devuelven una promesa</i> de una manera que hace que el código parezca sincrónico.

Como ejemplo, la obtención de notas de la base de datos con promesas se ve así:

```js
Note.find({}).then(notes => {
  console.log('operation returned the following notes', notes)
})
```

El método _Note.find()_ devuelve una promesa y podemos acceder al resultado de la operación registrando una función de devolución de llamada con el método _then_.

Todo el código que queremos ejecutar una vez que finalice la operación está escrito en la función de devolución de llamada. Si quisiéramos realizar varias llamadas a funciones asincrónicas en secuencia, la situación pronto se volvería dolorosa. Las llamadas asincrónicas deberían realizarse en la devolución de llamada. Esto probablemente conduciría a un código complicado y podría potencialmente dar lugar a un llamado [infierno de devolución de llamada](http://callbackhell.com/).

Al [encadenar promesas](https://javascript.info/promise-chaining) podríamos mantener la situación un poco bajo control y evitar el infierno de devolución de llamada creando una cadena bastante limpia de llamadas a métodos _then_. Hemos visto algunos de estos durante el curso. Para ilustrar esto, puede ver un ejemplo artificial de una función que recupera todas las notas y luego elimina la primera:

```js
Note.find({})
  .then(notes => {
    return notes[0].remove()
  })
  .then(response => {
    console.log('the first note is removed')
    // more code here
  })
```

La cadena de then está bien, pero podemos hacerlo mejor. Las [funciones del generador](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) introducidas en ES6 proporcionaron una [forma inteligente](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/async%20%26%20performance/ch4.md#iterating-generators-asynchronously) de escribir código asincrónico de una manera que "parezca sincrónica". La sintaxis es un poco torpe y no se usa mucho.

Las palabras clave _async_ y _await_ introducidas en ES7 traen la misma funcionalidad que los generadores, pero de una manera comprensible y sintácticamente más limpia a las manos de todos los ciudadanos del mundo JavaScript.

Podríamos obtener todas las notas en la base de datos utilizando el operador [await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) como este:

```js
const notes = await Note.find({})

console.log('operation returned the following notes', notes)
```

El código se ve exactamente como el código síncrono. La ejecución del código se detiene en <em>const notes = await Note.find({})</em> y espera hasta que se <i>cumpla</i> la promesa relacionada, y luego continúa su ejecución a la siguiente línea. Cuando la ejecución continúa, el resultado de la operación que devolvió una promesa se asigna a la variable _notes_.

El ejemplo un poco complicado presentado anteriormente podría implementarse usando await como este:

```js
const notes = await Note.find({})
const response = await notes[0].remove()

console.log('the first note is removed')
```

Gracias a la nueva sintaxis, el código es mucho más simple que la cadena then anterior.

Hay algunos detalles importantes a los que se debe prestar atención cuando se usa la sintaxis async/await. Para utilizar el operador await con operaciones asincrónicas, deben devolver una promesa. Esto no es un problema como tal, ya que las funciones asincrónicas regulares que utilizan devoluciones de llamada son fáciles de envolver en promesas.

La palabra clave await no se puede usar en cualquier parte del código JavaScript. El uso de await solo es posible dentro de una función [async](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function).

Esto significa que para que los ejemplos anteriores funcionen, deben utilizar funciones asíncronas. Observe la primera línea en la definición de la función de flecha:

```js
const main = async () => { // highlight-line
  const notes = await Note.find({})
  console.log('operation returned the following notes', notes)

  const response = await notes[0].remove()
  console.log('the first note is removed')
}

main() // highlight-line
```

El código declara que la función asignada a _main_ es asíncrona. Después de esto, el código llama a la función con <code>main()</code>.

### async/await en el backend

Cambiemos el backend a async y await. Como todas las operaciones asincrónicas se realizan actualmente dentro de una función, es suficiente cambiar las funciones del controlador de ruta en funciones asincrónicas.

La ruta para obtener todas las notas se cambia a la siguiente:

```js
notesRouter.get('/', async (request, response) => { 
  const notes = await Note.find({})
  response.json(notes)
})
```

Podemos verificar que nuestra refactorización fue exitosa probando el endpoint a través del navegador y ejecutando las pruebas que escribimos anteriormente. 

Puede encontrar el código para nuestra aplicación actual en su totalidad en la rama <i>part4-3</i> de [este repositorio de Github](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-3).

### Más pruebas y refactorización del backend

Cuando el código se refactoriza, siempre existe el riesgo de [regresión](https://en.wikipedia.org/wiki/Regression_testing), lo que significa que la funcionalidad existente puede romperse. Refactoricemos las operaciones restantes escribiendo primero una prueba para cada ruta de la API.

Comencemos con la operación para agregar una nueva nota. Escribamos una prueba que agregue una nueva nota y verifique que la cantidad de notas devueltas por la API aumente y que la nota recién agregada esté en la lista.

```js
test('a valid note can be added', async () => {
  const newNote = {
    content: 'async/await simplifies making async calls',
    important: true,
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/notes')

  const contents = response.body.map(r => r.content)

  expect(response.body).toHaveLength(initialNotes.length + 1)
  expect(contents).toContain(
    'async/await simplifies making async calls'
  )
})
```

La prueba pasa justo como nosotros esperabamos que lo hiciera.

Escribamos también una prueba que verifique que una nota sin contenido no se guardará en la base de datos.

```js
test('note without content is not added', async () => {
  const newNote = {
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(400)

  const response = await api.get('/api/notes')

  expect(response.body).toHaveLength(initialNotes.length)
})
```

Ambas pruebas verifican el estado almacenado en la base de datos después de la operación de guardado, obteniendo todas las notas de la aplicación.

```js
const response = await api.get('/api/notes')
```

Los mismos pasos de verificación se repetirán en otras pruebas más adelante, y es una buena idea extraer estos pasos en funciones auxiliares. Agreguemos la función en un nuevo archivo llamado <i>tests/test_helper.js</i> que está en el mismo directorio que el archivo de prueba.

```js
const Note = require('../models/note')

const initialNotes = [
  {
    content: 'HTML is easy',
    date: new Date(),
    important: false
  },
  {
    content: 'Browser can execute only Javascript',
    date: new Date(),
    important: true
  }
]

const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon', date: new Date() })
  await note.save()
  await note.remove()

  return note._id.toString()
}

const notesInDb = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}

module.exports = {
  initialNotes, nonExistingId, notesInDb
}
```

El módulo define la función _notesInDb_ que se puede usar para verificar las notas almacenadas en la base de datos. La matriz _initialNotes_ que contiene el estado inicial de la base de datos también está en el módulo. También definimos la función _nonExistingId_ con anticipación, que se puede usar para crear un ID de objeto de base de datos que no pertenezca a ningún objeto de nota en la base de datos.

Nuestras pruebas ahora pueden usar el módulo auxiliar y cambiarse así: 

```js
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper') // highlight-line
const app = require('../app')
const api = supertest(app)

const Note = require('../models/note')

beforeEach(async () => {
  await Note.deleteMany({})

  let noteObject = new Note(helper.initialNotes[0]) // highlight-line
  await noteObject.save()

  noteObject = new Note(helper.initialNotes[1]) // highlight-line
  await noteObject.save()
})

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all notes are returned', async () => {
  const response = await api.get('/api/notes')

  expect(response.body).toHaveLength(helper.initialNotes.length) // highlight-line
})

test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes')

  const contents = response.body.map(r => r.content)

  expect(contents).toContain(
    'Browser can execute only Javascript'
  )
})

test('a valid note can be added ', async () => {
  const newNote = {
    content: 'async/await simplifies making async calls',
    important: true,
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const notesAtEnd = await helper.notesInDb() // highlight-line
  expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1) // highlight-line

  const contents = notesAtEnd.map(n => n.content) // highlight-line
  expect(contents).toContain(
    'async/await simplifies making async calls'
  )
})

test('note without content is not added', async () => {
  const newNote = {
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(400)

  const notesAtEnd = await helper.notesInDb() // highlight-line

  expect(notesAtEnd).toHaveLength(helper.initialNotes.length) // highlight-line
})

afterAll(() => {
  mongoose.connection.close()
}) 
```

El código que usa promesas funciona y las pruebas pasan. Estamos listos para refactorizar nuestro código para usar la sintaxis async/await.

Realizamos los siguientes cambios en el código que se encarga de agregar una nueva nota (observe que la definición del controlador de ruta está precedida por la palabra clave _async_):

```js
notesRouter.post('/', async (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

  const savedNote = await note.save()
  response.json(savedNote)
})
```

Hay un pequeño problema con nuestro código: no manejamos situaciones de error. ¿Cómo debemos lidiar con ellos?

### Manejo de errores y async/await

Si hay una excepción al manejar la solicitud POST terminamos en una situación familiar:

![](../../images/4/6.png)

En otras palabras, terminamos con un rechazo de promesa no gestionado, y la solicitud nunca recibe una respuesta.

Con async/await, la forma recomendada de lidiar con las excepciones es el viejo y familiar mecanismo _try/catch_:

```js
notesRouter.post('/', async (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })
  // highlight-start
  try { 
    const savedNote = await note.save()
    response.json(savedNote)
  } catch(exception) {
    next(exception)
  }
  // highlight-end
})
```

El bloque catch simplemente llama la función _next_, que pasa el manejo de solicitudes al middleware de manejo de errores.

Después de realizar el cambio, todas nuestras pruebas pasarán una vez más.

A continuación, escribamos pruebas para obtener y eliminar una nota individual:

```js
test('a specific note can be viewed', async () => {
  const notesAtStart = await helper.notesInDb()

  const noteToView = notesAtStart[0]

// highlight-start
  const resultNote = await api
    .get(`/api/notes/${noteToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)
// highlight-end

  const processedNoteToView = JSON.parse(JSON.stringify(noteToView))

  expect(resultNote.body).toEqual(processedNoteToView)
})

test('a note can be deleted', async () => {
  const notesAtStart = await helper.notesInDb()
  const noteToDelete = notesAtStart[0]

// highlight-start
  await api
    .delete(`/api/notes/${noteToDelete.id}`)
    .expect(204)
// highlight-end

  const notesAtEnd = await helper.notesInDb()

  expect(notesAtEnd).toHaveLength(
    helper.initialNotes.length - 1
  )

  const contents = notesAtEnd.map(r => r.content)

  expect(contents).not.toContain(noteToDelete.content)
})
```

En la primera prueba, el objeto de nota que recibimos como que el cuerpo de la respuesta pasa por la serialización y el análisis de JSON. Este procesamiento convertirá el tipo de valor de propiedad <em>date</em> del objeto de nota del objeto <em>Date</em> en una cadena. Debido a esto, no podemos comparar directamente la igualdad de <em>resultNote.body</em> y <em>noteToView</em>. En su lugar, primero debemos realizar una serialización JSON y un análisis similares para <em>noteToView</em> como lo hace el servidor para el objeto note.

Ambas pruebas comparten una estructura similar. En la fase de inicialización, obtienen una nota de la base de datos. Después de esto, las pruebas llaman a la operación real que se está probando, que se resalta en el bloque de código. Por último, las pruebas verifican que el resultado de la operación sea el esperado.

Las pruebas pasan y podemos refactorizar con seguridad las rutas probadas para usar async/await:

```js
notesRouter.get('/:id', async (request, response, next) => {
  try{
    const note = await Note.findById(request.params.id)
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  } catch(exception) {
    next(exception)
  }
})

notesRouter.delete('/:id', async (request, response, next) => {
  try {
    await Note.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})
```

Puede encontrar el código para nuestra aplicación actual en su totalidad en la rama <i>part4-4</i> de [este repositorio de Github](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-4).

### Eliminando el try-catch

<!-- Async / await selkeyttää koodia jossain määrin, mutta sen 'hinta' en poikkeusten käsittelyn edellyttämä <i> try / catch </i> -rakenne. Kaikki routejen käsittelijät noudattavat samaa kaavaa -->
Async/await despeja un poco el código, pero el 'precio' es la estructura <i>try/catch</i> necesaria para detectar excepciones.
Todos los manejadores de ruta siguen la misma estructura

```js
try {
  // do the async operations here
} catch(exception) {
  next(exception)
}
```

<!-- Mieleen herää kysymys, olisiko koodia mahdollista refaktoroida siten, että <i> atrapar </i> saataisiin refaktoroitua ulos metodeista? -->
Uno comienza a preguntarse, ¿sería posible refactorizar el código para eliminar el <i>catch</i> de los métodos?

<!-- Kirjasto [express-async-errors] (https://github.com/davidbanham/express-async-errors) tuo tilanteeseen helpotuksen. -->
La biblioteca [express-async-errors](https://github.com/davidbanham/express-async-errors) tiene una solución para esto.

<!-- Asennetaan kirjasto -->
Instalemos la biblioteca

```bash
npm install express-async-errors
```

<!-- Kirjaston käyttö en <i> todella </i> helppoa. 
 Kirjaston koodi otetaan käyttöön tiedostossa <i> src / app.js </i>: -->
Usar la biblioteca es <i>muy</i> fácil.
Introduce la biblioteca en <i>app.js</i>:

```js
const config = require('./utils/config')
const express = require('express')
require('express-async-errors') // highlight-line
const app = express()
const cors = require('cors')
const notesRouter = require('./controllers/notes')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

// ...

module.exports = app
```

<!-- Kirjaston koodiin sisällyttämän "magian" ansiosta pääsemme kokonaan eroon try-catch-lauseista. Muistiinpanon poistamisesta huolehtiva route -->
La 'magia' de la biblioteca nos permite eliminar por completo los bloques try-catch.
Por ejemplo, la ruta para eliminar una nota

```js
notesRouter.delete('/:id', async (request, response, next) => {
  try {
    await Note.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})
```

<!-- muuttuu muotoon -->
se convierte en

```js
notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndRemove(request.params.id)
  response.status(204).end()
})
```

<!-- Kirjaston ansiosta kutsua _next (excepción) _ ei siis enää tarvita, kirjasto hoitaa asian konepellin alla, eli jos <i> async </i> -funktiona määritellyn routen sisällä syntyy poikkeus, siirtyy suoritus automaattisesti virheenkäsittelijämiddlewareen. -->
Debido a la biblioteca, ya no necesitamos la llamada _next(exception)_.
La biblioteca se encarga de todo lo que hay debajo del capó. Si ocurre una excepción en una ruta <i>async</i>, la ejecución se pasa automáticamente al middleware de manejo de errores.

<!-- Muut routet yksinkertaistuvat seuraavasti: -->
Las otras rutas se convierten en:

```js
notesRouter.post('/', async (request, response) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

  const savedNote = await note.save()
  response.json(savedNote)
})

notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})
```

<!-- Sovelluksen tämänhetkinen koodi en kokonaisuudessaan [githubissa] (https://github.com / fullstack-hy2020 / part3-notes-backend / tree / part4-5), haarassa <i> part4-5 </i>. -->
El código de nuestra aplicación se puede encontrar en [github](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-5), rama <i>part4-5</i>.

### Optimización de la función beforeEach

Volvamos a escribir nuestras pruebas y echemos un vistazo más de cerca a la función _beforeEach_ que configura las pruebas:

```js
beforeEach(async () => {
  await Note.deleteMany({})

  let noteObject = new Note(helper.initialNotes[0])
  await noteObject.save()

  noteObject = new Note(helper.initialNotes[1])
  await noteObject.save()
})
```

La función guarda las dos primeras notas de la matriz _helper.initialNotes_ en la base de datos con dos operaciones separadas. La solución está bien, pero hay una mejor manera de guardar varios objetos en la base de datos:

```js
beforeEach(async () => {
  await Note.deleteMany({})
  console.log('cleared')

  helper.initialNotes.forEach(async (note) => {
    let noteObject = new Note(note)
    await noteObject.save()
    console.log('saved')
  })
  console.log('done')
})

test('notes are returned as json', async () => {
  console.log('entered test')
  // ...
}
```

Guardamos las notas almacenadas en la matriz en la base de datos dentro de un loop _forEach_. Sin embargo, las pruebas no parecen funcionar del todo, por lo que hemos agregado algunos registros de la consola para ayudarnos a encontrar el problema.

La consola muestra el siguiente resultado:

<pre>
cleared
done
entered test
saved
saved
</pre>

A pesar de nuestra uso de la sintaxis async/await, nuestra solución no funciona como esperábamos. ¡La ejecución de la prueba comienza antes de que se inicialice la base de datos!

El problema es que cada iteración del bucle forEach genera su propia operación asincrónica, y _beforeEach_ no esperará a que terminen de ejecutarse. En otras palabras, los comandos _await_ definidos dentro del bucle _forEach_ no están en la función _beforeEach_, sino en funciones separadas que _beforeEach_ no esperará.

Dado que la ejecución de las pruebas comienza inmediatamente después de que _beforeEach_ haya terminado de ejecutarse, la ejecución de las pruebas comienza antes de que se inicialice el estado de la base de datos.

Una forma de arreglar esto es esperar a que todas las operaciones asincrónicas terminen de ejecutarse con el método [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all):

```js
beforeEach(async () => {
  await Note.deleteMany({})

  const noteObjects = helper.initialNotes
    .map(note => new Note(note))
  const promiseArray = noteObjects.map(note => note.save())
  await Promise.all(promiseArray)
})
```

La solución es bastante avanzado a pesar de su apariencia compacta. La variable _noteObjects_ se asigna a una matriz de objetos Mongoose que se crean con el constructor _Note_ para cada una de las notas en la matriz _helper.initialNotes_. La siguiente línea de código crea una nueva matriz que <i>consiste en promesas</i>, que se crean llamando al método _save_ de cada elemento en la matriz _noteObjects_. En otras palabras, es una serie de promesas para guardar cada uno de los elementos en la base de datos.

El método [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) se puede utilizar para transformar una serie de promesas en una única promesa, que se <i>cumplirá</i> una vez que se resuelva cada promesa en la matriz que se le pasa como parámetro. La última línea de código <em>await Promise.all(promiseArray)</em> espera que finalice cada promesa de guardar una nota, lo que significa que la base de datos se ha inicializado.

> Aún se puede acceder a los valores devueltos de cada promesa en la matriz cuando se usa el método Promise.all. Si esperamos a que se resuelvan las promesas con la sintaxis _await_ <em>const results = await Promise.all (promiseArray)</em>, la operación devolverá una matriz que contiene los valores resueltos para cada promesa en _promiseArray_, y aparecen en el mismo orden que las promesas en la matriz.

Promise.all ejecuta las promesas que recibe en paralelo. Si las promesas deben ejecutarse en un orden particular, esto será problemático. En situaciones como esta, las operaciones se pueden ejecutar dentro de un [for ... of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of ), que garantiza una determinada orden de ejecución.

```js
beforeEach(async () => {
  await Note.deleteMany({})

  for (let note of helper.initialNotes) {
    let noteObject = new Note(note)
    await noteObject.save()
  }
})
```

La naturaleza asincrónica de JavaScript puede llevar a un comportamiento sorprendente por esta razón, es importante prestar mucha atención al usar la sintaxis async/await. Aunque la sintaxis hace que sea más fácil lidiar con las promesas, ¡es necesario entender cómo funcionan las promesas!

</div>

<div class="tasks">

### Ejercicios 4.8.-4.12.


**NB:** el material usa el comparador [toContain](https://facebook.github.io/jest/docs/en/expect.html#tocontainitem) en varios lugares para verificar que una matriz contiene un elemento específico. Vale la pena señalar que el método utiliza el operador === para comparar y hacer coincidir elementos, lo que significa que a menudo no es adecuado para hacer coincidir objetos. En la mayoría de los casos, el método apropiado para verificar objetos en matrices es el comparador [toContainEqual](https://facebook.github.io/jest/docs/en/expect.html#tocontainequalitem). Sin embargo, las soluciones del modelo no comprueban objetos en matrices con comparadores, por lo que no es necesario utilizar el método para resolver los ejercicios.

**Advertencia:** Si se encuentra utilizando los métodos async/await y <i>then</i> en el mismo código, es casi seguro que está haciendo algo mal. Use uno u otro y no mezcle los dos.

#### 4.8: Pruebas de lista de blogs, paso 1

Utilice el paquete supertest para escribir una prueba que realice una solicitud HTTP GET a la URL <i>/api/blogs</i>. Verifique que la aplicación de la lista de blogs devuelva la cantidad correcta de publicaciones de blog en formato JSON.

Una vez finalizada la prueba, refactorice el controlador de ruta para usar la sintaxis async/await en lugar de promesas.

Tenga en cuenta que tendrá que realizar cambios similares en el código que se hicieron [en el material](/es/part4/testing_the_backend#test-environment),

**NB:** Al ejecutar las pruebas, es posible que se encuentre con la siguiente advertencia:

![](../../images/4/8a.png)

Si esto sucede, siga las [instrucciones](https://mongoosejs.com/docs/jest.html) y cree un nuevo archivo <i>jest.config.js</i> en la raíz del proyecto con el siguiente contenido:

```js
module.exports = {
  testEnvironment: 'node'
}
```

**NB:** cuando estás escribiendo tus pruebas **<i>es mejor no ejecutar todas tus pruebas</i>**, solo ejecuta aquellas en las que estás trabajando. Lea más sobre esto [aquí](/es/part4/testing_the_backend#running-tests-one-by-one). 

#### 4.9*: Pruebas de lista de blogs, paso 2

Escriba una prueba que verifique que la propiedad de identificador único de las publicaciones del blog se llame <i>id</i>, de manera predeterminada, la base de datos nombra la propiedad <i>_id</i>. La verificación de la existencia de una propiedad se realiza fácilmente con el comparador [toBeDefined](https://jestjs.io/docs/en/expect#tobedefined) de Jest.

Realice los cambios necesarios en el código para que pase la prueba. El método [toJSON](/es/part3/save_data_to_mongo_db#backend-connected-to-a-database) discutido en la parte 3 es un lugar apropiado para definir el parámetro <i>id</i>.

#### 4.10: Pruebas de lista de blogs, paso 3

Escriba una prueba que verifique que al realizar una solicitud HTTP POST a la URL <i>/api/blogs</i> se crea correctamente una nueva publicación de blog. Como mínimo, verifique que el número total de blogs en el sistema se incremente en uno. También puede verificar que el contenido de la publicación del blog se guarde correctamente en la base de datos.

Una vez finalizada la prueba, refactorice la operación para usar async/await en lugar de promesas.

#### 4.11 *: Pruebas de lista de blogs, paso 4 

Escribe una prueba que verifique que si la propiedad <i>likes</i> falta en la solicitud, tendrá el valor 0 por defecto. No pruebes las otras propiedades de los blogs creados todavía.

Realice los cambios necesarios en el código para que pase la prueba. 

#### 4.12*: Pruebas de lista de blogs, paso 5

Escriba una prueba relacionada con la creación de blogs nuevos a través del endpoint <i>/api/blogs</i>, que verifique que si faltan las propiedades <i>title</i> y <i>url</i> de los datos solicitados, el backend responde a la solicitud con el código de estado <i>400 Bad Request</i>.

Realice los cambios necesarios en el código para que pase la prueba.

</div>

<div class="content">

### Pruebas de refactorización

Actualmente, nuestra prueba esta falto de cobertura. Algunas solicitudes como <i> GET /api/notes/:id </i> y <i> DELETE /api/notes/:id </i> no se prueban cuando la solicitud se envía con una identificación no válida. La agrupación y organización de las pruebas también podría mejorar, ya que todas las pruebas existen en el mismo "nivel superior" en el archivo de prueba. La legibilidad de la prueba mejoraría si agrupamos las pruebas relacionadas con bloques <i>describe</i>.

A continuación se muestra un ejemplo del archivo de prueba después de realizar algunas mejoras menores:

```js
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Note = require('../models/note')

beforeEach(async () => {
  await Note.deleteMany({})

  const noteObjects = helper.initialNotes
    .map(note => new Note(note))
  const promiseArray = noteObjects.map(note => note.save())
  await Promise.all(promiseArray)
})

describe('when there is initially some notes saved', () => {
  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all notes are returned', async () => {
    const response = await api.get('/api/notes')

    expect(response.body).toHaveLength(helper.initialNotes.length)
  })

  test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes')

    const contents = response.body.map(r => r.content)

    expect(contents).toContain(
      'Browser can execute only Javascript'
    )
  })
})

describe('viewing a specific note', () => {
  test('succeeds with a valid id', async () => {
    const notesAtStart = await helper.notesInDb()

    const noteToView = notesAtStart[0]

    const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
      
    const processedNoteToView = JSON.parse(JSON.stringify(noteToView))

    expect(resultNote.body).toEqual(processedNoteToView)
  })

  test('fails with statuscode 404 if note does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()

    console.log(validNonexistingId)

    await api
      .get(`/api/notes/${validNonexistingId}`)
      .expect(404)
  })

  test('fails with statuscode 400 id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api
      .get(`/api/notes/${invalidId}`)
      .expect(400)
  })
})

describe('addition of a new note', () => {
  test('succeeds with valid data', async () => {
    const newNote = {
      content: 'async/await simplifies making async calls',
      important: true,
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(200)
      .expect('Content-Type', /application\/json/)


    const notesAtEnd = await helper.notesInDb()
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)

    const contents = notesAtEnd.map(n => n.content)
    expect(contents).toContain(
      'async/await simplifies making async calls'
    )
  })

  test('fails with status code 400 if data invaild', async () => {
    const newNote = {
      important: true
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(400)

    const notesAtEnd = await helper.notesInDb()

    expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
  })
})

describe('deletion of a note', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const notesAtStart = await helper.notesInDb()
    const noteToDelete = notesAtStart[0]

    await api
      .delete(`/api/notes/${noteToDelete.id}`)
      .expect(204)

    const notesAtEnd = await helper.notesInDb()

    expect(notesAtEnd).toHaveLength(
      helper.initialNotes.length - 1
    )

    const contents = notesAtEnd.map(r => r.content)

    expect(contents).not.toContain(noteToDelete.content)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
```

La salida de prueba se agrupa de acuerdo con los bloques <i>describe</i>:

![](../../images/4/7.png)

Todavía hay margen de mejora, pero es hora de seguir adelante.

Esta forma de probar la API, al realizar solicitudes HTTP e inspeccionar la base de datos con Mongoose, no es de ninguna manera la única ni la mejor forma de realizar pruebas de integración a nivel de API para aplicaciones de servidor. No existe una mejor forma universal de escribir pruebas, ya que todo depende de la aplicación que se esté probando y de los recursos disponibles.

Puede encontrar el código para nuestra aplicación actual en su totalidad en la rama <i>part4-6</i> de [este repositorio de Github](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-6).

</div>

<div class="tasks">

### Ejercicios 4.13.-4.14.

#### 4.13 Expansiones de la lista de blogs, paso 1

Implementar la funcionalidad para eliminar un solo recurso de publicación de blog.

Utilice la sintaxis async/await. Siga las convenciones de [RESTful](/es/part3/node_js_and_express#rest) al definir la API HTTP.

No dude en implementar pruebas para la funcionalidad si lo desea. De lo contrario, verifique que la funcionalidad funcione con Postman o alguna otra herramienta.

#### 4.14 Expansiones de listas de blogs, paso 2

Implementar la funcionalidad para actualizar la información de una publicación de blog individual.

Utilice async / await.

La aplicación principalmente necesita actualizar la cantidad de <i>likes</i> para una publicación de blog. Puede implementar esta funcionalidad de la misma manera que implementamos las notas de actualización en la [parte 3](/es/part3/save_data_to_mongo_db#other-operations).

No dude en implementar pruebas para la funcionalidad si lo desea. De lo contrario, verifique que la funcionalidad funcione con Postman o alguna otra herramienta.

</div>