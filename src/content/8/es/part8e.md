---
mainImage: ../../../images/part-8.svg
part: 8
letter: e
lang: en
---

<div class="content">

Nos acercamos al final del curso. Terminemos echando un vistazo a algunos detalles más de GraphQL.

### fragmentos

Es bastante común en GraphQL que múltiples consultas devuelvan resultados similares. Por ejemplo, la consulta para los detalles de una persona

```js
query {
  findPerson(name: "Pekka Mikkola") {
    name
    phone
    address{
      street 
      city
    }
  }
}
```

y la consulta para todas las personas

```js
query {
  allPersons {
    name
    phone
    address{
      street 
      city
    }
  }
}
```

ambas regresan personas. Al elegir los campos a devolver, ambas consultas deben definir exactamente los mismos campos.

Este tipo de situaciones se pueden simplificar con el uso de [fragmentos](https://graphql.org/learn/queries/#fragments). Declaremos un fragmento para seleccionar todos los campos de una persona:

```js
fragment PersonDetails on Person {
  name
  phone 
  address {
    street 
    city
  }
}
```

Con el fragment podemos hacer las consultas en forma compacta:

```js
query {
  allPersons {
    ...PersonDetails // highlight-line
  }
}

query {
  findPerson(name: "Pekka Mikkola") {
    ...PersonDetails // highlight-line
  }
}
```

Los fragmentos <i><strong>son no definidos</strong></i> en el esquema GraphQL, sino en el cliente. Los fragmentos deben declararse cuando el cliente los utilice para consultas.

En principio, podríamos declarar el fragmento con cada consulta de la siguiente manera:

```js
const ALL_PERSONS = gql`
  {
    allPersons  {
      ...PersonDetails
    }
  }

  fragment PersonDetails on Person {
    name
    phone 
    address {
      street 
      city
    }
  }
`
```

Sin embargo, es mucho mejor declarar el fragmento una vez y guardarlo en una variable.

```js
const PERSON_DETAILS = gql`
  fragment PersonDetails on Person {
    id
    name
    phone 
    address {
      street 
      city
    }
  }
`
```

Declarado así, el fragmento se puede colocar en cualquier consulta o mutación usando un [signo de dólar y llaves](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals):

```js
const ALL_PERSONS = gql`
  {
    allPersons  {
      ...PersonDetails
    }
  }
  ${PERSON_DETAILS}  
`
```

### Suscripciones

Junto con los tipos de consulta y mutación, GraphQL ofrece un tercer tipo de operación: [suscripciones](https://www.apollographql.com/docs/react/data/subscriptions/). Con las suscripciones, los clientes pueden <i>suscribirse</i> a actualizaciones sobre cambios en el servidor.

Las suscripciones son radicalmente diferentes a todo lo que hemos visto en este curso hasta ahora. Hasta ahora, toda la interacción entre el navegador y el servidor ha sido la aplicación React en el navegador que realiza solicitudes HTTP al servidor. Las consultas y mutaciones de GraphQL también se han realizado de esta manera.
Con las suscripciones la situación es la contraria. Una vez que una aplicación se ha suscrito, comienza a escuchar al servidor.
Cuando ocurren cambios en el servidor, envía una notificación a todos sus <i>suscriptores</i>.

Técnicamente hablando, el protocolo HTTP no es adecuado para la comunicación desde el servidor al navegador, por lo que Apollo usa [WebSockets] (https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API ) para la comunicación del suscriptor del servidor.

### Suscripciones en el servidor

Implementemos suscripciones para suscribirse a notificaciones sobre nuevas personas agregadas.

No hay muchos cambios en el servidor. El esquema cambia así:

```js
type Subscription {
  personAdded: Person!
}    
```

Entonces, cuando se agrega una nueva persona, todos sus detalles se envían a todos los suscriptores.

La suscripción _personAdded_ necesita un solucionador. El solucionador _addPerson_ también debe modificarse para que envíe una notificación a los suscriptores.

Los cambios requeridos son los siguientes:

```js
const { PubSub } = require('apollo-server') // highlight-line
const pubsub = new PubSub() // highlight-line

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

      pubsub.publish('PERSON_ADDED', { personAdded: person })  // highlight-line

      return person
    },  
  },
  // highlight-start
  Subscription: {
    personAdded: {
      subscribe: () => pubsub.asyncIterator(['PERSON_ADDED'])
    },
  },
  // highlight-end
```

Con las suscripciones, la comunicación ocurre usando el principio [publicar-suscribir](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) utilizando un objeto usando un [PubSub](https://www.apollographql.com/docs/graphql-subscriptions/setup/#setup) interfaz. Agregar una nueva persona <i> publica </i> una notificación sobre la operación a todos los suscriptores con el método _publish_ de PubSub.

_personAdded_ subscriptions resolver registra a todos los suscriptores devolviéndoles un [objeto iterador] adecuado (https://www.apollographql.com/docs/graphql-subscriptions/subscriptions-to-schema/).

Hagamos los siguientes cambios en el código que inicia el servidor

```js
// ...

server.listen().then(({ url, subscriptionsUrl }) => { // highlight-line
  console.log(`Server ready at ${url}`)
  console.log(`Subscriptions ready at ${subscriptionsUrl}`) // highlight-line
})
```

Vemos que el servidor escucha suscripciones en la dirección _ws://localhost:4000/graphql_

```js
Server ready at http://localhost:4000/
Subscriptions ready at ws://localhost:4000/graphql
```

No se necesitan otros cambios en el servidor.

Es posible probar las suscripciones con el patio de juegos de GraphQL de esta manera:

![](../../images/8/31.png)

Cuando presiona "reproducir" en una suscripción, el área de juegos espera las notificaciones de la suscripción.

El código de backend se puede encontrar en [Github] (https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-6), rama <i>part8-6</i>.

### Suscripciones en el cliente

Para usar suscripciones en nuestra aplicación React, tenemos que hacer algunos cambios, especialmente en su [configuración](https://www.apollographql.com/docs/react/data/subscriptions/).
La configuración en <i>index.js</i> tiene que ser modificada así:

```js
import { 
  ApolloClient, ApolloProvider, HttpLink, InMemoryCache, 
  split  // highlight-line
} from '@apollo/client'
import { setContext } from 'apollo-link-context'

// highlight-start
import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/client/link/ws'
// highlight-end

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('phonenumbers-user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}` : null,
    }
  }
})

const httpLink = new HttpLink({
  uri: 'http://localhost:4000',
})

// highlight-start
const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: {
    reconnect: true
  }
})

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink),
)
// highlight-end

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink // highlight-line
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>, 
  document.getElementById('root')
)
```

Para que esto funcione, tenemos que instalar algunas dependencias:

```bash
npm install @apollo/client subscriptions-transport-ws
```

La nueva configuración se debe al hecho de que la aplicación debe tener una conexión HTTP así como una conexión WebSocket al servidor GraphQL.

```js
const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: { reconnect: true }
})

const httpLink = createHttpLink({
  uri: 'http://localhost:4000',
})
```

Las suscripciones se realizan utilizando la función de gancho [useSubscription](https://www.apollographql.com/docs/react/api/react/hooks/#usesubscription).

Modifiquemos el código así:

```js
// highlight-start
export const PERSON_ADDED = gql`
  subscription {
    personAdded {
      ...PersonDetails
    }
  }
  ${PERSON_DETAILS}
`
// highlight-end

import {
  useQuery, useMutation, useSubscription, useApolloClient // highlight-line
} from '@apollo/client'

const App = () => {
  // ...

  useSubscription(PERSON_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      console.log(subscriptionData)
    }
  })

  // ...
}
```

Cuando se agrega una nueva persona a la agenda, no independientemente de dónde se haga, los detalles de la nueva persona se imprimen en la consola del cliente:

![](../../images/8/32e.png)

Cuando se agrega una nueva persona, el servidor envía una notificación al cliente y se llama a la función de devolución de llamada definida en el atributo _onSubscriptionData_ y se le dan los detalles. de la nueva persona como parámetros.

Extendamos nuestra solución para que cuando se reciban los detalles de una nueva persona, la persona se agregue a la caché de Apollo, de modo que se muestre en la pantalla de inmediato.

Sin embargo, debemos tener en cuenta que cuando nuestra aplicación crea una nueva persona, no se debe agregar a la caché dos veces:

```js
const App = () => {
  // ...

  const updateCacheWith = (addedPerson) => {
    const includedIn = (set, object) => 
      set.map(p => p.id).includes(object.id)  

    const dataInStore = client.readQuery({ query: ALL_PERSONS })
    if (!includedIn(dataInStore.allPersons, addedPerson)) {
      client.writeQuery({
        query: ALL_PERSONS,
        data: { allPersons : dataInStore.allPersons.concat(addedPerson) }
      })
    }   
  }

  useSubscription(PERSON_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedPerson = subscriptionData.data.personAdded
      notify(`${addedPerson.name} added`)
      updateCacheWith(addedPerson)
    }
  })

  // ...
}
```

La función _updateCacheWith_ también se puede utilizar en _PersonForm_ para la actualización de la caché:

```js
const PersonForm = ({ setError, updateCacheWith }) => { // highlight-line
  // ...

  const [ createPerson ] = useMutation(CREATE_PERSON, {
    onError: (error) => {
      setError(error.graphQLErrors[0].message)
    },
    update: (store, response) => {
      updateCacheWith(response.data.addPerson) // highlight-line
    }
  })
   
  // ..
} 
```

El código final del cliente puede ser que se encuentra en [Github](https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-9), rama <i>part8-9</i>.

### problema n+1

Agreguemos algunas cosas al backend. Modifiquemos el esquema para que un tipo <i>Person</i> tenga un campo _friendOf_, que indica en qué lista de amigos está la persona.

```js
type Person {
  name: String!
  phone: String
  address: Address!
  friendOf: [User!]!
  id: ID!
}
```

La aplicación debe admitir la siguiente consulta:

```js
query {
  findPerson(name: "Leevi Hellas") {
    friendOf{
      username
    }
  }
}
```

Debido a que _friendOf_ no es un campo de objetos <i>Person</i> en la base de datos, tenemos que crear un solucionador para él, que puede resolver este problema. Primero creemos un resolutor que devuelva una lista vacía:

```js
Person: {
  address: (root) => {
    return { 
      street: root.street,
      city: root.city
    }
  },
  // highlight-start
  friendOf: (root) => {
    // return list of users 
    return [
    ]
  }
  // highlight-end
},
```

El parámetro _root_ es el objeto de persona cuya lista de amigos se está creando, por lo que buscamos entre todos los objetos _User_ los que tienen root._id en su lista de amigos:

```js
  Person: {
    // ...
    friendOf: async (root) => {
      const friends = await User.find({
        friends: {
          $in: [root._id]
        } 
      })

      return friends
    }
  },
```

Ahora la aplicación funciona.

Inmediatamente podemos hacer consultas aún más complicadas. Es posible, por ejemplo, encontrar los amigos de todos los usuarios:

```js
query {
  allPersons {
    name
    friendOf {
      username
    }
  }
}
```

Sin embargo, hay un problema con nuestra solución, hace una cantidad irrazonable de consultas a la base de datos. Si registramos todas las consultas en la base de datos y tenemos 5 personas guardadas, vemos lo siguiente:

<pre>
Person.find
User.find
User.find
User.find
User.find
User.find
</pre>

Así que aunque principalmente hacen una consulta para todas las personas, cada persona genera una consulta más en su resolución.

Esta es una manifestación del famoso [n+1-problema](https://www.google.com/search?q=n%2B1+problem), que aparece de vez en cuando en diferentes contextos y, a veces, se cuela sobre los desarrolladores sin que se den cuenta.

Una buena solución para el problema n + 1 depende de la situación. A menudo, requiere el uso de algún tipo de consulta de combinación en lugar de varias consultas independientes.

En nuestra situación, la solución más fácil sería guardar la lista de amigos en la que se encuentran en cada objeto _Person_:

```js
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
    minlength: 5
  },
  // highlight-start
  friendOf: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ], 
  // highlight-end
})
```

Entonces podríamos hacer una "consulta de unión", o rellenar los campos _friendOf_ de personas cuando buscamos los objetos _Person_:

```js
Query: {
  allPersons: (root, args) => {    
    console.log('Person.find')
    if (!args.phone) {
      return Person.find({}).populate('friendOf') // highlight-line
    }

    return Person.find({ phone: { $exists: args.phone === 'YES' } })
      .populate('friendOf') // highlight-line
  },
  // ...
}
```

Después del cambio, no necesitaríamos un solucionador separado para el campo _friendOf_.

La consulta allPersons <i>no causa</i> un problema n + 1, si solo obtenemos el nombre y el número de teléfono:

```js
query {
  allPersons {
    name
    phone
  }
}
```

Si modificamos _allPersons_ para hacer una consulta de combinación porque a veces causa un problema n + 1, se vuelve más pesado cuando no necesitamos la información sobre personas relacionadas. Al usar el [cuarto parámetro](https://www.apollographql.com/docs/apollo-server/data/data/#resolver-type-signature) de las funciones de resolución, podríamos optimizar la consulta aún más. El cuarto parámetro se puede usar para inspeccionar la consulta en sí, por lo que podríamos realizar la consulta de combinación solo en casos con una amenaza predicha para un problema n + 1. Sin embargo, no deberíamos saltar a este nivel de optimización antes de estar seguros de que vale la pena.

[En palabras de Donald Knuth](https://en.wikiquote.org/wiki/Donald_Knuth):

> <i>Los programadores pierden una enorme cantidad de tiempo pensando o preocupándose por la velocidad de las partes no críticas de sus programas, y estos intentos de eficiencia en realidad tienen un fuerte impacto negativo cuando se consideran la depuración y el mantenimiento. Deberíamos olvidarnos de las pequeñas eficiencias, digamos alrededor del 97% del tiempo: <strong>la optimización prematura es la raíz de todos los males.</strong></i>

[DataLoader](https://github.com/facebook/dataloader) de Facebook ofrece una buena solución para el problema n + 1 entre otros problemas.
Más sobre el uso de DataLoader con el servidor Apollo [aquí] (https://www.robinwieruch.de/graphql-apollo-server-tutorial/#graphql-server-data-loader-caching-batching) y [aquí](http://www.petecorey.com/blog/2017/08/14/batching-graphql-queries-with-dataloader/).

### Epílogo

La aplicación que creamos en esta parte no está estructurada de manera óptima: el esquema, las consultas y las mutaciones deben al menos moverse fuera del código de la aplicación. En Internet se pueden encontrar ejemplos para una mejor estructuración de las aplicaciones GraphQL. Por ejemplo, para el servidor [aquí](https://blog.apollographql.com/modularizing-your-graphql-schema-code-d7f71d5ed5f2) y el cliente [aquí](https://medium.com/@peterpme/thoughts-on-structuring-your-apollo-queries-mutations-939ba4746cd8).

GraphQL ya es una tecnología bastante antigua, que ha sido utilizada por Facebook desde 2012, por lo que ya podemos verla como "probada en batalla". Desde que Facebook publicó GraphQL en 2015, poco a poco ha recibido más y más atención, y en un futuro cercano podría amenazar el dominio de REST. La muerte de REST también ha sido [predicha] (https://www.stridenyc.com/podcasts/52-is-2018-the-year-graphql-kills-rest). Aunque eso no sucederá todavía, GraphQL es absolutamente digno de [aprender] (https://blog.graphqleditor.com/javascript-predictions-for-2019-by-npm/).

</div>

<div class="tasks">

### Ejercicios 8.23.-8.26.

#### 8.23: Suscripciones - servidor

Realiza una implementación de backend para la suscripción _bookAdded_,

#### 8.24: Suscripciones - cliente, parte 1

Comience a usar suscripciones en el cliente y suscríbase a _bookAdded_. Cuando se agregan nuevos libros, notifique al usuario. Cualquier método funciona. Por ejemplo, puede utilizar la función [window.alert](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert).

#### 8.25: Suscripciones - cliente, parte 2

Mantenga actualizada la vista de la aplicación cuando el servidor notifique sobre nuevos libros. Puede probar su implementación abriendo la aplicación en dos pestañas del navegador y agregando un nuevo libro en una pestaña. Agregar el nuevo libro debería actualizar la vista en ambas pestañas.

#### 8.26: n + 1

Resuelve el problema n + 1 de la siguiente consulta usando cualquier método que te guste

```js
query {
  allAuthors {
    name 
    bookCount
  }
}
```

Este fue el último ejercicio de esta parte del curso y es hora de enviar tu código a GitHub y marcar todos tus ejercicios terminados en el [sistema de envío de ejercicios](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

</div>
