---
mainImage: ../../../images/part-9.svg
part: 9
letter: d
lang: zh
---

<div class="content">

<!-- Before we start delving into how you can use TypeScript with React, we should first have a look at what we want to achieve. When everything works as it should, TypeScript will help us catch the following errors:-->
在我们开始深入研究如何将TypeScript与React结合使用之前，我们应该先看看我们想要达成的目标。当一切都按预期运行时，TypeScript将会帮助我们捕捉以下错误：

<!-- - Trying to pass an extra/unwanted prop to a component-->
尝试向组件传递额外/不需要的prop
<!-- - Forgetting to pass a required prop to a component-->
**忘记向组件传递一个必需的prop**
<!-- - Passing a prop with the wrong type to a component-->
传递一个类型错误的prop到组件

<!-- If we make any of these errors, TypeScript can help us catch them in our editor right away.-->
如果我们犯了任何这些错误，TypeScript 就可以帮助我们在编辑器中立即捕获它们。
<!-- If we didn''t use TypeScript, we would have to catch these errors later during testing.-->
如果我们不使用TypeScript，我们将不得不在测试过程中稍后捕获这些错误。
<!-- We might be forced to do some tedious debugging to find the cause of the errors.-->
我们可能被迫做一些乏味的调试来找出错误的原因。

<!-- That's enough reasoning for now. Let's start getting our hands dirty!-->
好了，现在讲到这里就够了，让我们开始动手吧！

### Create React App with TypeScript

<!-- We can use [create-react-app](https://create-react-app.dev) to create a TypeScript app by adding a-->
few flags

我们可以通过[create-react-app](https://create-react-app.dev)添加几个标志来创建一个TypeScript应用程序。
<i>template</i> argument to the initialization script. So in order to create a TypeScript Create React App, run the following command:

```shell
npx create-react-app my-app --template typescript
```

<!-- After running the command, you should have a complete basic React app that uses TypeScript.-->
在运行命令之后，您应该有一个使用TypeScript的完整的基本React应用程序。
<!-- You can start the app by running *npm start* in the application''s root.-->
你可以在应用程序的根目录下运行*npm start*来启动应用。

<!-- If you take a look at the files and folders, you''ll notice that the app is not that different from-->
other apps.

如果你看一下这些文件和文件夹，你会发现这个应用程序跟其他应用程序并没有太大的不同。
<!-- one using pure JavaScript. The only differences are that the <i>.js</i> and <i>.jsx</i> files are now  <i>.ts</i> and <i>.tsx</i> files, they contain some type annotations, and the root directory contains a <i>tsconfig.json</i> file.-->
使用纯JavaScript，唯一的区别是<i>.js</i> 和 <i>.jsx</i> 文件现在是<i>.ts</i> 和 <i>.tsx</i> 文件，它们包含一些类型注释，根目录包含一个<i>tsconfig.json</i> 文件。

<!-- Now, let''s take a look at the <i>tsconfig.json</i> file that has been created for us:-->
现在，让我们来看看为我们创建的<i>tsconfig.json</i>文件：

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

<!-- Notice *compilerOptions* now has the key [lib](https://www.typescriptlang.org/tsconfig#lib) that includes "type definitions for things found in browser environments (like *document*)."-->
**通知** *compilerOptions* 现在具有键 [lib](https://www.typescriptlang.org/tsconfig#lib)，其中包括“浏览器环境中发现的东西的类型定义（如*document*）。

<!-- Everything else should be more or less fine except that, at the moment, the configuration allows compiling JavaScript files because *allowJs* is set to *true*.-->
除此之外，其他的应该都比较正常，但目前，由于`allowJs`被设置为`true`，配置允许编译JavaScript文件。
<!-- That would be fine if you need to mix TypeScript and JavaScript (e.g. if you are in the process of transforming a JavaScript project into TypeScript or something like that), but we want to create a pure TypeScript app, so let''s change that configuration to *false*.-->
如果你需要混合TypeScript和JavaScript（例如，如果你正在将一个JavaScript项目转换为TypeScript或类似的东西），那将是很好的，但我们想要创建一个纯TypeScript应用程序，所以让我们将该配置更改为* false *。

<!-- In our previous project, we used ESlint to help us enforce a coding style, and we''ll do the same with this app. We do not need to install any dependencies, since create-react-app has taken care of that already.-->
在我们之前的项目中，我们使用ESLint来帮助我们强制执行编码风格，本应用也会这么做。我们不需要安装任何依赖项，因为create-react-app已经处理好了。

<!-- We configure ESlint in <i>.eslintrc</i> with the following settings:-->
我们在<i>.eslintrc</i>中使用以下设置配置ESlint：

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

<!-- Since the return type of most React components is generally either *JSX.Element* or *null*, we have loosened up the default linting rules a bit by disabling the rules [explicit-function-return-type](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/explicit-function-return-type.md) and [explicit-module-boundary-types](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/explicit-module-boundary-types.md).-->
由于大多数 React 组件的返回类型通常是 *JSX.Element* 或 *null*，我们已经放宽了默认的 linting 规则，通过禁用[explicit-function-return-type](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/explicit-function-return-type.md)和[explicit-module-boundary-types](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/explicit-module-boundary-types.md)规则来实现。
<!-- Now we don''t need to explicitly state our function return types everywhere. We will also disable [react/react-in-jsx-scope](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/react-in-jsx-scope.md) since importing React is [no longer needed](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html) in every file.-->
现在我们不需要在每个地方都明确声明函数的返回类型。由于[不再需要](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)在每个文件中导入React，我们也将禁用[react/react-in-jsx-scope](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/react-in-jsx-scope.md)。

<!-- Next, we need to get our linting script to parse <i>*.tsx </i> files, which are the TypeScript equivalent of React''s JSX files.-->
下一步，我们需要让我们的 linting 脚本解析 <i>*.tsx </i> 档案，它们是 TypeScript 的 React 的 JSX 档案的等价物。
<!-- We can do that by altering our lint command in <i>package.json</i> to the following:-->
我们可以通过更改<i>package.json</i>中的lint命令来实现：

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

<!-- If you are using Windows, you may need to use double quotes for the linting path:-->
如果你正在使用Windows，你可能需要使用双引号来为linting路径：

```json
"lint": "eslint \"./src/**/*.{ts,tsx}\""
```

### React components with TypeScript

<!-- Let us consider the following JavaScript React example:-->
让我们来看看以下JavaScript React示例：

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

<!-- In this example, we have a component called *Welcome* to which we pass a *name* as a prop. It then renders the name to the screen.  We know that the *name* should be a string, and we use the [prop-types](https://www.npmjs.com/package/prop-types) package introduced in [part 5](/en/part5/props_children_and_proptypes#prop-types) to receive hints about the desired types of a component''s props and warnings about invalid prop types.-->
在这个例子中，我们有一个叫做*Welcome*的组件，我们向它传递一个*name*作为prop。然后它将name渲染到屏幕上。我们知道*name*应该是一个字符串，我们使用在[第五部分](/en/part5/props_children_and_proptypes#prop-types)中介绍的[prop-types](https://www.npmjs.com/package/prop-types)包来获得有关组件prop期望类型的提示和有关无效prop类型的警告。

<!-- With TypeScript, we don''t need the <i>prop-types</i> package anymore. We can define the types with the help of TypeScript just like we define types for a regular function as React components are nothing but mere functions. We will use an interface for the parameter types (i.e., props) and *JSX.Element* as the return type for any react component:-->
随着TypeScript的出现，我们不再需要<i>prop-types</i> 这个包了。我们可以像定义普通函数类型一样，用TypeScript定义React组件类型。我们将使用接口来定义参数类型（即props），以及*JSX.Element*作为任何React组件的返回类型：

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

<!-- We defined a new type, *WelcomeProps*, and passed it to the function''s parameter types.-->
我们定义了一个新类型，*WelcomeProps*，并将其传递给函数的参数类型。

```jsx
const Welcome = (props: WelcomeProps): JSX.Element => {
```

<!-- You could write the same thing using a more verbose syntax:-->
你可以使用更加冗长的句法来写同样的东西：

```jsx
const Welcome = ({ name }: { name: string }): JSX.Element => (
  <h1>Hello, {name}</h1>
);
```

<!-- Now our editor knows that the *name* prop is a string.-->
现在我们的编辑知道*name* prop 是一个字符串。

<!-- There is actually no need to define the return type of a React component since the TypeScript compiler infers the type automatically, and we can just write-->
the code without specifying the return type.

实际上，由于TypeScript编译器会自动推断类型，因此无需定义React组件的返回类型，我们可以在不指定返回类型的情况下编写代码。

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

<!-- You probably noticed that we used a [type assertion](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions) for the return value of the function *document.getElementById*-->
你可能已经注意到，我们为函数*document.getElementById*的返回值使用了[类型断言](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions)。

```ts
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(  // highlight-line
  <Welcome name="Sarah" />
)
```

<!-- We need to do this since the *ReactDOM.createRoot* takes an HTMLElement as a parameter but the return value of function *document.getElementById* has the following type-->
:

我们需要这样做，因为*ReactDOM.createRoot*需要一个HTMLElement作为参数，但是函数*document.getElementById*的返回值的类型是：

```js
HTMLElement | null
```

<!-- since if the function does not find the searched element, it will return null.-->
若函数没有找到被搜索的元素，它将返回null。

<!-- Earlier in this part we [warned](https://fullstackopen.com/en/part9/first_steps_with_type_script#type-assertion) about the dangers of type assertions, but in our case the assertion is ok since we are sure that the file <i>index.html</i> indeed has this particular id and the function is always returning a HTMLElement.-->
在本部分的早些时候，我们[警告](https://fullstackopen.com/en/part9/first_steps_with_type_script#type-assertion)关于类型断言的危险，但是在我们的例子中，断言是可以的，因为我们确信文件<i>index.html</i>确实具有这个特定的id，而且该函数总是返回一个HTMLElement。

</div>

<div class="tasks">

### Exercise 9.14

#### 9.14

<!-- Create a new Create React App with TypeScript, and set up ESlint for the project similarly to how we just did.-->
创建一个新的带有TypeScript的Create React App，并像我们刚才做的那样为该项目设置ESLint。

<!-- This exercise is similar to the one you have already done in [Part 1](/en/part1/java_script#exercises-1-3-1-5) of the course, but with TypeScript and some extra tweaks. Start off by modifying the contents of <i>index.tsx</i> to the following:-->
这个练习与课程[第一部分](/en/part1/java_script#exercises-1-3-1-5)中你已经完成的练习类似，但使用TypeScript并做了一些额外的调整。首先，将<i>index.tsx</i>的内容修改为以下内容：

```jsx
import ReactDOM from 'react-dom/client'
import App from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <App />
)
```

<!-- and <i>App.tsx</i> to the following:-->
# App.tsx

```
App.tsx
```

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

<!-- and remove the unnecessary files.-->
# 移除不必要的文件

移除不必要的文件是一项重要的任务，可以确保系统的有效运行。定期清理系统可以帮助提高系统的性能，减少系统可能出现的问题。清理系统时，最好先备份重要的文件，然后再删除不必要的文件。

<!-- The whole app is now in one component. That is not what we want, so refactor the code so that it consists of three components: *Header*,  *Content* and *Total*. All data is still kept in the *App* component, which passes all necessary data to each component as props. <i>Be sure to add type declarations for each component''s props!</i>-->
整个应用现在只有一个组件。这不是我们想要的，所以重构代码，使其由三个组件组成：*Header*、*Content* 和 *Total*。所有数据仍然保留在*App*组件中，它将所有必要的数据作为props传递给每个组件。<i>务必为每个组件的props添加类型声明！</i>

<!-- The *Header* component should take care of rendering the name of the course. *Content* should render the names of the different parts and the number of exercises in each part, and *Total* should render the total sum of exercises in all parts.-->
# 组件*Header*应该负责渲染课程的名称。*Content*应该渲染不同部分的名称以及每个部分的练习数量，而*Total*应该渲染所有部分练习总数。

<!-- The *App* component should look somewhat like this:-->
*应用*组件应该看起来有点像这样：

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

<!-- In the previous exercise, we had three parts of a course, and all parts had the same attributes *name* and *exerciseCount*. But what if we needed additional attributes for the parts where all parts do not have the same attributes? How would this look, codewise? Let''s consider the following example:-->
在前一个练习中，我们有三个课程的部分，所有部分都具有相同的属性*名称*和*练习计数*。但是，如果我们需要为所有部分都不相同属性的部分添加额外属性时，代码会是什么样子？让我们考虑以下示例：

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
    backgroundMaterial: "https://type-level-typescript.com/template-literal-types"
  },
];
```

<!-- In the above example, we have added some additional attributes to each course part.-->
在上面的例子中，我们给每个课程部分添加了一些额外的属性。
<!-- Each part has the *name* and *exerciseCount* attributes, but the first, the third  and fourth also have an attribute called *description*, and the second and fourth parts also have some distinct additional attributes.-->
每部分都有*name*和*exerciseCount*属性，但是第一、第三和第四部分还有一个叫做*description*的属性，而第二和第四部分还有一些不同的附加属性。

<!-- Let''s imagine that our application just keeps on growing, and we need to pass the different course parts around in our code. On top of that, there are also additional attributes and course parts added to the mix. How can we know that our code is capable of handling all the different types of data correctly, and we are not for example forgetting to render a new course part on some page? This is where TypeScript comes in handy!-->
让我们想象一下，我们的应用程序不断增长，我们需要在代码中传递不同的课程部分。此外，还添加了其他属性和课程部分。我们怎么知道我们的代码能够正确处理所有不同类型的数据，而不是例如忘记在某些页面上渲染新课程部分？这就是TypeScript发挥作用的地方！

<!-- Let''s start by defining types for our different course parts. We notice that the first and third have the same set of attributes. The second and fourth are a bit different so we have three different kinds of course part elements.-->
让我们从定义我们不同课程部分的类型开始。我们注意到第一和第三有相同的属性集。第二和第四有点不同，所以我们有三种不同类型的课程部分元素。

<!-- So let us define a type for each of the different kind of course parts:-->
所以让我们为不同类型的课程部分定义一种类型：

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

interface CoursePartBackground {
  name: string;
  exerciseCount: number;
  description: string;
  backgroundMaterial: string;
  kind: "background"
}
```

<!-- Besides the attributes that are found in the various course parts, we have now introduced an additional attribute called <i>kind</i> that has a [literal](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types) type, it is a "hard coded" string, distinct for each course part. We shall soon see where the attribute kind is used!-->
除了在各个课程部分中发现的属性之外，我们现在引入了一个名为<i>kind</i>的附加属性，它具有[文字](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types)类型，它是一个“硬编码”的字符串，每个课程部分都是不同的。我们很快就会看到属性kind的用途！

<!-- Next, we will create a type [union](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types) of all these types. We can then use it to define a type for our array, which should accept any of these course part types:-->
接下来，我们将创建一种[联合](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)类型的所有这些类型。然后，我们可以使用它来为我们的数组定义一种类型，它应该接受以下任何课程部分类型：

```js
type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground;
```

<!-- Now we can set the type for our *courseParts* variable:-->
现在我们可以为我们的*courseParts*变量设置类型：

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
      backgroundMaterial: "https://type-level-typescript.com/template-literal-types",
      kind: "background" // highlight-line
    },
  ]

  // ...
}
```

<!-- Note that we have now added the attribute *kind* with a proper value to each element of the array.-->
注意，我们现在已经为数组的每个元素添加了带有适当值的属性*kind*。

<!-- Our editor will automatically warn us if we use the wrong type for an attribute, use an extra attribute, or forget to set an expected attribute. If we eg. try to add the following to the array-->
:

我们的编辑器会自动警告我们，如果我们使用错误的类型为属性，使用额外的属性，或忘记设置预期的属性。如果我们例如试图添加以下到数组：

```js
{
  name: "TypeScript in frontend",
  exerciseCount: 10,
  kind: "basic",
},
```

<!-- We will immediately see an error in the editor:-->
我们将立即在编辑器中看到一个错误：

![vscode exerciseCoutn not assignable to type CoursePart - description missing](../../images/9/63new.png)

<!-- Since our new entry has the attribute *kind* with value *"basic"* TypeScript knows that the entry does not only have the type *CoursePart* but it is actually meant to be a *CoursePartBasic*. So here the attribute *kind* "narrows" the type of the entry from a more general to a more specific type that has a certain set of attributes. We shall soon see this style of type narrowing in action in the code!-->
因为我们的新项目有属性*kind*，值为*"basic"*，TypeScript知道该项目不仅具有类型*CoursePart*，而且它实际上应该是一个*CoursePartBasic*。因此，属性*kind*将条目的类型从更一般的类型窄化为具有一定属性集的更具体的类型。我们很快就会在代码中看到这种类型窄化的风格！

<!-- But we''re not satisfied yet! There is still a lot of duplication in our types, and we want to avoid that. We start by identifying the attributes all course parts have in common, and defining a base type that contains them. Then we will [extend](https://www.typescriptlang.org/docs/handbook/2/objects.html#extending-types) that base type to create our kind-specific types:-->
但我们还不满意！我们的类型中仍然有很多重复，我们想避免这种情况。我们首先确定所有课程部分具有的属性，并定义一个包含它们的基本类型。然后，我们将[扩展](https://www.typescriptlang.org/docs/handbook/2/objects.html#extending-types)该基本类型以创建我们特定类型的类型：

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

interface CoursePartBackground extends CoursePartBase {
  description: string;
  backgroundMaterial: string;
  kind: "background"
}

type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground;
```

### More type narrowing

<!-- How should we now use these types in our components?-->
怎么样现在我们在组件中使用这些类型？

<!-- If we try to access the objects in the array *courseParts: CoursePart[]* we notice that it is possible to only access the attributes that are common to all the types in the union:-->
如果我们尝试访问数组*courseParts：CoursePart []*中的对象，我们会注意到只能访问联合中所有类型共有的属性：

![vscode showing part.exerciseCou](../../images/9/65new.png)

<!-- And indeed, the TypeScript [documentation](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#working-with-union-types) says this:-->
而且，TypeScript [文档](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#working-with-union-types) 也是这么说的：

<!-- > <i>TypeScript will only allow an operation (or attribute access) if it is valid for every member of the union.</i>-->
> <i>TypeScript 只有在操作（或属性访问）对联合中的每个成员都有效时才允许。</i>

<!-- The documentation also mentions the following:-->
文档还提到：

<!-- > <i>The solution is to narrow the union with code... Narrowing occurs when TypeScript can deduce a more specific type for a value based on the structure of the code.</i>-->
> <i>解决方案是通过代码缩小联盟... 缩小发生时，TypeScript可以根据代码的结构推断出更具体的值类型。</i>

<!-- So once again the [type narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) is the rescue!-->
所以，[类型缩小](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)又一次拯救了我们！

<!-- One handy way to narrow these kinds of types in TypeScript is to use *switch case* expressions. Once TypeScript has inferred that a variable is of union type and that each type in the union contain a certain literal attribute (in our case *kind*), we can use that as a type identifier. We can then build a switch case around that attribute and TypeScript will know which attributes are available within each case block:-->
一个方便的方法来缩小这种类型在TypeScript中是使用*switch case*表达式。一旦TypeScript推断出一个变量是联合类型，并且联合中的每个类型包含一个特定的文字属性（在我们的例子中是*kind*），我们可以将其作为类型标识符。然后我们可以在该属性周围构建一个switch case，TypeScript将知道每个case块中可用的属性：

![vscode showing part. and then the attributes](../../images/9/64new.png)

<!-- In the above example, TypeScript knows that a *part* has the type *CoursePart* and it can then infer that *part* is of either type *CoursePartBasic*, *CoursePartGroup* or *CoursePartBackground* based on the value of the attribute *kind*.-->
在上面的例子中，TypeScript知道一个*部分*具有类型*CoursePart*，然后它可以根据属性*kind*的值推断*part*是*CoursePartBasic*、*CoursePartGroup*或*CoursePartBackground*中的一种。

<!-- The specific technique of type narrowing where a union type is narrowed based on literal attribute value is called [discriminated union](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions).-->
具体的类型缩小技术，即基于文字属性值缩小联合类型，被称为[鉴别联合](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions)。

<!-- Note that the narrowing can naturally be also done with *if* clause. We could eg. do the following:-->
注意，缩小范围也可以使用*if*子句来实现。例如，我们可以这样做：

```js
  courseParts.forEach(part => {
    if (part.kind === 'background') {
      console.log('see the following:', part.backgroundMaterial)
    }

    // can not refer to part.backgroundMaterial here!
  });
```

<!-- What about adding new types? If we were to add a new course part, wouldn''t it be nice to know if we had already implemented handling that type in our code? In the example above, a new type would go to the *default* block and nothing would get printed for a new type. Sometimes this is wholly acceptable. For instance, if you wanted to handle only specific (but not all) cases of a type union, having a default is fine. Nonetheless, it is recommended to handle all variations separately in most cases.-->
如果我们要添加一个新的课程部分，不知道我们已经在代码中实现了处理那种类型会不会更好？在上面的例子中，一个新类型会进入*默认*块，并且对于一个新类型不会打印任何内容。有时这是完全可以接受的。例如，如果你只想处理特定（但不是所有）类型联合的情况，有一个默认值是可以的。但是，在大多数情况下，建议单独处理所有变化。

<!-- With TypeScript, we can use a method called [exhaustive type checking](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking). Its basic principle is that if we encounter an unexpected value, we call a function that accepts a value with the type [never](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-never-type) and also has the return type *never*.-->
使用TypeScript，我们可以使用一种叫做[穷尽性类型检查](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking)的方法。它的基本原理是，如果我们遇到意外的值，就调用一个接受类型为[never](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-never-type)的值并且返回类型为*never*的函数。

<!-- A straightforward version of the function could look like this:-->
一个直接的函数版本可能如下：

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

<!-- If we now were to replace the contents of our *default* block to:-->
如果我们现在把我们的*默认*块替换为：

```js
default:
  return assertNever(part);
```

<!-- and remove the case that handles the type *CoursePartBackground*, we would see the following error:-->
如果我们删除处理类型*CoursePartBackground*的情况，我们会看到以下错误：

![vscode error Argument of Ttype CoursePart not assignable to type never](../../images/9/66new.png)

<!-- The error message says that-->
the file is corrupted

错误信息表明文件已损坏

```text
'CoursePartBackground' is not assignable to parameter of type 'never'.
```

<!-- which tells us that we are using a variable somewhere where it should never be used. This tells us that something needs to be fixed.-->
这告诉我们，我们在一个不该使用变量的地方使用了变量，这告诉我们有些东西需要修复。

</div>

<div class="tasks">

### Exercise 9.15

#### 9.15

<!-- Let us now continue extending the app created in exercise 9.14. First, add the type information and replace the variable *courseParts* with the one from the example below.-->
让我们继续扩展在练习9.14中创建的应用程序。首先，添加类型信息，并用下面的变量*courseParts*替换它。

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

interface CoursePartBackground extends CoursePartBase {
  description: string;
  backgroundMaterial: string;
  kind: "background"
}

type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground;

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
    backgroundMaterial: "https://type-level-typescript.com/template-literal-types",
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

<!-- Now we know that both interfaces *CoursePartBasic* and *CoursePartBackground* share not only the base attributes but also an attribute called *description*, which is a string in both interfaces.-->
现在我们知道，*CoursePartBasic*和*CoursePartBackground*两个接口不仅共享基本属性，还共享一个叫做*description*的属性，它在两个接口中都是一个字符串。

<!-- Your first task is to declare a new interface that includes the *description* attribute and extends the *CoursePartBase* interface. Then modify the code so that you can remove the *description* attribute from both *CoursePartBasic* and *CoursePartBackground*  without getting any errors.-->
你的第一个任务是定义一个新的接口，该接口包括*description*属性，并扩展*CoursePartBase*接口。然后修改代码，以便可以不出现任何错误的情况下从*CoursePartBasic*和*CoursePartBackground*中删除*description*属性。

<!-- Then create a component *Part* that renders all attributes of each type of course part. Use a switch case-based exhaustive type checking! Use the new component in component *Content*.-->
然后创建一个组件*Part*，渲染每种课程部分的所有属性。使用基于开关情况的详尽类型检查！在组件*Content*中使用新组件。

<!-- Lastly, add another course part interface with the following attributes: *name*, *exerciseCount*, *description* and *requirements*, the latter being a string array. The objects of this type look like the following:-->
最后，添加另一个具有以下属性的课程部分界面：*名称*，*练习次数*，*描述*和*要求*，其中后者是字符串数组。此类型的对象如下所示：

```js
{
  name: "Backend development",
  exerciseCount: 21,
  description: "Typing the backend",
  requirements: ["nodejs", "jest"],
  kind: "special"
}
```

<!-- Then add that interface to the type union *CoursePart* and add corresponding data to the *courseParts* variable. Now, if you have not modified your *Content* component correctly, you should get an error, because you have not yet added support for the fourth course part type. Do the necessary changes to *Content*, so that all attributes for the new course part also get rendered and that the compiler doesn''t produce any errors.-->
然后将该接口添加到类型联合*CoursePart*中，并将相应的数据添加到*courseParts*变量中。现在，如果您没有正确修改*Content*组件，您应该会得到一个错误，因为您尚未添加对第四个课程部分类型的支持。做必要的更改*Content*，以便渲染新课程部分的所有属性，并且编译器不会产生任何错误。

<!-- The result might look like the following:-->
结果可能如下：

![browser showing half stack application development](../../images/9/45.png)

</div>

<div class="content">

### React app with state

<!-- So far, we have only looked at an application that keeps all the data in a typed variable but does not have any state. Let us once more go back to the note app, and build a typed version of it.-->
到目前为止，我们只看了一个将所有数据都存储在类型变量中但没有任何状态的应用程序。让我们再回到笔记应用程序，构建一个类型版本。

<!-- We start with the following code:-->
我们从以下代码开始：

```js
import { useState } from 'react';

const App = () => {
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState([]);

  return null
}
```

<!-- When we hover over the *useState* calls in the editor, we notice couple of interesting things.-->
当我们在编辑器中悬停在*useState*调用上，我们注意到几件有趣的事情。

<!-- The type of the first call *useState('')* looks like the following:-->
第一次调用*useState('')*的类型看起来像下面这样：

```ts
useState<string>(initialState: string | (() => string)):
  [string, React.Dispatch<React.SetStateAction<string>>]
```

<!-- The type is somewhat challenging to decipher. It has the following "form":-->
这种类型有点难以解读。它有以下“形式”：

```ts
functionName(parameters): return_value
```

<!-- So we notice that TypeScript compiler has inferred that the initial state is either a string or a function that returns a string:-->
因此，我们注意到TypeScript编译器推断初始状态可能是一个字符串或者一个返回字符串的函数：

```ts
initialState: string | (() => string)
```

<!-- The type of the returned array is the following:-->
返回的数组类型如下：

```ts
[string, React.Dispatch<React.SetStateAction<string>>]
```

<!-- So the first element, assigned to *newNote* is a string and the second element that we assigned *setNewNote* has a slightly more complex type. We notice that there is a string mentioned there, so we know that it must be the type of a function that sets a valued data. See [here](https://codewithstyle.info/Using-React-useState-hook-with-TypeScript/) if you want to learn more about the types of useState function.-->
所以，我们分配给*newNote*的第一个元素是一个字符串，而我们分配给*setNewNote*的第二个元素类型稍微复杂一些。我们注意到那里提到了一个字符串，因此我们知道它必须是设置有价值数据的函数的类型。如果你想了解更多关于useState函数类型的信息，请参见[这里](https://codewithstyle.info/Using-React-useState-hook-with-TypeScript/)。

<!-- From this all we see that TypeScript has indeed [inferred](https://www.typescriptlang.org/docs/handbook/type-inference.html#handbook-content) the type of the first useState quite right, it is creating a state with type string.-->
从这一切我们可以看出，TypeScript确实[推断](https://www.typescriptlang.org/docs/handbook/type-inference.html#handbook-content)了第一个useState的类型，它正在创建一个类型为字符串的状态。

<!-- When we look at the second useState that has the initial value *[]* the type looks quite different-->
当我们看到第二个useState，它的初始值为*[]*，类型看起来就有些不同了。

```ts
useState<never[]>(initialState: never[] | (() => never[])):
  [never[], React.Dispatch<React.SetStateAction<never[]>>]
```

<!-- TypeScript can just infer that the state has type *never[]*, it is an array but it has no clue what are the elements stored to array, so we clearly need to help the compiler and provide the type explicitly.-->
TypeScript可以推断出状态的类型是*never[]*，它是一个数组，但它不知道数组中存储的是什么元素，因此我们明确需要帮助编译器并提供明确的类型。

<!-- One of the best sources for information about typing React is the [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/).-->
一个最佳的关于输入React的信息来源是[React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)。

<!-- The chapter about [useState](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks#usestate) hook instructs to use a <i>type parameter</i> in situations where the compiler can not infer the type.-->
第关于[useState](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks#usestate) hook的章节指示在编译器无法推断类型的情况下使用<i>类型参数</i>。

<!-- Let us now define a type for notes:-->
让我们现在为笔记定义一种类型：

```js
interface Note {
  id: number,
  content: string
}
```

<!-- The solution is now simple:-->
现在的解决方案很简单：

```js
const [notes, setNotes] = useState<Note[]>([]);
```

<!-- And indeed, the type is set quite right:-->
而且，字体设置的确很正确：

```ts
useState<Note[]>(initialState: Note[] | (() => Note[])):
  [Note[], React.Dispatch<React.SetStateAction<Note[]>>]
```

<!-- So in technical terms useState is [a generic function](https://www.typescriptlang.org/docs/handbook/2/generics.html#working-with-generic-type-variables), where the type has to be specified as a type parameter in those cases when the compiler can not infer the type.-->
所以从技术角度来讲，useState是[一个泛型函数](https://www.typescriptlang.org/docs/handbook/2/generics.html#working-with-generic-type-variables)，在编译器无法推断出类型的情况下，必须将类型作为类型参数指定。

<!-- Rendering the notes is now easy. Let us just add some data to the state so that we can see that the code works:-->
渲染笔记现在很容易。让我们只添加一些数据到状态中，这样我们就可以看到代码是否有效：

```js
interface Note {
  id: number,
  content: string
}

import { useState } from "react";

const App = () => {
  const [notes, setNotes] = useState<Note[]>([
    { id: 1, content: 'testing' } // highlight-line
  ]);
  const [newNote, setNewNote] = useState('');

  return (
    // highlight-start
    <div>
      <ul>
        {notes.map(note =>
          <li key={note.id}>{note.content}</li>
        )}
      </ul>
    </div>
    // highlight-end
  )
}
```

<!-- The next task is to add a form that makes it possible to create new notes:-->
下一个任务是添加一个表单，使其可以创建新的笔记：

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
        <input
          value={newNote}
          onChange={(event) => setNewNote(event.target.value)}
        />
        <button type='submit'>add</button>
      </form>
      // highlight-end
      <ul>
        {notes.map(note =>
          <li key={note.id}>{note.content}</li>
        )}
      </ul>
    </div>
  )
}
```

<!-- It just works! When we hover over the *event.target.value*, we see that it is indeed a string, just what is the expected parameter of the *setNewNote*:-->
当我们悬停在*event.target.value*上，我们看到它确实是一个字符串，正是*setNewNote*所期望的参数，它就是这么简单！

![vscode showing variable is a string](../../images/9/67new.png)

<!-- So we still need the event handler for adding the new note. Let us try the following:-->
所以我们仍然需要事件处理器来添加新笔记。让我们尝试一下：

```js
const App = () => {
  // ...

   // highlight-start
  const noteCreation = (event) => {
    event.preventDefault()
    // ...
  };
   // highlight-end

  return (
    <div>
      <form onSubmit={noteCreation}> // highlight-line
        <input
          value={newNote}
          onChange={(event) => setNewNote(event.target.value)}
        />
        <button type='submit'>add</button>
      </form>
      // ...
    </div>
  )
}
```

<!-- It does not quite work, there is an Eslint error complaining about implicit any:-->
它不太好用，有一个 ESLint 错误抱怨隐式的 any:

![vscode error event implicitly has any type](../../images/9/68new.png)

<!-- TypeScript compiler has now no clue what is the type of the parameter, so that is why the type is the infamous implicit any that we want to [avoid](/en/part9/first_steps_with_type_script#the-horrors-of-any) at all costs. The React TypeScript cheatsheet comes again to rescue, the chapter about-->
[props](/en/part9/first_steps_with_type_script#props) tells us that the type of the props parameter is an object with some fields.

TypeScript 编译器现在不知道参数的类型是什么，所以这就是为什么我们想要[避免](/en/part9/first_steps_with_type_script#the-horrors-of-any)的那种恶名昭彰的隐式 any 类型。React TypeScript 小抄又派上用场了，关于[props](/en/part9/first_steps_with_type_script#props)的章节告诉我们，props 参数的类型是一个带有一些字段的对象。
<!-- [forms and events](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forms_and_events) reveals that the right type of event handler is *React.SyntheticEvent*.-->
[表单和事件](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forms_and_events) 揭示了正确类型的事件处理程序是*React.SyntheticEvent*。

<!-- The code becomes-->
more complex

代码变得更加复杂了

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
        {notes.map(note =>
          <li key={note.id}>{note.content}</li>
        )}
      </ul>
    </div>
  )
}
```

<!-- And that''s it, our app is ready and perfectly typed!-->
而且就是这样，我们的应用程序已经准备好了，而且完美地打字！

### Communicating with the server

<!-- Let us modify the app so that the notes are saved in a JSON server backend in url <http://localhost:3001/notes>-->
让我们修改应用程序，以便将笔记保存在JSON服务器后端中的URL <http://localhost:3001/notes> 中。

<!-- As usual, we shall use Axios and the useEffect hook to fetch the initial state from the server.-->
通常，我们将使用Axios和useEffect钩子从服务器获取初始状态。

<!-- Let us try the following-->
让我们试试下面的

```js
const App = () => {
  // ...
  useEffect(() => {
    axios.get('http://localhost:3001/notes').then(response => {
      console.log(response.data);
    })
  }, [])
  // ...
}


```

<!-- When we hover over the *response.data* we see that is has the type *any*-->
当我们悬停在 *response.data* 上时，我们可以看到它的类型是 *any*。

![vscode response.data showing the any type](../../images/9/69new.png)

<!-- To set the data to the state with function *setNotes* we must type it properly.-->
使用函数 *setNotes* 将数据设置到状态时，我们必须正确地输入它。

<!-- With a little [help from internet](https://upmostly.com/typescript/how-to-use-axios-in-your-typescript-apps), we find a clever trick:-->
通过[网络的帮助](https://upmostly.com/typescript/how-to-use-axios-in-your-typescript-apps)，我们发现了一个聪明的技巧：

```js
  useEffect(() => {
    axios.get<Note[]>('http://localhost:3001/notes').then(response => { // highlight-line
      console.log(response.data);
    })
  }, [])
```

<!-- When we hover over the response.data we see that it has the correct type:-->
当我们悬停在response.data上时，我们发现它具有正确的类型：

![vscode showing response.data has Note array type](../../images/9/70new.png)

<!-- We can now set the data in the state *notes* to get the code working:-->
我们现在可以将数据设置在状态 *notes* 中以获得代码的正常运行：

```js
  useEffect(() => {
    axios.get<Note[]>('http://localhost:3001/notes').then(response => {
      setNotes(response.data) // highlight-line
    })
  }, [])
```

<!-- So just like with *useState*, we gave a type  parameter to *axios.get* to instruct it how the typing should be done. Just like *useState* also *axios.get* is a [generic function](https://www.typescriptlang.org/docs/handbook/2/generics.html#working-with-generic-type-variables). Unlike some generic functions, the type parameter of *axios.get* has a default value *any* so, if the function is used without defining the type parameter, the type of the response data will be any.-->
所以就像*useState*一样，我们给了一个型别参数给*axios.get*来指示它如何完成类型定义。就像*useState*一样，*axios.get*也是一个[泛型函数](https://www.typescriptlang.org/docs/handbook/2/generics.html#working-with-generic-type-variables)。不像某些泛型函数，*axios.get*的型别参数有一个默认值*any*，所以如果函数在不定义型别参数的情况下使用，响应数据的类型将是任何类型。

<!-- The code works, compiler and Eslint are happy and remain quiet. However, giving a type parameter to *axios.get* is a potentially dangerous thing to do. The response body can contain data in an arbitrary form, and when giving a type parameter we are essentially just telling to TypeScript compiler to trust us that the data has type *Note[]*.-->
代码运行正常，编译器和Eslint都很满意并保持安静。但是，给*axios.get*提供类型参数可能是一件危险的事情。响应体可以以任意形式包含数据，而当我们提供类型参数时，我们本质上只是告诉TypeScript编译器相信我们，数据具有类型*Note[]*。

<!-- So our code is essentially as safe as it would be if a [type assertion](/en/part9/first_steps_with_type_script#type-assertion) would be used:-->
所以我们的代码本质上与使用[类型断言](/zh-cn/part9/first_steps_with_type_script#type-assertion)一样安全：

```js
  useEffect(() => {
    axios.get('http://localhost:3001/notes').then(response => {
      // response.body is of type any
      setNotes(response.data as Note[]) // highlight-line
    })
  }, [])
```

<!-- Since the TypeScript types do not even exist in runtime, our code does not give us any "safety" against situations where the request body contains data in a wrong form.-->
因为TypeScript类型甚至在运行时都不存在，我们的代码不能为我们提供任何“安全性”来防止请求体包含错误形式的数据的情况。

<!-- Giving type variable to *axios.get* might be ok if we are <i>absolutely sure</i> that the backend behaves correctly and returns always the data in correct form. If we want to build a robust system we should prepare for surprises and parse the response data in the frontend similarly that we did [in the previous section](/en/part9/typing_an_express_app#proofing-requests) for the requests to the backend.-->
如果我们<i>绝对确定</i>后端行为正确，并且总是以正确的形式返回数据，那么给*axios.get*提供类型变量可能是可以的。如果我们想要构建一个强大的系统，我们应该为意外情况做好准备，并在前端与我们[在上一节](/en/part9/typing_an_express_app#proofing-requests)对后端请求所做的相似地解析响应数据。

<!-- Let us now wrap up our app by implementing the new note addition:-->
让我们现在通过实现新的笔记添加来结束我们的应用程序：

```js
  const noteCreation = (event: React.SyntheticEvent) => {
    event.preventDefault()
    // highlight-start
    axios.post<Note>('http://localhost:3001/notes', { content: newNote })
      .then(response => {
        setNotes(notes.concat(response.data))
      })
    // highlight-end

    setNewNote('')
  };
```

<!-- We are again giving *axios.post* a type parameter. We know that the server response is added note so the proper type parameter is *Note*.-->
我们再次给*axios.post*一个类型参数。我们知道服务器响应添加了注释，因此适当的类型参数是*Note*。

<!-- Let us clean up the code a bit. For the type definitions, we create a file *types.ts* with the following content:-->
让我们把代码收拾一下。对于类型定义，我们创建一个名为*types.ts*的文件，内容如下：

```js
export interface Note {
  id: number,
  content: string
}

export type NewNote = Omit<Note, 'id'>
```

<!-- We have added a new type for a <i>new note</i>, one that does not yet have the *id* field assigned.-->
我们为一个<i>新笔记</i>增加了一种新类型，它尚未指定*id*字段。

<!-- The code that communicates with the backend is also extracted to a module in the file *noteService.tsx*-->
在文件*noteService.tsx*中把与后端通信的代码也抽取到一个模块中。

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

<!-- The component *App* is now much cleaner:-->
组件*App*现在更加干净了：

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

<!-- The app is now nicely typed and ready for further development!-->
应用程序现在已经完美地打字，准备好进一步开发了！

<!-- The code of the typed notes can be found [here](https://github.com/fullstack-hy2020/typed-notes).-->
代码可以在[这里](https://github.com/fullstack-hy2020/typed-notes)找到。

### A note about defining object types

<!-- We have used [interfaces](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces) to define object types, e.g. diary entries, in the previous section-->
.

我们在前一节中使用[接口](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces)来定义对象类型，例如日记条目。

```js
interface DiaryEntry {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment?: string;
}
```

<!-- and in the course part of this section-->
,

在这一部分的课程部分，

```js
interface CoursePartBase {
  name: string;
  exerciseCount: number;
}
```

<!-- We actually could have had the same effect by using a [type alias](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases)-->
我们实际上可以通过使用[类型别名](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases)来达到同样的效果。

```js
type DiaryEntry = {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment?: string;
}
```

<!-- In most cases, you can use either *type* or *interface*, whichever syntax you prefer. However, there are a few things to keep in mind.-->
在大多数情况下，您可以使用*类型*或*界面*，无论您更喜欢哪种语法。但是，需要牢记几件事。
<!-- For example, if you define multiple interfaces with the same name, they will result in a merged interface, whereas if you try to define multiple types with the same name, it will result in an error stating that a type with the same name is already declared.-->
例如，如果你定义多个具有相同名称的接口，它们将会导致合并的接口，而如果你尝试定义多个具有相同名称的类型，它将会导致一个错误，表明已经声明了一个具有相同名称的类型。

<!-- TypeScript documentation [recommends using interfaces](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces) in most cases.-->
TypeScript 文档[推荐在大多数情况下使用接口](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces)。

</div>

<div class="tasks">

### Exercises 9.16-9.19

<!-- Let us now build a frontend for the Ilari''s flight diaries that was developed in [the previous section](/en/part9/typing_an_express_app). The source code of the backend can be found in [this GitHub repository](https://github.com/fullstack-hy2020/flight-diary).-->
让我们现在为在[上一节](/en/part9/typing_an_express_app)中开发的Ilari的飞行日记构建一个前端。后端的源代码可以在[这个GitHub存储库](https://github.com/fullstack-hy2020/flight-diary)中找到。

#### Exercise 9.16

<!-- Create a TypeScript React app with similar configurations as the apps of this section. Fetch the diaries from the backend and render those to screen. Do all the required typing and ensure that there are no Eslint errors.-->
在本节的应用程序的类似配置下创建一个TypeScript React应用程序。 从后端获取日记并将其渲染到屏幕上。 执行所有必要的键入，并确保没有Eslint错误。

<!-- Remember to keep the network tab open. It might give you a valuable hint...-->
记得保持网络选项开启，它可能会给你一个宝贵的提示...

<!-- You can decide how the diary entries are rendered. If you wish, you may take inspiration form the figure below. Note that the backend API does not return the diary comments, you may modify it to return also those on a GET request.-->
你可以决定日记条目的呈现方式。如果你愿意，可以从下面的图中获取灵感。请注意，后端API不会返回日记评论，你可以修改它以在 GET 请求中也返回这些评论。

#### Exercise 9.17

<!-- Make it possible to add new diary entries from the frontend. In this exercise you may skip all validations and assume that the user just enters the data in a correct form.-->
使得从前端添加新日记条目成为可能。在这个练习中，你可以跳过所有验证，假设用户以正确的形式输入数据。

#### Exercise 9.18

<!-- Notify the user if the the creation of a diary entry fails in the backend, show also the reason for the failure.-->
如果后端创建日记条目失败，请通知用户，并显示失败的原因。

<!-- See eg. [this](https://dev.to/mdmostafizurrahaman/handle-axios-error-in-typescript-4mf9) how you can narrow the Axios error so that you can get hold of the error message.-->
参考[这个](https://dev.to/mdmostafizurrahaman/handle-axios-error-in-typescript-4mf9)，了解如何缩小 Axios 错误的范围，以便获取错误消息。

<!-- Your solution may look like this:-->
你的解决方案可能看起来像这样：

![browser showing error incorrect visibility best ever](../../images/9/71new.png)

#### Exercise 9.19

<!-- Addition of a diary entry is now very error prone since user can type anything to the input fields. The situation must be improved.-->
添加日记条目现在非常容易出错，因为用户可以在输入字段中输入任何内容。这种情况必须得到改善。

<!-- Modify the input form so that the date is set with a HTML [date](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date) input element, and the weather and visibility are set with HTML [radio buttons](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio). We have already used radio buttons in [part 6](/en/part6/many_reducers#store-with-complex-state), that material may or may not be useful...-->
修改输入表单，使日期使用HTML [date](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date) 输入元素设置，而天气和能见度使用HTML [radio buttons](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio) 设置。我们已经在[第6章节](/en/part6/many_reducers#store-with-complex-state) 中使用了单选按钮，这些材料可能有用也可能没用...

<!-- Your app should all the time stay well typed and there should not be any Eslint errors and no Eslint rules should be ignored.-->
你的应用程序应该始终保持良好的书写，不应该有任何 Eslint 错误，也不应该忽略任何 Eslint 规则。

<!-- Your solution could look like this:-->
你的解决方案可能看起来像这样：

![browser showing add new entry form for diaries](../../images/9/72new.png)

</div>
