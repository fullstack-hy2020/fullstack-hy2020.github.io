---
mainImage: ../../../images/part-7.svg
part: 7
letter: b
lang: zh
---

<div class="content">

<!-- The exercises in this part are a bit different than the exercises in the previous parts. The exercises in the previous part and the exercises in this part [are about the theory presented in this part](/en/part7/custom_hooks#exercises-7-4-7-8).-->
 本章节的练习与前几部分的练习有些不同。前面部分的练习和这部分的练习[是关于这部分介绍的理论](/en/part7/custom_hooks#exercises-7-4-7-8) 。

<!-- This part also contains a [series of exercises](/en/part7/exercises_extending_the_bloglist) in which we modify the Bloglist application from parts 4 and 5 to rehearse and apply the skills we have learned.-->
 本章节还包含一个[系列练习](/en/part7/exercises_extending_the_bloglist)，其中我们修改了第4和第5章节中的Bloglist应用，以演练和应用我们所学的技能。

### Hooks

<!-- React offers 10 different [built-in hooks](https://reactjs.org/docs/hooks-reference.html), of which the most popular ones are the [useState](https://reactjs.org/docs/hooks-reference.html#usestate) and [useEffect](https://reactjs.org/docs/hooks-reference.html#useeffect) hooks that we have already been using extensively.-->
 React提供了10种不同的[内置钩子](https://reactjs.org/docs/hooks-reference.html)，其中最常用的是我们已经广泛使用的[useState](https://reactjs.org/docs/hooks-reference.html#usestate)和[useEffect](https://reactjs.org/docs/hooks-reference.html#useeffect)钩子。

<!-- In [part 5](/en/part5/props_children_and_proptypes#references-to-components-with-ref) we used the [useImperativeHandle](https://reactjs.org/docs/hooks-reference.html#useimperativehandle) hook which allows for components to provide their functions to other components.-->
 在[第五章节](/en/part5/props_children_and_proptypes#references-to-components-with-ref)中，我们使用了[useImperativeHandle](https://reactjs.org/docs/hooks-reference.html#useimperativehandle)钩子，它允许组件向其他组件提供其功能。

<!-- Within the last couple of years many React libraries have begun to offer hook-based apis. [In part 6](/en/part6/flux_architecture_and_redux) we used the [useSelector](https://react-redux.js.org/api/hooks#useselector) and [useDispatch](https://react-redux.js.org/api/hooks#usedispatch) hooks from the react-redux library to share our redux-store and dispatch function to our components. Redux's hook-based api is a lot easier to use than its older, still available, [connect](/en/part6/connect) API.-->
 在过去几年中，许多React库已经开始提供基于钩子的apis。[在第6章节](/en/part6/flux_architecture_and_redux)中，我们使用了来自react-redux库的[useSelector](https://react-redux.js.org/api/hooks#useselector)和[useDispatch](https://react-redux.js.org/api/hooks#usedispatch)钩子来分享我们的redux-store和调度功能到我们的组件。Redux's hook-based api比其旧的、仍然可用的[connect](/en/part6/connect)API容易使用得多。

<!-- The [React Router's](https://reactrouter.com/en/main/start/tutorial) api we introduced in the [previous part](/en/part7/react_router) is also partially [hook](https://reacttraining.com/react-router/web/api/Hooks)-based. Its hooks can be used to access url parameters and the _navigation_ object, which allows for manipulating the browser url programmatically.-->
 我们在[前一部分](/en/part7/react_router)中介绍的[React Router's](https://reactrouter.com/en/main/start/tutorial)api也是部分基于[hook](https://reacttraining.com/react-router/web/api/Hooks)。它的钩子可以用来访问url参数和_navigation_对象，这允许以编程方式操纵浏览器的url。

<!-- As mentioned in [part 1](/en/part1/a_more_complex_state_debugging_react_apps#rules-of-hooks), hooks are not normal functions, and when using those we have to adhere to certain [rules or limitations](https://reactjs.org/docs/hooks-rules.html). Let's recap the rules of using hooks, copied verbatim from the official React documentation:-->
 正如在[第一章节](/en/part1/a_more_complex_state_debugging_react_apps#rules-of-hooks)中提到的，钩子不是普通的函数，在使用这些钩子时，我们必须遵守某些[规则或限制](https://reactjs.org/docs/hooks-rules.html)。让我们回顾一下使用钩子的规则，这些规则是逐字复制自React官方文档。

<!-- **Don’t call Hooks inside loops, conditions, or nested functions.** Instead, always use Hooks at the top level of your React function.-->
 **不要在循环、条件或嵌套函数中调用钩子。**相反，总是在React函数的顶层使用钩子。

<!-- **Don’t call Hooks from regular JavaScript functions.** Instead, you can:-->
 **不要从普通的JavaScript函数中调用Hooks。**相反，你可以。

<!-- - Call Hooks from React function components.-->
 - 从React函数组件调用Hooks。
<!-- - Call Hooks from custom Hooks-->
 - 从自定义Hooks中调用Hooks

<!-- There's an existing [ESlint](https://www.npmjs.com/package/eslint-plugin-react-hooks) rule that can be used to verify that the application uses hooks correctly.-->
 有一个现有的[ESlint](https://www.npmjs.com/package/eslint-plugin-react-hooks)规则，可以用来验证应用是否正确使用钩子。

<!-- Create-react-app has the readily-configured rule [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks) that complains if hooks are used in an illegal manner:-->
 Create-react-app有一个现成的规则[eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks)，如果钩子被以非法的方式使用就会被投诉。

![](../../images/7/60ea.png)

### Custom hooks

<!-- React offers the option to create our own [custom](https://reactjs.org/docs/hooks-custom.html) hooks. According to React, the primary purpose of custom hooks is to facilitate the reuse of the logic used in components.-->
 React提供了创建我们自己的[自定义](https://reactjs.org/docs/hooks-custom.html)挂钩的选项。根据React的说法，自定义钩子的主要目的是促进组件中使用的逻辑的重用。

<!-- > <i>Building your own Hooks lets you extract component logic into reusable functions.</i>-->
 > <i>建立你自己的钩子让你将组件逻辑提取为可重用的函数。</i>


<!-- Custom hooks are regular JavaScript functions that can use any other hooks, as long as they adhere to the [rules of hooks](/en/part1/a_more_complex_state_debugging_react_apps#rules-of-hooks). Additionally, the name of custom hooks must start with the word _use_.-->
 自定义钩子是普通的JavaScript函数，可以使用任何其他钩子，只要它们遵守[钩子规则](/en/part1/a_more_complex_state_debugging_react_apps#rules-of-hooks)。此外，自定义钩子的名称必须以_use_这个词开头。


<!-- We implemented a counter application in [part 1](/en/part1/component_state_event_handlers#event-handling) that can have its value incremented, decremented, or reset. The code of the application is as follows:-->
 我们在[第一章节](/en/part1/component_state_event_handlers#event-handling)中实现了一个计数器应用，它的值可以递增、递减或重置。该应用的代码如下。

```js
import { useState } from 'react'
const App = (props) => {
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

<!-- Let's extract the counter logic into its own custom hook. The code for the hook is as follows:-->
 让我们把计数器的逻辑提取到它自己的自定义钩子中。该钩子的代码如下。

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

<!-- Our custom hook uses the _useState_ hook internally to create its own state. The hook returns an object, the properties of which include the value of the counter as well as functions for manipulating the value.-->
 我们的自定义钩子在内部使用_useState_钩子来创建自己的状态。该钩子返回一个对象，其属性包括计数器的值以及操作该值的函数。


<!-- React components can use the hook as shown below:-->
 React组件可以使用这个钩子，如下图所示。

```js
const App = (props) => {
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
 通过这样做，我们可以将_App_组件的状态和它的操作完全提取到_useCounter_钩子中。管理计数器的状态和逻辑现在是自定义钩子的责任。


<!-- The same hook could be <i>reused</i> in the application that was keeping track of the amount of clicks made to the left and right buttons:-->
 同样的钩子可以<i>重复使用</i>在应用中记录对左右按钮的点击量。

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
 应用创建了<i>两个</i>完全独立的计数器。第一个被分配到变量_left_，另一个被分配到变量_right_。


<!-- Dealing with forms in React is somewhat tricky. The following application presents the user with a form that requests the user to input their name, birthday, and height:-->
 在React中处理表单是有些棘手的。下面的应用向用户展示了一个表单，要求用户输入他们的名字、生日和身高。

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


<!-- Every field of the form has its own state. In order to keep the state of the form synchronized with the data provided by the user, we have to register an appropriate <i>onChange</i> handler for each of the <i>input</i> elements.-->
表单的每个字段都有自己的状态。为了使表单的状态与用户提供的数据保持同步，我们必须为每个<i>输入</i>元素注册一个适当的<i>onChange</i>处理程序。


<!-- Let's define our own custom _useField_ hook that simplifies the state management of the form:-->
 让我们定义自己的自定义_useField_钩子，简化表单的状态管理。

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
 该钩子函数接收输入字段的类型作为参数。该函数返回<i>输入</i>所需的所有属性：其类型、值和onChange处理程序。


<!-- The hook can be used in the following way:-->
这个钩子可以用以下方式使用。

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
 我们可以把事情再简化一下。因为_name_对象正好拥有<i>input</i>元素期望接收的所有属性作为props，我们可以用[spread syntax](https://reactjs.org/docs/jsx-in-depth.html#spread-attributes)以如下方式将props传递给该元素。

```js
<input {...name} />
```


<!-- As the [example](https://reactjs.org/docs/jsx-in-depth.html#spread-attributes) in the React documentation states, the following two ways of passing props to a component achieve the exact same result:-->
 正如React文档中的[示例](https://reactjs.org/docs/jsx-in-depth.html#spread-attributes)所说，以下两种向组件传递props的方式达到的结果完全相同。

```js
<Greeting firstName='Arto' lastName='Hellas' />

const person = {
  firstName: 'Arto',
  lastName: 'Hellas'
}

<Greeting {...person} />
```

<!-- The application gets simplified into the following format:-->
 应用被简化成以下格式。

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

<!-- Dealing with forms is greatly simplified when the unpleasant nitty-gritty details related to synchronizing the state of the form is encapsulated inside of our custom hook.-->
 当与同步表单状态有关的令人不快的细枝末节被封装在我们的自定义钩子中时，处理表单的工作就被大大简化。

<!-- Custom hooks are clearly not only a tool for reuse, they also provide a better way for dividing our code into smaller modular parts.-->
 自定义钩子显然不仅仅是一个重用的工具，它们还提供了一个更好的方法来将我们的代码划分为更小的模块化部分。

### More about hooks

<!-- The internet is starting to fill up with more and more helpful material related to hooks. The following sources are worth checking out:-->
 互联网开始充斥着越来越多与钩子有关的有用材料。下面这些资料值得一看。

<!-- * [Awesome React Hooks Resources](https://github.com/rehooks/awesome-react-hooks)-->
 * [Awesome React Hooks Resources](https://github.com/rehooks/awesome-react-hooks)
<!-- * [Easy to understand React Hook recipes by Gabe Ragland](https://usehooks.com/)-->
 * [Gabe Ragland的易懂的React Hook食谱](https://usehooks.com/)
<!-- * [Why Do React Hooks Rely on Call Order?](https://overreacted.io/why-do-hooks-rely-on-call-order/)-->
 * [为什么React Hooks要依靠调用顺序？](https://overreacted.io/why-do-hooks-rely-on-call-order/)

</div>

<div class="tasks">

### Exercises 7.4.-7.8.

<!-- We'll continue with the app from [exercises](/en/part7/react_router#exercises-7-1-7-3) of the chapter [react router](/en/part7/react_router).-->
 我们将继续使用[react router](/en/part7/react_router#exercises-7-1-7-3)一章中的应用。

#### 7.4: anecdotes and hooks step1

<!-- Simplify the anecdote creation form of your application with the _useField_ custom hook we defined earlier.-->
 用我们之前定义的_useField_自定义钩子简化你的应用的名言警句创建形式。

<!-- One natural place to save the custom hooks of your application is in the <i>/src/hooks/index.js</i> file.-->
保存你的应用的自定义钩子的一个自然位置是在<i>/src/hooks/index.js</i>文件。

<!-- If you use the [named export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export#Description) instead of the default export:-->
 如果你使用[命名导出](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export#Description)而不是默认导出。

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
 那么[导入](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)会以如下方式发生。

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
 在表单中添加一个按钮，你可以用它来清除所有的输入字段。

![](../../images/7/61ea.png)

<!-- Expand the functionality of the <i>useField</i> hook so that it offers a new <i>reset</i> operation for clearing the field.-->
扩展<i>useField</i>钩子的功能，使其提供一个新的<i>reset</i>操作来清除字段。

<!-- Depending on your solution, you may see the following warning in your console:-->
根据你的解决方案，你可能会在你的控制台看到以下警告。

![](../../images/7/62ea.png)

<!-- We will return to this warning in the next exercise.-->
 我们将在下一个练习中回到这个警告。

#### 7.6: anecdotes and hooks step3

<!-- If your solution did not cause a warning to appear in the console, you have already finished this exercise.-->
 如果你的解决方案没有导致控制台中出现警告，你已经完成了这个练习。

<!-- If you see the warning in the console, make the necessary changes to get rid of the _Invalid value for prop \`reset\` on \<input\> tag_ console warning.-->
 如果你在控制台中看到了警告，请进行必要的修改，以摆脱_prop `reset\` on \<input\> tag_控制台的无效值警告。

<!-- The reason for this warning is that after making the changes to your application, the following expression:-->
这个警告的原因是，在对你的应用进行修改后，以下表达式。

```js
<input {...content}/>
```

<!-- Essentially, is the same as this:-->
本质上，与此相同。

```js
<input
  value={content.value}
  type={content.type}
  onChange={content.onChange}
  reset={content.reset} // highlight-line
/>
```

<!-- The <i>input</i> element should not be given a <i>reset</i> attribute.-->
 <i>input</i>元素不应该被赋予一个<i>reset</i>属性。

<!-- One simple fix would be to not use the spread syntax and write all of the forms like this:-->
 一个简单的修复方法是不使用传播语法，把所有的表单都写成这样。

```js
<input
  value={username.value}
  type={username.type}
  onChange={username.onChange}
/>
```

<!-- If we were to do this, we would lose much of the benefit provided by the <i>useField</i> hook. Instead, come up with a solution that fixes the issue, but is still easy to use with spread syntax.-->
 如果我们这样做，我们会失去<i>useField</i>钩子所提供的大部分好处。取而代之的是，想出一个既能解决这个问题，又能方便使用传播语法的方案。

#### 7.7: country hook

<!-- Let's return to the exercises [2.12-14](/en/part2/getting_data_from_server#exercises-2-11-2-14).-->
 让我们回到练习[2.12-14](/en/part2/getting_data_from_server#exercises-2-11-2-14)。

<!-- Use the code from https://github.com/fullstack-hy2020/country-hook as your starting point.-->
 使用https://github.com/fullstack-hy2020/country-hook 中的代码作为你的出发点。

<!-- The application can be used to search for a country's details from the https://restcountries.com/ interface. If a country is found, the details of the country are displayed:-->
 该应用可用于从https://restcountries.com/ 界面搜索一个国家的详细信息。如果找到一个国家，就会显示这个国家的详细信息。

![](../../images/7/69ea.png)

<!-- If no country is found, a message is displayed to the user:-->
 如果没有找到国家，会向用户显示一条信息。

![](../../images/7/70ea.png)

<!-- The application is otherwise complete, but in this exercise you have to implement a custom hook _useCountry_, which can be used to search for the details of the country given to the hook as a parameter.-->
 该应用在其他方面是完整的，但在这个练习中，你必须实现一个自定义钩子_useCountry_，它可以用来搜索作为参数给钩子的国家的细节。

<!-- Use the api endpoint [full name](https://restcountries.com/#api-endpoints-v3-full-name) to fetch a country's details in a _useEffect_ hook within your custom hook.-->
 使用api端点[全名](https://restcountries.com/#api-endpoints-v2-full-name)在你的自定义钩子的_useEffect_钩子中获取一个国家的详细信息。

<!-- Note that in this exercise it is essential to use useEffect's [second parameter](https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect) array to control when the effect function is executed.-->
 注意在这个练习中，使用useEffect's [第二个参数](https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect)数组来控制效果函数的执行时间是很重要的。

#### 7.8: ultimate hooks

<!-- The code of the application responsible for communicating with the backend of the note application of the previous parts looks like this:-->
 负责与前面部分的笔记应用的后端通信的应用的代码如下所示：

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
  const response = await axios.put(`${ baseUrl } /${id}`, newObject)
  return response.data
}

export default { getAll, create, update, setToken }
```

<!-- We notice that the code is in no way specific to the fact that our application deals with notes. Excluding the value of the _baseUrl_ variable, the same code could be reused in the blog post application for dealing with the communication with the backend.-->
 我们注意到，这段代码绝不是针对我们的应用处理笔记的事实。除去_baseUrl_变量的值，同样的代码可以在博文程序中重复使用，用于处理与后端的通信。

<!-- Extract the code for communicating with the backend into its own _useResource_ hook. It is sufficient to implement fetching all resources and creating a new resource.-->
 将与后端通信的代码提取到它自己的_useResource_钩中。它足以实现获取所有资源和创建一个新的资源。

<!-- You can do the exercise for the project found in the https://github.com/fullstack-hy2020/ultimate-hooks repository. The <i>App</i> component for the project is the following:-->
 你可以为https://github.com/fullstack-hy2020/ultimate-hooks 仓库中的项目做练习。这个项目的<i>App</i>组件如下。

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
 _useResource_自定义钩子像状态钩子一样返回一个包含两个项目的数组。数组的第一项包含所有单独的资源，数组的第二项是一个对象，可用于操作资源集合，如创建新的资源。

<!-- If you implement the hook correctly, it can be used for both notes and phone numbers (start the server with the _npm run server_ command at the port 3005).-->
 如果你正确地实现了这个钩子，它可以同时用于笔记和电话号码（用_npm run server_命令启动服务器，端口为3005）。

![](../../images/5/21e.png)

</div>
