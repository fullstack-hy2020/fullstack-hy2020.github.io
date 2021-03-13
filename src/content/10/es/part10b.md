---
mainImage: ../../../images/part-10.svg
part: 10
letter: b
lang: es
---

<div class="content">

Ahora que hemos configurado nuestro entorno de desarrollo podemos adentrarnos en los conceptos básicos de React Native y comenzar con el desarrollo de nuestra aplicación. En esta sección, aprenderemos cómo construir interfaces de usuario con los componentes centrales de React Native, cómo agregar propiedades de estilo a estos componentes centrales, cómo hacer la transición entre vistas y cómo administrar el estado del formulario de manera eficiente.

### Componentes principales

En las partes anteriores, hemos aprendido que podemos usar React para definir componentes como funciones que reciben props como argumento y devuelven un árbol de elementos React. Este árbol generalmente se representa con sintaxis JSX. En el entorno del navegador, hemos utilizado la biblioteca [ReactDOM](https://reactjs.org/docs/react-dom.html) para convertir estos componentes en un árbol DOM que puede ser renderizado por un navegador. Aquí hay un ejemplo concreto de un componente muy simple:

```javascript
import React from 'react';

const HelloWorld = props => {
  return <div>Hello world!</div>;
};
```

El componente <em>HelloWorld</em> devuelve un único elemento <i>div</i> que se crea utilizando la sintaxis JSX. Podríamos recordar que esta sintaxis JSX se compila en llamadas al método <em>React.createElement</em>, como esta:

```javascript
React.createElement('div', null, 'Hello world!');
```

Esta línea de código crea un elemento <i>div</i> sin ningún prop y con un solo elemento hijo que es una cadena <i>"Hello World"</i>. Cuando renderizamos este componente en un elemento DOM raíz usando el método <em>ReactDOM.render</em>, el elemento <i>div</i> se renderizará como el elemento DOM correspondiente.

Como podemos ver, React no está vinculado a un entorno determinado, como el entorno del navegador. En cambio, existen bibliotecas como ReactDOM que pueden representar <i>un conjunto de componentes predefinidos</i>, como elementos DOM, en un entorno específico. En React Native, estos componentes predefinidos se denominan <i>componentes principales</i>.

Los [componentes principales](https://reactnative.dev/docs/intro-react-native-components) son un conjunto de componentes proporcionados por React Native que, entre bastidores, utilizan los componentes nativos de la plataforma. Implementemos el ejemplo anterior usando React Native:

```javascript
import React from 'react';
import { Text } from 'react-native'; // highlight-line

const HelloWorld = props => {
  return <Text>Hello world!</Text>; // highlight-line
};
```

Así que importamos el componente [Text](https://reactnative.dev/docs/text) de React Native y reemplazamos el elemento <i>div</i> con un elemento <i>Text</i> . Muchos elementos DOM familiares tienen sus "contrapartes" de React Native. Aquí hay algunos ejemplos seleccionados de la [documentación de los componentes principales](https://reactnative.dev/docs/components-and-apis) de React Native:

- El componente [Texto](https://reactnative.dev/docs/text) es <i>el único</i> componente de React Native que puede tener hijos textuales. Es similar, por ejemplo, a los elementos <em>&lt;strong&gt;</em> y <em>&lt;h1&gt;</em>.
- El componente [View](https://reactnative.dev/docs/view) es el componente básico de la interfaz de usuario similar al <em>&lt;div&gt;</em>
- El componente [TextInput](https://reactnative.dev/docs/textinput) es un componente de campo de texto similar al elemento <em>&lt;input&gt;</em>.
- El componente [TouchableWithoutFeedback](https://reactnative.dev/docs/touchablewithoutfeedback) (y otros componentes <i>Touchable*</i>) sirve para capturar diferentes eventos de prensa. Es similar, por ejemplo, al elemento <em>&lt;button&gt;</em>.

Hay algunas diferencias notables entre los componentes principales y los elementos DOM. La primera diferencia es que el componente <em>Text</em> es <i>el único</i> componente React Native que puede tener hijos textuales. Esto significa que no puede, por ejemplo, reemplazar el componente <em>Texto</em> con el <em>Ver</em>

La segunda diferencia notable está relacionada con los controladores de eventos. Mientras trabajamos con los elementos DOM, estamos acostumbrados a agregar controladores de eventos como <em>onClick</em> básicamente a cualquier elemento como <em>&lt;div&gt;</em> y <em>&lt;button&gt;</em>. En React Native tenemos que leer detenidamente la [documentación de la API](https://reactnative.dev/docs/components-and-apis) para saber qué controladores de eventos (así como otros accesorios) acepta un componente. Por ejemplo, la familia de [componentes "Tocables"](https://reactnative.dev/docs/handling-touches#touchables) proporciona la capacidad de capturar gestos táctiles y puede mostrar comentarios cuando se reconoce un gesto. Uno de estos componentes es el componente [TouchableWithoutFeedback](https://reactnative.dev/docs/touchablewithoutfeedback), que acepta la propiedad <em>onPress</em>:

```javascript
import React from 'react';
import { Text, TouchableWithoutFeedback, Alert } from 'react-native';

const TouchableText = props => {
  return (
    <TouchableWithoutFeedback
      onPress={() => Alert.alert('You pressed the text!')}
    >
      <Text>You can press me</Text>
    </TouchableWithoutFeedback>
  );
};
```

Ahora que tenemos una comprensión básica de los componentes centrales, comencemos a darle a nuestro proyecto algo de estructura. Cree un directorio <i>src</i> en el directorio raíz de su proyecto y en el directorio <i>src</i> cree un directorio <i>components</i>. En el directorio <i>components</i> cree un archivo <i> Main.jsx </i> con el siguiente contenido:

```javascript
import React from 'react';
import Constants from 'expo-constants';
import { Text, StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight,
    flexGrow: 1,
    flexShrink: 1,
  },
});

const Main = () => {
  return (
    <View style={styles.container}>
      <Text>Rate Repository Application</Text>
    </View>
  );
};

export default Main;
```

A continuación, usemos el componente <em>Main</em> en el componente <em>App</em> en el archivo <i>App.js</i> que se encuentra en el directorio raíz de nuestro proyecto. Reemplace el contenido actual del archivo con esto:

```javascript
import React from 'react';

import Main from './src/components/Main';

const App = () => {
  return <Main />;
};

export default App;
```

### Recarga manual de la aplicación

Como hemos visto, Expo recargará automáticamente la aplicación cuando hagamos cambios en el código. Sin embargo, puede haber ocasiones en las que la recarga automática no funcione y la aplicación deba recargarse manualmente. Esto se puede lograr a través del menú de desarrollador de la aplicación.

Puede acceder al menú del desarrollador agitando su dispositivo o seleccionando "Shake Gesture" dentro del menú Hardware en el simulador de iOS. También puedes usar el método abreviado de teclado <em>⌘D</em> cuando tu aplicación se está ejecutando en el simulador de iOS, o <em>⌘M</em> cuando se ejecuta en un emulador de Android en Mac OS y <em>Ctrl + M</em> en Windows y Linux.

Una vez que el menú del desarrollador esté abierto, simplemente presione "Recargar" para volver a cargar la aplicación. Una vez que se ha recargado la aplicación, las recargas automáticas deberían funcionar sin la necesidad de una recarga manual.

</div>

<div class="tasks">

### Ejercicio 10.3.

#### Ejercicio 10.3: la lista de repositorios revisados

En este ejercicio, implementaremos la primera versión de la lista de repositorios revisados. La lista debe contener el nombre completo del repositorio, la descripción, el idioma, la cantidad de bifurcaciones, la cantidad de estrellas, la calificación promedio y la cantidad de reseñas. Afortunadamente, React Native proporciona un componente útil para mostrar una lista de datos, que es el componente [FlatList](https://reactnative.dev/docs/flatlist).

Implemente los componentes <em>RepositoryList</em> y <em>RepositoryItem</em> en los archivos del directorio <i>components</i> <i>RepositoryList.jsx</i> y <i>RepositoryItem.jsx</i>. El componente <em>RepositoryList</em> debe representar el componente <em>FlatList</em> y <em>RepositoryItem</em> como un solo elemento en la lista (pista: use el prop del componente de <em>FlatList</em> [renderItem](https://reactnative.dev/docs/flatlist#renderitem)). Use esto como base para el archivo <i>RepositoryList.jsx</i>:

```javascript
import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
});

const repositories = [
  {
    id: 'jaredpalmer.formik',
    fullName: 'jaredpalmer/formik',
    description: 'Build forms in React, without the tears',
    language: 'TypeScript',
    forksCount: 1589,
    stargazersCount: 21553,
    ratingAverage: 88,
    reviewCount: 4,
    ownerAvatarUrl: 'https://avatars2.githubusercontent.com/u/4060187?v=4',
  },
  {
    id: 'rails.rails',
    fullName: 'rails/rails',
    description: 'Ruby on Rails',
    language: 'Ruby',
    forksCount: 18349,
    stargazersCount: 45377,
    ratingAverage: 100,
    reviewCount: 2,
    ownerAvatarUrl: 'https://avatars1.githubusercontent.com/u/4223?v=4',
  },
  {
    id: 'django.django',
    fullName: 'django/django',
    description: 'The Web framework for perfectionists with deadlines.',
    language: 'Python',
    forksCount: 21015,
    stargazersCount: 48496,
    ratingAverage: 73,
    reviewCount: 5,
    ownerAvatarUrl: 'https://avatars2.githubusercontent.com/u/27804?v=4',
  },
  {
    id: 'reduxjs.redux',
    fullName: 'reduxjs/redux',
    description: 'Predictable state container for JavaScript apps',
    language: 'TypeScript',
    forksCount: 13902,
    stargazersCount: 52869,
    ratingAverage: 0,
    reviewCount: 0,
    ownerAvatarUrl: 'https://avatars3.githubusercontent.com/u/13142323?v=4',
  },
];

const ItemSeparator = () => <View style={styles.separator} />;

const RepositoryList = () => {
  return (
    <FlatList
      data={repositories}
      ItemSeparatorComponent={ItemSeparator}
      // other props
    />
  );
};

export default RepositoryList;
```

<i>No</i> altere el contenido de la variable <em>repositories</em>, debe contener todo lo que necesita para completar este ejercicio. Renderice el componente <em>RepositoryList</em> en el componente <em>Main</em> que agregamos previamente al archivo <i>Main.jsx</i>. La lista de repositorios revisada debería verse más o menos así:

![Vista previa de la aplicación](../../images/10/5.jpg)

</div>

<div class="content">

### Estilo

Ahora que tenemos una comprensión básica de cómo funcionan los componentes centrales y podemos usarlos para construir una interfaz de usuario simple, es hora de agregar algo de estilo. En la [parte 2](/es/part2/added_styles_to_react_app) aprendimos que en el entorno del navegador podemos definir las propiedades de estilo del componente React usando CSS. Teníamos la opción de definir estos estilos en línea usando el accesorio <em>style</em> o en un archivo CSS con un selector adecuado.

Hay muchas similitudes en la forma en que las propiedades de estilo se adjuntan a los componentes centrales de React Native y en la forma en que se adjuntan a los elementos DOM. En React Native, la mayoría de los componentes principales aceptan un prop llamado <em>style</em>. El prop <em>style</em> acepta un objeto con propiedades de estilo y sus valores. Estas propiedades de estilo son en la mayoría de los casos las mismas que en CSS, sin embargo, los nombres de las propiedades están en <i>camelCase</i>. Esto significa que las propiedades CSS como <em>padding-top</em> y <em>font-size</em> se escriben como <em>paddingTop</em> y <em>fontSize</em>. Aquí hay un ejemplo simple de cómo usar el <em>style</em> prop:

```javascript
import React from 'react';
import { Text, View } from 'react-native';

const BigBlueText = () => {
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ color: 'blue', fontSize: 24, fontWeight: '700' }}>
        Big blue text
      </Text>
    </View>
  );
};
```

Además de los nombres de las propiedades, es posible que haya notado otra diferencia en el ejemplo. En CSS, los valores de las propiedades numéricas suelen tener una unidad como <i>px</i>, <i>%</i>, <i>em</i> o <i>rem</i>. En React Native, todos los valores de propiedad relacionados con la dimensión, como <em>width</em>, <em>height</em>, <em>padding</em> y <em>margin</em>, así como la fuente los tamaños son <i>sin unidades</i>. Estos valores numéricos sin unidades representan <i>píxeles independientes de la densidad</i>. En caso de que se esté preguntando cuáles son las propiedades de estilo disponibles para cierto componente principal, consulte la [Hoja de trucos de estilo nativo de React](https://github.com/vhpoet/react-native-styling-cheat-sheet).

En general, definir estilos directamente en el objeto <em>style</em> no se considera una gran idea, porque hace que los componentes se vuelvan inflados y poco claros. En cambio, deberíamos definir estilos fuera de la función de renderización del componente usando el método [StyleSheet.create](https://reactnative.dev/docs/0.53/stylesheet#create). El método <em>StyleSheet.create</em> acepta un único argumento que es un objeto que consta de objetos de estilo con nombre y crea una referencia de estilo StyleSheet a partir del objeto dado. Aquí hay un ejemplo de cómo refactorizar el ejemplo anterior usando el método <em>StyleSheet.create</em>:

```javascript
import React from 'react';
import { Text, View, StyleSheet } from 'react-native'; // highlight-line

// highlight-start
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  text: {
    color: 'blue',
    fontSize: 24,
    fontWeight: '700',
  },
});
// highlight-end

const BigBlueText = () => {
  return (
    <View style={styles.container}> // highlight-line
      <Text style={styles.text}> // highlight-line
        Big blue text
      <Text>
    </View>
  );
};
```

Creamos dos objetos de estilo con nombre, <em>styles.container</em> y <em>styles.text</em>. Dentro del componente, podemos acceder a un objeto de estilo específico de la misma manera que accederíamos a cualquier clave en un objeto simple.

Además de un objeto, el prop <em>style</em> también acepta una matriz de objetos. En el caso de una matriz, los objetos se fusionan de izquierda a derecha para que las últimas propiedades de estilo tengan prioridad. Esto funciona de forma recursiva, por lo que podemos tener, por ejemplo, una matriz que contenga una matriz de estilos, etc. Si una matriz contiene valores que se evalúan como falsos, como <em>null</em> o <em>undefined</em>, estos valores se ignoran. Esto facilita la definición de <i>estilos condicionales</i>, por ejemplo, basándose en el valor de una propiedad. Aquí hay un ejemplo de estilos condicionales:

```javascript
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  text: {
    color: 'grey',
    fontSize: 14,
  },
  blueText: {
    color: 'blue',
  },
  bigText: {
    fontSize: 24,
    fontWeight: '700',
  },
});

const FancyText = ({ isBlue, isBig, children }) => {
  const textStyles = [
    styles.text,
    isBlue && styles.blueText,
    isBig && styles.bigText,
  ];

  return <Text style={textStyles}>{children}</Text>;
};

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

En el ejemplo usamos el operador <em>&&</em> con la instrucción <em>condition && exprIfTrue</em>. Esta declaración produce <em>exprIfTrue</em> si la <em>condition</em> se evalúa como verdadera; de lo contrario, producirá <em>condition</em>, que en ese caso es un valor que se evalúa como falso. Se trata de una abreviatura práctica y muy utilizada. Otra opción sería usar, por ejemplo, el [operador condicional](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator), <em>condition ? exprIfTrue : exprIfFalse</em>.

### Interfaz de usuario coherente con temas

Sigamos con el concepto de estilo, pero con una perspectiva un poco más amplia. La mayoría de nosotros hemos utilizado una multitud de aplicaciones diferentes y podríamos estar de acuerdo en que una característica que hace que una buena interfaz de usuario sea la <i>coherencia</i>. Esto significa que la apariencia de los componentes de la interfaz de usuario, como el tamaño de fuente, la familia de fuentes y el color, sigue un patrón constante. Para lograr esto, tenemos que <i>parametrizar</i> de alguna manera los valores de diferentes propiedades de estilo. Este método se conoce comúnmente como <i>tematización</i>.

Los usuarios de librerías de interfaces de usuario populares como [Bootstrap](https://getbootstrap.com/docs/4.4/getting-started/theming/) y [Material UI](https://material-ui.com/customization/theming/) puede que ya esté bastante familiarizado con la temática. Aunque las implementaciones de temas son diferentes, la idea principal es siempre usar variables como <em>colors.primary</em> en lugar de ["números mágicos"](<https://en.wikipedia.org/wiki/Magic_number_ (programación)>) como <em>#0366d6</em> al definir estilos. Esto conduce a una mayor consistencia y flexibilidad.

Veamos cómo la tematización podría funcionar en la práctica en nuestra aplicación. Usaremos mucho texto con diferentes variaciones, como diferentes tamaños de fuente y colores. Debido a que React Native no admite estilos globales, deberíamos crear nuestro propio componente <em>Text</em> para mantener la coherencia del contenido textual. Comencemos agregando el siguiente objeto de configuración de tema en un archivo <i>theme.js</i> en el directorio <i>src</i>:

```javascript
const theme = {
  colors: {
    textPrimary: '#24292e',
    textSecondary: '#586069',
    primary: '#0366d6',
  },
  fontSizes: {
    body: 14,
    subheading: 16,
  },
  fonts: {
    main: 'System',
  },
  fontWeights: {
    normal: '400',
    bold: '700',
  },
};

export default theme;
```

A continuación, deberíamos crear el componente actual <em>Text</em> que utiliza esta configuración de tema. Cree un archivo <i>Text.jsx</i> en el directorio <i>components</i> donde ya tenemos nuestros otros componentes. Agregue el siguiente contenido al archivo <i>Text.jsx</i>:

```javascript
import React from 'react';
import { Text as NativeText, StyleSheet } from 'react-native';

import theme from '../theme';

const styles = StyleSheet.create({
  text: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSizes.body,
    fontFamily: theme.fonts.main,
    fontWeight: theme.fontWeights.normal,
  },
  colorTextSecondary: {
    color: theme.colors.textSecondary,
  },
  colorPrimary: {
    color: theme.colors.primary,
  },
  fontSizeSubheading: {
    fontSize: theme.fontSizes.subheading,
  },
  fontWeightBold: {
    fontWeight: theme.fontWeights.bold,
  },
});

const Text = ({ color, fontSize, fontWeight, style, ...props }) => {
  const textStyle = [
    styles.text,
    color === 'textSecondary' && styles.colorTextSecondary,
    color === 'primary' && styles.colorPrimary,
    fontSize === 'subheading' && styles.fontSizeSubheading,
    fontWeight === 'bold' && styles.fontWeightBold,
    style,
  ];

  return <NativeText style={textStyle} {...props} />;
};

export default Text;
```

Ahora hemos implementado nuestro propio componente de texto con variantes de color, tamaño de fuente y peso de fuente consistentes que podemos usar en cualquier lugar de nuestra aplicación. Podemos obtener diferentes variaciones de texto usando diferentes props como este:

```javascript
import React from 'react';

import Text from './Text';

const Main = () => {
  return (
    <>
      <Text>Simple text</Text>
      <Text style={{ paddingBottom: 10 }}>Text with custom style</Text>
      <Text fontWeight="bold" fontSize="subheading">
        Bold subheading
      </Text>
      <Text color="textSecondary">Text with secondary color</Text>
    </>
  );
};

export default Main;
```

No dude en ampliar o modificar este componente si lo desea. También puede ser una buena idea crear componentes de texto reutilizables como <em>Subheading</em> que utilizan el componente <em>Text</em>. Además, siga ampliando y modificando la configuración del tema a medida que avanza su aplicación.

### Usando flexbox para el diseño

El último concepto que cubriremos relacionado con el estilo es implementar diseños con [flexbox](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox). Aquellos que están más familiarizados con CSS saben que flexbox no está relacionado solo con React Native, también tiene muchos casos de uso en el desarrollo web. De hecho, aquellos que saben cómo funciona flexbox en el desarrollo web probablemente no aprenderán mucho de esta sección. Sin embargo, aprendamos o revisemos los conceptos básicos de flexbox.

Flexbox es una entidad de diseño que consta de dos componentes separados: un <i>contenedor flexible</i> y dentro de él un conjunto de <i>elementos flexibles</i>. El contenedor flexible tiene un conjunto de propiedades que controlan el flujo de sus artículos. Para convertir un componente en un contenedor flexible, debe tener la propiedad de estilo <em>display</em> establecida como <em>flex</em>, que es el valor predeterminado para la propiedad <em>display</em>. Aquí hay un ejemplo de un contenedor flexible:

```javascript
import React from 'react';
import { View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  flexContainer: {
    flexDirection: 'row',
  },
});

const FlexboxExample = () => {
  return <View style={styles.flexContainer}>{/* ... */}</View>;
};
```

Quizás las propiedades más importantes de un contenedor flexible son las siguientes:

- la propiedad [flexDirection](https://css-tricks.com/almanac/properties/f/flex-direction/) controla la dirección en la que los artículos flex se colocan dentro del contenedor. Los valores posibles para esta propiedad son <em>row</em>, <em>row-reverse</em>, <em>column</em> (valor predeterminado) y <em>reverse-column</em>. La dirección de flex <em>row</em> colocará los elementos flexibles de izquierda a derecha, mientras que la <em>column</em> de arriba a abajo. Las direcciones <em>*-reverse</em> simplemente invertirán el orden de los elementos flexibles.

- La propiedad [justifyContent](https://css-tricks.com/almanac/properties/j/justify-content/) controla la alineación de los elementos flexibles a lo largo del eje principal (definido por la propiedad <em>flexDirection</em>). Los valores posibles para esta propiedad son <em>flex-start</em> (valor predeterminado), <em>flex-end</em>, <em>center</em>, <em>space-between</em>, <em>space-around</em> y <em>space-evenly</em>.

- La propiedad [alignItems](https://css-tricks.com/almanac/properties/a/align-items/) hace lo mismo que <em>justifyContent</em> pero para el eje opuesto. Los valores posibles para esta propiedad son <em>flex-start</em>, <em>flex-end</em>, <em>center</em>, <em>baseline</em> y <em>stretch</em> (valor predeterminado).

Pasemos a los elementos flexibles. Como se mencionó, un contenedor flexible puede contener uno o varios elementos flexibles. Los elementos flexibles tienen propiedades que controlan cómo se comportan con respecto a otros elementos flexibles en el mismo contenedor flexible. Para convertir un componente en un elemento flexible, todo lo que tiene que hacer es configurarlo como hijo inmediato de un contenedor flexible:

```javascript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  flexContainer: {
    display: 'flex',
  },
  flexItemA: {
    flexGrow: 0,
    backgroundColor: 'green',
  },
  flexItemB: {
    flexGrow: 1,
    backgroundColor: 'blue',
  },
});

const FlexboxExample = () => {
  return (
    <View style={styles.flexContainer}>
      <View style={styles.flexItemA}>
        <Text>Flex item A</Text>
      </View>
      <View style={styles.flexItemB}>
        <Text>Flex item B</Text>
      </View>
    </View>
  );
};
```

Una de las propiedades más utilizadas del elemento flexible es la propiedad [flexGrow](https://css-tricks.com/almanac/properties/f/flex-grow/). Acepta un valor sin unidades que define la capacidad de un artículo flexible para crecer si es necesario. Si todos los elementos flexibles tienen un <em>flexGrow</em> de <em>1</em>, compartirán todo el espacio disponible de manera uniforme. Si un elemento flexible tiene un <em>flexGrow</em> de <em>0</em>, solo usará el espacio que requiere su contenido y dejará el resto del espacio para otros elementos flexibles.

Aquí hay un ejemplo más interactivo y concreto de cómo usar flexbox para implementar un componente de tarjeta simple con encabezado, cuerpo y pie de página: [ejemplo de Flexbox](https://snack.expo.io/@kalleilv/3d045d).

A continuación, lea el artículo [Una guía completa de Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) que tiene ejemplos visuales completos de flexbox. También es una buena idea jugar con las propiedades de flexbox en [Flexbox Playground](https://demos.scotch.io/visual-guide-to-css3-flexbox-flexbox-playground/demos/) para ver cómo diferentes propiedades de flexbox afectan el diseño. Recuerde que en React Native los nombres de las propiedades son los mismos que los de CSS excepto por el nombre en <i>camelCase</i>. Sin embargo, los <i>valores de propiedad</i> como <em>flex-start</em> y <em>space-between</em> son exactamente iguales.

**NB:** React Native y CSS tienen algunas diferencias con respecto al flexbox. La diferencia más importante es que en React Native el valor predeterminado para la propiedad <em>flexDirection</em> es <em>column</em>. También vale la pena señalar que la abreviatura <em>flex</em> no acepta múltiples valores en React Native. Se puede leer más sobre la implementación de Flexbox de React Native en la [documentación](https://reactnative.dev/docs/flexbox).

</div>

<div class="tasks">

### Ejercicios 10.4. - 10,5.

#### Ejercicio 10.4: la barra de aplicaciones

Pronto necesitaremos navegar entre diferentes vistas en nuestra aplicación. Es por eso que necesitamos una [barra de aplicaciones](https://material.io/components/app-bars-top/) para mostrar pestañas para cambiar entre diferentes vistas. Cree un archivo <i>AppBar.jsx</i> en la carpeta <i>components</i> con el siguiente contenido:

```javascript
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    // ...
  },
  // ...
});

const AppBar = () => {
  return <View style={styles.container}>{/* ... */}</View>;
};

export default AppBar;
```

Ahora que el componente <em>AppBar</em> evitará que la barra de estado se superponga al contenido, puede eliminar el estilo <em>marginTop</em> que agregamos anteriormente para el componente <em>Main</em> en el archivo <i>Main.jsx</i>. El componente <em>AppBar</em> debería contener actualmente una pestaña con el texto "Repositorios". Haga que la pestaña sea táctil usando el componente [TouchableWithoutFeedback](https://reactnative.dev/docs/touchablewithoutfeedback) pero no tiene que manejar el evento <em>onPress</em> de ninguna manera. Agregue el componente <em>AppBar</em> al componente <em>Main</em> para que sea el componente superior en la pantalla. El componente <em>AppBar</em> debería verse algo como esto:

![Application preview](../../images/10/6.jpg)

El color de fondo de la barra de la aplicación en la imagen es <em>#24292e</em>, pero también puede usar cualquier otro color. Puede ser una buena idea agregar el color de fondo de la barra de la aplicación en la configuración del tema para que sea fácil cambiarlo si es necesario. Otra buena idea podría ser separar la pestaña de la barra de la aplicación en su propio componente, como <em>AppBarTab</em> para que sea fácil agregar nuevas pestañas en el futuro.

#### Ejercicio 10.5: lista de repositorios revisados ​​y pulida

La versión actual de la lista de repositorios revisada parece bastante sombría. Modifique el componente <i>RepositoryListItem</i> para que también muestre la imagen de avatar del autor del repositorio. Puede implementar esto utilizando el componente [Image](https://reactnative.dev/docs/image). Los recuentos, como el número de estrellas y forks, mayores o iguales a 1000 deben mostrarse en miles con una precisión de un decimal y con un sufijo "k". Esto significa que, por ejemplo, el recuento de bifurcaciones de 8439 debería mostrarse como "8.4k". También pule el aspecto general del componente para que la lista de repositorios revisados ​​se vea así:

![Vista previa de la aplicación](../../images/10/7.jpg)

En la imagen, el color de fondo del componente <em>Main</em> se establece en <em>#e1e4e8</em> mientras que el color de fondo del componente <em>RepositoryListItem</em> se establece en <em>white</em >. El color de fondo de la etiqueta de idioma es <em>#0366d6</em>, que es el valor de la variable <em>colors.primary</em> en la configuración del tema. Recuerde explotar el componente <em>Text</em> que implementamos anteriormente. Además, cuando sea necesario, divida el componente <em>RepositoryListItem</em> en componentes más pequeños.

</div>

<div class="content">

### Enrutamiento

Cuando comencemos a expandir nuestra aplicación, necesitaremos una forma de transición entre diferentes vistas, como la vista de repositorios y la vista de inicio de sesión. En la [parte 7](/es/part7/react_router) nos familiarizamos con la biblioteca [React router](https://reacttraining.com/react-router/native/guides/quick-start) y aprendimos cómo usarla para implementar el enrutamiento en una aplicación web.

El enrutamiento en una aplicación React Native es un poco diferente al enrutamiento en una aplicación web. La principal diferencia es que no podemos hacer referencia a páginas con URL, que escribimos en la barra de direcciones del navegador, y no podemos navegar hacia adelante y hacia atrás a través del historial del usuario usando los navegadores [API de historial](https://developer.mozilla.org/en-US/docs/Web/API/History_API). Sin embargo, esto es solo cuestión de la interfaz del enrutador que estamos usando.

Con React Native podemos usar todo el núcleo del enrutador React, incluidos los ganchos y componentes. La única diferencia con el entorno del navegador es que debemos reemplazar el <em>BrowserRouter</em> con [NativeRouter](https://reacttraining.com/react-router/native/api/NativeRouter) compatible con React Native , proporcionado por la biblioteca [react-router-native](https://reacttraining.com/react-router/native/guides/quick-start). Comencemos instalando la librería <i>react-router-native</i>:

```shell
npm install react-router-native
```

El uso de la librería react-router-native romperá la vista previa del navegador web de Expo. Sin embargo, otras vistas previas funcionarán igual que antes. Podemos solucionar el problema ampliando la configuración del Webpack de la Expo para que transpile las fuentes de la biblioteca react-router-native con Babel. Para extender la configuración de Webpack, necesitamos instalar la librería <i>@expo/webpack-config</i>:

```shell
npm install @expo/webpack-config --save-dev
```

A continuación, cree un <i>archivo webpack.config.js</i> en el directorio raíz de su proyecto con el siguiente contenido:

```javascript
const path = require('path');
const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function(env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  config.module.rules.push({
    test: /\.js$/,
    loader: 'babel-loader',
    include: [path.join(__dirname, 'node_modules/react-router-native')],
  });

  return config;
};
```

Finalmente, reinicie las herramientas de desarrollo de Expo para que se aplique nuestra nueva configuración de Webpack.

Ahora que la vista previa del navegador web de la Expo está arreglada, abra el archivo <i>App.js</i> y agregue el componente <em>NativeRouter</em> al componente <em>App</em>:

<!-- TODO: resaltar -->

```javascript
import React from 'react';
import { NativeRouter } from 'react-router-native'; // highlight-line

import Main from './src/components/Main';

const App = () => {
  return (
    <NativeRouter> // highlight-line
      <Main />
    </NativeRouter> // highlight-line
  );
};

export default App;
```

Una vez que el enrutador esté en su lugar, agreguemos nuestra primera ruta al componente <em>Main</em> en el archivo <i>Main.jsx</i>:

```javascript
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Route, Switch, Redirect } from 'react-router-native'; // highlight-line

import RepositoryList from './RepositoryList';
import AppBar from './AppBar';
import theme from '../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.mainBackground,
    flexGrow: 1,
    flexShrink: 1,
  },
});

const Main = () => {
  return (
    <View style={styles.container}>
      <AppBar />
      // highlight-start
      <Switch>
        <Route path="/" exact>
          <RepositoryList />
        </Route>
        <Redirect to="/" />
      </Switch>
      // highlight-end
    </View>
  );
};

export default Main;
```

</div>

<div class="tasks">

### Ejercicios 10.6. - 10,7.

#### Ejercicio 10.6: la vista de inicio de sesión

Pronto implementaremos un formulario, que un usuario puede usar para <i>iniciar sesión</i> en nuestra aplicación. Antes de eso, debemos implementar una vista a la que se pueda acceder desde la barra de aplicaciones. Cree un archivo <i>SignIn.jsx</i> en el directorio <i>components</i> con el siguiente contenido:

```javascript
import React from 'react';

import Text from './Text';

const SignIn = () => {
  return <Text>The sign in view</Text>;
};

export default SignIn;
```


Configure una ruta para este componente <em>SignIn</em> en el componente <em>Main</em>. También agregue una pestaña con el texto "Sign In" en la barra de la aplicación junto a la pestaña "Repositories". Los usuarios deben poder navegar entre las dos vistas presionando las pestañas (pista: use el componente [Link](https://reacttraining.com/react-router/native/api/Link) y su prop [component](https://reacttraining.com/react-router/native/api/Link/component-func)).

#### Ejercicio 10.7: barra de aplicaciones desplazable

Como estamos agregando más pestañas a nuestra barra de aplicaciones, es una buena idea permitir el desplazamiento horizontal una vez que las pestañas no quepan en la pantalla. El componente [ScrollView](https://reactnative.dev/docs/scrollview) es el componente adecuado para el trabajo.

Envuelva las pestañas en las pestañas del componente <em>AppBar</em> con un componente <em>ScrollView</em>:

```javascript
const AppBar = () => {
  return (
    <View style={styles.container}>
      <ScrollView horizontal>{/* ... */}</ScrollView> // highlight-line
    </View>
  );
};
```

Establecer el prop [horizontal](https://reactnative.dev/docs/scrollview#horizontal) en <em>true</em> hará que el componente <em>ScrollView</em> se desplace horizontalmente una vez que el contenido no encaje en la pantalla. Tenga en cuenta que deberá agregar propiedades de estilo adecuadas al componente <em>ScrollView</em> para que las pestañas se coloquen en una <i>fila</i> dentro del contenedor flexible. Puede asegurarse de que la barra de la aplicación pueda desplazarse horizontalmente agregando pestañas hasta que la última pestaña no se ajuste a la pantalla. Solo recuerde eliminar las pestañas adicionales una vez que la barra de la aplicación esté funcionando según lo previsto.

</div>

<div class="content">

### Gestión del estado del formulario

Ahora que tenemos un marcador de posición para la vista de inicio de sesión, el siguiente paso sería implementar el formulario de inicio de sesión. Antes de llegar a eso, hablemos de las formas en una perspectiva más amplia.

La implementación de formularios depende en gran medida de la gestión del estado. Usar el hook <em>useState</em> de React para la administración del estado podría hacer el trabajo para formularios más pequeños. Sin embargo, rápidamente hará que la gestión de estado sea bastante tediosa con formas más complejas. Afortunadamente, hay muchas bibliotecas buenas en el ecosistema React que facilitan la gestión de estado de formularios. Una de estas bibliotecas es [Formik](https://jaredpalmer.com/formik/).

Los conceptos principales de Formik son el <i>contexto</i> y un <i>campo</i>. El contexto de Formik lo proporciona el componente [Formik](https://jaredpalmer.com/formik/docs/api/formik) que contiene el estado del formulario. El estado consta de información de los campos del formulario. Esta información incluye, por ejemplo, el valor y los errores de validación de cada campo. Se puede hacer referencia a los campos del estado por su nombre utilizando el hook [useField](https://jaredpalmer.com/formik/docs/api/useField) o el componente [Field](https://jaredpalmer.com/formik/docs/api/field).

Veamos cómo funciona esto realmente creando un formulario para calcular el [índice de masa corporal](https://en.wikipedia.org/wiki/Body_mass_index):

```javascript
import React from 'react';
import { Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { Formik, useField } from 'formik';

const initialValues = {
  mass: '',
  height: '',
};

const getBodyMassIndex = (mass, height) => {
  return Math.round(mass / Math.pow(height, 2));
};

const BodyMassIndexForm = ({ onSubmit }) => {
  const [massField, massMeta, massHelpers] = useField('mass');
  const [heightField, heightMeta, heightHelpers] = useField('height');

  return (
    <View>
      <TextInput
        placeholder="Weight (kg)"
        value={massField.value}
        onChangeText={text => massHelpers.setValue(text)}
      />
      <TextInput
        placeholder="Height (m)"
        value={heightField.value}
        onChangeText={text => heightHelpers.setValue(text)}
      />
      <TouchableWithoutFeedback onPress={onSubmit}>
        <Text>Calculate</Text>
      </TouchableWithoutFeedback>
    </View>
  );
};

const BodyMassIndexCalculator = () => {
  const onSubmit = values => {
    const mass = parseFloat(values.mass);
    const height = parseFloat(values.height);

    if (!isNaN(mass) && !isNaN(height) && height !== 0) {
      console.log(`Your body mass index is: ${getBodyMassIndex(mass, height)}`);
    }
  };

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      {({ handleSubmit }) => <BodyMassIndexForm onSubmit={handleSubmit} />}
    </Formik>
  );
};
```

Este ejemplo no es parte de nuestra aplicación, por lo que no es necesario que agregue este código a la aplicación. Sin embargo, puede probarlo, por ejemplo, en [Expo Snack](https://snack.expo.io/). Expo Snack es un editor en línea para React Native, similar a [JSFiddle](https://jsfiddle.net/) y [CodePen](https://codepen.io/). Es una plataforma útil para probar código rápidamente. Puede compartir Expo Snacks con otros usando un enlace o incrustándolos como un <i>Snack Player</i> en un sitio web. Es posible que se haya topado con Snack Players, por ejemplo, en este material y en la documentación de React Native.

En el ejemplo, definimos el contexto <em>Formik</em> en el componente <em>BodyMassIndexCalculator</em> y le proporcionamos valores iniciales y una devolución de llamada de envío. Los valores iniciales se proporcionan a través de la propiedad [initialValues](https://jaredpalmer.com/formik/docs/api/formik#initialvalues-values) como un objeto con nombres de campo como claves y los valores iniciales correspondientes como valores. La devolución de llamada de envío se proporciona a través del prop [onSubmit](https://jaredpalmer.com/formik/docs/api/formik#onsubmit-values-values-formikbag-formikbag--void--promiseany) y se llama cuando el la función <em>handleSubmit</em> es llamada, con la condición de que no haya errores de validación. Los hijos del componente <em>Formik</em> son una función que se llama con [props](https://jaredpalmer.com/formik/docs/api/formik#formik-render-methods-and-props) incluyendo información relacionada con el estado y acciones como la función <em>handleSubmit</em>.

El componente <em>BodyMassIndexForm</em> contiene los enlaces de estado entre el contexto y las entradas de texto. Usamos el hook [useField](https://jaredpalmer.com/formik/docs/api/useField) para obtener el valor de un campo y cambiarlo. El hook _useField_ tiene un argumento que es el nombre del campo y devuelve una matriz con tres valores, <em>[field, meta, helpers]</em>. El [objeto de campo](https://jaredpalmer.com/formik/docs/api/useField#fieldinputpropsvalue) contiene el valor del campo, el [metaobjeto](https://jaredpalmer.com/formik/docs/api/useField#fieldmetapropsvalue) contiene metainformación del campo, como un posible mensaje de error y el [objeto de ayuda](https://jaredpalmer.com/formik/docs/api/useField#fieldhelperprops) contiene diferentes acciones para cambiar el estado del campo, como la función <em>setValue</em>. Tenga en cuenta que el componente que usa el hook <em>useField</em> tiene que estar _dentro del contexto de Formik_. Esto significa que el componente debe ser descendiente del componente <em>Formik</em>.

Aquí hay una versión interactiva de nuestro ejemplo anterior: [Ejemplo de Formik](https://snack.expo.io/@kalleilv/formik-example).

En el ejemplo anterior, el uso del hook <em>useField</em> con el componente <em>TextInput</em> provoca un código repetitivo. Extraigamos este código repetitivo en un componente <em>FormikTextInput</em> y creemos un componente <em>TextInput</em> personalizado para hacer que las entradas de texto sean un poco más agradables visualmente. Primero, instalemos Formik:

```shell
npm install formik
```

A continuación, cree un archivo <i>TextInput.jsx</i> en el directorio <i>components</i> con el siguiente contenido:

```javascript
import React from 'react';
import { TextInput as NativeTextInput, StyleSheet } from 'react-native';

const styles = StyleSheet.create({});

const TextInput = ({ style, error, ...props }) => {
  const textInputStyle = [style];

  return <NativeTextInput style={textInputStyle} {...props} />;
};

export default TextInput;
```

Pasemos al componente <em>FormikTextInput</em> que agrega los enlaces de estado de Formik al componente <em>TextInput</em>. Cree un archivo <i>FormikTextInput.jsx</i> en el directorio <i>components</i> con el siguiente contenido:

```javascript
import React from 'react';
import { StyleSheet } from 'react-native';
import { useField } from 'formik';

import TextInput from './TextInput';
import Text from './Text';

const styles = StyleSheet.create({
  errorText: {
    marginTop: 5,
  },
});

const FormikTextInput = ({ name, ...props }) => {
  const [field, meta, helpers] = useField(name);
  const showError = meta.touched && meta.error;

  return (
    <>
      <TextInput
        onChangeText={value => helpers.setValue(value)}
        onBlur={() => helpers.setTouched(true)}
        value={field.value}
        error={showError}
        {...props}
      />
      {showError && <Text style={styles.errorText}>{meta.error}</Text>}
    </>
  );
};

export default FormikTextInput;
```

Al usar el componente <em>FormikTextInput</em> podríamos refactorizar el componente <em>BodyMassIndexForm</em> en el ejemplo anterior de esta manera:

```javascript
const BodyMassIndexForm = ({ onSubmit }) => {
  return (
    <View>
      <FormikTextInput name="mass" placeholder="Weight (kg)" /> // highlight-line
      <FormikTextInput name="height" placeholder="Height (m)" /> //highlight-line
      <TouchableWithoutFeedback onPress={onSubmit}>
        <Text>Calculate</Text>
      </TouchableWithoutFeedback>
    </View>
  );
};
```

Como podemos ver, la implementación del componente <em>FormikTextInput</em> que maneja los enlaces de Formik del componente <em>TextInput</em> ahorra mucho código. Si sus formularios de Formik utilizan otros componentes de entrada, es una buena idea implementar abstracciones similares para ellos también.

</div>

<div class="tasks">

### Ejercicio 10.8.

#### Ejercicio 10.8: el formulario de inicio de sesión

Implemente un formulario de inicio de sesión en el componente <em>SignIn</em> que agregamos anteriormente en el archivo <i>SignIn.jsx</i>. El formulario de inicio de sesión debe incluir dos campos de texto, uno para el nombre de usuario y otro para la contraseña. También debería haber un botón para enviar el formulario. No es necesario implementar una función de devolución de llamada <em>onSubmit</em>, es suficiente que los valores del formulario se registren usando <em>console.log</em> cuando se envía el formulario:

```javascript
const onSubmit = (values) => {
  console.log(values);
};
```

Recuerde utilizar el componente <em>FormikTextInput</em> que implementamos anteriormente. Puede utilizar el prop [secureTextEntry](https://reactnative.dev/docs/textinput#securetextentry) en el componente <em>TextInput</em> para ocultar la entrada de la contraseña.

El formulario de inicio de sesión debería verse así:

![Application preview](../../images/10/19.jpg)

</div>

<div class="content">

### Validación del formulario

Formik ofrece dos enfoques para la validación de formularios: una función de validación o un esquema de validación. Una función de validación es una función proporcionada para el componente <em>Formik</em> como el valor del prop [validate](https://jaredpalmer.com/formik/docs/guides/validation#validate). Recibe los valores del formulario como argumento y devuelve un objeto que contiene posibles mensajes de error específicos del campo.

El segundo enfoque es el esquema de validación que se proporciona para el componente <em>Formik</em> como el valor del prop [validationSchema](https://jaredpalmer.com/formik/docs/guides/validation#validationschema). Este esquema de validación se puede crear con una librería de validación llamada [Yup](https://github.com/jquense/yup). Comencemos instalando Yup:

```shell
npm install yup
```

A continuación, como ejemplo, creemos un esquema de validación para el formulario de índice de masa corporal que implementamos anteriormente. Queremos validar que los campos <i>mass</i> y <i>height</i> estén presentes y sean numéricos. Además, el valor de <i>mass</i> debe ser mayor o igual a 1 y el valor de <i>height</i> debe ser mayor o igual a 0.5. Así es como definimos el esquema:

```javascript
import React from 'react';
import * as yup from 'yup'; // highlight-line

// ...

// highlight-start
const validationSchema = yup.object().shape({
  mass: yup
    .number()
    .min(1, 'Weight must be greater or equal to 1')
    .required('Weight is required'),
  height: yup
    .number()
    .min(0.5, 'Height must be greater or equal to 0.5')
    .required('Height is required'),
});
// highlight-end

const BodyMassIndexCalculator = () => {
  // ...

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema} // highlight-line
    >
      {({ handleSubmit }) => <BodyMassIndexForm onSubmit={handleSubmit} />}
    </Formik>
  );
};
```

La validación se realiza de forma predeterminada cada vez que cambia el valor de un campo y cuando se llama a la función <em>handleSubmit</em>. Si la validación falla, no se llama a la función provista para la propiedad <em>onSubmit</em> del componente <em>Formik</em>.

El componente <em>FormikTextInput</em> que implementamos anteriormente muestra el mensaje de error del campo si está presente y el campo está "tocado", lo que significa que el campo ha recibido y perdido el foco:

```javascript
const FormikTextInput = ({ name, ...props }) => {
  const [field, meta, helpers] = useField(name);

  // Check if the field is touched and the error message is present
  const showError = meta.touched && meta.error;

  return (
    <>
      <TextInput
        onChangeText={(value) => helpers.setValue(value)}
        onBlur={() => helpers.setTouched(true)}
        value={field.value}
        error={showError}
        {...props}
      />
      {/* Show the error message if the value of showError variable is true  */}
      {showError && <Text style={styles.errorText}>{meta.error}</Text>}
    </>
  );
};
```

</div>

<div class="tasks">

### Ejercicio 10.9.

#### Ejercicio 10.9: validación del formulario de inicio de sesión

Valide el formulario de inicio de sesión para que se requieran los campos de nombre de usuario y contraseña. Tenga en cuenta que la devolución de llamada <em>onSubmit</em> implementada en el ejercicio anterior, <i>no debe llamarse</i> si falla la validación del formulario.

La implementación actual del componente <em>FormikTextInput</em> debería mostrar un mensaje de error si un campo tocado tiene un error. Enfatice este mensaje de error dándole un color rojo.

En la parte superior del mensaje de error rojo, dé a un campo no válido una indicación visual de un error dándole un color de borde rojo. Recuerde que si un campo tiene un error, el componente <em>FormikTextInput</em> establece el prop <em>error</em> del componente <em>TextInput</em> como <em>verdadero</em>. Puede utilizar el valor del prop <em>error</em> para adjuntar estilos condicionales al componente <em>TextInput</em>.

Así es como debería verse el formulario de inicio de sesión con un campo no válido:

![Application preview](../../images/10/8.jpg)

El color rojo utilizado en esta implementación es <em>#d73a4a</em>.

</div>

<div class="content">

### Código específico de la plataforma

Una gran ventaja de React Native es que no tenemos que preocuparnos por si la aplicación se ejecuta en un dispositivo Android o iOS. Sin embargo, puede haber casos en los que necesitemos ejecutar <i>código específico de la plataforma</i>. Tal caso podría ser, por ejemplo, el uso de una implementación diferente de un componente en una plataforma diferente.

Podemos acceder a la plataforma del usuario a través de la constante <em>Platform.OS</em>:

```javascript
import { React } from 'react';
import { Platform, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  text: {
    color: Platform.OS === 'android' ? 'green' : 'blue',
  },
});

const WhatIsMyPlatform = () => {
  return <Text style={styles.text}>Your platform is: {Platform.OS}</Text>;
};
```

Los valores posibles para la constante <em>Platform.OS</em> son <em>android</em> y <em>ios</em>. Otra forma útil de definir ramas de código específicas de la plataforma es utilizar el método <em>Platform.select</em>. Dado un objeto cuyas claves son <em>ios</em>, <em>android</em>, <em>native</em> y <em>default</em>,  El método <em>Platform.select</em> devuelve el valor más adecuado para la plataforma en la que se está ejecutando el usuario. Podemos reescribir la variable <em>styles</em> en el ejemplo anterior usando el método <em>Platform.select</em> como este:

```javascript
const styles = StyleSheet.create({
  text: {
    color: Platform.select({
      android: 'green',
      ios: 'blue',
      default: 'black',
    }),
  },
});
```

Incluso podemos usar el método <em>Platform.select</em> para requerir un componente específico de la plataforma:

```javascript
const MyComponent = Platform.select({
  ios: () => require('./MyIOSComponent'),
  android: () => require('./MyAndroidComponent'),
})();

<MyComponent />;
```

Sin embargo, un método más sofisticado para implementar e importar componentes específicos de la plataforma (o cualquier otro fragmento de código) es utilizar las extensiones de archivo <i>.io.jsx</i> y <i>.android.jsx</i>. Tenga en cuenta que la extensión <i>.jsx</i> también puede ser cualquier extensión reconocida por el paquete, como <i>.js</i>. Por ejemplo, podemos tener archivos <i>Button.ios.jsx</i> que podemos importar así:

```javascript
import React from 'react';

import Button from './Button';

const PlatformSpecificButton = () => {
  return <Button />;
};
```

Ahora, el paquete de Android de la aplicación tendrá el componente definido en <i>Button.android.jsx</i> mientras que el paquete de iOS tendrá uno definido en el archivo <i>Button.ios.jsx</i>.

</div>

<div class="tasks">

### Ejercicio 10.10.

#### Ejercicio 10.10: una fuente específica de la plataforma

Actualmente, la familia de fuentes de nuestra aplicación está configurada en <i>System</i> en la configuración del tema ubicada en el archivo <i>theme.js</i>. En lugar de la fuente <i>System</i>, utilice una fuente [Sans-serif](https://en.wikipedia.org/wiki/Sans-serif) específica de la plataforma. En la plataforma Android use la fuente <i> Roboto </i> y en la plataforma iOS use la fuente <i> Arial </i>. La fuente predeterminada puede ser <i>System</i>.

Este fue el último ejercicio de esta sección. Es hora de enviar tu código a GitHub y marcar todos tus ejercicios terminados en el [sistema de envío de ejercicios](https://studies.cs.helsinki.fi/stats/courses/fs-react-native-2020). Tenga en cuenta que los ejercicios de esta sección deben enviarse a la parte 2 del sistema de envío de ejercicios.

</div>
