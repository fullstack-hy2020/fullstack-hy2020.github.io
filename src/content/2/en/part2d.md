---
mainImage: ../../../images/part-2.svg
part: 2
letter: d
lang: en
---

<div class="content">


When creating notes in our application, we would naturally want to store them in some backend server. The [json-server](https://github.com/typicode/json-server) package claims to be a so-called REST or RESTful API in its documentation:

> <i>Get a full fake REST API with zero coding in less than 30 seconds (seriously)</i>

The json-server does not exactly match the description provided by the textbook [definition](https://en.wikipedia.org/wiki/Representational_state_transfer) of a REST API, but neither do most other APIs claiming to be RESTful.

We will take a closer look at REST in the [next part](/en/part3) of the course, but it's important to familiarize ourselves at this point with some of the [conventions](https://en.wikipedia.org/wiki/Representational_state_transfer#Applied_to_Web_services) used by json-server and REST APIs in general. In particular, we will be taking a look at the conventional use of [routes](https://github.com/typicode/json-server#routes), aka URLs and HTTP request types, in REST.

### REST

In REST terminology, we refer to individual data objects, such as the notes in our application, as <i>resources</i>. Every resource has a unique address associated with it - its URL. According to a general convention used by json-server, we would be able to locate an individual note at the resource URL <i>notes/3</i>, where 3 is the id of the resource. The <i>notes</i> url, on the other hand, would point to a resource collection containing all the notes.

Resources are fetched from the server with HTTP GET requests. For instance, an HTTP GET request to the URL <i>notes/3</i> will return the note that has the id number 3. An HTTP GET request to the <i>notes</i> URL would return a list of all notes.

Creating a new resource for storing a note is done by making an HTTP POST request to the <i>notes</i> URL according to the REST convention that the json-server adheres to. The data for the new note resource is sent in the <i>body</i> of the request.

json-server requires all data to be sent in JSON format. What this means in practice is that the data must be a correctly formatted string, and that the request must contain the <i>Content-Type</i> request header with the value <i>application/json</i>.

### Sending Data to the Server

Let's make the following changes to the event handler responsible for creating a new note:

```js
addNote = event => {
  event.preventDefault()
  const noteObject = {
    content: newNote,
    date: new Date(),
    important: Math.random() < 0.5,
  }

// highlight-start
  axios
    .post('http://localhost:3001/notes', noteObject)
    .then(response => {
      console.log(response)
    })
// highlight-end
}
```


We create a new object for the note but omit the <i>id</i> property, since it's better to let the server generate ids for our resources!

The object is sent to the server using the axios <em>post</em> method. The registered event handler logs the response that is sent back from the server to the console.

When we try to create a new note, the following output pops up in console:

![](../../images/2/20e.png)

The newly created note resource is stored in the value of the <i>data</i> property of the _response_ object.

Sometimes it can be useful to inspect HTTP requests in the <i>Network</i> tab of Chrome developer tools, which was used heavily at the beginning of [part 0](/en/part0/fundamentals_of_web_apps#http-get):

![](../../images/2/21e.png)


We can use the inspector to check that the headers sent in the POST request are what we expected them to be, and that their values are correct.

Since the data we sent in the POST request was a JavaScript object, axios automatically knew to set the appropriate <i>application/json</i> value for the <i>Content-Type</i> header.

The new note is not rendered to the screen yet. This is because we did not update the state of the <i>App</i> component when we created the new note. Let's fix this:

```js
addNote = event => {
  event.preventDefault()
  const noteObject = {
    content: newNote,
    date: new Date(),
    important: Math.random() > 0.5,
  }

  axios
    .post('http://localhost:3001/notes', noteObject)
    .then(response => {
      // highlight-start
      setNotes(notes.concat(response.data))
      setNewNote('')
      // highlight-end
    })
}
```

The new note returned by the backend server is added to the list of notes in our application's state in the customary way of using the <em>setNotes</em> function and then resetting the note creation form. An [important detail](/en/part1/a_more_complex_state_debugging_react_apps#handling-arrays) to remember is that the <em>concat</em> method does not change the component's original state, but instead creates a new copy of the list.


Once the data returned by the server starts to have an effect on the behavior of our web applications, we are immediately faced with a whole new set of challenges arising from, for instance, the asynchronicity of communication. This necessitates new debugging strategies, console logging and other means of debugging become increasingly more important, and we must also develop a sufficient understanding of the principles of both the JavaScript runtime and React components. Guessing won't be enough.

It's beneficial to inspect the state of the backend server e.g. through the browser:

![](../../images/2/22e.png)


This makes it possible to verify that all the data we intended to send was actually received by the server.

In the next part of the course we will learn to implement our own logic in the backend. We will then take a closer look at tools like [postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop) that help us to debug our server applications. However, inspecting the state of the json-server through the browser is sufficient for our current needs.

> **NB:** In the current version of our application the browser adds the creation date property to the note. Since the clock of the machine running the browser can be wrongly configured, it's much wiser to let the backend server generate this timestamp for us. This is in fact what we will do in the next part of the course.


The code for the current state of our application can be found in the  <i>part2-5</i> branch on [github](https://github.com/fullstack-hy2020/part2-notes/tree/part2-5).


### Changing the importance of notes

Let's add a button to every note that can be used for toggling its importance.

We make the following changes to the <i>Note</i> component:

```js
const Note = ({ note, toggleImportance }) => {
  const label = note.important
    ? 'make not important' : 'make important'

  return (
    <li>
      {note.content} 
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}
```

We add a button to the component and assign its event handler as the <em>toggleImportance</em> function passed in the component's props.


The <i>App</i> component defines an initial version of the <em>toggleImportanceOf</em> event handler function and passes it to every <i>Note</i> component:

```js
const App = () => {
  const [notes, setNotes] = useState([]) 
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  // ...

  // highlight-start
  const toggleImportanceOf = (id) => {
    console.log('importance of ' + id + ' needs to be toggled')
  }
  // highlight-end

  // ...

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>      
      <ul>
        {notesToShow.map((note, i) => 
          <Note
            key={i}
            note={note} 
            toggleImportance={() => toggleImportanceOf(note.id)} // highlight-line
          />
        )}
      </ul>
      // ...
    </div>
  )
}
```

Notice how every note receives its own <i>unique</i> event handler function, since the <i>id</i> of every note is unique.


E.g. if <i>note.id</i> is 3, the event handler function returned by _toggleImportance(note.id)_ will be:

```js
() => { console.log('importance of 3 needs to be toggled') }
```

A short reminder here. The string printed by the event handler is defined in Java-like manner by adding the strings:

```js
console.log('importance of ' + id + ' needs to be toggled')
```


The [template string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) syntax added in ES6 can be used to write similar strings in a much nicer way:

```js
console.log(`importance of ${id} needs to be toggled`)
```

We can now use the "dollar-bracket"-syntax to add parts to the string that will evaluate JavaScript expressions, e.g. the value of a variable. Note that the quotation marks used in template strings differ from the quotation marks used in regular JavaScript strings.

Individual notes stored in the json-server backend can be modified in two different ways by making HTTP requests to the note's unique URL. We can either <i>replace</i> the entire note with an HTTP PUT request, or only change some of the note's properties with an HTTP PATCH request.


The final form of the event handler function is the following:

```js
const toggleImportanceOf = id => {
  const url = `http://localhost:3001/notes/${id}`
  const note = notes.find(n => n.id === id)
  const changedNote = { ...note, important: !note.important }

  axios.put(url, changedNote).then(response => {
    setNotes(notes.map(note => note.id !== id ? note : response.data))
  })
}
```


Almost every line of code in the function body contains important details. The first line defines the unique url for each note resource based on its id.


The array [find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find) method is used to find the note we want to modify, and we then assign it to the _note_ variable.


After this we create a <i>new object</i> that is an exact copy of the old note, apart from the important property. 

The code for creating the new object that uses the [object spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) syntax 
may seem a bit strange:

```js
const changedNote = { ...note, important: !note.important }
```

In practice <em>{ ...note }</em> creates a new object with copies of all the properties from the _note_ object. When we add properties inside the curly braces after the spreaded object, e.g. <em>{ ...note, important: true }</em>, then the value of the _important_ property of the new object will be _true_. In our example the <em>important</em> property gets the negation of its previous value in the original object.


There's a few things to point out. Why did we make a copy of the note object we wanted to modify, when the following code also appears to work:

```js
const note = notes.find(n => n.id === id)
note.important = !note.important

axios.put(url, note).then(response => {
  // ...
```


This is not recommended because the variable <em>note</em> is a reference to an item in the <em>notes</em> array in the component's state, and as we recall we must never mutate state directly in React. 


It's also worth noting that the new object _changedNote_ is only a so-called [shallow copy](https://en.wikipedia.org/wiki/Object_copying#Shallow_copy), meaning that the values of the new object are the same as the values of the old object. If the values of the old object were objects themselves, then the copied values in new object would reference the same objects that were in the old object.


The new note is then sent with a PUT request to the backend where it will replace the old object.


The callback function sets the component's <em>notes</em> state to a new array that contains all the items from the previous <em>notes</em> array, except for the old note which is replaced by the updated version of it returned by the server:

```js
axios.put(url, changedNote).then(response => {
  setNotes(notes.map(note => note.id !== id ? note : response.data))
})
```


This is accomplished with the <em>map</em> method:

```js
notes.map(note => note.id !== id ? note : response.data)
```


The map method creates a new array by mapping every item from the old array into an item in the new array. In our example, the new array is created conditionally so that if <em>note.id !== id</em> is true, we simply copy the item from the old array into the new array. If the condition is false, then the note object returned by the server is added to the array instead.


This <em>map</em> trick may seem a bit strange at first, but it's worth spending some time wrapping your head around it. We will be using this method many times throughout the course.


### Extracting communication with the backend into a separate module


The <i>App</i> component has become somewhat bloated after adding the code for communicating with the backend server. In the spirit of the [single responsibility principle](https://en.wikipedia.org/wiki/Single_responsibility_principle), we deem it wise to extract this communication into its own [module](/en/part2/rendering_a_collection_modules#refactoring-modules).


Let's create a <i>src/services</i> directory and add a file there called <i>notes.js</i>:

```js
import axios from 'axios'
const baseUrl = 'http://localhost:3001/notes'

const getAll = () => {
  return axios.get(baseUrl)
}

const create = newObject => {
  return axios.post(baseUrl, newObject)
}

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject)
}

export default { 
  getAll: getAll, 
  create: create, 
  update: update 
}
```


The module returns an object that has three functions (<i>getAll</i>, <i>create</i>, and <i>update</i>) as its properties that deal with notes. The functions directly return the promises returned by the axios methods.

The <i>App</i> component uses <em>import</em> to get access to the module:

```js
import noteService from './services/notes' // highlight-line

const App = () => {
```

The functions of the module can be used directly with the imported variable _noteService_ as follows:

```js
const App = () => {
  // ...

  useEffect(() => {
    // highlight-start
    noteService
      .getAll()
      .then(response => {
        setNotes(response.data)
      })
    // highlight-end
  }, [])

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    // highlight-start
    noteService
      .update(id, changedNote)
      .then(response => {
        setNotes(notes.map(note => note.id !== id ? note : response.data))
      })
    // highlight-end
  }

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() > 0.5
    }

// highlight-start
    noteService
      .create(noteObject)
      .then(response => {
        setNotes(notes.concat(response.data))
        setNewNote('')
      })
// highlight-end
  }

  // ...
}

export default App
```


We could take our implementation a step further. When the <i>App</i> component uses the functions, it receives an object that contains the entire response for the HTTP request:

```js
noteService
  .getAll()
  .then(response => {
    setNotes(response.data)
  })
```


The <i>App</i> component only uses the <i>response.data</i> property of the response object.


The module would be much nicer to use if, instead of the entire HTTP response, we would only get the response data. Using the module would then look like this:

```js
noteService
  .getAll()
  .then(initialNotes => {
    setNotes(initialNotes)
  })
```

We can achieve this by changing the code in the module as follows (the current code contains some copy-paste, but we will tolerate that for now):

```js
import axios from 'axios'
const baseUrl = 'http://localhost:3001/notes'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

export default { 
  getAll: getAll, 
  create: create, 
  update: update 
}
```


We no longer return the promise returned by axios directly. Instead, we assign the promise to the <em>request</em> variable and call its <em>then</em> method:

```js
const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}
```


The last row in our function is simply a more compact expression of the same code as shown below:

```js
const getAll = () => {
  const request = axios.get(baseUrl)
  // highlight-start
  return request.then(response => {
    return response.data
  })
  // highlight-end
}
```


The modified <em>getAll</em> function still returns a promise, as the <em>then</em> method of a promise also [returns a promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then). 


After defining the parameter of the <em>then</em> method to directly return <i>response.data</i>, we have gotten the <em>getAll</em> function to work like we wanted it to. When the HTTP request is successful, the promise returns the data sent back in the response from the backend.


We have to update the <i>App</i> component to work with the changes made to our module.  We have to fix the callback functions given as parameters to the <em>noteService</em> object's methods, so that they use the directly returned response data:

```js
const App = () => {
  // ...

  useEffect(() => {
    noteService
      .getAll()
      // highlight-start      
      .then(initialNotes => {
        setNotes(initialNotes)
      // highlight-end
      })
  }, [])

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      // highlight-start      
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      // highlight-end
      })
  }

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() > 0.5
    }

    noteService
      .create(noteObject)
      // highlight-start      
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
      // highlight-end
        setNewNote('')
      })
  }

  // ...
}
```


This is all quite complicated and attempting to explain it may just make it harder to understand. The internet is full of material discussing the topic, such as [this](https://javascript.info/promise-chaining) one.


The "Async and performance" book from the [You do not know JS](https://github.com/getify/You-Dont-Know-JS/tree/1st-ed) book series explains the topic [well](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/async%20%26%20performance/ch3.md), but the explanation is many pages long.


Promises are central to modern JavaScript development and it is highly recommended to invest a reasonable amount of time into understanding them.


### Cleaner syntax for defining object literals


The module defining note related services currently exports an object with the properties <i>getAll</i>, <i>create</i> and <i>update</i> that are assigned to functions for handling notes.


The module definition was:

```js
import axios from 'axios'
const baseUrl = 'http://localhost:3001/notes'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

export default { 
  getAll: getAll, 
  create: create, 
  update: update 
}
```


The module exports the following, rather peculiar looking, object:

```js
{ 
  getAll: getAll, 
  create: create, 
  update: update 
}
```


The labels to the left of the colon in the object definition are the <i>keys</i> of the object, whereas the ones to the right of it are <i>variables</i> that are defined inside of the module.


Since the names of the keys and the assigned variables are the same, we can write the object definition with more compact syntax:

```js
{ 
  getAll, 
  create, 
  update 
}
```


As a result the module definition gets simplified into the following form:

```js
import axios from 'axios'
const baseUrl = 'http://localhost:3001/notes'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

export default { getAll, create, update } // highlight-line
```


In defining the object using this shorter notation, we make use of a [new feature](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#Property_definitions) that was introduced to JavaScript through ES6, enabling a slightly more compact way of defining objects using variables.


To demonstrate this feature, let's consider a situation where we have the following values assigned to variables:

```js 
const name = 'Leevi'
const age = 0
```


In older versions of JavaScript we had to define an object like this:

```js 
const person = {
  name: name,
  age: age
}
```

However, since both the property fields and the variable names in the object are the same, it's enough to simply write the following in ES6 JavaScript: 

```js 
const person = { name, age }
```


The result is identical for both expressions. They both create an object with a <i>name</i> property with the value <i>Leevi</i> and an <i>age</i> property with the value <i>0</i>.


### Promises and errors


If our application allowed users to delete notes, we could end up in a situation where a user tries to change the importance of a note that has already been deleted from the system.


Let's simulate this situation by making the <em>getAll</em> function of the note service return a "hardcoded" note that does not actually exist in the backend server:

```js
const getAll = () => {
  const request = axios.get(baseUrl)
  const nonExisting = {
    id: 10000,
    content: 'This note is not saved to server',
    date: '2019-05-30T17:30:31.098Z',
    important: true,
  }
  return request.then(response => response.data.concat(nonExisting))
}
```

When we try to change the importance of the hardcoded note, we see the following error message in the console. The error says that the backend server responded to our HTTP PUT request with a status code 404 <i>not found</i>.

![](../../images/2/23e.png)

The application should be able to handle these types of error situations gracefully. Users won't be able to tell that an error has actually occurred unless they happen to have their console open. The only way the error can be seen  in the application is that clicking the button has no effect on the importance of the note.


We had [previously](/en/part2/getting_data_from_server#axios-and-promises) mentioned that a promise can be in one of three different states. When an HTTP request fails, the associated promise is <i>rejected</i>. Our current code does not handle this rejection in any way.


The rejection of a promise is [handled](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) by providing the <em>then</em> method with a second callback function, which is called in the situation where the promise is rejected.


The more common way of adding a handler for rejected promises is to use the [catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch) method. 


In practice, the error handler for rejected promises is defined like this:

```js
axios
  .get('http://example.com/probably_will_fail')
  .then(response => {
    console.log('success!')
  })
  .catch(error => {
    console.log('fail')
  })
```


If the request fails, the event handler registered with the <em>catch</em> method gets called.


The <em>catch</em> method is often utilized by placing it deeper within the promise chain.


When our application makes an HTTP request, we are in fact creating a [promise chain](https://javascript.info/promise-chaining):

```js
axios
  .put(`${baseUrl}/${id}`, newObject)
  .then(response => response.data)
  .then(changedNote => {
    // ...
  })
```


The <em>catch</em> method can be used to define a handler function at the end of a promise chain, which is called once any promise in the chain throws an error and the promise becomes <i>rejected</i>. 

```js
axios
  .put(`${baseUrl}/${id}`, newObject)
  .then(response => response.data)
  .then(changedNote => {
    // ...
  })
  .catch(error => {
    console.log('fail')
  })
```


Let's use this feature and register an error handler in the <i>App</i> component:

```js
const toggleImportanceOf = id => {
  const note = notes.find(n => n.id === id)
  const changedNote = { ...note, important: !note.important }

  noteService
    .update(id, changedNote).then(returnedNote => {
      setNotes(notes.map(note => note.id !== id ? note : returnedNote))
    })
    // highlight-start
    .catch(error => {
      alert(
        `the note '${note.content}' was already deleted from server`
      )
      setNotes(notes.filter(n => n.id !== id))
    })
    // highlight-end
}
```


The error message is displayed to the user with the trusty old [alert](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert) dialog popup, and the deleted note gets filtered out from the state.


Removing an already deleted note from the application's state is done with the array [filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) method, which returns a new array comprising only of the items from the list for which the function that was passed as a parameter returns true for:

```js
notes.filter(n => n.id !== id)
```

It's probably not a good idea to use alert in more serious React applications. We will soon learn a more advanced way of displaying messages and notifications to users. There are situations, however, where a simple, battle-tested method like <em>alert</em> can function as a starting point. A more advanced method could always be added in later, given that there's time and energy for it.

The code for the current state of our application can be found in the  <i>part2-6</i> branch on [github](https://github.com/fullstack-hy2020/part2-notes/tree/part2-6).

</div>

<div class="tasks">

<h3>Exercises 2.15.-2.18.</h3>

<h4>2.15: Phonebook step7</h4>

Let's return to our phonebook application.

Currently the numbers that are added to the phonebook are not saved to a backend server. Fix this situation.

<h4>2.16: Phonebook step8</h4>


Extract the code that handles the communication with the backend into its own module by following the example shown earlier in this part of the course material.

<h4>2.17: Phonebook step9</h4>

Make it possible for users to delete entries from the phonebook. The deletion can be done through a dedicated button for each person in the phonebook list. You can confirm the action from the user by using the [window.confirm](https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm) method:

![](../../images/2/24e.png)

The associated resource for a person in the backend can be deleted by making an HTTP DELETE request to the resource's URL. If we are deleting e.g. a person who has the <i>id</i> 2, we would have to make an HTTP DELETE request to the URL <i>localhost:3001/persons/2</i>. No data is sent with the request.

You can make an HTTP DELETE request with the [axios](https://github.com/axios/axios) library in the same way that we make all of the other requests.

**NB:** You can't use the name <em>delete</em> for a variable because it's a reserved word in JavaScript. E.g. the following is not possible:

```js
// use some other name for variable!
const delete = (id) => {
  // ...
}
```

<h4>2.18*: Phonebook step10</h4>

Change the functionality so that if a number is added to an already existing user, the new number will replace the old number. It's recommended to use the HTTP PUT method for updating the phone number. 

If the person's information is already in the phonebook, the application can confirm the action from the user:

![](../../images/teht/16e.png)

</div>
