---
mainImage: ../../../images/part-5.svg
part: 5
letter: a
lang: fr
---

<div class="content">

Dans les deux dernières parties, nous nous sommes principalement concentrés sur le backend. Le frontend que nous avons développé dans la [partie 2](/fr/part2) ne prend pas encore en charge la gestion des utilisateurs que nous avons mise en oeuvre dans le backend de la partie 4.

Pour le moment, le frontend affiche les notes existantes et permet aux utilisateurs de changer l'état d'une note de important à non important et vice versa. Il n'est plus possible d'ajouter de nouvelles notes en raison des changements apportés au backend dans la partie 4: le backend attend désormais qu'un jeton vérifiant l'identité d'un utilisateur soit envoyé avec la nouvelle note.

Nous allons maintenant mettre en oeuvre une partie de la fonctionnalité de gestion des utilisateurs requise dans le frontend. Commençons par la connexion des utilisateurs. Tout au long de cette partie, nous supposerons que de nouveaux utilisateurs ne seront pas ajoutés depuis le frontend.

### Gestion de la connexion

Un formulaire de connexion a maintenant été ajouté en haut de la page:

![navigateur affichant la connexion utilisateur pour les notes](../../images/5/1new.png)

Le code du composant <i>App</i> se présente désormais comme suit:

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

Le code de l'application actuelle peut être trouvé sur [Github](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-1), branche <i>part5-1</i>. Si vous clonez le repo, n'oubliez pas d'exécuter _npm install_ avant d'essayer d'exécuter le frontend.

Le frontend n'affichera aucune note s'il n'est pas connecté au backend. Vous pouvez démarrer le backend avec _npm run dev_ dans son dossier de la Partie 4. Cela exécutera le backend sur le port 3001. Pendant que cela est actif, dans une fenêtre de terminal séparée, vous pouvez démarrer le frontend avec _npm start_, et maintenant vous pouvez voir les notes qui sont sauvegardées dans votre base de données MongoDB de la Partie 4.

Gardez cela à l'esprit à partir de maintenant.

Le formulaire de connexion est géré de la même manière que nous avons géré les formulaires dans la [partie 2](/fr/part2/formulaires). L'état de l'application a des champs pour <i>username</i> (nom d'utilisateur) et <i>password</i> (mot de passe) pour stocker les données du formulaire. Les champs du formulaire ont des gestionnaires d'événements, qui synchronisent les changements dans le champ avec l'état du composant <i>App</i>. Les gestionnaires d'événements sont simples : un objet leur est donné en paramètre, et ils déstructurent le champ <i>target</i> de l'objet et sauvegardent sa valeur dans l'état.

```js
({ target }) => setUsername(target.value)
```

La méthode _handleLogin_, qui est responsable de la gestion des données du formulaire, reste à implémenter.

La connexion se fait en envoyant une requête HTTP POST à l'adresse du serveur <i>api/login</i>. Séparons le code responsable de cette requête dans son propre module, dans le fichier <i>services/login.js</i>.

Nous utiliserons la syntaxe <i>async/await</i> au lieu des promesses pour la requête HTTP:

```js
import axios from 'axios'
const baseUrl = '/api/login'

const login = async credentials => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { login }
```

La méthode pour gérer la connexion peut être implémentée comme suit:

```js
import loginService from './services/login' // highlight-line

const App = () => {
  // ...
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
// highlight-start
  const [user, setUser] = useState(null)
// highlight-end
  
  // highlight-start
  const handleLogin = async (event) => {
    event.preventDefault()
    
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

Si la connexion est réussie, les champs du formulaire sont vidés <i>et</i> la réponse du serveur (incluant un <i>jeton</i> et les détails de l'utilisateur) est sauvegardée dans le champ <i>user</i> de l'état de l'application.

Si la connexion échoue ou si l'exécution de la fonction _loginService.login_ résulte en une erreur, l'utilisateur est notifié.

L'utilisateur n'est pas informé d'une connexion réussie de quelque manière que ce soit. Modifions l'application pour afficher le formulaire de connexion uniquement <i>si l'utilisateur n'est pas connecté</i>, donc quand _user === null_. Le formulaire pour ajouter de nouvelles notes est montré uniquement si <i>l'utilisateur est connecté</i>, donc <i>user</i> contient les détails de l'utilisateur.

Ajoutons deux fonctions d'aide au composant <i>App</i> pour générer les formulaires:

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

et les rendre conditionnellement:

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

Une astuce légèrement inhabituelle mais fréquemment utilisée en [React](https://react.dev/learn/conditional-rendering#logical-and-operator-) est utilisée pour le rendu conditionnel des formulaires:

```js
{
  user === null && loginForm()
}
```

Si la première instruction est évaluée à faux ou est considérée comme [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy), la seconde instruction (générant le formulaire) n'est pas du tout exécutée.

Nous pouvons rendre cela encore plus direct en utilisant l'[opérateur conditionnel](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator):

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

Si _user === null_ est considéré comme [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy), _loginForm()_ est exécuté. Sinon, c'est _noteForm()_ qui l'est.

Faisons une dernière modification. Si l'utilisateur est connecté, son nom est affiché à l'écran:


```js
return (
  <div>
    <h1>Notes</h1>

    <Notification message={errorMessage} />

    {!user && loginForm()} 
    {user && <div>
       <p>{user.name} logged in</p>
         {noteForm()}
      </div>
    }

    <h2>Notes</h2>

    // ...

  </div>
)
```

La solution n'est pas parfaite, mais nous allons la laisser telle quelle pour l'instant.

Notre composant principal <i>App</i> est actuellement bien trop volumineux. Les changements que nous avons effectués maintenant sont un signe clair que les formulaires devraient être refactorisés dans leurs propres composants. Cependant, nous laisserons cela pour un exercice optionnel.

Le code actuel de l'application peut être trouvé sur [GitHub](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-2), branche <i>part5-2</i>.

### Création de nouvelles notes

Le jeton renvoyé avec une connexion réussie est sauvegardé dans l'état de l'application - le champ <i>token</i> de l'<i>utilisateur</i>:

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

Réparons la création de nouvelles notes pour qu'elle fonctionne avec le backend. Cela signifie ajouter le jeton de l'utilisateur connecté à l'en-tête d'autorisation de la requête HTTP.

Le module <i>noteService</i> change ainsi:

```js
import axios from 'axios'
const baseUrl = '/api/notes'

let token = null // highlight-line

// highlight-start
const setToken = newToken => {
  token = `Bearer ${newToken}`
}
// highlight-end

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

// highlight-start
const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }
// highlight-end

  const response = await axios.post(baseUrl, newObject, config) // highlight-line
  return response.data
}

const update = (id, newObject) => {
  const request = axios.put(`${ baseUrl }/${id}`, newObject)
  return request.then(response => response.data)
}

export default { getAll, create, update, setToken } // highlight-line
```

Le module noteService contient une variable privée _token_. Sa valeur peut être modifiée avec une fonction _setToken_, qui est exportée par le module. _create_, maintenant avec la syntaxe async/await, définit le jeton dans l'en-tête <i>Authorization</i>. L'en-tête est donné à axios comme le troisième paramètre de la méthode <i>post</i>.

Le gestionnaire d'événements responsable de la connexion doit être modifié pour appeler la méthode <code>noteService.setToken(user.token)</code> lors d'une connexion réussie:

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

Et maintenant, l'ajout de nouvelles notes fonctionne à nouveau!

### Sauvegarder le jeton dans le stockage local du navigateur

Notre application a un petit défaut : si le navigateur est actualisé (par exemple, en appuyant sur F5), les informations de connexion de l'utilisateur disparaissent.

Ce problème est facilement résolu en sauvegardant les détails de connexion dans le [stockage local](https://developer.mozilla.org/en-US/docs/Web/API/Storage). Le stockage local est une base de données [clé-valeur](https://en.wikipedia.org/wiki/Key-value_database) dans le navigateur.

Il est très facile à utiliser. Une <i>valeur</i> correspondant à une certaine <i>clé</i> est sauvegardée dans la base de données avec la méthode [setItem](https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem). Par exemple:

```js
window.localStorage.setItem('name', 'juha tauriainen')
```

sauvegarde la chaîne donnée comme deuxième paramètre comme la valeur de la clé <i>name</i>.

La valeur d'une clé peut être trouvée avec la méthode [getItem](https://developer.mozilla.org/en-US/docs/Web/API/Storage/getItem):

```js
window.localStorage.getItem('name')
```

et [removeItem](https://developer.mozilla.org/en-US/docs/Web/API/Storage/removeItem) supprime une clé.

Les valeurs dans le stockage local sont persistées même lorsque la page est réaffichée. Le stockage est spécifique à l'[origine](https://developer.mozilla.org/en-US/docs/Glossary/Origin), donc chaque application web a son propre stockage.

Étendons notre application de sorte qu'elle sauvegarde les détails d'un utilisateur connecté dans le stockage local.

Les valeurs sauvegardées dans le stockage sont des [DOMstrings](https://docs.w3cub.com/dom/domstring), donc nous ne pouvons pas sauvegarder un objet JavaScript tel quel. L'objet doit d'abord être converti en JSON, avec la méthode _JSON.stringify_. De manière correspondante, lorsqu'un objet JSON est lu depuis le stockage local, il doit être reconverti en JavaScript avec _JSON.parse_.

Les modifications apportées à la méthode de connexion sont les suivantes:

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

Les détails d'un utilisateur connecté sont maintenant sauvegardés dans le stockage local, et ils peuvent être consultés dans la console (en tapant _window.localStorage_ dans la console) :

![navigateur montrant quelqu'un connecté aux notes](../../images/5/3e.png)

Vous pouvez également inspecter le stockage local en utilisant les outils de développement. Sur Chrome, allez à l'onglet <i>Application</i> et sélectionnez <i>Stockage local</i> (plus de détails [ici](https://developers.google.com/web/tools/chrome-devtools/storage/localstorage))). Sur Firefox, allez à l'onglet <i>Stockage</i> et sélectionnez <i>Stockage local</i> (détails [ici](https://developer.mozilla.org/en-US/docs/Tools/Storage_Inspector)).

Nous devons encore modifier notre application pour que, lorsque nous entrons sur la page, l'application vérifie si les détails d'un utilisateur connecté peuvent déjà être trouvés dans le stockage local. Si c'est le cas, les détails sont sauvegardés dans l'état de l'application et dans <i>noteService</i>.

La bonne manière de faire cela est avec un [hook d'effet](https://react.dev/reference/react/useEffect): un mécanisme que nous avons rencontré pour la première fois dans la [partie 2](/fr/part2/obtenir_des_donnees_du_serveur#hooks-deffet), et utilisé pour récupérer des notes depuis le serveur.

Nous pouvons avoir plusieurs hooks d'effet, créons-en donc un second pour gérer le premier chargement de la page:

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

Le tableau vide comme paramètre de l'effet garantit que l'effet est exécuté uniquement lorsque le composant est rendu [pour la première fois](https://react.dev/reference/react/useEffect#parameters).

Maintenant, un utilisateur reste connecté à l'application indéfiniment. Nous devrions probablement ajouter une fonctionnalité de <i>déconnexion</i> qui supprime les détails de connexion du stockage local. Nous le laisserons cependant comme exercice.

Il est possible de déconnecter un utilisateur en utilisant la console, et cela suffit pour le moment.
Vous pouvez vous déconnecter avec la commande:

```js
window.localStorage.removeItem('loggedNoteappUser')
```

ou avec la commande qui vide complètement le <i>localstorage</i>:

```js
window.localStorage.clear()
```


Le code actuel de l'application peut être trouvé sur [GitHub](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-3), branche <i>part5-3</i>.

</div>

<div class="tasks">

### Exercices 5.1.-5.4.

Nous allons maintenant créer un frontend pour le backend de liste de blogs que nous avons créé dans la dernière partie. Vous pouvez utiliser [cette application](https://github.com/fullstack-hy2020/bloglist-frontend) sur GitHub comme base pour votre solution. Vous devez connecter votre backend avec un proxy comme montré dans la [partie 3](/fr/part3/deployer_votre_application_sur_internet#proxy).

Il suffit de soumettre votre solution terminée. Vous pouvez faire un commit après chaque exercice, mais cela n'est pas nécessaire.

Les premiers exercices révisent tout ce que nous avons appris sur React jusqu'à présent. Ils peuvent être difficiles, surtout si votre backend est incomplet.
Il pourrait être préférable d'utiliser le backend que nous avons marqué comme réponse pour la partie 4.

Pendant que vous faites les exercices, rappelez-vous toutes les méthodes de débogage dont nous avons parlé, en gardant particulièrement un oeil sur la console.

**Attention:** Si vous remarquez que vous mélangez les fonctions _async/await_ et les commandes _then_, il est à 99,9 % certain que vous faites quelque chose de mal. Utilisez l'un ou l'autre, jamais les deux.

#### 5.1 : bloglist frontend, étape 1

Clonez l'application depuis [GitHub](https://github.com/fullstack-hy2020/bloglist-frontend) avec la commande:

```bash
git clone https://github.com/fullstack-hy2020/bloglist-frontend
```

<i>supprimez la configuration git de l'application clonée</i>

```bash
cd bloglist-frontend   // go to cloned repository
rm -rf .git
```

L'application est démarrée de la manière habituelle, mais vous devez d'abord installer ses dépendances:

```bash
npm install
npm run dev
```

Implémentez la fonctionnalité de connexion au frontend. Le jeton renvoyé lors d'une connexion réussie est sauvegardé dans l'état <i>user</i> de l'application.

Si un utilisateur n'est pas connecté, <i>seul</i> le formulaire de connexion est visible.

![navigateur montrant uniquement le formulaire de connexion visible](../../images/5/4e.png)

Si l'utilisateur est connecté, le nom de l'utilisateur et une liste de blogs sont affichés.

![navigateur montrant les notes et qui est connecté](../../images/5/5e.png)

Les détails de l'utilisateur connecté n'ont pas encore à être sauvegardés dans le stockage local.

**NB** Vous pouvez implémenter le rendu conditionnel du formulaire de connexion comme ceci par exemple:

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

#### 5.2 : bloglist frontend, étape 2

Rendez la connexion 'permanente' en utilisant le stockage local. Implémentez également un moyen de se déconnecter.

![navigateur montrant le bouton de déconnexion après la connexion](../../images/5/6e.png)

Assurez-vous que le navigateur ne se souvient pas des détails de l'utilisateur après la déconnexion.

#### 5.3 : bloglist frontend, étape 3

Étendez votre application pour permettre à un utilisateur connecté d'ajouter de nouveaux blogs :

![navigateur montrant le formulaire de nouveau blog](../../images/5/7e.png)

#### 5.4 : bloglist frontend, étape 4

Implémentez des notifications qui informent l'utilisateur des opérations réussies et échouées en haut de la page. Par exemple, lorsqu'un nouveau blog est ajouté, la notification suivante peut être affichée:

![navigateur montrant une opération réussie](../../images/5/8e.png)

Une tentative de connexion échouée peut afficher la notification suivante:

![navigateur montrant une tentative de connexion échouée](../../images/5/9e.png)

Les notifications doivent être visibles quelques secondes. Il n'est pas obligatoire d'ajouter des couleurs.

</div>

<div class="content">

### Remarque sur l'utilisation du stockage local

À la [fin](/fr/part4/jeton_dauthentification#problemes-de-lauthentification-basee-sur-des-jetons) de la dernière partie, nous avons mentionné que le défi de l'authentification basée sur les jetons est de savoir comment faire face à la situation où l'accès à l'API du détenteur du jeton doit être révoqué.

Il existe deux solutions à ce problème. La première consiste à limiter la période de validité d'un jeton. Cela oblige l'utilisateur à se reconnecter à l'application une fois le jeton expiré. L'autre approche consiste à sauvegarder les informations de validité de chaque jeton dans la base de données du backend. Cette solution est souvent appelée une <i>session côté serveur</i>.

Peu importe comment la validité des jetons est vérifiée et assurée, sauvegarder un jeton dans le stockage local peut contenir un risque de sécurité si l'application a une vulnérabilité de sécurité qui permet des attaques [Cross Site Scripting (XSS)](https://owasp.org/www-community/attacks/xss/). Une attaque XSS est possible si l'application permettait à un utilisateur d'injecter un code JavaScript arbitraire (par exemple, en utilisant un formulaire) que l'application exécuterait ensuite. Lors de l'utilisation sensée de React, cela ne devrait pas être possible puisque [React assainit](https://legacy.reactjs.org/docs/introducing-jsx.html#jsx-prevents-injection-attacks) tout le texte qu'il rend, ce qui signifie qu'il n'exécute pas le contenu rendu en tant que JavaScript.

Si l'on veut jouer la sécurité, la meilleure option est de ne pas stocker un jeton dans le stockage local. Cela pourrait être une option dans des situations où la fuite d'un jeton pourrait avoir des conséquences tragiques.

Il a été suggéré que l'identité d'un utilisateur connecté devrait être sauvegardée sous forme de [cookies httpOnly](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#restrict_access_to_cookies), de sorte que le code JavaScript ne puisse avoir aucun accès au jeton. L'inconvénient de cette solution est qu'elle rendrait la mise en oeuvre d'applications SPA un peu plus complexe. Il serait nécessaire au moins de mettre en oeuvre une page séparée pour la connexion.

Cependant, il est bon de noter que même l'utilisation de cookies httpOnly ne garantit rien. Il a même été suggéré que les cookies httpOnly [ne sont pas plus sûrs que](https://academind.com/tutorials/localstorage-vs-cookies-xss/) l'utilisation du stockage local.

Donc, quelle que soit la solution utilisée, la chose la plus importante est de [minimiser le risque](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html) d'attaques XSS dans son ensemble.

</div>