---
mainImage: ../../../images/part-7.svg
part: 7
letter: d
lang: zh
---
<div class="content">

<!-- Developing with React was notorious for requiring tools that were very difficult to configure. These days, getting started with React development is almost painless thanks to [create-react-app](https://github.com/facebookincubator/create-react-app). A better development workflow has probably never existed for browser-side JavaScript development.-->
开发React一直以来都以配置非常困难而臭名昭著。如今，由于[create-react-app](https://github.com/facebookincubator/create-react-app)，开始React开发几乎可以说是无痛的。对于浏览器端JavaScript开发来说，可能从未有过更好的开发工作流程。

<!-- We cannot rely on the black magic of create-react-app forever and it''s time for us to take a look under the hood. One of the key players in making React applications functional is a tool called [webpack](https://webpack.js.org/).-->
我们不能永远依赖create-react-app的黑魔法，是时候让我们看看引擎盖下面的情况了。使React应用程序可以正常工作的关键工具之一是[webpack](https://webpack.js.org/)。

### Bundling

<!-- We have implemented our applications by dividing our code into separate modules that have been <i>imported</i> to places that require them. Even though ES6 modules are defined in the ECMAScript standard, the older browsers do not know how to handle code that is divided into modules.-->
我们通过将代码分割成单独的模块来实现我们的应用程序，这些模块被<i>导入</i>到需要它们的地方。尽管ES6模块在ECMAScript标准中定义，但较旧的浏览器不知道如何处理被分割成模块的代码。

<!-- For this reason, code that is divided into modules must be <i>bundled</i> for browsers, meaning that all of the source code files are transformed into a single file that contains all of the application code. When we deployed our React frontend to production in [part 3](/en/part3/deploying_app_to_internet), we performed the bundling of our application with the _npm run build_ command. Under the hood, the npm script bundles the source code using webpack, which produces the following collection of files in the <i>build</i> directory:-->
因此，必须为浏览器将分割成模块的代码<i>打包</i>，这意味着所有源代码文件都被转换成一个包含所有应用程序代码的单个文件。当我们在[第3章节](/en/part3/deploying_app_to_internet)将React前端部署到生产环境时，我们使用_npm run build_命令对应用程序进行了打包。在幕后，npm脚本使用webpack对源代码进行了打包，在<i>build</i>目录中生成了以下文件集：

<pre>
.
├── asset-manifest.json
├── favicon.ico
├── index.html
├── logo192.png
├── logo512.png
├── manifest.json
├── robots.txt
└── static
    ├── css
    │   ├── main.1becb9f2.css
    │   └── main.1becb9f2.css.map
    └── js
        ├── main.88d3369d.js
        ├── main.88d3369d.js.LICENSE.txt
        └── main.88d3369d.js.map
</pre>

<!-- The <i>index.html</i> file located at the root of the build directory is the "main file" of the application which loads the bundled JavaScript file with a <i>script</i> tag:-->
<i>index.html</i> 文件位于构建目录的根目录下，是应用程序的“主文件”，它使用<i>script</i>标签加载打包的JavaScript文件：

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <title>React App</title>
    <script defer="defer" src="/static/js/main.88d3369d.js"></script>
    <link href="/static/css/main.1becb9f2.css" rel="stylesheet">
  </head>
    <div id="root"></div>
  </body>
</html>
```

<!-- As we can see from the example application that was created with create-react-app, the build script also bundles the application''s CSS files into a single <i>/static/css/main.1becb9f2.css</i> file.-->
正如我们从使用`create-react-app`创建的示例应用程序中所看到的，构建脚本还将应用程序的CSS文件打包到单个<i>/static/css/main.1becb9f2.css</i>文件中。

<!-- In practice, bundling is done so that we define an entry point for the application, which typically is the <i>index.js</i> file. When webpack bundles the code, it includes all of the code that the entry point imports, the code that its imports import, and so on.-->
在实践中，将代码捆绑在一起的目的是为了定义应用程序的入口点，这通常是<i>index.js</i>文件。当webpack捆绑代码时，它将包括入口点所导入的所有代码，以及它导入的代码所导入的代码，依此类推。

<!-- Since part of the imported files are packages like React, Redux, and Axios, the bundled JavaScript file will also contain the contents of each of these libraries.-->
由于部分导入的文件是诸如React、Redux和Axios等包，因此打包的JavaScript文件也将包含每个库的内容。

<!-- > The old way of dividing the application''s code into multiple files was based on the fact that the <i>index.html</i> file loaded all of the separate JavaScript files of the application with the help of script tags. This resulted in  decreased performance, since the loading of each separate file results in some overhead. For this reason, these days the preferred method is to bundle the code into a single file.-->
> 老的分割应用程序代码到多个文件的方式是基于<i>index.html</i>文件通过使用脚本标签来加载应用程序的所有单独的JavaScript文件。由于每个单独文件的加载都会带来一定的开销，这导致性能下降。因此，如今的首选方法是将代码打包到一个单独的文件中。

<!-- Next, we will create a suitable webpack configuration for a React application by hand from scratch.-->
接下来，我们将从零开始手动为 React 应用程序创建一个合适的 webpack 配置。

<!-- Let''s create a new directory for the project with the following subdirectories (<i>build</i> and <i>src</i>) and files:-->
让我们为项目创建一个新的目录，其中包含以下子目录（<i>build</i> 和 <i>src</i>）和文件：

<pre>
├── build
├── package.json
├── src
│   └── index.js
└── webpack.config.js
</pre>

<!-- The contents of the <i>package.json</i> file can e.g. be the following:-->
<i>package.json</i> 文件的内容可以是如下所示：

```json
{
  "name": "webpack-part7",
  "version": "0.0.1",
  "description": "practising webpack",
  "scripts": {},
  "license": "MIT"
}
```

<!-- Let''s install webpack with the command:-->
让我们用以下命令安装webpack：

```bash
npm install --save-dev webpack webpack-cli
```

<!-- We define the functionality of webpack in the <i>webpack.config.js</i> file, which we initialize with the following content:-->
我们在<i>webpack.config.js</i>文件中定义webpack的功能，我们用以下内容初始化它：

```js
const path = require('path')

const config = () => {
  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'main.js'
    }
  }
}

module.exports = config
```

<!-- **Note:** it would be possible to make the definition directly as an object instead of a function:-->
**警告：**可以直接将定义作为对象而不是函数：

```js
const path = require('path')

const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'main.js'
  }
}

module.exports = config
```

<!-- An object will suffice in many situations, but we will later need certain features that require the definition to be done as a function.-->
一个对象在许多情况下都可以满足需求，但是稍后我们需要某些特性，这就需要将定义做成一个函数。

<!-- We will then define a new npm script called <i>build</i> that will execute the bundling with webpack:-->
我们将定义一个新的npm脚本叫做<i>build</i>，它将使用webpack执行打包：

```js
// ...
"scripts": {
  "build": "webpack --mode=development"
},
// ...
```

<!-- Let''s add some more code to the <i>src/index.js</i> file:-->
让我们在<i>src/index.js</i>文件中再添加一些代码：

```js
const hello = name => {
  console.log(`hello ${name}`)
}
```

<!-- When we execute the _npm run build_ command, our application code will be bundled by webpack. The operation will produce a new <i>main.js</i> file that is added under the <i>build</i> directory:-->
当我们执行`npm run build`命令时，我们的应用程序代码将由webpack打包。该操作将产生一个新的`main.js`文件，该文件被添加到`build`目录下：

![terminal output webpack npm run build](../../images/7/19x.png)

<!-- The file contains a lot of stuff that looks quite interesting. We can also see the code we wrote earlier at the end of the file:-->
文件中包含了许多看起来很有趣的东西。我们也可以在文件末尾看到我们之前编写的代码：

```js
eval("const hello = name => {\n  console.log(`hello ${name}`)\n}\n\n//# sourceURL=webpack://webpack-osa7/./src/index.js?");
```

<!-- Let''s add an <i>App.js</i> file under the <i>src</i> directory with the following content:-->
让我们在<i>src</i>目录下添加一个<i>App.js</i>文件，其内容如下：

```js
const App = () => {
  return null
}

export default App
```

<!-- Let''s import and use the <i>App</i> module in the <i>index.js</i> file:-->
在`index.js`文件中，让我们导入并使用`App`模块：

```js
import App from './App';

const hello = name => {
  console.log(`hello ${name}`)
}

App()
```

<!-- When we bundle the application again with the _npm run build_ command, we notice that webpack has acknowledged both files:-->
当我们使用 _npm run build_ 命令重新打包应用程序时，我们注意到webpack已经认可了这两个文件：

![terminal output showing webpack generated two files](../../images/7/20x.png)

<!-- Our application code can be found at the end of the bundle file in a rather obscure format:-->
我们的应用程序代码可以在捆绑文件的末尾以相当晦涩难懂的格式找到：

![terminal output showing our minified code](../../images/7/20z.png)

### Configuration file

<!-- Let''s take a closer look at the contents of our current <i>webpack.config.js</i> file:-->
让我们仔细看一下我们当前的<i>webpack.config.js</i>文件的内容：

```js
const path = require('path')

const config = () => {
  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'main.js'
    }
  }
}

module.exports = config
```

<!-- The configuration file has been written in JavaScript and the function returning the configuration object is exported using Node''s module syntax.-->
配置文件已经用JavaScript编写，并且使用Node的模块语法导出返回配置对象的函数。

<!-- Our minimal configuration definition almost explains itself. The [entry](https://webpack.js.org/concepts/#entry) property of the configuration object specifies the file that will serve as the entry point for bundling the application.-->
我们的最小配置定义几乎可以自解释。配置对象的[入口](https://webpack.js.org/concepts/#entry)属性指定了将用作应用程序打包入口点的文件。

<!-- The [output](https://webpack.js.org/concepts/#output) property defines the location where the bundled code will be stored. The target directory must be defined as an <i>absolute path</i>, which is easy to create with the [path.resolve](https://nodejs.org/docs/latest-v8.x/api/path.html#path_path_resolve_paths) method. We also use [\_\_dirname](https://nodejs.org/docs/latest/api/globals.html#globals_dirname) which is a global variable in Node that stores the path to the current directory.-->
[输出](https://webpack.js.org/concepts/#output)属性定义了打包代码存储的位置。目标目录必须定义为<i>绝对路径</i>，可以使用[path.resolve](https://nodejs.org/docs/latest-v8.x/api/path.html#path_path_resolve_paths)方法轻松创建。我们还使用[\_\_dirname](https://nodejs.org/docs/latest/api/globals.html#globals_dirname)，它是Node中存储当前目录路径的全局变量。

### Bundling React

<!-- Next, let's transform our application into a minimal React application. Let's install the required libraries:-->
接下来，让我们将我们的应用程序转换成一个最小的React应用程序。让我们安装所需的库：

```bash
npm install react react-dom
```

<!-- And let''s turn our application into a React application by adding the familiar definitions in the <i>index.js</i> file:-->
让我们通过在<i>index.js</i>文件中添加熟悉的定义，将应用程序转换为React应用程序：

```js
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

<!-- We will also make the following changes to the <i>App.js</i> file:-->
我们还将对<i>App.js</i>文件做出以下更改：

```js
import React from 'react' // we need this now also in component files

const App = () => {
  return (
    <div>
      hello webpack
    </div>
  )
}

export default App
```

<!-- We still need the <i>build/index.html</i> file  that will serve as the "main page" of our application that will load our bundled JavaScript code with a <i>script</i> tag:-->
我们仍然需要<i>build/index.html</i>文件，它将作为应用程序的“主页”，用<i>script</i>标签加载我们捆绑的JavaScript代码：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>React App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="text/javascript" src="./main.js"></script>
  </body>
</html>
```

<!-- When we bundle our application, we run into the following problem:-->
当我们捆绑我们的应用程序时，我们遇到以下问题：

![webpack terminal failed loader needed](../../images/7/21x.png)

### Loaders

<!-- The error message from webpack states that we may need an appropriate <i>loader</i> to bundle the <i>App.js</i> file correctly. By default, webpack only knows how to deal with plain JavaScript. Although we may have become unaware of it, we are using [JSX](https://facebook.github.io/jsx/) for rendering our views in React. To illustrate this, the following code is not regular JavaScript:-->
错误消息来自webpack，它指出我们可能需要一个合适的<i>loader</i>来正确地打包<i>App.js</i>文件。默认情况下，webpack只知道如何处理普通的JavaScript。尽管我们可能已经不太注意，但我们正在使用[JSX](https://facebook.github.io/jsx/)来渲染React中的视图。为了说明这一点，以下代码不是普通的JavaScript：

```js
const App = () => {
  return (
    <div>
      hello webpack
    </div>
  )
}
```

<!-- The syntax used above comes from JSX and it provides us with an alternative way of defining a React element for an HTML <i>div</i> tag.-->
以上使用的语法来自JSX，它为我们提供了一种定义HTML <i>div</i> 标签的React元素的替代方法。

<!-- We can use [loaders](https://webpack.js.org/concepts/loaders/) to inform webpack of the files that need to be processed before they are bundled.-->
我们可以使用[加载器](https://webpack.js.org/concepts/loaders/)来通知webpack在将它们捆绑在一起之前需要处理的文件。

<!-- Let''s configure a loader to our application that transforms the JSX code into regular JavaScript:-->
让我们配置一个加载器到我们的应用程序，用于将JSX代码转换为常规JavaScript：

```js
const path = require('path')

const config = () => {
  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'main.js'
    },
      // highlight-start
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
          },
        },
      ],
    },
      // highlight-end
  }
}

module.exports = config
```

<!-- Loaders are defined under the <i>module</i> property in the <i>rules</i> array.-->
在<i>rules</i>数组的<i>module</i>属性下定义加载器。

<!-- The definition of a single loader consists of three parts:-->
定义单载具包括三个部分：

```js
{
  test: /\.js$/,
  loader: 'babel-loader',
  options: {
    presets: ['@babel/preset-react']
  }
}
```

<!-- The <i>test</i> property specifies that the loader is for files that have names ending with <i>.js</i>. The <i>loader</i> property specifies that the processing for those files will be done with [babel-loader](https://github.com/babel/babel-loader). The <i>options</i> property is used for specifying parameters for the loader, which configure its functionality.-->
<i>test</i> 属性指定加载器是为以 <i>.js</i> 结尾的文件而准备的。<i>loader</i> 属性指定这些文件的处理将由 [babel-loader](https://github.com/babel/babel-loader) 来完成。<i>options</i> 属性用于指定加载器的参数，以配置其功能。

<!-- Let''s install the loader and its required packages as a <i>development dependency</i>:-->
让我们把加载器及其所需的软件包安装为<i>开发依赖项</i>：

```bash
npm install @babel/core babel-loader @babel/preset-react --save-dev
```

<!-- Bundling the application will now succeed.-->
现在打包应用程序将会成功。

<!-- If we make some changes to the <i>App</i> component and take a look at the bundled code, we notice that the bundled version of the component looks like this:-->
如果我们对<i>App</i>组件做出一些更改并查看打包后的代码，我们会发现打包后的组件看起来像这样：

```js
const App = () =>
  react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
    'div',
    null,
    'hello webpack'
  )
```

<!-- As we can see from the example above, the React elements that were written in JSX are now created with regular JavaScript by using React''s [createElement](https://reactjs.org/docs/react-without-jsx.html) function.-->
正如我们从上面的示例中所看到的，用JSX写的React元素现在通过使用React的[createElement](https://reactjs.org/docs/react-without-jsx.html)函数用普通JavaScript创建。

<!-- You can test the bundled application by opening the <i>build/index.html</i> file with the <i>open file</i> functionality of your browser:-->
你可以通过使用浏览器的<i>打开文件</i>功能打开<i>build/index.html</i>文件来测试打包的应用程序：

![browser hello webpack](../../images/7/22.png)

<!-- It's worth noting that if the bundled application's source code uses <i>async/await</i>, the browser will not render anything on some browsers. [Googling the error message in the console](https://stackoverflow.com/questions/33527653/babel-6-regeneratorruntime-is-not-defined) will shed some light on the issue. With the [previous solution](https://babeljs.io/docs/en/babel-polyfill/) being deprecated we now have to install two more missing dependencies, that is [core-js](https://www.npmjs.com/package/core-js) and [regenerator-runtime](https://www.npmjs.com/package/regenerator-runtime):-->
值得注意的是，如果捆绑的应用程序的源代码使用<i>async/await</i>，则某些浏览器将不会呈现任何内容。[在控制台中搜索错误消息](https://stackoverflow.com/questions/33527653/babel-6-regeneratorruntime-is-not-defined)将会提供一些线索。由于[以前的解决方案](https://babeljs.io/docs/en/babel-polyfill/)已经被弃用，我们现在必须安装两个更多的缺失依赖，即[core-js](https://www.npmjs.com/package/core-js)和[regenerator-runtime](https://www.npmjs.com/package/regenerator-runtime)：

```bash
npm install core-js regenerator-runtime
```

<!-- You need to import those dependencies at the top of the <i>index.js</i> file:-->
你需要在<i>index.js</i>文件顶部导入这些依赖项：

```js
import 'core-js/stable/index.js'
import 'regenerator-runtime/runtime.js'
```

<!-- Our configuration contains nearly everything that we need for React development.-->
我们的配置几乎包含了我们在React开发中所需要的一切。

### Transpilers

<!-- The process of transforming code from one form of JavaScript to another is called [transpiling](https://en.wiktionary.org/wiki/transpile). The general definition of the term is to compile source code by transforming it from one language to another.-->
这称为[转译](https://en.wiktionary.org/wiki/transpile)，它是指将代码从一种JavaScript形式转换成另一种形式的过程。该术语的一般定义是通过将其从一种语言转换为另一种语言来编译源代码。

<!-- By using the configuration from the previous section, we are <i>transpiling</i> the code containing JSX into regular JavaScript with the help of [babel](https://babeljs.io/), which is currently the most popular tool for the job.-->
通过使用前面部分的配置，我们正在利用[babel](https://babeljs.io/)将包含JSX的代码<i>转译</i>成普通的JavaScript，它目前是这项工作中最受欢迎的工具。

<!-- As mentioned in part 1, most browsers do not support the latest features that were introduced in ES6 and ES7, and for this reason, the code is usually transpiled to a version of JavaScript that implements the ES5 standard.-->
正如在第一部分中提到的，大多数浏览器不支持ES6和ES7中引入的最新功能，因此，通常将代码转换为实现ES5标准的JavaScript版本。

<!-- The transpilation process that is executed by Babel is defined with <i>plugins</i>. In practice, most developers use ready-made [presets](https://babeljs.io/docs/plugins/) that are groups of pre-configured plugins.-->
Babel 执行的转译过程定义为 <i>插件</i>。实际上，大多数开发人员使用预先配置的 [预设]（https://babeljs.io/docs/plugins/）插件组。

<!-- Currently, we are using the [@babel/preset-react](https://babeljs.io/docs/plugins/preset-react/) preset for transpiling the source code of our application:-->
我们目前正在使用[@babel/preset-react](https://babeljs.io/docs/plugins/preset-react/)预设来转译我们应用程序的源代码：

```js
{
  test: /\.js$/,
  loader: 'babel-loader',
  options: {
    presets: ['@babel/preset-react'] // highlight-line
  }
}
```

<!-- Let''s add the [@babel/preset-env](https://babeljs.io/docs/plugins/preset-env/) plugin that contains everything needed to take code using all of the latest features and transpile it to code that is compatible with the ES5 standard:-->
让我们添加[@babel/preset-env](https://babeljs.io/docs/plugins/preset-env/)插件，它包含了所有的东西，可以将使用最新功能的代码转换为与ES5标准兼容的代码：

```js
{
  test: /\.js$/,
  loader: 'babel-loader',
  options: {
    presets: ['@babel/preset-env', '@babel/preset-react'] // highlight-line
  }
}
```

<!-- Let''s install the preset with the command:-->
让我们用命令安装预设：`let's install the preset with the command`

```bash
npm install @babel/preset-env --save-dev
```

<!-- When we transpile the code, it gets transformed into old-school JavaScript. The definition of the transformed <i>App</i> component looks like this:-->
当我们转译代码时，它会被转换成老式的JavaScript。转换后的<i>App</i>组件的定义看起来像这样：

```js
var App = function App() {
  return _react2.default.createElement('div', null, 'hello webpack')
};
```

<!-- As we can see, variables are declared with the _var_ keyword as ES5 JavaScript does not understand the _const_ keyword. Arrow functions are also not used, which is why the function definition used the _function_ keyword.-->
可以看到，变量使用`var`关键字声明，因为ES5 JavaScript不支持`const`关键字。也没有使用箭头函数，所以函数定义使用了`function`关键字。

### CSS

<!-- Let's add some CSS to our application. Let's create a new <i>src/index.css</i> file:-->
让我们给我们的应用程序添加一些CSS吧。让我们创建一个新的<i>src/index.css</i>文件：

```css
.container {
  margin: 10px;
  background-color: #dee8e4;
}
```

<!-- Then let''s use the style in the <i>App</i> component:-->
那么我们就在<i>App</i>组件中使用这种样式：

```js
const App = () => {
  return (
    <div className="container">
      hello webpack
    </div>
  )
}
```

<!-- And we import the style in the <i>index.js</i> file:-->
我们在<i>index.js</i>文件中导入样式：

```js
import './index.css'
```

<!-- This will cause the transpilation process to break:-->
这将导致转译过程中断：

![webpack failure missing loader for css/style](../../images/7/23x.png)

<!-- When using CSS, we have to use [css](https://webpack.js.org/loaders/css-loader/) and [style](https://webpack.js.org/loaders/style-loader/) loaders:-->
当使用CSS时，我们必须使用[css](https://webpack.js.org/loaders/css-loader/)和[style](https://webpack.js.org/loaders/style-loader/)加载器：

```js
{
  rules: [
    {
      test: /\.js$/,
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-react', '@babel/preset-env'],
      },
    },
    // highlight-start
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    },
    // highlight-end
  ];
}
```

<!-- The job of the [css loader](https://webpack.js.org/loaders/css-loader/) is to load the <i>CSS</i> files and the job of the [style loader](https://webpack.js.org/loaders/style-loader/) is to generate and inject a <i>style</i> element that contains all of the styles of the application.-->
[CSS loader](https://webpack.js.org/loaders/css-loader/) 的工作是加载<i>CSS</i>文件，而 [style loader](https://webpack.js.org/loaders/style-loader/) 的工作是生成并注入一个包含应用程序所有样式的<i>style</i>元素。

<!-- With this configuration, the CSS definitions are included in the <i>main.js</i> file of the application. For this reason, there is no need to separately import the <i>CSS</i> styles in the main <i>index.html</i> file of the application.-->
随着这个配置，CSS 定义被包含在应用程序的<i>main.js</i>文件中。因此，无需在应用程序的主<i>index.html</i>文件中单独导入<i>CSS</i>样式。

<!-- If needed, the application''s CSS can also be generated into its own separate file by using the [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin).-->
如果需要，可以使用[mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin)将应用程序的CSS生成到自己的单独文件中。

<!-- When we install the loaders:-->
当我们安装负载器时：

```bash
npm install style-loader css-loader --save-dev
```

<!-- The bundling will succeed once again and the application gets new styles.-->
bundling 将会再次成功，应用程序获得新的样式。

### Webpack-dev-server

<!-- The current configuration makes it possible to develop our application but the workflow is awful (to the point where it resembles the development workflow with Java). Every time we make a change to the code, we have to bundle it and refresh the browser to test the code.-->
目前的配置使我们可以开发应用程序，但工作流程很糟糕（甚至可以说和使用Java开发的工作流程相似）。每次我们对代码做出更改时，我们都必须打包它，然后刷新浏览器才能测试代码。

<!-- The [webpack-dev-server](https://webpack.js.org/guides/development/#using-webpack-dev-server) offers a solution to our problems. Let''s install it with the command:-->
[webpack-dev-server](https://webpack.js.org/guides/development/#using-webpack-dev-server) 提供了解决我们问题的解决方案。让我们使用以下命令安装它：

```js
npm install --save-dev webpack-dev-server
```

<!-- Let''s define an npm script for starting the dev server:-->
让我们为启动开发服务器定义一个npm脚本：

```js
{
  // ...
  "scripts": {
    "build": "webpack --mode=development",
    "start": "webpack serve --mode=development" // highlight-line
  },
  // ...
}
```

<!-- Let''s also add a new <i>devServer</i> property to the configuration object in the <i>webpack.config.js</i> file:-->
让我们也在`webpack.config.js`文件中的配置对象中添加一个新的`devServer`属性：

```js
const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'main.js',
  },
  // highlight-start
  devServer: {
    static: path.resolve(__dirname, 'build'),
    compress: true,
    port: 3000,
  },
  // highlight-end
  // ...
};
```

<!-- The _npm start_ command will now start the dev-server at port 3000, meaning that our application will be available by visiting <http://localhost:3000> in the browser. When we make changes to the code, the browser will automatically refresh the page.-->
`npm start` 命令现在会在端口3000启动dev-server，意味着我们的应用程序可以通过在浏览器中访问 <http://localhost:3000> 来访问。当我们对代码做出更改时，浏览器会自动刷新页面。

<!-- The process for updating the code is fast. When we use the dev-server, the code is not bundled the usual way into the <i>main.js</i> file. The result of the bundling exists only in memory.-->
进行代码更新的过程很快。当我们使用dev-server时，代码不会以通常的方式打包到<i>main.js</i>文件中。捆绑的结果只存在于内存中。

<!-- Let''s extend the code by changing the definition of the <i>App</i> component as shown below:-->
让我们通过更改如下所示的<i>App</i>组件的定义来扩展代码：

```js
import React, { useState } from 'react'
import './index.css'

const App = () => {
  const [counter, setCounter] = useState(0)

  return (
    <div className="container">
      hello webpack {counter} clicks
      <button onClick={() => setCounter(counter + 1)}>
        press
      </button>
    </div>
  )
}

export default App
```

<!-- The application works nicely and the development workflow is quite smooth.-->
应用程序运行得很好，开发工作流也很顺畅。

### Source maps

<!-- Let''s extract the click handler into its own function and store the previous value of the counter in its own <i>values</i> state:-->
让我们把点击处理程序提取到它自己的函数中，并将计数器之前的值存储在它自己的<i>值</i>状态中：

```js
const App = () => {
  const [counter, setCounter] = useState(0)
  const [values, setValues] = useState() // highlight-line

//highlight-start
  const handleClick = () => {
    setCounter(counter + 1)
    setValues(values.concat(counter))
  }
//highlight-end

  return (
    <div className="container">
      hello webpack {counter} clicks
      <button onClick={handleClick}> // highlight-line
        press
      </button>
    </div>
  )
}
```

<!-- The application no longer works and the console will display the following error:-->
应用程序不再工作，控制台将显示以下错误：

![devtools console cannot concat on undefined in handleClick](../../images/7/25.png)

<!-- We know that the error is in the onClick method, but if the application was any larger the error message would be quite difficult to track down:-->
我们知道错误在onClick方法中，但如果应用程序更大，错误消息将很难追踪。

<pre>
App.js:27 Uncaught TypeError: Cannot read property 'concat' of undefined
    at handleClick (App.js:27)
</pre>

<!-- The location of the error indicated in the message does not match the actual location of the error in our source code. If we click the error message, we notice that the displayed source code does not resemble our application code:-->
错误消息中指示的错误位置与实际源代码中的错误位置不匹配。如果我们点击错误消息，我们会注意到显示的源代码与我们的应用代码不相似：

![devtools source does not show our source code](../../images/7/26.png)

<!-- Of course, we want to see our actual source code in the error message.-->
当然，我们希望在错误消息中看到我们的实际源代码。

<!-- Luckily, fixing the error message in this respect is quite easy. We will ask webpack to generate a so-called [source map](https://webpack.js.org/configuration/devtool/) for the bundle, which makes it possible to <i>map errors</i> that occur during the execution of the bundle to the corresponding part in the original source code.-->
幸运的是，在这方面修复错误消息相当容易。我们将要求webpack为bundle生成所谓的[源映射](https://webpack.js.org/configuration/devtool/)，它可以将bundle执行期间发生的<i>错误映射</i>到原始源代码中的相应部分。

<!-- The source map can be generated by adding a new <i>devtool</i> property to the configuration object with the value 'source-map':-->
在配置对象中添加一个新的<i>devtool</i>属性，值为'source-map'，可以生成源映射：

```js
const config = {
  entry: './src/index.js',
  output: {
    // ...
  },
  devServer: {
    // ...
  },
  devtool: 'source-map', // highlight-line
  // ..
};
```

<!-- Webpack has to be restarted when we make changes to its configuration. It is also possible to make webpack watch for changes made to itself but we will not do that this time.-->
Webpack 需要在我们对它的配置做出更改时重新启动。也可以让 webpack 监视对自身所做的更改，但这次我们不会这样做。

<!-- The error message is now a lot better-->
错误消息现在要好得多了。

![devtools console showing concat error at different line](../../images/7/27.png)

<!-- since it refers to the code we wrote:-->
因为它指的是我们编写的代码：

![devtools source showing our actual code with values.concat](../../images/7/27eb.png)

<!-- Generating the source map also makes it possible to use the Chrome debugger:-->
生成源映射也使得可以使用Chrome调试器：

![devtools debugger paused just before offending line](../../images/7/28.png)

<!-- Let''s fix the bug by initializing the state of <i>values</i> as an empty array:-->
让我们通过将<i>values</i>的状态初始化为一个空数组来修复这个 bug：

```js
const App = () => {
  const [counter, setCounter] = useState(0)
  const [values, setValues] = useState([])
  // ...
}
```

### Minifying the code

<!-- When we deploy the application to production, we are using the <i>main.js</i> code bundle that is generated by webpack. The size of the <i>main.js</i> file is 1009487 bytes even though our application only contains a few lines of our code. The large file size is because the bundle also contains the source code for the entire React library. The size of the bundled code matters since the browser has to load the code when the application is first used. With high-speed internet connections, 1009487 bytes is not an issue, but if we were to keep adding more external dependencies, loading speeds could become an issue, particularly for mobile users.-->
当我们将应用程序部署到生产环境时，我们使用由webpack生成的<i>main.js</i>代码包。尽管我们的应用程序只包含几行代码，<i>main.js</i>文件的大小仍为1009487字节。文件大小很大是因为包也包含了整个React库的源代码。该包的大小很重要，因为当应用程序第一次使用时，浏览器必须加载代码。对于高速互联网连接，1009487字节不是问题，但是如果我们继续添加更多的外部依赖项，加载速度可能成为问题，特别是对于移动用户。

<!-- If we inspect the contents of the bundle file, we notice that it could be greatly optimized in terms of file size by removing all of the comments. There''s no point in manually optimizing these files, as there are many existing tools for the job.-->
如果我们检查捆绑文件的内容，我们会注意到它可以通过移除所有评论来大大优化文件大小。 手动优化这些文件没有意义，因为有许多现有的工具可以完成这项工作。

<!-- The optimization process for JavaScript files is called <i>minification</i>. One of the leading tools intended for this purpose is [UglifyJS](http://lisperator.net/uglifyjs/).-->
JavaScript 文件的优化过程称为<i>精简</i>。针对此目的的领先工具之一是[UglifyJS](http://lisperator.net/uglifyjs/)。

<!-- Starting from version 4 of webpack, the minification plugin does not require additional configuration to be used. It is enough to modify the npm script in the <i>package.json</i> file to specify that webpack will execute the bundling of the code in <i>production</i> mode:-->
从Webpack的4版本开始，压缩插件不再需要额外的配置来使用。只需要修改<i>package.json</i>文件中的npm脚本，指定Webpack以<i>production</i>模式执行代码的打包即可：

```json
{
  "name": "webpack-part7",
  "version": "0.0.1",
  "description": "practising webpack",
  "scripts": {
    "build": "webpack --mode=production", // highlight-line
    "start": "webpack serve --mode=development"
  },
  "license": "MIT",
  "dependencies": {
    // ...
  },
  "devDependencies": {
    // ...
  }
}
```

<!-- When we bundle the application again, the size of the resulting <i>main.js</i> decreases substantially:-->
当我们再次捆绑应用程序时，所得到的<i>main.js</i>的大小就大大减少了：

```bash
$ ls -l build/main.js
-rw-r--r--  1 mluukkai  ATKK\hyad-all  227651 Feb  7 15:58 build/main.js
```

<!-- The output of the minification process resembles old-school C code; all of the comments and even unnecessary whitespace and newline characters have been removed, and variable names have been replaced with a single character.-->
经过最小化处理的输出类似于老式的C代码；所有的注释甚至不必要的空格和换行符都已被去除，变量名也被替换成了单个字符。

```js
function h(){if(!d){var e=u(p);d=!0;for(var t=c.length;t;){for(s=c,c=[];++f<t;)s&&s[f].run();f=-1,t=c.length}s=null,d=!1,function(e){if(o===clearTimeout)return clearTimeout(e);if((o===l||!o)&&clearTimeout)return o=clearTimeout,clearTimeout(e);try{o(e)}catch(t){try{return o.call(null,e)}catch(t){return o.call(this,e)}}}(e)}}a.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)
```

### Development and production configuration

<!-- Next, let''s add a backend to our application by repurposing the now-familiar note application backend.-->
接下来，让我们通过重新利用现在熟悉的笔记应用后端来为我们的应用程序添加一个后端。

<!-- Let''s store the following content in the <i>db.json</i> file:-->
让我们把以下内容存储在<i>db.json</i>文件中：

```json
{
  "notes": [
    {
      "important": true,
      "content": "HTML is easy",
      "id": "5a3b8481bb01f9cb00ccb4a9"
    },
    {
      "important": false,
      "content": "Mongo can save js objects",
      "id": "5a3b920a61e8c8d3f484bdd0"
    }
  ]
}
```

<!-- Our goal is to configure the application with webpack in such a way that, when used locally, the application uses the json-server available in port 3001 as its backend.-->
我们的目标是使用webpack配置应用程序，使得本地使用时，应用程序使用端口3001上可用的json-server作为其后端。

<!-- The bundled file will then be configured to use the backend available at the <https://notes2023.fly.dev/api/notes> URL.-->
绑定的文件将被配置为使用可在<https://notes2023.fly.dev/api/notes> URL处获取的后端。

<!-- We will install <i>axios</i>, start the json-server, and then make the necessary changes to the application. For the sake of changing things up, we will fetch the notes from the backend with our [custom hook](/en/part7/custom_hooks) called _useNotes_:-->
我们将安装<i>axios</i>，启动 json-server，然后对应用程序进行必要的更改。为了改变情况，我们将使用我们的[自定义钩子](/en/part7/custom_hooks)称为_useNotes_从后端获取笔记：

```js
// highlight-start
import React, { useState, useEffect } from 'react'
import axios from 'axios'

const useNotes = (url) => {
  const [notes, setNotes] = useState([])

  useEffect(() => {
    axios.get(url).then(response => {
      setNotes(response.data)
    })
  }, [url])

  return notes
}
// highlight-end

const App = () => {
  const [counter, setCounter] = useState(0)
  const [values, setValues] = useState([])
  const url = 'https://notes2023.fly.dev/api/notes' // highlight-line
  const notes = useNotes(url) // highlight-line

  const handleClick = () => {
    setCounter(counter + 1)
    setValues(values.concat(counter))
  }

  return (
    <div className="container">
      hello webpack {counter} clicks
      <button onClick={handleClick}>press</button>
      <div>{notes.length} notes on server {url}</div> // highlight-line
    </div>
  )
}

export default App
```

<!-- The address of the backend server is currently hardcoded in the application code. How can we change the address in a controlled fashion to point to the production backend server when the code is bundled for production?-->
目前应用程序代码中将后端服务器的地址硬编码了。当编组代码用于生产时，我们如何以受控的方式更改地址以指向生产后端服务器？

<!-- Webpack''s configuration function has two parameters, <i>env</i> and <i>argv</i>. We can use the latter to find out the <i>mode</i> defined in the npm script:-->
Webpack 的配置功能有两个参数，<i>env</i> 和 <i>argv</i>。我们可以使用后者来查找 npm 脚本中定义的<i>mode</i>：

```js
const path = require('path')

const config = (env, argv) => { // highlight-line
  console.log('argv.mode:', argv.mode)
  return {
    // ...
  }
}

module.exports = config
```

<!-- Now, if we want, we can set Webpack to work differently depending on whether the application''s operating environment, or <i>mode</i>, is set to production or development.-->
现在，如果我们想要的话，我们可以根据应用程序的操作环境，或<i>模式</i>，设置为生产或开发，让Webpack有不同的工作方式。

<!-- We can also use webpack's [DefinePlugin](https://webpack.js.org/plugins/define-plugin/) for defining <i>global default constants</i> that can be used in the bundled code. Let's define a new global constant <i>BACKEND\_URL</i> that gets a different value depending on the environment that the code is being bundled for:-->
我们也可以使用webpack的[DefinePlugin](https://webpack.js.org/plugins/define-plugin/)来定义<i>全局默认常量</i>，可以在打包代码中使用。让我们定义一个新的全局常量<i>BACKEND\_URL</i>，它根据代码打包的环境获得不同的值：

```js
const path = require('path')
const webpack = require('webpack') // highlight-line

const config = (env, argv) => {
  console.log('argv', argv.mode)

  // highlight-start
  const backend_url = argv.mode === 'production'
    ? 'https://notes2023.fly.dev/api/notes'
    : 'http://localhost:3001/notes'
  // highlight-end

  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'main.js'
    },
    devServer: {
      static: path.resolve(__dirname, 'build'),
      compress: true,
      port: 3000,
    },
    devtool: 'source-map',
    module: {
      // ...
    },
    // highlight-start
    plugins: [
      new webpack.DefinePlugin({
        BACKEND_URL: JSON.stringify(backend_url)
      })
    ]
    // highlight-end
  }
}

module.exports = config
```

<!-- The global constant is used in the following way in the code:-->
在代码中以下方式使用全局常量：

```js
const App = () => {
  const [counter, setCounter] = useState(0)
  const [values, setValues] = useState([])
  const notes = useNotes(BACKEND_URL) // highlight-line

  // ...
  return (
    <div className="container">
      hello webpack {counter} clicks
      <button onClick={handleClick} >press</button>
      <div>{notes.length} notes on server {BACKEND_URL}</div> // highlight-line
    </div>
  )
}
```

<!-- If the configuration for development and production differs a lot, it may be a good idea to [separate the configuration](https://webpack.js.org/guides/production/) of the two into their own files.-->
如果开发和生产的配置差异很大，将两者的配置[分离到自己的文件](https://webpack.js.org/guides/production/)中可能是个好主意。

<!-- Now, if the application is started with the command _npm start_ in development mode, it fetches the notes from the address <http://localhost:3001/notes>. The version bundled with the command _npm run build_ uses the address <https://notes2023.fly.dev/api/notes> to get the list of notes.-->
现在，如果以开发模式使用命令_npm start_启动应用程序，它会从地址<http://localhost:3001/notes>获取笔记。 使用命令_npm run build_打包的版本使用地址<https://notes2023.fly.dev/api/notes>获取笔记列表。

<!-- We can inspect the bundled production version of the application locally by executing the following command in the <i>build</i> directory:-->
在<i>build</i> 目录中执行以下命令，我们可以在本地检查应用程序的打包生产版本：

```bash
npx static-server
```

<!-- By default, the bundled application will be available at <http://localhost:9080>.-->
默认情况下，打包应用程序可在<http://localhost:9080>获得。

### Polyfill

<!-- Our application is finished and works with all relatively recent versions of modern browsers, except for Internet Explorer. The reason for this is that, because of _axios_, our code uses [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), and no existing version of IE supports them:-->
我们的应用程序已经完成，可以在所有相对较新的现代浏览器上运行，但不包括Internet Explorer。原因是，由于_axios_，我们的代码使用[承诺](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)，而没有现有版本的IE支持它们：

![browser compatibility chart highlighting how bad internet explorer is](../../images/7/29.png)

<!-- There are many other things in the standard that IE does not support. Something as harmless as the [find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find) method of JavaScript arrays exceeds the capabilities of IE:-->
有许多其他的东西在标准中IE不支持。像JavaScript数组的[find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)方法这样的无害的东西，超出了IE的能力：

![browser compatibility chart showing IE does not support find method](../../images/7/30.png)

<!-- In these situations, it is not enough to transpile the code, as transpilation simply transforms the code from a newer version of JavaScript to an older one with wider browser support. IE understands Promises syntactically but it simply has not implemented their functionality. The _find_ property of arrays in IE is simply <i>undefined</i>.-->
在这些情况下，仅仅进行转译代码是不够的，因为转译只是将新版本的JavaScript代码转换成具有更广泛浏览器支持的旧版本。IE语法上理解Promises，但它没有实现它们的功能。IE中数组的_find_属性只是<i>未定义</i>。

<!-- If we want the application to be IE-compatible, we need to add a [polyfill](https://remysharp.com/2010/10/08/what-is-a-polyfill), which is code that adds the missing functionality to older browsers.-->
如果我们想让应用程序兼容IE，我们需要添加一个[polyfill](https://remysharp.com/2010/10/08/what-is-a-polyfill)，它是为旧浏览器添加缺失功能的代码。

<!-- Polyfills can be added with the help of [webpack and Babel](https://babeljs.io/docs/usage/polyfill/) or by installing one of many existing polyfill libraries.-->
可以通过[webpack 和 Babel](https://babeljs.io/docs/usage/polyfill/)添加polyfill，或者安装许多现有的polyfill库之一来实现。

<!-- The polyfill provided by the [promise-polyfill](https://www.npmjs.com/package/promise-polyfill) library is easy to use. We simply have to add the following to our existing application code:-->
[promise-polyfill](https://www.npmjs.com/package/promise-polyfill) 库提供的 polyfill 很容易使用。我们只需要在现有的应用程序代码中添加以下内容：

```js
import PromisePolyfill from 'promise-polyfill'

if (!window.Promise) {
  window.Promise = PromisePolyfill
}
```

<!-- If the global _Promise_ object does not exist, meaning that the browser does not support Promises, the polyfilled Promise is stored in the global variable. If the polyfilled Promise is implemented well enough, the rest of the code should work without issues.-->
如果全局_Promise_对象不存在，意味着浏览器不支持Promises，那么polyfilled Promise就存储在全局变量中。如果实现的polyfilled Promise足够好，其余的代码应该可以正常工作而不会出现问题。

<!-- One exhaustive list of existing polyfills can be found [here](https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-browser-Polyfills).-->
一份详尽的现有polyfill列表可以在[这里](https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-browser-Polyfills)找到。

<!-- The browser compatibility of different APIs can be checked by visiting [https://caniuse.com](https://caniuse.com) or [Mozilla''s website](https://developer.mozilla.org/en-US/).-->
可以通过访问[https://caniuse.com](https://caniuse.com) 或 [Mozilla的网站](https://developer.mozilla.org/en-US/) 来检查不同API的浏览器兼容性。

### Eject

<!-- The create-react-app tool uses webpack behind the scenes. If the default configuration is not enough, it is possible to [eject](https://create-react-app.dev/docs/available-scripts/#npm-run-eject) the project which will get rid of all of the black magic, and the default configuration files will be stored in the <i>config</i> directory and in a modified <i>package.json</i> file.-->
create-react-app 工具在幕后使用 webpack。如果默认配置不够，可以[弹出](https://create-react-app.dev/docs/available-scripts/#npm-run-eject)项目，这将摆脱所有的黑魔法，默认配置文件将存储在<i>config</i>目录和修改后的<i>package.json</i>文件中。

<!-- If you eject an application created with create-react-app, there is no return and all of the configurations will have to be maintained manually. The default configuration is not trivial, and instead of ejecting from a create-react-app application, a better alternative may be to write your own webpack configuration from the get-go.-->
如果你退出一个使用`create-react-app`创建的应用程序，就没有回头路了，所有的配置都必须手动维护。默认配置并不简单，与其从`create-react-app`应用程序中退出，一个更好的选择可能是从一开始就编写自己的`webpack`配置。

<!-- Going through and reading the configuration files of an ejected application is still recommended and extremely educational.-->
通过阅读已卸载应用程序的配置文件仍然是值得推荐的，并且非常有教育意义。

</div>
