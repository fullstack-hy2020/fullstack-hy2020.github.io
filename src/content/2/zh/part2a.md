---
mainImage: ../../../images/part-2.svg
part: 2
letter: a
lang: zh
---

<div class="content">
<!-- Before starting a new part, let's recap some of the topics that proved difficult last year.-->
在开始新的部分之前，让我们回顾一下去年显示出的一些难点。

### console.log

<!-- ***What's the difference between an experienced JavaScript programmer and a rookie? The experienced one uses console.log 10-100 times more.***-->
***一个有经验的JavaScript程序员和一个菜鸟之间有什么区别？有经验的老鸟使用console.log的次数要多10~100倍***。

<!-- Paradoxically, this seems to be true even though a rookie programmer would need <i>console.log</i> (or any debugging method) more than an experienced one.-->
矛盾的是，看样子确实如此，即便一个菜鸟程序员应该比一个有经验的程序员更需要<i>console.log</i>（或任何调试方法）。

<!-- When something does not work, don't just guess what's wrong. Instead, log or use some other way of debugging.-->
当某些东西运行不了时，不要只是猜哪里错了。而要记录或使用其他一些调试方法。

<!-- **NB** As explained in part 1, when you use the command _console.log_ for debugging, don't concatenate things 'the Java way' with a plus. Instead of writing:-->
**注意** 正如第1章节所说的，当你使用_console.log_命令进行调试时，不要用“Java式”的加号来连接要打印的东西。不要写：

```js
console.log('props value is' + props)
```

<!-- separate the things to be printed with a comma:-->
而要用逗号分开要打印的东西：

```js
console.log('props value is', props)
```

<!-- If you concatenate an object with a string and log it to the console (like in our first example), the result will be pretty useless:-->
如果你把一个对象和一个字符串用加号连接起来并记录到控制台（比如我们的第一个例子），结果将完全无用：

```js
props value is [Object object]
```

<!-- On the contrary, when you pass objects as distinct arguments separated by commas to _console.log_, like in our second example above, the content of the object is printed to the developer console as strings that are insightful.-->
相反，如果你把对象用逗号分开，作为不同的参数传递给_console.log_，比如我们上面的第二个例子，对象的内容会被打印到开发者控制台，成为可检查的字符串。
<!-- If necessary, read more about [debugging React applications](/en/part1/a_more_complex_state_debugging_react_apps#debugging-react-applications). -->
必要时，请阅读更多关于[调试React应用](/zh/part1/复杂状态，调试_react应用#调试-react应用)的内容。

<!-- ### Protip: Visual Studio Code snippets -->
### 专业提示：Visual Studio Code代码片段

<!-- With Visual Studio Code it's easy to create 'snippets', i.e., shortcuts for quickly generating commonly re-used portions of code, much like how 'sout' works in Netbeans.-->
Visual Studio Code里可以很方便地创建“Snippets”（代码片段），即快速生成常用的重复使用的代码片段，很像Netbeans中的“sout”。

<!-- Instructions for creating snippets can be found [here](https://code.visualstudio.com/docs/editor/userdefinedsnippets#_creating-your-own-snippets).-->
创建代码片段的方法可以看[这里](https://code.visualstudio.com/docs/editor/userdefinedsnippets#_creating-your-own-snippets)。

<!-- Useful, ready-made snippets can also be found as VS Code plugins, in the [marketplace](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets).-->
有用的、现成的代码片段也可以在[VS Code应用商店](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets)里作为VS Code插件找到。

<!-- The most important snippet is the one for the <em>console.log()</em> command, for example, <em>clog</em>. This can be created like so:-->
最重要的代码片段是用于<em>console.log()</em>命令的片段，比如用<em>clog</em>。它可以这么创建：

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

<!-- Debugging your code using _console.log()_ is so common that Visual Studio Code has that snippet built in. To use it, type _log_ and hit tab to autocomplete. More fully featured _console.log()_ snippet extensions can be found in the [marketplace](https://marketplace.visualstudio.com/search?term=console.log&target=VSCode&category=All%20categories&sortBy=Relevance).-->
使用_console.log()_来调试你的代码非常常见，因此Visual Studio Code内置了这个代码片段。要使用它，输入_log_并按tab来自动完成。在[VS Code应用商店](https://marketplace.visualstudio.com/search?term=console.log&target=VSCode&category=All%20categories&sortBy=Relevance)中可以找到为_console.log()_代码片段提供更多功能的的扩展。

<!-- ### JavaScript Arrays -->
### JavaScript数组

<!-- From here on out, we will be using the functional programming operators of the JavaScript [array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array), such as _find_, _filter_, and _map_ - all of the time. -->
从现在开始，我们将一直使用JavaScript[数组](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)的函数式编程方法，例如_find_、_filter_和_map_。

<!-- If operating arrays with functional operators feels foreign to you, it is worth watching at least the first three parts of the YouTube video series [Functional Programming in JavaScript](https://www.youtube.com/playlist?list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84): -->
如果你对用函数式编程操作数组感到陌生，那么值得看看YouTube视频系列[Functional Programming in JavaScript](https://www.youtube.com/playlist?list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84)的至少前三部分。

- [Higher-order functions](https://www.youtube.com/watch?v=BMUiFMZr7vk&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84)
- [Map](https://www.youtube.com/watch?v=bCqtb-Z5YGQ&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84&index=2)
- [Reduce basics](https://www.youtube.com/watch?v=Wl98eZpkp-c&t=31s)

<!-- ### Event Handlers Revisited -->
### 重提事件处理函数

<!-- Based on last year's course, event handling has proved to be difficult.-->
去年的课程显示事件处理有些难度。

<!-- It's worth reading the revision chapter at the end of the previous part [event handlers revisited](/en/part1/a_more_complex_state_debugging_react_apps#event-handling-revisited), if it feels like your own knowledge on the topic needs some brushing up.-->
如果你想复习一下这个主题的知识的话，那么值得读一读上一章节最后的复习章节[重提事件处理函数](/zh/part1/复杂状态，调试_react应用#重提事件处理函数)。

<!-- Passing event handlers to the child components of the <i>App</i> component has raised some questions. A small revision on the topic can be found [here](/en/part1/a_more_complex_state_debugging_react_apps#passing-event-handlers-to-child-components).-->
还有一些问题是关于将事件处理程序传递给<i>App</i>组件的子组件的。关于这个话题的小复习可以参考[这里](/zh/part1/复杂状态，调试_react应用#向子组件传递事件处理函数)。

<!-- ### Rendering Collections -->
### 渲染集合

<!-- Now, we will build the frontend, or the user interface (the part users see in their browser), using React, similar to the example application from [part 0](/en/part0). -->
现在我们将用React做一个类似[第0章节](/zh/part0)中示例程序的前端，或者叫用户界面（用户在浏览器中所看到的部分）。

<!-- Let's start with the following (the file <i>App.jsx</i>): -->
让我们从下面开始（文件<i>App.jsx</i>）：

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

<!-- The file <i>main.jsx</i> looks like this: -->
文件<i>main.jsx</i>如下所示：

```js
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

<!-- Every note contains its textual content, a _boolean_ value for marking whether the note has been categorized as important or not, and also a unique <i>id</i>. -->
每条笔记都包含它的文本内容、一个_布尔_值来标记该笔记是否重要，还有一个独一无二的<i>id</i>。

<!-- The example above works due to the fact that there are exactly three notes in the array.-->
上面的例子之所以有效，是因为数组中正好有三条笔记。

<!-- A single note is rendered by accessing the objects in the array by referring to a hard-coded index number:-->
每条笔记是通过硬编码索引号访问数组中的对象来渲染的。

```js
<li>{notes[1].content}</li>
```

<!-- This is, of course, not practical. We can improve on this by generating React elements from the array objects using the [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) function.-->
这当然不切实际。我们可以通过使用[map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)函数从数组对象生成React元素来改进这一点。

```js
notes.map(note => <li>{note.content}</li>)
```

<!-- The result is an array of <i>li</i> elements.-->
结果是一个<i>li</i>元素的数组。

```js
[
  <li>HTML is easy</li>,
  <li>Browser can execute only JavaScript</li>,
  <li>GET and POST are the most important methods of HTTP protocol</li>,
]
```


<!-- Which can then be placed inside <i>ul</i> tags:-->
然后可以将其放在<i>ul</i>标签内：

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
因为生成<i>li</i>标签的代码是JavaScript，必须将其包裹在JSX模板的大括号内，和其他所有JavaScript代码一样。

<!-- We will also make the code more readable by separating the arrow function's declaration across multiple lines:-->
我们再将箭头函数的声明分成多行来使代码更易读：

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

<!-- ### Key-attribute -->
### key属性

<!-- Even though the application seems to be working, there is a nasty warning in the console:-->
尽管应用似乎能运行，但控制台有一个讨厌的警告：

![](../../images/2/1a.png)

<!-- As the linked [React page](https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key) in the error message suggests; the list items, i.e. the elements generated by the _map_ method, must each have a unique key value: an attribute called <i>key</i>. -->
正如错误信息中链接的[React页面](https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key)所提示的；列表项，也就是_map_方法生成的元素，必须都有一个独一无二的键：一个叫做<i>key</i>的属性。

<!-- Let's add the keys:-->
让我们来添加键：

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
然后错误信息就消失了。

<!-- React uses the key attributes of objects in an array to determine how to update the view generated by a component when the component is re-rendered. More about this is in the [React documentation](https://react.dev/learn/preserving-and-resetting-state#option-2-resetting-state-with-a-key). -->
React使用数组中对象的key属性来决定如何在组件重新渲染时更新该组件生成的视图。更多内容可以查看[React文档](https://react.dev/learn/preserving-and-resetting-state#option-2-resetting-state-with-a-key)。

<!-- ### Map -->
### map

<!-- Understanding how the array method [`map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) works is crucial for the rest of the course. -->
了解数组的[`map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)方法是如何工作的，对剩下的课程至关重要。

<!-- The application contains an array called _notes_:-->
应用包含一个名为_notes_的数组：

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
让我们停下来研究一下_map_是如何工作的。


<!-- If the following code is added to, let's say, the end of the file:-->
如果下列代码被添加到比方说文件结尾的地方：

```js
const result = notes.map(note => note.id)
console.log(result)
```

<!-- <i>[1, 2, 3]</i>  will be printed to the console. -->
<i>[1, 2, 3]</i>会被打印到控制台。
<!--  _map_ always creates a new array, the elements of which have been created from the elements of the original array by <i>mapping</i>: using the function given as a parameter to the _map_ method.-->
_map_总是创建一个新数组，其中的元素是通过原数组的元素<i>映射（mapping）</i>创建的：使用_map_方法参数的函数。

<!-- The function is-->
而这个函数就是

```js
note => note.id
```

<!-- Which is an arrow function written in compact form. The full form would be:-->
这是一个紧凑形式的箭头函数。完整的形式应该是：

```js
(note) => {
  return note.id
}
```

<!-- The function gets a note object as a parameter, and <i>returns</i> the value of its <i>id</i> field.-->
该函数以一个笔记对象作为参数，并<i>返回</i>其<i>id</i>字段的值。

<!-- Changing the command to:-->
把命令改成:

```js
const result = notes.map(note => note.content)
```

<!-- will give you an array containing the contents of the notes. -->
会得到一个包含笔记内容的数组。

<!-- This is already pretty close to the React code we used:-->
这已经非常接近我们使用的React代码了：

```js
notes.map(note =>
  <li key={note.id}>
    {note.content}
  </li>
)
```

<!-- which generates an <i>li</i> tag containing the contents of the note from each note object.-->
它生成每个笔记对象的<i>li</i>标签，包含每个笔记对象的内容。

<!-- Because the function parameter passed to the _map_ method --->

因为传递给_map_方法的函数参数——

```js
note => <li key={note.id}>{note.content}</li>
```

<!-- &nbsp;- is used to create view elements, the value of the variable must be rendered inside curly braces. Try to see what happens if the braces are removed.-->
&nbsp;——是用来创建视图元素的，变量的值必须在大括号内渲染。试试如果去掉大括号会发生什么。

<!-- The use of curly braces will cause some pain in the beginning, but you will get used to them soon enough. The visual feedback from React is immediate.-->
使用大括号一开始会比较痛苦，但你很快就会习惯。React的视觉反馈是即时的。

<!-- ### Anti-pattern: Array Indexes as Keys -->
### 禁止事项：使用数组索引作为键

<!-- We could have made the error message on our console disappear by using the array indexes as keys. The indexes can be retrieved by passing a second parameter to the callback function of the _map_ method:-->
要使控制台中的错误信息消失，我们还可以通过使用数组索引作为键的方式。索引可以通过向_map_方法的回调函数传递第二个参数获取：

```js
notes.map((note, i) => ...)
```

<!-- When called like this, _i_ is assigned the value of the index of the position in the array where the note resides.-->
当像这样调用时，_i_会被赋值笔记在数组中所在位置的索引值。

<!-- As such, one way to define the row generation without getting errors is:-->
因此，这么定义生成的各行也不会出错：

```js
<ul>
  {notes.map((note, i) =>
    <li key={i}>
      {note.content}
    </li>
  )}
</ul>
```

<!-- This is, however, **not recommended** and can create undesired problems even if it seems to be working just fine. -->
然而，**不建议这么做**，这会产生意想不到的问题，即使它看起来运行得很好。

<!-- Read more about this in [this article](https://robinpokorny.com/blog/index-as-a-key-is-an-anti-pattern/). -->
阅读[这篇文章](https://robinpokorny.com/blog/index-as-a-key-is-an-anti-pattern/)了解更多。

<!-- ### Refactoring Modules -->
### 重构模块

<!-- Let's tidy the code up a bit. We are only interested in the field _notes_ of the props, so let's retrieve that directly using [destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment):-->
让我们把代码整理一下。我们只关心props的_notes_字段，所以让我们直接使用[解构](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)来获取它：

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
如果你忘记了解构是什么意思以及它是如何工作的，请复习一下[解构部分](/zh/part1/组件状态，事件处理/#解构)。

<!-- We'll separate displaying a single note into its own component <i>Note</i>:-->
我们将显示一条笔记的功能分离到它自己的组件<i>Note</i>：

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
注意现在<i>Note</i>组件必须定义<i>key</i>属性，而不是像之前的<i>li</i>标签那样可定义可不定义。

<!-- A whole React application can be written in a single file. Although that is, of course, not very practical. Common practice is to declare each component in their own file as an <i>ES6-module</i>.-->
可以将整个React应用写在一个文件中。虽然这当然不切实际。通常的做法是将每个组件在自己的文件中声明为<i>ES6模块</i>。

<!-- We have been using modules the whole time. The first few lines of the file <i>main.jsx</i>: -->
我们实际上一直都在使用模块。文件<i>main.jsx</i>的前几行：

```js
import ReactDOM from "react-dom/client"
import App from "./App"
```

<!-- [import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) two modules, enabling them to be used in that file. The module <i>react-dom/client</i> is placed into the variable _ReactDOM_, and the module that defines the main component of the app is placed into the variable _App_ -->
[导入（import）](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)了两个模块来在该文件中使用。模块<i>react-dom/client</i>被放入变量_ReactDOM_，而定义应用主要组件的模块被放入变量_App_。

<!-- Let's move our <i>Note</i> component into its own module.-->
让我们把我们的<i>Note</i>组件移到它自己的模块中。

<!-- In smaller applications, components are usually placed in a directory called <i>components</i>, which is in turn placed within the <i>src</i> directory. The convention is to name the file after the component.-->
在小型应用中，组件通常被放在<i>src</i>目录中的一个叫做<i>components</i>的目录中。一般用组件的名字来命名文件。

<!-- Now, we'll create a directory called <i>components</i> for our application and place a file named <i>Note.jsx</i> inside. The contents of the file are as follows: -->
现在，我们将为我们的应用创建一个名为<i>components</i>的目录，并在其中放置一个名为<i>Note.jsx</i>的文件。文件的内容如下：

```js
const Note = ({ note }) => {
  return <li>{note.content}</li>
}

export default Note
```

<!-- The last line of the module [exports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) the declared module, the variable <i>Note</i>.-->
模块的最后一行[导出（export）](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export)了声明的模块，即变量<i>Note</i>。

<!-- Now the file that is using the component - <i>App.jsx</i> - can [import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) the module: -->
现在使用该组件的文件——<i>App.jsx</i>——就可以[导入（import）](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) 该模块了：

```js
import Note from './components/Note' // highlight-line

const App = ({ notes }) => {
  // ...
}
```

<!-- The component exported by the module is now available for use in the variable <i>Note</i>, just as it was earlier.-->
模块导出的组件现在通过变量<i>Note</i>使用，就像之前那样。

<!-- Note that when importing our own components, their location must be given <i>in relation to the importing file</i>:-->
注意，当导入我们自己的组件时，必须给出它们<i>与导入文件的相对</i>位置：

```js
'./components/Note'
```

<!-- The period - <i>.</i> - in the beginning refers to the current directory, so the module's location is a file called <i>Note.jsx</i> in the <i>components</i> sub-directory of the current directory. The filename extension _.jsx_ can be omitted. -->
开头的点号——<i>.</i>——指的是当前目录，所以模块的位置是当前目录下<i>components</i>子目录中叫<i>Note.jsx</i>的文件。文件扩展名_.jsx_可以省略。

<!-- Modules have plenty of other uses other than enabling component declarations to be separated into their own files. We will get back to them later in this course.-->
除了使组件声明分离到自己的文件中，模块还有很多其他的用途。我们将在本课程的后面再学习它们。

<!-- The current code of the application can be found on [GitHub](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part2-1). -->
该应用当前的代码可以在[GitHub](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part2-1)上找到。

<!-- Note that the <i>main</i> branch of the repository contains the code for a later version of the application. The current code is in the branch [part2-1](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part2-1): -->
注意，仓库的<i>main</i>分支包含了应用后期版本的代码。目前的代码在分支[part2-1](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part2-1)中：

![](../../images/2/2e.png)

<!-- If you clone the project, run the command _npm install_ before starting the application with _npm run dev_.-->
如果你克隆了这个项目，先运行命令_npm install_，然后再用_npm run dev_启动应用。

<!-- ### When the Application Breaks -->
### 当应用崩溃时

<!-- Early in your programming career (and even after 30 years of coding like yours truly), what often happens is that the application just completely breaks down. This is even more the case with dynamically typed languages, such as JavaScript, where the compiler does not check the data type. For instance, function variables or return values.-->
在你编程生涯的早期（甚至像我这样编程了30年的人也会遇到），应用程序经常会彻底崩溃。对于动态类型语言，比如JavaScript，编译器不会检查数据类型，例如函数变量或返回值的类型，那么应用完全崩溃的情况就更常见了。

<!-- A "React explosion" can, for example, look like this:-->
例如，“React崩了”可能会像这样：

![](../../images/2/3b.png)

<!-- In these situations your best way out is the <em>console.log</em> method.-->
在这些情况下，你最好的解决办法是使用<em>console.log</em>方法。

<!-- The piece of code causing the explosion is this:-->
引起崩溃的那段代码是这样的：

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
我们将通过在代码中添加<em>console.log</em>命令来深入探究崩溃的原因。因为首先要渲染的是<i>App</i>组件，所以值得在那儿放第一个<em>console.log</em>：

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
要看到控制台中的打印内容，我们必须在满屏红色的错误信息中向上滚动鼠标。

![](../../images/2/4b.png)

<!-- When one thing is found to be working, it's time to log deeper. If the component has been declared as a single statement, or a function without a return, it makes printing to the console harder.-->
当发现日志是有效的，就该深入打日志了。如果组件被声明为单个语句，或者是一个没有_return_的函数，就会使打印到控制台的难度增加。

```js
const Course = ({ course }) => (
  <div>
    <Header course={course} />
  </div>
)
```

<!-- The component should be changed to its longer form in order for us to add the printing:-->
我们应该把组件改为较长的形式来增加打印语句：

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

<!-- Quite often the root of the problem is that the props are expected to be of a different type, or called with a different name than they actually are, and destructuring fails as a result. The problem often begins to solve itself when destructuring is removed and we see what the <em>props</em> actually contains.-->
问题的根源往往是props被期望为不同的类型，或者被用与实际不同的名字调用，然后结果就是解构失败。当去掉解构，我们看到<em>props</em>实际包含的内容时，问题往往会开始自行解决。

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

<!-- If the problem has still not been resolved, there really isn't much to do apart from continuing to bug-hunt by sprinkling more _console.log_ statements around your code.-->
如果问题仍然没有解决，除了继续通过在你的代码周围撒上更多的_console.log_语句来寻找错误之外，真的没有什么可做的。

<!-- I added this chapter to the material after the model answer for the next question exploded completely (due to props being of the wrong type), and I had to debug it using <em>console.log</em>.-->
之所以把这一章加入教材，是因为在下个问题的标准答案完全崩溃了（由于props的类型不对），然后我不得不用<em>console.log</em>来调试它。

<!-- ### Web developer's oath -->
### web开发者誓言

<!-- Before the exercises, let me remind what you promised at the end of the previous part. -->
在开始练习之前，让我提醒一下上一章节结尾你所保证过的。

<!-- Programming is hard, that is why I will use all the possible means to make it easier -->
编程不易，因此我要通过一切方法让它变得容易

<!-- - I will have my browser developer console open all the time -->
- 我会始终打开我的浏览器开发者控制台
<!-- - I progress with small steps -->
- 我小步前进
<!-- - I will write lots of _console.log_ statements to make sure I understand how the code behaves and to help pinpointing problems -->
- 我会写大量的_console.log_语句来确保我理解代码是怎么运行的，并借此准确找到问题
<!-- - If my code does not work, I will not write more code. Instead I will start deleting the code until it works or just return to a state when everything was still working -->
- 如果我的代码出问题了，我不会写更多的代码。而是删除代码直到它能运行，或者直接回到之前代码能运行的状态
<!-- - When I ask for help in the course Discord channel or elsewhere I formulate my questions properly, see [here](http://fullstackopen.com/en/part0/general_info#how-to-get-help-in-discord) how to ask for help -->
- 当我在课程的Discord群或者其他地方寻求帮助时，我会准确表达我的问题，点[此](http://fullstackopen.com/en/part0/general_info#how-to-get-help-in-discord)了解如何寻求帮助。

</div>

<div class="tasks">

<!-- <h3>Exercises 2.1.-2.5.</h3> -->
<h3>练习 2.1~2.5.</h3>

<!-- The exercises are submitted via GitHub, and by marking the exercises as done in the [submission system](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).-->
练习通过GitHub上交，并在[上交系统](https://studies.cs.helsinki.fi/stats/courses/fullstackopen)中标记已完成的练习。

<!-- You can submit all of the exercises into the same repository, or use multiple different repositories. If you submit exercises from different parts into the same repository, name your directories well.-->
你可以将本课程的所有练习上交到同一个仓库，也可以使用多个仓库。如果你将不同章节的练习上交到同一个仓库，命名好你的目录。

<!-- The exercises are submitted **One part at a time**. When you have submitted the exercises for a part, you can no longer submit any missed exercises for that part.-->
练习是**一次上交一个章节**的。当你上交了一个章节的练习，你就不能再上交该章节任何遗漏的练习了。

<!-- Note that this part has more exercises than the ones before, so <i>do not submit</i> before you have done all exercises from this part you want to submit.-->
注意这一章节的练习比之前的要多，所以在你做完这一章节你想上交的所有练习之前，<i>不要上交</i>练习。

<!-- <h4>2.1: Course information step 6</h4> -->
<h4>2.1：课程信息 第6步</h4>

<!-- Let's finish the code for rendering course contents from exercises 1.1 - 1.5. You can start with the code from the model answers. The model answers for part 1 can be found by going to the [submission system](https://studies.cs.helsinki.fi/stats/courses/fullstackopen), clicking on <i>my submissions</i> at the top, and in the row corresponding to part 1 under the <i>solutions</i> column clicking on <i>show</i>. To see the solution to the <i>course info</i> exercise, click on _App.jsx_ under <i>courseinfo</i>. -->
让我们完成练习1.1~1.5中渲染课程内容的代码。你可以从标准答案的代码开始。第1章节的标准答案可以在[上交系统](https://studies.cs.helsinki.fi/stats/courses/fullstackopen)中找到，点击顶部的<i>my submissions</i>，在<i>solutions</i>栏下对应第1章节的行中点击<i>show</i>。要看<i>课程信息</i>练习的解决方案，请点击<i>courseinfo</i>下的_App.jsx_。

<!-- **Note that if you copy a project from one place to another, you might have to delete the <i>node\_modules</i> directory and install the dependencies again with the command _npm install_ before you can start the application.**-->
**注意，如果你把一个项目从一个地方复制到另一个地方，你可能要删除<i>node\_modules</i>目录，并在启动应用之前用_npm install_命令重新安装依赖。**

<!-- Generally, it's not recommended that you copy a project's whole contents and/or add the <i>node\_modules</i> directory to the version control system.-->
一般来说，不建议复制一个项目的全部内容和/或将<i>node\_modules</i>目录添加到版本控制系统中。

<!-- Let's change the <i>App</i> component like so:-->
让我们这么改变<i>App</i>组件：

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
定义一个负责格式化单个课程的组件，称为<i>Course</i>。

<!-- The component structure of the application can be, for example, the following:-->
应用的组件结构可以类似这样：

```
App
  Course
    Header
    Content
      Part
      Part
      ...
```

<!-- Hence, the <i>Course</i> component contains the components defined in the previous part, which are responsible for rendering the course name and its parts.-->
因此，<i>Course</i>组件包含前一章节中定义过的组件，也就是负责渲染课程名称及其各部分的组件。

<!-- The rendered page can, for example, look as follows:-->
渲染的页面可以类似这样：

![](../../images/teht/8e.png)

<!-- You don't need the sum of the exercises yet.-->
你还不需要计算练习的总和。

<!-- The application must work <i>regardless of the number of parts a course has</i>, so make sure the application works if you add or remove parts of a course.-->
<i>无论课程有多少部分</i>，应用都必须能运行，所以确保如果你增加或删除课程的各部分，应用依然能够运行。

<!-- Ensure that the console shows no errors!-->
确保控制台没有显示任何错误！

<!-- <h4>2.2: Course information step 7</h4> -->
<h4>2.2：课程信息 第7步</h4>

<!-- Show also the sum of the exercises of the course.-->
同时显示课程练习的总和。

![](../../images/teht/9e.png)

<!-- <h4>2.3*: Course information step 8</h4> -->
<h4>2.3*：课程信息 第8步</h4>

<!-- If you haven't done so already, calculate the sum of exercises with the array method [reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce).-->
使用数组方法[reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)来计算练习的总和。如果你已经这么做了的话，那就跳过。

<!-- **Pro tip:** when your code looks as follows:-->
**专业提示：**当你的代码看起来如下：

```js
const total =
  parts.reduce((s, p) => someMagicHere)
```

<!-- and does not work, it's worth to use <i>console.log</i>, which requires the arrow function to be written in its longer form:-->
但运行不了，值得使用<i>console.log</i>，这要求箭头函数以较长的形式写出来。

```js
const total = parts.reduce((s, p) => {
  console.log('what is happening', s, p)
  return someMagicHere
})
```

<!-- **Not working? :** Use your search engine to look up how _reduce_ is used in an **Object Array**. -->
**还运行不了吗？：**用你的搜索引擎查找_reduce_在**对象数组**中应该怎么用。

<!-- <h4>2.4: Course information step 9</h4> -->
<h4>2.4：课程信息 第9步</h4>

<!-- Let's extend our application to allow for an <i>arbitrary number</i> of courses:-->
让我们扩展我们的应用以允许<i>任意数量的</i>课程：

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
这个应用可以类似这样：

![](../../images/teht/10e.png)

<!-- <h4>2.5: Separate module step 10</h4> -->
<h4>2.5：分离模块 第10步</h4>

<!-- Declare the <i>Course</i> component as a separate module, which is imported by the <i>App</i> component. You can include all subcomponents of the course into the same module.-->
将<i>Course</i>组件声明为一个单独的模块，然后再在<i>App</i>组件中导入。你可以将课程的所有子组件放在同一模块。

</div>
