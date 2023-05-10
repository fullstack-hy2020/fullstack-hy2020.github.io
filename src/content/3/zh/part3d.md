---
mainImage: ../../../images/part-3.svg
part: 3
letter: d
lang: zh
---

<div class="content">

<!-- There are usually constraints that we want to apply to the data that is stored in our application's database. Our application shouldn't accept notes that have a missing or empty <i>content</i> property. The validity of the note is checked in the route handler:-->
在我们应用程序的数据库中，我们通常希望对存储的数据施加约束。我们的应用程序不应接受没有<i>内容</i>属性的笔记。路由处理程序中检查笔记的有效性：

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

<!-- If the note does not have the <i>content</i> property, we respond to the request with the status code <i>400 bad request</i>.-->
如果笔记没有<i>内容</i>属性，我们会以<i>400 bad request</i>的状态码回复请求。

<!-- One smarter way of validating the format of the data before it is stored in the database is to use the [validation](https://mongoosejs.com/docs/validation.html) functionality available in Mongoose.-->
一种更聪明的验证数据格式的方法是在存储到数据库之前使用Mongoose中可用的[验证](https://mongoosejs.com/docs/validation.html)功能。

<!-- We can define specific validation rules for each field in the schema:-->
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

<!-- The <i>content</i> field is now required to be at least five characters long and it is set as required, meaning that it can not be missing. We have not added any constraints to the <i>important</i> field, so its definition in the schema has not changed.-->
<i>内容</i>字段现在至少需要五个字符，并且被设置为必填，这意味着它不能缺失。我们没有对<i>重要</i>字段添加任何约束，因此其模式中的定义没有改变。

<!-- The <i>minLength</i> and <i>required</i> validators are [built-in](https://mongoosejs.com/docs/validation.html#built-in-validators) and provided by Mongoose. The Mongoose [custom validator](https://mongoosejs.com/docs/validation.html#custom-validators) functionality allows us to create new validators if none of the built-in ones cover our needs.-->
<i>minLength</i> 和 <i>required</i> 验证器是[内置的](https://mongoosejs.com/docs/validation.html#built-in-validators)，由Mongoose提供。Mongoose的[自定义验证器](https://mongoosejs.com/docs/validation.html#custom-validators)功能允许我们创建新的验证器，如果内置的验证器不能满足我们的需求。

<!-- If we try to store an object in the database that breaks one of the constraints, the operation will throw an exception. Let''s change our handler for creating a new note so that it passes any potential exceptions to the error handler middleware:-->
如果我们尝试将一个违反约束的对象存储到数据库中，该操作将抛出异常。让我们改变我们用于创建新笔记的处理程序，使其将任何潜在的异常传递到错误处理中间件：

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

<!-- Let''s expand the error handler to deal with these validation errors:-->
让我们扩展错误处理程序来处理这些验证错误：

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

<!-- When validating an object fails, we return the following default error message from Mongoose:-->
当验证一个对象失败时，我们从Mongoose返回以下默认错误消息：

![postman showing error message](../../images/3/50.png)

<!-- We notice that the backend has now a problem: validations are not done when editing a note.-->
我们注意到后端现在有一个问题：编辑笔记时没有进行验证。
<!-- The [documentation](https://github.com/blakehaswell/mongoose-unique-validator#find--updates) explains what is the problem, validations are not run by default when <i>findOneAndUpdate</i> is executed.-->
[文档](https://github.com/blakehaswell/mongoose-unique-validator#find--updates)解释了问题所在，当执行<i>findOneAndUpdate</i>时，验证默认不会运行。

<!-- The fix is easy. Let us also reformulate the route code a bit:-->
修复很容易，让我们也重新制定一下路由代码：

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

<!-- The application should work almost as-is in Fly.io/Render. We do not have to generate a new production build of the frontend since changes thus far were only on our backend.-->
应用程序几乎可以在Fly.io/Render上原样运行。由于迄今为止的更改仅限于我们的后端，因此我们无需生成前端的新生产构建。

<!-- The environment variables defined in dotenv will only be used when the backend is not in <i>production mode</i>, i.e. Fly.io or Render.-->
环境变量定义在dotenv中只有在后端不处于<i>生产模式</i>时才会使用，即Fly.io或Render。

<!-- For production, we have to set the database URL in the service that is hosting our app.-->
对于生产，我们必须在托管我们应用程序的服务中设置数据库URL。

<!-- In Fly.io that is done _fly secrets set_:-->
在Fly.io中，可以通过`fly secrets set`完成：

```bash
fly secrets set MONGODB_URI='mongodb+srv://fullstack:<password>@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority'
```

<!-- When the app is being developed, it is more than likely that something fails. Eg. when I deployed my app for the first time with the database, not a single note was seen:-->
当开发应用程序时，很可能会出现某些失败的情况。例如，当我第一次使用数据库部署应用程序时，一个笔记都没有看到：

![browser showing no notes appearing](../../images/3/fly-problem1.png)

<!-- The network tab of the browser console revealed that fetching the notes did not succeed, the request just remained for a long time in the _pending_ state until it failed with statuscode 502.-->
浏览器控制台的网络选项卡显示，获取笔记不成功，请求只是长时间处于_待定_状态，直到以状态码502失败。

<!-- The browser console has to be open <i>all the time!</i>-->
浏览器控制台<i>一直都要打开！</i>

<!-- It is also vital to follow continuously the server logs. The problem became obvious when the logs were opened with  _fly logs_:-->
也很重要持续关注服务器日志。当使用 _fly logs_ 打开日志时，问题就变得明显了。

![fly.io server log showing connecting to undefined](../../images/3/fly-problem3.png)

<!-- The database url was _undefined_, so the command *fly secrets set MONGODB\_URI* was forgotten.-->
数据库url是_未定义_，因此忘记了命令*fly secrets set MONGODB\_URI*。

<!-- When using Render, the database url is given by defining the proper env in the dashboard:-->
当使用Render时，数据库URL可以通过在控制面板中定义适当的环境来提供：

![browser render showing the MONGODB_URI env variable](../../images/3/render-env.png)

<!-- The Render Dashboard shows the server logs:-->
渲染仪表板显示服务器日志：

![render dashboard with arrow pointting to server running on port 10000](../../images/3/r7.png)

<!-- You can find the code for our current application in its entirety in the <i>part3-5</i> branch of [this GitHub repository](https://github.com/fullstack-hy2019/part3-notes-backend/tree/part3-5).-->
您可以在[此GitHub存储库](https://github.com/fullstack-hy2019/part3-notes-backend/tree/part3-5)的<i>part3-5</i>分支中找到我们当前应用程序的完整代码。

</div>

<div class="tasks">

### Exercises 3.19.-3.21.

#### 3.19*: Phonebook database, step7

<!-- Expand the validation so that the name stored in the database has to be at least three characters long.-->
扩大验证，使得存储在数据库中的名称至少有三个字符长。

<!-- Expand the frontend so that it displays some form of error message when a validation error occurs. Error handling can be implemented by adding a <em>catch</em> block as shown below:-->
扩展前端，以便在发生验证错误时显示某种错误消息。可以通过添加如下所示的<em>catch</em>块来实现错误处理：

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

<!-- You can display the default error message returned by Mongoose, even though they are not as readable as they could be:-->
你可以显示Mongoose返回的默认错误消息，即使它们不像可能的那样可读：

![phonebook screenshot showing person validation failure](../../images/3/56e.png)

<!-- **NB:** On update operations, mongoose validators are off by default. [Read the documentation](https://mongoosejs.com/docs/validation.html) to determine how to enable them.-->
**注意：** 在更新操作时，Mongoose验证默认是关闭的。[阅读文档](https://mongoosejs.com/docs/validation.html)以确定如何启用它们。

#### 3.20*: Phonebook database, step8

<!-- Add validation to your phonebook application, which will make sure that phone numbers are of the correct form. A phone number must:-->
在你的电话簿应用中添加验证，以确保电话号码的正确格式。电话号码必须：

<!-- - have length of 8 or more-->
有8个或更多的长度
<!-- - be formed of two parts that are separated by -, the first part has two or three numbers and the second part also consists of numbers-->
- 由-分隔的两部分组成，第一部分有两到三个数字，第二部分也由数字组成。
<!--     - eg. 09-1234556 and 040-22334455 are valid phone numbers-->
- 例如：09-1234556 和 040-22334455 是有效的电话号码
<!--     - eg. 1234556, 1-22334455 and 10-22-334455 are invalid-->
-  1234556，1-22334455 和 10-22-334455 都是无效的

<!-- Use a [Custom validator](https://mongoosejs.com/docs/validation.html#custom-validators) to implement the second part of the validation.-->
使用[自定义验证器](https://mongoosejs.com/docs/validation.html#custom-validators)来实现验证的第二部分。

<!-- If an HTTP POST request tries to add a person with an invalid phone number, the server should respond with an appropriate status code and error message.-->
如果一个HTTP POST请求试图添加一个有无效电话号码的人，服务器应该以适当的状态码和错误消息作出回应。

#### 3.21 Deploying the database backend to production

<!-- Generate a new "full stack" version of the application by creating a new production build of the frontend, and copying it to the backend repository. Verify that everything works locally by using the entire application from the address <http://localhost:3001/>.-->
生成一个新的"全栈"版本的应用程序，通过创建前端的新生产构建，并将其复制到后端存储库。通过从地址<http://localhost:3001/>使用整个应用程序来验证本地的所有内容。

<!-- Push the latest version to Fly.io/Render and verify that everything works there as well.-->
把最新版本推送到 Fly.io/Render，并验证那里的一切都能正常工作。

<!-- **NOTE**: you should deploy the BACKEND to the cloud service. If you are using Fly.io the commands should be run in the root directory of the backend (that is, in the same directory where the backend package.json is). In case of using Render, the backend must be in the root of your repository.-->
**注意**：您应该将后端部署到云服务中。如果您使用Fly.io，则应在后端的根目录中运行命令（即在后端package.json所在的目录中）。如果使用Render，则后端必须位于存储库的根目录中。

<!-- You shall NOT be deploying the frontend directly at any stage of this part. It is just backend repository that is deployed throughout the whole part, nothing else.-->
你在本部分的任何阶段都不应该直接部署前端。这只是一个后端存储库，在整个部分中被部署，仅此而已。

</div>

<div class="content">

### Lint

<!-- Before we move on to the next part, we will take a look at an important tool called [lint](<https://en.wikipedia.org/wiki/Lint_(software)>). Wikipedia says the following about lint:-->
在我们进入下一部分之前，我们将看一下一个重要的工具，称为[lint](<https://en.wikipedia.org/wiki/Lint_(software)>)。维基百科对lint的描述如下：

<!-- > <i>Generically, lint or a linter is any tool that detects and flags errors in programming languages, including stylistic errors. The term lint-like behavior is sometimes applied to the process of flagging suspicious language usage. Lint-like tools generally perform static analysis of source code.</i>-->
<i>通常来说，lint或linter是任何检测和标记编程语言中错误（包括风格错误）的工具。有时将“lint-like”行为应用于标记可疑语言使用的过程中。Lint-like工具通常对源代码进行静态分析。</i>

<!-- In compiled statically typed languages like Java, IDEs like NetBeans can point out errors in the code, even ones that are more than just compile errors. Additional tools for performing [static analysis](https://en.wikipedia.org/wiki/Static_program_analysis) like [checkstyle](https://checkstyle.sourceforge.io), can be used for expanding the capabilities of the IDE to also point out problems related to style, like indentation.-->
在像Java这样的编译静态类型语言中，像NetBeans这样的IDE可以指出代码中的错误，甚至是不仅仅是编译错误的错误。可以使用额外的工具来执行[静态分析](https://en.wikipedia.org/wiki/Static_program_analysis)，比如[checkstyle](https://checkstyle.sourceforge.io)，来扩展IDE的功能，也可以指出与样式有关的问题，比如缩进。

<!-- In the JavaScript universe, the current leading tool for static analysis (aka "linting") is [ESlint](https://eslint.org/).-->
在JavaScript宇宙中，目前领先的静态分析（也称为“linting”）工具是[ESlint](https://eslint.org/)。

<!-- Let''s install ESlint as a development dependency to the notes backend project with the command:-->
让我们使用以下命令将ESLint安装为notes后端项目的开发依赖：`npm install --save-dev eslint`：

```bash
npm install eslint --save-dev
```

<!-- After this we can initialize a default ESlint configuration with the command:-->
在此之后，我们可以使用以下命令初始化默认的ESlint配置：

```bash
npx eslint --init
```

<!-- We will answer all of the questions:-->
我们将回答所有的问题：

![terminal output from ESlint init](../../images/3/52new.png)

<!-- The configuration will be saved in the _.eslintrc.js_ file.  We will change `browser` to `node` in the `env` configuration:-->
配置将会保存在 _.eslintrc.js_ 文件中。我们将会在 `env` 配置中将 `browser` 改为 `node`：

```js
module.exports = {
    'env': {
        'commonjs': true,
        'es2021': true,
        'node': true // highlight-line
    },
    'extends': 'eslint:recommended',
    'parserOptions': {
        'ecmaVersion': 'latest'
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

<!-- Let''s immediately change the rule concerning indentation, so that the indentation level is two spaces.-->
让我们立即改变关于缩进的规则，使缩进级别为两个空格。

```js
"indent": [
    "error",
    2
],
```

<!-- Inspecting and validating a file like _index.js_ can be done with the following command:-->
检查和验证像_index.js_这样的文件可以用下面的命令完成：

```bash
npx eslint index.js
```

<!-- It is recommended to create a separate _npm script_ for linting:-->
建议为 linting 创建一个单独的 _npm script_：

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

<!-- Now the _npm run lint_ command will check every file in the project.-->
现在，`npm run lint` 命令将检查项目中的每个文件。

<!-- Also the files in the <em>build</em> directory get checked when the command is run. We do not want this to happen, and we can accomplish this by creating an [.eslintignore](https://eslint.org/docs/user-guide/configuring#ignoring-files-and-directories) file in the project''s root with the following contents:-->
也会在运行命令时检查<em>build</em>目录中的文件。我们不希望这种情况发生，我们可以在项目根目录中创建一个[.eslintignore](https://eslint.org/docs/user-guide/configuring#ignoring-files-and-directories)文件，其内容如下：

```bash
build
```

<!-- This causes the entire <em>build</em> directory to not be checked by ESlint.-->
这导致整个<em>构建</em>目录不被 ESLint 检查。

<!-- Lint has quite a lot to say about our code:-->
Lint 对我们的代码有很多要说的：

![terminal output of ESlint errors](../../images/3/53ea.png)

<!-- Let''s not fix these issues just yet.-->
让我们先不着急去解决这些问题。

<!-- A better alternative to executing the linter from the command line is to configure a <i>eslint-plugin</i> to the editor, that runs the linter continuously. By using the plugin you will see errors in your code immediately. You can find more information about the Visual Studio ESLint plugin [here](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint).-->
一个比从命令行执行 linter 更好的替代方案是将 <i>eslint-plugin</i> 配置到编辑器中，它可以持续运行 linter。通过使用该插件，您将立即看到代码中的错误。您可以在[此处](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)找到有关 Visual Studio ESLint 插件的更多信息。

<!-- The VS Code ESlint plugin will underline style violations with a red line:-->
VS Code 的 ESLint 插件会用红线下划示出样式违反：

![Screenshot of vscode ESlint plugin showing errors](../../images/3/54a.png)

<!-- This makes errors easy to spot and fix right away.-->
这使得错误很容易被发现并立即修复。

<!-- ESlint has a vast array of [rules](https://eslint.org/docs/rules/) that are easy to take into use by editing the <i>.eslintrc.js</i> file.-->
ESLint 有大量的[规则](https://eslint.org/docs/rules/)，可以通过编辑<i>.eslintrc.js</i>文件轻松使用。

<!-- Let''s add the [eqeqeq](https://eslint.org/docs/rules/eqeqeq) rule that warns us, if equality is checked with anything but the triple equals operator. The rule is added under the <i>rules</i> field in the configuration file.-->
让我们添加[eqeqeq](https://eslint.org/docs/rules/eqeqeq)规则，它会警告我们如果不使用三个等号操作符检查相等性。该规则添加到配置文件的<i>rules</i>字段中。

```js
{
  // ...
  'rules': {
    // ...
   'eqeqeq': 'error',
  },
}
```

<!-- While we're at it, let's make a few other changes to the rules.-->
而我们正在做的事情，让我们对规则做出一些其他的改变。

<!-- Let's prevent unnecessary [trailing spaces](https://eslint.org/docs/rules/no-trailing-spaces) at the ends of lines, let's require that [there is always a space before and after curly braces](https://eslint.org/docs/rules/object-curly-spacing), and let''s also demand a consistent use of whitespaces in the function parameters of arrow functions.-->
让我们防止行尾处不必要的[尾随空格](https://eslint.org/docs/rules/no-trailing-spaces)，让我们要求[花括号前后总是有空格](https://eslint.org/docs/rules/object-curly-spacing)，并且让我们还要求箭头函数的函数参数中使用空格保持一致。

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

<!-- Our default configuration takes a bunch of predetermined rules into use from <i>eslint:recommended</i>:-->
我们的默认配置使用了<i>eslint:recommended</i>中的一系列预定义规则：

```bash
'extends': 'eslint:recommended',
```

<!-- This includes a rule that warns about _console.log_ commands. [Disabling](https://eslint.org/docs/user-guide/configuring#configuring-rules) a rule can be accomplished by defining its "value" as 0 in the configuration file. Let''s do this for the <i>no-console</i> rule in the meantime.-->
这包括一条警告有关 _console.log_ 命令的规则。[禁用](https://eslint.org/docs/user-guide/configuring#configuring-rules)规则可以通过在配置文件中将其"值"设置为0来实现。暂时让我们这样做<i>no-console</i>规则。

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

<!-- **NB** when you make changes to the <i>.eslintrc.js</i> file, it is recommended to run the linter from the command line. This will verify that the configuration file is correctly formatted:-->
**NB** 当您对<i>.eslintrc.js</i>文件做出更改时，建议从命令行运行 linter。这将验证配置文件的格式是否正确：

![terminal output from npm run lint](../../images/3/55.png)

<!-- If there is something wrong in your configuration file, the lint plugin can behave quite erratically.-->
如果您的配置文件有错误，lint插件可能会出现不稳定的行为。

<!-- Many companies define coding standards that are enforced throughout the organization through the ESlint configuration file. It is not recommended to keep reinventing the wheel over and over again, and it can be a good idea to adopt a ready-made configuration from someone else's project into yours. Recently many projects have adopted the Airbnb [Javascript style guide](https://github.com/airbnb/javascript) by taking Airbnb's [ESlint](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb) configuration into use.-->
许多公司定义了通过ESlint配置文件在整个组织中强制执行的编码标准。不建议一再重复发明轮子，从别人的项目中采用现成的配置可能是个不错的想法。最近，许多项目采用了Airbnb的[Javascript样式指南](https://github.com/airbnb/javascript)，采用了Airbnb的[ESlint](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb)配置。

<!-- You can find the code for our current application in its entirety in the <i>part3-6</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-6).-->
您可以在[此GitHub存储库](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-6)的<i>part3-6</i>分支中找到我们当前应用程序的完整代码。
</div>

<div class="tasks">

### Exercise 3.22.

#### 3.22: Lint configuration

<!-- Add ESlint to your application and fix all the warnings.-->
添加ESLint到你的应用程序，并修复所有警告。

<!-- This was the last exercise of this part of the course. It''s time to push your code to GitHub and mark all of your finished exercises to the [exercise submission system](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).-->
这是本部分课程的最后一个练习了。是时候把你的代码推送到GitHub，并把你完成的所有练习提交到[练习提交系统](https://studies.cs.helsinki.fi/stats/courses/fullstackopen)了。

</div>
