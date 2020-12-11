---
mainImage: ../../../images/part-3.svg
part: 3
letter: c
lang: es
---

<div class="content">

Antes de pasar al tema principal de la persistencia de datos en una base de datos, veremos algunas formas diferentes de debuggear aplicaciones de Node.

### Debugging en aplicaciones de Node

Debuggear aplicaciones de Node es un poco más difícil que debuggear JavaScript que se ejecuta en su navegador. Imprimir en la consola es un método probado y verdadero, y siempre vale la pena hacerlo. Hay personas que piensan que se deberían utilizar métodos más sofisticados en su lugar, pero no estoy de acuerdo. Incluso los desarrolladores de código abierto de élite del mundo [utilizan](https://tenderlovemaking.com/2016/02/05/i-am-a-puts-debuggerer.html) este [método](https://swizec.com/blog/javascript-debugging-slightly-beyond-console-log/swizec/6633).


#### Visual Studio Code

El debugger de Visual Studio Code puede resultar útil en algunas situaciones. Puede iniciar la aplicación en modo de debugging de esta manera:

![](../../images/3/35.png)

Tenga en cuenta que la aplicación no debería ejecutarse en otra consola, de lo contrario, el puerto ya estará en uso.

__NB__ Una versión más reciente de Visual Studio Code puede tener _Run_ en lugar de _Debug_. Además, es posible que deba configurar su archivo _launch.json_ para comenzar a debuggear. Esto se puede hacer eligiendo _Add Configuration..._ en el menú desplegable, que se encuentra junto al botón de reproducción verde y arriba del menú _VARIABLES_, y seleccione _Run "npm start" in a debug terminal_. Para obtener instrucciones de configuración más detalladas, visite la [documentación de debugging](https://code.visualstudio.com/docs/editor/debugging) de Visual Studio Code.

A continuación, puede ver una captura de pantalla donde la ejecución del código se ha detenido en medio de guardar una nueva nota:

![](../../images/3/36e.png)

La ejecución se ha detenido en el <i>breakpoint</i> de la línea 63. En la consola puede ver el valor de la variable de <i>note</i>. En la ventana superior izquierda puede ver otras cosas relacionadas con el estado de la aplicación.

Las flechas en la parte superior se pueden utilizar para controlar el flujo del debugger.

Por alguna razón, no uso mucho el debugger de Visual Studio Code.


#### Chrome dev tools

El Debugging también es posible con la consola de desarrollo de Chrome iniciando su aplicación con el comando:

```bash
node --inspect index.js
```

Puede acceder al debugger haciendo clic en el icono verde (el logotipo de node) que aparece en la consola de desarrollo de Chrome:


![](../../images/3/37.png)

La vista de debugging funciona de la misma manera que con las aplicaciones React. La pestaña <i>Sources</i> se puede usar para establecer breakpoints donde se pausará la ejecución del código.

![](../../images/3/38eb.png)

Todos los mensajes <i>console.log</i> de la aplicación aparecerán en la pestaña <i>Console</i> del debugger. También puede inspeccionar valores de variables y ejecutar su propio código JavaScript.

![](../../images/3/39ea.png)

#### Cuestionar todo

Debuggear aplicaciones Full Stack puede parecer complicado al principio. Pronto nuestra aplicación también tendrá una base de datos además del frontend y el backend, y habrá muchas áreas potenciales de errores en la aplicación.

Cuando la aplicación "no funciona", primero tenemos que averiguar dónde ocurre realmente el problema. Es muy común que el problema exista en un lugar donde no lo esperaba, y pueden pasar minutos, horas o incluso días antes de que encuentre la fuente del problema.

La clave es ser sistemático. Dado que el problema puede existir en cualquier lugar, <i>debes cuestionarlo todo</i> y eliminar todas las posibilidades una por una. Iniciar sesión en la consola, Postman, debuggeres y la experiencia serán de ayuda.

Cuando ocurren errores, <i>la peor de todas las estrategias posibles</i> es continuar escribiendo código. Garantizará que su código pronto tendrá aún más errores, y debuggearlos será aún más difícil. El principio de [detenerse y reparar](http://gettingtolean.com/toyota-principle-5-build-culture-stopping-fix/#.Wjv9axP1WCQ) de Toyota Production Systems también es muy eficaz en esta situación.


### MongoDB

Para almacenar nuestras notas guardadas indefinidamente, necesitamos una base de datos. La mayoría de los cursos que se imparten en la Universidad de Helsinki utilizan bases de datos relacionales. En este curso usaremos [MongoDB](https://www.mongodb.com/), que es la denominada [base de datos de documentos](https://en.wikipedia.org/wiki/Document-oriented_database).

Las bases de datos de documentos difieren de las bases de datos relacionales en cómo organizan los datos, así como en los lenguajes de consulta que admiten. Las bases de datos de documentos generalmente se clasifican bajo el término general [NoSQL](https://en.wikipedia.org/wiki/NoSQL).

Puede leer más sobre bases de datos de documentos y NoSQL en el material del curso de la [semana 7](https://tikape-s18.mooc.fi/part7/) del curso Introducción a las bases de datos. Lamentablemente, el material actualmente solo está disponible en finlandés.

Lea ahora los capítulos sobre [colecciones](https://docs.mongodb.com/manual/core/databases-and-collections/) y [documentos](https://docs.mongodb.com/manual/core/document/) del manual de MongoDB para tener una idea básica de cómo una base de datos de documentos almacena datos.

Naturalmente, puede instalar y ejecutar MongoDB en su propia computadora. Sin embargo, Internet también está lleno de servicios de base de datos de Mongo que puede utilizar. Nuestro proveedor preferido de MongoDB en este curso será [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

Una vez que haya creado e iniciado sesión en su cuenta, Atlas recomendará crear un clúster:

![](../../images/3/57.png)

Elija <i>AWS</i> como proveedor y <i>Frankfurt</i> como región, y creemos un clúster.

![](../../images/3/58.png)

Esperemos a que el clúster esté listo para usarse. Esto puede tardar aproximadamente 10 minutos.

**NB** no continúe antes de que el clúster esté listo.

Usemos la pestaña de <i>database access</i> para crear credenciales de usuario para la base de datos. Tenga en cuenta que estas no son las mismas credenciales que utiliza para iniciar sesión en MongoDB Atlas. Estos se utilizarán para que su aplicación se conecte a la base de datos.

![](../../images/3/59.png)

Concedamos al usuario permisos para leer y escribir en las bases de datos.

![](../../images/3/60.png)

**NB:** Algunas personas informaron que las nuevas credenciales de usuario no funcionan inmediatamente después de su creación. En algunos casos, han pasado minutos antes de que las credenciales comiencen a funcionar.

A continuación, tenemos que definir las direcciones IP a las que se permite el acceso a la base de datos.

![](../../images/3/61ea.png)

Para simplificar, permitiremos el acceso desde todas las direcciones IP:

![](../../images/3/62.png)

Finalmente estamos listos para conectarnos a nuestra base de datos. Comience haciendo clic en <i>connect</i>:

![](../../images/3/63ea.png)

y elija <i>Connect your application</i>:

![](../../images/3/64ea.png)

La vista muestra el <i>URI de MongoDB</i>, que es la dirección de la base de datos que proporcionaremos a la biblioteca cliente de MongoDB que agregaremos a nuestra aplicación.

La dirección se ve así:

```bash
mongodb+srv://fullstack:<PASSWORD>@cluster0-ostce.mongodb.net/test?retryWrites=true
```

Ahora estamos listos para usar la base de datos.

Podríamos usar la base de datos directamente desde nuestro código JavaScript con la biblioteca de [controladores oficial MongoDb Node.js](https://mongodb.github.io/node-mongodb-native/), pero es bastante engorroso de usar. En su lugar, usaremos la biblioteca [Mongoose](http://mongoosejs.com/index.html) que ofrece una API de nivel superior.

Mongoose podría describirse como un <i>mapeador de documentos de objetos</i> (ODM), y guardar objetos JavaScript como documentos de Mongo es sencillo con esta biblioteca.

Instalemos Mongoose:

```bash
npm install mongoose
```

No agreguemos ningún código relacionado con Mongo a nuestro backend por el momento. En cambio, hagamos una aplicación de práctica creando un nuevo archivo, <i>mongo.js</i>:

```js
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0-ostce.mongodb.net/test?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'HTML is Easy',
  date: new Date(),
  important: true,
})

note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})
```

**NB:** Dependiendo de la región que seleccionó al crear su clúster, el <i>MongoDB URI</i> puede ser diferente del ejemplo proporcionado anteriormente. Debe verificar y usar el URI correcto que se generó a partir de MongoDB Atlas.

El código también asume que se le pasará la contraseña de las credenciales que creamos en MongoDB Atlas, como un parámetro de línea de comando. Podemos acceder al parámetro de la línea de comandos así:

```js
const password = process.argv[2]
```

Cuando el código se ejecuta con el comando <i>node mongo.js password</i>, Mongo agregará un nuevo documento a la base de datos.

**NB:** tenga en cuenta que la contraseña es la contraseña creada para el usuario de la base de datos, no su contraseña de MongoDB Atlas. Además, si creó una contraseña con caracteres especiales, deberá [codificar esa contraseña en la URL](https://docs.atlas.mongodb.com/troubleshoot-connection/#special-characters-in-connection-string-password).

Podemos ver el estado actual de la base de datos en MongoDB Atlas desde <i>Collections</i>, en la pestaña Descripción general.

![](../../images/3/65.png)

Como indica la vista, el <i>documento</i> que coincide con la nota se ha agregado a la colección de <i>notes</i> en la base de datos <i>test</i>.

![](../../images/3/66a.png)

Deberíamos darle un mejor nombre a la base de datos. Como dice la documentación, podemos cambiar el nombre de la base de datos del URI:

![](../../images/3/67.png)

Destruyamos la base de datos <i>test</i>. Cambiemos ahora el nombre de la base de datos a la que se hace referencia en nuestra cadena de conexión a <i>note-app</i> en su lugar, modificando el URI:

```bash
mongodb+srv://fullstack:<PASSWORD>@cluster0-ostce.mongodb.net/note-app?retryWrites=true
```

Ejecutemos nuestro código de nuevo.

![](../../images/3/68.png)

Los datos ahora se almacenan en la base de datos correcta. La vista también ofrece la función de <i>create database</i>, que se puede utilizar para crear nuevas bases de datos desde el sitio web. No es necesario crear la base de datos de esta manera, ya que MongoDB Atlas crea automáticamente una nueva base de datos cuando una aplicación intenta conectarse a una base de datos que aún no existe.


### Schema

Después de establecer la conexión a la base de datos, definimos el [esquema](http://mongoosejs.com/docs/guide.html) para una nota y el [modelo](http://mongoosejs.com/docs/models.html) correspondiente:

```js
const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)
```

Primero definimos el [esquema](http://mongoosejs.com/docs/guide.html) de una nota que se almacena en la variable _noteSchema_. El esquema le dice a Mongoose cómo se almacenarán los objetos de nota en la base de datos.

En la definición del modelo _Note_, el primer parámetro de <i>"Note"</i> es el nombre singular del modelo. El nombre de la colección será el plural <i>notes</i> en minúsculas, porque la [convención de Mongoose](http://mongoosejs.com/docs/models.html) es nombrar automáticamente las colecciones como el plural (por ejemplo, <i>notes</i>) cuando el esquema se refiere a ellas en singular (por ejemplo, <i>Note</i>).

Las bases de datos de documentos como Mongo <i>no tienen esquema</i>, lo que significa que la base de datos en sí no se preocupa por la estructura de los datos que se almacenan en la base de datos. Es posible almacenar documentos con campos completamente diferentes en la misma colección.

La idea detrás de Mongoose es que los datos almacenados en la base de datos reciben un <i>esquema al nivel de la aplicación</i> que define la forma de los documentos almacenados en una colección determinada.


### Crear y guardar objetos

A continuación, la aplicación crea un nuevo objeto de nota con la ayuda del [modelo](http://mongoosejs.com/docs/models.html) de <i>Note</i>:

```js
const note = new Note({
  content: 'HTML is Easy',
  date: new Date(),
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

Cuando el objeto se guarda en la base de datos, el controlador de eventos proporcionado _then_ se invoca. El controlador de eventos cierra la conexión de la base de datos con el comando <code>mongoose.connection.close()</code>. Si la conexión no se cierra, el programa nunca terminará su ejecución.

El resultado de la operación de guardar está en el parámetro _result_ del controlador de eventos. El resultado no es tan interesante cuando almacenamos un objeto en la base de datos. Puede imprimir el objeto en la consola si desea verlo más de cerca mientras implementa su aplicación o durante el debugging.

Guardemos también algunas notas más modificando los datos en el código y ejecutando el programa nuevamente.

**NB:** Desafortunadamente, la documentación de Mongoose no es muy consistente, con partes de ella usando callbacks en sus ejemplos y otras partes, otros estilos, por lo que no se recomienda copiar y pegar código directamente desde allí. No se recomienda mezclar promesas con callbacks de la vieja escuela en el mismo código.


### Obteniendo objetos de la base de datos

Comentemos el código para generar nuevas notas y reemplácelo con lo siguiente:

```js
Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})
```

Cuando se ejecuta el código, el programa imprime todas las notas almacenadas en la base de datos:

![](../../images/3/70ea.png)

Los objetos se recuperan de la base de datos con el método [find](https://mongoosejs.com/docs/api.html#model_Model.find) del modelo _Note_. El parámetro del método es un objeto que expresa condiciones de búsqueda. Dado que el parámetro es un objeto vacío <code>{}</code>, obtenemos todas las notas almacenadas en la colección  _notes_.

Las condiciones de búsqueda se adhieren a la [sintaxis](https://docs.mongodb.com/manual/reference/operator/) de consulta de búsqueda de Mongo.

Podríamos restringir nuestra búsqueda para incluir solo notas importantes como esta:

```js
Note.find({ important: true }).then(result => {
  // ...
})
```

</div>

<div class="tasks">

### Ejercicio 3.12.

#### 3.12: Base de datos de línea de comandos

Cree una base de datos MongoDB basada en la nube para la aplicación de agenda con MongoDB Atlas.

Cree un archivo <i>mongo.js</i> en el directorio del proyecto, que se puede usar para agregar entradas a la agenda y para enumerar todas las entradas existentes en la agenda.

**NB:** ¡No incluya la contraseña en el archivo que hace commit confirma y sube a GitHub!

La aplicación debería funcionar de la siguiente manera. Utiliza el programa pasando tres argumentos de línea de comando (el primero es la contraseña), por ejemplo:

```bash
node mongo.js yourpassword Anna 040-1234556
```

Como resultado, la aplicación imprimirá:

```bash
added Anna number 040-1234556 to phonebook
```

La nueva entrada a la agenda telefónica se guardará en la base de datos. Tenga en cuenta que si el nombre contiene espacios en blanco, debe ir entre comillas:

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

Puede obtener los parámetros de la línea de comandos de la variable [process.argv](https://nodejs.org/docs/latest-v8.x/api/process.html#process_process_argv).

**NB: no cierre la conexión en el lugar incorrecto**. Por ejemplo, el siguiente código no funcionará:

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

**NB:** Si define un modelo con el nombre <i>Person</i>, mongoose nombrará automáticamente la colección asociada como <i>people</i>.

</div>

<div class="content">

### Backend conectado a una base de datos

Ahora tenemos suficiente conocimiento para comenzar a usar Mongo en nuestra aplicación.

Comencemos rápidamente copiando y pegando las definiciones de Mongoose en el archivo <i>index.js</i>:

```js
const mongoose = require('mongoose')

// DO NOT SAVE YOUR PASSWORD TO GITHUB!!
const url =
  'mongodb+srv://fullstack:sekred@cluster0-ostce.mongodb.net/note-app?retryWrites=true'

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)
```

Cambiemos el controlador para obtener todas las notas al siguiente formulario:

```js
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})
```

Podemos verificar en el navegador que el backend funciona para mostrar todos los documentos:

![](../../images/3/44ea.png)

La aplicación funciona casi a la perfección. El frontend asume que cada objeto tiene un id único en el campo de <i>id</i>. Tampoco queremos retornar el campo de control de versiones de mongo <i>\_\_v</i> al frontend.

Una forma de formatear los objetos devueltos por Mongoose es [modificar](https://stackoverflow.com/questions/7034848/mongodb-output-id-instead-of-id) el método _toJSON_ del esquema, que se utiliza en todas las instancias de los modelos producidos con ese esquema. La modificación del método funciona así:

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

Respondamos a la solicitud HTTP con una lista de objetos formateados con el método _toJSON_ :

```js
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})
```

Ahora, la variable _notes_ se asigna a un array de objetos devueltos por Mongo. Cuando la respuesta se envía en formato JSON, el método [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) llama automáticamente al método _toJSON_ de cada objeto del array.


### Configuración de la base de datos en su propio módulo

Antes de refactorizar el resto del backend para usar la base de datos, extraigamos el código específico de Mongoose en su propio módulo.

Creemos un nuevo directorio para el módulo llamado <i>models</i> y agreguemos un archivo llamado <i>note.js</i>:

```js
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI // highlight-line

console.log('connecting to', url) // highlight-line

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
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
  date: Date,
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

La definición de [módulos](https://nodejs.org/docs/latest-v8.x/api/modules.html) de Node difiere ligeramente de la forma de definir [módulos ES6](/es/part2/rendering_a_collection_modules#refactoring-modules) en la parte 2.

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

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })
```

No es una buena idea codificar la dirección de la base de datos en el código, por lo que la dirección de la base de datos se pasa a la aplicación a través de la variable de entorno <em>MONGODB_URI</em>.

El método para establecer la conexión ahora tiene funciones para lidiar con un intento de conexión exitoso y no exitoso. Ambas funciones simplemente registran un mensaje en la consola sobre el estado de éxito:

![](../../images/3/45e.png)

Hay muchas formas de definir el valor de una variable de entorno. Una forma sería definirlo cuando se inicia la aplicación:

```bash
MONGODB_URI=address_here npm run dev
```

Una forma más sofisticada es utilizar la biblioteca [dotenv](https://github.com/motdotla/dotenv#readme). Puede instalar la librería con el comando:

```bash
npm install dotenv
```

Para usar la biblioteca, creamos un archivo <i>.env</i> en la raíz del proyecto. Las variables de entorno se definen dentro del archivo y pueden verse así:

```bash
MONGODB_URI='mongodb+srv://fullstack:sekred@cluster0-ostce.mongodb.net/note-app?retryWrites=true'
PORT=3001
```

También agregamos el puerto codificado del servidor en la variable de entorno <em>PORT</em>.

**El archivo <i>.env</i> debe ignorarse de inmediato en .gitignore, ya que no queremos publicar ninguna información confidencial públicamente en línea.**

![](../../images/3/45ae.png)

Las variables de entorno definidas en el archivo <i>.env</i> se pueden utilizar con la expresión <em>require('dotenv').config()</em> y puede hacer referencia a ellas en su código como lo haría con las variables de entorno normales, con la sintaxis conocida <em>process.env.MONGODB_URI</em>.

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


### Usando la base de datos en los controladores de ruta

A continuación, cambiemos el resto de la funcionalidad de backend para usar la base de datos.

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
    date: new Date(),
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })
})
```

Los objetos de nota se crean con la función de constructor _Note_. La respuesta se envía dentro de la función callback para la operación _save_. Esto asegura que la respuesta se envíe solo si la operación se realizó correctamente. Discutiremos el manejo de errores un poco más adelante.

El parámetro _SavedNote_ en la función callback es la nota guardada y recién creada. Los datos devueltos en la respuesta son la versión formateada creada con el método _toJSON_ :

```js
response.json(savedNote)
```

Usando el método [findById](https://mongoosejs.com/docs/api.html#model_Model.findById) de Mongoose, la obtención de una nota individual se cambia a lo siguiente:

```js
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(note => {
    response.json(note)
  })
})
```


### Verificación de la integración de frontend y backend

Cuando el backend se expande, es una buena idea probar el backend primero con **el navegador, Postman o el cliente REST de VS Code**. A continuación, intentemos crear una nueva nota después de utilizar la base de datos:

![](../../images/3/46e.png)

Solo una vez que se haya verificado que todo funciona en el backend, es una buena idea probar que el frontend funciona con el backend. Es muy ineficiente probar cosas exclusivamente a través del frontend.

Probablemente sea una buena idea integrar el frontend y el backend una funcionalidad a la vez. Primero, podríamos implementar la búsqueda de todas las notas de la base de datos y probarlas a través del endpoint de backend en el navegador. Después de esto, pudimos verificar que el frontend funciona con el nuevo backend. Una vez que todo parezca funcionar, pasaríamos a la siguiente función.

Una vez que introducimos una base de datos en la mezcla, es útil inspeccionar el estado persistente en la base de datos, por ejemplo, desde el panel de control en MongoDB Atlas. Muy a menudo, los pequeños programas auxiliares de Node como el programa <i>mongo.js</i> que escribimos anteriormente pueden ser muy útiles durante el desarrollo.

Puede encontrar el código para nuestra aplicación actual en su totalidad en la rama <i>part3-4</i> de [este repositorio de Github](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-4).

</div>

<div class="tasks">

### Ejercicios 3.13.-3.14.

Los siguientes ejercicios son bastante sencillos, pero si su frontend deja de funcionar con el backend, entonces encontrar y corregir los errores puede ser bastante interesante.

#### 3.13: Base de datos de la agenda telefónica, paso 1

Cambie la búsqueda de todas las entradas de la agenda telefónica para que los datos <i>se obtengan de la base de datos</i>.

Verifique que el frontend funcione después de que se hayan realizado los cambios.

En los siguientes ejercicios, escriba todo el código específico de Mongoose en su propio módulo, como hicimos en el capítulo [Configuración de la base de datos en su propio módulo](/es/part3/saving_data_to_mongo_db#database-configuration-into-its-own-module).

#### 3.14: Base de datos de la agenda telefónica, paso 2

Cambie el backend para que los nuevos números se <i>guarden en la base de datos</i>. Verifique que su frontend aún funcione después de los cambios.

En este punto, puede optar por permitir que los usuarios creen todas las entradas de la agenda. En esta etapa, la agenda puede tener varias entradas para una persona con el mismo nombre.

</div>

<div class="content">

### Manejo de errores

Si intentamos visitar la URL de una nota con un id que en realidad no existe, por ejemplo, <http://localhost:3001/api/notes/5c41c90e84d891c15dfa3431>  donde <i>5c41c90e84d891c15dfa3431</i> no es un id almacenado en la base de datos, entonces la respuesta será _null_.

Cambiemos este comportamiento para que si la nota con la identificación dada no existe, el servidor responderá a la solicitud con el código de estado HTTP 404 not found. Además, implementemos un bloque <em>catch</em> simple para manejar los casos en los que la promesa devuelta por el método <em>findById</em> es rechazada:

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
Si el formato del id es incorrecto, terminaremos en el controlador de errores definido en el bloque _catch_. El código de estado apropiado para la situación es [400 Bad Request](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.1), porque la situación se ajusta perfectamente a la descripción:

> <i>El servidor no pudo entender la solicitud debido a una sintaxis incorrecta. El cliente NO DEBE repetir la solicitud sin modificaciones.</i>

También hemos agregado algunos datos a la respuesta para arrojar algo de luz sobre la causa del error.

Cuando se trata de Promesas, casi siempre es una buena idea agregar el manejo de errores y excepciones, porque de lo contrario se encontrará lidiando con errores extraños.

Nunca es una mala idea imprimir el objeto que causó la excepción en la consola en el controlador de errores:

```js
.catch(error => {
  console.log(error)
  response.status(400).send({ error: 'malformatted id' })
})
```

La razón por la que se llama al controlador de errores puede ser algo completamente diferente de lo que había anticipado. Si registra el error en la consola, puede ahorrarse largas y frustrantes sesiones de debugging. Además, la mayoría de los servicios modernos en los que implementa su aplicación admiten algún tipo de sistema de registro que puede usar para verificar estos registros. Como se mencionó, Heroku es uno.

Cada vez que trabajas en un proyecto con un backend, <i>es fundamental estar atento a la salida de la consola del backend</i>. Si está trabajando en una pantalla pequeña, basta con ver una pequeña porción de la salida en segundo plano. Cualquier mensaje de error llamará su atención incluso cuando la consola esté muy atrás en segundo plano:

![](../../images/3/15b.png)

### Mover el manejo de errores al middleware

Hemos escrito el código para el controlador de errores entre el resto de nuestro código. Esta puede ser una solución razonable a veces, pero hay casos en los que es mejor implementar todo el manejo de errores en un solo lugar. Esto puede ser particularmente útil si más adelante queremos reportar datos relacionados con errores a un sistema de seguimiento de errores externo como [Sentry](https://sentry.io/welcome/).

Cambiemos el manejador de la ruta <i>/api/notes/:id</i>, para que pase el error hacia adelante con la función <em>next</em>. La función <em>next</em> se pasa al controlador como tercer parámetro:

Let's change the handler for the <i>/api/notes/:id</i> route, so that it passes the error forward with the <em>next</em> function. The next function is passed to the handler as the third parameter:

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

El error que se pasa hacia adelante se da a la función <em>next</em> como parámetro. Si se llamó a next sin un parámetro, entonces la ejecución simplemente pasaría a la siguiente ruta o middleware. Si se llama a la función <em>next</em> con un parámetro, la ejecución continuará en el <i>middleware del controlador de errores</i>.

Los [manejadores de errores](https://expressjs.com/en/guide/error-handling.html) de Express son middleware que se definen con una función que acepta <i>cuatro parámetros</i>. Nuestro controlador de errores se ve así:

```js
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)
```

El controlador de errores comprueba si el error es una excepción <i>CastError</i>, en cuyo caso sabemos que el error fue causado por un ID de objeto no válido para Mongo. En esta situación, el controlador de errores enviará una respuesta al navegador con el objeto de respuesta pasado como parámetro. En todas las demás situaciones de error, el middleware pasa el error al controlador de errores Express predeterminado.


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

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  // ...
}

// handler of requests with result to errors
app.use(errorHandler)
```

El middleware json-parser debería estar entre los primeros middleware cargados en Express. Si el pedido fue el siguiente:

```js
app.use(logger) // request.body is undefined!

app.post('/api/notes', (request, response) => {
  // request.body is undefined!
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

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

app.get('/api/notes', (request, response) => {
  // ...
})
```

Ahora, el manejo de los endpoints desconocidos se ordena <i>antes que el controlador de solicitudes HTTP</i>. Dado que el controlador de endpoint desconocido responde a todas las solicitudes con <i>404 unknown endpoint</i>, no se llamará a ninguna ruta o middleware después de que el middleware de endpoint desconocido haya enviado la respuesta. La única excepción a esto es el controlador de errores que debe estar al final, después del controlador de endpoints desconocido.


### Otras operaciones
Agreguemos algunas funciones que faltan a nuestra aplicación, incluida la eliminación y actualización de una nota individual.

La forma más fácil de eliminar una nota de la base de datos es con el método [findByIdAndRemove](https://mongoosejs.com/docs/api.html#model_Model.findByIdAndRemove):

```js
app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})
```

En los dos casos "exitosos" de eliminar un recurso, el backend responde con el código de estado <i>204 no content</i>. Los dos casos diferentes son eliminar una nota que existe y eliminar una nota que no existe en la base de datos. El parámetro callback de resultado podría usarse para verificar si un recurso realmente se eliminó, y podríamos usar esa información para devolver códigos de estado diferentes para los dos casos si lo consideramos necesario. Cualquier excepción que ocurra se pasa al manejador de errores.

El cambio de la importancia de una nota se puede lograr fácilmente con el método [findByIdAndUpdate](https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate).

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

En el código anterior, también permitimos que se edite el contenido de la nota. Sin embargo, no apoyaremos el cambio de la fecha de creación por razones obvias.

Observe que el método <em>findByIdAndUpdate</em> recibe un objeto JavaScript normal como parámetro, y no un nuevo objeto de nota creado con la función constructora <em>Note</em>.

Hay un detalle importante con respecto al uso del método <em>findByIdAndUpdate</em>. De forma predeterminada, el parámetro <em>updatedNote</em> del controlador de eventos recibe el documento original [sin las modificaciones](https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate). Agregamos el parámetro opcional <code>{ new: true }</code>, que hará que nuestro controlador de eventos sea llamado con el nuevo documento modificado en lugar del original.

Después de probar el backend directamente con Postman y el cliente REST de VS Code, podemos verificar que parece funcionar. El frontend también parece funcionar con el backend usando la base de datos.

Puede encontrar el código para nuestra aplicación actual en su totalidad en la rama <i>part3-5</i> de [este repositorio de github](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-5).

</div>

<div class="tasks">

### Ejercicios 3.15.-3.18.

#### 3.15: Base de datos de la agenda telefónica, paso 3

Cambie el backend para que la eliminación de entradas de la agenda telefónica se refleje en la base de datos.

Verifique que elfrontend aún funcione después de realizar los cambios.

#### 3.16: Base de datos de la agenda telefónica, paso 4

Mueva el manejo de errores de la aplicación a un nuevo middleware de manejo de errores.

#### 3.17 *: Base de datos de la agenda, paso 5

Si el usuario intenta crear una nueva entrada en la agenda para una persona cuyo nombre ya está en la agenda, elfrontend intentará actualizar el número de teléfono de la entrada existente realizando una solicitud HTTP PUT a la URL única de la entrada.

Modifique el backend para admitir esta solicitud.

Verifique que el frontend funcione después de realizar sus cambios.

#### 3.18 *: Base de datos de la agenda telefónica, paso 6

También actualice el manejo de las rutas <i>api/persons/:id</i> e <i>info</i> para usar la base de datos, y verifique que funcionen directamente con el navegador, Postman o el cliente REST de VS Code.

La inspección de una entrada individual de la agenda telefónica desde el navegador debería verse así:

![](../../images/3/49.png)

</div>
