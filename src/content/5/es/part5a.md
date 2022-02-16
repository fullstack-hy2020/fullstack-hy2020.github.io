---
mainImage: ../../../images/part-5.svg
part: 5
letter: a
lang: es
---

<div class="content">


En las dos últimas partes, nos hemos concentrado principalmente en el backend, y el frontend aún no es compatible con la administración de usuarios que implementamos en el backend en la parte 4.

Por el momento, el frontend muestra las notas existentes y permite a los usuarios cambiar el estado de una nota de importante a no importante y viceversa. Ya no se pueden agregar nuevas notas debido a los cambios realizados en el backend en la parte 4: el backend ahora espera que se envíe un token que verifique la identidad de un usuario con la nueva nota.

Ahora implementaremos una parte de la funcionalidad de administración de usuarios requerida en el frontend. Comencemos con el inicio de sesión del usuario. A lo largo de esta parte, asumiremos que no se agregarán nuevos usuarios desde el frontend.

Ahora se ha agregado un formulario de inicio de sesión en la parte superior de la página. El formulario para agregar nuevas notas también se ha movido a la parte superior de la lista de notas.

![](../../images/5/1e.png)


El código del componente <i>App</i> ahora tiene el siguiente aspecto:

```js
const App = () => {
  const [notes, setNotes] = useState([]) 
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  // highlight-start
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
// highlight-end

  useEffect(() => {
    noteService
      .getAll().then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  // ...

// highlight-start
  const handleLogin = (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
  }
  // highlight-end

  return (
    <div>
      <h1>Notes</h1>

      <Notification message={errorMessage} />

      // highlight-start
      <form onSubmit={handleLogin}>
        <div>
          username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    // highlight-end

      // ...
    </div>
  )
}

export default App
```


El código de aplicación actual se puede encontrar en [Github](https://github.com/fullstack-hy2020/part2-notes/tree/part5-1), rama <i>part5-1</i>.

El formulario de inicio de sesión se maneja de la misma manera que manejamos los formularios en la [parte 2](/es/part2/forms). El estado de la aplicación tiene  los campos <i>username</i> y <i>password</i> para almacenar los datos del formulario. Los campos de formulario tienen controladores de eventos, que sincronizan los cambios en el campo con el estado del componente <i>App</i>. Los controladores de eventos son simples: se les da un objeto como parámetro, y desestructuran el campo <i>target</i> del objeto y guardan su valor en el estado.

```js
({ target }) => setUsername(target.value)
```


El método _handleLogin_, que se encarga de manejar los datos en el formulario, aún no se ha implementado.

El inicio de sesión se realiza enviando una solicitud HTTP POST a la dirección del servidor <i>api/login</i>. Separemos el código responsable de esta solicitud en su propio módulo, en el archivo <i>services/login.js</i>.

Usaremos la sintaxis <i>async/await</i> en lugar de promesas para la solicitud HTTP:

```js
import axios from 'axios'
const baseUrl = '/api/login'

const login = async credentials => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { login }
```


El método para manejar el inicio de sesión se puede implementar de la siguiente manera:

```js
import loginService from './services/login' 

const App = () => {
  // ...
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
// highlight-start
  const [user, setUser] = useState(null)
// highlight-end

  const handleLogin = async (event) => {
    event.preventDefault()
    
    // highlight-start
    try {
      const user = await loginService.login({
        username, password,
      })

      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
    // highlight-end
  }

  // ...
}
```


Si la conexión es exitosa, los campos de formulario se vacían <i>y</i> la respuesta del servidor (incluyendo un <i>token</i> y los datos de usuario) se guardan en el campo <i>user</i> de estado de la aplicación.

Si el inicio de sesión falla, o la ejecución de la función _loginService.login_ da como resultado un error, se notifica al usuario.

No se notifica al usuario acerca de un inicio de sesión exitoso de ninguna manera. Modifiquemos la aplicación para que muestre el formulario de inicio de sesión solo <i>si el usuario no ha iniciado sesión</i>, cuando _user === null_. El formulario para agregar nuevas notas se muestra solo si el <i>usuario ha iniciado sesión</i>, por lo que <i>user</i> contiene los detalles del usuario.

Agreguemos dos funciones auxiliares al componente <i>App</i> para generar los formularios:

```js
const App = () => {
  // ...

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )

  const noteForm = () => (
    <form onSubmit={addNote}>
      <input
        value={newNote}
        onChange={handleNoteChange}
      />
      <button type="submit">save</button>
    </form>  
  )

  return (
    // ...
  )
}
```


y renderizarlos condicionalmente:

```js
const App = () => {
  // ...

  const loginForm = () => (
    // ...
  )

  const noteForm = () => (
    // ...
  )

  return (
    <div>
      <h1>Notes</h1>

      <Notification message={errorMessage} />

      {user === null && loginForm()} // highlight-line
      {user !== null && noteForm()} // highlight-line

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map((note, i) => 
          <Note
            key={i}
            note={note} 
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        )}
      </ul>

      <Footer />
    </div>
  )
}
```

Un [truco de React](https://reactjs.org/docs/conditional-rendering.html#inline-if-with-logical--operator) ligeramente extraño, pero de uso común, se usa para renderizar los formularios de forma condicional:

```js
{
  user === null && loginForm()
}
```


Si la primera declaración se evalúa como falsa, o es [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy), la segunda declaración (que genera el formulario) no se ejecuta en absoluto.

Podemos hacer esto aún más sencillo usando el [operador condicional](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator):

```js
return (
  <div>
    <h1>Notes</h1>

    <Notification message={errorMessage}/>

    {user === null ?
      loginForm() :
      noteForm()
    }

    <h2>Notes</h2>

    // ...

  </div>
)
```


Si _usuario === null_ es [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy)(verdadero), se ejecuta _loginForm()_. Si no es así, se ejecuta _noteForm()_.

Hagamos una modificación más. Si el usuario ha iniciado sesión, su nombre se muestra en la pantalla:

```js
return (
  <div>
    <h1>Notes</h1>

    <Notification message={errorMessage} />

    {user === null ?
      loginForm() :
      <div>
        <p>{user.name} logged-in</p>
        {noteForm()}
      </div>
    }

    <h2>Notes</h2>

    // ...

  </div>
)
```


La solución no es perfecta, pero la dejamos por ahora.

Nuestro componente principal <i>App</i> es demasiado grande en este momento. Los cambios que hicimos ahora son una clara señal de que los formularios deben refactorizarse en sus propios componentes. Sin embargo, lo dejaremos para un ejercicio opcional.

El código de aplicación actual se puede encontrar en [Github](https://github.com/fullstack-hy2020/part2-notes/tree/part5-2), rama <i>part5-2</i>.


### Creando nuevas notas

El token devuelto con un inicio de sesión exitoso se guarda en el estado de la aplicación, el campo <i>token</i> de <i>user</i>:

The solution isn't perfect, but we'll leave it for now. 

```js
const handleLogin = async (event) => {
  event.preventDefault()
  try {
    const user = await loginService.login({
      username, password,
    })

    setUser(user) // highlight-line
    setUsername('')
    setPassword('')
  } catch (exception) {
    // ...
  }
}
```

Arreglemos la creación de nuevas notas para que funcione con el backend. Esto significa agregar el token del usuario que inició sesión en el header de Autorización de la solicitud HTTP.

El módulo <i>noteService</i> cambia así:

```js
import axios from 'axios'
const baseUrl = '/api/notes'

let token = null // highlight-line

// highlight-start
const setToken = newToken => {
  token = `bearer ${newToken}`
}
// highlight-end

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  // highlight-start
  const config = {
    headers: { Authorization: token },
  }
// highlight-end

  const response = await axios.post(baseUrl, newObject, config) // highlight-line
  return response.data
}

const update = (id, newObject) => {
  const request = axios.put(`${ baseUrl } /${id}`, newObject)
  return request.then(response => response.data)
}

export default { getAll, create, update, setToken } // highlight-line
```


El módulo noteService contiene una variable privada _token_. Su valor se puede cambiar con una función _setToken_, que es exportada por el módulo. _create_, ahora con la sintaxis async/await, establece el token en el header <i>Authorization</i>. El header se le da a axios como el tercer parámetro del método <i>post</i>.

El controlador de eventos responsable del inicio de sesión debe cambiarse para llamar al método <code>noteService.setToken(user.token)</code> con un inicio de sesión exitoso:

```js
const handleLogin = async (event) => {
  event.preventDefault()
  try {
    const user = await loginService.login({
      username, password,
    })

    noteService.setToken(user.token) // highlight-line
    setUser(user)
    setUsername('')
    setPassword('')
  } catch (exception) {
    // ...
  }
}
```


¡Y ahora, la funcionalidad agregar nuevas notas funciona!


### Guardar el token en el almacenamiento local del navegador

Nuestra aplicación tiene un defecto: cuando se vuelve a renderizar la página, la información del inicio de sesión del usuario desaparece. Esto también ralentiza el desarrollo. Por ejemplo, cuando probamos la creación de nuevas notas, tenemos que volver a iniciar sesión cada vez.

Este problema se resuelve fácilmente guardando los datos de inicio de sesión en el [local storage](https://developer.mozilla.org/en-US/docs/Web/API/Storage)(almacenamiento local). Local Storage es una base de datos de [valores clave](https://en.wikipedia.org/wiki/Key-value_database) en el navegador.

Es muy fácil de usar. Un <i>valor</i> correspondiente a una determinada <i>clave</i> se guarda en la base de datos con el método [setItem](https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem). Por ejemplo:

```js
window.localStorage.setItem('name', 'juha tauriainen')
```


guarda el string dado como segundo parámetro como el valor <i>name</i> de la clave.

El valor de una clave se puede encontrar con el método [getItem](https://developer.mozilla.org/en-US/docs/Web/API/Storage/getItem):

```js
window.localStorage.getItem('name')
```


y [removeItem](https://developer.mozilla.org/en-US/docs/Web/API/Storage/removeItem) elimina una clave.

Los valores del almacenamiento local se conservan incluso cuando se vuelve a renderizar la página. El almacenamiento es específico de [origen](https://developer.mozilla.org/en-US/docs/Glossary/Origin), por lo que cada aplicación web tiene su propio almacenamiento.

Extendamos nuestra aplicación para que guarde los detalles de un usuario que inició sesión en el almacenamiento local.

Los valores guardados en el almacenamiento son [DOMstrings](https://developer.mozilla.org/en-US/docs/Web/API/DOMString), por lo que no podemos guardar un objeto JavaScript tal cual. El objeto debe analizarse primero en JSON, con el método _JSON.stringify_. En consecuencia, cuando se lee un objeto JSON del almacenamiento local, debe parsearse de nuevo a JavaScript con _JSON.parse_.

Los cambios en el método de inicio de sesión son los siguientes:

```js
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      // highlight-start
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      ) 
      // highlight-end
      noteService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      // ...
    }
  }
```


Los detalles de un usuario que inició sesión ahora se guardan en el almacenamiento local y se pueden ver en la consola:

![](../../images/5/3e.png)

También puede inspeccionar el almacenamiento local con las herramientas de desarrollo. En Chrome, vaya a la pestaña <i>Application</i> y seleccione <i>Local Storage</i> (más detalles [aquí](https://developers.google.com/web/tools/chrome-devtools/storage/localstorage)). En Firefox, vaya a la pestaña <i>Storage</i> y seleccione <i>Local Storage</i> (detalles [aquí](https://developer.mozilla.org/en-US/docs/Tools/Storage_Inspector)).

Aún tenemos que modificar nuestra aplicación para que cuando ingresemos a la página, la aplicación verifique si los detalles de un usuario que inició sesión ya se pueden encontrar en el almacenamiento local. Si pueden, los detalles se guardan en el estado de la aplicación y en <i>noteService</i>.

La forma correcta de hacer esto es con un [effect hook](https://reactjs.org/docs/hooks-effect.html): un mecanismo que encontramos por primera vez en la [parte 2](/es/part2/getting_data_from_server#effect-hooks) y que usamos para buscar notas del servidor.

Podemos tener múltiples effect hooks, así que creemos un segundo para manejar la primera carga de la página:

```js
const App = () => {
  const [notes, setNotes] = useState([]) 
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null) 

  useEffect(() => {
    noteService
      .getAll().then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  // highlight-start
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])
  // highlight-end

  // ...
}
```


El array vacío como parámetro del effect hook asegura que el hook se ejecute solo cuando el componente se renderiza [por primera vez](https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect).

Ahora un usuario permanece conectado a la aplicación para siempre. Probablemente deberíamos agregar una función de cierre de sesión que elimine los detalles de inicio de sesión del almacenamiento local. Sin embargo, lo dejaremos para un ejercicio.

Es posible cerrar la sesión de un usuario usando la consola, y eso es suficiente por ahora. Puede cerrar sesión con el comando:

```js
window.localStorage.removeItem('loggedNoteappUser')
```
o con el comando que vacía el <i>localstorage</i> por completo:

```js
window.localStorage.clear()
```


El código de la aplicación actual se puede encontrar en [Github](https://github.com/fullstack-hy2020/part2-notes/tree/part5-3), rama <i>part5-3</i>.

</div>

<div class="tasks">

### Ejercicios 5.1.-5.4.

Ahora crearemos un frontend para el backend de la lista de blogs que creamos en la última parte. Puede utilizar [esta aplicación](https://github.com/fullstack-hy2020/bloglist-frontend) de GitHub como base de su solución. La aplicación espera que su backend se ejecute en el puerto 3001.

Es suficiente enviar su solución terminada. Puedes hacer un compromiso después de cada ejercicio, pero eso no es necesario.

Los primeros ejercicios revisan todo lo que hemos aprendido sobre React hasta ahora. Pueden ser un desafío, especialmente si su backend está incompleto. Podría ser mejor usar el backend de las respuestas del modelo de la parte 4.

Mientras realiza los ejercicios, recuerde todos los métodos de debugging de los que hemos hablado, especialmente si está atento a la consola.

**Advertencia:** Si nota que está mezclando async/await y comandos _then_, es 99.9% seguro de que está haciendo algo mal. Utilice uno u otro, nunca ambos.


#### 5.1: frontend de la lista de blogs, paso 1

Clona la aplicación de [Github](https://github.com/fullstack-hy2020/bloglist-frontend) con el comando:

```bash
git clone https://github.com/fullstack-hy2020/bloglist-frontend
```


<i>elimina la configuración de git de la aplicación clonada</i>

```bash
cd bloglist-frontend   // go to cloned repository
rm -rf .git
```


La aplicación se inicia de la forma habitual, pero primero debe instalar sus dependencias: 

```bash
npm install
npm start
```


Implemente la funcionalidad de inicio de sesión en el frontend. El token retornado con un inicio de sesión exitoso se guarda en el estado <i>user</i> de la aplicación.

Si un usuario no ha iniciado sesión, <i>solo</i> se verá el formulario de inicio de sesión.

![](../../images/5/4e.png)


Si el usuario ha iniciado sesión, se muestra el nombre del usuario y una lista de blogs. 

![](../../images/5/5e.png)


Los detalles de usuario del usuario que inició sesión no tienen que guardarse todavía en el almacenamiento local.

**NB** Puede implementar la representación condicional del formulario de inicio de sesión como este, por ejemplo:

```js
  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <form>
          //...
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}
```


#### 5.2: frontend de la lista de blogs, paso 2

Haga que el inicio de sesión sea "permanente" mediante el almacenamiento local. También implemente una forma de cerrar sesión.

![](../../images/5/6e.png)


Asegúrese de que el navegador no recuerde los detalles del usuario después de cerrar la sesión.

#### 5.3: frontend de la lista de blogs, paso 3

Expanda su aplicación para permitir que un usuario que haya iniciado sesión agregue nuevos blogs:

![](../../images/5/7e.png)


#### 5.4 *: frontend de la lista de blogs, paso 4

Implemente notificaciones que informen al usuario sobre operaciones exitosas y no exitosas en la parte superior de la página. Por ejemplo, cuando se agrega un nuevo blog, se puede mostrar la siguiente notificación:

![](../../images/5/8e.png)


El inicio de sesión fallido puede mostrar la siguiente notificación:

![](../../images/5/9e.png)


Las notificaciones deben estar visibles durante unos segundos. No es obligatorio agregar colores.

</div>
