---
mainImage: ../../../images/part-6.svg
part: 6
letter: a
lang: fr
---

<div class="content">

Jusqu'à présent, nous avons suivi les conventions de gestion d'état recommandées par React. Nous avons placé l'état et les fonctions pour le gérer dans un [niveau supérieur](https://react.dev/learn/sharing-state-between-components) de la structure des composants de l'application. Assez souvent, la majeure partie de l'état de l'application et les fonctions modifiant l'état résident directement dans le composant racine. L'état et ses méthodes de gestion ont ensuite été passés à d'autres composants avec les props. Cela fonctionne jusqu'à un certain point, mais lorsque les applications grandissent, la gestion de l'état devient un défi.

### Architecture Flux

Il y a déjà quelques années, Facebook a développé l'architecture [Flux](https://facebookarchive.github.io/flux/docs/in-depth-overview) pour faciliter la gestion de l'état des applications React. Dans Flux, l'état est séparé des composants React et placé dans ses propres <i>stores</i>.
L'état dans le store n'est pas modifié directement, mais avec différentes <i>actions</i>.

Lorsqu'une action change l'état du store, les vues sont rerendues:

![diagramme action->dispatcher->store->vue](../../images/6/flux1.png)

Si une action dans l'application, par exemple appuyer sur un bouton, nécessite de changer l'état, le changement est réalisé avec une action.
Cela provoque à nouveau le rerendu de la vue:

![même diagramme que ci-dessus mais avec l'action bouclant en arrière](../../images/6/flux2.png)

Flux offre une manière standard de comment et où l'état de l'application est conservé et comment il est modifié.

### Redux

Facebook a une implémentation pour Flux, mais nous utiliserons la bibliothèque [Redux](https://redux.js.org). Elle fonctionne sur le même principe mais est un peu plus simple. Facebook utilise maintenant également Redux au lieu de leur Flux original.

Nous allons apprendre à connaître Redux en implémentant à nouveau une application de compteur:

![application de compteur dans le navigateur](../../images/6/1.png)

Créez une nouvelle application Vite et installez </i>redux</i> avec la commande

```bash
npm install redux
```

Comme dans Flux, dans Redux, l'état est également stocké dans un [store](https://redux.js.org/basics/store).

L'ensemble de l'état de l'application est stocké dans <i>un</i> objet JavaScript dans le store. Étant donné que notre application n'a besoin que de la valeur du compteur, nous la sauvegarderons directement dans le store. Si l'état était plus compliqué, différentes choses dans l'état seraient sauvegardées comme champs séparés de l'objet.

L'état du store est modifié avec des [actions](https://redux.js.org/basics/actions). Les actions sont des objets, qui ont au moins un champ déterminant le <i>type</i> de l'action.
Notre application a besoin par exemple de l'action suivante:

```js
{
  type: 'INCREMENT'
}
```

Si l'action implique des données, d'autres champs peuvent être déclarés selon les besoins. Cependant, notre application de comptage est si simple que les actions sont suffisantes avec juste le champ de type.

L'impact de l'action sur l'état de l'application est défini à l'aide d'un [reducer](https://redux.js.org/basics/reducers). En pratique, un reducer est une fonction à laquelle sont donnés l'état actuel et une action comme paramètres. Elle <i>retourne</i> un nouvel état.

Définissons maintenant un reducer pour notre application:

```js
const counterReducer = (state, action) => {
  if (action.type === 'INCREMENT') {
    return state + 1
  } else if (action.type === 'DECREMENT') {
    return state - 1
  } else if (action.type === 'ZERO') {
    return 0
  }

  return state
}
```

Le premier paramètre est l'<i>état</i> dans le store. Le reducer retourne un <i>nouvel état</i> basé sur le type de _l'action_. Ainsi, par exemple, lorsque le type de l'Action est <i>INCREMENT</i>, l'état obtient l'ancienne valeur plus un. Si le type de l'Action est <i>ZERO</i>, la nouvelle valeur de l'état est zéro.

Changeons un peu le code. Nous avons utilisé des instructions if-else pour répondre à une action et changer l'état. Cependant, l'instruction [switch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch) est l'approche la plus courante pour écrire un reducer.

Définissons également une [valeur par défaut](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters) de 0 pour le paramètre <i>état</i>. Maintenant, le reducer fonctionne même si l'état du store n'a pas encore été initialisé.

```js
// highlight-start
const counterReducer = (state = 0, action) => {
  // highlight-end
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    case 'ZERO':
      return 0
    default: // if none of the above matches, code comes here
      return state
  }
}
```

Reducer n'est jamais supposé être appelé directement depuis le code de l'application. Reducer est uniquement donné en paramètre à la fonction _createStore_ qui crée le store:

```js
// highlight-start
import { createStore } from 'redux'
// highlight-end

const counterReducer = (state = 0, action) => {
  // ...
}

// highlight-start
const store = createStore(counterReducer)
// highlight-end
```

Le store utilise maintenant le reducer pour gérer les <i>actions</i>, qui sont <i>dispatchées</i> ou 'envoyées' au store avec sa méthode [dispatch](https://redux.js.org/api/store#dispatchaction).

```js
store.dispatch({ type: 'INCREMENT' })
```

Vous pouvez connaître l'état du store en utilisant la méthode [getState](https://redux.js.org/api/store#getstate).

Par exemple, le code suivant:

```js
const store = createStore(counterReducer)
console.log(store.getState())
store.dispatch({ type: 'INCREMENT' })
store.dispatch({ type: 'INCREMENT' })
store.dispatch({ type: 'INCREMENT' })
console.log(store.getState())
store.dispatch({ type: 'ZERO' })
store.dispatch({ type: 'DECREMENT' })
console.log(store.getState())
```

imprimerait ce qui suit dans la console

<pre>
0
3
-1
</pre>

car au début, l'état du store est de 0. Après trois actions <i>INCREMENT</i>, l'état est de 3. À la fin, après les actions <i>ZERO</i> et <i>DECREMENT</i>, l'état est de -1.

La troisième méthode importante que le store possède est [subscribe](https://redux.js.org/api/store#subscribelistener), qui est utilisée pour créer des fonctions de rappel que le store appelle chaque fois qu'une action est dispatchée au store.

Si, par exemple, nous ajoutions la fonction suivante à subscribe, <i>chaque changement dans le store</i> serait imprimé dans la console.

```js
store.subscribe(() => {
  const storeNow = store.getState()
  console.log(storeNow)
})
```

donc le code

```js
const store = createStore(counterReducer)

store.subscribe(() => {
  const storeNow = store.getState()
  console.log(storeNow)
})

store.dispatch({ type: 'INCREMENT' })
store.dispatch({ type: 'INCREMENT' })
store.dispatch({ type: 'INCREMENT' })
store.dispatch({ type: 'ZERO' })
store.dispatch({ type: 'DECREMENT' })
```

provoquerait l'impression suivante

<pre>
1
2
3
0
-1
</pre>

Le code de notre application compteur est le suivant. Tout le code a été écrit dans le même fichier (_main.jsx_), donc le <i>store</i> est directement disponible pour le code React. Nous découvrirons plus tard de meilleures façons de structurer le code React/Redux.

```js
import React from 'react'
import ReactDOM from 'react-dom/client'

import { createStore } from 'redux'

const counterReducer = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    case 'ZERO':
      return 0
    default:
      return state
  }
}

const store = createStore(counterReducer)

const App = () => {
  return (
    <div>
      <div>
        {store.getState()}
      </div>
      <button 
        onClick={e => store.dispatch({ type: 'INCREMENT' })}
      >
        plus
      </button>
      <button
        onClick={e => store.dispatch({ type: 'DECREMENT' })}
      >
        minus
      </button>
      <button 
        onClick={e => store.dispatch({ type: 'ZERO' })}
      >
        zero
      </button>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))

const renderApp = () => {
  root.render(<App />)
}

renderApp()
store.subscribe(renderApp)
```

Il y a quelques points notables dans le code.
<i>App</i> rend la valeur du compteur en la demandant au store avec la méthode _store.getState()_. Les gestionnaires d'action des boutons <i>dispatch</i> les bonnes actions au store.

Lorsque l'état dans le store est changé, React n'est pas capable de rerendre automatiquement l'application. Ainsi, nous avons enregistré une fonction _renderApp_, qui rend toute l'application, pour écouter les changements dans le store avec la méthode _store.subscribe_. Notez que nous devons immédiatement appeler la méthode _renderApp_. Sans cet appel, le premier rendu de l'application ne se produirait jamais.

### Une note sur l'utilisation de createStore

Les plus observateurs remarqueront que le nom de la fonction createStore est barré. Si vous déplacez la souris sur le nom, une explication apparaîtra

![erreur vscode montrant createStore déprécié et recommandant d'utiliser configureStore](../../images/6/30new.png)

L'explication complète est la suivante

><i>Nous recommandons d'utiliser la méthode configureStore du package @reduxjs/toolkit, qui remplace createStore.</i>
>
><i>Redux Toolkit est notre approche recommandée pour écrire la logique Redux aujourd'hui, y compris la configuration du store, les reducers, la récupération de données et plus encore.</i>
>
><i>Pour plus de détails, veuillez lire cette page de documentation Redux: <https://redux.js.org/introduction/why-rtk-is-redux-today></i>
>
><i>configureStore de Redux Toolkit est une version améliorée de createStore qui simplifie la configuration et aide à éviter les bugs courants.</i>
>
><i>Vous ne devriez pas utiliser le package redux core seul aujourd'hui, sauf à des fins d'apprentissage. La méthode createStore du package redux core ne sera pas retirée, mais nous encourageons tous les utilisateurs à migrer vers l'utilisation de Redux Toolkit pour tout le code Redux.</i>

Donc, au lieu de la fonction <i>createStore</i>, il est recommandé d'utiliser la fonction un peu plus "avancée" <i>configureStore</i>, et nous l'utiliserons également lorsque nous aurons atteint la fonctionnalité de base de Redux.

Note à part: <i>createStore</i> est défini comme "déprécié", ce qui signifie généralement que la fonctionnalité sera retirée dans une version plus récente de la bibliothèque. L'explication ci-dessus et la discussion de [celle-ci](https://stackoverflow.com/questions/71944111/redux-createstore-is-deprecated-cannot-get-state-from-getstate-in-redux-ac) révèlent que <i>createStore</i> ne sera pas retiré, et il a été donné le statut <i>déprécié</i>, peut-être pour des raisons légèrement incorrectes. Donc, la fonction n'est pas obsolète, mais aujourd'hui, il y a une nouvelle manière plus préférable de faire presque la même chose.

### Notes sur Redux

Nous visons à modifier notre application de notes pour utiliser Redux pour la gestion de l'état. Cependant, couvrons d'abord quelques concepts clés à travers une application de notes simplifiée.

La première version de notre application est la suivante

```js
const noteReducer = (state = [], action) => {
  if (action.type === 'NEW_NOTE') {
    state.push(action.payload)
    return state
  }

  return state
}

const store = createStore(noteReducer)

store.dispatch({
  type: 'NEW_NOTE',
  payload: {
    content: 'the app state is in redux store',
    important: true,
    id: 1
  }
})

store.dispatch({
  type: 'NEW_NOTE',
  payload: {
    content: 'state changes are made with actions',
    important: false,
    id: 2
  }
})

const App = () => {
  return(
    <div>
      <ul>
        {store.getState().map(note=>
          <li key={note.id}>
            {note.content} <strong>{note.important ? 'important' : ''}</strong>
          </li>
        )}
        </ul>
    </div>
  )
}
```

Jusqu'à présent, l'application n'a pas la fonctionnalité pour ajouter de nouvelles notes, bien qu'il soit possible de le faire en dispatchant des actions <i>NEW\_NOTE</i>.

Maintenant, les actions ont un type et un champ <i>payload</i>, qui contient la note à ajouter:

```js
{
  type: 'NEW_NOTE',
  payload: {
    content: 'state changes are made with actions',
    important: false,
    id: 2
  }
}
```

Le choix du nom du champ n'est pas aléatoire. La convention générale est que les actions ont exactement deux champs, <i>type</i> indiquant le type et <i>payload</i> contenant les données incluses avec l'Action.

### Fonctions pures, immuables

La version initiale du reducer est très simple:

```js
const noteReducer = (state = [], action) => {
  if (action.type === 'NEW_NOTE') {
    state.push(action.payload)
    return state
  }

  return state
}
```

L'état est maintenant un tableau. Les actions de type <i>NEW\_NOTE</i> entraînent l'ajout d'une nouvelle note à l'état avec la méthode [push](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push).

L'application semble fonctionner, mais le reducer que nous avons déclaré est mauvais. Il casse [l'hypothèse de base](https://redux.js.org/tutorials/essentials/part-1-overview-concepts#reducers) de Redux selon laquelle les reducer doivent être des [fonctions pures](https://en.wikipedia.org/wiki/Pure_function).

Les fonctions pures sont telles qu'elles <i>ne provoquent aucun effet de bord</i> et doivent toujours renvoyer la même réponse lorsqu'elles sont appelées avec les mêmes paramètres.

Nous avons ajouté une nouvelle note à l'état avec la méthode _state.push(action.payload)_ qui <i>change</i> l'état de l'objet état. Cela n'est pas autorisé. Le problème est facilement résolu en utilisant la méthode [concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat), qui crée un <i>nouveau tableau</i>, contenant tous les éléments de l'ancien tableau et le nouvel élément:

```js
const noteReducer = (state = [], action) => {
  if (action.type === 'NEW_NOTE') {
    // highlight-start
    return state.concat(action.payload)
    // highlight-end
  }

  return state
}
```

Un état de reducer doit être composé d'objets [immuables](https://en.wikipedia.org/wiki/Immutable_object). Si un changement se produit dans l'état, l'ancien objet n'est pas modifié, mais il est <i>remplacé par un nouvel objet modifié</i>. C'est exactement ce que nous avons fait avec le nouveau reducer: l'ancien tableau est remplacé par le nouveau.

Étendons notre reducer pour qu'il puisse gérer le changement d'importance d'une note:

```js
{
  type: 'TOGGLE_IMPORTANCE',
  payload: {
    id: 2
  }
}
```

Puisque nous n'avons pas encore de code qui utilise cette fonctionnalité, nous étendons le reducer de manière 'test-driven'. Commençons par créer un test pour gérer l'action <i>NEW\_NOTE</i>.

Nous devons d'abord configurer la bibliothèque de tests [Jest](https://jestjs.io/) pour le projet. Installons les dépendances suivantes:

```js
npm install --save-dev jest @babel/preset-env @babel/preset-react eslint-plugin-jest
```

Ensuite, nous allons créer le fichier <i>.babelrc</i>, avec le contenu suivant:

```json
{
  "presets": [
    "@babel/preset-env",
    ["@babel/preset-react", { "runtime": "automatic" }]
  ]
}
```

Étendons le fichier <i>package.json</i> avec un script pour exécuter les tests:

```json
{
  // ...
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "test": "jest" // highlight-line
  },
  // ...
}
```

Et enfin, le fichier <i>.eslintrc.cjs</i> doit être modifié comme suit:

```js
module.exports = {
  root: true,
  env: { 
    browser: true,
    es2020: true,
    "jest/globals": true // highlight-line
  },
  // ...
}
```

Pour faciliter les tests, nous allons d'abord déplacer le code du reducer dans son propre module, dans le fichier <i>src/reducers/noteReducer.js</i>. Nous allons également ajouter la bibliothèque [deep-freeze](https://www.npmjs.com/package/deep-freeze), qui peut être utilisée pour s'assurer que le reducer a été correctement défini comme une fonction immuable.
Installons la bibliothèque en tant que dépendance de développement

```js
npm install --save-dev deep-freeze
```

Le test, que nous définissons dans le fichier <i>src/reducers/noteReducer.test.js</i>, contient le contenu suivant:

```js
import noteReducer from './noteReducer'
import deepFreeze from 'deep-freeze'

describe('noteReducer', () => {
  test('returns new state with action NEW_NOTE', () => {
    const state = []
    const action = {
      type: 'NEW_NOTE',
      payload: {
        content: 'the app state is in redux store',
        important: true,
        id: 1
      }
    }

    deepFreeze(state)
    const newState = noteReducer(state, action)

    expect(newState).toHaveLength(1)
    expect(newState).toContainEqual(action.payload)
  })
})
```

La commande <i>deepFreeze(state)</i> garantit que le reducer ne modifie pas l'état du store qui lui est donné en paramètre. Si le reducer utilise la commande push pour manipuler l'état, le test ne passera pas

![terminal montrant l'échec du test et une erreur concernant l'utilisation de array.push](../../images/6/2.png)

Maintenant, nous allons créer un test pour l'action <i>TOGGLE\_IMPORTANCE</i>:

```js
test('returns new state with action TOGGLE_IMPORTANCE', () => {
  const state = [
    {
      content: 'the app state is in redux store',
      important: true,
      id: 1
    },
    {
      content: 'state changes are made with actions',
      important: false,
      id: 2
    }]

  const action = {
    type: 'TOGGLE_IMPORTANCE',
    payload: {
      id: 2
    }
  }

  deepFreeze(state)
  const newState = noteReducer(state, action)

  expect(newState).toHaveLength(2)

  expect(newState).toContainEqual(state[0])

  expect(newState).toContainEqual({
    content: 'state changes are made with actions',
    important: true,
    id: 2
  })
})
```

Donc l'action suivante

```js
{
  type: 'TOGGLE_IMPORTANCE',
  payload: {
    id: 2
  }
}
```

doit changer l'importance de la note avec l'id 2.

Le reducer est étendu comme suit

```js
const noteReducer = (state = [], action) => {
  switch(action.type) {
    case 'NEW_NOTE':
      return state.concat(action.payload)
    case 'TOGGLE_IMPORTANCE': {
      const id = action.payload.id
      const noteToChange = state.find(n => n.id === id)
      const changedNote = { 
        ...noteToChange, 
        important: !noteToChange.important 
      }
      return state.map(note =>
        note.id !== id ? note : changedNote 
      )
     }
    default:
      return state
  }
}
```

Nous créons une copie de la note dont l'importance a changé avec la syntaxe [familier de la partie 2](/fr/part2/modification_des_donnees_cote_serveur), et remplaçons l'état par un nouvel état contenant toutes les notes qui n'ont pas changé et la copie de la note modifiée <i>changedNote</i>.

Récapitulons ce qui se passe dans le code. D'abord, nous recherchons un objet note spécifique, dont nous voulons changer l'importance:

```js
const noteToChange = state.find(n => n.id === id)
```

ensuite, nous créons un nouvel objet, qui est une <i>copie</i> de la note originale, seul la valeur du champ <i>important</i> a été changée pour l'opposé de ce qu'elle était:

```js
const changedNote = { 
  ...noteToChange, 
  important: !noteToChange.important 
}
```

Un nouvel état est ensuite retourné. Nous le créons en prenant toutes les notes de l'ancien état à l'exception de la note désirée, que nous remplaçons par sa copie légèrement modifiée:

```js
state.map(note =>
  note.id !== id ? note : changedNote 
)
```

### Syntaxe de décomposition des tableaux

Puisque nous avons maintenant de bons tests pour le reducer, nous pouvons refactoriser le code en toute sécurité.

L'ajout d'une nouvelle note crée l'état qu'il retourne avec la fonction _concat_ de Array. Examinons comment nous pouvons obtenir le même résultat en utilisant la syntaxe de [décomposition des tableaux](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator) de JavaScript:

```js
const noteReducer = (state = [], action) => {
  switch(action.type) {
    case 'NEW_NOTE':
      // highlight-start
      return [...state, action.payload]
      // highlight-end
    case 'TOGGLE_IMPORTANCE':
      // ...
    default:
    return state
  }
}
```

La syntaxe de décomposition fonctionne comme suit. Si nous déclarons

```js
const numbers = [1, 2, 3]
```

<code>...numbers</code> décompose le tableau en éléments individuels, qui peuvent être placés dans un autre tableau.

```js
[...numbers, 4, 5]
```

et le résultat est un tableau <i>[1, 2, 3, 4, 5]</i>.

Si nous avions placé le tableau dans un autre tableau sans la décomposition

```js
[numbers, 4, 5]
```

le résultat aurait été <i>[ [1, 2, 3], 4, 5]</i>.

Lorsque nous prenons des éléments d'un tableau par [déstructuration](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment), une syntaxe d'apparence similaire est utilisée pour <i>rassembler</i> le reste des éléments:

```js
const numbers = [1, 2, 3, 4, 5, 6]

const [first, second, ...rest] = numbers

console.log(first)     // prints 1
console.log(second)   // prints 2
console.log(rest)     // prints [3, 4, 5, 6]
```

</div>

<div class="tasks">

### Exercices 6.1.-6.2.

Faisons une version simplifiée de l'exercice unicafe de la partie 1. Gérons la gestion de l'état avec Redux.

Vous pouvez prendre le projet de ce dépôt <https://github.com/fullstack-hy2020/unicafe-redux> comme base pour votre projet.

<i>Commencez par supprimer la configuration git du dépôt cloné, et par installer les dépendances</i>

```bash
cd unicafe-redux   // go to the directory of cloned repository
rm -rf .git
npm install
```

### 6.1 : unicafe revisité, étape 1

Avant d'implémenter la fonctionnalité de l'UI, implémentons la fonctionnalité requise par le store.

Nous devons sauvegarder le nombre de chaque type de retour dans le store, donc la forme de l'état dans le store est:

```js
{
  good: 5,
  ok: 4,
  bad: 2
}
```

Le projet a la base suivante pour un reducer:

```js
const initialState = {
  good: 0,
  ok: 0,
  bad: 0
}

const counterReducer = (state = initialState, action) => {
  console.log(action)
  switch (action.type) {
    case 'GOOD':
      return state
    case 'OK':
      return state
    case 'BAD':
      return state
    case 'ZERO':
      return state
    default: return state
  }

}

export default counterReducer
```

et une base pour ses tests

```js
import deepFreeze from 'deep-freeze'
import counterReducer from './reducer'

describe('unicafe reducer', () => {
  const initialState = {
    good: 0,
    ok: 0,
    bad: 0
  }

  test('should return a proper initial state when called with undefined state', () => {
    const state = {}
    const action = {
      type: 'DO_NOTHING'
    }

    const newState = counterReducer(undefined, action)
    expect(newState).toEqual(initialState)
  })

  test('good is incremented', () => {
    const action = {
      type: 'GOOD'
    }
    const state = initialState

    deepFreeze(state)
    const newState = counterReducer(state, action)
    expect(newState).toEqual({
      good: 1,
      ok: 0,
      bad: 0
    })
  })
})
```

**Implémentez le reducer et ses tests.**

Dans les tests, assurez-vous que le reducer est une <i>fonction immuable</i> avec la bibliothèque <i>deep-freeze</i>.
Assurez-vous que le premier test fourni passe, car Redux s'attend à ce que le reducer retourne un état initial sensé lorsqu'il est appelé de sorte que le premier paramètre <i>state</i>, qui représente l'état précédent, soit <i>undefined</i>.

Commencez par étendre le reducer pour que les deux tests passent. Ensuite, ajoutez le reste des tests, et enfin la fonctionnalité qu'ils testent.

Un bon modèle pour le reducer est l'exemple [redux-notes](/en/part6/flux_architecture_and_redux#pure-functions-immutable) ci-dessus.

#### 6.2 : unicafe revisité, étape 2

Implémentez maintenant la fonctionnalité réelle de l'application.

Votre application peut avoir une apparence modeste, rien d'autre n'est nécessaire à part des boutons et le nombre d'avis pour chaque type:

![navigateur montrant les boutons bon, mauvais, ok](../../images/6/50new.png)

</div>

<div class="content">

### Formulaire non contrôlé

Ajoutons la fonctionnalité pour ajouter de nouvelles notes et changer leur importance:

```js
// highlight-start
const generateId = () =>
  Number((Math.random() * 1000000).toFixed(0))
// highlight-end

const App = () => {
  // highlight-start
  const addNote = (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    store.dispatch({
      type: 'NEW_NOTE',
      payload: {
        content,
        important: false,
        id: generateId()
      }
    })
  }
    // highlight-end

  // highlight-start
  const toggleImportance = (id) => {
    store.dispatch({
      type: 'TOGGLE_IMPORTANCE',
      payload: { id }
    })
  }
    // highlight-end

  return (
    <div>
      // highlight-start
      <form onSubmit={addNote}>
        <input name="note" /> 
        <button type="submit">add</button>
      </form>
        // highlight-end
      <ul>
        {store.getState().map(note =>
          <li
            key={note.id} 
            onClick={() => toggleImportance(note.id)}   // highlight-line
          >
            {note.content} <strong>{note.important ? 'important' : ''}</strong>
          </li>
        )}
      </ul>
    </div>
  )
}
```

L'implémentation des deux fonctionnalités est simple. Il est notable que nous n'avons <i>pas</i> lié l'état des champs du formulaire à l'état du composant <i>App</i> comme nous l'avons précédemment fait. React appelle ce type de formulaire [non contrôlé](https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable).

>Les formulaires non contrôlés ont certaines limitations (par exemple, les messages d'erreur dynamiques ou la désactivation du bouton d'envoi en fonction de l'entrée ne sont pas possibles). Cependant, ils conviennent à nos besoins actuels.

Vous pouvez en savoir plus sur les formulaires non contrôlés [ici](https://goshakkk.name/controlled-vs-uncontrolled-inputs-react/).

La méthode de gestion pour ajouter de nouvelles notes est simple, elle dispatche juste l'action pour ajouter des notes:

```js
addNote = (event) => {
  event.preventDefault()
  const content = event.target.note.value  // highlight-line
  event.target.note.value = ''
  store.dispatch({
    type: 'NEW_NOTE',
    payload: {
      content,
      important: false,
      id: generateId()
    }
  })
}
```

Nous pouvons obtenir le contenu de la nouvelle note directement à partir du champ du formulaire. Comme le champ a un nom, nous pouvons accéder au contenu via l'objet événement <i>event.target.note.value</i>.

```js
<form onSubmit={addNote}>
  <input name="note" /> // highlight-line
  <button type="submit">add</button>
</form>
```

L'importance d'une note peut être changée en cliquant sur son nom. Le gestionnaire d'événement est très simple:

```js
toggleImportance = (id) => {
  store.dispatch({
    type: 'TOGGLE_IMPORTANCE',
    payload: { id }
  })
}
```

### Créateurs d'actions

Nous commençons à remarquer que, même dans des applications aussi simples que la nôtre, l'utilisation de Redux peut simplifier le code frontend. Cependant, nous pouvons faire beaucoup mieux.

Les composants React n'ont pas besoin de connaître les types d'actions et les formulaires Redux.
Séparons la création d'actions en fonctions distinctes:

```js
const createNote = (content) => {
  return {
    type: 'NEW_NOTE',
    payload: {
      content,
      important: false,
      id: generateId()
    }
  }
}

const toggleImportanceOf = (id) => {
  return {
    type: 'TOGGLE_IMPORTANCE',
    payload: { id }
  }
}
```

Les fonctions qui créent des actions sont appelées [créateurs d'actions](https://redux.js.org/tutorials/fundamentals/part-7-standard-patterns#action-creators).

Le composant <i>App</i> n'a plus besoin de connaître quoi que ce soit sur la représentation interne des actions, il obtient simplement la bonne action en appelant la fonction créatrice:

```js
const App = () => {
  const addNote = (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    store.dispatch(createNote(content)) // highlight-line
    
  }
  
  const toggleImportance = (id) => {
    store.dispatch(toggleImportanceOf(id))// highlight-line
  }

  // ...
}
```

### Transmettre le Store Redux à divers composants

À part le reducer, notre application est dans un seul fichier. Cela n'est bien sûr pas sensé, et nous devrions séparer <i>App</i> dans son propre module.

La question est maintenant, comment <i>App</i> peut-il accéder au store après le déménagement? Et plus largement, lorsqu'un composant est composé de nombreux petits composants, il doit y avoir un moyen pour tous les composants d'accéder au store.
Il existe plusieurs façons de partager le store Redux avec les composants. D'abord, nous examinerons la manière la plus récente, et peut-être la plus facile, qui est d'utiliser l'API [hooks](https://react-redux.js.org/api/hooks) de la bibliothèque [react-redux](https://react-redux.js.org/).

D'abord, nous installons react-redux

```bash
npm install react-redux
```

Ensuite, nous déplaçons le composant _App_ dans son propre fichier _App.jsx_. Voyons comment cela affecte le reste des fichiers de l'application.

_main.jsx_ devient:

```js
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createStore } from 'redux'
import { Provider } from 'react-redux' // highlight-line

import App from './App'
import noteReducer from './reducers/noteReducer'

const store = createStore(noteReducer)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>  // highlight-line
    <App />
  </Provider>  // highlight-line
)
```

Notez que l'application est maintenant définie comme un enfant d'un composant [Provider](https://react-redux.js.org/api/provider) fourni par la bibliothèque react-redux.
Le store de l'application est donné au Provider en tant qu'attribut <i>store</i>.

La définition des créateurs d'actions a été déplacée dans le fichier <i>reducers/noteReducer.js</i> où le reducer est défini. Ce fichier ressemble à ceci:

```js
const noteReducer = (state = [], action) => {
  // ...
}

const generateId = () =>
  Number((Math.random() * 1000000).toFixed(0))

export const createNote = (content) => { // highlight-line
  return {
    type: 'NEW_NOTE',
    payload: {
      content,
      important: false,
      id: generateId()
    }
  }
}

export const toggleImportanceOf = (id) => { // highlight-line
  return {
    type: 'TOGGLE_IMPORTANCE',
    payload: { id }
  }
}

export default noteReducer
```

Si l'application a de nombreux composants qui ont besoin du store, le composant <i>App</i> doit passer <i>store</i> comme props à tous ces composants.

Le module a maintenant plusieurs commandes [export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export).

La fonction reducer est toujours retournée avec la commande <i>export default</i>, donc le reducer peut être importé de la manière habituelle:

```js
import noteReducer from './reducers/noteReducer'
```

Un module peut avoir seulement <i>un export par défaut</i>, mais plusieurs exports "normaux"

```js
export const createNote = (content) => {
  // ...
}

export const toggleImportanceOf = (id) => { 
  // ...
}
```

Les fonctions exportées normalement (pas par défaut) peuvent être importées avec la syntaxe des accolades:

```js
import { createNote } from './../reducers/noteReducer'
```

Code pour le composant <i>App</i>

```js
import { createNote, toggleImportanceOf } from './reducers/noteReducer' // highlight-line
import { useSelector, useDispatch } from 'react-redux'  // highlight-line

const App = () => {
  const dispatch = useDispatch()  // highlight-line
  const notes = useSelector(state => state)  // highlight-line

  const addNote = (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    dispatch(createNote(content))  // highlight-line
  }

  const toggleImportance = (id) => {
    dispatch(toggleImportanceOf(id)) // highlight-line
  }

  return (
    <div>
      <form onSubmit={addNote}>
        <input name="note" /> 
        <button type="submit">add</button>
      </form>
      <ul>
        {notes.map(note =>  // highlight-line
          <li
            key={note.id} 
            onClick={() => toggleImportance(note.id)}
          >
            {note.content} <strong>{note.important ? 'important' : ''}</strong>
          </li>
        )}
      </ul>
    </div>
  )
}

export default App
```

Il y a quelques points à noter dans le code. Auparavant, le code dispatchait des actions en appelant la méthode dispatch du store Redux:

```js
store.dispatch({
  type: 'TOGGLE_IMPORTANCE',
  payload: { id }
})
```

Maintenant, cela se fait avec la fonction <i>dispatch</i> provenant du hook [useDispatch](https://react-redux.js.org/api/hooks#usedispatch).

```js
import { useSelector, useDispatch } from 'react-redux'  // highlight-line

const App = () => {
  const dispatch = useDispatch()  // highlight-line
  // ...

  const toggleImportance = (id) => {
    dispatch(toggleImportanceOf(id)) // highlight-line
  }

  // ...
}
```

Le hook <i>useDispatch</i> donne à n'importe quel composant React l'accès à la fonction dispatch du store Redux défini dans <i>main.jsx</i>. Cela permet à tous les composants de modifier l'état du store Redux.

Le composant peut accéder aux notes stockées dans le store avec le hook [useSelector](https://react-redux.js.org/api/hooks#useselector) de la bibliothèque react-redux.

```js
import { useSelector, useDispatch } from 'react-redux'  // highlight-line

const App = () => {
  // ...
  const notes = useSelector(state => state)  // highlight-line
  // ...
}
```

<i>useSelector</i> reçoit une fonction en paramètre. La fonction recherche ou sélectionne des données dans le store Redux.
Ici, nous avons besoin de toutes les notes, donc notre fonction sélecteur retourne l'ensemble de l'état:

```js
state => state
```

which is a shorthand for:

```js
(state) => {
  return state
}
```

Habituellement, les fonctions sélecteurs sont un peu plus intéressantes et ne retournent que des parties sélectionnées du contenu du store Redux.
Nous pourrions par exemple ne retourner que les notes marquées comme importantes:

```js
const importantNotes = useSelector(state => state.filter(note => note.important))  
```

La version actuelle de l'application peut être trouvée sur [GitHub](https://github.com/fullstack-hy2020/redux-notes/tree/part6-0), branche <i>part6-0</i>.

### Plus de composants

Séparons la création d'une nouvelle note en un composant.

```js
import { useDispatch } from 'react-redux' // highlight-line
import { createNote } from '../reducers/noteReducer' // highlight-line

const NewNote = () => {
  const dispatch = useDispatch() // highlight-line

  const addNote = (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    dispatch(createNote(content)) // highlight-line
  }

  return (
    <form onSubmit={addNote}>
      <input name="note" />
      <button type="submit">add</button>
    </form>
  )
}

export default NewNote
```

Contrairement au code React que nous avons fait sans Redux, le gestionnaire d'événement pour changer l'état de l'application (qui vit maintenant dans Redux) a été déplacé de <i>App</i> vers un composant enfant. La logique de changement d'état dans Redux est toujours soigneusement séparée de toute la partie React de l'application.

Nous allons également séparer la liste des notes et l'affichage d'une seule note en leurs propres composants (qui seront tous deux placés dans le fichier <i>Notes.jsx</i>):

```js
import { useDispatch, useSelector } from 'react-redux' // highlight-line
import { toggleImportanceOf } from '../reducers/noteReducer' // highlight-line

const Note = ({ note, handleClick }) => {
  return(
    <li onClick={handleClick}>
      {note.content} 
      <strong> {note.important ? 'important' : ''}</strong>
    </li>
  )
}

const Notes = () => {
  const dispatch = useDispatch() // highlight-line
  const notes = useSelector(state => state) // highlight-line

  return(
    <ul>
      {notes.map(note =>
        <Note
          key={note.id}
          note={note}
          handleClick={() => 
            dispatch(toggleImportanceOf(note.id))
          }
        />
      )}
    </ul>
  )
}

export default Notes
```

La logique de changement de l'importance d'une note se trouve maintenant dans le composant qui gère la liste des notes.

Il ne reste pas beaucoup de code dans <i>App</i>:

```js
const App = () => {

  return (
    <div>
      <NewNote />
      <Notes />
    </div>
  )
}
```

<i>Note</i>, responsable du rendu d'une note unique, est très simple et n'est pas conscient que le gestionnaire d'événement qu'il reçoit en props dispatche une action. Ce type de composants est appelé [présentationnel](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) dans la terminologie React.

<i>Notes</i>, d'autre part, est un composant [conteneur](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0), car il contient une certaine logique d'application : il définit ce que font les gestionnaires d'événements des composants <i>Note</i> et coordonne la configuration des composants <i>présentationnels</i>, c'est-à-dire, les <i>Note</i>s.

Le code de l'application Redux peut être trouvé sur [GitHub](https://github.com/fullstack-hy2020/redux-notes/tree/part6-1), branche <i>part6-1</i>.

</div>

<div class="tasks">

### Exercices 6.3.-6.8.

Réalisons une nouvelle version de l'application de vote d'anecdotes de la partie 1. Prenez le projet de ce dépôt <https://github.com/fullstack-hy2020/redux-anecdotes> comme base pour votre solution.

Si vous clonez le projet dans un dépôt git existant, <i>supprimez la configuration git de l'application clonée :</i>

```bash
cd redux-anecdotes  // go to the cloned repository
rm -rf .git
```

L'application peut être démarrée comme d'habitude, mais vous devez d'abord installer les dépendances:

```bash
npm install
npm run dev
```

Après avoir terminé ces exercices, votre application devrait ressembler à ceci :

![navigateur montrant des anecdotes et des boutons de vote](../../images/6/3.png)

#### 6.3 : anecdotes, étape 1

Implémentez la fonctionnalité de vote pour les anecdotes. Le nombre de votes doit être sauvegardé dans un store Redux.

#### 6.4 : anecdotes, étape 2

Implémentez la fonctionnalité pour ajouter de nouvelles anecdotes.

Vous pouvez garder le formulaire non contrôlé comme nous l'avons fait [précédemment](/en/part6/flux_architecture_and_redux#uncontrolled-form).

#### 6.5 : anecdotes, étape 3

Assurez-vous que les anecdotes sont ordonnées par le nombre de votes.

#### 6.6 : anecdotes, étape 4

Si vous ne l'avez pas déjà fait, séparez la création d'objets d'action en fonctions de [créateurs d'action](https://read.reduxbook.com/markdown/part1/04-action-creators.html) et placez-les dans le fichier <i>src/reducers/anecdoteReducer.js</i>, donc faites ce que nous avons fait depuis le chapitre [créateurs d'actions](/en/part6/flux_architecture_and_redux#action-creators).

#### 6.7 : anecdotes, étape 5

Séparez la création de nouvelles anecdotes dans un composant appelé <i>AnecdoteForm</i>. Déplacez toute la logique de création d'une nouvelle anecdote dans ce nouveau composant.

#### 6.8 : anecdotes, étape 6

Séparez le rendu de la liste des anecdotes dans un composant appelé <i>AnecdoteList</i>. Déplacez toute la logique liée au vote pour une anecdote dans ce nouveau composant.

Maintenant, le composant <i>App</i> devrait ressembler à cela:

```js
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'

const App = () => {
  return (
    <div>
      <h2>Anecdotes</h2>
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App
```

</div>