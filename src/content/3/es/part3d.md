---
mainImage: ../../../images/part-3.svg
part: 3
letter: d
lang: es
---

<div class="content">


Por lo general, existen restricciones que queremos aplicar a los datos que se almacenan en la base de datos de nuestra aplicación. Nuestra aplicación no debe aceptar notas que tengan una propiedad <i>content</i> vacía o faltante. La validez de la nota se comprueba en el controlador de ruta:

```js
app.post('/api/notes', (request, response) => {
  const body = request.body
  // highlight-start
  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }
  // highlight-end

  // ...
})
```


Si la nota no tiene la propiedad <i>content</i>, respondemos a la solicitud con el código de estado <i>400 bad request</i>.

Una forma más inteligente de validar el formato de los datos antes de que se almacenen en la base de datos es utilizar la funcionalidad de [validación](https://mongoosejs.com/docs/validation.html) disponible en Mongoose.

Podemos definir reglas de validación específicas para cada campo en el esquema:

```js
const noteSchema = new mongoose.Schema({
  // highlight-start
  content: {
    type: String,
    minlength: 5,
    required: true
  },
  date: { 
    type: Date,
    required: true
  },
  // highlight-end
  important: Boolean
})
```


El campo <i>content</i> ahora se requiere tener al menos cinco caracteres de longitud. El campo <i>date</i> se establece como requerido, lo que significa que no puede faltar. La misma restricción también se aplica al campo <i>content</i>, ya que la restricción de longitud mínima permite que falte el campo. No hemos agregado ninguna restricción al campo <i>important</i>, por lo que su definición en el esquema no ha cambiado.

Los validadores <i>minlength</i> y <i>required</i> están [integrados](https://mongoosejs.com/docs/validation.html#built-in-validators) y proporcionados por Mongoose. La funcionalidad del [validador personalizado](https://mongoosejs.com/docs/validation.html#custom-validators) de Mongoose nos permite crear nuevos validadores, si ninguno de los integrados cubre nuestras necesidades.

Si intentamos almacenar un objeto en la base de datos que rompe una de las restricciones, la operación lanzará una excepción. Cambiemos nuestro controlador para crear una nueva nota para que pase las posibles excepciones al middleware del controlador de errores:

```js
app.post('/api/notes', (request, response, next) => { // highlight-line
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

  note.save()
    .then(savedNote => {
      response.json(savedNote.toJSON())
    })
    .catch(error => next(error)) // highlight-line
})
```


Expandamos el controlador de errores para tratar estos errores de validación:

```js
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') { // highlight-line
    return response.status(400).json({ error: error.message }) // highlight-line
  }

  next(error)
}
```


Cuando falla la validación de un objeto, devolvemos el siguiente mensaje de error predeterminado de Mongoose:

![](../../images/3/50.png)


### Promise chaining

Muchos de los controladores de ruta cambiaron los datos de respuesta al formato correcto llamando al método _toJSON_. Cuando creamos una nueva nota, se llamó al método _toJSON_ para el objeto pasado como parámetro a _then_:

```js
app.post('/api/notes', (request, response, next) => {
  // ...

  note.save()
    .then(savedNote => {
      response.json(savedNote.toJSON())
    })
    .catch(error => next(error)) 
})
```

Podemos lograr la misma funcionalidad de una manera mucho más limpia con el [encadenamiento de promesas](https://javascript.info/promise-chaining):

```js
app.post('/api/notes', (request, response, next) => {
  // ...

  note
    .save()
    // highlight-start
    .then(savedNote => {
      return savedNote.toJSON()
    })
    .then(savedAndFormattedNote => {
      response.json(savedAndFormattedNote)
    }) 
    // highlight-end
    .catch(error => next(error)) 
})
```


En el primer _then_ recibimos el objeto _savedNote_ devuelto por la Mongoose y formateado. Se retprna el resultado de la operación. Luego, como [discutimos anteriormente](/es/part2/altering_data_in_server#extracting-communication-with-the-backend-into-a-separate-module), el método _then_ de una promesa también devuelve una promesa y podemos acceder a la nota formateada registrando una nueva función callback con el método _then_.

Podemos limpiar nuestro código aún más usando la sintaxis más compacta para las funciones de flecha:

```js
app.post('/api/notes', (request, response, next) => {
  // ...

  note
    .save()
    .then(savedNote => savedNote.toJSON()) // highlight-line
    .then(savedAndFormattedNote => {
      response.json(savedAndFormattedNote)
    }) 
    .catch(error => next(error)) 
})
```

En este ejemplo, el encadenamiento de promesas no proporciona muchos beneficios. La situación cambiaría si hubiera muchas operaciones asincrónicas que tuvieran que realizarse en secuencia. No profundizaremos más en el tema. En la siguiente parte del curso aprenderemos sobre la sintaxis <i>async/await</i> en JavaScript, que facilitará mucho la escritura de operaciones asíncronas posteriores.


### Implementar el backend de la base de datos en producción

La aplicación debería funcionar casi como está en Heroku. Tenemos que generar un nuevo build de producción del frontend debido a los cambios que hemos realizado en él.

Las variables de entorno definidas en dotenv solo se utilizarán cuando el backend no esté en <i>modo de producción</i>, es decir, Heroku.

Definimos las variables de entorno para el desarrollo en el archivo <i>.env</i>, pero la variable de entorno que define la URL de la base de datos en producción debe establecerse en Heroku con el comando _heroku config:set_.  

```bash
$ heroku config:set MONGODB_URI=mongodb+srv://fullstack:secretpasswordhere@cluster0-ostce.mongodb.net/note-app?retryWrites=true
```

**NB:** si el comando causa un error, ingrese el valor de MONGODB_URI en apóstrofos:

```bash
$ heroku config:set MONGODB_URI='mongodb+srv://fullstack:secretpasswordhere@cluster0-ostce.mongodb.net/note-app?retryWrites=true'
```

La aplicación debería funcionar ahora. A veces, las cosas no salen según lo planeado. Si hay problemas, los <i>registros de heroku</i> estarán allí para ayudar. Mi propia aplicación no funcionó después de realizar los cambios. Los registros mostraron lo siguiente:

![](../../images/3/51a.png)

Por alguna razón, la URL de la base de datos no estaba definida. El comando <i>heroku config</i> reveló que había definido accidentalmente la URL de la variable de entorno <em>MONGO\_URL</em> , cuando el código esperaba que estuviera en <em>MONGODB\_URI</em>.

Puede encontrar el código para nuestra aplicación actual en su totalidad en la rama <i>part3-5</i> de [este repositorio de github](https://github.com/fullstack-hy2019/part3-notes-backend/tree/part3-5).
</div>

</div>

<div class="tasks">


### Ejercicios 3.19.-3.21.

#### 3.19: Base de datos de la agenda telefónica, paso 7

Agregue validación a su aplicación de agenda telefónica, que se asegurará de que una persona recién agregada tenga un nombre único. Nuestro frontend actual no permitirá a los usuarios intentar crear duplicados, pero podemos intentar crearlos directamente con Postman o el cliente REST de VS Code.

Mongoose no ofrece un validador integrado para este propósito. Instale el paquete [mongoose-unique-validator](https://github.com/blakehaswell/mongoose-unique-validator#readme) con npm y utilícelo en su lugar.

Si una solicitud HTTP POST intenta agregar un nombre que ya está en la agenda, el servidor debe responder con un código de estado apropiado y un mensaje de error.

#### 3.20 *: Base de datos de la agenda, paso 8

Expanda la validación para que el nombre almacenado en la base de datos tenga al menos tres caracteres y el número de teléfono tenga al menos 8 dígitos.

Expanda el frontend para que muestre algún tipo de mensaje de error cuando se produzca un error de validación. El manejo de errores se puede implementar agregando un bloque <em>catch</em> como se muestra a continuación:

```js
personService
    .create({ ... })
    .then(createdPerson => {
      // ...
    })
    .catch(error => {
      // this is the way to access the error message
      console.log(error.response.data)
    })
```


Puede mostrar el mensaje de error predeterminado devuelto por Mongoose, aunque no sean tan legibles como podrían ser:

![](../../images/3/56e.png)

**NB:** En las operaciones de actualización, los validadores de mangoose están desactivados de forma predeterminada. [Lea la documentación](https://mongoosejs.com/docs/validation.html) para determinar cómo habilitarlos.

#### 3.21 Implementación del backend de la base de datos en producción

Genere una nueva versión "full stack" de la aplicación creando una nueva compilación de producción del frontend y cópiela en el repositorio backend. Verifique que todo funcione localmente usando la aplicación completa desde la dirección <https://localhost:3001>.

Envíe la última versión a Heroku y verifique que todo funcione allí también.

</div>

<div class="content">


### Lint

Antes de pasar a la siguiente parte, veremos una herramienta importante llamada [lint](<https://en.wikipedia.org/wiki/Lint_(software)>). Wikipedia dice lo siguiente sobre lint:

> <i>Genéricamente, lint o linter es cualquier herramienta que detecta y marca errores en los lenguajes de programación, incluidos los errores de estilo. El término comportamiento lint-like a veces se aplica al proceso de marcar el uso de lenguaje sospechoso. Las herramientas de tipo lint generalmente realizan análisis estáticos del código fuente.</i>

En lenguajes compilados de tipado estático como Java, los IDE como NetBeans pueden señalar errores en el código, incluso aquellos que son más que simples errores de compilación. Se pueden utilizar herramientas adicionales para realizar [análisis estáticos](https://en.wikipedia.org/wiki/Static_program_analysis), como [checkstyle](https://checkstyle.sourceforge.io), para ampliar las capacidades del IDE y señalar también problemas relacionados con el estilo, como la identación.

En el universo de JavaScript, la herramienta líder actual para el análisis estático, también conocida como. "linting" es [ESlint](https://eslint.org/).

Instalemos ESlint como una dependencia de desarrollo del proyecto de backend con el comando:

```bash
npm install eslint --save-dev
```


Después de esto, podemos inicializar una configuración predeterminada de ESlint con el comando:

```bash
node_modules/.bin/eslint --init
```


Responderemos todas las preguntas:

![](../../images/3/52be.png)


La configuración se guardará en el archivo _.eslintrc.js_:

```js
module.exports = {
    'env': {
        'commonjs': true,
        'es6': true,
        'node': true
    },
    'extends': 'eslint:recommended',
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly'
    },
    'parserOptions': {
        'ecmaVersion': 2018
    },
    'rules': {
        'indent': [
            'error',
            4
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'never'
        ]
    }
}
```


Cambiemos inmediatamente la regla relativa a la sangría, de modo que el nivel de identación sea de dos espacios.

```js
"indent": [
    "error",
    2
],
```


Se puede inspeccionar y validar un archivo como _index.js_ con el siguiente comando:

```bash
node_modules/.bin/eslint index.js
```

Se recomienda crear un _npm script_ separado para linting:

```json
{
  // ...
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    // ...
    "lint": "eslint ."
  },
  // ...
}
```


Ahora, el comando _npm run lint_ comprobará todos los archivos del proyecto.

Además, los archivos del directorio <em>build</em> se comprueban cuando se ejecuta el comando. No queremos que esto suceda, y podemos lograrlo creando un archivo [.eslintignore](https://eslint.org/docs/user-guide/configuring#ignoring-files-and-directories) en la raíz del proyecto con el siguiente contenido:

```bash
build
```

Esto hace que toda la estructura de directorios a no ser comprobado por ESlint.

Lint tiene mucho que decir sobre nuestro código:

![](../../images/3/53ea.png)

No solucionemos estos problemas todavía.

Una mejor alternativa a ejecutar el linter desde la línea de comandos es configurar un <i>eslint-plugin</i> en el editor, que ejecuta el linter continuamente. Al usar el plugin, verá errores en su código de inmediato. Puede encontrar más información sobre el plugin Visual Studio ESLint [aquí](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint).

El plugin VS Code ESlint subrayará las violaciones de estilo con una línea roja:

![](../../images/3/54a.png)


Esto hace que los errores sean fáciles de detectar y corregir de inmediato.

ESlint tiene una amplia gama de [reglas](https://eslint.org/docs/rules/) que son fáciles de usar al editar el archivo <i>.eslintrc.js</i>.

Vamos a añadir regla [eqeqeq](https://eslint.org/docs/rules/eqeqeq) que nos advierte, si la igualdad se comprueba con cualquier cosa menos el operador de triple iguales. La regla se agrega bajo el campo <i>rules</i> en el archivo de configuración.

```js
{
  // ...
  'rules': {
    // ...
   'eqeqeq': 'error',
  },
}
```

Ya que estamos en eso, hagamos algunos otros cambios en las reglas.

Evitemos los [espacios finales innecesarios](https://eslint.org/docs/rules/no-trailing-spaces) al final de las líneas, exijamos que [siempre haya un espacio antes y después de las llaves](https://eslint.org/docs/rules/object-curly-spacing), y exijamos también un uso consistente de espacios en blanco en los parámetros de función de las funciones de flecha.

```js
{
  // ...
  'rules': {
    // ...
    'eqeqeq': 'error',
    'no-trailing-spaces': 'error',
    'object-curly-spacing': [
        'error', 'always'
    ],
    'arrow-spacing': [
        'error', { 'before': true, 'after': true }
    ]
  },
}
```


Nuestra configuración predeterminada utiliza un montón de reglas predeterminadas de <i>eslint:recommended</i>:

```bash
'extends': 'eslint:recommended',
```


Esto incluye una regla que advierte sobre los comandos _console.log_. La [desactivación](https://eslint.org/docs/user-guide/configuring#configuring-rules) de una regla se puede lograr definiendo su "valor" como 0 en el archivo de configuración. Mientras tanto , hagamos esto para la regla <i>no-console</i>.

```js
{
  // ...
  'rules': {
    // ...
    'eqeqeq': 'error',
    'no-trailing-spaces': 'error',
    'object-curly-spacing': [
        'error', 'always'
    ],
    'arrow-spacing': [
        'error', { 'before': true, 'after': true }
    ],
    'no-console': 0 // highlight-line
  },
}
```

**NB** cuando realiza cambios en el archivo <i>.eslintrc.js</i>, se recomienda ejecutar el linter desde la línea de comandos. Esto verificará que el archivo de configuración esté formateado correctamente:

![](../../images/3/55.png)


Si hay algún problema en su archivo de configuración, el plugin lint puede comportarse de manera bastante errática.

Muchas empresas definen estándares de codificación que se aplican en toda la organización a través del archivo de configuración de ESlint. No se recomienda seguir reinventando la rueda una y otra vez, y puede ser una buena idea adoptar una configuración ya hecha del proyecto de otra persona en el suyo. Recientemente, muchos proyectos han adoptado la [guía de estilo Javascript](https://github.com/airbnb/javascript) de Airbnb al utilizar la configuración [ESlint](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb) de Airbnb.

Puede encontrar el código para nuestra aplicación actual en su totalidad en la rama <i>part3-7</i> de [este repositorio de github](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-7).
</div>

<div class="tasks">


### Ejercicio 3.22.

#### 3.22: Configuración de Lint

Agregue ESlint a su aplicación y corrija todas las advertencias.

Este fue el último ejercicio de esta parte del curso. Es hora de enviar su código a GitHub y marcar todos sus ejercicios terminados en el [sistema de envío de ejercicios](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

</div>
