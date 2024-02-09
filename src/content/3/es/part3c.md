---
mainImage: ../../../images/part-3.svg
part: 3
letter: c
lang: es
---

<div class="content">

Antes de pasar al tema principal de persistir datos en una base de datos, veremos algunas formas diferentes de depurar aplicaciones de Node.

### Depuración en aplicaciones de Node

Depurar (debugging) aplicaciones de Node es un poco más difícil que depurar JavaScript que se ejecuta en el navegador. Imprimir en la consola es un método probado y confiable, siempre vale la pena hacerlo. Hay personas que piensan que se deberían utilizar métodos más sofisticados en su lugar, pero no estoy de acuerdo. Incluso los desarrolladores de código abierto de élite del mundo [utilizan](https://tenderlovemaking.com/2016/02/05/i-am-a-puts-debuggerer.html) este [método](https://swizec.com/blog/javascript-debugging-slightly-beyond-consolelog/).

#### Visual Studio Code

El depurador de Visual Studio Code puede ser útil en algunas situaciones. Puedes iniciar la aplicación en modo de depuración de la siguiente manera (en esta y en las próximas imágenes, las notas tienen un campo _date_ que se ha eliminado de la versión actual de la aplicación):

![captura de pantalla mostrando como ejecutar el depurador de vscode](../../images/3/35x.png)

Ten en cuenta que la aplicación no debería ejecutarse en otra consola, de lo contrario, el puerto ya estará en uso.

__NB__ Una versión más reciente de Visual Studio Code puede tener _Run_ en lugar de _Debug_. Además, es posible que debas configurar tu archivo _launch.json_ para comenzar a depurar. Esto se puede hacer eligiendo _Add Configuration..._ en el menú desplegable, que se encuentra junto al botón de reproducción verde y arriba del menú _VARIABLES_, y seleccionando _Run "npm start" in a debug terminal_. Para obtener instrucciones de configuración más detalladas, visita la [documentación de depuración](https://code.visualstudio.com/docs/editor/debugging) de Visual Studio Code.

A continuación, puedes ver una captura de pantalla donde la ejecución del código se ha detenido a medio camino de guardar una nueva nota:

![captura de pantalla de la ejecución de un breakpoint en vscode](../../images/3/36x.png)

La ejecución se ha detenido en el <i>breakpoint</i> (punto de interrupción) de la línea 69. En la consola puedes ver el valor de la variable de <i>note</i>. En la ventana superior izquierda puede ver otras cosas relacionadas con el estado de la aplicación.

Las flechas en la parte superior se pueden utilizar para controlar el flujo del depurador.

Por alguna razón, no uso mucho el debugger de Visual Studio Code.

#### Chrome dev tools

La depuración también es posible con la consola de desarrollo de Chrome iniciando su aplicación con el comando:

```bash
node --inspect index.js
```

También puedes pasar la bandera `--inspect` a `nodemon`

```bash
nodemon --inspect index.js
```

Puedes acceder al depurador haciendo clic en el icono verde - el logotipo de node - que aparece en la consola de desarrollo de Chrome:

![herramientas de desarrolladores con logotipo verde de node](../../images/3/37.png)

La vista de depuración funciona de la misma manera que con las aplicaciones React. La pestaña <i>Sources</i> se puede usar para establecer breakpoints donde se pausará la ejecución del código.

![pestaña "Sources" de las herramientas de desarrollo con breakpoint y variables de observación](../../images/3/38eb.png)

Todos los mensajes <i>console.log</i> de la aplicación aparecerán en la pestaña <i>Console</i> del depurador. También puedes inspeccionar valores de variables y ejecutar tu propio código JavaScript.

![pestaña "Consola" de las herramientas de desarrollo mostrando el objeto de nota escrito](../../images/3/39ea.png)

#### Cuestionar todo

Depurar aplicaciones Full Stack puede parecer complicado al principio. Pronto nuestra aplicación también tendrá una base de datos además del frontend y el backend, y habrá muchas áreas con potenciales errores en la aplicación.

Cuando la aplicación "no funciona", primero tenemos que averiguar dónde ocurre realmente el problema. Es muy común que el problema exista en un lugar donde no lo esperabas, y pueden pasar minutos, horas o incluso días antes de que encuentres la fuente del problema.

La clave es ser sistemático. Dado que el problema puede estar en cualquier lugar, <i>debes cuestionarlo todo</i> y eliminar todas las posibilidades una por una. El registro en la consola, Postman, los depuradores y la experiencia te ayudarán.

Cuando ocurren errores, <i>la peor de todas las estrategias posibles</i> es continuar escribiendo código. Garantizará que tu código pronto tendrá aún más errores, y depurarlos será aún más difícil. El principio [Jidoka](https://blog.toyota-forklifts.es/jidoka-que-es) (detenerse y reparar) de Toyota Production Systems también es muy eficaz en esta situación.

### MongoDB

Para almacenar nuestras notas guardadas indefinidamente, necesitamos una base de datos. La mayoría de los cursos que se imparten en la Universidad de Helsinki utilizan bases de datos relacionales. En este curso usaremos [MongoDB](https://www.mongodb.com/), que es la denominada [base de datos de documentos](https://es.wikipedia.org/wiki/Base_de_datos_documental).

La razón para usar Mongo como la base de datos es su menor complejidad en comparación con una base de datos relacional. [La parte 13](/es/part13) del curso muestra cómo construir backends de Node.js que utilizan una base de datos relacional.

Las bases de datos de documentos difieren de las bases de datos relacionales en cómo organizan los datos, así como en los lenguajes de consulta que admiten. Las bases de datos de documentos generalmente se clasifican bajo el término general [NoSQL](https://es.wikipedia.org/wiki/NoSQL).

Puedes leer más sobre bases de datos de documentos y NoSQL en el material del curso de la [semana 7](https://tikape-s18.mooc.fi/part7/) del curso Introducción a las bases de datos. Lamentablemente, el material actualmente solo está disponible en finlandés.

Lee ahora los capítulos sobre [colecciones](https://docs.mongodb.com/manual/core/databases-and-collections/) y [documentos](https://docs.mongodb.com/manual/core/document/) del manual de MongoDB para tener una idea básica de cómo una base de datos de documentos almacena datos.

Naturalmente, puedes instalar y ejecutar MongoDB en tu propia computadora. Sin embargo, Internet también está lleno de servicios de base de datos de Mongo que puedes utilizar. Nuestro proveedor preferido de MongoDB en este curso será [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

Una vez que hayas creado y accedido a tu cuenta, comencemos seleccionando la opción gratuita:

![mongodb deploy a cloud database free shared](../../images/3/mongo1.png)

Elige el proveedor de la nube y la ubicación, y crea el clúster:

![mongodb picking shared, aws and region](../../images/3/mongo2.png)

Esperemos a que el clúster esté listo para su uso. Esto puede llevar algunos minutos.

**NB** No continúes antes de que el clúster esté listo.

Usemos la pestaña <i>security</i> para crear credenciales de usuario para la base de datos. Ten en cuenta que estas no son las mismas credenciales que utilizas para iniciar sesión en MongoDB Atlas. Estas se usarán para que tu aplicación se conecte a la base de datos.

![mongodb security quickstart](../../images/3/mongo3.png)

A continuación, debemos definir las direcciones IP que tienen permitido el acceso a la base de datos. Por simplicidad, permitiremos el acceso desde todas las direcciones IP:

![mongodb network access/add ip access list](../../images/3/mongo4.png)

Nota: En caso de que el menú modal sea diferente para ti, según la documentación de MongoDB, agregar 0.0.0.0 como una IP permite el acceso desde cualquier lugar.

Finalmente, estamos listos para conectarnos a nuestra base de datos. Comienza haciendo clic en <i>connect</i>:

![mongodb database deployment connect](../../images/3/mongo5.png)

y elige: <i>Connect to your application</i>:

![mongodb connect application](../../images/3/mongo6.png)

La vista muestra el <i>MongoDB URI</i>, que es la dirección de la base de datos que proporcionaremos a la librearía de cliente de MongoDB que agregaremos a nuestra aplicación.

La dirección se ve así:

```js
mongodb+srv://fullstack:thepasswordishere@cluster0.o1opl.mongodb.net/?retryWrites=true&w=majority
```

Ahora estamos listos para usar la base de datos.

Podríamos usar la base de datos directamente desde nuestro código JavaScript con la librería de [controladores oficial MongoDb Node.js](https://mongodb.github.io/node-mongodb-native/), pero es bastante engorroso de usar. En su lugar, usaremos la libería [Mongoose](http://mongoosejs.com/index.html) que ofrece una API de nivel superior.

Mongoose podría describirse como un <i>object document mapper</i> (ODM) o mapeador de objetos a documentos en castellano, guardar objetos JavaScript como documentos en Mongo es sencillo con esta libería.

Instalemos Mongoose:

```bash
npm install mongoose
```

No agreguemos ningún código relacionado con Mongo a nuestro backend por el momento. En cambio, hagamos una aplicación de práctica creando un nuevo archivo, <i>mongo.js</i> en la raíz del backend de la aplicación de notas:

```js
const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.o1opl.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'HTML is Easy',
  important: true,
})

note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})
```

**NB:** Dependiendo de la región que seleccionaste al crear tu clúster, el <i>MongoDB URI</i> puede ser diferente al del ejemplo proporcionado anteriormente. Debes verificar y usar el URI correcto que se generó a partir de MongoDB Atlas.

El código también asume que se le pasará la contraseña de las credenciales que creamos en MongoDB Atlas, como un parámetro de línea de comando. Podemos acceder al parámetro de la línea de comandos así:

```js
const password = process.argv[2]
```

Cuando el código se ejecuta con el comando <i>node mongo.js yourPassword</i>, Mongo agregará un nuevo documento a la base de datos.

**NB:** Ten en cuenta que la contraseña es la contraseña creada para el usuario de la base de datos, no su contraseña de MongoDB Atlas. Además, si creaste una contraseña con caracteres especiales, deberas [codificar esa contraseña en la URL](https://docs.atlas.mongodb.com/troubleshoot-connection/#special-characters-in-connection-string-password).

Podemos ver el estado actual de la base de datos en MongoDB Atlas desde <i>Browse collections</i>, en la pestaña Database.

![Botón para explorar colecciones en las bases de datos de MongoDB](../../images/3/mongo7.png)

Según la vista, el <i>documento</i> que coincide con la nota se ha añadido a la colección <i>notes</i> en la base de datos <i>myFirstDatabase</i>.

![Pestaña de colecciones de MongoDB en la base de datos myfirst app notes](../../images/3/mongo8new.png)

Destruyamos la base de datos predeterminada <i>test</i> y cambiemos el nombre de la base de datos referenciada en nuestra cadena de conexión a <i>noteApp</i>, modificando la URI:

```js
const url =
  `mongodb+srv://fullstack:${password}@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority`
```

Ejecutemos nuestro código de nuevo.

![Pestaña de colecciones de MongoDB en la base de datos noteApp con la colección notes](../../images/3/mongo9.png)

Los datos ahora se almacenan en la base de datos correcta. La vista también ofrece la función de <i>create database</i>, que se puede utilizar para crear nuevas bases de datos desde el sitio web. No es necesario crear la base de datos de esta manera, ya que MongoDB Atlas crea automáticamente una nueva base de datos cuando una aplicación intenta conectarse a una base de datos que aún no existe.

### Schema

Después de establecer la conexión a la base de datos, definimos el [esquema](http://mongoosejs.com/docs/guide.html) para una nota y el [modelo](http://mongoosejs.com/docs/models.html) correspondiente:

```js
const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)
```

Primero definimos el [esquema](http://mongoosejs.com/docs/guide.html) de una nota que se almacena en la variable _noteSchema_. El esquema le dice a Mongoose cómo se almacenarán los objetos de nota en la base de datos.

En la definición del modelo _Note_, el primer parámetro de <i>"Note"</i> es el nombre singular del modelo. El nombre de la colección será el plural <i>notes</i> en minúsculas, porque la [convención de Mongoose](http://mongoosejs.com/docs/models.html) es nombrar automáticamente las colecciones como el plural (por ejemplo, <i>notes</i>) cuando el esquema se refiere a ellas en singular (por ejemplo, <i>Note</i>).

Las bases de datos de documentos como Mongo <i>no tienen esquema</i>, lo que significa que la base de datos en sí no se preocupa por la estructura de los datos que se almacenan en la base de datos. Es posible almacenar documentos con campos completamente diferentes en la misma colección.

La idea detrás de Mongoose es que los datos almacenados en la base de datos reciben un <i>esquema al nivel de la aplicación</i> que define la forma de los documentos almacenados en una colección determinada.

### Crear y guardar objetos

A continuación, la aplicación crea un nuevo objeto de nota con la ayuda del [modelo](http://mongoosejs.com/docs/models.html) <i>Note</i>:

```js
const note = new Note({
  content: 'HTML is Easy',
  important: false,
})
```

Los modelos son las llamadas <i>funciones constructoras</i> que crean nuevos objetos JavaScript basados ​​en los parámetros proporcionados. Dado que los objetos se crean con la función constructora del modelo, tienen todas las propiedades del modelo, que incluyen métodos para guardar el objeto en la base de datos.

Guardar el objeto en la base de datos ocurre con el método _save_, que se puede proporcionar con un controlador de eventos con el método _then_:

```js
note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})
```

Cuando el objeto se guarda en la base de datos, el controlador de eventos proporcionado a _then_ se invoca. El controlador de eventos cierra la conexión de la base de datos con el comando <code>mongoose.connection.close()</code>. Si la conexión no se cierra, el programa nunca terminará su ejecución.

El resultado de la operación de guardar está en el parámetro _result_ del controlador de eventos. El resultado no es tan interesante cuando almacenamos un objeto en la base de datos. Puedes imprimir el objeto en la consola si deseas verlo más de cerca mientras implementas tu aplicación o durante la depuración.

Guardemos también algunas notas más modificando los datos en el código y ejecutando el programa nuevamente.

**NB:** Desafortunadamente, la documentación de Mongoose no es muy consistente, con partes de ella usando callbacks en sus ejemplos y otras partes, otros estilos, por lo que no se recomienda copiar y pegar código directamente desde allí. No se recomienda mezclar promesas con callbacks de la vieja escuela en el mismo código.

### Obteniendo objetos de la base de datos

Comentemos el código para generar nuevas notas y reemplázalo con lo siguiente:

```js
Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})
```

Cuando se ejecuta el código, el programa imprime todas las notas almacenadas en la base de datos:

![salida de notes como JSON al ejecutar el comando node mongo.js](../../images/3/70new.png)

Los objetos se recuperan de la base de datos con el método [find](https://mongoosejs.com/docs/api.html#model_Model.find) del modelo _Note_. El parámetro del método es un objeto que expresa condiciones de búsqueda. Dado que el parámetro es un objeto vacío <code>{}</code>, obtenemos todas las notas almacenadas en la colección _notes_.

Las condiciones de búsqueda se adhieren a la [sintaxis](https://docs.mongodb.com/manual/reference/operator/) de consulta de búsqueda de Mongo.

Podríamos restringir nuestra búsqueda para incluir solo notas importantes de la siguiente manera:

```js
Note.find({ important: true }).then(result => {
  // ...
})
```

</div>

<div class="tasks">

### Ejercicio 3.12.

#### 3.12: Base de datos de línea de comandos

Crea una base de datos MongoDB basada en la nube para la aplicación de agenda telefónica con MongoDB Atlas.

Crea un archivo <i>mongo.js</i> en el directorio del proyecto, que se puede usar para agregar entradas a la agenda y para enumerar todas las entradas existentes en la agenda.

**NB:** ¡No incluyas la contraseña en el archivo que subes a GitHub!

La aplicación debería funcionar de la siguiente manera. Utiliza el programa pasando tres argumentos de línea de comando (el primero es la contraseña), por ejemplo:

```bash
node mongo.js yourpassword Anna 040-1234556
```

Como resultado, la aplicación imprimirá:

```bash
added Anna number 040-1234556 to phonebook
```

La nueva entrada a la agenda telefónica se guardará en la base de datos. Ten en cuenta que si el nombre contiene espacios en blanco, debe ir entre comillas:

```bash
node mongo.js yourpassword "Arto Vihavainen" 045-1232456
```

Si la contraseña es el único parámetro dado al programa, lo que significa que se invoca así:

```bash
node mongo.js yourpassword
```

Entonces el programa debería mostrar todas las entradas en la agenda:

<pre>
phonebook:
Anna 040-1234556
Arto Vihavainen 045-1232456
Ada Lovelace 040-1231236
</pre>

Puedes obtener los parámetros de la línea de comandos de la variable [process.argv](https://nodejs.org/docs/latest-v18.x/api/process.html#process_process_argv).

**NB: no cierres la conexión en el lugar incorrecto**. Por ejemplo, el siguiente código no funcionará:

```js
Person
  .find({})
  .then(persons=> {
    // ...
  })

mongoose.connection.close()
```

En el código anterior, el comando <i>mongoose.connection.close()</i> se ejecutará inmediatamente después de que se inicie la operación <i>Person.find</i>. Esto significa que la conexión a la base de datos se cerrará inmediatamente y la ejecución nunca llegará al punto en el que finalice la operación <i>Person.find</i> y se llame a la función <i>callback</i>.

El lugar correcto para cerrar la conexión de la base de datos es al final de la función callback:

```js
Person
  .find({})
  .then(persons=> {
    // ...
    mongoose.connection.close()
  })
```

**NB:** Si defines un modelo con el nombre <i>Person</i>, mongoose nombrará automáticamente la colección asociada como <i>people</i>.

</div>

<div class="content">

### Backend conectado a una base de datos

Ahora tenemos suficiente conocimiento para comenzar a usar Mongo en nuestra aplicación.

Comencemos rápidamente copiando y pegando las definiciones de Mongoose en el archivo <i>index.js</i>:

```js
const mongoose = require('mongoose')

const password = process.argv[2]

// DO NOT SAVE YOUR PASSWORD TO GITHUB!!
const url =
  `mongodb+srv://fullstack:${password}@cluster0.o1opl.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)
```

Cambiemos el controlador para obtener todas las notas al siguiente formato:

```js
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})
```

Podemos verificar en el navegador que el backend funciona para mostrar todos los documentos:

![api/notes en el navegador muestra notas en JSON](../../images/3/44ea.png)

La aplicación funciona casi a la perfección. El frontend asume que cada objeto tiene un id único en el campo de <i>id</i>. Tampoco queremos retornar el campo de control de versiones de mongo <i>\_\_v</i> al frontend.

Una forma de formatear los objetos devueltos por Mongoose es [modificar](https://stackoverflow.com/questions/7034848/mongodb-output-id-instead-of-id) el método _toJSON_ del esquema, que se utiliza en todas las instancias de los modelos producidos con ese esquema.

Para modificar el método, necesitamos cambiar las opciones configurables del esquema. Las opciones se pueden cambiar utilizando el método set del esquema. Consulta aquí para obtener más información sobre este método: https://mongoosejs.com/docs/guide.html#options. Consulta <https://mongoosejs.com/docs/guide.html#toJSON> y <https://mongoosejs.com/docs/api.html#document_Document-toObject> para obtener más información sobre la opción _toJSON_.

Consulta <https://mongoosejs.com/docs/api/document.html#transform> para obtener más información sobre la función _transform_.

```js
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
```

Aunque la propiedad <i>\_id</i> de los objetos Mongoose parece un string, de hecho es un objeto. El método _toJSON_ que definimos lo transforma en un string solo para estar seguros. Si no hiciéramos este cambio, nos causaría más daño en el futuro una vez que comencemos a escribir pruebas.

No es necesario hacer cambios en el controlador:

```js
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})
```

El código utiliza automáticamente el _toJSON_ definido al formatear las notas para la respuesta.

### Configuración de la base de datos en su propio módulo

Antes de refactorizar el resto del backend para usar la base de datos, extraigamos el código específico de Mongoose en su propio módulo.

Creemos un nuevo directorio para el módulo llamado <i>models</i> y agreguemos un archivo llamado <i>note.js</i>:

```js
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI // highlight-line

console.log('connecting to', url) // highlight-line

mongoose.connect(url)
// highlight-start
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })
// highlight-end

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema) // highlight-line
```

La definición de [módulos](https://nodejs.org/docs/latest-v18.x/api/modules.html) de Node difiere ligeramente de la forma de definir [módulos ES6](/es/part2/renderizando_una_coleccion_modulos#refactorizando-modulos) en la parte 2.

La interfaz pública del módulo se define estableciendo un valor en la variable _module.exports_. Estableceremos el valor para que sea el modelo <i>Note</i>. Las otras cosas definidas dentro del módulo, como las variables _mongoose_ y _url_, no serán accesibles ni visibles para los usuarios del módulo.

La importación del módulo ocurre agregando la siguiente línea a <i>index.js</i> :

```js
const Note = require('./models/note')
```

De esta forma la variable _Note_ se asignará al mismo objeto que defina el módulo.

La forma en que se realiza la conexión ha cambiado ligeramente:

```js
const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })
```

No es una buena idea codificar la dirección de la base de datos en el código, por lo que la dirección de la base de datos se pasa a la aplicación a través de la variable de entorno <em>MONGODB_URI</em>.

El método para establecer la conexión ahora tiene funciones para lidiar con un intento de conexión exitoso y no exitoso. Ambas funciones simplemente registran un mensaje en la consola sobre el estado de éxito:

![salida de node cuando se pasa username/password erroneo](../../images/3/45e.png)

Hay muchas formas de definir el valor de una variable de entorno. Una forma sería definirlo cuando se inicia la aplicación:

```bash
MONGODB_URI=address_here npm run dev
```

Una forma más sofisticada es utilizar la librería [dotenv](https://github.com/motdotla/dotenv#readme). Puedes instalar la librería con el comando:

```bash
npm install dotenv
```

Para usar la librería, creamos un archivo <i>.env</i> en la raíz del proyecto. Las variables de entorno se definen dentro del archivo y pueden verse así:

```bash
MONGODB_URI=mongodb+srv://fullstack:thepasswordishere@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority
PORT=3001
```

También agregamos el puerto codificado del servidor en la variable de entorno <em>PORT</em>.

**El archivo <i>.env</i> debe ignorarse de inmediato en .gitignore, ¡ya que no queremos publicar ninguna información confidencial públicamente!**

![.gitignore en vscode con .env añadido](../../images/3/45ae.png)

Las variables de entorno definidas en el archivo <i>.env</i> se pueden utilizar con la expresión <em>require('dotenv').config()</em> y puedes referenciarlas en tu código como lo harías con las variables de entorno normales, con la sintaxis <em>process.env.MONGODB_URI</em>.

Cambiemos el archivo <i>index.js</i> de la siguiente manera:

```js
require('dotenv').config() // highlight-line
const express = require('express')
const app = express()
const Note = require('./models/note') // highlight-line

// ..

const PORT = process.env.PORT // highlight-line
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

Es importante que <i>dotenv</i> se importe antes de importar el modelo <i>note</i>. Esto asegura que las variables de entorno del archivo <i>.env</i> estén disponibles globalmente antes de que se importe el código de los otros módulos.

### Nota importante para usuarios de Fly.io

Debido a que GitHub no se utiliza con Fly.io, el archivo .env también se copia a los servidores de Fly.io cuando se despliega la aplicación. Debido a esto, las variables de entorno definidas en el archivo estarán disponibles allí.

Sin embargo, una [mejor opción](https://community.fly.io/t/clarification-on-environment-variables/6309) es evitar que .env se copie a Fly.io creando en la raíz del proyecto el archivo _.dockerignore_, con el siguiente contenido:

```bash
.env
```

y estableciendo el valor de la variable de entorno desde la línea de comandos con el comando:

```bash
fly secrets set MONGODB_URI="mongodb+srv://fullstack:thepasswordishere@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority"
```

Dado que PORT también está definido en nuestro archivo .env, es esencial ignorar el archivo en Fly.io, ya que de lo contrario, la aplicación se inicia en el puerto incorrecto.

Al utilizar Render, la URL de la base de datos se proporciona definiendo la variable de entorno adecuada en el panel de control:

![navegador mostrando variables de entorno de Render](../../images/3/render-env.png)

### Usando la base de datos en los controladores de ruta

A continuación, cambiemos el resto de la funcionalidad del backend para usar la base de datos.

La creación de una nueva nota se logra así:

```js
app.post('/api/notes', (request, response) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })
})
```

Los objetos de nota se crean con la función de constructor _Note_. La respuesta se envía dentro de la función callback para la operación _save_. Esto asegura que la respuesta se envíe solo si la operación se realizó correctamente. Discutiremos el manejo de errores un poco más adelante.

El parámetro _savedNote_ en la función callback es la nota guardada y recién creada. Los datos devueltos en la respuesta son la versión formateada creada con el método _toJSON_ :

```js
response.json(savedNote)
```

Usando el método [findById](https://mongoosejs.com/docs/api/model.html#model_Model-findById) de Mongoose, la obtención de una nota individual se cambia a lo siguiente:

```js
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(note => {
    response.json(note)
  })
})
```

### Verificación de la integración de frontend y backend

Cuando el backend se expande, es una buena idea probar el backend primero con **el navegador, Postman o el cliente REST de VS Code**. A continuación, intentemos crear una nueva nota después de utilizar la base de datos:

![VS code cliente rest haciendo un post](../../images/3/46new.png)

Solo una vez que se haya verificado que todo funciona en el backend, es una buena idea probar que el frontend funciona con el backend. Es muy ineficiente probar cosas exclusivamente a través del frontend.

Probablemente sea una buena idea integrar el frontend y el backend una funcionalidad a la vez. Primero, podríamos implementar la búsqueda de todas las notas de la base de datos y probarlas a través del endpoint de backend en el navegador. Después de esto, podríamos verificar que el frontend funciona con el nuevo backend. Una vez que todo parezca funcionar, pasaríamos a la siguiente funcionalidad.

Una vez que introducimos una base de datos en la mezcla, es útil inspeccionar el estado persistente en la base de datos, por ejemplo, desde el panel de control en MongoDB Atlas. Muy a menudo, los pequeños programas auxiliares de Node como el programa <i>mongo.js</i> que escribimos anteriormente pueden ser muy útiles durante el desarrollo.

Puedes encontrar el código para nuestra aplicación actual en su totalidad en la rama <i>part3-4</i> de [este repositorio de GitHub](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-4).

</div>

<div class="tasks">

### Ejercicios 3.13.-3.14.

Los siguientes ejercicios son bastante sencillos, pero si tu frontend deja de funcionar con el backend, entonces encontrar y corregir los errores puede ser bastante interesante.

#### 3.13: Base de datos de la Agenda Telefónica, paso 1

Cambia la búsqueda de todas las entradas de la agenda telefónica para que los datos <i>se obtengan desde la base de datos</i>.

Verifica que el frontend funcione después de que se hayan realizado los cambios.

En los siguientes ejercicios, escribe todo el código específico de Mongoose en su propio módulo, como hicimos en el capítulo [Configuración de la base de datos en su propio módulo](/es/part3/guardando_datos_en_mongo_db#configuracion-de-la-base-de-datos-en-su-propio-modulo).

#### 3.14: Base de datos de la Agenda Telefónica, paso 2

Cambia el backend para que los nuevos números se <i>guarden en la base de datos</i>. Verifica que tu frontend aún funcione después de los cambios.

En esta etapa, puedes ignorar si ya existe una persona en la base de datos con el mismo nombre que la persona que estás agregando.

</div>

<div class="content">

### Manejo de errores

Si intentamos visitar la URL de una nota con un id que en realidad no existe, por ejemplo, <http://localhost:3001/api/notes/5c41c90e84d891c15dfa3431> donde <i>5c41c90e84d891c15dfa3431</i> no es un id almacenado en la base de datos, entonces la respuesta será _null_.

Cambiemos este comportamiento para que si la nota con la identificación dada no existe, el servidor responderá a la solicitud con el código de estado HTTP 404 not found. Además, implementemos un bloque <em>catch</em> sencillo para manejar los casos en los que la promesa devuelta por el método <em>findById</em> es rechazada:

```js
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id)
    .then(note => {
      // highlight-start
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
      // highlight-end
    })
    // highlight-start
    .catch(error => {
      console.log(error)
      response.status(500).end()
    })
    // highlight-end
})
```

Si no se encuentra ningún objeto coincidente en la base de datos, el valor de _note_ será _null_ y se ejecutará el bloque _else_. Esto da como resultado una respuesta con el código de estado <i>404 not found</i>. Si se rechaza la promesa retornada por el método <em>findById</em>, la respuesta tendrá el código de estado <i>500 internal server error</i>. La consola muestra información más detallada sobre el error.

Además de la nota que no existe, hay una situación de error más que debe manejarse. En esta situación, estamos intentando obtener una nota con un tipo de _id_ incorrecto , es decir, un _id_ que no coincide con el formato del identificador de mongo.

Si realizamos la siguiente solicitud, obtendremos el mensaje de error que se muestra a continuación:

<pre>
Method: GET
Path:   /api/notes/someInvalidId
Body:   {}
---
{ CastError: Cast to ObjectId failed for value "someInvalidId" at path "_id"
    at CastError (/Users/mluukkai/opetus/_fullstack/osa3-muisiinpanot/node_modules/mongoose/lib/error/cast.js:27:11)
    at ObjectId.cast (/Users/mluukkai/opetus/_fullstack/osa3-muisiinpanot/node_modules/mongoose/lib/schema/objectid.js:158:13)
    ...
</pre>

Dado un ID mal formado como argumento, el método <em>findById</em> arrojará un error que provocará el rechazo de la promesa retornada. Esto hará que se llame a la función callback definida en el bloque <em>catch</em>.

Hagamos algunos pequeños ajustes a la respuesta en el bloque <em>catch</em>:

```js
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end() 
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' }) // highlight-line
    })
})
```

Si el formato del id es incorrecto, terminaremos en el controlador de errores definido en el bloque _catch_. El código de estado apropiado para la situación es [400 Bad Request](https://www.rfc-editor.org/rfc/rfc9110.html#name-400-bad-request), porque la situación se ajusta perfectamente a la descripción:

> <i>El código de estado 400 (Solicitud incorrecta) indica que el servidor no puede o no procesará la solicitud debido a algo que se percibe como un error del cliente (por ejemplo, sintaxis de solicitud incorrecta, formato de mensaje de solicitud inválido o enrutamiento de solicitud engañoso).</i>

También hemos agregado algunos datos a la respuesta para arrojar algo de luz sobre la causa del error.

Cuando se trata de Promesas, casi siempre es una buena idea agregar el manejo de errores y excepciones, porque de lo contrario te encontraras lidiando con errores extraños.

Nunca es una mala idea imprimir el objeto que causó la excepción a la consola en el controlador de errores:

```js
.catch(error => {
  console.log(error)  // highlight-line
  response.status(400).send({ error: 'malformatted id' })
})
```

La razón por la que se llama al controlador de errores puede ser algo completamente diferente de lo que habías anticipado. Si registras el error en la consola, puedes ahorrarte largas y frustrantes sesiones de depuración. Además, la mayoría de los servicios modernos en los que despliegas tu aplicación admiten algún tipo de sistema de registro que puedes usar para verificar estos registros. Como se mencionó, Fly.io es uno.

Cada vez que trabajas en un proyecto con un backend, <i>es fundamental estar atento a la salida de la consola del backend</i>. Si estás trabajando en una pantalla pequeña, basta con ver una pequeña porción de la salida en segundo plano. Cualquier mensaje de error llamará tu atención incluso cuando la consola esté muy atrás en segundo plano:

![captura de pantalla mostrando trozo pequeño de salida de consola](../../images/3/15b.png)

### Mover el manejo de errores al middleware

Hemos escrito el código para el controlador de errores entre el resto de nuestro código. Esta puede ser una solución razonable a veces, pero hay casos en los que es mejor implementar todo el manejo de errores en un solo lugar. Esto puede ser particularmente útil si más adelante queremos reportar datos relacionados con errores a un sistema de seguimiento de errores externo como [Sentry](https://sentry.io/welcome/).

Cambiemos el controlador de la ruta <i>/api/notes/:id</i>, para que pase el error hacia adelante con la función <em>next</em>. La función <em>next</em> se pasa al controlador como tercer parámetro:

```js
app.get('/api/notes/:id', (request, response, next) => { // highlight-line
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error)) // highlight-line
})
```

El error que se pasa hacia adelante es dado a la función <em>next</em> como parámetro. Si se llamó a next sin un parámetro, entonces la ejecución simplemente pasaría a la siguiente ruta o middleware. Si se llama a la función <em>next</em> con un parámetro, la ejecución continuará en el <i>middleware del controlador de errores</i>.

Los [controladores de errores](https://expressjs.com/en/guide/error-handling.html) de Express son middleware que se definen con una función que acepta <i>cuatro parámetros</i>. Nuestro controlador de errores se ve así:

```js
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// este debe ser el último middleware cargado
app.use(errorHandler)
```

El controlador de errores comprueba si el error es una excepción <i>CastError</i>, en cuyo caso sabemos que el error fue causado por un ID de objeto no válido para Mongo. En esta situación, el controlador de errores enviará una respuesta al navegador con el objeto de respuesta pasado como parámetro. En todas las demás situaciones de error, el middleware pasa el error al controlador de errores Express predeterminado.

¡Ten en cuenta que el middleware de manejo de errores debe ser el último middleware cargado!

### El orden de carga del middleware

El orden de ejecución del middleware es el mismo que el orden en el que se cargan en express con la función _app.use_. Por esta razón, es importante tener cuidado al definir el middleware.

El orden correcto es el siguiente:

```js
app.use(express.static('build'))
app.use(express.json())
app.use(logger)

app.post('/api/notes', (request, response) => {
  const body = request.body
  // ...
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// controlador de solicitudes con endpoint desconocido
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  // ...
}

// controlador de solicitudes que resulten en errores
app.use(errorHandler)
```

El middleware json-parser debería estar entre los primeros middleware cargados en Express. Si el orden fuera el siguiente:

```js
app.use(logger) // request.body es undefined!

app.post('/api/notes', (request, response) => {
  // request.body es undefined!
  const body = request.body
  // ...
})

app.use(express.json())
```

Entonces, los datos JSON enviados con las solicitudes HTTP no estarían disponibles para el middleware del registrador o el controlador de ruta POST, ya que _request.body_ estaría _undefined_ en ese punto.

También es importante que el middleware para manejar rutas no admitidas esté junto al último middleware que se cargó en Express, justo antes del controlador de errores.

Por ejemplo, el siguiente orden de carga causaría un problema:

```js
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// controlador de solicitudes con endpoint desconocido
app.use(unknownEndpoint)

app.get('/api/notes', (request, response) => {
  // ...
})
```

Ahora, el manejo de los endpoints desconocidos se ordena <i>antes que el controlador de solicitudes HTTP</i>. Dado que el controlador de endpoint desconocido responde a todas las solicitudes con <i>404 unknown endpoint</i>, no se llamará a ninguna ruta o middleware después de que el middleware de endpoint desconocido haya enviado la respuesta. La única excepción a esto es el controlador de errores que debe estar al final, después del controlador de endpoints desconocido.

### Otras operaciones

Agreguemos algunas funcionalidades que faltan a nuestra aplicación, incluida la eliminación y actualización de una nota individual.

La forma más fácil de eliminar una nota de la base de datos es con el método [findByIdAndDelete](https://mongoosejs.com/docs/api/model.html#Model.findByIdAndDelete()):

```js
app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})
```

En los dos casos "exitosos" de eliminar un recurso, el backend responde con el código de estado <i>204 no content</i>. Los dos casos diferentes son eliminar una nota que existe y eliminar una nota que no existe en la base de datos. El parámetro callback _result_ podría usarse para verificar si un recurso realmente se eliminó, y podríamos usar esa información para devolver códigos de estado diferentes para los dos casos si lo consideramos necesario. Cualquier excepción que ocurra se pasa al controlador de errores.

El cambio de la importancia de una nota se puede lograr fácilmente con el método [findByIdAndUpdate](https://mongoosejs.com/docs/api/model.html#model_Model-findByIdAndUpdate).

```js
app.put('/api/notes/:id', (request, response, next) => {
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
```

En el código anterior, también permitimos que se edite el contenido de la nota.

Observa que el método <em>findByIdAndUpdate</em> recibe un objeto JavaScript normal como parámetro, y no un nuevo objeto de nota creado con la función constructora <em>Note</em>.

Hay un detalle importante con respecto al uso del método <em>findByIdAndUpdate</em>. De forma predeterminada, el parámetro <em>updatedNote</em> del controlador de eventos recibe el documento original [sin las modificaciones](https://mongoosejs.com/docs/api/model.html#model_Model-findByIdAndUpdate). Agregamos el parámetro opcional <code>{ new: true }</code>, que hará que nuestro controlador de eventos sea llamado con el nuevo documento modificado en lugar del original.

Después de probar el backend directamente con Postman o el cliente REST de VS Code, podemos verificar que parece funcionar. El frontend también parece funcionar con el backend usando la base de datos.

Puedes encontrar el código para nuestra aplicación actual en su totalidad en la rama <i>part3-5</i> de [este repositorio de GitHub](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-5).

### Un verdadero juramento de desarrollador full stack

Una vez más, es tiempo para los ejercicios. La complejidad de nuestra aplicación ha dado otro paso, ya que ahora, además del frontend y el backend, también tenemos una base de datos.
Realmente hay muchas fuentes potenciales de errores.

Así que debemos extender una vez más nuestro juramento:

El desarrollo full stack es <i>extremadamente difícil</i>, por eso utilizaré todos los medios posibles para facilitarlo.

- Mantendré la consola de desarrollador del navegador abierta todo el tiempo.
- Utilizaré la pestaña de red de las herramientas de desarrollo del navegador para asegurarme de que el frontend y el backend estén comunicándose como espero.
- Vigilaré constantemente el estado del servidor para asegurarme de que los datos enviados por el frontend se guarden allí como espero.
- <i>Observaré la base de datos: ¿guarda el backend los datos allí en el formato correcto?</i>
- Progresaré con pequeños pasos.
- Escribiré muchas declaraciones de _console.log_ para asegurarme de entender cómo se comporta el código y ayudar a señalar problemas.
- Si mi código no funciona, no escribiré más código. En su lugar, comenzaré a eliminar código hasta que funcione o simplemente regresaré a un estado en el que todo aún funcionaba.
- Cuando pida ayuda en el canal de Discord o Telegram del curso o en cualquier otro lugar, formularé mis preguntas correctamente, consulta [aquí](https://fullstackopen.com/en/part0/general_info#how-to-ask-help-in-discord-telegam) cómo pedir ayuda.

</div>

<div class="tasks">

### Ejercicios 3.15.-3.18.

#### 3.15: Base de datos de la Agenda Telefónica, paso 3

Cambia el backend para que la eliminación de entradas de la agenda telefónica se refleje en la base de datos.

Verifica que el frontend aún funcione después de realizar los cambios.

#### 3.16: Base de datos de la Agenda Telefónica, paso 4

Mueve el manejo de errores de la aplicación a un nuevo middleware de manejo de errores.

#### 3.17*: Base de datos de la Agenda Telefónica, paso 5

Si el usuario intenta crear una nueva entrada en la agenda para una persona cuyo nombre ya está en la agenda, el frontend intentará actualizar el número de teléfono de la entrada existente realizando una solicitud HTTP PUT a la URL única de la entrada.

Modifica el backend para admitir esta solicitud.

Verifica que el frontend funcione después de realizar los cambios.

#### 3.18*: Base de datos de la Agenda Telefónica, paso 6

También actualiza el manejo de las rutas <i>api/persons/:id</i> e <i>info</i> para usar la base de datos, y verifica que funcionen directamente con el navegador, Postman o el cliente REST de VS Code.

La inspección de una entrada individual de la agenda telefónica desde el navegador debería verse así:

![navegador mostrando los datos de una persona en la ruta api/persons/id](../../images/3/49.png)

</div>
