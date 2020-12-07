---
mainImage: ../../../images/part-10.svg
part: 10
letter: a
lang: en
---

<div class = "content">

Tradicionalmente, el desarrollo de aplicaciones nativas de iOS y Android ha requirió que el desarrollador utilizara lenguajes de programación y entornos de desarrollo específicos de la plataforma. Para el desarrollo de iOS, esto significa usar Objective C o Swift y para el desarrollo de Android usando lenguajes basados ​​en JVM como Java, Scala o Kotlin. El lanzamiento de una aplicación para ambas plataformas requiere técnicamente desarrollar dos aplicaciones separadas con diferentes lenguajes de programación. Esto requiere muchos recursos de desarrollo.

Uno de los enfoques populares para unificar el desarrollo específico de la plataforma ha sido utilizar el navegador como motor de renderizado. [Cordova](https://cordova.apache.org/) es una de las plataformas más populares para crear aplicaciones multiplataforma. Permite desarrollar aplicaciones multiplataforma utilizando tecnologías web estándar: HTML5, CSS3 y JavaScript. Sin embargo, las aplicaciones de Cordova se ejecutan dentro de una ventana de navegador integrada en el dispositivo del usuario. Es por eso que estas aplicaciones no pueden lograr el rendimiento ni la apariencia de las aplicaciones nativas que utilizan componentes de interfaz de usuario nativos reales.

[React Native](https://reactnative.dev/) es un marco para desarrollar aplicaciones nativas de Android e iOS usando JavaScript y React. Proporciona un conjunto de componentes multiplataforma que, entre bastidores, utilizan los componentes nativos de la plataforma. El uso de React Native nos permite incorporar todas las características familiares de React, como JSX, componentes, accesorios, estado y enlaces al desarrollo de aplicaciones nativas. Además de eso, podemos utilizar muchas bibliotecas conocidas en el ecosistema React, como [react-redux](https://react-redux.js.org/), [react-apollo](https://github.com/apollographql/react-apollo), [react-router](https://reacttraining.com/react-router/core/guides/quick-start) y muchos más.

La velocidad de desarrollo y la curva de aprendizaje suave para los desarrolladores familiarizados con React es uno de los beneficios más importantes de React Native. Aquí hay una cita motivacional del artículo de Coinbase [Incorporación de miles de usuarios con React Native](https://blog.coinbase.com/onboarding-thousands-of-users-with-react-native-361219066df4) sobre los beneficios de React Native:

> Si tuviéramos que reducir los beneficios de React Native a una sola palabra, sería “velocidad”. En promedio, nuestro equipo pudo incorporar ingenieros en menos tiempo, compartir más código (lo que esperamos que conduzca a aumentos de productividad futuros) y, en última instancia, ofrecer funciones más rápido que si hubiéramos adoptado un enfoque puramente nativo.

### Acerca de esta parte

Durante esta parte, aprenderemos cómo construir una aplicación React Native real de abajo hacia arriba. Aprenderemos conceptos tales como cuáles son los componentes centrales de React Native, cómo crear hermosas interfaces de usuario, cómo comunicarse con un servidor y cómo probar una aplicación React Native.

Desarrollaremos una aplicación para calificar repositorios de [GitHub](https://github.com/). Nuestra aplicación tendrá características como ordenar y filtrar los repositorios revisados, registrar un usuario, iniciar sesión y crear una revisión para un repositorio. Se nos proporcionará el back-end de la aplicación para que podamos centrarnos únicamente en el desarrollo de React Native. La versión final de nuestra aplicación se verá así:

![Vista previa de la aplicación](../../images/10/4.png)

Todos los ejercicios de esta parte deben enviarse a <i>un único repositorio de GitHub</i> que eventualmente contendrá el código fuente completo de su aplicación. Habrá soluciones modelo disponibles para cada sección de esta parte que puede utilizar para completar las presentaciones incompletas. Esta parte está estructurada en base a la idea de que usted desarrolla su aplicación a medida que avanza en el material. Así que <i>no</i> espere hasta los ejercicios para comenzar el desarrollo. En su lugar, desarrolle su aplicación al mismo ritmo que avanza el material.

Esta parte se basará en gran medida en los conceptos cubiertos en las partes anteriores. Antes de comenzar esta parte, necesitará conocimientos básicos de JavaScript, React y GraphQL. No se requiere un conocimiento profundo del desarrollo del lado del servidor y se le proporciona todo el código del lado del servidor. Sin embargo, realizaremos solicitudes de red desde sus aplicaciones React Native, por ejemplo, utilizando consultas GraphQL. Las partes recomendadas para completar antes de esta parte son [parte 1](/es/part1), [parte 2](/es/part2), [parte 5](/es/part5), [parte 7] (/es/part7) y [parte 8](/es/part8).

### Envío de ejercicios y obtención de créditos

Los ejercicios se envían a través del [sistema de presentaciones](https://studies.cs.helsinki.fi/stats/courses/fs-react-native-2020) al igual que en las partes anteriores. Tenga en cuenta que los ejercicios de esta parte se envían <i>a una instancia de curso diferente</i> que en las partes 0-9. Las partes 1 a 4 en el sistema de presentación se refieren a las secciones a-d en esta parte. Esto significa que enviará los ejercicios de una sola sección a la vez, comenzando con esta sección, "Introducción a React Native", que es la parte 1 del sistema de envío.

Durante esta parte, obtendrá créditos en función de la cantidad de ejercicios que complete. Si completa <i>al menos 19 ejercicios</i> en esta parte, obtendrá <i>1 crédito</i>. Si completa <i>al menos 26 ejercicios</i> en esta parte, obtendrá <i>2 créditos</i>.

Una vez que haya completado los ejercicios y desee obtener los créditos, háganos saber a través del sistema de envío de ejercicios que ha completado el curso:

![Envío de ejercicios para créditos](../../images/10/23.png)

Tenga en cuenta que la nota "examen realizado en Moodle" se refiere al [examen del curso Full Stack Open](https://fullstackopen.com/en/part0/general_info#sign-up-for-the-exam), que <i>debe completarse</i> antes de poder obtener créditos de esta parte.

Puede descargar el certificado por completar esta parte haciendo clic en uno de los iconos de bandera. El icono de la bandera corresponde al idioma del certificado. Tenga en cuenta que debe haber completado al menos un crédito de ejercicios antes de poder descargar el certificado.

### Inicializando la aplicación

Para comenzar con nuestra aplicación, necesitamos configurar nuestro entorno de desarrollo. Hemos aprendido de las partes anteriores que existen herramientas útiles para configurar aplicaciones React rápidamente, como Create React App. Afortunadamente, React Native también tiene este tipo de herramientas.

Para el desarrollo de nuestra aplicación, usaremos [Expo](https://docs.expo.io/versions/latest/). Expo es una plataforma que facilita la configuración, el desarrollo, la construcción y la implementación de aplicaciones React Native. Comencemos con Expo instalando la interfaz de línea de comandos <i>expo-cli</i>:

```shell
npm install --global expo-cli
```

A continuación, podemos inicializar nuestro proyecto en un directorio <i>rate-repository-app</i> ejecutando el siguiente comando:

```shell
expo init rate-repository-app --template expo-template-blank@sdk-38
```

Tenga en cuenta que <em>@sdk-38</em> establece la versión <i>Expo SDK del proyecto en 38</i>, que admite <i>React Native versión 0.62</i>. El uso de otra versión de Expo SDK puede causarle problemas al seguir este material. Además, Expo tiene pocas limitaciones en comparación con React Native CLI, más sobre ellas [aquí](https://docs.expo.io/introduction/why-not-expo/). Sin embargo, estas limitaciones no tienen ningún efecto sobre la aplicación implementada en el material.

Ahora que nuestra aplicación se ha inicializado, abra el directorio <i>rate-repository-app</i> creado con un editor como [Visual Studio Code](https://code.visualstudio.com/). La estructura debería ser más o menos la siguiente:

![Project structure](../../images/10/1.png)

Podríamos ver algunos archivos y directorios familiares como <i>package.json</i> y <i>node_modules</i>. Además de esos, los archivos más relevantes son el archivo <i>app.json</i> que contiene la configuración relacionada con Expo y <i>App.js</i> que es el componente raíz de nuestra aplicación. <i>No</i> cambie el nombre ni mueva el archivo <i>App.js</i> porque, de forma predeterminada, Expo lo importa a [registrar el componente raíz](https://docs.expo.io/versions/latest/sdk/register-root-component/).

Veamos la sección <i>scripts</i> del archivo <i>package.json</i> que tiene los siguientes scripts:

```javascript
{
  // ...
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "eject": "expo eject"
  },
  // ...
}
```

Al ejecutar el script <em>npm start</em> se inicia el [paquete de Metro](https://facebook.github.io/metro/), que es un paquete de JavaScript para React Native. Puede describirse como el [Webpack](https://webpack.js.org/) del ecosistema React Native. Además del paquete Metro, las <i>herramientas de desarrollo de Expo</i> deben estar abiertas en una ventana del navegador en [http://localhost:19002](http://localhost:19002). Las herramientas de desarrollo de Expo son un conjunto útil de herramientas para ver los registros de la aplicación e iniciar la aplicación en un emulador o en la aplicación móvil de Expo. Pronto llegaremos a los emuladores y la aplicación móvil de Expo, pero primero, iniciemos nuestra aplicación en un navegador web haciendo clic en el enlace <i>Ejecutar en el navegador web</i>:

![Expo DevTools](../../images/10/2.png)

Después de hacer clic en el enlace, pronto deberíamos ver el texto definido en el archivo <i>App.js</i> en una ventana del navegador. Abra el archivo <i>App.js</i> con un editor y realice un pequeño cambio en el texto en el componente <em>Text</em>. Después de guardar el archivo, debería poder ver que los cambios que ha realizado en el código son visibles en la ventana del navegador.

### Configuración del entorno de desarrollo

Hemos visto por primera vez nuestra aplicación usando la vista del navegador de la Expo. Aunque la vista del navegador es bastante utilizable, sigue siendo una simulación bastante pobre del entorno nativo. Echemos un vistazo a las alternativas que tenemos con respecto al entorno de desarrollo.

Los dispositivos Android e iOS, como tabletas y teléfonos, se pueden emular en computadoras mediante <i>emuladores</i> específicos. Esto es muy útil para desarrollar aplicaciones nativas. Los usuarios de macOS pueden usar emuladores de Android e iOS con sus computadoras. Los usuarios de otros sistemas operativos como Linux o Windows tienen que conformarse con emuladores de Android. A continuación, dependiendo de su sistema operativo, siga una de estas instrucciones para configurar un emulador:

- [Configurar el emulador de Android con Android Studio](https://docs.expo.io/versions/v37.0.0/workflow/android-studio-emulator/) (cualquier sistema operativo)
- [Configurar el simulador de iOS con Xcode](https://docs.expo.io/versions/v37.0.0/workflow/ios-simulator/) (sistema operativo macOS)

Una vez que haya configurado el emulador y se esté ejecutando, inicie las herramientas de desarrollo de Expo como lo hicimos antes, ejecutando <em>npm start</em>. Dependiendo del emulador que esté ejecutando, haga clic en el enlace <i>Ejecutar en dispositivo/emulador Android</i> o <i>Ejecutar en simulador de iOS</i>. Después de hacer clic en el enlace, Expo debería conectarse al emulador y eventualmente debería ver la aplicación en su emulador. Tenga paciencia, esto puede llevar un tiempo.

Además de los emuladores, existe una forma extremadamente útil de desarrollar aplicaciones React Native con Expo, la aplicación móvil Expo. Con la aplicación móvil Expo, puede obtener una vista previa de su aplicación utilizando su dispositivo móvil real, lo que proporciona una experiencia de desarrollo un poco más concreta en comparación con los emuladores. Para comenzar, instale la aplicación móvil Expo siguiendo las instrucciones en la [documentación de la Expo](https://docs.expo.io/versions/latest/get-started/installation/#2-mobile-app-expo-client-para-ios). Tenga en cuenta que la aplicación móvil Expo solo puede abrir su aplicación si su dispositivo móvil está conectado a <i>la misma red local</i> (por ejemplo, conectado a la misma red Wi-Fi) que la computadora que está utilizando para el desarrollo.

Cuando la aplicación móvil Expo haya terminado de instalarse, ábrala. A continuación, si las herramientas de desarrollo de la Expo aún no se están ejecutando, inícielo ejecutando <em>npm start</em>. En la esquina inferior izquierda de las herramientas de desarrollo, debería poder ver un código QR. Dentro de la aplicación móvil Expo, presione <i>Escanear código QR</i> y escanee el código QR que se muestra en las herramientas de desarrollo. La aplicación móvil de la Expo debería comenzar a crear el paquete de JavaScript y, una vez finalizado, debería poder ver su aplicación. Ahora, cada vez que desee volver a abrir su aplicación en la aplicación móvil de la Expo, debería poder acceder a la aplicación sin escanear el código QR presionándolo en la lista <i>Recientemente abiertos</i> en la vista <i>Proyectos.</i>.

</div>

<div class="tasks">

#### Ejercicio 10.1: inicialización de la aplicación

Inicialice su aplicación con la interfaz de línea de comandos de Expo y configure el entorno de desarrollo utilizando un emulador o la aplicación móvil de Expo. Se recomienda probar ambos y averiguar qué entorno de desarrollo es el más adecuado para usted. El nombre de la aplicación no es tan relevante. Puede, por ejemplo, usar <i>rate-repository-app</i>.

Para enviar este ejercicio y todos los ejercicios futuros, debe [crear un nuevo repositorio de GitHub](https://github.com/new). El nombre del repositorio puede ser, por ejemplo, el nombre de la aplicación que inicializó con <em>expo init</em>. Si decide crear un repositorio privado, agregue al usuario de GitHub [Kaltsoon](https://github.com/Kaltsoon) como [colaborador del repositorio](https://docs.github.com/en/github/setting-up-and-managing-your-github-user-account/inviting-collaborators-to-a-personal-repository). El estado de colaborador solo se utiliza para verificar sus envíos.

Ahora que se creó el repositorio, ejecute <em>git init</em> dentro del directorio raíz de su aplicación para asegurarse de que el directorio se inicialice como un repositorio Git. A continuación, para agregar el repositorio creado como la ejecución remota <<em>git remote add origin git@github.com:<YOUR_GITHUB_USERNAME>/<NAME_OF_YOUR_REPOSITORY>.git</em> (recuerde reemplazar los valores de marcador de posición en el comando). Finalmente, simplemente confirme e inserte sus cambios en el repositorio y ya está.

</div>

<div class="content">

### ESLint

Ahora que estamos algo familiarizados con el entorno de desarrollo, mejoremos aún más nuestra experiencia de desarrollo configurando un linter. Usaremos [ESLint] (https://eslint.org/) que ya nos es familiar de las partes anteriores. Comencemos instalando las dependencias:

```shell
npm install --save-dev eslint babel-eslint eslint-plugin-react
```

A continuación, agreguemos la configuración de ESLint en un archivo <i>.eslintrc</i> en el directorio <i>rate-repository-app</i> con el siguiente contenido:

```javascript
{
  "plugins": ["react"],
  "settings": {
    "react": {
      "version": "detect"
    }
  },
  "extends": ["eslint:recommended", "plugin:react/recommended"],
  "parser": "babel-eslint",
  "env": {
    "browser": true
  },
  "rules": {
    "react/prop-types": "off",
    "semi": "error"
  }
}
```

Y finalmente, agreguemos un script <em>lint</em> al archivo <i>package.json</i> para verifique las reglas de linting en archivos específicos:

```javascript
{
  // ...
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "eject": "expo eject",
    "lint": "eslint ./src/**/*.{js,jsx} App.js --no-error-on-unmatched-pattern"
  },
  // ...
}
```

En contraste con las partes 1-8, estamos usando punto y coma para terminar líneas ahora, así que hemos agregado la regla [semi](https://eslint.org/docs/rules/semi) para verificar eso.

Ahora podemos verificar que las reglas de linting se obedezcan en los archivos JavaScript en el directorio <i>src</i> y en el archivo <i>App.js</i> ejecutando <em>npm run lint</em> . Agregaremos nuestro código futuro al directorio <i>src</i> pero como no hemos agregado ningún archivo allí todavía, necesitamos el indicador <eM>no-error-on-unmatched-pattern</em>. Además, si es posible, integre ESLint con su editor. Si está utilizando Visual Studio Code, puede hacerlo yendo a la sección de extensiones y verificando que la extensión ESLint esté instalada y habilitada:

![Visual Studio Code ESLint extensions](../../images/10/3.png)

La configuración de ESLint proporcionada contiene solo la base para la configuración. Siéntase libre de mejorar la configuración y agregar nuevos complementos si lo desea.

</div>

<div class="tasks">

### Ejercicio 10.2

#### Ejercicio 10.2: configuración de ESLint

Configure ESLint en su proyecto para que pueda realizar comprobaciones de linter ejecutando <em>npm run lint</em>. Para aprovechar al máximo el linting, también se recomienda integrar ESLint con su editor.

Este fue el último ejercicio de esta sección. Es hora de enviar tu código a GitHub y marcar todos tus ejercicios terminados en el [sistema de envío de ejercicios](https://studies.cs.helsinki.fi/stats/courses/fs-react-native-2020). Tenga en cuenta que los ejercicios de esta sección deben enviarse a la parte 1 del sistema de envío de ejercicios.

</div>

<div class="content">

### Visualización de registros

Las herramientas de desarrollo de la exposición se pueden utilizar para mostrar los mensajes de registro de la aplicación en ejecución. Los mensajes de nivel de error y advertencia también son visibles en el emulador y en la interfaz de la aplicación móvil. Los mensajes de error aparecerán como una superposición roja, mientras que los mensajes de advertencia se pueden expandir presionando el cuadro de diálogo de alerta amarillo en la parte inferior de la pantalla. Para propósitos de depuración, podemos usar el conocido método <em>console.log</em> para escribir mensajes de depuración en el registro.

Probemos esto en la práctica. Inicie las herramientas de desarrollo de la Expo ejecutando <em> npm start </em> y abra la aplicación con el emulador o la aplicación móvil. Cuando se ejecuta la aplicación debe ser capaz de ver los dispositivos conectados en el marco del "Metro Bündler" en la esquina superior izquierda de las herramientas de desarrollos:

![Expo development tools](../../images/10/9.png)

Haga clic en el dispositivo para abrir sus registros. A continuación, abra el archivo <i>App.js</i> y agregue un mensaje <em>console.log</em> al componente <em>App</em>. Después de guardar el archivo, debería poder ver su mensaje en los registros.

### Usando el depurador

La inspección de los mensajes registrados desde el código con el método <em>console.log</em> puede ser útil, pero a veces encontrar errores o entender cómo funciona la aplicación requiere que veamos el panorama general. Podríamos, por ejemplo, estar interesados ​​en cuál es el estado y los accesorios de un determinado componente, o cuál es la respuesta de una determinada solicitud de red. En las partes anteriores, hemos utilizado las herramientas de desarrollo del navegador para este tipo de depuración. [React Native Debugger](https://docs.expo.io/workflow/debugging/#react-native-debugger) es una herramienta que ofrece un conjunto similar de funciones de depuración para las aplicaciones React Native.

Comencemos instalando React Native Debugger con la ayuda de las [instrucciones de instalación](https://github.com/jhen0409/react-native-debugger#installation). Una vez que se complete la instalación, inicie React Native Debugger, abra una nueva ventana del depurador (accesos directos: <em>Command + T</em> en macOS, <em>Ctrl + T</em> en Linux / Windows) y configure el puerto del empaquetador React Native a <em>19001</em>.

A continuación, debemos iniciar nuestra aplicación y conectarnos al depurador. Inicie la aplicación ejecutando <em>npm start</em>. Una vez que la aplicación se esté ejecutando, ábrala con un emulador o la aplicación móvil Expo. Dentro del emulador o la aplicación móvil de la Expo, abra el menú del desarrollador siguiendo las [instrucciones](https://docs.expo.io/workflow/debugging/#developer-menu) en la documentación de la Expo. En el menú del desarrollador, seleccione <i>Depurar JS remoto</i> para conectarse al depurador. Ahora, debería poder ver el árbol de componentes de la aplicación en el depurador:

![React Native Debugger](../../images/10/24.png)

Puede utilizar el depurador para inspeccionar el estado y los accesorios del componente, así como para <i>cambiarlos</i>. Intente encontrar el componente <em>Text</em> representado por el componente <em>App</em> utilizando el depurador. Puede utilizar la búsqueda o recorrer el árbol de componentes. Una vez que haya encontrado el componente <em>Text</em> en el árbol, haga clic en él y cambie el valor del prop <em>children</em>. El cambio debería ser visible automáticamente en la vista previa de la aplicación.

Para obtener herramientas de depuración de aplicaciones React Native más útiles, diríjase a la [documentación de depuración](https://docs.expo.io/workflow/debugging) de la Expo.

</div>
