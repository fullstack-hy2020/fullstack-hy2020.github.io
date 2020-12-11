---
mainImage: ../../../images/part-4.svg
part: 4
letter: d
lang: en
---

<div class="content">

Los usuarios deben poder iniciar sesión en nuestra aplicación , y cuando un usuario inicia sesión, su información de usuario debe adjuntarse automáticamente a cualquier nota nueva que cree.

Ahora implementaremos soporte para [autenticación basada en token](https://scotch.io/tutorials/the-ins-and-outs-of-token-based-authentication#toc-how-token-based-works) para el backend.

Los principios de la autenticación basada en tokens se describen en el siguiente diagrama de secuencia:

![](../../images/4/16e.png)

- El usuario comienza iniciando sesión usando un formulario de inicio de sesión implementado con React
  - Agregaremos el formulario de inicio de sesión a la interfaz en [parte 5](/es/part5)
- Esto hace que el código React envíe el nombre de usuario y la contraseña a la dirección del servidor <i>/api/login</i> como una solicitud HTTP POST.
- Si el nombre de usuario y la contraseña son correctos, el servidor genera un <i>token</i> que identifica de alguna manera al usuario que inició sesión.
  - El token está firmado digitalmente, por lo que es imposible falsificarlo (con medios criptográficos)
- El backend responde con un código de estado que indica que la operación fue exitosa y devuelve el token con la respuesta.
- El navegador guarda el token, por ejemplo, en el estado de una aplicación React.
- Cuando el usuario crea una nueva nota (o realiza alguna otra operación que requiera identificación), el código React envía el token al servidor con la solicitud.
- El servidor usa el token para identificar al usuario

Primero implementemos la funcionalidad para iniciar sesión. Instale la librería [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken), que nos permite generar [tokens web JSON](https://jwt.io/).

```bash
npm install jsonwebtoken
```

El código para la funcionalidad de inicio de sesión va a los controladores de controllers/login.js.

```js
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({ username: body.username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(body.password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
```

El código comienza buscando al usuario en la base de datos por el <i>nombre de usuario</i> adjunto a la solicitud.
A continuación, verifica la <i>contraseña</i>, también adjunta a la solicitud.
Debido a que las contraseñas en sí no se guardan en la base de datos, sino <i>hash</i> calculadas a partir de las contraseñas, el método _bcrypt.compare_ se usa para verificar si la contraseña es correcta:

```js
await bcrypt.compare(body.password, user.passwordHash)
```

Si no se encuentra el usuario o la contraseña es incorrecta, se responde a la solicitud con el código de estado [401 unauthorized](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.2). El motivo del error se explica en el cuerpo de respuesta.

Si la contraseña es correcta, se crea un token con el método _jwt.sign_. El token contiene el nombre de usuario y la identificación de usuario en un formulario firmado digitalmente.

```js
const userForToken = {
  username: user.username,
  id: user._id,
}

const token = jwt.sign(userForToken, process.env.SECRET)
```

El token ha sido firmado digitalmente usando una cadena de variable de entorno <i>SECRET</i> como <i>secreto</i>.
La firma digital garantiza que solo las partes que conocen el secreto puedan generar un token válido.
El valor de la variable de entorno debe establecerse en el archivo <i>.env</i>.

Una solicitud exitosa se responde con el código de estado <i>200 OK</i>. El token generado y el nombre de usuario del usuario se devuelven al cuerpo de la respuesta.

Ahora, el código de inicio de sesión solo debe agregarse a la aplicación agregando el nuevo enrutador a <i>app.js</i>.

```js
const loginRouter = require('./controllers/login')

//...

app.use('/api/login', loginRouter)
```

Vamos a intentar logearnos usando el cliente REST de VS Code:

![](../../images/4/17e.png)

No funciona. Se imprime lo siguiente en la consola:

```bash
(node:32911) UnhandledPromiseRejectionWarning: Error: secretOrPrivateKey must have a value
    at Object.module.exports [as sign] (/Users/mluukkai/opetus/_2019fullstack-koodit/osa3/notes-backend/node_modules/jsonwebtoken/sign.js:101:20)
    at loginRouter.post (/Users/mluukkai/opetus/_2019fullstack-koodit/osa3/notes-backend/controllers/login.js:26:21)
(node:32911) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). (rejection id: 2)
```

El comando _jwt.sign(userForToken, process.env.SECRET) _ falla. Olvidamos establecer un valor para la variable de entorno <i>SECRET</i>. Puede ser cualquier string. Cuando establecemos el valor en el archivo <i>.env</i>, el inicio de sesión funciona.

Un inicio de sesión exitoso devuelve los detalles del usuario y el token:

![](../../images/4/18ea.png)

Un nombre de usuario o contraseña incorrectos devuelve un mensaje de error y el código de estado correcto:

![](../../images/4/19ea.png)

### Limitación de la creación de nuevas notas a los usuarios registrados

Cambiemos la creación de nuevas notas para que solo sea posible si la solicitud de publicación tiene un token válido adjunto.
Luego, la nota se guarda en la lista de notas del usuario identificado por el token.

Hay varias formas de enviar el token desde el navegador al servidor. Usaremos el encabezado [Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization). El encabezado también indica qué [esquema de autenticación](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#Authentication_schemes) se utiliza. Esto puede ser necesario si el servidor ofrece varias formas de autenticación.
La identificación del esquema le dice al servidor cómo se deben interpretar las credenciales adjuntas.

El esquema <i>Bearer</i> se adapta a nuestras necesidades.

En la práctica, esto significa que si el token es, por ejemplo, la cadena <i>eyJhbGciOiJIUzI1NiIsInR5c2VybmFtZSI6Im1sdXVra2FpIiwiaW</i>, el encabezado de autorización tendrá el valor:

<pre>
Bearer eyJhbGciOiJIUzI1NiIsInR5c2VybmFtZSI6Im1sdXVra2FpIiwiaW
</pre>

Creación de nuevas notas cambiará de este modo:

```js
const jwt = require('jsonwebtoken') //highlight-line

// ...
  //highlight-start
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}
  //highlight-end

notesRouter.post('/', async (request, response) => {
  const body = request.body
//highlight-start
  const token = getTokenFrom(request)

  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)
//highlight-end

  const note = new Note({
    content: body.content,
    important: body.important === undefined ? false : body.important,
    date: new Date(),
    user: user._id
  })

  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()

  response.json(savedNote)
})
```

La función auxiliar _getTokenFrom_ aísla el token del encabezado de <i>authorization</i>. La validez del token se comprueba con _jwt.verify_. El método también decodifica el token, o devuelve el objeto en el que se basó el token:

```js
const decodedToken = jwt.verify(token, process.env.SECRET)
```

El objeto decodificado del token contiene los campos <i>username</i> y <i>id</i>, que le dice al servidor quién hizo la solicitud.

Si no hay ningún token, o el objeto decodificado del token no contiene la identidad del usuario (_decodedToken.id_ no está definido), el código de estado de error [401 unauthorized](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.2) es devuelto y el motivo del error se explica en el cuerpo de la respuesta.

```js
if (!token || !decodedToken.id) {
  return response.status(401).json({
    error: 'token missing or invalid'
  })
}
```

Cuando se resuelve la identidad del autor de la solicitud, la ejecución continúa como antes.

Ahora se puede crear una nueva nota usando Postman si el encabezado <i>authorization</i> tiene el valor correcto, la cadena <i>bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ</i>, donde el segundo valor es el token devuelto por la operación <i>iniciar sesión</i>.

Usando Postman, esto se ve de la siguiente manera:

![](../../images/4/20e.png)

y con el cliente REST de Visual Studio Code

![](../../images/4/21e.png)

### Manejo de errores

La verificación del token también puede causar un <i>JsonWebTokenError</i>. Si, por ejemplo, eliminamos algunos caracteres del token e intentamos crear una nueva nota, esto sucede:

```bash
JsonWebTokenError: invalid signature
    at /Users/mluukkai/opetus/_2019fullstack-koodit/osa3/notes-backend/node_modules/jsonwebtoken/verify.js:126:19
    at getSecret (/Users/mluukkai/opetus/_2019fullstack-koodit/osa3/notes-backend/node_modules/jsonwebtoken/verify.js:80:14)
    at Object.module.exports [as verify] (/Users/mluukkai/opetus/_2019fullstack-koodit/osa3/notes-backend/node_modules/jsonwebtoken/verify.js:84:10)
    at notesRouter.post (/Users/mluukkai/opetus/_2019fullstack-koodit/osa3/notes-backend/controllers/notes.js:40:30)
```

Hay muchas razones posibles para un error de decodificación. El token puede ser defectuoso (como en nuestro ejemplo), falsificado o vencido. Extendamos nuestro middleware errorHandler para tener en cuenta los diferentes errores de decodificación.

```js
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({
      error: 'malformatted id'
    })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({
      error: error.message 
    })
  } else if (error.name === 'JsonWebTokenError') {  // highlight-line
    return response.status(401).json({ // highlight-line
      error: 'invalid token' // highlight-line
    }) // highlight-line
  }

  logger.error(error.message)

  next(error)
}
```

El código de la aplicación actual se puede encontrar en [Github](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-9), rama <i>part4-9</i>.

Si la aplicación tiene múltiples interfaces que requieren identificación, la validación de JWT debe separarse en su propio middleware. También se podría utilizar alguna librería existente como [express-jwt](https://www.npmjs.com/package/express-jwt).

### Notas finales

Ha habido muchos cambios en el código que han causado un problema típico para un proyecto de software de ritmo rápido: la mayoría de las pruebas no funcionan. Debido a que esta parte del curso ya está repleta de nueva información, dejaremos la fijación de las pruebas a un ejercicio no obligatorio.

Los nombres de usuario, las contraseñas y las aplicaciones que utilizan la autenticación de token siempre deben usarse en [HTTPS](https://en.wikipedia.org/wiki/HTTPS). Podríamos usar un servidor Node [HTTPS](https://nodejs.org/api/https.html) en nuestra aplicación en lugar del [HTTP](https://nodejs.org/docs/latest-v8.x/ api / http.html) servidor (requiere más configuración). Por otro lado, la versión de producción de nuestra aplicación está en Heroku, por lo que nuestra aplicación permanece segura: Heroku enruta todo el tráfico entre un navegador y el servidor Heroku a través de HTTPS.

Implementaremos el inicio de sesión en la interfaz en la [siguiente parte](/es/part5).

</div>

<div class="tasks">

### Ejercicios 4.15.-4.22.

En los próximos ejercicios, se implementarán los conceptos básicos de la gestión de usuarios para la aplicación Bloglist. La forma más segura es seguir la historia desde el capítulo de la parte 4 [Administración de usuarios](/es/part4/user_administration) hasta el capítulo [Autenticación basada en token](/es/part4/token_authentication). Por supuesto, también puede utilizar su creatividad.

**Una advertencia más:** Si nota que está mezclando llamadas async/await y _then_, es 99% seguro que está haciendo algo mal. Utilice uno u otro, nunca ambos.

#### 4.15: expansión de la lista de blogs, paso 3

Implemente una forma de crear nuevos usuarios realizando una solicitud POST HTTP para la dirección <i>api/users</i>. Los usuarios tienen <i>nombre de usuario, contraseña y nombre</i>.

No guarde las contraseñas en la base de datos como texto sin cifrar, utilice la biblioteca <i>bcrypt</i> como hicimos en el capítulo de la parte 4 [Creación de nuevos usuarios](/es​​/part4/user_administration#creation-users).

**NB** Algunos usuarios de Windows han tenido problemas con <i>bcrypt</i>. Si tiene problemas, elimine la librería con el comando

```bash
npm uninstall bcrypt 
```

e instale [bcryptjs](https://www.npmjs.com/package/bcryptjs) en su lugar.

Implemente una forma de ver los detalles de todos los usuarios realizando una solicitud HTTP adecuada.

La lista de usuarios puede, por ejemplo, tener el siguiente aspecto:

![](../../images/4/22.png)

#### 4.16*: expansión de la lista de blogs, paso 4

Agrega una función que agrega las siguientes restricciones para la creación de nuevos usuarios: Deben proporcionarse tanto el nombre de usuario como la contraseña. Tanto el nombre de usuario como la contraseña deben tener al menos 3 caracteres. El nombre de usuario debe ser único.

La operación debe responder con un código de estado adecuado y algún tipo de mensaje de error si se crea un usuario no válido.

**NB** No pruebe las restricciones de contraseña con las validaciones de Mongoose. No es una buena idea porque la contraseña recibida por el backend y el hash de contraseña guardado en la base de datos no son lo mismo. La longitud de la contraseña debe validarse en el controlador como hicimos en la [parte 3](/es/part3/validation_and_es_lint) antes de usar la validación de Mongoose.

Además, implemente pruebas que verifiquen que no se creen usuarios no válidos y que la operación de agregar usuario no válida devuelva un código de estado adecuado y un mensaje de error.

#### 4.17: expansión de la lista de blogs, paso 5

Expande los blogs para que cada blog contenga información sobre el creador del blog.

Modifique la adición de nuevos blogs para que cuando se cree un nuevo blog, <i>cualquier</i> usuario de la base de datos sea designado como su creador (por ejemplo, el que se encontró primero). Implemente esto de acuerdo con el capítulo de la parte 4 [poblar](/es/part4/user_administration#populate).
El usuario designado como creador no importa todavía. La funcionalidad se termina en el ejercicio 4.19.

Modificar la lista de todos los blogs para que la información de usuario del creador se muestre con el blog:

![](../../images/4/23e.png)

y la lista de todos los usuarios también muestra los blogs creados por cada usuario:

![](../../images/4/24e.png)

#### 4.18: expansión de la lista de blogs, paso 6

Implementar la autenticación basada en token según la parte 4 capítulo [Autenticación de token](/es/part4/token_authentication).

#### 4.19: expansión de la lista de blogs , paso 7

Modificar la adición de nuevos blogs para que solo sea posible si se envía un token válido con la solicitud HTTP POST. El usuario identificado por el token se designa como el creador del blog.

#### 4.20*: expansión de la lista de blogs, paso 8

[Este ejemplo](/es/part4/token_authentication) de la parte 4 muestra cómo tomar el token del encabezado con la función auxiliar _getTokenFrom_.

Si usó la misma solución, refactorice llevando el token a un [middleware](/es/part3/node_js_and_express#middleware). El middleware debe tomar el token del encabezado <i>Authorization</i> y colocarlo en el campo <i>token</i> del objeto <i>request</i>.

En otras palabras, si registra este middleware en el archivo <i>app.js</i> antes de todas las rutas

```js
app.use(middleware.tokenExtractor)
```

routes can access the token with _request.token_:
```js
blogsRouter.post('/', async (request, response) => {
  // ..
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  // ..
})
```

Recuerde que un [middleware] normal (/es/part3/node_js_and_express#middleware) es una función con tres parámetros, que al final llama al último parámetro <i>next</i> para mover el control al siguiente middleware:

```js
const tokenExtractor = (request, response, next) => {
  // code that extracts the token

  next()
}
```

#### 4.21*: expansión de la lista de blogs, paso 9

Cambie la operación de eliminación del blog para que El blog solo puede ser eliminado por el usuario que agregó el blog. Por lo tanto, eliminar un blog solo es posible si el token enviado con la solicitud es el mismo que el del creador del blog.

Si se intenta eliminar un blog sin un token o por un usuario incorrecto, la operación debe devolver un código de estado adecuado.

Tenga en cuenta que si obtiene un blog de la base de datos,

```js
const blog = await Blog.findById(...)
```

el campo <i>blog.user</i> no contiene una cadena, sino una Objeto. Entonces, si desea comparar la identificación del objeto obtenido de la base de datos y una identificación de cadena, la operación de comparación normal no funciona. La identificación obtenida de la base de datos debe analizarse primero en una cadena.

```js
if ( blog.user.toString() === userid.toString() ) ...
```

#### 4.22*: expansión de la lista de blogs, paso 10

Después de agregar la autenticación basada en token, las pruebas para agregar un nuevo blog se rompió. Arregle las pruebas. También escriba una nueva prueba para asegurarse de que la adición de un blog falla con el código de estado adecuado <i>401 Unauthorized</i> si no se proporciona un token.

[Esto](https://github.com/visionmedia/supertest/issues/398) probablemente sea útil al hacer la corrección.

Este es el último ejercicio de esta parte del curso y es hora de enviar su código a GitHub y marcar todos sus ejercicios terminados en el [sistema de envío de ejercicios](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

<!---
note left of user
  user fills in login form with
  username and password
end note
user -> browser: login button pressed

browser -> backend: HTTP POST /api/login { username, password }
note left of backend
  backend generates TOKEN that identifies user 
end note
backend -> browser: TOKEN returned as message body 
note left of browser
  browser saves TOKEN
end note
note left of user
  user creates a note
end note
user -> browser: create note button pressed
browser -> backend: HTTP POST /api/notes { content } TOKEN in header
note left of backend
  backend identifies userfrom the TOKEN
end note

backend -> browser: 201 created

user -> user:
-->

</div>
