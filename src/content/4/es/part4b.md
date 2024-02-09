---
mainImage: ../../../images/part-4.svg
part: 4
letter: b
lang: es
---

<div class="content">

Ahora comenzaremos a escribir pruebas para el backend. Dado que el backend no contiene ninguna lógica complicada, no tiene sentido escribir [pruebas unitarias](https://es.wikipedia.org/wiki/Prueba_unitaria) para él. Lo único que podríamos probar unitariamente es el método _toJSON_ que se utiliza para formatear notas.

En algunas situaciones, puede ser beneficioso implementar algunas de las pruebas de backend simulando la base de datos en lugar de usar una base de datos real. Una librería que podría usarse para esto es [mongo-mock](https://github.com/williamkapke/mongo-mock).

Dado que el backend de nuestra aplicación todavía es relativamente simple, tomaremos la decisión de probar toda la aplicación a través de su API REST, de modo que la base de datos también esté incluida. Este tipo de prueba, en la que se prueban varios componentes del sistema como un grupo, se denomina [prueba de integración](https://en.wikipedia.org/wiki/Integration_testing).

### Entorno de prueba

En uno de los capítulos anteriores del material del curso, mencionamos que cuando su servidor backend se ejecuta en Fly.io o Render, está en modo <i>producción</i>.

La convención en Node es definir el modo de ejecución de la aplicación con la variable de entorno <i> NODE_ENV</i>. En nuestra aplicación actual, solo cargamos las variables de entorno definidas en el archivo <i>.env</i> si la aplicación <i>no</i> esta en modo producción.

Es una práctica común definir modos separados para desarrollo y prueba.

A continuación, cambiemos los scripts en nuestro <i>package.json</i> para que cuando se ejecuten las pruebas, <i>NODE_ENV</i> obtenga el valor <i>test</i>:

```json
{
  // ...
  "scripts": {
    "start": "NODE_ENV=production node index.js",// highlight-line
    "dev": "NODE_ENV=development nodemon index.js",// highlight-line
    "build:ui": "rm -rf build && cd ../frontend/ && npm run build && cp -r build ../backend",
    "deploy": "fly deploy",
    "deploy:full": "npm run build:ui && npm run deploy",
    "logs:prod": "fly logs",
    "lint": "eslint .",
    "test": "NODE_ENV=test jest --verbose --runInBand"// highlight-line
  },
  // ...
}
```

También agregamos [runInBand](https://jestjs.io/es-ES/docs/cli#--runinband) al script npm que ejecuta las pruebas. Esta opción evitará que Jest ejecute pruebas en paralelo; discutiremos su importancia una vez que nuestras pruebas comiencen a usar la base de datos.

Especificamos el modo de la aplicación para que sea <i>development</i> en el script _npm run dev_ que usa nodemon. También especificamos que el comando predeterminado _npm start_ definirá el modo como <i>production</i>.

Hay un pequeño problema en la forma en que hemos especificado el modo de la aplicación en nuestros scripts: no funcionará en Windows. Podemos corregir esto instalando el paquete [cross-env](https://www.npmjs.com/package/cross-env) como una dependencia de desarrollo con el comando:

```bash
npm install --save-dev cross-env
```

Entonces podemos lograr la compatibilidad multiplataforma utilizando la librería cross-env en nuestros scripts npm definidos en <i>package.json</i>:

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

**Nota**: Si estás desplegando esta aplicación en Fly.io/Render, ten en cuenta que si cross-env se guarda como una dependencia de desarrollo, podría causar un error en tu servidor web. Para solucionarlo, cambia cross-env a una dependencia de producción ejecutando lo siguiente en la línea de comandos:

```bash
npm install cross-env
```

Ahora podemos modificar la forma en que se ejecuta nuestra aplicación en diferentes modos. Como ejemplo de esto, podríamos definir la aplicación para usar una base de datos de prueba separada cuando esté ejecutando pruebas.

Podemos crear nuestra base de datos de prueba separada en MongoDB Atlas. Esta no es una solución óptima en situaciones en las que muchas personas desarrollan la misma aplicación. La ejecución de pruebas, en particular, generalmente requiere que las pruebas que se ejecutan simultáneamente no utilicen una sola instancia de base de datos.

Sería mejor ejecutar nuestras pruebas usando una base de datos que esté instalada y ejecutándose en la máquina local del desarrollador. La solución óptima sería que cada ejecución de prueba use su propia base de datos separada. Esto es "relativamente simple" de lograr [ejecutando Mongo en memoria](https://docs.mongodb.com/manual/core/inmemory/) o usando contenedores [Docker](https://www.docker.com ). No complicaremos las cosas y en su lugar continuaremos usando la base de datos MongoDB Atlas.

Hagamos algunos cambios en el módulo que define la configuración de la aplicación en _utils/config.js_: 

```js
require('dotenv').config()

const PORT = process.env.PORT

// highlight-start
const MONGODB_URI = process.env.NODE_ENV === 'test' 
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI
// highlight-end

module.exports = {
  MONGODB_URI,
  PORT
}
```

El archivo <i>.env</i> tiene <i>variables independientes</i> para las direcciones de la base de datos de desarrollo y prueba:

```bash
MONGODB_URI=mongodb+srv://fullstack:<password>@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority
PORT=3001

// highlight-start
TEST_MONGODB_URI=mongodb+srv://fullstack:<password>@cluster0.o1opl.mongodb.net/testNoteApp?retryWrites=true&w=majority
// highlight-end
```

El módulo _config_ que hemos implementado se parece ligeramente al paquete [node-config](https://github.com/lorenwest/node-config). Escribir nuestra propia implementación está justificado porque nuestra aplicación es simple, y también porque nos enseña lecciones valiosas.

Estos son los únicos cambios que debemos realizar en el código de nuestra aplicación.

Puedes encontrar el código para nuestra aplicación actual en su totalidad en la rama <i>part4-2</i> de [este repositorio de GitHub](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-2).

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
    .expect('Content-Type', /application\/json/)
})

afterAll(() => {
  mongoose.connection.close()
})
```

La prueba importa la aplicación Express del módulo <i>app.js</i> y la envuelve con la función <i>supertest</i> en un objeto llamado [superagent](https://github.com/visionmedia/superagent). Este objeto se asigna a la variable <i>api</i> y las pruebas pueden usarlo para realizar solicitudes HTTP al backend.

Nuestra prueba realiza una solicitud HTTP GET a la URL <i>api/notes</i> y verifica que se responda a la solicitud con el código de estado 200. La prueba también verifica que el encabezado <i>Content-Type</i> se establece en <i>application/json</i>, lo que indica que los datos están en el formato deseado.

La verificación del valor en el encabezado usa una sintaxis un poco extraña:

```js
.expect('Content-Type', /application\/json/)
```

El valor lo definimos como una [expresión regular](https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Regular_Expressions) o en palabras cortas: regex. Las expresiones regulares en JavaScript inician y finalizan con un slash /. Dado que la cadena deseada <i>application/json</i> también contiene el mismo slash en el medio, entonces se precede por un \ de tal manera que no se interprete como un caracter de terminación.

En principio, el test podría también ser definido simplemente como una cadena:

```js
.expect('Content-Type', 'application/json')
```

El problema, es que si usamos cadenas el valor del encabezado debe ser exactamente el mismo. Para la expresión que definimos, es suficiente que el encabezado <i>contenga</i> la cadena en cuestión. Por ejemplo, el valor actual del encabezado puede ser <i>application/json; charset=utf-8</i> ya que también tiene información de la codificación de caracteres (utf-8). Sin embargo, nuestra prueba no está interesada en esto y, por lo tanto, es mejor definir la prueba como una expresión regular en lugar verificar una cadena exacta.

La prueba contiene algunos detalles que exploraremos [un poco más adelante](/es/part4/probando_el_backend#async-await). La función de flecha que define la prueba está precedida por la palabra clave <i>async</i> y la llamada al método para el objeto <i>api</i> está precedida por la palabra clave <i>await</i>. Escribiremos algunas pruebas y luego echaremos un vistazo más de cerca a esta magia de async/await. No te preocupes por esto por ahora, solo ten la seguridad de que las pruebas de ejemplo funcionan correctamente. La sintaxis async/await está relacionada con el hecho de que hacer una solicitud a la API es una operación <i>asíncrona</i>. La [sintaxis async/await](https://jestjs.io/es-ES/docs/asynchronous) se puede utilizar para escribir código asíncrono con la apariencia de código síncrono.

Una vez que todas las pruebas (actualmente solo hay una) hayan terminado de ejecutarse, tenemos que cerrar la conexión a la base de datos utilizada por Mongoose. Esto se puede lograr fácilmente con el método [afterAll](https://jestjs.io/es-ES/docs/api#afterallfn-tiempo):

```js
afterAll(() => {
  mongoose.connection.close()
})
```

Al ejecutar las pruebas, es posible que te encuentres con la siguiente advertencia de consola:

![consola de jest advirtiendo acerca de no haber salido luego de la ejecución de la prueba](../../images/4/8.png)

Es muy probable que el problema sea causado por Mongoose versión 6.x, el problema no aparece cuando se usa la versión 5.x o 7.x. [La documentación de Mongo](https://mongoosejs.com/docs/jest.html) no recomienda probar nuestras aplicaciones Mongoose con Jest.

[Una forma](https://stackoverflow.com/questions/50687592/jest-and-mongoose-jest-has-detected-opened-handles) de no tener este error es agregar dentro del directorio <i>tests</i> el archivo <i>teardown.js</i> con el siguiente contenido:

```js
module.exports = () => {
  process.exit(0)
}
```

Y extendiendo la definición de Jest en el archivo <i>package.json</i> como se muestra a continuación

```js
{
 //...
 "jest": {
   "testEnvironment": "node",
   "globalTeardown": "./tests/teardown.js" // highlight-line
 }
}
```

Otro error que puedes encontrar, es que tu prueba tome más tiempo que el tiempo predeterminado de Jest de 5000 ms. Esto se puede resolver agregando un tercer parámetro a la función de prueba:
  
```js
test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 100000) // highlight-line
```
  
Este tercer parámetro establece el tiempo de espera en 100000 ms. Un tiempo de espera largo garantiza que nuestra prueba no falle debido al tiempo que tarda en ejecutarse. (Un tiempo de espera largo puede no ser adecuado para pruebas basadas en rendimiento o velocidad, pero está bien para nuestros ejemplos de prueba).

Si aún encuentras problemas con los tiempos de espera de mongoose, establece la variable `bufferTimeoutMS` en un valor significativamente mayor que 10000 (10 segundos). Puedes establecerlo de la siguiente manera en la parte superior, justo después de las declaraciones `require`. `mongoose.set("bufferTimeoutMS", 30000)`

Un pequeño pero importante detalle: al [principio](/es/part4/estructura_de_la_aplicacion_backend_introduccion_a_las_pruebas#estructura-del-proyecto) de esta parte extrajimos la aplicación Express en el archivo <i>app.js</i>, y el rol del archivo <i>index.js</i> se cambió para iniciar la aplicación en el puerto especificado a través de `app.listen`:

```js
const app = require('./app') // la aplicación Express
const config = require('./utils/config')
const logger = require('./utils/logger')

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

> *si el servidor aún no está escuchando conexiones, entonces se vincula a un puerto efímero automáticamente, por lo que no es necesario hacer un seguimiento de los puertos.*

En otras palabras, supertest se encarga de que la aplicación que se está probando se inicie en el puerto que utiliza internamente.

Agreguemos dos notas a la base de datos de prueba utilizando el programa _mongo.js_ (aquí debemos recordar cambiar a la URL correcta de la base de datos).

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

Ambas pruebas almacenan la respuesta de la solicitud en la variable _response_, y a diferencia de la prueba anterior que utilizó los métodos proporcionados por _supertest_ para verificar el código de estado y los encabezados, esta vez estamos inspeccionando los datos de respuesta almacenados en la propiedad <i>response.body</i>. Nuestras pruebas verifican el formato y el contenido de los datos de respuesta con el método [expect](https://jestjs.io/es-ES/docs/expect#expectvalue) de Jest.

El beneficio de usar la sintaxis async/await está comenzando a ser evidente. Normalmente tendríamos que usar funciones callback para acceder a los datos devueltos por las promesas, pero con la nueva sintaxis las cosas son mucho más cómodas:

```js
const response = await api.get('/api/notes')

// la ejecución llega aquí solo después de que se completa la solicitud HTTP
// el resultado de la solicitud HTTP se guarda en la variable response
expect(response.body).toHaveLength(2)
```

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
  // highlight-start
  if (process.env.NODE_ENV !== 'test') { 
    console.error(...params)
  }
  // highlight-end  
}

module.exports = {
  info, error
}
```

### Inicializando la base de datos antes de las pruebas

Testing parece ser fácil y actualmente nuestras pruebas están pasando. Sin embargo, nuestras pruebas son malas ya que dependen del estado de la base de datos, que ahora tiene dos notas. Para hacerlas más robustas, debemos resetear la base de datos y generar los datos de prueba necesarios de manera controlada antes de ejecutar las pruebas.

Nuestras pruebas ya están usando la función [afterAll](https://jestjs.io/es-ES/docs/api#afterallfn-tiempo) de Jest para cerrar la conexión a la base de datos después de que las pruebas hayan terminado de ejecutarse . Jest ofrece muchas otras [funciones](https://jestjs.io/es-ES/docs/setup-teardown) que se pueden usar para ejecutar operaciones una vez antes de que se ejecute cualquier prueba, o cada vez antes de que se ejecuta una prueba.

Inicialicemos la base de datos <i>antes de cada prueba</i> con la función [beforeEach](https://jestjs.io/es-ES/docs/api#beforeeachfn-tiempo):

```js
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
// highlight-start
const Note = require('../models/note')
// highlight-end

// highlight-start
const initialNotes = [
  {
    content: 'HTML is easy',
    important: false,
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true,
  },
]
// highlight-end

// highlight-start
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
test('all notes are returned', async () => { // highlight-line
  const response = await api.get('/api/notes')

  expect(response.body).toHaveLength(initialNotes.length) // highlight-line
})

test('a specific note is within the returned notes', async () => { // highlight-line
  const response = await api.get('/api/notes')

  // highlight-start
  const contents = response.body.map(r => r.content)

  expect(contents).toContain(
    'Browser can execute only JavaScript'
  )
  // highlight-end
})
```

Presta atención especialmente al expect en la última prueba. El comando <code>response.body.map (r => r.content)</code> se usa para crear una matriz que contiene el contenido de cada nota devuelta por la API. El método [toContain](https://jestjs.io/es-ES/docs/expect#tocontainitem) se utiliza para comprobar que la nota que se le ha asignado como parámetro está en la lista de notas devueltas por la API.

### Ejecución de pruebas una por una

El comando _npm test_ ejecuta todas las pruebas de la aplicación. Cuando escribimos pruebas, generalmente es aconsejable ejecutar solo una o dos pruebas. Jest ofrece algunas formas diferentes de lograr esto, una de las cuales es el método [only](https://jestjs.io/es-ES/docs/api#testonlyname-fn-tiempo). Si las pruebas se escriben en muchos archivos, este método no es el mejor.

Una mejor opción es especificar las pruebas que deben ejecutarse como parámetro del comando <i>npm test</i>.

El siguiente comando solo ejecuta las pruebas que se encuentran en el archivo <i>tests/ note_api.test.js</i>:

```js
npm test -- tests/note_api.test.js
```

La opción <i>-t</i> se puede utilizar para ejecutar pruebas con un nombre específico:

```js
npm test -- -t 'a specific note is within the returned notes'
```

El parámetro proporcionado puede hacer referencia al nombre de la prueba o al bloque describe. El parámetro también puede contener solo una parte del nombre. El siguiente comando ejecutará todas las pruebas que contengan <i>notes</i> en su nombre:

```js
npm test -- -t 'notes'
```

**NB**: Cuando se ejecuta una sola prueba, la conexión de mongoose puede permanecer abierta si no se ejecuta ninguna prueba que utilize la conexión.
El problema puede deberse al hecho de que supertest prepara la conexión, pero jest no ejecuta la parte afterAll del código.

### async/await

Antes de escribir más pruebas, echemos un vistazo a las palabras clave _async_ y _await_.

La sintaxis async/await que se introdujo en ES7 hace posible el uso de <i>funciones asíncronas que devuelven una promesa</i> de una manera que hace que el código parezca síncrono.

Como ejemplo, la obtención de notas de la base de datos con promesas se ve así:

```js
Note.find({}).then(notes => {
  console.log('operation returned the following notes', notes)
})
```

El método _Note.find()_ devuelve una promesa y podemos acceder al resultado de la operación registrando una función callback con el método _then_.

Todo el código que queremos ejecutar una vez que finalice la operación está escrito en la función callback. Si quisiéramos realizar varias llamadas a funciones asíncronas en secuencia, la situación pronto se volvería dolorosa. Las llamadas asíncronas deberían realizarse en el callback. Esto probablemente conduciría a un código complicado y podría potencialmente dar lugar a un llamado [infierno de callbacks](http://callbackhell.com/).

Al [encadenar promesas](https://es.javascript.info/promise-chaining) podríamos mantener la situación un poco bajo control y evitar el infierno de callbacks creando una cadena bastante limpia de llamadas a métodos _then_. Hemos visto algunos de estos durante el curso. Para ilustrar esto, puedes ver un ejemplo artificial de una función que recupera todas las notas y luego elimina la primera:

```js
Note.find({})
  .then(notes => {
    return notes[0].remove()
  })
  .then(response => {
    console.log('the first note is removed')
    // más código aquí
  })
```

La cadena de then está bien, pero podemos hacerlo mejor. Las [funciones de generadores](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Generator) introducidas en ES6 proporcionaron una [forma inteligente](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/async%20%26%20performance/ch4.md#iterating-generators-asynchronously) de escribir código asíncrono de una manera que "parezca síncrona". La sintaxis es un poco torpe y no se usa mucho.

Las palabras clave _async_ y _await_ introducidas en ES7 traen la misma funcionalidad que los generadores, pero de una manera comprensible y sintácticamente más limpia a las manos de todos los ciudadanos del mundo JavaScript.

Podríamos obtener todas las notas en la base de datos utilizando un operador [await](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/await) cómo este:

```js
const notes = await Note.find({})

console.log('operation returned the following notes', notes)
```

El código se ve exactamente como el código síncrono. La ejecución del código se detiene en <em>const notes = await Note.find({})</em> y espera hasta que se <i>cumpla</i> la promesa relacionada, y luego continúa su ejecución a la siguiente línea. Cuando la ejecución continúa, el resultado de la operación que devolvió una promesa se asigna a la variable _notes_.

El ejemplo que era un poco complicado presentado anteriormente podría implementarse usando await así:

```js
const notes = await Note.find({})
const response = await notes[0].remove()

console.log('the first note is removed')
```

Gracias a la nueva sintaxis, el código es mucho más simple que la cadena then anterior.

Hay algunos detalles importantes a los que se debe prestar atención cuando se usa la sintaxis async/await. Para utilizar el operador await con operaciones asíncronas, estas deben devolver una promesa. Esto no es un problema como tal, ya que las funciones asíncronas regulares que utilizan callbacks son fáciles de envolver en promesas.

La palabra clave await no se puede usar en cualquier parte del código JavaScript. El uso de await solo es posible dentro de una función [async](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/async_function).

Esto significa que para que los ejemplos anteriores funcionen, deben utilizar funciones asíncronas. Observa la primera línea en la definición de la función de flecha:

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

Cambiemos el backend a async y await. Como todas las operaciones asíncronas se realizan actualmente dentro de una función, es suficiente cambiar las funciones de los controladores de ruta a funciones asíncronas.

La ruta para obtener todas las notas se cambia a lo siguiente:

```js
notesRouter.get('/', async (request, response) => { 
  const notes = await Note.find({})
  response.json(notes)
})
```

Podemos verificar que nuestra refactorización fue exitosa probando el endpoint a través del navegador y ejecutando las pruebas que escribimos anteriormente. 

Puedes encontrar el código para nuestra aplicación actual en su totalidad en la rama <i>part4-3</i> de [este repositorio de GitHub](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-3).

### Más pruebas y refactorización del backend

Cuando el código se refactoriza, siempre existe el riesgo de [regresión](https://es.wikipedia.org/wiki/Pruebas_de_regresi%C3%B3n), lo que significa que la funcionalidad existente puede romperse. Refactoricemos las operaciones restantes escribiendo primero una prueba para cada ruta de la API.

Comencemos con la operación para agregar una nueva nota. Escribamos una prueba que agregue una nueva nota y verifique que la cantidad de notas devueltas por la API aumenta y que la nota recién agregada esté en la lista.

```js
test('a valid note can be added', async () => {
  const newNote = {
    content: 'async/await simplifies making async calls',
    important: true,
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/notes')

  const contents = response.body.map(r => r.content)

  expect(response.body).toHaveLength(initialNotes.length + 1)
  expect(contents).toContain(
    'async/await simplifies making async calls'
  )
})
```

La prueba falla ya que por accidente estamos devolviendo el código de estado 200 OK cuando se crea una nueva nota. Cambiemos eso a 201 CREATED:

```js
notesRouter.post('/', (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save()
    .then(savedNote => {
      response.status(201).json(savedNote) // highlight-line
    })
    .catch(error => next(error))
})
```

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
    important: false
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true
  }
]

const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon' })
  await note.save()
  await note.deleteOne()

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
    'Browser can execute only JavaScript'
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
    .expect(201)
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

afterAll(async () => {
  await mongoose.connection.close()
})
```

El código que usa promesas funciona y las pruebas pasan. Estamos listos para refactorizar nuestro código para usar la sintaxis async/await.

Realizamos los siguientes cambios en el código que se encarga de agregar una nueva nota (observa que la definición del controlador de ruta está precedida por la palabra clave _async_):

```js
notesRouter.post('/', async (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  const savedNote = await note.save()
  response.status(201).json(savedNote)
})
```

Hay un pequeño problema con nuestro código: no manejamos situaciones de error. ¿Cómo debemos lidiar con ellos?

### Manejo de errores y async/await

Si hay una excepción al manejar la solicitud POST terminamos en una situación familiar:

![terminal mostrando advertencia de promesa rechazada sin gestionar](../../images/4/6.png)

En otras palabras, terminamos con un rechazo de promesa no gestionado, y la solicitud nunca recibe una respuesta.

Con async/await, la forma recomendada de lidiar con las excepciones es el viejo y familiar mecanismo _try/catch_:

```js
notesRouter.post('/', async (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })
  // highlight-start
  try {
    const savedNote = await note.save()
    response.status(201).json(savedNote)
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

  expect(resultNote.body).toEqual(noteToView)
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

Ambas pruebas comparten una estructura similar. En la fase de inicialización, obtienen una nota de la base de datos. Después de esto, las pruebas llaman a la operación que se está probando, que se resalta en el bloque de código. Por último, las pruebas verifican que el resultado de la operación sea el esperado.

Las pruebas pasan y podemos refactorizar con seguridad las rutas probadas para usar async/await:

```js
notesRouter.get('/:id', async (request, response, next) => {
  try {
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
    await Note.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch(exception) {
    next(exception)
  }
})
```

Puedes encontrar el código para nuestra aplicación actual en su totalidad en la rama <i>part4-4</i> de [este repositorio de GitHub](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-4).

### Eliminando el try-catch

Async/await despeja un poco el código, pero el 'precio' es la estructura <i>try/catch</i> necesaria para detectar excepciones.
Todos los controladores de ruta siguen la misma estructura

```js
try {
  // realiza las operaciones asíncronas aquí
} catch(exception) {
  next(exception)
}
```

Uno comienza a preguntarse, ¿sería posible refactorizar el código para eliminar el <i>catch</i> de los métodos?

La librería [express-async-errors](https://github.com/davidbanham/express-async-errors) tiene una solución para esto.

Vamos a instalarla

```bash
npm install express-async-errors
```

Usarla es <i>muy</i> fácil.
Introduce la librería en <i>app.js</i>, _antes_ de que importes tus rutas:

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

La 'magia' de esta librería nos permite eliminar por completo los bloques try-catch.
Por ejemplo, la ruta para eliminar una nota

```js
notesRouter.delete('/:id', async (request, response, next) => {
  try {
    await Note.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})
```

se convierte en

```js
notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndDelete(request.params.id)
  response.status(204).end()
})
```

Debido a express-async-errors, ya no necesitamos la llamada a _next(exception)_.
La librería se encarga de todo lo que hay debajo del capó. Si ocurre una excepción en una ruta <i>async</i>, la ejecución se pasa automáticamente al middleware de manejo de errores.

Las otras rutas se convierten en:

```js
notesRouter.post('/', async (request, response) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  const savedNote = await note.save()
  response.status(201).json(savedNote)
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

### Optimización de la función beforeEach

Volvamos a escribir nuestras pruebas y echemos un vistazo más de cerca a la función _beforeEach_ que las configura:

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

El problema es que cada iteración del bucle forEach genera su propia operación asíncrona, y _beforeEach_ no esperará a que terminen de ejecutarse. En otras palabras, los comandos _await_ definidos dentro del bucle _forEach_ no están en la función _beforeEach_, sino en funciones separadas que _beforeEach_ no esperará.

Dado que la ejecución de las pruebas comienza inmediatamente después de que _beforeEach_ haya terminado de ejecutarse, la ejecución de las pruebas comienza antes de que se inicialice el estado de la base de datos.

Una forma de arreglar esto es esperar a que todas las operaciones asíncronas terminen de ejecutarse con el método [Promise.all](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Promise/all):

```js
beforeEach(async () => {
  await Note.deleteMany({})

  const noteObjects = helper.initialNotes
    .map(note => new Note(note))
  const promiseArray = noteObjects.map(note => note.save())
  await Promise.all(promiseArray)
})
```

La solución es bastante avanzada a pesar de su apariencia compacta. La variable _noteObjects_ se asigna a una matriz de objetos Mongoose que se crean con el constructor _Note_ para cada una de las notas en la matriz _helper.initialNotes_. La siguiente línea de código crea una nueva matriz que <i>consiste en promesas</i>, que se crean llamando al método _save_ de cada elemento en la matriz _noteObjects_. En otras palabras, es una serie de promesas para guardar cada uno de los elementos en la base de datos.

El método [Promise.all](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) se puede utilizar para transformar una serie de promesas en una única promesa, que se <i>cumplirá</i> una vez que se resuelva cada promesa en la matriz que se le pasa como parámetro. La última línea de código <em>await Promise.all(promiseArray)</em> espera a que finalice cada promesa de guardar una nota, lo que significa que la base de datos se ha inicializado.

> Aún se puede acceder a los valores devueltos de cada promesa en la matriz cuando se usa el método Promise.all. Si esperamos a que se resuelvan las promesas con la sintaxis _await_ <em>const results = await Promise.all(promiseArray)</em>, la operación devolverá una matriz que contiene los valores resueltos para cada promesa en _promiseArray_, y aparecen en el mismo orden que las promesas en la matriz.

Promise.all ejecuta las promesas que recibe en paralelo. Si las promesas deben ejecutarse en un orden particular, esto será problemático. En situaciones como esta, las operaciones se pueden ejecutar dentro de un [for...of](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/for...of), que garantiza un orden de ejecución especifico.

```js
beforeEach(async () => {
  await Note.deleteMany({})

  for (let note of helper.initialNotes) {
    let noteObject = new Note(note)
    await noteObject.save()
  }
})
```

La naturaleza asíncrona de JavaScript puede llevar a un comportamiento sorprendente y, por esta razón, es importante prestar mucha atención al usar la sintaxis async/await. Aunque la sintaxis hace que sea más fácil lidiar con las promesas, ¡es necesario entender cómo funcionan las promesas!

El código de nuestra aplicación se puede encontrar en [GitHub](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-5), en la rama <i>part4-5</i>.

### El juramento de un verdadero desarrollador full stack

Realizar pruebas añade otro nivel de desafío a la programación. Debemos actualizar nuestro juramento como desarrolladores full stack para recordar que la sistematicidad también es clave al desarrollar pruebas.

Por lo tanto, debemos extender nuestro juramento una vez más:

El desarrollo full stack es <i> extremadamente difícil </i>, por eso usaré todos los medios posibles para hacerlo más fácil:

- Mantendré la consola de desarrollador del navegador abierta todo el tiempo
- Usaré la pestaña "Network" dentro de las herramientas de desarrollo del navegador, para asegurarme que el frontend y el backend se comuniquen como espero
- Mantendré constantemente un ojo en el estado del servidor, para asegurarme de que los datos enviados allí por el frontend se guarden como espero
- Vigilaré la base de datos para confirmar que los datos enviados por el backend se guarden en el formato correcto
- Progresaré en pequeños pasos
- <i>Escribiré muchos console.log para asegurarme de que entiendo cómo se comporta el código y las pruebas; y para ayudarme a identificar problemas</i>
- Si mi código no funciona, no escribiré más código. En su lugar, comenzaré a eliminar código hasta que funcione o simplemente volveré a un estado en el que todo todavía funcionaba
- <i>Si una prueba no pasa, me aseguraré de que la funcionalidad probada funcione correctamente en la aplicación</i>
- Cuando pido ayuda en el canal Discord o Telegram del curso, o en otro lugar, formularé mis preguntas correctamente, ve [aquí](/es/part0/informacion_general#como-obtener-ayuda-en-discord-telegram) cómo pedir ayuda

</div>

<div class="tasks">

### Ejercicios 4.8.-4.12.

**NB:** el material usa el comparador [toContain](https://jestjs.io/es-ES/docs/expect#tocontainitem) en varios lugares para verificar que una matriz contiene un elemento específico. Vale la pena señalar que el método utiliza el operador === para comparar y hacer coincidir elementos, lo que significa que a menudo no es adecuado para hacer coincidir objetos. En la mayoría de los casos, el método apropiado para verificar objetos en matrices es el comparador [toContainEqual](https://jestjs.io/es-ES/docs/expect#tocontainequalitem). Sin embargo, las soluciones del modelo no comprueban objetos en matrices con comparadores, por lo que no es necesario utilizar el método para resolver los ejercicios.

**Advertencia:** Si te encuentras utilizando los métodos async/await y <i>then</i> en el mismo código, es casi seguro que estás haciendo algo mal. Usa uno u otro y no mezcles los dos.

#### 4.8: Pruebas de Lista de Blogs, paso 1

Utiliza el paquete supertest para escribir una prueba que realice una solicitud HTTP GET a la URL <i>/api/blogs</i>. Verifica que la aplicación de la lista de blogs devuelva la cantidad correcta de publicaciones de blog en formato JSON.

Una vez finalizada la prueba, refactoriza el controlador de ruta para usar la sintaxis async/await en lugar de promesas.

Ten en cuenta que tendrás que realizar cambios similares en el código a los que fueron hechos [en el material](/es/part4/probando_el_backend#entorno-de-prueba), como definir el entorno de prueba para que puedas escribir pruebas que usan una base de datos separada.

**NB:** Al ejecutar las pruebas, es posible que te encuentres con la siguiente advertencia:

![advertencia para leer la documentación acerca de conectar a mongoose con jest](../../images/4/8a.png)

[Una forma](https://stackoverflow.com/questions/50687592/jest-and-mongoose-jest-has-detected-opened-handles) de no tener este error es agregar dentro del directorio <i>tests</i> el archivo <i>teardown.js</i> con el siguiente contenido:

```js
module.exports = () => {
  process.exit(0)
}
```

Y extender la definición de Jest en el archivo <i>package.json</i> como se muestra a continuación

```js
{
 //...
 "jest": {
   "testEnvironment": "node",
   "globalTeardown": "./tests/teardown.js" // highlight-line
 }
}
```

**NB:** cuando estás escribiendo tus pruebas **<i>es mejor no ejecutarlas todas</i>**, solo ejecuta aquellas en las que estás trabajando. Lee más sobre esto [aquí](/es/part4/probando_el_backend#ejecucion-de-pruebas-una-por-una).

#### 4.9: Pruebas de Lista de Blogs, paso 2

Escribe una prueba que verifique que la propiedad de identificador único de las publicaciones del blog se llame <i>id</i>, de manera predeterminada, la base de datos nombra la propiedad <i>_id</i>. La verificación de la existencia de una propiedad se realiza fácilmente con el comparador [toBeDefined](https://jestjs.io/es-ES/docs/expect#tobedefined) de Jest.

Realiza los cambios necesarios en el código para que pase la prueba. El método [toJSON](/es/part3/guardando_datos_en_mongo_db#backend-conectado-a-una-base-de-datos) discutido en la parte 3 es un lugar apropiado para definir el parámetro <i>id</i>.

#### 4.10: Pruebas de Lista de Blogs, paso 3

Escribe una prueba que verifique que al realizar una solicitud HTTP POST a la URL <i>/api/blogs</i> se crea correctamente una nueva publicación de blog. Como mínimo, verifica que el número total de blogs en el sistema se incrementa en uno. También puedes verificar que el contenido de la publicación del blog se guarde correctamente en la base de datos.

Una vez finalizada la prueba, refactoriza la operación para usar async/await en lugar de promesas.

#### 4.11*: Pruebas de Lista de Blogs, paso 4

Escribe una prueba que verifique que si la propiedad <i>likes</i> falta en la solicitud, tendrá el valor 0 por defecto. No pruebes las otras propiedades de los blogs creados todavía.

Realiza los cambios necesarios en el código para que pase la prueba.

#### 4.12*: Pruebas de lista de blogs, paso 5

Escribe una prueba relacionada con la creación de blogs nuevos a través del endpoint <i>/api/blogs</i>, que verifique que si faltan las propiedades <i>title</i> o <i>url</i> de los datos solicitados, el backend responde a la solicitud con el código de estado <i>400 Bad Request</i>.

Realiza los cambios necesarios en el código para que pase la prueba.

</div>

<div class="content">

### Refactorizando pruebas

Actualmente, a nuestras pruebas les falta cobertura. Algunas solicitudes como <i> GET /api/notes/:id </i> y <i> DELETE /api/notes/:id </i> no se prueban cuando la solicitud se envía con una identificación no válida. La agrupación y organización de las pruebas también podría mejorar, ya que todas las pruebas existen en el mismo "nivel superior" en el archivo de prueba. La legibilidad de la prueba mejoraría si agrupamos las pruebas relacionadas en bloques <i>describe</i>.

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
  await Note.insertMany(helper.initialNotes)
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
      'Browser can execute only JavaScript'
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

    expect(resultNote.body).toEqual(noteToView)
  })

  test('fails with statuscode 404 if note does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()

    await api
      .get(`/api/notes/${validNonexistingId}`)
      .expect(404)
  })

  test('fails with statuscode 400 if id is invalid', async () => {
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
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const notesAtEnd = await helper.notesInDb()
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)

    const contents = notesAtEnd.map(n => n.content)
    expect(contents).toContain(
      'async/await simplifies making async calls'
    )
  })

  test('fails with status code 400 if data invalid', async () => {
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

afterAll(async () => {
  await mongoose.connection.close()
})
```

La salida de las pruebas en la consola se agrupa de acuerdo con los bloques <i>describe</i>:

![salida de jest mostrando bloques describe agrupados](../../images/4/7.png)

Todavía hay margen de mejora, pero es hora de seguir adelante.

Esta forma de probar la API, al realizar solicitudes HTTP e inspeccionar la base de datos con Mongoose, no es de ninguna manera la única ni la mejor forma de realizar pruebas de integración a nivel de API para aplicaciones de servidor. No existe una mejor forma universal de escribir pruebas, ya que todo depende de la aplicación que se esté probando y de los recursos disponibles.

Puedes encontrar el código para nuestra aplicación actual en su totalidad en la rama <i>part4-6</i> de [este repositorio de GitHub](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-6).

</div>

<div class="tasks">

### Ejercicios 4.13.-4.14.

#### 4.13 Expansiones de la Lista de Blogs, paso 1

Implementa la funcionalidad para eliminar un solo recurso de publicación de blog.

Utiliza la sintaxis async/await. Sigue las convenciones de [RESTful](/es/part3/node_js_y_express#rest) al definir la API HTTP.

Implementa pruebas para esta funcionalidad.

#### 4.14 Expansiones de Listas de Blogs, paso 2

Implementa la funcionalidad para actualizar la información de una publicación de blog individual.

Utiliza async/await.

La aplicación principalmente necesita actualizar la cantidad de <i>likes</i> para una publicación de blog. Puedes implementar esta funcionalidad de la misma manera que implementamos actualizar notas en la [parte 3](/es/part3/guardando_datos_en_mongo_db#otras-operaciones).

Implementa pruebas para esta funcionalidad.

</div>
