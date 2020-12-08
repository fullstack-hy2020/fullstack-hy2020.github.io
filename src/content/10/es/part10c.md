---
mainImage: ../../../images/part-10.svg
part: 10
letter: c
lang: en
---

<div class="content">

Hasta ahora hemos implementado funciones en nuestra aplicación sin ninguna comunicación real con el servidor. Por ejemplo, la lista de repositorios revisados ​​que hemos implementado utiliza datos simulados y el formulario de inicio de sesión no envía las credenciales del usuario a ningún endpoint de autorización. En esta sección, aprenderemos cómo comunicarnos con un servidor mediante solicitudes HTTP, cómo usar Apollo Client en una aplicación React Native y cómo almacenar datos en el dispositivo del usuario.

Pronto aprenderemos a comunicarnos con un servidor en nuestra aplicación. Antes de llegar a eso, necesitamos un servidor con el que comunicarnos. Para ello, tenemos una implementación de servidor completa en el repositorio [rate-repository-api](https://github.com/fullstack-hy2020/rate-repository-api). El servidor rate-repository-api satisface todas las necesidades de API de nuestra aplicación durante esta parte. Utiliza la base de datos [SQLite](https://www.sqlite.org/index.html) que no necesita ninguna configuración y proporciona una API Apollo GraphQL junto con algunos endpoints de la API REST.

Antes de profundizar más en el material, configure el servidor rate-repository-api siguiendo las instrucciones de configuración en el [README](https://github.com/fullstack-hy2020/rate-repository-api/blob/master/README.md) del repositorio . Tenga en cuenta que si está utilizando un emulador para el desarrollo, se recomienda ejecutar el servidor y el emulador <i>en la misma computadora</i>. Esto facilita considerablemente las solicitudes de red.

### solicitudes HTTP

React Native proporciona [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) para realizar solicitudes HTTP en nuestras aplicaciones. React Native también es compatible con la antigua [API XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) que hace posible el uso de bibliotecas de terceros como [Axios](https://github.com/axios/axios). Estas API son las mismas que las del entorno del navegador y están disponibles globalmente sin necesidad de importarlas.

Las personas que han utilizado tanto la API Fetch como la API XMLHttpRequest probablemente estén de acuerdo en que la API Fetch es más fácil de usar y más moderna. Sin embargo, esto no significa que XMLHttpRequest API no tenga sus usos. En aras de la simplicidad, solo usaremos la API Fetch en nuestros ejemplos.

El envío de solicitudes HTTP mediante la API Fetch se puede realizar mediante la función <em>fetch</em>. El primer argumento de la función es la URL del recurso:

```javascript
fetch('https://my-api.com/get-end-point');
```

El método de solicitud predeterminado es <i>GET</i>. El segundo argumento de la función <em>fetch</em> es un objeto de opciones, que puede utilizar, por ejemplo, para especificar un método de solicitud diferente, encabezados de solicitud o cuerpo de solicitud:

```javascript
fetch('https://my-api.com/post-end-point', {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    firstParam: 'firstValue',
    secondParam: 'secondValue',
  }),
});
```

Tenga en cuenta que estas URL están inventadas y (lo más probable) no enviarán una respuesta a sus solicitudes. En comparación con Axios, la API Fetch opera en un nivel un poco más bajo. Por ejemplo, no hay ninguna serialización ni análisis del cuerpo de solicitud o respuesta. Esto significa que, por ejemplo, debe configurar el encabezado <i>Content-Type</i> usted mismo y usar el método <em>JSON.stringify</em> para serializar el cuerpo de la solicitud.

La función <em>fetch</em> devuelve una promesa que resuelve un objeto [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response). Tenga en cuenta que los códigos de estado de error como 400 y 500 <i>no se rechazan</i> como, por ejemplo, en Axios. En el caso de una respuesta con formato JSON, podemos analizar el cuerpo de la respuesta utilizando el método <em>Response.json</em>:

```javascript
const fetchMovies = async () => {
  const response = await fetch('https://reactnative.dev/movies.json');
  const json = await response.json();

  return json;
};
```

Para una introducción más detallada a la API de Fetch, lea el artículo [Using Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) en los documentos web de MDN.

A continuación, probemos la API Fetch en la práctica. El servidor rate-repository-api proporciona un punto final para devolver una lista paginada de repositorios revisados. Una vez que el servidor se esté ejecutando, debería poder acceder al endpoint en [http://localhost:5000/api/repositories](http://localhost:5000/api/repositories). Los datos están paginados en un [formato de paginación basado en cursor](https://graphql.org/learn/pagination/) común. Los datos reales del repositorio están detrás de la clave <i>node</i> en la matriz <i>edges</i>.

Desafortunadamente, no podemos acceder al servidor directamente en nuestra aplicación usando la URL <i>http://localhost:5000/api/repositories</i>. Para realizar una solicitud a este endpoint en nuestra aplicación, necesitamos acceder al servidor usando su dirección IP en su red local. Para saber cuál es, abra las herramientas de desarrollo de Expo ejecutando <em>npm start</em>. En las herramientas de desarrollo, debería poder ver una URL que comience con <i>exp://</i> encima del código QR:

![Development tools](../../images/10/10.png)

Copie la dirección IP entre <i>exp://</i> y <i>:</i>, que en este ejemplo es <i>192.168.100.16</i>. Construya una URL en formato <i>http://<IP_ADDRESS>:5000/api/repositories </i> y ábrala en el navegador.

Ahora que conocemos la URL del endpoint, usemos los datos reales proporcionados por el servidor en nuestra lista de repositorios revisados. Actualmente estamos usando datos simulados almacenados en la variable <em>repositories</em>. Elimine la variable <em>repositories</em> y reemplace el uso de los datos simulados con este fragmento de código en el archivo <i>RepositoryList.jsx</i> en el directorio <i>components</i>:

```javascript
import React, { useState, useEffect } from 'react';
// ...

const RepositoryList = () => {
  const [repositories, setRepositories] = useState();

  const fetchRepositories = async () => {
    // Replace the IP address part with your own IP address!
    const response = await fetch('http://192.168.100.16:5000/api/repositories');
    const json = await response.json();

    console.log(json);

    setRepositories(json);
  };

  useEffect(() => {
    fetchRepositories();
  }, []);

  // Get the nodes from the edges array
  const repositoryNodes = repositories
    ? repositories.edges.map(edge => edge.node)
    : [];

  return (
    <FlatList
      data={repositoryNodes}
      // Other props
    />
  );
};

export default RepositoryList;
```

Estamos usando el hook <em>useState</em> de React para mantener el estado de la lista de repositorios y el hook <em>useEffect</em> para llamar a la función <em>fetchRepositories</em> cuando el componente <em>RepositoryList</em> está montado. Extraemos los repositorios reales en la variable <em>repositoryNodes</em> y reemplazamos la variable <em>repositories</em> utilizada anteriormente en la propiedad <em>data</em> del componente <em>FlatList</em> con eso. Ahora debería poder ver los datos reales proporcionados por el servidor en la lista de repositorios revisados.

Por lo general, es una buena idea registrar la respuesta del servidor para poder inspeccionarlo como hicimos en la función <em>fetchRepositories</em>. Debería poder ver este mensaje de registro en las herramientas de desarrollo de la Expo si navega a los registros de su dispositivo como aprendimos en la sección [Visualización de registros](/es/part10/introduction_to_react_native#view-logs). Si está utilizando la aplicación móvil de la Expo para el desarrollo y la solicitud de red falla, asegúrese de que la computadora que está usando para ejecutar el servidor y su teléfono estén <i>conectados a la misma red Wi-Fi</i>. Si eso no es posible, use un emulador en la misma computadora en la que se ejecuta el servidor o configure un túnel al localhost, por ejemplo, usando [Ngrok](https://ngrok.com/).

El código actual de obtención de datos en el componente </em>RepositoryList</em> podría refactorizarse. Por ejemplo, el componente conoce los detalles de la solicitud de red, como la URL del punto final. Además, el código de recuperación de datos tiene un gran potencial de reutilización. Refactoricemos el código del componente extrayendo el código de obtención de datos en su propio gancho. Cree un directorio <i>hooks</i> en el directorio <i>src</i> y en ese directorio <i>hooks</i> cree un archivo <i>useRepositories.js</i> con el siguiente contenido:

```javascript
import { useState, useEffect } from 'react';

const useRepositories = () => {
  const [repositories, setRepositories] = useState();
  const [loading, setLoading] = useState(false);

  const fetchRepositories = async () => {
    setLoading(true);

    // Replace the IP address part with your own IP address!
    const response = await fetch('http://192.168.100.16:5000/api/repositories');
    const json = await response.json();

    setLoading(false);
    setRepositories(json);
  };

  useEffect(() => {
    fetchRepositories();
  }, []);

  return { repositories, loading, refetch: fetchRepositories };
};

export default useRepositories;
```

Ahora que tenemos una abstracción limpia para buscar los repositorios revisados, usemos el hook <em>useRepositories</em> en el componente <em>RepositoryList</em>:

```javascript
import React from 'react';
// ...
import useRepositories from '../hooks/useRepositories'; // highlight-line

const RepositoryList = () => {
  const { repositories } = useRepositories(); // highlight-line

  const repositoryNodes = repositories
    ? repositories.edges.map(edge => edge.node)
    : [];

  return (
    <FlatList
      data={repositoryNodes}
      // Other props
    />
  );
};

export default RepositoryList;
```

Eso es todo, ahora el componente <em>RepositoryList</em> ya no es consciente de la forma en que se adquieren los repositorios. Quizás en el futuro, los adquiriremos a través de una API GraphQL en lugar de una API REST. Veremos que sucede.

### Cliente GraphQL y Apollo

En la [parte 8](https://fullstackopen.com/en/part8) aprendimos sobre GraphQL y cómo enviar consultas GraphQL a un servidor Apollo utilizando el [Cliente Apollo](https://www.apollographql.com/docs/react/) en aplicaciones React. La buena noticia es que podemos usar Apollo Client en una aplicación React Native exactamente como lo haríamos con una aplicación web React.

Como se mencionó anteriormente, el servidor rate-repository-api proporciona una API GraphQL que se implementa con Apollo Server. Una vez que el servidor se está ejecutando, puede acceder a [GraphQL Playground](https://www.apollographql.com/docs/apollo-server/testing/graphql-playground/#gatsby-focus-wrapper) en [http://localhost:5000/graphql](http://localhost:5000/graphql). GraphQL Playground es una herramienta de desarrollo para realizar consultas GraphQL e inspeccionar el esquema y la documentación de las API GraphQL. Si necesita enviar una consulta en su aplicación <i>siempre</i> pruébela con GraphQL Playground antes de implementarla en el código. Es mucho más fácil depurar posibles problemas en la consulta en GraphQL Playground que en la aplicación. Si no está seguro de cuáles son las consultas disponibles o cómo utilizarlas, haga clic en la pestaña <i>docs</i> para abrir la documentación:

![GraphQL Playground](../../images/10/11.png)

En nuestra aplicación React Native, utilizaremos el [Apollo Boost](https://www.npmjs.com/package/apollo-boost), que es una forma con configuración cero para comenzar a usar Apollo Client. Como integración de React, usaremos la librería [@apollo/react-hooks](https://www.apollographql.com/docs/react/api/react-hooks/), que proporciona enlaces como [useQuery](https://www.apollographql.com/docs/react/api/react-hooks/#usequery) y [useMutation](https://www.apollographql.com/docs/react/api/react-hooks/#usemutation) para usar Apollo Client. Comencemos instalando las dependencias:

```shell
npm install apollo-boost @apollo/react-hooks graphql
```

A continuación, creemos una función de utilidad para crear el cliente Apollo con la configuración requerida. Cree un directorio <i>utils</i> en el directorio <i>src</i> y en ese directorio <i>utils</i> cree un archivo <i>apolloClient.js</i>. En ese archivo, configure el Apollo Client para que se conecte al Apollo Server:

```javascript
import ApolloClient from 'apollo-boost';

const createApolloClient = () => {
  return new ApolloClient({
    // Replace the IP address part with your own IP address!
    uri: 'http://192.168.100.16:5000/graphql',
  });
};

export default createApolloClient;
```

Por lo demás, la URL que se usa para conectarse al servidor Apollo es la misma que usó con la API Fetch, pero la ruta es <i>/graphql</i>. Por último, debemos proporcionar el Cliente Apollo utilizando el contexto [ApolloProvider](https://www.apollographql.com/docs/react/api/react-hooks/#apolloprovider). Lo agregaremos al componente <em>App</em> en el archivo <i>App.js</i>:

```javascript
import React from 'react';
import { NativeRouter } from 'react-router-native';
import { ApolloProvider } from '@apollo/react-hooks'; // highlight-line

import Main from './src/components/Main';
import createApolloClient from './src/utils/apolloClient'; // highlight-line

const apolloClient = createApolloClient(); // highlight-line

const App = () => {
  return (
    <NativeRouter>
      <ApolloProvider client={apolloClient}> // highlight-line
        <Main />
      </ApolloProvider> // highlight-line
    </NativeRouter>
  );
};

export default App;
```

### Organización del código relacionado con GraphQL

Depende de usted cómo organizar el código relacionado con GraphQL en su aplicación. Sin embargo, por el bien de una estructura de referencia, echemos un vistazo a una forma bastante simple y eficiente de organizar el código relacionado con GraphQL. En esta estructura, definimos consultas, mutaciones, fragmentos y posiblemente otras entidades en sus propios archivos. Estos archivos se encuentran en el mismo directorio. A continuación, se muestra un ejemplo de la estructura que puede usar para comenzar:

![GraphQL structure](../../images/10/12.png)

Puede importar el template literal [gql](https://www.apollographql.com/docs/apollo-server/api/apollo-server/ #gql) utilizado para definir consultas GraphQL desde la libería Apollo Boost. Si seguimos la estructura sugerida anteriormente, podríamos tener un archivo <i>queries.js</i> en el directorio <i>graphql</i> para las consultas GraphQL de nuestra aplicación. Cada una de las consultas se puede almacenar en una variable y exportar así:

```javascript
import { gql } from 'apollo-boost';

export const GET_REPOSITORIES = gql`
  query {
    repositories {
      ${/* ... */}
    }
  }
`;

// other queries...
```

Podemos importar estas variables y usarlas con el hook <em>useQuery</em> como este:

```javascript
import { useQuery } from '@apollo/react-hooks';

import { GET_REPOSITORIES } from '../graphql/queries';

const Component = () => {
  const { data, error, loading } = useQuery(GET_REPOSITORIES);
  // ...
};
```

Lo mismo ocurre con la organización de mutaciones. La única diferencia es que los definimos en un archivo diferente, <i>mutations.js</i>. Se recomienda utilizar [fragmentos](https://www.apollographql.com/docs/react/data/fragments/) en las consultas para evitar volver a escribir los mismos campos una y otra vez.

### Evolución de la estructura

Una vez que nuestra aplicación crezca, puede haber ocasiones en las que ciertos archivos crezcan demasiado para administrarlos. Por ejemplo, tenemos el componente <em>A</em> que renderiza los componentes <em>B</em> y <em>C</em>. Todos estos componentes están definidos en un archivo <i>A.jsx</i> en un directorio <i>components</i>. Nos gustaría extraer los componentes <em>B</em> y <em>C</em> en sus propios archivos <i>B.jsx</i> y <i>C.jsx</i> sin mayores refactores. Tenemos dos opciones:

- Crear archivos <i>B.jsx</i> y <i>C.jsx</i> en el directorio <i>components</i>. Esto da como resultado la siguiente estructura:

```
components/
  A.jsx
  B.jsx
  C.jsx
  ...
```

- Crear un directorio <i>A</i> en el directorio <i>components</i> y cree los archivos <i>B.jsx</i> y <i>C.jsx</i> allí. Para evitar romper los componentes que importan el archivo <i>A.jsx</i>, mueva el archivo <i>A.jsx</i> al directorio <i>A</i> y cámbiele el nombre a <i>index.jsx</i>. Esto da como resultado la siguiente estructura:

```
components/
  A/
    B.jsx
    C.jsx
    index.jsx
  ...
```

La primera opción es bastante decente, sin embargo, si los componentes <em>B</em> y <em>C</em> no se pueden reutilizar fuera del componente <em>A</em>, es inútil hinchar el directorio <i>components</i> agregándolos como archivos separados. La segunda opción es bastante modular y no interrumpe ninguna importación porque la importación de una ruta como <i>./A</i> coincidirá con <i>A.jsx</i> y <i>A/index.jsx</i>.

</div>

<div class = "tasks">

### Ejercicio 10.11.

#### Ejercicio 10.11: obtención de repositorios con Apollo Client

Queremos reemplazar la implementación de la API Fetch en el hook <em>useRepositories</em> con una consulta GraphQL. Abra GraphQL Playground en [http://localhost:5000/graphql](http://localhost:5000/graphql) y abra la documentación haciendo clic en la pestaña <i>docs</i>. Busque la consulta <em>repositorios</em>. La consulta tiene algunos argumentos, sin embargo, todos estos son opcionales, por lo que no es necesario que los especifique. En GraphQL Playground, forme una consulta para buscar los repositorios con los campos que está mostrando actualmente en la aplicación. El resultado se paginará y contiene los primeros 30 resultados de forma predeterminada. Por ahora, puede ignorar la paginación por completo.

Una vez que la consulta esté funcionando en GraphQL Playground, úsela para reemplazar la implementación de la API Fetch en el hook <em>useRepositories</em>. Esto se puede lograr usando el hook [useQuery](https://www.apollographql.com/docs/react/api/react-hooks/#usequery). La etiqueta literal de plantilla <em>gql</em> se puede importar desde Apollo Boost como se indicó anteriormente. Considere usar la estructura recomendada anteriormente para el código relacionado con GraphQL. Para evitar problemas futuros de almacenamiento en caché, use la [política de recuperación](https://www.apollographql.com/docs/react/data/queries/#configuring-fetch-logic) _cache-and-network_ en la consulta. Se puede usar con el hook <em>useQuery</em> como este:

```javascript
useQuery(MY_QUERY, {
  fetchPolicy: 'cache-and-network',
  // Other options
});
```

Los cambios en el hook <em>useRepositories</em> no deberían afectar al componente <em>RepositoryList</em> de ninguna manera.

</div>

<div class="content">

### Variables de entorno

Es muy probable que cada aplicación se ejecute en más de un entorno. Dos candidatos obvios para estos entornos son el entorno de desarrollo y el entorno de producción. De estos dos, el entorno de desarrollo es el que estamos ejecutando la aplicación en este momento. Los diferentes entornos generalmente tienen diferentes dependencias, por ejemplo, el servidor que estamos desarrollando localmente puede usar una base de datos local, mientras que el servidor que se implementa en el entorno de producción usa la base de datos de producción. Para hacer que el entorno del código sea independiente, necesitamos parametrizar estas dependencias. Por el momento, estamos usando un valor codificado muy dependiente del entorno en nuestra aplicación: la URL del servidor.

Hemos aprendido anteriormente que podemos proporcionar programas en ejecución con variables de entorno. Estas variables se pueden definir en la línea de comandos o utilizando archivos de configuración del entorno como archivos <i>.env</i> y bibliotecas de terceros como <i>Dotenv</i>. Desafortunadamente, React Native no tiene soporte directo para variables de entorno. Sin embargo, podemos acceder a la configuración de Expo definida en el archivo <i>app.json</i> en tiempo de ejecución desde nuestro código JavaScript. Esta configuración se puede utilizar para definir y acceder a variables dependientes del entorno.

Se puede acceder a la configuración importando la constante <em>Constants</em> desde el módulo <i>expo-constants</i> como lo hemos hecho algunas veces antes. Una vez importada, la propiedad <em>Constants.manifest</em> contendrá la configuración. Intentemos esto registrando <em>Constants.manifest</em> en el componente <em>App</em>:

```javascript
import React from 'react';
import { NativeRouter } from 'react-router-native';
import { ApolloProvider } from '@apollo/react-hooks';
import Constants from 'expo-constants'; // highlight-line

import Main from './src/components/Main';
import createApolloClient from './src/utils/apolloClient';

const apolloClient = createApolloClient();

const App = () => {
  console.log(Constants.manifest); // highlight-line

  return (
    <NativeRouter>
      <ApolloProvider client={apolloClient}>
        <Main />
      </ApolloProvider>
    </NativeRouter>
  );
};

export default App;
```

Ahora debería ver la configuración en los registros.

El siguiente paso es usar la configuración para definir variables dependientes del entorno en nuestra aplicación. Comencemos cambiando el nombre del archivo <i>app.json</i> a <i>app.config.js</i>. Una vez que se cambia el nombre del archivo, podemos usar JavaScript dentro del archivo de configuración. Cambie el contenido del archivo para que el objeto anterior:

```javascript
{
  "expo": {
    "name": "rate-repository-app",
    // rest of the configuration...
  }
}
```

Se convierte en una exportación, que contiene el contenido de la propiedad <em>expo</em>:

```javascript
export default {
   name: 'rate-repository-app',
   // rest of the configuration...
};
```

Expo ha reservado una propiedad [extra](https://docs.expo.io/guides/environment-variables/#using-app-manifest-extra) en la configuración para cualquier configuración específica de la aplicación. Para ver cómo funciona esto, agreguemos una variable <em>env</em> en la configuración de nuestra aplicación:

```javascript
export default {
   name: 'rate-repository-app',
   // rest of the configuration...
   // highlight-start
   extra: {
     env: 'development'
   },
   // highlight-end
};
```

Reinicie las herramientas de desarrollo de Expo para aplicar los cambios y debería ver que el valor de la propiedad <em>Constants.manifest</em> ha cambiado y ahora incluye la propiedad <em>extra</em> que contiene nuestra configuración específica de la aplicación. Ahora se puede acceder al valor de la variable <em>env</em> a través de la propiedad <em>Constants.manifest.extra.env</em>.

Debido a que usar una configuración codificada es un poco tonto, usemos una variable de entorno en su lugar:

```javascript
export default {
   name: 'rate-repository-app',
   // rest of the configuration...
   // highlight-start
   extra: {
     env: process.env.ENV,
   },
   // highlight-end
};
```

Como hemos aprendido, podemos establecer el valor de una variable de entorno a través de la línea de comando definiendo el nombre y el valor de la variable antes del comando real. Como ejemplo, inicie las herramientas de desarrollo de Expo y establezca la variable de entorno <em>ENV</em> como <em>test</em> así:

```shell
ENV=test npm start
```

Si echa un vistazo en los registros, debería ver que la propiedad <em>Constants.manifest.extra.env</em> ha cambiado.

También podemos cargar variables de entorno desde un archivo <em>.env</em> como hemos aprendido en las partes anteriores. Primero, necesitamos instalar la biblioteca [Dotenv](https://www.npmjs.com/package/dotenv):

```shell
npm install dotenv
```

A continuación, agregue un archivo <em>.env</em> en el directorio raíz de nuestro proyecto con el siguiente contenido:

```
ENV=development
```

Finalmente, importe la biblioteca en el archivo <i>app.config.js</i>:

```javascript
import 'dotenv/config'; // highlight-line

export default {
   name: 'rate-repository-app',
   // rest of the configuration...
   extra: {
     env: process.env.ENV,
   },
};
```

Debe reiniciar las herramientas de desarrollo de Expo para aplicar los cambios que ha realizado en el archivo <i>.env</i>.

Tenga en cuenta que <i>nunca</i> es una buena idea poner datos confidenciales en la configuración de la aplicación. La razón de esto es que una vez que un usuario ha descargado su aplicación, puede, al menos en teoría, aplicar ingeniería inversa a su aplicación y averiguar los datos confidenciales que ha almacenado en el código.

</div>

<div class="tasks">

### Ejercicio 10.12.

#### Ejercicio 10.12: variables de entorno

En lugar de la URL codificada de Apollo Server, utilice una variable de entorno definida en el archivo <i>.env</i> al inicializar el cliente Apollo. Puede nombrar la variable de entorno, por ejemplo, <em>APOLLO_URI</em>

<i>No</i> intente acceder a variables de entorno como <em>process.env.APOLLO_URI</em> fuera del archivo <i>app.config.js</i>. En su lugar, utilice el objeto <em>Constants.manifest.extra</em> como en el ejemplo anterior. Además, no importe la biblioteca dotenv fuera del archivo <i>app.config.js</i> o probablemente enfrentará errores.

</div>

<div class="content">

### Almacenamiento de datos en el dispositivo del usuario

Hay ocasiones en las que necesitamos almacenar algunos datos persistentes en el dispositivo del usuario. Uno de esos escenarios comunes es almacenar el token de autenticación del usuario para que podamos recuperarlo incluso si el usuario cierra y vuelve a abrir nuestra aplicación. En el desarrollo web, hemos utilizado el objeto <em>localStorage</em> del navegador para lograr dicha funcionalidad. React Native proporciona un almacenamiento persistente similar, el [AsyncStorage](https://react-native-async-storage.github.io/async-storage/docs/usage).

Podemos usar el comando <em>expo install</em> para instalar la versión del paquete <i>@react-native-community/async-storage</i> que es adecuada para nuestra versión de Expo SDK:

```shell
expo install @react-native-community/async-storage
```

La API de <em>AsyncStorage</em> es en muchos aspectos la misma que la API de <em>localStorage</em>. Ambos son almacenamientos de clave-valor con métodos similares. La mayor diferencia entre los dos es que, como su nombre lo indica, las operaciones de <em>AsyncStorage</em> son <i>asincrónicas</i>.

Debido a que <em>AsyncStorage</em> opera con claves de cadena en un espacio de nombres global, es una buena idea crear una abstracción simple para sus operaciones. Esta abstracción se puede implementar, por ejemplo, usando una [clase](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes). Como ejemplo, podríamos implementar un almacenamiento de carrito de compras para almacenar los productos que el usuario desea comprar:

```javascript
import AsyncStorage from '@react-native-community/async-storage';

class ShoppingCartStorage {
  constructor(namespace = 'shoppingCart') {
    this.namespace = namespace;
  }

  async getProducts() {
    const rawProducts = await AsyncStorage.getItem(
      `${this.namespace}:products`,
    );

    return rawProducts ? JSON.parse(rawProducts) : [];
  }

  async addProduct(productId) {
    const currentProducts = await this.getProducts();
    const newProducts = [...currentProducts, productId];

    await AsyncStorage.setItem(
      `${this.namespace}:products`,
      JSON.stringify(newProducts),
    );
  }

  async clearProducts() {
    await AsyncStorage.removeItem(`${this.namespace}:products`);
  }
}

const doShopping = async () => {
  const shoppingCartA = new ShoppingCartStorage('shoppingCartA');
  const shoppingCartB = new ShoppingCartStorage('shoppingCartB');

  await shoppingCartA.addProduct('chips');
  await shoppingCartA.addProduct('soda');

  await shoppingCartB.addProduct('milk');

  const productsA = await shoppingCartA.getProducts();
  const productsB = await shoppingCartB.getProducts();

  console.log(productsA, productsB);

  await shoppingCartA.clearProducts();
  await shoppingCartB.clearProducts();
};

doShopping();
```

Debido a que las claves <em>AsyncStorage</em> son globales, generalmente es una buena idea agregar un <i>espacio de nombres</i> para las claves. En este contexto, el espacio de nombres es solo un prefijo que proporcionamos para las claves de abstracción de almacenamiento. El uso del espacio de nombres evita que las claves del almacenamiento colisionen con otras claves <em>AsyncStorage</em>. En este ejemplo, el espacio de nombres se define como el argumento del constructor y estamos usando el formato <em>namespace:key</em> para las claves.

Podemos agregar un elemento al almacenamiento usando el método [AsyncStorage.setItem](https://react-native-async-storage.github.io/async-storage/docs/api#setitem). El primer argumento del método es la clave del elemento y el segundo argumento su valor. El valor <i>debe ser una cadena</i>, por lo que necesitamos serializar valores que no son cadenas como hicimos con el método <em>JSON.stringify</em>. El método [AsyncStorage.getItem](https://react-native-async-storage.github.io/async-storage/docs/api/#getitem) se puede utilizar para obtener un elemento del almacenamiento. El argumento del método es la clave del elemento, cuyo valor se resolverá. El método [AsyncStorage.removeItem](https://react-native-async-storage.github.io/async-storage/docs/api/#removeitem) se puede utilizar para eliminar el elemento con la clave proporcionada del almacenamiento.

</div>

<div class="tasks">

### Ejercicios 10.13. - 10.14.

#### Ejercicio 10.13: la mutación del formulario de inicio de sesión

La implementación actual del formulario de inicio de sesión no hace mucho con las credenciales del usuario enviado. Hagamos algo al respecto en este ejercicio. Primero, lea la [documentación de autorización](https://github.com/fullstack-hy2020/rate-repository-api#-authorization) del servidor rate-repository-api y pruebe las consultas proporcionadas en GraphQL Playground. Si la base de datos no tiene usuarios, puede completar la base de datos con algunos datos semilla. Las instrucciones para esto se pueden encontrar en la sección [Getting started](https://github.com/fullstack-hy2020/rate-repository-api#-getting-started) del README.

Una vez que sepa cómo se supone que funcionan las consultas de autorización, cree un archivo _useSignIn.js_ en el directorio <i>hooks</i>. En ese archivo, implemente un hook <em>useSignIn</em> que envíe la mutación <em>authorize</em> usando el hook [useMutation](https://www.apollographql.com/docs/react/api/react-hooks/#usemutation). Tenga en cuenta que la mutación <em>authorize</em> tiene un <i>único</i> argumento llamado <em>credentials</em>, que es de tipo <em>AuthorizeInput</em>. Este [tipo de entrada](https://graphql.org/graphql-js/mutations-and-input-types) contiene los campos <em>username</em> y <em>password</em>.

El valor de retorno del hook debe ser una tupla <em>[signIn, result]</em> donde <em>result</em> es el resultado de las mutaciones tal como lo devuelve el hook <em>useMutation</em> y una función <em>signIn</em> que ejecuta la mutación con un argumento de objeto <em>{ username, password }</em>. Sugerencia: no pase la función de mutación al valor de retorno directamente. En su lugar, devuelva una función que llame a la función de mutación como esta:

```javascript
const useSignIn = () => {
  const [mutate, result] = useMutation(/* mutation arguments */);

  const signIn = async ({ username, password }) => {
    // call the mutate function here with the right arguments
  };

  return [signIn, result];
};
```

Una vez implementado el hook, utilícelo en la devolución de llamada <em>onSubmit</em> del componente <em>SignIn</em>, por ejemplo, como este:

```javascript
const SignIn = () => {
  const [signIn] = useSignIn();

  const onSubmit = async (values) => {
    const { username, password } = values;

    try {
      const { data } = await signIn({ username, password });
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  };

  // ...
};
```

Este ejercicio se completa una vez que puede registrar el resultado de las mutaciones <i>authorize</i> del usuario después de que se haya enviado el formulario de inicio de sesión. El resultado de la mutación debe contener el usuario '

#### Ejercicio 10.14: almacenando el token de acceso, paso 1

Ahora que podemos obtener el token de acceso, necesitamos almacenarlo. Cree un archivo <i>authStorage.js</i> en el directorio <i>utils</i> con el siguiente contenido:

```javascript
import AsyncStorage from '@react-native-community/async-storage';

class AuthStorage {
  constructor(namespace = 'auth') {
    this.namespace = namespace;
  }

  getAccessToken() {
    // Get the access token for the storage
  }

  setAccessToken(accessToken) {
    // Add the access token to the storage
  }

  removeAccessToken() {
    // Remove the access token from the storage
  }
}

export default AuthStorage;
```

A continuación, implemente los métodos <em>AuthStorage.getAccessToken</em>, <em>AuthStorage.setAccessToken</em> y <em>AuthStorage.removeAccessToken</em>. Utilice la variable <em>namespace</em> para dar a sus claves un espacio de nombres como hicimos en el ejemplo anterior.

</div>

<div class="content">

### Mejora de las solicitudes del cliente Apollo

Ahora que hemos implementado el almacenamiento para almacenar el token de acceso del usuario, es hora de comenzar a usarlo. Inicialice el almacenamiento en el componente <em>App</em>:

```javascript
import React from 'react';
import { NativeRouter } from 'react-router-native';
import { ApolloProvider } from '@apollo/react-hooks';

import Main from './src/components/Main';
import createApolloClient from './src/utils/apolloClient';
import AuthStorage from './src/utils/authStorage'; // highlight-line

const authStorage = new AuthStorage(); // highlight-line
const apolloClient = createApolloClient(authStorage); // highlight-line

const App = () => {
  return (
    <NativeRouter>
      <ApolloProvider client={apolloClient}>
        <Main />
      </ApolloProvider>
    </NativeRouter>
  );
};

export default App;
```

También proporcionamos la instancia de almacenamiento para la función <em>createApolloClient</em> como argumento. Esto se debe a que a continuación, enviaremos el token de acceso a Apollo Server en cada solicitud. Apollo Server esperará que el token de acceso esté presente en el encabezado <i>Authorization</i> en el formato <i>Bearer <ACCESS_TOKEN></i>. Podemos mejorar el funcionamiento del cliente Apollo utilizando la opción [request](https://www.apollographql.com/docs/react/get-started/#configuration-options). Enviemos el token de acceso al servidor Apollo en nuestro cliente Apollo modificando la función <em>createApolloClient</em> en el archivo <i>apolloClient.js</i>:

```javascript
const createApolloClient = (authStorage) => { // highlight-line
  return new ApolloClient({
    // highlight-start
    request: async (operation) => {
      try {
        const accessToken = await authStorage.getAccessToken();

        operation.setContext({
          headers: {
            authorization: accessToken ? `Bearer ${accessToken}` : '',
          },
        });
      } catch (e) {
        console.log(e);
      }
    },
    // highlight-end
    // uri and other options...
  });
};
```

### Usando React Context para inyección de dependencia

La última pieza del rompecabezas de inicio de sesión es integrar el almacenamiento en el gancho <em>useSignIn</em>. Para lograr esto, el gancho debe poder acceder a la instancia de almacenamiento de tokens que hemos inicializado en el componente <em>App</em>. React [Context](https://reactjs.org/docs/context.html) es solo la herramienta que necesitamos para el trabajo. Cree un directorio <i>context</i> en el directorio <i>src</i>. En ese directorio cree un archivo <i>AuthStorageContext.js</i> con el siguiente contenido:

```javascript
import React from 'react';

const AuthStorageContext = React.createContext();

export default AuthStorageContext;
```

Ahora podemos usar el <em>AuthStorageContext.Provider</em> para proporcionar la instancia de almacenamiento a los descendientes del contexto. Agreguémoslo al componente <em>App</em>:

```javascript
import React from 'react';
import { NativeRouter } from 'react-router-native';
import { ApolloProvider } from '@apollo/react-hooks';

import Main from './src/components/Main';
import createApolloClient from './src/utils/apolloClient';
import AuthStorage from './src/utils/authStorage';
import AuthStorageContext from './src/contexts/AuthStorageContext'; // highlight-line

const authStorage = new AuthStorage();
const apolloClient = createApolloClient(authStorage);

const App = () => {
  return (
    <NativeRouter>
      <ApolloProvider client={apolloClient}>
        <AuthStorageContext.Provider value={authStorage}> // highlight-line
          <Main />
        </AuthStorageContext.Provider> // highlight-line
      </ApolloProvider>
    </NativeRouter>
  );
};

export default App;
```

Ahora es posible acceder a la instancia de almacenamiento en el hook <em>useSignIn</em> usando el hook [useContext](https://reactjs.org/docs/hooks-reference.html#usecontext) de React como este:

```javascript
import { useContext } from 'react'; // highlight-line
// ...

import AuthStorageContext from '../contexts/AuthStorageContext'; //highlight-line

const useSignIn = () => {
  const authStorage = useContext(AuthStorageContext); //highlight-line
  // ...
};
```
Tenga en cuenta que acceder al valor de un contexto mediante el hook <em>useContext</em> solo funciona si el hook <em>useContext</em> se usa en un componente que es <i>descendiente</i> del componente [Context.Provider](https://reactjs.org/docs/context.html#contextprovider).

La capacidad de proporcionar datos a los descendientes de componentes abre toneladas de casos de uso para React Context. Para obtener más información sobre estos casos de uso, lea el esclarecedor artículo de Kent C. Dodds [Cómo usar React Context de manera efectiva](https://kentcdodds.com/blog/how-to-use-react-context-effectively) para descubrir cómo combinar el hook [useReducer](https://reactjs.org/docs/hooks-reference.html#usereducer) con el contexto para implementar la gestión del estado. Puede encontrar una forma de utilizar este conocimiento en los próximos ejercicios.

</div>

<div class="tasks">

### Ejercicios 10.15. - 10.16.

#### Ejercicio 10.15: almacenamiento del token de acceso paso 2

Mejore el hook <em>useSignIn</em> para que almacene el token de acceso del usuario recuperado de la mutación <i>authorize</i>. El valor de retorno del hook no debería cambiar. El único cambio que debe realizar en el componente <em> SignIn </em> es que debe redirigir al usuario a la vista de lista de repositorios revisados ​​después de un inicio de sesión exitoso. Puede lograrlo usando [useHistory](https://reacttraining.com/react-router/native/api/Hooks/usehistory) y el método [push](https://reacttraining.com/react-router/native/api/history) del historial.

Después de que se haya ejecutado la mutación <i>authorize</i> y haya almacenado el token de acceso del usuario en el almacenamiento, debe restablecer la tienda del cliente Apollo. Esto borrará la memoria caché del cliente Apollo y volverá a ejecutar todas las consultas activas. Puede hacer esto usando el método [resetStore](https://www.apollographql.com/docs/react/v2.5/api/apollo-client/#ApolloClient.resetStore) del cliente Apollo. Puede acceder al cliente Apollo en el hook <em>useSignIn</em> usando el hook [useApolloClient](https://www.apollographql.com/docs/react/api/react-hooks/#useapolloclient). Tenga en cuenta que el orden de ejecución es crucial y debe ser el siguiente:

```javascript
const { data } = await mutate(/* options */);
await authStorage.setAccessToken(/* access token from the data */);
apolloClient.resetStore();
```

#### Ejercicio 10.16: cerrar sesión

El paso final para completar la función de inicio de sesión es implementar una función de cierre de sesión. La consulta <em>AuthorizedUser</em> se puede utilizar para verificar la información del usuario autorizado. Si el resultado de la consulta es <em>null</em>, eso significa que el usuario no está autorizado. Abra el patio de juegos de GraphQL y ejecute la siguiente consulta:

```javascript
{
  authorizedUser {
    id
    username
  }
}
```

Probablemente terminará con el resultado <em>null</em>. Esto se debe a que GraphQL Playground no está autorizado, lo que significa que no envía un token de acceso válido con la solicitud. Revise la [documentación de autorización](https://github.com/fullstack-hy2020/rate-repository-api#-authorization) y recupere un token de acceso utilizando la mutación <em>authorize</em>. Utilice este token de acceso en el encabezado _Authorization_ como se indica en la documentación. Ahora, ejecute la consulta <em>AuthorizedUser</em> nuevamente y debería poder ver la información del usuario autorizado.

Abra el componente <em>AppBar</em> en el archivo <i>AppBar.jsx</i> donde actualmente tiene las pestañas "Repositories" e "Sign in". Cambie las pestañas para que si el usuario está registrado en la pestaña "Sign out" se muestra, de lo contrario, muestre la pestaña "Sign in". Puede lograr esto usando la consulta <em>AuthorizedUser</em> con el hook [useQuery](https://www.apollographql.com/docs/react/api/react-hooks/#usequery).

Al presionar la pestaña "Sign out" se debe eliminar el token de acceso del usuario del almacenamiento y restablecer la tienda del Cliente Apollo con [resetStore](https://www.apollographql.com/docs/react/v2.5/api/apollo-client/#ApolloClient.resetStore). Llamar al método <em>resetStore</em> debería volver a ejecutar automáticamente todas las consultas activas, lo que significa que la consulta <em>AuthorizedUser</em> debería volver a ejecutarse. Tenga en cuenta que el orden de ejecución es crucial: el token de acceso debe eliminarse del almacenamiento <i>antes</i> que se restablezca la tienda del cliente Apollo.

Este fue el último ejercicio de esta sección. Es hora de enviar tu código a GitHub y marcar todos tus ejercicios terminados en el [sistema de envío de ejercicios](https://studies.cs.helsinki.fi/stats/courses/fs-react-native-2020). Tenga en cuenta que los ejercicios de esta sección deben enviarse a la parte 3 del sistema de envío de ejercicios.

</div>
