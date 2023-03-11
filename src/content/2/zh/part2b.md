---
mainImage: ../../../images/part-2.svg
part: 2
letter: b
lang: zh
---

<div class="content">
<!-- Let's continue expanding our application by allowing users to add new notes. You can find the code for our current application [here](https://github.com/fullstack-hy2020/part2-notes/tree/part2-1).-->

 让我们继续扩展我们的应用，允许用户添加新的笔记。你可以找到我们当前应用的代码[这里](https://github.com/fullstack-hy2020/part2-notes/tree/part2-1)。

<!-- In order to get our page to update when new notes are added it's best to store the notes in the <i>App</i> component's state. Let's import the [useState](https://reactjs.org/docs/hooks-state.html) function and use it to define a piece of state that gets initialized with the initial notes array passed in the props.-->
 为了让我们的页面在添加新的笔记时得到更新，最好将笔记存储在<i>App</i>组件的状态中。让我们导入[useState](https://reactjs.org/docs/hooks-state.html)函数，用它来定义一块状态，用prop中传递的初始笔记数组进行初始化。

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
 该组件使用<em>useState</em>函数来初始化存储在<em>notes</em>中的状态片断，并使用prop中传递的笔记阵列。

```js
const App = (props) => {
  const [notes, setNotes] = useState(props.notes)

  // ...
}
```


<!-- If we wanted to start with an empty list of notes, we would set the initial value as an empty array, and since the props would not be used, we could omit the <em>props</em> parameter from the function definition:-->
 如果我们想从一个空的笔记列表开始，我们会把初始值设置为一个空的数组，而且由于prop不会被使用，我们可以从函数定义中省略<em>props</em>参数。

```js
const App = () => {
  const [notes, setNotes] = useState([])

  // ...
}
```

<!-- Let's stick with the initial value passed in the props for the time being.-->
 让我们暂时坚持使用props中传递的初始值。

<!-- Next, let's add an HTML [form](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms) to the component that will be used for adding new notes.-->
 接下来，让我们在组件中添加一个HTML[表单](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms)，用来添加新的笔记。

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
 我们将_addNote_函数作为事件处理程序添加到表单元素中，当表单被提交时，点击提交按钮，该函数将被调用。

<!-- We use the method discussed in [part 1](/en/part1/component_state_event_handlers#event-handling) for defining our event handler:-->
 我们使用在[第一章节](/en/part1/component_state_event_handlers#event-handling)中讨论的方法来定义我们的事件处理器。

```js
const addNote = (event) => {
  event.preventDefault()
  console.log('button clicked', event.target)
}
```

<!-- The <em>event</em> parameter is the [event](https://reactjs.org/docs/handling-events.html) that triggers the call to the event handler function:-->
 参数<em>event</em>是触发调用事件处理函数的[事件](https://reactjs.org/docs/handling-events.html)。

<!-- The event handler immediately calls the <em>event.preventDefault()</em> method, which prevents the default action of submitting a form. The default action would, [among other things](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event), cause the page to reload.-->
 事件处理程序立即调用<em>event.preventDefault()</em>方法，防止提交表单的默认动作。默认动作会，[忽略其他操作](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event)，导致页面重新加载。


<!-- The target of the event stored in _event.target_ is logged to the console:-->
存储在_event.target_中的事件的目标被记录到控制台。

![](../../images/2/6e.png)


<!-- The target in this case is the form that we have defined in our component.-->
本例中的目标是我们在组件中定义的表单。

<!-- How do we access the data contained in the form's <i>input</i> element?-->
 我们如何访问表单的<i>input</i>元素中包含的数据？

### Controlled component

<!-- There are many ways to accomplish this; the first method we will take a look at is through the use of so-called [controlled components](https://reactjs.org/docs/forms.html#controlled-components).-->
有很多方法可以完成这个需求；我们要看的第一个方法是通过使用所谓的[受控组件](https://reactjs.org/docs/forms.html#controlled-components)。

<!-- Let's add a new piece of state called <em>newNote</em> for storing the user-submitted input **and** let's set it as the <i>input</i> element's <i>value</i> attribute:-->
 让我们添加一个新的状态，叫做<em>newNote</em>，用来存储用户提交的输入，让我们把它设置为<i>input</i>元素的<i>value</i>属性。

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

<!-- The placeholder text stored as the initial value of the <em>newNote</em> state appears in the <i>input</i> element, but the input text can't be edited. The console displays a warning that gives us a clue as to what might be wrong:-->
 存储为<em>newNote</em>状态初始值的占位符文本出现在<i>input</i>元素中，但输入文本不能被编辑。控制台显示了一个警告，给了我们一个可能出错的提示。

![](../../images/2/7e.png)

<!-- Since we assigned a piece of the <i>App</i> component's state as the <i>value</i> attribute of the input element, the <i>App</i> component now [controls](https://reactjs.org/docs/forms.html#controlled-components) the behavior of the input element.-->
 由于我们将<i>App</i>组件的一部分状态指定为输入元素的<i>value</i>属性，<i>App</i>组件现在[控制](https://reactjs.org/docs/forms.html#controlled-components)了输入元素的行为。

<!-- In order to enable editing of the input element, we have to register an <i>event handler</i> that synchronizes the changes made to the input with the component's state:-->
为了实现对输入元素的编辑，我们必须注册一个<i>事件处理程序</i>，使输入元素的变化与组件的状态同步。

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
 我们现在已经为表单的<i>输入</i>元素的<i>onChange</i>属性注册了一个事件处理器。

```js
<input
  value={newNote}
  onChange={handleNoteChange}
/>
```

<!-- The event handler is called every time <i>a change occurs in the input element</i>. The event handler function receives the event object as its <em>event</em> parameter:-->
 每次<i>输入元素发生变化时</i>都会调用事件处理程序。事件处理函数接收事件对象作为其<em>event</em>参数。

```js
const handleNoteChange = (event) => {
  console.log(event.target.value)
  setNewNote(event.target.value)
}
```

<!-- The <em>target</em> property of the event object now corresponds to the controlled <i>input</i> element, and <em>event.target.value</em> refers to the input value of that element.-->
 事件对象的<em>target</em>属性现在对应于被控制的<i>input</i>元素，而<em>event.target.value</em>指的是该元素的输入值。

<!-- Note that we did not need to call the _event.preventDefault()_ method like we did in the <i>onSubmit</i> event handler. This is because there is no default action that occurs on an input change, unlike on a form submission.-->
 注意，我们不需要像在<i>onSubmit</i>事件处理程序中那样调用_event.preventDefault()_方法。这是因为在输入变化时没有默认动作，这与表单提交时不同。

<!-- You can follow along in the console to see how the event handler is called:-->
 你可以在控制台中跟随，看看事件处理程序是如何被调用的。

![](../../images/2/8e.png)

<!-- You did remember to install [React devtools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi), right? Good. You can directly view how the state changes from the React Devtools tab:-->
 你记得自己安装了[React devtools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)，对吗？很好。你可以直接从React Devtools标签中查看状态如何变化。

![](../../images/2/9ea.png)

<!-- Now the <i>App</i> component's <em>newNote</em> state reflects the current value of the input, which means that we can complete the <em>addNote</em> function for creating new notes:-->
 现在<i>App</i>组件的<em>newNote</em>状态反映了输入的当前值，这意味着我们可以完成创建新笔记的<em>addNote</em>功能。

```js
const addNote = (event) => {
  event.preventDefault()
  const noteObject = {
    content: newNote,
    date: new Date().toISOString(),
    important: Math.random() < 0.5,
    id: notes.length + 1,
  }

  setNotes(notes.concat(noteObject))
  setNewNote('')
}
```

<!-- First, we create a new object for the note called <em>noteObject</em> that will receive its content from the component's <em>newNote</em> state. The unique identifier <i>id</i> is generated based on the total number of notes. This method works for our application since notes are never deleted. With the help of the <em>Math.random()</em> function, our note has a 50% chance of being marked as important.-->
 首先，我们为笔记创建一个新的对象，叫做<em>noteObject</em>，它将从组件的<em>newNote</em>状态接收其内容。唯一的标识符<i>id</i>是根据笔记的总数生成的。这种方法适用于我们的应用，因为笔记永远不会被删除。在<em>Math.random()</em>函数的帮助下，我们的笔记有50%的机会被标记为重要。

<!-- The new note is added to the list of notes using the [concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat) array method, introduced in [part 1](/en/part1/java_script#arrays):-->
 使用[concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat)数组方法将新笔记添加到笔记列表中，该方法在[第一章节](/en/part1/java_script#arrays)中介绍过。

```js
setNotes(notes.concat(noteObject))
```

<!-- The method does not mutate the original <em>notes</em> array, but rather creates <i>a new copy of the array with the new item added to the end</i>. This is important since we must [never mutate state directly](https://reactjs.org/docs/state-and-lifecycle.html#using-state-correctly) in React!-->
 该方法并不改变原始的<em>notes</em>数组，而是创建<i>一个新的数组副本，将新的项目添加到最后</i>。这很重要，因为在React中我们必须[永远不要直接改变状态](https://reactjs.org/docs/state-and-lifecycle.html#using-state-correctly)!

<!-- The event handler also resets the value of the controlled input element by calling the <em>setNewNote</em> function of the <em>newNote</em> state:-->
 事件处理程序也通过调用<em>setNewNote</em>状态的<em>newNote</em>函数来重设受控输入元素的值。

```js
setNewNote('')
```

<!-- You can find the code for our current application in its entirety in the <i>part2-2</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part2-notes/tree/part2-2).-->
 你可以在[这个GitHub仓库](https://github.com/fullstack-hy2020/part2-notes/tree/part2-2)的<i>part2-2</i>分支中找到我们当前应用的全部代码。

### Filtering Displayed Elements

<!-- Let's add some new functionality to our application that allows us to only view the important notes.-->
 让我们为我们的应用添加一些新功能，我们只查看重要的笔记。

<!-- Let's add a piece of state to the <i>App</i> component that keeps track of which notes should be displayed:-->
 让我们在<i>App</i>组件中添加一个状态，跟踪哪些笔记应该被显示。

```js
const App = (props) => {
  const [notes, setNotes] = useState(props.notes)
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true) // highlight-line

  // ...
}
```

<!-- Let's change the component so that it stores a list of all the notes to be displayed in the <em>notesToShow</em> variable. The items of the list depend on the state of the component:-->
 让我们改变这个组件，让它在<em>notesToShow</em>变量中存储一个所有要显示的笔记的列表。列表中的项目取决于该组件的状态：

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
 <em>notesToShow</em>变量的定义相当紧凑。

```js
const notesToShow = showAll
  ? notes
  : notes.filter(note => note.important === true)
```

<!-- The definition uses the [conditional](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) operator also found in many other programming languages.-->
 该定义使用了[条件](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator)运算符，在许多其他编程语言中也有。

<!-- The operator functions as follows. If we have:-->
该操作符的功能如下。如果我们有：

```js
const result = condition ? val1 : val2
```

<!-- the <em>result</em> variable will be set to the value of <em>val1</em> if <em>condition</em> is true. If <em>condition</em> is false, the <em>result</em> variable will be set to the value of<em>val2</em>.-->
 如果<em>condition</em>为真，<em>result</em>变量将被设置为<em>val1</em>的值。如果<em>condition</em>是假的，<em>result</em>变量将被设置为<em>val2</em>的值。

<!-- If the value of <em>showAll</em> is false, the <em>notesToShow</em> variable will be assigned to a list that only contains notes that have the <em>important</em> property set to true. Filtering is done with the help of the array [filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) method:-->
 如果<em>showAll</em>的值为false，<em>notesToShow</em>变量将被分配到一个列表，该列表只包含<em>important</em>属性设置为true的笔记。过滤是在数组[filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)方法的帮助下完成的。

```js
notes.filter(note => note.important === true)
```

<!-- The comparison operator is in fact redundant, since the value of <em>note.important</em> is either <i>true</i> or <i>false</i>, which means that we can simply write:-->
 比较运算符实际上是多余的，因为<em>note.important</em>的值要么是<i>true</i>，要么是<i>false</i>，这意味着我们可以简单地写成：

```js
notes.filter(note => note.important)
```

<!-- The reason we showed the comparison operator first was to emphasize an important detail: in JavaScript <em>val1 == val2</em> does not work as expected in all situations and it's safer to use <em>val1 === val2</em> exclusively in comparisons. You can read more about the topic [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness).-->
 我们之所以先展示比较运算符，是为了强调一个重要的细节：在JavaScript中，<em>val1 == val2</em>并不是在所有情况下都能如愿以偿，在比较中完全使用<em>val1 === val2</em>会更安全。你可以阅读更多关于这个主题的内容，点击[这里](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness)。

<!-- You can test out the filtering functionality by changing the initial value of the <em>showAll</em> state.-->
 你可以通过改变<em>showAll</em>状态的初始值来测试过滤的功能。

<!-- Next, let's add functionality that enables users to toggle the <em>showAll</em> state of the application from the user interface.-->
 接下来，让我们添加功能，使用户能够从用户界面上切换应用的<em>showAll</em>状态。

<!-- The relevant changes are shown below:-->
相关的改变如下：

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
 显示的笔记（所有与重要的）是用一个按钮控制的。这个按钮的事件处理程序非常简单，它被直接定义在按钮元素的属性中。该事件处理程序将_showAll_的值从真切换到假，反之亦然。

```js
() => setShowAll(!showAll)
```

<!-- The text of the button depends on the value of the <em>showAll</em> state:-->
 按钮的文本取决于<em>showAll</em>状态的值：

```js
show {showAll ? 'important' : 'all'}
```

<!-- You can find the code for our current application in its entirety in the <i>part2-3</i> branch of [this GitHub repository](https://github.com/fullstack-hy2020/part2-notes/tree/part2-3).-->
 你可以在[这个GitHub仓库](https://github.com/fullstack-hy2020/part2-notes/tree/part2-3)的<i>part2-3</i>分支中找到我们当前应用的全部代码。
</div>

<div class="tasks">

<h3>Exercises 2.6.-2.10.</h3>

<!-- In the first exercise, we will start working on an application that will be further developed in the later exercises. In related sets of exercises it is sufficient to return the final version of your application. You may also make a separate commit after you have finished each part of the exercise set, but doing so is not required.-->
在第一个练习中，我们将开始研究一个将在后面的练习中进一步发展的应用。在相关的练习集中，只要返回你的应用的最终版本即可。你也可以在完成练习集的每个部分后单独提交，但不需要这样做。

<!-- **WARNING** create-react-app will automatically turn your project into a git-repository unless you create your application inside of an existing git repository. It's likely that you **do not want** your project to be a repository, so simply run the _rm -rf .git_ command at the root of your application.-->
 **警告** create-react-app会自动将你的项目变成一个git-repository，除非你在现有的git repository中创建你的应用。你很可能不希望**你的项目成为一个仓库，所以只要在你的应用的根部运行_rm -rf .git_命令即可。

<h4>2.6: The Phonebook Step1</h4>

<!-- Let's create a simple phonebook. <i>**In this part we will only be adding names to the phonebook.**</i>-->
 我们来创建一个简单的电话簿。<i>**在这一部分，我们将只在电话簿中添加名字。**</i>

<!-- Let us start by implementing the addition of a person to phonebook.-->
让我们开始实现在电话簿中添加一个人。

<!-- You can use the code below as a starting point for the <i>App</i> component of your application:-->
 你可以用下面的代码作为你的应用的<i>App</i>组件的起点。

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
 <em>newName</em>状态是用来控制表单输入元素的。

<!-- Sometimes it can be useful to render state and other variables as text for debugging purposes. You can temporarily add the following element to the rendered component:-->
 有时为了调试的目的，把状态和其他变量渲染成文本是很有用的。你可以暂时在渲染的组件中加入以下元素。

```
<div>debug: {newName}</div>
```

<!-- It's also important to put what we learned in the [debugging React applications](/en/part1/a_more_complex_state_debugging_react_apps) chapter of part one into good use. The [React developer tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) extension especially, is incredibly useful for tracking changes that occur in the application's state.-->
 把我们在第一章节的[调试React应用](/en/part1/a_more_complex_state_debugging_react_apps)一章中学到的东西好好利用也很重要。特别是[React开发者工具](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)扩展，对于跟踪应用的状态变化非常有用。

<!-- After finishing this exercise your application should look something like this:-->
 在完成这个练习后，你的应用应该如下所示：

![](../../images/2/10e.png)

<!-- Note the use of the React developer tools extension in the picture above!-->
 注意上图中React开发者工具扩展的使用!

<!-- **NB:**-->
 **NB:**


<!-- - you can use the person's name as value of the <i>key</i> property-->
 - 你可以用人的名字作为<i>key</i>属性的值
<!-- - remember to prevent the default action of submitting HTML forms!-->
 - 记住要防止提交HTML表单的默认动作!

<h4>2.7: The Phonebook Step2</h4>

<!-- Prevent the user from being able to add names that already exist in the phonebook. JavaScript arrays have numerous suitable [methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) for accomplishing this task. Keep in mind [how object equality works](https://www.joshbritz.co/posts/why-its-so-hard-to-check-object-equality/) in Javascript.-->
 防止用户能够添加已经存在于电话簿中的名字。JavaScript数组有许多合适的[方法](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)来完成这个任务。请记住[对象平等是如何工作的](https://www.joshbritz.co/posts/why-its-so-hard-to-check-object-equality/)在Javascript中。

<!-- Issue a warning with the [alert](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert) command when such an action is attempted:-->
 当试图进行这种操作时，用[警报](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert)命令发出警告。

![](../../images/2/11e.png)

<!-- **Hint:** when you are forming strings that contain values from variables, it is recommended to use a [template string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals):-->
 **提示：**当你形成包含变量值的字符串时，建议使用[模板字符串](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)。

```js
`${newName} is already added to phonebook`
```

<!-- If the <em>newName</em> variable holds the value <i>Arto Hellas</i>, the template string expression returns the string-->
 如果<em>newName</em>变量持有<i>Arto Hellas</i>的值，模板字符串表达式返回字符串

```js
`Arto Hellas is already added to phonebook`
```

<!-- The same could be done in a more Java-like fashion by using the plus operator:-->
 同样的事情可以通过使用加号运算符以更类似于Java的方式完成。

```js
newName + ' is already added to phonebook'
```

<!-- Using template strings is the more idiomatic option and the sign of a true JavaScript professional.-->
 使用模板字符串是更习惯的选择，也是真正的JavaScript专家的标志。

<h4>2.8: The Phonebook Step3</h4>

<!-- Expand your application by allowing users to add phone numbers to the phone book. You will need to add a second <i>input</i> element to the form (along with its own event handler):-->
通过允许用户向电话簿中添加电话号码来扩展你的应用。你需要在表单中添加第二个<i>input</i>元素（以及它自己的事件处理程序）。

```js
<form>
  <div>name: <input /></div>
  <div>number: <input /></div>
  <div><button type="submit">add</button></div>
</form>
```

<!-- At this point the application could look something like this. The image also displays the application's state with the help of [React developer tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi):-->
 在这一点上，该应用可以如下所示：在[React开发者工具](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)的帮助下，图片也显示了应用''的状态。

![](../../images/2/12e.png)

<h4>2.9*: The Phonebook Step4</h4>

<!-- Implement a search field that can be used to filter the list of people by name:-->
 实现一个搜索字段，可以用来按名字过滤人的列表。

![](../../images/2/13e.png)

<!-- You can implement the search field as an <i>input</i> element that is placed outside the HTML form. The filtering logic shown in the image is <i>case insensitive</i>, meaning that the search term <i>arto</i> also returns results that contain Arto with an uppercase A.-->
 你可以将搜索字段实现为一个<i>输入</i>元素，放在HTML表单之外。图片中显示的过滤逻辑是<i>大小写不敏感的</i>，意味着搜索词<i>arto</i>也会返回包含Arto的大写A的结果。

<!-- **NB:** When you are working on new functionality, it's often useful to "hardcode" some dummy data into your application, e.g.-->
 **NB:** 当你在开发新的功能时，在你的应用中 "硬编码 "一些假数据往往是有用的，例如

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
 这可以使你不必为测试新功能而手动输入数据到你的应用中。

<h4>2.10: The Phonebook Step5</h4>

<!-- If you have implemented your application in a single component, refactor it by extracting suitable parts into new components. Maintain the application's state and all event handlers in the <i>App</i> root component.-->
 如果你已经在一个单一的组件中实现了你的应用，通过提取合适的部分到新的组件中来重构它。在<i>App</i>根组件中维护应用的状态和所有事件处理程序。

<!-- It is sufficient to extract <i>**three**</i> components from the application. Good candidates for separate components are, for example, the search filter, the form for adding new people into the phonebook, a component that renders all people from the phonebook, and a component that renders a single person's details.-->
从应用中提取<i>**三个**</i>组件即可。独立组件的良好候选者是，例如，搜索过滤器、将新的人加入电话簿的表格、显示电话簿中所有的人的组件，以及显示一个人的详细资料的组件。

<!-- The application's root component could look similar to this after the refactoring. The refactored root component below only renders titles and lets the extracted components take care of the rest.-->
 在重构之后，应用的根组件看起来与此类似。下面这个重构后的根组件只渲染标题，让提取的组件来处理其余的部分。

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
 **NB**: 如果你在 "错误的地方 "定义你的组件，你可能会在这个练习中遇到问题。现在是一个很好的时机来排练一下
<!-- the chapter [do not define a component in another component](/en/part1/a_more_complex_state_debugging_react_apps#do-not-define-components-within-components)-->
 [不要在另一个组件中定义一个组件](/en/part1/a_more_complex_state_debugging_react_apps#do-not-define-components-within-components)这一章节。
<!-- from last part.-->
来自最后一部分。

</div>
