---
mainImage: ../../../images/part-5.svg
part: 5
letter: c
lang: es
---

<div class="content">

Hay muchas formas diferentes de probar aplicaciones React . Echemos un vistazo a ellos a continuación.

Las pruebas se implementarán con la misma libería de pruebas [Jest](http://jestjs.io/) desarrollada por Facebook que se utilizó en la parte anterior. Jest está configurado de forma predeterminada para las aplicaciones creadas con create-react-app.

Además de Jest, también necesitamos otra librería de prueba que nos ayude a renderizar componentes con fines de prueba. La mejor opción actual para esto es [react-testing-library](https://github.com/testing-library/react-testing-library) que ha experimentado un rápido crecimiento en popularidad en los últimos tiempos.

Instalemos la librería con el comando:

```js
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

Primero escribamos pruebas para el componente que es responsable de renderizar una nota:

```js
const Note = ({ note, toggleImportance }) => {
  const label = note.important
    ? 'make not important'
    : 'make important'

  return (
    <li className='note'> // highlight-line
      {note.content}
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}
```

Observe que el elemento <i>li</i> tiene el [CSS](https://reactjs.org/docs/dom-elements.html#classname) classname <i>note</i>, que se usa para acceder al componente en nuestras pruebas.

### Renderizando el componente para pruebas

Escribiremos nuestra prueba en el archivo <i>src/components/Note.test.js</i>, que está en el mismo directorio que el componente en sí.

La primera prueba verifica que el componente muestra el contenido de la nota:

```js
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import Note from './Note'

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  const component = render(
    <Note note={note} />
  )

  expect(component.container).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )
})
```

Después de la configuración inicial, la prueba renderiza el componente con el método [render](https://testing-library.com/docs/react-testing-library/api#render) proporcionado por el react-testing-library:

```js
const component = render(
  <Note note={note} />
)
```

Normalmente, los componentes de React se procesan en el <i>DOM</i>. El método de renderizado que usamos renderiza los componentes en un formato que es adecuado para pruebas sin renderizarlos al DOM.

_render_ devuelve un objeto que tiene varias [propiedades](https://testing-library.com/docs/react-testing-library/api#render-result). Una de las propiedades se llama <i>container</i> y contiene todo el HTML renderizado por el componente.

En la expectativa, verificamos que el componente muestre el texto correcto, que en este caso es el contenido de la nota:

```js
expect(component.container).toHaveTextContent(
  'Component testing is done with react-testing-library'
)
```

### Pruebas en ejecución

Create-react-app configura las pruebas para que se ejecuten en modo watch de forma predeterminada, lo que significa que el comando _npm test_ no se cerrará una vez que las pruebas hayan finalizado y, en cambio, esperará a que se realicen cambios en el código. Una vez que se guardan los nuevos cambios en el código, las pruebas se ejecutan automáticamente, después de lo cual Jest vuelve a esperar a que se realicen nuevos cambios.

Si desea ejecutar pruebas "normalmente", puede hacerlo con el comando:

```js
CI=true npm test
```

**NB:** la consola puede emitir una advertencia si no ha instalado Watchman. Watchman es una aplicación desarrollada por Facebook que observa los cambios que se realizan en los archivos. El programa acelera la ejecución de las pruebas y al menos a partir de macOS Sierra, ejecutar pruebas en modo watch emite algunas advertencias a la consola, que se pueden eliminar instalando Watchman.

Las instrucciones para instalar Watchman en diferentes sistemas operativos se pueden encontrar en el sitio web oficial de Watchman: https://facebook.github.io/watchman/

### Ubicación del archivo de prueba

En React hay (al menos) [dos convenciones diferentes](https://medium.com/@JeffLombardJr/organizing-tests-in-jest-17fc431ff850) para la ubicación del archivo de prueba. Creamos nuestros archivos de prueba de acuerdo con el estándar actual colocándolos en el mismo directorio que el componente que se está probando.

La otra convención es almacenar los archivos de prueba "normalmente" en su propio directorio separado. Cualquiera que sea la convención que elijamos, es casi seguro que estará equivocada según la opinión de alguien.

Personalmente, no me gusta esta forma de almacenar pruebas y código de aplicación en el mismo directorio. La razón por la que elegimos seguir esta convención es que está configurada de forma predeterminada en las aplicaciones creadas por create-react-app.

### Búsqueda de contenido en un componente

El paquete react-testing-library ofrece muchas formas diferentes de investigar el contenido del componente que se está probando. Ampliemos ligeramente nuestra prueba:

```js
test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  const component = render(
    <Note note={note} />
  )

  // method 1
  expect(component.container).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )

  // method 2
  const element = component.getByText(
    'Component testing is done with react-testing-library'
  )
  expect(element).toBeDefined()

  // method 3
  const div = component.container.querySelector('.note')
  expect(div).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )
})
```

La primera forma usa el método <i>toHaveTextContent</i> para buscar un texto coincidente de todo el código HTML renderizado por el componente. <i>toHaveTextContent</i> es uno de los muchos métodos de "emparejamiento" que proporciona la biblioteca [jest-dom](https://github.com/testing-library/jest-dom#tohavetextcontent).

La segunda forma utiliza el método [getByText](https://testing-library.com/docs/dom-testing-library/api-queries#bytext) del objeto devuelto por el método render. El método devuelve el elemento que contiene el texto dado. Se produce una excepción si no existe tal elemento. Por esta razón, técnicamente no necesitaríamos especificar ninguna expectativa adicional.

La tercera forma es buscar un elemento específico que el componente representa con el método [querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector) que recibe un [Selector de CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors) como parámetro.

<!-- Kaksi viimeistä tapaa siis hakevat metodien <i> getByText </i> ja <i> querySelector </i> avulla renderöidystä komponentista jonkin ehdon täyttävän elementin. Vastaavalla periaatteella toimivia "query" -metodeja, en tarjolla [lukuisia] (https://testing-library.com/docs/dom-testing-library/api-queries). -->
Los dos últimos métodos utilizan los métodos <i>getByText</i> y <i>querySelector</i> para encontrar un elemento que coincida con alguna condición del componente renderizado.
Hay numerosos métodos de consulta similares [disponibles](https://testing-library.com/docs/dom-testing-library/api-queries).

### Pruebas de depuración

Normalmente nos encontramos con muchos tipos diferentes de problemas al escribir nuestras pruebas.

El objeto devuelto por el método render tiene un método [debug](https://testing-library.com/docs/react-testing-library/api#debug) que se puede utilizar para imprimir el HTML renderizado por el componente en el consola. Probemos esto haciendo los siguientes cambios en nuestro código:

```js
test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  const component = render(
    <Note note={note} />
  )

  component.debug() // highlight-line

  // ...
})
```

Podemos ver el HTML generado por el componente en la consola:

```js
console.log node_modules/@testing-library/react/dist/index.js:90
  <body>
    <div>
      <li
        class="note"
      >
        Component testing is done with react-testing-library
        <button>
          make not important
        </button>
      </li>
    </div>
  </body>
```

También es posible buscar una parte más pequeña del componente e imprimir su código HTML. Para hacer esto, necesitamos el método _prettyDOM_ que se puede importar desde el paquete <i>@testing-library/dom</i> que se instala automáticamente con react-testing-library:

```js
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'  // highlight-line
import Note from './Note'

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  const component = render(
    <Note note={note} />
  )
  const li = component.container.querySelector('li')
  
  console.log(prettyDOM(li)) // highlight-line
})
```

Usamos el selector para encontrar el elemento <i>li</i> dentro del componente, e imprimir su HTML en la consola:

```js
console.log src/components/Note.test.js:21
  <li
    class="note"
  >
    Component testing is done with react-testing-library
    <button>
      make not important
    </button>
  </li>
```

### Hacer clic en los botones en las pruebas

Además de mostrar el contenido, el componente <i>Note</i> también se asegura de que cuando se presiona el botón asociado con la nota, se llama a la función del controlador de eventos _toggleImportance_.

La prueba de esta funcionalidad se puede lograr así:

```js
import React from 'react'
import { render, fireEvent } from '@testing-library/react' // highlight-line
import { prettyDOM } from '@testing-library/dom'
import Note from './Note'

// ...

test('clicking the button calls event handler once', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  const mockHandler = jest.fn()

  const component = render(
    <Note note={note} toggleImportance={mockHandler} />
  )

  const button = component.getByText('make not important')
  fireEvent.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)
})
```

Hay algunas cosas interesantes relacionadas con esta prueba. El controlador de eventos es la función [mock](https://facebook.github.io/jest/docs/en/mock-functions.html) definida con Jest:

```js
const mockHandler = jest.fn()
```

La prueba encuentra el botón <i>basado en el texto</i> del componente renderizado y hace clic en el elemento:

```js
const button = component.getByText('make not important')
fireEvent.click(button)
```

El clic ocurre con el método [fireEvent](https://testing-library.com/docs/api-events#fireevent).

La expectativa de la prueba verifica que la <i>función simulada</i> se haya llamado exactamente una vez.

```js
expect(mockHandler.mock.calls).toHaveLength(1)
```

[Objetos y funciones simulados](https://en.wikipedia.org/wiki/Mock_object) son componentes de código auxiliar de uso común en las pruebas que se utilizan para reemplazar las dependencias de los componentes que se están probando. Los simulacros permiten devolver respuestas codificadas y verificar el número de veces que se llaman las funciones simuladas y con qué parámetros.

En nuestro ejemplo, la función simulada es una elección perfecta, ya que se puede usar fácilmente para verificar que el método se llame exactamente una vez.

### Pruebas para el componente <i>Togglable</i>

Escribamos algunas pruebas para el componente <i>Togglable</i>. Agreguemos el nombre de clase CSS <i>togglableContent</i> al div que devuelve los componentes secundarios.

```js
const Togglable = React.forwardRef((props, ref) => {
  // ...

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>
          {props.buttonLabel}
        </button>
      </div>
      <div style={showWhenVisible} className="togglableContent"> // highlight-line
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
})
```

Las pruebas se muestran a continuación:

```js
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Togglable from './Togglable'

describe('<Togglable />', () => {
  let component

  beforeEach(() => {
    component = render(
      <Togglable buttonLabel="show...">
        <div className="testDiv" />
      </Togglable>
    )
  })

  test('renders its children', () => {
    expect(
      component.container.querySelector('.testDiv')
    ).toBeDefined()
  })

  test('at start the children are not displayed', () => {
    const div = component.container.querySelector('.togglableContent')

    expect(div).toHaveStyle('display: none')
  })

  test('after clicking the button, children are displayed', () => {
    const button = component.getByText('show...')
    fireEvent.click(button)

    const div = component.container.querySelector('.togglableContent')
    expect(div).not.toHaveStyle('display: none')
  })

})
```

La función _beforeEach_ se llama antes de cada prueba, que luego convierte el componente <i>Togglable</i> en la variable _component_.

La primera prueba verifica que el componente <i>Togglable</i> representa su componente hijo `<div className="testDiv" />`.

Las pruebas restantes utilizan el método [toHaveStyle](https://www.npmjs.com/package/@testing-library/jest-dom#tohavestyle) para verificar que el componente secundario del componente <i>Togglable</i> no es visible inicialmente, comprobando que el estilo del elemento <i>div</i> contiene `{ display: 'none' }`. Otra prueba verifica que cuando se presiona el botón, el componente es visible, lo que significa que el estilo para ocultar el componente <i>ya no está</i> asignado al componente.

El botón se busca una vez más según el texto que contiene. El botón podría haberse ubicado también con la ayuda de un selector de CSS:

```js
const button = component.container.querySelector('button')
```

El componente contiene dos botones, pero como [querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector) devuelve el <i>primer</i> botón de coincidencia, suceda que obtenemos el botón que queríamos.

Agreguemos también una prueba que se puede utilizar para verificar que el contenido visible se puede ocultar haciendo clic en el segundo botón del componente:

```js
test('toggled content can be closed', () => {
  const button = component.container.querySelector('button')
  fireEvent.click(button)

  const closeButton = component.container.querySelector(
    'button:nth-child(2)'
  )
  fireEvent.click(closeButton)

  const div = component.container.querySelector('.togglableContent')
  expect(div).toHaveStyle('display: none')
})
```

Definimos un selector que devuelve el segundo botón `button:nth-child(2)`. No es un acierto depender del orden de los botones en el componente, y se recomienda buscar los elementos en función de su texto:

```js
test('toggled content can be closed', () => {
  const button = component.getByText('show...')
  fireEvent.click(button)

  const closeButton = component.getByText('cancel')
  fireEvent.click(closeButton)

  const div = component.container.querySelector('.togglableContent')
  expect(div).toHaveStyle('display: none')
})
```

El método _getByText_ que usamos es solo una de las muchas [consultas](https://testing-library.com/docs/api-queries#queries) que ofrece <i>react-testing-library</i>.

### Probando los formularios

<!-- Käytimme jo edellisissä testeissä [fireEvent] (https://testing-library.com/docs/api-events#fireevent) -funktiota nappien klikkaamiseen: -->
Ya usamos la función [fireEvent](https://testing-library.com/docs/api-events#fireevent) en nuestras pruebas anteriores para hacer clic en los botones.

```js
const button = component.getByText('show...')
fireEvent.click(button)
```

<!-- Käytännössä siis loimme <i> fireEventin </i> avulla tapahtuman <i> haga clic </ i> nappia vastaavalle komponentille. Voimme myös simuloida lomakkeisiin kirjoittamista < i> fireEventin </i> avulla. -->
En la práctica, usamos <i>fireEvent</i> para crear un evento <i>click</i> para el componente de botón.
También podemos simular la entrada de texto con <i>fireEvent</i>.

<!-- Tehdään testi komponentille <i> NoteForm </i>. Lomakkeen koodi näyttää seuraavalta -->
Hagamos una prueba para el componente <i>NoteForm</i>. El código del componente es el siguiente:

```js
import React, { useState } from 'react'

const NoteForm = ({ createNote }) => {
  const [newNote, setNewNote] = useState('')

  const handleChange = (event) => {
    setNewNote(event.target.value)
  }

  const addNote = (event) => {
    event.preventDefault()
    createNote({
      content: newNote,
      important: Math.random() > 0.5,
    })

    setNewNote('')
  }

  return (
    <div className="formDiv"> // highlight-line
      <h2>Create a new note</h2>

      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleChange}
        />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default NoteForm
```

<!-- Lomakkeen toimintaperiaatteena en kutsua sille propsina välitettyä funktiota _createNote_ uuden muistiinpanon tiedot parametrina. -->
El formulario funciona llamando a la función _createNote_ que recibió como props con los detalles de la nueva nota.

<!-- Testi en seuraavassa: -->
La prueba es la siguiente:

```js
import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import NoteForm from './NoteForm'

test('<NoteForm /> updates parent state and calls onSubmit', () => {
  const createNote = jest.fn()

  const component = render(
    <NoteForm createNote={createNote} />
  )

  const input = component.container.querySelector('input')
  const form = component.container.querySelector('form')

  fireEvent.change(input, { 
    target: { value: 'testing of forms could be easier' } 
  })
  fireEvent.submit(form)

  expect(createNote.mock.calls).toHaveLength(1)
  expect(createNote.mock.calls[0][0].content).toBe('testing of forms could be easier' )
})
```

<!-- Syötekenttään <i> input </i> kirjoittamista simuloidaan tekemällä syötekenttään tapahtuma <i> change </ i > ja määrittelemällä sopiva olio, joka määrittelee syötekenttään 'kirjoitetun' sisällön. -->
Podemos simular la escritura en los campos <i>input</i> creando un evento <i>change</i> en ellos y definiendo un objeto, que contiene el texto 'escrito' en el campo.

<!-- Lomake lähetetään simuloimalla tapahtuma <i> enviar </i> lomakkeelle. -->
El formulario se envía simulando el evento <i>submit</i> al formulario.

<!-- Testin ensimmäinen ekspektaatio varmistaa, että lomakkeen lähetys en aikaansaanut tapahtumankäsittelijän _createNote_ kutsumisen. Toinen ekspektaatio tarkistaa, että tapahtumankäsittelijää kutsutaan oikealla parametrilla, eli että luoduksi tulee saman sisältöinen muistiinpano kuin lomakkeelle kirjoitetaan. -->
La primera expectativa de prueba asegura que al enviar el formulario se llama al método _createNote_.
La segunda expectativa verifica que se llame al controlador de eventos con los parámetros correctos, que se cree una nota con el contenido correcto cuando se complete el formulario.

### Cobertura de prueba

<!-- [Testauskattavuus] (https://github.com/facebookincubator/create-react-app/blob/ed5c48c81b2139b4414810e1efe917e04c96ee8d/packages/react-scripts/template/README.md#coverage-reporting selanitollaville) saada testor -->
Podemos encontrar fácilmente la [cobertura](https://github.com/facebookincubator/create-react-app/blob/ed5c48c81b2139b4414810e1efe917e04c96ee8d/packages/react-scripts/template/README.md#coverage-reporting)
de nuestras pruebas ejecutándolas con el comando

```js
CI=true npm test -- --coverage
```

![](../../images/5/18ea.png)

<!-- Melko primitiivinen HTML-muotoinen raportti generoituu hakemistoon <i> cobertura / informe-lcov </i>. HTML-muotoinen raportti kertoo mm. yksittäisen komponenttien testaamattomat koodirivit: -->
Se generará un informe HTML bastante primitivo en el directorio <i>coverage/lcov-report</i>.
El informe nos dirá, por ejemplo, las líneas de código no probado en cada componente:

![](../../images/5/19ea.png)

Puede encontrar el código para nuestra aplicación actual en su totalidad en la rama <i>part5-8 </i> de [este repositorio de Github](https://github.com/fullstack-hy2020/part2-notes/tree/part5-8).

</div>

<div class="tasks">

### Ejercicios 5.13.-5.16.

#### 5.13: Pruebas de listas de blogs, paso 1

<!-- Tee testi, joka varmistaa että blogin näyttävä komponentti renderöi blogin titlen, authorin mutta ei renderöi oletusarvoisesti urlia eikä likejen määrää. -->
Realice una prueba que verifique que el componente que muestra un blog muestre el título y el autor del blog, pero no muestre su URL o el número de likes por defecto

<!-- Lisää komponenttiin tarvittaessa testausta helpottavia CSS-luokkia. -->
Agregue clases de CSS al componente para ayudar con las pruebas según sea necesario.

#### 5.14*: Pruebas de lista de blogs, paso 2

<!-- Tee testi, joka varmistaa että myös url ja likejen määrä näytetään kun blogin kaikki tiedot näyttävää nappia on painettu. -->
Realice una prueba que verifique que la URL del blog y el número de likes se muestran cuando se hace clic en el botón que controla los detalles mostrados.

#### 5.15*: Pruebas de lista de blogs, paso 3

<!-- Tee testi, joka varmistaa, että jos komponentin <i> like </i> -nappia painetaan kahdesti, komponentin propsina saamaa tapahtumankäsittelijäfunktiota kutsutaan kaksi kertaa. -->
Realice una prueba que garantice que si se hace clic dos veces en el botón <i>like</i>, se llama dos veces al controlador de eventos que el componente recibió como accesorios.

#### 5.16*: Pruebas de lista de blogs, paso 4

<!-- Tee uuden blogin luomisesta huolehtivalle lomakkelle testi, joka varmistaa, että lomake kutsuu propseina saamaansa takaisinkutsufunktiota oikeilla tiedoilla siinä vaiheessa kun blogi luodaan. -->
Haga una prueba para el nuevo formulario de blog. La prueba debe verificar que el formulario llama al controlador de eventos que recibió como accesorios con los detalles correctos cuando se crea un nuevo blog.

<!-- Jos esim. määrittelet <i> input </i> -elementille id: n 'author': -->
Si, por ejemplo, establece el atributo id de un elemento <i>input</i> como 'author':

```js
<input
  id='author'
  value={author}
  onChange={() => {}}
/>
```

<!-- saat haettua kentän testissä seuraavasti -->
Puede acceder al contenido del campo con

```js
const author = component.container.querySelector('#author')
```

</div>

<div class="content">

En la parte anterior del material del curso, escribimos pruebas de integración para el backend que probaron su lógica y conectaron la base de datos a través de la API proporcionada por el backend. Al escribir estas pruebas, tomamos la decisión consciente de no escribir pruebas unitarias, ya que el código para ese backend es bastante simple, y es probable que los errores en nuestra aplicación ocurran en escenarios más complicados de los que las pruebas unitarias son adecuadas.

Hasta ahora, todas nuestras pruebas para el frontend han sido pruebas unitarias que han validado el correcto funcionamiento de componentes individuales. Las pruebas unitarias son útiles a veces, pero incluso un conjunto completo de pruebas unitarias no es suficiente para validar que la aplicación funciona como un todo.

<!-- Voisimme tehdä myös frontendille useiden komponenttien yhteistoiminnallisuutta testaavia integraatiotestejä, mutta se on oleellisesti yksikkötestausta hankalampaa, sillä itegraatiotesteissä jouduttaisiin ottamaan kantaa mm. palvelimelta haettavan datan mockaamiseen. Päätämmekin keskittyä koko sovellusta testaavien de un extremo a otro -testien tekemiseen, jonka parissa jatkamme tämän osan viimeisessä jaksossa. -->
También podríamos realizar pruebas de integración para el frontend. Las pruebas de integración prueban la colaboración de múltiples componentes. Es considerablemente más difícil que las pruebas unitarias, ya que tendríamos que simular datos del servidor, por ejemplo.
Elegimos concentrarnos en hacer pruebas de extremo a extremo para probar toda la aplicación, en la que trabajaremos en el último capítulo de esta parte.

### Prueba de instantáneas

Jest ofrece una alternativa completamente diferente a las pruebas "tradicionales" llamadas pruebas de [instantánea](https://facebook.github.io/jest/docs/en/snapshot-testing.html). La característica interesante de las pruebas de instantáneas es que los desarrolladores no necesitan definir ninguna prueba ellos mismos, simplemente es suficiente adoptar las pruebas de instantáneas.

El principio fundamental es comparar el código HTML definido por el componente después de que haya cambiado con el código HTML que existía antes de que se cambiara.

Si la instantánea nota algún cambio en el HTML definido por el componente, entonces es una nueva funcionalidad o un "error" causado por accidente. Las pruebas instantáneas notifican al desarrollador si cambia el código HTML del componente. El desarrollador tiene que decirle a Jest si el cambio fue deseado o no. Si el cambio en el código HTML es inesperado, implica fuertemente un error y el desarrollador puede darse cuenta de estos problemas potenciales fácilmente gracias a las pruebas de instantáneas.

</div>
