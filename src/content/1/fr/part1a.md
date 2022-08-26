---
mainImage: ../../../images/part-1.svg
part: 1
letter: a
lang: fr
---

<div class="content">

Nous allons maintenant commencer à nous familiariser avec le sujet probablement le plus important de ce cours, à savoir la bibliothèque [React](https://reactjs.org/). Commençons par créer une application React simple et apprenons à connaître les concepts de base de React.

Le moyen le plus simple de démarrer est de loin d'utiliser un outil appelé [create-react-app](https://github.com/facebook/create-react-app). Il est possible (mais pas nécessaire) d'installer <i>create-react-app</i> sur votre machine si l'outil <i>npm</i> qui a été installé avec Node a un numéro de version d'au moins <i>5.3</i>.

Créons une application appelée <i>part1</i> et naviguons jusqu'à son répertoire.

```bash
npx create-react-app part1
cd part1
```

L'application est exécutée comme suit

```bash
npm start
```

Par défaut, l'application s'exécute sur le port 3000 avec l'adresse <http://localhost:3000>

Votre navigateur par défaut devrait se lancer automatiquement. Ouvrez la console du navigateur **immédiatement**. Ouvrez également un éditeur de texte afin de pouvoir visualiser le code ainsi que la page Web en même temps à l'écran :

![](../../images/1/1e.png)

Le code de l'application réside dans le dossier <i>src</i>. Simplifions le code par défaut de sorte que le contenu du fichier <i>index.js</i> ressemble à :

```js
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

et le fichier <i>App.js</i> ressemble à ceci

```js
const App = () => (
  <div>
    <p>Hello world</p>
  </div>
)

export default App
```

Les fichiers <i>App.css</i>, <i>App.test.js</i>, <i>index.css</i>, <i>logo.svg</i>, <i >setupTests.js</i> et <i>reportWebVitals.js</i> peuvent être supprimés car ils ne sont pas nécessaires dans notre application pour le moment.

Si vous vous retrouvez avec l'erreur suivante :

![](../../images/1/r18-error.png)

Ensuite, pour une raison quelconque, vous utilisez une version de React antérieure à la version actuelle 18.

Le correctif consiste à modifier <i>index.js</i> comme suit

```js
import ReactDOM from "react-dom"
import App from "./App"

ReactDOM.render(<App />, document.getElementById("root"))
```

Vous devrez très probablement faire de même pour vos autres projets.

Voir [ici](/fr/part1/plongez_dans_le_debogage_dapplications_react#une-note-sur-la-version-react) pour en savoir plus sur les différences de version.

### Composant

Le fichier <i>App.js</i> définit maintenant un [composant React](https://reactjs.org/docs/components-and-props.html) avec le nom <i>App</i>. La commande sur la dernière ligne du fichier <i>index.js</i>

```js
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

rend son contenu dans l'élément <i>div</i>, défini dans le fichier <i>public/index.html</i>, ayant la valeur <i>id</i> 'root'.

Par défaut, le fichier <i>public/index.html</i> ne contient aucun balisage HTML qui nous soit visible dans le navigateur. Vous pouvez essayer d'ajouter du HTML dans le fichier. Cependant, lors de l'utilisation de React, tout le contenu qui doit être rendu est généralement défini en tant que composants React.

Examinons de plus près le code définissant le composant :

```js
const App = () => (
  <div>
    <p>Hello world</p>
  </div>
)
```

Comme vous l'avez probablement deviné, le composant sera rendu sous la forme d'une balise <i>div</i>, qui enveloppe une balise <i>p</i> contenant le texte <i>Hello world</i>.

Techniquement, le composant est défini comme une fonction JavaScript. Voici une fonction (qui ne reçoit aucun paramètre) :

```js
() => (
  <div>
    <p>Hello world</p>
  </div>
)
```

La fonction est alors affectée à une variable constante <i>App</i> :

```js
const App = ...
```

Il existe plusieurs façons de définir des fonctions en JavaScript. Ici, nous utiliserons les [fonctions fléchées](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions), qui sont décrites dans une version plus récente de JavaScript connue sous le nom de [ECMAScript 6 ](http://es6-features.org/#Constants), également appelé ES6.

Parce que la fonction se compose d'une seule expression, nous avons utilisé un raccourci, qui représente ce morceau de code :

```js
const App = () => {
  return (
    <div>
      <p>Hello world</p>
    </div>
  )
}
```

En d'autres termes, la fonction renvoie la valeur de l'expression.

La fonction définissant le composant peut contenir n'importe quel type de code JavaScript. Modifiez votre composant pour qu'il soit comme suit et observez ce qui se passe dans la console :

```js
const App = () => {
  console.log('Hello from component')
  return (
    <div>
      <p>Hello world</p>
    </div>
  )
}
```

Il est également possible de rendre du contenu dynamique à l'intérieur d'un composant.

Modifiez le composant comme suit :

```js
const App = () => {
  const now = new Date()
  const a = 10
  const b = 20

  return (
    <div>
      <p>Hello world, it is {now.toString()}</p>
      <p>
        {a} plus {b} is {a + b}
      </p>
    </div>
  )
}
```

Tout code JavaScript à l'intérieur des accolades est évalué et le résultat de cette évaluation est intégré à l'emplacement défini dans le code HTML produit par le composant.

### JSX

Il semble que les composants React renvoient le balisage HTML. Cependant, ce n'est pas le cas. La disposition des composants React est principalement écrite à l'aide de [JSX](https://reactjs.org/docs/introducing-jsx.html). Bien que JSX ressemble à du HTML, nous avons en fait affaire à un moyen d'écrire du JavaScript. Sous le capot, le JSX renvoyé par les composants React est compilé en JavaScript.

Après compilation, notre application ressemble à ceci :

```js
const App = () => {
  const now = new Date()
  const a = 10
  const b = 20
  return React.createElement(
    'div',
    null,
    React.createElement(
      'p', null, 'Hello world, it is ', now.toString()
    ),
    React.createElement(
      'p', null, a, ' plus ', b, ' is ', a + b
    )
  )
}
```

La compilation est gérée par [Babel](https://babeljs.io/repl/). Les projets créés avec *create-react-app* sont configurés pour se compiler automatiquement. Nous en apprendrons plus sur ce sujet dans la [partie 7](/en/part7) de ce cours.

Il est également possible d'écrire React en "pur JavaScript" sans utiliser JSX. Bien que personne avec un esprit sain ne le ferait réellement.

En pratique, JSX ressemble beaucoup au HTML, à la différence qu'avec JSX, vous pouvez facilement intégrer du contenu dynamique en écrivant du JavaScript approprié entre accolades. L'idée de JSX est assez similaire à de nombreux moteurs de templates, tels que Thymeleaf utilisé avec Java Spring, qui sont utilisés sur les serveurs.

JSX est "[XML](https://developer.mozilla.org/en-US/docs/Web/XML/XML_introduction)-like", ce qui signifie que chaque balise doit être fermée. Par exemple, une nouvelle ligne est un élément vide, qui en HTML peut être écrit comme suit :

```html
<br>
```

mais lors de l'écriture de JSX, la balise doit être fermée :

```html
<br />
```

### Composants multiples

Modifions le fichier <i>App.js</i> comme suit (NB : l'exportation en bas est omise dans ces <i>exemples</i>, maintenant et dans le futur. Elle est toujours nécessaire pour faire fonctionner le code):

```js
// highlight-start
const Hello = () => {
  return (
    <div>
      <p>Hello world</p>
    </div>
  )
}
// highlight-end

const App = () => {
  return (
    <div>
      <h1>Greetings</h1>
      <Hello /> // highlight-line
    </div>
  )
}
```

Nous avons défini un nouveau composant <i>Hello</i> et l'avons utilisé dans le composant <i>App</i>. Naturellement, un composant peut être utilisé plusieurs fois :

```js
const App = () => {
  return (
    <div>
      <h1>Greetings</h1>
      <Hello />
      // highlight-start
      <Hello />
      <Hello />
      // highlight-end
    </div>
  )
}
```

L'écriture de composants avec React est facile, et en combinant des composants, même une application plus complexe peut rester assez maintenable. En effet, une philosophie de base de React consiste à composer des applications à partir de nombreux composants réutilisables spécialisés.

Une autre convention forte est l'idée d'un <i>composant racine</i> appelé <i>App</i> en haut de l'arborescence des composants de l'application. Néanmoins, comme nous l'apprendrons dans la [partie 6](/en/part6), il existe des situations où le composant <i>App</i> n'est pas exactement la racine, mais est encapsulé dans un composant utilitaire approprié.

### props : transmission de données aux composants

Il est possible de transmettre des données aux composants à l'aide de ce qu'on appelle [props](https://reactjs.org/docs/components-and-props.html).

Modifions le composant <i>Hello</i> comme suit

```js
const Hello = (props) => { // highlight-line
  return (
    <div>
      <p>Hello {props.name}</p> // highlight-line
    </div>
  )
}
```

Maintenant, la fonction définissant le composant a un paramètre <i>props</i>. En argument, le paramètre reçoit un objet, qui a des champs correspondant à toutes les "props" définis par l'utilisateur du composant.

Les props sont définis comme suit :

```js
const App = () => {
  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="George" /> // highlight-line
      <Hello name="Daisy" /> // highlight-line
    </div>
  )
}
```

Il peut y avoir un nombre arbitraire de props et leurs valeurs peuvent être des chaînes "codées en dur" ou des résultats d'expressions JavaScript. Si la valeur de la prop est obtenue à l'aide de JavaScript, elle doit être entourée d'accolades.

Modifions le code pour que le composant <i>Hello</i> utilise deux props :

```js
const Hello = (props) => {
  return (
    <div>
      <p>
        Hello {props.name}, you are {props.age} years old // highlight-line
      </p>
    </div>
  )
}

const App = () => {
  const name = 'Peter' // highlight-line
  const age = 10       // highlight-line

  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="Maya" age={26 + 10} /> // highlight-line
      <Hello name={name} age={age} />     // highlight-line
    </div>
  )
}
```

Les props envoyées par le composant <i>App</i> sont les valeurs des variables, le résultat de l'évaluation de l'expression sum et une chaîne régulière.

### Quelques notes

React a été configuré pour générer des messages d'erreur assez clairs. Malgré cela, vous devriez, au moins au début, avancer par **très petites étapes** et vous assurer que chaque changement fonctionne comme vous le souhaitez.

**La console doit toujours être ouverte**. Si le navigateur signale des erreurs, il n'est pas conseillé de continuer à écrire plus de code, en espérant des miracles. Vous devriez plutôt essayer de comprendre la cause de l'erreur et, par exemple, revenir à l'état de fonctionnement précédent :

![](../../images/1/2a.png)

Il est bon de se rappeler que dans React, il est possible et utile d'écrire des commandes <em>console.log()</em> (qui s'impriment sur la console) dans votre code.

Gardez également à l'esprit que **les noms de composants React doivent être en majuscules**. Si vous essayez de définir un composant comme suit

```js
const footer = () => {
  return (
    <div>
      greeting app created by <a href="https://github.com/mluukkai">mluukkai</a>
    </div>
  )
}
```

et l'utiliser comme ça

```js
const App = () => {
  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="Maya" age={26 + 10} />
      <footer /> // highlight-line
    </div>
  )
}
```

la page n'affichera pas le contenu défini dans le composant Footer, à la place, React crée uniquement un élément [footer](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/footer) vide, c'est-à-dire l'élément HTML intégré au lieu de l'élément React personnalisé du même nom. Si vous remplacez la première lettre du nom du composant par une lettre majuscule, React crée un élément <i>div</i> défini dans le composant Footer, qui est rendu sur la page.

Notez que le contenu d'un composant React doit (généralement) contenir **un élément racine**. Si nous essayons, par exemple, de définir le composant <i>App</i> sans l'élément <i>div</i> le plus externe :

```js
const App = () => {
  return (
    <h1>Greetings</h1>
    <Hello name="Maya" age={26 + 10} />
    <Footer />
  )
}
```

le résultat est un message d'erreur.

![](../../images/1/3c.png)

L'utilisation d'un élément racine n'est pas la seule option. Un <i>tableau</i> de composants est également une solution valide :

```js
const App = () => {
  return [
    <h1>Greetings</h1>,
    <Hello name="Maya" age={26 + 10} />,
    <Footer />
  ]
}
```

Cependant, lors de la définition du composant racine de l'application, ce n'est pas une chose particulièrement judicieuse à faire, et cela rend le code un peu moche.

Parce que l'élément racine est stipulé, nous avons des éléments div "supplémentaires" dans l'arbre DOM. Cela peut être évité en utilisant des [fragments](https://reactjs.org/docs/fragments.html#short-syntax), c'est-à-dire en enveloppant les éléments à renvoyer par le composant avec un élément vide :

```js
const App = () => {
  const name = 'Peter'
  const age = 10

  return (
    <>
      <h1>Greetings</h1>
      <Hello name="Maya" age={26 + 10} />
      <Hello name={name} age={age} />
      <Footer />
    </>
  )
}
```

Ca compile maintenant avec succès et le DOM généré par React ne contient plus l'élément div supplémentaire.

</div>

<div class="tasks">
  <h3>Exercices 1.1.-1.2.</h3>

Les exercices sont soumis via GitHub et en marquant les exercices terminés sur le [système de soumission](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

Vous pouvez soumettre tous les exercices de ce cours dans le même référentiel ou utiliser plusieurs référentiels. Si vous soumettez des exercices de différentes parties dans le même référentiel, veuillez utiliser un schéma de nommage raisonnable pour les répertoires.

Une structure de fichiers très fonctionnelle pour le référentiel de soumission est la suivante :

```
part0
part1
  courseinfo
  unicafe
  anecdotes
part2
  phonebook
  countries
```

Voir cet [exemple de dépôt de soumission](https://github.com/fullstack-hy2020/example-submission-repository) !

Pour chaque partie du cours, il y a un répertoire, qui se ramifie ensuite en sous-répertoires contenant une série d'exercices, comme "unicafe" pour la partie 1.

Pour chaque application web d'une série d'exercices, il est recommandé de soumettre tous les fichiers relatifs à cette application, à l'exception du répertoire <i>node\_modules</i>.

Les exercices sont soumis **une partie à la fois**. Lorsque vous avez soumis les exercices d'une partie du cours, vous ne pouvez plus soumettre d'exercices non terminés pour la même partie.

Notez que dans cette partie, il y a plus d'exercices que ceux trouvés ci-dessous. <i>Ne soumettez pas votre travail</i> tant que vous n'avez pas terminé tous les exercices que vous souhaitez soumettre pour la partie correspondante.
  
 <h4>1.1 : courseinfo, étape 1</h4>

<i>L'application sur laquelle nous allons commencer à travailler dans cet exercice sera développée plus en détail dans quelques-uns des exercices suivants. Dans cette série d'exercices et d'autres à venir dans ce cours, il suffit de soumettre uniquement l'état final de l'application. Si vous le souhaitez, vous pouvez également créer un commit pour chaque exercice de la série, mais cela est facultatif.</i>

Utilisez create-react-app pour initialiser une nouvelle application. Modifiez <i>index.js</i> pour qu'il corresponde à ce qui suit

```js
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

et <i>App.js</i> pour correspondre à l'élément suivant

```js
const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <h1>{course}</h1>
      <p>
        {part1} {exercises1}
      </p>
      <p>
        {part2} {exercises2}
      </p>
      <p>
        {part3} {exercises3}
      </p>
      <p>Number of exercises {exercises1 + exercises2 + exercises3}</p>
    </div>
  )
}

export default App
```

et supprimer les fichiers supplémentaires (App.css, App.test.js, index.css, logo.svg, setupTests.js, reportWebVitals.js).

Malheureusement, toute l'application se trouve dans le même composant. Refactorisez le code afin qu'il se compose de trois nouveaux composants : <i>Header</i>, <i>Content</i> et <i>Total</i>. Toutes les données résident toujours dans le composant <i>App</i>, qui transmet les données nécessaires à chaque composant à l'aide des <i>props</i>. <i>Header</i> se charge de restituer le nom du cours, <i>Content</i> restitue les parties et leur nombre d'exercices et <i>Total</i> restitue le nombre total d'exercices.

Définissez les nouveaux composants dans le fichier <i>App.js</i>.

Le corps du composant <i>App</i> sera approximativement comme suit :

```js
const App = () => {
  // const-definitions

  return (
    <div>
      <Header course={course} />
      <Content ... />
      <Total ... />
    </div>
  )
}
```

**ATTENTION** create-react-app transforme automatiquement le projet en référentiel git, sauf si l'application est créée dans un référentiel déjà existant. Très probablement, vous **ne voulez pas** que le projet devienne un référentiel, alors exécutez la commande _rm -rf .git_ à la racine du projet.

<h4>1.2 : courseinfo, étape 2</h4>

Refactorisez le composant <i>Content</i> afin qu'il n'affiche pas les noms des parties ou leur nombre d'exercices par lui-même. Au lieu de cela, il ne rend que trois composants <i>Part</i> dont chacun rend le nom et le nombre d'exercices d'une partie.

```js
const Content = ... {
  return (
    <div>
      <Part .../>
      <Part .../>
      <Part .../>
    </div>
  )
}
```

Notre application transmet des informations de manière assez primitive pour le moment, car elle est basée sur des variables individuelles. Cette situation va bientôt s'améliorer.

</div>
