---
mainImage: ../../../images/part-9.svg
part: 9
letter: a
lang: zh
---

<div class="content">
<!-- TypeScript is a programming language designed for large-scale JavaScript development created by Microsoft. For example Microsoft's _Azure Management Portal_ (1,2 million lines of code) and the _Visual Studio Code_ (300 000 lines of code) have both been written in TypeScript. To support building large-scale JavaScript applications, TypeScript offers e.g. better development-time tooling, static code analysis, compile-time type checking and code level documentation. -->
Typescript 是微软为大规模 JavaScript 开发而设计的一种编程语言。 例如，微软的 Azure 管理门户(120万行代码)和 Visual Studio 代码(30万行代码)都是用TypeScript编写的。 为了支持构建大规模的 JavaScript 应用，TypeScript 提供了更好的开发时工具、开发静态程序分析、编译时类型检查和代码级的文档。

### Main principle
【主要原则】

<!-- TypeScript is a typed superset of JavaScript, and eventually it's compiled into plain JavaScript code. Programmer is even able to decide the version of the generated code, as long as it's ECMAScript 3 or newer. Typescript being a superset of JavaScript means that it includes all the features of JavaScript and its own additional features as well. In fact, all existing JavaScript code is actually valid TypeScript. -->
TypeScript 是一个类型化的 JavaScript 超集，它最终会被编译成纯的 JavaScript 代码。 程序员甚至可以决定它生成的Javascript代码的版本，只要是 ECMAScript 3以后的版本。 Typescript 是 JavaScript 的超集，这意味着它包含了  JavaScript 的所有特性并同时增加了自己的一些特性。事实上，所有现有的 JavaScript 代码实际上都是合法的TypeScript。 

<!-- TypeScript consists of three separate, but mutually fulfilling parts:  -->
TypeScript是由三个独立但相互满足的部分组成: 

- The language
- 语言
- The compiler
- 编译器
- The language Service
- 语言服务

![](../../images/9/1.png)

<!--<i>The language</i> concists of syntax, keywords and type annotations. The syntax is similar to but not the same as JavaScript syntax. From the three parts of TypeScript programmers have the most direct contact with the language.--> 
语言包括<i>语法、关键字和类型注解</i>。 语法类似于 JavaScript 语法，但不太一样。 从TypeScript的三个部分来看，程序员与语言有着最直接的接触。



<!--<i>The compiler</i> is responsible for type information erasure (i.e. removing the typing information) and the code transformations. The code transformations enable TypeScript code to be transpiled into executable JavaScript. Everything related to the types is removed at compile-time, so TypeScript isn't actually genuine statically typed code.--> 
<i>编译器</i> 负责类型信息擦除(即删除类型信息)和代码转换。 代码转换使得 TypeScript 代码可以转换成可执行的 JavaScript。 所有与类型相关的代码都在编译时被删除，所以 TypeScript 实际上不是真正意义上的静态类型代码。

<!-- Traditionally  <i>compiling</i>  means that code is transformed from a human readable format to a machine readable format. In TypeScript human readable source code is transformed into another human readable source code, so the correct term would actually be <i>transpiling</i>. However compiling has been the most commonly used term in this context, so we will continue to use it.  -->
传统上，<i>编译</i>意味着代码从人类可读的格式转换为机器可读的格式。 在TypeScript中，人类可读的源代码被转换成另一种人类可读的源代码，因此正确的术语应该是 <i>转译</i>。 然而，编译是这个上下文中最常用的术语，因此我们将继续使用它。

<!-- The compiler also performs a static code analysis. It can emit warnings or errors if it finds a reason to do so, and it can be set to perform additional tasks such as combining the generated code into a single file.  -->
编译器也会执行一个静态程序分析。 如果它找到了对应的理由，它可以发出警告或错误，并且可以将它设置为执行一些附加任务，例如将生成的代码合并到单个文件中。


<!--<i>The language service</i> collects type information from the source code. Development tools can use the type information for providing intellisense, type hints and possible refactoring alternatives.-->
<i>语言服务</i> 是指从源代码中收集类型信息。 开发工具可以使用类型信息来提供智能感知、类型提示和可能的重构替代方案。


### TypeScript key language features
【TypeScript的主要语言特性】


<!-- In this section we will describe some of the key features of the TypeScript language. The intent is to provide you with basic understanding of TypeScripts' key features to help you understand more of what is to come during this course. -->
在本节中，我们将描述TypeScript语言的一些关键特性。 目的是让你对TypeScript的关键特性有基本的了解，以帮助您了解本课程的更多内容。

#### Type annotations
【类型注解】

<!-- Type annotations in TypeScript are a lightweight way to record the intended <i>contract</i> of a function or a variable.  -->
Typescript 中的类型注解是一种用于记录函数或变量的预期 <i>约定</i> 的轻量级的方法。 

<!-- In the example below we have defined a function <i>birthdayGreeter</i> which accepts two arguments, one of type string and one of type number.  -->
在下面的示例中，我们定义了一个函数<i>birthdayGreeter</i>，它接受两个参数，一个类型为 string，另一个类型为 number。

<!-- The function will return a string. -->
该函数将返回一个字符串。


```js
const birthdayGreeter = (name: string, age: number): string => {
  return `Happy birthday ${name}, you are now ${age} years old!`;
};

const birthdayHero = "Jane User";
const age = 22;

console.log(birthdayGreeter(birthdayHero, 22));
```

#### Structural typing
【结构化类型】
<!-- TypeScript is a structurally typed language. In structural typing two elements are considered to be compatible with one another if for each feature within the type of the first element a corresponding and identical feature exists within the type of the second element. Two types are considered to be identical if they are compatible with each other. -->
TypeScript 是一种结构化类型语言。 在结构化类型中，如果第一个元素的类型中的每个特征在第二个元素的类型中存在对应的、相同的特征，则认为两个元素相互兼容。 如果两种类型彼此兼容，则认为它们是相同的。 

#### Type inference
【类型推断】
<!-- The TypeScript compiler can attempt to infer the type information if no type has been specified. Variable's type can be inferred based on its assigned value and its usage. The type inference take place when initializing variables and members, setting parameter default values, and determining function return types. -->
如果没有指定类型，TypeScript 编译器可以尝试推断类型信息。 变量的类型可以根据它的赋值和用法来推断。 类型推断发生在初始化变量和成员、设置参数默认值以及确定函数返回类型时。



<!-- For example consider the function <i>add</i> -->
例如，考虑函数<i>add</i>

```js
const add = (a: number, b: number) => {
  /* The return value is used to determine
     the return type of the function */
  return a + b;
}
```


<!-- The function's return value is inferred by retracing the code back to the return expression. The return expression performs an addition of the parameters a and b. We can see that a and b are numbers based on their types. Thus, we can infer the return value to be of type <i>number</i>. -->
通过将返回值表达式回溯到代码中，可以推断出函数的返回值。 返回表达式执行参数 a 和 b 的加法操作。 我们可以看到 a 和 b 是基于它们的数字类型的。 因此，我们可以推断返回值为<i>number</i> 类型。



<!-- As a more complex example let's consider the code below. If you have not used TypeScript before, this example might be a bit complex. But do not worry, you can safely skip this example for now. -->
作为一个更复杂的示例，让我们考虑下面的代码。 如果您以前没有使用过TypeScript，那么这个示例可能有点复杂。 但是不用担心，您现在可以毫无顾虑地跳过这个例子。

```js
type CallsFunction = (callback: (result: string) => any) => void;

const func: CallsFunction = (cb) => {
  cb('done');
  cb(1);
}

func((result) => {
  return result;
});
```



<!-- First we have a declaration of a [type alias](https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-aliases) called <i>CallsFunction</i>. -->
首先，我们有一个名为<i>CallsFunction</i> 的[type 别名](https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-aliases)声明。
<!-- CallsFunction is a function type with one parameter <i>callback</i>. The parameter <i>callback</i> is of type function which takes a string parameters and returns [any](http://www.typescriptlang.org/docs/handbook/basic-types.html#any) value.  As we will learn later in this part <i>any</i> is a kind of "wildcard" type that can represent any type. -->
Callsfunction 是带有一个参数<i>callback</i> 的函数类型。 参数<i>callback</i> 是一个类型为 function 的函数，它接受一个字符串参数并返回[any](http://www.typescriptlang.org/docs/handbook/basic-types.html#any)值。 正如我们将在本章节后面了解到的，<i>any</i> 是一种可以表示任何类型的“通配符”类型。 



<!-- Next we define the function <i>func</i> of  type <i>CallsFunction</i>. From the function's type we can infer that its parameter function cb will only accept a string argument. To demonstrate this, there is also an example where the parameter function is called with a numeric value, which will cause an error in TypeScript.  -->
接下来我们定义类型为<i>CallsFunction</i> 的函数<i>func</i>。 从函数的类型我们可以推断出它的参数函数 cb 将只接受字符串参数。 为了演示这一点，还有一个示例，使用数值调用参数函数，这将在TypeScript中导致错误。



<!-- Lastly we call <i>func</i> giving it the following function as a parameter -->
最后我们调用<i>func</i>，给它下面的函数作为参数

```js
(result) => {
  return result;
}
```



<!-- Despite the types of the parameter function not being defined, we can infer from the calling context that the argument <i>result</i> is of the type string. -->
尽管没有定义参数函数的类型，但是我们可以从上下文调用中推断出参数<i>result</i> 的类型是 string。

#### Type erasure
【类型擦除】

<!-- TypeScript removes all type system constructs during compilation. -->
在编译期间，TypeScript会 删除所有类型的系统构造。

<!-- Input: -->
输入:

```js
let x: SomeType;
```

<!-- Output: -->
输出:

```js
let x;
```



<!-- This means that no type information remains at runtime - nothing says that some variable x was declared as being of type <i>SomeType</i>. -->
这意味着在运行时不会保留任何类型信息——没有任何信息表明某个变量 x 被声明为<i>SomeType</i> 类型。

<!-- The lack of runtime type information can be surprising for programmers who are used to extensively using reflection or other metadata systems. -->
对于习惯于广泛使用反射或其他元数据系统的程序员来说，执行期类型信息的缺失可能会让他们感到惊讶。

### Why should one use TypeScript?
【为什么要用TypeScript？】

<!-- On different forums you may stumble upon a lot of different arguments either for or against TypeScript. The truth is probably as vague as: it depends on your needs and use of the functions that TypeScript offers. Anyway, here are explained some of our reasoning behind why we think that the use of TypeScript may have some advantages.  -->
在不同的论坛上，你可能会遇到很多支持或反对TypeScript的争论。 事实很可能是模糊的: 这取决于你的需求和对TypeScript所提供函数的使用。 但无论如何，这里解释了我们为什么认为使用TypeScript有一些优势，以及这背后的一些原因。



<!-- First of all, TypeScript offers <i>type checking and static code analysis</i>. We can require values to be of a certain type, and have the compiler warn about using them wrong. This can reduce runtime errors and you might even be able to reduce the amount of required unit tests in a project, at least concerning pure type tests. -->

首先，TypeScript提供了<i>类型检查和静态代码分析</i>。 我们可以要求值具有某种类型，并让编译器警告不要使用错误的值。 这可以减少运行时错误，甚至可以减少项目中所需的单元测试数量，至少在涉及纯类型测试时是这样。

<!-- The static code analysis doesn't only warn about wrongful type usage,but also other mistakes such as misspelling a variable or function name or trying to use a variable beyond its scope.  -->
静态程序分析不仅警告错误的类型使用，还有其他错误，比如拼错变量或函数名，或者试图使用超出范围的变量。



<!-- The second advantage of TypeScript is that the type annotations in the code can function as a type of <i>code level documentation</i>.  -->
TypeScript的第二个优点是代码中的类型注解可以作为<i>代码级文档</i> 的类型发挥作用。 

<!-- It's easy to check from a function signature what kind of arguments the function can consume and what type of data it will return. This type of type annotation bound documentation will always be up to date and it makes it easier for new programmers to start working on an existing project. It is also helpful when returning to an old project. -->
通过函数签名可以很容易地检查函数可以使用哪种类型的参数，以及它将返回哪种类型的数据。 这种类型的类型注解绑定文档将始终是最新的，并且它使新的程序员更容易开始处理现有的项目。 当返回到一个旧的项目时，这也是有帮助的。

<!-- Types can be reused all around the code base, and a change to a type definition will automatically reflect everywhere the type is used. One might argue that you can achieve similar code level documentation with e.g. [JSDoc](https://jsdoc.app/about-getting-started.html), but it is not connected to the code as tightly as TypeScript's types, and may thus get out of sync more easily and is also more verbose. -->
类型可以在整个代码库中重用，对类型定义的更改将自动反映所有使用该类型的地方。 有人可能会说，你可以用[JSDoc](https://JSDoc.app/about-getting-started.html)实现类似的代码级文档，但是它与代码的连接不像 TypeScript 的类型那样紧密，因此更有可能不同步，而且也更加冗长。

<!-- The third advantage of TypeScript is, that IDEs can provide more <i>specific and smarter intellisense</i> when they know exactly what types of data you are processing. -->
TypeScript的第三个优点是，当 IDE 确切知道您正在处理的数据类型时，它们可以提供更具体、更智能的智能感知。 

<!-- All of these features are extremely helpful when you need to refactor your code. The static code analysis warns you about any errors in your code, and the intellisense can give you hints about available properties and even possible refactoring options. The code level documentation helps you understand the existing code. -->
当您需要重构代码时，所有这些特性都非常有用。 静态程序分析会警告你代码中的任何错误，智能感知可以提示你可用的属性，甚至可能的重构选项。 代码级文档可以帮助您理解现有的代码。

<!-- With the help of TypeScript it is also very easy to start using the newest JavaScript language features at an early stage just by altering its configuration. -->
在 TypeScript 的帮助下，在早期阶段仅仅通过改变配置就可以很容易地开始使用最新的 JavaScript 语言特性。

### What does TypeScript not fix?
【TypeScript不能解决什么问题？】

<!-- As mentioned above, TypeScript type annotations and type checking exist only at compile time and no longer at runtime. Even if the compiler does not throw any errors, runtime errors are still possible. -->
如上所述，TypeScript 类型注解和类型检查仅在编译时存在，在运行时不再存在。 即使编译器没有抛出任何错误，运行时仍然是有可能抛出错误的。
<!-- These runtime errors are especially common when handling external input, such as data received from a network request. -->
这些运行时错误在处理外部输入(如从网络请求接收的数据)时特别常见。

<!-- Lastly, below we list some issues many have with TypeScript, which might be good to be aware of: -->
最后，下面我们列举了一些TypeScript中存在的问题，这些问题值得注意:

#### Incomplete, invalid or missing types in external libraries
【外部库中不完整、无效或缺少的类型】
<!-- When using external libraries you may find that some libraries have either missing or in some way invalid type declarations. Most often this is due to the library not being written in TypeScript, and the person adding the type declarations manually not doing such a good job with it. In these cases you might need to define the type declarations yourself.  -->
在使用外部库时，您可能会发现某些库缺少或以某种方式存在无效的类型声明。 大多数情况下，这是因为库不是用TypeScript编写的，而且手动添加类型声明的人并没有很好地处理它。 在这些情况下，您可能需要自己定义类型声明。

<!-- However, there is a good chance someone has already added typings for the package you are using. Always check [DefinitelyTyped](https://definitelytyped.org/) or [their GitHub pages](https://github.com/DefinitelyTyped/DefinitelyTyped) first. They are probably the most popular sources for type declaration files.  -->
但是，很有可能已经有人为您正在使用的包添加了类型。 因此总是先检查[DefinitelyTyped](https://DefinitelyTyped.org/)或[他们的 GitHub 页面](https://GitHub.com/DefinitelyTyped/DefinitelyTyped)。 它们可能是最常用的类型声明文件源。

<!-- Otherwise you might want to start off by getting acquainted with TypeScript's own [documentation](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html) regarding type declarations. -->
否则，你可能需要从熟悉 TypeScript 自己关于类型声明的[文档](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html 文档)开始。

#### Sometimes type inference needs assistance
【有时候类型推断需要帮助】

<!-- The type inference in TypeScript is pretty good but not quite perfect. -->
TypeScript中的类型推断非常好，但还不够完美。 

<!-- Sometimes you may feel like you have declared your types perfectly, but the compiler still tells you that the property does not exist or that this kind of usage is not allowed. In these cases you might need to help the compiler out by doing something like an "extra" type check, but be careful with type casting and type guards. -->
有时候你可能觉得你已经完美的声明了你的类型，但是编译器仍然告诉你这个属性不存在或者这种用法是不允许的。 在这些情况下，您可能需要通过类似“外挂”类型检查来帮助编译器，但是要小心类型强制转换和类型保护。

<!-- Using type casting or type guards you are basically giving your word to the compiler that the value really is of the type that you declare. -->
使用类型强制转换或类型保护，基本上就是向编译器说明值确实是您声明的类型。

<!-- You might want to check out TypeScript's documentation regarding [Type Assertions](https://www.typescriptlang.org/docs/handbook/basic-types.html#type-assertions) and [Type Guards](https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-guards-and-differentiating-types). -->
你可能想看看 TypeScript 关于[Type Assertions](https://www.typescriptlang.org/docs/handbook/basic-types.html#Type-Assertions)和[Type Guards](https://www.typescriptlang.org/docs/handbook/advanced-types.html#Type-Guards-and-differentiating-types)的文档。



#### Mysterious type errors
【神秘的类型错误】

<!-- The errors given by the type system may sometimes be quite hard to understand, especially if you use complex types. -->
类型系统给出的错误有时可能很难理解，特别是当您使用复杂类型时。

<!-- As a rule of thumb, the TypeScript error messages have the most useful information at the end of the message.  -->
按照经验法则，TypeScript错误消息在消息末尾具有最有用的信息。

<!-- When running into long confusing messages, start reading them from the end. -->
当你遇到长长的令人困惑的信息时，从最后开始阅读。

</div>

