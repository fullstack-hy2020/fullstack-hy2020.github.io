---
mainImage: ../../../images/part-5.svg
part: 5
letter: d
lang: zh
---

<div class="content">


<!-- Olemme tehneet backendille sitä apin tasolla kokonaisuutena testaavia integraatiotestejä ja frontendille yksittäisiä komponentteja testaavia yksikkötestejä.  -->

So far we have tested the backend as a whole on an API level using integration tests, and tested some frontend components using unit tests.
到目前为止，我们已经使用集成测试在 API 级别上测试了整个后端，并使用单元测试测试了一些前端组件。

<!-- Katsotaan nyt erästä tapaa tehdä [järjestelmää kokonaisuutena](https://en.wikipedia.org/wiki/System_testing) tutkivia <i>End to End (E2E) -testejä</i>. -->

Next we will look into one way to test the [system as a whole](https://en.wikipedia.org/wiki/System_testing) using <i>End to End</i> (E2E) tests.
接下来，我们将研究一种使用 i End to End / i (E2E)测试[系统作为一个整体]( https://en.wikipedia.org/wiki/system_testing )的方法。

<!-- Web-sovellusten E2E-testaus tapahtuu käyttäen selainta jonkin kirjaston avulla. Ratkaisuja on tarjolla useita, esimerkiksi [Selenium](http://www.seleniumhq.org/), joka mahdollistaa testien automatisoinnin lähes millä tahansa selaimella. Toinen vaihtoehto on käyttää ns. [headless browseria](https://en.wikipedia.org/wiki/Headless_browser) eli selainta, jolla ei ole ollenkaan graafista käyttöliittymää. Esim. Chromea on mahdollista suorittaa Headless-moodissa. -->
<！ -- Web-sovellusten e2e-testus tapahtuu k ytt en selainta jonkin kirjaston avulla. 在塔霍拉乌西塔的 Ratkaisuja，esimerkiksi [ Selenium ]( http://www.seleniumhq.org/ ) ，joka mahdollistaa testimatisoinin in mill tahansa selaimella。 把你的手放在刀口上。 ( https://en.wikipedia.org/wiki/headless_browser ) eli selainta，jolla ei ole ollenkaan graafista k ytt liittym. 男名男子名。 无头苍蝇-无头苍蝇上的铬美亚。  -->
We can do E2E testing of an web application using a browser and a testing library. There are multiple libraries available, for example [Selenium](http://www.seleniumhq.org/) which can be used with almost any browser. 
我们可以使用浏览器和测试库对 web 应用程序进行 E2E 测试。 有多个库可用，例如[ Selenium ]( http://www.seleniumhq.org/ ) ，几乎可以用于任何浏览器。
Another browser option are so called [headless browsers](https://en.wikipedia.org/wiki/Headless_browser), which are browsers with no graphical user interface. 
另一个浏览器选项是所谓的[无头浏览器](headless browsers) ，这是一种没有 https://en.wikipedia.org/wiki/headless_browser 图形用户界面的浏览器。
For example Chrome can be used in Headless-mode. 
例如，Chrome 可以在 headless 模式下使用。

<!-- E2E testit ovat potentiaalisesti kaikkein hyödyllisin testikategoria, sillä ne tutkivat järjestelmää saman rajapinnan kautta kuin todelliset käyttäjät. -->

E2E tests are potentially the most useful category of tests, because they test the system trough the same interface as real users use. 
E2e 测试可能是最有用的一类测试，因为它们测试系统的界面与真实用户使用的界面相同。

<!-- E2E-testeihin liittyy myös ikäviä puolia. Niiden konfigurointi on haastavampaa kuin yksikkö- ja integraatiotestien. E2E-testit ovat tyypillisesti myös melko hitaita ja isommassa ohjelmistossa niiden suoritusaika voi helposti nousta minuutteihin, tai jopa tunteihin. Tämä on ikävää sovelluskehityksen kannalta, sillä sovellusta koodatessa on erittäin hyödyllistä pystyä suorittamaan testejä mahdollisimman usein koodin [regressioiden](https://en.wikipedia.org/wiki/Regression_testing) varalta.  -->
<！ -- E2E-testeihin liittyy my s ik vi puolia. 尼德孔菲格鲁提对 haastavampaa kuin ykkk-ja integraatitien。 2008年10月22日，我的妻子玛莎 · 伊索玛莎 · 奥耶尔米斯托萨 · 尼登 · 苏里塔 · 苏里塔 · 苏里塔 · 沃伊向我证明了她的能力。 在我们的网站 sovelluskehityksen kannalta 上，他们的网站 sovellusta koodatessa 在移动设备上，用户名为 pysty suorittamaan testej mahdollisimman usin koodin [ regressioiden ]( https://en.wikipedia.org/wiki/regression_testing ) varalta。   -->
They do some drawbacks too. Configuring E2E tests is more challenging than unit- or integration tests. They also tend to be quite slow, and with a large system their execution time can be minutes, even hours. This is bad for development, because during coding it is beneficial to be able to run tests as often as possible in case of code [regressions](https://en.wikipedia.org/wiki/Regression_testing).
它们也有一些缺点。 配置 E2E 测试比单元测试或集成测试更具挑战性。 它们也往往非常慢，对于一个大型系统，它们的执行时间可能是几分钟，甚至几小时。 这对开发是不利的，因为在编码期间，如果遇到代码[回归]( https://en.wikipedia.org/wiki/regression_testing ) ，能够尽可能多地运行测试是有益的。


<!-- Ongelmana on  usein myös se, että käyttöliittymän kautta tehtävät testit saattavat olla epäluotettavia eli englanniksi [flaky](https://hackernoon.com/flaky-tests-a-war-that-never-ends-9aa32fdef359), osa testeistä menee välillä läpi ja välillä ei, vaikka koodissa ei muuttuisi mikään. -->

E2E tests can also be [flaky](https://hackernoon.com/flaky-tests-a-war-that-never-ends-9aa32fdef359). 
E2e 测试也可能是[片状的]( https://hackernoon.com/flaky-tests-a-war-that-never-ends-9aa32fdef359)。
Some tests might pass one time and fail another, even if the code does not change at all. 
有些测试可能一次通过，另一次失败，即使代码根本没有改变。


### Cypress
# # 柏树

<!-- [Cypress](https://www.cypress.io/)-niminen E2E-testaukseen soveltuva kirjasto on kasvattanut nopeasti suosiotaan viimeisen reilun vuoden aikana. Cypress on poikkeuksellisen helppokäyttöinen, kaikenlaisen säätämisen ja tunkkaamisen määrä esim. Seleniumin käyttöön verrattuna on lähes olematon. Cypressin toimintaperiaate poikkeaa radikaalisti useimmista E2E-testaukseen sopivista kirjastoista, sillä Cypress-testit ajetaan kokonaisuudessaan selaimen sisällä. Muissa lähestymistavoissa testit suoritetaan Node-prosessissa, joka on yhteydessä selaimeen  ohjelmointirajapintojen kautta. -->

E2E library [Cypress](https://www.cypress.io/) has become popular within the last year. Cypress is exceptionally easy to use, and when compared to for example Selenium requires a lot less hassle and headache. 
在过去的一年里，E2E 图书馆[ Cypress ]( https://www.Cypress.io/ 图书馆)变得非常流行。 赛普拉斯是非常容易使用，当比较例如硒需要少得多麻烦和头痛。
It's operating princible is radically different than most E2E testing libraries, because Cypress test are run completely within the browser.
它的操作原理与大多数 E2E 测试库完全不同，因为 Cypress 测试完全在浏览器中运行。
Other libraries run the tests in a Node-process, which is connected to the broswer trough an API. 
其他库在一个 node 进程中运行测试，该进程通过一个 API 连接到浏览器。


<!-- Tehdään tämän osan lopuksi muutamia end to end -testejä muistiinpanosovellukselle.  -->

Let's  make some end to end tests for our note application.
让我们为笔记应用程序做一些端到端的测试。

<!-- Aloitetaan asentamalla Cypress <i>frontendin</i> kehitysaikaiseksi riippuvuudeksi -->

We begin by installing Cypress to <i>the frontend</i> as development dependency
我们首先将 Cypress 安装到 i 的前端 / i 作为开发依赖项

```js
npm install --save-dev cypress
```

<!-- ja määritellään npm-skripti käynnistämistä varten. -->

and by adding an npm-script to run it:
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

<!-- Toisin kuin esim. frontendin yksikkötestit, Cypress-testit voidaan sijoittaa joko frontendin tai backendin repositorioon, tai vaikka kokonaan omaan repositorioonsa.  -->

Unlike frontend's unit tests, Cypress tests can be in the frontend or the backend repository, or even on their own separate repository. 
与前端的单元测试不同，Cypress 测试可以位于前端或后端存储库中，甚至可以位于它们自己的单独存储库中。

<!-- Cypress-testit olettavat että testattava järjestelmä on käynnissä kun testit suoritetaan, eli toisin kuin esim. backendin integraatiotestit, Cypress-testit <i>eivät käynnistä</i> testattavaa järjestelmää testauksen yhteydessä. -->

The tests require the tested system to be running. Unlike our backend integration tests, Cypress test <i>do not start</i> the system when they are run. 
这些测试要求测试系统正常运行。 与我们的后端集成测试不同，Cypress test i 在系统运行时不启动 / i。

<!-- Tehdään <i>backendille</i> npm-skripti, jonka avulla se saadaan käynnistettyä testausmoodissa, eli siten, että <i>NODE\_ENV</i> saa arvon <i>test</i>. -->
!-tehd n i backendille / i npm-skripti，jonka avulla se saadaan k ynnistetty testausmoodissa，eli siten，ett i NODE  ENV / i saa arvon i test / i.-
Let's add an npm-script to <i>the backend</i> which starts it in test mode, or so that <i>NODE\_ENV</i> is <i>test</i>.
让我们在后端 / i 中添加一个 npm-script，在测试模式下启动它，或者使 i NODE  ENV / i 为 i test / i。

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

<!-- Kun backend ja frontend ovat käynnissä, voidaan käynnistää Cypress komennolla -->

When both backend and frontend are running, we can start Cypress with the command
当后端和前端都在运行时，我们可以使用命令启动 Cypress

```js
npm run cypress:open
```

<!-- Ensimmäisen käynnistyksen yhteydessä sovellukselle syntyy hakemisto <i>cypress</i>, jonka alihakemistoon <i>integrations</i> on tarkoitus sijoittaa testit. Cypress luo valmiiksi joukon esimerkkitestejä, poistetaan ne ja luodaan ensimmäinen oma testi tiedostoon <i>note\_app.spec.js</i>: -->

When we first run Cypress, it creates a <i>cypress</i> directory. It contains a <i>integrations</i> subdirectory, where we will place our tests. Cypress creates a bunch of example tests for us, but we will delete all those and make our own test in file <i>note\_app.speck.js</i>:
当我们第一次运行 Cypress 时，它会创建一个 i Cypress / i 目录。 它包含一个 i 集成 / i 子目录，我们将在其中放置测试。 Cypress 为我们创建了一系列测试示例，但是我们将删除所有这些并在文件 i note  app.speck.js / i 中创建我们自己的测试:

```js
describe('Note ', function() {
  it('front page can be opened', function() {
    cy.visit('http://localhost:3000')
    cy.contains('Notes')
    cy.contains('Note app, Department of Computer Science, University of Helsinki 2020')
  })
})
```

<!-- Testin suoritus käynnistetään avautuneesta ikkunasta: -->

We start the test from the opened window:
我们从打开的窗口开始测试:

![](../../images/5/40ea.png)


<!-- Testin suoritus avaa selaimen ja näyttää miten sovellus käyttäytyy testin edetessä: -->

Running the test opens your browser and shows how the application behaves as the test is run:
运行测试会打开你的浏览器，并显示应用程序在运行测试时的行为:

![](../../images/5/32ae.png)


<!-- Testi näyttää rakenteeltaan melko tutulta. <i>describe</i>-lohkoja käytetään samaan tapaan kuin Jestissä ryhmittelemään yksittäisiä testitapauksia, jotka on määritelty <i>it</i>-metodin avulla. Nämä osat Cypress on lainannut sisäisesti käyttämältään [Mocha](https://mochajs.org/)-testikirjastolta.   -->

The structure of the test should look faimiliar. They use <i>describe</i> blocks to group different test cases like Jest does. The test cases have been defined with the <i>it</i> method. 
测试的结构应该看起来很模糊。 他们使用 i describe / i 块对不同的测试用例进行分组，就像 Jest 那样。 测试用例已经用 i it / i 方法定义了。
Cypress borrowed these parts from [Mocha](https://mochajs.org/) testing library it uses under the hood. 
赛普拉斯从[摩卡]( https://mochajs.org/ )测试库中借用了这些部件，并在引擎盖下使用。

<!-- [cy.visit](https://docs.cypress.io/api/commands/visit.html) ja [cy.contains](https://docs.cypress.io/api/commands/contains.html) taas ovat Cypressin komentoja, joiden merkitys on aika ilmeinen. [cy.visit](https://docs.cypress.io/api/commands/visit.html) avaa testin käyttämään selaimeen parametrina määritellyn osoitteen ja [cy.contains](https://docs.cypress.io/api/commands/contains.html) etsii sivun sisältä parametrina annetun tekstin.  -->

[cy.visit](https://docs.cypress.io/api/commands/visit.html) and [cy.contains](https://docs.cypress.io/api/commands/contains.html) are Cypress commands, and their purpose is quite obvious.
[ cy.visit ]( https://docs.Cypress.io/api/commands/visit.html )和[ cy.contains ]( https://docs.Cypress.io/api/commands/contains.html )是 Cypress 命令，它们的用途非常明显。
[cy.visit](https://docs.cypress.io/api/commands/visit.html) opens the web address given to it as a parameter on the browser used by the test. [cy.contains](https://docs.cypress.io/api/commands/contains.html) searches for the string it received as a parameter from the page. 
[ cy.visit ]( https://docs.cypress.io/api/commands/visit.html )在测试使用的浏览器上打开给它的网址作为参数。 [ cy.contains ]( https://docs.cypress.io/api/commands/contains.html )搜索作为页面参数接收的字符串。

<!-- Olisimme voineet määritellä testin myös käyttäen nuolifunktioita -->

We could have declared the test using an arrow function
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

<!-- Mochan dokumentaatio kuitenkin [suosittelee](https://mochajs.org/#arrow-functions) että nuolifunktioita ei käytetä, ne saattavat aiheuttaa ongelmia joissain tilanteissa. -->

However, Mocha [recommends](https://mochajs.org/#arrow-functions) that arrow functions are not used, because they might cause some issues in certain situations. 
然而，Mocha [建议]( https://mochajs.org/#arrow-functions )不要使用箭头函数，因为它们在某些情况下可能会导致一些问题。

<!-- Jos komento <i>cy.contains</i> ei löydä sivulta etsimäänsä tekstiä, testi ei mene läpi. Eli jos laajennamme testiä seuraavasti -->
-- jose komento i cy.contains / i ei yd sivulta etsim ns teksti，testi mene l pi
If <i>cy.contains</i> does not find the text is it searching for, the test does not pass. 
如果 i cy.contains / i 没有找到正在搜索的文本，则测试不会通过。
So if we extend our test like so
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

<!-- havaitsee Cypress ongelman -->

the test fails
测试失败了

![](../../images/5/33ea.png)


<!-- Poistetaan virheeseen johtanut testi koodista. -->

Let's remove the failing code from the test. 
让我们从测试中删除失败的代码。

### Writing to a form
# # 写在表格上

<!-- Laajennetaan testejä siten, että testi yrittää kirjautua sovellukseen. Oletetaan että backendin tietokantaan on tallennettu käyttäjä, jonka käyttäjätunnus on <i>mluukkai</i> ja salasana <i>salainen</i>.  -->
-- lajennettaan testej siten，ett testi yritt kirjautua sovellukseen.oletetan ett backendin titokantaan on tallennettu k ytt j，jonka k ytt tunus on i mluukkai / i ja salasana i salainen / i. -->
Let's extend our tests so, that the test tries to log in to our application. 
让我们扩展测试，以便测试尝试登录到我们的应用程序。
We assume our backend contains a user with the username <i>mluukkai</i> and password <i>salainen</i>.
我们假设后端包含一个用户名为 i mluukkai / i 和密码 i salainen / i 的用户。

<!-- Aloitetaan kirjautumislomakkeen avaamisella. -->
——阿勒泰塔安 · 克里斯托马克 · 阿瓦米塞拉——
The test begins by opening the login form. 
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

<!-- Testi hakee ensin napin sen tekstin perusteella ja klikkaa nappia komennolla [cy.click](https://docs.cypress.io/api/commands/click.html#Syntax). -->

The test first searches for the login button by its text, and clicks the button with the command [cy.click](https://docs.cypress.io/api/commands/click.html#Syntax).
测试首先通过文本搜索登录按钮，然后用命令[ cy.click ]( https://docs.cypress.io/api/commands/click.html#syntax )单击该按钮。

<!-- Koska molemmat testit aloittavat samalla tavalla, eli avaamalla sivun <i>http://localhost:3000</i>, kannattaa yhteinen osa eristää ennen jokaista testiä suoritettavaan <i>beforeEach</i>-lohkoon: -->

Both of our tests begin the same way, by opening the page <i>http://localhost:3000</i>, so we should 
我们的两个测试都是以同样的方式开始的，都是通过打开 i /  http://localhost:3000 / i 页面，所以我们应该
separate the shared part into a <i>beforeEach</i> block run before each test:
在每个测试之前，将共享部分分隔为 i beforeEach / i 块运行:

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

<!-- Ilmoittautumislomake sisältää kaksi <i>input</i>-kenttää, joihin testin tulisi kirjoittaa. -->

The login field contains two <i>input</i> fields, which the test should write into. 
登录字段包含两个 i input / i 字段，测试应该将这两个字段写入其中。

<!-- Komento [cy.get](https://docs.cypress.io/api/commands/get.html#Syntax) mahdollistaa elementtien etsimisen CSS-selektorien avulla. -->

The [cy.get](https://docs.cypress.io/api/commands/get.html#Syntax) command allows for searching elemets by CSS selectors. 
命令允许通过 CSS 选择器搜索元素 https://docs.cypress.io/api/commands/get.html#syntax。

<!-- Voimme hakea lomakkeen ensimmäisen ja viimeisen input-kentän ja kirjoittaa niihin komennolla [cy.type](https://docs.cypress.io/api/commands/type.html#Syntax) seuraavasti: -->

We can access the first and the last input field on the page, and write to them with the command [cy.type](https://docs.cypress.io/api/commands/type.html#Syntax) like so: 
我们可以访问页面上的第一个和最后一个输入字段，并使用命令[ cy.type ]( https://docs.cypress.io/api/commands/type.html#syntax 文件夹)向它们写入内容，如下所示:

```js
it('user can login', function () {
  cy.contains('login').click()
  cy.get('input:first').type('mluukkai')
  cy.get('input:last').type('salainen')
})  
```

<!-- Testi toimii mutta on kuitenkin sikäli ongelmallinen, että jos sovellukseen tulee jossain vaiheessa lisää input-kenttiä, testi saattaa hajota, sillä se luottaa tarvitsemiensa kenttien olevan sivulla ensimmäisenä ja viimeisenä. -->
——参考译文: 参考译文: 参考译文: 参考译文: 参考译文: 参考译文: 参考译文: 参考译文: 参考译文: 参考译文: 参考译文: 参考译文: 参考译文: 参考译文: 参考译文: 参考译文:
The test works. The problem is if we later add more input fields, the test will break because it expects the fields it needs to be the first and the last on the page. 
这个测试是有效的。 问题是，如果我们稍后添加更多的输入字段，测试将中断，因为它期望它需要的字段是页面上的第一个和最后一个。

<!-- Parempi ratkaisu on määritellä kentille yksilöivät <i>id</i>-attribuutit ja hakea kentät testeissä niiden perusteella. Eli laajennetaan kirjautumislomaketta seuraavasti -->

It would be better to give our inputs unique <i>ids</i> and find them by them. 
最好是给我们的输入提供唯一的 id / i 并通过它们找到它们。
We change our login form like so
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

<!-- Myös lomakkeen napille on lisätty id, jonka perusteella se voidaan hakea testissä. -->

We also added an id to our submit button so we can access it in our tests. 
我们还为提交按钮添加了一个 id，这样我们就可以在测试中访问它。

<!-- Testi muuttuu muotoon -->

The test becomes
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

<!-- Viimeinen rivi varmistaa, että kirjautuminen on onnistunut.  -->

The last row ensures, that the login was successful. 
最后一行确保登录成功。

<!-- Huomaa, että CSS:n [id-selektori](https://developer.mozilla.org/en-US/docs/Web/CSS/ID_selectors) on risuaita, eli jos koodista etsitään elementtiä, jolla on id <i>username</i> on sitä vastaava CSS-selektori <i>#username</i>. -->

Note that the CSS [id-selector](https://developer.mozilla.org/en-US/docs/Web/CSS/ID_selectors) is #, so if we want to search for an element with the id <i>username</i> the CSS selector is <i>#username</i>.
注意 CSS [ id-selector ]( https://developer.mozilla.org/en-us/docs/web/CSS/id_selectors )是 # ，所以如果我们想搜索 id i username / i 的元素，CSS 选择器是 i # username / i。

### Some things to note
有些事情需要注意

<!-- Testissä klikataan ensin kirjaantumislomakkeen avaavaa nappia seuraavasti -->

The test first clicks the button opening the login form like so
测试首先单击打开登录表单的按钮，如下所示

```js
cy.contains('login').click()
```

<!-- Kun lomake on täytetty, lähetetään lomake klikkaamalla nappia -->
——昆 · 罗马尼亚，我听说你的尿布——
When the form has been filled, the form is submitted by clicking the submit button
填写完表格后，单击提交按钮即可提交表格

```js
cy.get('#login-button').click()
```

<!-- Molemmissa napeissa on sama teksti <i>login</i>, mutta kyseessä on kaksi erillistä nappia. Molemmat napit ovat itse asiassa koko ajan sovelluksen DOM:issa, mutta niistä vain yksi kerrallaan on näkyvissä, sillä toiselle on lisätty tyylimääre <i>display: none</i>.  -->

Both buttons have the text <i>login</i>, but they are two separate buttons. 
两个按钮都有文本 i login / i，但它们是两个单独的按钮。
Actually both buttons are in the application's DOM the whole time, but only one is visible at a time because of the <i>display:none</i> styling on one of them.
实际上，这两个按钮一直都在应用程序的 DOM 中，但是由于 i 显示器，每次只有一个按钮可见: 其中一个按钮的 none / i 样式。

<!-- Jos haemme nappia tekstin perusteella, palauttaa komento [cy.contains](https://docs.cypress.io/api/commands/contains.html#Syntax) aina napeista ensimmäisen, eli lomakkeen avaavan napin. Näin tapahtuu siis vaikka nappi ei olisikaan näkyvillä. Tämän takia lomakkeen lähettävään nappiin on lisätty id <i>login-button</i>, jonka perusteella testi pääsee nappiin käsiksi. -->

If we search for a button by its text, [cy.contains](https://docs.cypress.io/api/commands/contains.html#Syntax) will return the first of them, or the one opening the login form. 
如果我们通过文本搜索按钮，[ cy.contains ]( https://docs.cypress.io/api/commands/contains.html#syntax )将返回第一个按钮，或者打开登录表单的按钮。
This will happen even if the button is not visible. 
即使按钮不可见，也会发生这种情况。
Because of this we gave the submit button id <i>login-button</i> we can use to access it.
正因为如此，我们给出了提交按钮 id i login-button / i，我们可以用它来访问它。

<!-- Huomaamme, että testeissä käytetty muuttuja _cy_ aiheuttaa ikävän ESlint-virheen -->

Now we notice, that the variable _cy_ our tests use gives us a nasty Eslint error
现在我们注意到，我们的测试使用的变量 cy 给了我们一个讨厌的 Eslint 错误

![](../../images/5/30ea.png)


<!-- Siitä päästään eroon asentamalla [eslint-plugin-cypress](https://github.com/cypress-io/eslint-plugin-cypress) kehitysaikaiseksi riippuvuudeksi -->

We can get rid of it by installing [eslint-plugin-cypress](https://github.com/cypress-io/eslint-plugin-cypress) as a development dependency
我们可以通过安装[ eslint-plugin-cypress ](eslint-plugin-cypress)作为开发依赖项来摆脱这个 https://github.com/cypress-io/eslint-plugin-cypress

```js
npm install eslint-plugin-cypress --save-dev
```

<!-- ja laajentamalla tiedostossa <i>.eslintrc.js</i> olevaa konfiguraatiota seuraavasti:  -->
!-ja laajentamalla tiedostossa i. eslintrc.js / i olevaa konfiguraatiota seuraavasti:-
and changing the configuration in <i>.eslintrc.js</i> like so:
改变 i. eslintrc.js / i 中的配置如下:

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
# # # 测试新钞票表格

<!-- Luodaan seuraavaksi testi, joka lisää sovellukseen uuden muistiinpanon: -->

Let's next add tests which test the new note functionality: 
下面让我们添加测试来测试新笔记的功能:

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

<!-- Testi on määritelty omana <i>describe</i>-lohkonaan. Muistiinpanon luominen edellyttää että käyttäjä on kirjaantuneena, ja kirjautuminen hoidetaan <i>beforeEach</i>-lohkossa.  -->

The test has been defined in its own <i>describe</i> block. 
测试已经在它自己的 i describe / i 块中定义了。
Only logged in users can create new notes, so we added logging in to the application to a <i>beforeEach</i> block. 
只有登录的用户才能创建新的注释，因此我们将登录添加到应用程序的 i beforeEach / i 块中。

<!-- Testi luottaa siihen, että uutta muistiinpanoa luotaessa sivulla on ainoastaan yksi input-kenttä, eli se hakee kentän seuraavasti -->

The test trusts that when creating a new note the page contains only one input, so it searches for it like so
测试相信，在创建新通知时，页面只包含一个输入，因此它会像这样搜索该通知

```js
cy.get('input')
```

<!-- Jos kenttiä olisi useampia, testi hajoaisi -->

If the page contained more inputs, the test would break
如果页面包含更多的输入，测试就会中断

![](../../images/5/31ea.png)


<!-- Tämän takia olisi jälleen parempi lisätä lomakkeen kentälle <i>id</i> ja hakea kenttä testissä id:n perusteella. -->
——这是一位老人和她的妻子，她的丈夫和她的妻子一起住在秘鲁。——
Due to this it would again be better to give the input an <i>id</i> and search for it by it. 
由于这一点，最好再给输入一个 i id / i，并通过它来搜索它。

<!-- Testien rakenne näyttää seuraavalta: -->
——泰特恩 · 拉肯尼 · 西乌拉瓦拉塔: ——
The structure of the tests looks like so:
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

<!-- Cypress suorittaa testit siinä järjestyksessä, missä ne ovat testikoodissa. Eli ensin suoritetaan testi <i>user can log in</i>, missä käyttäjä kirjautuu sovellukseen, ja tämän jälkeen suoritetaan testi <i>a new note can be created</i>, jonka <i>beforeEach</i>-lohkossa myös suoritetaan kirjautuminen. Miksi näin tehdään, eikö käyttäjä jo ole kirjaantuneena aiemman testin ansiosta? Ei, sillä <i>jokaisen</i> testin suoritus alkaa selaimen kannalta "nollatilanteesta", kaikki edellisten testien selaimen tilaan tekemät muutokset nollaantuvat. -->

Cypress runs the tests in the order they are in the code. So first it runs <i>user can log in</i>, where the user logs in. Then cypress will run <i>a new note can be created</i> which's <i>beforeEach</i> block logs in as well. 
Cypress 按照测试在代码中的顺序运行测试。 所以它首先运行 i user can log in / i，用户在这里登录。 然后 cypress 将运行 i，可以创建一个新的注释 / i，也就是 i beforeEach / i 阻塞日志。
Why do this? Is the user not logged in after the first test? 
为什么这样做? 用户在第一次测试后没有登录吗？
No, because <i>each</i> test starts from zero as far as the browser is concerned. 
不，因为就浏览器而言，i / i 测试都是从零开始的。
All changes to the browser's state are reversed after each test.
在每次测试后，对浏览器状态的所有更改都会被反转。

### Controlling the state of the database
# # # 控制数据库状态

<!-- Jos testatessa on tarvetta muokata palvelimen tietokantaa, muuttuu tilanne heti haastavammaksi. Ideaalitilanteessa testauksen tulee aina lähteä liikkeelle palvelimen tietokannan suhteen samasta alkutilanteesta, jotta testeistä saadaan luotettavia ja helposti toistettavia. -->

If the tests need to be able to modify the server's database, the situation immediately becomes more complicated. Ideally, the server's database should be the same each time we run the tests, so our tests can be reliably and easily repeatable. 
如果测试需要能够修改服务器的数据库，那么情况会立即变得更加复杂。 理想情况下，每次运行测试时，服务器的数据库应该是相同的，这样我们的测试就可以可靠且容易地重复。

<!-- Kuten yksikkö- integraatiotesteissä, on myös E2E-testeissä paras ratkaisu nollata tietokanta ja mahdollisesti alustaa se sopivasti aina ennen testien suorittamista. E2E-testauksessa lisähaasteen tuo se, että testeistä ei ole mahdollista päästä suoraan käsiksi tietokantaan. -->

As with unit- and integration tests, with E2E tests it is the best to empty the database and possibly format it before the tests are run. The challenge with E2E test is, that they do not have access to the database. 
与单元测试和集成测试一样，E2E 测试最好是在测试运行之前清空数据库并尽可能格式化数据库。 E2e 测试的挑战在于，他们无法访问数据库。

<!-- Ratkaistaan ongelma luomalla backendiin testejä varten API-endpoint, jonka avulla testit voivat tarvittaessa nollata kannan. Tehdään testejä varten oma <i>router</i> -->

The solution is to create API endpoints to the backend for the test. 
解决方案是为测试创建后端的 API 端点。
We can empty the database using these endpoints. 
我们可以使用这些端点清空数据库。
Let's create a new <i>router</i> for the tests
让我们为测试创建一个新的 i 路由器 / i

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

<!-- ja lisätään se backendiin ainoastaan <i>jos sovellusta suoritetaan test-moodissa</i>: -->
!-他们不会让我们失望的，我们不会让他们失望的
and add it to the backend only <i>if the application is run on test-mode</i>:
如果应用程序在 test-mode / i 上运行，则只将其添加到后端 i:

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

<!-- eli lisäyksen jälkeen HTTP POST -operaatio backendin endpointiin <i>/api/testing/reset</i> tyhjentää tietokannan. -->

after the changes a HTTP POST request to the <i>/api/testing/reset</i> endpoint empties the database.
更改之后，对 i / api / testing / reset / i 端点的 HTTP POST 请求将清空数据库。

<!-- Backendin testejä varten muokattu koodi on kokonaisuudessaan [githubissa](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part5-1), branchissä <i>part5-1</i>. -->
!-backendin testej varten muokattu koodi on kokonaisuudessaan github https: / / fullstack-hy2020 / part3-notes-backend / tree / part5-1，branchiss i part5-1 / i. -
The modified backend code can be found from [githubissa](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part5-1) branch <i>part5-1</i>.
修改后的后端代码可以在[ github ]( https://github.com/fullstack-hy2020/part3-notes-backend/tree/part5-1)分支 i part5-1 / i 中找到。

<!-- Muutetaan nyt testien <i>beforeEach</i>-alustuslohkoa siten, että se nollaa palvelimen tietokannan aina ennen testien suorittamista. -->

Next we will change the <i>beforeEach</i> block so, that it empties the server's database before tests are run. 
接下来，我们将更改 i beforeEach / i 块，以便在运行测试之前清空服务器的数据库。

<!-- Tällä hetkellä sovelluksen käyttöliittymän kautta ei ole mahdollista luoda käyttäjiä, luodaankin testien alustuksessa testikäyttäjä suoraan backendiin. -->

Currently it is not possible to add new users trough the frontend's UI, so we add a new user to the backend from the beforeEach block. 
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

<!-- Testi tekee alustuksen aikana HTTP-pyyntöjä backendiin komennolla [cy.request](https://docs.cypress.io/api/commands/request.html).  -->

During the formatting the test does HTTP requests to the backend with [cy.request](https://docs.cypress.io/api/commands/request.html).
在对测试进行格式化时，使用[ cy.request ]( https://docs.cypress.io/api/commands/request.html )对后端进行 HTTP 请求。

<!-- Toisin kuin aiemmin, nyt testaus alkaa nyt myös backendin suhteen aina hallitusti samasta tilanteesta, eli tietokannassa on yksi käyttäjä ja ei yhtään muistiinpanoa. -->

Unlike earlier, now the testing starts with the backend in the same state every time. The backend will contain one user and no notes. 
与以前不同的是，现在每次测试都以相同的状态从后端开始。 后端将包含一个用户，没有注释。

<!-- Tehdään vielä testi, joka tarkastaa että muistiinpanojen tärkeyttä voi muuttaa.  Muutetaan ensin sovelluksen frontendia siten, että uusi muistiinpano on oletusarvoisesti epätärkeä, eli kenttä <i>important</i> saa arvon <i>false</i>: -->
——在很多测试中，joka tarkastaa ett muistiinpanojen t rkeytt voi muuttaa. muutetan ensinsovelluksen frontendia siten，ett uusi muistiinpano on oletusarvoisesti ep t ke，eli kentt i important / i saa arvon i false / i: ——
Let's add one more test for checking that we can change the importance of notes. 
让我们再添加一个检查的测试，我们可以改变注释的重要性。
First we change the frontend so that a new note is unimportant by default, or the <i>important</i> field is <i>false</i>:
首先，我们改变前面的字符，这样一个新的注释默认是不重要的，或者 i important / i 字段是 i false / i:

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

<!-- On useita eri tapoja testata asia. Seuraavassa etsitään ensin muistiinpano ja klikataan sen nappia <i>make important</i>. Tämän jälkeen tarkistetaan että muistiinpano sisältää napin <i>make not important</i>. -->
1. a)【句意】我把重要的事情放在第一位。 在我看来，这并不重要。 -->
There are multiple ways to test this. In the following example we first search for a note and click its <i>make important</i> button. Then we check that the note now contains a <i>make not important</i> button. 
有多种方法可以测试这一点。 在下面的示例中，我们首先搜索一个注释，然后单击它的 i make important / i 按钮。 然后我们检查注释现在包含一个 i make not important / i 按钮。

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

<!-- Ensimmäinen komento etsii ensin komponentin, missä on teksti <i>another note cypress</i> ja sen sisältä painikkeen <i>make important</i> ja klikkaa sitä.  -->
——安西姆在电子邮件中说: “我在电子邮件中写了一些重要的事情。”。 -->
The first command searches for a component containing the text <i>another note cypress</i>, and then for a <i>make important</i> button within it. It then clicks the button.
第一个命令搜索包含文本 i another note cypress / i 的组件，然后搜索其中的 i make important / i 按钮。 然后点击按钮。

<!-- Toinen komento varmistaa, että saman napin teksti on vaihtunut muotoon <i>make not important</i>. -->
1. 今天我要说的是，今天我要说的话并不重要
The second command checks that the text on the button has changed to <i>make not important</i>.
第二个命令检查按钮上的文本是否更改为 i make not important / i。

<!-- Testit ja frontendin tämänhetkinen koodi on kokonaisuudessaan [githubissa](https://github.com/fullstack-hy2020/part2-notes/tree/part5-9), branchissa <i>part5-9</i>. -->

The tests and the current frontend code can be found from [githubissa](https://github.com/fullstack-hy2020/part2-notes/tree/part5-9) branch <i>part5-9</i>.
测试和当前的前端代码可以从[ github ]( https://github.com/fullstack-hy2020/part2-notes/tree/part5-9)分支 i part5-9 / i 中找到。

### Failed login test
# # # 登录测试失败

<!-- Tehdään nyt testi joka varmistaa, että kirjautumisyritys epäonnistuu jos salasana on väärä. -->
——今天我们要测试一下乔卡 · 瓦尔斯塔纳，今天我们要做的就是把他放在沙拉上
Let's make a test to ensure that a login attempt fails if the password is wrong. 
让我们做一个测试，以确保登录尝试失败，如果密码是错误的。

<!-- Cypress suorittaa oletusarvoisesti aina kaikki testit, ja testien määrän kasvaessa se alkaa olla aikaavievää. Uutta testiä kehitellessä tai rikkinäistä testiä debugatessa voidaan määritellä testi komennon <i>it</i> sijaan komennolla <i>it.only</i>, jolloin Cypress suorittaa ainoastaan sen testin. Kun testi on valmiina, voidaan <i>only</i> poistaa. -->

Cypress will run all tests each time by default, and as the number of tests increases it starts to become quite time consuming. 
赛普拉斯默认情况下每次都会运行所有测试，并且随着测试数量的增加，它开始变得相当耗时。
When developing a new test or when debugging a broken test, we can define the test with <i>it.only</i> instead of <i>it</i>, so that Cypress will only run the required test.
当开发一个新的测试或者调试一个失败的测试时，我们可以用 i it.only / i 而不是 i it / i 来定义测试，这样 Cypress 就只能运行所需的测试。
When the test is working, we can remove <i>.only</i>.
当测试工作时，我们可以删除 i. only / i。

<!-- Testin ensimmäinen versio näyttää seuraavalta: -->
——证明我对你的爱: ——
First  version of our tests is as follows:
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

<!-- Testi siis varmistaa komennon [cy.contains](https://docs.cypress.io/api/commands/contains.html#Syntax) avulla, että sovellus tulostaa virheilmoituksen. -->

The test uses [cy.contains](https://docs.cypress.io/api/commands/contains.html#Syntax) to ensure that the application prints an error message. 
该测试使用[ cy.contains ]( https://docs.cypress.io/api/commands/contains.html#syntax )来确保应用程序输出错误消息。

<!-- Sovellus renderöi virheilmoituksen CSS-luokan <i>error</i> sisältävään elementtiin: -->

The application renders the error message to a component with the CSS class <i>error</i>:
应用程序将错误消息呈现给一个带有 CSS 类 i error / i 的组件:

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

<!-- Voisimmekin tarkentaa testiä varmistamaan, että virheilmoitus tulostuu nimenomaan oikeaan paikkaan, eli CSS-luokan <i>error</i> sisältävään elementtiin: -->

We could make the test ensure, that the error message is rendered to the correct component, or the component with the CSS class <i>error</i>:
我们可以让测试确保，错误消息被呈现给正确的组件，或者带有 CSS 类 i error / i 的组件:


```js
it('login fails with wrong password', function() {
  // ...

  cy.get('.error').contains('wrong credentials') // highlight-line
})
```

<!-- Eli ensin etsitään komennolla [cy.get](https://docs.cypress.io/api/commands/get.html#Syntax) CSS-luokan <i>error</i> sisältävä komponentti ja sen jälkeen varmistetaan että virheilmoitus löytyy sen sisältä. Huomaa, että [luokan CSS-selektori](https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors) alkaa pisteellä, eli luokan <i>error</i> selektori on <i>.error</i>. -->

First we use [cy.get](https://docs.cypress.io/api/commands/get.html#Syntax) to search for a component with the CSS class <i>error</i>. Then we check that the error message can be found from this component. 
首先，我们使用[ cy.get ]( https://docs.cypress.io/api/commands/get.html#syntax )来搜索带有 CSS 类 i error / i 的组件。 然后我们检查是否可以从这个组件中找到错误消息。
Note that the [CSS class selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors) starts with a full stop, so the selector for the class <i>error</i> is <i>.error</i>.
注意，[ CSS 类选择器]( https://developer.mozilla.org/en-us/docs/web/CSS/class_selectors )以句号开始，所以类 i error / i 的选择器是 i. error / i。

<!-- Voisimme tehdä saman myös käyttäen [should](https://docs.cypress.io/api/commands/should.html)-syntaksia: -->

We could do the same using the [should](https://docs.cypress.io/api/commands/should.html) syntax:
我们可以使用[应该]( https://docs.cypress.io/api/commands/should.html )语法来做同样的事情:

```js
it('login fails with wrong password', function() {
  // ...

  cy.get('.error').should('contain', 'wrong credentials') // highlight-line
})
```

<!-- Shouldin käyttö on jonkin verran "hankalampaa" kuin komennon <i>contains</i>, mutta se mahdollistaa huomattavasti monipuolisemmat testit kuin pelkän tekstisisällön perusteella toimiva <i>contains</i>.  -->

Using should is a bit trickier than using <i>contains</i>, but it allows for more diverse tests than <i>contains</i> which works based on text content only. 
使用 should 比使用 i contains / i 稍微复杂一些，但它允许比仅基于文本内容的 i contains / i 更多样化的测试。

<!-- Lista yleisimmistä shouldin kanssa käytettävistä assertioista on [täällä](https://docs.cypress.io/guides/references/assertions.html#Common-Assertions). -->

List of the most common assertions which can be used with should can be found [here](https://docs.cypress.io/guides/references/assertions.html#Common-Assertions).
最常用的断言列表可以在这里找到( https://docs.cypress.io/guides/references/assertions.html#common-assertions )。

<!-- Voimme esim. varmistaa, että virheilmoituksen väri on punainen, ja että sen ympärillä on border: -->

We can, for example, make sure that the error message is red and it has a border:
例如，我们可以确保错误消息是红色的，并且有一个边框:

```js
it('login fails with wrong password', function() {
  // ...

  cy.get('.error').should('contain', 'wrong credentials') 
  cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
  cy.get('.error').should('have.css', 'border-style', 'solid')
})
```

<!-- Värit on määriteltävä Cypressille [rgb](https://rgbcolorcode.com/color/red)-koodeina. -->

Cypress requires the colors to be given as [rgb](https://rgbcolorcode.com/color/red).
Cypress 需要将颜色设置为[ rgb ]( https://rgbcolorcode.com/color/red )。

<!-- Koska kaikki tarkastukset kohdistuvat samaan komennolla [cy.get](https://docs.cypress.io/api/commands/get.html#Syntax) haettuun elementtiin, ne voidaan ketjuttaa komennon [and](https://docs.cypress.io/api/commands/and.html) avulla: -->

Because all tests are for the same component we accessed using [cy.get](https://docs.cypress.io/api/commands/get.html#Syntax), we can chain them using [and](https://docs.cypress.io/api/commands/and.html).
因为所有测试都是针对我们使用[ cy.get ]( https://docs.cypress.io/api/commands/get.html#syntax )访问的同一个组件，所以我们可以使用[和]( https://docs.cypress.io/api/commands/and.html )链接它们。

```js
it('login fails with wrong password', function() {
  // ...

  cy.get('.error')
    .should('contain', 'wrong credentials')
    .and('have.css', 'color', 'rgb(255, 0, 0)')
    .and('have.css', 'border-style', 'solid')
})
```
<!-- Viimeistellään testi vielä siten, että se varmistaa myös, että sovellus ei renderöi onnistuneesta kirjautumista kuvaavaa tekstiä <i>'Matti Luukkainen logged in'</i>: -->

Let's finish the test so that it also checks that the application does not render the success message <i>'Matti Luukkainen logged in'</i>:
让我们完成测试，这样它还可以检查应用程序是否没有呈现成功消息 i‘ Matti Luukkainen logged in’ / i:

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

<!-- Komentoa <i>should</i> käytetään aina ketjutettuna komennon <i>get</i> (tai muun vastaavan ketjutettavissa olevan komennon) perään. Testissä käytetty <i>cy.get('html')</i> tarkoittaa käytännössä koko sovelluksen näkyvillä olevaa sisältöä. -->

<i>Should</i> should always be chained with <i>get</i> (or another chainable command).
I Should / i Should Should always be chainwith i get / i (或另一个 chainable command)。
We used <i>cy.get('html')</i> to access the whole visible content of the application. 
我们使用 i cy.get (‘ html’) / i 访问应用程序的所有可见内容。

### Bypassing the UI
绕过用户界面

<!-- Sovelluksemme testit näyttävät tällä hetkellä seuraavalta: -->

Currently we have the following tests:
目前我们有以下测试:

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

<!-- Ensin siis testataan kirjautumistoimintoa. Tämän jälkeen omassa describe-lohkossa on joukko testejä, jotka olettavat että käyttäjä on kirjaantuneena, kirjaantuminen hoidetaan alustuksen tekevän <i>beforeEach</i>-lohkon sisällä.  -->
这个词的意思是: “我们的祖先在克里斯托弗的故事中描述了一个故事
First we test logging in. Then, in their own describe block, we have a bunch of tests which expect the user to be logged in. User is logged in in the <i>beforeEach</i> block. 
首先我们测试登录。 然后，在他们自己的 describe 块中，我们有一系列测试，期望用户登录。 用户在 i beforeEach / i 块中登录。

<!-- Kuten aiemmin jo todettiin, jokainen testi suoritetaan alkutilasta, eli vaikka testi on koodissa alempana, se ei aloita samasta tilasta mihin ylempänä koodissa olevat testit ovat jääneet!   -->

As we said above, each test starts from zero! Tests do not start from the state where the previous states ended. 
正如我们上面所说的，每个测试都是从零开始的！ 测试不是从以前状态结束的状态开始的。

<!-- Cypressin dokumentaatio neuvoo meitä seuraavasti: [Fully test the login flow – but only once!](https://docs.cypress.io/guides/getting-started/testing-your-app.html#Logging-in). Eli sen sijaan että tekisimme <i>beforeEach</i>-lohkossa kirjaantumisen lomaketta käyttäen, suosittelee Cypress että kirjaantuminen tehdään [UI:n ohi](https://docs.cypress.io/guides/getting-started/testing-your-app.html#Bypassing-your-UI), tekemällä suoraan backendiin kirjaantumista vastaava HTTP-operaatio. Syynä tälle on se, että suoraan backendiin tehtynä kirjautuminen on huomattavasti nopeampi kuin lomakkeen täyttämällä.  -->
<！ -- Cypressin dokumentaatio neuvoo meit seuraavasti: [完全测试登录流程——但只有一次! ]( https://docs.cypress.io/guides/getting-started/testing-your-app.html#logging-in )。 在此之前，我们已经知道了一些关于 https://docs.Cypress.io/guides/getting-started/testing-your-app.html#bypassing-your-UI 的事情。 但是现在，科学家们发现，在这种情况下，人们不得不把这种方法应用到其他方面。 -->
The Cypress documentation gives us the following advice: [Fully test the login flow – but only once!](https://docs.cypress.io/guides/getting-started/testing-your-app.html#Logging-in). 
Cypress 文档给了我们以下建议: [完全测试登录流程——但只有一次! ]( https://docs.Cypress.io/guides/getting-started/testing-your-app.html#logging-in )。
So instead of logging in a user using the form in the <i>beforeEach</i> block, Cypress recommends that we [bypass the UI](https://docs.cypress.io/guides/getting-started/testing-your-app.html#Bypassing-your-UI) and do a HTTP request to the backend to log in. The reason for this is, that logging in with a HTTP request is much faster than filling a form. 
因此，Cypress 建议我们不要使用 i beforeEach / i 块中的表单登录用户，而是[绕过 UI ]( https://docs.Cypress.io/guides/getting-started/testing-your-app.html#bypassing-your-UI ) ，对后端执行 HTTP 请求以登录。 原因是，使用 HTTP 请求登录要比填写表单快得多。


<!-- Tilanteemme on hieman monimutkaisempi kuin Cypressin dokumentaation esimerkissä, sillä kirjautumisen yhteydessä sovelluksemme tallettaa kirjautuneen käyttäjän tiedot localStorageen. Sekin toki onnistuu. Koodi on seuraavassa -->

Our situation is a bit more complicated than in the example in the Cypress documentation, because when user logs in, our application saves their details to the localStorage.
我们的情况比 Cypress 文档中的示例要复杂一些，因为当用户登录时，我们的应用程序将其详细信息保存到 localStorage 中。
However Cypress can handle that as well. 
然而，赛普拉斯也可以处理这个问题。
The code is the following
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

<!-- Komennon [cy.request](https://docs.cypress.io/api/commands/request.html) tulokseen päästään käsiksi _then_-metodin avulla sillä sisäiseltä toteutukseltaan <i>cy.request</i> kuten muutkin Cypressin komennot ovat [eräänlaisia promiseja](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#Commands-Are-Promises). Käsittelijäfunktio tallettaa kirjautuneen käyttäjän tiedot localStorageen ja lataa sivun uudelleen. Tämän jälkeen käyttäjä on kirjautuneena sovellukseen samalla tavalla kuin jos kirjautuminen olisi tapahtunut kirjautumislomakkeen täyttämällä. -->

We can access the response to a [cy.request](https://docs.cypress.io/api/commands/request.html) with the _then_ method.  Under the hood <i>cy.request</i>, like all Cypress commands, are [promises](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#Commands-Are-Promises).
我们可以使用 then 方法访问对[ cy.request ]( https://docs.cypress.io/api/commands/request.html )的响应。 在引擎盖下面，i cy.request / i 和所有 Cypress 命令一样，都是[ promises ]( https://docs.Cypress.io/guides/core-concepts/introduction-to-Cypress.html#commands-are-promises )。
The callback function saves the details of a logged in user to localStorage, and reloads the page. 
回调函数将登录用户的详细信息保存到 localStorage，然后重新加载页面。
Now there is no difference to user logging in with the login form. 
现在，用户使用登录表单登录没有区别。

<!-- Jos ja kun sovellukselle kirjoitetaan lisää testejä, joudutaan kirjautumisen hoitavaa koodia soveltamaan useassa paikassa. Koodi kannattaakin eristää itse määritellyksi [komennoksi](https://docs.cypress.io/api/cypress-api/custom-commands.html). -->

If and when we write new tests to our application, we have to use the login code in multiple places.
如果在应用程序中编写新的测试，我们必须在多个地方使用登录代码。
We should make it a [custom command](https://docs.cypress.io/api/cypress-api/custom-commands.html).
我们应该使它成为一个[自定义命令]( https://docs.cypress.io/api/cypress-api/custom-commands.html 命令)。

<!-- Komennot määritellään tiedostoon <i>cypress/support/commands.js</i>. Kirjautumisen tekevä komento näyttää seuraavalta: -->

Custom commands are declared in <i>cypress/support/commands.js</i>.
定制命令在 i cypress / support / commands. js / i 中声明。
The code for logging in is as follows:
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

<!-- Komennon käyttö on helppoa, testi yksinkertaisuu ja selkeytyy: -->

Using our custom command is easy, and our test becomes cleaner:
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

<!-- Sama koskee oikeastaan myös uuden muistiinpanon luomista. Sitä varten on olemassa testi, joka luo muistiinpanon lomakkeen avulla. Myös muistiinpanon tärkeyden muuttamista testaavan testin <i>beforeEach</i>-alustuslohkossa luodaan muistiinpano lomakkeen avulla:  -->

The same applies to creating a new note now that we think about it. We have a test which makes a new note using the form. We also make a new note in the <i>beforeEach</i> block of the test testing changing the importance of a note: 
这同样适用于创建一个新的笔记，现在我们考虑它。 我们有一个测试，使用该表格制作一个新的笔记。 我们还在测试的 i beforeEach / i 块中做了一个新的注释，改变了注释的重要性:

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

<!-- Eristetään myös muistiinpanon lisääminen omaksi komennoksi, joka tekee lisäämisen suoraan HTTP POST:lla: -->

Let's make a new custom command for making a new note. The command will make a new note with a HTTP POST request: 
让我们为制作新笔记创建一个新的自定义命令。 该命令将使用 HTTP POST 请求生成一个新的记录:

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

<!-- Komennon suoritus edellyttää, että käyttäjä on kirjaantuneena sovelluksessa ja käyttäjän tiedot talletettuna sovelluksen localStorageen. -->

The command expects user to be logged in and the user's details to be saved to localStorage. 
该命令期望用户登录，并将用户的详细信息保存到 localStorage。

<!-- Testin alustuslohko yksinkertaistuu seuraavasti: -->

Now the formatting block becomes:
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

<!-- Testit ja frontendin koodi on kokonaisuudessaan [githubissa](https://github.com/fullstack-hy2020/part2-notes/tree/part5-10), branchissa <i>part5-10</i>. -->

The tests and the frontend code can be found from [githubissa](https://github.com/fullstack-hy2020/part2-notes/tree/part5-10) branch <i>part5-10</i>.
测试和前端代码可以从[ github ]( https://github.com/fullstack-hy2020/part2-notes/tree/part5-10)分支 i part5-10 / i 中找到。

### Changing the importance of a note
# # 改变纸条的重要性

<!-- Tarkastellaan vielä aiemmin tekemäämme testiä, joka varmistaa että muistiinpanon tärkeyttä on mahdollista muuttaa. Muutetaan testin alustuslohkoa siten, että se luo yhden sijaan kolme muistiinpanoa: -->

Lastly let's take a look at the test we did for changing the importance of a note. 
最后，让我们看一下我们为改变笔记的重要性所做的测试。
First we'll change the formatting block so that it creates three notes instead of one:
首先我们要改变格式块，让它创建三个注释而不是一个:

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

<!-- Miten komento [cy.contains](https://docs.cypress.io/api/commands/contains.html) tarkalleen ottaen toimii? -->

How does the [cy.contains](https://docs.cypress.io/api/commands/contains.html) command actually work?
(cy.contains)命令实际上是如何工作的？

<!-- Kun klikkaamme komentoa _cy.contains('second note')_ Cypressin [test runnerista](https://docs.cypress.io/guides/core-concepts/test-runner.htm) nähdään, että komento löytää elementin, jonka sisällä on teksti <i>second note</i>: -->
! kun klikkaamme kmentoa cy.contains’ second note’ cypressin test runnerista https: / / docs.cypress.io / guides / core-concepts / test-runner.htm n hd n，ett komento l yt elementin，jonka sis ll on teksti i second note / i: --
When we click the _cy.contains('second note')_ command in Cypress [Test Runner](https://docs.cypress.io/guides/core-concepts/test-runner.html), we see that the command searches for the element containing the text <i>second note</i>:
当我们在 Cypress [ Test Runner ]中单击 cy.contains (‘ second note’)命令时，我们会看到该命令搜索包含文本 i second note / i 的元素:

![](../../images/5/34ea.png)



<!-- Klikkaamalla seuraavaa riviä _.contains('make important')_, nähdään että löydetään nimenomaan  -->

By clicking the next line _.contains('make important')_ we see that the test uses 
通过单击下一行. contains (‘ make important’) ，我们可以看到测试使用
<!-- <i>second note</i>:a vastaava tärkeyden muutoksen tekevä nappi: -->

the 'make important' button corresponding to <i>second note</i>:
“ make important”按钮对应于 i second note / i:

![](../../images/5/35ea.png)


<!-- Peräkkäin ketjutettuna toisena oleva <i>contains</i>-komento siis <i>jatkaa</i> hakua ensimmäisen komennon löytämän komponentin sisältä. -->
——每公斤巧克力中含有我的心理现象，我的心理现象就是我的心理现象，我的心理现象就是我的心理现象。——
When chained, the second <i>contains</i> command <i>continues</i> the search from within the component found by the first command. 
链接时，第二个 i contains / i 命令 i 会从第一个命令找到的组件中继续 / i 搜索。

<!-- Jos emme ketjuttaisi komentoja, eli olisimme kirjoittaneet  -->

If we had not chained the commands, and instead wrote
如果我们没有把这些命令串起来，而是把它们写下来

```js
cy.contains('second note')
cy.contains('make important').click()
```

<!-- tulos olisi ollut aivan erilainen, toinen rivi painaisi väärän muistiinpanon nappia:  -->
!-tulos ollisi ollut aivan erilainen，toinen rivi painaisi v n muistiinpanon napia:-
the result would have been totally different. The second line of the test would click the button of a wrong note:
结果会完全不同。 测试的第二行会点击一个错误注释的按钮:

![](../../images/5/36ea.png)


<!-- Testejä tehdessä kannattaa siis ehdottomasti varmistaa test runnerista, että testit etsivät niitä elementtejä, joita niiden on tarkoitus tutkia! -->

When coding tests, you should check in the test runner that the tests use the right components!
在编写测试代码时，您应该检查测试运行程序是否使用了正确的组件！

<!-- Muutetaan komponenttia _Note_ siten, että muistiinpanon teksti renderöitään <i>span</i>-komponentin sisälle -->

Let's change the _Note_ component so that the text of the note is rendered to a <i>span</i>.
让我们更改 Note 组件，以便将 Note 的文本呈现为 i span / i。

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

<!-- Testit hajoavat! Kuten test runner paljastaa, komento _cy.contains('second note')_ palauttaakin nyt ainoastaan tekstin sisältävän komponentin, ja nappi on sen ulkopuolella: -->

Our tests break! As the test runner reveals,  _cy.contains('second note')_ now returns the component containing the text, and the button is not in it. 
我们的测试结束了！ 正如测试运行程序所揭示的，cy.contains (‘ second note’)现在返回包含文本的组件，而按钮不在其中。

![](../../images/5/37ea.png)


<!-- Eräs tapa korjata ongelma on seuraavassa: -->

One way to fix this is the following:
解决这个问题的方法如下:

```js
it('other of those can be made important', function () {
  cy.contains('second note').parent().find('button').click()
  cy.contains('second note').parent().find('button')
    .should('contain', 'make not important')
})
```

<!-- Ensimmäisellä rivillä etsitään komennon [parent](https://docs.cypress.io/api/commands/parent.htm) tekstin <i>second note</i> sisältävän elementin vanhemman alla oleva nappi ja painetaan sitä. Toinen rivi varmistaa, että napin teksti muuttuu. -->

In the first line, we use the [parent](https://docs.cypress.io/api/commands/parent.htm) command to access the parent element of the element containing <i>second note</i> and find the button from within it. 
在第一行中，我们使用[ parent ]( https://docs.cypress.io/api/commands/parent.htm )命令来访问包含 i second note / i 的元素的父元素，并在其中找到按钮。
Then we click the button, and check that the text on it changes. 
然后我们点击按钮，检查上面的文本是否改变。

<!-- Huomaa, että napin etsimiseen käytetään komentoa [find](https://docs.cypress.io/api/commands/find.html#Syntax). Komento [cy.get](https://docs.cypress.io/api/commands/get.html) ei sovellu tähän tilanteeseen, sillä se etsii elementtejä aina <i>koko</i> sivulta ja palauttaisi nyt kaikki sovelluksen viisi nappia. -->

Note that we use the command [find](https://docs.cypress.io/api/commands/find.html#Syntax) to search for the button. We cannot use [cy.get](https://docs.cypress.io/api/commands/get.html) here, because it always searches from the <i>whole</i> page and would return all 5 buttons on the page. 
注意，我们使用命令[ find ]( https://docs.cypress.io/api/commands/find.html#syntax )来搜索按钮。 我们不能在这里使用[ cy.get ]( https://docs.cypress.io/api/commands/get.html ) ，因为它总是从 i / i 页面进行搜索，并返回页面上的所有5个按钮。

<!-- Testissä on ikävästi copypastea, rivien alku eli napin etsivä koodi on sama.  -->

Unfortunately, we have some copypaste in the tests now, because the code for searching for the right button is always the same. 
不幸的是，我们现在在测试中有一些复制 / 粘贴，因为搜索右键的代码总是相同的。
<!-- Tälläisissä tilanteissa on mahdollista hyödyntää komentoa [as](https://docs.cypress.io/api/commands/as.html):  -->

In these kinds of situations, it is possible to use the [as](https://docs.cypress.io/api/commands/as.html) command:
在这种情况下，可以使用[ as ]( https://docs.cypress.io/api/commands/as.html )命令:

```js
it.only('other of those can be made important', function () {
  cy.contains('second note').parent().find('button').as('theButton')
  cy.get('@theButton').click()
  cy.get('@theButton').should('contain', 'make not important')
})
```

<!-- Nyt ensimmäinen rivi etsii oikean napin, ja tallentaa sen komennon <i>as</i> avulla nimellä <i>theButton</i>. Seuraavat rivit pääsevät nimettyyn elementtiin käsiksi komennolla <i>cy.get('@theButton')</i>. -->
(咒语)(咒语)(咒语)。 修拉瓦特提出了另一个问题，那就是我们知道了我们的存在。 get (’@the button’) / i。 -->
Now the first line finds the right button, and uses <i>as</i> to save it as <i>theButton</i>. The followings lines can use the named element with <i>cy.get('@theButton')</i>.
现在第一行找到右边的按钮，并使用 i 作为 / i 保存为 i 的 button / i。 下面的代码行可以使用命名元素和 i cy.get (’@thebutton’) / i。

### Running and debugging the tests
正在运行和调试测试

<!-- Vielä osan lopuksi muutamia huomioita Cypressin toimintaperiaatteesta sekä testien debuggaamisesta. -->

Finally, some notes on how Cypress works and debugging your tests.
最后，还有一些关于 Cypress 如何工作和调试测试的注释。

<!-- Cypressissä testien kirjoitusasu antaa vaikutelman, että testit ovat normaalia javascript-koodia, ja että voisimme esim. yrittää seuraavaa: -->

The form of the Cypress tests gives the impression, that the tests are normal JavaScript code, and we could for example try this:
Cypress 测试的形式给人的印象是，测试是正常的 JavaScript 代码，我们可以试试这个:

```js
const button = cy.contains('login')
button.click()
debugger() 
cy.contains('logout').click()
```

<!-- Näin kirjoitettu koodi ei kuitenkaan toimi. Kun Cypress suorittaa testin, se lisää jokaisen _cy_-komennon suoroitusjonoon. Kun testimetodin koodi on suoritettu loppuun, suorittaa Cypress yksi kerrallaan suoritusjonoon lisätyt _cy_-komennot. -->
——在 kirjoitettu koodi ei kuitenkaan toimi. kun cypress suorittaa testin se jokaisen cy-komennon suoroitusjonon.kun testin koodi on suoritettu loppun，suorittaa cypress yksi kerlaan suoritoon lis tyt-komentoon ——
This won't work however. When Cypress runs a test, it adds each _cy_ command to an execution queue. 
但是这不起作用，当 Cypress 运行测试时，它会将每个 cy 命令添加到一个执行队列中。
When the code of the test method has been executed, Cypres will execute each command in the queue one by one. 
当执行测试方法的代码时，Cypres 将逐个执行队列中的每个命令。

<!-- Cypressin komennot palauttavat aina _undefined_, eli yllä olevassa koodissa komento _button.click()_ aiheuttaisi virheen ja yritys käynnistää debuggeri ei pysäyttäisi koodia Cypress-komentojen suorituksen välissä, vaan jo ennen kuin yhtään Cypress-komentoa olisi suoritettu. -->

Cypress commands always return _undefined_, so _button.click()_ in the above code would cause an error. An attempt to start the debugger would not stop the code between executing the commands, but before any commands have been executed. 
Cypress 命令总是返回未定义的值，因此上面代码中的 button.click ()会导致错误。 试图启动调试器不会在执行命令之间、但在执行任何命令之前停止代码。

<!-- Cypress-komennot ovat <i>promisen kaltaisia</i>, joten jos niiden palauttamia arvoja halutaan käsitellä, se tulee tehdä komennon [then](https://docs.cypress.io/api/commands/then.html) avulla. Esim. seuraava testi tulostaisi sovelluksen <i>kaikkien</i> nappien lukumäärän ja klikkaisi napeista ensimmäistä: -->

Cypress commands are <i>like promises</i>, so if we want to access their return values, we have to do it using the [then](https://docs.cypress.io/api/commands/then.html) command. 
Cypress 命令是 i like promises / i，所以如果我们想访问它们的返回值，我们必须使用[ then ]( https://docs.Cypress.io/api/commands/then.html )命令。
For example, the following test would print the number of buttons in the application, and click the first button: 
例如，下面的测试将打印应用程序中的按钮数，然后单击第一个按钮:

```js
it('then example', function() {
  cy.get('button').then( buttons => {
    console.log('number of buttons', buttons.length)
    cy.wrap(buttons[0]).click()
  })
})
```

<!-- Myös testien suorituksen pysäyttäminen debuggeriin on [mahdollista](https://docs.cypress.io/api/commands/debug.html). Debuggeri käynnistyy vain jos Cypress test runnerin developer konsoli on auki.  -->

Stopping the test execution with the debugger is [possible](https://docs.cypress.io/api/commands/debug.html). The debugger starts only if Cypress test runner's developer console is open. 
使用调试器停止测试执行是[可能的]( https://docs.cypress.io/api/commands/debug.html )。 只有当 Cypress 测试运行程序的开发人员控制台打开时，调试器才会启动。

<!-- Developer konsoli on monin tavoin hyödyllinen testejä debugatessa. Network-tabilla näkyvät testattavan sovelluksen tekemät HTTP-pyynnöt, ja console-välilehti kertoo testin komentoihin liittyviä tietoja: -->

The developer console is all sorts of useful when debugging your tests. 
开发人员控制台在调试测试时非常有用。
You can see the HTTP requests done by the tests on the Network tab, and the console tab will show you information about your tests:
你可以在 Network 选项卡上看到测试完成的 HTTP 请求，控制台选项卡会显示关于测试的信息:

![](../../images/5/38ea.png)


<!-- Olemme toistaiseksi suorittaneet Cypress-testejä ainoastaan graafisen test runnerin kautta. Testit on luonnollisesti mahdollista suorittaa myös [komentoriviltä](https://docs.cypress.io/guides/guides/command-line.html). Lisätään vielä sovellukselle npm-skripti tätä tarkoitusta varten -->

So far we have run our Cypress tests using the graphical test runner.
到目前为止，我们已经使用图形化的测试运行了 Cypress 测试。
It is also possible to run them [from the command line](https://docs.cypress.io/guides/guides/command-line.html). We just have to add an npm script for it:
也可以运行它们[从命令行]( https://docs.cypress.io/guides/guides/command-line.html )。 我们只需要为它添加一个 npm 脚本:

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

<!-- Nyt siis voimme suorittaa Cypress-testit komentoriviltä komennolla <i>npm run test:e2e</i> -->

Now we can run our tests from the command line with the command <i>npm run test:e2e</i>
现在，我们可以使用命令 i npm run test: e2e / i 从命令行运行测试

![](../../images/5/39ea.png)


<!-- Huomaa, että testien suorituksesta tallentuu video hakemistoon <i>cypress/videos/</i>, hakemisto lienee syytä gitignoroida. -->

Note that video of the test execution will be saved to <i>cypress/videos/</i>, so you should propably git ignore this directory. 
注意，测试执行的视频将被保存到 i cypress / videos / / i 中，因此您可能应该忽略这个目录。

<!-- Testien ja frontendin koodin lopullinen versio on kokonaisuudessaan [githubissa](https://github.com/fullstack-hy2020/part2-notes/tree/part5-11), branchissa <i>part5-11</i>. -->

The frontend- and the test code can be found from [github](https://github.com/fullstack-hy2020/part2-notes/tree/part5-11) branch <i>part5-11</i>.
前端和测试代码可以在[ github ]( https://github.com/fullstack-hy2020/part2-notes/tree/part5-11)分支 i part5-11 / i 中找到。

</div>
/ div

<div class="tasks">
Div 类”任务”

### Exercises 5.17.-5.22.
练习5.17-5.22。

<!-- Tehdään osan lopuksi muutamia E2E-testejä blogisovellukseen. Ylläolevan materiaalin pitäisi riittää ainakin suurimmaksi osaksi tehtävien tekemiseen. Cypressin [dokumentaatiota](https://docs.cypress.io/guides/overview/why-cypress.html#In-a-nutshell) kannattaa ehdottomasti myös lueskella, kyseessä on ehkä paras dokumentaatio, mitä olen koskaan open source -projektissa nähnyt.  -->
<！ -- tehd n osan lopuksi muutamia e2e-testej blogisovellukseen. 你们所有的材料都在这里被发现了。 ( https://docs.cypress.io/guides/overview/why-cypress.html#in-a-nutshell ) kannattaa ehtoasti my s lueskella，kyseess on ehk paras dokumentaatio，mit olen koskaan open source-projektissa n hnyt.   -->
In the last exercises of this part we will do some E2E tests for our blog application. 
在这一部分的最后练习中，我们将为我们的博客应用程序做一些 E2E 测试。
The material of this part should be enough to complete the exercises. 
这部分的材料应该足以完成这些练习。
You should absolutely also check out the Cypress [documentation](https://docs.cypress.io/guides/overview/why-cypress.html#In-a-nutshell). It is propably the best documentation I have ever seen for an open source project. 
你绝对应该看看 Cypress [ documentation ]( https://docs.Cypress.io/guides/overview/why-Cypress.html#in-a-nutshell 文档)。 这可能是我见过的最好的开源项目文档。

<!-- Erityisesti kannattaa lukea luku [Introduction to Cypress](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#Cypress-Can-Be-Simple-Sometimes), joka toteaa -->
! erityisesti kannattaa luku cypress https: / / docs.cypress.io / guides / core-concepts / introduction-to-cypress. html # cypress-can-be-simple-sometimes，joka toteaa-
I especially recommend reading [Introduction to Cypress](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#Cypress-Can-Be-Simple-Sometimes), which states
我特别推荐阅读《柏树简介》( https://docs.Cypress.io/guides/core-concepts/Introduction-to-Cypress.html#Cypress-can-be-simple-sometimes )

> <i>This is the single most important guide for understanding how to test with Cypress. Read it. Understand it.</i>
这是了解如何使用柏树进行测试的最重要的指南。读一读，理解一下

#### 5.17: bloglist end to end testing, step1
5.17: bloglist end to end testing，step1

<!-- Konfiguroi Cypress projektiisi. Tee testi, joka varmistaa, että sovellus näyttää oletusarvoisesati kirjautumislomakkeen. -->

Configure Cypress to your project. Make a test for checking that the application displays the login form by default.
在项目中配置 Cypress。做一个测试，检查应用程序是否默认显示登录表单。

<!-- Testin rungon tulee olla seuraavanlainen -->

The structure of the test must be as follows
测试的结构必须如下

```js 
describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    cy.visit('http://localhost:3000')
  })

  it('Login from is shown', function() {
    // ...
  })
})
```

<!-- Testin <i>beforeEach</i>-alustuslohkon tulee nollata tietokannan tilanne esim.  -->

The <i>beforeEach</i> formatting blog must empty the database using for example the method we used in the [material](/osa5/end_to_end_testaus#tietokannan-tilan-kontrollointi).
格式化博客的 i beforeEach / i 必须清空数据库，例如使用[ material ](/ osa5 / end to end testaus # tokannan-tilan-kontrollointi)中使用的方法。


#### 5.18: bloglist end to end testing, step2
5.18: bloglist end to end testing，step2

<!-- Tee testit kirjautumiselle, testaa sekä onnistunut että epäonnistunut kirjautuminen. -->

Make tests for logging in. Test both successful and unsuccessful log in attempts. 
对登录进行测试。测试成功和失败的登录尝试。
<!-- Luo testejä varten käyttäjä <i>beforeEach</i>-lohkossa.  -->

Make a new user in the <i>beforeEach</i> block for the tests.
在 i beforeEach / i 块中为测试创建一个新用户。

<!-- Testien runko laajenee seuraavasti -->

The test structure extends like so
测试结构是这样扩展的

```js 
describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    // create here a user to backend
    cy.visit('http://localhost:3000')
  })

  it('Login from is shown', function() {
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

<!-- <i>Vapaaehtoinen bonustehtävä:</i> varmista, että epäonnistuneeseen kirjautumiseen liittyvä notifikaatio näytetään punaisella.  -->
-- i Vapaaehtoinen bonusteht / i varmista，ett ep onnistuneeseen kirjiseen liittyv notiatio n punaisella
<i>Optional bonus exercise</i>: Check that the notification shown with unsuccessful login is displayed red. 
I 可选的奖励练习 / i: 检查显示未成功登入的通知是否显示为红色。

#### 5.19: bloglist end to end testing, step3
5.19: bloglist end to end testing，step3

<!-- Tee testi, joka varmistaa, että kirjaantunut käyttäjä pystyy luomaan blogin. Testin runko voi näyttää seuraavalta -->
-- t testi，joka varmistaga，ett kirjaantunut k ytt j pystyy luomaan blogin.testn runko voi n ytt seuraavalta -- 
Make a test which checks, that a logged in user can create a new blog. 
做一个测试，检查登录用户是否可以创建一个新的博客。
The structure of the test could be as follows
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

<!-- Testin tulee varmistaa, että luotu blogi tulee näkyville blogien listalle. -->

The test has to ensure, that a new blog is added to the list of all blogs. 
这个测试必须确保，一个新的博客被添加到所有的博客列表中。

#### 5.20: bloglist end to end testing, step4
5.20: bloglist end to end testing，step4

<!-- Tee testi, joka varmistaa, että blogia voi likettää. -->

Make a test which checks that user can like a blog. 
做一个测试，检查用户是否喜欢博客。

#### 5.21: bloglist end to end testing, step5
5.21: bloglist end to end testing，step5

<!-- Tee testi, joka varmistaa, että blogin lisännyt käyttäjä voi poistaa blogin. -->

Make a test for ensuring, that the user who created a blog can delete it. 
做一个测试来确保，创建博客的用户可以删除它。

<!-- <i>Vapaaehtoinen bonustehtävä:</i> varmista myös että poisto ei onnistu muilta kuin blogin lisänneeltä käyttäjältä. -->

<i>Optional bonus exercise:</i> also check that other users cannot delete the blog. 
I 可选的奖励练习: / 我还检查其他用户不能删除的博客。

#### 5.22: bloglist end end testing, step 6
5.22: bloglist end testing，step 6

Make a test which checks, that the blogs are ordered according to likes with the blog with the most likes being first. 
先做一个检查，看看博客是否按照喜好排序，以最喜欢的博客为先。

This exercise might be a bit trickier. One solution is to find all of the blogs and then compare them in the callback function of a [then](https://docs.cypress.io/api/commands/then.html#DOM-element) command. 
这项工作可能有点棘手。 一个解决方案是找到所有的博客，然后在[ then ]( https://docs.cypress.io/api/commands/then.html#dom-element )命令的回调函数中对它们进行比较。

This was the last exercise of this part, and its time to push your code to github and mark the exercises you completed in the [exercise submission system](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).
这是本部分的最后一个练习，是时候将您的代码推送到 github，并标记您在[练习提交系统](exercise submission system)中完成的练习 https://studies.cs.helsinki.fi/stats/courses/fullstackopen。


</div>

