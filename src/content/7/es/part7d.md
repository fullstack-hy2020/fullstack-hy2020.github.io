---
mainImage: ../../../images/part-7.svg
part: 7
letter: d
lang: es
---

<div class="content">

En los primeros tiempos, React era algo famoso por ser muy difícil de configurar con las herramientas necesarias para el desarrollo de aplicaciones. Para facilitar la situación, se desarrolló [Create React App](https://github.com/facebookincubator/create-react-app), que eliminó los problemas relacionados con la configuración. [Vite](https://vitejs.dev/), que se utiliza a lo largo de este curso, ha reemplazado desde entonces a Create React App como el estándar para nuevas aplicaciones React.

Tanto Vite como Create React App utilizan <i>bundlers</i> para hacer el trabajo real. En esta sección veremos más de cerca qué hacen realmente los bundlers, cómo funciona Vite por debajo y cómo configurarlo para distintos escenarios. También examinaremos brevemente [esbuild](https://esbuild.github.io/), un bundler de bajo nivel que el propio Vite usa internamente. Entender esbuild ayuda a aclarar qué significa, en el fondo, el bundling.

> #### ¿Y Webpack?
>
>Webpack fue el bundler dominante durante la mayor parte de la década de 2010 y todavía aparece en bases de código antiguas y empresariales. Este curso también cubrió Webpack hasta la primavera de 2026.
>
> Si trabajas en un proyecto legacy, es útil saber que Webpack existe y que utiliza los mismos conceptos básicos (entry points, loaders/plugins, output). Sin embargo, en 2026 no se recomienda configurar un proyecto nuevo con Webpack. Su configuración es compleja y las herramientas modernas como Vite proporcionan una experiencia de desarrollo mucho mejor. No cubriremos la configuración de Webpack en este curso.

### Bundling

Hemos implementado nuestras aplicaciones dividiendo nuestro código en módulos separados que han sido <i>importados</i> en los lugares que los necesitan. Aunque los módulos ES6 están definidos en el estándar ECMAScript, no todos los entornos de ejecución manejan automáticamente el código basado en módulos. Incluso los navegadores modernos se benefician de que las dependencias se preprocesen y optimicen antes de ser entregadas.

Por esta razón, el código dividido en módulos se <i>empaqueta</i> para producción, es decir, los archivos de código fuente se transforman y combinan en un conjunto optimizado de archivos que el navegador puede cargar eficientemente. Cuando ejecutamos <i>npm run build</i> en partes anteriores del curso, Vite realizó este bundling. La salida aparece en el directorio <i>dist</i>:

```
├── assets
│   ├── index-d526a0c5.css
│   ├── index-e92ae01e.js
│   └── react-35ef61ed.svg
├── index.html
└── vite.svg
```

El archivo <i>index.html</i> de la raíz carga el JavaScript empaquetado con una etiqueta <i>script</i>:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React</title>
    <script type="module" crossorigin src="/assets/index-e92ae01e.js"></script> // highlight-line
    <link rel="stylesheet" href="/assets/index-d526a0c5.css">  // highlight-line
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

El CSS también se empaqueta en un único archivo.

En la práctica, el bundling parte de un entry point, que normalmente es <i>main.jsx</i>. Vite incluye no solo el código del entry point, sino también todo lo que este importa, recursivamente, hasta que se resuelve el grafo completo de dependencias.

Dado que parte de los archivos importados son paquetes como React, Redux y Axios, el archivo JavaScript empaquetado también contendrá el contenido de cada una de esas librerías.

> Antes de que existieran los bundlers, el enfoque antiguo se basaba en que el archivo index.html cargaba todos los archivos JavaScript separados de la aplicación con ayuda de etiquetas script. Esto provocaba un peor rendimiento, ya que la carga de cada archivo separado genera cierta sobrecarga. Por eso, hoy en día el método preferido es agrupar el código en un solo archivo. El bundling también permite optimizaciones como la minificación y el <i>tree-shaking</i> (eliminación de código no utilizado).

### Cómo funciona Vite

Vite tiene dos modos de funcionamiento claramente distintos, y funcionan de forma bastante diferente.

**Modo de desarrollo** (<i>npm run dev</i>) no empaqueta tu código en absoluto. En su lugar, Vite arranca un servidor de desarrollo que sirve los archivos fuente como módulos ES nativos, dejando que el navegador resuelva los imports directamente. Por eso el arranque es casi instantáneo independientemente del tamaño del proyecto.
Hay una excepción: las dependencias de terceros de node_modules se preempaquetan con esbuild antes de que arranque el servidor. Esto resuelve dos problemas: muchos paquetes de npm siguen estando en formato CommonJS (que los navegadores no pueden consumir nativamente) y algunas librerías consisten en cientos de pequeños archivos internos que, de otro modo, provocarían cientos de peticiones separadas. esbuild convierte y consolida esas dependencias, cachea el resultado en disco, y los siguientes arranques son casi instantáneos.

**Modo de producción** (<i>npm run build</i>) utiliza [Rollup](https://rollupjs.org/) para el bundling, con esbuild encargándose todavía de otras tareas como la transpilación (JSX, TypeScript) y la minificación. Rollup fue diseñado desde el principio para módulos ES, lo que lo hace especialmente bueno en <i>tree-shaking</i>, una técnica que analiza estáticamente qué exports de cada módulo se usan realmente y elimina el resto del bundle final. Por ejemplo, si importas una sola función de utilidad de una librería grande, el tree-shaking garantiza que el resto del código de esa librería no se incluya en el bundle. Esto puede reducir significativamente el tamaño final.

La división del trabajo, esbuild para la velocidad y Rollup para la calidad del bundle, es central en el diseño de Vite.

> Puede que te preguntes por qué Vite no usa simplemente esbuild también para el bundling en producción, dado lo rápido que es. La razón es que la salida de bundling de esbuild, aunque correcta, produce resultados menos optimizados en escenarios avanzados: tiene soporte limitado para code splitting, no genera el mismo nivel de optimización de chunks y su ecosistema de plugins para transformaciones a nivel de bundle todavía está madurando. La salida de Rollup es más predecible y está mejor ajustada para los grafos de dependencias complejos que producen las aplicaciones reales. Los autores de Vite [han afirmado](https://vitejs.dev/guide/why.html#why-not-bundle-with-esbuild) que su intención es cambiar a esbuild para el bundling de producción cuando sus capacidades cierren esa brecha.

### Entendiendo esbuild

Para entender qué implica realmente el bundling, es útil trabajar directamente con [esbuild](https://esbuild.github.io/), sin la capa de abstracción que Vite añade encima. Construyamos un entorno React mínimo desde cero.

Vamos a crear una app React sencilla con la siguiente estructura de directorios:

```
├── dist
│   └── index.html
├── src
│   ├── index.jsx
│   └── App.jsx
└── package.json
```

Empezamos instalando React y react-dom:

```bash
npm install react react-dom
```

También necesitamos instalar esbuild:

```bash
npm install --save-dev esbuild
```

Al principio añadimos dos scripts al archivo <i>package.json</i>:

```json
{
  "scripts": {
    "build": "esbuild src/main.jsx --bundle --outfile=dist/main.js --jsx=automatic",
    "serve": "npx serve dist"
  },
  // ...
}
```

Para la app necesitamos el archivo <i>dist/index.html</i>, que carga el bundle JavaScript:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>esbuild app</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="./main.js"></script>
  </body>
</html>
```

El entry point <i>src/main.jsx</i> es el típico:

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

El componente simple de la aplicación <i>src/App.jsx</i> es el siguiente:

```jsx
import React, { useState } from 'react'

const App = () => {
  const [counter, setCounter] = useState(0)

  return (
    <div>
      <p>count: {counter}</p>
      <button onClick={() => setCounter(counter + 1)}>increment</ button>
    </div>
  )
}

export default App
```

Ahora podemos empaquetar la app:

```bash
npm run build
```

La salida es un único <i>dist/main.js</i> que contiene el código de tu aplicación junto con la librería React empaquetada.

Ahora podemos ejecutar la app empaquetada con <i>npm run serve</i>. Esto usa el paquete [serve](https://www.npmjs.com/package/serve) para iniciar un servidor estático local para el directorio <i>dist</i>, dejando la aplicación disponible en <i>http://localhost:3000</i>:

![](../../images/7/es1.png)

esbuild también soporta [minificación](https://en.wikipedia.org/wiki/Minification_(programming)) mediante flags de línea de comandos. La minificación elimina espacios en blanco y comentarios, acorta nombres de variables y aplica otras optimizaciones de tamaño. El bundle será notablemente grande porque incluye la librería React completa. La minificación reduce mucho su tamaño.

Activemos ahora la minificación:

```json
{
  "scripts": {
    "build": "esbuild src/main.jsx --bundle --minify --outfile=dist/main.js --jsx=automatic",  // highlight-line
    "serve": "npx serve dist"
  }
}
```

La minificación reduce el tamaño del bundle de alrededor de 1,1 MB a unos 190 KB, una reducción importante.

La minificación tiene una contrapartida: si la aplicación lanza un error en tiempo de ejecución, las herramientas de desarrollo del navegador señalarán una línea del archivo minificado <i>main.js</i>, que es prácticamente imposible de leer:

![](../../images/7/es2.png)

La solución es un [source map](https://developer.mozilla.org/en-US/docs/Glossary/Source_map): un archivo complementario (<i>dist/main.js.map</i>) que registra cómo cada línea del bundle minificado corresponde al código fuente original. Con él activado, un stack trace apunta a la línea exacta de <i>App.jsx</i> o <i>main.jsx</i> en lugar de hacerlo a un muro ilegible de código minificado.

Podemos activar los source maps añadiendo el flag <i>--sourcemap</i>:

```json
{
  "scripts": {
    "build": "esbuild src/main.jsx --bundle --minify --sourcemap --outfile=dist/main.js --jsx=automatic",  // highlight-line
    "serve": "npx serve dist"
  }
}
```

Ahora el error tiene sentido:

![](../../images/7/es3.png)

Ten en cuenta que los source maps son muy valiosos durante el desarrollo y la depuración, pero puede que quieras dejarlos fuera de un build público de producción. Como un source map contiene tu código fuente original, cualquiera que abra las herramientas de desarrollo del navegador puede leer la lógica sin minificar de tu aplicación. Si eso te preocupa, simplemente omite el flag <i>--sourcemap</i> en el comando de build de producción.

### Transpilación

Junto con el bundling, esbuild realiza otra tarea esencial: la <i>transpilación</i>. Transpilar significa convertir código fuente escrito en una forma de JavaScript a otra forma, normalmente de sintaxis moderna o extendida a JavaScript plano que el navegador pueda ejecutar.

Los navegadores entienden JavaScript estándar, pero JSX no es JavaScript válido y ningún navegador puede parsearlo directamente. Cuando escribimos:

```jsx
const element = <App />
```

hay que transpilarlo a algo que el navegador sí pueda ejecutar:

```js
const element = React.createElement(App, null)
```

Por eso la transpilación es un paso obligatorio en cualquier proyecto React, no una optimización opcional. esbuild la realiza automáticamente durante el bundling. Con el flag <i>--jsx=automatic</i>, esbuild maneja JSX sin ninguna herramienta externa. En el flujo antiguo basado en Webpack había que instalar y configurar [Babel](https://babeljs.io/) y paquetes relacionados para transpilar JSX para el navegador. Con esbuild, los archivos que terminan en <i>.jsx</i> se transpilan directamente.

### Entorno de desarrollo

Hasta ahora, cada cambio requiere ejecutar <i>npm run build</i> y refrescar manualmente el navegador, un ciclo lento que rápidamente se vuelve tedioso. El [servidor de desarrollo](https://esbuild.github.io/api/#serve) integrado de esbuild resuelve esto. Añade un script <i>dev</i> a <i>package.json</i>:

```json
{
  "scripts": {
    "build": "esbuild src/main.jsx --bundle --minify --sourcemap --outfile=dist/main.js --jsx=automatic",
    "serve": "npx serve dist",
    "dev": "esbuild src/main.jsx --bundle --outfile=dist/main.js --jsx=automatic --servedir=./dist --watch" // highlight-line
  }
}
```

Ejecutar <i>npm run dev</i> hace dos cosas a la vez. En primer lugar, [--watch](https://esbuild.github.io/api/#watch) le dice a esbuild que observe todos los archivos fuente importados y reconstruya el bundle automáticamente siempre que alguno se guarde. En segundo lugar, [--servedir](https://esbuild.github.io/api/#serve) inicia un servidor HTTP ligero que sirve el contenido del directorio <i>dist</i>, tu <i>index.html</i> y el <i>main.js</i> recién generado en <i>http://localhost:8000</i>.

El flag <i>--servedir</i> es lo que hace que ambas piezas funcionen juntas: sin él, esbuild solo reconstruiría en modo watch pero no serviría nada. Con él, el servidor siempre entrega el último bundle, así que solo necesitas refrescar el navegador después de guardar un archivo.

Ten en cuenta que, a diferencia del servidor de desarrollo de Vite, esbuild no soporta hot module replacement. Los cambios en el código fuente requieren un refresco manual del navegador para surtir efecto.

La claridad de la interfaz de esbuild ilustra lo que hace fundamentalmente un bundler: toma un entry point, sigue todos los imports y produce una salida optimizada. Vite construye encima de esta base y añade la capa de experiencia de desarrollo: un servidor dev, hot module replacement y valores por defecto sensatos para proyectos React.

Ahora que tenemos una imagen más clara de lo que implican realmente el bundling y la transpilación, volvamos a Vite y veamos cómo puede configurarse.

### Configuración de Vite

Para la mayoría de los proyectos React, Vite funciona sin ninguna configuración. Sin embargo, cuando sí necesitas personalizar su comportamiento, editas <i>vite.config.js</i> (o <i>vite.config.ts</i>).

Una configuración mínima de Vite para un proyecto React se ve así:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

El plugin <i>@vitejs/plugin-react</i> habilita la transformación de JSX, fast refresh (hot module replacement que conserva el estado del componente) y otras características específicas de React.

#### Configuración del servidor de desarrollo

Puedes configurar el puerto del servidor de desarrollo y otros ajustes bajo la clave <i>server</i>:

```js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,        // open browser automatically
  },
})
```

#### Proxy de peticiones API

Cuando desarrollas en local, tu app React normalmente se ejecuta en un puerto (por ejemplo, 3000) mientras que tu backend corre en otro (por ejemplo, 3001). La política same-origin del navegador normalmente bloquearía las peticiones entre ambos. La configuración de proxy de Vite resuelve esto sin requerir configuración CORS en el backend:

```js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
```

Con esta configuración, cualquier petición que tu app React haga a <i>/api/notes</i> se reenviará automáticamente a <i>http://localhost:3001/api/notes</i> a través del servidor de desarrollo de Vite. Tu código frontend nunca necesita incluir <i>localhost:3001</i> en sus URLs durante el desarrollo.

#### Variables de entorno

Vite incluye soporte integrado para variables de entorno mediante archivos <i>.env</i>. Este es el reemplazo moderno de inyectar constantes manualmente en el bundle.

Crea un archivo <i>.env</i> en la raíz del proyecto:

```
VITE_BACKEND_URL=http://localhost:3001/api/notes
```

Y un archivo <i>.env.production</i> para los valores de producción:

```
VITE_BACKEND_URL=https://myapp.fly.dev/api/notes
```

**Importante:** todas las variables de entorno expuestas al navegador deben empezar con el prefijo <i>VITE_</i>. Las variables sin este prefijo permanecen solo del lado del servidor y no se incluyen en el bundle. Es una medida de seguridad deliberada para evitar filtrar secretos accidentalmente.

Accede a la variable en el código de tu aplicación a través de <i>import.meta.env</i>:

```js
const App = () => {
  const notes = useNotes(import.meta.env.VITE_BACKEND_URL)

  return (
    <div>
      {notes.length} notes on server {import.meta.env.VITE_BACKEND_URL}
    </div>
  )
}
```

Vite selecciona automáticamente el archivo <i>.env</i> correcto según el modo:

- <i>npm run dev</i> usa <i>.env</i> y <i>.env.development</i>
- <i>npm run build</i> usa <i>.env</i> y <i>.env.production</i>

Añade <i>.env.production</i> a <i>.gitignore</i> si contiene valores sensibles, y utiliza <i>.env.example</i> para documentar qué variables son necesarias.

#### Transpilación

Vite gestiona la transpilación del código automáticamente. Durante el desarrollo, esbuild transpila tu TypeScript y JSX bajo demanda. Es lo bastante rápido como para hacerlo archivo por archivo sin retraso apreciable. Durante los builds de producción, Rollup se encarga del bundling mientras que esbuild realiza la transpilación.

El objetivo de transpilación por defecto en Vite son navegadores modernos que soportan módulos ES nativos (Chrome 87+, Firefox 78+, Safari 14+, Edge 88+). Si necesitas soportar navegadores más antiguos, puedes configurar el target explícitamente y añadir el plugin <i>@vitejs/plugin-legacy</i>:

```bash
npm install --save-dev @vitejs/plugin-legacy
```

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
})
```

El plugin legacy genera automáticamente un bundle separado para navegadores antiguos usando Babel.

#### CSS

Vite maneja CSS sin ninguna configuración. Simplemente importa un archivo CSS desde tu JavaScript:

```js
import './index.css'
```

Vite lo procesará y lo incluirá en el build. En producción, el CSS se extrae a un archivo separado. Durante el desarrollo, se inyecta mediante etiquetas <i>&lt;style&gt;</i> con soporte de hot reload.

Vite también soporta de forma nativa [CSS Modules](https://github.com/css-modules/css-modules) para estilos con alcance local. Cualquier archivo que termine en <i>.module.css</i> se trata como un CSS Module:

```js
import styles from './App.module.css'

const App = () => (
  <div className={styles.container}>
    hello vite
  </div>
)
```

Los preprocessors de CSS como [Sass](https://sass-lang.com/) pueden añadirse simplemente instalando el preprocessor, sin plugin ni configuración adicional:

```bash
npm install --save-dev sass
```

Después de eso, los archivos <i>.scss</i> funcionan automáticamente.

#### Minificación

Al ejecutar <i>npm run build</i>, Vite minifica la salida. La minificación elimina espacios en blanco y comentarios, acorta nombres de variables y aplica otras optimizaciones de tamaño. El resultado es un archivo mucho más pequeño que carga más rápido en el navegador.

Vite usa esbuild para la minificación de JavaScript y un minificador integrado de CSS para las hojas de estilo.

#### Source maps

Los source maps permiten que las herramientas de desarrollo del navegador mapeen errores y breakpoints a tu código fuente original en lugar de al bundle minificado. Sin ellos, un stack trace que apunta a la línea 1 de <i>main.js</i> sirve de muy poco para depurar.

En desarrollo, Vite genera source maps automáticamente. Para builds de producción, puedes habilitarlos explícitamente:

```js
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
  },
})
```

Ten en cuenta que los source maps de producción aumentan el tiempo de build y exponen tu código fuente a cualquiera que mire la pestaña de red. En muchos casos, es mejor subir los source maps a un servicio de monitorización de errores (como Sentry) y no publicarlos en el servidor.

#### Plugins

La funcionalidad de Vite se amplía mediante [plugins](https://vite.dev/plugins/). El ecosistema de plugins ha crecido rápidamente y cubre la mayoría de las necesidades comunes. Algunos plugins ampliamente utilizados incluyen:

- <i>@vitejs/plugin-react</i> — soporte para React (JSX, fast refresh)
- <i>@vitejs/plugin-legacy</i> — soporte para navegadores antiguos
- <i>vite-plugin-svgr</i> — importar archivos SVG como componentes React
- <i>rollup-plugin-visualizer</i> — análisis del tamaño del bundle

Los plugins se especifican en el array <i>plugins</i> dentro de <i>vite.config.js</i>. Siguen la misma interfaz que los plugins de Rollup, por lo que muchos plugins de Rollup también funcionan con Vite.

#### Polyfills

Un <i>polyfill</i> es código que implementa una funcionalidad para navegadores que no la soportan de forma nativa. La transpilación por sí sola no basta para características que son sintácticamente válidas pero no están implementadas. Por ejemplo, un navegador puede parsear <i>Promise</i> correctamente pero no tener implementación de esa API.

Con Vite, los polyfills se gestionan mediante el plugin <i>@vitejs/plugin-legacy</i>, que incluye automáticamente los polyfills necesarios según tus targets de navegador. Si necesitas un polyfill específico sin usar el plugin legacy, puedes instalarlo directamente e importarlo al principio de tu archivo de entrada.

Puedes consultar la compatibilidad de APIs concretas en [https://caniuse.com](https://caniuse.com) o en la [documentación MDN de Mozilla](https://developer.mozilla.org/).

</div>
