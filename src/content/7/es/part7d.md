---
mainImage: ../../../images/part-7.svg
part: 7
letter: d
lang: es
---
<div class="content">

Desarrollar con React fue conocido por requerir herramientas que eran muy difíciles de configurar. En estos días, comenzar con el desarrollo de React es casi indoloro gracias a [create-react-app](https://github.com/facebookincubator/create-react-app). Probablemente nunca haya existido un mejor flujo de trabajo de desarrollo para el desarrollo de JavaScript del lado del navegador.


No podemos confiar en la magia negra de create-react-app para siempre y es hora de que echemos un vistazo debajo del capó. Uno de los jugadores clave para hacer que las aplicaciones React sean funcionales es una herramienta llamada [webpack](https://webpack.js.org/).


### Empaquetamiento


Hemos implementado nuestras aplicaciones dividiendo nuestro código en módulos separados que se han <i>importado</i> a lugares que los requieren. Aunque los módulos ES6 se definen en el estándar ECMAScript, ningún navegador sabe realmente cómo manejar el código dividido en módulos.


Por esta razón, el código que se divide en módulos debe estar <i>empaquetado</i> para los navegadores, lo que significa que todos los archivos de código fuente se transforman en un solo archivo que contiene todo el código de la aplicación. Cuando implementamos nuestro frontend de React en producción en la [parte 3](/es/part3/deploying_app_to_internet), realizamos el empaquetado de nuestra aplicación con el comando _npm run build_. En la cara oculta, el script npm empaqueta el código fuente usando el webpack que produce la siguiente colección de archivos en el directorio de <i>compilación</i>:


<pre>
├── asset-manifest.json
├── favicon.ico
├── index.html
├── manifest.json
├── precache-manifest.8082e70dbf004a0fe961fc1f317b2683.js
├── service-worker.js
└── static
    ├── css
    │   ├── main.f9a47af2.chunk.css
    │   └── main.f9a47af2.chunk.css.map
    └── js
        ├── 1.578f4ea1.chunk.js
        ├── 1.578f4ea1.chunk.js.map
        ├── main.8209a8f2.chunk.js
        ├── main.8209a8f2.chunk.js.map
        ├── runtime~main.229c360f.js
        └── runtime~main.229c360f.js.map
</pre>


El archivo <i>index.html</i> ubicado en la raíz del directorio de compilación es el "archivo principal" de la aplicación, que carga el archivo JavaScript incluido con la etiqueta <i>script</i> (de hecho, hay dos archivos JavaScript incluidos):

```html
<!doctype html><html lang="en">
<head>
  <meta charset="utf-8"/>
  <title>React App</title>
  <link href="/static/css/main.f9a47af2.chunk.css" rel="stylesheet"></head>
<body>
  <div id="root"></div>
  <script src="/static/js/1.578f4ea1.chunk.js"></script>
  <script src="/static/js/main.8209a8f2.chunk.js"></script>
</body>
</html>
```

Como podemos ver en la aplicación de ejemplo que se creó con create-react-app, el script de compilación también agrupa los archivos CSS de la aplicación en un solo archivo <i>/static/css/main.f9a47af2.chunk.css</i>.


En la práctica, la agrupación se realiza de modo que definamos un punto de entrada para la aplicación, que normalmente es el archivo <i>index.js</i>. Cuando webpack empaqueta el código, incluye todo el código que importa el punto de entrada y el código que importa, y así sucesivamente.


Dado que parte de los archivos importados son paquetes como React, Redux y Axios, el archivo JavaScript incluido también contendrá el contenido de cada una de estas librerías.


> La antigua forma de dividir el código de la aplicación en varios archivos se basaba en el hecho de que el archivo <i>index.html</i> cargaba todos los archivos JavaScript separados de la aplicación con la ayuda de etiquetas de script. Esto resultó en una disminución del rendimiento, ya que la carga de cada archivo por separado genera algunos gastos generales. Por esta razón, en estos días, el método preferido es agrupar el código en un solo archivo.


A continuación, crearemos una configuración de webpack adecuada para una aplicación React a mano desde cero.


Creemos un nuevo directorio para el proyecto con los siguientes subdirectorios (<i>build</i> y <i>src</i>) y archivos:

<pre>
├── build
├── package.json
├── src
│   └── index.js
└── webpack.config.js
</pre>


El contenido del archivo <i>package.json</i> puede ser, por ejemplo, el siguiente:

```json
{
  "name": "webpack-part7",
  "version": "0.0.1",
  "description": "practising webpack",
  "scripts": {},
  "license": "MIT"
}
```


Instalemos webpack con el comando:

```js
npm install --save-dev webpack webpack-cli
```


Definimos la funcionalidad de webpack en el archivo <i>webpack.config.js</i>, que inicializamos con el siguiente contenido:

```js
const path = require('path')

const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'main.js'
  }
}
module.exports = config
```


Luego definiremos un nuevo script npm llamado <i>build</i> que ejecutará el empaquetado con webpack:

```js
// ...
"scripts": {
  "build": "webpack --mode=development"
},
// ...
```


Agreguemos más código al archivo <i>src/index.js</i>:

```js
const hello = name => {
  console.log(`hello ${name}`)
}
```


Cuando ejecutamos el comando _npm run build_ , el código de nuestra aplicación será empaquetado por webpack. La operación producirá un nuevo archivo <i>main.js</i> que se agregará al directorio de <i>compilación</i>:

![](../../images/7/19ea.png)

El archivo contiene muchas cosas que parecen bastante interesantes. También podemos ver el código que escribimos anteriormente al final del archivo:

![](../../images/7/19eb.png)

Agreguemos un archivo <i>App.js</i> en el directorio <i>src</i> con el siguiente contenido:

```js
const App = () => {
  return null
}

export default App
```

Vamos a importar y usar el módulo <i>App</i> en el archivo <i>index.js</i>:

```js
import App from './App';

const hello = name => {
  console.log(`hello ${name}`)
}

App()
```

Cuando empaquetamos la aplicación nuevamente con el comando _npm run build_, notamos que webpack ha reconocido ambos archivos:

![](../../images/7/20ea.png)

El código de nuestra aplicación se puede encontrar al final del archivo del paquete en un formato bastante oscuro:

```js
/***/ "./src/App.js":
/*!********************!*\
  !*** ./src/App.js ***!
  \********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nconst App = () => {\n  return null\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (App);\n\n//# sourceURL=webpack:///./src/App.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _App__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./App */ \"./src/App.js\");\n\n\nconst hello = name => {\n  console.log(`hello ${name}`)\n};\n\nObject(_App__WEBPACK_IMPORTED_MODULE_0__[\"default\"])()\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })
```


### Archivo de configuración


Echemos un vistazo más de cerca al contenido de nuestro archivo <i>webpack.config.js</i> actual:

```js
const path = require('path')

const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'main.js'
  }
}

module.exports = config
```

El archivo de configuración se ha escrito en JavaScript y el objeto de configuración se exporta utilizando la sintaxis del módulo de Node.


Nuestra definición de configuración mínima casi se explica sola. La propiedad [entry](https://webpack.js.org/concepts/#entry) del objeto de configuración especifica el archivo que servirá como punto de entrada para empaquetar la aplicación.


La propiedad [output](https://webpack.js.org/concepts/#output) define la ubicación donde se almacenará el código empaquetado. El directorio de destino debe definirse como una <i>ruta absoluta</i> que sea fácil de crear con el método [path.resolve](https://nodejs.org/docs/latest-v8.x/api/path.html#path_path_resolve_paths). También usamos [\_\_dirname](https://nodejs.org/docs/latest/api/globals.html#globals_dirname), que es una variable global en Node que almacena la ruta al directorio actual.


### Empaquetando React

A continuación, transformemos nuestra aplicación en una aplicación React mínima. Instalemos las librerías necesarias:

```bash
npm install react react-dom
```

Y convirtamos nuestra aplicación en una aplicación React agregando las definiciones familiares en el archivo <i>index.js</i>:

```js
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

ReactDOM.render(<App />, document.getElementById('root'))
```

También realizaremos los siguientes cambios en el archivo <i>App.js</i>:

```js
import React from 'react'

const App = () => (
  <div>hello webpack</div>
)

export default App
```

Todavía necesitamos el archivo <i>build/index.html</i> que servirá como la "página principal" de nuestra aplicación que cargará nuestro código JavaScript incluido con una etiqueta <i>script</i>:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>React App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="text/javascript" src="./main.js"></script>
  </body>
</html>
```


Cuando empaquetamos nuestra aplicación, nos encontramos con el siguiente problema:

![](../../images/7/21.png)

### Cargadores

El mensaje de error del paquete web indica que es posible que necesitemos un <i>cargador</i> adecuado para empaquetar el archivo <i>App.js</i> correctamente. De forma predeterminada, webpack solo sabe cómo lidiar con JavaScript simple. Aunque es posible que no nos demos cuenta, en realidad estamos usando [JSX](https://facebook.github.io/jsx/) para renderizar nuestras vistas en React. Para ilustrar esto, el siguiente código no es JavaScript normal:

```js
const App = () => {
  return <div>hello webpack</div>
}
```


La sintaxis utilizada anteriormente proviene de JSX y nos proporciona una forma alternativa de definir un elemento React para una etiqueta <i>div</i>.


Podemos usar [caargadores](https://webpack.js.org/concepts/loaders/) para informar a webpack de los archivos que deben procesarse antes de que se empaqueten.


Configuremos un cargador para nuestra aplicación que transforme el código JSX en JavaScript normal:

```js
const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'main.js',
  },
  // highlight-start
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-react'],
        },
      },
    ],
  },
  // highlight-end
}
```


Los cargadores se definen en la propiedad <i>module</i> en el array de <i>rules</i>.

La definición de un solo cargador consta de tres partes:

```js
{
  test: /\.js$/,
  loader: 'babel-loader',
  options: {
    presets: ['@babel/preset-react']
  }
}
```

La propiedad <i>test</i> especifica que el cargador es para archivos que tienen nombres que terminan en <i>.js</i>. La propiedad <i>loader</i> especifica que el procesamiento de esos archivos se realizará con [babel-loader](https://github.com/babel/babel-loader). La propiedad <i>options</i> se utiliza para especificar parámetros para el cargador, que configuran su funcionalidad.

Instalemos el cargador y sus paquetes requeridos como una <i>dependencia de desarrollo</i>:

```js
npm install @babel/core babel-loader @babel/preset-react --save-dev
```

La empaquetación de la aplicación ahora se realizará correctamente.

Si realizamos algunos cambios en el componente <i>App</i> y echamos un vistazo al código incluido, notamos que la versión empaquetada del componente se ve así:

```js
const App = () =>
  react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
    'div',
    null,
    'hello webpack'
  )
```

Como podemos ver en el ejemplo anterior, los elementos de React que se escribieron en JSX ahora se crean con JavaScript normal utilizando la función [createElement](https://reactjs.org/docs/react-without-jsx.html) de React .

Puede probar la aplicación incluida abriendo el archivo <i>build/index.html</i> abriendo el archivo en su navegador:

![](../../images/7/22.png)


Vale la pena señalar que si el código fuente de la aplicación incluida usa <i>async/await</i>, el navegador no renderizará nada en algunos navegadores. [Buscar en Google el mensaje de error en la consola](https://stackoverflow.com/questions/33527653/babel-6-regeneratorruntime-is-not-defined) arrojará algo de luz sobre el problema. Tenemos que instalar una dependencia más que falta, que es [@babel/polyfill](https://babeljs.io/docs/en/babel-polyfill):

```bash
npm install @babel/polyfill
```


Realicemos los siguientes cambios en la propiedad <i>entry</i> del objeto de configuración de webpack en el archivo i>webpack.config.js</i>:

```js
  entry: ['@babel/polyfill', './src/index.js']
```

Nuestra configuración contiene casi todo lo que necesitamos para el desarrollo de React.


### Transpiladores

El proceso de transformar código de una forma de JavaScript a otra se denomina [transpilación](https://en.wiktionary.org/wiki/transpile). La definición general del término es compilar código fuente transformándolo de un ilenguaje a otro.

Al utilizar la configuración de la sección anterior, estamos <i>transpilando</i> el código que contiene JSX en JavaScript normal con la ayuda de [babel](https://babeljs.io/), que actualmente es la herramienta más popular para el trabajo.


Como se mencionó en la parte 1, la mayoría de los navegadores no son compatibles con las funciones más recientes que se introdujeron en ES6 y ES7, y por esta razón, el código generalmente se transpila a una versión de JavaScript que implementa el estándar ES5.


El proceso de transpilación que ejecuta Babel se define con <i>plugins</i>. En la práctica, la mayoría de los desarrolladores utilizan [presets](https://babeljs.io/docs/plugins/) que son grupos de plugins preconfigurados.


Actualmente estamos usando el preset [@babel/preset-react](https://babeljs.io/docs/plugins/preset-react/) para transpilar el código fuente de nuestra aplicación:

```js
{
  test: /\.js$/,
  loader: 'babel-loader',
  options: {
    presets: ['@babel/preset-react'] // highlight-line
  }
}
```


Agreguemos el plugin [@babel/preset-env](https://babeljs.io/docs/plugins/preset-env/) que contiene todo lo necesario para tomar código utilizando todas las funciones más recientes y transpilarlo a un código que sea compatible con el estándar ES5:

```js
{
  test: /\.js$/,
  loader: 'babel-loader',
  options: {
    presets: ['@babel/preset-env', '@babel/preset-react'] // highlight-line
  }
}
```


Instalemos el preset con el comando:

```js
npm install @babel/preset-env --save-dev
```


Cuando transpilamos el código, se transforma en JavaScript de la vieja escuela. La definición del componente <i>App</i> transformado se ve así:

```js
var App = function App() {
  return _react2.default.createElement('div', null, 'hello webpack')
};
```

Como podemos ver, las variables se declaran con la palabra clave _var_, ya que ES5 JavaScript no comprende la palabra clave _const_. Las funciones de flecha tampoco se utilizan, por lo que la definición de función utilizó la palabra clave _function_.


### CSS

Agreguemos algo de CSS a nuestra aplicación. Creemos un nuevo archivo <i>src/index.css</i>:

```css
.container {
  margin: 10;
  background-color: #dee8e4;
}
```

Luego usemos el estilo en el componente <i>App</i>:

```js
const App = () => {
  return (
    <div className="container">
      hello webpack
    </div>
  )
}
```

E importamos el estilo en el archivo <i>index.js</i>:

```js
import './index.css'
```


Esto hará que el proceso de transpilación se interrumpa:

![](../../images/7/23.png)


Cuando usamos CSS, tenemos que usar [css](https://webpack.js.org/loaders/css-loader/) y cargadores de [estilos](https://webpack.js.org/loaders/style-loader/):

```js
{
  rules: [
    {
      test: /\.js$/,
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-react', '@babel/preset-env'],
      },
    },
    // highlight-start
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    },
    // highlight-end
  ];
}
```

El trabajo del [cargador css](https://webpack.js.org/loaders/css-loader/) es cargar los archivos <i>CSS</i> y el trabajo del [cargador de estilos](https://webpack.js.org/loaders/style-loader/) es generar e inyectar un elemento <i>style</i> que contenga todos los estilos de la aplicación.

Con esta configuración, las definiciones CSS se incluyen en el archivo <i>main.js</i> de la aplicación. Por esta razón, no es necesario importar por separado los estilos <i>CSS</i> en el archivo principal <i>index.html</i> de la aplicación.

Si es necesario, el CSS de la aplicación también se puede generar en su propio archivo separado mediante el [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin).

Cuando instalamos los cargadores:

```js
npm install style-loader css-loader --save-dev
```

El empaquetamiento volverá a tener éxito y la aplicación obtendrá nuevos estilos.

### Webpack-dev-servidor

La configuración actual hace posible el desarrollo de nuestra aplicación, pero el flujo de trabajo es terrible (hasta el punto en que se parece al flujo de trabajo de desarrollo con Java). Cada vez que hacemos un cambio en el código, tenemos que empaquetarlo y actualizar el navegador para probar el código.

El [webpack-dev-server](https://webpack.js.org/guides/development/#using-webpack-dev-server) ofrece una solución a nuestros problemas. Instalemoslo con el comando: 

```js
npm install --save-dev webpack-dev-server
```

Definamos un script npm para iniciar el dev-server:

```js
{
  // ...
  "scripts": {
    "build": "webpack --mode=development",
    "start": "webpack serve --mode=development" // highlight-line
  },
  // ...
}
```

Agreguemos también una nueva propiedad <i>devServer</i> al objeto de configuración en el archivo <i>webpack.config.js</i>:

```js
const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'main.js',
  },
  // highlight-start
  devServer: {
    contentBase: path.resolve(__dirname, 'build'),
    compress: true,
    port: 3000,
  },
  // highlight-end
  // ...
};
```

El comando _npm start_ ahora iniciará el dev-server en el puerto 3000, lo que significa que nuestra aplicación estará disponible visitando <http://localhost:3000> en el navegador. Cuando hacemos cambios en el código, el navegador actualizará automáticamente la página.

El proceso de actualización del código es rápido. Cuando usamos el dev-server, el código no se incluye de la forma habitual en el archivo <i>main.js</i>. El resultado de la agrupación solo existe en la memoria.

Extendamos el código cambiando la definición del componente <i>App</i> como se muestra a continuación:

```js
import React, {useState} from 'react'

const App = () => {
  const [counter, setCounter] = useState(0)

  return (
    <div className="container">
      hello webpack {counter} clicks
      <button onClick={() => setCounter(counter + 1)}>
        press
      </button>
    </div>
  )
}

export default App
```


Vale la pena notar que los mensajes de error no se muestran de la misma manera que con nuestras aplicaciones que fueron creadas usando create-react-app. Por este motivo tenemos que prestar más atención a la consola:

![](../../images/7/24.png)


La aplicación funciona bien y el flujo de trabajo de desarrollo es bastante fluido.


### Source maps


Extraigamos el controlador de clics en su propia función y almacenemos el valor anterior del contador en su propio estado de <i>valores</i>:

```js
const App = () => {
  const [counter, setCounter] = useState(0)
  const [values, setValues] = useState() // highlight-line

  const handleClick = () => {
    setCounter(counter + 1)
    setValues(values.concat(counter)) // highlight-line
  }

  return (
    <div className="container">
      hello webpack {counter} clicks
      <button onClick={handleClick}>
        press
      </button>
    </div>
  )
}
```

La aplicación ya no funciona y la consola mostrará el siguiente error:

![](../../images/7/25.png)

Sabemos que el error está en el método onClick, pero si la aplicación fuera más grande, el mensaje de error sería bastante difícil de localizar:

<pre>
App.js:27 Uncaught TypeError: Cannot read property 'concat' of undefined
    at handleClick (App.js:27)
</pre>

La ubicación del error indicada en el mensaje no coincide con la ubicación real del error en nuestro código fuente. Si hacemos clic en el mensaje de error, notamos que el código fuente mostrado no se parece al código de nuestra aplicación:

![](../../images/7/26.png)

Por supuesto, queremos ver nuestro código fuente real en el mensaje de error.

Afortunadamente, corregir el mensaje de error a este respecto es bastante fácil. Le pediremos a webpack que genere un llamado [source map](https://webpack.js.org/configuration/devtool/) para el paquete, que permite <i>mapear los errores</i> que ocurren durante la ejecución del paquete a la parte correspondiente en el código fuente original.

El mapa fuente se puede generar agregando una nueva propiedad <i>devtool</i> al objeto de configuración con el valor 'source-map':

```js
const config = {
  entry: './src/index.js',
  output: {
    // ...
  },
  devServer: {
    // ...
  },
  devtool: 'source-map', // highlight-line
  // ..
};
```


Webpack debe reiniciarse cuando hagamos cambios en su configuración. También es posible hacer que el paquete web observe los cambios realizados en sí mismo, pero esta vez no lo haremos.


El mensaje de error ahora es mucho mejor

![](../../images/7/27.png)

ya que se refiere al código que escribimos

![](../../images/7/27eb.png)

La generación del source map también permite utilizar el debugger de Chrome:

![](../../images/7/28.png)

Arreglemos el error inicializando el estado de los <i>valores</i> como un array vacío:

```js
const App = () => {
  const [counter, setCounter] = useState(0)
  const [values, setValues] = useState([])
  // ...
}
```

### Minificando el código


Cuando implementamos la aplicación en producción, usamos el paquete de código <i>main.js</i> que genera webpack. El tamaño de <i>main.js</i> archivo es 974473 bytes, aunque nuestra aplicación solo contiene unas pocas líneas de nuestro propio código. El gran tamaño del archivo se debe al hecho de que el paquete también contiene el código fuente de toda la biblioteca React. El tamaño del código incluido es importante, ya que el navegador tiene que cargar el código cuando se utiliza la aplicación por primera vez. Con conexiones a Internet de alta velocidad, 974473 bytes no es un problema, pero si tuviéramos que seguir agregando más dependencias externas, las velocidades de carga podrían convertirse en un problema particularmente para los usuarios móviles.

Si inspeccionamos el contenido del archivo del paquete, notamos que podría optimizarse en gran medida en términos de tamaño de archivo eliminando todos los comentarios. No tiene sentido optimizar manualmente estos archivos, ya que existen muchas herramientas para el trabajo.

El proceso de optimización para archivos JavaScript se llama <i>minificación</i>. Una de las principales herramientas destinadas a este fin es [UglifyJS](http://lisperator.net/uglifyjs/).

A partir de la versión 4 de webpack, el complemento de minificación no requiere configuración adicional para su uso. Basta con modificar el script npm en el archivo <i>package.json</i> para especificar que webpack ejecutará el empaquetado del código en modo de <i>producción</i>:

```json
{
  "name": "webpack-part7",
  "version": "0.0.1",
  "description": "practising webpack",
  "scripts": {
    "build": "webpack --mode=production", // highlight-line
    "start": "webpack serve --mode=development"
  },
  "license": "MIT",
  "dependencies": {
    // ...
  },
  "devDependencies": {
    // ...
  }
}
```

Cuando agrupamos la aplicación nuevamente, el tamaño del archivo <i>main.js</i> resultante disminuye sustancialmente:

```js
$ ls -l build/main.js
-rw-r--r--  1 mluukkai  984178727  132299 Feb 16 11:33 build/main.js
```

La salida del proceso de minificación se asemeja al código C de la vieja escuela; Se han eliminado todos los comentarios e incluso los espacios en blanco innecesarios y los caracteres de nueva línea, y los nombres de las variables se han reemplazado por un solo carácter.

```js
function h(){if(!d){var e=u(p);d=!0;for(var t=c.length;t;){for(s=c,c=[];++f<t;)s&&s[f].run();f=-1,t=c.length}s=null,d=!1,function(e){if(o===clearTimeout)return clearTimeout(e);if((o===l||!o)&&clearTimeout)return o=clearTimeout,clearTimeout(e);try{o(e)}catch(t){try{return o.call(null,e)}catch(t){return o.call(this,e)}}}(e)}}a.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)
```

### Configuración de desarrollo y producción

A continuación, agreguemos un backend a nuestra aplicación y reutilizando el backend de la aplicación de notas ahora familiar.

Guardemos el siguiente contenido en el archivo <i>db.json</i>:

```json
{
  "notes": [
    {
      "important": true,
      "content": "HTML is easy",
      "id": "5a3b8481bb01f9cb00ccb4a9"
    },
    {
      "important": false,
      "content": "Mongo can save js objects",
      "id": "5a3b920a61e8c8d3f484bdd0"
    }
  ]
}
```


Nuestro objetivo es configurar la aplicación con webpack de tal manera que, cuando se use localmente, la aplicación use el servidor json disponible en el puerto 3001 como su backend.


El archivo empaquetado se configurará para usar el backend disponible en la URL <https://blooming-atoll-75500.herokuapp.com/api/notes>.


Instalaremos <i>axios</i>, iniciaremos el json-server y luego realizaremos los cambios necesarios en la aplicación. Con el fin de cambiar las cosas, obtendremos las notas del backend con nuestro [hook personalizado](/en/part7/custom_hooks) llamado _useNotes_:

```js
import React, { useState, useEffect } from 'react'
import axios from 'axios'

// highlight-start
const useNotes = (url) => {
  const [notes, setNotes] = useState([])

  useEffect(() => {
    axios.get(url).then(response => {
      setNotes(response.data)
    })
  }, [url])

  return notes
}
// highlight-end

const App = () => {
  const [counter, setCounter] = useState(0)
  const [values, setValues] = useState([])
  const url = 'https://blooming-atoll-75500.herokuapp.com/api/notes'
  const notes = useNotes(url) // highlight-line

  const handleClick = () => {
    setCounter(counter + 1)
    setValues(values.concat(counter))
  }

  return (
    <div className="container">
      hello webpack {counter} clicks
      <button onClick={handleClick} >press</button>
      <div>{notes.length} notes on server {url}</div> // highlight-line
    </div>
  )
}

export default App
```


La dirección del servidor backend está actualmente hardcodeada en el código de la aplicación. ¿Cómo podemos cambiar la dirección de forma controlada para que apunte al servidor de backend de producción cuando el código está empaquetado para producción?


Cambiemos el objeto de configuración en el archivo <i>webpack.config.js</i> para que sea una función en lugar de un objeto:

```js
const path = require('path');

const config = (env, argv) => {
  return {
    entry: './src/index.js',
    output: {
      // ...
    },
    devServer: {
      // ...
    },
    devtool: 'source-map',
    module: {
      // ...
    },
    plugins: [
      // ...
    ],
  }
}

module.exports = config
```

La definición sigue siendo casi exactamente la misma, excepto por el hecho de que la función ahora devuelve el objeto de configuración. La función recibe los dos parámetros, <i>env</i> y <i>argv</i>, el segundo de los cuales se puede utilizar para acceder al <i>modo</i> definido en el script npm.


También podemos usar [DefinePlugin](https://webpack.js.org/plugins/define-plugin/) de webpack para definir <i>constantes predeterminadas globales</i> que se pueden usar en el código incluido. Definamos una nueva constante global <i>BACKEND\_URL</i>, que obtiene un valor diferente según el entorno para el que se empaqueta el código:

```js
const path = require('path')
const webpack = require('webpack') // highlight-line

const config = (env, argv) => {
  console.log('argv', argv.mode)

  // highlight-start
  const backend_url = argv.mode === 'production'
    ? 'https://blooming-atoll-75500.herokuapp.com/api/notes'
    : 'http://localhost:3001/api/notes'
  // highlight-end

  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'main.js'
    },
    devServer: {
      contentBase: path.resolve(__dirname, 'build'),
      compress: true,
      port: 3000,
    },
    devtool: 'source-map',
    module: {
      // ...
    },
    // highlight-start
    plugins: [
      new webpack.DefinePlugin({
        BACKEND_URL: JSON.stringify(backend_url)
      })
    ]
    // highlight-end
  }
}

module.exports = config
```


La constante global se usa de la siguiente manera en el código:

```js
const App = () => {
  const [counter, setCounter] = useState(0)
  const [values, setValues] = useState([])
  const notes = useNotes(BACKEND_URL) // highlight-line

  // ...
  return (
    <div className="container">
      hello webpack {counter} clicks
      <button onClick={handleClick} >press</button>
      <div>{notes.length} notes on server {BACKEND_URL}</div> // highlight-line
    </div>
  )
}
```


Si la configuración para el desarrollo y la producción difiere mucho, puede ser una buena idea [separar la configuración](https://webpack.js.org/guides/production/) de los dos en sus propios archivos.


Podemos inspeccionar la versión de producción empaquetada de la aplicación localmente ejecutando el siguiente comando en el directorio de <i>compilación</i>:

```js
npx static-server
```


De forma predeterminada, la aplicación incluida estará disponible en <http://localhost:9080>.


### Polyfill


Nuestra aplicación está terminada y funciona con todas las versiones relativamente recientes de los navegadores modernos, con la excepción de Internet Explorer. La razón de esto es que debido a _axios_, nuestro código usa [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), y ninguna versión existente de IE las admite:

![](../../images/7/29.png)


Hay muchas otras cosas en el estándar que IE no admite. Algo tan inofensivo como el método [find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find) de arrays de JavaScript supera las capacidades de IE:

![](../../images/7/30.png)


En estas situaciones, no es suficiente transpilar el código, ya que la transpilación simplemente transforma el código de una versión más nueva de JavaScript a una más antigua con un soporte de navegador más amplio. IE entiende las Promesas sintácticamente, pero simplemente no ha implementado su funcionalidad. La propiedad _find_ de arrays en IE es simplemente <i>undefined</i>.


Si queremos que la aplicación sea compatible con IE, debemos agregar un [polyfill](https://remysharp.com/2010/10/08/what-is-a-polyfill), que es un código que agrega la funcionalidad que falta a los navegadores más antiguos.


Polyfills se puede agregar con la ayuda de[webpack and Babel](https://babeljs.io/docs/usage/polyfill/) o instalando una de las muchas librerías de polyfill existentes.


El polyfill proporcionado por la librería [promise-polyfill](https://www.npmjs.com/package/promise-polyfill) es fácil de usar, simplemente tenemos que agregar lo siguiente al código de nuestra aplicación existente:

```js
import PromisePolyfill from 'promise-polyfill'

if (!window.Promise) {
  window.Promise = PromisePolyfill
}
```


Si el objeto global _Promise_  no existe, lo que significa que el navegador no es compatible con Promises, el polyfilled Promise se almacena en la variable global. Si polyfilled Promise se implementa lo suficientemente bien, el resto del código debería funcionar sin problemas.


Puede encontrar una lista exhaustiva de polyfills existentes [aquí](https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-browser-Polyfills).


La compatibilidad del navegador de diferentes APIs se puede verificar visitando [https://caniuse.com](https://caniuse.com) o [el sitio web de Mozilla](https://developer.mozilla.org/en-US/).


### Eject


La herramienta create-react-app usa webpack detrás de escena. Si la configuración predeterminada no es suficiente, es posible [expulsar](https://create-react-app.dev/docs/available-scripts/#npm-run-eject) el proyecto que eliminará toda la magia negra, y los archivos de configuración predeterminados se almacenarán en el directorio de <i>configuración</i> y en un archivo <i>package.json</i> modificado.


Si expulsa una aplicación creada con create-react-app, no habrá retorno y toda la configuración deberá mantenerse manualmente. La configuración predeterminada no es trivial y, en lugar de expulsarla de una aplicación create-react-app, una mejor alternativa puede ser escribir su propia configuración de webpack desde el principio.


Se recomienda revisar y leer los archivos de configuración de una aplicación expulsada y es extremadamente educativo.

</div>

<div class="tasks">


### Ejercicios

Un ejercicio relacionado con los temas presentados aquí, se puede encontrar al final de esta sección de material del curso en el conjunto de ejercicios [para extender la aplicación de lista de blogs](/es/part7/exercises_extending_the_bloglist).


</div>
