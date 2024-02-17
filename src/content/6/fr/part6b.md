---
mainImage: ../../../images/part-6.svg
part: 6
letter: b
lang: fr
---

<div class="content">

Continuons notre travail avec la [version simplifiée Redux](/en/part6/flux_architecture_and_redux#redux-notes) de notre application de notes.

Pour faciliter notre développement, modifions notre réducteur afin que le store soit initialisé avec un état contenant quelques notes:

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



</div>