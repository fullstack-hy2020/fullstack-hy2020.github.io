---
mainImage: ../../../images/part-2.svg
part: 2
letter: c
lang: en
---

<div class="content">

For a while now we have only been working on "frontend", i.e. client-side (browser) functionality. We will begin working on "backend", i.e. server-side functionality in the [third part](/en/part3) of this course. Nonetheless, we will now take a step in that direction by familiarizing ourselves with how code executing in the browser communicates with the backend.

Let's use a tool meant to be used during software development called [JSON Server](https://github.com/typicode/json-server) to act as our server.

Create a file named <i>db.json</i> in the root directory of the project with the following content:

```json
{
  "notes": [
    {
      "id": 1,
      "content": "HTML is easy",
      "date": "2019-05-30T17:30:31.098Z",
      "important": true
    },
    {
      "id": 2,
      "content": "Browser can execute only JavaScript",
      "date": "2019-05-30T18:39:34.091Z",
      "important": false
    },
    {
      "id": 3,
      "content": "GET and POST are the most important methods of HTTP protocol",
      "date": "2019-05-30T19:20:14.298Z",
      "important": true
    }
  ]
}
```

You can [install](https://github.com/typicode/json-server#getting-started) JSON server globally on your machine using the command _npm install -g json-server_. A global installation requires administrative privileges, which means that it is not possible on the faculty computers or freshman laptops.

However, a global installation is not necessary.  From the root directory of your app, we can run the <i>json-server</i> using the command _npx_:

```js
npx json-server --port 3001 --watch db.json
```

The <i>json-server</i> starts running on port 3000 by default; but since projects created using create-react-app reserve port 3000, we must define an alternate port, such as port 3001, for the json-server.

Let's navigate to the address <http://localhost:3001/notes> in the browser. We can see that <i>json-server</i> serves the notes we previously wrote to the file in JSON format:

![](../../images/2/14e.png)

If your browser doesn't have a way to format the display of JSON-data, then install an appropriate plugin, e.g. [JSONView](https://chrome.google.com/webstore/detail/jsonview/chklaanhfefbnpoihckbnefhakgolnmc) to make your life easier.

Going forward, the idea will be to save the notes to the server, which in this case means saving to the json-server. The React code fetches the notes from the server and renders them to the screen. Whenever a new note is added to the application the React code also sends it to the server to make the new note persist in "memory".

json-server stores all the data in the <i>db.json</i> file, which resides on the server. In the real world, data would be stored in some kind of database. However, json-server is a handy tool that enables the use of server-side functionality in the development phase without the need to program any of it.

We will get familiar with the principles of implementing server-side functionality in more detail in [part 3](/en/part3) of this course.

### The browser as a runtime environment

Our first task is fetching the already existing notes to our React application from the address <http://localhost:3001/notes>.

In the part0 [example project](/en/part0/fundamentals_of_web_apps#running-application-logic-on-the-browser) we already learned a way to fetch data from a server using JavaScript. The code in the example was fetching the data using [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest), otherwise known as an HTTP request made using an XHR object. This is a technique introduced in 1999, which every browser has supported for a good while now.

The use of XHR is no longer recommended, and browsers already widely support the [fetch](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch) method, which is based on so-called [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), instead of the event-driven model used by XHR.

As a reminder from part0 (which one should in fact <i>remember to not use</i> without a pressing reason), data was fetched using XHR in the following way: 


```js
const xhttp = new XMLHttpRequest()

xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    const data = JSON.parse(this.responseText)
    // handle the response that is saved in variable data
  }
}

xhttp.open('GET', '/data.json', true)
xhttp.send()
```

Right at the beginning we register an <i>event handler</i> to the <em>xhttp</em> object representing the HTTP request, which will be called by the JavaScript runtime whenever the state of the <em>xhttp</em> object changes. If the change in state means that the response to the request has arrived, then the data is handled accordingly.

It is worth noting that the code in the event handler is defined before the request is sent to the server. Despite this, the code within the event handler will be executed at a later point in time. Therefore, the code does not execute synchronously "from top to bottom", but does so <i>asynchronously</i>. JavaScript calls the event handler that was registered for the request at some point.

A synchronous way of making requests that's common in Java programming, for instance, would play out as follows (NB this is not actually working Java code):

```java
HTTPRequest request = new HTTPRequest();

String url = "https://fullstack-exampleapp.herokuapp.com/data.json";
List<Note> notes = request.get(url);

notes.forEach(m => {
  System.out.println(m.content);
});
```

In Java the code executes line by line and stops to wait for the HTTP request, which means waiting for the command _request.get(...)_ to finish. The data returned by the command, in this case the notes, are then stored in a variable, and we begin manipulating the data in the desired manner.

On the other hand, JavaScript engines, or runtime environments, follow the [asynchronous model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop). In principle, this requires all [IO-operations](https://en.wikipedia.org/wiki/Input/output) (with some exceptions) to be executed as non-blocking. This means that the code execution continues immediately after calling an IO function, without waiting for it to return.

When an asynchronous operation is completed, or more specifically, at some point after its completion, the JavaScript engine calls the event handlers registered to the operation.

Currently, JavaScript engines are <i>single-threaded</i>, which means that they cannot execute code in parallel. As a result, it is a requirement in practice to use a non-blocking model for executing IO operations. Otherwise, the browser would "freeze" during, for instance, the fetching of data from a server.

Another consequence of this single-threaded nature of JavaScript engines is that if some code execution takes up a lot of time, the browser will get stuck for the duration of the execution. If we added the following code at the top of our application:

```js
setTimeout(() => {
  console.log('loop..')
  let i = 0
  while (i < 50000000000) {
    i++
  }
  console.log('end')
}, 5000)
```

everything would work normally for 5 seconds. However, when the function defined as the parameter for <em>setTimeout</em> is run, the browser will be stuck for the duration of the execution of the long loop. Even the browser tab cannot be closed during the execution of the loop, at least not in Chrome.

For the browser to remain <i>responsive</i>, i.e. to be able to continuously react to user operations with sufficient speed, the code logic needs to be such that no single computation can take too long.

There is a host of additional material on the subject to be found on the internet. One particularly clear presentation of the topic is the keynote by Philip Roberts called [What the heck is the event loop anyway?](https://www.youtube.com/watch?v=8aGhZQkoFbQ)

In today's browsers, it is possible to run parallelized code with the help of so-called [web workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers). The event loop of an individual browser window is, however, still only handled by a [single thread](https://medium.com/techtrument/multithreading-javascript-46156179cf9a).

### npm

Let's get back to the topic of fetching data from the server.

We could use the previously mentioned promise based function [fetch](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch) to pull the data from the server. Fetch is a great tool. It is standardized and supported by all modern browsers (excluding IE).

That being said, we will be using the [axios](https://github.com/axios/axios) library instead for communication between the browser and server. It functions like fetch, but is somewhat more pleasant to use. Another good reason to use axios is our getting familiar with adding external libraries, so-called <i>npm packages</i>, to React projects.

Nowadays, practically all JavaScript projects are defined using the node package manager, aka [npm](https://docs.npmjs.com/getting-started/what-is-npm). The projects created using create-react-app also follow the npm format. A clear indicator that a project uses npm is the <i>package.json</i> file located at the root of the project:

```json
{
  "name": "part2-notes",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.11.9",
    "@testing-library/react": "^11.2.3",
    "@testing-library/user-event": "^12.6.0",
    "react": "^17.0.1",
    "react-dom": "^17.0.1",
    "react-scripts": "4.0.1",
    "web-vitals": "^0.2.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

At this point the <i>dependencies</i> part is of most interest to us as it defines what <i>dependencies</i>, or external libraries, the project has.

We now want to use axios. Theoretically, we could define the library directly in the <i>package.json</i> file, but it is better to install it from the command line.

```js
npm install axios
```


**NB _npm_-commands should always be run in the project root directory**, which is where the <i>package.json</i> file can be found.

Axios is now included among the other dependencies:

```json
{
  "dependencies": {
    "@testing-library/jest-dom": "^5.11.9",
    "@testing-library/react": "^11.2.3",
    "@testing-library/user-event": "^12.6.0",
    "axios": "^0.21.1", // highlight-line
    "react": "^17.0.1",
    "react-dom": "^17.0.1",
    "react-scripts": "4.0.1",
    "web-vitals": "^0.2.4"
  },
  // ...
}
```

In addition to adding axios to the dependencies, the <em>npm install</em> command also <i>downloaded</i> the library code. As with other dependencies, the code can be found in the <i>node\_modules</i> directory located in the root. As one might have noticed, <i>node\_modules</i> contains a fair amount of interesting stuff.

Let's make another addition. Install <i>json-server</i> as a development dependency (only used during development) by executing the command:

```js
npm install json-server --save-dev
```

and making a small addition to the <i>scripts</i> part of the <i>package.json</i> file:

```json
{
  // ... 
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "server": "json-server -p3001 --watch db.json" // highlight-line
  },
}
```

We can now conveniently, without parameter definitions, start the json-server from the project root directory with the command:

```js
npm run server
```

We will get more familiar with the _npm_ tool in the [third part of the course](/en/part3).

**NB** The previously started json-server must be terminated before starting a new one, otherwise there will be trouble:

![](../../images/2/15b.png)

The red print in the error message informs us about the issue:

<i>Cannot bind to the port 3001. Please specify another port number either through --port argument or through the json-server.json configuration file</i> 

As we can see, the application is not able to bind itself to the [port](https://en.wikipedia.org/wiki/Port_(computer_networking)). The reason being that port 3001 is already occupied by the previously started json-server.

We used the command _npm install_ twice, but with slight differences:

```js
npm install axios
npm install json-server --save-dev
```

There is a fine difference in the parameters. <i>axios</i> is installed as a runtime dependency of the application, because the execution of the program requires the existence of the library. On the other hand, <i>json-server</i> was installed as a development dependency (_--save-dev_), since the program itself doesn't require it. It is used for assistance during software development. There will be more on different dependencies in the next part of the course.

### Axios and promises

Now we are ready to use axios. Going forward, json-server is assumed to be running on port 3001.

NB: To run json-server and your react app simultaneously, you may need to use two terminal windows. One to keep json-server running and the other to run react-app.

The library can be brought into use the same way other libraries, e.g. React, are, i.e. by using an appropriate <em>import</em> statement.

Add the following to the file <i>index.js</i>:

```js
import axios from 'axios'

const promise = axios.get('http://localhost:3001/notes')
console.log(promise)

const promise2 = axios.get('http://localhost:3001/foobar')
console.log(promise2)
```

If you open <http://localhost:3000> in the browser, this should be printed to the console

![](../../images/2/16b.png)

**Note:** when the content of the file <i>index.js</i> changes, React does not notice that automatically so you must refresh the browser to see your changes! A simple workaround to make React notice the change automatically, is to create a file named <i>.env</i> in the root directory of the project and add this line `FAST_REFRESH=false`. Restart the app for the applied changes to take effect.

Axios' method _get_ returns a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises).

The documentation on Mozilla's site states the following about promises:

> <i>A Promise is an object representing the eventual completion or failure of an asynchronous operation.</i>

In other words, a promise is an object that represents an asynchronous operation. A promise can have three distinct states:

1. The promise is <i>pending</i>: It means that the final value (one of the following two) is not available yet.
2. The promise is <i>fulfilled</i>: It means that the operation has completed and the final value is available, which generally is a successful operation. This state is sometimes also called <i>resolved</i>.
3. The promise is <i>rejected</i>: It means that an error prevented the final value from being determined, which generally represents a failed operation.

The first promise in our example is <i>fulfilled</i>, representing a successful `axios.get('http://localhost:3001/notes')` request. The second one, however, is <i>rejected</i>, and the console tells us the reason. It looks like we were trying to make an HTTP GET request to a non-existent address.

If, and when, we want to access the result of the operation represented by the promise, we must register an event handler to the promise. This is achieved using the method <em>then</em>:

```js
const promise = axios.get('http://localhost:3001/notes')

promise.then(response => {
  console.log(response)
})
```
The following is printed to the console:

![](../../images/2/17e.png)

The JavaScript runtime environment calls the callback function registered by the <em>then</em> method providing it with a <em>response</em> object as a parameter. The <em>response</em> object contains all the essential data related to the response of an HTTP GET request, which would include the returned <i>data</i>, <i>status code</i>, and <i>headers</i>.

Storing the promise object in a variable is generally unnecessary, and it's instead common to chain the <em>then</em> method call to the axios method call, so that it follows it directly:

```js
axios.get('http://localhost:3001/notes').then(response => {
  const notes = response.data
  console.log(notes)
})
```


The callback function now takes the data contained within the response, stores it in a variable and prints the notes to the console.



A more readable way to format <i>chained</i> method calls is to place each call on its own line:

```js
axios
  .get('http://localhost:3001/notes')
  .then(response => {
    const notes = response.data
    console.log(notes)
  })
```

The data returned by the server is plain text, basically just one long string. The axios library is still able to parse the data into a JavaScript array, since the server has specified that the data format is <i>application/json; charset=utf-8</i> (see previous image) using the <i>content-type</i> header.

We can finally begin using the data fetched from the server.

Let's try and request the notes from our local server and render them, initially as the App component. Please note that this approach has many issues, as we're rendering the entire <i>App</i> component only when we successfully retrieve a response:

```js
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import axios from 'axios' // highlight-line

axios.get('http://localhost:3001/notes').then(response => {
  const notes = response.data
  ReactDOM.render(
    <App notes={notes} />,
    document.getElementById('root')
  )
})
```

This method could be acceptable in some circumstances, but it's somewhat problematic. Let's instead move the fetching of the data into the <i>App</i> component.

What's not immediately obvious, however, is where the command <em>axios.get</em> should be placed within the component.


### Effect-hooks

We have already used [state hooks](https://reactjs.org/docs/hooks-state.html) that were introduced along with React version [16.8.0](https://www.npmjs.com/package/react/v/16.8.0), which provide state to React components defined as functions - the so-called <i>functional components</i>. Version 16.8.0 also introduces the [effect hooks](https://reactjs.org/docs/hooks-effect.html) as a new feature. As per the official docs:

> <i>The Effect Hook lets you perform side effects in function components.</i>
> <i>Data fetching, setting up a subscription, and manually changing the DOM in React components are all examples of side effects.</i>

As such, effect hooks are precisely the right tool to use when fetching data from a server.

Let's remove the fetching of data from <i>index.js</i>. Since we're gonna be retrieving the notes from the server, there is no longer a need to pass data as props to the <i>App</i> component. So <i>index.js</i> can be simplified to:

```js
ReactDOM.render(<App />, document.getElementById('root'))
```

The <i>App</i> component changes as follows:

```js
import React, { useState, useEffect } from 'react' // highlight-line
import axios from 'axios' // highlight-line
import Note from './components/Note'

const App = () => { // highlight-line
  const [notes, setNotes] = useState([]) // highlight-line
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

// highlight-start
  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/notes')
      .then(response => {
        console.log('promise fulfilled')
        setNotes(response.data)
      })
  }, [])

  console.log('render', notes.length, 'notes')
// highlight-end

  // ...
}
```

We have also added a few helpful prints, which clarify the progression of the execution.

This is printed to the console

<pre>
render 0 notes
effect
promise fulfilled
render 3 notes
</pre>

First the body of the function defining the component is executed and the component is rendered for the first time. At this point <i>render 0 notes</i> is printed, meaning data hasn't been fetched from the server yet.

The following function, or effect in React parlance:
```js
() => {
  console.log('effect')
  axios
    .get('http://localhost:3001/notes')
    .then(response => {
      console.log('promise fulfilled')
      setNotes(response.data)
    })
}
```

is executed immediately after rendering. The execution of the function results in <i>effect</i> being printed to the console, and the command <em>axios.get</em> initiates the fetching of data from the server as well as registers the following function as an <i>event handler</i> for the operation:

```js
response => {
  console.log('promise fulfilled')
  setNotes(response.data)
})
```

When data arrives from the server, the JavaScript runtime calls the function registered as the event handler, which prints <i>promise fulfilled</i> to the console and stores the notes received from the server into the state using the function <em>setNotes(response.data)</em>.

As always, a call to a state-updating function triggers the re-rendering of the component. As a result, <i>render 3 notes</i> is printed to the console, and the notes fetched from the server are rendered to the screen.

Finally, let's take a look at the definition of the effect hook as a whole:

```js
useEffect(() => {
  console.log('effect')
  axios
    .get('http://localhost:3001/notes').then(response => {
      console.log('promise fulfilled')
      setNotes(response.data)
    })
}, [])
```

Let's rewrite the code a bit differently.

```js
const hook = () => {
  console.log('effect')
  axios
    .get('http://localhost:3001/notes')
    .then(response => {
      console.log('promise fulfilled')
      setNotes(response.data)
    })
}

useEffect(hook, [])
```

Now we can see more clearly that the function [useEffect](https://reactjs.org/docs/hooks-reference.html#useeffect) actually takes <i>two parameters</i>. The first is a function, the <i>effect</i> itself. According to the documentation:

> <i>By default, effects run after every completed render, but you can choose to fire it only when certain values have changed.</i>

So by default the effect is <i>always</i> run after the component has been rendered. In our case, however, we only want to execute the effect along with the first render.

The second parameter of <em>useEffect</em> is used to [specify how often the effect is run](https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect). If the second parameter is an empty array <em>[]</em>, then the effect is only run along with the first render of the component.

There are many possible use cases for an effect hook other than fetching data from the server. However, this use is sufficient for us, for now.

Think back to the sequence of events we just discussed. Which parts of the code are run? In what order? How often? Understanding the order of events is critical!

Note that we could have also written the code of the effect function this way:

```js
useEffect(() => {
  console.log('effect')

  const eventHandler = response => {
    console.log('promise fulfilled')
    setNotes(response.data)
  }

  const promise = axios.get('http://localhost:3001/notes')
  promise.then(eventHandler)
}, [])
```

A reference to an event handler function is assigned to the variable <em>eventHandler</em>. The promise returned by the <em>get</em> method of Axios is stored in the variable <em>promise</em>. The registration of the callback happens by giving the <em>eventHandler</em> variable, referring to the event-handler function, as a parameter to the <em>then</em> method of the promise. It isn't usually necessary to assign functions and promises to variables, and a more compact way of representing things, as seen further above, is sufficient.

```js
useEffect(() => {
  console.log('effect')
  axios
    .get('http://localhost:3001/notes')
    .then(response => {
      console.log('promise fulfilled')
      setNotes(response.data)
    })
}, [])
```

We still have a problem in our application. When adding new notes, they are not stored on the server.

The code for the application, as described so far, can be found in full on [github](https://github.com/fullstack-hy/part2-notes/tree/part2-4), on branch <i>part2-4</i>.

### The development runtime environment 

The configuration for the whole application has steadily grown more complex. Let's review what happens and where. The following image describes the makeup of the application

![](../../images/2/18e.png)

The JavaScript code making up our React application is run in the browser. The browser gets the JavaScript from the <i>React dev server</i>, which is the application that runs after running the command <em>npm start</em>. The dev-server transforms the JavaScript into a format understood by the browser. Among other things, it stitches together JavaScript from different files into one file. We'll discuss the dev-server in more detail in part 7 of the course.

The React application running in the browser fetches the JSON formatted data from <i>json-server</i> running on port 3001 on the machine. The server we query the data from - <i>json-server</i> - gets its data from the file <i>db.json</i>.

At this point in development, all the parts of the application happen to reside on the software developer's machine, otherwise known as localhost. The situation changes when the application is deployed to the internet. We will do this in part 3.

</div>

<div class="tasks">


<h3>Exercises 2.11.-2.14.</h3>


<h4>2.11: The Phonebook Step6</h4>



We continue with developing the phonebook. Store the initial state of the application in the file <i>db.json</i>, which should be placed in the root of the project.

```json
{
  "persons":[
    { 
      "name": "Arto Hellas", 
      "number": "040-123456",
      "id": 1
    },
    { 
      "name": "Ada Lovelace", 
      "number": "39-44-5323523",
      "id": 2
    },
    { 
      "name": "Dan Abramov", 
      "number": "12-43-234345",
      "id": 3
    },
    { 
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122",
      "id": 4
    }
  ]
}
```

Start json-server on port 3001 and make sure that the server returns the list of people by going to the address <http://localhost:3001/persons> in the browser.


If you receive the following error message:

```js
events.js:182
      throw er; // Unhandled 'error' event
      ^

Error: listen EADDRINUSE 0.0.0.0:3001
    at Object._errnoException (util.js:1019:11)
    at _exceptionWithHostPort (util.js:1041:20)
```

it means that port 3001 is already in use by another application, e.g. in use by an already running json-server. Close the other application, or change the port in case that doesn't work.

Modify the application such that the initial state of the data is fetched from the server using the <i>axios</i>-library. Complete the fetching with an [Effect hook](https://reactjs.org/docs/hooks-effect.html).

<h4>2.12* Data for countries, step1</h4>

The API [https://restcountries.com](https://restcountries.com) provides data for different countries in a machine-readable format, a so-called REST API.

Create an application, in which one can look at data of various countries. The application should probably get the data from the endpoint [all](https://restcountries.com/#api-endpoints-v3-all).

The user interface is very simple. The country to be shown is found by typing a search query into the search field.

If there are too many (over 10) countries that match the query, then the user is prompted to make their query more specific:

![](../../images/2/19b1.png)

If there are ten or fewer countries, but more than one, then all countries matching the query are shown:

![](../../images/2/19b2.png)

When there is only one country matching the query, then the basic data of the country, its flag and the languages spoken there, are shown:

![](../../images/2/19b3.png)

**NB**: It is enough that your application works for most of the countries. Some countries, like <i>Sudan</i>, can be hard to support, since the name of the country is part of the name of another country, <i>South Sudan</i>. You need not to worry about these edge cases.

**WARNING** create-react-app will automatically turn your project into a git-repository unless you create your application inside of an existing git repository. **Most likely you do not want each of your projects to be a separate repository**, so simply run the _rm -rf .git_ command at the root of your application.

<h4>2.13*: Data for countries, step2</h4>

**There is still a lot to do in this part, so don't get stuck on this exercise!**

Improve on the application in the previous exercise, such that when the names of multiple countries are shown on the page there is a button next to the name of the country, which when pressed shows the view for that country:

![](../../images/2/19b4.png)

In this exercise it is also enough that your application works for most of the countries. Countries whose name appears in the name of another country, like <i>Sudan</i>, can be ignored.

<h4>2.14*: Data for countries, step3</h4>

**There is still a lot to do in this part, so don't get stuck on this exercise!**

Add to the view showing the data of a single country, the weather report for the capital of that country. There are dozens of providers for weather data. One suggested API is [https://openweathermap.org](https://openweathermap.org).

![](../../images/2/19ba.png)

**NB:** In some browsers (such as Firefox) the chosen API might send an error response, which indicates that HTTPS encryption is not supported, although the request URL starts with _http://_. This issue can be fixed by completing the exercise using Chrome.

<!-- **Huom:** tarvitset melkein kaikkia säätietoja tarjoavia palveluja käyttääksesi api-avaimen. Älä talleta avainta versionhallintaan, eli älä kirjoita avainta suoraan koodiin.  Avaimen arvo kannattaa määritellä ns. [ympäristömuuttujana](https://create-react-app.dev/docs/adding-custom-environment-variables/). -->
**NB:** You need an api-key to use almost every weather service. Do not save the api-key to source control! Nor hardcode the api-key to your source code. Instead use an [environment variable](https://create-react-app.dev/docs/adding-custom-environment-variables/) to save the key.

<!-- Oletetaan että api-avaimen arvo on <i>t0p53cr3t4p1k3yv4lu3</i>. Kun ohjelma käynnistetään seuraavasti -->
Assuming the api-key is <i>t0p53cr3t4p1k3yv4lu3</i>, when the application is started like so:

```bash
REACT_APP_API_KEY='t0p53cr3t4p1k3yv4lu3' npm start // For Linux/macOS Bash
($env:REACT_APP_API_KEY='t0p53cr3t4p1k3yv4lu3') -and (npm start) // For Windows PowerShell
set REACT_APP_API_KEY='t0p53cr3t4p1k3yv4lu3' && npm start // For Windows cmd.exe
```

<!-- koodista päästään avaimen arvoon käsiksi olion _process.env_ kautta: -->
you can access the value of the key from the _process.env_ object:

```js
const api_key = process.env.REACT_APP_API_KEY
// variable api_key has now the value set in startup
```

Note that if you created the application using `npx create-react-app ...` and you want to use a different name for your environment variable then the environment variable name must still begin with `REACT_APP_`. You can also use a `.env` file rather than defining it on the command line each time by creating a file entitled '.env' in the root of the project and adding the following. 

```
# .env

REACT_APP_API_KEY=t0p53cr3t4p1k3yv4lu3
```

Note that you will need to restart the server to apply the changes.
</div>
