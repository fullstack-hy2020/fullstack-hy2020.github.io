---
mainImage: ../../../images/part-6.svg
part: 6
letter: b
lang: fr
---

<div class="content">

Continuons notre travail avec la [version simplifiée Redux](/en/part6/flux_architecture_and_redux#redux-notes) de notre application de notes.

Pour faciliter notre développement, modifions notre reducer afin que le store soit initialisé avec un état contenant quelques notes:

```js
const initialState = [
  {
    content: 'reducer defines how redux store works',
    important: true,
    id: 1,
  },
  {
    content: 'state of store can contain any data',
    important: false,
    id: 2,
  },
]

const noteReducer = (state = initialState, action) => {
  // ...
}

// ...
export default noteReducer
```

### Store avec un état complexe

Implémentons un filtrage pour les notes affichées à l'utilisateur. L'interface utilisateur pour les filtres sera mise en oeuvre avec des [boutons radio](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio):

![navigateur avec boutons radio important/pas important et liste](../../images/6/01e.png)

Commençons par une mise en oeuvre très simple et directe:

```js
import NewNote from './components/NewNote'
import Notes from './components/Notes'

const App = () => {
//highlight-start
  const filterSelected = (value) => {
    console.log(value)
  }
//highlight-end

  return (
    <div>
      <NewNote />
        //highlight-start
      <div>
        all          <input type="radio" name="filter"
          onChange={() => filterSelected('ALL')} />
        important    <input type="radio" name="filter"
          onChange={() => filterSelected('IMPORTANT')} />
        nonimportant <input type="radio" name="filter"
          onChange={() => filterSelected('NONIMPORTANT')} />
      </div>
      //highlight-end
      <Notes />
    </div>
  )
}
```

Puisque l'attribut <i>name</i> de tous les boutons radio est le même, ils forment un <i>groupe de boutons</i> où une seule option peut être sélectionnée.

Les boutons ont un gestionnaire de changement qui imprime actuellement seulement la chaîne associée au bouton cliqué dans la console.

Nous décidons d'implémenter la fonctionnalité de filtre en stockant <i>la valeur du filtre</i> dans le store Redux en plus des notes elles-mêmes. L'état du store devrait ressembler à ceci après avoir effectué ces changements:

```js
{
  notes: [
    { content: 'reducer defines how redux store works', important: true, id: 1},
    { content: 'state of store can contain any data', important: false, id: 2}
  ],
  filter: 'IMPORTANT'
}
```

Dans l'implémentation actuelle de notre application, seul le tableau de notes est stocké dans l'état. Dans la nouvelle implémentation, l'objet d'état a deux propriétés, <i>notes</i> qui contient le tableau de notes et <i>filter</i> qui contient une chaîne indiquant quelles notes doivent être affichées à l'utilisateur.

### Reducers combinés

Nous pourrions modifier notre reducer actuel pour gérer la nouvelle forme de l'état. Cependant, une meilleure solution dans cette situation est de définir un nouveau reducer séparé pour l'état du filtre:

```js
const filterReducer = (state = 'ALL', action) => {
  switch (action.type) {
    case 'SET_FILTER':
      return action.payload
    default:
      return state
  }
}
```

Les actions pour changer l'état du filtre ressemblent à ceci:

```js
{
  type: 'SET_FILTER',
  payload: 'IMPORTANT'
}
```

Créons également une nouvelle fonction de _créateur d'action_. Nous écrirons le code pour le créateur d'action dans un nouveau module <i>src/reducers/filterReducer.js</i>:

```js
const filterReducer = (state = 'ALL', action) => {
  // ...
}

export const filterChange = filter => {
  return {
    type: 'SET_FILTER',
    payload: filter,
  }
}

export default filterReducer
```

Nous pouvons créer le reducer actuel pour notre application en combinant les deux reducers existants avec la fonction [combineReducers](https://redux.js.org/api/combinereducers).

Définissons le reducer combiné dans le fichier <i>main.jsx</i>:

```js
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createStore, combineReducers } from 'redux' // highlight-line
import { Provider } from 'react-redux' 
import App from './App'

import noteReducer from './reducers/noteReducer'
import filterReducer from './reducers/filterReducer' // highlight-line

 // highlight-start
const reducer = combineReducers({
  notes: noteReducer,
  filter: filterReducer
})
 // highlight-end

const store = createStore(reducer) // highlight-line

console.log(store.getState())

/*
ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)*/

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <div />
  </Provider>
)
```

Puisque notre application se casse complètement à ce point, nous rendons un élément <i>div</i> vide au lieu du composant <i>App</i>.

L'état du store est imprimé dans la console:

[console devtools montrant les données du tableau de notes](../../images/6/4e.png)

Comme nous pouvons le voir dans la sortie, le store a exactement la forme que nous voulions!

Examinons de plus près comment le reducer combiné est créé:

```js
const reducer = combineReducers({
  notes: noteReducer,
  filter: filterReducer,
})
```

</div>