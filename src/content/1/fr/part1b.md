---
mainImage: ../../../images/part-1.svg
part: 1
letter: b
lang: fr
---

<div class="content">

Tout au long du cours, nous avons un objectif et un besoin d'apprendre une quantité suffisante de JavaScript en plus du développement Web.

JavaScript a progressé rapidement au cours des dernières années et dans ce cours, nous utilisons les fonctionnalités des versions les plus récentes. Le nom officiel de la norme JavaScript est [ECMAScript](https://en.wikipedia.org/wiki/ECMAScript). À l'heure actuelle, la dernière version est celle publiée en juin 2021 sous le nom [ECMAScript®2021](https://www.ecma-international.org/ecma-262/), également connue sous le nom d'ES12.

Les navigateurs ne prennent pas encore en charge toutes les nouvelles fonctionnalités de JavaScript. De ce fait, une grande partie du code exécuté dans les navigateurs a été <i>transpilé</i> d'une version plus récente de JavaScript vers une version plus ancienne et plus compatible.

Aujourd'hui, la façon la plus populaire de transpiler est d'utiliser [Babel](https://babeljs.io/). La transpilation est automatiquement configurée dans les applications React créées avec create-react-app. Nous reviendrons plus en détail sur la configuration de la transpilation dans la [partie 7](/fr/partie7) de ce cours.

[Node.js](https://nodejs.org/en/) est un environnement d'exécution JavaScript basé sur le moteur JavaScript [Chrome V8](https://developers.google.com/v8/) de Google et fonctionne pratiquement n'importe où - des serveurs aux téléphones mobiles. Entraînons-nous à écrire du JavaScript en utilisant Node. Il est prévu que la version de Node.js installée sur votre machine soit au moins la version <i>16.13.2</i>. Les dernières versions de Node comprennent déjà les dernières versions de JavaScript, le code n'a donc pas besoin d'être transpilé.


Le code est écrit dans des fichiers se terminant par <i>.js</i> qui sont exécutés en émettant la commande <em>node name\_of\_file.js</em>

Il est également possible d'écrire du code JavaScript dans la console Node.js, qui s'ouvre en tapant _node_ dans la ligne de commande, ainsi que dans la console de l'outil de développement du navigateur. [Les dernières révisions de Chrome gèrent assez bien les nouvelles fonctionnalités de JavaScript](http://kangax.github.io/compat-table/es2016plus/) sans transpiler le code. Vous pouvez également utiliser un outil tel que [JS Bin](https://jsbin.com/?js,console).

JavaScript rappelle en quelque sorte, à la fois par son nom et sa syntaxe, Java. Mais en ce qui concerne le mécanisme de base du langage, ils ne pourraient pas être plus différents. Venant d'un arrière-plan Java, le comportement de JavaScript peut sembler un peu étranger, surtout si l'on ne fait pas l'effort de rechercher ses fonctionnalités.

Dans certains cercles, il a également été populaire d'essayer de "simuler" les fonctionnalités Java et les modèles de conception en JavaScript. Nous vous déconseillons de le faire car les langues et les écosystèmes respectifs sont finalement très différents.

### Variables

En JavaScript, il existe plusieurs façons de définir des variables :

```js
const x = 1
let y = 5

console.log(x, y)   // 1, 5 sont affichés
y += 10
console.log(x, y)   // 1, 15 sont affichés
y = 'sometext'
console.log(x, y)   // 1, sometext sont affichés
x = 4               // provoque une erreur
```

[const](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) ne définit pas réellement une variable mais une <i>constante</i> dont la valeur ne pourra plus être modifiée. D'autre part, [let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) définit une variable normale.

Dans l'exemple ci-dessus, nous voyons également que le type des données affectées à la variable peut changer pendant l'exécution. Au début _y_ stocke un entier et à la fin une chaîne.

Il est également possible de définir des variables en JavaScript à l'aide du mot clé [var](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var). var a longtemps été le seul moyen de définir des variables. const et let n'ont été ajoutés que récemment dans la version ES6. Dans des situations spécifiques, var fonctionne différemment des définitions de variables dans la plupart des langages - voir [JavaScript Variables - Should You Use let, var or const? on Medium](https://medium.com/craft-academy/javascript-variables-should-you-use-let-var-or-const-394f7645c88f) ou [Keyword: var vs. let on JS Tips](http ://www.jstips.co/en/javascript/keyword-var-vs-let/) pour plus d'informations. Pendant ce cours, l'utilisation de var est déconseillée et vous devriez vous en tenir à const et let !
Vous pouvez en savoir plus sur ce sujet sur YouTube - par ex. [var, let et const - Fonctionnalités JavaScript ES6](https://youtu.be/sjyJBL5fkp8)

### Tableaux

Un [array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) et quelques exemples d'utilisation :

```js
const t = [1, -1, 3]

t.push(5)

console.log(t.length) // 4 est affiché
console.log(t[1])     // -1 est affiché

t.forEach(value => {
  console.log(value)  // les chiffres 1, -1, 3, 5 sont affichés, chacun sur une ligne
})                    
```

Il convient de noter dans cet exemple le fait que le contenu du tableau peut être modifié même s'il est défini en tant que _const_. Comme le tableau est un objet, la variable pointe toujours vers le même objet. Cependant, le contenu du tableau change à mesure que de nouveaux éléments y sont ajoutés.

Une façon de parcourir les éléments du tableau consiste à utiliser _forEach_ comme indiqué dans l'exemple. _forEach_ reçoit une <i>fonction</i> définie en utilisant la syntaxe des flèches comme paramètre.

```js
value => {
  console.log(value)
}
```

forEach appelle la fonction <i>pour chacun des éléments du tableau</i>, en passant toujours l'élément individuel comme argument. La fonction en tant qu'argument de forEach peut également recevoir [d'autres arguments](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach).

Dans l'exemple précédent, un nouvel élément a été ajouté au tableau à l'aide de la méthode [push](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push). Lors de l'utilisation de React, des techniques de programmation fonctionnelle sont souvent utilisées. L'une des caractéristiques du paradigme de la programmation fonctionnelle est l'utilisation de structures de données [immuables](https://en.wikipedia.org/wiki/Immutable_object). Dans le code React, il est préférable d'utiliser la méthode [concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat), qui n'ajoute pas l'élément au tableau, mais crée un nouveau tableau dans lequel le contenu de l'ancien tableau et le nouvel élément sont tous deux inclus.

```js
const t = [1, -1, 3]

const t2 = t.concat(5)

console.log(t)  // [1, -1, 3] est affiché
console.log(t2) // [1, -1, 3, 5] est affiché
```

L'appel de méthode _t.concat(5)_ n'ajoute pas un nouvel élément à l'ancien tableau mais renvoie un nouveau tableau qui, en plus de contenir les éléments de l'ancien tableau, contient également le nouvel élément.

Il existe de nombreuses méthodes utiles définies pour les tableaux. Examinons un court exemple d'utilisation de la méthode [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map).

```js
const t = [1, 2, 3]

const m1 = t.map(value => value * 2)
console.log(m1)   // [2, 4, 6] est affiché
```

Sur la base de l'ancien tableau, map crée un <i>nouveau tableau</i>, pour lequel la fonction donnée en paramètre est utilisée pour créer les éléments. Pour cet exemple, la valeur d'origine est multipliée par deux.

Map peut également transformer le tableau en quelque chose de complètement différent :

```js
const m2 = t.map(value => '<li>' + value + '</li>')
console.log(m2)  
// [ '<li>1</li>', '<li>2</li>', '<li>3</li>' ] est affiché
```

Ici, un tableau rempli de valeurs entières est transformé en un tableau contenant des chaînes HTML à l'aide de la méthode map. Dans la [partie 2](/en/part2) de ce cours, nous verrons que map est utilisée assez fréquemment dans React.

Les éléments individuels d'un tableau sont faciles à affecter à des variables à l'aide de l'[affectation par déstructuration](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment).

```js
const t = [1, 2, 3, 4, 5]

const [first, second, ...rest] = t

console.log(first, second)  // 1, 2 est affiché
console.log(rest)          // [3, 4, 5] est affiché
```

Grâce à l'affectation, les variables _first_ et _second_ recevront comme valeurs les deux premiers entiers du tableau. Les nombres entiers restants sont "regroupés" dans un tableau qui leur est propre, qui est ensuite affecté à la variable _rest_.

### Objets

Il existe différentes manières de définir des objets en JavaScript. Une méthode très courante consiste à utiliser [object literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#Object_literals), qui se produit en répertoriant ses propriétés entre accolades :

```js
const object1 = {
  name: 'Arto Hellas',
  age: 35,
  education: 'PhD',
}

const object2 = {
  name: 'Full Stack web application development',
  level: 'intermediate studies',
  size: 5,
}

const object3 = {
  name: {
    first: 'Dan',
    last: 'Abramov',
  },
  grades: [2, 3, 5, 3],
  department: 'Stanford University',
}
```

Les valeurs des propriétés peuvent être de n'importe quel type, comme des entiers, des chaînes, des tableaux, des objets...

Les propriétés d'un objet sont référencées en utilisant la notation "point" ou en utilisant des crochets :

```js
console.log(object1.name)         // Arto Hellas est affiché
const fieldName = 'age' 
console.log(object1[fieldName])    // 35 est affiché
```

Vous pouvez également ajouter des propriétés à un objet à la volée en utilisant la notation par points ou les crochets :

```js
object1.address = 'Helsinki'
object1['secret number'] = 12341
```

Le dernier des ajouts doit être fait en utilisant des crochets, car lors de l'utilisation de la notation par points, le <i>numéro secret</i> n'est pas un nom de propriété valide en raison du caractère espace.

Naturellement, les objets en JavaScript peuvent également avoir des méthodes. Cependant, pendant ce cours, nous n'avons pas besoin de définir des objets avec des méthodes qui leur sont propres. C'est pourquoi ils ne sont abordés que brièvement pendant le cours.

Les objets peuvent également être définis à l'aide de fonctions dites constructeurs, ce qui se traduit par un mécanisme rappelant de nombreux autres langages de programmation, par ex. Les classes de Java. Malgré cette similitude, JavaScript n'a pas de classes au même sens que les langages de programmation orientés objet. Il y a eu, cependant, un ajout de la <i>syntaxe de classe</i> à partir de la version ES6, qui dans certains cas aide à structurer les classes orientées objet.

### Les fonctions

Nous nous sommes déjà familiarisés avec la définition des fonctions fléchées. Le processus complet pour définir une fonction flechée est le suivant :

```js
const sum = (p1, p2) => {
  console.log(p1)
  console.log(p2)
  return p1 + p2
}
```

et la fonction est appelée comme on peut s'y attendre :

```js
const result = sum(1, 5)
console.log(result)
```

S'il n'y a qu'un seul paramètre, nous pouvons exclure les parenthèses de la définition :

```js
const square = p => {
  console.log(p)
  return p * p
}
```

Si la fonction ne contient qu'une seule expression, les accolades ne sont pas nécessaires. Dans ce cas, la fonction ne renvoie que le résultat de sa seule expression. Maintenant, si nous supprimons l'impression de la console, nous pouvons encore raccourcir la définition de la fonction :

```js
const square = p => p * p
```

Cette forme est particulièrement pratique lors de la manipulation de tableaux - par ex. lors de l'utilisation de la méthode map :

```js
const t = [1, 2, 3]
const tSquared = t.map(p => p * p)
// tSquared est devenu [1, 4, 9]
```

La fonctionnalité de fonction dléchée a été ajoutée à JavaScript il y a seulement quelques années, avec la version [ES6](http://es6-features.org/). Avant cela, la seule façon de définir des fonctions était d'utiliser le mot-clé _function_.

Il existe deux façons de référencer la fonction ; on donne un nom dans une [déclaration de fonction](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function).

```js
function product(a, b) {
  return a * b
}

const result = product(2, 6)
// result est maintenant 12
```

L'autre façon de définir la fonction consiste à utiliser une [expression de fonction](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/function). Dans ce cas, il n'est pas nécessaire de donner un nom à la fonction et la définition peut résider dans le reste du code :

```js
const average = function(a, b) {
  return (a + b) / 2
}

const result = average(2, 5)
// result est maintenant 3.5
```

Pendant ce cours, nous définirons toutes les fonctions en utilisant la syntaxe des flèches.

</div>

<div class="tasks">
  <h3>Exercices 1.3.-1.5.</h3>

<i>Nous continuons à créer l'application sur laquelle nous avons commencé à travailler dans les exercices précédents. Vous pouvez écrire le code dans le même projet, car nous ne sommes intéressés que par l'état final de l'application soumise.</i>

**Conseil de pro :** vous pouvez rencontrer des problèmes en ce qui concerne la structure des <i>props</i> que les composants reçoivent. Un bon moyen de rendre les choses plus claires est d'afficher les props sur la console, par ex. comme suit:

```js
const Header = (props) => {
  console.log(props) // highlight-line
  return <h1>{props.course}</h1>
}
```

  <h4>1.3 : informations sur le cours étape 3</h4>

Passons à l'utilisation d'objets dans notre application. Modifiez les définitions des variables du composant <i>App</i> comme suit et refactorisez également l'application pour qu'elle fonctionne toujours :

```js
const App = () => {
  const course = 'Half Stack application development'
  const part1 = {
    name: 'Fundamentals of React',
    exercises: 10
  }
  const part2 = {
    name: 'Using props to pass data',
    exercises: 7
  }
  const part3 = {
    name: 'State of a component',
    exercises: 14
  }

  return (
    <div>
      ...
    </div>
  )
}
```

  <h4>1.4 : informations sur le cours étape 4</h4>

Et puis placez les objets dans un tableau. Modifiez les définitions de variable de <i>App</i> sous la forme suivante et modifiez les autres parties de l'application en conséquence :

```js
const App = () => {
  const course = 'Half Stack application development'
  const parts = [
    {
      name: 'Fundamentals of React',
      exercises: 10
    },
    {
      name: 'Using props to pass data',
      exercises: 7
    },
    {
      name: 'State of a component',
      exercises: 14
    }
  ]

  return (
    <div>
      ...
    </div>
  )
}
```

**NB** à ce stade, <i>vous pouvez supposer qu'il y a toujours trois éléments</i>, il n'est donc pas nécessaire de parcourir les tableaux à l'aide de boucles. Nous reviendrons sur le sujet du rendu des composants basés sur des éléments dans des tableaux avec une exploration plus approfondie dans la [prochaine partie du cours](../part2).

Cependant, ne transmettez pas différents objets en tant que props distincts du composant <i>App</i> aux composants <i>Content</i> et <i>Total</i>. Au lieu de cela, transmettez-les directement sous forme de tableau :

```js
const App = () => {
  // const definitions

  return (
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  )
}
```

  <h4>1.5 : informations sur le cours, étape 5</h4>

Poussons les changements un peu plus loin. Modifiez le cours et ses parties en un seul objet JavaScript. Réparez tout ce qui casse.

```js
const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      ...
    </div>
  )
}
```

</div>

<div class="content">

### Object methods and "this"

Due to the fact that during this course we are using a version of React containing React Hooks we have no need for defining objects with methods. **The contents of this chapter are not relevant to the course** but are certainly in many ways good to know. In particular when using older versions of React one must understand the topics of this chapter.

Arrow functions and functions defined using the _function_ keyword vary substantially when it comes to how they behave with respect to the keyword [this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this), which refers to the object itself.

We can assign methods to an object by defining properties that are functions:

```js
const arto = {
  name: 'Arto Hellas',
  age: 35,
  education: 'PhD',
  // highlight-start
  greet: function() {
    console.log('hello, my name is ' + this.name)
  },
  // highlight-end
}

arto.greet()  // "hello, my name is Arto Hellas" gets printed
```

Methods can be assigned to objects even after the creation of the object:

```js
const arto = {
  name: 'Arto Hellas',
  age: 35,
  education: 'PhD',
  greet: function() {
    console.log('hello, my name is ' + this.name)
  },
}

// highlight-start
arto.growOlder = function() {
  this.age += 1
}
// highlight-end

console.log(arto.age)   // 35 est affiché
arto.growOlder()
console.log(arto.age)   // 36 est affiché
```

Let's slightly modify the object:

```js
const arto = {
  name: 'Arto Hellas',
  age: 35,
  education: 'PhD',
  greet: function() {
    console.log('hello, my name is ' + this.name)
  },
  // highlight-start
  doAddition: function(a, b) {
    console.log(a + b)
  },
  // highlight-end
}

arto.doAddition(1, 4)        // 5 est affiché

const referenceToAddition = arto.doAddition
referenceToAddition(10, 15)   // 25 est affiché
```

Now the object has the method _doAddition_ which calculates the sum of numbers given to it as parameters. The method is called in the usual way, using the object <em>arto.doAddition(1, 4)</em> or by storing a <i>method reference</i> in a variable and calling the method through the variable: <em>referenceToAddition(10, 15)</em>.

If we try to do the same with the method _greet_ we run into an issue:

```js
arto.greet()       // "hello, my name is Arto Hellas" gets printed

const referenceToGreet = arto.greet
referenceToGreet() // prints "hello, my name is undefined"
```

When calling the method through a reference, the method loses knowledge of what the original _this_ was. Contrary to other languages, in JavaScript the value of [this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) is defined based on <i>how the method is called</i>. When calling the method through a reference the value of _this_ becomes the so-called [global object](https://developer.mozilla.org/en-US/docs/Glossary/Global_object) and the end result is often not what the software developer had originally intended.

Losing track of _this_ when writing JavaScript code brings forth a few potential issues. Situations often arise where React or Node (or more specifically the JavaScript engine of the web browser) needs to call some method in an object that the developer has defined. However, in this course we avoid these issues by using the "this-less" JavaScript.

One situation leading to the "disappearance" of _this_ arises when we set a timeout to call the _greet_ function on the _arto_ object, using the [setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) function.

```js
const arto = {
  name: 'Arto Hellas',
  greet: function() {
    console.log('hello, my name is ' + this.name)
  },
}

setTimeout(arto.greet, 1000)  // highlight-line
```

As mentioned, the value of _this_ in JavaScript is defined based on how the method is being called. When <em>setTimeout</em> is calling the method, it is the JavaScript engine that actually calls the method and, at that point, _this_ refers to the global object.

There are several mechanisms by which the original _this_ can be preserved. One of these is using a method called [bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind):

```js
setTimeout(arto.greet.bind(arto), 1000)
```

Calling <em>arto.greet.bind(arto)</em> creates a new function where _this_ is bound to point to Arto, independent of where and how the method is being called.

Using [arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) it is possible to solve some of the problems related to _this_. They should not, however, be used as methods for objects because then _this_ does not work at all. We will come back later to the behavior of _this_ in relation to arrow functions.

If you want to gain a better understanding of how _this_ works in JavaScript, the Internet is full of material about the topic, e.g. the screencast series [Understand JavaScript's this Keyword in Depth](https://egghead.io/courses/understand-javascript-s-this-keyword-in-depth) by [egghead.io](https://egghead.io) is highly recommended!

### Classes

As mentioned previously, there is no class mechanism in JavaScript like the ones in object-oriented programming languages. There are, however, features to make "simulating" object-oriented [classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) possible.

Let's take a quick look at the <i>class syntax</i> that was introduced into JavaScript with ES6, which substantially simplifies the definition of classes (or class-like things) in JavaScript.

In the following example we define a "class" called Person and two Person objects:

```js
class Person {
  constructor(name, age) {
    this.name = name
    this.age = age
  }
  greet() {
    console.log('hello, my name is ' + this.name)
  }
}

const adam = new Person('Adam Ondra', 35)
adam.greet()

const janja = new Person('Janja Garnbret', 22)
janja.greet()
```

When it comes to syntax, the classes and the objects created from them are very reminiscent of Java classes and objects. Their behavior is also quite similar to Java objects. At the core they are still objects based on JavaScript's [prototypal inheritance](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Inheritance). The type of both objects is actually _Object_, since JavaScript essentially only defines the types [Boolean, Null, Undefined, Number, String, Symbol, BigInt, and Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures).

The introduction of the class syntax was a controversial addition. Check out [Not Awesome: ES6 Classes](https://github.com/petsel/not-awesome-es6-classes) or [Is “Class” In ES6 The New “Bad” Part? on Medium](https://medium.com/@rajaraodv/is-class-in-es6-the-new-bad-part-6c4e6fe1ee65) for more details.

The ES6 class syntax is used a lot in "old" React and also in Node.js, hence an understanding of it is beneficial even in this course. However, since we are using the new [Hooks](https://reactjs.org/docs/hooks-intro.html) feature of React throughout this course, we have no concrete use for JavaScript's class syntax.

### JavaScript materials

There exist both good and poor guides for JavaScript on the Internet. Most of the links on this page relating to JavaScript features reference [Mozilla's JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript).

It is highly recommended to immediately read [A re-introduction to JavaScript (JS tutorial)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript) on Mozilla's website.

If you wish to get to know JavaScript deeply there is a great free book series on the Internet called [You-Dont-Know-JS](https://github.com/getify/You-Dont-Know-JS).

Another great resource for learning JavaScript is [javascript.info](https://javascript.info).

[egghead.io](https://egghead.io) has plenty of quality screencasts on JavaScript, React, and other interesting topics. Unfortunately, some of the material is behind a paywall.

</div>
