---
mainImage: ../../../images/part-5.svg
part: 5
letter: d
lang: zh
---

<div class="content">

<!-- So far we have tested the backend as a whole on an API level using integration tests and tested some frontend components using unit tests. -->
到目前为止，我们已经使用集成测试在 API 层面上测试了整个后端，并使用单元测试测试了一些前端组件。

<!-- Next, we will look into one way to test the [system as a whole](https://en.wikipedia.org/wiki/System_testing) using <i>End to End</i> (E2E) tests. -->
接下来我们将探讨一种使用<i>端到端</i>（E2E）测试来测试[系统整体](https://en.wikipedia.org/wiki/System_testing)的方法。

<!-- We can do E2E testing of a web application using a browser and a testing library. There are multiple libraries available. One example is [Selenium](http://www.seleniumhq.org/), which can be used with almost any browser.Another browser option is so-called [headless browsers](https://en.wikipedia.org/wiki/Headless_browser), which are browsers with no graphical user interface.For example, Chrome can be used in headless mode. -->
我们可以使用浏览器和测试库对 Web 应用进行 E2E 测试。有多种测试库可用，一个例子是 [Selenium](http://www.seleniumhq.org/)，它几乎可以与任何浏览器一起使用。另一个浏览器选项是所谓的[无头浏览器](https://en.wikipedia.org/wiki/Headless_browser)，这是一种没有图形用户界面的浏览器。例如，Chrome 可以在无头模式下使用。

<!-- E2E tests are potentially the most useful category of tests because they test the system through the same interface as real users use. -->
E2E 测试可能是最有用的测试类别，因为它们通过与真实用户使用相同的界面来测试系统。

<!-- They do have some drawbacks too. Configuring E2E tests is more challenging than unit or integration tests. They also tend to be quite slow, and with a large system, their execution time can be minutes or even hours. This is bad for development because during coding it is beneficial to be able to run tests as often as possible in case of code [regressions](https://en.wikipedia.org/wiki/Regression_testing). -->
它们也有一些缺点。配置 E2E 测试比单元或集成测试更具挑战性。并且它们往往较慢，对于大型系统，执行时间可能是几分钟甚至几小时。这对开发是不利的，因为在编码的过程中，能够尽可能频繁地运行测试是有益的，这可以防范代码[回归](https://en.wikipedia.org/wiki/Regression_testing)。

<!-- E2E tests can also be [flaky](https://hackernoon.com/flaky-tests-a-war-that-never-ends-9aa32fdef359).Some tests might pass one time and fail another, even if the code does not change at all. -->
E2E 测试还可能[不稳定](https://hackernoon.com/flaky-tests-a-war-that-never-ends-9aa32fdef359)。有些测试可能前一次通过了，但后一次失败了，即使代码根本没有改变。

<!-- Perhaps the two easiest libraries for End to End testing at the moment are [Cypress](https://www.cypress.io/) and [Playwright](https://playwright.dev/). -->
目前，最容易用于 E2E 测试的两个库或许就是 [Cypress](https://www.cypress.io/) 和 [Playwright](https://playwright.dev/)。

<!-- From the statistics on [npmtrends.com](https://npmtrends.com/cypress-vs-playwright) we can see that Playwright surpassed Cypress in download numbers during 2024, and its popularity continues to grow: -->
从 [npmtrends.com](https://npmtrends.com/cypress-vs-playwright) 的统计数据来看，Playwright 在 2024 年的下载量已经超过了 Cypress，并且其受欢迎的程度仍在持续增长：

![cypress vs playwright in npm trends](../../images/5/cvsp.png)

<!-- This course has been using Cypress for years. Now Playwright is a new addition. You can choose whether to complete the E2E testing part of the course with Cypress or Playwright. The operating principles of both libraries are very similar, so your choice is not very important. However, Playwright is now the preferred E2E library for the course. -->
这门课程多年来一直使用 Cypress。现在 Playwright 成为了一个新的选项。你可以选择用 Cypress 或 Playwright 完成 E2E 测试部分。这两个库的运行原理非常相似，所以你的选择并不重要。然而，Playwright 目前是课程首选的 E2E 测试库。

<!-- If your choice is Playwright, please proceed. If you end up using Cypress, go [here](/en/part5/end_to_end_testing_cypress). -->
如果你的选择是 Playwright，请继续。如果你最终使用 Cypress，请点[这里](/en/part5/end_to_end_testing_cypress)。

### Playwright

<!-- So [Playwright](https://playwright.dev/) is a newcomer to the End to End tests, which started to explode in popularity towards the end of 2023. Playwright is roughly on a par with Cypress in terms of ease of use. The libraries are slightly different in terms of how they work.  Cypress is radically different from most libraries suitable for E2E testing, as Cypress tests are run entirely within the browser. Playwright's tests, on the other hand, are executed in the Node process, which is connected to the browser via programming interfaces. -->
[Playwright](https://playwright.dev/) 是 E2E 测试领域的新来者，它在 2023 年底开始迅速流行起来。Playwright 在易用性方面与 Cypress 大致相当。这两个库在工作方式上略有不同。Cypress 与大多数适合 E2E 测试的库相比，有着根本性的不同，因为 Cypress 测试完全在浏览器中运行。而 Playwright 的测试则是在 Node 进程中执行，该进程通过编程接口与浏览器连接。

<!-- Many blogs have been written about library comparisons, e.g. [this](https://www.lambdatest.com/blog/cypress-vs-playwright/) and [this](https://www.browserstack.com/guide/playwright-vs-cypress). -->
许多博客都写过关于库的比较，比如[这篇](https://www.lambdatest.com/blog/cypress-vs-playwright/)和[这篇](https://www.browserstack.com/guide/playwright-vs-cypress)。

<!-- It is difficult to say which library is better. One advantage of Playwright is its browser support; Playwright supports Chrome, Firefox and Webkit-based browsers like Safari. Currently, Cypress includes support for all these browsers, although Webkit support is experimental and does not support all of Cypress features. At the time of writing (1.3.2024), my personal preference leans slightly towards Playwright. -->
很难说哪个库更好。Playwright 的一个优势是它的浏览器支持；Playwright 支持 Chrome、Firefox 以及基于 Webkit 的浏览器如 Safari。目前，Cypress 也支持所有这些浏览器，尽管 Webkit 的支持是实验性的，并且不支持 Cypress 的所有功能。在撰写本文时（2024年3月1日），我个人偏好稍微倾向于 Playwright。

<!-- Now let's explore Playwright. -->
现在让我们来探索 Playwright。

### Initializing tests

<!-- Unlike the backend tests or unit tests done on the React front-end, End to End tests do not need to be located in the same npm project where the code is. Let's make a completely separate project for the E2E tests with the _npm init_ command. Then install Playwright by running in the new project directory the command: -->
与后端测试和在 React 前端进行的单元测试不同，端到端测试不需要位于代码所在的同一 npm 项目中。让我们使用 _npm init_ 命令为端到端测试创建一个完全独立的项目。然后在新的项目目录中运行以下命令来安装 Playwright：

```js
npm init playwright@latest
```

<!-- The installation script will ask a few questions, answer them as follows: -->
安装脚本会询问几个问题，按如下方式回答：

![answer: javascript, tests, false, true](../../images/5/play0.png)

<!-- Note that when installing Playwright your operating system may not support all of the browsers Playwright offers and you may see an error message like below: -->
请注意，在安装 Playwright 时，您的操作系统可能不支持 Playwright 提供的所有浏览器，您可能会看到如下错误消息：
```
Webkit 18.0 (playwright build v2070) downloaded to /home/user/.cache/ms-playwright/webkit-2070
Playwright Host validation warning:
╔══════════════════════════════════════════════════════╗
║ Host system is missing dependencies to run browsers. ║
║ Missing libraries:                                   ║
║     libicudata.so.66                                 ║
║     libicui18n.so.66                                 ║
║     libicuuc.so.66                                   ║
║     libjpeg.so.8                                     ║
║     libwebp.so.6                                     ║
║     libpcre.so.3                                     ║
║     libffi.so.7                                      ║
╚══════════════════════════════════════════════════════╝
```
<!-- If this is the case you can either specify specific browsers to test with `--project=` in your _package.json_: -->
如果是这种情况，你可以在你的 _package.json_ 中使用 `--project=` 指定要测试的特定浏览器：

```js
    "test": "playwright test --project=chromium --project=firefox",
```

<!-- or remove the entry for any problematic browsers from your _playwright.config.js_ file: -->
或者从你的 _playwright.config.js_ 文件中删除任何有问题的浏览器的条目：

```js
  projects: [
    // ...
    //{
    //  name: 'webkit',
    //  use: { ...devices['Desktop Safari'] },
    //},
    // ...
  ]
```

<!-- Let's define an npm script for running tests and test reports in _package.json_: -->
让我们在 _package.json_ 中定义一个 npm 脚本用于运行测试和测试报告：

```js
{
  // ...
  "scripts": {
    "test": "playwright test",
    "test:report": "playwright show-report"
  },
  // ...
}
```

<!-- During installation, the following is printed to the console: -->
在安装过程中，以下内容将打印到控制台：

```
And check out the following files:
  - ./tests/example.spec.js - Example end-to-end test
  - ./tests-examples/demo-todo-app.spec.js - Demo Todo App end-to-end tests
  - ./playwright.config.js - Playwright Test configuration
```

<!-- that is, the location of a few example tests for the project that the installation has created. -->
也就是说，这是安装创建的项目中几个示例测试的位置。

<!-- Let's run the tests: -->
让我们运行测试：

```bash
$ npm test

> notes-e2e@1.0.0 test
> playwright test


Running 6 tests using 5 workers
  6 passed (3.9s)

To open last HTML report run:

  npx playwright show-report
```

<!-- The tests pass. A more detailed test report can be opened either with the command suggested by the output, or with the npm script we just defined: -->
测试通过。更详细的测试报告可以通过输出的建议命令或我们刚刚定义的 npm 脚本打开：

```
npm run test:report
```

<!-- Tests can also be run via the graphical UI with the command: -->
测试也可以使用以下命令通过图形界面运行：

```
npm run test -- --ui
```

<!-- Sample tests in the file tests/example.spec.js look like this: -->
tests/example.spec.js 中的示例测试看起来是这样的：

```js
// @ts-check
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/'); // highlight-line

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
```

<!-- The first line of the test functions says that the tests are testing the page at https://playwright.dev/. -->
测试函数的第一行说明这些测试正在测试 https://playwright.dev/ 页面。

### Testing our own code

<!-- Now let's remove the sample tests and start testing our own application. -->
现在让我们移除示例测试，开始测试我们自己的应用程序。

<!-- Playwright tests assume that the system under test is running when the tests are executed. Unlike, for example, backend integration tests, Playwright tests <i>do not start</i> the system under test during testing. -->
Playwright 测试假设在执行测试时系统正在运行。与后端集成测试等例子不同，Playwright 测试在测试过程中<i>不会启动</i>被测试的系统。

<!-- Let's make an npm script for the <i>backend</i>, which will enable it to be started in testing mode, i.e. so that <i>NODE\_ENV</i> gets the value <i>test</i>. -->
让我们为<i>后端</i>创建一个 npm 脚本，这将使其能够在测试模式下启动，即使 <i>NODE\_ENV</i> 的值为 <i>test</i>。

```js
{
  // ...
  "scripts": {
    "start": "cross-env NODE_ENV=production node index.js",
    "dev": "cross-env NODE_ENV=development node --watch index.js",
    "test": "cross-env NODE_ENV=test node --test",
    "lint": "eslint .",
    // ...
    "start:test": "cross-env NODE_ENV=test node --watch index.js" // highlight-line
  },
  // ...
}
```

<!-- Let's start the frontend and backend, and create the first test file for the application <code>tests/note\_app.spec.js</code>: -->
让我们启动前端和后端，并为应用程序创建第一个测试文件 <code>tests/note\_app.spec.js</code> ：

```js
const { test, expect } = require('@playwright/test')

test('front page can be opened', async ({ page }) => {
  await page.goto('http://localhost:5173')

  const locator = page.getByText('Notes')
  await expect(locator).toBeVisible()
  await expect(page.getByText('Note app, Department of Computer Science, University of Helsinki 2024')).toBeVisible()
})
```

<!-- First, the test opens the application with the method [page.goto](https://playwright.dev/docs/writing-tests#navigation). After this, it uses the [page.getByText](https://playwright.dev/docs/api/class-page#page-get-by-text) to get a [locator](https://playwright.dev/docs/locators) that corresponds to the element where the text <i>Notes</i> is found. -->
首先，测试使用 [page.goto](https://playwright.dev/docs/writing-tests#navigation) 方法打开应用程序。之后，它使用 [page.getByText](https://playwright.dev/docs/api/class-page#page-get-by-text) 方法获取与包含文本 <i>Notes</i> 的元素对应的[定位器](https://playwright.dev/docs/locators)。

<!-- The method [toBeVisible](https://playwright.dev/docs/api/class-locatorassertions#locator-assertions-to-be-visible) ensures that the element corresponding to the locator is visible at the page. -->
[toBeVisible](https://playwright.dev/docs/api/class-locatorassertions#locator-assertions-to-be-visible) 方法确保与定位器对应的元素在页面上可见。

<!-- The second check is done without using the auxiliary variable. -->
第二次检查没有使用辅助变量。

<!-- The test fails because an old year ended up in the test. Playwright opens the test report in the browser and it becomes clear that Playwright has actually performed the tests with three different browsers: Chrome, Firefox and Webkit, i.e. the browser engine used by Safari: -->
测试失败了，因为测试中混入了一个旧年份。Playwright 在浏览器中打开了测试报告，很明显 Playwright 实际上是用三种不同的浏览器进行了测试：Chrome、Firefox 和 Webkit，即 Safari 使用的浏览器引擎：

![test report showing the test failing in three different browsers](../../images/5/play2.png)

<!-- By clicking on the report of one of the browsers, we can see a more detailed error message: -->
通过点击其中一个浏览器的报告，我们可以看到一个更详细的错误信息：

![test error message](../../images/5/play3a.png)

<!-- In the big picture, it is of course a very good thing that the testing takes place with all three commonly used browser engines, but this is slow, and when developing the tests it is probably best to carry them out mainly with only one browser. You can define the browser engine to be used with the command line parameter: -->
从宏观角度来看，测试使用所有三种常用浏览器引擎当然是非常好的，但这会很慢，在开发测试时，最好主要只用一种浏览器进行。您可以通过命令行参数定义要使用的浏览器引擎：

```js
npm test -- --project chromium
```

<!-- Now let's fix the test with the correct year and let's add a _describe_ block to the tests: -->
现在让我们修正测试中的年份，并在测试中添加一个 _describe_ 块：

```js
const { test, describe, expect } = require('@playwright/test')

describe('Note app', () => {  // highlight-line
  test('front page can be opened', async ({ page }) => {
    await page.goto('http://localhost:5173')

    const locator = page.getByText('Notes')
    await expect(locator).toBeVisible()
    await expect(page.getByText('Note app, Department of Computer Science, University of Helsinki 2025')).toBeVisible()
  })
})
```

<!-- Before we move on, let's break the tests one more time. We notice that the execution of the tests is quite fast when they pass, but much slower if the they do not pass. The reason for this is that Playwright's policy is to wait for searched elements until [they are rendered and ready for action](https://playwright.dev/docs/actionability). If the element is not found, a _TimeoutError_ is raised and the test fails. Playwright waits for elements by default for 5 or 30 seconds [depending on the functions used in testing](https://playwright.dev/docs/test-timeouts#introduction). -->
在继续之前，让我们再分析一次测试。我们注意到，当测试通过时，执行速度相当快，但如果测试未通过，执行速度会慢很多。这是因为 Playwright 的策略是等待搜索的元素直到[它们渲染并准备好执行](https://playwright.dev/docs/actionability)。如果找不到元素，会抛出 _TimeoutError_ 并导致测试失败。Playwright 默认等待元素的时间[取决于测试中使用的函数](https://playwright.dev/docs/test-timeouts#introduction)，通常是 5 秒或 30 秒。

<!-- When developing tests, it may be wiser to reduce the waiting time to a few seconds. According to the [documentation](https://playwright.dev/docs/test-timeouts), this can be done by changing the file _playwright.config.js_ as follows: -->
在开发测试时，将等待时间减少到几秒钟可能更明智。根据[文档](https://playwright.dev/docs/test-timeouts)，这可以通过按以下方式修改 _playwright.config.js_ 文件来实现：

```js
export default defineConfig({
  // ...
  timeout: 3000, // highlight-line
  fullyParallel: false, // highlight-line
  workers: 1, // highlight-line
  // ...
})
```

<!-- We also made two other changes to the file, specifying that all tests [be executed one at a time](https://playwright.dev/docs/test-parallel). With the default configuration, the execution happens in parallel, and since our tests use a database, parallel execution causes problems. -->
我们还对文件进行了另外两项更改，并指定所有测试应[逐个执行](https://playwright.dev/docs/test-parallel)。在默认配置下，执行是并行进行的，而由于我们的测试使用数据库，并行执行会导致问题。

### Writing on the form

<!-- Let's write a new test that tries to log into the application. Let's assume that a user is stored in the database, with username <i>mluukkai</i> and password <i>salainen</i>. -->
让我们编写一个新的测试，尝试登录应用程序。假设数据库中存储了一个用户，用户名为 <i>mluukkai</i>，密码为 <i>salainen</i>。

<!-- Let's start by opening the login form. -->
让我们从打开登录表单开始。

```js
describe('Note app', () => {
  // ...

  test('user can log in', async ({ page }) => {
    await page.goto('http://localhost:5173')

    await page.getByRole('button', { name: 'login' }).click()
  })
})
```

<!-- The test first uses the method [page.getByRole](https://playwright.dev/docs/api/class-page#page-get-by-role) to retrieve the button based on its text. The method returns the [Locator](https://playwright.dev/docs/api/class-locator) corresponding to the Button element. Pressing the button is performed using the Locator method [click](https://playwright.dev/docs/api/class-locator#locator-click). -->
测试首先使用方法 [page.getByRole](https://playwright.dev/docs/api/class-page#page-get-by-role) 根据其文本获取按钮。该方法返回与 Button 元素对应的 [定位器](https://playwright.dev/docs/api/class-locator)。然后通过定位器的方法 [click](https://playwright.dev/docs/api/class-locator#locator-click) 进行按钮点击。

<!-- When developing tests, you could use Playwright's [UI mode](https://playwright.dev/docs/test-ui-mode), i.e. the user interface version. Let's start the tests in UI mode as follows: -->
在开发测试时，你可以使用 Playwright 的 [UI 模式](https://playwright.dev/docs/test-ui-mode)，即用户界面版本。让我们按照以下方式以 UI 模式开始测试：

```
npm test -- --ui
```

<!-- We now see that the test finds the button -->
我们现在看到测试找到了按钮

![playwright UI rendering the notes app while testing it](../../images/5/play4.png)

<!-- After clicking, the form will appear -->
点击后，表单将出现

![playwright UI rendering the login form of the notes app](../../images/5/play5.png)

<!-- When the form is opened, the test should look for the text fields and enter the username and password in them. Let's make the first attempt using the method [page.getByRole](https://playwright.dev/docs/api/class-page#page-get-by-role): -->
当表单打开时，测试应查找文本字段，并在其中输入用户名和密码。让我们首先尝试使用方法 [page.getByRole](https://playwright.dev/docs/api/class-page#page-get-by-role)。

```js
describe('Note app', () => {
  // ...

  test('user can log in', async ({ page }) => {
    await page.goto('http://localhost:5173')

    await page.getByRole('button', { name: 'login' }).click()
    await page.getByRole('textbox').fill('mluukkai')  // highlight-line
  })
})
```

<!-- This results to an error: -->
这导致了一个错误：

```bash
Error: locator.fill: Error: strict mode violation: getByRole('textbox') resolved to 2 elements:
  1) <input value=""/> aka locator('div').filter({ hasText: /^username$/ }).getByRole('textbox')
  2) <input value="" type="password"/> aka locator('input[type="password"]')
```

<!-- The problem now is that _getByRole_ finds two text fields, and calling the [fill](https://playwright.dev/docs/api/class-locator#locator-fill) method fails, because it assumes that there is only one text field found. One way around the problem is to use the methods [first](https://playwright.dev/docs/api/class-locator#locator-first) and [last](https://playwright.dev/docs/api/class-locator#locator-last): -->
现在的问题是，_getByRole_ 找到了两个文本字段，调用 [fill](https://playwright.dev/docs/api/class-locator#locator-fill) 方法会失败，因为它假设只找到了一个文本字段。解决这个问题的一种方案是用 [first](https://playwright.dev/docs/api/class-locator#locator-first) 和 [last](https://playwright.dev/docs/api/class-locator#locator-last) 这两个方法：

```js
describe('Note app', () => {
  // ...

  test('user can log in', async ({ page }) => {
    await page.goto('http://localhost:5173')

    await page.getByRole('button', { name: 'login' }).click()
    // highlight-start
    await page.getByRole('textbox').first().fill('mluukkai')
    await page.getByRole('textbox').last().fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()
  
    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    // highlight-end
  })
})
```

<!-- After writing in the text fields, the test presses the _login_ button and checks that the application renders the logged-in user's information on the screen. -->
在文本字段中输入后，测试会点击 _login_ 按钮，并检查应用程序是否在屏幕上渲染了已登录用户的信息。

<!-- If there were more than two text fields, using the methods _first_ and _last_ would not be enough. One possibility would be to use the [all](https://playwright.dev/docs/api/class-locator#locator-all) method, which turns the found locators into an array that can be indexed: -->
如果有超过两个文本字段，使用 _first_ 和 _last_ 方法就不够了。一种可能是使用 [all](https://playwright.dev/docs/api/class-locator#locator-all) 方法，它将找到的定位器转换成一个可以索引的数组：

```js
describe('Note app', () => {
  // ...
  test('user can log in', async ({ page }) => {
    await page.goto('http://localhost:5173')

    await page.getByRole('button', { name: 'login' }).click()
    // highlight-start
    const textboxes = await page.getByRole('textbox').all()

    await textboxes[0].fill('mluukkai')
    await textboxes[1].fill('salainen')
    // highlight-end

    await page.getByRole('button', { name: 'login' }).click()
  
    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
  })  
})
```

<!-- Both this and the previous version of the test work. However, both are problematic to the extent that if the registration form is changed, the tests may break, as they rely on the fields to be on the page in a certain order. -->
这个和上一个版本的测试工作都可以运行。然而，它们都存在问题，因为如果注册表单被更改，测试可能会失效，因为它们依赖于表单字段在页面上按特定顺序排列。

<!-- If an element is difficult to locate in tests, you can assign it a separate <i>test-id</i> attribute and find the element in tests using the [getByTestId](https://playwright.dev/docs/api/class-page#page-get-by-test-id) method. -->
如果元素在测试中难以定位，你可以为其分配一个单独的 <i>test-id</i> 属性，并使用 [getByTestId](https://playwright.dev/docs/api/class-page#page-get-by-test-id) 方法在测试中查找该元素。

<!-- Let's now take advantage of the existing elements of the login form. The input fields of the login form have been assigned unique <i>labels</i>: -->
现在让我们利用登录表单的现有元素。登录表单的输入字段已被分配了唯一的 <i>labels</i>：

```js
// ...
<form onSubmit={handleSubmit}>
  <div>
    <label> // highlight-line
      username // highlight-line
      <input
        type="text"
        value={username}
        onChange={handleUsernameChange}
      />
    </label> // highlight-line
  </div>
  <div>
    <label> // highlight-line
      password // highlight-line
      <input
        type="password"
        value={password}
        onChange={handlePasswordChange}
      />
    </label> // highlight-line
  </div>
  <button type="submit">login</button>
</form>
// ...
```

<!-- Input fields can and should be located in tests using <i>labels</i> with the [getByLabel](https://playwright.dev/docs/api/class-page#page-get-by-label) method: -->
输入字段可以并且应该使用 [getByLabel](https://playwright.dev/docs/api/class-page#page-get-by-label) 方法通过 <i>labels</i> 在测试中定位：

```js
describe('Note app', () => {
  // ...

  test('user can log in', async ({ page }) => {
    await page.goto('http://localhost:5173')

    await page.getByRole('button', { name: 'login' }).click()
    await page.getByLabel('username').fill('mluukkai') // highlight-line
    await page.getByLabel('password').fill('salainen')  // highlight-line
  
    await page.getByRole('button', { name: 'login' }).click() 
  
    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
  })
})
```

<!-- When locating elements, it makes sense to aim to utilize the content visible to the user in the interface, as this best simulates how a user would actually find the desired input field while navigating the application. -->
在定位元素时，最好利用界面中用户可见的内容，因为这样可以最好地模拟用户在导航应用时实际找到所需输入字段的方式。

<!-- Note that passing the test at this stage requires that there is a user in the <i>test</i> database of the backend with username <i>mluukkai</i> and password <i>salainen</i>. Create a user if needed! -->
请注意，在此阶段通过测试需要后端<i>测试</i>数据库中存在一个用户，用户名为 <i>mluukkai</i>，密码为 <i>salainen</i>。如有需要，请创建用户！

### Test Initialization

<!-- Since both tests start in the same way, i.e. by opening the page <i>http://localhost:5173</i>, it is recommended to isolate the common part in the <i>beforeEach</i> block that is executed before each test: -->
由于两个测试都从打开页面 <i>http://localhost:5173</i> 开始，建议在 beforeEach 块中隔离每个测试执行之前的公共部分：

```js
const { test, describe, expect, beforeEach } = require('@playwright/test')

describe('Note app', () => {
  // highlight-start
  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })
  // highlight-end

  test('front page can be opened', async ({ page }) => {
    const locator = page.getByText('Notes')
    await expect(locator).toBeVisible()
    await expect(page.getByText('Note app, Department of Computer Science, University of Helsinki 2025')).toBeVisible()
  })

  test('user can log in', async ({ page }) => {
    await page.getByRole('button', { name: 'login' }).click()
    await page.getByLabel('username').fill('mluukkai')
    await page.getByLabel('password').fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
  })
})
```

### Testing note creation

<!-- Next, let's create a test that adds a new note to the application: -->
接下来，让我们创建一个测试，该测试向应用程序添加一个新的笔记：

```js
const { test, describe, expect, beforeEach } = require('@playwright/test')

describe('Note app', () => {
  // ...

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new note can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new note' }).click()
      await page.getByRole('textbox').fill('a note created by playwright')
      await page.getByRole('button', { name: 'save' }).click()
      await expect(page.getByText('a note created by playwright')).toBeVisible()
    })
  })  
})
```

<!-- The test is defined in its own _describe_ block. Creating a note requires that the user is logged in, which is handled in the _beforeEach_ block. -->
测试定义在其自己的 _describe_ 块中。创建笔记需要用户登录，这由 _beforeEach_ 块处理。

<!-- The test trusts that when creating a new note, there is only one input field on the page, so it searches for it as follows: -->
该测试相信在创建新笔记时页面上只有一个输入字段，因此它按以下方式搜索：

```js
page.getByRole('textbox')
```

<!-- If there were more fields, the test would break. Because of this, it could be better to add a <i>test-id</i> to the form input and search for it in the test based on this id. -->
如果有更多字段，测试就会失败。由于这个原因，最好给表单输入添加一个 <i>test-id</i>，并基于这个 id 在测试中查找它。

<!-- **Note:** the test will only pass the first time. The reason for this is that its expectation -->
**注意：**测试只会在第一次通过。其原因是它的期望

```js
await expect(page.getByText('a note created by playwright')).toBeVisible()
```

<!-- causes problems when the same note is created in the application more than once. The problem will be solved in the next chapter. -->
当同一个笔记在应用程序中创建多次时会导致问题。这个问题将在下一章解决。

<!-- The structure of the tests looks like this: -->
测试的结构看起来是这样的：

```js
const { test, describe, expect, beforeEach } = require('@playwright/test')

describe('Note app', () => {
  // ....

  test('user can log in', async ({ page }) => {
    await page.getByRole('button', { name: 'login' }).click()
    await page.getByLabel('username').fill('mluukkai')
    await page.getByLabel('password').fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new note can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new note' }).click()
      await page.getByRole('textbox').fill('a note created by playwright')
      await page.getByRole('button', { name: 'save' }).click()
      await expect(page.getByText('a note created by playwright')).toBeVisible()
    })
  })
})
```

<!-- Since we have prevented the tests from running in parallel, Playwright runs the tests in the order they appear in the test code. That is, first the test <i>user can log in</i>, where the user logs into the application, is performed. After this the test <i>a new note can be created</i> gets executed, which also does a log in, in the <i>beforeEach</i> block. Why is this done, isn't the user already logged in thanks to the previous test? No, because the execution of <i>each</i> test starts from the browser's "zero state", all changes made to the browser's state by the previous tests are reset. -->
由于我们已禁止测试并行运行，Playwright 会按照测试代码中出现的顺序执行测试。也就是说，首先执行<i>用户登录</i>的测试，用户登录应用程序的操作会先完成。接着执行<i>创建新笔记</i>的测试，该测试也会在 <i>beforeEach</i> 块中执行登录操作。为什么还要这么做呢？用户不是已经在之前的测试中登录了吗？不，因为<i>每个</i>测试的执行都是从浏览器的“零状态”开始的，之前测试对浏览器状态所做的所有更改都会被重置。

### Controlling the state of the database

<!-- If the tests need to be able to modify the server's database, the situation immediately becomes more complicated. Ideally, the server's database should be the same each time we run the tests, so our tests can be reliably and easily repeatable. -->
如果测试需要能够修改服务器的数据库，情况将立即变得复杂起来。理想情况下，服务器的数据库在每次运行测试时都应该是相同的，这样我们的测试才能可靠且容易地重复。

<!-- As with unit and integration tests, with E2E tests it is best to empty the database and possibly format it before the tests are run. The challenge with E2E tests is that they do not have access to the database. -->
与单元测试和集成测试一样，对于 E2E 测试，在运行测试之前最好清空数据库，并可能要对其进行格式化。E2E 测试的挑战在于它们无法访问数据库。

<!-- The solution is to create API endpoints for the backend tests.We can empty the database using these endpoints.Let's create a new router for the tests inside the <i>controllers</i> folder, in the <i>testing.js</i> file -->
解决方案是为后端测试创建 API 端点。我们可以使用这些端点来清空数据库。让我们在 <i>controllers</i> 文件夹中的 <i>testing.js</i> 文件里创建一个新的路由用于测试

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

<!-- and add it to the backend only <i>if the application is run in test-mode</i>: -->
并且仅在<i>应用程序以测试模式运行</i>时才将其添加到后端：

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

<!-- After the changes, an HTTP POST request to the <i>/api/testing/reset</i> endpoint empties the database. Make sure your backend is running in test mode by starting it with this command (previously configured in the package.json file): -->
修改后，对 <i>/api/testing/reset</i> 端点的 HTTP POST 请求会清空数据库。通过使用此命令启动后端以确保其在测试模式下运行（该命令之前已在 package.json 文件中配置）：

```js
  npm run start:test
```

<!-- The modified backend code can be found on the [GitHub](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part5-1) branch <i>part5-1</i>. -->
修改后的后端代码可以在 [GitHub](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part5-1) 的 <i>part5-1</i> 分支上找到。

<!-- Next, we will change the _beforeEach_ block so that it empties the server's database before tests are run. -->
接下来，我们将修改 _beforeEach_ 块，使其在运行测试前清空服务器的数据库。

<!-- Currently, it is not possible to add new users through the frontend's UI, so we add a new user to the backend from the beforeEach block. -->
目前无法通过前端 UI 添加新用户，因此我们用 beforeEach 块从后端添加一个新用户。

```js
describe('Note app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('front page can be opened',  () => {
    // ...
  })

  test('user can login', () => {
    // ...
  })

  describe('when logged in', () => {
    // ...
  })
})
```

<!-- During initialization, the test makes HTTP requests to the backend with the method [post](https://playwright.dev/docs/api/class-apirequestcontext#api-request-context-post) of the parameter _request_. -->
在初始化的过程中，测试使用参数 _request_ 的方法 [post](https://playwright.dev/docs/api/class-apirequestcontext#api-request-context-post) 向后端发送 HTTP 请求。

<!-- Unlike before, now the testing of the backend always starts from the same state, i.e. there is one user and no notes in the database. -->
与之前不同，现在后端测试总是从相同的状态开始，即数据库中有一个用户且没有笔记。

<!-- Let's make a test that checks that the importance of the notes can be changed. -->
让我们做一个测试，检查笔记的重要性是否可以更改。

<!-- There are a few different approaches to taking the test. -->
进行这个测试有几种不同的方法。

<!-- In the following, we first look for a note and click on its button that has text <i>make not important</i>. After this, we check that the note contains the button with <i>make important</i>. -->
在下文中，我们首先查找一个笔记并点击其带有文本 <i>make not important</i> 的按钮。之后，我们检查该笔记是否包含带有 <i>make important</i> 的按钮。

```js
describe('Note app', () => {
  // ...

  describe('when logged in', () => {
    // ...

    // highlight-start
    describe('and a note exists', () => {
      beforeEach(async ({ page }) => {
        await page.getByRole('button', { name: 'new note' }).click()
        await page.getByRole('textbox').fill('another note by playwright')
        await page.getByRole('button', { name: 'save' }).click()
      })

      test('importance can be changed', async ({ page }) => {
        await page.getByRole('button', { name: 'make not important' }).click()
        await expect(page.getByText('make important')).toBeVisible()
      })
    // highlight-end
    })
  })
})
```

<!-- The first command first searches for the component where there is the text <i>another note by playwright</i> and inside it the button <i>make not important</i> and clicks on it. -->
第一个命令首先搜索包含文本 <i>another note by playwright</i> 的组件，并在其中找到按钮 <i>make not important</i> 并点击它。

<!-- The second command ensures that the text of the same button has changed to <i>make important</i>. -->
第二个命令确保该按钮的文本已更改为 <i>make important</i>。

<!-- The current code for the tests is on [GitHub](https://github.com/fullstack-hy2020/notes-e2e/tree/part5-1), in branch <i>part5-1</i>. -->
测试代码当前位于 [GitHub](https://github.com/fullstack-hy2020/notes-e2e/tree/part5-1) 的分支 <i>part5-1</i> 上。

### Test for failed login

<!-- Now let's do a test that ensures that the login attempt fails if the password is wrong. -->
现在我们来做一个测试，确保如果密码错误，登录尝试会失败。

<!-- The first version of the test looks like this: -->
测试的第一个版本看起来是这样的：

```js
describe('Note app', () => {
  // ...

  test('login fails with wrong password', async ({ page }) => {
    await page.getByRole('button', { name: 'login' }).click()
    await page.getByLabel('username').fill('mluukkai')
    await page.getByLabel('password').fill('wrong')
    await page.getByRole('button', { name: 'login' }).click()

    await expect(page.getByText('wrong credentials')).toBeVisible()
  })

  // ...
})
```

<!-- The test verifies with the method [page.getByText](https://playwright.dev/docs/api/class-page#page-get-by-text) that the application prints an error message. -->
该测试通过方法 [page.getByText](https://playwright.dev/docs/api/class-page#page-get-by-text) 验证应用程序是否打印错误消息。

<!-- The application renders the error message to an element containing the CSS class <i>error</i>: -->
应用程序将错误消息渲染到 CSS 类为 <i>error</i> 的元素中：

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

<!-- We could refine the test to ensure that the error message is printed exactly in the right place, i.e. in the element containing the CSS class <i>error</i>: -->
我们可以优化测试，以确保错误消息正好打印在正确位置，即 CSS 类为 <i>error</i> 的元素中：

```js
test('login fails with wrong password', async ({ page }) => {
  // ...

  const errorDiv = page.locator('.error') // highlight-line
  await expect(errorDiv).toContainText('wrong credentials')
})
```

<!-- So the test uses the [page.locator](https://playwright.dev/docs/api/class-page#page-locator) method to find the component containing the CSS class <i>error</i> and stores it in a variable. The correctness of the text associated with the component can be verified with the expectation [toContainText](https://playwright.dev/docs/api/class-locatorassertions#locator-assertions-to-contain-text). Note that the [CSS class selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors) starts with a dot, so the <i>error</i> class selector is <i>.error</i>. -->
因此，测试使用 [page.locator](https://playwright.dev/docs/api/class-page#page-locator) 方法查找 CSS 类为 <i>error</i> 的组件，并将其存储在变量中。可以通过期望 [toContainText](https://playwright.dev/docs/api/class-locatorassertions#locator-assertions-to-contain-text) 来验证与组件关联的文本的正确性。请注意，[CSS 类选择器](https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors)以点开头，因此 <i>error</i> 的类选择器是 <i>.error</i>。

<!-- It is possible to test the application's CSS styles with matcher [toHaveCSS](https://playwright.dev/docs/api/class-locatorassertions#locator-assertions-to-have-css). We can, for example, make sure that the color of the error message is red, and that there is a border around it: -->
可以使用 [toHaveCSS](https://playwright.dev/docs/api/class-locatorassertions#locator-assertions-to-have-css) 匹配器来测试应用程序的 CSS 样式。例如，我们可以确保错误消息的颜色是红色，并且它周围有边框：

```js
test('login fails with wrong password', async ({ page }) => {
  // ...

  const errorDiv = page.locator('.error')
  await expect(errorDiv).toContainText('wrong credentials')
  await expect(errorDiv).toHaveCSS('border-style', 'solid') // highlight-line
  await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)') // highlight-line
})
```

<!-- Colors must be defined to Playwright as [rgb](https://rgbcolorcode.com/color/red) codes. -->
给 Playwright 的颜色必须定义为 [rgb](https://rgbcolorcode.com/color/red) 代码。

<!-- Let's finalize the test so that it also ensures that the application **does not render** the text describing a successful login <i>'Matti Luukkainen logged in'</i>: -->
让我们完成测试，以便它也能确保应用程序**不会渲染**描述成功登录的文本 <i>Matti Luukkainen logged in</i>：

```js
test('login fails with wrong password', async ({ page }) =>{
  await page.getByRole('button', { name: 'login' }).click()
  await page.getByLabel('username').fill('mluukkai')
  await page.getByLabel('password').fill('wrong')
  await page.getByRole('button', { name: 'login' }).click()

  const errorDiv = page.locator('.error')
  await expect(errorDiv).toContainText('wrong credentials')
  await expect(errorDiv).toHaveCSS('border-style', 'solid')
  await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

  await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible() // highlight-line
})
```

### Running tests one by one

<!-- By default, Playwright always runs all tests, and as the number of tests increases, it becomes time-consuming. When developing a new test or debugging a broken one, the test can be defined instead than with the command <i>test</i>, with the command <i>test.only</i>, in which case Playwright will run only that test: -->
默认情况下，Playwright 总是运行所有测试，并且随着测试数量的增加，运行时间会变得很长。在开发新测试或调试有问题的测试时，可以用 <i>test.only</i> 而不是 <i>test</i> 来定义测试，这样 Playwright 将只运行该测试：

```js
describe(() => {
  // this is the only test executed!
  test.only('login fails with wrong password', async ({ page }) => {  // highlight-line
    // ...
  })

  // this test is skipped...
  test('user can login with correct credentials', async ({ page }) => {
    // ...
  })

  // ...
})
```

<!-- When the test is ready, <i>only</i> can and **should** be deleted. -->
当该测试一切妥当后，<i>only</i> 可以并且**应该**被删除。

<!-- Another option to run a single test is to use a command line parameter: -->
运行单个测试的另一个选项是使用命令行参数：

```
npm test -- -g "login fails with wrong password"
```

### Helper functions for tests

<!-- Our application tests currently look like this: -->
我们的应用测试现在看起来是这样的：

```js
const { test, describe, expect, beforeEach } = require('@playwright/test')

describe('Note app', () => {
  // ...

  test('user can login with correct credentials', async ({ page }) => {
    await page.getByRole('button', { name: 'login' }).click()
    await page.getByLabel('username').fill('mluukkai')
    await page.getByLabel('password').fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
  })

  test('login fails with wrong password', async ({ page }) =>{
    // ...
  })

  describe('when logged in', () => {
    beforeEach(async ({ page, request }) => {
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new note can be created', async ({ page }) => {
      // ...
    })

    // ...
  })
})
```

<!-- First, the login function is tested. After this, another _describe_ block contains a set of tests that assume that the user is logged in, the login is handled inside the initializing _beforeEach_ block. -->
首先测试登录功能。之后，另一个 _describe_ 块包含一组假设用户已登录的测试，登录在用于初始化的 _beforeEach_ 块中完成。

<!-- As already stated earlier, each test is executed starting from the initial state (where the database is cleared and one user is created there), so even though the test is defined after another test in the code, it does not start from the same state where the tests in the code executed earlier have left! -->
如前所述，每个测试都从初始状态开始执行（此时数据库被清空并创建一个用户），因此即使代码中定义的测试出现在另一个测试之后，它也不会从之前测试留下的状态开始！

<!-- It is also worth striving for having non-repetitive code in tests. Let's isolate the code that handles the login as a helper function, which is placed e.g. in the file _tests/helper.js_: -->
测试中还应尽量避免重复代码。让我们将处理登录的代码作为辅助函数隔离出来，例如放到文件 _tests/helper.js_ 中：

```js
const loginWith = async (page, username, password)  => {
  await page.getByRole('button', { name: 'login' }).click()
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

export { loginWith }
```

<!-- The tests becomes simpler and clearer: -->
测试将变得更简单和清晰：

```js
const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith } = require('./helper') // highlight-line

describe('Note app', () => {
  // ...

  test('user can log in', async ({ page }) => {
    await loginWith(page, 'mluukkai', 'salainen') // highlight-line
    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
  })

  test('login fails with wrong password', async ({ page }) => {
    await loginWith(page, 'mluukkai', 'wrong') // highlight-line

    const errorDiv = page.locator('.error')
    // ...
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen') // highlight-line
    })

    // ...
  })
})
```

<!-- Playwright also offers a [solution](https://playwright.dev/docs/auth) where the login is performed once before the tests, and each test starts from a state where the application is already logged in. In order for us to take advantage of this method, the initialization of the application's test data should be done a bit differently than now. In the current solution, the database is reset before each test, and because of this, logging in just once before the tests is impossible. In order for us to use the pre-test login provided by Playwright, the user should be initialized only once before the tests. We stick to our current solution for the sake of simplicity. -->
Playwright 还提供了一个[解决方案](https://playwright.dev/docs/auth)，即在测试前执行一次登录，然后每个测试都从应用程序已经登录的状态开始。为了让我们能够使用这种方法，应用程序的测试数据初始化应该与现在稍有不同。在当前的解决方案中，每次测试前都会重置数据库，因此测试前只登录一次的是不可能的。为了使用 Playwright 提供的测试前登录，用户应该在测试前只初始化一次。我们为了简化起见，坚持当前的解决方案。

<!-- The corresponding repeating code actually also applies to creating a new note. For that, there is a test that creates a note using a form. Also in the _beforeEach_ initialization block of the test that tests changing the importance of the note, a note is created using the form: -->
相应的重复代码实际上也适用于创建新笔记。为此，有一个测试使用表单创建笔记。而在更改笔记重要性的测试的 _beforeEach_ 初始化块中，也使用表单创建笔记：

```js
describe('Note app', function() {
  // ...

  describe('when logged in', () => {
    test('a new note can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new note' }).click()
      await page.getByRole('textbox').fill('a note created by playwright')
      await page.getByRole('button', { name: 'save' }).click()
      await expect(page.getByText('a note created by playwright')).toBeVisible()
    })

    describe('and a note exists', () => {
      beforeEach(async ({ page }) => {
        await page.getByRole('button', { name: 'new note' }).click()
        await page.getByRole('textbox').fill('another note by playwright')
        await page.getByRole('button', { name: 'save' }).click()
      })

      test('it can be made important', async ({ page }) => {
        // ...
      })
    })
  })
})
```

<!-- Creation of a note is also isolated as its helper function. The file _tests/helper.js_ expands as follows: -->
创建笔记的功能也被隔离到它的辅助函数中。文件 _tests/helper.js_ 扩展如下：

```js
const loginWith = async (page, username, password)  => {
  await page.getByRole('button', { name: 'login' }).click()
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

// highlight-start
const createNote = async (page, content) => {
  await page.getByRole('button', { name: 'new note' }).click()
  await page.getByRole('textbox').fill(content)
  await page.getByRole('button', { name: 'save' }).click()
}
// highlight-end

export { loginWith, createNote } // highlight-line
```

<!-- The tests are simplified as follows: -->
测试被简化如下：

```js
const { test, describe, expect, beforeEach } = require('@playwright/test')
const { createNote, loginWith } = require('./helper') // highlight-line

describe('Note app', () => {
  // ...

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new note can be created', async ({ page }) => {
      await createNote(page, 'a note created by playwright') // highlight-line
      await expect(page.getByText('a note created by playwright')).toBeVisible()
    })

    describe('and a note exists', () => {
      beforeEach(async ({ page }) => {
        await createNote(page, 'another note by playwright') // highlight-line
      })

      test('importance can be changed', async ({ page }) => {
        await page.getByRole('button', { name: 'make not important' }).click()
        await expect(page.getByText('make important')).toBeVisible()
      })
    })
  })
})
```

<!-- There is one more annoying feature in our tests. The frontend address <i>http:localhost:5173</i> and the backend address <i>http:localhost:3001</i> are hardcoded for tests. Of these, the address of the backend is actually useless, because a proxy has been defined in the Vite configuration of the frontend, which forwards all requests made by the frontend to the address <i>http:localhost:5173/api</i> to the backend: -->
我们的测试中还有一个烦人的特性。前端地址 <i>http://localhost:5173</i> 和后端地址 <i>http://localhost:3001</i> 都是硬编码在测试中的。其中，后端的地址实际上是无用的，因为在前端的 Vite 配置中定义了一个代理，该代理会将前端发送到地址 <i>http://localhost:5173/api</i> 的所有请求转发到后端地址：

```js
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    }
  },
  // ...
})
```

<!-- So we can replace all the addresses in the tests from _http://localhost:3001/api/..._ to _http://localhost:5173/api/..._ -->
因此，我们可以把测试中的所有 _http://localhost:3001/api/..._ 替换为 _http://localhost:5173/api/..._

We can now define the _baseUrl_ for the application in the tests configuration file <i>playwright.config.js</i>:
现在我们可以在测试配置文件 <i>playwright.config.js</i> 中定义应用程序的 _baseUrl_：

```js
export default defineConfig({
  // ...
  use: {
    baseURL: 'http://localhost:5173',
    // ...
  },
  // ...
})
```

<!-- All the commands in the tests that use the application url, e.g. -->
所有在测试中使用应用程序 url 的命令，例如

```js
await page.goto('http://localhost:5173')
await page.post('http://localhost:5173/api/testing/reset')
```

<!-- can now be transformed into: -->
现在都可以转换为：

```js
await page.goto('/')
await page.post('/api/testing/reset')
```

<!-- The current code for the tests is on [GitHub](https://github.com/fullstack-hy2020/notes-e2e/tree/part5-2), branch <i>part5-2</i>. -->
测试的当前代码在 [GitHub](https://github.com/fullstack-hy2020/notes-e2e/tree/part5-2) 上，分支为 <i>part5-2</i>。

### Note importance change revisited

<!-- Let's take a look at the test we did earlier, which verifies that it is possible to change the importance of a note. -->
让我们看看之前做的测试，它验证了可以更改笔记的重要性。

<!-- Let's change the initialization block of the test so that it creates two notes instead of one: -->
让我们更改测试的初始化块，使其创建两个笔记而不是一个：

```js
describe('when logged in', () => {
  // ...
  describe('and several notes exists', () => { // highlight-line
    beforeEach(async ({ page }) => {
      // highlight-start
      await createNote(page, 'first note')
      await createNote(page, 'second note')
      // highlight-end
    })

    test('one of those can be made nonimportant', async ({ page }) => {
      const otherNoteElement = page.getByText('first note')

      await otherNoteElement
        .getByRole('button', { name: 'make not important' }).click()
      await expect(otherNoteElement.getByText('make important')).toBeVisible()
    })
  })
})
```

<!-- The test first searches for the element corresponding to the first created note using the method _page.getByText_ and stores it in a variable. After this, a button with the text _make not important_ is searched inside the element and the button is pressed. Finally, the test verifies that the button's text has changed to _make important_. -->
测试首先使用 _page.getByText_ 方法搜索与第一个创建的笔记对应的元素，并将其存储在一个变量中。之后，在元素内部搜索带有文本 _make not important_ 的按钮并点击该按钮。最后，测试验证按钮的文本是否已更改为 _make important_。

<!-- The test could also have been written without the auxiliary variable: -->
测试也可以不使用辅助变量来编写：

```js
test('one of those can be made nonimportant', async ({ page }) => {
  page.getByText('first note')
    .getByRole('button', { name: 'make not important' }).click()

  await expect(page.getByText('first note').getByText('make important'))
    .toBeVisible()
})
```

<!-- Let's change the _Note_ component so that the note text is rendered inside a _span_ element -->
让我们修改 _Note_ 组件，使笔记的文本渲染在 _span_ 元素内部

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

<!-- Tests break! The reason for the problem is that the command _page.getByText('first note')_ now returns a _span_ element containing only text, and the button is outside of it. -->
测试会失败！问题的原因是命令 _page.getByText('first note')_ 现在返回的是一个仅包含文本的 _span_ 元素，而按钮位于其外部。

<!-- One way to fix the problem is as follows: -->
解决这个问题的方法如下：

```js
test('one of those can be made nonimportant', async ({ page }) => {
  const otherNoteText = page.getByText('first note') // highlight-line
  const otherNoteElement = otherNoteText.locator('..') // highlight-line

  await otherNoteElement.getByRole('button', { name: 'make not important' }).click()
  await expect(otherNoteElement.getByText('make important')).toBeVisible()
})
```

<!-- The first line now looks for the _span_ element containing the text associated with the first created note. In the second line, the function _locator_ is used and _.._ is given as an argument, which retrieves the element's parent element. The locator function is very flexible, and we take advantage of the fact that accepts [as argument](https://playwright.dev/docs/locators#locate-by-css-or-xpath) not only CSS selectors but also [XPath](https://developer.mozilla.org/en-US/docs/Web/XPath) selector. It would be possible to express the same with CSS, but in this case XPath provides the simplest way to find the parent of an element. -->
现在第一行代码查找包含第一个创建的笔记的文本的 _span_ 元素。在第二行中，使用函数 _locator_，并将 _.._ 作为参数传入，这会获取元素的父元素。locator 函数非常灵活，我们利用了它不仅接受 CSS 选择器，还接受 [XPath](https://developer.mozilla.org/en-US/docs/Web/XPath) 选择器[作为参数](https://playwright.dev/docs/locators#locate-by-css-or-xpath)的特性。用 CSS 可以表达相同的功能，但在此情况下，XPath 提供了一种最简单的方式来查找元素的父元素。

<!-- Of course, the test can also be written using only one auxiliary variable: -->
当然，这个测试也可以只用一个辅助变量来编写：

```js
test('one of those can be made nonimportant', async ({ page }) => {
  const secondNoteElement = page.getByText('second note').locator('..')
  await secondNoteElement.getByRole('button', { name: 'make not important' }).click()
  await expect(secondNoteElement.getByText('make important')).toBeVisible()
})
```

<!-- Let's change the test so that three notes are created, the importance is changed in the second created note: -->
让我们修改测试，以便创建三个笔记，并更改第二个创建的笔记的重要性：

```js
describe('when logged in', () => {
  beforeEach(async ({ page }) => {
    await loginWith(page, 'mluukkai', 'salainen')
  })

  test('a new note can be created', async ({ page }) => {
    await createNote(page, 'a note created by playwright', true)
    await expect(page.getByText('a note created by playwright')).toBeVisible()
  })

  describe('and several notes exists', () => {
    beforeEach(async ({ page }) => {
      await createNote(page, 'first note')
      await createNote(page, 'second note')
      await createNote(page, 'third note') // highlight-line
    })

    test('one of those can be made nonimportant', async ({ page }) => {
      const otherNoteText = page.getByText('second note') // highlight-line
      const otherNoteElement = otherNoteText.locator('..')
    
      await otherNoteElement.getByRole('button', { name: 'make not important' }).click()
      await expect(otherNoteElement.getByText('make important')).toBeVisible()
    })
  })
}) 
```

<!-- For some reason the test starts working unreliably, sometimes it passes and sometimes it doesn't. It's time to roll up your sleeves and learn how to debug tests. -->
不知为何，测试开始变得不可靠，有时通过，有时不通过。是时候撸起袖子，学习如何调试测试了。

### Test development and debugging

<!-- If, and when the tests don't pass and you suspect that the fault is in the tests instead of in the code, you should run the tests in [debug](https://playwright.dev/docs/debug#run-in-debug-mode-1) mode. -->
如果测试未通过，并且你怀疑问题出在测试而非代码上，你应该以[调试](https://playwright.dev/docs/debug#run-in-debug-mode-1)模式运行测试。

<!-- The following command runs the problematic test in debug mode: -->
以下命令以调试模式运行有问题的测试：

```
npm test -- -g'one of those can be made nonimportant' --debug
```

<!-- Playwright-inspector shows the progress of the tests step by step. The arrow-dot button at the top takes the tests one step further. The elements found by the locators and the interaction with the browser are visualized in the browser: -->
Playwright-inspector 会逐步显示测试进度。点击顶部的箭头-点按钮可让测试进入下一步。通过定位器找到的元素以及与浏览器的交互都在浏览器中可视化显示：

![playwright inspector highlighting element found by the selected locator in the application](../../images/5/play6a.png)

<!-- By default, debug steps through the test command by command. If it is a complex test, it can be quite a burden to step through the test to the point of interest. This can be avoided by using the command _await page.pause()_: -->
默认情况下，调试会逐条地执行测试命令。如果测试比较复杂，逐条调试到感兴趣的部分可能会非常费劲。可以通过使用命令 _await page.pause()_ 来避免这种情况：

```js
describe('Note app', () => {
  beforeEach(async ({ page, request }) => {
    // ...
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      // ...
    })

    describe('and several notes exists', () => {
      beforeEach(async ({ page }) => {
        await createNote(page, 'first note')
        await createNote(page, 'second note')
        await createNote(page, 'third note')
      })
  
      test('one of those can be made nonimportant', async ({ page }) => {
        await page.pause() // highlight-line
        const otherNoteText = page.getByText('second note')
        const otherNoteElement = otherNoteText.locator('..')
      
        await otherNoteElement.getByRole('button', { name: 'make not important' }).click()
        await expect(otherNoteElement.getByText('make important')).toBeVisible()
      })
    })
  })
})
```

<!-- Now in the test you can go to _page.pause()_ in one step, by pressing the green arrow symbol in the inspector. -->
现在，你可以通过按下检查器中的绿色箭头符号，一步跳转到 _page.pause()_。

<!-- When we now run the test and jump to the _page.pause()_ command, we find an interesting fact: -->
当我们运行测试并跳转到 _page.pause()_ 命令时，我们发现了一个有趣的事实：

![playwright inspector showing the state of the application at page.pause](../../images/5/play6b.png)

<!-- It seems that the browser <i>does not render</i> all the notes created in the block _beforeEach_. What is the problem? -->
浏览器似乎<i>没有渲染</i>在 _beforeEach_ 块中创建的所有笔记。问题出在哪里？

<!-- The reason for the problem is that when the test creates one note, it starts creating the next one even before the server has responded, and the added note is rendered on the screen. This in turn can cause some notes to be lost (in the picture, this happened to the second note created), since the browser is re-rendered when the server responds, based on the state of the notes at the start of that insert operation. -->
问题的原因是，当测试创建一个笔记时，它会在服务器响应之前就开始创建下一个笔记，而新添加的笔记被渲染在屏幕上。这反过来可能导致一些笔记丢失（在图片中，这发生在创建第二个笔记时），因为当服务器响应时，浏览器会根据插入操作开始时的笔记状态重新渲染。

<!-- The problem can be solved by "slowing down" the insert operations by using the [waitFor](https://playwright.dev/docs/api/class-locator#locator-wait-for) command after the insert to wait for the inserted note to render: -->
这个问题可以通过“减慢”插入操作来解决，在插入操作后使用 [waitFor](https://playwright.dev/docs/api/class-locator#locator-wait-for) 以等待插入的笔记被渲染：

```js
const createNote = async (page, content) => {
  await page.getByRole('button', { name: 'new note' }).click()
  await page.getByRole('textbox').fill(content)
  await page.getByRole('button', { name: 'save' }).click()
  await page.getByText(content).waitFor() // highlight-line
}
```

<!-- Instead of, or alongside debugging mode, running tests in UI mode can be useful. As already mentioned, tests are started in UI mode as follows: -->
在 UI 模式下运行测试可能很有用，它可以替代或者配合调试模式。如前所述，测试用以下命令在 UI 模式下启动：

```
npm run test -- --ui
```

<!-- Almost the same as UI mode is use of the Playwright's [Trace Viewer](https://playwright.dev/docs/trace-viewer-intro). The idea is that a "visual trace" of the tests is saved, which can be viewed if necessary after the tests have been completed. A trace is saved by running the tests as follows: -->
使用 Playwright 的[跟踪查看器](https://playwright.dev/docs/trace-viewer-intro)几乎与 UI 模式相同。其想法是保存测试的“视觉跟踪”，在测试完成后如有必要可以查看。通过以下方式运行测试可以保存跟踪：

```
npm run test -- --trace on
```

<!-- If necessary, Trace can be viewed with the command -->
如果需要，可以使用这个命令查看跟踪

```
npx playwright show-report
```

<!-- or with the npm script we defined _npm run test:report_ -->
或者使用我们定义的 npm 脚本 _npm run test:report_

<!-- Trace looks practically the same as running tests in UI mode. -->
跟踪看起来几乎和 UI 模式下运行测试一样。

<!-- UI mode and Trace Viewer also offer the possibility of assisted search for locators. This is done by pressing the double circle on the left side of the lower bar, and then by clicking on the desired user interface element. Playwright displays the element locator: -->
UI 模式和跟踪查看器还提供了定位器的辅助搜索功能。这是通过点击下栏左侧的双圆圈，然后点击所需的用户界面元素来完成的。Playwright 显示元素定位器：

![playwright's trace viewer with red arrows pointing at the locator assisted search location and to the element selected with it showing a suggested locator for the element](../../images/5/play8.png)

<!-- Playwright suggests the following as the locator for the third note -->
Playwright 建议以下作为第三个笔记的定位器

```js
page.locator('li').filter({ hasText: 'third note' }).getByRole('button')
```

<!-- The method [page.locator](https://playwright.dev/docs/api/class-page#page-locator) is called with the argument _li_, i.e. we search for all li elements on the page, of which there are three in total. After this, using the [locator.filter](https://playwright.dev/docs/api/class-locator#locator-filter) method, we narrow down to the li element that contains the text <i>third note</i> and the button element inside it is taken using the [locator.getByRole](https://playwright.dev/docs/api/class-locator#locator-get-by-role) method. -->
方法 [page.locator](https://playwright.dev/docs/api/class-page#page-locator) 被调用，参数为 _li_，即我们在页面上搜索所有 li 元素，总共有三个。之后，使用 [locator.filter](https://playwright.dev/docs/api/class-locator#locator-filter) 方法，我们缩小范围到包含文本 <i>third note</i> 的 li 元素，并使用 [locator.getByRole](https://playwright.dev/docs/api/class-locator#locator-get-by-role) 方法获取其内部的按钮元素。

<!-- The locator generated by Playwright is somewhat different from the locator used by our tests, which was -->
Playwright 生成的定位器与我们的测试中使用的定位器略有不同，后者是

```js
page.getByText('first note').locator('..').getByRole('button', { name: 'make not important' })
```

<!-- Which of the locators is better is probably a matter of taste. -->
哪个定位器更好可能是一个主观的问题。

<!-- Playwright also includes a [test generator](https://playwright.dev/docs/codegen-intro) that makes it possible to "record" a test through the user interface. The test generator is started with the command: -->
Playwright 还包含一个[测试生成器](https://playwright.dev/docs/codegen-intro)，可以通过用户界面“录制”测试。测试生成器使用以下命令启动：

```
npx playwright codegen http://localhost:5173/
```

<!-- When the _Record_ mode is on, the test generator "records" the user's interaction in the Playwright inspector, from where it is possible to copy the locators and actions to the tests: -->
当 _Record_ 模式开启时，测试生成器会在 Playwright 检查器中“录制”用户的交互，可以把这些定位器和操作复制到测试中：

![playwright's record mode enabled with its output in the inspector after user interaction](../../images/5/play9.png)

<!-- Instead of the command line, Playwright can also be used via the [VS Code](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) plugin. The plugin offers many convenient features, e.g. use of breakpoints when debugging tests. -->
除了命令行，Playwright 还可以通过 [VS Code](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) 插件使用。该插件提供许多便捷功能，例如在调试测试时使用断点。

<!-- To avoid problem situations and increase understanding, it is definitely worth browsing Playwright's high-quality [documentation](https://playwright.dev/docs/intro). The most important sections are listed below: -->
为了避免问题并增加理解，浏览 Playwright 的高质量[文档](https://playwright.dev/docs/intro)绝对值得。最重要的部分列在下表：

<!-- - the section about [locators](https://playwright.dev/docs/locators) gives good hints for finding elements in test -->
- [定位器](https://playwright.dev/docs/locators)部分为在测试中查找元素提供了良好的提示
<!-- - section [actions](https://playwright.dev/docs/input) tells how it is possible to simulate the interaction with the browser in tests -->
- [操作]((https://playwright.dev/docs/input))部分说明了如何在测试中模拟与浏览器的交互
<!-- - the section about [assertions](https://playwright.dev/docs/test-assertions) demonstrates the different expectations Playwright offers for testing -->
- [断言](https://playwright.dev/docs/test-assertions)部分展示了 Playwright 为测试提供的不同预期

<!-- In-depth details can be found in the [API](https://playwright.dev/docs/api/class-playwright) description, particularly useful are the class [Page](https://playwright.dev/docs/api/class-page) corresponding to the browser window of the application under test, and the class [Locator](https://playwright.dev/docs/api/class-locator) corresponding to the elements searched for in the tests. -->
详细内容可以在 [API](https://playwright.dev/docs/api/class-playwright) 描述中找到，特别有用的是测试里对应于应用程序浏览器窗口的 [Page](https://playwright.dev/docs/api/class-page) 类，以及在测试中用于搜索元素的 [Locator](https://playwright.dev/docs/api/class-locator) 类。

<!-- The final version of the tests is in full on [GitHub](https://github.com/fullstack-hy2020/notes-e2e/tree/part5-3), in branch <i>part5-3</i>. -->
测试的最终版本完整地托管在 [GitHub](https://github.com/fullstack-hy2020/notes-e2e/tree/part5-3) 上，分支为 <i>part5-3</i>。

<!-- The final version of the frontend code is in its entirety on [GitHub](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-9), in branch <i>part5-9</i>. -->
前端代码的最终版本完整地托管在 [GitHub](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-9) 上，分支为 <i>part5-9</i>。

</div>

<div class="tasks">

### Exercises 5.17.-5.23.

<!-- In the last exercises of this part, let's do some E2E tests for the blog application. The material above should be enough to do most of the exercises. However, you should definitely read Playwright's [documentation](https://playwright.dev/docs/intro) and [API description](https://playwright.dev/docs/api/class-playwright), at least the sections mentioned at the end of the previous chapter. -->
在本部分的最后几个练习中，让我们为博客应用做一些 E2E 测试。上述材料应该足以完成大部分练习。然而，你绝对应该阅读 Playwright 的[文档](https://playwright.dev/docs/intro)和 [API 描述](https://playwright.dev/docs/api/class-playwright)，至少要阅读上一章末尾提到的部分。

#### 5.17: Blog List End To End Testing, step 1

<!-- Create a new npm project for tests and configure Playwright there. -->
为测试创建一个新的 npm 项目，并在其中配置 Playwright。

<!-- Make a test to ensure that the application displays the login form by default. -->
编写一个测试，确保应用程序默认显示登录表单。

<!-- The body of the test should be as follows: -->
测试的主体应如下：

```js
const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    // ...
  })
})

```

#### 5.18: Blog List End To End Testing, step 2

<!-- Do the tests for login. Test both successful and failed login. For tests, create a user in the _beforeEach_ block. -->
进行登录测试。成功和失败的登录都要测试。为了测试，需要在 _beforeEach_ 块中创建一个用户。

<!-- The body of the tests expands as follows -->
测试的主体扩展如下

```js
const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // empty the db here
    // create a user for the backend here
    // ...
  })

  test('Login form is shown', async ({ page }) => {
    // ...
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      // ...
    })

    test('fails with wrong credentials', async ({ page }) => {
      // ...
    })
  })
})
```

<!-- The _beforeEach_ block must empty the database using, for example, the reset method we used in the [material](/en/part5/end_to_end_testing_playwright#controlling-the-state-of-the-database). -->
_beforeEach_ 块必须清空数据库，例如使用我们在[材料](/en/part5/end_to_end_testing_playwright#controlling-the-state-of-the-database)中使用的 reset 方法。

#### 5.19: Blog List End To End Testing, step 3

<!-- Create a test that verifies that a logged in user can create a blog. The body of the test may look like the following -->
编写一个测试，验证登录用户可以创建博客。测试的主体可能如下所示

```js
describe('When logged in', () => {
  beforeEach(async ({ page }) => {
    // ...
  })

  test('a new blog can be created', async ({ page }) => {
    // ...
  })
})
```

<!-- The test should ensure that the created blog is visible in the list of blogs. -->
该测试应确保创建的博客在博客列表中可见。

#### 5.20: Blog List End To End Testing, step 4

<!-- Do a test that makes sure the blog can be liked. -->
编写一个测试，确保博客可以被点赞。

#### 5.21: Blog List End To End Testing, step 5

<!-- Make a test that ensures that the user who added the blog can delete the blog. If you use the _window.confirm_ dialog in the delete operation, you may have to Google how to use the dialog in the Playwright tests. -->
编写一个测试，确保添加博客的用户可以删除博客。如果你在删除操作中使用 _window.confirm_ 对话框，你可能需要去 Google 搜索如何在 Playwright 测试中使用该对话框。

#### 5.22: Blog List End To End Testing, step 6

<!-- Make a test that ensures that only the user who added the blog sees the blog's delete button. -->
编写一个测试，确保只有添加博客的用户能看见博客的删除按钮。

#### 5.23: Blog List End To End Testing, step 7

<!-- Do a test that ensures that the blogs are arranged in the order according to the likes, the blog with the most likes first. -->
编写一个测试，确保博客按照点赞数排序，点赞数最多的博客排在最前面。

<!-- <i>This task is significantly more challenging than the previous ones.</i> -->
<i>这项任务比之前的要困难得多。</i>

<!-- This was the last task of the section and it's time to push the code to GitHub and mark the completed tasks in the [exercise submission system](https://studies.cs.helsinki.fi/stats/courses/fullstackopen). -->
这是该部分的最后一个任务，现在可以将代码推送到 GitHub，并在[练习提交系统](https://studies.cs.helsinki.fi/stats/courses/fullstackopen)中标记已完成的任务。

</div>
