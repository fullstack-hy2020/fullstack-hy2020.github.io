---
mainImage: ../../../images/part-13.svg
part: 13
letter: c
lang: es
---

<div class="content">

### Migraciones

Sigamos ampliando el backend. Queremos implementar soporte para permitir que los usuarios con <i>estado de administrador</i> pongan a los usuarios de su elección en modo deshabilitado, evitando que inicien sesión y creen nuevas notas. Para implementar esto, necesitamos agregar campos booleanos a la tabla de la base de datos de los usuarios que indiquen si el usuario es un administrador y si el usuario está deshabilitado.

Podríamos proceder como antes, es decir, cambiar el modelo que define la tabla y confiar en Sequelize para sincronizar los cambios en la base de datos. Esto se especifica mediante estas líneas en el archivo <i>models/index.js</i>

```js
const Note = require('./note')
const User = require('./user')

Note.belongsTo(User)
User.hasMany(Note)

Note.sync({ alter: true }) // highlight-line
User.sync({ alter: true }) // highlight-line

module.exports = {
  Note, User
}
```

Sin embargo, este enfoque no tiene sentido a largo plazo. Eliminemos las líneas que realizan la sincronización y pasemos a usar una forma mucho más robusta, [migraciones](https://sequelize.org/master/manual/migrations.html) proporcionada por Sequelize (y muchas otras bibliotecas).

En la práctica, una migración es un único archivo JavaScript que describe alguna modificación en una base de datos. Se crea un archivo de migración independiente para cada uno o varios cambios a la vez. Sequelize mantiene un registro de las migraciones que se han realizado, es decir, qué cambios provocados por las migraciones se sincronizan con el esquema de la base de datos. Al crear nuevas migraciones, Sequelize se mantiene actualizado sobre los cambios que aún deben realizarse en el esquema de la base de datos. De esta forma, los cambios se realizan de forma controlada, con el código del programa almacenado en el control de versiones.

Primero, creemos una migración que inicialice la base de datos. El código para la migración es el siguiente:

```js
const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('notes', {
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
    })
    await queryInterface.createTable('users', {
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
    })
    await queryInterface.addColumn('notes', 'user_id', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('notes')
    await queryInterface.dropTable('users')
  },
}
```

El archivo de migración [define](https://sequelize.org/master/manual/migrations.html#migration-skeleton) las funciones <i>up</i> y <i>down</i>, la primera de que define cómo se debe modificar la base de datos cuando se realiza la migración. La función <i>down</i> le indica cómo deshacer la migración si es necesario.

Nuestra migración contiene tres operaciones, la primera crea una tabla de <i>notes</i>, la segunda crea una tabla de <i>users</i> y la tercera agrega una clave externa a las <i>notes</i> que hace referencia al creador de la nota. Los cambios en el esquema se definen llamando a los métodos de objeto [queryInterface](https://sequelize.org/master/manual/query-interface.html).

Al definir las migraciones, es esencial recordar que, a diferencia de los modelos, los nombres de columnas y tablas se escriben en forma de serpiente (snake case):

```js
await queryInterface.addColumn('notes', 'user_id', { // highlight-line
  type: DataTypes.INTEGER,
  allowNull: false,
  references: { model: 'users', key: 'id' },
})
```

Por lo tanto, en las migraciones, los nombres de las tablas y las columnas se escriben exactamente como aparecen en la base de datos, mientras que los modelos usan la convención de nomenclatura camelCase predeterminada de Sequelize.

Guarde el código de migración en el archivo <i>migrations/20211209\_00\_initialize\_notes\_and\_users.js</i>. Los nombres de los archivos de migración siempre deben nombrarse alfabéticamente cuando se crean para que los cambios anteriores estén siempre antes de los cambios más nuevos. Una buena forma de lograr este orden es comenzar el nombre del archivo de migración con la fecha y un número de secuencia.

Podríamos ejecutar las migraciones desde la línea de comandos usando la [herramienta de línea de comandos Sequelize](https://github.com/sequelize/cli). Sin embargo, elegimos realizar las migraciones manualmente desde el código del programa utilizando la biblioteca [Umzug](https://github.com/sequelize/umzug). Instalamos la biblioteca:

```js
npm install umzug
```

Cambiemos el archivo <i>util/db.js</i> que maneja la conexión a la base de datos de la siguiente manera:

```js
const Sequelize = require('sequelize')
const { DATABASE_URL } = require('./config')
const { Umzug, SequelizeStorage } = require('umzug') // highlight-line

const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});

// highlight-start
const runMigrations = async () => {
  const migrator = new Umzug({
    migrations: {
      glob: 'migrations/*.js',
    },
    storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
    context: sequelize.getQueryInterface(),
    logger: console,
  })
  
  const migrations = await migrator.up()

  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  })
}
// highlight-end

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    // highlight-start
    await runMigrations()
    // highlight-end
    console.log('connected to the database')
  } catch (err) {
    console.log('failed to connect to the database')
    console.log(err)
    return process.exit(1)
  }

  return null
}

module.exports = { connectToDatabase, sequelize }
```

La función <i>runMigrations</i> que realiza migraciones ahora se ejecuta cada vez que la aplicación abre una conexión de base de datos cuando se inicia. Sequelize realiza un seguimiento de las migraciones que ya se han completado, por lo que si no hay nuevas migraciones, ejecutar la función <i>runMigrations</i> no hace nada.

Ahora comencemos con una pizarra limpia y eliminemos todas las tablas de base de datos existentes de la aplicación:

```sql
username => drop table notes;
username => drop table users;
username => \d
Did not find any relations.
```

Iniciemos la aplicación. Se imprime un mensaje sobre el estado de las migraciones en el registro.

```bash
INSERT INTO "migrations" ("name") VALUES ($1) RETURNING "name";
Migrations up to date { files: [ '20211209_00_initialize_notes_and_users.js' ] }
database connected
```

Si reiniciamos la aplicación, el registro también muestra que la migración no se repitió.

El esquema de la base de datos de la aplicación ahora se ve así:

```sql
postgres=# \d
                 List of relations
 Schema |     Name     |   Type   |     Owner
--------+--------------+----------+----------------
 public | migrations   | table    | username
 public | notes        | table    | username
 public | notes_id_seq | sequence | username
 public | users        | table    | username
 public | users_id_seq | sequence | username
```

Entonces, Sequelize ha creado una tabla <i>migrations</i> que le permite realizar un seguimiento de las migraciones que se han realizado. El contenido de la tabla queda de la siguiente manera:

```js
postgres=# select * from migrations;
                   name
-------------------------------------------
 20211209_00_initialize_notes_and_users.js
```

Vamos a crear algunos usuarios en la base de datos, así como un conjunto de notas, y luego estamos listos para expandir la aplicación.

El código actual de la aplicación se encuentra en su totalidad en [GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-6), rama <i>part13-6</i>.
### Usuario administrador y usuario deshabilitado

Entonces queremos agregar dos campos booleanos a la tabla <i>users</i>
- _admin_ te dice si el usuario es un administrador
- _disabled_ te dice si el usuario está deshabilitado de las acciones

Vamos a crear la migración que modifica la base de datos en el archivo <i>migrations/20211209\_01\_admin\_and\_disabled\_to\_users.js</i>:

```js
const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('users', 'admin', {
      type: DataTypes.BOOLEAN,
      default: false
    })
    await queryInterface.addColumn('users', 'disabled', {
      type: DataTypes.BOOLEAN,
      default: false
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('users', 'admin')
    await queryInterface.removeColumn('users', 'disabled')
  },
}
```

Realice los cambios correspondientes en el modelo correspondiente a la tabla <i>users</i>:

```js
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
  // highlight-start
  admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  disabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  // highlight-end
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'user'
})
```

Cuando se realiza la nueva migración al reiniciar el código, el esquema se cambia a lo siguiente:

```sql
username-> \d users
                                     Table "public.users"
  Column  |          Type          | Collation | Nullable |              Default
----------+------------------------+-----------+----------+-----------------------------------
 id       | integer                |           | not null | nextval('users_id_seq'::regclass)
 username | character varying(255) |           | not null |
 name     | character varying(255) |           | not null |
 admin    | boolean                |           |          |
 disabled | boolean                |           |          |
Indexes:
    "users_pkey" PRIMARY KEY, btree (id)
    "users_username_key" UNIQUE CONSTRAINT, btree (username)
Referenced by:
    TABLE "notes" CONSTRAINT "notes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id)
```

Ahora vamos a expandir los controladores de la siguiente manera. Evitamos iniciar sesión si el campo de usuario <i>disabled</i> está establecido en <i>true</i>:

```js
loginRouter.post('/', async (request, response) => {
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

// highlight-start
  if (user.disabled) {
    return response.status(401).json({
      error: 'account disabled, please contact admin'
    })
  }
  // highlight-end

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})
```

Desactivemos al usuario <i>jakousa</i> usando su ID:

```sql
username => update users set disabled=true where id=3;
UPDATE 1
username => update users set admin=true where id=1;
UPDATE 1
username => select * from users;
 id | username |       name       | admin | disabled
----+----------+------------------+-------+----------
  2 | lynx     | Kalle Ilves      |       |
  3 | jakousa  | Jami Kousa       | f     | t
  1 | mluukkai | Matti Luukkainen | t     |
```

Y asegúrese de que ya no sea posible iniciar sesión

![](../../images/13/2.png)

Vamos a crear una ruta que permita a un administrador cambiar el estado de la cuenta de un usuario:

```js
const isAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id)
  if (!user.admin) {
    return res.status(401).json({ error: 'operation not allowed' })
  }
  next()
}

router.put('/:username', tokenExtractor, isAdmin, async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username
    }
  })

  if (user) {
    user.disabled = req.body.disabled
    await user.save()
    res.json(user)
  } else {
    res.status(404).end()
  }
})
```

Se utilizan dos middleware, el primero llamado <i>tokenExtractor</i> es el mismo que el utilizado por la ruta de creación de notas, es decir, coloca el token decodificado en el campo <i>decodedToken</i> del objeto request. El segundo middleware <i>isAdmin</i> comprueba si el usuario es un administrador y, en caso contrario, el estado de la solicitud se establece en 401 y se devuelve el mensaje de error correspondiente.

Observe cómo <i>dos middleware</i> están encadenados a la ruta, los cuales se ejecutan antes que el controlador de ruta real. Es posible encadenar un número arbitrario de middleware a una solicitud.

El middleware <i>tokenExtractor</i> ahora se ha movido a <i>util/middleware.js</i> ya que se usa desde varias ubicaciones.

```js
const jwt = require('jsonwebtoken')
const { SECRET } = require('./config.js')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch{
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

module.exports = { tokenExtractor }
```

Ahora, un administrador puede volver a habilitar al usuario <i>jakousa</i> realizando una solicitud PUT a _/api/users/jakousa_, donde la solicitud incluye los siguientes datos:

```js
{
    "disabled": false
}
```

Como se señaló en [el final de la Parte 4](/es/part4/autenticacion_de_token#limitacion-de-la-creacion-de-nuevas-notas-a-los-usuarios-registrados), la forma en que implementamos la desactivación de usuarios aquí es problemática. Si el usuario está deshabilitado o no, solo se verifica en _login_, si el usuario tiene un token en el momento en que se deshabilita, el usuario puede continuar usando el mismo token, ya que no se ha establecido una vida útil para el token y el estado deshabilitado. El usuario no se comprueba al crear notas.

Antes de continuar, hagamos un script npm para la aplicación, que nos permita deshacer la migración anterior. Después de todo, no todo sale bien la primera vez cuando se desarrollan migraciones.

Modifiquemos el archivo <i>util/db.js</i> de la siguiente manera:

```js
const Sequelize = require('sequelize')
const { DATABASE_URL } = require('./config')
const { Umzug, SequelizeStorage } = require('umzug')

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
    await runMigrations()
    console.log('connected to the database')
  } catch (err) {
    console.log('failed to connect to the database')
    return process.exit(1)
  }

  return null
}

// highlight-start
const migrationConf = {
  migrations: {
    glob: 'migrations/*.js',
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console,
}
  
const runMigrations = async () => {
  const migrator = new Umzug(migrationConf)
  const migrations = await migrator.up()
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  })
}

const rollbackMigration = async () => {
  await sequelize.authenticate()
  const migrator = new Umzug(migrationConf)
  await migrator.down()
}
// highlight-end

module.exports = { connectToDatabase, sequelize, rollbackMigration } // highlight-line
```

Vamos a crear un archivo <i>util/rollback.js</i>, que permitirá que el script npm ejecute la función de reversión de migración especificada:

```js
const { rollbackMigration } = require('./db')

rollbackMigration()
```

y el script en sí:

```json
{
  "scripts": {
    "dev": "nodemon index.js",
    "migration:down": "node util/rollback.js" // highlight-line
  },
}
```

Así que ahora podemos deshacer la migración anterior ejecutando _npm run migration:down_ desde la línea de comandos.

Actualmente, las migraciones se ejecutan automáticamente cuando se inicia el programa. En la fase de desarrollo del programa, en ocasiones puede ser más adecuado deshabilitar la ejecución automática de migraciones y realizarlas manualmente desde la línea de comandos.

El código actual de la aplicación se encuentra en su totalidad en [GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-7), rama <i>part13-7</i>.

</div>

<div class="tasks">

### Ejercicios 13.17-13.18.

#### Ejercicio 13.17.

Elimine todas las tablas de la base de datos de su aplicación.

Realice una migración que inicialice la base de datos. Agregue las <i>created\_at</i> y <i>updated\_at</i> [marcas de tiempo](https://sequelize.org/master/manual/model-basics.html#timestamps) para ambas tablas. Tenga en cuenta que tendrá que agregarlos usted mismo en la migración.

**NOTA:** asegúrese de eliminar los comandos <i>User.sync()</i> y <i>Blog.sync()</i>, que sincronizan los esquemas de los modelos de su código; de lo contrario, las migraciones fallarán.

**NOTA2:** si tiene que eliminar tablas desde la línea de comando (es decir, no elimina deshaciendo la migración), deberá eliminar el contenido de la tabla <i>migrations</i> si desea que su programa vuelva a realizar las migraciones.

#### Ejercicio 13.18.

Expanda su aplicación (por migración) para que los blogs tengan un atributo de año escrito, es decir, un campo <i>year</i> que es un número entero al menos igual a 1991 pero no mayor que el año actual. Asegúrese de que la aplicación brinde un mensaje de error apropiado si se intenta dar un valor incorrecto para un año escrito.

</div>

<div class="content">

### Relaciones de muchos a muchos

Continuaremos expandiendo la aplicación para que cada usuario pueda agregarse a uno o más <i>equipos</i>.

Dado que una cantidad arbitraria de usuarios puede unirse a un equipo y un usuario puede unirse a una cantidad arbitraria de equipos, estamos tratando con [muchos a muchos](https://sequelize.org/master/manual/assocs.html#many-to-many-relationships), que tradicionalmente se implementa en bases de datos relacionales mediante una <i>tabla de conexiones</i>.

Ahora vamos a crear el código necesario para la tabla <i>teams</i> y la tabla <i>memberships</i>. La migración es la siguiente:

```js
const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('teams', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
      },
    })
    await queryInterface.createTable('memberships', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
      team_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'teams', key: 'id' },
      },
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('teams')
    await queryInterface.dropTable('memberships')
  },
}
```

Los modelos contienen casi el mismo código que la migración. El modelo de equipo en <i>models/team.js</i>:

```js
const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Team extends Model {}

Team.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'team'
})

module.exports = Team
```

El modelo para la tabla de conexiones en <i>models/membership.js</i>:

```js
const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Membership extends Model {}

Membership.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  team_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'teams', key: 'id' },
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'membership'
})

module.exports = Membership
```

Así que le hemos dado a la tabla de conexiones un nombre que la describe bien, <i>membership</i>. No siempre hay un nombre relevante para una tabla de conexión, en cuyo caso el nombre de la tabla de conexión puede ser una combinación de los nombres de las tablas que se unen, p. <i>user\_teams</i> podría encajar en nuestra situación.

Realizamos una pequeña adición al archivo <i>models/index.js</i> para conectar equipos y usuarios a nivel de código mediante el método [belongsToMany](https://sequelize.org/master/manual/assocs.html#implementation-3).

```js
const Note = require('./note')
const User = require('./user')
// highlight-start
const Team = require('./team')
const Membership = require('./membership')
// highlight-end

Note.belongsTo(User)
User.hasMany(Note)

// highlight-start
User.belongsToMany(Team, { through: Membership })
Team.belongsToMany(User, { through: Membership })
// highlight-end

module.exports = {
  Note, User, Team, Membership // highlight-line
}

```

Tenga en cuenta la diferencia entre la migración de la tabla de conexión y el modelo al definir campos de clave externa. Durante la migración, los campos se definen en forma de mayúsculas y minúsculas:

```js
await queryInterface.createTable('memberships', {
  // ...
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  team_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'teams', key: 'id' },
  }
})
```

en el modelo, los mismos campos se definen en camel case:

```js
Membership.init({
  // ...
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  teamId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'teams', key: 'id' },
  },
  // ...
})
```

Ahora vamos a crear un par de equipos desde la consola, así como algunas membresías:

```js
insert into teams (name) values ('toska');
insert into teams (name) values ('mosa climbers');
insert into memberships (user_id, team_id) values (1, 1);
insert into memberships (user_id, team_id) values (1, 2);
insert into memberships (user_id, team_id) values (2, 1);
insert into memberships (user_id, team_id) values (3, 2);
```

Luego, se agrega información sobre los equipos de los usuarios a la ruta para recuperar a todos los usuarios.

```js
router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: [
      {
        model: Note,
        attributes: { exclude: ['userId'] }
      },
      // highlight-start
      {
        model: Team,
        attributes: ['name', 'id'],
      }
      // highlight-end
    ]
  })
  res.json(users)
})
```

Los más observadores notarán que la consulta impresa en la consola ahora combina tres tablas.

La solución es bastante buena, pero tiene un hermoso defecto. El resultado también viene con los atributos de la fila correspondiente de la tabla de conexiones, aunque no queremos esto:

![](../../images/13/3.png)


Si lee detenidamente la documentación, puede encontrar una [solución](https://sequelize.org/master/manual/advanced-many-to-many.html#specifying-attributes-from-the-through-table):

```js
router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: [
      {
        model: Note,
        attributes: { exclude: ['userId'] }
      },
      {
        model: Team,
        attributes: ['name', 'id'],
        // highlight-start
        through: {
          attributes: []
        }
      // highlight-end
      }
    ]
  })
  res.json(users)
})
```

El código actual de la aplicación se encuentra en su totalidad en [GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-8), rama <i>part13-8</i>.

### Nota sobre las propiedades de los objetos del modelo Sequelize

La especificación de nuestros modelos se muestra en las siguientes líneas:

```js
User.hasMany(Note)
Note.belongsTo(User)

User.belongsToMany(Team, { through: Membership })
Team.belongsToMany(User, { through: Membership })
```

Estos permiten a Sequelize realizar consultas que recuperan, por ejemplo, todas las notas de los usuarios o de todos los miembros de un equipo.

Gracias a las definiciones, también tenemos acceso directo a, por ejemplo, las notas del usuario en el código. En el siguiente código, buscaremos un usuario con id 1 e imprimiremos las notas asociadas con el usuario:

```js
const user = await User.findByPk(1, {
  include: {
    model: Note
  }
})

user.notes.forEach(note => {
  console.log(note.content)
})
```

Por lo tanto, la definición <i>User.hasMany(Note)</i> adjunta una propiedad <i>notes</i> al objeto <i>user</i>, que da acceso a las notas realizadas por el usuario. De manera similar, la definición <i>User.belongsToMany(Team, { through: Membership }))</i> adjunta una propiedad <i>teams</i> al objeto <i>user</i>, que también puede utilizarse en el código:

```js
const user = await User.findByPk(1, {
  include: {
    model: team
  }
})

user.teams.forEach(team => {
  console.log(team.name)
})
```

Supongamos que nos gustaría devolver un objeto JSON de la ruta del usuario único que contiene el nombre del usuario, el nombre de usuario y la cantidad de notas creadas. Podríamos intentar lo siguiente:

```js
router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    include: {
        model: Note
      }
    }
  )

  if (user) {
    user.note_count = user.notes.length // highlight-line
    delete user.notes // highlight-line
    res.json(user)

  } else {
    res.status(404).end()
  }
})
```

Entonces, intentamos agregar el campo <i>noteCount</i> en el objeto devuelto por Sequelize y eliminar el campo <i>notes</i> de él. Sin embargo, este enfoque no funciona, ya que los objetos devueltos por Sequelize no son objetos normales donde la adición de nuevos campos funciona como pretendemos.

Una mejor solución es crear un objeto completamente nuevo basado en los datos recuperados de la base de datos:

```js
router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    include: {
        model: Note
      }
    }
  )

  if (user) {
    res.json({
      username: user.username, // highlight-line
      name: user.name, // highlight-line
      note_count: user.notes.length // highlight-line
    })

  } else {
    res.status(404).end()
  }
})
```
### Revisando las relaciones de muchos a muchos

Hagamos otra relación de muchos a muchos en la aplicación. Cada nota está asociada al usuario que la creó mediante una clave foránea. Ahora se decide que la aplicación también admite que la nota se pueda asociar con otros usuarios y que un usuario se pueda asociar con un número arbitrario de notas creadas por otros usuarios. La idea es que estas notas sean las que el usuario ha <i>marcado</i> para sí mismo.

Hagamos una tabla de conexión <i>user_notes</i> para la situación. La migración es sencilla:

```js
const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('user_notes', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
      note_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'notes', key: 'id' },
      },
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('user_notes')
  },
}
```

Además, no hay nada especial en el modelo:

```js
const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class UserNotes extends Model {}

UserNotes.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  noteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'notes', key: 'id' },
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'user_notes'
})

module.exports = UserNotes
```

El archivo <i>models/index.js</i>, por otro lado, viene con un ligero cambio:

```js
const Note = require('./note')
const User = require('./user')
const Team = require('./team')
const Membership = require('./membership')
const UserNotes = require('./user_notes') // highlight-line

Note.belongsTo(User)
User.hasMany(Note)

User.belongsToMany(Team, { through: Membership })
Team.belongsToMany(User, { through: Membership })

// highlight-start
User.belongsToMany(Note, { through: UserNotes, as: 'marked_notes' })
Note.belongsToMany(User, { through: UserNotes, as: 'users_marked' })
// highlight-end

module.exports = {
  Note, User, Team, Membership, UserNotes
}
```

Una vez más se utiliza <i>belongsToMany</i>, que ahora vincula a los usuarios con las notas a través del modelo <i>UserNotes</i> correspondiente a la tabla de conexiones. Sin embargo, esta vez damos un <i>nombre de alias</i> para el atributo formado usando la palabra clave [as](https://sequelize.org/master/manual/advanced-many-to-many.html#aliases-and-custom-key-names), el nombre predeterminado (las <i>notes</i> de un usuario) se superpondría con su significado anterior, es decir, notas creadas por el usuario.

Extendemos la ruta para que un usuario individual devuelva los equipos del usuario, sus propias notas y otras notas marcadas por el usuario:

```js
router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: [''] } ,
    include:[{
        model: Note,
        attributes: { exclude: ['userId'] }
      },
      {
        model: Note,
        as: 'marked_notes',
        attributes: { exclude: ['userId']},
        through: {
          attributes: []
        }
      },
      {
        model: Team,
        attributes: ['name', 'id'],
        through: {
          attributes: []
        }
      },
    ]
  })

  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})
```

En el contexto del include, ahora debemos usar el nombre de alias <i>marked\_notes</i> que acabamos de definir con el atributo <i>as</i>.

Para probar la característica, vamos a crear algunos datos de prueba en la base de datos:

```sql
insert into user_notes (user_id, note_id) values (1, 4);
insert into user_notes (user_id, note_id) values (1, 5);
```

El resultado final es funcional:

![](../../images/13/5.png)

¿Y si quisiéramos incluir información sobre el autor de la nota en las notas marcadas por el usuario también? Esto se puede hacer agregando un <i>include</i> a las notas marcadas:

```js
router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: [''] } ,
    include:[{
        model: Note,
        attributes: { exclude: ['userId'] }
      },
      {
        model: Note,
        as: 'marked_notes',
        attributes: { exclude: ['userId']},
        through: {
          attributes: []
        },
        // highlight-start
        include: {
          model: User,
          attributes: ['name']
        }
        // highlight-end
      },
      {
        model: Team,
        attributes: ['name', 'id'],
        through: {
          attributes: []
        }
      },
    ]
  })

  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})
```

El resultado final es el deseado:

![](../../images/13/4.png)

El código actual de la aplicación se encuentra en su totalidad en [GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-9), rama <i>part13-9</i>.

</div>

<div class="tasks">

### Ejercicios 13.19.-13.23.

#### Ejercicio 13.19.

Ofrezca a los usuarios la capacidad de agregar blogs en el sistema a una <i>lista de lectura</i>. Cuando se agrega a la lista de lectura, el blog debe estar en el estado <i>no leído</i>. El blog se puede marcar más adelante como <i>leído</i>. Implemente la lista de lectura usando una tabla de conexión. Realice cambios en la base de datos mediante migraciones.

En esta tarea, la adición a una lista de lectura y la visualización de la lista se pueden comprobar usando la base de datos.

#### Ejercicio 13.20.

Ahora agregue funcionalidad a la aplicación para admitir la lista de lectura.

La adición de un blog a la lista de lectura se realiza mediante un HTTP POST a la ruta <i>/api/readinglists</i>, la solicitud se acompañará con el blog y la identificación del usuario:

```js
{
  "blogId": 10,
  "userId": 3
}
```

También modifique la ruta de usuario individual _GET /api/users/:id_ para devolver no solo otra información del usuario sino también la lista de lectura, p. en el siguiente formato:

```js
{
  name: "Matti Luukkainen",
  username: "mluukkai@iki.fi",
  readings: [
    {
      id: 3,
      url: "https://google.com",
      title: "Clean React",
      author: "Dan Abramov",
      likes: 34,
      year: null,
    },
    {
      id: 4,
      url: "https://google.com",
      title: "Clean Code",
      author: "Bob Martin",
      likes: 5,
      year: null,
    }
  ]
}
```

En este punto, no es necesario que esté disponible la información sobre si el blog es leído o no.

#### Ejercicio 13.21.

Expanda la ruta de un solo usuario para que cada blog en la lista de lectura muestre también si el blog ha sido leído <i>y</i> la identificación de la fila de la tabla de unión correspondiente.

Por ejemplo, la información podría tener la siguiente forma:

```js
{
  name: "Matti Luukkainen",
  username: "mluukkai@iki.fi",
  readings: [
    {
      id: 3,
      url: "https://google.com",
      title: "Clean React",
      author: "Dan Abramov",
      likes: 34,
      year: null,
      readinglists: [
        {
          read: false,
          id: 2
        }
      ]
    },
    {
      id: 4,
      url: "https://google.com",
      title: "Clean Code",
      author: "Bob Martin",
      likes: 5,
      year: null,
      readinglists: [
        {
          read: false,
          id: 3
        }
      ]
    }
  ]
}
```

Nota: hay varias formas de implementar esta funcionalidad. [Esto](https://sequelize.org/master/manual/advanced-many-to-many.html#the-best-of-both-worlds--the-super-many-to-many-relationship) debería ayuda.

Tenga en cuenta también que a pesar de tener un campo de matriz <i>listas de lectura</i> en el ejemplo, siempre debe contener exactamente un objeto, la entrada de la tabla de unión que conecta el libro con la lista de lectura del usuario en particular.

#### Ejercicio 13.22.

Implementar funcionalidad en la aplicación para marcar un blog en la lista de lectura como leído. Marcar como leído se hace realizando una solicitud a la ruta _PUT /api/readinglists/:id_ y enviando la solicitud con

```js
{ "read": true }
```

El usuario solo puede marcar los blogs de su propia lista de lectura como leídos. El usuario se identifica como de costumbre a partir del token que acompaña a la solicitud.

#### Ejericio 13.23.

Modifique la ruta que devuelve la información de un solo usuario para que la solicitud pueda controlar cuáles de los blogs de la lista de lectura se devuelven:

- _GET /api/users/:id_ devuelve la lista de lectura completa
- _GET /api/users/:id?read=true_ devuelve blogs que han sido leídos
- _GET /api/users/:id?read=false_ devuelve blogs que no han sido leídos

</div>

<div class="content">

### Observaciones finales

El estado de nuestra aplicación empieza a ser al menos aceptable. Sin embargo, antes del final de la sección, veamos algunos puntos más.

#### Eager vs lazy fetch

Cuando hacemos consultas usando el atributo <i>include</i>:

```js
User.findOne({
  include: {
    model: note
  }
})
```

Se produce la llamada [eager fetch](https://sequelize.org/master/manual/assocs.html#basics-of-queries-involving-associations), es decir, todas las filas de las tablas adjuntas al usuario por el consulta de unión, en el ejemplo, las notas hechas por el usuario, se obtienen de la base de datos al mismo tiempo. A menudo, esto es lo que queremos, pero también hay situaciones en las que desea hacer lo que se conoce como _lazy fetch_, p. Busque equipos relacionados con el usuario solo si son necesarios.

Ahora modifiquemos la ruta para un usuario individual, para que obtenga los equipos del usuario solo si el parámetro de consulta <i>teams</i> está configurado en la solicitud:

```js
router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: [''] } ,
    include:[{
        model: note,
        attributes: { exclude: ['userId'] }
      },
      {
        model: Note,
        as: 'marked_notes',
        attributes: { exclude: ['userId']},
        through: {
          attributes: []
        },
        include: {
          model: user,
          attributes: ['name']
        }
      },
    ]
  })

  if (!user) {
    return res.status(404).end()
  }

  // highlight-start
  let teams = undefined

  if (req.query.teams) {
    teams = await user.getTeams({
      attributes: ['name'],
      joinTableAttributes: []  
    })
  }

  res.json({ ...user.toJSON(), teams })
  // highlight-end
})
```

Ahora, la consulta <i>User.findByPk</i> no recupera equipos, pero se recuperan si es necesario mediante el método <i>user</i> <i>getTeams</i>, que se genera automáticamente por Sequelize para el objeto modelo. Igualmente <i>get</i> y algunos otros métodos útiles [se generan automáticamente](https://sequelize.org/master/manual/assocs.html#special-methods-mixins-added-to-instances) al definir asociaciones para tablas a nivel de Sequelize.

#### Características de los modelos

Hay algunas situaciones en las que, por defecto, no queremos manejar todas las filas de una tabla en particular. Uno de esos casos podría ser que normalmente no queremos mostrar usuarios que han sido <i>deshabilitados</i> en nuestra aplicación. En tal situación, podríamos definir los [ámbitos] predeterminados (https://sequelize.org/master/manual/scopes.html) para el modelo de esta manera:

```js
class User extends Model {}

User.init({
  // field definition
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'user',
  // highlight-start
  defaultScope: {
    where: {
      disabled: false
    }
  },
  scopes: {
    admin: {
      where: {
        admin: true
      }
    },
    disabled: {
      where: {
        disabled: true
      }
    }
  }
  // highlight-end
})

module.exports = User
```

Ahora la consulta causada por la llamada a la función <i>User.findAll()</i> tiene la siguiente condición WHERE:

```
WHERE "user". "disabled" = false;
```

Para los modelos, también es posible definir otros alcances:

```js
User.init({
  // field definition
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'user',
  defaultScope: {
    where: {
      disabled: false
    }
  },
    // highlight-start
  scopes: {
    admin: {
      where: {
        admin: true
      }
    },
    disabled: {
      where: {
        disabled: true
      }
    },
    name(value) {
      return {
        where: {
          name: {
            [Op.iLike]: value
          }
        }
      }
    },
  }
  // highlight-end
})
```

Los alcances se utilizan de la siguiente manera:

```js
// all admins
const adminUsers = await User.scope('admin').findAll()

// all inactive users
const disabledUsers = await User.scope('disabled').findAll()

// users with the string jami in their name
const jamiUsers = User.scope({ method: ['name', '%jami%'] }).findAll()
```

También es posible encadenar ámbitos:

```js
// admins with the string jami in their name
const jamiUsers = User.scope('admin', { method: ['name', '%jami%'] }).findAll()
```

Dado que los modelos de Sequelize son [clases de JavaScript](https://sequelize.org/master/manual/model-basics.html#take-advantage-of-models-being-classes), es posible agregarles nuevos métodos.

Aquí hay dos ejemplos:

```js
const { Model, DataTypes, Op } = require('sequelize') // highlight-line

const Note = require('./note')
const { sequelize } = require('../util/db')

class User extends Model {
  // highlight-start
  async number_of_notes() {
    return (await this.getNotes()).length
  }

  static async with_notes(limit){
    return await User.findAll({
      attributes: {
        include: [[ sequelize.fn("COUNT", sequelize.col("notes.id")), "note_count" ]]
      },
      include: [
        {
          model: Note,
          attributes: []
        },
      ],
      group: ['user.id'],
      having: sequelize.literal(`COUNT(notes.id) > ${limit}`)
    })
  }
  // highlight-end
}

User.init({
  // ...
})

module.exports = User
```

El primero de los métodos <i>numberOfNotes</i> es un <i>método de instancia</i>, lo que significa que se puede llamar en instancias del modelo:

```js
const jami = await User.findOne({ name: 'Jami Kousa'})
const cnt = await jami.number_of_notes()
console.log(`Jami has created ${cnt} notes`)
```

Dentro del método de instancia, la palabra clave <i>this</i> se refiere a la instancia misma:

```js
async number_of_notes() {
  return (await this.getNotes()).length
}
```

El segundo de los métodos, que devuelve aquellos usuarios que tienen al menos <i>X</i> cantidad de notas es un <i>método de clase</i>, es decir, se llama directamente en el modelo:

```js
const users = await User.with_notes(2)
console.log(JSON.stringify(users, null, 2))
users.forEach(u => {
  console.log(u.name)
})
```

#### Repetibilidad de modelos y migraciones

Hemos notado que el código para modelos y migraciones es muy repetitivo. Por ejemplo, el modelo de equipos

```js
class Team extends Model {}

Team.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'team'
})

module.exports = Team
```

y la migración contienen gran parte del mismo código

```js
const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('teams', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
      },
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('teams')
  },
}
```

¿No podríamos optimizar el código para que, por ejemplo, el modelo exporte las partes compartidas necesarias para la migración?

Sin embargo, el problema es que la definición del modelo puede cambiar con el tiempo, por ejemplo, el campo <i>name</i> puede cambiar o su tipo de datos puede cambiar. Las migraciones deben poder realizarse correctamente en cualquier momento de principio a fin, y si las migraciones dependen del modelo para tener cierto contenido, es posible que ya no sea cierto en un mes o un año. Por lo tanto, a pesar del "copiar y pegar", el código de migración debe estar completamente separado del código del modelo.

Una solución sería usar la [herramienta de línea de comandos  de Sequelize ](https://sequelize.org/master/manual/migrations.html#creating-the-first-model--and-migration-), que genera modelos y migración archivos basados ​​en comandos dados en la línea de comandos. Por ejemplo, el siguiente comando crearía un modelo <i>Users</i> con <i>name</i>, <i>username</i> y <i>admin</i> como atributos, como así como la migración que gestiona la creación de la tabla de la base de datos: 

```
npx sequelize-cli model:generate --name User --attributes name:string,username:string,admin:boolean
```

Desde la línea de comandos, también puede ejecutar reversiones, es decir, deshacer migraciones. Desafortunadamente, la documentación de la línea de comandos está incompleta y en este curso decidimos hacer los modelos y las migraciones manualmente. La solución puede o no haber sido sabia.

</div>

<div class="tasks">

### Ejercicio 13.24.

#### Ejercicio 13.24.

Gran final: [hacia el final de la parte 4](/es/part4/autenticacion_de_token#limitacion-de-la-creacion-de-nuevas-notas-a-los-usuarios-registrados) se mencionó un problema crítico del token: si se decide que el acceso de un usuario al sistema revocado, el usuario aún puede usar el token en posesión para usar el sistema.

La solución habitual a esto es almacenar un registro de cada token emitido al cliente en la base de datos del servidor y comprobar con cada solicitud si el acceso sigue siendo válido. En este caso, la validez del token se puede eliminar de inmediato si es necesario. Esta solución a menudo se denomina <i>sesión del lado del servidor</i>.

Ahora expanda el sistema para que el usuario que ha perdido el acceso no pueda realizar ninguna acción que requiera iniciar sesión.

Probablemente necesitará al menos lo siguiente para la implementación
- una columna de valor booleano en la tabla de usuarios para indicar si el usuario está deshabilitado
  - es suficiente deshabilitar y habilitar a los usuarios directamente desde la base de datos
- una tabla que almacena sesiones activas
  - una sesión se almacena en la tabla cuando un usuario inicia sesión, es decir, la operación _POST /api/login_
  - la existencia (y validez) de la sesión siempre se comprueba cuando el usuario realiza una operación que requiere inicio de sesión
- una ruta que permite al usuario "cerrar sesión" del sistema, es decir, eliminar prácticamente las sesiones activas de la base de datos, la ruta puede ser, p. _DELETE /api/logout_

Tenga en cuenta que las acciones que requieren inicio de sesión no deberían tener éxito con un "token caducado", es decir, con el mismo token después de cerrar sesión.

También puede optar por usar alguna biblioteca npm especialmente diseñada para manejar las sesiones.

Realice los cambios de base de datos necesarios para esta tarea mediante migraciones.

### Envío de ejercicios y obtención de créditos.

Los ejercicios de esta parte se envían al igual que en las partes anteriores, pero a diferencia de las partes 0 a 7, la presentación va a una [instancia del curso propia](https://studies.cs.helsinki.fi/stats/courses/fs-psql). ¡Recuerda que tienes que terminar todos los ejercicios para aprobar esta parte!

Una vez que hayas completado los ejercicios y quieras obtener los créditos, infórmanos a través del sistema de envío de ejercicios que has completado el curso:

![Submissions](../../images/11/21.png)

**Tenga en cuenta** que necesita registrarse en la parte del curso correspondiente para obtener los créditos registrados, consulte [aquí](/part0/general_info#parts-and-completion) para obtener más información.

</div>
