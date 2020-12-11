---
mainImage: ../../../images/part-8.svg
part: 8
letter: b
lang: es
---

<div class="content">

A continuación, implementaremos una aplicación React que usa el servidor GraphQL que creamos.

El código actual del servidor se puede encontrar en [Github](https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-3), rama <i>part8-3</i>.

En teoría, podríamos usar GraphQL con solicitudes HTTP POST. A continuación se muestra un ejemplo de esto con Postman.

![](../../images/8/8.png)

La comunicación funciona enviando solicitudes HTTP POST a http://localhost:4000/graphql. La consulta en sí es una cadena enviada como el valor de la clave <i>query</i>.

Podríamos encargarnos de la comunicación entre la aplicación React y GraphQl usando Axios. Sin embargo, la mayoría de las veces no es muy sensato hacerlo. Es una mejor idea utilizar una librería de orden superior capaz de abstraer los detalles innecesarios de la comunicación.

Por el momento hay dos buenas opciones: [Relay](https://facebook.github.io/relay/) por Facebook y [Apollo Client](https://www.apollographql.com/docs/react/). De estos dos, Apollo es absolutamente más popular, y también lo usaremos.

### cliente Apollo

<!-- Käytetään kurssilla Apollo Client en versiota [3.0-beta] (https://www.apollographql.com/docs/react/v3.0-beta/), tällä hetkellä (20.2.2020) uusin virallisesti julkaisatu versio el 2.6 . eli kun luet dokumentaatiota, muista vaihtaa näytettävän dokumentaation versio vastaamaan 3.0 betaa: -->
En este curso usaremos la versión [3.0-beta](https://www.apollographql.com/docs/react/v3.0-beta/) de Apollo Client.
Por el momento (20.2.2020) 2.6 es la última versión lanzada oficialmente, así que cuando esté leyendo la documentación recuerde seleccionar la documentación de 3.0 beta:

![](../../images/8/40ea.png)

Cree una nueva aplicación React e instale las dependencias requeridas por [Apollo client](https://www.apollographql.com/docs/react/v3.0-beta/get-started/#installation).

<!-- Luodaan uusi React-sovellus ja asennetaan siihen [Apollo clientin] (https://www.apollographql.com/docs/react/get-started/#installation) vaatimat riippuvuudet. -->
Crearemos una nueva aplicación React e instalaremos las dependencias requeridas por [Apollo client](https://www.apollographql.com/docs/react/get-started/#installation).

```bash
npm install @apollo/client graphql
```

Comenzaremos con el siguiente código para nuestra aplicación.

```js
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import { ApolloClient, HttpLink, InMemoryCache, gql } from '@apollo/client'

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:4000',
  })
})

const query = gql`
query {
  allPersons  {
    name,
    phone,
    address {
      street,
      city
    }
    id
  }
}
`

client.query({ query })
  .then((response) => {
    console.log(response.data)
  })

ReactDOM.render(<App />, document.getElementById('root'))
```

El comienzo del código crea un nuevo objeto-[client](https://www.apollographql.com/docs/react/v3.0-beta/get-started/#create-a-client), que luego se usa para enviar una consulta al servidor:

```js
client.query({ query })
  .then((response) => {
    console.log(response.data)
  })
```

La respuesta del servidor se imprime en la consola:

![](../../images/8/9a.png)

La aplicación puede comunicarse con un servidor GraphQL usando el objeto _client_. Se puede hacer que el cliente sea accesible para todos los componentes de la aplicación empaquetando el componente <i>App</i> con [ApolloProvider](https://www.apollographql.com/docs/react/v3.0-beta/get-started/#connect-your-client-to-react).

```js
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import { 
  ApolloClient, ApolloProvider, HttpLink, InMemoryCache // highlight-line
} from '@apollo/client' 

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:4000',
  })
})

ReactDOM.render(
  <ApolloProvider client={client}> // highlight-line
    <App />
  </ApolloProvider>, // highlight-line
  document.getElementById('root')
)
```
### Realización de consultas

Estamos listos para implementar la vista principal de la aplicación, que muestra una lista de números de teléfono.

<!-- Apollo Client tarjoaa muutaman vaihtoehtoisen tavan [kyselyjen] (https://www.apollographql.com/docs/react/v3.0-beta/data/queries/) tekemiselle. Tämän hetken vallitseva käytäntö en hook-funktion [useQuery] (https://www.apollographql.com/docs/react/v3.0-beta/api/react/hooks/#usequery) käyttäminen. -->
Apollo Client ofrece algunas alternativas para realizar [consultas](https://www.apollographql.com/docs/react/v3.0-beta/data/queries/).
Actualmente, el uso de la función hook [useQuery](https://www.apollographql.com/docs/react/v3.0-beta/api/react/hooks/#usequery) es la práctica dominante.

<!-- Kyselyn tekevän komponentin <i> App </i> koodi näyttää seuraavalta: -->
La consulta la realiza el componente <i>App</i>, cuyo código es el siguiente:

```js
import React from 'react'
import { gql, useQuery } from '@apollo/client';

const ALL_PERSONS = gql`
query {
  allPersons  {
    name
    phone
    id
  }
}
`

const App = () => {
  const result = useQuery(ALL_PERSONS)

  if (result.loading)  {
    return <div>loading...</div>
  }

  return (
    <div>
      {result.data.allPersons.map(p => p.name).join(', ')}
    </div>
  )
}

export default App
```

<!-- Hook-funktion _useQuery_ kutsuminen suorittaa parametrina annetun kyselyn. Hookin kutsuminen palauttaa olion, joka -->
<!-- jolla en [useita kenttiä] (https://www.apollographql.com/docs/react/v3.0-beta/api/react/hooks/#result). Kenttä <i> cargando </i> en arvoltaan tosi, jos kyselyyn ei ole saatu vielä vastausta. Tässä tilanteessa renderöitävä koodi on -->
Cuando se llama, _useQuery_ realiza la consulta que recibe como parámetro.
Devuelve un objeto con varios [campos](https://www.apollographql.com/docs/react/v3.0-beta/api/react/hooks/#result).
El campo <i>loading</i> es verdadero si la consulta aún no ha recibido una respuesta.
Luego se renderiza el siguiente código:

```js
if ( result.loading ) {
  return <div>loading...</div>
}
```

<!-- Kun tulos on valmis, otetaan tuloksen kentästä <i> datos </i> kyselyn <i> allPersons </i> vastaus ja renderöidään luettelossa olevat nimet ruudulle. -->
Cuando se recibe la respuesta, el resultado de la consulta <i>allPersons</i> se puede encontrar en el campo <i>data</i>, y podemos mostrar la lista de nombres en la pantalla.

```js
<div>
  {result.data.allPersons.map(p => p.name).join(', ')}
</div>
```

<!-- Eriytetään henkilöiden näyttäminen omaan komponenttiin -->
Separemos la visualización de la lista de personas en su propio componente

```js
const Persons = ({ persons }) => {
  return (
    <div>
      <h2>Persons</h2>
      {persons.map(p =>
        <div key={p.name}>
          {p.name} {p.phone}
        </div>  
      )}
    </div>
  )
}
```

<!-- Komponentti _App_ siis hoitaa edelleen kyselyn ja välittää tuloksen uuden komponentin renderöitäväksi: -->
El componente _App_ aún realiza la consulta y pasa el resultado al nuevo componente que se va a representar:

```js
const App = () => {
  const result = useQuery(ALL_PERSONS)

  if (result.loading)  {
    return <div>loading...</div>
  }

  return (
    <Persons persons = {result.data.allPersons}/>
  )
}
```

### Consultas y variables con nombre

Implementemos la funcionalidad para ver los detalles de la dirección de una persona. La consulta <i>findPerson</i> es adecuada para esto.

Las consultas que hicimos en el último capítulo tenían el parámetro codificado en la consulta:

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

Cuando hacemos consultas programáticamente, debemos ser capaz de darles parámetros dinámicamente.

Las [variables](https://graphql.org/learn/queries/#variables) GraphQL son muy adecuadas para esto. Para poder utilizar variables, también debemos nombrar nuestras consultas.

<!-- Sopiva muoto kyselylle en seuraava: -->
Un buen formato para la consulta es este:

```js
query findPersonByName($nameToSearch: String!) {
  findPerson(name: $nameToSearch) {
    name
    phone 
    address {
      street
      city
    }
  }
}
```

El nombre de la consulta es <i>findPersonByName</i>, y se le da una cadena <i>$nameToSearch</i> como parámetro.

También es posible realizar consultas con parámetros con GraphQL Playground. Los parámetros se dan en <i>Variables de consulta</i>:

![](../../images/8/10.png)

<!-- Pregunte käyttämämme _useQuery_ toimii hyvin tilanteissa, joissa kysely sobre tarkoitus suorittaa heti komponentin renderöinnin yhteydessä. Nyt kuitenkin haluamme tehdä kyselyn vasta siinä vaiheessa kun käyttäjä haluaa nähdä jonkin henkilön tiedot, eli kysely tehdään vasta [sitä tarvittaessa] (https://www.apollographql.com/docs.0-queries/#v3ta ejecutar consultas manualmente). -->
El hook _useQuery_ es adecuado para situaciones en las que la consulta se realiza cuando se procesa el componente.
Sin embargo, ahora queremos realizar la consulta solo cuando un usuario desea ver los detalles de una persona específica, por lo que la consulta se realiza solo [según sea necesario](https://www.apollographql.com/docs/react/v3.0-beta/data/queries/#executing-queries-manually).

<!-- Tähän tilanteeseen sopii hook-funktio [useLazyQuery] (https://www.apollographql.com/docs/react/v3.0-beta/api/react/hooks/#uselazyquery). Komponentti <i> Personas </i> muuttuu seuraavasti: -->
Para esta situación, la función hook [useLazyQuery](https://www.apollographql.com/docs/react/v3.0-beta/api/react/hooks/#uselazyquery) es una buena opción.
El componente <i>Persons</i> se convierte en:

```js
// highlight-start
const FIND_PERSON = gql`
  query findPersonByName($nameToSearch: String!) {
    findPerson(name: $nameToSearch) {
      name
      phone 
      id
      address {
        street
        city
      }
    }
  }
`
// highlight-end

const Persons = ({ persons }) => {
  // highlight-start
  const [getPerson, result] = useLazyQuery(FIND_PERSON) 
  const [person, setPerson] = useState(null)
// highlight-end

// highlight-start
  const showPerson = (name) => {
    getPerson({ variables: { nameToSearch: name } })
  }
  // highlight-end

// highlight-start
  useEffect(() => {
    if (result.data) {
      setPerson(result.data.findPerson)
    }
  }, [result])
  // highlight-end

// highlight-start
  if (person) {
    return(
      <div>
        <h2>{person.name}</h2>
        <div>{person.address.street} {person.address.city}</div>
        <div>{person.phone}</div>
        <button onClick={() => setPerson(null)}>close</button>
      </div>
    )
  }
  // highlight-end
  
  return (
    <div>
      <h2>Persons</h2>
      {persons.map(p =>
        <div key={p.name}>
          {p.name} {p.phone}
          // highlight-start
          <button onClick={() => showPerson(p.name)} >
            show address
          </button> 
          // highlight-end
        </div>  
      )}
    </div>
  )
}

export default Persons
```

<!-- Koodi en kasvanut paljon, ja kaikki lisäykset eivät ole täysin ilmeisiä. -->
El código ha cambiado bastante y todos los cambios no son completamente evidentes.

<!-- Jos henkilön yhteydessä olevaa nappia painetaan, suoritetaan klikkauksenkäsittelijä _showPerson_, joka tekee GraphQL-kyselyn henkilön tiedoista: -->
Cuando se hace clic en el botón "show address" de una persona, se hace clic en el controlador de eventos
_showPerson_, y realiza una consulta GraphQL para obtener los detalles de las personas:

```js
const [getPerson, result] = useLazyQuery(FIND_PERSON) 

// ...

const showPerson = (name) => {
  getPerson({ variables: { nameToSearch: name } })
}
```

<!-- Kyselyn muuttujalle _nameToSearch_ määritellään arvo kutsuttaessa. -->
La variable _nameToSearch_ de la consulta recibe un valor cuando se ejecuta la consulta.

<!-- Kyselyn vastaus tulee muuttujaan _result_, ja ​​sen arvo sijoitetaan komponentin tilan muutujaan _person_. Sijoitus tehdään _useEffect_-hookissa: -->
La respuesta de la consulta se guarda en la variable _result_, y su valor se guarda en el estado del componente _person_ en el hook _useEffect_.

```js
useEffect(() => {
  if (result.data) {
    setPerson(result.data.findPerson)
  }
}, [result])
```

<!-- Hookin toisena parametrina en _result.data_, tämä saa aikaan sen, että hookin ensimmäisenä parametrina oleva funktio suoritetaan <i> aina kun kyselyssä haetaan uuden henkilön tiedot </i>. Jos päivitystä ei hoidettaisi kontrolloidusti hookissa, seuraisi ongelmia sen jälkeen kun yksittäisen henkilön näkymästä palataan kaikkien henkilöiden näkymään. -->
El segundo parámetro del hook es _result_, por lo que la función dada al hook como su segundo parámetro se ejecuta <i>cada vez que la consulta obtiene los detalles de una persona diferente</i>.
¿No manejaríamos la actualización de una manera controlada en un hook, volver de la vista de una sola persona a una lista de todas las personas causaría problemas?

Si el estado _person_ tiene un valor, en lugar de mostrar una lista de todas las personas, solo se muestran los detalles de una persona.

![](../../images/8/11.png)

<!-- Yksittäisen henkilön näkymästä palataan kaikkien henkilöiden näkymään sijoittamalla tilan muuttujan _person_ arvoksi _null_. -->
Cuando un usuario quiere volver a la lista de personas, el estado _person_ se establece en _null_.

La solución no es la más ordenada posible, pero es lo suficientemente buena para nosotros.

El código actual de la aplicación se puede encontrar en [Github](https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-1) branch <i>part8-1</i>.

### Caché

Cuando hacemos varias consultas, por ejemplo, los detalles de la dirección de Arto Hellas, notamos algo interesante: la consulta al backend se realiza solo la primera vez. Después de esto, a pesar de que el código vuelve a realizar la misma consulta, la consulta no se envía al backend.

![](../../images/8/12.png)

El cliente Apollo guarda las respuestas de las consultas en [cache](https://www.apollographql.com/docs/react/v3.0-beta/caching/cache-configuration/). Para optimizar el rendimiento si la respuesta a una consulta ya está en la caché, la consulta no se envía al servidor en absoluto.

Es posible instalar [Apollo Client devtools](https://chrome.google.com/webstore/detail/apollo-client-developer-t/jdkknkkbebbapilgoeccciglkfbmbnfm/related) en Chrome para ver el estado de la caché.

![](../../images/8/13a.png)

Los datos en la caché están organizados por consulta. Debido a que los objetos <i>Person</i> tienen un campo de identificación <i>id</i> que es de tipo <i>ID</i>, si el mismo objeto es devuelto por múltiples consultas, Apollo puede combinarlos en uno.
Debido a esto, al hacer consultas <i>findPerson</i> para los detalles de la dirección de Arto Hellas, se actualizaron los detalles de la dirección también para la consulta <i>allPersons</i>.

### Haciendo mutaciones

Implementemos la funcionalidad para agregar nuevas personas.

En el capítulo anterior codificamos los parámetros de las mutaciones. Ahora necesitamos una versión de la mutación addPerson que usa [variables](https://graphql.org/learn/queries/#variables):

```js
const CREATE_PERSON = gql`
mutation createPerson($name: String!, $street: String!, $city: String!, $phone: String) {
  addPerson(
    name: $name,
    street: $street,
    city: $city,
    phone: $phone
  ) {
    name
    phone
    id
    address {
      street
      city
    }
  }
}
`
```

<!-- Mutaatioiden tekemiseen sopivan toiminnallisuuden tarjoaa hook-funktio [useMutation] (https://www.apollographql.com/docs/react/v3.0-beta/api/ react / hooks / # usemutation). -->
La función hook [useMutation](https://www.apollographql.com/docs/react/v3.0-beta/api/react/hooks/#usemutation) proporciona la funcionalidad para realizar mutaciones.

<!-- Tehdään sovellukseen uusi komponentti uuden henkilön lisämiseen: --> 
Creemos un nuevo componente para agregar una nueva persona al directorio:

```js
import React, { useState } from 'react'
import { gql, useMutation } from '@apollo/client'

const CREATE_PERSON = gql`
  // ...
`

const PersonForm = () => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')

  const [ createPerson ] = useMutation(CREATE_PERSON) // highlight-line

  const submit = (event) => {
    event.preventDefault()

    // highlight-start
    createPerson({  variables: { name, phone, street, city } })
    // highlight-end

    setName('')
    setPhone('')
    setStreet('')
    setCity('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={submit}>
        <div>
          name <input value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          phone <input value={phone}
            onChange={({ target }) => setPhone(target.value)}
          />
        </div>
        <div>
          street <input value={street}
            onChange={({ target }) => setStreet(target.value)}
          />
        </div>
        <div>
          city <input value={city}
            onChange={({ target }) => setCity(target.value)}
          />
        </div>
        <button type='submit'>add!</button>
      </form>
    </div>
  )
}

export default PersonForm
```

<!-- Lomakkeen koodi en suoraviivainen, mielenkiintoiset rivit en korostettu. Mutación suorittava funktio saadaan luotua _useMutation_-hookin avulla. Hook palauttaa kyselyfunktion <i> taulukon </i> ensimmäisenä alkiona: -->
El código del formulario es sencillo y las líneas interesantes se han resaltado.
Podemos definir la función de mutación usando el hook-_useMutation_.
El hook devuelve una <i>matriz</i>, cuyo primer elemento contiene el resultado de la mutación.

```js
const [ createPerson ] = useMutation(CREATE_PERSON)
```

<!-- Kyselyä tehtäessä määritellään kyselyn muuttujille arvot: -->
Las variables de consulta reciben valores cuando se realiza la consulta:

```js
createPerson({  variables: { name, phone, street, city } })
```

Se agregan nuevas personas sin problemas, pero la pantalla no se actualiza. La razón es que Apollo Client no puede actualizar automáticamente el caché de una aplicación, por lo que aún contiene el estado anterior a la mutación.
Podríamos actualizar la pantalla recargando la página, ya que la caché se vacía cuando se recarga la página. Sin embargo, debe haber una mejor manera de hacer esto.

### Actualizando la caché

Hay pocas soluciones diferentes para esto. Una forma es hacer la consulta para todas las personas [poll](https://www.apollographql.com/docs/react/v3.0-beta/data/queries/#polling) en el servidor, o hacer la consulta repetidamente.

El cambio es pequeño. Configuremos la consulta para sondear cada dos segundos:

```js
const App = () => {
  const result = useQuery(ALL_PERSONS, {
    pollInterval: 2000 // highlight-line
  })

  if (result.loading)  {
    return <div>loading...</div>
  }

  return (
    <div>
      <Persons persons = {result.data.allPersons}/>
      <PersonForm />
    </div>
  )
}

export default App
```

La solución es simple, y cada vez que un usuario agrega una nueva persona, aparece inmediatamente en las pantallas de todos los usuarios.

El lado malo de la solución es todo el tráfico web inútil.

<!-- Toinen helppo tapa välimuistin synkronoimiseen en määritellä _useMutation_-hookin option [refetchQueries] (https://www.apollographql.com/docs/react/v3.0-beta/api/react/hooks/#params-2) avulla, että kaikki henkilöt hakeva kysely tulee suorittaa mutaation yhteydessä uudelleen: -->
Otra manera fácil de mantener la caché sincronizada es usar el hook de _useMutation_, el parámetro [refetchQueries](https://www.apollographql.com/docs/react/v3.0-beta/api/react/hooks/#params-2) para definir que la consulta que busca a todas las personas se realice nuevamente cada vez que se cree una nueva persona.

```js
const ALL_PERSONS = gql`
  query  {
    allPersons  {
      name
      phone
      id
    }
  }
`

const PersonForm = (props) => {
  // ...

  const [ createPerson ] = useMutation(CREATE_PERSON, {
    refetchQueries: [ { query: ALL_PERSONS } ] // highlight-line
  })
```

Los pros y los contras de esta solución son casi opuestos a los anteriores. No hay tráfico web extra, porque las consultas no se hacen por si acaso. Sin embargo, si un usuario actualiza ahora el estado del servidor, los cambios no se muestran a otros usuarios inmediatamente.

Hay otras formas de actualizar la caché. Más sobre estos más adelante en esta parte.

<!-- Sovellukseen en tällä hetkellä määritelty kyselyjä komponenttien koodin sekaan. Eriytetään kyselyjen määrittely omaan tiedostoonsa <i> queries.js </i>: -->
Por el momento, en nuestro código, las consultas y el componente están definidos en el mismo lugar.
Separemos las definiciones de consulta en su propio archivo <i>queries.js</i>:

```js 
import { gql  } from '@apollo/client'

export const ALL_PERSONS = gql`
  query {
    // ...
  }
`
export const FIND_PERSON = gql`
  query findPersonByName($nameToSearch: String!) {
    // ...
  }
`

export const CREATE_PERSON = gql`
  mutation createPerson($name: String!, $street: String!, $city: String!, $phone: String) {
    // ...
  }
`
```

<!-- Jokainen komponentti importtaa tarvitsemansa kyselyt: -->
Luego, cada componente importa las consultas que necesita:

```js 
import { ALL_PERSONS } from './queries'

const App = () => {
  const result = useQuery(ALL_PERSONS)
  // ...
}
```

El código actual de la aplicación se puede encontrar en [Github](https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-2) branch <i>part8-2</i>.

#### Manejo de errores de mutación

<!-- Jos yritämme luoda epävalidia henkilöä, seurauksena en poikkeus ja koko sovellus hajoaa -->
Intentar crear una persona con datos no válidos provoca un error y toda la aplicación se rompe

![](../../images/8/14ea.png)

<!-- Poikkeus on syytä käsitellä. _useMutation_-hookin [opción] (https://www.apollographql.com/docs/react/v3.0-beta/api/react/hooks/#params-2) _onError_ avulla en mahdollista rekisteröidä mutaatioille virheenkäsittelijäfunktio. -->
Debemos manejar la excepción. Podemos registrar una función de manejo de errores en la mutación usando _onError_ del hook _useMutation_ [opción](https://www.apollographql.com/docs/react/v3.0-beta/api/react/hooks/#params-2).

<!-- Rekisteröidään mutaatiolle virheidenkäsittelijä, joka asettaa virheestä kertovan viestin propsina saaman funktion _setError_ avulla: -->
Registremos la mutación en un controlador de errores, que usa la función _setError_ que recibe como parámetro para establecer un mensaje de error:

```js
const PersonForm = ({ setError }) => {
  // ... 

  const [ createPerson ] = useMutation(CREATE_PERSON, {
    refetchQueries: [  {query: ALL_PERSONS } ],
    // highlight-start
    onError: (error) => {
      setError(error.graphQLErrors[0].message)
    }
    // highlight-end
  })

  // ...
}
```

<!-- Renderlöidään mahdollinen virheilmoitus näytölle -->
Entonces podemos mostrar el mensaje de error en la pantalla según sea necesario

```js
const App = () => {
  const [errorMessage, setErrorMessage] = useState(null) // highlight-line

  const result = useQuery(ALL_PERSONS)

  if (result.loading)  {
    return <div>loading...</div>
  }

// highlight-start
  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }
  // highlight-end

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <Persons persons = {result.data.allPersons} />
      <PersonForm setError={notify} />
    </div>
  )
}

// highlight-start
const Notify = ({errorMessage}) => {
  if ( !errorMessage ) {
    return null
  }

  return (
    <div style={{color: 'red'}}>
    {errorMessage}
    </div>
  )
}
// highlight-end
```

Ahora se informa al usuario sobre un error con una simple notificación.

![](../../images/8/15.png)

El código actual de la aplicación se puede encontrar en [Github](https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-3) rama <i>part8-3</i>.

### Actualización de un número de teléfono

Agreguemos la posibilidad de cambiar los números de teléfono de las personas a nuestra aplicación. La solución es casi idéntica a la que usamos para agregar nuevas personas.

Nuevamente, la mutación requiere parámetros.

```js
export const EDIT_NUMBER = gql`
  mutation editNumber($name: String!, $phone: String!) {
    editNumber(name: $name, phone: $phone)  {
      name
      phone
      address {
        street
        city
      }
      id
    }
  }
`
```

El componente <i>PhoneForm</i> responsable del cambio es sencillo. El formulario tiene campos para el nombre de la persona y el nuevo número de teléfono, y llama a la función _changeNumber_. La función se realiza mediante el hook _useMutation_.
Se han resaltado líneas interesantes en el código.

```js
import React, { useState } from 'react'
import { useMutation } from '@apollo/client'

import { EDIT_NUMBER } from '../queries'

const PhoneForm = () => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

// highlight-start
  const [ changeNumber ] = useMutation(EDIT_NUMBER)
// highlight-end

  const submit = (event) => {
    event.preventDefault()

// highlight-start
    changeNumber({ variables: { name, phone } })
    // highlight-end

    setName('')
    setPhone('')
  }

  return (
    <div>
      <h2>change number</h2>

      <form onSubmit={submit}>
        <div>
          name <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          phone <input
            value={phone}
            onChange={({ target }) => setPhone(target.value)}
          />
        </div>
        <button type='submit'>change number</button>
      </form>
    </div>
  )
}

export default PhoneForm
```

Parece sombrío, pero funciona:

![](../../images/8/22a.png)

<!-- Kun numero muutetaan, päivittyy se hieman yllättäen automaattisesti komponentin <i> Personas </i> renderöimään nimien ja numeroiden listaan. Tämä johtuu siitä, että koska henkilöillä en identifioiva, tyyppiä <i> ID </i> oleva kenttä, päivittyy henkilö välimuistissa uusilla tiedoilla päivitysoperaation yhteydessä. -->
Sorprendentemente, cuando se cambia el número de una persona, el nuevo número aparece automáticamente en la lista de personas generada por el componente <i>Persons</i>.
Esto sucede porque cada persona tiene un campo de identificación de tipo <i>ID</i>, por lo que los datos de la persona guardados en la caché se actualizan automáticamente cuando se modifican con la mutación.

El código actual de la aplicación se puede encontrar en [Github](https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-4) branch <i>part8-4</i>.

<!-- Sovelluksessa sobre vielä pieni ongelma. Jos yritämme vaihtaa olemattomaan nimeen liittyvän puhelinnumeron, ei mitään näytä tapahtuvan. Syynä tälle on se, että jos nimeä vastaavaa henkilöä ei löydy, vastataan kyselyyn <i> null </i>: -->
Nuestra aplicación todavía tiene un pequeño defecto. Si intentamos cambiar el número de teléfono por un nombre que no existe, parece que no pasa nada.
Esto sucede porque si no se puede encontrar una persona con el nombre de pila, la respuesta de mutación es <i>nula</i>:

![](../../images/8/23ea.png)

<!-- Koska kyseessä ei ole GraphQL: n kannalta virhetilanne, ei _onError_-virheenkäsittelijän rekisteröimisestä tässä tilanteessa hyötyä. -->
Para GraphQL esto no es un error, por lo que registrar un controlador de errores _onError_ no es útil.

<!-- Voimme generoida virheilmoituksen _useMutation_-hookin toisena parametrina palauttaman mutacion tuloksen kertovan olion _result_ avulla. -->
Podemos usar el campo _result_ devuelto por el hook _useMutation_ como su segundo parámetro para generar un mensaje de error.

```js 
const PhoneForm = ({ setError }) => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  const [ changeNumber, result ] = useMutation(EDIT_NUMBER) // highlight-line

  const submit = (event) => {
    // ...
  }

  // highlight-start
  useEffect(() => {
    if (result.data && result.data.editNumber === null) {
      setError('person not found')
    }

  }, [result.data])
  // highlight-end

  // ...
}
```

<!-- Jos henkilöä ei löytynt, eli kyselyn tulos _result.data.editNumber_ on _null_, asettaa komponentti propseina saamansa callback -funktion avulla sopivan virheilmoituksen. Virheilmoituksen asettamista kontrolloidaan jälleen useEffect-hookin avulla, eli virheviesti halutaan asetaa ainoastaan ​​jos mutaation tulos _result.data_ muuttuu. -->
Si no se puede encontrar a una persona, o el _result.data.editNumber_ es _null_, el componente usa la función de devolución de llamada que recibió como props para establecer un mensaje de error adecuado.
Queremos configurar el mensaje de error solo cuando el resultado de la mutación _result.data_ cambie, por lo que usamos el hook useEffect para controlar la configuración del mensaje de error.

<!-- useEffect aiheuttaa ESLint-virheilmoituksen: -->
El uso de useEffect provoca una advertencia de ESLint:

![](../../images/8/41ea.png)

<!-- Varoitus en aiheeton, ja pääsemme helpoimmalla ignoroimalla ESLint-säännön riviltä: -->
La advertencia no tiene sentido y la solución más fácil es ignorar la regla ESLint en la línea:

```js
useEffect(() => {
  if (result.data && !result.data.editNumber) {
    setError('name not found')
  }
// highlight-start  
}, [result.data])  // eslint-disable-line 
// highlight-end
```

<!-- Voisimme yrittää päästä varoituksesta eroon lisäämällä función _notify_ useEffectin toisena parametrina olevaan taulukkoon: -->
Podríamos intentar deshacernos de la advertencia agregando la función _setError_ al segundo arreglo de parámetros de useEffect:

```js
useEffect(() => {
  if (result.data && !result.data.editNumber) {
    setError('name not found')
  }
// highlight-start  
}, [result.data, setError])
// highlight-end
```

<!-- Tämä ratkaisu ei kuitenkaan toimi, ellei _notify_-funktiota ole määritelty [useCallback] (https://reactjs.org/docs/hooks-reference.html#usecallback) -funktioon käärittynä. Jos näin ei tehdä, seurauksena en ikuinen luuppi, sillä aina kun komponentti _App_ renderöidään uudelleen notifikaation poistamisen jälkeen, syntyy <i> uusi versio </i> funktiosta _notify_ ja se taas aiheunkastionaituauden ... -->
Sin embargo, esta solución no funciona si la función _notify_ no está envuelta en una función [useCallback](https://reactjs.org/docs/hooks-reference.html#usecallback). Si no es así, el resultado es un bucle sin fin. Cuando el componente _App_ se rerenderiza después de haber retirado una notificación, un <i>nueva versión</ i> de _notify_ se crea lo que hace que la función de efectos que se ejecute lo que provoca una nueva notificación y así sucesivamente una así sucesivamente...

El código actual de la aplicación se puede encontrar en [Github](https://github.com/fullstack-hy2020/graphql-phonebook-frontend/tree/part8-5) branch <i>part8-5</i>.

### Apollo Client y el estado de las aplicaciones

En nuestro ejemplo, la administración del estado de las aplicaciones se ha convertido principalmente en responsabilidad de Apollo Client.
Nuestro ejemplo usa el estado de los componentes de React solo para administrar el estado de un formulario y mostrar notificaciones de error. Cuando se usa GraphQL, puede ser que no haya más razones justificables para mover la administración del estado de las aplicaciones a Redux.

Cuando sea necesario, Apollo permite guardar el estado local de las aplicaciones en [Apollo cache](https://www.apollographql.com/docs/react/local-state/local-state-management/).

</div>

<div class="tasks">

### Ejercicios 8.8.-8.12.

A través de estos ejercicios, implementaremos una interfaz para la librería GraphQL.

Tome [este proyecto](https://github.com/fullstack-hy2020/library-frontend) para comenzar su aplicación.

Puede implementar su aplicación usando los componentes de apoyo de renderizado <i>Query</i> y <i>Mutation</i> del Apollo Client, o usando los ganchos proporcionados por Apollo Client 3.0 versión beta.

#### 8.8: Vista de autores

Implemente una vista de Autores para mostrar los detalles de todos los autores en una página de la siguiente manera:

![](../../images/8/16.png)

#### 8.9: Vista de Libros

Implemente una vista de Libros para mostrar en una página todos los demás detalles de todos los libros, excepto sus géneros.

![](../../images/8/17.png)

#### 8.10: Agregar un libro

Implemente la posibilidad de agregar nuevos libros a su aplicación. La funcionalidad puede verse así:

![](../../images/8/18.png)

Asegúrese de que las vistas de Autores y Libros se mantengan actualizadas después de agregar un nuevo libro.

En caso de problemas al realizar consultas o mutaciones, verifique desde la consola del desarrollador cuál es la respuesta del servidor:

![](../../images/8/42ea.png)

#### 8.11: Año de nacimiento del autor

Implementar una posibilidad para establecer el año de nacimiento de los autores. Puede crear una nueva vista para configurar el año de nacimiento o colocarla en la vista Autores:

![](../../images/8/20.png)

Asegúrese de que la vista Autores se mantenga actualizada después de establecer un año de nacimiento.

#### 8.12: Año de nacimiento del autor avanzado

Cambie el formulario del año de nacimiento para que solo se pueda establecer un año de nacimiento para un autor existente. Utilice la biblioteca [select-tag](https://reactjs.org/docs/forms.html#the-select-tag), [react-select](https://github.com/JedWatson/react-select) o algún otro mecanismo.

Una solución con la librería react-select tiene el siguiente aspecto:

![](../../images/8/21.png)

</div>
