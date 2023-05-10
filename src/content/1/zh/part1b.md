---
mainImage: ../../../images/part-1.svg
part: 1
letter: b
lang: zh
---

<div class="content">

<!-- During the course, we have a goal and a need to learn a sufficient amount of JavaScript in addition to web development.-->
在课程期间，我们有一个目标，需要学习足够的JavaScript，除了网页开发。

<!-- JavaScript has advanced rapidly in the last few years and in this course, we use features from the newer versions. The official name of the JavaScript standard is [ECMAScript](https://en.wikipedia.org/wiki/ECMAScript). At this moment, the latest version is the one released in June of 2022 with the name [ECMAScript®2022](https://www.ecma-international.org/ecma-262/), otherwise known as ES13.-->
JavaScript 在过去的几年里发展迅速，在本课程中，我们使用较新版本的功能。JavaScript 标准的官方名称是[ECMAScript](https://en.wikipedia.org/wiki/ECMAScript)。目前，最新版本是2022年6月发布的以[ECMAScript®2022](https://www.ecma-international.org/ecma-262/)为名称的ES13版本。

<!-- Browsers do not yet support all of JavaScript''s newest features. Due to this fact, a lot of code run in browsers has been <i>transpiled</i> from a newer version of JavaScript to an older, more compatible version.-->
由于这一事实，许多在浏览器中运行的代码已从新版本的JavaScript转译为更老的、更兼容的版本，而浏览器尚不支持JavaScript的最新特性。

<!-- Today, the most popular way to do transpiling is by using [Babel](https://babeljs.io/). Transpilation is automatically configured in React applications created with create-react-app. We will take a closer look at the configuration of the transpilation in [part 7](/en/part7) of this course.-->
今天，最流行的转译方式是使用[Babel](https://babeljs.io/)。 在使用create-react-app创建的React应用程序中会自动配置转译。 我们将在本课程的[第7部分](/en/part7)中更仔细地查看转译的配置。

<!-- [Node.js](https://nodejs.org/en/) is a JavaScript runtime environment based on Google's [Chrome V8](https://developers.google.com/v8/) JavaScript engine and works practically anywhere - from servers to mobile phones. Let's practice writing some JavaScript using Node. The latest versions of Node already understand the latest versions of JavaScript, so the code does not need to be transpiled.-->
[Node.js](https://nodejs.org/en/) 是一个基于谷歌的[Chrome V8](https://developers.google.com/v8/) JavaScript引擎的JavaScript运行环境，几乎可以在任何地方运行 - 从服务器到手机。让我们来练习一些使用Node编写的JavaScript。最新版本的Node已经理解最新版本的JavaScript，因此不需要转译代码。

<!-- The code is written into files ending with <i>.js</i> that are run by issuing the command <em>node name\_of\_file.js</em>-->
代码被写入以<i>.js</i>结尾的文件中，通过发出命令<em>node name\_of\_file.js</em>来运行它们。

<!-- It is also possible to write JavaScript code into the Node.js console, which is opened by typing _node_ in the command line, as well as into the browser''s developer tool console. [The newest revisions of Chrome handle the newer features of JavaScript pretty well](http://kangax.github.io/compat-table/es2016plus/) without transpiling the code. Alternatively, you can use a tool like [JS Bin](https://jsbin.com/?js,console).-->
也可以将 JavaScript 代码写入 Node.js 控制台，该控制台可以通过在命令行中输入`node`来打开，以及浏览器的开发者工具控制台。[最新版本的 Chrome 可以很好地处理 JavaScript 的新特性](http://kangax.github.io/compat-table/es2016plus/)，而无需转译代码。另外，你也可以使用像 [JS Bin](https://jsbin.com/?js,console) 这样的工具。

<!-- JavaScript is sort of reminiscent, both in name and syntax, to Java. But when it comes to the core mechanism of the language they could not be more different. Coming from a Java background, the behavior of JavaScript can seem a bit alien, especially if one does not make the effort to look up its features.-->
JavaScript在名字和语法上有点像Java，但是当涉及到语言的核心机制时，它们却大相径庭。对于来自Java背景的人来说，JavaScript的行为可能有点奇怪，特别是如果不费力查找它的特性的话。

<!-- In certain circles, it has also been popular to attempt "simulating" Java features and design patterns in JavaScript. We do not recommend doing this as the languages and respective ecosystems are ultimately very different.-->
在某些圈子里，试图用JavaScript“模拟”Java的特性和设计模式也是很流行的。但我们不推荐这么做，因为这两种语言及其各自的生态系统最终是非常不同的。

### Variables

<!-- In JavaScript there are a few ways to go about defining variables:-->
在JavaScript中，有几种方式来定义变量：

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

<!-- [const](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) does not define a variable but a <i>constant</i> for which the value can no longer be changed. On the other hand, [let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) defines a normal variable.-->
[const](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/const) 不是定义一个变量，而是定义一个<i>常量</i>，其值不能再次更改。另一方面，[let](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/let) 定义了一个普通变量。

<!-- In the example above, we also see that the variable''s data type can change during execution. At the start, _y_ stores an integer; at the end, it stores a string.-->
在上面的例子中，我们也看到变量的数据类型可以在执行过程中改变。一开始，_y_存储一个整数；最后，它存储一个字符串。

<!-- It is also possible to define variables in JavaScript using the keyword [var](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var). var was, for a long time, the only way to define variables. const and let were only recently added in version ES6. In specific situations, var works in a different way compared to variable definitions in most languages - see [JavaScript Variables - Should You Use let, var or const? on Medium](https://medium.com/craft-academy/javascript-variables-should-you-use-let-var-or-const-394f7645c88f) or [Keyword: var vs. let on JS Tips](http://www.jstips.co/en/javascript/keyword-var-vs-let/) for more information. During this course the use of var is ill-advised and you should stick with using const and let!-->
在JavaScript中，也可以使用关键字[var](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var)定义变量。var很长一段时间以来一直是定义变量的唯一方法。const和let最近才在ES6版本中添加。在特定情况下，var与大多数语言中的变量定义方式有所不同-有关更多信息，请参阅[Medium上的JavaScript变量-应该使用let，var还是const？](https://medium.com/craft-academy/javascript-variables-should-you-use-let-var-or-const-394f7645c88f)或[JS技巧上的关键字：var与let](http://www.jstips.co/en/javascript/keyword-var-vs-let/)。在本课程中，不建议使用var，应该坚持使用const和let！
<!-- You can find more on this topic on YouTube - e.g. [var, let and const - ES6 JavaScript Features](https://youtu.be/sjyJBL5fkp8)-->
你可以在 YouTube 上找到更多关于这个主题的内容 - 例如[var，let 和 const - ES6 JavaScript 特性](https://youtu.be/sjyJBL5fkp8)

### Arrays

<!-- An [array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) and a couple of examples of its use:-->
一个[数组](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)和一些它的使用的例子：

```js
const t = [1, -1, 3]

t.push(5)

console.log(t.length) // 4 is printed
console.log(t[1])     // -1 is printed

t.forEach(value => {
  console.log(value)  // numbers 1, -1, 3, 5 are printed, each to own line
})
```

<!-- Notable in this example is the fact that the contents of the array can be modified even though it is defined as a _const_. Because the array is an object, the variable always points to the same object. However, the content of the array changes as new items are added to it.-->
在这个例子中值得注意的是，尽管它定义为`const`，数组的内容仍然可以被修改。因为数组是一个对象，变量始终指向同一个对象。但是，随着新项目的添加，数组的内容也会改变。

<!-- One way of iterating through the items of the array is using _forEach_ as seen in the example. _forEach_ receives a <i>function</i> defined using the arrow syntax as a parameter.-->
一种遍历数组元素的方法是使用`forEach`，如示例所示。`forEach`接受一个使用箭头语法定义的<i>函数</i>作为参数。

```js
value => {
  console.log(value)
}
```

<!-- forEach calls the function <i>for each of the items in the array</i>, always passing the individual item as an argument. The function as the argument of forEach may also receive [other arguments](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach).-->
`forEach`调用函数<i>对数组中的每个项目</i>，总是将单个项目作为参数传递。作为`forEach`参数的函数也可以接收[其他参数](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)。

<!-- In the previous example, a new item was added to the array using the method [push](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push). When using React, techniques from functional programming are often used. One characteristic of the functional programming paradigm is the use of [immutable](https://en.wikipedia.org/wiki/Immutable_object) data structures. In React code, it is preferable to use the method [concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat), which creates a new array with the added item. This ensures the original array remains unchanged.-->
在前面的例子中，使用[push](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push)方法向数组中添加了一个新项目。在使用React时，经常使用函数式编程的技术。函数式编程范式的一个特征是使用[immutable](https://en.wikipedia.org/wiki/Immutable_object)数据结构。在React代码中，最好使用[concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat)方法，它会创建一个新数组，并将添加的项目添加到其中。这可以确保原始数组保持不变。

```js
const t = [1, -1, 3]

const t2 = t.concat(5)  // creates new array

console.log(t)  // [1, -1, 3] is printed
console.log(t2) // [1, -1, 3, 5] is printed
```

<!-- The method call _t.concat(5)_ does not add a new item to the old array but returns a new array which, besides containing the items of the old array, also contains the new item.-->
方法调用_t.concat(5)_不会向旧数组中添加新项，而是返回一个新数组，除了包含旧数组的数据项外，还包含新的数据项。

<!-- There are plenty of useful methods defined for arrays. Let''s look at a short example of using the [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) method.-->
有许多有用的数组方法。让我们来看一个使用[map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)方法的简短示例。

```js
const t = [1, 2, 3]

const m1 = t.map(value => value * 2)
console.log(m1)   // [2, 4, 6] is printed
```

<!-- Based on the old array, map creates a <i>new array</i>, for which the function given as a parameter is used to create the items. In the case of this example, the original value is multiplied by two.-->
根据旧数组，`map`创建一个<i>新数组</i>，其中使用给定的函数作为参数来创建项目。在本例中，是原始值乘以2。

<!-- Map can also transform the array into something completely different:-->
Map也可以把数组转换成完全不同的东西：

```js
const m2 = t.map(value => '<li>' + value + '</li>')
console.log(m2)
// [ '<li>1</li>', '<li>2</li>', '<li>3</li>' ] is printed
```

<!-- Here an array filled with integer values is transformed into an array containing strings of HTML using the map method. In [part 2](/en/part2) of this course, we will see that map is used quite frequently in React.-->
这里，一个用整数值填充的数组通过`map`方法转换成一个包含HTML字符串的数组。在本课程的[第2章](/en/part2)中，我们将会看到`map`在React中被频繁使用。

<!-- Individual items of an array are easy to assign to variables with the help of the [destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment).-->
使用[解构赋值](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)可以很容易地将数组中的各个项目分配给变量。

```js
const t = [1, 2, 3, 4, 5]

const [first, second, ...rest] = t

console.log(first, second)  // 1, 2 is printed
console.log(rest)          // [3, 4, 5] is printed
```

<!-- Thanks to the assignment, the variables _first_ and _second_ will receive the first two integers of the array as their values. The remaining integers are "collected" into an array of their own which is then assigned to the variable _rest_.-->
多亏这个特性，变量_first_和_second_将会接收数组中的前两个整数作为它们的值。剩余的整数被“收集”到一个自己的数组中，然后被分配给变量_rest_。

### Objects

<!-- There are a few different ways of defining objects in JavaScript. One very common method is using [object literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#Object_literals), which happens by listing its properties within braces:-->
在JavaScript中有几种不同的定义对象的方法。一种非常常见的方法是使用[对象文字](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#Object_literals)，即在大括号内列出其属性：

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

<!-- The values of the properties can be of any type, like integers, strings, arrays, objects...-->
属性的值可以是任何类型，比如整数、字符串、数组、对象...

<!-- The properties of an object are referenced by using the "dot" notation, or by using brackets:-->
使用"点"符号或者括号来引用一个对象的属性：

```js
console.log(object1.name)         // Arto Hellas is printed
const fieldName = 'age'
console.log(object1[fieldName])    // 35 is printed
```

<!-- You can also add properties to an object on the fly by either using dot notation or brackets:-->
你也可以通过点符号或者括号来动态地给对象添加属性：

```js
object1.address = 'Helsinki'
object1['secret number'] = 12341
```

<!-- The latter of the additions has to be done by using brackets because when using dot notation, <i>secret number</i> is not a valid property name because of the space character.-->
最后的添加必须使用括号完成，因为使用点符号时，<i>secret number</i> 不是一个有效的属性名，因为它包含空格字符。

<!-- Naturally, objects in JavaScript can also have methods. However, during this course, we do not need to define any objects with methods of their own. This is why they are only discussed briefly during the course.-->
自然，JavaScript中的对象也可以有方法。但是，在本课程中，我们不需要定义任何具有自己方法的对象。这就是为什么它们在课程中只被简单地讨论。

<!-- Objects can also be defined using so-called constructor functions, which results in a mechanism reminiscent of many other programming languages, e.g. Java''s classes. Despite this similarity, JavaScript does not have classes in the same sense as object-oriented programming languages. There has been, however, an addition of the <i>class syntax</i> starting from version ES6, which in some cases helps structure object-oriented classes.-->
也可以使用所谓的构造函数定义对象，这样就会形成一种类似于许多其他编程语言（例如Java的类）的机制。尽管有这种相似性，JavaScript并不具有像面向对象编程语言那样的类。然而，从ES6版本开始，<i>类语法</i>增加了，在某些情况下有助于结构化面向对象类。

### Functions

<!-- We have already become familiar with defining arrow functions. The complete process, without cutting corners, of defining an arrow function is as follows:-->
我们已经熟悉了定义箭头函数。完整的过程，不略过任何步骤，定义一个箭头函数如下：

```js
const sum = (p1, p2) => {
  console.log(p1)
  console.log(p2)
  return p1 + p2
}
```

<!-- and the function is called as can be expected:-->

而且该功能可以被如下调用：

```js
const result = sum(1, 5)
console.log(result)
```

<!-- If there is just a single parameter, we can exclude the parentheses from the definition:-->
如果只有一个参数，我们可以从定义中排除括号：

```js
const square = p => {
  console.log(p)
  return p * p
}
```

<!-- If the function only contains a single expression then the braces are not needed. In this case, the function only returns the result of its only expression. Now, if we remove console printing, we can further shorten the function definition:-->
如果函数只包含一个表达式，那么括号是不必要的。在这种情况下，函数只返回其唯一表达式的结果。现在，如果我们删除控制台打印，我们可以进一步缩短函数定义：

```js
const square = p => p * p
```

<!-- This form is particularly handy when manipulating arrays - e.g. when using the map method:-->
这个表格特别方便用于操作数组，比如使用 `map` 方法时：

```js
const t = [1, 2, 3]
const tSquared = t.map(p => p * p)
// tSquared is now [1, 4, 9]
```

<!-- The arrow function feature was added to JavaScript only a couple of years ago, with version [ES6](http://es6-features.org/). Before this, the only way to define functions was by using the keyword _function_.-->
ES6 仅仅几年前就添加了箭头函数特性，[ES6](http://es6-features.org/) 版本。在此之前，定义函数的唯一方法是使用关键字 _function_。

<!-- There are two ways to reference the function; one is giving a name in a [function declaration](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function).-->
有两种方法引用函数；一种是在[函数声明](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)中给它一个名字。

```js
function product(a, b) {
  return a * b
}

const result = product(2, 6)
// result is now 12
```

<!-- The other way to define the function is by using a [function expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/function). In this case, there is no need to give the function a name and the definition may reside among the rest of the code:-->
另一种定义函数的方法是使用[函数表达式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/function)。在这种情况下，无需给函数命名，定义可以存在于其他代码中：

```js
const average = function(a, b) {
  return (a + b) / 2
}

const result = average(2, 5)
// result is now 3.5
```

<!-- During this course, we will define all functions using the arrow syntax.-->
在本课程中，我们将使用箭头语法定义所有函数。

</div>

<div class="tasks">

<!--   <h3>Exercises 1.3.-1.5.</h3>-->
<h3>练习1.3.-1.5.</h3>

<i>We continue building the application that we started working on in the previous exercises. You can write the code into the same project since we are only interested in the final state of the submitted application.</i>

我们继续构建之前的应用。你可以将代码写到同一个项目中，因为我们只关心最终提交的应用。

<!-- **Pro-tip:** you may run into issues when it comes to the structure of the <i>props</i> that components receive. A good way to make things more clear is by printing the props to the console, e.g. as follows:-->
**提示：** 当涉及到组件接收的<i>props</i>的结构时，您可能会遇到问题。一个简单的方法是将props打印到控制台，例如：

```js
const Header = (props) => {
  console.log(props) // highlight-line
  return <h1>{props.course}</h1>
}
```

<!-- If and <i>when</i> you encounter an error message-->
如果你遇到错误信息，当你遇到时。

<!-- > <i>Objects are not valid as a React child</i>-->
<i>作为React子组件，对象无效</i>

<!-- keep in mind the things told [here](/en/part1/introduction_to_react#do-not-render-objects).-->
记住这里所说的事情[here](/zh/part1/introduction_to_react#do-not-render-objects)。

<!--   <h4>1.3: course information step3</h4>-->
<h4>1.3：课程信息第三步</h4>

<!-- Let''s move forward to using objects in our application. Modify the variable definitions of the <i>App</i> component as follows and also refactor the application so that it still works:-->
让我们继续使用对象来构建我们的应用程序，修改<i>App</i>组件的变量定义如下，并且重构应用程序以使其仍然有效：

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

<!--   <h4>1.4: course information step4</h4>-->
<h4>1.4：课程信息第四步</h4>

<!-- And then place the objects into an array. Modify the variable definitions of <i>App</i> into the following form and modify the other parts of the application accordingly:-->
然后将对象放入数组中。将<i>App</i>变量定义修改为以下形式，并相应地修改应用程序的其他部分：

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

<!-- **NB** at this point <i>you can assume that there are always three items</i>, so there is no need to go through the arrays using loops. We will come back to the topic of rendering components based on items in arrays with a more thorough exploration in the [next part of the course](../part2).-->
**注意** 在这一点上<i>你可以假设总是有三个项目</i>，因此不需要使用循环遍历数组。我们将在[下一章节课程](../part2)中更深入地探讨基于数组中项目渲染组件的主题。

<!-- However, do not pass different objects as separate props from the <i>App</i> component to the components <i>Content</i> and <i>Total</i>. Instead, pass them directly as an array:-->
但是，不要从<i>App</i>组件传递不同的对象作为单独的props给<i>Content</i>和<i>Total</i>组件，而是直接将它们作为数组传递：

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

<!--   <h4>1.5: course information step5</h4>-->
<h4>1.5：课程信息第五步</h4>

<!-- Let''s take the changes one step further. Change the course and its parts into a single JavaScript object. Fix everything that breaks.-->
让我们把变化更进一步，把课程和它的部分变成一个单一的JavaScript对象，修复一切出错的地方。

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

<!-- Because this course uses a version of React containing React Hooks we do not need to define objects with methods. **The contents of this chapter are not relevant to the course** but are certainly in many ways good to know. In particular, when using older versions of React one must understand the topics of this chapter.-->
因为本课程使用了包含React Hooks的版本，所以我们不需要定义带有方法的对象。**本章的内容与本课程无关**，但在许多方面都是值得了解的。特别是，当使用较旧版本的React时，必须理解本章的主题。

<!-- Arrow functions and functions defined using the _function_ keyword vary substantially when it comes to how they behave with respect to the keyword [this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this), which refers to the object itself.-->
箭头函数和使用`function`关键字定义的函数在涉及[`this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)关键字（指的是对象本身）时的行为有很大的不同。

<!-- We can assign methods to an object by defining properties that are functions:-->
我们可以通过定义属性为函数来给对象指派方法：

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

<!-- Methods can be assigned to objects even after the creation of the object:-->
对象创建后也可以给对象分配方法：

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

<!-- Let''s slightly modify the object:-->
让我们稍微修改一下这个对象：

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

<!-- Now the object has the method _doAddition_ which calculates the sum of numbers given to it as parameters. The method is called in the usual way, using the object <em>arto.doAddition(1, 4)</em> or by storing a <i>method reference</i> in a variable and calling the method through the variable: <em>referenceToAddition(10, 15)</em>.-->
现在，这个对象具有名为_doAddition_的方法，用于计算给定给它的参数的和。该方法以通常的方式被调用，使用对象<em>arto.doAddition(1, 4)</em>或者通过存储<i>方法引用</i>在变量中，通过变量调用方法：<em>referenceToAddition(10, 15)</em>。

<!-- If we try to do the same with the method _greet_ we run into an issue:-->
如果我们尝试用_greet_方法做同样的事情，我们会遇到问题：

```js
arto.greet()       // "hello, my name is Arto Hellas" gets printed

const referenceToGreet = arto.greet
referenceToGreet() // prints "hello, my name is undefined"
```

<!-- When calling the method through a reference, the method loses knowledge of what the original _this_ was. Contrary to other languages, in JavaScript the value of [this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) is defined based on <i>how the method is called</i>. When calling the method through a reference the value of _this_ becomes the so-called [global object](https://developer.mozilla.org/en-US/docs/Glossary/Global_object) and the end result is often not what the software developer had originally intended.-->
当通过引用调用方法时，该方法会失去有关原始`this`的信息。与其他语言不同，在JavaScript中，[this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)的值是取决于<i>如何调用该方法</i>来定义的。当通过引用调用方法时，this的值变成所谓的[全局对象](https://developer.mozilla.org/en-US/docs/Glossary/Global_object)，最终的结果通常不是软件开发人员最初所期望的。

<!-- Losing track of _this_ when writing JavaScript code brings forth a few potential issues. Situations often arise where React or Node (or more specifically the JavaScript engine of the web browser) needs to call some method in an object that the developer has defined. However, in this course, we avoid these issues by using "this-less" JavaScript.-->
遗失跟踪_this_在编写JavaScript代码时会带来一些潜在的问题。经常会出现React或Node（或更具体地说是网页浏览器的JavaScript引擎）需要调用开发人员定义的某个对象中的某个方法的情况。然而，在本课程中，我们通过使用“无this”的JavaScript来避免这些问题。

<!-- One situation leading to the "disappearance" of _this_ arises when we set a timeout to call the _greet_ function on the _arto_ object, using the [setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) function.-->
一种导致"消失"的情况出现时，我们使用[setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout)函数在_arto_对象上调用_greet_函数设置了超时。

```js
const arto = {
  name: 'Arto Hellas',
  greet: function() {
    console.log('hello, my name is ' + this.name)
  },
}

setTimeout(arto.greet, 1000)  // highlight-line
```

<!-- As mentioned, the value of _this_ in JavaScript is defined based on how the method is being called. When <em>setTimeout</em> is calling the method, it is the JavaScript engine that actually calls the method and, at that point, _this_ refers to the global object.-->
如前所述，JavaScript中的_this_的值取决于方法的调用方式。当<em>setTimeout</em>调用该方法时，实际上是JavaScript引擎调用该方法，此时_this_指向全局对象。

<!-- There are several mechanisms by which the original _this_ can be preserved. One of these is using a method called [bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind):-->
有几种机制可以保留原来的_this_ 。其中之一是使用一种叫做[bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)的方法：

```js
setTimeout(arto.greet.bind(arto), 1000)
```

<!-- Calling <em>arto.greet.bind(arto)</em> creates a new function where _this_ is bound to point to Arto, independent of where and how the method is being called.-->
调用<em>arto.greet.bind(arto)</em>创建一个新函数，其中_this_绑定到指向Arto，独立于该方法的调用方式和位置。

<!-- Using [arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) it is possible to solve some of the problems related to _this_. They should not, however, be used as methods for objects because then _this_ does not work at all. We will come back later to the behavior of _this_ in relation to arrow functions.-->
使用[箭头函数](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)可以解决与_this_有关的一些问题。但是它们不应该被用作对象的方法，因为这样_this_就完全无法工作了。我们稍后将回顾_this_与箭头函数之间的行为。

<!-- If you want to gain a better understanding of how _this_ works in JavaScript, the Internet is full of material about the topic, e.g. the screencast series [Understand JavaScript''s this Keyword in Depth](https://egghead.io/courses/understand-javascript-s-this-keyword-in-depth) by [egghead.io](https://egghead.io) is highly recommended!-->
如果你想更好地理解JavaScript中的`this`如何工作，互联网上有大量关于这个主题的资料，例如[egghead.io](https://egghead.io)推荐的屏幕录制系列[深入理解JavaScript的this关键字](https://egghead.io/courses/understand-javascript-s-this-keyword-in-depth)！

### Classes

<!-- As mentioned previously, there is no class mechanism in JavaScript like the ones in object-oriented programming languages. There are, however, features to make "simulating" object-oriented [classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) possible.-->
正如先前提及，JavaScript中没有像面向对象编程语言中那样的类机制。但是，还是有一些特性可以使“模拟”面向对象[类](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)成为可能。

<!-- Let''s take a quick look at the <i>class syntax</i> that was introduced into JavaScript with ES6, which substantially simplifies the definition of classes (or class-like things) in JavaScript.-->
让我们快速看一看ES6引入的<i>类语法</i>，它大大简化了JavaScript中定义类（或类似东西）的过程。

<!-- In the following example we define a "class" called Person and two Person objects:-->
在下面的例子中，我们定义一个叫做Person的“类”，以及两个Person对象：

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

const adam = new Person('Adam Ondra', 29)
adam.greet()

const janja = new Person('Janja Garnbret', 23)
janja.greet()
```

<!-- When it comes to syntax, the classes and the objects created from them are very reminiscent of Java classes and objects. Their behavior is also quite similar to Java objects. At the core, they are still objects based on JavaScript''s [prototypal inheritance](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Inheritance). The type of both objects is actually _Object_, since JavaScript essentially only defines the types [Boolean, Null, Undefined, Number, String, Symbol, BigInt, and Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures).-->
当谈到语法时，类及其所创建的对象非常类似于Java类和对象。它们的行为也与Java对象非常相似。本质上，它们仍然是基于JavaScript的[原型继承]（https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Inheritance）的对象。两个对象的类型实际上都是_Object_，因为JavaScript本质上只定义了[Boolean，Null，Undefined，Number，String，Symbol，BigInt和Object]（https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures）类型。

<!-- The introduction of the class syntax was a controversial addition. Check out [Not Awesome: ES6 Classes](https://github.com/petsel/not-awesome-es6-classes) or [Is “Class” In ES6 The New “Bad” Part? on Medium](https://medium.com/@rajaraodv/is-class-in-es6-the-new-bad-part-6c4e6fe1ee65) for more details.-->
类语法的引入是一个有争议的增加。查看[不棒：ES6类](https://github.com/petsel/not-awesome-es6-classes)或[Medium中：“类”在ES6中是新的“坏”部分？](https://medium.com/@rajaraodv/is-class-in-es6-the-new-bad-part-6c4e6fe1ee65)以获取更多详细信息。

<!-- The ES6 class syntax is used a lot in "old" React and also in Node.js, hence an understanding of it is beneficial even in this course. However, since we are using the new [Hooks](https://reactjs.org/docs/hooks-intro.html) feature of React throughout this course, we have no concrete use for JavaScript''s class syntax.-->
ES6 类语法在“旧”React和Node.js中被大量使用，因此了解它对本课程也有益处。但由于我们在本课程中使用了React的新[Hooks](https://reactjs.org/docs/hooks-intro.html)功能，因此我们对JavaScript的类语法没有具体的用途。

### JavaScript materials

<!-- There exist both good and poor guides for JavaScript on the Internet. Most of the links on this page relating to JavaScript features reference [Mozilla''s JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript).-->
存在于互联网上的JavaScript指南有好有坏。大多数与JavaScript特性有关的链接参考[Mozilla的JavaScript指南](https://developer.mozilla.org/en-US/docs/Web/JavaScript)。

<!-- It is highly recommended to immediately read [A re-introduction to JavaScript (JS tutorial)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript) on Mozilla''s website.-->
强烈推荐立即在Mozilla的网站上阅读[JavaScript（JS教程）重新介绍](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript)。

<!-- If you wish to get to know JavaScript deeply there is a great free book series on the Internet called [You-Dont-Know-JS](https://github.com/getify/You-Dont-Know-JS).-->
如果你想深入了解JavaScript，网上有一个很棒的免费图书系列叫[你不知道的JS](https://github.com/getify/You-Dont-Know-JS)。

<!-- Another great resource for learning JavaScript is [javascript.info](https://javascript.info).-->
另一个学习JavaScript的极好资源是[javascript.info](https://javascript.info)。

<!-- The free and highly engaging book [Eloquent JavaScript](https://eloquentjavascript.net) takes you from the basics to interesting stuff quickly. It is a mixture of theory projects and exercises and covers general programming theory as well as the JavaScript language.-->
[《雄辩的JavaScript》](https://eloquentjavascript.net) 这本免费而又非常引人入胜的书，可以让你从基础知识迅速进阶到有趣的东西。它是理论项目和练习的混合体，涵盖了一般的编程理论以及JavaScript语言。

<!-- [Namaste 🙏 JavaScript](https://www.youtube.com/playlist?list=PLlasXeu85E9cQ32gLCvAvr9vNaUccPVNP) is another great and highly recommended free JavaScript tutorial in order to understand how JS works under the hood. Namaste JavaScript is a pure in-depth JavaScript course released for free on YouTube. It will cover the core concepts of JavaScript in detail and everything about how JS works behind the scenes inside the JavaScript engine.-->
[Namaste 🙏 JavaScript](https://www.youtube.com/playlist?list=PLlasXeu85E9cQ32gLCvAvr9vNaUccPVNP) 是另一个极力推荐的免费 JavaScript 教程，可以帮助您了解 JS 如何在背后运行。Namaste JavaScript 是一门纯粹的深入 JavaScript 课程，可免费在 YouTube 上发布。它将详细介绍 JavaScript 的核心概念，以及 JavaScript 引擎背后的所有内容。

<!-- [egghead.io](https://egghead.io) has plenty of quality screencasts on JavaScript, React, and other interesting topics. Unfortunately, some of the material is behind a paywall.-->
[egghead.io](https://egghead.io) 拥有大量关于JavaScript、React以及其他有趣主题的优质屏幕录像。不幸的是，其中一些材料是收费的。

</div>
