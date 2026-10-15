---
mainImage: ../../../images/part-0.svg
part: 0
letter: b
lang: es
---

<div class="content">

Antes de comenzar a programar, repasaremos algunos principios del desarrollo web al examinar una aplicación de ejemplo en <https://studies.cs.helsinki.fi/exampleapp>.

La aplicación existe solo para demostrar algunos conceptos básicos del curso, y de ninguna manera es un ejemplo de <i>cómo</i> se debe hacer una aplicación web moderna. Por el contrario, demuestra algunas técnicas antiguas de desarrollo web, que incluso pueden verse como <i>malas prácticas</i> en la actualidad.

El código cumplirá con las mejores prácticas contemporáneas a partir de la [parte 1](/es/part1) en adelante.

Abre la [aplicación de ejemplo](https://studies.cs.helsinki.fi/exampleapp) en tu navegador. A veces, esto toma un tiempo.

El material del curso es realizado con el navegador Chrome.

**La primera regla del desarrollo web**: Siempre mantén la Consola de Desarrollo abierta en tu navegador web. En macOS, abre la consola presionando _fn_-_F12_ o _option-cmd-i_ simultáneamente. En Windows o Linux, abre la consola presionando _Fn_-_F12_ o _ctrl-shift-i_ simultáneamente. La consola también se puede abrir a través del [menú contextual](https://en.wikipedia.org/wiki/Menu_key).

Recuerda <i>siempre</i> mantener la Consola de Desarrollo abierta al desarrollar aplicaciones web.

La consola se ve así:

![Captura de pantalla de la consola de desarrollo abierta en un navegador](../../images/0/1e.png)

Asegúrate de que la pestaña <i>Network (Red)</i> esté abierta y marca la opción <i>Disable cache (Deshabilitar caché)</i> como se muestra. <i>Preserve log (Preservar registros)</i> también puede ser útil (guarda los registros impresos por la aplicación cuando se recarga la página), así como "Hide extension URLs" (oculta las solicitudes de cualquier extensión instalada en el navegador, no se muestra en la imagen anterior).

**Nota:** La pestaña más importante es la de <i>Console (Consola)</i>. Sin embargo, en la introducción usaremos bastante la pestaña <i>Network (Red)</i>.

### HTTP GET

El servidor y el navegador web se comunican entre sí mediante el protocolo [HTTP](https://developer.mozilla.org/es/docs/Web/HTTP). La pestaña <i>Network (Red)</i> muestra cómo se comunican el navegador y el servidor.

Cuando recargas la página (para refrescar una página web, en Windows, presiona las teclas _Fn_-_F5_. En macOS, presiona _command_-_R_. O presiona el símbolo &#8635; en tu navegador), la consola mostrará que han ocurrido dos eventos:

- El navegador recupera el contenido de la página <i>studies.cs.helsinki.fi/exampleapp</i> del servidor
- Y descarga la imagen <i>kuva.png</i>

![Captura de pantalla de la consola de desarrollo mostrando estos dos eventos](../../images/0/2e.png)

En una pantalla pequeña, es posible que debas ampliar la ventana de la consola para verlos.

Al hacer clic en el primer evento, se muestra más información sobre lo que está sucediendo:

![Vista detallada de un solo evento](../../images/0/3e.png)

La parte superior, <i>General</i>, muestra que el navegador hizo una solicitud a la dirección <i>https://studies.cs.helsinki.fi/exampleapp</i> (aunque la dirección ha cambiado ligeramente desde que se tomó esta imagen) usando el método [GET](https://developer.mozilla.org/es/docs/Web/HTTP/Methods/GET), y que la solicitud fue exitosa, porque la respuesta del servidor tenía el [Código de estado](https://es.wikipedia.org/wiki/Anexo:C%C3%B3digos_de_estado_HTTP) 200.

La solicitud y la respuesta del servidor tienen varias [cabeceras](https://es.wikipedia.org/wiki/Anexo:Cabeceras_HTTP):

![Captura de pantalla de las cabeceras de respuesta](../../images/0/4e.png)

Las <i>Cabeceras de Respuesta (Response Headers)</i> en la parte superior nos dicen, por ejemplo, el tamaño de la respuesta en bytes y la hora exacta de la respuesta. Una cabecera importante [Content-Type](https://developer.mozilla.org/es/docs/Web/HTTP/Headers/Content-Type) nos dice que la respuesta es un archivo de texto en formato [utf-8](https://es.wikipedia.org/wiki/UTF-8), cuyo contenido se ha formateado con HTML. De esta manera, el navegador sabe que la respuesta es una página [HTML](https://es.wikipedia.org/wiki/HTML) normal y la representa en el navegador "como una página web".

La pestaña <i>Response (Respuesta)</i> muestra los datos de la respuesta, una página HTML normal. La sección <i>body</i> determina la estructura de la página mostrada en la pantalla:

![Captura de pantalla de la pestaña de respuesta](../../images/0/5e.png)

La página contiene un elemento [div](https://developer.mozilla.org/es/docs/Web/HTML/Element/div), que a su vez contiene un encabezado, un enlace a la página <i>notes</i> y una etiqueta [img](https://developer.mozilla.org/es/docs/Web/HTML/Element/img), y muestra el número de notas creadas.

Debido a la etiqueta img, el navegador realiza una segunda <i>solicitud HTTP</i> para recuperar la imagen <i>kuva.png</i> del servidor. Los detalles de la solicitud son los siguientes:

![Vista detallada del segundo evento](../../images/0/6e.png)

La solicitud se realizó a la dirección <https://studies.cs.helsinki.fi/exampleapp/kuva.png> y su tipo es HTTP GET. Las Cabeceras de Respuesta nos dicen que el tamaño de la respuesta es 89350 bytes y su [Content-Type](https://developer.mozilla.org/es/docs/Web/HTTP/Headers/Content-Type) es <i>image/png</i>, por lo que es una imagen png. El navegador utiliza esta información para mostrar la imagen correctamente en la pantalla.

La cadena de eventos causada por abrir la página <https://studies.cs.helsinki.fi/exampleapp> en un navegador forma el siguiente [diagrama de secuencia](https://www.geeksforgeeks.org/unified-modeling-language-uml-sequence-diagrams/):

![Diagrama de secuencia del flujo cubierto arriba](../../images/0/7e.png)

El diagrama de secuencia visualiza cómo el navegador y el servidor se comunican a lo largo del tiempo. El tiempo fluye en el diagrama de arriba a abajo, por lo que el diagrama comienza con la primera solicitud que el navegador envía al servidor, seguida de la respuesta.

Primero, el navegador realiza una solicitud HTTP GET al servidor para obtener el código HTML de la página. La etiqueta <i>img</i> en el HTML solicita al navegador que busque la imagen <i>kuva.png</i>. El navegador muestra la página HTML y la imagen en la pantalla.

Aunque es difícil de notar, la página HTML comienza a mostrarse antes de que la imagen se haya obtenido del servidor.

### Aplicaciones web tradicionales

La página de inicio de la aplicación de ejemplo funciona como una <i>aplicación web tradicional</i>. Al ingresar a la página, el navegador obtiene el documento HTML que detalla la estructura y el contenido textual de la página desde el servidor.

El servidor ha formado este documento de alguna manera. El documento puede ser un archivo de texto <i>estático</i> guardado en el directorio del servidor. El servidor también puede formar los documentos HTML <i>dinámicamente</i> de acuerdo con el código de la aplicación, utilizando, por ejemplo, datos de una base de datos.
El código HTML de la aplicación de ejemplo se ha formado de forma dinámica, porque contiene información sobre el número de notas creadas.

El código HTML de la página de inicio es formado dinámicamente en el servidor:

```js
const getFrontPageHtml = noteCount => {
  return`
    <! DOCTYPE html>
    <html>
      <head>
      </head>
      <body>
        <div class='container'>
          <h1>
          <p>number of notes created ${noteCount}</p>
          <a href='/notes'>notes</a>
          <img src='kuva.png' width='200' />
        </div>
      </body>
    </html>
`
}

app.get('/', (req, res) => {
  const page = getFrontPageHtml(notes.length)
  res.send(page);
});
```

No tienes que entender el código todavía.

El contenido de la página HTML se ha guardado como un plantilla de cadena o un string que permite la evaluación, por ejemplo, de variables, como <em>noteCount</em>, en medio de ella. La parte de la página de inicio que cambia dinámicamente, el número de notas guardadas (en el código <em>noteCount</em>), se reemplaza por el número actual de notas (en el código <em>notes.length</em>) en la plantilla de cadena.

Escribir HTML en medio del código no es muy inteligente, pero para los programadores antiguos de PHP, era una práctica normal.

En las aplicaciones web tradicionales, el navegador es "tonto". Solo obtiene datos HTML del servidor, y toda la lógica de la aplicación reside en el servidor. Un servidor puede ser creado utilizando [Java Spring](https://spring.io/projects/spring-framework), [Python Flask](https://flask.palletsprojects.com/en/2.2.x/), o [Ruby on Rails](http://rubyonrails.org/), por mencionar solo algunos ejemplos.

El ejemplo utiliza la librería [Express](https://expressjs.com/) con Node.js. Este curso utilizará Node.js y Express para crear servidores web.

### Ejecución de la lógica de la aplicación en el navegador

Mantén abierta la Consola para desarrolladores. Vacía la consola haciendo clic en el símbolo 🚫 o escribiendo clear() en la consola.
Ahora, cuando vayas a la página [notes](https://studies.cs.helsinki.fi/exampleapp/notes), el navegador realiza 4 solicitudes HTTP:

![Captura de pantalla de la consola de desarrollador con 4 solicitudes visibles](../../images/0/8e.png)

Todas las solicitudes tienen tipos <i>diferentes</i>. El tipo de la primera solicitud es <i>document</i>. Es el código HTML de la página y tiene el siguiente aspecto:

![Vista detallada de la primera solicitud](../../images/0/9e.png)

Cuando comparamos la página que se muestra en el navegador y el código HTML devuelto por el servidor, notamos que el código no contiene la lista de notas.
La sección [head](https://developer.mozilla.org/es/docs/Web/HTML/Element/head) del HTML contiene una etiqueta [script](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script), que hace que el navegador obtenga un archivo JavaScript llamado <i>main.js</i>.

El código JavaScript tiene el siguiente aspecto:

```js
var xhttp = new XMLHttpRequest()

xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    const data = JSON.parse(this.responseText)
    console.log(data)

    var ul = document.createElement('ul')
    ul.setAttribute('class', 'notes')

    data.forEach(function(note) {
      var li = document.createElement('li')

      ul.appendChild(li)
      li.appendChild(document.createTextNode(note.content))
    })

    document.getElementById('notes').appendChild(ul)
  }
}

xhttp.open('GET','/data.json', true)
xhttp.send ()
```

Los detalles del código no son importantes en este momento, pero se ha incluido algún código para darle vida a las imágenes y el texto. Comenzaremos a codificar correctamente en la [parte 1](/es/part1). El código de muestra en esta parte en realidad no es relevante en absoluto para las técnicas de codificación de este curso.

> Algunos podrían preguntarse por qué se usa xhttp-object en lugar de el moderno fetch. Esto se debe a que todavía no queremos entrar en promesas (promises), y el código tiene un papel secundario en esta parte. Volveremos a las formas modernas de realizar solicitudes al servidor en la [parte 2](/es/part2).

Inmediatamente después de obtener la etiqueta <i>script</i>, el navegador comienza a ejecutar el código.

Las dos últimas líneas le dan instrucciones al navegador para realizar una solicitud HTTP GET a la dirección del servidor <i>/data.json</i>:

```js
xhttp.open('GET', '/data.json', true)
xhttp.send()
```

Esta es la solicitud que se muestra más abajo en la pestaña Network (Red).

Podemos intentar ir a la dirección <https://studies.cs.helsinki.fi/exampleapp/data.json> directamente desde el navegador:

![Datos JSON sin procesar](../../images/0/10e.png)

Allí encontramos las notas como "datos sin procesar" en [JSON](https://es.wikipedia.org/wiki/JSON). De forma predeterminada, navegadores basados en Chromium no son demasiado buenos para mostrar datos JSON. Se pueden usar extensiones para manejar el formato. Instala, por ejemplo, [JSONVue](https://chrome.google.com/webstore/detail/jsonview/chklaanhfefbnpoihckbnefhakgolnmc) en Chrome y vuelve a cargar la página. Los datos ahora están bien formateados:

![Datos JSON formateados](../../images/0/11e.png)

Entonces, el código JavaScript de la página de notas anterior descarga los datos JSON que contienen las notas y forma una lista de viñetas a partir del contenido de la nota:

Esto se hace mediante el siguiente código:

```js
const data = JSON.parse(this.responseText)
console.log(data)

var ul = document.createElement('ul')
ul.setAttribute('class', 'notes')

data.forEach(function(note) {
  var li = document.createElement('li')

  ul.appendChild(li)
  li.appendChild(document.createTextNode(note.content))
})

document.getElementById('notes').appendChild(ul)
```

El código primero crea una lista desordenada con una etiqueta [ul](https://developer.mozilla.org/es/docs/Web/HTML/Element/ul)...

```js
var ul = document.createElement('ul')
ul.setAttribute('class', 'notes')
```

... y luego agrega una etiqueta [li](https://developer.mozilla.org/es-US/docs/Web/HTML/Element/li) para cada nota. Solo el campo <i>content</i> de cada nota se convierte en el contenido de la etiqueta li. Los timestamps que se encuentran en los datos sin procesar no se utilizan para nada aquí.

```js
data.forEach(function(note) {
  var li = document.createElement('li')

  ul.appendChild(li)
  li.appendChild(document.createTextNode(note.content))
})
```

Ahora abre la pestaña <i>Console (Consola)</i> en tu Consola de desarrollador:

![Captura de pantalla de la pestaña console en la consola de desarrollo](../../images/0/12e.png)

Al hacer clic en el pequeño triángulo al principio de la línea, puedes expandir el texto en la consola.

![Captura de pantalla de una de las entradas previamente colapsada, ahora expandida](../../images/0/13e.png)

Esta salida en la consola es causada por el comando <em>console.log</em> en el código:

```js
const data = JSON.parse(this.responseText)
console.log(data)
```

Entonces, después de recibir datos del servidor, el código los imprime en la consola.

La pestaña <i>Console (Consola)</i> y el comando <em>console.log</em> se volverán muy familiares para ti durante el curso.

### Controladores de eventos y funciones de devolución de llamada

La estructura de este código es un poco extraña:

```js
var xhttp = new XMLHttpRequest()

xhttp.onreadystatechange = function() {
// código que se encarga de la respuesta del servidor
}

xhttp.open('GET', '/data.json', true)
xhttp.send()
```

La solicitud al servidor se envía en la última línea, pero el código para manejar la respuesta se puede encontrar más arriba. ¿Que esta pasando?

```js
xhttp.onreadystatechange = function() {
```

En esta línea, se define un <i>controlador de eventos (event handler)</i> para el objeto <em>xhttp</em> que realiza la solicitud. Cuando cambia el estado del objeto, el navegador llama a la función del controlador de eventos. El código de la función verifica que [readyState](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState) sea igual a 4 (que describe la situación <i>La operación está completa</i>) y que el código de estado HTTP de la respuesta es 200.

```js
xhttp.onreadystatechange = function() { 
  if (this.readyState == 4 && this.status == 200) {
    // código que se encarga de la respuesta del servidor
  }
} 
```

El mecanismo de invocación de controladores de eventos es muy común en JavaScript. Las funciones del controlador de eventos se denominan funciones de devolución de llamada ([callback](https://developer.mozilla.org/es/docs/Glossary/Callback_function)). El código de la aplicación no invoca las funciones en sí, sino el entorno de ejecución –el navegador–, invoca la función en el momento adecuado, cuando se ha producido el <i>evento</i>.

### Modelo de Objetos del Documento o DOM

Podemos pensar en las páginas HTML como estructuras de árbol implícitas.

```
html
  head
    link
    script
  body
    div
      h1
      div
        ul
          li
          li
          li
      form
        input
        input
```

La misma estructura arbórea se puede ver en la pestaña de la consola <i>Elements (Elementos)</i>.

![Captura de pantalla de la pestaña Elements de la consola de desarrollo](../../images/0/14e.png)

El funcionamiento del navegador se basa en la idea de representar los elementos HTML como un árbol.

Document Object Model, o [DOM](https://es.wikipedia.org/wiki/Document_Object_Model) es una interfaz de programación de aplicaciones, (una <i>API</i>), que permite la modificación programática de <i>árboles de elementos</i> correspondientes a páginas web.

El código JavaScript introducido en el capítulo anterior utilizó DOM-API para agregar una lista de notas a la página.

El siguiente código crea un nuevo nodo en la variable <em>ul</em> y le agrega algunos nodos secundarios:

```js
var ul = document.createElement('ul')

data.forEach(function(note) {
  var li = document.createElement('li')

  ul.appendChild(li)
  li.appendChild(document.createTextNode(note.content))
})
```

Finalmente, la rama de árbol de la variable <em>ul</em> es conectada en su lugar adecuado en el árbol HTML de toda la página:

```js 
document.getElementById('notes').appendChild(ul)
```

### Manipulando el objeto document desde la consola

El nodo superior del árbol DOM de un documento HTML se denomina objeto <em>document</em>. Podemos realizar varias operaciones en una página web utilizando DOM-API. Puedes acceder al objeto <em>document</em> escribiendo <em>document</em> en la pestaña Console (Consola):

![Objeto document en la pestaña console de las herramientas de desarrollo](../../images/0/15e.png)

Agreguemos una nueva nota a la página desde la consola.

Primero, obtendremos la lista de notas de la página. La lista está en el primer elemento ul de la página:

```js
list = document.getElementsByTagName('ul')[0]
```

Luego crea un nuevo elemento li y agrégale contenido de texto:

```js
newElement = document.createElement('li')
newElement.textContent = 'Page manipulation from console is easy'
```

Y agrega el nuevo elemento li a la lista:

```js
list.appendChild(newElement)
```

![Captura de pantalla de la página con la nueva nota agregada a la lista](../../images/0/16e.png)

Aunque la página se actualiza en tu navegador, los cambios no son permanentes. Si se vuelve a cargar la página, la nueva nota desaparecerá porque los cambios no se enviaron al servidor. El código JavaScript que obtiene el navegador siempre creará la lista de notas basada en datos JSON de la dirección <https://studies.cs.helsinki.fi/exampleapp/data.json>.

### CSS

El elemento <i>head</i> del código HTML de la página de Notes contiene un [enlace](https://developer.mozilla.org/es/docs/Web/HTML/Element/link), que determina que el navegador debe obtener una hoja de estilos [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) de la dirección [main.css](https://studies.cs.helsinki.fi/exampleapp/main.css).

Cascading Style Sheets (Hojas de Estilos en Cascada), o CSS, es un lenguaje de hojas de estilo utilizado para determinar la apariencia de las páginas web.

El archivo CSS obtenido tiene el siguiente aspecto:

```css
.container {
  padding: 10px;
  border: 1px solid;
}

.notes {
  color: blue;
}
```

El archivo define dos [selectores de clase](https://developer.mozilla.org/es/docs/Web/CSS/Class_selectors). Se utilizan para seleccionar ciertas partes de la página y definir reglas de estilo para aplicarles estilo.

Una definición de selector de clase siempre comienza con un punto y contiene el nombre de la clase.

Las clases son [atributos](https://developer.mozilla.org/es/docs/Web/HTML/Global_attributes/class), que se pueden agregar a elementos HTML.

Los atributos CSS se pueden examinar en la pestaña <i>Elements (Elementos)</i> de la consola:

![Captura de pantalla de la pestaña elements de las herramientas de desarrollo](../../images/0/17e.png)

El elemento <i>div</i> más externo tiene la clase <i>container</i>. El elemento <i>ul</i> que contiene la lista de notas tiene la clase <i>notes</i>.

La regla CSS define que los elementos con la clase <i>container</i> se delinearán con un [border](https://developer.mozilla.org/es/docs/Web/CSS/border) de un píxel de ancho. También establece un [padding](https://developer.mozilla.org/es/docs/Web/CSS/padding) de 10 píxeles en el elemento. Esto agrega un espacio vacío entre el contenido del elemento y el borde.

La segunda regla CSS establece el color del texto de las notas en azul.

Los elementos HTML también pueden tener otros atributos además de clases. El elemento <i>div</i> que contiene las notas tiene un atributo [id](https://developer.mozilla.org/es/docs/Web/HTML/Global_attributes/id). El código JavaScript usa el id para encontrar el elemento.

La pestaña <i>Elements (Elementos)</i> de la consola se puede utilizar para cambiar los estilos de los elementos.

![Captura de pantalla de la pestaña elements de las herramientas de desarrolo mostrando reglas de CSS aplicadas a la clase container](../../images/0/18e.png)

Los cambios realizados en la consola no serán permanentes. Si deseas realizar cambios duraderos, debes guardarlos en la hoja de estilos CSS del servidor.

### Cargando una página que contiene JavaScript - revisión

Revisemos lo que sucede cuando la página <https://studies.cs.helsinki.fi/exampleapp/notes> se abre en el navegador.

![Diagrama de secuencia de la interacción entre el navegador y el servidor](../../images/0/19e.png)

- El navegador obtiene el código HTML que define el contenido y la estructura de la página del servidor mediante una solicitud HTTP GET.
- Los enlaces en el código HTML hacen que el navegador también busque la hoja de estilos CSS <i>main.css</i>...
- ...y un archivo de código JavaScript <i>main.js</i>
- El navegador ejecuta el código JavaScript. El código realiza una solicitud HTTP GET a la dirección https://studies.cs.helsinki.fi/exampleapp/data.json, que devuelve las notas como datos JSON.
- Cuando se han obtenido los datos, el navegador ejecuta un <i>controlador de eventos</i>, que muestra las notas en la página utilizando DOM-API.

### Formularios y HTTP POST

A continuación, examinemos cómo se realiza la adición de una nueva nota.

La página de notas contiene un [elemento de formulario](https://developer.mozilla.org/es/docs/Learn/Forms/Your_first_form)

![Highlight de elemento de formulario y herramientas de desarrolladores](../../images/0/20e.png)

Cuando se hace clic en el botón del formulario, el navegador enviará la entrada del usuario al servidor. Abramos la pestaña <i>Network (Red)</i> y veamos cómo se ve enviar el formulario:

![Pestaña de network donde se muestran los eventos de enviar el formulario](../../images/0/21e.png)

Sorprendentemente, enviar el formulario causa no menos de <i>cinco</i> solicitudes HTTP.
La primera es el evento de envío de formulario. Acerquémonos:

![Vista detallada de la primera solicitud](../../images/0/22e.png)

Es una solicitud [HTTP POST](https://developer.mozilla.org/es/docs/Web/HTTP/Methods/POST) a la dirección del servidor <i>new\_note</i>. El servidor responde con el código de estado HTTP 302. Se trata de una [redirección de URL](https://es.wikipedia.org/wiki/Redirecci%C3%B3n_de_URL), con la que el servidor solicita al navegador que realice una nueva solicitud HTTP GET a la dirección definida en la <i>Ubicación (Location)</i> del encabezado - la dirección <i>notes</i>.

Entonces, el navegador vuelve a cargar la página de Notas. La recarga provoca tres solicitudes HTTP más: obtener la hoja de estilo (main.css), el código JavaScript (main.js) y los datos sin procesar de las notas (data.json).

La pestaña network también muestra los datos enviados con el formulario:

Nota: En las versiones más recientes de Chrome, el menú desplegable Form Data se encuentra dentro de la nueva pestaña Payload, ubicada a la derecha de la pestaña Headers

![Dropdown de datos del formulario](../../images/0/23g.png)

La etiqueta Form tiene atributos <i>action</i> y <i>method</i>, que definen que el envío del formulario se realiza como una solicitud HTTP POST a la dirección <i>new\_note</i>.

![Highlight de action y method](../../images/0/24e.png)

El código en el servidor responsable de la solicitud POST es bastante simple (Nota: este código está en el servidor, y no en el código JavaScript obtenido por el navegador):

```js
app.post('/new_note', (req, res) => {
  notes.push({
    content: req.body.note,
    date: new Date(),
  })

  return res.redirect('/notes')
})
```

Los datos se envían como el [cuerpo](https://developer.mozilla.org/es/docs/Web/HTTP/Methods/POST) de la solicitud POST.

El servidor puede acceder a los datos accediendo al campo <em>req.body</em> del objeto <em>req</em> de la solicitud.

El servidor crea un nuevo objeto de nota y lo agrega a un arreglo llamado <em>notes</em>.

```js
notes.push({
  content: req.body.note,
  date: new Date(),
})
```

Los objetos *note* tienen dos campos: <i>content</i> que contiene el contenido real de la nota y <i>date</i> que contiene la fecha y hora en que se creó la nota.

El servidor no guarda nuevas notas en una base de datos, por lo que las nuevas notas desaparecen cuando se reinicia el servidor.

### AJAX

La página de Notas de la aplicación sigue un estilo de desarrollo web de principios de los noventa y utiliza "Ajax". Como tal, está en la cresta de la ola de tecnología web de principios de la década de 2000.

[AJAX](https://es.wikipedia.org/wiki/AJAX) (JavaScript Asíncrono y XML) es un término introducido en febrero de 2005 sobre la base de los avances en la tecnología de los navegadores para describir un nuevo enfoque revolucionario que permitió la obtención de contenido en páginas web utilizando JavaScript incluido dentro del HTML, sin la necesidad de volver a renderizar la página.

Antes de la era AJAX, todas las páginas web funcionaban como la [aplicación web tradicional](/es/part0/fundamentos_de_las_aplicaciones_web#aplicaciones-web-tradicionales) que vimos anteriormente en este capítulo.
Todos los datos que se muestran en la página se obtuvieron con el código HTML generado por el servidor.

La página Notas utiliza AJAX para obtener los datos de las notas. El envío del formulario todavía utiliza el mecanismo tradicional de envío de formularios web.

Las URLs de la aplicación reflejan los viejos tiempos sin preocupaciones. Los datos JSON se obtienen de la URL <https://studies.cs.helsinki.fi/exampleapp/data.json> y se envían nuevas notas a la URL <https://studies.cs.helsinki.fi/exampleapp/new_note>.
Hoy en día, URLs como estas no se consideran aceptables, ya que no siguen las convenciones generalmente reconocidas de las APIs [RESTful](https://es.wikipedia.org/wiki/Transferencia_de_Estado_Representacional), que analizaremos más en la [parte 3](/es/part3)

La cosa denominada AJAX es ahora tan común que se da por sentado. El término se ha desvanecido en el olvido, y la nueva generación ni siquiera ha oído hablar de él.

### Aplicación de una sola página

En nuestra aplicación de ejemplo, la página de inicio funciona como una página web tradicional: toda la lógica está en el servidor y el navegador solo muestra el HTML como se indica.

La página Notas da parte de la responsabilidad al navegador, la generación del código HTML para las notas existentes. El navegador aborda esta tarea ejecutando el código JavaScript que obtuvo del servidor. El código obtiene las notas del servidor como datos JSON y agrega elementos HTML para mostrar las notas en la página usando la [DOM-API](/es/part0/fundamentos_de_las_aplicaciones_web#modelo-de-objetos-del-documento-o-dom).

En los últimos años, ha surgido el estilo de [Aplicación de una sola página](https://es.wikipedia.org/wiki/Single-page_application) (SPA) para crear aplicaciones web. Los sitios web de estilo SPA no obtienen todas sus páginas por separado del servidor como lo hace nuestra aplicación de muestra, sino que comprenden solo una página HTML obtenida del servidor, cuyo contenido se manipula con JavaScript que se ejecuta en el navegador.

La página Notas de nuestra aplicación tiene cierto parecido con las aplicaciones de estilo SPA, pero aún no está del todo lista. Aunque la lógica para representar las notas se ejecuta en el navegador, la página sigue utilizando la forma tradicional de agregar nuevas notas. Los datos se envían al servidor con el envío del formulario, y el servidor indica al navegador que vuelva a cargar la página Notas con un <i>redireccionamiento</i>.

Puedes encontrar una versión "aplicación de una sola página" de nuestra aplicación de ejemplo en <https://studies.cs.helsinki.fi/exampleapp/spa>.
A primera vista, la aplicación se ve exactamente igual que la anterior.
El código HTML es casi idéntico, pero el archivo JavaScript es diferente (<i>spa.js</i>) y hay un pequeño cambio en cómo se define la etiqueta form:

![form sin action ni method](../../images/0/25e.png)

El formulario no tiene atributos de <i>action</i> o <i>method</i> para definir cómo y dónde enviar los datos de entrada.

Abre la pestaña <i>Network (Red)</i> y vacíala. Cuando ahora crees una nueva nota, notaras que el navegador envía solo una solicitud al servidor.

![pestaña network mostrando una solicitud POST a new_note_spa](../../images/0/26e.png)

La solicitud POST a la dirección <i>new\_note\_spa</i> contiene la nueva nota como datos JSON que contienen tanto el contenido de la nota (<i>content</i>) como la marca de tiempo (<i>date</i>):

```js
{
  content: "single page app does not reload the whole page",
  date: "2019-05-25T15:15:59.905Z"
}
```

La cabecera <i>Content-Type</i> de la solicitud le dice al servidor que los datos incluidos están representados en formato JSON.

![highlight de Cabecera Content-type con valor application/json](../../images/0/27e.png)

Sin esta cabecera, el servidor no sabría cómo analizar correctamente los datos.

El servidor responde con el código de estado [201 Created](https://httpstatuses.com/201). Esta vez, el servidor no solicita una redirección, el navegador permanece en la misma página y no envía más solicitudes HTTP.

La versión SPA de la aplicación no envía los datos del formulario de la forma tradicional, sino que utiliza el código JavaScript que obtuvo del servidor.
Analizaremos un poco este código, aunque comprender todos los detalles aún no es importante.

```js
var form = document.getElementById('notes_form')

form.onsubmit = function(e) {
  e.preventDefault()

  var note = {
    content: e.target.elements[0].value,
    date: new Date(),
  }

  notes.push(note)
  e.target.elements[0].value = ''
  redrawNotes()
  sendToServer(note)
}
```

El comando <em>document.getElementById('notes\_form')</em> le indica al código que obtenga el elemento form de la página y que registre un <i>event handler</i> para manejar el evento de envío del formulario. El controlador de eventos llama inmediatamente al método <em>e.preventDefault()</em> para evitar el manejo por defecto del envío de formularios. El método por defecto enviaría los datos al servidor y causaría una nueva solicitud GET, lo cual no queremos que suceda.

Luego el controlador de eventos crea una nueva nota, la agrega a la lista de notas con el comando <em>notes.push(note)</em>, vuelve a renderizar la lista de notas en la página y envía la nueva nota al servidor.

El código para enviar la nota al servidor es el siguiente:

```js
var sendToServer = function(note) {
  var xhttpForPost = new XMLHttpRequest()
  // ...

  xhttpForPost.open('POST', '/new_note_spa', true)
  xhttpForPost.setRequestHeader('Content-type', 'application/json')
  xhttpForPost.send(JSON.stringify(note))
}
```

El código determina que los datos se enviarán con una solicitud HTTP POST y el tipo de datos será JSON. El tipo de datos se determina con una cabecera <i>Content-type</i>. Luego los datos se envían como una cadena JSON.

El código de la aplicación está disponible en <https://github.com/mluukkai/example_app>.
Vale la pena recordar que la aplicación solo está destinada a demostrar los conceptos del curso. El código sigue un estilo de desarrollo deficiente en cierta medida y no debe usarse como ejemplo al crear tus propias aplicaciones. Lo mismo ocurre con las URL utilizadas. La URL <i>new\_note\_spa</i>, a la que se envían las nuevas notas, no cumple con las mejores prácticas actuales.

### Librerías JavaScript

La aplicación de muestra se realiza con el llamado [vanilla JavaScript](https://medium.freecodecamp.org/is-vanilla-javascript-worth-learning-absolutely-c2c67140ac34), utilizando solo la DOM-API y JavaScript para manipular la estructura de las páginas.

En lugar de utilizar JavaScript y DOM-API únicamente, a menudo se utilizan diferentes librerías que contienen herramientas con las que es más fácil trabajar en comparación con DOM-API para manipular páginas. Una de estas librerías es la popular [jQuery](https://jquery.com/).

jQuery se desarrolló cuando las aplicaciones web seguían principalmente el estilo tradicional del servidor que genera páginas HTML, cuya funcionalidad se mejoró en el lado del navegador usando JavaScript escrito con jQuery. Una de las razones del éxito de jQuery fue la llamada compatibilidad entre navegadores. La librería funcionó independientemente del navegador o de la empresa que la hizo, por lo que no hubo necesidad de soluciones específicas para cada navegador. Hoy en día, el uso de jQuery no está tan justificado dado el avance de VanillaJS, y los navegadores más populares generalmente soportan bien las funcionalidades básicas.

El auge de las aplicaciones de una sola página trajo varias formas más "modernas" de desarrollo web que jQuery. El favorito de la primera ola de desarrolladores fue [BackboneJS](http://backbonejs.org/). Después de su [lanzamiento](https://github.com/angular/angular.js/blob/master/CHANGELOG.md#100rc1-moir%C3%A9-vision-2012-03-13) en 2012, [AngularJS](https://angularjs.org/) de Google rápidamente se convirtió casi en el estándar de facto del desarrollo web moderno.

Sin embargo, la popularidad de Angular se desplomó después de que el [equipo de Angular anunció que el soporte para la versión 1 terminaría](https://web.archive.org/web/20151208002550/https://jaxenter.com/angular-2-0-announcement-backfires-112127.html), y que Angular 2 no sería retrocompatible con la primera versión. Angular 2 y las versiones más nuevas no recibieron una bienvenida muy cálida.

Actualmente, la herramienta más popular para implementar la lógica del lado del navegador en las aplicaciones web es la librería [React](https://react.dev/) de Facebook.
Durante este curso, nos familiarizaremos con React y la librería [Redux](https://github.com/reactjs/redux), que se usan juntos con frecuencia.

El estado de React parece sólido, pero el mundo de JavaScript cambia constantemente. Por ejemplo, recientemente un recién llegado -[VueJS](https://vuejs.org/)- ha estado captando cierto interés.

### Desarrollo web full stack

¿Qué significa el nombre del curso, <i>Desarrollo web full stack</i>? Full stack es una palabra de moda de la que todo el mundo habla, aunque nadie sabe realmente lo que significa. O al menos, no existe una definición acordada para el término.

Prácticamente todas las aplicaciones web tienen (al menos) dos "capas": el navegador, al estar más cerca del usuario final es la capa superior, y el servidor la inferior. A menudo también hay una capa de base de datos debajo del servidor. Por lo tanto, podemos pensar en la <i>arquitectura</i> de una aplicación web como una especie de <i>stack (pila)</i> de capas.

A menudo, también hablamos sobre el [frontend y el backend](https://es.wikipedia.org/wiki/Front_end_y_back_end). El navegador es el frontend y el JavaScript que se ejecuta en el navegador es el código del frontend. El servidor, por otro lado, es el backend.

En el contexto de este curso, el desarrollo web full stack significa que nos enfocamos en todas las partes de la aplicación: el frontend, el backend y la base de datos. A veces, el software del servidor y su sistema operativo se ven como parte del stack, pero no vamos a entrar en ellos.

Programaremos el backend con JavaScript, utilizando el entorno de ejecución [Node.js](https://nodejs.org/en/). El uso del mismo lenguaje de programación en múltiples capas de la pila le da al desarrollo web full stack una dimensión completamente nueva. Sin embargo, no es un requisito del desarrollo web full stack utilizar el mismo lenguaje de programación (JavaScript) para todas las capas del stack.

Solía ser más común que los desarrolladores se especializaran en una capa del stack, por ejemplo, el backend. Las tecnologías en el backend y el frontend eran bastante diferentes. Con la tendencia full stack, se ha vuelto común que los desarrolladores dominen todas las capas de la aplicación y la base de datos. A menudo, los desarrolladores full stack también deben tener suficientes habilidades de configuración y administración para operar su aplicación, por ejemplo, en la nube.

### Fatiga de JavaScript

El desarrollo web full stack es un desafío en muchos aspectos. Suceden cosas en muchos lugares a la vez y la depuración es un poco más difícil que con las aplicaciones de escritorio normales. JavaScript no siempre funciona como cabría esperar (en comparación con muchos otros lenguajes), y la forma asíncrona en que funcionan sus entornos de ejecución genera todo tipo de desafíos. Comunicarse en la web requiere conocimientos del protocolo HTTP. También se deben manejar las bases de datos y la administración y configuración del servidor. También sería bueno saber suficiente CSS para hacer las aplicaciones al menos algo presentables.

El mundo de JavaScript se desarrolla rápidamente, lo que conlleva sus propios desafíos. Las herramientas, las librerías y el propio lenguaje están en constante desarrollo. Algunos están empezando a cansarse del cambio constante y han acuñado un término para ello: *fatiga de JavaScript*. Ve [como manejar la fatiga de JavaScript con auth0](https://auth0.com/blog/how-to-manage-javascript-fatigue/) o [fatiga de JavaScript en Medium](https://medium.com/@ericclemmons/javascript-fatigue-48d4011b6fc4).

Tú mismo sufrirás fatiga de JavaScript durante este curso. Afortunadamente para nosotros, hay algunas formas de suavizar la curva de aprendizaje y podemos comenzar con la codificación en lugar de la configuración. No podemos evitar la configuración por completo, pero podemos seguir adelante alegremente en las próximas semanas mientras evitamos los peores infiernos de configuración.

</div>

<div class="tasks">
  <h3>Ejercicios 0.1.-0.6.</h3>

Los ejercicios se envían a través de GitHub y marcando los ejercicios como realizados en el [sistema de envío de ejercicios](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

Puedes enviar todos los ejercicios al mismo repositorio o utilizar varios repositorios diferentes. Si envías ejercicios de diferentes partes al mismo repositorio, nombra bien sus directorios. Si utilizas un repositorio privado para enviar los ejercicios, agrega a _mattiluukkainen_ como colaborador.

Una buena forma de nombrar los directorios en tu repositorio de entrega es la siguiente:

```text
part0
part1
  courseinfo
  unicafe
  anecdotes
part2
  courseinfo
  phonebook
  countries
```

Entonces, cada parte tiene su propio directorio, que contiene un directorio para cada conjunto de ejercicios (como los ejercicios unicafe en la parte 1).

Los ejercicios se envían **una parte a la vez**. Cuando hayas enviado los ejercicios de una parte, ya no podrás enviar ningún ejercicio omitido de esa parte.

  <h4>0.1: HTML</h4>

Revisa los conceptos básicos de HTML leyendo este tutorial de Mozilla: [tutorial de HTML](https://developer.mozilla.org/es/docs/Learn/Getting_started_with_the_web/HTML_basics).

<i>Este ejercicio no se envía a GitHub, leer el tutorial es suficiente</i>

  <h4>0.2: CSS</h4>

Revisa los conceptos básicos de CSS leyendo este tutorial de Mozilla: [tutorial de CSS](https://developer.mozilla.org/es/docs/Learn/Getting_started_with_the_web/CSS_basics).

<i>Este ejercicio no se envía a GitHub, leer el tutorial es suficiente</i>

  <h4>0.3: Formularios HTML</h4>

Aprende sobre los conceptos básicos de los formularios HTML leyendo el tutorial de Mozilla [Mi primer formulario HTML](https://developer.mozilla.org/es/docs/Learn/Forms/Your_first_form).

<i>Este ejercicio no se envía a GitHub, leer el tutorial es suficiente</i>

  <h4>0.4: Nuevo diagrama de nota</h4>

En el capítulo [Cargando una página que contiene JavaScript - revisión](/es/part0/fundamentos_de_las_aplicaciones_web#cargando-una-pagina-que-contiene-java-script-revisada) la cadena de eventos causada al abrir la página <https://studies.cs.helsinki.fi/exampleapp/notes> se representa como un [diagrama de secuencia](https://www.geeksforgeeks.org/unified-modeling-language-uml-sequence-diagrams/)

El diagrama se hizo como un archivo Markdown de GitHub usando la sintaxis [Mermaid](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams), de la siguiente manera:

```text
sequenceDiagram
    participant browser
    participant server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate server
    server-->>browser: HTML document
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: the css file
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate server
    server-->>browser: the JavaScript file
    deactivate server

    Note right of browser: The browser starts executing the JavaScript code that fetches the JSON from the server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: [{ "content": "HTML is easy", "date": "2023-1-1" }, ... ]
    deactivate server

    Note right of browser: The browser executes the callback function that renders the notes
```

**Crea un diagrama similar** que describa la situación en la que el usuario crea una nueva nota en la página <https://studies.cs.helsinki.fi/exampleapp/notes> escribiendo algo en el campo de texto y haciendo clic en el botón <i>Save</i>.

Si es necesario, muestra las operaciones en el navegador o en el servidor como comentarios en el diagrama.

El diagrama no tiene por qué ser un diagrama de secuencia. Cualquier forma sensata de presentar los eventos está bien.

Toda la información necesaria para hacer esto, y los dos ejercicios siguientes, se pueden encontrar en el texto de [esta parte](/es/part0/fundamentos_de_las_aplicaciones_web#formularios-y-http-post).
La idea de estos ejercicios es leer el texto una vez más y pensar en lo que está sucediendo allí. No es necesario leer el [código](https://github.com/mluukkai/example_app) de la aplicación pero, por supuesto, es posible.

Puedes crear los diagramas con cualquier programa, pero quizás la mejor y más fácil forma de hacer diagramas es utilizando la sintaxis de [Mermaid](https://github.com/mermaid-js/mermaid#sequence-diagram-docs---live-editor) que ahora está implementada en las páginas de Markdown de [GitHub](https://github.blog/2022-02-14-include-diagrams-markdown-files-mermaid/).

  <h4>0.5: Diagrama de aplicación de una sola página</h4>

Crea un diagrama que describa la situación en la que el usuario accede a la versión de [aplicación de una sola página](/es/part0/fundamentos_de_las_aplicaciones_web#aplicacion-de-una-sola-pagina) de la aplicación de notas en <https://studies.cs.helsinki.fi/exampleapp/spa>.

<h4>0.6: Nueva nota en diagrama de aplicación de una sola página</h4>

Crea un diagrama que represente la situación en la que el usuario crea una nueva nota utilizando la versión de una sola página de la aplicación.

Este fue el último ejercicio, y es hora de enviar tus respuestas a GitHub y marcar los ejercicios como hechos en el [sistema de envío de ejercicios](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

</div>
