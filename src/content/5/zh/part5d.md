---
mainImage: ../../../images/part-5.svg
part: 5
letter: d
lang: zh
---

<div class="content">
<!-- So far we have tested the backend as a whole on an API level using integration tests, and tested some frontend components using unit tests. -->
到目前为止，我们已经使用集成测试在 API 级别上测试了整个后端，并使用单元测试测试了一些前端组件。



<!-- Next we will look into one way to test the [system as a whole](https://en.wikipedia.org/wiki/System_testing) using <i>End to End</i> (E2E) tests. -->
接下来，我们将研究一种使用端到端<i>End to End</i> (E2E)测试，将[系统作为一个整体](https://en.wikipedia.org/wiki/system_testing)的测试方法。



<!-- We can do E2E testing of an web application using a browser and a testing library. There are multiple libraries available, for example [Selenium](http://www.seleniumhq.org/) which can be used with almost any browser.  -->
我们可以使用浏览器和测试库对 web 应用进行 E2E 测试。 有多个库可用，例如[Selenium](http://www.seleniumhq.org/) ，几乎可以用于任何浏览器。

<!-- Another browser option are so called [headless browsers](https://en.wikipedia.org/wiki/Headless_browser), which are browsers with no graphical user interface.  -->
另一个浏览器选项是所谓的[headless browsers](https://en.wikipedia.org/wiki/Headless_browser) ，这是一种没有用户界面的浏览器。

<!-- For example Chrome can be used in Headless-mode.  -->
例如，Chrome 可以在 headless 模式下使用。

<!-- E2E tests are potentially the most useful category of tests, because they test the system trough the same interface as real users use.  -->
E2E 测试可能是最有用的一类测试，因为它们测试系统的界面与真实用户使用的界面相同。 


<!-- They do some drawbacks too. Configuring E2E tests is more challenging than unit- or integration tests. They also tend to be quite slow, and with a large system their execution time can be minutes, even hours. This is bad for development, because during coding it is beneficial to be able to run tests as often as possible in case of code [regressions](https://en.wikipedia.org/wiki/Regression_testing). -->
它们也有一些缺点。 配置 E2E 测试比单元测试或集成测试更具挑战性。 它们也往往非常慢，对于一个大型系统，它们的执行时间可能是几分钟，甚至几小时。 这对开发是不利的，因为在编码期间，如果遇到代码[回归测试](https://en.wikipedia.org/wiki/regression_testing) ，能够尽可能多地运行测试是有益的。

<!-- E2E tests can also be [flaky](https://hackernoon.com/flaky-tests-a-war-that-never-ends-9aa32fdef359).  -->
E2E 测试也可能是[片状的](https://hackernoon.com/flaky-tests-a-war-that-never-ends-9aa32fdef359)。 
<!-- Some tests might pass one time and fail another, even if the code does not change at all.  -->
有些测试可能一次通过，另一次失败，即使代码根本没有改变。

### Cypress

<!-- E2E library [Cypress](https://www.cypress.io/) has become popular within the last year. Cypress is exceptionally easy to use, and when compared to for example Selenium requires a lot less hassle and headache.  -->
在过去的一年里，E2E库[Cypress](https://www.cypress.io/)变得非常流行。 Cypress是非常容易使用，与Selenium相比需要少得多麻烦和头痛问题。
<!-- It's operating princible is radically different than most E2E testing libraries, because Cypress test are run completely within the browser. -->
它的操作原理与大多数 E2E 测试库完全不同，因为 Cypress 测试完全在浏览器中运行。
<!-- Other libraries run the tests in a Node-process, which is connected to the broswer trough an API.  -->
其他库在一个 node 进程中运行测试，进程通过一个 API 连接到浏览器。

<!-- Let's  make some end to end tests for our note application. -->
让我们为便笺应用做一些端到端的测试。

<!-- We begin by installing Cypress to <i>the frontend</i> as development dependency -->
我们首先将 Cypress 安装到<i>前端</i> ，作为开发依赖项

```js
npm install --save-dev cypress
```

<!-- and by adding an npm-script to run it: -->
通过添加一个 npm-script 来运行它:

```js
{
  // ...
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "server": "json-server -p3001 db.json",
    "cypress:open": "cypress open"  // highlight-line
  },
  // ...
}
```



<!-- Unlike frontend's unit tests, Cypress tests can be in the frontend or the backend repository, or even on their own separate repository.  -->
与前端的单元测试不同，Cypress 测试可以位于前端或后端仓库中，甚至可以位于它们自己的单独仓库中。



<!-- The tests require the tested system to be running. Unlike our backend integration tests, Cypress test <i>do not start</i> the system when they are run.  -->
这些测试要求测试系统正常运行。 与我们的后端集成测试不同，Cypress 测试<i>在系统运行时不启动</i>。


<!-- Let's add an npm-script to <i>the backend</i> which starts it in test mode, or so that <i>NODE\_ENV</i> is <i>test</i>. -->
让我们在后端中添加一个 npm-script，在测试模式下启动它，或者使<i>NODE\_ENV</i>设置 为<i>test</i>。

```js
{
  // ...
  "scripts": {
    "start": "cross-env NODE_ENV=production node index.js",
    "dev": "cross-env NODE_ENV=development nodemon index.js",
    "build:ui": "rm -rf build && cd ../../../2/luento/notes && npm run build && cp -r build ../../../3/luento/notes-backend",
    "deploy": "git push heroku master",
    "deploy:full": "npm run build:ui && git add . && git commit -m uibuild && git push && npm run deploy",
    "logs:prod": "heroku logs --tail",
    "lint": "eslint .",
    "test": "cross-env NODE_ENV=test jest --verbose --runInBand",
    "start:test": "cross-env NODE_ENV=test node index.js" // highlight-line
  },
  // ...
}
```



<!-- When both backend and frontend are running, we can start Cypress with the command -->
当后端和前端都在运行时，我们可以使用如下命令启动 Cypress

```js
npm run cypress:open
```



<!-- When we first run Cypress, it creates a <i>cypress</i> directory. It contains a <i>integrations</i> subdirectory, where we will place our tests. Cypress creates a bunch of example tests for us, but we will delete all those and make our own test in file <i>note\_app.speck.js</i>: -->
<!-- When we first run Cypress, it creates a <i>cypress</i> directory. It contains an <i>integration</i> subdirectory, where we will place our tests. Cypress creates a bunch of example tests for us in the <i>integration/examples</i> directory. We can delete the <i>examples</i> directory and make our own test in file <i>note\_app.spec.js</i>: -->
当我们第一次运行 Cypress 时，它会创建一个<i>Cypress</i> 目录。 它包含一个<i>集成</i> 子目录，我们将在其中放置测试。 Cypress 为我们在 <i>integration/examples</i> 目录中创建了一系列测试示例，但是我们可以将<i>examples</i> 目录删除，并在文件<i>note\_app.spec.js</i> 中创建我们自己的测试:

```js
describe('Note app', function() {
  it('front page can be opened', function() {
    cy.visit('http://localhost:3000')
    cy.contains('Notes')
    cy.contains('Note app, Department of Computer Science, University of Helsinki 2020')
  })
})
```



<!-- We start the test from the opened window: -->
我们从打开的窗口开始测试:

![](../../images/5/40ea.png)



<!-- Running the test opens your browser and shows how the application behaves as the test is run: -->
运行测试会打开你的浏览器，并显示应用在运行测试时的行为:

![](../../images/5/32ae.png)



<!-- The structure of the test should look faimiliar. They use <i>describe</i> blocks to group different test cases like Jest does. The test cases have been defined with the <i>it</i> method.  -->
测试的结构应该看起来很熟悉。 他们使用<i>describe</i> 块对不同的测试用例进行分组，就像 Jest 那样。 测试用例已经用<i>it</i> 方法定义了。
<!-- Cypress borrowed these parts from [Mocha](https://mochajs.org/) testing library it uses under the hood.  -->
Cypress从[Mocha](https://mochajs.org/)测试库中借用了这些部件，并在底层使用。 



<!-- [cy.visit](https://docs.cypress.io/api/commands/visit.html) and [cy.contains](https://docs.cypress.io/api/commands/contains.html) are Cypress commands, and their purpose is quite obvious. -->
[cy.visit](https://docs.Cypress.io/api/commands/visit.html)和[cy.contains](https://docs.Cypress.io/api/commands/contains.html)是 Cypress 命令，它们的用途非常明显。
<!-- [cy.visit](https://docs.cypress.io/api/commands/visit.html) opens the web address given to it as a parameter on the browser used by the test. [cy.contains](https://docs.cypress.io/api/commands/contains.html) searches for the string it received as a parameter from the page.  -->
[cy.visit](https://docs.cypress.io/api/commands/visit.html)将浏览器中打开的网址作为参数进行测试。 [cy.contains](https://docs.cypress.io/api/commands/contains.html)将搜索的字符串作为参数。


<!-- We could have declared the test using an arrow function -->
我们可以使用箭头函数声明测试

```js
describe('Note app', () => { // highlight-line
  it('front page can be opened', () => { // highlight-line
    cy.visit('http://localhost:3000')
    cy.contains('Notes')
    cy.contains('Note app, Department of Computer Science, University of Helsinki 2020')
  })
})
```



<!-- However, Mocha [recommends](https://mochajs.org/#arrow-functions) that arrow functions are not used, because they might cause some issues in certain situations.  -->
然而，Mocha [建议](https://mochajs.org/#arrow-functions)不要使用箭头函数，因为它们在某些情况下可能会导致一些问题。


<!-- If <i>cy.contains</i> does not find the text is it searching for, the test does not pass.  -->
如果<i>cy.contains</i> 没有找到正在搜索的文本，则测试不会通过。
<!-- So if we extend our test like so -->
所以如果我们像这样扩展测试

```js
describe('Note app', function() {
  it('front page can be opened',  function() {
    cy.visit('http://localhost:3000')
    cy.contains('Notes')
    cy.contains('Note app, Department of Computer Science, University of Helsinki 2020')
  })

// highlight-start
  it('front page contains random text', function() {
    cy.visit('http://localhost:3000')
    cy.contains('wtf is this app?')
  })
// highlight-end
})
```



<!-- the test fails -->
测试失败了

![](../../images/5/33ea.png)



<!-- Let's remove the failing code from the test.  -->
让我们从测试中删除失败的代码。

### Writing to a form
【写入表单】

<!-- Let's extend our tests so, that the test tries to log in to our application.  -->
让我们扩展测试，测试登录功能，登录到我们的应用。
<!-- We assume our backend contains a user with the username <i>mluukkai</i> and password <i>salainen</i>. -->
我们假设后端包含一个用户名为<i>mluukkai</i> 和密码<i>salainen</i> 的用户。


<!-- The test begins by opening the login form.  -->
测试从打开登录表单开始。

```js
describe('Note app',  function() {
  // ...

  it('login form can be opened', function() {
    cy.visit('http://localhost:3000')
    cy.contains('login').click()
  })
})
```



<!-- The test first searches for the login button by its text, and clicks the button with the command [cy.click](https://docs.cypress.io/api/commands/click.html#Syntax). -->
测试首先通过文本搜索登录按钮，然后用命令[cy.click](https://docs.cypress.io/api/commands/click.html#syntax)单击该按钮。



<!-- Both of our tests begin the same way, by opening the page <i>http://localhost:3000</i>, so we should  -->
<!-- separate the shared part into a <i>beforeEach</i> block run before each test: -->
我们的两个测试都是以同样的方式开始的，都是通过打开<i>http://localhost:3000</i> 页面，所以我们应该在每个测试之前，将共享部分分隔为<i>beforeEach</i> 块运行:



```js
describe('Note app', function() {
  // highlight-start
  beforeEach(function() {
    cy.visit('http://localhost:3000')
  })
  // highlight-end

  it('front page can be opened', function() {
    cy.contains('Notes')
    cy.contains('Note app, Department of Computer Science, University of Helsinki 2020')
  })

  it('login form can be opened', function() {
    cy.contains('login').click()
  })
})
```



<!-- The login field contains two <i>input</i> fields, which the test should write into.  -->
登录字段包含两个<i>input</i> 字段，测试应该将这两个字段写入其中。



<!-- The [cy.get](https://docs.cypress.io/api/commands/get.html#Syntax) command allows for searching elemets by CSS selectors.  -->
 [cy.get](https://docs.cypress.io/api/commands/get.html#Syntax)命令允许通过 CSS 选择器搜索元素。



<!-- We can access the first and the last input field on the page, and write to them with the command [cy.type](https://docs.cypress.io/api/commands/type.html#Syntax) like so:  -->
我们可以访问页面上的第一个和最后一个input字段，并使用命令[cy.type](https://docs.cypress.io/api/commands/type.html#syntax 文件夹)向它们写入内容，如下所示:

```js
it('user can login', function () {
  cy.contains('login').click()
  cy.get('input:first').type('mluukkai')
  cy.get('input:last').type('salainen')
})  
```

<!-- The test works. The problem is if we later add more input fields, the test will break because it expects the fields it needs to be the first and the last on the page.  -->
这个测试是有效的。 问题是，如果我们稍后添加更多的input字段，测试将中断，因为它期望需要的字段是页面上的第一个和最后一个。



<!-- It would be better to give our inputs unique <i>ids</i> and find them by them.  -->
最好是给我们的input提供唯一的 id 并通过id找到它们。
<!-- We change our login form like so -->
我们更改登录表单，如下所示

```js
const LoginForm = ({ ... }) => {
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          username
          <input
            id='username'  // highlight-line
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          password
          <input
            id='password' // highlight-line
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button id="login-button" type="submit"> // highlight-line
          login
        </button>
      </form>
    </div>
  )
}
```



<!-- We also added an id to our submit button so we can access it in our tests.  -->
我们还为提交按钮添加了一个 id，这样我们就可以在测试中访问它。



<!-- The test becomes -->
测试变成了

```js
describe('Note app',  function() {
  // ..
  it('user can log in', function() {
    cy.contains('login').click()
    cy.get('#username').type('mluukkai')  // highlight-line    
    cy.get('#password').type('salainen')  // highlight-line
    cy.get('#login-button').click()  // highlight-line

    cy.contains('Matti Luukkainen logged in') // highlight-line
  })
})
```



<!-- The last row ensures, that the login was successful.  -->
最后一行确保登录成功。



<!-- Note that the CSS [id-selector](https://developer.mozilla.org/en-US/docs/Web/CSS/ID_selectors) is #, so if we want to search for an element with the id <i>username</i> the CSS selector is <i>#username</i>. -->
注意 CSS 的 [id-选择器](https://developer.mozilla.org/en-us/docs/web/CSS/id_selectors)是 # ，所以如果我们想搜索 id 是 <i>username</i> 的元素，CSS 选择器是<i># username</i>。

### Some things to note
【有些事情需要注意】
<!-- The test first clicks the button opening the login form like so -->
测试首先单击打开登录表单的按钮，如下所示

```js
cy.contains('login').click()
```


<!-- When the form has been filled, the form is submitted by clicking the submit button -->
填写完表格后，单击提交按钮即可提交表格

```js
cy.get('#login-button').click()
```

<!-- Both buttons have the text <i>login</i>, but they are two separate buttons.  -->
两个按钮都有文本<i>login</i>，但它们是两个单独的按钮。

<!-- Actually both buttons are in the application's DOM the whole time, but only one is visible at a time because of the <i>display:none</i> styling on one of them. -->
实际上，这两个按钮一直都在应用的 DOM 中，但是由于其中一个是 <i>display:none</i> 每次只有一个按钮可见。



<!-- If we search for a button by its text, [cy.contains](https://docs.cypress.io/api/commands/contains.html#Syntax) will return the first of them, or the one opening the login form.  -->
如果我们通过文本搜索按钮，[cy.contains](https://docs.cypress.io/api/commands/contains.html#syntax)将返回第一个按钮，或者打开登录表单的按钮。
<!-- This will happen even if the button is not visible.  -->
即使按钮不可见，也会发生这种情况。
<!-- Because of this we gave the submit button id <i>login-button</i> we can use to access it. -->
为了防止名称冲突，我们给出了提交按钮 id <i>login-button</i>，我们可以用它来访问它。



<!-- Now we notice, that the variable _cy_ our tests use gives us a nasty Eslint error -->
现在我们注意到，我们的测试使用的变量 cy 给了我们一个讨厌的 Eslint 错误

![](../../images/5/30ea.png)



<!-- We can get rid of it by installing [eslint-plugin-cypress](https://github.com/cypress-io/eslint-plugin-cypress) as a development dependency -->
我们可以通过安装[eslint-plugin-cypress](https://github.com/cypress-io/eslint-plugin-cypress)作为开发依赖项来摆脱这个报错

```js
npm install eslint-plugin-cypress --save-dev
```


<!-- and changing the configuration in <i>.eslintrc.js</i> like so: -->
改变 <i>.eslintrc.js</i>中的配置如下:

```js
module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "jest/globals": true,
        "cypress/globals": true // highlight-line
    },
    "extends": [ 
      // ...
    ],
    "parserOptions": {
      // ...
    },
    "plugins": [
        "react", "jest", "cypress" // highlight-line
    ],
    "rules": {
      // ...
    }
}
```

### Testing new note form 
【测试新建便笺的表单】
<!-- Let's next add tests which test the new note functionality:  -->
下面让我们添加测试来测试新建便笺的功能:

```js
describe('Note app', function() {
  // ..
  // highlight-start
  describe('when logged in', function() {
    beforeEach(function() {
      cy.contains('login').click()
      cy.get('input:first').type('mluukkai')
      cy.get('input:last').type('salainen')
      cy.get('#login-button').click()
    })
    // highlight-end

    // highlight-start
    it('a new note can be created', function() {
      cy.contains('new note').click()
      cy.get('input').type('a note created by cypress')
      cy.contains('save').click()

      cy.contains('a note created by cypress')
    })
  })
  // highlight-end
})
```



<!-- The test has been defined in its own <i>describe</i> block.  -->
测试已经在它自己的<i>describe</i> 块中定义了。
<!-- Only logged in users can create new notes, so we added logging in to the application to a <i>beforeEach</i> block.  -->
只有登录的用户才能创建新的便笺，因此我们将登录添加到应用的<i>beforeEach</i> 块中。

<!-- The test trusts that when creating a new note the page contains only one input, so it searches for it like so -->
测试相信，在创建新便笺时，页面只包含一个input，因此它会像这样搜索该便笺

```js
cy.get('input')
```



<!-- If the page contained more inputs, the test would break -->
如果页面包含更多的input，测试就会中断

![](../../images/5/31ea.png)




<!-- Due to this it would again be better to give the input an <i>id</i> and search for it by it.  -->
由于这一点，最好再给input一个<i>id</i>，并通过id来搜索它。


<!-- The structure of the tests looks like so: -->
测试的结构如下:

```js
describe('Note app', function() {
  // ...

  it('user can log in', function() {
    cy.contains('login').click()
    cy.get('#username').type('mluukkai')
    cy.get('#password').type('salainen')
    cy.get('#login-button').click()

    cy.contains('Matti Luukkainen logged in')
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.contains('login').click()
      cy.get('input:first').type('mluukkai')
      cy.get('input:last').type('salainen')
      cy.get('#login-button').click()
    })

    it('a new note can be created', function() {
      // ...
    })
  })
})
```



<!-- Cypress runs the tests in the order they are in the code. So first it runs <i>user can log in</i>, where the user logs in. Then cypress will run <i>a new note can be created</i> which's <i>beforeEach</i> block logs in as well.  -->
Cypress 按照测试在代码中的顺序运行测试。 所以它首先运行<i>user can log in</i>，用户在这里登录。 然后 cypress 将运行 <i>a new note can be created</i> ，<i>beforeEach</i> 也会执行一遍登录。 
<!-- Why do this? Is the user not logged in after the first test?  -->
为什么这样做? 用户在第一次测试后没有登录吗？
<!-- No, because <i>each</i> test starts from zero as far as the browser is concerned.  -->
没有，因为就浏览器而言，每个测试都是从零开始的。
<!-- All changes to the browser's state are reversed after each test. -->
在每次测试后，对浏览器状态的所有更改都会被重置。

### Controlling the state of the database 
【控制数据库状态】

<!-- If the tests need to be able to modify the server's database, the situation immediately becomes more complicated. Ideally, the server's database should be the same each time we run the tests, so our tests can be reliably and easily repeatable.  -->
如果测试需要能够修改服务器的数据库，那么情况会立即变得更加复杂。 理想情况下，每次运行测试时，服务器的数据库应该是相同的，这样我们的测试就可以可靠且容易地重复。

<!-- As with unit- and integration tests, with E2E tests it is the best to empty the database and possibly format it before the tests are run. The challenge with E2E test is, that they do not have access to the database.  -->
与单元测试和集成测试一样，E2E 测试最好是在测试运行之前清空数据库并尽可能格式化数据库。 E2E 测试的挑战在于，他们无法访问数据库。

<!-- The solution is to create API endpoints to the backend for the test.  -->
解决方案是为测试创建后端的 API 接口。
<!-- We can empty the database using these endpoints.  -->
我们可以使用这些接口清空数据库。
<!-- Let's create a new <i>router</i> for the tests -->
让我们为测试创建一个新的<i>路由</i>

```js
const router = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')

router.post('/reset', async (request, response) => {
  await Note.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = router
```


<!-- and add it to the backend only <i>if the application is run on test-mode</i>: -->
如果应用在 test-模式上运行，则只将其添加到后端:

```js
// ...

app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/notes', notesRouter)

// highlight-start
if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}
// highlight-end

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
```



<!-- after the changes a HTTP POST request to the <i>/api/testing/reset</i> endpoint empties the database. -->
更改之后，对<i>/api/testing/reset</i> 接口的 HTTP POST 请求将清空数据库。


<!-- The modified backend code can be found from [githubissa](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part5-1) branch <i>part5-1</i>. -->
修改后的后端代码可以在[github](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part5-1)分支<i>part5-1</i> 中找到。



<!-- Next we will change the <i>beforeEach</i> block so, that it empties the server's database before tests are run.  -->
接下来，我们将更改<i>beforeEach</i> 块，以便在运行测试之前清空服务器的数据库。



<!-- Currently it is not possible to add new users trough the frontend's UI, so we add a new user to the backend from the beforeEach block.  -->
目前不可能通过前端的 UI 添加新用户，因此我们从 beforeEach 块向后端添加一个新用户。

```js
describe('Note app', function() {
   beforeEach(function() {
    // highlight-start
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user) 
    // highlight-end
    cy.visit('http://localhost:3000')
  })
  
  it('front page can be opened', function() {
    // ...
  })

  it('user can login', function() {
    // ...
  })

  describe('when logged in', function() {
    // ...
  })
})
```



<!-- During the formatting the test does HTTP requests to the backend with [cy.request](https://docs.cypress.io/api/commands/request.html). -->
在对测试进行格式化时，使用[cy.request](https://docs.cypress.io/api/commands/request.html)对后端进行 HTTP 请求。



<!-- Unlike earlier, now the testing starts with the backend in the same state every time. The backend will contain one user and no notes.  -->
与以前不同的是，现在每次测试都以相同的状态从后端开始。 后端将包含一个用户，没有便笺。


<!-- Let's add one more test for checking that we can change the importance of notes.  -->
让我们再添加一个测试，我们可以改变便笺的重要性。
<!-- First we change the frontend so that a new note is unimportant by default, or the <i>important</i> field is <i>false</i>: -->
首先，我们改变前端，这样一个新的便笺默认是不重要的，或者说<i>important</i> 字段是<i>false</i>:

```js
const NoteForm = ({ createNote }) => {
  // ...

  const addNote = (event) => {
    event.preventDefault()
    createNote({
      content: newNote,
      important: false // highlight-line
    })

    setNewNote('')
  }
  // ...
} 
```


<!-- There are multiple ways to test this. In the following example we first search for a note and click its <i>make important</i> button. Then we check that the note now contains a <i>make not important</i> button.  -->
有多种方法可以测试这一点。 在下面的示例中，我们首先搜索一个便笺，然后单击它的<i>make important</i> 按钮。 然后我们检查便笺现在是否包含一个<i>make not important</i> 按钮。

```js
describe('Note app', function() {
  // ...

  describe('when logged in', function() {
    // ...

    describe('and a note exists', function () {
      beforeEach(function () {
        cy.contains('new note').click()
        cy.get('input').type('another note cypress')
        cy.contains('save').click()
      })

      it('it can be made important', function () {
        cy.contains('another note cypress')
          .contains('make important')
          .click()

        cy.contains('another note cypress')
          .contains('make not important')
      })
    })
  })
})
```


<!-- The first command searches for a component containing the text <i>another note cypress</i>, and then for a <i>make important</i> button within it. It then clicks the button. -->
第一个命令搜索包含文本<i>another note cypress</i> 的组件，然后搜索其中的<i>make important</i> 按钮。 然后点击按钮。


<!-- The second command checks that the text on the button has changed to <i>make not important</i>. -->
第二个命令检查按钮上的文本是否更改为<i>make not important</i>。



<!-- The tests and the current frontend code can be found from [githubissa](https://github.com/fullstack-hy2020/part2-notes/tree/part5-9) branch <i>part5-9</i>. -->
测试和当前的前端代码可以从[github](https://github.com/fullstack-hy2020/part2-notes/tree/part5-9)分支<i>part5-9</i> 中找到。

### Failed login test
【测试登录失败】
<!-- Let's make a test to ensure that a login attempt fails if the password is wrong.  -->
让我们做一个测试，如果密码是错误的，确保登录失败。

<!-- Cypress will run all tests each time by default, and as the number of tests increases it starts to become quite time consuming.  -->
Cypress 默认情况下每次都会运行所有测试，并且随着测试数量的增加，它开始变得相当耗时。 
<!-- When developing a new test or when debugging a broken test, we can define the test with <i>it.only</i> instead of <i>it</i>, so that Cypress will only run the required test. -->
当开发一个新的测试或者调试一个失败的测试时，我们可以用<i>it.only</i> 而不是<i>it</i> 来定义测试，这样 Cypress 就只能运行所需的测试。
<!-- When the test is working, we can remove <i>.only</i>. -->
当测试所有工作时，我们可以删除  <i>.only</i>。


<!-- First  version of our tests is as follows: -->
我们测试的第一个版本如下:

```js
describe('Note app', function() {
  // ...

  it.only('login fails with wrong password', function() {
    cy.contains('login').click()
    cy.get('#username').type('mluukkai')
    cy.get('#password').type('wrong')
    cy.get('#login-button').click()

    cy.contains('wrong credentials')
  })

  // ...
)}
```



<!-- The test uses [cy.contains](https://docs.cypress.io/api/commands/contains.html#Syntax) to ensure that the application prints an error message.  -->
该测试使用[cy.contains](https://docs.cypress.io/api/commands/contains.html#syntax)来确保应用输出错误消息。



<!-- The application renders the error message to a component with the CSS class <i>error</i>: -->
应用将错误消息渲染给一个带有 CSS 类为<i>error</i> 的组件:

```js
const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error"> // highlight-line
      {message}
    </div>
  )
}
```



<!-- We could make the test ensure, that the error message is rendered to the correct component, or the component with the CSS class <i>error</i>: -->
我们可以让测试确保错误消息被渲染给了正确的组件，或者说带有 CSS 类为<i>error</i> 的组件:


```js
it('login fails with wrong password', function() {
  // ...

  cy.get('.error').contains('wrong credentials') // highlight-line
})
```



<!-- First we use [cy.get](https://docs.cypress.io/api/commands/get.html#Syntax) to search for a component with the CSS class <i>error</i>. Then we check that the error message can be found from this component.  -->
首先，我们使用[cy.get](https://docs.cypress.io/api/commands/get.html#syntax)来搜索带有 CSS 类为<i>error</i> 的组件。 然后我们检查是否可以从这个组件中找到错误消息。
<!-- Note that the [CSS class selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors) starts with a full stop, so the selector for the class <i>error</i> is <i>.error</i>. -->
注意，[CSS 类选择器](https://developer.mozilla.org/en-us/docs/web/CSS/class_selectors)以句号开始，所以类为<i>error</i> 的选择器是  <i>.error</i>。



<!-- We could do the same using the [should](https://docs.cypress.io/api/commands/should.html) syntax: -->
我们可以使用[should](https://docs.cypress.io/api/commands/should.html)语法来做同样的事情:

```js
it('login fails with wrong password', function() {
  // ...

  cy.get('.error').should('contain', 'wrong credentials') // highlight-line
})
```



<!-- Using should is a bit trickier than using <i>contains</i>, but it allows for more diverse tests than <i>contains</i> which works based on text content only.  -->
使用 should 比使用<i>contains</i> 稍微复杂一些，但它允许比<i>contains</i> 更多样化的测试，<i>contains</i> 是仅基于文本内容的。



<!-- List of the most common assertions which can be used with should can be found [here](https://docs.cypress.io/guides/references/assertions.html#Common-Assertions). -->
最常用的断言列表可以在[这里](https://docs.cypress.io/guides/references/assertions.html#Common-Assertions)找到。



<!-- We can, for example, make sure that the error message is red and it has a border: -->
例如，我们可以确保错误消息是红色的，并且有一个边框:

```js
it('login fails with wrong password', function() {
  // ...

  cy.get('.error').should('contain', 'wrong credentials') 
  cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
  cy.get('.error').should('have.css', 'border-style', 'solid')
})
```



<!-- Cypress requires the colors to be given as [rgb](https://rgbcolorcode.com/color/red). -->
Cypress 需要将颜色设置为[rgb](https://rgbcolorcode.com/color/red)。 



<!-- Because all tests are for the same component we accessed using [cy.get](https://docs.cypress.io/api/commands/get.html#Syntax), we can chain them using [and](https://docs.cypress.io/api/commands/and.html). -->
因为所有测试都是针对我们使用[cy.get](https://docs.cypress.io/api/commands/get.html#syntax)访问到的同一个组件，所以我们可以使用[and](https://docs.cypress.io/api/commands/and.html)链接它们。

```js
it('login fails with wrong password', function() {
  // ...

  cy.get('.error')
    .should('contain', 'wrong credentials')
    .and('have.css', 'color', 'rgb(255, 0, 0)')
    .and('have.css', 'border-style', 'solid')
})
```

<!-- Let's finish the test so that it also checks that the application does not render the success message <i>'Matti Luukkainen logged in'</i>: -->
让我们完成测试，这样它还可以检查应用没把渲染成功消息'Matti Luukkainen logged in'展示出来:

```js
it.only('login fails with wrong password', function() {
  cy.contains('login').click()
  cy.get('#username').type('mluukkai')
  cy.get('#password').type('wrong')
  cy.get('#login-button').click()

  cy.get('.error')
    .should('contain', 'wrong credentials')
    .and('have.css', 'color', 'rgb(255, 0, 0)')
    .and('have.css', 'border-style', 'solid')

  cy.get('html').should('not.contain', 'Matti Luukkainen logged in') // highlight-line
})
```



<!-- <i>Should</i> should always be chained with <i>get</i> (or another chainable command). -->

<i>Should</i> 应当总是与get 链接（或其他某个可链接命令）

<!-- We used <i>cy.get('html')</i> to access the whole visible content of the application.  -->
我们使用<i>cy.get('html')</i> 访问应用的所有可见内容。

### Bypassing the UI
【绕过用户界面】
<!-- Currently we have the following tests: -->
目前我们有如下测试:

```js 
describe('Note app', function() {
  it('user can login', function() {
    cy.contains('login').click()
    cy.get('#username').type('mluukkai')
    cy.get('#password').type('salainen')
    cy.get('#login-button').click()

    cy.contains('Matti Luukkainen logged in')
  })

  it.only('login fails with wrong password', function() {
    // ...
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.contains('login').click()
      cy.get('input:first').type('mluukkai')
      cy.get('input:last').type('salainen')
      cy.get('#login-button').click()
    })

    it('a new note can be created', function() {
      // ... 
    })
   
  })
})
```


<!-- First we test logging in. Then, in their own describe block, we have a bunch of tests which expect the user to be logged in. User is logged in in the <i>beforeEach</i> block.  -->
首先我们测试登录。 然后，在他们自己的 describe 块中，我们有一系列测试，期望用户登录。 用户会在<i>beforeEach</i> 块中登录。



<!-- As we said above, each test starts from zero! Tests do not start from the state where the previous states ended.  -->
正如我们上面所说的，每个测试都是从零开始的！ 测试不是从以前测试的结束状态开始的。



<!-- The Cypress documentation gives us the following advice: [Fully test the login flow – but only once!](https://docs.cypress.io/guides/getting-started/testing-your-app.html#Logging-in).  -->
Cypress 文档给了我们如下建议: [完全测试登录流程——但只有一次!](https://docs.Cypress.io/guides/getting-started/testing-your-app.html#logging-in)

<!-- So instead of logging in a user using the form in the <i>beforeEach</i> block, Cypress recommends that we [bypass the UI](https://docs.cypress.io/guides/getting-started/testing-your-app.html#Bypassing-your-UI) and do a HTTP request to the backend to log in. The reason for this is, that logging in with a HTTP request is much faster than filling a form.  -->
因此，Cypress 建议我们不要使用<i>beforeEach</i> 块中的表单登录用户，而是[绕过 UI](https://docs.Cypress.io/guides/getting-started/testing-your-app.html#bypassing-your-UI) ，对后端执行 HTTP 请求以登录。 原因是，使用 HTTP 请求登录要比填写表单快得多。


<!-- Our situation is a bit more complicated than in the example in the Cypress documentation, because when user logs in, our application saves their details to the localStorage. -->
我们的情况比 Cypress 文档中的示例要复杂一些，因为当用户登录时，我们的应用将其详细信息保存到了 localStorage 中。
<!-- However Cypress can handle that as well.  -->
然而，Cypress 也可以处理这个问题。
<!-- The code is the following -->
代码如下

```js 
describe('when logged in', function() {
  beforeEach(function() {
    // highlight-start
    cy.request('POST', 'http://localhost:3001/api/login', {
      username: 'mluukkai', password: 'salainen'
    }).then(response => {
      localStorage.setItem('loggedNoteappUser', JSON.stringify(response.body))
      cy.visit('http://localhost:3000')
    })
    // highlight-end
  })

  it('a new note can be created', function() {
    // ...
  })

  // ...
})
```



<!-- We can access the response to a [cy.request](https://docs.cypress.io/api/commands/request.html) with the _then_ method.  Under the hood <i>cy.request</i>, like all Cypress commands, are [promises](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#Commands-Are-Promises). -->
我们可以使用 then 方法访问对[cy.request](https://docs.cypress.io/api/commands/request.html)的响应。 在底层，<i>cy.request</i>和所有 Cypress 命令一样，都是[promises](https://docs.Cypress.io/guides/core-concepts/introduction-to-Cypress.html#commands-are-promises)。
<!-- The callback function saves the details of a logged in user to localStorage, and reloads the page.  -->
回调函数将登录用户的详细信息保存到 localStorage，然后重新加载页面。
<!-- Now there is no difference to user logging in with the login form.  -->
现在，和用户使用登录表单登录没有区别。



<!-- If and when we write new tests to our application, we have to use the login code in multiple places. -->
如果在应用中编写新的测试，我们必须在多个地方使用登录代码。
<!-- We should make it a [custom command](https://docs.cypress.io/api/cypress-api/custom-commands.html). -->
我们应该使它成为一个[自定义命令](https://docs.cypress.io/api/cypress-api/custom-commands.html)。



<!-- Custom commands are declared in <i>cypress/support/commands.js</i>. -->
自定义命令在<i>cypress/support/commands.js</i>. 中声明。
<!-- The code for logging in is as follows: -->
登录的代码如下:

```js 
Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', 'http://localhost:3001/api/login', {
    username, password
  }).then(({ body }) => {
    localStorage.setItem('loggedNoteappUser', JSON.stringify(body))
    cy.visit('http://localhost:3000')
  })
})
```



<!-- Using our custom command is easy, and our test becomes cleaner: -->
使用我们的自定义命令非常简单，我们的测试也变得更简洁:

```js 
describe('when logged in', function() {
  beforeEach(function() {
    // highlight-start
    cy.login({ username: 'mluukkai', password: 'salainen' })
    // highlight-end
  })

  it('a new note can be created', function() {
    // ...
  })

  // ...
})
```



<!-- The same applies to creating a new note now that we think about it. We have a test which makes a new note using the form. We also make a new note in the <i>beforeEach</i> block of the test testing changing the importance of a note:  -->
这同样适用于创建一个新的便笺，现在我们思考一下。 我们有一个测试，使用该表单制作一个新的便笺。 我们还在测试的<i>beforeEach</i> 块中新建了一个便笺，改变了便笺的重要性:

```js
describe('Note app', function() {
  // ...

  describe('when logged in', function() {
    it('a new note can be created', function() {
      cy.contains('new note').click()
      cy.get('input').type('a note created by cypress')
      cy.contains('save').click()

      cy.contains('a note created by cypress')
    })

    describe('and a note exists', function () {
      beforeEach(function () {
        cy.contains('new note').click()
        cy.get('input').type('another note cypress')
        cy.contains('save').click()
      })

      it('it can be made important', function () {
        // ...
      })
    })
  })
})
```



<!-- Let's make a new custom command for making a new note. The command will make a new note with a HTTP POST request:  -->
让我们为制作新便笺创建一个新的自定义命令。 该命令将使用 HTTP POST 请求生成一个新的记录:

```js
Cypress.Commands.add('createNote', ({ content, important }) => {
  cy.request({
    url: 'http://localhost:3001/api/notes',
    method: 'POST',
    body: { content, important },
    headers: {
      'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedNoteappUser')).token}`
    }
  })

  cy.visit('http://localhost:3000')
})
```



<!-- The command expects user to be logged in and the user's details to be saved to localStorage.  -->
该命令期望用户登录，并将用户的详细信息保存到 localStorage。



<!-- Now the formatting block becomes: -->
现在格式块变成:

```js
describe('Note app', function() {
  // ...

  describe('when logged in', function() {
    it('a new note can be created', function() {
      // ...
    })

    describe('and a note exists', function () {
      beforeEach(function () {
        // highlight-start
        cy.createNote({
          content: 'another note cypress',
          important: false
        })
        // highlight-end
      })

      it('it can be made important', function () {
        // ...
      })
    })
  })
})
```



<!-- The tests and the frontend code can be found from [githubissa](https://github.com/fullstack-hy2020/part2-notes/tree/part5-10) branch <i>part5-10</i>. -->
测试和前端代码可以从[github](https://github.com/fullstack-hy2020/part2-notes/tree/part5-10)分支<i>part5-10</i> 中找到。

### Changing the importance of a note
【改变便笺的重要性】
<!-- Lastly let's take a look at the test we did for changing the importance of a note.  -->
最后，让我们看一下我们为改变便笺的重要性所做的测试。
<!-- First we'll change the formatting block so that it creates three notes instead of one: -->
首先我们要改变块，让它创建三个便笺而不是一个:

```js
describe('when logged in', function() {
  describe('and several notes exist', function () {
    beforeEach(function () {
      // highlight-start
      cy.createNote({ content: 'first note', important: false })
      cy.createNote({ content: 'second note', important: false })
      cy.createNote({ content: 'third note', important: false })
      // highlight-end
    })

    it('one of those can be made important', function () {
      cy.contains('second note')
        .contains('make important')
        .click()

      cy.contains('second note')
        .contains('make not important')
    })
  })
})
```



<!-- How does the [cy.contains](https://docs.cypress.io/api/commands/contains.html) command actually work? -->
[cy.contains](https://docs.cypress.io/api/commands/contains.html) 命令实际上是如何工作的？


<!-- When we click the _cy.contains('second note')_ command in Cypress [Test Runner](https://docs.cypress.io/guides/core-concepts/test-runner.html), we see that the command searches for the element containing the text <i>second note</i>: -->
当我们在 Cypress  [Test Runner](https://docs.cypress.io/guides/core-concepts/test-runner.html)中单击 _cy.contains('second note')_ 命令时，我们会看到该命令搜索包含文本<i>second note</i> 的元素:

![](../../images/5/34ea.png)





<!-- By clicking the next line _.contains('make important')_ we see that the test uses  -->
通过单击下一行 _.contains('make important')_  ，我们可以看到测试使用

<!-- the 'make important' button corresponding to <i>second note</i>: -->
对应于<i>second note</i>的'make important'按钮:

![](../../images/5/35ea.png)




<!-- When chained, the second <i>contains</i> command <i>continues</i> the search from within the component found by the first command.  -->
链接时，第二个<i>contains</i> 命令<i>会继续</i>从第一个命令找到的组件中搜索。



<!-- If we had not chained the commands, and instead wrote -->
如果我们没有把这些命令串起来，而是把它们这么写：

```js
cy.contains('second note')
cy.contains('make important').click()
```


<!-- the result would have been totally different. The second line of the test would click the button of a wrong note: -->
结果会完全不同。 测试的第二行会点击一个错误便笺的按钮:

![](../../images/5/36ea.png)



<!-- When coding tests, you should check in the test runner that the tests use the right components! -->
在编写测试代码时，您应该检查测试运行程序是否使用了正确的组件！



<!-- Let's change the _Note_ component so that the text of the note is rendered to a <i>span</i>. -->
让我们更改 Note 组件，以便将 Note 的文本渲染为<i>span</i>。

```js
const Note = ({ note, toggleImportance }) => {
  const label = note.important
    ? 'make not important' : 'make important'

  return (
    <li className='note'>
      <span>{note.content}</span> // highlight-line
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}
```



<!-- Our tests break! As the test runner reveals,  _cy.contains('second note')_ now returns the component containing the text, and the button is not in it.  -->
我们的测试结束了！ 正如测试运行程序所揭示的， _cy.contains('second note')_现在返回包含文本的组件，而按钮不在其中。

![](../../images/5/37ea.png)




<!-- One way to fix this is the following: -->
解决这个问题的方法如下:

```js
it('other of those can be made important', function () {
  cy.contains('second note').parent().find('button').click()
  cy.contains('second note').parent().find('button')
    .should('contain', 'make not important')
})
```



<!-- In the first line, we use the [parent](https://docs.cypress.io/api/commands/parent.htm) command to access the parent element of the element containing <i>second note</i> and find the button from within it.  -->
在第一行中，我们使用[parent](https://docs.cypress.io/api/commands/parent.html)命令来访问包含<i>second note</i> 的元素的父元素，并在其中找到按钮。

<!-- Then we click the button, and check that the text on it changes.  -->
然后我们点击按钮，检查上面的文本是否改变。

<!-- Note that we use the command [find](https://docs.cypress.io/api/commands/find.html#Syntax) to search for the button. We cannot use [cy.get](https://docs.cypress.io/api/commands/get.html) here, because it always searches from the <i>whole</i> page and would return all 5 buttons on the page.  -->
注意，我们使用命令[find](https://docs.cypress.io/api/commands/find.html#syntax)来搜索按钮。 我们不能在这里使用[cy.get](https://docs.cypress.io/api/commands/get.html) ，因为它总是从 整个页面进行搜索，并返回页面上的所有5个按钮。



<!-- Unfortunately, we have some copypaste in the tests now, because the code for searching for the right button is always the same.  -->
不幸的是，我们现在在测试中有一些复制/粘贴，因为搜索正确按钮的代码总是相同的。


<!-- In these kinds of situations, it is possible to use the [as](https://docs.cypress.io/api/commands/as.html) command: -->
在这种情况下，可以使用[as](https://docs.cypress.io/api/commands/as.html)命令:

```js
it.only('other of those can be made important', function () {
  cy.contains('second note').parent().find('button').as('theButton')
  cy.get('@theButton').click()
  cy.get('@theButton').should('contain', 'make not important')
})
```


<!-- Now the first line finds the right button, and uses <i>as</i> to save it as <i>theButton</i>. The followings lines can use the named element with <i>cy.get('@theButton')</i>. -->
现在第一行找到正确的按钮，并使用<i>as</i> 保存为<i>theButton</i>。 下面的代码行可以使用命名元素 <i>cy.get('@theButton')</i>来获取。

### Running and debugging the tests 
【运行和调试测试】

<!-- Finally, some notes on how Cypress works and debugging your tests. -->
最后，还有一些关于 Cypress 如何工作和调试测试的注意事项。

<!-- The form of the Cypress tests gives the impression, that the tests are normal JavaScript code, and we could for example try this: -->
Cypress 测试的形式给人的印象是，测试是正常的 JavaScript 代码，我们可以试试这个: 

```js
const button = cy.contains('login')
button.click()
debugger() 
cy.contains('logout').click()
```


<!-- This won't work however. When Cypress runs a test, it adds each _cy_ command to an execution queue.  -->
但是这不起作用，当 Cypress 运行测试时，它会将每个 cy 命令添加到一个执行队列中。
<!-- When the code of the test method has been executed, Cypres will execute each command in the queue one by one.  -->
当执行测试方法的代码时，Cypress 将逐个执行队列中的每个命令。



<!-- Cypress commands always return _undefined_, so _button.click()_ in the above code would cause an error. An attempt to start the debugger would not stop the code between executing the commands, but before any commands have been executed.  -->
Cypress 命令总是返回 _undefined_ ，因此上面代码中的_button.click()_会导致错误。 试图启动调试器不会在执行命令之间停止代码，但会在执行任何命令之前停止。 



<!-- Cypress commands are <i>like promises</i>, so if we want to access their return values, we have to do it using the [then](https://docs.cypress.io/api/commands/then.html) command.  -->
Cypress 命令是<i>类似 promises</i>，所以如果我们想访问它们的返回值，我们必须使用[then](https://docs.Cypress.io/api/commands/then.html)命令。 

<!-- For example, the following test would print the number of buttons in the application, and click the first button:  -->
例如，下面的测试将打印应用中的按钮数，然后单击第一个按钮:

```js
it('then example', function() {
  cy.get('button').then( buttons => {
    console.log('number of buttons', buttons.length)
    cy.wrap(buttons[0]).click()
  })
})
```



<!-- Stopping the test execution with the debugger is [possible](https://docs.cypress.io/api/commands/debug.html). The debugger starts only if Cypress test runner's developer console is open.  -->
使用调试器停止测试执行是[可行的](https://docs.cypress.io/api/commands/debug.html)。 只有当 Cypress 测试运行程序的开发人员控制台打开时，调试器才会启动。



<!-- The developer console is all sorts of useful when debugging your tests.  -->
开发控制台在调试测试时非常有用。
<!-- You can see the HTTP requests done by the tests on the Network tab, and the console tab will show you information about your tests: -->
你可以在 Network 选项卡上看到测试完成的 HTTP 请求，控制台选项卡会显示关于测试的信息:

![](../../images/5/38ea.png)



<!-- So far we have run our Cypress tests using the graphical test runner. -->
到目前为止，我们已经使用图形化的测试运行了 Cypress 测试。
<!-- It is also possible to run them [from the command line](https://docs.cypress.io/guides/guides/command-line.html). We just have to add an npm script for it: -->
也可以[从命令行](https://docs.cypress.io/guides/guides/command-line.html)运行它们。 我们只需要为它添加一个 npm 脚本:

```js
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "server": "json-server -p3001 --watch db.json",
    "cypress:open": "cypress open",
    "test:e2e": "cypress run" // highlight-line
  },
```



<!-- Now we can run our tests from the command line with the command <i>npm run test:e2e</i> -->
现在，我们可以使用命令<i>npm run test: e2e</i> 从命令行运行测试

![](../../images/5/39ea.png)



<!-- Note that video of the test execution will be saved to <i>cypress/videos/</i>, so you should propably git ignore this directory.  -->
注意，测试执行的视频将被保存到<i>cypress/videos/</i>中，因此您可能应该用gitignore忽略这个目录。



<!-- The frontend- and the test code can be found from [github](https://github.com/fullstack-hy2020/part2-notes/tree/part5-11) branch <i>part5-11</i>. -->
前端和测试代码可以在[github](https://github.com/fullstack-hy2020/part2-notes/tree/part5-11)分支<i>part5-11</i> 中找到。

</div>


<div class="tasks">


### Exercises 5.17.-5.22.

<!-- In the last exercises of this part we will do some E2E tests for our blog application.  -->
在这一章节的最后练习中，我们将为我们的博客应用做一些 E2E 测试。
<!-- The material of this part should be enough to complete the exercises.  -->
这部分的材料应该足以完成这些练习。
<!-- You should absolutely also check out the Cypress [documentation](https://docs.cypress.io/guides/overview/why-cypress.html#In-a-nutshell). It is propably the best documentation I have ever seen for an open source project.  -->
你绝对应该看看 Cypress [文档](https://docs.Cypress.io/guides/overview/why-Cypress.html#in-a-nutshell 文档)。 这可能是我见过的最好的开源项目文档。

<!-- I especially recommend reading [Introduction to Cypress](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#Cypress-Can-Be-Simple-Sometimes), which states -->
我特别推荐阅读《Cypress 简介》 [Introduction to Cypress](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#Cypress-Can-Be-Simple-Sometimes)，其中说到

> <i>This is the single most important guide for understanding how to test with Cypress. Read it. Understand it.</i><br>
这是了解如何使用Cypress进行测试的最重要的指南。读一读，了解一下

#### 5.17: bloglist end to end testing, 步骤1


<!-- Configure Cypress to your project. Make a test for checking that the application displays the login form by default. -->
在项目中配置 Cypress。做一个测试，检查应用是否默认显示登录表单。

<!-- The structure of the test must be as follows -->
测试的结构必须如下

```js 
describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    // ...
  })
})
```



<!-- The <i>beforeEach</i> formatting blog must empty the database using for example the method we used in the [material](/osa5/end_to_end_testaus#tietokannan-tilan-kontrollointi). -->
格式化博客的<i>beforeEach</i> 必须清空数据库，例如使用 [教材](/zh/part5/端到端测试#controlling-the-state-of-the-database)中使用的方法。


#### 5.18: bloglist end to end testing, 步骤2
<!-- Make tests for logging in. Test both successful and unsuccessful log in attempts.  -->
对登录进行测试。测试成功和失败的登录尝试。

<!-- Make a new user in the <i>beforeEach</i> block for the tests. -->
在<i>beforeEach</i> 块中为测试创建一个新用户。

<!-- The test structure extends like so -->
测试结构是这样扩展的

```js 
describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    // create here a user to backend
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    // ...
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      // ...
    })

    it('fails with wrong credentials', function() {
      // ...
    })
  })
})
```

<!--<i>Optional bonus exercise</i>: Check that the notification shown with unsuccessful login is displayed red. -->
<i>可选的附加练习Optional bonus exercise</i>:  检查显示未成功登入的通知是否显示为红色。

#### 5.19: bloglist end to end testing, 步骤3

<!-- Make a test which checks, that a logged in user can create a new blog.  -->
做一个测试，检查登录用户是否可以创建一个新的博客。
<!-- The structure of the test could be as follows -->
测试的结构可以如下

```js 
describe('Blog app', function() {
  // ...

  describe.only('When logged in', function() {
    beforeEach(function() {
      // log in user here
    })

    it('A blog can be created', function() {
      // ...
    })
  })

})
```



<!-- The test has to ensure, that a new blog is added to the list of all blogs.  -->
这个测试必须确保，一个新的博客被添加到所有的博客列表中。

#### 5.20: bloglist end to end testing, 步骤4


<!-- Make a test which checks that user can like a blog.  -->
做一个测试，检查用户是否能点赞博客。

#### 5.21: bloglist end to end testing, 步骤5
<!-- Make a test for ensuring, that the user who created a blog can delete it.  -->
做一个测试来确保，创建博客的用户可以删除它。



<!--<i>Optional bonus exercise:</i> also check that other users cannot delete the blog. -->
<i>可选附加练习Optional bonus exercise</i>:  检查其他用户不能删除的博客。

#### 5.22: bloglist end end testing, 步骤 6
<!-- Make a test which checks, that the blogs are ordered according to likes with the blog with the most likes being first.  -->
先做一个检查，看看博客是否按照喜好排序，最喜欢的博客放最前面。

<!-- This exercise might be a bit trickier. One solution is to find all of the blogs and then compare them in the callback function of a [then](https://docs.cypress.io/api/commands/then.html#DOM-element) command.  -->
这项工作可能有点棘手。 一个解决方案是找到所有的博客，然后在[then](https://docs.cypress.io/api/commands/then.html#dom-element)命令的回调函数中对它们进行比较。

<!-- If you use a `map` on an a selection from cypress, mind that it uses a [jQuery map](https://api.jquery.com/map/#map-callback). This means that the arguments of the callback function are swapped from an [ordinary Javascript map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) (i.e. you use `(i, el) => {...}` instead of `(el, i) => {...}`). -->

如果你是从cypress 使用的 `map` ， 记住它实际上是使用的  [jQuery map](https://api.jquery.com/map/#map-callback) 。 也就是说回调函数的入参与[ordinary Javascript map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) 相比是颠倒的。（比如说，你应该使用`(i, el) => {...}` 而不是`(el, i) => {...}` ）。

<!-- This was the last exercise of this part, and its time to push your code to github and mark the exercises you completed in the [exercise submission system](https://studies.cs.helsinki.fi/stats/courses/fullstackopen). -->
这是本章节的最后一个练习，是时候将您的代码推送到 github，并标记您在[exercise submission system](https://studies.cs.helsinki.fi/stats/courses/fullstackopen)中完成的练习。


</div>

