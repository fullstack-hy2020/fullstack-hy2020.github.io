---
mainImage: ../../../images/part-1.svg
part: 1
letter: b
lang: zh
---

<div class="content">
Div class"content"

During the course, we have a goal and a need to learn a sufficient amount of Javascript in addition to web development.
在课程中，除了网页开发，我们还有一个目标和学习足够数量的 Javascript 的需要。

Javascript has advanced rapidly the last few years and in this course we use features from the newer versions. The official name of the Javascript standard is [ECMAScript](https://en.wikipedia.org/wiki/ECMAScript). At this moment, the latest version is the one released in June of 2019 with the name [ECMAScript® 2019](http://www.ecma-international.org/ecma-262/10.0/index.html), otherwise known as ES10.
在过去的几年里，Javascript 的发展非常迅速，在本课程中，我们将使用新版本的特性。 Javascript 标准的正式名称是[ ECMAScript ]( https://en.wikipedia.org/wiki/ECMAScript )。 目前，最新的版本是2019年6月发布的，名为[ ECMAScript 2019]( http://www.ecma-international.org/ecma-262/10.0/index.html ) ，也就是 ES10。

Browsers do not yet support all of Javascript's newest features. Due to this fact, a lot of code run in browsers has been <i>transpiled</i> from a newer version of Javascript to an older, more compatible version.
浏览器还不能支持所有 Javascript 的最新特性。 由于这个事实，许多在浏览器中运行的代码已经从一个新版本的 Javascript 转移到了一个更旧、更兼容的版本。

Today, the most popular way to do the transpiling is using [Babel](https://babeljs.io/). Transpilation is automatically configured in React applications created with create-react-app. We will take a closer look at the configuration of the transpilation in [part 7](/part7) of this course.
今天，最流行的蒸腾方式是使用[巴别塔]( https://babeljs.io/ )。 Transpilation 在使用 create-React-app 创建的 React 应用程序中自动配置。 我们将在本课程的[第7部分](/ 第7部分)中仔细研究蒸发的结构。

[Node.js](https://nodejs.org/en/) is a Javascript runtime environment based on Google's [chrome V8](https://developers.google.com/v8/) Javascript engine and works practically anywhere - from servers to mobile phones. Let's practice writing some Javascript using Node. It is expected that the version of Node.js installed on your machine is at least version <i>10.18.0.</i>. The latest versions of Node already understand the latest versions of Javascript, so the code does not need to be transpiled.
是一个基于 Google 的 Javascript 引擎的 Javascript  https://nodejs.org/en/ 执行期函式库，可以在任何地方工作，从服务器到移动电话。 让我们练习使用 Node 编写一些 Javascript。 预计您机器上安装的 Node.js 版本至少是 i 10.18.0版本。 我。 最新版本的 Node 已经理解了 Javascript 的最新版本，所以代码不需要透露。

The code is written into files ending with <i>.js</i> and are run by issuing the command <em>node name\_of\_file.js</em>
代码写入以 i. js / i 结尾的文件，并通过发出命令 em node name  file.js / em 运行

It is also possible to write Javascript code into the Node.js console, which is opened by typing _node_ in the command-line, as well as into the browser's developer tool console. The newest revisions of Chrome handle the newer features of Javascript [pretty well](http://kangax.github.io/compat-table/es2016plus/) without transpiling the code.
还可以将 Javascript 代码编写到 Node.js 控制台(通过在命令行中键入 node 打开)以及浏览器的开发工具控制台中。 最新的 Chrome 版本很好地处理了 Javascript 的新特性，而且没有泄露代码 http://kangax.github.io/compat-table/es2016plus/ 。

Javascript is sort of reminiscent, both in name and syntax, to Java. But when it comes to the core mechanism of the language they could not be more different. Coming from a Java background, the behavior of Javascript can seem a bit alien, especially if one does not make the effort to look up its features.
无论在名称还是语法上，Javascript 都有点像 Java。 但是当涉及到语言的核心机制时，它们就大不相同了。 来自 Java 的背景，Javascript 的行为可能看起来有点陌生，特别是如果一个人不努力去查找它的特性。

In certain circles it has also been popular to attempt "simulating" Java features and design patterns in Javascript. We do not recommend doing this.
在某些圈子里，尝试在 Javascript 中“模拟” Java 特性和设计模式也很流行。 我们不建议这样做。

### Variables
# # # 变量

In Javascript there are a few ways to go about defining variables:
在 Javascript 中有几种定义变量的方法:

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

[const](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) does not actually define a variable but a <i>constant</i> for which the value can no longer be changed. On the other hand [let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) defines a normal variable.
[ const ]( https://developer.mozilla.org/en-us/docs/web/javascript/reference/statements/const )实际上并没有定义一个变量，而是一个 i 常量 / i，其值不再能够更改。 另一方面，[ let ]( https://developer.mozilla.org/en-us/docs/web/javascript/reference/statements/let )定义了一个普通变量。

In the example, we also see that the type of the data assigned to the variable can change during execution. At the start _y_ stores an integer and at the end a string.
在示例中，我们还看到分配给变量的数据类型在执行过程中可能发生更改。 在开头 y 存储一个整数，在结尾存储一个字符串。

It is also possible to define variables in Javascript using the keyword [var](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var). Var was for a long time the only way to define variables. Const and let were only recently added in version ES6. In specific situations, var works in a [different](https://medium.com/craft-academy/javascript-variables-should-you-use-let-var-or-const-394f7645c88f) [way](http://www.jstips.co/en/javascript/keyword-var-vs-let/) compared to variable definitions in most languages. During this course the use of var is ill-advised and you should stick with using const and let!
使用关键字[ var ]( https://developer.mozilla.org/en-us/docs/web/Javascript/reference/statements/var )在 Javascript 中定义变量也是可能的。 在很长一段时间里，Var 是定义变量的唯一方法。 Const 和 let 是最近才在 ES6版本中添加的。 在特定情况下，与大多数语言中的变量定义相比，var 的工作方式是[不同的]( https://medium.com/craft-academy/javascript-variables-should-you-use-let-var-or-const-394f7645c88f )[方式]( http://www.jstips.co/en/javascript/keyword-var-vs-let/ )。 在这个过程中，var 的使用是不明智的，你应该坚持使用 const 和 let！

You can find more on this topic on e.g. YouTube - [var, let and const - ES6 JavaScript Features](https://youtu.be/sjyJBL5fkp8)
你可以在 YouTube-[ var，let 和 const-ES6 JavaScript Features ]上找到更多关于这个主题的 https://youtu.be/sjyjbl5fkp8

### Arrays
# # 数组

An [array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) and a couple of examples of its use:
一个[数组]( https://developer.mozilla.org/en-us/docs/web/javascript/reference/global_objects/array )和它的几个使用例子:

```js
const t = [1, -1, 3]

t.push(5)

console.log(t.length) // 4 is printed
console.log(t[1])     // -1 is printed

t.forEach(value => {
  console.log(value)  // numbers 1, -1, 3, 5 are printed, each to own line
})                    
```

Notable in this example is the fact that the contents of the array can be modified even though it is defined as a _const_. Because the array is an object the variable always points to the same object. The content of the array changes as new items are added to it.
在这个示例中值得注意的是，即使将数组定义为 const，也可以修改该数组的内容。 因为数组是一个对象，所以变量总是指向同一个对象。 当添加新项时，数组的内容将发生变化。

One way of iterating through the items of the array is using _forEach_ as seen in the example. _forEach_ receives a <i>function</i> defined using the arrow syntax as a parameter.
遍历数组项的一种方法是使用 forEach，如示例中所示。 Foreach 接收使用箭头语法作为参数定义的 i 函数 / i。

```js
value => {
  console.log(value)
}
```

forEach calls the function <i>for each of the items in the array</i>, always passing the individual item as a parameter. The function as the parameter of forEach may also receive [other parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach).
Foreach 为数组 / i 中的每个项调用函数 i，始终将单个项作为参数传递。 作为 forEach 参数的函数也可以接收[其他参数]( https://developer.mozilla.org/en-us/docs/web/javascript/reference/global_objects/array/forEach )。

In the previous example, a new item was added to the array using the method [push](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push). When using React, techniques from functional programming are often used. One characteristic of the functional programming paradigm is the use of [immutable](https://en.wikipedia.org/wiki/Immutable_object) data structures. In React code, it is preferable to use the method [concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat), which does not add the item to the array, but creates a new array in which the content of the old array and the new item are both included.
在前面的示例中，使用方法[ push ]( https://developer.mozilla.org/en-us/docs/web/javascript/reference/global_objects/array/push )将一个新项添加到数组中。 在使用 React 时，经常使用函数式编程的技术。 函数编程范型的一个特点是使用[不可变的]( https://en.wikipedia.org/wiki/immutable_object )数据结构。 在反应代码中，最好使用方法[ concat ]( https://developer.mozilla.org/en-us/docs/web/javascript/reference/global_objects/array/concat ) ，它不向数组中添加项，而是创建一个新数组，其中包含旧数组和新数组的内容。

```js
const t = [1, -1, 3]

const t2 = t.concat(5)

console.log(t)  // [1, -1, 3] is printed
console.log(t2) // [1, -1, 3, 5] is printed
```

The method call _t.concat(5)_ does not add a new item to the old array but returns a new array which, besides containing the items of the old array, also contains the new item.
方法调用 t.concat (5)不向旧数组添加新项，而是返回一个新数组，该数组除了包含旧数组的项外，还包含新项。

There are plenty of useful methods defined for arrays. Let's look at a short example of using the [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) method.
为数组定义了许多有用的方法，让我们来看一个使用[ map ]( https://developer.mozilla.org/en-us/docs/web/javascript/reference/global_objects/array/map )方法的简短示例。

```js
const t = [1, 2, 3]

const m1 = t.map(value => value * 2)
console.log(m1)   // [2, 4, 6] is printed
```

Based on the old array, map creates a <i>new array</i>, for which the function given as a parameter is used to create the items. In the case of this example the original value is multiplied by two.
在旧数组的基础上，map 创建一个 i / new 数组 / i，用作参数的函数来创建项。 在这个例子中，原始值被乘以2。

Map can also transform the array into something completely different:
Map 还可以将数组转换为完全不同的内容:

```js
const m2 = t.map(value => '<li>' + value + '</li>')
console.log(m2)  
// [ '<li>1</li>', '<li>2</li>', '<li>3</li>' ] is printed
```

Here an array filled with integer values is transformed into an array containing strings of HTML using the map method. In [part2](/en/part2) of this course, we will see that map is used quite frequently in React.
在这里，使用 map 方法将填充了整数值的数组转换为包含 HTML 字符串的数组。 在本课程的[ part2](/ en / part2)中，我们将看到 map 在 React 中使用得相当频繁。

Individual items of an array are easy to assign to variables with the help of the [destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment).
数组中的单个项目可以很容易地通过[析构化赋值](destructuring assignment)赋给变量 https://developer.mozilla.org/en-us/docs/web/javascript/reference/operators/destructuring_assignment。

```js
const t = [1, 2, 3, 4, 5]

const [first, second, ...rest] = t

console.log(first, second)  // 1, 2 is printed
console.log(rest)          // [3, 4 ,5] is printed
```

Thanks to the assignment the variables _first_ and _second_ will receive the first two integers of the array as their values. The remaining integers are "collected" into an array of their own which is then assigned to the variable _rest_.
由于赋值，第一个和第二个变量将接收数组的前两个整数作为它们的值。 其余的整数被“收集”到它们自己的数组中，然后分配给变量 rest。

### Objects
物品

There are a few different ways of defining objects in Javascript. One very common method is using [object literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#Object_literals), which happens by listing its properties within braces:
在 Javascript 中定义对象有几种不同的方式。 一个非常常见的方法是使用[对象文本]( https://developer.mozilla.org/en-us/docs/web/javascript/guide/grammar_and_types#object_literals ) ，这是通过在大括号中列出它的属性来实现的:

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

The values of the properties can be of any type, like integers, strings, arrays, objects...
属性的值可以是任何类型的，比如整数、字符串、数组、对象... ..。

The properties of an object are referenced by using the "dot" notation, or by using brackets:
使用“点”符号或括号引用对象的属性:

```js
console.log(object1.name)         // Arto Hellas is printed
const fieldName = 'age' 
console.log(object1[fieldName])    // 35 is printed
```

You can also add properties to an object on the fly by either using dot notation or using brackets:
你也可以使用点符号或括号来动态地添加属性到对象中:

```js
object1.address = 'Helsinki'
object1['secret number'] = 12341
```

The latter of the additions has to be done by using brackets, because when using dot notation, <i>secret number</i> is not a valid property name.
后者的添加必须通过使用括号来完成，因为在使用点符号时，i secret number / i 不是有效的属性名。

Naturally, objects in Javascript can also have methods. However, during this course we do not need to define any objects with methods of their own. This is why they are only discussed briefly during the course.
当然，Javascript 中的对象也可以有方法。 然而，在这个过程中，我们不需要用它们自己的方法来定义任何对象。 这就是为什么只在课程中简单地讨论它们。

Objects can also be defined using so-called constructor functions, which results in a mechanism reminiscent of many other programming languages', e.g. Java's classes. Despite this similarity Javascript does not have classes in the same sense as object-oriented programming languages. There has been, however, an addition of the <i>class syntax</i> starting from version ES6, which in some cases helps structure object-oriented classes.
对象也可以使用所谓的构造函数来定义，这导致了一种类似于许多其他编程语言的机制，例如 Java 的类。 尽管有这些相似之处，Javascript 并没有类与面向对象程序设计语言有相同的含义。 但是，从 ES6版本开始，又增加了 i 类语法 / i，这在某些情况下有助于构造面向对象的类。

### Functions
# # # 功能

We have already become familiar with defining arrow functions. The complete process, without cutting corners, to defining an arrow function is as follows:
我们已经熟悉了箭头函数的定义。 定义箭头函数的完整过程如下:

```js
const sum = (p1, p2) => {
  console.log(p1)
  console.log(p2)
  return p1 + p2
}
```

and the function is called as can be expected:
这个函数被调用:

```js
const result = sum(1, 5)
console.log(result)
```

If there is just a single parameter, we can exclude the parentheses from the definition:
如果只有一个参数，我们可以从定义中排除括号:

```js
const square = p => {
  console.log(p)
  return p * p
}
```

If the function only contains a single expression then the braces are not needed. In this case the function only returns the result of its only expression. Now, if we remove console printing, we can further shorten the function definition:
如果函数只包含一个表达式，则不需要大括号。 在这种情况下，函数只返回其唯一表达式的结果。 现在，如果我们删除控制台打印，我们可以进一步缩短函数定义:

```js
const square = p => p * p
```

This form is particularly handy when manipulating arrays, e.g. using the map method:
这个表单在操作数组时特别方便，例如使用 map 方法:

```js
const t = [1, 2, 3]
const tSquared = t.map(p => p * p)
// tSquared is now [1, 4, 9]
```

The arrow function was added to Javascript only a couple of years ago along with version [ES6](http://es6-features.org/). Prior to this the only way to define functions was by using the keyword _function_.
这个箭头函数和 ES6 http://ES6-features.org/ 一起在几年前才被添加到 Javascript 中。 在此之前，定义函数的唯一方法是使用关键字函数。

There are two ways by which the function can be referenced; one is giving a name in a [function declaration](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function).
有两种方法可以引用函数; 一种是在[函数声明]( https://developer.mozilla.org/en-us/docs/web/javascript/reference/statements/function )中给出一个名称。

```js
function product(a, b) {
  return a * b
}

const result = product(2, 6)
// result is now 12
```

The other way to define the function is using a [function expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/function). In this case there is no need to give the function a name and the definition may reside among the rest of the code:
另一种定义函数的方法是使用[函数表达式]( https://developer.mozilla.org/en-us/docs/web/javascript/reference/operators/function )。 在这种情况下，没有必要为函数命名，定义可能驻留在代码的其余部分:

```js
const average = function(a, b) {
  return (a + b) / 2
}

const result = average(2, 5)
// result is now 3.5
```

During this course we will define all functions using the arrow syntax.
在本课程中，我们将使用箭头语法定义所有函数。

</div>
/ div

<div class="tasks">
Div 类”任务”
  <h3>Exercises 1.3.-1.5.</h3>
练习1.3-1.5. / 

<i>We continue building the application that we started working on in the previous exercises. You can write the code into the same project, since we are only interested in the final state of the submitted application.</i>
我们继续构建我们在前面的练习中开始的应用程序。 您可以将代码编写到同一个项目中，因为我们只关心提交的应用程序的最终状态。 我

**Pro-tip:** you may run into issues when it comes to the structure of the <i>props</i> that components receive. A good way to make things more clear is by printing the props to the console, e.g. as follows:
专业提示: 当涉及到组件接收的 i props / i 的结构时，您可能会遇到问题。 一个很好的方法就是把道具打印到控制台上，例如:

```js
const Header = (props) => {
  console.log(props) // highlight-line
  return <h1>{props.course}</h1>
}
```

  <h4>1.3: course information step3</h4>
H41.3: 课程信息，步骤3 / h4

Let's move forward to using objects in our application. Modify the variable definitions of the <i>App</i> component as follows and also refactor the application so that it still works:
让我们继续在应用程序中使用对象。 修改 i App / i 组件的变量定义如下，并重构应用程序，使其仍然可以工作:

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

  <h4>1.4: course information step4</h4>
H41.4: 课程信息，步骤4 / h4

And then place the objects into an array. Modify the variable definitions of <i>App</i> into the following form and modify the other parts of the application accordingly:
然后将对象放入一个数组中。 将 i App / i 的变量定义修改为以下格式，并相应地修改应用程序的其他部分:

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

**NB** at this point <i>you can assume that there are always three items</i>, so there is no need to go through the arrays using loops. We will come back to the topic of rendering components based on items in arrays with a more thorough exploration in the [next part of the course](../part2).
* * NB * * * 在这一点上，我可以假设总是有三个条目 / i，所以没有必要使用循环遍历数组。 我们将在[课程的下一部分]中进行更深入的探讨，回到基于数组中的项呈现组件的主题。 . / 第二部分)。

However, do not pass different objects as separate props from the <i>App</i> component to the components <i>Content</i> and <i>Total</i>. Instead, pass them directly as an array:
但是，不要将不同的对象作为独立的道具从 i App / i 组件传递给组件 i Content / i 和 i Total / i。 相反，将它们直接作为数组传递:

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

  <h4>1.5: course information step5</h4>
H41.5: 课程信息，步骤5 / h4

Let's take the changes one step further. Change the course and its parts into a single Javascript object. Fix everything that breaks.
让我们进一步改变。 将课程及其部分更改为一个 Javascript 对象。 修好所有坏掉的东西。

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
/ div

<div class="content">
Div class"content"

### Object methods and "this"
# # # Object methods and“ this”

Due to the fact that during this course we are using a version of React containing React hooks we have no need for defining objects with methods. **The contents of this chapter are not relevant to the course** but are certainly in many ways good to know. In particular when using older versions of React one must understand the topics of this chapter.
由于在本课程中我们使用了一个包含 React hook 的版本，所以我们不需要使用方法来定义对象。 * * 本章的内容与本课程无关 * * 但在许多方面确实值得了解。 特别是在使用旧版本的 React 时，必须理解本章的主题。

Arrow functions and functions defined using the _function_ keyword vary substantially when it comes to how they behave with respect to the keyword [this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) which refers to the object itself.
使用 function 关键字定义的箭头函数和函数在它们相对于引用对象本身的关键字[ this ]( https://developer.mozilla.org/en-us/docs/web/javascript/reference/operators/this )的行为方式上有很大的不同。

We can assign methods to an object by defining properties that are functions:
我们可以通过定义函数属性来为对象分配方法:

```js
const arto = {
  name: 'Arto Hellas',
  age: 35,
  education: 'PhD',
  // highlight-start
  greet: function() {
    console.log('hello, my name is', this.name)
  },
  // highlight-end
}

arto.greet()  // hello, my name is Arto Hellas gets printed
```

Methods can be assigned to objects even after the creation of the object:
方法甚至可以在创建对象之后被赋值给对象:

```js
const arto = {
  name: 'Arto Hellas',
  age: 35,
  education: 'PhD',
  greet: function() {
    console.log('hello, my name is', this.name)
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

Let's slightly modify the object 
让我们稍微修改一下对象

```js
const arto = {
  name: 'Arto Hellas',
  age: 35,
  education: 'PhD',
  greet: function() {
    console.log('hello, my name is', this.name)
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

Now the object has the method _doAddition_ which calculates the sum of numbers given to it as parameters. The method is called in the usual way using the object <em>arto.doAddition(1, 4)</em> or by storing a <i>method reference</i> in a variable and calling the method through the variable <em>referenceToAddition(10, 15)</em>.
现在对象有了 doAddition 方法，该方法计算给它的数字之和作为参数。 该方法通常使用对象 em arto.doAddition (1,4) / em 来调用，或者在变量中存储 i 方法 reference / i，然后通过变量 em referenceToAddition (10,15) / em 来调用该方法。

If we try to do the same with the method _greet_ we run into an issue:
如果我们尝试用同样的方法问候，我们就会遇到一个问题:

```js
arto.greet()       // hello, my name is Arto Hellas gets printed

const referenceToGreet = arto.greet
referenceToGreet() // error message is printed to console
```

When calling the method through a reference the method has lost knowledge of what was the original _this_. Contrary to other languages, in Javascript the value of [this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) is defined based on <i>how the method is called</i>. When calling the method through a reference the value of _this_ becomes the so-called [global object](https://developer.mozilla.org/en-US/docs/Glossary/Global_object) and the end result is often not what the software developer had originally intended.
当通过引用调用该方法时，该方法已经丢失了原始的 this 的知识。 与其他语言相反，在 Javascript 中，[ this ]( https://developer.mozilla.org/en-us/docs/web/Javascript/reference/operators/this )的值是根据方法如何调用 / i 来定义的。 当通过引用调用该方法时，这个值就变成了所谓的[全局对象]( https://developer.mozilla.org/en-us/docs/glossary/global_object ) ，而最终结果往往不是软件开发人员最初打算的那样。

Losing track of _this_ when writing Javascript code brings forth a few potential issues. Situations often arise where React or Node (or more specifically the Javascript engine of the web browser) needs to call some method in an object that the developer has defined. However, in this course we avoid issues by using the "this-less" Javascript.
在编写 Javascript 代码时忽略这一点会带来一些潜在的问题。 通常情况下，React 或 Node (或者更确切地说是 web 浏览器的 Javascript 引擎)需要调用开发人员定义的对象中的某个方法。 然而，在本课程中，我们使用“ this-less” Javascript 来避免问题。

One situation leading to the disappearance of _this_ arises when, e.g. we ask Arto to greet in one second using the [setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) method.
例如，当我们要求 Arto 在一秒钟内使用[ setTimeout ]( https://developer.mozilla.org/en-us/docs/web/api/windoworworkerglobalscope/setTimeout )方法问候时，就会出现导致这种情况消失的情况。

```js
const arto = {
  name: 'Arto Hellas',
  greet: function() {
    console.log('hello, my name is', this.name)
  },
}

setTimeout(arto.greet, 1000)  // highlight-line
```

The value of _this_ in Javascript is defined based on how the method is being called. When setTimeout is using the method, it is the Javascript engine that calls the method and _this_ refers to the Timeout object.
在 Javascript 中，这个值是根据方法的调用方式来定义的。 当 setTimeout 使用该方法时，调用该方法的是 Javascript 引擎，这引用了 Timeout 对象。

There are several mechanisms by which the original _this_ can be preserved. One of these is using a method called [bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind):
有几种机制可以保存原始的这一点。 其中一个是使用一种叫做[ bind ]( https://developer.mozilla.org/en-us/docs/web/javascript/reference/global_objects/function/bind )的方法:

```js
setTimeout(arto.greet.bind(arto), 1000)
```

The command <em>arto.greet.bind(arto)</em> creates a new function where it has bound _this_ to point to Arto independent of where and how the method is being called.
命令 em Arto.greet.bind (Arto) / em 创建了一个新函数，其中它将这个函数绑定到 Arto，这个函数指向 Arto 与方法的调用位置和方式无关。

Using [arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) it is possible to solve some of the problems related to _this_. They should not, however, be used as methods for objects because then _this_ does not work at all. We will come back later to the behavior of _this_ in relation to arrow functions.
使用[箭头函数]( https://developer.mozilla.org/en-us/docs/web/javascript/reference/functions/arrow_functions )可以解决与此相关的一些问题。 但是，它们不应该用作对象的方法，因为这样根本不起作用。 稍后我们将回到这个函数与箭头函数的关系。

If you want to gain a better understanding of how _this_ works in Javascript, the internet is full of material about the topic, e.g. the screen cast series [Understand JavaScript's this Keyword in Depth](https://egghead.io/courses/understand-javascript-s-this-keyword-in-depth) by [egghead.io](https://egghead.io) is highly recommended!
如果你想更好地理解 Javascript 的工作原理，互联网上充满了关于这个主题的材料，例如屏幕演示系列[了解 Javascript 的这个关键词的深度]( https://egghead.io/courses/Understand-Javascript-s-this-Keyword-in-Depth  / 关键字)[ egghead.io ]( https://egghead.io  / 文档)强烈推荐！

### Classes
# # # 班级

As mentioned previously, there is no class mechanism like the ones in object-oriented programming languages. There are, however, features in Javascript which make "simulating" object-oriented [classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) possible.
正如前面提到的，没有类机制像面向对象程序设计语言中的类机制。 然而，Javascript 中的一些特性使得“模拟”面向对象[类]( https://developer.mozilla.org/en-us/docs/web/Javascript/reference/classes )成为可能。

Let's take a quick look at the <i>class syntax</i> that was introduced into Javascript along with ES6, which substantially simplifies the definition of classes (or class-like things) in Javascript.
让我们快速看一下与 ES6一起引入到 Javascript 中的 i 类语法 / i，它在很大程度上简化了 Javascript 中类(或类似类的东西)的定义。

In the following we have defined a "class" called Person and two Person objects.
在下面的代码中，我们定义了一个名为 Person 的“类”和两个 Person 对象。

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

const adam = new Person('Adam Ondra', 35)
adam.greet()

const janja = new Person('Janja Garnbret', 22)
janja.greet()
```

When it comes to syntax the classes and the objects created from them are very reminiscent of Java classes and objects. Their behavior is also quite similar to Java objects. At the core they are still objects based on Javascript's [prototype inheritance](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Inheritance). The type of both objects is actually _Object_, since Javascript essentially only defines the types [Boolean, Null, Undefined, Number, String, Symbol, and Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures).
在语法方面，类和由它们创建的对象非常类似于 Java 类和对象。 它们的行为也非常类似于 Java 对象。 在本质上，它们仍然是基于 Javascript 的[原型继承]( https://developer.mozilla.org/en-us/docs/learn/Javascript/objects/inheritance  / 代理)的对象。 这两个对象的类型实际上都是 Object，因为 Javascript 实质上只定义了类型[ Boolean，Null，Undefined，Number，String，Symbol，and Object ]( https://developer.mozilla.org/en-us/docs/web/Javascript/data_structures )。

Introduction of the class syntax is a controversial addition, e.g. check out [Not Awesome: ES6 Classes](https://github.com/petsel/not-awesome-es6-classes) or [Is “Class” In ES6 The New “Bad” Part?](https://medium.com/@rajaraodv/is-class-in-es6-the-new-bad-part-6c4e6fe1ee65)
类语法的引入是一个有争议的补充，例如退出[ Not Awesome: ES6 Classes ]( https://github.com/petsel/Not-Awesome-ES6-Classes )或者[ Is“ Class” In ES6 The New“ Bad” Part? ] ( https://medium.com/@rajaraodv/is-class-in-es6-the-new-bad-part-6c4e6fe1ee65)

The ES6 class syntax is used a lot in "old" React and also in Node.js hence an understanding of it is beneficial even in this course. But since we are using the new [hook](https://reactjs.org/docs/hooks-intro.html) feature of React throughout this course we have no concrete use for Javascript's class syntax.
Es6类语法在“旧的” React 和 Node.js 中被广泛使用，因此即使在本课程中，对它的理解也是有益的。 但是因为我们在整个课程中都使用了 React 的新的[ hook ]( https://reactjs.org/docs/hooks-intro.html )特性，所以我们没有具体使用 Javascript 的类语法。

### Javascript materials
# # Javascript 材料

There exists both good and poor guides for Javascript on the internet. Most of the links on this page relating to Javascript features reference [Mozilla's Javascript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript).
互联网上的 Javascript 指南既有好的，也有不好的。 这个页面上大多数与 Javascript 特性相关的链接都参考了 Mozilla 的 Javascript 指南(Mozilla’ s Javascript Guide) https://developer.Mozilla.org/en-us/docs/web/Javascript。

It is highly recommended to immediately read [A re-introduction to JavaScript (JS tutorial)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript) on Mozillas website.
强烈建议你立即在 Mozillas 网站上阅读[ JavaScript 的重新介绍(JS 教程)]( https://developer.mozilla.org/en-us/docs/web/JavaScript/a_re-introduction_to_javascript 文档)。

If you wish to get to know Javascript deeply there is a great free book series on the internet called [You-Dont-Know-JS](https://github.com/getify/You-Dont-Know-JS).
如果你想深入了解 Javascript，互联网上有一个很棒的免费系列书叫做[ You-Dont-Know-JS ]( https://github.com/getify/You-Dont-Know-JS )。

[egghead.io](https://egghead.io) has plenty of quality screencasts on Javascript, React, and other interesting topics. Unfortunately, some of the material is behind a paywall.
在 Javascript、 React 和其他有趣的主题上有大量高质量的截屏 https://egghead.io。 不幸的是，有些材料是在付费墙后面的。

</div>

