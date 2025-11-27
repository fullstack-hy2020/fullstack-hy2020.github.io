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
  if (!body.content) {
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

### Deploying the database backend to production

The application should work almost as-is in Fly.io/Render. We do not have to generate a new production build of the frontend since changes thus far were only on our backend.

The environment variables defined in dotenv will only be used when the backend is not in <i>production mode</i>, i.e. Fly.io or Render.

For production, we have to set the database URL in the service that is hosting our app.

In Fly.io that is done _fly secrets set_:

```bash
fly secrets set MONGODB_URI='mongodb+srv://fullstack:thepasswordishere@cluster0.a5qfl.mongodb.net/noteApp?retryWrites=true&w=majority'
```

When the app is being developed, it is more than likely that something fails. Eg. when I deployed my app for the first time with the database, not a single note was seen:

![browser showing no notes appearing](../../images/3/fly-problem1.png)

The network tab of the browser console revealed that fetching the notes did not succeed, the request just remained for a long time in the _pending_ state until it failed with status code 502.

The browser console has to be open <i>all the time!</i>

It is also vital to follow continuously the server logs. The problem became obvious when the logs were opened with  _fly logs_:

![fly.io server log showing connecting to undefined](../../images/3/fly-problem3.png)

The database url was _undefined_, so the command *fly secrets set MONGODB\_URI* was forgotten.

You will also need to whitelist the fly.io app's IP address in MongoDB Atlas. If you don't MongoDB will refuse the connection.

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

Generate a new "full stack" version of the application by creating a new production build of the frontend, and copying it to the backend directory. Verify that everything works locally by using the entire application from the address <http://localhost:3001/>.

Push the latest version to Fly.io/Render and verify that everything works there as well.

**NOTE:** You shall NOT be deploying the frontend directly at any stage of this part. Only the backend repository is deployed throughout the whole part. The frontend production build is added to the backend repository, and the backend serves it as described in the section [Serving static files from the backend](/en/part3/deploying_app_to_internet#serving-static-files-from-the-backend).

</div>

<div class="content">

### Lint

Before we move on to the next part, we will take a look at an important tool called [lint](<https://en.wikipedia.org/wiki/Lint_(software)>). Wikipedia says the following about lint:

> <i>Generically, lint or a linter is any tool that detects and flags errors in programming languages, including stylistic errors. The term lint-like behavior is sometimes applied to the process of flagging suspicious language usage. Lint-like tools generally perform static analysis of source code.</i>

In compiled statically typed languages like Java, IDEs like NetBeans can point out errors in the code, even ones that are more than just compile errors. Additional tools for performing [static analysis](https://en.wikipedia.org/wiki/Static_program_analysis) like [checkstyle](https://checkstyle.sourceforge.io), can be used for expanding the capabilities of the IDE to also point out problems related to style, like indentation.

In the JavaScript universe, the current leading tool for static analysis (aka "linting") is [ESlint](https://eslint.org/).

Let's add ESLint as a <i>development dependency</i> for the backend. Development dependencies are tools that are only needed during the development of the application. For example, tools related to testing are such dependencies. When the application is run in production mode, development dependencies are not needed.

Install ESLint as a development dependency for the backend with the command:

```bash
npm install eslint @eslint/js --save-dev
```

The contents of the package.json file will change as follows:

```js
{
  //...
  "dependencies": {
    "dotenv": "^16.4.7",
    "express": "^5.1.0",
    "mongoose": "^8.11.0"
  },
  "devDependencies": { // highlight-line
    "@eslint/js": "^9.22.0", // highlight-line
    "eslint": "^9.22.0" // highlight-line
  }
}
```

The command added a <i>devDependencies</i> section to the file and included the packages <i>eslint</i> and <i>@eslint/js</i>, and installed the required libraries into the <i>node_modules</i> directory.

After this we can initialize a default ESlint configuration with the command:

```bash
npx eslint --init
```

We will answer all of the questions:

![terminal output from ESlint init](../../images/3/lint1.png)

The configuration will be saved in the generated _eslint.config.mjs_ file.

### Formatting the Configuration File

Let's reformat the configuration file _eslint.config.mjs_ from its current form to the following:

```js
import globals from 'globals'

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...globals.node },
      ecmaVersion: 'latest',
    },
  },
]
```

So far, our ESLint configuration file defines the _files_ option with _["\*\*/\*.js"]_, which tells ESLint to look at all JavaScript files in our project folder. The _languageOptions_ property specifies options related to language features that ESLint should expect, in which we defined the _sourceType_ option as "commonjs". This indicates that the JavaScript code in our project uses the CommonJS module system, allowing ESLint to parse the code accordingly.  

The _globals_ property specifies global variables that are predefined. The spread operator applied here tells ESLint to include all global variables defined in the _globals.node_ settings such as the _process_. In the case of browser code we would define here _globals.browser_ to allow browser specific global variables like _window_, and _document_.

Finally, the _ecmaVersion_ property is set to "latest". This sets the ECMAScript version to the latest available version, meaning ESLint will understand and properly lint the latest JavaScript syntax and features.

We want to make use of [ESLint's recommended](https://eslint.org/docs/latest/use/configure/configuration-files#using-predefined-configurations) settings along with our own. The _@eslint/js_ package we installed earlier provides us with predefined configurations for ESLint. We'll import it and enable it in the configuration file:

```js
import globals from 'globals'
import js from '@eslint/js' // highlight-line
// ...

export default [
  js.configs.recommended, // highlight-line
  {
    // ...
  },
]
```

We've added the _js.configs.recommended_ to the top of the configuration array, this ensures that ESLint's recommended settings are applied first before our own custom options.

Let's continue building the configuration file. Install a [plugin](https://eslint.style/packages/js) that defines a set of code style-related rules:

```bash
npm install --save-dev @stylistic/eslint-plugin
```

Import and enable the plugin, and add these four code style rules:

```js
import globals from 'globals'
import js from '@eslint/js'
import stylisticJs from '@stylistic/eslint-plugin' // highlight-line

export default [
  {
    // ...
    // highlight-start
    plugins: { 
      '@stylistic/js': stylisticJs,
    },
    rules: { 
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/linebreak-style': ['error', 'unix'],
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/semi': ['error', 'never'],
    }, 
    // highlight-end
  },
]
```

The [plugins](https://eslint.org/docs/latest/use/configure/plugins) property provides a way to extend ESLint's functionality by adding custom rules, configurations, and other capabilities that are not available in the core ESLint library. We've installed and enabled the _@stylistic/eslint-plugin_, which adds JavaScript stylistic rules for ESLint. In addition, rules for indentation, line breaks, quotes, and semicolons have been added. These four rules are all defined in the [Eslint styles plugin](https://eslint.style/packages/js).

**Note for Windows users:** The linebreak style is set to _unix_ in the style rules. It is recommended to use Unix-style linebreaks (_\n_) regardless of your operating system, as they are compatible with most modern operating systems and facilitate collaboration when multiple people are working on the same files. If you are using Windows-style linebreaks, ESLint will produce the following errors: <i>Expected linebreaks to be 'LF' but found 'CRLF'</i>. In this case, configure Visual Studio Code to use Unix-style linebreaks by following [this guide](https://stackoverflow.com/questions/48692741/how-can-i-make-all-line-endings-eols-in-all-files-in-visual-studio-code-unix).

### Running the Linter

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
    "dev": "node --watch index.js",
    "test": "echo \"Error: no test specified\" && exit 1",
    "lint": "eslint ." // highlight-line
    // ...
  },
  // ...
}
```

Now the _npm run lint_ command will check every file in the project.

Files in the <em>dist</em> directory also get checked when the command is run. We do not want this to happen, and we can accomplish this by adding an object with the [ignores](https://eslint.org/docs/latest/use/configure/ignore) property that specifies an array of directories and files we want to ignore.

```js
// ...
export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    // ...
  },
  // highlight-start
  { 
    ignores: ['dist/**'], 
  },
  // highlight-end
]
```

This causes the entire <em>dist</em> directory to not be checked by ESlint.

Lint has quite a lot to say about our code:

![terminal output of ESlint errors](../../images/3/53ea.png)

A better alternative to executing the linter from the command line is to configure an _eslint-plugin_ to the editor, that runs the linter continuously. By using the plugin you will see errors in your code immediately. You can find more information about the Visual Studio ESLint plugin [here](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint).

The VS Code ESlint plugin will underline style violations with a red line:

![Screenshot of vscode ESlint plugin showing errors](../../images/3/54a.png)

This makes errors easy to spot and fix right away.

### Adding More Style Rules

ESlint has a vast array of [rules](https://eslint.org/docs/rules/) that are easy to take into use by editing the _eslint.config.mjs_ file.

Let's add the [eqeqeq](https://eslint.org/docs/rules/eqeqeq) rule that warns us if equality is checked with anything but the triple equals operator. The rule is added under the rules field in the configuration file.

```js
export default [
  // ...
  rules: {
    // ...
   eqeqeq: 'error', // highlight-line
  },
  // ...
]
```

While we're at it, let's make a few other changes to the rules.

Let's prevent unnecessary [trailing spaces](https://eslint.org/docs/rules/no-trailing-spaces) at the ends of lines, require that [there is always a space before and after curly braces](https://eslint.org/docs/rules/object-curly-spacing), and also demand a consistent use of whitespaces in the function parameters of arrow functions.

```js
export default [
  // ...
  rules: {
    // ...
    eqeqeq: 'error',
    // highlight-start
    'no-trailing-spaces': 'error',
    'object-curly-spacing': ['error', 'always'],
    'arrow-spacing': ['error', { before: true, after: true }],
    // highlight-end
  },
]
```

Our default configuration takes a bunch of predefined rules into use from:

```js
// ...

export default [
  js.configs.recommended,
  // ...
]
```

This includes a rule that warns about <em>console.log</em> commands which we don't want to use. Disabling a rule can be accomplished by defining its "value" as 0 or _off_ in the configuration file. Let's do this for the _no-console_ rule in the meantime.

```js
[
  {
    // ...
    rules: {
      // ...
      eqeqeq: 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-console': 'off', // highlight-line
    },
  },
]
```

Disabling the no-console rule will allow us to use console.log statements without ESLint flagging them as issues. This can be particularly useful during development when you need to debug your code. Here's the complete configuration file with all the changes we have made so far:

```js
import globals from 'globals'
import js from '@eslint/js'
import stylisticJs from '@stylistic/eslint-plugin'

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...globals.node },
      ecmaVersion: 'latest',
    },
    plugins: {
      '@stylistic/js': stylisticJs,
    },
    rules: {
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/linebreak-style': ['error', 'unix'],
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/semi': ['error', 'never'],
      eqeqeq: 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-console': 'off',
    },
  },
  {
    ignores: ['dist/**'],
  },
]
```

**NB** when you make changes to the _eslint.config.mjs_ file, it is recommended to run the linter from the command line. This will verify that the configuration file is correctly formatted:

![terminal output from npm run lint](../../images/3/lint2.png)

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
