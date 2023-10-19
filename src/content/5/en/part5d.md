---
mainImage: ../../../images/part-5.svg
part: 5
letter: d
lang: en
---

<div class="content">

So far we have tested the backend as a whole on an API level using integration tests and tested some frontend components using unit tests.

Next, we will look into one way to test the [system as a whole](https://en.wikipedia.org/wiki/System_testing) using <i>End to End</i> (E2E) tests.

We can do E2E testing of a web application using a browser and a testing library. There are multiple libraries available. One example is [Selenium](http://www.seleniumhq.org/), which can be used with almost any browser.
Another browser option is so-called [headless browsers](https://en.wikipedia.org/wiki/Headless_browser), which are browsers with no graphical user interface.
For example, Chrome can be used in headless mode.

E2E tests are potentially the most useful category of tests because they test the system through the same interface as real users use.

They do have some drawbacks too. Configuring E2E tests is more challenging than unit or integration tests. They also tend to be quite slow, and with a large system, their execution time can be minutes or even hours. This is bad for development because during coding it is beneficial to be able to run tests as often as possible in case of code [regressions](https://en.wikipedia.org/wiki/Regression_testing).

E2E tests can also be [flaky](https://hackernoon.com/flaky-tests-a-war-that-never-ends-9aa32fdef359).
Some tests might pass one time and fail another, even if the code does not change at all.

### Cypress

E2E library [Cypress](https://www.cypress.io/) has become popular within the last year. Cypress is exceptionally easy to use, and when compared to Selenium, for example, it requires a lot less hassle and headache.
Its operating principle is radically different than most E2E testing libraries because Cypress tests are run completely within the browser.
Other libraries run the tests in a Node process, which is connected to the browser through an API.

Let's make some end-to-end tests for our note application.

We begin by installing Cypress to <i>the frontend</i> as a development dependency

```js
npm install --save-dev cypress
```

and by adding an npm-script to run it:

```js
{
  // ...
  "scripts": {
    "dev": "vite --host",  // highlight-line
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "server": "json-server -p3001 --watch db.json",
    "test": "jest",
    "cypress:open": "cypress open"  // highlight-line
  },
  // ...
}
```

We also made a small change to the script that starts the application, without the change Cypress can not access the app.

Unlike the frontend's unit tests, Cypress tests can be in the frontend or the backend repository, or even in their separate repository.

The tests require the tested system to be running. Unlike our backend integration tests, Cypress tests <i>do not start</i> the system when they are run.

Let's add an npm script to <i>the backend</i> which starts it in test mode, or so that <i>NODE\_ENV</i> is <i>test</i>.

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

**NB** To get Cypress working with WSL2 one might need to do some additional configuring first. These two [links](https://docs.cypress.io/guides/getting-started/installing-cypress#Windows-Subsystem-for-Linux) are great places to [start](https://nickymeuleman.netlify.app/blog/gui-on-wsl2-cypress).
  
When both the backend and frontend are running, we can start Cypress with the command

```js
npm run cypress:open
```

Cypress asks what type of tests we are doing. Let us answer "E2E Testing":

![cypress arrow towards e2e testing option](../../images/5/51new.png)

Next a browser is selected (e.g. Chrome) and then we click "Create new spec":

![create new spec with arrow pointing towards it](../../images/5/52new.png)

Let us create the test file <i>cypress/e2e/note\_app.cy.js</i>:

![cypress with path cypress/e2e/note_app.cy.js](../../images/5/53new.png)

We could edit the tests in Cypress but let us rather use VS Code:

![vscode showing edits of test and cypress showing spec added](../../images/5/54new.png)

We can now close the edit view of Cypress.

Let us change the test content as follows:

```js
describe('Note app', function() {
  it('front page can be opened', function() {
    cy.visit('http://localhost:5173')
    cy.contains('Notes')
    cy.contains('Note app, Department of Computer Science, University of Helsinki 2023')
  })
})
```

The test is run by clicking the test in the Cypress:

Running the test shows how the application behaves as the test is run:

![cypress showing automation of note test](../../images/5/56new.png)

The structure of the test should look familiar. They use <i>describe</i> blocks to group different test cases, just like Jest. The test cases have been defined with the <i>it</i> method. Cypress borrowed these parts from the [Mocha](https://mochajs.org/) testing library it uses under the hood.

[cy.visit](https://docs.cypress.io/api/commands/visit.html) and [cy.contains](https://docs.cypress.io/api/commands/contains.html) are Cypress commands, and their purpose is quite obvious.
[cy.visit](https://docs.cypress.io/api/commands/visit.html) opens the web address given to it as a parameter in the browser used by the test. [cy.contains](https://docs.cypress.io/api/commands/contains.html) searches for the string it received as a parameter from the page.

We could have declared the test using an arrow function

```js
describe('Note app', () => { // highlight-line
  it('front page can be opened', () => { // highlight-line
    cy.visit('http://localhost:5173')
    cy.contains('Notes')
    cy.contains('Note app, Department of Computer Science, University of Helsinki 2023')
  })
})
```

However, Mocha [recommends](https://mochajs.org/#arrow-functions) that arrow functions are not used, because they might cause some issues in certain situations.

If <i>cy.contains</i> does not find the text it is searching for, the test does not pass.  So if we extend our test like so

```js
describe('Note app', function() {
  it('front page can be opened',  function() {
    cy.visit('http://localhost:5173')
    cy.contains('Notes')
    cy.contains('Note app, Department of Computer Science, University of Helsinki 2023')
  })

// highlight-start
  it('front page contains random text', function() {
    cy.visit('http://localhost:5173')
    cy.contains('wtf is this app?')
  })
// highlight-end
})
```

the test fails

![cypress showing failure expecting to find wtf but no](../../images/5/57new.png)

Let's remove the failing code from the test.

The variable _cy_ our tests use gives us a nasty Eslint error

![vscode screenshot showing cy is not defined](../../images/5/58new.png)

We can get rid of it by installing [eslint-plugin-cypress](https://github.com/cypress-io/eslint-plugin-cypress) as a development dependency

```js
npm install eslint-plugin-cypress --save-dev
```

and changing the configuration in <i>.eslintrc.cjs</i> like so:

```js
module.exports = {
  "env": {
    browser: true,
    es2020: true,
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

Let's extend our tests so that the test tries to log in to our application.
We assume our backend contains a user with the username <i>mluukkai</i> and password <i>salainen</i>.

The test begins by opening the login form.

```js
describe('Note app',  function() {
  // ...

  it('login form can be opened', function() {
    cy.visit('http://localhost:5173')
    cy.contains('log in').click()
  })
})
```

The test first searches for the login button by its text and clicks the button with the command [cy.click](https://docs.cypress.io/api/commands/click.html#Syntax).

Both of our tests begin the same way, by opening the page <i><http://localhost:5173></i>, so we should
separate the shared part into a <i>beforeEach</i> block run before each test:

```js
describe('Note app', function() {
  // highlight-start
  beforeEach(function() {
    cy.visit('http://localhost:5173')
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

The login field contains two <i>input</i> fields, which the test should write into.

The [cy.get](https://docs.cypress.io/api/commands/get.html#Syntax) command allows for searching elements by CSS selectors.

We can access the first and the last input field on the page, and write to them with the command [cy.type](https://docs.cypress.io/api/commands/type.html#Syntax) like so:

```js
it('user can login', function () {
  cy.contains('log in').click()
  cy.get('input:first').type('mluukkai')
  cy.get('input:last').type('salainen')
})  
```

The test works. The problem is if we later add more input fields, the test will break because it expects the fields it needs to be the first and the last on the page.

It would be better to give our inputs unique <i>ids</i> and use those to find them.
We change our login form like so:

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

We also added an id to our submit button so we can access it in our tests.

The test becomes:

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

The last row ensures that the login was successful.

Note that the CSS [id-selector](https://developer.mozilla.org/en-US/docs/Web/CSS/ID_selectors) is #, so if we want to search for an element with the id <i>username</i> the CSS selector is <i>#username</i>.

Please note that passing the test at this stage requires that there is a user in the test database of the backend environment whose username is <i>mluukkai</i> and the password is <i>salainen</i>. Create a user if needed!

### Testing new note form

Let's next add test methods to test the "new note" functionality:

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

The test has been defined in its own <i>describe</i> block.
Only logged-in users can create new notes, so we added logging in to the application to a <i>beforeEach</i> block.

The test trusts that when creating a new note the page contains only one input, so it searches for it like so:

```js
cy.get('input')
```

If the page contained more inputs, the test would break

![cypress error - cy.type can only be called on a single element](../../images/5/31x.png)

Due to this problem, it would again be better to give the input an <i>id</i> and search for the element by its id.

The structure of the tests looks like so:

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

Cypress runs the tests in the order they are in the code. So first it runs <i>user can log in</i>, where the user logs in. Then cypress will run <i>a new note can be created</i> for which a <i>beforeEach</i> block logs in as well.
Why do this? Isn't the user logged in after the first test?
No, because <i>each</i> test starts from zero as far as the browser is concerned.
All changes to the browser's state are reversed after each test.

### Controlling the state of the database

If the tests need to be able to modify the server's database, the situation immediately becomes more complicated. Ideally, the server's database should be the same each time we run the tests, so our tests can be reliably and easily repeatable.

As with unit and integration tests, with E2E tests it is best to empty the database and possibly format it before the tests are run. The challenge with E2E tests is that they do not have access to the database.

The solution is to create API endpoints for the backend tests.
We can empty the database using these endpoints.
Let's create a new router for the tests inside the <i>controllers</i> folder, in the <i>testing.js</i> file

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

and add it to the backend only <i>if the application is run in test-mode</i>:

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

After the changes, an HTTP POST request to the <i>/api/testing/reset</i> endpoint empties the database. Make sure your backend is running in test mode by starting it with this command (previously configured in the package.json file):

```js
  npm run start:test
```

The modified backend code can be found on the [GitHub](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part5-1) branch <i>part5-1</i>.

Next, we will change the <i>beforeEach</i> block so that it empties the server's database before tests are run.

Currently, it is not possible to add new users through the frontend's UI, so we add a new user to the backend from the beforeEach block.

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
    cy.visit('http://localhost:5173')
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

During the formatting, the test does HTTP requests to the backend with [cy.request](https://docs.cypress.io/api/commands/request.html).

Unlike earlier, now the testing starts with the backend in the same state every time. The backend will contain one user and no notes.

Let's add one more test for checking that we can change the importance of notes.

A while ago we changed the frontend so that a new note is important by default, or the <i>important</i> field is <i>true</i>:

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

There are multiple ways to test this. In the following example, we first search for a note and click its <i>make not important</i> button. Then we check that the note now contains a <i>make important</i> button.

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

The first command searches for a component containing the text <i>another note cypress</i>, and then for a <i>make not important</i> button within it. It then clicks the button.

The second command checks that the text on the button has changed to <i>make important</i>.

The tests and the current frontend code can be found on the [GitHub](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-9) branch <i>part5-9</i>.

### Failed login test

Let's make a test to ensure that a login attempt fails if the password is wrong.

Cypress will run all tests each time by default, and as the number of tests increases, it starts to become quite time-consuming.
When developing a new test or when debugging a broken test, we can define the test with <i>it.only</i> instead of <i>it</i>, so that Cypress will only run the required test.
When the test is working, we can remove <i>.only</i>.

First version of our tests is as follows:

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

The test uses [cy.contains](https://docs.cypress.io/api/commands/contains.html#Syntax) to ensure that the application prints an error message.

The application renders the error message to a component with the CSS class <i>error</i>:

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

We could make the test ensure that the error message is rendered to the correct component, that is, the component with the CSS class <i>error</i>:

```js
it('login fails with wrong password', function() {
  // ...

  cy.get('.error').contains('wrong credentials') // highlight-line
})
```

First, we use [cy.get](https://docs.cypress.io/api/commands/get.html#Syntax) to search for a component with the CSS class <i>error</i>. Then we check that the error message can be found from this component.
Note that the [CSS class selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors) starts with a full stop, so the selector for the class <i>error</i> is <i>.error</i>.

We could do the same using the [should](https://docs.cypress.io/api/commands/should.html) syntax:

```js
it('login fails with wrong password', function() {
  // ...

  cy.get('.error').should('contain', 'wrong credentials') // highlight-line
})
```

Using should is a bit trickier than using <i>contains</i>, but it allows for more diverse tests than <i>contains</i> which works based on text content only.

A list of the most common assertions which can be used with _should_ can be found [here](https://docs.cypress.io/guides/references/assertions.html#Common-Assertions).

We can, for example, make sure that the error message is red and it has a border:

```js
it('login fails with wrong password', function() {
  // ...

  cy.get('.error').should('contain', 'wrong credentials') 
  cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
  cy.get('.error').should('have.css', 'border-style', 'solid')
})
```

Cypress requires the colors to be given as [rgb](https://rgbcolorcode.com/color/red).

Because all tests are for the same component we accessed using [cy.get](https://docs.cypress.io/api/commands/get.html#Syntax), we can chain them using [and](https://docs.cypress.io/api/commands/and.html).

```js
it('login fails with wrong password', function() {
  // ...

  cy.get('.error')
    .should('contain', 'wrong credentials')
    .and('have.css', 'color', 'rgb(255, 0, 0)')
    .and('have.css', 'border-style', 'solid')
})
```

Let's finish the test so that it also checks that the application does not render the success message <i>'Matti Luukkainen logged in'</i>:

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

The command <i>should</i> is most often used by chaining it after the command <i>get</i> (or another similar command that can be chained). The <i>cy.get('html')</i> used in the test practically means the visible content of the entire application.

We would also check the same by chaining the command <i>contains</i> with the command <i>should</i> with a slightly different parameter:

```js
cy.contains('Matti Luukkainen logged in').should('not.exist')
```

**NOTE:** Some CSS properties [behave differently on Firefox](https://github.com/cypress-io/cypress/issues/9349). If you run the tests with Firefox:
  
  ![running](https://user-images.githubusercontent.com/4255997/119015927-0bdff800-b9a2-11eb-9234-bb46d72c0368.png)
  
  then tests that involve, for example, `border-style`, `border-radius` and `padding`, will pass in Chrome or Electron, but fail in Firefox:
  
  ![borderstyle](https://user-images.githubusercontent.com/4255997/119016340-7b55e780-b9a2-11eb-82e0-bab0418244c0.png)

### Bypassing the UI

Currently, we have the following tests:

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

First, we test logging in. Then, in their own describe block, we have a bunch of tests, which expect the user to be logged in. User is logged in in the <i>beforeEach</i> block.

As we said above, each test starts from zero! Tests do not start from the state where the previous tests ended.

The Cypress documentation gives us the following advice: [Fully test the login flow – but only once](https://docs.cypress.io/guides/end-to-end-testing/testing-your-app#Fully-test-the-login-flow-but-only-once).
So instead of logging in a user using the form in the <i>beforeEach</i> block, Cypress recommends that we [bypass the UI](https://docs.cypress.io/guides/getting-started/testing-your-app.html#Bypassing-your-UI) and do an HTTP request to the backend to log in. The reason for this is that logging in with an HTTP request is much faster than filling out a form.

Our situation is a bit more complicated than in the example in the Cypress documentation because when a user logs in, our application saves their details to the localStorage.
However, Cypress can handle that as well.
The code is the following

```js
describe('when logged in', function() {
  beforeEach(function() {
    // highlight-start
    cy.request('POST', 'http://localhost:3001/api/login', {
      username: 'mluukkai', password: 'salainen'
    }).then(response => {
      localStorage.setItem('loggedNoteappUser', JSON.stringify(response.body))
      cy.visit('http://localhost:5173')
    })
    // highlight-end
  })

  it('a new note can be created', function() {
    // ...
  })

  // ...
})
```

We can access the response to a [cy.request](https://docs.cypress.io/api/commands/request.html) with the _then_ method.  Under the hood <i>cy.request</i>, like all Cypress commands, are [promises](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#Commands-Are-Promises).
The callback function saves the details of a logged-in user to localStorage, and reloads the page.
Now there is no difference to a user logging in with the login form.

If and when we write new tests to our application, we have to use the login code in multiple places.
We should make it a [custom command](https://docs.cypress.io/api/cypress-api/custom-commands.html).

Custom commands are declared in <i>cypress/support/commands.js</i>.
The code for logging in is as follows:

```js
Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', 'http://localhost:3001/api/login', {
    username, password
  }).then(({ body }) => {
    localStorage.setItem('loggedNoteappUser', JSON.stringify(body))
    cy.visit('http://localhost:5173')
  })
})
```

Using our custom command is easy, and our test becomes cleaner:

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

The same applies to creating a new note now that we think about it. We have a test, which makes a new note using the form. We also make a new note in the <i>beforeEach</i> block of the test testing changing the importance of a note:

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

Let's make a new custom command for making a new note. The command will make a new note with an HTTP POST request:

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

  cy.visit('http://localhost:5173')
})
```

The command expects the user to be logged in and the user's details to be saved to localStorage.

Now the formatting block becomes:

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

There is one more annoying feature in our tests. The application address <i>http:localhost:5173</i> is hardcoded in many places.

Let's define the <i>baseUrl</i> for the application in the Cypress pre-generated [configuration file](https://docs.cypress.io/guides/references/configuration) <i>cypress.config.js</i>:

```js
const { defineConfig } = require("cypress")

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
    },
    baseUrl: 'http://localhost:5173' // highlight-line
  },
})
```

All the commands in the tests use the address of the application

```js
cy.visit('http://localhost:5173' )
```

can be transformed into

```js
cy.visit('')
```

The backend's hardcoded address <i>http://localhost:3001</i> is still in the tests. Cypress [documentation](https://docs.cypress.io/guides/guides/environment-variables) recommends defining other addresses used by the tests as environment variables.

Let's expand the configuration file <i>cypress.config.js</i> as follows:

```js
const { defineConfig } = require("cypress")

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
    },
    baseUrl: 'http://localhost:5173',
  },
  env: {
    BACKEND: 'http://localhost:3001/api' // highlight-line
  }
})
```

Let's replace all the backend addresses from the tests in the following way

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

The tests and the frontend code can be found on the [GitHub](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-10) branch <i>part5-10</i>.

### Changing the importance of a note

Lastly, let's take a look at the test we did for changing the importance of a note.
First, we'll change the formatting block so that it creates three notes instead of one:

```js
describe('when logged in', function() {
  describe('and several notes exist', function () {
    beforeEach(function () {
      // highlight-start
      cy.login({ username: 'mluukkai', password: 'salainen' })
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

How does the [cy.contains](https://docs.cypress.io/api/commands/contains.html) command actually work?

When we click the _cy.contains('second note')_ command in Cypress [Test Runner](https://docs.cypress.io/guides/core-concepts/test-runner.html), we see that the command searches for the element containing the text <i>second note</i>:

![cypress test runner clicking testbody and second note](../../images/5/34new.png)

By clicking the next line _.contains('make important')_ we see that the test uses
the 'make important' button corresponding to the <i>second note</i>:

![cypress test runner clicking make important](../../images/5/35new.png)

When chained, the second <i>contains</i> command <i>continues</i> the search from within the component found by the first command.

If we had not chained the commands, and instead write:

```js
cy.contains('second note')
cy.contains('make important').click()
```

the result would have been entirely different. The second line of the test would click the button of a wrong note:

![cypress showing error and incorrectly trying to click first button](../../images/5/36new.png)

When coding tests, you should check in the test runner that the tests use the right components!

Let's change the _Note_ component so that the text of the note is rendered to a <i>span</i>.

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

Our tests break! As the test runner reveals,  _cy.contains('second note')_ now returns the component containing the text, and the button is not in it.

![cypress showing test is broken trying to click make important](../../images/5/37new.png)

One way to fix this is the following:

```js
it('one of those can be made important', function () {
  cy.contains('second note').parent().find('button').click()
  cy.contains('second note').parent().find('button')
    .should('contain', 'make not important')
})
```

In the first line, we use the [parent](https://docs.cypress.io/api/commands/parent.html) command to access the parent element of the element containing <i>second note</i> and find the button from within it.
Then we click the button and check that the text on it changes.

Note that we use the command [find](https://docs.cypress.io/api/commands/find.html#Syntax) to search for the button. We cannot use [cy.get](https://docs.cypress.io/api/commands/get.html) here, because it always searches from the <i>whole</i> page and would return all 5 buttons on the page.

Unfortunately, we have some copy-paste in the tests now, because the code for searching for the right button is always the same.

In these kinds of situations, it is possible to use the [as](https://docs.cypress.io/api/commands/as.html) command:

```js
it('one of those can be made important', function () {
  cy.contains('second note').parent().find('button').as('theButton')
  cy.get('@theButton').click()
  cy.get('@theButton').should('contain', 'make not important')
})
```

Now the first line finds the right button and uses <i>as</i> to save it as <i>theButton</i>. The following lines can use the named element with <i>cy.get('@theButton')</i>.

### Running and debugging the tests

Finally, some notes on how Cypress works and debugging your tests.

The form of the Cypress tests gives the impression that the tests are normal JavaScript code, and we could for example try this:

```js
const button = cy.contains('log in')
button.click()
debugger
cy.contains('logout').click()
```

This won't work, however. When Cypress runs a test, it adds each _cy_ command to an execution queue.
When the code of the test method has been executed, Cypress will execute each command in the queue one by one.

Cypress commands always return _undefined_, so _button.click()_ in the above code would cause an error. An attempt to start the debugger would not stop the code between executing the commands, but before any commands have been executed.

Cypress commands are <i>like promises</i>, so if we want to access their return values, we have to do it using the [then](https://docs.cypress.io/api/commands/then.html) command.
For example, the following test would print the number of buttons in the application, and click the first button:

```js
it('then example', function() {
  cy.get('button').then( buttons => {
    console.log('number of buttons', buttons.length)
    cy.wrap(buttons[0]).click()
  })
})
```

Stopping the test execution with the debugger is [possible](https://docs.cypress.io/api/commands/debug.html). The debugger starts only if Cypress test runner's developer console is open.

The developer console is all sorts of useful when debugging your tests.
You can see the HTTP requests done by the tests on the Network tab, and the console tab will show you information about your tests:

![developer console while running cypress](../../images/5/38new.png)

So far we have run our Cypress tests using the graphical test runner.
It is also possible to run them [from the command line](https://docs.cypress.io/guides/guides/command-line.html). We just have to add an npm script for it:

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

Now we can run our tests from the command line with the command <i>npm run test:e2e</i>

![terminal output of running npm e2e tests showing passed](../../images/5/39new.png)

Note that videos of the test execution will be saved to <i>cypress/videos/</i>, so you should probably git ignore this directory. It is also possible to [turn off](https://docs.cypress.io/guides/guides/screenshots-and-videos#Videos) the making of videos.

The frontend and the test code can be found on the [GitHub](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-11) branch <i>part5-11</i>.

</div>

<div class="tasks">

### Exercises 5.17.-5.23.

In the last exercises of this part, we will do some E2E tests for our blog application.
The material of this part should be enough to complete the exercises.
You **must check out the Cypress [documentation](https://docs.cypress.io/guides/overview/why-cypress.html#In-a-nutshell)**. It is probably the best documentation I have ever seen for an open-source project.

I especially recommend reading [Introduction to Cypress](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#Cypress-Can-Be-Simple-Sometimes), which states

> <i>This is the single most important guide for understanding how to test with Cypress. Read it. Understand it.</i>

#### 5.17: bloglist end to end testing, step1

Configure Cypress for your project. Make a test for checking that the application displays the login form by default.

The structure of the test must be as follows:

```js
describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    // ...
  })
})
```

The <i>beforeEach</i> formatting blog must empty the database using for example the method we used in the [material](/en/part5/end_to_end_testing#controlling-the-state-of-the-database).

#### 5.18: bloglist end to end testing, step2

Make tests for logging in. Test both successful and unsuccessful login attempts.
Make a new user in the <i>beforeEach</i> block for the tests.

The test structure extends like so:

```js
describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    // create here a user to backend
    cy.visit('http://localhost:5173')
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

Make a test that verifies a logged-in user can create a new blog.
The structure of the test could be as follows:

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

The test has to ensure that a new blog is added to the list of all blogs.

#### 5.20: bloglist end to end testing, step4

Make a test that confirms users can like a blog.

#### 5.21: bloglist end to end testing, step5

Make a test for ensuring that the user who created a blog can delete it.

#### 5.22: bloglist end to end testing, step6

Make a test for ensuring that only the creator can see the delete button of a blog, not anyone else.

#### 5.23: bloglist end to end testing, step7

Make a test that checks that the blogs are ordered according to likes with the blog with the most likes being first.

<i>This exercise is quite a bit trickier than the previous ones.</i> One solution is to add a certain class for the element which wraps the blog's content and use the [eq](https://docs.cypress.io/api/commands/eq#Syntax) method to get the blog element in a specific index:
  
```js
cy.get('.blog').eq(0).should('contain', 'The title with the most likes')
cy.get('.blog').eq(1).should('contain', 'The title with the second most likes')
```

Note that you might end up having problems if you click a like button many times in a row. It might be that cypress does the clicking so fast that it does not have time to update the app state in between the clicks. One remedy for this is to wait for the number of likes to update in between all clicks.

This was the last exercise of this part, and it's time to push your code to GitHub and mark the exercises you completed in the [exercise submission system](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

</div>
