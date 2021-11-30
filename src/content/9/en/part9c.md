---
mainImage: ../../../images/part-9.svg
part: 9
letter: c
lang: en
---

<div class="content">

Now that we have a basic understanding of how TypeScript works and how to create small projects with it, it's time to start creating something actually useful. We are now going to create a new project that will introduce use cases that are a little more realistic.

One major change from the previous part is that <i>we're not going to use ts-node anymore</i>. It is a handy tool that helps you get started, but in the long run it is advisable to use the official TypeScript compiler that comes with the <i>typescript</i> npm-package. The official compiler generates and packages JavaScript files from the .ts files so that the built <i>production version</i> won't contain any TypeScript code anymore. This is the exact outcome we are aiming for, since TypeScript itself is not executable by browsers or Node.

### Setting up the project

We will create a project for Ilari, who loves flying small planes but has a difficult time managing his flight history. He is a coder himself, so he doesn't necessarily need a user interface, but he'd like to use a software with HTTP requests and retain the possibility of later adding a web-based user interface to the application.

Let's start by creating our first real project: *Ilari's flight diaries*. As usual, run <i>npm init</i> and install the <i>typescript</i> package as a dev dependency. 

```shell
 npm install typescript --save-dev
```

TypeScript's Native Compiler (<i>tsc</i>) can help us initialize our project by generating our <i>tsconfig.json</i> file.
First, we need to add the <i>tsc</i> command to the list of executable scripts in <i>package.json</i> (unless you have installed *typescript* globally). Even if you installed TypeScript globally, you should always add it as a dev dependency to your project.

The npm script for running <i>tsc</i> is set as follows:

```json
{
  // ..
  "scripts": {
    "tsc": "tsc" // highlight-line
  },
  // ..
}
```

The bare <i>tsc</i> command is often added to the </i>scripts</i> so that other scripts can use it, hence don't be surprised to find it set up within the project like this.

We can now initialise our tsconfig.json settings by running:

```shell
 npm run tsc -- --init
```

 **Note** the extra <i>--</i> before the actual argument! Arguments before <i>--</i>  are interpreted as being for the <i>npm</i> command, while the ones after that are meant for the command that is run through the script (i.e. <i>tsc</i> in this case).

The <i>tsconfig.json</i> file we just created contains a lengthy list of every configuration available to us. However, most of them are commented out.
Studying this file can help you find some configuration options you might need.
It is also completely okay to keep the commented lines, in case you might need them someday.

At the moment, we want the following to be active:

```json
{
  "compilerOptions": {
    "target": "ES6",
    "outDir": "./build/",
    "module": "commonjs",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true
  }
}
```

Let's go through each configuration:

The <i>target</i> configuration tells the compiler which *ECMAScript* version to use when generating JavaScript. ES6 is supported by most browsers, so it is a good and safe option.

<i>outDir</i> tells where the compiled code should be placed.


<i>module</i> tells the compiler that we want to use *CommonJS* modules in the compiled code. This means we can use the old <i>require</i> syntax instead of the <i>import</i> one, which is not supported in older versions of *Node*, such as version 10.

<i>strict</i> is actually a shorthand for multiple separate options:
<i>noImplicitAny, noImplicitThis, alwaysStrict, strictBindCallApply, strictNullChecks, strictFunctionTypes and strictPropertyInitialization</i>.
They guide our coding style to use the TypeScript features more strictly.
For us, perhaps the most important is the already-familiar [noImplicitAny](https://www.staging-typescript.org/tsconfig#noImplicitAny). It prevents implicitly setting type <i>any</i>, which can for example happen if you don't type the parameters of a function.
Details about the rest of the configurations can be found in the [tsconfig documentation](https://www.staging-typescript.org/tsconfig#strict).
Using <i>strict</i> is suggested by the official documentation.

<i>noUnusedLocals</i> prevents having unused local variables, and <i>noUnusedParameters</i> throws an error if a function has unused parameters.

<i>noFallthroughCasesInSwitch</i> ensures that, in a *switch case*, each case ends either with a <i>return</i> or a <i>break</i> statement.

<i>esModuleInterop</i> allows interoperability between CommonJS and ES Modules; see more in the [documentation](https://www.staging-typescript.org/tsconfig#esModuleInterop).

Now that we have set our configuration, we can continue by installing <i>express</i> and, of course, also <i>@types/express</i>. Also, since this is a real project, which is intended to be grown over time, we will use eslint from the very beginning:

```shell
npm install express
npm install --save-dev eslint @types/express @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

Now our <i>package.json</i> should look like this:

```json
{
  "name": "flight_diary",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "tsc": "tsc"
  },
  "author": "Jane Doe",
  "license": "ISC",
  "devDependencies": {
    "@types/express": "^4.17.11",
    "@typescript-eslint/eslint-plugin": "^4.16.1",
    "@typescript-eslint/parser": "^4.16.1",
    "eslint": "^7.21.0",
    "typescript": "^4.2.2"
  },
  "dependencies": {
    "express": "^4.17.1"
  }
}
```

We also create an <i>.eslintrc</i> file with the following content:

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  "plugins": ["@typescript-eslint"],
  "env": {
    "browser": true,
    "es6": true,
    "node": true
  },
  "rules": {
    "@typescript-eslint/semi": ["error"],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
    "@typescript-eslint/restrict-plus-operands": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { "argsIgnorePattern": "^_" }
    ],
    "no-case-declarations": "off"
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json"
  }
}
```

Now we just need to set up our development environment, and we are ready to start writing some serious code.
There are many different options for this. One option could be to use the familiar <i>nodemon</i> with </i>ts-node</i>. However, as we saw earlier, </i>ts-node-dev</i> does the exact same thing, so we will use that instead.
So, let's install <i>ts-node-dev</i>:

```shell
npm install --save-dev ts-node-dev
```

We finally define a few more npm scripts, and voilà, we are ready to begin:

```json
{
  // ...
  "scripts": {
    "tsc": "tsc",
    "dev": "ts-node-dev index.ts", // highlight-line
    "lint": "eslint --ext .ts ." // highlight-line
  },
  // ...
}
```

As you can see, there is a lot of stuff to go through before beginning the actual coding. When you are working with a real project, careful preparations support your development process. Take the time needed to create a good setup for yourself and your team, so that everything runs smoothly in the long run.

### Let there be code

Now we can finally start coding! As always, we start by creating a ping endpoint, just to make sure everything is working.

The contents of the <i>index.ts</i> file:

```js
import express from 'express';
const app = express();
app.use(express.json());

const PORT = 3000;

app.get('/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

Now, if we run the app with <i>npm run dev</i>, we can verify that a request to http://localhost:3000/ping gives the response <i>pong</i>, so our configuration is set!

When starting the app with <i>npm run dev</i>, it runs in development mode.
The development mode is not suitable at all when we later operate the app in production.

Let's try to create a <i>production build</i> by running the TypeScript compiler. Since we have defined the <i>outdir</i> in our tsconfig.json, there's really nothing else to do but run the script <i>npm run tsc</i>.

Just like magic, a native runnable JavaScript production build of the express backend is created in the directory <i>build</i>.

Currently, if we run eslint it will also interpret the files in the <i>build</i> directory. We don't want that, since the code there is compiler-generated. We can prevent this by creating a  <i>.eslintignore</i> file  which lists the content we want eslint to ignore, just like we do with git and <i>gitignore</i>.

Let's add an npm script for running the application in production mode:

```json
{
  // ...
  "scripts": {
    "tsc": "tsc",
    "dev": "ts-node-dev index.ts",
    "lint": "eslint --ext .ts .",
    "start": "node build/index.js" // highlight-line
  },
  // ...
}
```

When we run the app with <i>npm start</i>, we can verify that the production build also works:

![](../../images/9/15a.png)

Now we have a minimal working pipeline for developing our project.
With the help of our compiler and eslint, it also ensures that good code quality is maintained. With this base, we can actually start creating an app that we could later on deploy into a production environment.

</div>

<div class="tasks">

### Exercises 9.8.-9.9.

**Before you start the exercises**

For this set of exercises you will be developing a backend for an existing project called **Patientor**, which is a simple medical record application for doctors who handle diagnoses and basic health information of their patients.

The [frontend](https://github.com/fullstack-hy/patientor) has already been built by outsider experts and your task is to create a backend to support the existing code.

#### 9.8: Patientor backend, step1

Initialise a new backend project that will work with the frontend. Configure eslint and tsconfig with the same configurations as proposed in the material. Define an endpoint that answers to HTTP GET requests to route <i>/ping</i>.

The project should be runnable with npm scripts, both in development mode and, as compiled code, in production mode.

#### 9.9: Patientor backend, step2

Fork and clone the project [patientor](https://github.com/fullstack-hy/patientor). Start the project with the help of the README file. You should be able to use the frontend without a functioning backend.

Ensure that backend answers to the ping request that <i>frontend</i> has made on startup. Check developer tool to make sure it really works:

![](../../images/9/16a.png)

You might also want to have a look at the <i>console</i> tab. If something fails, [part 3](/en/part3) of the course shows how the problem can be solved.

</div>

<div class="content">

### Implementing the functionality

Finally, we are ready to start writing some code.

<!-- Let's start from basics. Ilari wants to keep track of his experiences on his flight journeys. -->
Let's start from the basics. Ilari wants to be able to keep track of his experiences on his flight journeys.
<!-- What he wants to be able to save are </i>diary entries</i> that include:  -->
<!-- - Date of the entry -->
<!-- - Weather conditions (either good, windy, rainy or stormy) -->
<!-- - Visibility (either good, ok or poor) -->
<!-- - Free text entry of experience -->
He wants to be able to save </i>diary entries</i> which contain:
- The date of the entry
- Weather conditions (good, windy, rainy or stormy)
- Visibility (good, ok or poor)
- Free text detailing the experience

We have obtained some sample data, which we will use as a base to build on.
The data is saved in json format, and can be found [here](https://github.com/fullstack-hy2020/misc/blob/master/diaryentries.json).

The data looks like the following:

```json
[
  {
    "id": 1,
    "date": "2017-01-01",
    "weather": "rainy",
    "visibility": "poor",
    "comment": "Pretty scary flight, I'm glad I'm alive"
  },
  {
    "id": 2,
    "date": "2017-04-01",
    "weather": "sunny",
    "visibility": "good",
    "comment": "Everything went better than expected, I'm learning much"
  },
  // ...
]
```

Let's start by creating an endpoint which returns all flight diary entries.

First, we need to make some decisions on how to structure our source code. It is better to place all source code under <i>src</i> directory, so source code is not mixed with configuration files.
We will move <i>index.ts</i> there and make the necessary changes to the npm scripts.

We will place all [routers](/en/part4/structure_of_backend_application_introduction_to_testing), modules which are responsible for handling a set of specific resources such as <i>diaries</i>, under the directory <i>src/routes</i>.
This is a bit different than what we did  in [part 4](/en/part4), where we used directory <i>src/controllers</i>.

The router taking care of all diary endpoints is in <i>src/routes/diaries.ts</i> and looks like this:

```js
import express from 'express';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send('Fetching all diaries!');
});

router.post('/', (_req, res) => {
  res.send('Saving a diary!');
});

export default router;
```

We'll route all requests to prefix <i>/api/diaries</i> to that specific router in _index.ts_


```js
import express from 'express';
import diaryRouter from './routes/diaries'; // highlight-line
const app = express();
app.use(express.json());

const PORT = 3000;

app.get('/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.use('/api/diaries', diaryRouter); // highlight-line


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

And now, if we make an HTTP GET request to http://localhost:3000/api/diaries, we should see the message <i>Fetching all diaries!</i>.

Next, we need to start serving the seed data (found [here](https://github.com/fullstack-hy2020/misc/blob/master/diaryentries.json)) from the app. We will fetch the data and save it to <i>data/diaries.json</i>.

We won't be writing the code for the actual data manipulations in the router. We will create a <i>service</i> which takes care of the data manipulation instead.
It is quite a common practice to separate the "business logic" from the router code into its own modules, which are quite often called <i>services</i>.
The name service originates from [Domain-driven design](https://en.wikipedia.org/wiki/Domain-driven_design) and was made popular by the [Spring](https://spring.io/) framework.

Let's create a <i>src/services</i> directory and
place the <i>diaryService.ts</i> file in it.
The file contains two functions for fetching and saving diary entries:

```js
import diaryData from '../../data/diaries.json';

const getEntries = () => {
  return diaryData;
};

const addEntry = () => {
  return null;
};

export default {
  getEntries,
  addEntry
};
```

But something is not right:

![](../../images/9/17c.png)

The hint says we might want to use <i>resolveJsonModule</i>. Let's add it to our tsconfig:

```json
{
  "compilerOptions": {
    "target": "ES6",
    "outDir": "./build/",
    "module": "commonjs",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "resolveJsonModule": true // highlight-line
  }
}
```

And our problem is solved.

> **NB**: For some reason, VSCode tends to complain that it cannot find the file <i>../../data/diaries.json</i> from the service despite the file existing. That is a bug in the editor, and goes away when the editor is restarted.

Earlier, we saw how the compiler can decide the type of a variable by the value it is assigned.
Similarly, the compiler can interpret large data sets consisting of objects and arrays.
Due to this, the compiler can actually warn us if we try to do something suspicious with the json data we are handling.
For example, if we are handling an array containing objects of a specific type, and we try to add an object which does not have all the fields the other objects have, or has type conflicts (for example, a number where there should be a string), the compiler can give us a warning.

Even though the compiler is pretty good at making sure we don't do anything unwanted, it is safer to define the types for the data ourselves.

Currently, we have a basic working TypeScript express app, but there are barely any actual <i>typings</i> in the code.
Since we know what type of data should be accepted for the weather and visibility fields, there is no reason for us not to include their types to the code.

Let's create a file for our types, <i>types.ts</i>, where we'll define all our types for this project.

First, let's type the <i>Weather</i> and <i>Visibility</i> values using a [union type](https://www.typescriptlang.org/docs/handbook/advanced-types.html#union-types) of the allowed strings:

```js
export type Weather = 'sunny' | 'rainy' | 'cloudy' | 'windy' | 'stormy';

export type Visibility = 'great' | 'good' | 'ok' | 'poor';
```

And, from there, we can continue by creating a DiaryEntry type, which will be an [interface](http://www.typescriptlang.org/docs/handbook/interfaces.html):

```js
export interface DiaryEntry {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment: string;
}
```

We can now try to type our imported json:

```js
import diaryData from '../../data/diaries.json';

import { DiaryEntry } from '../types'; // highlight-line

const diaries: Array<DiaryEntry> = diaryData; // highlight-line

const getEntries = (): Array<DiaryEntry> => { // highlight-line
  return diaries; // highlight-line
};

const addEntry = () => {
  return null;
};

export default {
  getEntries,
  addEntry
};
```

But since the json already has its values declared, assigning a type for the data set results in an error:

![](../../images/9/19b.png)

The end of the error message reveals the problem: the <i>weather</i> fields are incompatible. In <i>DiaryEntry</i>, we specified that its type is <i>Weather</i>, but
the TypeScript compiler had inferred its type to be <i>string</i>.

We can fix the problem by doing [type assertion](http://www.typescriptlang.org/docs/handbook/basic-types.html#type-assertions). This should be done only if we are certain we know what we are doing.
If we assert the type of the variable <i>diaryData</i> to be <i>DiaryEntry</i> with the keyword <i>as</i>, everything should work:

```js
import diaryData from '../../data/entries.json'

import { Weather, Visibility, DiaryEntry } from '../types'

const diaries: Array<DiaryEntry> = diaryData as Array<DiaryEntry>; // highlight-line

const getEntries = (): Array<DiaryEntry> => {
  return diaries;
}

const addEntry = () => {
  return null
}

export default {
  getEntries,
  addEntry
};
```

We should never use type assertion unless there is no other way to proceed, as there is always the danger we assert an unfit type to an object and cause a nasty runtime error.
While the compiler trusts you to know what you are doing when using <i>as</i>, by doing this, we are not using the full power of TypeScript but relying on the coder to secure the code.

In our case, we could change how we export our data so we can type it within the data file.
Since we cannot use typings in a JSON file, we should convert the json file to a ts file which exports the typed data like so:

```js
import { DiaryEntry } from "../src/types";

const diaryEntries: Array<DiaryEntry> = [
  {
      "id": 1,
      "date": "2017-01-01",
      "weather": "rainy",
      "visibility": "poor",
      "comment": "Pretty scary flight, I'm glad I'm alive"
  },
  // ...
];

export default diaryEntries;
```

Now, when we import the array, the compiler interprets it correctly and the <i>weather</i> and <i>visibility</i> fields are understood right:


```js
import diaries from '../../data/diaries'; // highlight-line

import { DiaryEntry } from '../types';

const getEntries = (): Array<DiaryEntry> => {
  return diaries;
}

const addEntry = () => {
  return null;
}

export default {
  getEntries,
  addEntry
};
```

Note that, if we want to be able to save entries without a certain field, e.g. <i>comment</i>, we could set the type of the field as [optional](http://www.typescriptlang.org/docs/handbook/interfaces.html#optional-properties) by adding <i>?</i> to the type declaration:

```js
export interface DiaryEntry {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment?: string;
}
```

### Node and JSON modules

It is important to take note of a problem that may arise when using the tsconfig [resolveJsonModule](https://www.typescriptlang.org/en/tsconfig#resolveJsonModule) option:

```json
{
  "compilerOptions": {
    // ...
    "resolveJsonModule": true // highlight-line
  }
}
```

According to the node documentation for [file modules](https://nodejs.org/api/modules.html#modules_file_modules),
node will try to resolve modules in order of extensions:

```shell
 ["js", "json", "node"]
```

In addition to that, by default, <i>ts-node</i> and <i>ts-node-dev</i> extend the list of possible node module extensions to:

```shell
 ["js", "json", "node", "ts", "tsx"]
```

> **NB**: The validity of <i>.js</i>, <i>.json</i> and <i>.node</i> files as modules in TypeScript depend on environment configuration, including <i>tsconfig</i> options such as <i>allowJs</i> and <i>resolveJsonModule</i>.

Consider a flat folder structure containing files:

```shell
  ├── myModule.json
  └── myModule.ts
```

In TypeScript, with the <i>resolveJsonModule</i> option set to true, the file <i>myModule.json</i> becomes a valid node module. Now, imagine a scenario where we wish to take the file <i>myModule.ts</i> into use:

```js
import myModule from "./myModule";
```

Looking closely at the order of node module extensions:

```shell
 ["js", "json", "node", "ts", "tsx"]
```

We notice that the <i>.json</i> file extension takes precedence over <i>.ts</i> and so <i>myModule.json</i> will be imported and not <i>myModule.ts</i>.

In order to avoid time-eating bugs, it is recommended that within a flat directory, each file with a valid node module extension has a unique filename.

### Utility Types

Sometimes, we might want to use a specific modification of a type.
For example, consider a page for listing some data, some of which is sensitive and some of which is non-sensitive.
We might want to be sure that no sensitive data is used or displayed. We could <i>pick</i> the fields of a type we allow to be used to enforce this.
We can do that by using the utility type [Pick](http://www.typescriptlang.org/docs/handbook/utility-types.html#picktk).

In our project, we should consider that Ilari might want to create a listing of all his diary entries <i>excluding</i> the comment field since, during a very scary flight, he might end up writing something he wouldn't necessarily want to show anyone else.

The [Pick](http://www.typescriptlang.org/docs/handbook/utility-types.html#picktk) utility type allows us to choose which fields of an existing type we want to use.
Pick can be used to either construct a completely new type, or to inform a function what it should return on runtime.
Utility types are a special kind of type tools, but they can be used just like regular types.

In our case, in order to create a "censored" version of the  <i>DiaryEntry</i> for public displays, we can use Pick in the function declaration:

```js
const getNonSensitiveEntries =
  (): Array<Pick<DiaryEntry, 'id' | 'date' | 'weather' | 'visibility'>> => {
    // ...
  }
```

and the compiler would expect the function to return an array of values of the modified DiaryEntry type, which include only the four selected fields.

Since [Pick](http://www.typescriptlang.org/docs/handbook/utility-types.html#picktk) requires the type it modifies to be given as a [type variable](http://www.typescriptlang.org/docs/handbook/generics.html#working-with-generic-type-variables), just like Array does, we now have two nested type variables and the syntax is starting to look a bit odd.
We can improve the code's readability by using the [alternative](http://www.typescriptlang.org/docs/handbook/basic-types.html#array) array syntax:

```js
const getNonSensitiveEntries =
  (): Pick<DiaryEntry, 'id' | 'date' | 'weather' | 'visibility'>[] => {
    // ...
  }
```

In this case, we want to exclude only one field,
so it would be even better to use the [Omit](http://www.typescriptlang.org/docs/handbook/utility-types.html#omittk) utility type, which we can use to declare which fields to exclude:

```js
const getNonSensitiveEntries = (): Omit<DiaryEntry, 'comment'>[] => {
  // ...
}
```
 Another way would be to declare a completely new type for the <i>NonSensitiveDiaryEntry</i>:

```js
export type NonSensitiveDiaryEntry = Omit<DiaryEntry, 'comment'>;
```

The code now becomes:

```js
import diaries from '../../data/diaries';
import { NonSensitiveDiaryEntry, DiaryEntry } from '../types'; // highlight-line

const getEntries = (): DiaryEntry[] => {
  return diaries;
};

const getNonSensitiveEntries = (): NonSensitiveDiaryEntry[] => { // highlight-line
  return diaries;
};

const addEntry = () => {
  return null;
};

export default {
  getEntries,
  addEntry,
  getNonSensitiveEntries // highlight-line
};
```

One thing in our application is a cause for concern. In <i>getNonSensitiveEntries</i>, we are returning the complete diary entries, and <i>no error is given</i> despite typing!

This happens because [TypeScript only checks](http://www.typescriptlang.org/docs/handbook/type-compatibility.html) whether we have all of the required fields or not, but excess fields are not prohibited. In our case, this means that it is <i>not prohibited</i> to return an object of type <i>DiaryEntry[]</i>, but if we were to try to access the <i>comment</i> field, it would not be possible because we would be accessing a field that TypeScript is unaware of even though it exists.

Unfortunately, this can lead to unwanted behaviour if you are not aware of what you are doing; the situation is valid as far as TypeScript is concerned, but you are most likely allowing use that is not wanted.
If we were now to return all of the diaryEntries from the <i>getNonSensitiveEntries</i> function to the <i>frontend</i>, we would actually be leaking the unwanted fields to the requesting browser even though our types seem to imply otherwise!

Because TypeScript doesn't modify the actual data but only its type, we need to exclude the fields ourselves:

```js
import diaries from '../../data/entries.js'

import { NonSensitiveDiaryEntry, DiaryEntry } from '../types'

const getEntries = () : DiaryEntry[] => {
  return diaries
}

// highlight-start
const getNonSensitiveEntries = (): NonSensitiveDiaryEntry[] => {
  return diaries.map(({ id, date, weather, visibility }) => ({
    id,
    date,
    weather,
    visibility,
  }));
};
// highlight-end

const addDiary = () => {
  return []
}

export default {
  getEntries,
  getNonSensitiveEntries,
  addDiary
}
```

If we now try to return this data with the basic <i>DiaryEntry</i> type, i.e. if we type the function as follows:


```js
const getNonSensitiveEntries = (): DiaryEntry[] => {
```

we would get the following error:

![](../../images/9/22b.png)

Again, the last line of the error message is the most helpful one. Let's undo this undesired modification.

Utility types include many handy tools, and it is definitely worth it to take some time to study [the documentation](https://www.typescriptlang.org/docs/handbook/utility-types.html).

Finally, we can complete the route which returns all diary entries:

```js
import express from 'express';
import diaryService from '../services/diaryService';  // highlight-line

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(diaryService.getNonSensitiveEntries()); // highlight-line
});

router.post('/', (_req, res) => {
    res.send('Saving a diary!');
});

export default router;
```

The response is what we expect it to be:

![](../../images/9/26.png)

</div>

<div class="tasks">

### Exercises 9.10.-9.11.

Similarly to Ilari's flight service, we do not use a real database in our app but instead use hardcoded data that is in the files [diagnoses.json](https://github.com/fullstack-hy/misc/blob/master/diagnoses.json) and [patients.json](https://github.com/fullstack-hy/misc/blob/master/patients.json). Get the files and store those in a directory called <i>data</i> in your project. All data modification can be done in runtime memory, so during this part it is <i>not necessary to write to a file</i>.

#### 9.10: Patientor backend, step3

Create a type <i>Diagnose</i> and use it to create endpoint <i>/api/diagnoses</i> for fetching all diagnoses with HTTP GET.

Structure your code properly by using meaningfully-named directories and files.

**Note** that <i>diagnoses</i> may or may not contain the field <i>latin</i>. You might want to use [optional properties](https://www.typescriptlang.org/docs/handbook/interfaces.html#optional-properties) in the type definition.

#### 9.11: Patientor backend, step4

Create data type <i>Patient</i> and set up the GET endpoint <i>/api/patients</i> which returns all patients to the frontend, excluding field <i>ssn</i>. Use a [utility type](https://www.typescriptlang.org/docs/handbook/utility-types.html) to make sure you are selecting and returning only the wanted fields.

In this exercise, you may assume that field <i>gender</i> has type <i>string</i>.

Try the endpoint with your browser and ensure that <i>ssn</i> is not included in the response:

![](../../images/9/22g.png)

After creating the endpoint, ensure that the <i>frontend</i> shows the list of patients:

![](../../images/9/22h.png)

</div>

<div class="content">

### Preventing an accidental undefined result

Let's extend the backend to support fetching one specific entry with an HTTP GET request to route <i>api/diaries/:id</i>.

The DiaryService needs to be extended with a <i>findById</i> function:

```js
// ...

// highlight-start
const findById = (id: number): DiaryEntry => {
  const entry = diaries.find(d => d.id === id);
  return entry;
};
// highlight-end

export default {
  getEntries,
  getNonSensitiveEntries,
  addDiary,
  findById // highlight-line
}
```

But once again, a new problem emerges:

![](../../images/9/23e.png)

The issue is that there is no guarantee that an entry with the specified id can be found.
It is good that we are made aware of this potential problem already at compile phase. Without TypeScript, we would not be warned about this problem, and in the worst case scenario, we could have ended up returning an <i>undefined</i> object instead of informing the user about the specified entry not being found.

First of all, in cases like this, we need to decide what the <i>return value</i> should be if an object is not found, and how the case should be handled.
The <i>find</i> method of an array returns <i>undefined</i> if the object is not found, and this is actually fine with us.
We can solve our problem by typing the return value as follows:

```js
const findById = (id: number): DiaryEntry | undefined => { // highlight-line
  const entry = diaries.find(d => d.id === id);
  return entry;
}
```

The route handler is the following:

```js
import express from 'express';
import diaryService from '../services/diaryService'

router.get('/:id', (req, res) => {
  const diary = diaryService.findById(Number(req.params.id));

  if (diary) {
    res.send(diary);
  } else {
    res.sendStatus(404);
  }
});

// ...

export default router;
```

### Adding a new diary

Let's start building the HTTP POST endpoint for adding new flight diary entries.
The new entries should have the same type as the existing data.

The code handling of the response looks as follows:

```js
router.post('/', (req, res) => {
  const { date, weather, visibility, comment } = req.body;
  const newDiaryEntry = diaryService.addDiary(
    date,
    weather,
    visibility,
    comment,
  );
  res.json(newDiaryEntry);
});
```

The corresponding method in <i>diaryService</i> looks like this:

```js
import {
  NonSensitiveDiaryEntry,
  DiaryEntry,
  Visibility, // highlight-line
  Weather // highlight-line
} from '../types';


const addDiary = (
    date: string, weather: Weather, visibility: Visibility, comment: string
  ): DiaryEntry => {

  const newDiaryEntry = {
    id: Math.max(...diaries.map(d => d.id)) + 1,
    date,
    weather,
    visibility,
    comment,
  }

  diaries.push(newDiaryEntry);
  return newDiaryEntry;
};
```

As you can see, the <i>addDiary</i> function is becoming quite hard to read now that we have all the fields as separate parameters.
It might be better to just send the data as an object to the function:

```js
router.post('/', (req, res) => {
  const { date, weather, visibility, comment } = req.body;
  const newDiaryEntry = diaryService.addDiary({ // highlight-line
    date,
    weather,
    visibility,
    comment,
  }); // highlight-line
  res.json(newDiaryEntry);
})
```

But wait, what is the type of this object? It is not exactly a <i>DiaryEntry</i>, since it is still missing the <i>id</i> field.
It could be useful to create a new type, <i>NewDiaryEntry</i>, for an entry that hasn't been saved yet.
Let's create that in <i>types.ts</i> using the existing <i>DiaryEntry</i> type and the [Omit](http://www.typescriptlang.org/docs/handbook/utility-types.html#omittk) utility type:

```js
export type NewDiaryEntry = Omit<DiaryEntry, 'id'>;
```

Now we can use the new type in our DiaryService,
and destructure the new entry object when creating an entry to be saved:

```js
import { NewDiaryEntry, NonSensitiveDiaryEntry, DiaryEntry } from '../types'; // highlight-line

// ...

const addDiary = ( entry: NewDiaryEntry ): DiaryEntry => {  // highlight-line
  const newDiaryEntry = {
    id: Math.max(...diaries.map(d => d.id)) + 1,
    ...entry // highlight-line
  };

  diaries.push(newDiaryEntry);
  return newDiaryEntry;
};
```

Now the code looks much cleaner!

There is still a complaint from our code:

![](../../images/9/43.png)

The cause is the eslint rule [@typescript-eslint/no-unsafe-assignment](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unsafe-assignment.md) that prevents us from assigning the fields of a request body to variables. 

For the time being, let us just ignore the eslint-rule from the whole file by adding the following as the first line of the file:

``` js
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
```

In order to parse the incoming data we must have the <i>json</i> middleware configured:


``` js
import express from 'express';
import diaryRouter from './routes/diaries';
const app = express();
app.use(express.json()); // highlight-line

const PORT = 3000;

app.use('/api/diaries', diaryRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

Now the application is ready to receive HTTP POST requests for new diary entries of the correct type!

### Proofing requests

There are plenty of things that can go wrong when we accept data from outside sources.
Applications rarely work completely on their own, and we are forced to live with the fact that data from sources outside of our system cannot be fully trusted.
When we receive data from an outside source, there is no way it can already be typed when we receive it. We need to make decisions on how to handle the uncertainty that comes with this.

The disabled eslint rule was actually giving us a hint that the following assignment is a risky one:

```js
const diary = diaryService.findById(Number(req.params.id));
```

We certainly would like to have certainty that the object in a post request is of the right type, so let us define a function <i>toNewDiaryEntry</i> that receives the request body as a parameter and returns a properly-typed <i>NewDiaryEntry</i> object. The function shall be defined in the file <i>utils.ts</i>.

The route definition uses the function as follows:

```js
import toNewDiaryEntry from '../utils'; // highlight-line

// ...

router.post('/', (req, res) => {
  try {
    const newDiaryEntry = toNewDiaryEntry(req.body); // highlight-line

    const addedEntry = diaryService.addDiary(newDiaryEntry); // highlight-line
    res.json(addedEntry);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
})
```

We can now also remove the first line that ignores the eslint rule <i>no-unsafe-assignment</i>.

Since we are now writing secure code and trying to ensure that we are getting exactly the data we want from the requests, we should get started with parsing and validating each field we are expecting to receive.

The skeleton of the function <i>toNewDiaryEntry</i> looks like the following:

```js
import { NewDiaryEntry } from './types';

const toNewDiaryEntry = (object): NewDiaryEntry => {
  const newEntry: NewDiaryEntry = {
    // ...
  };

  return newEntry;
};

export default toNewDiaryEntry;
```

The function should parse each field and make sure that the return value is exactly of type <i>NewDiaryEntry</i>. This means we should check each field separately.

Once again, we have a type issue: what is the <i>object</i> type? Since the <i>object</i> is in fact the body of a request, Express has typed it as <i>any</i>. Since the idea of this function is to map fields of unknown type to fields of the correct type and check whether they are defined as expected, this might be the rare case where we actually <i>want to allow the <i>any</i> type</i>.

However, if we type the object as <i>any</i>, eslint gives us two complaints:

![](../../images/9/44.png)

We could ignore these rules but a better idea is to follow the advice the editor gives in the <i>Quick Fix</i> and set the parameter type to unknown.
```js
import { NewDiaryEntry } from './types';

const toNewDiaryEntry = (object: unknown): NewDiaryEntry => { // highlight-line
  const newEntry: NewDiaryEntry = {
    // ...
  }

  return newEntry;
}

export default toNewDiaryEntry;
```

<i>unknown</i> is the ideal type for our kind of situation of input validation, since we don't yet need to define the type to match <i>any</i> type, but can first verify the type and then confirm the expected type. With the use of <i>unknown</i>, we also don't need to worry about the <i>@typescript-eslint/no-explicit-any</i> eslint rule, since we are not using <i>any</i>. However, we might still need to use <i>any</i> in some cases where we are not yet sure about the type and need to access properties of an <i>any</i> object in order to validate or type check the property values themselves.

Let us start creating the parsers for each of the fields of <i>object</i>.

To validate the <i>comment</i> field, we need to check that it exists, and to ensure that it is of the type <i>string</i>.


The function should look something like this:

```js
const parseComment = (comment: unknown): string => {
  if (!comment || !isString(comment)) {
    throw new Error('Incorrect or missing comment');
  }

  return comment;
};
```

The function gets a parameter of type <i>unknown</i> and returns it as type <i>string</i> if it exists and is of the right type.

The string validation function looks like this:

```js
const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};
```

The function is a so-called [type guard](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates). That means it is a function which returns a boolean <i>and</i> which has a <i>type predicate</i> as the return type. In our case, the type predicate is:

```js
text is string
```

The general form of a type predicate is _parameterName is Type_ where the _parameterName_ is the name of the function parameter and _Type_ is the targeted type.

If the type guard function returns true, the TypeScript compiler knows that the tested variable has the type that was defined in the type predicate.

Before the type guard is called, the actual type of the variable <i>comment</i> is not known:

![](../../images/9/28e-21.png)

But after the call, if the code proceeds past the exception (that is, the type guard returned true), then the compiler knows that <i>comment</i> is of type <i>string</i>:

![](../../images/9/29e-21.png)

Why do we have two conditions in the string type guard?

```js
const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String; // highlight-line
}
```

Would it not be enough to write the guard like this?

```js
const isString = (text: unknown): text is string => {
  return typeof text === 'string';
}
```

Most likely, the simpler form is good enough for all practical purposes.
However, if we want to be absolutely sure, both conditions are needed.
There are two different ways to create string objects in JavaScript which both work a bit differently with respect to the <i>typeof</i> and <i>instanceof</i> operators:

```js
const a = "I'm a string primitive";
const b = new String("I'm a String Object");
typeof a; --> returns 'string'
typeof b; --> returns 'object'
a instanceof String; --> returns false
b instanceof String; --> returns true
```

However, it is unlikely that anyone would create a string with a constructor function.
Most likely the simpler version of the type guard would be just fine.

Next, let's consider the <i>date</i> field.
Parsing and validating the date object is pretty similar to what we did with comments.
Since TypeScript doesn't really know a type for a date, we need to treat it as a <i>string</i>.
We should however still use JavaScript-level validation to check whether the date format is acceptable.

We will add the following functions:

```js
const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
      throw new Error('Incorrect or missing date: ' + date);
  }
  return date;
};
```

The code is really nothing special. The only thing is that we can't use a type guard here since a date in this case is only considered to be a <i>string</i>.
Note that even though the <i>parseDate</i> function accepts the <i>date</i> variable as unknown, after we check the type with <i>isString</i>, then its type is set as string, which is why we can give the variable to the <i>isDate</i> function requiring a string without any problems.

Finally we are ready to move on to the last two types, Weather and Visibility.

We would like the validation and parsing to work as follows:

```js
const parseWeather = (weather: unknown): Weather => {
  if (!weather || !isString(weather) || !isWeather(weather)) {
      throw new Error('Incorrect or missing weather: ' + weather);
  }
  return weather;
};
```

The question is: how can we validate that the string is of a specific form?
One possible way to write the type guard would be this:

```js
const isWeather = (str: string): str is Weather => {
  return ['sunny', 'rainy', 'cloudy', 'stormy'].includes(str);
};
```

This would work just fine, but the problem is that the list of possible values for Weather does not necessarily stay in sync with the type definitions if the type is altered.
This is most certainly not good, since we would like to have just one source for all possible weather types.

In our case, a better solution would be to improve the actual Weather type. Instead of a type alias we should use the TypeScript [enum](https://www.typescriptlang.org/docs/handbook/enums.html), which allows us to use the actual values in our code at runtime, not only in the compilation phase.

Let us redefine the type <i>Weather</i> as follows:

```js
export enum Weather {
  Sunny = 'sunny',
  Rainy = 'rainy',
  Cloudy = 'cloudy',
  Stormy = 'stormy',
  Windy = 'windy',
}
```

Now we can check that a string is one of the accepted values, and the type guard can be written like this:

```js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isWeather = (param: any): param is Weather => {
  return Object.values(Weather).includes(param);
};
```

One thing to notice here is that we have changed the parameter type to <i>any</i>. If it were string, the <i>includes</i> check would not compile. This makes sense also if you consider the reusability of the function. By allowing <i>any</i> as a parameter, the function can be used with confidence knowing that whatever we might feed to it, the function always tells us whether the variable is a valid weather or not.

The function <i>parseWeather</i> can be simplified a bit:

```js
const parseWeather = (weather: unknown): Weather => {
  if (!weather || !isWeather(weather)) { // highlight-line
      throw new Error('Incorrect or missing weather: ' + weather);
  }
  return weather;
};
```

One issue arises after these changes. Our data does not conform to our types anymore:

![](../../images/9/30.png)

This is because we cannot just assume a string is an enum.

We can fix this by mapping the initial data elements to <i>DiaryEntry</i> type with the <i>toNewDiaryEntry</i> function:

```js
import { DiaryEntry } from "../src/types";
import toNewDiaryEntry from "../src/utils";

const data = [
  {
      "id": 1,
      "date": "2017-01-01",
      "weather": "rainy",
      "visibility": "poor",
      "comment": "Pretty scary flight, I'm glad I'm alive"
  },
  // ...
]

const diaryEntries: DiaryEntry [] = data.map(obj => {
  const object = toNewDiaryEntry(obj) as DiaryEntry;
  object.id = obj.id;
  return object;
});

export default diaryEntries;
```
Note that since <i>toNewDiaryEntry</i> returns an object of type <i>NewDiaryEntry</i>, we need to assert it to be <i>DiaryEntry</i> with the [as](http://www.typescriptlang.org/docs/handbook/basic-types.html#type-assertions) operator.


Enums are typically used when there is a set of predetermined values that are not expected to change in the future. Usually enums are used for much tighter unchanging values (for example, weekdays, months, cardinal directions), but since they offer us a great way to validate our incoming values, we might as well use them in our case.

We still need to give the same treatment to <i>visibility</i>. The enum looks as follows:

```js
export enum Visibility {
  Great = 'great',
  Good = 'good',
  Ok = 'ok',
  Poor = 'poor',
}
```

The type guard and the parser are below:

```js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isVisibility = (param: any): param is Visibility => {
  return Object.values(Visibility).includes(param);
};

const parseVisibility = (visibility: unknown): Visibility => {
  if (!visibility || !isVisibility(visibility)) {
      throw new Error('Incorrect or missing visibility: ' + visibility);
  }
  return visibility;
};
```

And finally, we can finalize the  <i>toNewDiaryEntry</i> function that takes care of validating and parsing the fields of the post data. There is however one more thing to take care of. If we try to access the fields of the parameter <i>object</i> as follows:

```js
const toNewDiaryEntry = (object: unknown): NewDiaryEntry => {
  const newEntry: NewDiaryEntry = {
    comment: parseComment(object.comment),
    date: parseDate(object.date),
    weather: parseWeather(object.weather),
    visibility: parseVisibility(object.visibility)
  };

  return newEntry;
};
```

we notice that the code does not compile. This is due to the fact that the [unknown](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#new-unknown-top-type) type does not allow any operations, so accessing the fields is not possible. 

We can fix this by destructuring the fields to variables of the type unknown as follows:

```js
type Fields = { comment: unknown, date: unknown, weather: unknown, visibility: unknown };

const toNewDiaryEntry = ({ comment, date, weather, visibility } : Fields): NewDiaryEntry => {
  const newEntry: NewDiaryEntry = {
    comment: parseComment(comment),
    date: parseDate(date),
    weather: parseWeather(weather),
    visibility: parseVisibility(visibility)
  };

  return newEntry;
};
```

The first version of our flight diary application is now complete!

The other option to bypass the problem would be to use the type <i>any</i> for the parameter and disable the lint rule for that line:

```js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toNewDiaryEntry = (object: any): NewDiaryEntry => {
  const newEntry: NewDiaryEntry = {
    comment: parseComment(object.comment),
    date: parseDate(object.date),
    weather: parseWeather(object.weather),
    visibility: parseVisibility(object.visibility)
  };

  return newEntry;
};
```

If we now try to create a new diary entry with invalid or missing fields, we are getting an appropriate error message:

![](../../images/9/30b.png)

The source code of the application can be found on [GitHub](https://github.com/FullStack-HY/flight-diary).

</div>

<div class="tasks">

### Exercises 9.12.-9.13.

#### 9.12: Patientor backend, step5

Create a POST endpoint <i>/api/patients</i> for adding patients. Ensure that you can add patients also from the frontend. You can create unique ids of type <i>string</i> using the [uuid](https://github.com/uuidjs/uuid) library:

```js
import {v1 as uuid} from 'uuid'
const id = uuid()
```

#### 9.13: Patientor backend, step6

Set up safe parsing, validation and type guards to the POST <i>/api/patients</i> request.

Refactor the <i>gender</i> field to use an [enum type](http://www.typescriptlang.org/docs/handbook/enums.html).

</div>
