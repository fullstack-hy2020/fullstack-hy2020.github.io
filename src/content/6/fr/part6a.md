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

</div>