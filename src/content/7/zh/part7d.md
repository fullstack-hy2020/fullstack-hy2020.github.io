---
mainImage: ../../../images/part-7.svg
part: 7
letter: d
lang: zh
---
<div class="content">


<!-- Developing with React was notorious for requiring tools that were very difficult to configure. These days, getting started with React development is almost painless thanks to [create-react-app](https://github.com/facebookincubator/create-react-app). A better development workflow has probably never existed for browser-side JavaScript development. -->
 React 开发因为需要很难配置的工具而臭名昭著。 这些天，由于[create-react-app](https://github.com/facebookincubator/create-react-app) 的存在 ，开始使用 React 开发几乎是没有痛苦的。 对于浏览器端的 JavaScript 开发，可能从来没有过更好的开发工作流。

<!-- We can not rely on the black magic of create-react-app forever and it's time for us to take a look under the hood. One of the key players in making React applications functional is a tool called [webpack](https://webpack.js.org/). -->
我们不能永远依赖f create-react-app的黑魔法，现在是时候让我们看看底层下面。 使 React 应用功能化的一个关键参与者是一个叫做[webpack](https://webpack.js.org/)的工具。


### Bundling
【捆绑】
<!-- We have implemented our applications by dividing our code into separate modules that have been <i>imported</i> to places that require them. Even though ES6 modules are defined in the ECMAScript standard, no browser actually knows how to handle code that is divided into modules. -->
我们已经实现了我们的应用，将我们的代码分割成单独的模块，这些模块已经被导入到需要它们的地方。 尽管 ES6模块是在 ECMAScript 标准中定义的，但没有浏览器真正知道如何处理划分为模块的代码。

<!-- For this reason, code that is divided into modules must be <i>bundled</i> for browsers, meaning that all of the source code files are transformed into a single file that contains all of the application code. When we deployed our React frontend to production in [第3章](/zh/part3/把应用部署到网上), we performed the bundling of our application with the _npm run build_ command. Under the hood, the npm script bundles the source code using webpack which produces the following collection of files in the <i>build</i> directory: -->
由于这个原因，被划分为模块的代码对于浏览器必须是<i>绑定的</i>，这意味着所有的源代码文件都被转换成一个包含所有应用代码的文件。 在 [第3章](/zh/part3/把应用部署到网上)中部署 React 前端生产应用时，我们执行了将应用与 npm run build 命令绑定在一起的操作。 在底层，npm 脚本使用 webpack 捆绑源代码，在<i>build</i> 目录下生成如下文件集合:

<pre>
├── asset-manifest.json
├── favicon.ico
├── index.html
├── manifest.json
├── precache-manifest.8082e70dbf004a0fe961fc1f317b2683.js
├── service-worker.js
└── static
    ├── css
    │   ├── main.f9a47af2.chunk.css
    │   └── main.f9a47af2.chunk.css.map
    └── js
        ├── 1.578f4ea1.chunk.js
        ├── 1.578f4ea1.chunk.js.map
        ├── main.8209a8f2.chunk.js
        ├── main.8209a8f2.chunk.js.map
        ├── runtime~main.229c360f.js
        └── runtime~main.229c360f.js.map
</pre>


<!-- The <i>index.html</i> file located at the root of the build directory is the "main file" of the application, that loads the bundled JavaScript file with a <i>script</i> tag (in fact there are two bundled JavaScript files): -->
位于 build 目录根目录的<i>index. html</i> 文件是应用的“ main file” ，它用<i>script</i> 标签加载绑定的 JavaScript 文件(实际上有两个绑定的 JavaScript 文件) :

```html
<!doctype html><html lang="en">
<head>
  <meta charset="utf-8"/>
  <title>React App</title>
  <link href="/static/css/main.f9a47af2.chunk.css" rel="stylesheet"></head>
<body>
  <div id="root"></div>
  <script src="/static/js/1.578f4ea1.chunk.js"></script>
  <script src="/static/js/main.8209a8f2.chunk.js"></script>
</body>
</html>
```

<!-- As we can see from the example application that was created with create-react-app, the build script also bundles the application's CSS files into a single <i>/static/css/main.f9a47af2.chunk.css</i> file. -->
我们可以从使用 create-react-app 创建的示例应用中看到，构建脚本还将应用的 CSS 文件捆绑到单个<i>/static/css/main.f9a47af2.chunk.css</i>

<!-- In practice, bundling is done so that we define an entry point for the application, which typically is the <i>index.js</i> file. When webpack bundles the code, it includes all of the code that the entry point imports, and the code that its imports import, and so on. -->
实际上，进行绑定是为了为应用定义一个入口点，通常是<i>index.js</i> 文件。 当 webpack 打包代码时，它包含入口点导入的所有代码，以及导入代码的导入，等等。

<!-- Since part of the imported files are packages like React, Redux, and Axios, the bundled JavaScript file will also contain the contents of each of these libraries. -->
由于部分导入的文件是 React、 Redux 和 Axios 之类的包，所以绑定的 JavaScript 文件也将包含这些库的内容。


> <!--The old way of dividing the application's code into multiple files was based on the fact that the <i>index.html</i> file loaded all of the separate JavaScript files of the application with the help of script tags. This resulted in  decreased performance, since the loading of each separate file results in some overhead. For this reason, these days the preferred method is to bundle the code into a single file.-->
将应用的代码划分为多个文件的老方法是基于这样一个事实，即<i>index. html</i> 文件在脚本标记的帮助下加载了应用的所有单独的 JavaScript 文件。 这导致性能下降，因为每个单独文件的加载都会导致一些开销。 出于这个原因，现在的首选方法是将代码捆绑到单个文件中。

<!-- Next, we will create a suitable webpack configuration for a React application by hand from scratch. -->
接下来，我们将从头开始为 React 应用创建一个合适的 webpack 配置。

<!-- Let's create a new directory for the project with the following subdirectories (<i>build</i> and <i>src</i>) and files: -->
让我们用如下子目录( build 和  src)和文件为项目创建一个新目录:

<pre>
├── build
├── package.json
├── src
│   └── index.js
└── webpack.config.js
</pre>



<!-- The contents of the <i>package.json</i> file can e.g. be the following: -->
 <i>package.json</i>文件的内容可以如下:

```json
{
  "name": "webpack-part7",
  "version": "0.0.1",
  "description": "practising webpack",
  "scripts": {},
  "license": "MIT"
}
```

<!-- Let's install webpack with the command: -->
让我们用下面的命令来安装 webpack:

```js
npm install --save-dev webpack webpack-cli
```

<!-- We define the functionality of webpack in the <i>webpack.config.js</i> file, which we initialize with the following content: -->
我们在<i>webpack.config.js</i> 文件中定义了 webpack 的功能，我们使用如下内容初始化它:

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

<!-- We will then define a new npm script called <i>build</i> that will execute the bundling with webpack: -->
然后我们将定义一个名为<i>build</i> 的新 npm 脚本，该脚本将执行与 webpack 的捆绑:

```js
// ...
"scripts": {
  "build": "webpack --mode=development"
},
// ...
```

<!-- Let's add some more code to the <i>src/index.js</i> file: -->
让我们在 <i>src/index.js</i> 文件中添加一些代码:

```js
const hello = name => {
  console.log(`hello ${name}`)
}
```

<!-- When we execute the _npm run build_ command our application code will be bundled by webpack. The operation will produce a new <i>main.js</i> file that is added under the <i>build</i> directory: -->
当我们执行 npm run build 命令时，我们的应用代码将被 webpack 绑定。 该操作将生成一个新的<i>main.js</i> 文件，该文件添加在<i>build</i> 目录下:

![](../../images/7/19ea.png)

<!-- The file contains a lot of stuff that looks quite interesting. We can also see the code we wrote earlier at the end of the file: -->
这个文件包含了很多看起来很有趣的东西。 我们还可以在文件末尾看到我们之前写的代码:

![](../../images/7/19eb.png)

<!-- Let's add a <i>App.js</i> file under the <i>src</i> directory with the following content: -->
让我们在<i>src</i> 目录下添加一个<i>App.js</i> 文件，内容如下:

```js
const App = () => {
  return null
}

export default App
```

<!-- Let's import and use the <i>App</i> module in the <i>index.js</i> file: -->
让我们导入并使用<i>index.js</i> 文件中的<i>App</i> 模块:

```js
import App from './App';

const hello = name => {
  console.log(`hello ${name}`)
}

App()
```

<!-- When we bundle the application again with the _npm run build_ command, we notice that webpack has acknowledged both files: -->
当我们再次将应用与 npm run build 命令捆绑在一起时，我们注意到 webpack 已经确认了这两个文件:

![](../../images/7/20ea.png)

<!-- Our application code can be found at the end of the bundle file in a rather obscure format: -->
我们的应用代码可以在 bundle 文件的末尾找到，格式相当模糊:

```js
/***/ "./src/App.js":
/*!********************!*\
  !*** ./src/App.js ***!
  \********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nconst App = () => {\n  return null\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (App);\n\n//# sourceURL=webpack:///./src/App.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _App__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./App */ \"./src/App.js\");\n\n\nconst hello = name => {\n  console.log(`hello ${name}`)\n};\n\nObject(_App__WEBPACK_IMPORTED_MODULE_0__[\"default\"])()\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })
```


### Configuration file
【配置文件】

<!-- Let's take a closer look at the contents of our current <i>webpack.config.js</i> file: -->
让我们仔细看看当前<i>webpack.config.js</i> 文件的内容:

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

<!-- The configuration file has been written in JavaScript and the configuration object is exported by using Node's module syntax.  -->
配置文件使用 JavaScript 编写，配置对象使用 Node 的模块语法导出。

<!-- Our minimal configuration definition almost explains itself. The [entry](https://webpack.js.org/concepts/#entry) property of the configuration object specifies the file that will serve as the entry point for bundling the application. -->
我们的最小配置定义几乎解释了它自己。 配置对象的[entry](https://webpack.js.org/concepts/#entry)属性指定将作为绑定应用的入口点的文件。

<!-- The [output](https://webpack.js.org/concepts/#output) property defines the location where the bundled code will be stored. The target directory must be defined as an <i>absolute path</i> which is easy to create with the [path.resolve](https://nodejs.org/docs/latest-v8.x/api/path.html#path_path_resolve_paths) method. We also use [\_\_dirname](https://nodejs.org/docs/latest/api/globals.html#globals_dirname) which is a global variable in Node that stores the path to the current directory. -->
属性定义了将要存储绑定代码的位置 [output](https://webpack.js.org/concepts/#output)。 目标目录必须被定义为<i>绝对路径</i>，这很容易用[path.resolve](https://nodejs.org/docs/latest-v8.x/api/path.html#path_path_resolve_paths)方法创建。 我们还使用了[\_\_dirname](https://nodejs.org/docs/latest/api/globals.html#globals_dirname) ，它是 Node 中的一个全局变量，用于存储到工作目录的路径。

### Bundling React
【捆绑React】
<!-- Next, let's transform our application into a minimal React application. Let's install the required libraries: -->
接下来，让我们把我们的应用转换成一个最小的 React 应用:

```bash
npm install react react-dom
```

<!-- And let's turn our application into a React application by adding the familiar definitions in the <i>index.js</i> file: -->
让我们通过在<i>index.js</i> 文件中添加熟悉的定义，将我们的应用转换为 React 应用:

```js
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

ReactDOM.render(<App />, document.getElementById('root'))
```

<!-- We will also make the following changes to the <i>App.js</i> file: -->
我们还将对<i>App.js</i> 文件进行如下更改:

```js
import React from 'react'

const App = () => (
  <div>hello webpack</div>
)

export default App
```

<!-- We still need the <i>build/index.html</i> file  that will serve as the "main page" of our application that will load our bundled JavaScript code with a <i>script</i> tag: -->
我们仍然需要<i>build/index.html</i> <i>文件，它将作为我们应用的“主页” ，用 <I>script</i> 标签加载我们打包的 JavaScript 代码:

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

<!-- When we bundle our application, we run into the following problem: -->
当我们捆绑应用时，会遇到如下问题:

![](../../images/7/21.png)


### Loaders
【装载器】
<!-- The error message from webpack states that we may need an appropriate <i>loader</i> to bundle the <i>App.js</i> file correctly. By default, webpack only knows how to deal with plain JavaScript. Although we may have become unaware of it, we are actually using [JSX](https://facebook.github.io/jsx/) for rendering our views in React. To illustrate this, the following code is not regular JavaScript: -->
来自 webpack 的错误消息指出，我们可能需要一个适当的<i>loader</i> 来正确捆绑<i>App.js</i> 文件。 默认情况下，webpack 只知道如何处理普通的 JavaScript。 尽管我们可能没有意识到这一点，但我们实际上正在使用[JSX](https://facebook.github.io/JSX/)在 React 中渲染我们的视图。 为了说明这一点，下面的代码不是普通的 JavaScript:

```js
const App = () => {
  return <div>hello webpack</div>
}
```

<!-- The syntax used above comes from JSX and it provides us with an alternative way of defining a React element for an html <i>div</i> tag. -->
上面使用的语法来自 JSX，它为我们提供了为 html <i>div</i> 标签定义 React 元素的替代方法。

<!-- We can use [loaders](https://webpack.js.org/concepts/loaders/) to inform webpack of the files that need to be processed before they are bundled. -->
我们可以使用[装载器](https://webpack.js.org/concepts/loaders/)来告知 webpack 需要在捆绑之前处理的文件。

<!-- Let's configure a loader to our application that transforms the JSX code into regular JavaScript: -->
让我们为应用配置一个装载器，将 JSX 代码转换为常规的 JavaScript:

```js
const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'main.js',
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
```

<!-- Loaders are defined under the <i>module</i> property in the <i>rules</i> array. -->
装载器是在<i>rules</i> 数组中的<i>module</i> 属性下定义的。

<!-- The definition for a single loader consists of three parts: -->
单一装载器的定义包括三个部分:

```js
{
  test: /\.js$/,
  loader: 'babel-loader',
  options: {
    presets: ['@babel/preset-react']
  }
}
```

<!-- The <i>test</i> property specifies that the loader is for files that have names ending with <i>.js</i>. The <i>loader</i> property specifies that the processing for those files will be done with [babel-loader](https://github.com/babel/babel-loader). The <i>query</i> property is used for specifying parameters for the loader, that configure its functionality. -->
 <i>test</i> 属性指定加载程序用于名称以<i>.js</i> 结尾的文件。 属性指定对这些文件的处理将通过[babel-loader](https://github.com/babel/babel-loader)来完成。<i>options</i> 属性用于为加载程序指定参数，用于配置其功能。

<!-- Let's install the loader and its required packages as a <i>development dependency</i>: -->
让我们将装载器及其所需的包作为<i>开发依赖项</i> 安装:

```js
npm install @babel/core babel-loader @babel/preset-react --save-dev
```

<!-- Bundling the application will now succeed. -->
捆绑应用现在将获得成功。

<!-- If we make some changes to the <i>App</i> component and take a look at the bundled code, we notice that the bundled version of the component looks like this: -->
如果我们对<i>App</i> 组件进行一些修改，并查看捆绑的代码，我们会注意到该组件的捆绑版本如下所示:

```js
const App = () =>
  react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
    'div',
    null,
    'hello webpack'
  )
```

<!-- As we can see from the example above, the React elements that were written in JSX are now created with regular JavaScript by using React's [createElement](https://reactjs.org/docs/react-without-jsx.html) function. -->
正如我们从上面的例子中看到的，在 JSX 中编写的 React 元素现在通过 React 的[createElement](https://reactjs.org/docs/React-without-JSX.html)函数使用常规的 JavaScript 创建。

<!-- You can test the bundled application by opening the <i>build/index.html</i> file with the <i>open file</i> functionality of your browser: -->
你可以通过浏览器的<i>open file</i> 功能打开 <i>build/index.html</i>文件来测试捆绑的应用:

![](../../images/7/22.png)



<!-- It's worth noting that if the bundled application's source code uses <i>async/await</i>, the browser will not render anything on some browsers. [Googling the error message in the console](https://stackoverflow.com/questions/33527653/babel-6-regeneratorruntime-is-not-defined) will shed some light on the issue. We have to install one more missing dependency, that is [@babel/polyfill](https://babeljs.io/docs/en/babel-polyfill): -->
值得注意的是，如果捆绑的应用的源代码使用<i>async/await</i>，浏览器将不会在某些浏览器上渲染任何内容。 [谷歌在控制台中搜索错误信息](https://stackoverflow.com/questions/33527653/babel-6-regeneratorruntime-is-not-defined)将会在这个问题上给出一些答案。 我们必须再安装一个缺失的依赖项，即[@babel/polyfill](https://babeljs.io/docs/en/babel-polyfill) :

```bash
npm install @babel/polyfill
```

<!-- Let's make the following changes to the <i>entry</i> property of the webpack configuration object in the <i>webpack.config.js</i> file: -->
让我们对<i>webpack.config.js</i> 文件中的 webpack 配置对象的<i>entry</i> 属性进行如下更改:

```js
  entry: ['@babel/polyfill', './src/index.js']
```

<!-- Our configuration contains nearly everything that we need for React development. -->
我们的配置几乎包含了 React 开发所需的所有东西。

### Transpilers
【转译工具】

<!-- The process of transforming code from one form of JavaScript to another is called [transpiling](https://en.wiktionary.org/wiki/transpile). The general definition of the term is to compile source code by transforming it from one language to another. -->
将代码从一种 JavaScript 形式转换为另一种 JavaScript 形式的过程称为[transpiling](https://en.wiktionary.org/wiki/transpile)。 该术语的一般定义是通过将源代码从一种语言转换为另一种语言来编译源代码。

<!-- By using the configuration from the previous section we are <i>transpiling</i> the code containing JSX into regular JavaScript with the help of [babel](https://babeljs.io/), which is currently the most popular tool for the job. -->
通过使用上一节中的配置，我们在[babel](https://babeljs.io/ 语言)的帮助下将包含 JSX 的代码转换为常规 JavaScript，这是目前最流行的工具。

<!-- As mentioned in part 1, most browsers do not support the latest features that were introduced in ES6 and ES7, and for this reason the code is usually transpiled to a version of JavaScript that implements the ES5 standard. -->
正如第一章节中提到的，大多数浏览器不支持 ES6和 ES7中引入的最新特性，因此代码通常会转移到实现 ES5标准的 JavaScript 版本中。

<!-- The transpilation process that is executed by Babel is defined with <i>plugins</i>. In practice, most developers use ready-made [presets](https://babeljs.io/docs/plugins/) that are groups of pre-configured plugins. -->
通过<i>plugins</i> 定义了 Babel 执行的转译过程。 实际上，大多数开发人员使用的是现成的[预设](https://babeljs.io/docs/plugins/)插件，这些插件是一组预先配置的插件。

<!-- Currently we are using the [@babel/preset-react](https://babeljs.io/docs/plugins/preset-react/) preset for transpiling the source code of our application: -->
目前，我们正在使用[@babel/preset-react](https://babeljs.io/docs/plugins/preset-react/)预设来转译我们应用的源代码:

```js
{
  test: /\.js$/,
  loader: 'babel-loader',
  options: {
    presets: ['@babel/preset-react'] // highlight-line
  }
}
```


<!-- Let's add the [@babel/preset-env](https://babeljs.io/docs/plugins/preset-env/) plugin that contains everything needed to take code using all of the latest features and transpile it to code that is compatible with the ES5 standard: -->
让我们添加一个[@babel/pressing-env](https://babeljs.io/docs/plugins/preset-env/)插件，它包含使用所有最新特性编写代码并将其转化为兼容 ES5标准的代码所需的所有内容:

```js
{
  test: /\.js$/,
  loader: 'babel-loader',
  options: {
    presets: ['@babel/preset-env', '@babel/preset-react'] // highlight-line
  }
}
```

<!-- Let's install the preset with the command: -->
让我们用下面的命令来安装预置:

```js
npm install @babel/preset-env --save-dev
```

<!-- When we transpile the code it gets transformed into old-school JavaScript. The definition of the transformed <i>App</i> component looks like this: -->
当我们将代码转换为传统的 JavaScript 时。 转换后的<i>App</i> 组件的定义如下:

```js
var App = function App() {
  return _react2.default.createElement('div', null, 'hello webpack')
};
```

<!-- As we can see, variables are declared with the _var_ keyword as ES5 JavaScript does not understand the _const_ keyword. Arrow functions are also not used, which is why the function definition used the _function_ keyword. -->
正如我们看到的，变量是用 var 关键字声明的，因为 ES5 JavaScript 不理解 const 关键字。 也不使用箭头函数，这就是为什么函数定义使用函数关键字的原因。

### CSS


<!-- Let's add some CSS to our application. Let's create a new <i>src/index.css</i> file: -->
让我们向我们的应用添加一些 CSS:

```css
.container {
  margin: 10;
  background-color: #dee8e4;
}
```

<!-- Then let's use the style in the <i>App</i> component: -->
然后让我们使用<i>App</i> 组件中的样式:

```js
const App = () => {
  return (
    <div className="container">
      hello webpack
    </div>
  )
}
```

<!-- And we import the style in the <i>index.js</i> file: -->
我们在<i>index.js</i> 文件中导入样式:

```js
import './index.css'
```

<!-- This will cause the transpilation process to break: -->
这将导致转译过程中断:

![](../../images/7/23.png)



<!-- When using CSS, we have to use [css](https://webpack.js.org/loaders/css-loader/) and [style](https://webpack.js.org/loaders/style-loader/) loaders: -->
当使用 CSS 时，我们必须使用[CSS](CSS  https://webpack.js.org/loaders/CSS-loader/)和[style](https://webpack.js.org/loaders/style-loader/)装载器:

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

<!-- The job of the [css loader](https://webpack.js.org/loaders/css-loader/) is to load the <i>CSS</i> files and the job of the [style loader](https://webpack.js.org/loaders/style-loader/) is to generate and inject a <i>style</i> element that contains all of the styles of the application. -->
[css loader](https://webpack.js.org/loaders/css-loader/)的工作是加载<i>CSS</i> 文件，  [style loader](https://webpack.js.org/loaders/style-loader/)的工作是生成并注入一个<i>style</i> 元素，该元素包含应用的所有样式。

<!-- With this configuration the CSS definitions are included in the <i>main.js</i> file of the application. For this reason there is no need to separately import the <i>CSS</i> styles in the main <i>index.html</i> file of the application. -->
使用这种配置，CSS 定义包含在应用的<i>main.js</i> 文件中。 出于这个原因，不需要单独导入应用的主要<i>index. html</i> 文件中的<i>CSS</i> 样式。

<!-- If needed, the application's CSS can also be generated into its own separate file by using the [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin). -->
如果需要，应用的 CSS 也可以通过使用[mini-CSS-extract-plugin](https://github.com/webpack-contrib/mini-CSS-extract-plugin 文件)生成到它自己的独立文件中。

<!-- When we install the loaders: -->
当我们安装装载器时:

```js
npm install style-loader css-loader --save-dev
```

<!-- The bundling will succeed once again and the application gets new styles.  -->
捆绑将再次成功，应用将获得新的样式。

### Webpack-dev-server


<!-- The current configuration makes it possible to develop our application but the workflow is awful (to the point where it resembles the development workflow with Java). Every time we make a change to the code we have to bundle it and refresh the browser in order to test the code. -->
当前的配置使得开发我们的应用成为可能，但是工作流非常糟糕(以至于它类似于 Java 的开发工作流)。 每次我们对代码进行修改时，我们必须将它捆绑起来并刷新浏览器以测试代码。

<!-- The [webpack-dev-server](https://webpack.js.org/guides/development/#using-webpack-dev-server) offers a solution to our problems. Let's install it with the command: -->
 [webpack-dev-server](https://webpack.js.org/guides/development/#using-webpack-dev-server) 为我们的问题提供了一个解决方案:

```js
npm install --save-dev webpack-dev-server
```

<!-- Let's define an npm script for starting the dev-server: -->
让我们定义一个 npm 脚本来启动 dev-server:

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

<!-- Let's also add a new <i>devServer</i> property to the configuration object in the <i>webpack.config.js</i> file: -->
我们还可以在<i>webpack.config.js</i> 文件的配置对象中添加一个新的<i>devServer</i> 属性:

```js
const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'main.js',
  },
  // highlight-start
  devServer: {
    contentBase: path.resolve(__dirname, 'build'),
    compress: true,
    port: 3000,
  },
  // highlight-end
  // ...
};
```

<!-- The _npm start_ command will now start the dev-server at the port 3000, meaning that our application will be available by visiting <http://localhost:3000> in the browser. When we make changes to the code, the browser will automatically refresh the page. -->
Npm start 命令现在将在端口3000启动 dev-server，这意味着我们的应用将可以通过浏览器中的 <http://localhost:3000> 访问。 当我们修改代码时，浏览器会自动刷新页面。 

<!-- The process for updating the code is fast. When we use the dev-server, the code is not bundled the usual way into the <i>main.js</i> file. The result of the bundling exists only in memory. -->
更新代码的过程很快。 当我们使用 dev-server 时，代码不会以通常的方式捆绑到<i>main.js</i> 文件中。 捆绑的结果只存在于内存中。

<!-- Let's extend the code by changing the definition of the <i>App</i> component as shown below: -->
让我们通过更改<i>App</i> 组件的定义来扩展代码，如下所示:

```js
import React, {useState} from 'react'

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

<!-- It's worth noticing that the error messages don't show up the same way as they did with our applications that were made using create-react-app. For this reason we have to pay more attention to the console: -->
值得注意的是，错误消息的显示方式与使用 create-react-app 创建的应用不同。 出于这个原因，我们必须更加关注控制台:

![](../../images/7/24.png)



<!-- The application works nicely and the development workflow is quite smooth. -->
应用运行良好，开发工作流程相当流畅。


### Source maps


<!-- Let's extract the click handler into its own function and store the previous value of the counter into its own <i>values</i> state: -->
让我们将 click 处理程序提取到它自己的函数中，并将计数器先前的值存储到它自己的<i>values</i> 状态中:

```js
const App = () => {
  const [counter, setCounter] = useState(0)
  const [values, setValues] = useState() // highlight-line

  const handleClick = () => {
    setCounter(counter + 1)
    setValues(values.concat(counter)) // highlight-line
  }

  return (
    <div className="container">
      hello webpack {counter} clicks
      <button onClick={handleClick}>
        press
      </button>
    </div>
  )
}
```

<!-- The application no longer works and the console will display the following error: -->
应用不再工作，控制台将显示如下错误:

![](../../images/7/25.png)

<!-- We know that the error is in the onClick method, but if the application was any larger the error message would be quite difficult to track down: -->
我们知道错误在 onClick 方法中，但是如果应用再大一点，错误消息就很难追踪了:

<pre>
App.js:27 Uncaught TypeError: Cannot read property 'concat' of undefined
    at handleClick (App.js:27)
</pre>
<!-- The location of the error indicated in the message does not match the actual location of the error in our source code. If we click the error message, we notice that the displayed source code does not resemble our application code: -->
消息中说明的错误位置与源代码中错误的实际位置不匹配。 如果我们单击错误消息，我们会注意到显示的源代码与我们的应用代码不同:

![](../../images/7/26.png)

<!-- Of course, we want to see our actual source code in the error message. -->
当然，我们希望在错误消息中看到实际的源代码。

<!-- Luckily fixing the error message in this respect is quite easy. We will ask webpack to generate a so-called [source map](https://webpack.js.org/configuration/devtool/) for the bundle, that makes it possible to <i>map errors</i> that occur during the execution of the bundle to the corresponding part in the original source code. -->
幸运的是，在这方面修复错误消息非常容易。 我们将要求 webpack 为捆绑包生成一个所谓的[源映射](https://webpack.js.org/configuration/devtool/) ，这样就可以将捆绑包执行期间发生的错误映射到原始源代码中的相应部分。

<!-- The source map can be generated by adding a new <i>devtool</i> property to the configuration object with the value 'source-map': -->
可以通过向配置对象添加一个新的<i>devtool</i> 属性来生成源映射，其值为‘ source-map’ :

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

<!-- Webpack has to be restarted when we make changes to its configuration. It is also possible to make webpack watch for changes made to itself but we will not do that this time. -->
当我们修改 Webpack 的配置时，必须重新启动它。 也可以让 webpack 观察自身的变化，但这次我们不会这么做。

<!-- The error message is now a lot better  -->
错误消息现在好多了

![](../../images/7/27.png)

<!-- since it refers to the code we wrote -->
因为它指的是我们写的代码

![](../../images/7/27eb.png)

<!-- Generating the source map also makes it possible to use the Chrome debugger: -->
生成源地图也使得使用 Chrome 调试器成为可能:

![](../../images/7/28.png)

<!-- Let's fix the bug by initializing the state of <i>values</i> as an empty array: -->
让我们通过将<i>values</i> 的状态初始化为一个空数组来修复这个 bug:

```js
const App = () => {
  const [counter, setCounter] = useState(0)
  const [values, setValues] = useState([])
  // ...
}
```

### Minifying the code
【压缩代码】
<!-- When we deploy the application to production, we are using the <i>main.js</i> code bundle that is generated by webpack. The size of the <i>main.js</i> file is 974473 bytes even though our application only contains a few lines of our own code. The large file size is due to the fact that the bundle also contains the source code for the entire React library. The size of the bundled code matters since the browser has to load the code when the application is first used. With high-speed internet connections 974473 bytes is not an issue, but if we were to keep adding more external dependencies, loading speeds could become an issue particularly for mobile users. -->
在将应用部署到生产环境时，我们使用的是 webpack 生成的<i>main.js</i> 代码包。 Js 文件的大小为974473字节，尽管我们的应用只包含几行我们自己的代码。 文件大小较大是因为 bundle 还包含整个 React 库的源代码。 捆绑代码的大小很重要，因为浏览器必须在第一次使用应用时加载代码。 对于高速互联网连接，974473字节不是问题，但是如果我们继续增加更多的外部依赖，加载速度可能会成为一个问题，特别是对于移动用户。

<!-- If we inspect the contents of the bundle file, we notice that it could be greatly optimized in terms of file size by removing all of the comments. There's no point in manually optimizing these files, as there are many existing tools for the job. -->
如果我们检查 bundle 文件的内容，我们注意到通过删除所有便笺，可以在文件大小方面大大优化它。 手动优化这些文件是没有意义的，因为有许多现有的工具可以完成这项工作。

<!-- The optimization process for JavaScript files is called <i>minification</i>. One of the leading tools intended for this purpose is [UglifyJS](http://lisperator.net/uglifyjs/). -->
Javascript 文件的优化过程被称为<i>minification</i>，用于此目的的主要工具之一是[UglifyJS](http://lisperator.net/UglifyJS/)。 

<!-- Starting from version 4 of webpack, the minification plugin does not require additional configuration to be used. It is enough to modify the npm script in the <i>package.json</i> file to specify that webpack will execute the bundling of the code in <i>production</i> mode: -->
从版本4的webpack，缩小插件不需要额外的配置使用。 修改<i>package.json</i> 文件中的 npm 脚本就足以指定 webpack 将在<i>production</i>模式下执行代码的捆绑:

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

<!-- When we bundle the application again, the size of the resulting <i>main.js</i> decreases substantially: -->
当我们再次捆绑应用时，得到的<i>main.js</i> 的大小会大幅减小:

```js
$ ls -l build/main.js
-rw-r--r--  1 mluukkai  984178727  132299 Feb 16 11:33 build/main.js
```

<!-- The output of the minification process resembles old-school C code; all of the comments and even unnecessary whitespace and newline characters have been removed, and variable names have been replaced with a single character. -->
缩小过程的输出类似于老式的 c 代码; 所有的便笺、甚至不必要的空格和换行符都被删除了，变量名被单个字符替换。

```js
function h(){if(!d){var e=u(p);d=!0;for(var t=c.length;t;){for(s=c,c=[];++f<t;)s&&s[f].run();f=-1,t=c.length}s=null,d=!1,function(e){if(o===clearTimeout)return clearTimeout(e);if((o===l||!o)&&clearTimeout)return o=clearTimeout,clearTimeout(e);try{o(e)}catch(t){try{return o.call(null,e)}catch(t){return o.call(this,e)}}}(e)}}a.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)
```

### Development and production configuration
【开发及生产配置】
<!-- Next, let's add a backend to our application by repurposing the now-familiar note application backend. -->
接下来，让我们为应用添加一个后端程序，来重用我们已经很熟悉的 note 应用的后端。

<!-- Let's store the following content in the <i>db.json</i> file: -->
让我们在<i>db.json</i> 文件中存储如下内容:

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

<!-- Our goal is to configure the application with webpack in such a way that, when used locally, the application uses the json-server available in port 3001 as its backend. -->
我们的目标是以这样一种方式配置应用，即当在本地使用时，应用使用端口3001中可用的 json-server 作为其后端。

<!-- The bundled file will then be configured to use the backend available at the <https://blooming-atoll-75500.herokuapp.com/api/notes> url. -->
然后将绑定的文件配置为使用 <https://blooming-atoll-75500.herokuapp.com/api/notes> 地址中可用的后端。

<!-- We will install <i>axios</i>, start the json-server, and then make the necessary changes to the application. For the sake of changing things up, we will fetch the notes from the backend with our [custom hook](/zh/part5/custom_hooks) called _useNotes_: -->
我们将安装<i>axios</i>，启动 json-server，然后对应用进行必要的更改。 为了更改内容，我们将使用名为 useNotes 的[custom hook](/zh/part7/custom_hooks)从后端获取便笺:

```js
import React, { useState, useEffect } from 'react'
import axios from 'axios'

// highlight-start
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
  const url = 'https://blooming-atoll-75500.herokuapp.com/api/notes'
  const notes = useNotes(url) // highlight-line

  const handleClick = () => {
    setCounter(counter + 1)
    setValues(values.concat(counter))
  }

  return (
    <div className="container">
      hello webpack {counter} clicks
      <button onClick={handleClick} >press</button>
      <div>{notes.length} notes on server {url}</div> // highlight-line
    </div>
  )
}

export default App
```

<!-- The address of the backend server is currently hardcoded in the application code. How can we change the address in a controlled fashion to point to the production backend server when the code is bundled for production? -->
后端服务器的地址目前在应用代码中是硬编码的。 当代码为生产打包时，我们如何以受控的方式更改地址以指向生产后端服务器？

<!-- Let's change the configuration object in the <i>webpack.config.js</i> file to be a function instead of an object: -->
让我们将<i>webpack.js</i> 文件中的配置对象更改为函数而不是对象:

```js
const path = require('path');

const config = (env, argv) => {
  return {
    entry: './src/index.js',
    output: {
      // ...
    },
    devServer: {
      // ...
    },
    devtool: 'source-map',
    module: {
      // ...
    },
    plugins: [
      // ...
    ],
  }
}

module.exports = config
```

<!-- The definition remains almost exactly the same, except for the fact that the configuration object is now returned by the function. The function receives the two parameters, <i>env</i> and <i>argv</i>, the second of which can be used for accessing the <i>mode</i> that is defined in the npm script.  -->
定义几乎保持不变，除了配置对象现在由函数返回这一事实。 函数接收两个参数， <i>env</i> 和 <i>argv</i>，第二个参数可用于访问在 npm 脚本中定义的<i>mode</i>。

<!-- We can also use webpack's [DefinePlugin](https://webpack.js.org/plugins/define-plugin/) for defining <i>global default constants</i> that can be used in the bundled code. Let's define a new global constant <i>BACKEND\_URL</i>, that gets a different value depending on the environment that the code is being bundled for: -->
我们也可以使用 webpack 的[DefinePlugin](https://webpack.js.org/plugins/define-plugin/)来定义<i>全局默认常量</i>，这些常量可以用在捆绑的代码中。 让我们定义一个新的全局常量<i>BACKEND\_URL</i>，它的值取决于打包代码的环境:

```js
const path = require('path')
const webpack = require('webpack') // highlight-line

const config = (env, argv) => {
  console.log('argv', argv.mode)

  // highlight-start
  const backend_url = argv.mode === 'production'
    ? 'https://blooming-atoll-75500.herokuapp.com/api/notes'
    : 'http://localhost:3001/api/notes'
  // highlight-end

  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'main.js'
    },
    devServer: {
      contentBase: path.resolve(__dirname, 'build'),
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


<!-- The global constant is used in the following way in the code: -->
全局常量在代码中如下列方式使用:

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

<!-- If the configuration for development and production differs a lot, it may be a good idea to [separate the configuration](https://webpack.js.org/guides/production/) of the two into their own files. -->
如果开发和生产的配置有很大的不同，那么将两者的配置分离到[各自的配置文件](https://webpack.js.org/guides/production/) 中可能是一个不错的主意

<!-- We can inspect the bundled production version of the application locally by executing the following command in the <i>build</i> directory: -->
通过在<i>build</i> 目录中执行如下命令，我们可以在本地检查应用的捆绑生产版本:

```js
npx static-server
```

<!-- By default the bundled application will be available at <http://localhost:9080>. -->
默认情况下，捆绑的应用将在  <http://localhost:9080> 提供。

### Polyfill


<!-- Our application is finished and works with all relatively recent versions of modern browsers, with the exception of Internet Explorer. The reason for this is that because of _axios_ our code uses [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), and no existing version of IE supports them: -->
我们的应用已经完成，并且可以与所有相对较新的现代版本的浏览器一起工作，除了 Internet Explorer 浏览器。 这是因为我们的代码使用了 axios [Promises](https://developer.mozilla.org/en-us/docs/web/javascript/reference/global_objects/promise) ，并且现有的 IE 版本都不支持它们:

![](../../images/7/29.png)



<!-- There are many other things in the standard that IE does not support. Something as harmless as the [find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find) method of JavaScript arrays exceeds the capabilities of IE: -->
在标准中还有很多 IE 不支持的东西。 一些像 JavaScript 数组的[find](https://developer.mozilla.org/en-us/docs/web/JavaScript/reference/global_objects/array/find)方法一样无害的东西超过了 IE 的能力:

![](../../images/7/30.png)



<!-- In these situations it is not enough to transpile the code, as transpilation simply transforms the code from a newer version of JavaScript to an older one with wider browser support. IE understands Promises syntactically but it simply has not implemented their functionality. The _find_ property of arrays in IE is simply <i>undefined</i>. -->
在这些情况下，仅仅透露代码是不够的，因为透露只是将代码从一个新版本的 JavaScript 转换到一个有更广泛的浏览器支持的旧版本。 在语法上理解 Promises，但是还没有实现他们的功能。 Ie 中数组的 find 属性只是<i>undefined</i>。

<!-- If we want the application to be IE-compatible we need to add a [polyfill](https://remysharp.com/2010/10/08/what-is-a-polyfill), which is code that adds the missing functionality to older browsers. -->
如果我们希望应用兼容 ie，我们需要添加一个[polyfill](https://remysharp.com/2010/10/08/what-is-a-polyfill 夹) ，这是代码添加缺少的功能到旧的浏览器。

<!-- Polyfills can be added with the help of [webpack and Babel](https://babeljs.io/docs/usage/polyfill/) or by installing one of many existing polyfill libraries. -->
Polyfills 可以在[webpack and Babel](https://babeljs.io/docs/usage/polyfill/)的帮助下添加，也可以安装现有的多填充库中的一个。 

<!-- The polyfill provided by the [promise-polyfill](https://www.npmjs.com/package/promise-polyfill) library is easy to use, we simply have to add the following to our existing application code: -->
由[promise-polyfill](https://www.npmjs.com/package/promise-polyfill)库提供的polyfills很容易使用，我们只需在现有的应用代码中添加如下内容:

```js
import PromisePolyfill from 'promise-polyfill'

if (!window.Promise) {
  window.Promise = PromisePolyfill
}
```

<!-- If the global _Promise_ object does not exist, meaning that the browser does not support Promises, the polyfilled Promise is stored in the global variable. If the polyfilled Promise is implemented well enough, the rest of the code should work without issues. -->
如果全局 Promise 对象不存在，这意味着浏览器不支持 Promises，则 polyfilled Promise 存储在全局变量中。 如果 polyfilled Promise 实现得足够好，那么剩下的代码应该可以正常工作。

<!-- One exhaustive list of existing polyfills can be found [here](https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-browser-Polyfills). -->
一个现有polyfills的详尽列表可以在这里 [here](https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-browser-Polyfills)找到。

<!-- The browser compatibility of different API's can be checked by visiting [https://caniuse.com](https://caniuse.com) or [Mozilla's website](https://developer.mozilla.org/en-US/). -->
不同 API 的浏览器兼容性可以通过访问[https://caniuse.com](https://caniuse.com) 或者[Mozilla 网站](https://developer.Mozilla.org/en-us/)来检查。

### Eject
<!-- The create-react-app tool uses webpack behind the scenes. If the default configuration is not enough, it is possible to [eject](https://create-react-app.dev/docs/available-scripts/#npm-run-eject) the project which will get rid of all of the black magic, and the default configuration files will be stored in the <i>config</i> directory and in a modified <i>package.json</i> file. -->
Create-react-app 工具在幕后使用 webpack。 如果缺省配置不够，可以[eject](https://create-react-app.dev/docs/available-scripts/#npm-run-eject)这个项目，它将摆脱所有的黑魔法，并且缺省配置文件将存储在<i>config</i> 目录和一个修改过的<i>package.json</i> 文件中。 

<!-- If you eject an application created with create-react-app, there is no return and all of the configuration will have to be maintained manually. The default configuration is not trivial, and instead of ejecting from a create-react-app application, a better alternative may be to write your own webpack configuration from the get-go. -->
如果您eject一个用 create-react-app 创建的应用，就不会返回，所有的配置都必须手动维护。 默认配置并不简单，与其从 create-react-app中eject，不如从一开始就编写自己的 webpack 配置。

<!-- Going through and reading the configuration files of an ejected application is still recommended and extremely educational. -->
检查和读取eject应用的配置文件仍然是推荐的，而且非常有教育意义。

</div>


<div class="tasks">



### Exercises
练习


<!-- One exercise related to the topics presented here, can be found at the end of this course material section in the exercise set [for extending the blog list application](/zh/part7/练习：扩展你的博客列表). -->
一个与这里提到的议题相关的练习，可以在本课程材料部分的练习集[for extending the blog list application](/zh/part7/练习：扩展你的博客列表)的最后找到。


</div>

