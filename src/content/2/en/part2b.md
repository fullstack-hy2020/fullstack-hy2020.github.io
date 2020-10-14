---
mainImage: ../../../images/part-2.svg
part: 2
letter: b
lang: en
---

<div class="content">

Let's continue expanding our application by allowing users to add new notes. 

In order to get our page to update when new notes are added it's best to store the notes in the <i>App</i> component's state. Let's import the [useState](https://reactjs.org/docs/hooks-state.html) function and use it to define a piece of state that gets initialized with the initial notes array passed in the props. 

```js
import React, { useState } from 'react' // highlight-line
import Note from './components/Note'

const App = (props) => { // highlight-line
  const [notes, setNotes] = useState(props.notes) // highlight-line

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <Note key={note.id} note={note} />
        )}
      </ul>
    </div>
  )
}

export default App 
```

The component uses the <em>useState</em> function to initialize the piece of state stored in <em>notes</em> with the array of notes passed in the props:

```js
const App = (props) => { 
  const [notes, setNotes] = useState(props.notes) 

  // ...
}
```


If we wanted to start with an empty list of notes we would set the initial value as an empty array, and since the props would not be used, we could omit the <em>props</em> parameter from the function definition:

```js
const App = () => { 
  const [notes, setNotes] = useState([]) 

  // ...
}  
```


Let's stick with the initial value passed in the props for the time being.


Next, let's add an HTML [form](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms) to the component that will be used for adding new notes.

```js
const App = (props) => {
  const [notes, setNotes] = useState(props.notes)

// highlight-start 
  const addNote = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
  }
  // highlight-end   

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <Note key={note.id} note={note} />
        )}
      </ul>
      // highlight-start 
      <form onSubmit={addNote}>
        <input />
        <button type="submit">save</button>
      </form>   
      // highlight-end   
    </div>
  )
}
```

We have added the _addNote_ function as an event handler to the form element that will be called when the form is submitted, by clicking the submit button.

We use the method discussed in [part 1](/en/part1/component_state_event_handlers#event-handling) for defining our event handler:

```js
const addNote = (event) => {
  event.preventDefault()
  console.log('button clicked', event.target)
}
```

The <em>event</em> parameter is the [event](https://reactjs.org/docs/handling-events.html) that triggers the call to the event handler function: 


The event handler immediately calls the <em>event.preventDefault()</em> method, which prevents the default action of submitting a form. The default action would, among other things, cause the page to reload.


The target of the event stored in _event.target_ is logged to the console:

![](../../images/2/6e.png)


The target in this case is the form that we have defined in our component.

How do we access the data contained in the form's <i>input</i> element?

There are many ways to accomplish this; the first method we will take a look at is through the use of so-called [controlled components](https://reactjs.org/docs/forms.html#controlled-components).


Let's add a new piece of state called <em>newNote</em> for storing the user-submitted input **and** let's set it as the <i>input</i> element's <i>value</i> attribute:

```js
const App = (props) => {
  const [notes, setNotes] = useState(props.notes)
  // highlight-start
  const [newNote, setNewNote] = useState(
    'a new note...'
  ) 
  // highlight-end

  const addNote = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
  }

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <Note key={note.id} note={note} />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} /> //highlight-line
        <button type="submit">save</button>
      </form>   
    </div>
  )
}
```

The placeholder text stored as the initial value of the <em>newNote</em> state appears in the <i>input</i> element, but the input text can't be edited. The console displays a warning that gives us a clue as to what might be wrong:

![](../../images/2/7e.png)

Since we assigned a piece of the <i>App</i> component's state as the <i>value</i> attribute of the input element, the <i>App</i> component now [controls](https://reactjs.org/docs/forms.html#controlled-components) the behavior of the input element.

In order to enable editing of the input element, we have to register an <i>event handler</i> that synchronizes the changes made to the input with the component's state:

```js
const App = (props) => {
  const [notes, setNotes] = useState(props.notes)
  const [newNote, setNewNote] = useState(
    'a new note...'
  ) 

  // ...

// highlight-start
  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }
// highlight-end

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <Note key={note.id} note={note} />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleNoteChange} // highlight-line
        />
        <button type="submit">save</button>
      </form>   
    </div>
  )
}
```

We have now registered an event handler to the <i>onChange</i> attribute of the form's <i>input</i> element:

```js
<input
  value={newNote}
  onChange={handleNoteChange}
/>
```

The event handler is called every time <i>a change occurs in the input element</i>. The event handler function receives the event object as its <em>event</em> parameter:

```js
const handleNoteChange = (event) => {
  console.log(event.target.value)
  setNewNote(event.target.value)
}
```

The <em>target</em> property of the event object now corresponds to the controlled <i>input</i> element and <em>event.target.value</em> refers to the input value of that element.

Note that we did not need to call the _event.preventDefault()_ method like we did in the <i>onSubmit</i> event handler. This is because there is no default action that occurs on an input change, unlike on a form submission.

You can follow along in the console to see how the event handler is called:

![](../../images/2/8e.png)

You did remember to install [React devtools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi), right? Good. You can directly view how the state changes from the React Devtools tab:

![](../../images/2/9ea.png)

Now the <i>App</i> component's <em>newNote</em> state reflects the current value of the input, which means that we can complete the <em>addNote</em> function for creating new notes:

```js
const addNote = (event) => {
  event.preventDefault()
  const noteObject = {
    content: newNote,
    date: new Date().toISOString(),
    important: Math.random() < 0.5,
    id: notes.length + 1,
  }

  setNotes(notes.concat(noteObject))
  setNewNote('')
}
```

First we create a new object for the note called <em>noteObject</em> that will receive its content from the component's <em>newNote</em> state. The unique identifier <i>id</i> is generated based on the total number of notes. This method works for our application since notes are never deleted. With the help of the <em>Math.random()</em> function, our note has a 50% chance of being marked as important.

The new note is added to the list of notes using the [concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat) array method, introduced in [part 1](/en/part1/java_script#arrays):

```js
setNotes(notes.concat(noteObject))
```

The method does not mutate the original <em>notes</em> array, but rather creates <i>a new copy of the array with the new item added to the end</i>. This is important since we must [never mutate state directly](https://reactjs.org/docs/state-and-lifecycle.html#using-state-correctly) in React!

The event handler also resets the value of the controlled input element by calling the <em>setNewNote</em> function of the <em>newNote</em> state:

```js
setNewNote('')
```

You can find the code for our current application in its entirety in the <i>part2-2</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part2-notes/tree/part2-2).

### Filtering Displayed Elements

Let's add some new functionality to our application that allows us to only view the important notes.

Let's add a piece of state to the <i>App</i> component that keeps track of which notes should be displayed:

```js
const App = (props) => {
  const [notes, setNotes] = useState(props.notes) 
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true) // highlight-line
  
  // ...
}
```

Let's change the component so that it stores a list of all the notes to be displayed in the <em>notesToShow</em> variable. The items of the list depend on the state of the component:

```js
import React, { useState } from 'react'
import Note from './components/Note'

const App = (props) => {
  const [notes, setNotes] = useState(props.notes)
  const [newNote, setNewNote] = useState('') 
  const [showAll, setShowAll] = useState(true)

  // ...

// highlight-start
  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important === true)
// highlight-end

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notesToShow.map(note => // highlight-line
          <Note key={note.id} note={note} />
        )}
      </ul>
      // ...
    </div>
  )
}
```

The definition of the <em>notesToShow</em> variable is rather compact:

```js
const notesToShow = showAll
  ? notes
  : notes.filter(note => note.important === true)
```

The definition uses the [conditional](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) operator also found in many other programming languages.

The operator functions as follows. If we have:

```js
const result = condition ? val1 : val2
```

the <em>result</em> variable will be set to the value of <em>val1</em> if <em>condition</em> is true. If <em>condition</em> is false, the <em>result</em> variable will be set to the value of<em>val2</em>.

If the value of <em>showAll</em> is false, the <em>notesToShow</em> variable will be assigned to a list that only contains notes that have the <em>important</em> property set to true. Filtering is done with the help of the array [filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) method:

```js
notes.filter(note => note.important === true)
```

The comparison operator is in fact redundant, since the value of <em>note.important</em> is either <i>true</i> or <i>false</i> which means that we can simply write:

```js
notes.filter(note => note.important)
```

The reason we showed the comparison operator first was to emphasize an important detail: in JavaScript <em>val1 == val2</em> does not work as expected in all situations and it's safer to use <em>val1 === val2</em> exclusively in comparisons. You can read more about the topic [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness).

You can test out the filtering functionality by changing the initial value of the <em>showAll</em> state.

Next let's add functionality that enables users to toggle the <em>showAll</em> state of the application from the user interface.

The relevant changes are shown below:

```js
import React, { useState } from 'react' 
import Note from './components/Note'

const App = (props) => {
  const [notes, setNotes] = useState(props.notes) 
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  // ...

  return (
    <div>
      <h1>Notes</h1>
// highlight-start      
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>
// highlight-end            
      <ul>
        {notesToShow.map(note =>
          <Note key={note.id} note={note} />
        )}
      </ul>
      // ...    
    </div>
  )
}
```


The displayed notes (all versus important) are controlled with a button. The event handler for the button is so simple that it has been defined directly in the attribute of the button element. The event handler switches the value of _showAll_ from true to false and vice versa:

```js
() => setShowAll(!showAll)
```

The text of the button depends on the value of the <em>showAll</em> state:

```js
show {showAll ? 'important' : 'all'}
```

You can find the code for our current application in its entirety in the <i>part2-3</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part2-notes/tree/part2-3).
</div>

<div class="tasks">

<h3>Exercises 2.6.-2.10.</h3>

In the first exercise, we will start working on an application that will be further developed in the later exercises. In related sets of exercises it is sufficient to return the final version of your application. You may also make a separate commit after you have finished each part of the exercise set, but doing so is not required.

**WARNING** create-react-app will automatically turn your project into a git-repository unless you create your application inside of an existing git repository. It's likely that you **do not want** your project to be a repository, so simply run the _rm -rf .git_ command at the root of your application.

<h4>2.6: The Phonebook Step1</h4>

Let's create a simple phonebook. <i>**In this part we will only be adding names to the phonebook.**</i>

Let us start by implementing the addition of a person to phonebook.

You can use the code below as a starting point for the <i>App</i> component of your application:

```js
import React, { useState } from 'react'

const App = () => {
  const [ persons, setPersons ] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [ newName, setNewName ] = useState('')

  return (
    <div>
      <h2>Phonebook</h2>
      <form>
        <div>
          name: <input />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      ...
    </div>
  )
}

export default App
```

The <em>newName</em> state is meant for controlling the form input element.

Sometimes it can be useful to render state and other variables as text for debugging purposes. You can temporarily add the following element to the rendered component:

```
<div>debug: {newName}</div>
```

It's also important to put what we learned in the [debugging React applications](/en/part1/a_more_complex_state_debugging_react_apps) chapter of part one into good use. The [React developer tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) extension especially, is incredibly useful for tracking changes that occur in the application's state.

After finishing this exercise your application should look something like this:

![](../../images/2/10e.png)

Note the use of the React developer tools extension in the picture above!

**NB:**


- you can use the person's name as value of the <i>key</i> property
- remember to prevent the default action of submitting HTML forms!

<h4>2.7: The Phonebook Step2</h4>

Prevent the user from being able to add names that already exist in the phonebook. JavaScript arrays have numerous suitable [methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) for accomplishing this task.

Issue a warning with the [alert](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert) command when such an action is attempted:

![](../../images/2/11e.png)

**Hint:** when you are forming strings that contain values from variables, it is recommended to use a [template string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals):

```js
`${newName} is already added to phonebook`
```

If the <em>newName</em> variable holds the value <i>Arto Hellas</i>, the template string expression returns the string

```js
`Arto Hellas is already added to phonebook`
```

The same could be done in a more Java-like fashion by using the plus operator:

```js
newName + ' is already added to phonebook'
```

Using template strings is the more idiomatic option and the sign of a true JavaScript professional.

<h4>2.8: The Phonebook Step3</h4>

Expand your application by allowing users to add phone numbers to the phone book. You will need to add a second <i>input</i> element to the form (along with its own event handler):

```js
<form>
  <div>name: <input /></div>
  <div>number: <input /></div>
  <div><button type="submit">add</button></div>
</form>
```


At this point the application could look something like this. The image also displays the application's state with the help of [React developer tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi):

![](../../images/2/12e.png)

<h4>2.9*: The Phonebook Step4</h4>

Implement a search field that can be used to filter the list of people by name:

![](../../images/2/13e.png)

You can implement the search field as an <i>input</i> element that is placed outside the HTML form. The filtering logic shown in the image is <i>case insensitive</i>, meaning that the search term <i>arto</i> also returns results that contain Arto with an uppercase A.


**NB:** When you are working on new functionality, it's often useful to "hardcode" some dummy data into your application, e.g.

```js
const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])

  // ...
}
```

This saves you from having to manually input data into your application for testing out your new functionality.

<h4>2.10: The Phonebook Step5</h4>

If you have implemented your application in a single component, refactor it by extracting suitable parts into new components. Maintain the application's state and all event handlers in the <i>App</i> root component.

It is sufficient to extract <i>**three**</i> components from the application. Good candidates for separate components are, for example, the search filter, the form for adding new people into the phonebook, a component that renders all people from the phonebook, and a component that renders a single person's details.

The application's root component could look similar to this after the refactoring. The refactored root component below only renders titles and lets the extracted components take care of the rest.

```js
const App = () => {
  // ...

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter ... />

      <h3>Add a new</h3>

      <PersonForm 
        ...
      />

      <h3>Numbers</h3>

      <Persons ... />
    </div>
  )
}
```

<!-- **HUOM**: saatat törmätä ongelmiin tässä tehtävässä, jos määrittelet komponentteja "väärässä paikassa", nyt kannattaakin ehdottomasti kerrata edellisen osan luku [älä määrittele komponenttia komponentin sisällä](/osa1/monimutkaisempi_tila_reactin_debuggaus#ala-maarittele-komponenttia-komponentin-sisalla). -->
**NB**: You might run into problems in this exercise if you define your components "in the wrong place". Now would be a good time to rehearse 
the chapter [do not define a component in another component](/en/part1/a_more_complex_state_debugging_react_apps#do-not-define-components-within-components)
from last part.

</div>
