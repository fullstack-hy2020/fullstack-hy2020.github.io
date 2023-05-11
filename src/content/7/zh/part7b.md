---
mainImage: ../../../images/part-7.svg
part: 7
letter: b
lang: zh
---

<div class="content">

<!-- The exercises in this part are a bit different than the exercises in the previous parts. The exercises in the previous part and the exercises in this part [are about the theory presented in this part](/en/part7/custom_hooks#exercises-7-4-7-8).-->
这一部分的练习与前面几部分的练习有些不同。前面几部分的练习和本部分的练习[都是关于本部分提出的理论](/en/part7/custom_hooks#exercises-7-4-7-8)。

<!-- This part also contains a [series of exercises](/en/part7/exercises_extending_the_bloglist) in which we modify the Bloglist application from parts 4 and 5 to rehearse and apply the skills we have learned.-->
这一部分也包含了一系列[练习](/en/part7/exercises_extending_the_bloglist)，我们可以通过修改第4章节和第5章节的Bloglist应用来复习和应用我们所学习的技能。

### Hooks

<!-- React offers 15 different [built-in hooks](https://reactjs.org/docs/hooks-reference.html), of which the most popular ones are the [useState](https://reactjs.org/docs/hooks-reference.html#usestate) and [useEffect](https://reactjs.org/docs/hooks-reference.html#useeffect) hooks that we have already been using extensively.-->
React 提供了 15 种不同的[内置钩子](https://reactjs.org/docs/hooks-reference.html)，其中最受欢迎的是[useState](https://reactjs.org/docs/hooks-reference.html#usestate)和[useEffect](https://reactjs.org/docs/hooks-reference.html#useeffect)钩子，我们已经广泛使用了。

<!-- In [part 5](/en/part5/props_children_and_proptypes#references-to-components-with-ref) we used the [useImperativeHandle](https://reactjs.org/docs/hooks-reference.html#useimperativehandle) hook which allows components to provide their functions to other components. In [part 6](/en/part6/react_query_use_reducer_and_the_contex) we used [useReducer](https://reactjs.org/docs/hooks-reference.html#usereducer) and [useContext](https://reactjs.org/docs/hooks-reference.html#usecontext) to implement a Redux like state management.-->
在[第5章节](/en/part5/props_children_and_proptypes#references-to-components-with-ref)中，我们使用了[useImperativeHandle](https://reactjs.org/docs/hooks-reference.html#useimperativehandle)钩子，它允许组件向其他组件提供它们的函数。在[第6章节](/en/part6/react_query_use_reducer_and_the_contex)中，我们使用了[useReducer](https://reactjs.org/docs/hooks-reference.html#usereducer)和[useContext](https://reactjs.org/docs/hooks-reference.html#usecontext)来实现类似Redux的状态管理。

<!-- Within the last couple of years, many React libraries have begun to offer hook-based APIs. [In part 6](/en/part6/flux_architecture_and_redux) we used the [useSelector](https://react-redux.js.org/api/hooks#useselector) and [useDispatch](https://react-redux.js.org/api/hooks#usedispatch) hooks from the react-redux library to share our redux-store and dispatch function to our components.-->
在过去的几年里，许多 React 库开始提供基于钩子的 API。[在第 6 部分](/en/part6/flux_architecture_and_redux)中，我们使用了 [useSelector](https://react-redux.js.org/api/hooks#useselector) 和 [useDispatch](https://react-redux.js.org/api/hooks#usedispatch) 钩子，从 react-redux 库中分享我们的 redux-store 和 dispatch 函数到我们的组件中。

<!-- The [React Router's](https://reactrouter.com/en/main/start/tutorial) API we introduced in the [previous part](/en/part7/react_router) is also partially hook-based. Its hooks can be used to access URL parameters and the <i>navigation</i> object, which allows for manipulating the browser URL programmatically.-->
[前一部分](/en/part7/react_router)中介绍的[React Router's](https://reactrouter.com/en/main/start/tutorial) API也是部分基于Hook的。它的Hook可用于访问URL参数和<i>导航</i>对象，允许程序化地操纵浏览器URL。

<!-- As mentioned in [part 1](/en/part1/a_more_complex_state_debugging_react_apps#rules-of-hooks), hooks are not normal functions, and when using those we have to adhere to certain [rules or limitations](https://reactjs.org/docs/hooks-rules.html). Let's recap the rules of using hooks, copied verbatim from the official React documentation:-->
[如在第一章节中所提及](/en/part1/a_more_complex_state_debugging_react_apps#rules-of-hooks)，hooks不是正常的函数，使用它们时我们必须遵守某些[规则或限制](https://reactjs.org/docs/hooks-rules.html)。让我们复习一下使用hooks的规则，以下文字摘自官方React文档：

<!-- **Don’t call Hooks inside loops, conditions, or nested functions.** Instead, always use Hooks at the top level of your React function.-->
**不要在循环、条件或嵌套函数中调用 Hooks。** 相反，始终在 React 函数的顶级位置使用 Hooks。

<!-- **Don’t call Hooks from regular JavaScript functions.** Instead, you can:-->
**不要从常规JavaScript函数调用Hooks。** 相反，你可以：

<!-- - Call Hooks from React function components.-->
从React函数组件中调用Hooks。
<!-- - Call Hooks from custom Hooks-->
从自定义钩子中调用钩子

<!-- There's an existing [ESlint](https://www.npmjs.com/package/eslint-plugin-react-hooks) rule that can be used to verify that the application uses hooks correctly.-->
有一个现有的[ESlint](https://www.npmjs.com/package/eslint-plugin-react-hooks)规则可以用来验证应用程序是否正确使用hooks。

<!-- Create-react-app has the readily-configured rule [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks) that complains if hooks are used in an illegal manner:-->
[create-react-app](https://github.com/facebook/create-react-app) 有一个已经配置好的规则 [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks)，如果hooks被非法使用，它会报告错误：

![vscode error useState being called conditionally](../../images/7/60ea.png)

### Custom hooks

<!-- React offers the option to create [custom](https://reactjs.org/docs/hooks-custom.html) hooks. According to React, the primary purpose of custom hooks is to facilitate the reuse of the logic used in components.-->
React 提供创建[自定义](https://reactjs.org/docs/hooks-custom.html)hooks的选项。根据 React，自定义 hooks 的主要目的是促进组件中使用的逻辑的重用。

<!-- > <i>Building your own Hooks lets you extract component logic into reusable functions.</i>-->
> <i>构建自己的Hooks可以将组件逻辑提取到可重用的函数中。</i>

<!-- Custom hooks are regular JavaScript functions that can use any other hooks, as long as they adhere to the [rules of hooks](/en/part1/a_more_complex_state_debugging_react_apps#rules-of-hooks). Additionally, the name of custom hooks must start with the word _use_.-->
自定义钩子是普通的JavaScript函数，可以使用任何其他钩子，只要它们遵守[钩子规则](/en/part1/a_more_complex_state_debugging_react_apps#rules-of-hooks)。此外，自定义钩子的名称必须以_use_开头。

<!-- We implemented a counter application in [part 1](/en/part1/component_state_event_handlers#event-handling) that can have its value incremented, decremented, or reset. The code of the application is as follows:-->
我们在[部分1](/en/part1/component_state_event_handlers#event-handling)中实现了一个可以增加、减少或重置其值的计数器应用程序。该应用程序的代码如下：

```js
import { useState } from 'react'
const App = () => {
  const [counter, setCounter] = useState(0)

  return (
    <div>
      <div>{counter}</div>
      <button onClick={() => setCounter(counter + 1)}>
        plus
      </button>
      <button onClick={() => setCounter(counter - 1)}>
        minus
      </button>
      <button onClick={() => setCounter(0)}>
        zero
      </button>
    </div>
  )
}
```

<!-- Let's extract the counter logic into a custom hook. The code for the hook is as follows:-->
让我们将计数器逻辑提取到一个自定义钩子中。 钩子的代码如下：

```js
const useCounter = () => {
  const [value, setValue] = useState(0)

  const increase = () => {
    setValue(value + 1)
  }

  const decrease = () => {
    setValue(value - 1)
  }

  const zero = () => {
    setValue(0)
  }

  return {
    value,
    increase,
    decrease,
    zero
  }
}
```

<!-- Our custom hook uses the _useState_ hook internally to create its state. The hook returns an object, the properties of which include the value of the counter as well as functions for manipulating the value.-->
我们的自定义钩子内部使用_useState_钩子来创建其状态。该钩子返回一个对象，其属性包括计数器的值以及用于操作该值的函数。

<!-- React components can use the hook as shown below:-->
React 组件可以像下面这样使用 hook：

```js
const App = () => {
  const counter = useCounter()

  return (
    <div>
      <div>{counter.value}</div>
      <button onClick={counter.increase}>
        plus
      </button>
      <button onClick={counter.decrease}>
        minus
      </button>
      <button onClick={counter.zero}>
        zero
      </button>
    </div>
  )
}
```

<!-- By doing this we can extract the state of the _App_ component and its manipulation entirely into the _useCounter_ hook. Managing the counter state and logic is now the responsibility of the custom hook.-->
通过这样做，我们可以完全将_App_组件及其操作的状态提取到_useCounter_钩子中。现在，计数器状态和逻辑的管理都是自定义钩子的责任。

<!-- The same hook could be <i>reused</i> in the application that was keeping track of the number of clicks made to the left and right buttons:-->
同一个钩子可以<i>重复使用</i>在跟踪左右按钮点击次数的应用中：

```js

const App = () => {
  const left = useCounter()
  const right = useCounter()

  return (
    <div>
      {left.value}
      <button onClick={left.increase}>
        left
      </button>
      <button onClick={right.increase}>
        right
      </button>
      {right.value}
    </div>
  )
}
```

<!-- The application creates <i>two</i> completely separate counters. The first one is assigned to the variable _left_ and the other to the variable _right_.-->
应用程序创建<i>两</i>个完全独立的计数器。第一个被分配给变量_left_，另一个被分配给变量_right_。

<!-- Dealing with forms in React is somewhat tricky. The following application presents the user with a form that requests the user to input their name, birthday, and height:-->
处理React中的表单有些棘手。以下应用程序向用户呈现一个表单，要求用户输入他们的姓名、生日和身高：

```js
const App = () => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  const [height, setHeight] = useState('')

  return (
    <div>
      <form>
        name:
        <input
          type='text'
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <br/>
        birthdate:
        <input
          type='date'
          value={born}
          onChange={(event) => setBorn(event.target.value)}
        />
        <br />
        height:
        <input
          type='number'
          value={height}
          onChange={(event) => setHeight(event.target.value)}
        />
      </form>
      <div>
        {name} {born} {height}
      </div>
    </div>
  )
}
```

<!-- Every field of the form has its own state. To keep the state of the form synchronized with the data provided by the user, we have to register an appropriate <i>onChange</i> handler for each of the <i>input</i> elements.-->
每个表单域都有它自己的状态。为了使表单的状态与用户提供的数据保持同步，我们必须为每个<i>输入</i>元素注册适当的<i>onChange</i>处理程序。

<!-- Let's define our own custom _useField_ hook that simplifies the state management of the form:-->
让我们定义自己的自定义_useField_钩子，以简化表单的状态管理：

```js
const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}
```

<!-- The hook function receives the type of the input field as a parameter. The function returns all of the attributes required by the <i>input</i>: its type, value and the onChange handler.-->
钩子函数接收输入字段的类型作为参数。该函数返回<i>输入</i>所需的所有属性：其类型、值和onChange处理程序。

<!-- The hook can be used in the following way:-->
以下是使用钩子的方式：

```js
const App = () => {
  const name = useField('text')
  // ...

  return (
    <div>
      <form>
        <input
          type={name.type}
          value={name.value}
          onChange={name.onChange}
        />
        // ...
      </form>
    </div>
  )
}
```

### Spread attributes

<!-- We could simplify things a bit further. Since the _name_ object has exactly all of the attributes that the <i>input</i> element expects to receive as props, we can pass the props to the element using the [spread syntax](https://reactjs.org/docs/jsx-in-depth.html#spread-attributes) in the following way:-->
我们可以进一步简化事情。由于_name_对象完全具有<i>input</i>元素预期接收的props，我们可以使用[spread语法](https://reactjs.org/docs/jsx-in-depth.html#spread-attributes)以下面的方式将props传递给元素：

```js
<input {...name} />
```

<!-- As the [example](https://reactjs.org/docs/jsx-in-depth.html#spread-attributes) in the React documentation states, the following two ways of passing props to a component achieve the exact same result:-->
如 React 文档中的[示例](https://reactjs.org/docs/jsx-in-depth.html#spread-attributes)所述，以下两种方式传递 props 给组件会达到完全相同的结果：

```js
<Greeting firstName='Arto' lastName='Hellas' />

const person = {
  firstName: 'Arto',
  lastName: 'Hellas'
}

<Greeting {...person} />
```

<!-- The application gets simplified into the following format:-->
应用程序简化为以下格式：

```js
const App = () => {
  const name = useField('text')
  const born = useField('date')
  const height = useField('number')

  return (
    <div>
      <form>
        name:
        <input  {...name} />
        <br/>
        birthdate:
        <input {...born} />
        <br />
        height:
        <input {...height} />
      </form>
      <div>
        {name.value} {born.value} {height.value}
      </div>
    </div>
  )
}
```

<!-- Dealing with forms is greatly simplified when the unpleasant nitty-gritty details related to synchronizing the state of the form are encapsulated inside our custom hook.-->
处理表单时，当与同步表单状态相关的令人不快的细节封装在我们的自定义钩子里时，大大简化了处理表单的过程。

<!-- Custom hooks are not only a tool for reuse; they also provide a better way for dividing our code into smaller modular parts.-->
自定义钩子不仅是一种重用工具；它们还提供了一种更好的方式，可以将我们的代码分解成更小的模块。

### More about hooks

<!-- The internet is starting to fill up with more and more helpful material related to hooks. The following sources are worth checking out:-->
**网络开始充斥着越来越多与hooks相关的有用材料。以下资源值得一看：**

<!-- - [Awesome React Hooks Resources](https://github.com/rehooks/awesome-react-hooks)-->
- [优秀的React Hooks资源](https://github.com/rehooks/awesome-react-hooks)
<!-- - [Easy to understand React Hook recipes by Gabe Ragland](https://usehooks.com/)-->
- [由 Gabe Ragland 提供的易于理解的 React Hook 食谱](https://usehooks.com/)
<!-- - [Why Do React Hooks Rely on Call Order?](https://overreacted.io/why-do-hooks-rely-on-call-order/)-->
# 为什么 React Hooks 依赖调用顺序？

React Hooks 是一种新的 React 编程模式，它允许你在函数组件中使用状态和其他 React 特性。它们的实现方式有一个重要的约束：它们必须按照它们在函数中的调用顺序运行，而不能改变顺序。这个约束可能会让你感到困惑，因为它似乎违反了函数式编程的一般原则，即函数的输出只取决于它的输入，而不受其他因素的影响。

React Hooks 之所以依赖调用顺序，是因为它们必须与 React 的虚拟 DOM 树保持同步。React 会在每次渲染期间重新调用函数组件，以确保虚拟 DOM 树是最新的。如果 Hooks 能够改变调用顺序，那么 React 就无法确保虚拟 DOM 树的正确性，因此必须要求 Hooks 必须按照调用顺序运行。

</div>

<div class="tasks">

### Exercises 7.4.-7.8.

<!-- We''ll continue with the app from [exercises](/en/part7/react_router#exercises-7-1-7-3) of the chapter [react router](/en/part7/react_router).-->
我们将继续使用本章[react router](/en/part7/react_router)的[练习](/en/part7/react_router#exercises-7-1-7-3)中的应用程序。

#### 7.4: anecdotes and hooks step1

<!-- Simplify the anecdote creation form of your application with the _useField_ custom hook we defined earlier.-->
简化你的应用的轶事创建表单，使用我们先前定义的_useField_自定义钩子。

<!-- One natural place to save the custom hooks of your application is in the <i>/src/hooks/index.js</i> file.-->
一个存放应用程序自定义hooks的自然位置是<i>/src/hooks/index.js</i>文件。

<!-- If you use the [named export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export#Description) instead of the default export:-->
如果您使用[命名导出](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export#Description)而不是默认导出：

```js
import { useState } from 'react'

export const useField = (type) => { // highlight-line
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

// modules can have several named exports
export const useAnotherHook = () => { // highlight-line
  // ...
}
```

<!-- Then [importing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) happens in the following way:-->
然后以下方式发生[导入](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)：

```js
import  { useField } from './hooks'

const App = () => {
  // ...
  const username = useField('text')
  // ...
}
```

#### 7.5: anecdotes and hooks step2

<!-- Add a button to the form that you can use to clear all the input fields:-->
在表单中添加一个按钮，可以用来清除所有输入字段：

![browser anecdotes with reset button](../../images/7/61ea.png)

<!-- Expand the functionality of the <i>useField</i> hook so that it offers a new <i>reset</i> operation for clearing the field.-->
扩展<i>useField</i>钩子的功能，以便它为清除字段提供一个新的<i>reset</i>操作。

<!-- Depending on your solution, you may see the following warning in your console:-->
您的控制台可能会出现以下警告，具体取决于您的解决方案：

![devtools console warning invalid value for reset prop](../../images/7/62ea.png)

<!-- We will return to this warning in the next exercise.-->
我们将在下一个练习中再次提及这一警告。

#### 7.6: anecdotes and hooks step3

<!-- If your solution did not cause a warning to appear in the console, you have already finished this exercise.-->
如果你的解决方案没有在控制台中出现警告，你已经完成了这个练习。

<!-- If you see the warning in the console, make the necessary changes to get rid of the _Invalid value for prop \`reset\` on \<input\> tag_ console warning.-->
如果你在控制台看到警告，请做出必要的更改以消除_\<input\> 标签上的 \`reset\` 的无效值_控制台警告。

<!-- The reason for this warning is that after making the changes to your application, the following expression:-->
警告的原因是，在对应用程序进行修改后，以下表达式：

```js
<input {...content}/>
```

<!-- Essentially, is the same as this:-->
本质上，就像这样：

```js
<input
  value={content.value}
  type={content.type}
  onChange={content.onChange}
  reset={content.reset} // highlight-line
/>
```

<!-- The <i>input</i> element should not be given a <i>reset</i> attribute.-->
<i>输入</i>元素不应该赋予<i>重置</i>属性。

<!-- One simple fix would be to not use the spread syntax and write all of the forms like this:-->
一个简单的修复方法是不要使用spread语法，而是像这样写所有的表单：

```js
<input
  value={username.value}
  type={username.type}
  onChange={username.onChange}
/>
```

<!-- If we were to do this, we would lose much of the benefit provided by the <i>useField</i> hook. Instead, come up with a solution that fixes the issue, but is still easy to use with spread syntax.-->
如果我们要这么做，我们将失去<i>useField</i>钩子提供的许多好处。相反，想出一个解决问题的解决方案，但仍然可以使用spread语法来轻松使用。

#### 7.7: country hook

<!-- Let's return to exercises [2.18-2.20](/en/part2/adding_styles_to_react_app#exercises-2-18-2-20).-->
让我们回到练习[2.18-2.20](/en/part2/adding_styles_to_react_app#exercises-2-18-2-20)。

<!-- Use the code from <https://github.com/fullstack-hy2020/country-hook> as your starting point.-->
使用<https://github.com/fullstack-hy2020/country-hook>中的代码作为你的起点。

<!-- The application can be used to search for a country's details from the <https://restcountries.com/> interface. If a country is found, the details of the country are displayed:-->
应用程序可以用来从<https://restcountries.com/>接口搜索一个国家的详细信息。如果找到了国家，则会显示国家的详细信息：

![browser displaying country details](../../images/7/69ea.png)

<!-- If no country is found, a message is displayed to the user:-->
如果没有找到国家，就会向用户显示一条消息：

![browser showing country not found](../../images/7/70ea.png)

<!-- The application is otherwise complete, but in this exercise, you have to implement a custom hook _useCountry_, which can be used to search for the details of the country given to the hook as a parameter.-->
应用程序已经完成，但在本次练习中，你必须实现一个自定义钩子 _useCountry_，它可以用来搜索给定钩子的国家的详细信息。

<!-- Use the API endpoint [full name](https://restcountries.com/#api-endpoints-v2-full-name) to fetch a country's details in a _useEffect_ hook within your custom hook.-->
使用API端点[全名](https://restcountries.com/#api-endpoints-v2-full-name)在自定义钩子中的_useEffect_钩子中获取国家的详细信息。

<!-- Note that in this exercise it is essential to use useEffect's [second parameter](https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect) array to control when the effect function is executed. See the course [part 2](/en/part2/adding_styles_to_react_app#couple-of-important-remarks) for more info how the second parameter could be used.-->
注意，在本练习中，必须使用useEffect的[第二个参数](https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect)数组来控制何时执行效果函数。有关如何使用第二个参数的更多信息，请参阅课程[第2章节](/en/part2/adding_styles_to_react_app#couple-of-important-remarks)。

#### 7.8: ultimate hooks

<!-- The code of the application responsible for communicating with the backend of the note application of the previous parts looks like this:-->
这个应用程序负责与前几部分笔记应用的后端通信的代码如下：

```js
import axios from 'axios'
const baseUrl = '/api/notes'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (id, newObject) => {
  const response = await axios.put(`${ baseUrl }/${id}`, newObject)
  return response.data
}

export default { getAll, create, update, setToken }
```

<!-- We notice that the code is in no way specific to the fact that our application deals with notes. Excluding the value of the _baseUrl_ variable, the same code could be reused in the blog post application for dealing with the communication with the backend.-->
我们注意到代码与我们的应用涉及笔记的事实无关。除了_baseUrl_变量的值之外，同样的代码可以用于博客应用程序来处理与后端的通信。

<!-- Extract the code for communicating with the backend into its own _useResource_ hook. It is sufficient to implement fetching all resources and creating a new resource.-->
把与后端通信的代码提取到自己的_useResource_钩子中。实现获取所有资源和创建新资源就足够了。

<!-- You can do the exercise for the project found in the <https://github.com/fullstack-hy2020/ultimate-hooks> repository. The <i>App</i> component for the project is the following:-->
你可以在<https://github.com/fullstack-hy2020/ultimate-hooks> 仓库中找到项目的练习。该项目的<i>App</i>组件如下：

```js
const App = () => {
  const content = useField('text')
  const name = useField('text')
  const number = useField('text')

  const [notes, noteService] = useResource('http://localhost:3005/notes')
  const [persons, personService] = useResource('http://localhost:3005/persons')

  const handleNoteSubmit = (event) => {
    event.preventDefault()
    noteService.create({ content: content.value })
  }

  const handlePersonSubmit = (event) => {
    event.preventDefault()
    personService.create({ name: name.value, number: number.value})
  }

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...content} />
        <button>create</button>
      </form>
      {notes.map(n => <p key={n.id}>{n.content}</p>)}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...name} /> <br/>
        number <input {...number} />
        <button>create</button>
      </form>
      {persons.map(n => <p key={n.id}>{n.name} {n.number}</p>)}
    </div>
  )
}
```

<!-- The _useResource_ custom hook returns an array of two items just like the state hooks. The first item of the array contains all of the individual resources and the second item of the array is an object that can be used for manipulating the resource collection, like creating new ones.-->
_useResource_ 自定义钩子返回一个由两个项目组成的数组，就像 state 钩子一样。 数组的第一项包含所有单个资源，第二项是一个对象，可用于操纵资源集合，比如创建新的资源。

<!-- If you implement the hook correctly, it can be used for both notes and phone numbers (start the server with the _npm run server_ command at port 3005).-->
如果你正确实施hook，它可以用于笔记和电话号码（使用_npm run server_命令在端口3005上启动服务器）。

![browser showing notes and persons](../../images/5/21e.png)

</div>
