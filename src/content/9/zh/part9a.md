---
mainImage: ../../../images/part-9.svg
part: 9
letter: a
lang: zh
---

<div class="content">

<!-- [TypeScript](https://www.typescriptlang.org/) is a programming language designed for large-scale JavaScript development created by Microsoft. For example, Microsoft''s <i>Azure Management Portal</i> (1,2 million lines of code) and <i>Visual Studio Code</i> (300 000 lines of code) have both been written in TypeScript. To support building large-scale JavaScript applications, TypeScript offers features such as better development-time tooling, static code analysis, compile-time type checking and code-level documentation.-->
[TypeScript](https://www.typescriptlang.org/) 是由微软创建的一种针对大型JavaScript开发而设计的编程语言。例如，微软的<i>Azure Management Portal</i>（100 万行代码）和<i>Visual Studio Code</i>（30 万行代码）都是用TypeScript编写的。为了支持构建大型JavaScript应用程序，TypeScript提供了诸如更好的开发时工具、静态代码分析、编译时类型检查和代码级文档等功能。

### Main principle

<!-- TypeScript is a typed superset of JavaScript, and eventually, it's compiled into plain JavaScript code. The programmer is even able to decide the version of the generated code, as long as it's ECMAScript 3 or newer. TypeScript being a superset of JavaScript means that it includes all the features of JavaScript and-->
more.

TypeScript 是一种类型的 JavaScript 超集，最终会编译成普通的 JavaScript 代码。程序员甚至可以决定生成代码的版本，只要它是 ECMAScript 3 或更新版本即可。TypeScript 作为 JavaScript 的超集意味着它包含了 JavaScript 的所有功能以及更多。
<!-- its additional features as well. In other words, all existing JavaScript code is valid TypeScript.-->
TypeScript 是一种由微软开发的自由和开源的编程语言，它是 JavaScript 的超集，拥有其额外的特性。换句话说，所有现有的 JavaScript 代码都是有效的 TypeScript。

<!-- TypeScript consists of three separate, but mutually fulfilling parts:-->
TypeScript由三个不同但相辅相成的部分组成：

<!-- - The language-->
of the internet

网络的语言
<!-- - The compiler-->
translates the source code into machine code

编译器将源代码翻译成机器码
<!-- - The language service-->
industry

语言服务行业

![diagram of typescript components](../../images/9/1.png)

<!-- The <i>language</i> consists of syntax, keywords and type annotations. The syntax is similar to but not the same as JavaScript syntax. From the three parts of TypeScript, programmers have the most direct contact with the language.-->
语言<i>由语法、关键字和类型注释组成。</i>语法与JavaScript语法类似但不相同。从TypeScript的三个部分来看，程序员与语言有最直接的接触。

<!-- The <i>compiler</i> is responsible for type information erasure (i.e. removing the typing information) and for code transformations. The code transformations enable TypeScript code to be transpiled into executable JavaScript. Everything related to the types is removed at compile-time, so TypeScript isn''t genuine statically-typed code.-->
编译器负责类型信息抹除（即删除类型信息）和代码转换。 代码转换可以将TypeScript代码转换为可执行的JavaScript。 编译时刻删除与类型有关的一切，因此TypeScript不是真正的静态类型代码。

<!-- Traditionally,  <i>compiling</i> means that code is transformed from a human-readable format to a machine-readable format. In TypeScript, human-readable source code is transformed into another human-readable source code, so the correct term would be <i>transpiling</i>. However, compiling has been the most commonly-used term in this context, so we will continue to use it.-->
传统上，<i>编译</i>意味着代码从人类可读格式转换为机器可读格式。在TypeScript中，人类可读的源代码被转换成另一种人类可读的源代码，因此正确的术语应该是<i>转译</i>。然而，在这种情况下，编译一直是最常用的术语，因此我们将继续使用它。

<!-- The compiler also performs a static code analysis. It can emit warnings or errors if it finds a reason to do so, and it can be set to perform additional tasks such as combining the generated code into a single file.-->
编译器也会执行静态代码分析。如果它发现有理由这样做，它可以发出警告或错误，并且可以设置它来执行额外的任务，如将生成的代码合并到单个文件中。

<!-- The <i>language service</i> collects type information from the source code. Development tools can use the type information for providing intellisense, type hints and possible refactoring alternatives.-->
<i>语言服务</i>从源代码中收集类型信息。开发工具可以利用类型信息提供智能感知、类型提示和可能的重构选择。

### TypeScript key language features

<!-- In this section, we will describe some of the key features of the TypeScript language. The intent is to provide you with a basic understanding of TypeScript''s-->
capabilities.

在本节中，我们将描述TypeScript语言的一些关键特性。其目的是为您提供TypeScript功能的基本了解。
<!-- key features to help you understand more of what is to come during this course.-->
# 主要特性，協助您更加了解此課程中將會涉及到的內容

#### Type annotations

<!-- Type annotations in TypeScript are a lightweight way to record the intended <i>contract</i> of a function or a variable.-->
TypeScript 中的类型注解是记录函数或变量预期<i>合同</i>的一种轻量级方式。
<!-- In the example below, we have defined a *birthdayGreeter* function that accepts two arguments: one of type string and one of type number.-->
下面的例子中，我们定义了一个*birthdayGreeter*函数，它接受两个参数：一个类型为字符串，一个类型为数字。
<!-- The function will return a string.-->
这个函数将会返回一个字符串。

```js
const birthdayGreeter = (name: string, age: number): string => {
  return `Happy birthday ${name}, you are now ${age} years old!`;
};

const birthdayHero = "Jane User";
const age = 22;

console.log(birthdayGreeter(birthdayHero, age));
```

#### Structural typing

<!-- TypeScript is a structurally-typed language. In structural typing, two elements are considered to be compatible with one another if, for each feature within the type of the first element, a corresponding and identical feature exists within the type of the second element. Two types are considered to be identical if they are compatible with each other.-->
TypeScript 是一种结构类型的语言。在结构类型中，如果第一个元素的类型中的每个特征都有一个相应的和相同的特征存在于第二个元素的类型中，则认为两个元素是兼容的。如果两种类型彼此兼容，则认为它们是相同的。

#### Type inference

<!-- The TypeScript compiler can attempt to infer the type information if no type has been specified. Variables'' type can be inferred based on their assigned value and their usage. The type inference takes place when initializing variables and members, setting parameter default values, and determining function return types.-->
TypeScript 编译器可以尝试推断类型信息，如果没有指定类型。变量的类型可以根据其赋值和使用情况推断出来。类型推断发生在初始化变量和成员、设置参数默认值以及确定函数返回类型时。

<!-- For example, consider the function *add*:-->
例如，考慮函數*add*：

```js
const add = (a: number, b: number) => {
  /* The return value is used to determine
     the return type of the function */
  return a + b;
}
```

<!-- The type of the function''s return value is inferred by retracing the code back to the return expression. The return expression performs an addition of the parameters a and b. We can see that a and b are numbers based on their types. Thus, we can infer the return value to be of type *number*.-->
函数的返回值类型是通过追溯代码回到返回表达式来推断的。返回表达式执行参数a和b的加法。我们可以看到a和b的类型是数字。因此，我们可以推断返回值的类型为*数字*。

#### Type erasure

<!-- TypeScript removes all type system constructs during compilation.-->
TypeScript 在编译期间移除所有类型系统构造。

<!-- Input:-->
**Hello!**

你好！

```js
let x: SomeType;
```

<!-- Output:-->
# 中国

中国是一个有着悠久历史的文明古国，拥有着超过4000年的文明历史。中国是世界上最大的发展中国家，也是世界上人口最多的国家，拥有超过13亿人口。中国拥有着丰富的文化遗产，以及传统的习俗和风俗。中国也是世界上最大的商品贸易国家，拥有着世界上最大的外汇储备。

```js
let x;
```

<!-- This means that no type information remains at runtime - nothing says that some variable x was declared as being of type *SomeType*.-->
这意味着在运行时不会保留任何类型信息 - 没有说某个变量x被声明为*SomeType*类型。

<!-- The lack of runtime type information can be surprising for programmers who are used to extensively using reflection or other metadata systems.-->
给习惯于广泛使用反射或其他元数据系统的程序员来说，缺乏运行时类型信息可能会令人惊讶。

### Why should one use TypeScript?

<!-- On different forums, you may stumble upon a lot of different arguments either for or against TypeScript. The truth is probably as vague as: it depends on your needs and use of the functions that TypeScript offers. Anyway, here are some of our reasons behind why we think that the use of TypeScript may have some advantages.-->
在不同的论坛上，你可能会碰到很多关于TypeScript的正反两方的观点。事实可能像这样模糊不清：这取决于你对TypeScript提供的功能的需求和使用。无论如何，以下是我们认为使用TypeScript可能具有一些优势的原因。

<!-- First of all, TypeScript offers <i>type checking and static code analysis</i>. We can require values to be of a certain type, and have the compiler warn about using them incorrectly. This can reduce runtime errors, and you might even be able to reduce the number of required unit tests in a project, at least concerning pure-type tests.-->
首先，TypeScript提供<i>类型检查和静态代码分析</i>。我们可以要求值具有特定的类型，并警告编译器使用它们不正确。这可以减少运行时错误，您甚至可以减少项目中所需的单元测试数量，至少是关于纯类型测试的。
<!-- The static code analysis doesn''t only warn about wrongful type usage, but also other mistakes such as misspelling a variable or function name or trying to use a variable beyond its scope.-->
静态代码分析不仅会警告错误的类型使用，还会警告其他错误，如拼写变量或函数名错误，或者试图超出变量的作用域。

<!-- The second advantage of TypeScript is that the type annotations in the code can function as a type of <i>code-level documentation</i>.-->
第二个 TypeScript 的优势是，代码中的类型注释可以作为一种<i>代码级文档</i>。
<!-- It''s easy to check from a function signature what kind of arguments the function can consume and what type of data it will return. This form of type annotation-bound documentation will always be up to date and it makes it easier for new programmers to start working on an existing project. It is also helpful when returning to an old project.-->
它很容易从函数签名检查函数可以消费什么样的参数以及它将返回什么类型的数据。这种类型注释绑定的文档将始终保持最新，并且它使得新程序员更容易开始在现有项目上工作。当回到旧项目时，这也是有帮助的。

<!-- Types can be reused all around the code base, and a change to a type definition will automatically be reflected everywhere the type is used. One might argue that you can achieve similar code-level documentation with e.g. [JSDoc](https://jsdoc.app/about-getting-started.html), but it is not connected to the code as tightly as TypeScript''s types, and may thus get out of sync more easily, and is also more verbose.-->
类型可以在整个代码库中重复使用，对类型定义的更改将自动反映到使用类型的每个地方。有人可能会认为，您可以使用例如[JSDoc](https://jsdoc.app/about-getting-started.html)达到类似的代码级文档，但它与代码的联系不像TypeScript的类型那么紧密，因此可能更容易失去同步，而且也更冗长。

<!-- The third advantage of TypeScript is that IDEs can provide more <i>specific and smarter IntelliSense</i> when they know exactly what types of data you are processing.-->
第三个 TypeScript 的优点是，当它们确切地知道你正在处理什么类型的数据时，集成开发环境（IDEs）可以提供更<i>具体和更智能的 IntelliSense</i>。

<!-- All of these features are extremely helpful when you need to refactor your code. The static code analysis warns you about any errors in your code, and IntelliSense can give you hints about available properties and even possible refactoring options. The code-level documentation helps you understand the existing code.-->
所有这些功能在您需要重构代码时都非常有用。静态代码分析会警告您有关代码中的任何错误，IntelliSense可以提供有关可用属性甚至可能的重构选项的提示。代码级文档可以帮助您理解现有代码。
<!-- With the help of TypeScript, it is also very easy to start using the newest JavaScript language features at an early stage just by altering its configuration.-->
通过TypeScript的帮助，只需要调整一下配置，就可以很容易地在较早的阶段开始使用最新的JavaScript语言特性。

### What does TypeScript not fix?

<!-- As mentioned above, TypeScript type annotations and type checking exist only at compile time and no longer at runtime. Even if the compiler does not throw any errors, runtime errors are still possible. These runtime errors are especially common when handling external input, such as data received from a network request.-->
正如上面所提到的，TypeScript类型注释和类型检查只存在于编译时，而不再存在于运行时。即使编译器不抛出任何错误，运行时错误仍然是可能的。当处理外部输入（例如从网络请求接收到的数据）时，这些运行时错误尤其常见。

<!-- Lastly, below, we list some issues many have with TypeScript, which might be good to be aware of:-->
最后，下面，我们列出了许多人对 TypeScript 所存在的一些问题，值得注意：

#### Incomplete, invalid or missing types in external libraries

<!-- When using external libraries, you may find that some libraries have either missing or in some way invalid type declarations. Most often, this is due to the library not being written in TypeScript, and the person adding the type declarations manually not doing such a good job with it. In these cases, you might need to define the type declarations yourself.-->
当使用外部库时，您可能发现某些库缺少或以某种方式无效的类型声明。 通常，这是由于库未使用TypeScript编写，而添加类型声明的人在手动操作方面做得不够好。 在这些情况下，您可能需要自己定义类型声明。
<!-- However, there is a good chance someone has already added typings for the package you are using. Always check the DefinitelyTyped [GitHub page](https://github.com/DefinitelyTyped/DefinitelyTyped) first. They are probably the most popular sources for type declaration files.-->
然而，有很大的可能性有人已经为您正在使用的包添加了类型声明。首先要检查[DefinitelyTyped GitHub页面](https://github.com/DefinitelyTyped/DefinitelyTyped)。它们可能是最受欢迎的类型声明文件来源。
<!-- Otherwise, you might want to start by getting acquainted with TypeScript''s [documentation](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html) regarding type declarations.-->
否则，您可能想要首先熟悉TypeScript的[文档](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html)，关于类型声明。

#### Sometimes, type inference needs assistance

<!-- The type inference in TypeScript is pretty good but not quite perfect.-->
TypeScript 的类型推断功能相当不错，但并不完美。
<!-- Sometimes, you may feel like you have declared your types perfectly, but the compiler still tells you that the property does not exist or that this kind of usage is not allowed. In these cases, you might need to help the compiler out by doing something like an "extra" type check. One should be careful with type casting (that is quite often called type assertion) or type guards: when using those, you are giving your word to the compiler that the value <i>is</i> of the type that you declare. You might want to check out TypeScript''s documentation regarding [type assertions](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions) and [type guarding/narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html).-->
有时候，你可能觉得自己完美地声明了类型，但是编译器仍然告诉你属性不存在或者这种用法不允许。在这些情况下，你可能需要帮助编译器做一些“额外”的类型检查。人们应该小心使用类型转换（通常称为类型断言）或类型守卫：使用这些时，你向编译器保证值<i>是</i>你声明的类型。你可能希望查看TypeScript的文档，关于[类型断言](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions)和[类型守卫/缩小](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)。

#### Mysterious type errors

<!-- The errors given by the type system may sometimes be quite hard to understand, especially if you use complex types. As a rule of thumb, the TypeScript error messages have the most useful information at the end of the message. When running into long confusing messages, start reading them from the end.-->
类型系统给出的错误有时会很难理解，特别是当你使用复杂类型时。作为一条经验法则，TypeScript 错误消息的最有用的信息在消息的末尾。当遇到长而混乱的消息时，从末尾开始阅读它们。

</div>
