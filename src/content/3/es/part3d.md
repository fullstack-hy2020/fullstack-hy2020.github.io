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
    minLength: 5,
    required: true
  },
  // highlight-end
  important: Boolean
})
```

El campo <i>content</i> ahora requiere tener al menos cinco caracteres de longitud y esta definido como required, lo que significa que no puede faltar. No hemos agregado ninguna restricción al campo <i>important</i>, por lo que su definición en el esquema no ha cambiado.

Los validadores <i>minlength</i> y <i>required</i> están [integrados](https://mongoosejs.com/docs/validation.html#built-in-validators) y proporcionados por Mongoose. La funcionalidad del [validador personalizado](https://mongoosejs.com/docs/validation.html#custom-validators) de Mongoose nos permite crear nuevos validadores, si ninguno de los integrados cubre nuestras necesidades.

Si intentamos almacenar un objeto en la base de datos que rompe una de las restricciones, la operación lanzará una excepción. Cambiemos nuestro controlador para crear una nueva nota para que pase las posibles excepciones al middleware del controlador de errores:

```js
app.post('/api/notes', (request, response, next) => { // highlight-line
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save()
    .then(savedNote => {
      response.json(savedNote)
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

![postman mostrando mensaje de error](../../images/3/50.png)

Notamos que el backend ahora tiene un problema: las validaciones no se realizan al editar una nota.
La [documentación](https://github.com/blakehaswell/mongoose-unique-validator#find--updates) aborda el problema explicando que las validaciones no se ejecutan por defecto cuando se utilizan los métodos <i>findOneAndUpdate</i> y métodos relacionados.

La solución es sencilla. También reformulemos un poco el código de la ruta:

```js
app.put('/api/notes/:id', (request, response, next) => {
  const { content, important } = request.body // highlight-line

  Note.findByIdAndUpdate(
    request.params.id, 
    { content, important }, // highlight-line
    { new: true, runValidators: true, context: 'query' } // highlight-line
  ) 
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})
```

### Desplegando el backend con base de datos a producción

La aplicación debería funcionar casi tal como está en Fly.io/Render. No necesitamos generar una nueva versión de producción del frontend, ya que los cambios realizados hasta ahora solo afectan a nuestro backend.

Las variables de entorno definidas en dotenv solo se usarán cuando el backend no esté en <i>modo de producción</i>, es decir, en Fly.io o Render.

Para producción, debemos establecer la URL de la base de datos en el servicio que está alojando nuestra aplicación.

En Fly.io se hace con _fly secrets set_:

```bash
fly secrets set MONGODB_URI='mongodb+srv://fullstack:thepasswordishere@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority'
```

Cuando la aplicación está en desarrollo, es muy probable que algo falle. Por ejemplo, cuando desplegué mi aplicación por primera vez con la base de datos, no se veía ni una sola nota:

![navegador sin notas](../../images/3/fly-problem1.png)

La pestaña de red de la consola del navegador reveló que la obtención de las notas no tuvo éxito; la solicitud permaneció en estado _pendiente_ durante mucho tiempo hasta que falló con un código de estado 502.

¡La consola del navegador debe estar abierta <i>todo el tiempo!</i>

También es vital seguir continuamente los registros del servidor. El problema se hizo evidente cuando se abrieron los registros con _fly logs_:

![registro del servidor fly.io mostrando conexión a undefined](../../images/3/fly-problem3.png)

La URL de la base de datos era _undefined_, por lo que el comando *fly secrets set MONGODB\_URI* no fue utilizado.

Cuando se utiliza Render, la URL de la base de datos se proporciona definiendo la variable de entorno adecuada en el panel de control:

![Render Dashboard mostrando la variable de entorno MONGODB_URI](../../images/3/render-env.png)

El panel de control de Render muestra los registros del servidor:

![Render Dashboard con flecha apuntando al servidor en ejecución en el puerto 10000](../../images/3/r7.png)

Puedes encontrar el código de nuestra aplicación actual en su totalidad en la rama <i>part3-6</i> de [este repositorio de GitHub](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-6).

</div>

<div class="tasks">

### Ejercicios 3.19.-3.21.

#### 3.19*: Base de datos de la Agenda Telefónica, paso 7

Amplía la validación para que el nombre almacenado en la base de datos tenga al menos tres caracteres de longitud.

Expande el frontend para que muestre algún tipo de mensaje de error cuando ocurra un error de validación. El manejo de errores se puede implementar agregando un bloque <em>catch</em> como se muestra a continuación:

```js
personService
    .create({ ... })
    .then(createdPerson => {
      // ...
    })
    .catch(error => {
      // está es la forma de acceder al mensaje de error
      console.log(error.response.data.error)
    })
```

Puedes mostrar el mensaje de error predeterminado devuelto por Mongoose, aunque no son muy legibles:

![captura de pantalla de la agenda telefónica que muestra el fallo de validación de la persona](../../images/3/56e.png)

**NB:** En las operaciones de actualización, los validadores de mongoose están desactivados por defecto. [Lee la documentación](https://mongoosejs.com/docs/validation.html) para ver cómo habilitarlos.

#### 3.20*: Base de datos de la Agenda Telefónica, paso 8

Agrega validación a tu aplicación de agenda telefónica para asegurarte de que los números de teléfono tengan el formato correcto. Un número de teléfono debe:

- Tener una longitud de 8 o más caracteres.
- Estar formado por dos partes separadas por -, la primera parte tiene dos o tres números y la segunda parte también consiste en números.
    - Por ejemplo, 09-1234556 y 040-22334455 son números de teléfono válidos.
    - Por ejemplo, 1234556, 1-22334455 y 10-22-334455 son inválidos.

Utiliza un [validador personalizado](https://mongoosejs.com/docs/validation.html#custom-validators) para implementar la segunda parte de la validación.

Si una solicitud HTTP POST intenta agregar una persona con un número de teléfono no válido, el servidor debería responder con un código de estado apropiado y un mensaje de error.

#### 3.21 Desplegando el backend con base de datos en producción

Genera una nueva versión "full stack" de la aplicación creando una nueva compilación de producción del frontend y copiándola al repositorio del backend. Verifica que todo funcione localmente utilizando la aplicación completa desde la dirección <http://localhost:3001/>.

Lleva la versión más reciente a Fly.io/Render y verifica que todo funcione allí también.

**NOTA**: debes desplegar el BACKEND en el servicio en la nube. Si estás utilizando Fly.io, los comandos deben ejecutarse en el directorio raíz del backend (es decir, en el mismo directorio donde se encuentra el package.json del backend). En caso de usar Render, el backend debe estar en la raíz de tu repositorio.

NO debes desplegar el frontend directamente en ninguna etapa de esta parte. Es solo el repositorio del backend que se despliega en toda esta sección, nada más.

</div>

<div class="content">

### Lint

Antes de pasar a la siguiente parte, veremos una herramienta importante llamada [lint](<https://es.wikipedia.org/wiki/Lint>). Wikipedia dice lo siguiente sobre lint:

> <i>Genéricamente, lint o linter es cualquier herramienta que detecta y marca errores en los lenguajes de programación, incluidos los errores de estilo. El término comportamiento lint-like a veces se aplica al proceso de marcar el uso de lenguaje sospechoso. Las herramientas de tipo lint generalmente realizan análisis estáticos del código fuente.</i>

En lenguajes compilados de tipado estático como Java, los IDE como NetBeans pueden señalar errores en el código, incluso aquellos que son más que simples errores de compilación. Se pueden utilizar herramientas adicionales para realizar [análisis estáticos](https://es.wikipedia.org/wiki/An%C3%A1lisis_est%C3%A1tico_de_software), como [checkstyle](https://checkstyle.sourceforge.io), para ampliar las capacidades del IDE y señalar también problemas relacionados con el estilo, como la indentación.

En el universo de JavaScript, la herramienta líder actual para el análisis estático (también conocida como "linting") es [ESlint](https://eslint.org/).

Instalemos ESlint como una dependencia de desarrollo del proyecto de backend con el comando:

```bash
npm install eslint --save-dev
```

Después de esto, podemos inicializar una configuración predeterminada de ESlint con el comando:

```bash
npx eslint --init
```

Responderemos todas las preguntas:

![salida del terminal de ESlint init](../../images/3/52new.png)

La configuración se guardará en el archivo _.eslintrc.js_:

```js
module.exports = {
    'env': {
        'commonjs': true,
        'es2021': true,
        'node': true // highlight-line
    },
    'extends': 'eslint:recommended',
    'parserOptions': {
        'ecmaVersion': 'latest'
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

Cambiemos inmediatamente la regla relativa a la indentación, de modo que el nivel de indentación sea de dos espacios.

```js
"indent": [
    "error",
    2
],
```

Se puede inspeccionar y validar un archivo como _index.js_ con el siguiente comando:

```bash
npx eslint index.js
```

Se recomienda crear un _script npm_ separado para linting:

```json
{
  // ...
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    // ...
    "lint": "eslint ." // highlight-line
  },
  // ...
}
```

Ahora, el comando _npm run lint_ comprobará todos los archivos del proyecto.

Además, los archivos del directorio <em>dist</em> se comprueban cuando se ejecuta el comando. No queremos que esto suceda, y podemos lograrlo creando un archivo [.eslintignore](https://eslint.org/docs/latest/use/configure/ignore#the-eslintignore-file) en la raíz del proyecto con el siguiente contenido:

```bash
dist
```

Esto hace que el directorio <em>dist</em> no sea comprobado por ESlint.

Lint tiene mucho que decir sobre nuestro código:

![salida de consola con errores de ESlint](../../images/3/53ea.png)

No solucionemos estos problemas todavía.

Una mejor alternativa a ejecutar el linter desde la línea de comandos es configurar un <i>eslint-plugin</i> en el editor, que ejecuta el linter continuamente. Al usar el plugin, verá errores en su código de inmediato. Puede encontrar más información sobre el plugin Visual Studio ESLint [aquí](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint).

El plugin de VS Code ESlint subrayará las violaciones de estilo con una línea roja:

![plugin de ESlint mostrando errores en el código](../../images/3/54a.png)

Esto hace que los errores sean fáciles de detectar y puedan ser corregidos de inmediato.

ESlint tiene una amplia gama de [reglas](https://eslint.org/docs/rules/) que son fáciles de usar al editar el archivo <i>.eslintrc.js</i>.

Agreguemos la regla [eqeqeq](https://eslint.org/docs/rules/eqeqeq) que nos alerta si la igualdad se verifica con algo que no sea el operador de triple igual. La regla se agrega bajo el campo <i>rules</i> en el archivo de configuración.

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

Esto incluye una regla que advierte sobre los comandos _console.log_. La [desactivación](https://eslint.org/docs/latest/use/configure/rules) de una regla se puede lograr definiendo su "valor" como 0 en el archivo de configuración. Mientras tanto, hagamos esto para la regla <i>no-console</i>.

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

**NB** cuando realizas cambios en el archivo <i>.eslintrc.js</i>, se recomienda ejecutar el linter desde la línea de comandos. Esto verificará que el archivo de configuración esté formateado correctamente:

![salida de terminal del comando npm run lint](../../images/3/55.png)

Si hay algún problema en tu archivo de configuración, el plugin lint puede comportarse de manera bastante errática.

Muchas empresas definen estándares de codificación que se aplican en toda la organización a través del archivo de configuración de ESlint. No se recomienda seguir reinventando la rueda una y otra vez, y puede ser una buena idea adoptar una configuración ya hecha del proyecto de otra persona en el tuyo. Recientemente, muchos proyectos han adoptado la [guía de estilo Javascript](https://github.com/airbnb/javascript) de Airbnb al utilizar la configuración [ESlint](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb) de Airbnb.

Puedes encontrar el código para nuestra aplicación actual en su totalidad en la rama <i>part3-7</i> de [este repositorio de GitHub](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-7).

</div>

<div class="tasks">


### Ejercicio 3.22.

#### 3.22: Configuración de Lint

Agrega ESlint a tu aplicación y corrige todas las advertencias.

Este fue el último ejercicio de esta parte del curso. Es hora de enviar tu código a GitHub y marcar todos tus ejercicios terminados en el [sistema de envío de ejercicios](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

</div>
