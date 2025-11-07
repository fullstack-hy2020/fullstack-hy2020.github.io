---
mainImage: ../../../images/part-5.svg
part: 5
letter: b
lang: es
---

<div class="content">

### Mostrando el formulario de inicio de sesión solo cuando sea apropiado

Modifiquemos la aplicación para que el formulario de inicio de sesión no se muestre por defecto:

![navegador mostrando botón de login por defecto](../../images/5/10e.png)

El formulario de inicio de sesión aparece cuando el usuario presiona el botón <i>login</i>:

![usuario en vista de formulario de login a punto de presionar el botón cancel](../../images/5/11e.png)

El usuario puede cerrar el formulario de inicio de sesión haciendo clic en el botón <i>cancel</i>.

Comencemos extrayendo el formulario de inicio de sesión en su propio componente:

```js
const LoginForm = ({
   handleSubmit,
   handleUsernameChange,
   handlePasswordChange,
   username,
   password
  }) => {
  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          username
          <input
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
      </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm
```

El estado y todas las funciones relacionadas con él se definen fuera del componente y se pasan al componente como props.

Ten en cuenta que los props se asignan a las variables mediante la <i>desestructuración</i>, lo que significa que en lugar de escribir:

```js
const LoginForm = (props) => {
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={props.handleSubmit}>
        <div>
          username
          <input
            value={props.username}
            onChange={props.handleChange}
            name="username"
          />
        </div>
        // ...
        <button type="submit">login</button>
      </form>
    </div>
  )
}
```

donde se accede a las propiedades del objeto _props_ mediante, por ejemplo, _props.handleSubmit_, las propiedades se asignan directamente a sus propias variables.

Una forma rápida de implementar la funcionalidad es cambiar la función _loginForm_ del componente <i>App</i> así:

```js
const App = () => {
  const [loginVisible, setLoginVisible] = useState(false) // highlight-line

  // ...

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  // ...
}
```

El estado del componente <i>App</i> ahora contiene el booleano <i>loginVisible</i>, que define si el formulario de inicio de sesión se debe mostrar al usuario o no.

El valor de loginVisible se alterna con dos botones. Ambos botones tienen sus controladores de eventos definidos directamente en el componente:

```js
<button onClick={() => setLoginVisible(true)}>log in</button>

<button onClick={() => setLoginVisible(false)}>cancel</button>
```

La visibilidad del componente se define dándole al componente una regla de estilo [en línea](/es/part2/agregar_estilos_a_la_aplicacion_react#estilos-en-linea), donde el valor de la propiedad [display](https://developer.mozilla.org/es/docs/Web/CSS/display) es <i>none</i> si no queremos que se muestre el componente:

```js
const hideWhenVisible = { display: loginVisible ? 'none' : '' }
const showWhenVisible = { display: loginVisible ? '' : 'none' }

<div style={hideWhenVisible}>
  // button
</div>

<div style={showWhenVisible}>
  // button
</div>
```

Una vez más estamos utilizando el operador ternario "signo de interrogación". Si _loginVisible_ es <i>true</i>, entonces la regla CSS del componente será:

```css
display: 'none';
```

Si _loginVisible_ es <i>false</i>, entonces <i>display</i> no recibirá ningún valor relacionado con la visibilidad del componente.

### Los componentes hijos, también conocidos como props.children

El código relacionado con la gestión de la visibilidad del formulario de inicio de sesión podría considerarse su propia entidad lógica, y por esta razón, sería bueno extraerlo del componente <i>App</i> en su propio componente independiente.

Nuestro objetivo es implementar un nuevo componente <i>Togglable</i> que se pueda usar de la siguiente manera:

```js
<Togglable buttonLabel='login'>
  <LoginForm
    username={username}
    password={password}
    handleUsernameChange={({ target }) => setUsername(target.value)}
    handlePasswordChange={({ target }) => setPassword(target.value)}
    handleSubmit={handleLogin}
  />
</Togglable>
```

La forma en que se utiliza el componente es ligeramente diferente a la de nuestros componentes anteriores. El componente tiene etiquetas de apertura y cierre que rodean un componente <i>LoginForm</i>. En la terminología de React, <i>LoginForm</i> es un componente hijo de <i>Togglable</i>.

Podemos agregar cualquier elemento de React que queramos entre las etiquetas de apertura y cierre de <i>Togglable</i>, como este, por ejemplo:

```js
<Togglable buttonLabel="reveal">
  <p>this line is at start hidden</p>
  <p>also this is hidden</p>
</Togglable>
```

El código para el componente <i>Togglable</i> se muestra a continuación:

```js
import { useState } from 'react'

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
}

export default Togglable
```

La parte nueva e interesante del código es [props.children](https://es.react.dev/learn/passing-props-to-a-component#passing-jsx-as-children), que se utiliza para hacer referencia a los componentes hijos del componente. Los componentes hijos son los elementos de React que definimos entre las etiquetas de apertura y cierre de un componente.

Esta vez, los hijos son renderizados en el código que se utiliza para renderizar el componente en sí:

```js
<div style={showWhenVisible}>
  {props.children}
  <button onClick={toggleVisibility}>cancel</button>
</div>
```

A diferencia de los props "normales" que hemos visto antes, React agrega automáticamente <i>children</i> y siempre existe. Si un componente se define con una etiqueta _/>_ de cierre automático, como esta:

```js
<Note
  key={note.id}
  note={note}
  toggleImportance={() => toggleImportanceOf(note.id)}
/>
```

Entonces props.children es un array vacío.

El componente <i>Togglable</i> es reutilizable y podemos usarlo para agregar una funcionalidad de alternancia de visibilidad similar al formulario que se usa para crear nuevas notas.

Antes de hacer eso, extraigamos el formulario para crear notas en su propio componente:

```js
const NoteForm = ({ onSubmit, handleChange, value}) => {
  return (
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={onSubmit}>
        <input
          value={value}
          onChange={handleChange}
        />
        <button type="submit">save</button>
      </form>
    </div>
  )
}
```

A continuación, definamos el componente de formulario dentro de un componente <i>Togglable</i>:

```js
<Togglable buttonLabel="new note">
  <NoteForm
    onSubmit={addNote}
    value={newNote}
    handleChange={handleNoteChange}
  />
</Togglable>
```

Puedes encontrar el código para nuestra aplicación actual en su totalidad en la rama <i>part5-4</i> de [este repositorio de GitHub](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-4).

### Estado de los formularios

El estado de la aplicación se encuentra actualmente en el componente _App_.

La documentación de React dice lo [siguiente](https://es.react.dev/learn/sharing-state-between-components) sobre dónde colocar el estado:

<i>A veces, quieres que el estado de dos componentes cambie siempre al mismo tiempo. Para hacerlo, elimina el estado de ambos, muévelo al componente padre más cercano que tengan en común, y luego pásalo a ellos a través de props. Esto se conoce como "elevar el estado", y es una de las cosas más comunes que harás al escribir código React.</i>

Si pensamos en el estado de los formularios, por ejemplo, el contenido de una nueva nota antes de que se haya creado, el componente _App_ no lo necesita para nada.
También podríamos mover el estado de los formularios a los componentes correspondientes.

El componente para crear una nueva nota cambia así:

```js
import { useState } from 'react'

const NoteForm = ({ createNote }) => {
  const [newNote, setNewNote] = useState('')

  const addNote = (event) => {
    event.preventDefault()
    createNote({
      content: newNote,
      important: true
    })

    setNewNote('')
  }

  return (
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={event => setNewNote(event.target.value)}
        />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default NoteForm
```

**NOTA:** Al mismo tiempo, cambiamos el comportamiento de la aplicación para que las nuevas notas sean importantes por defecto, es decir, el campo <i>important</i> obtiene el valor <i>true</i>.

La variable de estado <i>newNote</i>  y el controlador de eventos responsable de cambiarlo se han movido del componente _App_ al componente responsable del formulario de la nota.

Solo queda un prop, la función _createNote_, que el formulario llama cuando se crea una nueva nota.

El componente _App_ se vuelve más simple ahora que nos hemos deshecho del estado <i>newNote</i> y su controlador de eventos.
La función _addNote_ para crear nuevas notas recibe una nueva nota como parámetro, y la función es el único prop que enviamos al formulario:

```js
const App = () => {
  // ...
  const addNote = (noteObject) => { // highlight-line
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
      })
  }
  // ...
  const noteForm = () => (
    <Togglable buttonLabel='new note'>
      <NoteForm createNote={addNote} />
    </Togglable>
  )

  // ...
}
```

Podríamos hacer lo mismo con el formulario de inicio de sesión, pero lo dejaremos para un ejercicio opcional.

El código de la aplicación se puede encontrar en [GitHub](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-5), rama <i>part5-5</i>.

### Referencias a componentes con ref

Nuestra implementación actual es bastante buena, pero tiene un aspecto que podría mejorarse.

Después de crear una nueva nota, tendría sentido ocultar el formulario de nueva nota. Actualmente, el formulario permanece visible. Hay un pequeño problema al ocultarlo, la visibilidad se controla con la variable <i>visible</i> dentro del componente <i>Togglable</i>.

Una solución a esto sería mover el control del estado del componente Togglable fuera del componente. Sin embargo, no lo haremos ahora, porque queremos que el componente sea responsable de su propio estado. Por lo tanto, tenemos que encontrar otra solución y hallar un mecanismo para cambiar el estado del componente externamente.

Hay varias formas diferentes de implementar el acceso a las funciones de un componente desde fuera del componente, pero usemos el mecanismo de [ref](https://es.react.dev/learn/referencing-values-with-refs) de React, que ofrece una referencia al componente.

Hagamos los siguientes cambios en el componente <i>App</i>:

```js
import { useState, useEffect, useRef } from 'react' // highlight-line

const App = () => {
  // ...
  const noteFormRef = useRef() // highlight-line

  const noteForm = () => (
    <Togglable buttonLabel='new note' ref={noteFormRef}>  // highlight-line
      <NoteForm createNote={addNote} />
    </Togglable>
  )

  // ...
}
```

El hook [useRef](https://es.react.dev/reference/react/useRef) se utiliza para crear una referencia <i>noteFormRef</i>, que se asigna al componente <i>Togglable</i> que contiene el formulario para crear la nota. La variable <i>noteFormRef</i> actúa como referencia al componente. Este hook asegura que se mantenga la misma referencia (ref) en todas las re-renderizaciones del componente.

También realizamos los siguientes cambios en el componente <i>Togglable</i>:

```js
import { useState, forwardRef, useImperativeHandle } from 'react' // highlight-line

const Togglable = forwardRef((props, refs) => { // highlight-line
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

// highlight-start
  useImperativeHandle(refs, () => {
    return {
      toggleVisibility
    }
  })
// highlight-end

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
})  // highlight-line

export default Togglable
```

La función que crea el componente está envuelta dentro de una llamada a la función [forwardRef](https://es.react.dev/reference/react/forwardRef). De esta manera el componente puede acceder a la referencia que le fue asignada.

El componente usa el hook [useImperativeHandle](https://es.react.dev/reference/react/useImperativeHandle) para que su función <i>toggleVisibility</i> esté disponible fuera del componente.

Ahora podemos ocultar el formulario llamando a <i>noteFormRef.current.toggleVisibility()</i> después de que se haya creado una nueva nota:

```js
const App = () => {
  // ...
  const addNote = (noteObject) => {
    noteFormRef.current.toggleVisibility() // highlight-line
    noteService
      .create(noteObject)
      .then(returnedNote => {     
        setNotes(notes.concat(returnedNote))
      })
  }
  // ...
}
```

En resumen, la función [useImperativeHandle](https://es.react.dev/reference/react/useImperativeHandle) es un hook de React, que se usa para definir funciones en un componente que se pueden invocar desde fuera del componente.

Este truco funciona para cambiar el estado de un componente, pero parece un poco desagradable. Podríamos haber logrado la misma funcionalidad con código un poco más limpio usando los "viejos" componentes de clase de React. Analizaremos estos componentes de clase durante la parte 7 del material del curso. Hasta ahora, esta es la única situación en la que el uso de hooks de React conduce a un código que no es más limpio que con los componentes de clase.

También [hay otros casos de uso](https://es.react.dev/learn/manipulating-the-dom-with-refs) para las refs además de acceder a los componentes de React.

Puedes encontrar el código para nuestra aplicación actual en su totalidad en la rama <i>part5-6</i> de [este repositorio de GitHub](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-6).

### Un punto sobre los componentes

Cuando definimos un componente en React:

```js
const Togglable = () => ...
  // ...
}
```

Y lo usamos así:

```js
<div>
  <Togglable buttonLabel="1" ref={togglable1}>
    first
  </Togglable>

  <Togglable buttonLabel="2" ref={togglable2}>
    second
  </Togglable>

  <Togglable buttonLabel="3" ref={togglable3}>
    third
  </Togglable>
</div>
```

Creamos <i>tres instancias separadas del componente</i> que tienen su propio estado separado:

![tres componentes togglable en el navegador](../../images/5/12e.png)

El atributo <i>ref</i> se utiliza para asignar una referencia a cada uno de los componentes en las variables <i>togglable1</i>, <i>togglable2</i> y <i>togglable3</i>.

### El juramento actualizado del desarrollador full stack

El número de componentes aumenta. Al mismo tiempo, aumenta la probabilidad de encontrarnos en una situación en la que buscamos un error en el lugar equivocado. Por lo tanto, necesitamos ser aún más sistemáticos.

Entonces, debemos extender una vez más nuestro juramento:

El desarrollo full stack es <i>extremadamente difícil</i>, por eso utilizaré todos los medios posibles para hacerlo lo más fácil posible

- Mantendré abierta la consola de desarrollo del navegador todo el tiempo
- Utilizaré la pestaña network de las herramientas de desarrollo del navegador para asegurarme de que el frontend y el backend estén comunicándose como espero
- Mantendré un ojo constantemente en el estado del servidor para asegurarme de que los datos enviados por el frontend se guarden allí como espero
- Mantendré un ojo en la base de datos: ¿el backend guarda los datos allí en el formato correcto?
- Progresaré con pequeños pasos
- <i>cuando sospeche que hay un error en el frontend, me asegurare de que el backend funcione correctamente</i>
- <i>cuando sospeche que hay un error en el backend, me asegurare de que el frontend funcione correctamente</i>
- Escribiré muchos _console.log_ para asegurarme de entender cómo se comportan el código y las pruebas y para ayudar a localizar problemas
- Si mi código no funciona, no escribiré más código. En cambio, empezare a eliminarlo hasta que funcione o simplemente regresare a un estado en el que todo funcionaba
- Si una prueba no pasa, me asegurare de que la funcionalidad probada funciona correctamente en la aplicación
- Cuando pida ayuda en el canal de Discorddel curso o en cualquier otro lugar, formularé mis preguntas correctamente, consulta [aquí](/es/part0/informacion_general#como-obtener-ayuda-en-discord) cómo pedir ayuda

</div>

<div class="tasks">

### Ejercicios 5.5.-5.11.

#### 5.5 Frontend de la Lista de Blogs, paso 5

Cambia el formulario para crear publicaciones de blog para que solo se muestre cuando sea apropiado. Utiliza una funcionalidad similar a la que se mostró [anteriormente en esta parte del material del curso](/es/part5/props_children_y_proptypes#mostrando-el-formulario-de-inicio-de-sesion-solo-cuando-sea-apropiado). Si lo deseas, puedes utilizar el componente <i>Togglable</i> definido en la parte 5.

Por defecto, el formulario no es visible

![navegador mostrando el botón de nueva nota sin mostrar su formulario](../../images/5/13ae.png)

Se expande cuando se hace clic en el botón <i>create new blog</i>

![navegador mostrando formulario con botón create new](../../images/5/13be.png)

El formulario se esconde otra vez luego de que un nuevo blog es creado.

#### 5.6 Frontend de la Lista de Blogs, paso 6

Separa el formulario para crear un nuevo blog en su propio componente (si aún no lo has hecho) y mueve todos los estados necesarios para crear un nuevo blog a este componente.

El componente debe funcionar como el componente <i>NoteForm</i> del [material](/es/part5/props_children_y_proptypes) de esta parte.

#### 5.7 Frontend de la Lista de Blogs, paso 7

Agreguemos un botón a cada blog, que controla si se muestran o no todos los detalles sobre el blog.

Los detalles completos del blog se abren cuando se hace clic en el botón.

![navegador mostrando todos los detalles de un blog mientras otros solo tienen botones para ver más](../../images/5/13ea.png)

Y los detalles se ocultan cuando se vuelve a hacer clic en el botón.

En este punto, el botón <i>like</i> no necesita hacer nada.

La aplicación que se muestra en la imagen tiene un poco de CSS adicional para mejorar su apariencia.

Es fácil agregar estilos a la aplicación como se muestra en la parte 2 usando estilos [en línea](/es/part2/agregar_estilos_a_la_aplicacion_react#estilos-en-linea):

```js
const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}> // highlight-line
      <div>
        {blog.title} {blog.author}
      </div>
      // ...
  </div>
)}
```

**NB:** Aunque la funcionalidad implementada en esta parte es casi idéntica a la funcionalidad proporcionada por el componente <i>Togglable</i>, no se puede usar directamente para lograr el comportamiento deseado. La solución más fácil sería agregar un estado al componente blog que controle si todos los detalles están siendo mostrados o no.

#### 5.8: Frontend de la Lista de Blogs, paso 8

Implementa la funcionalidad para el botón like. Los likes aumentan al hacer un solicitud HTTP _PUT_ a la dirección única de la publicación del blog en el backend.

Dado que la operación de backend reemplaza toda la publicación del blog, deberás enviar todos sus campos en el cuerpo de la solicitud. Si deseas agregar un like a la siguiente publicación de blog:

```js
{
  _id: "5a43fde2cbd20b12a2c34e91",
  user: {
    _id: "5a43e6b6c37f3d065eaaa581",
    username: "mluukkai",
    name: "Matti Luukkainen"
  },
  likes: 0,
  author: "Joel Spolsky",
  title: "The Joel Test: 12 Steps to Better Code",
  url: "https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/"
},
```

Deberías realizar una solicitud HTTP PUT a la dirección <i>/api/blogs/5a43fde2cbd20b12a2c34e91</i> con los siguientes datos de solicitud:

```js
{
  user: "5a43e6b6c37f3d065eaaa581",
  likes: 1,
  author: "Joel Spolsky",
  title: "The Joel Test: 12 Steps to Better Code",
  url: "https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/"
}
```

El Backend también debe ser actualizado para manejar la referencia al usuario.

#### 5.9: Frontend de la lista de Blogs, paso 9

Nos damos cuenta de que algo está mal. Cuando se da "me gusta" a un blog en la app, el nombre del usuario que añadió el blog no se muestra en sus detalles:

![navegador mostrando nombre faltante debajo del botón de me gusta](../../images/5/59put.png)

Cuando se recarga el navegador, la información de la persona se muestra. Esto no es aceptable, averigua dónde está el problema y realiza la corrección necesaria.

Por supuesto, es posible que ya hayas hecho todo correctamente y el problema no ocurra en tu código. En ese caso, puedes continuar.

#### 5.10: Frontend de la Lista de Blogs, paso 10

Modifica la aplicación para enumerar las publicaciones de blog por el número de <i>likes</i>. La clasificación se puede hacer con el método de array [sort](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/sort).

#### 5.11: Frontend de la Lista de Blogs, paso 11

Agrega un nuevo botón para eliminar publicaciones de blog. También implementa la lógica para eliminar publicaciones de blog en el backend.

Tu aplicación podría verse así:

![dialogo de confirmación de eliminación de blog en el navegador](../../images/5/14ea.png)

El cuadro de diálogo de confirmación para eliminar una publicación de blog es fácil de implementar con la función [window.confirm](https://developer.mozilla.org/es/docs/Web/API/Window/confirm).

Muestra el botón para eliminar una publicación de blog solo si la publicación de blog fue agregada por el usuario.

</div>

<div class="content">

### ESlint

En la parte 3 configuramos la herramienta de estilo de código [ESlint](/es/part3/validacion_y_es_lint#lint) para el backend. Utilicemos ESlint también en el frontend.

Vite ha instalado ESlint en el proyecto de forma predeterminada, por lo que todo lo que nos queda por hacer es definir nuestra configuración deseada en el archivo <i>eslint.config.js</i>.

Creemos un archivo <i>eslint.config.js</i> con el siguiente contenido:

```js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module'
      }
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      // highlight-start
      ],
      indent: ['error', 2],
      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'single'],
      semi: ['error', 'never'],
      eqeqeq: 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-console': 'off'
      //highlight-end
    }
  }
]
```

NOTA: Si estás utilizando Visual Studio Code junto con el plugin ESLint, es posible que debas agregar una configuración de espacio de trabajo adicional para que funcione. Si ves <i>Failed to load plugin react: Cannot find module 'eslint-plugin-react'</i>, necesitas una configuración adicional. Agregar la siguiente línea a settings.json puede ayudar: 

```js
"eslint.workingDirectories": [{ "mode": "auto" }]
```

Consulta [esto](https://github.com/microsoft/vscode-eslint/issues/880#issuecomment-578052807) para obtener más información.

Como de costumbre, puedes realizar el linting desde la línea de comandos con el siguiente comando

```bash
npm run lint
```

o usando el plugin de Eslint del editor.

Puedes encontrar el código para nuestra aplicación actual en su totalidad en la rama <i>part5-7</i> de [este repositorio de GitHub](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-7).

</div>

<div class="tasks">

### Ejercicio 5.12.

#### 5.12: Frontend de la Lista de Blogs, paso 12

Agrega ESlint al proyecto. Define la configuración según tu preferencia. Corrige todos los errores del linter.

Vite ha instalado ESlint en el proyecto por defecto, así que todo lo que queda por hacer es definir tu configuración deseada en el archivo <i>eslint.config.js</i>.

</div>
