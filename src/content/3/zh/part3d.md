---
mainImage: ../../../images/part-3.svg
part: 3
letter: d
lang: zh
---

<div class="content">

<!-- There are usually constraints that we want to apply to the data that is stored in our application's database. Our application shouldn't accept notes that have a missing or empty <i>content</i> property. The validity of the note is checked in the route handler: -->
我们通常希望对存储在应用程序数据库中的数据应用一些约束。我们的应用程序不应接受缺少或空的<i>content</i>属性的笔记。在路由处理器中检查笔记的有效性：

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
如果笔记没有<i>content</i>属性，我们将以<i>400 bad request</i>的状态码响应请求。

<!-- One smarter way of validating the format of the data before it is stored in the database is to use the [validation](https://mongoosejs.com/docs/validation.html) functionality available in Mongoose. -->
在数据存储到数据库之前验证数据格式的一种更智能的方法是使用Mongoose提供的[验证](https://mongoosejs.com/docs/validation.html)功能。

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
现在，<i>content</i>字段要求至少为五个字符长，并且被设置为必需，意味着它不能缺失。我们没有对<i>important</i>字段添加任何约束，所以它在模式中的定义没有改变。

<!-- The <i>minLength</i> and <i>required</i> validators are [built-in](https://mongoosejs.com/docs/validation.html#built-in-validators) and provided by Mongoose. The Mongoose [custom validator](https://mongoosejs.com/docs/validation.html#custom-validators) functionality allows us to create new validators if none of the built-in ones cover our needs. -->
<i>minLength</i>和<i>required</i>验证器是Mongoose提供的[内置](https://mongoosejs.com/docs/validation.html#built-in-validators)验证器。如果没有一个内置的验证器能满足我们的需求，Mongoose的[自定义验证器](https://mongoosejs.com/docs/validation.html#custom-validators)功能允许我们创建新的验证器。

<!-- If we try to store an object in the database that breaks one of the constraints, the operation will throw an exception. Let's change our handler for creating a new note so that it passes any potential exceptions to the error handler middleware: -->
如果我们试图在数据库中存储一个违反了某些约束的对象，操作将会抛出异常。让我们改变我们创建新笔记的处理器，使其将任何可能的异常传递给错误处理中间件：

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
让我们扩展错误处理器以处理这些验证错误：

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
当对象验证失败时，我们从Mongoose返回以下默认错误消息：

![postman显示错误消息](../../images/3/50.png)

<!-- We notice that the backend has now a problem: validations are not done when editing a note.
The [documentation](https://mongoosejs.com/docs/validation.html#update-validators) addresses the issue by explaining that validations are not run by default when <i>findOneAndUpdate</i> and related methods are executed. -->
我们注意到后端现在有一个问题：在编辑笔记时没有进行验证。
这个问题可以解决，[update-validators 文档](https://mongoosejs.com/docs/validation.html#update-validators)解释说，在执行<i>findOneAndUpdate</i>和相关方法时，默认不会运行验证。

<!-- The fix is easy. Let us also reformulate the route code a bit: -->
但是要修复这个问题很简单。让我们也稍微改写一下路由代码：

```js
app.put('/api/notes/:id', (request, response, next) => {
  const { content, important } = request.body // highlight-line

  Note.findByIdAndUpdate(
    request.params.id, 
    { content, important }, // highlight-line
    { new: true, runValidators: true, context: 'query' } // highlight-line
  ) 
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})
```

### Deploying the database backend to production

<!-- The application should work almost as-is in Fly.io/Render. We do not have to generate a new production build of the frontend since changes thus far were only on our backend. -->
该应用程序应该能在Fly.io/Render上按原样工作。由于到目前为止我们只对后端进行了修改，所以我们不需要生成前端的新生产构建。

<!-- The environment variables defined in dotenv will only be used when the backend is not in <i>production mode</i>, i.e. Fly.io or Render. -->
在dotenv中定义的环境变量只会在后端不处于<i>生产模式</i>时使用，即在Fly.io或Render中。

<!-- For production, we have to set the database URL in the service that is hosting our app. -->
对于生产环境，我们需要在托管我们应用的服务中设置数据库URL。

<!-- In Fly.io that is done _fly secrets set_: -->
在Fly.io中，可以通过_fly secrets set_命令来完成：

```bash
fly secrets set MONGODB_URI='mongodb+srv://fullstack:thepasswordishere@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority'
```

<!-- When the app is being developed, it is more than likely that something fails. Eg. when I deployed my app for the first time with the database, not a single note was seen: -->
当应用正在开发过程中，很可能会出现一些失败的情况。例如，当我第一次部署带有数据库的应用时，一个笔记都没有看到：

![浏览器显示没有出现任何笔记](../../images/3/fly-problem1.png)

<!-- The network tab of the browser console revealed that fetching the notes did not succeed, the request just remained for a long time in the _pending_ state until it failed with status code 502. -->
浏览器控制台的网络标签页显示，获取笔记的请求并未成功，请求只是在_pending_状态下停留了很长时间，直到最后以502状态码失败。

<!-- The browser console has to be open <i>all the time!</i> -->
浏览器控制台必须<i>始终</i>保持打开状态！

<!-- It is also vital to follow continuously the server logs. The problem became obvious when the logs were opened with  _fly logs_: -->
同时，持续关注服务器日志也非常重要。当我打开 _fly logs_ 查看日志时，问题就显而易见了：

![fly.io服务器日志显示连接到未定义](../../images/3/fly-problem3.png)

<!-- The database url was _undefined_, so the command *fly secrets set MONGODB\_URI* was forgotten. -->
数据库URL是 _undefined_ ，所以忘记了执行 *fly secrets set MONGODB\_URI* 命令。

<!-- When using Render, the database url is given by defining the proper env in the dashboard: -->
在使用Render时，可以通过在仪表板中定义适当的环境变量来提供数据库URL：

![render仪表板显示MONGODB_URI环境变量](../../images/3/render-env.png)

<!-- The Render Dashboard shows the server logs: -->
Render仪表板显示服务器日志：

![render仪表板上有箭头指向在端口10000上运行的服务器](../../images/3/r7.png)

<!-- You can find the code for our current application in its entirety in the <i>part3-6</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-6). -->
你可以在[此GitHub仓库](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-6)的<i>part3-6</i>分支中找到我们当前应用的完整代码。

</div>

<div class="tasks">

### Exercises 3.19.-3.21.

#### 3.19*: Phonebook database, step 7

<!-- Expand the validation so that the name stored in the database has to be at least three characters long. -->
将验证扩展，使得存储在数据库中的名称至少需要三个字符长。

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
你可以显示由Mongoose返回的默认错误消息，尽管它们并不像它们可能的那样易读：

![电话簿屏幕截图显示人员验证失败](../../images/3/56e.png)

**注意：**在 _update_ 操作中，mongoose验证器默认是关闭的。[阅读文档](https://mongoosejs.com/docs/validation.html)以确定如何启用它们。

#### 3.20*: Phonebook database, step 8

<!-- Add validation to your phonebook application, which will make sure that phone numbers are of the correct form. A phone number must: -->
为你的电话簿应用添加验证，确保电话号码的格式正确。电话号码必须：

<!-- - have length of 8 or more
- be formed of two parts that are separated by -, the first part has two or three numbers and the second part also consists of numbers
    - eg. 09-1234556 and 040-22334455 are valid phone numbers
    - eg. 1234556, 1-22334455 and 10-22-334455 are invalid -->

- 长度为8或更多
- 由两部分组成，两部分由-分隔，第一部分有两个或三个数字，第二部分也由数字组成
    - 例如，09-1234556和040-22334455是有效的电话号码
    - 例如，1234556，1-22334455和10-22-334455是无效的电话号码

<!-- Use a [Custom validator](https://mongoosejs.com/docs/validation.html#custom-validators) to implement the second part of the validation. -->
使用[自定义验证器](https://mongoosejs.com/docs/validation.html#custom-validators)来实现验证的第二部分。

<!-- If an HTTP POST request tries to add a person with an invalid phone number, the server should respond with an appropriate status code and error message. -->
如果HTTP POST请求试图添加一个电话号码无效的人，服务器应该以适当的状态码和错误消息响应。

#### 3.21 Deploying the database backend to production

Generate a new "full stack" version of the application by creating a new production build of the frontend, and copying it to the backend repository. Verify that everything works locally by using the entire application from the address <http://localhost:3001/>.
通过创建前端的新的生产构建，生成应用程序的新的"全栈"版本，并将其复制到后端仓库。验证本地的所有操作是否正常，通过从地址<http://localhost:3001/>使用整个应用程序。

<!-- Push the latest version to Fly.io/Render and verify that everything works there as well. -->
将最新版本推送到 Fly.io/Render，并验证那里的所有操作是否也正常。

<!-- **NOTE**: you should deploy the BACKEND to the cloud service. If you are using Fly.io the commands should be run in the root directory of the backend (that is, in the same directory where the backend package.json is). In case of using Render, the backend must be in the root of your repository. -->
**NOTE**: 你应该将后端部署到云服务。如果你使用的是Fly.io，命令应该在后端的根目录中运行（也就是在后端的package.json所在的目录中）。如果使用的是Render，后端必须位于你的仓库的根目录中。

<!-- You shall NOT be deploying the frontend directly at any stage of this part. It is just backend repository that is deployed throughout the whole part, nothing else. -->
在这一部分的任何阶段，你都不应该直接部署前端。整个部分都是部署后端仓库，没有其他的。

</div>

<div class="content">

### Lint

<!-- Before we move on to the next part, we will take a look at an important tool called [lint](<https://en.wikipedia.org/wiki/Lint_(software)>). Wikipedia says the following about lint: -->
在我们进入下一部分之前，我们介绍一个重要的工具，叫做[lint](<https://en.wikipedia.org/wiki/Lint_(software)>)。维基百科对lint的描述如下：

<!-- > <i>Generically, lint or a linter is any tool that detects and flags errors in programming languages, including stylistic errors. The term lint-like behavior is sometimes applied to the process of flagging suspicious language usage. Lint-like tools generally perform static analysis of source code.</i> -->
> <i>一般来说，lint或者linter是任何检测和标记编程语言中错误的工具，包括样式错误。术语 _lint-like behavior_ 有时用于标记可疑语言使用的过程。Lint类 的工具通常对源代码进行静态分析。</i>

<!-- In compiled statically typed languages like Java, IDEs like NetBeans can point out errors in the code, even ones that are more than just compile errors. Additional tools for performing [static analysis](https://en.wikipedia.org/wiki/Static_program_analysis) like [checkstyle](https://checkstyle.sourceforge.io), can be used for expanding the capabilities of the IDE to also point out problems related to style, like indentation. -->
在编译的静态类型语言如Java中，像NetBeans这样的IDE可以指出代码中的错误，甚至是编译错误之外的错误。像[checkstyle](https://checkstyle.sourceforge.io)这样的用于执行[静态分析](https://en.wikipedia.org/wiki/Static_program_analysis)的附加工具，可以用来扩展IDE的能力，也可以指出与样式相关的问题，如缩进。

<!-- In the JavaScript universe, the current leading tool for static analysis (aka "linting") is [ESlint](https://eslint.org/). -->
在JavaScript领域，目前主导的静态分析（又名"linting"）工具是[ESlint](https://eslint.org/)。

<!-- Let's install ESlint as a development dependency to the notes backend project with the command: -->
让我们使用以下命令将ESlint作为开发依赖项安装到notes后端项目中：

```bash
npm install eslint --save-dev
```

<!-- After this we can initialize a default ESlint configuration with the command: -->
之后我们可以用以下命令初始化一个默认的ESlint配置：

```bash
npx eslint --init
```

<!-- We will answer all of the questions: -->
我们要回答所有的问题：

![ESlint初始化的终端输出](../../images/3/52new.png)

<!-- The configuration will be saved in the _.eslintrc.js_ file.  We will change _browser_ to _node_ in the _env_ configuration: -->
配置将会保存在 _.eslintrc.js_ 文件中。我们将在 _env_ 配置中将 _browser_ 改为 _node_：

```js
module.exports = {
    "env": {
        "commonjs": true,
        "es2021": true,
        "node": true // highlight-line
    },
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "rules": {
    }
}
```

<!-- Let's change the configuration a bit. Install a [plugin](https://eslint.style/packages/js) that defines a set of code style-related rules: -->
让我们稍微修改一下配置。安装一个[插件](https://eslint.style/packages/js)，该插件定义了一套与代码风格相关的规则：

```
npm install --save-dev @stylistic/eslint-plugin-js
```

<!-- Enable the plugin and add an extends definiton and four code style rules: -->
启用插件并添加一个扩展定义和四个代码风格规则：

```js
module.exports = {
    // ...
    'plugins': [
        '@stylistic/js'
    ],
    'extends': 'eslint:recommended',
    'rules': {
        '@stylistic/js/indent': [
            'error',
            2
        ],
        '@stylistic/js/linebreak-style': [
            'error',
            'unix'
        ],
        '@stylistic/js/quotes': [
            'error',
            'single'
        ],
        '@stylistic/js/semi': [
            'error',
            'never'
        ],
    }
}
```

<!-- Extends _eslint:recommended_ adds a [set](https://eslint.org/docs/latest/rules/) of recommended rules to the project. In addition, rules for indentation, line breaks, hyphens and semicolons have been added. These four rules are all defined in the [Eslint styles plugin](https://eslint.style/packages/js). -->
扩展 _eslint:recommended_ 将一套[推荐的规则](https://eslint.org/docs/latest/rules/)添加到项目中。此外，还添加了关于缩进、换行、连字符和分号的规则。这四条规则都在[Eslint样式插件](https://eslint.style/packages/js)中定义了。

<!-- Inspecting and validating a file like _index.js_ can be done with the following command: -->
可以使用以下命令检查和验证像 _index.js_ 这样的文件：

```bash
npx eslint index.js
```

<!-- It is recommended to create a separate _npm script_ for linting: -->
我们建议为linting创建一个单独的 _npm script_：

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

<!-- Also the files in the <em>dist</em> directory get checked when the command is run. We do not want this to happen, and we can accomplish this by creating an [.eslintignore](https://eslint.org/docs/latest/use/configure/ignore#the-eslintignore-file) file in the project's root with the following contents: -->
当运行命令时，<em>dist</em> 目录中的文件也会被检查，我们不希望这种情况发生、我们可以通过在项目的根目录中创建一个[.eslintignore](https://eslint.org/docs/latest/use/configure/ignore#the-eslintignore-file) 文件来实现这一点，文件的内容如下：

```bash
dist
```

<!-- This causes the entire <em>dist</em> directory to not be checked by ESlint. -->
这将导致整个<em>dist</em>目录不被ESlint检查。

<!-- Lint has quite a lot to say about our code: -->
Lint对我们的代码有很多意见：

![ESlint错误的终端输出](../../images/3/53ea.png)

<!-- Let's not fix these issues just yet. -->
我们暂时不去修复这些问题。

<!-- A better alternative to executing the linter from the command line is to configure an <i>eslint-plugin</i> to the editor, that runs the linter continuously. By using the plugin you will see errors in your code immediately. You can find more information about the Visual Studio ESLint plugin [here](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint). -->
从命令行执行linter的更好替代方案是将<i>eslint-plugin</i>配置到编辑器中，这将连续运行linter。通过使用插件，你将立即在代码中看到错误。你可以在[这里](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)找到更多关于Visual Studio ESLint插件的信息。

<!-- The VS Code ESlint plugin will underline style violations with a red line: -->
VS Code的ESlint插件会用红线下划出风格违规：

![VScode ESLint插件显示错误的截图](../../images/3/54a.png)

<!-- This makes errors easy to spot and fix right away. -->
这使得错误很容易被发现并立即修复。

<!-- ESlint has a vast array of [rules](https://eslint.org/docs/rules/) that are easy to take into use by editing the <i>.eslintrc.js</i> file. -->
ESlint有大量的[规则](https://eslint.org/docs/rules/)，这些规则通过编辑 <i>.eslintrc.js</i> 文件就可以很容易地使用。

<!-- Let's add the [eqeqeq](https://eslint.org/docs/rules/eqeqeq) rule that warns us, if equality is checked with anything but the triple equals operator. The rule is added under the <i>rules</i> field in the configuration file. -->
让我们添加[eqeqeq](https://eslint.org/docs/rules/eqeqeq)规则，如果用非三等号运算符检查等式，它会发出警告。该规则是在配置文件的<i>rules</i>字段下添加的。

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
在我们进行这项工作的同时，让我们对规则进行一些其他更改。

<!-- Let's prevent unnecessary [trailing spaces](https://eslint.org/docs/rules/no-trailing-spaces) at the ends of lines, let's require that [there is always a space before and after curly braces](https://eslint.org/docs/rules/object-curly-spacing), and let's also demand a consistent use of whitespaces in the function parameters of arrow functions. -->
让我们阻止行尾的不必要的[尾随空格](https://eslint.org/docs/rules/no-trailing-spaces)，要求[大括号前后始终有一个空格](https://eslint.org/docs/rules/object-curly-spacing)，并且也要求箭头函数的函数参数中一致使用空格。

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
我们的默认配置从<i>eslint:recommended</i>中使用了一堆预定的规则：

```bash
'extends': 'eslint:recommended',
```

<!-- This includes a rule that warns about _console.log_ commands. [Disabling](https://eslint.org/docs/latest/use/configure/rules) a rule can be accomplished by defining its "value" as 0 in the configuration file. Let's do this for the <i>no-console</i> rule in the meantime. -->
这包括一个关于 _console.log_ 命令的警告规则。可以通过在配置文件中将其"值"定义为0来[禁用](https://eslint.org/docs/latest/use/configure/rules)一条规则。我们暂时为<i>no-console</i>规则这样做。

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
    ],
    'no-console': 0 // highlight-line
  },
}
```

<!-- **NB** when you make changes to the <i>.eslintrc.js</i> file, it is recommended to run the linter from the command line. This will verify that the configuration file is correctly formatted: -->
**注意** 当你对<i>.eslintrc.js</i>文件进行更改时，建议从命令行运行linter。这将验证配置文件是否正确格式化：

<!-- If there is something wrong in your configuration file, the lint plugin can behave quite erratically. -->
如果你的配置文件中有什么错误，lint插件可能会表现得相当不稳定。

<!-- Many companies define coding standards that are enforced throughout the organization through the ESlint configuration file. It is not recommended to keep reinventing the wheel over and over again, and it can be a good idea to adopt a ready-made configuration from someone else's project into yours. Recently many projects have adopted the Airbnb [Javascript style guide](https://github.com/airbnb/javascript) by taking Airbnb's [ESlint](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb) configuration into use. -->
许多公司定义编码标准，这些标准通过ESlint配置文件在整个组织中强制执行。不建议反复重新发明轮子，采用别人项目中的现成配置可能是个好主意。最近，许多项目通过采用Airbnb的[ESlint](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb)配置，采纳了Airbnb的[Javascript风格指南](https://github.com/airbnb/javascript)。

<!-- You can find the code for our current application in its entirety in the <i>part3-7</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-7). -->
你可以在 <i>part3-7</i> 分支的[这个GitHub仓库](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-7)中找到我们当前应用程序的全部代码。

</div>

<div class="tasks">

### Exercise 3.22.

#### 3.22: Lint configuration

<!-- Add ESlint to your application and fix all the warnings. -->
将ESlint添加到你的应用程序中，并修复所有的警告。

<!-- This was the last exercise of this part of the course. It's time to push your code to GitHub and mark all of your finished exercises to the [exercise submission system](https://studies.cs.helsinki.fi/stats/courses/fullstackopen). -->
这是课程的这一部分的最后一个练习。现在是时候将你的代码推送到GitHub，并在[练习提交系统](https://studies.cs.helsinki.fi/stats/courses/fullstackopen)中标记你已完成的所有练习了。

</div>
