---
mainImage: ../../../images/part-3.svg
part: 3
letter: d
lang: en
---

<div class="content">


There are usually constraints that we want to apply to the data that is stored in our application's database. Our application shouldn't accept notes that have a missing or empty <i>content</i> property. The validity of the note is checked in the route handler:

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


If the note does not have the <i>content</i> property, we respond to the request with the status code <i>400 bad request</i>.


One smarter way of validating the format of the data before it is stored in the database, is to use the [validation](https://mongoosejs.com/docs/validation.html) functionality available in Mongoose.


We can define specific validation rules for each field in the schema:

```js
const noteSchema = new mongoose.Schema({
  // highlight-start
  content: {
    type: String,
    minlength: 5,
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


The <i>content</i> field is now required to be at least five characters long. The <i>date</i> field is set as required, meaning that it can not be missing. The same constraint is also applied to the <i>content</i> field, since the minimum length constraint allows the field to be missing. We have not added any constraints to the <i>important</i> field, so its definition in the schema has not changed.


The <i>minlength</i> and <i>required</i> validators are [built-in](https://mongoosejs.com/docs/validation.html#built-in-validators) and provided by Mongoose. The Mongoose [custom validator](https://mongoosejs.com/docs/validation.html#custom-validators) functionality allows us to create new validators, if none of the built-in ones cover our needs.


If we try to store an object in the database that breaks one of the constraints, the operation will throw an exception. Let's change our handler for creating a new note so that it passes any potential exceptions to the error handler middleware:

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
      response.json(savedNote.toJSON())
    })
    .catch(error => next(error)) // highlight-line
})
```


Let's expand the error handler to deal with these validation errors:

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


When validating an object fails, we return the following default error message from Mongoose:

![](../../images/3/50.png)

### Promise chaining

Many of the route handlers changed the response data into the right format by implicitly calling the _toJSON_ method from _response.json_. For the sake of an example, we can also perform this operation explicitly by calling the _toJSON_ method on the object passed as a parameter to _then_:

```js
app.post('/api/notes', (request, response, next) => {
  // ...

  note.save()
    .then(savedNote => {
      response.json(savedNote.toJSON())
    })
    .catch(error => next(error)) 
})
```

We can accomplish the same functionality in a much cleaner way with [promise chaining](https://javascript.info/promise-chaining):

```js
app.post('/api/notes', (request, response, next) => {
  // ...

  note
    .save()
    // highlight-start
    .then(savedNote => {
      return savedNote.toJSON()
    })
    .then(savedAndFormattedNote => {
      response.json(savedAndFormattedNote)
    }) 
    // highlight-end
    .catch(error => next(error)) 
})
```


In the first _then_ we receive _savedNote_ object returned by Mongoose and format it. The result of the operation is returned. Then as [we discussed earlier](/en/part2/altering_data_in_server#extracting-communication-with-the-backend-into-a-separate-module), the _then_ method of a promise also returns a promise and we can access the formatted note by registering a new callback function with the _then_ method.

We can clean up our code even more by using the more compact syntax for arrow functions:

```js
app.post('/api/notes', (request, response, next) => {
  // ...

  note
    .save()
    .then(savedNote => savedNote.toJSON()) // highlight-line
    .then(savedAndFormattedNote => {
      response.json(savedAndFormattedNote)
    }) 
    .catch(error => next(error)) 
})
```

In this example, Promise chaining does not provide much of a benefit. The situation would change if there were many asynchronous operations that had to be done in sequence. We will not dive further into the topic. In the next part of the course we will learn about the <i>async/await</i> syntax in JavaScript, that will make writing subsequent asynchronous operations a lot easier.

### Deploying the database backend to production

The application should work almost as-is in Heroku. We do have to generate a new production build of the frontend due to the changes that we have made to our frontend. 

The environment variables defined in dotenv will only be used when the backend is not in <i>production mode</i>, i.e. Heroku.

We defined the environment variables for development in file <i>.env</i>, but the environment variable that defines the database URL in production should be set to Heroku with the _heroku config:set_ command.

```bash
$ heroku config:set MONGODB_URI=mongodb+srv://fullstack:secretpasswordhere@cluster0-ostce.mongodb.net/note-app?retryWrites=true
```

**NB:** if the command causes an error, give the value of MONGODB_URI in apostrophes:

```bash
$ heroku config:set MONGODB_URI='mongodb+srv://fullstack:secretpasswordhere@cluster0-ostce.mongodb.net/note-app?retryWrites=true'
```

The application should now work. Sometimes things don't go according to plan. If there are problems, <i>heroku logs</i> will be there to help. My own application did not work after making the changes. The logs showed the following:

![](../../images/3/51a.png)

For some reason the URL of the database was undefined. The <i>heroku config</i> command revealed that I had accidentally defined the URL to the <em>MONGO\_URL</em> environment variable, when the code expected it to be in <em>MONGODB\_URI</em>.

You can find the code for our current application in its entirety in the <i>part3-5</i> branch of [this github repository](https://github.com/fullstack-hy2019/part3-notes-backend/tree/part3-5).
</div>

</div>

<div class="tasks">


### Exercises 3.19.-3.21.


#### 3.19: Phonebook database, step7


Add validation to your phonebook application, that will make sure that a newly added person has a unique name. Our current frontend won't allow users to try and create duplicates, but we can attempt to create them directly with Postman or the VS Code REST client.


Mongoose does not offer a built-in validator for this purpose. Install the [mongoose-unique-validator](https://github.com/blakehaswell/mongoose-unique-validator#readme) package with npm and use it instead.

If an HTTP POST request tries to add a name that is already in the phonebook, the server must respond with an appropriate status code and error message.

#### 3.20*: Phonebook database, step8

Expand the validation so that the name stored in the database has to be at least three characters long, and the phone number must have at least 8 digits.


Expand the frontend so that it displays some form of error message when a validation error occurs. Error handling can be implemented by adding a <em>catch</em> block as shown below:


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


You can display the default error message returned by Mongoose, even though they are not as readable as they could be:

![](../../images/3/56e.png)

**NB:** On update operations, mongoose validators are off by default. [Read the documentation](https://mongoosejs.com/docs/validation.html) to determine how to enable them.

#### 3.21 Deploying the database backend to production


Generate a new "full stack" version of the application by creating a new production build of the frontend, and copy it to the backend repository. Verify that everything works locally by using the entire application from the address <http://localhost:3001/>.


Push the latest version to Heroku and verify that everything works there as well.

</div>

<div class="content">


### Lint


Before we move onto the next part, we will take a look at an important tool called [lint](<https://en.wikipedia.org/wiki/Lint_(software)>). Wikipedia says the following about lint:

> <i>Generically, lint or a linter is any tool that detects and flags errors in programming languages, including stylistic errors. The term lint-like behavior is sometimes applied to the process of flagging suspicious language usage. Lint-like tools generally perform static analysis of source code.</i>


In compiled statically typed languages like Java, IDEs like NetBeans can point out errors in the code, even ones that are more than just compile errors. Additional tools for performing [static analysis](https://en.wikipedia.org/wiki/Static_program_analysis) like [checkstyle](https://checkstyle.sourceforge.io), can be used for expanding the capabilities of the IDE to also point out problems related to style, like indentation.


In the JavaScript universe, the current leading tool for static analysis aka. "linting" is [ESlint](https://eslint.org/).

Let's install ESlint as a development dependency to the backend project with the command:

```bash
npm install eslint --save-dev
```


After this we can initialize a default ESlint configuration with the command:

```bash
node_modules/.bin/eslint --init
```


We will answer all of the questions:

![](../../images/3/52be.png)


The configuration will be saved in the _.eslintrc.js_ file:

```js
module.exports = {
    'env': {
        'commonjs': true,
        'es6': true,
        'node': true
    },
    'extends': 'eslint:recommended',
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly'
    },
    'parserOptions': {
        'ecmaVersion': 2018
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


Let's immediately change the rule concerning indentation, so that the indentation level is two spaces.

```js
"indent": [
    "error",
    2
],
```


Inspecting and validating a file like _index.js_ can be done with the following command:

```bash
node_modules/.bin/eslint index.js
```

It is recommended to create a separate _npm script_ for linting:

```json
{
  // ...
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    // ...
    "lint": "eslint ."
  },
  // ...
}
```


Now the _npm run lint_ command will check every file in the project.


Also the files in the <em>build</em> directory get checked when the command is run. We do not want this to happen, and we can accomplish this by creating an [.eslintignore](https://eslint.org/docs/user-guide/configuring#ignoring-files-and-directories) file in the project's root with the following contents:

```bash
build
```

This causes the entire <em>build</em> directory to not be checked by ESlint.

Lint has quite a lot to say about our code:

![](../../images/3/53ea.png)

Let's not fix these issues just yet.

A better alternative to executing the linter from the command line is to configure a  <i>eslint-plugin</i> to the editor, that runs the linter continuously. By using the plugin you will see errors in your code immediately. You can find more information about the Visual Studio ESLint plugin [here](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint).


The VS Code ESlint plugin will underline style violations with a red line:

![](../../images/3/54a.png)


This makes errors easy to spot and fix right away.


ESlint has a vast array of [rules](https://eslint.org/docs/rules/) that are easy to take into use by editing the <i>.eslintrc.js</i> file.


Let's add the [eqeqeq](https://eslint.org/docs/rules/eqeqeq) rule that warns us, if equality is checked with anything but the triple equals operator. The rule is added under the <i>rules</i> field in the configuration file.

```js
{
  // ...
  'rules': {
    // ...
   'eqeqeq': 'error',
  },
}
```

While we're at it, let's make a few other changes to the rules.

Let's prevent unnecessary [trailing spaces](https://eslint.org/docs/rules/no-trailing-spaces) at the ends of lines, let's require that [there is always a space before and after curly braces](https://eslint.org/docs/rules/object-curly-spacing), and let's also demand a consistent use of whitespaces in the function parameters of arrow functions.

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


Our default configuration takes a bunch of predetermined rules into use from <i>eslint:recommended</i>:

```bash
'extends': 'eslint:recommended',
```


This includes a rule that warns about _console.log_ commands. [Disabling](https://eslint.org/docs/user-guide/configuring#configuring-rules) a rule can be accomplished by defining its "value" as 0 in the configuration file. Let's do this for the <i>no-console</i> rule in the meantime.

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

**NB** when you make changes to the <i>.eslintrc.js</i> file, it is recommended to run the linter from the command line. This will verify that the configuration file is correctly formatted:

![](../../images/3/55.png)


If there is something wrong in your configuration file, the lint plugin can behave quite erratically.


Many companies define coding standards that are enforced throughout the organization through the ESlint configuration file. It is not recommended to keep reinventing the wheel over and over again, and it can be a good idea to adopt a ready-made configuration from someone else's project into yours. Recently many projects have adopted the Airbnb [Javascript style guide](https://github.com/airbnb/javascript) by taking Airbnb's [ESlint](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb) configuration into use.


You can find the code for our current application in its entirety in the <i>part3-7</i> branch of [this github repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-7).
</div>

<div class="tasks">


### Exercise 3.22.


#### 3.22: Lint configuration


Add ESlint to your application and fix all the warnings.

This was the last exercise of this part of the course. It's time to push your code to GitHub and mark all of your finished exercises to the [exercise submission system](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

</div>
