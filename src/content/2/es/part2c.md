---
mainImage: ../../../images/part-2.svg
part: 2
letter: c
lang: es
---

<div class="content">

Desde hace un tiempo solo hemos estado trabajando en el "frontend", es decir, la funcionalidad del lado del cliente (navegador). Comenzaremos a trabajar en el "backend", es decir, la funcionalidad del lado del servidor en la [tercera parte](/es/part3) de este curso. No obstante, ahora daremos un paso en esa dirección familiarizándonos con cómo el código que se ejecuta en el navegador se comunica con el backend.

Usemos una herramienta diseñada para ser utilizada durante el desarrollo de software llamada [JSON Server](https://github.com/typicode/json-server) para que actúe como nuestro servidor.

Crea un archivo llamado <i>db.json</i> en el directorio raíz del proyecto con el siguiente contenido:

```json
{
  "notes": [
    {
      "id": 1,
      "content": "HTML is easy",
      "important": true
    },
    {
      "id": 2,
      "content": "Browser can execute only JavaScript",
      "important": false
    },
    {
      "id": 3,
      "content": "GET and POST are the most important methods of HTTP protocol",
      "important": true
    }
  ]
}
```

Puedes [instalar](https://github.com/typicode/json-server#getting-started) el servidor JSON globalmente en tu máquina usando el comando _npm install -g json-server_. Una instalación global requiere privilegios administrativos, lo que significa que no es posible en las computadoras de la facultad o en las computadoras portátiles de primer año.

Después de instalar, ejecuta el siguiente comando para ejecutar json-server. Por defecto, <i>json-server</i> se inicia en el puerto 3000; ahora definiremos un puerto alternativo 3001, para json-server. La opción --watch busca automáticamente cualquier cambio guardado en db.json.

```js
json-server --port 3001 --watch db.json
```

Sin embargo, no es necesaria una instalación global. Desde el directorio raíz de su aplicación, podemos ejecutar <i>json-server</i> usando el comando _npx_:

```js
npx json-server --port 3001 --watch db.json
```

Naveguemos hasta la dirección <http://localhost:3001/notes> en el navegador. Podemos ver que <i>json-server</i> sirve las notas que escribimos previamente en el archivo en formato JSON:

![notas en formato json en el navegador en la url localhost:3001/notes](../../images/2/14new.png)

Si tu navegador no puede formatear la visualización de datos JSON, entonces instala una extension apropiada, por ejemplo, [JSONVue](https://chrome.google.com/webstore/detail/jsonview/chklaanhfefbnpoihckbnefhakgolnmc) para hacerte la vida más fácil.

De ahora en adelante, la idea será guardar las notas en el servidor, lo que en este caso significa guardarlas en json-server. El código de React obtiene las notas del servidor y las muestra en la pantalla. Siempre que se agrega una nueva nota a la aplicación, el código de React también la envía al servidor para que la nueva nota persista en la "memoria".

json-server almacena todos los datos en el archivo <i>db.json</i>, que reside en el servidor. En el mundo real, los datos se almacenarían en algún tipo de base de datos. Sin embargo, json-server es una herramienta útil que permite el uso de la funcionalidad del lado del servidor en la fase de desarrollo sin la necesidad de programar nada de eso.

Nos familiarizaremos con los principios de implementación de la funcionalidad del lado del servidor con más detalle en la [parte 3](/es/part3) de este curso.

### El navegador como entorno de ejecución

Nuestra primera tarea es recuperar las notas ya existentes en nuestra aplicación React desde la dirección <http://localhost:3001/notes>.

En el [proyecto de ejemplo](/es/part0/fundamentos_de_las_aplicaciones_web#ejecucion-de-la-logica-de-la-aplicacion-en-el-navegador) ya aprendimos una manera de obtener datos de un servidor usando JavaScript. El código del ejemplo obtenía los datos mediante [XMLHttpRequest](https://developer.mozilla.org/es/docs/Web/API/XMLHttpRequest), también conocido como solicitud HTTP realizada mediante un objeto XHR. Esta es una técnica introducida en 1999, que todos los navegadores han admitido durante un buen tiempo.

Ya no se recomienda el uso de XHR, y los navegadores ya admiten ampliamente el método [fetch](https://developer.mozilla.org/es/docs/Web/API/fetch), que se basa en las llamadas [promesas (promises)](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Promise), en lugar del modelo impulsado por eventos utilizado por XHR.

Como recordatorio de la parte 0 (que de hecho <i>no deberías usar</i> sin una buena razón), los datos se obtuvieron usando XHR de la siguiente manera:

```js
const xhttp = new XMLHttpRequest()

xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    const data = JSON.parse(this.responseText)
    // handle the response that is saved in variable data
  }
}

xhttp.open('GET', '/data.json', true)
xhttp.send()
```

Justo al principio, registramos un <i>controlador de eventos</i> en el objeto <em>xhttp</em> que representa la solicitud HTTP, que será invocada por el entorno de ejecución de JavaScript siempre que el estado del objeto <em>xhttp</em> cambie. Si el cambio de estado significa que ha llegado la respuesta a la solicitud, los datos se manejan en consecuencia.

Vale la pena señalar que el código en el controlador de eventos se define antes de que la solicitud se envíe al servidor. A pesar de esto, el código dentro del controlador de eventos se ejecutará en un momento posterior. Por lo tanto, el código no se ejecuta de forma síncrona "de arriba a abajo", sino que lo hace <i>asincrónicamente</i>. JavaScript llama al controlador de eventos que se registró para la solicitud en algún momento.

Una forma síncrona de realizar solicitudes que es común en la programación Java, por ejemplo, se desarrollaría de la siguiente manera (NB, esto no es realmente un código Java que funcione):

```java
HTTPRequest request = new HTTPRequest();

String url = "https://studies.cs.helsinki.fi/exampleapp/data.json";
List<Note> notes = request.get(url);

notes.forEach(m => {
  System.out.println(m.content);
});
```

En Java el código se ejecuta línea por línea y se detiene para esperar la solicitud HTTP, lo que significa esperar a que finalice el comando _request.get(...)_. Los datos devueltos por el comando, en este caso las notas, se almacenan en una variable y comenzamos a manipular los datos de la manera deseada.

Por otro lado, los motores JavaScript o los entornos de ejecución siguen el [modelo asíncrono](https://developer.mozilla.org/es/docs/Web/JavaScript/Event_loop). En principio, esto requiere que todas las [operaciones IO](https://es.wikipedia.org/wiki/Perif%C3%A9rico_de_entrada/salida) (con algunas excepciones) se ejecuten como no bloqueantes. Esto significa que la ejecución del código continúa inmediatamente después de llamar a una función IO, sin esperar a que regrese.

Cuando se completa una operación asíncrona, o más específicamente, en algún momento después de su finalización, el motor de JavaScript llama a los controladores de eventos registrados en la operación.

Actualmente, los motores de JavaScript son <i>de un solo thread</i>, lo que significa que no pueden ejecutar código en paralelo. Como resultado, es un requisito en la práctica utilizar un modelo sin bloqueo para ejecutar operaciones IO. De lo contrario, el navegador se "congelaría" durante, por ejemplo, la obtención de datos de un servidor.

Otra consecuencia de esta naturaleza de un solo thread de los motores de JavaScript es que si la ejecución de algún código lleva mucho tiempo, el navegador se atascará mientras dure la ejecución. Si agregamos el siguiente código en la parte superior de nuestra aplicación:

```js
setTimeout(() => {
  console.log('loop..')
  let i = 0
  while (i < 50000000000) {
    i++
  }
  console.log('end')
}, 5000)
```

todo funcionaría normalmente durante 5 segundos. Sin embargo, cuando se ejecuta la función definida como parámetro para <em>setTimeout</em>, el navegador se bloqueará mientras dure la ejecución del bucle largo. Incluso la pestaña del navegador no se puede cerrar durante la ejecución del bucle, al menos no en Chrome.

Para que el navegador permanezca <i>receptivo</i>, es decir, para poder reaccionar continuamente a las operaciones del usuario con suficiente velocidad, la lógica del código debe ser tal que ningún cálculo individual pueda llevar demasiado tiempo.

Existe una gran cantidad de material adicional sobre el tema que se puede encontrar en Internet. Una presentación particularmente clara del tema es el discurso de apertura de Philip Roberts titulado [¿Qué diablos es el ciclo del evento de todos modos?](Https://www.youtube.com/watch?v=8aGhZQkoFbQ)

En los navegadores actuales, es posible ejecutar código paralelo con la ayuda de los llamados [web workers](https://developer.mozilla.org/es/docs/Web/API/Web_Workers_API/Using_web_workers). Sin embargo, el bucle de eventos de una ventana individual del navegador solo es manejada por un [hilo único](https://medium.com/techtrument/multithreading-javascript-46156179cf9a).

### npm

Volvamos al tema de la obtención de datos del servidor.

Podríamos usar la función basada en promesas [fetch](https://developer.mozilla.org/es/docs/Web/API/fetch) mencionada anteriormente para extraer los datos del servidor. Fetch es una gran herramienta. Está estandarizado y es compatible con todos los navegadores modernos (excepto IE).

Dicho esto, usaremos la librería [axios](https://github.com/axios/axios) en su lugar para la comunicación entre el navegador y el servidor. Funciona como fetch, pero es algo más agradable de usar. Otra buena razón para usar axios es que nos familiarizamos con la adición de librerías externas, los llamados <i>paquetes npm</i>, a los proyectos de React.

Hoy en día, prácticamente todos los proyectos de JavaScript se definen utilizando el administrador de paquetes de node, también conocido como [npm](https://docs.npmjs.com/about-npm). Los proyectos creados con Vite también siguen el formato npm. Un indicador claro de que un proyecto usa npm es el archivo <i>package.json</i> ubicado en la raíz del proyecto:

```json
{
  "name": "notes-frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@vitejs/plugin-react": "^4.0.3",
    "eslint": "^8.45.0",
    "eslint-plugin-react": "^7.32.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.3",
    "vite": "^4.4.5"
  }
}
```

En este punto, la parte de <i>dependencies</i> es la de mayor interés para nosotros ya que define qué <i>dependencias</i>, o librerías externas, tiene el proyecto.

Ahora queremos usar axios. En teoría, podríamos definir la librería directamente en el archivo <i>package.json</i>, pero es mejor instalarlo desde la línea de comandos.

```js
npm install axios
```

**NB los comandos de _npm_ siempre deben ejecutarse en el directorio raíz del proyecto**, que es donde se puede encontrar el archivo <i>package.json</i>.

Axios ahora se incluye entre las otras dependencias:

```json
{
  "name": "notes-frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.4.0", // highlight-line
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  // ...
}
```

Además de agregar axios a las dependencias, el comando <em>npm install</em> también <i>descargó</i> el código de la librería. Al igual que con otras dependencias, el código se puede encontrar en el directorio <i>node\_modules</i> ubicado en la raíz. Como uno podría haber notado, <i>node\_modules</i> contiene una buena cantidad de cosas interesantes.

Hagamos otra adición. Instala <i>json-server</i> como una dependencia de desarrollo (solo se usa durante el desarrollo) ejecutando el comando:

```js
npm install json-server --save-dev
```

y haciendo una pequeña adición a la parte <i>scripts</i> del archivo <i>package.json</i>:

```json
{
  // ... 
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "server": "json-server -p3001 --watch db.json" // highlight-line
  },
}
```

Nos familiarizaremos con la herramienta _npm_ en la [tercera parte del curso](/es/part3).

**NB** El servidor json iniciado previamente debe terminarse antes de iniciar uno nuevo, de lo contrario habrá problemas:

![error: no se puede enlazar al puerto 3001](../../images/2/15b.png)

La letra roja en el mensaje de error nos informa sobre el problema:

<i>Cannot bind to the port 3001. Please specify another port number either through --port argument or through the json-server.json configuration file</i>

<i>(No se puede vincular al puerto 3001. Especifique otro número de puerto a través del argumento --port o mediante el archivo de configuración json-server.json)</i>

Como podemos ver, la aplicación no es capaz de vincularse al [puerto](https://es.wikipedia.org/wiki/Puerto_de_red). La razón es que el puerto 3001 ya está ocupado por el servidor json iniciado anteriormente.

Usamos el comando _npm install_ dos veces, pero con ligeras diferencias:

```js
npm install axios
npm install json-server --save-dev
```

Hay una pequeña diferencia en los parámetros. <i>axios</i> se instala como una dependencia de entorno de ejecución de la aplicación, porque la ejecución del programa requiere la existencia de la librería. Por otro lado, <i>json-server</i> se instaló como una dependencia de desarrollo (_-- save-dev_), ya que el programa en sí no lo requiere. Se utiliza como ayuda durante el desarrollo de software. Habrá más sobre diferentes dependencias en la próxima parte del curso.

## 💡 Mejora opcional: usar `concurrently` para iniciar Vite y JSON Server con un solo comando

En este proyecto hemos estado ejecutando el frontend (React + Vite) y el backend simulado (JSON Server) en procesos separados. Por ejemplo, primero lanzamos el frontend con:

```bash
npm run dev
```

Y luego, en otra terminal distinta, lanzamos el backend con:

```bash
npm run server
```

Esto funciona bien, pero en entornos reales puede resultar más cómodo y profesional lanzar ambos servicios con un solo comando. Para ello, podemos utilizar una herramienta llamada [`concurrently`](https://www.npmjs.com/package/concurrently), que permite ejecutar múltiples scripts en paralelo desde el archivo `package.json`.

### Paso a paso

1. Instala `concurrently` como dependencia de desarrollo:

```bash
npm install --save-dev concurrently
```

2. Modifica tu archivo `package.json` para que incluya un nuevo script llamado `dev:full` que ejecute tanto Vite como JSON Server al mismo tiempo. Tu sección `"scripts"` quedaría así:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
  "preview": "vite preview",
  "server": "json-server -p 3001 --watch db.json",
  "dev:full": "concurrently \"npm run dev\" \"npm run server\""  // highlight-line
}
```

3. A partir de ahora, puedes levantar el frontend y el backend simultáneamente con este simple comando:

```bash
npm run dev:full
```

Esto abrirá tu aplicación React (por ejemplo, en `http://localhost:5173`) y también arrancará JSON Server en `http://localhost:3001`, sirviendo los datos desde el archivo `db.json`.

### ¿Por qué usar `concurrently`?

- Evita tener que abrir múltiples terminales
- Reduce el riesgo de olvidarte de iniciar uno de los servicios
- Mejora la productividad y refleja prácticas más cercanas a entornos reales
- Permite escalar fácilmente a otros procesos (como servidores de sockets, pruebas automáticas, etc.)

> ℹ️ **Nota:** Esta mejora es opcional. El enfoque original de lanzar los procesos por separado es didáctico y permite entender mejor cada herramienta. No obstante, si prefieres un flujo de trabajo más fluido, `concurrently` es una excelente opción.

### Axios y promesas

Ahora estamos listos para usar axios. En el futuro, se asume que json-server se está ejecutando en el puerto 3001.

NB: Para ejecutar json-server y tu aplicación React simultáneamente, normalmente necesitas abrir dos ventanas de terminal: una para mantener json-server en ejecución y otra para iniciar la aplicación React. No obstante, si has seguido los pasos de la mejora opcional usando concurrently, puedes ejecutarlos ambos con un solo comando (npm run dev:full), lo que simplifica el flujo de trabajo.

La librería se puede poner en uso de la misma manera que otras librerías, por ejemplo, React, es decir, utilizando una instrucción <em>import</em> adecuada.

Agrega lo siguiente al archivo <i>main.jsx</i>:

```js
import axios from 'axios'

const promise = axios.get('http://localhost:3001/notes')
console.log(promise)

const promise2 = axios.get('http://localhost:3001/foobar')
console.log(promise2)
```

Si abres <http://localhost:5173/> en el navegador, esto debería imprimirse en la consola:

![promesas imprimidas en la consola](../../images/2/16new.png)

El método de Axios _get_ devuelve una [promesa](https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Using_promises).

La documentación del sitio de Mozilla establece lo siguiente sobre las promesas:

> <i>Una promesa es un objeto que representa la eventual finalización o falla de una operación asíncrona.</i>

En otras palabras, una promesa es un objeto que representa una operación asíncrona. Una promesa puede tener tres estados distintos:

-  La promesa está <i>pendiente</i>: significa que el valor final (uno de los dos siguientes) aún no está disponible.
-  La promesa está <i>cumplida</i>: Significa que la operación se ha completado y el valor final está disponible, que generalmente es una operación exitosa. Este estado a veces también se denomina <i>resuelto</i>.
-  La promesa es <i>rechazada</i>: Significa que un error impidió determinar el valor final, que generalmente representa una operación fallida.

La primera promesa en nuestro ejemplo está <i>cumplida</i>, lo que representa una solicitud a _axios.get('http://localhost:3001/notes')_ exitosa. La segunda, sin embargo, está <i>rechazada</i> y la consola nos dice el motivo. Parece que estábamos intentando realizar una solicitud HTTP GET a una dirección inexistente.

Si, y cuando, queremos acceder al resultado de la operación representada por la promesa, debemos registrar un controlador de eventos en la promesa. Esto se logra usando el método <em>then</em>:

```js
const promise = axios.get('http://localhost:3001/notes')

promise.then(response => {
  console.log(response)
})
```

Se imprime lo siguiente en la consola:

![objeto de datos json impreso en la consola](../../images/2/17new.png)

El entorno de ejecución de JavaScript llama a la función callback registrada por el método <em>then</em>, proporcionándole un objeto <em>response</em> como parámetro. El objeto <em>response</em> contiene todos los datos esenciales relacionados con la respuesta de una solicitud HTTP GET, que incluiría los datos devueltos, el <i>código de estado (status code)</i> y los <i>encabezados (headers)</i>.

Por lo general, no es necesario almacenar el objeto de la promesa en una variable y, en cambio, es común encadenar la llamada al método <em>then</em> a la llamada al método axios, de modo que la siga directamente:

```js
axios.get('http://localhost:3001/notes').then(response => {
  const notes = response.data
  console.log(notes)
})
```

La función de callback ahora toma los datos contenidos en la respuesta, los almacena en una variable e imprime las notas en la consola.

Una forma más legible de formatear llamadas de método <i>encadenadas</i> es colocar cada llamada en su propia línea:

```js
axios
  .get('http://localhost:3001/notes')
  .then(response => {
    const notes = response.data
    console.log(notes)
  })
```

Los datos devueltos por el servidor son texto sin formato, básicamente solo una cadena larga. La librería axios aún puede analizar los datos en una matriz de JavaScript, ya que el servidor ha especificado que el formato de datos es <i>application/json; charset=utf-8</i> (ver imagen anterior) usando el encabezado <i>content-type</i>.

Finalmente podemos comenzar a utilizar los datos obtenidos del servidor.

Intentemos solicitar las notas de nuestro servidor local y renderizarlas, inicialmente como el componente App. Ten en cuenta que este enfoque tiene muchos problemas, ya que estamos procesando todo el componente <i>App</i> solo cuando recuperamos con éxito una respuesta:

```js
import ReactDOM from 'react-dom/client'
import axios from 'axios'
import App from './App'

axios.get('http://localhost:3001/notes').then(response => {
  const notes = response.data
  ReactDOM.createRoot(document.getElementById('root')).render(<App notes={notes} />)
})
```

Este método podría ser aceptable en algunas circunstancias, pero es algo problemático. En su lugar, movamos la búsqueda de datos al componente <i>App</i>.

Sin embargo, lo que no es inmediatamente obvio es dónde se debe colocar el comando <em>axios.get</em> dentro del componente.

### Effect-hooks

Ya hemos utilizado [state hooks](https://es.react.dev/learn/state-a-components-memory) que se introdujeron junto con la versión de React [16.8.0](https://www.npmjs.com/package/react/v/16.8.0), que proporciona el estado de los componentes de React definidos como funciones, los llamados <i>componentes funcionales</i>. La versión 16.8.0 también presenta los [hooks de efectos](https://es.react.dev/reference/react/hooks#effect-hooks) como una nueva característica. Según los documentos oficiales:

> <i>Los efectos permiten que un componente se conecte y se sincronice con sistemas externos.</i>
> <i>Esto incluye manejar la red, el DOM del navegador, animaciones, widgets escritos usando una librería de interfaz de usuario diferente, y otro código que no es de React.</i>

Como tal, los hooks de efectos son precisamente la herramienta adecuada para usar cuando se obtienen datos de un servidor.

Eliminemos la obtención de datos de <i>main.jsx</i>. Dado que vamos a obtener las notas del servidor, ya no es necesario pasar datos como props al componente <i>App</i>. Entonces <i>main.jsx</i> se puede simplificar a:

```js
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
```

El componente <i>App</i> cambia de la siguiente manera:

```js
import { useState, useEffect } from 'react' // highlight-line
import axios from 'axios' // highlight-line
import Note from './components/Note'

const App = () => { // highlight-line
  const [notes, setNotes] = useState([]) // highlight-line
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

// highlight-start
  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/notes')
      .then(response => {
        console.log('promise fulfilled')
        setNotes(response.data)
      })
  }, [])

  console.log('render', notes.length, 'notes')
// highlight-end

  // ...
}
```

También hemos agregado algunas impresiones útiles, que aclaran la progresión de la ejecución.

Esto se imprime en la consola

<pre>
render 0 notes
effect
promise fulfilled
render 3 notes
</pre>

Primero se ejecuta el cuerpo de la función que define el componente y el componente se renderiza por primera vez. En este punto, se imprime <i>render 0 notes</i>, lo que significa que los datos aún no se han obtenido del servidor.

La siguiente función, o efecto en el lenguaje de React:

```js
() => {
  console.log('effect')
  axios
    .get('http://localhost:3001/notes')
    .then(response => {
      console.log('promise fulfilled')
      setNotes(response.data)
    })
}
```

se ejecuta inmediatamente después de la renderización. La ejecución de la función da como resultado que <i>effect</i> se imprima en la consola, y el comando <em>axios.get</em> inicia la obtención de datos del servidor y registra la siguiente función como un <i>controlador de eventos</i> para la operación:

```js
response => {
  console.log('promise fulfilled')
  setNotes(response.data)
})
```

Cuando llegan datos del servidor, el entorno de ejecución de JavaScript llama a la función registrada como el controlador de eventos, que imprime <i>promise fulfilled</i> en la consola y almacena las notas recibidas del servidor en el estado mediante la función <em>setNotes(response.data)</em>.

Como siempre, una llamada a una función de actualización de estado desencadena la re-renderización del componente. Como resultado, <i>render 3 notes</i> se imprime en la consola y las notas obtenidas del servidor se muestran en la pantalla.

Finalmente, echemos un vistazo a la definición del hook de efectos como un todo:

```js
useEffect(() => {
  console.log('effect')
  axios
    .get('http://localhost:3001/notes').then(response => {
      console.log('promise fulfilled')
      setNotes(response.data)
    })
}, [])
```

Reescribamos el código de forma un poco diferente.

```js
const hook = () => {
  console.log('effect')
  axios
    .get('http://localhost:3001/notes')
    .then(response => {
      console.log('promise fulfilled')
      setNotes(response.data)
    })
}

useEffect(hook, [])
```

Ahora podemos ver más claramente que la función [useEffect](https://es.react.dev/reference/react/useEffect) en realidad toma <i>dos parámetros</i>. El primero es una función, el <i>efecto</i> en sí mismo. Según la documentación:

> <i>De forma predeterminada, los efectos se ejecutan después de cada renderizado completo, pero puedes elegir activarlo solo cuando ciertos valores han cambiado.</i>

Por lo tanto, por defecto, el efecto <i>siempre</i> se ejecuta después de que el componente ha sido renderizado. En nuestro caso, sin embargo, solo queremos ejecutar el efecto junto con el primer render.

El segundo parámetro de <em>useEffect</em> se usa para [especificar la frecuencia con la que se ejecuta el efecto](https://es.react.dev/reference/react/useEffect#parameters). Si el segundo parámetro es una matriz vacía <em>[]</em>, entonces el efecto solo se ejecuta junto con el primer renderizado del componente.

Hay muchos casos de uso posibles para un hook de efecto ademas de la obtención de datos del servidor. Sin embargo, por ahora esto es suficiente para nosotros.

Piensa en la secuencia de eventos que acabamos de comentar. ¿Qué partes del código se ejecutan? ¿En qué orden? ¿Con qué frecuencia? ¡Entender el orden de los eventos es fundamental!

Ten en cuenta que también podríamos haber escrito el código de la función de efecto de esta manera:

```js
useEffect(() => {
  console.log('effect')

  const eventHandler = response => {
    console.log('promise fulfilled')
    setNotes(response.data)
  }

  const promise = axios.get('http://localhost:3001/notes')
  promise.then(eventHandler)
}, [])
```

Se asigna una referencia a una función de controlador de eventos a la variable <em>eventHandler</em>. La promesa devuelta por el método <em>get</em> de Axios se almacena en la variable <em>promise</em>. El registro del callback ocurre dándole la variable <em>eventHandler</em>, refiriéndose a la función del controlador de eventos, como un parámetro para el método <em>then</em> de la promesa. Por lo general, no es necesario asignar funciones y promesas a las variables, y una forma más compacta de representar las cosas, como se ve más arriba, es suficiente.

```js
useEffect(() => {
  console.log('effect')
  axios
    .get('http://localhost:3001/notes')
    .then(response => {
      console.log('promise fulfilled')
      setNotes(response.data)
    })
}, [])
```

Todavía tenemos un problema en nuestra aplicación. Al agregar nuevas notas, no se almacenan en el servidor.

El código de la aplicación, como se ha descrito hasta ahora, se puede encontrar completo en [github](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part2-4), en la rama <i>part2-4</i>.

### El entorno de ejecución de desarrollo

La configuración de toda nuestra aplicación se ha vuelto cada vez más compleja. Repasemos qué pasa y dónde. La siguiente imagen describe la composición de la aplicación

![diagrama de la composición de la aplicación react](../../images/2/18e.png)

El código JavaScript que compone nuestra aplicación React se ejecuta en el navegador. El navegador obtiene el JavaScript del <i>servidor de desarrollo de React</i>, que es la aplicación que se ejecuta después de ejecutar el comando <em>npm run dev</em>. El servidor de desarrollo transforma el JavaScript a un formato comprensible para el navegador. Entre otras cosas, une JavaScript de diferentes archivos en un solo archivo. Analizaremos el servidor de desarrollo con más detalle en la parte 7 del curso.

La aplicación React que se ejecuta en el navegador obtiene los datos formateados JSON desde <i>json-server</i> que se ejecuta en el puerto 3001 de la máquina. El servidor del que consultamos los datos - <i>json-server</i> - obtiene sus datos del archivo <i>db.json</i>.

En este punto del desarrollo, todas las partes de la aplicación residen en la máquina del desarrollador de software, también conocida como localhost. La situación cambia cuando la aplicación se despliega en el internet. Haremos esto en la parte 3.

</div> 

<div class="tasks">

<h3>Ejercicio 2.11.</h3>

<h4>2.11: La Agenda Telefónica Paso 6</h4>

Continuamos con el desarrollo de la agenda telefónica. Almacena el estado inicial de la aplicación en el archivo <i>db.json</i>, que debe ubicarse en la raíz del proyecto.

```json
{
  "persons":[
    { 
      "name": "Arto Hellas", 
      "number": "040-123456",
      "id": 1
    },
    { 
      "name": "Ada Lovelace", 
      "number": "39-44-5323523",
      "id": 2
    },
    { 
      "name": "Dan Abramov", 
      "number": "12-43-234345",
      "id": 3
    },
    { 
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122",
      "id": 4
    }
  ]
}
```

Inicia json-server en el puerto 3001 y asegúrate de que el servidor devuelve la lista de personas yendo a la dirección <http://localhost:3001/persons> en el navegador.

Si recibes el siguiente mensaje de error:

```js
events.js:182
      throw er; // Unhandled 'error' event
      ^

Error: listen EADDRINUSE 0.0.0.0:3001
    at Object._errnoException (util.js:1019:11)
    at _exceptionWithHostPort (util.js:1041:20)
```

significa que el puerto 3001 ya está en uso por otra aplicación, por ejemplo en uso por un servidor json que ya se está ejecutando. Cierra la otra aplicación o cambia el puerto en caso de que no funcione.

Modifica la aplicación de modo que el estado inicial de los datos se obtenga del servidor mediante la librería <i>axios</i>. Completa la obtención de los datos con un [Effect hook](https://react.dev/reference/react/useEffect).

</div>
