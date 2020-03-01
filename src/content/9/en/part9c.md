---
mainImage: ../../../images/part-8.svg
part: 9
letter: c
lang: en
---

<div class="content">

Now that we have a basic understanding of how TypeScript works and of how to create actual projects with it, it is time to start creating something actually useful. So now we're going to create a completely new project, with a bit more realistic use cases in mind.

One major change from the previous part is that **we're not going to use ts-node anymore**. ts-node is a handy tool, with which it is very easy to get started, but in the long run it is suggested to use the official TypeScript compiler that comes with the _typescript_ npm-package. With this compiler the basic JavaScript files are generated and packaged from the .ts files so that the built <i>production version</i> of the project won't contain any TypeScript code. This is exactly what is aimed for in the end, since TypeScript in itself is not runnable by browsers or Node.

### Setting up the project

Our project is created for Ilari, who loves riding small planes but has a bit of difficulties managing his flight history. He is quite the coder himself, so he doesn't necessarily need a user interface for his flight records, but he'd like to use the software with HTTP-requests so that the possibility to extend the application to also include a web-based user interface is maintained.

Let's start creating our own first real project 'Ilari's flight diaries', as we usually would by running _npm init_ and by installing the _typescript_ package. 

TypeScript's native _tsc_ compiler offers us help initialising our project with the command _tsc --init_. To be able to run this, we need to add the _tsc_ command to runnable scripts in the package.json file if we don't have _typescript_ installed globally. And even if you would have typescript installed globally, you should always include the package as a dev-dependency in your project.

```
  "scripts": {
    "tsc": "tsc"
    ...
```

 Very often the bare _tsc_ command is set up in the project scripts for other scripts to use, so it is very common to see the  _tsc_ command set up within the project like this.

 Now we can init our tsconfig.json settings by running:


 _``
 npm run tsc -- --init
 _``
 

 **Notice the extra -- before the actual argument**, arguments before the -- are interpreted for the command _npm_ abd after are for the command that is run throught the package.json scripts. 

The created tsconfig.json contains a pretty big list of all of the possible configurations available to use with only a few uncommented ones. Studying the initial tsconfig.json file might be useful to find something you might be needing and it is completely okay to not delete the commented rows in the file just in case you might someday need to expand your configuration settings. 

Right now the preferred settings we want right now are the following:

```json
{
  "compilerOptions": {
    "target": "ES6",
    "outDir": "./build/",   
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,       
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true
  }
}
```

Let's go through each setting now: 

The <i>target</i> parameter informs the compiler into which ECMAScript version the generated JavaScript should be generated into. ES6 is supported by most browsers and therefore is a good and pretty safe option.

<i>outDir</i> tells where the compiled result should be placed.

<i>strict</i> is actually a shorthand to include multiple separate options: 
<i>noImplicitAny, noImplicitThis, alwaysStrict, strictBindCallApply, strictNullChecks, strictFunctionTypes and strictPropertyInitialization</i>. These all guide our coding style use TypeScript features more strictly, <i>noImplicitAny</i> restricts implicit setting for any, which happens for example if you don't type the expected variables of a function. The rest of the options can all be studied more closely on the [tsconfig documentation](https://www.typescriptlang.org/v2/en/tsconfig#strict). Using <i>strict</i> is suggested by the official documentation.

<i>noUnusedLocals</i> gives an error if a local variable is unused and </i>noUnusedParameters</i> when on unused parameters. 

<i>noFallthroughCasesInSwitch</i> gives an error if a _switch - case_ is used without a fallthrough possibility (falling to a case does not _return_ or _break_ the evaluation of the switch).

<i>esModuleInterop</i> allows interaperability between commonJS and ES Modules, see more [in documentation](https://www.typescriptlang.org/v2/en/tsconfig#esModuleInterop).

Now that we have our preferred configuration set, let's continue by installing _express_ and of course also _@types/express_. Since this is a real project, which is intended to be grown over time, it might be useful to use eslint from the beginning, so that no extra refactoring or rewriting is needed later on if these are added afterwards. We should also put So let's also install _eslint_, _@typescript-eslint/eslint-plugin_ and _@typescript-eslint/parser_.

```sh
npm install express
npm install --save-dev @types/express @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

Now our _package.json_ should look something like this: 

```json
{
  "name": "ilaris-flight-diaries",
  "version": "1.0.0",
  "description": "",
  "main": "index.ts",
  "scripts": {
    "tsc": "tsc",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.17.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.2",
    "@typescript-eslint/eslint-plugin": "^2.17.0",
    "@typescript-eslint/parser": "^2.17.0",
    "eslint": "^6.8.0",
    "typescript": "^3.7.5"
  }
}
```

We should also create _.eslintrc_ with the following content:

```json
{
  "env": {
    "browser": true,
    "node": true
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 11,
    "sourceType": "module",
    "project": "./tsconfig.json",
    "createDefaultProgram": true
  },
  "plugins": ["@typescript-eslint"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
 "rules": {
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/no-unused-vars": [
        "error", { "argsIgnorePattern": "^_" }
    ],
    "no-case-declarations": 0
  }
}
```

Now we only need to set up our development environment properly, and then we are ready to start writing some serious code. There are many different options and we could use the familiar _nodemon_ with _ts-node_, but as we saw before, _ts-node-dev_ does the exact same thing and we can continue using it. So, let's install _ts-node-dev_ and we are ready to start developing. 

```sh
npm install --save-dev ts-node-dev
```

**Sidenote:** When deciding on what packages to use, a [npmtrends](https://npmtrends.com) is a good place to compare the popularity and growth of different npm packages. When [comparing](https://www.npmtrends.com/nodemon-vs-ts-node-dev-vs-ts-node) the use of _ts-node-dev_ and both _nodemon_ and _ts-node_  we can see that the popularity of ts-node-dev is not nearly as popular as using nodemon and ts-dev, so the safer choice might be to just go with the other choice. Now let's still give _ts-node-dev_ a chance and use it in these exercises.


There sure is a lot of stuff to go through before you can even start the actual coding. When in a real project, careful preparations support your development process to a great length, so take the time to create a good setting for yourself / your team and in the long run everything will be much smoother. 

### Let there be code

Now we can finally start coding! As before, let's start out by creating our first ping-endpoint, just to make sure everything is working.

The contents of the root _index.ts_ file:

```js
import express from 'express';
const app = express();
app.use(express.json());

const PORT = 3000;

app.get('/ping', (req, res) => {
    console.log('someone pinged here');
    res.send('pong');
  });
  
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

```

And since we haven't yet set up the development script that uses the ts-node-dev, now is the correct time to add it:

```json
{
  // ..
  "scripts": {
    "tsc": "tsc",
    "dev": "ts-node-dev index.ts" // highlight-line
  },
  // ..
}

```
Now we could run the _npm run dev_, but wait, a problem arises! 

```sh
index.ts:7:19 - error TS6133: 'req' is declared but its value is never read.

7 app.get('/ping', (req, res) => {
                    ~~~
Found 1 error.

```

So our stricter than before tsconfig options don't allow us to keep unused variables within the code while making a production build. This comes problematic when we have library-wide predefined functions, that like in this case require declaring a variable, even though in the code it is not necessarily required to use at all. Fortunately this issue has already been solved on configuration level and once again hovering on the issue gives us a solution for the problem, this time by clicking the quick fix button: 

![](../../images/9/14.png)

If it is absolutely impossible to get rid of an unused variable, you should prefix it with an underscore to inform the compiler that this has been taken into considearation and there is nothing we can do. So only use the underscore prefix if there's no other way to proceed. In this case, let's rename the _req_ variable to __req_ and we can continue with our development.

Now by running _npm run dev_ we should be able to run and curl our _/ping_ endpoint.

Now when we can see the happy _pong_, we should try creating our first production build. Now that we have defined the _outdir_ in our tsconfig.json, there's nothing else really to do, but running _npm run tsc_.

Just like magic a native runnable JavaScript production build of the ping-pong express backend is created into the build folder.

Now our eslint also tries to interpret the files in the _build_ folder, which we don't want, as this is compiler generated code. This can easily be prevented by creating a file _.eslintignore_ in your project's root with the content you want eslint to ignore, exactly as in _.gitignore_.

Let's try our project by creating production run command for the project:

```json
"scripts": {
  "start": "node build/index.js"
  ...
}
```

and run _npm start_ and then try to curl our defined port:

![](../../images/9/15.png)

IT WORKS!

Now we have a minimal working pipeline, with which we can develop our project, with a lot of help from our compiler and eslint in maintaining a good code quality. With this base we can actually start creating an app which we could proudly deploy into a production environment. 

</div>


<div class="tasks">

### Exercises

**Before you start the exercises**

For this set of exercises you will be developing a backend for an existing project called Diagnoses. Diagnoses is a simple medical record application for the use doctors that handles patient information, diagnoses and basic health information of the patients.

The frontend has already been built by outsider experts and you're task is to create a backend to support the existing code.

**Notice:** From now on you will be working with existing codebase and sometimes it is expected that you use your own skills to find the relevant files and and configurations to proceed in the exercises.

**Notice 2:** You will be extending the frontend later on so it is suggested that you fork the repository already now.


**Notice 3:** Code quality is extremely important, so take extra good care of that your code is *readable* and that it can be *easily shared* and by this, you need to end up with a result that is *production ready*, so that the built version of the project is working, and no extra dependencies are included in the end result.

#### 9.10

Initialise a buildable project template called _Diagnoses-backend_ that will be used by the frontend. Configure eslint and tsconfig to include the following contents:

.eslintrc
```json
{
  "env": {
    "browser": true,
    "node": true
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 11,
    "sourceType": "module",
    "project": "./tsconfig.json",
    "createDefaultProgram": true
  },
  "plugins": ["@typescript-eslint"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
    "rules": {
        "@typescript-eslint/explicit-function-return-type": 0,
        "@typescript-eslint/no-unused-vars": [
            "error", { "argsIgnorePattern": "^_" }
        ],
        "no-case-declarations": 0
  }
}
```
tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES6",
    "outDir": "./build/",   
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,       
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true
  }
}
```

You should also configure auto-reloading using either _ts-config-dev_ or _nodemon_.

#### 9.11

Fork and clone the project [Diagnoses-frontend](https://github.com/TuukkaP/fsopen-frontend). With the help of the README-file start the project. You should be able to use the frontend without a functioning backend.

#### 9.12

Set up a _/ping_ endpoint and make sure that when you run your backend and frontend simultaniously, the frontend can reach the backend and get a response from the endpoint.

Also set up the build script, so that you can create a production version of the project and make sure that it is runnable too, i.e. answers to the frontend's ping.

****

Since this week already has lots of things to focus on, databases will not be one of them, and all backend functions will use a predefined set of data, so no database connections need to be made.

The data used in this part consists of two files: [diagnoses.json](https://github.com/fullstack-hy2020/misc/blob/master/diagnoses.json) and [patientdata.json](https://github.com/fullstack-hy2020/misc/blob/master/patientdata.json). You should download the data and put it into a folder called _data_. All data modification can be done in runtime memory, so during this week it is *never necessary to write to a file*.


</div>

<div class="content">
</div>


<div class="tasks">

### Exercises

</div>

<div class="content">
</div>


<div class="tasks">

### Exercises

</div>

<div class="content">
</div>


<div class="tasks">

### Exercises

</div>

<div class="content">
</div>


<div class="tasks">

### Exercises

</div>