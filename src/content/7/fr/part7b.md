---
mainImage: ../../../images/part-7.svg
part: 7
letter: b
lang: fr
---

<div class="content">

### Hooks

React offre 15 [hooks intégrés](https://react.dev/reference/react) différents, parmi lesquels les plus populaires sont les hooks [useState](https://react.dev/reference/react/useState) et [useEffect](https://react.dev/reference/react/useEffect) que nous avons déjà beaucoup utilisés.

Dans la [partie 5](/fr/part5/props_children_et_proptypes#references-aux-composants-avec-ref), nous avons utilisé le hook [useImperativeHandle]((https://react.dev/reference/react/useImperativeHandle)) qui permet aux composants de fournir leurs fonctions à d'autres composants. Dans la [partie 6](/en/part6/react_query_use_reducer_and_the_context), nous avons utilisé [useReducer](https://react.dev/reference/react/useReducer) et [useContext](https://react.dev/reference/react/useContext) pour implémenter une gestion d'état à la manière de Redux.

Au cours des dernières années, de nombreuses bibliothèques React ont commencé à offrir des API basées sur les hooks. Dans la [partie 6](/fr/part6/architecture_de_flux_et_redux), nous avons utilisé les hooks [useSelector](https://react-redux.js.org/api/hooks#useselector) et [useDispatch](https://react-redux.js.org/api/hooks#usedispatch) de la bibliothèque react-redux pour partager notre redux-store et la fonction dispatch avec nos composants.

L'API de [React Router](https://reactrouter.com/en/main/start/tutorial) que nous avons introduite dans la [partie précédente](/en/part7/react_router) est également partiellement basée sur les hooks. Ses hooks peuvent être utilisés pour accéder aux paramètres de l'URL et à l'objet de <i>navigation</i>, qui permet de manipuler l'URL du navigateur de manière programmatique.

Comme mentionné dans la [partie 1](/fr/part1/plongez_dans_le_debogage_dapplications_react#regles-des-hooks), les hooks ne sont pas des fonctions normales, et lorsque nous les utilisons, nous devons adhérer à certaines [règles ou limitations](https://legacy.reactjs.org/docs/hooks-rules.html). Récapitulons les règles d'utilisation des hooks, copiées mot pour mot de la documentation officielle de React:

**Ne pas appeler les Hooks dans des boucles, conditions, ou fonctions imbriquées.** Au lieu de cela, utilisez toujours les Hooks au niveau supérieur de votre fonction React.

**Ne pas appeler les Hooks depuis des fonctions JavaScript classiques.** Au lieu de cela, vous pouvez:

- Appeler les Hooks depuis les composants de fonction React.
- Appeler les Hooks depuis des hooks personnalisés

Il existe un [plugin ESLint](https://www.npmjs.com/package/eslint-plugin-react-hooks) qui peut être utilisé pour vérifier que l'application utilise correctement les hooks:

![erreur vscode useState appelé conditionnellement](../../images/7/60ea.png)

### Hooks personnalisés

React offre la possibilité de créer des hooks [personnalisés](https://react.dev/learn/reusing-logic-with-custom-hooks). Selon React, l'objectif principal des hooks personnalisés est de faciliter la réutilisation de la logique utilisée dans les composants.

> <i>Construire vos propres Hooks vous permet d'extraire la logique des composants en fonctions réutilisables.</i>

Les hooks personnalisés sont des fonctions JavaScript régulières qui peuvent utiliser n'importe quel autre hook, tant qu'ils adhèrent aux [règles des hooks](/fr/part1/plongez_dans_le_debogage_dapplications_react#regles-des-hooks). De plus, le nom des hooks personnalisés doit commencer par le mot use.

Nous avons implémenté une application de compteur dans la [partie 1](/fr/part1/etat_des_composants_gestionnaires_devenements#le-gestionnaire-devenements-est-une-fonction) qui peut voir sa valeur incrémentée, décrémentée ou réinitialisée. Le code de l'application est le suivant:

```js  
import { useState } from 'react'
const App = () => {
  const [counter, setCounter] = useState(0)

  return (
    <div>
      <div>{counter}</div>
      <button onClick={() => setCounter(counter + 1)}>
        plus
      </button>
      <button onClick={() => setCounter(counter - 1)}>
        minus
      </button>      
      <button onClick={() => setCounter(0)}>
        zero
      </button>
    </div>
  )
}
```

Extrayons la logique du compteur dans un hook personnalisé. Le code du hook est le suivant:

```js
const useCounter = () => {
  const [value, setValue] = useState(0)

  const increase = () => {
    setValue(value + 1)
  }

  const decrease = () => {
    setValue(value - 1)
  }

  const zero = () => {
    setValue(0)
  }

  return {
    value, 
    increase,
    decrease,
    zero
  }
}
```

Notre hook personnalisé utilise en interne le hook _useStat_e_ pour créer son état. Le hook retourne un objet, dont les propriétés incluent la valeur du compteur ainsi que des fonctions pour manipuler la valeur.

Les composants React peuvent utiliser le hook comme montré ci-dessous:

```js
const App = () => {
  const counter = useCounter()

  return (
    <div>
      <div>{counter.value}</div>
      <button onClick={counter.increase}>
        plus
      </button>
      <button onClick={counter.decrease}>
        minus
      </button>      
      <button onClick={counter.zero}>
        zero
      </button>
    </div>
  )
}
```

En faisant cela, nous pouvons extraire entièrement l'état du composant _App_ et sa manipulation dans le hook _useCounter_. La gestion de l'état et de la logique du compteur est maintenant la responsabilité du hook personnalisé.

Le même hook pourrait être <i>réutilisé</i> dans l'application qui gardait la trace du nombre de clics effectués sur les boutons gauche et droit:

```js

const App = () => {
  const left = useCounter()
  const right = useCounter()

  return (
    <div>
      {left.value}
      <button onClick={left.increase}>
        left
      </button>
      <button onClick={right.increase}>
        right
      </button>
      {right.value}
    </div>
  )
}
```

L'application crée <i>deux</i> compteurs complètement séparés. Le premier est affecté à la variable _left_ et l'autre à la variable _right_.

Gérer les formulaires dans React est quelque peu délicat. L'application suivante présente à l'utilisateur un formulaire lui demandant de saisir son nom, sa date de naissance et sa taille:

```js
const App = () => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  const [height, setHeight] = useState('')

  return (
    <div>
      <form>
        name: 
        <input
          type='text'
          value={name}
          onChange={(event) => setName(event.target.value)} 
        /> 
        <br/> 
        birthdate:
        <input
          type='date'
          value={born}
          onChange={(event) => setBorn(event.target.value)}
        />
        <br /> 
        height:
        <input
          type='number'
          value={height}
          onChange={(event) => setHeight(event.target.value)}
        />
      </form>
      <div>
        {name} {born} {height} 
      </div>
    </div>
  )
}
```

Chaque champ du formulaire a son propre état. Pour maintenir l'état du formulaire synchronisé avec les données fournies par l'utilisateur, nous devons enregistrer un gestionnaire <i>onChange</i> approprié pour chacun des éléments <i>input</i>.

Définissons notre propre hook personnalisé _useField_ qui simplifie la gestion de l'état du formulaire:

```js
const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}
```

La fonction du hook reçoit le type du champ de saisie en paramètre. La fonction retourne tous les attributs requis par l'élément <i>input</i>: son type, sa valeur et le gestionnaire onChange.

Le hook peut être utilisé de la manière suivante:

```js
const App = () => {
  const name = useField('text')
  // ...

  return (
    <div>
      <form>
        <input
          type={name.type}
          value={name.value}
          onChange={name.onChange} 
        /> 
        // ...
      </form>
    </div>
  )
}
```

### Propagation d'attributs

Nous pourrions simplifier les choses encore un peu plus. Puisque l'objet _name_ possède exactement tous les attributs que l'élément <i>input</i> s'attend à recevoir comme props, nous pouvons passer les props à l'élément en utilisant la [syntaxe de propagation](https://react.dev/learn/updating-objects-in-state#copying-objects-with-the-spread-syntax) de la manière suivante:

```js
<input {...name} /> 
```

Comme [l'exemple](https://react.dev/learn/updating-objects-in-state#copying-objects-with-the-spread-syntax) dans la documentation React l'indique, les deux manières suivantes de passer des props à un composant aboutissent exactement au même résultat:

```js
<Greeting firstName='Arto' lastName='Hellas' />

const person = {
  firstName: 'Arto',
  lastName: 'Hellas'
}

<Greeting {...person} />
```

L'application est simplifiée dans le format suivant:

```js
const App = () => {
  const name = useField('text')
  const born = useField('date')
  const height = useField('number')

  return (
    <div>
      <form>
        name: 
        <input  {...name} /> 
        <br/> 
        birthdate:
        <input {...born} />
        <br /> 
        height:
        <input {...height} />
      </form>
      <div>
        {name.value} {born.value} {height.value}
      </div>
    </div>
  )
}
```

Gérer les formulaires est grandement simplifié lorsque les détails désagréables liés à la synchronisation de l'état du formulaire sont encapsulés à l'intérieur de notre hook personnalisé.

Les hooks personnalisés ne sont pas seulement un outil de réutilisation ; ils fournissent également une meilleure manière de diviser notre code en parties modulaires plus petites.

### Plus sur les hooks

Internet commence à se remplir de plus en plus de matériel utile lié aux hooks. Les sources suivantes valent la peine d'être consultées:

- [Ressources impressionnantes sur les React Hooks](https://github.com/rehooks/awesome-react-hooks)
- [Recettes de React Hook faciles à comprendre par Gabe Ragland](https://usehooks.com/)
- [Pourquoi les React Hooks dépendent-ils de l'ordre des appels?](https://overreacted.io/why-do-hooks-rely-on-call-order/)

</div>

<div class="tasks">

### Exercices 7.4.-7.8.

Nous continuerons avec l'application des [exercices](/en/part7/react_router#exercises-7-1-7-3) du chapitre [react router](/en/part7/react_router).

#### 7.4 : anecdotes et hooks étape 1

Simplifiez le formulaire de création d'anecdote de votre application avec le hook personnalisé _useField_ que nous avons défini plus tôt.

Un endroit naturel pour sauvegarder les hooks personnalisés de votre application est dans le fichier <i>/src/hooks/index.js</i>.

Si vous utilisez [l'exportation nommée](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export#Description) au lieu de l'exportation par défaut:

```js
import { useState } from 'react'

export const useField = (type) => { // highlight-line
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

// modules can have several named exports
export const useAnotherHook = () => { // highlight-line
  // ...
}
```

Alors, [l'importation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) se fait de la manière suivante:

```js
import  { useField } from './hooks'

const App = () => {
  // ...
  const username = useField('text')
  // ...
}
```

#### 7.5 : anecdotes et hooks étape 2

Ajoutez un bouton au formulaire que vous pouvez utiliser pour effacer tous les champs de saisie:

![navigateur anecdotes avec bouton reset](../../images/7/61ea.png)

Étendez la fonctionnalité du hook <i>useField</i> afin qu'il propose une nouvelle opération <i>reset</i> pour effacer le champ.

Selon votre solution, vous pouvez voir l'avertissement suivant dans votre console:

![avertissement de la console devtools valeur invalide pour la prop reset](../../images/7/62ea.png)

Nous reviendrons sur cet avertissement dans le prochain exercice.

#### 7.6 : anecdotes et hooks étape 3

Si votre solution n'a pas causé d'avertissement dans la console, vous avez déjà terminé cet exercice.

Si vous voyez l'avertissement dans la console, faites les changements nécessaires pour vous débarrasser de l'avertissement de la console Valeur _invalide pour la prop \`reset\` sur la balise_ \<input\>.

La raison de cet avertissement est qu'après avoir apporté des modifications à votre application, l'expression suivante:

```js
<input {...content}/>
```

Essentiellement, revient au même que ceci:

```js
<input
  value={content.value} 
  type={content.type}
  onChange={content.onChange}
  reset={content.reset} // highlight-line
/>
```

L'élément <i>input</i> ne devrait pas recevoir d'attribut <i>reset</i>.

Une solution simple serait de ne pas utiliser la syntaxe de propagation et d'écrire tous les formulaires comme ceci:

```js
<input
  value={username.value} 
  type={username.type}
  onChange={username.onChange}
/>
```

Si nous faisions cela, nous perdrions une grande partie de l'avantage fourni par le hook <i>useField</i>. Au lieu de cela, trouvez une solution qui résout le problème, mais qui reste facile à utiliser avec la syntaxe de propagation.

#### 7.7 : hook de pays

Revenons aux exercices [2.19-2.20](/fr/part2/styliser_vos_applications_react#exercices-2-19-2-20).

Utilisez le code de <https://github.com/fullstack-hy2020/country-hook> comme point de départ.

L'application peut être utilisée pour rechercher les détails d'un pays à partir du service sur <https://studies.cs.helsinki.fi/restcountries/>. Si un pays est trouvé, les détails du pays sont affichés:

![navigateur affichant les détails d'un pays](../../images/7/69ea.png)

Si aucun pays n'est trouvé, un message est affiché à l'utilisateur:

![navigateur montrant pays non trouvé](../../images/7/70ea.png)

L'application est autrement complète, mais dans cet exercice, vous devez implémenter un hook personnalisé _useCountry_, qui peut être utilisé pour rechercher les détails du pays donné au hook en paramètre.

Utilisez le point de terminaison API [name](https://studies.cs.helsinki.fi/restcountries/) pour récupérer les détails d'un pays dans un hook _useEffect_ au sein de votre hook personnalisé.

Notez que dans cet exercice, il est essentiel d'utiliser le [deuxième paramètre](https://react.dev/reference/react/useEffect#parameters) du tableau useEffect pour contrôler quand la fonction d'effet est exécutée. Voir la [partie 2](/en/part2/adding_styles_to_react_app#couple-of-important-remarks) du cours pour plus d'informations sur la manière dont le deuxième paramètre pourrait être utilisé.

#### 7.8 : les hooks ultimes

Le code de l'application responsable de la communication avec le backend de l'application de note des parties précédentes ressemble à ceci:

```js
import axios from 'axios'
const baseUrl = '/api/notes'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (id, newObject) => {
  const response = await axios.put(`${ baseUrl }/${id}`, newObject)
  return response.data
}

export default { getAll, create, update, setToken }
```

Nous remarquons que le code n'est en aucun cas spécifique au fait que notre application traite des notes. À l'exclusion de la valeur de la variable _baseUrl_, le même code pourrait être réutilisé dans l'application de publication de blog pour gérer la communication avec le backend.

Extrayez le code pour communiquer avec le backend dans son propre hook _useResource_. Il suffit d'implémenter la récupération de toutes les ressources et la création d'une nouvelle ressource.

Vous pouvez faire l'exercice pour le projet trouvé dans le dépôt <https://github.com/fullstack-hy2020/ultimate-hooks>. Le composant <i>App</i> pour le projet est le suivant:

```js
const App = () => {
  const content = useField('text')
  const name = useField('text')
  const number = useField('text')

  const [notes, noteService] = useResource('http://localhost:3005/notes')
  const [persons, personService] = useResource('http://localhost:3005/persons')

  const handleNoteSubmit = (event) => {
    event.preventDefault()
    noteService.create({ content: content.value })
  }
 
  const handlePersonSubmit = (event) => {
    event.preventDefault()
    personService.create({ name: name.value, number: number.value})
  }

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...content} />
        <button>create</button>
      </form>
      {notes.map(n => <p key={n.id}>{n.content}</p>)}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...name} /> <br/>
        number <input {...number} />
        <button>create</button>
      </form>
      {persons.map(n => <p key={n.id}>{n.name} {n.number}</p>)}
    </div>
  )
}
```

Le hook personnalisé _useResource_ retourne un tableau de deux éléments, tout comme les hooks d'état. Le premier élément du tableau contient toutes les ressources individuelles et le deuxième élément du tableau est un objet qui peut être utilisé pour manipuler la collection de ressources, comme en créer de nouvelles.

Si vous implémentez correctement le hook, il peut être utilisé à la fois pour les notes et les numéros de téléphone (démarrez le serveur avec la commande _npm run server_ au port 3005).

![navigateur montrant les notes et les personnes](../../images/5/21e.png)

</div>