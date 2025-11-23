---
mainImage: ../../../images/part-7.svg
part: 7
letter: d
lang: es
---
<div class="content">

En sus inicios, React era "famoso" por tener herramientas de desarrollo muy difíciles de configurar. Para mejorar las cosas, se desarrolló [Create React App](https://github.com/facebookincubator/create-react-app), que eliminó los problemas relacionados con la configuración. [Vite](https://vitejs.dev/), que también se utiliza en el curso, ha reemplazado recientemente a Create React App en nuevas aplicaciones.

Ambos, Vite y Create React App, utilizan <i>bundlers</i> (empaquetadores) para realizar el trabajo. Ahora nos familiarizaremos con el bundler llamado [Webpack](https://webpack.js.org/) utilizado por Create React App. Webpack fue, por mucho, el bundler más popular durante años. Sin embargo, recientemente han surgido varios bundlers de nueva generación como [esbuild](https://esbuild.github.io/) utilizado por Vite, que son significativamente más rápidos y fáciles de usar que Webpack. Sin embargo, esbuild aún carece de algunas características útiles (como la recarga en caliente del código en el navegador), por lo que a continuación conoceremos al antiguo líder de los bundlers, Webpack.

### Bundling

Hemos implementado nuestras aplicaciones dividiendo nuestro código en módulos separados que se han <i>importado</i> a lugares que los requieren. Aunque los módulos ES6 se definen en el estándar ECMAScript, ningún navegador sabe realmente cómo manejar el código dividido en módulos.

Por esta razón, el código que se divide en módulos debe estar <i>empaquetado</i> (bundled) para los navegadores, lo que significa que todos los archivos de código fuente se transforman en un solo archivo que contiene todo el código de la aplicación. Cuando desplegamos nuestro frontend de React en producción en la [parte 3](/es/part3/despliegue_de_la_aplicacion_a_internet), realizamos el bundling de nuestra aplicación con el comando _npm run build_. Debajo del capó, el script npm crea el bundle del código fuente, lo cual produce la siguiente colección de archivos en el directorio <i>dist</i>:

```
├── assets
│   ├── index-d526a0c5.css
│   ├── index-e92ae01e.js
│   └── react-35ef61ed.svg
├── index.html
└── vite.svg
```

El archivo <i>index.html</i> ubicado en la raíz del directorio <i>dist</i> es el "archivo principal" de la aplicación, el cual carga el archivo JavaScript empaquetado con la etiqueta <i>script</i>:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React</title>
    <script type="module" crossorigin src="/assets/index-e92ae01e.js"></script>
    <link rel="stylesheet" href="/assets/index-d526a0c5.css">
  </head>
  <body>
    <div id="root"></div>
    
  </body>
</html>
```

Como podemos ver en la aplicación de ejemplo que se creó con Vite, el script de build también crea el bundle de los archivos CSS de la aplicación en un solo archivo <i>/assets/index-d526a0c5.css</i>.

En la práctica, el bundling se realiza definiendo un punto de entrada para la aplicación, que normalmente es el archivo <i>index.js</i>. Cuando webpack hace el bundle del código, no solo el código del punto de entrada es incluido, sino que también el código que es importado por el punto de entrada, y así sucesivamente.

Dado que parte de los archivos importados son paquetes como React, Redux y Axios, el archivo JavaScript incluido también contendrá el contenido de cada una de estas librerías.

> La antigua forma de dividir el código de la aplicación en varios archivos se basaba en el hecho de que el archivo <i>index.html</i> cargaba todos los archivos JavaScript separados de la aplicación con la ayuda de etiquetas de script. Esto resultó en una disminución del rendimiento, ya que la carga de cada archivo por separado genera un esfuerzo extra. Por esta razón, en estos días, el método preferido es agrupar el código en un solo archivo.

A continuación, crearemos una configuración de webpack a mano, que sea adecuada para una aplicación React nueva.

Creemos un nuevo directorio para el proyecto con los siguientes subdirectorios (<i>build</i> y <i>src</i>) y archivos:

```
├── build
├── package.json
├── src
│   └── index.js
└── webpack.config.js
```

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

```bash
npm install --save-dev webpack webpack-cli
```

Definimos la funcionalidad de webpack en el archivo <i>webpack.config.js</i>, que inicializamos con el siguiente contenido:

```js
const path = require('path')

const config = () => {
  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'main.js'
    }
  }
}

module.exports = config
```

**Nota:** es posible definirlo directamente como un objeto en lugar de una función:

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

Un objeto puede ser suficiente para la mayoría de los casos, pero en algunos casos, necesitaremos ciertas características que requieren que la definición se realice como una función.

Luego definiremos un nuevo script npm llamado <i>build</i> que ejecutará el bundling con webpack:

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

Cuando ejecutamos el comando _npm run build_, webpack crea el bundle del código de nuestra aplicación. La operación producirá un nuevo archivo <i>main.js</i> que se agregará al directorio <i>build</i>:

![salida de terminal del comando de webpack, npm run build](../../images/7/19x.png)

El archivo contiene muchas cosas que parecen bastante interesantes. También podemos ver el código que escribimos anteriormente al final del archivo:

```js
eval("const hello = name => {\n  console.log(`hello ${name}`)\n}\n\n//# sourceURL=webpack://webpack-osa7/./src/index.js?");
```

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

Cuando creamos el bundle de la aplicación nuevamente con el comando _npm run build_, notamos que webpack ha reconocido a ambos archivos:

![salida del terminal mostrando a los dos archivos generados por webpack](../../images/7/20x.png)

El código de nuestra aplicación se puede encontrar al final del archivo del bundle en un formato bastante oscuro:

![salida del terminal mostrando nuestro código minificado](../../images/7/20z.png)

### Archivo de configuración

Echemos un vistazo más de cerca al contenido de nuestro archivo <i>webpack.config.js</i> actual:

```js
const path = require('path')

const config = () => {
  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'main.js'
    }
  }
}

module.exports = config
```

El archivo de configuración se ha escrito en JavaScript y el objeto de configuración se exporta utilizando la sintaxis del módulo de Node.

Nuestra definición de configuración mínima casi se explica sola. La propiedad [entry](https://webpack.js.org/concepts/#entry) del objeto de configuración, especifica el archivo que servirá como punto de entrada para hacer el bundling de la aplicación.

La propiedad [output](https://webpack.js.org/concepts/#output) define la ubicación donde se almacenará el código resultante del bundling. El directorio de destino debe definirse como una <i>ruta absoluta</i> que sea fácil de crear con el método [path.resolve](https://nodejs.org/docs/latest-v8.x/api/path.html#path_path_resolve_paths). También usamos [\_\_dirname](https://nodejs.org/docs/latest/api/modules.html#__dirname), que es una variable en Node que almacena la ruta al directorio actual.

### Bundling React

A continuación, transformemos nuestra aplicación en una aplicación React mínima. Instalemos las librerías necesarias:

```bash
npm install react react-dom
```

Y convirtamos nuestra aplicación en una aplicación React agregando las definiciones familiares en el archivo <i>index.js</i>:

```js
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

También realizaremos los siguientes cambios en el archivo <i>App.js</i>:

```js
import React from 'react' // necesitamos esto también ahora en los archivos de los componentes

const App = () => {
  return (
    <div>
      hello webpack
    </div>
  )
}

export default App
```

Todavía necesitamos el archivo <i>build/index.html</i> que servirá como la "página principal" de nuestra aplicación, el cual cargará nuestro bundle del código JavaScript con una etiqueta <i>script</i>:

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

Cuando creamos el bundle de nuestra aplicación, nos encontramos con el siguiente problema:

![salida del terminal, fallo de webpack, loader requerido](../../images/7/21x.png)

### Loaders (Cargadores)

El mensaje de error del paquete web indica que es posible que necesitemos un <i>loader</i> (cargador) adecuado para crear el bundle del archivo <i>App.js</i> correctamente. De forma predeterminada, webpack solo sabe cómo lidiar con JavaScript plano. Aunque es posible que no nos demos cuenta, en realidad estamos usando [JSX](https://facebook.github.io/jsx/) para renderizar nuestras vistas en React. Para ilustrar esto, el siguiente código no es JavaScript normal:

```js
const App = () => {
  return (
    <div>
      hello webpack
    </div>
  )
}
```

La sintaxis utilizada aquí proviene de JSX y nos proporciona una forma alternativa de definir un elemento React para una etiqueta <i>div</i> de HTML.

Podemos usar [loaders](https://webpack.js.org/concepts/loaders/) para informar a webpack de los archivos que deben procesarse antes de que se ejecute el bundling.

Configuremos un loader para nuestra aplicación que transforme el código JSX en JavaScript normal:

```js
const path = require('path')

const config = () => {
  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'main.js'
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
}

module.exports = config
```

Los loaders se definen en la propiedad <i>module</i> en el array de <i>rules</i>.

La definición de un solo loader consta de tres partes:

```js
{
  test: /\.js$/,
  loader: 'babel-loader',
  options: {
    presets: ['@babel/preset-react']
  }
}
```

La propiedad <i>test</i> especifica que el loader es para archivos que tienen nombres que terminan en <i>.js</i>. La propiedad <i>loader</i> especifica que el procesamiento de esos archivos se realizará con [babel-loader](https://github.com/babel/babel-loader). La propiedad <i>options</i> se utiliza para especificar parámetros para el cargador, que configuran su funcionalidad.

Instalemos el cargador y sus paquetes requeridos como una <i>dependencia de desarrollo</i>:

```bash
npm install @babel/core babel-loader @babel/preset-react --save-dev
```

El bundling de la aplicación ahora se realizará correctamente.

Si realizamos algunos cambios en el componente <i>App</i> y echamos un vistazo al código incluido, notamos que la versión del bundle del componente se ve así:

```js
const App = () =>
  react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
    'div',
    null,
    'hello webpack'
  )
```

Como podemos ver en este ejemplo, los elementos de React que se escribieron en JSX ahora se crean con JavaScript normal utilizando la función [createElement](https://react.dev/reference/react/createElement) de React.

Puedes probar la aplicación abriendo el archivo <i>build/index.html</i> con la opción <i>"Abrir archivo"</i> de tu navegador:

![navegador mostrando hello webpack](../../images/7/22.png)

Vale la pena señalar que si el código fuente de la aplicación incluida usa <i>async/await</i>, el navegador no renderizará nada en algunos navegadores. [Googlear el mensaje de error en la consola](https://stackoverflow.com/questions/33527653/babel-6-regeneratorruntime-is-not-defined) arrojará algo de luz sobre el problema. Con la solución previa a este problema estando [obsoleta](https://babeljs.io/docs/en/babel-polyfill/), ahora tenemos que instalar dos dependencias más, que son [core-js](https://www.npmjs.com/package/core-js) y [regenerator-runtime](https://www.npmjs.com/package/regenerator-runtime):

```bash
npm install core-js regenerator-runtime
```

Necesitas importar estas dependencias en la parte superior del archivo <i>index.js</i>:

```js
import 'core-js/stable/index.js'
import 'regenerator-runtime/runtime.js'
```

Nuestra configuración contiene casi todo lo que necesitamos para el desarrollo de React.

### Transpiladores

El proceso de transformar código de una forma de JavaScript a otra se denomina [transpilación](https://en.wiktionary.org/wiki/transpile). La definición general del término es compilar código fuente transformándolo de un lenguaje a otro.

Al utilizar la configuración de la sección anterior, estamos <i>transpilando</i> el código que contiene JSX en JavaScript normal con la ayuda de [babel](https://babeljs.io/), que actualmente es la herramienta más popular para el trabajo.

Como se mencionó en la parte 1, la mayoría de los navegadores no son compatibles con las funciones más recientes que se introdujeron en ES6 y ES7, y por esta razón, el código generalmente se transpila a una versión de JavaScript que implementa el estándar ES5.

El proceso de transpilación que ejecuta Babel se define con [plugins](https://babeljs.io/docs/plugins/). En la práctica, la mayoría de los desarrolladores utilizan [presets](https://babeljs.io/docs/plugins/) que son grupos de plugins pre-configurados.

Actualmente estamos usando el preset [@babel/preset-react](https://babeljs.io/docs/babel-preset-react/) para transpilar el código fuente de nuestra aplicación:

```js
{
  test: /\.js$/,
  loader: 'babel-loader',
  options: {
    presets: ['@babel/preset-react'] // highlight-line
  }
}
```

Agreguemos el plugin [@babel/preset-env](https://babeljs.io/docs/babel-preset-env/) que contiene todo lo necesario para tomar código que utiliza todas las funciones más recientes y para transpilarlo a un código que sea compatible con el estándar ES5:

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

```bash
npm install @babel/preset-env --save-dev
```

Cuando transpilamos el código, se transforma en JavaScript de la vieja escuela. La definición del componente <i>App</i> transformado se ve así:

```js
var App = function App() {
  return _react2.default.createElement('div', null, 'hello webpack')
};
```

Como podemos ver, las variables se declaran con la palabra clave _var_, ya que JavaScript ES5 no comprende la palabra clave _const_. Las funciones de flecha tampoco se utilizan, por lo que la definición de la función utilizó la palabra clave _function_.

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

E importemos el estilo en el archivo <i>index.js</i>:

```js
import './index.css'
```

Esto hará que el proceso de transpilación se interrumpa:

![falla de webpack: falta loader para css/style](../../images/7/23x.png)

Cuando usamos CSS, tenemos que usar los loaders [css](https://webpack.js.org/loaders/css-loader/) y [style](https://webpack.js.org/loaders/style-loader/):

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

El trabajo del [loader de css](https://webpack.js.org/loaders/css-loader/) es cargar los archivos <i>CSS</i> y el trabajo del [loader de style](https://webpack.js.org/loaders/style-loader/) es generar e inyectar un elemento <i>style</i> que contenga todos los estilos de la aplicación.

Con esta configuración, las definiciones CSS se incluyen en el archivo <i>main.js</i> de la aplicación. Por esta razón, no es necesario importar por separado los estilos <i>CSS</i> en el archivo principal <i>index.html</i>.

Si es necesario, el CSS de la aplicación también se puede generar en su propio archivo separado, mediante el [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin).

Cuando instalamos los loaders:

```bash
npm install style-loader css-loader --save-dev
```

El bundling volverá a realizarse correctamente y la aplicación obtendrá nuevos estilos.

### Webpack-dev-server

La configuración actual hace posible el desarrollo de nuestra aplicación, pero el flujo de trabajo es terrible (hasta el punto en que se parece al flujo de trabajo de desarrollo con Java). Cada vez que hacemos un cambio en el código, tenemos que crear el bundle y actualizar el navegador para probarlo.

El [webpack-dev-server](https://webpack.js.org/guides/development/#using-webpack-dev-server) ofrece una solución a nuestros problemas. Vamos a instalarlo con el comando:

```bash
npm install --save-dev webpack-dev-server
```

Definamos un script npm para iniciar el dev server:

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
    static: {
        directory: path.resolve(__dirname, 'build'),
    },
    compress: true,
    port: 3000,
  },
  // highlight-end
  // ...
};
```

El comando _npm start_ ahora iniciará el dev-server en el puerto 3000, lo que significa que nuestra aplicación estará disponible visitando <http://localhost:3000> en el navegador. Cuando hacemos cambios en el código, el navegador actualizará automáticamente la página.

El proceso de actualización del código es rápido. Cuando usamos el dev-server, el código no se incluye de la forma habitual en el archivo <i>main.js</i>. El resultado del bundling solo existe en la memoria.

Extendamos el código cambiando la definición del componente <i>App</i> como se muestra a continuación:

```js
import React, { useState } from 'react'
import './index.css'

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

La aplicación funciona bien y el flujo de trabajo de desarrollo es bastante fluido.

### Source maps

Extraigamos el controlador de clics en su propia función y almacenemos el valor anterior del contador en su propio estado <i>values</i>:

```js
const App = () => {
  const [counter, setCounter] = useState(0)
  const [values, setValues] = useState() // highlight-line

//highlight-start
  const handleClick = () => {
    setCounter(counter + 1)
    setValues(values.concat(counter))
  }
//highlight-end

  return (
    <div className="container">
      hello webpack {counter} clicks
      <button onClick={handleClick}> // highlight-line
        press
      </button>
    </div>
  )
}
```

La aplicación ya no funciona y la consola mostrará el siguiente error:

![consola de devtools, no puedes usar concat en undefined en handleClick](../../images/7/25.png)

Sabemos que el error está en el método onClick, pero si la aplicación fuera más grande, el mensaje de error sería bastante difícil de localizar:

```
App.js:27 Uncaught TypeError: Cannot read property 'concat' of undefined
    at handleClick (App.js:27)
```

La ubicación del error indicada en el mensaje no coincide con la ubicación real del error en nuestro código fuente. Si hacemos clic en el mensaje de error, notamos que el código fuente mostrado no se parece al código de nuestra aplicación:

![código fuente de devtools no muestra nuestro código fuente](../../images/7/26.png)

Por supuesto, queremos ver nuestro código fuente real en el mensaje de error.

Afortunadamente, corregir este mensaje de error es bastante fácil. Le pediremos a webpack que genere algo llamado [source map](https://webpack.js.org/configuration/devtool/) para nuestro bundle, que permite <i>mapear los errores</i> que ocurren durante la ejecución del bundle a la parte correspondiente en el código fuente original.

El source map se puede generar agregando una nueva propiedad <i>devtool</i> al objeto de configuración con el valor 'source-map':

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

Webpack debe reiniciarse cuando hagamos cambios en su configuración. También es posible hacer que webpack observe los cambios realizados a sí mismo, pero esta vez no lo haremos.

El mensaje de error ahora es mucho mejor

![consola de devtools mostrando error de concat en una linea diferente](../../images/7/27.png)

ya que se refiere al código que escribimos

![source de devtools mostrando nuestro código con values.concat](../../images/7/27eb.png)

La generación del source map también permite utilizar el debugger de Chrome:

![debugger de devtools pausado justo antes de la linea problemática](../../images/7/28.png)

Arreglemos el bug inicializando el estado de <i>values</i> como un array vacío:

```js
const App = () => {
  const [counter, setCounter] = useState(0)
  const [values, setValues] = useState([])
  // ...
}
```

### Minificando el código

Cuando desplegamos la aplicación en producción, usamos el bundle de código <i>main.js</i> que genera webpack. El tamaño del archivo <i>main.js</i> es 1009487 bytes, aunque nuestra aplicación solo contiene unas pocas líneas de nuestro propio código. El gran tamaño del archivo se debe al hecho de que el paquete también contiene el código fuente de toda la librería React. El tamaño del código incluido es importante, ya que el navegador tiene que cargar el código cuando se utiliza la aplicación por primera vez. Con conexiones a Internet de alta velocidad, 1009487 bytes no es un problema, pero si tuviéramos que seguir agregando más dependencias externas, las velocidades de carga podrían convertirse en un problema, particularmente para los usuarios móviles.

Si inspeccionamos el contenido del archivo del bundle, notamos que podría optimizarse en gran medida en términos de tamaño de archivo eliminando todos los comentarios. No tiene sentido optimizar manualmente estos archivos, ya que existen muchas herramientas para realizar el trabajo.

El proceso de optimización para archivos JavaScript se llama <i>minificación</i>. Una de las principales herramientas destinadas a este fin es [UglifyJS](https://github.com/mishoo/UglifyJS/).

A partir de la versión 4 de webpack, el complemento de minificación no requiere configuración adicional para su uso. Basta con modificar el script npm en el archivo <i>package.json</i> para especificar que webpack ejecutará el bundling del código en modo de <i>producción</i>:

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

Cuando creamos el bundle de la aplicación nuevamente, el tamaño del archivo <i>main.js</i> disminuye sustancialmente:

```bash
$ ls -l build/main.js
-rw-r--r--  1 mluukkai  ATKK\hyad-all  227651 Feb  7 15:58 build/main.js
```

La salida del proceso de minificación se asemeja al código C de la vieja escuela; Se han eliminado todos los comentarios e incluso los espacios en blanco innecesarios y los caracteres de nueva línea, los nombres de las variables se han reemplazado por un solo carácter.

```js
function h(){if(!d){var e=u(p);d=!0;for(var t=c.length;t;){for(s=c,c=[];++f<t;)s&&s[f].run();f=-1,t=c.length}s=null,d=!1,function(e){if(o===clearTimeout)return clearTimeout(e);if((o===l||!o)&&clearTimeout)return o=clearTimeout,clearTimeout(e);try{o(e)}catch(t){try{return o.call(null,e)}catch(t){return o.call(this,e)}}}(e)}}a.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)
```

### Configuración de desarrollo y producción

A continuación, agreguemos un backend a nuestra aplicación, reutilicemos el backend de la ya conocida aplicación de notas.

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

Nuestro objetivo es configurar la aplicación con webpack de tal manera que, cuando se use localmente, la aplicación use el json-server disponible en el puerto 3001 como su backend.

El archivo del bundle se configurará para usar el backend disponible en la URL <https://notes2023.fly.dev/api/notes>.

Instalaremos <i>axios</i>, iniciaremos el json-server y luego realizaremos los cambios necesarios en la aplicación. Con el fin de cambiar las cosas, obtendremos las notas del backend con nuestro [hook personalizado](/es/part7/hooks_personalizados) llamado _useNotes_:

```js
// highlight-start
import React, { useState, useEffect } from 'react'
import axios from 'axios'

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
  const url = 'https://notes2023.fly.dev/api/notes' // highlight-line
  const notes = useNotes(url) // highlight-line

  const handleClick = () => {
    setCounter(counter + 1)
    setValues(values.concat(counter))
  }

  return (
    <div className="container">
      hello webpack {counter} clicks
      <button onClick={handleClick}>press</button>
      <div>{notes.length} notes on server {url}</div> // highlight-line
    </div>
  )
}

export default App
```

La dirección del servidor backend está actualmente hardcodeada en el código de la aplicación. ¿Cómo podemos cambiar la dirección de forma controlada para que apunte al servidor de backend de producción cuando el código está empaquetado para producción?

La función de configuración de webpack tiene dos parámetros, <i>env</i> y <i>argv</i>. Podemos usar el segundo para averiguar el <i>modo</i> definido en el script npm:

```js
const path = require('path')

const config = (env, argv) => { // highlight-line
  console.log('argv.mode:', argv.mode)
  return {
    // ...
  }
}

module.exports = config
```

Ahora bien, si queremos, podemos configurar webpack para que funcione de manera diferente dependiendo de si el entorno de operación de la aplicación, o <i>mode</i>, está configurado para producción o desarrollo.

También podemos usar [DefinePlugin](https://webpack.js.org/plugins/define-plugin/) de webpack para definir <i>constantes globales predeterminadas</i> que se pueden usar en el código del bundle. Definamos una nueva constante global <i>BACKEND\_URL</i>, que obtiene un valor diferente según el entorno para el que se hace el bundle del código:

```js
const path = require('path')
const webpack = require('webpack') // highlight-line

const config = (env, argv) => {
  console.log('argv', argv.mode)

  // highlight-start
  const backend_url = argv.mode === 'production'
    ? 'https://notes2023.fly.dev/api/notes'
    : 'http://localhost:3001/notes'
  // highlight-end

  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'main.js'
    },
    devServer: {
      static: path.resolve(__dirname, 'build'),
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

Ahora, si la aplicación se inicia con el comando _npm start_ en modo de desarrollo, obtiene las notas de la dirección <http://localhost:3001/notes>. La versión empaquetada con el comando _npm run build_ usa la dirección https://notes2023.fly.dev/api/notes para obtener la lista de notas.

Podemos inspeccionar el bundle de la versión de producción de la aplicación localmente, ejecutando el siguiente comando en el directorio <i>build</i>:

```bash
npx static-server
```

De forma predeterminada, la aplicación incluida estará disponible en <http://localhost:9080>.

### Polyfill

Nuestra aplicación está terminada y funciona con todas las versiones relativamente recientes de los navegadores modernos, con la excepción de Internet Explorer. La razón de esto es que debido a _axios_, nuestro código usa [Promises](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Promise), y ninguna versión existente de IE las admite:

![gráfica de compatibilidad de navegadores mostrando cuan malo es internet explorer](../../images/7/29.png)

Hay muchas otras cosas en el estándar que IE no admite. Algo tan inofensivo como el método [find](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/find) de arrays de JavaScript supera las capacidades de IE:

![gráfica de compatibilidad de navegadores mostrando que internet explorer no soporta el metodo find](../../images/7/30.png)

En estas situaciones, no es suficiente con transpilar el código, ya que la transpilación simplemente transforma el código de una versión más nueva de JavaScript a una más antigua con un soporte de navegador más amplio. IE entiende las Promesas sintácticamente, pero simplemente no ha implementado su funcionalidad. La propiedad _find_ de arrays en IE es simplemente <i>undefined</i>.

Si queremos que la aplicación sea compatible con IE, debemos agregar un [polyfill](https://remysharp.com/2010/10/08/what-is-a-polyfill), que es un código que agrega la funcionalidad que falta a los navegadores más antiguos.

Los polyfills se pueden agregar con la ayuda de [webpack ay Babel](https://babeljs.io/docs/usage/polyfill/) o instalando una de las muchas librerías de polyfill existentes.

El polyfill proporcionado por la librería [promise-polyfill](https://www.npmjs.com/package/promise-polyfill) es fácil de usar, simplemente tenemos que agregar lo siguiente al código de nuestra aplicación:

```js
import PromisePolyfill from 'promise-polyfill'

if (!window.Promise) {
  window.Promise = PromisePolyfill
}
```

Si el objeto global _Promise_ no existe, lo que significa que el navegador no es compatible con Promises, el polyfilled Promise se almacena en la variable global. Si polyfilled Promise se implementa lo suficientemente bien, el resto del código debería funcionar sin problemas.

Puedes encontrar una lista exhaustiva de polyfills existentes [aquí](https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-browser-Polyfills).

La compatibilidad del navegador con diferentes APIs se puede verificar visitando [https://caniuse.com](https://caniuse.com) o [el sitio web de Mozilla](https://developer.mozilla.org/en-US/).

</div>
