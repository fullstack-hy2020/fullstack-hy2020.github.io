---
mainImage: ../../images/part-1.svg
part: 1
letter: b
lang: en
---

<div class="content">

During the course, along with web development, we have a goal and need to learn a sufficient amount of Javascript.

Javascript has advanced rapidly the last few years, and on this course, we are using features from the newer versions. The official name of the Javascript standard is [ECMAScript](https://en.wikipedia.org/wiki/ECMAScript). At this moment, the latest version is the one released in June of 2017 with the name [ES9](https://www.ecma-international.org/ecma-262/9.0/index.html), otherwise known as ECMAScript 2018.

Browsers do not yet support all of Javascript's newest features. Due to this fact, a lot of code run in browsers has been <i>transpiled</i> from a newer version of Javascript to an older, more compatible version.

Today, the most popular way to do the transpiling is using [Babel](https://babeljs.io/). Transpilation is automatically configured in React applications created with create-react-app. We will take a closer look at the configuration of the transpilation in [part 7](/part7) of this course.

[Node.js](https://nodejs.org/en/) is a Javascript runtime environment based on Google's [chrome V8](https://developers.google.com/v8/) Javascript engine and works practically anywhere from servers to mobile phones. Let's practice writing some Javascript using Node. It is expected that the version of Node.js installed on your machine is at least version <i>v8.10.0</i>. The latest verisons of Node already understand the latest versions of Javascript, so the code does not need to be transpiled.

The code is written into files ending with <i>.js</i> and are run by issuing the command <em>node name_of_file.js</em>

It is also possible to write Javascript code into the Node.js console, which is opened by typing _node_ in the command-line, as well as into the browser's developer tool console. The newest revisions of Chrome handle the newer features of Javascript [pretty well](http://kangax.github.io/compat-table/es2016plus/) without transpiling the code.

Javascript is sort of reminiscent both in name and syntax to Java. But when it comes to core mechanism of the language they could not be more different. Coming from a Java background the behavior of Javascript can seem a bit alien, especially if one cannot bother to look up the features of the language.

In certain circles it has also been popular to attempt "simulating" Java features and design patterns in Javascript. We do not recommend doing this.

### Variables

In Javascript there are a few way to go about defining variables:

```js
const x = 1
let y = 5

console.log(x, y)   // tulostuu 1, 5
y += 10
console.log(x, y)   // tulostuu 1, 15
y = 'teksti'
console.log(x, y)   // tulostuu 1, teksti
x = 4               // aiheuttaa virheen
```

[const](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) does not actually define a variable but a <i>constant</i> for which the value can no longer be changed. On the other hand [let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) defines a normal variable.

In the example, we also see that the type of the data assigned to the variable can change during execution. At the start _y_ stores an integer and at the end a string.

It is also possible to define variables in Javascript using the keyword [var](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var). Var was for a long time the only way to define variables. Const and let were only recently added in version ES6. In specific situations, var works in a [different](https://medium.com/craft-academy/javascript-variables-should-you-use-let-var-or-const-394f7645c88f) [way](http://www.jstips.co/en/javascript/keyword-var-vs-let/) compared to variable definitions in most languages. During this course the use of var is ill advised and you should stick with using const and let!

You can find more on this topic on e.g. YouTube - [var, let and const - ES6 JavaScript Features](https://youtu.be/sjyJBL5fkp8)

### Arrays

An [array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) and a couple of examples of its use

```js
const t = [1, -1, 3]

t.push(5)

console.log(t.length) // tulostuu 4
console.log(t[1])     // tulostuu -1

t.forEach(value => {
  console.log(value)  // tulostuu 1, -1, 3, 5 omille riveilleen
})                    
```

Notable in this example is the fact that the contents of the array can be modified even though it is defined as a _const_. Because the array is an object the variable always points to the same object. The content of the array changes as new items are added to it.

One way of iterating through the items of the array is using _forEach_ as seen in the example. _forEach_ receives a <i>function</i> defined using the arrow syntax as a parameter.

```js
value => {
  console.log(value)
}
```

forEach calls the function <i>for each of the items in the array</i> always passing the individual item as a parameter. The function as the parameter of forEach may also receive [other parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach).

In the previous example, a new item was added to the array using the method [push](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push). When using React, techniques from functional programming are often used. One characteristic of the functional programming paradigm is the use of [immutable](https://en.wikipedia.org/wiki/Immutable_object) data structures. In React code, it is preferable to use the method [concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat), which does not add the item to the array, but creates a new array in which the content of the old array and the new item are both included.

```js
const t = [1, -1, 3]

const t2 = t.concat(5)

console.log(t)  // tulostuu [1, -1, 3]
console.log(t2) // tulostuu [1, -1, 3, 5]
```

The method call _t.concat(5)_ does not add a new item to the old array, but returns a new array, which besides containing the items of the old array also contains the new item.

There are plenty of useful methods defined for arrays. Let's look at a short example of using the [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) method.

```js
const t = [1, 2, 3]

const m1 = t.map(value => value * 2)
console.log(m1)   // tulostuu [2, 4, 6]
```

Based on the old array, map creates a <i>new array</i>, for which the function given as a parameter is used to create the items. In the case of this example, the original value is multiplied by two.

Map can also transform the array into something completely different:

```js
const m2 = t.map(value => '<li>' + value + '</li>')
console.log(m2)  
// tulostuu [ '<li>1</li>', '<li>2</li>', '<li>3</li>' ]
```

Here an array filled with integer values is transformed into an array containing HTML using the map method. In [part2](/part2) of this course, we will see that map is used quite frequently in React.

Individual items of an array are easy to assign to variables with the help of [destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment).

```js
const t = [1, 2, 3, 4, 5]

const [first, second, ...rest] = t

console.log(first, second)  // tulostuu 1, 2
console.log(rest)           // tulostuu [3, 4 ,5]
```

Thanks to the assignment the variables _first_ and _second_ will receive the first two integers of the array as their values. The remaining integers are "collected" into an array of their own, which is then assigned to the variable _rest_.

### Objects

There are a few different ways of defining objects in Javascript. One very common method is using [object literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#Object_literals), which happens by listing its properties within braces:

```js
const object1 = {
  name: 'Arto Hellas',
  age: 35,
  education: 'Filosofian tohtori',
}

const object12 = {
  name: 'Full Stack -websovelluskehitys',
  level: 'aineopinto',
  size: 5,
}

const object3 = {
  name: {
    first: 'Juha',
    last: 'Tauriainen',
  },
  grades: [2, 3, 5, 3],
  department: 'TKTL',
}
```

The values of the properties can be of any type, like integers, strings, arrays, objects...

The properties of an object are referenced by using the "dot" notation, or using brackets:

```js
console.log(object1.name)         // tulostuu Arto Hellas
const fieldName = 'age' 
console.log(object1[fieldName])   // tulostuu 35
```

You can also add properties to an object on the fly by either using dot notation or using brackets:

```js
object1.address = 'Tapiola'
object1['secred number'] = 12341
```

The latter of the additions has to be done by using brackets, because when using dot notation, <i>secred number</i> is not a valid property name.

Naturally, objects in Javascript can also have methods. However, during this course we do not need to define any objects with methods of their own. This is why they are only discussed briefly during the course.

Objects can also be defined using so-called constructor functions, which results in a mechanism reminiscent of many other programming languages', e.g. Java's classes. Despite this similarity Javascript does not have classes in the same sense as object oriented programming languages. There has been, however, an addition of the <i>class syntax</i> starting from version ES6, which in some cases helps structure object oriented classes.

### Functions

We have already become familiar with defining arrow functions. The complete process, without cutting corners, to defining an arrow function is as follows 

```js
const sum = (p1, p2) => {
  console.log(p1)
  console.log(p2)
  return p1 + p2
}
```

and the function is called as can be expected

```js
const result = sum(1, 5)
console.log(result)
```

If there is just a single parameter, we can exclude the parentheses from the definition:

```js
const square = p => {
  console.log(p)
  return p * p
}
```

If the function only contains a single expression, then the braces are not needed. In this case, the function only returns the result of its only expression. Now if we remove console printing, we can further shorten the function definition:

```js
const square = p => p * p
```

This form is particularly handy when manipulating arrays, e.g using the map method:

```js
const t = [1, 2, 3]
const tSquared = t.map(p => p * p)
// tSquared is now [1, 4, 9]
```

The arrow function was added to Javascript only a couple of years ago along with version [ES6](http://es6-features.org/). Prior to this the only way to define functions was by using the keyword _function_.

There are two ways, one of which is giving a name in a [function declaration](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function), by which the function can be referenced.

```js
function product(a, b) {
  return a * b
}

const vastaus = product(2, 6)
```

The other way to define the function is using a [function expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/function). In this case, there is no need to give the function a name, and the definition may reside among the rest of the code:

```js
const average = function(a, b) {
  return (a + b) / 2
}

const vastaus = average(2, 5)
```

During this course we will define all functions using the arrow syntax.

</div>

<div class="tasks">
  <h3>Exercises</h3>

<i>We continue building the application that we started working on in the previous exercises. You can write the code into the same project, since we are only interested in the final state of the submitted application.</i>

**Pro-tip:** you may run into issues when it comes to the structure of the <i>props</i> that components receive. A good way to make thing more clear is by printing the props to the console, e.g. as follows:

```js
const Header = (props) => {
  console.log(props) // highlight-line
  return <h1>{props.course}</h1>
}
```

  <h4>1.3: course information step3</h4>

Let's move forward to using objects in our application. Modify the variable definitions of the <i>App</i> component as follows and also refactor the application so that it still works:

```js
const App = () => {
  const course = 'Half Stack -sovelluskehitys'
  const part1 = {
    name: 'Reactin perusteet',
    exercises: 10
  }
  const part2 = {
    name: 'Tiedonvälitys propseilla',
    exercises: 7
  }
  const part3 = {
    name: 'Komponenttien tila',
    exercises: 14
  }

  return (
    <div>
      ...
    </div>
  )
}
```

  <h4>1.4: course information step4</h4>

And then place the objects into an array. Modify the variable definitions of <i>App</i> into the following form and modify the other parts of the application accordingly:

```js
const App = () => {
  const course = 'Half Stack -sovelluskehitys'
  const parts = [
    {
      name: 'Reactin perusteet',
      exercises: 10
    },
    {
      name: 'Tiedonvälitys propseilla',
      exercises: 7
    },
    {
      name: 'Komponenttien tila',
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

**NB** at this point <i>you can assume that there are always three items</i>, so there is no need to go through the arrays using loops. We will come back to the topic of rendering components based on items in arrays with a more thorough exploration in the [next part of the course](../part2).

However, do not pass different objects as separate props from the <i>App</i> component to the components <i>Content</i> and <i>Total</i>. Instead, pass them directly as an array:

```js
const App = () => {
  // const-määrittelyt

  return (
    <div>
      <Header course={...} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  )
}
```

  <h4>1.5: course information step5</h4>

Let's take the changes one step further. Change the course and its parts into a single Javascript object. Fix everything that brakes.

```js
const App = () => {
  const course = {
    name: 'Half Stack -sovelluskehitys',
    parts: [
      {
        name: 'Reactin perusteet',
        exercises: 10
      },
      {
        name: 'Tiedonvälitys propseilla',
        exercises: 7
      },
      {
        name: 'Komponenttien tila',
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

Due to the fact that during this course, we are using a version of React containing React hooks, we have no need for defining objects with methods. **The contents of this chapter are not relevant to the course**, but are certainly in many ways good to know. In particular when using older versions of React, one must understand the topics of this chapter.

Arrow functions and functions defined using the _function_ keyword vary substantially when it comes to how they behave with respect to the keyword [this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this), which refers to the object itself.

We can assign methods to an objects by defining properties that are functions:

```js
const arto = {
  name: 'Arto Hellas',
  age: 35,
  education: 'Filosofian tohtori',
  greet: function() {
    console.log('hello, my name is', this.name)
  },
}

arto.greet()  // tulostuu hello, my name is Arto Hellas
```

methods can be assigned to objects even after the creation of the object:

```js
const arto = {
  name: 'Arto Hellas',
  age: 35,
  education: 'Filosofian tohtori',
  greet: function() {
    console.log('hello, my name is', this.name)
  },
}

// highlight-start
arto.growOlder = function() {
  this.age += 1
}
// highlight-end

console.log(arto.age)   // tulostuu 35
arto.growOlder()
console.log(arto.age)   // tulostuu 36
```

Let's slightly modify the object 

```js
const arto = {
  name: 'Arto Hellas',
  age: 35,
  education: 'Filosofian tohtori',
  greet: function() {
    console.log('hello, my name is', this.name)
  },
  // highlight-start
  doAddition: function(a, b) {
    console.log(a + b)
  },
  // highlight-end
}

arto.doAddition(1, 4) // tulostuu 5

const referenceToAdditon = arto.doAddition
referenceToAdditon(10, 15) // tulostuu 25
```

Now the object has the method _doAddition_, which calculates the sum of numbers given to it as parameters. The method is called in the usual way using the object <em>arto.doAddition(1, 4)</em> or by storing a <i>method reference</i> in a variable and calling the method through the variable <em>referenceToAdditon(10, 15)</em>.

If we try to do the same with the method _greet_ we run into an issue:

```js
arto.greet()       // tulostuu hello, my name is Arto Hellas

const referenceToGreet = arto.greet
referenceToGreet() // konsoliin tulostuu virheilmoitus
```

When calling the method through a reference, the method has lost knowledge of what was the original _this_. Contrary to other languages, in Javascript the value of [this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) is defined based on <i>how the method is called</i>. When calling the method through a reference, the value of _this_ becomes the so-called [global object](https://developer.mozilla.org/en-US/docs/Glossary/Global_object) and the end result is often not what the software developer had originally intended.

Losing track of _this_ when writing Javascript code brings forth a few potential issues. Situations often arise where React's or Node's (or more specifically the Javascript engine of the web browser) needs to call some method in an object that the developer has defined. However, in this course we are spared from the issues, since we are only using the "this-less" Javascript.

One situation leading to the disappearance of _this_ arises when, e.g. we ask Arto to greet in one second using the [setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) method.

```js
const arto = {
  name: 'Arto Hellas',
  greet: function() {
    console.log('hello, my name is', this.name)
  },
}

setTimeout(arto.greet, 1000)  // highlight-line
```

The value of _this_ in Javascript is defined based on how the method is being called. When setTimeout is using the method it is the Javascript engine that calls the method and _this_ refers to the Timeout object.

There are several mechanisms by which the original _this_ can be preserved. One of these is using a method called [bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind):

```js
setTimeout(arto.greet.bind(arto), 1000)
```

The command <em>arto.greet.bind(arto)</em> creates a new function, where it has bound _this_ to point to Arto independent of where and how the method is being called.

Using [arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions), it is possible to solve some of the problems related to _this_. They should not, however, be used as methods for objects, because then _this_ does not work at all. We will come back to the behavior of _this_ in relation to arrow functions later.

If you want to gain a better understanding of how _this_ works in Javascript, the internet is full of material about the topic, e.g. the screen cast series [Understand JavaScript's this Keyword in Depth](https://egghead.io/courses/understand-javascript-s-this-keyword-in-depth) by [egghead.io](https://egghead.io) is highly recommended!

### Classes

As mentioned previously, there is no class mechanism like ones in object oriented programming languages. There are, however, features in Javascript which makes "simulating" object oriented [classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) possible.

Let's take a quick look at the <i>class syntax</i> that was introduced into Javascript along with ES6, which substantially simplifies the definition of classes (or class-like things) in Javascript.

In the following, we have defined a "class" called Person and two Person objects.

```js
class Person {
  constructor(name, age) {
    this.name = name
    this.age = age
  }
  greet() {
    console.log('hello, my name is', this.name)
  }
}

const arto = new Person('Arto Hellas', 35)
arto.greet()

const juhq = new Person('Juha Tauriainen', 48)
juhq.greet()
```

When it comes to syntax, the classes and the objects created from them are very reminiscent of e.g. Java classes and objects. Their behavior is also quite similar to Java objects. At the core, they are still objects based on Javascript's [prototype inheritance](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Inheritance). The type of both objects is actually _Object_, since Javascript essentially only the types [Boolean, Null, Undefined, Number, String, Symbol and Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures).

Introduction of the class syntax is a controversial addition, e.g. check out [Not Awesome: ES6 Classes](https://github.com/joshburgess/not-awesome-es6-classes) or [Is “Class” In ES6 The New “Bad” Part?](https://medium.com/@rajaraodv/is-class-in-es6-the-new-bad-part-6c4e6fe1ee65)

The ES6 class syntax is used a lot in the "old" React and in Node.js, and therefore understanding it is beneficial even on this course. Because we are using the new [hook](https://reactjs.org/docs/hooks-intro.html) feature of React during this course we have no need to use the class syntax of Javascript.

### Javascript materials

On the internet we can find both good and bad guides for Javascript. On this page most of the links relating to Javascript features link to [Mozilla's Javascript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript).

It is highly recommended to immediately read [A re-introduction to JavaScript (JS tutorial)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript) on Mozillas website.

If you wish to deeply get to know Javascript, there is a great free book series on the internet called [You-Dont-Know-JS](https://github.com/getify/You-Dont-Know-JS).

[egghead.io](https://egghead.io) has plenty of quality screencasts on Javascript, React, and other interesting topics. Unfortunately some of the material is behind a paywall.

</div>