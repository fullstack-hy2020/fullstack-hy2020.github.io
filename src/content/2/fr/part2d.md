---
mainImage: ../../../images/part-2.svg
part: 2
letter: d
lang: fr
---

<div class="content">


Lors de la création de notes dans notre application, nous voudrions naturellement les stocker dans un serveur principal. Le package [json-server](https://github.com/typicode/json-server) prétend être une API dite REST ou RESTful dans sa documentation :

> <i>Obtenez une fausse API REST complète sans codage en moins de 30 secondes (sérieusement)</i>

Le serveur json ne correspond pas exactement à la description fournie par le manuel [definition](https://en.wikipedia.org/wiki/Representational_state_transfer) d'une API REST, mais la plupart des autres API prétendant être RESTful non plus.

Nous examinerons de plus près REST dans la [prochaine partie](/fr/part3) du cours. Mais il est important de nous familiariser à ce stade avec certaines des [conventions](https://en.wikipedia.org/wiki/Representational_state_transfer#Applied_to_web_services) utilisées par json-server et les API REST en général. En particulier, nous examinerons l'utilisation conventionnelle des [routes](https://github.com/typicode/json-server#routes), c'est-à-dire des URL et des types de requêtes HTTP, dans REST.

### REST

Dans la terminologie REST, nous nous référons à des objets de données individuels, tels que les notes de notre application, en tant que <i>ressources</i>. Chaque ressource est associée à une adresse unique - son URL. Selon une convention générale utilisée par json-server, nous pourrions localiser une note individuelle à l'URL de la ressource <i>notes/3</i>, où 3 est l'identifiant de la ressource. L'url <i>notes</i>, d'autre part, pointerait vers une collection de ressources contenant toutes les notes.

Les ressources sont extraites du serveur avec des requêtes HTTP GET. Par exemple, une requête HTTP GET à l'URL <i>notes/3</i> renverra la note qui a le numéro d'identification 3. Une requête HTTP GET à l'URL <i>notes</i> renverra une liste de toutes les notes.

La création d'une nouvelle ressource pour stocker une note se fait en faisant une requête HTTP POST à ​​l'URL <i>notes</i> selon la convention REST à laquelle adhère le serveur json. Les données de la nouvelle ressource de note sont envoyées dans le <i>body</i> de la requête.

json-server nécessite que toutes les données soient envoyées au format JSON. Cela signifie en pratique que les données doivent être une chaîne correctement formatée et que la requête doit contenir l'en-tête de requête <i>Content-Type</i> avec la valeur <i>application/json</i>.

### Envoi de données au serveur

Apportons les modifications suivantes au gestionnaire d'événements responsable de la création d'une nouvelle note :

```js
addNote = event => {
  event.preventDefault()
  const noteObject = {
    content: newNote,
    date: new Date(),
    important: Math.random() < 0.5,
  }

// highlight-start
  axios
    .post('http://localhost:3001/notes', noteObject)
    .then(response => {
      console.log(response)
    })
// highlight-end
}
```

Nous créons un nouvel objet pour la note mais omettons la propriété <i>id</i>, car il est préférable de laisser le serveur générer des identifiants pour nos ressources !

L'objet est envoyé au serveur à l'aide de la méthode axios <em>post</em>. Le gestionnaire d'événements enregistré consigne la réponse qui est renvoyée du serveur à la console.

Lorsque nous essayons de créer une nouvelle note, la sortie suivante apparaît dans la console :

![](../../images/2/20e.png)

La ressource de note nouvellement créée est stockée dans la valeur de la propriété <i>data</i> de l'objet _response_.

Parfois, il peut être utile d'inspecter les requêtes HTTP dans l'onglet <i>Réseau</i> des outils de développement Chrome, qui a été largement utilisé au début de la [partie 0](/fr/part0/introduction_aux_applications_web#http-get) :

![](../../images/2/21e.png)

Nous pouvons utiliser l'inspecteur pour vérifier que les en-têtes envoyés dans la requête POST correspondent à ce que nous attendions d'eux et que leurs valeurs sont correctes.

Étant donné que les données que nous avons envoyées dans la requête POST étaient un objet JavaScript, axios a automatiquement su définir la valeur <i>application/json</i> appropriée pour l'en-tête <i>Content-Type</i>.

La nouvelle note n'est pas encore rendue à l'écran. En effet, nous n'avons pas mis à jour l'état du composant <i>App</i> lors de la création de la nouvelle note. Réparons ça :

```js
addNote = event => {
  event.preventDefault()
  const noteObject = {
    content: newNote,
    date: new Date(),
    important: Math.random() > 0.5,
  }

  axios
    .post('http://localhost:3001/notes', noteObject)
    .then(response => {
      // highlight-start
      setNotes(notes.concat(response.data))
      setNewNote('')
      // highlight-end
    })
}
```

La nouvelle note renvoyée par le serveur principal est ajoutée à la liste des notes dans l'état de notre application de la manière habituelle en utilisant la fonction <em>setNotes</em> puis en réinitialisant le formulaire de création de note. Un [détail important](/fr/part1/plongez_dans_le_debogage_dapplications_react#gestion-des-tableaux) à retenir est que la méthode <em>concat</em> ne modifie pas l'état d'origine du composant, mais crée à la place une nouvelle copie de la liste.

Une fois que les données renvoyées par le serveur commencent à avoir un effet sur le comportement de nos applications Web, nous sommes immédiatement confrontés à un tout nouvel ensemble de défis découlant, par exemple, de l'asynchronicité de la communication. Cela nécessite de nouvelles stratégies de débogage, la journalisation de la console et d'autres moyens de débogage deviennent de plus en plus importants. Nous devons également développer une compréhension suffisante des principes des composants d'exécution JavaScript et React. Deviner ne suffira pas.

Il est avantageux d'inspecter l'état du serveur principal, par ex. via le navigateur :

![](../../images/2/22e.png)

Cela permet de vérifier que toutes les données que nous avions l'intention d'envoyer ont bien été reçues par le serveur.

Dans la prochaine partie du cours, nous apprendrons à implémenter notre propre logique dans le backend. Nous examinerons ensuite de plus près des outils tels que [Postman](https://www.postman.com/downloads/) qui nous aident à déboguer nos applications serveur. Cependant, inspecter l'état du serveur json via le navigateur est suffisant pour nos besoins actuels.

> **NB :** Dans la version actuelle de notre application, le navigateur ajoute la propriété date de création à la note. Étant donné que l'horloge de la machine exécutant le navigateur peut être mal configurée, il est beaucoup plus sage de laisser le serveur principal générer cet horodatage pour nous. C'est d'ailleurs ce que nous ferons dans la suite du cours.


Le code de l'état actuel de notre application se trouve sur la branche <i>part2-5</i> sur [GitHub](https://github.com/fullstack-hy2020/part2-notes/tree/part2-5).

### Modification de l'importance des notes

Ajoutons un bouton à chaque note qui peut être utilisé pour changer son importance.

Nous apportons les modifications suivantes au composant <i>Note</i> :

```js
const Note = ({ note, toggleImportance }) => {
  const label = note.important
    ? 'make not important' : 'make important'

  return (
    <li>
      {note.content} 
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}
```

Nous ajoutons un bouton au composant et affectons son gestionnaire d'événements en tant que fonction <em>toggleImportance</em> transmise dans les props du composant.

Le composant <i>App</i> définit une version initiale de la fonction de gestionnaire d'événements <em>toggleImportanceOf</em> et la transmet à chaque composant <i>Note</i> :

```js
const App = () => {
  const [notes, setNotes] = useState([]) 
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  // ...

  // highlight-start
  const toggleImportanceOf = (id) => {
    console.log('importance of ' + id + ' needs to be toggled')
  }
  // highlight-end

  // ...

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>      
      <ul>
        {notesToShow.map(note => 
          <Note
            key={note.id}
            note={note} 
            toggleImportance={() => toggleImportanceOf(note.id)} // highlight-line
          />
        )}
      </ul>
      // ...
    </div>
  )
}
```

Remarquez comment chaque note reçoit sa propre fonction de gestion d'événements <i>unique</i>, puisque l'<i>id</i> de chaque note est unique.

Par exemple, si <i>note.id</i> vaut 3, la fonction de gestion d'événements renvoyée par _toggleImportance(note.id)_ sera :

```js
() => { console.log('importance of 3 needs to be toggled') }
```

Petit rappel ici. La chaîne retournée par le gestionnaire d'événements est définie à la manière de Java en concatenant les chaînes aux moyens de l'opérateur + :

```js
console.log('importance of ' + id + ' needs to be toggled')
```

La syntaxe [template string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) ajoutée dans ES6 peut être utilisée pour écrire des chaînes similaires de manière beaucoup plus agréable :

```js
console.log(`importance of ${id} needs to be toggled`)
```

Nous pouvons maintenant utiliser la syntaxe "dollar-bracket" pour ajouter des parties à la chaîne qui évalueront les expressions JavaScript, par ex. la valeur d'une variable. Notez que les guillemets utilisés dans les chaînes de modèle diffèrent des guillemets utilisés dans les chaînes JavaScript normales.

Les notes individuelles stockées dans le backend json-server peuvent être modifiées de deux manières différentes en envoyant des requêtes HTTP à l'URL unique de la note. Nous pouvons soit <i>remplacer</i> l'intégralité de la note par une requête HTTP PUT, soit modifier uniquement certaines propriétés de la note avec une requête HTTP PATCH.

La forme finale de la fonction de gestion d'événements est la suivante :

```js
const toggleImportanceOf = id => {
  const url = `http://localhost:3001/notes/${id}`
  const note = notes.find(n => n.id === id)
  const changedNote = { ...note, important: !note.important }

  axios.put(url, changedNote).then(response => {
    setNotes(notes.map(n => n.id !== id ? n : response.data))
  })
}
```

Presque chaque ligne de code dans le corps de la fonction contient des détails importants. La première ligne définit l'URL unique pour chaque ressource de note en fonction de son identifiant.

La méthode [find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find) est utilisée pour trouver la note que nous voulons modifier, que nous attribuons ensuite à la variable _note_.

Après cela, nous créons un <i>nouvel objet</i> qui est une copie exacte de l'ancienne note, à l'exception de la propriété importante.

Le code de création du nouvel objet qui utilise la syntaxe de [déstructuration](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) peut sembler un peu étrange au premier abord :

```js
const changedNote = { ...note, important: !note.important }
```

En pratique, <em>{ ...note }</em> crée un nouvel objet avec des copies de toutes les propriétés de l'objet _note_. Lorsque nous ajoutons des propriétés à l'intérieur des accolades après l'objet propagé, par ex. <em>{ ...note, important : true }</em>, alors la valeur de la propriété _important_ du nouvel objet sera _true_. Dans notre exemple, la propriété <em>important</em> obtient la négation de sa valeur précédente dans l'objet d'origine.

Il y a quelques points à souligner. Pourquoi avons-nous fait une copie de l'objet note que nous voulions modifier, alors que le code suivant semble également fonctionner ?

```js
const note = notes.find(n => n.id === id)
note.important = !note.important

axios.put(url, note).then(response => {
  // ...
})
```

Ceci n'est pas recommandé car la variable <em>note</em> est une référence à un élément du tableau <em>notes</em> dans l'état du composant, et comme nous le rappelons, nous ne devons jamais muter l'état directement dans React.

Il convient également de noter que le nouvel objet _changedNote_ n'est qu'une soi-disant [copie superficielle](https://en.wikipedia.org/wiki/Object_copying#Shallow_copy), ce qui signifie que les valeurs du nouvel objet sont les mêmes que celles du valeurs de l'ancien objet. Si les valeurs de l'ancien objet étaient elles-mêmes des objets, les valeurs copiées dans le nouvel objet feraient référence aux mêmes objets qui se trouvaient dans l'ancien objet.

La nouvelle note est ensuite envoyée avec une requête PUT au backend où elle remplacera l'ancien objet.

La fonction de callback définit l'état <em>notes</em> du composant sur un nouveau tableau contenant tous les éléments du tableau <em>notes</em> précédent, à l'exception de l'ancienne note qui est remplacée par sa version mise à jour renvoyée par le serveur :

```js
axios.put(url, changedNote).then(response => {
  setNotes(notes.map(note => note.id !== id ? note : response.data))
})
```

Ceci est accompli avec la méthode <em>map</em> :

```js
notes.map(note => note.id !== id ? note : response.data)
```

La méthode map crée un nouveau tableau en mappant chaque élément de l'ancien tableau dans un élément du nouveau tableau. Dans notre exemple, le nouveau tableau est créé conditionnellement de sorte que si <em>note.id !== id</em> est vrai ; nous copions simplement l'élément de l'ancien tableau dans le nouveau tableau. Si la condition est fausse, l'objet note renvoyé par le serveur est ajouté au tableau à la place.

Cette astuce de <em>map</em> peut sembler un peu étrange au début, mais cela vaut la peine de passer un peu de temps à comprendre. Nous utiliserons cette méthode plusieurs fois tout au long du cours.

### Extraction de la communication avec le backend dans un module séparé


Le composant <i>App</i> est devenu quelque peu gonflé après l'ajout du code pour communiquer avec le serveur principal. Dans l'esprit du [principe de responsabilité unique](https://en.wikipedia.org/wiki/Single_responsibility_principle), nous jugeons judicieux d'extraire cette communication dans son propre [module](/en/part2/rendering_a_collection_modules#refactoring-modules).

Créons un répertoire <i>src/services</i> et ajoutons-y un fichier appelé <i>notes.js</i> :

```js
import axios from 'axios'
const baseUrl = 'http://localhost:3001/notes'

const getAll = () => {
  return axios.get(baseUrl)
}

const create = newObject => {
  return axios.post(baseUrl, newObject)
}

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject)
}

export default { 
  getAll: getAll, 
  create: create, 
  update: update 
}
```

Le module renvoie un objet qui a trois fonctions (<i>getAll</i>, <i>create</i> et <i>update</i>) comme propriétés traitant des notes. Les fonctions retournent directement les promises retournées par les méthodes axios.

Le composant <i>App</i> utilise <em>import</em> pour accéder au module :

```js
import noteService from './services/notes' // highlight-line

const App = () => {
```

Les fonctions du module peuvent être utilisées directement avec la variable importée _noteService_ comme suit :

```js
const App = () => {
  // ...

  useEffect(() => {
    // highlight-start
    noteService
      .getAll()
      .then(response => {
        setNotes(response.data)
      })
    // highlight-end
  }, [])

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    // highlight-start
    noteService
      .update(id, changedNote)
      .then(response => {
        setNotes(notes.map(note => note.id !== id ? note : response.data))
      })
    // highlight-end
  }

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() > 0.5
    }

// highlight-start
    noteService
      .create(noteObject)
      .then(response => {
        setNotes(notes.concat(response.data))
        setNewNote('')
      })
// highlight-end
  }

  // ...
}

export default App
```

Nous pourrions aller plus loin dans notre mise en œuvre. Lorsque le composant <i>App</i> utilise les fonctions, il reçoit un objet contenant la réponse complète à la requête HTTP :

```js
noteService
  .getAll()
  .then(response => {
    setNotes(response.data)
  })
```

Le composant <i>App</i> utilise uniquement la propriété <i>response.data</i> de l'objet de réponse.

Le module serait beaucoup plus agréable à utiliser si, au lieu de la réponse HTTP entière, nous n'obtenions que les données de réponse. L'utilisation du module ressemblerait alors à ceci :

```js
noteService
  .getAll()
  .then(initialNotes => {
    setNotes(initialNotes)
  })
```

Nous pouvons y parvenir en modifiant le code dans le module comme suit (le code actuel contient du copier-coller, mais nous le tolérerons pour l'instant) :

```js
import axios from 'axios'
const baseUrl = 'http://localhost:3001/notes'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

export default { 
  getAll: getAll, 
  create: create, 
  update: update 
}
```


Nous ne renvoyons plus directement la promise renvoyée par axios. Au lieu de cela, nous attribuons la promise à la variable <em>request</em> et appelons sa méthode <em>then</em> :

```js
const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}
```

La dernière ligne de notre fonction est simplement une expression plus compacte du même code, comme indiqué ci-dessous :

```js
const getAll = () => {
  const request = axios.get(baseUrl)
  // highlight-start
  return request.then(response => {
    return response.data
  })
  // highlight-end
}
```

La fonction <em>getAll</em> modifiée renvoie toujours une promise, car la méthode <em>then</em> d'une promise [renvoie également une promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then).

Après avoir défini le paramètre de la méthode <em>then</em> pour retourner directement <i>response.data</i>, nous avons fait en sorte que la fonction <em>getAll</em> fonctionne comme nous le voulions. Lorsque la requête HTTP aboutit, la promise renvoie les données renvoyées dans la réponse du backend.

Nous devons mettre à jour le composant <i>App</i> pour fonctionner avec les modifications apportées à notre module. Nous devons corriger les fonctions de callback données en paramètres aux méthodes de l'objet <em>noteService</em>, afin qu'elles utilisent les données de réponse directement renvoyées :

```js
const App = () => {
  // ...

  useEffect(() => {
    noteService
      .getAll()
      // highlight-start      
      .then(initialNotes => {
        setNotes(initialNotes)
      // highlight-end
      })
  }, [])

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      // highlight-start      
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      // highlight-end
      })
  }

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() > 0.5
    }

    noteService
      .create(noteObject)
      // highlight-start      
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
      // highlight-end
        setNewNote('')
      })
  }

  // ...
}
```

Tout cela est assez compliqué et tenter de l'expliquer peut simplement rendre la compréhension plus difficile. Internet regorge de documents traitant du sujet, comme [ceci](https://javascript.info/promise-chaining).

Le livre "Async et performance" de la série de livres [Vous ne connaissez pas JS](https://github.com/getify/You-Dont-Know-JS/tree/1st-ed) [explique bien le sujet](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/async%20%26%20performance/ch3.md), mais l'explication fait plusieurs pages.

Les promises sont au cœur du développement JavaScript moderne et il est fortement recommandé d'investir un temps raisonnable pour les comprendre.

### Syntaxe plus propre pour la définition des Object Literals

Le module définissant les services liés aux notes exporte actuellement un objet avec les propriétés <i>getAll</i>, <i>create</i> et <i>update</i> qui sont affectées aux fonctions de gestion des notes.

La définition du module était :

```js
import axios from 'axios'
const baseUrl = 'http://localhost:3001/notes'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

export default { 
  getAll: getAll, 
  create: create, 
  update: update 
}
```

Le module exporte l'objet suivant, plutôt particulier :

```js
{ 
  getAll: getAll, 
  create: create, 
  update: update 
}
```

Les étiquettes à gauche des deux-points dans la définition de l'objet sont les <i>clés</i> de l'objet, tandis que celles à droite sont des <i>variables</i> qui sont définies à l'intérieur du module .

Puisque les noms des clés et des variables assignées sont les mêmes, nous pouvons écrire la définition de l'objet avec une syntaxe plus compacte :

```js
{ 
  getAll, 
  create, 
  update 
}
```

En conséquence, la définition du module est simplifiée sous la forme suivante :

```js
import axios from 'axios'
const baseUrl = 'http://localhost:3001/notes'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

export default { getAll, create, update } // highlight-line
```

En définissant l'objet à l'aide de cette notation plus courte, nous utilisons une [nouvelle fonctionnalité](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#Property_definitions) qui a été introduite à JavaScript via ES6, permettant une manière légèrement plus compacte de définir des objets à l'aide de variables.

Pour illustrer cette fonctionnalité, considérons une situation dans laquelle les valeurs suivantes sont attribuées aux variables :

```js 
const name = 'Leevi'
const age = 0
```

Dans les anciennes versions de JavaScript, nous devions définir un objet comme celui-ci :

```js 
const person = {
  name: name,
  age: age
}
```

Cependant, étant donné que les champs de propriété et les noms de variable dans l'objet sont les mêmes, il suffit d'écrire simplement ce qui suit en JavaScript ES6 :

```js 
const person = { name, age }
```

Le résultat est identique pour les deux expressions. Ils créent tous les deux un objet avec une propriété <i>name</i> avec la valeur <i>Leevi</i> et une propriété <i>age</i> avec la valeur <i>0</i>.

### Promises et Erreurs

Si notre application permettait aux utilisateurs de supprimer des notes, nous pourrions nous retrouver dans une situation où un utilisateur essaie de modifier l'importance d'une note qui a déjà été supprimée du système.

Simulons cette situation en faisant en sorte que la fonction <em>getAll</em> du service note renvoie une note "codée en dur" qui n'existe pas réellement sur le serveur principal :

```js
const getAll = () => {
  const request = axios.get(baseUrl)
  const nonExisting = {
    id: 10000,
    content: 'This note is not saved to server',
    date: '2019-05-30T17:30:31.098Z',
    important: true,
  }
  return request.then(response => response.data.concat(nonExisting))
}
```

Lorsque nous essayons de modifier l'importance de la note codée en dur, nous voyons le message d'erreur suivant dans la console. L'erreur indique que le serveur principal a répondu à notre requête HTTP PUT avec un code d'état 404 <i>not found</i>.

![](../../images/2/23e.png)

L'application doit être capable de gérer ces types de situations d'erreur avec élégance. Les utilisateurs ne pourront pas dire qu'une erreur s'est réellement produite à moins qu'ils n'aient leur console ouverte. La seule façon de voir l'erreur dans l'application est que le fait de cliquer sur le bouton n'a aucun effet sur l'importance de la note.

Nous avions [précédemment](/en/part2/getting_data_from_server#axios-and-promises) mentionné qu'une promesse peut être dans l'un des trois états différents. Lorsqu'une requête HTTP échoue, la promesse associée est <i>rejetée</i>. Notre code actuel ne gère en aucun cas ce rejet.

Le rejet d'une promise est [géré](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) en fournissant la méthode <em>then</em> avec un deuxième rappel fonction, qui est appelée dans la situation où la promesse est rejetée.

La manière la plus courante d'ajouter un gestionnaire pour les promesses rejetées consiste à utiliser la méthode [catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch).

En pratique, le gestionnaire d'erreurs pour les promesses rejetées est défini comme ceci :

```js
axios
  .get('http://example.com/probably_will_fail')
  .then(response => {
    console.log('success!')
  })
  .catch(error => {
    console.log('fail')
  })
```

Si la requête échoue, le gestionnaire d'événements enregistré avec la méthode <em>catch</em> est appelé.

La méthode <em>catch</em> est souvent utilisée en la plaçant plus profondément dans la chaîne de promises.

Lorsque notre application effectue une requête HTTP, nous créons en fait une [chaîne de promises](https://javascript.info/promise-chaining) :

```js
axios
  .put(`${baseUrl}/${id}`, newObject)
  .then(response => response.data)
  .then(changedNote => {
    // ...
  })
```

La méthode <em>catch</em> peut être utilisée pour définir une fonction de gestion à la fin d'une chaîne de promises, qui est appelée une fois qu'une promise de la chaîne génère une erreur et que la promise devient <i>rejetée</i> .

```js
axios
  .put(`${baseUrl}/${id}`, newObject)
  .then(response => response.data)
  .then(changedNote => {
    // ...
  })
  .catch(error => {
    console.log('fail')
  })
```

Utilisons cette fonctionnalité et ajoutons un gestionnaire d'erreurs dans le composant <i>App</i> :

```js
const toggleImportanceOf = id => {
  const note = notes.find(n => n.id === id)
  const changedNote = { ...note, important: !note.important }

  noteService
    .update(id, changedNote).then(returnedNote => {
      setNotes(notes.map(note => note.id !== id ? note : returnedNote))
    })
    // highlight-start
    .catch(error => {
      alert(
        `the note '${note.content}' was already deleted from server`
      )
      setNotes(notes.filter(n => n.id !== id))
    })
    // highlight-end
}
```

Le message d'erreur s'affiche pour l'utilisateur avec l'ancienne boîte de dialogue fidèle [alert](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert) et la note supprimée est filtrée de l'état.

La suppression d'une note déjà supprimée de l'état de l'application se fait avec la méthode array [filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter), qui renvoie un nouveau tableau comprenant uniquement les éléments de la liste pour lesquels la fonction passée en paramètre renvoie vrai pour :

```js
notes.filter(n => n.id !== id)
```

Ce n'est probablement pas une bonne idée d'utiliser alert dans des applications React plus sérieuses. Nous apprendrons bientôt une manière plus avancée d'afficher des messages et des notifications aux utilisateurs. Il existe cependant des situations où une méthode simple et éprouvée comme <em>alert</em> peut fonctionner comme point de départ. Une méthode plus avancée pourrait toujours être ajoutée plus tard, étant donné qu'il y a du temps et de l'énergie pour cela.

Le code de l'état actuel de notre application se trouve sur la branche <i>part2-6</i> sur [GitHub](https://github.com/fullstack-hy2020/part2-notes/tree/part2-6).

</div>

<div class="tasks">

<h3>Exercices 2.15.-2.18.</h3>

<h4>2.15: phonebook, étape7</h4>

Revenons à notre application de répertoire.

Actuellement, les numéros ajoutés au répertoire ne sont pas enregistrés sur un serveur principal. Corrigez cette situation.

<h4>2.16: phonebook, étape8</h4>

Extrayez le code qui gère la communication avec le backend dans son propre module en suivant l'exemple présenté précédemment dans cette partie du support de cours.

<h4>2.17: phonebook étape9</h4>

Permettre aux utilisateurs de supprimer des entrées du répertoire. La suppression peut être effectuée via un bouton dédié pour chaque personne dans la liste du répertoire. Vous pouvez confirmer l'action de l'utilisateur en utilisant la méthode [window.confirm](https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm) :

![](../../images/2/24e.png)

La ressource associée à une personne dans le backend peut être supprimée en envoyant une requête HTTP DELETE à l'URL de la ressource. Si nous supprimons par ex. une personne qui a l'<i>id</i> 2, il faudrait faire une requête HTTP DELETE à l'URL <i>localhost:3001/persons/2</i>. Aucune donnée n'est envoyée avec la demande.

Vous pouvez effectuer une requête HTTP DELETE avec la bibliothèque [axios](https://github.com/axios/axios) de la même manière que nous effectuons toutes les autres requêtes.

**NB :** Vous ne pouvez pas utiliser le nom <em>delete</em> pour une variable car il s'agit d'un mot réservé en JavaScript. Par exemple. ce qui suit n'est pas possible :

```js
// utilisez un autre nom pour la variable !
const delete = (id) => {
  // ...
}
```

<h4>2.18*: phonebook, étape10</h4>

Modifiez le code de sorte que si un numéro est ajouté à un utilisateur déjà existant, le nouveau numéro remplacera l'ancien numéro. Il est recommandé d'utiliser la méthode HTTP PUT pour mettre à jour le numéro de téléphone.

Si les informations de la personne sont déjà dans le répertoire, l'application peut confirmer l'action de l'utilisateur :

![](../../images/teht/16e.png)

</div>
