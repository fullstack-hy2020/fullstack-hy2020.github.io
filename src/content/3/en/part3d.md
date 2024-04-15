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

One smarter way of validating the format of the data before it is stored in the database is to use the [validation](https://mongoosejs.com/docs/validation.html) functionality available in Mongoose.

We can define specific validation rules for each field in the schema:

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

The <i>content</i> field is now required to be at least five characters long and it is set as required, meaning that it can not be missing. We have not added any constraints to the <i>important</i> field, so its definition in the schema has not changed.

The <i>minLength</i> and <i>required</i> validators are [built-in](https://mongoosejs.com/docs/validation.html#built-in-validators) and provided by Mongoose. The Mongoose [custom validator](https://mongoosejs.com/docs/validation.html#custom-validators) functionality allows us to create new validators if none of the built-in ones cover our needs.

If we try to store an object in the database that breaks one of the constraints, the operation will throw an exception. Let's change our handler for creating a new note so that it passes any potential exceptions to the error handler middleware:

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

![postman showing error message](../../images/3/50.png)

We notice that the backend has now a problem: validations are not done when editing a note.
The [documentation](https://mongoosejs.com/docs/validation.html#update-validators) addresses the issue by explaining that validations are not run by default when <i>findOneAndUpdate</i> and related methods are executed.

The fix is easy. Let us also reformulate the route code a bit:

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

The application should work almost as-is in Fly.io/Render. We do not have to generate a new production build of the frontend since changes thus far were only on our backend.

The environment variables defined in dotenv will only be used when the backend is not in <i>production mode</i>, i.e. Fly.io or Render.

For production, we have to set the database URL in the service that is hosting our app.

In Fly.io that is done _fly secrets set_:

```bash
fly secrets set MONGODB_URI='mongodb+srv://fullstack:thepasswordishere@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority'
```

When the app is being developed, it is more than likely that something fails. Eg. when I deployed my app for the first time with the database, not a single note was seen:

![browser showing no notes appearing](../../images/3/fly-problem1.png)

The network tab of the browser console revealed that fetching the notes did not succeed, the request just remained for a long time in the _pending_ state until it failed with status code 502.

The browser console has to be open <i>all the time!</i>

It is also vital to follow continuously the server logs. The problem became obvious when the logs were opened with  _fly logs_:

![fly.io server log showing connecting to undefined](../../images/3/fly-problem3.png)

The database url was _undefined_, so the command *fly secrets set MONGODB\_URI* was forgotten.

You will also need to whitelist the the fly.io app's IP address in MongoDB Atlas. If you don't MongoDB will refuse the connection.

Sadly, fly.io does not provide you a dedicated IPv4 address for your app, so you will need to allow all IP addresses in MongoDB Atlas.

When using Render, the database url is given by defining the proper env in the dashboard:

![render dashboard showing the MONGODB_URI env variable](../../images/3/render-env.png)

The Render Dashboard shows the server logs:

![render dashboard with arrow pointing to server running on port 10000](../../images/3/r7.png)

You can find the code for our current application in its entirety in the <i>part3-6</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-6).

</div>

<div class="tasks">

### Exercises 3.19.-3.21.

#### 3.19*: Phonebook database, step 7

Expand the validation so that the name stored in the database has to be at least three characters long.

Expand the frontend so that it displays some form of error message when a validation error occurs. Error handling can be implemented by adding a <em>catch</em> block as shown below:

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

You can display the default error message returned by Mongoose, even though they are not as readable as they could be:

![phonebook screenshot showing person validation failure](../../images/3/56e.png)

**NB:** On update operations, mongoose validators are off by default. [Read the documentation](https://mongoosejs.com/docs/validation.html) to determine how to enable them.

#### 3.20*: Phonebook database, step 8

Add validation to your phonebook application, which will make sure that phone numbers are of the correct form. A phone number must:

- have length of 8 or more
- be formed of two parts that are separated by -, the first part has two or three numbers and the second part also consists of numbers
    - eg. 09-1234556 and 040-22334455 are valid phone numbers
    - eg. 1234556, 1-22334455 and 10-22-334455 are invalid

Use a [Custom validator](https://mongoosejs.com/docs/validation.html#custom-validators) to implement the second part of the validation.

If an HTTP POST request tries to add a person with an invalid phone number, the server should respond with an appropriate status code and error message.

#### 3.21 Deploying the database backend to production

Generate a new "full stack" version of the application by creating a new production build of the frontend, and copying it to the backend repository. Verify that everything works locally by using the entire application from the address <http://localhost:3001/>.

Push the latest version to Fly.io/Render and verify that everything works there as well.

**NOTE**: you should deploy the BACKEND to the cloud service. If you are using Fly.io the commands should be run in the root directory of the backend (that is, in the same directory where the backend package.json is). In case of using Render, the backend must be in the root of your repository.

You shall NOT be deploying the frontend directly at any stage of this part. It is just backend repository that is deployed throughout the whole part, nothing else.

</div>

<div class="content">

### Lint

Before we move on to the next part, we will take a look at an important tool called [lint](<https://en.wikipedia.org/wiki/Lint_(software)>). Wikipedia says the following about lint:

> <i>Generically, lint or a linter is any tool that detects and flags errors in programming languages, including stylistic errors. The term lint-like behavior is sometimes applied to the process of flagging suspicious language usage. Lint-like tools generally perform static analysis of source code.</i>

In compiled statically typed languages like Java, IDEs like NetBeans can point out errors in the code, even ones that are more than just compile errors. Additional tools for performing [static analysis](https://en.wikipedia.org/wiki/Static_program_analysis) like [checkstyle](https://checkstyle.sourceforge.io), can be used for expanding the capabilities of the IDE to also point out problems related to style, like indentation.

In the JavaScript universe, the current leading tool for static analysis (aka "linting") is [ESlint](https://eslint.org/).

Let's install ESlint as a development dependency to the notes backend project with the command:

```bash
npm install eslint --save-dev
```

After this we can initialize a default ESlint configuration with the command:

```bash
npx eslint --init
```

We will answer all of the questions:

![terminal output from ESlint init](../../images/3/52new.png)

The configuration will be saved in the _.eslintrc.js_ file. We will change _browser_ to _node_ in the _env_ configuration:

```js
module.exports = {
    "env": {
        "commonjs": true,
        "es2021": true,
        "node": true // highlight-line
    },
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "rules": {
    }
}
```

Let's change the configuration a bit. Install a [plugin](https://eslint.style/packages/js) that defines a set of code style-related rules:

```
npm install --save-dev @stylistic/eslint-plugin-js
```

Enable the plugin and add an "extends" definition and four code style rules:

```js
module.exports = {
    // ...
    'plugins': [
        '@stylistic/js'
    ],
    'extends': 'eslint:recommended',
    'rules': {
        '@stylistic/js/indent': [
            'error',
            2
        ],
        '@stylistic/js/linebreak-style': [
            'error',
            'unix'
        ],
        '@stylistic/js/quotes': [
            'error',
            'single'
        ],
        '@stylistic/js/semi': [
            'error',
            'never'
        ],
    }
}
```

Extends _eslint:recommended_ adds a [set](https://eslint.org/docs/latest/rules/) of recommended rules to the project. In addition, rules for indentation, line breaks, hyphens and semicolons have been added. These four rules are all defined in the [Eslint styles plugin](https://eslint.style/packages/js).

Inspecting and validating a file like _index.js_ can be done with the following command:

```bash
npx eslint index.js
```

It is recommended to create a separate _npm script_ for linting:

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

Now the _npm run lint_ command will check every file in the project.

Also the files in the <em>dist</em> directory get checked when the command is run. We do not want this to happen, and we can accomplish this by creating an [.eslintignore](https://eslint.org/docs/latest/use/configure/ignore#the-eslintignore-file) file in the project's root with the following contents:

```bash
dist
```

This causes the entire <em>dist</em> directory to not be checked by ESlint.

Lint has quite a lot to say about our code:

![terminal output of ESlint errors](../../images/3/53ea.png)

Let's not fix these issues just yet.

A better alternative to executing the linter from the command line is to configure an <i>eslint-plugin</i> to the editor, that runs the linter continuously. By using the plugin you will see errors in your code immediately. You can find more information about the Visual Studio ESLint plugin [here](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint).

The VS Code ESlint plugin will underline style violations with a red line:

![Screenshot of vscode ESlint plugin showing errors](../../images/3/54a.png)

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

This includes a rule that warns about _console.log_ commands. [Disabling](https://eslint.org/docs/latest/use/configure/rules) a rule can be accomplished by defining its "value" as 0 in the configuration file. Let's do this for the <i>no-console</i> rule in the meantime.

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

![terminal output from npm run lint](../../images/3/55.png)

If there is something wrong in your configuration file, the lint plugin can behave quite erratically.

Many companies define coding standards that are enforced throughout the organization through the ESlint configuration file. It is not recommended to keep reinventing the wheel over and over again, and it can be a good idea to adopt a ready-made configuration from someone else's project into yours. Recently many projects have adopted the Airbnb [Javascript style guide](https://github.com/airbnb/javascript) by taking Airbnb's [ESlint](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb) configuration into use.

You can find the code for our current application in its entirety in the <i>part3-7</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-7).

</div>

<div class="tasks">

### Exercise 3.22.

#### 3.22: Lint configuration

Add ESlint to your application and fix all the warnings.

This was the last exercise of this part of the course. It's time to push your code to GitHub and mark all of your finished exercises to the [exercise submission system](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

</div>
