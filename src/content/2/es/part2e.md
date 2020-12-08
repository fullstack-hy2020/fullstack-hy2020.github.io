---
mainImage: ../../../images/part-2.svg
part: 2
letter: e
lang: en
---

<div class="content">


La apariencia de nuestra aplicación actual es bastante modesta . En el [ejercicio 0.2](/es/part0/fundamentos_de_aplicaiones_web#ejercicios-0-1-0-6), la tarea era pasar por el [tutorial CSS](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/CSS_basics) de Mozilla.


Antes de pasar a la siguiente parte, echemos un vistazo a cómo podemos agregar estilos a una aplicación React. Hay varias formas diferentes de hacer esto y veremos los otros métodos más adelante. Al principio, agregaremos CSS a nuestra aplicación a la vieja usanza; en un solo archivo sin usar un [preprocesador CSS](https://developer.mozilla.org/en-US/docs/Glossary/CSS_preprocessor) (aunque esto no es del todo cierto como veremos más adelante).

Agreguemos un nuevo archivo <i>index.css</i> en el directorio <i>src</i> y luego agréguelo a la aplicación importándolo en el archivo <i>index.js</i>:

```js
import './index.css'
```

Agreguemos la siguiente regla CSS al archivo <i>index.css</i>:

```css
h1 {
  color: green;
}
```

Las reglas CSS se componen de <i>selectores</i> y <i>declaraciones</i>. El selector define a qué elementos se debe aplicar la regla. El selector de arriba es <i>h1</i>, que coincidirá con todas las etiquetas de encabezado <i>h1</i> en nuestra aplicación.

La declaración establece la propiedad _color_ en el valor <i>green</i>.

Una regla CSS puede contener un número arbitrario de propiedades. Modifiquemos la regla anterior para convertir el texto en cursiva, definiendo el estilo de fuente como <i>italic</i>:

```css
h1 {
  color: green;
  font-style: italic;  // highlight-line
}
```

Hay muchas formas de hacer coincidir elementos usando [diferentes tipos de selectores CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors).

Si quisiéramos apuntar, digamos, a cada una de las notas con nuestros estilos, podríamos usar el selector <i>li</i>, ya que todas las notas están envueltas dentro de las etiquetas <i>li</i>:

```js
const Note = ({ note, toggleImportance }) => {
  const label = note.important 
    ? 'make not important' 
    : 'make important';

  return (
    <li>
      {note.content} 
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}
```

Agreguemos la siguiente regla a nuestra hoja de estilo (ya que mi conocimiento de diseño web elegante es cercano a cero, los estilos no tienen mucho sentido):

```css
li {
  color: grey;
  padding-top: 3px;
  font-size: 15px;
}
```

El uso de tipos de elementos para definir reglas CSS es un poco problemático. Si nuestra aplicación contuviera otras etiquetas <i>li</i>, también se les aplicaría la misma regla de estilo.

Si queremos aplicar nuestro estilo específicamente a las notas, entonces es mejor usar [selectores de clases](https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors).

En HTML normal, las clases se definen como el valor del atributo <i>class</i>:

```html
<li class="note">some text...</li>
```

En React tenemos para usar el atributo [className](https://reactjs.org/docs/dom-elements.html#classname) en lugar del atributo de clase. Con esto en mente, hagamos los siguientes cambios en nuestro componente <i>Note</i>:

```js
const Note = ({ note, toggleImportance }) => {
  const label = note.important 
    ? 'make not important' 
    : 'make important';

  return (
    <li className='note'> // highlight-line
      {note.content} 
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}
```
Los selectores de clase se definen con la sitaxis _.classname_:

```css
.note {
  color: grey;
  padding-top: 5px;
  font-size: 15px;
}
```

Si ahora agrega otros elementos <i>li</i> a la aplicación, no se verán afectados por la regla de estilo anterior.

### Mensaje de error mejorado

Anteriormente implementamos el mensaje de error que se mostraba cuando el usuario intentaba cambiar la importancia de una nota eliminada con el método <em>alert</em>. Implementemos el mensaje de error como su propio componente React.

El componente es bastante simple: 

```js
const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}
```

Si el valor del prop <em>message</em> es <em>null</em>, no se muestra nada en la pantalla y, en otros casos, el mensaje se representa dentro de un elemento div.

Agreguemos un nuevo estado llamado <i>errorMessage</i> al componente <i>App</i>. Inicialicemos con algún mensaje de error para que podamos probar inmediatamente nuestro componente:

```js
const App = () => {
  const [notes, setNotes] = useState([]) 
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('some error happened...') // highlight-line

  // ...

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} /> // highlight-line
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>      
      // ...
    </div>
  )
}
```

Entonces agreguemos una regla de estilo que se adapte a un mensaje de error:

```css
.error {
  color: red;
  background: lightgrey;
  font-size: 20px;
  border-style: solid;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
}
```

Ahora estamos listos para agregar la lógica para mostrar el mensaje de error. Cambiemos la función <em>toggleImportanceOf</em> de la siguiente manera:

```js
  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(changedNote).then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(error => {
        // highlight-start
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        // highlight-end
        setNotes(notes.filter(n => n.id !== id))
      })
  }
```

Cuando ocurre el error, agregamos un mensaje de error descriptivo al estado <em>errorMessage</em>. Al mismo tiempo, iniciamos un temporizador que establecerá el estado de <em>errorMessage</em> en <em>null</em> después de cinco segundos.

El resultado se ve así:

![](../../images/2/26e.png)

El código para el estado actual de nuestra aplicación se puede encontrar en la rama <i>part2-7</i> en [github](https://github.com/fullstack-hy2020/part2-notes/tree/part2-7).

### Estilos en línea 

React también hace posible escribir estilos directamente en el código como los llamados [estilos en línea](https://react-cn.github.io/react/tips/inline-styles.html).

La idea detrás de la definición de estilos en línea es extremadamente simple. Cualquier componente o elemento de React puede recibir un conjunto de propiedades CSS como un objeto JavaScript a través del atributo [style](https://reactjs.org/docs/dom-elements.html#style).

Las reglas de CSS se definen de forma ligeramente diferente en JavaScript que en los archivos CSS normales. Digamos que queremos darle a algún elemento el color verde y la fuente en cursiva que tiene un tamaño de 16 píxeles. En CSS, se vería así:

```css
{
  color: green;
  font-style: italic;
  font-size: 16px;
}
```

Pero como un objeto de estilo en línea de React se vería así:

```js
 {
  color: 'green',
  fontStyle: 'italic',
  fontSize: 16
}
```

Cada propiedad CSS se define como una propiedad separada del objeto JavaScript. Los valores numéricos de los píxeles se pueden definir simplemente como números enteros. Una de las principales diferencias en comparación con el CSS normal es que las propiedades CSS con guiones (kebab case) están escritas en camelCase.

A continuación, podríamos agregar un "bloque inferior" a nuestra aplicación creando un componente <i>Footer</i> y definir los siguientes estilos en línea para él:

```js
// highlight-start
const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }

  return (
    <div style={footerStyle}>
      <br />
      <em>Note app, Department of Computer Science, University of Helsinki 2020</em>
    </div>
  )
}
// highlight-end

const App = () => {
  // ...

  return (
    <div>
      <h1>Notes</h1>

      <Notification message={errorMessage} />

      // ...  

      <Footer /> // highlight-line
    </div>
  )
}
```

Los estilos en línea tienen ciertas limitaciones. Por ejemplo, las llamadas [pseudoclases](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes) no se pueden usar directamente.

Los estilos en línea y algunas de las otras formas de agregar estilos a los componentes de React van completamente en contra de las viejas convenciones. Tradicionalmente, se ha considerado la mejor práctica para separar completamente CSS del contenido (HTML) y la funcionalidad (JavaScript). Según esta vieja escuela de pensamiento, el objetivo era escribir CSS, HTML y JavaScript en sus archivos separados.

La filosofía de React es, de hecho, el polo opuesto a esto. Dado que la separación de CSS, HTML y JavaScript en archivos separados no pareció escalar bien en aplicaciones más grandes, React basa la división de la aplicación en las líneas de sus entidades funcionales lógicas.

Las unidades estructurales que componen las entidades funcionales de la aplicación son componentes de React. Un componente de React define el HTML para estructurar el contenido, las funciones de JavaScript para determinar la funcionalidad y también el estilo del componente; todo en un lugar. Esto es para crear componentes individuales que sean lo más independientes y reutilizables como sea posible.

El código de la versión final de nuestra aplicación se puede encontrar en la rama <i>part2-8</i> en [github](https://github.com/fullstack-hy2020/part2-notes/tree/part2-8).

</div> 

<div class="tasks">

<h3>Ejercicios 2.19.-2.20.</h3>

<h4>2.19: Guía telefónica paso11 </h4>

Utilice el ejemplo de [mensaje de error mejorado](/es/part2/agregando_estilos_a_aplicaciones_react#mensaje-de-error-mejorado) de la parte 2 como guía para mostrar una notificación que dura unos segundos después de que se ejecuta una operación exitosa (se agrega una persona o se cambia un número):

![](../../images/2/27e.png)

<h4>2.20 *: Guía telefónica paso12</h4>

Abra su aplicación en dos navegadores. **Si elimina a una persona en el navegador 1** un momento antes de intentar <i>cambiar el número de teléfono de la persona</i> en el navegador 2, obtendrá el siguiente mensaje de error:

![](../../images/2/29b.png)

Solucione el problema de acuerdo con el ejemplo que se muestra en [promesa y errores](/es​​/part2/alterando_datos_en_el_servidor#promesas-y-errores) en la parte 2. Modifique el ejemplo para que se muestre al usuario un mensaje cuando la operación no se realice correctamente. Los mensajes que se muestran para eventos exitosos y no exitosos deben verse diferentes

![](../../images/2/28e.png)

**Tenga en cuenta** que incluso si maneja la excepción, el mensaje de error se imprime en el consola.

Este fue el último ejercicio de esta parte del curso. Es hora de enviar su código a GitHub y marcar todos sus ejercicios terminados en el [sistema de envío de ejercicios](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

</div>