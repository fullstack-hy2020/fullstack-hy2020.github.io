---
mainImage: ../../../images/part-4.svg
part: 4
letter: b
lang: en
---

<div class="content">


We will now start writing tests for the backend. Since the backend does not contain any complicated logic, it doesn't make sense to write [unit tests](https://en.wikipedia.org/wiki/Unit_testing) for it. The only potential thing we could unit test is the _toJSON_ method that is used for formatting notes.


In some situations, it can be beneficial to implement some of the backend tests by mocking the database instead of using a real database. One library that could be used for this is [mongo-mock](https://github.com/williamkapke/mongo-mock).


Since our application's backend is still relatively simple, we will make the decision to test the entire application through its REST API, so that the database is also included. This kind of testing where multiple components of the system are being tested as a group, is called [integration testing](https://en.wikipedia.org/wiki/Integration_testing).


### Test environment


In one of the previous chapters of the course material, we mentioned that when your backend server is running in Heroku, it is in <i>production</i> mode.


The convention in Node is to define the execution mode of the application with the <i>NODE\_ENV</i> environment variable. In our current application, we only load the environment variables defined in the <i>.env</i> file if the application is <i>not</i> in production mode.

It is common practice to define separate modes for development and testing.

Next, let's change the scripts in our <i>package.json</i> so that when tests are run, <i>NODE\_ENV</i> gets the value <i>test</i>:

```json
{
  // ...
  "scripts": {
    "start": "NODE_ENV=production node index.js",// highlight-line
    "dev": "NODE_ENV=development nodemon index.js",// highlight-line
    "build:ui": "rm -rf build && cd ../../../2/luento/notes && npm run build && cp -r build ../../../3/luento/notes-backend",
    "deploy": "git push heroku master",
    "deploy:full": "npm run build:ui && git add . && git commit -m uibuild && git push && npm run deploy",
    "logs:prod": "heroku logs --tail",
    "lint": "eslint .",
    "test": "NODE_ENV=test jest --verbose --runInBand"// highlight-line
  },
  // ...
}
```

We also added the [runInBand](https://jestjs.io/docs/en/cli.html#--runinband) option to the npm script that executes the tests. This option will prevent Jest from running tests in parallel; we will discuss its significance once our tests start using the database.


We specified the mode of the application to be <i>development</i> in the _npm run dev_ script that uses nodemon. We also specified that the default _npm start_ command will define the mode as <i>production</i>.


There is a slight issue in the way that we have specified the mode of the application in our scripts: it will not work on Windows. We can correct this by installing the [cross-env](https://www.npmjs.com/package/cross-env) package as a development dependency with the command:

```bash
npm install --save-dev cross-env
```

We can then achieve cross-platform compatibility by using the cross-env library in our npm scripts defined in <i>package.json</i>:

```json
{
  // ...
  "scripts": {
    "start": "cross-env NODE_ENV=production node index.js",
    "dev": "cross-env NODE_ENV=development nodemon index.js",
    // ...
    "test": "cross-env NODE_ENV=test jest --verbose --runInBand",
  },
  // ...
}
```


Now we can modify the way that our application runs in different modes. As an example of this, we could define the application to use a separate test database when it is running tests.


We can create our separate test database in Mongo DB Atlas. This is not an optimal solution in situations where there are many people developing the same application. Test execution in particular typically requires that a single database instance is not used by tests that are running concurrently.


It would be better to run our tests using a database that is installed and running in the developer's local machine. The optimal solution would be to have every test execution use its own separate database. This is "relatively simple" to achieve by [running Mongo in-memory](https://docs.mongodb.com/manual/core/inmemory/) or by using [Docker](https://www.docker.com) containers. We will not complicate things and will instead continue to use the MongoDB Atlas database.


Let's make some changes to the module that defines the application's configuration:

```js
require('dotenv').config()

const PORT = process.env.PORT
let MONGODB_URI = process.env.MONGODB_URI

// highlight-start
if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.TEST_MONGODB_URI
}
// highlight-end

module.exports = {
  MONGODB_URI,
  PORT
}
```

The <i>.env</i> file has <i>separate variables</i> for the database addresses of the development and test databases:

```bash
MONGODB_URI=mongodb+srv://fullstack:secred@cluster0-ostce.mongodb.net/note-app?retryWrites=true
PORT=3001

// highlight-start
TEST_MONGODB_URI=mongodb+srv://fullstack:secret@cluster0-ostce.mongodb.net/note-app-test?retryWrites=true
// highlight-end
```

The _config_ module that we have implemented slightly resembles the [node-config](https://github.com/lorenwest/node-config) package. Writing our own implementation is justified since our application is simple, and also because it teaches us valuable lessons.

These are the only changes we need to make to our application's code.

You can find the code for our current application in its entirety in the <i>part4-2</i> branch of [this github repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-2).


### supertest

Let's use the [supertest](https://github.com/visionmedia/supertest) package to help us write our tests for testing the API.

We will install the package as a development dependency:

```bash
npm install --save-dev supertest
```

Let's write our first test in the <i>tests/note_api.test.js</i> file:

```js
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

afterAll(() => {
  mongoose.connection.close()
})
```

The test imports the Express application from the <i>app.js</i> module and wraps it with the <i>supertest</i> function into a so-called [superagent](https://github.com/visionmedia/superagent) object. This object is assigned to the <i>api</i> variable and tests can use it for making HTTP requests to the backend.

Our test makes an HTTP GET request to the <i>api/notes</i> url and verifies that the request is responded to with the status code 200. The test also verifies that the <i>Content-Type</i> header is set to <i>application/json</i>, indicating that the data is in the desired format. (If you're not familiar with the RegEx syntax of `/application\/json/`, you can learn more [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions).)

The test contains some details that we will explore [a bit later on](/en/part4/testing_the_backend#async-await). The arrow function that defines the test is preceded by the <i>async</i> keyword and the method call for the <i>api</i> object is preceded by the <i>await</i> keyword. We will write a few tests and then take a closer look at this async/await magic. Do not concern yourself with them for now, just be assured that the example tests work correctly. The async/await syntax is related to the fact that making a request to the API is an <i>asynchronous</i> operation. The [Async/await syntax](https://facebook.github.io/jest/docs/en/asynchronous.html) can be used for writing asynchronous code with the appearance of synchronous code.

Once all the tests (there is currently only one) have finished running we have to close the database connection used by Mongoose. This can be easily achieved with the [afterAll](https://facebook.github.io/jest/docs/en/api.html#afterallfn-timeout) method:

```js
afterAll(() => {
  mongoose.connection.close()
})
```

When running your tests you may run across the following console warning:

![](../../images/4/8.png)


If this occurs, let's follow the [instructions](https://mongoosejs.com/docs/jest.html) and add a <i>jest.config.js</i> file at the root of the project with the following content:

```js
module.exports = {
  testEnvironment: 'node'
}
```

One tiny but important detail: at the [beginning](/en/part4/structure_of_backend_application_introduction_to_testing#project-structure) of this part we extracted the Express application into the <i>app.js</i> file, and the role of the <i>index.js</i> file was changed to launch the application at the specified port with Node's built-in <i>http</i> object:

```js
const app = require('./app') // the actual Express app
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')

const server = http.createServer(app)

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
```

The tests only use the express application defined in the <i>app.js</i> file:

```js
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app') // highlight-line

const api = supertest(app) // highlight-line

// ...
```


The documentation for supertest says the following:

> <i>if the server is not already listening for connections then it is bound to an ephemeral port for you so there is no need to keep track of ports.</i>


In other words, supertest takes care that the application being tested is started at the port that it uses internally.


Let's write a few more tests:

```js
test('there are two notes', async () => {
  const response = await api.get('/api/notes')

  expect(response.body).toHaveLength(2)
})

test('the first note is about HTTP methods', async () => {
  const response = await api.get('/api/notes')

  expect(response.body[0].content).toBe('HTML is easy')
})
```

Both tests store the response of the request to the _response_ variable, and unlike the previous test that used the methods provided by _supertest_ for verifying the status code and headers, this time we are inspecting the response data stored in <i>response.body</i> property. Our tests verify the format and content of the response data with the [expect](https://facebook.github.io/jest/docs/en/expect.html#content) method of Jest.


The benefit of using the async/await syntax is starting to become evident. Normally we would have to use callback functions to access the data returned by promises, but with the new syntax things are a lot more comfortable:

```js
const response = await api.get('/api/notes')

// execution gets here only after the HTTP request is complete
// the result of HTTP request is saved in variable response
expect(response.body).toHaveLength(2)
```

<!-- HTTP-pyyntöjen tiedot konsoliin kirjoittava middleware häiritsee hiukan testien tulostusta. Muutetaan loggeria siten, että testausmoodissa lokiviestit eivät tulostu konsoliin: -->

The middleware that outputs information about the HTTP requests is obstructing the test execution output. Let us modify the logger so that it does not print to console in test mode:

```js
const info = (...params) => {
  // highlight-start
  if (process.env.NODE_ENV !== 'test') { 
    console.log(...params)
  }
  // highlight-end
}

const error = (...params) => {
  console.error(...params)
}

module.exports = {
  info, error
}
```

### Initializing the database before tests

Testing appears to be easy and our tests are currently passing. However, our tests are bad as they are dependent on the state of the database (that happens to be correct in my test database). In order to make our tests more robust, we have to reset the database and generate the needed test data in a controlled manner before we run the tests.

Our tests are already using the [afterAll](https://facebook.github.io/jest/docs/en/api.html#afterallfn-timeout) function of Jest to close the connection to the database after the tests are finished executing. Jest offers many other [functions](https://facebook.github.io/jest/docs/en/setup-teardown.html#content) that can be used for executing operations once before any test is run, or every time before a test is run.

Let's initialize the database <i>before every test</i> with the [beforeEach](https://jestjs.io/docs/en/api.html#beforeeachfn-timeout) function:

```js
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
// highlight-start
const Note = require('../models/note')

const initialNotes = [
  {
    content: 'HTML is easy',
    date: new Date(),
    important: false,
  },
  {
    content: 'Browser can execute only Javascript',
    date: new Date(),
    important: true,
  },
]

beforeEach(async () => {
  await Note.deleteMany({})

  let noteObject = new Note(initialNotes[0])
  await noteObject.save()

  noteObject = new Note(initialNotes[1])
  await noteObject.save()
})
// highlight-end
// ...
```

The database is cleared out at the beginning, and after that we save the two notes stored in the _initialNotes_ array to the database. Doing this, we ensure that the database is in the same state before every test is run.

Let's also make the following changes to the last two tests:

```js
test('all notes are returned', async () => {
  const response = await api.get('/api/notes')

  expect(response.body).toHaveLength(initialNotes.length) // highlight-line
})

test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes')

  // highlight-start
  const contents = response.body.map(r => r.content)

  expect(contents).toContain(
    'Browser can execute only Javascript'
  )
  // highlight-end
})
```

Pay special attention to the expect in the latter test. The <code>response.body.map(r => r.content)</code> command is used to create an array containing the content of every note returned by the API. The [toContain](https://facebook.github.io/jest/docs/en/expect.html#tocontainitem) method is used for checking that the note given to it as a parameter is in the list of notes returned by the API.

### Running tests one by one


The _npm test_ command executes all of the tests of the application. When we are writing tests, it is usually wise to only execute one or two tests. Jest offers a few different ways of accomplishing this, one of which is the [only](https://jestjs.io/docs/en/api#testonlyname-fn-timeout) method. If tests are written across many files, this method is not great.

A better option is to specify the tests that need to be run as parameter of the  <i>npm test</i> command.

The following command only runs the tests found in the <i>tests/note_api.test.js</i> file:

```js
npm test -- tests/note_api.test.js
```

The <i>-t</i> option can be used for running tests with a specific name:

```js
npm test -- -t 'a specific note is within the returned notes'
```

The provided parameter can refer to the name of the test or the describe block. The parameter can also contain just a part of the name. The following command will run all of the tests that contain <i>notes</i> in their name:

```js
npm test -- -t 'notes'
```

<!-- *HUOM*: yksittäisiä testejä suoritettaessa saattaa mongoose-yhteys  jäädä auki, mikäli yhtään yhteyttä hyödyntävää testiä ei ajeta. Ongelma seurannee siitä, että supertest alustaa yhteyden, mutta jest ei suorita afterAll-osiota. -->
**NB**: When running a single test, the mongoose connection might stay open if no tests using the connection are run. 
The problem might be due to the fact that supertest primes the connection, but jest does not run the afterAll portion of the code. 

### async/await

Before we write more tests let's take a look at the _async_ and _await_ keywords. 

The async/await syntax that was introduced in ES7 makes it possible to use <i>asynchronous functions that return a promise</i> in a way that makes the code look synchronous.

As an example, the fetching of notes from the database with promises looks like this:

```js
Note.find({}).then(notes => {
  console.log('operation returned the following notes', notes)
})
```


The _Note.find()_ method returns a promise and we can access the result of the operation by registering a callback function with the _then_ method.


All of the code we want to execute once the operation finishes is written in the callback function. If we wanted to make several asynchronous function calls in sequence, the situation would soon become painful. The asynchronous calls would have to be made in the callback. This would likely lead to complicated code and could potentially give birth to a so-called [callback hell](http://callbackhell.com/).


By [chaining promises](https://javascript.info/promise-chaining) we could keep the situation somewhat under control, and avoid callback hell by creating a fairly clean chain of _then_ method calls. We have seen a few of these during the course. To illustrate this, you can view an artificial example of a function that fetches all notes and then deletes the first one:

```js
Note.find({})
  .then(notes => {
    return notes[0].remove()
  })
  .then(response => {
    console.log('the first note is removed')
    // more code here
  })
```

The then-chain is alright, but we can do better. The [generator functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) introduced in ES6 provided a [clever way](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/async%20%26%20performance/ch4.md#iterating-generators-asynchronously) of writing asynchronous code in a way that "looks synchronous". The syntax is a bit clunky and not widely used.

The _async_ and _await_ keywords introduced in ES7 bring the same functionality as the generators, but in an understandable and syntactically cleaner way to the hands of all citizens of the JavaScript world.

We could fetch all of the notes in the database by utilizing the [await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) operator like this:

```js
const notes = await Note.find({})

console.log('operation returned the following notes', notes)
```

The code looks exactly like synchronous code. The execution of code pauses at <em>const notes = await Note.find({})</em> and waits until the related promise is <i>fulfilled</i>, and then continues its execution to the next line. When the execution continues, the result of the operation that returned a promise is assigned to the _notes_ variable.

The slightly complicated example presented above could be implemented by using await like this:

```js
const notes = await Note.find({})
const response = await notes[0].remove()

console.log('the first note is removed')
```

Thanks to the new syntax, the code is a lot simpler than the previous then-chain.

There are a few important details to pay attention to when using async/await syntax. In order to use the await operator with asynchronous operations, they have to return a promise. This is not a problem as such, as regular asynchronous functions using callbacks are easy to wrap around promises.

The await keyword can't be used just anywhere in JavaScript code. Using await is possible only inside of an [async](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) function.

This means that in order for the previous examples to work, they have to be using async functions. Notice the first line in the arrow function definition:

```js
const main = async () => { // highlight-line
  const notes = await Note.find({})
  console.log('operation returned the following notes', notes)

  const response = await notes[0].remove()
  console.log('the first note is removed')
}

main() // highlight-line
```

The code declares that the function assigned to _main_ is asynchronous. After this the code calls the function with <code>main()</code>.

### async/await in the backend

Let's change the backend to async and await. As all of the asynchronous operations are currently done inside of a function, it is enough to change the route handler functions into async functions.

The route for fetching all notes gets changed to the following:

```js
notesRouter.get('/', async (request, response) => { 
  const notes = await Note.find({})
  response.json(notes)
})
```

We can verify that our refactoring was successful by testing the endpoint through the browser and by running the tests that we wrote earlier.

You can find the code for our current application in its entirety in the <i>part4-3</i> branch of [this Github repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-3).

### More tests and refactoring the backend

When code gets refactored, there is always the risk of [regression](https://en.wikipedia.org/wiki/Regression_testing), meaning that existing functionality may break. Let's refactor the remaining operations by first writing a test for each route of the API.

Let's start with the operation for adding a new note. Let's write a test that adds a new note and verifies that the amount of notes returned by the API increases, and that the newly added note is in the list.

```js
test('a valid note can be added', async () => {
  const newNote = {
    content: 'async/await simplifies making async calls',
    important: true,
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/notes')

  const contents = response.body.map(r => r.content)

  expect(response.body).toHaveLength(initialNotes.length + 1)
  expect(contents).toContain(
    'async/await simplifies making async calls'
  )
})
```

The test passes just like we hoped and expected it to.

Let's also write a test that verifies that a note without content will not be saved into the database.

```js
test('note without content is not added', async () => {
  const newNote = {
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(400)

  const response = await api.get('/api/notes')

  expect(response.body).toHaveLength(initialNotes.length)
})
```

Both tests check the state stored in the database after the saving operation, by fetching all the notes of the application.  

```js
const response = await api.get('/api/notes')
```

The same verification steps will repeat in other tests later on, and it is a good idea to extract these steps into helper functions. Let's add the function into a new file called <i>tests/test_helper.js</i> that is in the same directory as the test file.

```js
const Note = require('../models/note')

const initialNotes = [
  {
    content: 'HTML is easy',
    date: new Date(),
    important: false
  },
  {
    content: 'Browser can execute only Javascript',
    date: new Date(),
    important: true
  }
]

const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon', date: new Date() })
  await note.save()
  await note.remove()

  return note._id.toString()
}

const notesInDb = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}

module.exports = {
  initialNotes, nonExistingId, notesInDb
}
```

The module defines the _notesInDb_ function that can be used for checking the notes stored in the database. The _initialNotes_ array containing the initial database state is also in the module. We also define the _nonExistingId_ function ahead of time, that can be used for creating a database object ID that does not belong to any note object in the database.

Our tests can now use helper module and be changed like this:

```js
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper') // highlight-line
const app = require('../app')
const api = supertest(app)

const Note = require('../models/note')

beforeEach(async () => {
  await Note.deleteMany({})

  let noteObject = new Note(helper.initialNotes[0]) // highlight-line
  await noteObject.save()

  noteObject = new Note(helper.initialNotes[1]) // highlight-line
  await noteObject.save()
})

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all notes are returned', async () => {
  const response = await api.get('/api/notes')

  expect(response.body).toHaveLength(helper.initialNotes.length) // highlight-line
})

test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes')

  const contents = response.body.map(r => r.content)

  expect(contents).toContain(
    'Browser can execute only Javascript'
  )
})

test('a valid note can be added ', async () => {
  const newNote = {
    content: 'async/await simplifies making async calls',
    important: true,
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const notesAtEnd = await helper.notesInDb() // highlight-line
  expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1) // highlight-line

  const contents = notesAtEnd.map(n => n.content) // highlight-line
  expect(contents).toContain(
    'async/await simplifies making async calls'
  )
})

test('note without content is not added', async () => {
  const newNote = {
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(400)

  const notesAtEnd = await helper.notesInDb() // highlight-line

  expect(notesAtEnd).toHaveLength(helper.initialNotes.length) // highlight-line
})

afterAll(() => {
  mongoose.connection.close()
}) 
```

The code using promises works and the tests pass. We are ready to refactor our code to use the async/await syntax.

We make the following changes to the code that takes care of adding a new note(notice that the route handler definition is preceded by the _async_ keyword):

```js
notesRouter.post('/', async (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

  const savedNote = await note.save()
  response.json(savedNote)
})
```

There's a slight problem with our code: we don't handle error situations. How should we deal with them?

### Error handling and async/await

If there's an exception while handling the POST request we end up in a familiar situation:

![](../../images/4/6.png)

In other words we end up with an unhandled promise rejection, and the request never receives a response.

With async/await the recommended way of dealing with exceptions is the old and familiar _try/catch_ mechanism:

```js
notesRouter.post('/', async (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })
  // highlight-start
  try { 
    const savedNote = await note.save()
    response.json(savedNote)
  } catch(exception) {
    next(exception)
  }
  // highlight-end
})
```

The catch block simply calls the _next_ function, which passes the request handling to the error handling middleware.

After making the change, all of our tests will pass once again.

Next, let's write tests for fetching and removing an individual note:

```js
test('a specific note can be viewed', async () => {
  const notesAtStart = await helper.notesInDb()

  const noteToView = notesAtStart[0]

// highlight-start
  const resultNote = await api
    .get(`/api/notes/${noteToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)
// highlight-end

  const processedNoteToView = JSON.parse(JSON.stringify(noteToView))

  expect(resultNote.body).toEqual(processedNoteToView)
})

test('a note can be deleted', async () => {
  const notesAtStart = await helper.notesInDb()
  const noteToDelete = notesAtStart[0]

// highlight-start
  await api
    .delete(`/api/notes/${noteToDelete.id}`)
    .expect(204)
// highlight-end

  const notesAtEnd = await helper.notesInDb()

  expect(notesAtEnd).toHaveLength(
    helper.initialNotes.length - 1
  )

  const contents = notesAtEnd.map(r => r.content)

  expect(contents).not.toContain(noteToDelete.content)
})
```

In the first test, the note object we receive as the response body goes through JSON serialization and parsing. This processing will turn the note object's <em>date</em> property value's type from <em>Date</em> object into a string. Because of this we can't directly compare equality of the <em>resultNote.body</em> and <em>noteToView</em>. Instead, we must first perform similar JSON serialization and parsing for the <em>noteToView</em> as the server is performing for the note object.

Both tests share a similar structure. In the initialization phase they fetch a note from the database. After this, the tests call the actual operation being tested, which is highlighted in the code block. Lastly, the tests verify that the outcome of the operation is as expected.

The tests pass and we can safely refactor the tested routes to use async/await:

```js
notesRouter.get('/:id', async (request, response, next) => {
  try{
    const note = await Note.findById(request.params.id)
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  } catch(exception) {
    next(exception)
  }
})

notesRouter.delete('/:id', async (request, response, next) => {
  try {
    await Note.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})
```

You can find the code for our current application in its entirety in the <i>part4-4</i> branch of [this Github repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-4).

### Eliminating the try-catch

<!-- Async/await selkeyttää koodia jossain määrin, mutta sen 'hinta' on poikkeusten käsittelyn edellyttämä <i>try/catch</i>-rakenne. Kaikki routejen käsittelijät noudattavat samaa kaavaa -->
Async/await unclutters the code a bit, but the 'price' is the <i>try/catch</i> structure required for catching exceptions. 
All of the route handlers follow the same structure

```js
try {
  // do the async operations here
} catch(exception) {
  next(exception)
}
```

<!-- Mieleen herää kysymys, olisiko koodia mahdollista refaktoroida siten, että <i>catch</i> saataisiin refaktoroitua ulos metodeista?  -->
One starts to wonder, if it would be possible to refactor the code to eliminate the <i>catch</i> from the methods?

<!-- Kirjasto [express-async-errors](https://github.com/davidbanham/express-async-errors) tuo tilanteeseen helpotuksen. -->
The [express-async-errors](https://github.com/davidbanham/express-async-errors) library has a solution for this. 

<!-- Asennetaan kirjasto -->
Let's install the library

```bash
npm install express-async-errors
```

<!-- Kirjaston käyttö on <i>todella</i> helppoa.
 Kirjaston koodi otetaan käyttöön tiedostossa <i>src/app.js</i>: -->
Using the library is <i>very</i> easy. 
You introduce the library in <i>app.js</i>:

```js
const config = require('./utils/config')
const express = require('express')
require('express-async-errors') // highlight-line
const app = express()
const cors = require('cors')
const notesRouter = require('./controllers/notes')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

// ...

module.exports = app
```

<!-- Kirjaston koodiin sisällyttämän "magian" ansiosta pääsemme kokonaan eroon try-catch-lauseista. Muistiinpanon poistamisesta huolehtiva route -->
The 'magic' of the library allows us to eliminate the try-catch blocks completely. 
For example the route for deleting a note

```js
notesRouter.delete('/:id', async (request, response, next) => {
  try {
    await Note.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})
```

<!-- muuttuu muotoon -->
becomes

```js
notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndRemove(request.params.id)
  response.status(204).end()
})
```

<!-- Kirjaston ansiosta kutsua _next(exception)_ ei siis enää tarvita, kirjasto hoitaa asian konepellin alla, eli jos <i>async</i>-funktiona määritellyn routen sisällä syntyy poikkeus, siirtyy suoritus automaattisesti virheenkäsittelijämiddlewareen. -->
Because of the library, we do not need the _next(exception)_ call anymore. 
The library handles everything under the hood. If an exception occurs in a <i>async</i> route, the execution is automatically passed to the error handling middleware.

<!-- Muut routet yksinkertaistuvat seuraavasti: -->
The other routes become:

```js
notesRouter.post('/', async (request, response) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

  const savedNote = await note.save()
  response.json(savedNote)
})

notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})
```

<!-- Sovelluksen tämänhetkinen koodi on kokonaisuudessaan [githubissa](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-5), haarassa <i>part4-5</i>.  -->
The code for our application can be found from [github](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-5), branch <i>part4-5</i>.

### Optimizing the beforeEach function

Let's return to writing our tests and take a closer look at the _beforeEach_ function that sets up the tests:

```js
beforeEach(async () => {
  await Note.deleteMany({})

  let noteObject = new Note(helper.initialNotes[0])
  await noteObject.save()

  noteObject = new Note(helper.initialNotes[1])
  await noteObject.save()
})
```

The function saves the first two notes from the   _helper.initialNotes_ array into the database with two separate operations. The solution is alright, but there's a better way of saving multiple objects to the database:

```js
beforeEach(async () => {
  await Note.deleteMany({})
  console.log('cleared')

  helper.initialNotes.forEach(async (note) => {
    let noteObject = new Note(note)
    await noteObject.save()
    console.log('saved')
  })
  console.log('done')
})

test('notes are returned as json', async () => {
  console.log('entered test')
  // ...
}
```

We save the notes stored in the array into the database inside of a _forEach_ loop. The tests don't quite seem to work however, so we have added some console logs to help us find the problem. 

The console displays the following output:

<pre>
cleared
done
entered test
saved
saved
</pre>

Despite our use of the async/await syntax, our solution does not work like we expected it to. The test execution begins before the database is initialized!

The problem is that every iteration of the forEach loop generates its own asynchronous operation, and _beforeEach_ won't wait for them to finish executing. In other words, the _await_ commands defined inside of the _forEach_ loop are not in the _beforeEach_ function, but in separate functions that _beforeEach_ will not wait for.

Since the execution of tests begins immediately after _beforeEach_ has finished executing, the execution of tests begins before the database state is initialized.

One way of fixing this is to wait for all of the asynchronous operations to finish executing with the [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) method:

```js
beforeEach(async () => {
  await Note.deleteMany({})

  const noteObjects = helper.initialNotes
    .map(note => new Note(note))
  const promiseArray = noteObjects.map(note => note.save())
  await Promise.all(promiseArray)
})
```

The solution is quite advanced despite its compact appearance. The _noteObjects_ variable is assigned to an array of Mongoose objects that are created with the _Note_ constructor for each of the notes in the _helper.initialNotes_ array. The next line of code creates a new array that <i>consists of promises</i>, that are created by calling the _save_ method of each item in the _noteObjects_ array. In other words, it is an array of promises for saving each of the items to the database.

The [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) method can be used for transforming an array of promises into a single promise, that will be <i>fulfilled</i> once every promise in the array passed to it as a parameter is resolved. The last line of code <em>await Promise.all(promiseArray)</em> waits that every promise for saving a note is finished, meaning that the database has been initialized.


> The returned values of each promise in the array can still be accessed when using the Promise.all method. If we wait for the promises to be resolved with the _await_ syntax <em>const results = await Promise.all(promiseArray)</em>, the operation will return an array that contains the resolved values for each promise in the _promiseArray_, and they appear in the same order as the promises in the array.


Promise.all executes the promises it receives in parallel. If the promises need to be executed in a particular order, this will be problematic. In situations like this, the operations can be executed inside of a [for...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of) block, that guarantees a specific execution order.

```js
beforeEach(async () => {
  await Note.deleteMany({})

  for (let note of helper.initialNotes) {
    let noteObject = new Note(note)
    await noteObject.save()
  }
})
```


The asynchronous nature of JavaScript can lead to surprising behavior, and for this reason, it is important to pay careful attention when using the async/await syntax. Even though the syntax makes it easier to deal with promises, it is still necessary to understand how promises work!

</div>

<div class="tasks">


### Exercises 4.8.-4.12.


**NB:** the material uses the [toContain](https://facebook.github.io/jest/docs/en/expect.html#tocontainitem) matcher in several places to verify that an array contains a specific element. It's worth noting that the method uses the === operator for comparing and matching elements, which means that it is often not well-suited for matching objects. In most cases, the appropriate method for verifying objects in arrays is the [toContainEqual](https://facebook.github.io/jest/docs/en/expect.html#tocontainequalitem) matcher. However, the model solutions don't check for objects in arrays with matchers, so using the method is not required for solving the exercises.


**Warning:** If you find yourself using async/await and <i>then</i> methods in the same code, it is almost guaranteed that you are doing something wrong. Use one or the other and don't mix the two.


#### 4.8: Blog list tests, step1


Use the supertest package for writing a test that makes an HTTP GET request to the <i>/api/blogs</i> url. Verify that the blog list application returns the correct amount of blog posts in the JSON format.


Once the test is finished, refactor the route handler to use the async/await syntax instead of promises.


Notice that you will have to make similar changes to the code that were made [in the material](/en/part4/testing_the_backend#test-environment), like defining the test environment so that you can write tests that use their own separate database.


**NB:** When running the tests, you may run into the following warning:

![](../../images/4/8a.png)


If this happens, follow the [instructions](https://mongoosejs.com/docs/jest.html) and create a new <i>jest.config.js</i> file at the root of the project with the following contents:

```js
module.exports = {
  testEnvironment: 'node'
}
```




**NB:** when you are writing your tests **<i>it is better to not execute all of your tests</i>**, only execute the ones you are working on. Read more about this [here](/en/part4/testing_the_backend#running-tests-one-by-one).


#### 4.9*: Blog list tests, step2


Write a test that verifies that the unique identifier property of the blog posts is named <i>id</i>, by default the database names the property <i>_id</i>. Verifying the existence of a property is easily done with Jest's [toBeDefined](https://jestjs.io/docs/en/expect#tobedefined) matcher.


Make the required changes to the code so that it passes the test. The [toJSON](/en/part3/saving_data_to_mongo_db#backend-connected-to-a-database) method discussed in part 3 is an appropriate place for defining the <i>id</i> parameter.


#### 4.10: Blog list tests, step3


Write a test that verifies that making an HTTP POST request to the <i>/api/blogs</i> url successfully creates a new blog post. At the very least, verify that the total number of blogs in the system is increased by one. You can also verify that the content of the blog post is saved correctly to the database.


Once the test is finished, refactor the operation to use async/await instead of promises.


#### 4.11*: Blog list tests, step4


Write a test that verifies that if the <i>likes</i> property is missing from the request, it will default to the value 0. Do not test the other properties of the created blogs yet.


Make the required changes to the code so that it passes the test.


#### 4.12*: Blog list tests, step5


Write a test related to creating new blogs via the <i>/api/blogs</i> endpoint, that verifies that if the <i>title</i> and <i>url</i> properties are missing from the request data, the backend responds to the request with the status code <i>400 Bad Request</i>.


Make the required changes to the code so that it passes the test.

</div>

<div class="content">


### Refactoring tests

Our test coverage is currently lacking. Some requests like <i>GET /api/notes/:id</i> and <i>DELETE /api/notes/:id</i> aren't tested when the request is sent with an invalid id. The grouping and organization of tests could also use some improvement, as all tests exist on the same "top level" in the test file. The readability of the test would improve if we group related tests with <i>describe</i> blocks.


Below is an example of the test file after making some minor improvements:

```js
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Note = require('../models/note')

beforeEach(async () => {
  await Note.deleteMany({})

  const noteObjects = helper.initialNotes
    .map(note => new Note(note))
  const promiseArray = noteObjects.map(note => note.save())
  await Promise.all(promiseArray)
})

describe('when there is initially some notes saved', () => {
  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all notes are returned', async () => {
    const response = await api.get('/api/notes')

    expect(response.body).toHaveLength(helper.initialNotes.length)
  })

  test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes')

    const contents = response.body.map(r => r.content)

    expect(contents).toContain(
      'Browser can execute only Javascript'
    )
  })
})

describe('viewing a specific note', () => {
  test('succeeds with a valid id', async () => {
    const notesAtStart = await helper.notesInDb()

    const noteToView = notesAtStart[0]

    const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
      
    const processedNoteToView = JSON.parse(JSON.stringify(noteToView))

    expect(resultNote.body).toEqual(processedNoteToView)
  })

  test('fails with statuscode 404 if note does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()

    console.log(validNonexistingId)

    await api
      .get(`/api/notes/${validNonexistingId}`)
      .expect(404)
  })

  test('fails with statuscode 400 id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api
      .get(`/api/notes/${invalidId}`)
      .expect(400)
  })
})

describe('addition of a new note', () => {
  test('succeeds with valid data', async () => {
    const newNote = {
      content: 'async/await simplifies making async calls',
      important: true,
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(200)
      .expect('Content-Type', /application\/json/)


    const notesAtEnd = await helper.notesInDb()
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)

    const contents = notesAtEnd.map(n => n.content)
    expect(contents).toContain(
      'async/await simplifies making async calls'
    )
  })

  test('fails with status code 400 if data invaild', async () => {
    const newNote = {
      important: true
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(400)

    const notesAtEnd = await helper.notesInDb()

    expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
  })
})

describe('deletion of a note', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const notesAtStart = await helper.notesInDb()
    const noteToDelete = notesAtStart[0]

    await api
      .delete(`/api/notes/${noteToDelete.id}`)
      .expect(204)

    const notesAtEnd = await helper.notesInDb()

    expect(notesAtEnd).toHaveLength(
      helper.initialNotes.length - 1
    )

    const contents = notesAtEnd.map(r => r.content)

    expect(contents).not.toContain(noteToDelete.content)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
```


The test output is grouped according to the <i>describe</i> blocks:

![](../../images/4/7.png)


There is still room for improvement, but it is time to move forward.

This way of testing the API, by making HTTP requests and inspecting the database with Mongoose, is by no means the only nor the best way of conducting API-level integration tests for server applications. There is no universal best way of writing tests, as it all depends on the application being tested and available resources.


You can find the code for our current application in its entirety in the <i>part4-6</i> branch of [this Github repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-6).

</div>

<div class="tasks">


### Exercises 4.13.-4.14.


#### 4.13 Blog list expansions, step1


Implement functionality for deleting a single blog post resource.


Use the async/await syntax. Follow [RESTful](/en/part3/node_js_and_express#rest) conventions when defining the HTTP API.


Feel free to implement tests for the functionality if you want to. Otherwise verify that the functionality works with Postman or some other tool.


#### 4.14 Blog list expansions, step2


Implement functionality for updating the information of an individual blog post.


Use async/await.


The application mostly needs to update the amount of <i>likes</i> for a blog post. You can implement this functionality the same way that we implemented updating notes in [part 3](/en/part3/saving_data_to_mongo_db#other-operations).


Feel free to implement tests for the functionality if you want to. Otherwise verify that the functionality works with Postman or some other tool.

</div>
