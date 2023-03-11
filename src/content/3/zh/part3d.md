---
mainImage: ../../../images/part-3.svg
part: 3
letter: d
lang: zh
---

<div class="content">


<!-- There are usually constraints that we want to apply to the data that is stored in our application's database. Our application shouldn't accept notes that have a missing or empty <i>content</i> property. The validity of the note is checked in the route handler:-->
 通常有一些约束条件，我们想应用于存储在我们应用的数据库中的数据。我们的应用不应该接受那些有缺失或空的<i>内容</i>属性的笔记。笔记的有效性在路由处理程序中被检查。

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
 如果笔记没有<i>内容</i>属性，我们就用状态代码<i>400 bad request</i>来回应请求。


<!-- One smarter way of validating the format of the data before it is stored in the database, is to use the [validation](https://mongoosejs.com/docs/validation.html) functionality available in Mongoose.-->
 在数据存储到数据库之前，有一个更聪明的方法来验证数据的格式，就是使用Mongoose中的[验证](https://mongoosejs.com/docs/validation.html)功能。


<!-- We can define specific validation rules for each field in the schema:-->
我们可以为模式中的每个字段定义特定的验证规则。

```js
const noteSchema = new mongoose.Schema({
  // highlight-start
  content: {
    type: String,
    minLength: 5,
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


<!-- The <i>content</i> field is now required to be at least five characters long. The <i>date</i> field is set as required, meaning that it can not be missing. The same constraint is also applied to the <i>content</i> field, since the minimum length constraint allows the field to be missing. We have not added any constraints to the <i>important</i> field, so its definition in the schema has not changed.-->
 现在，<i>内容</i>字段被要求至少有五个字符长。<i>日期</i>字段被设置为必填，意味着它不能缺少。同样的约束也适用于<i>content</i>字段，因为最小长度约束允许该字段缺失。我们没有给<i>important</i>字段添加任何约束，所以它在模式中的定义没有改变。


<!-- The <i>minLength</i> and <i>required</i> validators are [built-in](https://mongoosejs.com/docs/validation.html#built-in-validators) and provided by Mongoose. The Mongoose [custom validator](https://mongoosejs.com/docs/validation.html#custom-validators) functionality allows us to create new validators, if none of the built-in ones cover our needs.-->
 <i>minLength</i>和<i>required</i>验证器是[内置](https://mongoosejs.com/docs/validation.html#built-in-validators)，由Mongoose提供。Mongoose的[自定义验证器](https://mongoosejs.com/docs/validation.html#custom-validators)功能允许我们创建新的验证器，如果内置的验证器都不能满足我们的需求。


<!-- If we try to store an object in the database that breaks one of the constraints, the operation will throw an exception. Let's change our handler for creating a new note so that it passes any potential exceptions to the error handler middleware:-->
 如果我们试图在数据库中存储一个破坏了其中一个约束的对象，该操作将抛出一个异常。让我们改变我们创建新笔记的处理程序，使其将任何潜在的异常传递给错误处理中间件。

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
      response.json(savedNote)
    })
    .catch(error => next(error)) // highlight-line
})
```


<!-- Let's expand the error handler to deal with these validation errors:-->
 让我们扩展错误处理程序来处理这些验证错误。

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
当验证一个对象失败时，我们从Mongoose返回以下默认的错误信息。

![](../../images/3/50.png)

<!-- We notice that the backend has now a problem: validations are not done when editing a note.-->
 我们注意到后端现在有一个问题：当编辑一个笔记时，验证并没有完成。
<!-- The [documentation](https://github.com/blakehaswell/mongoose-unique-validator#find--updates) explains what is the problem, validations are not run by default when <i>findOneAndUpdate</i> is executed.-->
 [文档](https://github.com/blakehaswell/mongoose-unique-validator#find--updates)解释了问题所在，当<i>findOneAndUpdate</i>被执行时，默认不运行验证。

<!-- The fix is easy. Let us also reformulate the route code a bit:-->
 解决这个问题很简单。让我们也重新制定一下路由代码。

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

<!-- The application should work almost as-is in Heroku. We do have to generate a new production build of the frontend due to the changes that we have made to our frontend.-->
该应用在Heroku中几乎可以按原样运行。由于我们对前端所做的改变，我们确实需要生成一个新的前端生产构建。

<!-- The environment variables defined in dotenv will only be used when the backend is not in <i>production mode</i>, i.e. Heroku.-->
 在dotenv中定义的环境变量只在后端不处于<i>生产模式</i>时使用，即Heroku。

<!-- We defined the environment variables for development in file <i>.env</i>, but the environment variable that defines the database URL in production should be set to Heroku with the _heroku config:set_ command.-->
 我们在文件<i>.env</i>中定义了用于开发的环境变量，但在生产中定义数据库URL的环境变量应通过_heroku config:set_命令设置为Heroku。

```bash
heroku config:set MONGODB_URI=mongodb+srv://fullstack:secretpasswordhere@cluster0-ostce.mongodb.net/note-app?retryWrites=true
```

<!-- **NB:** if the command causes an error, give the value of MONGODB_URI in apostrophes:-->
 **NB:**如果该命令导致错误，请用撇号给出 MONGODB_URI的值。

```bash
heroku config:set MONGODB_URI='mongodb+srv://fullstack:secretpasswordhere@cluster0-ostce.mongodb.net/note-app?retryWrites=true'
```

<!-- The application should now work. Sometimes things don't go according to plan. If there are problems, <i>heroku logs</i> will be there to help. My own application did not work after making the changes. The logs showed the following:-->
 应用现在应该工作了。有时事情并不按计划进行。如果有问题，<i>heroku日志</i>会有帮助。我自己的应用在做了这些修改后没有工作。日志显示如下。

![](../../images/3/51a.png)

<!-- For some reason the URL of the database was undefined. The <i>heroku config</i> command revealed that I had accidentally defined the URL to the <em>MONGO\_URL</em> environment variable, when the code expected it to be in <em>MONGODB\_URI</em>.-->
 由于某些原因，数据库的URL未被定义。<i>heroku config</i>命令显示，我不小心将URL定义在<em>MONGO\_URL</em>环境变量中，而代码希望它在<em>MONGODB\_URI</em>。

<!-- You can find the code for our current application in its entirety in the <i>part3-5</i> branch of [this GitHub repository](https://github.com/fullstack-hy2019/part3-notes-backend/tree/part3-5).-->
 你可以在[这个github仓库](https://github.com/fullstack-hy2019/part3-notes-backend/tree/part3-5)的<i>part3-5</i>分支中找到我们当前应用的全部代码。

</div>

<div class="tasks">

### Exercises 3.19.-3.21.

#### 3.19*: Phonebook database, step7

<!-- Expand the validation so that the name stored in the database has to be at least three characters long.-->
 扩展验证，使存储在数据库中的名字必须至少有三个字符。

<!-- Expand the frontend so that it displays some form of error message when a validation error occurs. Error handling can be implemented by adding a <em>catch</em> block as shown below:-->
 扩展前台，使其在发生验证错误时显示某种形式的错误信息。错误处理可以通过添加一个<em>catch</em>块来实现，如下所示。

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

<!-- You can display the default error message returned by Mongoose, even though they are not as readable as they could be:-->
 你可以显示Mongoose返回的默认错误信息，尽管它们的可读性并不高。

![](../../images/3/56e.png)

<!-- **NB:** On update operations, mongoose validators are off by default. [Read the documentation](https://mongoosejs.com/docs/validation.html) to determine how to enable them.-->
 **NB:**在更新操作中，Mongoose验证器默认是关闭的。[阅读文档](https://mongoosejs.com/docs/validation.html)以确定如何启用它们。

#### 3.20*: Phonebook database, step8

<!-- Add validation to your phonebook application, that will make sure that phone numbers are of the correct form. A phone number must-->
 在你的电话簿应用中添加验证，这将确保电话号码的形式是正确的。一个电话号码必须
<!-- - has length of 8 or more-->
 - 长度为8或以上
<!-- - if formed of two parts that are separated by -, the first part has two or three numbers and the second part also consists of numbers-->
 - 如果由两部分组成，并以"-"分隔，第一章节有两个或三个数字，第二章节也由数字组成
<!--   - eg. 09-1234556 and 040-22334455 are valid phone numbers-->
 - 例如，09-1234556和040-22334455是有效的电话号码
<!--   - eg. 1234556, 1-22334455 and 10-22-334455 are invalid-->
 - 例如：1234556、1-22334455和10-22-334455是无效的。

<!-- Use a [Custom validator](https://mongoosejs.com/docs/validation.html#custom-validators) to implement the second part of the validation.-->
 使用[自定义验证器](https://mongoosejs.com/docs/validation.html#custom-validators)来实现验证的第二章节。

<!-- If an HTTP POST request tries to add a name that is already in the phonebook, the server must respond with an appropriate status code and error message.-->
如果一个HTTP POST请求试图添加一个已经在电话簿中的名字，服务器必须用一个适当的状态代码和错误信息来回应。

#### 3.21 Deploying the database backend to production

<!-- Generate a new "full stack" version of the application by creating a new production build of the frontend, and copy it to the backend repository. Verify that everything works locally by using the entire application from the address <http://localhost:3001/>.-->
 通过创建一个新的前端生产构建，生成一个新的 "全栈 "版本的应用，并将其复制到后端存储库。通过使用来自<http://localhost:3001/>的整个应用，验证一切都在本地运行。

<!-- Push the latest version to Heroku and verify that everything works there as well.-->
 将最新版本推送到Heroku，并验证所有东西在那里也能工作。

</div>

<div class="content">

### Lint

<!-- Before we move onto the next part, we will take a look at an important tool called [lint](<https://en.wikipedia.org/wiki/Lint_(software)>). Wikipedia says the following about lint:-->
 在我们进入下一部分之前，我们将看一下一个重要的工具，叫做[lint](<https://en.wikipedia.org/wiki/Lint_(软件)>)。维基百科对lint的评价如下。

<!-- > <i>Generically, lint or a linter is any tool that detects and flags errors in programming languages, including stylistic errors. The term lint-like behavior is sometimes applied to the process of flagging suspicious language usage. Lint-like tools generally perform static analysis of source code.</i>-->
 > <i>一般来说，lint或linter是任何检测和标记编程语言错误的工具，包括文体错误。术语类林特行为有时被用于标记可疑的语言使用过程。类林特工具通常对源代码进行静态分析。</i>

<!-- In compiled statically typed languages like Java, IDEs like NetBeans can point out errors in the code, even ones that are more than just compile errors. Additional tools for performing [static analysis](https://en.wikipedia.org/wiki/Static_program_analysis) like [checkstyle](https://checkstyle.sourceforge.io), can be used for expanding the capabilities of the IDE to also point out problems related to style, like indentation.-->
在像Java这样的编译静态类型语言中，像NetBeans这样的IDE可以指出代码中的错误，甚至那些不仅仅是编译错误。执行[静态分析](https://en.wikipedia.org/wiki/Static_program_analysis)的额外工具，如[checkstyle](https://checkstyle.sourceforge.io)，可用于扩展IDE的能力，以指出与风格有关的问题，如缩进。


<!-- In the JavaScript universe, the current leading tool for static analysis aka. "linting" is [ESlint](https://eslint.org/).-->
 在JavaScript领域，目前领先的静态分析工具又称 "linting "是[ESlint](https://eslint.org/)。

<!-- Let's install ESlint as a development dependency to the backend project with the command:-->
 让我们用命令将ESlint作为开发依赖项安装到后端项目中。

```bash
npm install eslint --save-dev
```

<!-- After this we can initialize a default ESlint configuration with the command:-->
 在这之后，我们可以用命令初始化一个默认的ESlint配置。

```bash
npx eslint --init
```

<!-- We will answer all of the questions:-->
 我们将回答所有的问题。

![](../../images/3/52be.png)

<!-- The configuration will be saved in the _.eslintrc.js_ file:-->
 该配置将被保存在_.eslintrc.js_文件中。

```js
module.exports = {
    'env': {
        'commonjs': true,
        'es2021': true,
        'node': true
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

<!-- Let's immediately change the rule concerning indentation, so that the indentation level is two spaces.-->
 让我们立即改变有关缩进的规则，使缩进程度为两个空格。

```js
"indent": [
    "error",
    2
],
```

<!-- Inspecting and validating a file like _index.js_ can be done with the following command:-->
 检查和验证像_index.js_这样的文件可以用以下命令完成。

```bash
npx eslint index.js
```

<!-- It is recommended to create a separate _npm script_ for linting:-->
 建议创建一个单独的_npm脚本_来进行linting。

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
现在，_npm run lint_命令将检查项目中的每个文件。


<!-- Also the files in the <em>build</em> directory get checked when the command is run. We do not want this to happen, and we can accomplish this by creating an [.eslintignore](https://eslint.org/docs/user-guide/configuring#ignoring-files-and-directories) file in the project's root with the following contents:-->
 当命令运行时，<em>build</em>目录中的文件也会被检查。我们不希望这种情况发生，我们可以通过在项目的根目录下创建一个[.eslintignore](https://eslint.org/docs/user-guide/configuring#ignoring-files-and-directories)文件来实现，其内容如下。

```bash
build
```

<!-- This causes the entire <em>build</em> directory to not be checked by ESlint.-->
 这将导致整个<em>build</em>目录不被ESlint检查。

<!-- Lint has quite a lot to say about our code:-->
 Lint对我们的代码有相当多的意见。

![](../../images/3/53ea.png)

<!-- Let's not fix these issues just yet.-->
 我们先不要修复这些问题。

<!-- A better alternative to executing the linter from the command line is to configure a  <i>eslint-plugin</i> to the editor, that runs the linter continuously. By using the plugin you will see errors in your code immediately. You can find more information about the Visual Studio ESLint plugin [here](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint).-->
 除了从命令行执行linter之外，一个更好的选择是在编辑器中配置一个<i>eslint-plugin</i>，持续运行linter。通过使用该插件，你将立即看到你的代码中的错误。你可以找到更多关于Visual Studio ESLint插件的信息[这里](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)。


<!-- The VS Code ESlint plugin will underline style violations with a red line:-->
 VS Code ESlint插件会用红线标出违反风格的地方。

![](../../images/3/54a.png)


<!-- This makes errors easy to spot and fix right away.-->
 这使得错误很容易被发现并立即修复。


<!-- ESlint has a vast array of [rules](https://eslint.org/docs/rules/) that are easy to take into use by editing the <i>.eslintrc.js</i> file.-->
 ESlint有大量的[规则](https://eslint.org/docs/rules/)，通过编辑<i>.eslintrc.js</i>文件就可以轻松使用。


<!-- Let's add the [eqeqeq](https://eslint.org/docs/rules/eqeqeq) rule that warns us, if equality is checked with anything but the triple equals operator. The rule is added under the <i>rules</i> field in the configuration file.-->
 让我们添加[eqeqeq](https://eslint.org/docs/rules/eqeqeq)规则，它可以警告我们，如果用任何东西检查相等，而不是用三等分运算符。这条规则被添加到配置文件中的<i>rules</i>字段下。

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
 既然如此，让我们对规则做一些其他的修改。

<!-- Let's prevent unnecessary [trailing spaces](https://eslint.org/docs/rules/no-trailing-spaces) at the ends of lines, let's require that [there is always a space before and after curly braces](https://eslint.org/docs/rules/object-curly-spacing), and let's also demand a consistent use of whitespaces in the function parameters of arrow functions.-->
 让我们防止在行尾出现不必要的[尾部空格](https://eslint.org/docs/rules/no-trailing-spaces)，让我们要求[大括号前后总有一个空格](https://eslint.org/docs/rules/object-curly-spacing)，让我们也要求在箭头函数的函数参数中统一使用空白。

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
 我们的默认配置从<i>eslint:recommended</i>中采用了一堆预定的规则。

```bash
'extends': 'eslint:recommended',
```


<!-- This includes a rule that warns about _console.log_ commands. [Disabling](https://eslint.org/docs/user-guide/configuring#configuring-rules) a rule can be accomplished by defining its "value" as 0 in the configuration file. Let's do this for the <i>no-console</i> rule in the meantime.-->
 这包括一个警告_console.log_命令的规则。[禁用](https://eslint.org/docs/user-guide/configuring#configuring-rules)一条规则可以通过在配置文件中定义其 "值 "为0来完成。让我们同时为<i>no-console</i>规则做这件事。

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
 **NB*当你对<i>.eslintrc.js</i>文件进行修改时，建议从命令行运行linter。这将验证配置文件的格式是否正确。

![](../../images/3/55.png)


<!-- If there is something wrong in your configuration file, the lint plugin can behave quite erratically.-->
 如果你的配置文件有问题，lint插件会表现得很不正常。

<!-- Many companies define coding standards that are enforced throughout the organization through the ESlint configuration file. It is not recommended to keep reinventing the wheel over and over again, and it can be a good idea to adopt a ready-made configuration from someone else's project into yours. Recently many projects have adopted the Airbnb [Javascript style guide](https://github.com/airbnb/javascript) by taking Airbnb's [ESlint](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb) configuration into use.-->
 许多公司定义了编码标准，并通过ESlint配置文件在整个组织内强制执行。我们不建议一次又一次地重新发明轮子，从别人的项目中采用一个现成的配置到你的项目中是一个好主意。最近，许多项目采用了Airbnb的[Javascript style guide](https://github.com/airbnb/javascript)，将Airbnb的[ESlint](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb)配置运用到了其中。

<!-- You can find the code for our current application in its entirety in the <i>part3-7</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-7).-->
 你可以在[这个github仓库](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-7)的<i>part3-7</i>分支中找到我们当前应用的全部代码。
</div>

<div class="tasks">

### Exercise 3.22.

#### 3.22: Lint configuration

<!-- Add ESlint to your application and fix all the warnings.-->
在你的应用中加入ESlint并修复所有的警告。

<!-- This was the last exercise of this part of the course. It's time to push your code to GitHub and mark all of your finished exercises to the [exercise submission system](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).-->
 这是本章节课程的最后一个练习。是时候把你的代码推送到GitHub，并把你所有完成的练习标记到[练习提交系统](https://studies.cs.helsinki.fi/stats/courses/fullstackopen)。

</div>
