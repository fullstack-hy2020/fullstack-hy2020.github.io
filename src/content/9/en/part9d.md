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

### Working with an existing codebase

When diving into an existing codebase for the first time, it is good to get an overall view of the conventions and structure of the project. You can start your research by reading the <i>README.md</i> in the root of the repository. Usually, the README contains a brief description of the application and the requirements for using it, as well as how to start it for development.
If the README is not available or someone has "saved time" and left it as a stub, you can take a peek at the <i>package.json</i>.
It is always a good idea to start the application and click around to verify you have a functional development environment.

You can also browse the folder structure to get some insight into the application's functionality and/or the architecture used. These are not always clear, and the developers might have chosen a way to organize code that is not familiar to you. The [sample project](https://github.com/fullstack-hy2020/patientor) used in the rest of this part is organized, feature-wise. You can see what pages the application has, and some general components, e.g. modals and state. Keep in mind that the features may have
different scopes. For example, modals are visible UI-level components whereas the state is comparable to business logic and keeps the data organized under the hood for the rest of the app to use.

TypeScript provides types for what kind of data structures, functions, components, and state to expect.  You can try looking for <i>types.ts</i> or something similar to get started. VSCode is a big help and simply highlighting variables and parameters can provide quite a lot of insight. All this naturally depends on how types are used in the project.

If the project has unit, integration or end-to-end tests, reading those is most likely beneficial. Test cases are your most important tool when refactoring or adding new features to the application. You want to make sure not to break any existing features when hammering around the code. TypeScript can also give you guidance with argument and return types when changing the code.

Remember that reading code is a skill in itself, so don't worry if you don't understand the code on your first readthrough.  The code may have a lot of corner cases, and pieces of logic may have been added here and there throughout its development cycle. It is hard to imagine what kind of problems the previous developer has wrestled with. Think of it all like [growth rings in trees](https://en.wikipedia.org/wiki/Dendrochronology#Growth_rings). Understanding everything requires digging deep into the code and business domain requirements. The more code you read, the better you will be at understanding it. You will most likely read far more code than you are going to produce throughout your life.

### Patientor frontend

It's time to get our hands dirty finalizing the frontend for the backend we built in [exercises 9.8.-9.13](/en/part9/typing_the_express_app).

Before diving into the code, let us start both the frontend and the backend.

If all goes well, you should see a patient listing page. It fetches a list of patients from our backend, and renders it to the screen as a simple table. There is also a button for creating new patients on the backend. As we are using mock data instead of a database, the data will not persist - closing the backend will delete all the data we have added. UI design has not been a strong point of the creators, so let's disregard the UI for now.

After verifying that everything works, we can start studying the code. All the interesting stuff resides in the <i>src</i> folder. For your convenience, there is already a <i>types.ts</i> file for basic types used in the app, which you will have to extend or refactor in the exercises.

In principle, we could use the same types for both backend and frontend, but usually, the frontend has different data structures and use cases for the data, which causes the types to be different.
For example, the frontend has a state and may want to keep data in objects or maps whereas the backend uses an array. The frontend might also not need all the fields of a data object saved in the backend, and it may need to add some new fields to use for rendering.

The folder structure looks as follows:

![vscode folder structure for patientor](../../images/9/34a.png)

As you would expect, there are currently two main components: *AddPatientModal* and *PatientListPage*. The <i>state</i> folder contains state handling for the frontend.
The main functionality of the code in the <i>state</i> folder is to keep our data in one place and offer simple actions to alter the state of our app.

### State handling

Let's study the state handling a bit closer as a lot of stuff seems to be happening under the hood and it differs a bit from the methods used in the course so far.

The state management is built using the React Hooks [useContext](https://reactjs.org/docs/hooks-reference.html#usecontext) and [useReducer](https://reactjs.org/docs/hooks-reference.html#usereducer). This is quite a good setup because we know the app will be rather small and we don't want to use <i>redux</i> or other similar libraries for state management.
There are a lot of good materials, like [this article](https://medium.com/@seantheurgel/react-hooks-as-state-management-usecontext-useeffect-usereducer-a75472a862fe), about this approach to state management.

The approach taken in this app uses the React [context](https://reactjs.org/docs/context.html) that, according to its documentation:

> <i>... is designed to share data that can be considered "global" for a tree of React components, such as the current authenticated user, theme, or preferred language.</i>

In our case, the "global", shared data is the application state <i>and</i> the dispatch function that is used to make changes to data. In many ways, our code works much like the Redux-based state management we used in [part 6](/en/part6), but is more lightweight since it does not require the use of any external libraries. This part assumes that you are at least familiar with the way Redux works, e.g. you should have covered at least [the first section](/en/part6/flux_architecture_and_redux) of part 6.

The [context](https://reactjs.org/docs/context.html) of our application has a tuple containing the app state and the dispatcher for changing the state.
The application state is typed as follows:

```js
export type State = {
  patients: { [id: string]: Patient };
};
```

The state is an object with one key, *patients*, which has a [dictionary](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html) or simply put an object with string keys and with *Patient* objects as values. The index can only be a *string* or a *number* as you can access the object values using those. This enforces that the state conforms to the form we want, and prevents developers from misusing the state.

But be aware of one thing! When a type is declared like the type for *patients*, TypeScript does not have any way of knowing if the key you are trying to access exists or not. So if we were to try to access a patient by a non-existing id, the compiler would think that the returned value is of type *Patient* and no error would be thrown when trying to access its properties:

```js
const myPatient = state.patients['non-existing-id'];
console.log(myPatient.name); // no error, TypeScript believes that myPatient is of type Patient
```

To fix this, we could define the type for patient values to be a union of *Patient* and *undefined* in the following way:

```js
export type State = {
  patients: { [id: string]: Patient | undefined };
};
```

That would cause the compiler to give the following warning:

```js
const myPatient = state.patients['non-existing-id'];
console.log(myPatient.name); // error, Object is possibly 'undefined'
```

This type of additional type security is always good to implement if you e.g. use data from external sources or use the value of a user input to access data in your code. But if you are sure that you only handle data that actually exists, then there is no one stopping you from using the first presented solution.

Even though we are not using them in this course part, it is good to mention that a more type-strict way would be to use [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) objects, to which you can declare a type for both the key and the content. The Map's accessor function *get()* always returns a union of the declared value type and undefined, so TypeScript automatically requires you to perform validity checks on data retrieved from a map:

```js
interface State {
  patients: Map<string, Patient>;
}
...
const myPatient = state.patients.get('non-existing-id'); // type for myPatient is now Patient | undefined 
console.log(myPatient.name); // error, Object is possibly 'undefined'

console.log(myPatient?.name); // valid code, but will log 'undefined'
```

Just like with redux, all state manipulation is done by a reducer. It is defined in the file <i>reducer.ts</i> along with the type *Action*, which looks as follows:

```js
export type Action =
  | {
      type: "SET_PATIENT_LIST";
      payload: Patient[];
    }
  | {
      type: "ADD_PATIENT";
      payload: Patient;
    };
```

The reducer looks quite similar to the ones we wrote in [part 6](/en/part6/many_reducers#combined-reducers) before we started to use the Redux Toolkit. It changes the state for each type of action:

```js
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients
        }
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload
        }
      };
    default:
      return state;
  }
};
```

The main difference is that the state is now a dictionary (or an object), instead of the array that we used in [part 6](/en/part6/flux_architecture_and_redux#pure-functions-immutable).

There are a lot of things happening in the file <i>state.tsx</i>, which takes care of setting up the context.
The main ingredient is the [useReducer](https://reactjs.org/docs/hooks-reference.html#usereducer) hook
used to create the state and the dispatch function, and pass them on to the [context provider](https://reactjs.org/docs/context.html#contextprovider):

```js
export const StateProvider = ({
  reducer,
  children
}: StateProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState); // highlight-line
  return (
    <StateContext.Provider value={[state, dispatch]}>  // highlight-line
      {children}
    </StateContext.Provider>
  );
};
```

The provider makes the *state* and the *dispatch* functions available in all of the components, thanks to the setup in <i>index.tsx</i>:

```js
import { reducer, StateProvider } from "./state";

ReactDOM.render(
  <StateProvider reducer={reducer}>
    <App />
  </StateProvider>, 
  document.getElementById('root')
);
```

It also defines the *useStateValue* hook:

```js
export const useStateValue = () => useContext(StateContext);
```

and the components that need to access the state or dispatcher use it to get hold of those:

```js
import { useStateValue } from "../state";

// ...

const PatientListPage = () => {
  const [{ patients }, dispatch] = useStateValue();
  // ...
}
```

Don't worry if this seems confusing; it will be until you have studied the [context's documentation](https://reactjs.org/docs/context.html) and its use in [state management](https://medium.com/@seantheurgel/react-hooks-as-state-management-usecontext-useeffect-usereducer-a75472a862fe). You do not need to understand all this completely to do the exercises!

It is quite common that when you start working on an existing codebase, you do not understand 100% of what happens under the hood in the beginning. If the app has been properly structured (and it has a proper set of tests), you can trust that if you make careful modifications, the app still works despite not understanding all the internal mechanisms. Over time, you will get a grasp on the more unfamiliar parts, but it does not happen overnight when working with a large codebase.

### Patient listing page

Let's go through the <i>PatientListPage/index.tsx</i> as you can take inspiration from there to help you fetch data from the backend and update the application's state.
*PatientListPage* uses our custom hook to inject the state and the dispatcher for updating it.
When we list the patients, we only need to destructure the *patients* property from the state:

```js
import { useStateValue } from "../state";

const PatientListPage = () => {
  const [{ patients }, dispatch] = useStateValue();
  // ...
}
```

We also use the app state created with the *useState* hook for managing modal visibility and form error handling:

```js
const [modalOpen, setModalOpen] = React.useState<boolean>(false);
const [error, setError] = React.useState<string | undefined>();
```

We give the *useState* hook a type parameter, which is then applied to the actual state. So *modalOpen* is a *boolean* while *error* has the type *string | undefined*.
Both set functions returned by the *useState* hook are functions that accept only arguments according to the type parameter given, eg. the exact type for *setModalOpen* function is `React.Dispatch<React.SetStateAction<boolean>>`.

We also have the *openModal* and *closeModal* helper functions for better readability and convenience:

```js
const openModal = (): void => setModalOpen(true);

const closeModal = (): void => {
  setModalOpen(false);
  setError(undefined);
};
```

The frontend's types are based on what you have created when developing the backend in the previous part.

When the component *App* mounts, it fetches patients from the backend using [Axios](https://github.com/axios/axios). Note how we are giving the *axios.get* function a type parameter to describe the type of the response data:

````js
React.useEffect(() => {
  axios.get<void>(`${apiBaseUrl}/ping`);

  const fetchPatientList = async () => {
    try {
      const { data: patients } = await axios.get<Patient[]>(
        `${apiBaseUrl}/patients`
      );
      dispatch({ type: "SET_PATIENT_LIST", payload: patients });
    } catch (error: unknown) {
      let errorMessage = 'Something went wrong.'
      if(axios.isAxiosError(error) && error.response) {
        errorMessage += ' Error: ' + error.response.data.message;
      }
      console.error(errorMessage);
    }
  };
  fetchPatientList();
}, [dispatch]);
````

**A word of warning!** Passing a type parameter to Axios will not validate any data. It is quite dangerous especially if you are using external APIs. You can create custom validation functions that take in the whole payload and return the correct type, or you can use a type guard. Both are valid options. Many libraries also provide validation through different kinds of schemas (e.g. [io-ts](https://gcanti.github.io/io-ts/)). For simplicity's sake, we will continue to trust our work and trust that we will get data of the correct form from the backend.

As our app is quite small, we will update the state by simply calling the *dispatch* function provided to us by the *useStateValue* hook.
The compiler helps by making sure that we dispatch actions according to our *Action* type with a predefined type string and payload:

```js
dispatch({ type: "SET_PATIENT_LIST", payload: patients });
```

</div>

<div class="tasks">

### Exercises 9.16-9.18

We will soon add a new type for our app, *Entry*, which represents a lightweight patient journal entry. It consists of a journal text, i.e. a *description*, a creation date, information regarding the specialist who created it and possible diagnosis codes. Diagnosis codes map to the ICD-10 codes returned from the <i>/api/diagnoses</i> endpoint. Our naive implementation will be that a patient has an array of entries.

Before going into this, let us do some preparatory work.

#### 9.16: patientor, step1

Create an endpoint <i>/api/patients/:id</i>  that returns all of the patient information for one patient, including the array of patient entries that is still empty for all the patients. For the time being, expand the backend types as follows:

```js
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Entry {
}

export interface Patient {
  id: string;
  name: string;
  ssn: string;
  occupation: string;
  gender: Gender;
  dateOfBirth: string;
  entries: Entry[] // highlight-line
}

export type PublicPatient = Omit<Patient, 'ssn' | 'entries'>;  // highlight-line
```

The response should look as follows:

![browser showing entries blank array when accessing patient](../../images/9/38a.png)

#### 9.17: patientor, step2

Create a page for showing a patient's full information in the frontend.

The user should be able to access a patient's information by clicking the patient's name.

Fetch the data from the endpoint created in the previous exercise. After fetching the patient information from the backend, add the fetched information to the application's state. Do not fetch the information if it already is in the app state (i.e. if the user is visiting the same patient's information many times).

Since we now have the state in the context, you'll need to define a new action type for updating an individual patient's data.

The Application uses [MaterialUI](https://material-ui.com/) for styling, which we covered in [part 7](/en/part7/more_about_styles). You may also use it for the new components but that is up to you since our main focus now is TypeScript.

The Application also uses [React Router](https://reactrouter.com/en/main/start/tutorial) to control which view is visible in the frontend. You might want to have a look at [part 7](/en/part7/react_router) if you don't yet have a grasp on how the router works.

The result could look like this:

![browser showing patientor with one patient](../../images/9/39x.png)

Example uses [Material UI Icons](https://mui.com/components/material-icons/) to represent genders.

**Note** that to access the id in the URL, you need to give [useParams](https://reactrouter.com/en/main/hooks/use-params) a proper type argument:

```js
const { id } = useParams<{ id: string }>();
```

#### 9.18: Patientor, step3

Currently, we create *action* objects wherever we dispatch actions, e.g. the *App* component has the following:

```js
dispatch({
  type: "SET_PATIENT_LIST", payload: patientListFromApi
});
```

Define [action creator functions](/en/part6/flux_architecture_and_redux#action-creators) in the file <i>src/state/reducer.ts</i> and refactor the code to use them.

For example, the *App* should become like the following:

```js
import { useStateValue, setPatientList } from "./state";

// ...

dispatch(setPatientList(patientListFromApi));
```

</div>

<div class="content">

### Full entries

In [exercise 9.10](/en/part9/typing_the_express_app#exercises-9-10-9-11) we implemented an endpoint for fetching information about various diagnoses, but we are still not using that endpoint at all.
Since we now have a page for viewing a patient's information, it would be nice to expand our data a bit.
Let's add an *Entry* field to our patient data so that a patient's data contains their medical entries, including possible diagnoses.

Let's ditch our old patient seed data from the backend and start using [this expanded format](https://github.com/fullstack-hy/misc/blob/master/patients.ts).

**Notice:** This time, the data is not in the .json format but instead in the .ts format. You should already have the complete *Gender* and *Patient* types implemented, so only correct the paths where they are imported from if needed.

Let us now create a proper *Entry* type based on the data we have.

If we take a closer look at the data, we can see that the entries are quite different from one another. For example, let's take a look at the first two entries:

```js
{
  id: 'd811e46d-70b3-4d90-b090-4535c7cf8fb1',
  date: '2015-01-02',
  type: 'Hospital',
  specialist: 'MD House',
  diagnosisCodes: ['S62.5'],
  description:
    "Healing time appr. 2 weeks. patient doesn't remember how he got the injury.",
  discharge: {
    date: '2015-01-16',
    criteria: 'Thumb has healed.',
  }
}
...
{
  id: 'fcd59fa6-c4b4-4fec-ac4d-df4fe1f85f62',
  date: '2019-08-05',
  type: 'OccupationalHealthcare',
  specialist: 'MD House',
  employerName: 'HyPD',
  diagnosisCodes: ['Z57.1', 'Z74.3', 'M51.2'],
  description:
    'Patient mistakenly found himself in a nuclear plant waste site without protection gear. Very minor radiation poisoning. ',
  sickLeave: {
    startDate: '2019-08-05',
    endDate: '2019-08-28'
  }
}
```

Immediately, we can see that while the first few fields are the same, the first entry has a *discharge* field and the second entry has *employerName* and *sickLeave* fields.
All the entries seem to have some fields in common, but some fields are entry-specific.

When looking at the *type*, we can see that there are three kinds of entries: *OccupationalHealthcare*, *Hospital* and *HealthCheck*.
This indicates we need three separate types. Since they all have some fields in common, we might just want to create a base entry interface that we can extend with the different fields in each type.

When looking at the data, it seems that the fields *id*, *description*, *date* and *specialist* are something that can be found in each entry. On top of that, it seems that *diagnosisCodes* is only found in one *OccupationalHealthcare* and one *Hospital* type entry. Since it is not always used even in those types of entries, it is safe to assume that the field is optional. We could consider adding it to the *HealthCheck* type as well
since it might just not be used in these specific entries.

So our *BaseEntry* from which each type could be extended would be the following:

```js
interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: string[];
}
```

If we want to finetune it a bit further, since we already have a *Diagnosis* type defined in the backend, we might just want to refer to the code field of the *Diagnosis* type directly in case its type ever changes.
We can do that like so:

```js
interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis['code']>;
}
```

As you might remember, `Array<Type>` is just an alternative way to say *Type[]*. In cases like this, it is just much clearer to use the array convention since the other option would be to define the type by saying `Diagnosis['code'][]` which starts to look a bit strange.

Now that we have the *BaseEntry* defined, we can start creating the extended entry types we will actually be using. Let's start by creating the *HealthCheckEntry* type.

Entries of type *HealthCheck* contain the field *HealthCheckRating*, which is an integer from 0 to 3, zero meaning *Healthy* and 3 meaning *CriticalRisk*. This is a perfect case for an enum definition.
With these specifications we could write a *HealthCheckEntry* type definition like so:

```js
export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3
}

interface HealthCheckEntry extends BaseEntry {
  type: "HealthCheck";
  healthCheckRating: HealthCheckRating;
}
```

Now we only need to create the *OccupationalHealthcareEntry* and *HospitalEntry* types so we can combine them in a union and export them as an Entry type like this:

```js
export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry;
```

An important point concerning unions is that, when you use them with *Omit* to exclude a property, it works in a possibly unexpected way. Suppose we want to remove the *id* from each *Entry*. We could think of using `Omit<Entry, 'id'>`, but [it wouldn't work as we might expect](https://github.com/microsoft/TypeScript/issues/42680). In fact, the resulting type would only contain the common properties, but not the ones they don't share. A possible workaround is to define a special Omit-like function to deal with such situations:

```ts
// Define special omit for unions
type UnionOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T, K> : never;
// Define Entry without the 'id' property
type EntryWithoutId = UnionOmit<Entry, 'id'>;
```

</div>

<div class="tasks">

### Exercises 9.19-9.22

#### 9.19: Patientor, step4

Define the types *OccupationalHealthcareEntry* and *HospitalEntry* so that those conform with the example data. Ensure that your backend returns the entries properly when you go to an individual patient's route:

![browser shoiwing entries json data properly for patient](../../images/9/40.png)

Use types properly in the backend! For now, there is no need to do a proper validation for all the fields of the entries in the backend, it is enough e.g. to check that the field *type* has a correct value.

#### 9.20: Patientor, step5

Extend a patient's page in the frontend to list the *date*, *description* and *diagnoseCodes* of the patient's entries.

You can use the same type definition for an *Entry* in the frontend. For these exercises, it is enough to just copy/paste the definitions from the backend to the frontend.

Your solution could look like this:

![browser showing list of diagnosis codes for patient](../../images/9/41.png)

#### 9.21: Patientor, step6

Fetch and add diagnoses to the application state from the <i>/api/diagnoses</i> endpoint. Use the new diagnosis data to show the descriptions for patient's diagnosis codes:

![browser showing list of codes and their descriptions for patient ](../../images/9/42.png)

#### 9.22: Patientor, step7

Extend the entry listing on the patient's page to include the Entry's details with a new component that shows the rest of the information of the patient's entries distinguishing different types from each other.

You could use eg. [Icons](https://mui.com/components/material-icons/) or some other [Material UI](https://mui.com/) component to get appropriate visuals for your listing.

You should use a *switch case*-based rendering and <i>exhaustive type checking</i> so that no cases can be forgotten.

Like this:

![vscode showing error for healthCheckEntry not being assignable to type never](../../images/9/35c.png)

The resulting entries in the listing <i>could</i> look something like this:

![browser showing list of entries and their details in a nicer format](../../images/9/36x.png)

</div>

<div class="content">

### Add patient form

Form handling can sometimes be quite a nuisance in React. That's why we have decided to utilize the [Formik](https://formik.org/docs/overview) package for our app's add patient form. Here's a small intro from Formik's documentation:

> Formik is a small library that helps you with the 3 most annoying parts:
>
> - Getting values in and out of form state
> - Validation and error messages
> - Handling form submission
>
> By colocating all of the above in one place, Formik will keep things organized - making testing, refactoring, and reasoning about your forms a breeze.

The code for the form can be found from <i>src/AddPatientModal/AddPatientForm.tsx</i> and some form field helpers can be found from <i>src/AddPatientModal/FormField.tsx</i>.

Looking at the top of the <i>AddPatientForm.tsx</i> you can see we have created a type for our form values, which we have simply called *PatientFormValues*. The type is a modified version of the *Patient* type with the *id* and *entries* properties omitted. We don't want the user to be able to submit those when creating a new patient. The *id* is created by the backend and *entries* can only be added for existing patients.

```js
export type PatientFormValues = Omit<Patient, "id" | "entries">;
```

Next, we declare the props for our form component:

```js
interface Props {
  onSubmit: (values: PatientFormValues) => void;
  onCancel: () => void;
}
```

As you can see, the component requires two props: *onSubmit* and *onCancel*.
Both are callback functions that return *void*. The *onSubmit* function should receive an
object of type *PatientFormValues* as an argument so that the callback can handle our form values.

Looking at the *AddPatientForm* function component, you can see we have bound the *Props* as our component's props, and we destructure *onSubmit* and *onCancel* from those props.

```js
export const AddPatientForm = ({ onSubmit, onCancel }: Props) => {
  // ...
}
```

Now before we continue, let's take a look at our form helpers in <i>FormField.tsx</i>.
If you check what is exported from the file, you'll find the type *GenderOption* and the function components *SelectField* and *TextField*.

Let's take a closer look at *SelectField* and the types around it.
First, we create a generic type for each option object that contains a value and a label for that value. These are the kind of option objects we want to allow on our form in the select field.
Since the only options we want to allow are different genders, we set that the *value* should be of type *Gender*.

```js
export type GenderOption = {
  value: Gender;
  label: string;
};
```

In <i>AddPatientForm.tsx</i>, we use the *GenderOption* type for the *genderOptions* variable, declaring it to be an array containing objects of type *GenderOption*:

```js
const genderOptions: GenderOption[] = [
  { value: Gender.Male, label: "Male" },
  { value: Gender.Female, label: "Female" },
  { value: Gender.Other, label: "Other" }
];
```

Next, look at the type *SelectFieldProps*. It defines the type for the props of our *SelectField* component. There, you can see that *options* is an array of *GenderOption* types.

```js
type SelectFieldProps = {
  name: string;
  label: string;
  options: GenderOption[];
};
```

The function component *SelectField* in itself looks a bit cryptic but it just renders the label, a select element, and all given option elements (or, actually, their labels and values).

```jsx
const FormikSelect = ({ field, ...props }: FieldProps) =>
  <Select {...field} {...props} />;

export const SelectField = ({ name, label, options }: SelectFieldProps) => (
  <>
    <InputLabel>{label}</InputLabel>
    <Field
      fullWidth
      style={{ marginBottom: "0.5em" }}
      label={label}
      component={FormikSelect}
      name={name}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label || option.value}
        </MenuItem>
      ))}
    </Field>
  </>
);
```

Now let's move on to the *TextField* component. The component renders a TextFieldMUI that is a [Material UI TextField](https://mui.com/components/text-fields/) with a label:

```jsx
interface TextProps extends FieldProps {
  label: string;
  placeholder: string;
}

export const TextField = ({ field, label, placeholder }: TextProps) => (
  <div style={{ marginBottom: "1em" }}>
    <TextFieldMUI
      fullWidth
      label={label}
      placeholder={placeholder}
      {...field}
    />
    <Typography variant="subtitle2" style={{ color: "red" }}>
      <ErrorMessage name={field.name} />
    </Typography>
  </div>
);
```

Note that we use the Formik [ErrorMessage](https://formik.org/docs/api/errormessage) component to render an error message for the input when needed.
The component does everything under the hood, and we don't need to specify what it should do.

It would also be possible to get hold of the error messages within the component by using the prop *form*:

```jsx
export const TextField = ({ field, label, placeholder, form }: TextProps) => {
  console.log(form.errors); 
  // ...
}
```

Now, back to the actual form component in <i>AddPatientForm.tsx</i>.
The function component *AddPatientForm* renders a [Formik component](https://formik.org/docs/api/formik). The Formik component is a wrapper, which requires two props: *initialValues* and *onSubmit*. The role of the props is quite self-explanatory.
The Formik wrapper keeps a track of your form's state, and then exposes it and a few reusable methods and event handlers to your form via props.

We are also using an optional *validate* prop that expects a validation function and returns an object containing possible errors. Here, we only check that our text fields are not falsy, but it could easily contain e.g. some validation for the social security number format or something like that. The error messages defined by this function can then be displayed on the corresponding field's ErrorMessage component.

First, have a look at the entire component. We will later discuss the different parts in detail.

```jsx
interface Props {
  onSubmit: (values: PatientFormValues) => void;
  onCancel: () => void;
}

export const AddPatientForm = ({ onSubmit, onCancel }: Props) => {
  return (
    <Formik
      initialValues={{
        name: "",
        ssn: "",
        dateOfBirth: "",
        occupation: "",
        gender: Gender.Other
      }}
      onSubmit={onSubmit}
      validate={values => {
        const requiredError = "Field is required";
        const errors: { [field: string]: string } = {};
        if (!values.name) {
          errors.name = requiredError;
        }
        if (!values.ssn) {
          errors.ssn = requiredError;
        }
        if (!values.dateOfBirth) {
          errors.dateOfBirth = requiredError;
        }
        if (!values.occupation) {
          errors.occupation = requiredError;
        }
        return errors;
      }}
    >
      {({ isValid, dirty }) => {
        return (
          <Form className="form ui">
            <Field
              label="Name"
              placeholder="Name"
              name="name"
              component={TextField}
            />
            <Field
              label="Social Security Number"
              placeholder="SSN"
              name="ssn"
              component={TextField}
            />
            <Field
              label="Date Of Birth"
              placeholder="YYYY-MM-DD"
              name="dateOfBirth"
              component={TextField}
            />
            <Field
              label="Occupation"
              placeholder="Occupation"
              name="occupation"
              component={TextField}
            />
            <SelectField
              label="Gender"
              name="gender"
              options={genderOptions}
            />
            <Grid>
              <Grid item>
                <Button
                  color="secondary"
                  variant="contained"
                  style={{ float: "left" }}
                  type="button"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button
                  style={{ float: "right" }}
                  type="submit"
                  variant="contained"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddPatientForm;
```

As a child of our Formik wrapper, we have a <i>function</i> that returns the form contents.
We use Formik's [Form](https://formik.org/docs/api/form) to render the actual form element. Inside the Form element, we use our *TextField* and *SelectField* components that we created in <i>FormField.tsx</i>.

Lastly, we create two buttons: one for canceling the form submission and one for submitting the form. The cancel button calls the *onCancel* callback straight away when clicked.
The submit button triggers Formik's onSubmit event, which in turn uses the *onSubmit* callback from the component's props. The submit button is enabled only if the form is <i>valid</i> and <i>dirty</i>, which means that the user has edited some of the fields.

We handle form submission through Formik, because it allows us to call the validation function before performing the actual submission. If the validation function returns any errors, the submission is canceled.

The buttons are set inside a Material UI [Grid](https://mui.com/components/grid/#main-content) to set them next to each other easily.

```jsx
<Grid>
  <Grid item>
    <Button
      color="secondary"
      variant="contained"
      style={{ float: "left" }}
      type="button"
      onClick={onCancel}
    >
      Cancel
    </Button>
  </Grid>
  <Grid item>
    <Button
      style={{ float: "right" }}
      type="submit"
      variant="contained"
      disabled={!dirty || !isValid}
    >
      Add
    </Button>
  </Grid>
</Grid>
```

The *onSubmit* callback has been passed all the way down from our patient list page.
It sends an HTTP POST request to our backend, adds the patient returned from the backend to our app's state and closes the modal.
If the backend returns an error, the error is displayed on the form.

Here is our submit function:

```js
const submitNewPatient = async (values: FormValues) => {
  try {
    const { data: newPatient } = await axios.post<Patient>(
      `${apiBaseUrl}/patients`,
      values
    );
    dispatch({ type: "ADD_PATIENT", payload: newPatient });
    closeModal();
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.'
    if(axios.isAxiosError(error) && error.response) {
      console.error(error.response.data);
      errorMessage = error.response.data.error;
    }
    setError(errorMessage);
  }
};
```

With this material, you should be able to complete the rest of this part's exercises. When in doubt, try reading the existing code to find clues on how to proceed!

</div>

<div class="tasks">

### Exercises 9.23-9.27

#### 9.23: Patientor, step8

We have established that patients can have different kinds of entries. We don't yet have any way of adding entries to patients in our app, so, at the moment, it is pretty useless as an electronic medical record.

Your next task is to add endpoint <i>/api/patients/:id/entries</i> to your backend, through which you can POST an entry for a patient.

Remember that we have different kinds of entries in our app, so our backend should support all those types and check that at least all required fields are given for each type.

#### 9.24: Patientor, step9

Now that our backend supports adding entries, we want to add the corresponding functionality to the frontend. In this exercise, you should add a form for adding an entry to a patient. An intuitive place for accessing the form would be on a patient's page.

In this exercise, it is enough to **support <i>one</i> entry type**, and you do not have to handle any errors. It is enough if a new entry can be created when the form is filled with valid data.

Upon a successful submit, the new entry should be added to the correct patient and the patient's entries on the patient page should be updated to contain the new entry.

If you like, you can re-use some of the code from the <i>Add patient</i> form for this exercise, but this is not a requirement.

Note that the file [FormField.tsx](https://github.com/fullstack-hy2020/patientor/blob/master/src/AddPatientModal/FormField.tsx#L58) has a ready-made component called *DiagnosisSelection* that can be used for setting the field *diagnoses*.

It can be used as follows:

```js
const AddEntryForm = ({ onSubmit, onCancel }: Props) => {
  const [{ diagnoses }] = useStateValue() // highlight-line

  return (
    <Formik
      initialValues={{
        /// ...
      }}
      onSubmit={onSubmit}
      validate={values => {
        /// ...
      }}
    >
    {({ isValid, dirty, setFieldValue, setFieldTouched }) => { // highlight-line

      return (
        <Form className="form ui">
          // ...

          // highlight-start
          <DiagnosisSelection
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            diagnoses={Object.values(diagnoses)}
          />    
          // highlight-end

          // ...
        </Form>
      );
    }}
  </Formik>
  );
};
```

With small tweaks on types, the readily made component *SelectField* can be used for the health check rating.

#### 9.25: Patientor, step10

Extend your solution so that it displays an error message if some required values are missing or formatted incorrectly.

#### 9.26: Patientor, step11

Extend your solution so that it supports <i>two</i> entry types and displays an error message if some required values are missing or formatted incorrectly. You do not need to care about possible errors in the server's response.

The easiest but surely not the most elegant way to do this exercise is to have a separate form for each different entry type. Getting the types to work properly might be a slight challenge if you use just a single form.

Note that if you need to alter the shown form based on user selections, you can access the form values using the parameter *values* of the rendering function:

```js
<Formik
  initialValues={}
  onSubmit={onSubmit}
  validate={}
>
  {({ isValid, dirty, setFieldValue, setFieldTouched, values }) => { // highlight-line
    console.log(values); // highlight-line
    return (
      <Form className="form ui">
      </Form>
    );
  }}
</Formik>
```

#### 9.27: Patientor, step12

Extend your solution so that it supports <i>all the entry types</i> and displays an error message if some required values are missing or formatted incorrectly. You do not need to care about possible errors in the server's response.

### Submitting exercises and getting the credits

Exercises of this part are submitted via [the submissions system](https://studies.cs.helsinki.fi/stats/courses/fs-typescript) just like in the previous parts, but unlike previous parts, the submission goes to a different "course instance". Remember that you have to finish at least 24 exercises to pass this part!

Once you have completed the exercises and want to get the credits, let us know through the exercise submission system that you have completed the course:

![Submissions](../../images/11/21.png)

**Note** that you need a registration to the corresponding course part for getting the credits registered, see [here](/en/part0/general_info#parts-and-completion) for more information.

You can download the certificate for completing this part by clicking one of the flag icons. The flag icon corresponds to the certificate's language.

</div>
