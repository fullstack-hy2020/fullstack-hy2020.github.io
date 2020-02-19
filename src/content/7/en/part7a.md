---
mainImage: ../../../images/part-7.svg
part: 7
letter: a
lang: en
---

<div class="content">

The exercises in this seventh part of the course differ a bit from the ones before. In this and the next chapter there is, as usual [exercises related to the theory in the chapter](/en/part7/react_router#exercises).

In addition to the exercises in this and the chapter, there is a series of exercises which revise what we've learned during the whole course by expanding the Bloglist application which we worked on during parts 4 and 5.

### Application navigation structure

Following part 6, we return to React without Redux.

It is very common for web-applications to have a navigation bar, which enables switching the view of the application.

Our app could have a main page

![](../../images/7/1ea.png)

and separate pages for showing information on notes and users:

![](../../images/7/2ea.png)

In an [old school web app](/en/part0/fundamentals_of_web_apps#traditional-web-applications), changing the page shown by the application would be accomplished by the browser making a HTTP GET request to the server and rendering the HTML representing the view that was returned.

In single page apps, we are, in reality, always on the same page. The Javascript code run by the browser creates an illusion of different "pages". If HTTP requests are made when switching view, they are only for fetching JSON formatted data, which the new view might require for it to be shown.

The navigation bar and an application containing multiple views is very easy to implement using React.

Here is one way:

```js
import React, { useState } from 'react'
import ReactDOM from 'react-dom'

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

ReactDOM.render(<App />, document.getElementById('root'))
```

Each view is implemented as its own component. We store the view component information in the application state called <i>page</i>. This information tells us which component, representing a view, should be shown below the menu bar.

However, the method is not very optimal. As we can see from the pictures, the address stays the same even though at times we are in different views. Each view should preferably have its own address, e.g. to make bookmarking possible. The <i>back</i>-button doesn't work as expected for our application either, meaning that <i>back</i> doesn't move you to the previously displayed view of the application, but somewhere completely different. If the application were to grow even bigger and we wanted to, for example, add separate views for each user and note, then this self made <i>routing</i>, which means the navigation management of the application, would get overly complicated.

Reactissa on onneksi olemassa kirjasto [React router](https://github.com/ReactTraining/react-router) joka tarjoaa erinomaisen ratkaisun React-sovelluksen navigaation hallintaan.

Let's change the above application to use React router. First, we install React router with the command

```js
npm install --save react-router-dom
```

The routing provided by React Router is enabled by changing the application as follows:

```js
import {
  BrowserRouter as Router,
  Switch, Route, Link
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

      <Switch>
        <Route path="/notes">
          <Notes />
        </Route>
        <Route path="/users">
          <Users />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>

      <div>
        <i>Note app, Department of Computer Science 2020</i>
      </div>
    </Router>
  )
}
```

Routing, or the conditional rendering of components <i>based on the url</i> in the browser, is used by placing components as children of the <i>Router</i> component, meaning inside <i>Router</i>-tags.

Notice that, even though the component is referred to by the name <i>Router</i>, we are in fact talking about [BrowserRouter](https://reacttraining.com/react-router/web/api/BrowserRouter), because here the import happens by renaming the imported object:

```js
import {
  BrowserRouter as Router, // highlight-line
  Switch, Route, Link
} from "react-router-dom"
```

According to the [manuaal](https://reacttraining.com/react-router/web/api/BrowserRouter) 

> <i>BrowserRouter</i> is a <i>Router</i> that uses the HTML5 history API (pushState, replaceState and the popState event) to keep your UI in sync with the URL.

Normally the browser loads a new page when the URL in the address bar changes. However, with the help of the [HTML5 history API](https://css-tricks.com/using-the-html5-history-api/) <i>BrowserRouter</i> enables us to use the URL in the address bar of the browser for internal "routing" in a React-application. So, even if the URL in the address bar changes, the content of the page is only manipulated using Javascript, and the browser will not load new content form the server. Using the back and forward actions, as well as making bookmarks, is still logical like on a traditional web page.

Inside the router we define <i>links</i> that modify the address bar with the help of the [Link](https://reacttraining.com/react-router/web/api/Link) component. For example,

```js
<Link to="/notes">notes</Link>
```

creates a link in the application with the text <i>notes</i>, which when clicked changes the URL in the address bar to <i>/notes</i>.

Components rendered based on the URL of the browser are defined with the help of the component [Route](https://reacttraining.com/react-router/web/api/Route). For example, 

```js
<Route path="/notes">
  <Notes />
</Route>
```

määrittelee, että jos selaimen osoiteena on <i>/notes</i>, renderöidään komponentti <i>Notes</i>.

Urliin perustuen renderöitävät komponentit on sijoitettu [Swithch](https://reacttraining.com/react-router/web/api/Switch)-komponentin lapsiksi

```js 
<Switch>
  <Route path="/notes">
    <Notes />
  </Route>
  <Route path="/users">
    <Users />
  </Route>
  <Route path="/">
    <Home />
  </Route>
</Switch>
```

Switch saa aikaan sen, että renderöitävä komponentti on ensimmäinen, jonka <i>path</i> vastaa osoiterivin polkua.

Huomaa, että komponenttien järjestys on tärkeä. Jos laittaisimme ensimmäiseksi komponentin <i>Home</i>, jonka polku on <i> path="/"</i>, ei mitää muuta komponenttia koskaan renderöitäisi, sillä "olematon" polku on minkä tahansa polun alkuosa:

```js 
<Switch>
  <Route path="/"> // highlight-line
    <Home /> // highlight-line
  </Route> // highlight-line
  
  <Route path="/notes">
    <Notes />
  </Route>
  // ...
</Switch>
```

### Parameterized route

Let's examine the slightly modified version from the previous example. The complete code for the example can be found [here](https://github.com/fullstack-hy2020/misc/blob/master/router-app-v1.js).

The application now contains five different views, the display of which is controlled by the router. In addition to the components from the previous example (<i>Home</i>, <i>Notes</i> and <i>Users</i>), we have <i>Login</i> representing the login view and <i>Note</i> representing the view of a single note.

<i>Home</i> and <i>Users</i> are unchanged from the previous exercise.  <i>Notes</i> is a bit more complicated. It renders the list of notes passed to it as props in such a way that the name of each note is clickable.

![](../../images/7/3ea.png)

The ability to click a name is implemented with the component <i>Link</i>, and clicking the name of a note whose id is 3 would trigger an event that changes the address of the browser into <i>notes/3</i>:

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

Parametrisoitu url määritellään komponentissa <i>App</i> olevaan reititykseen seuraavasti:

```js
<Router>
  <div>
    <div>
      <Link style={padding} to="/">home</Link>
      <Link style={padding} to="/notes">notes</Link>
      <Link style={padding} to="/users">users</Link>
    </div>

    <Switch>
    // highlight-start
      <Route path="/notes/:id">
        <Note notes={notes} />
      </Route>
      // highlight-end
      <Route path="/notes">
        <Notes notes={notes} />
      </Route>
      <Route path="/">
        <Home />
      </Route>
    </Switch>

</Router>
```

Yksittäisen muistiinpanon näkymän renderöivä route siis määritellään "expressin tyyliin" merkkaamalla reitin parametrina oleva osa merkinnällä <i>:id</i>

```js
<Route path="/notes/:id">
```

Kun selain siirtyy muistiinpanon yksilöivään osoitteeseen, esim. <i>/notes/3</i>, renderöidään komponentti <i>Note</i>:

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
      <div><strong>{note.important ? 'tärkeä' : ''}</strong></div>
    </div>
  )
}
```

Komponentti _Note_ saa parametrikseen kaikki muistiinpanot propsina <i>notes</i> ja se pääsee urlin yksilöivään osaan, eli näytettävän muistiinpanon id:hen käsiksi  react-routerin funktion [useParams](https://reacttraining.com/react-router/web/api/Hooks/useparams) avulla. 

### useHistory

Sovellukseen on myös toteutettu erittäin yksinkertainen kirjautumistoiminto. Jos sovellukseen ollaan kirjautuneena, talletetaan tieto kirjautuneesta käyttäjästä komponentin <i>App</i> tilaan <i>user</i>.

The option to navigate to the <i>Login</i>-view is rendered conditionally in the menu.

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

So if the user is already logged in, instead of displaying the link <i>Login</i> we show the username of the user:

![](../../images/7/4a.png)

The code of the component handling the login functionality is as follows 

```js
import {
  // ...
  useHistory // highlight-line
} from 'react-router-dom'

const Login = (props) => {
  const history = useHistory() // highlight-line

  const onSubmit = (event) => {
    event.preventDefault()
    props.onLogin('mluukkai')
    history.push('/') // highlight-line
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

Mielenkiinoista komponentissa on react-routerin funktion [useHistory](https://reacttraining.com/react-router/web/api/Hooks/usehistory) käyttö. Funktion avulla komponentti pääsee käsiksi [history](https://reacttraining.com/react-router/web/api/history)-olioon, joka taas mahdollistaa mm. selaimen osoiterivin muokkaamisen ohjelmallisesti.

Kirjautumisen yhteydessä kutsutaan history-olion metodia push. Komento _history.push('/')_ saa aikaan sen, että selaimen osoiteriville tulee osoitteeksi _/_ ja sovellus renderöi osoitetta vastaavan komponentin <i>Home</i>.

Käyttämämme react-router-kirjaston funktiot [useParams](https://reacttraining.com/react-router/web/api/Hooks/useparams) ja [useHistory](https://reacttraining.com/react-router/web/api/Hooks/usehistory) ovat molemmat hook-funktiota, samaan tapaan kuin esim. moneen kertaan käyttämämme useState ja useEffect. Kuten muistamme osasta 1, hook-funktioiden käyttöön liittyy tiettyjä [sääntöjä](/osa1/monimutkaisempi_tila_reactin_debuggaus#hookien-saannot). Create-react-app on konfiguroitu varoittamaan, jos hookien säännöt rikkoutuvat, esim. jos hook-funktiota yritetään kutsua ehtolauseen sisältä. 

### redirect

There is one more interesting detail about the <i>Users</i> route: 

```js
<Route path="/users" render={() =>
  user ? <Users /> : <Redirect to="/login" />
} />
```

If a user isn't logged in, the <i>Users</i> component is not rendered. Instead the user is <i>redirected</i> using the <i>Redirect</i>-component to the login view

```js
<Redirect to="/login" />
```

In reality it would perhaps be better to not even show links in the navigation bar requiring login if the user is not logged into the application.

Here is the <i>App</i> component in its entirety:

```js
const App = () => {
  const [notes, setNotes] = useState([
    // ...
  ])

  const [user, setUser] = useState(null) 

  const login = (user) => {
    setUser(user)
  }

  const padding = { padding: 5 }

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

        <Switch>
          <Route path="/notes/:id">
            <Note notes={notes} />
          </Route>
          <Route path="/notes">
            <Notes notes={notes} />
          </Route>
          <Route path="/users">
            {user ? <Users /> : <Redirect to="/login" />}
          </Route>
          <Route path="/login">
            <Login onLogin={login} />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>      
      <div>
        <br />
        <em>Note app, Department of Computer Science 2020</em>
      </div>
    </div>
  )
}
```
We define an element common for modern web apps called <i>footer</i>, which defines the part at the bottom of the screen, outside of the <i>Router</i>, so that it is shown regardless of the component shown in the routed part of the application.


### Parametroitu route revisited

Sovelluksessa on eräs hieman ikävä seikka. Komponentti _Note_ saa propseina kaikki muistiinpanot, vaikka se näyttää niistä ainoastaan sen, jonka id vastaa urlin parametroitua osaa:


```js
const Note = ({ notes }) => { 
  const id = useParams().id
  const note = notes.find(n => n.id === Number(id))
  // ...
}
```

Olisiko mahdollista muuttaa sovellusta siten, että _Note_ saisi propsina ainoastaan näytettävän komponentin:

```js
const Note = ({ note }) => {
  return (
    <div>
      <h2>{note.content}</h2>
      <div>{note.user}</div>
      <div><strong>{note.important ? 'tärkeä' : ''}</strong></div>
    </div>
  )
}
```

Eräs tapa muuttaa sovellusta olisi selvittää näytettävän muistiinpanon _id_ komponentissa _App_ react-routerin hook-funktion [useRouteMatch](https://reacttraining.com/react-router/web/api/Hooks/useroutematch) avulla.

<i>useRouteMatch</i>-hookin käyttö [ei ole](https://github.com/ReactTraining/react-router/issues/7015)  mahdollista samassa komponentissa, joka määrittelee sovelluksen reititettävän osan. Siirretäänkin _Router_-komponenttien käyttö komponentin _App_ ulkopuolelle:

```js
ReactDOM.render(
  <Router> // highlight-line
    <App />
  </Router>, // highlight-line
  document.getElementById('root')
)
```

Komponentti _App_ muuttuu seuraavasti:

```js
import {
  // ...
  useRouteMatch  // highlight-line
} from "react-router-dom"

const App = () => {
  // ...

 // highlight-start
  const match = useRouteMatch('/notes/:id')
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

      <Switch>
        <Route path="/notes/:id">
          <Note note={note} /> // highlight-line
        </Route>
        <Route path="/notes">
          <Notes notes={notes} />
        </Route>
         // ...
      </Switch>

      <div>
        <em>Note app, Department of Computer Science 2020</em>
      </div>
    </div>
  )
}    
```

Joka kerta kun komponentti renderöidään, eli käytännössä myös aina kun sovelluksen osoiterivillä oleva url, vaihtuu suoritetaan komento

```js
const match = useRouteMatch('/notes/:id')
```

Jos url on muotoa _/notes/:id_ eli vastaa yksittäisen muistiinpanon urlia, saa muuttuja _match_ arvokseen olion, jonka polun parametroitu osa, eli muistiinpanon id voidaan selvittää, ja näin saadaan haettua renderöitävä muistiinpano

```js
const note = match 
  ? notes.find(note => note.id === Number(match.params.id))
  : null
```

Lopullinen koodi on kokonaisuudessaan [täällä](https://github.com/fullstack-hy2020/misc/blob/master/router-app-v2.js).

</div>
<div class="tasks">

### Exercises

Let's return to working with anecdotes. Use the redux-free anecdote app found in the repository <https://github.com/fullstack-hy2020/routed-anecdotes> as the starting point for the exercises.

If you clone the project into an existing git repository remember to <i>delete the git configuration of the cloned application:</i>

```bash
cd routed-anecdotes   // go first to directory of the cloned repository
rm -rf .git
```

The application starts the usual way, but first you need to install the dependencies of the application:

```bash
npm install
npm start
```

#### 7.1: routed anecdotes, step1

Add React Router to the application so that by clicking links in the <i>Menu</i>-component the view can be changed.

At the root of the application, meaning the path _/_, show the list of anecdotes:

![](../../assets/teht/40.png)

The <i>Footer</i>-component should always be visible at the bottom.

The creation of a new anecdote should happen e.g. in the path <i>create</i>:

![](../../assets/teht/41.png)

#### 7.2: routed anecdotes, step2

Implement a view for showing a single anecdote:

![](../../assets/teht/42.png)

Navigating to the page showing the single anecdote is done by clicking the name of that anecdote

![](../../assets/teht/43.png)

#### 7.3: routed anecdotes, step3

The default functionality of the creation form is quite confusing, because nothing seems to be happening after creating a new anecdote using the form.

Improve the functionality such that after creating a new anecdote the application transitions automatically to showing the view for all anecdotes <i>and</i> the user is shown a notification informing them of this successful creation for the next 10 seconds:

![](../../assets/teht/44.png)

</i>
