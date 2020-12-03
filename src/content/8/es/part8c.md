---
mainImage: ../../../images/part-8.svg
part: 8
letter: c
lang: en
---

<div class="content">

Ahora agregaremos la administración de usuarios a nuestra aplicación, pero comencemos primero a usar una base de datos para almacenar datos.

### Mongoose y Apollo

Instalar mongoose y mongoose-unique-validator:

```bash
npm install mongoose mongoose-unique-validator
```

Imitaremos lo que hicimos en las partes [3](/es/part3/save_data_to_mongo_db) y [4](/es/part4/structure_of_backend_application_introduction_to_testing).

El esquema de persona se ha definido de la siguiente manera:

```js
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 5
  },
  phone: {
    type: String,
    minlength: 5
  },
  street: {
    type: String,
    required: true,
    minlength: 5
  },
  city: {
    type: String,
    required: true,
    minlength: 3
  },
})

module.exports = mongoose.model('Person', schema)
```

También incluimos algunas validaciones. _required: true_, que asegura que el valor exista, es realmente redundante, ya que el solo uso de GraphQL asegura que los campos existan. Sin embargo, es bueno mantener también la validación en la base de datos.

Podemos hacer que la aplicación funcione principalmente con los siguientes cambios:

```js
const { ApolloServer, UserInputError, gql } = require('apollo-server')
const mongoose = require('mongoose')
const Person = require('./models/person')

const MONGODB_URI = 'mongodb+srv://fullstack:halfstack@cluster0-ostce.mongodb.net/graphql?retryWrites=true'

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = gql`
  ...
`

const resolvers = {
  Query: {
    personCount: () => Person.collection.countDocuments(),
    allPersons: (root, args) => {
      // filters missing
      return Person.find({})
    },
    findPerson: (root, args) => Person.findOne({ name: args.name })
  },
  Person: {
    address: root => {
      return {
        street: root.street,
        city: root.city
      }
    }
  },
  Mutation: {
    addPerson: (root, args) => {
      const person = new Person({ ...args })
      return person.save()
    },
    editNumber: async (root, args) => {
      const person = await Person.findOne({ name: args.name })
      person.phone = args.phone
      return person.save()
    }
  }
}
```

Los cambios son bastante sencillos. Sin embargo, hay algunas cosas dignas de mención. Como recordamos, en Mongo el campo de identificación de un objeto se llama <i>_id</i> y previamente tuvimos que analizar el nombre del campo a <i>id</i> nosotros mismos. Ahora GraphQL puede hacer esto automáticamente.

Otra cosa digna de mención es que las funciones de resolución ahora devuelven una <i>promesa</i>, cuando antes devolvían objetos normales. Cuando un resolutor devuelve una promesa, el servidor Apollo [devuelve](https://www.apollographql.com/docs/apollo-server/data/data/#resolver-results) el valor al que se resuelve la promesa.

Por ejemplo, si se ejecuta la siguiente función de resolución,

```js
allPersons: (root, args) => {
  return Person.find({})
},
```

El servidor Apollo espera que se resuelva la promesa y devuelve el resultado . Entonces, Apollo funciona más o menos así:

```js
Person.find({}).then( result => {
  // return the result 
})
```

Completemos la resolución de _allPersons_ para que tome en cuenta el parámetro opcional _phone_:

```js
Query: {
  // ..
  allPersons: (root, args) => {
    if (!args.phone) {
      return Person.find({})
    }

    return Person.find({ phone: { $exists: args.phone === 'YES'  }})
  },
},
```

Entonces, si la consulta no tiene un parámetro _phone_, todas las personas son devueltas. Si el parámetro tiene el valor <i>YES</i>, el resultado de la consulta

```js
Person.find({ phone: { $exists: true }})
```

se devuelve, por lo que los objetos en los que el campo _phone_ tiene un valor. Si el parámetro tiene el valor <i>NO</i>, la consulta devuelve los objetos en los que el campo _phone_ no tiene valor:

```js
Person.find({ phone: { $exists: false }})
```

### Validación

Al igual que en GraphQL, la entrada ahora se valida utilizando las validaciones definidas en el esquema de mangosta. Para manejar posibles errores de validación en el esquema, debemos agregar un bloque de manejo de errores _try/catch_ al método _save_. Cuando terminamos en la captura, lanzamos una excepción adecuada:

```js
Mutation: {
  addPerson: async (root, args) => {
      const person = new Person({ ...args })

      try {
        await person.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      return person
  },
    editNumber: async (root, args) => {
      const person = await Person.findOne({ name: args.name })
      person.phone = args.phone

      try {
        await person.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      return person
    }
}
```

El código del backend se puede encontrar en [Github](https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-4), rama <i>part8-4</i>.

### Usuario e inicio de sesión

Agreguemos la administración de usuarios a nuestra aplicación. Por simplicidad, supongamos que todos los usuarios tienen la misma contraseña que está codificada en el sistema. Sería sencillo guardar contraseñas individuales para todos los usuarios siguiendo los principios de la [parte 4](/es/part4/user_administration), pero debido a que nuestro enfoque está en GraphQL, esta vez dejaremos de lado toda esa molestia adicional.

El esquema de usuario es el siguiente:

```js
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Person'
    }
  ],
})

module.exports = mongoose.model('User', schema)
```

Cada usuario está conectado a un grupo de otras personas en el sistema a través del campo _friends_. La idea es que cuando un usuario, es decir, <i> mluukkai </i>, agrega una persona, es decir, <i> Arto Hellas </i>, a la lista, la persona se agrega a su lista de _amigos_. De esta manera, los usuarios registrados pueden tener su propia vista personalizada en la aplicación.

El inicio de sesión e identificación del usuario se maneja de la misma manera que usamos en la [parte 4](/es/part4/token_authentication) cuando usamos REST, usando tokens.

Extendamos el esquema así:

```js
type User {
  username: String!
  friends: [Person!]!
  id: ID!
}

type Token {
  value: String!
}

type Query {
  // ..
  me: User
}

type Mutation {
  // ...
  createUser(
    username: String!
  ): User
  login(
    username: String!
    password: String!
  ): Token
}
```

La consulta _me_ devuelve el usuario actualmente conectado. Los nuevos usuarios se crean con la mutación _createUser_ y el inicio de sesión ocurre con la mutación _login_.

Los resolutores de las mutaciones son los siguientes:

```js
const jwt = require('jsonwebtoken')

const JWT_SECRET = 'NEED_HERE_A_SECRET_KEY'

Mutation: {
  // ..
  createUser: (root, args) => {
    const user = new User({ username: args.username })

    return user.save()
      .catch(error => {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      })
  },
  login: async (root, args) => {
    const user = await User.findOne({ username: args.username })

    if ( !user || args.password !== 'secred' ) {
      throw new UserInputError("wrong credentials")
    }

    const userForToken = {
      username: user.username,
      id: user._id,
    }

    return { value: jwt.sign(userForToken, JWT_SECRET) }
  },
},
```

La nueva mutación de usuario es sencilla. La mutación de inicio de sesión comprueba si el par de nombre de usuario/contraseña es válido. Y si de hecho es válido, devuelve un token jwt familiar de [parte 4](/es/part4/token_authentication).

Al igual que en el caso anterior con REST, la idea ahora es que un usuario que haya iniciado sesión agregue un token que reciba al iniciar sesión a todas sus solicitudes. Y al igual que con REST, el token se agrega a las consultas GraphQL usando el encabezado <i>Authorization</i>.

En el playground de GraphQL, el encabezado se agrega a una consulta como esta

![](../../images/8/24.png)

Ahora ampliemos la definición del objeto _server_ agregando un tercer parámetro [contexto](https://www.apollographql.com/docs/apollo-server/data/data/#context-argument) a la llamada al constructor:

```js
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // highlight-start
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )

      const currentUser = await User.findById(decodedToken.id).populate('friends')
      return { currentUser }
    }
  }
  // highlight-end
})
```

El objeto devuelto por el contexto se le da a todos los resolutores como su <i>tercer parámetro</i>. El contexto es el lugar adecuado para hacer cosas que comparten varios resolutores, como [identificación de usuario](https://blog.apollographql.com/authorization-in-graphql-452b1c402a9?_ga=2.45656161.474875091.1550613879-1581139173.1549828167).

Entonces, nuestro código establece el objeto correspondiente al usuario que realizó la solicitud al campo _currentUser_ del contexto. Si no hay ningún usuario conectado a la solicitud, el valor del campo no está definido.

El resolutor de la consulta _me_ es muy simple, simplemente devuelve el usuario que ha iniciado sesión que recibe en el campo _currentUser_ del tercer parámetro del resolutor, _context_. Vale la pena señalar que si no hay un usuario que haya iniciado sesión, es decir, no hay un token válido en el encabezado adjunto a la solicitud, la consulta devuelve <i>null</i>:

```js
Query: {
  // ...
  me: (root, args, context) => {
    return context.currentUser
  }
},
```

### Lista de amigos

Completemos el backend de la aplicación para que agregar y editar personas requiera iniciar sesión, y las personas agregadas se agreguen automáticamente al lista de amigos del usuario.

Primero eliminemos de la base de datos a todas las personas que no estén en la lista de amigos de nadie.

La mutación _addPerson_ cambia así:

```js
Mutation: {
  addPerson: async (root, args, context) => {
    const person = new Person({ ...args })
    const currentUser = context.currentUser

    if (!currentUser) {
      throw new AuthenticationError("not authenticated")
    }

    try {
      await person.save()
      currentUser.friends = currentUser.friends.concat(person)
      await currentUser.save()
    } catch (error) {
      throw new UserInputError(error.message, {
        invalidArgs: args,
      })
    }

    return person
  },
  //...
}
```

Si no se puede encontrar un usuario registrado en el contexto, se lanza un _AuthenticationError_. La creación de nuevas personas ahora se realiza con la sintaxis _async / await_, porque si la operación es exitosa, la persona creada se agrega a la lista de amigos del usuario.

También agreguemos funcionalidad para agregar un usuario existente a su lista de amigos. La mutación es la siguiente:

```js
type Mutation {
  // ...
  addAsFriend(
    name: String!
  ): User
}
```

Y el solucionador de mutaciones:

```js
  addAsFriend: async (root, args, { currentUser }) => {
    const nonFriendAlready = (person) => 
      !currentUser.friends.map(f => f._id).includes(person._id)

    if (!currentUser) {
      throw new AuthenticationError("not authenticated")
    }

    const person = await Person.findOne({ name: args.name })
    if ( nonFriendAlready(person) ) {
      currentUser.friends = currentUser.friends.concat(person)
    }

    await currentUser.save()

    return currentUser
  },
```

Observe cómo el solucionador <i>desestructura</i> al usuario que ha iniciado sesión desde el contexto. Entonces, en lugar de guardar _currentUser_ en una variable separada en una función

```js
addAsFriend: async (root, args, context) => {
  const currentUser = context.currentUser
```
se recibe directamente en la definición de parámetros de la función:

```js
addAsFriend: async (root, args, { currentUser }) => {
```

El código del backend se puede encontrar en [Github](https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-5) rama <i>part8-5</i>.

</div>

<div class="tasks">

### Ejercicios 8.13.-8.16.

#### 8.13: Base de datos, parte 1

Cambie la aplicación de la biblioteca para que guarde los datos en una base de datos. Puede encontrar el <i>esquema de mongoose</i> para libros y autores desde [aquí](https://github.com/fullstack-hy2020/misc/blob/master/library-schema.md).

Cambiemos un poco el esquema de graphql del libro

```js
type Book {
  title: String!
  published: Int!
  author: Author!
  genres: [String!]!
  id: ID!
}
```

para que en lugar de solo el nombre del autor, el objeto libro contenga todos los detalles del autor.

Puede asumir que el usuario no intentará agregar libros o autores defectuosos, por lo que no tiene que preocuparse por los errores de validación.

Las siguientes cosas <i>no</i> tienen que funcionar todavía

- consulta _allBooks_ con parámetros
- campo <i>bookCount</i> de un objeto de autor
- campo _author_ de un libro
- mutación _editAuthor_

#### 8.14 : Base de datos, parte 2

Complete el programa para que funcionen todas las consultas (excepto _allBooks_ con el parámetro _author_) y mutaciones.

Puede encontrar esto [útil](https://docs.mongodb.com/manual/reference/operator/query/in/).

#### 8.15 Base de datos, parte 3

Complete el programa de modo que los errores de validación de la base de datos (por ejemplo, título de libro o nombre del autor demasiado corto) se manejen con sensatez. Esto significa que hacen que se emita _UserInputError_ con un mensaje de error adecuado.

#### 8.16 usuario e inicio de sesión

Agregue administración de usuarios a su aplicación. Expanda el esquema así:

```js
type User {
  username: String!
  favoriteGenre: String!
  id: ID!
}

type Token {
  value: String!
}

type Query {
  // ..
  me: User
}

type Mutation {
  // ...
  createUser(
    username: String!
    favoriteGenre: String!
  ): User
  login(
    username: String!
    password: String!
  ): Token
}
```

Cree resolutores para la consulta _me_ y las nuevas mutaciones _createUser_ y _login_. Como en el material del curso, puede asumir que todos los usuarios tienen la misma contraseña codificada.

Haga que las mutaciones _addBook_ y _editAuthor_ sean posibles solo si la solicitud incluye un token válido.

</div>
