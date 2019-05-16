---
mainImage: ../../../images/part-5.svg
part: 5
letter: b
lang: en
---

<div class="content">

### Displaying the login form only when appropriate

Let's modify the application so that the login form is not displayed by default:

![](../../images/5/10.png)

The login form appears when the user presses the <i>login</i> button:

![](../../images/5/11a.png)

The user can close the login form by clicking the <i>cancel</i> button.

Let's start by extracting the login form into its own component:

```js
import React from 'react'

const LoginForm = ({
   handleSubmit,
   handleUsernameChange,
   handlePasswordChange,
   username,
   password
  }) => {
  return (
    <div>
      <h2>Kirjaudu</h2>

      <form onSubmit={handleSubmit}>
        <div>
          käyttäjätunnus
          <input
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          salasana
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
      </div>
        <button type="submit">kirjaudu</button>
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
      <h2>Kirjaudu</h2>
      <form onSubmit={props.handleSubmit}>
        <div>
          käyttäjätunnus
          <input
            value={props.username}
            onChange={props.handleChange}
            name="username"
          />
        </div>
        // ...
        <button type="submit">kirjaudu</button>
      </form>
    </div>
  )
}
```

where the properties of the _props_ object are accessed through e.g. _props.handleSubmit_, the properties are assigned directly to their own variables.

One fast way of implementing the functionality is to change the _loginForm_ function of the <i>App</i> component into the following form:

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

The <i>App</i> component's state now contains the boolean <i>loginVisible</i>, that defines if the login form should be shown to the user or not.

The state that defines the visibility is toggled with two buttons. Both buttons have the event handler defined directly in the component:

```js
<button onClick={() => setLoginVisible(true)}>log in</button>

<button onClick={() => setLoginVisible(false)}>cancel</button>
```

The visibility of the component is defined by giving the component an [inline](/osa2/tyylien_lisaaminen_react_sovellukseen#inline-tyylit) style rule, where the value of the [display](https://developer.mozilla.org/en-US/docs/Web/CSS/display) property is <i>none</i> if we do not want the component to be displayed:

```js
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

<div style="{hideWhenVisible}">
  // nappi
</div>

<div style="{showWhenVisible}">
  // lomake
</div>
```

We are once again using the "question mark" ternary operator. If _loginVisible_ is <i>true</i>, then the CSS rule of the component will be:

```css
display: 'none';
```

If _loginVisible_ is <i>false</i>, then <i>display</i>  will not receive any value related to the visibility of the component.

### The component's children, aka. props.children

The code related to managing the visibility of the login form could be considered to be its own logical entity, and for this reason it is good to extract from the <i>App</i> component into its own separate component.

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

The way that the component is used is slightly different from our previous components. The component has both an opening and a closing tag that surround another <i>LoginForm</i> component. In React terminology <i>LoginForm</i> is a child component of <i>Togglable</i>.

We can add any React elements we want between the opening and closing tags of <i>Togglable</i>, like this for example:

```js
<Togglable buttonLabel="paljasta">
  <p>tämä on aluksi piilossa</p>
  <p>toinen salainen rivi</p>
</Togglable>
```

The code for the <i>Togglable</i> component is shown below:

```js
import React, { useState } from 'react'

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

The new and interesting part of the code is [props.children](https://reactjs.org/docs/glossary.html#propschildren), that is used for referencing the child components of the component. The child components are the React elements that we define between the opening and closing tags of the component.

This time the children are rendered in the code that is used for rendering the component itself:

```js
<div style={showWhenVisible}>
  {props.children}
  <button onClick={toggleVisibility}>cancel</button>
</div>
```

Unlike the "normal" props we've seen before, <i>children</i> is automatically added by React and it always exists. If a component is defined with an automatically closing _/>_ tag, like this:

```js
<Note
  key={note.id}
  note={note}
  toggleImportance={() => toggleImportanceOf(note.id)}
/>
```

Then <i>props.children</i> is an empty array.

The <i>Togglable</i> component is reusable and we can use it to add similar visibility toggling functionality to the form that is used for creating new notes.

Before we do that, let's extract the form for creating notes into its own component:

```js
const NoteForm = ({ onSubmit, handleChange, value}) => {
  return (
    <div>
      <h2>Luo uusi muistiinpano</h2>

      <form onSubmit={onSubmit}>
        <input
          value={value}
          onChange={handleChange}
        />
        <button type="submit">tallenna</button>
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

You can find the code for our current application in its entirety in the <i>part5-4</i> branch of [this github repository](https://github.com/fullstack-hy2019/part2-notes/tree/part5-4).

### References to components with ref

Our current implementation is quite good but there is one aspect that could be improved.

When a new note is created, it would make sense to hide the creation form. Currently the form stays visible. There is a slight problem with hiding the form, as the visibility is controlled with the <i>visible</i> variable inside of the <i>Togglable</i> component. How can we access the state outside of the component?

The [ref](https://reactjs.org/docs/refs-and-the-dom.html) mechanism of React offers a certain kind of reference to the component.

Let's make the following changes to the <i>App</i> component:

```js
const App = () => {
  // ...
  const noteFormRef = React.createRef() // highlight-line

  const noteForm = () => (
    <Togglable buttonLabel="new note" ref={noteFormRef}> // highlight-line
      <NoteForm
        onSubmit={addNote}
        value={newNote}
        handleChange={handleNoteChange}
      />
    </Togglable>
  )

  // ...
}
```

The [createRef](https://reactjs.org/docs/react-api.html#reactcreateref) method is used to create a <i>noteFormRef</i> ref, that is assigned to the <i>Togglable</i> component that contains the creation form. The <i>noteFormRef</i> variable functions as a reference to the component.

We also make the following changes to the <i>Togglable</i> component:

```js
import React, { useState, useImperativeHandle } from 'react' // highlight-line

const Togglable = React.forwardRef((props, ref) => { // highlight-line
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

// highlight-start
  useImperativeHandle(ref, () => {
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
})

export default Togglable
```

The function that creates the component is wrapped inside of a [forwardRef](https://reactjs.org/docs/react-api.html#reactforwardref) function call. This way the component can access the ref that is assigned to it.

The component uses the [useImperativeHandle](https://reactjs.org/docs/hooks-reference.html#useimperativehandle) hook to make its <i>toggleVisibility</i> function available outside of the component.

**NB** the old name for _useImperativeHandle_ is _useImperativeMethod_. If you are still using an alpha version of react, then the hook still uses the old name.

We can now hide the form by calling <i>noteFormRef.current.toggleVisibility()</i> after a new note has been created:

```js
const App = () => {
  // ...
  const addNote = (event) => {
    event.preventDefault()
    noteFormRef.current.toggleVisibility() // highlight-line
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() > 0.5
    }

    noteService
      .create(noteObject).then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }
  // ...
}
```

To recap, the [useImperativeHandle](https://reactjs.org/docs/hooks-reference.html#useimperativehandle) function is a React hook, that is used for defining functions for the component that can be called and invoked from outside of the component.

This trick for changing the state of component works but it looks a bit unpleasant. We could have accomplished the same functionality with slightly cleaner code with "old React" class-based components. We will take a look at these class components at the end of this part of the course material. So far this is the only situations where using React hooks leads to code that is not cleaner than with class components.

There are also [other use cases](https://reactjs.org/docs/refs-and-the-dom.html) for refs than access React components.

You can find the code for our current application in its entirety in the <i>part5-5</i> branch of [this github repository](https://github.com/fullstack-hy2019/part2-notes/tree/part5-5).

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
    ensimmäinen
  </Togglable>

  <Togglable buttonLabel="2" ref={togglable2}>
    toinen
  </Togglable>

  <Togglable buttonLabel="3" ref={togglable3}>
    kolmas
  </Togglable>
</div>
```

We create <i>three separate instances of the component</i> that all have their own separate state:

![](../../images/5/12.png)

The <i>ref</i> attribute is used for assigning a reference to each of the components in the variables <i>togglable1</i>, <i>togglable2</i> and <i>togglable3</i>.

</div>

<div class="tasks">

### Exercises

#### 5.5 Blog list frontend, step5

Change the form for creating blog posts so that it is only displayed when it is appropriate, with functionality that is similar to what was shown [earlier in this part of the course material](/osa5#kirjautumislomakkeen-näyttäminen-vain-tarvittaessa). If you wish to do so, you can use the <i>Togglable</i> component defined in part 5.

**NB** the old name for _useImperativeHandle_ is _useImperativeMethod_. If you are still using an alpha version of react, then the hook still uses the old name.

#### 5.6* Blog list frontend, step6

Modify the blog list so that all of the information about the blog post are displayed when its name is clicked in the list:

![](../../images/5/13.png)

Clicking the name of an expanded blog post should hide the additional information.

At this point the <i>like</i> button does not need to do anything.

The application shown in the picture has a bit of additional CSS to improve the appearance of the application.

It is easy to add styles to the application as shown in part 2 with [inline](/osa2/tyylien_lisaaminen_react_sovellukseen#inline-tyylit) styles as shown below:

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
    <div style={blogStyle}>
      <div onClick={() => console.log('clicked')}>  // highlight-line
        {blog.title} {blog.author}
      </div>
      // ...
  </div>
)}
```

**NB1:** you can make the name of a blog post click-able as shown in the part of the code that is highlighted.

**NB2:** even though the functionality implemented in this part is almost identical to the functionality provided by the <i>Togglable</i> component, the component can not be used directly to achieve the desired behavior. The easiest solution will be to add state to the blog post that controls the displayed form of the blog post.

#### 5.7*: Blog list frontend, step7

Implement the functionality for the like button. Likes are increased by making an HTTP _PUT_ request to the unique address of the blog post in the backend.

Since the backend operation replaces the entire blog post, you will have to send all of the fields of the blog post in the request body. IF you wanted to add a like to the following blog post:

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

**One last warning:** if you notice that you are using async/await and the _then_-method in the same code, it is almost certain that you are doing something wrong. Stick to using one or the other, and never use both at the same "just in case". 

#### 5.8*: Blog list frontend, step8

Modify the application to display the blog posts according to the number of <i>likes</i>. Sorting the blog posts can be done with the array [sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) method.

#### 5.9*: Blog list frontend, step9

Add a new button for deleting blog posts. Also implement the logic for deleting blog posts in the backend.

Your application could look something like this:

![](../../images/5/14.png)

The confirmation dialog for deleting a blog post is easy to implement with the [window.confirm](https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm) function.

#### 5.10*: Blog list frontend, step10

Show the button for deleting a blog post only if the blog post was added by the user.

</div>

<div class="content">

### PropTypes

The <i>Togglable</i> component assumes that it is given the text for the button via the <i>buttonLabel</i> prop. If we forget to define it to the component:

```js
<Togglable> buttonLabel unohtui... </Togglable>
```

The application works, but the browser renders a button that that has no label text.

We would like to enforce that when the <i>Togglable</i> component is used, the button label text prop must be given a value.

The expected and required props of a component can be defined and expressed with the [prop-types](https://github.com/facebook/prop-types) package. Let's install the package:

```js
npm install --save prop-types
```

We can define the <i>buttonLabel</i> prop as a mandatory or <i>required</i> string-type prop as shown below:

```js
import PropTypes from 'prop-types'

const Togglable = React.forwardRef((props, ref) => {
  // ..
}

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}
```

The console will display the following error message if the prop is left undefined:

![](../../images/5/15.png)

The application still works and nothing forces us to define props despite the PropTypes definitions. Mind you, it is extremely unprofessional to leave <i>any</i> red output to the browser console.

Let's also defined PropTypes to the <i>LoginForm</i> component:

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

The prop types for functional components are defined the same was as for class components:

If the type of a passed prop is wrong, e.g. if we try to define the <i>handleSubmit</i> prop as a string, then this will result in the following warning:

![](../../images/5/16.png)

### ESlint

In part 3 we configured the [ESlint](/osa3/validointi_ja_es_lint) code style tool to the backend. Let's take ESlint into use in the frontend as well.

Create-react-app has installed ESlint to the project by default, so all that's left for us to do is to define our desired configuration in the <i>.eslintrc.js</i> file. 

**NB:** do not run the _npm init_ command. It will install the latest version of ESlint that is not compatible with the configuration file created by create-react-app!

Next, we will start testing the frontend and in order to avoid undesired and irrelevant linter errors we will install the [eslint-jest-plugin](https://www.npmjs.com/package/eslint-plugin-jest) package:

```js
npm add --save-dev eslint-plugin-jest
```

Let's create a <i>.eslintrc.js</i> file with the following contents:

```js
module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "jest/globals": true // highlight-line
    },
    // highlight-start
    "extends": [ 
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    // highlight-end
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react", "jest" // highlight-line
    ],
    "rules": {
        "indent": [
            "error",
            2  // highlight-line
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
        // highlight-start
        "eqeqeq": "error",
        "no-trailing-spaces": "error",
        "object-curly-spacing": [
            "error", "always"
        ],
        "arrow-spacing": [
            "error", { "before": true, "after": true }
        ],
        "no-console": 0,
        "react/prop-types": 0
        // highlight-end
    }
};
```

You can find the code for our current application in its entirety in the <i>part5-6</i> branch of [this github repository](https://github.com/fullstack-hy2019/part2-notes/tree/part5-6).

</div>

<div class="tasks">

### Exercises

#### 5.11: Blog list frontend, step11

Define PropTypes for one of the components of your application.

#### 5.12: Blog list frontend, step12

Add ESlint to the project. Define the configuration according to your liking. Fix all of the linter errors.

</div>