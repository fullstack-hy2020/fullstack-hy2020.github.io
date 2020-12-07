---
mainImage: ../../../images/part-3.svg
part: 3
letter: c
lang: en
---

<div class="content">

Before we move into the main topic of persisting data in a database, we will take a look at a few different ways of debugging Node applications.

### Debugging Node applications

Debugging Node applications is slightly more difficult than debugging JavaScript running in your browser. Printing to the console is a tried and true method, and it's always worth doing. There are people who think that more sophisticated methods should be used instead, but I disagree. Even the world's elite open source developers [use](https://tenderlovemaking.com/2016/02/05/i-am-a-puts-debuggerer.html) this [method](https://swizec.com/blog/javascript-debugging-slightly-beyond-console-log/swizec/6633).

#### Visual Studio Code

The Visual Studio Code debugger can be useful in some situations. You can launch the application in debugging mode like this:

![](../../images/3/35.png)

Note that the application shouldn't be running in another console, otherwise the port will already be in use.

__NB__ A newer version of Visual Studio Code may have _Run_ instead of _Debug_. Furthermore, you may have to configure your _launch.json_ file to start debugging. This can be done by choosing _Add Configuration..._ on the drop-down menu, which is located next to the green play button and above _VARIABLES_ menu, and select _Run "npm start" in a debug terminal_. For more detailed setup instructions, visit Visual Studio Code's [Debugging documentation](https://code.visualstudio.com/docs/editor/debugging).

Below you can see a screenshot where the code execution has been paused in the middle of saving a new note:

![](../../images/3/36e.png)

The execution has stopped at the <i>breakpoint</i> in line 63. In the console you can see the value of the <i>note</i> variable. In the top left window you can see other things related to the state of the application.

The arrows at the top can be used for controlling the flow of the debugger.

For some reason, I don't use the Visual Studio Code debugger a whole lot.

#### Chrome dev tools

Debugging is also possible with the Chrome developer console by starting your application with the command:

```bash
node --inspect index.js
```

You can access the debugger by clicking the green icon - the node logo - that appears in the Chrome developer console:

![](../../images/3/37.png)

The debugging view works the same way as it did with React applications. The <i>Sources</i> tab can be used for setting breakpoints where the execution of the code will be paused.

![](../../images/3/38eb.png)

All of the application's <i>console.log</i> messages will appear in the <i>Console</i> tab of the debugger. You can also inspect values of variables and execute your own JavaScript code.

![](../../images/3/39ea.png)

#### Question everything

Debugging Full Stack applications may seem tricky at first. Soon our application will also have a database in addition to the frontend and backend, and there will be many potential areas for bugs in the application.

When the application "does not work", we have to first figure out where the problem actually occurs. It's very common for the problem to exist in a place where you didn't expect it to, and it can take minutes, hours, or even days before you find the source of the problem.

The key is to be systematic. Since the problem can exist anywhere, <i>you must question everything</i>, and eliminate all possibilities one by one. Logging to the console, Postman, debuggers, and experience will help.

When bugs occur, <i>the worst of all possible strategies</i> is to continue writing code. It will guarantee that your code will soon have even more bugs, and debugging them will be even more difficult. The [stop and fix](http://gettingtolean.com/toyota-principle-5-build-culture-stopping-fix/#.Wjv9axP1WCQ) principle from Toyota Production Systems is very effective in this situation as well.

### MongoDB

In order to store our saved notes indefinitely, we need a database. Most of the courses taught at the University of Helsinki use relational databases. In this course we will use [MongoDB](https://www.mongodb.com/) which is a so-called [document database](https://en.wikipedia.org/wiki/Document-oriented_database).

Document databases differ from relational databases in how they organize data as well as the query languages they support. Document databases are usually categorized under the [NoSQL](https://en.wikipedia.org/wiki/NoSQL) umbrella term.

You can read more about document databases and NoSQL from the course material for [week 7](https://tikape-s18.mooc.fi/part7/) of the Introduction to Databases course. Unfortunately the material is currently only available in Finnish. 

Read now the chapters on [collections](https://docs.mongodb.com/manual/core/databases-and-collections/) and [documents](https://docs.mongodb.com/manual/core/document/) from the MongoDB manual to get a basic idea on how a document database stores data.

Naturally, you can install and run MongoDB on your own computer. However, the internet is also full of Mongo database services that you can use. Our preferred MongoDB provider in this course will be [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

Once you've created and logged into your account, Atlas will recommend creating a cluster:

![](../../images/3/57.png)

Let's choose <i>AWS</i> as the provider and <i>Frankfurt</i> as the region, and create a cluster.

![](../../images/3/58.png)

Let's wait for the cluster to be ready for use. This can take approximately 10 minutes.

**NB** do not continue before the cluster is ready.

Let's use the <i>database access</i> tab for creating user credentials for the database. Please note that these are not the same credentials you use for logging into MongoDB Atlas. These will be used for your application to connect to the database.

![](../../images/3/59.png)

Let's grant the user with permissions to read and write to the databases.

![](../../images/3/60.png)

**NB:** Some people reported the new user credentials not working immediately after creation. In some cases it has taken minutes before the credentials started working.

Next we have to define the IP addresses that are allowed access to the database.

![](../../images/3/61ea.png)

For the sake of simplicity we will allow access from all IP addresses:

![](../../images/3/62.png)

Finally we are ready to connect to our database. Start by clicking <i>connect</i>:

![](../../images/3/63ea.png)

and choose <i>Connect your application</i>:

![](../../images/3/64ea.png)

The view displays the <i>MongoDB URI</i>, which is the address of the database that we will supply to the MongoDB client library we will add to our application.

The address looks like this:

```bash
mongodb+srv://fullstack:<PASSWORD>@cluster0-ostce.mongodb.net/test?retryWrites=true
```

We are now ready to use the database.

We could use the database directly from our JavaScript code with the [official MongoDb Node.js driver](https://mongodb.github.io/node-mongodb-native/) library, but it is quite cumbersome to use. We will instead use the [Mongoose](http://mongoosejs.com/index.html) library that offers a higher level API.

Mongoose could be described as an <i>object document mapper</i> (ODM), and saving JavaScript objects as Mongo documents is straightforward with this library.

Let's install Mongoose:

```bash
npm install mongoose
```

Let's not add any code dealing with Mongo to our backend just yet. Instead, let's make a practice application by creating a new file, <i>mongo.js</i>:

```js
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0-ostce.mongodb.net/test?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'HTML is Easy',
  date: new Date(),
  important: true,
})

note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})
```

**NB:** Depending on which region you selected when building your cluster, the <i>MongoDB URI</i> may be different from the example provided above. You should verify and use the correct URI that was generated from MongoDB Atlas.

The code also assumes that it will be passed the password from the credentials we created in MongoDB Atlas, as a command line parameter. We can access the command line parameter like this:

```js
const password = process.argv[2]
```

When the code is run with the command <i>node mongo.js password</i>, Mongo will add a new document to the database.

**NB:** Please note the password is the password created for the database user, not your MongoDB Atlas password.  Also, if you created password with special characters, then you'll need to [URL encode that password](https://docs.atlas.mongodb.com/troubleshoot-connection/#special-characters-in-connection-string-password).

We can view the current state of the database from the MongoDB Atlas from <i>Collections</i>, in the Overview tab.

![](../../images/3/65.png)

As the view states, the <i>document</i> matching the note has been added to the <i>notes</i> collection in the <i>test</i> database.

![](../../images/3/66a.png)

We should give a better name to the database. Like the documentation says, we can change the name of the database from the URI:

![](../../images/3/67.png)

Let's destroy the <i>test</i> database. Let's now change the name of database referenced in our connection string to <i>note-app</i> instead, by modifying the URI:

```bash
mongodb+srv://fullstack:<PASSWORD>@cluster0-ostce.mongodb.net/note-app?retryWrites=true
```

Let's run our code again.

![](../../images/3/68.png)

The data is now stored in the right database. The view also offers the <i>create database</i> functionality, that can be used to create new databases from the website. Creating the database like this is not necessary, since MongoDB Atlas automatically creates a new database when an application tries to connect to a database that does not exist yet.

### Schema

After establishing the connection to the database, we define the [schema](http://mongoosejs.com/docs/guide.html) for a note and the matching [model](http://mongoosejs.com/docs/models.html):

```js
const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)
```

First we define the [schema](http://mongoosejs.com/docs/guide.html) of a note that is stored in the _noteSchema_ variable. The schema tells Mongoose how the note objects are to be stored in the database.

In the _Note_ model definition, the first <i>"Note"</i> parameter is the singular name of the model. The name of the collection will be the lowercased plural <i>notes</i>, because the [Mongoose convention](http://mongoosejs.com/docs/models.html) is to automatically name collections as the plural (e.g. <i>notes</i>) when the schema refers to them in the singular (e.g. <i>Note</i>).

Document databases like Mongo are <i>schemaless</i>, meaning that the database itself does not care about the structure of the data that is stored in the database. It is possible to store documents with completely different fields in the same collection.

The idea behind Mongoose is that the data stored in the database is given a <i>schema at the level of the application</i> that defines the shape of the documents stored in any given collection.

### Creating and saving objects

Next, the application creates a new note object with the help of the <i>Note</i> [model](http://mongoosejs.com/docs/models.html):

```js
const note = new Note({
  content: 'HTML is Easy',
  date: new Date(),
  important: false,
})
```

Models are so-called <i>constructor functions</i> that create new JavaScript objects based on the provided parameters. Since the objects are created with the model's constructor function, they have all the properties of the model, which include methods for saving the object to the database.

Saving the object to the database happens with the appropriately named _save_ method, that can be provided with an event handler with the _then_ method:

```js
note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})
```

When the object is saved to the database, the event handler provided to _then_  gets called. The event handler closes the database connection with the command <code>mongoose.connection.close()</code>. If the connection is not closed, the program will never finish its execution.

The result of the save operation is in the _result_ parameter of the event handler. The result is not that interesting when we're storing one object to the database. You can print the object to the console if you want to take a closer look at it while implementing your application or during debugging.

Let's also save a few more notes by modifying the data in the code and by executing the program again.

**NB:** Unfortunately the Mongoose documentation is not very consistent, with parts of it using callbacks in its examples and other parts, other styles, so it is not recommended to copy paste code directly from there. Mixing promises with old-school callbacks in the same code is not recommended. 

### Fetching objects from the database

Let's comment out the code for generating new notes and replace it with the following:

```js
Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})
```

When the code is executed, the program prints all the notes stored in the database:

![](../../images/3/70ea.png)

The objects are retrieved from the database with the [find](https://mongoosejs.com/docs/api.html#model_Model.find) method of the _Note_ model. The parameter of the method is an object expressing search conditions. Since the parameter is an empty object<code>{}</code>, we get all of the notes stored in the  _notes_ collection.

The search conditions adhere to the Mongo search query [syntax](https://docs.mongodb.com/manual/reference/operator/).

We could restrict our search to only include important notes like this:

```js
Note.find({ important: true }).then(result => {
  // ...
})
```

</div>

<div class="tasks">

### Exercise 3.12.

#### 3.12: Command-line database

Create a cloud-based MongoDB database for the phonebook application with MongoDB Atlas. 

Create a <i>mongo.js</i> file in the project directory, that can be used for adding entries to the phonebook, and for listing all of the existing entries in the phonebook.

**NB:** Do not include the password in the file that you commit and push to GitHub! 

The application should work as follows. You use the program by passing three command-line arguments (the first is the password), e.g.:

```bash
node mongo.js yourpassword Anna 040-1234556
```

As a result, the application will print:

```bash
added Anna number 040-1234556 to phonebook
```

The new entry to the phonebook will be saved to the database. Notice that if the name contains whitespace characters, it must be enclosed in quotes:

```bash
node mongo.js yourpassword "Arto Vihavainen" 045-1232456
```

If the password is the only parameter given to the program, meaning that it is invoked like this:

```bash
node mongo.js yourpassword
```

Then the program should display all of the entries in the phonebook:

<pre>
phonebook:
Anna 040-1234556
Arto Vihavainen 045-1232456
Ada Lovelace 040-1231236
</pre>

You can get the command-line parameters from the [process.argv](https://nodejs.org/docs/latest-v8.x/api/process.html#process_process_argv) variable.

**NB: do not close the connection in the wrong place**. E.g. the following code will not work:

```js
Person
  .find({})
  .then(persons=> {
    // ...
  })

mongoose.connection.close()
```

In the code above the <i>mongoose.connection.close()</i> command will get executed immediately after the <i>Person.find</i> operation is started. This means that the database connection will be closed immediately, and the execution will never get to the point where <i>Person.find</i> operation finishes and the <i>callback</i> function gets called.

The correct place for closing the database connection is at the end of the callback function:

```js
Person
  .find({})
  .then(persons=> {
    // ...
    mongoose.connection.close()
  })
```

**NB:** If you define a model with the name <i>Person</i>, mongoose will automatically name the associated collection as <i>people</i>.

</div>

<div class="content">

### Backend connected to a database

Now we have enough knowledge to start using Mongo in our application.

Let's get a quick start by copy pasting the Mongoose definitions to the <i>index.js</i> file:

```js
const mongoose = require('mongoose')

// DO NOT SAVE YOUR PASSWORD TO GITHUB!!
const url =
  'mongodb+srv://fullstack:sekred@cluster0-ostce.mongodb.net/note-app?retryWrites=true'

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)
```

Let's change the handler for fetching all notes to the following form:

```js
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})
```

We can verify in the browser that the backend works for displaying all of the documents:

![](../../images/3/44ea.png)

The application works almost perfectly. The frontend assumes that every object has a unique id in the <i>id</i> field. We also don't want to return the mongo versioning field <i>\_\_v</i> to the frontend.

One way to format the objects returned by Mongoose is to [modify](https://stackoverflow.com/questions/7034848/mongodb-output-id-instead-of-id) the _toJSON_ method of the schema, which is used on all instances of the models produced with that schema. Modifying the method works like this:

```js
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
```

Even though the <i>\_id</i> property of Mongoose objects looks like a string, it is in fact an object. The _toJSON_ method we defined transforms it into a string just to be safe. If we didn't make this change, it would cause more harm for us in the future once we start writing tests.

Let's respond to the HTTP request with a list of objects formatted with the _toJSON_ method:

```js
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})
```

Now the _notes_ variable is assigned to an array of objects returned by Mongo. When the response is sent in the JSON format, the _toJSON_ method of each object in the array is called automatically by the [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) method.

### Database configuration into its own module

Before we refactor the rest of the backend to use the database, let's extract the Mongoose specific code into its own module.

Let's create a new directory for the module called <i>models</i>, and add a file called <i>note.js</i>:

```js
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI // highlight-line

console.log('connecting to', url) // highlight-line

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
// highlight-start
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })
// highlight-end

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema) // highlight-line
```

Defining Node [modules](https://nodejs.org/docs/latest-v8.x/api/modules.html) differs slightly from the way of defining [ES6 modules](/en/part2/rendering_a_collection_modules#refactoring-modules) in part 2.

The public interface of the module is defined by setting a value to the _module.exports_ variable. We will set the value to be the <i>Note</i> model. The other things defined inside of the module, like the variables _mongoose_ and _url_ will not be accessible or visible to users of the module.

Importing the module happens by adding the following line to <i>index.js</i>:

```js
const Note = require('./models/note')
```

This way the _Note_ variable will be assigned to the same object that the module defines.

The way that the connection is made has changed slightly:

```js
const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })
```

It's not a good idea to hardcode the address of the database into the code, so instead the address of the database is passed to the application via the <em>MONGODB_URI</em> environment variable.

The method for establishing the connection is now given functions for dealing with a successful and unsuccessful connection attempt. Both functions just log a message to the console about the success status:

![](../../images/3/45e.png)

There are many ways to define the value of an environment variable. One way would be to define it when the application is started:

```bash
MONGODB_URI=address_here npm run dev
```

A more sophisticated way is to use the [dotenv](https://github.com/motdotla/dotenv#readme) library. You can install the library with the command:

```bash
npm install dotenv
```

To use the library, we create a <i>.env</i> file at the root of the project. The environment variables are defined inside of the file, and it can look like this:

```bash
MONGODB_URI='mongodb+srv://fullstack:sekred@cluster0-ostce.mongodb.net/note-app?retryWrites=true'
PORT=3001
```

We also added the hardcoded port of the server into the <em>PORT</em> environment variable.

**The <i>.env</i> file should be gitignored right away, since we do not want to publish any confidential information publicly online!**

![](../../images/3/45ae.png)

The environment variables defined in the <i>.env</i> file can be taken into use with the expression <em>require('dotenv').config()</em> and you can reference them in your code just like you would reference normal environment variables, with the familiar <em>process.env.MONGODB_URI</em> syntax.

Let's change the <i>index.js</i> file in the following way:

```js
require('dotenv').config() // highlight-line
const express = require('express')
const app = express()
const Note = require('./models/note') // highlight-line

// ..

const PORT = process.env.PORT // highlight-line
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

It's important that <i>dotenv</i> gets imported before the <i>note</i> model is imported. This ensures that the environment variables from the <i>.env</i> file are available globally before the code from the other modules is imported.

### Using database in route handlers

Next, let's change the rest of the backend functionality to use the database.

Creating a new note is accomplished like this:

```js
app.post('/api/notes', (request, response) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })
})
```

The note objects are created with the _Note_ constructor function. The response is sent inside of the callback function for the _save_ operation. This ensures that the response is sent only if the operation succeeded. We will discuss error handling a little bit later.

The _savedNote_ parameter in the callback function is the saved and newly created note. The data sent back in the response is the formatted version created with the _toJSON_ method:

```js
response.json(savedNote)
```

Using Mongoose's [findById](https://mongoosejs.com/docs/api.html#model_Model.findById) method, fetching an individual note gets changed into the following:

```js
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(note => {
    response.json(note)
  })
})
```

### Verifying frontend and backend integration

When the backend gets expanded, it's a good idea to test the backend first with **the browser, Postman or the VS Code REST client**. Next, let's try creating a new note after taking the database into use:

![](../../images/3/46e.png)

Only once everything has been verified to work in the backend, is it a good idea to test that the frontend works with the backend. It is highly inefficient to test things exclusively through the frontend.

It's probably a good idea to integrate the frontend and backend one functionality at a time. First, we could implement fetching all of the notes from the database and test it through the backend endpoint in the browser. After this, we could verify that the frontend works with the new backend. Once everything seems to work, we would move onto the next feature.

Once we introduce a database into the mix, it is useful to inspect the state persisted in the database, e.g. from the control panel in MongoDB Atlas. Quite often little Node helper programs like the <i>mongo.js</i> program we wrote earlier can be very helpful during development.

You can find the code for our current application in its entirety in the <i>part3-4</i> branch of [this Github repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-4).

</div>

<div class="tasks">

### Exercises 3.13.-3.14.

The following exercises are pretty straightforward, but if your frontend stops working with the backend, then finding and fixing the bugs can be quite interesting. 

#### 3.13: Phonebook database, step1

Change the fetching of all phonebook entries so that the data is <i>fetched from the database</i>.

Verify that the frontend works after the changes have been made.

In the following exercises, write all Mongoose-specific code into its own module, just like we did in the chapter [Database configuration into its own module](/en/part3/saving_data_to_mongo_db#database-configuration-into-its-own-module).

#### 3.14: Phonebook database, step2

Change the backend so that new numbers are <i>saved to the database</i>. Verify that your frontend still works after the changes.

At this point, you can choose to simply allow users to create all phonebook entries. At this stage, the phonebook can have multiple entries for a person with the same name. 

</div>

<div class="content">

### Error handling

If we try to visit the URL of a note with an id that does not actually exist e.g. <http://localhost:3001/api/notes/5c41c90e84d891c15dfa3431> where <i>5c41c90e84d891c15dfa3431</i> is not an id stored in the database, then the response will be _null_.

Let's change this behavior so that if note with the given id doesn't exist, the server will respond to the request with the HTTP status code 404 not found. In addition let's implement a simple <em>catch</em> block to handle cases where the promise returned by the <em>findById</em> method is <i>rejected</i>:

```js
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id)
    .then(note => {
      // highlight-start
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
      // highlight-end
    })
    // highlight-start
    .catch(error => {
      console.log(error)
      response.status(500).end()
    })
    // highlight-end
})
```

If no matching object is found in the database, the value of _note_ will be _null_ and the _else_ block is executed. This results in a response with the status code <i>404 not found</i>. If promise returned by the <em>findById</em> method is rejected, the response will have the status code <i>500 internal server error</i>. The console displays more detailed information about the error.

On top of the non-existing note, there's one more error situation needed to be handled. In this situation, we are trying to fetch a note with a wrong kind of _id_, meaning an _id_ that doesn't match the mongo identifier format.

If we make the following request, we will get the error message shown below:

<pre>
Method: GET
Path:   /api/notes/someInvalidId
Body:   {}
---
{ CastError: Cast to ObjectId failed for value "someInvalidId" at path "_id"
    at CastError (/Users/mluukkai/opetus/_fullstack/osa3-muisiinpanot/node_modules/mongoose/lib/error/cast.js:27:11)
    at ObjectId.cast (/Users/mluukkai/opetus/_fullstack/osa3-muisiinpanot/node_modules/mongoose/lib/schema/objectid.js:158:13)
    ...
</pre>

Given malformed id as an argument, the <em>findById</em> method will throw an error causing the returned promise to be rejected. This will cause the callback function defined in the <em>catch</em> block to be called. 

Let's make some small adjustments to the response in the <em>catch</em> block:

```js
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end() 
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' }) // highlight-line
    })
})
```

If the format of the id is incorrect, then we will end up in the error handler defined in the _catch_ block. The appropriate status code for the situation is [400 Bad Request](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.1), because the situation fits the description perfectly:

> <i>The request could not be understood by the server due to malformed syntax. The client SHOULD NOT repeat the request without modifications.</i>

We have also added some data to the response to shed some light on the cause of the error.

When dealing with Promises, it's almost always a good idea to add error and exception handling, because otherwise you will find yourself dealing with strange bugs.

It's never a bad idea to print the object that caused the exception to the console in the error handler:

```js
.catch(error => {
  console.log(error)
  response.status(400).send({ error: 'malformatted id' })
})
```

The reason the error handler gets called might be something completely different than what you had anticipated. If you log the error to the console, you may save yourself from long and frustrating debugging sessions. Moreover, most modern services to where you deploy your application support some form of logging system that you can use to check these logs. As mentioned, Heroku is one.

Every time you're working on a project with a backend, <i>it is critical to keep an eye on the console output of the backend</i>. If you are working on a small screen, it is enough to just see a tiny slice of the output in the background. Any error messages will catch your attention even when the console is far back in the background:

![](../../images/3/15b.png)

### Moving error handling into middleware

We have written the code for the error handler among the rest of our code. This can be a reasonable solution at times, but there are cases where it is better to implement all error handling in a single place. This can be particularly useful if we later on want to report data related to errors to an external error tracking system like [Sentry](https://sentry.io/welcome/).

Let's change the handler for the <i>/api/notes/:id</i> route, so that it passes the error forward with the <em>next</em> function. The next function is passed to the handler as the third parameter:

```js
app.get('/api/notes/:id', (request, response, next) => { // highlight-line
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error)) // highlight-line
})
```

The error that is passed forwards is given to the <em>next</em> function as a parameter. If <em>next</em> was called without a parameter, then the execution would simply move onto the next route or middleware. If the <em>next</em> function is called with a parameter, then the execution will continue to the <i>error handler middleware</i>.

Express [error handlers](https://expressjs.com/en/guide/error-handling.html) are middleware that are defined with a function that accepts <i>four parameters</i>. Our error handler looks like this:

```js
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)
```

The error handler checks if the error is a <i>CastError</i> exception, in which case we know that the error was caused by an invalid object id for Mongo. In this situation the error handler will send a response to the browser with the response object passed as a parameter. In all other error situations, the middleware passes the error forward to the default Express error handler. 

### The order of middleware loading

The execution order of middleware is the same as the order that they are loaded into express with the _app.use_ function. For this reason it is important to be careful when defining middleware.

The correct order is the following:

```js
app.use(express.static('build'))
app.use(express.json())
app.use(logger)

app.post('/api/notes', (request, response) => {
  const body = request.body
  // ...
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  // ...
}

// handler of requests with result to errors
app.use(errorHandler)
```

The json-parser middleware should be among the very first middleware loaded into Express. If the order was the following:

```js
app.use(logger) // request.body is undefined!

app.post('/api/notes', (request, response) => {
  // request.body is undefined!
  const body = request.body
  // ...
})

app.use(express.json())
```

Then the JSON data sent with the HTTP requests would not be available for the logger middleware or the POST route handler, since the _request.body_ would be _undefined_ at that point.

It's also important that the middleware for handling unsupported routes is next to the last middleware that is loaded into Express, just before the error handler.

For example, the following loading order would cause an issue:

```js
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

app.get('/api/notes', (request, response) => {
  // ...
})
```

Now the handling of unknown endpoints is ordered <i>before the HTTP request handler</i>. Since the unknown endpoint handler responds to all requests with <i>404 unknown endpoint</i>, no routes or middleware will be called after the response has been sent by unknown endpoint middleware. The only exception to this is the error handler which needs to come at the very end, after the unknown endpoints handler.

### Other operations

Let's add some missing functionality to our application, including deleting and updating an individual note.

The easiest way to delete a note from the database is with the [findByIdAndRemove](https://mongoosejs.com/docs/api.html#model_Model.findByIdAndRemove) method:

```js
app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})
```

In both of the "successful" cases of deleting a resource, the backend responds with the status code <i>204 no content</i>. The two different cases are deleting a note that exists, and deleting a note that does not exist in the database. The _result_ callback parameter could be used for checking if a resource actually was deleted, and we could use that information for returning different status codes for the two cases if we deemed it necessary. Any exception that occurs is passed onto the error handler.

The toggling of the importance of a note can be easily accomplished with the [findByIdAndUpdate](https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate) method.

```js
app.put('/api/notes/:id', (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})
```

In the code above, we also allow the content of the note to be edited. However, we will not support changing the creation date for obvious reasons.

Notice that the <em>findByIdAndUpdate</em> method receives a regular JavaScript object as its parameter, and not a new note object created with the <em>Note</em> constructor function.

There is one important detail regarding the use of the <em>findByIdAndUpdate</em> method. By default, the <em>updatedNote</em> parameter of the event handler receives the original document [without the modifications](https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate). We added the optional <code>{ new: true }</code> parameter, which will cause our event handler to be called with the new modified document instead of the original.

After testing the backend directly with Postman and the VS Code REST client, we can verify that it seems to work. The frontend also appears to work with the backend using the database. 

You can find the code for our current application in its entirety in the <i>part3-5</i> branch of [this github repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-5).

</div>

<div class="tasks">

### Exercises 3.15.-3.18.

#### 3.15: Phonebook database, step3

Change the backend so that deleting phonebook entries is reflected in the database.

Verify that the frontend still works after making the changes.

#### 3.16: Phonebook database, step4

Move the error handling of the application to a new error handler middleware. 

#### 3.17*: Phonebook database, step5

If the user tries to create a new phonebook entry for a person whose name is already in the phonebook, the frontend will try to update the phone number of the existing entry by making an HTTP PUT request to the entry's unique URL.

Modify the backend to support this request.

Verify that the frontend works after making your changes.

#### 3.18*: Phonebook database step6

Also update the handling of the <i>api/persons/:id</i> and <i>info</i> routes to use the database, and verify that they work directly with the browser, Postman, or VS Code REST client.

Inspecting an individual phonebook entry from the browser should look like this:

![](../../images/3/49.png)

</div>
