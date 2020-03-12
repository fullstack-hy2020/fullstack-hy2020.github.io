---
mainImage: ../../../images/part-9.svg
part: 9
letter: b
lang: en
---

<div class="content">

After the brief introduction on the main principles of TypeScript we are ready to start our journey towards a Fullstack TypeScript developer. This part will not give you a thorough introduction to all aspects of TypeScript, the goal is rather to have focus in most common issues that arise when developing express backends and React fronends with TypeScript. In addition to language features we will also have a strong emphasis in tooling.

### Setting things up

Install TypeScript support to your editor of choice. For [Visual Studio Code](https://code.visualstudio.com/) you need the [typescript hero](https://marketplace.visualstudio.com/items?itemName=rbbit.typescript-hero) extension.

As mentioned before, TypeScript code is not runnable by itself, but it first needs to be compiled into runnable JavaScript code. When TypeScript is compiled into JavaScript, the code becomes subject for type erasure. This means that type annotations, interfaces, type aliases, and other type system constructs are removed from the code and the result is pure ready-to-run JavaScript.

In a production environment this need for compilation often means that you have to setup a "build step", where all TypeScript code is compiled into JavaScript in a separate folder, and the production enviroment then runs the code from that folder. In a development environment it is often more handy to take use of real-time compilation and auto-reloading, in order to be able to see the resulting changes faster.


Let's start writing our first TypeScript-app. To keep things simple, let's start by using the npm package [ts-node](https://github.com/TypeStrong/ts-node), that compiles and executes the desired TypeScript file immediately, so that there is no need for the separate compilation step.

To use <i>ts-node</i> you could install it globally with the official <i>typescript</i> package by running <i>npm install -g ts-node typescript</i>. 

If you can't or don't want to install global packages you can create an npm project that has the required dependencies and run your scripts in it. We shall also go with this approach.

As we remember from [part 3](/en/part3) a npm project is set by running running command <i>npm init</i> in an empty directory. Then we can install the dependencies by running 

```
npm install --save-dev ts-node typescript
```

and set up <i>scripts</i> within the package.json file to include: 

```json
{
  // ..
  "scripts": {
    "ts-node": "ts-node" // highlight-line
  },
  // ..
}
```

Now within this directory you can use <i>ts-node</i>by running <i>npm run ts-node</i>. Notice that if you are using ts-node through package.json, all possible command line arguments for the script need to be prefixed with <i>--</i>. So if you want to run file.ts with <i>ts-node</i>, the whole command is:

```sh
npm run ts-node -- file.ts
```

It is worth mentioning, that TypeScript also provides an online playground, where you can quickly try out TypeScript code and also instantly see the resulting JavaScript code next to the TypeScript code, and also possible compilation errors. You can access TypeScript's official playground [here](https://www.typescriptlang.org/play/index.html).

**Notice:** The playground might contain different tsconfig rules (which will be introduced later) than your local environment, which is why you might see different warnings there, compared to your local environment. The playgrounds tsconfig is modifiable through the config dropdown menu.

#### A note about the coding sytle

JavaScript in itself is a fairly loose language and things often can be done in multiple different ways, for example named vs anonymous functions, using const and let or var and the use of <i>semicolons</i>. This part of the course differs from the rest by using semicolons. It is not a TypeScript specific pattern but a general coding style decision when creating any kind of JavaScript. Whether to use them or not is usually in the hands of the programmer but since it is expected to adapt ones coding habits to the existing codebase, in the exercises of this part it is expected to use semicolons and to adjust to the coding style of the part. This part contains also some other coding style differences e.g. in the directory naming compared to the rest od the course.

Let us start now by creating a simple Multiplier, exactly as you would in JavaScript.

```js
const multiplicator = (a, b, printText) => {
  console.log(printText,  a * b);
}

multiplicator(2, 4, 'Multiplied numbers 2 and 4, the result is:');
```

As we can see, this is still ordinary basic JavaScript with no additional TS features and it compiles and runs nicely with <i>npm run ts-node -- multiplier.ts</i>, as it would with Node. But what happens if we end up passing wrong <i>types</i> of arguments to the multiplicator function?

Let's try it out!

```js
const multiplicator = (a, b, printText) => {
  console.log(printText,  a * b);
}

multiplicator('how about a string?', 4, 'Multiplied a string and 4, the result is:');

```

Now when running the code, the example still produce an output, which is now:
<i>Multiplied a string and 4, the result is: NaN</i>. 

Wouldn't it be nice if there was a way that the language itself could prevent us from ending up in situations like this? This is where we get the first benefits of TypeScript into use. Let's add types to the parameters and see where it takes us.

TypeScript natively supports multiple types including <i>number</i>, <i>string</i>, <i>Array</i> see the comprehensive list [here](https://www.typescriptlang.org/docs/handbook/basic-types.html). More complex custom types can also be created.

The first two parameters of our function are of the type [number](http://www.typescriptlang.org/docs/handbook/basic-types.html#number) and the last is [string](http://www.typescriptlang.org/docs/handbook/basic-types.html#string):

```js
const multiplicator = (a: number, b: number, printText: string) => {
  console.log(printText,  a * b);
}

multiplicator('how about a string?', 4, 'Multplied a string and 4, the result is:');
```

Now the code is no longer valid JavaScript, but in fact TypeScript. When we try to run the code once, we notice that it does not compile:

![](../../images/9/2a.png)


One of the best things in TypeScript's editor support is that you don't necessarily need to even run the code to see the issues recognized by TypeScript. The VSCode plugin is so efficient, that it informs you immediately when you are trying to use an incorrect type, where another type is expected:

![](../../images/9/2.png)

### Creating your first own types

Let's expand our multiplicator and create a little bit more versatile calculator, that also supports addition and division. The calculator should accept three arguments: two numbers and then the operation, which tells the calculator what to do with those numbers; either <i>multiply</i>, <i>add</i> or <i>divide</i>.

With basic JavaScript, this type of code, where trusting a string to be of specific form, would require additional validation, but TypeScript offers us a way to define specific types for the inputs, which describes exactly what type of inputs are acceptable. On top of that, TypeScript can also show the info of the accepted values already on editor level.

To create our <i>type</i> we use the TypeScript native keyword  <i>type</i> to describe what we want to accept. Let's describe our type <i>Operation</i>:

```js
type Operation = 'multiply' | 'add' | 'divide';
```

Now the <i>Operation</i> type accepts only three kinds of input; exactly the three wanted strings. With the OR operator _|_ we can define a variable to accept multiple values by creating a [union type](https://www.typescriptlang.org/docs/handbook/advanced-types.html#union-types). In this case we used exact strings (that in technical terms are called [string literal types](http://www.typescriptlang.org/docs/handbook/advanced-types.html#string-literal-types)) but with unions you could also inform the compiler to accept for example both string and number: _string | number_.

In techincal terms the keyword <i>type</i> creates [a type alias](https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-aliases), that is a new name for a type. Since the defined type is a union of three possible values, it is handy to give it an alias that has a representative name.

Let's look at our calculator now:

```js
type Operation = 'multiply' | 'add' | 'divide';

const calculator = (a: number, b: number, op : Operation) => {
  if (op === 'multiply') {
    return a * b;
  } else if (op === 'add') {
    return a + b;
  } else if (op === 'divide') {
    if (b === 0) return 'can\'t divide by 0!';
    return a / b;
  }
}
```

Now when we hover on top of the <i>Operation</i> type in the calculator function, we can immediately see suggestions on what to do with it:

![](../../images/9/3.png)

And if we try to use a value, that is not within the <i>Operation</i> type, we get the familiar red warning signal and extra info from our editor:

![](../../images/9/4.png)

This is already pretty nice, but one thing we haven't touched yet, is typing the return value of a function. Usually you want to know what a function returns and it would be nice to have some guarantee on it. Let's add a return value <i>number</i> for the calculator function:

```js
type Operation = 'multiply' | 'add' | 'divide';

const calculator = (a: number, b: number, op: Operation): number => {

  if (op === 'multiply') {
    return a * b;
  } else if (op === 'add') {
    return a + b;
  } else if (op === 'divide') {
    if (b === 0) return 'this cannot be done';
    return a / b;
  }
}
```

Compiler complains straight away abaout this since the function is not returning a number, but in some cases it returns a string. We can fix it in a couple of ways. We could extend the return type to allow also string values, like this:

```js
const calculator = (a: number, b: number, op: Operation): number | string =>  {
  // ...
}
```

We could also create a return type that includes the both possible values, much like the type Operation.

```js
type Result = string | number

const calculator = (a: number, b: number, op: Operation): Result =>  {
  // ...
}
```

But now is time for the question: is it <i>really</i> okay for the function to return a string?

When you have written code that can actually end up in a situation where something is divided by 0 it probably means something has gone terribly wrong and in that case an error should probably be thrown and handled somewhere where the function was called. When you are deciding to return values you weren't originally planning, the warnings you see from TypeScript restrict you from making rushed decisions and help you to keep your code working as expected.

One more thing to consider is that even though we have in our code defined what types of parameters to accept, the generated JavaScript that is used runtime doesn't anymore have these type checks. So, if for example the <i>operation</i>-parameter's value comes from an external interface, there is no definite guarantee that it will be one of the allowed values. Therefore it's still better to include error handling to be prepared for the unexpected to happen. In this case, when there are multiple possible accepted values and all unexcpeted ones should result in an error, the [switch...case](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch) statement suits better than if...else in our code. 

The resulting code of our calculator could actually look something like this:

```js
type Operation = 'multiply' | 'add' | 'divide';

type Result = number;

const calculator = (a: number, b: number, op : Operation) : Result => {
  switch(op) {
    case 'multiply':
      return a * b;
    case 'divide':
      if( b === 0) throw new Error('can\'t divide by 0!');
      return a / b;
    case 'add':
      return a + b;
    default:
      throw new Error('Operation is not multiply, add or divide!');
  }
}

try {
  console.log(calculator(1, 5 , 'divide'))
} catch (e) {
  console.log('Something went wrong, error message: ', e.message);
}
```

The programs we've written are alright, but it sure would be better if there were a way to use command line arguments instead of always having to change the code to calculate different things. Let's try it out, as we would in a regular Node application, by accessing <i>process.argv</i>. But something is not right:

![](../../images/9/5.png)

### @types/{npm_package}

Let's return to the basic idea of TypeScript. TypeScript expects all globally used code to be typed, as it does for your own code when your project has a reasonable configuration. The TypeScript library itself contains only typings for the code of the TypeScript package. It is possible to write your own typings for a library, but that is almost never needed - since the TypeScript community has done it for us!

As in the world of npm, TypeScript also celebrates open source code and the community around it is active and continuously reacting to updates and changes in commonly used npm-packages. That is why the typings for npm-packages are almost always to be found, so that you won't be alone creating types for all of your thousands of dependencies.

Usually types for existing packages can be found by under the <i>@types</i>-organization within npm, so that you can add the relevant types to your project by installing an npm package with the name of your package with a @types/ - prefix, for example:<i>npm install --save-dev @types/react @types/express @types/lodash @types/jest @types/mongoose</i> and the list goes on and on. The <i>@types/*</i> are maintained by [Definitely typed](http://definitelytyped.org/), a community project with the goal to mainting types of everything in one place.

Sometimes a npm package can also include its types within the code andin that case installing the corresponding <i>@types/*</i> is not necessary.

> **Notice:** Since the typings are only used before compilation, the typings are not needed in the production build and they should <i>always</i> be in the devDependencies of the package.json.

So since the global variable <i>process</i> is defined by Node itself, we get its typings by intalling package <i>@types/node</i>:

```sh
npm install --save-dev @types/node
```

After installing the types, compiler does not complain anymore about the variable <i>process</i>. Note that there is no need to require the types to code, the intallation of the package is enough!

### Improving the project

Let us now add npm scripts with which we can run our two programs <i>multiplier</i> and <i>calculator</i>:

```json
{
  "name": "part1",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "ts-node": "ts-node",
    "multiply": "ts-node multiplier.ts", // highlight-line
    "calculate": "ts-node calculator.ts" // highlight-line
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "ts-node": "^8.6.2",
    "typescript": "^3.8.2"
  }
}
```

We can now get the multipier to work with command line parameters with the following changes

```js
const multiplicator = (a: number, b: number, printText: string) => {
  console.log(printText,  a * b);
}

const a: number = Number(process.argv[2])
const b: number = Number(process.argv[3])
multiplicator(a, b, `Multplied ${a} and ${b}, the result is:`);
```

at it can be run as follows

```sh
npm run multiply 5 2
```

if program is run with parameters that are not of the right type, e.g.

```sh
npm run multiply 5 lol
```

it "works" but gives us the answer

```sh
Multplied 5 and NaN, the result is: NaN
```

The reason for this is that the <i>Number('lol')</i> returns <i>NaN</i> which actually has the type <i>number</i> so TypeScript has no power to rescue from this kind of situation. 

In order to save us from this kind of behavior, we have to validate the data that is given to us as in command line. 

Improved version of the multiplicator looks this:

```js
interface MultiplyValues {
  value1: number;
  value2: number;
}

const parseArguments = (args: Array<string>): MultiplyValues => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      value1: Number(args[2])
      value2: Number(args[3])
    }
  } else {
    throw new Error('Provided values were not numbers!');
  }
}

const multiplicator = (a: number, b: number, printText: string) => {
  console.log(printText,  a * b);
}

try {
  const { value1, value2 } = parseArguments(process.argv);
  multiplicator(value1, value2, `Multiplied ${value1} and ${value2}, the result is:`);
} catch (e) {
  console.log('Error, something bad happened, message: ', e.message);
}
```

When we now run the program 

```sh
npm run multiply 1 lol
```

we get a proper error message:

```sh
Error, something bad happened, message:  Provided values were not numbers!
```

Definition of the function <i>parseArguments</i> has couple of interesting things:

```js
const parseArguments = (args: Array<string>): MultiplyValues => {
  // ...
}
```

Firstly the parameter <i>args</i> is an [array](http://www.typescriptlang.org/docs/handbook/basic-types.html#array) of strings. The return value has type <i>MultiplyValues</i>, that is defined as follows:

```js
interface MultiplyValues {
  value1: number;
  value2: number;
}
```

Definition utilizes TypeScript [Interface](http://www.typescriptlang.org/docs/handbook/interfaces.html) that is one way to define what "shape" an object should have. In our case it is quite obvious that return values should be objects that have properties <i>value1</i> and <i>value2</i> that both have type number.

</div>

<div class="tasks">

### Exercises 9.1.-9.3.

#### setup

Exercises 9.1.-9.7. will be all made to the same node project. Create the project in an empty directory with <i>npm init</i> and install ts-node and typescript packages. Create also the file <i>tsconfig.json</i> to the directory with the following content:

```json
{
  "compilerOptions": {
    "noImplicitAny": true,
  }
}
```

<i>tsconfig.json</i> is used to define how TypeScript compiler should interpret the code, how strictly should the compilator work and on what files to watch or ignore, and [much more](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html). Right now we will only use the compiler option [noImplicitAny](https://www.typescriptlang.org/v2/en/tsconfig#noImplicitAny), that makes it mandatory to have types for all variables used.

#### 9.1 Body mass index

Create the code of this exercise to file <i>bmiCalculator.ts</i>

Write a function <i>calculateBmi</i> that counts [BMI](https://en.wikipedia.org/wiki/Body_mass_index) based on given weight (in kilograms) and height (in centimeters) and then returns a message that suits the results. 

Call the function in the same file with hard-coded parameters and print out the result. The code

```js
console.log(calculateBmi(180, 74))
```

should print the following message

```sh
Normal (healthy weight)
```

Create a npm script for running the program with command <i>npm run calculteBmi</i>

#### 9.2 Exercise calculator

Create the code of this exercise to file <i>exerciseCalculator.ts</i>

Write a function <i>calculteExercises</i> that calculates the average time of <i>daily exercise hours</i> and compares it to the <i>target amount</i> of daily hours and returns an object that includes the following values:

  - the number of days
  - the number of training days
  - the original target value
  - the calculated average time
  - boolean value describing if the target was reached
  - a rating between the numbers 1-3 that tells how well the hours are met. You can decide on the metric on your own.
  - a text value explaining the rating

The daily exercise hours are given to the function as an [array](https://www.typescriptlang.org/docs/handbook/basic-types.html#array) that contains the number of exercise hours for each day in the training period. Eg. a week with 3 hours of training at Monday, none at Tuesday, 2 hours at Wednesday, 4.5 hours at Thursday and so on would be represented by the following array:

```js
[3, 0, 2, 4.5, 0, 3, 1, 0, 4]
```

For the Result object you should to create an [interface](https://www.typescriptlang.org/docs/handbook/interfaces.html).

If you would call the function with parameters <i>[3, 0, 2, 4.5, 0, 3, 1, 0, 4]</i> and <i>2</i> it could return

```js
{ periodLength: 7,
  trainingDays: 4,
  success: false,
  rating: 2,
  ratingDescription: 'not too bad but could be better',
  target: 2,
  average: 1.5 }
```

Create a npm script <i>npm run calculteExercises</i> for calling the function with hard coded values.

#### 9.3 Command line

Change the previous exersises so that you can give the parameters of <i>bmiCalculator</i> and <i>exerciseCalculator</i> as command line arguments.

Your program could work eg. as follows:

```sh
$ npm run calculteBmi 180 91

Overweight
```

and

```sh
$ npm run calculteExercises 2 1 0 2 4.5 0 3 1 0 4

{ periodLength: 9,
  trainingDays: 6,
  success: false,
  rating: 2,
  ratingDescription: 'not too bad but could be better',
  target: 2,
  average: 1.7222222222222223 }
```

In the example the <i>first argument</i> is the target value.

Handle exeptions and errors appropriately. exerciseCalculator should accept inputs of varied length. Determine by yourself how you manage to collect all needed input.

</div>

<div class="content">

### More about tsconfig

In the exercises we used only one tsconfig rule [noImplicitAny](https://www.typescriptlang.org/v2/en/tsconfig#noImplicitAny) which is a good place to start but now it is time to start looking into the file a little bit deeper.

[tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) includes all your core configurations on how you want TypeScript to work in your project. In tsconfig.json you can define how strictly you want the code to be inspected, what files to include, what files to exclude (<i>node_modules</i> is excluded by default), and where compiled files should be placed (more on this later). 

Let us now use <i>tsconfig.json</i> that has the following form:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,       
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true
  }
}
```

Do not worry too much about the <i>compilerOptions</i> selected here, they will be under closer inspection on part 2.

The explanations for each of the field can be found from TypeScript documentation or the really handy although beta-stage [tsconfig page](https://www.typescriptlang.org/v2/en/tsconfig) or in a little worse format in the tsconfig [schema definition](http://json.schemastore.org/tsconfig).

### Adding express to the mix

Right now we are at a pretty good place, our project is set up and we have two runnable calculators there. But since our aim is to learn fullstack development, it is time to start writing code that responds to HTTP-requests. 

Let us start by installing express:

```
npm install express
```

add then add the <i>start</i> sript to in package.json to be:

```json
{
  // ..
  "scripts": {
    "ts-node": "ts-node",
    "multiply": "ts-node multiplier.ts",
    "calculate": "ts-node calculator.ts",
    "start": "ts-node index.ts" // highlight-line
  },
  // ..
}
```

Now we can create the file <i>index.ts</i>, and write the HTTP GET <i>ping</i> endpoint to it: 

```js
const express = require('express');
const app = express();

app.get('/ping', (req, res) => {
  res.send('pong');
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

Everything else seems to be going nice but as you'd expect, but the <i>req</i> and  <i>res</i> parameters of <i>app.get</i> need typing. If we look really carefully VS Code is also complaining us about something about the express importing, that is indicated by the short yellow line of dots under the <i>require</i>. Let's hover over the problem:

![](../../images/9/6.png)

The complaint is <i>'require' call may be converted to a import</i>. Let us follow the advice and write the import as follows

```js
import express from 'express';
```

**Note that** by clicking the <i>Quick fix...</i> button VSCode offers you a possibility to fix the issue automatically. Keep your eyes open all the time for these helpers/quick fixes the editor offers you; listening to your editor usually only makes your code better and easier to read and automatic fixes for issues can be a major time saver.

Now we run into the another problem, complain in the newly created import. Once again the editor is our biggest friend when trying to find out what the issue is about:

![](../../images/9/7.png)

We still haven't installed the types for <i>express</i>. Let's do what the suggestion says and run:

```
npm install --save-dev @types/express
```

And now no errors are found anymore! Let's take an even deeper look into what changed here.

With the <i>require</i> clause, when hovering on the imported module <i>express</i>, we can see that the compiler interprets all express related to the type <i>any</i>.

![](../../images/9/8a.png)

Whereas when the <i>import</i> version is used, editor knows the actual types

![](../../images/9/9a.png)

What kind of import statement you should use, depends on the type of which exporting method is used in the imported package.

A good rule of thumb is to primarily start by trying to import a module with the <i>import</i> clause, that is the one we are always using in <i>frontend</i>. If it causes an error, try a combination of the both: <i>import ... = require('...')</i>.

We strongly suggest to read more on TypeScript modules [here](https://www.typescriptlang.org/docs/handbook/modules.html).

There is one more problem with the code

![](../../images/9/9b.png)

This is because we banned unused parameters in out <i>tsconfig.json</i>

```js
{
  "compilerOptions": {
    "target": "ES2020",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true, // highlight-line
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true
  }
}
```

This configuration might create problems when we have library-wide predefined functions, that like in this case require declaring a variable, even though in the code it is not necessarily required to use at all. Fortunately this issue has already been solved on configuration level and once again hovering on the issue gives us a solution for the problem, this time by clicking the quick fix button: 

![](../../images/9/14a.png)

If it is absolutely impossible to get rid of an unused variable, you should prefix it with an underscore to inform the compiler that this has been taken into consideration and there is nothing we can do about it. 

Let's rename the <i>req</i> variable to <i>_req</i>. Now we are finally ready to start up the application, and it seems to work fine:

![](../../images/9/11a.png)


Now to simplify the development we should enable <i>auto reloading</i> to improve our workflow. In this course you have already used <i>nodemon</i>, but ts-node has an alternative called <i>ts-node-dev</i> which is meant only for development environment that takes care of recompilation on every change so restarting the application won't be necessary.

Let's install <i>ts-node-dev</i> to our development dependencies 

```
npm install --save-dev ts-node-dev
```

add add a script to <i>package.json</i>

```json
{
  // ...
  "scripts": {
      // ...
      "dev": "ts-node-dev index.ts", // highlight-line
  },
  // ...
}
```

And now by running <i>npm run dev</i> we have a working auto-reloading development environment for our project!

</div>

<div class="tasks">

### Exercises 9.4.-9.5.

#### 9.4 Express

Add express to your dependecies and create a HTTP GET endpoint <i>hello</i> that answers 'Hello Full Stack!'

The web app should be started with command <i>npm start</i> in prduction mode and <i>npm run dev</i> in development mode that should use <i>ts-node-dev</i> to run the app.

Replace also your existing <i>tsconfig.json</i> file with the  following content:

```json
{
  "compilerOptions": {
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "strictNullChecks": true,
    "strictPropertyInitialization": true,
    "strictBindCallApply": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "esModuleInterop": true,
    "declaration": true,
  }
}
```

make sure there are not any errors!

#### 9.5 WebBMI

Add an enpoint for BMI-calculator that can be used by doing a HTTP GET request to endpoint <i>bmi</i> and specifying the input with [query string parameters](https://en.wikipedia.org/wiki/Query_string). For example to get bmi for person having heigth 180 and weigth 72, the url is http://localhost:3002/bmi?heigth=180&weight=72

The response is a json of the form

```js
{
  weight: 72,
  heigth: 180,
  bmi: "Normal (healthy weight)"
}
```

See the [express documentation](http://expressjs.com/en/5x/api.html#req.query) for info how to access the query parameters.

If the query parameters of the request are of the wrong type or missing, response with proper statuscode and error message are given

```js
{
  error: "malformatted parameters"
}
```

Do not copy the caclucator code to file <i>index.ts</i>, make it a [typescript module](https://www.typescriptlang.org/docs/handbook/modules.html) that can be imported in <i>index.ts</i>. 

</div>

<div class="content">

### The horrors of <i>any</i>

Now that we have our first small endpoints done, one thing to notice is that in these minimal examples barely any TypeScript is actually in the code. When looking more closely at the code, we can see a few possibly dangerous things. 


Let's add an HTTP GET endpoint <i>calculate</i> to our app:

```js
import { calculator } from './calculator'

// ...

app.get('/calculate', (req, res) => {
  const { value1, value2, op } = req.query

  const result = calculator(value1, value2, op)
  res.send(result);
});
```


When we hover on the <i>calculate</i> function, we can see the typing of the <i>calculator</i> even though the file itself doesn't contain any typings:

![](../../images/9/12a.png)


But when we hover over the parsed values from the request, ann issues arise:

![](../../images/9/13a.png)

All of the varialbes have type <i>any</i>. Well, it is not that surprising since no one has given those a type. There are a couple of ways to fix this, but first thing to consider is why is this accepted and where did the type <i>any</i> come from?

In TypeScript every untyped variable, for which the type cannot be inferred, becomes implicitly [any](http://www.typescriptlang.org/docs/handbook/basic-types.html#any), which is a kind of "wild card" type that can literally stand for <i>whatever possible type</i>. This happens quite often when one forgets to type functions. 

The type <i>any</i> can also be explicitly specified as any other type. The only difference between these two is how the code looks, the compiler is not affected from the difference.

However, implicit <i>any</i> and explicit enforcing of the <i>any</i> type onto a variable affects how a programmer sees the code. Implicit typings of <i>any</i> are usually considered problematic, since it  is quite often a matter of the coder simply forgotting to assign types (or being too lazy to do that) and because of that not exploiting the full power TypeScript in the code. 

This is why the rule [noImplicitAny](https://www.typescriptlang.org/v2/en/tsconfig#noImplicitAny) exists already on compiler level and it is highly recommended to keep it on at all time. In the rare cases where you seriously cannot know what the type of a variable is, you should explicitly state it in the code 

```js
const a : any = /* no clue what the type will be! */.
```

We have already <i>noImplicitAny</i> defined in our example code, so why does not the compiler compalain about <i>any</i> types?

The reason is that the field <i>query</i> of the express <i>Request</i> object is actually explicitly typed as <i>any</i>. We can enforce (and probably should) enforce typings to know the form of our accepted request, but since the compiler or the editor doesn't suggest that kind of behaviour, what's the point?

Fortunately TypeScript and tsConfig are not the only places to enforce coding style and what we should do is to take eslint into use to help us manage our code. Let's install eslint and a typescript extension for it called typescript-eslint and set up a rule to disallow_explicit <i>any</i> typings_.

```
npm install --save-dev eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

Now let's set up our eslint by creating a file .eslintrc to follow the following setting:

```json
{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 11,
    "sourceType": "module"
  },
  "plugins": ["@typescript-eslint"],
  
  : {
    "@typescript-eslint/no-explicit-any": 2
  }
}
```

And let's set up the <i>lint</i> script to inspect the files with <i>.ts</i> extension by adding a script to the _package.json_ file:

```json
{
  // ...
  "scripts": {
      "start": "ts-node index.ts",
      "dev": "ts-node-dev index.ts", 
      "lint": "eslint --ext *.ts"// highlight-line
      //  ...
  },
  // ...
}
```

And now live code inspection should be working!

The <i>@typescript-eslint</i> plugin has lots of TypeScript-only lint rules but also all basic eslint rules are usable in TypeScript projects. We should probably for now just use the recommended settings and see where it takes us and modify our rules as we go, if we find something we want to behave differently. On top of the regular recommended settings we should already try to get familiar with coding styles we are using this week and _set the semicolon at the end of each line of code to required_. So let's set the <i>.eslintrc</i> to include the following:

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  "plugins": ["@typescript-eslint"],
  "env": {
    "browser": true,
    "es6": true
  },
  "rules": {
    "@typescript-eslint/semi": ["error"],
    "@typescript-eslint/no-explicit-any": 2,
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "no-case-declarations": 0
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json"
  }
}
```

And now let's fix everything that needs to be fixed!

</div>

<div class="tasks">

### Exercises

#### 9.7

Add an endpoint to your app for the exercise calculator. It should be used by doing a HTTP POST request to endpoint _exercises_ with the input in the request body

```js
{
  daily_exercises: [1, 0, 2, 0, 3, 0, 2.5], 
  target: 7
}
```

Response is a json of the following form

```js
{
    "periodLength": 7,
    "trainingDays": 4,
    "success": false,
    "rating": 1,
    "ratingDescription": "bad",
    "target": 7,
    "average": 1.2142857142857142
}
```

If the body of the request is not of the right form, response with proper status code and error message is given. The error message is either

```js
{
  error: "parameters missing"
}
```

or

```js
{
  error: "malformatted parameters"
}
```

depending on the error. The latter happens if the input values do not have the right type, i.e. they are not numbers or convertable to numbers.


</div>
