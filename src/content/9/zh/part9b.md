---
mainImage: ../../../images/part-9.svg
part: 9
letter: b
lang: zh
---

<div class="content">

<!-- After the brief introduction to the main principles of TypeScript, we are now ready to start our journey towards becoming FullStack TypeScript developers.-->
在简单介绍了TypeScript的主要原理后，我们现在准备开始成为FullStack TypeScript开发者的旅程。
<!-- Rather than giving you a thorough introduction to all aspects of TypeScript, we will focus in this part on the most common issues that arise when developing express backends or React frontends with TypeScript.-->
 我们不会给你一个关于TypeScript所有方面的彻底介绍，而是在这一部分重点介绍用TypeScript开发Express后端或React前端时最常见的问题。
<!-- In addition to language features, we will also have a strong emphasis on tooling.-->
除了语言特性，我们还将着重强调工具的使用。

### Setting things up

<!-- Install TypeScript support to your editor of choice. [Visual Studio Code](https://code.visualstudio.com/) works natively with TypeScript.-->
 在你选择的编辑器中安装TypeScript支持。[Visual Studio Code](https://code.visualstudio.com/)可以与TypeScript原生工作。

<!-- As mentioned earlier, TypeScript code is not executable by itself. It has to be first compiled into executable JavaScript.-->
 如前所述，TypeScript代码本身是不可执行的。它必须首先被编译成可执行的JavaScript。
<!-- When TypeScript is compiled into JavaScript, the code becomes subject for type erasure. This means that type annotations, interfaces, type aliases, and other type system constructs are removed and the result is pure ready-to-run JavaScript.-->
 当TypeScript被编译成JavaScript时，代码就会成为类型清除的对象。这意味着类型注释、接口、类型别名和其他类型系统结构被移除，结果是纯粹的可运行的JavaScript。

<!-- In a production environment, the need for compilation often means that you have to set up a "build step." During the build step all TypeScript code is compiled into JavaScript in a separate folder, and the production environment then runs the code from that folder. In a development environment, it is often handier to make use of real-time compilation and auto-reloading in order to be able to see the resulting changes more quickly.-->
 在生产环境中，编译的需要往往意味着你必须设置一个 "构建步骤"。在构建步骤中，所有的TypeScript代码都被编译成一个单独的文件夹中的JavaScript，然后生产环境从该文件夹中运行代码。在开发环境中，为了能更快地看到所产生的变化，利用实时编译和自动重载往往更方便。

<!-- Let's start writing our first TypeScript app. To keep things simple, let's start by using the npm package [ts-node](https://github.com/TypeStrong/ts-node). It compiles and executes the specified TypeScript file immediately, so that there is no need for a separate compilation step.-->
 让我们开始编写我们的第一个TypeScript应用。为了保持简单，让我们从使用npm包[ts-node](https://github.com/TypeStrong/ts-node)开始。它可以立即编译并执行指定的TypeScript文件，因此不需要单独的编译步骤。

<!-- You can install both <i>ts-node</i> and the official <i>typescript</i> package globally by running:-->
 你可以通过运行<i>ts-node</i>和官方的<i>typescript</i>包全局安装。
```
npm install -g ts-node typescript
```

<!-- If you can't or don't want to install global packages, you can create an npm project which has the required dependencies and run your scripts in it.-->
 如果你不能或不想安装全局包，你可以创建一个具有所需依赖性的npm项目并在其中运行你的脚本。
<!-- We will also take this approach.-->
 我们也将采取这种方法。

<!-- As we remember from [part 3](/en/part3), an npm project is set by running the command <i>npm init</i> in an empty directory. Then we can install the dependencies by running-->
 正如我们在[第三章节](/en/part3)中所记得的，一个npm项目是通过在一个空目录中运行命令<i>npm init</i>来设置的。然后，我们可以通过运行

```
npm install --save-dev ts-node typescript
```

<!-- and set up <i>scripts</i> within the package.json:-->
 并在package.json中设置<i>scripts</i>。

```json
{
  // ..
  "scripts": {
    "ts-node": "ts-node" // highlight-line
  },
  // ..
}
```

<!-- You can now use <i>ts-node</i> within this directory by running <i>npm run ts-node</i>. Note that if you are using ts-node through package.json, all command-line arguments for the script need to be prefixed with <i>--</i>. So if you want to run file.ts with <i>ts-node</i>, the whole command is:-->
 你现在可以通过运行<i>npm run ts-node</i>在这个目录中使用<i>ts-node</i>。注意，如果你通过package.json使用ts-node，脚本的所有命令行参数需要以<i>--</i>为前缀。因此，如果你想用<i>ts-node</i>运行file.ts，整个命令是。

```shell
npm run ts-node -- file.ts
```

<!-- It is worth mentioning that TypeScript also provides an online playground, where you can quickly try out TypeScript code and instantly see the resulting JavaScript and possible compilation errors. You can access TypeScript's official playground [here](https://www.typescriptlang.org/play/index.html).-->
 值得一提的是，TypeScript还提供了一个在线游乐场，在那里你可以快速尝试TypeScript代码，并立即看到产生的JavaScript和可能的编译错误。你可以访问TypeScript's official playground [here](https://www.typescriptlang.org/play/index.html)。

<!-- **NB:** The playground might contain different tsconfig rules (which will be introduced later) than your local environment, which is why you might see different warnings there compared to your local environment. The playground's tsconfig is modifiable through the config dropdown menu.-->
 **NB:** 游戏场可能包含与你的本地环境不同的tsconfig规则（将在后面介绍），这就是为什么你可能在那里看到与你的本地环境不同的警告。Playground's tsconfig可以通过config下拉菜单进行修改。

#### A note about the coding style

<!-- JavaScript is a quite relaxed language in itself, and things can often be done in multiple different ways. For example, we have named vs anonymous functions, using const and let or var, and the use of <i>semicolons</i>. This part of the course differs from the rest by using semicolons. It is not a TypeScript-specific pattern but a general coding style decision taken when creating any kind of JavaScript project. Whether to use them or not is usually in the hands of the programmer, but since it is expected to adapt one's coding habits to the existing codebase, you are expected to use semicolons and to adjust to the coding style in the exercises for this part. This part has some other coding style differences compared to the rest of the course as well, e.g. in the directory naming conventions.-->
 JavaScript本身是一种相当宽松的语言，事情往往可以用多种不同的方式完成。例如，我们有命名与匿名函数，使用const和let或var，以及使用<i>分笔记</i>。这部分课程与其他课程的不同之处在于使用分号。这不是TypeScript特有的模式，而是在创建任何类型的JavaScript项目时采取的一般编码风格决定。是否使用它们通常由程序员自己决定，但由于它被期望使一个人的编码习惯适应现有的代码库，你被期望使用分号并适应这部分练习的编码风格。与课程的其他部分相比，这一部分还有一些其他的编码风格差异，例如，在目录命名惯例方面。

<!-- Let us add the project a configuration file _tsconfig.json_ with the following content:-->
 让我们为项目添加一个配置文件_tsconfig.json_，内容如下。

```js
{
  "compilerOptions":{
    "noImplicitAny": false
  }
}
```

<!-- The <i>tsconfig.json</i> file is used to define how the TypeScript compiler should interpret the code, how strictly the compiler should work, which files to watch or ignore, and [much much more](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).-->
 <i>tsconfig.json</i>文件用于定义TypeScript编译器应该如何解释代码，编译器应该如何严格工作，哪些文件需要观察或忽略，以及[很多很多](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)。
<!-- For now we will only use the compiler option [noImplicitAny](https://www.typescriptlang.org/tsconfig#noImplicitAny), that does not require to have types for all variables used.-->
 现在我们将只使用编译器选项[noImplicitAny](https://www.typescriptlang.org/tsconfig#noImplicitAny)，它不要求对所有使用的变量都有类型。

<!-- Let's start by creating a simple Multiplier. It looks exactly as it would in JavaScript.-->
 让我们从创建一个简单的乘法器开始。它看起来和JavaScript中的一模一样。

```js
const multiplicator = (a, b, printText) => {
  console.log(printText,  a * b);
}

multiplicator(2, 4, 'Multiplied numbers 2 and 4, the result is:');
```

<!-- As you can see, this is still ordinary basic JavaScript with no additional TS features. It compiles and runs nicely with  <i>npm run ts-node -- multiplier.ts</i>, as it would with Node.-->
 正如你所看到的，这仍然是普通的基本JavaScript，没有额外的TS功能。它用<i>npm run ts-node -- multiplier.ts</i>很好地编译和运行，就像用Node一样。

<!-- But what happens if we end up passing wrong <i>types</i> of arguments to the multiplicator function?-->
 但是如果我们最终向乘法器函数传递了错误的<i>类型</i>参数，会发生什么？

<!-- Let's try it out!-->
 我们来试试吧!

```js
const multiplicator = (a, b, printText) => {
  console.log(printText,  a * b);
}

multiplicator('how about a string?', 4, 'Multiplied a string and 4, the result is:');

```

<!-- Now when we run the code, the output is: <i>Multiplied a string and 4, the result is: NaN</i>.-->
 现在当我们运行这段代码时，输出是。<i>将一个字符串和4相乘，结果是。NaN</i>。

<!-- Wouldn't it be nice if the language itself could prevent us from ending up in situations like this?-->
如果语言本身能够防止我们陷入这样的情况，那不是很好吗？
<!-- This is where we see the first benefits of TypeScript.  Let's add types to the parameters and see where it takes us.-->
这就是我们看到TypeScript的第一个好处的地方。  让我们为参数添加类型，看看它能给我们带来什么。

<!-- TypeScript natively supports multiple types including <i>number</i>, <i>string</i> and  <i>Array</i>. See the comprehensive list [here](https://www.typescriptlang.org/docs/handbook/basic-types.html). More complex custom types can also be created.-->
 TypeScript原生支持多种类型，包括<i>number</i>、<i>string</i>和<i>Array</i>。请看全面的列表[这里](https://www.typescriptlang.org/docs/handbook/basic-types.html)。更复杂的自定义类型也可以被创建。

<!-- The first two parameters of our function are of the type [number](http://www.typescriptlang.org/docs/handbook/basic-types.html#number) and the last is a [string](http://www.typescriptlang.org/docs/handbook/basic-types.html#string):-->
 我们函数的前两个参数是[数字](http://www.typescriptlang.org/docs/handbook/basic-types.html#number)类型，最后一个是[字符串](http://www.typescriptlang.org/docs/handbook/basic-types.html#string)。

```js
const multiplicator = (a: number, b: number, printText: string) => {
  console.log(printText,  a * b);
}

multiplicator('how about a string?', 4, 'Multiplied a string and 4, the result is:');
```

<!-- Now the code is no longer valid JavaScript, but in fact TypeScript. When we try to run the code, we notice that it does not compile:-->
 现在的代码不再是有效的JavaScript，而是事实上的TypeScript。当我们试图运行这段代码时，我们注意到它并没有被编译。

![](../../images/9/2a.png)


<!-- One of the best things in TypeScript's editor support is that you don't necessarily need to even run the code to see the issues.-->
 TypeScript编辑器支持的最好的一点是，你甚至不一定需要运行代码就能看到问题。
<!-- The VSCode plugin is so efficient, that it informs you immediately when you are trying to use an incorrect type:-->
 VSCode插件是如此高效，以至于当你试图使用一个不正确的类型时，它会立即通知你。

![](../../images/9/2.png)

### Creating your first own types

<!-- Let's expand our multiplicator into a slightly more versatile calculator that also supports addition and division. The calculator should accept three arguments: two numbers and the operation, either <i>multiply</i>, <i>add</i> or <i>divide</i>, which tells it what to do with the numbers.-->
 让我们把我们的乘法器扩展成一个稍微通用的计算器，同时支持加法和除法。这个计算器应该接受三个参数：两个数字和操作，要么是<i>multiply</i>, <i>add</i>或者<i>divide</i>，告诉它如何处理这些数字。

<!-- In JavaScript, the code would require additional validation to make sure the last argument is indeed a string. TypeScript offers a way to define specific types for inputs, which describe exactly what type of input is acceptable. On top of that, TypeScript can also show the info of the accepted values already at editor level.-->
 在JavaScript中，代码将需要额外的验证，以确保最后一个参数确实是一个字符串。TypeScript提供了一种为输入定义特定类型的方法，它确切地描述了什么类型的输入是可接受的。在此基础上，TypeScript还可以在编辑器级别显示已接受的值的信息。

<!-- We can create a <i>type</i> using the TypeScript native keyword <i>type</i>. Let's describe our type <i>Operation</i>:-->
 我们可以使用TypeScript本地关键字<i>type</i>创建一个<i>type</i>。让我们来描述我们的类型<i>Operation</i>。

```js
type Operation = 'multiply' | 'add' | 'divide';
```

<!-- Now the <i>Operation</i> type accepts only three kinds of input; exactly the three strings we wanted.-->
 现在，<i>Operation</i>类型只接受三种输入；正是我们想要的三个字符串。
<!-- Using the OR operator _|_ we can define a variable to accept multiple values by creating a [union type](https://www.typescriptlang.org/docs/handbook/advanced-types.html#union-types).-->
 使用OR运算符_|_，我们可以通过创建一个[联合类型](https://www.typescriptlang.org/docs/handbook/advanced-types.html#union-types)来定义一个变量，接受多个值。
<!-- In this case, we used exact strings (that, in technical terms, are called [string literal types](http://www.typescriptlang.org/docs/handbook/advanced-types.html#string-literal-types)) but with unions, you could also make the compiler accept for example both string and number: _string | number_.-->
 在这个例子中，我们使用了精确的字符串（在技术术语中，被称为[字符串字面类型](http://www.typescriptlang.org/docs/handbook/advanced-types.html#string-literal-types)），但是通过联合，你也可以让编译器同时接受字符串和数字。_string | number_。

<!-- The <i>type</i> keyword defines a new name for a type: [a type alias](https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-aliases). Since the defined type is a union of three possible values, it is handy to give it an alias that has a representative name.-->
 <i>type</i>关键字为一个类型定义了一个新的名字。[一个类型的别名](https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-aliases)。由于定义的类型是三个可能的值的联合体，给它一个具有代表性的名字的别名是很方便的。

<!-- Let's look at our calculator now:-->
 我们现在来看看我们的计算器。

```js
type Operation = 'multiply' | 'add' | 'divide';

const calculator = (a: number, b: number, op : Operation) => {
  if (op === 'multiply') {
    return a * b;
  } else if (op === 'add') {
    return a + b;
  } else if (op === 'divide') {
    if (b === 0) return 'can't divide by 0!';
    return a / b;
  }
}
```

<!-- Now, when we hover on top of the <i>Operation</i> type in the calculator function, we can immediately see suggestions on what to do with it:-->
 现在，当我们把鼠标悬停在计算器函数中的<i>操作</i>类型上面时，我们可以立即看到关于如何处理它的建议。

![](../../images/9/3.png)

<!-- And if we try to use a value that is not within the <i>Operation</i> type, we get the familiar red warning signal and extra info from our editor:-->
 如果我们试图使用一个不在<i>操作</i>类型内的值，我们会得到熟悉的红色警告信号和来自编辑器的额外信息。

![](../../images/9/4x.png)

<!-- This is already pretty nice, but one thing we haven't touched yet is typing the return value of a function. Usually, you want to know what a function returns, and it would be nice to have a guarantee that it actually returns what it says it does. Let's add a return value <i>number</i> to the calculator function:-->
 这已经很不错了，但我们还没有触及的一件事是输入函数的返回值。通常情况下，你想知道一个函数的返回值，如果能保证它确实返回了它所说的东西，那就更好了。让我们在计算器函数中添加一个返回值<i>number</i>。

```js
type Operation = 'multiply' | 'add' | 'divide';

const calculator = (a: number, b: number, op: Operation): number => { // highlight-line

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

<!-- The compiler complains straight away because, in one case, the function returns a string. There are couple of ways to fix this. We could extend the return type to allow string values, like so:-->
 编译器会直接产生警告，因为在一种情况下，该函数会返回一个字符串。有几种方法可以解决这个问题。我们可以扩展返回类型以允许字符串值，像这样。

```js
const calculator = (a: number, b: number, op: Operation): number | string =>  {
  // ...
}
```

<!-- Or we could create a return type which includes both possible types, much like our Operation type:-->
 或者我们可以创建一个返回类型，其中包括两种可能的类型，就像我们的操作类型。

```js
type Result = string | number;

const calculator = (a: number, b: number, op: Operation): Result =>  {
  // ...
}
```

<!-- But now  the question is if it's <i>really</i> okay for the function to return a string?-->
 但现在的问题是，这个函数是否真的可以返回一个字符串？

<!-- When your code can end up in a situation where something is divided by 0, something has probably gone terribly wrong and an error should be thrown and handled where the function was called.-->
 当你的代码最终会出现某样东西被0整除的情况时，可能是出了很大的问题，应该在调用函数的地方抛出一个错误并加以处理。
<!-- When you are deciding to return values you weren't originally expecting, the warnings you see from TypeScript prevent you from making rushed decisions and help you to keep your code working as expected.-->
当你决定返回你原本不期望的值时，你从TypeScript中看到的警告会阻止你做出仓促的决定，并帮助你保持你的代码按预期运行。


<!-- One more thing to consider is, that even though we have defined types for our parameters, the generated JavaScript used at runtime does not contain the type checks.-->
 还有一件事要考虑，即使我们已经为我们的参数定义了类型，在运行时使用的生成的JavaScript并不包含类型检查。
<!-- So if, for example, the <i>operation</i> parameter's value comes from an external interface, there is no definite guarantee that it will be one of the allowed values. Therefore, it's still better to include error handling and be prepared for the unexpected to happen.-->
 因此，比如说，如果<i>operation</i>参数的值来自于一个外部接口，就不能明确保证它是允许的值之一。因此，最好还是包括错误处理，并准备好应对意外情况的发生。
<!-- In this case, when there are multiple possible accepted values and all unexpected ones should result in an error, the [switch...case](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch) statement suits better than if...else in our code.-->
 在这种情况下，当有多个可能接受的值，并且所有意外的值都应该导致一个错误，[switch...case](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch)语句比我们代码中的if...else更适合。

<!-- The code of our calculator should actually look something like this:-->
 我们计算器的代码实际上应该是这样的。

```js
type Operation = 'multiply' | 'add' | 'divide';

type Result = number;  // highlight-line

const calculator = (a: number, b: number, op: Operation) : Result => {  // highlight-line
  switch(op) {
    case 'multiply':
      return a * b;
    case 'divide':
      if (b === 0) throw new Error('Can't divide by 0!');  // highlight-line
      return a / b;
    case 'add':
      return a + b;
    default:
      throw new Error('Operation is not multiply, add or divide!');  // highlight-line
  }
}

try {
  console.log(calculator(1, 5 , 'divide'));
} catch (error: unknown) {
  let errorMessage = 'Something went wrong.'
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}
```

<!-- As of TypeScript 4.0, <i>catch</i> blocks allow you to specify the type of catch clause variables. Pre-4.4, all <i>catch</i> clause variables were of type <i>any</i>. However, with the release of 4.4, the default type is <i>unknown</i>. The [unknown](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#new-unknown-top-type) is a kind of top type that was introduced in TypeScript version 3 to be the type-safe counterpart of <i>any</i>. Anything is assignable to <i>unknown</i>, but <i>unknown</i> isn’t assignable to anything but itself and <i>any</i> without a type assertion or a control flow-based narrowing. Likewise, no operations are permitted on an <i>unknown</i> without first asserting or narrowing to a more specific type.-->
 从TypeScript 4.0开始，<i>catch</i>块允许你指定捕获子句变量的类型。在4.4之前，所有的<i>catch</i>子句变量都是<i>any</i>类型。然而，随着4.4版本的发布，默认类型为<i>unknown</i>。[未知](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#new-unknown-top-type)是一种顶层类型，在TypeScript第3版中被引入，成为<i>any</i>的类型安全对应物。任何东西都可以赋值给<i>unknown</i>，但是<i>unknown</i>除了它自己和<i>any</i>之外，如果没有类型断言或基于控制流的缩小，则不能赋值给任何东西。同样地，如果不首先断言或缩小到一个更具体的类型，就不允许对<i>unknown</i>进行操作。

<!-- The programs we have written are alright, but it sure would be better if we could use command-line arguments instead of always having to change the code to calculate different things.-->
 我们写的程序还不错，但如果我们能使用命令行参数，而不是总是要改变代码来计算不同的东西，那肯定会更好。

<!-- Let's try it out, as we would in a regular Node application, by accessing <i>process.argv</i>. If you are using a recent npm-version (7.0 or later), there are no problems but with an older setup something is not right:-->
 让我们试试吧，就像在普通的Node应用中那样，通过访问<i>process.argv</i>。如果你使用的是最新的npm版本（7.0或更高版本），就不会有问题，但如果是旧的设置，就不太对劲了。

![](../../images/9/5.png)

<!-- So what is the problem in older setups?-->
 那么，在旧的设置中，问题出在哪里？

### @types/{npm_package}

<!-- Let's return to the basic idea of TypeScript. TypeScript expects all globally-used code to be typed, as it does for your own code when your project has a reasonable configuration. The TypeScript library itself contains only typings for the code of the TypeScript package. It is possible to write your own typings for a library, but that is almost never needed - since the TypeScript community has done it for us!-->
 让我们回到TypeScript的基本理念。TypeScript希望所有全局使用的代码都是类型化的，当你的项目有一个合理的配置时，它对你自己的代码也是如此。TypeScript库本身只包含TypeScript包的代码类型。你可以为一个库编写自己的类型，但这几乎是不需要的--因为TypeScript社区已经为我们做了这个工作

<!-- As with npm, the TypeScript world also celebrates open-source code. The community is active and continuously reacting to updates and changes in commonly-used npm packages. You can almost always find the typings for npm packages, so you don't have to create types for all of your thousands of dependencies alone.-->
与npm一样，TypeScript世界也在庆祝开源代码。社区很活跃，不断对常用的npm包的更新和变化做出反应。你几乎总能找到npm包的类型，所以你不必单独为你的成千上万的依赖创建类型。

<!-- Usually, types for existing packages can be found from the <i>@types</i> organization within npm, and you can add the relevant types to your project by installing an npm package with the name of your package with a @types/ prefix. For example: <i>npm install --save-dev @types/react @types/express @types/lodash @types/jest @types/mongoose</i> and so on and so on. The <i>@types/*</i> are maintained by [Definitely typed](http://definitelytyped.org/), a community project with the goal of maintaining types of everything in one place.-->
 通常，现有软件包的类型可以从npm内部的<i>@types</i>组织中找到，你可以通过安装一个带有@types/前缀的软件包名称的npm包将相关类型添加到你的项目中。比如说<i>npm install --save-dev @types/react @types/express @types/lodash @types/jest @types/mongoose</i>等等，等等。<i>@types/*</i>由[Definitely typed](http://definitelytyped.org/)维护，这是一个社区项目，目的是在一个地方维护所有的类型。

<!-- Sometimes, an npm package can also include its types within the code and, in that case, installing the corresponding <i>@types/*</i> is not necessary.-->
 有时，一个npm包也可以在代码中包含它的类型，在这种情况下，安装相应的<i>@types/*</i>就没有必要。

<!-- > **NB:** Since the typings are only used before compilation, the typings are not needed in the production build and they should <i>always</i> be in the devDependencies of the package.json.-->
 > **NB:** 由于类型只在编译前使用，所以在生产构建中不需要类型，它们应该<i>总是</i>在package.json的devDependencies中。

<!-- Since the global variable <i>process</i> is defined by Node itself, we get its typings by from the package <i>@types/node</i>.-->
 由于全局变量<i>process</i>是由Node本身定义的，我们从包<i>@types/node</i>中获得其类型。

<!-- Since version 10.0 <i>ts-node</i> has defined <i>@types/node</i> as a [peer dependency](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#peerdependencies). If the version of npm is at least 7.0, the peer dependencies of a project automatically installed by then npm. If you have an older npm, the peer dependency must be installed explicitly:-->
 从10.0版本开始，<i>ts-node</i>已经将<i>@types/node</i>定义为一个[对等依赖](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#peerdependencies)。如果npm的版本至少是7.0，那么一个项目的对等依赖就会自动被npm安装。如果你有一个更老的npm，同行依赖必须明确安装。


```shell
npm install --save-dev @types/node
```

<!-- When the package @types/node is installed, the compiler does not complain about the variable <i>process</i>. Note that there is no need to require the types to the code, the installation of the package is enough!-->
 当包@types/node被安装时，编译器不会产生警告变量<i>process</i>。请注意，不需要在代码中要求类型，安装包就足够了!

### Improving the project

<!-- Next, let's add npm scripts to run our two programs <i>multiplier</i> and <i>calculator</i>:-->
 接下来，让我们添加npm脚本来运行我们的两个程序<i>multiplier</i>和<i>calculator</i>。

```json
{
  "name": "fs-open",
  "version": "1.0.0",
  "description": "",
  "main": "index.ts",
  "scripts": {
    "ts-node": "ts-node",
    "multiply": "ts-node multiplier.ts", // highlight-line
    "calculate": "ts-node calculator.ts" // highlight-line
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "ts-node": "^10.5.0",
    "typescript": "^4.5.5"
  }
}
```

<!-- We can get the multiplier to work with command-line parameters with the following changes:-->
 我们可以通过以下改动让乘法器使用命令行参数工作。

```js
const multiplicator = (a: number, b: number, printText: string) => {
  console.log(printText,  a * b);
}

const a: number = Number(process.argv[2])
const b: number = Number(process.argv[3])
multiplicator(a, b, `Multiplied ${a} and ${b}, the result is:`);
```

<!-- And we can run it with:-->
 而且我们可以用以下方式运行它。

```shell
npm run multiply 5 2
```

<!-- If the program is run with parameters that are not of the right type, e.g.-->
 如果程序运行时的参数类型不对，比如说

```shell
npm run multiply 5 lol
```

<!-- it "works" but gives us the answer:-->
它 "工作 "了，但给我们的答案是。

```shell
Multiplied 5 and NaN, the result is: NaN
```

<!-- The reason for this is, that <i>Number('lol')</i> returns <i>NaN</i>,-->
 其原因是，<i>Number("lol")</i>返回<i>NaN</i>。
<!-- which is actually type <i>number</i>, so TypeScript has no power to rescue  us from this kind of situation.-->
 这实际上是<i>number</i>类型，所以TypeScript没有能力将我们从这种情况下拯救出来。

<!-- In order to prevent this kind of behaviour, we have to validate the data given to us from the command line.-->
为了防止这种行为，我们必须验证从命令行给我们的数据。

<!-- The improved version of the multiplicator looks like this:-->
乘法器的改进版如下所示：

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
      value1: Number(args[2]),
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
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.'
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}
```

<!-- When we now run the program:-->
 当我们现在运行这个程序时。

```shell
npm run multiply 1 lol
```

<!-- we get a proper error message:-->
我们会得到一个合适的错误信息。

```shell
Something bad happened. Error: Provided values were not numbers!
```

<!-- The definition of the function <i>parseArguments</i> has a couple of interesting things:-->
 函数<i>parseArguments</i>的定义有几个有趣的地方。

```js
const parseArguments = (args: Array<string>): MultiplyValues => {
  // ...
}
```

<!-- Firstly,  the parameter <i>args</i> is an [array](http://www.typescriptlang.org/docs/handbook/basic-types.html#array) of strings. The return value has the type <i>MultiplyValues</i>, which is defined as follows:-->
 首先，参数<i>args</i>是一个字符串的[数组](http://www.typescriptlang.org/docs/handbook/basic-types.html#array)。返回值的类型是<i>MultiplyValues</i>，其定义如下。

```js
interface MultiplyValues {
  value1: number;
  value2: number;
}
```

<!-- The definition utilizes TypeScript's [Interface](http://www.typescriptlang.org/docs/handbook/interfaces.html) keyword, which is one way to define the "shape" an object should have.-->
 这个定义利用了TypeScript的[Interface](http://www.typescriptlang.org/docs/handbook/interfaces.html)关键字，这是定义一个对象应该具有的 "形状 "的一种方式。
<!-- In our case it is quite obvious that the return value should be an object with the two properties <i>value1</i> and <i>value2</i>, which should both be of type number.-->
 在我们的例子中，很明显，返回值应该是一个具有两个属性<i>value1</i>和<i>value2</i>的对象，它们都应该是数字类型。

</div>

<div class="tasks">

### Exercises 9.1.-9.3.

#### setup

<!-- Exercises 9.1.-9.7. will all be made in the same node project. Create the project in an empty directory with <i>npm init</i> and install the ts-node and typescript packages. Create also the file <i>tsconfig.json</i> in the directory with the following content:-->
 练习9.1.-9.7.都将在同一个节点项目中进行。用<i>npm init</i>在一个空目录下创建项目，并安装ts-node和typescript包。同时在该目录下创建文件<i>tsconfig.json</i>，内容如下。

```json
{
  "compilerOptions": {
    "noImplicitAny": true,
  }
}
```

<!-- The compiler option [noImplicitAny](https://www.typescriptlang.org/tsconfig#noImplicitAny), that makes it mandatory to have types for all variables used, is actually currently a default, but let us still define it explicitly.-->
 编译器选项[noImplicitAny](https://www.typescriptlang.org/tsconfig#noImplicitAny)，使所有使用的变量都必须有类型，实际上目前是默认的，但我们还是要明确定义它。

#### 9.1 Body mass index

<!-- Create the code of this exercise in file <i>bmiCalculator.ts</i>.-->
 在文件<i>bmiCalculator.ts</i>中创建本练习的代码。

<!-- Write a function <i>calculateBmi</i> that calculates a [BMI](https://en.wikipedia.org/wiki/Body_mass_index) based on a given height (in centimeters) and weight (in kilograms) and then returns a message that suits the results.-->
 编写一个函数<i>calculateBmi</i>，根据给定的身高（厘米）和体重（公斤）计算[BMI](https://en.wikipedia.org/wiki/Body_mass_index)，然后返回一个适合该结果的信息。

<!-- Call the function in the same file with hard-coded parameters and print out the result. The code-->
在同一文件中用硬编码的参数调用该函数，并打印出结果。该代码

```js
console.log(calculateBmi(180, 74))
```

<!-- should print the following message:-->
应该打印出以下信息。

```shell
Normal (healthy weight)
```

<!-- Create a npm script for running the program with command <i>npm run calculateBmi</i>.-->
 创建一个npm脚本，用命令<i>npm run calculateBmi</i>来运行程序。

#### 9.2 Exercise calculator

<!-- Create the code of this exercise in file <i>exerciseCalculator.ts</i>.-->
 在文件<i>exerciseCalculator.ts</i>中创建这个练习的代码。

<!-- Write a function <i>calculateExercises</i> that calculates the average time of <i>daily exercise hours</i> and compares it to the <i>target amount</i> of daily hours and returns an object that includes the following values:-->
 编写一个函数<i>calculateExercises</i>，计算<i>每日运动时间的平均时间</i>，并将其与每日运动时间的<i>目标量</i>进行比较，并返回一个包括以下数值的对象。

<!--   - the number of days-->
 - 天数
<!--   - the number of training days-->
 - 训练日的数量
<!--   - the original target value-->
 - 原始目标值
<!--   - the calculated average time-->
 - 计算出的平均时间
<!--   - boolean value describing if the target was reached-->
 - 描述是否达到目标的布尔值
<!--   - a rating between the numbers 1-3 that tells how well the hours are met. You can decide on the metric on your own.-->
 - 数字1-3之间的评分，说明时间达到的程度。你可以自己决定这个指标。
<!--   - a text value explaining the rating-->
 - 一个解释评级的文本值

<!-- The daily exercise hours are given to the function as an [array](https://www.typescriptlang.org/docs/handbook/basic-types.html#array) that contains the number of exercise hours for each day in the training period. Eg. a week with 3 hours of training on Monday, none on Tuesday, 2 hours on Wednesday, 4.5 hours on Thursday and so on would be represented by the following array:-->
 每天的运动时间是以一个[数组](https://www.typescriptlang.org/docs/handbook/basic-types.html#array)的形式提供给函数的，其中包含训练期间每天的运动时间。例如，一个星期中，星期一有3小时的训练，星期二没有，星期三有2小时，星期四有4.5小时，以此类推，将用以下数组表示。

```js
[3, 0, 2, 4.5, 0, 3, 1]
```

<!-- For the Result object, you should create an [interface](https://www.typescriptlang.org/docs/handbook/interfaces.html).-->
 对于结果对象，你应该创建一个[接口](https://www.typescriptlang.org/docs/handbook/interfaces.html)。

<!-- If you call the function with parameters <i>[3, 0, 2, 4.5, 0, 3, 1]</i> and <i>2</i>, it should return:-->
 如果你用参数<i>[3, 0, 2, 4.5, 0, 3, 1]</i>和<i>2</i>调用该函数，它应该返回。

```js
{ periodLength: 7,
  trainingDays: 5,
  success: false,
  rating: 2,
  ratingDescription: 'not too bad but could be better',
  target: 2,
  average: 1.9285714285714286 }
```

<!-- Create a npm script, <i>npm run calculateExercises</i>, to call the function with hard-coded values.-->
 创建一个npm脚本，<i>npm run calculateExercises</i>，用硬编码的值来调用这个函数。

#### 9.3 Command line

<!-- Change the previous exercises so that you can give the parameters of <i>bmiCalculator</i> and <i>exerciseCalculator</i> as command-line arguments.-->
 修改前面的练习，以便你可以把<i>bmiCalculator</i>和<i>exerciseCalculator</i>的参数作为命令行参数。

<!-- Your program could work eg. as follows:-->
 你的程序可以工作，例如，如下所示。

```shell
$ npm run calculateBmi 180 91

Overweight
```

<!-- and:-->
 和。

```shell
$ npm run calculateExercises 2 1 0 2 4.5 0 3 1 0 4

{ periodLength: 9,
  trainingDays: 6,
  success: false,
  rating: 2,
  ratingDescription: 'not too bad but could be better',
  target: 2,
  average: 1.7222222222222223 }
```

<!-- In the example, the <i>first argument</i> is the target value.-->
 在这个例子中，<i>第一个参数</i>是目标值。

<!-- Handle exceptions and errors appropriately. The exerciseCalculator should accept inputs of varied lengths. Determine by yourself how you manage to collect all needed input.-->
 适当地处理异常和错误。exerciseCalculator应该接受不同长度的输入。自己决定你如何设法收集所有需要的输入。

</div>

<div class="content">

### More about tsconfig

<!-- We have so far used only one tsconfig rule [noImplicitAny](https://www.typescriptlang.org/tsconfig#noImplicitAny). It's a good place to start, but now it's time to look into the config file a little deeper.-->
 到目前为止，我们只使用了一条tsconfig规则[noImplicitAny](https://www.typescriptlang.org/tsconfig#noImplicitAny)。这是一个很好的开始，但现在是时候深入研究一下配置文件了。

<!-- As mentioned, the [tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) file contains all your core configurations on how you want TypeScript to work in your project.-->
 如前所述，[tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)文件包含了你希望TypeScript在你的项目中如何工作的所有核心配置。

<!-- Let's specify the following configurations in our <i>tsconfig.json</i> file:-->
 让我们在我们的<i>tsconfig.json</i>文件中指定以下配置。

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "moduleResolution": "node"
  }
}
```

<!-- Do not worry too much about the <i>compilerOptions</i>; they will be under closer inspection later on.-->
 不要太担心<i>compilerOptions</i>；它们将在以后被仔细检查。

<!-- You can find explanations for each of the configurations from the TypeScript documentation, or from the really handy [tsconfig page](https://www.staging-typescript.org/tsconfig), or from the tsconfig [schema definition](http://json.schemastore.org/tsconfig), which unfortunately is formatted a little worse than the first two options.-->
 你可以从TypeScript文档中找到每个配置的解释，或者从非常方便的[tsconfig页面](https://www.staging-typescript.org/tsconfig)，或者从tsconfig[模式定义](http://json.schemastore.org/tsconfig)，不幸的是它的格式比前两个选项要差一点。

### Adding Express to the mix

<!-- Right now, we are in a pretty good place. Our project is set up and we have two executable calculators in it.-->
 现在，我们处于一个相当好的位置。我们的项目已经设置好了，而且我们有两个可执行的计算器在里面。
<!-- However, since our aim is to learn FullStack development, it is time to start working with some HTTP requests.-->
然而，由于我们的目标是学习FullStack开发，现在是时候开始处理一些HTTP请求了。

<!-- Let us start by installing Express:-->
 让我们从安装Express开始。

```
npm install express
```

<!-- and then add the <i>start</i> script to package.json:-->
然后在package.json中添加<i>start</i>脚本。

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

<!-- Now we can create the file <i>index.ts</i>, and write the HTTP GET <i>ping</i> endpoint to it:-->
 现在我们可以创建文件<i>index.ts</i>，并将HTTP GET <i>ping</i>端点写入其中。

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

<!-- Everything else seems to be working just fine but, as you'd expect, the <i>req</i> and  <i>res</i> parameters of <i>app.get</i> need typing. If you look carefully, VSCode is also complaining about something to about the importing of Express. You can see a short yellow line of dots under the <i>require</i>. Let's hover over the problem:-->
 其他一切似乎都工作得很好，但是，正如你所期望的，<i>app.get</i>的<i>req</i>和<i>res</i>参数需要输入。如果你仔细观察，VSCode也在产生警告关于导入Express的一些问题。你可以看到在<i>require</i>下面有一条黄色的短线点。让我们把目光停留在这个问题上。

![](../../images/9/6.png)

<!-- The complaint is that the <i>'require' call may be converted to an import</i>. Let us follow the advice and write the import as follows:-->
 投诉的内容是：<i>"require"的调用可能被转换为导入</i>。让我们听从建议，把导入写成下面的样子。

```js
import express from 'express';
```

<!-- **NB**: VSCode offers you a possibility to fix the issues automatically by clicking the <i>Quick Fix...</i> button. Keep your eyes open for these helpers/quick fixes; listening to your editor usually makes your code better and easier to read. The automatic fixes for issues can be a major time saver as well.-->

 **nb**:VSCode为你提供了一种可能性，通过点击<i>Quick Fix...</i>按钮自动修复这些问题。请留意这些助手/快速修复；听从你的编辑器通常会使你的代码更好，更容易阅读。对问题的自动修复也可以是一个主要的时间节省者。

<!-- Now we run into another problem, the compiler complains about the import statement.-->
 现在我们遇到了另一个问题，编译器产生警告导入语句的问题。
<!-- Once again, the editor is our best friend when trying to find out what the issue is:-->
 再一次，当试图找出问题所在时，编辑器是我们最好的朋友。

![](../../images/9/7.png)

<!-- We haven't installed types for <i>express</i>.-->
 我们还没有为<i>express</i>安装类型。
<!-- Let's do what the suggestion says and run:-->
让我们按建议做并运行。

```
npm install --save-dev @types/express
```

<!-- And no more errors! Let's take a look at what changed.-->
 再也没有错误了!让我们来看看有什么变化。

<!-- When we hover over the <i>require</i> statement, we can see the compiler interprets everything express-related to be of type <i>any</i>.-->
 当我们把目光停留在<i>require</i>语句上时，我们可以看到编译器把所有与表达有关的东西都解释为<i>any</i>类型。

![](../../images/9/8a.png)

<!-- Whereas when we use <i>import</i>, the editor knows the actual types:-->
 而当我们使用<i>import</i>时，编辑器知道实际类型。

![](../../images/9/9x.png)

<!-- Which import statement to use depends on the export method used in the imported package.-->
 使用哪种导入语句取决于导入包中使用的导出方法。

<!-- A good rule of thumb is to try importing a module using the <i>import</i> statement first. We will always use this method in the <i>frontend</i>.-->
 一个好的经验法则是先尝试用<i>import</i>语句导入一个模块。我们总是在<i>前端</i>中使用这种方法。
<!-- If  <i>import</i> does not work, try a combined method: <i>import ... = require('...')</i>.-->
 如果 <i>import</i> 不起作用，请尝试使用组合方法。<i>import ... = require(''...')</i>。

<!-- We strongly suggest you read more about TypeScript modules [here](https://www.typescriptlang.org/docs/handbook/modules.html).-->
 我们强烈建议你阅读更多关于TypeScript模块的信息[这里](https://www.typescriptlang.org/docs/handbook/modules.html)。

<!-- There is one more problem with the code:-->
 这段代码还有一个问题。

![](../../images/9/9b.png)

<!-- This is because we banned unused parameters in our <i>tsconfig.json</i>:-->
这是因为我们在<i>tsconfig.json</i>中禁止了未使用的参数。

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

<!-- This configuration might create problems if you have library-wide predefined functions which require declaring a variable even if it's not used at all, as is the case here.-->
 如果你有库中的预定义函数，需要声明一个变量，即使它根本没有被使用，这种配置可能会产生问题，这里就是这样。
<!-- Fortunately, this issue has already been solved on configuration level.-->
 幸运的是，这个问题已经在配置层面得到了解决。
<!-- Once again hovering over the issue gives us a solution. This time we can just click the quick fix button:-->
 再一次将鼠标悬停在这个问题上，我们得到了一个解决方案。这一次我们可以直接点击快速修复按钮。

![](../../images/9/14a.png)

<!-- If it is absolutely impossible to get rid of an unused variable, you can prefix it with an underscore to inform the compiler you have thought about it and there is nothing you can do.-->
 如果绝对不可能摆脱一个未使用的变量，你可以在它前面加上一个下划线，通知编译器你已经考虑过了，你也无能为力。

<!-- Let's rename the <i>req</i> variable to <i>_req</i>. Finally we are ready to start the application. It seems to work fine:-->
 我们把<i>req</i>变量重命名为<i>_req</i>。最后我们准备启动应用。它似乎工作得很好。

![](../../images/9/11a.png)

<!-- To simplify the development, we should enable <i>auto-reloading</i> to improve our workflow. In this course, you have already used <i>nodemon</i>, but ts-node has an alternative called <i>ts-node-dev</i>. It is meant to be used only with a development environment which takes care of recompilation on every change, so restarting the application won't be necessary.-->
 为了简化开发，我们应该启用<i>自动重载</i>来改善我们的工作流程。在本课程中，你已经使用了<i>nodemon</i>，但是ts-node有一个替代品，叫做<i>ts-node-dev</i>。它只适用于开发环境，在每次修改时都会进行重新编译，所以重新启动应用是不必要的。

<!-- Let's install <i>ts-node-dev</i> to our development dependencies:-->
 让我们把<i>ts-note-dev</i>安装到我们的开发依赖项中。

```
npm install --save-dev ts-node-dev
```

<!-- Add a script to <i>package.json</i>:-->
 在<i>package.json</i>中添加一个脚本。

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

<!-- And now, by running <i>npm run dev</i>, we have a working, auto-reloading development environment for our project!-->
 现在，通过运行<i>npm run dev</i>，我们的项目有了一个可以工作的、自动重载的开发环境!

</div>

<div class="tasks">

### Exercises 9.4.-9.5.

#### 9.4 Express

<!-- Add Express to your dependencies and create an HTTP GET endpoint <i>hello</i> that answers 'Hello Full Stack!'-->
 将Express添加到你的依赖项中，并创建一个HTTP GET端点 <i>hello</i>，回答''Hello Full Stack!

<!-- The web app should be started with commands <i>npm start</i> in production mode and <i>npm run dev</i> in development mode. The latter should also use <i>ts-node-dev</i> to run the app.-->
 网络应用应该在生产模式下用<i>npm start</i>命令启动，在开发模式下用<i>npm run dev</i>命令启动。后者也应该使用<i>ts-node-dev</i>来运行该应用。

<!-- Replace also your existing <i>tsconfig.json</i> file with the  following content:-->
 把你现有的<i>tsconfig.json</i>文件也替换成以下内容。

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

<!-- Make sure there aren't any errors!-->
 确保没有任何错误!

#### 9.5 WebBMI

<!-- Add an endpoint for the BMI calculator that can be used by doing an HTTP GET request to endpoint <i>bmi</i> and specifying the input with [query string parameters](https://en.wikipedia.org/wiki/Query_string). For example, to get the BMI of a person having height 180 and weight 72, the url is http://localhost:3002/bmi?height=180&weight=72.-->
 添加一个BMI计算器的端点，可以通过对端点<i>bmi</i>进行HTTP GET请求，并用[查询字符串参数](https://en.wikipedia.org/wiki/Query_string)指定输入。例如，要得到一个身高180，体重72的人的BMI，网址是http://localhost:3002/bmi?height=180&weight=72。

<!-- The response is a json of the form:-->
 响应是一个json格式的文件。

```js
{
  weight: 72,
  height: 180,
  bmi: "Normal (healthy weight)"
}
```

<!-- See the [Express documentation](http://expressjs.com/en/5x/api.html#req.query) for info on how to access the query parameters.-->
 关于如何访问查询参数的信息，请参见[Express文档](http://expressjs.com/en/5x/api.html#req.query)。

<!-- If the query parameters of the request are of the wrong type or missing, a response with proper status code and error message is given:-->
 如果请求的查询参数类型错误或丢失，将给出一个带有适当状态代码和错误信息的响应。

```js
{
  error: "malformatted parameters"
}
```

<!-- Do not copy the calculator code to file <i>index.ts</i>; instead, make it a [TypeScript module](https://www.typescriptlang.org/docs/handbook/modules.html) that can be imported in <i>index.ts</i>.-->
 不要把计算器代码复制到文件<i>index.ts</i>；相反，把它变成一个[TypeScript模块](https://www.typescriptlang.org/docs/handbook/modules.html)，可以在<i>index.ts</i>中导入。

</div>

<div class="content">

### The horrors of <i>any</i>

<!-- Now that we have our first endpoints completed, you might notice we have used barely any TypeScript in these small examples. When examining the code a bit closer, we can see a few dangers lurking there.-->
 现在我们已经完成了第一个端点，你可能注意到我们在这些小例子中几乎没有使用任何TypeScript。当仔细检查代码时，我们可以看到有一些危险潜伏在那里。

<!-- Let's add the HTTP POST endpoint <i>calculate</i> to our app:-->
 让我们把HTTP POST端点<i>calculate</i>添加到我们的应用。

```js
import { calculator } from './calculator';

// ...

app.post('/calculate', (req, res) => {
  const { value1, value2, op } = req.body;

  const result = calculator(value1, value2, op);
  res.send(result);
});

```

<!-- When you hover over the <i>calculate</i> function, you can see the typing of the <i>calculator</i> even though the code itself does not contain any typings:-->
当你把鼠标悬停在<i>calculate</i>函数上时，你可以看到<i>calculator</i>的打字，尽管代码本身并不包含任何打字。

![](../../images/9/12a21.png)

<!-- But if you hover over the values parsed from the request, an issue arises:-->
 但是如果你把鼠标悬停在从请求中解析出来的值上，就会出现一个问题。

![](../../images/9/13a21.png)

<!-- All of the variables have type <i>any</i>. It is not all that surprising, as no one has given them a type yet. There are a couple of ways to fix this, but first, we have to consider why this is accepted and where the type <i>any</i> came from.-->
所有的变量都有<i>any</i>类型。这并不令人惊讶，因为还没有人给他们一个类型。有几种方法可以解决这个问题，但首先，我们必须考虑为什么会接受这个问题，以及类型<i>any</i>是怎么来的。

<!-- In TypeScript, every untyped variable whose type cannot be inferred implicitly becomes type [any](http://www.typescriptlang.org/docs/handbook/basic-types.html#any). Any is a kind of "wild card" type which literally stands for <i>whatever</i> type.-->
 在TypeScript中，每一个没有类型的变量，其类型不能被隐式推断出来，就变成了类型[any](http://www.typescriptlang.org/docs/handbook/basic-types.html#any)。Any是一种 "通配符 "类型，字面意思是代表<i>whatever</i>类型。
<!-- Things become implicitly any type quite often when one forgets to type functions.-->
当人们忘记对函数进行类型化时，事情就会经常变成隐含的任何类型。

<!-- We can also explicitly type things <i>any</i>. The only difference between implicit and explicit any type is how the code looks; the compiler does not care about the difference.-->
我们也可以显式地给事物输入<i>any</i>。隐式和显式任意类型之间的唯一区别是代码的外观；编译器并不关心这种区别。

<!-- Programmers however see the code differently when <i>any</i> is explicitly enforced than when it is implicitly inferred.-->
 然而，当<i>any</i>被显式执行时，程序员看到的代码与隐式推断时不同。
<!-- Implicit <i>any</i> typings are usually considered problematic, since it is quite often due to the coder forgetting to assign types (or being too lazy to do it), and it also means that the full power of TypeScript is not properly exploited.-->
隐式的<i>any</i>类型通常被认为是有问题的，因为它经常是由于程序员忘记了分配类型（或者懒得分配），而且它也意味着TypeScript的全部功能没有被正确利用。

<!-- This is why the configuration rule [noImplicitAny](https://www.typescriptlang.org/v2/en/tsconfig#noImplicitAny) exists on compiler level, and it is highly recommended to keep it on at all times.-->
这就是为什么配置规则[noImplicitAny](https://www.typescriptlang.org/v2/en/tsconfig#noImplicitAny)存在于编译器级别，并且强烈建议在任何时候都保持它。
<!-- In the rare occasions when you truly cannot know what the type of a variable is, you should explicitly state that in the code:-->
在少数情况下，当你真的不知道一个变量的类型是什么时，你应该在代码中明确说明。

```js
const a : any = /* no clue what the type will be! */.
```

<!-- We already have <i>noImplicitAny</i> configured in our example, so why does the compiler not complain about the implicit <i>any</i> types?-->
 我们已经在我们的例子中配置了<i>noImplicitAny</i>，那么为什么编译器没有产生警告隐含的<i>any</i>类型？
<!-- The reason is that the <i>query</i> field of an express [Request](https://expressjs.com/en/5x/api.html#req) object is explicitly typed <i>any</i>. The same is true for the <i>request.body</i> field we use to post data to an app.-->
原因是express [Request](https://expressjs.com/en/5x/api.html#req)对象的<i>query</i>字段是明确的类型<i>any</i>。我们用来向应用发布数据的<i>request.body</i>字段也是如此。


<!-- What if we would like to prevent developers from using <i>any</i> type at all? Fortunately, we have other methods than <i>tsconfig.json</i> to enforce coding style. What we can do is  use <i>eslint</i> to manage-->
 如果我们想阻止开发者使用<i>any</i>类型呢？幸运的是，除了<i>tsconfig.json</i>，我们还有其他方法来强制执行编码风格。我们可以做的是使用<i>eslint</i>来管理
<!-- our code.-->
我们的代码。
<!-- Let's install eslint and its TypeScript extensions:-->
 让我们安装eslint和它的TypeScript扩展。

```shell
npm install --save-dev eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

<!-- We will configure eslint to [disallow explicit any]( https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-explicit-any.md). Write the following rules to <i>.eslintrc</i>:-->
 我们将把eslint配置为[disallow explicit any]( https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-explicit-any.md)。在<i>.eslintrc</i>中写入以下规则。

```json
{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 11,
    "sourceType": "module"
  },
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-explicit-any": 2 // highlight-line
  }
}
```

<!-- (Newer versions of eslint has this rule on by default, so you don't necessarily need to add it separately.)-->
 (新版本的eslint默认有这个规则，所以你不一定需要单独添加它。)

<!-- Let us also set up a <i>lint</i> npm script to inspect the files with <i>.ts</i> extension by modifying the <i>package.json</i> file:-->
 让我们也设置一个<i>lint</i> npm脚本，通过修改<i>package.json</i>文件来检查扩展名为<i>.ts</i>的文件。

```json
{
  // ...
  "scripts": {
      "start": "ts-node index.ts",
      "dev": "ts-node-dev index.ts",
      "lint": "eslint --ext .ts ." // highlight-line
      //  ...
  },
  // ...
}
```

<!-- Now lint will complain if we try to define a variable of type <i>any</i>:-->
 现在如果我们试图定义一个<i>any</i>类型的变量，lint会产生警告。

![](../../images/9/13b.png)


<!-- [@typescript-eslint](https://github.com/typescript-eslint/typescript-eslint) has a lot of TypeScript-specific eslint rules, but you can also use all basic eslint rules in TypeScript projects.-->
 [@typescript-eslint](https://github.com/typescript-eslint/typescript-eslint)有很多TypeScript专用的eslint规则，但你也可以在TypeScript项目中使用所有基本的eslint规则。
<!-- For now, we should probably go with the recommended settings, and we will modify the rules as we go along whenever we find something we want to change the behavior of.-->
 现在，我们也许应该使用推荐的设置，当我们发现我们想改变行为的时候，我们会在进行中修改规则。

<!-- On top of the recommended settings, we should try to get familiar with the coding style required in this part and <i>set the semicolon at the end of each line of code to required</i>.-->
 在推荐设置的基础上，我们应该尽量熟悉这部分所要求的编码风格，<i>将每行代码末尾的分号设置为必填项</i>。

<!-- So we will use the following <i>.eslintrc</i>-->
 所以我们将使用下面的<i>.eslintrc</i>。

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  "plugins": ["@typescript-eslint"],
  "env": {
    "node": true,
    "es6": true
  },
  "rules": {
    "@typescript-eslint/semi": ["error"],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
    "@typescript-eslint/restrict-plus-operands": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { "argsIgnorePattern": "^_" }
    ],
    "no-case-declarations": "off"
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json"
  }
}
```

<!-- There are quite a few semicolons missing, but those are easy to add. We also have to solve the ESlint issues concerning the _any_-type:-->
 少了不少分号，但这些很容易添加。我们还必须解决ESlint中关于_any_类型的问题。

![](../../images/9/50x.png)

<!-- We could and probably should disable some ESlint rules to get the data from the request body.-->
 我们可以而且应该禁用一些ESlint规则来从请求体中获取数据。

<!-- Disabling <i>@typescript-eslint/no-unsafe-assignment</i> for the destructuring assignment is nearly enough:-->
 禁用<i>@typescript-eslint/no-unsafe-assignment</i>的destructuring赋值就差不多了。

```js
app.post('/calculate', (req, res) => {
  // highlight-start
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  // highlight-end
  const { value1, value2, op } = req.body;

  const result = calculator(Number(value1), Number(value2), op);
  res.send(result);
});
```

<!-- However this still leaves one problem to deal with, the last parameter in the function call is not safe:-->
 然而这仍然有一个问题需要处理，函数调用中的最后一个参数是不安全的。

![](../../images/9/51x.png)

<!-- We can just disable another ESlint rule to get rid of that:-->
 我们可以禁用另一条ESlint规则来解决这个问题。

```js
app.post('/calculate', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { value1, value2, op } = req.body;

  // highlight-start
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  // highlight-end
  const result = calculator(Number(value1), Number(value2), op);
  res.send(result);
});
```

<!-- We now got ESlint silenced but we are totally on mercy of the user. We most definitively should do some validation to the post data and give a proper error message if the data is invalid:-->
 我们现在得到了ESlint的沉默，但我们完全受用户的摆布。我们肯定应该对帖子的数据进行一些验证，如果数据无效，就给出一个适当的错误信息。

```js
app.post('/calculate', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { value1, value2, op } = req.body;

// highlight-start
  if ( !value1 || isNaN(Number(value1))) {
    return res.send({ error: '...'}).status(400);
  }
  // highlight-end

  // more validations here...

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const result = calculator(Number(value1), Number(value2), op);
  return res.send(result);
});
```

</div>

<div class="tasks">

### Exercises 9.6.-9.7.

#### 9.6 Eslint

<!-- Configure your project to use the above eslint settings and fix all the warnings.-->
 配置你的项目以使用上述eslint设置并修复所有的警告。

#### 9.7 WebExercises

<!-- Add an endpoint to your app for the exercise calculator. It should be used by doing an HTTP POST request to endpoint <i>exercises</i> with the input in the request body:-->
 在你的应用中为练习计算器添加一个端点。它应该通过对端点<i>exercises</i>做HTTP POST请求，并在请求体中输入。

```js
{
  "daily_exercises": [1, 0, 2, 0, 3, 0, 2.5],
  "target": 2.5
}
```

<!-- The response is a json of the following form:-->
 响应是一个如下形式的json。

```js
{
    "periodLength": 7,
    "trainingDays": 4,
    "success": false,
    "rating": 1,
    "ratingDescription": "bad",
    "target": 2.5,
    "average": 1.2142857142857142
}
```

<!-- If the body of the request is not of the right form, a response with proper status code and error message is given. The error message is either-->
 如果请求体的形式不对，会给出一个带有适当状态码和错误信息的响应。该错误信息是

```js
{
  error: "parameters missing"
}
```

<!-- or-->
 或

```js
{
  error: "malformatted parameters"
}
```

<!-- depending on the error. The latter happens if the input values do not have the right type, i.e. they are not numbers or convertible to numbers.-->
取决于错误。如果输入值没有正确的类型，即它们不是数字或可转换为数字，则会发生后者。

<!-- In this exercise, you might find it beneficial to use the <i>explicit any</i> type when handling the data in the request body. Our eslint configuration is preventing this but you may unset this rule for a particular line by inserting the following comment as the previous line:-->
 在这个练习中，你可能会发现在处理请求体中的数据时使用<i>explicit any</i>类型是有好处的。我们的eslint配置阻止了这一点，但是你可以通过在前一行插入以下注释来为某一行取消这一规则。

```js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
```

<!-- You might also get in trouble with rules <i>no-unsafe-member-access</i> and <i>no-unsafe-assignment </i>. These rules may be ignored in this exercise.-->
 你也可能遇到规则<i>no-unsafe-member-access</i>和<i>no-unsafe-assignment</i>的麻烦。在这个练习中，这些规则可以被忽略。

<!-- Note that you need to have a correct setup in order to get hold of the request body; see [part 3](/en/part3/node_js_and_express#receiving-data).-->
 注意，你需要有一个正确的设置，以便掌握请求体；见[第三章节](/en/part3/node_js_and_express#receiving-data)。

</div>
