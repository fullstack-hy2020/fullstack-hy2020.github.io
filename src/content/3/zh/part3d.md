---
mainImage: ../../../images/part-3.svg
part: 3
letter: d
lang: zh
---

<div class="content">


<!-- There are usually constraints that we want to apply to the data that is stored in our application's database. Our application shouldn't accept notes that have a missing or empty <i>content</i> property. The validity of the note is checked in the route handler: -->
我们通常希望对存储在应用数据库中的数据应用一些约束。 我们的应用不应该接受缺少或空的<i>content</i> 属性的便笺。 在路由处理程序中检查便笺的有效性:

```js
app.post('/api/notes', (request, response) => {
  const body = request.body
  // highlight-start
  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }
  // highlight-end

  // ...
})
```

<!-- If the note does not have the <i>content</i> property, we respond to the request with the status code <i>400 bad request</i>. -->
如果便笺没有<i>content</i> 属性，我们将使用状态码<i>400 bad request</i> 响应该请求。

<!-- One smarter way of validating the format of the data before it is stored in the database, is to use the [validation](https://mongoosejs.com/docs/validation.html) functionality available in Mongoose. -->
在数据存储到数据库之前验证数据格式的一个更聪明的方法是使用 Mongoose 提供的[validation](https://mongoosejs.com/docs/validation.html)功能。

<!-- We can define specific validation rules for each field in the schema: -->
我们可以为模式中的每个字段定义特定的验证规则:

```js
const noteSchema = new mongoose.Schema({
  // highlight-start
  content: {
    type: String,
    minlength: 5,
    required: true
  },
  date: { 
    type: Date,
    required: true
  },
  // highlight-end
  important: Boolean
})
```

<!-- The <i>content</i> field is now required to be at least five characters long. The <i>date</i> field is set as required, meaning that it can not be missing. The same constraint is also applied to the <i>content</i> field, since the minimum length constraint allows the field to be missing. We have not added any constraints to the <i>important</i> field, so its definition in the schema has not changed. -->
现在要求<i>content</i> 字段至少有五个字符长。<i>date</i> 字段被设置为必需的，这意味着它不能丢失。 同样的约束也适用于<i>content</i> 字段，因为最小长度限制允许字段为空。 我们没有向<i>important</i> 字段添加任何约束，因此模式中的定义没有更改。

<!-- The <i>minlength</i> and <i>required</i> validators are [built-in](https://mongoosejs.com/docs/validation.html#built-in-validators) and provided by Mongoose. The Mongoose [custom validator](https://mongoosejs.com/docs/validation.html#custom-validators) functionality allows us to create new validators, if none of the built-in ones cover our needs. -->
 <i>minlength</i> 和 <i> required</i> 验证器是[内置的](https://mongoosejs.com/docs/validation.html#built-in-validators) ，由 Mongoose 提供。 Mongoose允许我们创建新的验证器[自定义验证器](https://mongoosejs.com/docs/validation.html#custom-validators)，如果没有一个内置的验证器满足我们的需求的话。

<!-- If we try to store an object in the database that breaks one of the constraints, the operation will throw an exception. Let's change our handler for creating a new note so that it passes any potential exceptions to the error handler middleware: -->
如果我们尝试在数据库中存储一个打破其中一个约束的对象，操作将引发异常。 让我们改变我们的处理程序来创建一个新的便笺，这样它就可以将任何潜在的异常传递给错误处理中间件:

```js
app.post('/api/notes', (request, response, next) => { // highlight-line
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

  note.save()
    .then(savedNote => {
      response.json(savedNote.toJSON())
    })
    .catch(error => next(error)) // highlight-line
})
```

<!-- Let's expand the error handler to deal with these validation errors: -->
让我们展开错误处理程序来处理这些验证错误:

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
当验证一个对象失败时，我们从 Mongoose 返回如下缺省错误消息:

![](../../images/3/50.png)


### Promise chaining 
【承诺链】
<!-- Many of the route handlers changed the response data into the right format by implicitly calling the _toJSON_ method from _response.json_. For the sake of an example, we can also perform this operation explicitly by calling the _toJSON_ method on the object passed as a parameter to _then_:-->
许多的路由处理程序会将响应数据通过隐式地调用 _toJSON_  方法，将  _response.json_ 数据格式转换成正确的格式。为了演示，我们可以在 _then_ 中显示地调用 _toJSON_  方法 到这个对象上：

```js
app.post('/api/notes', (request, response, next) => {
  // ...

  note.save()
    .then(savedNote => {
      response.json(savedNote.toJSON())
    })
    .catch(error => next(error)) 
})
```

<!-- We can accomplish the same functionality in a much cleaner way with [promise chaining](https://javascript.info/promise-chaining): -->
我们可以用一种更简洁的方式来实现同样的功能，比如[承诺链](https://javascript.info/promise-chaining) :

```js
app.post('/api/notes', (request, response, next) => {
  // ...

  note
    .save()
    // highlight-start
    .then(savedNote => {
      return savedNote.toJSON()
    })
    .then(savedAndFormattedNote => {
      response.json(savedAndFormattedNote)
    }) 
    // highlight-end
    .catch(error => next(error)) 
})
```

<!-- In the first _then_ we receive _savedNote_ object returned by Mongoose and format it. The result of the operation is returned. Then as [we discussed earlier](/zh/part2/在服务端将数据_alert出来#extracting-communication-with-the-backend-into-a-separate- 模块), the _then_ method of a promise also returns a promise. This means that when we return _savedNote.toJSON()_ from the callback function, we are actually creating a promise that receives the formatted note as its value. We can access the formatted note by registering a new callback function with the _then_ method. -->
在第一个 _then_ ，我们收到 savedNote 对象返回的 Mongoose 和格式化它。 返回操作的结果。 然后，正如[我们之前讨论的](/zh/part2/在服务端将数据_alert出来#extracting-communication-with-the-backend-into-a-separate- 模块) ，then 的方法也返回了一个承诺。 我们可以通过使用 then 方法注册一个新的回调函数来访问带格式的便笺。

<!-- We can clean up our code even more by using the more compact syntax for arrow functions: -->
我们可以使用箭头函数的紧凑语法来清理我们的代码:

```js
app.post('/api/notes', (request, response, next) => {
  // ...

  note
    .save()
    .then(savedNote => savedNote.toJSON()) // highlight-line
    .then(savedAndFormattedNote => {
      response.json(savedAndFormattedNote)
    }) 
    .catch(error => next(error)) 
})
```

<!-- In this example, Promise chaining does not provide much of a benefit. The situation would change if there were many asynchronous operations that had to be done in sequence. We will not delve further into the topic. In the next part of the course we will learn about the <i>async/await</i> syntax in JavaScript, that will make writing subsequent asynchronous operations a lot easier. -->
在这个例子中，承诺链没有提供多少好处。 但要是有许多必须按顺序进行的异步操作，情况就会发生变化。 我们不会进一步深入探讨这个议题。 在本课程的下一章节中，我们将学习 JavaScript 中的<i>async/await</i>语法，这将使编写后续的异步操作变得容易得多。

### Deploying the database backend to production 
【将数据库后端部署到生产环境】
<!-- The application should work almost as-is in Heroku. We do have to generate a new production build of the frontend due to the changes that we have made to our frontend.  -->
该应用在 Heroku 的运行情况应该基本一样。 由于我们对前端进行了更改，我们必须生成一个新的前端生产版本。

<!-- The environment variables defined in dotenv will only be used when the backend is not in <i>production mode</i>, i.e. Heroku. -->
dotenv 中定义的环境变量仅在后端时使用,不处于<i>生产模式</i> (即 Heroku)。 

<!-- We defined the environment variables for development in file <i>.env</i>, but the environment variable that defines the database URL in production should be set to Heroku with the _heroku config:set_ command. -->
我们在文件 <i>.env</i>中定义了用于开发的环境变量。 但是在生产环境中定义数据库 URL 的环境变量应该使用  _heroku config:set_ 命令来设置 Heroku。
```bash
$ heroku config:set MONGODB_URI=mongodb+srv://fullstack:secretpasswordhere@cluster0-ostce.mongodb.net/note-app?retryWrites=true
```
<!-- HUOM: if the command causes an error, give the value of MONGODB_URI in apostrophes: -->

**注意**：如果命令行产生了一个错误，在撇号中给 MONGODB_URI 设置一个值

```bash
$ heroku config:set MONGODB_URI='mongodb+srv://fullstack:secretpasswordhere@cluster0-ostce.mongodb.net/note-app?retryWrites=true'
```

<!-- The application should now work. Sometimes things don't go according to plan. If there are problems, <i>heroku logs</i> will be there to help. My own application did not work after making the changes. The logs showed the following: -->
应用现在应该可以工作了。 有时事情不会按计划进行。 如果有什么问题，<i>heroku log</i>会尽力帮忙的。 我自己的应用在进行更改后不工作。 日志显示了如下情况:

![](../../images/3/51a.png)

<!-- For some reason the URL of the database was undefined. The <i>heroku config</i> command revealed that I had accidentally defined the URL to the <em>MONGO\_URL</em> environment variable, when the code expected it to be in <em>MONGODB\_URI</em>. -->
由于某种原因，数据库的 URL 未定义。<i>heroku config</i> 命令显示，我不小心定义了 <em>MONGO\_URL</em> 环境变量的 URL，而代码希望它位于 <em>MONGODB\_URI</em>中。

<!-- You can find the code for our current application in its entirety in the <i>part3-5</i> branch of [this github repository](https://github.com/fullstack-hy2019/part3-notes-backend/tree/part3-5). -->
您可以在[this github repository](https://github.com/fullstack-hy2019/part3-notes-backend/tree/part3-5)的<i>part3-5</i> 分支中找到我们当前应用的全部代码。
</div>

</div>


<div class="tasks">



### Exercises 3.19.-3.21.



#### 3.19: Phonebook database, 步骤7
<!-- Add validation to your phonebook application, that will make sure that a newly added person has a unique name. Our current frontend won't allow users to try and create duplicates, but we can attempt to create them directly with Postman or the VS Code REST client. -->
为您的电话本应用添加验证，确保您所添加的人名字是唯一的。 我们当前的前端不允许用户尝试创建副本，但我们可以尝试直接使用Postman或 VS Code REST 客户端创建副本。

<!-- Mongoose does not offer a built-in validator for this purpose. Install the [mongoose-unique-validator](https://github.com/blakehaswell/mongoose-unique-validator#readme) package with npm and use it instead. -->
Mongoose 没有为此提供内置的验证器，可以使用 npm 安装[mongoose-unique-validator](https://github.com/blakehaswell/mongoose-unique-validator#readme) 并使用它。 

<!-- If an HTTP POST request tries to add a name that is already in the phonebook, the server must respond with an appropriate status code and error message. -->
如果 HTTP POST 请求试图添加电话簿中已有的名称，服务器必须用适当的状态码和错误消息作出响应。

#### 3.20*: Phonebook database, 步骤8
<!-- Expand the validation so that the name stored in the database has to be at least three characters long, and the phone number must have at least 8 digits. -->
扩展验证，以便存储在数据库中的名称必须至少有三个字符长，电话号码必须至少有8个数字。

<!-- Expand the frontend so that it displays some form of error message when a validation error occurs. Error handling can be implemented by adding a <em>catch</em> block as shown below: -->
扩展前端，以便在发生验证错误时显示某种形式的错误消息。 错误处理可以通过添加 <em>catch</em> 块来实现，如下所示:


```js
personService
    .create({ ... })
    .then(createdPerson => {
      // ...
    })
    .catch(error => {
      // this is the way to access the error message
      console.log(error.response.data)
    })
```

<!-- You can display the default error message returned by Mongoose, even though they are not as readable as they could be: -->
你可以显示 Mongoose 返回的默认错误消息，即使它们并不具有可读性:

**NB:** On update operations, mongoose validators are off by default. [Read the documentation](https://mongoosejs.com/docs/validation.html) to determine how to enable them.

注意，在更新操作中，mongoose 验证默认是关闭的， [阅读文档](https://mongoosejs.com/docs/validation.html) 来确定如何开启。

![](../../images/3/56e.png)



#### 3.21  Deploying the database backend to production
【将数据库后端部署到生产环境】
<!-- Generate a new "full stack" version of the application by creating a new production build of the frontend, and copy it to the backend repository. Verify that everything works locally by using the entire application from the address  <http://localhost:3001/>. -->
通过创建前端的新生产版本，生成应用的新“完整栈”版本，并将其复制到后端存储库。 通过使用地址  <http://localhost:3001/> 的整个应用来验证所有的东西都能在本地工作。

<!-- Push the latest version to Heroku and verify that everything works there as well. -->
将最新版本推送到 Heroku，并验证那里的工作一切正常。

</div>


<div class="content">



### Lint


<!-- Before we move onto the next part, we will take a look at an important tool called [lint](<https://en.wikipedia.org/wiki/Lint_(software)>). Wikipedia says the following about lint: -->
在我们进入下一章节之前，我们将看看一个重要的工具，叫做[lint](https://en.wikipedia.org/wiki/lint_(software))。 关于 lint，维基百科是这么说的:

> <i>Generically, lint or a linter is any tool that detects and flags errors in programming languages, including stylistic errors. The term lint-like behavior is sometimes applied to the process of flagging suspicious language usage. Lint-like tools generally perform static analysis of source code.</i>
通常，lint 或 linter 是检测和标记编程语言中的错误，包括文本错误的一种工具。 lint-like 这个术语有时用于标记可疑的语言使用情况。 类似 lint 的工具通常对源代码执行静态分析。 

<!-- In compiled statically typed languages like Java, IDEs like NetBeans can point out errors in the code, even ones that are more than just compile errors. Additional tools for performing [static analysis](https://en.wikipedia.org/wiki/Static_program_analysis) like [checkstyle](http://checkstyle.sourceforge.net/), can be used for expanding the capabilities of the IDE to also point out problems related to style, like indentation. -->
在像 Java 这样的编译静态类型语言中，像 NetBeans 这样的 ide 可以指出代码中的错误，甚至那些不仅仅是编译错误的错误。 执行[静态分析](https://en.wikipedia.org/wiki/Static_program_analysis)的额外工具，如[检查样式](https://checkstyle.sourceforge.io) ，可以用来扩展 IDE 的功能，也指出与样式有关的问题，如缩进。

<!-- In the JavaScript universe, the current leading tool for static analysis aka. "linting" is [ESlint](https://eslint.org/). -->
在 JavaScript 的世界里，目前主要的静态分析工具又名“ linting”是[ESlint](https://ESlint.org/)。

<!-- Let's install ESlint as a development dependency to the backend project with the command: -->
让我们使用下面的命令安装 ESlint 作为后端项目的开发依赖项:

```bash
npm install eslint --save-dev
```

<!-- After this we can initialize a default ESlint configuration with the command: -->
在这之后，我们可以使用如下命令初始化默认的 ESlint 配置:

```bash
node_modules/.bin/eslint --init
```

<!-- We will answer all of the questions: -->
我们将回答所有问题:

![](../../images/3/52be.png)



<!-- The configuration will be saved in the _.eslintrc.js_ file: -->
该配置将保存在.eslintrc.js 文件中:

```js
module.exports = {
    'env': {
        'commonjs': true,
        'es6': true,
        'node': true
    },
    'extends': 'eslint:recommended',
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly'
    },
    'parserOptions': {
        'ecmaVersion': 2018
    },
    'rules': {
        'indent': [
            'error',
            4
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'never'
        ]
    }
}
```

<!-- Let's immediately change the rule concerning indentation, so that the indentation level is two spaces. -->
让我们立即修改关于缩进的规则，使缩进级别为两个空格。

```js
"indent": [
    "error",
    2
],
```

<!-- Inspecting and validating a file like _index.js_ can be done with the following command: -->
检查和验证像 index.js 这样的文件可以通过如下命令完成:

```bash
node_modules/.bin/eslint index.js
```

<!-- It is recommended to create a separate _npm script_ for linting: -->
建议为 linting 创建一个单独的 npm 脚本:

```json
{
  // ...
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    // ...
    "lint": "eslint ."
  },
  // ...
}
```

<!-- Now the _npm run lint_ command will check every file in the project. -->
现在 _npm run lint_  命令将检查项目中的每个文件。

<!-- Also the files in the <em>build</em> directory get checked when the command is run. We do not want this to happen, and we can accomplish this by creating an [.eslintignore](https://eslint.org/docs/user-guide/configuring#ignoring-files-and-directories) file in the project's root with the following contents: -->
当命令运行时， <em>build</em> 目录中的文件也会被检查。 我们不希望这种情况发生，我们可以通过创建一个 [.eslintignore](https://eslint.org/docs/user-guide/configuring#ignoring-files-and-directories)文件，内容如下:

```bash
build
```

<!-- This causes the entire <em>build</em> directory to not be checked by ESlint. -->
这将导致 ESlint 不检查整个 <em>build</em> 目录。

<!-- Lint has quite a lot to say about our code: -->
Lint 对我们的代码有很多要说的: 

![](../../images/3/53ea.png)

<!-- Let's not fix these issues just yet. -->
让我们先不要解决这些问题。

<!-- A better alternative to executing the linter from the command line is to configure a  <i>eslint-plugin</i> to the editor, that runs the linter continuously. By using the plugin you will see errors in your code immediately. You can find more information about the Visual Studio ESLint plugin [here](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint). -->
从命令行执行连接程序的一个更好的替代方法是为编辑器配置一个<i>eslint-plugin</i>，它可以连续运行lint程序。 通过使用该插件，您将立即看到代码中的错误。 你可以找到更多关于 Visual Studio ESLint 插件的信息[点击这里](google  https://marketplace.visualstudio.com/items?itemname=dbaeumer.vscode-ESLint)。

<!-- The VS Code ESlint plugin will underline style violations with a red line: -->
代码 ESlint 插件会用红线来强调风格的违反:

![](../../images/3/54a.png)



<!-- This makes errors easy to spot and fix right away. -->
这使得错误很容易发现和立即修复。

<!-- ESlint has a vast array of [rules](https://eslint.org/docs/rules/) that are easy to take into use by editing the <i>.eslintrc.js</i> file. -->
Eslint 有大量的[规则](https://ESlint.org/docs/rules/) ，可以通过编辑 <i>.eslintrc.js</i>  文件轻松使用。 

<!-- Let's add the [eqeqeq](https://eslint.org/docs/rules/eqeqeq) rule that warns us, if equality is checked with anything but the triple equals operator. The rule is added under the <i>rules</i> field in the configuration file. -->
让我们添加一个[eqeqeq](https://eslint.org/docs/rules/eqeqeq)规则，它警告我们，如果除了三个等于运算符之外，相等是被检查的。 该规则是在配置文件的<i>rules</i> 字段下添加的。

```js
{
  // ...
  'rules': {
    // ...
   'eqeqeq': 'error',
  },
}
```

<!-- While we're at it, let's make a few other changes to the rules. -->
既然学到这里，让我们对规则做一些其他的改变。

<!-- Let's prevent unnecessary [trailing spaces](https://eslint.org/docs/rules/no-trailing-spaces) at the ends of lines, let's require that [there is always a space before and after curly braces](https://eslint.org/docs/rules/object-curly-spacing), and let's also demand a consistent use of whitespaces in the function parameters of arrow functions. -->
让我们在行的末尾避免不必要的[拖尾空格](https://eslint.org/docs/rules/no-trailing-spaces)，让我们要求[在大括号之前和之后总有一个空格](https://eslint.org/docs/rules/object-curly-spacing) ，让我们也要求在箭头函数的函数参数中一致使用空格。

```js
{
  // ...
  'rules': {
    // ...
    'eqeqeq': 'error',
    'no-trailing-spaces': 'error',
    'object-curly-spacing': [
        'error', 'always'
    ],
    'arrow-spacing': [
        'error', { 'before': true, 'after': true }
    ]
  },
}
```

<!-- Our default configuration takes a bunch of predetermined rules into use from <i>eslint:recommended</i>: -->
我们的默认配置从 <i>eslint:recommended</i>来的:

```bash
'extends': 'eslint:recommended',
```

<!-- This includes a rule that warns about _console.log_ commands. [Disabling](https://eslint.org/docs/user-guide/configuring#configuring-rules) a rule can be accomplished by defining its "value" as 0 in the configuration file. Let's do this for the <i>no-console</i> rule in the meantime. -->
这包括一个警告 console.log 命令的规则。 [禁用](https://eslint.org/docs/user-guide/configuring#configuring-rules)规则可以通过在配置文件中将其“ value”定义为0来实现。 在此期间让我们这样做把<i>no-console</i>检查关掉 。

```js
{
  // ...
  'rules': {
      // ...
      'eqeqeq': 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': [
          'error', 'always'
      ],
      'arrow-spacing': [
          'error', { 'before': true, 'after': true }
      ]
    },
    'no-console': 0 // highlight-line
  },
}
```

<!-- **NB** when you make changes to the <i>.eslintrc.js</i> file, it is recommended to run the linter from the command line. This will verify that the configuration file is correctly formatted: -->
当你修改 <i>.eslintrc.js</i> 文件中，建议从命令行运行 linter。 这将验证配置文件的格式是否正确:

![](../../images/3/55.png)



<!-- If there is something wrong in your configuration file, the lint plugin can behave quite erratically. -->
如果您的配置文件出现错误，lint 插件的行为可能相当错乱。

<!-- Many companies define coding standards that are enforced throughout the organization through the ESlint configuration file. It is not recommended to keep reinventing the wheel over and over again, and it can be a good idea to adopt a ready-made configuration from someone else's project into yours. Recently many projects have adopted the Airbnb [Javascript style guide](https://github.com/airbnb/javascript) by taking Airbnb's [ESlint](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb) configuration into use. -->
许多公司定义了通过 ESlint 配置文件在整个组织中执行的编码标准。 建议不要一遍又一遍地使用重造轮子，从别人的项目中采用现成的配置到自己的项目中可能是一个好主意。 最近，很多项目都采用了 Airbnb 的 Javascript 风格指南，使用了 Airbnb 的 [ESlint](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb) 。

<!-- You can find the code for our current application in its entirety in the <i>part3-6</i> branch of [this github repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-6). -->
您可以在 [this github repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-7)的<i>part3-7</i> 分支中找到我们当前应用的全部代码。
</div>


<div class="tasks">



### Exercise 3.22.



#### 3.22: Lint configuration


<!-- Add ESlint to your application and fix all the warnings. -->
向应用中添加 ESlint 并修复所有警告。

<!-- This was the last exercise of this part of the course. It's time to push your code to GitHub and mark all of your finished exercises to the [exercise submission system](https://studies.cs.helsinki.fi/stats/courses/fullstackopen). -->
这是本课程这一章节的最后一个练习，现在是时候把你的代码推送到 GitHub，并将所有完成的练习标记到[练习提交系统](https://studies.cs.helsinki.fi/stats/courses/fullstackopen)。
</div>
