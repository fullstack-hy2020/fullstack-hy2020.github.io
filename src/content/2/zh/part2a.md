---
mainImage: ../../../images/part-2.svg
part: 2
letter: a
lang: zh
---

<div class="content">
<!-- Before starting a new part, let's recap some of the topics that proved difficult last year.-->
在开始新的章节之前，让我们回顾一下根据去年经验比较困难的一些主题。

### console.log

<!-- ***What's the difference between an experienced JavaScript programmer and a rookie? The experienced one uses console.log 10-100 times more.***-->
经验丰富的JavaScript程序员和新手之间的区别是什么？经验丰富的人使用`console.log`次数要多10-100倍。

<!-- Paradoxically, this seems to be true even though a rookie programmer would need <i>console.log</i> (or any debugging method) more than an experienced one.-->
<i>矛盾的是，一个新手程序员比一个经验丰富的程序员更需要<i>console.log</i>（或任何调试方法）。</i>

<!-- When something does not work, don't just guess what's wrong. Instead, log or use some other way of debugging.-->
当某事不起作用时，不要猜测哪里出了问题。相反，采用日志或者使用其他调试方式。

<!-- **NB** As explained in part 1, when you use the command _console.log_ for debugging, don't concatenate things 'the Java way'' with a plus. Instead of writing:-->
**注意：** 如第一章节所解释的那样，当你使用命令 _console.log_ 进行调试时，不要用加号以“Java方式”连接东西。即不是写：

```js
console.log('props value is ' + props)
```

<!-- separate the things to be printed with a comma:-->
用逗号将需要打印的内容分隔开

```js
console.log('props value is', props)
```

<!-- If you concatenate an object with a string and log it to the console (like in our first example), the result will be pretty useless:-->
如果你把一个对象和一个字符串连接起来，并且把它记录到控制台（就像我们的第一个例子），那么结果将是毫无用处的：

```js
props value is [object Object]
```

<!-- On the contrary, when you pass objects as distinct arguments separated by commas to _console.log_, like in our second example above, the content of the object is printed to the developer console as strings that are insightful.-->
反之，当您以逗号分隔的单独参数将对象传递给_console.log_，就像我们上面的第二个例子一样，对象的内容将作为有价值的字符串打印到开发者控制台。
<!-- If necessary, read more about [debugging React applications](/en/part1/a_more_complex_state_debugging_react_apps#debugging-react-applications).-->
如果有必要，可以阅读更多有关[调试React应用程序](/en/part1/a_more_complex_state_debugging_react_apps#debugging-react-applications)的信息。

### Protip: Visual Studio Code snippets

<!-- With Visual Studio Code it's easy to create 'snippets', i.e., shortcuts for quickly generating commonly re-used portions of code, much like how 'sout'' works in Netbeans.-->
使用Visual Studio Code，很容易创建「代码片段」，即用于快速生成常用代码段的快捷方式，就像Netbeans中的「sout」一样。

<!-- Instructions for creating snippets can be found [here](https://code.visualstudio.com/docs/editor/userdefinedsnippets#_creating-your-own-snippets).-->
查看如何创建片段的说明可以[在此](https://code.visualstudio.com/docs/editor/userdefinedsnippets#_creating-your-own-snippets)处找到。

<!-- Useful, ready-made snippets can also be found as VS Code plugins, in the [marketplace](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets).-->
可以在[应用市场](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets)中找到有用的现成的片段也可以作为VS Code插件。

<!-- The most important snippet is the one for the <em>console.log()</em> command, for example, <em>clog</em>. This can be created like so:-->
最重要的片段是<em>console.log()</em> 命令，例如<em>clog</em>。可以这样创建：

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

<!-- Debugging your code using _console.log()_ is so common that Visual Studio Code has that snippet built in. To use it, type _log_ and hit Tab to autocomplete. More fully featured _console.log()_ snippet extensions can be found in the [marketplace](https://marketplace.visualstudio.com/search?term=console.log&target=VSCode&category=All%20categories&sortBy=Relevance).-->
使用`console.log()`调试你的代码是如此常见，以至于Visual Studio Code已经内置了该片段。要使用它，请键入`log`并按Tab键自动完成。更加功能强大的`console.log()`片段扩展可以在[应用市场](https://marketplace.visualstudio.com/search?term=console.log&target=VSCode&category=All%20categories&sortBy=Relevance)中找到。

### JavaScript Arrays

<!-- From here on out, we will be using the functional programming operators of the JavaScript [array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array), such as _find_, _filter_, and _map_ - all of the time.-->
从这里开始，我们将一直使用JavaScript [数组](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)的函数式编程操作符，如_find_、_filter_和_map_ - 一直都是这样。

<!-- If operating arrays with functional operators feels foreign to you, it is worth watching at least the first three parts of the YouTube video series [Functional Programming in JavaScript](https://www.youtube.com/playlist?list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84):-->
如果用函数式操作符操作数组对你来说感觉陌生，值得至少观看YouTube视频系列[Functional Programming in JavaScript](https://www.youtube.com/playlist?list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84)的前三部分：

<!-- - [Higher-order functions](https://www.youtube.com/watch?v=BMUiFMZr7vk&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84)-->

- [高阶函数](https://www.youtube.com/watch?v=BMUiFMZr7vk&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84)
<!-- - [Map](https://www.youtube.com/watch?v=bCqtb-Z5YGQ&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84&index=2)-->

- [Map](https://www.youtube.com/watch?v=bCqtb-Z5YGQ&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84&index=2)
  <!-- - [Reduce basics](https://www.youtube.com/watch?v=Wl98eZpkp-c&t=31s)-->
- [Reduce基础](https://www.youtube.com/watch?v=Wl98eZpkp-c&t=31s)

### Event Handlers Revisited

<!-- Based on last year's course, event handling has proved to be difficult.-->
根据去年的课程，事件处理被证明是一个难点。

<!-- It's worth reading the revision chapter at the end of the previous part - [event handlers revisited](/en/part1/a_more_complex_state_debugging_react_apps#event-handling-revisited) - if it feels like your own knowledge on the topic needs some brushing up.-->
如果感觉自己对这个主题的知识需要一些更新，建议阅读前一章节的结尾处的修订章节 - [事件处理复习](/en/part1/a_more_complex_state_debugging_react_apps#event-handling-revisited)。

<!-- Passing event handlers to the child components of the <i>App</i> component has raised some questions. A small revision on the topic can be found [here](/en/part1/a_more_complex_state_debugging_react_apps#passing-event-handlers-to-child-components).-->
传递事件处理程序给<i>App</i>组件的子组件引发了一些问题。 关于该主题的小修订可以在[这里](/en/part1/a_more_complex_state_debugging_react_apps#passing-event-handlers-to-child-components)找到。

### Rendering Collections

<!-- We will now do the 'frontend', or the browser-side application logic, in React for an application that's similar to the example application from [part 0](/en/part0)-->
我们现在要用React来做'前端'，或者浏览器端应用程序逻辑，这个应用程序类似于[第0章节](/en/part0)中的示例应用程序。

<!-- Let's start with the following (the file <i>App.js</i>):-->

让我们从如下代码开始（文件<i>App.js</i>）：

```js
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

export default App
```

<!-- The file <i>index.js</i> looks like this:-->
<i>index.js</i> 看起来像这样：

```js
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

const notes = [
  {
    id: 1,
    content: 'HTML is easy',
    important: true
  },
  {
    id: 2,
    content: 'Browser can execute only JavaScript',
    important: false
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    important: true
  }
]

ReactDOM.createRoot(document.getElementById('root')).render(
  <App notes={notes} />
)
```

<!-- Every note contains its textual content, a _boolean_ value for marking whether the note has been categorized as important or not, and also a unique <i>id</i>.-->
每一条笔记都包含它的文本内容，一个_布尔值_用于标记该笔记是否被分类为重要，以及一个唯一的<i>id</i>。

<!-- The example above works due to the fact that there are exactly three notes in the array.-->
上面的例子之所以有效是因为数组中有完整的三个笔记。

<!-- A single note is rendered by accessing the objects in the array by referring to a hard-coded index number:-->
通过引用硬编码的索引号来访问数组中的对象，就可以渲染出一个笔记：

```js
<li>{notes[1].content}</li>
```

<!-- This is, of course, not practical. We can improve on this by generating React elements from the array objects using the [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) function.-->
这当然不太实际。我们可以使用[map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)函数从数组对象中生成React元素来改善它。

```js
notes.map(note => <li>{note.content}</li>)
```

<!-- The result is an array of <i>li</i> elements.-->
结果是一个<i>li</i>元素数组。

```js
[
  <li>HTML is easy</li>,
  <li>Browser can execute only JavaScript</li>,
  <li>GET and POST are the most important methods of HTTP protocol</li>,
]
```

<!-- Which can then be placed inside <i>ul</i> tags:-->
<i>ul</i>标签里可以放置以下内容：

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

<!-- Because the code generating the <i>li</i> tags is JavaScript, it must be wrapped in curly braces in a JSX template just like all other JavaScript code.-->
因为生成<i>li</i>标签的代码是JavaScript，它必须像其他所有JavaScript代码一样，用大括号包裹在JSX模板中。

<!-- Parannetaan koodin luetteloa vielä jakamalla nuolifunktion määrittely useammalle riville: -->
<!-- We will also make the code more readable by separating the arrow function's declaration across multiple lines:-->
我们还可以通过将箭头函数的声明拆分到多行来使代码更易读：

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

<!-- Even though the application seems to be working, there is a nasty warning in the console:-->
尽管应用似乎工作良好，但控制台中有一个讨厌的警告：

![unique key prop console error](../../images/2/1a.png)

<!-- As the linked [React page](https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key) in the error message suggests; the list items, i.e. the elements generated by the _map_ method, must each have a unique key value:  an attribute called <i>key</i>.-->
正如错误消息中链接的[React页面](https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key)所建议的；列表项，即_map_方法生成的元素，必须每个都有一个唯一的键值：一个叫做<i>key</i>的属性。

<!-- Let's add the keys:-->
让我们添加key：

```js
const App = (props) => {
  const { notes } = props

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note =>
          <li key={note.id}> // highlight-line
            {note.content}
          </li>
        )}
      </ul>
    </div>
  )
}
```

<!-- And the error message disappears.-->
而错误消息消失了。

<!-- React uses the key attributes of objects in an array to determine how to update the view generated by a component when the component is re-rendered. More about this is in the [React documentation](https://react.dev/learn/preserving-and-resetting-state#option-2-resetting-state-with-a-key).-->
React 使用数组中对象的关键属性来确定在重新渲染组件时如何更新组件生成的视图。更多关于此的信息可以在[React 文档](https://react.dev/learn/preserving-and-resetting-state#option-2-resetting-state-with-a-key)中找到。

### Map

<!-- Understanding how the array method [`map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) works is crucial for the rest of the course.-->
理解数组方法[`map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)的工作方式对于课程的其余部分至关重要。

<!-- The application contains an array called _notes_:-->
应用程序包含一个叫做_notes_的数组：

```js
const notes = [
  {
    id: 1,
    content: 'HTML is easy',
    important: true
  },
  {
    id: 2,
    content: 'Browser can execute only JavaScript',
    important: false
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    important: true
  }
]
```

<!-- Let's pause for a moment and examine how _map_ works.-->
让我们暂停一会儿，看看_map_是如何工作的。

<!-- If the following code is added to, let's say, the end of the file:-->
如果把以下代码添加到，比如说，文件末尾：

```js
const result = notes.map(note => note.id)
console.log(result)
```

<i>[1, 2, 3]</i>  will be printed to the console.

控制台中会打印<i>[1, 2, 3]</i>  

<!--  _map_ always creates a new array, the elements of which have been created from the elements of the original array by <i>mapping</i>: using the function given as a parameter to the _map_ method.-->
_map_ 总是创建一个新的数组，其元素是通过 _map_ 方法的参数给出的函数从原始数组的元素<i>映射</i>而来的。

<!-- The function is to **provide an easy way** to **manage information**-->

函数**提供一种简便的方式来管理信息**

```js
note => note.id
```

<!-- Which is an arrow function written in compact form. The full form would be: `const add = (a, b) => { return a + b; }`-->

也就是利用箭头函数来包装表单，表单的完整形式为：`const add = (a, b) => a + b`;

```js
(note) => {
  return note.id
}
```

<!-- The function gets a note object as a parameter and <i>returns</i> the value of its <i>id</i> field.-->
函数接受一个note对象作为参数，并<i>返回</i>其<i>id</i>字段的值。

<!-- Changing the command to:-->
改变命令为：

```js
const result = notes.map(note => note.content)
```

<!-- results in an array containing the contents of the notes.-->
结果是一个包含笔记内容的数组。

<!-- This is already pretty close to the React code we used:-->
这已经非常接近我们使用的React代码：

```js
notes.map(note =>
  <li key={note.id}>
    {note.content}
  </li>
)
```

<!-- which generates a <i>li</i> tag containing the contents of the note from each note object.-->
生成一个包含每个笔记对象中笔记内容的<i>li</i>标签。

<!-- Because the function parameter passed to the _map_ method `lambda x: x * 2` - is a lambda expression, it is sometimes referred to as an anonymous function. --->

因为传递给_map_方法的函数参数 - `lambda x: x * 2` - 是一个lambda表达式，它有时被称为匿名函数。

```js
note => <li key={note.id}>{note.content}</li>
```

<!-- &nbsp;- is used to create view elements, the value of the variable must be rendered inside curly braces. Try to see what happens if the braces are removed.-->
&nbsp;- 用于创建视图元素，变量的值必须放在大括号内渲染。尝试看看如果去掉大括号会发生什么。

<!-- The use of curly braces will cause some pain in the beginning, but you will get used to them soon enough. The visual feedback from React is immediate.-->
使用大括号会在开始时造成一些痛苦，但你很快就会习惯它们。React 提供的可视反馈是即时的。

### Anti-pattern: Array Indexes as Keys

<!-- We could have made the error message on our console disappear by using the array indexes as keys. The indexes can be retrieved by passing a second parameter to the callback function of the _map_ method:-->
我们可以通过使用阵列索引作为键，使控制台上的错误讯息消失。可以通过将第二个参数传递给_map_方法的回调函数来获取索引。

```js
notes.map((note, i) => ...)
```

<!-- When called like this, _i_ is assigned the value of the index of the position in the array where the note resides.-->
当以这种方式调用时，_i_ 被赋予数组中指定元素的索引值。

<!-- As such, one way to define the row generation without getting errors is:-->
因此，一种定义行生成而不出错的方法是：

```js
<ul>
  {notes.map((note, i) =>
    <li key={i}>
      {note.content}
    </li>
  )}
</ul>
```

<!-- This is, however, **not recommended** and can create undesired problems even if it seems to be working just fine.-->
不建议这么做，即使看起来一切正常，也可能带来不必要的问题。

<!-- Read more about this in [this article](https://robinpokorny.medium.com/index-as-a-key-is-an-anti-pattern-e0349aece318).-->
阅读更多关于此的文章，请参阅[此文章](https://robinpokorny.medium.com/index-as-a-key-is-an-anti-pattern-e0349aece318)。

### Refactoring Modules

<!-- Let's tidy the code up a bit. We are only interested in the field _notes_ of the props, so let's retrieve that directly using [destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment):-->
让我们整理一下代码吧。我们只对props的_notes_字段感兴趣，所以让我们直接使用[解构](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)来检索它：

```js
const App = ({ notes }) => { //highlight-line
  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note =>
          <li key={note.id}>
            {note.content}
          </li>
        )}
      </ul>
    </div>
  )
}
```

<!-- If you have forgotten what destructuring means and how it works, please review the [section on destructuring](/en/part1/component_state_event_handlers#destructuring).-->
如果您忘记了什么是解构以及它是如何工作的，请查看[解构部分](/en/part1/component_state_event_handlers#destructuring)。

<!-- We''ll separate displaying a single note into its own component <i>Note</i>:-->
我们将单个笔记的显示分离到它自己的组件<i>笔记</i>中：

```js
// highlight-start
const Note = ({ note }) => {
  return (
    <li>{note.content}</li>
  )
}
// highlight-end

const App = ({ notes }) => {
  return (
    <div>
      <h1>Notes</h1>
      <ul>
        // highlight-start
        {notes.map(note =>
          <Note key={note.id} note={note} />
        )}
         // highlight-end
      </ul>
    </div>
  )
}
```

<!-- Note that the <i>key</i> attribute must now be defined for the <i>Note</i> components, and not for the <i>li</i> tags like before.-->
注意，现在必须为<i>Note</i>组件定义<i>key</i>属性，而不再像以前那样为<i>li</i>标签定义。

<!-- A whole React application can be written in a single file. Although that is, of course, not very practical. Common practice is to declare each component in its own file as an <i>ES6-module</i>.-->
一个完整的React应用程序可以写在一个文件中。当然，这并不是很实用。通常的做法是将每个组件声明在其自己的文件中作为<i>ES6模块</i>。

<!-- We have been using modules the whole time. The first few lines of the file <i>index.js</i>:-->
我们一直在使用模组。<i>index.js</i>文件的前几行：

```js
import ReactDOM from "react-dom/client"

import App from "./App"
```

<!-- [import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) two modules, enabling them to be used in that file. The module <i>react-dom/client</i> into the variable _ReactDOM_, and the module that defines the main component of the app is placed into the variable _App_-->
[导入](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/import)两个模块，使其可以在该文件中使用。将模块<i>react-dom/client</i>导入变量_ReactDOM_中，将定义应用程序主组件的模块导入变量_App_中。

<!-- Let's move our <i>Note</i> component into its own module.-->
让我们把我们的<i>笔记</i>组件移动到它自己的模块中。

<!-- In smaller applications, components are usually placed in a directory called <i>components</i>, which is in turn placed within the <i>src</i> directory. The convention is to name the file after the component.-->
在较小的应用程式中，组件通常放置在一个叫做<i>components</i>的目录中，而该目录又放置在<i>src</i>目录中。习惯是将文件命名为该组件的名称。

<!-- Now, we''ll create a directory called <i>components</i> for our application and place a file named <i>Note.js</i> inside.-->
现在，我们为我们的应用程序创建一个名为<i>components</i>的目录，并在其中放置一个名为<i>Note.js</i>的文件。
<!-- The contents of the Note.js file are as follows:-->

Note.js文件的内容如下：

```js
const Note = ({ note }) => {
  return (
    <li>{note.content}</li>
  )
}

export default Note
```

<!-- The last line of the module [exports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) the declared module, the variable <i>Note</i>.-->
最后一行模块[exports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export)声明的模块变量<i>Note</i>。

<!-- Now the file that is using the component - <i>App.js</i> - can [import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) the module:-->
现在正在使用组件的文件 - <i>App.js</i> - 可以[导入](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) 该模块：

```js
import Note from './components/Note' // highlight-line

const App = ({ notes }) => {
  // ...
}
```

<!-- The component exported by the module is now available for use in the variable <i>Note</i>, just as it was earlier.-->
模块导出的组件现在可以通过变量<i>Note</i>使用，就像以前一样。

<!-- Note that when importing our own components, their location must be given <i>in relation to the importing file</i>:-->
注意，当导入我们自己的组件时，它们的位置必须<i>相对于导入文件</i>给出：

```js
'./components/Note'
```

<!-- The period - <i>.</i> - in the beginning refers to the current directory, so the module's location is a file called <i>Note.js</i> in the <i>components</i> sub-directory of the current directory. The filename extension _.js_ can be omitted.-->
<i>.</i> 开头的符号指的是当前目录，因此模块的位置是当前目录的<i>components</i>子目录中的一个叫做<i>Note.js</i>的文件。可以省略文件名的扩展名 _.js_ 。

<!-- Modules have plenty of other uses other than enabling component declarations to be separated into their own files. We will get back to them later in this course.-->
模块除了使组件声明可以被分离到自己的文件中之外，还有许多其他用途。我们将在本课程的后面再次回到它们。

<!-- The current code of the application can be found on [GitHub](https://github.com/fullstack-hy2020/part2-notes/tree/part2-1).-->
当前应用程序的代码可以在[GitHub](https://github.com/fullstack-hy2020/part2-notes/tree/part2-1)上找到。

<!-- Note that the <i>main</i> branch of the repository contains the code for a later version of the application. The current code is in the branch [part2-1](https://github.com/fullstack-hy2020/part2-notes/tree/part2-1):-->
注意，存储库的<i>主</i>分支包含应用程序的后续版本的代码。当前代码位于分支[part2-1](https://github.com/fullstack-hy2020/part2-notes/tree/part2-1)中：

![GitHub branch screenshot](../../images/2/2e.png)

<!-- If you clone the project, run the command _npm install_ before starting the application with _npm start_.-->
如果你克隆了这个项目，在用 _npm start_ 启动应用之前，先运行 _npm install_ 命令。

### When the Application Breaks

<!-- Early in your programming career (and even after 30 years of coding like yours truly), what often happens is that the application just completely breaks down. This is even more so the case with dynamically typed languages, such as JavaScript, where the compiler does not check the data type. For instance, function variables or return values.-->
早在你的编程生涯初期（即使是像您这样编程30年的人），经常发生的情况是应用程序完全崩溃。 对于动态类型的语言（例如JavaScript），编译器不检查数据类型，情况更加严重。 例如，函数变量或返回值。

<!-- A "React explosion" can, for example, look like this:-->
一个“React 应用崩溃”可以看起来像这样：

![react sample error](../../images/2/3b.png)

<!-- In these situations, your best way out is the <em>console.log</em> method.-->
在这些情况下，最好的办法是使用<em>console.log</em>方法。

<!-- The piece of code causing the explosion is this:-->
这段引发爆炸的代码是：

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

<!-- We'll hone in on the reason for the breakdown by adding <em>console.log</em> commands to the code. Because the first thing to be rendered is the <i>App</i> component, it's worth putting the first <em>console.log</em> there:-->
我们将通过添加<em>console.log</em>命令来精确定位故障原因。因为最先被渲染的是<i>App</i>组件，因此在那里放置第一个<em>console.log</em>是值得的：

```js
const App = () => {
  const course = {
    // ...
  }

  console.log('App works...') // highlight-line

  return (
    // ..
  )
}
```

<!-- To see the printing in the console, we must scroll up over the long red wall of errors.-->
要看到控制台中的打印信息，我们必须滚动长长的红色错误墙。

![initial printing of the console](../../images/2/4b.png)

<!-- When one thing is found to be working, it's time to log deeper. If the component has been declared as a single statement or a function without a return, it makes printing to the console harder.-->
当第一个打印发现可以正常工作时，就是时候深入打印日志了。如果组件已被声明为单个语句或没有返回值的函数，就会使打印到控制台变得更难。

```js
const Course = ({ course }) => (
  <div>
    <Header course={course} />
  </div>
)
```

<!-- The component should be changed to its longer form for us to add the printing:-->
该组件应该改变为其较长的形式，以便我们添加打印：

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

<!-- Quite often the root of the problem is that the props are expected to be of a different type, or called with a different name than they actually are, and destructuring fails as a result. The problem often begins to solve itself when destructuring is removed and we see what the <em>props</em> contain.-->
通常问题的根源是预期的props类型与实际类型不同，或者用不同的名称调用，从而导致解构失败。当移除解构并查看<em>props</em>内容时，问题往往就开始解决了。

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

<!-- If the problem has still not been resolved, sadly there isn''t much to do apart from continuing to bug-hunt by sprinkling more _console.log_ statements around your code.-->
如果问题仍未得到解决，除了继续在你的代码中撒满 _console.log_ 语句以便进行 bug 搜索，别无他法。

<!-- I added this chapter to the material after the model answer for the next question exploded completely (due to props being of the wrong type), and I had to debug it using <em>console.log</em>.-->

我在模型答案对下一个问题完全崩溃（因为props的类型错误）之后，把这一章节添加到材料中，并且我不得不使用<em>console.log</em>来调试它。

### Web developer's oath

<!-- Before the exercises, let me remind what you promised at the end of the previous part.-->
在练习之前，让我提醒一下你在上一章节结束时所做的承诺。

<!-- Programming is hard, that is why I will use all the possible means to make it easier-->

- 编程很难，这就是为什么我会用一切可能的手段来让它变得更容易。

<!-- - I will have my browser developer console open all the time-->

- 我会一直开著浏览器开发者控制台。
  <!-- - I progress with small steps-->
- 我一步一步地进步。
  <!-- - I will write lots of _console.log_ statements to make sure I understand how the code behaves and to help pinpointing problems-->
- 我会写很多`console.log`语句来确保我理解代码的行为，并帮助确定问题。
  <!-- - If my code does not work, I will not write more code. Instead, I start deleting the code until it works or just return to a state when everything still was still working-->
- 如果我的代码不起作用，我不会再编写更多的代码。相反，我开始删除代码，直到它可以工作，或者只是返回到一个一切仍然正常的状态。
  <!-- - When I ask for help in the course Discord or Telegram channel or elsewhere I formulate my questions properly, see [here](/en/part0/general_info#how-to-get-help-in-discord-telegram) how to ask for help-->
- 当我在课程 Discord 或 Telegram 频道或其他地方寻求帮助时，我会正确地提出问题，请参见[此处](/en/part0/general_info#how-to-get-help-in-discord-telegram)如何寻求帮助。

</div>

<div class="tasks">

<h3>Exercises 2.1.-2.5.</h3>

<!-- The exercises are submitted via GitHub, and by marking the exercises as done in the [submission system](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).-->
通过GitHub提交练习，并在[提交系统](https://studies.cs.helsinki.fi/stats/courses/fullstackopen)中将练习标记为已完成。

<!-- You can submit all of the exercises into the same repository, or use multiple different repositories. If you submit exercises from different parts into the same repository, name your directories well.-->
你可以把所有的练习提交到同一个仓库中，或者使用多个不同的仓库。如果你把不同部分的练习提交到同一个仓库中，请把目录命名得当。

<!-- The exercises are submitted **One part at a time**. When you have submitted the exercises for a part, you can no longer submit any missed exercises for that part.-->
**一次提交一部分练习**。当你提交了一部分的练习后，你不能再提交那部分的任何错过的练习了。

<!-- Note that this part has more exercises than the ones before, so <i>do not submit</i> until you have done all exercises from this part you want to submit.-->
注意，这部分的练习比之前的练习要多，因此<i>不要提交</i>，除非你已经完成了你想要提交的所有练习。

<!-- **WARNING** create-react-app makes the project automatically into a git repository if the project is not created inside of an already existing repository. You probably **do not** want the project to become a repository, so run the command _rm -rf .git_ from its root.-->
**警告**：如果项目不是在已有的存储库中创建的，create-react-app会自动将项目转换为git存储库。您可能**不想**将项目转换为存储库，因此从其根目录运行命令_rm -rf .git_。

<h4>2.1: Course information step6</h4>

<!-- Let's finish the code for rendering course contents from exercises 1.1 - 1.5. You can start with the code from the model answers. The model answers for part 1 can be found by going to the [submission system](https://studies.cs.helsinki.fi/stats/courses/fullstackopen), clicking on <i>my submissions</i> at the top, and in the row corresponding to part 1 under the <i>solutions</i> column clicking on <i>show</i>. To see the solution to the <i>course info</i> exercise, click on _index.js_ under <i>kurssitiedot</i> ("kurssitiedot" means "course info").-->
让我们完成从练习1.1 - 1.5渲染课程内容的代码。您可以从模型答案开始。可以通过访问[提交系统](https://studies.cs.helsinki.fi/stats/courses/fullstackopen)，点击顶部的<i>我的提交</i>，在<i>解答</i>列中对应于第1章节的行上点击<i>显示</i>来找到第1章节的模型答案。要查看<i>课程信息</i>练习的解决方案，请在<i>kurssitiedot</i>（“kurssitiedot”的意思是“课程信息”）下点击_index.js_。


<!-- **Note that if you copy a project from one place to another, you might have to delete the <i>node\_modules</i> directory and install the dependencies again with the command _npm install_ before you can start the application.**-->
**注意，如果你将一个项目从一个地方复制到另一个地方，你可能需要删除<i>node\_modules</i>目录，然后使用命令_npm install_安装依赖项，然后才能启动应用程序。**
<!-- Generally, it's not recommended that you copy a project's whole contents and/or add the <i>node\_modules</i> directory to the version control system.-->
一般来说，不建议您复制项目的所有内容并/或将<i>node\_modules</i>目录添加到版本控制系统中。

<!-- Let's change the <i>App</i> component like so:-->
让我们更改<i>App</i> 组件如下：

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

  return <Course course={course} />
}

export default App
```

<!-- Define a component responsible for formatting a single course called <i>Course</i>.-->
定义一个负责格式化单个课程 <i>Course</i> 的组件。

<!-- The component structure of the application can be, for example, the following:-->
程序的组件结构可以是，例如，下面的：

<pre>
App
  Course
    Header
    Content
      Part
      Part
      ...
</pre>

<!-- Hence, the <i>Course</i> component contains the components defined in the previous part, which are responsible for rendering the course name and its parts.-->
因此，<i>课程</i>组件包含前面部分定义的组件，它们负责渲染课程名称及其部分。

<!-- The rendered page can, for example, look as follows:-->
渲染页面可以例如如下所示：

![half stack application screenshot](../../images/teht/8e.png)

<!-- You don''t need the sum of the exercises yet.-->
你还不需要练习的总和。

<!-- The application must work <i>regardless of the number of parts a course has</i>, so make sure the application works if you add or remove parts of a course.-->
应用程序必须<i>无论课程有多少部分</i>都能正常工作，因此，请确保应用程序在添加或删除课程部分时仍能正常工作。

<!-- Ensure that the console shows no errors!-->
确保控制台没有显示任何错误！

<h4>2.2: Course information step7</h4>

<!-- Show also the sum of the exercises of the course.-->
也展示课程练习的总和。

![sum of exercises added feature](../../images/teht/9e.png)

<h4>2.3*: Course information step8</h4>

<!-- If you haven''t done so already, calculate the sum of exercises with the array method [reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce).-->
如果你还没有这样做，请使用[reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)数组方法计算练习的总和。

<!-- **Pro tip:** when your code looks as follows:-->
**提示：** 当你的代码如下时：

```js
const total =
  parts.reduce((s, p) => someMagicHere)
```

<!-- and does not work, it's worth it to use <i>console.log</i>, which requires the arrow function to be written in its longer form:-->
如果箭头函数不起作用，值得使用<i>console.log</i>，它需要把箭头函数写成它的较长形式：

```js
const total = parts.reduce((s, p) => {
  console.log('what is happening', s, p)
  return someMagicHere
})
```

<!-- **Not working? :** Use your search engine to look up how `reduce` is used in an **Object Array**.-->
**没有工作？：** 使用您的搜索引擎查找如何在**对象数组**中使用`reduce`。

<!-- **Pro tip 2:** There is a [plugin for VS Code](https://marketplace.visualstudio.com/items?itemName=cmstead.js-codeformer) that automatically changes the short-form arrow functions into their longer form and vice versa.-->
**提示2：**有一个[VS Code的插件](https://marketplace.visualstudio.com/items?itemName=cmstead.js-codeformer)可以自动将箭头函数的简短形式更改为它们的长形式，反之亦然。

![vscode sample suggestion for arrow function](../../images/2/5b.png)

<h4>2.4: Course information step9</h4>

<!-- Let's extend our application to allow for an <i>arbitrary number</i> of courses:-->
让我们扩展我们的应用程序，以允许<i>任意数量</i>的课程：

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

<!-- The application can, for example, look like this:-->
应用程序可以看起来像这样：

![arbitrary number of courses feature add-on](../../images/teht/10e.png)

<h4>2.5: separate module</h4>

<!-- Declare the <i>Course</i> component as a separate module, which is imported by the <i>App</i> component. You can include all subcomponents of the course in the same module.-->
声明<i>Course</i>组件为一个单独的模块，由<i>App</i>组件导入。你可以将课程的所有子组件都放在同一个模块中。

</div>
