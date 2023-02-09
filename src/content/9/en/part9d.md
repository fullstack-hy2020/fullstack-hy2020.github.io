---
mainImage: ../../../images/part-9.svg
part: 9
letter: d
lang: en
---

<div class="content">

Before we start delving into how you can use TypeScript with React, we should first have a look at what we want to achieve. When everything works as it should, TypeScript will help us catch the following errors:

- Trying to pass an extra/unwanted prop to a component
- Forgetting to pass a required prop to a component
- Passing a prop with the wrong type to a component

If we make any of these errors, TypeScript can help us catch them in our editor right away.
If we didn't use TypeScript, we would have to catch these errors later during testing.
We might be forced to do some tedious debugging to find the cause of the errors.

That's enough reasoning for now. Let's start getting our hands dirty!

### Create React App with TypeScript

We can use [create-react-app](https://create-react-app.dev) to create a TypeScript app by adding a
<i>template</i> argument to the initialization script. So in order to create a TypeScript Create React App, run the following command:

```shell
npx create-react-app my-app --template typescript
```

After running the command, you should have a complete basic React app that uses TypeScript.
You can start the app by running *npm start* in the application's root.

If you take a look at the files and folders, you'll notice that the app is not that different from
one using pure JavaScript. The only differences are that the <i>.js</i> and <i>.jsx</i> files are now  <i>.ts</i> and <i>.tsx</i> files, they contain some type annotations, and the root directory contains a <i>tsconfig.json</i> file.

Now, let's take a look at the <i>tsconfig.json</i> file that has been created for us:

```js
{
  "compilerOptions": {
    "target": "es5",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": [
    "src"
  ]
}
```

Notice *compilerOptions* now has the key [lib](https://www.typescriptlang.org/tsconfig#lib) that includes "type definitions for things found in browser environments (like _document_)."

Everything else should be more or less fine except that, at the moment, the configuration allows compiling JavaScript files because *allowJs* is set to *true*.
That would be fine if you need to mix TypeScript and JavaScript (e.g. if you are in the process of transforming a JavaScript project into TypeScript or something like that), but we want to create a pure TypeScript app, so let's change that configuration to *false*.

In our previous project, we used ESlint to help us enforce a coding style, and we'll do the same with this app. We do not need to install any dependencies, since create-react-app has taken care of that already.

We configure ESlint in <i>.eslintrc</i> with the following settings:

```js
{
  "env": {
    "browser": true,
    "es6": true,
    "jest": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "plugins": ["react", "@typescript-eslint"],
  "settings": {
    "react": {
      "pragma": "React",
      "version": "detect"
    }
  },
  "rules": {
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "react/react-in-jsx-scope": 0
  }
}
```

Since the return type of most React components is generally either *JSX.Element* or *null*, we have loosened up the default linting rules a bit by disabling the rules [explicit-function-return-type](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/explicit-function-return-type.md) and [explicit-module-boundary-types](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/explicit-module-boundary-types.md).
Now we don't need to explicitly state our function return types everywhere. We will also disable [react/react-in-jsx-scope](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/react-in-jsx-scope.md) since importing React is [no longer needed](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html) in every file.

Next, we need to get our linting script to parse <i>*.tsx </i> files, which are the TypeScript equivalent of React's JSX files.
We can do that by altering our lint command in <i>.package.json</i> to the following:

```json
{
  // ...
    "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "lint": "eslint './src/**/*.{ts,tsx}'" // highlight-line
  },
  // ...
}
```

If you are using Windows, you may need to use double quotes for the linting path: 

```
"lint": "eslint \"./src/**/*.{ts,tsx}\""
```

### React components with TypeScript

Let us consider the following JavaScript React example:

```jsx
import ReactDOM from 'react-dom/client'
import PropTypes from "prop-types";

const Welcome = props => {
  return <h1>Hello, {props.name}</h1>;
};

Welcome.propTypes = {
  name: PropTypes.string
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <Welcome name="Sarah" />
)
```

In this example, we have a component called *Welcome* to which we pass a *name* as a prop. It then renders the name to the screen.  We know that the *name* should be a string, and we use the [prop-types](https://www.npmjs.com/package/prop-types) package introduced in [part 5](/en/part5/props_children_and_proptypes#prop-types) to receive hints about the desired types of a component's props and warnings about invalid prop types.

With TypeScript, we don't need the <i>prop-types</i> package anymore. We can define the types with the help of TypeScript just like we define types for a regular function as React components are nothing but mere functions. We will use an interface for the parameter types (i.e., props) and *JSX.Element* as the return type for any react component:

```jsx
import ReactDOM from 'react-dom/client'

interface WelcomeProps {
  name: string;
}

const Welcome = (props: WelcomeProps): JSX.Element => {
  return <h1>Hello, {props.name}</h1>;
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Welcome name="Sarah" />
)
```

We defined a new type, *WelcomeProps*, and passed it to the function's parameter types.

```jsx
const Welcome = (props: WelcomeProps): JSX.Element => {
```

You could write the same thing using a more verbose syntax:

```jsx
const Welcome = ({ name }: { name: string }): JSX.Element => (
  <h1>Hello, {name}</h1>
);
```

Now our editor knows that the *name* prop is a string.

There is actually no need to define the return type of a React component since the TypeScript compiler infers the type automatically, and we can just write

```jsx
interface WelcomeProps {
  name: string;
}

const Welcome = (props: WelcomeProps)  => { // highlight-line
  return <h1>Hello, {props.name}</h1>;
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Welcome name="Sarah" />
)
```

You propably noticed that we used a [type assertion](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions) for the return value of the function _document.getElementById_

```ts
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(  // highlight-line
  <Welcome name="Sarah" />
)
```

We need to do this since the _ReactDOM.createRoot_ takes an HTMLElement as a parameter but the return value of function _document.getElementById_ has the following type 

```js
HTMLElement | null
```

since if the function does not find the searched element, it will return null.

Earlier in this part we [warned](http://localhost:8000/en/part9/first_steps_with_type_script#type-assertion) about the dangers of type assertions, but in our case the assertion is ok since we are sure that the file <i>index.html</i> indeed has this particular id and the function is always returning a HTMLElement.

</div>

<div class="tasks">

### Exercise 9.14

#### 9.14

Create a new Create React App with TypeScript, and set up ESlint for the project similarly to how we just did.

This exercise is similar to the one you have already done in [Part 1](/en/part1/java_script#exercises-1-3-1-5) of the course, but with TypeScript and some extra tweaks. Start off by modifying the contents of <i>index.tsx</i> to the following:

```jsx
import ReactDOM from 'react-dom/client'
import App from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <App />
)
```

and <i>App.tsx</i> to the following:

```jsx
const App = () => {
  const courseName = "Half Stack application development";
  const courseParts = [
    {
      name: "Fundamentals",
      exerciseCount: 10
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14
    }
  ];

  return (
    <div>
      <h1>{courseName}</h1>
      <p>
        {courseParts[0].name} {courseParts[0].exerciseCount}
      </p>
      <p>
        {courseParts[1].name} {courseParts[1].exerciseCount}
      </p>
      <p>
        {courseParts[2].name} {courseParts[2].exerciseCount}
      </p>
      <p>
        Number of exercises{" "}
        {courseParts.reduce((carry, part) => carry + part.exerciseCount, 0)}
      </p>
    </div>
  );
};

export default App;
```

and remove the unnecessary files.

The whole app is now in one component. That is not what we want, so refactor the code so that it consists of three components: *Header*,  *Content* and *Total*. All data is still kept in the *App* component, which passes all necessary data to each component as props. <i>Be sure to add type declarations for each component's props!</i>

The *Header* component should take care of rendering the name of the course. *Content* should render the names of the different parts and the number of exercises in each part, and *Total* should render the total sum of exercises in all parts.

The *App* component should look somewhat like this:

```jsx
const App = () => {
  // const-declarations

  return (
    <div>
      <Header name={courseName} />
      <Content ... />
      <Total ... />
    </div>
  )
};
```

</div>

<div class="content">

### Deeper type usage

In the previous exercise, we had three parts of a course, and all parts had the same attributes *name* and *exerciseCount*. But what if we needed additional attributes for the parts not all parts have the same attributes? How would this look, codewise? Let's consider the following example:

```js
const courseParts = [
  {
    name: "Fundamentals",
    exerciseCount: 10,
    description: "This is an awesome course part"
  },
  {
    name: "Using props to pass data",
    exerciseCount: 7,
    groupProjectCount: 3
  },
  {
    name: "Basics of type Narrowing",
    exerciseCount: 7,
    description: "How to go from unknown to string"
  },
  {
    name: "Deeper type usage",
    exerciseCount: 14,
    description: "Confusing description",
    backroundMaterial: "https://type-level-typescript.com/template-literal-types"
  },
];
```

In the above example, we have added some additional attributes to each course part.
Each part has the *name* and *exerciseCount* attributes, but the first, the third  and fourth also have an attribute called *description*, and the second and fourth parts also have some distinct additional attributes.

Let's imagine that our application just keeps on growing, and we need to pass the different course parts around in our code. On top of that, there are also additional attributes and course parts added to the mix. How can we know that our code is capable of handling all the different types of data correctly, and we are not for example forgetting to render a new course part on some page? This is where TypeScript comes in handy!

Let's start by defining types for our different course parts. We notice that the first and third have the same set of attributes. The second and fourth are a bit different so we have three different kinds of course part elements. 

So let us define a type for each of the different kind of of course parts:

```js
interface CoursePartBasic {
  name: string;
  exerciseCount: number;
  description: string;
  kind: "basic"
}

interface CoursePartGroup {
  name: string;
  exerciseCount: number;
  groupProjectCount: number;
  kind: "group"
}

interface CoursePartBackround {
  name: string;
  exerciseCount: number;
  description: string;
  backroundMaterial: string;
  kind: "background"
}
```

Besides the attributes that are found in the various course parts, we have now introduced a additional attribute called <i>kind</i> that has a [literal](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types) type, it is a "hard coded" string, distinct for each course part. We shall soon see where the attribute kind is used!

Next, we will create a type [union](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types) of all these types. We can then use it to define a type for our array, which should accept any of these course part types:

```js
type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackround;
```

Now we can set the type for our *courseParts* variable:

```js
const App = () => {
  const courseName = "Half Stack application development";
  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is an awesome course part",
      kind: "basic" // highlight-line
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: "group" // highlight-line
    },
    {
      name: "Basics of type Narrowing",
      exerciseCount: 7,
      description: "How to go from unknown to string",
      kind: "basic" // highlight-line
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      backroundMaterial: "https://type-level-typescript.com/template-literal-types",
      kind: "background" // highlight-line
    },
  ]

  // ...
}
```

Note that we have now added the attribute _kind_ with a proper value to each element of the array.

Our editor will automatically warn us if we use the wrong type for an attribute, use an extra attribute, or forget to set an expected attribute. If we eg. try to add the following to the array

```js
{
  name: "TypeScript in frontend",
  exerciseCount: 10,
  kind: "basic",
},
```

We will immediately see an error in the editor:


![](../../images/9/63new.png)

Since our new entry has the attribute _kind_ with value _"basic"_ TypeScript knows that the entry is does not only have the type _CoursePart_ but it is actually meant to be a _CoursePartBasic_. So here the attribute _kind_ "narrows" the type of the entry from a more general to a more specific type that has a certain set of attributes. We shall soon see this style of type narrowing in action in the code!

But we're not satisfied yet! There is still a lot of duplication in our types, and we want to avoid that. We start by identifying the attributes all course parts have in common, and defining a base type that contains them. Then we will [extend](https://www.typescriptlang.org/docs/handbook/2/objects.html#extending-types) that base type to create our kind-specific types:

```js
interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartBasic extends CoursePartBase {
  description: string;
  kind: "basic"
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group"
}

interface CoursePartBackround extends CoursePartBase {
  description: string;
  backroundMaterial: string;
  kind: "background"
}

type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackround;
```

### More type narrowing

How should we now use these types in our components?

If we try to acess the objects in the array _courseParts: CoursePart[]_ we notice that it is possibly to only access the attributes that are common to all the types in the union:

![](../../images/9/65new.png)

And indeed, the TypeScript [documentation](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#working-with-union-types) says this:

> <i>TypeScript will only allow an operation (or attribute access) if it is valid for every member of the union.</i>

The documentation also mentions the following:

> <i>The solution is to narrow the union with code... Narrowing occurs when TypeScript can deduce a more specific type for a value based on the structure of the code.</i>

So once again the [type narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) is the rescue!

One handy way to narrow these kinds of types in TypeScript is to use *switch case* expressions. Once TypeScript has inferred that a variable is of union type and that each type in the union contain a certain literal attribute (in our case _kind_), we can use that as a type identifier. We can then build a switch case around that attribute and TypeScript will know which attributes are available within each case block:

![](../../images/9/64new.png)

In the above example, TypeScript knows that a *part* has the type *CoursePart* and it can then infer that *part* is of either type *CoursePartBasic*, *CoursePartGroup* or *CoursePartBackround* based on the value of the attribute _kind_.

The specific technique of type narrowing where a union type is narrowed based on literal attribute value is called [discriminated union](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions).

Note that the narrowing can naturally be also done with _if_ clause. We could eg. do the following:

```js
  courseParts.forEach(part => {
    if (part.kind === 'background') {
      console.log('see the following:', part.backroundMaterial)
    }

    // can not refer to part.backroundMaterial here!
  });
```

What about adding new types? If we were to add a new course part, wouldn't it be nice to know if we had already implemented handling that type in our code? In the example above, a new type would go to the *default* block and nothing would get printed for a new type. Sometimes this is wholly acceptable. For instance, if you wanted to handle only specific (but not all) cases of a type union, having a default is fine. Nonetheless, it is recommended to handle all variations separately in most cases.

With TypeScript, we can use a method called [exhaustive type checking](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking). Its basic principle is that if we encounter an unexpected value, we call a function that accepts a value with the type [never](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-never-type) and also has the return type *never*.

A straightforward version of the function could look like this:

```js
/**
 * Helper function for exhaustive type checking
 */
const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};
```

If we now were to replace the contents of our *default* block to:

```js
default:
  return assertNever(part);
```

and remove the case that handles the type _CoursePartBackround_, we would see the following error:

![](../../images/9/66new.png)

The error message says that

```
'CoursePartBackround' is not assignable to parameter of type 'never'.
```

which tells us that we are using a variable somewhere where it should never be used. This tells us that something needs to be fixed.

</div>

<div class="tasks">

### Exercise 9.15

#### 9.15

Let us now continue extending the app created in exercise 9.14. First, add the type information and replace the variable *courseParts* with the one from the example below.

```js
interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartBasic extends CoursePartBase {
  description: string;
  kind: "basic"
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group"
}

interface CoursePartBackround extends CoursePartBase {
  description: string;
  backroundMaterial: string;
  kind: "background"
}

type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackround;

const courseParts: CoursePart[] = [
  {
    name: "Fundamentals",
    exerciseCount: 10,
    description: "This is an awesome course part",
    kind: "basic"
  },
  {
    name: "Using props to pass data",
    exerciseCount: 7,
    groupProjectCount: 3,
    kind: "group"
  },
  {
    name: "Basics of type Narrowing",
    exerciseCount: 7,
    description: "How to go from unknown to string",
    kind: "basic"
  },
  {
    name: "Deeper type usage",
    exerciseCount: 14,
    description: "Confusing description",
    backroundMaterial: "https://type-level-typescript.com/template-literal-types",
    kind: "background"
  },
  {
    name: "TypeScript in frontend",
    exerciseCount: 10,
    description: "a hard part",
    kind: "basic",
  },
];
```

Now we know that both interfaces *CoursePartBasic* and *CoursePartBackround* share not only the base attributes but also an attribute called *description*, which is a string in both interfaces.

Your first task is to declare a new interface that includes the *description* attribute and extends the *CoursePartBase* interface. Then modify the code so that you can remove the *description* attribute from both *CoursePartBasic* and *CoursePartBackround*  without getting any errors.

Then create a component *Part* that renders all attributes of each type of course part. Use a switch case-based exhaustive type checking! Use the new component in component *Content*.

Lastly, add another course part interface with the following attributes: *name*, *exerciseCount*, *description* and *requirements*, the latter being a string array. The objects of this type look like the following:

```js
{
  name: "Backend development",
  exerciseCount: 21,
  description: "Typing the backend",
  requirements: ["nodejs", "jest"],
  kind: "special"
}
```

Then add that interface to the type union *CoursePart* and add corresponding data to the *courseParts* variable. Now, if you have not modified your *Content* component correctly, you should get an error, because you have not yet added support for the fourth course part type. Do the necessary changes to *Content*, so that all attributes for the new course part also get rendered and that the compiler doesn't produce any errors.

The result might look like the following:

![browser showing half stack application development](../../images/9/45.png)

</div>

<div class="content">

### React app with state

Let us once more build the familiar notes app. 

```js
const App = () => {
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState([]);


  return (
    <div>
      
    </div>
  )
}
```

[Cheatseat](https://react-typescript-cheatsheet.netlify.app/)

When we hover over the the useState calls in the editor, we see the see couple of interesting things. The type of the first call _useState('')_ looks like the following:

```
useState<string>(initialState: string | (() => string)): [string, React.Dispatch<React.SetStateAction<string>>] 
```



We notice that ts compiler has inferred that the initial state has the type string. The type of the returnd array is

```
[string, React.Dispatch<React.SetStateAction<string>>]
```

So the first element (newNote) is string and the second element that we assigned setNewNote is a type that has a type parameter string. 

From this we will see that TypeScript has inferred the type of the first useState quite right, it is creating a state with type string.


When we look the second use state that has the initial value [] the situation is quite different

```
(alias) useState<never[]>(initialState: never[] | (() => never[])): [never[], React.Dispatch<React.SetStateAction<never[]>>] 
```

TypeScript can just infer that the state has type _never[]_, it is an array but it has no clue what are the elements stored to array, so we clearly need to help the compiled and provide the type explicitly.

When we define

```js
const [notes, setNotes] = useState<Note[]>([]);
```

the type is set quire right:

```
useState<Note[]>(initialState: Note[] | (() => Note[])): [Note[], React.Dispatch<React.SetStateAction<Note[]>>]
```

```js
interface Note {
  id: number,
  content: string
}

import { useState } from "react";

const App = () => {
  const [notes, setNotes] = useState<Note[]>([
    { id: 1, content: 'testing' }
  ]);
  const [newNote, setNewNote] = useState('');

  return (
    <div>
      <ul>
        {notes.map(note => <li key={note.id}>
          {note.content}
        </li>)}
      </ul>

    </div>
  )
}
```

Let us now add a from for inserting new notes:

```js
const App = () => {
  const [notes, setNotes] = useState<Note[]>([
    { id: 1, content: 'testing' }
  ]);
  const [newNote, setNewNote] = useState('');

  return (
    <div>
      // highlight-start
      <form>
        <input value={newNote} onChange={(event) => setNewNote(event.target.value)} />
        <button type='submit'>add</button>
      </form>
      // highlight-end
      <ul>
        {notes.map(note => <li key={note.id}>
          {note.content}
        </li>)}
      </ul>
    </div>
  )
}
```

It just works! When we hover over the, we see that the types get quite right, the _event.target.value_ is indeed a string that is the expected parameter in the _setNewNote_:

![](../../images/9/67new.png)

So we still need to add the event handler for adding the new note. Now be end up to a problem:

![](../../images/9/68new.png)

TypeScript compiled has no clue what is the type of the parameter. The [cheatsheat](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forms_and_events) comes again to rescue, the right type is _React.SyntheticEvent_. 

The code becomes

```js
interface Note {
  id: number,
  content: string
}

const App = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');

// highlight-start
  const noteCreation = (event: React.SyntheticEvent) => {
    event.preventDefault()
    const noteToAdd = {
      content: newNote,
      id: notes.length + 1
    }
    setNotes(notes.concat(noteToAdd));

    setNewNote('')
  };
// highlight-end

  return (
    <div>
      <form onSubmit={noteCreation}>
        <input value={newNote} onChange={(event) => setNewNote(event.target.value)} />
        <button type='submit'>add</button>
      </form>
      <ul>
        {notes.map(note => <li key={note.id}>
          {note.content}
        </li>)}
      </ul>
    </div>
  )
}
```

And thats it, our app is ready and perfectly typed!

### Communicating with the server

Let us modify the app so that the notes are saved in a JSON server backend. We have setup the server in url http://localhost:3001/notes

As usual, we shall use axios and the useEffect hook to fetch the initial state from the server. 

Let us try the following

```js
useEffect(() => {
  axios.get('http://localhost:3001/notes').then(response => {
    console.log(response.data);
  })
}, [])
```

When we hover over the response.data we see that is has the type any

![](../../images/9/69new.png)

So to use the data, we should type it properly.  With a little [help from internet](https://upmostly.com/typescript/how-to-use-axios-in-your-typescript-apps), we end up to the following code

```js
  useEffect(() => {
    axios.get<Note[]>('http://localhost:3001/notes').then(response => {
      console.log(response.data);
    })
  }, [])
```

When we hover over the response.data we see that it has the correct type:

![](../../images/9/70new.png)

so we complete the code with

```js
  useEffect(() => {
    axios.get<Note[]>('http://localhost:3001/notes').then(response => {
      setNotes(response.data) // highlight-line
    })
  }, [])
```

So just like _useState_, we can a type parameter to _axios.get_ to insstruct it how the typing should be done. In tehcnical terms  _axios.get_ is a [generic function](https://www.typescriptlang.org/docs/handbook/2/generics.html#working-with-generic-type-variables). Unlike some generic functions, the type parameter has a default value _any_ so, it the function can be used without defining the type parameter.

The code works and the compiler and Eslint are also happy and remain quiet. However, giving a type parameter to _axios.get_ is potentially a dangerous thing to do. The request body can contain data in an arbitrary form, and we are essentially just telling to the TypeScript compiler that the data is indeed of the type _Note[]_. So our code is essentially working like the following:

```js
  useEffect(() => {
    axios.get('http://localhost:3001/notes').then(response => {
      // response.body is of type any
      setNotes(response.data as Note[]) // highlight-line
    })
  }, [])
```

Since the TypeScript types do not even exist in runtime, our code does not give us any "safety" agains situations where the request body contains data in a wrong form. 

This might be ok if we are absolutely certain that the bsackend behaves correctly and returns always the data in correct form. If we want to be sure, we should parse the data in the forntend simillarly that we did [in the previous section](/en/part9/typing_an_express_app#proofing-requests) for the requests to the backend.

Let us now wrap up our app by implementing the new note addition.

```js
  const noteCreation = (event: React.SyntheticEvent) => {
    event.preventDefault()
    axios.post<Note>('http://localhost:3001/notes', { content: newNote }).then(response => {
      setNotes(notes.concat(response.data))
    })

    setNewNote('')
  };
```

We are again giving _axios.post_ a type parameter since we know that the server response is added note, the proper type parameter _Note_.

Let us clean up the code a bit. For the type definitions, we create a file _types.ts_ with the content:

```js
export interface Note {
  id: number,
  content: string
}

export type NewNote = Omit<Note, 'id'>
```

We have added a new type for a new note, one that does not yet have the id field assigned.

The code that communicates with the backend is also extracted to on own module in the file _noteService.tsx_

```js
import axios from 'axios';
import { Note, NewNote } from "./types";

const baseUrl = 'http://localhost:3001/notes'

export const getAllNotes = () => {
  return axios
    .get<Note[]>(baseUrl)
    .then(response => response.data)
}

export const createNote = (object: NewNote) => {
  return axios
    .post<Note>(baseUrl, object)
    .then(response => response.data)
}
```

The component _App_ is now much cleaner:

```js
import { useState, useEffect } from "react";
import { Note } from "./types"; // highlight-line
import { getAllNotes, createNote } from './noteService'; // highlight-line

const App = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    // highlight-start
    getAllNotes().then(data => {
      setNotes(data)
    })
    // highlight-end
  }, [])

  const noteCreation = (event: React.SyntheticEvent) => {
    event.preventDefault()
    // highlight-start
    createNote({ content: newNote }).then(data => {
      setNotes(notes.concat(data))
    })
    // highlight-end

    setNewNote('')
  };

  return (
    // ...
  )
}
```

The app is nicely typed and ready for further development!

The comple code can be found here []().

### A note about defining object types

We have used [interfaces](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces) to define object types, e.g. diary entries, in the previous section

```js
interface DiaryEntry {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment?: string;
} 
```

and in the course part of this section

```js
interface CoursePartBase {
  name: string;
  exerciseCount: number;
}
```

We actually could have had the same effect by using a [type alias](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases)

```js
type DiaryEntry = {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment?: string;
} 
```

In most cases, you can use either *type* or *interface*, whichever syntax you prefer. However, there are a few things to keep in mind.
For example, if you define multiple interfaces with the same name, they will result in a merged interface, whereas if you try to define multiple types with the same name, it will result in an error stating that a type with the same name is already declared.

TypeScript documentation [recommends using interfaces](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces) in most cases.

</div>

<div class="tasks">

### Exercises 9.16-9.19

Let us now build a frontend for the Ilari's flight diaries that was. The source code of the backend can be found in [this GitHub repository](https://github.com/fullstack-hy2020/flight-diary). 

#### Exercise 9.16

Create a TypeScript React app with simillar configurations as the above examples. Fetch the diaries from backend and show render those to screen. Do all the required typing so that there are no Eslint errors.

Remember to keep the network tab open. It might give you a valuable hint...

#### Exercise 9.17

Make it possible to add new diary entries from the fronend. In this exercise you may skip all types of validations and assume that user just enters the data in correct form.

#### Exercise 9.18

Inform user if the the creation of a diary entry fails in the backend. You should tell uset the reason for failure

See eg. [this](https://dev.to/mdmostafizurrahaman/handle-axios-error-in-typescript-4mf9) how you can narrow the error so that you can get hold to the error message. 

Your solution could look like this:

![](../../images/9/71new.png)

#### Exercise 9.19

Addition of a diary in now very error prone since user can type anything to the fields. Let us improve the situation.

Modify your form so that the date is set with HTML input element [date](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date), and the weather and visibility are set with HTML input [radio buttons](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio). 

Your solution could look like this:

![](../../images/9/72new.png)


</div>
