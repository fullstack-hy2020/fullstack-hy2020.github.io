---
mainImage: ../../../images/part-9.svg
part: 9
letter: c
lang: zh
---

<div class="content">

<!-- Now that we have a basic understanding of how TypeScript works and how to create small projects with it, it''s time to start creating something useful. We are now going to create a new project that will introduce use cases that are a little more realistic.-->
现在我们对 TypeScript 的工作原理和如何创建小项目有了基本的了解，是时候开始创建一些有用的东西了。我们现在将创建一个新项目，它将介绍一些更现实的用例。

<!-- One major change from the previous part is that <i>we're not going to use ts-node anymore</i>. It is a handy tool that helps you get started, but in the long run, it is advisable to use the official TypeScript compiler that comes with the <i>typescript</i> npm-package. The official compiler generates and packages JavaScript files from the .ts files so that the built <i>production version</i> won't contain any TypeScript code anymore. This is the exact outcome we are aiming for since TypeScript itself is not executable by browsers or Node.-->
一个与之前部分不同的重大变化是<i>我们不再使用ts-node了</i>。它是一个有用的工具，可以帮助您开始，但从长远来看，最好使用<i>typescript</i> npm 包提供的官方TypeScript编译器。官方编译器可以从.ts文件生成和打包JavaScript文件，以便所构建的<i>生产版本</i>不再包含任何TypeScript代码。这正是我们要达到的目标，因为TypeScript本身不能由浏览器或Node执行。

### Setting up the project

<!-- We will create a project for Ilari, who loves flying small planes but has a difficult time managing his flight history. He is a coder himself, so he doesn't necessarily need a user interface, but he'd like to use some custom software with HTTP requests and retain the possibility of later adding a web-based user interface to the application.-->
我们将为 Ilari 创建一个项目，他热爱驾驶小型飞机，但在管理他的飞行历史方面有很大困难。他本身是一名程序员，因此他不一定需要用户界面，但他希望使用一些自定义软件，并保留后续添加基于Web的用户界面到应用程序的可能性。

<!-- Let's start by creating our first real project: <i>Ilari's flight diaries</i>. As usual, run *npm init* and install the *typescript* package as a dev dependency.-->
让我们从创建我们的第一个真正的项目开始：<i>伊拉里的飞行日记</i>。 像往常一样，运行 *npm init* 并将 *typescript* 包安装为dev依赖项。

```shell
 npm install typescript --save-dev
```

<!-- TypeScript''s Native Compiler (<i>tsc</i>) can help us initialize our project by generating our <i>tsconfig.json</i> file.-->
TypeScript 的原生编译器（<i>tsc</i>）可以帮助我们通过生成<i>tsconfig.json</i>文件来初始化我们的项目。
<!-- First, we need to add the *tsc* command to the list of executable scripts in <i>package.json</i> (unless you have installed *typescript* globally). Even if you installed TypeScript globally, you should always add it as a dev dependency to your project.-->
首先，我们需要将*tsc*命令添加到<i>package.json</i>中的可执行脚本列表中（除非您已全局安装*typescript*）。即使您全局安装了TypeScript，也应该将其添加为项目的开发依赖项。

<!-- The npm script for running *tsc* is set as follows:-->
`npm run tsc`: `npm 运行 tsc`

```json
{
  // ..
  "scripts": {
    "tsc": "tsc" // highlight-line
  },
  // ..
}
```

<!-- The bare *tsc* command is often added to *scripts* so that other scripts can use it, hence don''t be surprised to find it set up within the project like this.-->
经常将*tsc*命令添加到*脚本*中，以便其他脚本可以使用它，因此不要惊讶地发现它在项目中被设置成这样。

<!-- We can now initialize our tsconfig.json settings by running:-->
我们现在可以通过运行以下命令来初始化我们的tsconfig.json设置：

```shell
 npm run tsc -- --init
```

<!--  **Note** the extra *--* before the actual argument! Arguments before *--*  are interpreted as being for the *npm* command, while the ones after that are meant for the command that is run through the script (i.e. *tsc* in this case).-->
*npm run build -- -p src/tsconfig.json*

*npm run build --* -p src/tsconfig.json

<!-- The <i>tsconfig.json</i> file we just created contains a lengthy list of every configuration available to us. However, most of them are commented out.-->
<i>tsconfig.json</i> 文件我们刚刚创建包含了一个详细的配置列表可供我们使用。但是，其中大部分都是被注释掉的。
<!-- Studying this file can help you find some configuration options you might need.-->
研究这个文件可以帮助你找到一些可能需要的配置选项。
<!-- It is also completely okay to keep the commented lines, in case you might need them someday.-->
也完全可以保留被注释的行，以防你有一天可能会用到它们。

<!-- At the moment, we want the following to be active:-->
目前，我们希望以下内容能够活跃起来：

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

<!-- Let''s go through each configuration:-->
让我们来看一下每个配置：

<!-- The *target* configuration tells the compiler which *ECMAScript* version to use when generating JavaScript. ES6 is supported by most browsers, so it is a good and safe option.-->
*目标* 配置告诉编译器在生成 JavaScript 时使用哪个 *ECMAScript* 版本。大多数浏览器都支持 ES6，因此它是一个很好且安全的选择。

<!-- *outDir* tells where the compiled code should be placed.-->
*outDir* 告诉编译后的代码应该放置在哪里。

<!-- *module* tells the compiler that we want to use *CommonJS* modules in the compiled code. This means we can use the old *require* syntax instead of the *import* one, which is not supported in older versions of *Node*, such as version 10.-->
模块告诉编译器我们想在编译代码中使用CommonJS模块。这意味着我们可以使用旧的require语法而不是import语法，而这在较旧版本的Node（如10版本）中是不支持的。

<!-- *strict* is a shorthand for multiple separate options:-->
*严格* 是多个不同选项的简写：
<i>noImplicitAny, noImplicitThis, alwaysStrict, strictBindCallApply, strictNullChecks, strictFunctionTypes and strictPropertyInitialization</i>.
<!-- They guide our coding style to use the TypeScript features more strictly.-->
他们指导我们更加严格地使用TypeScript特性来编码风格。
<!-- For us, perhaps the most important is the already-familiar [noImplicitAny](https://www.staging-typescript.org/tsconfig#noImplicitAny). It prevents implicitly setting type *any*, which can for example happen if you don''t type the parameters of a function.-->
对我们来说，也许最重要的是已经熟悉的[noImplicitAny](https://www.staging-typescript.org/tsconfig#noImplicitAny)。它可以防止隐式设置类型*any*，比如在您不对函数的参数进行类型检查时可能发生的情况。
<!-- Details about the rest of the configurations can be found in the [tsconfig documentation](https://www.staging-typescript.org/tsconfig#strict).-->
关于其余配置的详细信息可以在[tsconfig文档](https://www.staging-typescript.org/tsconfig#strict)中找到。
<!-- Using *strict* is suggested by the official documentation.-->
使用**严格**是官方文档建议的。

<!-- *noUnusedLocals* prevents having unused local variables, and *noUnusedParameters* throws an error if a function has unused parameters.-->
*noUnusedLocals* 防止有未使用的局部变量，而 *noUnusedParameters* 如果函数有未使用的参数，则抛出错误。

<!-- *noImplicitReturns* checks all code paths in a function to ensure they return a value.-->
*noImplicitReturns* 检查函数中的所有代码路径，以确保它们返回一个值。

<!-- *noFallthroughCasesInSwitch* ensures that, in a *switch case*, each case ends either with a *return* or a *break* statement.-->
*noFallthroughCasesInSwitch* 确保在*switch case*中，每个case以*return*或*break*语句结束。

<!-- *esModuleInterop* allows interoperability between CommonJS and ES Modules; see more in the [documentation](https://www.staging-typescript.org/tsconfig#esModuleInterop).-->
*esModuleInterop* 允许 CommonJS 和 ES 模块之间的互操作性；详情可参见[文档](https://www.staging-typescript.org/tsconfig#esModuleInterop)。

<!-- Now that we have set our configuration, we can continue by installing <i>express</i> and, of course, also <i>@types/express</i>. Also, since this is a real project, which is intended to be grown over time, we will use ESlint from the very beginning:-->
现在我们已经设置好了配置，我们可以继续安装<i>express</i>，当然也要安装<i>@types/express</i>。另外，因为这是一个真正的项目，它将会随着时间的推移而发展，所以我们从一开始就使用ESlint：

```shell
npm install express
npm install --save-dev eslint @types/express @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

<!-- Now our <i>package.json</i> should look like this:-->
现在我们的<i>package.json</i>应该是这样的：

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

<!-- We also create a <i>.eslintrc</i> file with the following content:-->
我们也创建了一个<i>.eslintrc</i>文件，内容如下：

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
现在，我们只需要设置我们的开发环境，我们就准备好开始编写一些严肃的代码了。
<!-- There are many different options for this. One option could be to use the familiar <i>nodemon</i> with <i>ts-node</i>. However, as we saw earlier, <i>ts-node-dev</i> does the same thing, so we will use that instead.-->
有许多不同的选项可以选择，其中一个选项可以是使用熟悉的<i>nodemon</i>加上<i>ts-node</i>。但正如我们之前看到的，<i>ts-node-dev</i>也可以做到同样的事情，所以我们将改用它。
<!-- So, let''s install <i>ts-node-dev</i>:-->
那么，让我们安装<i>ts-node-dev</i>：

```shell
npm install --save-dev ts-node-dev
```

<!-- We finally define a few more npm scripts, and voilà, we are ready to begin:-->
最后，我们定义了一些更多的npm脚本，瞧，我们已经准备好开始了：

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

<!-- As you can see, there is a lot of stuff to go through before beginning the actual coding. When you are working on a real project, careful preparations support your development process. Take the time needed to create a good setup for yourself and your team, so that everything runs smoothly in the long run.-->
正如你所看到的，在开始实际编码之前，还有很多东西需要研究。当你在处理一个真实的项目时，仔细的准备会支持你的开发过程。花费时间为你和你的团队建立一个良好的环境，以便在长期运行中一切顺利进行。

### Let there be code

<!-- Now we can finally start coding! As always, we start by creating a ping endpoint, just to make sure everything is working.-->
现在我们终于可以开始编码了！像往常一样，我们首先创建一个ping端点，以确保一切正常。

<!-- The contents of the <i>index.ts</i> file:-->
<i>index.ts</i> 文件的内容：

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

<!-- Now, if we run the app with *npm run dev*, we can verify that a request to <http://localhost:3000/ping> gives the response <i>pong</i>, so our configuration is set!-->
现在，如果我们用*npm run dev*运行应用程序，我们可以验证<http://localhost:3000/ping>的请求得到响应<i>pong</i>，所以我们的配置已经设置好！

<!-- When starting the app with *npm run dev*, it runs in development mode.-->
当使用*npm run dev*启动应用程序时，它会以开发模式运行。
<!-- The development mode is not suitable at all when we later operate the app in production.-->
开发模式在我们稍后在生产环境中运行应用程序时完全不合适。

<!-- Let's try to create a <i>production build</i> by running the TypeScript compiler. Since we have defined the *outdir* in our tsconfig.json, nothing's left but to run the script *npm run tsc*.-->
让我们尝试通过运行TypeScript编译器来创建<i>生产构建</i>。由于我们在tsconfig.json中定义了*outdir*，除了运行脚本*npm run tsc*之外，没有其他事情了。

<!-- Just like magic, a native runnable JavaScript production build of the Express backend is created in file <i>index.js</i> inside the directory <i>build</i>. The compiled code looks like this-->
.

就像魔术一样，在目录<i>build</i>中创建了一个原生可运行的Express后端的JavaScript生产构建<i>index.js</i>。编译后的代码如下。

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

<!-- Currently, if we run ESlint it will also interpret the files in the <i>build</i> directory. We don''t want that, since the code there is compiler-generated. We can prevent this by creating a  <i>.eslintignore</i> file that lists the content we want ESlint to ignore, just like we do with git and <i>.gitignore</i>.-->
目前，如果我们运行ESLint，它也会解释<i>build</i>目录中的文件。我们不想这样，因为那里的代码是编译器生成的。我们可以通过创建一个<i>.eslintignore</i>文件来防止这种情况，就像我们用git和<i>.gitignore</i>一样。

<!-- Let''s add an npm script for running the application in production mode:-->
让我们添加一个npm脚本来以生产模式运行应用程序：

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

<!-- When we run the app with *npm start*, we can verify that the production build also works:-->
当我们用`npm start`运行应用程序时，我们可以验证生产构建也可以工作：

![browser showing pong from localhost:3000/ping](../../images/9/15a.png)

<!-- Now we have a minimal working pipeline for developing our project.-->
现在我们有一个最小的工作流程来开发我们的项目。
<!-- With the help of our compiler and ESlint, it also ensures that good code quality is maintained. With this base, we can start creating an app that we could, later on, deploy into a production environment.-->
通过我们的编译器和ESLint的帮助，还确保维持良好的代码质量。有了这个基础，我们可以开始创建一个应用程序，以后可以将其部署到生产环境中。

</div>

<div class="tasks">

### Exercises 9.8-9.9

#### Before you start the exercises

<!-- For this set of exercises, you will be developing a backend for an existing project called **Patientor**, which is a simple medical record application for doctors who handle diagnoses and basic health information of their patients.-->
对于这套练习，您将为现有项目**Patientor**开发后端，这是一个简单的医疗记录应用程序，用于处理医生的诊断和患者的基本健康信息。

<!-- The [frontend](https://github.com/fullstack-hy2020/patientor) has already been built by outsider experts and your task is to create a backend to support the existing code.-->
[前端](https://github.com/fullstack-hy2020/patientor)已由外部专家搭建完成，您的任务是创建一个后端来支持现有的代码。

#### WARNING

<!-- Quite often VS code loses track what is really happening in the code and it shows type or style related warnings despite the code has been fixed. If this happens (to me it has happened quite often), just restart the editor. It is also good to doublecheck that everything really works by running the compiler and the eslint from the command line with commands:-->
常常VS code会失去跟踪代码中真正发生的事情，尽管代码已经被修复，它仍会显示类型或样式相关的警告。如果发生这种情况（我经常发生），只需重新启动编辑器即可。最好还是通过以下命令在命令行中运行编译器和eslint，以确保一切真的正常工作：

```bash
npm run tsc
npm run lint
```

<!-- When run in command line you get the "real result" for sure. So, never trust the editor too much!-->
当在命令行中运行时，您可以肯定地获得“真实结果”。因此，永远不要过分相信编辑器！

#### 9.8: Patientor backend, step1

<!-- Initialize a new backend project that will work with the frontend. Configure eslint and tsconfig with the same configurations as proposed in the material. Define an endpoint that answers HTTP GET requests for route */api/ping*.-->
初始化一个新的后端专案，该专案将与前端配合工作。使用和材料中提出的相同配置配置eslint和tsconfig。定义一个回应HTTP GET请求的端点，路由为*/api/ping*。

<!-- The project should be runnable with npm scripts, both in development mode and, as compiled code, in production mode.-->
项目应该可以通过npm脚本在开发模式和编译后的生产模式下运行。

#### 9.9: Patientor backend, step2

<!-- Fork and clone the project [patientor](https://github.com/fullstack-hy2020/patientor). Start the project with the help of the README file.-->
Fork 和 clone 这个项目 [patientor](https://github.com/fullstack-hy2020/patientor)。 通过 README 文件开始这个项目。

<!-- You can run this command if you get an error message when trying to start the frontend:-->
如果在启动前端时遇到错误讯息，您可以执行以下指令：

```shell
npm update chokidar
```

<!--  You should be able to use the frontend without a functioning backend.-->
你应该能够在没有功能正常的后端的情况下使用前端。

<!-- Ensure that the backend answers the ping request that the <i>frontend</i> has made on startup. Check the developer tools to make sure it works:-->
确保后端在启动时回应前端的ping请求。检查开发者工具以确保它正常工作：

![dev tools showing ping failed](../../images/9/16a.png)

<!-- You might also want to have a look at the <i>console</i> tab. If something fails, [part 3](/en/part3) of the course shows how the problem can be solved.-->
你可能也想看看<i>控制台</i>选项卡。如果出现问题，课程的[第3章节](/en/part3)将演示如何解决问题。

</div>

<div class="content">

### Implementing the functionality

<!-- Finally, we are ready to start writing some code.-->
最后，我们准备好开始编写一些代码了。

<!-- Let''s start from the basics. Ilari wants to be able to keep track of his experiences on his flight journeys.-->
让我们从基础开始。Ilari想要能够跟踪他的飞行旅程的经历。

<!-- He wants to be able to save <i>diary entries</i>, which contain:-->
他想要能够保存<i>日记条目</i>，其中包括：

<!-- - The date of the entry-->
日期： ____
<!-- - Weather conditions (good, windy, rainy or stormy)-->
can have a big impact on people's mood

天气状况（良好、多风、下雨或暴风雨）可能会对人们的心情产生很大的影响。
<!-- - Visibility (good, ok or poor)-->
可见性（好，可以或差）
<!-- - Free text detailing the experience-->
我在这里有一个美好的体验。我和我的朋友们一起去了一个湖边的度假胜地，这里有一个宽阔的湖泊，并且有许多木船可以划，我们可以在湖上漂流，还可以去湖边的岸边野餐，晚上还可以在湖边赏月。这里的风景非常美丽，吸引了许多游客，我们还可以和来自世界各地的游客交流，这是一次难忘的经历。

<!-- We have obtained some sample data, which we will use as a base to build on.-->
我们已经获得了一些样本数据，我们将用它们作为基础来构建。
<!-- The data is saved in JSON format and can be found [here](https://github.com/fullstack-hy2020/misc/blob/master/diaryentries.json).-->
数据以JSON格式保存，可以在[这里](https://github.com/fullstack-hy2020/misc/blob/master/diaryentries.json)找到。

<!-- The data looks like the following:-->
数据看起来像下面这样：

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
    "comment": "Everything went better than expected, I''m learning much"
  },
  // ...
]
```

<!-- Let''s start by creating an endpoint that returns all flight diary entries.-->
让我们从创建一个返回所有飞行日志条目的端点开始。

<!-- First, we need to make some decisions on how to structure our source code. It is better to place all source code under <i>src</i> directory, so source code is not mixed with configuration files.-->
首先，我们需要就如何结构化我们的源代码做出一些决定。最好将所有源代码放在<i>src</i>目录下，这样源代码就不会和配置文件混在一起。
<!-- We will move <i>index.ts</i> there and make the necessary changes to the npm scripts.-->
我们将把<i>index.ts</i>移动到那里，并对npm脚本做出必要的更改。

<!-- We will place all [routers](/en/part4/structure_of_backend_application_introduction_to_testing) and modules which are responsible for handling a set of specific resources such as <i>diaries</i>, under the directory <i>src/routes</i>.-->
我们将把所有[路由器](/en/part4/structure_of_backend_application_introduction_to_testing)和模块，负责处理一组特定资源，如<i>日记</i>，放在目录<i>src/routes</i>下。
<!-- This is a bit different than what we did in [part 4](/en/part4), where we used the directory <i>src/controllers</i>.-->
这与我们在[第4章节](/en/part4)中所做的有些不同，我们在那里使用的是目录<i>src/controllers</i>。

<!-- The router taking care of all diary endpoints is in <i>src/routes/diaries.ts</i> and looks like this:-->
router.get('/', diaryController.getAll);

router.get('/:id', diaryController.getOne);

router.post('/', diaryController.create);

router.put('/:id', diaryController.update);

router.delete('/:id', diaryController.delete);

<i>src/routes/diaries.ts</i> 负责所有日记端点的路由，看起来像这样：

router.get('/', diaryController.getAll);

router.get('/:id', diaryController.getOne);

router.post('/', diaryController.create);

router.put('/:id', diaryController.update);

router.delete('/:id', diaryController.delete);

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

<!-- We''ll route all requests to prefix */api/diaries* to that specific router in <i>index.ts</i>-->
我们将所有对前缀*/api/diaries*的请求路由到<i>index.ts</i>中的特定路由器。

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

<!-- And now, if we make an HTTP GET request to <http://localhost:3000/api/diaries>, we should see the message: *Fetching all diaries!*-->
现在，如果我们向<http://localhost:3000/api/diaries>发出HTTP GET请求，我们应该会看到消息：*正在获取所有日记！*

<!-- Next, we need to start serving the seed data (found [here](https://github.com/fullstack-hy2020/misc/blob/master/diaryentries.json)) from the app. We will fetch the data and save it to <i>data/entries.json</i>.-->
接下来，我们需要从应用程序开始提供种子数据（可在[此处](https://github.com/fullstack-hy2020/misc/blob/master/diaryentries.json)找到）。我们将获取数据并将其保存到<i>data/entries.json</i>中。

<!-- We won''t be writing the code for the actual data manipulations in the router. We will create a <i>service</i> that takes care of the data manipulation instead.-->
我们不会在路由器上编写实际的数据操作代码。我们将创建一个<i>服务</i>来处理数据操作。
<!-- It is quite a common practice to separate the "business logic" from the router code into modules, which are quite often called <i>services</i>.-->
通常有一种普遍的做法就是将"业务逻辑"从路由代码中分离出来，这些通常被称为<i>服务</i>。
<!-- The name service originates from [Domain-driven design](https://en.wikipedia.org/wiki/Domain-driven_design) and was made popular by the [Spring](https://spring.io/) framework.-->
来自[领域驱动设计](https://en.wikipedia.org/wiki/Domain-driven_design)的名称服务，并由[Spring](https://spring.io/)框架流行起来。

<!-- Let''s create a <i>src/services</i> directory and-->
add a <i>users.js</i> file

让我们创建一个<i>src/services</i> 目录并添加一个<i>users.js</i> 文件
<!-- place the <i>diaryService.ts</i> file in it.-->
将<i>diaryService.ts</i>文件放在其中。
<!-- The file contains two functions for fetching and saving diary entries:-->
文件包含两个函数用于获取和保存日记条目：

```js
import diaryData from '../../data/entries.json';

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
但是有些不对劲：

![vscode asking to consider using resolveJsonModule since can''t find module](../../images/9/17c.png)

<!-- The hint says we might want to use *resolveJsonModule*. Let''s add it to our tsconfig:-->
提示说我们可能想使用*resolveJsonModule*。让我们把它添加到我们的tsconfig中：

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
而我们的问题就这样解决了。

<!-- > **NB**: For some reason, VSCode sometimes complains that it cannot find the file <i>../../data/entries.json</i> from the service despite the file existing. That is a bug in the editor, and goes away when the editor is restarted.-->
> **注意**：由于某些原因，VSCode有时会抱怨它无法从服务器中找到文件<i>../../data/entries.json</i>，尽管文件存在。这是编辑器中的一个错误，重新启动编辑器后就会消失。

<!-- Earlier, we saw how the compiler can decide the type of a variable by the value it is assigned.-->
以前，我们看到编译器可以通过赋予变量的值来决定变量的类型。
<!-- Similarly, the compiler can interpret large data sets consisting of objects and arrays.-->
同样地，编译器可以解释由对象和阵列组成的大型资料集。
<!-- Due to this, the compiler warns us if we try to do something suspicious with the JSON data we are handling. For example, if we are handling an array containing objects of a specific type, and we try to add an object which does not have all the fields the other objects have, or has type conflicts (for example, a number where there should be a string), the compiler can give us a warning.-->
由于这个原因，如果我们试图对处理的JSON数据做一些可疑的操作，编译器会向我们发出警告。例如，如果我们处理的是一个包含特定类型对象的数组，并且我们尝试添加一个没有其他对象所有字段的对象，或者有类型冲突（例如，应该是字符串的地方却是数字），编译器可以给我们一个警告。

<!-- Even though the compiler is pretty good at making sure we don''t do anything unwanted, it is safer to define the types for the data ourselves.-->
尽管编译器非常擅长确保我们不做任何不想做的事情，但最好自己定义数据类型更安全。

<!-- Currently, we have a basic working TypeScript Express app, but there are barely any actual <i>typings</i> in the code. Since we know what type of data should be accepted for the *weather* and *visibility* fields, there is no reason for us not to include their types in the code.-->
目前，我们有一个基本的TypeScript Express应用程序，但代码中几乎没有实际的<i>类型</i>。由于我们知道*天气*和*可见性*字段应接受哪种类型的数据，因此没有理由不在代码中包含它们的类型。

<!-- Let's create a file for our types, <i>types.ts</i>, where we'll define all our types for this project.-->
让我们为我们的类型创建一个文件，<i>types.ts</i>，在这里我们将定义所有的类型用于这个项目。

<!-- First, let''s type the *Weather* and *Visibility* values using a [union type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types) of the allowed strings:-->
首先，让我们使用允许的字符串的[联合类型](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)来输入*天气*和*能见度*的值：

```js
export type Weather = 'sunny' | 'rainy' | 'cloudy' | 'windy' | 'stormy';

export type Visibility = 'great' | 'good' | 'ok' | 'poor';
```

<!-- And, from there, we can continue by creating a DiaryEntry type, which will be an [interface](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces):-->
然后，我们可以通过创建一个`DiaryEntry`类型来继续，它将是一个[接口](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces)：

```js
export interface DiaryEntry {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment: string;
}
```

<!-- We can now try to type our imported JSON:-->
我们现在可以尝试输入我们导入的JSON：

```js
import diaryData from '../../data/entries.json';

import { DiaryEntry } from '../types'; // highlight-line

const diaries: DiaryEntry[] = diaryData; // highlight-line

const getEntries = (): DiaryEntry[] => { // highlight-line
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

<!-- But since the JSON already has its values declared, assigning a type for the data set results in an error:-->
但是由于JSON已经声明了它的值，为数据集分配类型会导致错误：

![vscode showing string not assignable to weather error](../../images/9/19b.png)

<!-- The end of the error message reveals the problem: the *weather* fields are incompatible. In *DiaryEntry*, we specified that its type is *Weather*, but-->
in *WeatherJournal*, we specified that its type is *String*.

错误消息的结尾揭示了问题：*weather* 字段不兼容。在 *DiaryEntry* 中，我们指定其类型为 *Weather*，但在 *WeatherJournal* 中，我们指定其类型为 *String*。
<!-- the TypeScript compiler had inferred its type to be *string*.-->
类型脚本编译器推断其类型为*字符串*。

<!-- We can fix the problem by doing a [type assertion](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions). As we already [mentioned](/en/part9/first_steps_with_type_script#type-assertion) type assertions should be done only if we are certain we know what we are doing!-->
我们可以通过[类型断言](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions)来解决这个问题。正如我们[提到的](/en/part9/first_steps_with_type_script#type-assertion)，只有当我们确定自己知道自己在做什么时，才应该进行类型断言！

<!-- If we assert the type of the variable *diaryData* to be *DiaryEntry* with the keyword *as*, everything should work:-->
如果我们用关键字*as*断言变量*diaryData*的类型为*DiaryEntry*，一切都应该正常工作：

```js
import diaryData from '../../data/entries.json'

import { Weather, Visibility, DiaryEntry } from '../types'

const diaries: DiaryEntry[] = diaryData as DiaryEntry[]; // highlight-line

const getEntries = (): DiaryEntry[] => {
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

<!-- We should never use type assertion unless there is no other way to proceed, as there is always the danger we assert an unfit type to an object and cause a nasty runtime error.-->
我们应该永远不要使用类型断言，除非没有其他办法可以继续，因为总有可能将不适合的类型断言给对象，从而导致一个讨厌的运行时错误。
<!-- While the compiler trusts you to know what you are doing when using *as*, by doing this, we are not using the full power of TypeScript but relying on the coder to secure the code.-->
虽然编译器信任你知道你在使用*as*时在做什么，但是通过这样做，我们没有充分利用TypeScript的功能，而是依赖于程序员来保证代码的安全。

<!-- In our case, we could change how we export our data so we can type it within the data file.-->
在我们的情况下，我们可以改变我们如何导出数据，这样我们就可以在数据文件中输入它。
<!-- Since we cannot use typings in a JSON file, we should convert the JSON file to a ts file *diaries.ts* which exports the typed data like so:-->
由于我们不能在JSON文件中使用类型，我们应该将JSON文件转换为*diaries.ts*文件，并以如下方式导出类型化的数据：

```js
import { DiaryEntry } from "../src/types"; // highlight-line

const diaryEntries: DiaryEntry[] = [ // highlight-line
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

<!-- Now, when we import the array, the compiler interprets it correctly and the *weather* and *visibility* fields are understood right:-->
现在，当我们导入数组时，编译器正确地解释它，*天气*和*能见度*字段也被正确理解：

```js
import diaries from '../../data/entries'; // highlight-line

import { DiaryEntry } from '../types';

const getEntries = (): DiaryEntry[] => {
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

<!-- Note that, if we want to be able to save entries without a certain field, e.g. <i>comment</i>, we could set the type of the field as [optional](http://www.typescriptlang.org/docs/handbook/interfaces.html#optional-properties) by adding *?* to the type declaration:-->
如果我们想要能够保存没有某个字段（例如<i>comment</i>）的条目，我们可以通过在类型声明中添加*？*来将字段类型设置为[可选](http://www.typescriptlang.org/docs/handbook/interfaces.html#optional-properties)：

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
重要的是要注意使用tsconfig [resolveJsonModule](https://www.typescriptlang.org/en/tsconfig#resolveJsonModule) 选项时可能出现的问题：

```json
{
  "compilerOptions": {
    // ...
    "resolveJsonModule": true // highlight-line
  }
}
```

<!-- According to the node documentation for [file modules](https://nodejs.org/api/modules.html#modules_file_modules),-->
根据[文件模块](https://nodejs.org/api/modules.html#modules_file_modules)的节点文档，
<!-- node will try to resolve modules in order of extensions:-->
node 将按照扩展名的顺序尝试解析模块：

```shell
 ["js", "json", "node"]
```

<!-- In addition to that, by default, <i>ts-node</i> and <i>ts-node-dev</i> extend the list of possible node module extensions to:-->
此外，默认情况下，<i>ts-node</i> 和 <i>ts-node-dev</i> 将可能的节点模块扩展列表扩展为：

```shell
 ["js", "json", "node", "ts", "tsx"]
```

<!-- > **NB**: The validity of *.js*, *.json* and *.node* files as modules in TypeScript depend on environment configuration, including *tsconfig* options such as *allowJs* and *resolveJsonModule*.-->
> **注意**：在TypeScript中，*.js*、*.json*和*.node*文件作为模块的有效性取决于环境配置，包括*tsconfig*选项，如*allowJs*和*resolveJsonModule*。

<!-- Consider a flat folder structure containing files:-->
考虑一个包含文件的平面文件夹结构：

```shell
  ├── myModule.json
  └── myModule.ts
```

<!-- In TypeScript, with the *resolveJsonModule* option set to true, the file <i>myModule.json</i> becomes a valid node module. Now, imagine a scenario where we wish to take the file <i>myModule.ts</i> into use:-->
在TypeScript中，当*resolveJsonModule*选项设置为true时，文件<i>myModule.json</i>就变成了一个有效的节点模块。现在，想象一下我们希望将文件<i>myModule.ts</i>拿来使用的场景：

```js
import myModule from "./myModule";
```

<!-- Looking closely at the order of node module extensions:-->
看细了节点模块扩展的顺序：

```shell
 ["js", "json", "node", "ts", "tsx"]
```

<!-- We notice that the <i>.json</i> file extension takes precedence over <i>.ts</i> and so <i>myModule.json</i> will be imported and not <i>myModule.ts</i>.-->
我们注意到<i>.json</i>文件扩展名优先于<i>.ts</i>，因此<i>myModule.json</i>将被导入，而不是<i>myModule.ts</i>。

<!-- To avoid time-eating bugs, it is recommended that within a flat directory, each file with a valid node module extension has a unique filename.-->
为了避免耗费时间的错误，建议在一个平面目录中，每个具有有效的节点模块扩展名的文件都具有唯一的文件名。

### Utility Types

<!-- Sometimes, we might want to use a specific modification of a type.-->
有时候，我们可能想使用某种类型的特定修改。
<!-- For example, consider a page for listing some data, some of which is sensitive and some of which is non-sensitive.-->
例如，考虑一个用于列出某些数据的页面，其中一些是敏感的，另一些是非敏感的。
<!-- We might want to be sure that no sensitive data is used or displayed. We could <i>pick</i> the fields of a type we allow to be used to enforce this.-->
我们可能希望确保不使用或显示任何敏感数据。我们可以<i>选择</i>一种类型的字段来强制执行这一点。
<!-- We can do that by using the utility type [Pick](https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys).-->
我们可以通过使用实用类型[Pick](https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys)来实现。

<!-- In our project, we should consider that Ilari might want to create a listing of all his diary entries <i>excluding</i> the comment field since, during a very scary flight, he might end up writing something he wouldn''t necessarily want to show anyone else.-->
在我们的项目中，我们应该考虑Ilari可能想要创建一个所有日记条目的列表，<i>排除</i>评论栏，因为在一次非常可怕的飞行中，他可能会写下一些他不想让别人看到的东西。

<!-- The [Pick](https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys) utility type allows us to choose which fields of an existing type we want to use.-->
[Pick](https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys) 实用类型允许我们选择现有类型中我们想要使用的字段。
<!-- Pick can be used to either construct a completely new type or to inform a function what it should return on runtime.-->
使用 Pick 可以用来构造一个全新的类型，或者在运行时告知函数它应该返回什么。
<!-- Utility types are a special kind of type, but they can be used just like regular types.-->
utility 型是一种特殊类型，但它们可以像普通类型一样使用。

<!-- In our case, to create a "censored" version of the *DiaryEntry* for public displays, we can use *Pick* in the function declaration:-->
在我们的情况下，为了在公共展示中创建一个“被审查”版本的*日记条目*，我们可以在函数声明中使用*选择*：

```js
const getNonSensitiveEntries =
  (): Pick<DiaryEntry, 'id' | 'date' | 'weather' | 'visibility'>[] => {
    // ...
  }
```

<!-- and the compiler would expect the function to return an array of values of the modified *DiaryEntry* type, which includes only the four selected fields.-->
编译器会期望该函数返回一个仅包含四个选定字段的*DiaryEntry*类型的值数组。

<!-- In this case, we want to exclude only one field, so it would be even better to use the [Omit](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys) utility type, which we can use to declare which fields to exclude:-->
在这种情况下，我们只想排除一个字段，因此使用[Omit](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)实用类型会更好，我们可以使用它来声明要排除哪些字段：

```js
const getNonSensitiveEntries = (): Omit<DiaryEntry, 'comment'>[] => {
  // ...
}
```

<!-- To improve the readability, we should most definitively define a [type alias](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases) *NonSensitiveDiaryEntry* in the file <i>types.ts</i>:-->
为了提高可读性，我们应该在文件<i>types.ts</i>中最终定义一个[类型别名](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases) *NonSensitiveDiaryEntry*。

```js
export type NonSensitiveDiaryEntry = Omit<DiaryEntry, 'comment'>;
```

<!-- The code becomes now much more clear and more descriptive:-->
现在，代码变得更加清晰和更具描述性：

```js
import diaries from '../../data/entries';
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

<!-- One thing in our application is a cause for concern. In *getNonSensitiveEntries*, we are returning the complete diary entries, and <i>no error is given</i> despite typing!-->
**一件事在我们的应用程序中令人担忧。在*getNonSensitiveEntries*中，我们返回完整的日记条目，尽管输入了，但<i>没有给出错误！</i>**

<!-- This happens because [TypeScript only checks](http://www.typescriptlang.org/docs/handbook/type-compatibility.html) whether we have all of the required fields or not, but excess fields are not prohibited. In our case, this means that it is <i>not prohibited</i> to return an object of type *DiaryEntry[]*, but if we were to try to access the *comment* field, it would not be possible because we would be accessing a field that TypeScript is unaware of even though it exists.-->
因为[TypeScript只检查](http://www.typescriptlang.org/docs/handbook/type-compatibility.html)我们是否拥有所有必需的字段，但是不禁止多余的字段。在我们的例子中，这意味着<i>不被禁止</i>返回一个类型为*DiaryEntry[]*的对象，但是如果我们试图访问*comment*字段，就不可能了，因为我们访问的字段是TypeScript不知道的，尽管它存在。

<!-- Unfortunately, this can lead to unwanted behavior if you are not aware of what you are doing; the situation is valid as far as TypeScript is concerned, but you are most likely allowing use that is not wanted.-->
不幸的是，如果你没有意识到自己在做什么，这可能会导致不想要的行为；就TypeScript而言，这种情况是有效的，但你很可能允许了不想要的使用。
<!-- If we were now to return all of the diary entries from the *getNonSensitiveEntries* function to the frontend, we would be <i>leaking the unwanted fields to the requesting browser</i> - even though our types seem to imply otherwise!-->
如果我们现在将*getNonSensitiveEntries*函数中的所有日记条目返回给前端，我们将<i>将不需要的字段泄露给请求浏览器</i>，即使我们的类型似乎暗示了另外的情况！

<!-- Because TypeScript doesn''t modify the actual data but only its type, we need to exclude the fields ourselves:-->
因为TypeScript不会修改实际的数据，只修改其类型，我们需要自己排除字段：

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
  return null;
}

export default {
  getEntries,
  getNonSensitiveEntries,
  addDiary
}
```

<!-- If we now try to return this data with the basic *DiaryEntry* type, i.e. if we type the function as follows:-->
如果我们现在试图用基本的*DiaryEntry*类型返回这些数据，即如果我们把函数类型如下：

```js
const getNonSensitiveEntries = (): DiaryEntry[] => {
```

<!-- we would get the following error:-->
我们会得到以下错误：

![vs code error - comment is declared here](../../images/9/22b.png)

<!-- Again, the last line of the error message is the most helpful one. Let''s undo this undesired modification.-->
再一次，错误信息的最后一行是最有用的。让我们撤销这个不需要的修改。

<!-- \* Note that if you make the comment field optional (using the *?* operator), everything will work fine.-->
\* 注意，如果你使用 *？* 操作符使评论字段变为可选，一切都会正常工作。

<!-- Utility types include many handy tools, and it is undoubtedly worth it to take some time to study [the documentation](https://www.typescriptlang.org/docs/handbook/utility-types.html).-->
包括许多实用的工具，而且毫无疑问值得花些时间研究[文档](https://www.typescriptlang.org/docs/handbook/utility-types.html)。

<!-- Finally, we can complete the route which returns all diary entries:-->
最后，我们可以完成返回所有日记条目的路由：

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
**回应正如我们所期望的那样：**

![browser api/diaries shows three json objects](../../images/9/26.png)

</div>

<div class="tasks">

### Exercises 9.10-9.11

<!-- Similarly to Ilari''s flight service, we do not use a real database in our app but instead use hardcoded data that is in the files [diagnoses.ts](https://github.com/fullstack-hy2020/misc/blob/master/diagnoses.ts) and [patients.ts](https://github.com/fullstack-hy2020/misc/blob/master/patients.ts). Get the files and store those in a directory called <i>data</i> in your project. All data modification can be done in runtime memory, so during this part, it is <i>not necessary to write to a file</i>.-->
同样地，我们的应用程序不使用真实的数据库，而是使用存储在文件[diagnoses.ts](https://github.com/fullstack-hy2020/misc/blob/master/diagnoses.ts) 和 [patients.ts](https://github.com/fullstack-hy2020/misc/blob/master/patients.ts)中的硬编码数据。 请获取文件并将其存储在项目中的<i>data</i>目录中。 所有数据修改都可以在运行时内存中完成，因此在此部分中<i>不需要写入文件</i>。

#### 9.10: Patientor backend, step3

<!-- Create a type *Diagnose* and use it to create endpoint */api/diagnoses* for fetching all diagnoses with HTTP GET.-->
创建一个类型*诊断*，并使用它来创建端点*/api/diagnoses*，用于使用HTTP GET获取所有诊断。

<!-- Structure your code properly by using meaningfully-named directories and files.-->
结构化你的代码，使用有意义的目录和文件名。

<!-- **Note** that <i>diagnoses</i> may or may not contain the field *latin*. You might want to use [optional properties](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#optional-properties) in the type definition.-->
**注意**，<i>诊断</i>可能会也可能不会包含字段*拉丁*。你可能想要在类型定义中使用[可选属性](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#optional-properties)。

#### 9.11: Patientor backend, step4

<!-- Create data type *Patient* and set up the GET endpoint */api/patients* which returns all patients to the frontend, excluding field *ssn*. Use a [utility type](https://www.typescriptlang.org/docs/handbook/utility-types.html) to make sure you are selecting and returning only the wanted fields.-->
创建数据类型*Patient*，并设置GET端点*/api/patients*返回所有患者到前端，排除字段*ssn*。使用[实用类型](https://www.typescriptlang.org/docs/handbook/utility-types.html)确保只选择和返回所需的字段。

<!-- In this exercise, you may assume that field *gender* has type *string*.-->
在本次练习中，可以假设字段*性别*的类型为*字符串*。

<!-- Try the endpoint with your browser and ensure that *ssn* is not included in the response:-->
尝试用浏览器访问该端点，并确保响应中不包含*ssn*。

![api/patients browser shows no ssn in patients json](../../images/9/22g.png)

<!-- After creating the endpoint, ensure that the <i>frontend</i> shows the list of patients:-->
确保<i>前端</i>显示病人列表后，创建端点。

![browser showing list of patients](../../images/9/22h.png)

</div>

<div class="content">

### Preventing an accidental undefined result

<!-- Let''s extend the backend to support fetching one specific entry with an HTTP GET request to route *api/diaries/:id*.-->
让我们扩展后端，以支持通过HTTP GET请求到路由*api/diaries/:id*来获取一个特定的条目。

<!-- The DiaryService needs to be extended with a *findById* function:-->
需要增加一个*findById* 函数来扩展DiaryService：

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
但是，新的问题又出现了：

![vscode error can''t assign undefined to DiaryEntry](../../images/9/23e.png)

<!-- The issue is that there is no guarantee that an entry with the specified id can be found.-->
问题是没有保证能找到指定id的条目。
<!-- It is good that we are made aware of this potential problem already at compile phase. Without TypeScript, we would not be warned about this problem, and in the worst-case scenario, we could have ended up returning an *undefined* object instead of informing the user about the specified entry not being found.-->
这很好，我们已经在编译阶段就意识到了这个潜在问题。如果没有TypeScript，我们就不会被警告这个问题，在最坏的情况下，我们可能会返回一个*未定义*的对象，而不是告知用户指定的条目没有找到。

<!-- First of all, in cases like this, we need to decide what the <i>return value</i> should be if an object is not found, and how the case should be handled.-->
首先，在这类情况下，我们需要决定如果找不到对象，应该返回什么<i>返回值</i>，以及如何处理这种情况。
<!-- The *find* method of an array returns *undefined* if the object is not found, and this is fine.-->
数组的*find*方法如果没有找到对象就会返回*undefined*，这没有问题。
<!-- We can solve our problem by typing the return value as follows:-->
我们可以通过按照下面的方式输入返回值来解决我们的问题：

```js
const findById = (id: number): DiaryEntry | undefined => { // highlight-line
  const entry = diaries.find(d => d.id === id);
  return entry;
}
```

<!-- The route handler is the following:-->
路由处理如下：

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

<!-- Let''s start building the HTTP POST endpoint for adding new flight diary entries.-->
让我们开始构建用于添加新飞行日记条目的HTTP POST端点。
<!-- The new entries should have the same type as the existing data.-->
新条目应该和现有数据类型相同。

<!-- The code handling of the response looks as follows:-->
代码处理响应如下：

```js
router.post('/', (req, res) => {
  const { date, weather, visibility, comment } = req.body;
  const addedEntry = diaryService.addDiary(
    date,
    weather,
    visibility,
    comment,
  );
  res.json(addedEntry);
});
```

<!-- The corresponding method in *diaryService* looks like this:-->
在*diaryService*中相应的方法如下：

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
  };

  diaries.push(newDiaryEntry);
  return newDiaryEntry;
};
```

<!-- As you can see, the *addDiary* function is becoming quite hard to read now that we have all the fields as separate parameters. It might be better to just send the data as an object to the function:-->
你可以看到，随着我们将所有字段作为单独的参数，*addDiary* 函数变得相当难以阅读。将数据作为对象发送到函数可能会更好：

```js
router.post('/', (req, res) => {
  const { date, weather, visibility, comment } = req.body;
  const addedEntry = diaryService.addDiary({ // highlight-line
    date,
    weather,
    visibility,
    comment,
  }); // highlight-line
  res.json(addedEntry);
})
```

<!-- But wait, what is the type of this object? It is not exactly a *DiaryEntry*, since it is still missing the *id* field. It could be useful to create a new type, *NewDiaryEntry*, for an entry that hasn't been saved yet. Let's create that in <i>types.ts</i> using the existing *DiaryEntry* type and the [Omit](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys) utility type:-->
但是等等，这个对象的类型是什么？它不完全是*DiaryEntry*，因为它还缺少*id*字段。创建一个新类型*NewDiaryEntry*用于尚未保存的条目可能很有用。让我们使用现有的*DiaryEntry*类型和[Omit](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)实用类型在<i>types.ts</i>中创建它：

```js
export type NewDiaryEntry = Omit<DiaryEntry, 'id'>;
```

<!-- Now we can use the new type in our DiaryService,-->
现在我们可以在我们的日记服务中使用新类型。
<!-- Now we can use the new type in our DiaryService,-->
which is very convenient

现在我们可以在我们的日记服务中使用新类型，这非常方便。
<!-- and destructure the new entry object when creating an entry to be saved:-->
# 从英语翻译为中文，保持markdown格式：并在创建要保存的条目时解构新条目对象：

# 创建要保存的条目时解构新条目对象

在创建要保存的条目时，解构新条目对象，以便更轻松地访问属性。

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
现在代码看起来更加整洁了！

<!-- There is still a complaint from our code:-->
**还有一个来自我们代码的投诉：**

![vscode error unsafe assignment of any value](../../images/9/43.png)

<!-- The cause is the ESlint rule [@typescript-eslint/no-unsafe-assignment](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unsafe-assignment.md) that prevents us from assigning the fields of a request body to variables.-->
原因是ESLint规则[@typescript-eslint/no-unsafe-assignment](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unsafe-assignment.md)，它阻止我们将请求体的字段赋值给变量。

<!-- For the time being, let us just ignore the ESlint rule from the whole file by adding the following as the first line of the file:-->
// eslint-disable-next-line

// 对于此时，我们可以通过添加以下作为文件的第一行来忽略整个文件的ESlint规则：// eslint-disable-next-line

``` js
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
```

<!-- To parse the incoming data we must have the *json* middleware configured:-->
要解析传入的数据，我们必须配置*json*中间件：

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
现在应用程序已准备好接收正确类型的新日记条目的HTTP POST请求！

### Proofing requests

<!-- There are plenty of things that can go wrong when we accept data from outside sources.-->
当我们接受来自外部来源的数据时，可能会出现许多问题。
<!-- Applications rarely work completely on their own, and we are forced to live with the fact that data from sources outside of our system cannot be fully trusted.-->
应用程序很少能完全独立运行，我们不得不忍受系统外部数据不能完全受信任的事实。
<!-- When we receive data from an outside source, there is no way it can already be typed when we receive it. We need to make decisions on how to handle the uncertainty that comes with this.-->
当我们从外部来源收到资料时，它无法已经被打字排列好。我们需要对如何处理不确定性做出决定。

<!-- The disabled ESlint rule was hinting to us that the following assignment is risky:-->
被禁用的ESlint规则暗示我们，以下赋值有风险：

```js
const newDiaryEntry = diaryService.addDiary({
  date,
  weather,
  visibility,
  comment,
});
```

<!-- We would like to have the assurance that the object in a POST request has the correct type. Let us now define a function *toNewDiaryEntry* that receives the request body as a parameter and returns a properly-typed *NewDiaryEntry* object. The function shall be defined in the file <i>utils.ts</i>.-->
我们希望能确保POST请求中的对象具有正确的类型。现在让我们定义一个接收请求体作为参数并返回正确类型的*NewDiaryEntry*对象的函数*toNewDiaryEntry*。该函数将定义在文件<i>utils.ts</i>中。

<!-- The route definition uses the function as follows:-->
路由定义使用如下功能：

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

<!-- We can now also remove the first line that ignores the ESlint rule *no-unsafe-assignment*.-->
我们现在也可以移除忽略ESlint规则 *no-unsafe-assignment* 的第一行了。

<!-- Since we are now writing secure code and trying to ensure that we are getting exactly the data we want from the requests, we should get started with parsing and validating each field we are expecting to receive.-->
既然我们现在正在编写安全代码，试图确保我们从请求中获得完全符合我们期望的数据，我们应该开始解析和验证我们期望接收的每个字段。

<!-- The skeleton of the function *toNewDiaryEntry* looks like the following:-->
函数*toNewDiaryEntry*的骨架如下：

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

<!-- The function should parse each field and make sure that the return value is exactly of type *NewDiaryEntry*. This means we should check each field separately.-->
函数应该解析每个字段，并确保返回值完全是*NewDiaryEntry*类型。这意味着我们应该分别检查每个字段。

<!-- Once again, we have a type issue: what is the  type of the parameter *object*? Since the *object* **is** the body of a request, Express has typed it as *any*. Since the idea of this function is to map fields of unknown type to fields of the correct type and check whether they are defined as expected, this might be the rare case where we <i>want to allow the *any* type</i>.-->
再次，我们有一个类型问题：参数*object*的类型是什么？由于*object***是**请求的主体，Express 将其类型设定为*any*。由于这个函数的目的是将未知类型的字段映射到正确类型的字段，并检查它们是否按预期定义，这可能是一个<i>我们想允许*any*类型的罕见情况</i>。

<!-- However, if we type the object as *any*, ESlint complains about that:-->
但是，如果我们将对象类型设置为*任意*，ESlint 会抱怨：

![vscode eslint showing object should be typed something non-any and that its defined but never used](../../images/9/61new.png)

<!-- We could ignore the lint rule but a better idea is to follow one of the advices the editor gives in the <i>Quick Fix</i> and set the parameter type to *unknown*:-->
我们可以忽略lint规则，但更好的办法是遵循<i>Quick Fix</i>中编辑器给出的建议之一，将参数类型设置为*unknown*：

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

<!-- > #### A sidenote from the editor-->
#### 编辑的一个记号
<!-- >-->
>The sun is shining brightly

>太阳灿烂地照耀
<!-- > <i>If you are like me and hate having a code in broken state for a long time due to incomplete typing, you could star by "faking" the function: </i>-->
> <i>如果你像我一样讨厌因为没有完成输入而导致代码长时间处于损坏状态，你可以从“伪装”功能开始：</i>
<!-- >-->
I like to learn Chinese

我喜欢学习中文
<!-- >-->
You can do it

你可以做到！
<!-- >```js-->
console.log("Hello World!");

```

```js
console.log("你好世界！");
```
<!-- >const toNewDiaryEntry = (object: unknown): NewDiaryEntry => {-->
>  const entry: NewDiaryEntry = {

>    date: new Date().toISOString(),

>    ...object,

>  };

>  return entry;

>};

>const NewDiaryEntry = (对象：未知): 新日记条目 => {

>  const 条目：新日记条目 = {

>    日期：new Date（）.toISOString（），

>    ...对象，

>  };

>  返回条目;

>};
<!-- >-->
I like to travel

我喜欢旅行
<!-- >  console.log(object); // now object is no more unused-->
> `console.log(object); // 现在 object 不再被未使用`
<!-- >  const newEntry: NewDiaryEntry = {-->
>  date: "2020-08-22",

>  content: "I'm feeling really happy today!",

>  };

> const addEntry = (entry: NewDiaryEntry) => {
>   // Add new entry to diary
> };

> addEntry(newEntry);

`const newEntry: NewDiaryEntry = {

date: "2020-08-22",

content: "今天我感到非常开心！",

};
const addEntry = (entry: NewDiaryEntry) => {
  // 将新条目添加到日记中
};

addEntry(newEntry);`
<!-- >    weather: 'cloudy', // fake the return value-->
>天气：'多云', // 模拟返回值
<!-- >    visibility: 'great',-->
可见度：「极佳」
<!-- >    date: '2022-1-1',-->
日期：'2022-1-1'
<!-- >    comment: 'fake news'-->
>    评论：「假新闻」
<!-- >  };-->
>  你好！

>  `你好！`
<!-- >-->
The cat is sleeping

> 猫正在睡觉
<!-- >  return newEntry;-->
返回新条目;
<!-- >};-->
>The world is a book, and those who do not travel read only one page.

>世界就像一本书，那些不旅行的人只读到一页。
<!-- >```-->
科技改变了我们的生活

```

科技改变了我们的生活
<!-- >-->
I'm an engineer

>我是一名工程师
<!-- > <i>So before the real data and types are ready to use, I''am just returning here something that has for the sure the right type. The code stays in a operational state all the time and my blood pressure remains in normal level. </i>-->
> <i>所以在真正的数据和类型可以使用之前，我只是返回了一些肯定有正确类型的东西。代码一直处于操作状态，我的血压保持正常水平。</i>

### Type guards

<!-- Let us start creating the parsers for each of the fields of *object*.-->
让我们开始为每个*对象*字段创建解析器。

<!-- To validate the *comment* field, we need to check that it exists, and to ensure that it is of the type *string*.-->
验证*评论*字段，我们需要检查它是否存在，并确保它是*字符串*类型。

<!-- The function should look something like this:-->
函数应该看起来像这样：

```js
const parseComment = (comment: unknown): string => {
  if (!comment || !isString(comment)) {
    throw new Error('Incorrect or missing comment');
  }

  return comment;
};
```

<!-- The function gets a parameter of type *unknown* and returns it as type *string* if it exists and is of the right type.-->
函数接受一个类型为*未知*的参数，如果存在且类型正确，则将其作为*字符串*类型返回。

<!-- The string validation function looks like this:-->
字符串验证函数看起来像这样：

```js
const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};
```

<!-- The function is a so-called [type guard](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates). That means it is a function that returns a boolean <i>and</i> has a <i>type predicate</i> as the return type. In our case, the type predicate is:-->
这个函数是所谓的[类型检查](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)。这意味着它是一个返回布尔值的函数，并且具有<i>类型谓词</i>作为返回类型。在我们的例子中，类型谓词是：

```js
text is string
```

<!-- The general form of a type predicate is *parameterName is Type* where the *parameterName* is the name of the function parameter and *Type* is the targeted type.-->
*参数名称是类型*是类型谓词的一般形式，其中*参数名称*是函数参数的名称，*类型*是目标类型。

<!-- If the type guard function returns true, the TypeScript compiler knows that the tested variable has the type that was defined in the type predicate.-->
如果类型检查函数返回 true，TypeScript 编译器就知道测试变量具有在类型谓词中定义的类型。

<!-- Before the type guard is called, the actual type of the variable *comment* is not known:-->
在调用类型检查之前，变量*comment*的实际类型是未知的：

![vscode hovering over isString(comment) shows type unknown](../../images/9/28e-21.png)

<!-- But after the call, if the code proceeds past the exception (that is, the type guard returned true), then the compiler knows that *comment* is of type *string*:-->
但是在调用之后，如果代码超出了异常（即类型检查返回 true），那么编译器就知道*注释*是类型*string*：

![vscode hovering over return comment shows type string](../../images/9/29e-21.png)

<!-- The use of a type guard that returns a type predicate is one way to do [type narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html), that is, to give a variable a more strict type or accurate type. As we will soon see there are also other kind of [type guards](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) available.-->
使用返回类型断言的类型检查是[类型缩小](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)的一种方式，即给变量一个更严格或更准确的类型。正如我们很快将看到的，还有其他[类型检查](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)可用。

<!-- > #### Side note: testing if something is a string-->
#### 侧边注释：测试某物是否为字符串
<!-- >-->
I'm a student

我是一名学生
<!-- > <i>Why do we have two conditions in the string type guard?</i>-->
> <i>我们为什么在字符串类型检查中有两个条件？</i>
<!-- >-->
I'm sorry

> 我很抱歉
<!-- >```js-->
console.log("Hello World!");
```

```js
console.log("你好世界！");
```
<!-- >const isString = (text: unknown): text is string => {-->
>  return typeof text === 'string';

>};

>const 是字符串 = (text: unknown): text is string => {

>  return typeof text === 'string';

>};
<!-- >  return typeof text === 'string' || text instanceof String; // highlight-line-->
> return typeof text === 'string' 或者 text 是 String 的一个实例; // highlight-line
<!-- >}-->
>This is a test

>这是一个测试
<!-- >```-->
>I like to travel

我喜欢旅行
<!-- >-->
I am a student

我是一名学生。
<!-- ><i>Would it not be enough to write the guard like this?</i>-->
><i>像这样写保安就足够了吗？</i>
<!-- >-->
I'm sorry

>对不起
<!-- >```js-->
const a = 'Hello World!';

console.log(a);
```

```js
const a = '你好世界！';

console.log(a);
```
<!-- >const isString = (text: unknown): text is string => {-->
return typeof text === 'string';
};

>const 是字符串 = (text: 未知): text 是字符串 => {
  return typeof text === 'string';
};
<!-- >  return typeof text === 'string';-->
>  return typeof text === '字符串';
<!-- >}-->
>The quick brown fox jumps over the lazy dog.

>快速的棕色狐狸跳过懒狗。
<!-- >```-->
>I like to travel

>我喜欢旅行
<!-- >-->
I'm very happy

我非常高兴
<!-- ><i>Most likely, the simpler form is good enough for all practical purposes. However, if we want to be sure, both conditions are needed. There are two different ways to create string objects in JavaScript which both work a bit differently when compared to the *typeof* and *instanceof* operators:</i>-->
><i>最有可能的，简单的形式足够用于所有实际用途。但是，如果我们想要确定，就需要两种情况。在JavaScript中有两种不同的方式创建字符串对象，它们与*typeof*和*instanceof*操作符相比有所不同：</i>
<!-- >-->
I'm sorry

>我很抱歉
<!-- >```js-->
var x = 5;

```

```js
var x = 5;
```

```js
var x = 5;
```中文：
```js
var x = 5;
```
<!-- >const a = "I''m a string primitive";-->
>const a = "我是一个字符串原始值";
<!-- >const b = new String("I''m a String Object");-->
>const b = new String("我是一个字符串对象");
<!-- >typeof a; --> returns 'string'-->
>typeof a; --> 返回 '字符串'
<!-- >typeof b; --> returns 'object'-->
>`typeof b;` --> 返回'对象'
<!-- >a instanceof String; --> returns false-->
>a instanceof String;  --> 返回false
<!-- >b instanceof String; --> returns true-->
>b instanceof String; --> 返回true
<!-- >```-->
>I'm looking forward to hearing from you

>我期待着收到你的消息
<!-- >-->
>I like to go for a walk

>我喜欢散步
<!-- ><i>However, it is unlikely that anyone would create a string with a constructor function. Most likely the simpler version of the type guard would be just fine.</i>-->
然而，不太可能有人会用构造函数创建一个字符串。最可能的情况是，类型检查的简单版本就足够了。

<!-- Next, let''s consider the *date* field.-->
接下来，让我们来考虑*日期*栏位。
<!-- Parsing and validating the date object is pretty similar to what we did with comments.-->
解析和验证日期对象与我们对评论所做的工作相当相似。
<!-- Since TypeScript doesn''t know a type for a date, we need to treat it as a *string*.-->
由于TypeScript不知道日期的类型，我们需要将其视为*字符串*。
<!-- We should however still use JavaScript-level validation to check whether the date format is acceptable.-->
我们应该仍然使用JavaScript-level验证来检查日期格式是否可接受。

<!-- We will add the following functions:-->
我们将添加以下功能：

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

<!-- The code is nothing special. The only thing is that we can''t use a type predicate based type guard here since a date in this case is only considered to be a *string*. Note that even though the *parseDate* function accepts the *date* variable as *unknown* after we check the type with *isString*, then its type is set as *string*, which is why we can give the variable to the *isDate* function requiring a string without any problems.-->
这段代码没什么特别的。唯一的不同之处是，由于此处的日期只被视为一个*字符串*，因此我们不能在这里使用基于类型谓词的类型检查。请注意，即使*parseDate*函数接受*date*变量作为*unknown*，但在我们使用*isString*检查类型之后，它的类型也被设置为*字符串*，这就是为什么我们可以毫无问题地将变量传递给要求字符串的*isDate*函数。

<!-- Finally, we are ready to move on to the last two types, *Weather* and *Visibility*.-->
最后，我们准备进入最后两种类型：*天气*和*能见度*。

<!-- We would like the validation and parsing to work as follows:-->
我们希望验证和解析工作如下：

```js
const parseWeather = (weather: unknown): Weather => {
  if (!weather || !isString(weather) || !isWeather(weather)) {
      throw new Error('Incorrect or missing weather: ' + weather);
  }
  return weather;
};
```

<!-- The question is: how can we validate that the string is of a specific form?-->
问题是：我们如何验证字符串是特定格式？
<!-- One possible way to write the type guard would be this:-->
```
一种可能的写法是：
if (typeof value === 'string') {
  // do something
}
```

```js
const isWeather = (str: string): str is Weather => {
  return ['sunny', 'rainy', 'cloudy', 'stormy'].includes(str);
};
```

<!-- This would work just fine, but the problem is that the list of possible values for Weather does not necessarily stay in sync with the type definitions if the type is altered.-->
这样做可以很好地解决问题，但是问题在于，如果类型被改变，天气的可能值列表不一定与类型定义保持同步。
<!-- This is most certainly not good, since we would like to have just one source for all possible weather types.-->
这绝对不好，因为我们希望只有一个来源可以提供所有可能的天气类型。

### Enum

<!-- In our case, a better solution would be to improve the actual *Weather* type. Instead of a type alias, we should use the TypeScript [enum](https://www.typescriptlang.org/docs/handbook/enums.html), which allows us to use the actual values in our code at runtime, not only in the compilation phase.-->
在我们的情况下，更好的解决方案是改进实际的*Weather*类型。我们应该使用TypeScript [枚举](https://www.typescriptlang.org/docs/handbook/enums.html)，而不是类型别名，这样可以在运行时在我们的代码中使用实际值，而不仅仅是在编译阶段。

<!-- Let us redefine the type *Weather* as follows:-->
# 重新定义*天气*类型如下：

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
现在我们可以检查一个字符串是否是允许的值之一，类型检查可以这样写：

```js
const isWeather = (param: string): param is Weather => {
  return Object.values(Weather).map(v => v.toString()).includes(param);
};
```

<!-- Note that we need to take the string representation of the enum values for the comparison, that is why we do the mapping.-->
**注意，我们需要取枚举值的字符串表示来进行比较，这就是为什么我们要做映射。**

<!-- One issue arises after these changes. Our data in file <i>data/entries.ts</i> does not conform to our types anymore:-->
一旦这些改变之后就会出现一个问题。我们在文件<i>data/entries.ts</i>中的数据不再符合我们的类型了：

![vscode error rainy is not assignable to type Weather](../../images/9/30.png)

<!-- This is because we cannot just assume a string is an enum.-->
因为我们不能只假设一个字符串是枚举类型。

<!-- We can fix this by mapping the initial data elements to the *DiaryEntry* type with the *toNewDiaryEntry* function:-->
我们可以通过使用*toNewDiaryEntry*函数将初始数据元素映射到*DiaryEntry*类型来解决这个问题：

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

<!-- Note that since *toNewDiaryEntry* returns an object of type *NewDiaryEntry*, we need to assert it to be *DiaryEntry* with the [as](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions) operator.-->
注意，由于*toNewDiaryEntry*返回的是*NewDiaryEntry*类型的对象，我们需要使用[as](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions)运算符将其断言为*DiaryEntry*。

<!-- Enums are typically used when there is a set of predetermined values that are not expected to change in the future. Usually, enums are used for much tighter unchanging values (for example, weekdays, months, cardinal directions), but since they offer us a great way to validate our incoming values, we might as well use them in our case.-->
枚举通常用于当有一组预先定义的值，这些值不会在未来改变时使用。通常，枚举用于更紧密的不变值（例如，星期几，月份，基数方向），但由于它们为我们提供了一种验证我们传入值的很好方法，我们也可以在我们的情况下使用它们。

<!-- We still need to give the same treatment to *Visibility*. The enum looks as follows:-->
*可视性* 仍然需要同样的处理。枚举如下：

```js
export enum Visibility {
  Great = 'great',
  Good = 'good',
  Ok = 'ok',
  Poor = 'poor',
}
```

<!-- The type guard and the parser are below:-->
类型检查和解析器如下：

```js
const isVisibility = (param: string): param is Visibility => {
  return Object.values(Visibility).map(v => v.toString()).includes(param);
};

const parseVisibility = (visibility: unknown): Visibility => {
  if (!visibility || !isString(visibility) || !isVisibility(visibility)) {
      throw new Error('Incorrect or missing visibility: ' + visibility);
  }
  return visibility;
};
```

<!-- And finally, we can finalize the *toNewDiaryEntry* function that takes care of validating and parsing the fields of the POST body. There is however one more thing to take care of. If we try to access the fields of the parameter *object* as follows:-->
最后，我们可以完成*toNewDiaryEntry*函数，它负责验证和解析POST正文中的字段。然而，还有一件事要处理。如果我们尝试以下面的方式访问参数*object*的字段：

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

<!-- we notice that the code does not compile. This is because the [unknown](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#new-unknown-top-type) type does not allow any operations, so accessing the fields is not possible.-->
我们注意到代码无法编译。这是因为[未知](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#new-unknown-top-type)类型不允许任何操作，因此无法访问字段。

<!-- We can again fix the problem by type narrowing. We have now two type guards, the first checks that the parameter object exists and it has the type <i>object</i>. After this the second type guard uses the [in](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-in-operator-narrowing) operator to ensure that the object has all the desired fields:-->
我们可以通过类型缩小来再次解决问题。我们现在有两个类型守卫，第一个检查参数对象是否存在，并且具有<i>对象</i>类型。之后，第二个类型守卫使用[in](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-in-operator-narrowing)操作符来确保对象具有所有所需字段：

```js
const toNewDiaryEntry = (object: unknown): NewDiaryEntry => {
  if ( !object || typeof object !== 'object' ) {
    throw new Error('Incorrect or missing data');
  }

  if ('comment' in object && 'date' in object && 'weather' in object && 'visibility' in object)  {
    const newEntry: NewDiaryEntry = {
      weather: parseWeather(object.weather),
      visibility: parseVisibility(object.visibility),
      date: parseDate(object.date),
      comment: parseComment(object.comment)
    };

    return newEntry;
  }

  throw new Error('Incorrect data: some fields are missing');
};
```

<!-- If the guard does not evaluate to true, an exception is thrown.-->
如果守卫不为真，则抛出异常。

<!-- The use of operator *in* actually now guarantees that the fields indeed exist in the object. Because of that, the existence check in parsers in no more needed:-->
因为使用*in*操作符现在可以保证这些字段确实存在于对象中，因此解析器中的存在性检查也不再需要。

```js
const parseVisibility = (visibility: unknown): Visibility => {
  // check !visibility removed:
  if (!isString(visibility) || !isVisibility(visibility)) {
      throw new Error('Incorrect visibility: ' + visibility);
  }
  return visibility;
};
```

<!-- If a field, e.g. *comment* would be optional, the type narrowing should take that into account, and the operator [in](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-in-operator-narrowing) could not be used quite as we did here, since the *in* test requires the field to be present.-->
如果一个字段，例如*comment*可选，那么类型缩小应该考虑到这一点，而[in](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-in-operator-narrowing)运算符不能像我们在这里所做的那样使用，因为*in*测试要求字段必须存在。

<!-- If we now try to create a new diary entry with invalid or missing fields, we are getting an appropriate error message:-->
如果我们现在试图创建一个具有无效或缺失字段的新日记条目，我们将得到一条适当的错误消息：

![postman showing 400 bad request with incorrect or missing visibility - awsesome](../../images/9/62new.png)

<!-- The source code of the application can be found on [GitHub](https://github.com/fullstack-hy2020/flight-diary).-->
应用程序的源代码可以在[GitHub](https://github.com/fullstack-hy2020/flight-diary)上找到。

</div>

<div class="tasks">

### Exercises 9.12-9.13

#### 9.12: Patientor backend, step5

<!-- Create a POST endpoint */api/patients* for adding patients. Ensure that you can add patients also from the frontend. You can create unique ids of type *string* using the [uuid](https://github.com/uuidjs/uuid) library:-->
创建一个POST端点 */api/patients* 用于添加患者。确保您也可以从前端添加患者。您可以使用[uuid](https://github.com/uuidjs/uuid)库创建类型为*string*的唯一ID：

```js
import { v1 as uuid } from 'uuid'
const id = uuid()
```

#### 9.13: Patientor backend, step6

<!-- Set up safe parsing, validation and type predicate to the POST */api/patients* request.-->
设置安全解析、验证和类型谓词，以对POST */api/patients*请求进行处理。

<!-- Refactor the *gender* field to use an [enum type](http://www.typescriptlang.org/docs/handbook/enums.html).-->
重构*性别*字段以使用[枚举类型](http://www.typescriptlang.org/docs/handbook/enums.html)。

</div>
