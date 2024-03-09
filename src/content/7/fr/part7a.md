---
mainImage: ../../../images/part-7.svg
part: 7
letter: a
lang: fr
---

<div class="content">

Les exercices de cette septième partie du cours diffèrent un peu de ceux d'avant. Dans ce chapitre et le suivant, comme d'habitude, il y a des [exercices liés à la théorie du chapitre](/en/part7/react_router#exercises-7-1-7-3).

En plus des exercices de ce chapitre et du suivant, il y a une série d'exercices dans lesquels nous réviserons ce que nous avons appris durant tout le cours en élargissant l'application Bloglist sur laquelle nous avons travaillé pendant les parties 4 et 5.

### Structure de navigation de l'application

Après la partie 6, nous revenons à React sans Redux.

Il est très courant que les applications web aient une barre de navigation, qui permet de changer la vue de l'application.

Notre application pourrait avoir une page principale

![navigateur montrant l'app de notes avec le lien de navigation home](../../images/7/1ea.png)

et des pages séparées pour afficher des informations sur les notes et les utilisateurs:

[navigateur montrant l'app de notes avec le lien de navigation notes](../../images/7/2ea.png)

Dans une [application web à l'ancienne](/fr/part0/introduction_aux_applications_web#applications-web-traditionnelles), changer la page affichée par l'application serait accompli par le navigateur effectuant une requête HTTP GET au serveur et rendant le HTML représentant la vue qui a été retournée.

Dans les applications à page unique, nous sommes, en réalité, toujours sur la même page. Le code Javascript exécuté par le navigateur crée une illusion de différentes "pages". Si des requêtes HTTP sont faites lors du changement de vues, elles sont uniquement pour récupérer des données formatées en JSON, dont la nouvelle vue pourrait avoir besoin pour être affichée.

La barre de navigation et une application contenant plusieurs vues sont très faciles à implémenter en utilisant React.

Voici une manière de le faire:

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

Chaque vue est implémentée comme son propre composant. Nous stockons les informations du composant de vue dans l'état de l'application appelé <i>page</i>. Ces informations nous indiquent quel composant, représentant une vue, devrait être affiché sous la barre de menu.

Cependant, la méthode n'est pas très optimale. Comme nous pouvons le voir sur les images, l'adresse reste la même même si parfois nous sommes dans des vues différentes. Chaque vue devrait de préférence avoir sa propre adresse, par exemple pour rendre possible l'ajout aux favoris. Le bouton <i>retour</i> ne fonctionne pas comme prévu pour notre application non plus, signifiant que <i>retour</i> ne vous déplace pas vers la vue précédemment affichée de l'application, mais quelque part complètement différent. Si l'application devait grandir encore plus et que nous voulions, par exemple, ajouter des vues séparées pour chaque utilisateur et note, alors ce <i>routing</i> fait maison, qui signifie la gestion de la navigation de l'application, deviendrait excessivement compliqué.

### React Router

Heureusement, React dispose de la bibliothèque [React Router](https://reactrouter.com/) qui fournit une excellente solution pour gérer la navigation dans une application React.

Changeons l'application ci-dessus pour utiliser React Router. D'abord, nous installons React Router avec la commande

```bash
npm install react-router-dom
```

Le routage fourni par React Router est activé en modifiant l'application comme suit:

```js
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'

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

Le routage, ou le rendu conditionnel de composants <i>en fonction de l'URL</i> dans le navigateur, est utilisé en plaçant les composants comme enfants du composant <i>Router</i>, c'est-à-dire à l'intérieur des balises <i>Router</i>.

Notez que, même si le composant est désigné par le nom <i>Router</i>, nous parlons de [BrowserRouter](https://reactrouter.com/en/main/router-components/browser-router), car ici l'importation se fait en renommant l'objet importé:

```js
import {
  BrowserRouter as Router, // highlight-line
  Routes, Route, Link
} from 'react-router-dom'
```

Selon la [documentation v5](https://v5.reactrouter.com/web/api/BrowserRouter):

> <i>BrowserRouter</i> est un <i>Router</i> qui utilise l'API d'historique HTML5 (pushState, replaceState et l'événement popState) pour maintenir votre UI synchronisée avec l'URL.

Normalement, le navigateur charge une nouvelle page lorsque l'URL dans la barre d'adresse change. Cependant, avec l'aide de [l'API d'historique HTML5](https://css-tricks.com/using-the-html5-history-api/), <i>BrowserRouter</i> nous permet d'utiliser l'URL dans la barre d'adresse du navigateur pour le "routage" interne dans une application React. Ainsi, même si l'URL dans la barre d'adresse change, le contenu de la page est uniquement manipulé en utilisant Javascript, et le navigateur ne chargera pas de nouveau contenu depuis le serveur. L'utilisation des actions retour et avance, ainsi que la création de signets, reste logique comme sur une page web traditionnelle.

À l'intérieur du routeur, nous définissons des <i>liens</i> qui modifient la barre d'adresse avec l'aide du composant [Link](https://reactrouter.com/en/main/components/link). Par exemple,

```js
<Link to="/notes">notes</Link>
```

crée un lien dans l'application avec le texte <i>notes</i>, qui, lorsqu'il est cliqué, change l'URL dans la barre d'adresse en <i>/notes</i>.

Les composants rendus en fonction de l'URL du navigateur sont définis avec l'aide du composant [Route](https://reactrouter.com/en/main/route/route). Par exemple,

```js
<Route path="/notes" element={<Notes />} />
```

définit que, si l'adresse du navigateur est <i>/notes</i>, nous rendons le composant <i>Notes</i>.

Nous enveloppons les composants à rendre en fonction de l'URL avec un composant [Routes](https://reactrouter.com/en/main/components/routes)

```js
<Routes>
  <Route path="/notes" element={<Notes />} />
  <Route path="/users" element={<Users />} />
  <Route path="/" element={<Home />} />
</Routes>
```

Routes fonctionne en rendant le premier composant dont le <i>path</i> correspond à l'URL dans la barre d'adresse du navigateur.

### Route paramétrée

Examinons une version légèrement modifiée de l'exemple précédent. Le code complet de l'exemple mis à jour peut être trouvé [ici](https://github.com/fullstack-hy2020/misc/blob/master/router-app-v1.js).

L'application contient maintenant cinq vues différentes dont l'affichage est contrôlé par le routeur. En plus des composants de l'exemple précédent (<i>Home</i>, <i>Notes</i> et <i>Users</i>), nous avons <i>Login</i> représentant la vue de connexion et <i>Note</i> représentant la vue d'une note unique.

<i>Home</i> et <i>Users</i> sont inchangés par rapport à l'exercice précédent. <i>Notes</i> est un peu plus compliqué. Il rend la liste des notes qui lui sont passées en props de manière à ce que le nom de chaque note soit cliquable.

![application de notes montrant que les notes sont cliquables](../../images/7/3ea.png)

La possibilité de cliquer sur un nom est mise en oeuvre avec le composant <i>Link</i>, et cliquer sur le nom d'une note dont l'id est 3 déclencherait un événement qui change l'adresse du navigateur en <i>notes/3</i>:

```js
const Notes = ({notes}) => (
  <div>
    <h2>Notes</h2>
    <ul>
      {notes.map(note =>
        <li key={note.id}>
          <Link to={`/notes/${note.id}`}>{note.content}</Link>  // highlight-line
        </li>
      )}
    </ul>
  </div>
)
```

Nous définissons des URL paramétrées dans le routage dans le composant <i>App</i> comme suit:

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

Nous définissons la route qui rend une note spécifique "à la manière d'Express" en marquant le paramètre avec deux points - <i>:id</i>

```js
<Route path="/notes/:id" element={<Note notes={notes} />} />
```

Lorsqu'un navigateur navigue vers l'URL d'une note spécifique, par exemple, <i>/notes/3</i>, nous rendons le composant <i>Note</i>:

```js
import {
  // ...
  useParams  // highlight-line
} from 'react-router-dom'

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

Le composant _Note_ reçoit toutes les notes en tant que props <i>notes</i>, et il peut accéder au paramètre de l'URL (l'id de la note à afficher) avec la fonction [useParams](https://reactrouter.com/en/main/hooks/use-params) de React Router.

### useNavigate

Nous avons également implémenté une fonction de connexion simple dans notre application. Si un utilisateur est connecté, les informations concernant un utilisateur connecté sont sauvegardées dans le champ <i>user</i> de l'état du composant <i>App</i>.

L'option de naviguer vers la vue <i>Login</i> est rendue conditionnellement dans le menu.

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

Donc, si l'utilisateur est déjà connecté, au lieu d'afficher le lien <i>Login</i>, nous montrons le nom d'utilisateur:

[application de notes du navigateur montrant le nom d'utilisateur connecté](../../images/7/4a.png))

Le code du composant gérant la fonctionnalité de connexion est le suivant:

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

Ce qui est intéressant à propos de ce composant est l'utilisation de la fonction [useNavigate](https://reactrouter.com/en/main/hooks/use-navigate) de React Router. Avec cette fonction, l'URL du navigateur peut être modifiée de manière programmatique.

Lors de la connexion de l'utilisateur, nous appelons _navigate('/')_ ce qui provoque le changement de l'URL du navigateur en _/_ et l'application rend le composant correspondant <i>Home</i>.

Les fonctions [useParams](https://reactrouter.com/en/main/hooks/use-params) et [useNavigate](https://reactrouter.com/en/main/hooks/use-navigate) sont des fonctions de hook, tout comme useState et useEffect que nous avons maintenant utilisées de nombreuses fois. Comme vous vous en souvenez de la partie 1, il existe certaines [règles](/fr/part1/plongez_dans_le_debogage_dapplications_react#regles-des-hooks) à respecter lors de l'utilisation des fonctions de hook. Create-react-app a été configuré pour vous avertir si vous enfreignez ces règles, par exemple, en appelant une fonction de hook depuis une instruction conditionnelle.

### redirect

Il y a un autre détail intéressant concernant la route <i>Users</i>:

```js
<Route path="/users" element={user ? <Users /> : <Navigate replace to="/login" />} />
```

Si un utilisateur n'est pas connecté, le composant <i>Users</i> n'est pas rendu. À la place, l'utilisateur est <i>redirigé</i> en utilisant le composant [Navigate](https://reactrouter.com/en/main/components/navigate) vers la vue de connexion:

```js
<Navigate replace to="/login" />
```

En réalité, il serait peut-être préférable de ne même pas afficher dans la barre de navigation les liens nécessitant une connexion si l'utilisateur n'est pas connecté à l'application.

Voici le composant <i>App</i> dans son intégralité:

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
        <em>Note app, Department of Computer Science 2023</em>
      </footer>
    </div>
  )
}
```

Nous définissons un élément commun aux applications web modernes appelé <i>footer</i>, qui définit la partie en bas de l'écran, en dehors du <i>Router</i>, de sorte qu'elle soit affichée indépendamment du composant montré dans la partie routée de l'application.

### Revisite de la route paramétrée

Notre application a un défaut. Le composant _Note_ reçoit toutes les notes, même s'il n'affiche que celle dont l'identifiant correspond au paramètre de l'URL:

```js
const Note = ({ notes }) => { 
  const id = useParams().id
  const note = notes.find(n => n.id === Number(id))
  // ...
}
```

Serait-il possible de modifier l'application de sorte que le composant Note ne reçoive que la note qu'il doit afficher?

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

Une façon de faire cela serait d'utiliser le hook [useMatch](https://reactrouter.com/en/v6.3.0/api#usematch) de React Router pour déterminer l'identifiant de la note à afficher dans le composant _App_.

Il n'est pas possible d'utiliser le hook <i>useMatch</i> dans le composant qui définit la partie routée de l'application. Déplaçons l'utilisation des composants Router depuis App:

```js
ReactDOM.createRoot(document.getElementById('root')).render(
  <Router> // highlight-line
    <App />
  </Router> // highlight-line
)
```

Le composant App devient:

```js
import {
  // ...
  useMatch  // highlight-line
} from 'react-router-dom'

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
        <em>Note app, Department of Computer Science 2023</em>
      </div>
    </div>
  )
}  
```

Chaque fois que le composant est rendu, donc pratiquement chaque fois que l'URL du navigateur change, la commande suivante est exécutée:

```js
const match = useMatch('/notes/:id')
```

Si l'URL correspond à _/notes/:id_, la variable match contiendra un objet à partir duquel nous pouvons accéder à la partie paramétrée du chemin, l'identifiant de la note à afficher, et nous pouvons ensuite récupérer la note correcte à afficher.

```js
const note = match 
  ? notes.find(note => note.id === Number(match.params.id))
  : null
```

Le code complet peut être trouvé [ici](https://github.com/fullstack-hy2020/misc/blob/master/router-app-v2.js).

</div>

<div class="tasks">

Revenons au travail avec les anecdotes. Utilisez l'application d'anecdotes sans Redux trouvée dans le dépôt <https://github.com/fullstack-hy2020/routed-anecdotes> comme point de départ pour les exercices.

Si vous clonez le projet dans un dépôt git existant, n'oubliez pas de <i>supprimer la configuration git de l'application clonée:</i>

```bash
cd routed-anecdotes   // go first to directory of the cloned repository
rm -rf .git
```

L'application démarre de la manière habituelle, mais d'abord, vous devez installer les dépendances de l'application:

```bash
npm install
npm run dev
```

#### 7.1 : anecdotes routées, étape 1

Ajoutez React Router à l'application de sorte qu'en cliquant sur les liens dans le composant <i>Menu</i>, la vue puisse être changée.

À la racine de l'application, signifiant le chemin _/_ , montrez la liste des anecdotes :

![navigateur à l'URL de base montrant les anecdotes et le pied de page](../../assets/teht/40.png)

Le composant <i>Footer</i> doit toujours être visible en bas.

La création d'une nouvelle anecdote devrait se faire par exemple dans le chemin <i>create</i>:

![navigateur anecdotes /create montre le formulaire de création](../../assets/teht/41.png)

#### 7.2 : anecdotes routées, étape 2

Implémentez une vue pour montrer une anecdote unique:

![navigateur /anecdotes/numéro montrant une anecdote unique](../../assets/teht/42.png)

La navigation vers la page montrant l'anecdote unique se fait en cliquant sur le nom de cette anecdote :

![navigateur montrant le lien précédent qui a été cliqué](../../assets/teht/43.png)

#### 7.3 : anecdotes routées, étape 3

La fonctionnalité par défaut du formulaire de création est assez déroutante car rien ne semble se passer après avoir créé une nouvelle anecdote à l'aide du formulaire.

Améliorez la fonctionnalité de telle sorte qu'après avoir créé une nouvelle anecdote, l'application passe automatiquement à la vue montrant toutes les anecdotes <i>et</i> que l'utilisateur reçoit une notification l'informant de cette création réussie pendant les cinq prochaines secondes:

![navigateur anecdotes montrant le message de succès pour l'ajout d'une anecdote](../../assets/teht/44.png)

</div>