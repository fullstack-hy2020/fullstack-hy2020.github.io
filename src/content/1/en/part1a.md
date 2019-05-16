---
mainImage: ../../../images/part-1.svg
part: 1
letter: a
lang: en
---

<div class="content">

We will now start getting familiar with probably the most important topic of this course, namely the [React](https://reactjs.org/)-library. Let's start off with making a simple React application as well as getting to know the core concepts of React.

The easiest way to get started by far is using a tool called [create-react-app](https://github.com/facebookincubator/create-react-app). It is possible to install <i>create-react-app</i> on your machine, but it is not necessary if the <i>npm</i> tool that was installed along with Node has a version number of at least <i>5.3</i>.

Let's create an application called <i>part1</i> and navigate to its directory.

```bash
$ npx create-react-app osa1
$ cd osa1
```

Every command, here and in the future, starting with the character <em>$</em> is typed into a terminal prompt, aka the command-line. The character <em>$</em> is not to be typed out because it represents the prompt.

The application is run as follows

```bash
$ npm start
```

By default, the application runs in localhost port 3000 with the address <http://localhost:3000>

Chrome should launch automatically. Open the console **immediately**. Also open a text editor so that you can view the code as well as the web-page at the same time on the screen:

![](../../images/1/1a.png)

The code of the application resides in the <i>src</i> folder. Let's simplify the default code such that the contents of the file <i>index.js</i> looks like:

```js
import React from 'react'
import ReactDOM from 'react-dom'

const App = () => (
  <div>
    <p>Hello world</p>
  </div>
)

ReactDOM.render(<App />, document.getElementById('root'))
```

The files <i>App.js</i>, <i>App.css</i>, <i>App.test.js</i>, <i>logo.svg</i> and <i>serviceWorker.js</i> may be deleted as they are not needed in our application right now.

### Component

The file <i>index.js</i> now defines a React-[component](https://reactjs.org/docs/components-and-props.html) with the name <i>App</i> and the command on the final line

```js
ReactDOM.render(<App />, document.getElementById('root'))
```

renders its contents into the <i>div</i>-element, defined in the file <i>public/index.html</i>, having the <i>id</i> value 'root'.

By default the file <i>public/index.html</i> is empty. You can try adding some HTML into the file. However, when using React, all content that needs to be rendered is usually defined as React components.

Let's take a closer look at the code defining the component:

```js
const App = () => (
  <div>
    <p>Hello world</p>
  </div>
)
```

As you probably guessed, the component will be rendered as a <i>div</i>-tag, which wraps a <i>p</i>-tag containing the text <i>Hello world</i>.

Technically the component is defined as a Javascript function. The following is a function (which does not receive any parameters):

```js
() => (
  <div>
    <p>Hello world</p>
  </div>
)
```

which is then assigned to a constant variable <i>App</i>

```js
const App = ...
```

There are a few ways to define functions in Javascript. Here we will use [arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions), which are described in a newer version of Javascript known as [EcmaScript 6](http://es6-features.org/#Constants), also called ES6.

Because the function consist of only a single expression we have used a shorthand, which represents this piece of code:

```js
const App = () => {
  return (
    <div>
      <p>Hello world</p>
    </div>
  )
}
```

In other words, the function returns the value of the expression.

The function defining the component may contain any kind of Javascript code. Modify your component to be as follows and observe what happens in the console:

```js
const App = () => {
  console.log('Hello from component')
  return (
    <div>
      <p>Hello world</p>
    </div>
  )
}
```

It is also possible to render dynamic content inside of a component.

Modify the component as follows:

```js
const App = () => {
  const now = new Date()
  const a = 10
  const b = 20

  return (
    <div>
      <p>Hello world, it is {now.toString()}</p>
      <p>
        {a} plus {b} is {a + b}
      </p>
    </div>
  )
}
```

Any Javascript code within the curly braces is evaluated and the result of this evaluation is embedded into the defined place in the HTML produced by the component.

### JSX

It seems like React components are returning HTML markup. However, this is not the case. The layout of React components is mostly written using [JSX](https://reactjs.org/docs/introducing-jsx.html). Although JSX looks like HTML, we are actually dealing with a way to write Javascript. Under the hood JSX returned by React components is compiled into Javascript.

After compiling our application looks like this:

```js
import React from 'react'
import ReactDOM from 'react-dom'

const App = () => {
  const now = new Date()
  const a = 10
  const b = 20
  return React.createElement(
    'div',
    null,
    React.createElement(
      'p', null, 'Hello world, it is ', now.toString()
    ),
    React.createElement(
      'p', null, a, ' plus ', b, ' is ', a + b
    )
  )
}

ReactDOM.render(
  React.createElement(App, null),
  document.getElementById('root')
)
```

The compiling is handled by [Babel](https://babeljs.io/repl/). Projects created with *create-react-app* are configured to compile automatically. We will learn more about this topic in [part 7](/part7) of this course.

It is also possible to write React as "pure Javascript" without using JSX. Although, nobody with a sound mind would actually do so.

In practice, JSX is much like HTML with the distinction that with JSX you can easily embed dynamic content by writing appropriate Javascript within curly braces. The idea of JSX is quite similar to many templating languages, such as Thymeleaf used along Java Spring, which are used on servers.

JSX is "XML-like", which means that every tag needs to be closed. For example, a newline is an empty element, which in HTML can be written as follows:

```html
<br>
```

but when writing JSX, the tag needs to be closed:

```html
<br />
```

### Multiple components

Let's modify the application as follows (NB: imports at the top of the file are left out in these <i>examples</i>, now and in the future. They are still needed for the code to work):

```js
// highlight-start
const Hello = () => {
  return (
    <div>
      <p>Hello world</p>
    </div>
  )
}
// highlight-end

const App = () => {
  return (
    <div>
      <h1>Greetings</h1>
      <Hello /> // highlight-line
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
```

We have defined a new component <i>Hello</i>, which is used from the component <i>App</i>. Naturally, a component can be used multiple times:

```js
const App = () => {
  return (
    <div>
      <h1>Greetings</h1>
      <Hello />
      // highlight-start
      <Hello />
      <Hello />
      // highlight-end
    </div>
  )
}
```

Writing components with React is easy, and by combining components, even a more complex application can be kept fairly maintainable. In deed, a core philosophy of React is composing applications from many specialized reusable components.

Another strong convention is the idea of a <i>root component</i> called <i>App</i> at the top of the component tree of the application. Nevertheless, as we will find in [part 6](/part6), there are situations where the component <i>App</i> is not exactly the root, but is wrapped within an appropriate utility component.

### props: passing data to components

It is possible to pass data to components using so called [props](https://reactjs.org/docs/components-and-props.html).

Let's modify the component <i>Hello</i> as follows

```js
const Hello = (props) => { // highlight-line
  return (
    <div>
      <p>Hello {props.name}</p> // highlight-line
    </div>
  )
}
```

Now the function defining the component has a parameter <i>props</i>. As an argument the parameter receives an object, which has fields corresponding to all the "props" the user of the component defines.

The props are defined as follows:

```js
const App = () => {
  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="Arto" /> // highlight-line
      <Hello name="Pekka" /> // highlight-line
    </div>
  )
}
```

There can be an arbitrary amount of props and their values can be "hard coded" strings or results of Javascript expressions. If the value of the prop is achieved using Javascript it must be wrapped with curly braces.

Let's modify the code so that the component <i>Hello</i> uses two props:

```js
const Hello = (props) => {
  return (
    <div>
      <p>
        Hello {props.name}, you are {props.age} years old // highlight-line
      </p>
    </div>
  )
}

const App = () => {
  const nimi = 'Pekka' // highlight-line
  const ika = 10       // highlight-line

  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="Arto" age={26 + 10} /> // highlight-line
      <Hello name={nimi} age={ika} />     // highlight-line
    </div>
  )
}
```

The props sent by the component <i>App</i> are the values of the variables, the result of the evaluation of the sum expression and a regular strings.

### Some notes

React has been configured to generate quite good error messages. Despite this, you should, at least in the beginning, advance in **very small steps** and make sure that every change works as desired.

**The console should always be open**. If the browser reports about errors, it is not advisable to continue blindly writing more code, hoping for miracles. You should instead try to understand the cause of the error and, for example, go back to the previous working state:

![](../../images/1/2a.png)

It is good to remember that in React it possible and worthwhile to write <em>console.log()</em> commands (which print to the console) within your code.

Also keep in mind that **React component names must be capitalized**. If you try defining a component as follows

```js
const footer = () => {
  return (
    <div>
      greeting app created by 
      <a href="https://github.com/mluukkai">mluukkai</a>
    </div>
  )
}
```

and use it like this

```js
const App = () => {
  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="Arto" age={26 + 10} />
      <footer /> // highlight-line
    </div>
  )
}
```

the page is not going to display the content defined within the Footer component, and instead React only creates an empty <i>footer</i> element. If you change the first letter of the component name to a capital letter, then React creates a <i>div</i>-element defined in the Footer component, which is rendered on the page.

Take note that (usually) the content of a React component needs to contain **one root element**. If we, for example, try to define the component <i>App</i> without the outermost <i>div</i>-element:

```js
const App = () => {
  return (
    <h1>Greetings</h1>
    <Hello name="Arto" age={26 + 10} />
    <Footer />
  )
}
```

the result is an error message.

![](../../images/1/3a.png)

Using a root element is not the only working option. An <i>array</i> of components is also a valid solution:

```js
const App = () => {
  return [
    <h1>Greetings</h1>,
    <Hello name="Arto" age={26 + 10} />,
    <Footer />
  ]
}
```

However, when defining the root component of the application this is not a very wise thing to do, and it makes the code look a bit ugly.

The consequence of the obligatory nature of the root element is "extra" div-elements in the DOM-tree. This can be avoided by using [fragments](https://reactjs.org/docs/fragments.html#short-syntax), wrapping the elements returned by the component with an empty element:

```js
const App = () => {
  const name = 'Pekka'
  const age = 10

  return (
    <>
      <h1>Greetings</h1>
      <Hello name="Arto" age={26 + 10} />
      <Hello name={name} age={age} />
      <Footer />
    </>
  )
}
```

Now the compilation is successful and the DOM generated by React no longer contains an extra div-element.

</div>

<div class="tasks">
  <h3>Exercises </h3>

Exercises are submitted through GitHub and by marking completed exercises in the [submission application](https://studies.cs.helsinki.fi/fullstackopen2019/).

You may submit all the exercises of this course into the same repository, or using multiple repositories. If you submit exercises of different parts into the same repository, please use a sensible naming scheme for the directories.

One very functional file  structure for the submission repository is as follows:

```
osa0
osa1
  kurssitiedot
  unicafe
  anekdootit
osa2
  puhelinluettelo
  maiden_tiedot
```

For each part of the course there is a directory, which further branches into directories containing a series of exercises, like "unicafe" for part 1.

For each web application for a series of exercises, it is recommended to submit all files relating to that application, except for the directory <i>node\_modules</i>).

The exercises are submitted **one part at a time**. When you have submitted the exercises for a part of the course you can no longer submit undone exercises for the same part.

Note that in this part, there are more exercises besides those found below. <i>Do not submit your work</i> until you have completed the exercises you want to submit for the part.
  
  <h4>1.1: course information, step1</h4>

<i>The application that we will start working on in this exercise will be further developed in a few of the following exercises. In this and other upcoming exercise sets in this course, it is enough to only submit the final state of the application. If desired, you may also create a commit for each exercise of the series, but this is entirely optional.</i>

Use create-react-app to initialize a new application. Modify <i>index.js</i> to match the following

```js
import React from 'react'
import ReactDOM from 'react-dom'

const App = () => {
  const course = 'Half Stack -sovelluskehitys'
  const part1 = 'Reactin perusteet'
  const exercises1 = 10
  const part2 = 'Tiedonvälitys propseilla'
  const exercises2 = 7
  const part3 = 'Komponenttien tila'
  const exercises3 = 14

  return (
    <div>
      <h1>{course}</h1>
      <p>
        {part1} {exercises1}
      </p>
      <p>
        {part2} {exercises2}
      </p>
      <p>
        {part3} {exercises3}
      </p>
      <p>yhteensä {exercises1 + exercises2 + exercises3} tehtävää</p>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
```

and remove extra files (App.js, App.css, App.test.js, logo.svg, serviceWorker.js).

Unfortunately, the entire application is in the same component. Refactor the code so that it consists of three new components: <i>Header</i>, <i>Content</i> ja <i>Total</i>. All data still resides in the <i>App</i> component, which passes the necessary data to each component using <i>props</i>. <i>Header</i> takes care of rendering the name of the course, <i>Content</i> renders the parts and their number of exercises and <i>Total</i> renders the total amount of exercises.

The <i>App</i> component's body will approximately be as follows:

```js
const App = () => {
  // const-definitions

  return (
    <div>
      <Header course={course} />
      <Content ... />
      <Total ... />
    </div>
  )
}
```

**WARNING** create-react-app automatically makes the project a git repository unless the application is created within an already existing repository. Most likely you **do not want** the project becoming a repository, so run the command _rm -rf .git_ in the root of the project.

<h4>1.2: course information, step2</h4>

Refactor the <i>Content</i> component so that it does not render any names of parts or their number of exercises by itself. Instead it only renders three <i>Part</i> components of which each renders the name and number of exercises of one part.

```js
const Content = ... {
  return (
    <div>
      <Part .../>
      <Part .../>
      <Part .../>
    </div>
  )
}
```

Our application passes on information in quite a primitive way at the moment, since it is based on individual variables. This situation will improve soon.

</div>