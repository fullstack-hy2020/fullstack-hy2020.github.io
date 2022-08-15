---
mainImage: ../../../images/part-1.svg
part: 1
letter: d
lang: fr
---

<div class="content">

### Une note sur la version React

La version 18 de React est sortie fin mars 2022. Le code du matériel devrait fonctionner tel qu'il est avec la nouvelle version de React. Cependant, certaines bibliothèques peuvent ne pas encore être compatibles avec React 18. Au moment de la rédaction (4 avril), le client Apollo utilisé dans [partie 8](/en/part8) ne fonctionne pas encore avec la version la plus récente de React.

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

Nous pouvons définir le nouvel état de l'objet un peu plus précisément en utilisant [object spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
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

### Debugging React applications

A large part of a typical developer's time is spent on debugging and reading existing code. Every now and then we do get to write a line or two of new code, but a large part of our time is spent on trying to figure out why something is broken or how something works. Good practices and tools for debugging are extremely important for this reason.

Lucky for us, React is an extremely developer-friendly library when it comes to debugging.

Before we move on, let us remind ourselves of one of the most important rules of web development.

<h4>The first rule of web development</h4>

>  **Keep the browser's developer console open at all times.**
>
> The <i>Console</i> tab in particular should always be open, unless there is a specific reason to view another tab.

Keep both your code and the web page open together **at the same time, all the time**.

If and when your code fails to compile and your browser lights up like a Christmas tree:

![](../../images/1/6x.png)

don't write more code but rather find and fix the problem **immediately**. There has yet to be a moment in the history of coding where code that fails to compile would miraculously start working after writing large amounts of additional code. I highly doubt that such an event will transpire during this course either.

Old school, print-based debugging is always a good idea. If the component

```js
const Button = ({ onClick, text }) => (
  <button onClick={onClick}>
    {text}
  </button>
)
```

is not working as intended, it's useful to start printing its variables out to the console. In order to do this effectively, we must transform our function into the less compact form and receive the entire props object without destructuring it immediately:

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

This will immediately reveal if, for instance, one of the attributes has been misspelled when using the component.

**NB** When you use _console.log_ for debugging, don't combine _objects_ in a Java-like fashion by using the plus operator. Instead of writing:

```js
console.log('props value is ' + props)
```

Separate the things you want to log to the console with a comma:

```js
console.log('props value is', props)
```

If you use the Java-like way of concatenating a string with an object, you will end up with a rather uninformative log message:

```js
props value is [Object object]
```

Whereas the items separated by a comma will all be available in the browser console for further inspection.

Logging to the console is by no means the only way of debugging our applications. You can pause the execution of your application code in the Chrome developer console's <i>debugger</i>, by writing the command [debugger](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/debugger) anywhere in your code.

The execution will pause once it arrives at a point where the _debugger_ command gets executed:

![](../../images/1/7a.png)

By going to the <i>Console</i> tab, it is easy to inspect the current state of variables:

![](../../images/1/8a.png)

Once the cause of the bug is discovered you can remove the _debugger_ command and refresh the page.

The debugger also enables us to execute our code line by line with the controls found on the right-hand side of the <i>Sources</i> tab.

You can also access the debugger without the _debugger_ command by adding breakpoints in the <i>Sources</i> tab. Inspecting the values of the component's variables can be done in the _Scope_-section:

![](../../images/1/9a.png)

It is highly recommended to add the [React developer tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) extension to Chrome. It adds a new _Components_ tab to the developer tools. The new developer tools tab can be used to inspect the different React elements in the application, along with their state and props:

![](../../images/1/10ea.png)


The _App_ component's state is defined like so:

```js
const [left, setLeft] = useState(0)
const [right, setRight] = useState(0)
const [allClicks, setAll] = useState([])
```

Dev tools shows the state of hooks in the order of their definition:

![](../../images/1/11ea.png)

The first <i>State</i> contains the value of the <i>left</i> state, the next contains the value of the <i>right</i> state and the last contains the value of the <i>allClicks</i> state.

### Rules of Hooks

There are a few limitations and rules we have to follow to ensure that our application uses hooks-based state functions correctly.

The _useState_ function (as well as the _useEffect_ function introduced later on in the course) <i>must not be called</i> from inside of a loop, a conditional expression, or any place that is not a function defining a component. This must be done to ensure that the hooks are always called in the same order, and if this isn't the case the application will behave erratically.

To recap, hooks may only be called from the inside of a function body that defines a React component:

```js
const App = () => {
  // these are ok
  const [age, setAge] = useState(0)
  const [name, setName] = useState('Juha Tauriainen')

  if ( age > 10 ) {
    // this does not work!
    const [foobar, setFoobar] = useState(null)
  }

  for ( let i = 0; i < age; i++ ) {
    // also this is not good
    const [rightWay, setRightWay] = useState(false)
  }

  const notGood = () => {
    // and this is also illegal
    const [x, setX] = useState(-1000)
  }

  return (
    //...
  )
}
```

### Event Handling Revisited

Event handling has proven to be a difficult topic in previous iterations of this course.

For this reason we will revisit the topic.

Let's assume that we're developing this simple application with the following component <i>App</i>:
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

We want the clicking of the button to reset the state stored in the _value_ variable.

In order to make the button react to a click event, we have to add an <i>event handler</i> to it.

Event handlers must always be a function or a reference to a function. The button will not work if the event handler is set to a variable of any other type.

If we were to define the event handler as a string:

```js
<button onClick="crap...">button</button>
```

React would warn us about this in the console:

```js
index.js:2178 Warning: Expected `onClick` listener to be a function, instead got a value of `string` type.
    in button (at index.js:20)
    in div (at index.js:18)
    in App (at index.js:27)
```

The following attempt would also not work:

```js
<button onClick={value + 1}>button</button>
```

We have attempted to set the event handler to _value + 1_ which simply returns the result of the operation. React will kindly warn us about this in the console:

```js
index.js:2178 Warning: Expected `onClick` listener to be a function, instead got a value of `number` type.
```

This attempt would not work either:
```js
<button onClick={value = 0}>button</button>
```

The event handler is not a function but a variable assignment, and React will once again issue a warning to the console. This attempt is also flawed in the sense that we must never mutate state directly in React.

What about the following:

```js
<button onClick={console.log('clicked the button')}>
  button
</button>
```

The message gets printed to the console once when the component is rendered but nothing happens when we click the button. Why does this not work even when our event handler contains a function _console.log_?

The issue here is that our event handler is defined as a <i>function call</i> which means that the event handler is actually assigned the returned value from the function, which in the case of _console.log_ is <i>undefined</i>.

The _console.log_ function call gets executed when the component is rendered and for this reason it gets printed once to the console.

The following attempt is flawed as well:
```js
<button onClick={setValue(0)}>button</button>
```

We have once again tried to set a function call as the event handler. This does not work. This particular attempt also causes another problem. When the component is rendered the function _setValue(0)_ gets executed which in turn causes the component to be re-rendered. Re-rendering in turn calls _setValue(0)_ again, resulting in an infinite recursion.

Executing a particular function call when the button is clicked can be accomplished like this:

```js
<button onClick={() => console.log('clicked the button')}>
  button
</button>
```

Now the event handler is a function defined with the arrow function syntax _() => console.log('clicked the button')_. When the component gets rendered, no function gets called and only the reference to the arrow function is set to the event handler. Calling the function happens only once the button is clicked.

We can implement resetting the state in our application with this same technique:

```js
<button onClick={() => setValue(0)}>button</button>
```

The event handler is now the function _() => setValue(0)_.

Defining event handlers directly in the attribute of the button is not necessarily the best possible idea.

You will often see event handlers defined in a separate place. In the following version of our application we define a function that then gets assigned to the _handleClick_ variable in the body of the component function:

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

The _handleClick_ variable is now assigned to a reference to the function. The reference is passed to the button as the <i>onClick</i> attribute:

```js
<button onClick={handleClick}>button</button>
```

Naturally, our event handler function can be composed of multiple commands. In these cases we use the longer curly brace syntax for arrow functions:

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

### Function that returns a function

Another way to define an event handler is to use <i>function that returns a function</i>.

You probably won't need to use functions that return functions in any of the exercises in this course.  If the topic seems particularly confusing, you may skip over this section for now and return to it later.

Let's make the following changes to our code:

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

The code functions correctly even though it looks complicated. 

The event handler is now set to a function call:

```js
<button onClick={hello()}>button</button>
```

Earlier on we stated that an event handler may not be a call to a function, and that it has to be a function or a reference to a function. Why then does a function call work in this case?

When the component is rendered, the following function gets executed:

```js
const hello = () => {
  const handler = () => console.log('hello world')

  return handler
}
```

The <i>return value</i> of the function is another function that is assigned to the _handler_ variable.

When React renders the line:

```js
<button onClick={hello()}>button</button>
```

It assigns the return value of _hello()_ to the onClick attribute. Essentially the line gets transformed into:

```js
<button onClick={() => console.log('hello world')}>
  button
</button>
```

Since the _hello_ function returns a function, the event handler is now a function.

What's the point of this concept?

Let's change the code a tiny bit:

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

Now the application has three buttons with event handlers defined by the _hello_ function that accepts a parameter.

The first button is defined as

```js
<button onClick={hello('world')}>button</button>
```

The event handler is created by <i>executing</i> the function call _hello('world')_. The function call returns the function:

```js
() => {
  console.log('hello', 'world')
}
```

The second button is defined as:

```js
<button onClick={hello('react')}>button</button>
```

The function call _hello('react')_ that creates the event handler returns:

```js
() => {
  console.log('hello', 'react')
}
```

Both buttons get their own individualized event handlers.

Functions returning functions can be utilized in defining generic functionality that can be customized with parameters. The _hello_ function that creates the event handlers can be thought of as a factory that produces customized event handlers meant for greeting users.

Our current definition is slightly verbose:

```js
const hello = (who) => {
  const handler = () => {
    console.log('hello', who)
  }

  return handler
}
```

Let's eliminate the helper variables and directly return the created function:

```js
const hello = (who) => {
  return () => {
    console.log('hello', who)
  }
}
```

Since our _hello_ function is composed of a single return command, we can omit the curly braces and use the more compact syntax for arrow functions:

```js
const hello = (who) =>
  () => {
    console.log('hello', who)
  }
```

Lastly, let's write all of the arrows on the same line:

```js
const hello = (who) => () => {
  console.log('hello', who)
}
```

We can use the same trick to define event handlers that set the state of the component to a given value. Let's make the following changes to our code:

```js
const App = () => {
  const [value, setValue] = useState(10)
  
  // highlight-start
  const setToValue = (newValue) => () => {
    console.log('value now', newValue)  // print the new value to console
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

When the component is rendered, the <i>thousand</i> button is created:

```js
<button onClick={setToValue(1000)}>thousand</button>
```

The event handler is set to the return value of _setToValue(1000)_ which is the following function:

```js
() => {
  console.log('value now', 1000)
  setValue(1000)
}
```

The increase button is declared as follows:

```js
<button onClick={setToValue(value + 1)}>increment</button>
```

The event handler is created by the function call _setToValue(value + 1)_ which receives as its parameter the current value of the state variable _value_ increased by one. If the value of _value_ was 10, then the created event handler would be the function:

```js
() => {
  console.log('value now', 11)
  setValue(11)
}
```

Using functions that return functions is not required to achieve this functionality. Let's return the _setToValue_ function that is responsible for updating state, into a normal function:

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

We can now define the event handler as a function that calls the _setToValue_ function with an appropriate parameter. The event handler for resetting the application state would be:

```js
<button onClick={() => setToValue(0)}>reset</button>
```

Choosing between the two presented ways of defining your event handlers is mostly a matter of taste.

### Passing Event Handlers to Child Components

Let's extract the button into its own component:

```js
const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)
```

The component gets the event handler function from the _handleClick_ prop, and the text of the button from the _text_ prop.

Using the <i>Button</i> component is simple, although we have to make sure that we use the correct attribute names when passing props to the component.

![](../../images/1/12e.png)

### Do Not Define Components Within Components

Let's start displaying the value of the application into its own <i>Display</i> component.

We will change the application by defining a new component inside of the <i>App</i>-component.

```js
// This is the right place to define a component
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

  // Do not define components inside another component
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

The application still appears to work, but **don't implement components like this!** Never define components inside of other components. The method provides no benefits and leads to many unpleasant problems. The biggest problems are due to the fact that React treats a component defined inside of another component as a new component in every render. This makes it impossible for React to optimize the component.

Let's instead move the <i>Display</i> component function to its correct place, which is outside of the <i>App</i> component function:

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

### Useful Reading

The internet is full of React-related material. However, we use the new style of React for which a large majority of the material found online is outdated.

You may find the following links useful:

- The [official React documentation](https://reactjs.org/docs/hello-world.html) is worth checking out at some point, although most of it will become relevant only later on in the course. Also, everything related to class-based components is irrelevant to us;
- Some courses on [Egghead.io](https://egghead.io) like [Start learning React](https://egghead.io/courses/start-learning-react) are of high quality, and recently updated [The Beginner's Guide to React](https://egghead.io/courses/the-beginner-s-guide-to-reactjs) is also relatively good; both courses introduce concepts that will also be introduced later on in this course. **NB** The first one uses class components but the latter uses the new functional ones.

</div>

<div class="tasks">

<h3>Exercises  1.6.-1.14.</h3>

Submit your solutions to the exercises by first pushing your code to GitHub and then marking the completed exercises into the [exercise submission system](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

Remember, submit **all** the exercises of one part **in a single submission**. Once you have submitted your solutions for one part, **you cannot submit more exercises to that part any more**.

<i>Some of the exercises work on the same application. In these cases, it is sufficient to submit just the final version of the application. If you wish, you can make a commit after every finished exercise, but it is not mandatory.</i>

**WARNING** create-react-app will automatically turn your project into a git-repository unless you create your application inside of an existing git repository. **Most likely you do not want each of your projects to be a separate repository**, so simply run the _rm -rf .git_ command at the root of your application.

In some situations you may also have to run the command below from the root of the project:

``` 
rm -rf node_modules/ && npm i
```

<h4> 1.6: unicafe step1</h4>

Like most companies, [Unicafe](https://www.unicafe.fi/#/9/4) collects feedback from its customers. Your task is to implement a web application for collecting customer feedback. There are only three options for feedback: <i>good</i>, <i>neutral</i>, and <i>bad</i>.

The application must display the total number of collected feedback for each category. Your final application could look like this:

![](../../images/1/13e.png)

Note that your application needs to work only during a single browser session. Once you refresh the page, the collected feedback is allowed to disappear.

It is advisable to use the same structure that is used in material and previous exercise. File <i>index.js</i> is as follows:

```js
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

You can use the code below as a starting point for the <i>App.js</i> file:

```js
import { useState } from 'react'

const App = () => {
  // save clicks of each button to its own state
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

<h4>1.7: unicafe step2</h4>

Expand your application so that it shows more statistics about the gathered feedback: the total number of collected feedback, the average score (good: 1, neutral: 0, bad: -1) and the percentage of positive feedback.

![](../../images/1/14e.png)

<h4>1.8: unicafe step3</h4>

Refactor your application so that displaying the statistics is extracted into its own <i>Statistics</i> component. The state of the application should remain in the <i>App</i> root component.

Remember that components should not be defined inside other components:

```js
// a proper place to define a component
const Statistics = (props) => {
  // ...
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  // do not define a component within another component
  const Statistics = (props) => {
    // ...
  }

  return (
    // ...
  )
}
```

<h4>1.9: unicafe step4</h4>

Change your application to display statistics only once feedback has been gathered.

![](../../images/1/15e.png)

<h4>1.10: unicafe step5</h4>

Let's continue refactoring the application. Extract the following two components:

- <i>Button</i> for defining the buttons used for submitting feedback
- <i>StatisticLine</i> for displaying a single statistic, e.g. the average score.

To be clear: the <i>StatisticLine</i> component always displays a single statistic, meaning that the application uses multiple components for rendering all of the statistics:

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

The application's state should still be kept in the root <i>App</i> component.

<h4>1.11*: unicafe step6</h4>

Display the statistics in an HTML [table](https://developer.mozilla.org/en-US/docs/Learn/HTML/Tables/Basics), so that your application looks roughly like this:

![](../../images/1/16e.png)

Remember to keep your console open at all times. If you see this warning in your console:

![](../../images/1/17a.png)

Then perform the necessary actions to make the warning disappear. Try pasting the error message into a search engine if you get stuck.

<i>Typical source of an error `Unchecked runtime.lastError: Could not establish connection. Receiving end does not exist.` is Chrome extension. Try going to `chrome://extensions/` and try disabling them one by one and refreshing React app page; the error should eventually disappear.</i>

**Make sure that from now on you don't see any warnings in your console!**

<h4>1.12*: anecdotes step1</h4>

The world of software engineering is filled with [anecdotes](http://www.comp.nus.edu.sg/~damithch/pages/SE-quotes.htm) that distill timeless truths from our field into short one-liners.

Expand the following application by adding a button that can be clicked to display a <i>random</i> anecdote from the field of software engineering: 

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

Content of the file <i>index.js</i> is same as in previous exercises. 

Find out how to generate random numbers in JavaScript, eg. via search engine or on [Mozilla Developer Network](https://developer.mozilla.org). Remember that you can test generating random numbers e.g. straight in the console of your browser.

Your finished application could look something like this:

![](../../images/1/18a.png)

**WARNING** create-react-app will automatically turn your project into a git-repository unless you create your application inside of an existing git repository. **Most likely you do not want each of your projects to be a separate repository**, so simply run the _rm -rf .git_ command at the root of your application.

<h4>1.13*: anecdotes step2</h4>

Expand your application so that you can vote for the displayed anecdote.

![](../../images/1/19a.png)

**NB** store the votes of each anecdote into an array or object in the component's state. Remember that the correct way of updating state stored in complex data structures like objects and arrays is to make a copy of the state.

You can create a copy of an object like this:

```js
const points = { 0: 1, 1: 3, 2: 4, 3: 2 }

const copy = { ...points }
// increment the property 2 value by one
copy[2] += 1     
```

OR a copy of an array like this:

```js
const points = [1, 4, 6, 3]

const copy = [...points]
// increment the value in position 2 by one
copy[2] += 1     
```

Using an array might be the simpler choice in this case. Searching the Internet will provide you with lots of hints on how to [create a zero-filled array of a desired length](https://stackoverflow.com/questions/20222501/how-to-create-a-zero-filled-javascript-array-of-arbitrary-length/22209781).

<h4>1.14*: anecdotes step3</h4>

Now implement the final version of the application that displays the anecdote with the largest number of votes:

![](../../images/1/20a.png)

If multiple anecdotes are tied for first place it is sufficient to just show one of them.

This was the last exercise for this part of the course and it's time to push your code to GitHub and mark all of your finished exercises to the [exercise submission system](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

</div>
