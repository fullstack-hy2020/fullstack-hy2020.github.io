---
mainImage: ../../../images/part-9.svg
part: 9
letter: b
lang: zh
---

<div class="content">

<!-- After the brief introduction to the main principles of TypeScript, we are now ready to start our journey toward becoming FullStack TypeScript developers.-->
经过对TypeScript主要原则的简要介绍，我们现在准备开始我们成为FullStack TypeScript开发人员的旅程。
<!-- Rather than giving you a thorough introduction to all aspects of TypeScript, we will focus in this part on the most common issues that arise when developing Express backends or React frontends with TypeScript.-->
而不是给你一个关于TypeScript所有方面的详细介绍，我们将在这一部分重点介绍使用TypeScript开发Express后端或React前端时最常见的问题。
<!-- In addition to language features, we will also have a strong emphasis on tooling.-->
此外，我们还将强调工具。

### Setting things up

<!-- Install TypeScript support to your editor of choice. [Visual Studio Code](https://code.visualstudio.com/) works natively with TypeScript.-->
安装TypeScript支持到您选择的编辑器。[Visual Studio Code](https://code.visualstudio.com/) 与TypeScript本机兼容。

<!-- As mentioned earlier, TypeScript code is not executable by itself. It has to be first compiled into executable JavaScript.-->
正如前面提到的，TypeScript 代码本身不可执行。它必须先编译成可执行的 JavaScript。
<!-- When TypeScript is compiled into JavaScript, the code becomes subject to type erasure. This means that type annotations, interfaces, type aliases, and other type system constructs are removed and the result is pure ready-to-run JavaScript.-->
当TypeScript编译成JavaScript时，代码就会受到类型擦除的影响。这意味着类型注释、接口、类型别名和其他类型系统结构都会被移除，最终结果就是纯粹的可以直接运行的JavaScript。

<!-- In a production environment, the need for compilation often means that you have to set up a "build step." During the build step, all TypeScript code is compiled into JavaScript in a separate folder, and the production environment then runs the code from that folder. In a development environment, it is often handier to make use of real-time compilation and auto-reloading so one can see the resulting changes more quickly.-->
在生产环境中，编译的需求通常意味着你必须设置一个“构建步骤”。在构建步骤期间，所有TypeScript代码都会被编译成单独文件夹中的JavaScript，然后生产环境会从那个文件夹运行代码。在开发环境中，通常更方便地使用实时编译和自动重新加载，以便可以更快地看到结果变化。

<!-- Let's start writing our first TypeScript app. To keep things simple, let's start by using the npm package [ts-node](https://github.com/TypeStrong/ts-node). It compiles and executes the specified TypeScript file immediately so that there is no need for a separate compilation step.-->
让我们开始编写我们的第一个TypeScript应用程序。为了保持简单，让我们从使用npm包[ts-node](https://github.com/TypeStrong/ts-node)开始。它立即编译并执行指定的TypeScript文件，因此无需单独的编译步骤。

<!-- You can install both <i>ts-node</i> and the official <i>typescript</i> package globally by running:-->
你可以通过运行以下命令来全局安装 <i>ts-node</i> 和官方的 <i>typescript</i> 包：

```bash
npm install -g ts-node typescript
```

<!-- If you can't or don't want to install global packages, you can create an npm project which has the required dependencies and run your scripts in it.-->
如果你不能或者不想安装全局的包，你可以创建一个npm项目，里面包含所需的依赖，然后在里面运行你的脚本。
<!-- We will also take this approach.-->
我们也将采取这种方法。

<!-- As we recall from [part 3](/en/part3), an npm project is set by running the command *npm init* in an empty directory. Then we can install the dependencies by running-->
the command *npm install <package-name>*.

正如我们从[第三章节](/en/part3)回忆起，在一个空目录中运行命令*npm init*可以设置一个npm项目。然后我们可以通过运行命令*npm install <package-name>*来安装依赖项。

```bash
npm install --save-dev ts-node typescript
```

<!-- and setting up <i>scripts</i> within the package.json:-->
编辑 package.json 文件并在其中设置 <i>脚本</i>：

```json
{
  // ..
  "scripts": {
    "ts-node": "ts-node" // highlight-line
  },
  // ..
}
```

<!-- You can now use <i>ts-node</i> within this directory by running *npm run ts-node*. Note that if you are using ts-node through package.json, command-line arguments that include short or long form options for the *npm run script* need to be prefixed with *--*. So if you want to run file.ts with <i>ts-node</i> and options *-s* and *--someoption*, the whole command is:-->
你现在可以在这个目录中使用<i>ts-node</i>，只需运行*npm run ts-node*。注意，如果你通过package.json使用ts-node，那么命令行参数中包含*npm run script*的短格式或长格式选项时，需要加上前缀*--*。因此，如果你想使用<i>ts-node</i>运行file.ts，并使用选项*-s*和*--someoption*，那么整个命令是：

```shell
npm run ts-node file.ts -- -s --someoption
```

<!-- It is worth mentioning that TypeScript also provides an online playground, where you can quickly try out TypeScript code and instantly see the resulting JavaScript and possible compilation errors. You can access TypeScript's official playground [here](https://www.typescriptlang.org/play/index.html).-->
值得一提的是，TypeScript还提供了一个在线游乐场，您可以快速尝试TypeScript代码，并立即看到生成的JavaScript以及可能的编译错误。您可以访问TypeScript的官方游乐场[这里](https://www.typescriptlang.org/play/index.html)。

<!-- **NB:** The playground might contain different tsconfig rules (which will be introduced later) than your local environment, which is why you might see different warnings there compared to your local environment. The playground's tsconfig is modifiable through the config dropdown menu.-->
**翻译：** 注意：操作台可能包含不同于您本地环境的tsconfig规则（稍后将介绍），因此您可能会在那里看到与您本地环境不同的警告。操作台的tsconfig可以通过配置下拉菜单进行修改。

#### A note about the coding style

<!-- JavaScript is a quite relaxed language in itself, and things can often be done in multiple different ways. For example, we have named vs anonymous functions, using const and let or var, and the use of <i>semicolons</i>. This part of the course differs from the rest by using semicolons. It is not a TypeScript-specific pattern but a general coding style decision taken when creating any kind of JavaScript project. Whether to use them or not is usually in the hands of the programmer, but since it is expected to adapt one's coding habits to the existing codebase, you are expected to use semicolons and adjust to the coding style in the exercises for this part. This part has some other coding style differences compared to the rest of the course as well, e.g. in the directory naming conventions.-->
JavaScript 本身是一种相当宽松的语言，事情往往可以用多种不同的方式来完成。例如，我们有命名和匿名函数，使用 `const` 和 `let` 或 `var`，以及 <i>分号</i> 的使用。这部分课程与其他部分不同之处在于使用分号。这不是 TypeScript 特定的模式，而是在创建任何类型的 JavaScript 项目时采取的一般编码风格决定。是否使用它们通常掌握在程序员手中，但由于预期将编码习惯适应现有的代码库，因此您应该使用分号并适应此部分练习中的编码风格。与课程其余部分相比，此部分还有一些其他的编码风格差异，例如目录命名约定。

<!-- Let us add a configuration file *tsconfig.json* to the project with the following content:-->
让我们把以下内容的配置文件*tsconfig.json*添加到该项目中：

```js
{
  "compilerOptions":{
    "noImplicitAny": false
  }
}
```

<!-- The <i>tsconfig.json</i> file is used to define how the TypeScript compiler should interpret the code, how strictly the compiler should work, which files to watch or ignore, and [much more](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).-->
`<i>tsconfig.json</i>`文件用于定义TypeScript编译器如何解释代码、编译器的严格程度、哪些文件需要监视或忽略等[更多内容](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)。
<!-- For now, we will only use the compiler option [noImplicitAny](https://www.typescriptlang.org/tsconfig#noImplicitAny), which does not require having types for all variables used.-->
现在，我们只会使用编译器选项[noImplicitAny](https://www.typescriptlang.org/tsconfig#noImplicitAny)，它不需要对所使用的所有变量都有类型。

<!-- Let's start by creating a simple Multiplier. It looks exactly as it would in JavaScript.-->
让我们从创建一个简单的乘法器开始。它看起来和JavaScript中的一样。

```js
const multiplicator = (a, b, printText) => {
  console.log(printText,  a * b);
}

multiplicator(2, 4, 'Multiplied numbers 2 and 4, the result is:');
```

<!-- As you can see, this is still ordinary basic JavaScript with no additional TS features. It compiles and runs nicely with *npm run ts-node -- multiplier.ts*, as it would with Node.-->
可以看到，这仍然是普通的基本JavaScript，没有额外的TS功能。它可以使用*npm run ts-node -- multiplier.ts*编译和运行，就像使用Node一样。

<!-- But what happens if we end up passing the wrong <i>types</i> of arguments to the multiplicator function?-->
但是如果我们最终传递给乘法函数错误的<i>类型</i>的参数又会发生什么呢？

<!-- Let's try it out!-->
让我们来试试看！

```js
const multiplicator = (a, b, printText) => {
  console.log(printText,  a * b);
}

multiplicator('how about a string?', 4, 'Multiplied a string and 4, the result is:');

```

<!-- Now when we run the code, the output is: *Multiplied a string and 4, the result is: NaN*.-->
现在当我们运行代码时，输出是：*将字符串与4相乘，结果是：NaN*。

<!-- Wouldn''t it be nice if the language itself could prevent us from ending up in situations like this?-->
假如语言本身能够防止我们陷入这种情况，那该多好啊？
<!-- This is where we see the first benefits of TypeScript.  Let's add types to the parameters and see where it takes us.-->
这就是我们看到TypeScript的第一个好处的地方。让我们给参数添加类型，看看会发生什么。

<!-- TypeScript natively supports multiple types including *number*, *string* and *Array*. See the comprehensive list [here](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html). More complex custom types can also be created.-->
TypeScript 原生支持多种类型，包括 *number*、*string* 和 *Array*。可以参考[这里](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)的全面列表。也可以创建更复杂的自定义类型。

<!-- The first two parameters of our function are the number and the string [primitives](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#the-primitives-string-number-and-boolean), respectively:-->
我们函数的前两个参数分别是[原始型别](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#the-primitives-string-number-and-boolean)的数字和字串：

```js
const multiplicator = (a: number, b: number, printText: string) => {
  console.log(printText,  a * b);
}

multiplicator('how about a string?', 4, 'Multiplied a string and 4, the result is:');
```

<!-- Now the code is no longer valid JavaScript but in fact TypeScript. When we try to run the code, we notice that it does not compile:-->
现在这段代码不再是有效的JavaScript，而是TypeScript。当我们尝试运行代码时，我们注意到它没有编译：

![terminal output showing error assigning string to number](../../images/9/2a.png)

<!-- One of the best things about TypeScript's editor support is that you don't necessarily need to even run the code to see the issues.-->
TypeScript 的编辑器支持最棒的一点是，你甚至不需要运行代码就可以看到问题。
<!-- The VSCode plugin is so efficient, that it informs you immediately when you are trying to use an incorrect type:-->
VSCode 插件非常有效，当你试图使用错误类型时，它会立即通知你：

![vscode showing same error about string as number](../../images/9/2.png)

### Creating your first own types

<!-- Let's expand our multiplicator into a slightly more versatile calculator that also supports addition and division. The calculator should accept three arguments: two numbers and the operation, either *multiply*, *add* or *divide*, which tells it what to do with the numbers.-->
让我们将我们的乘法器扩展成一个略微更具多功能的计算器，它还支持加法和除法。计算器应该接受三个参数：两个数字和操作，要么是*乘法*，要么是*加法*或*除法*，它告诉它要对数字做什么。

<!-- In JavaScript, the code would require additional validation to make sure the last argument is indeed a string. TypeScript offers a way to define specific types for inputs, which describe exactly what type of input is acceptable. On top of that, TypeScript can also show the info on the accepted values already at the editor level.-->
在JavaScript中，代码需要额外的验证来确保最后一个参数确实是一个字符串。TypeScript提供了一种定义特定类型的输入的方法，可以描述准确的输入类型是可接受的。此外，TypeScript还可以在编辑器级别显示可接受值的信息。

<!-- We can create a *type* using the TypeScript native keyword *type*. Let's describe our type *Operation*:-->
我们可以使用TypeScript原生关键字*type*创建一个*type*。让我们描述我们的类型*Operation*：

```js
type Operation = 'multiply' | 'add' | 'divide';
```

<!-- Now the *Operation* type accepts only three kinds of values; exactly the three strings we wanted.-->
现在*操作*类型只接受三种值；恰好是我们想要的三个字符串。
<!-- Using the OR operator *|* we can define a variable to accept multiple values by creating a [union type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types).-->
使用OR运算符 *|*，我们可以通过创建[联合类型](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)来定义一个可以接受多个值的变量。
<!-- In this case, we used exact strings (that, in technical terms, are called [string literal types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types)) but with unions, you could also make the compiler accept for example both string and number: *string | number*.-->
在这种情况下，我们使用了精确的字符串（技术术语中称为[字符串文字类型](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types)），但是使用联合，您还可以让编译器接受字符串和数字：*string | number*。

<!-- The *type* keyword defines a new name for a type: [a type alias](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases). Since the defined type is a union of three possible values, it is handy to give it an alias that has a representative name.-->
`type` 关键字定义了一个新的类型名称：[类型别名](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases)。由于定义的类型是三个可能值的联合，因此给它起一个有代表性的别名是很方便的。

<!-- Let's look at our calculator now:-->
让我们看看我们的计算器吧：

```js
type Operation = 'multiply' | 'add' | 'divide';

const calculator = (a: number, b: number, op: Operation) => {
  if (op === 'multiply') {
    return a * b;
  } else if (op === 'add') {
    return a + b;
  } else if (op === 'divide') {
    if (b === 0) return 'can't divide by 0!'';
    return a / b;
  }
}
```

<!-- Now, when we hover on top of the *Operation* type in the calculator function, we can immediately see suggestions on what to do with it:-->
现在，当我们在计算器功能中的*操作*类型上悬停时，我们可以立即看到有关如何处理它的建议：

![vs code suggestion operation 3 types](../../images/9/3.png)

<!-- And if we try to use a value that is not within the *Operation* type, we get the familiar red warning signal and extra info from our editor:-->
如果我们试图使用一个不在*操作*类型中的值，我们就会得到熟悉的红色警告信号和编辑器中的额外信息：

![vscode warning when trying to have 'yolo' as Operation](../../images/9/4x.png)

<!-- This is already pretty nice, but one thing we haven't touched yet is typing the return value of a function. Usually, you want to know what a function returns, and it would be nice to have a guarantee that it returns what it says it does. Let's add a return value *number* to the calculator function:-->
这已经相当不错了，但我们还没有涉及到的一件事是输入函数的返回值。通常，您想知道函数返回什么，最好能有一个保证它会返回它所说的内容。让我们为计算器函数添加一个返回值*数字*：

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

<!-- The compiler complains straight away because, in one case, the function returns a string. There are a couple of ways to fix this. We could extend the return type to allow string values, like so:-->
编译器立即抱怨，因为在一种情况下，函数返回一个字符串。有几种方法可以解决这个问题。我们可以扩展返回类型以允许字符串值，如下所示：

```js
const calculator = (a: number, b: number, op: Operation): number | string =>  {
  // ...
}
```

<!-- Or we could create a return type, which includes both possible types, much like our Operation type:-->
或者我们可以创建一个返回类型，它包括两种可能的类型，就像我们的操作类型一样：

```js
type Result = string | number;

const calculator = (a: number, b: number, op: Operation): Result =>  {
  // ...
}
```

<!-- But now the question is if it's <i>really</i> okay for the function to return a string?-->
但是现在的问题是，这个函数真的可以返回一个字符串吗？

<!-- When your code can end up in a situation where something is divided by 0, something has probably gone terribly wrong and an error should be thrown and handled where the function was called.-->
当你的代码最终会陷入一个被0除的情况时，可能出现了一些严重的错误，应该抛出一个错误并在调用该函数的地方进行处理。
<!-- When you are deciding to return values you weren''t originally expecting, the warnings you see from TypeScript prevent you from making rushed decisions and help you to keep your code working as expected.-->
当你决定返回最初没有预期的值时，TypeScript给出的警告可以防止你做出仓促的决定，帮助你保持代码按预期正常工作。

<!-- One more thing to consider is, that even though we have defined types for our parameters, the generated JavaScript used at runtime does not contain the type checks.-->
最后要考虑的是，即使我们为参数定义了类型，在运行时生成的JavaScript也不包含类型检查。
<!-- So if, for example, the *Operation* parameter's value comes from an external interface, there is no definite guarantee that it will be one of the allowed values. Therefore, it's still better to include error handling and be prepared for the unexpected to happen.-->
所以如果比如*操作*参数的值来自一个外部接口，就不能确定它是否是允许的值之一。因此，最好还是包含错误处理，准备好意外情况发生。
<!-- In this case, when there are multiple possible accepted values and all unexpected ones should result in an error, the [switch...case](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch) statement suits better than if...else in our code.-->
在这种情况下，当有多个可接受的值，并且所有意外的值都应该导致错误时，[switch...case](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch) 语句比我们的代码中的 if...else 更适合。

<!-- The code of our calculator should look something like this:-->
代码应该像这样：
```
#include <stdio.h>

int main()
{
    int a, b;
    scanf("%d %d", &a, &b);
    printf("%d\n", a + b);
    return 0;
}
```

```
#include <stdio.h>

int main()
{
    int a, b;
    scanf("%d %d", &a, &b);
    printf("%d\n", a + b);
    return 0;
}
```

```js
type Operation = 'multiply' | 'add' | 'divide';

const calculator = (a: number, b: number, op: Operation) : number => {  // highlight-line
  switch(op) {
    case 'multiply':
      return a * b;
    case 'divide':
      if (b === 0) throw new Error('Can't divide by 0!'');  // highlight-line
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
  let errorMessage = 'Something went wrong: '
  if (error instanceof Error) {
    errorMessage += error.message;
  }
  console.log(errorMessage);
}
```

### Type narrowing

<!-- The default type of the catch block parameter *error* is *unknown*. The [unknown](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#new-unknown-top-type) is a kind of top type that was introduced in TypeScript version 3 to be the type-safe counterpart of *any*. Anything is assignable to *unknown*, but *unknown* isn’t assignable to anything but itself and *any* without a type assertion or a control flow-based narrowing. Likewise, no operations are permitted on an *unknown* without first asserting or narrowing it to a more specific type.-->
默认类型的catch块参数*error*是*unknown*。[unknown](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#new-unknown-top-type)是在TypeScript 3.0版本中引入的一种顶级类型，是*any*的安全类型对应物。任何东西都可以赋值给*unknown*，但*unknown*除了它自己和*any*外，不能被赋值，除非使用类型断言或基于控制流的缩小。同样，在先断言或缩小为更具体的类型之前，不允许对*unknown*执行任何操作。

<!-- Both the possible causes of exception (wrong operator or division by zero) will throw an [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) object with an error message, that our program prints to the user.-->
两种可能的异常原因（错误操作符或零除）都会抛出一个[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)对象，并带有错误消息，我们的程序将其打印给用户。

<!-- If our code would be JavaScript, we could print the error message by just referring to the field [message](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/message) of the object *error* as follows:-->
如果我们的代码是JavaScript，我们可以通过只引用对象*error*的[message](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/message)字段来打印错误消息，如下所示：

```js
try {
  console.log(calculator(1, 5 , 'divide'));
} catch (error) {
  console.log('Something went wrong: ' + error.message);  // highlight-line
}
```

<!-- Since the default type of the *error* object in TypeScript is *unknown*, we have to [narrow](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) the type to access the field:-->
由于TypeScript中的*error*对象的默认类型为*未知*，我们必须[缩小](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)类型以访问字段：

```ts
try {
  console.log(calculator(1, 5 , 'divide'));
} catch (error: unknown) {
  let errorMessage = 'Something went wrong: '
  // here we can not use error.message
  if (error instanceof Error) { // highlight-line
    // the type is narrowed and we can refer to error.message
    errorMessage += error.message;  // highlight-line
  }
  // here we can not use error.message

  console.log(errorMessage);
}
```

<!-- Here the narrowing was done with the [instanceof](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#instanceof-narrowing) type guard, that is just one of the many ways to narrow a type. We shall see many others later in this part.-->
这里的缩小是通过[instanceof](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#instanceof-narrowing)类型检查来完成的，这只是缩小类型的众多方法之一。我们将在本节的后面看到更多的方法。

### Accessing command line arguments

<!-- The programs we have written are alright, but it sure would be better if we could use command-line arguments instead of always having to change the code to calculate different things.-->
我们编写的程序还可以，但如果我们能够使用命令行参数来计算不同的东西，那就更好了。

<!-- Let's try it out, as we would in a regular Node application, by accessing *process.argv*. If you are using a recent npm-version (7.0 or later), there are no problems but with an older setup something is not right:-->
让我们像在正常的Node应用程序中一样尝试一下，通过访问*process.argv*。如果你使用的是最新版本的npm（7.0或更高版本），那么没有问题，但是如果是旧版本，就会出现问题：

![vs code error cannot find name process need to install type definitions](../../images/9/5.png)

<!-- So what is the problem with older setups?-->
那么，老式设置有什么问题呢？

### @types/{npm_package}

<!-- Let's return to the basic idea of TypeScript. TypeScript expects all globally-used code to be typed, as it does for your code when your project has a reasonable configuration. The TypeScript library itself contains only typings for the code of the TypeScript package. It is possible to write your own typings for a library, but that is rarely needed - since the TypeScript community has done it for us!-->
让我们回到 TypeScript 的基本概念。TypeScript 期望所有全局使用的代码都是类型化的，就像当你的项目有一个合理的配置时，你的代码一样。TypeScript 库本身只包含 TypeScript 包的代码的类型定义。可以编写自己的库类型定义，但这很少是必要的 - 因为 TypeScript 社区已经为我们做了这件事！

<!-- As with npm, the TypeScript world also celebrates open-source code. The community is active and continuously reacting to updates and changes in commonly-used npm packages. You can almost always find the typings for npm packages, so you don''t have to create types for all of your thousands of dependencies alone.-->
随着npm一样，TypeScript世界也庆祝开源代码。社区活跃，并且不断对常用npm包的更新和变化做出反应。几乎总是可以找到npm包的类型，所以你不必单独为你的数千个依赖项创建类型。

<!-- Usually, types for existing packages can be found from the <i>@types</i> organization within npm, and you can add the relevant types to your project by installing an npm package with the name of your package with a @types/ prefix. For example:-->
通常，可以从npm中的<i>@types</i>组织中找到现有软件包的类型，您可以通过以@types/前缀安装名称为您软件包的npm软件包来添加相关类型到您的项目中。例如：

```bash
npm install --save-dev @types/react @types/express @types/lodash @types/jest @types/mongoose
```

<!-- and so on and so on. The <i>@types/*</i> are maintained by [Definitely typed](https://github.com/DefinitelyTyped/DefinitelyTyped), a community project to maintain types of everything in one place.-->
以及等等。<i>@types/*</i> 由 [Definitely typed](https://github.com/DefinitelyTyped/DefinitelyTyped) 维护，这是一个社区项目，旨在将所有东西的类型统一维护在一个地方。

<!-- Sometimes, an npm package can also include its types within the code and, in that case, installing the corresponding <i>@types/*</i> is not necessary.-->
有时，npm 包也可以包含其代码中的类型，在这种情况下，不需要安装相应的<i>@types/*</i>。

<!-- > **NB:** Since the typings are only used before compilation, the typings are not needed in the production build and they should <i>always</i> be in the devDependencies of the package.json.-->
> **注意：** 由于类型检查只在编译之前使用，因此生产构建中不需要类型检查，并且它们<i>始终</i>应该在package.json的devDependencies中。

<!-- Since the global variable <i>process</i> is defined by Node itself, we get its typings from the package <i>@types/node</i>.-->
因为全局变量<i>process</i>是由Node本身定义的，我们可以从包<i>@types/node</i>中获取它的类型定义。

<!-- Since version 10.0 <i>ts-node</i> has defined <i>@types/node</i> as a [peer dependency](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#peerdependencies). If the version of npm is at least 7.0, the peer dependencies of a project are automatically installed by npm. If you have an older npm, the peer dependency must be installed explicitly:-->
自 10.0 版本以来，<i>ts-node</i> 将 <i>@types/node</i> 定义为一个 [同级依赖](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#peerdependencies)。如果 npm 版本至少为 7.0，项目的同级依赖会被 npm 自动安装。如果你使用的是较老的 npm，同级依赖必须显式安装：

```shell
npm install --save-dev @types/node
```

<!-- When the package @types/node is installed, the compiler does not complain about the variable <i>process</i>. Note that there is no need to require the types to the code, the installation of the package is enough!-->
当安装了@types/node包之后，编译器就不会对变量<i>process</i>抱怨了。需要注意的是，无需将类型引入到代码中，只需要安装这个包就可以了！

### Improving the project

<!-- Next, let's add npm scripts to run our two programs <i>multiplier</i> and <i>calculator</i>:-->
接下来，让我们加入npm脚本来执行我们的两个程式<i>multiplier</i>和<i>calculator</i>:

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
我们可以通过以下更改使用命令行参数来让乘数工作：

```js
const multiplicator = (a: number, b: number, printText: string) => {
  console.log(printText,  a * b);
}

const a: number = Number(process.argv[2])
const b: number = Number(process.argv[3])
multiplicator(a, b, `Multiplied ${a} and ${b}, the result is:`);
```

<!-- And we can run it with:-->
我们可以用下面的命令运行它：

```shell
npm run multiply 5 2
```

<!-- If the program is run with parameters that are not of the right type, e.g.-->
a string instead of a number

如果程序以不正确类型的参数运行，例如字符串而不是数字。

```shell
npm run multiply 5 lol
```

<!-- it "works" but gives us the answer:-->
它“运作”，但给了我们答案：

```shell
Multiplied 5 and NaN, the result is: NaN
```

<!-- The reason for this is, that *Number('lol')* returns *NaN*,-->
which means "Not a Number".

因为这个原因，*Number('lol')* 返回的是*NaN*，意思是"不是一个数字"。
<!-- which is actually of type *number*, so TypeScript has no power to rescue us from this kind of situation.-->
这实际上是一个*数字*类型，因此TypeScript无法从这种情况中拯救我们。

<!-- To prevent this kind of behavior, we have to validate the data given to us from the command line.-->
为了防止这种行为，我们必须验证从命令行给我们提供的数据。

<!-- The improved version of the multiplicator looks like this:-->
这个改进版的乘法器看起来像这样：

```js
interface MultiplyValues {
  value1: number;
  value2: number;
}

const parseArguments = (args: string[]): MultiplyValues => {
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
当我们现在运行程序：

```shell
npm run multiply 1 lol
```

<!-- we get a proper error message:-->
我们得到一个适当的错误讯息：

```shell
Something bad happened. Error: Provided values were not numbers!
```

<!-- There is quite a lot going on in the code. The most important addition is the function *parseArguments* that ensures that the parameters given to *multiplicator* are of the right type. If not, an exception is thrown with a descriptive error message.-->
在代码中发生了相当多的事情。最重要的添加是*parseArguments*函数，确保给*multiplicator*的参数是正确类型的。如果不是，就会抛出一个带有描述性错误消息的异常。

<!-- The definition of the function has a couple of interesting things:-->
函数的定义有一些有趣的事情：

```js
const parseArguments = (args: string[]): MultiplyValues => {
  // ...
}
```

<!-- Firstly, the parameter *args* is an [array](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays) of strings.-->
首先，参数*args*是一个[数组](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays)，其中的元素是字符串。

<!-- The return value of the function has the type *MultiplyValues*, which is defined as follows:-->
函数的返回值具有类型*MultiplyValues*，定义如下：

```js
interface MultiplyValues {
  value1: number;
  value2: number;
}
```

<!-- The definition utilizes TypeScript's [Interface](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces) keyword, which is one way to define the "shape" an object should have. In our case, it is quite obvious that the return value should be an object with the two properties *value1* and *value2*, which should both be of type number.-->
定义使用TypeScript的[接口](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces)关键字，这是定义对象应该具有的“形状”的一种方式。在我们的例子中，很明显返回值应该是一个具有两个属性*value1*和*value2*的对象，它们都应该是number类型。

### The alternative array syntax

<!-- Note that there is also an alternative syntax for [arrays](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays) in TypeScript. Instead of writing-->
`number[]`, you can write `Array<number>`.

注意，TypeScript 中还有一种[数组](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays)的替代语法。而不是写 `number[]`，你可以写 `Array<number>`。

```js
let values: number[];
```

<!-- we could use the "generics syntax" and write-->
our own.

我们可以使用"泛型语法"并编写自己的。

```js
let values: Array<number>;
```

<!-- In this course we shall mostly be following the convention enforced by the Eslint rule [array-simple](https://typescript-eslint.io/rules/array-type/#array-simple) that suggests to write the simple arrays with the [] syntax and use the the <> syntax for the more complex ones, see [here](https://typescript-eslint.io/rules/array-type/#array-simple) for examples.-->
在本课程中，我们将主要遵循Eslint规则[array-simple](https://typescript-eslint.io/rules/array-type/#array-simple)强制执行的约定，该规则建议使用[]语法编写简单数组，并使用<>语法编写更复杂的数组，详见[此处](https://typescript-eslint.io/rules/array-type/#array-simple)获取示例。

</div>

<div class="tasks">

### Exercises 9.1-9.3

#### setup

<!-- Exercises 9.1-9.7. will all be made in the same node project. Create the project in an empty directory with *npm init* and install the ts-node and typescript packages. Also, create the file <i>tsconfig.json</i> in the directory with the following content:-->
9.1-9.7的练习都将在同一个节点项目中完成。使用*npm init*在一个空的目录中创建项目，并安装ts-node和typescript软件包。另外，在目录中创建文件<i>tsconfig.json</i>，内容如下：

```json
{
  "compilerOptions": {
    "noImplicitAny": true,
  }
}
```

<!-- The compiler option [noImplicitAny](https://www.typescriptlang.org/tsconfig#noImplicitAny) makes it mandatory to have types for all variables used. This option is currently a default, but it lets us define it explicitly.-->
[noImplicitAny](https://www.typescriptlang.org/tsconfig#noImplicitAny) 编译器选项使得所有使用的变量都必须有类型。这个选项目前是默认开启的，但也可以明确地定义它。

#### 9.1 Body mass index

<!-- Create the code of this exercise in the file <i>bmiCalculator.ts</i>.-->
在文件<i>bmiCalculator.ts</i>中创建此练习的代码。

<!-- Write a function *calculateBmi* that calculates a [BMI](https://en.wikipedia.org/wiki/Body_mass_index) based on a given height (in centimeters) and weight (in kilograms) and then returns a message that suits the results.-->
写一个函数 *calculateBmi*，根据给定的身高（以厘米为单位）和体重（以公斤为单位）计算[BMI](https://en.wikipedia.org/wiki/Body_mass_index)，然后返回符合结果的消息。

<!-- Call the function in the same file with hard-coded parameters and print out the result. The code-->
should be written in JavaScript.

在同一个文件中调用函数，使用硬编码参数，并打印出结果。代码应该用JavaScript编写。

```js
console.log(calculateBmi(180, 74))
```

<!-- should print the following message:-->
**你好！**

你好！

```shell
Normal (healthy weight)
```

<!-- Create an npm script for running the program with the command *npm run calculateBmi*.-->
在`package.json`中创建一个npm脚本，可以通过命令`npm run calculateBmi`运行程序。

#### 9.2 Exercise calculator

<!-- Create the code of this exercise in file *exerciseCalculator.ts*.-->
在*exerciseCalculator.ts*文件中创建此练习的代码。

<!-- Write a function *calculateExercises* that calculates the average time of <i>daily exercise hours</i> and compares it to the <i>target amount</i> of daily hours and returns an object that includes the following values:-->
写一个函数 *calculateExercises* 用于计算<i>每日锻炼时间</i>的平均时间，并将其与<i>每日锻炼目标时间</i>进行比较，返回一个包含以下值的对象：

<!-- - the number of days-->
**天数**
<!-- - the number of training days-->
- 训练天数
<!-- - the original target value-->
# 这个目标值

这个目标值
<!-- - the calculated average time-->
计算出的平均时间
<!-- - boolean value describing if the target was reached-->
布尔值描述是否达到目标
<!-- - a rating between the numbers 1-3 that tells how well the hours are met. You can decide on the metric on your own.-->
1-3 分的评分，反映工时达标程度（可自行确定标准）
<!-- - a text value explaining the rating, you can come up with the explanations-->
**评级：5/5**

给出了5/5的评级，表明该产品的质量和性能都达到了最高的标准。

<!-- The daily exercise hours are given to the function as an [array](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays) that contains the number of exercise hours for each day in the training period. Eg. a week with 3 hours of training on Monday, none on Tuesday, 2 hours on Wednesday, 4.5 hours on Thursday and so on would be represented by the following array:-->
每日锻炼时间被提供给功能作为一个[数组](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays)，其中包含训练期间每天的锻炼时间数量。例如，一周星期一3小时的训练，星期二没有，星期三2小时，星期四4.5小时等等，将由以下数组表示：

```js
[3, 0, 2, 4.5, 0, 3, 1]
```

<!-- For the Result object, you should create an [interface](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces).-->
对于Result对象，你应该创建一个[接口](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces)。

<!-- If you call the function with parameters *[3, 0, 2, 4.5, 0, 3, 1]* and *2*, it should return:-->
如果您以参数*[3, 0, 2, 4.5, 0, 3, 1]*和*2*调用函数，它应该返回：

```js
{ periodLength: 7,
  trainingDays: 5,
  success: false,
  rating: 2,
  ratingDescription: 'not too bad but could be better',
  target: 2,
  average: 1.9285714285714286 }
```

<!-- Create an npm script, *npm run calculateExercises*, to call the function with hard-coded values.-->
创建一个npm脚本，*npm run calculateExercises*，用硬编码的值调用该函数。

#### 9.3 Command line

<!-- Change the previous exercises so that you can give the parameters of *bmiCalculator* and *exerciseCalculator* as command-line arguments.-->
改变之前的练习，使得你可以将*bmiCalculator*和*exerciseCalculator*的参数作为命令行参数传入。

<!-- Your program could work eg. as follows:-->
您的程序可以如下工作：

```shell
$ npm run calculateBmi 180 91

Overweight
```

<!-- and:-->
**把你的想法表达出来**

**把你的想法表达出来**

**将你的想法表达出来**

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
处理异常和错误的方式恰当。`exerciseCalculator`应该接受不同长度的输入。自行决定如何收集所有所需的输入。

<!-- Couple of things to notice:-->
* 注意几件事：

<!-- If you define helper functions in other modules, you should use the [JavaScript module system](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), that is, the one we have used with React where importing is done with-->
`import` and `export`.

如果你在其他模块中定义辅助函数，你应该使用[JavaScript模块系统](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)，也就是我们在React中使用的那个，其中使用`import`和`export`进行导入。

```js
import { isNotNumber } from "./utils";
```

<!-- and exporting-->
to China

## 英文

We are a company specialized in manufacturing and exporting to China. 

## 中文

我们是一家专门生产并向中国出口的公司。

```js
export const isNotNumber = (argument: any): boolean =>
  isNaN(Number(argument));

default export "this is the default..."
```

<!-- Another note: somehow surprisingly TypeScript does not allow to define the same variable in many files at a "block-scope", that is, outside functions (or classes):-->
另一个注意事项：令人意外的是，TypeScript不允许在许多档案中以「区块范围」（即在函数（或类别）之外）定义相同的变数：

![browser showing pong from localhost:3000/ping](../../images/9/60new.png)

<!-- This is actually not quite true. This rule applies only to files that are treated as "scripts". A file is a script if it does not contain any export or import statements. If a file has those, then the file is treated as a [module](https://www.typescriptlang.org/docs/handbook/modules.html), <i>and</i> the variables do not get defined in the block-scope.-->
这实际上并不完全正确。这个规则只适用于被视为“脚本”的文件。如果一个文件不包含任何导出或导入语句，则该文件被视为[模块](https://www.typescriptlang.org/docs/handbook/modules.html)，<i>而</i>变量不会在块作用域中定义。

</div>

<div class="content">

### More about tsconfig

<!-- We have so far used only one tsconfig rule [noImplicitAny](https://www.typescriptlang.org/tsconfig#noImplicitAny). It's a good place to start, but now it's time to look into the config file a little deeper.-->
我们到目前为止只使用了一条tsconfig规则[noImplicitAny](https://www.typescriptlang.org/tsconfig#noImplicitAny)。这是一个很好的开始，但现在是时候更深入地研究一下配置文件了。

<!-- As mentioned, the [tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) file contains all your core configurations on how you want TypeScript to work in your project.-->
# 如前所述，[tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) 文件包含了您在项目中如何使用TypeScript的所有核心配置。

<!-- Let's specify the following configurations in our <i>tsconfig.json</i> file:-->
让我们在我们的<i>tsconfig.json</i>文件中指定以下配置：

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitAny": true, // highlight-line
    "esModuleInterop": true,
    "moduleResolution": "node"
  }
}
```

<!-- Do not worry too much about the *compilerOptions*; they will be under closer inspection later on.-->
不要太担心*compilerOptions*；它们稍后会接受更仔细的检查。

<!-- You can find explanations for each of the configurations from the TypeScript documentation or from the really handy [tsconfig page](https://www.typescriptlang.org/tsconfig), or from the tsconfig [schema definition](http://json.schemastore.org/tsconfig), which unfortunately is formatted a little worse than the first two options.-->
你可以从 TypeScript 文档中找到每个配置的解释，或者从非常方便的[tsconfig页面](https://www.typescriptlang.org/tsconfig)中找到，或者从tsconfig [schema定义](http://json.schemastore.org/tsconfig)中找到，不幸的是，这个格式比前两个选项差了一些。

### Adding Express to the mix

<!-- Right now, we are in a pretty good place. Our project is set up and we have two executable calculators in it.-->
现在，我们处于一个相当不错的位置。我们的项目已经建立起来，我们有两个可执行的计算器。
<!-- However, since we aim to learn FullStack development, it is time to start working with some HTTP requests.-->
然而，由于我们的目标是学习FullStack开发，现在是时候开始使用一些HTTP请求了。

<!-- Let us start by installing Express:-->
让我们从安装Express开始：

```bash
npm install express
```

<!-- and then add the *start* script to package.json:-->
在`package.json`中添加*start*脚本：

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

<!-- Now we can create the file <i>index.ts</i>, and write the HTTP GET *ping</i> endpoint to it:-->
现在我们可以创建文件<i>index.ts</i>，并在其中写入HTTP GET *ping</i>端点：

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

<!-- Everything else seems to be working just fine but, as you'd expect, the *req* and *res* parameters of *app.get* need typing. If you look carefully, VSCode is also complaining about the importing of Express. You can see a short yellow line of dots under *require*. Let's hover over the problem:-->
一切似乎都正常工作，但正如你所期望的，*app.get* 的*req* 和*res* 参数需要手动输入。 如果你仔细看，VSCode 也在抱怨 Express 的导入。 你可以在*require* 下看到一条短的黄色线段。 让我们看看问题：

![vscode warning to change require to import](../../images/9/6.png)

<!-- The complaint is that the *'require' call may be converted to an import*. Let us follow the advice and write the import as follows:-->
抱怨是*'require' 调用可能被转换成导入*。让我们遵循建议并编写如下导入：

```js
import express from 'express';
```

<!-- **NB**: VSCode offers you the possibility to fix the issues automatically by clicking the <i>Quick Fix...</i> button. Keep your eyes open for these helpers/quick fixes; listening to your editor usually makes your code better and easier to read. The automatic fixes for issues can be a major time saver as well.-->
**NB**：VSCode 为您提供了点击<i>快速修复...</i>按钮自动修复问题的可能性。留意这些帮助者/快速修复；听从你的编辑器通常会使你的代码更好，更易于阅读。自动修复问题也可以节省大量时间。

<!-- Now we run into another problem, the compiler complains about the import statement.-->
现在我们遇到另一个问题，编译器抱怨导入语句。
<!-- Once again, the editor is our best friend when trying to find out what the issue is:-->
再一次，当我们试图找出问题是什么时，编辑器是我们最好的朋友：

![vscode error about not finding express](../../images/9/7.png)

<!-- We haven''t installed types for <i>express</i>.-->
我们还没有为<i>express</i>安装类型。
<!-- Let's do what the suggestion says and run:-->
让我们按照建议做，跑起来！

```bash
npm install --save-dev @types/express
```

<!-- And no more errors! Let's take a look at what changed.-->
# 再也没有错误了！让我们来看看发生了什么变化。

<!-- When we hover over the *require* statement, we can see the compiler interprets everything express-related to be of type *any*.-->
当我们悬停在*require*语句上时，我们可以看到编译器将所有与express相关的内容解释为*any*类型。

![vscode showing problem of implicitly having any type](../../images/9/8a.png)

<!-- Whereas when we use *import*, the editor knows the actual types:-->
而当我们使用*import*时，编辑器知道实际类型：

![vscode showing req is of type Request](../../images/9/9x.png)

<!-- Which import statement to use depends on the export method used in the imported package.-->
根据导入包中使用的导出方法，应该使用哪个导入语句取决于。

<!-- A good rule of thumb is to try importing a module using the *import* statement first. We will always use this method in the <i>frontend</i>.-->
一个好的经验法则是首先尝试使用*import*语句导入一个模块。我们将始终在<i>前端</i>中使用此方法。
<!-- If *import* does not work, try a combined method: *import ... = require('...')*.-->
如果*import*不起作用，尝试结合方法：*import ... = require('...')*.

<!-- We strongly suggest you read more about TypeScript modules [here](https://www.typescriptlang.org/docs/handbook/modules.html).-->
我们强烈建议您[这里](https://www.typescriptlang.org/docs/handbook/modules.html)阅读更多关于TypeScript模块的信息。

<!-- There is one more problem with the code:-->
还有一个问题与代码有关：

![vscode showing req declared but never read](../../images/9/9b.png)

<!-- This is because we banned unused parameters in our <i>tsconfig.json</i>:-->
因为我们在我们的<i>tsconfig.json</i>中禁止了未使用的参数：

```js
{
  "compilerOptions": {
    "target": "ES2022",
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
这种配置可能会产生问题，如果你有库范围内预定义的函数，即使它根本不被使用，也需要声明一个变量，就像这里一样。
<!-- Fortunately, this issue has already been solved on the configuration level.-->
幸运的是，这个问题已经在配置层面上被解决了。
<!-- Once again hovering over the issue gives us a solution. This time we can just click the quick fix button:-->
再次悬停在问题上给我们带来了解决方案。这次我们只需要点击快速修复按钮：

![vscode quickfix to add underscore to variable](../../images/9/14a.png)

<!-- If it is absolutely impossible to get rid of an unused variable, you can prefix it with an underscore to inform the compiler you have thought about it and there is nothing you can do.-->
如果绝对不可能摆脱一个未使用的变量，你可以在它前面加一个下划线，以告知编译器你已经考虑过了，而且已经无能为力。

<!-- Let's rename the *req* variable to *_req*. Finally, we are ready to start the application. It seems to work fine:-->
让我们将*req*变量重命名为*_req*。最后，我们准备好开始应用程序了。看起来工作得很好：

![browser result showing pong on /ping](../../images/9/11a.png)

<!-- To simplify the development, we should enable <i>auto-reloading</i> to improve our workflow. In this course, you have already used <i>nodemon</i>, but ts-node has an alternative called <i>ts-node-dev</i>. It is meant to be used only with a development environment that takes care of recompilation on every change, so restarting the application won''t be necessary.-->
为了简化开发，我们应该启用<i>自动重新加载</i>来改善我们的工作流程。在本课程中，您已经使用过<i>nodemon</i>，但ts-node有一个名为<i>ts-node-dev</i>的替代方案。它仅用于开发环境，该环境负责在每次更改时重新编译，因此不需要重新启动应用程序。

<!-- Let's install *ts-node-dev* to our development dependencies:-->
让我们将*ts-node-dev*安装到我们的开发依赖项中：

```bash
npm install --save-dev ts-node-dev
```

<!-- Add a script to <i>package.json</i>:-->
在`package.json`中添加一个脚本：

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

<!-- And now, by running *npm run dev*, we have a working, auto-reloading development environment for our project!-->
现在，通过运行*npm run dev*，我们为我们的项目构建了一个自动重新加载的开发环境！

</div>

<div class="tasks">

### Exercises 9.4-9.5

#### 9.4 Express

<!-- Add Express to your dependencies and create an HTTP GET endpoint *hello* that answers 'Hello Full Stack!'-->
添加Express到你的依赖，并创建一个HTTP GET端点*hello*，来回答“Hello Full Stack！”

<!-- The web app should be started with the commands *npm start* in production mode and *npm run dev* in development mode. The latter should also use *ts-node-dev* to run the app.-->
应该使用命令*npm start*以生产模式启动Web应用程序，以及使用*npm run dev*以开发模式启动。 后者还应该使用*ts-node-dev*来运行应用程序。

<!-- Replace also your existing <i>tsconfig.json</i> file with the  following content:-->
替换您现有的<i>tsconfig.json</i>文件，内容如下：

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

<!-- Make sure there aren''t any errors!-->
确保没有任何错误！

#### 9.5 WebBMI

<!-- Add an endpoint for the BMI calculator that can be used by doing an HTTP GET request to the endpoint *bmi* and specifying the input with [query string parameters](https://en.wikipedia.org/wiki/Query_string). For example, to get the BMI of a person with a height of 180 and a weight of 72, the URL is <http://localhost:3002/bmi?height=180&weight=72>.-->
添加一个可以通过HTTP GET请求到端点*bmi*并使用[查询字符串参数](https://en.wikipedia.org/wiki/Query_string)指定输入的BMI计算器端点。例如，获取身高180cm，体重72kg的人的BMI，URL为<http://localhost:3002/bmi?height=180&weight=72>。

<!-- The response is a JSON of the form:-->
响应的格式为JSON：

```js
{
  weight: 72,
  height: 180,
  bmi: "Normal (healthy weight)"
}
```

<!-- See the [Express documentation](https://expressjs.com/en/5x/api.html#req.query) for info on how to access the query parameters.-->
看[Express 文档](https://expressjs.com/en/5x/api.html#req.query)了解如何访问查询参数的信息。

<!-- If the query parameters of the request are of the wrong type or missing, a response with proper status code and an error message is given:-->
如果请求的查询参数类型错误或缺失，会返回具有正确状态码和错误消息的响应。

```js
{
  error: "malformatted parameters"
}
```

<!-- Do not copy the calculator code to file <i>index.ts</i>; instead, make it a [TypeScript module](https://www.typescriptlang.org/docs/handbook/modules.html) that can be imported into <i>index.ts</i>.-->
不要将计算器代码复制到文件<i>index.ts</i>中，而是将其制作成一个[TypeScript模块](https://www.typescriptlang.org/docs/handbook/modules.html)，可以导入到<i>index.ts</i>中。

</div>

<div class="content">

### The horrors of *any*

<!-- Now that we have our first endpoints completed, you might notice we have used barely any TypeScript in these small examples. When examining the code a bit closer, we can see a few dangers lurking there.-->
现在我们已经完成了第一个端点，你可能会注意到我们在这些小的例子中几乎没有使用TypeScript。当仔细检查代码时，我们可以看到一些危险正潜伏在那里。

<!-- Let's add the HTTP POST endpoint *calculate* to our app:-->
让我们给我们的应用添加HTTP POST端点*calculate*：

```js
import { calculator } from './calculator';

app.use(express.json());

// ...

app.post('/calculate', (req, res) => {
  const { value1, value2, op } = req.body;

  const result = calculator(value1, value2, op);
  res.send({ result });
});
```

<!-- To get this working, we must add an <i>export</i> to the function *calculator*:-->
要让这个工作，我们必须在函数*计算器*中添加一个<i>导出</i>

```js
export const calculator = (a: number, b: number, op: Operation) : number => {
```

<!-- When you hover over the *calculate* function, you can see the typing of the *calculator* even though the code itself does not contain any typings:-->
当你悬停在*计算*功能上时，你可以看到计算器的类型，即使代码本身不包含任何类型：

![vscode showing calculator types when mouse over function](../../images/9/12a21.png)

<!-- But if you hover over the values parsed from the request, an issue arises:-->
但是如果你悬停在从请求解析出来的值上，就会出现问题：

![vscode problematically showing any when hovering over values parsed in to calculate](../../images/9/13a21.png)

<!-- All of the variables have the type *any*. It is not all that surprising, as no one has given them a type yet. There are a couple of ways to fix this, but first, we have to consider why this is accepted and where the type *any* came from.-->
所有的变量都有类型*any*。这并不令人惊讶，因为没有人给它们赋予类型。有几种方法可以解决这个问题，但是首先，我们必须考虑为什么这是可以接受的，以及类型*any*是从哪里来的。

<!-- In TypeScript, every untyped variable whose type cannot be inferred implicitly becomes type [any](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any). Any is a kind of "wild card" type which stands for <i>whatever</i> type.-->
在TypeScript中，每个未类型化的变量，其类型无法隐式推断，就会变成[any](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any)类型。Any是一种“通配符”类型，代表<i>任何</i>类型。
<!-- Things become implicitly any type quite often when one forgets to type functions.-->
当一个人忘记输入函数时，事情往往会变得模糊不清。

<!-- We can also explicitly type things *any*. The only difference between the implicit and explicit any type is how the code looks; the compiler does not care about the difference.-->
我们也可以明确地类型化东西 *任何*。隐式和显式任何类型之间唯一的区别是代码看起来如何；编译器不关心这种区别。

<!-- Programmers however see the code differently when *any* is explicitly enforced than when it is implicitly inferred.-->
程序员然而会以不同的方式看待代码，当明确强调 *任何* 时比起隐式推断更加强烈。
<!-- Implicit *any* typings are usually considered problematic, since it is quite often due to the coder forgetting to assign types (or being too lazy to do it), and it also means that the full power of TypeScript is not properly exploited.-->
隐式*任何*类型通常被认为是有问题的，因为这往往是由于程序员忘记指定类型（或者太懒而没有做），这也意味着TypeScript的全部功能没有得到正确利用。

<!-- This is why the configuration rule [noImplicitAny](https://www.typescriptlang.org/tsconfig#noImplicitAny) exists on the compiler level, and it is highly recommended to keep it on at all times. In the rare occasions when you truly cannot know what the type of a variable is, you should explicitly state that in the code:-->
这就是为什么编译器级别上存在[noImplicitAny](https://www.typescriptlang.org/tsconfig#noImplicitAny)配置规则，强烈建议始终保持其开启状态。 在极少数情况下，当您真的无法知道变量的类型时，应该在代码中明确说明：

```js
const a : any = /* no clue what the type will be! */.
```

<!-- We already have <i>noImplicitAny: true</i> configured in our example, so why does the compiler not complain about the implicit *any* types? The reason is that the *body* field of an Express [Request](https://expressjs.com/en/5x/api.html#req) object is explicitly typed *any*. The same is true for the *request.query* field that Express uses for the query parameters.-->
我们的示例中已经配置了<i>noImplicitAny: true</i>，那么为什么编译器没有抱怨隐式*any*类型呢？原因是Express [Request](https://expressjs.com/en/5x/api.html#req)对象的*body*字段被明确地类型化为*any*。Express用于查询参数的*request.query*字段也是如此。

<!-- What if we would like to restrict developers from using the *any* type? Fortunately, we have methods other than <i>tsconfig.json</i> to enforce a coding style. What we can do is use <i>ESlint</i> to manage-->
our coding styles.

如果我们想限制开发者使用*任何*类型，那该怎么办？幸运的是，我们除了<i>tsconfig.json</i>之外还有其他方法来强制执行编码风格。我们可以使用<i>ESlint</i>来管理我们的编码风格。
<!-- our code.-->
我们的代码。
<!-- Let's install ESlint and its TypeScript extensions:-->
# 让我们安装ESlint及其TypeScript扩展：

```shell
npm install --save-dev eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

<!-- We will configure ESlint to [disallow explicit any]( https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-explicit-any.md). Write the following rules to <i>.eslintrc</i>:-->
我们将配置ESlint来[禁止显式的任何](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-explicit-any.md)。将下面的规则写入<i>.eslintrc</i>：

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

<!-- (Newer versions of ESlint have this rule on by default, so you don''t necessarily need to add it separately.)-->
新版本的ESLint默认已经开启了这个规则，所以不需要另外添加。

<!-- Let us also set up a *lint* npm script to inspect the files with <i>.ts</i> extension by modifying the <i>package.json</i> file:-->
让我们也设置一个*lint* npm脚本来检查带有<i>.ts</i>扩展名的文件，通过修改<i>package.json</i>文件：

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

<!-- Now lint will complain if we try to define a variable of type *any*:-->
现在，如果我们尝试定义一个类型为*任何*的变量，lint将会报告错误：

![vscode showing ESlint complaining about using the any type](../../images/9/13b.png)

<!-- [@typescript-eslint](https://github.com/typescript-eslint/typescript-eslint) has a lot of TypeScript-specific ESlint rules, but you can also use all basic ESlint rules in TypeScript projects.-->
[@typescript-eslint](https://github.com/typescript-eslint/typescript-eslint) 拥有大量特定于 TypeScript 的 ESLint 规则，但是你也可以在 TypeScript 项目中使用所有基本的 ESLint 规则。
<!-- For now, we should probably go with the recommended settings, and we will modify the rules as we go along whenever we find something we want to change the behavior of.-->
现在，我们应该选择推荐的设置，然后，当我们发现有什么想改变行为的时候，我们就会随时修改规则。

<!-- On top of the recommended settings, we should try to get familiar with the coding style required in this part and <i>set the semicolon at the end of each line of code to required</i>.-->
在推荐的设置之上，我们应该尝试熟悉这部分所需的编码风格，并<i>将分号设置在每行代码的末尾</i>。

<!-- So we will use the following <i>.eslintrc</i>-->
file

所以我们将使用下面的<i>.eslintrc</i>文件

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

<!-- Quite a few semicolons are missing, but those are easy to add. We also have to solve the ESlint issues concerning the *any* type:-->
漏掉了不少分号，但这些很容易补上。我们也必须解决关于 *任意* 类型的 ESLint 问题：

![vscode error unsafe assignment of any value](../../images/9/50x.png)

<!-- We could and probably should disable some ESlint rules to get the data from the request body.-->
我们可以并且可能应该禁用一些ESLint规则以从请求体中获取数据。

<!-- Disabling *@typescript-eslint/no-unsafe-assignment* for the destructuring assignment and calling the [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/Number) constructor to values is nearly enough:-->
禁用*@typescript-eslint/no-unsafe-assignment*对于解构赋值和调用[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/Number)构造函数来赋值几乎足够了：

```js
app.post('/calculate', (req, res) => {
  // highlight-start
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  // highlight-end
  const { value1, value2, op } = req.body;

  const result = calculator(Number(value1), Number(value2), op); // highlight-line
  res.send({ result });
});
```

<!-- However this still leaves one problem to deal with, the last parameter in the function call is not safe:-->
然而，这仍然留下了一个问题需要处理，函数调用中的最后一个参数是不安全的：

![vscode showing unsafe argument of any type assigned to parameter of type Operation](../../images/9/51x.png)

<!-- We can just disable another ESlint rule to get rid of that:-->
我们可以禁用另一个ESlint规则以摆脱它：

```js
app.post('/calculate', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { value1, value2, op } = req.body;

  // highlight-start
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  // highlight-end
  const result = calculator(Number(value1), Number(value2), op);
  res.send({ result });
});
```

<!-- We now got ESlint silenced but we are totally at the mercy of the user. We most definitively should do some validation to the post data and give a proper error message if the data is invalid:-->
我们现在把ESLint消除了，但我们完全受用户的支配。我们绝对应该对提交的数据进行一些验证，如果数据无效，就给出一个适当的错误消息：

```js
app.post('/calculate', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { value1, value2, op } = req.body;

// highlight-start
  if ( !value1 || isNaN(Number(value1)) ) {
    return res.status(400).send({ error: '...'});
  }
  // highlight-end

  // more validations here...

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const result = calculator(Number(value1), Number(value2), op);
  return res.send({ result });
});
```

<!-- We shall see later on in this part some techniques how the <i>any</i> typed data (eg. the input an app receives from the user) can be <i>narrowed</i> to a more specific type (such as number). With a proper narrowing of types, there is no more need to silence the eslint rules.-->
我们稍后在本部分将看到一些技术，如何将<i>任何</i>类型的数据（例如应用程序从用户接收的输入）缩小到更具体的类型（例如数字）。通过正确缩小类型，就不再需要消除eslint规则。

### Type assertion

<!-- Using a [type assertion](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions) is another "dirty trick" that can be done to keep TypeScript compiler and Eslint quiet. Let us export the type Operation in <i>calculator.ts</i>:-->
使用[类型断言](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions)是另一种“肮脏的把戏”，可以让TypeScript编译器和Eslint保持安静。让我们在<i>calculator.ts</i>中导出类型Operation：

```js
export type Operation = 'multiply' | 'add' | 'divide';
```

<!-- Now we can import the type and use a <i>type assertion</i> to tell the TypeScript compiler what type a variable has:-->
现在我们可以导入类型，并使用<i>类型断言</i>来告诉TypeScript编译器变量的类型：

```js
import { calculator, Operation } from './calculator'; // highligh-line

app.post('/calculate', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { value1, value2, op } = req.body;

  // validate the data here

  // assert the type
  const operation = op as Operation;  // highlight-line

  const result = calculator(Number(value1), Number(value2), operation); // highlight-line

  return res.send({ result });
});
```

<!-- The defined constant *operation* has now the type *Operation* and the compiler is perfectly happy, no quieting of the Eslint rule is needed on the following function call. The new variable is actually not needed, the type assertion can be done when an argument is passed to the function:-->
定义的常量*operation*现在的类型是*Operation*，编译器非常满意，接下来函数调用时不需要调整Eslint规则。实际上新变量不需要，当传递参数给函数时可以进行类型断言：

```js
app.post('/calculate', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { value1, value2, op } = req.body;

  // validate the data here

  const result = calculator(
    Number(value1), Number(value2), op as Operation // highlight-line
  );

  return res.send({ result });
});
```

<!-- Using a type assertion (or quieting an Eslint rule) is always a bit risky thing. It leaves the TypeScript compiler off the hook, the compiler just trusts that we as developers know what we are doing. If the asserted type does <i>not</i> have the right kind of value, the result will be a runtime error, so one must be pretty careful when validating the data if a type assertion is used.-->
使用类型断言（或压制Eslint规则）总是一件有点冒险的事情。它让TypeScript编译器摆脱了责任，编译器只相信我们作为开发人员知道我们在做什么。如果断言的类型<i>没有</i>正确的值，结果将是运行时错误，因此如果使用类型断言，在验证数据时必须非常小心。

<!-- In the next chapter we shall have a look at [type narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) which will provide a much more safe way of giving a stricter type for data that is coming from an external source.-->
在下一章中，我们将探讨[类型缩小](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)，它将提供一种更安全的方式，为来自外部源的数据提供更严格的类型。

</div>

<div class="tasks">

### Exercises 9.6-9.7

#### 9.6 Eslint

<!-- Configure your project to use the above ESlint settings and fix all the warnings.-->
配置你的项目使用上述ESlint设置，并修复所有警告。

#### 9.7 WebExercises

<!-- Add an endpoint to your app for the exercise calculator. It should be used by doing an HTTP POST request to endpoint <http://localhost:3002/exercises> with the input in the request body:-->
在您的应用程序中添加一个锻炼计算器的端点。它应该通过使用HTTP POST请求到端点<http://localhost:3002/exercises>，并将请求体中的输入来使用：

```js
{
  "daily_exercises": [1, 0, 2, 0, 3, 0, 2.5],
  "target": 2.5
}
```

<!-- The response is a JSON of the following form:-->
响应的形式为以下JSON：

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

<!-- If the body of the request is not in the right form, a response with the proper status code and an error message are given. The error message is either-->
provided by the server or generated by the client.

如果请求的报文格式不正确，服务器会返回一个正确的状态码和错误消息。该错误消息可由服务器提供，也可由客户端生成。

```js
{
  error: "parameters missing"
}
```

<!-- or-->
# 我有一个梦想

我有一个梦想，我想去看世界，去探索不同的文化，去体验不同的生活方式。我想去攀登最高的山峰，去游泳在最深的海洋，去漫步在最美的森林。我想去拥抱世界的美丽，去欣赏它的神奇，去感受它的温暖。

# 我有一个梦想

我有一个梦想，我想去周游世界，去探索不同的文化，去体验不同的生活方式。我想去攀登最高的山峰，去游泳在最深的海洋，去漫步在最美的森林。我想去拥抱世界的美丽，去欣赏它的神奇，去感受它的温暖。

```js
{
  error: "malformatted parameters"
}
```

<!-- depending on the error. The latter happens if the input values do not have the right type, i.e. they are not numbers or convertible to numbers.-->
根据错误情况而定。后一种情况发生在输入值的类型不正确，即它们不是数字或者不可转换为数字时。

<!-- In this exercise, you might find it beneficial to use the *explicit any* type when handling the data in the request body. Our ESlint configuration is preventing this but you may unset this rule for a particular line by inserting the following comment as the previous line:-->
在这个练习中，当处理请求体中的数据时，你可能会发现使用*明确任何*类型有益。我们的ESlint配置正在阻止这种情况，但你可以通过在上一行插入以下评论来取消此规则：

```js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
```

<!-- You might also get in trouble with rules *no-unsafe-member-access* and *no-unsafe-assignment*. These rules may be ignored in this exercise.-->
你可能会因为*no-unsafe-member-access*和*no-unsafe-assignment*规则而麻烦。 这些规则可能在这个练习中被忽略。

<!-- Note that you need to have a correct setup to get the request body; see [part 3](/en/part3/node_js_and_express#receiving-data).-->
注意，您需要正确设置才能获取请求体；请参见[第3章节](/en/part3/node_js_and_express#receiving-data)。

</div>
