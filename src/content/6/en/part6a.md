---
mainImage: ../../../images/part-6.svg
part: 6
letter: a
lang: en
---

<div class="content">

We have followed React's recommended practice for managing application state by defining the state needed by multiple components and the functions that handle it in the [top-level](https://reactjs.org/docs/lifting-state-up.html) components of the component hierarchy. Most of the state and the functions handling it have typically been defined directly in the root component and passed via props to the components that need them. This works up to a point, but as the application grows, state management becomes challenging.

### Flux architecture

Facebook developed the [Flux](https://facebookarchive.github.io/flux/docs/in-depth-overview) architecture in the early days of React's history to ease state management problems. In Flux, the management of application state is separated entirely into external <i>stores</i> outside of React components. The state in the store is not changed directly but through specific <i>actions</i> that are created to that purpose.

When an action changes the store's state, the views are re-rendered:

![Action -> Dispatcher -> Store -> View](../../images/6/flux1.png)

If the use of the application (e.g., pressing a button) causes a need to change the state, the change is made through an action. This in turn causes the view to be re-rendered:

![Action -> Dispatcher -> Store -> View -> Action -> Dispatcher -> View](../../images/6/flux2.png)

Flux thus provides a standard way for how and where the application state is kept and for making changes to it.

### Redux

[Redux](https://redux.js.org), which follows the Flux architecture, was the dominant state management solution for React applications for nearly a decade. On this course, Redux was also used until spring 2026. Redux has always been plagued by complexity and a large amount of boilerplate code. The situation improved significantly with the introduction of [Redux Toolkit](https://redux-toolkit.js.org/), but despite this, the community continued to develop alternative state management solutions, such as [MobX](https://mobx.js.org/), [Recoil](https://recoiljs.org/) and [Jotai](https://www.npmjs.com/package/jotai). Their popularity has varied.

The most interesting, and without a doubt the most popular of the new arrivals is [Zustand](https://zustand.docs.pmnd.rs/), and it is also our choice for a state management solution. Zustand appears to have already caught up with Redux in popularity:

![](../../images/6/redux-vs-rest.png)

### Zustand

Let's get familiar with Zustand by once again implementing a counter application:

![Rendered integer and three buttons: plus, minus and zero](../../images/6/1.png)


Create a new Vite application and install <i>Zustand</i>:

```bash
npm install zustand
```

The first version, where only the counter increment works, is as follows:

```bash
import { create } from 'zustand'

const useCounterStore = create(set => ({
  counter: 0,
  increment: () => set(state => ({ counter: state.counter + 1 })),
}))

const App = () => {
  const counter = useCounterStore(state => state.counter)
  const increment = useCounterStore(state => state.increment)

  return (
    <div>
      <div>{counter}</div>
      <div>
        <button onClick={increment}>plus</button>
        <button>minus</button>
        <button>zero</button>
      </div>
      
    </div>
  )
}
```

The application starts by creating the <i>store</i>, i.e., the global state, using Zustand's [create](https://zustand.docs.pmnd.rs/reference/apis/create) function:

```bash
import { create } from 'zustand'

const useCounterStore = create(set => ({
  counter: 0,
  increment: () => set(state => ({ counter: state.counter + 1 })),
}))
```

The function receives as a parameter a <i>function</i> that returns the state to be defined for the application. The parameter is thus the following:

```js
set => ({
  counter: 0,
  increment: () => set(state => ({ counter: state.counter + 1 })),
})
```

The state thus has <i>counter</i> defined with a value of zero, and <i>increment</i> which is a function.

The application's components can access the values and functions defined in the state through the <i>useCounterStore</i> function defined using Zustand's <i>create</i>. The <i>App</i> component uses <i>selectors</i> to retrieve the <i>counter</i> value and the <i>increment</i> function from the state:

```js
const App = () => {
  // highlight-start
  // using selector to pick right part of the store state
  const counter = useCounterStore(state => state.counter)
  const increment = useCounterStore(state => state.increment)
  // highlight-end

  return (
    <div>
      <div>{counter}</div> // highlight-line
      <div>
        <button onClick={increment}>plus</button>  // highlight-line
        <button>minus</button>
        <button>zero</button>
      </div>
      
    </div>
  )
}
```

The code stores counter value of the store into a variable as follows:

```js
const counter = useCounterStore(state => state.counter)
```

A selector function <i>state => state.counter</i> is used, which determines what is returned from the store's contents. In the same way, the function stored in the store is retrieved into the variable <i>increment</i>.

The state function <i>increment</i>, which was defined as follows, is given as the click handler for the "plus" button:

```js
const useCounterStore = create(set => ({
  counter: 0,
  increment: () => set(state => ({ counter: state.counter + 1 })), // highlight-line
}))
```

Let's look at the function definition separately:

```js
() => set(state => ({ counter: state.counter + 1 }))
```

This is a function that calls the [set](https://zustand.docs.pmnd.rs/learn/guides/updating-state) function giving another function as a parameter. This function passed as a parameter defines how the state changes:

```js
state => ({ counter: state.counter + 1 })
```

which is shorthand for:

```js
state => {
  return { counter: state.counter + 1 }
}
```

The function returns a new state, which it computes based on the old state that it can access using the parameter <i>state</i>. So if the old state is, for example:

```js
{
  counter: 1,
  increment: // function definition
}
```

the new state becomes:

```js
{
  counter: 2,
  increment: // function definition
}
```

The state always also contains the state-changing function <i>increment</i>. 

The state transition function

```js
state => ({ counter: state.counter + 1 })
```

only affects the <i>counter</i> value in the state.

Nothing would prevent changing the function in the state within the state transition function; for example, if we defined it as follows:

```js
state => {
  return {
    counter: state.counter + 1 ,
    increment: console.log('increment broken')
  }
}
```

the increment button would only work the first time; after that, pressing the button would only print to the console.

When the new state is set as:

```js
state => ({ counter: state.counter + 1 })
```

only the value of the <i>counter</i> key in the state is updated; the new state is obtained by merging the old state with the value returned by the state-changing function. This is why the following state transition function:

```js
state => ({})
```

does not affect the state at all.

Let's complete the application for the remaining buttons as well:

```js
const useCounterStore = create(set => ({
  counter: 0,
  increment: () => set(state => ({ counter: state.counter + 1 })),
  decrement: () => set(state => ({ counter: state.counter - 1 })),
  zero: () => set(() => ({ counter: 0 })),  
}))

const App = () => {
  const counter = useCounterStore(state => state.counter)
  const increment = useCounterStore(state => state.increment)
  const decrement = useCounterStore(state => state.decrement)
  const zero = useCounterStore(state => state.zero)

  return (
    <div>
      <div>{counter}</div>
      <div>
        <button onClick={increment}>plus</button>
        <button onClick={decrement}>minus</button>
        <button onClick={zero}>zero</button>
      </div>
      
    </div>
  )
}
```

> #### Where do set and state come from?
>
> Where does <i>set</i> come from? It is a helper function provided by Zustand's <i>create</i> function, used to update the state. <i>create</i> calls the parameter function it receives and automatically passes <i>set</i> to it. You don't need to call or import it yourself; Zustand takes care of that.
>
> Where does <i>state</i> come from? When a function is given as a parameter to <i>set</i> (instead of a new state object directly), Zustand calls that function with the store's current state as its argument. This way, state-updating functions can access the old state to compute the new one.

### Using the state from different components

Let's refactor the application so that the store definition is moved to its own file <i>store.js</i>, and the view is split into multiple components, each defined in their own files.

The contents of <i>store.js</i> are straightforward:

```js
export const useCounterStore = create(set => ({
  counter: 0,
  increment: () => set(state => ({ counter: state.counter + 1 })),
  decrement: () => set(state => ({ counter: state.counter - 1 })),
  zero: () => set(() => ({ counter: 0 })),  
}))
```

The <i>App</i> component is simplified as follows:

```js
import Display from './Display'
import Controls from './Controls'

const App = () => {
  return (
    <div>
      <Display />
      <Controls />
    </div>
  )
}

export default App
```

What is noteworthy here is that the <i>App</i> component no longer passes state to its child components. In fact, the component does not touch the state in any way, the store definition has been fully separated outside the component.

The component that renders the counter value is simple:

```js
import { useCounterStore } from './store'

const Display = () => {
  const counter = useCounterStore(state => state.counter)

  return (
    <div>{counter}</div>
  )
}

export default Display
```

The component accesses the counter value via the <i>useCounterStore</i> function that defines the store. This is convenient in many ways, for example, there is no need to pass the state to the component through props.

The component that defines the buttons looks like this:

```js
import { useCounterStore } from './store'

const Controls = () => {
  const increment = useCounterStore(state => state.increment)
  const decrement = useCounterStore(state => state.decrement)
  const zero = useCounterStore(state => state.zero)

  return (
    <div>
      <button onClick={increment}>plus</button>
      <button onClick={decrement}>minus</button>
      <button onClick={zero}>zero</button>
    </div>
  )
}

export default Controls
```

The <i>useCounterStore</i> function takes a selector function as its parameter, which determines which part of the state to use. For example:

```js
  const increment = useCounterStore(state => state.increment)
```

Here the selector function <i>state => state.increment</i> picks the value of the <i>increment</i> key from the state — the function that increments the counter — and stores it in the variable <i>increment</i>.

We could also access the entire state as follows:

```js
  const state = useCounterStore()
  // does the same as useCounterStore(state => state), i.e., selects the entire state
```

We could then refer to the counter value and the functions using dot notation, i.e., <i>state.counter</i> and <i>state.increment</i>.

A natural question arises: would it be possible to use multiple parts of the state via destructuring:

```js
import { useCounterStore } from './store'

const Controls = () => {
  const { increment, decrement, zero } = useCounterStore() // highlight-line

  return (
    <div>
      <button onClick={increment}>plus</button>
      <button onClick={decrement}>minus</button>
      <button onClick={zero}>zero</button>
    </div>
  )
}

export default Controls
```

The solution works, but it has a significant drawback. Destructuring causes the <i>Controls</i> component to be re-rendered every time the counter value changes, even though the component only displays the buttons and not the value itself.

The best practice in Zustand is therefore to select from the state exactly only those parts that are needed in the given component. A component re-renders only when the part of the state it has selected changes. When instead writing:

```js
  const { increment, decrement, zero } = useCounterStore() 
```

the component no longer reacts to changes in the counter value, because it has not selected it from the state.

### Reorganizing the state

However, we can achieve quite a neat solution by reorganizing the state as follows:

```js
export const useCounterStore = create(set => ({
  counter: 0,
  actions: {
    increment: () => set(state => ({ counter: state.counter + 1 })),
    decrement: () => set(state => ({ counter: state.counter - 1 })),
    zero: () => set(() => ({ counter: 0 })),
  }  
}))
```

The state-changing functions are now grouped under their own key <i>actions</i>, and they can be selected as a whole and destructured:

```js
const Controls = () => {
  
  const { increment, decrement, zero } = useCounterStore(state => state.actions)

  return (
    <div>
      <button onClick={increment}>plus</button>
      <button onClick={decrement}>minus</button>
      <button onClick={zero}>zero</button>
    </div>
  )
}
```

Now no re-rendering occurs, since only the functions have been selected from the state, and they remain the same for the entire lifetime of the store.

According to some [best practices](https://tkdodo.eu/blog/working-with-zustand#only-export-custom-hooks), it is not advisable to export the function defining the entire state for use throughout the application. Instead, smaller views that expose only the necessary parts of the state should be created from it. Let's modify <i>store.js</i> as follows:

```js
import { create } from 'zustand'

const useCounterStore = create(set => ({
  counter: 0,
  actions: {
    increment: () => set(state => ({ counter: state.counter + 1 })),
    decrement: () => set(state => ({ counter: state.counter - 1 })),
    zero: () => set(() => ({ counter: 0 })),
  }  
}))

// the hook functions that are used elsewhere in app
export const useCounter = () => useCounterStore(state => state.counter)
export const useCounterControls = () => useCounterStore(state => state.actions)
```

Now, outside the module defining the state, the functions <i>useCounter</i> — which returns the counter value when called — and <i>useCounterControls</i> — which returns the functions that modify the counter value — are available. The usage changes slightly:

```js
import { useCounter } from './store' // highlight-line

const Display = () => {
  const counter = useCounter() // highlight-line

  return (
    <div>{counter}</div>
  )
}
```

```js
import { useCounterControls } from './store' // highlight-line

const Controls = () => {
  const { increment, decrement, zero } = useCounterControls() // highlight-line

  return (
    <div>
      <button onClick={increment}>plus</button>
      <button onClick={decrement}>minus</button>
      <button onClick={zero}>zero</button>
    </div>
  )
}
```

When using the state this way, there is no longer a need to use selector functions, as their use is hidden inside the definition of the new helper functions.

The more observant have noticed that the Zustand-related functions are named starting with the word <i>use</i>. The reason for this is that the function returned by Zustand's <i>create</i> function — in our example <i>useCounterStore</i> — is a React [custom hook](https://react.dev/learn/reusing-logic-with-custom-hooks) function. Our own helper functions <i>useCounter</i> and <i>useCounterControls</i> are also essentially custom hooks, because they hide the use of the custom hook <i>useCounterStore</i> inside them.

Custom hooks come with a set of rules, for example, their names are expected to always start with <i>use</i>. The [rules of hooks](https://react.dev/warnings/invalid-hook-call-warning) covered in [Part 1](/en/part1/a_more_complex_state_debugging_react_apps#rules-of-hooks) also apply to custom hooks!

</div>

<div class="tasks">

### Exercise 6.1.

Let's make a new version of the Unicafe exercise from Part 1. We'll handle the application's state management using Zustand.

You can use the project at https://github.com/fullstack-hy2020/unicafe-zustand as the base for your application.

<i>Start by removing the Git configuration of the cloned application and installing the dependencies:</i>

```bash
cd unicafe-zustand   // go to the cloned repository directory
rm -rf .git
npm install
```

#### 6.1: Unicafe revisited

Then implement the full original functionality of the application.

Your application's appearance and functionality should be the same as in Part 1:

![](../../images/1/16e.png)

</div>

<div class="content">

### Zustand notes

Our goal is to make a Zustand-based version of the good old notes application.

The first version of the application is the following. The <i>App</i> component:

```js
import { useNotes } from './store'

const App = () => {
  const notes = useNotes()

  return (
    <div>
      <ul>
        {notes.map(note => (
          <li key={note.id}>
            {note.important ? <strong>{note.content}</strong> : note.content}
          </li>
        ))}
      </ul>
    </div>
  )
}
export default App
```

Store is initially defined as follows:

```js
import { create } from 'zustand'

const useNoteStore = create(set => ({
  notes: [
    {
      id: 1,
      content: 'Zustand is less complex than Redux',
      important: true,
    },
  ],
}))

export const useNotes = () => useNoteStore(state => state.notes)
```

For now, the application does not have the functionality to add new notes, and the strore does not yet support it. The state has been initialized with one note already added so that we can verify the application can successfully render the state.

### Pure functions and immutable objects

The first attempt at an action that adds a note is the following:

```js
note => set(
          state => {
            state.notes.push(note)
            return state
          }
        )
```

The function receives a note as a parameter and returns a state where a new note has been added to the old state <i>state</i>.

Our attempt is, however, against the rules. Zustand's [documentation](https://zustand.docs.pmnd.rs/learn/guides/immutable-state-and-merging) states <i>Like with React's useState, we need to update state immutably</i>. As we know, <i>state.notes.push</i> mutates the state object, so the solution must be changed.

The proper way is to use, for example, the [Array.concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat) function, which does not modify the existing state but creates a new copy of it with the new note added:

```js
note => set(
          state => {
            return { notes: state.notes.concat(note) }
          }
        )
```

The store definition now looks as follows:

```js
import { create } from 'zustand'

const useNoteStore = create(set => ({
  notes: [],
  actions: {
    add: note => set(
      state => ({ notes: state.notes.concat(note) })
    )
  }
}))

export const useNotes = () => useNoteStore(state => state.notes)
export const useNoteActions = () => useNoteStore(state => state.actions)
```

> #### Array spread syntax
>
> Another commonly seen way to do the same thing is to use the array [spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) syntax:
>
> ```js
> state => ({ notes: [...state.notes, note] })
> ```
>
> Here, an array is formed by spreading each element of the <i>state.notes</i> array using spread syntax, and then appending the new note at the end. It is a matter of preference whether to use spread or the <i>concat</i> function.

Technically speaking, state created with Zustand is [immutable](https://developer.mozilla.org/en-US/docs/Glossary/Immutable), and the action functions that modify the state must be [pure functions](https://en.wikipedia.org/wiki/Pure_function).

Pure functions are those that <i>produce no side effects</i> and always return the same result when called with the same parameters.

### Uncontrolled form

Let's add the ability to create new notes to the application:

```js
import { useNotes, useNoteActions } from './store'

const App = () => {
  const notes = useNotes()
  const { add } = useNoteActions() // highlight-line

  const generateId = () => Number((Math.random() * 1000000).toFixed(0))  // highlight-line

 // highlight-start
  const addNote = (e) => {
    e.preventDefault()
    const content = e.target.note.value
    add({ id: generateId(), content, important: false })
    e.target.reset()
  }
   // highlight-end

  return (
    <div>
     // highlight-start
      <form onSubmit={addNote}>
        <input name="note" />
        <button type="submit">add</button>
      </form>
       // highlight-end
      <ul>
        {notes.map(note => (
          <li key={note.id}>
            {note.important ? <strong>{note.content}</strong> : note.content}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

The implementation is fairly straightforward. What is noteworthy about adding a new note is that, unlike previous React-implemented forms, we have <i>not</i> bound the form field's value to the state of the <i>App</i> component. React calls such forms [uncontrolled](https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components).

> Uncontrolled forms have certain limitations. They do not allow, for example, providing validation messages on the fly, disabling the submit button based on content, and so on. However, they are suitable for our use case this time.
You can read more about the topic [here](https://goshakkk.name/controlled-vs-uncontrolled-inputs-react/) if you wish.

The form is very simple:

```js
<form onSubmit={addNote}>
  <input name="note" />
  <button type="submit">add</button>
</form>
```

What is noteworthy about the form is that the input field has a name. This allows the handler function to access the field's value.

The addition handler is also straightforward:

```js
  const addNote = (e) => {
    e.preventDefault()
    const content = e.target.note.value
    add({ id: generateId(), content, important: false })
    e.target.reset()
  }
```

The content is retrieved from the form's text field using <i>e.target.note.value</i> into a variable, which is used as a parameter in the call to the note-adding function <i>add</i>.

The last line, <i>e.target.reset()</i>, clears the form.

The current code of the application is available in its entirety on [GitHub](https://github.com/fullstack-hy2020/zustand-notes/tree/part6-1), in the branch <i>part6-1</i>.

### More components and functionality

Let's split the application into more components. We'll separate the creation of a new note, the list of notes, and the display of a single note into their own components.

The <i>App</i> component after the change is simple:

```js
const App = () => (
  <div>
    <NoteForm />
    <NoteList />
  </div>
)
```

Note creation, i.e., <i>NoteForm</i>, doesn't contain anything dramatic, so the code is not shown here.

The component responsible for listing notes, <i>NoteList</i>, looks like the following:

```js
import { useNotes } from './store'
import Note from './Note'

const NoteList = () => {
  const notes = useNotes()

  return (
    <ul>
      {notes.map(note => (
        <Note key={note.id} note={note} />
      ))}
    </ul>
  )
}
```

The component fetches the list of notes from the store and creates a corresponding <i>Note</i> component for each, passing the note's data as props:

```js
const Note = ({ note }) => (
  <li>
    {note.important ? <strong>{note.content}</strong> : note.content}
  </li>
)
```

Let's also add the ability to toggle the importance of a note. The component after the change is the following:

```js
import { useNoteActions } from './store'

const Note = ({ note }) => {
  const { toggleImportance } = useNoteActions() // highlight-line

  return (
    <li>
      {note.important ? <strong>{note.content}</strong> : note.content}
      // highlight-start
      <button onClick={() => toggleImportance(note.id)}>
        {note.important ? 'make not important' : 'make important'}
      </button>
      // highlight-end
    </li>
  )
}
```

The component destructures the importance-toggling function from the return value of <i>useNoteActions</i>, and calls it when the toggle button is clicked.

The implementation of the importance-toggling function looks like the following:

```js
import { create } from 'zustand'

const useNoteStore = create(set => ({
  notes: [],
  actions: {
    add: note => set(
      state => ({ notes: state.notes.concat(note) })
    ),
    // highlight-start
    toggleImportance: id => set(
      state => ({
        notes: state.notes.map(note =>
          note.id === id ? { ...note, important: !note.important } : note
        )
      })
    )
     // highlight-end
  }
}))

```

The function receives the id of the note to be modified as a parameter. The new state is formed from the old state using the <i>map</i> function such that all old notes are included, except for the note to be modified, for which a version is created where its importance is toggled:

```js
{ ...note, important: !note.important } 
```

The current code of the application is available in its entirety on [GitHub](https://github.com/fullstack-hy2020/zustand-notes/tree/part6-2), in the branch <i>part6-2</i>.

</div>

<div class="tasks">

### Exercises 6.2.-6.6.

Let's implement a new version of the anecdote voting application from Part 1. Use the project at https://github.com/fullstack-hy2020/zustand-anecdotes as the base for your solution.

If you clone the project inside an existing Git repository, <i>remove the Git configuration of the cloned application:</i>

```bash
cd zustand-anecdotes  // go to the cloned repository directory
rm -rf .git
```

The application starts normally, but you need to install the dependencies first:

```bash
npm install
npm run dev
```

When completing the following exercises, the application should look like this:

![The application renders anecdotes. Each anecdote also shows the number of votes it has received and a vote button](../../images/6/u2.png)

#### 6.2: anecdotes, step1

Implement the ability to vote for anecdotes. The number of votes must be stored in the Zustand store.

#### 6.3: anecdotes, step2

Add the ability to add new anecdotes to the application.

You can keep the addition form [uncontrolled](/en/part6/flux_architecture_and_zustand#uncontrolled-form) as in the earlier example.

#### 6.4: anecdotes, step3

Separate the creation of a new anecdote into its own component called <i>AnecdoteForm</i> and separate the display of the anecdote list into its own component called <i>AnecdoteList</i>.

After this exercise, the <i>App</i> component should look as follows:

```js
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'

const App = () => {
  return (
    <div>
      <h2>Anecdotes</h2>
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App
```

#### 6.5: anecdotes, step4

Ensure that the anecdotes are kept in descending order by number of votes.

**NOTE** In this exercise it is advisable to use the [Array.toSorted](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted) function, which does not sort the original array but creates a sorted copy of it. This is because the Zustand state must not be mutated!

</div>
