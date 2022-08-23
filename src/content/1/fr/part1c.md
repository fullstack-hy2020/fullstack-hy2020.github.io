---
mainImage: ../../../images/part-1.svg
part: 1
letter: c
lang: fr
---

<div class="content">

Reprenons avec React.

On commence avec un nouvel exemple :

```js
const Hello = (props) => {
  return (
    <div>
      <p>
        Hello {props.name}, you are {props.age} years old
      </p>
    </div>
  )
}

const App = () => {
  const name = 'Peter'
  const age = 10

  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="Maya" age={26 + 10} />
      <Hello name={name} age={age} />
    </div>
  )
}
```

### Fonctions d'assistance aux composants

Développons notre composant <i>Bonjour</i> afin qu'il devine l'année de naissance de la personne accueillie :

```js
const Hello = (props) => {
  // highlight-start
  const bornYear = () => {
    const yearNow = new Date().getFullYear()
    return yearNow - props.age
  }
  // highlight-end

  return (
    <div>
      <p>
        Hello {props.name}, you are {props.age} years old
      </p>
      <p>So you were probably born in {bornYear()}</p> // highlight-line
    </div>
  )
}
```

La logique pour deviner l'année de naissance est séparée en une fonction qui est appelée lorsque le composant est rendu.

L'âge de la personne n'a pas besoin d'être passé en tant que paramètre de la fonction, car il peut accéder directement à toutes les props passés au composant.

Si nous examinons attentivement notre code actuel, nous remarquerons que la fonction d'assistance (helper) est en fait définie à l'intérieur d'une autre fonction qui définit le comportement de notre composant. En programmation Java, définir une fonction à l'intérieur d'une autre est complexe et fastidieux, donc pas si courant. En JavaScript, cependant, définir des fonctions dans des fonctions est une technique couramment utilisée.

### Déstructuration

Avant d'aller plus loin, nous allons jeter un œil à une petite fonctionnalité mais utile du langage JavaScript qui a été ajoutée dans la spécification ES6, qui nous permet de [déstructurer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) des valeurs des objets et des tableaux lors de l'affectation.

Dans notre code précédent, nous devions référencer les données transmises à notre composant en tant que _props.name_ et _props.age_. De ces deux expressions, nous avons dû répéter _props.age_ deux fois dans notre code.

Puisque <i>props</i> est un objet

```js
props = {
  name: 'Arto Hellas',
  age: 35,
}
```

nous pouvons rationaliser notre composant en affectant les valeurs des propriétés directement dans deux variables _name_ et _age_ que nous pouvons ensuite utiliser dans notre code :

```js
const Hello = (props) => {
  // highlight-start
  const name = props.name
  const age = props.age
  // highlight-end

  const bornYear = () => new Date().getFullYear() - age

  return (
    <div>
      <p>Hello {name}, you are {age} years old</p> // highlight-line
      <p>So you were probably born in {bornYear()}</p>
    </div>
  )
}
```

Notez que nous avons également utilisé la syntaxe plus compacte pour les fonctions fléchées lors de la définition de la fonction _bornYear_. Comme mentionné précédemment, si une fonction fléchée consiste en une seule expression, le corps de la fonction n'a pas besoin d'être écrit à l'intérieur d'accolades. Dans cette forme plus compacte, la fonction renvoie simplement le résultat de l'expression unique.

Pour récapituler, les deux définitions de fonction présentées ci-dessous sont équivalentes :

```js
const bornYear = () => new Date().getFullYear() - age

const bornYear = () => {
  return new Date().getFullYear() - age
}
```

La déstructuration rend l'assignation des variables encore plus facile, puisque nous pouvons l'utiliser pour extraire et regrouper les valeurs des propriétés d'un objet dans des variables distinctes :
```js
const Hello = (props) => {
    // highlight-start
  const { name, age } = props
    // highlight-end
  const bornYear = () => new Date().getFullYear() - age

  return (
    <div>
      <p>Hello {name}, you are {age} years old</p>
      <p>So you were probably born in {bornYear()}</p>
    </div>
  )
}
```

<!-- Eli koska -->
Si l'objet que nous destructurons a les valeurs
```js
props = {
  name: 'Arto Hellas',
  age: 35,
}
```

l'expression <em>const { name, age } = props</em> attribue les valeurs 'Arto Hellas' à _name_ et 35 à _age_.

Nous pouvons aller plus loin dans la déstructuration :
```js
const Hello = ({ name, age }) => { // highlight-line
  const bornYear = () => new Date().getFullYear() - age

  return (
    <div>
      <p>
        Hello {name}, you are {age} years old
      </p>
      <p>So you were probably born in {bornYear()}</p>
    </div>
  )
}
```

Les props passées au composant sont maintenant directement déstructurées dans les variables _name_ et _age_.

Cela signifie qu'au lieu d'affecter l'intégralité de l'objet props dans une variable appelée <i>props</i>, puis d'affecter ses propriétés dans les variables _name_ et _age_

```js
const Hello = (props) => {
  const { name, age } = props
  ...
}
```

nous attribuons les valeurs des propriétés directement aux variables en déstructurant l'objet props qui est passé à la fonction du composant en tant que paramètre :

```js
const Hello = ({ name, age }) => {...}
```

### Re-rendu de la page

Jusqu'à présent, toutes nos applications ont été telles que leur apparence reste la même après le rendu initial. Et si on voulait créer un compteur dont la valeur augmente en fonction du temps ou au clic d'un bouton ?

Commençons par ce qui suit. Le fichier <i>App.js</i> devient :

```js
const App = (props) => {
  const {counter} = props
  return (
    <div>{counter}</div>
  )
}

export default App
```

Et le fichier <in>index.js</it> devient :

```js
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

let counter = 1

ReactDOM.createRoot(document.getElementById('root')).render(
  <App counter={counter} />
)
```

Le composant App reçoit la valeur du compteur via la propriété _counter_. Ce composant restitue la valeur à l'écran. Que se passe-t-il lorsque la valeur de _counter_ change ? Même si nous devions ajouter ce qui suit

```js
counter += 1
```

le composant ne sera pas rendu à nouveau. Nous pouvons obtenir un nouveau rendu du en appelant la méthode _render_ une deuxième fois, par ex. de la manière suivante :

```js
let counter = 1

const refresh = () => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <App counter={counter} />
  )
}

refresh()
counter += 1
refresh()
counter += 1
refresh()
```

La commande de re-rendu a été intégrée à la fonction _refresh_ pour réduire la quantité de code copié-collé.

Maintenant, le composant <i>rend trois fois</i>, d'abord avec la valeur 1, puis 2 et enfin 3. Cependant, les valeurs 1 et 2 sont affichées à l'écran pendant une durée si courte qu'elles ne peuvent pas être remarqué.

Nous pouvons implémenter des fonctionnalités légèrement plus intéressantes en recréant et en incrémentant le compteur toutes les secondes en utilisant [setInterval](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval) :

```js
setInterval(() => {
  refresh()
  counter += 1
}, 1000)
```

Faire des appels répétés de la méthode _render_ n'est pas la méthode recommandée pour rafraichir nos composants. Nous présenterons plus tard une meilleure façon d'obtenir cet effet.

### Composant stateful

Jusqu'à présent, tous nos composants étaient simples dans le sens où ils ne contenaient aucun état susceptible de changer au cours du cycle de vie du composant.

Ensuite, ajoutons un état au composant <i>App</i> de notre application à l'aide du [state hook](https://reactjs.org/docs/hooks-state.html) de React.

Nous allons modifier l'application comme suit. <i>index.js</i> revient à

```js
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

et <i>App.js</i> change comme suit :

```js
import { useState } from 'react' // highlight-line

const App = () => {
  const [ counter, setCounter ] = useState(0) // highlight-line

// highlight-start
  setTimeout(
    () => setCounter(counter + 1),
    1000
  )
  // highlight-end

  return (
    <div>{counter}</div>
  )
}

export default App
```


Dans la première ligne, le fichier importe la fonction _useState_ :

```js
import { useState } from 'react'
```

Le corps de la fonction qui définit le composant commence par l'appel de la fonction :

```js
const [ counter, setCounter ] = useState(0)
```

L'appel de fonction ajoute <i>state</i> au composant et le rend initialisé avec la valeur zéro. La fonction renvoie un tableau qui contient deux éléments. Nous affectons les éléments aux variables _counter_ et _setCounter_ en utilisant la syntaxe d'affectation déstructurante présentée précédemment.

La variable _counter_ reçoit la valeur initiale de <i>state</i> qui est zéro. La variable _setCounter_ est affectée à une fonction qui servira à <i>modifier l'état</i>.

L'application appelle la fonction [setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) et lui transmet deux paramètres : une fonction pour incrémenter l'état du compteur et un délai d'expiration d'une seconde:

```js
setTimeout(
  () => setCounter(counter + 1),
  1000
)
```

La fonction passée en premier paramètre à la fonction _setTimeout_ est invoquée une seconde après l'appel de la fonction _setTimeout_

```js
() => setCounter(counter + 1)
```

Lorsque la fonction de modification d'état _setCounter_ est appelée, <i>React rend à nouveau le composant</i>, ce qui signifie que le corps de la fonction du composant est réexécuté :

```js
() => {
  const [ counter, setCounter ] = useState(0)

  setTimeout(
    () => setCounter(counter + 1),
    1000
  )

  return (
    <div>{counter}</div>
  )
}
```

La deuxième fois que la fonction du composant est exécutée, elle appelle la fonction _useState_ et renvoie la nouvelle valeur de l'état : 1. L'exécution à nouveau du corps de la fonction effectue également un nouvel appel de fonction à _setTimeout_, qui exécute le délai d'attente d'une seconde et incrémente à nouveau l'état _counter_ . Étant donné que la valeur de la variable _counter_ est 1, l'incrémentation de la valeur de 1 revient essentiellement à une expression définissant la valeur de _counter_ sur 2.

```js
() => setCounter(2)
```
Pendant ce temps, l'ancienne valeur de _counter_ - "1" - est rendue à l'écran.

Chaque fois que le _setCounter_ modifie l'état, il provoque le rendu du composant. La valeur de l'état sera incrémentée à nouveau après une seconde, et cela continuera à se répéter tant que l'application sera en cours d'exécution.

Si le composant ne s'affiche pas lorsque vous pensez qu'il le devrait, ou s'il s'affiche au "mauvais moment", vous pouvez déboguer l'application en enregistrant les valeurs des variables du composant dans la console. Si nous faisons les ajouts suivants à notre code :

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  setTimeout(
    () => setCounter(counter + 1),
    1000
  )

  console.log('rendering...', counter) // highlight-line

  return (
    <div>{counter}</div>
  )
}
```

Il est facile de suivre les appels effectués à la fonction de rendu du composant <i>App</i> :

![](../../images/1/4e.png)

### Gestion des événements

Nous avons déjà mentionné les <i>gestionnaires d'événements</i> qui sont enregistrés pour être appelés lorsque des événements spécifiques se produisent plusieurs fois dans la [partie 0](/fr/part0). Par exemple. l'interaction d'un utilisateur avec les différents éléments d'une page Web peut provoquer le déclenchement d'un ensemble de différents types d'événements.

Modifions l'application pour que l'augmentation du compteur se produise lorsqu'un utilisateur clique sur un bouton, ce qui est implémenté avec l'élément [bouton](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button).

Les éléments bouton prennent en charge les [mouse events](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent), dont [click](https://developer.mozilla.org/en-US/docs/Web/Events/click), l'événement le plus courant. L'événement clic sur un bouton peut également être déclenché avec le clavier ou un écran tactile malgré le nom <i>mouse event</i>.

Dans React, [l'application d'un event handler](https://reactjs.org/docs/handling-events.html) à l'événement <i>click</i> se passe comme ceci :

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  // highlight-start
  const handleClick = () => {
    console.log('clicked')
  }
  // highlight-end

  return (
    <div>
      <div>{counter}</div>
      // highlight-start 
      <button onClick={handleClick}>
        plus
      </button>
      // highlight-end
    </div>
  )
}
```

Nous définissons la valeur de l'attribut <i>onClick</i> du bouton comme une référence à la fonction _handleClick_ définie dans le code.

Désormais, chaque clic sur le bouton <i>plus</i> entraîne l'appel de la fonction _handleClick_, ce qui signifie que chaque événement de clic enregistrera un message <i>cliqué</i> dans la console du navigateur.

La fonction de gestionnaire d'événements peut également être définie directement dans l'affectation de valeur de l'attribut onClick :

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  return (
    <div>
      <div>{counter}</div>
      <button onClick={() => console.log('clicked')}> // highlight-line
        plus
      </button>
    </div>
  )
}
```

En modifiant le gestionnaire d'événements sous la forme suivante
```js
<button onClick={() => setCounter(counter + 1)}>
  plus
</button>
```

nous obtenons le comportement souhaité, ce qui signifie que la valeur de _counter_ est augmentée de un <i>et</i> que le composant est re-rendu.

Ajoutons également un bouton pour réinitialiser le compteur :

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  return (
    <div>
      <div>{counter}</div>
      <button onClick={() => setCounter(counter + 1)}>
        plus
      </button>
      // highlight-start
      <button onClick={() => setCounter(0)}> 
        zero
      </button>
      // highlight-end
    </div>
  )
}
```

Notre application est fin prête !


### Le gestionnaire d'événements est une fonction

Nous définissons les gestionnaires d'événements pour nos boutons où nous déclarons leurs attributs <i>onClick</i> :

```js
<button onClick={() => setCounter(counter + 1)}> 
  plus
</button>
```

Et si nous essayions de définir les gestionnaires d'événements sous une forme plus simple ?

```js
<button onClick={setCounter(counter + 1)}> 
  plus
</button>
```

Cela casserait complètement notre application :

![](../../images/1/5c.png)

Que se passe-t-il? Un gestionnaire d'événements est censé être soit une <i>fonction</i> soit une <i>référence de fonction</i>, et lorsque nous écrivons :

```js
<button onClick={setCounter(counter + 1)}>
```

le gestionnaire d'événements est en fait un <i>appel de fonction</i>. Dans de nombreuses situations, c'est ok, mais pas dans cette situation particulière. Au début, la valeur de la variable <i>counter</i> est 0. Lorsque React rend le composant pour la première fois, il exécute l'appel de fonction <em>setCounter(0+1)</em>, et change la valeur de l'état du composant à 1.
Cela entraînera un nouveau rendu du composant, React exécutera à nouveau l'appel de la fonction setCounter et l'état changera, conduisant à un autre rendu ...

Définissons les gestionnaires d'événements comme nous l'avons fait auparavant :

```js
<button onClick={() => setCounter(counter + 1)}> 
  plus
</button>
```

Maintenant, l'attribut du bouton qui définit ce qui se passe lorsque le bouton est cliqué - <i>onClick</i> - a la valeur _() => setCounter(counter + 1)_.
La fonction setCounter est appelée uniquement lorsqu'un utilisateur clique sur le bouton.

Habituellement, définir des gestionnaires d'événements dans des modèles JSX n'est pas une bonne idée.
Ici, ça va, car nos gestionnaires d'événements sont assez simples.

Séparons quand même les gestionnaires d'événements en fonctions distinctes :

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

// highlight-start
  const increaseByOne = () => setCounter(counter + 1)
  
  const setToZero = () => setCounter(0)
  // highlight-end

  return (
    <div>
      <div>{counter}</div>
      <button onClick={increaseByOne}> // highlight-line
        plus
      </button>
      <button onClick={setToZero}> // highlight-line
        zero
      </button>
    </div>
  )
}
```

Ici, les gestionnaires d'événements ont été définis correctement. La valeur de l'attribut <i>onClick</i> est une variable contenant une référence à une fonction :

```js
<button onClick={increaseByOne}> 
  plus
</button>
```

### Transmission de l'état aux composants enfants

Il est recommandé d'écrire des composants React petits et réutilisables dans l'application et même dans les projets. Refactorisons notre application afin qu'elle soit composée de trois composants plus petits, un composant pour afficher le compteur et deux composants pour les boutons.

Commençons par implémenter un composant <i>Display</i> chargé d'afficher la valeur du compteur.

Une bonne pratique dans React consiste à [remonter l'état](https://reactjs.org/docs/lifting-state-up.html) dans la hiérarchie des composants. La documentation dit:

> <i>Souvent, plusieurs composants doivent refléter les mêmes données changeantes. Nous vous recommandons de remonter l'état partagé jusqu'à leur ancêtre commun le plus proche.</i>

Plaçons donc l'état de l'application dans le composant <i>App</i> et transmettons-le au composant <i>Display</i> via <i>props</i> :

```js
const Display = (props) => {
  return (
    <div>{props.counter}</div>
  )
}
```

L'utilisation du composant est simple, car nous n'avons qu'à lui transmettre l'état du _counter_ :

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  const increaseByOne = () => setCounter(counter + 1)
  const setToZero = () => setCounter(0)

  return (
    <div>
      <Display counter={counter}/> // highlight-line
      <button onClick={increaseByOne}>
        plus
      </button>
      <button onClick={setToZero}> 
        zero
      </button>
    </div>
  )
}
```

Tout fonctionne encore. Lorsque les boutons sont cliqués et que l'<i>App</i> est re-rendue, tous ses enfants, y compris le composant <i>Display</i> sont également re-rendus.

Ensuite, créons un composant <i>Button</i> pour les boutons de notre application. Nous devons passer le gestionnaire d'événements ainsi que le titre du bouton via les props du composant :

```js
const Button = (props) => {
  return (
    <button onClick={props.onClick}>
      {props.text}
    </button>
  )
}
```

Notre composant <i>App</i> ressemble maintenant à ceci :

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  const increaseByOne = () => setCounter(counter + 1)
  //highlight-start
  const decreaseByOne = () => setCounter(counter - 1)
  //highlight-end
  const setToZero = () => setCounter(0)

  return (
    <div>
      <Display counter={counter}/>
      // highlight-start
      <Button
        onClick={increaseByOne}
        text='plus'
      />
      <Button
        onClick={setToZero}
        text='zero'
      />     
      <Button
        onClick={decreaseByOne}
        text='minus'
      />           
      // highlight-end
    </div>
  )
}
```

Puisque nous avons maintenant un composant <i>Button</i> facilement réutilisable, nous avons également implémenté de nouvelles fonctionnalités dans notre application en ajoutant un bouton qui peut être utilisé pour décrémenter le compteur.

Le gestionnaire d'événements est transmis au composant <i>Button</i> via la prop _onClick_. Le nom de la prop lui-même n'est pas assez significatif, mais notre choix de nom n'était pas complètement aléatoire. Le [tutoriel](https://reactjs.org/tutorial/tutorial.html) officiel de React suggère cette convention.

### Les changements d'état entraînent un nouveau rendu

Revenons une fois de plus sur les grands principes de fonctionnement d'une application.

Lorsque l'application démarre, le code dans _App_ est exécuté. Ce code utilise un hook [useState](https://reactjs.org/docs/hooks-reference.html#usestate) pour créer l'état de l'application, en définissant une valeur initiale de la variable _counter_.
Ce composant contient le composant _Display_ - qui affiche la valeur du compteur, 0 - et trois composants _Button_. Les boutons ont tous des gestionnaires d'événements, qui sont utilisés pour changer l'état du compteur.

Lorsque l'un des boutons est cliqué, le gestionnaire d'événements est exécuté. Le gestionnaire d'événements modifie l'état du composant _App_ avec la fonction _setCounter_.

**L'appel d'une fonction qui modifie l'état provoque le rendu du composant.**

Ainsi, si un utilisateur clique sur le bouton <i>plus</i>, le gestionnaire d'événements du bouton change la valeur de _counter_ à 1, et le composant _App_ est restitué.
Cela entraîne également le rendu de ses sous-composants _Display_ et _Button_.
_Display_ reçoit la nouvelle valeur du compteur, 1, comme prop. Les composants _Button_ reçoivent des gestionnaires d'événements qui peuvent être utilisés pour modifier l'état du compteur.

### Refactoring des composants

Le composant affichant la valeur du compteur est le suivant :

```js
const Display = (props) => {
  return (
    <div>{props.counter}</div>
  )
}
```

Le composant utilise uniquement le champ _counter_ de ses <i>props</i>.
Cela signifie que nous pouvons simplifier le composant en utilisant la [déstructuration](/fr/part1/etat_des_composants_gestionnaires_devenements#destructuration), comme ceci :

```js
const Display = ({ counter }) => {
  return (
    <div>{counter}</div>
  )
}
```

La fonction définissant le composant ne contient que l'instruction return, donc
nous pouvons définir la fonction en utilisant la forme plus compacte des fonctions fléchées :

```js
const Display = ({ counter }) => <div>{counter}</div>
```

Nous pouvons également simplifier le composant Button.

```js
const Button = (props) => {
  return (
    <button onClick={props.onClick}>
      {props.text}
    </button>
  )
}
```

Nous pouvons utiliser la déstructuration pour obtenir uniquement les champs requis à partir de <i>props</i>, et utiliser la forme plus compacte des fonctions fléchées :

```js
const Button = ({ onClick, text }) => (
  <button onClick={onClick}>
    {text}
  </button>
)
```

Nous pouvons simplifier une fois de plus le composant Button en déclarant l'instruction return sur une seule ligne :

```js
const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>
```

Cependant, veillez à ne pas trop simplifier vos composants, car cela pourrait rendre la lecture du code plus fastidieuse.

</div>
