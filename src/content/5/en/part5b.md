---
mainImage: ../../../images/part-5.svg
part: 5
letter: b
lang: en
---

<div class="content">

### Displaying the login form only when appropriate

Let's modify the application so that the login form is not displayed by default:

![browser showing log in button by default](../../images/5/10e.png)

The login form appears when the user presses the <i>login</i> button:

![user at login screen about to press cancel](../../images/5/11e.png)

The user can close the login form by clicking the <i>cancel</i> button.

Let's start by extracting the login form into its own component:

```js
const LoginForm = ({
   handleSubmit,
   handleUsernameChange,
   handlePasswordChange,
   username,
   password
  }) => {
  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          username
          <input
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
      </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm
```

The state and all the functions related to it are defined outside of the component and are passed to the component as props.

Notice that the props are assigned to variables through <i>destructuring</i>, which means that instead of writing:

```js
const LoginForm = (props) => {
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={props.handleSubmit}>
        <div>
          username
          <input
            value={props.username}
            onChange={props.handleChange}
            name="username"
          />
        </div>
        // ...
        <button type="submit">login</button>
      </form>
    </div>
  )
}
```

where the properties of the _props_ object are accessed through e.g. _props.handleSubmit_, the properties are assigned directly to their own variables.

One fast way of implementing the functionality is to change the _loginForm_ function of the <i>App</i> component like so:

```js
const App = () => {
  const [loginVisible, setLoginVisible] = useState(false) // highlight-line

  // ...

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  // ...
}
```

The <i>App</i> components state now contains the boolean <i>loginVisible</i>, which defines if the login form should be shown to the user or not.

The value of _loginVisible_ is toggled with two buttons. Both buttons have their event handlers defined directly in the component:

```js
<button onClick={() => setLoginVisible(true)}>log in</button>

<button onClick={() => setLoginVisible(false)}>cancel</button>
```

The visibility of the component is defined by giving the component an [inline](/en/part2/adding_styles_to_react_app#inline-styles) style rule, where the value of the [display](https://developer.mozilla.org/en-US/docs/Web/CSS/display) property is <i>none</i> if we do not want the component to be displayed:

```js
const hideWhenVisible = { display: loginVisible ? 'none' : '' }
const showWhenVisible = { display: loginVisible ? '' : 'none' }

<div style={hideWhenVisible}>
  // button
</div>

<div style={showWhenVisible}>
  // button
</div>
```

We are once again using the "question mark" ternary operator. If _loginVisible_ is <i>true</i>, then the CSS rule of the component will be:

```css
display: 'none';
```

If _loginVisible_ is <i>false</i>, then <i>display</i> will not receive any value related to the visibility of the component.

### The components children, aka. props.children

The code related to managing the visibility of the login form could be considered to be its own logical entity, and for this reason, it would be good to extract it from the <i>App</i> component into a separate component.

Our goal is to implement a new <i>Togglable</i> component that can be used in the following way:

```js
<Togglable buttonLabel='login'>
  <LoginForm
    username={username}
    password={password}
    handleUsernameChange={({ target }) => setUsername(target.value)}
    handlePasswordChange={({ target }) => setPassword(target.value)}
    handleSubmit={handleLogin}
  />
</Togglable>
```

The way that the component is used is slightly different from our previous components. The component has both opening and closing tags that surround a <i>LoginForm</i> component. In React terminology <i>LoginForm</i> is a child component of <i>Togglable</i>.

We can add any React elements we want between the opening and closing tags of <i>Togglable</i>, like this for example:

```js
<Togglable buttonLabel="reveal">
  <p>this line is at start hidden</p>
  <p>also this is hidden</p>
</Togglable>
```

The code for the <i>Togglable</i> component is shown below:

```js
import { useState } from 'react'

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
}

export default Togglable
```

The new and interesting part of the code is [props.children](https://reactjs.org/docs/glossary.html#propschildren), which is used for referencing the child components of the component. The child components are the React elements that we define between the opening and closing tags of a component.

This time the children are rendered in the code that is used for rendering the component itself:

```js
<div style={showWhenVisible}>
  {props.children}
  <button onClick={toggleVisibility}>cancel</button>
</div>
```

Unlike the "normal" props we've seen before, <i>children</i> is automatically added by React and always exists. If a component is defined with an automatically closing _/>_ tag, like this:

```js
<Note
  key={note.id}
  note={note}
  toggleImportance={() => toggleImportanceOf(note.id)}
/>
```

Then <i>props.children</i> is an empty array.

The <i>Togglable</i> component is reusable and we can use it to add similar visibility toggling functionality to the form that is used for creating new notes.

Before we do that, let's extract the form for creating notes into a component:

```js
const NoteForm = ({ onSubmit, handleChange, value}) => {
  return (
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={onSubmit}>
        <input
          value={value}
          onChange={handleChange}
        />
        <button type="submit">save</button>
      </form>
    </div>
  )
}
```

Next let's define the form component inside of a <i>Togglable</i> component:

```js
<Togglable buttonLabel="new note">
  <NoteForm
    onSubmit={addNote}
    value={newNote}
    handleChange={handleNoteChange}
  />
</Togglable>
```

You can find the code for our current application in its entirety in the <i>part5-4</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part2-notes/tree/part5-4).

### State of the forms

The state of the application currently is in the _App_ component.

React documentation says the [following](https://reactjs.org/docs/lifting-state-up.html) about where to place the state:

<i>Often, several components need to reflect the same changing data. We recommend lifting the shared state up to their closest common ancestor.</i>

If we think about the state of the forms, so for example the contents of a new note before it has been created, the _App_ component does not need it for anything.
We could just as well move the state of the forms to the corresponding components.

The component for a note changes like so:

```js
import { useState } from 'react'

const NoteForm = ({ createNote }) => {
  const [newNote, setNewNote] = useState('')

  const addNote = (event) => {
    event.preventDefault()
    createNote({
      content: newNote,
      important: true
    })

    setNewNote('')
  }

  return (
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={event => setNewNote(event.target.value)}
        />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default NoteForm
```

**NOTE** At the same time, we changed the behavior of the application so that new notes are important by default, i.e. the field <i>important</i> gets the value <i>true</i>.

The <i>newNote</i> state attribute and the event handler responsible for changing it have been moved from the _App_ component to the component responsible for the note form.

There is only one prop left, the _createNote_ function, which the form calls when a new note is created.

The _App_ component becomes simpler now that we have got rid of the <i>newNote</i> state and its event handler.
The _addNote_ function for creating new notes receives a new note as a parameter, and the function is the only prop we send to the form:

```js
const App = () => {
  // ...
  const addNote = (noteObject) => { // highlight-line
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
      })
  }
  // ...
  const noteForm = () => (
    <Togglable buttonLabel='new note'>
      <NoteForm createNote={addNote} />
    </Togglable>
  )

  // ...
}
```

We could do the same for the log in form, but we'll leave that for an optional exercise.

The application code can be found on [GitHub](https://github.com/fullstack-hy2020/part2-notes/tree/part5-5),
branch <i>part5-5</i>.

### References to components with ref

Our current implementation is quite good; it has one aspect that could be improved.

After a new note is created, it would make sense to hide the new note form. Currently, the form stays visible. There is a slight problem with hiding the form. The visibility is controlled with the <i>visible</i> variable inside of the <i>Togglable</i> component. How can we access it outside of the component?

There are many ways to implement closing the form from the parent component, but let's use the [ref](https://reactjs.org/docs/refs-and-the-dom.html) mechanism of React, which offers a reference to the component.

Let's make the following changes to the <i>App</i> component:

```js
import { useState, useEffect, useRef } from 'react' // highlight-line

const App = () => {
  // ...
  const noteFormRef = useRef() // highlight-line

  const noteForm = () => (
    <Togglable buttonLabel='new note' ref={noteFormRef}>  // highlight-line
      <NoteForm createNote={addNote} />
    </Togglable>
  )

  // ...
}
```

The [useRef](https://reactjs.org/docs/hooks-reference.html#useref) hook is used to create a <i>noteFormRef</i> ref, that is assigned to the <i>Togglable</i> component containing the creation note form. The <i>noteFormRef</i> variable acts as a reference to the component. This hook ensures the same reference (ref) that is kept throughout re-renders of the component.

We also make the following changes to the <i>Togglable</i> component:

```js
import { useState, forwardRef, useImperativeHandle } from 'react' // highlight-line

const Togglable = forwardRef((props, refs) => { // highlight-line
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

// highlight-start
  useImperativeHandle(refs, () => {
    return {
      toggleVisibility
    }
  })
// highlight-end

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
})  // highlight-line

export default Togglable
```

The function that creates the component is wrapped inside of a [forwardRef](https://reactjs.org/docs/react-api.html#reactforwardref) function call. This way the component can access the ref that is assigned to it.

The component uses the [useImperativeHandle](https://reactjs.org/docs/hooks-reference.html#useimperativehandle) hook to make its <i>toggleVisibility</i> function available outside of the component.

We can now hide the form by calling <i>noteFormRef.current.toggleVisibility()</i> after a new note has been created:

```js
const App = () => {
  // ...
  const addNote = (noteObject) => {
    noteFormRef.current.toggleVisibility() // highlight-line
    noteService
      .create(noteObject)
      .then(returnedNote => {     
        setNotes(notes.concat(returnedNote))
      })
  }
  // ...
}
```

To recap, the [useImperativeHandle](https://reactjs.org/docs/hooks-reference.html#useimperativehandle) function is a React hook, that is used for defining functions in a component, which can be invoked from outside of the component.

This trick works for changing the state of a component, but it looks a bit unpleasant. We could have accomplished the same functionality with slightly cleaner code using "old React" class-based components. We will take a look at these class components during part 7 of the course material. So far this is the only situation where using React hooks leads to code that is not cleaner than with class components.

There are also [other use cases](https://reactjs.org/docs/refs-and-the-dom.html) for refs than accessing React components.

You can find the code for our current application in its entirety in the <i>part5-6</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part2-notes/tree/part5-6).

### One point about components

When we define a component in React:

```js
const Togglable = () => ...
  // ...
}
```

And use it like this:

```js
<div>
  <Togglable buttonLabel="1" ref={togglable1}>
    first
  </Togglable>

  <Togglable buttonLabel="2" ref={togglable2}>
    second
  </Togglable>

  <Togglable buttonLabel="3" ref={togglable3}>
    third
  </Togglable>
</div>
```

We create <i>three separate instances of the component</i> that all have their separate state:

![browser of three togglable components](../../images/5/12e.png)

The <i>ref</i> attribute is used for assigning a reference to each of the components in the variables <i>togglable1</i>, <i>togglable2</i> and <i>togglable3</i>.

### The updated full stack developer's oath

The number of moving parts increases. At the same time, the likelihood of ending up in a situation where we are looking for a bug in the wrong place increases. So we need to be even more systematic.

So we should once more extend our oath:

Full stack development is <i> extremely hard</i>, that is why I will use all the possible means to make it easier

- I will have my browser developer console open all the time
- I will use the network tab of the browser dev tools to ensure that frontend and backend are communicating as I expect
- I will constantly keep on eye the state of the server to make sure that the data sent there by the frontend is saved there as I expect
- I will keep on eye on the database: does the backend save data there in the right format
- I progress with small steps
- <i>when I suspect that there is a bug in the frontend, I make sure that the backend works for sure</i>
- <i>when I suspect that there is a bug in the backend, I make sure that the frontend works for sure</i>
- I will write lots of _console.log_ statements to make sure I understand how the code and the tests behave and to help pinpoint problems
- If my code does not work, I will not write more code. Instead, I start deleting the code until it works or just return to a state when everything still was still working
-If a test does not pass, I make sure that the tested functionality for sure works in the application
- When I ask for help in the course Discord or Telegram channel or elsewhere I formulate my questions properly, see [here](https://fullstackopen.com/en/part0/general_info#how-to-get-help-in-discord-telegram) how to ask for help

</div>

<div class="tasks">

### Exercises 5.5.-5.11.

#### 5.5 Blog list frontend, step5

Change the form for creating blog posts so that it is only displayed when appropriate. Use functionality similar to what was shown [earlier in this part of the course material](/en/part5/props_children_and_proptypes#displaying-the-login-form-only-when-appropriate). If you wish to do so, you can use the <i>Togglable</i> component defined in part 5.

By default the form is not visible

![browser showing new note button with no form](../../images/5/13ae.png)

It expands when button <i>create new blog</i> is clicked

![browser showing form with create new](../../images/5/13be.png)

The form closes when a new blog is created.

#### 5.6 Blog list frontend, step6

Separate the form for creating a new blog into its own component (if you have not already done so), and move all the states required for creating a new blog to this component.

The component must work like the <i>NoteForm</i> component from the [material](/en/part5/props_children_and_proptypes) of this part.

#### 5.7 Blog list frontend, step7

Let's add a button to each blog, which controls whether all of the details about the blog are shown or not.

Full details of the blog open when the button is clicked.

![browser showing full details of a blog with others just having view buttons](../../images/5/13ea.png)

And the details are hidden when the button is clicked again.

At this point, the <i>like</i> button does not need to do anything.

The application shown in the picture has a bit of additional CSS to improve its appearance.

It is easy to add styles to the application as shown in part 2 using [inline](/en/part2/adding_styles_to_react_app#inline-styles) styles:

```js
const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}> // highlight-line
      <div>
        {blog.title} {blog.author}
      </div>
      // ...
  </div>
)}
```

**NB:** even though the functionality implemented in this part is almost identical to the functionality provided by the <i>Togglable</i> component, the component can not be used directly to achieve the desired behavior. The easiest solution will be to add a state to the blog post that controls the displayed form of the blog post.

#### 5.8: Blog list frontend, step8

We notice that something is wrong. When a new blog is created in the app, the name of the user that added the blog is not shown in the details of the blog:

![browser showing missing name underneath like button](../../images/5/59new.png)

When the browser is reloaded, the information of the person is displayed. This is not acceptable, find out where the problem is and make the necessary correction.

#### 5.9: Blog list frontend, step9

Implement the functionality for the like button. Likes are increased by making an HTTP _PUT_ request to the unique address of the blog post in the backend.

Since the backend operation replaces the entire blog post, you will have to send all of its fields in the request body. If you wanted to add a like to the following blog post:

```js
{
  _id: "5a43fde2cbd20b12a2c34e91",
  user: {
    _id: "5a43e6b6c37f3d065eaaa581",
    username: "mluukkai",
    name: "Matti Luukkainen"
  },
  likes: 0,
  author: "Joel Spolsky",
  title: "The Joel Test: 12 Steps to Better Code",
  url: "https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/"
},
```

You would have to make an HTTP PUT request to the address <i>/api/blogs/5a43fde2cbd20b12a2c34e91</i> with the following request data:

```js
{
  user: "5a43e6b6c37f3d065eaaa581",
  likes: 1,
  author: "Joel Spolsky",
  title: "The Joel Test: 12 Steps to Better Code",
  url: "https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/"
}
```

The backend has to be updated too to handle the user reference.

**One last warning:** if you notice that you are using async/await and the _then_-method in the same code, it is almost certain that you are doing something wrong. Stick to using one or the other, and never use both at the same time "just in case".

#### 5.10: Blog list frontend, step10

Modify the application to list the blog posts by the number of <i>likes</i>. Sorting the blog posts can be done with the array [sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) method.

#### 5.11: Blog list frontend, step11

Add a new button for deleting blog posts. Also, implement the logic for deleting blog posts in the frontend.

Your application could look something like this:

![browser of confirmation of blog removal](../../images/5/14ea.png)

The confirmation dialog for deleting a blog post is easy to implement with the [window.confirm](https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm) function.

Show the button for deleting a blog post only if the blog post was added by the user.

</div>

<div class="content">

### PropTypes

The <i>Togglable</i> component assumes that it is given the text for the button via the <i>buttonLabel</i> prop. If we forget to define it to the component:

```js
<Togglable> buttonLabel forgotten... </Togglable>
```

The application works, but the browser renders a button that has no label text.

We would like to enforce that when the <i>Togglable</i> component is used, the button label text prop must be given a value.

The expected and required props of a component can be defined with the [prop-types](https://github.com/facebook/prop-types) package. Let's install the package:

```shell
npm install prop-types
```

We can define the <i>buttonLabel</i> prop as a mandatory or <i>required</i> string-type prop as shown below:

```js
import PropTypes from 'prop-types'

const Togglable = React.forwardRef((props, ref) => {
  // ..
})

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}
```

The console will display the following error message if the prop is left undefined:

![console error stating buttonLabel is undefined](../../images/5/15.png)

The application still works and nothing forces us to define props despite the PropTypes definitions. Mind you, it is extremely unprofessional to leave <i>any</i> red output in the browser console.

Let's also define PropTypes to the <i>LoginForm</i> component:

```js
import PropTypes from 'prop-types'

const LoginForm = ({
   handleSubmit,
   handleUsernameChange,
   handlePasswordChange,
   username,
   password
  }) => {
    // ...
  }

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}
```

If the type of a passed prop is wrong, e.g. if we try to define the <i>handleSubmit</i> prop as a string, then this will result in the following warning:

![console error saying handleSubmit expected a function](../../images/5/16.png)

### ESlint

In part 3 we configured the [ESlint](/en/part3/validation_and_es_lint#lint) code style tool to the backend. Let's take ESlint to use in the frontend as well.

Create-react-app has installed ESlint to the project by default, so all that's left for us to do is define our desired configuration in the <i>.eslintrc.js</i> file.

*NB:* do not run the _eslint --init_ command. It will install the latest version of ESlint that is not compatible with the configuration file created by create-react-app!

Next, we will start testing the frontend and in order to avoid undesired and irrelevant linter errors we will install the [eslint-plugin-jest](https://www.npmjs.com/package/eslint-plugin-jest) package:

```bash
npm install --save-dev eslint-plugin-jest
```

Let's create a <i>.eslintrc.js</i> file with the following contents:

```js
/* eslint-env node */
module.exports = {
  "env": {
      "browser": true,
      "es6": true,
      "jest/globals": true 
  },
  "extends": [ 
      "eslint:recommended",
      "plugin:react/recommended"
  ],
  "parserOptions": {
      "ecmaFeatures": {
          "jsx": true
      },
      "ecmaVersion": 2018,
      "sourceType": "module"
  },
  "plugins": [
      "react", "jest"
  ],
  "rules": {
      "indent": [
          "error",
          2  
      ],
      "linebreak-style": [
          "error",
          "unix"
      ],
      "quotes": [
          "error",
          "single"
      ],
      "semi": [
          "error",
          "never"
      ],
      "eqeqeq": "error",
      "no-trailing-spaces": "error",
      "object-curly-spacing": [
          "error", "always"
      ],
      "arrow-spacing": [
          "error", { "before": true, "after": true }
      ],
      "no-console": 0,
      "react/prop-types": 0,
      "react/react-in-jsx-scope": "off"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
```

NOTE: If you are using Visual Studio Code together with ESLint plugin, you might need to add a workspace setting for it to work. If you are seeing ```Failed to load plugin react: Cannot find module 'eslint-plugin-react'``` additional configuration is needed. Adding the line ```"eslint.workingDirectories": [{ "mode": "auto" }]``` to settings.json in the workspace seems to work. See [here](https://github.com/microsoft/vscode-eslint/issues/880#issuecomment-578052807) for more information.

Let's create [.eslintignore](https://eslint.org/docs/user-guide/configuring#ignoring-files-and-directories) file with the following contents to the repository root

```bash
node_modules
build
.eslintrc.js
```

Now the directories <em>build</em> and <em>node_modules</em> will be skipped when linting.

Let us also create an npm script to run the lint:

```js
{
  // ...
  {
    "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "eslint": "eslint ." // highlight-line
  },
  // ...
}
```

Component _Togglable_ causes a nasty-looking warning <i>Component definition is missing display name</i>:

![vscode showing component definition error](../../images/5/25x.png)

The react-devtools also reveals that the component does not have a name:

![react devtools showing forwardRef as anonymous](../../images/5/26ea.png)

Fortunately, this is easy to fix

```js
import { useState, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

const Togglable = React.forwardRef((props, ref) => {
  // ...
})

Togglable.displayName = 'Togglable' // highlight-line

export default Togglable
```

You can find the code for our current application in its entirety in the <i>part5-7</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part2-notes/tree/part5-7).

Note that create-react-app has also a [default ESLint-configuration](https://www.npmjs.com/package/eslint-config-react-app), that we have now overridden. [The documentation](https://create-react-app.dev/docs/setting-up-your-editor/#extending-or-replacing-the-default-eslint-config) mentions that it is ok to replace the default but does not encourage us to do so:
 <i>We highly recommend extending the base config, as removing it could introduce hard-to-find issues</i>.

</div>

<div class="tasks">

### Exercise 5.12.

#### 5.12: Blog list frontend, step12

Define PropTypes for one of the components of your application, and add ESlint to the project. Define the configuration according to your liking. Fix all of the linter errors.

Create-react-app has installed ESlint to the project by default, so all that's left for you to do is define your desired configuration in the <i>.eslintrc.js</i> file.

*NB:* do not run the _eslint --init_ command. It will install the latest version of ESlint that is not compatible with the configuration file created by create-react-app!

</div>
