---
mainImage: ../../../images/part-9.svg
part: 9
letter: e
lang: zh
---

<div class="tasks">

<!-- **NOTE**: this is the new section about Patientor frontend that has replaced 12th February 2023, [this chapter](/en/part9/legacy_patientor_the_old_material). In the change, the Patientor frontend structure was refactored to a simpler form that makes it much easier to focus on learning TypeScript.-->
**注意**：这是取代2023年2月12日的关于Patientor前端的新部分，[本章节](/en/part9/legacy_patientor_the_old_material)。在此更改中，Patientor前端结构被重构为更简单的形式，使其更容易专注于学习TypeScript。

<!-- If you have started doing the exercises with the old Patientor, you may continue with [the old material](/en/part9/legacy_patientor_the_old_material). If not, then it is recommended to use the "new" patientor that is described in this section.-->
如果你已经开始使用旧的Patientor做练习，你可以继续[旧的材料](/en/part9/legacy_patientor_the_old_material)。如果没有，建议使用本节描述的“新”Patientor。

</div>

<div class="content">

### Working with an existing codebase

<!-- When diving into an existing codebase for the first time, it is good to get an overall view of the conventions and structure of the project. You can start your research by reading the <i>README.md</i> in the root of the repository. Usually, the README contains a brief description of the application and the requirements for using it, as well as how to start it for development.-->
当第一次深入研究现有的代码库时，最好先获得项目的约定和结构的整体视图。你可以从存储库根目录中的<i>README.md</i>开始你的研究。通常，README包含了应用程序的简要描述和使用要求，以及如何开始开发它。
<!-- If the README is not available or someone has "saved time" and left it as a stub, you can take a peek at the <i>package.json</i>.-->
如果没有可用的README或者有人"节省了时间"而只留下一个框架，你可以看一眼<i>package.json</i>。
<!-- It is always a good idea to start the application and click around to verify you have a functional development environment.-->
总是有一个好主意去启动应用程序，并点击四处以验证您有一个功能强大的开发环境。

<!-- You can also browse the folder structure to get some insight into the application's functionality and/or the architecture used. These are not always clear, and the developers might have chosen a way to organize code that is not familiar to you. The [sample project](https://github.com/fullstack-hy2020/patientor) used in the rest of this part is organized, feature-wise. You can see what pages the application has, and some general components, e.g. modals and state. Keep in mind that the features may have different scopes. For example, modals are visible UI-level components whereas the state is comparable to business logic and keeps the data organized under the hood for the rest of the app to use.-->
你也可以浏览文件夹结构，以获得应用程序功能和/或所使用的架构的一些见解。这些并不总是清楚的，开发人员可能选择了一种你不熟悉的方式来组织代码。本部分使用的[样本项目](https://github.com/fullstack-hy2020/patientor)按功能组织。你可以看到应用程序有哪些页面，以及一些常见组件，例如模态窗口和状态。请记住，功能可能具有不同的范围。例如，模态窗口是可见的UI级组件，而状态可以比作业务逻辑，并在后台为其余的应用程序使用的数据进行组织。

<!-- TypeScript provides types for what kind of data structures, functions, components, and state to expect.  You can try looking for <i>types.ts</i> or something similar to get started. VSCode is a big help and simply highlighting variables and parameters can provide quite a lot of insight. All this naturally depends on how types are used in the project.-->
TypeScript 提供了用于预期数据结构、函数、组件和状态的类型。您可以尝试搜索 <i>types.ts</i> 或类似的内容以开始使用。VSCode 可以提供很大的帮助，只需高亮变量和参数就可以获得很多信息。所有这些自然取决于项目中如何使用类型。

<!-- If the project has unit, integration or end-to-end tests, reading those is most likely beneficial. Test cases are your most important tool when refactoring or adding new features to the application. You want to make sure not to break any existing features when hammering around the code. TypeScript can also give you guidance with argument and return types when changing the code.-->
如果项目有单元、集成或端到端测试，阅读这些很可能是有益的。当重构或向应用程序添加新功能时，测试用例是您最重要的工具。您希望确保在敲打代码时不会破坏任何现有功能。TypeScript还可以在更改代码时提供参数和返回类型的指导。

<!-- Remember that reading code is a skill in itself, so don't worry if you don't understand the code on your first readthrough.  The code may have a lot of corner cases, and pieces of logic may have been added here and there throughout its development cycle. It is hard to imagine what kind of problems the previous developer has wrestled with. Think of it all like [growth rings in trees](https://en.wikipedia.org/wiki/Dendrochronology#Growth_rings). Understanding everything requires digging deep into the code and business domain requirements. The more code you read, the better you will be at understanding it. You will most likely read far more code than you are going to produce throughout your life.-->
记住，阅读代码本身就是一项技能，因此，如果您第一次阅读时不理解代码，则无需担心。 代码可能有很多边缘情况，并且在其开发周期中可能在各处添加了逻辑。 很难想象之前的开发人员遇到了什么样的问题。 把它们都看作[树木中的生长环](https://en.wikipedia.org/wiki/Dendrochronology#Growth_rings)。 要理解一切，需要深入研究代码和业务领域要求。 您阅读的代码越多，您就越擅长理解它。 您一生中可能会阅读的代码远比您要生成的代码多得多。

### Patientor frontend

<!-- It's time to get our hands dirty finalizing the frontend for the backend we built in [exercises 9.8.-9.13](/en/part9/typing_an_express_app). We will actually also need some new features to the backend for finishing the app.-->
是时候让我们认真完成[练习9.8-9.13](/en/part9/typing_an_express_app)中构建的后端的前端了。 为了完成应用程序，我们实际上还需要一些新功能来支持后端。

<!-- Before diving into the code, let us start both the frontend and the backend.-->
在潜入代码之前，让我们开始前端和后端。

<!-- If all goes well, you should see a patient listing page. It fetches a list of patients from our backend, and renders it to the screen as a simple table. There is also a button for creating new patients on the backend. As we are using mock data instead of a database, the data will not persist - closing the backend will delete all the data we have added. UI design has not been a strong point of the creators, so let's disregard the UI for now.-->
如果一切顺利，您应该能看到一个病人列表页面。它从我们的后端获取一系列病人，并将其渲染到屏幕上作为一个简单的表格。还有一个按钮可以在后端创建新的病人。由于我们正在使用模拟数据而不是数据库，因此数据不会永久保存 - 关闭后端将删除我们添加的所有数据。UI设计不是创造者的强项，所以让我们暂时忽略UI吧。

<!-- After verifying that everything works, we can start studying the code. All the interesting stuff resides in the <i>src</i> folder. For your convenience, there is already a <i>types.ts</i> file for basic types used in the app, which you will have to extend or refactor in the exercises.-->
在验证一切正常后，我们可以开始研究代码了。所有有趣的东西都在<i>src</i>文件夹中。为了方便起见，在应用程序中使用的基本类型已经有一个<i>types.ts</i>文件，您将在练习中扩展或重构它。

<!-- In principle, we could use the same types for both backend and frontend, but usually, the frontend has different data structures and use cases for the data, which causes the types to be different.-->
在原则上，我们可以同时使用后端和前端的同一种类型，但通常情况下，前端的数据结构和数据使用情况不同，这就导致类型也不同。
<!-- For example, the frontend has a state and may want to keep data in objects or maps whereas the backend uses an array. The frontend might also not need all the fields of a data object saved in the backend, and it may need to add some new fields to use for rendering.-->
例如，前端有一个状态，可能希望将数据保存在对象或Map中，而后端使用一个数组。前端可能不需要后端保存的数据对象的所有字段，也可能需要添加一些新字段用于渲染。

<!-- The folder structure looks as follows:-->
文件夹结构如下：

![vscode folder structure for patientor](../../images/9/34brandnew.png)

<!-- Besides the component *App* a directory for services, there are currently three main components: *AddPatientModal* and *PatientListPage* which are both defined in a directory, and a component *HealthRatingBar* defined in a file. If a component has some subcomponents not used elsewhere in the app, it might be a good idea to define the component and its subcomponents in a directory. For example now the AddPatientModal is defined in the file *components/AddPatientModal/index.tsx* and its subcomponent *AddPatientForm* in its own file under the same directory.-->
除了组件*App*（一个服务目录）之外，目前还有三个主要组件：*AddPatientModal* 和 *PatientListPage* 都定义在一个目录中，另一个组件 *HealthRatingBar* 定义在一个文件中。如果一个组件有一些不在应用程序其他地方使用的子组件，最好的办法是在一个目录中定义该组件及其子组件。例如，现在 *AddPatientModal* 在文件 *components/AddPatientModal/index.tsx* 中定义，它的子组件 *AddPatientForm* 在同一目录的另一个文件中定义。

<!-- There is nothing very surprising in the code. The state and communication with the backend are implemented with *useState* hook and Axios, similar to the notes app in the previous section. [Material UI](/en/part7/more_about_styles#material-ui) is used to style the app and the navigation structure is implementer with [React Router](/en/part7/react_router), both familiar to us from part 7 of the course.-->
没有什么特别令人惊讶的代码。状态和与后端的通信使用*useState*钩子和Axios实现，类似于前一节中的笔记应用。[Material UI](/en/part7/more_about_styles#material-ui)用于样式化应用程序，导航结构使用[React Router](/en/part7/react_router)实现，这些都是我们从课程第7章节熟悉的内容。

<!-- From typing point of view, there are a couple of interesting things. Component *App* passes the function *setPatients* as a prop to the component *PatientListPage*:-->
从打字的角度来看，有几件有趣的事情。组件*App*将函数*setPatients*作为prop传递给组件*PatientListPage*：

```js
const App = () => {
  const [patients, setPatients] = useState<Patient[]>([]); // highlight-line

  // ...

  return (
    <div className="App">
      <Router>
        <Container>
          <Routes>
            // ...
            <Route path="/" element={
              <PatientListPage
                patients={patients}
                setPatients={setPatients} // highlight-line
              />}
            />
          </Routes>
        </Container>
      </Router>
    </div>
  );
};
```

<!-- To keep the TypeScript compiler happy, the props should be typed as follows:-->
为了让TypeScript编译器满意，props应该按照以下方式类型化：

```js
interface Props {
  patients : Patient[]
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>
}

const PatientListPage = ({ patients, setPatients } : Props ) => {
  // ...
}
```

<!-- So the function *setPatients* has type *React.Dispatch<React.SetStateAction<Patient[]>>*. We can see the type in the editor when we hover over the function:-->
所以函数*setPatients*的类型为*React.Dispatch<React.SetStateAction<Patient[]>>*。我们可以在编辑器中悬停在函数上时看到该类型：

![vscode showing Patient array as type for setPatients](../../images/9/73new.png)

<!-- The [React TypeScript cheatsheet](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/basic_type_example#basic-prop-types-examples) has a pretty nice list of typical prop types, where we can seek for help if finding the proper typing for props is not obvious.-->
[React TypeScript 速查表](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/basic_type_example#basic-prop-types-examples)有一个相当不错的典型属性类型列表，如果找不到合适的属性类型，我们可以在这里寻求帮助。

<!-- *PatientListPage* passes four props to the component *AddPatientModal*. Two of these props are functions. Let us have a look how these are typed:-->
*PatientListPage* 向组件 *AddPatientModal* 传递四个props。其中两个是函数。让我们来看看它们的类型：

```js
const PatientListPage = ({ patients, setPatients } : Props ) => {

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  // ...

  const closeModal = (): void => { // highlight-line
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewPatient = async (values: PatientFormValues) => { // highlight-line
    // ...
  };
  // ...

  return (
    <div className="App">
      // ...
      <AddPatientModal
        modalOpen={modalOpen}
        onSubmit={submitNewPatient} // highlight-line
        error={error}
        onClose={closeModal} // highlight-line
      />
    </div>
  );
};
```

<!-- Types look like the following:-->
类型看起来像下面这样：

```js
interface Props {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: PatientFormValues) => Promise<void>;
  error?: string;
}

const AddPatientModal = ({ modalOpen, onClose, onSubmit, error }: Props) => {
  // ...
}
```

<!-- *onClose* is just a function that takes no parameters, and does not return anything, so the type is-->
`void`.

*onClose* 是一个不带参数也不返回任何东西的函数，因此类型是`void`。

```js
() => void
```

<!-- The type of *onSubmit* is a bit more interesting, it has one parameter that has the type *PatientFormValues*. The return value of the function is _Promise&#60;void&#62;_. So again the function type is written with the arrow syntax:-->
类型*onSubmit*有点更有趣，它有一个参数类型为*PatientFormValues*。函数的返回值是_Promise&#60;void&#62;_。因此，函数类型使用箭头语法编写：

```js
(values: PatientFormValues) => Promise<void>
```

<!-- The return value of a *async* function is a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function#return_value) with the value that the function returns. Our function does not return anything so the proper return type is just _Promise&#60;void&#62;_.-->
返回值*异步*函数是一个[承诺](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function#return_value)，其中的值是函数返回的。我们的函数没有返回任何东西，因此正确的返回类型只是_Promise&#60;void&#62;_。

</div>

<div class="tasks">

### Exercises 9.20-9.21

<!-- We will soon add a new type for our app, *Entry*, which represents a lightweight patient journal entry. It consists of a journal text, i.e. a *description*, a creation date, information regarding the specialist who created it and possible diagnosis codes. Diagnosis codes map to the ICD-10 codes returned from the <i>/api/diagnoses</i> endpoint. Our naive implementation will be that a patient has an array of entries.-->
我们很快会为我们的应用添加一种新类型，*Entry*，它代表一个轻量级的患者日记条目。它由日记文本，即*描述*，创建日期，有关创建它的专家的信息以及可能的诊断码组成。诊断码映射到从<i>/api/diagnoses</i>端点返回的ICD-10码。我们的初步实现是患者有一组条目。

<!-- Before going into this, let us do some preparatory work.-->
在正式进入之前，让我们先做一些准备工作。

#### 9.20: Patientor, step1

<!-- Create an endpoint <i>/api/patients/:id</i> to the backend that returns all of the patient information for one patient, including the array of patient entries that is still empty for all the patients. For the time being, expand the backend types as follows:-->
创建一个后端的端点<i>/api/patients/:id</i>，用来返回某一位患者的所有信息，包括目前对于所有患者来说仍然为空的患者条目数组。暂时来说，将后端类型扩展如下：

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

export type NonSensitivePatient = Omit<Patient, 'ssn' | 'entries'>;  // highlight-line
```

<!-- The response should look as follows:-->
# 如下所示：

他们收到了礼物，很开心地把它们分享给了家人和朋友。

他们收到了礼物，很高兴地把它们分享给了家人和朋友。

![browser showing entries blank array when accessing patient](../../images/9/38a.png)

#### 9.21: Patientor, step2

<!-- Create a page for showing a patient's full information in the frontend.-->
创建一个页面，用于在前端显示患者的完整信息。

<!-- The user should be able to access a patient's information by clicking the patient's name.-->
用户应该能够通过点击病人的名字来访问病人的信息。

<!-- Fetch the data from the endpoint created in the previous exercise.-->
从前面练习中创建的端点获取数据。

<!-- You may use [MaterialUI](https://material-ui.com/) for the new components but that is up to you since our main focus now is TypeScript.-->
你可以使用[MaterialUI](https://material-ui.com/)来创建新的组件，但这取决于你，因为我们现在的主要重点是TypeScript。

<!-- You might want to have a look at [part 7](/en/part7/react_router) if you don''t yet have a grasp on how the [React Router](https://reactrouter.com/en/main/start/tutorial) works.-->
你可能想看看[第7章节](/en/part7/react_router)，如果你还没有弄清[React Router](https://reactrouter.com/en/main/start/tutorial)是如何工作的。

<!-- The result could look like this:-->
结果可能是这样的：

![browser showing patientor with one patient](../../images/9/39x.png)

<!-- The example uses [Material UI Icons](https://mui.com/components/material-icons/) to represent genders.-->
例子使用[Material UI Icons](https://mui.com/components/material-icons/)来代表性别。

</div>

<div class="content">

### Full entries

<!-- In [exercise 9.10](/en/part9/typing_an_express_app#exercises-9-10-9-11) we implemented an endpoint for fetching information about various diagnoses, but we are still not using that endpoint at all.-->
在[练习9.10](/en/part9/typing_an_express_app#exercises-9-10-9-11)中，我们实现了一个用于获取有关各种诊断信息的端点，但我们仍然没有使用该端点。
<!-- Since we now have a page for viewing a patient's information, it would be nice to expand our data a bit.-->
自从我们现在有了一个可以查看病人资料的页面，那么增加一些资料会很好。
<!-- Let's add an *Entry* field to our patient data so that a patient's data contains their medical entries, including possible diagnoses.-->
让我们为我们的病人资料新增一个*记录*栏位，以便病人资料包含他们的医疗记录，包括可能的诊断。

<!-- Let's ditch our old patient seed data from the backend and start using [this expanded format](https://github.com/fullstack-hy2020/misc/blob/master/patients-full.ts).-->
让我们抛弃后端的旧患者种子数据，开始使用[这种扩展格式](https://github.com/fullstack-hy2020/misc/blob/master/patients-full.ts)。

<!-- Let us now create a proper *Entry* type based on the data we have.-->
让我们现在根据我们拥有的数据创建一个正确的*Entry*类型。

<!-- If we take a closer look at the data, we can see that the entries are quite different from one another. For example, let's take a look at the first two entries:-->
如果我们仔细看一下数据，我们会发现这些条目彼此之间有很大的不同。例如，让我们看一下前两个条目：

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
立即我们可以看到，前几个字段是相同的，第一个条目有一个*放电*字段，而第二个条目有*employerName*和*sickLeave*字段。
<!-- All the entries seem to have some fields in common, but some fields are entry-specific.-->
所有的条目似乎都有一些共同的字段，但有些字段是特定于条目的。

<!-- When looking at the *type*, we can see that there are three kinds of entries: *OccupationalHealthcare*, *Hospital* and *HealthCheck*.-->
当看到*类型*时，我们可以看到有三种条目：*职业保健*、*医院*和*健康检查*。
<!-- This indicates we need three separate types. Since they all have some fields in common, we might just want to create a base entry interface that we can extend with the different fields in each type.-->
这表明我们需要三种不同的类型。由于它们都有一些共同的字段，我们可能只需要创建一个基本的条目界面，我们可以用不同类型的字段来扩展它。

<!-- When looking at the data, it seems that the fields *id*, *description*, *date* and *specialist* are something that can be found in each entry. On top of that, it seems that *diagnosisCodes* is only found in one *OccupationalHealthcare* and one *Hospital* type entry. Since it is not always used even in those types of entries, it is safe to assume that the field is optional. We could consider adding it to the *HealthCheck* type as well-->
.

当查看数据时，似乎*id*，*description*，*date*和*specialist*是每个条目中都可以找到的东西。此外，似乎*diagnosisCodes*只在一个*OccupationalHealthcare*和一个*Hospital*类型条目中可以找到。由于即使在这些类型的条目中也不总是使用，因此可以断定该字段是可选的。我们可以考虑将其添加到*HealthCheck*类型中。
<!-- since it might just not be used in these specific entries.-->
因为它可能只不会被用在这些特定的条目中。

<!-- So our *BaseEntry* from which each type could be extended would be the following:-->
所以我们的*BaseEntry*，每种类型都可以从中扩展，如下：

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
如果我们想再精细化一点，既然我们已经在后端定义了*诊断*类型，我们可能只需要在类型发生变化时直接参考*诊断*类型的代码字段即可。
<!-- We can do that like so:-->
我们可以这样做：

```js
interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Diagnosis['code'][];
}
```

<!-- As was mentioned [earlier in this part](/en/part9/first_steps_with_type_script/#the-alternative-array-syntax), we could define an array with the syntax _Array&#60;Type&#62;_ instead of defining it *Type[]*. In this particular case writing *Diagnosis['code'][]* starts to look a bit strange so we will decide to use the alternative syntax (that is also recommended by the ESlint rule [array-simple](https://typescript-eslint.io/rules/array-type/#array-simple)):-->
正如前面[提到](/en/part9/first_steps_with_type_script/#the-alternative-array-syntax)，我们可以用语法_Array&#60;Type&#62;_ 来定义数组，而不是用*Type[]*。在这种特殊情况下，写*Diagnosis['code'][]*开始看起来有点奇怪，所以我们决定采用替代语法（这也是ESLint规则[array-simple](https://typescript-eslint.io/rules/array-type/#array-simple)推荐的）：

```js
interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis['code']>; // highlight-line
}
```

<!-- Now that we have the *BaseEntry* defined, we can start creating the extended entry types we will actually be using. Let's start by creating the *HealthCheckEntry* type.-->
现在我们已经定义了*BaseEntry*，我们可以开始创建我们实际使用的扩展条目类型。让我们从创建*HealthCheckEntry*类型开始。

<!-- Entries of type *HealthCheck* contain the field *HealthCheckRating*, which is an integer from 0 to 3, zero meaning *Healthy* and 3 meaning *CriticalRisk*. This is a perfect case for an enum definition.-->
*HealthCheck* 类型的条目包含字段 *HealthCheckRating*，它是一个0到3的整数，0表示*健康*，3表示*严重风险*。这是一个完美的枚举定义案例。
<!-- With these specifications we could write a *HealthCheckEntry* type definition like so:-->
用这些规格，我们可以像这样写一个*HealthCheckEntry*类型定义：

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
现在我们只需要创建*OccupationalHealthcareEntry*和*HospitalEntry*类型，这样我们就可以将它们组合在一个联合体中，并将它们导出为像这样的Entry类型：

```js
export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry;
```

### Omit with unions

<!-- An important point concerning unions is that, when you use them with *Omit* to exclude a property, it works in a possibly unexpected way. Suppose we want to remove the *id* from each *Entry*. We could think of using-->
*Omit* like this:

一个关于联合的重要点是，当你用*Omit*来排除一个属性时，它的工作方式可能会出乎意料。假设我们想要从每个*Entry*中移除*id*，我们可以像这样使用*Omit*：

```js
Omit<Entry, 'id'>
```

<!-- but [it wouldn't work as we might expect](https://github.com/microsoft/TypeScript/issues/42680). In fact, the resulting type would only contain the common properties, but not the ones they don't share. A possible workaround is to define a special Omit-like function to deal with such situations:-->
但[它不会按我们期望的那样工作](https://github.com/microsoft/TypeScript/issues/42680)。事实上，生成的类型只包含共同的属性，但不包括它们不共享的属性。一个可能的解决方法是定义一个特殊的Omit类似的函数来处理这种情况：

```ts
// Define special omit for unions
type UnionOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T, K> : never;
// Define Entry without the 'id' property
type EntryWithoutId = UnionOmit<Entry, 'id'>;
```

</div>

<div class="tasks">

### Exercises 9.22-9.29

<!-- Now we are ready to put the finishing touches to the app!-->
现在我们准备为这个应用程序添加最后的细节了！

#### 9.22: Patientor, step3

<!-- Define the types *OccupationalHealthcareEntry* and *HospitalEntry* so that those conform with the example data. Ensure that your backend returns the entries properly when you go to an individual patient's route:-->
定义类型*OccupationalHealthcareEntry*和*HospitalEntry*，以便符合示例数据。确保当您访问单个患者的路由时，后端正确地返回条目：

*OccupationalHealthcareEntry*：职业保健条目，指的是患者在职业保健机构接受的治疗，包括诊断、治疗、药物治疗以及其他有关措施。

*HospitalEntry*：医院条目，指的是患者在医院接受的治疗，包括诊断、治疗、药物治疗以及其他有关措施。

![browser shoiwing entries json data properly for patient](../../images/9/40.png)

<!-- Use types properly in the backend! For now, there is no need to do a proper validation for all the fields of the entries in the backend, it is enough e.g. to check that the field *type* has a correct value.-->
使用正确的类型在后端！目前，没有必要在后端对所有字段的条目进行正确的验证，例如只需要检查*类型*字段是否具有正确的值就可以了。

#### 9.23: Patientor, step4

<!-- Extend a patient's page in the frontend to list the *date*, *description* and *diagnoseCodes* of the patient's entries.-->
扩展患者在前端的页面，列出患者条目的*日期*、*描述*和*诊断码*。

<!-- You can use the same type definition for an *Entry* in the frontend. For these exercises, it is enough to just copy/paste the definitions from the backend to the frontend.-->
你可以在前端使用相同的*Entry*类型定义。对于这些练习，只需从后端复制/粘贴定义到前端就足够了。

<!-- Your solution could look like this:-->
你的解决方案可能看起来像这样：

![browser showing list of diagnosis codes for patient](../../images/9/41.png)

#### 9.24: Patientor, step5

<!-- Fetch and add diagnoses to the application state from the <i>/api/diagnoses</i> endpoint. Use the new diagnosis data to show the descriptions for patient's diagnosis codes:-->
从<i>/api/diagnoses</i>端点获取并将诊断添加到应用状态中。使用新的诊断数据来显示患者诊断码的描述：

![browser showing list of codes and their descriptions for patient ](../../images/9/42.png)

#### 9.25: Patientor, step6

<!-- Extend the entry listing on the patient's page to include the Entry's details with a new component that shows the rest of the information of the patient's entries distinguishing different types from each other.-->
在病人页面上增加条目列表，添加新组件，显示病人条目的其余信息，以区分不同类型的条目。

<!-- You could use eg. [Icons](https://mui.com/components/material-icons/) or some other [Material UI](https://mui.com/) component to get appropriate visuals for your listing.-->
你可以使用例如[图标](https://mui.com/components/material-icons/)或其他[Material UI](https://mui.com/)组件来为你的列表获得适当的视觉效果。

<!-- You should use a *switch case*-based rendering and <i>exhaustive type checking</i> so that no cases can be forgotten.-->
你应该使用基于*switch case*的渲染和<i>详尽的类型检查</i>，以免遗漏任何情况。

<!-- Like this:-->
**像这样：**

We must take the initiative to make our dreams come true.

我们必须主动去实现我们的梦想。

![vscode showing error for healthCheckEntry not being assignable to type never](../../images/9/35c.png)

<!-- The resulting entries in the listing <i>could</i> look something like this:-->
结果列表中的条目<i>可能</i>如下所示：

![browser showing list of entries and their details in a nicer format](../../images/9/36x.png)

#### 9.26: Patientor, step7

<!-- We have established that patients can have different kinds of entries. We don''t yet have any way of adding entries to patients in our app, so, at the moment, it is pretty useless as an electronic medical record.-->
我们已经确定患者可以有不同种类的记录。我们目前还没有任何方法来在我们的应用程序中为患者添加记录，因此，目前，它作为一个电子病历还是比较无用的。

<!-- Your next task is to add endpoint <i>/api/patients/:id/entries</i> to your backend, through which you can POST an entry for a patient.-->
你的下一个任务是在你的后端添加端点<i>/api/patients/:id/entries</i>，通过它可以为患者POST一个条目。

<!-- Remember that we have different kinds of entries in our app, so our backend should support all those types and check that at least all required fields are given for each type.-->
记住我们的应用程序有不同类型的条目，因此我们的后端应该支持所有这些类型，并确保每种类型至少提供所有必填字段。

<!-- In this exercise you quite likely need to remember [this trick](/en/part9/grande_finale_patientor#omit-with-unions).-->
在这个练习中，你很可能需要记住[这个技巧](/en/part9/grande_finale_patientor#omit-with-unions)。

<!-- You may assume that the diagnostic codes are sent in a correct form and use eg. the following kind of parser to extract those from the request body:-->
您可以假设诊断码以正确的形式发送，并使用例如以下类型的解析器从请求正文中提取这些信息：

```js
const parseDiagnosisCodes = (object: unknown): Array<Diagnosis['code']> =>  {
  if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
    // we will just trust the data to be in correct form
    return [] as Array<Diagnosis['code']>;
  }

  return object.diagnosisCodes as Array<Diagnosis['code']>;
};
```

#### 9.27: Patientor, step8

<!-- Now that our backend supports adding entries, we want to add the corresponding functionality to the frontend. In this exercise, you should add a form for adding an entry to a patient. An intuitive place for accessing the form would be on a patient's page.-->
现在我们的后端支持添加条目，我们想将相应的功能添加到前端。 在本次练习中，您应该添加一个用于对患者添加条目的表单。 访问表单的直观位置是在患者页面上。

<!-- In this exercise, it is enough to **support <i>one</i> entry type**. All the fields in the form can be just plain text inputs, so it is up to user to enter valid values.-->
在这个练习中，**足以支持<i>一个</i>条目类型**就可以了。表单中的所有字段都可以是普通的文本输入，因此用户输入有效值取决于用户自己。

<!-- Upon a successful submit, the new entry should be added to the correct patient and the patient's entries on the patient page should be updated to contain the new entry.-->
成功提交后，新条目应该添加到正确的患者上，并且患者页面上的条目应该更新以包含新条目。

<!-- Your form might look something like this:-->
你的表格可能看起来像这样：

![Patientor new healthcheck entry form](../../images/9/74new.png)

<!-- If user enters invalid values to the form and backend rejects the addition, show a proper error message to user-->
如果用户输入无效的值到表单，后端拒绝添加，就向用户显示一条适当的错误消息。

![browser showing healthCheckRating incorrect 15 error](../../images/9/75new.png)

#### 9.28: Patientor, step9

<!-- Extend your solution so that it supports <i>all the entry types</i>-->
扩展你的解决方案，以支持<i>所有的条目类型</i>

#### 9.29: Patientor, step10

<!-- Improve the entry creation forms so that it makes hard to enter incorrect dates, diagnosis codes and health rating.-->
改善入口创建表格，使其难以输入错误日期、诊断码和健康评级。

<!-- Your improved form might look something like this:-->
你改进后的表单可能看起来像这样：

![patientor showing fancy calendar ui](../../images/9/76new.png)

<!-- Diagnosis codes are now set with Material UI [multiple select](https://mui.com/material-ui/react-select/#multiple-select) and dates with [Input](https://mui.com/material-ui/api/input/) elements with type [date](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date).-->
诊断代码现在使用 [Material UI 的多选](https://mui.com/material-ui/react-select/#multiple-select) 和 [Input](https://mui.com/material-ui/api/input/) 元素的类型 [date](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date) 设置。

### Submitting exercises and getting the credits

<!-- Exercises of this part are submitted via [the submissions system](https://studies.cs.helsinki.fi/stats/courses/fs-typescript) just like in the previous parts, but unlike previous parts, the submission goes to a different "course instance". Remember that you have to finish at least 24 exercises to pass this part!-->
本部分的练习也是通过[提交系统](https://studies.cs.helsinki.fi/stats/courses/fs-typescript)提交，就像之前的部分一样，但不同于之前的部分，提交去一个不同的“课程实例”。记住，你必须完成至少24个练习才能通过这一部分！

<!-- Once you have completed the exercises and want to get the credits, let us know through the exercise submission system that you have completed the course:-->
一旦你完成了练习并想要获得学分，请通过练习提交系统告知我们你已经完成了课程：

![Submissions](../../images/11/21.png)

<!-- **Note** that you need a registration to the corresponding course part for getting the credits registered, see [here](/en/part0/general_info#parts-and-completion) for more information.-->
**注意**，您需要注册相应课程部分才能获得学分登记，更多信息请参见[这里](/en/part0/general_info#parts-and-completion)。

<!-- You can download the certificate for completing this part by clicking one of the flag icons. The flag icon corresponds to the certificate's language.-->
您可以通过点击一个旗帜图标来下载完成此部分的证书。旗帜图标对应证书的语言。

</div>
