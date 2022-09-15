---
mainImage: ../../../images/part-13.svg
part: 13
letter: b
lang: es
---

<div class="content">

### Estructura de la aplicación

Hasta ahora, hemos escrito todo el código en el mismo archivo. Ahora vamos a estructurar un poco mejor la aplicación. Vamos a crear la siguiente estructura de directorios y archivos:

```
index.js
util
  config.js
  db.js
models
  index.js
  note.js
controllers
  notes.js
```

El contenido de los archivos es el siguiente. El archivo <i>util/config.js</i> se encarga de manejar las variables de entorno:

```js
require('dotenv').config()

module.exports = {
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT || 3001,
}
```

La función del archivo <i>index.js</i> es configurar e iniciar la aplicación:

```js
const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const notesRouter = require('./controllers/notes')

app.use(express.json())

app.use('/api/notes', notesRouter)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()
```

Iniciar la aplicación es ligeramente diferente de lo que hemos visto antes, porque queremos asegurarnos de que la conexión a la base de datos se establezca correctamente antes del inicio real.

El archivo <i>util/db.js</i> contiene el código para inicializar la base de datos:

```js
const Sequelize = require('sequelize')
const { DATABASE_URL } = require('./config')

const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log('connected to the database')
  } catch (err) {
    console.log('failed to connect to the database')
    return process.exit(1)
  }

  return null
}

module.exports = { connectToDatabase, sequelize }
```

Las notas del modelo correspondiente a la tabla se guardan en el archivo <i>models/note.js</i>

```js
const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Note extends Model {}

Note.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  important: {
    type: DataTypes.BOOLEAN
  },
  date: {
    type: DataTypes.DATE
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'note'
})

module.exports = Note
```

El archivo <i>models/index.js</i> es casi inútil en este momento, ya que solo hay un modelo en la aplicación. Cuando comencemos a agregar otros modelos a la aplicación, el archivo será más útil porque eliminará la necesidad de importar archivos que definan modelos individuales en el resto de la aplicación.

```js
const Note = require('./note')

Note.sync()

module.exports = {
  Note
}
```

El manejo de rutas asociado con las notas se puede encontrar en el archivo <i>controllers/notes.js</i>:

```js
const router = require('express').Router()

const { Note } = require('../models')

router.get('/', async (req, res) => {
  const notes = await Note.findAll()
  res.json(notes)
})

router.post('/', async (req, res) => {
  try {
    const note = await Note.create(req.body)
    res.json(note)
  } catch(error) {
    return res.status(400).json({ error })
  }
})

router.get('/:id', async (req, res) => {
  const note = await Note.findByPk(req.params.id)
  if (note) {
    res.json(note)
  } else {
    res.status(404).end()
  }
})

router.delete('/:id', async (req, res) => {
  const note = await Note.findByPk(req.params.id)
  if (note) {
    await note.destroy()
  }
  res.status(204).end()
})

router.put('/:id', async (req, res) => {
  const note = await Note.findByPk(req.params.id)
  if (note) {
    note.important = req.body.important
    await note.save()
    res.json(note)
  } else {
    res.status(404).end()
  }
})

module.exports = router
```

La estructura de la aplicación es buena ahora. Sin embargo, notamos que los manejadores de ruta que manejan una sola nota contienen un poco de código repetitivo, ya que todos comienzan con la línea que busca la nota a manejar:

```js
const note = await Note.findByPk(req.params.id)
```

Vamos a refactorizar esto en nuestro propio <i>middleware</i> e implementarlo en los controladores de ruta:

```js
const noteFinder = async (req, res, next) => {
  req.note = await Note.findByPk(req.params.id)
  next()
}

router.get('/:id', noteFinder, async (req, res) => {
  if (req.note) {
    res.json(req.note)
  } else {
    res.status(404).end()
  }
})

router.delete('/:id', noteFinder, async (req, res) => {
  if (req.note) {
    await req.note.destroy()
  }
  res.status(204).end()
})

router.put('/:id', noteFinder, async (req, res) => {
  if (req.note) {
    req.note.important = req.body.important
    await req.note.save()
    res.json(req.note)
  } else {
    res.status(404).end()
  }
})
```

Los controladores de ruta ahora reciben <i>tres</i> parámetros, el primero es una cadena que define la ruta y el segundo es el <i>noteFinder</i> de middleware que definimos anteriormente, que recupera la nota de la base de datos y la coloca en la propiedad <i>note</i> del objeto <i>req</i>. ¡Se elimina una pequeña cantidad de copypaste y estamos satisfechos!

El código actual de la aplicación se encuentra en su totalidad en [GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-2), rama <i>part13-2</i>.

</div>

<div class="tasks">

### Ejercicios 13.5.-13.7.

#### Ejercicio 13.5.

Cambie la estructura de su aplicación para que coincida con el ejemplo anterior, o alguna otra convención similar.

#### Ejercicio 13.6.

Además, implemente soporte para cambiar el número de likes de un blog en la aplicación, es decir, la operación

_PUT /api/blogs/:id_ (modifica el conteno de likes de un blog)

El número actualizado de li se transmitirá con la solicitud:

```js
{
  likes: 3
}
```

#### Ejercicio 13.7.

Centralice el manejo de errores de la aplicación en el middleware como en la [parte 3](/es/part3/guardando_datos_en_mongo_db#mover-el-manejo-de-errores-al-middleware). También puede habilitar el middleware[express-async-errors](https://github.com/davidbanham/express-async-errors) como hicimos en la [parte 4](es/part4/porbando_el_backend#eliminando-el-try-catch).

Los datos devueltos en el contexto de un mensaje de error no son muy importantes.

En este punto, las situaciones que requieren el manejo de errores por parte de la aplicación son la creación de un nuevo blog y el cambio de la cantidad de likes en un blog. Asegúrese de que el controlador de errores maneje ambos de manera adecuada.

</div>

<div class="content">

### Administración de usuario

A continuación, agreguemos una tabla de base de datos <i>users</i> a la aplicación, donde se almacenarán los usuarios de la aplicación. Además, agregaremos la capacidad de crear usuarios e inicio de sesión basado en tokens como lo implementamos en [parte 4](/en/part4/autenticacion_de_token). Para simplificar, ajustaremos la implementación para que todos los usuarios tengan la misma contraseña <i>secret</i>.

El modelo que define a los usuarios en el archivo <i>models/user.js</i> es sencillo

```js
const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class User extends Model {}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'user'
})

module.exports = User
```

El campo <i>username</i> está configurado como único. El nombre de usuario podría haberse utilizado básicamente como la clave principal de la tabla. Sin embargo, decidimos crear la clave principal como un campo separado con un valor entero <i>id</i>.

El archivo <i>models/index.js</i> se expande ligeramente:

```js
const Note = require('./note')
const User = require('./user') // highlight-line

Note.sync()
User.sync() // highlight-line

module.exports = {
  Note, User // highlight-line
}
```

Los controladores de ruta que se encargan de crear un nuevo usuario en el archivo <i>controllers/users.js</i> y mostrar a todos los usuarios no contienen nada dramático:

```js
const router = require('express').Router()

const { User } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll()
  res.json(users)
})

router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch(error) {
    return res.status(400).json({ error })
  }
})

router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

module.exports = router
```

El controlador del enrutador que maneja el inicio de sesión (archivo <i>controllers/login.js</i>) es el siguiente:

```js
const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const User = require('../models/user')

router.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({
    where: {
      username: body.username
    }
  })

  const passwordCorrect = body.password === 'secret'

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET)

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = router
```

La solicitud POST irá acompañada de un nombre de usuario y una contraseña. Primero, el objeto correspondiente al nombre de usuario se recupera de la base de datos utilizando el modelo <i>User</i> con el método [findOne](https://sequelize.org/master/manual/model-querying-finders.html#-code-findone--code-):

```js
const user = await User.findOne({
  where: {
    username: body.username
  }
})
```

Desde la consola, podemos ver que la instrucción SQL corresponde a la llamada al método

```sql
SELECT "id", "username", "name"
FROM "users" AS "User"
WHERE "User". "username" = 'mluukkai';
```

Si se encuentra el usuario y la contraseña es correcta (es decir, _secret_ para todos los usuarios), en la respuesta se devuelve un <i>jsonwebtoken</i> que contiene la información del usuario. Para ello instalamos la dependencia

```js
npm instalar jsonwebtoken
```

El archivo <i>index.js</i> se expande ligeramente

```js
const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

app.use(express.json())

app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
```

El código actual de la aplicación se encuentra en su totalidad en [GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-3), rama <i>part13-3</i>.

### Conexión entre las tablas

Ahora se pueden agregar usuarios a la aplicación y los usuarios pueden iniciar sesión, pero esto en sí mismo no es una característica muy útil todavía. Nos gustaría agregar las características de que solo un usuario registrado puede agregar notas y que cada nota está asociada con el usuario que la creó. Para hacer esto, necesitamos agregar una <i>clave externa</i> a la tabla <i>notes</i>.

Al usar Sequelize, se puede definir una clave externa modificando el archivo <i>models/index.js</i> de la siguiente manera

```js
const Note = require('./note')
const User = require('./user')

// highlight-start
User.hasMany(Note)
Note.belongsTo(User)

Note.sync({ alter: true })
User.sync({ alter: true })
// highlight-end

module.exports = {
  Note, User
}
```

Así es como [define](https://sequelize.org/master/manual/assocs.html#one-to-many-relationships) que existe una conexión de relación _one-to-many_ entre <i>users</i> y <i>notes</i>. También cambiamos las opciones de las llamadas <i>sync</i> para que las tablas en la base de datos coincidan con los cambios realizados en las definiciones del modelo. El esquema de la base de datos tiene el siguiente aspecto desde la consola:

```js
postgres=# \d users
                                     Table "public.users"
  Column | Type | Collation | Nullable | Default
----------+------------------------+-----------+----------+-----------------------------------
 id | integer | not null | nextval('users_id_seq'::regclass)
 username | character varying(255) | | not null |
 name | character varying(255) | | not null |
Indexes:
    "users_pkey" PRIMARY KEY, btree (id)
Referenced by:
    TABLE "notes" CONSTRAINT "notes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL

postgres=# \d notes
                                      Table "public.notes"
  Column | Type | Collation | Nullable | Default
-----------+--------------------------+-----------+----------+-----------------------------------
 id | integer | not null | nextval('notes_id_seq'::regclass)
 content | text | | not null |
 important | boolean | | | |
 date | timestamp with time zone | | | |
 user_id | integer | | | |
Indexes:
    "notes_pkey" PRIMARY KEY, btree (id)
Foreign-key constraints:
    "notes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL
```

La clave externa <i>user_id</i> se ha creado en la tabla <i>notes</i>, que hace referencia a las filas de la tabla <i>users</i>.

Ahora hagamos que cada inserción de una nueva nota se asocie a un usuario. Antes de hacer la implementación adecuada (donde asociamos la nota con el token del usuario que inició sesión), codifiquemos la nota para adjuntarla al primer usuario que se encuentre en la base de datos:

```js

router.post('/', async (req, res) => {
  try {
    // highlight-start
    const user = await User.findOne()
    const note = await Note.create({...req.body, userId: user.id})
    // highlight-end
    res.json(note)
  } catch(error) {
    return res.status(400).json({ error })
  }
})
```

Preste atención a cómo ahora hay una columna <i>user\_id</i> en las notas a nivel de la base de datos. La convención de nomenclatura de Sequelize hace referencia al objeto correspondiente en cada fila de la base de datos en lugar de mayúsculas y minúsculas (<i>userId</i>) como se escribe en el código fuente.

Hacer una consulta de unión es muy fácil. Cambiemos la ruta que devuelve a todos los usuarios para que también se muestren las notas de cada usuario:

```js
router.get('/', async (req, res) => {
  // highlight-start
  const users = await User.findAll({
    include: {
      model: Note
    }
  })
  // highlight-end
  res.json(users)
})
```

Por lo tanto, la consulta de combinación se realiza mediante la opción [include](https://sequelize.org/master/manual/assocs.html#eager-loading-example) como parámetro de consulta.

La instrucción SQL generada a partir de la consulta se ve en la consola:

```
SELECT "User". "id", "User". "username", "User". "name", "Notes". "id" AS "Notes.id", "Notes". "content" AS "Notes.content", "Notes". "important" AS "Notes.important", "Notes". "date" AS "Notes.date", "Notes". "user_id" AS "Notes.UserId"
FROM "users" AS "User" LEFT OUTER JOIN "notes" AS "Notes" ON "User". "id" = "Notes". "user_id";
```

El resultado final también es el que cabría esperar.

![](../../images/13/1.png)

### Inserción correcta de notas.

Cambiemos la inserción de la nota haciendo que funcione igual que en la [parte 4](/es/part4), es decir, la creación de una nota solo puede tener éxito si la solicitud correspondiente a la creación va acompañada de un token válido de inicio de sesión. Luego, la nota se almacena en la lista de notas creada por el usuario identificado por el token:

```js
// highlight-start
const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch{
      res.status(401).json({ error: 'token invalid' })
    }
  }  else {
    res.status(401).json({ error: 'token missing' })
  }
  next()
}
// highlight-end

router.post('/', tokenExtractor, async (req, res) => {
  try {
    // highlight-start
    const user = await User.findByPk(req.decodedToken.id)
    const note = await Note.create({...req.body, userId: user.id, date: new Date()})
    // highlight-end
    res.json(note)
  } catch(error) {
    return res.status(400).json({ error })
  }
})
```

El token se recupera de los encabezados de solicitud, se decodifica y se coloca en el objeto <i>req</i> mediante el middleware <i>tokenExtractor</i>. Al crear una nota, también se proporciona un campo de <i>fecha</i> que indica la hora en que se creó.

### Afinando

Nuestro backend actualmente funciona casi de la misma manera que la versión de la Parte 4 de la misma aplicación, excepto por el manejo de errores. Antes de hacer algunas extensiones al backend, cambiemos ligeramente las rutas para recuperar todas las notas y todos los usuarios.

Agregaremos a cada nota información sobre el usuario que la agregó:

```js
router.get('/', async (req, res) => {
  const notes = await Note.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    }
  })
  res.json(notes)
})
```

También hemos [restringido](https://sequelize.org/master/manual/model-querying-basics.html#specifying-attributes-for-select-queries) los valores de los campos que queremos. Para cada nota, devolvemos todos los campos, incluido el <i>name</i> del usuario asociado con la nota, pero excluyendo el <i>userId</i>.

Hagamos un cambio similar a la ruta que recupera a todos los usuarios, eliminando el campo innecesario <i>userId</i> de las notas asociadas con el usuario:

```js
router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Note,
      attributes: { exclude: ['userId'] } // highlight-line
    }
  })
  res.json(users)
})
```

El código actual de la aplicación se encuentra en su totalidad en [GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-4), rama <i>part13-4</i>.

### Atención a la definición de los modelos

Los más perspicaces habrán notado que a pesar de la columna agregada <i>user_id</i>, no hicimos ningún cambio en el modelo que define las notas, pero aún podemos agregar un usuario a los objetos de nota:

```js
const user = await User.findByPk(req.decodedToken.id)
const note = await Note.create({ ...req.body, userId: user.id, date: new Date() })
```

La razón de esto es que especificamos en el archivo <i>models/index.js</i> que existe una conexión de uno a muchos entre los usuarios y las notas:

```js
const Note = require('./note')
const User = require('./user')

User.hasMany(Note)
Note.belongsTo(User)

// ...
```

SSequelize creará automáticamente un atributo llamado <i>userId</i> en el modelo <i>Note</i> al cual, cuando se hace referencia, da acceso a la columna de la base de datos <i>user_id</i>.

Tenga en cuenta que también podríamos crear una nota de la siguiente manera usando el método [build](https://sequelize.org/master/class/lib/model.js~Model.html#static-method-build):

```js
const user = await User.findByPk(req.decodedToken.id)

// create a note without saving it yet
const note = Note.build({ ...req.body, date: new Date() })
 // put the user id in the userId property of the created note
note.userId = user.id
// store the note object in the database
await note.save()
```

Así es como vemos explícitamente que <i>userId</i> es un atributo del objeto notas.

Podríamos definir el modelo de la siguiente manera para obtener el mismo resultado:

```js
Note.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  important: {
    type: DataTypes.BOOLEAN
  },
  date: {
    type: DataTypes.DATE
  },
  // highlight-start
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  }
  // highlight-end
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'note'
})

module.exports = Note
```

Definir a nivel de clase del modelo como se indicó anteriormente suele ser innecesario

```js
User.hasMany(Note)
Note.belongsTo(User)
```

En cambio, podemos lograr lo mismo con esto. Es necesario usar uno de los dos métodos; de lo contrario, Sequelize no sabe cómo conectar las tablas entre sí a nivel de código.

</div>

<div class="tasks">

### Ejercicios 13.8.-13.12.

#### Ejercicio 13.8.

Agregue soporte para usuarios a la aplicación. Además de la identificación, los usuarios tienen los siguientes campos:

- name (cadena de texto, no debe estar vacía)
- username (cadena de texto, no debe estar vacía)

A diferencia del material, ahora no impida que Sequelize cree [marcas de tiempo](https://sequelize.org/master/manual/model-basics.html#timestamps) <i>created\_at</i> y <i>updated\_at</i> para los usuarios

Todos los usuarios pueden tener la misma contraseña que el material. También pueden optar por implementar correctamente las contraseñas como en [parte 4](/es/part4/administracion_de_usuarios).

Implemente las siguientes rutas

- _POST api/users_ (agregar un nuevo usuario)
- _GET api/users_ (lista de todos los usuarios)
- _PUT api/users/:username_ (cambiando un nombre de usuario, tenga en cuenta que el parámetro no es id sino username)

Asegúrese de que las marcas de tiempo <i>created\_at</i> y <i>updated\_at</i> establecidas automáticamente por Sequelize funcionen correctamente al crear un nuevo usuario y cambiar un nombre de usuario.

#### Ejercicio 13.9.

Sequelize proporciona un conjunto de [validaciones](https://sequelize.org/master/manual/validations-and-constraints.html) para los campos del modelo, que realiza antes de almacenar los objetos en la base de datos.

Se decide cambiar la política de creación de usuarios para que solo una dirección de correo electrónico válida se pueda utilizar como nombre de usuario. Implemente una validación que verifique este problema durante la creación de un usuario.

Modifique el middleware de manejo de errores para proporcionar un mensaje de error más descriptivo de la situación (por ejemplo, usando el mensaje de error Sequelize):

```js
{
    "error": [
        "Validation isEmail on username failed"
    ]
}
```

#### Ejercicio 13.10.

Expanda la aplicación para que el usuario conectado actual identificado por un token esté vinculado a cada blog agregado. Para hacer esto, también deberá implementar un endpoint de inicio de sesión _POST /api/login_, que devuelve el token.

#### Ejercicio 13.11.

Haga que la eliminación de un blog solo sea posible para el usuario que agregó el blog.

#### Ejercicio 13.12.

Modifique las rutas para recuperar todos los blogs y todos los usuarios para:

1- Que cada blog muestre el usuario que lo agregó.
2- Cada usuario muestre los blogs que agregó.

</div>

<div class="content">

### Más consultas

Hasta ahora, nuestra aplicación ha sido muy simple en términos de consultas, las consultas han buscado una sola fila en función de la clave principal utilizando el método [findByPk](https://sequelize.org/master/class/lib/model.js~Model.html#static-method-findByPk) o han buscado todas las filas en la tabla usando el método [findAll](https://sequelize.org/master/class/lib/model.js~Model.html#static-method-findAll). Estos son suficientes para el frontend de la aplicación creada en la Sección 5, pero vamos a expandir el backend para que también podamos practicar haciendo consultas un poco más complejas.

Primero implementemos la posibilidad de recuperar solo notas importantes o no importantes. Implementemos esto usando el [parámetro de consulta](http://expressjs.com/en/5x/api.html#req.query) important:

```js
router.get('/', async (req, res) => {
  const notes = await Note.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: user,
      attributes: ['name']
    },
    // highlight-start
    where: {
      important: req.query.important === "true"
    }
    // highlight-end
  })
  res.json(notes)
})
```

Ahora el backend puede recuperar notas importantes con una solicitud a http://localhost:3001/api/notes?important=true y notas no importantes con una solicitud a http://localhost:3001/api/notes?important=false

La consulta SQL generada por Sequelize contiene una cláusula WHERE que filtra las filas que normalmente se devolverían:

```sql
SELECT "note". "id", "note". "content", "note". "important", "note". "date", "user". "id" AS "user.id", "user". "name" AS "user.name"
FROM "notes" AS "note" LEFT OUTER JOIN "users" AS "user" ON "note". "user_id" = "user". "id"
WHERE "note". "important" = true;
```

Desafortunadamente, esta implementación no funcionará si la solicitud no está interesada en si, la nota es importante o no, es decir, si la solicitud se realiza en http://localhost:3001/api/notes. La corrección se puede hacer de varias maneras. Una, pero quizás no la mejor manera de hacer la corrección, sería la siguiente:

```js
const { Op } = require('sequelize')

router.get('/', async (req, res) => {
  // highlight-start
  let important = {
    [Op.in]: [true, false]
  }

  if ( req.query.important ) {
    important = req.query.important === "true"
  }
  // highlight-end

  const notes = await Note.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: user,
      attributes: ['name']
    },
    where: {
      important // highlight-line
    }
  })
  res.json(notes)
})
```

El objeto <i>important</i> ahora almacena la condición de consulta. La consulta predeterminada es:

```js
where: {
  important: {
    [Op.in]: [true, false]
  }
}
```

es decir, la columna <i>important</i> puede ser <i>true</i> o <i>false</i>, usando uno de los muchos operadores Sequelize [Op.in](https://sequelize.org/master/manual/model-querying-basics.html#operators). Si se especifica el parámetro de consulta <i>req.query.important</i>, la consulta cambia a una de las dos formas

```js
where: {
  important: true
}
```

or

```js
where: {
  important: false
}
```

dependiendo del valor del parámetro de consulta.

La funcionalidad se puede ampliar aún más al permitir que el usuario especifique una palabra clave requerida al recuperar notas, p. Una solicitud a http://localhost:3001/api/notes?search=database devolverá todas las notas que mencionen <i>database</i> o una solicitud a http://localhost:3001/api/notes?search=javascript&important=true devolverá todas las notas marcadas como importantes y mencionando <i>javascript</i>. La implementación es la siguiente:

```js
router.get('/', async (req, res) => {
  let important = {
    [Op.in]: [true, false]
  }

  if ( req.query.important ) {
    important = req.query.important === "true"
  }

  const notes = await Note.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: user,
      attributes: ['name']
    },
    where: {
      important,
      // highlight-start
      content: {
        [Op.substring]: req.query.search ? req.query.search : ''
      }
      // highlight-end
    }
  })

  res.json(notes)
})
```

[Op.substring](https://sequelize.org/master/manual/model-querying-basics.html#operators) de Sequelize genera la consulta que queremos usando la palabra clave LIKE en SQL. Por ejemplo, si hacemos una consulta a http://localhost:3001/api/notes?search=database&important=true veremos que la consulta SQL que genera es exactamente como esperábamos.

```sql
SELECT "note". "id", "note". "content", "note". "important", "note". "date", "user". "id" AS "user.id", "user". "name" AS "user.name"
FROM "notes" AS "note" LEFT OUTER JOIN "users" AS "user" ON "note". "user_id" = "user". "id"
WHERE "note". "important" = true AND "note". "content" LIKE '%database%';
```

Todavía hay una hermosa falla en nuestra aplicación que vemos si hacemos una solicitud a http://localhost:3001/api/notes, es decir, queremos todas las notas, nuestra implementación causará un WHERE innecesario en la consulta, lo que puede (dependiendo de la implementación del motor de la base de datos) afectar innecesariamente la eficiencia de la consulta:

```sql
SELECT "note". "id", "note". "content", "note". "important", "note". "date", "user". "id" AS "user.id", "user". "name" AS "user.name"
FROM "notes" AS "note" LEFT OUTER JOIN "users" AS "user" ON "note". "user_id" = "user". "id"
WHERE "note". "important" IN (true, false) AND "note". "content" LIKE '%%';
```

Optimicemos el código para que las condiciones WHERE se usen solo si es necesario:

```js
router.get('/', async (req, res) => {
  const where = {}

  if (req.query.important) {
    where.important = req.query.important === "true"
  }

  if (req.query.search) {
    where.content = {
      [Op.substring]: req.query.search
    }
  }

  const notes = await Note.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: user,
      attributes: ['name']
    },
    where
  })

  res.json(notes)
})
```

Si la solicitud tiene condiciones de búsqueda, p. http://localhost:3001/api/notes?search=database&important=true, se forma una consulta que contiene WHERE :

```sql
SELECT "note". "id", "note". "content", "note". "important", "note". "date", "user". "id" AS "user.id", "user". "name" AS "user.name"
FROM "notes" AS "note" LEFT OUTER JOIN "users" AS "user" ON "note". "user_id" = "user". "id"
WHERE "note". "important" = true AND "note". "content" LIKE '%database%';
```

Si la solicitud no tiene condiciones de búsqueda http://localhost:3001/api/notes, entonces la consulta no tiene un WHERE innecesario

```sql
SELECT "note". "id", "note". "content", "note". "important", "note". "date", "user". "id" AS "user.id", "user". "name" AS "user.name"
FROM "notes" AS "note" LEFT OUTER JOIN "users" AS "user" ON "note". "user_id" = "user". "id";
```

El código actual de la aplicación se encuentra en su totalidad en [GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-5), rama <i>part13-5</i>.

</div>

<div class="tasks">

### Ejercicios 13.13.-13.16

#### Ejercicio 13.13.

Implementar filtrado por palabra clave en la aplicación para la ruta de retorno de todos los blogs. El filtrado debería funcionar de la siguiente manera
- _GET /api/blogs?search=react_ devuelve todos los blogs con la palabra de búsqueda <i>react</i> en el campo <i>title</i>, la palabra de búsqueda no distingue entre mayúsculas y minúsculas
- _GET /api/blogs_ devuelve todos los blogs


[Esto](https://sequelize.org/master/manual/model-querying-basics.html#operators) debería ser útil para esta tarea y la siguiente.
#### Ejercicio 13.14.

Expanda el filtro para buscar una palabra clave en los campos <i>title</i> o <i>author</i>, es decir,

_GET /api/blogs?search=jami_ devuelve blogs con la palabra de búsqueda <i>jami</i> en el campo <i>title</i> o en el campo <i>author</i>
#### Ejercicio 13.15.

Modifique la ruta de los blogs para que devuelva los blogs en función de los likes en orden descendente. Busque la [documentación](https://sequelize.org/master/manual/model-querying-basics.html) para obtener instrucciones sobre cómo realizar pedidos,

#### Ejercicio 13.16.

Haz una ruta para la aplicación _/api/authors_ que devuelva el número de blogs de cada autor y el número total de likes. Implemente la operación directamente a nivel de la base de datos. Lo más probable es que necesite la función [group by](https://sequelize.org/master/manual/model-querying-basics.html#grouping) y la función de agregación [sequelize.fn](https://sequelize.org/master/manual/model-querying-basics.html#specifying-attributes-for-select-queries).

El JSON devuelto por la ruta podría tener el siguiente aspecto:

```
[
  {
    author: "Jami Kousa",
    articles: "3",
    likes: "10"
  },
  {
    author: "Kalle Ilves",
    articles: "1",
    likes: "2"
  },
  {
    author: "Dan Abramov",
    articles: "1",
    likes: "4"
  }
]
```

Tarea de bonificación: ordene los datos devueltos según la cantidad de likes, haga el pedido en la consulta de la base de datos.

</div>
