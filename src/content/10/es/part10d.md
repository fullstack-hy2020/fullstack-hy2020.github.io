---
mainImage: ../../../images/part-10.svg
part: 10
letter: d
lang: en
---

<div class="content">

Ahora que hemos establecido una buena base para nuestro proyecto, es hora de empezar a ampliarlo. En esta sección puede poner en práctica todo el conocimiento de React Native que ha adquirido hasta ahora. Además de expandir nuestra aplicación, cubriremos algunas áreas nuevas, como pruebas y recursos adicionales.

### Prueba de aplicaciones React Native

Para comenzar a probar código de cualquier tipo, lo primero que necesitamos es un marco de prueba, que podemos usar para ejecutar un conjunto de casos de prueba e inspeccionar sus resultados. Para probar una aplicación de JavaScript, [Jest](https://jestjs.io/) es un candidato popular para dicho marco de prueba. Para probar una aplicación React Native basada en Expo con Jest, Expo proporciona un conjunto de configuración de Jest en forma de [jest-expo](https://github.com/expo/expo/tree/master/packages/jest-expo) Preestablecido. Para usar ESLint en los archivos de prueba de Jest, también necesitamos el complemento [eslint-plugin-jest](https://www.npmjs.com/package/eslint-plugin-jest) para ESLint. Comencemos instalando los paquetes:

```shell
npm install --save-dev jest jest-expo eslint-plugin-jest
```

Para usar el ajuste preestablecido de jest-expo en Jest, necesitamos agregar la siguiente configuración de Jest al archivo <i>package.json</i> junto con el script <i>test</i>:

```javascript
{
  // ...
  "scripts": {
    // other scripts...
    "test": "jest" // highlight-line
  },
  // highlight-start
  "jest": {
    "preset": "jest-expo",
    "transform": {
      "^.+\\.jsx?$": "babel-jest"
    },
    "transformIgnorePatterns": [
      "node_modules/(?!(jest-)?react-native|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|@sentry/.*|react-router-native)"
    ]
  },
  // highlight-end
  // ...
}
```

La opción <em>transform</em> le dice a Jest que transforme los archivos <i>.js</i> y <i>.jsx</i> con compilador [Babel](https://babeljs.io/). La opción <em>transformIgnorePatterns</em> es para ignorar ciertos directorios en el directorio <i>node_modules</i> mientras se transforman archivos. Esta configuración de Jest es casi idéntica a la propuesta en la [documentación](https://docs.expo.io/guides/testing-with-jest/) de Expo.
Para usar el complemento eslint-plugin-jest en ESLint, debemos incluirlo en la matriz de complementos y extensiones en el archivo <i>.eslintrc</i>:

```javascript
{
  "plugins": ["react", "jest"],
  "extends": ["eslint:recommended", "plugin:react/recommended", "plugin:jest/recommended"], // highlight-line
  "parser": "babel-eslint",
  "env": {
    "browser": true
  },
  "rules": {
    "react/prop-types": "off"
  }
}
```

Para ver que la configuración está funcionando, cree un directorio <i>\_\_tests_\_</i> en el directorio <i>src</i> y en el directorio creado cree un archivo <i>example.js</i>. En ese archivo, agregue esta simple prueba:

```javascript
describe('Example', () => {
  it('works', () => {
    expect(1).toBe(1);
  });
});
```

Ahora, ejecutemos nuestra prueba de ejemplo ejecutando <em>npm test</em>. La salida del comando debe indicar que se pasó la prueba ubicada en el archivo <i>src/\_\_tests_\_/example.js</i>.

### Organización de pruebas

Organizar archivos de prueba en un solo directorio <i>\_\_tests\_\_</i> es un método para organizar las pruebas. Al elegir este enfoque, se recomienda colocar los archivos de prueba en sus subdirectorios correspondientes al igual que el código en sí. Esto significa que, por ejemplo, las pruebas relacionadas con los componentes están en el directorio <i>components</i>, las pruebas relacionadas con las utilidades están en las <i>utils</i> directorio, y así sucesivamente. Esto dará como resultado la siguiente estructura:

```
src/
  __tests__/
    components/
      AppBar.js
      RepositoryList.js
      ...
    utils/
      authStorage.js
      ...
    ...
```

Otro enfoque es organizar las pruebas cerca de la implementación. Esto significa que, por ejemplo, el archivo de prueba que contiene las pruebas para el componente <em>AppBar</em> está en el mismo directorio que el código del componente. Esto dará como resultado la siguiente estructura:

```
src/
  components/
    AppBar/
      AppBar.test.jsx
      index.jsx
    ...
  ...
```

En este ejemplo, el código del componente está en el archivo <i>index.jsx</i> y la prueba en el archivo <i>AppBar.test.jsx</i>. Tenga en cuenta que para Jest encontrar sus archivos de prueba, debe colocarlos en un directorio <i>\_\_tests\_\_</i>, use <i>.test</i> o <i>.spec</i> sufijo, o [configurar manualmente](https://jestjs.io/docs/en/configuration#testmatch-arraystring) los patrones globales.

### Prueba de componentes

Ahora que hemos logrado configurar Jest y ejecutar una prueba muy simple, es hora de descubrir cómo probar los componentes. Como sabemos, probar componentes requiere una forma de serializar la salida de render de un componente y simular la activación de diferentes tipos de eventos, como presionar un botón. Para estos propósitos, existe la familia [Testing Library](https://testing-library.com/docs/intro), que proporciona bibliotecas para probar componentes de interfaz de usuario en diferentes plataformas. Todas estas bibliotecas comparten una API similar para probar los componentes de la interfaz de usuario de una manera centrada en el usuario.

En la [parte 5](/es/part5/testing_react_apps) nos familiarizamos con una de estas liberías, la [React Testing Library](https://testing-library.com/docs/react-testing-library/intro). Desafortunadamente, esta librería solo es adecuada para probar aplicaciones web React. Afortunadamente, existe una contraparte de React Native para esta librería, que es la [React Native Testing Library](https://callstack.github.io/react-native-testing-library/). Esta es la librería que usaremos mientras probamos los componentes de nuestra aplicación React Native. La buena noticia es que estas bibliotecas comparten una API muy similar, por lo que no hay demasiados conceptos nuevos que aprender. Además de la biblioteca de pruebas React Native, necesitamos un conjunto de comparadores Jest específicos de React Native, como <em>toHaveTextContent</em> y <em>toHaveProp</em>. Estos comparadores los proporciona la librería [jest-native](https://github.com/testing-library/jest-native). Antes de entrar en detalles, instalemos estos paquetes:

```shell
npm install --save-dev @testing-library/react-native @testing-library/jest-native
```

Para poder usar estos comparadores necesitamos extender el objeto <em>expect</em> de Jest. Esto se puede hacer usando un archivo de configuración global. Cree un archivo <i>setupTests.js</i> en el directorio raíz de su proyecto, es decir, el mismo directorio donde se encuentra el archivo <i>package.json</i>. En ese archivo agregue la siguiente línea:

```javascript
import '@testing-library/jest-native/extend-expect';
```

A continuación, configure este archivo como un archivo de instalación en la configuración de Jest en el archivo <i>package.json</i> (tenga en cuenta que el <em>\<rootDir></em> en la ruta es intencional y no es necesario reemplazarlo):

```javascript
{
  // ...
  "jest": {
    "preset": "jest-expo",
    "transform": {
      "^.+\\.jsx?$": "babel-jest"
    },
    "transformIgnorePatterns": [
      "node_modules/(?!(jest-)?react-native|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|@sentry/.*|react-router-native)"
    ],
    "setupFilesAfterEnv": ["<rootDir>/setupTests.js"] // highlight-line
  }
  // ...
}
```

Los conceptos principales de React Native Testing Library son las [consultas](https://callstack.github.io/react-native-testing-library/docs/api-queries) y [disparando eventos](https://callstack.github.io/react-native-testing-library/docs/api#fireevent). Las consultas se utilizan para extraer un conjunto de nodos del componente que se representa mediante la función [render](https://callstack.github.io/react-native-testing-library/docs/api#render). Las consultas son útiles en las pruebas donde esperamos, por ejemplo, que algún texto, como el nombre de un repositorio, esté presente en el componente renderizado. Para obtener fácilmente nodos específicos, puede etiquetar los nodos con la propiedad <em>testID</em> y consultarla con la función [getByTestId](https://callstack.github.io/react-native-testing-library/docs/api-queries#bytestid). Cada componente principal de React Native acepta el prop <em>testID</em>. A continuación, se muestra un ejemplo de cómo utilizar las consultas:

```javascript
import React from 'react';
import { Text, View } from 'react-native';
import { render } from '@testing-library/react-native';

const Greeting = ({ name }) => {
  return (
    <View>
      {/* This node is tagged with the testID prop */}
      <Text testID="greetingText">Hello {name}!</Text>
    </View>
  );
};

describe('Greeting', () => {
  it('renders a greeting message based on the name prop', () => {
    const { debug, getByTestId } = render(<Greeting name="Kalle" />);

    debug();

    expect(getByTestId('greetingText')).toHaveTextContent('Hello Kalle!');
  });
});
```

La función <em>render</em> devuelve las consultas y ayudantes adicionales, como la función <em>debug</em>. La función [debug](https://callstack.github.io/react-native-testing-library/docs/api#debug) imprime el árbol React renderizado en un formato fácil de usar. Úselo si no está seguro de cómo se ve el árbol de React generado por la función <em>render</em>. Adquirimos el nodo <em>Text</em> etiquetado con el prop <em>testID</em> usando la función <em>getByTestId</em>. Para todas las consultas disponibles, consulte la [documentación](https://callstack.github.io/react-native-testing-library/docs/api-queries) de React Native Testing Library . El comparador <em>toHaveTextContent</em> se usa para afirmar que el contenido textual del nodo es correcto. La lista completa de comparadores específicos de React Native disponibles se puede encontrar en la [documentación](https://github.com/testing-library/jest-native#matchers) de la biblioteca jest-native. La [documentación](https://jestjs.io/docs/en/expect) de Jest contiene todos los comparadores de Jest universales.

El segundo concepto muy importante de React Native Testing Library es la activación de eventos. Podemos disparar un evento en un nodo provisto usando los métodos del objeto [fireEvent](https://callstack.github.io/react-native-testing-library/docs/api#fireevent). Esto es útil, por ejemplo, para escribir texto en un campo de texto o presionar un botón. Aquí hay un ejemplo de cómo probar el envío de un formulario simple:

```javascript
import React, { useState } from 'react';
import { Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';

const Form = ({ onSubmit }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    onSubmit({ username, password });
  };

  return (
    <View>
      <View>
        <TextInput
          value={username}
          onChangeText={(text) => setUsername(text)}
          placeholder="Username"
          testID="usernameField"
        />
      </View>
      <View>
        <TextInput
          value={password}
          onChangeText={(text) => setPassword(text)}
          placeholder="Password"
          testID="passwordField"
        />
      </View>
      <View>
        <TouchableWithoutFeedback onPress={handleSubmit} testID="submitButton">
          <Text>Submit</Text>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

describe('Form', () => {
  it('calls function provided by onSubmit prop after pressing the submit button', () => {
    const onSubmit = jest.fn();
    const { getByTestId } = render(<Form onSubmit={onSubmit} />);

    fireEvent.changeText(getByTestId('usernameField'), 'kalle');
    fireEvent.changeText(getByTestId('passwordField'), 'password');
    fireEvent.press(getByTestId('submitButton'));

    expect(onSubmit).toHaveBeenCalledTimes(1);

    // onSubmit.mock.calls[0][0] contains the first argument of the first call
    expect(onSubmit.mock.calls[0][0]).toEqual({
      username: 'kalle',
      password: 'password',
    });
  });
});
```

En esta prueba, queremos probar que después de completar los campos del formulario usando el método <em>fireEvent.changeText</em> y presionar el botón enviar usando el método <em>fireEvent.press</em>, La función de devolución de llamada <em>onSubmit</em> se llama correctamente. Para inspeccionar si se llama a la función <em>onSubmit</em> y con qué argumentos, podemos usar una [función simulada](https://jestjs.io/docs/en/mock-function-api). Las funciones simuladas son funciones con un comportamiento preprogramado, como un valor de retorno específico. Además, podemos crear expectativas para las funciones simuladas como "esperar que la función simulada se haya llamado una vez". La lista completa de expectativas disponibles se puede encontrar en la [documentación de espera](https://jestjs.io/docs/en/expect) de Jest.

Antes de adentrarse más en el mundo de las pruebas de aplicaciones React Native, juegue con estos ejemplos agregando un archivo de prueba en el directorio <i>\_\_tests\_\_</i> que creamos anteriormente.

### Manejo de dependencias en pruebas

Los componentes de los ejemplos anteriores son bastante fáciles de probar porque son más o menos <i>puros</i>. Los componentes puros no dependen de <i>efectos secundarios</i> como las solicitudes de red o el uso de alguna API nativa como AsyncStorage. El componente <em>Form</em> es mucho menos puro que el componente <em>Greeting</em> porque sus cambios de estado pueden contarse como un efecto secundario. Sin embargo, probarlo no es demasiado difícil.

A continuación, echemos un vistazo a una estrategia para probar componentes con efectos secundarios. Escojamos el componente <em>RepositoryList</em> de nuestra aplicación como ejemplo. Por el momento, el componente tiene un efecto secundario, que es una consulta GraphQL para obtener los repositorios revisados. La implementación actual del componente <em>RepositoryList</em> se parece a esto:

```javascript
const RepositoryList = () => {
  const { repositories } = useRepositories();

  const repositoryNodes = repositories
    ? repositories.edges.map((edge) => edge.node)
    : [];

  return (
    <FlatList
      data={repositoryNodes}
      // ...
    />
  );
};

export default RepositoryList;
```

El único efecto secundario es el uso del hook <em>useRepositories</em>, que envía una consulta GraphQL. Hay varias formas de probar este componente. Una forma es burlarse de las respuestas del Cliente Apollo como se indica en la [documentación](https://www.apollographql.com/docs/react/development-testing/testing/) del Cliente Apollo. Una forma más sencilla es asumir que el hook <em>useRepositories</em> funciona según lo previsto (preferiblemente probándolo) y extraer el código "puro" de los componentes en otro componente, como el <em>RepositoryListContainer</em> componente:

```javascript
export const RepositoryListContainer = ({ repositories }) => {
  const repositoryNodes = repositories
    ? repositories.edges.map((edge) => edge.node)
    : [];

  return (
    <FlatList
      data={repositoryNodes}
      // ...
    />
  );
};

const RepositoryList = () => {
  const { repositories } = useRepositories();

  return <RepositoryListContainer repositories={repositories} />;
};

export default RepositoryList;
```

Ahora, el componente <em>RepositoryList</em> contiene solo los efectos secundarios y su implementación es bastante simple. Podemos probar el componente <em>RepositoryListContainer</em> proporcionándole datos de repositorio paginados a través de la propiedad <em>repositories</em> y comprobando que el contenido renderizado tenga la información correcta. Esto se puede lograr etiquetando los nodos del componente <em>RepositoryItem</em> requerido con los props <em>testID</em>.

</div>

<div class="tasks">

### Ejercicios 10.17. - 10.18.

#### Ejercicio 10.17: prueba de la lista de repositorios revisados

Implemente una prueba que garantice que el componente <em>RepositoryListContainer</em> muestre el nombre del repositorio, la descripción, el idioma, el recuento de bifurcaciones, el recuento de observadores de estrellas, el promedio de calificación y el recuento de reseñas correctamente. Recuerde que puede usar el comparador [toHaveTextContent](https://github.com/testing-library/jest-native#tohavetextcontent) para verificar si un nodo tiene cierto contenido textual. Puede usar la consulta [getAllByTestId](https://callstack.github.io/react-native-testing-library/docs/api-queries#getallby) para obtener todos los nodos con un determinado prop <em>testID</em> como una matriz. Si no está seguro de lo que se está procesando, use la función [debug](https://callstack.github.io/react-native-testing-library/docs/api#debug) para ver el resultado de la representación serializada.

Use esto como base para su prueba:

```javascript
describe('RepositoryList', () => {
  describe('RepositoryListContainer', () => {
    it('renders repository information correctly', () => {
      const repositories = {
        pageInfo: {
          totalCount: 8,
          hasNextPage: true,
          endCursor:
            'WyJhc3luYy1saWJyYXJ5LnJlYWN0LWFzeW5jIiwxNTg4NjU2NzUwMDc2XQ==',
          startCursor: 'WyJqYXJlZHBhbG1lci5mb3JtaWsiLDE1ODg2NjAzNTAwNzZd',
        },
        edges: [
          {
            node: {
              id: 'jaredpalmer.formik',
              fullName: 'jaredpalmer/formik',
              description: 'Build forms in React, without the tears',
              language: 'TypeScript',
              forksCount: 1619,
              stargazersCount: 21856,
              ratingAverage: 88,
              reviewCount: 3,
              ownerAvatarUrl:
                'https://avatars2.githubusercontent.com/u/4060187?v=4',
            },
            cursor: 'WyJqYXJlZHBhbG1lci5mb3JtaWsiLDE1ODg2NjAzNTAwNzZd',
          },
          {
            node: {
              id: 'async-library.react-async',
              fullName: 'async-library/react-async',
              description: 'Flexible promise-based React data loader',
              language: 'JavaScript',
              forksCount: 69,
              stargazersCount: 1760,
              ratingAverage: 72,
              reviewCount: 3,
              ownerAvatarUrl:
                'https://avatars1.githubusercontent.com/u/54310907?v=4',
            },
            cursor:
              'WyJhc3luYy1saWJyYXJ5LnJlYWN0LWFzeW5jIiwxNTg4NjU2NzUwMDc2XQ==',
          },
        ],
      };

      // Add your test code here
    });
  });
});
```

Puede poner el archivo de prueba donde desee. Sin embargo, se recomienda seguir una de las formas de organizar los archivos de prueba presentados anteriormente. Utilice la variable <em>repositories</em> como datos del repositorio para la prueba. No debería ser necesario modificar el valor de la variable. Tenga en cuenta que los datos del repositorio contienen dos repositorios, lo que significa que debe comprobar que la información de ambos repositorios esté presente.

#### Ejercicio 10.18: probar el formulario de inicio de sesión

Implemente una prueba que garantice que al completar los campos de nombre de usuario y contraseña del formulario de inicio de sesión y presionar el botón de envío <i>se llamará</i> al controlador <em>onSubmit</em> con <i>argumentos correctos</i>. El <i>primer argumento</i> del controlador debe ser un objeto que represente los valores del formulario. Puede ignorar los otros argumentos de la función. Recuerde que los métodos [fireEvent](https://callstack.github.io/react-native-testing-library/docs/api#fireevent) se pueden usar para activar eventos y una [función simulada](https://jestjs.io/docs/en/mock-function-api) para comprobar si se llama o no al controlador <em>onSubmit</em>.

No tiene que probar ningún código relacionado con Apollo Client o AsyncStorage que se encuentre en el enlace <em>useSignIn</em>. Como en el ejercicio anterior, extraiga el código puro en su propio componente y pruébelo en la prueba.

Tenga en cuenta que los envíos de formularios de Formik son <i>asíncronos</i>, por lo que esperar que se llame a la función <em>onSubmit</em> inmediatamente después de presionar el botón enviar no funcionará. Puede solucionar este problema haciendo que la función de prueba sea una función asíncrona utilizando la palabra clave <em>async</em> y utilizando [waitFor](https://callstack.github.io/react-native-testing-library/docs/api#waitfor) función auxiliar. La función <em>waitFor</em> se puede utilizar para esperar a que pasen las expectativas. Si las expectativas no pasan dentro de un período determinado, la función arrojará un error. Aquí hay un ejemplo aproximado de cómo usarlo:

```javascript
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
// ...

describe('SignIn', () => {
  describe('SignInContainer', () => {
    it('calls onSubmit function with correct arguments when a valid form is submitted', async () => {
      // render the SignInContainer component, fill the text inputs and press the submit button

      await waitFor(() => {
        // expect the onSubmit function to have been called once and with a correct first argument
      });
    });
  });
});
```

Es posible que se enfrente a los siguientes mensajes de advertencia: <em>Warning: An update to Formik inside a test was not wrapped in act(...)</em> [<em>Advertencia: una actualización de Formik dentro de una prueba no se incluyó en act (...)</em>]. Esto sucede porque las llamadas al método <em>fireEvent</em> provocan llamadas asincrónicas en la lógica interna de Formik. Puede deshacerse de estos mensajes envolviendo cada una de las llamadas al método <em>fireEvent</em> con la función [act](https://www.native-testing-library.com/docs/next/api-main# act) como esta:

```javascript
await act(async () => {
  // call the fireEvent method here
});
```

</div>

<div class="content">

### Ampliando nuestra aplicación

Es hora de poner en práctica todo lo que hemos aprendido hasta ahora y empezar a ampliar nuestra aplicación. Nuestra aplicación aún carece de algunas características importantes, como revisar un repositorio y registrar un usuario. Los próximos ejercicios se centrarán en estas características esenciales.

</div>

<div class="tasks">

### Ejercicios 10.19. - 10.24.

#### Ejercicio 10.19: la vista del repositorio único

Implemente una vista para un repositorio único, que contiene la misma información del repositorio que en la lista de repositorios revisados, pero también un botón para abrir el repositorio en GitHub. Sería una buena idea reutilizar el componente <em>RepositoryItem</em> utilizado en <em>RepositoryList</em>

La URL del repositorio está en el campo <em>url</em> del tipo <em>Repository</em> en el esquema GraphQL. Puede obtener un único repositorio del servidor Apollo con la consulta <em>repository</em>. La consulta tiene un solo argumento, que es el id del repositorio. Aquí hay un ejemplo simple de la consulta de <em>repository</em>:

```javascript
{
  repository(id: "jaredpalmer.formik") {
    id
    fullName
    url
  }
}
```

Como siempre, primero pruebe sus consultas en el campo de juegos GraphQL antes de usarlas en su aplicación. Si no está seguro sobre el esquema GraphQL o cuáles son las consultas disponibles, abra la pestaña <i>docs</i> o <i>schema</i> en el área de juegos GraphQL. Si tiene problemas para usar el id como una variable en la consulta, tómese un momento para estudiar la [documentación](https://www.apollographql.com/docs/react/data/queries/) de Apollo Client sobre las consultas.

Para saber cómo abrir una URL en un navegador, lea la [documentación de la API de vinculación](https://docs.expo.io/workflow/linking/) de Expo. Necesitará esta función al implementar el botón para abrir el repositorio en GitHub.

La vista debe tener su propia ruta. Sería una buena idea definir la identificación del repositorio en la ruta de la dirección como un parámetro del mismo, al que puede acceder utilizando el hook [useParams](https://reacttraining.com/react-router/native/api/Hooks/useparams ). El usuario debería poder acceder a la vista presionando un repositorio en la lista de repositorios revisados. Puede lograr esto, por ejemplo, envolviendo el <em>RepositoryItem</em> con un componente [TouchableOpacity](https://reactnative.dev/docs/touchableopacity) en el componente <em>RepositoryList</em> y usando <em>history.push</em> para cambiar la ruta en un controlador de eventos <em>onPress</em>. Puede acceder al objeto <em>history</em> con el hook [useHistory](https://reacttraining.com/react-router/native/api/Hooks/usehistory).

La versión final de la vista del repositorio único debería verse así:

![Application preview](../../images/10/13.jpg)

#### Ejercicio 10.20: lista de revisión del repositorio

Ahora que tenemos una vista para un solo repositorio, mostraremos las revisiones del repositorio allí. Las revisiones del repositorio se encuentran en el campo <em>reviews</em> del tipo <em>Repository</em> en el esquema GraphQL. <em>reviews</em> es una lista paginada similar a la de la consulta <em>repositories</em>. Aquí hay un ejemplo de cómo obtener reseñas de un repositorio:

```javascript
{
  repository(id: "jaredpalmer.formik") {
    id
    fullName
    reviews {
      edges {
        node {
          id
          text
          rating
          createdAt
          user {
            id
            username
          }
        }
      }
    }
  }
}
```

El campo <em>text</em> de la reseña contiene la revisión textual, el campo <em>rating</em> una clasificación numérica entre 0 y 100, y <em >createdAt</em> la fecha en que se creó la revisión. El campo <em>user</em> de la reseña contiene la información del revisor, que es del tipo <em>User</em>.

Queremos mostrar las reseñas como una lista desplazable, lo que hace que [FlatList](https://reactnative.dev/docs/flatlist) sea un componente adecuado para el trabajo. Para mostrar la información del repositorio del ejercicio anterior en la parte superior de la lista, puede utilizar los componentes <em>FlatList</em> y el prop [ListHeaderComponent](https://reactnative.dev/docs/flatlist#listheadercomponent). Puede usar [ItemSeparatorComponent](https://reactnative.dev/docs/flatlist#itemseparatorcomponent) para agregar algo de espacio entre los elementos como en el componente <em>RepositoryList</em>. Aquí hay un ejemplo de la estructura:

```javascript
const RepositoryInfo = ({ repository }) => {
  // Repository's information implemented in the previous exercise
};

const ReviewItem = ({ review }) => {
  // Single review item
};

const SingleRepository = () => {
  // ...

  return (
    <FlatList
      data={reviews}
      renderItem={({ item }) => <ReviewItem review={item} />}
      keyExtractor={({ id }) => id}
      ListHeaderComponent={() => <RepositoryInfo repository={repository} />}
      // ...
    />
  );
};

export default SingleRepository;
```

La versión final de la lista de reseñas del repositorio debería verse así:

![Application preview](../../images/10/14.jpg)

La fecha bajo el nombre de usuario del revisor es la fecha de creación de la revisión, que se encuentra en el campo <em>createdAt</em> del tipo <em>Review</em>. El formato de la fecha debe ser fácil de usar, como <i>date.month.year</i>. Por ejemplo, puede instalar la librería [date-fns](https://date-fns.org/) y usar la función [format](https://date-fns.org/v2.13.0/docs/format) para formatear la fecha de creación.

La forma redonda del contenedor de la calificación se puede lograr con la propiedad de estilo <em>borderRadius</em>. Puede redondearlo fijando la propiedad de estilo <em>width</em> y <em>height</em> del contenedor y estableciendo el radio del borde como <em>width/2</em>.

#### Ejercicio 10.21: el formulario de revisión

Implemente un formulario para crear una revisión usando Formik. El formulario debe tener cuatro campos: nombre de usuario de GitHub del propietario del repositorio (por ejemplo, "jaredpalmer"), nombre del repositorio (por ejemplo, "formik"), una calificación numérica y una revisión textual. Valide los campos utilizando el esquema Yup para que contenga las siguientes validaciones:

- El nombre de usuario del propietario del repositorio es una cadena obligatoria
- El nombre del repositorio es una cadena obligatoria
- La calificación es un número obligatorio entre 0 y 100
- La revisión es una cadena opcional

Explore la [documentación](https://github.com/jquense/yup#yup) de Yup  para encontrar validadores adecuados. Utilice mensajes de error sensibles con los validadores. El mensaje de validación se puede definir como el argumento <em>message</em> del método de validación. Puede hacer que el campo de revisión se expanda a varias líneas utilizando el componente [multiline](https://reactnative.dev/docs/textinput#multiline) del componente <em>TextInput</em>.

Puede crear una revisión mediante la mutación <em>createReview</em>. Verifique los argumentos de esta mutación en la pestaña _docs_ en el campo de juegos de GraphQL. Puede usar el hook [useMutation](https://www.apollographql.com/docs/react/api/react-hooks/#usemutation) para enviar una mutación al servidor Apollo.

Después de una mutación de <em>createReview</em> exitosa, redirija al usuario a la vista del repositorio que implementó en el ejercicio anterior. Esto se puede hacer con el método <em>history.push</em> después de haber obtenido el objeto de historial usando el hook [useHistory](https://reacttraining.com/react-router/native/api/Hooks/usehistory). La revisión creada tiene un campo <em>repositoryId</em> que puede usar para construir la ruta de la dirección.

Para evitar la obtención de datos almacenados en caché con la consulta de <em>repository</em> en la vista de repositorio único, use la [política de recuperación](https://www.apollographql.com/docs/react/data/queries/#configuring-fetch-logic) _caché-and-network_ en la consulta. Se puede usar con el hook <em>useQuery</em> como este:

```javascript
useQuery(GET_REPOSITORY, {
  fetchPolicy: 'cache-and-network',
  // Other options
});
```

Tenga en cuenta que solo <i>un repositorio público de GitHub</i> se puede revisar y un usuario puede revisar el mismo repositorio <i>solo una vez</i>. No tiene que manejar estos casos de error, pero la carga útil del error incluye códigos y mensajes específicos para estos errores. Puede probar su implementación revisando uno de sus propios repositorios públicos o cualquier otro repositorio público.

El formulario de revisión debe ser accesible a través de la barra de la aplicación. Cree una pestaña en la barra de la aplicación con la etiqueta "Create a review". Esta pestaña solo debe ser visible para los usuarios que hayan iniciado sesión. También deberá definir una ruta para el formulario de revisión.

La versión final del formulario de revisión debería verse así:

![Application preview](../../images/10/15.jpg)

Esta captura de pantalla se ha tomado después del envío de un formulario no válido para presentar cómo debería verse el formulario en un estado no válido.

#### Ejercicio 10.22: el formulario de registro

Implemente un formulario de registro para registrar un usuario mediante Formik. El formulario debe tener tres campos: nombre de usuario, contraseña y confirmación de contraseña. Valide el formulario utilizando el esquema Yup para que contenga las siguientes validaciones:

- El nombre de usuario es una cadena obligatoria con una longitud entre 1 y 30
- La contraseña es una cadena obligatoria con una longitud entre 5 y 50
- La confirmación de la contraseña coincide con la contraseña

La validación del campo de confirmación de contraseña puede ser un poco complicada, pero se puede hacer, por ejemplo, usando los métodos [oneOf](https://github.com/jquense/yup#mixedoneofarrayofvalues-arrayany-message-string--function-schema-alias-equals) y [ref](https://github.com/jquense/yup#yuprefpath-string-options--contextprefix-string--ref) como se sugiere en [este problema](https://github.com/jaredpalmer/formik/issues/90#issuecomment-354873201).

Puede crear un nuevo usuario utilizando la mutación <em>createUser</em>. Descubra cómo funciona esta mutación explorando la documentación en el campo de juegos GraphQL. Después de una mutación de <em>createUser</em> exitosa, inicie sesión con el usuario creado utilizando el hook <em>useSignIn</em> como hicimos en el formulario de inicio de sesión. Una vez que el usuario haya iniciado sesión, redirija al usuario a la vista de lista de repositorios revisados.

El usuario debería poder acceder al formulario de registro a través de la barra de la aplicación presionando la pestaña "Sign up". Esta pestaña solo debe ser visible para los usuarios que no han iniciado sesión.

La versión final del formulario de registro debe tener un aspecto parecido a esto:

![Application preview](../../images/10/16.jpg)

Este Se tomó una captura de pantalla después del envío de un formulario no válido para presentar cómo debería verse el formulario en un estado no válido.

#### Ejercicio 10.23: clasificación de la lista de repositorios revisados

En este momento, los repositorios de la lista de repositorios revisados ​​están ordenados por la fecha de la primera revisión del repositorio. Implementar una función que permita a los usuarios seleccionar el principio, que se utiliza para ordenar los repositorios. Los principios de pedido disponibles deben ser:

- Últimos repositorios. El repositorio con la primera revisión más reciente está en la parte superior de la lista. Este es el comportamiento actual y debería ser el principio predeterminado.
- Repositorios mejor calificados. El repositorio con la calificación promedio <i>más alta</i> está en la parte superior de la lista.
- Repositorios de menor calificación. El repositorio con la calificación promedio <i>más baja</i> está en la parte superior de la lista.

La consulta <em>repositories</em> que se utiliza para obtener los repositorios revisados ​​tiene un argumento llamado <em>orderBy</em>, que puede utilizar para definir el principio de ordenación. El argumento tiene dos valores permitidos: <em>CREATED_AT</em> (ordenar por la fecha de la primera revisión del repositorio) y <em>RATING_AVERAGE</em>, (ordenar por la calificación promedio del repositorio). La consulta también tiene un argumento llamado <em>orderDirection</em> que puede usarse para cambiar la dirección del pedido. El argumento tiene dos valores permitidos: <em>ASC</em> (ascendente, el valor más pequeño primero) y <em>DESC</em> (descendente, el valor más grande primero).

El estado del principio de orden seleccionado se puede mantener, por ejemplo, usando el hook [useState](https://reactjs.org/docs/hooks-reference.html#usestate) de React. Las variables utilizadas en la consulta <em>repositories</em> se pueden proporcionar al hook <em>useRepositories</em> como argumento.

Puede utilizar, por ejemplo, la librería [react-native-picker](https://www.npmjs.com/package/react-native-picker-select) o el componente [React Native Paper](https://callstack.github.io/react-native-paper/) de la libería [Menú](https://callstack.github.io/react-native-paper/menu.html) para implementar la selección del principio de ordenación. Puede utilizar el prop [ListHeaderComponent](https://reactnative.dev/docs/flatlist#listheadercomponent) del componente <em>FlatList</em> para proporcionar a la lista un encabezado que contenga el componente de selección.

La versión final de la función, dependiendo del componente de selección en uso, debería verse así:

![Application preview](../../images/10/17.jpg)

#### Ejercicio 10.24: filtrado de lista de repositorios revisados

El servidor Apollo permite filtrar repositorios utilizando el nombre del repositorio o el nombre de usuario del propietario. Esto se puede hacer usando el argumento <em>searchKeyword</em> en la consulta <em>repositories</em>. A continuación, se muestra un ejemplo de cómo usar el argumento en una consulta:

```javascript
{
  repositories(searchKeyword: "ze") {
    edges {
      node {
        id
        fullName
      }
    }
  }
}
```

Implemente una función para filtrar la lista de repositorios revisados ​​según una palabra clave. Los usuarios deben poder escribir una palabra clave en una entrada de texto y la lista debe filtrarse a medida que el usuario escribe. Puede usar un componente <em>TextInput</em> simple o algo un poco más elegante como el componente [Searchbar](https://callstack.github.io/react-native-paper/searchbar.html) de React Native Paper como la entrada de texto. Coloque el componente de entrada de texto en el encabezado del componente <em>FlatList</em>.

Para evitar una multitud de solicitudes innecesarias mientras el usuario escribe la palabra clave rápidamente, solo elija la última entrada después de un breve retraso. Esta técnica a menudo se conoce como [debouncing](https://lodash.com/docs/4.17.15#debounce). La biblioteca [use-debounce](https://www.npmjs.com/package/use-debounce) es un hook útil para eliminar el rebote de una variable de estado. Úselo con un tiempo de retardo razonable, como 500 milisegundos. Almacene el valor de la entrada de texto usando el hook <em>useState</em> y pase el valor sin rebote a la consulta como el valor del argumento <em>searchKeyword</em>.

Probablemente se enfrente al problema de que el componente de entrada de texto pierde el foco después de cada pulsación de tecla. Esto se debe a que el contenido proporcionado por el prop <em>ListHeaderComponent</em> se desmonta constantemente. Esto se puede solucionar convirtiendo el componente que renderiza al componente <em>FlatList</em> en un componente de clase y definiendo la función de representación del encabezado como una propiedad de clase como esta:

```javascript
export class RepositoryListContainer extends React.Component {
  renderHeader = () => {
    // this.props contains the component's props
    const props = this.props;
    
    // ...
  
    return (
      <RepositoryListHeader
      // ...
      />
    );
  };

  render() {
    return (
      <FlatList
        // ...
        ListHeaderComponent={this.renderHeader}
      />
    );
  }
}
```

La versión final de la función de filtrado debería verse así:

![Application preview](../../images/10/18.jpg)

</div>

<div class="content">

### Paginación basada en cursor

Cuando una API devuelve una lista ordenada de elementos de alguna colección, generalmente devuelve un subconjunto de todo el conjunto de elementos para reducir el ancho de banda requerido y disminuir el uso de memoria de las aplicaciones cliente. El subconjunto deseado de elementos se puede parametrizar para que el cliente pueda solicitar, por ejemplo, los primeros veinte elementos de la lista después de algún índice. Esta técnica se conoce comúnmente como <i>paginación</i>. Cuando se pueden solicitar elementos después de un elemento determinado definido por un <i>cursor</i>, estamos hablando de <i>paginación basada en cursor</i>.

Por tanto, el cursor es solo una presentación serializada de un elemento en una lista ordenada. Echemos un vistazo a los repositorios paginados devueltos por la consulta <em>repositories</em> utilizando la siguiente consulta:

```javascript
{
  repositories(first: 2) {
    edges {
      node {
        id
        fullName
        createdAt
      }
      cursor
    }
    pageInfo {
      endCursor
      startCursor
      totalCount
      hasNextPage
    }
  }
}
```

El <em>primer</em> argumento le dice a la API que devuelva solo los dos primeros repositorios. Aquí hay un ejemplo de un resultado de la consulta:

```javascript
{
  "data": {
    "repositories": {
      "edges": [
        {
          "node": {
            "id": "zeit.next.js",
            "fullName": "zeit/next.js",
            "createdAt": "2020-05-15T11:59:57.557Z"
          },
          "cursor": "WyJ6ZWl0Lm5leHQuanMiLDE1ODk1NDM5OTc1NTdd"
        },
        {
          "node": {
            "id": "zeit.swr",
            "fullName": "zeit/swr",
            "createdAt": "2020-05-15T11:58:53.867Z"
          },
          "cursor": "WyJ6ZWl0LnN3ciIsMTU4OTU0MzkzMzg2N10="
        }
      ],
      "pageInfo": {
        "endCursor": "WyJ6ZWl0LnN3ciIsMTU4OTU0MzkzMzg2N10=",
        "startCursor": "WyJ6ZWl0Lm5leHQuanMiLDE1ODk1NDM5OTc1NTdd",
        "totalCount": 10,
        "hasNextPage": true
      }
    }
  }
}
```

En el objeto de resultado, tenemos la matriz <em>edges</em> que contiene elementos con los atributos <em>node</em> y <em>cursor</em>. Como sabemos, el <em>nodo</em> contiene el repositorio en sí. El <em>cursor</em> del otro es una representación codificada en Base64 del nodo. Contiene la identificación del repositorio y la fecha de creación del repositorio como una marca de tiempo. Esta es la información que necesitamos para señalar el elemento cuando se ordenan según el momento de creación del repositorio. <em>pageInfo</em> contiene información como el cursor del primer y último elemento de la matriz.

Digamos que queremos obtener el siguiente conjunto de elementos <i>después</i> del último elemento del conjunto actual, que es el repositorio "zeit/swr". Podemos establecer el argumento <em>after</em> de la consulta como el valor del <em>endCursor</em> así:

```javascript
{
  repositories(first: 2, after: "WyJ6ZWl0LnN3ciIsMTU4OTU0MzkzMzg2N10=") {
    edges {
      node {
        id
        fullName
        createdAt
      }
      cursor
    }
    pageInfo {
      endCursor
      startCursor
      totalCount
      hasNextPage
    }
  }
}
```

Ahora que tenemos los siguientes dos elementos y podemos seguir haciendo esto hasta que <em>hasNextPage</em> tenga el valor <em>false</em>, lo que significa que hemos llegado al final de la lista. Para profundizar en la paginación basada en el cursor, lee el artículo de Shopify [Paginación con cursores relativos](https://engineering.shopify.com/blogs/engineering/pagination-relative-cursors). Proporciona grandes detalles sobre la implementación en sí y los beneficios sobre la paginación tradicional basada en índices.

### Desplazamiento infinito

Las listas de desplazamiento vertical en aplicaciones móviles y de escritorio se implementan comúnmente mediante una técnica llamada <i>desplazamiento infinito</i>. El principio del desplazamiento infinito es bastante simple:

- Obtener el conjunto inicial de elementos
- Cuando el usuario alcanza el último elemento, recupera el siguiente conjunto de elementos después del último elemento.

El segundo paso se repite hasta que el usuario se cansa de desplazarse o se excede algún límite de desplazamiento. El nombre "desplazamiento infinito" se refiere a la forma en que la lista parece ser infinita: el usuario puede seguir desplazándose y siguen apareciendo nuevos elementos en la lista.

Echemos un vistazo a cómo funciona esto en la práctica utilizando el hook <em>useQuery</em> del cliente Apollo. Apollo Client tiene una excelente [documentación](https://www.apollographql.com/docs/react/data/pagination/#cursor-based) sobre la implementación de la paginación basada en cursor. Implementemos el desplazamiento infinito para la lista de repositorios revisados ​​como ejemplo.

Primero, necesitamos saber cuándo el usuario ha llegado al final de la lista. Afortunadamente, el componente <em>FlatList</em> tiene un prop [onEndReached](https://reactnative.dev/docs/flatlist#onendreached), que llamará a la función proporcionada una vez que el usuario se haya desplazado hasta el último elemento de la lista. Puede cambiar la anticipación con la que se llama a la devolución de llamada <em>onEndReach</em> usando el prop [onEndReachedThreshold](https://reactnative.dev/docs/flatlist#onendreachedthreshold). Modifique el componente <em> FlatList </em> del componente <em>RepositoryList</em> para que llame a una función una vez que se alcance el final de la lista:

```javascript
export const RepositoryListContainer = ({
  repositories,
  onEndReach,
  /* ... */,
}) => {
  const repositoryNodes = repositories
    ? repositories.edges.map((edge) => edge.node)
    : [];

  return (
    <FlatList
      data={repositoryNodes}
      // ...
      onEndReached={onEndReach}
      onEndReachedThreshold={0.5}
    />
  );
};

const RepositoryList = () => {
  // ...

  const { repositories } = useRepositories(/* ... */);

  const onEndReach = () => {
    console.log('You have reached the end of the list');
  };

  return (
    <RepositoryListContainer
      repositories={repositories}
      onEndReach={onEndReach}
      // ...
    />
  );
};

export default RepositoryList;
```

Intente desplazarse hasta el final de la lista de repositorios revisados ​​y debería ver el mensaje en los registros.

A continuación, necesitamos buscar más repositorios una vez que se llega al final de la lista. Esto se puede lograr utilizando la función [fetchMore](https://www.apollographql.com/docs/react/data/pagination/#cursor-based) proporcionada por el hook <em>useQuery</em>. Modifiquemos el hook <em>useRepositories</em> para que devuelva una función <em>fetchMore</em> decorada, que llama a la función <em>fetchMore</em> real con el <em>endCursor</em> y actualiza la consulta correctamente con los datos obtenidos:

```javascript
const useRepositories = (variables) => {
  const { data, loading, fetchMore, ...result } = useQuery(GET_REPOSITORIES, {
    variables,
    // ...
  });

  const handleFetchMore = () => {
    const canFetchMore =
      !loading && data && data.repositories.pageInfo.hasNextPage;

    if (!canFetchMore) {
      return;
    }

    fetchMore({
      query: GET_REPOSITORIES,
      variables: {
        after: data.repositories.pageInfo.endCursor,
        ...variables,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const nextResult = {
          repositories: {
            ...fetchMoreResult.repositories,
            edges: [
              ...previousResult.repositories.edges,
              ...fetchMoreResult.repositories.edges,
            ],
          },
        };

        return nextResult;
      },
    });
  };

  return {
    repositories: data ? data.repositories : undefined,
    fetchMore: handleFetchMore,
    loading,
    ...result,
  };
};
```

Asegúrese de tener los campos <em>pageInfo</em> y <em>cursor</em> en su consulta de <em>repositories</em> como se describe en los ejemplos de paginación. También deberá incluir los argumentos <em>after</em> y <em>first</em> para la consulta.

La función <em>handleFetchMore</em> llamará a la función <em>fetchMore</em> del Cliente Apollo si hay más elementos para recuperar, lo cual está determinado por la propiedad <em>hasNextPage</em>. También queremos evitar la recuperación de más elementos si la recuperación ya está en proceso. En este caso, <em>loading</em> será <em>true</em>. En la función <em>fetchMore</em> proporcionamos a la consulta una variable <em>after</em>, que recibe el último valor <em>endCursor</em>. En <em>updateQuery</em> fusionaremos los bordes anteriores con los bordes obtenidos y actualizaremos la consulta para que <em>pageInfo</em> contenga la información más reciente.

El último paso es llamar a la función <em>fetchMore</em> en el manejador <em>onEndReach</em>:

```javascript
const RepositoryList = () => {
  // ...

  const { repositories, fetchMore } = useRepositories({
    first: 8,
    // ...
  });

  const onEndReach = () => {
    fetchMore();
  };

  return (
    <RepositoryListContainer
      repositories={repositories}
      onEndReach={onEndReach}
      // ...
    />
  );
};

export default RepositoryList;
```

Utilice un valor de argumento <em>first</em> relativamente pequeño, como 8, mientras prueba el desplazamiento infinito. De esta forma, no es necesario revisar demasiados repositorios. Es posible que se enfrente a un problema de que se llame al controlador <em>onEndReach</em> inmediatamente después de que se cargue la vista. Lo más probable es que esto se deba a que la lista contiene tan pocos repositorios que se llega al final de la lista inmediatamente. Puede solucionar este problema aumentando el valor del argumento <em>first</em>. Una vez que esté seguro de que el desplazamiento infinito está funcionando, no dude en utilizar un valor mayor para el argumento <em>first</em>.

</div>

<div class="tasks">

### Ejercicios 10.25.-10.27.

#### Ejercicio 10.25: desplazamiento infinito para la lista de revisiones del repositorio

Implemente el desplazamiento infinito para la lista de revisiones del repositorio. El campo <em>reviews</em> del tipo <em>Repository</em> tiene los argumentos <em>first</em> y <em>after</em> similares a las consultas <em>repositories</em>. El tipo <em>ReviewConnection</em> también tiene el campo <em>pageInfo</em> al igual que el tipo <em>RepositoryConnection</em>.

Aquí hay un ejemplo de consulta:

```javascript
{
  repository(id: "jaredpalmer.formik") {
    id
    fullName
    reviews(first: 2, after: "WyIxYjEwZTRkOC01N2VlLTRkMDAtODg4Ni1lNGEwNDlkN2ZmOGYuamFyZWRwYWxtZXIuZm9ybWlrIiwxNTg4NjU2NzUwMDgwXQ==") {
      edges {
        node {
          id
          text
          rating
          createdAt
          repositoryId
          user {
            id
            username
          }
        }
        cursor
      }
      pageInfo {
        endCursor
        startCursor
        totalCount
        hasNextPage
      }
    }
  }
}
```

Al igual que con la lista de repositorios revisada, use un valor de argumento <em>first</em> relativamente pequeño mientras está probando el desplazamiento infinito. Es posible que deba crear algunos usuarios nuevos y usarlos para crear algunas reseñas nuevas para que la lista de reseñas sea lo suficientemente larga como para desplazarse. Establezca el valor del argumento <em>first</em> lo suficientemente alto para que el controlador <em>onEndReach</em> no se llame inmediatamente después de que se cargue la vista, pero lo suficientemente bajo para que pueda ver que más reseñas se recuperan una vez que llega al final de la lista. Una vez que todo funcione según lo previsto, puede utilizar un valor mayor para el argumento <em>first</em>.

#### Ejercicio 10.26: vista de reseñas de usuarios

Implemente una función que permita al usuario ver sus reseñas. Una vez que haya iniciado sesión, el usuario debería poder acceder a esta vista presionando la pestaña "My reviews" en la barra de la aplicación. La implementación de un desplazamiento infinito para la lista de revisión es _opcional_ en este ejercicio. Así es como debería verse aproximadamente la vista de lista de revisión:

![Application preview](../../images/10/20.jpg)

Recuerde que puede buscar al usuario autorizado del servidor Apollo con la consulta <em>autorizadoUser</em>. Esta consulta devuelve un tipo <em>User</em>, que tiene un campo <em>reviews</em>. Si ya ha implementado una consulta <em>authorizedUser</em> reutilizable en su código, puede personalizar esta consulta para obtener el campo <em>reviews</em> de forma condicional. Esto se puede hacer usando la directiva de GraphQL [include](https://graphql.org/learn/queries/#directives).

Digamos que la consulta actual se implementa aproximadamente de la siguiente manera:

```javascript
const GET_AUTHORIZED_USER = gql`
  query {
    authorizedUser {
      # user fields...
    }
  }
`;
```

Puede proporcionar la consulta con un argumento <em>includeReviews</em> y utilizarlo con la directiva <em>include</em>:

```javascript
const GET_AUTHORIZED_USER = gql`
  query getAuthorizedUser($includeReviews: Boolean = false) {
    authorizedUser {
      # user fields...
      reviews @include(if: $includeReviews) {
        edges {
          node {
            # review fields...
          }
          cursor
        }
        pageInfo {
          # page info fields...
        }
      }
    }
  }
`;
```

El argumento <em>includeReviews</em> tiene un valor predeterminado de <em>false</em>, porque no queremos causar una sobrecarga adicional del servidor a menos que queramos explícitamente obtener las revisiones de los usuarios autorizados. El principio de la directiva <em>include</em> es bastante simple: si el valor del argumento <em>if</em> es <em>true</em>, incluya el campo, de lo contrario omítalo.

#### Ejercicio 10.27: revisar acciones

Ahora que el usuario puede ver sus reseñas, agreguemos algunas acciones a las reseñas. Debajo de cada revisión en la lista de revisión, debe haber dos botones. Un botón es para ver el repositorio de la revisión. Presionar este botón debería llevar al usuario a la revisión del repositorio único implementada en el ejercicio anterior. El otro botón es para eliminar el repositorio. Al presionar este botón se debería eliminar la revisión. Así es como deberían verse las acciones:

![Application preview](../../images/10/21.jpg)

Al presionar el botón delete debe seguir una alerta de confirmación. Si el usuario confirma la eliminación, la revisión se elimina. De lo contrario, la eliminación se descarta. Puede implementar la confirmación utilizando el módulo [Alerta](https://reactnative.dev/docs/alert). Tenga en cuenta que llamar al método <em>Alert.alert</em> no abrirá ninguna ventana en la vista previa web de Expo. Use la aplicación móvil Expo o un emulador para ver cómo se ve la ventana de alerta.

Aquí está la alerta de confirmación que debería aparecer una vez que el usuario presione el botón delete:

![Application preview](../../images/10/22.jpg)

Puede eliminar una revisión mediante la mutación <em>deleteReview</em>. Esta mutación tiene un solo argumento, que es el id de la revisión que se eliminará. Una vez realizada la mutación, la forma más sencilla de actualizar la consulta de la lista de revisión es llamar a la función [refetch](https://www.apollographql.com/docs/react/data/queries/#refetching).

Este fue el último ejercicio de esta sección. Es hora de enviar tu código a GitHub y marcar todos tus ejercicios terminados en el [sistema de envío de ejercicios](https://studies.cs.helsinki.fi/stats/courses/fs-react-native-2020). Tenga en cuenta que los ejercicios de esta sección deben enviarse a la parte 4 del sistema de envío de ejercicios.

</div>

<div class="content">

### Recursos adicionales

A medida que nos acercamos al final de esta parte, tomemos un momento para ver algunos recursos adicionales relacionados con React Native. [Awesome React Native](https://github.com/jondot/awesome-react-native) es una lista de recursos de React Native extremadamente completa, como liberías, tutoriales y artículos. Debido a que la lista es exhaustivamente larga, echemos un vistazo más de cerca a algunos de sus aspectos más destacados.

#### React Native Paper

> Paper es una colección de componentes personalizables y listos para producción para React Native, siguiendo las pautas de Material Design de Google.

[React Native Paper](https://callstack.github.io/react-native-paper/) es para React Native lo que [Material-UI](https://material-ui.com/) es para las aplicaciones web de React. Ofrece una amplia gama de componentes de interfaz de usuario de alta calidad y compatibilidad con [temas personalizados](https://callstack.github.io/react-native-paper/theming.html). [Configurar](https://callstack.github.io/react-native-paper/getting-started.html) React Native Paper para las aplicaciones React Native basadas en Expo es bastante simple, lo que hace posible su uso en el próximo ejercicios si quieres intentarlo.

#### Styled-components

> Utilizando template literals etiquetados (una adición reciente a JavaScript) y el poder de CSS, los componentes con estilo le permiten escribir código CSS real para diseñar sus componentes. También elimina el mapeo entre componentes y estilos: ¡usar componentes como una construcción de estilo de bajo nivel no podría ser más fácil!

[Styled-components](https://styled-components.com/) es una librería para diseñar componentes de React usando [CSS-in-JS](https://en.wikipedia.org/wiki/CSS-in-JS ) técnica. En React Native ya estamos acostumbrados a definir los estilos de los componentes como un objeto JavaScript, por lo que CSS-in-JS no es un territorio tan inexplorado. Sin embargo, el enfoque de los componentes con estilo es bastante diferente de usar el método <em>StyleSheet.create</em> y el prop <em>style</em>.

En los componentes con estilo, los estilos de los componentes se definen con el componente utilizando una función llamada [template litearal etiquetado](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_templates) o un Objeto JavaScript. Styled-components hace posible definir nuevas propiedades de estilo para el componente en función de sus props _en tiempo de ejecución_. Esto ofrece muchas posibilidades, como cambiar sin problemas entre un tema claro y uno oscuro. También tiene un [soporte de temas](https://styled-components.com/docs/advanced#theming) completo . Aquí hay un ejemplo de cómo crear un componente <em>Text</em> con variaciones de estilo basadas en props:

```javascript
import React from 'react';
import styled from 'styled-components/native';
import { css } from 'styled-components';

const FancyText = styled.Text`
  color: grey;
  font-size: 14px;

  ${({ isBlue }) =>
    isBlue &&
    css`
      color: blue;
    `}

  ${({ isBig }) =>
    isBig &&
    css`
      font-size: 24px;
      font-weight: 700;
    `}
`;

const Main = () => {
  return (
    <>
      <FancyText>Simple text</FancyText>
      <FancyText isBlue>Blue text</FancyText>
      <FancyText isBig>Big text</FancyText>
      <FancyText isBig isBlue>
        Big blue text
      </FancyText>
    </>
  );
};
```

Debido a que los componentes con estilo procesan las definiciones de estilo, es posible utilizar una sintaxis de mayúsculas y minúsculas similar a CSS con los nombres de propiedad y las unidades en los valores de propiedad. Sin embargo, las unidades no tienen ningún efecto porque los valores de las propiedades no tienen unidades internas. Para obtener más información sobre los componentes con estilo, diríjase a la [documentación](https://styled-components.com/docs).

#### React-spring

> react-spring es una librería de animación basada en la física de spring que debería cubrir la mayoría de tus necesidades de animación relacionadas con la interfaz de usuario. Le brinda herramientas lo suficientemente flexibles para transmitir con confianza sus ideas en interfaces móviles.

[React-spring](https://www.react-spring.io/) es una librería que proporciona una [ hook API](https://www.react-spring.io/docs/hooks/basics) limpia para animar componentes React Native.

#### Navegación React

> Enrutamiento y navegación para sus aplicaciones React Native

[React Navigation](https://reactnavigation.org/) es una librería de enrutamiento para React Native. Comparte algunas similitudes con la biblioteca React Router que hemos estado usando durante esta y partes anteriores. Sin embargo, a diferencia de React Router, React Navigation ofrece más funciones nativas, como gestos nativos y animaciones para la transición entre vistas.

### Palabras de cierre

Eso es todo, nuestra aplicación está lista. ¡Buen trabajo! Hemos aprendido muchos conceptos nuevos durante nuestro viaje, como configurar nuestra aplicación React Native usando Expo, usar los componentes centrales de React Native y agregarles estilo, comunicarnos con el servidor y probar aplicaciones React Native. La última pieza del rompecabezas sería implementar la aplicación en Apple App Store y Google Play Store.

La implementación de la aplicación es completamente <i>opcional</i> y no es del todo trivial, porque también necesitas bifurcar e implementar la [rate-repository-api](https://github.com/fullstack-hy2020/rate-repository-api). Para la propia aplicación React Native, primero debes crear compilaciones de iOS o Android siguiendo la [documentación](https://docs.expo.io/distribution/building-standalone-apps/) de Expo. Luego, puede cargar estas compilaciones en Apple App Store o Google Play Store. Expo tiene una [documentación](https://docs.expo.io/distribution/uploading-apps/) para esto también.

</div>
