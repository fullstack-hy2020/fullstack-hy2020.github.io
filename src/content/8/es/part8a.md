---
mainImage: ../../../images/part-8.svg
part: 8
letter: a
lang: es
---

<div class="content">

REST, familiar para nosotros de las partes anteriores del curso, ha sido durante mucho tiempo la forma más frecuente de implementar las interfaces que ofrecen los servidores para los navegadores y, en general, la integración entre diferentes aplicaciones en la web.

En los últimos años [GraphQL](http://graphql.org/), desarrollado por Facebook, se ha vuelto popular para la comunicación entre aplicaciones web y servidores.

La filosofía GraphQL es muy diferente a REST. REST está <i>basado en recursos</i>. Cada recurso, por ejemplo un <i>usuario</i> tiene su propia dirección que lo identifica, por ejemplo <i>/users/10</i>. Todas las operaciones realizadas en el recurso se realizan con solicitudes HTTP a su URL. La acción depende del método HTTP utilizado.

La base de recursos de REST funciona bien en la mayoría de situaciones. Sin embargo, a veces puede resultar un poco incómodo.

Supongamos que nuestra aplicación de lista de blogs contiene una funcionalidad similar a las de las redes sociales y, por ejemplo, queremos mostrar una lista de todos los blogs que los usuarios que han comentado sobre los blogs que seguimos han agregado.

Si el servidor implementara una API REST, probablemente tendríamos que hacer varias solicitudes HTTP desde el navegador antes de tener todos los datos que queríamos. Las solicitudes también devolverían una gran cantidad de datos innecesarios y el código en el navegador probablemente sería bastante complicado.

Si esta fuera una funcionalidad de uso frecuente, podría haber un endpoint REST para ella. Sin embargo, si hubiera muchos de estos tipos de escenarios, sería muy laborioso implementar endpoints REST para todos ellos.

Un servidor GraphQL es adecuado para este tipo de situaciones.

El principio fundamental de GraphQL es que el código del navegador forma una <i>consulta</i> que describe los datos deseados y los envía a la API con una solicitud HTTP POST. A diferencia de REST, todas las consultas GraphQL se envían a la misma dirección y su tipo es POST.

Los datos descritos en el escenario anterior podrían obtenerse con (aproximadamente) la siguiente consulta:

```bash
query FetchBlogsQuery {
  user(username: "mluukkai") {
    followedUsers {
      blogs {
        comments {
          user {
            blogs {
              title
            }
          }
        }
      }
    }
  }
}
```

La respuesta de los servidores sería sobre el siguiente objeto JSON:

```bash
{
  "data": {
    "followedUsers": [
      {
        "blogs": [
          {
            "comments": [
              {
                "user": {
                  "blogs": [
                    {
                      "title": "Goto considered harmful"
                    },
                    {
                      "title": "End to End Testing with Cypress is most enjoyable"
                    },
                    {
                      "title": "Navigating your transition to GraphQL"
                    },
                    {
                      "title": "From REST to GraphQL"
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    ]
  }
}
```

La lógica de la aplicación se mantiene simple y el código en el navegador obtiene exactamente los datos que necesita con una sola consulta.

### Esquemas y consultas

Conoceremos los conceptos básicos de GraphQL mediante la implementación de una versión GraphQL de la aplicación de directorio telefónico de las partes 2 y 3.

En el corazón de todas las aplicaciones GraphQL hay un [esquema](https://graphql.org/learn/schema/), que describe los datos enviados entre el cliente y el servidor. El esquema inicial de nuestra agenda telefónica es el siguiente:

```js
type Person {
  name: String!
  phone: String
  street: String!
  city: String!
  id: ID! 
}

type Query {
  personCount: Int!
  allPersons: [Person!]!
  findPerson(name: String!): Person
}
```

El esquema describe dos [tipos](https://graphql.org/learn/schema/#type-system). El primer tipo, <i>Person</i>, determina que las personas tienen cinco campos. Cuatro de los campos son de tipo <i>String</i>, que es uno de los [tipos escalares](https://graphql.org/learn/schema/#scalar-types) de GraphQL.
Todos los campos de cadena, excepto <i>phone</i>, deben tener un valor. Esto está marcado por el signo de exclamación en el esquema. El tipo de campo <i>id</i> es <i>ID</i>. Los campos <i>ID</i> son cadenas, pero GraphQL garantiza que sean únicos.

El segundo tipo es una [Consulta](https://graphql.org/learn/schema/#the-query-and-mutation-types). Prácticamente todos los esquemas GraphQL describen una consulta, que indica qué tipo de consultas se pueden realizar a la API.

La agenda telefónica describe tres consultas diferentes. _personCount_ devuelve un número entero, _allPersons_ devuelve una lista de objetos <i>Person</i> y <i>findPerson</i> recibe un parámetro de cadena y devuelve un objeto <i>Person</i>.

Nuevamente, los signos de exclamación se utilizan para marcar qué valores y parámetros de retorno son <i>No nulos</i>. _personCount_, seguro, devolverá un número entero. La consulta _findPerson_ debe recibir una cadena como parámetro. La consulta devuelve un objeto <i>Person</i> o <i>null</i>. _allPersons_ devuelve una lista de objetos <i>Person</i> y la lista no contiene ningún valor <i>nulo</i>.

Entonces, el esquema describe qué consultas puede enviar el cliente al servidor, qué tipo de parámetros pueden tener las consultas y qué tipo de datos devuelven las consultas.

La consulta más simple, _personCount_, tiene el siguiente aspecto:

```js
query {
  personCount
}
```

Suponiendo que nuestras aplicaciones han guardado la información de tres personas, la respuesta se vería así:

```js
{
  "data": {
    "personCount": 3
  }
}
```

La consulta que obtiene la información de todas las personas, _allPersons_, es un poco más complicada. Como la consulta devuelve una lista de objetos <i>Person</i>, la consulta debe describir
<i>que [campos](https://graphql.org/learn/queries/#fields)</i> de los objetos devuelve la consulta:

```js
query {
  allPersons {
    name
    phone
  }
}
```

El la respuesta podría verse así:

```js
{
  "data": {
    "allPersons": [
      {
        "name": "Arto Hellas",
        "phone": "040-123543"
      },
      {
        "name": "Matti Luukkainen",
        "phone": "040-432342"
      },
      {
        "name": "Venla Ruuska",
        "phone": null
      }
    ]
  }
}
```

Se puede realizar una consulta para devolver cualquier campo descrito en el esquema. Por ejemplo, lo siguiente también sería posible:

```js
query {
  allPersons{
    name
    city
    street
  }
}
```


El último ejemplo muestra una consulta que requiere un parámetro y devuelve los detalles de una persona.

```js
query {
  findPerson(name: "Arto Hellas") {
    phone 
    city 
    street
    id
  }
}
```

Entonces, primero el parámetro se describe entre paréntesis y luego los campos del objeto de valor de retorno se enumeran entre paréntesis.

La respuesta es así:

```js
{
  "data": {
    "findPerson": {
      "phone": "040-123543",
      "city": "Espoo",
      "street": "Tapiolankatu 5 A"
      "id": "3d594650-3436-11e9-bc57-8b80ba54c431"
    }
  }
}
```

El valor de retorno se marcó como anulable, así que si buscamos los detalles de una consulta desconocida

```js
query {
  findPerson(name: "Donald Trump") {
    phone 
  }
}
```

el valor de retorno es <i>nulo</i>.

```js
{
  "data": {
    "findPerson": null
  }
}
```

Como puede ver, existe un vínculo directo entre una consulta GraphQL y el objeto JSON devuelto. Se puede pensar que la consulta describe qué tipo de datos quiere como respuesta.
La diferencia con las consultas REST es marcada. Con REST, la URL y el tipo de solicitud no tienen nada que ver con la forma de los datos devueltos.

La consulta GraphQL describe solo los datos que se mueven entre un servidor y el cliente. En el servidor los datos se pueden organizar y guardar como queramos.

A pesar de su nombre, GraphQL en realidad no tiene nada que ver con las bases de datos. No le importa cómo se guardan los datos.
Los datos que utiliza una API GraphQL se pueden guardar en una base de datos relacional, base de datos de documentos o en otros servidores a los que el servidor GraphQL puede acceder con, por ejemplo, REST.

### servidor Apollo

Implementemos un servidor GraphQL con la biblioteca líder en la actualidad [Apollo-server](https://www.apollographql.com/docs/apollo-server/).

Cree un nuevo proyecto npm con _npm init_ e instale las dependencias necesarias.

```bash
npm install apollo-server graphql
```

El código inicial es el siguiente:

```js
const { ApolloServer, gql } = require('apollo-server')

let persons = [
  {
    name: "Arto Hellas",
    phone: "040-123543",
    street: "Tapiolankatu 5 A",
    city: "Espoo",
    id: "3d594650-3436-11e9-bc57-8b80ba54c431"
  },
  {
    name: "Matti Luukkainen",
    phone: "040-432342",
    street: "Malminkaari 10 A",
    city: "Helsinki",
    id: '3d599470-3436-11e9-bc57-8b80ba54c431'
  },
  {
    name: "Venla Ruuska",
    street: "Nallemäentie 22 C",
    city: "Helsinki",
    id: '3d599471-3436-11e9-bc57-8b80ba54c431'
  },
]

const typeDefs = gql`
  type Person {
    name: String!
    phone: String
    street: String!
    city: String! 
    id: ID!
  }

  type Query {
    personCount: Int!
    allPersons: [Person!]!
    findPerson(name: String!): Person
  }
`

const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: () => persons,
    findPerson: (root, args) =>
      persons.find(p => p.name === args.name)
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
```

El corazón del código es un _ApolloServer_, al que se le dan dos parámetros

```js
const server = new ApolloServer({
  typeDefs,
  resolvers,
})
```

El primer parámetro, _typeDefs_, contiene el esquema GraphQL.

El segundo parámetro es un objeto, que contiene los [resolutores](https://www.apollographql.com/docs/tutorial/resolvers/) del servidor. Estos son el código, que define <i>cómo</i> se responde a las consultas GraphQL.

El código de los resolutores es el siguiente:

```js
const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: () => persons,
    findPerson: (root, args) =>
      persons.find(p => p.name === args.name)
  }
}
```

Como puede ver, los resolutores corresponden a las consultas descritas en el esquema.

```js
type Query {
  personCount: Int!
  allPersons: [Person!]!
  findPerson(name: String!): Person
}
```

Así que hay un campo debajo de <i>Query</i> para cada consulta descrita en el esquema.

La consulta

```js
query {
  personCount
}
```

Tiene el resolutor

```js
() => persons.length
```

Por tanto, la respuesta a la consulta es la longitud de la matriz _persons_.

La consulta que obtiene todas las personas

```js
query {
  allPersons {
    name
  }
}
```

tiene un resolutor que devuelve <i>todos</i> los objetos de la matriz _persons_.

```js
() => persons
```

### GraphQL-playground

Cuando Apollo-server se ejecuta en modo de desarrollo (_node filename.js_), inicia un [GraphQL-playground](https://www.apollographql.com/docs/apollo-server/testing/graphql-playground/) en la dirección [http://localhost:4000/graphql](http://localhost:4000/graphql). Esto es muy útil para un desarrollador y se puede utilizar para realizar consultas al servidor.

Probemos

![](../../images/8/1.png)

A veces, Playground requiere que seas bastante pedante. Si la sintaxis de una consulta es incorrecta, el mensaje de error es bastante imperceptible y no sucede nada cuando presiona go.

![](../../images/8/2.png)

El resultado de la consulta anterior permanece visible en el lado derecho del campo de juegos incluso cuando la consulta actual es defectuosa.

Al señalar el lugar correcto en la línea con los errores, puede ver el mensaje de error

![](../../images/8/3.png)

Si el patio de juegos parece estar atascado, actualizar la página generalmente ayuda.

Al hacer clic en el texto <i>DOCS</i> a la derecha, la zona de juegos muestra el esquema GraphQL del servidor.

![](../../images/8/4e.png)

### Parámetros de un resolutor

La consulta que obtiene una sola persona

```js
query {
  findPerson(name: "Arto Hellas") {
    phone 
    city 
    street
  }
}
```

tiene un resolutor que se diferencia de los anteriores porque se le dan <i>dos parámetros</i>:

```js
(root, args) => persons.find(p => p.name === args.name)
```

El segundo parámetro, _args_, contiene los parámetros de la consulta.
El resolutor luego devuelve del arreglo _persons_ a la persona cuyo nombre es el mismo que el valor de <i>args.name</i>.
El resolutor no necesita el primer parámetro _root_.

De hecho, todas las funciones de resolución tienen [cuatro parámetros](https://www.graphql-tools.com/docs/resolvers#resolver-function-signature). Con JavaScript, los parámetros no tienen que estar definidos, si no son necesarios. Usaremos el primer y tercer parámetro de un resolutor más adelante en esta parte.

### El solucionador predeterminado

Cuando hacemos una consulta, por ejemplo

```js
query {
  findPerson(name: "Arto Hellas") {
    phone 
    city 
    street
  }
}
```

el servidor sabe devolver exactamente los campos requeridos por la consulta. ¿Cómo sucede eso?

Un servidor GraphQL debe definir resolutores para <i>cada</i> campo de cada tipo en el esquema.
Hasta ahora solo hemos definido resolutores para campos del tipo <i>Query</i>, es decir, para cada consulta de la aplicación.

Debido a que no definimos resolutores para los campos del tipo <i>Person</i>, Apollo ha definido [resolutores predeterminados](https://www.graphql-tools.com/docs/resolvers/#default-resolver) para ellos.
Funcionan como el que se muestra a continuación:

```js
const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: () => persons,
    findPerson: (root, args) => persons.find(p => p.name === args.name)
  },
  // highlight-start
  Person: {
    name: (root) => root.name,
    phone: (root) => root.phone,
    street: (root) => root.street,
    city: (root) => root.city,
    id: (root) => root.id
  }
  // highlight-end
}
```

El solucionador predeterminado devuelve el valor del campo correspondiente del objeto. Se puede acceder al objeto en sí a través del primer parámetro del resolutor, _root_.

Si la funcionalidad del solucionador predeterminado es suficiente, no es necesario que defina la suya propia. También es posible definir resolutores solo para algunos campos de un tipo y dejar que los resolutores predeterminados manejen el resto.

Podríamos, por ejemplo, definir que la dirección de todas las personas es <i>Manhattan Nueva York</i> codificando de forma rígida lo siguiente para los resolutores de los campos de calle y ciudad del tipo <i> Persona </i>.

```js
Person: {
  street: (root) => "Manhattan",
  city: (root) => "New York"
}
```

### Objeto dentro de un objeto

Modifiquemos un poco el esquema

```js
  // highlight-start
type Address {
  street: String!
  city: String! 
}
  // highlight-end

type Person {
  name: String!
  phone: String
  address: Address!   // highlight-line
  id: ID!
}

type Query {
  personCount: Int!
  allPersons: [Person!]!
  findPerson(name: String!): Person
}
```

por lo que una persona ahora tiene un campo con el tipo <i>Address</i>, que contiene la calle y la ciudad.

Las consultas que requieren la dirección cambian a

```js
query {
  findPerson(name: "Arto Hellas") {
    phone 
    address {
      city 
      street
    }
  }
}
```

y la respuesta ahora es un objeto persona, que <i>contiene</i> un objeto de dirección.

```js
{
  "data": {
    "findPerson": {
      "phone": "040-123543",
      "address":  {
        "city": "Espoo",
        "street": "Tapiolankatu 5 A"
      }
    }
  }
}
```

Todavía guardamos a las personas en el servidor de la misma manera que lo hacíamos antes.

```js
let persons = [
  {
    name: "Arto Hellas",
    phone: "040-123543",
    street: "Tapiolankatu 5 A",
    city: "Espoo",
    id: "3d594650-3436-11e9-bc57-8b80ba54c431"
  },
  // ...
]
```

Por lo tanto, los objetos de persona guardados en el servidor no son exactamente los mismos que los objetos de tipo <i>Person</i> GraphQL descritos en el esquema.

A diferencia del tipo <i>Person</i>, el tipo <i>Address</i> no tiene un campo <i>id</i> porque no se guardan en su propia estructura de datos en el servidor.

Debido a que los objetos guardados en la matriz no tienen un campo <i>address</i>, el resolutor predeterminado no es suficiente.
Agreguemos un resolutor para el campo <i>address</i> de tipo <i>Person</i>:

```js
const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: () => persons,
    findPerson: (root, args) =>
      persons.find(p => p.name === args.name)
  },
  // highlight-start
  Person: {
    address: (root) => {
      return { 
        street: root.street,
        city: root.city
      }
    }
  }
  // highlight-end
}
```

Así que cada vez que un objeto <i>Person</i> es devuelto, los campos <i>name</i>, <i>phone</i> e <i>id</i> se devuelven utilizando sus resolutores predeterminados, pero el campo <i>address</i> se forma utilizando un resolutor autodefinido. El parámetro _root_ de la función de resolución es el objeto-persona, por lo que la calle y la ciudad de la dirección se pueden tomar de sus campos.

El código actual de la aplicación se puede encontrar en [Github](https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-1), rama <i>part8-1</i>.

### Mutaciones

Agreguemos una funcionalidad para agregar nuevas personas a la agenda. En GraphQL, todas las operaciones que provocan un cambio se realizan con [mutaciones](https://graphql.org/learn/queries/#mutations). Las mutaciones se describen en el esquema como claves de tipo <i>Mutation</i>.

El esquema de una mutación para agregar una nueva persona tiene el siguiente aspecto:

```js
type Mutation {
  addPerson(
    name: String!
    phone: String
    street: String!
    city: String!
  ): Person
}
```

A la mutación se le dan los detalles de la persona como parámetros. El parámetro <i>phone</i> es el único que admite valores NULL. La mutación también tiene un valor de retorno. El valor de retorno es de tipo <i>Person</i>, la idea es que los detalles de la persona agregada se devuelvan si la operación es exitosa y si no, nula. El valor del campo <i>id</i> no se proporciona como parámetro. Es mejor dejar la generación de una identificación para el servidor.

Las mutaciones también requieren un resolutor:

```js
const { v1: uuid } = require('uuid')

// ...

const resolvers = {
  // ...
  Mutation: {
    addPerson: (root, args) => {
      const person = { ...args, id: uuid() }
      persons = persons.concat(person)
      return person
    }
  }
}
```

La mutación agrega el objeto que se le dio como parámetro _args_ al arreglo _persons_, y devuelve el objeto que agregó al arreglo.

El campo <i>id</i> recibe un valor único utilizando la librería [uuid](https://github.com/kelektiv/node-uuid#readme).

Se puede agregar una nueva persona con la siguiente mutación

```js
mutation {
  addPerson(
    name: "Pekka Mikkola"
    phone: "045-2374321"
    street: "Vilppulantie 25"
    city: "Helsinki"
  ) {
    name
    phone
    address{
      city
      street
    }
    id
  }
}
```

Ten en cuenta que la persona se guarda en la matriz _persons_ como

```js
{
  name: "Pekka Mikkola",
  phone: "045-2374321",
  street: "Vilppulantie 25",
  city: "Helsinki",
  id: "2b24e0b0-343c-11e9-8c2a-cb57c2bf804f"
}
```

Pero la respuesta a la mutación es

```js
{
  "data": {
    "addPerson": {
      "name": "Pekka Mikkola",
      "phone": "045-2374321",
      "address": {
        "city": "Helsinki",
        "street": "Vilppulantie 25"
      },
      "id": "2b24e0b0-343c-11e9-8c2a-cb57c2bf804f"
    }
  }
}
```

Entonces, el resolutor del campo <i>address</i> del tipo <i>Person</i> formatea el objeto de respuesta en la forma correcta.

### Manejo de errores

Si intentamos crear una nueva persona, pero los parámetros no se corresponden con la descripción del esquema, el servidor muestra un mensaje de error:

![](../../images/8/5.png)

Por lo tanto, parte del manejo de errores se puede realizar automáticamente con [validación](https://graphql.org/learn/validation/) GraphQL.

Sin embargo, GraphQL no puede manejar todo automáticamente. Por ejemplo, las reglas más estrictas para los datos enviados a una mutación deben agregarse manualmente.
Los errores de esas reglas son manejados por [el mecanismo de manejo de errores de Apollo Server](https://www.apollographql.com/docs/apollo-server/data/errors).

Bloqueemos agregar el mismo nombre al directorio telefónico varias veces:

```js
const { ApolloServer, UserInputError, gql } = require('apollo-server') // highlight-line

// ...

const resolvers = {
  // ..
  Mutation: {
    addPerson: (root, args) => {
      // highlight-start
      if (persons.find(p => p.name === args.name)) {
        throw new UserInputError('Name must be unique', {
          invalidArgs: args.name,
        })
      }
      // highlight-end

      const person = { ...args, id: uuid() }
      persons = persons.concat(person)
      return person
    }
  }
}
```

Entonces, si el nombre que se agregará ya existe en la agenda, arroje el error _UserInputError_.

![](../../images/8/6.png)

El código actual de la aplicación se puede encontrar en [Github](https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-2), rama <i>part8-2</i>.

### Enum

Agreguemos la posibilidad de filtrar la consulta que devuelve todas las personas con el parámetro <i>phone</i> para que solo devuelva personas con un número de teléfono

```js
query {
  allPersons(phone: YES) {
    name
    phone 
  }
}
```

o personas sin un número de teléfono

```js
query {
  allPersons(phone: NO) {
    name
  }
}
```

El esquema cambia así:

```js
// highlight-start
enum YesNo {
  YES
  NO
}
// highlight-end

type Query {
  personCount: Int!
  allPersons(phone: YesNo): [Person!]! // highlight-line
  findPerson(name: String!): Person
}
```

El tipo <i>YesNo</i> es GraphQL [enum](https://graphql.org/learn/schema/#enumeration-types), o un enumerable, con dos valores posibles <i>YES</i> o <i>NO</i>. En la consulta _allPersons_ el parámetro _phone_ tiene el tipo <i>YesNo</i>, pero acepta valores NULL.

El solucionador cambia así:

```js
Query: {
  personCount: () => persons.length,
  // highlight-start
  allPersons: (root, args) => {
    if (!args.phone) {
      return persons
    }

    const byPhone = (person) =>
      args.phone === 'YES' ? person.phone : !person.phone

    return persons.filter(byPhone)
  },
  // highlight-end
  findPerson: (root, args) =>
    persons.find(p => p.name === args.name)
},
```

### Cambiar un número de teléfono

Agreguemos una mutación para cambiar el número de teléfono de una persona. El esquema de esta mutación se ve como sigue:

```js
type Mutation {
  addPerson(
    name: String!
    phone: String
    street: String!
    city: String!
  ): Person
  // highlight-start
  editNumber(
    name: String!
    phone: String!
  ): Person
  // highlight-end
}
```

y lo hace un solucionador:

```js
Mutation: {
  // ...
  editNumber: (root, args) => {
    const person = persons.find(p => p.name === args.name)
    if (!person) {
      return null
    }

    const updatedPerson = { ...person, phone: args.phone }
    persons = persons.map(p => p.name === args.name ? updatedPerson : p)
    return updatedPerson
  }   
}
```

La mutación encuentra a la persona que se actualizará mediante el campo <i>name</i>.

El código actual de la aplicación se puede encontrar en [Github](https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-3), rama <i>part8-3</i>.

### Más sobre consultas

Con GraphQL es posible combinar varios campos de tipo <i>Query</i>, o "consultas separadas" en una sola consulta. Por ejemplo, la siguiente consulta devuelve tanto la cantidad de personas en la agenda telefónica como sus nombres:

```js
query {
  personCount
  allPersons {
    name
  }
}
```

La respuesta se ve como sigue

```js
{
  "data": {
    "personCount": 3,
    "allPersons": [
      {
        "name": "Arto Hellas"
      },
      {
        "name": "Matti Luukkainen"
      },
      {
        "name": "Venla Ruuska"
      }
    ]
  }
}
```

La consulta combinada también puede usar la misma consulta varias veces. Sin embargo, debe dar a las consultas nombres alternativos como

```js
query {
  havePhone: allPersons(phone: YES){
    name
  }
  phoneless: allPersons(phone: NO){
    name
  }
}
```

La respuesta se ve como

```js
{
  "data": {
    "havePhone": [
      {
        "name": "Arto Hellas"
      },
      {
        "name": "Matti Luukkainen"
      }
    ],
    "phoneless": [
      {
        "name": "Venla Ruuska"
      }
    ]
  }
}
```

En en algunos casos, puede resultar beneficioso nombrar las consultas. Este es el caso especialmente cuando las consultas o mutaciones tienen [parámetros](https://graphql.org/learn/queries/#variables). Pronto entraremos en los parámetros.

Si hay varias consultas, Playground le pide que elija cuál de ellas ejecutar:

![](../../images/8/7.png)

</div>

<div class="tasks">

### Ejercicios 8.1.-8.7.

A través de los ejercicios, implementaremos un backend GraphQL para una pequeña biblioteca.
Comience con [este archivo](https://github.com/fullstack-hy2020/misc/blob/master/library-backend.js). ¡Recuerde _npm init_ e instalar dependencias!

Tenga en cuenta que el código no funciona inicialmente porque la definición del esquema no está completa.

#### 8.1: El número de libros y autores

Implementar consultas _bookCount_ y _authorCount_ que devuelven el número de libros y el número de autores.

La consulta

```js
query {
  bookCount
  authorCount
}
```

debe devolver

```js
{
  "data": {
    "bookCount": 7,
    "authorCount": 5
  }
}
```

#### 8.2: Todos los libros

Implementar la consulta _allBooks_, que devuelve los detalles de todos los libros.

Al final, el usuario debería poder realizar la siguiente consulta:

```js
query {
  allBooks { 
    title 
    author
    published 
    genres
  }
}
```

#### 8.3: Todos los autores

Implementar la consulta _allAuthors_, que devuelve los detalles de todos autores. La respuesta debe incluir un campo _bookCount_ que contenga el número de libros que ha escrito el autor.

Por ejemplo, la consulta

```js
query {
  allAuthors {
    name
    bookCount
  }
}
```

debería devolver`

```js
{
  "data": {
    "allAuthors": [
      {
        "name": "Robert Martin",
        "bookCount": 2
      },
      {
        "name": "Martin Fowler",
        "bookCount": 1
      },
      {
        "name": "Fyodor Dostoevsky",
        "bookCount": 2
      },
      {
        "name": "Joshua Kerievsky",
        "bookCount": 1
      },
      {
        "name": "Sandi Metz",
        "bookCount": 1
      }
    ]
  }
}
```

#### 8.4: Libros de un autor

Modifique la consulta _allBooks_ para que un usuario pueda dar un parámetro opcional <i>author</i>. La respuesta debe incluir solo libros escritos por ese autor.

Por ejemplo, la consulta

```js
query {
  allBooks(author: "Robert Martin") {
    title
  }
}
```

debería devolver

```js
{
  "data": {
    "allBooks": [
      {
        "title": "Clean Code"
      },
      {
        "title": "Agile software development"
      }
    ]
  }
}
```

#### 8.5: Libros por género

Modifique la consulta _allBooks_ para que un usuario pueda dar un parámetro opcional <i>genre</i>. La respuesta debe incluir solo libros de ese género.

Por ejemplo, la consulta

```js
query {
  allBooks(genre: "refactoring") {
    title
    author
  }
}
```

debería devolver

```js
{
  "data": {
    "allBooks": [
      {
        "title": "Clean Code",
        "author": "Robert Martin"
      },
      {
        "title": "Refactoring, edition 2",
        "author": "Martin Fowler"
      },
      {
        "title": "Refactoring to patterns",
        "author": "Joshua Kerievsky"
      },
      {
        "title": "Practical Object-Oriented Design, An Agile Primer Using Ruby",
        "author": "Sandi Metz"
      }
    ]
  }
}
```

La consulta debe funcionar cuando ambos parámetros opcionales son proporcionados:

```js
query {
  allBooks(author: "Robert Martin", genre: "refactoring") {
    title
    author
  }
}
```

#### 8.6: Agregar un libro

Implementar la mutación _addBook_, que puede ser usado así:

```js
mutation {
  addBook(
    title: "NoSQL Distilled",
    author: "Martin Fowler",
    published: 2012,
    genres: ["database", "nosql"]
  ) {
    title,
    author
  }
}
```

La mutación funciona incluso si el autor no está todavía guardado en el servidor:

```js
mutation {
  addBook(
    title: "Pimeyden tango",
    author: "Reijo Mäki",
    published: 1997,
    genres: ["crime"]
  ) {
    title,
    author
  }
}
```

Si el autor aún no está guardado en el servidor , se agrega un nuevo autor al sistema. Los años de nacimiento de los autores aún no se guardan en el servidor, entonces la consulta

```js
query {
  allAuthors {
    name
    born
    bookCount
  }
}
```

devuelve

```js
{
  "data": {
    "allAuthors": [
      // ...
      {
        "name": "Reijo Mäki",
        "born": null,
        "bookCount": 1
      }
    ]
  }
}
```

#### 8.7: Actualización del año de nacimiento de un autor

Implemente la mutación _editAuthor_, que se puede usar para establecer un año de nacimiento para un autor. La mutación se usa así

```js
mutation {
  editAuthor(name: "Reijo Mäki", setBornTo: 1958) {
    name
    born
  }
}
```

Si se encuentra el autor correcto, la operación devuelve el autor editado:

```js
{
  "data": {
    "editAuthor": {
      "name": "Reijo Mäki",
      "born": 1958
    }
  }
}
```

Si el autor no está en el sistema, se devuelve <i>null</i>:

```js
{
  "data": {
    "editAuthor": null
  }
}
```

</div>
