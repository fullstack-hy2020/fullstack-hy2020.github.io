---
mainImage: ../../../images/part-3.svg
part: 3
letter: a
lang: en
---

<div class="content">


In this part our focus shifts towards the backend: that is, towards implementing functionality on the server side of the stack.


We will be building our backend on top of [NodeJS](https://nodejs.org/en/), which is a JavaScript runtime based on Google's [Chrome V8](https://developers.google.com/v8/) JavaScript engine.


This course material was written with the version <i>v10.18.0</i> of Node.js. Please make sure that your version of Node is at least as new as the version used in the material (you can check the version by running _node -v_ in the command line).


As mentioned in [part 1](/en/part1/java_script), browsers don't yet support the newest features of JavaScript, and that is why the code running in the browser must be <i>transpiled</i> with e.g. [babel](https://babeljs.io/). The situation with JavaScript running in the backend is different. The newest version of Node supports a large majority of the latest features of JavaScript, so we can use the latest features without having to transpile our code.


Our goal is to implement a backend that will work with the notes application from [part 2](/en/part2/). However, let's start with the basics by implementing a classic "hello world" application.


**Notice** that the applications and exercises in this part are not all React applications, and we will not use the <i>create-react-app</i> utility for initializing the project for this application.


We had already mentioned [npm](/en/part2/getting_data_from_server#npm) back in part 2, which is a tool used for managing JavaScript packages. In fact, npm originates from the Node ecosystem.


Let's navigate to an appropriate directory, and create a new template for our application with the _npm init_ command. We will answer the questions presented by the utility, and the result will be an automatically generated <i>package.json</i> file at the root of the project, that contains information about the project.

```json
{
  "name": "backend",
  "version": "0.0.1",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Matti Luukkainen",
  "license": "MIT"
}
```


The file defines, for instance, that the entry point of the application is the <i>index.js</i> file.


Let's make a small change to the <i>scripts</i> object:

```bash
{
  // ...
  "scripts": {
    "start": "node index.js", // highlight-line
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  // ...
}
```


Next, let's create the first version of our application by adding an <i>index.js</i> file to the root of the project with the following code:

```js
console.log('hello world')
```


We can run the program directly with Node from the command line:

```bash
node index.js
```


Or we can run it as an [npm script](https://docs.npmjs.com/misc/scripts):

```bash
npm start
```


The <i>start</i> npm script works because we defined it in the <i>package.json</i> file:

```bash
{
  // ...
  "scripts": {
    "start": "node index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  // ...
}
```


Even though the execution of the project works when it is started by calling _node index.js_ from the command line, it's customary for npm projects to execute such tasks as npm scripts.


By default the <i>package.json</i> file also defines another commonly used npm script called <i>npm test</i>. Since our project does not yet have a testing library, the _npm test_ command simply executes the following command:

```bash
echo "Error: no test specified" && exit 1
```


### Simple web server


Let's change the application into a web server:

```js
const http = require('http')

const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('Hello World')
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
```

Once the application is running, the following message is printed in the console:

```bash
Server running on port 3001
```

We can open our humble application in the browser by visiting the address <http://localhost:3001>:

![](../../images/3/1.png)

In fact, the server works the same way regardless of the latter part of the URL. Also the address <http://localhost:3001/foo/bar> will display the same content.


**NB** if the port 3001 is already in use by some other application, then starting the server will result in the following error message:

```bash
➜  hello npm start

> hello@1.0.0 start /Users/mluukkai/opetus/_2019fullstack-code/part3/hello
> node index.js

Server running on port 3001
events.js:167
      throw er; // Unhandled 'error' event
      ^

Error: listen EADDRINUSE :::3001
    at Server.setupListenHandle [as _listen2] (net.js:1330:14)
    at listenInCluster (net.js:1378:12)
```


You have two options. Either shut down the application using the port 3001 (the json-server in the last part of the material was using the port 3001), or use a different port for this application.

Let's take a closer look at the first line of the code:

```js
const http = require('http')
```

In the first row, the application imports Node's built-in [web server](https://nodejs.org/docs/latest-v8.x/api/http.html) module. This is practically what we have already been doing in our browser-side code, but with a slightly different syntax:

```js
import http from 'http'
```

These days, code that runs in the browser uses ES6 modules. Modules are defined with an [export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) and taken into use with an [import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import).

However, Node.js uses so-called [CommonJS](https://en.wikipedia.org/wiki/CommonJS) modules. The reason for this is that the Node ecosystem had a need for modules long before JavaScript supported them in the language specification. At the time of writing this material, Node does not support ES6 modules, but support for them [is coming](https://nodejs.org/api/esm.html) somewhere down the road.

CommonJS modules function almost exactly like ES6 modules, at least as far as our needs in this course are concerned.

The next chunk in our code looks like this:

```js
const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('Hello World')
})
```

The code uses the _createServer_ method of the [http](https://nodejs.org/docs/latest-v8.x/api/http.html) module to create a new web server. An <i>event handler</i> is registered to the server, that is called <i>every time</i>  an HTTP request is made to the server's address http://localhost:3001.


The request is responded to with the status code 200, with the <i>Content-Type</i> header set to <i>text/plain</i>, and the content of the site to be returned set to <i>Hello World</i>.


The last rows bind the http server assigned to the _app_ variable, to listen to HTTP requests sent to the port 3001:

```js
const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
```


The primary purpose of the backend server in this course is to offer raw data in the JSON format to the frontend. For this reason, let's immediately change our server to return a hardcoded list of notes in the JSON format:

```js
const http = require('http')

// highlight-start
let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2019-05-30T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2019-05-30T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true
  }
]

const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify(notes))
})
// highlight-end

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
```

Let's restart the server (you can shut the server down by pressing _Ctrl+C_ in the console) and let's refresh the browser.

The <i>application/json</i> value in the <i>Content-Type</i> header informs the receiver that the data is in the JSON format. The _notes_ array gets transformed into JSON with the <em>JSON.stringify(notes)</em> method.

When we open the browser, the displayed format is exactly the same as in [part 2](/en/part2/getting_data_from_server/) where we used [json-server](https://github.com/typicode/json-server) to serve the list of notes:

![](../../images/3/2e.png)

### Express

Implementing our server code directly with Node's built-in [http](https://nodejs.org/docs/latest-v8.x/api/http.html) web server is possible. However, it is cumbersome, especially once the application grows in size.

Many libraries have been developed to ease server side development with Node, by offering a more pleasing interface to work with the built-in http module. These libraries aim to provide a better abstraction for general use cases we usually require to build a backend server. By far the most popular library intended for this purpose is [express](http://expressjs.com).

Let's take express into use by defining it as a project dependency with the command:

```bash
npm install express
```

The dependency is also added to our <i>package.json</i> file:

```json
{
  // ...
  "dependencies": {
    "express": "^4.17.1"
  }
}

```


The source code for the dependency is installed to the <i>node\_modules</i> directory located in the root of the project. In addition to express, you can find a great amount of other dependencies in the directory:

![](../../images/3/4.png)


These are in fact the dependencies of the express library, and the dependencies of all of its dependencies, and so forth. These are called the [transitive dependencies](https://lexi-lambda.github.io/blog/2016/08/24/understanding-the-npm-dependency-model/) of our project.


The version 4.17.1. of express was installed in our project. What does the caret in front of the version number in <i>package.json</i> mean?

```json
"express": "^4.17.1"
```


The versioning model used in npm is called [semantic versioning](https://docs.npmjs.com/getting-started/semantic-versioning).


The caret in the front of <i>^4.17.1</i> means, that if and when the dependencies of a project are updated, the version of express that is installed will be at least <i>4.17.1</i>. However, the installed version of express can also be one that has a larger <i>patch</i> number (the last number), or a larger <i>minor</i> number (the middle number). The major version of the library indicated by the first <i>major</i> number must be the same.


We can update the dependencies of the project with the command:

```bash
npm update
```

Likewise, if we start working on the project on another computer, we can install all up-to-date dependencies of the project defined in <i>package.json</i> with the command:

```bash
npm install
```

If the <i>major</i> number of a dependency does not change, then the newer versions should be [backwards compatible](https://en.wikipedia.org/wiki/Backward_compatibility). This means that if our application happened to use version 4.99.175 of express in the future, then all the code implemented in this part would still have to work without making changes to the code. In contrast, the future 5.0.0. version of express [may contain](https://expressjs.com/en/guide/migrating-5.html) changes, that would cause our application to no longer work.

### Web and express

Let's get back to our application and make the following changes:

```js
const express = require('express')
const app = express()

let notes = [
  ...
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```


In order to get the new version of our application into use, we have to restart the application.


The application did not change a whole lot. Right at the beginning of our code we're importing _express_, which this time is a <i>function</i> that is used to create an express application stored in the _app_ variable:

```js
const express = require('express')
const app = express()
```


Next, we define two <i>routes</i> to the application. The first one defines an event handler, that is used to handle HTTP GET requests made to the application's <i>/</i> root:

```js
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})
```


The event handler function accepts two parameters. The first [request](http://expressjs.com/en/4x/api.html#req) parameter contains all of the information of the HTTP request, and the second [response](http://expressjs.com/en/4x/api.html#res) parameter is used to define how the request is responded to.


In our code, the request is answered by using the [send](http://expressjs.com/en/4x/api.html#res.send) method of the _response_ object. Calling the method makes the server respond to the HTTP request by sending a response containing the string <code>\<h1>Hello World!\</h1></code>, that was passed to the _send_ method. Since the parameter is a string, express automatically sets the value of the <i>Content-Type</i> header to be <i>text/html</i>. The status code of the response defaults to 200.


We can verify this from the <i>Network</i> tab in developer tools:

![](../../images/3/5.png)


The second route defines an event handler, that handles HTTP GET requests made to the <i>notes</i> path of the application:

```js
app.get('/api/notes', (request, response) => {
  response.json(notes)
})
```


The request is responded to with the [json](http://expressjs.com/en/4x/api.html#res.json) method of the _response_ object. Calling the method will send the __notes__ array that was passed to it as a JSON formatted string. Express automatically sets the <i>Content-Type</i> header with the appropriate value of <i>application/json</i>.

![](../../images/3/6ea.png)

Next, let's take a quick look at the data sent in the JSON format.

In the earlier version where we were only using Node, we had to transform the data into the JSON format with the _JSON.stringify_ method:

```js
response.end(JSON.stringify(notes))
```


With express, this is no longer required, because this transformation happens automatically.


It's worth noting, that [JSON](https://en.wikipedia.org/wiki/JSON) is a string, and not a JavaScript object like the value assigned to _notes_.


The experiment shown below illustrates this point:

![](../../assets/3/5.png)


The experiment above was done in the interactive [node-repl](https://nodejs.org/docs/latest-v8.x/api/repl.html). You can start the interactive node-repl by typing in _node_ in the command line. The repl is particularly useful for testing how commands work while you're writing application code. I highly recommend this!

### nodemon

If we make changes to the application's code we have to restart the application in order to see the changes. We restart the application by first shutting it down by typing _Ctrl+C_ and then restarting the application. Compared to the convenient workflow in React where the browser automatically reloaded after changes were made, this feels slightly cumbersome.

The solution to this problem is [nodemon](https://github.com/remy/nodemon): 

> <i>nodemon will watch the files in the directory in which nodemon was started, and if any files change, nodemon will automatically restart your node application.</i>


Let's install nodemon by defining it as a <i>development dependency</i> with the command:

```bash
npm install --save-dev nodemon
```

The contents of <i>package.json</i> have also changed:

```json
{
  //...
  "dependencies": {
    "express": "^4.17.1",
  },
  "devDependencies": {
    "nodemon": "^2.0.2"
  }
}
```


If you accidentally used the wrong command and the nodemon dependency was added under "dependencies" instead of "devDependencies", then manually change the contents of <i>package.json</i> to match what is shown above.


By development dependencies, we are referring to tools that are needed only during the development of the application, e.g. for testing or automatically restarting the application, like <i>nodemon</i>.


These development dependencies are not needed when the application is run in production mode on the production server (e.g. Heroku).


We can start our application with <i>nodemon</i> like this:

```bash
node_modules/.bin/nodemon index.js
```


Changes to the application code now cause the server to restart automatically. It's worth noting, that even though the backend server restarts automatically, the browser still has to be manually refreshed. This is because unlike when working in React, we could not even have the [hot reload](https://gaearon.github.io/react-hot-loader/getstarted/) functionality needed to automatically reload the browser.


The command is long and quite unpleasant, so let's define a dedicated <i>npm script</i> for it in the <i>package.json</i> file:

```bash
{
  // ..
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  // ..
}
```


In the script there is no need to specify the <i>node\_modules/.bin/nodemon</i> path to nodemon, because _npm_ automatically knows to search for the file from that directory. 


We can now start the server in the development mode with the command:

```bash
npm run dev
```


Unlike with the <i>start</i> and <i>test</i> scripts, we also have to add <i>run</i> to the command.


### REST


Let's expand our application so that it provides the RESTful HTTP API as [json-server](https://github.com/typicode/json-server#routes).


Representational State Transfer, aka REST, was introduced in 2000 in Roy Fielding's [dissertation](https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm). REST is an architectural style meant for building scalable web applications.


We are not going to dig into Fielding's definition of REST or spend time pondering about what is and isn't RESTful. Instead, we take a more [narrow view](https://en.wikipedia.org/wiki/Representational_state_transfer#Applied_to_web_services) by only concerning ourselves with how RESTful APIs are typically understood in web applications. The original definition of REST is in fact not even limited to web applications.


We mentioned in the [previous part](/en/part2/altering_data_in_server#rest) that singular things, like notes in the case of our application, are called <i>resources</i> in RESTful thinking. Every resource has an associated URL which is the resource's unique address.


One convention is to create the unique address for resources by combining the name of the resource type with the resource's unique identifier.


Let's assume that the root URL of our service is <i>www.example.com/api</i>.


If we define the resource type of notes to be <i>note</i>, then the address of a note resource with the identifier 10, has the unique address <i>www.example.com/api/notes/10</i>.


The URL for the entire collection of all note resources is <i>www.example.com/api/notes</i>.


We can execute different operations on resources. The operation to be executed is defined by the HTTP <i>verb</i>:

| URL                   | verb                | functionality                                                    |
| --------------------- | ------------------- | -----------------------------------------------------------------|
| notes/10              | GET                 | fetches a single resource                                        |
| notes                 | GET                 | fetches all resources in the collection                          |
| notes                 | POST                | creates a new resource based on the request data                 |
| notes/10              | DELETE              | removes the identified resource                                  |
| notes/10              | PUT                 | replaces the entire identified resource with the request data    |
| notes/10              | PATCH               | replaces a part of the identified resource with the request data |
|                       |                     |                                                                  |


This is how we manage to roughly define what REST refers to as a [uniform interface](https://en.wikipedia.org/wiki/Representational_state_transfer#Architectural_constraints), which means a consistent way of defining interfaces that makes it possible for systems to co-operate.


This way of interpreting REST falls under the [second level of RESTful maturity](https://martinfowler.com/articles/richardsonMaturityModel.html) in the Richardson Maturity Model. According to the definition provided by Roy Fielding, we have not actually defined a [REST API](http://roy.gbiv.com/untangled/2008/rest-apis-must-be-hypertext-driven). In fact, a large majority of the world's purported "REST" APIs do not meet Fielding's original criteria outlined in his dissertation.


In some places (see e.g. [Richardson, Ruby: RESTful Web Services](http://shop.oreilly.com/product/9780596529260.do)) you will see our model for a straightforward [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) API, being referred to as an example of [resource oriented architecture](https://en.wikipedia.org/wiki/Resource-oriented_architecture) instead of REST. We will avoid getting stuck arguing semantics and instead return to working on our application.


### Fetching a single resource


Let's expand our application so that it offers a REST interface for operating on individual notes. First let's create a [route](http://expressjs.com/en/guide/routing.html) for fetching a single resource.


The unique address we will use for an individual note is of the form <i>notes/10</i>, where the number at the end refers to the note's unique id number.


We can define [parameters](http://expressjs.com/en/guide/routing.html#route-parameters) for routes in express by using the colon syntax:

```js
app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => note.id === id)
  response.json(note)
})
```


Now <code>app.get('/api/notes/:id', ...)</code> will handle all HTTP GET requests, that are of the form <i>/api/notes/SOMETHING</i>, where <i>SOMETHING</i> is an arbitrary string.


The <i>id</i> parameter in the route of a request, can be accessed through the [request](http://expressjs.com/en/api.html#req) object:

```js
const id = request.params.id
```

The now familiar _find_ method of arrays is used to find the note with an id that matches the parameter. The note is then returned to the sender of the request.


When we test our application by going to <http://localhost:3001/api/notes/1> in our browser, we notice that it does not appear to work, as the browser displays an empty page. This comes as no surprise to us as software developers, and it's time to debug.


Adding _console.log_ commands into our code is a time-proven trick:

```js
app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  console.log(id)
  const note = notes.find(note => note.id === id)
  console.log(note)
  response.json(note)
})
```


When we visit <http://localhost:3001/api/notes/1> again in the browser, the console which is the terminal in this case, will display the following:

![](../../images/3/8.png)


The id parameter from the route is passed to our application but the _find_ method does not find a matching note.


To further our investigation, we also add a console log inside the comparison function passed to the _find_ method. In order to do this, we have to get rid of the compact arrow function syntax <em>note => note.id === id</em>, and use the syntax with an explicit return statement:

```js
app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => {
    console.log(note.id, typeof note.id, id, typeof id, note.id === id)
    return note.id === id
  })
  console.log(note)
  response.json(note)
})
```


When we visit the URL again in the browser, each call to the comparison function prints a few different things to the console. The console output is the following:

<pre>
1 'number' '1' 'string' false
2 'number' '1' 'string' false
3 'number' '1' 'string' false
</pre>


The cause of the bug becomes clear. The _id_ variable contains a string '1', whereas the ids of notes are integers. In JavaScript, the "triple equals" comparison === considers all values of different types to not be equal by default, meaning that 1 is not '1'. 


Let's fix the issue by changing the id parameter from a string into a [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number):

```js
app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  response.json(note)
})
```


Now fetching an individual resource works.

![](../../images/3/9ea.png)


However, there's another problem with our application.


If we search for a note with an id that does not exist, the server responds with:

![](../../images/3/10ea.png)


The HTTP status code that is returned is 200, which means that the response succeeded. There is no data sent back with the response, since the value of the <i>content-length</i> header is 0, and the same can be verified from the browser. 


The reason for this behavior is that the _note_ variable is set to _undefined_ if no matching note is found. The situation needs to be handled on the server in a better way. If no note is found, the server should respond with the status code [404 not found](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.5) instead of 200.


Let's make the following change to our code:

```js
app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  
  // highlight-start
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
  // highlight-end
})
```


Since no data is attached to the response, we use the [status](http://expressjs.com/en/4x/api.html#res.status) method for setting the status, and the [end](http://expressjs.com/en/4x/api.html#res.end) method for responding to the request without sending any data.


The if-condition leverages the fact that all JavaScript objects are [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy), meaning that they evaluate to true in a comparison operation. However, _undefined_ is [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) meaning that it will evaluate to false.


Our application works and sends the error status code if no note is found. However, the application doesn't return anything to show to the user, like web applications normally do when we visit a page that does not exist. We do not actually need to display anything in the browser because REST APIs are interfaces that are intended for programmatic use, and the error status code is all that is needed.


### Deleting resources


Next let's implement a route for deleting resources. Deletion happens by making an HTTP DELETE request to the url of the resource:

```js
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})
```


If deleting the resource is successful, meaning that the note exists and it is removed, we respond to the request with the status code [204 no content](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.2.5) and return no data with the response.


There's no consensus on what status code should be returned to a DELETE request if the resource does not exist. Really, the only two options are 204 and 404. For the sake of simplicity our application will respond with 204 in both cases.

### Postman


So how do we test the delete operation? HTTP GET requests are easy to make from the browser. We could write some JavaScript for testing deletion, but writing test code is not always the best solution in every situation.

Many tools exist for making the testing of backends easier. One of these is a command line program [curl](https://curl.haxx.se). However, instead of curl, we will take a look at using [Postman](https://www.getpostman.com/) for testing the application.

Let's install Postman and try it out:

![](../../images/3/11ea.png)

Using Postman is quite easy in this situation. It's enough to define the url and then select the correct request type (DELETE).

The backend server appears to respond correctly. By making an HTTP GET request to <http://localhost:3001/api/notes> we see that the note with the id 2 is no longer in the list, which indicates that the deletion was successful. 

Because the notes in the application are only saved to memory, the list of notes will return to its original state when we restart the application.

### The Visual Studio Code REST client

If you use Visual Studio Code, you can use the VS Code [REST client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) plugin instead of Postman.

Once the plugin is installed, using it is very simple. We make a directory at the root of application named <i>requests</i>. We save all the REST client requests in the directory as files that end with the <i>.rest</i> extension.

Let's create a new <i>get\_all\_notes.rest</i> file and define the request that fetches all notes.

![](../../images/3/12ea.png)

By clicking the <i>Send Request</i> text, the REST client will execute the HTTP request and response from the server is opened in the editor.

![](../../images/3/13ea.png)

### Receiving data

Next, let's make it possible to add new notes to the server. Adding a note happens by making an HTTP POST request to the address http://localhost:3001/api/notes, and by sending all the information for the new note in the request [body](https://www.w3.org/Protocols/rfc2616/rfc2616-sec7.html#sec7) in the JSON format.

In order to access the data easily, we need the help of the express [json-parser](https://expressjs.com/en/api.html), that is taken to use with command _app.use(express.json())_.

Let's activate the json-parser and implement an initial handler for dealing with the HTTP POST requests:

```js
const express = require('express')
const app = express()

app.use(express.json())

//...

app.post('/api/notes', (request, response) => {
  const note = request.body
  console.log(note)

  response.json(note)
})
```


The event handler function can access the data from the <i>body</i> property of the _request_ object.


Without the json-parser, the <i>body</i> property would be undefined. The json-parser functions so that it takes the JSON data of a request, transforms it into a JavaScript object and then attaches it to the <i>body</i> property of the _request_ object before the route handler is called.


For the time being, the application does not do anything with the received data besides printing it to the console and sending it back in the response.


Before we implement the rest of the application logic, let's verify with Postman that the data is actually received by the server. In addition to defining the URL and request type in Postman, we also have to define the data sent in the <i>body</i>:

![](../../images/3/14ea.png)


The application prints the data that we sent in the request to the console:

![](../../images/3/15e.png)


**NB** <i>Keep the terminal running the application visible at all times</i> when you are working on the backend. Thanks to Nodemon any changes we make to the code will restart the application. If you pay attention to the console, you will immediately be able to pick up on errors that occur in the application:

![](../../images/3/16.png)


Similarly, it is useful to check the console for making sure that the backend behaves like we expect it to in different situations, like when we send data with an HTTP POST request. Naturally, it's a good idea to add lots of <em>console.log</em> commands to the code while the application is still being developed.


A potential cause for issues is an incorrectly set <i>Content-Type</i> header in requests. This can happen with Postman if the type of body is not defined correctly:

![](../../images/3/17e.png)


The <i>Content-Type</i> header is set to <i>text/plain</i>:

![](../../images/3/18e.png)


The server appears to only receive an empty object:

![](../../images/3/19.png)


The server will not be able to parse the data correctly without the correct value in the header. It won't even try to guess the format of the data, since there's a [massive amount](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types) of potential <i>Content-Types</i>.


If you are using VS Code, then you should install the REST client from the previous chapter <i>now, if you haven't already</i>. The POST request can be sent with the REST client like this:

![](../../images/3/20eb.png)


We created a new <i>create\_note.rest</i> file for the request. The request is formatted according to the [instructions in the documentation](https://github.com/Huachao/vscode-restclient/blob/master/README.md#usage).


One benefit that the REST client has over Postman is that the requests are handily available at the root of the project repository, and they can be distributed to everyone in the development team. You can also add multiple requests in the same file using `###` separators:

```
GET http://localhost:3001/api/notes/

###
POST http://localhost:3001/api/notes/ HTTP/1.1
content-type: application/json

{
    "name": "sample",
    "time": "Wed, 21 Oct 2015 18:27:50 GMT"
}
```

Postman also allows users to save requests, but the situation can get quite chaotic especially when you're working on multiple unrelated projects.

> **Important sidenote**
>
> Sometimes when you're debugging, you may want to find out what headers have been set in the HTTP request. One way of accomplishing this is through the [get](http://expressjs.com/en/4x/api.html#req.get) method of the _request_ object, that can be used for getting the value of a single header. The _request_ object also has the <i>headers</i> property, that contains all of the headers of a specific request.
>

> Problems can occur with the VS REST client if you accidentally add an empty line between the top row and the row specifying the HTTP headers. In this situation, the REST client interprets this to mean that all headers are left empty, which leads to the backend server not knowing that the data it has received is in the JSON format.
>

You will be able to spot this missing <i>Content-Type</i> header if at some point in your code you print all of the request headers with the _console.log(request.headers)_ command.


Let's return to the application. Once we know that the application receives data correctly, it's time to finalize the handling of the request:

```js
app.post('/api/notes', (request, response) => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id)) 
    : 0

  const note = request.body
  note.id = maxId + 1

  notes = notes.concat(note)

  response.json(note)
})
```


We need a unique id for the note. First, we find out the largest id number in the current list and assign it to the _maxId_ variable. The id of the new note is then defined as _maxId + 1_. This method is in fact not recommended, but we will live with it for now as we will replace it soon enough.


The current version still has the problem that the HTTP POST request can be used to add objects with arbitrary properties. Let's improve the application by defining that the <i>content</i> property may not be empty. The <i>important</i> and <i>date</i> properties will be given default values. All other properties are discarded:

```js
const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
})
```


The logic for generating the new id number for notes has been extracted into a separate _generateId_ function.


If the received data is missing a value for the <i>content</i> property, the server will respond to the request with the status code [400 bad request](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.1):

```js
if (!body.content) {
  return response.status(400).json({ 
    error: 'content missing' 
  })
}
```


Notice that calling return is crucial, because otherwise the code will execute to the very end and the malformed note gets saved to the application.


If the content property has a value, the note will be based on the received data. As mentioned previously, it is better to generate timestamps on the server than in the browser, since we can't trust that host machine running the browser has its clock set correctly. The generation of the <i>date</i> property is now done by the server.


If the <i>important</i> property is missing, we will default the value to <i>false</i>. The default value is currently generated in a rather odd-looking way:

```js
important: body.important || false,
```


If the data saved in the _body_ variable has the <i>important</i> property, the expression will evaluate to its value. If the property does not exist, then the expression will evaluate to false which is defined on the right-hand side of the vertical lines.


> To be exact, when the <i>important</i> property is <i>false</i>, then the <em>body.important || false</em> expression will in fact return the <i>false</i> from the right-hand side...


You can find the code for our current application in its entirety in the <i>part3-1</i> branch of [this github repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-1).


Notice that the master branch of the repository contains the code from a later version of the application. The code for the current state of the application is specifically in branch [part3-1](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-1).

![](../../images/3/21.png)


If you clone the project, run the _npm install_ command before starting the application with _npm start_ or _npm run dev_.


One more thing before we move onto the exercises. The function for generating IDs looks currently like this:

```js
const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}
```


The function body contains a row that looks a bit intriguing:

```js
Math.max(...notes.map(n => n.id))
```

What exactly is happening in that line of code? <em>notes.map(n => n.id)</em> creates a new array that contains all the ids of the notes. [Math.max](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max) returns the maximum value of the numbers that are passed to it. However, <em>notes.map(n => n.id)</em> is an <i>array</i> so it can't directly be given as a parameter to _Math.max_. The array can be transformed into individual numbers by using the "three dot" [spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) syntax <em>...</em>.

</div>

<div class="tasks">


### Exercises 3.1.-3.6.

**NB:** It's recommended to do all of the exercises from this part into a new dedicated git repository, and place your source code right at the root of the repository. Otherwise you will run into problems in exercise 3.10.


**NB:** Because this is not a frontend project and we are not working with React, the application <strong>is not created</strong> with create-react-app. You initialize this project with the <em>npm init</em> command that was demonstrated earlier in this part of the material.


**Strong recommendation:** When you are working on backend code, always keep an eye on what's going on in the terminal that is running your application.


#### 3.1: Phonebook backend step1


Implement a Node application that returns a hardcoded list of phonebook entries from the address <http://localhost:3001/api/persons>:

![](../../images/3/22e.png)


Notice that the forward slash in the route <i>api/persons</i> is not a special character, and is just like any other character in the string. 


The application must be started with the command _npm start_.


The application must also offer an _npm run dev_ command that will run the application and restart the server whenever changes are made and saved to a file in the source code.


#### 3.2: Phonebook backend step2


Implement a page at the address <http://localhost:3001/info> that looks roughly like this:

![](../../images/3/23ea.png)


The page has to show the time that the request was received and how many entries are in the phonebook at the time of processing the request.


#### 3.3: Phonebook backend step3


Implement the functionality for displaying the information for a single phonebook entry. The url for getting the data for a person with the id 5 should be <http://localhost:3001/api/persons/5>


If an entry for the given id is not found, the server has to respond with the appropriate status code.


#### 3.4: Phonebook backend step4


Implement functionality that makes it possible to delete a single phonebook entry by making an HTTP DELETE request to the unique URL of that phonebook entry.


Test that your functionality works with either Postman or the Visual Studio Code REST client.


#### 3.5: Phonebook backend step5


Expand the backend so that new phonebook entries can be added by making HTTP POST requests to the address <http://localhost:3001/api/persons>.


Generate a new id for the phonebook entry with the [Math.random](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random) function. Use a big enough range for your random values so that the likelihood of creating duplicate ids is small.


#### 3.6: Phonebook backend step6




Implement error handling for creating new entries. The request is not allowed to succeed, if:
- The name or number is missing 
- The name already exists in the phonebook


Respond to requests like these with the appropriate status code, and also send back information that explains the reason for the error, e.g.:

```js
{ error: 'name must be unique' }
```

</div>

<div class="content">


### About HTTP request types

[The HTTP standard](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html) talks about two properties related to request types, **safety** and **idempotence**.

The HTTP GET request should be <i>safe</i>:

> <i>In particular, the convention has been established that the GET and HEAD methods SHOULD NOT have the significance of taking an action other than retrieval. These methods ought to be considered "safe".</i>


Safety means that the executing request must not cause any <i>side effects</i> in the server. By side-effects we mean that the state of the database must not change as a result of the request, and the response must only return data that already exists on the server.


Nothing can ever guarantee that a GET request is actually <i>safe</i>, this is in fact just a recommendation that is defined in the HTTP standard. By adhering to RESTful principles in our API, GET requests are in fact always used in a way that they are <i>safe</i>.


The HTTP standard also defines the request type [HEAD](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9.4), that ought to be safe. In practice HEAD should work exactly like GET but it does not return anything but the status code and response headers. The response body will not be returned when you make a HEAD request.


All HTTP requests except POST should be <i>idempotent</i>:

> <i>Methods can also have the property of "idempotence" in that (aside from error or expiration issues) the side-effects of N > 0 identical requests is the same as for a single request. The methods GET, HEAD, PUT and DELETE share this property</i>


This means that if a request has side-effects, then the result should be same regardless of how many times the request is sent.


If we make an HTTP PUT request to the url <i>/api/notes/10</i> and with the request we send the data <em>{ content: "no side effects!", important: true }</em>, the result is the same regardless of how many times the request is sent.


Like <i>safety</i> for the GET request, <i>idempotence</i> is also just a recommendation in the HTTP standard and not something that can be guaranteed simply based on the request type. However, when our API adheres to RESTful principles, then GET, HEAD, PUT, and DELETE requests are used in such a way that they are idempotent.


POST is the only HTTP request type that is neither <i>safe</i> nor <i>idempotent</i>. If we send 5 different HTTP POST requests to <i>/api/notes</i> with a body of <em>{content: "many same", important: true}</em>, the resulting 5 notes on the server will all have the same content.


### Middleware

The express [json-parser](https://expressjs.com/en/api.html) we took into use earlier is a so-called [middleware](http://expressjs.com/en/guide/using-middleware.html).


Middleware are functions that can be used for handling _request_ and _response_ objects.

The json-parser we used earlier takes the raw data from the requests that's stored in the _request_ object, parses it into a JavaScript object and assigns it to the _request_ object as a new property <i>body</i>.


In practice, you can use several middleware at the same time. When you have more than one, they're executed one by one in the order that they were taken into use in express.


Let's implement our own middleware that prints information about every request that is sent to the server.


Middleware is a function that receives three parameters:

```js
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
```

At the end of the function body the _next_ function that was passed as a parameter is called. The _next_ function yields control to the next middleware.

Middleware are taken into use like this:

```js
app.use(requestLogger)
```

Middleware functions are called in the order that they're taken into use with the express server object's _use_ method. Notice that json-parser is taken into use before the _requestLogger_ middleware, because otherwise <i>request.body</i> will not be initialized when the logger is executed!


Middleware functions have to be taken into use before routes if we want them to be executed before the route event handlers are called. There are also situations where we want to define middleware functions after routes. In practice, this means that we are defining middleware functions that are only called if no route handles the HTTP request.


Let's add the following middleware after our routes, that is used for catching requests made to non-existent routes. For these requests, the middleware will return an error message in the JSON format.

```js
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
```


You can find the code for our current application in its entirety in the <i>part3-2</i> branch of [this github repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-2).

</div>

<div class="tasks">

### Exercises 3.7.-3.8.

#### 3.7: Phonebook backend step7

Add the [morgan](https://github.com/expressjs/morgan) middleware to your application for logging. Configure it to log messages to your console based on the <i>tiny</i> configuration.

The documentation for Morgan is not the best, and you may have to spend some time figuring out how to configure it correctly. However, most documentation in the world falls under the same category, so it's good to learn to decipher and interpret cryptic documentation in any case.


Morgan is installed just like all other libraries with the _npm install_ command. Taking morgan into use happens the same way as configuring any other middleware by using the _app.use_ command.


#### 3.8*: Phonebook backend step8


Configure morgan so that it also shows the data sent in HTTP POST requests:

![](../../images/3/24.png)

Note that logging data even in the console can be dangerous since it can contain sensitive data and may violate local privacy law (e.g. GDPR in EU) or business-standard. In this exercise, you don't have to worry about privacy issues, but in practice, try not to log any sensitive data.

This exercise can be quite challenging, even though the solution does not require a lot of code.


This exercise can be completed in a few different ways. One of the possible solutions utilizes these two techniques:
- [creating new tokens](https://github.com/expressjs/morgan#creating-new-tokens)
- [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)

</div>
