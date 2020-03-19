---
mainImage: ../../../images/part-2.svg
part: 2
letter: b
lang: zh
---

<div class="content">
Div class"content"

Let's continue expanding our application by allowing users to add new notes. 
让我们通过允许用户添加新注释来继续扩展我们的应用程序。

In order to get our page to update when new notes are added it's best to store the notes in the <i>App</i> component's state. Let's import the [useState](https://reactjs.org/docs/hooks-state.html) function and use it to define a piece of state that gets initialized with the initial notes array passed in the props. 
为了让我们的页面在添加新注释时更新，最好将注释存储在 i App / i 组件的状态中。 让我们导入[ useState ]( https://reactjs.org/docs/hooks-state.html )函数，并使用它定义一个用道具中传递的初始注释数组初始化的状态块。

```js
import React, { useState } from 'react' // highlight-line
import Note from './components/Note'

const App = (props) => { // highlight-line
  const [notes, setNotes] = useState(props.notes) // highlight-line

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map((note, i) => 
          <Note key={i} note={note} />
        )}
      </ul>
    </div>
  )
}

export default App 
```

The component uses the <em>useState</em> function to initialize the piece of state stored in <em>notes</em> with the array of notes passed in the props:
该组件使用 em useState / em 函数通过在道具中传递注释数组来初始化存储在 em notes / em 中的状态片段:

```js
const App = (props) => { 
  const [notes, setNotes] = useState(props.notes) 

  // ...
}
```


If we wanted to start with an empty list of notes we would set the initial value as an empty array, and since the props would not then be used, we could omit the <em>props</em> parameter from the function definition:
如果我们想从一个空的注释列表开始，我们会将初始值设置为一个空数组，由于道具不会被使用，我们可以从函数定义中省略 em props / em 参数:

```js
const App = () => { 
  const [notes, setNotes] = useState([]) 

  // ...
}  
```


Let's stick with the initial value passed in the props for the time being.
让我们暂时坚持使用传递到道具中的初始值。


Next, let's add an HTML [form](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms) to the component that will be used for adding new notes.
接下来，让我们在组件中添加一个 HTML [ form ]( https://developer.mozilla.org/en-us/docs/learn/HTML/forms 表单) ，用于添加新的注释。

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
        {notes.map((note, i) => 
          <Note key={i} note={note} />
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

We have added the _addNote_ function as an event handler to the form element that will be called when the form is submitted by clicking the submit button.
我们已经将 addNote 函数作为事件处理程序添加到表单元素中，该元素将在单击 submit 按钮提交表单时被调用。

We use the method discussed in [part 1](/en/part1/component_state_event_handlers#event-handling) for defining our event handler:
我们使用[ part 1](/ en / part1 / component state handlers # event-handling)中讨论的方法来定义事件处理程序:

```js
const addNote = (event) => {
  event.preventDefault()
  console.log('button clicked', event.target)
}
```

The <em>event</em> parameter is the [event](https://reactjs.org/docs/handling-events.html) that triggers the call to the event handler function: 
Em event / em 参数是触发对事件处理函数的调用的[ event ]( https://reactjs.org/docs/handling-events.html ) :


The event handler immediately calls the <em>event.preventDefault()</em> method, which prevents the default action of submitting a form. The default action would, among other things, cause the page to reload.
事件处理程序立即调用 em event.preventDefault () / em 方法，它阻止提交表单的默认操作。 默认操作会导致页面重新加载。


The target of the event stored in _event.target_ is logged to the console
将 event.target 中存储的事件的目标记录到控制台

![](../../images/2/6e.png)
! [](. . / . / images / 2 / 6e.png)


The target in this case is the form that we have defined in our component.
本例中的目标是我们在组件中定义的形式。

How do we access the data contained in the form's <i>input</i> element?
我们如何访问表单的 i input / i 元素中包含的数据？

There are many ways to accomplish this; the first method we will take a look at is the use of so-called [controlled components](https://reactjs.org/docs/forms.html#controlled-components).
有许多方法可以实现这一点; 我们将介绍的第一种方法是使用所谓的[受控组件]( https://reactjs.org/docs/forms.html#controlled-components )。


Let's add a new piece of state called <em>newNote</em> for storing the user submitted input **and** let's set it as the <i>input</i> element's  <i>value</i> attribute:
让我们添加一个名为 em newNote / em 的新状态，用于存储用户提交的输入 * * 和 * * ，让我们将它设置为 i input / i 元素的 i value / i 属性:

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
        {notes.map((note, i) => 
          <Note key={i} note={note} />
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

The placeholder text stored as the initial value of the <em>newNote</em> state appears in the <i>input</i> element, but the input text can't be edited. The console displays a warning that gives us a clue as to what might be wrong:
作为 em newNote / em 状态初始值存储的占位符文本出现在 i input / i 元素中，但不能编辑输入文本。 控制台显示一个警告，告诉我们哪里可能出错了:

![](../../images/2/7e.png)
! [](. . / . / images / 2 / 7e.png)

Since we assigned a piece of the <i>App</i> component's state as the <i>value</i> attribute of the input element, the <i>App</i> component now [controls](https://reactjs.org/docs/forms.html#controlled-components) the behavior of the input element.
由于我们将 i App / i 组件的一部分状态指定为 input 元素的 i value / i 属性，因此 i App / i 组件现在[控制]( https://reactjs.org/docs/forms.html#controlled-components ) input 元素的行为。

In order to enable editing of the input element, we have to register an <i>event handler</i> that synchronizes the changes made to the input with the component's state:
为了能够编辑 input 元素，我们必须注册一个 i 事件处理程序 / i 来同步对 input 所做的更改和组件的状态:

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
        {notes.map((note, i) => 
          <Note key={i} note={note} />
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

We have now registered an event handler to the <i>onChange</i> attribute of the form's <i>input</i> element:
我们现在已经为表单的 i input / i 元素的 i onChange / i 属性注册了一个事件处理程序:

```js
<input
  value={newNote}
  onChange={handleNoteChange}
/>
```

The event handler is called every time <i>a change occurs in the input element</i>. The event handler function receives the event object as its <em>event</em> parameter:
每当输入元素 / i 中发生变化时，都会调用事件处理程序。 事件处理函数接收事件对象作为其 em event / em 参数:

```js
const handleNoteChange = (event) => {
  console.log(event.target.value)
  setNewNote(event.target.value)
}
```

The <em>target</em> property of the event object now corresponds to the controlled <i>input</i> element and <em>event.target.value</em> refers to the input value of that element.
事件对象的 em target / em 属性现在对应于受控的 i input / i 元素，em event.target.value / em 引用该元素的输入值。

Note that we did not need to call the _event.preventDefault()_ method like we did in the <i>onSubmit</i> event handler. This is because there is no default action that occurs on an input change, unlike on a form submission.
注意，我们不需要像在 i onSubmit / i 事件处理程序中那样调用 event.preventDefault ()方法。 这是因为与表单提交不同，输入更改上没有发生默认操作。

You can follow along in the console to see how the event handler is called:
您可以在控制台中查看如何调用事件处理程序:

![](../../images/2/8e.png)
! [](. . / . / images / 2 / 8e.png)

You did remember to install [React devtools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi), right? Good. You can directly view how the state changes from the React Devtools tab:
你确实记得安装了[ React devtools ]( https://chrome.google.com/webstore/detail/React-developer-tools/fmkadmapgofadopljbjfkapdkoienihi ) ，对吧？ 很好。 你可以直接从 React Devtools 选项卡查看状态的变化:

![](../../images/2/9ea.png)
! [](. . / . / images / 2 / 9ea.png)

Now the <i>App</i> component's <em>newNote</em> state reflects the current value of the input, which means that we can complete the <em>addNote</em> function for creating new notes:
现在 i App / i 组件的 em newNote / em 状态反映了输入的当前值，这意味着我们可以完成 em addNote / em 函数来创建新的备注:

```js
const addNote = (event) => {
  event.preventDefault()
  const noteObject = {
    content: newNote,
    date: new Date().toISOString(),
    important: Math.random() > 0.5,
    id: notes.length + 1,
  }

  setNotes(notes.concat(noteObject))
  setNewNote('')
}
```

First we create a new object for the note called <em>noteObject</em> that will receive its content from the component's <em>newNote</em> state. The unique identifier <i>id</i> is generated based on the total number of notes. This method works for our application since notes are never deleted. With the help of the <em>Math.random()</em> command, our note has a 50% chance of being marked as important.
首先，我们为名为 em noteObject / em 的注释创建一个新对象，该对象将从组件的 em newNote / em 状态接收其内容。 唯一标识符 / i id / i 是根据音符的总数生成的。 此方法适用于我们的应用程序，因为注释永远不会被删除。 在 em Math.random () / em 命令的帮助下，我们的注释有50% 的可能被标记为重要。

The new note is added to the list of notes using the [concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat) array method introduced in [part 1](/en/part1/javascript#arrays):
使用[ concat ](concat)( https://developer.mozilla.org/en-us/docs/web/javascript/reference/global_objects/array/concat )数组方法添加新注释到注释列表中[ part 1](/ en / part1 / javascript # 数组) :

```js
setNotes(notes.concat(noteObject))
```

The method does not mutate the original <em>notes</em> state array, but rather creates <i>a new copy of the array with the new item added to the end</i>. This is important since we must never [mutate state directly](https://reactjs.org/docs/state-and-lifecycle.html#using-state-correctly) in React!
该方法不会改变原始的 em notes / em 状态数组，而是创建数组的一个新副本，并将新项添加到 end / i 中。 这很重要，因为我们绝不能在反应中[直接变异状态]( https://reactjs.org/docs/state-and-lifecycle.html#using-state-correctly ) ！

The event handler also resets the value of the controlled input element by calling the <em>setNewNote</em> function of the <em>newNote</em> state:
事件处理程序还通过调用 em newNote / em 状态的 em setNewNote / em 函数重置受控输入元素的值:

```js
setNewNote('')
```

You can find the code for our current application in its entirety in the <i>part2-2</i> branch of [this github repository](https://github.com/fullstack-hy2020/part2-notes/tree/part2-2).
您可以在[ this github repository ]的 i part2-2 / i 分支中找到我们当前应用程序的全部代码，该分支位于 https://github.com/fullstack-hy2020/part2-notes/tree/part2-2。

### Filtering Displayed Elements
# # # 过滤显示的元素

Let's add some new functionality to our application that allows us to only view the important notes.
让我们为我们的应用程序添加一些新的功能，允许我们只查看重要的注意事项。

Let's add a piece of state to the <i>App</i> component that keeps track of which notes should be displayed:
让我们在 i App / i 组件中添加一个状态，用于跟踪应该显示哪些笔记:

```js
const App = (props) => {
  const [notes, setNotes] = useState(props.notes) 
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true) // highlight-line
  
  // ...
}
```

Let's change the component so that it stores a list of all the notes to be displayed in the <em>notesToShow</em> variable. The items of the list depend on the state of the component:
让我们更改组件，以便它存储要显示在 em notesToShow / em 变量中的所有注释的列表。 列表中的项取决于组件的状态:

```js
import React, { useState } from 'react'
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
        {notesToShow.map((note, i) => // highlight-line
          <Note key={i} note={note} />
        )}
      </ul>
      // ...
    </div>
  )
}
```

The definition of the <em>notesToShow</em> variable is rather compact:
Em notesToShow / em 变量的定义相当简洁:

```js
const notesToShow = showAll
  ? notes
  : notes.filter(note => note.important === true)
```

The definition uses the [conditional](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) operator also found in many other programming languages.
该定义使用了[条件]( https://developer.mozilla.org/en-us/docs/web/javascript/reference/operators/conditional_operator )运算符，这种运算符在许多其他编程语言中也存在。

The operator functions as follows. If we have:
操作符的功能如下:

```js
const result = condition ? val1 : val2
```

the <em>result</em> variable will be set to the value of <em>val1</em> if <em>condition</em> is true. If <em>condition</em> is false, the <em>result</em> variable will be set to the value of<em>val2</em>.
如果 em 条件 / em 为真，则 em result / em 变量将设置为 em val1 / em 值。 如果 em 条件 / em 为 false，则 em result / em 变量将设置为 em val2 / em 值。

If the value of <em>showAll</em> is false, the <em>notesToShow</em> variable will be assigned to a list that only contain notes that have the <em>important</em> property set to true. Filtering is done with the help of the array [filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) method:
如果 em showAll / em 的值为 false，那么将把 em notesToShow / em 变量分配给一个只包含 em important / em 属性设置为 true 的注释的列表。 过滤是通过数组[ filter ]( https://developer.mozilla.org/en-us/docs/web/javascript/reference/global_objects/array/filter )方法完成的:

```js
notes.filter(note => note.important === true)
```

The comparison operator is in fact redundant, since the value of <em>note.important</em> is either <i>true</i> or <i>false</i> which means that we can simply write:
比较运算符实际上是多余的，因为 em note.important / em 的值要么是 i true / i，要么是 i false / i，这意味着我们可以简单地写:

```js
notes.filter(note => note.important)
```

The reason we showed the comparison operator first was to emphasize an important detail: in JavaScript <em>val1 == val2</em> does not work as expected in all situations and it's safer to use <em>val1 === val2</em> exclusively in comparisons. You can read more about the topic [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness).
我们首先展示比较操作符的原因是为了强调一个重要的细节: 在 JavaScript 中，val1 val2 / em 并不能在所有情况下都像预期的那样工作，在比较中专门使用 em val1 val2 / em 更安全。 你可以在这里阅读更多关于这个主题的 https://developer.mozilla.org/en-us/docs/web/javascript/equality_comparisons_and_sameness。

You can test out the filtering functionality by changing the initial value of the <em>showAll</em> state.
您可以通过更改 em showAll / em 状态的初始值来测试过滤功能。

Next let's add functionality that enables users to toggle the <em>showAll</em> state of the application from the user interface.
接下来，让我们添加一些功能，使用户能够从用户界面切换应用程序的 em showAll / em 状态。

The relevant changes are shown below:
有关修订如下:

```js
import React, { useState } from 'react' 
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
        {rows()}
      </ul>
      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleNoteChange}
        />
        <button type="submit">save</button>
      </form>      
    </div>
  )
}
```


The displayed notes (all versus important) is controlled with a button. The event handler for the button is so simple that it has been defined directly in the attribute of the button element. The event handler switches the value of _showAll_ from true to false and vice versa:
显示的笔记(所有与重要)由一个按钮控制。 按钮的事件处理程序非常简单，已经在按钮元素的属性中直接定义了它。 事件处理程序将 showAll 的值从 true 转换为 false，反之亦然:

```js
() => setShowAll(!showAll)
```

The text of the button depends on the value of the <em>showAll</em> state:
按钮的文本取决于 em showAll / em 状态的值:

```js
show {showAll ? 'important' : 'all'}
```

You can find the code for our current application in its entirety in the <i>part2-3</i> branch of [this github repository](https://github.com/fullstack-hy2020/part2-notes/tree/part2-3).
您可以在[ this github repository ]的 i part2-3 / i 分支中找到我们当前应用程序的全部代码，该分支位于 https://github.com/fullstack-hy2020/part2-notes/tree/part2-3。
</div>
/ div

<div class="tasks">
Div 类”任务”

<h3>Exercises 2.6.-2.10.</h3>
练习2.6-2.10. / h3

In the first exercise, we will start working on an application that will be further developed in the later exercises. In related sets of exercises it is sufficient to return the final version of your application. You may also make a separate commit after you have finished each part of the exercise set, but doing so is not required.
在第一个练习中，我们将开始处理一个将在后面的练习中进一步开发的应用程序。 在相关的练习集中，返回应用程序的最终版本就足够了。 还可以在完成练习集的每个部分之后进行单独的提交，但不需要这样做。

**WARNING** create-react-app will automatically turn your project into a git-repository unless you create your application inside of an existing git repository. It's likely that you **do not want** your project to be a repository, so simply run the _rm -rf .git_ command at the root of your application.
* * 警告 * * create-react-app 将自动将您的项目转换为 git-repository，除非您在现有 git 存储库中创建应用程序。 很可能您不希望您的项目是一个存储库，因此只需运行 rm-rf 即可。 在应用程序的根目录下使用 git 命令。

<h4>2.6: The Phonebook Step1</h4>
H42.6: 电话簿步骤1 / h4

Let's create a simple phonebook. <i>**In this part we will only be adding names to the phonebook.**</i>
让我们创建一个简单的电话簿

Let us start with implementing the addition of a person to phonebook.
让我们从实现将一个人添加到电话簿开始。

You can use the code below as a starting point for the <i>App</i> component of your application:
您可以使用下面的代码作为应用程序的 i App / i 组件的起点:

```js
import React, { useState } from 'react'

const App = () => {
  const [ persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [ newName, setNewName ] = useState('')

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

The <em>newName</em> state is meant for controlling the form input element.
Em newName / em 状态用于控制表单输入元素。

Sometimes it can be useful to render state and other variables as text for debugging purposes. You can temporarily add the following element to the rendered component:
有时，为了调试目的，将状态和其他变量作为文本呈现会很有用。 您可以临时向呈现的组件添加以下元素:

```
<div>debug: {newName}</div>
```

It's also important to put what we learned in the [debugging React applications](/en/part1/a_more_complex_state_debugging_react_apps) chapter of part one into good use. The [React developer tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) extension especially, is incredibly useful for tracking changes that occur in the application's state.
把我们在第一部分[调试反应应用程序](/ en / part1 / 一个更复杂的状态调试反应应用程序)一章中学到的东西好好利用也很重要。 特别是[ React developer tools ]( https://chrome.google.com/webstore/detail/React-developer-tools/fmkadmapgofadopljbjfkapdkoienihi 开发工具)扩展，对于跟踪应用程序状态中发生的更改非常有用。

After finishing this exercise your application should look something like this:
在完成这个练习之后，你的应用程序应该是这样的:

![](../../images/2/10e.png)
! [](. . / . / images / 2 / 10e.png)

Note the use of the React developer tools extension in the picture above!
请注意上图中使用的 React developer 工具扩展！

**NB:**
注意:


- you can use the person's name as value of the <i>key</i> property
- 您可以使用该人的姓名作为 i key / i 属性的值
- remember to prevent the default action of submitting HTML forms!
- 切记防止提交 HTML 表单的默认操作！

<h4>2.7: The Phonebook Step2</h4>
H42.7: 电话簿步骤2 / h4

Prevent the user from being able to add names that already exist in the phonebook. JavaScript arrays have numerous suitable [methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) for accomplishing this task.
防止用户添加已经存在于电话簿中的名称。 Javascript 数组有许多合适的[ methods ]( https://developer.mozilla.org/en-us/docs/web/JavaScript/reference/global_objects/array )来完成这个任务。

Issue a warning with the [alert](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert) command when such an action is attempted:
尝试此类操作时，使用[ alert ]( https://developer.mozilla.org/en-us/docs/web/api/window/alert )命令发出警告:

![](../../images/2/11e.png)
! [](. . / . / images / 2 / 11e.png)

**Brief reminder from the previous part:** when you are forming strings that contain values from variables, it is recommended to use a [template string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals):
* * 上一部分的简短提示: * * 当您构建包含变量值的字符串时，建议使用[模板字符串]( https://developer.mozilla.org/en-us/docs/web/javascript/reference/template_literals ) :

```js
`${newName} is already added to phonebook`
```

If the <em>newName</em> variable holds the value <i>arto</i>, the template string expression returns the string
如果 em newName / em 变量包含值 i arto / i，则模板字符串表达式返回字符串

```js
`arto is already added to phonebook`
```

The same could be done in a more Java-like fashion by using the plus operator:
同样的事情也可以通过使用 plus 操作符以类似 java 的方式来完成:

```js
newName + ' is already added to phonebook'
```

Using template strings is the more idiomatic option and the sign of a true JavaScript professional.
使用模板字符串是更具惯用性的选择，也是真正的 JavaScript professional 的标志。

<h4>2.8: The Phonebook Step3</h4>
H42.8: 电话簿步骤3 / h4

Expand your application by allowing users to add phone numbers to the phone book. You will need to add a second <i>input</i> element to the form (along with its own event handler):
通过允许用户将电话号码添加到电话簿来扩展您的应用程序。 您需要在表单中添加第二个 i input / i 元素(以及它自己的事件处理程序) :

```js
<form>
  <div>name: <input /></div>
  <div>number: <input /></div>
  <div><button type="submit">add</button></div>
</form>
```


At this point the application could look something like this. The image also displays the application's state with the help of [React developer tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi):
此时，应用程序可以看起来像这样。 该图片还显示了应用程序的状态与帮助[ React developer tools ]( https://chrome.google.com/webstore/detail/React-developer-tools/fmkadmapgofadopljbjfkapdkoienihi 工具) :

![](../../images/2/12e.png)
! [](. . / . / images / 2 / 12e.png)

<h4>2.9*: The Phonebook Step4</h4>
42.9 * : 电话簿步骤4 / h 4

Implement a search field that can be used to filter the list of people by name:
实现一个搜索字段，该字段可用于按姓名筛选人员列表:

![](../../images/2/13e.png)
! [](. . / . / images / 2 / 13. png)

You can implement the search field as an <i>input</i> element that is placed outside the HTML form. The filtering logic shown in the image is <i>case insensitive</i>, meaning that the search term <i>arto</i> also returns results that contain Arto with an uppercase A.
您可以将搜索字段实现为置于 HTML 表单之外的 i input / i 元素。 图片中显示的过滤逻辑是 i 不区分大小写的 / i，这意味着搜索项 i Arto / i 也返回包含大写 a 的 Arto 的结果。


**NB:** When you are working on new functionality, it's often useful to "hardcode" some dummy data into your application, e.g.
注意: 在开发新功能时，在应用程序中“硬编码”一些虚拟数据通常很有用，例如:。

```js
const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])

  // ...
}
```

This saves you from having to manually input data into your application for testing out your new functionality.
这样您就不必手动将数据输入应用程序以测试新功能了。

<h4>2.10: The Phonebook Step5</h4>
H42.10: 电话簿步骤5 / h4

If you have implemented your application in a single component, refactor it by extracting suitable parts into new components. Maintain the application's state and all event handlers in the <i>App</i> root component.
如果您已经在单个组件中实现了应用程序，那么可以通过将合适的部分提取到新组件中来重构它。 在 i App / i 根组件中维护应用程序的状态和所有事件处理程序。

It is sufficient to extract <i>**three**</i> components from the application. Good candidates for separate components are, for example, the search filter, the form for adding new people into the phonebook, a component that renders all people from the phonebook, and a component that renders a single person's details.
从应用程序中提取 i * * * / i 组件就足够了。 比如，搜索过滤器，在电话簿中添加新人的表单，电话簿中显示所有人的组件，以及显示单个人详细信息的组件。

The application's root component could look similar to this after the refactoring. The refactored root component below only renders titles and lets the extracted components take care of the rest.
在重构之后，应用程序的根组件可能与此类似。 下面重构的根组件只呈现标题，并让提取的组件处理其余部分。

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

<!-- **HUOM**: saatat törmätä ongelmiin tässä tehtävässä, jos määrittelet komponentteja "väärässä paikassa", nyt kannattaakin ehdottomasti kerrata edellisen osan luku [älä määrittele komponenttia komponentin sisällä](/osa1/monimutkaisempi_tila_reactin_debuggaus#ala-maarittele-komponenttia-komponentin-sisalla). -->
**NB**: You might run into problems in this exercise if you define your components "in the wrong place". Now would be a good time to rehearse 
* * 注意 * * : 如果将组件定义在“错误的位置” ，则可能在本练习中遇到问题。 现在是排练的好时机
the chapter [do not define a component in another component](/osa1/monimutkaisempi_tila_reactin_debuggaus#ala-maarittele-komponenttia-komponentin-sisalla)
本章[不要在其他组件中定义组件](/ osa1 / monimutkaisempi tila reactin debuggaus # ala-maarittele-komponenttia-komponentin-sisalla)
from last part.
从最后一段开始。

</div>

