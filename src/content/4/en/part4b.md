---
mainImage: ../../../images/part-4.svg
part: 4
letter: b
lang: en
---

<div class="content">

We will now start writing tests for the backend. Since the backend does not contain any complicated logic, it doesn't make sense to write [unit tests](https://en.wikipedia.org/wiki/Unit_testing) for it. The only potential thing we could unit test is the _toJSON_ method that is used for formatting notes.

In some situations, it can be beneficial to implement some of the backend tests by mocking the database instead of using a real database. One library that could be used for this is [mongodb-memory-server](https://github.com/nodkz/mongodb-memory-server).

Since our application's backend is still relatively simple, we will decide to test the entire application through its REST API, so that the database is also included. This kind of testing where multiple components of the system are being tested as a group is called [integration testing](https://en.wikipedia.org/wiki/Integration_testing).

### Test environment

In one of the previous chapters of the course material, we mentioned that when your backend server is running in Fly.io or Render, it is in <i>production</i> mode.

The convention in Node is to define the execution mode of the application with the <i>NODE\_ENV</i> environment variable. In our current application, we only load the environment variables defined in the <i>.env</i> file if the application is <i>not</i> in production mode.

It is common practice to define separate modes for development and testing.

Next, let's change the scripts in our notes application <i>package.json</i> file, so that when tests are run, <i>NODE\_ENV</i> gets the value <i>test</i>:

```json
{
  // ...
  "scripts": {
    "start": "NODE_ENV=production node index.js", // highlight-line
    "dev": "NODE_ENV=development node --watch index.js", // highlight-line
    "test": "NODE_ENV=test node --test", // highlight-line
    "lint": "eslint ."
  }
  // ...
}
```

We specified the mode of the application to be <i>development</i> in the _npm run dev_ script. We also specified that the default _npm start_ command will define the mode as <i>production</i>.

There is a slight issue in the way that we have specified the mode of the application in our scripts: it will not work on Windows. We can correct this by installing the [cross-env](https://www.npmjs.com/package/cross-env) package as a project dependency using the command:

```bash
npm install cross-env
```

We can then achieve cross-platform compatibility by using the cross-env library in our npm scripts defined in <i>package.json</i>:

```json
{
  // ...
  "scripts": {
    "start": "cross-env NODE_ENV=production node index.js", // highlight-line
    "dev": "cross-env NODE_ENV=development node --watch index.js", // highlight-line
    "test": "cross-env  NODE_ENV=test node --test", // highlight-line
    "lint": "eslint ."
  },
  // ...
}
```


Now we can modify the way that our application runs in different modes. As an example of this, we could define the application to use a separate test database when it is running tests.

We can create our separate test database in MongoDB Atlas. This is not an optimal solution in situations where many people are developing the same application. Test execution in particular typically requires a single database instance that is not used by tests that are running concurrently.

It would be better to run our tests using a database that is installed and running on the developer's local machine. The optimal solution would be to have every test execution use a separate database. This is "relatively simple" to achieve by [running Mongo in-memory](https://docs.mongodb.com/manual/core/inmemory/) or by using [Docker](https://www.docker.com) containers. We will not complicate things and will instead continue to use the MongoDB Atlas database.

Let's make some changes to the module that defines the application's configuration in _utils/config.js_:

```js
require('dotenv').config()

const PORT = process.env.PORT

// highlight-start
const MONGODB_URI = process.env.NODE_ENV === 'test' 
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI
// highlight-end

module.exports = {
  MONGODB_URI,
  PORT
}
```

The <i>.env</i> file has <i>separate variables</i> for the database addresses of the development and test databases:

```bash
MONGODB_URI=mongodb+srv://fullstack:thepasswordishere@cluster0.a5qfl.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0
PORT=3001

// highlight-start
TEST_MONGODB_URI=mongodb+srv://fullstack:thepasswordishere@cluster0.a5qfl.mongodb.net/testNoteApp?retryWrites=true&w=majority&appName=Cluster0
// highlight-end
```

The _config_ module that we have implemented slightly resembles the [node-config](https://github.com/lorenwest/node-config) package. Writing our implementation is justified since our application is simple, and also because it teaches us valuable lessons.

These are the only changes we need to make to our application's code.

You can find the code for our current application in its entirety in the <i>part4-2</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-2).

### supertest

Let's use the [supertest](https://github.com/visionmedia/supertest) package to help us write our tests for testing the API.

We will install the package as a development dependency:

```bash
npm install --save-dev supertest
```

Let's write our first test in the <i>tests/note_api.test.js</i> file:

```js
const { test, after } = require('node:test')
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

after(async () => {
  await mongoose.connection.close()
})
```

The test imports the Express application from the <i>app.js</i> module and wraps it with the <i>supertest</i> function into a so-called [superagent](https://github.com/visionmedia/superagent) object. This object is assigned to the <i>api</i> variable and tests can use it for making HTTP requests to the backend.

Our test makes an HTTP GET request to the <i>api/notes</i> url and verifies that the request is responded to with the status code 200. The test also verifies that the <i>Content-Type</i> header is set to <i>application/json</i>, indicating that the data is in the desired format.

Checking the value of the header uses a bit strange looking syntax:

```js
.expect('Content-Type', /application\/json/)
```

The desired value is now defined as [regular expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) or in short regex. The regex starts and ends with a slash /, and because the desired string <i>application/json</i> also contains the same slash, it is preceded by a \ so that it is not interpreted as a regex termination character.

In principle, the test could also have been defined as a string

```js
.expect('Content-Type', 'application/json')
```

The problem here, however, is that when using a string, the value of the header must be exactly the same. For the regex we defined, it is acceptable that the header <i>contains</i> the string in question. The actual value of the header is <i>application/json; charset=utf-8</i>, i.e. it also contains information about character encoding. However, our test is not interested in this and therefore it is better to define the test as a regex instead of an exact string.

The test contains some details that we will explore [a bit later on](/en/part4/testing_the_backend#async-await). The arrow function that defines the test is preceded by the <i>async</i> keyword and the method call for the <i>api</i> object is preceded by the <i>await</i> keyword. We will write a few tests and then take a closer look at this async/await magic. Do not concern yourself with them for now, just be assured that the example tests work correctly. The async/await syntax is related to the fact that making a request to the API is an <i>asynchronous</i> operation. The async/await syntax can be used for writing asynchronous code with the appearance of synchronous code.

Once all the tests (there is currently only one) have finished running we have to close the database connection used by Mongoose. Without this, the test program will not terminate. This can be easily achieved with the [after](https://nodejs.org/api/test.html#afterfn-options) method:

```js
after(async () => {
  await mongoose.connection.close()
})
```

One tiny but important detail: at the [beginning](/en/part4/structure_of_backend_application_introduction_to_testing#project-structure) of this part we extracted the Express application into the <i>app.js</i> file, and the role of the <i>index.js</i> file was changed to launch the application at the specified port via _app.listen_:

```js
const app = require('./app') // the actual Express app
const config = require('./utils/config')
const logger = require('./utils/logger')

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
```

The tests only use the Express application defined in the <i>app.js</i> file, which does not listen to any ports:

```js
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app') // highlight-line

const api = supertest(app) // highlight-line

// ...
```

The documentation for supertest says the following:

> <i>if the server is not already listening for connections then it is bound to an ephemeral port for you so there is no need to keep track of ports.</i>

In other words, supertest takes care that the application being tested is started at the port that it uses internally. This is one of the reasons why we are going with supertest instead of something like axios, as we do not need to run another instance of the server separately before beginning to test. The other reason is that supertest provides functions like <code>expect()</code>, which makes testing easier.

Let's add two notes to the test database using the _mongo.js_ program (here we must remember to switch to the correct database url).

Let's write a few more tests:

```js
const assert = require('node:assert')
// ...

test('all notes are returned', async () => {
  const response = await api.get('/api/notes')

  assert.strictEqual(response.body.length, 2)
})

test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes')

  const contents = response.body.map(e => e.content)
  assert.strictEqual(contents.includes('HTML is easy'), true)
})

// ...
```

Both tests store the response of the request to the _response_ variable, and unlike the previous test that used the methods provided by _supertest_ for verifying the status code and headers, this time we are inspecting the response data stored in <i>response.body</i> property. Our tests verify the format and content of the response data with the method [strictEqual](https://nodejs.org/docs/latest/api/assert.html#assertstrictequalactual-expected-message) of the assert-library.

We could simplify the second test a bit, and use the [assert](https://nodejs.org/docs/latest/api/assert.html#assertokvalue-message) itself to verify that the note is among the returned ones:

```js
test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes')

  const contents = response.body.map(e => e.content)
  assert(contents.includes('HTML is easy'))
})
```


The benefit of using the async/await syntax is starting to become evident. Normally we would have to use callback functions to access the data returned by promises, but with the new syntax things are a lot more comfortable:

```js
const response = await api.get('/api/notes')

// execution gets here only after the HTTP request is complete
// the result of HTTP request is saved in variable response
assert.strictEqual(response.body.length, 2)
```

The middleware that outputs information about the HTTP requests is obstructing the test execution output. Let us modify the logger so that it does not print to the console in test mode:

```js
const info = (...params) => {
  // highlight-start
  if (process.env.NODE_ENV !== 'test') { 
    console.log(...params)
  }
  // highlight-end
}

const error = (...params) => {
  // highlight-start
  if (process.env.NODE_ENV !== 'test') { 
    console.error(...params)
  }
  // highlight-end  
}

module.exports = {
  info, error
}
```

### Initializing the database before tests

Currently, our tests have an issue where their success depends on the state of the database. The tests pass if the test database happens to contain two notes, one of which has the content <i>'HTML is easy'</i>. To make them more robust, we have to reset the database and generate the needed test data in a controlled manner before we run the tests.

Our tests are already using the [after](https://nodejs.org/api/test.html#afterfn-options) function to close the connection to the database after the tests are finished executing. The library node:test offers many other functions that can be used for executing operations once before any test is run or every time before a test is run.

Let's initialize the database <i>before every test</i> with the [beforeEach](https://nodejs.org/api/test.html#beforeeachfn-options) function:

```js

const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test') // highlight-line
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Note = require('../models/note') // highlight-line

const api = supertest(app)

// highlight-start
const initialNotes = [
  {
    content: 'HTML is easy',
    important: false,
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true,
  },
]
// highlight-end

// highlight-start
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

The database is cleared out at the beginning, and after that, we save the two notes stored in the _initialNotes_ array to the database. By doing this, we ensure that the database is in the same state before every test is run.

Let's modify the test that checks the number of notes as follows:

```js
// ...

test('all notes are returned', async () => {
  const response = await api.get('/api/notes')

  assert.strictEqual(response.body.length, initialNotes.length) // highlight-line
})

// ...

```

You can find the code for our current application in its entirety in the <i>part4-3</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-3).

### Running tests one by one

The _npm test_ command executes all of the tests for the application. When we are writing tests, it is usually wise to only execute one or two tests. 

There are a few different ways of accomplishing this, one of which is the [only](https://nodejs.org/api/test.html#testonlyname-options-fn) method. With this method we can define in the code what tests should be executed:

```js
test.only('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test.only('all notes are returned', async () => {
  const response = await api.get('/api/notes')

  assert.strictEqual(response.body.length, 2)
})
```

When tests are run with option _--test-only_, that is, with the command:

```
npm test -- --test-only
```

only the _only_ marked tests are executed.

The danger of _only_ is that one forgets to remove those from the code.

Another option is to specify the tests that need to be run as arguments of the <i>npm test</i> command.

The following command only runs the tests found in the <i>tests/note_api.test.js</i> file:

```js
npm test -- tests/note_api.test.js
```

The [--tests-by-name-pattern](https://nodejs.org/api/test.html#filtering-tests-by-name) option can be used for running tests with a specific name:

```js
npm test -- --test-name-pattern="a specific note is within the returned notes"
```

The provided argument can refer to the name of the test or the describe block. It can also contain just a part of the name. The following command will run all of the tests that contain <i>notes</i> in their name:

```js
npm run test -- --test-name-pattern="notes"
```

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

All of the code we want to execute once the operation finishes is written in the callback function. If we wanted to make several asynchronous function calls in sequence, the situation would soon become painful. The asynchronous calls would have to be made in the callback. This would likely lead to complicated code and could potentially give birth to a so-called [callback hell](https://stackoverflow.com/a/25098230).

By [chaining promises](https://javascript.info/promise-chaining) we could keep the situation somewhat under control, and avoid callback hell by creating a fairly clean chain of _then_ method calls. We have seen a few of these during the course. To illustrate this, you can view an artificial example of a function that fetches all notes and then deletes the first one:

```js
Note.find({})
  .then(notes => {
    return notes[0].deleteOne()
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
const response = await notes[0].deleteOne()

console.log('the first note is removed')
```

Thanks to the new syntax, the code is a lot simpler than the previous then-chain.

There are a few important details to pay attention to when using async/await syntax. To use the await operator with asynchronous operations, they have to return a promise. This is not a problem as such, as regular asynchronous functions using callbacks are easy to wrap around promises.

The await keyword can't be used just anywhere in JavaScript code. Using await is possible only inside of an [async](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) function.

This means that in order for the previous examples to work, they have to be using async functions. Notice the first line in the arrow function definition:

```js
const main = async () => { // highlight-line
  const notes = await Note.find({})
  console.log('operation returned the following notes', notes)

  const response = await notes[0].deleteOne()
  console.log('the first note is removed')
}

main() // highlight-line
```

The code declares that the function assigned to _main_ is asynchronous. After this, the code calls the function with <code>main()</code>.

### async/await in the backend

Let's start to change the backend to async and await. Let's start with the route responsible for fetching all notes.

As all of the asynchronous operations are currently done inside of a function, it is enough to change the route handler functions into async functions. The route for fetching all notes 

```js
notesRouter.get('/', (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes)
  })
})
```

gets changed to the following:

```js
notesRouter.get('/', async (request, response) => { 
  const notes = await Note.find({})
  response.json(notes)
})
```

We can verify that our refactoring was successful by testing the endpoint through the browser and by running the tests that we wrote earlier.

### Refactoring the route responsible for adding a note

When code gets refactored, there is always the risk of [regression](https://en.wikipedia.org/wiki/Regression_testing), meaning that existing functionality may break. Let's refactor the remaining operations by first writing a test for each route of the API.

Let's start with the operation for adding a new note. Let's write a test that adds a new note and verifies that the number of notes returned by the API increases and that the newly added note is in the list.

```js
test('a valid note can be added ', async () => {
  const newNote = {
    content: 'async/await simplifies making async calls',
    important: true,
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/notes')

  const contents = response.body.map(r => r.content)

  assert.strictEqual(response.body.length, initialNotes.length + 1)

  assert(contents.includes('async/await simplifies making async calls'))
})
```

The test fails because we accidentally returned the status code <i>200 OK</i> when a new note is created. Let us change that to the status code <i>201 CREATED</i>:

```js
notesRouter.post('/', (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save()
    .then(savedNote => {
      response.status(201).json(savedNote) // highlight-line
    })
    .catch(error => next(error))
})
```

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

  assert.strictEqual(response.body.length, initialNotes.length)
})
```

Both tests check the state stored in the database after the saving operation, by fetching all the notes of the application.  

```js
const response = await api.get('/api/notes')
```

The same verification steps will repeat in other tests later on, and it is a good idea to extract these steps into helper functions. Let's add the function into a new file called <i>tests/test_helper.js</i> which is in the same directory as the test file.

```js
const Note = require('../models/note')

const initialNotes = [
  {
    content: 'HTML is easy',
    important: false
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true
  }
]

const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon' })
  await note.save()
  await note.deleteOne()

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

The module defines the _notesInDb_ function that can be used for checking the notes stored in the database. The _initialNotes_ array containing the initial database state is also in the module. We also define the _nonExistingId_ function ahead of time, which can be used for creating a database object ID that does not belong to any note object in the database.

Our tests can now use the helper module and be changed like this:

```js
const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper') // highlight-line
const Note = require('../models/note')

const api = supertest(app)

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

  assert.strictEqual(response.body.length, helper.initialNotes.length) // highlight-line
})

test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes')

  const contents = response.body.map(e => e.content)
  assert(contents.includes('HTML is easy'))
})

test('a valid note can be added ', async () => {
  const newNote = {
    content: 'async/await simplifies making async calls',
    important: true,
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const notesAtEnd = await helper.notesInDb() // highlight-line
  assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1) // highlight-line

  const contents = notesAtEnd.map(n => n.content) // highlight-line
  assert(contents.includes('async/await simplifies making async calls'))
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

  assert.strictEqual(notesAtEnd.length, helper.initialNotes.length) // highlight-line
})

after(async () => {
  await mongoose.connection.close()
})
```

The code using promises works and the tests pass. We are ready to refactor our code to use the async/await syntax.

The route responsible for adding a new note

```js
notesRouter.post('/', (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note
    .save()
    .then((savedNote) => {
      response.status(201).json(savedNote)
    })
    .catch((error) => next(error))
})
```

changes as follows:

```js
notesRouter.post('/', async (request, response) => { // highlight-line
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  // highlight-start
  const savedNote = await note.save()
  response.status(201).json(savedNote)
  // highlight-end
})
```

You need to add the _async_ keyword at the beginning of the handler to enable the use of _async/await_ syntax. The code becomes much simpler.

Notably, possible errors no longer need to be forwarded separately for handling. In code using promises, a possible error was passed to the error-handling middleware like this:

```js
  note
    .save()
    .then((savedNote) => {
      response.json(savedNote)
    })
    .catch((error) => next(error)) // highlight-line
```

When using _async/await_ syntax, Express will [automatically call](https://expressjs.com/en/guide/error-handling.html) the error-handling middleware if an await statement throws an error or the awaited promise is rejected. This makes the final code even cleaner.

**Note:** This feature is available starting from Express version 5. If you installed Express as a dependency before March 31, 2025, you might still be using version 4. You can check your project's Express version in the _package.json_ file. If you have an older version, update to version 5 with the following command:

 ```bash
 npm install express@5 
 ```

### Refactoring the route responsible for fetching a single note

Next, let's write a test for viewing the details of a single note. The code highlights the actual API operation being performed:

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

  assert.deepStrictEqual(resultNote.body, noteToView)
})
```

First, the test fetches a single note from the database. Then, it checks that the specific note can be retrieved through the API. Finally, it verifies that the content of the fetched note is as expected.

There is one point worth noting in the test. Instead of the previously used method [strictEqual](https://nodejs.org/api/assert.html#assertstrictequalactual-expected-message), the method [deepStrictEqual](https://nodejs.org/api/assert.html#assertdeepstrictequalactual-expected-message) is used:

```js
assert.deepStrictEqual(resultNote.body, noteToView)
```

The reason for this is that _strictEqual_ uses the method [Object.is](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) to compare similarity, i.e. it compares whether the objects are the same. In our case, we want to check that the contents of the objects, i.e. the values of their fields, are the same. For this purpose _deepStrictEqual_ is suitable.

The tests pass and we can safely refactor the tested route to use async/await:

```js
notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})
```

### Refactoring the route responsible for deleting a note

Let's also add a test for the route that handles deleting a note:

```js
test('a note can be deleted', async () => {
  const notesAtStart = await helper.notesInDb()
  const noteToDelete = notesAtStart[0]

  await api
    .delete(`/api/notes/${noteToDelete.id}`)
    .expect(204)

  const notesAtEnd = await helper.notesInDb()

  const contents = notesAtEnd.map(n => n.content)
  assert(!contents.includes(noteToDelete.content))

  assert.strictEqual(notesAtEnd.length, helper.initialNotes.length - 1)
})
```

The test is structured similarly to the one that checks viewing a single note. First, a single note is fetched from the database, then its deletion via the API is tested. Finally, it is verified that the note no longer exists in the database and that the total number of notes has decreased by one.

The tests still pass, so we can safely proceed with refactoring the route:

```js
notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndDelete(request.params.id)
  response.status(204).end()
})
```

You can find the code for our current application in its entirety in the <i>part4-4</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-4).

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

The function saves the first two notes from the _helper.initialNotes_ array into the database with two separate operations. The solution is alright, but there's a better way of saving multiple objects to the database:

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

```
cleared
done
entered test
saved
saved
```

Despite our use of the async/await syntax, our solution does not work as we expected it to. The test execution begins before the database is initialized!

The problem is that each iteration of the _forEach_ loop generates its own asynchronous operation, and the _beforeEach_ function does not wait for their completion. In other words, the await commands inside the _forEach_ loop are not part of the _beforeEach_ function but are instead in separate functions, which _beforeEach_ does not wait for. Additionally, [the _forEach_ method expects a synchronous function as its parameter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#description), so the _async/await_ structure does not work correctly within it.

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

The [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) method can be used for transforming an array of promises into a single promise, that will be <i>fulfilled</i> once every promise in the array passed to it as an argument is resolved. The last line of code <em>await Promise.all(promiseArray)</em> waits until every promise for saving a note is finished, meaning that the database has been initialized.

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

However, there is an even simpler way to implement the _beforeEach_ function. The easiest way to handle the situation is by utilizing Mongoose's built-in method _insertMany_:

```js
beforeEach(async () => {
  await Note.deleteMany({})
  await Note.insertMany(helper.initialNotes) // highlight-line
})
```

The code for our application can be found on [GitHub](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-5), branch <i>part4-5</i>.

### A true full stack developer's oath

Making tests brings yet another layer of challenge to programming. We have to update our full stack developer oath to remind you that systematicity is also key when developing tests.

So we should once more extend our oath:

Full stack development is <i> extremely hard</i>, that is why I will use all the possible means to make it easier

- I will have my browser developer console open all the time
- I will use the network tab of the browser dev tools to ensure that frontend and backend are communicating as I expect
- I will constantly keep an eye on the state of the server to make sure that the data sent there by the frontend is saved as I expect
- I will keep an eye on the database: does the backend save data there in the right format
- I will progress in small steps
- <i>I will write lots of _console.log_ statements to make sure I understand how the code and the tests behave and to help pinpoint problems</i>
- If my code does not work, I will not write more code. Instead, I start deleting the code until it works or just return to a state when everything is still working
- <i>If a test does not pass, I make sure that the tested functionality for sure works in the application</i>
- When I ask for help in the course Discord channel or elsewhere I formulate my questions properly, see [here](/en/part0/general_info#how-to-get-help-in-discord) how to ask for help

</div>

<div class="tasks">

### Exercises 4.8.-4.12.

**Warning:** If you find yourself using async/await and <i>then</i> methods in the same code, it is almost guaranteed that you are doing something wrong. Use one or the other and don't mix the two.

#### 4.8: Blog List Tests, step 1

Use the SuperTest library for writing a test that makes an HTTP GET request to the <i>/api/blogs</i> URL. Verify that the blog list application returns the correct amount of blog posts in the JSON format.

Once the test is finished, refactor the route handler to use the async/await syntax instead of promises.

Notice that you will have to make similar changes to the code that were made [in the material](/en/part4/testing_the_backend#test-environment), like defining the test environment so that you can write tests that use separate databases.

**NB:** when you are writing your tests **<i>it is better to not execute them all</i>**, only execute the ones you are working on. Read more about this [here](/en/part4/testing_the_backend#running-tests-one-by-one).

#### 4.9: Blog List Tests, step 2

Write a test that verifies that the unique identifier property of the blog posts is named <i>id</i>, by default the database names the property <i>_id</i>.

Make the required changes to the code so that it passes the test. The [toJSON](/en/part3/saving_data_to_mongo_db#connecting-the-backend-to-a-database) method discussed in part 3 is an appropriate place for defining the <i>id</i> parameter.

#### 4.10: Blog List Tests, step 3

Write a test that verifies that making an HTTP POST request to the <i>/api/blogs</i> URL successfully creates a new blog post. At the very least, verify that the total number of blogs in the system is increased by one. You can also verify that the content of the blog post is saved correctly to the database.

Once the test is finished, refactor the operation to use async/await instead of promises.

#### 4.11*: Blog List Tests, step 4

Write a test that verifies that if the <i>likes</i> property is missing from the request, it will default to the value 0. Do not test the other properties of the created blogs yet.

Make the required changes to the code so that it passes the test.

#### 4.12*: Blog List tests, step 5

Write tests related to creating new blogs via the <i>/api/blogs</i> endpoint, that verify that if the <i>title</i> or <i>url</i> properties are missing from the request data, the backend responds to the request with the status code <i>400 Bad Request</i>.

Make the required changes to the code so that it passes the test.

</div>

<div class="content">

### Refactoring tests

Our test coverage is currently lacking. Some requests like <i>GET /api/notes/:id</i> and <i>DELETE /api/notes/:id</i> aren't tested when the request is sent with an invalid id. The grouping and organization of tests could also use some improvement, as all tests exist on the same "top level" in the test file. The readability of the test would improve if we group related tests with <i>describe</i> blocks.

Below is an example of the test file after making some minor improvements:

```js
const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Note = require('../models/note')

const api = supertest(app)

describe('when there is initially some notes saved', () => {
  beforeEach(async () => {
    await Note.deleteMany({})
    await Note.insertMany(helper.initialNotes)
  })

  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all notes are returned', async () => {
    const response = await api.get('/api/notes')

    assert.strictEqual(response.body.length, helper.initialNotes.length)
  })

  test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes')

    const contents = response.body.map(e => e.content)
    assert(contents.includes('HTML is easy'))
  })

  describe('viewing a specific note', () => {
    test('succeeds with a valid id', async () => {
      const notesAtStart = await helper.notesInDb()
      const noteToView = notesAtStart[0]

      const resultNote = await api
        .get(`/api/notes/${noteToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(resultNote.body, noteToView)
    })

    test('fails with statuscode 404 if note does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()

      await api.get(`/api/notes/${validNonexistingId}`).expect(404)
    })

    test('fails with statuscode 400 id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api.get(`/api/notes/${invalidId}`).expect(400)
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
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const notesAtEnd = await helper.notesInDb()
      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1)

      const contents = notesAtEnd.map(n => n.content)
      assert(contents.includes('async/await simplifies making async calls'))
    })

    test('fails with status code 400 if data invalid', async () => {
      const newNote = { important: true }

      await api.post('/api/notes').send(newNote).expect(400)

      const notesAtEnd = await helper.notesInDb()

      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length)
    })
  })

  describe('deletion of a note', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const notesAtStart = await helper.notesInDb()
      const noteToDelete = notesAtStart[0]

      await api.delete(`/api/notes/${noteToDelete.id}`).expect(204)

      const notesAtEnd = await helper.notesInDb()

      const contents = notesAtEnd.map(n => n.content)
      assert(!contents.includes(noteToDelete.content))

      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length - 1)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
```

The test output in the console is grouped according to the <i>describe</i> blocks:

![node:test output showing grouped describe blocks](../../images/4/7new.png)

There is still room for improvement, but it is time to move forward.

This way of testing the API, by making HTTP requests and inspecting the database with Mongoose, is by no means the only nor the best way of conducting API-level integration tests for server applications. There is no universal best way of writing tests, as it all depends on the application being tested and available resources.

You can find the code for our current application in its entirety in the <i>part4-6</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-6).

</div>

<div class="tasks">

### Exercises 4.13.-4.14.

#### 4.13 Blog List Expansions, step 1

Implement functionality for deleting a single blog post resource.

Use the async/await syntax. Follow [RESTful](/en/part3/node_js_and_express#rest) conventions when defining the HTTP API.

Implement tests for the functionality.

#### 4.14 Blog List Expansions, step 2

Implement functionality for updating the information of an individual blog post.

Use async/await.

The application mostly needs to update the number of <i>likes</i> for a blog post. You can implement this functionality the same way that we implemented updating notes in [part 3](/en/part3/saving_data_to_mongo_db#other-operations).

Implement tests for the functionality.

</div>
