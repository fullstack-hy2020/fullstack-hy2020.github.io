---
mainImage: ../../../images/part-5.svg
part: 5
letter: d
lang: zh
---

<div class="content">

<!-- So far we have tested the backend as a whole on an API level using integration tests and tested some frontend components using unit tests.-->
到目前为止，我们已经通过集成测试在API层面对后端整体进行了测试，并使用单元测试测试了一些前端组件。

<!-- Next, we will look into one way to test the [system as a whole](https://en.wikipedia.org/wiki/System_testing) using <i>End to End</i> (E2E) tests.-->
接下来，我们将使用<i>端到端</i>（E2E）测试来检查[整个系统](https://en.wikipedia.org/wiki/System_testing)的一种方法。

<!-- We can do E2E testing of a web application using a browser and a testing library. There are multiple libraries available. One example is [Selenium](http://www.seleniumhq.org/), which can be used with almost any browser.-->
我们可以使用浏览器和测试库来对Web应用程序进行端到端测试。有多种库可供使用。一个例子是[Selenium](http://www.seleniumhq.org/)，它可以与几乎任何浏览器一起使用。
<!-- Another browser option is so-called [headless browsers](https://en.wikipedia.org/wiki/Headless_browser), which are browsers with no graphical user interface.-->
另一个浏览器选项是所谓的[无头浏览器](https://en.wikipedia.org/wiki/Headless_browser)，这些浏览器没有图形用户界面。
<!-- For example, Chrome can be used in headless mode.-->
例如，Chrome 可以在无头模式下使用。

<!-- E2E tests are potentially the most useful category of tests because they test the system through the same interface as real users use.-->
E2E 测试可能是最有用的测试类别，因为它们通过与真实用户使用的相同界面来测试系统。

<!-- They do have some drawbacks too. Configuring E2E tests is more challenging than unit or integration tests. They also tend to be quite slow, and with a large system, their execution time can be minutes or even hours. This is bad for development because during coding it is beneficial to be able to run tests as often as possible in case of code [regressions](https://en.wikipedia.org/wiki/Regression_testing).-->
他们也有一些缺点。配置端到端测试比单元或集成测试更具挑战性。它们的执行速度也很慢，对于大型系统来说，执行时间可能是几分钟甚至几个小时。这对开发来说是不利的，因为在编码期间，为了防止[回归](https://en.wikipedia.org/wiki/Regression_testing)，可以尽可能频繁地运行测试。

<!-- E2E tests can also be [flaky](https://hackernoon.com/flaky-tests-a-war-that-never-ends-9aa32fdef359).-->
E2E 测试也可能[毛毛的](https://hackernoon.com/flaky-tests-a-war-that-never-ends-9aa32fdef359)。
<!-- Some tests might pass one time and fail another, even if the code does not change at all.-->
有些测试有时候可以通过，有时候又会失败，即使代码根本没有改变。

### Cypress

<!-- E2E library [Cypress](https://www.cypress.io/) has become popular within the last year. Cypress is exceptionally easy to use, and when compared to Selenium, for example, it requires a lot less hassle and headache.-->
[Cypress](https://www.cypress.io/) 这个端到端库在过去一年里变得十分流行。Cypress 非常容易使用，与 Selenium 相比，它所需要的麻烦和头痛要少得多。
<!-- Its operating principle is radically different than most E2E testing libraries because Cypress tests are run completely within the browser.-->
它的操作原理与大多数端到端测试库完全不同，因为Cypress测试完全在浏览器内运行。
<!-- Other libraries run the tests in a Node process, which is connected to the browser through an API.-->
其他库在Node进程中运行测试，该Node进程通过API与浏览器连接。

<!-- Let''s make some end-to-end tests for our note application.-->
让我们为我们的笔记应用程序做一些端到端的测试。

<!-- We begin by installing Cypress to <i>the frontend</i> as a development dependency-->
我们从将Cypress安装到<i>前端</i>作为开发依赖项开始。

```js
npm install --save-dev cypress
```

<!-- and by adding an npm-script to run it:-->
# 翻譯

以下文本從英語翻譯為中文，保持標記語言格式：並通過添加npm腳本來運行它：

```
Adding an npm-script to run it

添加npm腳本來運行它
```

```js
{
  // ...
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "cypress:open": "cypress open"  // highlight-line
  },
  // ...
}
```

<!-- Unlike the frontend''s unit tests, Cypress tests can be in the frontend or the backend repository, or even in their separate repository.-->
不像前端的單元測試，Cypress 測試可以在前端或後端存儲庫中，甚至可以在它們的獨立存儲庫中。

<!-- The tests require the tested system to be running. Unlike our backend integration tests, Cypress tests <i>do not start</i> the system when they are run.-->
测试需要测试系统正在运行。不像我们的后端集成测试，Cypress测试<i>不会</i>在运行时启动系统。

<!-- Let''s add an npm script to <i>the backend</i> which starts it in test mode, or so that <i>NODE\_ENV</i> is <i>test</i>.-->
让我们给<i>后台</i>添加一个npm脚本，以便以测试模式启动它，或者使<i>NODE\_ENV</i>为<i>test</i>。

```js
{
  // ...
  "scripts": {
    "start": "NODE_ENV=production node index.js",
    "dev": "NODE_ENV=development nodemon index.js",
    "build:ui": "rm -rf build && cd ../frontend/ && npm run build && cp -r build ../backend",
    "deploy": "fly deploy",
    "deploy:full": "npm run build:ui && npm run deploy",
    "logs:prod": "fly logs",
    "lint": "eslint .",
    "test": "jest --verbose --runInBand",
    "start:test": "NODE_ENV=test node index.js" // highlight-line
  },
  // ...
}
```

<!-- **NB** To get Cypress working with WSL2 one might need to do some additional configuring first. These two [links](https://docs.cypress.io/guides/getting-started/installing-cypress#Windows-Subsystem-for-Linux) are great places to [start](https://nickymeuleman.netlify.app/blog/gui-on-wsl2-cypress).-->
**NB** 要让Cypress与WSL2一起工作，可能需要先进行一些额外的配置。这两个[链接](https://docs.cypress.io/guides/getting-started/installing-cypress#Windows-Subsystem-for-Linux)是[开始](https://nickymeuleman.netlify.app/blog/gui-on-wsl2-cypress)的好地方。

<!-- When both the backend and frontend are running, we can start Cypress with the command-->
`npx cypress open`

当后端和前端都运行时，我们可以使用命令`npx cypress open`启动Cypress。

```js
npm run cypress:open
```

<!-- Cypress asks what type of tests we are doing. Let us answer "E2E Testing":-->
Cypress 问我们正在做什么样的测试？让我们回答“端到端测试”：

![cypress arrow towards e2e testing option](../../images/5/51new.png)

<!-- Next a browser is selected (e.g. Chrome) and then we click "Create new spec":-->
下一步，选择一个浏览器（例如Chrome），然后点击“创建新规格”：

![create new spec with arrow pointing towards it](../../images/5/52new.png)

<!-- Let us create the test file <i>cypress/e2e/note\_app.cy.js</i>:-->
让我们创建测试文件 <i>cypress/e2e/note\_app.cy.js</i>：

![cypress with path cypress/e2e/note_app.cy.js](../../images/5/53new.png)

<!-- We could edit the tests in Cypress but let us rather use VS Code:-->
我們可以在Cypress中編輯測試，但讓我們改用VS Code吧！

![vscode showing edits of test and cypress showing spec added](../../images/5/54new.png)

<!-- We can now close the edit view of Cypress.-->
我們現在可以關閉Cypress的編輯視圖了。

<!-- Let us change the test content as follows:-->
# 让我们改变测试内容如下

```js
describe('Note app', function() {
  it('front page can be opened', function() {
    cy.visit('http://localhost:3000')
    cy.contains('Notes')
    cy.contains('Note app, Department of Computer Science, University of Helsinki 2023')
  })
})
```

<!-- The test is run by clicking the test in the Cypress:-->
点击Cypress中的测试来运行测试。

<!-- Running the test shows how the application behaves as the test is run:-->
运行测试可以显示出应用程序在测试运行时的行为：

![cypress showing automation of note test](../../images/5/56new.png)

<!-- The structure of the test should look familiar. They use <i>describe</i> blocks to group different test cases, just like Jest. The test cases have been defined with the <i>it</i> method. Cypress borrowed these parts from the [Mocha](https://mochajs.org/) testing library it uses under the hood.-->
结构应该看起来很熟悉。他们使用<i>描述</i>块来分组不同的测试用例，就像Jest一样。测试用例已经使用<i>它</i>方法定义。Cypress从它在底层使用的[Mocha](https://mochajs.org/)测试库中借用了这些部分。

<!-- [cy.visit](https://docs.cypress.io/api/commands/visit.html) and [cy.contains](https://docs.cypress.io/api/commands/contains.html) are Cypress commands, and their purpose is quite obvious.-->
[cy.visit](https://docs.cypress.io/api/commands/visit.html) 和 [cy.contains](https://docs.cypress.io/api/commands/contains.html) 是Cypress命令，它们的目的非常明显。
<!-- [cy.visit](https://docs.cypress.io/api/commands/visit.html) opens the web address given to it as a parameter in the browser used by the test. [cy.contains](https://docs.cypress.io/api/commands/contains.html) searches for the string it received as a parameter from the page.-->
[cy.visit](https://docs.cypress.io/api/commands/visit.html) 将作为参数传入的网址在测试所使用的浏览器中打开。[cy.contains](https://docs.cypress.io/api/commands/contains.html) 从页面中搜索它作为参数接收到的字符串。

<!-- We could have declared the test using an arrow function-->
我们可以使用箭头函数声明测试

```js
describe('Note app', () => { // highlight-line
  it('front page can be opened', () => { // highlight-line
    cy.visit('http://localhost:3000')
    cy.contains('Notes')
    cy.contains('Note app, Department of Computer Science, University of Helsinki 2023')
  })
})
```

<!-- However, Mocha [recommends](https://mochajs.org/#arrow-functions) that arrow functions are not used, because they might cause some issues in certain situations.-->
然而，Mocha [推荐](https://mochajs.org/#arrow-functions) 不使用箭头函数，因为在某些情况下它们可能会导致一些问题。

<!-- If <i>cy.contains</i> does not find the text it is searching for, the test does not pass.  So if we extend our test like so-->
, we can ensure that our code is working as expected.

如果<i>cy.contains</i>没有找到它正在搜索的文本，则测试不通过。因此，如果我们像这样扩展我们的测试，我们可以确保我们的代码正常工作。

```js
describe('Note app', function() {
  it('front page can be opened',  function() {
    cy.visit('http://localhost:3000')
    cy.contains('Notes')
    cy.contains('Note app, Department of Computer Science, University of Helsinki 2023')
  })

// highlight-start
  it('front page contains random text', function() {
    cy.visit('http://localhost:3000')
    cy.contains('wtf is this app?')
  })
// highlight-end
})
```

<!-- the test fails-->
测试失败

![cypress showing failure expecting to find wtf but no](../../images/5/57new.png)

<!-- Let''s remove the failing code from the test.-->
让我们从测试中移除失败的代码吧。

<!-- The variable _cy_ our tests use gives us a nasty Eslint error-->
变量_cy_我们测试使用给了我们一个讨厌的Eslint错误

![vscode screenshot showing cy is not defined](../../images/5/58new.png)

<!-- We can get rid of it by installing [eslint-plugin-cypress](https://github.com/cypress-io/eslint-plugin-cypress) as a development dependency-->
.

我们可以通过将[eslint-plugin-cypress](https://github.com/cypress-io/eslint-plugin-cypress)安装为开发依赖项来摆脱它。

```js
npm install eslint-plugin-cypress --save-dev
```

<!-- and changing the configuration in <i>.eslintrc.js</i> like so:-->
将以下文本从英语翻译成中文，保持markdown格式：并将<i> .eslintrc.js </i>中的配置更改如下：

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

### Writing to a form

<!-- Let''s extend our tests so that the test tries to log in to our application.-->
让我们扩展我们的测试，以便测试尝试登录我们的应用程序。
<!-- We assume our backend contains a user with the username <i>mluukkai</i> and password <i>salainen</i>.-->
我們假設我們的後端包含一個使用者，使用者名稱為<i>mluukkai</i>，密碼為<i>salainen</i>。

<!-- The test begins by opening the login form.-->
测试从打开登录表单开始。

```js
describe('Note app',  function() {
  // ...

  it('login form can be opened', function() {
    cy.visit('http://localhost:3000')
    cy.contains('log in').click()
  })
})
```

<!-- The test first searches for the login button by its text and clicks the button with the command [cy.click](https://docs.cypress.io/api/commands/click.html#Syntax).-->
测试首先通过文本搜索登录按钮，并使用命令[cy.click](https://docs.cypress.io/api/commands/click.html#Syntax)点击该按钮。

<!-- Both of our tests begin the same way, by opening the page <i><http://localhost:3000></i>, so we should-->
make sure that works first.

两个测试都以相同的方式开始，打开页面<i><http://localhost:3000></i>，因此我们应该首先确保它可以正常工作。
<!-- separate the shared part into a <i>beforeEach</i> block run before each test:-->
<i>beforeEach</i>块在每个测试之前运行：

```
const assert = require('assert');

describe('Array', () => {
  beforeEach(() => {
    // ...
  });
 
  describe('#indexOf()', () => {
    it('should return -1 when the value is not present', () => {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});
```

```
const assert = require('assert');

describe('数组', () => {
  <i>beforeEach</i>(() => {
    // ...
  });
 
  describe('#indexOf()', () => {
    it('当值不存在时应该返回-1', () => {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});
```

```js
describe('Note app', function() {
  // highlight-start
  beforeEach(function() {
    cy.visit('http://localhost:3000')
  })
  // highlight-end

  it('front page can be opened', function() {
    cy.contains('Notes')
    cy.contains('Note app, Department of Computer Science, University of Helsinki 2023')
  })

  it('login form can be opened', function() {
    cy.contains('log in').click()
  })
})
```

<!-- The login field contains two <i>input</i> fields, which the test should write into.-->
登录字段包含两个<i>输入</i>字段，测试者应该将其填入。

<!-- The [cy.get](https://docs.cypress.io/api/commands/get.html#Syntax) command allows for searching elements by CSS selectors.-->
[cy.get](https://docs.cypress.io/api/commands/get.html#Syntax) 命令允许通过CSS选择器搜索元素。

<!-- We can access the first and the last input field on the page, and write to them with the command [cy.type](https://docs.cypress.io/api/commands/type.html#Syntax) like so:-->
我们可以访问页面上的第一个和最后一个输入字段，并使用[cy.type](https://docs.cypress.io/api/commands/type.html#Syntax)命令写入它们，如下所示：

```js
it('user can login', function () {
  cy.contains('log in').click()
  cy.get('input:first').type('mluukkai')
  cy.get('input:last').type('salainen')
})
```

<!-- The test works. The problem is if we later add more input fields, the test will break because it expects the fields it needs to be the first and the last on the page.-->
测试运行良好。问题是如果我们之后添加更多的输入字段，测试将会失败，因为它期望页面上的字段是第一个和最后一个。

<!-- It would be better to give our inputs unique <i>ids</i> and use those to find them.-->
应该给我们的输入一个唯一的<i>id</i>，然后用它们来找到它们。
<!-- We change our login form like so:-->
我们按照如下方式更改登录表单：

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

<!-- We also added an id to our submit button so we can access it in our tests.-->
我们还为提交按钮添加了一个id，这样我们就可以在测试中访问它。

<!-- The test becomes:-->
测试变成：

```js
describe('Note app',  function() {
  // ..
  it('user can log in', function() {
    cy.contains('log in').click()
    cy.get('#username').type('mluukkai')  // highlight-line
    cy.get('#password').type('salainen')  // highlight-line
    cy.get('#login-button').click()  // highlight-line

    cy.contains('Matti Luukkainen logged in') // highlight-line
  })
})
```

<!-- The last row ensures that the login was successful.-->
最后一行确保登录成功。

<!-- Note that the CSS [id-selector](https://developer.mozilla.org/en-US/docs/Web/CSS/ID_selectors) is #, so if we want to search for an element with the id <i>username</i> the CSS selector is <i>#username</i>.-->
注意，CSS [id-selector](https://developer.mozilla.org/en-US/docs/Web/CSS/ID_selectors) 是#，所以如果我们想搜索具有id <i>username</i> 的元素，CSS 选择器是 <i>#username</i>。

<!-- Please note that passing the test at this stage requires that there is a user in the test database of the backend environment whose username is <i>mluukkai</i> and the password is <i>salainen</i>. Create a user if needed!-->
请注意，在此阶段通过测试需要后端环境的测试数据库中有一个用户，用户名为<i>mluukkai</i>，密码为<i>salainen</i>。如果需要，请创建一个用户！

### Testing new note form

<!-- Let''s next add test methods to test the "new note" functionality:-->
让我们接下来添加一些测试方法来测试"新笔记"功能：

```js
describe('Note app', function() {
  // ..
  // highlight-start
  describe('when logged in', function() {
    beforeEach(function() {
      cy.contains('log in').click()
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

<!-- The test has been defined in its own <i>describe</i> block.-->
测试已经在它自己的 <i>描述</i> 块中定义。
<!-- Only logged-in users can create new notes, so we added logging in to the application to a <i>beforeEach</i> block.-->
只有登录的用户才能创建新的笔记，因此我们将登录应用程序添加到<i>beforeEach</i>块中。

<!-- The test trusts that when creating a new note the page contains only one input, so it searches for it like so:-->
测试相信，当创建一个新笔记时，页面只包含一个输入，因此它像这样搜索它：

```js
cy.get('input')
```

<!-- If the page contained more inputs, the test would break-->
如果页面包含更多的输入，测试就会破坏。

![cypress error - cy.type can only be called on a single element](../../images/5/31x.png)

<!-- Due to this problem, it would again be better to give the input an <i>id</i> and search for the element by its id.-->
由于这个问题，最好再给输入一个<i>id</i>，并通过它的id搜索元素。

<!-- The structure of the tests looks like so:-->
结构如下：

```js
describe('Note app', function() {
  // ...

  it('user can log in', function() {
    cy.contains('log in').click()
    cy.get('#username').type('mluukkai')
    cy.get('#password').type('salainen')
    cy.get('#login-button').click()

    cy.contains('Matti Luukkainen logged in')
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.contains('log in').click()
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

<!-- Cypress runs the tests in the order they are in the code. So first it runs <i>user can log in</i>, where the user logs in. Then cypress will run <i>a new note can be created</i> for which a <i>beforeEach</i> block logs in as well.-->
Cypress 按照代码中的顺序运行测试。因此，首先它运行 <i>user can log in</i>，用户在此登录。然后，Cypress 会运行 <i>a new note can be created</i>，其中 <i>beforeEach</i> 块也会登录。
<!-- Why do this? Isn''t the user logged in after the first test?-->
为什么要这样做？用户在第一次测试后不是已经登录了吗？
<!-- No, because <i>each</i> test starts from zero as far as the browser is concerned.-->
不，因为就浏览器而言，<i>每</i>个测试都从零开始。
<!-- All changes to the browser''s state are reversed after each test.-->
所有对浏览器状态的更改在每次测试后都会被恢复。

### Controlling the state of the database

<!-- If the tests need to be able to modify the server's database, the situation immediately becomes more complicated. Ideally, the server's database should be the same each time we run the tests, so our tests can be reliably and easily repeatable.-->
如果测试需要能够修改服务器的数据库，情况立刻变得更加复杂。理想情况下，每次我们运行测试时服务器的数据库应该是相同的，这样我们的测试就可以可靠而轻松地重复。

<!-- As with unit and integration tests, with E2E tests it is best to empty the database and possibly format it before the tests are run. The challenge with E2E tests is that they do not have access to the database.-->
随着单元和集成测试，E2E 测试最好在运行测试之前清空数据库，并可能格式化它。 E2E 测试的挑战在于它们无法访问数据库。

<!-- The solution is to create API endpoints for the backend tests.-->
解决方案是为后端测试创建API端点。
<!-- We can empty the database using these endpoints.-->
我们可以通过这些端点清空数据库。
<!-- Let''s create a new router for the tests inside the <i>controllers</i> folder, in the <i>testing.js</i> file-->
让我们在<i>controllers</i>文件夹中为测试创建一个新的路由器，在<i>testing.js</i>文件中。

```js
const testingRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')

testingRouter.post('/reset', async (request, response) => {
  await Note.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = testingRouter
```

<!-- and add it to the backend only <i>if the application is run in test-mode</i>:-->
如果应用程序在测试模式下运行，则只在后端添加它。

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

<!-- After the changes, an HTTP POST request to the <i>/api/testing/reset</i> endpoint empties the database. Make sure your backend is running in test mode by starting it with this command (previously configured in the package.json file):-->
在進行了更改後，對 <i>/api/testing/reset</i> 端點的 HTTP POST 請求將清空資料庫。確保您的後端以此命令啟動並運行在測試模式（之前在 package.json 檔案中配置）：

```js
  npm run start:test
```

<!-- The modified backend code can be found on the [GitHub](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part5-1) branch <i>part5-1</i>.-->
修改后的后端代码可以在[GitHub](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part5-1)分支<i>part5-1</i>上找到。

<!-- Next, we will change the <i>beforeEach</i> block so that it empties the server''s database before tests are run.-->
接下来，我们将更改<i>beforeEach</i>块，以便在运行测试之前清空服务器的数据库。

<!-- Currently, it is not possible to add new users through the frontend''s UI, so we add a new user to the backend from the beforeEach block.-->
目前，无法通过前端的用户界面添加新用户，因此我们从beforeEach块中添加新用户到后端。

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

<!-- During the formatting, the test does HTTP requests to the backend with [cy.request](https://docs.cypress.io/api/commands/request.html).-->
在格式化期間，測試會使用[cy.request](https://docs.cypress.io/api/commands/request.html)向後端發出HTTP請求。

<!-- Unlike earlier, now the testing starts with the backend in the same state every time. The backend will contain one user and no notes.-->
不像以前，現在每次測試都從相同的後端狀態開始。後端將包含一個用戶和沒有筆記。

<!-- Let''s add one more test for checking that we can change the importance of notes.-->
让我们再加一个测试，以检查我们是否可以更改注释的重要性。

<!-- A while ago we changed the frontend so that a new note is important by default, or the <i>important</i> field is <i>true</i>:-->
一段時間以前，我們更改了前端，以便新筆記默認為重要，或者<i>重要</i>字段為<i>true</i>：

```js
const NoteForm = ({ createNote }) => {
  // ...

  const addNote = (event) => {
    event.preventDefault()
    createNote({
      content: newNote,
      important: true // highlight-line
    })

    setNewNote('')
  }
  // ...
}
```

<!-- There are multiple ways to test this. In the following example, we first search for a note and click its <i>make not important</i> button. Then we check that the note now contains a <i>make important</i> button.-->
有多种方法可以测试这个。在下面的例子中，我们首先搜索一个笔记，然后点击它的<i>使不重要</i>按钮。然后我们检查该笔记现在包含一个<i>使重要</i>按钮。

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

      it('it can be made not important', function () {
        cy.contains('another note cypress')
          .contains('make not important')
          .click()

        cy.contains('another note cypress')
          .contains('make important')
      })
    })
  })
})
```

<!-- The first command searches for a component containing the text <i>another note cypress</i>, and then for a <i>make not important</i> button within it. It then clicks the button.-->
第一个命令搜索包含文本<i>另一个注意柏油</i>的组件，然后搜索该组件内的<i>使不重要</i>按钮，然后点击该按钮。

<!-- The second command checks that the text on the button has changed to <i>make important</i>.-->
第二个命令检查按钮上的文本是否已更改为<i>做重要决定</i>。

<!-- The tests and the current frontend code can be found on the [GitHub](https://github.com/fullstack-hy2020/part2-notes/tree/part5-9) branch <i>part5-9</i>.-->
测试和当前的前端代码可以在[GitHub](https://github.com/fullstack-hy2020/part2-notes/tree/part5-9)分支<i>part5-9</i>中找到。

### Failed login test

<!-- Let''s make a test to ensure that a login attempt fails if the password is wrong.-->
让我们做一个测试来确保如果密码错误，登录尝试失败。

<!-- Cypress will run all tests each time by default, and as the number of tests increases, it starts to become quite time-consuming.-->
默认情况下，Cypress会每次运行所有测试，随着测试数量的增加，这会变得非常耗时。
<!-- When developing a new test or when debugging a broken test, we can define the test with <i>it.only</i> instead of <i>it</i>, so that Cypress will only run the required test.-->
当开发一个新的测试或调试一个坏掉的测试时，我们可以用<i>it.only</i>而不是<i>it</i>来定义测试，这样Cypress就只会运行所需要的测试。
<!-- When the test is working, we can remove <i>.only</i>.-->
当测试正在运行时，我们可以移除<i>。仅此而已</i>。

<!-- First version of our tests is as follows:-->
第一版我们的测试如下：

```js
describe('Note app', function() {
  // ...

  it.only('login fails with wrong password', function() {
    cy.contains('log in').click()
    cy.get('#username').type('mluukkai')
    cy.get('#password').type('wrong')
    cy.get('#login-button').click()

    cy.contains('wrong credentials')
  })

  // ...
)}
```

<!-- The test uses [cy.contains](https://docs.cypress.io/api/commands/contains.html#Syntax) to ensure that the application prints an error message.-->
测试使用[cy.contains](https://docs.cypress.io/api/commands/contains.html#Syntax)来确保应用程序打印出一条错误消息。

<!-- The application renders the error message to a component with the CSS class <i>error</i>:-->
应用将错误消息渲染到具有CSS类<i>error</i>的组件：

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

<!-- We could make the test ensure that the error message is rendered to the correct component, that is, the component with the CSS class <i>error</i>:-->
我们可以使用测试来确保错误消息被渲染到正确的组件，也就是具有CSS类<i>error</i>的组件：

```js
it('login fails with wrong password', function() {
  // ...

  cy.get('.error').contains('wrong credentials') // highlight-line
})
```

<!-- First, we use [cy.get](https://docs.cypress.io/api/commands/get.html#Syntax) to search for a component with the CSS class <i>error</i>. Then we check that the error message can be found from this component.-->
首先，我们使用[cy.get](https://docs.cypress.io/api/commands/get.html#Syntax) 来搜索具有CSS类<i>error</i> 的组件。然后，我们检查错误消息是否可以从这个组件中找到。
<!-- Note that the [CSS class selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors) starts with a full stop, so the selector for the class <i>error</i> is <i>.error</i>.-->
注意[CSS 类选择器](https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors)以一个完整的句号开头，因此类<i>error</i>的选择器是<i>.error</i>。

<!-- We could do the same using the [should](https://docs.cypress.io/api/commands/should.html) syntax:-->
我们可以使用[should](https://docs.cypress.io/api/commands/should.html)语法来做同样的事情：

```js
it('login fails with wrong password', function() {
  // ...

  cy.get('.error').should('contain', 'wrong credentials') // highlight-line
})
```

<!-- Using should is a bit trickier than using <i>contains</i>, but it allows for more diverse tests than <i>contains</i> which works based on text content only.-->
使用应该比使用<i>contains</i>更棘手一些，但它比<i>contains</i>允许更多样化的测试，因为<i>contains</i>仅基于文本内容。

<!-- A list of the most common assertions which can be used with _should_ can be found [here](https://docs.cypress.io/guides/references/assertions.html#Common-Assertions).-->
可以在[这里](https://docs.cypress.io/guides/references/assertions.html#Common-Assertions)找到可以与_should_一起使用的最常见断言的列表。

<!-- We can, for example, make sure that the error message is red and it has a border:-->
我们可以，例如，确保错误消息是红色的，而且它有一个边框：

```js
it('login fails with wrong password', function() {
  // ...

  cy.get('.error').should('contain', 'wrong credentials')
  cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
  cy.get('.error').should('have.css', 'border-style', 'solid')
})
```

<!-- Cypress requires the colors to be given as [rgb](https://rgbcolorcode.com/color/red).-->
Cypress要求颜色以[rgb](https://rgbcolorcode.com/color/red)的形式给出。

<!-- Because all tests are for the same component we accessed using [cy.get](https://docs.cypress.io/api/commands/get.html#Syntax), we can chain them using [and](https://docs.cypress.io/api/commands/and.html).-->
因为所有的测试都是针对使用[cy.get](https://docs.cypress.io/api/commands/get.html#Syntax)访问的同一个组件，所以我们可以使用[and](https://docs.cypress.io/api/commands/and.html)来链接它们。

```js
it('login fails with wrong password', function() {
  // ...

  cy.get('.error')
    .should('contain', 'wrong credentials')
    .and('have.css', 'color', 'rgb(255, 0, 0)')
    .and('have.css', 'border-style', 'solid')
})
```

<!-- Let's finish the test so that it also checks that the application does not render the success message <i>'Matti Luukkainen logged in''</i>:-->
让我们完成测试，以检查应用程序是否不会渲染成功消息<i>'Matti Luukkainen登录'</i>：

```js
it('login fails with wrong password', function() {
  cy.contains('log in').click()
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

<!-- The command <i>should</i> is most often used by chaining it after the command <i>get</i> (or another similar command that can be chained). The <i>cy.get('html')</i> used in the test practically means the visible content of the entire application.-->
<i>应该</i> 这个命令最常用于在 <i>get</i> 命令（或其他可以被链接的类似命令）之后链接。在测试中使用的 <i>cy.get('html')</i> 实际上意味着整个应用程序的可见内容。

<!-- We would also check the same by chaining the command <i>contains</i> with the command <i>should</i> with a slightly different parameter:-->
我们也可以通过链接<i>contains</i> 命令和 <i>should</i> 命令，并使用稍有不同的参数来检查同样的结果：

```js
cy.contains('Matti Luukkainen logged in').should('not.exist')
```

<!-- **NOTE:** Some CSS properties [behave differently on Firefox](https://github.com/cypress-io/cypress/issues/9349). If you run the tests with Firefox:-->
**注意：**有些CSS属性[在Firefox上有不同的表现](https://github.com/cypress-io/cypress/issues/9349)。如果你用Firefox运行测试：

<!--   ![running](https://user-images.githubusercontent.com/4255997/119015927-0bdff800-b9a2-11eb-9234-bb46d72c0368.png)-->
![跑步](https://user-images.githubusercontent.com/4255997/119015927-0bdff800-b9a2-11eb-9234-bb46d72c0368.png)

<!--   then tests that involve, for example, `border-style`, `border-radius` and `padding`, will pass in Chrome or Electron, but fail in Firefox:-->
然后，涉及例如`border-style`，`border-radius`和`padding`的测试在Chrome或Electron中将通过，但在Firefox中将失败：

<!--   ![borderstyle](https://user-images.githubusercontent.com/4255997/119016340-7b55e780-b9a2-11eb-82e0-bab0418244c0.png)-->
![翻译结果](https://user-images.githubusercontent.com/4255997/119016587-d16e3a00-b9a2-11eb-9b5f-2f2e6f2f7a2a.png)

### Bypassing the UI

<!-- Currently, we have the following tests:-->
目前，我们有以下测试：

```js
describe('Note app', function() {
  it('user can login', function() {
    cy.contains('log in').click()
    cy.get('#username').type('mluukkai')
    cy.get('#password').type('salainen')
    cy.get('#login-button').click()

    cy.contains('Matti Luukkainen logged in')
  })

  it('login fails with wrong password', function() {
    // ...
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.contains('log in').click()
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

<!-- First, we test logging in. Then, in their own describe block, we have a bunch of tests, which expect the user to be logged in. User is logged in in the <i>beforeEach</i> block.-->
首先，我们测试登录。然后，在自己的描述块中，我们有一堆测试，期望用户已经登录。用户在<i>beforeEach</i>块中登录。

<!-- As we said above, each test starts from zero! Tests do not start from the state where the previous tests ended.-->
正如我们上面所说，每个测试都从零开始！测试不会从上一次测试结束的状态开始。

<!-- The Cypress documentation gives us the following advice: [Fully test the login flow – but only once!](https://docs.cypress.io/guides/end-to-end-testing/testing-your-app#Fully-test-the-login-flow-but-only-once).-->
[在 Cypress 文档中，给我们提出了以下建议：[完整地测试登录流程 - 但仅需一次！](https://docs.cypress.io/guides/end-to-end-testing/testing-your-app#Fully-test-the-login-flow-but-only-once)。](https://docs.cypress.io/guides/end-to-end-testing/testing-your-app#Fully-test-the-login-flow-but-only-once)
<!-- So instead of logging in a user using the form in the <i>beforeEach</i> block, Cypress recommends that we [bypass the UI](https://docs.cypress.io/guides/getting-started/testing-your-app.html#Bypassing-your-UI) and do an HTTP request to the backend to log in. The reason for this is that logging in with an HTTP request is much faster than filling out a form.-->
所以，Cypress建议我们[绕过UI](https://docs.cypress.io/guides/getting-started/testing-your-app.html#Bypassing-your-UI)，而不是在`beforeEach`块中使用表单登录用户，而是通过HTTP请求向后端发送登录请求。这样做的原因是，使用HTTP请求登录比填写表单要快得多。

<!-- Our situation is a bit more complicated than in the example in the Cypress documentation because when a user logs in, our application saves their details to the localStorage.-->
我们的情况比Cypress文档中的示例更加复杂，因为当用户登录时，我们的应用程序将他们的详细信息保存到localStorage中。
<!-- However, Cypress can handle that as well.-->
但是，Cypress也可以处理这个问题。
<!-- The code is the following-->
代码如下：

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

<!-- We can access the response to a [cy.request](https://docs.cypress.io/api/commands/request.html) with the _then_ method.  Under the hood <i>cy.request</i>, like all Cypress commands, are [promises](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#Commands-Are-Promises).-->
我们可以通过_then_方法访问[cy.request](https://docs.cypress.io/api/commands/request.html)的响应。在底层，<i>cy.request</i>，像所有Cypress命令一样，都是[承诺](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#Commands-Are-Promises)。
<!-- The callback function saves the details of a logged-in user to localStorage, and reloads the page.-->
回调函数将登录用户的详细信息保存到localStorage中，并重新加载页面。
<!-- Now there is no difference to a user logging in with the login form.-->
现在，用登录表单登录对用户没有差别。

<!-- If and when we write new tests to our application, we have to use the login code in multiple places.-->
如果我们给应用程序写新的测试，我们就必须在多个地方使用登录代码。
<!-- We should make it a [custom command](https://docs.cypress.io/api/cypress-api/custom-commands.html).-->
我们应该把它变成一个[自定义命令](https://docs.cypress.io/api/cypress-api/custom-commands.html)。

<!-- Custom commands are declared in <i>cypress/support/commands.js</i>.-->
自定义命令声明在<i>cypress/support/commands.js</i>中。
<!-- The code for logging in is as follows:-->
代码如下用于登录：

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

<!-- Using our custom command is easy, and our test becomes cleaner:-->
使用我们的自定义命令很容易，而且我们的测试变得更加干净：

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

<!-- The same applies to creating a new note now that we think about it. We have a test, which makes a new note using the form. We also make a new note in the <i>beforeEach</i> block of the test testing changing the importance of a note:-->
<i>同樣的道理也適用於現在創建一個新的筆記。我們有一個測試，它使用表單創建一個新的筆記。我們還在測試改變筆記重要性的<i>beforeEach</i>區塊中創建一個新的筆記：</i>

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

<!-- Let''s make a new custom command for making a new note. The command will make a new note with an HTTP POST request:-->
让我们为创建新笔记制定一个新的自定义命令。该命令将使用HTTP POST请求创建一个新笔记：

```js
Cypress.Commands.add('createNote', ({ content, important }) => {
  cy.request({
    url: 'http://localhost:3001/api/notes',
    method: 'POST',
    body: { content, important },
    headers: {
      'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loggedNoteappUser')).token}`
    }
  })

  cy.visit('http://localhost:3000')
})
```

<!-- The command expects the user to be logged in and the user''s details to be saved to localStorage.-->
命令期望用户已登录，并且用户的详细信息被保存到本地存储中。

<!-- Now the formatting block becomes:-->
现在格式块变成：

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
          important: true
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

<!-- There is one more annoying feature in our tests. The application address <i>http:localhost:3000</i> is hardcoded in many places.-->
在我們的測試中還有一個令人討厭的功能。在許多地方都硬編碼了應用地址<i>http:localhost:3000</i>。

<!-- Let''s define the <i>baseUrl</i> for the application in the Cypress pre-generated [configuration file](https://docs.cypress.io/guides/references/configuration) <i>cypress.config.js</i>:-->
在Cypress预生成的[配置文件](https://docs.cypress.io/guides/references/configuration)<i>cypress.config.js</i>中，让我们为应用定义<i>baseUrl</i>：

```js
const { defineConfig } = require("cypress")

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
    },
    baseUrl: 'http://localhost:3000' // highlight-line
  },
})
```

<!-- All the commands in the tests use the address of the application-->
所有测试中的命令都使用应用程序的地址

```js
cy.visit('http://localhost:3000' )
```

<!-- can be transformed into-->
经过改造，现代技术可以被转变成更实用的工具。

```js
cy.visit('')
```

<!-- The backend''s hardcoded address <i>http://localhost:3001</i> is still in the tests. Cypress [documentation](https://docs.cypress.io/guides/guides/environment-variables) recommends defining other addresses used by the tests as environment variables.-->
后端硬编码的地址<i>http://localhost:3001</i>仍然在测试中。Cypress [文档](https://docs.cypress.io/guides/guides/environment-variables)建议将测试中使用的其他地址定义为环境变量。

<!-- Let''s expand the configuration file <i>cypress.config.js</i> as follows:-->
让我们将配置文件 <i>cypress.config.js</i> 扩展如下：

```js
const { defineConfig } = require("cypress")

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
    },
    baseUrl: 'http://localhost:3000',
  },
  env: {
    BACKEND: 'http://localhost:3001/api' // highlight-line
  }
})
```

<!-- Let''s replace all the backend addresses from the tests in the following way-->
让我们以下列方式用新的后端地址替换所有测试中的后端地址：

```js
describe('Note ', function() {
  beforeEach(function() {

    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`) // highlight-line
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'secret'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user) // highlight-line
    cy.visit('')
  })
  // ...
})
```

<!-- The tests and the frontend code can be found on the [GitHub](https://github.com/fullstack-hy2020/part2-notes/tree/part5-10) branch <i>part5-10</i>.-->
测试和前端代码可以在[GitHub](https://github.com/fullstack-hy2020/part2-notes/tree/part5-10)分支<i>part5-10</i>上找到。

### Changing the importance of a note

<!-- Lastly, let''s take a look at the test we did for changing the importance of a note.-->
最后，让我们来看看我们为更改笔记的重要性所做的测试。
<!-- First, we''ll change the formatting block so that it creates three notes instead of one:-->
首先，我们将更改格式块，使其创建三个注释而不是一个：

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

<!-- How does the [cy.contains](https://docs.cypress.io/api/commands/contains.html) command actually work?-->
# 如何[cy.contains](https://docs.cypress.io/api/commands/contains.html)命令实际上运作？

<!-- When we click the _cy.contains('second note')_ command in Cypress [Test Runner](https://docs.cypress.io/guides/core-concepts/test-runner.html), we see that the command searches for the element containing the text <i>second note</i>:-->
当我们在Cypress [Test Runner](https://docs.cypress.io/guides/core-concepts/test-runner.html)中点击 _cy.contains('second note')_ 命令时，我们会发现该命令搜索包含文本<i>second note</i>的元素：

![cypress test runner clicking testbody and second note](../../images/5/34new.png)

<!-- By clicking the next line _.contains('make important')_ we see that the test uses-->
the _contains_ method

点击下一行 _.contains('make important')_ 我们可以看到测试使用了 _contains_ 方法
<!-- the 'make important' button corresponding to the <i>second note</i>:-->
'重要'按钮对应于<i>第二条笔记</i>：

![cypress test runner clicking make important](../../images/5/35new.png)

<!-- When chained, the second <i>contains</i> command <i>continues</i> the search from within the component found by the first command.-->
当链接时，第二个<i>contains</i>命令<i>continues</i>从第一个命令找到的组件内部继续搜索。

<!-- If we had not chained the commands, and instead write:-->
如果我们没有把命令链接起来，而是写：

```js
cy.contains('second note')
cy.contains('make important').click()
```

<!-- the result would have been entirely different. The second line of the test would click the button of a wrong note:-->
如果结果完全不同的话，测试的第二行会点击一个错误的按钮。

![cypress showing error and incorrectly trying to click first button](../../images/5/36new.png)

<!-- When coding tests, you should check in the test runner that the tests use the right components!-->
当编码测试时，你应该检查测试运行器，确保测试使用正确的组件！

<!-- Let''s change the _Note_ component so that the text of the note is rendered to a <i>span</i>.-->
让我们改变 _Note_ 组件，以便将笔记的文本呈现为 <i>span</i> 。

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

<!-- Our tests break! As the test runner reveals,  _cy.contains('second note')_ now returns the component containing the text, and the button is not in it.-->
我们的测试出现了断裂！正如测试运行器所揭示的， _cy.contains('second note')_ 现在返回包含文本的组件，而按钮不在其中。

![cypress showing test is broken trying to click make important](../../images/5/37new.png)

<!-- One way to fix this is the following:-->
一个解决方案是：

```js
it('one of those can be made important', function () {
  cy.contains('second note').parent().find('button').click()
  cy.contains('second note').parent().find('button')
    .should('contain', 'make not important')
})
```

<!-- In the first line, we use the [parent](https://docs.cypress.io/api/commands/parent.html) command to access the parent element of the element containing <i>second note</i> and find the button from within it.-->
在第一行，我們使用[parent](https://docs.cypress.io/api/commands/parent.html)命令來存取元素，該元素包含<i>second note</i>，並從中找到按鈕。
<!-- Then we click the button and check that the text on it changes.-->
然后我们点击按钮，检查它上面的文字是否发生了变化。

<!-- Note that we use the command [find](https://docs.cypress.io/api/commands/find.html#Syntax) to search for the button. We cannot use [cy.get](https://docs.cypress.io/api/commands/get.html) here, because it always searches from the <i>whole</i> page and would return all 5 buttons on the page.-->
注意，我们使用[find](https://docs.cypress.io/api/commands/find.html#Syntax)命令搜索按钮。 我们不能在这里使用[cy.get](https://docs.cypress.io/api/commands/get.html)，因为它总是从<i>整个</i>页面搜索，并返回页面上的5个按钮。

<!-- Unfortunately, we have some copy-paste in the tests now, because the code for searching for the right button is always the same.-->
不幸的是，我们现在有一些复制粘贴在测试中，因为搜索正确按钮的代码总是一样的。

<!-- In these kinds of situations, it is possible to use the [as](https://docs.cypress.io/api/commands/as.html) command:-->
在這種情況下，可以使用[as](https://docs.cypress.io/api/commands/as.html)命令：

```js
it('one of those can be made important', function () {
  cy.contains('second note').parent().find('button').as('theButton')
  cy.get('@theButton').click()
  cy.get('@theButton').should('contain', 'make not important')
})
```

<!-- Now the first line finds the right button and uses <i>as</i> to save it as <i>theButton</i>. The following lines can use the named element with <i>cy.get('@theButton')</i>.-->
现在第一行找到正确的按钮，并使用<i>as</i>将其保存为<i>theButton</i>。接下来的行可以使用命名元素<i>cy.get('@theButton')</i>。

### Running and debugging the tests

<!-- Finally, some notes on how Cypress works and debugging your tests.-->
最后，关于Cypress的工作原理和调试测试的一些注意事项。

<!-- The form of the Cypress tests gives the impression that the tests are normal JavaScript code, and we could for example try this:-->
形式上，Cypress 测试给人的印象就是它们是正常的 JavaScript 代码，比如我们可以尝试：

```js
const button = cy.contains('log in')
button.click()
debugger
cy.contains('logout').click()
```

<!-- This won''t work, however. When Cypress runs a test, it adds each _cy_ command to an execution queue.-->
这是行不通的，然而。 当Cypress运行测试时，它会将每个_cy_ 命令添加到执行队列中。
<!-- When the code of the test method has been executed, Cypress will execute each command in the queue one by one.-->
当测试方法的代码执行完毕后，Cypress 将按队列中的顺序一个接一个地执行每个命令。

<!-- Cypress commands always return _undefined_, so _button.click()_ in the above code would cause an error. An attempt to start the debugger would not stop the code between executing the commands, but before any commands have been executed.-->
Cypress 命令总是返回 _undefined_，因此上面代码中的 _button.click()_ 将会引发一个错误。尝试启动调试器不会阻止代码在执行命令之间的运行，而是在执行任何命令之前。

<!-- Cypress commands are <i>like promises</i>, so if we want to access their return values, we have to do it using the [then](https://docs.cypress.io/api/commands/then.html) command.-->
Cypress 命令就<i>像承诺</i>一样，所以如果我们想要访问它们的返回值，我们必须使用 [then](https://docs.cypress.io/api/commands/then.html) 命令来实现。
<!-- For example, the following test would print the number of buttons in the application, and click the first button:-->
例如，以下测试将打印应用程序中的按钮数量，并点击第一个按钮：

```js
it('then example', function() {
  cy.get('button').then( buttons => {
    console.log('number of buttons', buttons.length)
    cy.wrap(buttons[0]).click()
  })
})
```

<!-- Stopping the test execution with the debugger is [possible](https://docs.cypress.io/api/commands/debug.html). The debugger starts only if Cypress test runner''s developer console is open.-->
停止调试器执行测试是[可能的](https://docs.cypress.io/api/commands/debug.html)。调试器只有在Cypress测试运行器的开发者控制台打开的情况下才会启动。

<!-- The developer console is all sorts of useful when debugging your tests.-->
开发者控制台在调试测试时非常有用。
<!-- You can see the HTTP requests done by the tests on the Network tab, and the console tab will show you information about your tests:-->
你可以在网络标签中看到测试所做的HTTP请求，控制台标签将向您展示有关您测试的信息：

![developer console while running cypress](../../images/5/38new.png)

<!-- So far we have run our Cypress tests using the graphical test runner.-->
到目前为止，我们已经使用图形测试运行器运行了我们的Cypress测试。
<!-- It is also possible to run them [from the command line](https://docs.cypress.io/guides/guides/command-line.html). We just have to add an npm script for it:-->
也可以从[命令行](https://docs.cypress.io/guides/guides/command-line.html)运行它们。我们只需要为它添加一个npm脚本：

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

<!-- Now we can run our tests from the command line with the command <i>npm run test:e2e</i>-->
现在我们可以用命令<i>npm run test:e2e</i>从命令行运行我们的测试。

![terminal output of running npm e2e tests showing passed](../../images/5/39new.png)

<!-- Note that videos of the test execution will be saved to <i>cypress/videos/</i>, so you should probably git ignore this directory. It is also possible to [turn off](https://docs.cypress.io/guides/guides/screenshots-and-videos#Videos) the making of videos.-->
注意，测试执行的视频将被保存到<i>cypress/videos/</i>中，因此您可能应该将其忽略掉。也可以[关闭](https://docs.cypress.io/guides/guides/screenshots-and-videos#Videos)制作视频的功能。

<!-- The frontend and the test code can be found on the [GitHub](https://github.com/fullstack-hy2020/part2-notes/tree/part5-11) branch <i>part5-11</i>.-->
前端和测试代码可以在[GitHub](https://github.com/fullstack-hy2020/part2-notes/tree/part5-11) 分支<i>part5-11</i>中找到。

</div>

<div class="tasks">

### Exercises 5.17.-5.23.

<!-- In the last exercises of this part, we will do some E2E tests for our blog application.-->
在本部分的最后一个练习中，我们将为我们的博客应用程序进行一些端到端测试。
<!-- The material of this part should be enough to complete the exercises.-->
这部分的材料应该足够完成练习了。
<!-- You **must check out the Cypress [documentation](https://docs.cypress.io/guides/overview/why-cypress.html#In-a-nutshell)**. It is probably the best documentation I have ever seen for an open-source project.-->
你**必须查看Cypress的[文档](https://docs.cypress.io/guides/overview/why-cypress.html#In-a-nutshell)**。它可能是我见过的最好的开源项目文档。

<!-- I especially recommend reading [Introduction to Cypress](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#Cypress-Can-Be-Simple-Sometimes), which states-->
that "Cypress can be simple sometimes".

我特别推荐阅读[Cypress介绍](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#Cypress-Can-Be-Simple-Sometimes)，其中提到“Cypress有时可以很简单”。

<!-- > <i>This is the single most important guide for understanding how to test with Cypress. Read it. Understand it.</i>-->
> <i>这是理解如何使用Cypress进行测试的最重要指南。读一读，搞懂它。</i>

#### 5.17: bloglist end to end testing, step1

<!-- Configure Cypress for your project. Make a test for checking that the application displays the login form by default.-->
配置Cypress为您的项目。制作一个测试来检查应用程序默认显示登录表单。

<!-- The structure of the test must be as follows:-->
**结构必须如下：**

```js
describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    // ...
  })
})
```

<!-- The <i>beforeEach</i> formatting blog must empty the database using for example the method we used in the [material](/en/part5/end_to_end_testing#controlling-the-state-of-the-database).-->
<i>每次格式化博客之前，必须使用我们在[材料](/en/part5/end_to_end_testing#controlling-the-state-of-the-database)中使用的方法清空数据库。</i>

#### 5.18: bloglist end to end testing, step2

<!-- Make tests for logging in. Test both successful and unsuccessful login attempts.-->
测试登录。测试成功和不成功的登录尝试。
<!-- Make a new user in the <i>beforeEach</i> block for the tests.-->
在`beforeEach`块中为测试创建一个新用户。

<!-- The test structure extends like so:-->
测试结构如下扩展：

```js
describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
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

<i>Optional bonus exercise</i>: Check that the notification shown with unsuccessful login is displayed red.

#### 5.19: bloglist end to end testing, step3

<!-- Make a test that verifies a logged-in user can create a new blog.-->
测试确认已登录用户可以创建新博客。
<!-- The structure of the test could be as follows:-->
# 结构如下：

```js
describe('Blog app', function() {
  // ...

  describe('When logged in', function() {
    beforeEach(function() {
      // log in user here
    })

    it('A blog can be created', function() {
      // ...
    })
  })

})
```

<!-- The test has to ensure that a new blog is added to the list of all blogs.-->
测试必须确保新博客被添加到所有博客的列表中。

#### 5.20: bloglist end to end testing, step4

<!-- Make a test that confirms users can like a blog.-->
制作一个测试来确认用户可以点赞博客。

#### 5.21: bloglist end to end testing, step5

<!-- Make a test for ensuring that the user who created a blog can delete it.-->
测试确保创建博客的用户可以删除它。

#### 5.22: bloglist end to end testing, step6

<!-- Make a test for ensuring that only the creator can see the delete button of a blog, not anyone else.-->
测试以确保只有创建者可以看到博客的删除按钮，而不是其他人。

#### 5.23: bloglist end to end testing, step7

<!-- Make a test that checks that the blogs are ordered according to likes with the blog with the most likes being first.-->
制定一个测试，检查博客是否按照喜欢的数量排序，其中最受欢迎的博客排在第一位。

<i>This exercise is quite a bit trickier than the previous ones.</i> One solution is to add a certain class for the element which wraps the blog''s content and use the [eq](https://docs.cypress.io/api/commands/eq#Syntax) method to get the blog element in a specific index:

```js
cy.get('.blog').eq(0).should('contain', 'The title with the most likes')
cy.get('.blog').eq(1).should('contain', 'The title with the second most likes')
```

<!-- Note that you might end up having problems if you click a like button many times in a row. It might be that cypress does the clicking so fast that it does not have time to update the app state in between the clicks. One remedy for this is to wait for the number of likes to update in between all clicks.-->
**注意，如果你连续多次点击喜欢按钮可能会遇到问题。可能是因为Cypress点击得太快，没有时间更新应用程序状态。解决这个问题的一个办法是在所有点击之间等待喜欢的数量更新。**

<!-- This was the last exercise of this part, and it''s time to push your code to GitHub and mark the exercises you completed in the [exercise submission system](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).-->
这是本部分的最后一个练习，是时候把你的代码推送到GitHub，并在[练习提交系统](https://studies.cs.helsinki.fi/stats/courses/fullstackopen)中标记你完成的练习了。

</div>
