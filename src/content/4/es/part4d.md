---
mainImage: ../../../images/part-4.svg
part: 4
letter: d
lang: es
---

<div class="content">

Los usuarios deben poder iniciar sesión en nuestra aplicación, y cuando un usuario inicia sesión, su información de usuario debe adjuntarse automáticamente a cualquier nota nueva que cree.

Ahora implementaremos soporte para [autenticación basada en token](https://www.digitalocean.com/community/tutorials/the-ins-and-outs-of-token-based-authentication#how-token-based-works) para el backend.

Los principios de la autenticación basada en tokens se describen en el siguiente diagrama de secuencia:

![diagrama de secuencia de autenticación basada en tokens](../../images/4/16new.png)

- El usuario comienza iniciando sesión usando un formulario de inicio de sesión implementado con React
  - Agregaremos el formulario de inicio de sesión a la interfaz en la [parte 5](/es/part5)
- Esto hace que el código React envíe el nombre de usuario y la contraseña a la dirección del servidor <i>/api/login</i> como una solicitud HTTP POST.
- Si el nombre de usuario y la contraseña son correctos, el servidor genera un <i>token</i> que identifica de alguna manera al usuario que inició sesión.
  - El token está firmado digitalmente, por lo que es imposible falsificarlo (con medios criptográficos)
- El backend responde con un código de estado que indica que la operación fue exitosa y devuelve el token con la respuesta.
- El navegador guarda el token, por ejemplo, en el estado de una aplicación React.
- Cuando el usuario crea una nueva nota (o realiza alguna otra operación que requiera identificación), el código React envía el token al servidor con la solicitud.
- El servidor usa el token para identificar al usuario

Primero implementemos la funcionalidad para iniciar sesión. Instala la librería [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken), que nos permite generar [tokens web JSON](https://jwt.io/).

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
  const { username, password } = request.body

  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

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

El código comienza buscando al usuario en la base de datos por el <i>username</i> adjunto a la solicitud.

```js
const user = await User.findOne({ username })
```

A continuación, verifica la <i>password</i>, también adjunta a la solicitud.

```js
const passwordCorrect = user === null
  ? false
  : await bcrypt.compare(password, user.passwordHash)
```

Debido a que las contraseñas en sí no se guardan en la base de datos, sino que se guardan <i>hashes</i> calculados a partir de las contraseñas, el método _bcrypt.compare_ se usa para verificar si la contraseña es correcta:

```js
await bcrypt.compare(password, user.passwordHash)
```

Si no se encuentra el usuario o la contraseña es incorrecta, se responde a la solicitud con el código de estado [401 unauthorized](https://www.rfc-editor.org/rfc/rfc9110.html#name-401-unauthorized). El motivo del error se explica en el cuerpo de la respuesta.

```js
if (!(user && passwordCorrect)) {
  return response.status(401).json({
    error: 'invalid username or password'
  })
}
```

Si la contraseña es correcta, se crea un token con el método _jwt.sign_. El token contiene el nombre de usuario y la ID de usuario en un formato firmado digitalmente.

```js
const userForToken = {
  username: user.username,
  id: user._id,
}

const token = jwt.sign(userForToken, process.env.SECRET)
```

El token ha sido firmado digitalmente usando una cadena de variable de entorno <i>SECRET</i> como el <i>secreto</i>.
La firma digital garantiza que solo las partes que conocen el secreto puedan generar un token válido.
El valor de la variable de entorno debe establecerse en el archivo <i>.env</i>.

Una solicitud exitosa se responde con el código de estado <i>200 OK</i>. El token generado y el username del usuario se devuelven al cuerpo de la respuesta.

```js
response
  .status(200)
  .send({ token, username: user.username, name: user.name })
```

Ahora, el código de inicio de sesión solo debe agregarse a la aplicación agregando el nuevo enrutador a <i>app.js</i>.

```js
const loginRouter = require('./controllers/login')

//...

app.use('/api/login', loginRouter)
```

Vamos a intentar logearnos usando el cliente REST de VS Code:

![vscode rest post a api/login con username/password](../../images/4/17e.png)

No funciona. Se imprime lo siguiente en la consola:

```bash
(node:32911) UnhandledPromiseRejectionWarning: Error: secretOrPrivateKey must have a value
    at Object.module.exports [as sign] (/Users/mluukkai/opetus/_2019fullstack-koodit/osa3/notes-backend/node_modules/jsonwebtoken/sign.js:101:20)
    at loginRouter.post (/Users/mluukkai/opetus/_2019fullstack-koodit/osa3/notes-backend/controllers/login.js:26:21)
(node:32911) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). (rejection id: 2)
```

El comando _jwt.sign(userForToken, process.env.SECRET) _ falla. Olvidamos establecer un valor para la variable de entorno <i>SECRET</i>. Puede ser cualquier string. Cuando establecemos el valor en el archivo <i>.env</i>, el inicio de sesión funciona.

Un inicio de sesión exitoso devuelve los detalles del usuario y el token:

![vs code rest, respuesta mostrando detalles y token](../../images/4/18ea.png)

Un nombre de usuario o contraseña incorrectos devuelve un mensaje de error y el código de estado correcto:

![vs code rest, respuesta para credenciales de login incorrectos](../../images/4/19ea.png)

### Limitación de la creación de nuevas notas a los usuarios registrados

Cambiemos la creación de nuevas notas para que solo sea posible si la solicitud de publicación tiene un token válido adjunto. Luego, la nota se guarda en la lista de notas del usuario identificado por el token.

Hay varias formas de enviar el token desde el navegador al servidor. Usaremos el encabezado [Authorization](https://developer.mozilla.org/es/docs/Web/HTTP/Headers/Authorization). El encabezado también indica qué [esquema de autenticación](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#Authentication_schemes) se utiliza. Esto puede ser necesario si el servidor ofrece varias formas de autenticación.
La identificación del esquema le dice al servidor cómo se deben interpretar las credenciales adjuntas.

El esquema <i>Bearer</i> se adapta a nuestras necesidades.

En la práctica, esto significa que si el token es, por ejemplo, la cadena <i>eyJhbGciOiJIUzI1NiIsInR5c2VybmFtZSI6Im1sdXVra2FpIiwiaW</i>, el encabezado de autorización tendrá el valor:

<pre>
Bearer eyJhbGciOiJIUzI1NiIsInR5c2VybmFtZSI6Im1sdXVra2FpIiwiaW
</pre>

Creación de nuevas notas cambiará de este modo (<i>controllers/notes.js</i>):

```js
const jwt = require('jsonwebtoken') //highlight-line

// ...
  //highlight-start
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}
  //highlight-end

notesRouter.post('/', async (request, response) => {
  const body = request.body
//highlight-start
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)
//highlight-end

  const note = new Note({
    content: body.content,
    important: body.important === undefined ? false : body.important,
    user: user._id
  })

  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()

  response.json(savedNote)
})
```

La función auxiliar _getTokenFrom_ aísla el token del encabezado <i>authorization</i>. La validez del token se comprueba con _jwt.verify_. El método también decodifica el token, o devuelve el objeto en el que se basó el token:

```js
const decodedToken = jwt.verify(token, process.env.SECRET)
```

Si el token es invalido o está ausente, la excepción <i>JsonWebTokenError</i> es generada. Tenemos que extender nuestro middleware de manejo de errors para tener en cuenta este caso particular:

```js
const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name ===  'JsonWebTokenError') { // highlight-line
    return response.status(401).json({ error: error.message }) // highlight-line
  }

  next(error)
}
```

El objeto decodificado del token contiene los campos <i>username</i> y <i>id</i>, que le dice al servidor quién hizo la solicitud.

Si el objeto decodificado del token no contiene la identidad del usuario (_decodedToken.id_ es undefined), el código de estado de error [401 unauthorized](https://www.rfc-editor.org/rfc/rfc9110.html#name-401-unauthorized) es devuelto y el motivo del error se explica en el cuerpo de la respuesta.

```js
if (!decodedToken.id) {
  return response.status(401).json({
    error: 'token invalid'
  })
}
```

Cuando se resuelve la identidad del autor de la solicitud, la ejecución continúa como antes.

Ahora se puede crear una nueva nota usando Postman si el encabezado <i>authorization</i> tiene el valor correcto, la cadena <i>Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ</i>, donde el segundo valor es el token devuelto por la operación <i>login</i>.

Usando Postman, esto se ve de la siguiente manera:

![postman agregando bearer token](../../images/4/20e.png)

y con el cliente REST de Visual Studio Code

![vscode rest agregando bearer token](../../images/4/21e.png)
  
El código de la aplicación actual se puede encontrar en [Github](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-9), rama <i>part4-9</i>.
  
Si la aplicación tiene múltiples interfaces que requieren identificación, la validación de JWT debe separarse en su propio middleware. También se podría utilizar alguna librería existente como [express-jwt](https://www.npmjs.com/package/express-jwt).

### Problemas de la autenticación basada en Tokens

La autenticación basada en tokens es muy fácil de implementar, pero tiene un problema. Una vez que el cliente de la API, por ejemplo una aplicación React, obtiene un token, la API tiene una confianza ciega en el titular del token. ¿Qué sucede si necesitamos revocar los derechos de acceso del titular del token?

Hay dos soluciones al problema. La más fácil es limitar el período de validez de un token:

```js
loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  // el token expira in 60*60 segundos, eso es, en una hora
  // highlight-start
  const token = jwt.sign(
    userForToken, 
    process.env.SECRET,
    { expiresIn: 60*60 }
  )
  // highlight-end

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})
```

Una vez que el token caduca, la aplicación cliente necesita obtener un nuevo token. Por lo general, esto sucede al obligar al usuario a volver a iniciar sesión en la aplicación.

El middleware de manejo de errores debe extenderse para dar un error adecuado en el caso de un token caducado:

```js
const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token'
    })
  // highlight-start  
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }
  // highlight-end

  next(error)
}
```

Cuanto más corto sea el tiempo de caducidad, más segura será la solución. Por lo tanto, si el token cae en las manos equivocadas o es necesario revocar el acceso del usuario al sistema, el token solo se puede utilizar durante un período de tiempo limitado. Por otro lado, un tiempo de caducidad corto genera un dolor potencial para el usuario, ya que implica iniciar sesión en el sistema con más frecuencia.

La otra solución es guardar información sobre cada token en la base de datos y verificar en cada solicitud de API si el derecho de acceso correspondiente al token sigue siendo válido. Con este esquema, los derechos de acceso pueden ser revocados en cualquier momento. Este tipo de solución a menudo se denomina <i>server-side session</i>.

El aspecto negativo de las sesiones del lado del servidor es la mayor complejidad en el backend y también el efecto en el rendimiento, ya que se debe verificar la validez del token para cada solicitud de API a la base de datos. El acceso a la base de datos es considerablemente más lento en comparación con la verificación de la validez del token en sí. Es por eso que es bastante común guardar la sesión correspondiente a un token en una <i>base de datos de llave-valor</i> como [Redis](https://redis.io/) que tiene una funcionalidad limitada en comparación con MongoDB o bases de datos relacionales, pero es extremadamente rápida en algunos escenarios de uso.

Cuando se utilizan sesiones del lado del servidor, el token suele ser solo una cadena aleatoria, que no incluye ninguna información sobre el usuario, como suele ser el caso cuando se utilizan jwt-tokens. Para cada solicitud de API, el servidor obtiene la información relevante sobre la identidad del usuario de la base de datos. También es bastante habitual que, en lugar de utilizar el encabezado de autorización, se utilicen <i>cookies</i> como mecanismo para transferir el token entre el cliente y el servidor.

### Notas finales

Ha habido muchos cambios en el código que han causado un problema típico para un proyecto de software de rápido desarrollo: la mayoría de las pruebas se han roto. Debido a que esta parte del curso ya está repleta de nueva información, dejaremos el arreglo de las pruebas cómo un ejercicio no obligatorio.

Los nombres de usuario, las contraseñas y las aplicaciones que utilizan la autenticación basada en token siempre deben usarse en [HTTPS](https://es.wikipedia.org/wiki/Protocolo_seguro_de_transferencia_de_hipertexto). Podríamos usar un servidor Node [HTTPS](https://nodejs.org/docs/latest-v18.x/api/https.html) en nuestra aplicación en lugar del servidor [HTTP](https://nodejs.org/docs/latest-v18.x/api/http.html) (requiere más configuración). Por otro lado, la versión de producción de nuestra aplicación está en Fly.io, por lo que nuestra aplicación permanece segura: Fly.io enruta todo el tráfico entre un navegador y el servidor Fly.io a través de HTTPS.

Implementaremos el inicio de sesión en la interfaz en la [siguiente parte](/es/part5).

**NOTA:** En esta etapa, en la aplicación de notas desplegada, se espera que la función de crear una nota deje de funcionar ya que la funcionalidad de inicio de sesión del backend aún no está vinculada al frontend.

</div>

<div class="tasks">

### Ejercicios 4.15.-4.23.

En los próximos ejercicios, se implementarán los conceptos básicos de la gestión de usuarios para la aplicación de lista de blogs. La forma más segura es seguir el material del curso desde el capítulo de la parte 4 [Administración de usuarios](/es/part4/administracion_de_usuarios) hasta el capítulo [Autenticación basada en token](/es/part4/autenticacion_basada_en_token). Por supuesto, también puedes utilizar tu creatividad.

**Una advertencia más:** Si notas que estás mezclando llamadas async/await y _then_, es 99% seguro que estás haciendo algo mal. Utiliza uno u otro, nunca ambos.

#### 4.15: Expansión de la Lista de Blogs, paso 3

Implementa una forma de crear nuevos usuarios realizando una solicitud POST HTTP a la dirección <i>api/users</i>. Los usuarios tienen <i>username, password y name</i>.

No guardes las contraseñas en la base de datos como texto sin cifrar, utiliza la librería <i>bcrypt</i> como hicimos en el capítulo de la parte 4 [Creando usuarios](/es/part4/administracion_de_usuarios#creando-usuarios).

**NB** Algunos usuarios de Windows han tenido problemas con <i>bcrypt</i>. Si tienes problemas, elimina la librería con el comando

```bash
npm uninstall bcrypt 
```

e instala [bcryptjs](https://www.npmjs.com/package/bcryptjs) en su lugar.

Implementa una forma de ver los detalles de todos los usuarios realizando una solicitud HTTP adecuada.

La lista de usuarios puede, por ejemplo, tener el siguiente aspecto:

![navegador en api/users mostrando datos en formato JSON de dos usuarios](../../images/4/22.png)

#### 4.16*: Expansión de la Lista de Blogs, paso 4

Agrega una funcionalidad que agregue las siguientes restricciones para la creación de nuevos usuarios: Deben proporcionarse tanto el username como password y ambos deben tener al menos 3 caracteres. El username debe ser único.

La operación debe responder con un código de estado adecuado y algún tipo de mensaje de error si se crea un usuario no válido.

**NB** No pruebes las restricciones de password con las validaciones de Mongoose. No es una buena idea porque la password recibida por el backend y el hash de password guardado en la base de datos no son lo mismo. La longitud de la contraseña debe validarse en el controlador como hicimos en la [parte 3](/es/part3/validacion_y_es_lint) antes de usar la validación de Mongoose.

Además, implementa pruebas que verifiquen que no se creen usuarios no válidos y que una operación de agregar usuario que sea no válida devuelva un código de estado adecuado y un mensaje de error.

#### 4.17: Expansión de la Lista de Blogs, paso 5

Expande los blogs para que cada blog contenga información sobre el creador del blog.

Modifica la adición de nuevos blogs para que cuando se cree un nuevo blog, <i>cualquier</i> usuario de la base de datos sea designado como su creador (por ejemplo, el que se encontró primero). Implementa esto de acuerdo con el capítulo de la parte 4 [populate](/es/part4/administracion_de_usuarios#populate).
El usuario designado como creador no importa todavía. La funcionalidad se termina en el ejercicio 4.19.

Modifica la lista de todos los blogs para que la información de usuario del creador se muestre con el blog:

![api/blogs con información de usuario en formato JSON](../../images/4/23e.png)

y la lista de todos los usuarios también muestra los blogs creados por cada usuario:

![api/users con información de blogs en formato JSON](../../images/4/24e.png)

#### 4.18: Expansión de la Lista de Blogs, paso 6

Implementar la autenticación basada en token según la parte 4 [Autenticación basada en token](/es/part4/autenticacion_basada_en_token).

#### 4.19: Expansión de la Lista de Blogs, paso 7

Modifica la adición de nuevos blogs para que solo sea posible si se envía un token válido con la solicitud HTTP POST. El usuario identificado por el token se designa como el creador del blog.

#### 4.20*: Expansión de la Lista de Blogs, paso 8

[Este ejemplo](/es/part4/autenticacion_basada_en_token#limitacion-de-la-creacion-de-nuevas-notas-a-los-usuarios-registrados) de la parte 4 muestra cómo tomar el token del encabezado con la función auxiliar _getTokenFrom_.

Si usaste la misma solución, refactoriza para llevar el token a un [middleware](/es/part3/node_js_y_express#middleware). El middleware debe tomar el token del encabezado <i>Authorization</i> y debe colocarlo en el campo <i>token</i> del objeto <i>request</i>.

En otras palabras, si registras este middleware en el archivo <i>app.js</i> antes de todas las rutas

```js
app.use(middleware.tokenExtractor)
```

Las rutas pueden acceder al token con _request.token_:

```js
blogsRouter.post('/', async (request, response) => {
  // ..
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  // ..
})
```

Recuerda que una [función middleware](/es/part3/node_js_y_express#middleware) es una función con tres parámetros, que al final llama al último parámetro <i>next</i> para mover el control al siguiente middleware:

```js
const tokenExtractor = (request, response, next) => {
  // código que extrae el token

  next()
}
```

#### 4.21*: Expansión de la Lista de Blogs, paso 9

Cambia la operación de eliminar blogs para que el blog solo pueda ser eliminado por el usuario que lo agregó. Por lo tanto, eliminar un blog solo es posible si el token enviado con la solicitud es el mismo que el del creador del blog.

Si se intenta eliminar un blog sin un token o por un usuario incorrecto, la operación debe devolver un código de estado adecuado.

Ten en cuenta que si obtienes un blog de la base de datos,

```js
const blog = await Blog.findById(...)
```

el campo <i>blog.user</i> no contiene una cadena, sino un objeto. Entonces, si deseas comparar el ID del objeto obtenido de la base de datos y un ID de cadena, la operación de comparación normal no funciona. El ID obtenido de la base de datos debe primero convertirse en una cadena.

```js
if ( blog.user.toString() === userid.toString() ) ...
```

#### 4.22*: Expansión de la Lista de Blogs, paso 10

Tanto la creación de un nuevo blog como su eliminación necesitan averiguar la identidad del usuario que está realizando la operación. El middleware _tokenExtractor_ que hicimos en el ejercicio 4.20 ayuda, pero los controladores de las operaciones <i>post</i> y <i>delete</i> necesitan averiguar quién es el usuario que posee un token específico.

Ahora cree un nuevo middleware _userExtractor_, que encuentre al usuario y lo guarde en el objeto de solicitud. Cuando registras el middleware en <i>app.js</i>

```js
app.use(middleware.userExtractor)
```

el usuario se guardara en el campo _request.user_:

```js
blogsRouter.post('/', async (request, response) => {
  // obtén usuario desde el objeto de solicitud
  const user = request.user
  // ..
})

blogsRouter.delete('/:id', async (request, response) => {
  // obtén usuario desde el objeto de solicitud
  const user = request.user
  // ..
})
```

Ten en cuenta que es posible registrar un middleware solo para un conjunto específico de rutas. Entonces, en lugar de usar _userExtractor_ con todas las rutas,

```js
const middleware = require('../utils/middleware');
// ...

// usa el middleware en todas las rutas
app.use(middleware.userExtractor) // highlight-line

app.use('/api/blogs', blogsRouter)  
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
```

podríamos registrarlo para que solo se ejecute con las rutas de <i>/api/blogs</i>:

```js
const middleware = require('../utils/middleware');
// ...

// usa el middleware solo en las rutas de api/blogs
app.use('/api/blogs', middleware.userExtractor, blogsRouter) // highlight-line
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
```

Como puede verse, esto sucede al encadenarse múltiples middlewares como parámetro de la función <i>use</i>. También sería posible registrar un middleware solo para una operación específica:

```js
const middleware = require('../utils/middleware');
// ...

router.post('/', middleware.userExtractor, async (request, response) => {
  // ...
}
```

#### 4.23*: Expansión de la Lista de Blogs, paso 11

Después de agregar la autenticación basada en token, las pruebas para agregar un nuevo blog se rompieron. Arréglalas. También escribe una nueva prueba para asegurarte de que la adición de un blog falla con el código de estado adecuado <i>401 Unauthorized</i> si no se proporciona un token.

[Esto](https://github.com/visionmedia/supertest/issues/398) probablemente sea útil al hacer la corrección.

Este es el último ejercicio de esta parte del curso y es hora de enviar tu código a GitHub y marcar todos sus ejercicios terminados en el [sistema de envío de ejercicios](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

</div>
