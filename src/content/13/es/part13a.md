---
mainImage: ../../../images/part-13.svg
part: 13
letter: a
lang: es
---

<div class="content">

En esta sección vamos a explorar aplicaciones de NodeJS que usan bases de datos relacionales. Construiremos un backend con node usando una base de datos relacional para la aplicación de notas que ya conocemos de las secciones 3 a 5. Para completar esta parte, necesitaras tener conocimiento básico de bases de datos relacionales y de SQL. Hay muchos cursos online de bases de datos SQL, p. ej. [SQLbolt](https://sqlbolt.com/) y 
[Intro a SQL por Khan Academy](https://es.khanacademy.org/computing/computer-programming/sql) (en Español).

Hay 24 ejercicios en esta parte, y necesitarás completar cada uno de ellos para completar el curso. Los ejercicios deben enviarse a través del [sistema de envío de ejercicios](https://studies.cs.helsinki.fi/stats/courses/fs-psql) igual que en las partes anteriores, pero a diferencia de las partes 0 a 7, los ejercicios son enviados a una diferente “instancia del curso”.

### Ventajas y desventajas de las bases de datos documentales

Hemos usado MongoDB en todas las secciones previas del curso. Mongo es una [base de datos documental](https://es.wikipedia.org/wiki/Base_de_datos_documental) y una de sus características más comunes es que es <i>schemaless</i> (sin esquema), p. ej. la base de datos tiene solo una idea muy limitada sobre el tipo de datos que es almacenado en sus colecciones. El esquema de la base de datos solo existe en el código del programa, el cual interpreta los datos de una forma especifica, p. ej. identificando que algunos de los campos son referencias a objetos en otra colección.

En la aplicación de ejemplo de las partes 3 y 4, la base de datos almacena notas y usuarios.

Una colección de <i>notas</i> que almacena notas se ve como el siguiente ejemplo:

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

Usuarios guardados en la colección de <i>usuarios</i> se ven de la siguiente manera:

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

MongoDB conoce los tipos de cada campo de las entidades almacenadas, pero no tiene información acerca de a que colección de entidades hacen referencia el registro de ids almacenados en el campo notes del usuario. A MongoDB tampoco le importa que campos tiene cada entidad almacenada en la colección. Por lo tanto MongoDB le da control total al programador para que este se asegure de que la información correcta esté siendo almacenada en la base de datos.

Hay tanto ventajas como desventajas al no tener un esquema. Una de las ventajas es la flexibilidad que nos da el agnosticismo de esquema: como el esquema no tiene que estar definido al nivel de la base de datos, el desarrollo de aplicaciones puede ser más rápido en ciertos casos, más fácil, y con menor esfuerzo para definir y modificar el esquema. Los problemas que trae no tener un esquema están relacionados con la propensión a errores: todo es dejado a la merced del programador. La base de datos no tiene manera de comprobar si los datos almacenados en ella son <i>honestos</i>, p. ej. si todos los campos obligatorios tienen valores, o si el tipo de los campos de referencia refieren a entidades existentes del tipo correcto, etc.

Las bases de datos relacionales que son el foco de esta sección, por el contrario, se apoyan fuertemente en la existencia de un esquema, y las ventajas y desventajas de las bases de datos con esquema son casi las opuestas comparadas con las bases de datos sin esquema.

La razón por la que en las secciones anteriores del curso usamos MongoDB es precisamente por su falta de esquema, lo cual hace más fácil el uso de una base datos para alguien con poco conocimiento sobre bases de datos relacionales. Para la mayoría de las aplicaciones de este curso, yo personalmente habría elegido usar una base de datos relacional.

### Base de datos de la aplicación

Para nuestra aplicación necesitamos una base de datos relacional. Existen muchas opciones, pero usaremos la que actualmente es la solución Open Source más popular [PostgreSQL](https://www.postgresql.org/). Puedes instalar Postgres (así es usualmente llamada) en tu ordenador, si así lo deseas. Una opción más sencilla sería utilizar Postgres como un servicio en la nube, p. ej. [ElephantSQL](https://www.elephantsql.com/). También podrías utilizar lo que has aprendido en el curso de la [parte 12](/es/part12) y utilizar Postgres localmente con Docker.

Sin embargo, aprovecharemos el hecho de que es posible crear una base de datos Postgres para nuestra aplicación en los servicios en la nube de Heroku, el cual nos es familiar de las partes 3 y 4.

En el material teórico de esta sección, construiremos una versión con Postgres del backend de la aplicación que guarda notas, el cual fue construido en las secciones 3 y 4.
 
Ahora vamos a crear un directorio apropiado dentro de la aplicación en Heroku, agrega una base de datos a él y usa el comando _heroku config_ para obtener la <i>cadena de conexión</i>, la cual es requerida para conectarnos a la base de datos:

```bash
heroku create
# Devuelve un nombre para la aplicación que recién creaste en heroku.

heroku addons:create heroku-postgresql:hobby-dev -a <app-name>
heroku config -a <app-name>
=== cryptic-everglades-76708 Config Vars
DATABASE_URL: postgres://<username>:<password>@<host-of-postgres-addon>:5432/<db-name>
```

Particularmente con las bases de datos relacionales, es esencial acceder directamente a ella. Hay muchas maneras de hacer esto, hay varias interfaces gráficas para el usuario, como [pgAdmin](https://www.pgadmin.org/). Sin embargo, utilizaremos la herramienta de línea de comandos [psql](https://www.postgresql.org/docs/current/app-psql.html) de Postgres.

La base de datos es accesible ejecutando el comando _psql_ en el servidor de Heroku de la siguiente manera (Ten en cuenta que los parámetros del comando dependen de la url de conexión de la base de datos de Heroku)

```bash
heroku run psql -h <host-of-postgres-addon> -p 5432 -U <username> <dbname> -a <app-name>
```

Luego de ingresar la contraseña, vamos a probar el comando principal de psql _\d_, el cual nos muestra los contenidos de la base datos:

```bash
Password for user <username>:
psql (13.4 (Ubuntu 13.4-1.pgdg20.04+1))
SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, bits: 256, compression: off)
Type "help" for help.

username=> \d
Did not find any relations.
```
 
Como puedes ver, aún no hay nada en la base datos.

Vamos a crear una tabla para las notas:

```sql
CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    content text NOT NULL,
    important boolean,
    date time
);
```

Algunos puntos a tener en cuenta: La columna <i>id</i> está definida como una <i>primary key</i> (llave primaria), lo cual significa que cada valor almacenado en cada fila debe ser único y no debe estar vacío. El tipo de esta columna es definido como [SERIAL](https://www.postgresql.org/docs/9.1/datatype-numeric.html#DATATYPE-SERIAL), el cual no es el tipo real, sino que es una abreviación de una columna de enteros, para la cual Postgres automáticamente asigna un valor único e incremental cada vez que se crea una fila. La columna llamada <i>content</i> del tipo text está definida de una forma en la que es obligatorio asignarle un valor (NOT NULL).

Echémosle un vistazo a esta situación desde la consola. Primero, el comando _\d_, el cual nos dice que tablas hay en la base de datos.

```sql
username=> \d
                 List of relations
 Schema | Name | Type | Owner
--------+--------------+----------+----------------
 public | notes | table | username
 public | notes_id_seq | sequence | username
(2 rows)
```

Además de la tabla <i>notes</i>, Postgres ha creado una subtabla llamada <i>notes\_id\_seq</i>, la cual mantiene un registro de que valor es asignado a la columna <i>id</i> cuando generamos la siguiente nota.

Con el comando _\d notes_, podemos ver como la tabla <i>notes</i> es definida:

```sql
username=> \d notes;
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

Podemos observar que la columna <i>id</i> tiene un valor por defecto, el cual es obtenido llamando a la función interna de Postgres <i>nextval</i>.

Agreguemos un poco de contenido a la tabla:

```sql
insert into notes (content, important) values ('Relational databases rule the world', true);
insert into notes (content, important) values ('MongoDB is webscale', false);
```

Y echemos un vistazo al contenido que acabamos de crear:

```sql
username=> select * from notes;
 id | content | important | date
----+-------------------------------------+-----------+------
  1 | relational databases rule the world | t |
  2 | MongoDB is webscale | f |
(2 rows)
```

Si intentamos almacenar datos en la base de datos que no respeten el esquema, no vamos a tener éxito. El valor de una columna obligatoria no puede faltar.

```sql
username=> insert into notes (important) values (true);
ERROR: null value in column "content" of relation "notes" violates not-null constraint
DETAIL: Failing row contains (9, null, t, null).
```

El valor de la columna no puede ser del tipo incorrecto:

```sql
username=> insert into notes (content, important) values ('only valid data can be saved', 1);
ERROR: column "important" is of type boolean but expression is of type integer
LINE 1: ...tent, important) values ('only valid data can be saved', 1); ^
```

Las columnas que no existan en el esquema tampoco serán aceptadas:

```sql
username=> insert into notes (content, important, value) values ('only valid data can be saved', true, 10);
ERROR: column "value" of relation "notes" does not exist
LINE 1: insert into notes (content, important, value) values ('only ...
```

A continuación accederemos a la base de datos desde la aplicación.

### Aplicación de Node usando una base de datos relacional

Iniciemos la aplicación con el comando <i>npm init</i> e instalemos <i>nodemon</i> como una dependencia de desarrollo y también las siguientes dependencias de tiempo de ejecución:

```bash
npm install express dotenv pg sequelize
```

De todas estas, la última [sequelize](https://sequelize.org/master/) es la librería a través de la cual usaremos Postgres. Sequelize es una de las librerías llamadas [Object relational mapping](https://es.wikipedia.org/wiki/Asignaci%C3%B3n_objeto-relacional) (ORM) que nos permite almacenar objetos de JavaScript en una base de datos relacional sin tener que utilizar el lenguaje SQL, su función es similar a la de Mongoose cuando utilizamos MongoDB.

Vamos a probar que podamos conectarnos exitosamente. Crea el archivo <i>index.js</i> y agreguemos el siguiente contenido:

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

La <i>cadena de conexión</i> de la base de datos, la cual es revelada por el comando _heroku config_ debe ser almacenada en un archivo <i>.env</i>, su contenido debe ser algo así:

```bash
$ cat .env
DATABASE_URL=postgres://<username>:<password>@ec2-54-83-137-206.compute-1.amazonaws.com:5432/<databasename>
```

Probemos si podemos conectarnos exitosamente:

```bash
$ node index.js
Executing (default): SELECT 1+1 AS result
Connection has been established successfully.
```

Si la conexión funciona, podemos ejecutar nuestra primera query (consulta). Modifiquemos el programa un poco:

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

Al ejecutar la aplicación, esta debería imprimir lo siguiente:

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

Incluso si Sequelize es una librería ORM, lo cual significa que hay poca necesidad de que tengamos que escribir SQL cuando la usamos, acabamos de usar [direct SQL](https://sequelize.org/master/manual/raw-queries.html) con el método de sequelize [query](https://sequelize.org/api/v6/class/src/sequelize.js~sequelize#instance-method-query).

Como todo parece estar funcionando, transformemos nuestra aplicación en una aplicación web.

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

La aplicación parece que funciona. Sin embargo, ahora vamos a utilizar Sequelize como se supone que debe usarse en vez de SQL.

### Modelo

Cuando utilizamos Sequelize, cada tabla en la base de datos está representada por un [modelo](https://sequelize.org/master/manual/model-basics.html), el cual es, efectivamente, su propia clase de JavaScript. Ahora definamos el modelo <i>Note</i> que corresponde a la tabla <i>notes</i> de la aplicación, cambiando el código al siguiente formato:

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

Algunos comentarios sobre el código: No hay nada muy sorprendente acerca de la definición del modelo <i>Note</i>, cada columna tiene un tipo definido, como así también tiene otras propiedades si es que son necesarias, p. ej. si es la llave principal de la tabla. El segundo parámetro en la definición del modelo contiene los atributos de <i>sequelize</i> así como otra información de la configuración. También hemos definido que la tabla no tiene que utilizar las columnas de timestamps (created\_at and updated\_at).

También definimos <i>underscored: true</i>, lo que significa que los nombres de las tablas son derivados de los nombres de los modelos en versión plural [snake case](https://es.frwiki.wiki/wiki/Snake_case). En la práctica, esto significa que si el nombre del modelo, en nuestro caso "Note", entonces el nombre de la tabla correspondiente es su versión plural con la letra inicial en minúscula, p. ej. <i>notes</i>. En caso de que el nombre del modelo este definido en "dos partes", p. ej. <i>StudyGroup</i>, entonces el nombre de la tabla seria <i>study_groups</i>. Sequelize infiere automáticamente los nombres de las tablas, pero también nos permite definirlos explícitamente.

La misma política de nombres también aplica a las columnas. Si hemos definido que una nota está asociada a <i>creationYear</i>, p. ej. información acerca del año en que fue creada, podríamos definirla en el modelo de la siguiente manera: 

```js
Note.init({
  // ...
  creationYear: {
    type: DataTypes.INTEGER,
  },
})
```

El nombre correspondiente a esta columna en la base de datos sería <i>creation_year</i>. En el código, la referencia a la columna es siempre en el mismo formato que en el modelo, p. ej. en formato "camel case".

También hemos definido <i>modelName: 'note'</i>, el "nombre del modelo" por defecto tendrá la letra inicial en mayúscula <i>Note</i>. Sin embargo, aquí queremos tener una letra inicial minúscula, esto hara algunas cosas más convenientes en el futuro.

La operación de la base de datos es fácil utilizando la [query interface](https://sequelize.org/master/manual/model-querying-basics.html) que nos provee models, el método [findAll](https://sequelize.org/master/class/lib/model.js~Model.html#static-method-findAll) trabaja exactamente como lo que podemos deducir de su nombre:

```js
app.get('/api/notes', async (req, res) => {
  const notes = await Note.findAll() // highlight-line
  res.json(notes)
})
```

La consola nos dice que el método <i>Note.findAll()</i> provoca la siguiente query:

```js
Executing (default): SELECT "id", "content", "important", "date" FROM "notes" AS "note";
```

A continuación, vamos a implementar un endpoint (punto final) para crear nuevas notas:

```js
app.use(express.json())

// ...

app.post('/api/notes', async (req, res) => {
  console.log(req.body)
  const note = await Note.create(req.body)
  res.json(note)
})
```

Creamos una nueva nota al llamar al método [create](https://sequelize.org/master/manual/model-querying-basics.html#simple-insert-queries) del modelo <i>Note</i>, pasando como parámetro un objeto que define los valores de las columnas.

Además de usar el método <i>create</i>, [también es posible](https://sequelize.org/master/manual/model-instances.html#creating-an-instance) guardar en la base de datos usando primero el método [build](https://sequelize.org/api/v6/class/src/model.js~model#static-method-build) para crear un objeto basado en el modelo con los datos deseados, y luego llamar al método [save](https://sequelize.org/master/class/lib/model.js~Model.html#instance-method-save) en él:

```js
const note = Note.build(req.body)
await note.save()
```

Llamar al método <i>build</i> no guarda al objeto en la base de datos, por lo que es posible editar el objeto antes de que lo guardemos:

```js
const note = Note.build(req.body)
note.important = true // highlight-line
await note.save()
```

Para nuestro ejemplo, el uso del método [create](https://sequelize.org/master/manual/model-querying-basics.html#simple-insert-queries) es más adecuado, así que continuaremos con él.

Si el objeto que está siendo creado no es valido, obtendremos un mensaje de error como resultado. Por ejemplo, cuando intentamos crear una nota sin contenido, la operación falla, y la consola nos revela el motivo <i>SequelizeValidationError: notNull Violation Note.content cannot be null</i>:   

```
(node:39109) UnhandledPromiseRejectionWarning: SequelizeValidationError: notNull Violation: Note.content cannot be null
    at InstanceValidator._validate (/Users/mluukkai/opetus/fs-psql/node_modules/sequelize/lib/instance-validator.js:78:13)
    at processTicksAndRejections (internal/process/task_queues.js:93:5)
```

Vamos a agregar un manejo de errores sencillo cuando agregamos una nueva nota:

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

### Ejercicios 13.1-13.3.

En los ejercicios de esta sección, construiremos una aplicación de blogs similar a la de los ejercicios en la [sección 4](/es/part4), la cual debe ser compatible con el frontend de la [sección 5](/es/part5) excepto por el manejo de errores. También agregaremos varias funcionalidades al backend que el frontend de la sección 5 no sabrá como usar.

#### Ejercicio 13.1.

Crea un repositorio de GitHub para la aplicación y crea una nueva aplicación de Heroku para ella, también crea una base de datos Postgres. Asegúrate de que puedes establecer una conexión a la base de datos de la aplicación.

#### Ejercicio 13.2.

En la línea de comandos, crea una tabla llamada <i>blogs</i> para la aplicación con las siguientes columnas:
- id (única, id incremental)
- author (cadena de texto)
- url (cadena de texto que no puede estar vacía)
- title (cadena de texto que no puede estar vacía)
- likes (entero con valor por defecto cero)

Agrega al menos dos blogs a la base de datos.

Guarda los comandos SQL que usaste en la raíz del repositorio de la aplicación en un archivo llamado <i>commands.sql</i>

#### Ejercicio 13.3.

Crea una funcionalidad en tu aplicación que imprima los blogs en la base de datos usando la línea de comandos:

```bash
$ node cli.js
Executing (default): SELECT * FROM blogs
Dan Abramov: 'On let vs const', 0 likes
Laurenz Albe: 'Gaps in sequences in PostgreSQL', 0 likes
```

</div>

<div class="content">

### Creando tablas de bases de datos automáticamente

Nuestra aplicación ahora tiene un problema, está asumiendo que una base de datos con el esquema correcto existe, p. ej. que la tabla <i>notes</i> ha sido creada con el comando <i>create table</i>.

Como el código del programa está almacenado en GitHub, tendría sentido también almacenar los comandos que generan la base de datos en el contexto de el código del programa, para que el esquema de la base datos sea siempre igual al que el código del programa está esperando. De hecho, Sequelize es capaz de generar un esquema automáticamente desde la definición del modelo usando el método [sync](https://sequelize.org/master/manual/model-basics.html#model-synchronization).

Ahora destruyamos la base de datos desde la consola ejecutando el siguiente comando:

```
drop table notes;
```

The `\d` command reveals that the table has been lost from the database:

```
username=> \d
Did not find any relations.
```

La aplicación ahora no funciona.

Agreguemos el siguiente comando a la aplicación inmediatamente después de la definición del modelo <i>Note</i>:

```js
Note.sync()
```

Cuando la aplicación arranca, lo siguiente es imprimido en la consola:

```
Executing (default): CREATE TABLE IF NOT EXISTS "notes" ("id" SERIAL , "content" TEXT NOT NULL, "important" BOOLEAN, "date" TIMESTAMP WITH TIME ZONE, PRIMARY KEY ("id"));
```

Lo que sucede ahora es que cuando la aplicación arranca, el comando <i>CREATE TABLE IF NOT EXISTS "notes"...</i> es ejecutado y crea la tabla <i>notes</i> si es que aún no existe.

### Otras operaciones

Completemos la aplicación con algunas operaciones más.

Buscar una nota individual es posible con el método [findByPk](https://sequelize.org/docs/v6/core-concepts/model-querying-finders/#findbypk), porque esta es recuperada basándose en el id de la llave primaria:

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

Recuperar una sola nota genera el siguiente comando SQL:

```
Executing (default): SELECT "id", "content", "important", "date" FROM "notes" AS "note" WHERE "note". "id" = '1';
```

Si no se encuentra ninguna nota, la operación retorna <i>null</i>, y en este caso el código de estado apropiado nos es devuelto.

Podemos modificar la nota de la siguiente manera. Solo la modificación del campo <i>important</i> es soportada, ya que el frontend de la aplicación no necesita nada más:

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

El objeto correspondiente a una fila de la base de datos es devuelto desde la base datos utilizando el método <i>findByPk</i>, este objeto es modificado y el resultado es guardado llamando al método <i>save</i> del objeto correspondiente a la fila seleccionada de la base de datos.

El código actual completo para la aplicación puede ser encontrado en [GitHub](https://github.com/fullstack-hy/part13-notes/tree/part13-1), en la rama <i>part13-1</i>.

### Imprimiendo los objetos devueltos por Sequelize a la consola

La herramienta más importante del programador de JavaScript es <i>console.log</i>, la cual con un uso agresivo puede poner a los peores bugs bajo control. Agreguemos una impresión a la consola para el endpoint de una nota individual:


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

Podemos ver que el resultado final no es exactamente lo que estábamos esperando:

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

Además de la información sobre la nota, otro tipo de cosas son imprimidas en la consola. Podemos conseguir el resultado deseado llamando el método del objeto-modelo [toJSON](https://sequelize.org/api/v6/class/src/model.js~model#instance-method-toJSON):


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

En el caso de una colección de objetos, el método toJSON no funciona directamente, el método debe ser llamado separadamente para cada objeto en la colección:

```js
router.get('/', async (req, res) => {
  const notes = await Note.findAll()

  console.log(notes.map(n=>n.toJSON())) // highlight-line

  res.json(notes)
})
```

La impresión se ve de la siguiente manera:

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

Sin embargo, quizás una mejor solución es convertir toda la colección a JSON utilizando el método [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify):

```js
router.get('/', async (req, res) => {
  const notes = await Note.findAll()

  console.log(JSON.stringify(notes)) // highlight-line

  res.json(notes)
})
```

Esta solución es incluso mejor si los objetos en la colección contienen otros objetos. También es usualmente util formatear los objetos que aparecen en la pantalla de una forma un poco más amigable para el lector. Esto puede hacerse con el siguiente comando:

```json
console.log(JSON.stringify(notes, null, 2))
```

La impresión ahora se ve así:

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

Transforma tu aplicación en una aplicación web que soporte las siguientes operaciones:

- GET api/blogs (obtén un listado de todos los blogs)
- POST api/blogs (agrega un nuevo blog)
- DELETE api/blogs/:id (elimina un blog)

</div>
