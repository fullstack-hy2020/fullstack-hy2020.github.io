---
mainImage: ../../../images/part-9.svg
part: 9
letter: a
lang: en
---

<div class="content">

## What is TypeScript?

<!-- TypeScript is a programming language created by Microsoft, designed for the development of large JavaScript applications. For instance, Microsoft has written both the _Azure Management Portal_ (1,2 million lines of code) and the _Visual Studio Code_ (300 000 lines of code) applications using TypeScript. To support building large-scale JavaScript applications, TypeScript offers e.g. better development-time tooling, static code analysis, compile-time type checking and code level documentation. -->

TypeScript is a programming language designed for large-scale JavaScript development created by Microsoft. For example Microsoft's _Azure Management Portal_ (1,2 million lines of code) and the _Visual Studio Code_ (300 000 lines of code) have both been written in TypeScript. To support building large-scale JavaScript applications, TypeScript offers e.g. better development-time tooling, static code analysis, compile-time type checking and code level documentation.

### Main principle

<!-- TypeScript is a typed superset of JavaScript, which eventually gets compiled into plain JavaScript code. The programmer is even able to decide the version of the generated code, as long as it's ECMAScript 3 or newer. That TypeScript is a superset of JavaScript means that it includes all the features of JavaScript and additional features as well. In fact, all existing JavaScript code is actually valid TypeScript. -->
TypeScript is a typed superset of JavaScript, and eventually it's compiled into plain JavaScript code. Programmer is even able to decide the version of the generated code, as long as it's ECMAScript 3 or newer. Typescript being a superset of JavaScript means that it includes all the features of JavaScript and 
its own additional features as well. In fact, all existing JavaScript code is actually valid TypeScript.

TypeScript consists of three separate, but mutually fulfilling parts: 

- The language
- The compiler
- The language Service

![](../../images/9/1.png)

**The language** concists of syntax, keywords and type annotations. The syntax is similar to but not the same as JavaScript syntax. From the three parts of TypeScript programmers have the most direct contact with the language. 

<!-- **The compiler** is responsible for type information erasure and the code transformations which enable TypeScript code to be transpiled into executable JavaScript-code. In other words, TypeScript isn't actually genuine statically typed code, because everything related to the types is removed at compile-time. -->
<!-- Traditionally, when speaking of _compiling_, it means that code is transformed from a human readable format to a machine readable format. In TypeScript's case the human readable source code is transformed into another human readable source code, so the correct term to be used should be _transpiling_, but compiling has risen to the most commonly known term in this context, so we will continue using the same term. -->
<!-- The compiler also performs a static code analysis, so it can emit warnings or errors if it finds a reason to do so, and it can be set to perform additional tasks such as combining the generated code into a single file. -->
**The compiler** is responsible for type information ereasure and the code transformations. The code transformations enable TypeScript code to be transpiled into executable JavaScript. Everything related to the types is removed at compile-time, so TypeScript isn't actually genuine statically typed code. Traditionally  _compiling_  means that code is transformed from a human readable format to a machine readable format. In TypeScript human readable source code is transformed into another human readable source code, so the correct term would actually be _transpiling_. However compiling has been the most commonly used term in this context, so we will continue to use it. The compiler also performs a static code analysis. It can emit warnings or errors if it finds a reason to do so, and it can be set to perform additional tasks such as combining the generated code into a single file. 

<!-- **The language service** collects type information from the source code in such a format, that development tools can utilize it for providing intellisense, type hints and possible refactoring alternatives. -->
**The language service** collects type information from the source code. Development tools can use the type information for providing intellisense, type hints and possible refactoring alternatives.

### TypeScript key language features

<!-- Here we described some of the key features of the TypeScript language. This description is intended to provide you with some basic knowledge that will help you understand more of what is to come during this course. -->
In this section we will describe some of the key features of the TypeScript language. The intent is to provide you with basic understanding of TypeScripts' 
key features to help you understand more of what is to come during this course.

#### Type annotations

<!-- Type annotations in TypeScript are lightweight ways to record the intended contract of the function or variable. In the example below we have defined, that the `birthdayGreeter` function will accept one argument of type string and one of type number. The function will return a string. -->
Type annotations in TypeScript are a lightweight way to record the intended contract of a function or a variable. 
In the example below we have defined a function `birthdayGreeter` which accepts two arguments, one of type string and one of type number. 
The function will return a string.

```js
const birthdayGreeter = (name: string, age: number): string => {
  return `Happy birthday ${name}, you are now ${age} years old!`;
};

const birthdayHero = "Jane User";
const age = 22;

document.body.textContent = birthdayGreeter(birthdayHero, age);
```

#### Structural typing

<!-- TypeScript is a structurally typed language. In structural typing, an element is considered to be compatible with another if  for each feature within the second element's type, a corresponding and identical feature exists in the first element's type. Two types are considered to be identical if each is compatible with the other. -->
TypeScript is a structurally typed language. In structural typing two elements are considered to be compatible with oneanother if for each feature within the type of the first element a corresponding and identical feature exists within the type of the second element. Two types are considered to be identical if they are compatible with each other.

#### Type inference

<!-- In TypeScript, the compiler can attempt to infer the type information if no explicit type has been specified. The inference is done based on the assigned value and it's usage. -->
<!-- The type inference takes place when initializing variables and members, setting parameter default values, and determining function return types. -->
The TypeScript compiler can attempt to infer the type information if no type has been specified. Variable's type can be inferred based on its assigned value and its usage. The type inference take place when initializing variables and members, setting parameter default values, and determining function return types.

Below is an example of type inference in TypeScript using the following code: 

```js
const add = (a: number, b: number) => {
  /* The return value is used to determine
     the return type of the function */
  return a + b;
}

interface CallsFunction {
  (cb: (result: string) => any): void;
}

// The cb parameter is inferred to be a function accepting a string
const callsFunction: CallsFunction = (cb) => {
  cb('Done');
  
  // Error: Argument of type '1' is not assignable to parameter of type string
  cb(1);
}

// The result parameter is inferred to be a string
callsFunction((result) => {
  return result;
});
```

<!-- First, the type of the `add` function's return value is inferred by retracing the code back to the return expression.  -->
<!-- The return expression performs an addition of two numbers, which can bee seen from the types set for the function parameters. -->
<!-- From this the type of the return value can be inferred to be `number`. -->
First, the type of the return value of the `add` function is inferred by retracing the code back to the return expression. 
The return expression performs an addition operation to the function's two parameters a and b. We can see that both a and b are set to be numbers.
From this we can infer that the type of the return value is also `number`.

<!-- Next an interface called `CallsFunction` is declared. It consists of a function with one parameter, which in turn is a callback function accepting a string parameter and returns _any_ value. -->
 <!-- The function `callsFunction` is set to be of type `CallsFunction`, so it can be inferred that the callback function will only accept a string argument. -->
 <!-- To demonstrate this, there is also an example where the callback function is called with a numeric value, and that causes an error in TypeScript. -->
Next we have the `CallsFunction` interface. It concists of a function with one parameter, which in turn is a callback function accepting a string parameter and returning _any_ value. 
The `callsFunction` function is set to be of type `CallsFunction`, so we can infer that the callback function will only accept a string argument.
To demonstrate this there is also an example where the callback function is called with a numeric value, which causes an error in TypeScript.

Lastly, when `callsFunction` is called  we pass it an anonymous function. TypeScript can, based on the type of `callsFunction`, infer that the call will return a string.


#### Type erasure

TypeScript removes type annotations, interfaces, type aliases, and other type system constructs during compilation.

Input:

```js
let x: SomeInterface;
```

Output:

```js
let x;
```

<!-- This means that at runtime, there is no information present that says that some variable x was declared as being of type SomeInterface. -->
This means that no type information remains at runtime - nothing says that some variable x was declared as being of type SomeInterface.

The lack of runtime type information can be surprising for programmers who are used to extensively using reflection or other metadata systems.

### Why should one use TypeScript?

On different forums you may stumble upon a lot of different arguments either for or against TypeScript. The truth is probably somewhere in the middle: it depends on your needs and use of the functions that TypeScript offers. Anyway, here are explained some of our reasoning behind why we think that the use of TypeScript may have some advantages. 


<!-- First of all, probably the most noticable feature with TypeScript is that it offers **type checking and static code analysis**. The ability to require values to be of a certain type and to have the compiler warn about wrongful usage can help reduce runtime errors and you might even be able to reduce the amount of required unit tests in a project, at least conserning pure type tests. The static code analysis doesn't only warn about wrongful type usage, but also if you for instance misspell a variable or function name or try to use a value beyond it's scope etc. With the help of a sufficient linter settings, it's hard to even think of runtime errors that you may be able to produce. -->
First of all, TypeScript offers **type checking and static code analysis**. We can require values to be of a certain type, and have the compiler warn about using them wrong. This can reduce runtime errors and you might even be able to reduce the amount of required unit tests in a project, at least conserning pure type tests.
The static code analysis doesn't only warn about wrongful type usage,but also other mistakes such as misspelling a variable or function name or trying to use a variable beyong its scope. 
With the help of sufficient linter settings, it's near impossible to be able to produce runtime errors. 

_However, TypeScript does not fix everyhing for you!! If you use the type any or process external input in some way, then it's still easy to produce runtime errors._

<!-- A second advantage with TypeScript is that the type annotations in the code can function as a type of **code level documentation**. It's easy to check from a function signature what kind of arguments the function can receive and what type of data it will return. This type of type annotation bound documentation will always be up to date and it makes it easier for new programmers to start working on an existing project. It is also helpful when returning to an old project. Types may also be re-used all around the code base, so a change to one type automatically reflects as a change to all the locations where the type is used. One might argue that you can achieve similar code level documentation with e.g. [JSDoc](https://jsdoc.app/about-getting-started.html), but it is not connected to the code as tightly as TypeScript's types, and may thus get out of sync more easily and is also more verbose. -->
The second advantage of TypeScript is that the type annotations in the code can function as a type of **code level documentation**. 
It's easy to check from a function signature what kind of arguments the function can receive and what type of data it will return. This type of type annotation bound documentation will always be up to date and it makes it easier for new programmers to start working on an existing project. It is also helpful when returning to an old project.
Types can be re-used all around the code base, and a change to a type definition will automatically reflect everywhere the type is used. One might argue that you can achieve similar code level documentation with e.g. [JSDoc](https://jsdoc.app/about-getting-started.html), but it is not connected to the code as tightly as TypeScript's types, and may thus get out of sync more easily and is also more verbose.


<!-- A third advantage with TypeScript is the more **specific and smarter intellisense**  that the IDE's can provide when they know exactly what types of data you are processing. -->
The third advantage of TypeScript is, that IDEs can provide more **specific and smarter intellisense** when they know exactly what types of data you are processing.

<!-- All the features mentioned above are together extremely helpful when you need to refactor your code. The static code analysis emits warnings if you have any errors in your code, and the intellisense can give you hints about available properties and even possible refactoring options. The code level documentation helps you understand the existing code, and with the help of TypeScript it is also very easy to start using the newest JavaScript language features at an early stage just by altering the configuration. -->
All of these features are extremely helpful when you need to refactor your code. The static code analysis warns you about any errors in your code, and the intellisense can give you hints about available properties and even possible refactoring options. The code level documentation helps you understand the existing code.
With the help of TypeScript it is also very easy to start using the newest JavaScript language features at an early stage just by altering its configuration.

### What does TypeScript not fix?

<!-- As mentioned above, TypeScript type annotations and type checking exist only at compile time and no longer at runtime, so even if the compiler does not give any errors, runtime errors are still possible. Especially when handling external input or if you use the dynamic type `any` in your code. -->
As mentioned above, TypeScript type annotations and type checking exist only at compile time and no longer at runtime. Even if the compiler does not throw any errors, runtime errors are still possible, 
especially when handling external input or if you use the dynamic type `any` in your code.

<!-- Lastly, here are a few examples of what many regard as downsides with TypeScript, which might be good to be aware of: -->
Lastly, below we list some issues many have with TypeScript, which might be good to be aware of:

#### Incomplete, invalid or missing types in external libraries

<!-- When using external libraries you may find that some libraries have either missing or in some way invalid type declarations. The reason behind this is most often that the library has not been made with TypeScript. Then the types need to be declared manually, or if someone has already done that they might not have done such a good job with it. These are occasions when you may need to define type declarations yourself. However, you should first check out [DefinitelyTyped](https://definitelytyped.org/) or [their GitHub pages](https://github.com/DefinitelyTyped/DefinitelyTyped), which are probably the most used sources for type declaration files and there is a good chance someone has already added typings for the package you are using. Otherwise you might want to start off by getting aquainted with TypeScript's own [documentation](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html) regarding type declarations. -->
When using external libraries you may find that some libraries have either missing or in some way invalid type declarations. Most often this is due to the library not being written in TypeScript, and the person adding the type declarations manually not doing such a good job with it. In these cases you might need to define the type declarations yourself. 
However, there is a good change someone has already added typings for the package you are using. Always check [DefinitelyTyped](https://definitelytyped.org/) or [their GitHub pages](https://github.com/DefinitelyTyped/DefinitelyTyped) first. They are probably the most popular sources for type declaration files. 
Otherwise you might want to start off by getting aquainted with TypeScript's own [documentation](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html) regarding type declarations.

#### Sometimes type inference needs assistance

<!-- The type inference in TypeScript is pretty good but not quite perfect. Sometimes you may feel like you have declared your types perfectly, but the compiler still tells you that the property does not exist or that this kind of usage is not allowed. These are occasions when you might need to help the compiler with doing e.g. an "extra" type check or something like that. But be careful with type casting and type guards. Using them you are basically giving your word to the compiler that the value really is of the type that you declare. You might want to check out TypeScript's documentation regarding [Type Assertions](https://www.typescriptlang.org/docs/handbook/basic-types.html#type-assertions) and [Type Guards](https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-guards-and-differentiating-types). -->
The type inference in TypeScript is pretty good but not quite perfect.
Sometimes you may feel like you have declared your types perfectly, but the compiler still tells you that the property does not exist or that this kind of usage is not allowed. In these cases you might need to help the compiler out by doing something like an "extra" type check, but be careful with type casting and type guards.
Using type casting or type guards you are basically giving your word to the compiler that the value really is of the type that you declare.
You might want to check out TypeScript's documentation regarding [Type Assertions](https://www.typescriptlang.org/docs/handbook/basic-types.html#type-assertions) and [Type Guards](https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-guards-and-differentiating-types).

#### Mysterious type errors

<!-- The errors given by the type system may sometimes be quite hard to understand, especially if you use complex types. As a general guideline it is helpful to keep in mind that TypeScript error messages usually contain the most useful content at the end of the message.  When running into long confusing messages, start reading them from the end. -->
The errors given by the type system may sometimes be quite hard to understand, especially if you use complex types.
As a rule of thumb, the TypeScript error messages have the most useful information at the end of the message. 
When running into long confusing messages, start reading them from the end.

</div>
