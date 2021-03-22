---
mainImage: ../../../images/part-1.svg
part: 1
letter: c
lang: en
---

<div class="content">

Let's go back to working with React.

We start with a new example:

```js
const Hello = (props) => {
  return (
    <div>
      <p>
        Hello {props.name}, you are {props.age} years old
      </p>
    </div>
  )
}

const App = () => {
  const name = 'Peter'
  const age = 10

  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="Maya" age={26 + 10} />
      <Hello name={name} age={age} />
    </div>
  )
}
```

### Component helper functions

Let's expand our <i>Hello</i> component so that it guesses the year of birth of the person being greeted:

```js
const Hello = (props) => {
  // highlight-start
  const bornYear = () => {
    const yearNow = new Date().getFullYear()
    return yearNow - props.age
  }
  // highlight-end

  return (
    <div>
      <p>
        Hello {props.name}, you are {props.age} years old
      </p>
      <p>So you were probably born in {bornYear()}</p> // highlight-line
    </div>
  )
}
```

The logic for guessing the year of birth is separated into its own function that is called when the component is rendered.

The person's age does not have to be passed as a parameter to the function, since it can directly access all props that are passed to the component.

If we examine our current code closely, we'll notice that the helper function is actually defined inside of another function that defines the behavior of our component. In Java programming, defining a function inside another one is complex and cumbersome, so not all that common. In JavaScript, however, defining functions within functions is a commonly-used technique.

### Destructuring

Before we move forward, we will take a look at a small but useful feature of the JavaScript language that was added in the ES6 specification, that allows us to [destructure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) values from objects and arrays upon assignment.

In our previous code, we had to reference the data passed to our component as _props.name_ and _props.age_. Of these two expressions we had to repeat _props.age_ twice in our code.

Since <i>props</i> is an object

```js
props = {
  name: 'Arto Hellas',
  age: 35,
}
```

we can streamline our component by assigning the values of the properties directly into two variables _name_ and _age_ which we can then use in our code:

```js
const Hello = (props) => {
  // highlight-start
  const name = props.name
  const age = props.age
  // highlight-end

  const bornYear = () => new Date().getFullYear() - age

  return (
    <div>
      <p>Hello {name}, you are {age} years old</p>
      <p>So you were probably born in {bornYear()}</p>
    </div>
  )
}
```

Note that we've also utilized the more compact syntax for arrow functions when defining the _bornYear_ function. As mentioned earlier, if an arrow function consists of a single expression, then the function body does not need to be written inside of curly braces. In this more compact form, the function simply returns the result of the single expression.

To recap, the two function definitions shown below are equivalent:
```js
const bornYear = () => new Date().getFullYear() - age

const bornYear = () => {
  return new Date().getFullYear() - age
}
```

Destructuring makes the assignment of variables even easier, since we can use it to extract and gather the values of an object's properties into separate variables:

```js
const Hello = (props) => {
    // highlight-start
  const { name, age } = props
    // highlight-end
  const bornYear = () => new Date().getFullYear() - age

  return (
    <div>
      <p>Hello {name}, you are {age} years old</p>
      <p>So you were probably born in {bornYear()}</p>
    </div>
  )
}
```

<!-- Eli koska -->
If the object we are destructuring has the values
```js
props = {
  name: 'Arto Hellas',
  age: 35,
}
```

the expression <em>const { name, age } = props</em> assigns the values 'Arto Hellas' to _name_ and 35 to _age_.

We can take destructuring a step further:
```js
const Hello = ({ name, age }) => { // highlight-line
  const bornYear = () => new Date().getFullYear() - age

  return (
    <div>
      <p>
        Hello {name}, you are {age} years old
      </p>
      <p>So you were probably born in {bornYear()}</p>
    </div>
  )
}
```

The props that are passed to the component are now directly destructured into the variables _name_ and _age_.

This means that instead of assigning the entire props object into a variable called <i>props</i> and then assigning its properties into the variables _name_ and _age_

```js
const Hello = (props) => {
  const { name, age } = props
```

we assign the values of the properties directly to variables by destructuring the props object that is passed to the component function as a parameter:

```js
const Hello = ({ name, age }) => {
```

### Page re-rendering

So far all of our applications have been such that their appearance remains the same after the initial rendering. What if we wanted to create a counter where the value increased as a function of time or at the click of a button?

Let's start with the following. File <i>App.js</i> becomes:

```js
import React from 'react'

const App = (props) => {
  const {counter} = props
  return (
    <div>{counter}</div>
  )
}

export default App
```

And file <i>index.js</i> becomes:

```js
import ReactDOM from 'react-dom'
import App from './App'

let counter = 1

ReactDOM.render(
  <App counter={counter} />, 
  document.getElementById('root')
)
```


**Note** when you change file <i>index.js</i> React does not refresh the page automatically so you need to reload the browser page to get the new content shown.

The App component is given the value of the counter via the _counter_ prop. This component renders the value to the screen. What happens when the value of _counter_ changes? Even if we were to add the following

```js
counter += 1
```

the component won't re-render. We can get the component to re-render by calling the _ReactDOM.render_ method a second time, e.g. in the following way:

```js
let counter = 1

const refresh = () => {
  ReactDOM.render(<App counter={counter} />, 
  document.getElementById('root'))
}

refresh()
counter += 1
refresh()
counter += 1
refresh()
```

The re-rendering command has been wrapped inside of the _refresh_ function to cut down on the amount of copy-pasted code.

Now the component  <i>renders three times</i>, first with the value 1, then 2, and finally 3. However, the values 1 and 2 are displayed on the screen for such a short amount of time that they can't be noticed.

We can implement slightly more interesting functionality by re-rendering and incrementing the counter every second by using [setInterval](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval):

```js
setInterval(() => {
  refresh()
  counter += 1
}, 1000)
```

Making repeated calls to the _ReactDOM.render_ method is not the recommended way to re-render components. Next, we'll introduce a better way of accomplishing this effect.

### Stateful component

All of our components up till now have been simple in the sense that they have not contained any state that could change during the lifecycle of the component.

Next, let's add state to our application's <i>App</i> component with the help of React's [state hook](https://reactjs.org/docs/hooks-state.html).

We will change the application as follows.  <i>index.js</i> goes back to

```js
import ReactDOM from 'react-dom'
import App from './App'

ReactDOM.render(<App />, 
document.getElementById('root'))
```

and <i>App.js</i> changes to the following:

```js
import React, { useState } from 'react' // highlight-line

const App = () => {
  const [ counter, setCounter ] = useState(0) // highlight-line

// highlight-start
  setTimeout(
    () => setCounter(counter + 1),
    1000
  )
  // highlight-end

  return (
    <div>{counter}</div>
  )
}

export default App
```


In the first row, the file imports the _useState_ function:

```js
import React, { useState } from 'react'
```

The function body that defines the component begins with the function call:

```js
const [ counter, setCounter ] = useState(0)
```

The function call adds <i>state</i> to the component and renders it initialized with the value of zero. The function returns an array that contains two items. We assign the items to the variables _counter_ and _setCounter_ by using the destructuring assignment syntax shown earlier.

The _counter_ variable is assigned the initial value of <i>state</i> which is zero. The variable _setCounter_ is assigned to a function that will be used to <i>modify the state</i>.

The application calls the [setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) function and passes it two parameters: a function to increment the counter state and a timeout of one second:

```js
setTimeout(
  () => setCounter(counter + 1),
  1000
)
```

The function passed as the first parameter to the _setTimeout_ function is invoked one second after calling the _setTimeout_ function

```js
() => setCounter(counter + 1)
```

When the state modifying function _setCounter_ is called, <i>React re-renders the component</i> which means that the function body of the component function gets re-executed:

```js
() => {
  const [ counter, setCounter ] = useState(0)

  setTimeout(
    () => setCounter(counter + 1),
    1000
  )

  return (
    <div>{counter}</div>
  )
}
```

The second time the component function is executed it calls the _useState_ function and returns the new value of the state: 1. Executing the function body again also makes a new function call to _setTimeout_, which executes the one second timeout and increments the _counter_ state again. Because the value of the _counter_ variable is 1, incrementing the value by 1 is essentially the same as an expression setting the value of _counter_ to 2.

```js
() => setCounter(2)
```
Meanwhile, the old value of _counter_ - "1" - is rendered to the screen.

Every time the _setCounter_  modifies the state it causes the component to re-render. The value of the state will be incremented again after one second, and this will continue to repeat for as long as the application is running.

If the component doesn't render when you think it should, or if it renders at the "wrong time", you can debug the application by logging the values of the component's variables to the console. If we make the following additions to our code:

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  setTimeout(
    () => setCounter(counter + 1),
    1000
  )

  console.log('rendering...', counter) // highlight-line

  return (
    <div>{counter}</div>
  )
}
```

It's easy to follow and track the calls made to the <i>App</i> component's render function:

![](../../images/1/4e.png)

### Event handling

We have already mentioned <i>event handlers</i> a few times in [part 0](/en/part0), that are registered to be called when specific events occur. E.g. a user's interaction with the different elements of a web page can cause a collection of various different kinds of events to be triggered.

Let's change the application so that increasing the counter happens when a user clicks a button, which is implemented with the [button](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) element.

Button elements support so-called [mouse events](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent), of which [click](https://developer.mozilla.org/en-US/docs/Web/Events/click) is the most common event.

In React, registering an event handler function to the <i>click</i> event [happens](https://reactjs.org/docs/handling-events.html) like this:

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  // highlight-start
  const handleClick = () => {
    console.log('clicked')
  }
  // highlight-end

  return (
    <div>
      <div>{counter}</div>
      // highlight-start
      <button onClick={handleClick}>
        plus
      </button>
      // highlight-end
    </div>
  )
}
```

We set the value of the button's <i>onClick</i> attribute to be a reference to the _handleClick_ function defined in the code.

Now every click of the <i>plus</i> button causes the _handleClick_ function to be called, meaning that every click event will log a <i>clicked</i> message to the browser console.

The event handler function can also be defined directly in the value assignment of the onClick-attribute:

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  return (
    <div>
      <div>{counter}</div>
      <button onClick={() => console.log('clicked')}> // highlight-line
        plus
      </button>
    </div>
  )
}
```

By changing the event handler to the following form
```js
<button onClick={() => setCounter(counter + 1)}>
  plus
</button>
```

we achieve the desired behavior, meaning that the value of _counter_ is increased by one <i>and</i> the component gets re-rendered.

Let's also add a button for resetting the counter:

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  return (
    <div>
      <div>{counter}</div>
      <button onClick={() => setCounter(counter + 1)}>
        plus
      </button>
      // highlight-start
      <button onClick={() => setCounter(0)}> 
        zero
      </button>
      // highlight-end
    </div>
  )
}
```

Our application is now ready!


<!-- ### Tapahtumankäsittelijä on funktio -->

### Event handler is a function

<!-- Nappien tapahtumankäsittelijät on siis määritelty suoraan <i>onClick</i>-attribuuttien määrittelyn yhteydessä seuraavasti: -->
We define the event handlers for our buttons where we declare their <i>onClick</i> attributes:

```js
<button onClick={() => setCounter(counter + 1)}> 
  plus
</button>
```

<!-- Entä jos yritämme määritellä tapahtumankäsittelijän hieman yksinkertaisemmassa muodossa: -->
What if we'd try to define the event handlers in a simpler form?

```js
<button onClick={setCounter(counter + 1)}> 
  plus
</button>
```

<!-- Tämä muutos kuitenkin hajottaa sovelluksemme täysin: -->
This would completely break our application:

![](../../images/1/5b.png)

<!-- Mistä on kyse? Tapahtumankäsittelijäksi on tarkoitus määritellä joko <i>funktio</i> tai <i>viite funktioon</i>. Kun koodissa on -->
What's going on? An event handler is supposed to be either a <i>function</i> or a <i>function reference</i>, and when we write:

```js
<button onClick={setCounter(counter + 1)}>
```

<!-- tapahtumankäsittelijäksi tulee määriteltyä <i>funktiokutsu</i>. Sekin on monissa tilanteissa ok, mutta ei nyt. Kun React renderöi metodin ensimmäistä kertaa ja muuttujan <i>counter</i> arvo on 0, se suorittaa kutsun <em>setCounter(0 + 1)</em>, eli muuttaa komponentin tilan arvoksi 1. Tämä taas aiheuttaa komponentin uudelleenrenderöitymisen. Ja sama toistuu uudelleen... -->
the event handler is actually a <i>function call</i>. In many situations this is ok, but not in this particular situation. In the beginning the value of the <i>counter</i> variable is 0. When React renders the component for the first time, it executes the function call <em>setCounter(0+1)</em>, and changes the value of the component's state to 1. 
This will cause the component to be re-rendered, React will execute the setCounter function call again, and the state will change leading to another rerender...

<!-- Palautetaan siis tapahtumankäsittelijä alkuperäiseen muotoonsa -->
Let's define the event handlers like we did before:

```js
<button onClick={() => setCounter(counter + 1)}> 
  plus
</button>
```

<!-- Nyt napin tapahtumankäsittelijän määrittelevä attribuutti <i>onClick</i> saa arvokseen funktion _() => setCounter(counter + 1)_, ja funktiota kutsutaan siinä vaiheessa kun sovelluksen käyttäjä painaa nappia.  -->
Now the button's attribute which defines what happens when the button is clicked - <i>onClick</i> - has the value _() => setCounter(counter + 1)_.
The setCounter function is called only when a user clicks the button. 

<!-- Tapahtumankäsittelijöiden määrittely suoraan JSX-templatejen sisällä ei useimmiten ole kovin viisasta. Tässä tapauksessa se tosin on ok, koska tapahtumankäsittelijät ovat niin yksinkertaisia.  -->
Usually defining event handlers within JSX-templates is not a good idea. 
Here it's ok, because our event handlers are so simple. 

<!-- Eriytetään kuitenkin nappien tapahtumankäsittelijät omiksi komponentin sisäisiksi apufunktioikseen: -->
Let's separate the event handlers into separate functions anyway: 

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

// highlight-start
  const increaseByOne = () => setCounter(counter + 1)
  
  const setToZero = () => setCounter(0)
  // highlight-end

  return (
    <div>
      <div>{counter}</div>
      <button onClick={increaseByOne}> // highlight-line
        plus
      </button>
      <button onClick={setToZero}> // highlight-line
        zero
      </button>
    </div>
  )
}
```

<!-- Tälläkin kertaa tapahtumankäsittelijät on määritelty oikein, sillä <i>onClick</i>-attribuutit saavat arvokseen muuttujan, joka tallettaa viitteen funktioon: -->
Here, the event handlers have been defined correctly. The value of the <i>onClick</i> attribute is a variable containing a reference to a function:

```js
<button onClick={increaseByOne}> 
  plus
</button>
```

### Passing state to child components

It's recommended to write React components that are small and reusable across the application and even across projects. Let's refactor our application so that it's composed of three smaller components, one component for displaying the counter and two components for buttons.

Let's first implement a <i>Display</i> component that's responsible for displaying the value of the counter.

One best practice in React is to [lift the state up](https://reactjs.org/docs/lifting-state-up.html) in the component hierarchy. The documentation says:

> <i>Often, several components need to reflect the same changing data. We recommend lifting the shared state up to their closest common ancestor.</i>

So let's place the application's state in the <i>App</i> component and pass it down to the <i>Display</i> component through <i>props</i>:

```js
const Display = (props) => {
  return (
    <div>{props.counter}</div>
  )
}
```

Using the component is straightforward, as we only need to pass the state of the _counter_ to it:

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  const increaseByOne = () => setCounter(counter + 1)
  const setToZero = () => setCounter(0)

  return (
    <div>
      <Display counter={counter}/> // highlight-line
      <button onClick={increaseByOne}>
        plus
      </button>
      <button onClick={setToZero}> 
        zero
      </button>
    </div>
  )
}
```

Everything still works. When the buttons are clicked and the <i>App</i> gets re-rendered, all of its children including the <i>Display</i> component are also re-rendered.

Next, let's make a <i>Button</i> component for the buttons of our application. We have to pass the event handler as well as the title of the button through the component's props:

```js
const Button = (props) => {
  return (
    <button onClick={props.handleClick}>
      {props.text}
    </button>
  )
}
```

Our <i>App</i> component now looks like this:

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  const increaseByOne = () => setCounter(counter + 1)
  //highlight-start
  const decreaseByOne = () => setCounter(counter - 1)
  //highlight-end
  const setToZero = () => setCounter(0)

  return (
    <div>
      <Display counter={counter}/>
      // highlight-start
      <Button
        handleClick={increaseByOne}
        text='plus'
      />
      <Button
        handleClick={setToZero}
        text='zero'
      />     
      <Button
        handleClick={decreaseByOne}
        text='minus'
      />           
      // highlight-end
    </div>
  )
}
```

Since we now have an easily reusable <i>Button</i> component, we've also implemented new functionality into our application by adding a button that can be used to decrement the counter.

The event handler is passed to the <i>Button</i> component through the _handleClick_ prop. The name of the prop itself is not that significant, but our naming choice wasn't completely random. React's own official [tutorial](https://reactjs.org/tutorial/tutorial.html) suggests this convention.

### Changes in state cause rerendering

<!-- Kerrataan vielä sovelluksen toiminnan pääperiaatteet.  -->
Let's go over the main principles of how an application works once more.

<!-- Kun sovellus käynnistyy, suoritetaan komponentin _App_-koodi, joka luo [useState](https://reactjs.org/docs/hooks-reference.html#usestate)-hookin avulla sovellukselle laskurin tilan _counter_. Komponentti renderöi laskimen alkuarvon 0 näyttävän komponentin _Display_ sekä kolme _Button_-komponenttia, joille se asettaa laskurin tilaa muuttavat tapahtumankäsittelijät. -->
When the application starts, the code in _App_ is executed. This code uses a [useState](https://reactjs.org/docs/hooks-reference.html#usestate) hook to create the application state, setting an initial value of the variable _counter_.
This component contains the _Display_ component - which displays the counter's value, 0 - and two _Button_ components. The buttons all have event handlers, which are used to change the state of the counter.

<!-- Kun jotain napeista painetaan, suoritetaan vastaava tapahtumankäsittelijä. Tapahtumankäsittelijä muuttaa komponentin _App_ tilaa funktion _setCounter_ avulla. **Tilaa muuttavan funktion kutsuminen aiheuttaa komponentin uudelleenrenderöitymisen.**  -->
When one of the buttons is clicked, the event handler is executed. The event handler changes the state of the _App_ component with the _setCounter_ function. 
**Calling a function which changes the state causes the component to rerender.**

<!-- Eli jos painetaan nappia <i>plus</i>, muuttaa napin tapahtumankäsittelijä tilan _counter_ arvoksi 1 ja komponentti _App_ renderöidään uudelleen. Komponentin uudelleenrenderöinti aiheuttaa sen "alikomponentteina" olevien _Display_- ja _Button_-komponenttien uudelleenrenderöitymisen. _Display_ saa propsin arvoksi laskurin uuden arvon 1 ja _Button_-komponentit saavat propseina tilaa sopivasti muuttavat tapahtumankäsittelijät. -->
So, if a user clicks the <i>plus</i> button, the button's event handler changes the value of _counter_ to 1, and the _App_ component is rerendered. 
This causes its subcomponents _Display_ and _Button_ to also be re-rendered. 
_Display_ receives the new value of the counter, 1, as props. The _Button_ components receive event handlers which can be used to change the state of the counter.

### Refactoring the components

<!-- Laskimen arvon näyttävä komponentti on siis seuraava -->
The component displaying the value of the counter is as follows:

```js
const Display = (props) => {
  return (
    <div>{props.counter}</div>
  )
}
```

<!-- Komponentti tarvitsee ainoastaan <i>propsin</i> kenttää _counter_, joten se voidaan yksinkertaistaa [destrukturoinnin](/osa1/komponentin_tila_ja_tapahtumankasittely#destrukturointi) avulla seuraavaan muotoon: -->
The component only uses the _counter_ field of its <i>props</i>. 
This means we can simplify the component by using [destructuring](/en/part1/component_state_event_handlers#destructuring), like so:

```js
const Display = ({ counter }) => {
  return (
    <div>{counter}</div>
  )
}
```

<!-- Koska komponentin määrittelevä metodi ei sisällä muuta kuin returnin, voimme määritellä sen hyödyntäen nuolifunktioiden tiiviimpää ilmaisumuotoa -->
The function defining the component contains only the return statement, so
we can define the function using the more compact form of arrow functions:

```js
const Display = ({ counter }) => <div>{counter}</div>
```

<!-- Vastaava suoraviivaistus voidaan tehdä myös nappia edustavalle komponentille -->
We can simplify the Button component as well.

```js
const Button = (props) => {
  return (
    <button onClick={props.handleClick}>
      {props.text}
    </button>
  )
}
```

<!-- Eli destrukturoidaan <i>props</i>:ista tarpeelliset kentät ja käytetään nuolifunktioiden tiiviimpää muotoa  -->
We can use destructuring to get only the required fields from <i>props</i>, and use the more compact form of arrow functions:

```js
const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)
```

</div>
