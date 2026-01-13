---
mainImage: ../../../images/part-3.svg
part: 3
letter: d
lang: zh
---

<div class="content">

<!-- There are usually constraints that we want to apply to the data that is stored in our application's database. Our application shouldn't accept notes that have a missing or empty <i>content</i> property. The validity of the note is checked in the route handler: -->
我们通常希望对存储在应用程序数据库中的数据应用一些约束。我们的应用程序不应接受 <i>content</i> 属性缺失或为空的笔记。现在笔记的有效性在路由处理函数中检查：

```js
app.post('/api/notes', (request, response) => {
  const body = request.body
  // highlight-start
  if (!body.content) {
    return response.status(400).json({ error: 'content missing' })
  }
  // highlight-end

  // ...
})
```

<!-- If the note does not have the <i>content</i> property, we respond to the request with the status code <i>400 bad request</i>. -->
如果笔记没有 <i>content</i> 属性，我们就以 <i>400 bad request</i> 的状态码响应请求。

<!-- One smarter way of validating the format of the data before it is stored in the database is to use the [validation](https://mongoosejs.com/docs/validation.html) functionality available in Mongoose. -->
在数据存储到数据库之前验证数据格式的一种更智能的方法是使用 Mongoose 提供的[验证](https://mongoosejs.com/docs/validation.html)功能。

<!-- We can define specific validation rules for each field in the schema: -->
我们可以为模式中的每个字段定义特定的验证规则：

```js
const noteSchema = new mongoose.Schema({
  // highlight-start
  content: {
    type: String,
    minLength: 5,
    required: true
  },
  // highlight-end
  important: Boolean
})
```

<!-- The <i>content</i> field is now required to be at least five characters long and it is set as required, meaning that it can not be missing. We have not added any constraints to the <i>important</i> field, so its definition in the schema has not changed. -->
现在 <i>content</i> 字段要求至少五个字符长，并且被设为 required，意味着字段不能缺失。我们没有对 <i>important</i> 字段添加任何约束，所以它在模式中的定义没有改变。

<!-- The <i>minLength</i> and <i>required</i> validators are [built-in](https://mongoosejs.com/docs/validation.html#built-in-validators) and provided by Mongoose. The Mongoose [custom validator](https://mongoosejs.com/docs/validation.html#custom-validators) functionality allows us to create new validators if none of the built-in ones cover our needs. -->
<i>minLength</i> 和 <i>required</i> 验证器是 Mongoose 提供的[内置](https://mongoosejs.com/docs/validation.html#built-in-validators)的验证器。如果内置的验证器全都无法满足我们的需求，我们还可以用 Mongoose 的[自定义验证器](https://mongoosejs.com/docs/validation.html#custom-validators)功能创建新的验证器。

<!-- If we try to store an object in the database that breaks one of the constraints, the operation will throw an exception. Let's change our handler for creating a new note so that it passes any potential exceptions to the error handler middleware: -->
如果我们试图在数据库中存储一个违反了某些约束的对象，操作将会抛出异常。让我们更改创建新笔记的处理函数，来将任何可能的异常传递给错误处理中间件：

```js
app.post('/api/notes', (request, response, next) => { // highlight-line
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => next(error)) // highlight-line
})
```

<!-- Let's expand the error handler to deal with these validation errors: -->
让我们扩展错误处理函数来处理这些验证错误：

```js
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') { // highlight-line
    return response.status(400).json({ error: error.message }) // highlight-line
  }

  next(error)
}
```

<!-- When validating an object fails, we return the following default error message from Mongoose: -->
当对象验证失败时，我们返回以下 Mongoose 的默认错误消息：

![postman显示错误消息](../../images/3/50.png)

<!-- ### Deploying the database backend to production -->
### 将数据库后端部署到生产环境

<!-- The application should work almost as-is in Fly.io/Render. We do not have to generate a new production build of the frontend since changes thus far were only on our backend. -->
该应用程序应该能在 Fly.io/Render 上按原样工作。由于到目前为止我们只对后端进行了修改，所以我们不需要构建前端的新生产版本。

<!-- The environment variables defined in dotenv will only be used when the backend is not in <i>production mode</i>, i.e. Fly.io or Render. -->
dotenv 中定义的环境变量只会在后端不处于<i>生产模式</i>，即不在 Fly.io 或 Render 中时使用。

<!-- For production, we have to set the database URL in the service that is hosting our app. -->
对于生产环境，我们需要在托管我们应用的服务中设置数据库 URL。

<!-- In Fly.io that is done _fly secrets set_: -->
在 Fly.io 中，可以通过 _fly secrets set_ 命令来完成：

```bash
fly secrets set MONGODB_URI='mongodb+srv://fullstack:thepasswordishere@cluster0.a5qfl.mongodb.net/noteApp?retryWrites=true&w=majority'
```

<!-- When the app is being developed, it is more than likely that something fails. Eg. when I deployed my app for the first time with the database, not a single note was seen: -->
在开发应用的过程中，很可能会出现一些失败的情况。例如，当我第一次部署带有数据库的应用时，一个笔记都没有看到：

![浏览器显示没有出现任何笔记](../../images/3/fly-problem1.png)

<!-- The network tab of the browser console revealed that fetching the notes did not succeed, the request just remained for a long time in the _pending_ state until it failed with status code 502. -->
浏览器控制台的网络标签页显示并未成功获取笔记，请求只是在 _pending_ 状态下停留了很长时间，最后以 502 状态码失败。

<!-- The browser console has to be open <i>all the time!</i> -->
必须<i>始终</i>打开浏览器控制台！

<!-- It is also vital to follow continuously the server logs. The problem became obvious when the logs were opened with  _fly logs_: -->
同时，持续关注服务端日志也非常重要。当我用 _fly logs_ 打开日志时，问题就显而易见了：

![fly.io服务器日志显示连接到未定义](../../images/3/fly-problem3.png)

<!-- The database url was _undefined_, so the command *fly secrets set MONGODB\_URI* was forgotten. -->
数据库 URL 是 _undefined_ ，所以是忘记执行 *fly secrets set MONGODB\_URI* 命令了。

<!-- You will also need to whitelist the fly.io app's IP address in MongoDB Atlas. If you don't MongoDB will refuse the connection. -->
你还需要在 MongoDB Atlas 中将 fly.io 应用的 IP 地址添加到白名单中。否则 MongoDB 会拒绝连接。

<!-- Sadly, fly.io does not provide you a dedicated IPv4 address for your app, so you will need to allow all IP addresses in MongoDB Atlas. -->
遗憾的是，fly.io 不会给你的应用提供一个专门的 IPv4 地址，所以你需要在 MongoDB Atlas 中允许所有的 IP 地址。

<!-- When using Render, the database url is given by defining the proper env in the dashboard: -->
在使用 Render 时，可以通过在仪表板中定义适当的环境变量来提供数据库 URL：

![render仪表板显示MONGODB_URI环境变量](../../images/3/render-env.png)

<!-- The Render Dashboard shows the server logs: -->
Render 仪表板显示服务端日志：

![render仪表板上有箭头指向在端口10000上运行的服务器](../../images/3/r7.png)

<!-- You can find the code for our current application in its entirety in the <i>part3-6</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-6). -->
你可以在[这个 GitHub 仓库](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-6)的 <i>part3-6</i> 分支中找到我们当前应用的完整代码。

</div>

<div class="tasks">

<!-- ### Exercises 3.19.-3.21. -->
### 练习 3.19.~3.21.

<!-- #### 3.19*: Phonebook database, step 7 -->
#### 3.19*：电话簿数据库，第 7 步

<!-- Expand the validation so that the name stored in the database has to be at least three characters long. -->
扩展验证，使存储在数据库中的名字需要至少三个字符长。

<!-- Expand the frontend so that it displays some form of error message when a validation error occurs. Error handling can be implemented by adding a <em>catch</em> block as shown below: -->
扩展前端，使其在发生验证错误时显示某种形式的错误消息。可以通过添加一个 <em>catch</em> 块来实现错误处理，如下所示：

```js
personService
    .create({ ... })
    .then(createdPerson => {
      // ...
    })
    .catch(error => {
      // this is the way to access the error message
      console.log(error.response.data.error)
    })
```

<!-- You can display the default error message returned by Mongoose, even though they are not as readable as they could be: -->
你可以显示 Mongoose 返回的默认错误消息，尽管这些错误信息并没有那么易读：

![电话簿屏幕截图显示人员验证失败](../../images/3/56e.png)

**注意：**在 update 操作中，mongoose 验证器默认是关闭的。[阅读文档](https://mongoosejs.com/docs/validation.html)来确定如何启用它们。

<!-- #### 3.20*: Phonebook database, step 8 -->
#### 3.20*：电话簿数据库，第 8 步

<!-- Add validation to your phonebook application, which will make sure that phone numbers are of the correct form. A phone number must: -->
为你的电话簿应用添加验证，确保电话号码的格式正确。电话号码必须：

<!-- - have length of 8 or more
- be formed of two parts that are separated by -, the first part has two or three numbers and the second part also consists of numbers
    - eg. 09-1234556 and 040-22334455 are valid phone numbers
    - eg. 1234556, 1-22334455 and 10-22-334455 are invalid -->

- 8 个字符或更长
- 由两部分组成，由“-”分隔，第一部分有两个或三个数字，第二部分也都由数字组成
    - 例如，09-1234556 和 040-22334455 是有效的电话号码
    - 例如，1234556、1-22334455 和 10-22-334455 是无效的电话号码

<!-- Use a [Custom validator](https://mongoosejs.com/docs/validation.html#custom-validators) to implement the second part of the validation. -->
使用[自定义验证器](https://mongoosejs.com/docs/validation.html#custom-validators)来实现验证的第二部分。

<!-- If an HTTP POST request tries to add a person with an invalid phone number, the server should respond with an appropriate status code and error message. -->
如果 HTTP POST 请求试图添加一个电话号码无效的人，服务端应该响应合适的状态码和错误消息。

<!-- #### 3.21 Deploying the database backend to production -->
#### 3.21 将数据库后端部署到生产环境

<!-- Generate a new "full stack" version of the application by creating a new production build of the frontend, and copying it to the backend repository. Verify that everything works locally by using the entire application from the address <http://localhost:3001/>. -->
通过构建前端的新生产版本，并复制到后端仓库，来生成应用程序的新“全栈”版本。通过在地址 <http://localhost:3001/> 使用整个应用程序，验证所有操作在本地是否正常。

<!-- Push the latest version to Fly.io/Render and verify that everything works there as well. -->
将最新版本推送到 Fly.io/Render，并验证那里的所有操作是否也正常。

<!-- **NOTE:** You shall NOT be deploying the frontend directly at any stage of this part. Only the backend repository is deployed throughout the whole part. The frontend production build is added to the backend repository, and the backend serves it as described in the section [Serving static files from the backend](/en/part3/deploying_app_to_internet#serving-static-files-from-the-backend). -->
**注：**在本章节的任何阶段，你都**不**应直接部署前端。整个章节都只部署后端。将前端构建的生产版本添加到后端仓库中，然后让后端来提供，如同[由后端提供静态文件](/zh/part3/把应用部署到互联网上#由后端提供静态文件)一节中所描述的那样。

</div>

<div class="content">

<!-- ### Lint -->
### lint

<!-- Before we move on to the next part, we will take a look at an important tool called [lint](<https://en.wikipedia.org/wiki/Lint_(software)>). Wikipedia says the following about lint: -->
在我们进入下一章节之前，我们来介绍一个重要的工具，叫做 [lint](<https://en.wikipedia.org/wiki/Lint_(software)>)。维基百科对 lint 的描述如下：

<!-- > <i>Generically, lint or a linter is any tool that detects and flags errors in programming languages, including stylistic errors. The term lint-like behavior is sometimes applied to the process of flagging suspicious language usage. Lint-like tools generally perform static analysis of source code.</i> -->
> <i>一般来说，lint 或 linter 是任何检测并标记编程语言中的错误，包括样式错误的工具。术语“lint 类行为”有时用于标记语言的可疑用法的过程。lint 类工具通常对源代码进行静态分析。</i>

<!-- In compiled statically typed languages like Java, IDEs like NetBeans can point out errors in the code, even ones that are more than just compile errors. Additional tools for performing [static analysis](https://en.wikipedia.org/wiki/Static_program_analysis) like [checkstyle](https://checkstyle.sourceforge.io), can be used for expanding the capabilities of the IDE to also point out problems related to style, like indentation. -->
对于编译型静态类型语言，比如 Java，NetBeans 等 IDE 可以指出代码中的错误，甚至不止是编译错误。像 [checkstyle](https://checkstyle.sourceforge.io) 这样用于执行[静态分析](https://en.wikipedia.org/wiki/Static_program_analysis)的附加工具，可以用来扩展 IDE 的能力，来指出与样式相关的问题，如缩进。

<!-- In the JavaScript universe, the current leading tool for static analysis (aka "linting") is [ESlint](https://eslint.org/). -->
在 JavaScript 领域，目前领头的静态分析工具（又称“linting”）是[ESlint](https://eslint.org/)。

<!-- Let's add ESLint as a <i>development dependency</i> for the backend. Development dependencies are tools that are only needed during the development of the application. For example, tools related to testing are such dependencies. When the application is run in production mode, development dependencies are not needed. -->
让我们将 ESLint 添加为后端的<i>开发依赖项</i>。开发依赖项是只在开发应用的过程中需要的工具。比如，和测试有关的工具就是开发依赖项。当应用以生产模式运行时，就不需要开发依赖项了。

<!-- Install ESLint as a development dependency for the backend with the command: -->
使用以下命令将 ESlint 作为开发依赖项安装到后端项目中：

```bash
npm install eslint @eslint/js --save-dev
```

<!-- The contents of the package.json file will change as follows: -->
package.json 文件的内容会这么变化：

```js
{
  //...
  "dependencies": {
    "dotenv": "^16.4.7",
    "express": "^5.1.0",
    "mongoose": "^8.11.0"
  },
  "devDependencies": { // highlight-line
    "@eslint/js": "^9.22.0", // highlight-line
    "eslint": "^9.22.0" // highlight-line
  }
}
```

<!-- The command added a <i>devDependencies</i> section to the file and included the packages <i>eslint</i> and <i>@eslint/js</i>, and installed the required libraries into the <i>node_modules</i> directory. -->
该命令在文件中添加了 <i>devDependencies</i> 一节，并在其中添加了 <i>eslint</i> 和 <i>@eslint/js</i>，同时在 <i>node_modules</i> 目录中安装了所需的库。

<!-- After this we can initialize a default ESlint configuration with the command: -->
之后我们可以用以下命令初始化默认的 ESlint 配置：

```bash
npx eslint --init
```

<!-- We will answer all of the questions: -->
我们要回答所有的问题：

![ESlint初始化的终端输出](../../images/3/52new.png)

<!-- The configuration will be saved in the generated _eslint.config.mjs_ file. -->
配置将会保存在 _eslint.config.mjs_ 文件中。

<!-- ### Formatting the Configuration File -->
### 格式化配置文件

<!-- Let's reformat the configuration file _eslint.config.mjs_ from its current form to the following: -->
让我们重设配置文件 _eslint.config.mjs_ 的格式，将它从当前的格式改为：

```js
import globals from 'globals'

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...globals.node },
      ecmaVersion: 'latest',
    },
  },
]
```

<!-- So far, our ESLint configuration file defines the _files_ option with _["\*\*/\*.js"]_, which tells ESLint to look at all JavaScript files in our project folder. The _languageOptions_ property specifies options related to language features that ESLint should expect, in which we defined the _sourceType_ option as "commonjs". This indicates that the JavaScript code in our project uses the CommonJS module system, allowing ESLint to parse the code accordingly.   -->
到目前为止，ESLint 配置文件在 _files_ 选项中定义了 _["\*\*/\*.js"]_，告诉 ESLint 要检查项目目录中的所有 JavaScript 文件。_languageOptions_ 属性指定 ESLint 应支持的语言特性相关的选项，其中我们将 _sourceType_ 设为“commonjs”。这表示我们项目中的 JavaScript 代码使用 CommonJS 模块系统，从而使 ESLint 能以相应的方法分析代码。

<!-- The _globals_ property specifies global variables that are predefined. The spread operator applied here tells ESLint to include all global variables defined in the _globals.node_ settings such as the _process_. In the case of browser code we would define here _globals.browser_ to allow browser specific global variables like _window_, and _document_. -->
_globals_ 属性指定预定义的全局变量。这里使用的展开运算符告诉 ESLint 包含 _globals.node_ 设定中定义的所有全局变量，比如 _process_。对于浏览器端代码，我们会在这里定义 _globals.browser_，来允许浏览器特有的全局变量，比如 _window_ 和 _document_。

最后，_ecmaVersion_ 属性设为“latest”。这将 ECMAScript 版本设为最新可用版本，意味着 ESLint 能理解并正确检查最新的 JavaScript 语法和特性。

我们希望同时使用 [ESLint 推荐的](https://eslint.org/docs/latest/use/configure/configuration-files#using-predefined-configurations)和自定义的设置。之前安装的 _@eslint/js_ 包提供了 ESLint 的预定义配置。我们可以在配置文件中导入并启用：

```js
import globals from 'globals'
import js from '@eslint/js' // highlight-line
// ...

export default [
  js.configs.recommended, // highlight-line
  {
    // ...
  },
]
```

<!-- We've added the _js.configs.recommended_ to the top of the configuration array, this ensures that ESLint's recommended settings are applied first before our own custom options. -->
我们已将 _js.configs.recommended_ 添加到配置数组的最上面，这确保 ESLint 的推荐设置会在我们自定义的选项之前先应用。

<!-- Let's continue building the configuration file. Install a [plugin](https://eslint.style/packages/js) that defines a set of code style-related rules: -->
让我们继续构建配置文件。安装一个定义了一套与代码样式相关的规则的[插件](https://eslint.style/packages/js)：

```bash
npm install --save-dev @stylistic/eslint-plugin-js
```

<!-- Import and enable the plugin, and add these four code style rules: -->
导入并启用插件，并添加这四条代码样式规则：

```js
import globals from 'globals'
import js from '@eslint/js'
import stylisticJs from '@stylistic/eslint-plugin-js' // highlight-line

export default [
  {
    // ...
    // highlight-start
    plugins: { 
      '@stylistic/js': stylisticJs,
    },
    rules: { 
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/linebreak-style': ['error', 'unix'],
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/semi': ['error', 'never'],
    }, 
    // highlight-end
  },
]
```

<!-- The [plugins](https://eslint.org/docs/latest/use/configure/plugins) property provides a way to extend ESLint's functionality by adding custom rules, configurations, and other capabilities that are not available in the core ESLint library. We've installed and enabled the _@stylistic/eslint-plugin-js_, which adds JavaScript stylistic rules for ESLint. In addition, rules for indentation, line breaks, quotes, and semicolons have been added. These four rules are all defined in the [Eslint styles plugin](https://eslint.style/packages/js). -->
[plugins](https://eslint.org/docs/latest/use/configure/plugins) 属性提供了一种可以通过添加自定义规则、配置以及其他核心 ESLint 库中没有的功能来扩展 ESLint 功能的方法。我们已安装并启用了 _@stylistic/eslint-plugin-js_，它为 ESLint 添加了 JavaScript 样式的规则。此外，还添加了关于缩进、换行、引号和分号的规则，这四条规则都是在 [Eslint styles plugin](https://eslint.style/packages/js) 中定义的。

**Windows 用户注意事项：**样式规则中将换行样式设为了 _unix_。建议无论使用什么操作系统都使用 Unix 样式的换行符（_\n_），这样文件可以兼容大多数现代操作系统，并且在多人处理同一文件时更方便协作。如果使用 Windows 样式的换行符，ESLint 会产生如下错误：<i>Expected linebreaks to be 'LF' but found 'CRLF'</i>。遇到这种情况时，按照[这份指南](https://stackoverflow.com/questions/48692741/how-can-i-make-all-line-endings-eols-in-all-files-in-visual-studio-code-unix)将 Visual Studio Code 配置为使用 Unix 样式换行。

<!-- ### Running the Linter -->
### 运行 linter

<!-- Inspecting and validating a file like _index.js_ can be done with the following command: -->
要检查和验证某个文件，比如 _index.js_，可以使用以下命令：

```bash
npx eslint index.js
```

<!-- It is recommended to create a separate _npm script_ for linting: -->
建议为 linting 创建一个专门的 _npm 脚本_：

```json
{
  // ...
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    // ...
    "lint": "eslint ." // highlight-line
  },
  // ...
}
```

<!-- Now the _npm run lint_ command will check every file in the project. -->
现在，_npm run lint_ 命令将检查项目中的每个文件。

<!-- Files in the <em>dist</em> directory also get checked when the command is run. We do not want this to happen, and we can accomplish this by adding an object with the [ignores](https://eslint.org/docs/latest/use/configure/ignore) property that specifies an array of directories and files we want to ignore. -->
当运行命令时，<em>dist</em> 目录中的文件也会被检查。我们不希望这种情况发生，我们可以通过添加一个对象，并在其 [ignores](https://eslint.org/docs/latest/use/configure/ignore) 属性声明一个我们要忽略的目录和文件的数组来实现这一点。

```js
// ...
export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    // ...
  },
  // highlight-start
  { 
    ignores: ['dist/**'], 
  },
  // highlight-end
]
```

<!-- This causes the entire <em>dist</em> directory to not be checked by ESlint. -->
这会使得整个 <em>dist</em> 目录都不被 ESlint 检查。

<!-- Lint has quite a lot to say about our code: -->
lint 对我们的代码有很多意见：

![ESlint错误的终端输出](../../images/3/53ea.png)

<!-- A better alternative to executing the linter from the command line is to configure an _eslint-plugin_ to the editor, that runs the linter continuously. By using the plugin you will see errors in your code immediately. You can find more information about the Visual Studio ESLint plugin [here](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint). -->
相比于从命令行执行 linter，更好的替代方案是给编辑器配置 _eslint 插件_，来持续不断地运行 linter。使用这个插件后，你将立即在代码中看到错误。你可以在[这里](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)找到更多关于 Visual Studio ESLint 插件的信息。

<!-- The VS Code ESlint plugin will underline style violations with a red line: -->
VS Code ESlint 插件会用红线划出违反样式的地方：

![VScode ESLint插件显示错误的截图](../../images/3/54a.png)

<!-- This makes errors easy to spot and fix right away. -->
这会让错误很容易发现，从而立即修复。

<!-- ### Adding More Style Rules -->
### 添加更多样式规则

<!-- ESlint has a vast array of [rules](https://eslint.org/docs/rules/) that are easy to take into use by editing the _eslint.config.mjs_ file. -->
ESlint 有大量易于使用的[规则](https://eslint.org/docs/rules/)，只要编辑 _eslint.config.mjs_ 文件即可使用。

<!-- Let's add the [eqeqeq](https://eslint.org/docs/rules/eqeqeq) rule that warns us if equality is checked with anything but the triple equals operator. The rule is added under the rules field in the configuration file. -->
让我们添加 [eqeqeq](https://eslint.org/docs/rules/eqeqeq) 规则，如果相等不是用三等号*===*检查的，eqeqeq 规则就会警告我们。将该规则添加到配置文件的 <i>rules</i> 字段下。

```js
export default [
  // ...
  rules: {
    // ...
   eqeqeq: 'error', // highlight-line
  },
  // ...
]
```

<!-- While we're at it, let's make a few other changes to the rules. -->
让我们顺便对规则进行一些其他更改。

<!-- Let's prevent unnecessary [trailing spaces](https://eslint.style/rules/no-trailing-spaces) at the ends of lines, require that [there is always a space before and after curly braces](https://eslint.style/rules/object-curly-spacing), and also demand a consistent use of whitespaces in the function parameters of arrow functions. -->
让我们阻止行尾的不必要的[尾随空格](https://eslint.style/rules/no-trailing-spaces)，要求[大括号前后始终有一个空格](https://eslint.style/rules/object-curly-spacing)，并且也要求箭头函数的函数参数中一致使用空格。

```js
export default [
  // ...
  rules: {
    // ...
    eqeqeq: 'error',
    // highlight-start
    'no-trailing-spaces': 'error',
    'object-curly-spacing': ['error', 'always'],
    'arrow-spacing': ['error', { before: true, after: true }],
    // highlight-end
  },
]
```

<!-- Our default configuration takes a bunch of predefined rules into use from: -->
我们的默认配置使用了这里预定义的一串规则：

```js
// ...

export default [
  js.configs.recommended,
  // ...
]
```

<!-- This includes a rule that warns about <em>console.log</em> commands which we don't want to use. Disabling a rule can be accomplished by defining its "value" as 0 or _off_ in the configuration file. Let's do this for the _no-console_ rule in the meantime. -->
这里包括一条警告 _console.log_ 命令的规则，而我们不想使用这条规则。禁用一条规则可以通过在配置文件中定义其“value”为 0 或 _off_ 来完成。让我们在此期间对 _no-console_ 规则这样做。

```js
[
  {
    // ...
    rules: {
      // ...
      eqeqeq: 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-console': 'off', // highlight-line
    },
  },
]
```

<!-- Disabling the no-console rule will allow us to use console.log statements without ESLint flagging them as issues. This can be particularly useful during development when you need to debug your code. Here's the complete configuration file with all the changes we have made so far: -->
禁用 no-console 规则使我们能够使用 console.log 语句而不使 ESLint 将其标记为问题。在开发期间需要调试代码时这尤其有用。下面是包含迄今为止我们所做的所有修改的完整配置文件：

```js
import globals from 'globals'
import js from '@eslint/js'
import stylisticJs from '@stylistic/eslint-plugin-js'

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...globals.node },
      ecmaVersion: 'latest',
    },
    plugins: {
      '@stylistic/js': stylisticJs,
    },
    rules: {
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/linebreak-style': ['error', 'unix'],
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/semi': ['error', 'never'],
      eqeqeq: 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-console': 'off',
    },
  },
  {
    ignores: ['dist/**'],
  },
]
```

<!-- **NB** when you make changes to the _eslint.config.mjs_ file, it is recommended to run the linter from the command line. This will verify that the configuration file is correctly formatted: -->
**注** 当你对 _eslint.config.mjs_ 文件进行更改时，推荐从命令行运行 linter。这将验证配置文件的格式是否正确：

![npm run lint 在终端的输出](../../images/3/lint2.png)

<!-- If there is something wrong in your configuration file, the lint plugin can behave quite erratically. -->
如果你的配置文件中有什么错误，lint 插件可能会表现得相当不稳定。

<!-- Many companies define coding standards that are enforced throughout the organization through the ESlint configuration file. It is not recommended to keep reinventing the wheel over and over again, and it can be a good idea to adopt a ready-made configuration from someone else's project into yours. Recently many projects have adopted the Airbnb [Javascript style guide](https://github.com/airbnb/javascript) by taking Airbnb's [ESlint](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb) configuration into use. -->
许多公司都会定义编码标准，并通过 ESlint 配置文件在整个组织中强制实施。不推荐反复重新发明轮子，采用别人项目中现成的配置是个明智的选择。最近，许多项目都采用了 Airbnb 的[Javascript 样式指南](https://github.com/airbnb/javascript)，并使用了 Airbnb 的 [ESlint](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb) 配置。

<!-- You can find the code for our current application in its entirety in the <i>part3-7</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-7). -->
你可以在[这个 GitHub 仓库](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-7)的 <i>part3-7</i> 分支中找到我们当前应用程序的全部代码。

</div>

<div class="tasks">

<!-- ### Exercise 3.22. -->
### 练习 3.22.

<!-- #### 3.22: Lint configuration -->
#### 3.22：lint 配置

<!-- Add ESlint to your application and fix all the warnings. -->
将 ESlint 添加到你的应用程序中，并修复所有警告。

<!-- This was the last exercise of this part of the course. It's time to push your code to GitHub and mark all of your finished exercises to the [exercise submission system](https://studies.cs.helsinki.fi/stats/courses/fullstackopen). -->
这是课程这一章节的最后一道练习。现在是时候将你的代码推送到 GitHub，并在[练习上交系统](https://studies.cs.helsinki.fi/stats/courses/fullstackopen)中标记你完成的所有练习了。

</div>
