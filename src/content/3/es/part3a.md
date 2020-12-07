---
mainImage: ../../../images/part-3.svg
part: 3
letter: a
lang: es
---

<div class="content">

En esta parte, nuestro enfoque se desplaza hacia el backend: es decir, hacia la implementación de la funcionalidad en el lado del servidor.


Construiremos nuestro backend sobre [NodeJS](https://nodejs.org/en/), que es un entorno en tiempo de ejecución basado en JavaScript y en el motor [Chrome V8](https://developers.google.com/v8/) de Google.


Este material del curso fue escrito con la versión <i>v10.18.0</i> de Node.js. Asegúrese de que su versión de Node sea al menos tan nueva como la versión utilizada en el material (puede verificar la versión ejecutando _node -v_ en la línea de comando).


Como se mencionó en la [parte 1](/es/part1/java_script), los navegadores aún no son compatibles con las funciones más nuevas de JavaScript, y es por eso que el código que se ejecuta en el navegador debe <i>transpilarse</i> con, por ejemplo, [babel](https://babeljs.io/). La situación con JavaScript ejecutándose en el backend es diferente. La versión más reciente de Node es compatible con la gran mayoría de las funciones más recientes de JavaScript, por lo que podemos usar las funciones más recientes sin tener que transpilar nuestro código.


Nuestro objetivo es implementar un backend que funcione con la aplicación de notas de la [parte 2](/es/part2/). Sin embargo, comencemos con lo básico implementando una aplicación clásica de "hola mundo".


**Tenga en cuenta** que las aplicaciones y ejercicios de esta parte no son todas aplicaciones de React, y no usaremos la utilidad <i>create-react-app</i> para inicializar el proyecto para esta aplicación.


Ya habíamos mencionado [npm](/es/part2/getting_data_from_server#npm) en la parte 2, que es una herramienta utilizada para administrar paquetes de JavaScript. De hecho, npm se origina en el ecosistema Node.


Naveguemos a un directorio apropiado y creemos una nueva plantilla para nuestra aplicación con el comando _npm init_. Responderemos a las preguntas presentadas por la utilidad y el resultado será un archivo <i>package.json</i> generado automáticamente en la raíz del proyecto, que contiene información sobre el proyecto.

```json
{
  "name": "backend",
  "version": "0.0.1",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Matti Luukkainen",
  "license": "MIT"
}
```


El archivo define, por ejemplo, que el punto de entrada de la aplicación es el archivo <i>index.js</i>.


Hagamos un pequeño cambio en el objeto <i>scripts</i>:

```bash
{
  // ...
  "scripts": {
    "start": "node index.js", // highlight-line
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  // ...
}
```


A continuación, creemos la primera versión de nuestra aplicación agregando un archivo index.js a la raíz del proyecto con el siguiente código:

Next, let's create the first version of our application by adding an <i>index.js</i> file to the root of the project with the following code:

```js
console.log('hello world')
```


Podemos ejecutar el programa directamente con Node desde la línea de comando:

```bash
node index.js
```


O podemos ejecutarlo como un [script npm](https://docs.npmjs.com/misc/scripts):


```bash
npm start
```


El script npm <i>start</i> funciona porque lo definimos en el archivo <i>package.json</i>:

```bash
{
  // ...
  "scripts": {
    "start": "node index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  // ...
}
```


Aunque la ejecución del proyecto funciona cuando se inicia llamando a _node index.js_ desde la línea de comando, es habitual que los proyectos npm ejecuten estas tareas como scripts npm.

De forma predeterminada, el archivo <i>package.json</i> también define otro script npm de uso común llamado <i>npm test</i>. Dado que nuestro proyecto aún no tiene una biblioteca de testing, el comando _npm test_ simplemente ejecuta el siguiente comando:

```bash
echo "Error: no test specified" && exit 1
```


### Servidor web simple

Cambiemos la aplicación a un servidor web:

```js
const http = require('http')

const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('Hello World')
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
```

Una vez que la aplicación se está ejecutando, el siguiente mensaje se imprime en la consola:

```bash
Server running on port 3001
```

Podemos abrir nuestra humilde aplicación en el navegador visitando la dirección <http://localhost:3001>:

![](../../images/3/1.png)

De hecho, el servidor funciona de la misma manera independientemente de la última parte de la URL. Además, la dirección <http://localhost:3001/foo/bar> mostrará el mismo contenido.

**NB** si el puerto 3001 ya está siendo utilizado por alguna otra aplicación, al iniciar el servidor aparecerá el siguiente mensaje de error:

```bash
➜  hello npm start

> hello@1.0.0 start /Users/mluukkai/opetus/_2019fullstack-code/part3/hello
> node index.js

Server running on port 3001
events.js:167
      throw er; // Unhandled 'error' event
      ^

Error: listen EADDRINUSE :::3001
    at Server.setupListenHandle [as _listen2] (net.js:1330:14)
    at listenInCluster (net.js:1378:12)
```


Tienes dos opciones. Apague la aplicación usando el puerto 3001 (el servidor json en la última parte del material estaba usando el puerto 3001), o use un puerto diferente para esta aplicación.

Echemos un vistazo más de cerca a la primera línea del código:

```js
const http = require('http')
```

En la primera fila, la aplicación importa el módulo de [servidor web](https://nodejs.org/docs/latest-v8.x/api/http.html) integrado de Node. Esto es prácticamente lo que ya hemos estado haciendo en nuestro código del lado del navegador, pero con una sintaxis ligeramente diferente:

```js
import http from 'http'
```

En estos días, el código que se ejecuta en el navegador utiliza módulos ES6. Los módulos se definen con un [export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) y se utilizan con un [import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import).

Sin embargo, Node.js usa los llamados módulos [CommonJS](https://en.wikipedia.org/wiki/CommonJS). La razón de esto es que el ecosistema de Node necesitaba módulos mucho antes de que JavaScript los admitiera en la especificación del lenguaje. En el momento de escribir este material, Node no es compatible con los módulos ES6, pero el soporte para ellos [llegará](https://nodejs.org/api/esm.html) en algún momento.

Los módulos de CommonJS funcionan casi exactamente como los módulos de ES6, al menos en lo que respecta a nuestras necesidades en este curso.

El siguiente fragmento de nuestro código se ve así:

```js
const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('Hello World')
})
```

El código usa el método _createServer_ del módulo [http](https://nodejs.org/docs/latest-v8.x/api/http.html) para crear un nuevo servidor web. Se registra un <i>controlador de eventos</i> en el servidor, que se llama <i>cada vez</i> que se realiza una solicitud HTTP a la dirección del servidor http://localhost:3001.

La solicitud se responde con el código de estado 200, con el header <i>Content-Type</i> establecido en <i>text/plain</i>, y el contenido del sitio que se devolverá establecido en <i>Hello World</i>.

Las últimas filas enlazan el servidor http asignado a la variable _app_, para escuchar las solicitudes HTTP enviadas al puerto 3001:

```js
const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
```


El propósito principal del servidor backend en este curso es ofrecer datos sin procesar en formato JSON al frontend. Por esta razón, cambiemos inmediatamente nuestro servidor para devolver una lista codificada de notas en formato JSON:

```js
const http = require('http')

// highlight-start
let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2019-05-30T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2019-05-30T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true
  }
]

const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify(notes))
})
// highlight-end

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
```

Reiniciemos el servidor (puede apagar el servidor presionando _Ctrl+C_ en la consola) y actualice el navegador.

El valor <i>application/json</i> en el header <i>Content-Type</i> informa al receptor que los datos están en formato JSON. El arrray _notes_ de notas se transforma en JSON con el método <em>JSON.stringify(notes)</em>.

Cuando abrimos el navegador, el formato que se muestra es exactamente el mismo que en la [parte 2](/es/part2/getting_data_from_server/), donde usamos [json-server](https://github.com/typicode/json-server) para entregar la lista de notas:

![](../../images/3/2e.png)

### Express

Es posible implementar nuestro código de servidor directamente con el servidor web [http](https://nodejs.org/docs/latest-v8.x/api/http.html) integrado de Node. Sin embargo, es engorroso, especialmente una vez que la aplicación aumenta de tamaño.

Se han desarrollado muchas bibliotecas para facilitar el desarrollo del lado del servidor con Node, al ofrecer una interfaz más agradable para trabajar con el módulo http integrado. Estas bibliotecas tienen como objetivo proporcionar una mejor abstracción para los casos de uso general que generalmente requerimos para construir un servidor backend. Por lejos, la biblioteca más popular destinada a este propósito es [express](http://expressjs.com).

Usemos express definiéndolo como una dependencia del proyecto con el comando:

```bash
npm install express
```

La dependencia también se agrega a nuestro archivo <i>package.json</i>:

```json
{
  // ...
  "dependencies": {
    "express": "^4.17.1"
  }
}

```


El código fuente de la dependencia se instala en el directorio node_modules ubicado en la raíz del proyecto. Además de express, puede encontrar una gran cantidad de otras dependencias en el directorio:

The source code for the dependency is installed to the <i>node\_modules</i> directory located in the root of the project. In addition to express, you can find a great amount of other dependencies in the directory:

![](../../images/3/4.png)


Estas son, de hecho, las dependencias de la biblioteca express y las dependencias de todas sus dependencias, etc. Estas son las [dependencias transitivas](https://lexi-lambda.github.io/blog/2016/08/24/understanding-the-npm-dependency-model/) de nuestro proyecto.

La versión 4.17.1. de express se instaló en nuestro proyecto. ¿Qué significa el signo de intercalación delante del número de versión en <i>package.json</i>?

```json
"express": "^4.17.1"
```


El modelo de control de versiones utilizado en npm se denomina control de [versiones semántico](https://docs.npmjs.com/getting-started/semantic-versioning).

El signo de intercalación al frente de <i>^4.17.1</i> significa que si y cuando se actualizan las dependencias de un proyecto, la versión de express que se instala será al menos <i>4.17.1</i>. Sin embargo, la versión instalada de express también puede ser una que tenga un número de <i>parche</i> más grande (el último número) o un número <i>menor</i> más grande (el número del medio). La versión principal de la biblioteca indicada por el primer número <i>mayor</i> debe ser la misma.

Podemos actualizar las dependencias del proyecto con el comando:

```bash
npm update
```

Asimismo, si empezamos a trabajar en el proyecto en otra computadora, podemos instalar todas las dependencias actualizadas del proyecto definidas en <i>package.json</i> con el comando:

```bash
npm install
```

Si el número <i>mayor</i> de una dependencia no cambia, las versiones más nuevas deberían ser [compatibles con versiones anteriores](https://en.wikipedia.org/wiki/Backward_compatibility). Esto significa que si nuestra aplicación usara la versión 4.99.175 de express en el futuro, entonces todo el código implementado en esta parte aún tendría que funcionar sin realizar cambios en el código. Por el contrario, la futura versión 5.0.0. de express [puede contener](https://expressjs.com/en/guide/migrating-5.html) cambios que provocarían que nuestra aplicación dejara de funcionar.

### Web y express

Volvamos a nuestra aplicación y realicemos los siguientes cambios:

```js
const express = require('express')
const app = express()

let notes = [
  ...
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```


Para poder utilizar la nueva versión de nuestra aplicación, tenemos que reiniciar la aplicación.

La aplicación no cambió mucho. Justo al comienzo de nuestro código estamos importando _express_, que esta vez es una <i>función</i> que se usa para crear una aplicación express almacenada en la variable _app_:

```js
const express = require('express')
const app = express()
```


A continuación, definimos dos <i>rutas</i> a la aplicación. El primero define un controlador de eventos, que se utiliza para manejar las solicitudes HTTP GET realizadas a la raíz <i>/</i> de la aplicación:

```js
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})
```


La función del controlador de eventos acepta dos parámetros. El primer parámetro [request](http://expressjs.com/en/4x/api.html#req) contiene toda la información de la solicitud HTTP y el segundo parámetro [response](http://expressjs.com/en/4x/api.html#res) se utiliza para definir cómo se responde a la solicitud.

En nuestro código, la solicitud se responde utilizando el método [send](http://expressjs.com/en/4x/api.html#res.send) del objeto _response_. Llamar al método hace que el servidor responda a la solicitud HTTP enviando una respuesta que contiene el string <code>\<h1>Hello World!\</h1></code>, que se pasó al método _send_. Dado que el parámetro es un string, express establece automáticamente el valor del header <i>Content-Type</i> en <i>text/html</i>. El código de estado de la respuesta predeterminado es 200.

Podemos verificar esto desde la pestaña <i>Network</i> en las herramientas para desarrolladores:


![](../../images/3/5.png)


La segunda ruta define un controlador de eventos, que maneja las solicitudes HTTP GET realizadas a la ruta <i>notes</i> de la aplicación:

```js
app.get('/api/notes', (request, response) => {
  response.json(notes)
})
```


La solicitud se responde con el método [json](http://expressjs.com/en/4x/api.html#res.json) del objeto _response_. Llamar al método enviará el array __notes__ que se le pasó como un string con formato JSON. Express establece automáticamente el header <i>Content-Type</i> con el valor apropiado de <i>application/json</i>.

![](../../images/3/6ea.png)

A continuación, echemos un vistazo rápido a los datos enviados en formato JSON.

En la versión anterior donde solo usábamos Node, teníamos que transformar los datos al formato JSON con el método _JSON.stringify_:

```js
response.end(JSON.stringify(notes))
```


Con express, esto ya no es necesario, porque esta transformación ocurre automáticamente.

Vale la pena señalar que[JSON](https://en.wikipedia.org/wiki/JSON) es un stringy no un objeto JavaScript como el valor asignado a  _notes_.

El experimento que se muestra a continuación ilustra este punto:

![](../../assets/3/5.png)


El experimento anterior se realizó en [node-repl](https://nodejs.org/docs/latest-v8.x/api/repl.html) interactivo. Puede iniciar node-repl interactivo escribiendo en _node_ en la línea de comando. repl es particularmente útil para probar cómo funcionan los comandos mientras escribe el código de la aplicación. ¡Lo recomiendo mucho!

### nodemon

Si hacemos cambios en el código de la aplicación, tenemos que reiniciar la aplicación para ver los cambios. Reiniciamos la aplicación cerrándola primero escribiendo _Ctrl+C_ y luego reiniciando la aplicación. En comparación con el conveniente flujo de trabajo en React, donde el navegador se recarga automáticamente después de realizar los cambios, esto se siente un poco engorroso.

La solución a este problema es [nodemon](https://github.com/remy/nodemon):

> <i>nodemon observará los archivos en el directorio en el que se inició nodemon, y si algún archivo cambia, nodemon reiniciará automáticamente su aplicación de node.</i>

Instalemos nodemon definiéndolo como una <i>dependencia de desarrollo</i> con el comando:

```bash
npm install --save-dev nodemon
```

El contenido de <i>package.json</i> también ha cambiado:

```json
{
  //...
  "dependencies": {
    "express": "^4.17.1",
  },
  "devDependencies": {
    "nodemon": "^2.0.2"
  }
}
```


Si usó accidentalmente el comando incorrecto y la dependencia de nodemon se agregó en "dependencias" en lugar de "devDependencies", cambie manualmente el contenido de <i>package.json</i> para que coincida con lo que se muestra arriba.

Por dependencias de desarrollo, nos referimos a herramientas que son necesarias solo durante el desarrollo de la aplicación, por ejemplo, para probar o reiniciar automáticamente la aplicación, como <i>nodemon</i>.

Estas dependencias de desarrollo no son necesarias cuando la aplicación se ejecuta en modo de producción en el servidor de producción (por ejemplo, Heroku).

Podemos iniciar nuestra aplicación con <i>nodemon</i> así:

```bash
node_modules/.bin/nodemon index.js
```


Los cambios en el código de la aplicación ahora hacen que el servidor se reinicie automáticamente. Vale la pena señalar que, aunque el servidor backend se reinicia automáticamente, el navegador aún debe actualizarse manualmente. Esto se debe a que, a diferencia de cuando se trabaja en React, ni siquiera podemos tener la funcionalidad de [recarga en caliente](https://gaearon.github.io/react-hot-loader/getstarted/) necesaria para recargar automáticamente el navegador.

El comando es largo y bastante desagradable, así que definamos un <i>script npm</i> dedicado para él en el archivo <i>package.json</i>:

```bash
{
  // ..
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  // ..
}
```


En el script no es necesario especificar la ruta <i>node\_modules/.bin/nodemon</i> a nodemon, porque _npm_ automáticamente sabe buscar el archivo desde ese directorio.

Ahora podemos iniciar el servidor en el modo de desarrollo con el comando:

```bash
npm run dev
```

A diferencia de los scripts de <i>start</i> y <i>test</i>, también tenemos que agregar <i>run</i> al comando.

### REST

Ampliemos nuestra aplicación para que proporcione la API HTTP RESTful como [json-server](https://github.com/typicode/json-server#routes).

Representational State Transfer, también conocido como REST, se introdujo en 2000 en la [disertación](https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm) de Roy Fielding . REST es un estilo arquitectónico destinado a crear aplicaciones web escalables.

No vamos a profundizar en la definición de REST de Fielding ni a perder tiempo reflexionando sobre qué es y qué no es REST. En cambio, tomamos una [visión más estrecha](https://en.wikipedia.org/wiki/Representational_state_transfer#Applied_to_web_services) al preocuparnos solo por cómo las API RESTful se entienden generalmente en las aplicaciones web. De hecho, la definición original de REST ni siquiera se limita a las aplicaciones web.

Mencionamos en la [parte anterior](/es/part2/altering_data_in_server#rest) que las cosas singulares, como las notas en el caso de nuestra aplicación, se llaman <i>recursos</i> en el pensamiento REST. Cada recurso tiene una URL asociada que es la dirección única del recurso.

Una convención es crear la dirección única para los recursos combinando el nombre del tipo de recurso con el identificador único del recurso.

Supongamos que la URL raíz de nuestro servicio es<i>www.example.com/api</i>.

Si definimos el tipo de recurso de notas a ser <i>note</i>, entonces la dirección de un recurso de nota con el identificador 10, tiene la dirección única <i>www.example.com/api/notes/10</i>.

La URL de la colección completa de todos los recursos de notas es <i>www.example.com/api/notes</i>.

Podemos ejecutar diferentes operaciones sobre recursos. La operación a ejecutar está definida por el <i>verbo</i> HTTP:


| URL                   | verbo                | funcionalidad                                                    |
| --------------------- | ------------------- | -----------------------------------------------------------------|
| notes/10              | GET                 | obtiene un solo recurso                                    |
| notes                 | GET                 | obtiene todos los recursos en una colección                          |
| notes                 | POST                | crea un nuevo recurso basado en los datos de la solicitud               |
| notes/10              | DELETE              | 	elimina el recurso identificado                                  |
| notes/10              | PUT                 | reemplaza todo el recurso identificado con los datos de la solicitud    |
| notes/10              | PATCH               | reemplaza una parte del recurso identificado con los datos de la solicitud |
|                       |                     |                                                                  |

Así es como logramos definir aproximadamente a qué se refiere REST como una [interfaz uniforme](https://en.wikipedia.org/wiki/Representational_state_transfer#Architectural_constraints), lo que significa una forma consistente de definir interfaces que hace posible que los sistemas cooperen.

Esta forma de interpretar REST cae dentro del [segundo nivel de madurez RESTful](https://martinfowler.com/articles/richardsonMaturityModel.html) en el Modelo de Madurez de Richardson. Según la definición proporcionada por Roy Fielding, en realidad no hemos definido una [API REST](http://roy.gbiv.com/untangled/2008/rest-apis-must-be-hypertext-driven). De hecho, una gran mayoría de las API "REST" supuestas del mundo no cumplen con los criterios originales de Fielding descritos en su disertación.

En algunos lugares (ver por ejemplo, [Richardson, Ruby: RESTful Web Services](http://shop.oreilly.com/product/9780596529260.do) ) verá nuestro modelo para una API [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) sencilla, que se conoce como un ejemplo de [arquitectura orientada a recursos](https://en.wikipedia.org/wiki/Resource-oriented_architecture) en lugar de REST. Evitaremos quedarnos atascados discutiendo semántica y en su lugar volveremos a trabajar en nuestra aplicación.


### Obteniendo un solo recurso

Ampliemos nuestra aplicación para que ofrezca una interfaz REST para operar con notas individuales. Primero, creemos una [ruta](http://expressjs.com/en/guide/routing.html) para buscar un solo recurso.


La dirección única que usaremos para una nota individual es de la forma <i>notes/10</i>, donde el número al final se refiere al número de id único de la nota.


Podemos definir [parámetros](http://expressjs.com/en/guide/routing.html#route-parameters) para rutas en express usando la sintaxis de dos puntos:

```js
app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => note.id === id)
  response.json(note)
})
```


Ahora <code>app.get('/api/notes/:id', ...)</code> manejará todas las solicitudes HTTP GET, que tienen el formato <i>/api/notes/SOMETHING</i>, donde <i>SOMETHING</i> es un string arbitraria.

Se puede acceder al parámetro <i>id</i> en la ruta de una solicitud a través del objeto [request](http://expressjs.com/en/api.html#req):

```js
const id = request.params.id
```

El ahora familiar método _find_ de arrays se utiliza para encontrar la nota con un id que coincida con el parámetro. Luego, la nota se devuelve al remitente de la solicitud.

Cuando probamos nuestra aplicación yendo a <http://localhost:3001/api/notes/1> en nuestro navegador, notamos que no parece funcionar, ya que el navegador muestra una página vacía. Esto no nos sorprende como desarrolladores de software, y es hora de debuggear.

Agregar comandos de _console.log_ a nuestro código es un truco comprobado:

```js
app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  console.log(id)
  const note = notes.find(note => note.id === id)
  console.log(note)
  response.json(note)
})
```


Cuando visitemos <http://localhost:3001/api/notes/1> nuevamente en el navegador, la consola que es la terminal en este caso, mostrará lo siguiente:

![](../../images/3/8.png)


El parámetro id de la ruta se pasa a nuestra aplicación, pero el _find_ método no encuentra una nota con ese id.

Para profundizar nuestra investigación, también agregamos un console log dentro de la función de comparación pasada al método _find_. Para hacer esto, tenemos que deshacernos de la sintaxis de la función de flecha compacta <em>note => note.id === id</em>, y usar la sintaxis con una declaración de retorno explícita:

```js
app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => {
    console.log(note.id, typeof note.id, id, typeof id, note.id === id)
    return note.id === id
  })
  console.log(note)
  response.json(note)
})
```


Cuando volvemos a visitar la URL en el navegador, cada llamada a la función de comparación imprime algunas cosas diferentes en la consola. La salida de la consola es la siguiente:

<pre>
1 'number' '1' 'string' false
2 'number' '1' 'string' false
3 'number' '1' 'string' false
</pre>


La causa del error se aclara. La variable _id_ contiene una cadena '1', mientras que los ids de las notas son números enteros. En JavaScript, la comparación "triple iguales" === considera que todos los valores de diferentes tipos no son iguales por defecto, lo que significa que 1 no es '1'.

Solucionemos el problema cambiando el parámetro id de un string a [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number):

```js
app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  response.json(note)
})
```


Ahora funciona la búsqueda de un recurso individual.

![](../../images/3/9ea.png)


Sin embargo, hay otro problema con nuestra aplicación.

Si buscamos una nota con un id que no existe, el servidor responde con:

![](../../images/3/10ea.png)


El código de estado HTTP que se devuelve es 200, lo que significa que la respuesta se realizó correctamente. No se devuelven datos con la respuesta, ya que el valor del header de <i>content-length</i> es 0, y lo mismo se puede verificar desde el navegador.

El motivo de este comportamiento es que la variable _note_ se establece en _undefined_ si no se encuentra una nota coincidente. La situación debe manejarse en el servidor de una mejor manera. Si no se encuentra ninguna nota, el servidor debe responder con el código de estado [404 not found](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.5) en lugar de 200.

Hagamos el siguiente cambio en nuestro código:

```js
app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  
  // highlight-start
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
  // highlight-end
})
```


Dado que no se adjuntan datos a la respuesta, utilizamos el método [status](http://expressjs.com/en/4x/api.html#res.status) para establecer el estado y el método [end](http://expressjs.com/en/4x/api.html#res.end) para responder a la solicitud sin enviar ningún dato.

La condición if aprovecha el hecho de que todos los objetos JavaScript son [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy), lo que significa que se evalúan como verdaderos en una operación de comparación. Sin embargo, _undefined_ es [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy), lo que significa que se evaluará como falso.

Nuestra aplicación funciona y envía el código de estado de error si no se encuentra ninguna nota. Sin embargo, la aplicación no devuelve nada para mostrar al usuario, como suelen hacer las aplicaciones web cuando visitamos una página que no existe. En realidad, no necesitamos mostrar nada en el navegador porque las API REST son interfaces diseñadas para uso programático, y el código de estado de error es todo lo que se necesita.


### Eliminar recursos

A continuación, implementemos una ruta para eliminar recursos. La eliminación ocurre al realizar una solicitud HTTP DELETE a la URL del recurso:

```js
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})
```


Si la eliminación del recurso es exitosa, lo que significa que la nota existe y se elimina, respondemos a la solicitud con el código de estado [204 no content](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.2.5) y no devolvemos datos con la respuesta.

No hay consenso sobre qué código de estado debe devolverse a una solicitud DELETE si el recurso no existe. Realmente, las únicas dos opciones son 204 y 404. En aras de la simplicidad, nuestra aplicación responderá con 204 en ambos casos.


### Postman

Entonces, ¿cómo probamos la operación de eliminación? Las solicitudes HTTP GET son fáciles de realizar desde el navegador. Podríamos escribir algo de JavaScript para probar la eliminación, pero escribir código de prueba no siempre es la mejor solución en todas las situaciones.

Existen muchas herramientas para facilitar las pruebas de backends. Uno de ellos es un programa de línea de comandos [curl](https://curl.haxx.se). Sin embargo, en lugar de curl, analizaremos el uso de [Postman](https://www.getpostman.com/) para probar la aplicación.

Instalemos Postman y probémoslo:

![](../../images/3/11ea.png)

Usar Postman es bastante fácil en esta situación. Es suficiente definir la URL y luego seleccionar el tipo de solicitud correcto (DELETE).

El servidor backend parece responder correctamente. Al realizar una solicitud HTTP GET a <http://localhost:3001/api/notes>, vemos que la nota con el id 2 ya no está en la lista, lo que indica que la eliminación fue exitosa.

Debido a que las notas de la aplicación solo se guardan en la memoria, la lista de notas volverá a su estado original cuando reiniciemos la aplicación.

### El cliente REST de Visual Studio Code

Si usa Visual Studio Code, puede usar el plugin [REST client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)  de VS Code en lugar de Postman.

Una vez que el plugin está instalado, usarlo es muy simple. Creamos un directorio en la raíz de la aplicación llamada <i>requests</i>. Guardamos todas las solicitudes del cliente REST en el directorio como archivos que terminan con la extensión <i>.rest</i>.

Creemos un nuevo archivo <i>get\_all\_notes.rest</i> y definamos la solicitud que obtiene todas las notas.

![](../../images/3/12ea.png)

Al hacer clic en el texto <i>Send Request</i>, el cliente REST ejecutará la solicitud HTTP y la respuesta del servidor se abre en el editor.

![](../../images/3/13ea.png)

### Recibiendo información

A continuación, hagamos posible agregar nuevas notas al servidor. La adición de una nota ocurre al hacer una solicitud HTTP POST a la dirección  http://localhost:3001/api/notes y se envía toda la información de la nueva nota en el [body](https://www.w3.org/Protocols/rfc2616/rfc2616-sec7.html#sec7) de la solicitud en formato JSON.

Para acceder a los datos fácilmente, necesitamos la ayuda del [json-parser](https://expressjs.com/en/api.html) de express, que se usa con el comando _app.use(express.json())_.

Activemos json-parser e implementemos un controlador inicial para manejar las solicitudes HTTP POST:

```js
const express = require('express')
const app = express()

app.use(express.json())

//...

app.post('/api/notes', (request, response) => {
  const note = request.body
  console.log(note)

  response.json(note)
})
```


La función del controlador de eventos puede acceder a los datos de la propiedad <i>body</i> del objeto de _request_.

Sin json-parser, la propiedad <i>body</i> no estaría definida. El json-parser funciona para que tome los datos JSON de una solicitud, los transforme en un objeto JavaScript y luego los adjunte a la propiedad <i>body</i> del objeto _request_ antes de llamar al controlador de ruta.

Por el momento, la aplicación no hace nada con los datos recibidos además de imprimirlos a la consola y devolverlos en la respuesta.

Antes de implementar el resto de la lógica de la aplicación, verifiquemos con Postman que el servidor realmente recibe los datos. Además de definir la URL y el tipo de solicitud en Postman, también tenemos que definir los datos enviados en <i>body</i>:

![](../../images/3/14ea.png)


La aplicación imprime los datos que enviamos en la solicitud a la consola:

![](../../images/3/15e.png)


**NB** <i>Mantenga visible el terminal que ejecuta la aplicación en todo momento</i> cuando esté trabajando en el backend. Gracias a Nodemon, cualquier cambio que hagamos en el código reiniciará la aplicación. Si prestas atención a la consola, inmediatamente podrás detectar los errores que ocurren en la aplicación:

![](../../images/3/16.png)


De manera similar, es útil verificar la consola para asegurarse de que el backend se comporte como esperamos en diferentes situaciones, como cuando enviamos datos con una solicitud HTTP POST. Naturalmente, es una buena idea agregar muchos comandos <em>console.log</em> al código mientras la aplicación aún se está desarrollando.

Una posible causa de problemas es un header <i>Content-Type</i> configurado incorrectamente en las solicitudes. Esto puede suceder con Postman si el tipo de body no está definido correctamente:

![](../../images/3/17e.png)


El header <i>Content-Type</i> se establece en <i>text/plain</i>:

![](../../images/3/18e.png)


El servidor parece recibir solo un objeto vacío:

![](../../images/3/19.png)


El servidor no podrá parsear los datos correctamente sin el valor correcto en el header. Ni siquiera intentará adivinar el formato de los datos, ya que hay una [gran cantidad](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types) de <i>Content-Types</i> potenciales.

Si está utilizando VS Code, debe instalar ahora el cliente REST del capítulo anterior, <i>si aún no lo ha hecho</i>. La solicitud POST se puede enviar con el cliente REST de esta manera:

![](../../images/3/20eb.png)


Creamos un nuevo archivo <i>create\_note.rest</i> para la solicitud. La solicitud se formatea de acuerdo con las [instrucciones de la documentación](https://github.com/Huachao/vscode-restclient/blob/master/README.md#usage).

Un beneficio que tiene el cliente REST sobre Postman es que las solicitudes están fácilmente disponibles en la raíz del repositorio del proyecto y se pueden distribuir a todos en el equipo de desarrollo. También puede agregar varias solicitudes en el mismo archivo usando `###` separadores:

```

GET http://localhost:3001/api/notes/

###
POST http://localhost:3001/api/notes/ HTTP/1.1
content-type: application/json

{
    "name": "sample",
    "time": "Wed, 21 Oct 2015 18:27:50 GMT"
}
```


Postman también permite a los usuarios guardar solicitudes, pero la situación puede volverse bastante caótica, especialmente cuando se trabaja en varios proyectos no relacionados.

> **Nota al margen importante**
>
> A veces, cuando está debuggeando, es posible que desee averiguar qué headers se han configurado en la solicitud HTTP. Una forma de lograr esto es mediante el método [get](http://expressjs.com/en/4x/api.html#req.get) del objeto _request_, que se puede usar para obtener el valor de un solo header. El objeto _request_ también tiene la propiedad <i>headers</i>, que contiene todos los headers de una solicitud específica.
>

> Pueden ocurrir problemas con el cliente VS REST si agrega accidentalmente una línea vacía entre la fila superior y la fila que especifica los headers HTTP. En esta situación, el cliente REST interpreta que esto significa que todos los headers se dejan vacíos, lo que hace que el servidor backend no sepa que los datos que ha recibido están en formato JSON.
>


Podrá detectar este header de <i>Content-Type</i> que falta si en algún punto de su código imprime todos los headers de solicitud con el comando _console.log(request.headers)_.



Volvamos a la aplicación. Una vez que sabemos que la aplicación recibe los datos correctamente, es el momento de finalizar el manejo de la solicitud:

```js
app.post('/api/notes', (request, response) => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id)) 
    : 0

  const note = request.body
  note.id = maxId + 1

  notes = notes.concat(note)

  response.json(note)
})
```


Necesitamos un id única para la nota. Primero, encontramos el número de id más grande en la lista actual y lo asignamos a la variable _maxId_. La id de la nueva nota se define _como maxId + 1_. De hecho, este método no se recomienda, pero viviremos con él por ahora, ya que lo reemplazaremos pronto.

La versión actual todavía tiene el problema de que la solicitud HTTP POST se puede usar para agregar objetos con propiedades arbitrarias. Mejoremos la aplicación definiendo que la propiedad <i>content</i> no puede estar vacía. Las propiedades <i>important</i> y <i>date</i> recibirán valores predeterminados. Todas las demás propiedades se descartan:

```js
const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
})
```


La lógica para generar el nuevo número de id para notas se ha separado en una función _generateId_.

Si a los datos recibidos les falta un valor para la propiedad <i>content</i>, el servidor responderá a la solicitud con el código de estado [400 bad request](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.1):

```js
if (!body.content) {
  return response.status(400).json({ 
    error: 'content missing' 
  })
}
```


Tenga en cuenta que llamar a return es crucial, porque de lo contrario el código se ejecutará hasta el final y la nota con formato incorrecto se guardará en la aplicación.

Si la propiedad content tiene un valor, la nota se basará en los datos recibidos. Como se mencionó anteriormente, es mejor generar marcas de tiempo en el servidor que en el navegador, ya que no podemos confiar en que la máquina host que ejecuta el navegador tenga su reloj configurado correctamente. La generación de la propiedad <i>date</i> ahora la realiza el servidor.

Si falta la propiedad <i>important</i>, el valor predeterminado será <i>false</i>. El valor predeterminado se genera actualmente de una manera bastante extraña:

```js
important: body.important || false,
```


Si los datos guardados en la variable _body_ tienen la propiedad <i>important</i>, la expresión evaluará su valor. Si la propiedad no existe, la expresión se evaluará como falsa, que se define en el lado derecho de las líneas verticales.

> Para ser exactos, cuando la propiedad <i>important</i> es <i>false</i>, entonces la expresión <em>body.important || false</em> devolverá el <i>false</i> del lado derecho ...

Puede encontrar el código para nuestra aplicación actual en su totalidad en la rama <i>part3-1</i> de [este repositorio de github](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-1).

Observe que la rama master del repositorio contiene el código de una versión posterior de la aplicación. El código para el estado actual de la aplicación se encuentra específicamente en la rama [part3-1](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-1).

![](../../images/3/21.png)


Si clona el proyecto, ejecute el comando _npm install_ antes de iniciar la aplicación con _npm start_ o _npm run dev_.

Una cosa más antes de pasar a los ejercicios. La función para generar IDs se ve actualmente así:

```js
const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}
```


El cuerpo de la función contiene una línea que parece un poco intrigante:


```js
Math.max(...notes.map(n => n.id))
```

¿Qué está sucediendo exactamente en esa línea de código? <em>notes.map(n => n.id)</em> crea un nuevo array que contiene todos los ids de las notas. [Math.max](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max) devuelve el valor máximo de los números que se le pasan. Sin embargo, <em>notes.map(n => n.id)</em> es un <i>array</i>, por lo que no se puede asignar directamente como parámetro a _Math.max_. El array se puede transformar en números individuales mediante el uso de la sintaxis de [spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) de  los "tres puntos", <em>...</em>.


</div>

<div class="tasks">


### Ejercicios 3.1.-3.6.

**NB:** Se recomienda hacer todos los ejercicios de esta parte en un nuevo repositorio de git dedicado y colocar su código fuente justo en la raíz del repositorio. De lo contrario, tendrá problemas en el ejercicio 3.10.

**NB:** Debido a que este no es un proyecto frontend y no estamos trabajando con React, la aplicación <strong>no se crea</strong> con create-react-app. Inicializa este proyecto con el comando <em>npm init</em> que se demostró anteriormente en esta parte del material.

**Fuerte Recomendación**: cuando esté trabajando en código de backend, siempre esté atento a lo que sucede en el terminal que ejecuta su aplicación.

#### 3.1: backend de la agenda telefónica, paso 1

Implemente una aplicación Node que devuelva una lista hardcodeada de entradas de la agenda telefónica desde la dirección <http://localhost:3001/api/persons>:

![](../../images/3/22e.png)


Observe que la barra inclinada en la ruta <i>api/persons</i> no es un carácter especial y es como cualquier otro carácter dl string.

La aplicación debe iniciarse con el comando _npm start_.

La aplicación también debe ofrecer un comando _npm run dev_ que ejecutará la aplicación y reiniciará el servidor siempre que se realicen cambios y se guarden en un archivo en el código fuente.


#### 3.2: backend de la agenda telefónica, paso 2

Implemente una página en la dirección <http://localhost:3001/info> que se parezca más o menos a esto:

![](../../images/3/23ea.png)


La página tiene que mostrar la hora en que se recibió la solicitud y cuántas entradas hay en la agenda telefónica en el momento de procesar la solicitud.


#### 3.3: backend de la agenda telefónica, paso 3

Implemente la funcionalidad para mostrar la información de una sola entrada de la agenda. La URL para obtener los datos de una persona con la identificación 5 debe ser <http://localhost:3001/api/persons/5>

Si no se encuentra una entrada para la identificación dada, el servidor debe responder con el código de estado apropiado.


#### 3.4: backend de la agenda telefónica, paso 4
Implemente la funcionalidad que hace posible eliminar una sola entrada de la agenda telefónica mediante una solicitud HTTP DELETE a la URL única de esa entrada de la agenda.

Pruebe que su funcionalidad funcione con Postman o el cliente REST de Visual Studio Code.


#### 3.5: backend de la agenda telefónica, paso 5

Expanda el backend para que se puedan agregar nuevas entradas a la agenda telefónica realizando solicitudes HTTP POST a la dirección <http://localhost:3001/api/persons>.

Genere una nueva id para la entrada de la agenda con la función [Math.random](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random). Use un rango lo suficientemente grande para sus valores aleatorios de modo que la probabilidad de crear identificadores duplicados sea pequeña.


#### 3.6: backend de la agenda telefónica, paso 6

Implemente el manejo de errores para crear nuevas entradas. No se permite que la solicitud se realice correctamente si:

- Falta el nombre o número
- El nombre ya existe en la agenda


Responda a solicitudes como estas con el código de estado apropiado y también envíe información que explique el motivo del error, por ejemplo:

```js
{ error: 'name must be unique' }
```

</div>

<div class="content">


### Acerca de los tipos de solicitudes HTTP

[El estándar HTTP](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html) habla de dos propiedades relacionadas con los tipos de solicitud, **segura** and **idempotente**.

La solicitud HTTP GET debe ser <i>segura</i>:

> <i>En particular, se ha establecido la convención de que los métodos GET y HEAD NO DEBEN tener la importancia de tomar una acción que no sea la recuperación. Estos métodos deben considerarse "seguros".</i>

Seguridad significa que la solicitud en ejecución no debe causar ningún <i>efecto secundario</i> en el servidor. Por efectos secundarios queremos decir que el estado de la base de datos no debe cambiar como resultado de la solicitud, y la respuesta solo debe devolver datos que ya existen en el servidor.

Nada puede garantizar que una solicitud GET sea realmente <i>segura</i>; de hecho , esto es solo una recomendación que se define en el estándar HTTP. Al adherirse a los principios RESTful en nuestra API, las solicitudes GET se utilizan siempre de una manera <i>segura</i>.

El estándar HTTP también define el tipo de solicitud [HEAD](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9.4), que debería ser seguro. En la práctica, HEAD debería funcionar exactamente como GET, pero no devuelve nada más que el código de estado y los headers de respuesta. El cuerpo de la respuesta no se devolverá cuando realice una solicitud HEAD.


Todas las solicitudes HTTP excepto POST deben ser <i>idempotentes</i>:

> <i>Los métodos también pueden tener la propiedad de "idempotencia" en el sentido de que (aparte de errores o problemas de caducidad) los efectos secundarios de N > 0 solicitudes idénticas son los mismos que para una sola solicitud. Los métodos GET, HEAD, PUT y DELETE comparten esta propiedad</i>

Esto significa que si una solicitud tiene efectos secundarios, el resultado debería ser el mismo independientemente de cuántas veces se envíe la solicitud.

Si hacemos una solicitud HTTP PUT a la url <i>/api/notes/10</i> y con la solicitud enviamos los datos <em>{ content: "no side effects!", important: true }</em>, el resultado es el mismo independientemente de cuántas veces se envía la solicitud.

Al igual que la <i>seguridad</i> para la solicitud GET, la <i>idempotencia</i> también es solo una recomendación en el estándar HTTP y no algo que se pueda garantizar simplemente en función del tipo de solicitud. Sin embargo, cuando nuestra API se adhiere a los principios RESTful, las solicitudes GET, HEAD, PUT y DELETE se utilizan de tal manera que son idempotentes.

POST es el único tipo de solicitud HTTP que no es ni <i>seguro</i> ni <i>idempotente</i>. Si enviamos 5 solicitudes HTTP POST diferentes <i>/api/notes</i> con un cuerpo de <em>{content: "many same", important: true}</em>, las 5 notas resultantes en el servidor tendrán todas el mismo contenido.


### Middleware

El [json-parser](https://expressjs.com/en/api.html) de express que utilizamos anteriormente es el llamado [middleware](http://expressjs.com/en/guide/using-middleware.html).

Los middleware son funciones que se pueden utilizar para manejar objetos de _request_ y _response_.

El json-parser que usamos anteriormente toma los datos sin procesar de las solicitudes que están almacenadas en el objeto _request_, los parsea en un objeto de JavaScript y lo asigna al objeto _request_como una nueva propiedad de <i>body</i>.

En la práctica, puede utilizar varios middleware al mismo tiempo. Cuando tiene más de uno, se ejecutan uno por uno en el orden en que se utilizaron en express.

Implementemos nuestro propio middleware que imprime información sobre cada solicitud que se envía al servidor.

Middleware es una función que recibe tres parámetros:

```js
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
```

Al final del cuerpo de la función, se llama a la función _next_ que se pasó como parámetro. La función _next_ cede el control al siguiente middleware.

El middleware se utiliza así:

```js
app.use(requestLogger)
```

Las funciones de middleware se llaman en el orden en que se utilizan con el método _use_ del objeto del servidor express. Tenga en cuenta que json-parser se utiliza antes del middleware _requestLogger_, porque de lo contrario <i>request.body</i> no se inicializará cuando se ejecute el registrador.

Las funciones de middleware deben utilizarse antes de las rutas si queremos que se ejecuten antes de llamar a los controladores de eventos de ruta. También hay situaciones en las que queremos definir funciones de middleware después de las rutas. En la práctica, esto significa que estamos definiendo funciones de middleware que solo se llaman si ninguna ruta maneja la solicitud HTTP.

Agreguemos el siguiente middleware después de nuestras rutas, que se usa para capturar solicitudes realizadas a rutas inexistentes. Para estas solicitudes, el middleware devolverá un mensaje de error en formato JSON.

```js
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
```


Puede encontrar el código para nuestra aplicación actual en su totalidad en la rama <i>part3-2</i> de [este repositorio de github](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-2).

</div>

<div class="tasks">

### Ejercicios 3.7.-3.8.

#### 3.7: backend de la agenda telefónica, paso 7

Agregue el middleware [morgan](https://github.com/expressjs/morgan) a su aplicación para iniciar sesión. Configúrelo para registrar mensajes en su consola según la <i>pequeña</i> configuración.

La documentación de Morgan no es la mejor y es posible que deba dedicar algún tiempo a averiguar cómo configurarla correctamente. Sin embargo, la mayor parte de la documentación del mundo cae en la misma categoría, por lo que es bueno aprender a descifrar e interpretar documentación críptica en cualquier caso.

Morgan se instala como todas las demás bibliotecas con el comando _npm install_. La puesta en funcionamiento de Morgan ocurre de la misma manera que la configuración de cualquier otro middleware mediante el comando _app.use_.


#### 3.8*: backend de la agenda telefónica, paso 8

Configure morgan para que también muestre los datos enviados en las solicitudes HTTP POST:

![](../../images/3/24.png)

Tenga en cuenta que el registro de datos incluso en la consola puede ser peligroso, ya que puede contener datos confidenciales y puede violar la ley de privacidad local (por ejemplo, GDPR en la UE) o el estándar comercial. En este ejercicio, no tiene que preocuparse por los problemas de privacidad, pero en la práctica, intente no registrar ningún dato sensible.

Este ejercicio puede resultar bastante complicado, aunque la solución no requiere mucho código.

Este ejercicio se puede completar de diferentes formas. Una de las posibles soluciones utiliza estas dos técnicas:

- [creando nuevos tokens](https://github.com/expressjs/morgan#creating-new-tokens)
- [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)

</div>
