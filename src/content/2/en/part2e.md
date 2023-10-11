---
mainImage: ../../../images/part-2.svg
part: 2
letter: e
lang: en
---

<div class="content">

The appearance of our current application is quite modest. In [exercise 0.2](/en/part0/fundamentals_of_web_apps#exercises-0-1-0-6), the assignment was to go through Mozilla's [CSS tutorial](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/CSS_basics).

Let's take a look at how we can add styles to a React application. There are several different ways of doing this and we will take a look at the other methods later on. First, we will add CSS to our application the old-school way; in a single file without using a [CSS preprocessor](https://developer.mozilla.org/en-US/docs/Glossary/CSS_preprocessor) (although this is not entirely true as we will learn later on).

Let's add a new <i>index.css</i> file under the <i>src</i> directory and then add it to the application by importing it in the <i>main.jsx</i> file:

```js
import './index.css'
```

Let's add the following CSS rule to the <i>index.css</i> file:

```css
h1 {
  color: green;
}
```

CSS rules comprise of <i>selectors</i> and <i>declarations</i>. The selector defines which elements the rule should be applied to. The selector above is <i>h1</i>, which will match all of the <i>h1</i> header tags in our application.

The declaration sets the _color_ property to the value <i>green</i>.

One CSS rule can contain an arbitrary number of properties. Let's modify the previous rule to make the text cursive, by defining the font style as <i>italic</i>:

```css
h1 {
  color: green;
  font-style: italic;  // highlight-line
}
```

There are many ways of matching elements by using [different types of CSS selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors).

If we wanted to target, let's say, each one of the notes with our styles, we could use the selector <i>li</i>, as all of the notes are wrapped inside <i>li</i> tags:

```js
const Note = ({ note, toggleImportance }) => {
  const label = note.important 
    ? 'make not important' 
    : 'make important';

  return (
    <li>
      {note.content} 
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}
```

Let's add the following rule to our style sheet (since my knowledge of elegant web design is close to zero, the styles don't make much sense):

```css
li {
  color: grey;
  padding-top: 3px;
  font-size: 15px;
}
```

Using element types for defining CSS rules is slightly problematic. If our application contained other <i>li</i> tags, the same style rule would also be applied to them.

If we want to apply our style specifically to notes, then it is better to use [class selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors).

In regular HTML, classes are defined as the value of the <i>class</i> attribute:

```html
<li class="note">some text...</li>
```

In React we have to use the [className](https://react.dev/learn#adding-styles) attribute instead of the class attribute. With this in mind, let's make the following changes to our <i>Note</i> component:

```js
const Note = ({ note, toggleImportance }) => {
  const label = note.important 
    ? 'make not important' 
    : 'make important';

  return (
    <li className='note'> // highlight-line
      {note.content} 
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}
```

Class selectors are defined with the _.classname_ syntax:

```css
.note {
  color: grey;
  padding-top: 5px;
  font-size: 15px;
}
```

If you now add other <i>li</i> elements to the application, they will not be affected by the style rule above.

### Improved error message

We previously implemented the error message that was displayed when the user tried to toggle the importance of a deleted note with the <em>alert</em> method. Let's implement the error message as its own React component.

The component is quite simple:

```js
const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className='error'>
      {message}
    </div>
  )
}
```

If the value of the <em>message</em> prop is <em>null</em>, then nothing is rendered to the screen, and in other cases, the message gets rendered inside of a div element.

Let's add a new piece of state called <i>errorMessage</i> to the <i>App</i> component. Let's initialize it with some error message so that we can immediately test our component:

```js
const App = () => {
  const [notes, setNotes] = useState([]) 
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('some error happened...') // highlight-line

  // ...

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} /> // highlight-line
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>      
      // ...
    </div>
  )
}
```

Then let's add a style rule that suits an error message:

```css
.error {
  color: red;
  background: lightgrey;
  font-size: 20px;
  border-style: solid;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
}
```

Now we are ready to add the logic for displaying the error message. Let's change the <em>toggleImportanceOf</em> function in the following way:

```js
  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote).then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(error => {
        // highlight-start
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        // highlight-end
        setNotes(notes.filter(n => n.id !== id))
      })
  }
```

When the error occurs we add a descriptive error message to the <em>errorMessage</em> state. At the same time, we start a timer, that will set the <em>errorMessage</em> state to <em>null</em> after five seconds.

The result looks like this:

![error removed from server screenshot from app](../../images/2/26e.png)

The code for the current state of our application can be found in the  <i>part2-7</i> branch on [GitHub](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part2-7).

### Inline styles

React also makes it possible to write styles directly in the code as so-called [inline styles](https://react-cn.github.io/react/tips/inline-styles.html).

The idea behind defining inline styles is extremely simple. Any React component or element can be provided with a set of CSS properties as a JavaScript object through the [style](https://react.dev/reference/react-dom/components/common#applying-css-styles) attribute.

CSS rules are defined slightly differently in JavaScript than in normal CSS files. Let's say that we wanted to give some element the color green and italic font that's 16 pixels in size. In CSS, it would look like this:

```css
{
  color: green;
  font-style: italic;
  font-size: 16px;
}
```

But as a React inline-style object it would look like this:

```js
{
  color: 'green',
  fontStyle: 'italic',
  fontSize: 16
}
```

Every CSS property is defined as a separate property of the JavaScript object. Numeric values for pixels can be simply defined as integers. One of the major differences compared to regular CSS, is that hyphenated (kebab case) CSS properties are written in camelCase.

Next, we could add a "bottom block" to our application by creating a <i>Footer</i> component and defining the following inline styles for it:

```js
// highlight-start
const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }

  return (
    <div style={footerStyle}>
      <br />
      <em>Note app, Department of Computer Science, University of Helsinki 2023</em>
    </div>
  )
}
// highlight-end

const App = () => {
  // ...

  return (
    <div>
      <h1>Notes</h1>

      <Notification message={errorMessage} />

      // ...  

      <Footer /> // highlight-line
    </div>
  )
}
```

Inline styles come with certain limitations. For instance, so-called [pseudo-classes](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes) can't be used straightforwardly.

Inline styles and some of the other ways of adding styles to React components go completely against the grain of old conventions. Traditionally, it has been considered best practice to entirely separate CSS from the content (HTML) and functionality (JavaScript). According to this older school of thought, the goal was to write CSS, HTML, and JavaScript into their separate files.

The philosophy of React is, in fact, the polar opposite of this. Since the separation of CSS, HTML, and JavaScript into separate files did not seem to scale well in larger applications, React bases the division of the application along the lines of its logical functional entities.

The structural units that make up the application's functional entities are React components. A React component defines the HTML for structuring the content, the JavaScript functions for determining functionality, and also the component's styling; all in one place. This is to create individual components that are as independent and reusable as possible.

The code of the final version of our application can be found in the  <i>part2-8</i> branch on [GitHub](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part2-8).

</div>

<div class="tasks">

<h3>Exercises 2.16.-2.17.</h3>

<h4>2.16: Phonebook step11</h4>

Use the [improved error message](/en/part2/adding_styles_to_react_app#improved-error-message) example from part 2 as a guide to show a notification that lasts for a few seconds after a successful operation is executed (a person is added or a number is changed):

![successful green added screenshot](../../images/2/27e.png)

<h4>2.17*: Phonebook step12</h4>

Open your application in two browsers. **If you delete a person in browser 1** a short while before attempting to <i>change the person's phone number</i> in browser 2, you will get the following 2 error messages:

![error message 404 not found when changing multiple browsers](../../images/2/29b.png)

Fix the issue according to the example shown in [promise and errors](/en/part2/altering_data_in_server#promises-and-errors) in part 2. Modify the example so that the user is shown a message when the operation does not succeed. The messages shown for successful and unsuccessful events should look different:

![error message shown on screen instead of in console feature add-on](../../images/2/28e.png)

**Note** that even if you handle the exception, the first "404" error message is still printed to the console. But you should not see "Uncaught (in promise) Error".

</div>

<div class="content">

### Couple of important remarks

At the end of this part there are a few more challenging exercises. At this stage, you can skip the exercises if they are too much of a headache, we will come back to the same themes again later. The material is worth reading through in any case.

We have done one thing in our app that is masking away a very typical source of error.

We set the state _notes_ to have initial value of an empty array:

```js
const App = () => {
  const [notes, setNotes] = useState([])

  // ...
}
```

This is a pretty natural initial value since the notes are a set, that is, there are many notes that the state will store.

If the state would be only saving "one thing", a more proper initial value would be _null_ denoting that there is <i>nothing</i> in the state at the start. Let us try what happens if we use this initial value:

```js
const App = () => {
  const [notes, setNotes] = useState(null) // highlight-line

  // ...
}
```

The app breaks down:

![console typerror cannot read properties of null via map from App](../../images/2/31a.png)

The error message gives the reason and location for the error. The code that caused the problems is the following:

```js
  // notesToShow gets the value of notes
  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)

  // ...

  {notesToShow.map(note =>  // highlight-line
    <Note key={note.id} note={note} />
  )}
```

The error message is

```bash
Cannot read properties of null (reading 'map')
```

The variable _notesToShow_ is first assigned the value of the state _notes_ and then the code tries to call method _map_ to a nonexisting object, that is, to _null_.

What is the reason for that?

The effect hook uses the function _setNotes_ to set _notes_ to have the notes that the backend is returning:

```js
  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)  // highlight-line
      })
  }, [])
```

However the problem is that the effect is executed only <i>after the first render</i>.
And because _notes_ has the initial value of null:

```js
const App = () => {
  const [notes, setNotes] = useState(null) // highlight-line

  // ...
```

on the first render the following code gets executed

```js
notesToShow = notes

// ...

notesToShow.map(note => ...)
```

and this blows up the app since we can not call method _map_ of the value _null_.

When we set _notes_ to be initially an empty array, there is no error since it is allowed to call _map_ to an empty array.

So, the initialization of the state "masked" the problem that is caused by the fact that the data is not yet fetched from the backend.

Another way to circumvent the problem is to use <i>conditional rendering</i> and return null if the component state is not properly initialized:

```js
const App = () => {
  const [notes, setNotes] = useState(null) // highlight-line
  // ... 

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  // do not render anything if notes is still null
  // highlight-start
  if (!notes) { 
    return null 
  }
  // highlight-end

  // ...
} 
```

So on the first render, nothing is rendered. When the notes arrive from the backend, the effect used function _setNotes_ to set the value of the state _notes_. This causes the component to be rendered again, and at the second render, the notes get rendered to the screen.

The method based on conditional rendering is suitable in cases where it is impossible to define the state so that the initial rendering is possible.

The other thing that we still need to have a closer look is the second parameter of the useEffect:

```js
  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)  
      })
  }, []) // highlight-line
```

The second parameter of <em>useEffect</em> is used to [specify how often the effect is run](https://react.dev/reference/react/useEffect#parameters). The principle is that the effect is always executed after the first render of the component <i>and</i> when the value of the second parameter changes.

If the second parameter is an empty array <em>[]</em>, it's content never changes and the effect is only run after the first render of the component. This is exactly what we want when we are initializing the app state from the server.

However, there are situations where we want to perform the effect at other times, e.g. when the state of the component changes in a particular way.

Consider the following simple application for querying currency exchange rates from the [Exchange rate API](https://www.exchangerate-api.com/):

```js
import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [value, setValue] = useState('')
  const [rates, setRates] = useState({})
  const [currency, setCurrency] = useState(null)

  useEffect(() => {
    console.log('effect run, currency is now', currency)

    // skip if currency is not defined
    if (currency) {
      console.log('fetching exchange rates...')
      axios
        .get(`https://open.er-api.com/v6/latest/${currency}`)
        .then(response => {
          setRates(response.data.rates)
        })
    }
  }, [currency])

  const handleChange = (event) => {
    setValue(event.target.value)
  }

  const onSearch = (event) => {
    event.preventDefault()
    setCurrency(value)
  }

  return (
    <div>
      <form onSubmit={onSearch}>
        currency: <input value={value} onChange={handleChange} />
        <button type="submit">exchange rate</button>
      </form>
      <pre>
        {JSON.stringify(rates, null, 2)}
      </pre>
    </div>
  )
}

export default App
```

The user interface of the application has a form, in the input field of which the name of the desired currency is written. If the currency exists, the application renders the exchange rates of the currency to other currencies:

![browser showing currency exchange rates with eur typed and console saying fetching exchange rates](../../images/2/32new.png)

The application sets the name of the currency entered to the form to the state _currency_ at the moment the button is pressed.

When the _currency_ gets a new value, the application fetches its exchange rates from the API in the effect function:

```js
const App = () => {
  // ...
  const [currency, setCurrency] = useState(null)

  useEffect(() => {
    console.log('effect run, currency is now', currency)

    // skip if currency is not defined
    if (currency) {
      console.log('fetching exchange rates...')
      axios
        .get(`https://open.er-api.com/v6/latest/${currency}`)
        .then(response => {
          setRates(response.data.rates)
        })
    }
  }, [currency]) // highlight-line
  // ...
}
```

The useEffect hook now has _[currency]_ as the second parameter. The effect function is therefore executed after the first render, and <i>always</i> after the table as its second parameter _[currency]_ changes. That is, when the state _currency_ gets a new value, the content of the table changes and the effect function is executed.

The effect has the following condition

```js
if (currency) { 
  // exchange rates are fetched
}
```

which prevents requesting the exchange rates just after the first render when the variable _currency_ still has the initial value, i.e. a null value.

So if the user writes e.g. <i>eur</i> in the search field, the application uses Axios to perform an HTTP GET request to the address <https://open.er-api.com/v6/latest/eur> and stores the response in the _rates_ state.

When the user then enters another value in the search field, e.g. <i>usd</i>, the effect function is executed again and the exchange rates of the new currency are requested from the API.

The way presented here for making API requests might seem a bit awkward.
This particular application could have been made completely without using the useEffect, by making the API requests directly in the form submit handler function:

```js
  const onSearch = (event) => {
    event.preventDefault()
    axios
      .get(`https://open.er-api.com/v6/latest/${value}`)
      .then(response => {
        setRates(response.data.rates)
      })
  }
```

However, there are situations where that technique would not work. For example, you <i>might</i> encounter one such a situation in the exercise 2.20 where the use of useEffect could provide a solution. Note that this depends quite much on the approach you selected, e.g. the model solution does not use this trick.

</div>

<div class="tasks">

<h3>Exercises 2.18.-2.20.</h3>

<h4>2.18* Data for countries, step1</h4>

At [https://studies.cs.helsinki.fi/restcountries/](https://studies.cs.helsinki.fi/restcountries/) you can find a service that offers a lot of information related to different countries in a so-called machine-readable format via the REST API. Make an application that allows you to view information from different countries.

The user interface is very simple. The country to be shown is found by typing a search query into the search field.

If there are too many (over 10) countries that match the query, then the user is prompted to make their query more specific:

![too many matches screenshot](../../images/2/19b1.png)

If there are ten or fewer countries, but more than one, then all countries matching the query are shown:

![matching countries in a list screenshot](../../images/2/19b2.png)

When there is only one country matching the query, then the basic data of the country (eg. capital and area), its flag and the languages spoken are shown:

![flag and additional attributes screenshot](../../images/2/19c3.png)

**NB**: It is enough that your application works for most countries. Some countries, like <i>Sudan</i>, can be hard to support since the name of the country is part of the name of another country, <i>South Sudan</i>. You don't need to worry about these edge cases.

<h4>2.19*: Data for countries, step2</h4>

**There is still a lot to do in this part, so don't get stuck on this exercise!**

Improve on the application in the previous exercise, such that when the names of multiple countries are shown on the page there is a button next to the name of the country, which when pressed shows the view for that country:

![attach show buttons for each country feature](../../images/2/19b4.png)

In this exercise, it is also enough that your application works for most countries. Countries whose name appears in the name of another country, like <i>Sudan</i>, can be ignored.

<h4>2.20*: Data for countries, step3</h4>

Add to the view showing the data of a single country, the weather report for the capital of that country. There are dozens of providers for weather data. One suggested API is [https://openweathermap.org](https://openweathermap.org). Note that it might take some minutes until a generated API key is valid.

![weather report added feature](../../images/2/19x.png)

If you use Open weather map, [here](https://openweathermap.org/weather-conditions#Icon-list) is the description for how to get weather icons.

**NB:** In some browsers (such as Firefox) the chosen API might send an error response, which indicates that HTTPS encryption is not supported, although the request URL starts with _http://_. This issue can be fixed by completing the exercise using Chrome.

**NB:** You need an api-key to use almost every weather service. Do not save the api-key to source control! Nor hardcode the api-key to your source code. Instead use an [environment variable](https://vitejs.dev/guide/env-and-mode.html) to save the key.

Assuming the api-key is <i>54l41n3n4v41m34rv0</i>, when the application is started like so:

```bash
VITE_SOME_KEY=54l41n3n4v41m34rv0 && npm run dev// For Linux/macOS Bash
($env:VITE_SOME_KEY="54l41n3n4v41m34rv0") -and (npm run dev) // For Windows PowerShell
set "VITE_SOME_KEY=54l41n3n4v41m34rv0" && npm run dev // For Windows cmd.exe
```

you can access the value of the key from the _import.meta.env_ object:

```js
const api_key = import.meta.env.VITE_SOME_KEY
// variable api_key now has the value set in startup
```

Note that you will need to restart the server to apply the changes.

This was the last exercise of this part of the course. It's time to push your code to GitHub and mark all of your finished exercises to the [exercise submission system](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

</div>
