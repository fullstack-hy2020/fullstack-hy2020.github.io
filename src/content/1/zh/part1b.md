---
mainImage: ../../../images/part-1.svg
part: 1
letter: b
lang: zh
---

<div class="content">
<!-- During the course, we have a goal and a need to learn a sufficient amount of JavaScript in addition to web development. -->
在本课程中，除了网页开发，我们还有一个目标和需求，就是学习足量的 JavaScript 知识。
<!-- JavaScript has advanced rapidly the last few years and in this course we use features from the newer versions. The official name of the JavaScript standard is [ECMAScript](https://en.wikipedia.org/wiki/ECMAScript). At this moment, the latest version is the one released in June of 2019 with the name [ECMAScript® 2019](http://www.ecma-international.org/ecma-262/10.0/index.html), otherwise known as ES10. -->

JavaScript 在过去的几年里发展非常迅速，在本课程中，我们将使用新版本的特性。 JavaScript 标准的正式名称是[ECMAScript](https://en.wikipedia.org/wiki/ECMAScript)。 目前（2021年1月，译者注），最新的版本是2020年6月发布的，名为[ECMAScript®2020](https://www.ecma-international.org/ecma-262/) ，即ES11。 

<!-- Browsers do not yet support all of JavaScript's newest features. Due to this fact, a lot of code run in browsers has been <i>transpiled</i> from a newer version of JavaScript to an older, more compatible version. -->

浏览器还不能支持所有 JavaScript 的最新特性。 基于这个事实，许多在浏览器中运行的代码需要从一个新版本的 JavaScript 转译到了一个更旧、更兼容的版本。

<!-- Today, the most popular way to do the transpiling is using [Babel](https://babeljs.io/). Transpilation is automatically configured in React applications created with create-react-app. We will take a closer look at the configuration of the transpilation in [第7章](/part7) of this course. -->

如今，最流行的转译方法是使用 [Babel](https://babeljs.io/)。 在使用 create-React-app 创建的 React 应用中转译是自动配置好的。 我们将在本课程的[第7章节](/zh/part7)中仔细研究转译的配置。

<!-- [Node.js](https://nodejs.org/en/) is a JavaScript runtime environment based on Google's [chrome V8](https://developers.google.com/v8/) JavaScript engine and works practically anywhere - from servers to mobile phones. Let's practice writing some JavaScript using Node. It is expected that the version of Node.js installed on your machine is at least version <i>10.18.0.</i>. The latest versions of Node already understand the latest versions of JavaScript, so the code does not need to be transpiled. -->
[Node.js](https://nodejs.org/en/)是一个基于谷歌的 [chrome V8](https://developers.google.com/v8/) 引擎的 JavaScript 运行时环境，可以在任何地方工作，从服务端到移动端。 让我们练习使用 Node 编写一些 JavaScript 您机器上安装的 Node.js 版本至少是  v14.8.0。 最新版本的 Node 能够理解 JavaScript 最新版本的特性，因此代码不需要被转译。

<!-- The code is written into files ending with <i>.js</i> and are run by issuing the command <em>node name\_of\_file.js</em> -->

代码文件以 <i>.js</i>结尾，通过 <em>node 文件名.js</em> 命令以运行文件。

<!-- It is also possible to write JavaScript code into the Node.js console, which is opened by typing _node_ in the command-line, as well as into the browser's developer tool console. The newest revisions of Chrome handle the newer features of JavaScript [pretty well](http://kangax.github.io/compat-table/es2016plus/) without transpiling the code.Alternatively you can use a tool like [JS Bin](https://jsbin.com/?js,console). -->

还可以将 JavaScript 代码编写到 Node.js 控制台(通过在命令行中键入 _node_ 打开)，或者浏览器的开发工具控制台中。 最新版本的 Chrome 能 [很好地](http://kangax.github.io/compat-table/es2016plus/) 处理 JavaScript 的新特性，而且不需要转译代码。作为替代品，你也可以选择 [JS Bin](https://jsbin.com/?js,console)这样的工具。

<!-- JavaScript is sort of reminiscent, both in name and syntax, to Java. But when it comes to the core mechanism of the language they could not be more different. Coming from a Java background, the behavior of JavaScript can seem a bit alien, especially if one does not make the effort to look up its features. -->

JavaScript 都有点像 Java。 但是当涉及到语言的核心机制时，它们就大不相同了。 如果你是 Java 背景，JavaScript 的写法可能看起来有点古怪，尤其是如果你不花精力去查阅它的特性的话。

<!-- In certain circles it has also been popular to attempt "simulating" Java features and design patterns in JavaScript. We do not recommend doing this. -->

在某些圈儿里，也很流行在 JavaScript 中“模拟” Java 的特性和设计模式。但我们不建议这样做。

### Variables 
【变量】
<!-- In JavaScript there are a few ways to go about defining variables: -->

在 JavaScript 中有以下几种定义变量的方法:

```js
const x = 1
let y = 5

console.log(x, y)   // 1, 5 are printed
y += 10
console.log(x, y)   // 1, 15 are printed
y = 'sometext'
console.log(x, y)   // 1, sometext are printed
x = 4               // causes an error
```

<!-- [const](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) does not actually define a variable but a <i>constant</i> for which the value can no longer be changed. On the other hand [let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) defines a normal variable. -->

[const](https://developer.mozilla.org/en-us/docs/web/javascript/reference/statements/const)实际上并没有定义一个变量，而是定义了一个<i>常量</i>，也就是其值不能再更改了。 相对应的，[let](https://developer.mozilla.org/en-us/docs/web/javascript/reference/statements/let)定义了一个普通变量。

<!-- In the example, we also see that the type of the data assigned to the variable can change during execution. At the start _y_ stores an integer and at the end a string. -->

在示例中，我们还可以看到，分配给变量的数据类型，在执行过程中可以发生更改。 例如开头的 y 存储了一个整数，但最后存储一个字符串。

<!-- It is also possible to define variables in JavaScript using the keyword [var](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var). Var was for a long time the only way to define variables. Const and let were only recently added in version ES6. In specific situations, var works in a [different](https://medium.com/craft-academy/javascript-variables-should-you-use-let-var-or-const-394f7645c88f) [way](http://www.jstips.co/en/javascript/keyword-var-vs-let/) compared to variable definitions in most languages. During this course the use of var is ill-advised and you should stick with using const and let! -->

也可以使用关键字[var](https://developer.mozilla.org/en-us/docs/web/JavaScript/reference/statements/var)在 JavaScript 中定义变量。 在很长一段时间里，var 是定义变量的唯一方法。 const 和 let 是最近才在 ES6版本中添加的。 在一些特定情况，var 的工作方式与大多数语言中的变量定义相比是[十分不同的](https://medium.com/craft-academy/javascript-variables-should-you-use-let-var-or-const-394f7645c88f)。 在本课程中明确不建议使用var，你应该坚持使用 const 和 let！

<!-- You can find more on this topic on e.g. YouTube - [var, let and const - ES6 JavaScript Features](https://youtu.be/sjyJBL5fkp8) -->
你可以在 YouTube中找到更多关于这个 [var, let and const - ES6 JavaScript Features](https://youtu.be/sjyJBL5fkp8)议题的讨论

### Arrays
【数组】
<!-- An [array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) and a couple of examples of its use: -->
以下是[数组](https://developer.mozilla.org/en-us/docs/web/javascript/reference/global_objects/array)和它的几个使用示例:

```js
const t = [1, -1, 3]

t.push(5)

console.log(t.length) // 4 is printed
console.log(t[1])     // -1 is printed

t.forEach(value => {
  console.log(value)  // numbers 1, -1, 3, 5 are printed, each to own line
})                    
```

<!-- Notable in this example is the fact that the contents of the array can be modified even though it is defined as a _const_. Because the array is an object, the variable always points to the same object. The content of the array changes as new items are added to it. -->

在这个示例中值得注意的是，即使将数组用 const 定义，也可以修改该数组中的内容。 因为数组是一个对象，而数组变量总是指向这同一个对象。 当添加新的元素时，数组的内容也将发生变化。

<!-- One way of iterating through the items of the array is using _forEach_ as seen in the example. _forEach_ receives a <i>function</i> defined using the arrow syntax as a parameter. -->

遍历元素的一种方法是使用 _forEach_ ，如示例中所示， _forEach_ 接收一个函数作为入参，这个函数用到了箭头语法。

```js
value => {
  console.log(value)
}
```

<!-- forEach calls the function <i>for each of the items in the array</i>, always passing the individual item as an argument. The function as the argument of forEach may also receive [other argument](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach). -->

forEach 为数组中的每个元素调用了这个函数，并总是将这单个项作为参数传递。 作为 forEach 的入参函数，也可以接收[一些其他参数](https://developer.mozilla.org/en-us/docs/web/javascript/reference/global_objects/array/forEach)。 

<!-- In the previous example, a new item was added to the array using the method [push](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push). When using React, techniques from functional programming are often used. One characteristic of the functional programming paradigm is the use of [immutable](https://en.wikipedia.org/wiki/Immutable_object) data structures. In React code, it is preferable to use the method [concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat), which does not add the item to the array, but creates a new array in which the content of the old array and the new item are both included. -->

在前面的示例中，使用了[push](https://developer.mozilla.org/en-us/docs/web/javascript/reference/global_objects/array/push)方法将一个新元素添加到数组中。 在使用 React 时，经常使用函数式编程的技巧。 函数编程范型的一个特点，就是使用[不可变的](https://en.wikipedia.org/wiki/immutable_object)数据结构。 在React代码中，最好使用[concat](https://developer.mozilla.org/en-us/docs/web/javascript/reference/global_objects/array/concat)方法 ，因为它不向数组中添加元素，而是创建一个新数组，新数组中包含了旧数组和新的元素。

```js
const t = [1, -1, 3]

const t2 = t.concat(5)

console.log(t)  // [1, -1, 3] is printed
console.log(t2) // [1, -1, 3, 5] is printed
```



<!-- The method call _t.concat(5)_ does not add a new item to the old array but returns a new array which, besides containing the items of the old array, also contains the new item. -->

 _t.concat(5)_ 这种方法调用不会向旧数组添加新的元素，而是直接返回一个新数组，该数组除了包含旧数组的元素外，还包含新的元素。

<!-- There are plenty of useful methods defined for arrays. Let's look at a short example of using the [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) method. -->
数组中定义了许多有用的方法，让我们来看一个使用[map](https://developer.mozilla.org/en-us/docs/web/javascript/reference/global_objects/array/map)方法的简短示例。

```js
const t = [1, 2, 3]

const m1 = t.map(value => value * 2)
console.log(m1)   // [2, 4, 6] is printed
```



<!-- Based on the old array, map creates a <i>new array</i>, for which the function given as a parameter is used to create the items. In the case of this example the original value is multiplied by two. -->

基于旧的数组，map 创建一个 <i>新的数组</i>，旧数组的每一项作为函数的入参来创建新的元素。 在这个例子中，就是旧数组的元素乘以2。

<!-- Map can also transform the array into something completely different: -->
Map 还可以将数组转换为完全不同的内容: 

```js
const m2 = t.map(value => '<li>' + value + '</li>')
console.log(m2)  
// [ '<li>1</li>', '<li>2</li>', '<li>3</li>' ] is printed
```

<!-- Here an array filled with integer values is transformed into an array containing strings of HTML using the map method. In [第2章](/zh/part2) of this course, we will see that map is used quite frequently in React. -->

这个例子使用 map 方法将整数值的数组转换为了包含 HTML 字符串的数组。 在本课程的[第2章](/zh/part2)中，我们将看到 map 在 React 中使用得相当频繁。

<!-- Individual items of an array are easy to assign to variables with the help of the [destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment). -->

数组中的单个元素可以很容易地通过[解构赋值](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)赋给变量。

```js
const t = [1, 2, 3, 4, 5]

const [first, second, ...rest] = t

console.log(first, second)  // 1, 2 is printed
console.log(rest)          // [3, 4 ,5] is printed
```

<!-- Thanks to the assignment the variables _first_ and _second_ will receive the first two integers of the array as their values. The remaining integers are "collected" into an array of their own which is then assigned to the variable _rest_. -->

由于这种解构赋值方式，变量 _first_ 和 _second_ 将接收数组的前两个整数作为它们的值。 剩余的整数被“收集”到另一个数组中，然后分配给变量 rest。

### Objects
【对象】
<!-- There are a few different ways of defining objects in JavaScript. One very common method is using [object literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#Object_literals), which happens by listing its properties within braces: -->

在 JavaScript 中，定义对象有几种不同的方式。 一个非常常见的方法是使用[对象字面量](https://developer.mozilla.org/en-us/docs/web/javascript/guide/grammar_and_types#object_literals) ，就是通过在大括号中列出它的属性来实现的:

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

<!-- The values of the properties can be of any type, like integers, strings, arrays, objects... -->

属性的值可以是任何类型的，比如整数、字符串、数组、对象...。

<!-- The properties of an object are referenced by using the "dot" notation, or by using brackets: -->
对象的属性可以使用“句点”号或括号进行引用:

```js
console.log(object1.name)         // Arto Hellas is printed
const fieldName = 'age' 
console.log(object1[fieldName])    // 35 is printed
```

<!-- You can also add properties to an object on the fly by either using dot notation or using brackets: -->
你也可以使用句点符号或括号来动态地往对象中添加属性:

```js
object1.address = 'Helsinki'
object1['secret number'] = 12341
```

<!-- The latter of the additions has to be done by using brackets, because when using dot notation, <i>secret number</i> is not a valid property name. -->
后面的那个属性的添加必须通过使用中括号来完成，因为在使用点符号的话，带空格的<i>secret number</i>并不是一个合法的属性名。

<!-- Naturally, objects in JavaScript can also have methods. However, during this course we do not need to define any objects with methods of their own. This is why they are only discussed briefly during the course. -->

当然，JavaScript 中的对象也可以包含方法。 但是，在这个课程中，我们并不需要定义带方法的对象，因此这里只是简单地提及它。

<!-- Objects can also be defined using so-called constructor functions, which results in a mechanism reminiscent of many other programming languages', e.g. Java's classes. Despite this similarity JavaScript does not have classes in the same sense as object-oriented programming languages. There has been, however, an addition of the <i>class syntax</i> starting from version ES6, which in some cases helps structure object-oriented classes. -->

对象也可以使用所谓的构造函数来定义，这产生了一种类似其他编程语言的机制，例如 Java 中的类。 尽管有相似之处，JavaScript 并没有对标面向对象程序设计语言中类的概念。 但是，从 ES6版本开始，增加了<i>类语法</i>，这在某些情况下有助于构造面向对象的类。

### Functions 
【函数】
<!-- We have already become familiar with defining arrow functions. The complete process, without cutting corners, to defining an arrow function is as follows: -->

我们已经了解了箭头函数的定义。 定义箭头函数的完整过程如下:

```js
const sum = (p1, p2) => {
  console.log(p1)
  console.log(p2)
  return p1 + p2
}
```

<!-- and the function is called as can be expected: -->

这个函数可以被如下方式调用:

```js
const result = sum(1, 5)
console.log(result)
```

<!-- If there is just a single parameter, we can exclude the parentheses from the definition: -->
如果只有一个参数，我们可以在定义中去掉括号:

```js
const square = p => {
  console.log(p)
  return p * p
}
```

<!-- If the function only contains a single expression then the braces are not needed. In this case the function only returns the result of its only expression. Now, if we remove console printing, we can further shorten the function definition: -->

如果函数只包含一个表达式，则不需要写大括号。 在这种情况下，函数只返回这个唯一表达式的结果。 现在，如果我们去掉控制台打印，可以进一步缩短函数定义如下:

```js
const square = p => p * p
```



<!-- This form is particularly handy when manipulating arrays, e.g. using the map method: -->
这种方式在操作数组时特别方便，例如，使用 map 方法:

```js
const t = [1, 2, 3]
const tSquared = t.map(p => p * p)
// tSquared is now [1, 4, 9]
```



<!-- The arrow function was added to JavaScript only a couple of years ago along with version [ES6](http://es6-features.org/). Prior to this the only way to define functions was by using the keyword _function_. -->

这个箭头函数是几年前随 [ES6](http://es6-features.org/) 一起添加到 JavaScript 中。 在此之前，定义函数的唯一方法是使用关键字 _function_。

<!-- There are two ways by which the function can be referenced; one is giving a name in a [function declaration](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function). -->
有两种方法可定义函数function; 一种是在[函数声明](https://developer.mozilla.org/en-us/docs/web/javascript/reference/statements/function)中给一个名字。

```js
function product(a, b) {
  return a * b
}

const result = product(2, 6)
// result is now 12
```

<!--The other way to define the function is using a [function expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/function). In this case there is no need to give the function a name and the definition may reside among the rest of the code:-->

另一种定义函数的方法是使用[函数表达式](https://developer.mozilla.org/en-us/docs/web/javascript/reference/operators/function)。 在这种情况下，没有必要为函数命名，定义可以放在代码的其它位置: 

```js
const average = function(a, b) {
  return (a + b) / 2
}

const result = average(2, 5)
// result is now 3.5
```



<!-- During this course we will define all functions using the arrow syntax. -->
在本课程中，我们将使用箭头语法定义所有函数。

</div>

<div class="tasks">
  <h3>Exercises1.3-1.5</h3>

<i>We continue building the application that we started working on in the previous exercises. You can write the code into the same project, since we are only interested in the final state of the submitted application.</i>
我们继续构建我们在前面的练习中开始的应用。 您可以将代码编写到同一个项目中，因为我们只关心提交的应用的最终状态。 

<!-- **Pro-tip:** you may run into issues when it comes to the structure of the <i>props</i> that components receive. A good way to make things more clear is by printing the props to the console, e.g. as follows: -->
专业提示: 当涉及到组件接收的<i>props</i> 的结构时，您可能会遇到问题。 一个很好的方法就是把props打印到控制台上，例如:

```js
const Header = (props) => {
  console.log(props) // highlight-line
  return <h1>{props.course}</h1>
}
```

  <h4>1.3: 步骤3，课程信息</h4>

<!-- Let's move forward to using objects in our application. Modify the variable definitions of the <i>App</i> component as follows and also refactor the application so that it still works: -->

让我们继续在应用中使用对象。 按如下方式修改<i>App</i> 组件的变量定义来重构应用，使其仍然可以正常工作:

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

  <h4>1.4: 课程信息 步骤4 </h4>

<!-- And then place the objects into an array. Modify the variable definitions of <i>App</i> into the following form and modify the other parts of the application accordingly: -->
然后将对象放到一个数组中。按如下方式修改<i>App</i> 变量的定义，并相应地修改应用的其他部分:

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

<!-- **NB** at this point <i>you can assume that there are always three items</i>, so there is no need to go through the arrays using loops. We will come back to the topic of rendering components based on items in arrays with a more thorough exploration in the [next part of the course](../part2). -->
**注意** 在这里，我假定它总是有三个元素，所以没有必要使用循环遍历数组。 我们将在[课程的下一章节](/zh/part2)，即“基于数组中的元素渲染组件”这一议题中进行更深入的讨论。

<!-- However, do not pass different objects as separate props from the <i>App</i> component to the components <i>Content</i> and <i>Total</i>. Instead, pass them directly as an array: -->

但也不要把这些对象作为单独的 props 从<i>App</i> 组件传递给<i>Content</i> 和<i>Total</i> 两个组件。 而应将它们直接作为数组传递:

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

  <h4>1.5: 课程信息 步骤5</h4>

<!-- Let's take the changes one step further. Change the course and its parts into a single JavaScript object. Fix everything that breaks. -->
让我们进一步做一些改变。 将课程及其章节合成为一个 JavaScript 对象。 修复好之前所有的缺陷。

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
【对象方法以及“ this”关键字】
<!-- Due to the fact that during this course we are using a version of React containing React Hooks we have no need for defining objects with methods. **The contents of this chapter are not relevant to the course** but are certainly in many ways good to know. In particular when using older versions of React one must understand the topics of this chapter. -->

由于在本课程中我们使用的React版本里包含 React hook ，所以我们不需要定义带有函数的对象。 因此**本章的内容与本课程无关** ，但在许多方面确实值得了解。 特别是在使用旧版本的 React 时，必须理解本章的议题。

<!-- Arrow functions and functions defined using the _function_ keyword vary substantially when it comes to how they behave with respect to the keyword [this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) which refers to the object itself. -->

箭头函数和使用function关键字的函数，在涉及到 [this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) 关键字（指向对象本身）的行为上，有很大的不同。

<!-- We can assign methods to an object by defining properties that are functions: -->
我们可以通过给一个对象定义函数属性，来给对象分配方法：

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

<!-- Methods can be assigned to objects even after the creation of the object: -->
方法甚至可以在对象创建之后再赋值给对象:

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

console.log(arto.age)   // 35 is printed
arto.growOlder()
console.log(arto.age)   // 36 is printed
```

<!-- Let's slightly modify the object  -->
让我们稍微修改一下对象

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

arto.doAddition(1, 4)        // 5 is printed

const referenceToAddition = arto.doAddition
referenceToAddition(10, 15)   // 25 is printed
```

<!-- Now the object has the method _doAddition_ which calculates the sum of numbers given to it as parameters. The method is called in the usual way using the object <em>arto.doAddition(1, 4)</em> or by storing a <i>method reference</i> in a variable and calling the method through the variable <em>referenceToAddition(10, 15)</em>. -->

现在对象有了 doAddition 方法，该方法将传递给他的参数进行求和。 该方法通常使用对象的 <em>arto.doAddition(1, 4)</em> 来调用，或者通过赋值给变量的 <i>方法引用 </i> ，<em>referenceToAddition(10, 15)</em>来调用该方法



<!-- If we try to do the same with the method _greet_ we run into an issue: -->
如果我们用同样的方式调用_greet_函数，我们就会遇到一个问题:

```js
arto.greet()       // "hello, my name is Arto Hellas" gets printed

const referenceToGreet = arto.greet
referenceToGreet() // prints "hello, my name is undefined"
```



<!-- When calling the method through a reference the method has lost knowledge of what was the original _this_. Contrary to other languages, in JavaScript the value of [this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) is defined based on <i>how the method is called</i>. When calling the method through a reference the value of _this_ becomes the so-called [global object](https://developer.mozilla.org/en-US/docs/Glossary/Global_object) and the end result is often not what the software developer had originally intended. -->

当通过引用调用referenceToGreet() 方法时，该方法已经不认识原始的this是什么了。 与其他语言相反，在 JavaScript 中，[this](https://developer.mozilla.org/en-us/docs/web/JavaScript/reference/operators/this)的值是根据 <i>方法如何调用</i>  来定义的。 当通过引用调用该方法时， _this_ 的值就变成了所谓的[全局对象](https://developer.mozilla.org/en-us/docs/glossary/global_object) ，而最终结果往往不是软件开发人员设想的那样。

<!-- Losing track of _this_ when writing JavaScript code brings forth a few potential issues. Situations often arise where React or Node (or more specifically the JavaScript engine of the web browser) needs to call some method in an object that the developer has defined. However, in this course we avoid issues by using the "this-less" JavaScript. -->

失去对this 关键字的追踪，在编写 JavaScript 代码时会带来一些潜在的问题。 通常情况下，React 或 Node (或者更确切地说是 web 浏览器的 JavaScript 引擎) 需要调用开发人员定义的对象中的某个方法。 然而，在本课程中，我们会使用“ 去this” （避免使用this关键字）的JavaScript 来避免这些问题。

<!-- One situation leading to the disappearance of _this_ arises when, e.g. we ask Arto to greet in one second using the [setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) method. -->

例如，当我们使用[setTimeout](https://developer.mozilla.org/en-us/docs/web/api/windoworworkerglobalscope/setTimeout)方法，让arto对象1秒钟后调用greet。

```js
const arto = {
  name: 'Arto Hellas',
  greet: function() {
    console.log('hello, my name is ' + this.name)
  },
}

setTimeout(arto.greet, 1000)  // highlight-line
```

<!-- As mentioned, the value of _this_ in JavaScript is defined based on how the method is being called. When <em>setTimeout</em> is calling the method, it is the JavaScript engine that actually calls the method and, at that point, _this_ refers to the global object. -->
如上所述，在 JavaScript 中，this 的值是根据方法的调用方式来定义的。 当 <em>setTimeout</em> 调用该方法时，实际上是JavaScript引擎在调用该方法，此时的this是指向的是全局对象。

<!-- There are several mechanisms by which the original _this_ can be preserved. One of these is using a method called [bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind): -->
有几种机制可以保留这种原始的 this 。 其中一个是使用[bind](https://developer.mozilla.org/en-us/docs/web/javascript/reference/global_objects/function/bind)方法:

```js
setTimeout(arto.greet.bind(arto), 1000)
```

<!-- The command <em>arto.greet.bind(arto)</em> creates a new function where it has bound _this_ to point to Arto independent of where and how the method is being called. -->
调用 <em>arto.greet.bind(arto)</em> 创建了一个新函数，它将 _this_  绑定指向到了 Arto，这与方法的调用位置和方式无关。

<!-- Using [arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) it is possible to solve some of the problems related to _this_. They should not, however, be used as methods for objects because then _this_ does not work at all. We will come back later to the behavior of _this_ in relation to arrow functions. -->
使用[箭头函数](https://developer.mozilla.org/en-us/docs/web/javascript/reference/functions/arrow_functions)可以解决与 _this_相关的一系列问题。 但是，它不能当做对象的方法来使用，因为那样的话this就不起作用了。 稍后我们将回到_this_与箭头函数的关系。

<!-- If you want to gain a better understanding of how _this_ works in JavaScript, the Internet is full of material about the topic, e.g. the screen cast series [Understand JavaScript's this Keyword in Depth](https://egghead.io/courses/understand-javascript-s-this-keyword-in-depth) by [egghead.io](https://egghead.io) is highly recommended! -->
如果你想更好地理解 JavaScript 的工作原理，互联网上充满了关于这个议题的材料，例如 [egghead.io](https://egghead.io)的一系列[Understand JavaScript's this Keyword in Depth](https://egghead.io/courses/understand-javascript-s-this-keyword-in-depth)短视频，强烈推荐！

### Classes
【类】
<!-- As mentioned previously, there is no class mechanism like the ones in object-oriented programming languages. There are, however, features in JavaScript which make "simulating" object-oriented [classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) possible. -->
正如前面提到的，JavaScript 中并没有像面向对象程序语言中的类机制。 然而，JavaScript 中的一些新特性使得它能够“模拟”面向对象中的[类](https://developer.mozilla.org/en-us/docs/web/JavaScript/reference/classes)。

<!-- Let's take a quick look at the <i>class syntax</i> that was introduced into JavaScript along with ES6, which substantially simplifies the definition of classes (or class-like things) in JavaScript. -->
让我们快速看一下与 ES6一起引入到 JavaScript 中的<i>类语法</i>，它在很大程度上简化了 JavaScript 中的类(或者说像是类)的定义。

<!-- In the following we have defined a "class" called Person and two Person objects. -->
在下面的代码中，我们定义了一个名为 Person 的“类”和两个 Person 对象。

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

<!-- When it comes to syntax the classes and the objects created from them are very reminiscent of Java classes and objects. Their behavior is also quite similar to Java objects. At the core they are still objects based on JavaScript's [prototype inheritance](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Inheritance). The type of both objects is actually _Object_, since JavaScript essentially only defines the types [Boolean, Null, Undefined, Number, String, Symbol, and Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures). -->

在语法方面，类以及由它们创建的对象非常类似于 Java 的类和对象。 它们的行为也非常类似于 Java 对象。 但在本质上，它们仍然是基于 JavaScript 的[原型继承](https://developer.mozilla.org/en-us/docs/learn/JavaScript/objects/inheritance)的对象。 这两个对象的类型实际上都是 Object，因为 JavaScript 实质上只定义了[Boolean，Null，Undefined，Number，String，Symbol，BigInt，以及 Object](https://developer.mozilla.org/en-us/docs/web/JavaScript/data_structures)几种类型。

<!-- Introduction of the class syntax is a controversial addition, e.g. check out [Not Awesome: ES6 Classes](https://github.com/petsel/not-awesome-es6-classes) or [Is “Class” In ES6 The New “Bad” Part?](https://medium.com/@rajaraodv/is-class-in-es6-the-new-bad-part-6c4e6fe1ee65) -->
类语法的引入是一个有争议的新特性，例如[Not Awesome: ES6 Classes](https://github.com/petsel/not-awesome-es6-classes) 或者[Is “Class” In ES6 The New “Bad” Part?](https://medium.com/@rajaraodv/is-class-in-es6-the-new-bad-part-6c4e6fe1ee65)这两篇文章所讨论的。

<!-- The ES6 class syntax is used a lot in "old" React and also in Node.js hence an understanding of it is beneficial even in this course. But since we are using the new [hook](https://reactjs.org/docs/hooks-intro.html) feature of React throughout this course we have no concrete use for JavaScript's class syntax. -->
ES6的类语法在“老的” React 和 Node.js 中被广泛使用，因此即使在本课程中，对它有所了解也是有益的。 但是因为我们在整个课程中都使用了 React 的新的[hooks](https://reactjs.org/docs/hooks-intro.html)特性，所以我们没有具体使用 JavaScript 的类语法。 

### JavaScript materials
【JavaScript 教材】
<!-- There exists both good and poor guides for JavaScript on the Internet. Most of the links on this page relating to JavaScript features reference [Mozilla's JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript). -->
互联网上的 JavaScript 指南既有好的，也有不好的。 这个页面上大多数与 JavaScript 特性相关的链接都参考了 Mozilla 的 JavaScript 指南[Mozilla's JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript)。

<!-- It is highly recommended to immediately read [A re-introduction to JavaScript (JS tutorial)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript) on Mozillas website. -->
强烈建议你立即在 Mozillas 网站上阅读[重新认识JavaScript(JS 教程)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript)。

<!-- If you wish to get to know JavaScript deeply there is a great free book series on the Internet called [You-Dont-Know-JS](https://github.com/getify/You-Dont-Know-JS). -->
如果你想深入了解 JavaScript，互联网上有一个很棒的免费书系列叫做[You-Dont-Know-JS](https://github.com/getify/You-Dont-Know-JS)。

<!-- [egghead.io](https://egghead.io) has plenty of quality screencasts on JavaScript, React, and other interesting topics. Unfortunately, some of the material is behind a paywall. -->
[egghead.io](https://egghead.io) 上有大量关于 JavaScript、 React 及其他有趣议题的高质量短视频。不幸的是，有些材料是付费后才能看的。

</div>

