---
mainImage: ../../../images/part-6.svg
part: 6
letter: d
lang: fr
---

<div class="content">

À la fin de cette partie, nous examinerons quelques autres méthodes de gestion de l'état d'une application.

Continuons avec l'application de notes. Nous nous concentrerons sur la communication avec le serveur. Commençons l'application à partir de zéro. La première version est la suivante:

```js
const App = () => {
  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    console.log(content)
  }

  const toggleImportance = (note) => {
    console.log('toggle importance of', note.id)
  }

  const notes = []

  return(
    <div>
      <h2>Notes app</h2>
      <form onSubmit={addNote}>
        <input name="note" />
        <button type="submit">add</button>
      </form>
      {notes.map(note =>
        <li key={note.id} onClick={() => toggleImportance(note)}>
          {note.content} 
          <strong> {note.important ? 'important' : ''}</strong>
        </li>
      )}
    </div>
  )
}

export default App
```

Le code initial est sur GitHub dans le [dépôt](https://github.com/fullstack-hy2020/query-notes/tree/part6-0) dans la branche <i>part6-0</i>.

**Note**: Par défaut, le clonage du dépôt vous donnera uniquement la branche principale. Pour obtenir le code initial de la branche part6-0, utilisez la commande suivante:
```
git clone --branch part6-0 https://github.com/fullstack-hy2020/query-notes.git
```

### Gestion des données sur le serveur avec la bibliothèque React Query

Nous allons maintenant utiliser la bibliothèque [React Query](https://tanstack.com/query/latest) pour stocker et gérer les données récupérées depuis le serveur. La dernière version de la bibliothèque est également appelée TanStack Query, mais nous restons avec le nom familier.

Installez la bibliothèque avec la commande

```bash
npm install @tanstack/react-query
```

Quelques ajouts dans le fichier <i>main.jsx</i> sont nécessaires pour passer les fonctions de la bibliothèque à l'ensemble de l'application:

```js
import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' // highlight-line

import App from './App'

const queryClient = new QueryClient() // highlight-line

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}> // highlight-line
    <App />
  </QueryClientProvider> // highlight-line
)
```

Nous pouvons maintenant récupérer les notes dans le composant <i>App</i>. Le code s'étend comme suit:

```js
import { useQuery } from '@tanstack/react-query'  // highlight-line
import axios from 'axios'  // highlight-line

const App = () => {
  // ...

   // highlight-start
  const result = useQuery({
    queryKey: ['notes'],
    queryFn: () => axios.get('http://localhost:3001/notes').then(res => res.data)
  })

  console.log(JSON.parse(JSON.stringify(result)))
  // highlight-end

  // highlight-start
  if ( result.isLoading ) {
    return <div>loading data...</div>
  }
  // highlight-end

  const notes = result.data  // highlight-line

  return (
    // ...
  )
}
```

Récupérer les données depuis le serveur se fait encore de manière familière avec la méthode <i>get</i> d'Axios. Cependant, l'appel de méthode Axios est maintenant encapsulé dans une [requête](https://tanstack.com/query/latest/docs/react/guides/queries) formée avec la fonction [useQuery](https://tanstack.com/query/latest/docs/react/reference/useQuery). Le premier paramètre de l'appel de fonction est une chaîne <i>notes</i> qui agit comme une [clé](https://tanstack.com/query/latest/docs/react/guides/query-keys) pour la requête définie, c'est-à-dire la liste des notes.

La valeur de retour de la fonction <i>useQuery</i> est un objet qui indique le statut de la requête. La sortie vers la console illustre la situation:

![browser devtools showing success status](../../images/6/60new.png)

C'est-à-dire que la première fois que le composant est rendu, la requête est encore dans l'état <i>loading</i>, c'est-à-dire que la requête HTTP associée est en attente. À ce stade, seul ce qui suit est rendu:

```html
<div>loading data...</div>
```

Cependant, la requête HTTP est complétée si rapidement que même les plus astucieux ne pourront pas voir le texte. Lorsque la requête est terminée, le composant est rendu à nouveau. La requête est dans l'état <i>success</i> lors du deuxième rendu, et le champ <i>data</i> de l'objet de la requête contient les données renvoyées par la requête, c'est-à-dire la liste des notes qui est rendue à l'écran.

Ainsi, l'application récupère les données depuis le serveur et les affiche à l'écran sans utiliser du tout les hooks React <i>useState</i> et <i>useEffect</i> utilisés dans les chapitres 2 à 5. Les données sur le serveur sont maintenant entièrement sous l'administration de la bibliothèque React Query, et l'application n'a pas du tout besoin de l'état défini avec le hook <i>useState</i> de React !

Déplaçons la fonction effectuant la requête HTTP réelle dans son propre fichier <i>requests.js</i>.

```js
import axios from 'axios'

export const getNotes = () =>
  axios.get('http://localhost:3001/notes').then(res => res.data)
```

Le composant <i>App</i> est maintenant légèrement simplifié

```js
import { useQuery } from '@tanstack/react-query' 
import { getNotes } from './requests' // highlight-line

const App = () => {
  // ...

  const result = useQuery({
    queryKey: ['notes'],
    queryFn: getNotes // highlight-line
  })

  // ...
}
```

Le code actuel de l'application se trouve sur [GitHub](https://github.com/fullstack-hy2020/query-notes/tree/part6-1) dans la branche <i>part6-1</i>.

### Synchronisation des données avec le serveur à l'aide de React Query

Les données sont déjà récupérées avec succès depuis le serveur. Ensuite, nous nous assurerons que les données ajoutées et modifiées sont stockées sur le serveur. Commençons par ajouter de nouvelles notes.

Faisons une fonction <i>createNote</i> dans le fichier <i>requests.js</i> pour sauvegarder les nouvelles notes:

```js
import axios from 'axios'

const baseUrl = 'http://localhost:3001/notes'

export const getNotes = () =>
  axios.get(baseUrl).then(res => res.data)

export const createNote = newNote => // highlight-line
  axios.post(baseUrl, newNote).then(res => res.data) // highlight-line
```

Le composant <i>App</i> changera comme suit

```js
import { useQuery, useMutation } from '@tanstack/react-query' // highlight-line
import { getNotes, createNote } from './requests' // highlight-line

const App = () => {
 const newNoteMutation = useMutation({ mutationFn: createNote }) // highlight-line

  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    newNoteMutation.mutate({ content, important: true }) // highlight-line
  }

  // 

}
```

Pour créer une nouvelle note, une [mutation](https://tanstack.com/query/latest/docs/react/guides/mutations) est définie en utilisant la fonction [useMutation](https://tanstack.com/query/latest/docs/react/reference/useMutation):

```js
const newNoteMutation = useMutation({ mutationFn: createNote })
```

Le paramètre est la fonction que nous avons ajoutée au fichier <i>requests.js</i>, qui utilise Axios pour envoyer une nouvelle note au serveur.

Le gestionnaire d'événement <i>addNote</i> effectue la mutation en appelant la fonction de l'objet de mutation <i>mutate</i> et en passant la nouvelle note comme paramètre:

```js
newNoteMutation.mutate({ content, important: true })
```

Notre solution est bonne. Sauf qu'elle ne fonctionne pas. La nouvelle note est enregistrée sur le serveur, mais elle n'est pas mise à jour à l'écran.

Pour afficher également la nouvelle note, nous devons informer React Query que l'ancien résultat de la requête dont la clé est la chaîne <i>notes</i> doit être [invalidé](https://tanstack.com/query/latest/docs/react/guides/invalidations-from-mutations).

Heureusement, l'invalidation est facile, elle peut être réalisée en définissant la fonction de rappel <i>onSuccess</i> appropriée pour la mutation:

```js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query' // highlight-line
import { getNotes, createNote } from './requests'

const App = () => {
  const queryClient = useQueryClient() // highlight-line

  const newNoteMutation = useMutation({
    mutationFn: createNote, 
    onSuccess: () => {  // highlight-line
      queryClient.invalidateQueries({ queryKey: ['notes'] })  // highlight-line
    },
  })

  // ...
}
```

Maintenant que la mutation a été exécutée avec succès, un appel de fonction est effectué pour

```js
queryClient.invalidateQueries('notes')
```

Cela entraîne à son tour React Query à mettre automatiquement à jour une requête avec la clé <i>notes</i>, c'est-à-dire récupérer les notes depuis le serveur. En conséquence, l'application rend l'état actuel sur le serveur, c'est-à-dire que la note ajoutée est également rendue.

Implémentons également le changement dans l'importance des notes. Une fonction pour la mise à jour des notes est ajoutée au fichier <i>requests.js</i>:

```js
export const updateNote = updatedNote =>
  axios.put(`${baseUrl}/${updatedNote.id}`, updatedNote).then(res => res.data)
```

La mise à jour de la note est également effectuée par mutation. Le composant <i>App</i> s'étend comme suit:

```js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query' 
import { getNotes, createNote, updateNote } from './requests' // highlight-line

const App = () => {
  // ...

  const updateNoteMutation = useMutation({
    mutationFn: updateNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })

  // highlight-start
  const toggleImportance = (note) => {
    updateNoteMutation.mutate({...note, important: !note.important })
  }
  // highlight-end

  // ...
}
```

Donc, encore une fois, une mutation a été créée qui a invalidé la requête <i>notes</i> afin que la note mise à jour soit correctement rendue. Utiliser une mutation est facile, la méthode <i>mutate</i> reçoit une note en paramètre, dont l'importance a été changée à la négation de l'ancienne valeur.

Le code actuel de l'application se trouve sur [GitHub](https://github.com/fullstack-hy2020/query-notes/tree/part6-2) dans la branche <i>part6-2</i>.

### Optimiser la performance

L'application fonctionne bien, et le code est relativement simple. La facilité de faire des modifications à la liste des notes est particulièrement surprenante. Par exemple, lorsque nous changeons l'importance d'une note, invalider la requête <i>notes</i> suffit pour que les données de l'application soient mises à jour:

```js
  const updateNoteMutation = useMutation({
    mutationFn: updateNote,
    onSuccess: () => {
      queryClient.invalidateQueries('notes') // highlight-line
    },
  })
```

La conséquence de cela, bien sûr, est qu'après la requête PUT qui provoque le changement de la note, l'application fait une nouvelle requête GET pour récupérer les données de la requête du serveur :

![devtools network tab with highlight over 3 and notes requests](../../images/6/61new.png)

Si la quantité de données récupérées par l'application n'est pas grande, cela n'a pas vraiment d'importance. Après tout, du point de vue de la fonctionnalité côté navigateur, faire une requête HTTP GET supplémentaire n'a pas vraiment d'importance, mais dans certaines situations, cela pourrait mettre à rude épreuve le serveur.

Si nécessaire, il est également possible d'optimiser les performances en [mettant à jour manuellement](https://tanstack.com/query/latest/docs/react/guides/updates-from-mutation-responses) l'état de la requête maintenu par React Query.

Le changement pour la mutation ajoutant une nouvelle note est le suivant:

```js
const App = () => {
  const queryClient =  useQueryClient() 

  const newNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: (newNote) => {
      const notes = queryClient.getQueryData(['notes']) // highlight-line
      queryClient.setQueryData(['notes'], notes.concat(newNote)) // highlight-line
    }
  })
  // ...
}
```

C'est-à-dire, dans le callback <i>onSuccess</i>, l'objet <i>queryClient</i> lit d'abord l'état existant de la requête <i>notes</i> et le met à jour en ajoutant une nouvelle note, qui est obtenue en tant que paramètre de la fonction de callback. La valeur du paramètre est la valeur retournée par la fonction <i>createNote</i>, définie dans le fichier <i>requests.js</i> comme suit:

```js
export const createNote = newNote =>
  axios.post(baseUrl, newNote).then(res => res.data)
```

Il serait relativement facile de faire une modification similaire pour une mutation qui change l'importance de la note, mais nous laissons cela comme un exercice optionnel.

Si nous suivons attentivement l'onglet réseau du navigateur, nous remarquons que React Query récupère toutes les notes dès que nous déplaçons le curseur vers le champ de saisie:

![outil de développement notes app avec champ de texte en surbrillance et flèche sur le réseau au-dessus de la requête des notes comme 200](../../images/6/62new.png)

Qu'est-ce qui se passe? En lisant la [documentation](https://tanstack.com/query/latest/docs/react/reference/useQuery), nous remarquons que la fonctionnalité par défaut des requêtes de React Query est que les requêtes (dont le statut est <i>stale</i>) sont mises à jour lorsque le <i>window focus</i>, c'est-à-dire l'élément actif de l'interface utilisateur de l'application, change. Si nous le souhaitons, nous pouvons désactiver la fonctionnalité en créant une requête comme suit:

```js
const App = () => {
  // ...
  const result = useQuery({
    queryKey: ['notes'],
    queryFn: getNotes,
    refetchOnWindowFocus: false // highlight-line
  })

  // ...
}
```

Si vous ajoutez une instruction console.log dans le code, vous pouvez voir depuis la console du navigateur à quelle fréquence React Query provoque le re-rendu de l'application. La règle générale est que le re-rendu se produit au moins chaque fois qu'il est nécessaire, c'est-à-dire lorsque l'état de la requête change. Vous pouvez en lire plus à ce sujet par exemple [ici](https://tkdodo.eu/blog/react-query-render-optimizations).

Le code de l'application est sur [GitHub](https://github.com/fullstack-hy2020/query-notes/tree/part6-3) dans la branche <i>part6-3</i>.

React Query est une bibliothèque polyvalente qui, comme nous l'avons déjà vu, simplifie l'application. Est-ce que React Query rend les solutions de gestion d'état plus complexes comme Redux inutiles? Non. React Query peut remplacer partiellement l'état de l'application dans certains cas, mais comme le stipule la [documentation](https://tanstack.com/query/latest/docs/react/guides/does-this-replace-client-state)

- React Query est une <i>bibliothèque d'état serveur</i>, responsable de la gestion des opérations asynchrones entre votre serveur et client
- Redux, etc. sont des <i>bibliothèques d'état client</i> qui peuvent être utilisées pour stocker des données asynchrones, bien que de manière inefficace par rapport à un outil comme React Query

Ainsi, React Query est une bibliothèque qui maintient l'<i>état serveur</i> dans le frontend, c'est-à-dire qu'elle agit comme un cache pour ce qui est stocké sur le serveur. React Query simplifie le traitement des données sur le serveur, et peut dans certains cas éliminer le besoin de sauvegarder les données du serveur dans l'état du frontend.

La plupart des applications React ont besoin non seulement d'un moyen de stocker temporairement les données servies, mais aussi d'une solution pour la gestion du reste de l'état du frontend (par exemple, l'état des formulaires ou des notifications).

</div>

<div class="tasks">

### Exercices 6.20.-6.22.

Maintenant, créons une nouvelle version de l'application d'anecdotes qui utilise la bibliothèque React Query. Prenez [ce projet](https://github.com/fullstack-hy2020/query-anecdotes) comme point de départ. Le projet dispose d'un JSON Server déjà installé, dont le fonctionnement a été légèrement modifié (revoyez le fichier server.js pour plus de détails. Assurez-vous de vous connecter au bon _PORT_). Démarrez le serveur avec <i>npm run server</i>.

#### Exercice 6.20

Implémentez la récupération des anecdotes depuis le serveur en utilisant React Query.

L'application doit fonctionner de telle manière que si des problèmes de communication avec le serveur surviennent, seule une page d'erreur sera affichée:

![navigateur indiquant que le service d'anecdotes n'est pas disponible en raison de problèmes sur le serveur sur localhost](../../images/6/65new.png)

Vous pouvez trouver [ici](https://tanstack.com/query/latest/docs/react/guides/queries) des informations sur comment détecter les erreurs possibles.

Vous pouvez simuler un problème avec le serveur, par exemple, en éteignant le JSON Server. Veuillez noter que dans une situation de problème, la requête est d'abord dans l'état <i>isLoading</i> pendant un moment, car si une demande échoue, React Query tente la demande plusieurs fois avant de déclarer que la demande n'a pas abouti. Vous pouvez éventuellement spécifier qu'aucune nouvelle tentative ne soit faite:

```js
const result = useQuery(
  {
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: false
  }
)
```

ou que la requête soit réessayée, par exemple, une seule fois:

```js
const result = useQuery(
  {
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1
  }
)
```

#### Exercice 6.21

Implémentez l'ajout de nouvelles anecdotes au serveur en utilisant React Query. L'application devrait afficher par défaut une nouvelle anecdote. Notez que le contenu de l'anecdote doit être long d'au moins 5 caractères, sinon le serveur rejettera la requête POST. Vous n'avez pas à vous préoccuper de la gestion des erreurs pour le moment.

#### Exercice 6.22

Implémentez le vote pour les anecdotes en utilisant à nouveau React Query. L'application devrait automatiquement afficher le nombre de votes augmenté pour l'anecdote votée.

</div>

<div class="content">

### useReducer

Même si l'application utilise React Query, une sorte de solution est généralement nécessaire pour gérer le reste de l'état du frontend (par exemple, l'état des formulaires). Assez souvent, l'état créé avec <i>useState</i> est une solution suffisante. L'utilisation de Redux est bien sûr possible, mais il existe d'autres alternatives.

Regardons une simple application de compteur. L'application affiche la valeur du compteur et propose trois boutons pour mettre à jour le statut du compteur:

![navigateur montrant les boutons + - 0 et 7 au-dessus](../../images/6/63new.png)

Nous allons maintenant implémenter la gestion de l'état du compteur en utilisant un mécanisme de gestion d'état similaire à Redux fourni par le hook [useReducer](https://react.dev/reference/react/useReducer) intégré à React. Le code ressemble à ce qui suit:

```js
import { useReducer } from 'react'

const counterReducer = (state, action) => {
  switch (action.type) {
    case "INC":
        return state + 1
    case "DEC":
        return state - 1
    case "ZERO":
        return 0
    default:
        return state
  }
}

const App = () => {
  const [counter, counterDispatch] = useReducer(counterReducer, 0)

  return (
    <div>
      <div>{counter}</div>
      <div>
        <button onClick={() => counterDispatch({ type: "INC"})}>+</button>
        <button onClick={() => counterDispatch({ type: "DEC"})}>-</button>
        <button onClick={() => counterDispatch({ type: "ZERO"})}>0</button>
      </div>
    </div>
  )
}

export default App
```

Le hook [useReducer](https://react.dev/reference/react/useReducer) fournit un mécanisme pour créer un état pour une application. Le paramètre pour créer un état est la fonction reducer qui gère les changements d'état, et la valeur initiale de l'état:

```js
const [counter, counterDispatch] = useReducer(counterReducer, 0)
```

La fonction reducer qui gère les changements d'état est similaire aux reducers de Redux, c'est-à-dire que la fonction reçoit comme paramètres l'état actuel et l'action qui change l'état. La fonction retourne le nouvel état mis à jour en fonction du type et du contenu possible de l'action:

```js
const counterReducer = (state, action) => {
  switch (action.type) {
    case "INC":
        return state + 1
    case "DEC":
        return state - 1
    case "ZERO":
        return 0
    default:
        return state
  }
}
```

Dans notre exemple, les actions n'ont qu'un type. Si le type de l'action est <i>INC</i>, il augmente la valeur du compteur de un, etc. Comme les reducers de Redux, les actions peuvent également contenir des données arbitraires, qui sont généralement placées dans le champ <i>payload</i> de l'action.

La fonction <i>useReducer</i> retourne un tableau qui contient un élément pour accéder à la valeur actuelle de l'état (premier élément du tableau) et une fonction <i>dispatch</i> (deuxième élément du tableau) pour changer l'état:

```js
const App = () => {
  const [counter, counterDispatch] = useReducer(counterReducer, 0)  // highlight-line

  return (
    <div>
      <div>{counter}</div> // highlight-line
      <div>
        <button onClick={() => counterDispatch({ type: "INC" })}>+</button> // highlight-line
        <button onClick={() => counterDispatch({ type: "DEC" })}>-</button>
        <button onClick={() => counterDispatch({ type: "ZERO" })}>0</button>
      </div>
    </div>
  )
}
```

Comme on peut le voir, le changement d'état est effectué exactement comme dans Redux: la fonction de dispatch reçoit en paramètre l'action appropriée qui change l'état:

```js
counterDispatch({ type: "INC" })
```

Le code actuel de l'application se trouve dans le dépôt [https://github.com/fullstack-hy2020/hook-counter](https://github.com/fullstack-hy2020/hook-counter/tree/part6-1) dans la branche <i>part6-1</i>.

Utiliser le contexte pour passer l'état aux composants
Si nous voulons diviser l'application en plusieurs composants, la valeur du compteur et la fonction de dispatch utilisée pour le gérer doivent également être passées aux autres composants. Une solution serait de les passer comme props de la manière habituelle:

```js
const Display = ({ counter }) => {
  return <div>{counter}</div>
}

const Button = ({ dispatch, type, label }) => {
  return (
    <button onClick={() => dispatch({ type })}>
      {label}
    </button>
  )
}

const App = () => {
  const [counter, counterDispatch] = useReducer(counterReducer, 0)

  return (
    <div>
      <Display counter={counter}/> // highlight-line
      <div>
        // highlight-start
        <Button dispatch={counterDispatch} type='INC' label='+' />
        <Button dispatch={counterDispatch} type='DEC' label='-' />
        <Button dispatch={counterDispatch} type='ZERO' label='0' />
        // highlight-end
      </div>
    </div>
  )
}
```

La solution fonctionne, mais n'est pas optimale. Si la structure des composants se complique, par exemple, si le dispatcheur doit être transmis à l'aide de props à travers de nombreux composants vers les composants qui en ont besoin, même si les composants intermédiaires dans l'arbre des composants n'ont pas besoin du dispatcheur. Ce phénomène est appelé <i>prop drilling</i>.

[L'API Contexte](https://react.dev/learn/passing-data-deeply-with-context) intégrée à React fournit une solution pour nous. Le contexte de React est une sorte d'état global de l'application, auquel il est possible de donner un accès direct à n'importe quel composant de l'application.

Créons maintenant un contexte dans l'application qui stocke la gestion de l'état du compteur.

Le contexte est créé avec le hook [createContext](https://react.dev/reference/react/createContext) de React. Créons un contexte dans le fichier <i>CounterContext.jsx</i>:

```js
import { createContext } from 'react'

const CounterContext = createContext()

export default CounterContext
```

Le composant <i>App</i> peut maintenant <i>fournir</i> un contexte à ses composants enfants comme suit:

```js
import CounterContext from './CounterContext' // highlight-line

const App = () => {
  const [counter, counterDispatch] = useReducer(counterReducer, 0)

  return (
    <CounterContext.Provider value={[counter, counterDispatch]}>  // highlight-line
      <Display />
      <div>
        <Button type='INC' label='+' />
        <Button type='DEC' label='-' />
        <Button type='ZERO' label='0' />
      </div>
    </CounterContext.Provider> // highlight-line
  )
}
```

Comme on peut le voir, fournir le contexte est réalisé en enveloppant les composants enfants à l'intérieur du composant <i>CounterContext.Provider</i> et en définissant une valeur appropriée pour le contexte.

La valeur du contexte est maintenant définie comme étant un tableau contenant la valeur du compteur, et la fonction <i>dispatch</i>.

Les autres composants accèdent maintenant au contexte en utilisant le hook [useContext](https://react.dev/reference/react/useContext):

```js
import { useContext } from 'react' // highlight-line
import CounterContext from './CounterContext'

const Display = () => {
  const [counter] = useContext(CounterContext) // highlight-line
  return <div>
    {counter}
  </div>
}

const Button = ({ type, label }) => {
  const [counter, dispatch] = useContext(CounterContext) // highlight-line
  return (
    <button onClick={() => dispatch({ type })}>
      {label}
    </button>
  )
}
```

Le code actuel de l'application se trouve sur [GitHub](https://github.com/fullstack-hy2020/hook-counter/tree/part6-2) dans la branche <i>part6-2</i>.

### Définir le contexte du compteur dans un fichier séparé

Notre application a une caractéristique ennuyeuse, à savoir que la fonctionnalité de gestion de l'état du compteur est en partie définie dans le composant <i>App</i>. Déplaçons maintenant tout ce qui est lié au compteur vers <i>CounterContext.jsx</i>:

```js
import { createContext, useReducer } from 'react'

const counterReducer = (state, action) => {
  switch (action.type) {
    case "INC":
        return state + 1
    case "DEC":
        return state - 1
    case "ZERO":
        return 0
    default:
        return state
  }
}

const CounterContext = createContext()

export const CounterContextProvider = (props) => {
  const [counter, counterDispatch] = useReducer(counterReducer, 0)

  return (
    <CounterContext.Provider value={[counter, counterDispatch] }>
      {props.children}
    </CounterContext.Provider>
  )
}

export default CounterContext
```

Le fichier exporte désormais, en plus de l'objet <i>CounterContext</i> correspondant au contexte, le composant <i>CounterContextProvider</i>, qui est pratiquement un fournisseur de contexte dont la valeur est un compteur et un dispatcher utilisé pour sa gestion d'état.

Activons le fournisseur de contexte en effectuant un changement dans <i>main.jsx</i>:

```js
import ReactDOM from 'react-dom/client'
import App from './App'
import { CounterContextProvider } from './CounterContext' // highlight-line

ReactDOM.createRoot(document.getElementById('root')).render(
  <CounterContextProvider>  // highlight-line
    <App />
  </CounterContextProvider>  // highlight-line
)
```

Maintenant, le contexte définissant la valeur et la fonctionnalité du compteur est disponible pour <i>tous</i> les composants de l'application.

Le composant <i>App</i> est simplifié sous la forme suivante:

```js
import Display from './components/Display'
import Button from './components/Button'

const App = () => {
  return (
    <div>
      <Display />
      <div>
        <Button type='INC' label='+' />
        <Button type='DEC' label='-' />
        <Button type='ZERO' label='0' />
      </div>
    </div>
  )
}

export default App
```

Le contexte est toujours utilisé de la même manière, par exemple, le composant <i>Button</i> est défini comme suit:

```js
import { useContext } from 'react'
import CounterContext from '../CounterContext'

const Button = ({ type, label }) => {
  const [counter, dispatch] = useContext(CounterContext)
  return (
    <button onClick={() => dispatch({ type })}>
      {label}
    </button>
  )
}

export default Button
```

Le composant <i>Button</i> a seulement besoin de la fonction <i>dispatch</i> du compteur, mais il obtient aussi la valeur du compteur à partir du contexte en utilisant la fonction <i>useContext</i>:

```js
  const [counter, dispatch] = useContext(CounterContext)
```

Ce n'est pas un gros problème, mais il est possible de rendre le code un peu plus agréable et expressif en définissant quelques fonctions d'aide dans le fichier <i>CounterContext</i>:

```js
import { createContext, useReducer, useContext } from 'react' // highlight-line

const CounterContext = createContext()

// ...

export const useCounterValue = () => {
  const counterAndDispatch = useContext(CounterContext)
  return counterAndDispatch[0]
}

export const useCounterDispatch = () => {
  const counterAndDispatch = useContext(CounterContext)
  return counterAndDispatch[1]
}

// ...
```

Avec l'aide de ces fonctions d'assistance, il est possible pour les composants qui utilisent le contexte de s'emparer de la partie du contexte dont ils ont besoin. Le composant <i>Display</i> change comme suit:

```js
import { useCounterValue } from '../CounterContext' // highlight-line

const Display = () => {
  const counter = useCounterValue() // highlight-line
  return <div>
    {counter}
  </div>
}


export default Display
```

Le composant <i>Button</i> devient:

```js
import { useCounterDispatch } from '../CounterContext' // highlight-line

const Button = ({ type, label }) => {
  const dispatch = useCounterDispatch() // highlight-line
  return (
    <button onClick={() => dispatch({ type })}>
      {label}
    </button>
  )
}

export default Button
```

La solution est assez élégante. L'ensemble de l'état de l'application, c'est-à-dire la valeur du compteur et le code pour sa gestion, est maintenant isolé dans le fichier <i>CounterContext</i>, qui fournit aux composants des fonctions auxiliaires bien nommées et faciles à utiliser pour la gestion de l'état.

Le code final de l'application se trouve sur [GitHub](https://github.com/fullstack-hy2020/hook-counter/tree/part6-3) dans la branche <i>part6-3</i>.

Comme détail technique, il convient de noter que les fonctions auxiliaires <i>useCounterValue</i> et <i>useCounterDispatch</i> sont définies comme des [hooks personnalisés](https://react.dev/learn/reusing-logic-with-custom-hooks), car l'appel de la fonction hook <i>useContext</i> est [possible](https://legacy.reactjs.org/docs/hooks-rules.html) uniquement à partir de composants React ou de hooks personnalisés. Les hooks personnalisés sont des fonctions JavaScript dont le nom doit commencer par la chaîne use. Nous reviendrons sur les hooks personnalisés un peu plus en détail dans la [partie 7](/en/part7/custom_hooks) du cours.

</div>

<div class="tasks">

### Exercices 6.23-6.24

#### Exercice 6.23

L'application possède un composant <i>Notification</i> pour afficher des notifications à l'utilisateur.

Implémentez la gestion de l'état des notifications de l'application en utilisant le hook useReducer et le contexte. La notification doit informer l'utilisateur lorsqu'une nouvelle anecdote est créée ou lorsqu'une anecdote est votée:

![navigateur affichant la notification pour une anecdote ajoutée](../../images/6/66new.png)

La notification est affichée pendant cinq secondes.

#### Exercice 6.24

Comme indiqué dans l'exercice 6.21, le serveur exige que le contenu de l'anecdote à ajouter soit d'au moins 5 caractères. Implémentez maintenant la gestion des erreurs pour l'insertion. En pratique, il suffit d'afficher une notification à l'utilisateur en cas de requête POST échouée:

![navigateur affichant une notification d'erreur pour avoir tenté d'ajouter une anecdote trop courte](../../images/6/67new.png)

La condition d'erreur doit être gérée dans la fonction de rappel enregistrée à cet effet, voir [ici](https://tanstack.com/query/latest/docs/react/reference/useMutation) comment enregistrer une fonction.

C'était le dernier exercice pour cette partie du cours et il est temps de pousser votre code sur GitHub et de marquer tous vos exercices complétés dans le [système de soumission des exercices](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

</div>

<div class="content">

### Quelle solution de gestion d'état choisir?

Dans les chapitres 1 à 5, toute la gestion de l'état de l'application était réalisée à l'aide du hook <i>useState</i> de React. Les appels asynchrones au backend nécessitaient l'utilisation du hook <i>useEffect</i> dans certaines situations. En principe, rien d'autre n'est nécessaire.

Un problème subtil avec une solution basée sur un état créé avec le hook <i>useState</i> est que si une partie de l'état de l'application est nécessaire à plusieurs composants de l'application, l'état et les fonctions pour le manipuler doivent être passés via les props à tous les composants qui gèrent cet état. Parfois, les props doivent être passés à travers plusieurs composants, et les composants intermédiaires peuvent même ne pas être intéressés par l'état de quelque manière que ce soit. Ce phénomène quelque peu désagréable est appelé <i>prop drilling</i> (forage de props).

Au fil des ans, plusieurs solutions alternatives ont été développées pour la gestion de l'état des applications React, qui peuvent être utilisées pour faciliter les situations problématiques (par exemple, le prop drilling). Cependant, aucune solution n'a été "finale", toutes ont leurs propres avantages et inconvénients, et de nouvelles solutions sont développées tout le temps.

La situation peut confondre un débutant et même un développeur web expérimenté. Quelle solution faut-il utiliser?

Pour une application simple, <i>useState</i> est certainement un bon point de départ. Si l'application communique avec le serveur, la communication peut être gérée de la même manière que dans les chapitres 1 à 5, en utilisant l'état de l'application elle-même. Récemment, cependant, il est devenu plus courant de déplacer la communication et la gestion de l'état associée au moins partiellement sous le contrôle de React Query (ou d'une autre bibliothèque similaire). Si le useState et le prop drilling qu'il entraîne vous préoccupent, utiliser le contexte peut être une bonne option. Il existe également des situations où il peut être judicieux de gérer une partie de l'état avec useState et une partie avec des contextes.

La solution de gestion d'état la plus complète et robuste est Redux, qui est une manière de mettre en oeuvre l'architecture dite [Flux](https://facebookarchive.github.io/flux/). Redux est un peu plus ancien que les solutions présentées dans cette section. La rigidité de Redux a été la motivation pour de nombreuses nouvelles solutions de gestion d'état, telles que le <i>useReducer</i> de React. Certaines des critiques sur la rigidité de Redux sont déjà devenues obsolètes grâce au [Redux Toolkit](https://redux-toolkit.js.org/).

Au fil des ans, d'autres bibliothèques de gestion d'état similaires à Redux ont également été développées, telles que le nouvel entrant [Recoil](https://recoiljs.org/) et le légèrement plus ancien [MobX](https://mobx.js.org/). Cependant, selon [Npm trends](https://npmtrends.com/mobx-vs-recoil-vs-redux), Redux domine clairement toujours, et semble en fait augmenter son avance:

![graphique montrant la croissance de la popularité de redux au cours des 5 dernières années](../../images/6/64new.png)

De plus, Redux n'a pas à être utilisé dans son intégralité dans une application. Il peut être judicieux, par exemple, de gérer l'état du formulaire en dehors de Redux, surtout dans les situations où l'état d'un formulaire n'affecte pas le reste de l'application. Il est également parfaitement possible d'utiliser Redux et React Query ensemble dans la même application.

La question de savoir quelle solution de gestion d'état devrait être utilisée n'est pas du tout simple. Il est impossible de donner une réponse correcte unique. Il est également probable que la solution de gestion d'état sélectionnée puisse s'avérer sous-optimale à mesure que l'application grandit à tel point que la solution doit être changée même si l'application a déjà été mise en usage de production.

</div>