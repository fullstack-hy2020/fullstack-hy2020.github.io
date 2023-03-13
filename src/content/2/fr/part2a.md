---
mainImage: ../../../images/part-2.svg
part: 2
letter: a
lang: fr
---

<div class="content">

Avant de commencer une nouvelle partie, récapitulons quelques-uns des sujets qui se sont avérés difficiles l'année dernière.

### console.log

***Quelle est la différence entre un programmeur JavaScript expérimenté et un débutant ? L'expérimenté utilise console.log 10 à 100 fois plus.***

Paradoxalement, cela semble être vrai même si un programmeur débutant aurait besoin de <i>console.log</i> (ou de toute méthode de débogage) plus qu'un programmeur expérimenté.

Lorsque quelque chose ne fonctionne pas, ne vous contentez pas de deviner ce qui ne va pas. Au lieu de cela, logger ou utilisez un autre moyen de débogage.

**NB** Comme expliqué dans la partie 1, lorsque vous utilisez la commande _console.log_ pour le débogage, ne concaténez pas les choses "à la manière Java" avec un plus. Au lieu d'écrire :

```js
console.log('props value is ' + props)
```

séparez les éléments à afficher par une virgule :

```js
console.log('props value is', props)
```

Si vous concaténez un objet avec une chaîne et que vous le loggez dans la console (comme dans notre premier exemple), le résultat sera plutôt inutile :

```js
props value is [Object object]
```

Au contraire, lorsque vous transmettez des objets en tant qu'arguments distincts séparés par des virgules à _console.log_, comme dans notre deuxième exemple ci-dessus, le contenu de l'objet est affiché sur la console du développeur sous forme de chaînes perspicaces.
Si nécessaire, en savoir plus sur [le débogage des applications React](/fr/part1/plongez_dans_le_debogage_dapplications_react#debogage-des-applications-react).

### Conseil de pro : snippets de code Visual Studio

Avec Visual Studio Code, il est facile de créer des "snippets", c'est-à-dire des raccourcis pour générer rapidement des portions de code couramment réutilisées, un peu comme le fonctionnement de "sout" dans Netbeans.

Les instructions pour créer des snippets sont disponibles [ici](https://code.visualstudio.com/docs/editor/userdefinedsnippets#_creating-your-own-snippets).

Des extraits de code utiles et prêts à l'emploi peuvent également être trouvés sous forme de plugins VS Code, sur le [marketplace](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets).

Le snippet le plus important est celui de la commande <em>console.log()</em>, par exemple, <em>clog</em>. Cela peut être créé comme ceci: 

```js
{
  "console.log": {
    "prefix": "clog",
    "body": [
      "console.log('$1')",
    ],
    "description": "Log output to console"
  }
}
```

Le débogage du code à l'aide de _console.log()_ est si courant que Visual Studio Code intègre ce snippet. Pour l'utiliser, tapez _log_ et appuyez sur l'onglet pour compléter automatiquement. Des extensions d'extraits de code _console.log()_ plus complètes sont disponibles sur le [marketplace](https://marketplace.visualstudio.com/search?term=console.log&target=VSCode&category=All%20categories&sortBy=Relevance).

### Tableaux JavaScript

À partir de maintenant, nous utiliserons les méthodes de programmation fonctionnelle des [tableaux](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) JavaScript , comme _find_ , _filter_ et _map_ - tout le temps. Ils fonctionnent sur les mêmes principes généraux que les flux de Java 8, qui ont été utilisés ces dernières années dans les cours 'Ohjelmoinnin perusteet' et 'Ohjelmoinnin jatkokurssi' du département d'informatique de l'université, ainsi que dans le MOOC de programmation.

Si la programmation fonctionnelle avec des tableaux vous semble étrangère, cela vaut la peine de regarder au moins les trois premières parties de la série de vidéos YouTube [Programmation fonctionnelle en JavaScript](https://www.youtube.com/playlist?list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84) :

- [Higher-order functions](https://www.youtube.com/watch?v=BMUiFMZr7vk&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84)
- [Map](https://www.youtube.com/watch?v=bCqtb-Z5YGQ&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84&index=2)
- [Reduce basics](https://www.youtube.com/watch?v=Wl98eZpkp-c&t=31s)

### Gestionnaires d'événements revisités

Sur la base du cours de l'année dernière, la gestion des événements s'est avérée difficile.

Cela vaut la peine de lire le chapitre de révision à la fin de la partie précédente [gestion d'événements revisitée](/fr/part1/plongez_dans_le_debogage_dapplications_react#gestion-des-evenements-revisitee), si vous pensez que vos propres connaissances sur le sujet ont besoin d'être affinées.
Passer des gestionnaires d'événements aux composants enfants du composant <i>App</i> a soulevé quelques questions. Une petite révision sur le sujet peut être trouvée [ici](/fr/part1/plongez_dans_le_debogage_dapplications_react#passer-vos-events-handlers-aux-composants-enfants).

### Rendu de Collections

Nous allons maintenant faire le "frontend", ou la logique d'application côté navigateur, dans React pour une application similaire à l'exemple d'application de la [partie 0](/fr/part0)

Commençons par ce qui suit (le fichier <i>App.js</i>) :

```js
const App = (props) => {
  const { notes } = props

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        <li>{notes[0].content}</li>
        <li>{notes[1].content}</li>
        <li>{notes[2].content}</li>
      </ul>
    </div>
  )
}

export default App
```

Le fichier <i>index.js</i> ressemble à :

```js
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

const notes = [
  {
    id: 1,
    content: 'HTML is easy',
    date: '2019-05-30T17:30:31.098Z',
    important: true
  },
  {
    id: 2,
    content: 'Browser can execute only JavaScript',
    date: '2019-05-30T18:39:34.091Z',
    important: false
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    date: '2019-05-30T19:20:14.298Z',
    important: true
  }
]

ReactDOM.createRoot(document.getElementById('root')).render(
  <App notes={notes} />
)
```

Chaque note contient son contenu textuel et un horodatage, ainsi qu'une valeur _booléenne_ pour marquer si la note a été classée comme importante ou non, ainsi qu'un <i>id</i> unique.

L'exemple ci-dessus fonctionne car il y a exactement trois notes dans le tableau.

Une seule note est rendue en accédant aux objets du tableau en se référant à un numéro d'index codé en dur :

```js
<li>{notes[1].content}</li>
```

Ce n'est bien sûr pas pratique. Nous pouvons améliorer cela en générant des éléments React à partir des objets du tableau à l'aide de la fonction [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map).

```js
notes.map(note => <li>{note.content}</li>)
```

Le résultat est un tableau d'éléments <i>li</i>.

```js
[
  <li>HTML is easy</li>,
  <li>Browser can execute only JavaScript</li>,
  <li>GET and POST are the most important methods of HTTP protocol</li>,
]
```


Qui peut ensuite être placé à l'intérieur de balises <i>ul</i> :

```js
const App = (props) => {
  const { notes } = props

  return (
    <div>
      <h1>Notes</h1>
// highlight-start
      <ul>
        {notes.map(note => <li>{note.content}</li>)}
      </ul>
// highlight-end      
    </div>
  )
}
```

Étant donné que le code générant les balises <i>li</i> est JavaScript, il doit être entouré d'accolades dans un modèle JSX, comme tout autre code JavaScript.

Nous rendrons également le code plus lisible en séparant la déclaration de la fonction fléchée sur plusieurs lignes :

```js
const App = (props) => {
  const { notes } = props

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
        // highlight-start
          <li>
            {note.content}
          </li>
        // highlight-end   
        )}
      </ul>
    </div>
  )
}
```

### Attribut clé

Même si l'application semble fonctionner, il y a un méchant avertissement dans la console : 

![](../../images/2/1a.png)

Comme le suggère la [page React](https://reactjs.org/docs/lists-and-keys.html#keys) dans le message d'erreur; les éléments de la liste, c'est-à-dire les éléments générés par la méthode _map_, doivent chacun avoir une valeur clé unique : un attribut appelé <i>clé</i>.

Ajoutons les clés :

```js
const App = (props) => {
  const { notes } = props

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <li key={note.id}> // highlight-line
            {note.content}
          </li>
        )}
      </ul>
    </div>
  )
}
```

Et le message d'erreur disparaît.

React utilise les attributs clés des objets dans un tableau pour déterminer comment mettre à jour la vue générée par un composant lorsque le composant est rendu à nouveau. Plus d'informations à ce sujet dans la [documentation React](https://reactjs.org/docs/reconciliation.html#recursing-on-children).

### Map

Comprendre comment la méthode [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) fonctionne est crucial pour le reste du cours.

L'application contient un tableau appelé _notes_ :

```js
const notes = [
  {
    id: 1,
    content: 'HTML is easy',
    date: '2019-05-30T17:30:31.098Z',
    important: true
  },
  {
    id: 2,
    content: 'Browser can execute only JavaScript',
    date: '2019-05-30T18:39:34.091Z',
    important: false
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    date: '2019-05-30T19:20:14.298Z',
    important: true
  }
]
```

Arrêtons-nous un instant et examinons comment fonctionne _map_.


Si le code suivant est ajouté, disons, à la fin du fichier :

```js
const result = notes.map(note => note.id)
console.log(result)
```

<i>[1, 2, 3]</i> sera imprimé sur la console.
  _map_ crée toujours un nouveau tableau dont les éléments ont été créés à partir des éléments du tableau d'origine par <i>mappage</i> : en utilisant la fonction donnée en paramètre à la méthode _map_.


La fonction est

```js
note => note.id
```

Qui est une fonction fléchée écrite sous forme compacte. La forme complete serait :

```js
(note) => {
  return note.id
}
```

La fonction a comme paramètre un objet note et <i>renvoie</i> la valeur de son champ <i>id</i>.

Changer la commande en :

```js
const result = notes.map(note => note.content)
```

donne un tableau contenant le contenu des notes.

C'est déjà assez proche du code React que nous avons utilisé :

```js
notes.map(note =>
  <li key={note.id}>{note.content}</li>
)
```

qui génère une balise <i>li</i> contenant le contenu de la note de chaque objet note.

Parce que le paramètre de fonction passé à la méthode _map_ -

```js
note => <li key={note.id}>{note.content}</li>
```

&nbsp;- est utilisé pour créer des éléments de vue, la valeur de la variable doit être rendue entre accolades. Essayez de voir ce qui se passe si les accolades sont retirées.

L'utilisation d'accolades vous causera quelques douleurs au début, mais vous vous y habituerez assez tôt. Le retour visuel de React est immédiat.

### Anti-pattern: index de tableau en tant que clés

Nous aurions pu faire disparaître le message d'erreur sur notre console en utilisant les index du tableau comme clés. Les index peuvent être récupérés en passant un second paramètre à la fonction callback de la _map_ method: 

```js
notes.map((note, i) => ...)
```

Lorsqu'il est appelé ainsi, _i_ reçoit la valeur de l'index de la position dans le tableau où réside la note.

En tant que tel, une façon de définir la génération de lignes sans obtenir d'erreurs est :

```js
<ul>
  {notes.map((note, i) => 
    <li key={i}>
      {note.content}
    </li>
  )}
</ul>
```

Ceci est cependant, **non recommandé** et peut créer des problèmes indésirables même s'il semble fonctionner correctement.

En savoir plus à ce sujet dans [cet article](https://robinpokorny.medium.com/index-as-a-key-is-an-anti-pattern-e0349aece318).

### Refactoring de Modules

Changeons un peu le code. Nous ne sommes intéressés que par le champ _notes_ des props, alors récupérons cela directement en utilisant la [déstructuration](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) :

```js
const App = ({ notes }) => { //highlight-line
  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <li key={note.id}>
            {note.content}
          </li>
        )}
      </ul>
    </div>
  )
}
```

Si vous avez oublié ce que signifie la déstructuration et comment cela fonctionne, veuillez consulter la [section associée](/fr/part1/etat_des_composants_gestionnaires_devenements#destructuration).

Nous séparerons l'affichage d'une seule note dans son propre composant <i>Note</i> :

```js
// highlight-start
const Note = ({ note }) => {
  return (
    <li>{note.content}</li>
  )
}
// highlight-end

const App = ({ notes }) => {
  return (
    <div>
      <h1>Notes</h1>
      <ul>
        // highlight-start
        {notes.map(note => 
          <Note key={note.id} note={note} />
        )}
         // highlight-end
      </ul>
    </div>
  )
}
```

Notez que l'attribut <i>key</i> doit maintenant être défini pour les composants <i>Note</i>, et non pour les balises <i>li</i> comme auparavant.

Une application React entière peut être écrite dans un seul fichier. Même si ce n'est bien sûr pas très pratique. La pratique courante consiste à déclarer chaque composant dans son propre fichier en tant que <i>module ES6</i>.

Nous avons utilisé des modules tout le temps. Les premières lignes du fichier <i>index.js</i> :

```js
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'
```

[importent](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) trois modules, nous permettant de les utiliser dans ce fichier. Le module <i>React</i> est placé dans la variable _React_, le module <i>react-dom</i> dans la variable _ReactDOM_, et le module qui définit le composant principal de l'application est placé dans la variable _Application_

Déplaçons notre composant <i>Note</i> dans son propre module.

Dans les petites applications, les composants sont généralement placés dans un répertoire appelé <i>components</i>, qui est à son tour placé dans le répertoire <i>src</i>. La convention est de nommer le fichier d'après le composant.

Maintenant, nous allons créer un répertoire appelé <i>components</i> pour notre application et y placer un fichier nommé <i>Note.js</i>.
Le contenu du fichier Note.js est le suivant :

```js
import React from 'react'

const Note = ({ note }) => {
  return (
    <li>{note.content}</li>
  )
}

export default Note
```

La dernière ligne du module [exporte](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) le module déclaré, la variable <i>Note</i> .

Maintenant, le fichier qui utilise le composant - <i>App.js</i> - peut [importer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import ) le module :

```js
import Note from './components/Note' // highlight-line

const App = ({ notes }) => {
  // ...
}
```

Le composant exporté par le module est maintenant disponible pour être utilisé dans la variable <i>Note</i>, comme il l'était auparavant.

Notez que lors de l'importation de nos propres composants, leur emplacement doit être indiqué.

```js
'./components/Note'
```

Le point - <i>.</i> - au début fait référence au répertoire courant, donc l'emplacement du module est un fichier appelé <i>Note.js</i> dans le sous répertoire <i>components</i> du répertoire courant. L'extension du fichier _.js_ peut être omise.

Les modules ont de nombreuses autres utilisations que de permettre aux déclarations de composants d'être séparées dans leurs propres fichiers. Nous y reviendrons plus tard dans ce cours.

Le code actuel de l'application peut être trouvé sur [GitHub](https://github.com/fullstack-hy2020/part2-notes/tree/part2-1).

Notez que la branche <i>main</i> du référentiel contient le code d'une version ultérieure de l'application. Le code actuel se trouve sur la branche [part2-1](https://github.com/fullstack-hy2020/part2-notes/tree/part2-1) :

![](../../images/2/2e.png)

Si vous clonez le projet, exécutez la commande _npm install_ avant de démarrer l'application avec _npm start_.

### Lorsque l'application crashe

Au début de votre carrière de programmeur (et même après 30 ans de codage comme le vôtre vraiment), ce qui arrive souvent, c'est que l'application tombe complètement en panne. C'est encore plus le cas avec les langages à typage dynamique, comme JavaScript, où le compilateur ne vérifie pas le type de données. Par exemple, des variables de fonction ou des valeurs de retour.

Une "explosion React" peut, par exemple, ressembler à ceci :

![](../../images/2/3b.png)

Dans ces situations, votre meilleure solution reste la méthode <em>console.log</em>.

Le morceau de code à l'origine de l'explosion est celui-ci :

```js
const Course = ({ course }) => (
  <div>
    <Header course={course} />
  </div>
)

const App = () => {
  const course = {
    // ...
  }

  return (
    <div>
      <Course course={course} />
    </div>
  )
}
```

Nous allons rechercher la raison de la panne en ajoutant des commandes <em>console.log</em> au code. Étant donné que la première chose à rendre est le composant <i>App</i>, cela vaut la peine d'y mettre le premier <em>console.log</em> :

```js
const App = () => {
  const course = {
    // ...
  }

  console.log('App works...') // highlight-line

  return (
    // ..
  )
}
```

Pour voir l'impression dans la console, il faut faire défiler vers le haut le long fil rouge des erreurs.

![](../../images/2/4b.png)

Lorsqu'une chose fonctionne, il faut aller chercher le problème en profondeur. Si le composant a été déclaré en tant qu'instruction unique ou en tant que fonction sans retour, cela rend l'impression sur la console plus difficile.

```js
const Course = ({ course }) => (
  <div>
    <Header course={course} />
  </div>
)
```

Le composant doit être remplacé par sa forme plus longue afin que nous puissions ajouter le retour sur console:

```js
const Course = ({ course }) => { 
  console.log(course) // highlight-line
  return (
    <div>
      <Header course={course} />
    </div>
  )
}
```

Très souvent, la racine du problème est que les props sont censés être d'un type différent, ou appelés avec un nom différent de ce qu'ils sont réellement, et la déstructuration échoue en conséquences. Le problème commence souvent à se résoudre de lui-même lorsque la déstructuration est supprimée et que nous voyons ce que les <em>props</em> contiennent réellement.

```js
const Course = (props) => { // highlight-line
  console.log(props)  // highlight-line
  const { course } = props
  return (
    <div>
      <Header course={course} />
    </div>
  )
}
```

Si le problème n'a toujours pas été résolu, il n'y a vraiment pas grand-chose à faire à part continuer à chasser les bogues en saupoudrant plus d'instructions _console.log_ autour de votre code.

J'ai ajouté ce chapitre au cours après que le modèle de réponse à la question suivante ait complètement explosé (car les props étaient du mauvais type), et j'ai dû le déboguer en utilisant <em>console.log</em>.

</div>

<div class="tasks">

<h3>Exercices 2.1.-2.5.</h3>

Les exercices sont soumis via GitHub, et en marquant les exercices comme effectués dans le [système de soumission](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

Vous pouvez soumettre tous les exercices dans le même référentiel ou utiliser plusieurs référentiels différents. Si vous soumettez des exercices de différentes parties dans le même référentiel, nommez bien vos répertoires.

Les exercices sont soumis **Une partie à la fois**. Lorsque vous avez soumis les exercices d'une partie, vous ne pouvez plus soumettre d'exercices manqués pour cette partie.

Notez que cette partie contient plus d'exercices que les précédentes, donc <i>ne soumettez pas</i> avant d'avoir fait tous les exercices de cette partie que vous souhaitez soumettre.

**ATTENTION** create-react-app transforme automatiquement le projet en un référentiel git, si le projet n'est pas créé à l'intérieur d'un référentiel déjà existant. Vous **ne voulez probablement pas** que le projet devienne un référentiel, alors exécutez la commande _rm -rf .git_ depuis sa racine.

<h4>2.1: courseinfo étape6</h4>

Terminons le code pour le rendu du contenu du cours des exercices 1.1 à 1.5. Vous pouvez commencer le code avec le modèle de réponse. Ces modèles pour la partie 1 peuvent être trouvés en allant sur le [système de soumission](https://studies.cs.helsinki.fi/stats/courses/fullstackopen), cliquez sur <i>mes soumissions</i> en haut, et dans la ligne correspondant à la partie 1 sous la colonne <i>solutions</i> cliquez sur <i>afficher</i>. Pour voir la solution de l'exercice <i>informations sur le cours</i>, cliquez sur _index.js_ sous <i>kurssitiedot</i> ("kurssitiedot" signifie "informations sur le cours").

**Notez que si vous copiez un projet d'un endroit à un autre, vous devrez peut-être supprimer le répertoire <i>node\_modules</i> et réinstaller les dépendances avec la commande _npm install_ avant de pouvoir démarrer l'application.**
Généralement, il n'est pas recommandé de copier tout le contenu d'un projet et/ou d'ajouter le répertoire <i>node\_modules</i> au système de contrôle de version.

Modifions le composant <i>App</i> comme suit : 

```js
const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ]
  }

  return <Course course={course} />
}

export default App
```

Définissez un composant responsable de la mise en forme d'un seul cours appelé <i>Course</i>.

La structure des composants de l'application peut être, par exemple, la suivante :

<pre>
App
  Course
    Header
    Content
      Part
      Part
      ...
</pre>

Par conséquent, le composant <i>Course</i> contient les composants définis dans la partie précédente, qui sont responsables du rendu du nom du cours et de ses parties.

La page rendue peut, par exemple, ressembler à ceci : 

![](../../images/teht/8e.png)

Vous n'avez pas encore besoin de la somme des exercices.

L'application doit fonctionner <i>quel que soit le nombre de parties d'un cours</i>, alors assurez-vous que l'application fonctionne si vous ajoutez ou supprimez des parties d'un cours.

Assurez-vous que la console n'affiche aucune erreur !

<h4>2.2: courseinfo étape7</h4>

Afficher aussi la somme des exercices du cours.

![](../../images/teht/9e.png)

<h4>2.3*: courseinfo étape8</h4>

Si vous ne l'avez pas déjà fait, calculez la somme des exercices avec la méthode array [reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce).

**Conseil de pro :** lorsque votre code ressemble à ceci :

```js
const total = 
  parts.reduce((s, p) => someMagicHere)
```
  
et ne fonctionne pas, cela vaut la peine d'utiliser <i>console.log</i>, qui nécessite que la fonction fléchée soit écrite dans sa forme plus longue :

```js
const total = parts.reduce((s, p) => {
  console.log('what is happening', s, p)
  return someMagicHere 
})
```
 
**Ca ne fonctionne pas? :** Utilisez votre moteur de recherche pour rechercher comment reduce est utilisé dans un **Array**.

**Conseil de pro 2 :** Il existe un [plugin pour VS Code](https://marketplace.visualstudio.com/items?itemName=cmstead.js-codeformer) qui transforme automatiquement les fonctions fléchée de forme courte en leur forme plus longue, et vice versa.

![](../../images/2/5b.png)

<h4>2.4: courseinfo étape9</h4>


Étendons notre application pour permettre un <i>nombre arbitraire</i> de cours :

```js
const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return (
    <div>
      // ...
    </div>
  )
}
```

L'application peut, par exemple, ressembler à ceci :

![](../../images/teht/10e.png)

<h4>2.5: separation des modules</h4>

Déclarez le composant <i>Course</i> en tant que module séparé, qui est importé par le composant <i>App</i>. Vous pouvez inclure tous les sous-composants du cours dans le même module.

</div>
