---
mainImage: ../../../images/part-9.svg
part: 9
letter: a
lang: zh
---

<div class="content">

<!-- TypeScript is a programming language designed for large-scale JavaScript development created by Microsoft. For example, Microsoft's <i>Azure Management Portal</i> (1,2 million lines of code) and <i>Visual Studio Code</i> (300 000 lines of code) have both been written in TypeScript. To support building large-scale JavaScript applications, TypeScript offers features such as better development-time tooling, static code analysis, compile-time type checking and code level documentation.-->
 TypeScript是一种编程语言，由微软创建，用于大规模的JavaScript开发。例如，微软的<i>Azure管理门户</i>（120万行代码）和<i>Visual Studio代码</i>（30万行代码）都是用TypeScript编写的。为了支持构建大规模的JavaScript应用，TypeScript提供了诸如更好的开发时工具、静态代码分析、编译时类型检查和代码级文档等功能。

### Main principle

<!-- TypeScript is a typed superset of JavaScript, and eventually it's compiled into plain JavaScript code. The programmer is even able to decide the version of the generated code, as long as it's ECMAScript 3 or newer. TypeScript being a superset of JavaScript means that it includes all the features of JavaScript and-->
 TypeScript是JavaScript的一个类型超集，最终它被编译成普通的JavaScript代码。程序员甚至可以决定生成代码的版本，只要它是ECMAScript 3或更新的。TypeScript是JavaScript的一个超集，这意味着它包括了JavaScript的所有特性和
<!-- its own additional features as well. In other words, all existing JavaScript code is actually valid TypeScript.-->
它自己的额外功能以及。换句话说，所有现有的JavaScript代码实际上是有效的TypeScript。

<!-- TypeScript consists of three separate, but mutually fulfilling parts:-->
 TypeScript由三个独立的、但又相互满足的部分组成。

<!-- - The language-->
 - 语言
<!-- - The compiler-->
 - 编译器
<!-- - The language service-->
 - 语言服务

![](../../images/9/1.png)

<!-- The <i>language</i> consists of syntax, keywords and type annotations. The syntax is similar to but not the same as JavaScript syntax. From the three parts of TypeScript, programmers have the most direct contact with the language.-->
 <i>语言</i>由语法、关键字和类型注释组成。语法与JavaScript语法相似但不相同。从TypeScript的三个部分来看，程序员与语言有最直接的接触。

<!-- The <i>compiler</i> is responsible for type information erasure (i.e. removing the typing information) and the code transformations. The code transformations enable TypeScript code to be transpiled into executable JavaScript. Everything related to the types is removed at compile-time, so TypeScript isn't actually genuine statically-typed code.-->
<i>编译器</i>负责类型信息的清除（即删除类型信息）和代码转换。代码转换使TypeScript代码被转译成可执行的JavaScript。所有与类型相关的东西都在编译时被移除，所以TypeScript实际上并不是真正的静态类型代码。

<!-- Traditionally,  <i>compiling</i>  means that code is transformed from a human-readable format to a machine-readable format. In TypeScript, human-readable source code is transformed into another human-readable source code, so the correct term would actually be <i>transpiling</i>. However, compiling has been the most commonly-used term in this context, so we will continue to use it.-->
 传统上，<i>编译</i>意味着代码从人类可读的格式转换为机器可读的格式。在TypeScript中，人类可读的源代码被转换为另一个人类可读的源代码，所以正确的术语实际上应该是<i>transpiling</i>。然而，在这种情况下，编译一直是最常用的术语，所以我们将继续使用它。

<!-- The compiler also performs a static code analysis. It can emit warnings or errors if it finds a reason to do so, and it can be set to perform additional tasks such as combining the generated code into a single file.-->
编译器也执行静态代码分析。如果它发现有理由这样做，它可以发出警告或错误，而且它可以被设置为执行额外的任务，如将生成的代码合并到一个文件中。

<!-- The <i>language service</i> collects type information from the source code. Development tools can use the type information for providing intellisense, type hints and possible refactoring alternatives.-->
 <i>语言服务</i>从源代码中收集类型信息。开发工具可以使用这些类型信息来提供智能提示、类型提示和可能的重构替代方案。
### TypeScript key language features

<!-- In this section, we will describe some of the key features of the TypeScript language. The intent is to provide you with a basic understanding of TypeScript's-->
 在本节中，我们将描述TypeScript语言的一些关键特征。其目的是让你对TypeScript的
<!-- key features to help you understand more of what is to come during this course.-->
 的关键特性，以帮助你理解本课程中将要出现的更多内容。

#### Type annotations

<!-- Type annotations in TypeScript are a lightweight way to record the intended <i>contract</i> of a function or a variable.-->
 TypeScript中的类型注解是一种轻量级的方式来记录函数或变量的预期<i>契约</i>。
<!-- In the example below, we have defined a <i>birthdayGreeter</i> function which accepts two arguments: one of type string and one of type number.-->
 在下面的例子中，我们定义了一个<i>birthdayGreeter</i>函数，它接受了两个参数：一个是字符串类型，一个是数字类型。
<!-- The function will return a string.-->
 该函数将返回一个字符串。


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
 TypeScript是一种结构化类型的语言。在结构化类型中，如果第一个元素的类型中的每一个特征，在第二个元素的类型中存在一个相应的和相同的特征，那么两个元素被认为是彼此兼容的。如果两个类型相互兼容，则被认为是相同的。

#### Type inference

<!-- The TypeScript compiler can attempt to infer the type information if no type has been specified. Variables' type can be inferred based on its assigned value and its usage. The type inference take place when initializing variables and members, setting parameter default values, and determining function return types.-->
 如果没有指定类型，TypeScript编译器可以尝试推断出类型信息。变量的类型可以根据它的分配值和它的用途来推断。类型推断发生在初始化变量和成员、设置参数默认值和确定函数返回类型时。

<!-- For example, consider the function <i>add</i>:-->
 例如，考虑函数<i>add</i>。

```js
const add = (a: number, b: number) => {
  /* The return value is used to determine
     the return type of the function */
  return a + b;
}
```

<!-- Type of the function's return value is inferred by retracing the code back to the return expression. The return expression performs an addition of the parameters a and b. We can see that a and b are numbers based on their types. Thus, we can infer the return value to be of type <i>number</i>.-->
 该函数的返回值的类型是通过回溯代码到返回表达式来推断的。返回表达式对参数a和b进行加法运算。我们可以看到，根据它们的类型，a和b是数字。因此，我们可以推断出返回值的类型为<i>number</i>。

<!-- As a more complex example, let's consider the code below. If you have not used TypeScript before, this example might be a bit complex. But do not worry, you can safely skip it for now.-->
 作为一个更复杂的例子，让我们考虑下面的代码。如果你以前没有使用过TypeScript，这个例子可能有点复杂。但不要担心，你可以暂时安全地跳过它。

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

<!-- First, we have a declaration of a [type alias](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases) called <i>CallsFunction</i>.-->
 首先，我们有一个名为<i>CallsFunction</i>的[类型别名](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases)声明。
<!-- CallsFunction is a function type with one parameter: <i>callback</i>. The parameter <i>callback</i> is of type function which takes a string parameter and returns [any](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any) value.  As we will learn later in this part, <i>any</i> is a kind of "wildcard" type that can represent any type. Also, CallsFunction returns [void](https://www.typescriptlang.org/docs/handbook/basic-types.html#void) type.-->
 CallsFunction是一个有一个参数的函数类型。<i>callback</i>。参数<i>callback</i>属于函数类型，它接受一个字符串参数并返回[任意](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any)值。  正如我们将在本章节后面学到的，<i>any</i>是一种 "通配符 "类型，可以代表任何类型。另外，CallsFunction返回[void](https://www.typescriptlang.org/docs/handbook/basic-types.html#void)类型。

<!-- Next, we define the function <i>func</i> of type <i>CallsFunction</i>. From the function's type, we can infer that its parameter function cb will only accept a string argument. To demonstrate this, there is also an example where the parameter function is called with a numeric value, which will cause an error in TypeScript.-->
 接下来，我们定义<i>func</i>类型的<i>CallsFunction</i>的函数。从这个函数的类型，我们可以推断出它的参数函数cb只接受一个字符串参数。为了证明这一点，还有一个例子，即用数字值调用参数函数，这在TypeScript中会导致错误。

<!-- Lastly, we call <i>func</i> giving it the following function as a parameter:-->
 最后，我们调用<i>func</i>，给它提供以下函数作为参数。

```js
(result) => {
  return result;
}
```

<!-- So despite not defining types for the parameter function, it is inferred from the calling context that the argument <i>result</i> is of the type string. -->
<!-- Despite the types of the parameter function not being defined, we can infer from the calling context that the argument <i>result</i> is of the type string.-->
尽管参数函数的类型没有被定义，我们可以从调用环境中推断出参数<i>result</i>是字符串类型。

#### Type erasure

<!-- TypeScript removes all type system constructs during compilation.-->
 TypeScript在编译过程中删除了所有类型系统结构。

<!-- Input:-->
输入。

```js
let x: SomeType;
```

<!-- Output:-->
 输出。

```js
let x;
```

<!-- This means that at runtime, there is no information present that says that some variable x was declared as being of type SomeInterface. -->
<!-- This means that no type information remains at runtime - nothing says that some variable x was declared as being of type <i>SomeType</i>.-->
 这意味着在运行时没有任何类型信息被保留下来--没有任何东西表明某个变量x被声明为<i>SomeType</i>类型。

<!-- The lack of runtime type information can be surprising for programmers who are used to extensively using reflection or other metadata systems.-->
 对于那些习惯于广泛使用反射或其他元数据系统的程序员来说，缺乏运行时的类型信息可能是令人惊讶的。

### Why should one use TypeScript?

<!-- On different forums, you may stumble upon a lot of different arguments either for or against TypeScript. The truth is probably as vague as: it depends on your needs and use of the functions that TypeScript offers. Anyway, here are some of our reasons behind why we think that the use of TypeScript may have some advantages.-->
在不同的论坛上，你可能会偶然发现很多不同的论点，无论是支持还是反对TypeScript。事实可能是：这取决于你对TypeScript提供的功能的需求和使用。无论如何，这里有一些我们认为使用TypeScript可能有一些优势的理由。


<!-- First of all, probably the most noticeable feature with TypeScript is that it offers **type checking and static code analysis**. The ability to require values to be of a certain type and to have the compiler warn about wrongful usage can help reduce runtime errors and you might even be able to reduce the amount of required unit tests in a project, at least concerning pure type tests. The static code analysis doesn't only warn about wrongful type usage, but also if you for instance misspell a variable or function name or try to use a value beyond it's scope etc. With the help of a sufficient linter settings, it's hard to even think of runtime errors that you may be able to produce. -->
<!-- First of all, TypeScript offers <i>type checking and static code analysis</i>. We can require values to be of a certain type, and have the compiler warn about using them incorrectly. This can reduce runtime errors, and you might even be able to reduce the amount of required unit tests in a project, at least concerning pure type tests.-->
 首先，TypeScript提供<i>类型检查和静态代码分析</i>。我们可以要求值必须是某种类型，并让编译器对错误使用它们发出警告。这可以减少运行时的错误，你甚至可以减少项目中所需要的单元测试的数量，至少关于纯类型测试。
<!-- The static code analysis doesn't only warn about wrongful type usage, but also other mistakes such as misspelling a variable or function name or trying to use a variable beyond its scope.-->
 静态代码分析不仅对错误的类型使用提出警告，而且还对其他错误提出警告，如拼错变量或函数名，或试图使用超出其范围的变量。


<!-- A second advantage with TypeScript is that the type annotations in the code can function as a type of **code level documentation**. It's easy to check from a function signature what kind of arguments the function can receive and what type of data it will return. This type of type annotation bound documentation will always be up to date and it makes it easier for new programmers to start working on an existing project. It is also helpful when returning to an old project. Types may also be re-used all around the code base, so a change to one type automatically reflects as a change to all the locations where the type is used. One might argue that you can achieve similar code level documentation with e.g. [JSDoc](https://jsdoc.app/about-getting-started.html), but it is not connected to the code as tightly as TypeScript's types, and may thus get out of sync more easily and is also more verbose. -->
<!-- The second advantage of TypeScript is that the type annotations in the code can function as a type of <i>code-level documentation</i>.-->
 TypeScript的第二个优势是，代码中的类型注释可以作为一种类型的<i>代码级文档</i>发挥作用。
<!-- It's easy to check from a function signature what kind of arguments the function can consume and what type of data it will return. This form of type annotation-bound documentation will always be up to date and it makes it easier for new programmers to start working on an existing project. It is also helpful when returning to an old project.-->
从函数签名中很容易检查出该函数可以消费什么样的参数以及它将返回什么样的数据类型。这种以类型注解为基础的文档总是最新的，它使新的程序员更容易开始在现有项目上工作。当回到一个老项目时，它也是有帮助的。

<!-- Types can be reused all around the code base, and a change to a type definition will automatically be reflected everywhere the type is used. One might argue that you can achieve similar code-level documentation with e.g. [JSDoc](https://jsdoc.app/about-getting-started.html), but it is not connected to the code as tightly as TypeScript's types, and may thus get out of sync more easily, and is also more verbose.-->
类型可以在整个代码库中被重用，对类型定义的改变会自动反映在该类型被使用的地方。有人可能会说，你可以通过[JSDoc](https://jsdoc.app/about-getting-started.html)实现类似的代码级文档，但它与代码的联系没有TypeScript的类型那么紧密，因此可能更容易脱节，而且也更啰嗦。


<!-- A third advantage with TypeScript is the more **specific and smarter intellisense**  that the IDE's can provide when they know exactly what types of data you are processing. -->
<!-- The third advantage of TypeScript is that IDEs can provide more <i>specific and smarter intellisense</i> when they know exactly what types of data you are processing.-->
 TypeScript的第三个优势是，当IDE知道你正在处理哪些类型的数据时，它们可以提供更具体、更智能的智能提示</i>。


<!-- All the features mentioned above are together extremely helpful when you need to refactor your code. The static code analysis emits warnings if you have any errors in your code, and the intellisense can give you hints about available properties and even possible refactoring options. The code level documentation helps you understand the existing code, and with the help of TypeScript it is also very easy to start using the newest JavaScript language features at an early stage just by altering the configuration. -->
<!-- All of these features are extremely helpful when you need to refactor your code. The static code analysis warns you about any errors in your code, and the intellisense can give you hints about available properties and even possible refactoring options. The code-level documentation helps you understand the existing code.-->
 当你需要重构你的代码时，所有这些功能都非常有帮助。静态代码分析会警告你代码中的任何错误，而智能检测可以给你提示可用的属性，甚至可能的重构选项。代码级的文档帮助你理解现有的代码。
<!-- With the help of TypeScript, it is also very easy to start using the newest JavaScript language features at an early stage just by altering its configuration.-->
在TypeScript的帮助下，只要改变它的配置，就可以很容易地在早期阶段开始使用最新的JavaScript语言特性。

### What does TypeScript not fix?

<!-- As mentioned above, TypeScript type annotations and type checking exist only at compile time and no longer at runtime, so even if the compiler does not give any errors, runtime errors are still possible. Especially when handling external input or if you use the dynamic type `any` in your code. -->
<!-- As mentioned above, TypeScript type annotations and type checking exist only at compile time and no longer at runtime. Even if the compiler does not throw any errors, runtime errors are still possible.-->
如上所述，TypeScript的类型注释和类型检查只存在于编译时，在运行时不再存在。即使编译器没有抛出任何错误，运行时的错误仍然是可行的。
<!-- These runtime errors are especially common when handling external input, such as data received from a network request.-->
 这些运行时错误在处理外部输入时特别常见，比如从网络请求中收到的数据。

<!-- Lastly, here are a few examples of what many regard as downsides with TypeScript, which might be good to be aware of: -->
<!-- Lastly, below, we list some issues many have with TypeScript, which might be good to be aware of:-->
最后，下面我们列出了许多人在使用TypeScript时遇到的一些问题，注意到这些问题也许是好事。

#### Incomplete, invalid or missing types in external libraries

<!-- When using external libraries you may find that some libraries have either missing or in some way invalid type declarations. The reason behind this is most often that the library has not been made with TypeScript. Then the types need to be declared manually, or if someone has already done that they might not have done such a good job with it. These are occasions when you may need to define type declarations yourself. However, you should first check out [DefinitelyTyped](https://definitelytyped.org/) or [their GitHub pages](https://github.com/DefinitelyTyped/DefinitelyTyped), which are probably the most used sources for type declaration files and there is a good chance someone has already added typings for the package you are using. Otherwise you might want to start off by getting acquainted with TypeScript's own [documentation](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html) regarding type declarations. -->
<!-- When using external libraries, you may find that some libraries have either missing or in some way invalid type declarations. Most often, this is due to the library not being written in TypeScript, and the person adding the type declarations manually not doing such a good job with it. In these cases, you might need to define the type declarations yourself.-->
 当使用外部库时，你可能会发现一些库的类型声明缺失或在某些方面无效。大多数情况下，这是由于库不是用TypeScript编写的，而且手动添加类型声明的人没有做得很好。在这些情况下，你可能需要自己定义类型声明。
<!-- However, there is a good chance someone has already added typings for the package you are using. Always check [DefinitelyTyped](https://definitelytyped.org/) or [their GitHub pages](https://github.com/DefinitelyTyped/DefinitelyTyped) first. They are probably the most popular sources for type declaration files.-->
 然而，很有可能有人已经为你使用的包添加了类型。一定要先查看[DefinitelyTyped](https://definitelytyped.org/)或[其GitHub页面](https://github.com/DefinitelyTyped/DefinitelyTyped)。它们可能是类型声明文件的最流行的来源。
<!-- Otherwise, you might want to start off by getting acquainted with TypeScript's own [documentation](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html) regarding type declarations.-->
否则，你可能想先熟悉一下TypeScript自己的关于类型声明的[文档](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html)。

#### Sometimes, type inference needs assistance

<!-- The type inference in TypeScript is pretty good but not quite perfect. Sometimes you may feel like you have declared your types perfectly, but the compiler still tells you that the property does not exist or that this kind of usage is not allowed. These are occasions when you might need to help the compiler with doing e.g. an "extra" type check or something like that. But be careful with type casting and type guards. Using them you are basically giving your word to the compiler that the value really is of the type that you declare. You might want to check out TypeScript's documentation regarding [Type Assertions](https://www.typescriptlang.org/docs/handbook/basic-types.html#type-assertions) and [Type Guards](https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-guards-and-differentiating-types). -->
<!-- The type inference in TypeScript is pretty good but not quite perfect.-->
 TypeScript中的类型推理是相当好的，但不是很完美。
<!-- Sometimes, you may feel like you have declared your types perfectly, but the compiler still tells you that the property does not exist or that this kind of usage is not allowed. In these cases, you might need to help the compiler out by doing something like an "extra" type check, but be careful with type casting and type guards.-->
 有时候，你可能觉得你已经完美地声明了你的类型，但是编译器仍然告诉你这个属性不存在或者这种用法是不允许的。在这种情况下，你可能需要通过做一些类似于 "额外的 "类型检查来帮助编译器，但要注意类型转换和类型保护。
<!-- Using type casting or type guards, you are basically giving your word to the compiler that the value really is of the type that you declare.-->
 使用类型转换或类型守卫，你基本上是向编译器保证值确实是你声明的类型。
<!-- You might want to check out TypeScript's documentation regarding [Type Assertions](https://www.typescriptlang.org/docs/handbook/basic-types.html#type-assertions) and [Type Guards](https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-guards-and-differentiating-types).-->
 你可能想看看TypeScript关于[类型断言](https://www.typescriptlang.org/docs/handbook/basic-types.html#type-assertions)和[类型守卫](https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-guards-and-differentiating-types)的文档。


#### Mysterious type errors

<!-- The errors given by the type system may sometimes be quite hard to understand, especially if you use complex types. As a general guideline it is helpful to keep in mind that TypeScript error messages usually contain the most useful content at the end of the message.  When running into long confusing messages, start reading them from the end. -->
<!-- The errors given by the type system may sometimes be quite hard to understand, especially if you use complex types.-->
 由类型系统给出的错误有时可能相当难以理解，特别是当你使用复杂的类型时。
<!-- As a rule of thumb, the TypeScript error messages have the most useful information at the end of the message.-->
根据经验，TypeScript的错误信息在信息的最后有最有用的信息。
<!-- When running into long confusing messages, start reading them from the end.-->
当遇到长的令人困惑的信息时，从最后开始阅读。

</div>
