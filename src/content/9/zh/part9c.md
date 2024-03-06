---
mainImage: ../../../images/part-9.svg
part: 9
letter: c
lang: zh
---

<div class="content">

<!-- Now that we have a basic understanding of how TypeScript works and how to create small projects with it, it's time to start creating something actually useful. We are now going to create a new project that will introduce use cases that are a little more realistic.-->
 现在我们已经基本了解了TypeScript的工作原理和如何用它创建小项目，是时候开始创建一些真正有用的东西了。我们现在要创建一个新的项目，它将介绍一些更现实的用例。

<!-- One major change from the previous part is that <i>we're not going to use ts-node anymore</i>. It is a handy tool that helps you get started, but in the long run it is advisable to use the official TypeScript compiler that comes with the <i>typescript</i> npm-package. The official compiler generates and packages JavaScript files from the .ts files so that the built <i>production version</i> won't contain any TypeScript code anymore. This is the exact outcome we are aiming for, since TypeScript itself is not executable by browsers or Node.-->
 与上一部分相比，一个主要的变化是，<i>我们不再使用ts-node了</i>。它是一个方便的工具，可以帮助你入门，但从长远来看，建议使用官方的TypeScript编译器，该编译器随<i>typescript</i>npm-package一起提供。官方编译器会从.ts文件中生成并打包JavaScript文件，这样构建的<i>生产版本</i>就不会再包含任何TypeScript代码。这正是我们想要的结果，因为TypeScript本身不能被浏览器或Node执行。

### Setting up the project

<!-- We will create a project for Ilari, who loves flying small planes but has a difficult time managing his flight history. He is a coder himself, so he doesn't necessarily need a user interface, but he'd like to use a software with HTTP requests and retain the possibility of later adding a web-based user interface to the application.-->
 我们将为Ilari创建一个项目，他喜欢驾驶小飞机，但很难管理他的飞行记录。他自己是个程序员，所以他不一定需要用户界面，但他希望使用一个带有HTTP请求的软件，并保留以后在应用中添加基于网络的用户界面的可能性。

<!-- Let's start by creating our first real project: <i>Ilari's flight diaries</i>. As usual, run <i>npm init</i> and install the <i>typescript</i> package as a dev dependency.-->
 让我们开始创建我们的第一个真正的项目。<i>Ilari's flight diaries</i>。像往常一样，运行<i>npm init</i>并安装<i>typescript</i>包作为开发依赖。

```shell
 npm install typescript --save-dev
```

<!-- TypeScript's Native Compiler (<i>tsc</i>) can help us initialize our project by generating our <i>tsconfig.json</i> file.-->
 TypeScript的本地编译器（<i>tsc</i>）可以通过生成<i>tsconfig.json</i>文件帮助我们初始化项目。
<!-- First, we need to add the <i>tsc</i> command to the list of executable scripts in <i>package.json</i> (unless you have installed *typescript* globally). Even if you installed TypeScript globally, you should always add it as a dev dependency to your project.-->
 首先，我们需要将<i>tsc</i>命令添加到<i>package.json</i>的可执行脚本列表中（除非你已经全局安装了*typescript*）。即使你在全局范围内安装了TypeScript，你也应该把它作为一个开发依赖项添加到你的项目中。

<!-- The npm script for running <i>tsc</i> is set as follows:-->
 运行<i>tsc</i>的npm脚本被设置成如下。

```json
{
  // ..
  "scripts": {
    "tsc": "tsc" // highlight-line
  },
  // ..
}
```

<!-- The bare <i>tsc</i> command is often added to the </i>scripts</i> so that other scripts can use it, hence don't be surprised to find it set up within the project like this.-->
 光秃秃的<i>tsc</i>命令经常被添加到</i>scripts</i>中，以便其他脚本可以使用它，因此，不要惊讶地发现它在项目中被设置成这样。

<!-- We can now initialise our tsconfig.json settings by running:-->
 我们现在可以通过运行以下程序来初始化我们的tsconfig.json设置。

```shell
 npm run tsc -- --init
```

<!--  **Note** the extra <i>--</i> before the actual argument! Arguments before <i>--</i>  are interpreted as being for the <i>npm</i> command, while the ones after that are meant for the command that is run through the script (i.e. <i>tsc</i> in this case).-->
 **注意**实际参数前的额外<i>--</i>!<i>--</i>之前的参数被解释为用于<i>npm</i>命令，而之后的参数是指通过脚本运行的命令（即本例中的<i>tsc</i>）。

<!-- The <i>tsconfig.json</i> file we just created contains a lengthy list of every configuration available to us. However, most of them are commented out.-->
 我们刚刚创建的<i>tsconfig.json</i>文件包含了一个长长的列表，列出了我们可以使用的所有配置。然而，其中大部分都被注释掉了。
<!-- Studying this file can help you find some configuration options you might need.-->
 研究这个文件可以帮助你找到一些你可能需要的配置选项。
<!-- It is also completely okay to keep the commented lines, in case you might need them someday.-->
 保留这些注释行也是完全可以的，以防你有一天会需要它们。

<!-- At the moment, we want the following to be active:-->
 目前，我们希望以下内容是有效的。

```json
{
  "compilerOptions": {
    "target": "ES6",
    "outDir": "./build/",
    "module": "commonjs",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true
  }
}
```

<!-- Let's go through each configuration:-->
 我们来看看每个配置。

<!-- The <i>target</i> configuration tells the compiler which *ECMAScript* version to use when generating JavaScript. ES6 is supported by most browsers, so it is a good and safe option.-->
 <i>target</i>配置告诉编译器在生成JavaScript时要使用哪个*ECMAScript*版本。ES6被大多数浏览器所支持，所以它是一个好的、安全的选择。

<i>outDir</i> tells where the compiled code should be placed.


<i>module</i> tells the compiler that we want to use *CommonJS* modules in the compiled code. This means we can use the old <i>require</i> syntax instead of the <i>import</i> one, which is not supported in older versions of *Node*, such as version 10.

<i>strict</i> is actually a shorthand for multiple separate options:
<i>noImplicitAny, noImplicitThis, alwaysStrict, strictBindCallApply, strictNullChecks, strictFunctionTypes and strictPropertyInitialization</i>.
<!-- They guide our coding style to use the TypeScript features more strictly.-->
 他们指导我们的编码风格，以更严格地使用TypeScript的功能。
<!-- For us, perhaps the most important is the already-familiar [noImplicitAny](https://www.staging-typescript.org/tsconfig#noImplicitAny). It prevents implicitly setting type <i>any</i>, which can for example happen if you don't type the parameters of a function.-->
 对我们来说，也许最重要的是已经很熟悉的[noImplicitAny](https://www.staging-typescript.org/tsconfig#noImplicitAny)。它可以防止隐式设置类型<i>any</i>，例如，如果你不输入函数的参数，就会发生这种情况。
<!-- Details about the rest of the configurations can be found in the [tsconfig documentation](https://www.staging-typescript.org/tsconfig#strict).-->
 关于其余配置的细节可以在 [tsconfig documentation](https://www.staging-typescript.org/tsconfig#strict) 中找到。
<!-- Using <i>strict</i> is suggested by the official documentation.-->
 官方文档建议使用<i>strict</i>。

<i>noUnusedLocals</i> prevents having unused local variables, and <i>noUnusedParameters</i> throws an error if a function has unused parameters.

<i>noFallthroughCasesInSwitch</i> ensures that, in a *switch case*, each case ends either with a <i>return</i> or a <i>break</i> statement.

<i>esModuleInterop</i> allows interoperability between CommonJS and ES Modules; see more in the [documentation](https://www.staging-typescript.org/tsconfig#esModuleInterop).

<!-- Now that we have set our configuration, we can continue by installing <i>express</i> and, of course, also <i>@types/express</i>. Also, since this is a real project, which is intended to be grown over time, we will use eslint from the very beginning:-->
 现在我们已经设置了我们的配置，我们可以继续安装<i>express</i>，当然还有<i>@types/express</i>。另外，由于这是一个真正的项目，它打算随着时间的推移而发展，我们将从一开始就使用eslint。

```shell
npm install express
npm install --save-dev eslint @types/express @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

<!-- Now our <i>package.json</i> should look like this:-->
 现在我们的<i>package.json</i>应该如下所示：

```json
{
  "name": "flight_diary",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "tsc": "tsc"
  },
  "author": "Jane Doe",
  "license": "ISC",
  "devDependencies": {
    "@types/express": "^4.17.13",
    "@typescript-eslint/eslint-plugin": "^5.12.1",
    "@typescript-eslint/parser": "^5.12.1",
    "eslint": "^8.9.0",
    "typescript": "^4.5.5"
  },
  "dependencies": {
    "express": "^4.17.3"
  }
}
```

<!-- We also create an <i>.eslintrc</i> file with the following content:-->
 我们还创建了一个<i>.eslintrc</i>文件，内容如下。

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
    "es6": true,
    "node": true
  },
  "rules": {
    "@typescript-eslint/semi": ["error"],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
    "@typescript-eslint/restrict-plus-operands": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
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

<!-- Now we just need to set up our development environment, and we are ready to start writing some serious code.-->
 现在我们只需要设置我们的开发环境，我们就可以开始编写一些严肃的代码了。
<!-- There are many different options for this. One option could be to use the familiar <i>nodemon</i> with </i>ts-node</i>. However, as we saw earlier, </i>ts-node-dev</i> does the exact same thing, so we will use that instead.-->
 对此有许多不同的选择。一种选择是使用熟悉的<i>nodemon</i>与</i>ts-node</i>。然而，正如我们之前看到的，</i>ts-node-dev</i>做了完全相同的事情，所以我们将使用它来代替。
<!-- So, let's install <i>ts-node-dev</i>:-->
 所以，让我们安装<i>ts-name-dev</i>。

```shell
npm install --save-dev ts-node-dev
```

<!-- We finally define a few more npm scripts, and voilà, we are ready to begin:-->
 我们最后再定义几个npm脚本，然后就可以开始了。

```json
{
  // ...
  "scripts": {
    "tsc": "tsc",
    "dev": "ts-node-dev index.ts", // highlight-line
    "lint": "eslint --ext .ts ." // highlight-line
  },
  // ...
}
```

<!-- As you can see, there is a lot of stuff to go through before beginning the actual coding. When you are working with a real project, careful preparations support your development process. Take the time needed to create a good setup for yourself and your team, so that everything runs smoothly in the long run.-->
 正如你所看到的，在开始实际的编码之前，有很多东西要经过。当你在处理一个真正的项目时，仔细的准备工作支持你的开发过程。花点时间为你自己和你的团队创造一个良好的设置，这样从长远来看，一切都会顺利进行。

### Let there be code

<!-- Now we can finally start coding! As always, we start by creating a ping endpoint, just to make sure everything is working.-->
 现在我们终于可以开始编码了!像往常一样，我们从创建一个ping端点开始，只是为了确保一切都在工作。

<!-- The contents of the <i>index.ts</i> file:-->
 <i>index.ts</i>文件的内容。

```js
import express from 'express';
const app = express();
app.use(express.json());

const PORT = 3000;

app.get('/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

<!-- Now, if we run the app with <i>npm run dev</i>, we can verify that a request to http://localhost:3000/ping gives the response <i>pong</i>, so our configuration is set!-->
 现在，如果我们用<i>npm run dev</i>来运行这个应用，我们可以确认对http://localhost:3000/ping 的请求给出了<i>pong</i>的响应，所以我们的配置已经设定好了

<!-- When starting the app with <i>npm run dev</i>, it runs in development mode.-->
 当用<i>npm run dev</i>启动应用时，它以开发模式运行。
<!-- The development mode is not suitable at all when we later operate the app in production.-->
 当我们以后在生产中操作该应用时，开发模式根本不适合。

<!-- Let's try to create a <i>production build</i> by running the TypeScript compiler. Since we have defined the <i>outdir</i> in our tsconfig.json, there's really nothing else to do but run the script <i>npm run tsc</i>.-->
 让我们试着通过运行TypeScript编译器来创建一个<i>生产构建</i>。因为我们已经在tsconfig.json中定义了<i>outdir</i>，所以除了运行脚本<i>npm run tsc</i>之外，真的没有其他事情要做。

<!-- Just like magic, a native runnable JavaScript production build of the Express backend is created in file <i>index.js</i> inside the directory <i>build</i>. The compiled code looks like this-->
 就像变魔术一样，Express后端本地可运行的JavaScript生产构建被创建在<i>build</i>目录下的<i>index.js</i>文件中。编译后的代码如下所示：这样

```js
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = 3000;
app.get('/ping', (_req, res) => {
    console.log('someone pinged here');
    res.send('pong');
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

<!-- Currently, if we run eslint it will also interpret the files in the <i>build</i> directory. We don't want that, since the code there is compiler-generated. We can prevent this by creating a  <i>.eslintignore</i> file  which lists the content we want eslint to ignore, just like we do with git and <i>.gitignore</i>.-->
 目前，如果我们运行eslint，它也会解释<i>build</i>目录下的文件。我们不希望这样，因为那里的代码是由编译器生成的。我们可以通过创建一个<i>.eslintignore</i>文件，列出我们希望eslint忽略的内容，就像我们对git和<i>.gitignore</i>所做的那样。

<!-- Let's add an npm script for running the application in production mode:-->
 让我们添加一个npm脚本，以便在生产模式下运行该应用。

```json
{
  // ...
  "scripts": {
    "tsc": "tsc",
    "dev": "ts-node-dev index.ts",
    "lint": "eslint --ext .ts .",
    "start": "node build/index.js" // highlight-line
  },
  // ...
}
```

<!-- When we run the app with <i>npm start</i>, we can verify that the production build also works:-->
 当我们用<i>npm start</i>运行应用时，我们可以验证生产模式的构建也是有效的。

![](../../images/9/15a.png)

<!-- Now we have a minimal working pipeline for developing our project.-->
 现在我们有一个最小的工作管道来开发我们的项目。
<!-- With the help of our compiler and eslint, it also ensures that good code quality is maintained. With this base, we can actually start creating an app that we could later on deploy into a production environment.-->
 在我们的编译器和eslint的帮助下，它也确保了良好的代码质量得以保持。有了这个基础，我们实际上可以开始创建一个应用，以后可以部署到生产环境中。

</div>

<div class="tasks">

### Exercises 9.8.-9.9.

<!-- **Before you start the exercises**-->
 **在你开始练习之前**。

<!-- For this set of exercises you will be developing a backend for an existing project called **Patientor**, which is a simple medical record application for doctors who handle diagnoses and basic health information of their patients.-->
 在这组练习中，你将为一个名为**Patientor**的现有项目开发一个后端，它是一个简单的医疗记录应用，供医生处理病人的诊断和基本健康信息。

<!-- The [frontend](https://github.com/fullstack-hy2020/patientor) has already been built by outsider experts and your task is to create a backend to support the existing code.-->
 [前端](https://github.com/fullstack-hy2020/patientor)已经由外部专家构建，你的任务是创建一个后端来支持现有的代码。

#### 9.8: Patientor backend, step1

<!-- Initialise a new backend project that will work with the frontend. Configure eslint and tsconfig with the same configurations as proposed in the material. Define an endpoint that answers to HTTP GET requests to route <i>/api/ping</i>.-->
 初始化一个新的后端项目，它将与前端一起工作。用材料中建议的相同配置来配置eslint和tsconfig。定义一个响应HTTP GET请求的端点，路由<i>/api/ping</i>。

<!-- The project should be runnable with npm scripts, both in development mode and, as compiled code, in production mode.-->
 该项目应该可以用npm脚本运行，既可以在开发模式下运行，也可以作为编译后的代码在生产模式下运行。

#### 9.9: Patientor backend, step2

<!-- Fork and clone the project [patientor](https://github.com/fullstack-hy2020/patientor). Start the project with the help of the README file.-->
 分叉并克隆该项目[patientor](https://github.com/fullstack-hy2020/patientor)。在README文件的帮助下启动该项目。

<!-- You can run this command if you get error message when trying to start the frontend:-->
 如果你在尝试启动前端时得到错误信息，你可以运行这个命令。
```shell
npm update chokidar
```
<!--  You should be able to use the frontend without a functioning backend.-->
 你应该能够在没有正常的后端情况下使用前端。

<!-- Ensure that backend answers to the ping request that <i>frontend</i> has made on startup. Check developer tool to make sure it really works:-->
 确保后端响应<i>frontend</i>在启动时发出的ping请求。检查开发者工具以确保它真的能工作。

![](../../images/9/16a.png)

<!-- You might also want to have a look at the <i>console</i> tab. If something fails, [part 3](/en/part3) of the course shows how the problem can be solved.-->
 你可能还想看一下<i>console</i>标签。如果有什么地方失败了，课程的[第3章节](/en/part3)显示了如何解决这个问题。

</div>

<div class="content">

### Implementing the functionality

<!-- Finally, we are ready to start writing some code.-->
 最后，我们准备开始写一些代码。

<!-- Let's start from the basics. Ilari wants to be able to keep track of his experiences on his flight journeys.-->
让我们从最基本的开始。Ilari希望能够记录他在飞行旅程中的经历。

<!-- He wants to be able to save </i>diary entries</i> which contain:-->
 他希望能够保存包含以下内容的</i>日记条目</i>。
<!-- - The date of the entry-->
 - 条目的日期
<!-- - Weather conditions (good, windy, rainy or stormy)-->
 - 天气状况（良好、大风、雨天或暴风雨）。
<!-- - Visibility (good, ok or poor)-->
 - 能见度（良好、尚可或差）。
<!-- - Free text detailing the experience-->
 - 详述经历的自由文本

<!-- We have obtained some sample data, which we will use as a base to build on.-->
 我们已经获得了一些样本数据，我们将以这些数据为基础进行开发。
<!-- The data is saved in json format, and can be found [here](https://github.com/fullstack-hy2020/misc/blob/master/diaryentries.json).-->
 这些数据是以json格式保存的，可以在[这里](https://github.com/fullstack-hy2020/misc/blob/master/diaryentries.json)找到。

<!-- The data looks like the following:-->
这些数据如下所示：下面这样。

```json
[
  {
    "id": 1,
    "date": "2017-01-01",
    "weather": "rainy",
    "visibility": "poor",
    "comment": "Pretty scary flight, I'm glad I'm alive"
  },
  {
    "id": 2,
    "date": "2017-04-01",
    "weather": "sunny",
    "visibility": "good",
    "comment": "Everything went better than expected, I'm learning much"
  },
  // ...
]
```

<!-- Let's start by creating an endpoint which returns all flight diary entries.-->
 让我们从创建一个返回所有飞行日记条目的端点开始。

<!-- First, we need to make some decisions on how to structure our source code. It is better to place all source code under <i>src</i> directory, so source code is not mixed with configuration files.-->
 首先，我们需要对如何构造我们的源代码做出一些决定。最好是把所有的源代码放在<i>src</i>目录下，这样源代码就不会和配置文件混在一起。
<!-- We will move <i>index.ts</i> there and make the necessary changes to the npm scripts.-->
 我们将把<i>index.ts</i>移到那里，并对npm脚本做必要的修改。

<!-- We will place all [routers](/en/part4/structure_of_backend_application_introduction_to_testing), modules which are responsible for handling a set of specific resources such as <i>diaries</i>, under the directory <i>src/routes</i>.-->
 我们将把所有[routers](/en/part4/structure_of_backend_application_introduction_to_testing)，负责处理一组特定资源的模块，如<i>diaries</i>，放在<i>src/routes</i>目录下。
<!-- This is a bit different than what we did  in [part 4](/en/part4), where we used directory <i>src/controllers</i>.-->
 这与我们在[第4章节](/en/part4)中的做法有些不同，在那里我们使用目录<i>src/controllers</i>。

<!-- The router taking care of all diary endpoints is in <i>src/routes/diaries.ts</i> and looks like this:-->
 负责所有日记端点的路由器在<i>src/routes/diaries.ts</i>，如下所示：

```js
import express from 'express';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send('Fetching all diaries!');
});

router.post('/', (_req, res) => {
  res.send('Saving a diary!');
});

export default router;
```

<!-- We'll route all requests to prefix <i>/api/diaries</i> to that specific router in _index.ts_-->
 我们将把所有对前缀<i>/api/diaries</i>的请求路由到_index.ts_中的那个特定路由器。


```js
import express from 'express';
import diaryRouter from './routes/diaries'; // highlight-line
const app = express();
app.use(express.json());

const PORT = 3000;

app.get('/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.use('/api/diaries', diaryRouter); // highlight-line


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

<!-- And now, if we make an HTTP GET request to http://localhost:3000/api/diaries, we should see the message <i>Fetching all diaries!</i>.-->
 现在，如果我们向http://localhost:3000/api/diaries 发出HTTP GET请求，我们应该看到消息<i>正在获取所有日记！</i>。

<!-- Next, we need to start serving the seed data (found [here](https://github.com/fullstack-hy2020/misc/blob/master/diaryentries.json)) from the app. We will fetch the data and save it to <i>data/diaries.json</i>.-->
 接下来，我们需要开始从应用中提供种子数据（在这里找到[https://github.com/fullstack-hy2020/misc/blob/master/diaryentries.json]）。我们将获取数据并将其保存到<i>data/diaries.json</i>。

<!-- We won't be writing the code for the actual data manipulations in the router. We will create a <i>service</i> which takes care of the data manipulation instead.-->
 我们不会在路由器中编写实际数据操作的代码。我们将创建一个<i>service</i>来处理数据操作。
<!-- It is quite a common practice to separate the "business logic" from the router code into its own modules, which are quite often called <i>services</i>.-->
 将 "业务逻辑 "从路由器代码中分离出来是一种常见的做法，它通常被称为<i>service</i>。
<!-- The name service originates from [Domain-driven design](https://en.wikipedia.org/wiki/Domain-driven_design) and was made popular by the [Spring](https://spring.io/) framework.-->
 服务这个名字源于[领域驱动设计](https://en.wikipedia.org/wiki/Domain-driven_design)，并被[Spring](https://spring.io/)框架所普及。

<!-- Let's create a <i>src/services</i> directory and-->
 让我们创建一个<i>src/services</i>目录，并且
<!-- place the <i>diaryService.ts</i> file in it.-->
 在其中放置<i>diaryService.ts</i>文件。
<!-- The file contains two functions for fetching and saving diary entries:-->
 该文件包含两个用于获取和保存日记条目的函数。

```js
import diaryData from '../../data/diaries.json';

const getEntries = () => {
  return diaryData;
};

const addDiary = () => {
  return null;
};

export default {
  getEntries,
  addDiary
};
```

<!-- But something is not right:-->
 但有些地方不对。

![](../../images/9/17c.png)

<!-- The hint says we might want to use <i>resolveJsonModule</i>. Let's add it to our tsconfig:-->
 提示说我们可能要使用<i>resolveJsonModule</i>。让我们把它添加到我们的tsconfig中。

```json
{
  "compilerOptions": {
    "target": "ES6",
    "outDir": "./build/",
    "module": "commonjs",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "resolveJsonModule": true // highlight-line
  }
}
```

<!-- And our problem is solved.-->
 然后我们的问题就解决了。

<!-- > **NB**: For some reason, VSCode tends to complain that it cannot find the file <i>../../data/diaries.json</i> from the service despite the file existing. That is a bug in the editor, and goes away when the editor is restarted.-->
 > **NB**:由于某些原因，VSCode往往产生警告说它不能从服务中找到<i>.../.../data/diaries.json</i>文件，尽管该文件存在。这是编辑器中的一个错误，当编辑器重新启动时就会消失。

<!-- Earlier, we saw how the compiler can decide the type of a variable by the value it is assigned.-->
 早些时候，我们看到编译器如何通过分配给它的值来决定变量的类型。
<!-- Similarly, the compiler can interpret large data sets consisting of objects and arrays.-->
 同样地，编译器可以解释由对象和数组组成的大型数据集。
<!-- Due to this, the compiler can actually warn us if we try to do something suspicious with the json data we are handling.-->
 由于这个原因，如果我们试图对我们正在处理的json数据做一些可疑的事情，编译器实际上可以警告我们。
<!-- For example, if we are handling an array containing objects of a specific type, and we try to add an object which does not have all the fields the other objects have, or has type conflicts (for example, a number where there should be a string), the compiler can give us a warning.-->
 例如，如果我们正在处理一个包含特定类型的对象的数组，而我们试图添加一个没有其他对象所拥有的所有字段的对象，或者有类型冲突（例如，在应该有字符串的地方有一个数字），编译器会给我们一个警告。

<!-- Even though the compiler is pretty good at making sure we don't do anything unwanted, it is safer to define the types for the data ourselves.-->
 尽管编译器能很好地确保我们不做任何不必要的事情，但自己定义数据的类型还是比较安全的。

<!-- Currently, we have a basic working TypeScript express app, but there are barely any actual <i>typings</i> in the code.-->
 目前，我们有一个基本的TypeScript express应用，但代码中几乎没有任何实际的<i>typings</i>。
<!-- Since we know what type of data should be accepted for the weather and visibility fields, there is no reason for us not to include their types to the code.-->
 既然我们知道天气和可见度字段应该接受什么类型的数据，我们就没有理由不在代码中加入它们的类型。

<!-- Let's create a file for our types, <i>types.ts</i>, where we'll define all our types for this project.-->
 让我们为我们的类型创建一个文件，<i>types.ts</i>，在这里我们将为这个项目定义所有的类型。

<!-- First, let's type the <i>Weather</i> and <i>Visibility</i> values using a [union type](https://www.typescriptlang.org/docs/handbook/advanced-types.html#union-types) of the allowed strings:-->
 首先，让我们使用允许的字符串的[union type](https://www.typescriptlang.org/docs/handbook/advanced-types.html#union-types)来输入<i>Weather</i>和<i>Visibility</i>值。

```js
export type Weather = 'sunny' | 'rainy' | 'cloudy' | 'windy' | 'stormy';

export type Visibility = 'great' | 'good' | 'ok' | 'poor';
```

<!-- And, from there, we can continue by creating a DiaryEntry type, which will be an [interface](http://www.typescriptlang.org/docs/handbook/interfaces.html):-->
 然后，我们可以继续创建一个DiaryEntry类型，它将是一个[接口](http://www.typescriptlang.org/docs/handbook/interfaces.html)。

```js
export interface DiaryEntry {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment: string;
}
```

<!-- We can now try to type our imported json:-->
 我们现在可以尝试输入我们导入的json。

```js
import diaryData from '../../data/diaries.json';

import { DiaryEntry } from '../types'; // highlight-line

const diaries: Array<DiaryEntry> = diaryData; // highlight-line

const getEntries = (): Array<DiaryEntry> => { // highlight-line
  return diaries; // highlight-line
};

const addDiary = () => {
  return null;
};

export default {
  getEntries,
  addDiary
};
```

<!-- But since the json already has its values declared, assigning a type for the data set results in an error:-->
 但是由于json已经声明了它的值，为数据集指定一个类型会导致错误。

![](../../images/9/19b.png)

<!-- The end of the error message reveals the problem: the <i>weather</i> fields are incompatible. In <i>DiaryEntry</i>, we specified that its type is <i>Weather</i>, but-->
 错误信息的结尾揭示了问题所在：<i>weather</i>字段是不兼容的。在<i>DiaryEntry</i>中，我们指定其类型为<i>Weather</i>，但
<!-- the TypeScript compiler had inferred its type to be <i>string</i>.-->
 TypeScript编译器已经推断其类型为<i>string</i>。

<!-- We can fix the problem by doing a [type assertion](http://www.typescriptlang.org/docs/handbook/basic-types.html#type-assertions). This should be done only if we are certain we know what we are doing.-->
 我们可以通过做一个[type assertion](http://www.typescriptlang.org/docs/handbook/basic-types.html#type-assertions)来解决这个问题。只有当我们确定我们知道自己在做什么的时候才可以这样做。
<!-- If we assert the type of the variable <i>diaryData</i> to be <i>DiaryEntry</i> with the keyword <i>as</i>, everything should work:-->
 如果我们用关键字<i>as</i>断言变量<i>diaryData</i>的类型为<i>DiaryEntry</i>，一切都会正常。

```js
import diaryData from '../../data/entries.json'

import { Weather, Visibility, DiaryEntry } from '../types'

const diaries: Array<DiaryEntry> = diaryData as Array<DiaryEntry>; // highlight-line

const getEntries = (): Array<DiaryEntry> => {
  return diaries;
}

const addDiary = () => {
  return null
}

export default {
  getEntries,
  addDiary
};
```

<!-- We should never use type assertion unless there is no other way to proceed, as there is always the danger we assert an unfit type to an object and cause a nasty runtime error.-->
 除非没有其他办法，否则我们不应该使用类型断言，因为我们总是有可能断言一个不合适的类型给一个对象，导致一个讨厌的运行时错误。
<!-- While the compiler trusts you to know what you are doing when using <i>as</i>, by doing this, we are not using the full power of TypeScript but relying on the coder to secure the code.-->
 虽然编译器相信你在使用<i>as</i>时知道你在做什么，但通过这样做，我们没有使用TypeScript的全部力量，而是依靠编码者来保护代码。

<!-- In our case, we could change how we export our data so we can type it within the data file.-->
 在我们的案例中，我们可以改变导出数据的方式，这样我们就可以在数据文件中输入数据。
<!-- Since we cannot use typings in a JSON file, we should convert the json file to a ts file which exports the typed data like so:-->
 因为我们不能在JSON文件中使用类型，所以我们应该将json文件转换为ts文件，像这样导出类型的数据。

```js
import { DiaryEntry } from "../src/types"; // highlight-line

const diaryEntries: Array<DiaryEntry> = [ // highlight-line
  {
      "id": 1,
      "date": "2017-01-01",
      "weather": "rainy",
      "visibility": "poor",
      "comment": "Pretty scary flight, I'm glad I'm alive"
  },
  // ...
];

export default diaryEntries; // highlight-line
```

<!-- Now, when we import the array, the compiler interprets it correctly and the <i>weather</i> and <i>visibility</i> fields are understood right:-->
 现在，当我们导入数组时，编译器会正确地解释它，并且<i>weather</i>和<i>visibility</i>字段会被正确理解。


```js
import diaries from '../../data/diaries'; // highlight-line

import { DiaryEntry } from '../types';

const getEntries = (): Array<DiaryEntry> => {
  return diaries;
}

const addDiary = () => {
  return null;
}

export default {
  getEntries,
  addDiary
};
```

<!-- Note that, if we want to be able to save entries without a certain field, e.g. <i>comment</i>, we could set the type of the field as [optional](http://www.typescriptlang.org/docs/handbook/interfaces.html#optional-properties) by adding <i>?</i> to the type declaration:-->
 注意，如果我们希望能够保存没有某个字段的条目，例如<i>comment</i>，我们可以通过在类型声明中添加<i>?</i>，将字段的类型设置为[optional](http://www.typescriptlang.org/docs/handbook/interfaces.html#optional-properties)。

```js
export interface DiaryEntry {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment?: string; // highlight-line
}
```

### Node and JSON modules

<!-- It is important to take note of a problem that may arise when using the tsconfig [resolveJsonModule](https://www.typescriptlang.org/en/tsconfig#resolveJsonModule) option:-->
 需要注意的是，在使用tsconfig [resolveJsonModule](https://www.typescriptlang.org/en/tsconfig#resolveJsonModule)选项时，可能出现一个问题。

```json
{
  "compilerOptions": {
    // ...
    "resolveJsonModule": true // highlight-line
  }
}
```

<!-- According to the node documentation for [file modules](https://nodejs.org/api/modules.html#modules_file_modules),-->
 根据node文档中的[file modules](https://nodejs.org/api/modules.html#modules_file_modules)。
<!-- node will try to resolve modules in order of extensions:-->
 node将尝试按照扩展的顺序来解决模块。

```shell
 ["js", "json", "node"]
```

<!-- In addition to that, by default, <i>ts-node</i> and <i>ts-node-dev</i> extend the list of possible node module extensions to:-->
 除此之外，默认情况下，<i>ts-node</i>和<i>ts-node-dev</i>将可能的节点模块扩展列表扩展为。

```shell
 ["js", "json", "node", "ts", "tsx"]
```

<!-- > **NB**: The validity of <i>.js</i>, <i>.json</i> and <i>.node</i> files as modules in TypeScript depend on environment configuration, including <i>tsconfig</i> options such as <i>allowJs</i> and <i>resolveJsonModule</i>.-->
 > **NB**:<i>.js</i>、<i>.json</i>和<i>.node</i>文件作为TypeScript中的模块的有效性取决于环境配置，包括<i>tsconfig</i>选项，例如<i>allowJs</i>和<i>resolveJsonModule</i>。

<!-- Consider a flat folder structure containing files:-->
 考虑一个包含文件的平面文件夹结构。

```shell
  ├── myModule.json
  └── myModule.ts
```

<!-- In TypeScript, with the <i>resolveJsonModule</i> option set to true, the file <i>myModule.json</i> becomes a valid node module. Now, imagine a scenario where we wish to take the file <i>myModule.ts</i> into use:-->
 在TypeScript中，当<i>resolveJsonModule</i>选项设置为true时，文件<i>myModule.json</i>成为有效的节点模块。现在，设想一个场景，我们希望将文件<i>myModule.ts</i>投入使用。

```js
import myModule from "./myModule";
```

<!-- Looking closely at the order of node module extensions:-->
 仔细看一下节点模块的扩展顺序。

```shell
 ["js", "json", "node", "ts", "tsx"]
```

<!-- We notice that the <i>.json</i> file extension takes precedence over <i>.ts</i> and so <i>myModule.json</i> will be imported and not <i>myModule.ts</i>.-->
 我们注意到<i>.json</i>文件扩展名优先于<i>.ts</i>，所以<i>myModule.json</i>将被导入而不是<i>myModule.ts</i>。

<!-- In order to avoid time-eating bugs, it is recommended that within a flat directory, each file with a valid node module extension has a unique filename.-->
 为了避免吃时间的错误，建议在一个平面目录中，每个具有有效节点模块扩展名的文件都有一个唯一的文件名。

### Utility Types

<!-- Sometimes, we might want to use a specific modification of a type.-->
 有时，我们可能想使用一种类型的特定修改。
<!-- For example, consider a page for listing some data, some of which is sensitive and some of which is non-sensitive.-->
 例如，考虑一个用于列出一些数据的页面，其中一些是敏感的，一些是不敏感的。
<!-- We might want to be sure that no sensitive data is used or displayed. We could <i>pick</i> the fields of a type we allow to be used to enforce this.-->
 我们可能想确保没有敏感数据被使用或显示。我们可以<i>挑选</i>我们允许使用的类型的字段来执行这一点。
<!-- We can do that by using the utility type [Pick](http://www.typescriptlang.org/docs/handbook/utility-types.html#picktk).-->
 我们可以通过使用实用类型[Pick](http://www.typescriptlang.org/docs/handbook/utility-types.html#picktk)来做到这一点。

<!-- In our project, we should consider that Ilari might want to create a listing of all his diary entries <i>excluding</i> the comment field since, during a very scary flight, he might end up writing something he wouldn't necessarily want to show anyone else.-->
 在我们的项目中，我们应该考虑到Ilari可能想创建一个他所有日记条目的列表，<i>不包括</i>评论字段，因为在一次非常可怕的飞行中，他可能最终写了一些他不一定想给其他人看的东西。

<!-- The [Pick](http://www.typescriptlang.org/docs/handbook/utility-types.html#picktk) utility type allows us to choose which fields of an existing type we want to use.-->
 [Pick](http://www.typescriptlang.org/docs/handbook/utility-types.html#picktk)实用类型允许我们选择我们想使用的现有类型的哪些字段。
<!-- Pick can be used to either construct a completely new type, or to inform a function what it should return on runtime.-->
 Pick可以用来构建一个全新的类型，也可以用来通知一个函数在运行时应该返回什么。
<!-- Utility types are a special kind of type tools, but they can be used just like regular types.-->
 实用类型是一种特殊的类型工具，但它们可以像普通类型一样使用。

<!-- In our case, in order to create a "censored" version of the  <i>DiaryEntry</i> for public displays, we can use Pick in the function declaration:-->
 在我们的例子中，为了创建一个用于公开展示的<i>DiaryEntry</i>的 "审查 "版本，我们可以在函数声明中使用Pick。

```js
const getNonSensitiveEntries =
  (): Array<Pick<DiaryEntry, 'id' | 'date' | 'weather' | 'visibility'>> => {
    // ...
  }
```

<!-- and the compiler would expect the function to return an array of values of the modified DiaryEntry type, which include only the four selected fields.-->
而编译器将期望该函数返回一个修改后的DiaryEntry类型的值数组，其中只包括四个选定的字段。

<!-- Since [Pick](http://www.typescriptlang.org/docs/handbook/utility-types.html#picktk) requires the type it modifies to be given as a [type variable](http://www.typescriptlang.org/docs/handbook/generics.html#working-with-generic-type-variables), just like Array does, we now have two nested type variables and the syntax is starting to look a bit odd.-->
 由于[Pick](http://www.typescriptlang.org/docs/handbook/utility-types.html#picktk)要求它所修改的类型作为[类型变量](http://www.typescriptlang.org/docs/handbook/generics.html#working-with-generic-type-variables)给出，就像Array一样，我们现在有两个嵌套的类型变量，语法开始变得有点奇怪了。
<!-- We can improve the code's readability by using the [alternative](http://www.typescriptlang.org/docs/handbook/basic-types.html#array) array syntax:-->
 我们可以通过使用[替代](http://www.typescriptlang.org/docs/handbook/basic-types.html#array) 数组语法来提高代码的可读性。

```js
const getNonSensitiveEntries =
  (): Pick<DiaryEntry, 'id' | 'date' | 'weather' | 'visibility'>[] => {
    // ...
  }
```

<!-- In this case, we want to exclude only one field,-->
 在这种情况下，我们只想排除一个字段。
<!-- so it would be even better to use the [Omit](http://www.typescriptlang.org/docs/handbook/utility-types.html#omittk) utility type, which we can use to declare which fields to exclude:-->
 所以使用[Omit](http://www.typescriptlang.org/docs/handbook/utility-types.html#omittk)工具类型会更好，我们可以用它来声明要排除哪些字段。

```js
const getNonSensitiveEntries = (): Omit<DiaryEntry, 'comment'>[] => {
  // ...
}
```
<!--  Another way would be to declare a completely new type for the <i>NonSensitiveDiaryEntry</i>:-->
 另一种方法是为<i>NonSensitiveDiaryEntry</i>声明一个全新的类型。

```js
export type NonSensitiveDiaryEntry = Omit<DiaryEntry, 'comment'>;
```

<!-- The code now becomes:-->
 现在的代码变成了。

```js
import diaries from '../../data/diaries';
import { NonSensitiveDiaryEntry, DiaryEntry } from '../types'; // highlight-line

const getEntries = (): DiaryEntry[] => {
  return diaries;
};

const getNonSensitiveEntries = (): NonSensitiveDiaryEntry[] => { // highlight-line
  return diaries;
};

const addDiary = () => {
  return null;
};

export default {
  getEntries,
  addDiary,
  getNonSensitiveEntries // highlight-line
};
```

<!-- One thing in our application is a cause for concern. In <i>getNonSensitiveEntries</i>, we are returning the complete diary entries, and <i>no error is given</i> despite typing!-->
 在我们的应用中，有一件事是值得关注的。在<i>getNonSensitiveEntries</i>中，我们正在返回完整的日记条目，而且<i>没有给出错误</i>，尽管输入了!

<!-- This happens because [TypeScript only checks](http://www.typescriptlang.org/docs/handbook/type-compatibility.html) whether we have all of the required fields or not, but excess fields are not prohibited. In our case, this means that it is <i>not prohibited</i> to return an object of type <i>DiaryEntry[]</i>, but if we were to try to access the <i>comment</i> field, it would not be possible because we would be accessing a field that TypeScript is unaware of even though it exists.-->
发生这种情况是因为[TypeScript只检查](http://www.typescriptlang.org/docs/handbook/type-compatibility.html)我们是否有所有需要的字段，但多余的字段不被禁止。在我们的例子中，这意味着返回一个<i>DiaryEntry[]</i>类型的对象是<i>不禁止的</i>，但是如果我们试图访问<i>comment</i>字段，这将是不可能的，因为我们将访问一个TypeScript不知道的字段，即使它存在。

<!-- Unfortunately, this can lead to unwanted behaviour if you are not aware of what you are doing; the situation is valid as far as TypeScript is concerned, but you are most likely allowing use that is not wanted.-->
 不幸的是，如果你不知道你在做什么，这可能会导致不必要的行为；就TypeScript而言，这种情况是有效的，但你很可能允许使用不想要的东西。
<!-- If we were now to return all of the diaryEntries from the <i>getNonSensitiveEntries</i> function to the <i>frontend</i>, we would actually be leaking the unwanted fields to the requesting browser even though our types seem to imply otherwise!-->
 如果我们现在从<i>getNonSensitiveEntries</i>函数中返回所有的diaryEntries到<i>frontend</i>，我们实际上会将不需要的字段泄露给请求的浏览器，尽管我们的类型似乎暗示了这一点

<!-- Because TypeScript doesn't modify the actual data but only its type, we need to exclude the fields ourselves:-->
 因为TypeScript并不修改实际数据，而只是修改其类型，所以我们需要自己排除这些字段。

```js
import diaries from '../../data/entries.ts'

import { NonSensitiveDiaryEntry, DiaryEntry } from '../types'

const getEntries = () : DiaryEntry[] => {
  return diaries
}

// highlight-start
const getNonSensitiveEntries = (): NonSensitiveDiaryEntry[] => {
  return diaries.map(({ id, date, weather, visibility }) => ({
    id,
    date,
    weather,
    visibility,
  }));
};
// highlight-end

const addDiary = () => {
  return []
}

export default {
  getEntries,
  getNonSensitiveEntries,
  addDiary
}
```

<!-- If we now try to return this data with the basic <i>DiaryEntry</i> type, i.e. if we type the function as follows:-->
 如果我们现在尝试用基本的<i>DiaryEntry</i>类型来返回这些数据，也就是说，如果我们按以下方式输入函数。


```js
const getNonSensitiveEntries = (): DiaryEntry[] => {
```

<!-- we would get the following error:-->
 我们会得到以下错误。

![](../../images/9/22b.png)

<!-- Again, the last line of the error message is the most helpful one. Let's undo this undesired modification.-->
 同样，错误信息的最后一行是最有帮助的一行。让我们撤销这个不受欢迎的修改。

<!-- Utility types include many handy tools, and it is definitely worth it to take some time to study [the documentation](https://www.typescriptlang.org/docs/handbook/utility-types.html).-->
 实用程序类型包括许多方便的工具，花点时间研究一下[文档](https://www.typescriptlang.org/docs/handbook/utility-types.html)是绝对值得的。

<!-- Finally, we can complete the route which returns all diary entries:-->
 最后，我们可以完成返回所有日记条目的路线。

```js
import express from 'express';
import diaryService from '../services/diaryService';  // highlight-line

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(diaryService.getNonSensitiveEntries()); // highlight-line
});

router.post('/', (_req, res) => {
    res.send('Saving a diary!');
});

export default router;
```

<!-- The response is what we expect it to be:-->
 响应是我们所期望的那样。

![](../../images/9/26.png)

</div>

<div class="tasks">

### Exercises 9.10.-9.11.

<!-- Similarly to Ilari's flight service, we do not use a real database in our app but instead use hardcoded data that is in the files [diagnoses.json](https://github.com/fullstack-hy/misc/blob/master/diagnoses.json) and [patients.json](https://github.com/fullstack-hy/misc/blob/master/patients.json). Get the files and store those in a directory called <i>data</i> in your project. All data modification can be done in runtime memory, so during this part it is <i>not necessary to write to a file</i>.-->
 与Ilari's航班服务类似，我们在应用中不使用真正的数据库，而是使用硬编码数据，这些数据在文件[diagnoses.json](https://github.com/fullstack-hy/misc/blob/master/diagnoses.json)和[patient.json](https://github.com/fullstack-hy/misc/blob/master/patients.json)中。获取这些文件并将其存储在你的项目中一个名为<i>data</i>的目录中。所有的数据修改都可以在运行时内存中完成，所以在这一部分中，<i>不需要写到文件中</i>。

#### 9.10: Patientor backend, step3

<!-- Create a type <i>Diagnose</i> and use it to create endpoint <i>/api/diagnoses</i> for fetching all diagnoses with HTTP GET.-->
 创建一个类型<i>Diagnose</i>，并使用它来创建端点<i>/api/diagnoses</i>，以便通过HTTP GET获取所有诊断结果。

<!-- Structure your code properly by using meaningfully-named directories and files.-->
 通过使用有意义的命名的目录和文件来正确组织你的代码。

<!-- **Note** that <i>diagnoses</i> may or may not contain the field <i>latin</i>. You might want to use [optional properties](https://www.typescriptlang.org/docs/handbook/interfaces.html#optional-properties) in the type definition.-->
 **注意**，<i>diagnoses</i>可能包含也可能不包含<i>latin</i>字段。你可能想在类型定义中使用[可选属性](https://www.typescriptlang.org/docs/handbook/interfaces.html#optional-properties)。

#### 9.11: Patientor backend, step4

<!-- Create data type <i>Patient</i> and set up the GET endpoint <i>/api/patients</i> which returns all patients to the frontend, excluding field <i>ssn</i>. Use a [utility type](https://www.typescriptlang.org/docs/handbook/utility-types.html) to make sure you are selecting and returning only the wanted fields.-->
 创建数据类型<i>Patient</i>，并设置GET端点<i>/api/patients</i>，该端点向前端返回所有患者，不包括字段<i>ssn</i>。使用[实用类型](https://www.typescriptlang.org/docs/handbook/utility-types.html)来确保你只选择和返回想要的字段。

<!-- In this exercise, you may assume that field <i>gender</i> has type <i>string</i>.-->
 在这个练习中，你可以假设字段<i>gender</i>的类型为<i>string</i>。

<!-- Try the endpoint with your browser and ensure that <i>ssn</i> is not included in the response:-->
 用你的浏览器试试这个端点，确保<i>ssn</i>不包括在响应中。

![](../../images/9/22g.png)

<!-- After creating the endpoint, ensure that the <i>frontend</i> shows the list of patients:-->
 创建端点后，确保<i>前端</i>显示病人名单。

![](../../images/9/22h.png)

</div>

<div class="content">

### Preventing an accidental undefined result

<!-- Let's extend the backend to support fetching one specific entry with an HTTP GET request to route <i>api/diaries/:id</i>.-->
 让我们扩展后端，以支持通过HTTP GET请求来获取一个特定的条目，路由<i>api/diaries/:id</i>。

<!-- The DiaryService needs to be extended with a <i>findById</i> function:-->
 DiaryService需要扩展一个<i>findById</i>函数。

```js
// ...

// highlight-start
const findById = (id: number): DiaryEntry => {
  const entry = diaries.find(d => d.id === id);
  return entry;
};
// highlight-end

export default {
  getEntries,
  getNonSensitiveEntries,
  addDiary,
  findById // highlight-line
}
```

<!-- But once again, a new problem emerges:-->
 但是又一次出现了一个新的问题。

![](../../images/9/23e.png)

<!-- The issue is that there is no guarantee that an entry with the specified id can be found.-->
 问题是不能保证能找到一个指定id的条目。
<!-- It is good that we are made aware of this potential problem already at compile phase. Without TypeScript, we would not be warned about this problem, and in the worst case scenario, we could have ended up returning an <i>undefined</i> object instead of informing the user about the specified entry not being found.-->
 很好，我们在编译阶段就已经意识到了这个潜在的问题。如果没有TypeScript，我们就不会被警告这个问题，在最坏的情况下，我们最终可能会返回一个<i>undefined</i>对象，而不是通知用户指定的条目没有被找到。

<!-- First of all, in cases like this, we need to decide what the <i>return value</i> should be if an object is not found, and how the case should be handled.-->
 首先，在这样的情况下，我们需要决定如果没有找到一个对象，<i>返回值</i>应该是什么，以及如何处理这种情况。
<!-- The <i>find</i> method of an array returns <i>undefined</i> if the object is not found, and this is actually fine with us.-->
 如果没有找到对象，数组的<i>find</i>方法会返回<i>undefined</i>，而这对我们来说其实是没有问题的。
<!-- We can solve our problem by typing the return value as follows:-->
 我们可以通过输入如下的返回值来解决我们的问题。

```js
const findById = (id: number): DiaryEntry | undefined => { // highlight-line
  const entry = diaries.find(d => d.id === id);
  return entry;
}
```

<!-- The route handler is the following:-->
 路线处理程序如下。

```js
import express from 'express';
import diaryService from '../services/diaryService'

router.get('/:id', (req, res) => {
  const diary = diaryService.findById(Number(req.params.id));

  if (diary) {
    res.send(diary);
  } else {
    res.sendStatus(404);
  }
});

// ...

export default router;
```

### Adding a new diary

<!-- Let's start building the HTTP POST endpoint for adding new flight diary entries.-->
 我们开始建立HTTP POST端点，用于添加新的飞行日记条目。
<!-- The new entries should have the same type as the existing data.-->
 新条目的类型应该与现有数据相同。

<!-- The code handling of the response looks as follows:-->
 响应的代码处理看起来如下。

```js
router.post('/', (req, res) => {
  const { date, weather, visibility, comment } = req.body;
  const newDiaryEntry = diaryService.addDiary(
    date,
    weather,
    visibility,
    comment,
  );
  res.json(newDiaryEntry);
});
```

<!-- The corresponding method in <i>diaryService</i> looks like this:-->
 <i>diaryService</i>中的相应方法如下所示：

```js
import {
  NonSensitiveDiaryEntry,
  DiaryEntry,
  Visibility, // highlight-line
  Weather // highlight-line
} from '../types';


const addDiary = (
    date: string, weather: Weather, visibility: Visibility, comment: string
  ): DiaryEntry => {

  const newDiaryEntry = {
    id: Math.max(...diaries.map(d => d.id)) + 1,
    date,
    weather,
    visibility,
    comment,
  }

  diaries.push(newDiaryEntry);
  return newDiaryEntry;
};
```

<!-- As you can see, the <i>addDiary</i> function is becoming quite hard to read now that we have all the fields as separate parameters.-->
 正如你所看到的，<i>addDiary</i>函数现在变得相当难读，因为我们把所有字段都作为单独的参数。
<!-- It might be better to just send the data as an object to the function:-->
 把数据作为一个对象发送到函数中可能会更好。

```js
router.post('/', (req, res) => {
  const { date, weather, visibility, comment } = req.body;
  const newDiaryEntry = diaryService.addDiary({ // highlight-line
    date,
    weather,
    visibility,
    comment,
  }); // highlight-line
  res.json(newDiaryEntry);
})
```

<!-- But wait, what is the type of this object? It is not exactly a <i>DiaryEntry</i>, since it is still missing the <i>id</i> field.-->
 但是等等，这个对象的类型是什么？它不完全是一个<i>DiaryEntry</i>，因为它仍然缺少<i>id</i>字段。
<!-- It could be useful to create a new type, <i>NewDiaryEntry</i>, for an entry that hasn't been saved yet.-->
 为尚未保存的条目创建一个新的类型，<i>NewDiaryEntry</i>，可能很有用。
<!-- Let's create that in <i>types.ts</i> using the existing <i>DiaryEntry</i> type and the [Omit](http://www.typescriptlang.org/docs/handbook/utility-types.html#omittk) utility type:-->
 让我们在<i>types.ts</i>中使用现有的<i>DiaryEntry</i>类型和[Omit](http://www.typescriptlang.org/docs/handbook/utility-types.html#omittk)实用类型创建它。

```js
export type NewDiaryEntry = Omit<DiaryEntry, 'id'>;
```

<!-- Now we can use the new type in our DiaryService,-->
 现在我们可以在我们的DiaryService中使用这个新类型。
<!-- and destructure the new entry object when creating an entry to be saved:-->
 并在创建要保存的条目时对新的条目对象进行结构化。

```js
import { NewDiaryEntry, NonSensitiveDiaryEntry, DiaryEntry } from '../types'; // highlight-line

// ...

const addDiary = ( entry: NewDiaryEntry ): DiaryEntry => {  // highlight-line
  const newDiaryEntry = {
    id: Math.max(...diaries.map(d => d.id)) + 1,
    ...entry // highlight-line
  };

  diaries.push(newDiaryEntry);
  return newDiaryEntry;
};
```

<!-- Now the code looks much cleaner!-->
 现在，代码看起来干净多了

<!-- There is still a complaint from our code:-->
 我们的代码中仍有一个产生警告。

![](../../images/9/43.png)

<!-- The cause is the eslint rule [@typescript-eslint/no-unsafe-assignment](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unsafe-assignment.md) that prevents us from assigning the fields of a request body to variables.-->
 原因是eslint规则[@typescript-eslint/no-unsafe-assignment](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unsafe-assignment.md)阻止我们将请求体的字段分配给变量。

<!-- For the time being, let us just ignore the eslint-rule from the whole file by adding the following as the first line of the file:-->
 目前，让我们忽略整个文件中的eslint规则，在文件的第一行加入以下内容。

``` js
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
```

<!-- In order to parse the incoming data we must have the <i>json</i> middleware configured:-->
 为了解析传入的数据，我们必须配置<i>json</i>中间件。


``` js
import express from 'express';
import diaryRouter from './routes/diaries';
const app = express();
app.use(express.json()); // highlight-line

const PORT = 3000;

app.use('/api/diaries', diaryRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

<!-- Now the application is ready to receive HTTP POST requests for new diary entries of the correct type!-->
 现在，应用已经准备好接收HTTP POST请求，以获取正确类型的新日记条目

### Proofing requests

<!-- There are plenty of things that can go wrong when we accept data from outside sources.-->
 当我们接受来自外部的数据时，有很多事情会出错。
<!-- Applications rarely work completely on their own, and we are forced to live with the fact that data from sources outside of our system cannot be fully trusted.-->
 应用很少能完全独立工作，我们不得不接受这样一个事实：来自我们系统外的数据不能被完全信任。
<!-- When we receive data from an outside source, there is no way it can already be typed when we receive it. We need to make decisions on how to handle the uncertainty that comes with this.-->
当我们从外部来源接收数据时，不可能在我们收到数据时已经打好了。我们需要做出决定，如何处理由此带来的不确定性。

<!-- The disabled eslint rule was actually giving us a hint that the following assignment is a risky one:-->
 被禁用的eslint规则实际上在给我们一个提示，即下面的赋值是一个有风险的。

```js
const newDiaryEntry = diaryService.addDiary({
  date,
  weather,
  visibility,
  comment,
});
```

<!-- We certainly would like to have certainty that the object in a post request is of the right type, so let us define a function <i>toNewDiaryEntry</i> that receives the request body as a parameter and returns a properly-typed <i>NewDiaryEntry</i> object. The function shall be defined in the file <i>utils.ts</i>.-->
 我们当然希望能确定post请求中的对象是正确的类型，所以让我们定义一个函数<i>toNewDiaryEntry</i>，接收请求体作为参数并返回一个正确类型的<i>NewDiaryEntry</i>对象。该函数应在文件<i>utils.ts</i>中定义。

<!-- The route definition uses the function as follows:-->
 路由定义使用该函数，如下所示。

```js
import toNewDiaryEntry from '../utils'; // highlight-line

// ...

router.post('/', (req, res) => {
  try {
    const newDiaryEntry = toNewDiaryEntry(req.body); // highlight-line

    const addedEntry = diaryService.addDiary(newDiaryEntry); // highlight-line
    res.json(addedEntry);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
})
```

<!-- We can now also remove the first line that ignores the eslint rule <i>no-unsafe-assignment</i>.-->
 我们现在也可以删除第一行，它忽略了eslint规则<i>no-unsafe-assignment</i>。

<!-- Since we are now writing secure code and trying to ensure that we are getting exactly the data we want from the requests, we should get started with parsing and validating each field we are expecting to receive.-->
 由于我们现在正在编写安全代码，并试图确保我们从请求中准确地获得我们想要的数据，我们应该开始解析和验证我们期望收到的每个字段。

<!-- The skeleton of the function <i>toNewDiaryEntry</i> looks like the following:-->
 函数<i>toNewDiaryEntry</i>的骨架看起来如下。

```js
import { NewDiaryEntry } from './types';

const toNewDiaryEntry = (object): NewDiaryEntry => {
  const newEntry: NewDiaryEntry = {
    // ...
  };

  return newEntry;
};

export default toNewDiaryEntry;
```

<!-- The function should parse each field and make sure that the return value is exactly of type <i>NewDiaryEntry</i>. This means we should check each field separately.-->
 该函数应该解析每个字段，并确保返回值正好是<i>NewDiaryEntry</i>类型。这意味着我们应该分别检查每个字段。

<!-- Once again, we have a type issue: what is the <i>object</i> type? Since the <i>object</i> is in fact the body of a request, Express has typed it as <i>any</i>. Since the idea of this function is to map fields of unknown type to fields of the correct type and check whether they are defined as expected, this might be the rare case where we actually <i>want to allow the <i>any</i> type</i>.-->
 我们再次遇到一个类型问题：什么是<i>object</i>类型？由于<i>object</i>实际上是一个请求的主体，Express将它打成了<i>any</i>。由于这个函数的想法是将未知类型的字段映射到正确类型的字段，并检查它们是否按预期定义，这可能是我们实际上<i>想要允许<i>any</i>类型</i>的罕见情况。

<!-- However, if we type the object as <i>any</i>, eslint gives us two complaints:-->
 然而，如果我们将对象输入为<i>any</i>，eslint会给我们两个投诉。

![](../../images/9/44.png)

<!-- We could ignore these rules but a better idea is to follow the advice the editor gives in the <i>Quick Fix</i> and set the parameter type to unknown:-->
 我们可以忽略这些规则，但更好的办法是遵循编辑器在<i>Quick Fix</i>中给出的建议，将参数类型设置为未知。

```js
import { NewDiaryEntry } from './types';

const toNewDiaryEntry = (object: unknown): NewDiaryEntry => { // highlight-line
  const newEntry: NewDiaryEntry = {
    // ...
  }

  return newEntry;
}

export default toNewDiaryEntry;
```

<!-- [unknown](https://www.typescriptlang.org/docs/handbook/2/functions.html#unknown) is the ideal type for our kind of situation of input validation, since we don't yet need to define the type to match <i>any</i> type, but can first verify the type and then confirm the expected type. With the use of <i>unknown</i>, we also don't need to worry about the <i>@typescript-eslint/no-explicit-any</i> eslint rule, since we are not using <i>any</i>. However, we might still need to use <i>any</i> in some cases where we are not yet sure about the type and need to access properties of an <i>any</i> object in order to validate or type check the property values themselves.-->
 [unknown](https://www.typescriptlang.org/docs/handbook/2/functions.html#unknown)是我们这种输入验证情况的理想类型，因为我们还不需要定义类型来匹配<i>任何</i>类型，而是可以先验证类型，然后确认预期类型。通过使用<i>unknown</i>，我们也不需要担心<i>@typescript-eslint/no-explicit-any</i> eslint规则，因为我们没有使用<i>any</i>。然而，在某些情况下，我们可能仍然需要使用<i>any</i>，因为我们还不确定类型，需要访问<i>any</i>对象的属性，以便验证或类型检查属性值本身。

<!-- Let us start creating the parsers for each of the fields of <i>object</i>.-->
 让我们开始为<i>object</i>的每个字段创建解析器。

<!-- To validate the <i>comment</i> field, we need to check that it exists, and to ensure that it is of the type <i>string</i>.-->
 为了验证<i>comment</i>字段，我们需要检查它是否存在，并确保它的类型是<i>string</i>。


<!-- The function should look something like this:-->
 这个函数应该如下所示：

```js
const parseComment = (comment: unknown): string => {
  if (!comment || !isString(comment)) {
    throw new Error('Incorrect or missing comment');
  }

  return comment;
};
```

<!-- The function gets a parameter of type <i>unknown</i> and returns it as type <i>string</i> if it exists and is of the right type.-->
 该函数得到一个类型为<i>unknown</i>的参数，如果它存在并且是正确的类型，则将其作为<i>string</i>类型返回。

<!-- The string validation function looks like this:-->
 字符串验证函数如下所示：

```js
const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};
```

<!-- The function is a so-called [type guard](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates). That means it is a function which returns a boolean <i>and</i> which has a <i>type predicate</i> as the return type. In our case, the type predicate is:-->
 该函数是一个所谓的[类型保护](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)。这意味着它是一个返回布尔值<i>和</i>的函数，它有一个<i>类型谓词</i>作为返回类型。在我们的例子中，类型谓词是。

```js
text is string
```

<!-- The general form of a type predicate is _parameterName is Type_ where the _parameterName_ is the name of the function parameter and _Type_ is the targeted type.-->
 类型谓词的一般形式是_parameterName is Type_，其中_parameterName_是函数参数的名称，_Type_是目标类型。

<!-- If the type guard function returns true, the TypeScript compiler knows that the tested variable has the type that was defined in the type predicate.-->
 如果类型保护函数返回真，TypeScript编译器就知道被测试的变量具有在类型谓词中定义的类型。

<!-- Before the type guard is called, the actual type of the variable <i>comment</i> is not known:-->
 在调用类型保护之前，变量<i>comment</i>的实际类型是不知道的。

![](../../images/9/28e-21.png)

<!-- But after the call, if the code proceeds past the exception (that is, the type guard returned true), then the compiler knows that <i>comment</i> is of type <i>string</i>:-->
 但是在调用之后，如果代码经过了异常（即类型保护返回真），那么编译器就知道<i>comment</i>是<i>string</i>类型。

![](../../images/9/29e-21.png)

<!-- Why do we have two conditions in the string type guard?-->
 为什么我们在字符串类型保护中要有两个条件？

```js
const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String; // highlight-line
}
```

<!-- Would it not be enough to write the guard like this?-->
 像这样写防护措施还不够吗？

```js
const isString = (text: unknown): text is string => {
  return typeof text === 'string';
}
```

<!-- Most likely, the simpler form is good enough for all practical purposes.-->
 最有可能的是，较简单的形式对于所有的实际目的来说已经足够好了。
<!-- However, if we want to be absolutely sure, both conditions are needed.-->
 然而，如果我们想绝对确定，两个条件都需要。
<!-- There are two different ways to create string objects in JavaScript which both work a bit differently with respect to the <i>typeof</i> and <i>instanceof</i> operators:-->
 在JavaScript中，有两种不同的方法来创建字符串对象，这两种方法在<i>typeof</i>和<i>instanceof</i>操作符方面的工作方式有点不同。

```js
const a = "I'm a string primitive";
const b = new String("I'm a String Object");
typeof a; --> returns 'string'
typeof b; --> returns 'object'
a instanceof String; --> returns false
b instanceof String; --> returns true
```

<!-- However, it is unlikely that anyone would create a string with a constructor function.-->
 然而，不太可能有人会用构造函数来创建一个字符串。
<!-- Most likely the simpler version of the type guard would be just fine.-->
 最有可能的是，类型保护的简单版本就可以了。

<!-- Next, let's consider the <i>date</i> field.-->
 接下来，让我们考虑一下<i>date</i>字段。
<!-- Parsing and validating the date object is pretty similar to what we did with comments.-->
 解析和验证日期对象与我们对注释所做的相当相似。
<!-- Since TypeScript doesn't really know a type for a date, we need to treat it as a <i>string</i>.-->
 由于TypeScript并不真正知道日期的类型，我们需要把它当作一个<i>字符串</i>。
<!-- We should however still use JavaScript-level validation to check whether the date format is acceptable.-->
 但是我们仍然应该使用JavaScript级别的验证来检查日期格式是否可以接受。

<!-- We will add the following functions:-->
 我们将添加以下函数。

```js
const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
      throw new Error('Incorrect or missing date: ' + date);
  }
  return date;
};
```

<!-- The code is really nothing special. The only thing is that we can't use a type guard here since a date in this case is only considered to be a <i>string</i>.-->
 这些代码其实没什么特别的。唯一的一点是，我们不能在这里使用类型保护，因为在这种情况下，日期只被认为是一个<i>字符串</i>。
<!-- Note that even though the <i>parseDate</i> function accepts the <i>date</i> variable as unknown, after we check the type with <i>isString</i>, then its type is set as string, which is why we can give the variable to the <i>isDate</i> function requiring a string without any problems.-->
 注意，即使<i>parseDate</i>函数接受<i>date</i>变量为未知数，在我们用<i>isString</i>检查类型后，它的类型被设置为字符串，这就是为什么我们可以把变量交给<i>isDate</i>函数，要求它是一个字符串而没有任何问题。

<!-- Finally we are ready to move on to the last two types, Weather and Visibility.-->
 最后我们准备进入最后两种类型，即天气和可见度。

<!-- We would like the validation and parsing to work as follows:-->
 我们希望验证和解析的工作方式如下。

```js
const parseWeather = (weather: unknown): Weather => {
  if (!weather || !isString(weather) || !isWeather(weather)) {
      throw new Error('Incorrect or missing weather: ' + weather);
  }
  return weather;
};
```

<!-- The question is: how can we validate that the string is of a specific form?-->
 问题是：我们怎样才能验证字符串是特定形式的？
<!-- One possible way to write the type guard would be this:-->
 一种可能的写类型保护的方法是这样的。

```js
const isWeather = (str: string): str is Weather => {
  return ['sunny', 'rainy', 'cloudy', 'stormy'].includes(str);
};
```

<!-- This would work just fine, but the problem is that the list of possible values for Weather does not necessarily stay in sync with the type definitions if the type is altered.-->
 这样做就可以了，但问题是，如果类型被改变，Weather的可能值列表不一定与类型定义保持同步。
<!-- This is most certainly not good, since we would like to have just one source for all possible weather types.-->
 这肯定不是好事，因为我们希望所有可能的天气类型都有一个来源。

<!-- In our case, a better solution would be to improve the actual Weather type. Instead of a type alias we should use the TypeScript [enum](https://www.typescriptlang.org/docs/handbook/enums.html), which allows us to use the actual values in our code at runtime, not only in the compilation phase.-->
 在我们的例子中，一个更好的解决方案是改进实际的天气类型。我们应该使用TypeScript的[枚举](https://www.typescriptlang.org/docs/handbook/enums.html)，而不是类型别名，这允许我们在运行时在我们的代码中使用实际值，而不仅仅是在编译阶段。

<!-- Let us redefine the type <i>Weather</i> as follows:-->
 让我们重新定义类型<i>Weather</i>如下。

```js
export enum Weather {
  Sunny = 'sunny',
  Rainy = 'rainy',
  Cloudy = 'cloudy',
  Stormy = 'stormy',
  Windy = 'windy',
}
```

<!-- Now we can check that a string is one of the accepted values, and the type guard can be written like this:-->
 现在我们可以检查一个字符串是否是可接受的值之一，类型保护可以这样写。

```js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isWeather = (param: any): param is Weather => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(Weather).includes(param);
};
```

<!-- One thing to notice here is that we have changed the parameter type to <i>any</i>. If it were string, the <i>includes</i> check would not compile. This makes sense also if you consider the reusability of the function. By allowing <i>any</i> as a parameter, the function can be used with confidence knowing that whatever we might feed to it, the function always tells us whether the variable is a valid weather or not.-->
 这里需要注意的一点是，我们已经把参数类型改为<i>any</i>。如果它是字符串，那么<i>includes</i>检查就不会被编译。如果你考虑到函数的可重用性，这也是有道理的。通过允许<i>any</i>作为参数，这个函数可以被放心地使用，因为无论我们向它输入什么，这个函数总是告诉我们这个变量是否是有效的天气。

<!-- The function <i>parseWeather</i> can be simplified a bit:-->
 函数<i>parseWeather</i>可以简化一些。

```js
const parseWeather = (weather: unknown): Weather => {
  if (!weather || !isWeather(weather)) { // highlight-line
      throw new Error('Incorrect or missing weather: ' + weather);
  }
  return weather;
};
```

<!-- One issue arises after these changes. Our data in file <i>data/diaries.ts</i> does not conform to our types anymore:-->
 在这些改动之后，出现了一个问题。我们在文件<i>data/diaries.ts</i>中的数据不符合我们的类型了。

![](../../images/9/30.png)

<!-- This is because we cannot just assume a string is an enum.-->
 这是因为我们不能只是假设一个字符串是一个枚举。

<!-- We can fix this by mapping the initial data elements to <i>DiaryEntry</i> type with the <i>toNewDiaryEntry</i> function:-->
 我们可以通过使用<i>toNewDiaryEntry</i>函数将初始数据元素映射到<i>DiaryEntry</i>类型来解决这个问题。

```js
import { DiaryEntry } from "../src/types";
import toNewDiaryEntry from "../src/utils";

const data = [
  {
      "id": 1,
      "date": "2017-01-01",
      "weather": "rainy",
      "visibility": "poor",
      "comment": "Pretty scary flight, I'm glad I'm alive"
  },
  // ...
]

const diaryEntries: DiaryEntry [] = data.map(obj => {
  const object = toNewDiaryEntry(obj) as DiaryEntry;
  object.id = obj.id;
  return object;
});

export default diaryEntries;
```
<!-- Note that since <i>toNewDiaryEntry</i> returns an object of type <i>NewDiaryEntry</i>, we need to assert it to be <i>DiaryEntry</i> with the [as](http://www.typescriptlang.org/docs/handbook/basic-types.html#type-assertions) operator.-->
 注意，由于<i>toNewDiaryEntry</i>返回一个<i>NewDiaryEntry</i>类型的对象，我们需要用[as](http://www.typescriptlang.org/docs/handbook/basic-types.html#type-assertions)操作符断言它是<i>DiaryEntry</i>。


<!-- Enums are typically used when there is a set of predetermined values that are not expected to change in the future. Usually enums are used for much tighter unchanging values (for example, weekdays, months, cardinal directions), but since they offer us a great way to validate our incoming values, we might as well use them in our case.-->
 枚举通常用于有一组预先确定的值的情况下，预计在未来不会改变。通常枚举用于更严格的不变的值（例如，工作日、月份、红心方向），但由于它们为我们提供了一个验证传入值的好方法，我们不妨在我们的案例中使用它们。

<!-- We still need to give the same treatment to <i>visibility</i>. The enum looks as follows:-->
 我们仍然需要对<i>visibility</i>给予同样的处理。该枚举看起来如下。

```js
export enum Visibility {
  Great = 'great',
  Good = 'good',
  Ok = 'ok',
  Poor = 'poor',
}
```

<!-- The type guard and the parser are below:-->
 下面是类型保护和解析器。

```js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isVisibility = (param: any): param is Visibility => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(Visibility).includes(param);
};

const parseVisibility = (visibility: unknown): Visibility => {
  if (!visibility || !isVisibility(visibility)) {
      throw new Error('Incorrect or missing visibility: ' + visibility);
  }
  return visibility;
};
```

<!-- And finally, we can finalize the  <i>toNewDiaryEntry</i> function that takes care of validating and parsing the fields of the post data. There is however one more thing to take care of. If we try to access the fields of the parameter <i>object</i> as follows:-->
 最后，我们可以敲定<i>toNewDiaryEntry</i>函数，它负责验证和解析帖子数据的字段。不过，还有一件事需要注意。如果我们试图访问参数<i>object</i>的字段，如下。

```js
const toNewDiaryEntry = (object: unknown): NewDiaryEntry => {
  const newEntry: NewDiaryEntry = {
    comment: parseComment(object.comment),
    date: parseDate(object.date),
    weather: parseWeather(object.weather),
    visibility: parseVisibility(object.visibility)
  };

  return newEntry;
};
```

<!-- we notice that the code does not compile. This is due to the fact that the [unknown](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#new-unknown-top-type) type does not allow any operations, so accessing the fields is not possible.-->
我们注意到，代码不能编译。这是由于[未知](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#new-unknown-top-type)类型不允许任何操作，所以访问字段是不可能的。

<!-- We can fix this by destructuring the fields to variables of the type unknown as follows:-->
 我们可以通过将字段重构为未知类型的变量来解决这个问题，如下所示。

```js
type Fields = { comment: unknown, date: unknown, weather: unknown, visibility: unknown };

const toNewDiaryEntry = ({ comment, date, weather, visibility } : Fields): NewDiaryEntry => {
  const newEntry: NewDiaryEntry = {
    comment: parseComment(comment),
    date: parseDate(date),
    weather: parseWeather(weather),
    visibility: parseVisibility(visibility)
  };

  return newEntry;
};
```

<!-- The first version of our flight diary application is now complete!-->
 我们的飞行日记应用的第一个版本现在已经完成了

<!-- The other option to bypass the problem would be to use the type <i>any</i> for the parameter and disable the lint rule for that line:-->
 绕过这个问题的另一个选择是为参数使用<i>any</i>类型，并禁用该行的lint规则。

```js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toNewDiaryEntry = (object: any): NewDiaryEntry => {
  const newEntry: NewDiaryEntry = {
    comment: parseComment(object.comment),
    date: parseDate(object.date),
    weather: parseWeather(object.weather),
    visibility: parseVisibility(object.visibility)
  };

  return newEntry;
};
```

<!-- If we now try to create a new diary entry with invalid or missing fields, we are getting an appropriate error message:-->
 如果我们现在试图创建一个无效或缺失字段的新日记条目，我们会得到一个适当的错误信息。

![](../../images/9/30b.png)

<!-- The source code of the application can be found on [GitHub](https://github.com/FullStack-HY/flight-diary).-->
 应用的源代码可以在[GitHub](https://github.com/FullStack-HY/flight-diary)上找到。

</div>

<div class="tasks">

### Exercises 9.12.-9.13.

#### 9.12: Patientor backend, step5

<!-- Create a POST endpoint <i>/api/patients</i> for adding patients. Ensure that you can add patients also from the frontend. You can create unique ids of type <i>string</i> using the [uuid](https://github.com/uuidjs/uuid) library:-->
 创建一个POST端点<i>/api/patients</i>用于添加病人。确保你也能从前端添加病人。你可以使用[uuid](https://github.com/uuidjs/uuid)库创建<i>string</i>类型的唯一ID。

```js
import { v1 as uuid } from 'uuid'
const id = uuid()
```

#### 9.13: Patientor backend, step6

<!-- Set up safe parsing, validation and type guards to the POST <i>/api/patients</i> request.-->
 为POST <i>/api/patients</i>请求设置安全解析、验证和类型保护。

<!-- Refactor the <i>gender</i> field to use an [enum type](http://www.typescriptlang.org/docs/handbook/enums.html).-->
 重构<i>gender</i>字段，使其使用[枚举类型](http://www.typescriptlang.org/docs/handbook/enums.html)。

</div>
