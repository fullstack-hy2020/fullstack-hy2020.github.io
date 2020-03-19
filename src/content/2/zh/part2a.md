---
mainImage: ../../../images/part-2.svg
part: 2
letter: a
lang: zh
---

<div class="content">


Before starting a new topic, let's recap some of the topics that proved difficult last year.
在开始一个新的话题之前，让我们回顾一下去年被证明是困难的一些话题。

### console.log
圆木，圆木

***What's the difference between an experienced JavaScript programmer and a rookie? The experienced one uses console.log 10-100 times more.***
一个有经验的 JavaScript 程序员和一个菜鸟有什么区别? 有经验的人使用 console.log 10-100次以上

Paradoxically, this seems to be true even though a rookie programmer would need console.log (or any debugging method) more than an experienced one.
矛盾的是，这似乎是正确的，即使一个新手程序员比一个有经验的程序员更需要 console.log (或任何调试方法)。

When something does not work, don't just guess what's wrong. Instead, log or use some other way of debugging. 
当某些事情不能正常工作时，不要只是猜测错误，而是记录或使用其他调试方法。

**NB** when you use the command _console.log_ for debugging, don't concatenate things 'the Java way' with a plus. Instead of writing:
当你使用 console.log 命令进行调试时，不要把‘ the Java way’和‘ plus’连在一起。 而不是写:
```js
console.log('props value is' + props)
```

separate the things to be printed with a comma:
用逗号把要打印的东西分开:

```js
console.log('props value is', props)
```


If you concatenate an object with a string and log it to the console (like in our first example), the result will be pretty useless: 
如果你把一个对象和一个字符串连接起来，然后把它记录到控制台上(就像我们的第一个例子一样) ，结果将是相当无用的:

```js
props value is [Object object]
```

On the contrary, when you pass objects as distinct arguments separated by commas to _console.log_, like in our second example above, the content of the object is printed to the developer console as strings that are insightful.
相反，当您将对象作为由逗号分隔的不同参数传递给 console.log 时，就像在上面的第二个例子中一样，对象的内容作为有深刻见解的字符串打印到开发控制台。
If necessary, read more about debugging React-applications [here](/en/part1/a_more_complex_state_debugging_react_apps#debugging-react-applications).
如果有必要，请阅读更多关于调试 React-applications [ here ](/ en / part1 / a more complex state debugging react apps # debugging-React-applications)的内容。

### Protip: Visual Studio Code snippets
# # Protip: Visual Studio Code snippets

With Visual studio code it's easy to create 'snippets', i.e. shortcuts for quickly generating commonly re-used portions of code, much like how 'sout' works in Netbeans. 
使用 Visual studio 代码很容易创建“片段” ，即快速生成常用重用代码部分的快捷方式，很像 Netbeans 中的“ sout”工作方式。
Instructions for creating snippets can be found [here](https://code.visualstudio.com/docs/editor/userdefinedsnippets#_creating-your-own-snippets).
创建代码片段的说明可以在这里找到( https://code.visualstudio.com/docs/editor/userdefinedsnippets#_creating-your-own-snippets )。

Useful, ready-made snippets can also be found as VS Code plugins, for example [here](https://marketplace.visualstudio.com/items?itemName=xabikos.ReactSnippets).
有用的、现成的代码片段也可以作为 VS 代码插件找到，例如[ here ]( https://marketplace.visualstudio.com/items?itemname=xabikos  . ReactSnippets)。

The most important snippet is the one for the <em>console.log()</em> command, for example <em>clog</em>. This can be created like so: 
最重要的片段是用于 em console.log () / em 命令的片段，例如 em clog / em:
```js
{
  "console.log": {
    "prefix": "clog",
    "body": [
      "console.log('$1')",
    ],
    "description": "Log output to console"
  }
}
```

### JavaScript Arrays
# # # JavaScript 数组

From here on out, we will be using the functional programming methods of the JavaScript [array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array), such as  _find_, _filter_, and _map_ - all of the time. They operate on the same general principles as streams do in Java 8, which have been used during the last few years in both the 'Ohjelmoinnin perusteet' and 'Ohjelmoinnin jatkokurssi' courses at the university's department of Computer Science, and also in the programming MOOC. 
从现在开始，我们将一直使用 JavaScript 的函数式编程方法，比如查找、过滤和映射 https://developer.mozilla.org/en-us/docs/web/JavaScript/reference/global_objects/array。 它们和 Java 8中的数据流一样遵循一般原则，这些原则在过去几年里被用于该大学计算机科学系的 Ohjelmoinnin perusteet 和 Ohjelmoinnin jatkokurssi 课程，以及 MOOC 编程中。

If functional programming with arrays feels foreign to you, it is worth watching at least the first three parts of the YouTube video series [Functional Programming in JavaScript](https://www.youtube.com/playlist?list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84):
如果使用数组的函数式编程对你来说感觉很陌生，那么至少可以看看 YouTube 视频系列的前三部分[ JavaScript 函数式编程]( https://www.YouTube.com/playlist?list=pl0zvegevsaeed9hlmcxrk5yuyquag-n84:

- [Higher-order functions](https://www.youtube.com/watch?v=BMUiFMZr7vk&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84)
- [高阶函数]( https://www.youtube.com/watch?v=bmuifmzr7vk&list=pl0zvegevsaeed9hlmcxrk5yuyquag-n84)
- [Map](https://www.youtube.com/watch?v=bCqtb-Z5YGQ&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84&index=2)
- [地图]( https://www.youtube.com/watch?v=bcqtb-z5ygq&list=pl0zvegevsaeed9hlmcxrk5yuyquag-n84&index=2)
- [Reduce basics](https://www.youtube.com/watch?v=Wl98eZpkp-c&t=31s)
- [减少基础]( https://www.youtube.com/watch?v=wl98ezpkp-c&t=31s )

### Event handlers revisited
# # # 事件处理程序再访

Based on last year's course, event handling has proven to be difficult. 
基于去年的课程，事件处理已被证明是困难的。
It's worth reading the revision chapter at the end of the previous part [event handlers revisited](/en/part1/a_more_complex_state_debugging_react_apps#event-handling-revisited), if it feels like your own knowledge on the topic needs some brushing up. 
如果你觉得自己关于这个主题的知识需要复习一下，那么阅读上一部分结尾的修订章节[事件处理程序再现](/ en / part1 / a more complex state debugging react apps # event-handling-revisited)是值得的。

Passing event handlers to the child components of the <i>App</i> component has raised some questions. A small revision on the topic can be found [here](/en/part1/a_more_complex_state_debugging_react_apps#passing-event-handlers-to-child-components).
将事件处理程序传递给 i App / i 组件的子组件引发了一些问题。 关于这个主题的一个小修订可以在这里找到(/ en / part1 / a 更复杂的状态调试反应应用 # passing-event-handlers-to-child-components)。

### Rendering collections
# # 渲染收藏

We will now do the 'frontend', or the browser-side application logic, in React for an application that's similar to the example application from [part 0](/en/part0)
现在，我们将在 React 中为类似于[ part 0](/ en / part0)中的示例应用程序执行“前端”或浏览器端应用程序逻辑

Let's start with the following:
让我们从以下几点开始:

```js
import React from 'react'
import ReactDOM from 'react-dom'

const notes = [
  {
    id: 1,
    content: 'HTML is easy',
    date: '2019-05-30T17:30:31.098Z',
    important: true
  },
  {
    id: 2,
    content: 'Browser can execute only Javascript',
    date: '2019-05-30T18:39:34.091Z',
    important: false
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    date: '2019-05-30T19:20:14.298Z',
    important: true
  }
]

const App = (props) => {
  const { notes } = props

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        <li>{notes[0].content}</li>
        <li>{notes[1].content}</li>
        <li>{notes[2].content}</li>
      </ul>
    </div>
  )
}

ReactDOM.render(
  <App notes={notes} />,
  document.getElementById('root')
)
```

Every note contains its textual content and a timestamp as well as a _boolean_ value for marking whether the note has been categorized as important or not, and also a unique <i>id</i>.
每个便笺包含其文本内容、时间戳以及一个布尔值，用于标记该便笺是否被归类为重要类别，还包含一个惟一的 i id / i。


The code functions due to the fact that there are exactly three notes in the array. 
由于数组中正好有三个注释，因此代码可以运行。
A single note is rendered by accessing the objects in the array by referring to a hard-coded index number:
通过引用一个硬编码的索引号访问数组中的对象来呈现单个音符:

```js
<li>{note[1].content}</li>
```

This is, of course, not practical. The solution can be made general by generating React-elements from the array objects using the [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) function.
这当然是不现实的。 通过使用[ map ]( https://developer.mozilla.org/en-us/docs/web/javascript/reference/global_objects/array/map )函数从数组对象生成 React-elements，可以使解决方案变得通用。

```js
notes.map(note => <li>{note.content}</li>)
```

The result is an array of <i>li</i> elements.
结果是一个 i li / i 元素数组。

```js
[
  '<li>HTML is easy</li>',
  '<li>Browser can execute only Javascript</li>',
  '<li>GET and POST are the most important methods of HTTP protocol</li>',
]
```


Which can then be put inside <i>ul</i> tags:
然后可以把它放在 i ul / i 标签中:

```js
const App = (props) => {
  const { notes } = props

  return (
    <div>
      <h1>Notes</h1>
// highlight-start
      <ul>
        {notes.map(note => <li>{note.content}</li>)}
      </ul>
// highlight-end      
    </div>
  )
}
```

Because the code generating the <i>li</i> tags is JavaScript, it must be wrapped in curly braces in a JSX template just like all other JavaScript code. 
因为生成 i li / i 标记的代码是 JavaScript，所以必须像所有其他 JavaScript 代码一样，在 JSX 模板中使用花括号包装它。

<!-- Parannetaan koodin luetteloa vielä jakamalla nuolifunktion määrittely useammalle riville: -->
We will also make the code more readable by separating the arrow function's declaration across multiple lines:
我们还将通过在多行中分隔箭头函数的声明来提高代码的可读性:

```js
const App = (props) => {
  const { notes } = props

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
        // highlight-start
          <li>
            {note.content}
          </li>
        // highlight-end   
        )}
      </ul>
    </div>
  )
}
```

### Key-attribute
# # # Key-attribute

Even though the application seems to be working, there is a nasty warning on the console: 
尽管该应用程序似乎运行良好，但在控制台上有一个令人不快的警告:

![](../../images/2/1a.png)


As the linked [page](https://reactjs.org/docs/lists-and-keys.html#keys) in the error message instructs, the list items, i.e. the elements generated by the _map_ method, must each have a unique key value:  an attribute called <i>key</i>.
正如错误消息中的链接[ page ]( https://reactjs.org/docs/lists-and-keys.html#keys )所指示的，列表项，即 map 方法生成的元素，必须每个都有一个唯一的键值: 一个名为 i key / i 的属性。

Let's add the keys:
让我们添加一些关键字:

```js
const App = (props) => {
  const { notes } = props

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
        // highlight-start
          <li key={note.id}>
            {note.content}
          </li>
          // highlight-end
        )}
      </ul>
    </div>
  )
}
```

And the error message disappears. 
并且错误消息消失。

React uses the key attributes of objects in an array to determine how to update the view generated by a component when the component is re-rendered. More about this [here](https://reactjs.org/docs/reconciliation.html#recursing-on-children).
React 使用数组中对象的键属性来确定在重新呈现组件时如何更新组件生成的视图。 更多关于这个[这里]( https://reactjs.org/docs/reconciliation.html#recursing-on-children )。

### Map
# # 地图

Understanding how the array method [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) works is crucial for the rest of the course. 
理解数组方法[映射]( https://developer.mozilla.org/en-us/docs/web/javascript/reference/global_objects/array/map )的工作原理对于本课程的其余部分是至关重要的。

The application contains an array called _notes_
应用程序包含一个称为 notes 的数组

```js
const notes = [
  {
    id: 1,
    content: 'HTML is easy',
    date: '2019-05-30T17:30:31.098Z',
    important: true
  },
  {
    id: 2,
    content: 'Browser can execute only Javascript',
    date: '2019-05-30T18:39:34.091Z',
    important: false
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    date: '2019-05-30T19:20:14.298Z',
    important: true
  }
]
```

Let's pause for a moment and examine how _map_ works.
让我们暂停一下，看看 map 是如何工作的。


If the following code is added to, let's say, the end of the file:
如果下面的代码被添加到，比如说，文件的结尾:

```js
const result = notes.map(note => note.id)
console.log(result)
```

<i>[1, 2, 3]</i>  will be printed to the console.
I [1,2,3] i will be printed to the console.
 _Map_ always creates a new array, the elements of which have been created from the elements of the original array by <i>mapping</i>, using the function given as a parameter to the map method. 
Map 总是创建一个新数组，其元素是通过 i mapping / i 从原始数组的元素中创建的，使用给定的函数作为 Map 方法的参数。


The function is
功能是

```js
note => note.id
```

Which is an arrow function written in compact form. The full form would be: 
这是一个以紧凑形式编写的箭头函数。完整形式如下:

```js
(note) => {
  return note.id
}
```

The function gets a note object as a parameter, and <i>returns</i> the value of its  <i>id</i> field.
该函数获取一个 note 对象作为参数，然后 i 返回 / i 其 i id / i 字段的值。

Changing the command to:
将命令更改为:

```js
const result = notes.map(note => note.content)
```

results in an array containing the contents of the notes.
结果是一个包含注释内容的数组。

This is already pretty close to the React code we used:
这已经非常接近我们使用的反应代码:

```js
notes.map(note =>
  <li key={note.id}>{note.content}</li>
)
```

which generates a <i>li</i> tag containing the contents of the note from each note object. 
它生成一个 i li / i 标记，其中包含每个音符对象的音符内容。

Because the function parameter of the _map_ method
因为函数参数的映射方法

```js
note => <li key={note.id}>{note.content}</li>
```
is used to create view elements, the value of the variable must be rendered inside of curly braces. Try to see what happens if the braces are removed. 
用于创建视图元素，则变量的值必须在花括号内呈现。 尝试看看如果去掉括号会发生什么。

The use of curly braces will cause some headache in the beginning, but you will get used to them soon enough. The visual feedback from React is immediate.
一开始使用花括号会让你头疼，但是你很快就会习惯的。 来自 React 的视觉反馈是即时的。

### Anti-pattern: array indexes as keys
# # 反模式: 数组索引作为键

We could have made the error message on our console disappear by using the array indexes as keys. The indexes can be retrieved by passing a second parameter to the callback function of the map-method: 
通过使用数组索引作为键，我们可以使控制台上的错误消息消失。 可以通过向 map-method 的回调函数传递第二个参数来检索索引:

```js
notes.map((note, i) => ...)
```

When called like this, _i_ is assigned the value of the index of the position in the array where the <i>Note</i> resides.
当这样调用时，将为 i Note / i 所在的数组中的位置分配索引值。

As such, one way to define the row generation without getting errors is:
因此，定义行生成而不产生错误的一种方法是:

```js
<ul>
  {notes.map((note, i) => 
    <li key={i}>
      {note.content}
    </li>
  )}
</ul>
```

This is, however, **not recommended** and can cause undesired problems even if it seems to be working just fine. 
然而，这是 * * * 不推荐 * * ，并可能导致不希望的问题，即使它似乎工作得很好。
Read more [from here](https://medium.com/@robinpokorny/index-as-a-key-is-an-anti-pattern-e0349aece318).
更多内容请点击这里阅读 https://medium.com/@robinpokorny/index-as-a-key-is-an-anti-pattern-e0349aece318。

### Refactoring modules
# # # 重构模块

Let's tidy the code up a bit. We are only interested in the field _notes_ of the props, so let's retrieve that directly using [destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment): 
让我们把代码整理一下。 我们只对道具的字段注释感兴趣，所以让我们直接使用[ destructuring ](destructuring  https://developer.mozilla.org/en-us/docs/web/javascript/reference/operators/destructuring_assignment  :

```js
const App = ({ notes }) => { //highlight-line
  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map((note, i) => 
          <li key={i}>
            {note.content}
          </li>
        )}
      </ul>
    </div>
  )
}
```

If you have forgotten what destructuring means and how it works, review [this](/en/part1/component_state_event_handlers#destructuring).
如果您忘记了析构化的含义以及它是如何工作的，请查看[ this ](/ en / part1 / component state 事件处理程序 # destructuring)。


We'll separate displaying a single note into its own component <i>Note</i>: 
我们将单独显示一个音符到它自己的组件 i Note / i:

```js
// highlight-start
const Note = ({ note }) => {
  return (
    <li>{note.content}</li>
  )
}
// highlight-end

const App = ({ notes }) => 
  return (
    <div>
      <h1>Notes</h1>
      <ul>
        // highlight-start
        {notes.map((note, i) => 
          <Note key={i} note={note} />
        )}
         // highlight-end
      </ul>
    </div>
  )
}
```

Note, that the <i>key</i> attribute must now be defined for the <i>Note</i> components, and not for the <i>li</i> tags like before. 
注意，现在必须为 i Note / i 组件定义 i key / i 属性，而不是像前面那样为 i li / i 标记定义 i key / i 属性。

A whole React application can be written in a single file. Although that is, of course, not very practical. Common practice is to declare each component in their own file as an <i>ES6-module</i>.
可以在单个文件中编写整个 React 应用程序。 虽然这当然不是很实际。 通常的做法是将每个组件在其自己的文件中声明为 i ES6-module / i。

We have been using modules the whole time. The first few lines of the file:
我们一直在使用模块。文件的前几行:

```js
import React from 'react'
import ReactDOM from 'react-dom'
```

[imports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) two modules, enabling them to be used in the code. The <i>react</i> module is placed into a variable called _React_ and <i>react-dom</i> to variable _ReactDOM_.
[导入]( https://developer.mozilla.org/en-us/docs/web/javascript/reference/statements/import )两个模块，使它们能够在代码中使用。 I React / i 模块被放入一个名为 React 的变量中，i React-dom / i 对变量 ReactDOM 进行响应。


Let's move our <i>Note</i> component into its own module. 
让我们将我们的 i Note / i 组件移动到它自己的模块中。

In smaller applications, components are usually placed in a directory called <i>components</i> , which is in turn placed within the <i>src</i> directory. The convention is to name the file after the component. 
在较小的应用程序中，组件通常放在一个名为 i components / i 的目录中，而这个目录又放在 i src / i 目录中。 约定是按照组件的名称来命名文件。

Now we'll create a directory called <i>components</i> for our application and place a file named <i>Note.js</i> inside. 
现在，我们将为应用程序创建一个名为 i components / i 的目录，并在其中放置一个名为 i Note.js / i 的文件。
The contents of the Note.js file are as follows: 
Js 文件的内容如下:

```js
import React from 'react'

const Note = ({ note }) => {
  return (
    <li>{note.content}</li>
  )
}

export default Note
```

Because this is a React-component, we must import React. 
因为这是一个 React-component，我们必须导入 React。

The last line of the module [exports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) the declared module, the variable <i>Note</i>.
模块[导出]的最后一行 https://developer.mozilla.org/en-us/docs/web/javascript/reference/statements/export 是声明的模块，变量 i Note / i。

Now the file using the component, <i>index.js</i>, can [import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) the module: 
现在使用这个组件的文件，i index.js / i，可以[导入]( https://developer.mozilla.org/en-us/docs/web/javascript/reference/statements/import )这个模块:

```js
import React from 'react'
import ReactDOM from 'react-dom'
import Note from './components/Note' // highlight-line

const App = ({ notes }) => {
  // ...
}
```

The component exported by the module is now available for use in the variable <i>Note</i>, just as it was earlier. 
模块导出的组件现在可以在变量 i Note / i 中使用，就像之前一样。

Note, that when importing our own components their location must be given <i>in relation to the importing file</i>:
注意，当导入我们自己的组件时，它们的位置必须给出与导入文件 / i 相关的 i:

```js
'./components/Note'
```

The period in the beginning refers to the current directory, so the module's location is a file called <i>Note.js</i> in a sub-directory of the current <i>components</i>. directory. The filename extension can be omitted.
开头的句点指的是工作目录，因此模块的位置是当前 i components / i 的子目录中的一个名为 i Note.js / i 的文件。 目录。 文件扩展名可以省略。

<i>App</i> is a component as well, so let's declare it in its own module as well. Since it is the root component of the application, we'll place it in the <i>src</i> directory. The contents of the file are as follows: 
I App / i 也是一个组件，所以让我们在它自己的模块中声明它。 因为它是应用程序的根组件，所以我们将它放在 i src / i 目录中。 档案内容如下:

```js
import React from 'react'
import Note from './components/Note'

const App = ({ notes }) => {
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

ReactDOM.render(
  <App notes={notes} />,
  document.getElementById('root')
)

export default App // highlight-line
```

What's left in the <i>index.js</i> file is: 
在 i index.js / i 文件中剩下的是:

```js
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'  // highlight-line

const notes = [
  // ...
]

ReactDOM.render(
  <App notes={notes} />,
  document.getElementById('root')
)
```

Modules have plenty of other uses other than enabling component declarations to be separated into their own files. We will get back into them later in this course. 
除了使组件声明能够分离到它们自己的文件中之外，模块还有许多其他用途。 我们将在本课程稍后讨论这些问题。


The current code of the application can be found on [GitHub](https://github.com/fullstack-hy2020/part2-notes/tree/part2-1).
应用程序的当前代码可以在[ GitHub ]( https://GitHub.com/fullstack-hy2020/part2-notes/tree/part2-1文件夹)上找到。


Note that the master branch of the repository contains the code for a later version of the application. The current code is in the branch [part2-1](https://github.com/fullstack-hy2020/part2-notes/tree/part2-1):
注意，存储库的主分支包含应用程序的后续版本的代码。 当前的代码在分支[ part2-1]( https://github.com/fullstack-hy2020/part2-notes/tree/part2-1)中:

![](../../images/2/2e.png)


If you clone the project, run the command _npm install_ before starting the application with _npm start_.
如果您克隆了项目，请在启动应用程序之前运行命令 npm install。

### When the application breaks
# # # 当应用程序中断时

Early in your programming career (and even after 30 years of coding like yours truly), what often happens is that the application just completely breaks down. This is even more the case with dynamically typed languages, such as JavaScript, where the compiler does not check the data type of, for instance, function variables or return values. 
在您的编程生涯早期(甚至在像您这样编写了30年代码之后) ，经常发生的情况是应用程序完全崩溃。 动态类型语言的情况更是如此，例如 JavaScript，其中编译器不检查数据类型，例如函数变量或返回值。


A "React explosion" can for example look like this:
例如，“反应爆炸”可以是这样的:

![](../../images/2/3b.png)



In these situations your best way out is the <em>console.log</em>.
在这些情况下，你最好的出路是 em console.log / em。
The piece of code causing the explosion is this: 
引起爆炸的代码是这样的:

```js
const Course = ({ course }) => (
  <div>
   <Header course={course} />
  </div>
)

const App = () => {
  const course = {
    // ...
  }

  return (
    <div>
      <Course course={course} />
    </div>
  )
}
```


We'll hone in on the reason for the breakdown by adding <em>console.log</em> commands to the code. Because the first thing to be rendered is the <i>App</i> component, it's worth putting the first console.log there: 
通过在代码中添加 em console.log / em 命令，我们将深入研究出现故障的原因。 因为要渲染的第一个东西是 i App / i 组件，所以值得将第一个 console.log 放在那里:

```js
const App = () => {
  const course = {
    // ...
  }

  console.log('App toimii...') // highlight-line

  return (
    // ..
  )
}
```

To see the printing on the console, we must scroll up over the long red wall of errors.
要在控制台上看到打印结果，我们必须翻过长长的红色错误墙。

![](../../images/2/4b.png)


When one thing is found to be working, it's time to log deeper. If the component has been declared as a single statement, or a function without a return, it makes printing to the console harder. 
当一件事情被发现有效时，就是时候更深入地记录了。 如果组件声明为单个语句，或者声明为函数而不返回，则会增加打印到控制台的难度。

```js
const Course = ({ course }) => (
  <div>
   <Header course={course} />
  </div>
)
```

The component should be changed to its longer form, in order for us to add the printing: 
这个组件应该更改为更长的形式，以便我们添加打印:

```js
const Course = ({ course }) => { 
  console.log(course) // highlight-line
  return (
    <div>
    <Header course={course} />
    </div>
  )
}
```

Quite often the root of the problem is that the props are expected to be of a different type, or called with a different name than they actually are, and destructuring fails as a result. The problem often begins to solve itself when destructuring is removed and we see what the <em>props</em> actually contains. 
通常，问题的根源在于，道具应该是不同的类型，或者使用与实际名称不同的名称调用，结果析构失败。 问题通常开始解决自己时，销毁被删除，我们看到的 em 道具 / em 实际上包含什么。

```js
const Course = (props) => { // highlight-line
  console.log(props)  // highlight-line
  const { course } = props
  return (
    <div>
    <Header course={course} />
    </div>
  )
}
```

If the problem has still not been resolved, there really isn't much to do apart from continuing to bug-hunt by sprinkling more _console.log_ statements around your code. 
如果问题仍然没有得到解决，那么除了继续通过在代码周围添加更多 console.log 语句来寻找 bug 之外，真的没有什么可做的了。

I added this chapter to the material after the model answer for the next question exploded completely (due to props being of the wrong type), and I had to debug it using console.log.
在下一个问题的模型答案完全爆炸(由于道具类型错误)之后，我将这一章添加到材料中，并且我必须使用 console.log 对其进行调试。


</div>
/ div

<div class="tasks">
Div 类”任务”

<h3>Exercises 2.1.-2.5.</h3>
练习2.1- 2.5. / h3

The exercises are submitted via GitHub, and by marking the exercises as done in the [submission system](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).
这些练习是通过 GitHub 提交的，并按照[提交系统]中的方式标记练习 https://studies.cs.helsinki.fi/stats/courses/fullstackopen。

You can submit all of the exercises into the same repository, or use multiple different repositories. If you submit exercises from different parts into the same repository, name your directories well.
您可以将所有练习提交到同一个存储库中，或者使用多个不同的存储库。 如果您将来自不同部分的练习提交到同一个存储库中，请为您的目录命名。

The exercises are submitted **One part at a time**. When you have submitted the exercises for a part, you can no longer submit any missed exercises for that part.
练习提交 * * 一次一部分 * * 。 当你已经提交了一个部分的练习，你不能再提交任何错过的部分练习。

Note that this part has more exercises than the ones before, so <i>do not submit</i> before you have done all exercises from this part you want to submit. 
请注意，这一部分有更多的练习比以前的，所以我不提交 / i 之前，你已经做了所有的练习，从这一部分你想提交。

**WARNING** create-react-app makes the project automatically into a git-repository, if the project is not created inside of an already existing repository. You probably **do not** want the project to become a repository, so run the command  _rm -rf .git_ from its root. 
* * WARNING * * create-react-app 使项目自动转换为 git-repository，如果项目没有在已有的存储库中创建的话。 您可能不希望项目成为存储库，因此运行命令 rm-rf。 从它的根。

<h4>2.1: course contents step6</h4>
H42.1: 课程内容，第六步 / h4


Let's finish the code for rendering course contents from exercises 1.1 - 1.5. You can start with the code from the model answers. 
让我们完成练习1.1-1.5中的课程内容渲染代码。 您可以从模型答案中的代码开始。


**Note that if you copy a project from one place to another, you might have to destroy the <i>node\_modules</i> directory and install the dependencies again with the command _npm install_ before you can start the application.**
* * 请注意，如果您将一个项目从一个地方复制到另一个地方，在启动应用程序之前，可能必须销毁 i 节点 modules / i 目录，并使用 npm install 命令重新安装依赖项。 **
It might not be good to copy a project or to put the  <i>node\_modules</i> directory into the version control per se. 
将项目复制或将 i 节点 modules / i 目录放入版本控制本身可能并不好。


Let's change the <i>App</i> component like so: 
让我们像这样修改 i App / i 组件:

```js
const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ]
  }

  return (
    <div>
      <Course course={course} />
    </div>
  )
}
```

Define a component responsible for formatting a single course called <i>Course</i>. 
定义一个组件，负责格式化单门课程 i Course / i。

The component structure of the application can be, for example, the following: 
例如，应用程序的组件结构可以是:

<pre>
预
App
应用程序
  Course
当然
    Header
页眉
    Content
内容
      Part
第部分
      Part
第部分
      ...
...
</pre>
预备

Hence, the <i>Course</i> component contains the components defined in the previous part, which are responsible for rendering the course name and its parts. 
因此，i Course / i 组件包含前面部分中定义的组件，它们负责呈现课程名称及其部分。

The rendered page can, for example, look as follows: 
例如，呈现的页面可以如下所示:

![](../../images/teht/8e.png)


You don't need the sum of the exercises yet. 
你还不需要做这些练习的总和。

The application must work <i>regardless of the number of parts a course has</i>, so make sure the application works if you add or remove parts of a course. 
无论课程有多少部分 / i，应用程序都必须工作，因此，如果您添加或删除课程的部分，请确保应用程序工作正常。

Ensure that the console shows no errors!
确保控制台没有显示任何错误！

<h4>2.2: Course contents step7</h4>
H42.2: 课程内容 step 7 / h4


Show also the sum of the exercises of the course. 
同时显示课程练习的总和。

![](../../images/teht/9e.png)


<h4>2.3*: Course contents step8</h4>
H42.3 * : 课程内容 step 8 / h4

If you haven't done so already, calculate the sum of exercises with the array method [reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce).
如果你还没有这样做，用数组方法[ reduce ]( https://developer.mozilla.org/en-us/docs/web/javascript/reference/global_objects/array/reduce )计算练习的总和。

**Pro tip:** when your code looks as follows:
* * 专业提示: * * 当你的代码看起来如下:

```js
const total = 
  parts.reduce( (s, p) => someMagicHere )
```

and does not work, it's worth to use console.log, which requires the arrow function to be written in its longer form:
不起作用时，使用 console.log 是值得的，它要求箭头函数以更长的形式写入:

```js
const total = parts.reduce( (s, p) => {
  console.log('what is happening', s, p)
  return someMagicHere 
})
```

**Pro tip2:** There is a [plugin for VS code](https://marketplace.visualstudio.com/items?itemName=cmstead.jsrefactor) that automatically changes short form arrow functions into their longer form, and vice versa. 
* * Pro tip2: * * 有一个[ VS 代码插件]( https://marketplace.visualstudio.com/items?itemname=cmstead.jsrefactor )可以自动将短格式的箭头函数更改为长格式，反之亦然。

![](../../images/2/5b.png)


<h4>2.4: Course contents step9</h4>
H42.4: 课程内容 step 9 / h4


Let's extend our application to allow for an <i>arbitrary number</i> of courses:
让我们扩展我们的应用程序，允许任意数量 / i 的课程:

```js
const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return (
    <div>
      // ...
    </div>
  )
}
```

The application can, for example, look like this: 
例如，应用程序可以是这样的:

![](../../images/teht/10e.png)


<h4>2.5: separate module</h4>
H42.5: 独立模块 / h4

Declare the <i>Course</i> component as a separate module, which is imported by the <i>App</i> component. You can include all subcomponents of the course into the same module. 
将 i Course / i 组件声明为单独的模块，由 i App / i 组件导入。 您可以将课程的所有子组件包含到同一个模块中。

</div>

