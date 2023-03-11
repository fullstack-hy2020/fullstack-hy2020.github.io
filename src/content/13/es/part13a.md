---
mainImage: ../../../images/part-13.svg
part: 13
letter: a
lang: es
---

<div class="content">

En esta sección exploraremos las aplicaciones de Node que usan bases de datos relacionales. Durante la sección construiremos un backend en Node utilizando una base de datos relacional para una aplicación de notas familiar de las secciones 3-5. Para completar esta parte, se necesitará un conocimiento razonable de bases de datos relacionales y SQL. Hay muchos cursos en línea sobre bases de datos SQL, por ejemplo. [SQLbolt](https://sqlbolt.com/) y [Introducción a SQL por Khan Academy](https://www.khanacademy.org/computing/computer-programming/sql).

Hay 24 ejercicios en esta parte, y se debe completar cada ejercicio para completar el curso. Los ejercicios se envían a través del [sistema de envíos](https://studies.cs.helsinki.fi/stats/courses/fs-psql) al igual que en las partes anteriores, pero a diferencia de las partes 0 a 7, el envío va a su propia "instancia de curso".

### Ventajas y desventajas de las bases de datos de documentos.

En las secciones anteriores del curso, hemos utilizado la base de datos MongoDB. Mongo es una [base de datos de documentos](https://en.wikipedia.org/wiki/Document-oriented_database) y una de sus características más importante es que <i>no posee esquema</i>, es decir, la base de datos tiene solo un conocimiento muy limitado de qué tipo de datos se almacenan en sus colecciones. El esquema de la base de datos existe solo en el código del programa, que interpreta los datos de una manera específica, por ejemplo, al identificar que algunos de los campos son referencias a objetos en otra colección.

En la aplicación de ejemplo de las partes 3 y 4, la base de datos almacena notas y usuarios.

Una colección de <i>notas</i> que almacena notas tiene el siguiente aspecto:

```js
[
  {
    "_id": "600c0e410d10256466898a6c",
    "content": "HTML is easy"
    "date": 2021-01-23T11:53:37.292+00:00,
    "important": false
    "__v": 0
  },
  {
    "_id": "600c0edde86c7264ace9bb78",
    "content": "CSS is hard"
    "date": 2021-01-23T11:56:13.912+00:00,
    "important": true
    "__v": 0
  },
]
```

Los usuarios guardados en la colección <i>users</i> tienen el siguiente aspecto:

```js
[
  {
    "_id": "600c0e410d10256466883a6a",
    "username": "mluukkai",
    "name": "Matti Luukkainen",
    "passwordHash" : "$2b$10$Df1yYJRiQuu3Sr4tUrk.SerVz1JKtBHlBOARfY0PBn/Uo7qr8Ocou",
    "__v": 9,
    notes: [
      "600c0edde86c7264ace9bb78",
      "600c0e410d10256466898a6c"
    ]
  },
]
```

MongoDB conoce los tipos de los campos de las entidades almacenadas, pero no tiene información sobre a qué colección de entidades se refieren los ID de registro de usuario. A MongoDB tampoco le importa qué campos tienen las entidades almacenadas en las colecciones. Por lo tanto, MongoDB deja totalmente en manos del programador garantizar que la información correcta se almacene en la base de datos.

Hay ventajas y desventajas de no tener un esquema. Una de las ventajas es la flexibilidad que aporta el agnosticismo de esquema: dado que no es necesario definir el esquema a nivel de la base de datos, el desarrollo de la aplicación puede ser más rápido en ciertos casos y más fácil, con menos esfuerzo necesario para definir y modificar el esquema en cualquier caso. Los problemas de no tener un esquema están relacionados con la propensión a errores: todo se deja en manos del programador. La base de datos en sí no tiene forma de verificar si los datos que contiene son <i>honestos</i>, es decir, si todos los campos obligatorios tienen valores, si los campos de tipo de referencia se refieren a entidades existentes del tipo correcto en general, etc.

Las bases de datos relacionales en las que se centra esta sección, por otro lado, se basan en gran medida en la existencia de un esquema, y ​​las ventajas y desventajas de las bases de datos de esquema son casi opuestas en comparación con las bases de datos sin esquema.

La razón por la que las secciones anteriores del curso usaron MongoDB es precisamente por su naturaleza sin esquema, lo que ha facilitado el uso de la base de datos para alguien con poco conocimiento de bases de datos relacionales. Para la mayoría de los casos de uso de este curso, personalmente habría optado por utilizar una base de datos relacional.

### Base de datos de la aplicacion

Para nuestra aplicación necesitamos una base de datos relacional. Hay muchas opciones, pero usaremos la solución de código abierto más popular actualmente [PostgreSQL] (https://www.postgresql.org/). Puede instalar Postgres (como suele llamarse a la base de datos) en su máquina, si así lo desea. Una opción más fácil sería usar Postgres como un servicio en la nube, p. [ElephantSQL](https://www.elephantsql.com/). También puede aprovechar las lecciones del curso [parte 12](/es/part12) y usar Postgres localmente usando Docker.

Sin embargo, aprovecharemos el hecho de que es posible crear una base de datos de Postgres para la aplicación en la plataforma de servicios en la nube de Heroku, que ya conocemos de las partes 3 y 4.

En el material teórico de esta sección, crearemos una versión habilitada para Postgres desde el backend de la aplicación de almacenamiento de notas, que se creó en las secciones 3 y 4.

Ahora vamos a crear un directorio adecuado dentro de la aplicación Heroku, agregarle una base de datos y usar el comando _heroku config_ para obtener la <i>cadena de conexión</i>, que se requiere para conectarse a la base de datos:

```bash
heroku create
# Returns an app-name for the app you just created in heroku.

heroku addons:create heroku-postgresql:hobby-dev -a <app-name>
heroku config -a <app-name>
=== cryptic-everglades-76708 Config Vars
DATABASE_URL: postgres://<username>:<password>@<host-of-postgres-addon>:5432/<db-name>
```

Particularmente cuando se utiliza una base de datos relacional, también es esencial acceder a la base de datos directamente. Hay muchas maneras de hacer esto, hay varias interfaces gráficas de usuario diferentes, como [pgAdmin](https://www.pgadmin.org/). Sin embargo, utilizaremos la herramienta de línea de comandos de Postgres [psql](https://www.postgresql.org/docs/current/app-psql.html).

Se puede acceder a la base de datos ejecutando el comando _psql_ en el servidor de Heroku de la siguiente manera (tenga en cuenta que los parámetros del comando dependen de la URL de conexión de la base de datos de Heroku):

```bash
heroku run psql -h <host-of-postgres-addon> -p 5432 -U <username> <dbname> -a <app-name>
```

Después de ingresar la contraseña, probemos con el comando psql principal _\d_, que le indica el contenido de la base de datos:

```bash
Password for user <username>:
psql (13.4 (Ubuntu 13.4-1.pgdg20.04+1))
SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, bits: 256, compression: off)
Type "help" for help.

postgres=# \d
Did not find any relations.
```

Como se puede suponer, actualmente no hay nada en la base de datos.

Vamos a crear una tabla para notas:

```sql
CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    content text NOT NULL,
    important boolean,
    date time
);
```

Algunos puntos: la columna <i>id</i> se define como una <i>clave principal</i>, lo que significa que el valor de la columna id debe ser único para cada fila de la tabla y el valor no debe estar vacío. El tipo de esta columna se define como [SERIAL](https://www.postgresql.org/docs/9.1/datatype-numeric.html#DATATYPE-SERIAL), que no es el tipo real sino una abreviatura de una columna de enteros al que Postgres asigna automáticamente un valor único y creciente al crear filas. La columna denominada <i>contenido</i> con tipo texto se define de tal manera que se le debe asignar un valor.

Veamos la situación desde la consola. Primero, el comando _\d_, que nos dice qué tablas hay en la base de datos:

```sql
postgres=# \d
                 List of relations
 Schema | Name | Type | Owner
--------+--------------+----------+----------------
 public | notes | table | username
 public | notes_id_seq | sequence | username
(2 rows)
```

Además de la tabla <i>notes</i>, Postgres creó una subtabla llamada <i>notes\_id\_seq</i>, que realiza un seguimiento de qué valor se asigna a la <i>id</i> columna al crear la siguiente nota.

Con el comando _\d notas_, podemos ver como se define la tabla <i>notas</i>:

```sql
postgres=# \d notes;
                                     Table "public.notes"
  Column | Type | Collation | Nullable | Default
-----------+------------------------+-----------+----------+-----------------------------------
 id | integer | not null | nextval('notes_id_seq'::regclass)
 content | text | | not null |
 important | boolean | | | |
 date | time without time zone | | | |
Indexes:
    "notes_pkey" PRIMARY KEY, btree (id)
```

Por lo tanto, la columna <i>id</i> tiene un valor predeterminado, que se obtiene llamando a la función interna de Postgres <i>nextval</i>.

Agreguemos algo de contenido a la tabla:

```sql
insert into notes (content, important) values ('Relational databases rule the world', true);
insert into notes (content, important) values ('MongoDB is webscale', false);
```

Y veamos cómo se ve el contenido creado:

```sql
postgres=# select * from notes;
 id | content | important | date
----+-------------------------------------+-----------+------
  1 | relational databases rule the world | t |
  2 | MongoDB is webscale | f |
(2 rows)
```

Si tratamos de almacenar datos en la base de datos que no están de acuerdo con el esquema, no tendrá éxito. No puede faltar el valor de una columna obligatoria:

```sql
postgres=# insert into notes (important) values (true);
ERROR: null value in column "content" of relation "notes" violates not-null constraint
DETAIL: Failing row contains (9, null, t, null).
```

El valor de la columna no puede ser del tipo incorrecto:

```sql
postgres=# insert into notes (content, important) values ('only valid data can be saved', 1);
ERROR: column "important" is of type boolean but expression is of type integer
LINE 1: ...tent, important) values ('only valid data can be saved', 1); ^
```

Tampoco se aceptan columnas que no existen en el esquema:

```sql
postgres=# insert into notes (content, important, value) values ('only valid data can be saved', true, 10);
ERROR: column "value" of relation "notes" does not exist
LINE 1: insert into notes (content, important, value) values ('only ...
```

A continuación, es hora de pasar a acceder a la base de datos desde la aplicación.

### Aplicación en Node, usando una base de datos relacional

Iniciemos la aplicación como de costumbre con <i>npm init</i> e instalemos <i>nodemon</i> como una dependencia de desarrollo y también las siguientes dependencias de tiempo de ejecución:

```bash
npm install express dotenv pg sequelize
```

De estos, el último [sequelize](https://sequelize.org/master/) es la biblioteca a través de la cual usamos Postgres. Sequelize es una biblioteca llamada [Mapeo relacional de objetos] (https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping) (ORM) que le permite almacenar objetos de JavaScript en una base de datos relacional sin usar el Lenguaje SQL en sí mismo, similar a Mongoose que usamos con MongoDB.

Probemos que podemos conectarnos con éxito. Cree el archivo <i>index.js</i> y agregue el siguiente contenido:

```js
require('dotenv').config()
const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
})

const main = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
    sequelize.close()
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

main()
```

La <i>cadena de conexión</i> de la base de datos, que es revelada por el comando _heroku config_ debe almacenarse en un archivo <i>.env</i>, el contenido debe ser algo como lo siguiente:

```bash
$ cat .env
DATABASE_URL=postgres://<username>:<password>@ec2-54-83-137-206.compute-1.amazonaws.com:5432/<databasename>
```

Probemos una conexión exitosa:

```bash
$ node index.js
Executing (default): SELECT 1+1 AS result
Connection has been established successfully.
```

Si la conexión funciona, podemos ejecutar la primera consulta. Modifiquemos el programa de la siguiente manera:

```js
require('dotenv').config()
const { Sequelize, QueryTypes } = require('sequelize') // highlight-line

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});

const main = async () => {
  try {
    await sequelize.authenticate()
    // highlight-start
    const notes = await sequelize.query("SELECT * FROM notes", { type: QueryTypes.SELECT })
    console.log(notes)
    sequelize.close()
    // highlight-end
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

main()
```

La ejecución de la aplicación debe imprimir de la siguiente manera:

```js
Executing (default): SELECT * FROM notes
[
  {
    id: 1,
    content: 'Relational databases rule the world',
    important: true,
    date: null
  },
  {
    id: 2,
    content: 'MongoDB is webscale',
    important: false,
    date: null
  }
]
```

Aun cuando Sequelize es una biblioteca ORM, puede existir casos aislados en los que exista la necesidad de escribir SQL, para ello solo usamos [SQL directo] (https://sequelize.org/master/manual/raw-queries.html) con el método de sequelize [query] (https://sequelize.org/api/v6/class/src/sequelize.js~sequelize#instance-method-query).

Como todo parece estar funcionando, cambiemos la aplicación a una aplicación web.

```js
require('dotenv').config()
const { Sequelize, QueryTypes } = require('sequelize')
const express = require('express') // highlight-line
const app = express() // highlight-line

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});

// highlight-start
app.get('/api/notes', async (req, res) => {
  const notes = await sequelize.query("SELECT * FROM notes", { type: QueryTypes.SELECT })
  res.json(notes)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
// highlight-end
```

La aplicación parece estar funcionando. Sin embargo, ahora cambiemos a usar Sequelize en lugar de SQL, ya que está destinado a usarse.

### El Modelo

Al usar Sequelize, cada tabla en la base de datos está representada por un [modelo] (https://sequelize.org/master/manual/model-basics.html), que es efectivamente su propia clase de JavaScript. Ahora definamos el modelo <i>Nota</i> correspondiente a la tabla <i>notas</i> para la aplicación cambiando el código al siguiente formato:

```js
require('dotenv').config()
const { Sequelize, Model, DataTypes } = require('sequelize') // highlight-line
const express = require('express')
const app = express()

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});

// highlight-start
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
// highlight-end

app.get('/api/notes', async (req, res) => {
  const notes = await Note.findAll() // highlight-line
  res.json(notes)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

Algunos comentarios sobre el código: No hay nada sorprendente en la definición del modelo <i>Nota</i>, cada columna tiene un tipo definido, así como otras propiedades si es necesario, como si es la clave principal de la tabla. El segundo parámetro en la definición del modelo contiene el atributo <i>sequelize</i> así como otra información de configuración. También definimos que la tabla no tiene que usar las columnas de marcas de tiempo (created\_at and updated\_at).

También definimos <i>underscored: true</i>, lo que significa que los nombres de las tablas se derivan de los nombres de los modelos como versiones en plural [snake case](https://en.wikipedia.org/wiki/Snake_case). Prácticamente esto significa que, si el nombre del modelo, como en nuestro caso, es "Nota", entonces el nombre de la tabla correspondiente es su versión plural escrita con una letra inicial minúscula, es decir, <i>notas</i>. Si, por el contrario, el nombre del modelo fuera "dos partes", p. <i>StudyGroup</i>, entonces el nombre de la tabla sería <i>study_groups</i>. Sequelize infiere automáticamente los nombres de las tablas, pero también permite definirlos explícitamente.

La misma política de nomenclatura se aplica a las columnas. Si hubiésemos definido que una nota está asociada a <i>creationYear</i>, es decir, información sobre el año en que fue creada, la definiríamos en el modelo de la siguiente manera:

```js
Note.init({
  // ...
  creationYear: {
    type: DataTypes.INTEGER,
  },
})
```

El nombre de la columna correspondiente en la base de datos sería <i>creation_year</i>. En el código, la referencia a la columna siempre tiene el mismo formato que en el modelo, es decir, en formato "camel case".

También hemos definido <i>modelName: 'note'</i>, el "nombre del modelo" predeterminado sería <i>Note</i> en mayúsculas. Sin embargo, queremos tener una inicial en minúscula, hará que algunas cosas sean un poco más convenientes en el futuro.

La operación de la base de datos es fácil de hacer usando la [interfaz de consulta](https://sequelize.org/master/manual/model-querying-basics.html) proporcionada por los modelos, el método [findAll](https://sequelize.org/master/class/lib/model.js~Model.html#static-method-findAll) funciona exactamente como su nombre indica:

```js
app.get('/api/notes', async (req, res) => {
  const notes = await Note.findAll() // highlight-line
  res.json(notes)
})
```

La consola le dice que la llamada al método <i>Note.findAll()</i> genera la siguiente consulta:

```js
Executing (default): SELECT "id", "content", "important", "date" FROM "notes" AS "note";
```

A continuación, implementemos un endpoint para crear nuevas notas:

```js
app.use(express.json())

// ...

app.post('/api/notes', async (req, res) => {
  console.log(req.body)
  const note = await Note.create(req.body)
  res.json(note)
})
```

La creación de una nueva nota se realiza llamando al método [create](https://sequelize.org/master/manual/model-querying-basics.html#simple-insert-queries) del modelo <i>Note</i> y pasando como parámetro un objeto que define los valores de las columnas.

En lugar del método <i>create</i>, [también es posible](https://sequelize.org/master/manual/model-instances.html#creating-an-instance) guardar en una base de datos usando primero el método [build](https://sequelize.org/api/v6/class/src/model.js~model#static-method-build) para crear un objeto modelo a partir de los datos deseados y luego llamar al método [save](https://sequelize.org/master/class/lib/model.js~Model.html#instance-method-save) en él:

```js
const note = Note.build(req.body)
await note.save()
```

Llamar al método <i>build</i> aún no guarda el objeto en la base de datos, por lo que aún es posible editar el objeto antes del evento de guardado real:

```js
const note = Note.build(req.body)
note.important = true // highlight-line
await note.save()
```

Para el caso de uso del código de ejemplo, el método [create](https://sequelize.org/master/manual/model-querying-basics.html#simple-insert-queries) es más adecuado, así que sigamos con eso.

Si el objeto que se está creando no es válido, aparece un mensaje de error como resultado. Por ejemplo, al intentar crear una nota sin contenido, la operación falla y la consola revela que el motivo es <i>SequelizeValidationError: notNull Violation Note.content can be null</i>:

```
(node:39109) UnhandledPromiseRejectionWarning: SequelizeValidationError: notNull Violation: Note.content cannot be null
    at InstanceValidator._validate (/Users/mluukkai/opetus/fs-psql/node_modules/sequelize/lib/instance-validator.js:78:13)
    at processTicksAndRejections (internal/process/task_queues.js:93:5)
```

Agreguemos un manejo de errores simple al agregar una nueva nota:

```js
app.post('/api/notes', async (req, res) => {
  try {
    const note = await Note.create(req.body)
    return res.json(note)
  } catch(error) {
    return res.status(400).json({ error })
  }
})
```

</div>

<div class="tasks">

### Ejercicios 13.1.-13.3.

En las tareas de esta sección, construiremos un backend de aplicación de blog similar a las tareas en la [sección 4](/es/part4), que debería ser compatible con el frontend en la [sección 5](/es/part5) excepto por manejo de errores. También agregaremos varias características al backend que el frontend en la sección 5 no sabrá cómo usar.

#### Ejercicio 13.1.

Cree un repositorio de GitHub para la aplicación y cree una nueva aplicación de Heroku para ella, así como una base de datos de Postgres. Asegúrese de poder establecer una conexión con la base de datos de la aplicación.

#### Ejercicio 13.2.

En la línea de comandos, cree una tabla <i>blogs</i> para la aplicación con las siguientes columnas:
- id (identificador único e incremental)
- author (cadena de texto)
- url (cadena de texto que no puede estar vacía)
- title (cadena de texto que no puede estar vacía)
- likes (entero con valor predeterminado cero)

Agregue al menos dos blogs a la base de datos.

Guarde los comandos SQL que usó en la raíz del repositorio de la aplicación en el archivo llamado <i>commands.sql</i>

#### Ejercicio 13.3.

Cree una funcionalidad en su aplicación, que imprima los blogs en la base de datos utilizando la línea de comandos, por ejemplo, como se muestra a continuación:

```bash
$ node cli.js
Executing (default): SELECT * FROM blogs
Dan Abramov: 'On let vs const', 0 likes
Laurenz Albe: 'Gaps in sequences in PostgreSQL', 0 likes
```

</div>

<div class="content">

### Crear tablas automáticamente

Nuestra aplicación ahora tiene un lado desagradable, asume que existe una base de datos con exactamente el esquema correcto, es decir, que la tabla <i>notes</i> ha sido creada con el comando <i>create table</i> apropiado.

Dado que el código del programa se almacena en GitHub, tendría sentido almacenar también los comandos que crean la base de datos en el contexto del código del programa, de modo que el esquema de la base de datos sea definitivamente el mismo que espera el código del programa. Sequelize en realidad puede generar un esquema automáticamente a partir de la definición del modelo utilizando el método [sync](https://sequelize.org/master/manual/model-basics.html#model-synchronization).

Ahora destruyamos la base de datos desde la consola ingresando el siguiente comando:

```
drop table notes;
```

El comando `\d` revela que la tabla se ha borrado de la base de datos:

```
postgres=# \d
Did not find any relations.
```

La aplicación ya no funciona.

Agreguemos el siguiente comando a la aplicación inmediatamente después de definir el modelo <i>Note</i>:

```js
Note.sync()
```

Cuando se inicia la aplicación, se imprime lo siguiente en la consola:

```
Executing (default): CREATE TABLE IF NOT EXISTS "notes" ("id" SERIAL , "content" TEXT NOT NULL, "important" BOOLEAN, "date" TIMESTAMP WITH TIME ZONE, PRIMARY KEY ("id"));
```

Es decir, cuando se inicia la aplicación, se ejecuta el comando <i>CREATE TABLE IF NOT EXISTS "notes"...</i> que crea la tabla <i>notes</i> si aún no existe.

### Otras operaciones

Completemos la aplicación con algunas operaciones más.

Es posible buscar una sola nota con el método [findByPk](https://sequelize.org/docs/v6/core-concepts/model-querying-finders/#findbypk), porque se recupera en función del identificador de la clave primaria:

```js
app.get('/api/notes/:id', async (req, res) => {
  const note = await Note.findByPk(req.params.id)
  if (note) {
    res.json(note)
  } else {
    res.status(404).end()
  }
})
```

La recuperación de una sola nota genera el siguiente comando SQL:

```
Executing (default): SELECT "id", "content", "important", "date" FROM "notes" AS "note" WHERE "note". "id" = '1';
```

Si no se encuentra ninguna nota, la operación devuelve <i>null</i> y, en este caso, se proporciona el código de estado correspondiente.

La modificación de la nota se realiza de la siguiente manera. Solo se admite la modificación del campo <i>important</i>, ya que el frontend de la aplicación no necesita nada más:

```js
app.put('/api/notes/:id', async (req, res) => {
  const note = await Note.findByPk(req.params.id)
  if (note) {
    note.important = req.body.important
    await note.save()
    res.json(note)
  } else {
    res.status(404).end()
  }
})
```

El objeto correspondiente a la fila de la base de datos se recupera de la base de datos utilizando el método <i>findByPk</i>, el objeto se modifica y el resultado se guarda llamando al método <i>save</i> del objeto correspondiente.

El código actual de la aplicación se encuentra en su totalidad en [GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-1), rama <i>part13-1</i>.

### Imprimiendo los objetos devueltos por Sequelize a la consola

La herramienta más importante del programador de JavaScript es <i>console.log</i>, cuyo uso agresivo controla incluso los peores errores. Agreguemos la impresión de consola a la ruta de una sola nota:

```js
app.get('/api/notes/:id', async (req, res) => {
  const note = await Note.findByPk(req.params.id)
  if (note) {
    console.log(note) // highlight-line
    res.json(note)
  } else {
    res.status(404).end()
  }
})
```

Podemos ver que el resultado final no es exactamente lo que esperábamos:

```js
note {
  dataValues: {
    id: 1,
    content: 'Notes are attached to a user',
    important: true,
    date: 2021-10-03T15:00:24.582Z,
  },
  _previousDataValues: {
    id: 1,
    content: 'Notes are attached to a user',
    important: true,
    date: 2021-10-03T15:00:24.582Z,
  },
  _changed: Set(0) {},
  _options: {
    isNewRecord: false,
    _schema: null,
    _schemaDelimiter: '',
    raw: true,
    attributes: [ 'id', 'content', 'important', 'date' ]
  },
  isNewRecord: false
}
```

Además de la información de la nota, en la consola se imprimen todo tipo de cosas. Podemos alcanzar el resultado deseado llamando al método modelo-objeto [toJSON](https://sequelize.org/api/v6/class/src/model.js~model#instance-method-toJSON):

```js
app.get('/api/notes/:id', async (req, res) => {
  const note = await Note.findByPk(req.params.id)
  if (note) {
    console.log(note.toJSON()) // highlight-line
    res.json(note)
  } else {
    res.status(404).end()
  }
})
```

Ahora el resultado es exactamente lo que queremos:

```js
{ id: 1,
  content: 'MongoDB is webscale',
  important: false,
  date: 2021-10-09T13:52:58.693Z }
```

En el caso de una colección de objetos, el método toJSON no funciona directamente, el método debe llamarse por separado para cada objeto de la colección:

```js
router.get('/', async (req, res) => {
  const notes = await Note.findAll()

  console.log(notes.map(n=>n.toJSON())) // highlight-line

  res.json(notes)
})
```

La impresión se parece a lo siguiente:

```js
[ { id: 1,
    content: 'MongoDB is webscale',
    important: false,
    date: 2021-10-09T13:52:58.693Z },
  { id: 2,
    content: 'Relational databases rule the world',
    important: true,
    date: 2021-10-09T13:53:10.710Z } ]
```

Sin embargo, quizás una mejor solución sea convertir la colección en JSON para imprimir usando el método [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify):

```js
router.get('/', async (req, res) => {
  const notes = await Note.findAll()

  console.log(JSON.stringify(notes)) // highlight-line

  res.json(notes)
})
```

Esta forma es mejor, especialmente si los objetos de la colección contienen otros objetos. También suele ser útil dar formato a los objetos en la pantalla en un formato un poco más fácil de leer. Esto se puede hacer con el siguiente comando:

```json
console.log(JSON.stringify(notes, null, 2))
```

La impresión se parece a lo siguiente:

```js
[
  {
    "id": 1,
    "content": "MongoDB is webscale",
    "important": false,
    "date": "2021-10-09T13:52:58.693Z"
  },
  {
    "id": 2,
    "content": "Relational databases rule the world",
    "important": true,
    "date": "2021-10-09T13:53:10.710Z"
  }
]
```

</div>

<div class="tasks">

### Ejercicio 13.4.

#### Ejercicio 13.4.

Transforme su aplicación en una aplicación web que admita las siguientes operaciones

- GET api/blogs (listar todos los blogs)
- POST api/blogs (adicionar un nuevo blog)
- DELETE api/blogs/:id (eliminar un blog)

</div>
