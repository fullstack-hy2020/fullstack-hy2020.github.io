---
mainImage: ../../../images/part-7.svg
part: 7
letter: a
lang: es
---

<div class="content">

Los ejercicios de esta séptima parte del curso difieren un poco de los anteriores. En este capítulo y en el siguiente, como es habitual, hay [ejercicios relacionados con la teoría en el capítulo](/es/part7/react_router#ejercicios-7-1-7-3).

Además de los ejercicios de este capítulo y del siguiente, hay una serie de ejercicios en los que repasaremos lo que hemos aprendido durante todo el curso ampliando la aplicación Bloglist, en la que trabajamos durante las partes 4 y 5.

### Estructura de navegación de la aplicación

Después de la parte 6, volvemos a React sin Redux.

Es muy común que las aplicaciones web tengan una barra de navegación, que permite cambiar la vista de la aplicación.

Nuestra aplicación podría tener una página principal

![](../../images/7/1ea.png)

y páginas separadas para mostrar información sobre notas y usuarios:

![](../../images/7/2ea.png)

En una [aplicación web de la vieja escuela](/es/part0/fundamentos_de_las_aplicaciones_web#aplicaciones-web-tradicionales), el navegador lograría cambiar la página mostrada por la aplicación realizando una solicitud HTTP GET al servidor y renderizando el HTML que representa la vista que se devolvió.

En las aplicaciones de una sola página, en realidad, siempre estamos en la misma página. El código Javascript ejecutado por el navegador crea una ilusión de diferentes "páginas". Si se realizan solicitudes HTTP al cambiar de vista, solo son para obtener datos con formato JSON, que la nueva vista podría requerir para que se muestren.

La barra de navegación y una aplicación que contiene múltiples vistas son muy fáciles de implementar usando React.

He aquí una forma:

```js
import { useState }  from 'react'
import ReactDOM from 'react-dom/client'

const Home = () => (
  <div> <h2>TKTL notes app</h2> </div>
)

const Notes = () => (
  <div> <h2>Notes</h2> </div>
)

const Users = () => (
  <div> <h2>Users</h2> </div>
)

const App = () => {
  const [page, setPage] = useState('home')

  const toPage = (page) => (event) => {
    event.preventDefault()
    setPage(page)
  }

  const content = () => {
    if (page === 'home') {
      return <Home />
    } else if (page === 'notes') {
      return <Notes />
    } else if (page === 'users') {
      return <Users />
    }
  }

  const padding = {
    padding: 5
  }

  return (
    <div>
      <div>
        <a href="" onClick={toPage('home')} style={padding}>
          home
        </a>
        <a href="" onClick={toPage('notes')} style={padding}>
          notes
        </a>
        <a href="" onClick={toPage('users')} style={padding}>
          users
        </a>
      </div>

      {content()}
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

Cada vista se implementa como su propio componente. Almacenamos la información del componente de vista en el estado de la aplicación llamado <i>page</i>. Esta información nos dice qué componente, que representa una vista, debe mostrarse debajo de la barra de menú.

Sin embargo, el método no es muy óptimo. Como podemos ver en las imágenes, la dirección permanece igual aunque a veces estemos en diferentes vistas. Cada vista debe tener preferiblemente su propia dirección, por ejemplo, para hacer posible la creación de marcadores. El botón de <i>retroceso</i> tampoco funciona como se esperaba para nuestra aplicación, lo que significa que el botón de retroceso no lo mueve a la vista mostrada anteriormente de la aplicación, sino a un lugar completamente diferente. Si la aplicación creciera aún más y quisiéramos, por ejemplo, agregar vistas separadas para cada usuario y nota, entonces este <i>routing</i>(enrutamiento) hecho por nosotros mismos se volvería demasiado complicado, ya que administraríamos la navegación de la aplicación.

### React Router

Afortunadamente, React tiene la librería [React router](https://github.com/ReactTraining/react-router), que proporciona una excelente solución para administrar la navegación en una aplicación React.

Cambiemos la aplicación anterior para usar React router. Primero, instalemos React router con el comando

```bash
npm install react-router-dom
```

El routing proporcionado por React Router se habilita cambiando la aplicación de la siguiente manera:

```js
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from "react-router-dom"

const App = () => {

  const padding = {
    padding: 5
  }

  return (
    <Router>
      <div>
        <Link style={padding} to="/">home</Link>
        <Link style={padding} to="/notes">notes</Link>
        <Link style={padding} to="/users">users</Link>
      </div>

      <Routes>
        <Route path="/notes" element={<Notes />} />
        <Route path="/users" element={<Users />} />
        <Route path="/" element={<Home />} />
      </Routes>

      <div>
        <i>Note app, Department of Computer Science 2023</i>
      </div>
    </Router>
  )
}
```

Routing, o la representación condicional de componentes <i>basada en la URL</i> en el navegador, se utiliza colocando componentes como hijos del componente <i>Router</i>, es decir, dentro de las etiquetas del <i>Router</i>.

Tenga en cuenta que, aunque se hace referencia al componente por el nombre <i>Router</i>, en realidad estamos hablando de [BrowserRouter](https://reactrouter.com/en/main/router-components/browser-router), porque aquí la importación ocurre al cambiar el nombre del objeto importado:

```js
import {
  BrowserRouter as Router, // highlight-line
  Routes, Route, Link
} from "react-router-dom"
```

Según el [manual de la v5](https://v5.reactrouter.com/web/api/BrowserRouter):

> <i>BrowserRouter</i> es un <i>Router</i> que usa la API de historial HTML5 (pushState, replaceState y el evento popState) para mantener su interfaz de usuario sincronizada con la URL.

Normalmente, el navegador carga una nueva página cuando cambia la URL en la barra de direcciones. Sin embargo, con la ayuda de la [API de historial HTML5](https://css-tricks.com/using-the-html5-history-api/), <i>BrowserRouter</i> nos permite usar la URL en la barra de direcciones del navegador para el "routing" interno en una aplicación React. Por lo tanto, incluso si cambia la URL en la barra de direcciones, el contenido de la página solo se manipula mediante Javascript y el navegador no cargará contenido nuevo desde el servidor. Usar las acciones de avance y retroceso, así como crear marcadores, sigue siendo lógico como en una página web tradicional.

Dentro del router definimos <i>enlaces</i> que modifican la barra de direcciones con la ayuda del componente [Link](https://reactrouter.com/en/main/components/link). Por ejemplo,

```js
<Link to="/notes">notes</Link>
```

crea un enlace en la aplicación con el texto <i>notes</i>, que cuando se clickea cambia la URL en la barra de direcciones a <i>/notes</i>.

Los componentes renderizados según la URL del navegador se definen con la ayuda del componente [Route](https://reactrouter.com/en/main/route/route). Por ejemplo,

```js
<Route path="/notes" element={<Notes />} />
```

define, que si la dirección del navegador es <i>/notes</i>, renderizamos el componente <i>Notes</i>.

Envolvemos los componentes que se renderizarán en función de la URL con un componente [Routes](https://reactrouter.com/en/main/components/routes)

```js 
<Routes>
  <Route path="/notes" element={<Notes />} />
  <Route path="/users" element={<Users />} />
  <Route path="/" element={<Home />} />
</Routes>
```

Las rutas funcionan representando el primer componente cuyo <i>path</i> (ruta) coincide con la URL en la barra de direcciones del navegador.

### Ruta parametrizada

Examinemos la versión ligeramente modificada del ejemplo anterior. El código completo del ejemplo se puede encontrar [aquí](https://github.com/fullstack-hy2020/misc/blob/master/router-app-v1.js).

La aplicación ahora contiene cinco vistas diferentes cuya pantalla está controlada por el router. Además de los componentes del ejemplo anterior (<i>Home</i>, <i>Notes</i> y <i>Users</i>), tenemos <i>Login</i> que representa la vista de inicio de sesión y <i>Note</i> que representa la vista de una sola nota.

<i>Home</i> y <i>Users</i> no han cambiado con respecto al ejercicio anterior. <i>Notes</i> es un poco más complicado. Muestra la lista de notas que se le pasan como props de tal manera que se puede hacer clic en el nombre de cada nota.

![notes app, mostrando que las notas se pueden clickear](../../images/7/3ea.png)

La capacidad de hacer clic en un nombre se implementa con el componente <i>Link</i>, y hacer clic en el nombre de una nota cuya identificación es 3 desencadenaría un evento que cambia la dirección del navegador a <i>notes/3</i>:

```js
const Notes = ({notes}) => (
  <div>
    <h2>Notes</h2>
    <ul>
      {notes.map(note =>
        <li key={note.id}>
          <Link to={`/notes/${note.id}`}>{note.content}</Link>
        </li>
      )}
    </ul>
  </div>
)
```

Definimos las URL parametrizadas en el routing en el componente <i>App</i> de la siguiente manera:

```js
<Router>
  // ...

  <Routes>
    <Route path="/notes/:id" element={<Note notes={notes} />} /> // highlight-line
    <Route path="/notes" element={<Notes notes={notes} />} />   
    <Route path="/users" element={user ? <Users /> : <Navigate replace to="/login" />} />
    <Route path="/login" element={<Login onLogin={login} />} />
    <Route path="/" element={<Home />} />      
  </Routes>
</Router>
```

Definimos la ruta renderizando una nota específica "estilo expreso" marcando el parámetro con dos puntos <i>:id</i>

```js
<Route path="/notes/:id" element={<Note notes={notes} />} />
```

Cuando un navegador navega a la URL de una nota específica, por ejemplo <i>/notes/3</i>, renderizamos el componente <i>Note</i>:

```js
import {
  // ...
  useParams  // highlight-line
} from "react-router-dom"

const Note = ({ notes }) => {
  const id = useParams().id // highlight-line
  const note = notes.find(n => n.id === Number(id)) 
  return (
    <div>
      <h2>{note.content}</h2>
      <div>{note.user}</div>
      <div><strong>{note.important ? 'important' : ''}</strong></div>
    </div>
  )
}
```

El componente _Note_ recibe todas las notas como props <i>notes</i>, y se puede acceder al parámetro url (el ID de la nota que se mostrará) con la función [useParams](https://reactrouter.com/en/main/hooks/use-params) de react-router.

### useNavigate

También hemos implementado una función de inicio de sesión simple en nuestra aplicación. Si un usuario ha iniciado sesión, la información sobre un usuario que ha iniciado sesión se guarda en el campo <i>user</i> del estado del componente <i>App</i>.

La opción para navegar a la vista de <i>Login</i> se representa de forma condicional en el menú.

```js
<Router>
  <div>
    <Link style={padding} to="/">home</Link>
    <Link style={padding} to="/notes">notes</Link>
    <Link style={padding} to="/users">users</Link>
    // highlight-start
    {user
      ? <em>{user} logged in</em>
      : <Link style={padding} to="/login">login</Link>
    }
    // highlight-end
  </div>

  // ...
</Router>
```

Entonces, si el usuario ya ha iniciado sesión, en lugar de mostrar el enlace <i>Login</i>, mostramos el nombre de usuario del usuario:

![app de notas mostrando usuario logeado](../../images/7/4a.png)

El código del componente que maneja la funcionalidad de inicio de sesión es el siguiente:

```js
import {
  // ...
  useNavigate // highlight-line
} from 'react-router-dom'

const Login = (props) => {
  const navigate = useNavigate() // highlight-line

  const onSubmit = (event) => {
    event.preventDefault()
    props.onLogin('mluukkai')
    navigate('/') // highlight-line
  }

  return (
    <div>
      <h2>login</h2>
      <form onSubmit={onSubmit}>
        <div>
          username: <input />
        </div>
        <div>
          password: <input type='password' />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}
```

Lo interesante de este componente es el uso de la función [useNavigate](https://reactrouter.com/en/main/hooks/use-navigate) de react-router. Con esta función, se puede modificar la URL del navegador programáticamente.

Con el inicio de sesión del usuario, llamamos a _navigate('/')_, que hace cambiar la url del navegador a _/_ y la aplicación muestra el componente correspondiente, <i>Home</i>.

Tanto [useParams](https://reactrouter.com/en/main/hooks/use-params) como [useNavigate](https://reactrouter.com/en/main/hooks/use-navigate) son hooks, al igual que useState y useEffect que ya hemos usado muchas veces. Como recordará de la parte 1, existen algunas [reglas](/es/part1/un_estado_mas_complejo_depurando_aplicaciones_react#reglas-de-los-hooks) para usar hooks. Create-react-app se ha configurado para advertirle si rompe estas reglas, por ejemplo, llamando a un hook desde una declaración condicional.

### redireccionar

Hay un detalle más que es interesante, en la ruta de <i>Users</i>:

```js
<Route path="/users" element={user ? <Users /> : <Navigate replace to="/login" />} />
```

Si un usuario no ha iniciado sesión, el componente <i>Users</i> no se renderiza. En su lugar, el usuario es <i>redirigido</i> mediante el componente [Navigate](https://reactrouter.com/en/main/components/navigate) a la vista de inicio de sesión.

```js
<Navigate replace to="/login" />
```

En realidad, tal vez sería mejor ni siquiera mostrar enlaces en la barra de navegación que requieran iniciar sesión si el usuario no está conectado a la aplicación.

Aquí está el componente <i>App</i> en su totalidad:

```js
const App = () => {
  const [notes, setNotes] = useState([
    // ...
  ])

  const [user, setUser] = useState(null) 

  const login = (user) => {
    setUser(user)
  }

  const padding = {
    padding: 5
  }

  return (
    <div>
      <Router>
        <div>
          <Link style={padding} to="/">home</Link>
          <Link style={padding} to="/notes">notes</Link>
          <Link style={padding} to="/users">users</Link>
          {user
            ? <em>{user} logged in</em>
            : <Link style={padding} to="/login">login</Link>
          }
        </div>

        <Routes>
          <Route path="/notes/:id" element={<Note notes={notes} />} />  
          <Route path="/notes" element={<Notes notes={notes} />} />   
          <Route path="/users" element={user ? <Users /> : <Navigate replace to="/login" />} />
          <Route path="/login" element={<Login onLogin={login} />} />
          <Route path="/" element={<Home />} />      
        </Routes>
      </Router>      
      <footer>
        <br />
        <em>Note app, Department of Computer Science 2022</em>
      </footer>
    </div>
  )
}
```

Definimos un elemento común para las aplicaciones web modernas llamado  <i>footer</i>, que define la parte en la parte inferior de la pantalla, fuera del <i>Router</i>, para que se muestre independientemente del componente que se muestra en la parte enrutada de la aplicación.

### Ruta parametrizada revisitada

Nuestra aplicación tiene un defecto. El componente _Note_ recibe todas las notas, aunque solo muestra aquella cuya identificación coincide con el parámetro url:


```js
const Note = ({ notes }) => {
  const id = useParams().id
  const note = notes.find(n => n.id === Number(id))
  // ...
}
```

¿Sería posible modificar la aplicación para que el componente _Note_ reciba solo la nota que debería mostrar?

```js
const Note = ({ note }) => {
  return (
    <div>
      <h2>{note.content}</h2>
      <div>{note.user}</div>
      <div><strong>{note.important ? 'important' : ''}</strong></div>
    </div>
  )
}
```

Una forma de hacer esto sería usar el hook [useMatch](https://reactrouter.com/en/v6.3.0/api#usematch) de React Router para averiguar la id de la nota que se mostrará en el componente _App_.

No es posible utilizar el hook <i>useMatch</i> en el componente que define la parte enrutada de la aplicación. Movamos el uso de los componentes _Router_ fuera de _App_:

```js
ReactDOM.createRoot(document.getElementById('root')).render(
  <Router> // highlight-line
    <App />
  </Router> // highlight-line
)
```

El componente _App_ se convierte en:

```js
import {
  // ...
  useMatch  // highlight-line
} from "react-router-dom"

const App = () => {
  // ...

 // highlight-start
  const match = useMatch('/notes/:id')

  const note = match 
    ? notes.find(note => note.id === Number(match.params.id))
    : null
  // highlight-end

  return (
    <div>
      <div>
        <Link style={padding} to="/">home</Link>
        // ...
      </div>

      <Routes>
        <Route path="/notes/:id" element={<Note note={note} />} />   // highlight-line
        <Route path="/notes" element={<Notes notes={notes} />} />   
        <Route path="/users" element={user ? <Users /> : <Navigate replace to="/login" />} />
        <Route path="/login" element={<Login onLogin={login} />} />
        <Route path="/" element={<Home />} />      
      </Routes>   

      <div>
        <em>Note app, Department of Computer Science 2022</em>
      </div>
    </div>
  )
}  
```

Cada vez que se renderiza el componente, lo cual sucede cada vez que cambia la URL del navegador, se ejecuta el siguiente comando:

```js
const match = useMatch('/notes/:id')
```

Si la url coincide con _/notes/:id_, la variable match contendrá un objeto desde el cual podemos acceder a la parte parametrizada de la ruta, el id de la nota que se mostrará, y luego podremos buscar la nota correcta para mostrar.

```js
const note = match 
  ? notes.find(note => note.id === Number(match.params.id))
  : null
```

El código completo se puede encontrar [aquí](https://github.com/fullstack-hy2020/misc/blob/master/router-app-v2.js).

</div>
<div class="tasks">

### Ejercicios 7.1.-7.3.

Volvamos a trabajar con anécdotas. Utilice la aplicación de anécdotas sin redux que se encuentra en el repositorio <https://github.com/fullstack-hy2020/routed-anecdotes> como punto de partida para los ejercicios.

Si clona el proyecto en un repositorio de git existente, recuerde <i>eliminar la configuración de git de la aplicación clonada</i>:

```bash
cd routed-anecdotes   // go first to directory of the cloned repository
rm -rf .git
```

La aplicación se inicia de la forma habitual, pero primero debe instalar las dependencias de la aplicación:

```bash
npm install
npm start
```

### 7.1: anécdotas enrutadas, paso 1

Agregue React Router a la aplicación para que al hacer clic en los enlaces del componente <i>Menu</i>, se pueda cambiar la vista.

En la raíz de la aplicación, es decir, la ruta _/_, muestra la lista de anécdotas:

![](../../assets/teht/40.png)

El componente <i>Footer</i> siempre debe estar visible en la parte inferior.

La creación de una nueva anécdota debería ocurrir, por ejemplo, en la ruta <i>create</i>:

![](../../assets/teht/41.png)

#### 7.2: anécdotas enrutadas, paso 2

Implementar una vista para mostrar una sola anécdota:

![](../../assets/teht/42.png)

La navegación a la página que muestra la anécdota única se realiza haciendo clic en el nombre de esa anécdota.

![](../../assets/teht/43.png)

#### 7.3: anécdotas enrutadas, paso 3

La funcionalidad predeterminada del formulario de creación es bastante confusa, porque parece que no sucede nada después de crear una nueva anécdota utilizando el formulario.

Mejorar la funcionalidad de tal manera que después de crear una nueva anécdota, la aplicación pasa automáticamente a mostrar la vista de todas las anécdotas <i>y</i> al usuario se le muestra una notificación informándole de esta creación exitosa durante los próximos 10 segundos:

![](../../assets/teht/44.png)

</div>
