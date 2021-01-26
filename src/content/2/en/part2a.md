---
mainImage: ../../../images/part-2.svg
part: 2
letter: a
lang: en
---

<div class="content">

Before starting a new part, let's recap some of the topics that proved difficult last year.

### console.log

***What's the difference between an experienced JavaScript programmer and a rookie? The experienced one uses console.log 10-100 times more.***

Paradoxically, this seems to be true even though a rookie programmer would need console.log (or any debugging method) more than an experienced one.

When something does not work, don't just guess what's wrong. Instead, log or use some other way of debugging. 

**NB** As explained in part 1, when you use the command _console.log_ for debugging, don't concatenate things 'the Java way' with a plus. Instead of writing:

```js
console.log('props value is' + props)
```

separate the things to be printed with a comma:

```js
console.log('props value is', props)
```

If you concatenate an object with a string and log it to the console (like in our first example), the result will be pretty useless: 

```js
props value is [Object object]
```

On the contrary, when you pass objects as distinct arguments separated by commas to _console.log_, like in our second example above, the content of the object is printed to the developer console as strings that are insightful.
If necessary, read more about debugging React-applications [here](/en/part1/a_more_complex_state_debugging_react_apps#debugging-react-applications).

### Protip: Visual Studio Code snippets

With Visual Studio Code it's easy to create 'snippets', i.e. shortcuts for quickly generating commonly re-used portions of code, much like how 'sout' works in Netbeans. 
Instructions for creating snippets can be found [here](https://code.visualstudio.com/docs/editor/userdefinedsnippets#_creating-your-own-snippets).

Useful, ready-made snippets can also be found as VS Code plugins, for example [here](https://marketplace.visualstudio.com/items?itemName=xabikos.ReactSnippets).

The most important snippet is the one for the <em>console.log()</em> command, for example <em>clog</em>. This can be created like so: 
```js
{
  "console.log": {
    "prefix": "clog",
    "body": [
      "console.log('$1')",
    ],
    "description": "Log output to console"
  }
}
```

Debugging your code using _console.log()_ is so common that Visual Studio Code has that snippet built in. To use it, type _log_ and hit tab to autocomplete. 

### JavaScript Arrays

From here on out, we will be using the functional programming methods of the JavaScript [array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array), such as  _find_, _filter_, and _map_ - all of the time. They operate on the same general principles as streams do in Java 8, which have been used during the last few years in both the 'Ohjelmoinnin perusteet' and 'Ohjelmoinnin jatkokurssi' courses at the university's department of Computer Science, and also in the programming MOOC. 

If functional programming with arrays feels foreign to you, it is worth watching at least the first three parts of the YouTube video series [Functional Programming in JavaScript](https://www.youtube.com/playlist?list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84):

- [Higher-order functions](https://www.youtube.com/watch?v=BMUiFMZr7vk&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84)
- [Map](https://www.youtube.com/watch?v=bCqtb-Z5YGQ&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84&index=2)
- [Reduce basics](https://www.youtube.com/watch?v=Wl98eZpkp-c&t=31s)

### Event handlers revisited

Based on last year's course, event handling has proven to be difficult. 
It's worth reading the revision chapter at the end of the previous part [event handlers revisited](/en/part1/a_more_complex_state_debugging_react_apps#event-handling-revisited), if it feels like your own knowledge on the topic needs some brushing up. 

Passing event handlers to the child components of the <i>App</i> component has raised some questions. A small revision on the topic can be found [here](/en/part1/a_more_complex_state_debugging_react_apps#passing-event-handlers-to-child-components).

### Rendering collections

We will now do the 'frontend', or the browser-side application logic, in React for an application that's similar to the example application from [part 0](/en/part0)

Let's start with the following:

```js
import React from 'react'
import ReactDOM from 'react-dom'

const notes = [
  {
    id: 1,
    content: 'HTML is easy',
    date: '2019-05-30T17:30:31.098Z',
    important: true
  },
  {
    id: 2,
    content: 'Browser can execute only JavaScript',
    date: '2019-05-30T18:39:34.091Z',
    important: false
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    date: '2019-05-30T19:20:14.298Z',
    important: true
  }
]

const App = (props) => {
  const { notes } = props

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        <li>{notes[0].content}</li>
        <li>{notes[1].content}</li>
        <li>{notes[2].content}</li>
      </ul>
    </div>
  )
}

ReactDOM.render(
  <App notes={notes} />,
  document.getElementById('root')
)
```

Every note contains its textual content and a timestamp as well as a _boolean_ value for marking whether the note has been categorized as important or not, and also a unique <i>id</i>.


The example above works due to the fact that there are exactly three notes in the array. 
A single note is rendered by accessing the objects in the array by referring to a hard-coded index number:

```js
<li>{notes[1].content}</li>
```

This is, of course, not practical. We can improve on this by generating React elements from the array objects using the [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) function.

```js
notes.map(note => <li>{note.content}</li>)
```

The result is an array of <i>li</i> elements.

```js
[
  <li>HTML is easy</li>,
  <li>Browser can execute only JavaScript</li>,
  <li>GET and POST are the most important methods of HTTP protocol</li>,
]
```


Which can then be placed inside <i>ul</i> tags:

```js
const App = (props) => {
  const { notes } = props

  return (
    <div>
      <h1>Notes</h1>
// highlight-start
      <ul>
        {notes.map(note => <li>{note.content}</li>)}
      </ul>
// highlight-end      
    </div>
  )
}
```

Because the code generating the <i>li</i> tags is JavaScript, it must be wrapped in curly braces in a JSX template just like all other JavaScript code. 

<!-- Parannetaan koodin luetteloa vielä jakamalla nuolifunktion määrittely useammalle riville: -->
We will also make the code more readable by separating the arrow function's declaration across multiple lines:

```js
const App = (props) => {
  const { notes } = props

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
        // highlight-start
          <li>
            {note.content}
          </li>
        // highlight-end   
        )}
      </ul>
    </div>
  )
}
```

### Key-attribute

Even though the application seems to be working, there is a nasty warning in the console: 

![](../../images/2/1a.png)

As the linked [page](https://reactjs.org/docs/lists-and-keys.html#keys) in the error message instructs, the list items, i.e. the elements generated by the _map_ method, must each have a unique key value:  an attribute called <i>key</i>.

Let's add the keys:

```js
const App = (props) => {
  const { notes } = props

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
        // highlight-start
          <li key={note.id}>
            {note.content}
          </li>
          // highlight-end
        )}
      </ul>
    </div>
  )
}
```

And the error message disappears. 

React uses the key attributes of objects in an array to determine how to update the view generated by a component when the component is re-rendered. More about this [here](https://reactjs.org/docs/reconciliation.html#recursing-on-children).

### Map

Understanding how the array method [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) works is crucial for the rest of the course. 

The application contains an array called _notes_:

```js
const notes = [
  {
    id: 1,
    content: 'HTML is easy',
    date: '2019-05-30T17:30:31.098Z',
    important: true
  },
  {
    id: 2,
    content: 'Browser can execute only JavaScript',
    date: '2019-05-30T18:39:34.091Z',
    important: false
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    date: '2019-05-30T19:20:14.298Z',
    important: true
  }
]
```

Let's pause for a moment and examine how _map_ works.


If the following code is added to, let's say, the end of the file:

```js
const result = notes.map(note => note.id)
console.log(result)
```

<i>[1, 2, 3]</i>  will be printed to the console.
 _map_ always creates a new array, the elements of which have been created from the elements of the original array by <i>mapping</i>: using the function given as a parameter to the _map_ method. 


The function is

```js
note => note.id
```

Which is an arrow function written in compact form. The full form would be: 

```js
(note) => {
  return note.id
}
```

The function gets a note object as a parameter, and <i>returns</i> the value of its <i>id</i> field.

Changing the command to:

```js
const result = notes.map(note => note.content)
```

results in an array containing the contents of the notes.

This is already pretty close to the React code we used:

```js
notes.map(note =>
  <li key={note.id}>{note.content}</li>
)
```

which generates a <i>li</i> tag containing the contents of the note from each note object. 

Because the function parameter passed to the _map_ method - 

```js
note => <li key={note.id}>{note.content}</li>
```

&nbsp;- is used to create view elements, the value of the variable must be rendered inside of curly braces. Try to see what happens if the braces are removed. 

The use of curly braces will cause some headache in the beginning, but you will get used to them soon enough. The visual feedback from React is immediate.

### Anti-pattern: array indexes as keys

We could have made the error message on our console disappear by using the array indexes as keys. The indexes can be retrieved by passing a second parameter to the callback function of the _map_ method: 

```js
notes.map((note, i) => ...)
```

When called like this, _i_ is assigned the value of the index of the position in the array where the note resides.

As such, one way to define the row generation without getting errors is:

```js
<ul>
  {notes.map((note, i) => 
    <li key={i}>
      {note.content}
    </li>
  )}
</ul>
```

This is, however, **not recommended** and can cause undesired problems even if it seems to be working just fine. 
Read more about this [here](https://medium.com/@robinpokorny/index-as-a-key-is-an-anti-pattern-e0349aece318).

### Refactoring modules

Let's tidy the code up a bit. We are only interested in the field _notes_ of the props, so let's retrieve that directly using [destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment): 

```js
const App = ({ notes }) => { //highlight-line
  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <li key={note.id}>
            {note.content}
          </li>
        )}
      </ul>
    </div>
  )
}
```

If you have forgotten what destructuring means and how it works, review [this](/en/part1/component_state_event_handlers#destructuring).


We'll separate displaying a single note into its own component <i>Note</i>: 

```js
// highlight-start
const Note = ({ note }) => {
  return (
    <li>{note.content}</li>
  )
}
// highlight-end

const App = ({ notes }) => {
  return (
    <div>
      <h1>Notes</h1>
      <ul>
        // highlight-start
        {notes.map(note => 
          <Note key={note.id} note={note} />
        )}
         // highlight-end
      </ul>
    </div>
  )
}
```

Note that the <i>key</i> attribute must now be defined for the <i>Note</i> components, and not for the <i>li</i> tags like before. 

A whole React application can be written in a single file. Although that is, of course, not very practical. Common practice is to declare each component in their own file as an <i>ES6-module</i>.

We have been using modules the whole time. The first few lines of the file:

```js
import React from 'react'
import ReactDOM from 'react-dom'
```

[import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) two modules, enabling them to be used in that file. The <i>React</i> module is placed into a variable called _React_ and <i>React-DOM</i> to variable _ReactDOM_.


Let's move our <i>Note</i> component into its own module. 

In smaller applications, components are usually placed in a directory called <i>components</i>, which is in turn placed within the <i>src</i> directory. The convention is to name the file after the component. 

Now we'll create a directory called <i>components</i> for our application and place a file named <i>Note.js</i> inside. 
The contents of the Note.js file are as follows: 

```js
import React from 'react'

const Note = ({ note }) => {
  return (
    <li>{note.content}</li>
  )
}

export default Note
```

We import React on the first line of the module.

The last line of the module [exports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) the declared module, the variable <i>Note</i>.

Please note that on recent versions of React it is no longer necessary to import React to use JSX syntax, however it is still important to learn as there are billions of lines of old React code that still need the React import. The same applies to documentation and examples of React that you may stumble across on the internet.

We would still need to import React in order to use Hooks or other exports that React provides. Read more about this [here](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html).

Now the file that is using the component - <i>index.js</i> - can [import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) the module: 

```js
import React from 'react'
import ReactDOM from 'react-dom'
import Note from './components/Note' // highlight-line

const App = ({ notes }) => {
  // ...
}
```

The component exported by the module is now available for use in the variable <i>Note</i>, just as it was earlier. 

Note that when importing our own components, their location must be given <i>in relation to the importing file</i>:

```js
'./components/Note'
```

The period - <i>.</i> - in the beginning refers to the current directory, so the module's location is a file called <i>Note.js</i> in the <i>components</i> sub-directory of the current directory. The filename extension - _.js_ - can be omitted.

<i>App</i> is a component as well, so let's declare it in its own module as well. Since it is the root component of the application, we'll place it in the <i>src</i> directory. The contents of the file are as follows: 

```js
import React from 'react'
import Note from './components/Note'

const App = ({ notes }) => {
  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map((note) => 
          <Note key={note.id} note={note} />
        )}
      </ul>
    </div>
  )
}

export default App // highlight-line
```

What's left in the <i>index.js</i> file is: 

```js
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'  // highlight-line

const notes = [
  // ...
]

ReactDOM.render(
  <App notes={notes} />,
  document.getElementById('root')
)
```

Modules have plenty of other uses other than enabling component declarations to be separated into their own files. We will get back to them later in this course. 


The current code of the application can be found on [GitHub](https://github.com/fullstack-hy2020/part2-notes/tree/part2-1).


Note that the <i>master</i> branch of the repository contains the code for a later version of the application. The current code is in the branch [part2-1](https://github.com/fullstack-hy2020/part2-notes/tree/part2-1):

![](../../images/2/2e.png)

If you clone the project, run the command _npm install_ before starting the application with _npm start_.

### When the application breaks

Early in your programming career (and even after 30 years of coding like yours truly), what often happens is that the application just completely breaks down. This is even more the case with dynamically typed languages, such as JavaScript, where the compiler does not check the data type of, for instance, function variables or return values. 


A "React explosion" can for example look like this:

![](../../images/2/3b.png)


In these situations your best way out is the <em>console.log</em>.
The piece of code causing the explosion is this: 

```js
const Course = ({ course }) => (
  <div>
    <Header course={course} />
  </div>
)

const App = () => {
  const course = {
    // ...
  }

  return (
    <div>
      <Course course={course} />
    </div>
  )
}
```


We'll hone in on the reason for the breakdown by adding <em>console.log</em> commands to the code. Because the first thing to be rendered is the <i>App</i> component, it's worth putting the first <em>console.log</em> there: 

```js
const App = () => {
  const course = {
    // ...
  }

  console.log('App works...') // highlight-line

  return (
    // ..
  )
}
```

To see the printing on the console, we must scroll up over the long red wall of errors.

![](../../images/2/4b.png)

When one thing is found to be working, it's time to log deeper. If the component has been declared as a single statement, or a function without a return, it makes printing to the console harder. 

```js
const Course = ({ course }) => (
  <div>
    <Header course={course} />
  </div>
)
```

The component should be changed to its longer form in order for us to add the printing: 

```js
const Course = ({ course }) => { 
  console.log(course) // highlight-line
  return (
    <div>
      <Header course={course} />
    </div>
  )
}
```

Quite often the root of the problem is that the props are expected to be of a different type, or called with a different name than they actually are, and destructuring fails as a result. The problem often begins to solve itself when destructuring is removed and we see what the <em>props</em> actually contains. 

```js
const Course = (props) => { // highlight-line
  console.log(props)  // highlight-line
  const { course } = props
  return (
    <div>
      <Header course={course} />
    </div>
  )
}
```

If the problem has still not been resolved, there really isn't much to do apart from continuing to bug-hunt by sprinkling more _console.log_ statements around your code. 

I added this chapter to the material after the model answer for the next question exploded completely (due to props being of the wrong type), and I had to debug it using <em>console.log</em>.


</div>

<div class="tasks">

<h3>Exercises 2.1.-2.5.</h3>

The exercises are submitted via GitHub, and by marking the exercises as done in the [submission system](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

You can submit all of the exercises into the same repository, or use multiple different repositories. If you submit exercises from different parts into the same repository, name your directories well.

The exercises are submitted **One part at a time**. When you have submitted the exercises for a part, you can no longer submit any missed exercises for that part.

Note that this part has more exercises than the ones before, so <i>do not submit</i> before you have done all exercises from this part you want to submit. 

**WARNING** create-react-app makes the project automatically into a git-repository, if the project is not created inside of an already existing repository. You probably **do not** want the project to become a repository, so run the command  _rm -rf .git_ from its root. 

<h4>2.1: Course information step6</h4>


Let's finish the code for rendering course contents from exercises 1.1 - 1.5. You can start with the code from the model answers. The model answers for part 1 can be found by going to the [submission system](https://studies.cs.helsinki.fi/stats/courses/fullstackopen), click on <i>my submissions</i> at the top, and in the row corresponding to part 1 under the <i>solutions</i> column click on <i>show</i>. To see the solution to the <i>course info</i> exercise, click on _index.js_ under <i>kurssitiedot</i> ("kurssitiedot" means "course info").


**Note that if you copy a project from one place to another, you might have to delete the <i>node\_modules</i> directory and install the dependencies again with the command _npm install_ before you can start the application.**
Generally, it's not recommended that you copy a project's whole contents and/or add the <i>node\_modules</i> directory to the version control system. 

Let's change the <i>App</i> component like so: 

```js
const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ]
  }

  return <Course course={course} />
}
```

Define a component responsible for formatting a single course called <i>Course</i>. 

The component structure of the application can be, for example, the following: 

<pre>
App
  Course
    Header
    Content
      Part
      Part
      ...
</pre>

Hence, the <i>Course</i> component contains the components defined in the previous part, which are responsible for rendering the course name and its parts. 

The rendered page can, for example, look as follows: 

![](../../images/teht/8e.png)

You don't need the sum of the exercises yet. 

The application must work <i>regardless of the number of parts a course has</i>, so make sure the application works if you add or remove parts of a course. 

Ensure that the console shows no errors!

<h4>2.2: Course information step7</h4>

Show also the sum of the exercises of the course. 

![](../../images/teht/9e.png)

<h4>2.3*: Course information step8</h4>

If you haven't done so already, calculate the sum of exercises with the array method [reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce).

**Pro tip:** when your code looks as follows:

```js
const total = 
  parts.reduce((s, p) => someMagicHere)
```

and does not work, it's worth to use <i>console.log</i>, which requires the arrow function to be written in its longer form:

```js
const total = parts.reduce((s, p) => {
  console.log('what is happening', s, p)
  return someMagicHere 
})
```

**Pro tip2:** There is a [plugin for VS Code](https://marketplace.visualstudio.com/items?itemName=cmstead.jsrefactor) that automatically changes short form arrow functions into their longer form, and vice versa. 

![](../../images/2/5b.png)

<h4>2.4: Course information step9</h4>


Let's extend our application to allow for an <i>arbitrary number</i> of courses:

```js
const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return (
    <div>
      // ...
    </div>
  )
}
```

The application can, for example, look like this: 

![](../../images/teht/10e.png)

<h4>2.5: separate module</h4>

Declare the <i>Course</i> component as a separate module, which is imported by the <i>App</i> component. You can include all subcomponents of the course into the same module. 

</div>
