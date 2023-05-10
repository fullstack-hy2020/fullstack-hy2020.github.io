---
mainImage: ../../../images/part-9.svg
part: 9
letter: f
lang: zh
---

<div class="tasks">

<!-- **NOTE**: this is the old section about Patientor frontend that was replaced 12th February 2023, with [this chapter](/en/part9/grande_finale_patientor_frontend). In the change, the Patientor frontend structure was refactored to a simpler form that makes it much easier to focus on learning TypeScript.-->
**注意**：这是2023年2月12日被[本章节](/en/part9/grande_finale_patientor_frontend)取代的关于Patientor前端的旧部分。在改变中，Patientor前端结构被重构为一种更简单的形式，使其变得更容易专注于学习TypeScript。

<!-- If you have started doing the exercises with the old Patientor, you may continue with this section. If not, then it is recommended to use the "new" patientor. This section remains here for a couple of weeks.-->
如果你已经开始使用旧的Patientor做练习，你可以继续这一部分。如果没有，建议使用“新”的Patientor。这一部分将在这里保留几个星期。
</div>

<div class="content">

### Working with an existing codebase

<!-- When diving into an existing codebase for the first time, it is good to get an overall view of the conventions and structure of the project. You can start your research by reading the <i>README.md</i> in the root of the repository. Usually, the README contains a brief description of the application and the requirements for using it, as well as how to start it for development.-->
当第一次深入研究现有代码库时，最好先了解项目的约定和结构。您可以通过阅读存储库根目录中的<i>README.md</i>开始研究。通常，README包含应用程序的简要描述和使用要求，以及如何开始开发。
<!-- If the README is not available or someone has "saved time" and left it as a stub, you can take a peek at the <i>package.json</i>.-->
如果没有可用的README或者有人“节省时间”只留下一个桩，你可以看一看<i>package.json</i>。
<!-- It is always a good idea to start the application and click around to verify you have a functional development environment.-->
**总是有一个好主意，去启动应用程序，点击环境中的各个部分来验证你有一个可用的开发环境。**

<!-- You can also browse the folder structure to get some insight into the application''s functionality and/or the architecture used. These are not always clear, and the developers might have chosen a way to organize code that is not familiar to you. The [sample project](https://github.com/fullstack-hy2020/old-patientor) used in the rest of this part is organized, feature-wise. You can see what pages the application has, and some general components, e.g. modals and state. Keep in mind that the features may have-->
been split up into multiple files.

你也可以浏览文件夹结构，以便对应用程序的功能和/或所使用的架构有更深入的了解。这些不一定很明确，开发人员可能选择了一种对代码进行组织的方式，这对你来说可能不太熟悉。本部分所使用的[样例项目](https://github.com/fullstack-hy2020/old-patientor)是按功能组织的。您可以查看应用程序有哪些页面，以及一些常见的组件，例如模态和状态。请记住，功能可能分割到多个文件中。
<!-- different scopes. For example, modals are visible UI-level components whereas the state is comparable to business logic and keeps the data organized under the hood for the rest of the app to use.-->
例如，模态是可见的UI级组件，而状态可以比作业务逻辑，并且为应用程序的其余部分提供了在后台组织数据的功能。

<!-- TypeScript provides types for what kind of data structures, functions, components, and state to expect.  You can try looking for <i>types.ts</i> or something similar to get started. VSCode is a big help and simply highlighting variables and parameters can provide quite a lot of insight. All this naturally depends on how types are used in the project.-->
TypeScript 提供了类型来定义数据结构、函数、组件和状态。你可以尝试查找 <i>types.ts</i> 或类似的文件来开始。VSCode 很有帮助，只需简单地高亮变量和参数就可以获得很多信息。所有这些自然取决于该项目中如何使用类型。

<!-- If the project has unit, integration or end-to-end tests, reading those is most likely beneficial. Test cases are your most important tool when refactoring or adding new features to the application. You want to make sure not to break any existing features when hammering around the code. TypeScript can also give you guidance with argument and return types when changing the code.-->
如果项目有单元、集成或端到端测试，阅读这些很可能是有益的。 当重构或向应用程序添加新功能时，测试用例是您最重要的工具。 您希望确保在敲打代码时不会破坏任何现有功能。 当更改代码时，TypeScript还可以为您提供参数和返回类型的指导。

<!-- Remember that reading code is a skill in itself, so don't worry if you don't understand the code on your first readthrough.  The code may have a lot of corner cases, and pieces of logic may have been added here and there throughout its development cycle. It is hard to imagine what kind of problems the previous developer has wrestled with. Think of it all like [growth rings in trees](https://en.wikipedia.org/wiki/Dendrochronology#Growth_rings). Understanding everything requires digging deep into the code and business domain requirements. The more code you read, the better you will be at understanding it. You will most likely read far more code than you are going to produce throughout your life.-->
记住阅读代码本身就是一种技能，所以即使你第一次阅读代码时不明白，也不用担心。代码可能有很多特殊情况，并且在开发周期中可能会添加很多逻辑。很难想象之前的开发者经历了什么样的问题。把它们想象成[树木的生长环](https://en.wikipedia.org/wiki/Dendrochronology#Growth_rings)。要理解所有的东西需要深入研究代码和业务领域要求。你阅读的代码越多，你就越能够理解它。你一生中阅读的代码可能要比你编写的代码多得多。

### Patientor frontend

<!-- It''s time to get our hands dirty finalizing the frontend for the backend we built in [exercises 9.8.-9.13](/en/part9/typing_the_express_app).-->
是时候让我们把前端最终完善起来了，我们在[练习9.8.-9.13]中构建了后端。

<!-- Before diving into the code, let us start both the frontend and the backend.-->
在深入研究代码之前，让我们先启动前端和后端。

<!-- If all goes well, you should see a patient listing page. It fetches a list of patients from our backend, and renders it to the screen as a simple table. There is also a button for creating new patients on the backend. As we are using mock data instead of a database, the data will not persist - closing the backend will delete all the data we have added. UI design has not been a strong point of the creators, so let''s disregard the UI for now.-->
如果一切顺利，你应该会看到一个患者列表页面。它从我们的后端获取一个患者列表，并将其渲染到屏幕上作为一个简单的表格。还有一个按钮可以在后端创建新的患者。由于我们使用的是模拟数据而不是数据库，因此数据不会保留 - 关闭后端将删除我们添加的所有数据。UI设计不是创造者的强项，所以现在我们忽略UI。

<!-- After verifying that everything works, we can start studying the code. All the interesting stuff resides in the <i>src</i> folder. For your convenience, there is already a <i>types.ts</i> file for basic types used in the app, which you will have to extend or refactor in the exercises.-->
经过验证一切正常后，我们可以开始学习代码了。所有有趣的东西都在<i>src</i>文件夹中。为了方便起见，应用程序中使用的基本类型已经有一个<i>types.ts</i>文件，你将在练习中对其进行扩展或重构。

<!-- In principle, we could use the same types for both backend and frontend, but usually, the frontend has different data structures and use cases for the data, which causes the types to be different.-->
在原则上，我们可以对后端和前端使用相同的类型，但通常情况下，前端有不同的数据结构和数据使用案例，这导致类型不同。
<!-- For example, the frontend has a state and may want to keep data in objects or maps whereas the backend uses an array. The frontend might also not need all the fields of a data object saved in the backend, and it may need to add some new fields to use for rendering.-->
例如，前端有一个状态，可能希望将数据保存在对象或映射中，而后端使用数组。前端可能不需要后端保存的数据对象的所有字段，它可能需要添加一些新字段来用于渲染。

<!-- The folder structure looks as follows:-->
文件夹结构如下：

![vscode folder structure for patientor](../../images/9/34a.png)

<!-- As you would expect, there are currently two main components: *AddPatientModal* and *PatientListPage*. The <i>state</i> folder contains state handling for the frontend.-->
*AddPatientModal* 和 *PatientListPage* 是目前的两个主要组件。<i>state</i> 文件夹包含前端的状态处理。
<!-- The main functionality of the code in the <i>state</i> folder is to keep our data in one place and offer simple actions to alter the state of our app.-->
<i>state</i> 文件夹中的代码的主要功能是将我们的数据集中在一个地方，并且提供简单的操作来改变我们应用的状态。

### State handling

<!-- Let''s study the state handling a bit closer as a lot of stuff seems to be happening under the hood and it differs a bit from the methods used in the course so far.-->
让我们更仔细地研究一下状态处理，因为似乎在幕后发生了很多事情，而且它与迄今为止课程中使用的方法有些不同。

<!-- The state management is built using the React Hooks [useContext](https://reactjs.org/docs/hooks-reference.html#usecontext) and [useReducer](https://reactjs.org/docs/hooks-reference.html#usereducer). This is quite a good setup because we know the app will be rather small and we don''t want to use <i>redux</i> or other similar libraries for state management.-->
使用 React Hooks [useContext](https://reactjs.org/docs/hooks-reference.html#usecontext) 和 [useReducer](https://reactjs.org/docs/hooks-reference.html#usereducer) 来构建状态管理。这是一个很好的设置，因为我们知道应用程序将相当小，而且我们不想使用<i>redux</i> 或其他类似的库来进行状态管理。
<!-- There are a lot of good materials, like [this article](https://medium.com/@seantheurgel/react-hooks-as-state-management-usecontext-useeffect-usereducer-a75472a862fe), about this approach to state management.-->
有很多很棒的材料，例如[这篇文章](https://medium.com/@seantheurgel/react-hooks-as-state-management-usecontext-useeffect-usereducer-a75472a862fe)，讲述了这种状态管理方式。

<!-- The approach taken in this app uses the React [context](https://reactjs.org/docs/context.html) that, according to its documentation:-->
此应用程序采用的方法使用了React[上下文](https://reactjs.org/docs/context.html)，根据其文档：

<!-- > <i>... is designed to share data that can be considered "global" for a tree of React components, such as the current authenticated user, theme, or preferred language.</i>-->
> <i>...被设计用来分享可以被认为是 React 组件树的“全局”数据，比如当前认证用户、主题或者首选语言。</i>

<!-- In our case, the "global", shared data is the application state <i>and</i> the dispatch function that is used to make changes to data. In many ways, our code works much like the Redux-based state management we used in [part 6](/en/part6), but is more lightweight since it does not require the use of any external libraries. This part assumes that you are at least familiar with the way Redux works, e.g. you should have covered at least [the first section](/en/part6/flux_architecture_and_redux) of part 6.-->
在我们的情况下，“全局”的共享数据是应用程序状态<i>和</i>用于对数据进行更改的dispatch函数。在许多方面，我们的代码与我们在[第6章节](/en/part6)中使用的基于Redux的状态管理类似，但更轻量级，因为它不需要使用任何外部库。本部分假定您至少熟悉Redux的工作方式，例如，您应该至少覆盖[第一节](/en/part6/flux_architecture_and_redux)的内容。

<!-- The [context](https://reactjs.org/docs/context.html) of our application has a tuple containing the app state and the dispatcher for changing the state.-->
[上下文](https://reactjs.org/docs/context.html) 我们应用程序的上下文具有一个元组，其中包含应用程序状态和更改状态的调度程序。
<!-- The application state is typed as follows:-->
应用状态如下所示：

```js
export type State = {
  patients: { [id: string]: Patient };
};
```

<!-- The state is an object with one key, *patients*, which has a [dictionary](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html) or simply put an object with string keys and with *Patient* objects as values. The index can only be a *string* or a *number* as you can access the object values using those. This enforces that the state conforms to the form we want, and prevents developers from misusing the state.-->
状态是一个对象，具有一个关键字*患者*，它具有一个[字典](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)或简单地说是一个具有字符串键的对象，并具有*Patient*对象作为值。索引只能是*字符串*或*数字*，因为您可以使用这些访问对象值。这强制状态符合我们想要的形式，并防止开发人员滥用状态。

<!-- But be aware of one thing! When a type is declared like the type for *patients*, TypeScript does not have any way of knowing if the key you are trying to access exists or not. So if we were to try to access a patient by a non-existing id, the compiler would think that the returned value is of type *Patient* and no error would be thrown when trying to access its properties:-->
但要注意一件事！当像*患者*这样声明类型时，TypeScript没有任何办法知道您要访问的键是否存在。因此，如果我们试图通过一个不存在的id访问患者，编译器会认为返回的值的类型是*患者*，并且在尝试访问其属性时不会抛出错误：

```js
const myPatient = state.patients['non-existing-id'];
console.log(myPatient.name); // no error, TypeScript believes that myPatient is of type Patient
```

<!-- To fix this, we could define the type for patient values to be a union of *Patient* and *undefined* in the following way:-->
解决这个问题，我们可以用以下方式定义患者值的类型为*Patient*和*undefined*的联合：

```js
export type State = {
  patients: { [id: string]: Patient | undefined };
};
```

<!-- That would cause the compiler to give the following warning:-->
这会导致编译器给出以下警告：

```js
const myPatient = state.patients['non-existing-id'];
console.log(myPatient.name); // error, Object is possibly 'undefined'
```

<!-- This type of additional type security is always good to implement if you e.g. use data from external sources or use the value of a user input to access data in your code. But if you are sure that you only handle data that actually exists, then there is no one stopping you from using the first presented solution.-->
这种额外的类型安全总是很好的实施，如果你使用来自外部源的数据或者使用用户输入的值来访问代码中的数据。但是如果你确定只处理实际存在的数据，那么没有人阻止你使用第一个提出的解决方案。

<!-- Even though we are not using them in this course part, it is good to mention that a more type-strict way would be to use [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) objects, to which you can declare a type for both the key and the content. The Map''s accessor function *get()* always returns a union of the declared value type and undefined, so TypeScript automatically requires you to perform validity checks on data retrieved from a map:-->
即使我们在这个课程部分不使用它们，但是提一下更类型严格的方式是使用[Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)对象，你可以为键和内容都声明一种类型。Map的访问函数*get()*总是返回声明的值类型和undefined的联合，所以TypeScript自动要求你对从Map中获取的数据进行有效性检查。

```js
interface State {
  patients: Map<string, Patient>;
}
...
const myPatient = state.patients.get('non-existing-id'); // type for myPatient is now Patient | undefined
console.log(myPatient.name); // error, Object is possibly 'undefined'

console.log(myPatient?.name); // valid code, but will log 'undefined'
```

<!-- Just like with redux, all state manipulation is done by a reducer. It is defined in the file <i>reducer.ts</i> along with the type *Action*, which looks as follows:-->
就像使用Redux一样，所有状态操作都是由一个Reducer完成的。它在<i>reducer.ts</i>文件中定义，其中还有类型*Action*，如下所示：

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

<!-- The reducer looks quite similar to the ones we wrote in [part 6](/en/part6/many_reducers#combined-reducers) before we started to use the Redux Toolkit. It changes the state for each type of action:-->
紅ucer看起來非常類似於我們在[第6章节](/en/part6/many_reducers#combined-reducers)之前寫的那些，在我們開始使用Redux Toolkit之前。 它會根據每種類型的動作更改狀態：

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

<!-- The main difference is that the state is now a dictionary (or an object), instead of the array that we used in [part 6](/en/part6/flux_architecture_and_redux#pure-functions-immutable).-->
主要的不同之处在于状态现在是一个字典（或对象），而不是我们在[第6章节](/en/part6/flux_architecture_and_redux#pure-functions-immutable)中使用的数组。

<!-- There are a lot of things happening in the file <i>state.tsx</i>, which takes care of setting up the context.-->
在文件<i>state.tsx</i>中发生了很多事情，它负责设置上下文。
<!-- The main ingredient is the [useReducer](https://reactjs.org/docs/hooks-reference.html#usereducer) hook-->
主要成分是[useReducer](https://reactjs.org/docs/hooks-reference.html#usereducer)钩子
<!-- used to create the state and the dispatch function, and pass them on to the [context provider](https://reactjs.org/docs/context.html#contextprovider):-->
使用[上下文提供者](https://reactjs.org/docs/context.html#contextprovider)创建状态和派发函数，并将它们传递给它：

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

<!-- The provider makes the *state* and the *dispatch* functions available in all of the components, thanks to the setup in <i>index.tsx</i>:-->
依据<i>index.tsx</i>的设置，提供者在所有组件中都提供了*state*和*dispatch*函数：

```js
import { reducer, StateProvider } from "./state";

ReactDOM.render(
  <StateProvider reducer={reducer}>
    <App />
  </StateProvider>,
  document.getElementById('root')
);
```

<!-- It also defines the *useStateValue* hook:-->
它还定义了*useStateValue*钩子：

```js
export const useStateValue = () => useContext(StateContext);
```

<!-- and the components that need to access the state or dispatcher use it to get hold of those:-->
以及需要访问状态或调度程序的组件可以使用它来获取它们：

```js
import { useStateValue } from "../state";

// ...

const PatientListPage = () => {
  const [{ patients }, dispatch] = useStateValue();
  // ...
}
```

<!-- Don't worry if this seems confusing; it will be until you have studied the [context's documentation](https://reactjs.org/docs/context.html) and its use in [state management](https://medium.com/@seantheurgel/react-hooks-as-state-management-usecontext-useeffect-usereducer-a75472a862fe). You do not need to understand all this completely to do the exercises!-->
不要担心这看起来有点混乱；只有在你学习了[上下文文档](https://reactjs.org/docs/context.html)以及它在[状态管理](https://medium.com/@seantheurgel/react-hooks-as-state-management-usecontext-useeffect-usereducer-a75472a862fe)中的使用后，才会明白。你不需要完全理解这一切才能做练习！

<!-- It is quite common that when you start working on an existing codebase, you do not understand 100% of what happens under the hood in the beginning. If the app has been properly structured (and it has a proper set of tests), you can trust that if you make careful modifications, the app still works despite not understanding all the internal mechanisms. Over time, you will get a grasp on the more unfamiliar parts, but it does not happen overnight when working with a large codebase.-->
当你开始在一个现有的代码库上工作时，一开始不会完全理解其中发生的事情是很常见的。如果应用程序结构良好（并且有一套适当的测试），你可以相信，即使不理解所有内部机制，如果你做出谨慎的修改，应用程序仍然可以正常工作。随着时间的推移，你会更加熟悉那些不熟悉的部分，但是在使用大型代码库时，这不是一夜之间可以完成的。

### Patient listing page

<!-- Let's go through the <i>PatientListPage/index.tsx</i> as you can take inspiration from there to help you fetch data from the backend and update the application's state.-->
让我们一起浏览一下<i>PatientListPage/index.tsx</i>，你可以从那里得到灵感来帮助你从后端获取数据并更新应用程序的状态。
<!-- *PatientListPage* uses our custom hook to inject the state and the dispatcher for updating it.-->
*PatientListPage* 使用我们的自定义钩子注入状态和更新它的调度程序。
<!-- When we list the patients, we only need to destructure the *patients* property from the state:-->
当我们列出患者时，我们只需要从状态中解构*患者*属性：

```js
import { useStateValue } from "../state";

const PatientListPage = () => {
  const [{ patients }, dispatch] = useStateValue();
  // ...
}
```

<!-- We also use the app state created with the *useState* hook for managing modal visibility and form error handling:-->
我们也使用*useState*钩子创建的应用状态来管理模态可见性和表单错误处理：

```js
const [modalOpen, setModalOpen] = React.useState<boolean>(false);
const [error, setError] = React.useState<string | undefined>();
```

<!-- We give the *useState* hook a type parameter, which is then applied to the actual state. So *modalOpen* is a *boolean* while *error* has the type *string | undefined*.-->
我们给*useState* hook 一个类型参数，然后应用到实际的状态上。所以*modalOpen* 是一个*boolean*，而*error*有类型*string | undefined*。
<!-- Both set functions returned by the *useState* hook are functions that accept only arguments according to the type parameter given, eg. the exact type for *setModalOpen* function is `React.Dispatch<React.SetStateAction<boolean>>`.-->
两个由*useState*钩子返回的设置函数只接受根据给定的类型参数指定的参数，例如，*setModalOpen*函数的确切类型是`React.Dispatch<React.SetStateAction<boolean>>`。

<!-- We also have the *openModal* and *closeModal* helper functions for better readability and convenience:-->
我们也有*openModal*和*closeModal*辅助函数，以提高可读性和便利性：

```js
const openModal = (): void => setModalOpen(true);

const closeModal = (): void => {
  setModalOpen(false);
  setError(undefined);
};
```

<!-- The frontend''s types are based on what you have created when developing the backend in the previous part.-->
前端的类型是基于你在前面部分开发后端时创建的内容。

<!-- When the component *App* mounts, it fetches patients from the backend using [Axios](https://github.com/axios/axios). Note how we are giving the *axios.get* function a type parameter to describe the type of the response data:-->
当组件 *App* 挂载时，它会使用 [Axios](https://github.com/axios/axios) 从后端获取患者。注意我们给 *axios.get* 函数传入一个类型参数来描述响应数据的类型：

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

<!-- **A word of warning!** Passing a type parameter to Axios will not validate any data. It is quite dangerous especially if you are using external APIs. You can create custom validation functions that take in the whole payload and return the correct type, or you can use a type guard. Both are valid options. Many libraries also provide validation through different kinds of schemas (e.g. [io-ts](https://gcanti.github.io/io-ts/)). For simplicity''s sake, we will continue to trust our work and trust that we will get data of the correct form from the backend.-->
**警告！** 将类型参数传递给Axios不会验证任何数据。 如果您使用外部API，这非常危险。 您可以创建自定义验证函数，接收整个有效负载并返回正确的类型，或者您可以使用类型检查。 两者都是有效的选项。 许多库也通过不同类型的模式（例如[io-ts]（https://gcanti.github.io/io-ts/））提供验证。 为了简单起见，我们将继续信任我们的工作，并相信我们会从后端获得正确形式的数据。

<!-- As our app is quite small, we will update the state by simply calling the *dispatch* function provided to us by the *useStateValue* hook.-->
随着我们的应用程序相当小，我们将通过* useStateValue*钩子提供给我们的* dispatch*函数来更新状态。
<!-- The compiler helps by making sure that we dispatch actions according to our *Action* type with a predefined type string and payload:-->
编译器通过确保我们根据*Action*类型以预定义的类型字符串和有效负载来分发操作而发挥作用：

```js
dispatch({ type: "SET_PATIENT_LIST", payload: patients });
```

</div>

<div class="tasks">

### Exercises 9.20-9.22

<!-- We will soon add a new type for our app, *Entry*, which represents a lightweight patient journal entry. It consists of a journal text, i.e. a *description*, a creation date, information regarding the specialist who created it and possible diagnosis codes. Diagnosis codes map to the ICD-10 codes returned from the <i>/api/diagnoses</i> endpoint. Our naive implementation will be that a patient has an array of entries.-->
我们很快会为我们的应用程序添加一种新类型*Entry*，它表示一个轻量级的病人日记条目。它由日记文本，即*描述*，创建日期，有关创建它的专家的信息以及可能的诊断码组成。诊断码映射到从<i>/api/diagnoses</i>端点返回的ICD-10码。我们的初步实现是病人有一个条目数组。

<!-- Before going into this, let us do some preparatory work.-->
在正式进入之前，让我们先做一些准备工作。

#### 9.20: patientor, step1

<!-- Create an endpoint <i>/api/patients/:id</i>  that returns all of the patient information for one patient, including the array of patient entries that is still empty for all the patients. For the time being, expand the backend types as follows:-->
创建一个端点<i>/api/patients/:id</i>，返回一个患者的所有信息，包括目前所有患者的空数组患者条目。暂时，将后端类型扩展如下：

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

<!-- The response should look as follows:-->
**跟随如下步骤：**

1. 打开浏览器
2. 输入网址
3. 点击搜索按钮

![browser showing entries blank array when accessing patient](../../images/9/38a.png)

#### 9.21: patientor, step2

<!-- Create a page for showing a patient''s full information in the frontend.-->
在前端建立一个用于展示患者完整信息的页面。

<!-- The user should be able to access a patient's information by clicking the patient's name.-->
用户应该能够通过点击患者的姓名来访问患者的信息。

<!-- Fetch the data from the endpoint created in the previous exercise. After fetching the patient information from the backend, add the fetched information to the application's state. Do not fetch the information if it already is in the app state (i.e. if the user is visiting the same patient's information many times).-->
从前面练习中创建的端点获取数据。从后端获取患者信息后，将获取的信息添加到应用程序的状态中。如果信息已经在应用程序状态中（即用户多次访问同一个患者的信息），则不要获取信息。

<!-- Since we now have the state in the context, you'll need to define a new action type for updating an individual patient's data.-->
既然我们现在已经有了状态的上下文，您需要为更新个人患者数据定义一种新的操作类型。

<!-- The Application uses [MaterialUI](https://material-ui.com/) for styling, which we covered in [part 7](/en/part7/more_about_styles). You may also use it for the new components but that is up to you since our main focus now is TypeScript.-->
应用程序使用[MaterialUI](https://material-ui.com/)来进行样式设置，我们在[第7章节](/en/part7/more_about_styles)中有所涉及。您也可以使用它来创建新组件，但这取决于您，因为我们现在的主要重点是TypeScript。

<!-- The Application also uses [React Router](https://reactrouter.com/en/main/start/tutorial) to control which view is visible in the frontend. You might want to have a look at [part 7](/en/part7/react_router) if you don''t yet have a grasp on how the router works.-->
应用程序还使用[React Router](https://reactrouter.com/en/main/start/tutorial)来控制前端可见的视图。如果您尚未弄清路由器的工作原理，您可能希望查看[第7章节](/en/part7/react_router)。

<!-- The result could look like this:-->
# 结果可能看起来像这样：

![browser showing patientor with one patient](../../images/9/39x.png)

<!-- Example uses [Material UI Icons](https://mui.com/components/material-icons/) to represent genders.-->
例如使用[Material UI Icons](https://mui.com/components/material-icons/)来代表性别。

<!-- **Note** that to access the id in the URL, you need to give [useParams](https://reactrouter.com/en/main/hooks/use-params) a proper type argument:-->
注意，要访问URL中的ID，你需要给[useParams](https://reactrouter.com/en/main/hooks/use-params)一个正确的类型参数：

```js
const { id } = useParams<{ id: string }>();
```

#### 9.22: Patientor, step3

<!-- Currently, we create *action* objects wherever we dispatch actions, e.g. the *App* component has the following:-->
目前，我们在派发动作时都会创建*动作*对象，例如*应用*组件有以下内容：

```js
dispatch({
  type: "SET_PATIENT_LIST", payload: patientListFromApi
});
```

<!-- Define [action creator functions](/en/part6/flux_architecture_and_redux#action-creators) in the file <i>src/state/reducer.ts</i> and refactor the code to use them.-->
在文件<i>src/state/reducer.ts</i>中定义[动作创建函数](/en/part6/flux_architecture_and_redux#action-creators)，并重构代码以使用它们。

<!-- For example, the *App* should become like the following:-->
例如，*应用*应该变得如下：

```js
import { useStateValue, setPatientList } from "./state";

// ...

dispatch(setPatientList(patientListFromApi));
```

</div>

<div class="content">

### Full entries

<!-- In [exercise 9.10](/en/part9/typing_an_express_app#exercises-9-10-9-11) we implemented an endpoint for fetching information about various diagnoses, but we are still not using that endpoint at all.-->
在[练习9.10](/en/part9/typing_an_express_app#exercises-9-10-9-11)中，我们实现了一个用于获取有关各种诊断信息的端点，但我们仍然没有使用该端点。
<!-- Since we now have a page for viewing a patient''s information, it would be nice to expand our data a bit.-->
自从我们现在有一个查看病人信息的页面，扩充一下我们的数据会很好。
<!-- Let's add an *Entry* field to our patient data so that a patient's data contains their medical entries, including possible diagnoses.-->
让我们为我们的病人数据添加一个*条目*字段，以便病人的数据包括他们的医疗条目，包括可能的诊断。

<!-- Let''s ditch our old patient seed data from the backend and start using [this expanded format](https://github.com/fullstack-hy/misc/blob/master/patients.ts).-->
让我们抛弃我们后端的旧患者种子数据，开始使用[这种扩展格式](https://github.com/fullstack-hy/misc/blob/master/patients.ts)。

<!-- **Notice:** This time, the data is not in the .json format but instead in the .ts format. You should already have the complete *Gender* and *Patient* types implemented, so only correct the paths where they are imported from if needed.-->
**通知：** 这次，数据不是以.json格式而是以.ts格式。您应该已经实现了完整的*性别*和*患者*类型，因此，只需要修正它们导入的路径即可。

<!-- Let us now create a proper *Entry* type based on the data we have.-->
让我们根据我们拥有的数据现在创建一个合适的*Entry*类型。

<!-- If we take a closer look at the data, we can see that the entries are quite different from one another. For example, let''s take a look at the first two entries:-->
如果我们仔细看一下数据，就会发现条目彼此有很大的不同。例如，让我们来看一下前两个条目：

```js
{
  id: 'd811e46d-70b3-4d90-b090-4535c7cf8fb1',
  date: '2015-01-02',
  type: 'Hospital',
  specialist: 'MD House',
  diagnosisCodes: ['S62.5'],
  description:
    "Healing time appr. 2 weeks. patient doesn''t remember how he got the injury.",
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

<!-- Immediately, we can see that while the first few fields are the same, the first entry has a *discharge* field and the second entry has *employerName* and *sickLeave* fields.-->
立刻，我们可以看到，前几个字段是相同的，第一个条目有一个*放电*字段，而第二个条目有*雇主名称*和*病假*字段。
<!-- All the entries seem to have some fields in common, but some fields are entry-specific.-->
所有的条目似乎都有一些共同的字段，但有些字段是特定于条目的。

<!-- When looking at the *type*, we can see that there are three kinds of entries: *OccupationalHealthcare*, *Hospital* and *HealthCheck*.-->
当看到*类型*时，我们可以看到有三种条目：*职业保健*、*医院*和*健康检查*。
<!-- This indicates we need three separate types. Since they all have some fields in common, we might just want to create a base entry interface that we can extend with the different fields in each type.-->
这表明我们需要三种不同的类型。由于它们都有一些共同的字段，我们可能只需要创建一个基本的条目界面，我们可以用每种类型的不同字段来扩展它。

<!-- When looking at the data, it seems that the fields *id*, *description*, *date* and *specialist* are something that can be found in each entry. On top of that, it seems that *diagnosisCodes* is only found in one *OccupationalHealthcare* and one *Hospital* type entry. Since it is not always used even in those types of entries, it is safe to assume that the field is optional. We could consider adding it to the *HealthCheck* type as well-->
.

当查看数据时，似乎*id*、*description*、*date*和*specialist*是每个条目中都可以找到的东西。除此之外，似乎*diagnosisCodes*只在一个*OccupationalHealthcare*和一个*Hospital*类型条目中可以找到。由于即使在这些类型的条目中也不总是使用它，因此可以断定该字段是可选的。我们可以考虑将它添加到*HealthCheck*类型中。
<!-- since it might just not be used in these specific entries.-->
因为它可能不会在这些特定的条目中使用。

<!-- So our *BaseEntry* from which each type could be extended would be the following:-->
那么我们可以从每种类型都可以继承的*BaseEntry*开始，如下：

```js
interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: string[];
}
```

<!-- If we want to finetune it a bit further, since we already have a *Diagnosis* type defined in the backend, we might just want to refer to the code field of the *Diagnosis* type directly in case its type ever changes.-->
如果我们想再细微调整一下，既然后端已经定义了一个*诊断*类型，我们可能只想在*诊断*类型的代码字段中直接引用，以防它的类型发生变化。
<!-- We can do that like so:-->
我们可以这样做：

```js
interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis['code']>;
}
```

<!-- As you might remember, _Array<Type>_ is just an alternative way to say *Type[]*. In cases like this, it is just much clearer to use the array convention since the other option would be to define the type by saying *Diagnosis['code'][]* which starts to look a bit strange.-->
当你可能记得， _Array<Type>_ 只是另一种方式来表达 *Type[]*。 在这种情况下，最好使用数组约定，因为另一种选择就是定义类型，比如 *Diagnosis['code'][]*，这看起来有点奇怪。

<!-- Now that we have the *BaseEntry* defined, we can start creating the extended entry types we will actually be using. Let''s start by creating the *HealthCheckEntry* type.-->
现在我们已经定义了*BaseEntry*，我们可以开始创建我们实际使用的扩展条目类型。让我们从创建*HealthCheckEntry*类型开始。

<!-- Entries of type *HealthCheck* contain the field *HealthCheckRating*, which is an integer from 0 to 3, zero meaning *Healthy* and 3 meaning *CriticalRisk*. This is a perfect case for an enum definition.-->
条目类型*HealthCheck*包含字段*HealthCheckRating*，它是一个从0到3的整数，0意味着*Healthy*，3意味着*CriticalRisk*。这是枚举定义的完美案例。
<!-- With these specifications we could write a *HealthCheckEntry* type definition like so:-->
用这些规格，我们可以这样写一个*HealthCheckEntry*类型定义：

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

<!-- Now we only need to create the *OccupationalHealthcareEntry* and *HospitalEntry* types so we can combine them in a union and export them as an Entry type like this:-->
现在我们只需要创建*职业保健入口*和*医院入口*类型，这样我们就可以将它们结合在一个联合体中，并将它们作为Entry类型导出，如下所示：

```js
export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry;
```

<!-- An important point concerning unions is that, when you use them with *Omit* to exclude a property, it works in a possibly unexpected way. Suppose we want to remove the *id* from each *Entry*. We could think of using *Omit<Entry, 'id'>*, but [it wouldn't work as we might expect](https://github.com/microsoft/TypeScript/issues/42680). In fact, the resulting type would only contain the common properties, but not the ones they don't share. A possible workaround is to define a special Omit-like function to deal with such situations:-->
重要的一点关于联合类型是，当你使用*Omit*来排除一个属性时，它的工作方式可能会出乎意料。假设我们想从每个*Entry*中删除*id*。我们可以考虑使用*Omit<Entry, 'id'>*，但[它不会按照我们期望的方式工作](https://github.com/microsoft/TypeScript/issues/42680)。事实上，所得到的类型只包含它们共有的属性，而不包括它们不共有的属性。一个可能的解决方案是定义一个特殊的类似Omit的函数来处理这种情况：

```ts
// Define special omit for unions
type UnionOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T, K> : never;
// Define Entry without the 'id' property
type EntryWithoutId = UnionOmit<Entry, 'id'>;
```

</div>

<div class="tasks">

### Exercises 9.23-9.26

#### 9.23: Patientor, step4

<!-- Define the types *OccupationalHealthcareEntry* and *HospitalEntry* so that those conform with the example data. Ensure that your backend returns the entries properly when you go to an individual patient''s route:-->
定义类型*OccupationalHealthcareEntry*和*HospitalEntry*，以符合示例数据。确保当您访问个别患者路由时，您的后端正确返回条目：

*OccupationalHealthcareEntry*：职业保健条目是指为解决职业相关健康问题而提供的医疗服务，包括但不限于诊断，治疗，康复和预防服务。

*HospitalEntry*：医院条目是指针对疾病，伤害和其他健康问题而提供的医疗服务，包括但不限于诊断，治疗，康复和预防服务。

![browser shoiwing entries json data properly for patient](../../images/9/40.png)

<!-- Use types properly in the backend! For now, there is no need to do a proper validation for all the fields of the entries in the backend, it is enough e.g. to check that the field *type* has a correct value.-->
使用后端正确的类型！目前，没有必要在后端对所有字段进行正确的验证，只需要检查*类型*字段是否具有正确的值即可。

#### 9.24: Patientor, step5

<!-- Extend a patient's page in the frontend to list the *date*, *description* and *diagnoseCodes* of the patient's entries.-->
在前端延伸一个患者的页面，列出患者条目的*日期*、*描述*和*诊断码*。

<!-- You can use the same type definition for an *Entry* in the frontend. For these exercises, it is enough to just copy/paste the definitions from the backend to the frontend.-->
你可以在前端使用相同的*Entry*类型定义。 对于这些练习，只需从后端复制/粘贴定义即可。

<!-- Your solution could look like this:-->
你的解决方案可能看起来像这样：

![browser showing list of diagnosis codes for patient](../../images/9/41.png)

#### 9.25: Patientor, step6

<!-- Fetch and add diagnoses to the application state from the <i>/api/diagnoses</i> endpoint. Use the new diagnosis data to show the descriptions for patient''s diagnosis codes:-->
从<i>/api/diagnoses</i>端点获取并将诊断添加到应用程序状态中。使用新的诊断数据来显示患者诊断码的描述：

![browser showing list of codes and their descriptions for patient ](../../images/9/42.png)

#### 9.26: Patientor, step7

<!-- Extend the entry listing on the patient's page to include the Entry's details with a new component that shows the rest of the information of the patient''s entries distinguishing different types from each other.-->
在患者页面上扩展条目列表，添加一个新组件，显示患者条目的其他信息，以区分不同类型的条目。

<!-- You could use eg. [Icons](https://mui.com/components/material-icons/) or some other [Material UI](https://mui.com/) component to get appropriate visuals for your listing.-->
你可以使用[图标](https://mui.com/components/material-icons/)或其他[Material UI](https://mui.com/)组件来为你的列表获得合适的视觉效果。

<!-- You should use a *switch case*-based rendering and <i>exhaustive type checking</i> so that no cases can be forgotten.-->
你应该使用基于*switch case*的渲染和<i>穷尽的类型检查</i>，以免遗漏任何情况。

<!-- Like this:-->
**像这样：**

I want to be a doctor when I grow up.

**我长大后想当一名医生。**

![vscode showing error for healthCheckEntry not being assignable to type never](../../images/9/35c.png)

<!-- The resulting entries in the listing <i>could</i> look something like this:-->
结果在列表中的条目<i>可能</i>看起来像这样：

![browser showing list of entries and their details in a nicer format](../../images/9/36x.png)

</div>

<div class="content">

### Add patient form

<!-- Form handling can sometimes be quite a nuisance in React. That's why we have decided to utilize the [Formik](https://formik.org/docs/overview) package for our app's add patient form. Here's a small intro from Formik's documentation:-->
处理表单有时在 React 中可能会很麻烦。这就是为什么我们决定为我们的应用程序的添加患者表单使用[Formik](https://formik.org/docs/overview)包。这里是Formik文档中的一个小介绍：

<!-- > Formik is a small library that helps you with the 3 most annoying parts:-->
> Formik是一个小型库，它可以帮助你解决最让人恼火的3个部分：
<!-- >-->
I'm a student

我是一名学生。
<!-- > - Getting values in and out of form state-->
- 从表单状态中获取值和输出值
<!-- > - Validation and error messages-->
> - 验证和错误消息
<!-- > - Handling form submission-->
> - 处理表单提交
<!-- >-->
I like to play basketball

我喜欢打篮球
<!-- > By colocating all of the above in one place, Formik will keep things organized - making testing, refactoring, and reasoning about your forms a breeze.-->
> 通过把上述所有内容都放在一个地方，Formik 将保持整洁 - 这样可以轻松地测试、重构和推理你的表单。

<!-- The code for the form can be found from <i>src/AddPatientModal/AddPatientForm.tsx</i> and some form field helpers can be found from <i>src/AddPatientModal/FormField.tsx</i>.-->
表单的代码可以从<i>src/AddPatientModal/AddPatientForm.tsx</i>中找到，而一些表单字段的帮助可以从<i>src/AddPatientModal/FormField.tsx</i>中找到。

<!-- Looking at the top of the <i>AddPatientForm.tsx</i> you can see we have created a type for our form values, which we have simply called *PatientFormValues*. The type is a modified version of the *Patient* type with the *id* and *entries* properties omitted. We don''t want the user to be able to submit those when creating a new patient. The *id* is created by the backend and *entries* can only be added for existing patients.-->
看一下<i>AddPatientForm.tsx</i>的顶部，你可以看到我们为我们的表单值创建了一种类型，我们简单地称之为*PatientFormValues*。这种类型是*Patient*类型的修改版，省略了*id*和*entries*属性。我们不希望用户在创建新患者时能够提交这些属性。*id*由后端创建，*entries*只能为现有患者添加。

```js
export type PatientFormValues = Omit<Patient, "id" | "entries">;
```

<!-- Next, we declare the props for our form component:-->
接下来，我们声明表单组件的props：

```js
interface Props {
  onSubmit: (values: PatientFormValues) => void;
  onCancel: () => void;
}
```

<!-- As you can see, the component requires two props: *onSubmit* and *onCancel*.-->
你可以看到，该组件需要两个props：*onSubmit* 和 *onCancel*。
<!-- Both are callback functions that return *void*. The *onSubmit* function should receive an-->
*event* object as its parameter.

两者都是回调函数，返回*void*。*onSubmit*函数应该接收一个*event*对象作为参数。
<!-- object of type *PatientFormValues* as an argument so that the callback can handle our form values.-->
传递一个类型为*PatientFormValues*的对象作为参数，以便回调函数能够处理我们的表单值。

<!-- Looking at the *AddPatientForm* function component, you can see we have bound the *Props* as our component''s props, and we destructure *onSubmit* and *onCancel* from those props.-->
看看*AddPatientForm*函数组件，你可以看到我们将*Props*绑定为我们组件的props，并且我们从这些props中解构出*onSubmit*和*onCancel*。

```js
export const AddPatientForm = ({ onSubmit, onCancel }: Props) => {
  // ...
}
```

<!-- Now before we continue, let''s take a look at our form helpers in <i>FormField.tsx</i>.-->
现在在我们继续之前，让我们看一下我们在<i>FormField.tsx</i>中的表单助手。
<!-- If you check what is exported from the file, you''ll find the type *GenderOption* and the function components *SelectField* and *TextField*.-->
如果您检查文件导出的内容，您会发现类型*GenderOption*和功能组件*SelectField*和*TextField*。

<!-- Let''s take a closer look at *SelectField* and the types around it.-->
让我们仔细看看*SelectField*及其周围的类型。
<!-- First, we create a generic type for each option object that contains a value and a label for that value. These are the kind of option objects we want to allow on our form in the select field.-->
首先，我们为每个选项对象创建一个通用类型，其中包含该值的值和标签。 这些就是我们想在下拉字段的表单中允许的选项对象。
<!-- Since the only options we want to allow are different genders, we set that the *value* should be of type *Gender*.-->
因为我们想要允许的唯一选项是不同的性别，所以我们设定*值*的类型应该是*性别*。

```js
export type GenderOption = {
  value: Gender;
  label: string;
};
```

<!-- In <i>AddPatientForm.tsx</i>, we use the *GenderOption* type for the *genderOptions* variable, declaring it to be an array containing objects of type *GenderOption*:-->
在<i>AddPatientForm.tsx</i>中，我们使用*GenderOption*类型为*genderOptions*变量，声明它为包含类型*GenderOption*对象的数组：

```js
const genderOptions: GenderOption[] = [
  { value: Gender.Male, label: "Male" },
  { value: Gender.Female, label: "Female" },
  { value: Gender.Other, label: "Other" }
];
```

<!-- Next, look at the type *SelectFieldProps*. It defines the type for the props of our *SelectField* component. There, you can see that *options* is an array of *GenderOption* types.-->
下一步，看一下类型*SelectFieldProps*。它定义了我们*SelectField*组件的props类型。在那里，您可以看到*options*是一个*GenderOption*类型的数组。

```js
type SelectFieldProps = {
  name: string;
  label: string;
  options: GenderOption[];
};
```

<!-- The function component *SelectField* in itself looks a bit cryptic but it just renders the label, a select element, and all given option elements (or, actually, their labels and values).-->
功能组件*SelectField*本身看起来有点神秘，但它只是渲染标签、一个选择元素以及所有给定的选项元素（或者实际上是它们的标签和值）。

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

<!-- Now let''s move on to the *TextField* component. The component renders a TextFieldMUI that is a [Material UI TextField](https://mui.com/components/text-fields/) with a label:-->
现在让我们继续来看*TextField*组件。该组件渲染一个TextFieldMUI，它是一个[Material UI TextField](https://mui.com/components/text-fields/)，带有一个标签：

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

<!-- Note that we use the Formik [ErrorMessage](https://formik.org/docs/api/errormessage) component to render an error message for the input when needed.-->
注意，我们使用Formik [ErrorMessage](https://formik.org/docs/api/errormessage)组件在需要时为输入渲染错误消息。
<!-- The component does everything under the hood, and we don''t need to specify what it should do.-->
组件在后台完成所有事情，我们不需要指定它应该做什么。

<!-- It would also be possible to get hold of the error messages within the component by using the prop *form*:-->
也可以通过使用prop *form*来获取组件中的错误消息。

```jsx
export const TextField = ({ field, label, placeholder, form }: TextProps) => {
  console.log(form.errors);
  // ...
}
```

<!-- Now, back to the actual form component in <i>AddPatientForm.tsx</i>.-->
现在，回到<i>AddPatientForm.tsx</i>中的实际表单组件。
<!-- The function component *AddPatientForm* renders a [Formik component](https://formik.org/docs/api/formik). The Formik component is a wrapper, which requires two props: *initialValues* and *onSubmit*. The role of the props is quite self-explanatory.-->
功能组件*AddPatientForm*渲染一个[Formik组件](https://formik.org/docs/api/formik)。Formik组件是一个包装器，需要两个属性：*initialValues*和*onSubmit*。属性的作用很明显。
<!-- The Formik wrapper keeps a track of your form''s state, and then exposes it and a few reusable methods and event handlers to your form via props.-->
Formik 包裹器跟踪你表单的状态，然后通过 props 向你的表单暴露它和一些可重用的方法和事件处理程序。

<!-- We are also using an optional *validate* prop that expects a validation function and returns an object containing possible errors. Here, we only check that our text fields are not falsy, but it could easily contain e.g. some validation for the social security number format or something like that. The error messages defined by this function can then be displayed on the corresponding field''s ErrorMessage component.-->
我们还使用了一个可选的*验证* prop，它期望一个验证函数，并返回一个包含可能错误的对象。在这里，我们只检查我们的文本字段是否为虚假，但它可以很容易地包含例如一些社会安全号码格式的验证或类似的东西。此函数定义的错误消息可以在相应字段的ErrorMessage组件上显示。

<!-- First, have a look at the entire component. We will later discuss the different parts in detail.-->
首先，看一下整个部件。我们稍后会详细讨论不同的部分。

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

<!-- As a child of our Formik wrapper, we have a <i>function</i> that returns the form contents.-->
作为我们Formik包裹的一个子，我们有一个<i>函数</i>可以返回表单内容。
<!-- We use Formik''s [Form](https://formik.org/docs/api/form) to render the actual form element. Inside the Form element, we use our *TextField* and *SelectField* components that we created in <i>FormField.tsx</i>.-->
我们使用Formik的[表单](https://formik.org/docs/api/form)来渲染实际的表单元素。在表单元素内，我们使用我们在<i>FormField.tsx</i>中创建的*TextField*和*SelectField*组件。

<!-- Lastly, we create two buttons: one for canceling the form submission and one for submitting the form. The cancel button calls the *onCancel* callback straight away when clicked.-->
最后，我们创建了两个按钮：一个用于取消表单提交，另一个用于提交表单。点击取消按钮时，将立即调用*onCancel*回调函数。
<!-- The submit button triggers Formik's onSubmit event, which in turn uses the *onSubmit* callback from the component's props. The submit button is enabled only if the form is <i>valid</i> and <i>dirty</i>, which means that the user has edited some of the fields.-->
提交按钮触发Formik的onSubmit事件，然后使用组件props中的*onSubmit*回调。只有当表单是<i>有效</i>且<i>脏</i>的时候，提交按钮才会被启用，这意味着用户已经编辑了一些字段。

<!-- We handle form submission through Formik, because it allows us to call the validation function before performing the actual submission. If the validation function returns any errors, the submission is canceled.-->
我们通过Formik处理表单提交，因为它允许我们在执行实际提交之前调用验证函数。如果验证函数返回任何错误，则取消提交。

<!-- The buttons are set inside a Material UI [Grid](https://mui.com/components/grid/#main-content) to set them next to each other easily.-->
按钮被设置在Material UI [Grid](https://mui.com/components/grid/#main-content) 内，以便轻松将它们设置在彼此旁边。

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

<!-- The *onSubmit* callback has been passed all the way down from our patient list page.-->
回调函数*onSubmit*已经从我们的患者列表页面传递了一路。
<!-- It sends an HTTP POST request to our backend, adds the patient returned from the backend to our app''s state and closes the modal.-->
它向我们的后端发送一个HTTP POST请求，将后端返回的患者添加到我们应用程序的状态中，然后关闭模态。
<!-- If the backend returns an error, the error is displayed on the form.-->
如果后端返回错误，错误将显示在表单上。

<!-- Here is our submit function:-->
这是我们的提交函数：

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

<!-- With this material, you should be able to complete the rest of this part''s exercises. When in doubt, try reading the existing code to find clues on how to proceed!-->
用这个材料，你应该能够完成这部分剩余的练习。当不确定的时候，尝试阅读现有的代码来找到如何继续的线索！

</div>

<div class="tasks">

### Exercises 9.27-9.31

#### 9.27: Patientor, step8

<!-- We have established that patients can have different kinds of entries. We don''t yet have any way of adding entries to patients in our app, so, at the moment, it is pretty useless as an electronic medical record.-->
我们已经确定患者可以有不同类型的记录。我们还没有任何方法可以在我们的应用中为患者添加记录，因此，目前，它作为电子病历来说还是毫无用处的。

<!-- Your next task is to add endpoint <i>/api/patients/:id/entries</i> to your backend, through which you can POST an entry for a patient.-->
你的下一个任务是在你的后端添加端点<i>/api/patients/:id/entries</i>，通过它可以为患者发布一条条目。

<!-- Remember that we have different kinds of entries in our app, so our backend should support all those types and check that at least all required fields are given for each type.-->
记住，我们的应用程序中有不同类型的条目，因此我们的后端应该支持所有这些类型，并确保每种类型至少提供所有必填字段。

#### 9.28: Patientor, step9

<!-- Now that our backend supports adding entries, we want to add the corresponding functionality to the frontend. In this exercise, you should add a form for adding an entry to a patient. An intuitive place for accessing the form would be on a patient''s page.-->
现在我们的后端支持添加条目，我们想在前端添加相应的功能。在这个练习中，您应该添加一个表单来为患者添加一个条目。一个直观的访问表单的地方是在患者页面上。

<!-- In this exercise, it is enough to **support <i>one</i> entry type**, and you do not have to handle any errors. It is enough if a new entry can be created when the form is filled with valid data.-->
在这个练习中，**只需要支持<i>一种</i>条目类型**，不必处理任何错误。只要在表单中填入有效数据就可以创建一个新条目，这就足够了。

<!-- Upon a successful submit, the new entry should be added to the correct patient and the patient''s entries on the patient page should be updated to contain the new entry.-->
一旦提交成功，新条目应该被添加到正确的患者中，患者页面上的患者条目应该被更新以包含新条目。

<!-- If you like, you can re-use some of the code from the <i>Add patient</i> form for this exercise, but this is not a requirement.-->
如果你愿意，你可以从<i>添加病人</i>表单中重用一些代码，但这不是必须的。

<!-- Note that the file [FormField.tsx](https://github.com/fullstack-hy2020/patientor/blob/master/src/AddPatientModal/FormField.tsx#L58) has a ready-made component called *DiagnosisSelection* that can be used for setting the field *diagnoses*.-->
注意，[FormField.tsx](https://github.com/fullstack-hy2020/patientor/blob/master/src/AddPatientModal/FormField.tsx#L58)文件中有一个叫做*DiagnosisSelection*的组件，可以用来设置*diagnoses*字段。

<!-- It can be used as follows:-->
它可以这样使用：

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

<!-- With small tweaks on types, the readily made component *SelectField* can be used for the health check rating.-->
通过小调整类型，可以使用已经制作好的组件*SelectField*来进行健康检查评级。

#### 9.29: Patientor, step10

<!-- Extend your solution so that it displays an error message if some required values are missing or formatted incorrectly.-->
扩展你的解决方案，以便如果缺少某些必需的值或格式不正确，则显示错误消息。

#### 9.30: Patientor, step11

<!-- Extend your solution so that it supports <i>two</i> entry types and displays an error message if some required values are missing or formatted incorrectly. You do not need to care about possible errors in the server''s response.-->
扩展你的解决方案，使它支持<i>两</i>种输入类型，如果有必要的值缺失或格式不正确，则显示错误消息。你不需要关心服务器响应中可能出现的错误。

<!-- The easiest but surely not the most elegant way to do this exercise is to have a separate form for each different entry type. Getting the types to work properly might be a slight challenge if you use just a single form.-->
最简单但肯定不是最优雅的做这个练习的方法是为每种不同的条目类型单独创建一个表单。如果只使用一个表单，让类型正确工作可能会有一点挑战。

<!-- Note that if you need to alter the shown form based on user selections, you can access the form values using the parameter *values* of the rendering function:-->
注意，如果您需要根据用户选择更改显示的表单，您可以使用渲染函数的参数*values*访问表单值：

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

#### 9.31: Patientor, step12

<!-- Extend your solution so that it supports <i>all the entry types</i> and displays an error message if some required values are missing or formatted incorrectly. You do not need to care about possible errors in the server''s response.-->
扩展你的解决方案，使其支持<i>所有的条目类型</i>并在某些必要的值缺失或格式不正确时显示错误消息。你不需要关心服务器响应中可能出现的错误。

</div>
