---
mainImage: ../../../images/part-1.svg
part: 1
letter: d
lang: fr
---

<div class="content">

### Une note sur la version React

La version 18 de React est sortie fin mars 2022. Le code du matériel devrait fonctionner tel qu'il est avec la nouvelle version de React. Cependant, certaines bibliothèques peuvent ne pas encore être compatibles avec React 18. Au moment de la rédaction (4 avril), le client Apollo utilisé dans la [partie 8](/en/part8) ne fonctionne pas encore avec la version la plus récente de React.

Si vous vous retrouvez dans une situation où votre application tombe en panne en raison de problèmes de compatibilité de bibliothèque, <i>rétrogradez</i> vers l'ancien React en modifiant le fichier <i>package.json</i> comme suit :

```js
{
  "dependencies": {
    "react": "^17.0.2", // highlight-line
    "react-dom": "^17.0.2", // highlight-line
    "react-scripts": "5.0.0",
    "web-vitals": "^2.1.4"
  },
  // ...
}
```

Une fois la modification effectuée, réinstallez les dépendances en exécutant

```js
npm install
```

Notez que le fichier <i>index.js</i> doit également être légèrement modifié. Pour React 17, cela ressemble à

```js
import ReactDOM from 'react-dom'
import App from './App'

ReactDOM.render(<App />, document.getElementById('root'))
```

mais pour React 18, la forme correcte est

```js
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

### État complexe

Dans notre exemple précédent, l'état de l'application était simple car il était composé d'un seul entier. Et si notre application nécessite un état plus complexe ?

Dans la plupart des cas, le moyen le plus simple et plus adéquat d'y parvenir est d'utiliser la fonction _useState_ plusieurs fois pour créer des "morceaux" d'état séparés.

Dans le code suivant, nous créons deux éléments d'état nommés _left_ et _right_ qui obtiennent tous deux la valeur initiale de 0 :

```js
const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)

  return (
    <div>
      {left}
      <button onClick={() => setLeft(left + 1)}>
        left
      </button>
      <button onClick={() => setRight(right + 1)}>
        right
      </button>
      {right}
    </div>
  )
}
```

Le composant a accès aux fonctions _setLeft_ et _setRight_ qu'il peut utiliser pour mettre à jour les deux états.

L'état du composant ou une partie de son état peut être de n'importe quel type. Nous pourrions implémenter la même fonctionnalité en enregistrant le nombre de clics des boutons <i>gauche</i> et <i>droit</i> dans un seul objet :

```js
{
  left: 0,
  right: 0
}
```

Dans ce cas, l'application ressemblerait à ceci :

```js
const App = () => {
  const [clicks, setClicks] = useState({
    left: 0, right: 0
  })

  const handleLeftClick = () => {
    const newClicks = { 
      left: clicks.left + 1, 
      right: clicks.right 
    }
    setClicks(newClicks)
  }

  const handleRightClick = () => {
    const newClicks = { 
      left: clicks.left, 
      right: clicks.right + 1 
    }
    setClicks(newClicks)
  }

  return (
    <div>
      {clicks.left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {clicks.right}
    </div>
  )
}
```

Désormais, le composant n'a qu'un seul état et les gestionnaires d'événements doivent s'occuper de modifier <i>l'état de l'ensemble de l'application</i>.

Le gestionnaire d'événements semble un peu brouillon. Lorsque le bouton gauche est cliqué, la fonction suivante est appelée :

```js
const handleLeftClick = () => {
  const newClicks = { 
    left: clicks.left + 1, 
    right: clicks.right 
  }
  setClicks(newClicks)
}
```

L'objet suivant est défini comme nouvel état de l'application :

```js
{
  left: clicks.left + 1,
  right: clicks.right
}
```

La nouvelle valeur de la propriété <i>left</i> est maintenant la même que la valeur de <i>left + 1</i> de l'état précédent, et la valeur de la propriété <i>right</i> est la même que la valeur de la propriété <i>right</i> de l'état précédent.

Nous pouvons définir le nouvel état de l'objet un peu plus précisément en utilisant la syntaxe de propagation de l'objet [object spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax),
syntaxe qui a été ajoutée à la spécification du langage à l'été 2018 :

```js
const handleLeftClick = () => {
  const newClicks = { 
    ...clicks, 
    left: clicks.left + 1 
  }
  setClicks(newClicks)
}

const handleRightClick = () => {
  const newClicks = { 
    ...clicks, 
    right: clicks.right + 1 
  }
  setClicks(newClicks)
}
```

La syntaxe peut sembler un peu étrange au premier abord. En pratique, <em>{ ...clicks }</em> crée un nouvel objet qui a des copies de toutes les propriétés de l'objet _clicks_. Lorsque nous spécifions une propriété particulière - par ex. <i>right</i> in <em>{ ...clicks, right: 1 }</em>, la valeur de la propriété _right_ dans le nouvel objet sera 1.

Dans l'exemple ci-dessus, ceci :

```js
{ ...clicks, right: clicks.right + 1 }
```

crée une copie de l'objet _clicks_ où la valeur de la propriété _right_ est augmentée de un.

L'affectation de l'objet à une variable dans les gestionnaires d'événements n'est pas nécessaire et nous pouvons simplifier les fonctions sous la forme suivante :

```js
const handleLeftClick = () =>
  setClicks({ ...clicks, left: clicks.left + 1 })

const handleRightClick = () =>
  setClicks({ ...clicks, right: clicks.right + 1 })
```

Certains lecteurs pourraient se demander pourquoi nous n'avons pas simplement mis à jour l'état directement, comme ceci :

```js
const handleLeftClick = () => {
  clicks.left++
  setClicks(clicks)
}
```

L'application semble fonctionner. Cependant, <i>il est interdit dans React de muter directement l'état</i>, car [cela peut entraîner des effets secondaires inattendus](https://stackoverflow.com/a/40309023). Le changement d'état doit toujours être effectué en définissant l'état sur un nouvel objet. Si les propriétés de l'objet d'état précédent ne sont pas modifiées, elles doivent simplement être copiées, ce qui se fait en copiant ces propriétés dans un nouvel objet et en le définissant comme nouvel état.

Stocker tout l'état dans un seul objet d'état est un mauvais choix pour cette application particulière ; il n'y a aucun avantage apparent et l'application qui en résulte est beaucoup plus complexe. Dans ce cas, stocker les compteurs de clics dans des éléments d'état séparés est un choix bien plus approprié.

Il existe des situations où il peut être avantageux de stocker une partie de l'état de l'application dans une structure de données plus complexe. [La documentation officielle de React](https://reactjs.org/docs/hooks-faq.html#should-i-use-one-or-many-state-variables) contient des conseils utiles sur le sujet.

### Gestion des tableaux

Ajoutons un élément d'état à notre application contenant un tableau _allClicks_ qui se souvient de chaque clic qui s'est produit dans l'application.

```js
const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [allClicks, setAll] = useState([]) // highlight-line

// highlight-start
  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    setLeft(left + 1)
  }
// highlight-end  

// highlight-start
  const handleRightClick = () => {
    setAll(allClicks.concat('R'))
    setRight(right + 1)
  }
// highlight-end  

  return (
    <div>
      {left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {right}
      <p>{allClicks.join(' ')}</p> // highlight-line
    </div>
  )
}
```

Chaque clic est stocké dans un élément d'état séparé appelé _allClicks_ qui est initialisé sous la forme d'un tableau vide :

```js
const [allClicks, setAll] = useState([])
```

Lorsque le bouton <i>gauche</i> est cliqué, nous ajoutons la lettre <i>L</i> au tableau _allClicks_ :

```js
const handleLeftClick = () => {
  setAll(allClicks.concat('L'))
  setLeft(left + 1)
}
```

L'élément d'état stocké dans _allClicks_ est désormais défini comme un tableau contenant tous les éléments du tableau d'état précédent plus la lettre <i>L</i>. L'ajout du nouvel élément au tableau est accompli avec la méthode [concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat), qui ne mute pas le tableau existant mais renvoie plutôt une <i>nouvelle copie du tableau</i> avec l'élément ajouté.

Comme mentionné précédemment, il est également possible en JavaScript d'ajouter des éléments à un tableau avec la méthode [push](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push) . Si nous ajoutons l'élément en le poussant vers le tableau _allClicks_ puis en mettant à jour l'état, l'application semblerait toujours fonctionner :

```js
const handleLeftClick = () => {
  allClicks.push('L')
  setAll(allClicks)
  setLeft(left + 1)
}
```

Cependant, __ ne faites pas cela. Comme mentionné précédemment, l'état des composants React comme _allClicks_ ne doit pas être muté directement. Même si l'état de mutation semble fonctionner dans certains cas, cela peut entraîner des problèmes très difficiles à déboguer.

Regardons de plus près comment le clic
est rendu sur la page :

```js
const App = () => {
  // ...

  return (
    <div>
      {left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {right}
      <p>{allClicks.join(' ')}</p> // highlight-line
    </div>
  )
}
```

Nous appelons la méthode [join](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join) sur le tableau _allClicks_ qui joint tous les éléments en une seule chaîne, séparés par la chaîne passée en paramètre de la fonction, qui dans notre cas est un espace vide.

### Rendu conditionnel

Modifions notre application pour que le rendu de l'historique des clics soit géré par un nouveau composant <i>History</i> :

```js
// highlight-start
const History = (props) => {
  if (props.allClicks.length === 0) {
    return (
      <div>
        the app is used by pressing the buttons
      </div>
    )
  }

  return (
    <div>
      button press history: {props.allClicks.join(' ')}
    </div>
  )
}
// highlight-end

const App = () => {
  // ...

  return (
    <div>
      {left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {right}
      <History allClicks={allClicks} /> // highlight-line
    </div>
  )
}
```

Maintenant, le comportement du composant dépend du fait que des boutons aient été cliqués ou non. Si ce n'est pas le cas, ce qui signifie que le tableau <em>allClicks</em> est vide, le composant restitue un élément div avec quelques instructions à la place :

```js
<div>the app is used by pressing the buttons</div>
```

Et dans tous les autres cas, le composant restitue l'historique des clics :

```js
<div>
  button press history: {props.allClicks.join(' ')}
</div>
```

Le composant <i>History</i> rend des éléments React complètement différents en fonction de l'état de l'application. C'est ce qu'on appelle le <i>rendu conditionnel</i>.

React propose également de nombreuses autres façons de faire [le rendu conditionnel](https://reactjs.org/docs/conditional-rendering.html). Nous y reviendrons plus en détail dans la [partie 2](/fr/part2).

Apportons une dernière modification à notre application en la refactorisant pour utiliser le composant _Button_ que nous avons défini précédemment :

```js
const History = (props) => {
  if (props.allClicks.length === 0) {
    return (
      <div>
        the app is used by pressing the buttons
      </div>
    )
  }

  return (
    <div>
      button press history: {props.allClicks.join(' ')}
    </div>
  )
}

// highlight-start
const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)
// highlight-end

const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [allClicks, setAll] = useState([])

  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    setLeft(left + 1)
  }

  const handleRightClick = () => {
    setAll(allClicks.concat('R'))
    setRight(right + 1)
  }

  return (
    <div>
      {left}
      // highlight-start
      <Button handleClick={handleLeftClick} text='left' />
      <Button handleClick={handleRightClick} text='right' />
      // highlight-end
      {right}
      <History allClicks={allClicks} />
    </div>
  )
}
```

### Ancienne version de React

Dans ce cours, nous utilisons le [state hook](https://reactjs.org/docs/hooks-state.html) pour ajouter un état à nos composants React, qui fait partie des nouvelles versions de React et est disponible à partir de la version [ 16.8.0](https://www.npmjs.com/package/react/v/16.8.0) et versions ultérieures. Avant l'ajout des hooks, il n'y avait aucun moyen d'ajouter un état aux composants fonctionnels. Les composants qui nécessitaient un état devaient être définis en tant que composants [classes](https://reactjs.org/docs/react-component.html), à l'aide de la syntaxe de classe JavaScript.

Dans ce cours, nous avons pris la décision radicale d'utiliser exclusivement les hooks dès le premier jour, pour nous assurer que nous apprenons le style actuel et futur de React. Même si les composants fonctionnels sont l'avenir de React, il est toujours important d'apprendre la syntaxe de la classe, car il existe des milliards de lignes de code React que vous pourriez finir par maintenir un jour. Il en va de même pour la documentation et les exemples de React que vous pouvez trouver sur Internet.

Nous en apprendrons plus sur les composants classes de React plus tard dans le cours.

### Débogage des applications React

Une grande partie du temps d'un développeur typique est consacrée au débogage et à la lecture du code existant. De temps en temps, nous écrivons une ligne ou deux de nouveau code, mais une grande partie de notre temps est consacrée à essayer de comprendre pourquoi quelque chose est cassé ou comment quelque chose fonctionne. Les bonnes pratiques et les outils de débogage sont extrêmement importants pour cette raison.

Heureusement pour nous, React est une bibliothèque extrêmement conviviale pour les développeurs en matière de débogage.

Avant de poursuivre, rappelons-nous l'une des règles les plus importantes du développement Web.

<h4>La première règle du développement Web</h4>

> **Gardez la console développeur du navigateur ouverte à tout moment.**
>
> L'onglet <i>Console</i> en particulier doit toujours être ouvert, sauf s'il existe une raison spécifique d'afficher un autre onglet.

Gardez votre code et la page Web ouverts ensemble **en même temps, tout le temps**.

Si et quand votre code ne compile pas et que votre navigateur s'allume comme un sapin de Noël :

![](../../images/1/6x.png)

n'écrivez pas plus de code mais plutôt trouvez et corrigez le problème **immédiatement**. Il n'y a pas encore eu de moment dans l'histoire du codage où le code qui ne compile pas commencerait miraculeusement à fonctionner après avoir écrit de grandes quantités de code supplémentaire. Je doute fortement qu'un tel événement se produise au cours de ce cours non plus.

Le débogage à l'ancienne, basé sur l'impression, est toujours une bonne idée. Si le composant

```js
const Button = ({ onClick, text }) => (
  <button onClick={onClick}>
    {text}
  </button>
)
```

ne fonctionne pas comme prévu, il est utile de commencer à imprimer ses variables sur la console. Pour le faire efficacement, nous devons transformer notre fonction dans la forme la moins compacte et recevoir l'intégralité de l'objet props sans le déstructurer immédiatement :

```js
const Button = (props) => { 
  console.log(props) // highlight-line
  const { onClick, text } = props
  return (
    <button onClick={onClick}>
      {text}
    </button>
  )
}
```

Cela révélera immédiatement si, par exemple, l'un des attributs a été mal orthographié lors de l'utilisation du composant.

**NB** Lorsque vous utilisez _console.log_ pour le débogage, ne combinez pas _objects_ à la manière de Java en utilisant l'opérateur plus. Au lieu d'écrire :

```js
console.log('props value is ' + props)
```

Séparez les éléments que vous souhaitez consigner dans la console par une virgule :

```js
console.log('props value is', props)
```

Si vous utilisez la manière Java de concaténer une chaîne avec un objet, vous vous retrouverez avec un message de journal plutôt peu informatif :

```js
props value is [Object object]
```

Alors que les éléments séparés par une virgule seront tous disponibles dans la console du navigateur pour une inspection plus approfondie.

Se connecter à la console n'est en aucun cas le seul moyen de déboguer nos applications. Vous pouvez suspendre l'exécution de votre code d'application dans le <i>débogueur</i> de la console développeur Chrome, en écrivant la commande [debugger](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/debugger) n'importe où dans votre code.

L'exécution s'arrêtera une fois qu'elle arrivera à un point où la commande _debugger_ sera exécutée :

![](../../images/1/7a.png)

En allant dans l'onglet <i>Console</i>, il est facile d'inspecter l'état actuel des variables :

![](../../images/1/8a.png)

Une fois la cause du bogue découverte, vous pouvez supprimer la commande _debugger_ et actualiser la page.

Le débogueur nous permet également d'exécuter notre code ligne par ligne avec les contrôles situés à droite de l'onglet <i>Sources</i>.

Vous pouvez également accéder au débogueur sans la commande _debugger_ en ajoutant des points d'arrêt dans l'onglet <i>Sources</i>. L'inspection des valeurs des variables du composant peut être effectuée dans la section _Scope_ :

![](../../images/1/9a.png)

Il est fortement recommandé d'ajouter l'extension [React developer tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) à Chrome. Il ajoute un nouvel onglet _Components_ aux outils de développement. Le nouvel onglet des outils de développement peut être utilisé pour inspecter les différents éléments React de l'application, ainsi que leur état et leurs props:

![](../../images/1/10ea.png)


L'état du composant _App_ est défini comme suit :

```js
const [left, setLeft] = useState(0)
const [right, setRight] = useState(0)
const [allClicks, setAll] = useState([])
```

Dev tools affichent l'état des hooks dans l'ordre de leur définition :

![](../../images/1/11ea.png)

Le premier <i>State</i> contient la valeur de l'état <i>left</i>, le suivant contient la valeur de l'état <i>right</i> et le dernier contient la valeur de l'état <i>état de tous les clics</i>.

### Règles des Hooks

Il y a quelques limitations et règles que nous devons suivre pour nous assurer que notre application utilise correctement les fonctions d'état basées sur les hooks.

La fonction _useState_ (ainsi que la fonction _useEffect_ introduite plus tard dans le cours) <i>ne doit pas être appelée</i> depuis l'intérieur d'une boucle, d'une expression conditionnelle ou de tout endroit qui n'est pas une fonction définissant un composant. Cela doit être fait pour s'assurer que les hooks sont toujours appelés dans le même ordre, et si ce n'est pas le cas, l'application se comportera de manière erratique.

Pour récapituler, les hooks ne peuvent être appelés que depuis l'intérieur d'un corps de fonction qui définit un composant React :

```js
const App = () => {
  // ceci est ok
  const [age, setAge] = useState(0)
  const [name, setName] = useState('Juha Tauriainen')

  if ( age > 10 ) {
    // ceci ne marche pas!
    const [foobar, setFoobar] = useState(null)
  }

  for ( let i = 0; i < age; i++ ) {
    // toujours pas ok !
    const [rightWay, setRightWay] = useState(false)
  }

  const notGood = () => {
    // et ceci est presqu'un péché !
    const [x, setX] = useState(-1000)
  }

  return (
    //...
  )
}
```

### Gestion des événements revisitée

La gestion des événements s'est avérée être un sujet difficile dans les versions précédentes de ce cours.

C'est pourquoi nous reviendrons sur le sujet.

Supposons que nous développions cette application simple avec le composant suivant <i>App</i> :

```js
const App = () => {
  const [value, setValue] = useState(10)

  return (
    <div>
      {value}
      <button>reset to zero</button>
    </div>
  )
}
```

Nous voulons que le clic sur le bouton réinitialise l'état stocké dans la variable _value_.

Afin de faire réagir le bouton à un événement de clic, nous devons lui ajouter un <i>event handler</i>.

Les gestionnaires d'événements doivent toujours être une fonction ou une référence à une fonction. Le bouton ne fonctionnera pas si le gestionnaire d'événements est défini sur une variable d'un autre type.

Si nous devions définir notre event handler sous forme de chaîne :

```js
<button onClick="crap...">button</button>
```

React nous en avertirait dans la console :

```js
index.js:2178 Warning: Expected `onClick` listener to be a function, instead got a value of `string` type.
    in button (at index.js:20)
    in div (at index.js:18)
    in App (at index.js:27)
```

La tentative suivante ne fonctionnerait pas non plus :

```js
<button onClick={value + 1}>button</button>
```

Nous avons tenté de définir le gestionnaire d'événements sur _value + 1_ qui renvoie simplement le résultat de l'opération. React nous en avertira gentiment dans la console :

```js
index.js:2178 Warning: Expected `onClick` listener to be a function, instead got a value of `number` type.
```

Cette tentative ne fonctionnerait pas non plus :

```js
<button onClick={value = 0}>button</button>
```

Le gestionnaire d'événements n'est pas une fonction mais une affectation de variable, et React émettra à nouveau un avertissement sur la console. Cette tentative est également imparfaite dans le sens où nous ne devons jamais muter l'état directement dans React.

Qu'en est-il des éléments suivants :

```js
<button onClick={console.log('clicked the button')}>
  button
</button>
```

Le message est affiché sur la console une fois lorsque le composant est rendu, mais rien ne se passe lorsque nous cliquons sur le bouton. Pourquoi cela ne fonctionne-t-il pas même lorsque notre gestionnaire d'événements contient une fonction _console.log_ ?

Le problème ici est que notre gestionnaire d'événements est défini comme un <i>appel de fonction</i>, ce qui signifie que le gestionnaire d'événements se voit en fait attribuer la valeur renvoyée par la fonction, qui dans le cas de _console.log_ est <i>undefined </i>.

L'appel de la fonction _console.log_ est exécuté lorsque le composant est rendu et pour cette raison, il est imprimé une fois sur la console.

La tentative suivante est également erronée :

```js
<button onClick={setValue(0)}>button</button>
```

Nous avons de nouveau essayé de définir un appel de fonction comme gestionnaire d'événements. Cela ne fonctionne pas. Cette tentative particulière provoque également un autre problème. Lorsque le composant est rendu, la fonction _setValue(0)_ est exécutée, ce qui entraîne à son tour le rendu du composant. Le re-rendu appelle à son tour _setValue(0)_, ce qui entraîne une récursivité infinie.

L'exécution d'un appel de fonction particulier lorsque le bouton est cliqué peut être accompli comme ceci :

```js
<button onClick={() => console.log('clicked the button')}>
  button
</button>
```

Maintenant, le gestionnaire d'événements est une fonction définie avec la syntaxe de la fonction fléchée _() => console.log('clicked the button')_. Lorsque le composant est rendu, aucune fonction n'est appelée et seule la référence à la fonction fléchée est définie sur le gestionnaire d'événements. L'appel de la fonction n'a lieu qu'une fois le bouton cliqué.

Nous pouvons implémenter la réinitialisation de l'état dans notre application avec cette même technique :

```js
<button onClick={() => setValue(0)}>button</button>
```

Le gestionnaire d'événements est maintenant la fonction _() => setValue(0)_.

Définir les gestionnaires d'événements directement dans l'attribut du bouton n'est pas nécessairement la meilleure idée possible.

Vous verrez souvent des gestionnaires d'événements définis dans un endroit séparé. Dans la version suivante de notre application, nous définissons une fonction qui est ensuite affectée à la variable _handleClick_ dans le corps de la fonction composant :

```js
const App = () => {
  const [value, setValue] = useState(10)

  const handleClick = () =>
    console.log('clicked the button')

  return (
    <div>
      {value}
      <button onClick={handleClick}>button</button>
    </div>
  )
}
```

La variable _handleClick_ est maintenant affectée à une référence à la fonction. La référence est transmise au bouton en tant qu'attribut <i>onClick</i> :

```js
<button onClick={handleClick}>button</button>
```

Naturellement, notre fonction de gestion d'événements peut être composée de plusieurs commandes. Dans ces cas, nous utilisons la syntaxe des accolades plus longues pour les fonctions fléchées :

```js
const App = () => {
  const [value, setValue] = useState(10)

  // highlight-start
  const handleClick = () => {
    console.log('clicked the button')
    setValue(0)
  }
   // highlight-end

  return (
    <div>
      {value}
      <button onClick={handleClick}>button</button>
    </div>
  )
}
```

### Fonction qui renvoie une fonction

Une autre façon de définir un gestionnaire d'événements consiste à utiliser <i>fonction qui renvoie une fonction</i>.

Vous n'aurez probablement pas besoin d'utiliser des fonctions qui renvoient des fonctions dans aucun des exercices de ce cours. Si le sujet semble particulièrement déroutant, vous pouvez ignorer cette section pour le moment et y revenir plus tard.

Apportons les modifications suivantes à notre code :

```js
const App = () => {
  const [value, setValue] = useState(10)

  // highlight-start
  const hello = () => {
    const handler = () => console.log('hello world')

    return handler
  }
  // highlight-end

  return (
    <div>
      {value}
      <button onClick={hello()}>button</button>
    </div>
  )
}
```

Le code fonctionne correctement même s'il semble compliqué.

Le gestionnaire d'événements est maintenant défini sur un appel de fonction :

```js
<button onClick={hello()}>button</button>
```

Plus tôt, nous avons déclaré qu'un gestionnaire d'événements ne peut pas être un appel à une fonction, et qu'il doit être une fonction ou une référence à une fonction. Pourquoi alors un appel de fonction fonctionne-t-il dans ce cas ?

Lorsque le composant est rendu, la fonction suivante est exécutée :

```js
const hello = () => {
  const handler = () => console.log('hello world')

  return handler
}
```

La <i>valeur de retour</i> de la fonction est une autre fonction affectée à la variable _handler_.

Lorsque React affiche la ligne :

```js
<button onClick={hello()}>button</button>
```

Il attribue la valeur de retour de _hello()_ à l'attribut onClick. Essentiellement, la ligne se transforme en :

```js
<button onClick={() => console.log('hello world')}>
  button
</button>
```

Puisque la fonction _hello_ renvoie une fonction, le gestionnaire d'événements est maintenant une fonction.

Quel est l'intérêt de ce concept ?

Modifions un tout petit peu le code :

```js
const App = () => {
  const [value, setValue] = useState(10)

  // highlight-start
  const hello = (who) => {
    const handler = () => {
      console.log('hello', who)
    }

    return handler
  }
  // highlight-end  

  return (
    <div>
      {value}
  // highlight-start      
      <button onClick={hello('world')}>button</button>
      <button onClick={hello('react')}>button</button>
      <button onClick={hello('function')}>button</button>
  // highlight-end      
    </div>
  )
}
```

Maintenant, l'application a trois boutons avec des gestionnaires d'événements définis par la fonction _hello_ qui accepte un paramètre.

Le premier bouton est défini comme

```js
<button onClick={hello('world')}>button</button>
```

Le gestionnaire d'événements est créé en <i>exécutant</i> l'appel de fonction _hello('world')_. L'appel de fonction renvoie la fonction :

```js
() => {
  console.log('hello', 'world')
}
```

Le deuxième bouton est défini comme :

```js
<button onClick={hello('react')}>button</button>
```

L'appel de fonction _hello('react')_ qui crée le event handler renvoie :

```js
() => {
  console.log('hello', 'react')
}
```

Les deux boutons disposent de leurs propres gestionnaires d'événements individualisés.

Les fonctions renvoyant des fonctions peuvent être utilisées pour définir des fonctionnalités génériques qui peuvent être personnalisées avec des paramètres. La fonction _hello_ qui crée les gestionnaires d'événements peut être considérée comme une usine qui produit des event handlers personnalisés destinés à accueillir les utilisateurs.

Notre définition actuelle est légèrement verbeuse :

```js
const hello = (who) => {
  const handler = () => {
    console.log('hello', who)
  }

  return handler
}
```

Éliminons les variables d'assistance et renvoyons directement la fonction créée :

```js
const hello = (who) => {
  return () => {
    console.log('hello', who)
  }
}
```

Puisque notre fonction _hello_ est composée d'une seule commande de retour, nous pouvons omettre les accolades et utiliser la syntaxe plus compacte pour les fonctions fléchées :

```js
const hello = (who) =>
  () => {
    console.log('hello', who)
  }
```

Enfin, écrivons toutes les flèches sur la même ligne :

```js
const hello = (who) => () => {
  console.log('hello', who)
}
```

Nous pouvons utiliser la même astuce pour définir des gestionnaires d'événements qui définissent l'état du composant à une valeur donnée. Apportons les modifications suivantes à notre code :

```js
const App = () => {
  const [value, setValue] = useState(10)
  
  // highlight-start
  const setToValue = (newValue) => () => {
    console.log('value now', newValue)  // affiche la nouvelle valeur sur la console
    setValue(newValue)
  }
  // highlight-end
  
  return (
    <div>
      {value}
      // highlight-start
      <button onClick={setToValue(1000)}>thousand</button>
      <button onClick={setToValue(0)}>reset</button>
      <button onClick={setToValue(value + 1)}>increment</button>
      // highlight-end
    </div>
  )
}
```

Lorsque le composant est rendu, le bouton <i>thousand</i> est créé :

```js
<button onClick={setToValue(1000)}>thousand</button>
```

Le gestionnaire d'événements est défini sur la valeur de retour de _setToValue(1000)_ qui est la fonction suivante :

```js
() => {
  console.log('value now', 1000)
  setValue(1000)
}
```

Le bouton d'incrémentation est déclaré comme suit :

```js
<button onClick={setToValue(value + 1)}>increment</button>
```

Le gestionnaire d'événements est créé par l'appel de fonction _setToValue(value + 1)_ qui reçoit en paramètre la valeur courante de la variable d'état _value_ augmentée de un. Si la valeur de _value_ était 10, alors le gestionnaire d'événements créé serait la fonction :

```js
() => {
  console.log('value now', 11)
  setValue(11)
}
```

L'utilisation de fonctions qui renvoient des fonctions n'est pas nécessaire pour obtenir cette fonctionnalité. Renvoyons la fonction _setToValue_ qui est responsable de la mise à jour de l'état, dans une fonction normale :

```js
const App = () => {
  const [value, setValue] = useState(10)

  const setToValue = (newValue) => {
    console.log('value now', newValue)
    setValue(newValue)
  }

  return (
    <div>
      {value}
      <button onClick={() => setToValue(1000)}>
        thousand
      </button>
      <button onClick={() => setToValue(0)}>
        reset
      </button>
      <button onClick={() => setToValue(value + 1)}>
        increment
      </button>
    </div>
  )
}
```

Nous pouvons maintenant définir le gestionnaire d'événements comme une fonction qui appelle la fonction _setToValue_ avec un paramètre approprié. Le gestionnaire d'événements pour réinitialiser l'état de l'application serait :

```js
<button onClick={() => setToValue(0)}>reset</button>
```

Choisir entre les deux façons présentées pour définir vos gestionnaires d'événements est surtout une question de goût.

### Passer vos events handlers aux composants enfants

Extrayons le bouton dans son propre composant :

```js
const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)
```

Le composant obtient la fonction de gestionnaire d'événements de la prop _handleClick_ et le texte du bouton de la prop _text_.

L'utilisation du composant <i>Button</i> est simple, même si nous devons nous assurer que nous utilisons les noms d'attribut corrects lors de la transmission des props au composant.

![](../../images/1/12e.png)

### Ne pas définir de composants dans les composants

Commençons à afficher la valeur de l'application dans son propre composant <i>Display</i>.

Nous allons changer l'application en définissant un nouveau composant à l'intérieur du composant <i>App</i>.

```js
// C'est le bon endroit pour définir un composant
const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const App = () => {
  const [value, setValue] = useState(10)

  const setToValue = newValue => {
    console.log('value now', newValue)
    setValue(newValue)
  }

  // Ne pas définir de composants à l'intérieur d'un autre composant
  const Display = props => <div>{props.value}</div> // highlight-line

  return (
    <div>
      <Display value={value} />
      <Button handleClick={() => setToValue(1000)} text="thousand" />
      <Button handleClick={() => setToValue(0)} text="reset" />
      <Button handleClick={() => setToValue(value + 1)} text="increment" />
    </div>
  )
}
```

L'application semble toujours fonctionner, mais **n'implémentez pas de composants comme celui-ci !** Ne définissez jamais de composants à l'intérieur d'autres composants. La méthode n'offre aucun avantage et entraîne de nombreux problèmes désagréables. Les plus gros problèmes sont dus au fait que React traite un composant défini à l'intérieur d'un autre composant comme un nouveau composant dans chaque rendu. Cela rend impossible pour React d'optimiser le composant.

Déplaçons plutôt la fonction de composant <i>Display</i> à sa place correcte, qui est en dehors de la fonction de composant <i>App</i> :

```js
const Display = props => <div>{props.value}</div>

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const App = () => {
  const [value, setValue] = useState(10)

  const setToValue = newValue => {
    console.log('value now', newValue)
    setValue(newValue)
  }

  return (
    <div>
      <Display value={value} />
      <Button handleClick={() => setToValue(1000)} text="thousand" />
      <Button handleClick={() => setToValue(0)} text="reset" />
      <Button handleClick={() => setToValue(value + 1)} text="increment" />
    </div>
  )
}
```

### Lecture utile

Internet regorge de contenu lié à React. Cependant, nous utilisons le nouveau style de React pour lequel une grande majorité du matériel trouvé en ligne est obsolète.

Les liens suivants peuvent vous être utiles :

- La [documentation officielle de React](https://reactjs.org/docs/hello-world.html) vaut la peine d'être consultée à un moment donné, même si la plupart d'entre elles ne deviendront pertinentes que plus tard dans le cours. De plus, tout ce qui concerne les composants basés sur des classes ne nous concerne pas ;
- Certains cours sur [Egghead.io](https://egghead.io) comme [Start learning React](https://egghead.io/courses/start-learning-react) sont de haute qualité, et récemment mis à jour [ Le guide du débutant pour réagir](https://egghead.io/courses/the-beginner-s-guide-to-reactjs) est également relativement bon ; les deux cours introduisent des concepts qui seront également introduits plus tard dans ce cours. **NB** Le premier utilise des composants classes mais le second utilise les nouveaux composants fonctionnels.

</div>

<div class="tasks">

<h3>Exercices 1.6.-1.14.</h3>

Soumettez vos solutions aux exercices en transmettant d'abord votre code à GitHub, puis en marquant les exercices terminés dans le [système de soumission](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

N'oubliez pas de soumettre **tous** les exercices d'une partie **en une seule soumission**. Une fois que vous avez soumis vos solutions pour une partie, **vous ne pouvez plus soumettre d'autres exercices pour cette partie**.

<i>Certains des exercices fonctionnent sur la même application. Dans ces cas, il suffit de soumettre uniquement la version finale de la demande. Si vous le souhaitez, vous pouvez effectuer un commit après chaque exercice terminé, mais ce n'est pas obligatoire.</i>

**ATTENTION** create-react-app transformera automatiquement votre projet en un référentiel git à moins que vous ne créiez votre application dans un référentiel git existant. **Il est fort probable que vous ne vouliez pas que chacun de vos projets soit un référentiel distinct**, il vous suffit donc d'exécuter la commande _rm -rf .git_ à la racine de votre application.

Dans certaines situations, vous devrez peut-être également exécuter la commande ci-dessous à partir de la racine du projet :

``` 
rm -rf node_modules/ && npm i
```

<h4> 1.6 : unicafé, étape1</h4>

Comme la plupart des entreprises, [Unicafe](https://www.unicafe.fi/#/9/4) recueille les commentaires de ses clients. Votre tâche consiste à mettre en place une application Web pour recueillir les commentaires des clients. Il n'y a que trois options pour les commentaires : <i>bon</i>, <i>neutre</i> et <i>mauvais</i>.

L'application doit afficher le nombre total de commentaires recueillis pour chaque catégorie. Votre application finale pourrait ressembler à ceci :

![](../../images/1/13e.png)

Notez que votre application ne doit fonctionner que pendant une seule session de navigateur. Une fois que vous avez actualisé la page, les commentaires recueillis sont autorisés à disparaître.

Il est conseillé d'utiliser la même structure que celle utilisée dans le matériel et l'exercice précédent. Le fichier <i>index.js</i> est le suivant :

```js
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

Vous pouvez utiliser le code ci-dessous comme point de départ pour le fichier <i>App.js</i> :

```js
import { useState } from 'react'

const App = () => {
  // enregistrer les clics de chaque bouton dans un état différent
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      code here
    </div>
  )
}

export default App
```

<h4>1.7 : unicafé, étape2</h4>

Développez votre application pour qu'elle affiche plus de statistiques sur les retours collectés : le nombre total de retours collectés, le score moyen (bon : 1, neutre : 0, mauvais : -1) et le pourcentage de retours positifs.

![](../../images/1/14e.png)

<h4>1.8 : unicafé, étape3</h4>

Refactorisez votre application afin que l'affichage des statistiques soit extrait dans son propre composant <i>Statistiques</i>. L'état de l'application doit rester dans le composant racine <i>App</i>.

N'oubliez pas que les composants ne doivent pas être définis à l'intérieur d'autres composants :

```js
// un endroit approprié pour définir un composant
const Statistics = (props) => {
  // ...
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  // ne pas définir un composant dans un autre composant
  const Statistics = (props) => {
    // ...
  }

  return (
    // ...
  )
}
```

<h4>1.9 : unicafé, étape4</h4>

Modifiez votre application pour n'afficher les statistiques qu'une fois les commentaires recueillis.

![](../../images/1/15e.png)

<h4>1.10 : unicafé, étape5</h4>

Continuons à refactoriser l'application. Extrayez les deux composants suivants :

- <i>Bouton</i> pour définir les boutons utilisés pour soumettre des commentaires
- <i>StatisticLine</i> pour afficher une seule statistique, par ex. la note moyenne.

Pour être clair : le composant <i>StatisticLine</i> affiche toujours une seule statistique, ce qui signifie que l'application utilise plusieurs composants pour afficher toutes les statistiques :

```js
const Statistics = (props) => {
  /// ...
  return(
    <div>
      <StatisticLine text="good" value ={...} />
      <StatisticLine text="neutral" value ={...} />
      <StatisticLine text="bad" value ={...} />
      // ...
    </div>
  )
}

```

L'état de l'application doit toujours être conservé dans le composant racine <i>App</i>.

<h4>1.11* : unicafé, étape6</h4>

Affichez les statistiques dans un [tableau](https://developer.mozilla.org/en-US/docs/Learn/HTML/Tables/Basics) HTML, afin que votre application ressemble à peu près à ceci :

![](../../images/1/16e.png)

N'oubliez pas de garder votre console ouverte en tout temps. Si vous voyez cet avertissement dans votre console :

![](../../images/1/17a.png)

Effectuez ensuite les actions nécessaires pour faire disparaître l'avertissement. Essayez de coller le message d'erreur dans un moteur de recherche si vous êtes bloqué.

<i>Source typique d'une erreur `Unchecked runtime.lastError : Impossible d'établir la connexion. La fin de réception n'existe pas.` est l'extension Chrome. Essayez d'aller sur `chrome://extensions/` et essayez de les désactiver un par un et d'actualiser la page de l'application React ; l'erreur devrait éventuellement disparaître.</i>

**Assurez-vous qu'à partir de maintenant, vous ne voyez plus aucun avertissement dans votre console !**

<h4>1.12* : anecdotes, étape1</h4>

Le monde de l'ingénierie logicielle est rempli d'[anecdotes](http://www.comp.nus.edu.sg/~damithch/pages/SE-quotes.htm) qui distillent des vérités intemporelles de notre domaine en de courtes lignes.

Développez l'application suivante en ajoutant un bouton sur lequel cliquer pour afficher une anecdote <i>aléatoire</i> du domaine du génie logiciel :

```js
import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.'
  ]
   
  const [selected, setSelected] = useState(0)

  return (
    <div>
      {anecdotes[selected]}
    </div>
  )
}

export default App
```

Le contenu du fichier <i>index.js</i> est le même que dans les exercices précédents.

Découvrez comment générer des nombres aléatoires en JavaScript, par exemple. via le moteur de recherche ou sur [Mozilla Developer Network](https://developer.mozilla.org). N'oubliez pas que vous pouvez tester la génération de nombres aléatoires, par ex. directement dans la console de votre navigateur.

Votre application terminée pourrait ressembler à ceci :

![](../../images/1/18a.png)

**ATTENTION** create-react-app transformera automatiquement votre projet en un référentiel git à moins que vous ne créiez votre application dans un référentiel git existant. **Il est fort probable que vous ne vouliez pas que chacun de vos projets soit un référentiel distinct**, il vous suffit donc d'exécuter la commande _rm -rf .git_ à la racine de votre application.

<h4>1.13* : anecdotes, étape2</h4>

Développez votre application afin de pouvoir voter pour l'anecdote affichée.

![](../../images/1/19a.png)

**NB** stocker les votes de chaque anecdote dans un tableau ou un objet dans l'état du composant. N'oubliez pas que la bonne façon de mettre à jour l'état stocké dans des structures de données complexes comme des objets et des tableaux est de faire une copie de l'état.

Vous pouvez créer une copie d'un objet comme ceci :

```js
const points = { 0: 1, 1: 3, 2: 4, 3: 2 }

const copy = { ...points }
// incrémenter la valeur de la propriété 2 de un
copy[2] += 1     
```

OU une copie du tableau comme cela :

```js
const points = [1, 4, 6, 3]

const copy = [...points]
// incrémenter la valeur en position 2 de un
copy[2] += 1     
```

L'utilisation d'un tableau pourrait être le choix le plus simple dans ce cas. Une recherche sur Internet vous fournira de nombreux conseils sur la façon de [créer un tableau rempli de zéros d'une longueur souhaitée](https://stackoverflow.com/questions/20222501/how-to-create-a-zero-filled-javascript-tableau-de-longueur-arbitraire/22209781).

<h4>1.14* : anecdotes, étape3</h4>

Implémentez maintenant la version finale de l'application qui affiche l'anecdote avec le plus grand nombre de votes :

![](../../images/1/20a.png)

Si plusieurs anecdotes sont à égalité pour la première place, il suffit d'en montrer une seule.

C'était le dernier exercice de cette partie du cours et il est temps de pusher votre code vers GitHub et de marquer tous vos exercices terminés dans le [système de soumission](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

</div>
