---
mainImage: ../../../images/part-1.svg
part: 1
letter: a
lang: fr
---

<div class="content">

Nous allons maintenant commencer à nous familiariser avec probablement le sujet le plus important de ce cours, à savoir la bibliothèque [React](https://react.dev/). Commençons par créer une application React simple et découvrir les concepts de base de React.

Le moyen le plus simple de commencer de loin est d'utiliser un outil appelé [Vite](https://vitejs.dev/).

Nous allons créer une application appelée <i>part1</i>, accédons à son répertoire et installons les bibliothèques :

```bash
# npm 6.x (obsolète, mais encore utilisé par certains) :
npm create vite@latest part1 --template react

# npm 7+, un double tiret supplémentaire est nécessaire :
npm create vite@latest part1 -- --template react
```
```bash
cd part1
npm install
```
L'application est exécutée comme suit

```bash
npm run dev
```

Le terminal affiche que l'application a démarré sur le port localhost 5173, c'est-à-dire à l'adresse <http://localhost:5173/> :

![Image](../../images/1/1-vite1.png)

Par défaut, Vite démarre l'application sur le port 5173. Si ce port n'est pas disponible, Vite utilisera le numéro de port suivant disponible.

Ouvrez le navigateur et un éditeur de texte pour pouvoir afficher le code ainsi que la page Web en même temps à l'écran :

![Image](../../images/1/1-vite4.png)

Le code de l'application se trouve dans le dossier <i>src</i>. Simplifions le code par défaut de telle sorte que le contenu du fichier <i>main.jsx</i> ressemble à ceci :

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

Les fichiers <i>App.css</i> et <i>index.css</i>, ainsi que le répertoire <i>assets</i>, peuvent être supprimés car ils ne sont pas nécessaires dans notre application pour le moment.

### create-react-app
Au lieu de Vite, vous pouvez également utiliser l'outil de la génération précédente create-react-app dans le cours pour configurer les applications. La différence la plus visible par rapport à Vite est le nom du fichier de démarrage de l'application, qui est <i>index.js</i>.

La manière de démarrer l'application est également différente dans CRA, elle est lancée avec la commande

```bash
npm start
```
contrairement à Vite qui utilise

```bash
npm run dev
```
Le cours est actuellement (11 août 2023) en cours de mise à jour pour utiliser Vite. Certaines marques peuvent toujours utiliser la base d'application créée avec create-react-app.

### Composant

Le fichier <i>App.js</i> définit maintenant un [composant React](https://reactjs.org/docs/components-and-props.html) avec le nom <i>App</i>. La commande sur la dernière ligne du fichier <i>index.js</i>

```js
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

rend son contenu dans l'élément <i>div</i>, défini dans le fichier <i>public/index.html</i>, ayant la valeur <i>id</i> 'root'.

Par défaut, le fichier <i>index.html</i> ne contient aucune balise HTML visible pour nous dans le navigateur :

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

```
Vous pouvez essayer d'ajouter du HTML dans le fichier. Cependant, lors de l'utilisation de React, tout le contenu qui doit être rendu est généralement défini sous forme de composants React.

Jetons un coup d'oeil plus attentif au code qui définit le composant :

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

La fonction définissant le composant peut contenir n'importe quel type de code JavaScript. Modifiez votre composant pour qu'il soit comme suit

```js
const App = () => {
  console.log('Hello from component')
  return (
    <div>
      <p>Hello world</p>
    </div>
  )
}
export default App
```

et observez ce qui se passe dans la console :

![console du navigateur affichant la console avec une flèche pointant vers "Hello from component"](../../images/1/30.png)

La première règle du développement web côté client :

> <i>gardez la console ouverte en permanence</i>

Répétons ceci ensemble : <i>je promets de garder la console ouverte en permanence</i> pendant ce cours, et pour le reste de ma vie lorsque je fais du développement web.

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

Notez que vous ne devez pas supprimer la ligne en bas du composant

```js
export default App
```

L'exportation n'est pas affichée dans la plupart des exemples du matériel du cours. Sans l'exportation, le composant et toute l'application ne fonctionnent pas.

Vous souvenez-vous de votre promesse de garder la console ouverte ? Qu'y a-t-il été imprimé ?

### JSX

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

La compilation est gérée par [Babel](https://babeljs.io/repl/). Les projets créés avec *create-react-app* ou *vite* sont configurés pour se compiler automatiquement. Nous en apprendrons plus sur ce sujet dans la [partie 7](/en/part7) de ce cours.

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

Modifions le fichier <i>App.jsx</i> comme suit :

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

**NB**: L'exportation (<em>export</em>) à la fin est omise dans ces <i>exemples</i>, maintenant et à l'avenir. Elle est toujours nécessaire pour que le code fonctionne.

Écrire des composants avec React est facile, et en combinant des composants, même une application plus complexe peut rester assez maintenable. En effet, une philosophie centrale de React est de composer des applications à partir de nombreux composants spécialisés réutilisables.

Une autre forte convention est l'idée d'un composant racine appelé <i>App</i> en haut de l'arborescence de composants de l'application. Néanmoins, comme nous le verrons dans [partie 6](/en/part6), il y a des situations où le composant <i>App</i> n'est pas exactement la racine, mais il est enveloppé dans un composant utilitaire approprié.

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

Le composant <i>Hello</i> enregistre également la valeur de l'objet props dans la console.

J'espère vraiment que votre console était ouverte. Si ce n'était pas le cas, souvenez-vous de ce que vous avez promis :

> <i>Je promets de garder la console ouverte en permanence pendant ce cours, et pour le reste de ma vie lorsque je fais du développement web.</i>

Le développement de logiciels est difficile. Cela devient encore plus difficile si l'on n'utilise pas tous les outils disponibles, tels que la console web et l'impression de débogage avec _console.log_. Les professionnels utilisent les deux <i>tout le temps</i>, et il n'y a aucune raison pour qu'un débutant n'adopte pas l'utilisation de ces merveilleuses méthodes d'aide qui faciliteront grandement la vie.

### Message d'erreur possible

Selon l'éditeur que vous utilisez, vous pouvez recevoir le message d'erreur suivant à ce stade :

![Capture d'écran de l'erreur eslint](../../images/1/1-vite5.png)

Il ne s'agit pas réellement d'une erreur, mais d'un avertissement généré par l'outil [ESLint](https://eslint.org/). Vous pouvez supprimer l'avertissement [react/prop-types](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/prop-types.md) en ajoutant à votre fichier <i>.eslintrc .cjs</i> la ligne suivante :

```js
module.exports = {
   root: true,
   env: { browser: true, es2020: true },
   extends: [
     'eslint:recommended',
     'plugin:react/recommended',
     'plugin:react/jsx-runtime',
     'plugin:react-hooks/recommended',
   ],
   ignorePatterns: ['dist', '.eslintrc.cjs'],
   parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
   settings: { react: { version: '18.2' } },
   plugins: ['react-refresh'],
   rules: {
     'react-refresh/only-export-components': [
       'warn',
       { allowConstantExport: true },
     ],
     'react/prop-types': 0 // highlight-line
   },
}
```

Nous en apprendrons davantage sur ESLint en détail dans [la partie 3](/osa3/validointi_ja_es_lint#lint).


### Quelques notes

React a été configuré pour générer des messages d'erreur assez clairs. Malgré cela, vous devriez, du moins au début, avancer par **de très petits pas** et vous assurer que chaque modification fonctionne comme prévu.

**La console doit toujours être ouverte**. Si le navigateur signale des erreurs, il n'est pas recommandé de continuer à écrire du code en espérant des miracles. Vous devriez plutôt essayer de comprendre la cause de l'erreur et, par exemple, revenir à l'état précédent qui fonctionnait :

![Capture d'écran de l'erreur de propriété non définie](../../images/1/1-vite6.png)

Comme nous l'avons déjà mentionné, lors de la programmation avec React, il est possible et utile d'écrire des commandes <em>console.log()</em> (qui affichent des messages dans la console) dans votre code.

De plus, gardez à l'esprit que **la première lettre des noms de composants React doit être en majuscule**. Si vous essayez de définir un composant comme suit :

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

Le résultat est un message d'erreur.

![Capture d'écran de l'erreur de plusieurs éléments racine](../../images/1/1-vite7.png)

L'utilisation d'un élément racine n'est pas la seule option de travail. Un <i>tableau</i> de composants est également une solution valide :

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

### Ne pas rendre d'objets

Considérez une application qui affiche les noms et les âges de nos amis à l'écran :

```js
const App = () => {
  const friends = [
    { name: 'Peter', age: 4 },
    { name: 'Maya', age: 10 },
  ]

  return (
    <div>
      <p>{friends[0]}</p>
      <p>{friends[1]}</p>
    </div>
  )
}

export default App
```

Cependant, rien n'apparaît à l'écran. J'ai essayé de trouver un problème dans le code pendant 15 minutes, mais je n'arrive pas à comprendre où pourrait se trouver le problème.

Je me souviens enfin de la promesse que nous avons faite :

> <i>Je promets de laisser la console ouverte en permanence pendant ce cours, et pour le reste de ma vie lorsque je fais du développement web</i>

La console s'affiche en rouge :

![Outils de développement affichant une erreur avec une mise en évidence autour de "Les objets ne sont pas valides en tant qu'enfant React"](../../images/1/34new.png)

Le coeur du problème est que <i>les objets ne sont pas valides en tant qu'enfant React</i>, c'est-à-dire que l'application tente de rendre des <i>objets</i> et échoue.

Le code tente de rendre les informations d'un ami comme suit

```js
<p>{friends[0]}</p>
```

et cela pose problème car l'élément à rendre entre les accolades est un objet.

```js
{ name: 'Peter', age: 4 }
```

En React, les éléments individuels rendus entre accolades doivent être des valeurs primitives, telles que des nombres ou des chaînes.

La correction est la suivante

```js
const App = () => {
  const friends = [
    { name: 'Peter', age: 4 },
    { name: 'Maya', age: 10 },
  ]

  return (
    <div>
      <p>{friends[0].name} {friends[0].age}</p>
      <p>{friends[1].name} {friends[1].age}</p>
    </div>
  )
}

export default App
```

Maintenant, le nom de l'ami est rendu séparément entre les accolades

```js
{friends[0].name}
```

et l'âge

```js
{friends[0].age}
```

Après avoir corrigé l'erreur, vous devriez effacer les messages d'erreur de la console en appuyant sur 🚫, puis recharger le contenu de la page et vous assurer qu'aucun message d'erreur n'apparaît.

Une petite note supplémentaire par rapport à la précédente. React permet également de rendre des tableaux <i>si</i> le tableau contient des valeurs éligibles pour le rendu (telles que des nombres ou des chaînes). Ainsi, le programme suivant fonctionnerait, bien que le résultat ne soit peut-être pas celui que nous souhaitons :

```js
const App = () => {
  const friends = [ 'Peter', 'Maya']

  return (
    <div>
      <p>{friends}</p>
    </div>
  )
}
```

Dans cette partie, il n'est même pas utile d'essayer d'utiliser le rendu direct des tableaux, nous y reviendrons dans la prochaine partie.

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
