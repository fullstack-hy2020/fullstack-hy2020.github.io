---
mainImage: ../../../images/part-7.svg
part: 7
letter: e
lang: es
---

<div class="content">

### Componentes de clase

Durante el curso solo hemos utilizado componentes de React que se han definido como funciones de Javascript. Esto no fue posible sin la funcionalidad de [hooks](https://reactjs.org/docs/hooks-intro.html) que venía con la versión 16.8 de React. Antes, al definir un componente que usa estado, uno tenía que definirlo usando la sintaxis de Javascript de [Clase](https://reactjs.org/docs/state-and-lifecycle.html#converting-a-function-to-a-class).


Es beneficioso al menos estar familiarizado con los componentes de clase hasta cierto punto, ya que el mundo contiene una gran cantidad de código React antiguo, que probablemente nunca se reescribirá por completo con la sintaxis actualizada.


Conozcamos las características principales de los componentes de clase produciendo otra aplicación anécdota muy familiar. Almacenamos las anécdotas en el archivo<i>db.json</i> usando <i>json-server</i>. El contenido del archivo se extrae de [aquí](https://github.com/fullstack-hy2020/misc/blob/master/anecdotes.json).


La versión inicial del componente de clase se ve así

```js
import React from 'react'

class App extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <h1>anecdote of the day</h1>
      </div>
    )
  }
}

export default App
```


El componente ahora tiene un [constructor](https://reactjs.org/docs/react-component.html#constructor), en el que no sucede nada en este momento, y contiene el método [render](https://reactjs.org/docs/react-component.html#render). Como se puede suponer, render define cómo y qué se renderiza en la pantalla.


Definamos un estado para la lista de anécdotas y la anécdota actualmente visible. A diferencia de cuando se usa el hook [useState](https://reactjs.org/docs/hooks-state.html), los componentes de clase solo contienen un estado. Por tanto, si el estado se compone de varias "partes", deben almacenarse como propiedades del estado. El estado se inicializa en el constructor:

```js
class App extends React.Component {
  constructor(props) {
    super(props)

    // highlight-start
    this.state = {
      anecdotes: [],
      current: 0
    }
    // highlight-end
  }

  render() {
	// highlight-start
    if (this.state.anecdotes.length === 0 ) {
      return <div>no anecdotes...</div>
    }
	// highlight-end

    return (
      <div>
        <h1>anecdote of the day</h1>
		// highlight-start
        <div>
          {this.state.anecdotes[this.state.current].content} // highlight-line
		</div>
        <button>next</button>
		// highlight-end
      </div>
    )
  }
}
```

El estado del componente está en la variable de instancia _this.state_. El estado es un objeto que tiene dos propiedades. <i>this.state.anecdotes</i> es la lista de anécdotas y <i>this.state.current</i> es el índice de la anécdota que se muestra actualmente.

En componentes funcionales, el lugar adecuado para obtener datos de un servidor es dentro de un [effect hook](https://reactjs.org/docs/hooks-effect.html), que se ejecuta cuando un componente se renderiza o con menos frecuencia si es necesario, por ejemplo, solo en combinación con el primer renderizado.

Los [métodos de ciclo de vida](https://reactjs.org/docs/state-and-lifecycle.html#adding-lifecycle-methods-to-a-class) de componentes de clase ofrecen la funcionalidad correspondiente. El lugar correcto para desencadenar la obtención de datos de un servidor es dentro del método de ciclo de vida [componentDidMount](https://reactjs.org/docs/react-component.html#componentdidmount), que se ejecuta una vez justo después de la primera vez que se renderiza un componente:

```js
class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      anecdotes: [],
      current: 0
    }
  }

  // highlight-start
  componentDidMount = () => {
    axios.get('http://localhost:3001/anecdotes').then(response => {
      this.setState({ anecdotes: response.data })
    })
  }
  // highlight-end

  // ...
}
```


La función callback de la solicitud HTTP actualiza el estado del componente mediante el método [setState](https://reactjs.org/docs/react-component.html#setstate). El método solo toca las keys que se han definido en el objeto pasado al método como argumento. El valor de la key <i>current</i> permanece sin cambios.


Llamar al método setState siempre desencadena la re-renderización del componente de clase, es decir que realiza nuevamente un llamado al método _render_.


Terminaremos el componente con la posibilidad de cambiar la anécdota mostrada. El siguiente es el código para todo el componente con la adición resaltada:

```js
class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      anecdotes: [],
      current: 0
    }
  }

  componentDidMount = () => {
    axios.get('http://localhost:3001/anecdotes').then(response => {
      this.setState({ anecdotes: response.data })
    })
  }

  // highlight-start
  handleClick = () => {
    const current = Math.floor(
      Math.random() * this.state.anecdotes.length
    )
    this.setState({ current })
  }
  // highlight-end

  render() {
    if (this.state.anecdotes.length === 0 ) {
      return <div>no anecdotes...</div>
    }

    return (
      <div>
        <h1>anecdote of the day</h1>
        <div>{this.state.anecdotes[this.state.current].content}</div>
        <button onClick={this.handleClick}>next</button> // highlight-line
      </div>
    )
  }
}
```



A modo de comparación, aquí está la misma aplicación como un componente funcional:

```js
const App = () => {
  const [anecdotes, setAnecdotes] = useState([])
  const [current, setCurrent] = useState(0)

  useEffect(() =>{
    axios.get('http://localhost:3001/anecdotes').then(response => {
      setAnecdotes(response.data)
    })
  },[])

  const handleClick = () => {
    setCurrent(Math.round(Math.random() * (anecdotes.length - 1)))
  }

  if (anecdotes.length === 0) {
    return <div>no anecdotes...</div>
  }

  return (
    <div>
      <h1>anecdote of the day</h1>
      <div>{anecdotes[current].content}</div>
      <button onClick={handleClick}>next</button>
    </div>
  )
}
```

En el caso de nuestro ejemplo, las diferencias fueron menores. La mayor diferencia entre los componentes funcionales y los componentes de clase es principalmente que el estado de un componente de clase es un solo objeto y que el estado se actualiza utilizando el método _setState_, mientras que en los componentes funcionales el estado puede constar de múltiples variables diferentes, con todas ellos tienen su propia función de actualización.

En algunos casos de uso más avanzados, el hook effect ofrece un mecanismo considerablemente mejor para controlar los efectos secundarios en comparación con los métodos de ciclo de vida de los componentes de clase.

Un beneficio notable de usar componentes funcionales es no tener que lidiar con la autorreferencia _this_ de la clase Javascript.

En mi opinión, y la opinión de muchos otros, los componentes de clase básicamente no ofrecen beneficios sobre los componentes funcionales mejorados con hooks, con la excepción del llamado mecanismo de [error boundary](https://reactjs.org/docs/error-boundaries.html), que actualmente (15 de febrero de 2021) aún no está en uso por componentes funcionales.

Al escribir código nuevo, [no hay ninguna razón racional para usar Componentes de Clase](https://reactjs.org/docs/hooks-faq.html#should-i-use-hooks-classes-or-a-mix-of-both) si el proyecto usa React con un número de versión 16.8 o superior. Por otro lado, actualmente [no hay necesidad de reescribir todo el código React antiguo](https://reactjs.org/docs/hooks-faq.html#do-i-need-to-rewrite-all-my-class-components) como componentes funcionales.

### Organización del código en la aplicación de React

En la mayoría de las aplicaciones seguimos el principio según el cual los componentes se colocaban en el directorio <i>components</i>, los reducers se colocan en el directorio <i>reducers</i> y el código responsable de comunicarse con el servidor se colocaba en el directorio <i>services</i>. Esta forma de organización se adapta perfectamente a una aplicación más pequeña, pero a medida que aumenta la cantidad de componentes, se necesitan mejores soluciones. No existe una forma correcta de organizar un proyecto. El artículo [La forma 100% correcta de estructurar una aplicación React (o por qué no existe tal cosa)](https://medium.com/hackernoon/the-100-correct-way-to-structure-a-react-app-or-why-theres-no-such-thing-3ede534ef1ed) proporciona una perspectiva sobre el problema.

### Frontend y backend en el mismo repositorio

Durante el curso, hemos creado el frontend y el backend en repositorios separados. Este es un enfoque muy típico. Sin embargo, hicimos la implementación [copiando](/part3/implementacion_de_la_aplicacion_en_internet#sirviendo-archivos-estaticos-desde-el-backend) el código de frontend incluido en el repositorio de backend. Un enfoque posiblemente mejor habría sido implementar el código del frontend por separado. Especialmente con las aplicaciones creadas con create-react-app, es muy sencillo gracias al [buildpack](https://github.com/mars/create-react-app-buildpack) incluido.

A veces, puede haber una situación en la que la aplicación completa se coloque en un solo repositorio. En este caso, un enfoque común es colocar <i>package.json</i> y <i>webpack.config.js</i> en el directorio raíz, así como colocar el código de frontend y backend en sus propios directorios, por ejemplo, <i>client</i> y <i>server</i>.

### Cambios en el servidor

Si hay cambios en el estado del servidor, por ejemplo, cuando otros usuarios agregan nuevos blogs al servicio de lista de blogs, el frontend de React que implementamos durante este curso no notará estos cambios hasta que la página se vuelva a cargar. Una situación similar surge cuando el frontend desencadena un cálculo lento en el backend. ¿Cómo reflejamos los resultados del cálculo en el frontend?

Una forma es ejecutar [polling](<https://en.wikipedia.org/wiki/Polling_(computer_science)>) en el frontend, es decir, solicitudes repetidas a la API de backend, por ejemplo, utilizando el comando [setInterval](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval).

Una forma más sofisticada es utilizar [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API), mediante el cual es posible establecer un canal de comunicación bidireccional entre el navegador y el servidor. En este caso, el navegador no necesita sondear el backend y, en su lugar, solo tiene que definir funciones callbacks para situaciones en las que el servidor envía datos sobre el estado de actualización mediante un WebSocket.

Los WebSockets son una API proporcionada por el navegador, que aún no es totalmente compatible con todos los navegadores:

![](../../images/7/31ea.png)

En lugar de utilizar directamente la API de WebSocket, es aconsejable utilizar la librería [Socket.io](https://socket.io/), que proporciona varias opciones alternativas en caso de que el navegador no tenga el soporte completo para WebSockets.

En la [parte 8](/es/part8), nuestro tema es GraphQL, que proporciona un buen mecanismo para notificar a los clientes cuando hay cambios en los datos del backend.


### Virtual DOM

El concepto de virtual DOM a menudo surge cuando se habla de React. ¿Que es todo esto? Como se mencionó en la [parte 0](/es/part0/fundamentos_de_las_aplicaciones_web#modelo-de-objeto-de-documento-o-dom), los navegadores proporcionan una [API DOM](https://developer.mozilla.org/fi/docs/DOM), mediante la cual el JavaScript que se ejecuta en el navegador puede modificar los elementos que definen la apariencia de la página.

Cuando un desarrollador de software usa React, rara vez o nunca manipula directamente el DOM. La función que define el componente React devuelve un conjunto de [elementos React](https://reactjs.org/docs/glossary.html#elements). Aunque algunos de los elementos parecen elementos HTML normales

```js
const element = <h1>Hello, world</h1>
```

también son elementos de React basados ​​en JavaScript en su núcleo.

Los elementos React que definen la apariencia de los componentes de la aplicación conforman el [Virtual DOM](https://reactjs.org/docs/faq-internals.html#what-is-the-virtual-dom), que se almacena en la memoria del sistema durante el tiempo de ejecución.

Con la ayuda de la librería [ReactDOM](https://reactjs.org/docs/react-dom.html), el DOM virtual definido por los componentes se renderiza en un DOM real que el navegador puede mostrar utilizando la API DOM:

```js
ReactDOM.render(
  <App />,
  document.getElementById('root')
)
```
Cuando el estado de la aplicación cambia, los componentes definen un <i>nuevo virutal DOM</i>. React tiene la versión anterior del virtual DOM en la memoria y en lugar de renderizar directamente el nuevo ´virtual DOM usando la API DOM, React calcula la forma óptima de actualizar el DOM (eliminar, agregar o modificar elementos en el DOM) de modo que el DOM refleje el nuevo virtual DOM.


### El papel de React en las aplicaciones

Es posible que en el material no hayamos puesto suficiente énfasis en el hecho de que React es principalmente una librería para administrar la creación de vistas para una aplicación. Si nos fijamos en el patrón de [modelo vista controlador](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) tradicional, entonces el dominio de React sería <i>Vista</i>. React tiene un área de aplicación más estrecha que, por ejemplo , [Angular](https://angular.io/), que es un framework de Frontend MVC que lo abarca todo. Por lo tanto, React no es un <i>framework</i>, sino <i>library</i>.

En aplicaciones pequeñas, los datos manejados por la aplicación se almacenan en el estado de los componentes de React, por lo que en este escenario el estado de los componentes se puede considerar como <i>modelos</i> de una arquitectura MVC.

Sin embargo, la arquitectura MVC no se suele mencionar cuando se habla de aplicaciones React. Además, si usamos Redux, las aplicaciones siguen la arquitectura [Flux](https://facebook.github.io/flux/docs/in-depth-overview) y el papel de React se centra aún más en la creación de vistas. La lógica empresarial de la aplicación se maneja utilizando los creadores de acciones y estados de Redux. Si usamos [redux thunk](/es/part6/comunicarse_con_el_servidor_en_una_aplicacion_redux#acciones-asincronas-y-redux-thunk) que vimos en la parte 6, entonces la lógica empresarial puede separarse casi por completo del código de React.

Debido a que tanto React como [Flux](https://facebook.github.io/flux/docs/in-depth-overview) se crearon en Facebook, se podría decir que usar React solo como una librería de UI es el caso de uso previsto. Seguir la arquitectura Flux agrega algunos gastos generales a la aplicación, y si estamos hablando de una pequeña aplicación o prototipo, podría ser una buena idea usar React "incorrectamente", ya que la [ingeniería excesiva](https://en.wikipedia.org/wiki/Overengineering) rara vez produce un resultado óptimo.

El ultimo capítulo de la [parte 6](/es/part6/react_query_use_reducer_y_el_contexto) cubre las nuevas tendencias de gestión de estado en React. Las funciones de hooks de React <i>useReducer</i> y <i>useContext</i> proporcionan una versión liviana de Redux. <i>React Query</i>, por otro lado, es una librería que resuelve muchos de los problemas asociados con el manejo del estado en el servidor, eliminando la necesidad de que una aplicación React almacene los datos recuperados del servidor directamente en el estado del frontend.

### Seguridad en aplicaciones React/node

Hasta ahora, durante el curso, no hemos abordado en absoluto la seguridad de la información. Tampoco tenemos mucho tiempo por ahora, pero afortunadamente el departamento cuenta con un curso MOOC [Securing Software](https://cybersecuritybase.mooc.fi/module-2.1) para este tema importante.

Sin embargo, echaremos un vistazo a algunas cosas específicas de este curso.

El proyecto de seguridad de aplicaciones web abiertas, también conocido como [OWASP](https://www.owasp.org), publica una lista anual de los riesgos de seguridad más comunes en las aplicaciones web. La lista más reciente se puede encontrar [aquí](https://owasp.org/www-project-top-ten/). Los mismos riesgos se pueden encontrar de un año a otro.

En la parte superior de la lista encontramos la <i>inyección</i>, lo que significa que, por ejemplo, el texto enviado mediante un formulario en una aplicación se interpreta de forma completamente diferente de lo que pretendía el desarrollador de software. El tipo de inyección más famoso es probablemente la [inyección SQL](https://stackoverflow.com/questions/332365/how-does-the-sql-injection-from-the-bobby-tables-xkcd-comic-work).

Por ejemplo, si la siguiente consulta SQL se ejecuta en una aplicación vulnerable:

```js
let query = "SELECT * FROM Users WHERE name = '" + userName + "';"
```


Ahora supongamos que un usuario malintencionado <i>Arto Hellas</i> definiría su nombre como

<pre>
Arto Hell-as'; DROP TABLE Users; --
</pre>



para que el nombre contenga una comilla simple <code>'</code>, que es el carácter inicial y final de una cadena SQL. Como resultado de esto, se ejecutarían dos operaciones SQL, la segunda de las cuales destruiría la tabla <i>Users</i> de la base de datos.

```sql
SELECT * FROM Users WHERE name = 'Arto Hell-as'; DROP TABLE Users; --'
```



Las inyecciones de SQL se evitan [desinfectando](https://security.stackexchange.com/questions/172297/sanitizing-input-for-parameterized-queries) la entrada, lo que implicaría comprobar que los parámetros de la consulta no contienen ningún carácter prohibido, en este caso comillas simples. Si se encuentran caracteres prohibidos, se reemplazan con alternativas seguras al [escapar](https://en.wikipedia.org/wiki/Escape_character#JavaScript) de ellos.


Los ataques de inyección también son posibles en bases de datos NoSQL. Sin embargo, mongoose los previene [desinfectando](https://zanon.io/posts/nosql-injection-in-mongodb) las consultas. Puede encontrar más información sobre el tema, por ejemplo, [aquí](https://web.archive.org/web/20220901024441/https://blog.websecurify.com/2014/08/hacking-nodejs-and-mongodb.html).


<i>Cross-site scripting (XSS)</i> es un ataque en el que es posible inyectar código JavaScript malicioso en una aplicación web legítima. Luego, el código malicioso se ejecutaría en el navegador de la víctima. Si intentamos inyectar lo siguiente en, por ejemplo, la aplicación de notas

```html
<script>
  alert('Evil XSS attack')
</script>
```

el código no se ejecuta, sino que solo se renderiza como 'texto' en la página:

![](../../images/7/32e.png)

ya que React [se encarga de desinfectar los datos en variables](https://reactjs.org/docs/introducing-jsx.html#jsx-prevents-injection-attacks). Algunas versiones de React [han sido vulnerables](https://medium.com/dailyjs/exploiting-script-injection-flaws-in-reactjs-883fb1fe36c1) a los ataques XSS. Los agujeros de seguridad, por supuesto, han sido reparados, pero no hay garantía de que no vuelvan a suceder.

Es necesario permanecer alerta cuando se utilizan librerías; si hay actualizaciones de seguridad para esas librerías, se recomienda actualizarlas en las propias aplicaciones. Las actualizaciones de seguridad para Express se encuentran en la [documentación de la librería](https://expressjs.com/en/advanced/security-updates.html) y las de Node se encuentran en [este blog](https://nodejs.org/en/blog/).

Puede verificar qué tan actualizadas están sus dependencias usando el comando

```bash
npm outdated --depth 0
```

La respuesta del modelo del año pasado para los ejercicios de la [parte 4](/es/part4) ya tiene bastantes dependencias desactualizadas:

![](../../images/7/33x.png)

Las dependencias se pueden actualizar actualizando el archivo <i>package.json</i> y ejecutando el comando

```bash
npm install -g npm-check-updates
```

Usando esta herramienta, la actualización de las dependencias se verifica de la siguiente manera:

```bash
$ npm-check-updates
Checking ...\ultimate-hooks\package.json
[====================] 9/9 100%

 @testing-library/react       ^13.0.0  →  ^13.1.1
 @testing-library/user-event  ^14.0.4  →  ^14.1.1
 react-scripts                  5.0.0  →    5.0.1

Run ncu -u to upgrade package.json
```

El archivo <i>package.json</i> se actualiza ejecutando el comando _ncu -u_.

```bash
$ ncu -u
Upgrading ...\ultimate-hooks\package.json
[====================] 9/9 100%

 @testing-library/react       ^13.0.0  →  ^13.1.1
 @testing-library/user-event  ^14.0.4  →  ^14.1.1
 react-scripts                  5.0.0  →    5.0.1

Run npm install to install new versions.
```

Ahora es el momento de actualizar las dependencias ejecutando el comando _npm install_. Sin embargo, las versiones antiguas de las dependencias no necesariamente son un riesgo de seguridad.

El comando npm [audit](https://docs.npmjs.com/cli/audit) se puede utilizar para verificar la seguridad de las dependencias. Compara los números de versión de las dependencias de su aplicación con una lista de los números de versión de las dependencias que contienen amenazas de seguridad conocidas en una base de datos de errores centralizada.

Ejecutando _npm audit_ en el mismo proyecto imprime una larga lista de quejas y sugerencias de solución. A continuación se muestra una parte del informe:

```js
$ patientor npm audit

... many lines removed ...

url-parse  <1.5.2
Severity: moderate
Open redirect in url-parse - https://github.com/advisories/GHSA-hh27-ffr2-f2jc
fix available via `npm audit fix`
node_modules/url-parse

ws  6.0.0 - 6.2.1 || 7.0.0 - 7.4.5
Severity: moderate
ReDoS in Sec-Websocket-Protocol header - https://github.com/advisories/GHSA-6fc8-4gx4-v693
ReDoS in Sec-Websocket-Protocol header - https://github.com/advisories/GHSA-6fc8-4gx4-v693
fix available via `npm audit fix`
node_modules/webpack-dev-server/node_modules/ws
node_modules/ws

120 vulnerabilities (102 moderate, 16 high, 2 critical)

To address issues that do not require attention, run:
  npm audit fix

To address all issues (including breaking changes), run:
  npm audit fix --force
```

Después de solo un año, el código está lleno de pequeñas amenazas de seguridad. Afortunadamente, solo hay 2 amenazas críticas. Ejecutemos _npm audit fix_ como sugiere el informe:

```js
$ npm audit fix

+ mongoose@5.9.1
added 19 packages from 8 contributors, removed 8 packages and updated 15 packages in 7.325s
fixed 354 of 416 vulnerabilities in 20047 scanned packages
  1 package update for 62 vulns involved breaking changes
  (use `npm audit fix --force` to install breaking changes; or refer to `npm audit` for steps to fix these manually)
```

62 amenazas permanecen porque, por defecto, _audit fix_ no actualiza las dependencias si su número de versión <i>major</i> ha aumentado. Actualizar estas dependencias podría conducir al colapso de toda la aplicación.

El código fuente del error crítico es la librería [immer](https://github.com/immerjs/immer)

```js
immer  <9.0.6
Severity: critical
Prototype Pollution in immer - https://github.com/advisories/GHSA-33f9-j839-rf8h
fix available via `npm audit fix --force`
Will install react-scripts@5.0.0, which is a breaking change
```

Ejecutando _npm audit fix --force_ actualizaría la versión de la librería, pero también actualizaría la librería _react-scripts_ y eso podría potencialmente colapsar el entorno de desarrollo. Así que dejaremos las actualizaciones de librerías para más tarde ...

Una de las amenazas mencionadas en la lista de OWASP es <i>Broken Authentication</i> y <i>Broken Access Control</i>. La autenticación basada en tokens que hemos estado usando es bastante sólida, si la aplicación se usa en el protocolo HTTPS de cifrado de tráfico. Al implementar el control de acceso, por ejemplo, se debe recordar no solo verificar la identidad de un usuario en el navegador, sino también en el servidor. La mala seguridad sería evitar que se tomen algunas acciones solo ocultando las opciones de ejecución en el código del navegador.

En MDN de Mozilla hay una muy buena [guía de seguridad de sitios web](https://developer.mozilla.org/en-US/docs/Learn/Server-side/First_steps/Website_security), que trae a colación este tema tan importante:

![](../../images/7/34.png)

La documentación de Express incluye una sección sobre seguridad: [Prácticas recomendadas de producción: seguridad](https://expressjs.com/en/advanced/best-practice-security.html), que vale la pena leer. También se recomienda agregar una librería llamada [Helmet](https://helmetjs.github.io/) al backend. Incluye un conjunto de middlewares que eliminan algunas vulnerabilidades de seguridad en aplicaciones Express.

También vale la pena usar el [plugin de seguridad](https://github.com/nodesecurity/eslint-plugin-security) de ESlint.

### Tendencias actuales

Finalmente, echemos un vistazo a la tecnología del mañana (o en realidad ya hoy), y las direcciones que se dirige el desarrollo web.

#### Versiones tipadas de JavaScript

A veces, el [tipado dinámico](https://developer.mozilla.org/en-US/docs/Glossary/Dynamic_typing) de variables de JavaScript crea errores molestos. En la parte 5 hablamos brevemente sobre [PropTypes](/es/part5/props_children_y_proptypes#prop-types): un mecanismo que permite hacer cumplir la verificación de tipos para los props pasados ​​a los componentes de React.

Últimamente ha habido un aumento notable en el interés por la [verificación de tipos estáticos](https://en.wikipedia.org/wiki/Type_system#Static_type_checking). Por el momento, la versión escrita más popular de Javascript es [Typescript](https://www.typescriptlang.org/), que ha sido desarrollado por Microsoft. Typescript se cubre en la [parte 9](/es/part9).

#### Renderización del lado del servidor, aplicaciones isomórficas y código universal

El navegador no es el único dominio donde se pueden renderizar los componentes definidos usando React. La renderización también se puede realizar en el [servidor](https://reactjs.org/docs/react-dom-server.html). Este tipo de enfoque se utiliza cada vez más, de modo que cuando se accede a la aplicación por primera vez, el servidor muestra una página renderizada previamente creada con React. A partir de aquí, el funcionamiento de la aplicación continúa como de costumbre, es decir, el navegador ejecuta React, que manipula el DOM que muestra el navegador. La representación que se realiza en el servidor se conoce con el nombre: <i>server-side rendering</i>.

Una motivación para la representación del lado del servidor es la optimización de motores de búsqueda (SEO). Los motores de búsqueda tradicionalmente han sido muy malos para reconocer el contenido renderizado en JavaScript, sin embargo, la marea podría estar cambiando, por ejemplo, eche un vistazo a [esto](https://www.javascriptstuff.com/react-seo/) y [esto](https://medium.freecodecamp.org/seo-vs-react-is-it-neccessary-to-render-react-pages-in-the-backend-74ce5015c0c9).

Por supuesto, la renderización del lado del servidor no es algo específico de React o incluso de JavaScript. Usar el mismo lenguaje de programación en toda el stack en teoría simplifica la ejecución del concepto, porque el mismo código se puede ejecutar tanto en el frontend como en el backend.

Junto con la renderización del lado del servidor se ha hablado de las llamadas <i>aplicaciones isomórficas</i> y <i>código universal</i>, aunque ha habido cierto debate sobre sus definiciones. Según algunas [definiciones](https://medium.com/@ghengeveld/isomorphism-vs-universal-javascript-4b47fb481beb), una aplicación web isomórfica es aquella que realiza la renderización tanto en el frontend como en el backend. Por otro lado, el código universal es código que se puede ejecutar en la mayoría de los entornos, es decir, tanto el frontend como el backend.

React y Node proporcionan una opción deseable para implementar tanto una aplicación isomorfa como código universal.

Escribir código universal directamente usando React todavía es bastante engorroso. Últimamente, una librería llamada [Next.js](https://github.com/vercel/next.js), que se implementa sobre React, ha atraído mucha atención y es una buena opción para hacer aplicaciones universales.

#### Aplicaciones web progresivas

Recientemente, la gente ha comenzado a usar el término [aplicación web progresiva](https://developers.google.com/web/progressive-web-apps/) (PWA) lanzada por Google.

En resumen, estamos hablando de aplicaciones web funcionando lo mejor posible en todas las plataformas, aprovechando las mejores partes de esas plataformas. La pantalla más pequeña de los dispositivos móviles no debe obstaculizar la usabilidad de la aplicación. Las PWA también deberían funcionar sin problemas en sin Internet o con una conexión a Internet lenta. En dispositivos móviles, deben ser instalables como cualquier otra aplicación. Todo el tráfico de red en una PWA debe estar cifrado.

#### Arquitectura de microservicio

Durante este curso solo hemos arañado la superficie del extremo del servidor. En nuestras aplicaciones teníamos un backend <i>monolítico</i>, es decir, una aplicación que formaba un todo y se ejecutaba en un solo servidor, sirviendo solo unos pocos endpoints de API.

A medida que la aplicación crece, el enfoque de backend monolítico comienza a tornarse problemático tanto en términos de rendimiento como de mantenibilidad.

Una [arquitectura de microservicios](https://martinfowler.com/articles/microservices.html) es una forma de componer el backend de una aplicación a partir de muchos servicios independientes que se comunican entre sí a través de la red. El propósito de un microservicio individual es cuidar de un todo funcional lógico particular. En una arquitectura de microservicio pura, los servicios no utilizan una base de datos compartida.

Por ejemplo, la aplicación de lista de blogs podría constar de dos servicios: uno que maneja al usuario y otro que se ocupa de los blogs. La responsabilidad del servicio de usuario sería el registro y la autenticación del usuario, mientras que el servicio de blogs se haría cargo de las operaciones relacionadas con los blogs.

La siguiente imagen muestra la diferencia entre la estructura de una aplicación basada en una arquitectura de microservicio y una basada en una estructura monolítica más tradicional:

![](../../images/7/36.png)

El papel de la interfaz (encerrado por un cuadrado en la imagen) no difiere mucho entre los dos modelos. A menudo existe una [puerta de enlace API](http://microservices.io/patterns/apigateway) entre los microservicios y el frontend, que proporciona la ilusión de una API más tradicional de "todo en el mismo servidor".  [Netflix](https://medium.com/netflix-techblog/optimizing-the-netflix-api-5c9ac715cf19), entre otros, utiliza este tipo de enfoque.

Las arquitecturas de microservicios surgieron y evolucionaron para las necesidades de las grandes aplicaciones a escala de Internet. Amazon marcó la tendencia mucho antes de la aparición del término microservicio. El punto de partida crítico fue un correo electrónico enviado a todos los empleados en 2002 por el CEO de Amazon, Jeff Bezos:

> De ahora en adelante, todos los equipos expondrán sus datos y funcionalidad a través de interfaces de servicio.
>
> Los equipos deben comunicarse entre sí a través de estas interfaces.
>
> No se permitirá ninguna otra forma de comunicación entre procesos: ningún enlace directo, ninguna lectura directa del almacén de datos de otro equipo, ningún modelo de memoria compartida, ninguna puerta trasera. La única comunicación permitida es a través de llamadas de interfaz de servicio a través de la red.
>
> No importa qué tecnología uses.
>
> Todas las interfaces de servicio, sin excepción, deben diseñarse desde cero para ser externalizables. Es decir, el equipo debe planificar y diseñar para poder exponer la interfaz a los desarrolladores del mundo exterior.
>
> Sin excepciones.
>
> Cualquiera que no haga esto será despedido. Gracias; ¡que tengas un buen día!

Hoy en día, uno de los mayores precursores en el uso de microservicios es [Netflix](https://www.infoq.com/presentations/netflix-chaos-microservices).

El uso de microservicios ha ido ganando popularidad hasta convertirse en una especie de [bala de plata](https://en.wikipedia.org/wiki/No_Silver_Bullet) de hoy en día, que se ofrece como una solución a casi todo tipo de problemas. Sin embargo, hay una serie de desafíos cuando se trata de aplicar una arquitectura de microservicio, y podría tener sentido ir [primero al monolito](https://martinfowler.com/bliki/MonolithFirst.html) al hacer inicialmente un backend tradicional que lo abarque todo. O quizás [no](https://martinfowler.com/articles/dont-start-monolith.html). Hay un montón de opiniones diferentes sobre el tema. Ambos enlaces conducen al sitio de Martin Fowler; como podemos ver, incluso los sabios no están completamente seguros de cuál de las formas correctas es la más correcta.

Desafortunadamente, no podemos profundizar en este importante tema durante este curso. Incluso una mirada superficial al tema requeriría al menos 5 semanas más.

#### Serverless (Sin servidor)

Después del lanzamiento del servicio [lambda](https://aws.amazon.com/lambda/) de Amazon a fines de 2014, comenzó a surgir una nueva tendencia en el desarrollo de aplicaciones web: [sin servidor](https://serverless.com/).

Lo principal de lambda, y otras [funciones Cloud](https://cloud.google.com/functions/) de Google, así como una [funcionalidad similar en Azure](https://azure.microsoft.com/en-us/services/functions/), es que permite <i>la ejecución de funciones individuales</i> en la nube. Antes, la unidad ejecutable más pequeña en la nube era un <i>proceso único</i>, por ejemplo, un entorno de ejecución que ejecuta un backend de Node.

Utilizando la [puerta de enlace API](https://aws.amazon.com/api-gateway/) de Amazon es posible crear aplicaciones sin servidor donde las solicitudes a la API HTTP definida obtienen respuestas directamente de las funciones de la nube. Por lo general, las funciones ya operan utilizando datos almacenados en las bases de datos del servicio en la nube.

Serverless no se trata de que no haya un servidor en las aplicaciones, sino de cómo se define el servidor. El desarrollador de software puede cambiar sus esfuerzos de programación a un mayor nivel de abstracción, pues ya no es necesario definir mediante programación el enrutamiento de solicitudes HTTP, relaciones de bases de datos, etc., debido a que la infraestructura de la nube proporciona todo esto. Las funciones en la nube también se prestan para crear un buen sistema de escalado, por ejemplo, Lambda de Amazon puede ejecutar una gran cantidad de funciones en la nube por segundo. Todo esto ocurre automáticamente a través de la infraestructura y no es necesario iniciar nuevos servidores, etc.

### Librerías útiles y enlaces interesantes

La comunidad de desarrolladores de JavaScript ha producido una gran variedad de librerías útiles. Si está desarrollando algo más sustancial, vale la pena comprobar si las soluciones existentes ya están disponibles. A continuación se enumeran algunas librerías recomendadas por partes confiables.

Si su aplicación tiene que manejar datos complicados, [lodash](https://www.npmjs.com/package/lodash), que recomendamos en la [parte 4](/es/part4/estructura_de_la_aplicacion_backend_introduccion_a_las_pruebas#ejercicios-4-3-4-7), es una buena librería para usar. Si prefiere un estilo de programación funcional, podría considerar usar [ramda](https://ramdajs.com/).

Si maneja horas y fechas, [date-fns](https://github.com/date-fns/date-fns) ofrece buenas herramientas para eso.

[Formik](https://www.npmjs.com/package/formik) y [redux-form](https://redux-form.com/8.3.0/) se pueden utilizar para manipular formularios más fácilmente. Si su aplicación muestra gráficos, hay varias opciones para elegir. Se recomiendan tanto [recharts](http://recharts.org/en-US/) como [highcharts](https://github.com/highcharts/highcharts-react) .

La librería [immutable.js](https://github.com/facebook/immutable-js/) mantenida por Facebook proporciona, como su nombre indica, implementaciones inmutables de algunas estructuras de datos. La librería podría ser útil cuando se usa Redux, ya que como recordamos de la [parte 6](/es/part6/flux_architecture_y_redux#funciones-puras-inmutables): los reducers deben ser funciones puras, lo que significa que no deben modificar el estado del store, sino que deben reemplazarlo por uno nuevo cuando se produce un cambio. Durante el año pasado, [Immer](https://github.com/mweststrate/immer) se hizo cargo de parte de la popularidad de Immutable.js, que proporciona una funcionalidad similar pero en un paquete algo más sencillo.

[Redux-saga](https://redux-saga.js.org/) proporciona una forma alternativa de hacer las acciones asincrónicas para [redux thunk](/es/part6/comunicarse_con_el_servidor_en_una_aplicacion_redux#acciones-asincronas-y-redux-thunk) que vimos en la parte 6. Algunos abrazan el hype y les gusta. Yo no.

Para las aplicaciones de una sola página, la recopilación de datos analíticos sobre la interacción entre los usuarios y la página es [más desafiante](https://developers.google.com/analytics/devguides/collection/analyticsjs/single-page-applications) que para las aplicaciones web tradicionales donde se carga toda la página. La librería [React Google Analytics](https://github.com/react-ga/react-ga) ofrece una solución.

Puede aprovechar su conocimiento de React al desarrollar aplicaciones móviles utilizando la extremadamente popular librería [React Native](https://facebook.github.io/react-native/) de Facebook. la cual es el tema de la [parte 10](/es/part10) del curso.

En lo que respecta a las herramientas utilizadas para la gestión y empaquetamiento de proyectos de JavaScript, la comunidad ha sido muy voluble. Las mejores prácticas han cambiado rápidamente (los años son aproximaciones, nadie recuerda eso en el pasado):

- 2011 [Bower](https://www.npmjs.com/package/bower)
- 2012 [Grunt](https://www.npmjs.com/package/grunt)
- 2013-14 [Gulp](https://www.npmjs.com/package/gulp)
- 2012-14 [Browserify](https://www.npmjs.com/package/browserify)
- 2015- [Webpack](https://www.npmjs.com/package/webpack)

Los hipsters parecen haber perdido su interés en el desarrollo de herramientas después de que webpack comenzara a dominar los mercados. Hace unos años, [Parcel](https://parceljs.org) comenzó a hacer rondas de marketing en sí mismo como simple (que Webpack no lo es) y más rápido que Webpack. Sin embargo, después de un comienzo prometedor, Parcel no ha cobrado fuerza y ​​parece que no será el final de Webpack. Recientemente, [esbuild](https://esbuild.github.io/) ha ido en incremento y ya está desafiando seriamente a Webpack.

El sitio [https://reactpatterns.com/](https://reactpatterns.com/) ofrece una lista concisa de las mejores prácticas para React, algunas de las cuales ya le resultarán familiares de este curso. Otra lista similar es [react bits](https://vasanthk.gitbooks.io/react-bits/).

[Reactiflux](https://www.reactiflux.com/) es una gran comunidad de chat de desarrolladores de React en Discord. Podría ser un posible lugar para obtener apoyo después de que el curso haya concluido. Numerosas bibliotecas tienen sus propios canales.

Si conoce algunos enlaces o bibliotecas recomendables, ¡haga pull request!

</div>
