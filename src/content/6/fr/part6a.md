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

L'impact de l'action sur l'état de l'application est défini à l'aide d'un [reducer](https://redux.js.org/basics/reducers). En pratique, un réducteur est une fonction à laquelle sont donnés l'état actuel et une action comme paramètres. Elle <i>retourne</i> un nouvel état.

Définissons maintenant un réducteur pour notre application:

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

Le premier paramètre est l'<i>état</i> dans le store. Le réducteur retourne un <i>nouvel état</i> basé sur le type de _l'action_. Ainsi, par exemple, lorsque le type de l'Action est <i>INCREMENT</i>, l'état obtient l'ancienne valeur plus un. Si le type de l'Action est <i>ZERO</i>, la nouvelle valeur de l'état est zéro.

Changeons un peu le code. Nous avons utilisé des instructions if-else pour répondre à une action et changer l'état. Cependant, l'instruction [switch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch) est l'approche la plus courante pour écrire un réducteur.

Définissons également une [valeur par défaut](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters) de 0 pour le paramètre <i>état</i>. Maintenant, le réducteur fonctionne même si l'état du store n'a pas encore été initialisé.

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



</div>