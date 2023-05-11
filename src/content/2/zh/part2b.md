---
mainImage: ../../../images/part-2.svg
part: 2
letter: b
lang: zh
---

<div class="content">
<!-- Let's continue expanding our application by allowing users to add new notes. You can find the code for our current application [here](https://github.com/fullstack-hy2020/part2-notes/tree/part2-1).-->
让我们继续扩展我们的应用，允许用户添加新的笔记。您可以在[这里](https://github.com/fullstack-hy2020/part2-notes/tree/part2-1)找到我们当前应用程序的代码。

<!-- To get our page to update when new notes are added it's best to store the notes in the <i>App</i> component's state. Let's import the [useState](https://react.dev/reference/react/useState) function and use it to define a piece of state that gets initialized with the initial notes array passed in the props.-->
要让我们的页面在添加新笔记时更新，最好将笔记存储在<i>App</i>组件的状态中。让我们导入[useState](https://react.dev/reference/react/useState)函数，并使用它来定义一个状态，该状态使用在props中传入的初始笔记数组进行初始化。

```js
import { useState } from 'react' // highlight-line
import Note from './components/Note'

const App = (props) => { // highlight-line
  const [notes, setNotes] = useState(props.notes) // highlight-line

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note =>
          <Note key={note.id} note={note} />
        )}
      </ul>
    </div>
  )
}

export default App
```

<!-- The component uses the <em>useState</em> function to initialize the piece of state stored in <em>notes</em> with the array of notes passed in the props:-->
组件使用<em>useState</em>函数来初始化存储在<em>notes</em>中的状态片段，并将props中传入的notes数组传入其中：

```js
const App = (props) => {
  const [notes, setNotes] = useState(props.notes)

  // ...
}
```

<!-- We can also use React Developer Tools to see that this really happens:-->
我们也可以使用React开发者工具来查看这确实发生了：

![browser showing dev react tools window](../../images/2/30.png)

<!-- If we wanted to start with an empty list of notes, we would set the initial value as an empty array, and since the props would not be used, we could omit the <em>props</em> parameter from the function definition:-->
如果我们想从一个空的笔记列表开始，我们可以将初始值设置为一个空数组，并且由于不使用<em>props</em>参数，我们可以在函数定义中省略它。

```js
const App = () => {
  const [notes, setNotes] = useState([])

  // ...
}
```

<!-- Let's stick with the initial value passed in the props for the time being.-->
让我们暂时继续使用props传入的初始值吧。

<!-- Next, let's add an HTML [form](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms) to the component that will be used for adding new notes.-->
接下来，让我们向组件中添加一个 HTML [表单](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms)，用于添加新笔记。

```js
const App = (props) => {
  const [notes, setNotes] = useState(props.notes)

// highlight-start
  const addNote = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
  }
  // highlight-end

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note =>
          <Note key={note.id} note={note} />
        )}
      </ul>
      // highlight-start
      <form onSubmit={addNote}>
        <input />
        <button type="submit">save</button>
      </form>
      // highlight-end
    </div>
  )
}
```

<!-- We have added the _addNote_ function as an event handler to the form element that will be called when the form is submitted, by clicking the submit button.-->
我们已将_addNote_功能新增为表单元素的事件处理程序，当点击提交按钮时将会调用该函数。

<!-- We use the method discussed in [part 1](/en/part1/component_state_event_handlers#event-handling) for defining our event handler:-->
我们使用[第一章节](/en/part1/component_state_event_handlers#event-handling)讨论的方法定义我们的事件处理程序：

```js
const addNote = (event) => {
  event.preventDefault()
  console.log('button clicked', event.target)
}
```

<!-- The <em>event</em> parameter is the [event](https://react.dev/learn/responding-to-events) that triggers the call to the event handler function:-->
<em>事件</em>参数是触发调用事件处理函数的[事件](https://react.dev/learn/responding-to-events)：

<!-- The event handler immediately calls the <em>event.preventDefault()</em> method, which prevents the default action of submitting a form. The default action would, [among other things](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event), cause the page to reload.-->
事件处理程序立即调用<em>event.preventDefault()</em> 方法，以防止提交表单的默认操作。默认操作将，[除其他外](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event)，导致页面重新加载。

<!-- The target of the event stored in _event.target_ is logged to the console:-->
在控制台记录存储在_event.target_中的事件目标：

![button clicked with form object console](../../images/2/6e.png)

<!-- The target in this case is the form that we have defined in our component.-->
这种情况下的目标是我们在组件中定义的表单。

<!-- How do we access the data contained in the form's <i>input</i> element?-->
我们如何访问表单<i>输入</i>元素中包含的数据？

### Controlled component

<!-- There are many ways to accomplish this; the first method we will take a look at is through the use of so-called [controlled components](https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable).-->
有很多方法可以实现这一目标；我们首先要看的是通过所谓的[受控组件](https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable)。

<!-- Let's add a new piece of state called <em>newNote</em> for storing the user-submitted input **and** let's set it as the <i>input</i> element's <i>value</i> attribute:-->
让我们添加一个新的状态叫做<em>newNote</em>来存储用户提交的输入，并设置它作为<i>input</i>元素的<i>value</i>属性：

```js
const App = (props) => {
  const [notes, setNotes] = useState(props.notes)
  // highlight-start
  const [newNote, setNewNote] = useState(
    'a new note...'
  )
  // highlight-end

  const addNote = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
  }

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note =>
          <Note key={note.id} note={note} />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} /> //highlight-line
        <button type="submit">save</button>
      </form>
    </div>
  )
}
```

<!-- The placeholder text stored as the initial value of the <em>newNote</em> state appears in the <i>input</i> element, but the input text can''t be edited. The console displays a warning that gives us a clue as to what might be wrong:-->
在<em>newNote</em>状态的初始值中存储的占位符文本出现在<i>input</i>元素中，但是输入文本不能被编辑。控制台显示一个警告，给我们提供了可能出错的线索：

![provided value to prop without onchange console error](../../images/2/7e.png)

<!-- Since we assigned a piece of the <i>App</i> component's state as the <i>value</i> attribute of the input element, the <i>App</i> component now [controls](https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable) the behavior of the input element.-->
由于我们将<i>App</i>组件的一部分状态分配给输入元素的<i>value</i>属性，因此<i>App</i>组件现在[控制](https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable)输入元素的行为。

<!-- To enable editing of the input element, we have to register an <i>event handler</i> that synchronizes the changes made to the input with the component's state:-->
要使输入元素可编辑，我们必须注册一个<i>事件处理程序</i>，以将对输入所做的更改与组件状态同步：

```js
const App = (props) => {
  const [notes, setNotes] = useState(props.notes)
  const [newNote, setNewNote] = useState(
    'a new note...'
  )

  // ...

// highlight-start
  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }
// highlight-end

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note =>
          <Note key={note.id} note={note} />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleNoteChange} // highlight-line
        />
        <button type="submit">save</button>
      </form>
    </div>
  )
}
```

<!-- We have now registered an event handler to the <i>onChange</i> attribute of the form's <i>input</i> element:-->
我们现在已经为表单的<i>onChange</i>属性注册了一个事件处理程序，<i>input</i>元素：

```js
<input
  value={newNote}
  onChange={handleNoteChange}
/>
```

<!-- The event handler is called every time <i>a change occurs in the input element</i>. The event handler function receives the event object as its <em>event</em> parameter:-->
事件捕获器每次<i>输入元素发生变化</i>时都会被调用。事件捕获器函数接收事件对象作为其<em>事件</em>参数：

```js
const handleNoteChange = (event) => {
  console.log(event.target.value)
  setNewNote(event.target.value)
}
```

<!-- The <em>target</em> property of the event object now corresponds to the controlled <i>input</i> element, and <em>event.target.value</em> refers to the input value of that element.-->
事件对象的<em>target</em>属性现在对应受控<i>input</i>元素，而<em>event.target.value</em>指的是该元素的输入值。

<!-- Note that we did not need to call the _event.preventDefault()_ method like we did in the <i>onSubmit</i> event handler. This is because no default action occurs on an input change, unlike a form submission.-->
注意，我们不需要像在<i>onSubmit</i>事件处理程序中那样调用_event.preventDefault()_方法。这是因为在输入更改时不会发生默认操作，不像表单提交。

<!-- You can follow along in the console to see how the event handler is called:-->
你可以在控制台中跟随一起，看看事件处理程序是如何被调用的：

![multiple console calls with typing text](../../images/2/8e.png)

<!-- You did remember to install [React devtools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi), right? Good. You can directly view how the state changes from the React Devtools tab:-->
你记得安装[React devtools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)了吗？很好。你可以从React Devtools标签直接查看状态如何更改：

![state changes in react devtools shows typing too](../../images/2/9ea.png)

<!-- Now the <i>App</i> component's <em>newNote</em> state reflects the current value of the input, which means that we can complete the <em>addNote</em> function for creating new notes:-->
现在<i>App</i>组件的<em>newNote</em>状态反映了输入的当前值，这意味着我们可以完成<em>addNote</em>函数来创建新的笔记：

```js
const addNote = (event) => {
  event.preventDefault()
  const noteObject = {
    content: newNote,
    important: Math.random() < 0.5,
    id: notes.length + 1,
  }

  setNotes(notes.concat(noteObject))
  setNewNote('')
}
```

<!-- First, we create a new object for the note called <em>noteObject</em> that will receive its content from the component's <em>newNote</em> state. The unique identifier <i>id</i> is generated based on the total number of notes. This method works for our application since notes are never deleted. With the help of the <em>Math.random()</em> function, our note has a 50% chance of being marked as important.-->
首先，我们创建一个新的对象<em>noteObject</em>来存储笔记内容，它的内容来自组件的<em>newNote</em>状态。唯一标识符<i>id</i>是基于笔记的总数来生成的。这种方法对我们的应用程序有效，因为笔记永远不会被删除。借助<em>Math.random()</em>函数，我们的笔记有50%的机会被标记为重要的。

<!-- The new note is added to the list of notes using the [concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat) array method, introduced in [part 1](/en/part1/java_script#arrays):-->
新的笔记已经使用[concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat)数组方法添加到笔记列表中，该方法在[第1章节](/en/part1/java_script#arrays)中介绍：

```js
setNotes(notes.concat(noteObject))
```

<!-- The method does not mutate the original <em>notes</em> array, but rather creates <i>a new copy of the array with the new item added to the end</i>. This is important since we must [never mutate state directly](https://react.dev/learn/updating-objects-in-state#why-is-mutating-state-not-recommended-in-react) in React!-->
方法不会改变原始<em> notes </em>数组，而是创建<i>一个新的数组，在末尾添加新项</i>。 这很重要，因为我们必须[永远不能在 React 中直接改变状态](https://react.dev/learn/updating-objects-in-state#why-is-mutating-state-not-recommended-in-react)！

<!-- The event handler also resets the value of the controlled input element by calling the <em>setNewNote</em> function of the <em>newNote</em> state:-->
事件处理程序还通过调用<em>newNote</em>状态的<em>setNewNote</em>函数来重置受控输入元素的值：

```js
setNewNote('')
```

<!-- You can find the code for our current application in its entirety in the <i>part2-2</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part2-notes/tree/part2-2).-->
你可以在[这个GitHub仓库](https://github.com/fullstack-hy2020/part2-notes/tree/part2-2)的<i>part2-2</i>分支中找到我们当前应用的完整代码。

### Filtering Displayed Elements

<!-- Let's add some new functionality to our application that allows us to only view the important notes.-->
让我们给我们的应用程序添加一些新的功能，让我们只能查看重要的笔记。

<!-- Let's add a piece of state to the <i>App</i> component that keeps track of which notes should be displayed:-->
让我们给<i>App</i>组件增加一个状态，用来跟踪哪些笔记应该被显示：

```js
const App = (props) => {
  const [notes, setNotes] = useState(props.notes)
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true) // highlight-line

  // ...
}
```

<!-- Let's change the component so that it stores a list of all the notes to be displayed in the <em>notesToShow</em> variable. The items on the list depend on the state of the component:-->
让我们改变组件，以便它存储一个列表，所有的笔记都存储在<em>notesToShow</em>变量中。该列表的项目取决于组件的状态：

```js
import { useState } from 'react'
import Note from './components/Note'

const App = (props) => {
  const [notes, setNotes] = useState(props.notes)
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  // ...

// highlight-start
  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important === true)
// highlight-end

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notesToShow.map(note => // highlight-line
          <Note key={note.id} note={note} />
        )}
      </ul>
      // ...
    </div>
  )
}
```

<!-- The definition of the <em>notesToShow</em> variable is rather compact:-->
变量<em>notesToShow</em>的定义相当简洁：

```js
const notesToShow = showAll
  ? notes
  : notes.filter(note => note.important === true)
```

<!-- The definition uses the [conditional](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) operator also found in many other programming languages.-->
定义使用[条件](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator)操作符，这也是许多其他编程语言中常见的。

<!-- The operator functions as follows. If we have:-->
操作符的功能如下：如果我们有：

```js
const result = condition ? val1 : val2
```

<!-- the <em>result</em> variable will be set to the value of <em>val1</em> if <em>condition</em> is true. If <em>condition</em> is false, the <em>result</em> variable will be set to the value of<em>val2</em>.-->
如果<em>condition</em>为真，<em>result</em>变量将被设置为<em>val1</em>的值。如果<em>condition</em>为假，<em>result</em>变量将被设置为<em>val2</em>的值。

<!-- If the value of <em>showAll</em> is false, the <em>notesToShow</em> variable will be assigned to a list that only contains notes that have the <em>important</em> property set to true. Filtering is done with the help of the array [filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) method:-->
如果<em>showAll</em>的值为false，那么<em>notesToShow</em>变量将被赋值为一个仅包含有<em>important</em>属性设置为true的列表。过滤是通过数组[filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)方法完成的：

```js
notes.filter(note => note.important === true)
```

<!-- The comparison operator is redundant, since the value of <em>note.important</em> is either <i>true</i> or <i>false</i>, which means that we can simply write:-->
比较运算符是多余的，因为<em>note.important</em>的值要么是<i>true</i>要么是<i>false</i>，这意味着我们可以简单地写：

```js
notes.filter(note => note.important)
```

<!-- We showed the comparison operator first to emphasize an important detail: in JavaScript <em>val1 == val2</em> does not always work as expected. When performing comparisons, it's therefore safer to exclusively use <em>val1 === val2</em>. You can read more about the topic [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness).-->
我们首先展示了比较运算符，以强调一个重要细节：在JavaScript中，<em>val1 == val2</em>并不总是按预期工作。因此，在执行比较时，最好只使用<em>val1 === val2</em>。您可以在[此处](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness)阅读有关该主题的更多信息。

<!-- You can test out the filtering functionality by changing the initial value of the <em>showAll</em> state.-->
你可以通过改变<em>showAll</em>状态的初始值来测试过滤功能。

<!-- Next, let's add functionality that enables users to toggle the <em>showAll</em> state of the application from the user interface.-->
接下来，让我们添加功能，使用户可以从用户界面切换应用程序的<em>showAll</em>状态。

<!-- The relevant changes are shown below:-->
以下是相关的变化：

```js
import { useState } from 'react'
import Note from './components/Note'

const App = (props) => {
  const [notes, setNotes] = useState(props.notes)
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  // ...

  return (
    <div>
      <h1>Notes</h1>
// highlight-start
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>
// highlight-end
      <ul>
        {notesToShow.map(note =>
          <Note key={note.id} note={note} />
        )}
      </ul>
      // ...
    </div>
  )
}
```

<!-- The displayed notes (all versus important) are controlled with a button. The event handler for the button is so simple that it has been defined directly in the attribute of the button element. The event handler switches the value of _showAll_ from true to false and vice versa:-->

<div class="zh-CN">显示的笔记（全部的或重要的）可以通过一个按钮来控制。按钮的事件处理程序如此简单，以至于它已经直接定义在按钮元素的属性中。事件处理程序会将_showAll_的值从true切换到false，反之亦然：</div>

```js
() => setShowAll(!showAll)
```

<!-- The text of the button depends on the value of the <em>showAll</em> state:-->
按钮的文本取决于<em>showAll</em>状态的值：

```js
show {showAll ? 'important' : 'all'}
```

<!-- You can find the code for our current application in its entirety in the <i>part2-3</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part2-notes/tree/part2-3).-->
您可以在[此GitHub存储库](https://github.com/fullstack-hy2020/part2-notes/tree/part2-3)的<i>part2-3</i>分支中找到我们当前应用程序的完整代码。
</div>

<div class="tasks">

<h3>Exercises 2.6.-2.10.</h3>

<!-- In the first exercise, we will start working on an application that will be further developed in the later exercises. In related sets of exercises, it is sufficient to return the final version of your application. You may also make a separate commit after you have finished each part of the exercise set, but doing so is not required.-->
在第一个练习中，我们将开始开发一个将在以后的练习中进一步开发的应用程式。在相关的练习集中，只需返回应用程式的最终版本即可。您也可以在完成练习集的每个部分后进行单独提交，但这样做并不是必须的。

<!-- **WARNING** create-react-app will automatically turn your project into a git-repository unless you create your application inside of an existing git repository. You likely **do not want** your project to be a repository, so simply run the _rm -rf .git_ command at the root of your application.-->
**警告**：除非在现有的git存储库中创建应用程序，否则create-react-app将自动将您的项目转换为git存储库。您可能**不希望**您的项目成为存储库，因此只需在应用程序的根目录中运行_rm -rf .git_命令即可。

<h4>2.6: The Phonebook Step1</h4>

<!-- Let's create a simple phonebook. <i>**In this part, we will only be adding names to the phonebook.**</i>-->
让我们创建一个简单的电话簿。<i>**在这一部分，我们只会向电话簿中添加名字。**</i>

<!-- Let us start by implementing the addition of a person to the phonebook.-->
让我们从实现向电话簿添加一个人开始。

<!-- You can use the code below as a starting point for the <i>App</i> component of your application:-->
你可以使用下面的代码作为你应用程序<i>App</i>组件的起点：

```js
import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ])
  const [newName, setNewName] = useState('')

  return (
    <div>
      <h2>Phonebook</h2>
      <form>
        <div>
          name: <input />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      ...
    </div>
  )
}

export default App
```

<!-- The <em>newName</em> state is meant for controlling the form input element.-->
<em>新名字</em>状态旨在控制表单输入元素。

<!-- Sometimes it can be useful to render state and other variables as text for debugging purposes. You can temporarily add the following element to the rendered component:-->
有时为了调试目的，可以将状态和其他变量呈现为文本是有用的。您可以暂时将以下元素添加到渲染的组件中：

```html
<div>debug: {newName}</div>
```

<!-- It's also important to put what we learned in the [debugging React applications](/en/part1/a_more_complex_state_debugging_react_apps) chapter of part one into good use. The [React developer tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) extension is <i>incredibly</i> useful for tracking changes that occur in the application's state.-->
也很重要的是把我们在第一章节的[debugging React applications](/en/part1/a_more_complex_state_debugging_react_apps) 章节学到的内容用起来。[React developer tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) 扩展程序对于追踪应用程序状态发生的变化<i>非常有用</i>。

<!-- After finishing this exercise your application should look something like this:-->
完成这个练习后，你的应用程序应该看起来像这样：

![screenshot of 2.6 finished](../../images/2/10e.png)

<!-- Note the use of the React developer tools extension in the picture above!-->
图片中注意使用React开发者工具扩展！

<!-- **NB:**-->
This is a test

**这是一个测试**

<!-- - you can use the person's name as a value of the <i>key</i> property-->
你可以把一个人的名字作为<i>key</i>属性的值。
<!-- - remember to prevent the default action of submitting HTML forms!-->
**记住要阻止提交HTML表单的默认行为！**

<h4>2.7: The Phonebook Step2</h4>

<!-- Prevent the user from being able to add names that already exist in the phonebook. JavaScript arrays have numerous suitable [methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) for accomplishing this task. Keep in mind [how object equality works](https://www.joshbritz.co/posts/why-its-so-hard-to-check-object-equality/) in Javascript.-->
防止用户能够添加已存在于电话簿中的名字。JavaScript数组有许多适合[方法](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)来完成这项任务。请记住[JavaScript中对象等式如何工作](https://www.joshbritz.co/posts/why-its-so-hard-to-check-object-equality/)。

<!-- Issue a warning with the [alert](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert) command when such an action is attempted:-->
使用[警告](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert)命令在尝试这样的行为时发出警告：

![2.7 sample screenshot](../../images/2/11e.png)

<!-- **Hint:** when you are forming strings that contain values from variables, it is recommended to use a [template string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals):-->
**我今年${age}岁，我的父亲${fatherAge}岁。**

**我今年${age}岁，我的父亲${fatherAge}岁。**

**我今年${age}岁，我的父亲${fatherAge}岁。**

```js
`${newName} is already added to phonebook`
```

<!-- If the <em>newName</em> variable holds the value <i>Arto Hellas</i>, the template string expression returns the string-->
<b>Hello Arto Hellas</b>.

如果<em>newName</em>变量持有值<i>Arto Hellas</i>，模板字符串表达式将返回字符串<b>Hello Arto Hellas</b>。

```js
`Arto Hellas is already added to phonebook`
```

<!-- The same could be done in a more Java-like fashion by using the plus operator:-->
可以用加号运算符以更类似Java的方式来实现同样的功能：

```js
newName + ' is already added to phonebook'
```

<!-- Using template strings is the more idiomatic option and the sign of a true JavaScript professional.-->
使用模板字符串是更加惯用的选择，也是真正的JavaScript专业人士的标志。

<h4>2.8: The Phonebook Step3</h4>

<!-- Expand your application by allowing users to add phone numbers to the phone book. You will need to add a second <i>input</i> element to the form (along with its own event handler):-->
扩展你的应用程序，允许用户将电话号码添加到电话簿中。你需要在表单中添加第二个<i>输入</i>元素（以及它自己的事件处理程序）：

```js
<form>
  <div>name: <input /></div>
  <div>number: <input /></div>
  <div><button type="submit">add</button></div>
</form>
```

<!-- At this point, the application could look something like this. The image also displays the application's state with the help of [React developer tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi):-->
此时，应用程序可能看起来像这样。图像还使用[React开发者工具](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)显示应用程序的状态：

![2.8 sample screenshot](../../images/2/12e.png)

<h4>2.9*: The Phonebook Step4</h4>

<!-- Implement a search field that can be used to filter the list of people by name:-->
实现一个搜索字段，可用于按名称筛选人员列表：

![2.9 sample screenshot](../../images/2/13e.png)

<!-- You can implement the search field as an <i>input</i> element that is placed outside the HTML form. The filtering logic shown in the image is <i>case insensitive</i>, meaning that the search term <i>arto</i> also returns results that contain Arto with an uppercase A.-->
你可以将搜索字段实现为一个放置在HTML表单之外的<i>输入</i>元素。图中显示的过滤逻辑是<i>不区分大小写</i>的，这意味着搜索词<i>arto</i>也会返回包含大写A的Arto的结果。

<!-- **NB:** When you are working on new functionality, it's often useful to "hardcode" some dummy data into your application, e.g.-->
to test a UI.

当你在开发新功能时，经常有用的是在应用程序中“硬编码”一些虚拟数据，例如用于测试UI。

```js
const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])

  // ...
}
```

<!-- This saves you from having to manually input data into your application for testing out your new functionality.-->
这可以节省您不必手动输入数据到您的应用程序中来测试新功能的时间。

<h4>2.10: The Phonebook Step5</h4>

<!-- If you have implemented your application in a single component, refactor it by extracting suitable parts into new components. Maintain the application's state and all event handlers in the <i>App</i> root component.-->
如果你已经在一个组件中实现了你的应用，那么通过把合适的部分提取到新的组件中来重构它。将应用程序的状态和所有事件处理程序维护在<i>App</i>根组件中。

<!-- It is sufficient to extract <i>**three**</i> components from the application. Good candidates for separate components are, for example, the search filter, the form for adding new people to the phonebook, a component that renders all people from the phonebook, and a component that renders a single person's details.-->
它足以从应用程序中提取<i>**三**</i>个组件。好的候选组件例如，搜索过滤器，添加新人员到电话簿的表格，一个渲染所有电话簿人员的组件，以及一个渲染单个人物详情的组件。

<!-- The application's root component could look similar to this after the refactoring. The refactored root component below only renders titles and lets the extracted components take care of the rest.-->
此应用的根组件在重构后可能会类似于以下：下面重构后的根组件只渲染标题，而由提取的组件来处理其余部分。

```js
const App = () => {
  // ...

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter ... />

      <h3>Add a new</h3>

      <PersonForm
        ...
      />

      <h3>Numbers</h3>

      <Persons ... />
    </div>
  )
}
```

<!-- **NB**: You might run into problems in this exercise if you define your components "in the wrong place". Now would be a good time to rehearse-->
the concepts of "component composition" and "component nesting".

**译文：**
**注意：**如果您在错误的地方定义组件，可能会遇到问题。现在是复习“组件组合”和“组件嵌套”概念的好时机。
<!-- the chapter [do not define a component in another component](/en/part1/a_more_complex_state_debugging_react_apps#do-not-define-components-within-components)-->

我们在上一章学到的，不要在另一个组件中定义组件[不要在另一个组件中定义组件](/zh-CN/part1/a_more_complex_state_debugging_react_apps#不要在另一个组件中定义组件)

<!-- from the last part.-->

</div>
